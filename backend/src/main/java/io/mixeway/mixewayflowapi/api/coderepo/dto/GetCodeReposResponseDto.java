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

}
