package io.mixeway.mixewayflowapi.domain.suppressrule;

import io.mixeway.mixewayflowapi.api.threatintel.dto.SuppressRuleResponseDTO;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.SuppressRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FindSuppressRuleService {
    private final SuppressRuleRepository suppressRuleRepository;

    public List<SuppressRuleResponseDTO> suppressRuleResponseDTOS(Boolean isAdmin, Set<Team> userTeams){
        return suppressRuleRepository.findAllAccessibleSuppressRules(isAdmin, userTeams);
    }
}
