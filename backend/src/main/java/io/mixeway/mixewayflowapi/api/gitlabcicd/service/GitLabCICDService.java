package io.mixeway.mixewayflowapi.api.gitlabcicd.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import io.mixeway.mixewayflowapi.api.coderepo.service.FindingService;
import io.mixeway.mixewayflowapi.api.gitlabcicd.dto.GitLabCICDDetailsResponseDto;
import io.mixeway.mixewayflowapi.api.gitlabcicd.dto.GitLabCICDSummaryResponseDto;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoBranchRepository;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Log4j2
@RequiredArgsConstructor
public class GitLabCICDService {

    private final UserRepository userRepository;
    private final FindTeamService findTeamService;
    private final FindCodeRepoService findCodeRepoService;
    private final FindFindingService findFindingService;
    private final CodeRepoBranchRepository codeRepoBranchRepository;
    private final ScanManagerService scanManagerService;
    private final FindingService findingService;

    public Boolean isValidApiKey(String apiKey, String repoUrl) {
        Optional<UserInfo> userOptional = userRepository.findByApiKey(apiKey);
        Optional<Team> codeRepoTeam = findTeamService.findByRepoUrl(repoUrl);

        if (userOptional.isEmpty() || codeRepoTeam.isEmpty()) {
            return false;
        }

        List<UserInfo> teamUsers = userRepository.getUsersByTeamId(codeRepoTeam.get().getId());

        if (teamUsers.contains(userOptional.get())) {
            log.info("[Team Service] User's {} API key validation succeeded", userOptional.get().getUsername());
            return true;
        } else {
            return false;
        }
    }

    public CodeRepo getCodeRepo(String repoUrl) {
        return findCodeRepoService.findCodeRepoByUrl(repoUrl).get();
    }

    public CodeRepoBranch getCodeRepoBranch(String branch, CodeRepo codeRepo) {
        return codeRepoBranchRepository.findByNameAndCodeRepo(branch, codeRepo).get();
    }

    public void runCodeRepoScan(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        scanManagerService.scanRepositoryViaGitLabCICD(codeRepo, codeRepoBranch, null, null);
    }

    public String createScanSummary(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, String domain) {
        GitLabCICDSummaryResponseDto scanSummary = new GitLabCICDSummaryResponseDto();

        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);

        Collection<Finding.Status> statuses = Arrays.asList(Finding.Status.NEW, Finding.Status.EXISTING);

        scanSummary.setTotalNumberOfFindings(findFindingService.findByCodeRepoAndCodeRepoBranchAndStatusIn(codeRepo, codeRepoBranch, statuses).size());

