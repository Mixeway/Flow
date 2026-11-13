package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.Finding;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.EnumSet;
import java.util.HexFormat;
import java.util.Set;

/**
 * Identifies a finding by what was flagged rather than by the line it sits on, so that it stays the
 * same finding when unrelated edits move it within its file. Two findings share a fingerprint when
 * they flag the same content in the same file; the vulnerability is compared separately.
 *
 * <p>The scanners' own identifiers are not used: Bearer's fingerprint and the Gitleaks one both
 * change with the position of the finding in the file.</p>
 */
final class FindingFingerprint {

    /** Sources whose location is {@code file:line} and whose explanation carries the flagged code. */
    static final Set<Finding.Source> LINE_BASED_SOURCES = EnumSet.of(Finding.Source.SAST, Finding.Source.IAC);

    private static final int LENGTH = 40;

    private FindingFingerprint() {
    }

    /**
     * The fingerprint stored with the finding or, failing that, the one that follows from its file and
     * explanation - which is all a SAST or IaC fingerprint is made of, so findings saved before
     * fingerprints existed can still be recognised. Null when the finding cannot be identified this way.
     */
    static String of(Finding finding) {
        if (finding.getFingerprint() != null) {
            return finding.getFingerprint();
        }
        if (!LINE_BASED_SOURCES.contains(finding.getSource())) {
            return null;
        }
        return ofCode(finding.getLocation(), finding.getExplanation());
    }

    /** Fingerprint of flagged code: the file and the explanation, ignoring line number and whitespace. */
    static String ofCode(String location, String explanation) {
        String file = fileOf(location);
        if (file == null || explanation == null || explanation.isBlank()) {
            return null;
        }
        return hash("code", file, explanation.strip().replaceAll("\\s+", " "));
    }

    /** Fingerprint of a leaked secret: the file, the rule that found it and the secret itself. */
    static String ofSecret(String file, String ruleId, String secret) {
        if (file == null || file.isBlank() || secret == null || secret.isBlank()) {
            return null;
        }
        return hash("secret", file, ruleId == null ? "" : ruleId, secret);
    }

    /** The file part of a {@code file:line} location, or null when the location has another form. */
    static String fileOf(String location) {
        if (location == null) {
            return null;
        }
        int separator = location.lastIndexOf(':');
        if (separator <= 0 || separator == location.length() - 1) {
            return null;
        }
        for (int i = separator + 1; i < location.length(); i++) {
            if (!Character.isDigit(location.charAt(i))) {
                return null;
            }
        }
        return location.substring(0, separator);
    }

    private static String hash(String... parts) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            for (String part : parts) {
                byte[] bytes = part.getBytes(StandardCharsets.UTF_8);
                // Length-prefixed, so that no two different sets of parts hash alike.
                digest.update(Integer.toString(bytes.length).getBytes(StandardCharsets.UTF_8));
                digest.update((byte) ':');
                digest.update(bytes);
            }
            return HexFormat.of().formatHex(digest.digest()).substring(0, LENGTH);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
