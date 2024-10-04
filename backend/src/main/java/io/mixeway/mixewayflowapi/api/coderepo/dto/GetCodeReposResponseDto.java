package io.mixeway.mixewayflowapi.api.coderepo.dto;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import lombok.Data;

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

    public GetCodeReposResponseDto(CodeRepo codeRepo){
        this.id = codeRepo.getId();
        this.target = codeRepo.getName();
        this.repo_url = codeRepo.getRepourl();
        this.team = codeRepo.getTeam().getName();
        this.sast = codeRepo.getSastScan().name();
        this.iac = codeRepo.getIacScan().name();
        this.secrets = codeRepo.getSecretsScan().name();
        this.sca = codeRepo.getScaScan().name();
    }
    public GetCodeReposResponseDto(Long id, String target, String repoUrl, String team, CodeRepo.ScanStatus sast, CodeRepo.ScanStatus iac, CodeRepo.ScanStatus secrets, CodeRepo.ScanStatus sca) {
        this.id = id;
        this.target = target;
        this.repo_url = repoUrl;
        this.team = team;
        this.sast = sast.toString();
        this.iac = iac.toString();
        this.secrets = secrets.toString();
        this.sca = sca.toString();
    }


}
