package io.mixeway.mixewayflowapi.domain.suppressrule;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.repository.SuppressRuleRepository;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CheckSuppressRuleService {
    private final SuppressRuleRepository suppressRuleRepository;
    private final UpdateFindingService updateFindingService;

    public void validate(Finding finding){
        if (suppressRuleRepository.existsSuppressRuleForFinding(finding.getId())){
            updateFindingService.suppressFinding(finding, Finding.SuppressedReason.WONT_FIX.toString());
        }
    }
}
