package io.mixeway.mixewayflowapi.domain.scaninfo;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import io.mixeway.mixewayflowapi.db.repository.ScanInfoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class CreateScanInfoServiceTest {
    @Autowired
    CreateScanInfoService createScanInfoService;
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @Autowired
    ScanInfoRepository scanInfoRepository;

    @Test
    void createOrUpdateScanInfo() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        createScanInfoService
                .createOrUpdateScanInfo(codeRepo,codeRepo.getDefaultBranch(),"321",
                        CodeRepo.ScanStatus.SUCCESS, CodeRepo.ScanStatus.SUCCESS, CodeRepo.ScanStatus.SUCCESS,
                        CodeRepo.ScanStatus.SUCCESS, CodeRepo.ScanStatus.SUCCESS,1,2,3,4,5,
                        6,7,8, 9, 10,3,4);
        Optional<ScanInfo> scanInfo = scanInfoRepository.findByCodeRepoAndCodeRepoBranchAndCommitId(codeRepo,codeRepo.getDefaultBranch(),"321");

        assertTrue(scanInfo.isPresent());
        createScanInfoService
                .createOrUpdateScanInfo(codeRepo,codeRepo.getDefaultBranch(),"321",
                        CodeRepo.ScanStatus.SUCCESS, CodeRepo.ScanStatus.SUCCESS, CodeRepo.ScanStatus.SUCCESS,
                        CodeRepo.ScanStatus.SUCCESS, CodeRepo.ScanStatus.SUCCESS, 100,2,3,4,5,
                        6,7,8, 9 ,10,
                        3,4);
        scanInfo = scanInfoRepository.findByCodeRepoAndCodeRepoBranchAndCommitId(codeRepo,codeRepo.getDefaultBranch(),"321");
        assertTrue(scanInfo.isPresent());
        assertEquals(100, scanInfo.get().getScaHigh());
    }
}