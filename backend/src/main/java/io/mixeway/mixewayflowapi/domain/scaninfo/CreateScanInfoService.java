package io.mixeway.mixewayflowapi.domain.scaninfo;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import io.mixeway.mixewayflowapi.db.repository.ScanInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service class for creating or updating immutable {@link ScanInfo} entities.
 * <p>
 * This service is responsible for creating and saving instances of {@link ScanInfo}
 * which represent a snapshot of a {@link CodeRepo} and its {@link CodeRepoBranch} at a specific point in time.
 * The {@link ScanInfo} entity is immutable and stores various scan results for different scan types.
 * </p>
 */
@Service
@RequiredArgsConstructor
public class CreateScanInfoService {

    private final ScanInfoRepository scanInfoRepository;

    /**
     * Creates or updates a {@link ScanInfo} entity for the given commitId, codeRepo, and codeRepoBranch.
     * If a record already exists for the given commitId, it updates the existing record.
     * Otherwise, it creates a new one.
     *
     * @param codeRepo          The {@link CodeRepo} associated with this scan.
     * @param codeRepoBranch    The {@link CodeRepoBranch} associated with this scan.
     * @param commitId          The commit ID related to this scan.
     * @param scaScanStatus     The scan status for SCA (Software Composition Analysis).
     * @param sastScanStatus    The scan status for SAST (Static Application Security Testing).
     * @param iacScanStatus     The scan status for IaC (Infrastructure as Code).
     * @param secretsScanStatus The scan status for Secrets scanning.
     * @param scaHigh           The count of high severity issues found during the SCA scan.
     * @param scaCritical       The count of critical severity issues found during the SCA scan.
     * @param sastHigh          The count of high severity issues found during the SAST scan.
     * @param sastCritical      The count of critical severity issues found during the SAST scan.
     * @param iacHigh           The count of high severity issues found during the IaC scan.
     * @param iacCritical       The count of critical severity issues found during the IaC scan.
     * @param secretsHigh       The count of high severity issues found during the Secrets scan.
     * @param secretsCritical   The count of critical severity issues found during the Secrets scan.
     * @param gitlabHigh       The count of high severity issues found during the GitLab scan.
     * @param gitlabCritical   The count of critical severity issues found during the GitLab scan.
     * @return The saved {@link ScanInfo} entity.
     */
    public ScanInfo createOrUpdateScanInfo(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, String commitId,
                                           CodeRepo.ScanStatus scaScanStatus, CodeRepo.ScanStatus sastScanStatus, CodeRepo.ScanStatus iacScanStatus,
                                           CodeRepo.ScanStatus secretsScanStatus, CodeRepo.ScanStatus gitlabScanStatus, int scaHigh, int scaCritical, int sastHigh, int sastCritical,
                                           int iacHigh, int iacCritical, int secretsHigh, int secretsCritical, int gitlabHigh, int gitlabCritical,
                                           int dastHigh, int dastCritical) {

        Optional<ScanInfo> existingScanInfoOpt = scanInfoRepository.findByCodeRepoAndCodeRepoBranchAndCommitId(codeRepo, codeRepoBranch, commitId);

        ScanInfo scanInfo;

        if (existingScanInfoOpt.isPresent()) {
            scanInfo = existingScanInfoOpt.get();
            scanInfo.updateScanInfo(scaScanStatus, sastScanStatus, iacScanStatus, secretsScanStatus, gitlabScanStatus, scaHigh, scaCritical,
                    sastHigh, sastCritical, iacHigh, iacCritical, secretsHigh, secretsCritical, gitlabHigh, gitlabCritical);
        } else {
            scanInfo = new ScanInfo(codeRepo, codeRepoBranch, commitId, scaScanStatus, sastScanStatus, iacScanStatus,
                    secretsScanStatus, gitlabScanStatus, scaHigh, scaCritical, sastHigh, sastCritical, iacHigh, iacCritical, secretsHigh, secretsCritical, gitlabHigh, gitlabCritical,
                    dastHigh, dastCritical);
        }

        return scanInfoRepository.save(scanInfo);
    }
}
