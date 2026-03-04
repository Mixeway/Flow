import json
import logging
from pydantic import BaseModel
from typing import Dict, Any, Optional, Type, TypeVar

logger = logging.getLogger(__name__)
T = TypeVar('T', bound=BaseModel)

def parse_llm_json(llm_output: str, context: str = "") -> Optional[Dict[str, Any]]:
    """
    Parse JSON output from LLM with error handling and logging.
    Handles common cases like JSON wrapped in ```json code blocks.
    
    Args:
        llm_output: Raw string output from LLM
        context: Context string for error logging
        
    Returns:
        Parsed JSON dictionary or None if parsing fails
    """

    logger.info(f"Trying to parse for context: {context} - {llm_output}")

    if not llm_output or not llm_output.strip():
        logger.warning(f"Empty LLM output for context: {context}")
        return None
        
    llm_output = llm_output.strip()
    
    # Handle JSON wrapped in code blocks
    if llm_output.startswith('```json') and llm_output.endswith('```'):
        llm_output = llm_output[7:-3].strip()  # Remove ```json and closing ```
    elif llm_output.startswith('```') and llm_output.endswith('```'):
        llm_output = llm_output[3:-3].strip()  # Remove generic ``` blocks
    
    try:
        parsed = json.loads(llm_output)
        logger.debug(f"Successfully parsed LLM JSON for context: {context}")
        return parsed
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM JSON for context '{context}': {e}")
        logger.error(f"Raw output: {llm_output[:500]}...")
        return None


def ask_llm_for_structured_data_stream(
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
