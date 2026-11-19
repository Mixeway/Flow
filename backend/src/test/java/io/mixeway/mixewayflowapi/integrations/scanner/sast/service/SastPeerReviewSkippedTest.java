package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.llm.service.LlmApiClient;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SastPeerReviewSkippedTest {

    private static final LlmApiClient.LlmResponse EMPTY = new LlmApiClient.LlmResponse("", 0, 0);
    private static final LlmApiClient.LlmResponse NOT_JSON = new LlmApiClient.LlmResponse("not json", 0, 0);
    private static final LlmApiClient.LlmResponse INCOMPLETE_JSON = new LlmApiClient.LlmResponse(
            "{\"explanation\":\"looks fine\"}", 0, 0);
    private static final LlmApiClient.LlmResponse CONFIRMING_REVIEW = new LlmApiClient.LlmResponse(
            "{\"original_verdict_correct\":true,\"verdict\":\"TRUE_POSITIVE\",\"confidence\":0.92,"
                    + "\"explanation\":\"The path comes from the request and reaches open().\"}", 0, 0);

    private final LlmApiClient llmApiClient = mock(LlmApiClient.class);
    private SastFindingVerificationService service;

    @BeforeEach
    void setUp() {
        service = new SastFindingVerificationService(
                llmApiClient, null, null, null, null, new SastCwePromptGuidanceService(), null);
        ReflectionTestUtils.setField(service, "verificationThreads", 1);
        ReflectionTestUtils.setField(service, "maxConcurrentCalls", 1);
        ReflectionTestUtils.setField(service, "rateLimitMs", 0L);
        service.init();
    }

    @Test
    void emptyReviewerAnswerIsRetriedThenReportedAsSkipped() {
        when(llmApiClient.chatCompletion(anyList(), eq(true))).thenReturn(EMPTY, EMPTY);
        Item item = item(0.92d);

        SastFindingVerificationService.ValidationOutcome outcome = service.validateVerdict(
                List.of(), item, "report_service.py:430", context(), metadata(), null, SourceOriginHunt.Report.none());

        verify(llmApiClient, times(2)).chatCompletion(anyList(), eq(true));
        assertTrue(outcome.skipped());
        assertEquals(2, outcome.llmRequests());
        assertEquals("TRUE_POSITIVE", item.getAiVerdict());
        assertEquals(0.69d, item.getAiConfidence(), 1e-9);
    }

    @Test
    void malformedReviewerAnswerIsRetriedThenReportedAsSkipped() {
        // A non-empty answer that is not valid JSON is not a usable review: it must be retried exactly
        // like an empty one and, when every attempt is malformed, reported as skipped with capped confidence.
        when(llmApiClient.chatCompletion(anyList(), eq(true))).thenReturn(NOT_JSON, NOT_JSON);
        Item item = item(0.92d);

        SastFindingVerificationService.ValidationOutcome outcome = service.validateVerdict(
                List.of(), item, "report_service.py:430", context(), metadata(), null, SourceOriginHunt.Report.none());

        verify(llmApiClient, times(2)).chatCompletion(anyList(), eq(true));
        assertTrue(outcome.skipped());
        assertEquals(2, outcome.llmRequests());
        assertEquals("TRUE_POSITIVE", item.getAiVerdict());
        assertEquals(0.69d, item.getAiConfidence(), 1e-9);
    }

    @Test
    void incompleteJsonAnswerIsRetriedThenReportedAsSkipped() {
        // Valid JSON without the verdict/confidence fields the merge step reads is equally unusable.
        when(llmApiClient.chatCompletion(anyList(), eq(true))).thenReturn(INCOMPLETE_JSON, INCOMPLETE_JSON);
        Item item = item(0.92d);

        SastFindingVerificationService.ValidationOutcome outcome = service.validateVerdict(
                List.of(), item, "report_service.py:430", context(), metadata(), null, SourceOriginHunt.Report.none());

        verify(llmApiClient, times(2)).chatCompletion(anyList(), eq(true));
        assertTrue(outcome.skipped());
        assertEquals(0.69d, item.getAiConfidence(), 1e-9);
    }

    @Test
    void secondAttemptUsableAnswerCountsAsReview() {
        // First attempt malformed, second attempt a complete review confirming the verdict: the review
        // happened, so the outcome is not skipped and the confidence is not capped.
        when(llmApiClient.chatCompletion(anyList(), eq(true))).thenReturn(NOT_JSON, CONFIRMING_REVIEW);
        Item item = item(0.92d);

        SastFindingVerificationService.ValidationOutcome outcome = service.validateVerdict(
                List.of(), item, "report_service.py:430", context(), metadata(), null, SourceOriginHunt.Report.none());

        verify(llmApiClient, times(2)).chatCompletion(anyList(), eq(true));
        assertFalse(outcome.skipped());
        assertEquals(2, outcome.llmRequests());
        assertEquals("TRUE_POSITIVE", item.getAiVerdict());
        assertEquals(0.92d, item.getAiConfidence(), 1e-9);
    }

    @Test
    void usableFirstAnswerIsNotRetried() {
        when(llmApiClient.chatCompletion(anyList(), eq(true))).thenReturn(CONFIRMING_REVIEW);
        Item item = item(0.92d);

        SastFindingVerificationService.ValidationOutcome outcome = service.validateVerdict(
                List.of(), item, "report_service.py:430", context(), metadata(), null, SourceOriginHunt.Report.none());

        verify(llmApiClient, times(1)).chatCompletion(anyList(), eq(true));
        assertFalse(outcome.skipped());
        assertEquals(1, outcome.llmRequests());
        assertEquals(0.92d, item.getAiConfidence(), 1e-9);
    }

    @Test
    void capKeepsLowerConfidenceAndNull() {
        assertEquals(0.55d, SastFindingVerificationService.capConfidenceWithoutPeerReview(0.55d), 1e-9);
        assertEquals(0.69d, SastFindingVerificationService.capConfidenceWithoutPeerReview(0.95d), 1e-9);
        assertNull(SastFindingVerificationService.capConfidenceWithoutPeerReview(null));
    }

    private static Item item(double confidence) {
        Item item = new Item();
        item.setId("python_lang_path_traversal");
        item.setTitle("Path traversal");
        item.setFilename("app/report_service.py");
        item.setLineNumber(430);
        item.setCodeExtract("open(path)");
        item.setCweIds(List.of("22"));
        item.setAiVerdict("TRUE_POSITIVE");
        item.setAiConfidence(confidence);
        item.setAiReasoning("The path comes from the request and reaches open().");
        return item;
    }

    private static SastRuleMetadata metadata() {
        return new SastRuleMetadata("python_lang_path_traversal", List.of("22"), VulnerabilityFamily.PATH_TRAVERSAL,
                PromptProfile.PATH_TRAVERSAL, PolicyProfile.PATH_CANONICALIZATION, true, false, false);
    }

    private static CodeContextExtractor.CodeContext context() {
        return new CodeContextExtractor.CodeContext("def f(path):\n    open(path)", "", "", "open(path)", List.of(),
                "", "", "", "", "", "python", CodeContextExtractor.EvidenceCategory.AMBIGUOUS, List.of());
    }
}
