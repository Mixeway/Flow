package io.mixeway.mixewayflowapi.domain.suppressrule;

import io.mixeway.mixewayflowapi.db.repository.SuppressRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import io.mixeway.mixewayflowapi.db.entity.SuppressRule;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.exceptions.UnauthorizedException;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import java.security.Principal;

@Service
@RequiredArgsConstructor
@Log4j2
public class DeleteSuppressRuleService {
    private final SuppressRuleRepository suppressRuleRepository;
    private final FindUserService findUserService;
    private final PermissionFactory permissionFactory;

    public void removeRule(Long id, Principal principal){
        SuppressRule rule = suppressRuleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("SuppressRule not found: " + id));

        UserInfo requester = findUserService.findUser(principal.getName());

        // Admin can delete any rule
        if (requester.getHighestRole().equals("ADMIN")) {
            suppressRuleRepository.delete(rule);
            log.info("[SuppressRule] Admin {} deleted rule {}", requester.getUsername(), id);
            return;
        }

        // Owner can delete own rule
        if (rule.getOwner() != null && rule.getOwner().getId() == requester.getId()) {
            suppressRuleRepository.delete(rule);
            log.info("[SuppressRule] Owner {} deleted own rule {}", requester.getUsername(), id);
            return;
        }

        // Team Manager can delete within team/project scope they manage
        boolean allowedByTeamScope = false;
        if (requester.getHighestRole().equals("TEAM_MANAGER")) {
            switch (rule.getScope()) {
                case TEAM:
                    Team ruleTeam = rule.getTeam();
                    permissionFactory.canUserManageTeam(ruleTeam,principal);
                    allowedByTeamScope = (ruleTeam != null);
                    break;
                case PROJECT:
                    Team repoTeam = (rule.getCodeRepo() != null) ? rule.getCodeRepo().getTeam() : null;
                    permissionFactory.canUserManageTeam(repoTeam,principal);
                    allowedByTeamScope = (repoTeam != null);
                    break;
                case GLOBAL:
                    allowedByTeamScope = false; // Only admins can delete GLOBAL
                    break;
                default:
                    allowedByTeamScope = false;
            }
        }

        if (allowedByTeamScope) {
            suppressRuleRepository.delete(rule);
            log.info("[SuppressRule] TeamManager {} deleted rule {} in scope", requester.getUsername(), id);
            return;
        }

        throw new UnauthorizedException("Not allowed to delete this suppress rule");
    }
}
