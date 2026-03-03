package io.mixeway.mixewayflowapi.api.coderepo.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.GetFindingResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Constraint;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FindingServiceTest {

    @Mock
    FindCodeRepoService findCodeRepoService;
    @Mock
    FindFindingService findFindingService;
    @InjectMocks
    FindingService findingService;

    @Test
    void getFinding_shouldPopulateVulnerabilityDetails() {
        // Arrange
        Long repoId = 1L;
        Long findingId = 2L;
        Principal principal = mock(Principal.class);

        // Use reflection to create CodeRepo since constructor is protected
        CodeRepo codeRepo = mock(CodeRepo.class);
        lenient().when(codeRepo.getId()).thenReturn(repoId);

        Vulnerability vulnerability = new Vulnerability("CVE-2023-1234", "Desc", "Ref", "Rec", Finding.Severity.HIGH,
                BigDecimal.ONE, BigDecimal.TEN, true);
        vulnerability.setVector("CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H");
        vulnerability.setBaseScore("9.8");

        List<Constraint> constraints = new ArrayList<>();
        constraints.add(new Constraint("Constraint 1"));
        vulnerability.setConstraints(constraints);

        Finding finding = new Finding(vulnerability, null, null, codeRepo, null, "Explanation", "Location",
                Finding.Severity.HIGH, Finding.Source.SAST);
        setField(finding, "id", findingId);
        setField(finding, "insertedDate", java.time.LocalDateTime.now());
        setField(finding, "updatedDate", java.time.LocalDateTime.now());

        // finding.setComments(new ArrayList<>()); // Comments are initialized in
        // constructor/field declaration

        when(findCodeRepoService.findById(anyLong(), any())).thenReturn(codeRepo);
        when(findFindingService.findById(anyLong())).thenReturn(Optional.of(finding));

        // Act
        GetFindingResponseDto result = findingService.getFinding(repoId, findingId, principal);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getVulnerabilityDetails());
        assertEquals("CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", result.getVulnerabilityDetails().getVector());
        assertEquals("9.8", result.getVulnerabilityDetails().getBaseScore());
        assertNotNull(result.getVulnerabilityDetails().getConstraints());
        assertEquals(1, result.getVulnerabilityDetails().getConstraints().size());
        assertEquals("Constraint 1", result.getVulnerabilityDetails().getConstraints().get(0).getText());
    }

    private void setField(Object target, String fieldName, Object value) {
        try {
            java.lang.reflect.Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set field " + fieldName, e);
        }
    }
}
