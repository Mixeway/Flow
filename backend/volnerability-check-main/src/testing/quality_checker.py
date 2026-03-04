import json
import logging
from typing import List, Dict, Any
import time

from tenacity import retry, stop_after_attempt, wait_random_exponential, RetryError
from openai import BadRequestError, APITimeoutError

from ..core.client import client
from ..core.config import settings
from ..core.models import VulnerabilityInput, VulnerabilityResult

logger = logging.getLogger(__name__)

QUALITY_CHECKER_SYSTEM_PROMPT = """
You are an expert vulnerability analysis quality assessor. Your role is to evaluate the quality of vulnerability analysis results by comparing the input vulnerability specification with the analysis output.

**Your Task:**
Assess how well the analysis result matches the input vulnerability specification. Consider:

1. **Accuracy:** Does the analysis correctly identify or rule out the vulnerability?
2. **Completeness:** Does the analysis address all aspects mentioned in the constraints?
3. **Evidence Quality:** Are the provided evidence snippets relevant and convincing?
4. **Reasoning:** Is the analysis summary logical and well-reasoned?
5. **Consistency:** Are the status, probability, and exploitability assessments consistent?

**Quality Score Guidelines (1-5):**
- **1 (Poor):** Major errors, missed key aspects, illogical reasoning, inconsistent assessments
- **2 (Below Average):** Some errors or omissions, weak evidence, partially inconsistent
- **3 (Average):** Generally correct but may miss some nuances, adequate evidence and reasoning
- **4 (Good):** Accurate analysis, good evidence, clear reasoning, minor issues only
- **5 (Excellent):** Comprehensive, accurate, well-evidenced, perfectly reasoned analysis

**Output Format:**
Return a JSON object with this structure:
```json
{
  "quality_score": <1-5>,
  "accuracy_assessment": "<assessment of how accurate the analysis is>",
  "completeness_assessment": "<assessment of how complete the analysis is>",
  "evidence_quality": "<assessment of the evidence provided>",
  "reasoning_quality": "<assessment of the analysis reasoning>",
  "consistency_check": "<assessment of internal consistency>",
  "strengths": ["<list of analysis strengths>"],
  "weaknesses": ["<list of analysis weaknesses>"],
  "overall_feedback": "<comprehensive feedback on the analysis quality>"
}
```
"""

QUALITY_CHECKER_USER_PROMPT = """
**Quality Assessment Request**

**Input Vulnerability Specification:**
- **Name:** {vuln_name}
- **Constraints:** {vuln_constraints}
- **Ground Truth Summary:** {ground_truth_summary}
- **Ground Truth Probability:** {ground_truth_probability}
- **Ground Truth Exploitability:** {ground_truth_exploitable}

**Analysis Result to Evaluate:**
- **Status:** {result_status}
- **Confidence:** {result_confidence}/5
- **Predicted Probability:** {result_probability}
- **Predicted Exploitability:** {result_exploitable}
- **Analysis Summary:** {result_summary}
- **Detailed Reasoning:** {result_detailed_reasoning_preview}
- **Evidence Snippets:** {result_evidence_count} provided
- **Mitigations Detected:** {result_mitigations_count} detected

**Full Analysis Summary:**
{full_analysis_summary}

**Full Detailed Reasoning:**
{full_detailed_reasoning}

**Evidence Snippets:**
{evidence_snippets}

**Your Task:**
Evaluate the quality of this vulnerability analysis result. Compare the analysis output against:
1. The vulnerability constraints (what the analysis should have looked for)
2. The ground truth information (expected outcomes)
3. Internal consistency of the analysis

Focus on whether the analysis correctly interpreted the vulnerability constraints and provided appropriate evidence and reasoning.

Provide your quality assessment in the specified JSON format.
"""


