package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SastReactResponseParserTest {

    @Test
    void pullsVerdictOutOfThinkingTagsAndMarkdown() {
        String raw = """
                <think>The brace in {this thought} is not the answer.</think>
                Here is the result:
                ```json
                {"action":"final","verdict":"True Positive","confidence":"0.80","reasoning":"The command interpolates request input.",}
                ```
                """;

        JsonNode node = SastReactResponseParser.tryParse(raw);
        SastReactResponseParser.StageOneView view = SastReactResponseParser.stageOne(node);

        assertNull(view.failure());
        assertEquals("TRUE_POSITIVE", view.verdict());
        assertEquals(0.80d, view.confidence(), 0.0001d);
        assertTrue(view.reasoning().contains("request input"));
    }

    @Test
    void acceptsMissingActionAndPercentConfidence() {
        JsonNode node = SastReactResponseParser.tryParse("""
                {"verdict":"FALSE_POSITIVE","confidence":"85%","thought":"The argument is a literal."}
                """);

        SastReactResponseParser.StageOneView view = SastReactResponseParser.stageOne(node);

        assertNull(view.failure());
        assertEquals("FALSE_POSITIVE", view.verdict());
        assertEquals(0.85d, view.confidence(), 0.0001d);
        assertEquals("The argument is a literal.", view.reasoning());
    }

    @Test
    void toolCallWithoutVerdictStaysAMissingAction() {
        JsonNode node = SastReactResponseParser.tryParse(
                "{\"action\":\"search_repo\",\"pattern\":\"os.system\",\"path_glob\":\"*.py\"}");

        SastReactResponseParser.StageOneView view = SastReactResponseParser.stageOne(node);

        assertEquals(SastReactResponseParser.StageOneFailure.MISSING_ACTION, view.failure());
    }

    @Test
    void recoversFinalVerdictAfterDuplicatedOpeningBrace() {
        JsonNode node = SastReactResponseParser.tryParse(
                "{{\"action\":\"final\",\"execution_context\":\"cli_developer_tool\",\"input_source\":\"config_file\","
                        + "\"verdict\":\"TRUE_POSITIVE\",\"confidence\":0.98,\"reasoning\":\"Empty checkServerTrusted.\"}");

        SastReactResponseParser.StageOneView view = SastReactResponseParser.stageOne(node);

        assertNull(view.failure());
        assertEquals("TRUE_POSITIVE", view.verdict());
        assertEquals("cli_developer_tool", node.get("execution_context").asText());
    }

    @Test
    void recoversToolCallAfterDuplicatedBraceQuotePrefix() {
        JsonNode node = SastReactResponseParser.tryParse(
                "{\"{\"thought\":\"Need to see socket setup.\",\"action\":\"read_file\","
                        + "\"path\":\"src/RGWClient.java\",\"start_line\":120,\"end_line\":220}");

        assertEquals("read_file", node.get("action").asText());
        assertEquals(120, node.get("start_line").asInt());
    }

    @Test
    void recoversToolCallWithSpacesAfterDuplicatedBraceQuotePrefix() {
        JsonNode node = SastReactResponseParser.tryParse(
                "{\"{\"action\": \"search_repo\", \"pattern\": \"new Socket\\\\(\\\\)\", \"path_glob\": \"*.java\"}");

        assertEquals("search_repo", node.get("action").asText());
        assertEquals("new Socket\\(\\)", node.get("pattern").asText());
    }
}
