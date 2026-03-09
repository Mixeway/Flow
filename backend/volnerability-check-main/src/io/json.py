import json
from pathlib import Path
from typing import List


from ..core.models import VulnerabilitySynthesisResult


def write_results_to_json(results: List[VulnerabilitySynthesisResult], output_path: Path):
    """Writes analysis results to a JSON file."""
    if not results:
        return

    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Pydantic's model_dump can't directly handle serialization of all types to JSON
    # (like datetime), so we need a custom default converter.
    def json_converter(o):
        if hasattr(o, "isoformat"):
            return o.isoformat()
        raise TypeError(
            f"Object of type {o.__class__.__name__} is not JSON serializable"
        )

    with open(output_path, "w") as f:
        # We dump the list of dicts from the model_dump
        json.dump(
            [result.model_dump() for result in results],
            f,
            indent=2,
            default=json_converter,
        )
