package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.List;

/**
 * The single ordering of SQL-injection verdict rules quoted by every prompt (CWE checklist, evidence notes,
 * system overlay, Stage 2, validator). The deterministic normalization in
 * {@code SastFindingVerificationService.applyDeterministicContextNormalizations} applies the same order:
 * parameterized, then numeric, then trusted-operand concatenation, then unneutralized string concatenation.
 * Change both together.
 */
final class SqlInjectionDecisionOrder {

    static final List<String> STEPS = List.of(
            "1. Parameterized: the SQL text is a literal/constant or a framework-parameterized builder and every value "
                    + "is bound (placeholders such as ?, $1, :name; ORM binds; a wrapper that passes a literal SQL string "
                    + "plus bound args; knex ?? identifiers with a bindings array) => FALSE_POSITIVE.",
            "2. Numeric: EVERY value concatenated/interpolated into the SQL text has a proven numeric type (declared "
                    + "int/long/number/Integer, or converted with int()/parseInt/Integer.parseInt/strconv.Atoi before it "
                    + "reaches the query) => FALSE_POSITIVE with confidence >= 0.85. If any interpolated value is a "
                    + "string or object, this step does not match.",
            "3. Allowlist: every remaining string fragment passes a complete allowlist (closed map/enum of identifiers, "
                    + "default deny) => FALSE_POSITIVE. A keyword/metacharacter denylist, quote-doubling, or a regex that "
                    + "still admits SELECT/parentheses/commas is NOT an allowlist. Judge each fragment separately.",
            "4. Trusted string operands (RISKY SCHEME): the remaining string operands are proven literals, constants, "
                    + "literal call-site arguments, internal or config values, yet the SQL text is still built by "
                    + "concatenation/interpolation => TRUE_POSITIVE with confidence 0.50-0.60 (~0.55).",
            "5. Otherwise: a non-literal string fragment is concatenated/interpolated into SQL text without "
                    + "parameterization or allowlist => TRUE_POSITIVE. Unknown origin is not a reason for UNCERTAIN here. "
                    + "Go above 0.60 only when an untrusted source is shown.");

    static final String HEADER = "SQL decision order — apply the steps top-down. The FIRST step that matches "
            + "decides the verdict; do not apply later steps:";

    static final String UNKNOWN_SQL_TEXT = "Before step 1: if the SQL text itself comes from a variable, getter, or "
            + "query loader (getSqlString/getQuery/etc.) whose content is not shown, trace it first; loaders are not "
            + "trusted by default. If it stays unknown, UNCERTAIN.";

    /** Short reference for prompts that already carry, or sit next to, the full checklist. */
    static final String SUMMARY = "SQL injection: use the SQL decision order (parameterized → numeric → allowlist → "
            + "trusted string operands = RISKY SCHEME ~0.55 → otherwise TRUE_POSITIVE); the first matching step wins.";

    private SqlInjectionDecisionOrder() {
    }

    static String checklistItem() {
        return HEADER + "\n  " + String.join("\n  ", STEPS) + "\n  " + UNKNOWN_SQL_TEXT;
    }
}
