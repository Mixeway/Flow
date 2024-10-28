package io.mixeway.mixewayflowapi.api.threatintel.service;

import io.mixeway.mixewayflowapi.api.threatintel.dto.SuppressRuleDTO;
import io.mixeway.mixewayflowapi.domain.suppressrule.CreateSuppressRuleService;
import io.mixeway.mixewayflowapi.domain.suppressrule.DeleteSuppressRuleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
@Log4j2
public class SuppressRuleService {
    private final DeleteSuppressRuleService deleteSuppressRuleService;
    private final CreateSuppressRuleService createSuppressRuleService;

    public void deleteRule(Long id){
        deleteSuppressRuleService.removeRule(id);
    }

    public void createRule(SuppressRuleDTO suppressRuleDTO, Principal principal) {
        createSuppressRuleService.createRule(suppressRuleDTO,principal);
    }
}
