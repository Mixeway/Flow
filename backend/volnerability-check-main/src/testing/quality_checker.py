import logging
from typing import List, Dict, Any

from tenacity import retry, stop_after_attempt, wait_random_exponential

from ..analysis.prompts import QUALITY_CHECKER_SYSTEM_PROMPT, QUALITY_CHECKER_USER_PROMPT
from ..core.client import client
from ..core.config import settings
from ..core.models import (
    VulnerabilityInput,
    VulnerabilityResult,
    QualityAssessmentResult,
    BatchQualityDistribution,
    BatchQualityAssessmentResult,
)
from ..utils.llm import ask_llm_for_structured_data

logger = logging.getLogger(__name__)

def return_fallback_quality_assessment(retry_state) -> Dict[str, Any]:
    """Fallback triggered by Tenacity if the API fails 3 times."""
    logger.error("All retries failed for Quality Assessment.")
    e = retry_state.outcome.exception()
    logger.error(f"Reason: {type(e).__name__}: {str(e)}")

    return {
        "quality_score": 3,
        "accuracy_assessment": "Unable to assess due to quality checker failure",
        "completeness_assessment": "Unable to assess due to quality checker failure",
        "evidence_quality": "Unable to assess due to quality checker failure",
        "reasoning_quality": "Unable to assess due to quality checker failure",
        "consistency_check": "Unable to assess due to quality checker failure",
        "strengths": ["Quality assessment failed"],
        "weaknesses": ["Quality assessment failed"],
        "overall_feedback": "Quality assessment could not be completed due to technical issues"
    }

@retry(
    wait=wait_random_exponential(min=1, max=60),
    stop=stop_after_attempt(3),
    retry_error_callback=return_fallback_quality_assessment
)
def assess_analysis_quality(vulnerability, result) -> Dict[str, Any]:
    """Use LLM to assess the quality of a vulnerability analysis result."""
    logger.info("STARTING ANALYSIS QUALITY ASSESSMENT")
    logger.info(f"Assessing quality for vulnerability: {vulnerability.name}")

    evidence_text = []
    for i, snippet in enumerate(result.evidence_snippets, 1):
        snippet_file = getattr(snippet, 'file', 'Unknown')
        start_line = getattr(snippet, 'start_line', 0)
        end_line = getattr(snippet, 'end_line', 0)
        snippet_code = getattr(snippet, 'snippet', '')

        evidence_text.append(f"[{i}] File: {snippet_file}")
        evidence_text.append(f"    Lines: {start_line}-{end_line}")
        evidence_text.append(f"    Code: {snippet_code[:200]}...")

    evidence_snippets_text = "\n".join(evidence_text) if evidence_text else "No evidence snippets provided"

    user_prompt = QUALITY_CHECKER_USER_PROMPT.format(
        vuln_name=vulnerability.name,
        vuln_constraints=vulnerability.constraints,
        ground_truth_summary=getattr(vulnerability, 'summary', 'N/A'),
        ground_truth_probability=getattr(vulnerability, 'probability', 'N/A'),
        ground_truth_exploitable=getattr(vulnerability, 'exploitable', 'N/A'),
        result_status=result.status,
        result_confidence=result.confidence,
        result_probability=result.predicted_probability,
        result_exploitable=result.predicted_exploitable,
        result_summary=result.analysis_summary[:200] + "..." if len(result.analysis_summary) > 200 else result.analysis_summary,
        result_detailed_reasoning_preview=result.detailed_reasoning[:200] + "..." if len(result.detailed_reasoning) > 200 else result.detailed_reasoning,
        result_evidence_count=len(result.evidence_snippets),
        result_mitigations_count=len(result.mitigations_detected),
        full_analysis_summary=result.analysis_summary,
        full_detailed_reasoning=result.detailed_reasoning,
        evidence_snippets=evidence_snippets_text
    )

    result_obj = ask_llm_for_structured_data(
        client=client,
        model_name=settings.OPENAI_MODEL,
        system_prompt=QUALITY_CHECKER_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        response_model=QualityAssessmentResult
    )

    logger.info("Quality assessment completed successfully")
    logger.info(f"Quality Score: {result_obj.quality_score}/5")

    return result_obj.model_dump()

def assess_batch_quality(
    vulnerabilities: List[VulnerabilityInput],
    results: List[VulnerabilityResult]
) -> Dict[str, Any]:
    """Assess quality for a batch of vulnerability analysis results."""
    logger.info(f"STARTING BATCH QUALITY ASSESSMENT FOR {len(results)} RESULTS")

    quality_scores = []
    detailed_assessments = []
    
    for vuln, result in zip(vulnerabilities, results):
        try:
            assessment = assess_analysis_quality(vuln, result)
            quality_scores.append(assessment.get('quality_score', 3))
            detailed_assessments.append(assessment)
        except Exception as e:
            logger.error(f"Failed to assess quality for {vuln.name}: {e}")
            quality_scores.append(3)  # Default score
            detailed_assessments.append({
                "quality_score": 3,
                "overall_feedback": f"Assessment failed: {str(e)}"
            })

    total_assessed = len(quality_scores)
    avg_quality_score = sum(quality_scores) / total_assessed if total_assessed > 0 else 0

    distribution = BatchQualityDistribution(
        excellent=sum(1 for score in quality_scores if score == 5),
        good=sum(1 for score in quality_scores if score == 4),
        average=sum(1 for score in quality_scores if score == 3),
        below_average=sum(1 for score in quality_scores if score == 2),
        poor=sum(1 for score in quality_scores if score == 1)
    )

    batch_result = BatchQualityAssessmentResult(
        average_quality_score=avg_quality_score,
        quality_distribution=distribution,
        individual_assessments=detailed_assessments,
        total_assessed=total_assessed
    )

    logger.info(f"Batch quality assessment completed")
    logger.info(f"Average quality score: {avg_quality_score:.2f}/5")
    logger.info(f"Quality distribution: {batch_result.quality_distribution.model_dump()}")

    return batch_result.model_dump()