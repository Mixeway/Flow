package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CodeInjectionSinkEvidenceTest {

    @Test
    void setattrWithoutEvalIsNonExecutionAttributeAssignment() {
        Item item = codeGenItem("setattr(cls, name, self)");
        assertTrue(CodeInjectionSinkEvidence.isCodeInjectionFinding(item));
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item));
        assertFalse(CodeInjectionSinkEvidence.hasRealExecutionSink(item));
        assertFalse(CodeInjectionSinkEvidence.isNameControlledMassAssignment(item));
    }

    @Test
    void contributeToClassIsNonExecution() {
        Item item = codeGenItem("field.contribute_to_class(cls, name)");
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item));
    }

    @Test
    void literalAttributeNameIsSafeWiring() {
        Item item = codeGenItem("setattr(self, \"monitor_usage\", kwargs.pop(\"monitor_usage\", False))");
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item));
        assertFalse(CodeInjectionSinkEvidence.isNameControlledMassAssignment(item));
    }

    @Test
    void selfFieldNameIsSafeWiring() {
        Item item = codeGenItem("setattr(instance, self.field_name, value)");
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item));
        assertFalse(CodeInjectionSinkEvidence.isNameControlledMassAssignment(item));
    }

    @Test
    void massAssignmentLoopIsNameControlledNotSafeWiring() {
        Item item = codeGenItem("""
                for key, value in data.items():
                    setattr(user, key, value)
                """);
        assertTrue(CodeInjectionSinkEvidence.isNameControlledMassAssignment(item));
        assertFalse(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item));
    }

    @Test
    void setattrNameFromRequestIsNameControlled() {
        Item item = codeGenItem("setattr(obj, request.POST[\"field\"], value)");
        assertTrue(CodeInjectionSinkEvidence.isNameControlledMassAssignment(item));
        assertFalse(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item));
    }

    @Test
    void evalWithUserInputIsRealExecutionSink() {
        Item item = codeGenItem("result = eval(user_input)");
        item.setTitle("Python eval injection");
        item.setCweIds(List.of("95"));
        assertTrue(CodeInjectionSinkEvidence.hasRealExecutionSink(item));
        assertFalse(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item));
    }

    @Test
    void execIsRealExecutionSink() {
        assertTrue(CodeInjectionSinkEvidence.hasRealExecutionSink("exec(payload)"));
    }

    @Test
    void assignmentLinePlusEnclosingSetattrIsNonExecution() {
        Item item = codeGenItem("name = value.attr");
        String enclosing = """
                def __set__(self, instance, value):
                    name = value.attr
                    setattr(instance, self.field_name, name)
                """;
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item, enclosing));
        assertFalse(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item));
        assertFalse(CodeInjectionSinkEvidence.hasRealExecutionSink(item, enclosing));
        assertFalse(CodeInjectionSinkEvidence.isNameControlledMassAssignment(item, enclosing));
    }

    @Test
    void assignmentLinePlusEvalInEnclosingMethodIsExecutionSink() {
        Item item = codeGenItem("payload = request.body");
        String enclosing = "result = eval(payload)";
        assertTrue(CodeInjectionSinkEvidence.hasRealExecutionSink(item, enclosing));
        assertFalse(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item, enclosing));
    }

    @Test
    void assignmentLinePlusMassAssignmentInEnclosingMethodIsNameControlled() {
        Item item = codeGenItem("value = request.POST.get('v')");
        String enclosing = """
                for key, value in data.items():
                    setattr(user, key, value)
                """;
        assertTrue(CodeInjectionSinkEvidence.isNameControlledMassAssignment(item, enclosing));
        assertFalse(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item, enclosing));
    }

    @Test
    void saleorLiteralNameRefreshTokenIsSafeWiring() {
        Item item = codeGenItem("setattr(info.context, \"refresh_token\", access_tokens_response.refresh_token)");
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item));
        assertFalse(CodeInjectionSinkEvidence.isNameControlledMassAssignment(item));
        assertFalse(CodeInjectionSinkEvidence.hasRealExecutionSink(item));
    }

    @Test
    void saleorLiteralSdlAndResolverAttrsAreSafeWiring() {
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(
                codeGenItem("setattr(graphql_type, \"_sdl\", type_sdl)")));
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(
                codeGenItem("setattr(resolver, \"doc_category\", self.doc_category)")));
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(
                codeGenItem("setattr(request, \"event_type\", event_type)")));
    }

    @Test
    void saleorInternalFieldNameHoldersAreSafeWiring() {
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(
                codeGenItem("setattr(transaction, pending_amount_field_name, pending_value + request.amount_value)")));
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(
                codeGenItem("setattr(response, cls._meta.return_field_name, ChannelContext(node=product))")));
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(
                codeGenItem("setattr(error, error_field, params[error_field])")));
        assertTrue(CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(
                codeGenItem("setattr(model, field, quantize_price(getattr(model, field) or Decimal(0), currency))")));
    }

    private static Item codeGenItem(String code) {
        Item item = new Item();
        item.setTitle("Unsanitized external input in code generation");
        item.setCweIds(List.of("94"));
        item.setCodeExtract(code);
        item.setFilename("app/models/fields.py");
        return item;
    }
}
