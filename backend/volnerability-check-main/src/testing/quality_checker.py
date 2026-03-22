import logging
from typing import List, Dict, Any

from tenacity import retry, stop_after_attempt, wait_random_exponential

from ..analysis.prompts import LangfusePrompt
from ..core.client import client
from ..core.config import settings
from ..core.models import (
    VulnerabilityInput,
    VulnerabilitySynthesisResult,
    QualityAssessmentResult,
    BatchQualityDistribution,
    BatchQualityAssessmentResult,
)
from ..utils.llm import ask_llm_for_structured_data, create_llm_fallback

logger = logging.getLogger(__name__)


@retry(
    wait=wait_random_exponential(min=1, max=60),
    stop=stop_after_attempt(3),
    retry_error_callback=create_llm_fallback(
        "QUALITY ASSESSMENT",
        lambda rs, e: QualityAssessmentResult.create_fallback(str(e))
    )
)
def assess_analysis_quality(vulnerability, result) -> QualityAssessmentResult:
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

    prompt_variables = {
        "vuln_name": vulnerability.name,
        "vuln_constraints": vulnerability.constraints,
        "ground_truth_summary": getattr(vulnerability, 'summary', 'N/A'),
        "ground_truth_probability": getattr(vulnerability, 'probability', 'N/A'),
        "ground_truth_exploitable": getattr(vulnerability, 'exploitable', 'N/A'),
        "result_status": result.status,
        "result_confidence": result.confidence,
        "result_probability": result.predicted_probability,
        "result_exploitable": result.predicted_exploitable,
        "result_summary": result.analysis_summary[:200] + "..." if len(result.analysis_summary) > 200 else result.analysis_summary,
        "result_detailed_reasoning_preview": result.detailed_reasoning[:200] + "..." if len(result.detailed_reasoning) > 200 else result.detailed_reasoning,
        "result_evidence_count": len(result.evidence_snippets),
        "result_mitigations_count": len(result.mitigations_detected),
        "full_analysis_summary": result.analysis_summary,
        "full_detailed_reasoning": result.detailed_reasoning,
        "evidence_snippets": evidence_snippets_text
    }

    result_obj = ask_llm_for_structured_data(
        client=client,
        model_name=settings.OPENAI_MODEL,
        prompt_name=LangfusePrompt.QUALITY_CHECKER.value,
        prompt_variables=prompt_variables,
        response_model=QualityAssessmentResult
    )

    logger.info("Quality assessment completed successfully")
    logger.info(f"Quality Score: {result_obj.quality_score}/5")

    return result_obj

def assess_batch_quality(
    vulnerabilities: List[VulnerabilityInput],
    results: List[VulnerabilitySynthesisResult]
) -> BatchQualityAssessmentResult:
    """Assess quality for a batch of vulnerability analysis results."""
    logger.info(f"STARTING BATCH QUALITY ASSESSMENT FOR {len(results)} RESULTS")

    assessments: List[QualityAssessmentResult] = []

    for vuln, result in zip(vulnerabilities, results):
        try:
            assessment = assess_analysis_quality(vuln, result)
            assessments.append(assessment)
        except Exception as e:
            logger.error(f"Failed to assess quality for {vuln.name}: {e}")
            fallback = QualityAssessmentResult.create_fallback(error_message=str(e))
            assessments.append(fallback)

    total = len(assessments)
    if total == 0:
        return BatchQualityAssessmentResult(
            average_quality_score=0.0,
            quality_distribution=BatchQualityDistribution(),
            individual_assessments=[],
            total_assessed=0
        ).model_dump()

    avg_score = sum(a.quality_score for a in assessments) / total

    dist = BatchQualityDistribution()
    for a in assessments:
        if a.quality_score == 5: dist.excellent += 1
        elif a.quality_score == 4: dist.good += 1
        elif a.quality_score == 3: dist.average += 1
        elif a.quality_score == 2: dist.below_average += 1
        elif a.quality_score == 1: dist.poor += 1

    batch_result = BatchQualityAssessmentResult(
        average_quality_score=round(avg_score, 2),
        quality_distribution=dist,
        individual_assessments=assessments,
        total_assessed=total
    )

    logger.info(f"Batch quality assessment completed")
    logger.info(f"Average quality score: {avg_score:.2f}/5")
    logger.info(f"Quality distribution: {dist.model_dump()}")

    return batch_result