package io.mixeway.mixewayflowapi.api.cicd.service;

import io.mixeway.mixewayflowapi.api.cicd.dto.CodeRepoDto;
import io.mixeway.mixewayflowapi.api.cicd.dto.ValidateStatusDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class CICDService {
    private final FindCodeRepoService findCodeRepoService;
    private final GetOrCreateCodeRepoBranchService getOrCreateCodeRepoBranchService;
    private final FindFindingService findFindingService;
    private final ValidateStatusMapper validateStatusMapper;

    public ResponseEntity<ValidateStatusDto> validateCodeRepo(CodeRepoDto codeRepoDto){
        Optional<CodeRepo> repo =findCodeRepoService.findCodeRepoByUrl(codeRepoDto.getRepoUrl());
        if (repo.isPresent() && repo.get().isScanNotRunning()){
            CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(codeRepoDto.getBranch(), repo.get());

            List<Finding> findings = findFindingService.getCodeRepoFindings(repo.get(), codeRepoBranch);
            ValidateStatusDto validateStatusDto = validateStatusMapper.mapFindingsToValidateStatusDto(findings);
            return new ResponseEntity<>(validateStatusDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.LOCKED);
        }

    }
}
