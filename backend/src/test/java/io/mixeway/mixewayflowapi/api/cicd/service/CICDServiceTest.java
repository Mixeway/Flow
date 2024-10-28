package io.mixeway.mixewayflowapi.api.cicd.service;

import io.mixeway.mixewayflowapi.api.cicd.dto.CodeRepoDto;
import io.mixeway.mixewayflowapi.api.cicd.dto.ValidateStatusDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

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
    private UpdateCodeRepoService updateCodeRepoService;

    @Autowired
    private CodeRepoRepository codeRepoRepository;

    private CodeRepo codeRepo;
    private CodeRepoDto codeRepoDto;

    @BeforeEach
    void setUp() {
        // Initialize CodeRepo and CodeRepoDto before each test
        codeRepo = findCodeRepoService.findByRemoteId(14493750L);

        // Reset the scan statuses to default (IDLE)
        codeRepo.updateSecretsScanStatus(CodeRepo.ScanStatus.NOT_PERFORMED);
        codeRepo.updateScaScanStatus(CodeRepo.ScanStatus.NOT_PERFORMED);
        codeRepo.updateSastScanStatus(CodeRepo.ScanStatus.NOT_PERFORMED);
        codeRepo.updateIacScanStatus(CodeRepo.ScanStatus.NOT_PERFORMED);
        codeRepoRepository.save(codeRepo);

        codeRepoDto = new CodeRepoDto();
        codeRepoDto.setRepoUrl(codeRepo.getRepourl());
        codeRepoDto.setBranch(codeRepo.getDefaultBranch().getName());
    }

    /**
     * Test that validateCodeRepo returns OK status and "DANGER" result
     * when the code repository is in its default state.
     */
    @Test
    void testValidateCodeRepo_DefaultState() {
        ResponseEntity<ValidateStatusDto> response = cicdService.validateCodeRepo(codeRepoDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("DANGER", response.getBody().getResult());
    }

    /**
     * Test that validateCodeRepo returns LOCKED status when the secrets scan
     * status of the code repository is set to RUNNING.
     */
    @Test
    void testValidateCodeRepo_SecretsScanRunning() {
        // Set the secrets scan status to RUNNING
        codeRepo.updateSecretsScanStatus(CodeRepo.ScanStatus.RUNNING);
        codeRepoRepository.save(codeRepo);

        ResponseEntity<ValidateStatusDto> response = cicdService.validateCodeRepo(codeRepoDto);

        assertEquals(HttpStatus.LOCKED, response.getStatusCode());
    }

    /**
     * Test that validateCodeRepo returns LOCKED status when a general scan
     * is running on the code repository.
     */
    @Test
    void testValidateCodeRepo_ScanRunning() {
        // Set the general scan status to RUNNING
        updateCodeRepoService.setScanRunning(codeRepo);

        ResponseEntity<ValidateStatusDto> response = cicdService.validateCodeRepo(codeRepoDto);

        assertEquals(HttpStatus.LOCKED, response.getStatusCode());
    }
}