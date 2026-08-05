package io.mixeway.mixewayflowapi.scanmanager.scheduler;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.SuppressRule;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.db.repository.SuppressRuleRepository;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Scheduler responsible for handling temporary (time-boxed) suppressions.
 * Once a day it re-activates findings whose suppression period has expired
 * and deactivates suppress rules that have reached their expiration date.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class SuppressionExpirationScheduler {

    private final FindingRepository findingRepository;
    private final SuppressRuleRepository suppressRuleRepository;
    private final UpdateFindingService updateFindingService;

    /**
     * Runs on application startup (to catch up on expirations missed while the app
     * was down) and every day at 00:30. Findings suppressed until a date that has
     * passed are moved back to EXISTING status; suppress rules past their expiration
     * date are marked as inactive so they no longer apply to new findings.
     */
    @EventListener(ApplicationReadyEvent.class)
    @Scheduled(cron = "0 30 0 * * ?")
    @Transactional
    public void expireTemporarySuppressions() {
        LocalDate today = LocalDate.now();
        log.info("[SuppressionExpiration] Checking for suppressions expiring on or before {}", today);

        List<Finding> expiredFindings = findingRepository
                .findByStatusAndSuppressedUntilLessThanEqual(Finding.Status.SUPRESSED, today);
        for (Finding finding : expiredFindings) {
            updateFindingService.reactivate(finding);
        }
        if (!expiredFindings.isEmpty()) {
            log.info("[SuppressionExpiration] Re-activated {} finding(s) whose suppression period expired", expiredFindings.size());
        }

        List<SuppressRule> expiredRules = suppressRuleRepository
                .findByActiveTrueAndExpirationDateLessThanEqual(today);
        for (SuppressRule rule : expiredRules) {
            rule.deactivate();
            log.info("[SuppressionExpiration] Deactivated expired suppress rule {} for vulnerability {}", rule.getId(), rule.getVulnerability().getName());
        }
        if (!expiredRules.isEmpty()) {
            suppressRuleRepository.saveAll(expiredRules);
        }

        log.info("[SuppressionExpiration] Finished, re-activated {} finding(s), deactivated {} rule(s)", expiredFindings.size(), expiredRules.size());
    }
}
