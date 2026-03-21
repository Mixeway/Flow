import json
import time
import logging
from tenacity import retry, wait_random_exponential, stop_after_attempt
from typing import List, Dict, Any
from langfuse import observe

from .preprocessor import preprocess_code_chunks
from ..core.client import client
from ..core.config import settings
from ..core.models import (
    VulnerabilityInput,
    VulnerabilitySynthesisResult,
    VulnerabilityAnalysis,
    CodeTriageResult,
)
from ..utils.llm import ask_llm_for_structured_data, create_llm_fallback
from ..utils.rate_limiter import rate_limiter
from .prompts import LangfusePrompt
from ..core.chunk import CodeChunk

logger = logging.getLogger(__name__)

@retry(
    wait=wait_random_exponential(min=1, max=60),
    stop=stop_after_attempt(3),
    retry_error_callback=create_llm_fallback(
        "SYNTHESIS ANALYSIS",
        lambda rs, e: VulnerabilitySynthesisResult.create_fallback(
            rs.kwargs['chunks'] if 'chunks' in rs.kwargs else rs.args[1],
            rs.kwargs['code_triage_report'] if 'code_triage_report' in rs.kwargs else rs.args[2],
            str(e)
        )
    )
)
@observe(as_type="span", name="Synthesize Analysis")
def _run_synthesis_agent(
        vuln: VulnerabilityInput,
        chunks: List[CodeChunk],
        code_triage_report: CodeTriageResult,
        nvd_fact_sheet: dict,
) -> VulnerabilitySynthesisResult:
    logger.info(f"Executing Synthesis LLM Call... for {vuln.name}")

    prompt_variables = {
        "vuln_name": vuln.name,
        "original_constraints": vuln.constraints,
        "code_triage_report": code_triage_report.model_dump_json(indent=2),
        "nvd_fact_sheet": json.dumps(nvd_fact_sheet, indent=2),
    }

    return ask_llm_for_structured_data(
        client=client,
        model_name=settings.OPENAI_MODEL,
        prompt_name=LangfusePrompt.SYNTHESIS_ANALYSIS.value,
        prompt_variables=prompt_variables,
        response_model=VulnerabilitySynthesisResult
    )

@observe(as_type="span", name="Analyze Vulnerability")
async def analyze_vulnerability(
    vuln: VulnerabilityInput,
    chunks_for_analysis: List[CodeChunk],
    repository_info: Dict[str, Any]
) -> VulnerabilityAnalysis:
    """
    Analyzes a vulnerability using a multi-agent chain:
    1. Code Triage Agent: Extracts objective facts from code.
    2. NVD API Agent: Fetches ground truth CVE data.
    3. Synthesis Agent: Combines all reports for a final analysis.
    """
    start_time = time.time()
    
    logger.info("STAGE 1: CODE TRIAGE")
    logger.info("-" * 20)

    code_triage_report = await _run_code_triage(vuln, chunks_for_analysis)

    logger.info("\nSTAGE 2: NVD DATA PROCESSING")
    logger.info("-" * 20)
    
    if vuln.has_nvd_data:
        logger.info(f"Using pre-fetched NVD data for {vuln.name}")
        try:
            nvd_fact_sheet = json.loads(vuln.nvd_data)
            logger.info("NVD data successfully parsed from input")
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse NVD data JSON: {e}")
            nvd_fact_sheet = {
                "id": vuln.name,
                "description": "NVD data parsing failed.",
                "vulnerable_configurations": []
            }
    else:
        logger.warning(f"No NVD data provided for {vuln.name}. Proceeding without it.")
        nvd_fact_sheet = {
            "id": vuln.name,
            "description": "NVD data was not provided in input.",
            "vulnerable_configurations": []
        }

    logger.info("\nSTAGE 3: SYNTHESIS ANALYSIS")
    logger.info("-" * 20)

    await rate_limiter.wait_if_needed()

    synthesis_result_obj = _run_synthesis_agent(
        vuln=vuln,
        chunks=chunks_for_analysis,
        code_triage_report=code_triage_report,
        nvd_fact_sheet=nvd_fact_sheet,
    )

    logger.info("\nSTAGE 4: RESULT CONSTRUCTION")
    logger.info("-" * 20)

    system_metadata = {
        "vulnerability_id": vuln.name,
        "vulnerability_name": vuln.name,
        "files_analyzed": [str(chunk.file_path) for chunk in chunks_for_analysis],
        "ground_truth_probability": getattr(vuln, 'probability', None),
        "ground_truth_exploitable": getattr(vuln, 'exploitable', None)
    }

    try:
        synthesis_dict = synthesis_result_obj.model_dump()
        base_data = _validate_evidence_files(synthesis_dict, chunks_for_analysis)
    except Exception as e:
        logger.error(f"Failed to construct final result object: {e}")
        fallback = VulnerabilitySynthesisResult.create_fallback(vuln, chunks_for_analysis, f"Result construction failed: {e}")
        base_data = fallback.model_dump()

    result = VulnerabilityAnalysis(**base_data, **system_metadata)

    if result.ground_truth_probability is not None:
        logger.info(f"[EVAL MODE] Ground truth: prob={result.ground_truth_probability}, exploit={result.ground_truth_exploitable}")

    logger.info(f"Result object constructed successfully in {time.time() - start_time:.2f}s")

    return result

