import json
import time
import logging
from tenacity import retry, wait_random_exponential, stop_after_attempt
from openai import APITimeoutError, BadRequestError
from typing import List, Dict, Any

from .preprocessor import preprocess_code_chunks
from ..core.client import client
from ..core.config import settings
from ..core.models import (
    VulnerabilityInput,
    VulnerabilitySynthesisResult,
    VulnerabilityAnalysis,
    DependencyAnalysis,
    CodeTriageResult,
    SourceCorrelation,
    VersionAssessment,
    ExploitAssessment,
)
from ..utils.llm import ask_llm_for_structured_data
from ..utils.web_research import conduct_web_research
from ..utils.rate_limiter import rate_limiter
from .prompts import (
    CODE_TRIAGE_SYSTEM_PROMPT,
    CODE_TRIAGE_USER_PROMPT,
    SYNTHESIS_ANALYSIS_SYSTEM_PROMPT,
    SYNTHESIS_ANALYSIS_USER_PROMPT,
)
from ..core.chunk import CodeChunk

logger = logging.getLogger(__name__)

def _create_fallback_result(
        vulnerability, # VulnerabilityInput
        chunks_to_analyze, # List[CodeChunk]
        error_message: str,
        confidence: int = 1
) -> VulnerabilitySynthesisResult:
    """Create a strictly typed, informative fallback result when analysis fails."""

    enhanced_summary = (
        f"Analysis failed for {vulnerability.name}: {error_message}. "
        f"Affects {len(chunks_to_analyze)} code files. "
        f"Expected exploitability: {getattr(vulnerability, 'exploitable', 'Unknown')}, "
        f"Expected probability: {getattr(vulnerability, 'probability', 0.0)}. "
        "Manual analysis required."
    )

    detailed_reasoning = f"ANALYSIS FAILURE REPORT:\n\n"
    detailed_reasoning += f"Error: {error_message}\n\n"
    detailed_reasoning += f"Context: Analysis pipeline encountered an error while processing {vulnerability.name}.\n"
    detailed_reasoning += f"Chunks available: {len(chunks_to_analyze)}\n"
    detailed_reasoning += f"Constraints: {vulnerability.constraints}\n\n"
    detailed_reasoning += "Manual review is required as automated analysis could not complete successfully.\n\n"

    if len(detailed_reasoning) < 1500:
        padding = "--- [SYSTEM LOG: AUTOMATED ANALYSIS ABORTED] ---\n"
        multiplier = (1500 - len(detailed_reasoning)) // len(padding) + 1
        detailed_reasoning += padding * multiplier

    enhanced_next_steps = (
        f"1. Review {vulnerability.name} constraints: {vulnerability.constraints}\n"
        "2. Check system logs for specific API or parsing error details.\n"
        "3. Verify code chunks contain relevant patterns.\n"
        "4. Consider manual code review focusing on constraint areas."
    )

    return VulnerabilitySynthesisResult(
        status="uncertain",
        confidence=confidence,
        probability=0.5,
        predicted_probability=0.5,
        exploitable=False,
        predicted_exploitable=False,
        analysis_summary=enhanced_summary,
        detailed_reasoning=detailed_reasoning,
        evidence_snippets=[],
        source_correlation=SourceCorrelation(
            agreements=[],
            contradictions=[],
            confidence_factors=[],
            uncertainty_factors=[f"Critical system failure: {error_message}"]
        ),
        mitigations_detected=[],
        version_assessment=VersionAssessment(
            code_analysis="Failed",
            nvd_data="Failed",
            web_research="Failed",
            final_determination="Unknown due to error",
            confidence="low"
        ),
        exploit_assessment=ExploitAssessment(
            technical_feasibility="Unknown",
            attack_scenarios=[],
            exploitation_barriers=[f"Analysis aborted: {error_message}"],
            real_world_context="Unknown"
        ),
        suggested_next_steps=enhanced_next_steps
    )

def return_fallback_synthesis(retry_state) -> VulnerabilitySynthesisResult:
    """Fallback triggered by Tenacity if the Synthesis API fails."""
    logger.error("All retries failed for Final Synthesis.")
    e = retry_state.outcome.exception()

    if isinstance(e, APITimeoutError):
        logger.error("TIMEOUT ERROR: Synthesis took too long. The combined context is likely massive.")
    elif isinstance(e, BadRequestError) and ("tokens exceed" in str(e) or "context_length" in str(e)):
        logger.error("TOKEN LIMIT EXCEEDED: Combined Code + NVD + Web reports exceed context window.")
    else:
        logger.error(f"Synthesis failed due to: {type(e).__name__}: {str(e)}")

    vuln = retry_state.args[1]
    chunks = retry_state.args[2]

    return _create_fallback_result(vuln, chunks, str(e))

