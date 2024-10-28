package io.mixeway.mixewayflowapi.domain.suppressrule;

import io.mixeway.mixewayflowapi.api.threatintel.controller.SuppressRuleController;
import io.mixeway.mixewayflowapi.api.threatintel.dto.SuppressRuleDTO;
import io.mixeway.mixewayflowapi.api.threatintel.dto.SuppressRuleResponseDTO;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.SuppressRule;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.integrations.scanner.secrets.dto.Secret;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class CreateSuppressRuleServiceTest {

    @Autowired
    private CreateSuppressRuleService createSuppressRuleService;

    @Autowired
    private FindCodeRepoService findCodeRepoService;

    @Autowired
    private CreateFindingService createFindingService;

    @Autowired
    private FindFindingService findFindingService;

    @Autowired
    private SuppressRuleController suppressRuleController;

    @Mock
    private Principal principal;

    @BeforeEach
    void setUp() {
        Mockito.when(principal.getName()).thenReturn("admin");

        // Set up authentication
        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("USER"),
                new SimpleGrantedAuthority("ADMIN"),
                new SimpleGrantedAuthority("TEAM_MANAGER")
        );

        Authentication authentication = new UsernamePasswordAuthenticationToken("admin", null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    /**
     * Tests creating a global suppress rule and ensures it is created successfully.
     */
    @Test
    void testCreateGlobalRule() {
        SuppressRuleDTO suppressRuleDTO = new SuppressRuleDTO();
        suppressRuleDTO.setScope("GLOBAL");
        suppressRuleDTO.setVulnerabilityId("GCP API key");

        SuppressRule suppressRule = createSuppressRuleService.createRule(suppressRuleDTO, principal);
        assertNotNull(suppressRule);

        // Clean up
        suppressRuleController.deleteRule(principal, suppressRule.getId());
    }

    /**
     * Tests that attempting to create a duplicate global suppress rule throws an IllegalArgumentException.
     */
    @Test
    void testCreateDuplicateGlobalRule() {
        SuppressRuleDTO suppressRuleDTO = new SuppressRuleDTO();
        suppressRuleDTO.setScope("GLOBAL");
        suppressRuleDTO.setVulnerabilityId("GCP API key");

        SuppressRule suppressRule = createSuppressRuleService.createRule(suppressRuleDTO, principal);
        assertNotNull(suppressRule);

        // Attempt to create a duplicate rule
        assertThrows(IllegalArgumentException.class, () -> {
            createSuppressRuleService.createRule(suppressRuleDTO, principal);
        });

        // Clean up
        suppressRuleController.deleteRule(principal, suppressRule.getId());
    }

    /**
     * Tests that creating a project suppress rule without specifying codeRepoId throws an IllegalArgumentException.
     */
    @Test
    void testCreateProjectRuleWithoutCodeRepoId() {
        SuppressRuleDTO suppressRuleDTO = new SuppressRuleDTO();
        suppressRuleDTO.setScope("PROJECT");
        suppressRuleDTO.setVulnerabilityId("GCP API key");

        // Expect exception due to missing codeRepoId
        assertThrows(IllegalArgumentException.class, () -> {
            createSuppressRuleService.createRule(suppressRuleDTO, principal);
        });
    }

    /**
     * Tests creating a project suppress rule with a valid codeRepoId.
     */
    @Test
    void testCreateProjectRuleWithCodeRepoId() {
        SuppressRuleDTO suppressRuleDTO = new SuppressRuleDTO();
        suppressRuleDTO.setScope("PROJECT");
        suppressRuleDTO.setCodeRepoId(1L);
        suppressRuleDTO.setVulnerabilityId("GCP API key");

        SuppressRule suppressRule = createSuppressRuleService.createRule(suppressRuleDTO, principal);
        assertNotNull(suppressRule);

        // Clean up
        suppressRuleController.deleteRule(principal, suppressRule.getId());
    }

    /**
     * Tests creating a team suppress rule and verifies it is created successfully.
     */
    @Test
    void testCreateTeamRule() {
        SuppressRuleDTO suppressRuleDTO = new SuppressRuleDTO();
        suppressRuleDTO.setScope("TEAM");
        suppressRuleDTO.setTeamId(1L);
        suppressRuleDTO.setVulnerabilityId("Generic API Key");

        SuppressRule suppressRule = createSuppressRuleService.createRule(suppressRuleDTO, principal);
        assertNotNull(suppressRule);

        // Clean up
        suppressRuleController.deleteRule(principal, suppressRule.getId());
    }

    /**
     * Tests that a global suppress rule is correctly applied to suppress relevant findings.
     */
    @Test
    void testSuppressRuleAppliedToFindings() {
        // Create suppress rule
        SuppressRuleDTO suppressRuleDTO = new SuppressRuleDTO();
        suppressRuleDTO.setScope("GLOBAL");
        suppressRuleDTO.setVulnerabilityId("Leakage of sensitive information in exception message");
        SuppressRule suppressRule = createSuppressRuleService.createRule(suppressRuleDTO, principal);
        assertNotNull(suppressRule);

        // Generate findings
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        List<Finding> findings = createFindingService.mapSecretsToFindings(
                generateDummySecrets(), codeRepo.getDefaultBranch(), codeRepo);
        createFindingService.saveFindings(findings, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.SECRETS);

        // Retrieve and assert findings are suppressed
        List<Finding> findingList = findFindingService.getCodeRepoFindings(codeRepo, codeRepo.getDefaultBranch());
        long suppressedCount = findingList.stream()
                .filter(f -> f.getStatus().equals(Finding.Status.SUPRESSED))
                .count();
        assertTrue(suppressedCount > 4);

        // Clean up
        suppressRuleController.deleteRule(principal, suppressRule.getId());
    }

    /**
     * Tests creating a suppress rule via the controller and verifies its addition and subsequent deletion.
     */
    @Test
    void testCreateSuppressRuleViaController() {
        // Retrieve initial suppress rules
        List<SuppressRuleResponseDTO> initialRules = suppressRuleController.getSuppressRules(principal);

        // Create a new suppress rule
        SuppressRuleDTO suppressRuleDTO = new SuppressRuleDTO();
        suppressRuleDTO.setScope("GLOBAL");
        suppressRuleDTO.setVulnerabilityId("Multiple RUN, ADD, COPY, Instructions Listed");

        ResponseEntity<StatusDTO> responseEntity = suppressRuleController.createRule(principal, suppressRuleDTO);
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());

        // Verify the new rule is added
        List<SuppressRuleResponseDTO> updatedRules = suppressRuleController.getSuppressRules(principal);
        assertTrue(updatedRules.size() > initialRules.size());

        // Clean up by deleting the new rule
        SuppressRuleResponseDTO createdRule = updatedRules.stream()
                .filter(sr -> sr.getVulnerabilityName().equals("Multiple RUN, ADD, COPY, Instructions Listed"))
                .findFirst()
                .orElse(null);
        assertNotNull(createdRule);

        ResponseEntity<StatusDTO> deleteResponse = suppressRuleController.deleteRule(principal, createdRule.getId());
        assertEquals(HttpStatus.OK, deleteResponse.getStatusCode());

        // Verify the rule is removed
        List<SuppressRuleResponseDTO> finalRules = suppressRuleController.getSuppressRules(principal);
        assertEquals(initialRules.size(), finalRules.size());
    }

    /**
     * Tests that creating a suppress rule with an invalid scope returns a BAD_REQUEST response.
     */
    @Test
    void testCreateSuppressRuleWithInvalidScope() {
        SuppressRuleDTO suppressRuleDTO = new SuppressRuleDTO();
        suppressRuleDTO.setScope("DUMMY");
        suppressRuleDTO.setVulnerabilityId("Multiple RUN, ADD, COPY, Instructions Listed");

        ResponseEntity<StatusDTO> responseEntity = suppressRuleController.createRule(principal, suppressRuleDTO);
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
    }

    /**
     * Tests retrieving suppress rules via the controller to ensure the list is not null.
     */
    @Test
    void testGetSuppressRules() {
        List<SuppressRuleResponseDTO> suppressRules = suppressRuleController.getSuppressRules(principal);
        assertNotNull(suppressRules);
        // Additional assertions can be added based on expected behavior
    }

    /**
     * Helper method to generate a list of dummy secrets for testing purposes.
     *
     * @return List of Secret objects with dummy data.
     */
    private static List<Secret> generateDummySecrets() {
        List<Secret> secrets = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            Secret secret = new Secret();
            secret.setDescription("Leakage of sensitive information in exception message");
            secret.setStartLine(i + 1);
            secret.setEndLine(i + 10);
            secret.setStartColumn(i + 1);
            secret.setEndColumn(i + 10);
            secret.setMatch("Match " + i);
            secret.setSecret("secret" + i);
            secret.setFile("file" + i + ".txt");
            secret.setSymlinkFile("symlink" + i + ".txt");
            secret.setCommit("commit" + i);
            secret.setEntropy(i + 0.1);
            secret.setAuthor("Author " + i);
            secret.setEmail("author" + i + "@example.com");
            secret.setDate("2023-12-31");
            secret.setMessage("Message " + i);
            secret.setTags(List.of("tag1", "tag2"));
            secret.setRuleId("rule-" + i);
            secret.setFingerprint("fingerprint-" + i);

            secrets.add(secret);
        }

        return secrets;
    }
}