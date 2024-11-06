package io.mixeway.mixewayflowapi.domain.dtrack;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.dto.DTrackGetVulnResponseDto;
import org.hibernate.Hibernate;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class ProcessDTrackVulnDataServiceTest {
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @Autowired
    ProcessDTrackVulnDataService processDTrackVulnDataService;
    @Autowired
    FindingRepository findingRepository;

    @Test
    void processVulnerabilities() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        int before = findingRepository.findByCodeRepoAndCodeRepoBranch(codeRepo, codeRepo.getDefaultBranch()).size();
        processDTrackVulnDataService.processVulnerabilities(generateDummyData(), codeRepo,codeRepo.getDefaultBranch());
        int after = findingRepository.findByCodeRepoAndCodeRepoBranch(codeRepo, codeRepo.getDefaultBranch()).size();
        assertTrue(after > before);
    }

    @Test
    @Transactional
    void processComponents() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        List<DTrackGetVulnResponseDto> dTrackGetVulnResponseDtos = generateDummyData();
        processDTrackVulnDataService.processComponents(dTrackGetVulnResponseDtos.get(0).getComponents(), codeRepo);
        codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        assertEquals(3, codeRepo.getComponents().size());
    }

    private static List<DTrackGetVulnResponseDto> generateDummyData() {
        List<DTrackGetVulnResponseDto> responseDtos = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            DTrackGetVulnResponseDto responseDto = new DTrackGetVulnResponseDto();
            responseDto.setVulnId("VULN-" + i);
            responseDto.setSource("Source " + i);
            responseDto.setDescription("Description " + i);
            responseDto.setPublished(Timestamp.from(Instant.now()));
            responseDto.setRecommendation("Recommendation " + i);
            responseDto.setReferences("References " + i);
            responseDto.setSeverity("Severity " + i);

            // Generate dummy components
            List<DTrackGetVulnResponseDto.Component> components = new ArrayList<>();
            for (int j = 0; j < 3; j++) {
                DTrackGetVulnResponseDto.Component component = new DTrackGetVulnResponseDto.Component();
                component.setGroup("Group " + j);
                component.setName("Name " + j);
                component.setVersion("Version " + j);
                component.setDescription("Component Description " + j);
                components.add(component);
            }
            responseDto.setComponents(components);

            responseDtos.add(responseDto);
        }

        return responseDtos;
    }
}