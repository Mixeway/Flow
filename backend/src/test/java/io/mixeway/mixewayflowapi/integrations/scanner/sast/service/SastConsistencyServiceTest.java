package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class SastConsistencyServiceTest {

    @Test
    void disagreementStaysOutOfTheExplanation() {
        SastConsistencyService service = new SastConsistencyService();
        Item earlier = finding("FALSE_POSITIVE", "The URL is a string literal.");
        Item current = finding("TRUE_POSITIVE",
                "wrapInLink writes linkData.url into href and does not call isUrlValid.");
        FindingEvidence evidence = evidence("xss|plugin.js|dom_content|href|no_neutralizer");

        service.recordFinding("scan-a", earlier, evidence);
        service.recordFinding("scan-a", current, evidence);

        assertEquals("wrapInLink writes linkData.url into href and does not call isUrlValid.",
                current.getAiReasoning());
        assertFalse(current.getAiReasoning().contains("Consistency warning"));
        assertEquals("TRUE_POSITIVE", current.getAiVerdict());
    }

    @Test
    void anotherScanDoesNotInheritTheEarlierVerdict() {
        SastConsistencyService service = new SastConsistencyService();
        FindingEvidence evidence = evidence("xss|plugin.js|dom_content|href|no_neutralizer");
        service.recordFinding("scan-a", finding("FALSE_POSITIVE", "literal"), evidence);
        service.clearScope("scan-a");

        Item current = finding("TRUE_POSITIVE", "dialog URL reaches href.");
        service.recordFinding("scan-b", current, evidence);

        assertEquals("dialog URL reaches href.", current.getAiReasoning());
        assertEquals("TRUE_POSITIVE", current.getAiVerdict());
    }

    private static Item finding(String verdict, String reasoning) {
        Item item = new Item();
        item.setFilename("plugins/image2/plugin.js");
        item.setLineNumber(766);
        item.setAiVerdict(verdict);
        item.setAiReasoning(reasoning);
        return item;
    }

    private static FindingEvidence evidence(String key) {
        return new FindingEvidence(true, null, ExecutionContext.UNKNOWN, "", Map.of(),
                null, List.of(), key);
    }
}
