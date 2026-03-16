import logging
from pydantic import BaseModel
from typing import Type, TypeVar, Callable, Any
from tenacity import RetryError
from openai import APITimeoutError, BadRequestError
from langfuse import observe, get_client

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

def _enforce_strict_schema(schema: dict) -> dict:
    """Recursively injects 'additionalProperties': False into the schema to satisfy OpenAI's strict mode."""
    if isinstance(schema, dict):

        if "$ref" in schema:
            keys_to_remove = [k for k in schema.keys() if k != "$ref"]
            for k in keys_to_remove:
                del schema[k]
            return schema

        if schema.get("type") == "object":
            schema["additionalProperties"] = False

        for key, value in schema.items():
            _enforce_strict_schema(value)

    elif isinstance(schema, list):
        for item in schema:
            _enforce_strict_schema(item)

    return schema

@observe(as_type="generation")
def ask_llm_for_structured_data(
        client,
        model_name: str,
        prompt_name: str,
        prompt_variables: dict,
        response_model: Type[T],
) -> T:
    """Universal function to get guaranteed structured data from an LLM by streaming."""

    langfuse = get_client()
    prompt = langfuse.get_prompt(prompt_name)
    compiled_messages = prompt.compile(**prompt_variables)

    schema = response_model.model_json_schema()
    strict_schema = _enforce_strict_schema(schema)

    kwargs = {
        "model": model_name,
        "messages": compiled_messages,
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": response_model.__name__,
                "schema": strict_schema,
                "strict": True
            }
        },
        "stream": True,
        "stream_options": {"include_usage": True}
    }

    is_restricted_model = (
        model_name.startswith(("o1", "o3")) or
        "search-preview" in model_name or
        "realtime" in model_name
    )

    if not is_restricted_model:
        kwargs["temperature"] = 0
        kwargs["seed"] = 42

    completion = client.chat.completions.create(**kwargs)

    chunks = []
    final_usage = None
    for chunk in completion:
        if chunk.choices and len(chunk.choices) > 0:
            content = chunk.choices[0].delta.content
            if content:
                chunks.append(content)
                logger.debug(f"Stream chunk: {content}")
        if hasattr(chunk, 'usage') and chunk.usage:
            final_usage = chunk.usage

    if final_usage:
        input_tokens = getattr(final_usage, 'prompt_tokens', 0)
        output_tokens = getattr(final_usage, 'completion_tokens', 0)
        total_tokens = getattr(final_usage, 'total_tokens', 0)

        if total_tokens > 0:
            langfuse.update_current_generation(
                model=model_name,
                prompt=prompt,
                usage_details={
                    "input": input_tokens,
                    "output": output_tokens,
                    "total": total_tokens
                }
            )

    raw_json = "".join(chunks).strip()
    return response_model.model_validate_json(raw_json)
