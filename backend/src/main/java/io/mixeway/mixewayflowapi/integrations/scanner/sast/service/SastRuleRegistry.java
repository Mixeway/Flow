package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Component
@Log4j2
public class SastRuleRegistry {

    private final Map<String, VulnerabilityFamily> cweFamilies;
    private final Map<String, RuleDefinition> rules;

    public SastRuleRegistry() {
        RegistryDefinition definition = loadRegistry();
        this.cweFamilies = definition.cweFamilies() == null ? Map.of() : definition.cweFamilies();
        this.rules = definition.rules() == null ? Map.of() : definition.rules();
    }

    public Optional<RuleDefinition> findByRuleId(String ruleId) {
        if (ruleId == null || ruleId.isBlank()) {
            return Optional.empty();
        }
        String normalized = normalize(ruleId);
        RuleDefinition exact = rules.get(normalized);
        if (exact != null) {
            return Optional.of(exact);
        }
        return rules.entrySet().stream()
                .filter(entry -> normalized.contains(entry.getKey()) || entry.getKey().contains(normalized))
                .map(Map.Entry::getValue)
                .findFirst();
    }

    public Optional<VulnerabilityFamily> findFamilyByCwe(List<String> cweIds) {
        if (cweIds == null) {
            return Optional.empty();
        }
        return cweIds.stream()
                .map(this::normalizeCwe)
                .map(cweFamilies::get)
                .filter(java.util.Objects::nonNull)
                .findFirst();
    }

    private RegistryDefinition loadRegistry() {
        try {
            ClassPathResource resource = new ClassPathResource("sast-rule-registry.yml");
            if (!resource.exists()) {
                return new RegistryDefinition(Map.of(), Map.of());
            }
            ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
            return mapper.readValue(resource.getInputStream(), RegistryDefinition.class);
        } catch (Exception e) {
            log.warn("[SastRuleRegistry] Cannot load sast-rule-registry.yml: {}", e.getMessage());
            return new RegistryDefinition(Map.of(), Map.of());
        }
    }

    private String normalize(String value) {
        return value.toLowerCase(Locale.ROOT)
                .replace('-', '_')
                .replace('.', '_')
                .trim();
    }

    private String normalizeCwe(String cwe) {
        if (cwe == null) {
            return "";
        }
        return cwe.toUpperCase(Locale.ROOT).replace("CWE-", "").trim();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record RegistryDefinition(
            @JsonProperty("cweFamilies") Map<String, VulnerabilityFamily> cweFamilies,
            @JsonProperty("rules") Map<String, RuleDefinition> rules
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record RuleDefinition(
            @JsonProperty("cwe") List<String> cwe,
            @JsonProperty("family") VulnerabilityFamily family,
            @JsonProperty("promptProfile") PromptProfile promptProfile,
            @JsonProperty("policyProfile") PolicyProfile policyProfile,
            @JsonProperty("requiresTaint") Boolean requiresTaint,
            @JsonProperty("requiresExecutionContext") Boolean requiresExecutionContext,
            @JsonProperty("requiresDataSensitivity") Boolean requiresDataSensitivity
    ) {}
}
