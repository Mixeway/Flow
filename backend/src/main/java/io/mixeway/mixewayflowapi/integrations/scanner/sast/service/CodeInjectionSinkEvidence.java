package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;

import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Distinguishes real code/command execution sinks from Bearer false positives such as
 * {@code setattr} / model-field wiring labeled as "code generation", and detects true
 * mass-assignment when the attribute <em>name</em> is attacker-controlled.
 */
final class CodeInjectionSinkEvidence {

    private static final Pattern REAL_EXECUTION_SINK = Pattern.compile(
            "\\beval\\s*\\("
                    + "|\\bexec\\s*\\("
                    + "|\\bcompile\\s*\\("
                    + "|\\b__import__\\s*\\("
                    + "|Runtime\\.getRuntime\\s*\\(\\s*\\)\\s*\\.\\s*exec"
                    + "|\\bProcessBuilder\\b"
                    + "|\\bsubprocess\\.(?:run|Popen|call|check_output|check_call)\\s*\\("
                    + "|\\bos\\.system\\s*\\("
                    + "|\\bos\\.popen\\s*\\("
                    + "|\\bnew\\s+Function\\b"
                    + "|\\bFunction\\s*\\("
                    + "|ScriptEngine|GroovyShell|ExpressionFactory|MVEL|SpelExpression"
                    + "|\\bJinja2?\\b.*\\brender\\b|Template\\s*\\(.*\\)\\.render",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern NON_EXECUTION_ATTRIBUTE_SINK = Pattern.compile(
            "\\bsetattr\\s*\\("
                    + "|\\bgsetattr\\s*\\("
                    + "|\\bcontribute_to_class\\b"
                    + "|\\b__set__\\b"
                    + "|\\b__dict__\\s*\\["
                    + "|\\bObject\\.defineProperty\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    /**
     * Mass assignment / attribute pollution: attacker-controlled attribute NAME reaches setattr.
     * (Closer to CWE-915 than CWE-94, but Bearer often labels it "code generation".)
     */
    private static final Pattern NAME_CONTROLLED_MASS_ASSIGNMENT = Pattern.compile(
            // for key, value in data.items(): setattr(obj, key, value)
            "for\\s+(\\w+)\\s*,\\s*(\\w+)\\s+in\\s+[^:\\n]{0,120}\\.(?:items|keys)\\s*\\([^)]*\\)\\s*:\\s*"
                    + "(?:[^\\n]*\\n){0,3}[^\\n]*\\bsetattr\\s*\\(\\s*[^,]+,\\s*\\1\\s*,"
                    // setattr(obj, request/json/params[...], ...)
                    + "|\\bsetattr\\s*\\(\\s*[^,]+,\\s*(?:"
                    + "request(?:\\.(?:GET|POST|data|json|args|form|body))?\\s*[\\[(]"
                    + "|req\\.(?:body|params|query|json)\\s*[\\[(]"
                    + "|params\\s*\\["
                    + "|data\\s*\\["
                    + "|body\\s*\\["
                    + "|json\\s*\\["
                    + "|input\\s*\\["
                    + "|cleaned_data\\s*\\["
                    + "|form(?:_data)?\\s*\\["
                    + ")\\s*",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    /** Fixed attribute name: setattr(obj, "email", value) or setattr(obj, 'role', value). */
    private static final Pattern SETATTR_LITERAL_NAME = Pattern.compile(
            "\\bsetattr\\s*\\(\\s*[^,]+,\\s*['\"][^'\"]+['\"]\\s*,",
            Pattern.CASE_INSENSITIVE);

    /** Internal field name holder: setattr(instance, self.field_name, value). */
    private static final Pattern SETATTR_SELF_FIELD_NAME = Pattern.compile(
            "\\bsetattr\\s*\\(\\s*[^,]+,\\s*self\\.\\w+\\s*,",
            Pattern.CASE_INSENSITIVE);

    private CodeInjectionSinkEvidence() {
    }

    static boolean hasRealExecutionSink(Item item) {
        return hasRealExecutionSink(item, null);
    }

    static boolean hasRealExecutionSink(Item item, String extraCode) {
        return hasRealExecutionSink(combinedCode(item, extraCode));
    }

    static boolean hasRealExecutionSink(String code) {
        if (code == null || code.isBlank()) {
            return false;
        }
        return REAL_EXECUTION_SINK.matcher(code).find();
    }

    /**
     * Attribute/model-field wiring flagged as code generation/injection without any real exec sink
     * and without attacker-controlled attribute names.
     */
    static boolean isNonExecutionAttributeAssignment(Item item) {
        return isNonExecutionAttributeAssignment(item, null);
    }

    /**
     * Same as {@link #isNonExecutionAttributeAssignment(Item)} but also inspects extra
     * function-body / snippet text. Bearer often flags an assignment line while
     * {@code setattr}/{@code __set__} live in the enclosing method.
     */
    static boolean isNonExecutionAttributeAssignment(Item item, String extraCode) {
        String code = combinedCode(item, extraCode);
        if (code.isBlank()) {
            return false;
        }
        if (hasRealExecutionSink(code) || isNameControlledMassAssignment(code)) {
            return false;
        }
        if (SETATTR_LITERAL_NAME.matcher(code).find()
                || SETATTR_SELF_FIELD_NAME.matcher(code).find()) {
            return true;
        }
        // Generic setattr/gsetattr/__set__/__dict__ without mass-assignment patterns → wiring FP.
        return NON_EXECUTION_ATTRIBUTE_SINK.matcher(code).find();
    }

    /**
     * True when the attribute <em>name</em> slot is attacker-influenced (mass assignment).
     */
    static boolean isNameControlledMassAssignment(Item item) {
        return isNameControlledMassAssignment(item, null);
    }

    static boolean isNameControlledMassAssignment(Item item, String extraCode) {
        return isNameControlledMassAssignment(combinedCode(item, extraCode));
    }

    static boolean isNameControlledMassAssignment(String code) {
        if (code == null || code.isBlank()) {
            return false;
        }
        return NAME_CONTROLLED_MASS_ASSIGNMENT.matcher(code).find();
    }

    static boolean isCodeInjectionFinding(Item item) {
        if (item == null) {
            return false;
        }
        if (item.getCweIds() != null) {
            for (String cwe : item.getCweIds()) {
                String normalized = Optional.ofNullable(cwe).orElse("")
                        .toUpperCase(Locale.ROOT).replace("CWE-", "").trim();
                if ("94".equals(normalized) || "95".equals(normalized)) {
                    return true;
                }
            }
        }
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")).toLowerCase(Locale.ROOT);
        return combined.contains("code injection")
                || combined.contains("code generation")
                || combined.contains("eval injection")
                || combined.contains("script injection")
                || combined.contains("python_lang_code_injection")
                || combined.contains("python_lang_eval");
    }

    private static String combinedCode(Item item, String extraCode) {
        String extract = Optional.ofNullable(item)
                .map(Item::getCodeExtract)
                .orElse("");
        String extra = extraCode == null ? "" : extraCode;
        return (extract + "\n" + extra).toLowerCase(Locale.ROOT);
    }
}