@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(3))
def run_quality_assessment(prompt: str) -> dict:
    """Runs the quality assessment prompt through the OpenAI API."""
    logger.info("RUNNING QUALITY ASSESSMENT LLM")
    logger.info("=" * 50)
    
    # Log prompt details
    prompt_length = len(prompt)
    logger.info(f"Quality assessment prompt length: {prompt_length:,} characters")
    
    # Log the full prompt for debugging
    logger.info("FULL QUALITY ASSESSMENT PROMPT:")
    logger.info("-" * 40)
    logger.info(f"System: {QUALITY_CHECKER_SYSTEM_PROMPT[:200]}...")
    logger.info(f"User prompt length: {len(prompt)} characters")
    if len(prompt) <= 2000:
        logger.info(f"User: {prompt}")
    else:
        logger.info(f"User: {prompt[:1000]}\n... [TRUNCATED] ...\n{prompt[-1000:]}")
    logger.info("-" * 40)
    
    try:
        api_start_time = time.time()
        completion = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": QUALITY_CHECKER_SYSTEM_PROMPT},
                {"role": "user", "content": f"{prompt}\n\nCRITICAL: Return valid JSON only in the specified format."}
            ],
            response_format={"type": "json_object"},
        )
        api_time = time.time() - api_start_time
        
        response_text = completion.choices[0].message.content
        logger.info(f"Quality assessment completed in {api_time:.2f} seconds")
        logger.info(f"Quality assessment response received: {len(response_text)} characters")
        
        # Log usage information if available
        if hasattr(completion, "usage") and completion.usage:
            try:
                usage = completion.usage
                # Handle different possible attribute names in the usage object
                prompt_tokens = getattr(usage, 'prompt_tokens', getattr(usage, 'input_tokens', 'Unknown'))
                completion_tokens = getattr(usage, 'completion_tokens', getattr(usage, 'output_tokens', 'Unknown'))
                total_tokens = getattr(usage, 'total_tokens', 'Unknown')
                logger.info(f"Token usage - Prompt: {prompt_tokens}, Completion: {completion_tokens}, Total: {total_tokens}")
            except Exception as e:
                logger.debug(f"Unable to log detailed usage info: {e}")
                logger.debug(f"Available usage attributes: {dir(completion.usage)}")
        
        # Log the full response
        logger.info("FULL QUALITY ASSESSMENT RESPONSE:")
        logger.info("=" * 50)
        logger.info(response_text)
        logger.info("=" * 50)
        
        # Parse and log the JSON structure
        parsed_response = json.loads(response_text)
        logger.info("Quality assessment JSON parsing successful")
        
        if isinstance(parsed_response, dict):
            logger.info(f"Quality assessment response contains {len(parsed_response)} fields:")
            for key, value in parsed_response.items():
                if isinstance(value, (str, int, float, bool)):
                    logger.info(f"  - {key}: {value}")
                elif isinstance(value, list):
                    logger.info(f"  - {key}: [{len(value)} items]")
                    for i, item in enumerate(value[:2]):  # Show first 2 items
                        logger.info(f"    [{i}] {str(item)[:150]}...")
                elif isinstance(value, dict):
                    logger.info(f"  - {key}: dict with {len(value)} keys")
                else:
                    logger.info(f"  - {key}: {type(value).__name__}")
        
        return parsed_response
        
    except Exception as e:
        logger.error(f"Quality assessment LLM failed: {str(e)}")
        logger.exception("Full quality assessment error details:")
        
        # Enhanced error handling for RetryError
        if isinstance(e, RetryError):
            logger.error("RetryError detected in quality assessment - all retry attempts exhausted")
            if hasattr(e, 'last_attempt') and e.last_attempt and e.last_attempt.exception():
                underlying_error = e.last_attempt.exception()
                logger.error(f"Underlying quality assessment error: {type(underlying_error).__name__}: {str(underlying_error)}")
                
                # Check for token limit specifically
                if isinstance(underlying_error, BadRequestError):
                    underlying_msg = str(underlying_error)
                    if "tokens exceed" in underlying_msg or "context_length_exceeded" in underlying_msg:
                        logger.error("TOKEN LIMIT EXCEEDED in quality assessment")
        
        raise


def _create_fallback_quality_assessment() -> Dict[str, Any]:
    """Create fallback quality assessment when LLM fails."""
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


def assess_analysis_quality(
    vulnerability: VulnerabilityInput,
    result: VulnerabilityResult
) -> Dict[str, Any]:
    """Use LLM to assess the quality of a vulnerability analysis result."""
    logger.info("STARTING ANALYSIS QUALITY ASSESSMENT")
    logger.info(f"Assessing quality for vulnerability: {vulnerability.name}")
    
    # Prepare evidence snippets text
    evidence_text = []
    for i, snippet in enumerate(result.evidence_snippets, 1):
        evidence_text.append(f"[{i}] File: {snippet.file}")
        evidence_text.append(f"    Lines: {snippet.start_line}-{snippet.end_line}")
        evidence_text.append(f"    Code: {snippet.snippet[:200]}...")
    
    evidence_snippets_text = "\n".join(evidence_text) if evidence_text else "No evidence snippets provided"
    
    # Build the quality assessment prompt
    quality_prompt = QUALITY_CHECKER_USER_PROMPT.format(
        vuln_name=vulnerability.name,
        vuln_constraints=vulnerability.constraints,
        ground_truth_summary=vulnerability.summary,
        ground_truth_probability=vulnerability.probability,
        ground_truth_exploitable=vulnerability.exploitable,
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
    
    logger.info(f"Quality assessment prompt constructed: {len(quality_prompt)} characters")
    
    try:
        quality_result = run_quality_assessment(quality_prompt)
        logger.info("Quality assessment completed successfully")
        logger.info(f"Quality Score: {quality_result.get('quality_score', 'N/A')}/5")
        return quality_result
        
    except Exception as e:
        logger.error(f"Quality assessment failed: {e}")
        return _create_fallback_quality_assessment()


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
    
    # Calculate batch metrics
    avg_quality_score = sum(quality_scores) / len(quality_scores) if quality_scores else 0
    quality_distribution = {
        "excellent": sum(1 for score in quality_scores if score == 5),
        "good": sum(1 for score in quality_scores if score == 4),
        "average": sum(1 for score in quality_scores if score == 3),
        "below_average": sum(1 for score in quality_scores if score == 2),
        "poor": sum(1 for score in quality_scores if score == 1)
    }
    
    logger.info(f"Batch quality assessment completed")
    logger.info(f"Average quality score: {avg_quality_score:.2f}/5")
    logger.info(f"Quality distribution: {quality_distribution}")
    
    return {
        "average_quality_score": avg_quality_score,
        "quality_distribution": quality_distribution,
        "individual_assessments": detailed_assessments,
        "total_assessed": len(quality_scores)
    } 