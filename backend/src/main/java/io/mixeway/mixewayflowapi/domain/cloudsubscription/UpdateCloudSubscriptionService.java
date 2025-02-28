package io.mixeway.mixewayflowapi.domain.cloudsubscription;

import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.CloudSubscriptionRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.cloudscaninfo.CreateCloudScanInfoService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.CloudSubscriptionNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.DuplicateCloudSubscriptionException;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class UpdateCloudSubscriptionService {
    private final CloudSubscriptionRepository cloudSubscriptionRepository;
    private final FindTeamService findTeamService;
    private final PermissionFactory permissionFactory;
    private final FindingRepository findingRepository;
    private final CreateCloudScanInfoService createCloudScanInfoService;

    private void updateScanStatus(CloudSubscription cloudSubscription, CloudSubscription.ScanStatus scanStatus) {
        cloudSubscription.updateCloudSubscriptionScanStatus(scanStatus);
        cloudSubscriptionRepository.save(cloudSubscription);
    }

    @Transactional
    public CloudSubscription update(Long id, String newName, Long teamId, Principal principal, String externalProjectName) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> {
                    log.warn("Attempted to update cloud subscription for non-existent team id: {}", teamId);
                    return new TeamNotFoundException("Team not found");
                });

        permissionFactory.canUserManageTeam(team, principal);

        CloudSubscription subscription = cloudSubscriptionRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Attempted to update non-existent cloud subscription with id: {}", id);
                    return new CloudSubscriptionNotFoundException("Cloud subscription not found");
                });

        if (!subscription.getTeam().equals(team)) {
            log.warn("Attempted to update subscription from different team. Subscription id: {}, Team: {}", id, team.getName());
            throw new IllegalArgumentException("Cannot modify subscription from different team");
        }

        if (!subscription.getName().equals(newName) &&
                cloudSubscriptionRepository.existsByNameAndTeam(newName, team)) {
            log.warn("Attempted to update to existing name: {} for team: {}", newName, team.getName());
            throw new DuplicateCloudSubscriptionException("Cloud subscription with name " + newName + " already exists for team");
        }

        subscription.updateName(newName);
        CloudSubscription updated = cloudSubscriptionRepository.save(subscription);
        log.info("Updated cloud subscription id: {} to name: {} for team: {}", id, newName, team.getName());
        return updated;
    }

    @Transactional
    public void updateCloudSubscriptionScanStatus(CloudSubscription cloudSubscription) {
        // Fetch findings associated with the subscription
        List<Finding> findings = findingRepository.findByCloudSubscription(cloudSubscription);

        // Count high and critical severity findings
        long highSeverityCount = findings.stream()
                .filter(finding -> finding.getSeverity() == Finding.Severity.HIGH & (finding.getStatus() == Finding.Status.NEW || finding.getStatus() == Finding.Status.EXISTING))
                .count();

        long criticalSeverityCount = findings.stream()
                .filter(finding -> finding.getSeverity() == Finding.Severity.CRITICAL & (finding.getStatus() == Finding.Status.NEW || finding.getStatus() == Finding.Status.EXISTING))
                .count();

        // Determine the scan status based on findings
        CloudSubscription.ScanStatus scanStatus = determineScanStatus(highSeverityCount, criticalSeverityCount);

        // Update the scan status
        updateScanStatus(cloudSubscription, scanStatus);

        createCloudScanInfoService.createOrUpdateCloudScanInfo(
                cloudSubscription,
                cloudSubscription.getScan_status(),
                (int) highSeverityCount,
                (int) criticalSeverityCount
        );

        log.info("Updated scan status for cloud subscription: {} to {}", cloudSubscription.getExternal_project_name(), scanStatus);
    }

    /**
     * Determines the appropriate scan status based on the count of findings.
     *
     * @param highSeverityCount    the count of high-severity findings
     * @param criticalSeverityCount the count of critical-severity findings
     * @return the corresponding {@link CloudSubscription.ScanStatus}
     */
    private CloudSubscription.ScanStatus determineScanStatus(long highSeverityCount, long criticalSeverityCount) {
        if (criticalSeverityCount >= 3) {
            return CloudSubscription.ScanStatus.DANGER;
        } else if (criticalSeverityCount > 0 || highSeverityCount > 0) {
            return CloudSubscription.ScanStatus.WARNING;
        } else {
            return CloudSubscription.ScanStatus.SUCCESS;
        }
    }

    @jakarta.transaction.Transactional
    public void changeTeam(CloudSubscription cloudSubscription, Team newTeam) {
        cloudSubscription.updateTeam(newTeam);
        cloudSubscriptionRepository.save(cloudSubscription);
        log.info("Changed team for cloud subscription {} to {}", cloudSubscription.getExternal_project_name(), newTeam.getName());
    }

}
