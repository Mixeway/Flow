import logging
from pydantic import BaseModel
from typing import Type, TypeVar, Callable, Any
from tenacity import RetryError
from openai import APITimeoutError, BadRequestError

logger = logging.getLogger(__name__)
T = TypeVar('T', bound=BaseModel)

def _log_llm_failure(e: Exception, llm_name: str):
    """Logging for LLM/API failures."""

    if isinstance(e, RetryError) and e.last_attempt and e.last_attempt.exception():
        e = e.last_attempt.exception()

    if isinstance(e, APITimeoutError):
        logger.error(f"⌛ TIMEOUT ERROR in {llm_name}: Request took too long. Input may be too large.")
    elif isinstance(e, BadRequestError) and any(msg in str(e).lower() for msg in ["tokens exceed", "context_length"]):
        logger.error(f"🛑 TOKEN LIMIT EXCEEDED in {llm_name}: Input exceeds context window.")
    else:
        logger.error(f"❌ {llm_name} failed due to: {type(e).__name__}: {str(e)}")

def create_llm_fallback(llm_name: str, fallback_builder: Callable[[Any, Exception], Any]):
    """
    Universal Factory for fallbacks.
    Automatically logs the error and delegates object creation to the specific model.
    """
    def fallback_handler(retry_state):
        e = retry_state.outcome.exception()

        _log_llm_failure(e, llm_name)

        return fallback_builder(retry_state, e)

    return fallback_handler

def ask_llm_for_structured_data(
        client,
        model_name: str,
        system_prompt: str,
        user_prompt: str,
        response_model: Type[T]
) -> T:
    """Universal function to get guaranteed structured data from an LLM by streaming."""

    schema = response_model.model_json_schema()

    completion = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": response_model.__name__,
                "schema": schema,
                "strict": True
            }
        },
        temperature=0,
        seed=42,
        stream=True,
    )

    chunks = []
    for chunk in completion:
        content = chunk.choices[0].delta.content
        if content:
            chunks.append(content)
            logger.debug(f"Stream chunk: {content}")

    raw_json = "".join(chunks).strip()
    return response_model.model_validate_json(raw_json)
