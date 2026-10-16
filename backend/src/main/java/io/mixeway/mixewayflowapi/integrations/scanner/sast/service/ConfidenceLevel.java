package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.Locale;

/**
 * Standardized classification of the numeric AI verification confidence (0.0-1.0)
 * into discrete, human-readable bands.
 *
 * <p>Having a single source of truth for the thresholds keeps the interpretation of
 * confidence consistent across the LLM prompt rubric, verdict normalization, logging,
 * and any downstream reporting, instead of scattering magic numbers throughout the
 * codebase. The prompt rubric handed to the model is generated from these same values
 * via {@link #promptRubric()}, so the guidance the model receives cannot drift from the
 * thresholds the code enforces.
 *
 * <p>Bands are half-open intervals {@code [lowerBound, upperBound)} except the top band,
 * which includes 1.0.
 */
public enum ConfidenceLevel {

    /** Confidence could not be determined (e.g. verdict not verified). */
    UNKNOWN(Double.NaN, Double.NaN, "confidence could not be determined."),

    /** [0.00, 0.20) - effectively no confidence; not enough to act on. */
    VERY_LOW(0.0, 0.20, "essentially no supporting evidence in the shown code."),

    /** [0.20, 0.40) - weak signal. */
    LOW(0.20, 0.40, "weak evidence; the verdict would be mostly inference with key elements missing."),

    /** [0.40, 0.70) - inconclusive / typical for UNCERTAIN verdicts. */
    MEDIUM(0.40, 0.70, "partial or mixed evidence; at least one key element (source, reachability, or "
            + "protection) is not shown. Default band for an UNCERTAIN verdict."),

    /** [0.70, 0.90) - strong signal. */
    HIGH(0.70, 0.90, "strong, code-based evidence; at most one link is inferred from clear surrounding context."),

    /** [0.90, 1.00] - all elements (source, sink, missing protection) are explicit. */
    VERY_HIGH(0.90, 1.0, "every element the verdict requires is explicit in the shown code — for "
            + "TRUE_POSITIVE: an untrusted source, a reachable sink, and missing or insufficient protection; "
            + "for FALSE_POSITIVE: complete protection, a safe API, or proven unreachability.");

    /**
     * Minimum confidence at which a definitive TRUE_POSITIVE / FALSE_POSITIVE verdict may be
     * given. Set below the {@link #HIGH} boundary so the model can commit to a verdict when the
     * source and sink are clear and only a single link is not fully proven, instead of retreating
     * to UNCERTAIN. UNCERTAIN is reserved for genuine ambiguity below this threshold.
     */
    public static final double DEFINITIVE_VERDICT_MIN = 0.40;

    private final double lowerBound;
    private final double upperBound;
    private final String description;

    ConfidenceLevel(double lowerBound, double upperBound, String description) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.description = description;
    }

    public double lowerBound() {
        return lowerBound;
    }

    public double upperBound() {
        return upperBound;
    }

    public String description() {
        return description;
    }

    /**
     * Maps a raw confidence value to its standardized band.
     *
     * @param confidence value expected in [0.0, 1.0]; {@code null} maps to {@link #UNKNOWN}.
     *                   Out-of-range values are clamped to the [0.0, 1.0] interval.
     * @return the matching {@link ConfidenceLevel}, never {@code null}.
     */
    public static ConfidenceLevel fromConfidence(Double confidence) {
        if (confidence == null || confidence.isNaN()) {
            return UNKNOWN;
        }
        double clamped = Math.max(0.0, Math.min(1.0, confidence));
        if (clamped >= VERY_HIGH.lowerBound) {
            return VERY_HIGH;
        }
        if (clamped >= HIGH.lowerBound) {
            return HIGH;
        }
        if (clamped >= MEDIUM.lowerBound) {
            return MEDIUM;
        }
        if (clamped >= LOW.lowerBound) {
            return LOW;
        }
        return VERY_LOW;
    }

    /**
     * Formats this band as a single rubric line, e.g. {@code [0.90, 1.00] (VERY_HIGH): ...}.
     */
    public String rubricLine() {
        String upperSymbol = this == VERY_HIGH ? "]" : ")";
        return String.format(Locale.ROOT, "[%.2f, %.2f%s (%s): %s",
                lowerBound, upperBound, upperSymbol, name(), description);
    }

    /**
     * Builds the confidence-scoring rubric injected into the LLM prompt, ordered from the
     * strongest to the weakest band (UNKNOWN is internal and excluded).
     */
    public static String promptRubric() {
        StringBuilder sb = new StringBuilder();
        for (ConfidenceLevel level : new ConfidenceLevel[]{VERY_HIGH, HIGH, MEDIUM, LOW, VERY_LOW}) {
            sb.append("- ").append(level.rubricLine()).append("\n");
        }
        return sb.toString();
    }
}
