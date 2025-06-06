package io.mixeway.mixewayflowapi.api.coderepo.dto;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import lombok.Data;

import java.util.List;

@Data
public class GetCodeReposResponseDto {
    Long id;
    String target;
    String repo_url;
    String team;
    String sast;
    String iac;
    String sca;
    String secrets;
    String gitlab;
    List<ScanInfo> scanInfos;

    public GetCodeReposResponseDto(CodeRepo codeRepo){
        this.id = codeRepo.getId();
        this.target = codeRepo.getName();
        this.repo_url = codeRepo.getRepourl();
        this.team = codeRepo.getTeam().getName();
        this.sast = codeRepo.getSastScan().name();
        this.iac = codeRepo.getIacScan().name();
        this.secrets = codeRepo.getSecretsScan().name();
        this.sca = codeRepo.getScaScan().name();
        this.gitlab = codeRepo.getGitlabScan().name();
        this.scanInfos = codeRepo.getScanInfos();
    }
    public GetCodeReposResponseDto(Long id, String target, String repoUrl, String team, CodeRepo.ScanStatus sast, CodeRepo.ScanStatus iac, CodeRepo.ScanStatus secrets, CodeRepo.ScanStatus sca, CodeRepo.ScanStatus gitlab) {
        this.id = id;
        this.target = target;
        this.repo_url = repoUrl;
        this.team = team;
        this.sast = sast.toString();
        this.iac = iac.toString();
        this.secrets = secrets.toString();
        this.sca = sca.toString();
        this.gitlab = gitlab.toString();
    }
}