@retry(
    wait=wait_random_exponential(min=1, max=60),
    stop=stop_after_attempt(3),
    retry_error_callback=create_llm_fallback(
        "CODE TRIAGE",
        lambda rs, e: CodeTriageResult.create_fallback(f"API Failure after retries {e}")
    )
)
@observe(as_type="span", name="Code Triage")
async def _run_code_triage(vuln: VulnerabilityInput, chunks: List[CodeChunk]) -> CodeTriageResult:
    """Runs the Code Triage agent to extract facts from code."""

    structured_code = preprocess_code_chunks(vuln, chunks)

    if not structured_code.strip():
        logger.error("Preprocessing returned empty code, cannot run triage.")
        return CodeTriageResult.create_fallback("No code chunks provided after preprocessing")

    prompt_variables = {
        "vuln_name": vuln.name,
        "vuln_constraints": vuln.constraints,
        "structured_code": structured_code
    }

    result_obj = ask_llm_for_structured_data(
        client=client,
        model_name=settings.OPENAI_MODEL,
        prompt_name=LangfusePrompt.CODE_TRIAGE.value,
        prompt_variables=prompt_variables,
        response_model=CodeTriageResult
    )

    logger.info("Code triage completed successfully.")

    return result_obj

def _validate_evidence_files(result_dict: Dict[str, Any], chunks: List[CodeChunk]) -> Dict[str, Any]:
    """
        Acts as a strict circuit breaker against LLM hallucinations.
        Verifies that code evidence files cited by the Synthesis Agent actually exist.
        Heavily penalizes the final probability score if the LLM hallucinates paths.
        """
    valid_files = set()
    for c in chunks:
        full_path = str(c.file_path).replace("\\", "/")
        file_name = c.file_path.name
        valid_files.add(full_path)
        valid_files.add(file_name)

    valid_files.add("dependency_analysis")

    evidence = result_dict.get("evidence_snippets", [])
    if not evidence:
        return result_dict

    verified_evidence = []
    hallucinated_count = 0
    total_code_evidence = 0

    for item in evidence:
        source = item.get("source")
        file_cited = item.get("file")

        if source != "code_triage":
            verified_evidence.append(item)
            continue

        if not file_cited or str(file_cited).lower() in ["", "n/a", "na", "unknown", "none"]:
            logger.debug(f"Skipping empty code evidence file citation: '{file_cited}'")
            continue

        file_cited = str(file_cited).replace("\\", "/").strip()
        total_code_evidence += 1

        is_valid = any(
            file_cited == vf or
            vf.endswith(file_cited) or
            file_cited.endswith(vf)
            for vf in valid_files
        )

        if is_valid:
            verified_evidence.append(item)
        else:
            logger.warning(f"🚨 HALLUCINATION DETECTED: LLM cited non-existent file '{file_cited}'")
            hallucinated_count += 1

    result_dict["evidence_snippets"] = verified_evidence

    if total_code_evidence > 0 :
        hallucination_ratio = hallucinated_count / total_code_evidence

        if hallucinated_count == total_code_evidence:
            logger.error(f"CRITICAL HALLUCINATION: All {hallucinated_count} code snippets are fake. Nullifying analysis.")
            result_dict["probability"] = 0.01
            result_dict["predicted_probability"] = 0.01
            result_dict["exploitable"] = False
            result_dict["predicted_exploitable"] = False
            result_dict["status"] = "not_confirmed"

            original_summary = result_dict.get("analysis_summary", "")
            result_dict["analysis_summary"] = (
                f"[SYSTEM FLAGGED: COMPLETE HALLUCINATION] All code evidence citations "
                f"were non-existent files. Analysis unreliable. Score reset. "
                f"Original summary: {original_summary}"
            )
        
        elif hallucinated_count > 2 and hallucination_ratio > 0.5:
            logger.warning(f"HIGH HALLUCINATION: {hallucinated_count}/{total_code_evidence} snippets are fake ({hallucination_ratio:.0%}). Downgrading.")

            current_prob = result_dict.get("probability", 0.5)
            result_dict["probability"] = max(0.05, current_prob * 0.3)
            result_dict["predicted_probability"] = result_dict["probability"]

            original_summary = result_dict.get("analysis_summary", "")
            result_dict["analysis_summary"] = (
                f"[SYSTEM WARNING: PARTIAL HALLUCINATION] {hallucinated_count} of {total_code_evidence} "
                f"code citations were invalid. Confidence reduced. {original_summary}"
            )

        elif hallucinated_count > 0:
            logger.info(f"Removed {hallucinated_count} hallucinated snippet(s), kept {len(verified_evidence)} valid ones.")

            if len(verified_evidence) == 0:
                logger.warning("All evidence removed due to minor hallucinations. Marking as uncertain.")
                result_dict["probability"] = 0.10
                result_dict["predicted_probability"] = 0.10
                result_dict["status"] = "uncertain"

    return result_dict
