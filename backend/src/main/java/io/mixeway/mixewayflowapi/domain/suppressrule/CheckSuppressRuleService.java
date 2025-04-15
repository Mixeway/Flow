package io.mixeway.mixewayflowapi.domain.suppressrule;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.SuppressRule;
import io.mixeway.mixewayflowapi.db.repository.SuppressRuleRepository;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CheckSuppressRuleService {
    private final SuppressRuleRepository suppressRuleRepository;
    private final UpdateFindingService updateFindingService;

    public void validate(Finding finding) {
        // Get applicable suppress rules for this finding
        List<SuppressRule> applicableRules = suppressRuleRepository.findApplicableSuppressRules(finding.getId());

        for (SuppressRule rule : applicableRules) {
            // Check if path regex matches (if specified)
            if (rule.getPathRegex() != null && !rule.getPathRegex().isEmpty()) {
                String filePath = finding.getLocation(); // Assuming Finding has a getFilePath method
                if (filePath == null || !Pattern.compile(rule.getPathRegex()).matcher(filePath).matches()) {
                    continue; // Skip this rule if path doesn't match
                }
            }

            // If we reach here, the rule applies
            updateFindingService.suppressFinding(finding, Finding.SuppressedReason.WONT_FIX.toString());
            return; // Stop processing after first applicable rule
        }
    }
}