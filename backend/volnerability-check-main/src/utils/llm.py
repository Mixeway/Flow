import logging
from pydantic import BaseModel
from typing import Type, TypeVar

logger = logging.getLogger(__name__)
T = TypeVar('T', bound=BaseModel)

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
