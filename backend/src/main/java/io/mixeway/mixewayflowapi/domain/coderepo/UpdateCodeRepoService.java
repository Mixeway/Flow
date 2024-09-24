package io.mixeway.mixewayflowapi.domain.coderepo;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.scaninfo.CreateScanInfoService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for updating the status of a {@link CodeRepo} based on findings and scan results.
 * <p>
 * This service is responsible for updating various scan statuses (SAST, SCA, IaC, Secrets) for a given {@link CodeRepo}
 * and its {@link CodeRepoBranch}, and creating or updating a {@link io.mixeway.mixewayflowapi.db.entity.ScanInfo} snapshot.
 * </p>
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class UpdateCodeRepoService {

    private final CodeRepoRepository codeRepoRepository;
    private final FindingRepository findingRepository;
    private final CreateScanInfoService createScanInfoService;
    private final FindCodeRepoService findCodeRepoService;

    /**
     * Updates the SCA UUID for a given {@link CodeRepo}.
     *
     * @param codeRepo the {@link CodeRepo} entity to update
     * @param uuid     the new SCA UUID to set
     */
    public void updateScaUUID(CodeRepo codeRepo, String uuid) {
        codeRepo.setScaUUID(uuid);
        codeRepoRepository.save(codeRepo);
    }

    /**
     * Updates the components associated with a {@link CodeRepo}.
     *
     * @param components the list of {@link Component} entities to associate with the {@link CodeRepo}
     * @param codeRepo   the {@link CodeRepo} entity to update
     */
    @Transactional
    public void updateComponents(List<Component> components, CodeRepo codeRepo) {
        codeRepo.setComponents(components);
        codeRepoRepository.save(codeRepo);
    }

    /**
     * Updates the status of a {@link CodeRepo} based on findings for different sources (SAST, SCA, IaC, Secrets).
     * If a scan was performed, it also creates or updates a {@link io.mixeway.mixewayflowapi.db.entity.ScanInfo} snapshot.
     *
     * @param codeRepo          the {@link CodeRepo} entity to update
     * @param codeRepoBranch    the {@link CodeRepoBranch} entity associated with the code repository
     * @param scaScanPerformed  a boolean indicating if an SCA scan was performed
     * @param commitId          the commit ID associated with the scan
     */
    @Transactional
    public void updateCodeRepoStatus(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, boolean scaScanPerformed, String commitId) {
        codeRepo = findCodeRepoService.findById(codeRepo.getId()).get();
        // Update status for SECRETS
        int secretsHigh = updateStatusForSource(Finding.Source.SECRETS, codeRepo, codeRepoBranch, false);

        // Update status for SAST
        int sastHigh = updateStatusForSource(Finding.Source.SAST, codeRepo, codeRepoBranch, false);

        // Update status for IaC
        int iacHigh = updateStatusForSource(Finding.Source.IAC, codeRepo, codeRepoBranch, false);

        // Initialize SCA counts
        int scaHigh = 0;
        int scaCritical = 0;

        // Update status for SCA if the scan was performed
        if (!codeRepo.getComponents().isEmpty()) {
            scaHigh = updateStatusForSource(Finding.Source.SCA, codeRepo, codeRepoBranch, false);
            scaCritical = countCriticalFindings(Finding.Source.SCA, codeRepo, codeRepoBranch);
        } else {
            scaHigh = updateStatusForSource(Finding.Source.SCA, codeRepo, codeRepoBranch, true);
            scaCritical = countCriticalFindings(Finding.Source.SCA, codeRepo, codeRepoBranch);
        }

        // Create or update ScanInfo snapshot
        createScanInfoService.createOrUpdateScanInfo(
                codeRepo,
                codeRepoBranch,
                commitId,
                codeRepo.getScaScan(),
                codeRepo.getSastScan(),
                codeRepo.getIacScan(),
                codeRepo.getSecretsScan(),
                scaHigh,
                scaCritical,
                sastHigh,
                countCriticalFindings(Finding.Source.SAST, codeRepo, codeRepoBranch),
                iacHigh,
                countCriticalFindings(Finding.Source.IAC, codeRepo, codeRepoBranch),
                secretsHigh,
                countCriticalFindings(Finding.Source.SECRETS, codeRepo, null)
        );
    }

    /**
     * Updates the scan status for a specific source (SAST, SCA, IaC, Secrets) based on findings.
     *
     * @param source         the source of the findings (SAST, SCA, IaC, Secrets)
     * @param codeRepo       the {@link CodeRepo} entity to update
     * @param codeRepoBranch the {@link CodeRepoBranch} entity associated with the code repository (not needed for Secrets)
     * @param isSCA          boolean indicating if the source is SCA
     * @return the count of high-severity findings
     */
    private int updateStatusForSource(Finding.Source source, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, boolean isSCA) {
        List<Finding> findings;

        // Handle the SECRETS source separately as it doesn't need CodeRepoBranch
        if (source == Finding.Source.SECRETS) {
            findings = findingRepository.findBySourceAndCodeRepo(source, codeRepo);
        } else {
            findings = findingRepository.findBySourceAndCodeRepoBranchAndCodeRepo(source, codeRepoBranch, codeRepo);
        }

        long countNewOrExisting = findings.stream()
                .filter(finding -> finding.getStatus() == Finding.Status.NEW || finding.getStatus() == Finding.Status.EXISTING)
                .filter(finding -> finding.getSeverity() == Finding.Severity.CRITICAL || finding.getSeverity() == Finding.Severity.HIGH)
                .count();

        // Determine the appropriate scan status based on the count
        CodeRepo.ScanStatus scanStatus = determineScanStatus(source, countNewOrExisting);

        // Update the scan status based on the source
        updateScanStatus(codeRepo, source, scanStatus);
        if (isSCA){
            updateScanStatus(codeRepo, source, CodeRepo.ScanStatus.NOT_PERFORMED);
        }

        // Return the count of high severity findings
        return (int) countNewOrExisting;
    }

    /**
     * Determines the appropriate scan status based on the count of findings.
     *
     * @param source              the source of the findings (SAST, SCA, IaC, Secrets)
     * @param countNewOrExisting  the count of findings that are NEW or EXISTING
     * @return the corresponding {@link CodeRepo.ScanStatus}
     */
    private CodeRepo.ScanStatus determineScanStatus(Finding.Source source, long countNewOrExisting) {
        if (countNewOrExisting == 0) {
            return CodeRepo.ScanStatus.SUCCESS;
        } else if ((source == Finding.Source.IAC && countNewOrExisting < 5) || countNewOrExisting < 2) {
            return CodeRepo.ScanStatus.WARNING;
        } else {
            return CodeRepo.ScanStatus.DANGER;
        }
    }

    /**
     * Updates the scan status for the {@link CodeRepo} based on the source of the findings.
     *
     * @param codeRepo   the {@link CodeRepo} entity to update
     * @param source     the source of the findings (SAST, SCA, IaC, Secrets)
     * @param scanStatus the determined {@link CodeRepo.ScanStatus}
     */
    private void updateScanStatus(CodeRepo codeRepo, Finding.Source source, CodeRepo.ScanStatus scanStatus) {
        switch (source) {
            case SECRETS -> codeRepo.updateSecretsScanStatus(scanStatus);
            case SAST -> codeRepo.updateSastScanStatus(scanStatus);
            case IAC -> codeRepo.updateIacScanStatus(scanStatus);
            case SCA -> codeRepo.updateScaScanStatus(scanStatus);
        }
        codeRepoRepository.save(codeRepo);
    }

    /**
     * Counts the number of CRITICAL severity findings for a specific source.
     *
     * @param source         the source of the findings (SAST, SCA, IaC, Secrets)
     * @param codeRepo       the {@link CodeRepo} entity to query
     * @param codeRepoBranch the {@link CodeRepoBranch} entity associated with the code repository (not needed for Secrets)
     * @return the count of CRITICAL severity findings
     */
    private int countCriticalFindings(Finding.Source source, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        List<Finding> findings;

        if (source == Finding.Source.SECRETS) {
            findings = findingRepository.findBySourceAndCodeRepo(source, codeRepo);
        } else {
            findings = findingRepository.findBySourceAndCodeRepoBranchAndCodeRepo(source, codeRepoBranch, codeRepo);
        }

        return (int) findings.stream()
                .filter(finding -> finding.getStatus() == Finding.Status.NEW || finding.getStatus() == Finding.Status.EXISTING)
                .filter(finding -> finding.getSeverity() == Finding.Severity.CRITICAL)
                .count();
    }

    public void setScanRunning(CodeRepo codeRepo) {
        codeRepo.startScan();
        codeRepoRepository.save(codeRepo);
    }

    @Modifying
    @Transactional
    public void setScaPending(CodeRepo codeRepo) {
        codeRepoRepository.updateScaScanToNotPerformed(codeRepo.getId());
    }
}
