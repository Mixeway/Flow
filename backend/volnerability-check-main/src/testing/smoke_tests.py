"""
Smoke tests for vulnerability analysis pipeline.

These tests validate basic functionality and serve as integration tests.
"""

import logging
from typing import List, Dict, Any

from ..core.models import VulnerabilityInput, VulnerabilitySynthesisResult

logger = logging.getLogger(__name__)

def run_smoke_tests(
    vulnerabilities: List[VulnerabilityInput], 
    results: List[VulnerabilitySynthesisResult]
) -> Dict[str, Any]:
    """
    Run basic smoke tests on analysis results.
    
    Args:
        vulnerabilities: Input vulnerability specifications
        results: Analysis results to validate
        
    Returns:
        Dictionary containing test results and summary
    """
    logger.info("RUNNING SMOKE TESTS")
    logger.info("=" * 40)
    
    smoke_test_results = {
        "total_tests": 0,
        "passed_tests": 0,
        "failed_tests": 0,
        "test_details": [],
        "overall_status": "UNKNOWN"
    }
    
    # Test 1: Basic result completeness
    test_name = "Result Completeness"
    smoke_test_results["total_tests"] += 1
    
    try:
        assert len(results) == len(vulnerabilities), f"Expected {len(vulnerabilities)} results, got {len(results)}"
        
        for i, result in enumerate(results):
            assert result.vulnerability_id is not None, f"Result {i} missing vulnerability_id"
            assert result.status in ["confirmed", "not_confirmed", "uncertain"], f"Result {i} has invalid status: {result.status}"
            assert 1 <= result.confidence <= 5, f"Result {i} has invalid confidence: {result.confidence}"
            assert 0.0 <= result.predicted_probability <= 1.0, f"Result {i} has invalid probability: {result.predicted_probability}"
            assert isinstance(result.predicted_exploitable, bool), f"Result {i} has invalid exploitable value"
            assert result.analysis_summary is not None, f"Result {i} missing analysis summary"
            assert result.detailed_reasoning is not None, f"Result {i} missing detailed_reasoning"
            assert len(result.detailed_reasoning) > 0, f"Result {i} has empty detailed_reasoning"
        
        smoke_test_results["passed_tests"] += 1
        smoke_test_results["test_details"].append({
            "test": test_name,
            "status": "PASS",
            "message": "All results have required fields with valid values"
        })
        logger.info(f"✅ {test_name}: PASSED")
        
    except AssertionError as e:
        smoke_test_results["failed_tests"] += 1
        smoke_test_results["test_details"].append({
            "test": test_name,
            "status": "FAIL",
            "message": str(e)
        })
        logger.error(f"❌ {test_name}: FAILED - {e}")
    
    # Test 2: Evidence quality check
    test_name = "Evidence Quality"
    smoke_test_results["total_tests"] += 1
    
    try:
        confirmed_results = [r for r in results if r.status == "confirmed"]
        if confirmed_results:
            evidence_count = sum(len(r.evidence_snippets) for r in confirmed_results)
            assert evidence_count > 0, "Confirmed vulnerabilities should have evidence snippets"
            
            # Check evidence snippet structure
            for result in confirmed_results:
                for snippet in result.evidence_snippets:
                    assert hasattr(snippet, 'file'), "Evidence snippet missing file"
                    assert hasattr(snippet, 'start_line'), "Evidence snippet missing start_line"
                    assert hasattr(snippet, 'end_line'), "Evidence snippet missing end_line"
                    assert hasattr(snippet, 'snippet'), "Evidence snippet missing snippet content"
        
        smoke_test_results["passed_tests"] += 1
        smoke_test_results["test_details"].append({
            "test": test_name,
            "status": "PASS",
            "message": f"Evidence quality check passed for {len(confirmed_results)} confirmed results"
        })
        logger.info(f"✅ {test_name}: PASSED")
        
    except AssertionError as e:
        smoke_test_results["failed_tests"] += 1
        smoke_test_results["test_details"].append({
            "test": test_name,
            "status": "FAIL",
            "message": str(e)
        })
        logger.error(f"❌ {test_name}: FAILED - {e}")
    
    # Test 3: Consistency check
    test_name = "Result Consistency"
    smoke_test_results["total_tests"] += 1
    
    try:
        for result in results:
            # High confidence should align with definitive status
            if result.confidence >= 4:
                assert result.status != "uncertain", f"High confidence ({result.confidence}) should not have uncertain status"
            
            # Confirmed status should have reasonable probability
            if result.status == "confirmed":
                assert result.predicted_probability >= 0.5, f"Confirmed vulnerability should have probability >= 0.5, got {result.predicted_probability}"
            
            # Not confirmed status should have lower probability
            if result.status == "not_confirmed":
                assert result.predicted_probability <= 0.6, f"Not confirmed vulnerability should have probability <= 0.6, got {result.predicted_probability}"
        
        smoke_test_results["passed_tests"] += 1
        smoke_test_results["test_details"].append({
            "test": test_name,
            "status": "PASS",
            "message": "Result consistency checks passed"
        })
        logger.info(f"✅ {test_name}: PASSED")
        
    except AssertionError as e:
        smoke_test_results["failed_tests"] += 1
        smoke_test_results["test_details"].append({
            "test": test_name,
            "status": "FAIL",
            "message": str(e)
        })
        logger.error(f"❌ {test_name}: FAILED - {e}")
    
    # Calculate overall status
    if smoke_test_results["failed_tests"] == 0:
        smoke_test_results["overall_status"] = "PASS"
    elif smoke_test_results["passed_tests"] > smoke_test_results["failed_tests"]:
        smoke_test_results["overall_status"] = "PARTIAL_PASS"
    else:
        smoke_test_results["overall_status"] = "FAIL"
    
    # Summary
    logger.info("SMOKE TEST SUMMARY")
    logger.info("-" * 30)
    logger.info(f"Total tests: {smoke_test_results['total_tests']}")
    logger.info(f"Passed: {smoke_test_results['passed_tests']}")
    logger.info(f"Failed: {smoke_test_results['failed_tests']}")
    logger.info(f"Overall status: {smoke_test_results['overall_status']}")
    
    return smoke_test_results


def validate_pipeline_health() -> bool:
    """
    Quick health check for the analysis pipeline components.
    
    Returns:
        True if pipeline appears healthy, False otherwise
    """
    logger.info("VALIDATING PIPELINE HEALTH")
    
    try:
        # Test imports
        from ..core.config import settings
        from ..core.models import VulnerabilityInput
        from ..analysis.pipeline import run_pipeline
        from ..analysis.analyzer import analyze_vulnerability
        
        logger.info("✅ All core imports successful")
        
        # Test configuration
        assert settings.OPENAI_API_KEY is not None, "OPENAI_API_KEY not configured"
        assert settings.OPENAI_MODEL is not None, "OPENAI_MODEL not configured"
        
        logger.info("✅ Configuration appears valid")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Pipeline health check failed: {e}")
        return False 