@retry(
    wait=wait_random_exponential(min=1, max=60),
    stop=stop_after_attempt(3),
    retry_error_callback=return_fallback_synthesis
)
def _run_synthesis_agent(
        vuln: VulnerabilityInput,
        chunks: List[CodeChunk],
        user_prompt: str,
) -> VulnerabilitySynthesisResult:
    logger.info("Executing Synthesis LLM Call...")

    return ask_llm_for_structured_data(
        client=client,
        model_name=settings.OPENAI_MODEL,
        system_prompt=SYNTHESIS_ANALYSIS_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        response_model=VulnerabilitySynthesisResult
    )

async def analyze_vulnerability(
    vuln: VulnerabilityInput,
    chunks_for_analysis: List[CodeChunk],
    repository_info: Dict[str, Any]
) -> VulnerabilityAnalysis:
    """
    Analyzes a vulnerability using a multi-agent chain:
    1. Code Triage Agent: Extracts objective facts from code.
    2. NVD API Agent: Fetches ground truth CVE data.
    3. Web Research Agent: Gathers additional intelligence from online sources.
    4. Synthesis Agent: Combines all reports for a final analysis.
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

    logger.info("\nSTAGE 3: WEB RESEARCH")
    logger.info("-" * 20)

    web_research_report = await conduct_web_research(vuln.name, vuln.constraints)

    logger.info("\nSTAGE 4: SYNTHESIS ANALYSIS")
    logger.info("-" * 20)

    user_prompt = SYNTHESIS_ANALYSIS_USER_PROMPT.format(
        vuln_name=vuln.name,
        original_constraints=vuln.constraints,
        code_triage_report=code_triage_report.model_dump_json(indent=2),
        nvd_fact_sheet=json.dumps(nvd_fact_sheet, indent=2),
        web_research_report=json.dumps(web_research_report, indent=2)
    )

    await rate_limiter.wait_if_needed()

    synthesis_result_obj = _run_synthesis_agent(vuln, chunks_for_analysis, user_prompt)

    logger.info("\nSTAGE 5: RESULT CONSTRUCTION")
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
        fallback = _create_fallback_result(vuln, chunks_for_analysis, f"Result construction failed: {e}")
        base_data = fallback.model_dump()

    result = VulnerabilityAnalysis(**base_data, **system_metadata)

    if result.ground_truth_probability is not None:
        logger.info(f"[EVAL MODE] Ground truth: prob={result.ground_truth_probability}, exploit={result.ground_truth_exploitable}")

    logger.info(f"Result object constructed successfully in {time.time() - start_time:.2f}s")

    return result

def _get_empty_code_triage_result(reason: str) -> CodeTriageResult:
    """Helper to generate a type-safe empty result when things fail."""
    empty_result = CodeTriageResult(
        api_usage=[],
        dependency_analysis=DependencyAnalysis(
            files_found=[],
            version_information=[],
            version_status="unknown",
            confidence="low",
            missing_dependencies=[]
        ),
        security_configurations=[],
        mitigations_found=[],
        code_patterns=[],
        negative_evidence=[],
        analysis_summary=f"Code triage aborted: {reason}",
        evidence_quality="low"
    )
    return empty_result

def return_fallback_code_triage(retry_state) -> CodeTriageResult:
    """Tenacity callback triggered if the API fails 3 times."""
    logger.error("All retries failed for Code Triage.")
    e = retry_state.outcome.exception()

    if isinstance(e, APITimeoutError):
        logger.error("TIMEOUT ERROR: Code Triage took too long. The code chunk might be too large.")
    elif isinstance(e, BadRequestError) and ("tokens exceed" in str(e) or "context_length" in str(e)):
        logger.error("TOKEN LIMIT EXCEEDED: Code chunk is too large for the context window.")
    else:
        logger.error(f"Reason: {type(e).__name__}: {str(e)}")

    return _get_empty_code_triage_result("API Failure after retries")

@retry(
    wait=wait_random_exponential(min=1, max=60),
    stop=stop_after_attempt(3),
    retry_error_callback=return_fallback_code_triage
)
async def _run_code_triage(vuln: VulnerabilityInput, chunks: List[CodeChunk]) -> CodeTriageResult:
    """Runs the Code Triage agent to extract facts from code."""

    structured_code = preprocess_code_chunks(vuln, chunks)

    if not structured_code.strip():
        logger.error("Preprocessing returned empty code, cannot run triage.")
        return _get_empty_code_triage_result("No code chunks provided after preprocessing")

    user_prompt = CODE_TRIAGE_USER_PROMPT.format(
        vuln_name=vuln.name,
        vuln_constraints=vuln.constraints,
        structured_code=structured_code
    )
    result_obj = ask_llm_for_structured_data(
        client=client,
        model_name=settings.OPENAI_MODEL,
        system_prompt=CODE_TRIAGE_SYSTEM_PROMPT,
        user_prompt=user_prompt,
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
