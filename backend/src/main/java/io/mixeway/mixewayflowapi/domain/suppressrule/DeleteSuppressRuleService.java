package io.mixeway.mixewayflowapi.domain.suppressrule;

import io.mixeway.mixewayflowapi.db.repository.SuppressRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class DeleteSuppressRuleService {
    private final SuppressRuleRepository suppressRuleRepository;

    public void removeRule(Long id){
        suppressRuleRepository.deleteById(id);
        log.info("[SuppressRule] Successfully deleted rule with id {}", id);
    }
}