        scanSummary.setSastCritical(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.CRITICAL, statuses, Finding.Source.SAST).size());
        scanSummary.setSastHigh(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.HIGH, statuses, Finding.Source.SAST).size());
        scanSummary.setSastMedium(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.MEDIUM, statuses, Finding.Source.SAST).size());
        scanSummary.setSastInfoLow(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.LOW, statuses, Finding.Source.SAST).size() + findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.INFO, statuses, Finding.Source.SAST).size());

        scanSummary.setScaCritical(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.CRITICAL, statuses, Finding.Source.SCA).size());
        scanSummary.setScaHigh(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.HIGH, statuses, Finding.Source.SCA).size());
        scanSummary.setScaMedium(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.MEDIUM, statuses, Finding.Source.SCA).size());
        scanSummary.setScaInfoLow(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.LOW, statuses, Finding.Source.SCA).size() + findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.INFO, statuses, Finding.Source.SCA).size());

        scanSummary.setIacCritical(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.CRITICAL, statuses, Finding.Source.IAC).size());
        scanSummary.setIacHigh(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.HIGH, statuses, Finding.Source.IAC).size());
        scanSummary.setIacMedium(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.MEDIUM, statuses, Finding.Source.IAC).size());
        scanSummary.setIacInfoLow(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.LOW, statuses, Finding.Source.IAC).size() + findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.INFO, statuses, Finding.Source.IAC).size());

        scanSummary.setSecretsCritical(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.CRITICAL, statuses, Finding.Source.SECRETS).size());
        scanSummary.setSecretsHigh(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.HIGH, statuses, Finding.Source.SECRETS).size());
        scanSummary.setSecretsMedium(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.MEDIUM, statuses, Finding.Source.SECRETS).size());
        scanSummary.setSecretsInfoLow(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.LOW, statuses, Finding.Source.SECRETS).size() + findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.INFO, statuses, Finding.Source.SECRETS).size());

        scanSummary.setGitlabCritical(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.CRITICAL, statuses, Finding.Source.GITLAB_SCANNER).size());
        scanSummary.setGitlabHigh(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.HIGH, statuses, Finding.Source.GITLAB_SCANNER).size());
        scanSummary.setGitlabMedium(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.MEDIUM, statuses, Finding.Source.GITLAB_SCANNER).size());
        scanSummary.setGitlabInfoLow(findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.LOW, statuses, Finding.Source.GITLAB_SCANNER).size() + findFindingService.findByCodeRepoAndCodeRepoBranchAndSeverityAndStatusInAndSource(codeRepo, codeRepoBranch, Finding.Severity.INFO, statuses, Finding.Source.GITLAB_SCANNER).size());

        scanSummary.setLinkToScanDetails("https://" + domain + "/#/show-repo/" + codeRepo.getId());

        List<Finding> findings = findFindingService.findByCodeRepoAndCodeRepoBranchAndStatusIn(codeRepo, codeRepoBranch, statuses);

        List<Finding> urgentFindings = new ArrayList<>();
        List<Finding> notableFindings = new ArrayList<>();

        for (Finding finding : findings) {
            String urgency = findingService.calculateUrgency(finding);
            if ("urgent".equalsIgnoreCase(urgency)) {
                urgentFindings.add(finding);
            } else if ("notable".equalsIgnoreCase(urgency)) {
                notableFindings.add(finding);
            }
        }

        List<GitLabCICDDetailsResponseDto> urgentFindingsDetails = new ArrayList<>();

        for (Finding finding : urgentFindings) {
            GitLabCICDDetailsResponseDto urgentFindingsResponseDto = new GitLabCICDDetailsResponseDto();

            urgentFindingsResponseDto.setName(finding.getVulnerability().getName());
            urgentFindingsResponseDto.setDescription(finding.getVulnerability().getDescription());
            urgentFindingsResponseDto.setLocation(finding.getLocation());
            urgentFindingsResponseDto.setSource(String.valueOf(finding.getSource()));
            urgentFindingsResponseDto.setStatus(String.valueOf(finding.getStatus()));
            urgentFindingsResponseDto.setSeverity(String.valueOf(finding.getSeverity()));

            urgentFindingsDetails.add(urgentFindingsResponseDto);
        }

        List<GitLabCICDDetailsResponseDto> notableFindingsDetails = new ArrayList<>();

        for (Finding finding : notableFindings) {
            GitLabCICDDetailsResponseDto notableFindingsResponseDto = new GitLabCICDDetailsResponseDto();

            notableFindingsResponseDto.setName(finding.getVulnerability().getName());
            notableFindingsResponseDto.setDescription(finding.getVulnerability().getDescription());
            notableFindingsResponseDto.setLocation(finding.getLocation());
            notableFindingsResponseDto.setSource(String.valueOf(finding.getSource()));
            notableFindingsResponseDto.setStatus(String.valueOf(finding.getStatus()));
            notableFindingsResponseDto.setSeverity(String.valueOf(finding.getSeverity()));

            notableFindingsDetails.add(notableFindingsResponseDto);
        }

        scanSummary.setUrgentFindingsDetails(urgentFindingsDetails);
        scanSummary.setNotableFindingsDetails(notableFindingsDetails);

        try {
            return mapper.writeValueAsString(scanSummary);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
