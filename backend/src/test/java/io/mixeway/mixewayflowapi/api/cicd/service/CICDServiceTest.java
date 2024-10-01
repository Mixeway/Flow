package io.mixeway.mixewayflowapi.api.cicd.service;

import io.mixeway.mixewayflowapi.api.cicd.dto.CodeRepoDto;
import io.mixeway.mixewayflowapi.api.cicd.dto.ValidateStatusDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.shaded.org.checkerframework.checker.units.qual.A;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class CICDServiceTest {
    @Autowired
    private FindCodeRepoService findCodeRepoService;
    @Autowired
    private CICDService cicdService;
    @Autowired
    UpdateCodeRepoService updateCodeRepoService;
    @Autowired
    CodeRepoRepository codeRepoRepository;


    @Test
    void validateCodeRepo() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        CodeRepoDto codeRepoDto = new CodeRepoDto();
        codeRepoDto.setRepoUrl(codeRepo.getRepourl());
        codeRepoDto.setBranch(codeRepo.getDefaultBranch().getName());
        ResponseEntity<ValidateStatusDto> validateStatusDtoResponseEntity = cicdService.validateCodeRepo(codeRepoDto);
        assertEquals(validateStatusDtoResponseEntity.getStatusCode(), HttpStatus.OK);
        assertEquals("DANGER", validateStatusDtoResponseEntity.getBody().getResult());

        codeRepo.updateSecretsScanStatus(CodeRepo.ScanStatus.RUNNING);
        codeRepoRepository.save(codeRepo);
        validateStatusDtoResponseEntity = cicdService.validateCodeRepo(codeRepoDto);
        assertEquals(HttpStatus.LOCKED,validateStatusDtoResponseEntity.getStatusCode() );

        updateCodeRepoService.setScanRunning(codeRepo);
        validateStatusDtoResponseEntity = cicdService.validateCodeRepo(codeRepoDto);
        assertEquals(HttpStatus.LOCKED,validateStatusDtoResponseEntity.getStatusCode() );
    }
}