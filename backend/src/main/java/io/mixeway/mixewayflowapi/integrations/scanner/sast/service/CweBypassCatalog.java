package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.Locale;

/**
 * CWE-specific completeness checklists for custom validators/sanitizers.
 * Used as prompt evidence, not as a name-based detector.
 */
public final class CweBypassCatalog {

    private CweBypassCatalog() {
    }

    public static boolean appliesTo(SastRuleMetadata metadata) {
        if (metadata == null || metadata.family() == null) {
            return false;
        }
        if (!metadata.requiresTaint()) {
            return false;
        }
        return switch (metadata.family()) {
            case SQL_INJECTION, COMMAND_INJECTION, XSS, PATH_TRAVERSAL, SSRF,
                 OPEN_REDIRECT, DESERIALIZATION, XXE, TRUST_BOUNDARY -> true;
            default -> false;
        };
    }

    public static String promptBlock(SastRuleMetadata metadata) {
        if (!appliesTo(metadata)) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("## Completeness catalog for this finding\n");
        sb.append("SOUND requires that NONE of the bypass classes below remain open ");
        sb.append("for the SAME variable that reaches the sink. A character/tag blocklist is never SOUND. ");
        sb.append("If the sink SQL/command/HTML is concatenated from several fragments, audit EACH fragment. ");
        sb.append("A SOUND allowlist on one fragment (column names, archive tokens) does not neutralize a ");
        sb.append("sibling regex/denylist/computed expression in the same sink value.\n");
        sb.append(familyBlock(metadata.family()));
        sb.append("General: Bean Validation @NotNull/@Size/@Email/@Pattern, blank/length checks, ");
        sb.append("and charset checks are WRONG_CWE unless they actually remove the injection syntax for this CWE. ");
        sb.append("A control that protects a different variable, a different branch, or runs after the sink is MISAPPLIED.\n");
        return sb.toString();
    }

    static String familyBlock(VulnerabilityFamily family) {
        if (family == null) {
            return "";
        }
        return switch (family) {
            case SQL_INJECTION -> """
                    SQL injection (CWE-89):
                    SOUND: bound parameters / placeholders with literal or builder SQL text; closed identifier allowlist (map/enum, default deny) for THAT identifier fragment only; proven numeric/enum coercion of that parameter.
                    UNSOUND: keyword/metacharacter denylist (union, quotes, comments, negative lookahead); replace("'","''") then concat; regex that still allows parentheses/commas/SELECT; computed/SQL-expression fragments concatenated after "validation".
                    A SOUND column/table allowlist does not make a sibling computed expression SOUND.
                    Bypass classes: QUOTE_BLACKLIST, COMMENT_BYPASS, ENCODING_BYPASS, STACKED_QUERY, IDENTIFIER_CONCAT, ESCAPE_THEN_CONCAT, DENYLIST_AS_ALLOWLIST, MIXED_FRAGMENT.
                    """;
            case COMMAND_INJECTION -> """
                    OS command injection (CWE-78):
                    SOUND: argument array without a shell (ProcessBuilder, exec.Command without sh -c); closed token allowlist.
                    UNSOUND: strip/replace of ; & | $(); space filters; concatenating into sh -c / cmd.exe / child_process.exec after a metacharacter denylist. $() and backticks are not covered by ;|&<> filters.
                    Bypass classes: METACHAR_BLACKLIST, NEWLINE_BYPASS, IFS_BYPASS, BACKTICK_BYPASS, SHELL_CONCAT.
                    """;
            case XSS -> """
                    XSS (CWE-79):
                    SOUND: context-correct encoder (HTML body vs attr vs JS vs URL) or a tight library sanitizer/safelist on the SAME sink variable.
                    UNSOUND: strip <script>, regex </script>, tag blocklists, innerHTML then querySelector('script').remove(), relaxed ADD_TAGS / allow-all attributes, html.unescape / entity decode after the filter.
                    Bypass classes: TAG_BLOCKLIST, EVENT_HANDLER_LEAK, JAVASCRIPT_URI, SVG_MATHML, MUTATION_XSS, WRONG_CONTEXT_ENCODER, UNESCAPE_AFTER_FILTER.
                    """;
            case PATH_TRAVERSAL -> """
                    Path traversal (CWE-22):
                    SOUND: resolve/realpath/GetFullPath after decoding, then prefix allowlist of a fixed base directory.
                    UNSOUND: contains("..") once; replace("..","") (leaves ....//); no URL-decode; null-byte; checking the client filename while the sink uses another field.
                    Bypass classes: DOTDOT_STRIP_ONCE, ENCODING_BYPASS, NULL_BYTE, ABSOLUTE_PATH, WRONG_FIELD.
                    """;
            case SSRF -> """
                    SSRF (CWE-918):
                    SOUND: allowlist of scheme+host after URL parse; block literal IPs / DNS-rebinding where required.
                    UNSOUND: blacklist localhost; startsWith(https://our-domain) (bypass our-domain.evil.com); no canonicalization.
                    Bypass classes: HOST_PREFIX, LOCALHOST_BLACKLIST, DNS_REBINDING, SCHEME_BYPASS, REDIRECT_FOLLOW.
                    """;
            case OPEN_REDIRECT -> """
                    Open redirect (CWE-601):
                    SOUND: allowlist of destinations, or same-origin / relative-only construction after parse.
                    UNSOUND: startsWith("/") without rejecting //evil; string contains(our-domain); no parse.
                    Bypass classes: PROTOCOL_RELATIVE, HOST_PREFIX, BACKSLASH_BYPASS, ENCODING_BYPASS.
                    """;
            case DESERIALIZATION -> """
                    Insecure deserialization (CWE-502):
                    SOUND: allowlist of types; format that cannot carry gadgets (json of primitives); verified signature over payload.
                    UNSOUND: class-name blacklist; looking-valid JSON/type checks that still deserialize attacker bytes.
                    Bypass classes: TYPE_BLACKLIST, GADGET_CHAIN, UNSIGNED_PAYLOAD.
                    """;
            case XXE -> """
                    XXE (CWE-611):
                    SOUND: factory flags that disable external entities/DTD completely.
                    UNSOUND: regex strip of <!ENTITY>; parsing then "validating" the document.
                    Bypass classes: ENTITY_BLACKLIST, PARAMETER_ENTITY, DTD_STILL_ENABLED.
                    """;
            case TRUST_BOUNDARY -> """
                    Trust boundary / mass assignment:
                    SOUND: closed allowlist of assignable names; ignore unknown keys.
                    UNSOUND: deny-list of sensitive field names.
                    Bypass classes: NAME_BLACKLIST, CASE_BYPASS, NESTED_KEY.
                    """;
            default -> "";
        };
    }

    public static String familyLabel(SastRuleMetadata metadata) {
        if (metadata == null || metadata.family() == null) {
            return "unknown";
        }
        return metadata.family().name().toLowerCase(Locale.ROOT).replace('_', ' ');
    }
}
