package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoBranchRepository;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import jakarta.persistence.EntityManager;
import java.util.stream.Collectors;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.integrations.scanner.iac.dto.KicsReport;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanSecurity;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.CodeLocation;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Column;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import io.mixeway.mixewayflowapi.integrations.scanner.secrets.dto.Secret;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class CreateFindingServiceTest {
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @Autowired
    CreateFindingService findingService;
    @Autowired
    private CreateFindingService createFindingService;
    @Autowired
    FindFindingService findFindingService;

    @Autowired
    UpdateFindingService updateFindingService;
    @Autowired
    CodeRepoBranchRepository codeRepoBranchRepository;

    @Test
    void saveFindings() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        List<Finding> findings = createFindingService.mapSecretsToFindings(generateDummySecretsSecrets(),codeRepo.getDefaultBranch(), codeRepo);
        createFindingService.saveFindings(findings,codeRepo.getDefaultBranch(),codeRepo, Finding.Source.SECRETS, null);

        findings =createFindingService.mapKicsReportToFindings(generateDummyReportKics(),codeRepo, codeRepo.getDefaultBranch());
        createFindingService.saveFindings(findings,codeRepo.getDefaultBranch(),codeRepo, Finding.Source.IAC, null);

        findings =createFindingService.mapBearerScanToFindings(generateDummyReport(),codeRepo, codeRepo.getDefaultBranch());
        createFindingService.saveFindings(findings,codeRepo.getDefaultBranch(),codeRepo, Finding.Source.SAST, null);

        List<Finding> findingList = findFindingService.getCodeRepoFindings(codeRepo, codeRepo.getDefaultBranch());
        assertTrue(findings.size() > 10);

    }

    @Test
    void mapSecretsToFindings() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);

        List<Finding> findings = createFindingService.mapSecretsToFindings(generateDummySecretsSecrets(),codeRepo.getDefaultBranch(), codeRepo);
        assertTrue(findings.size() > 4);
    }

    @Test
    void mapKicsReportToFindings() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);

        List<Finding> findings = createFindingService.mapKicsReportToFindings(generateDummyReportKics(),codeRepo, codeRepo.getDefaultBranch());
        assertTrue(findings.size() >= 2);
    }

    @Test
    void mapBearerScanToFindings() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);

        List<Finding> findings = createFindingService.mapBearerScanToFindings(generateDummyReport(),codeRepo, codeRepo.getDefaultBranch());
        assertTrue(findings.size() > 10);
    }

    private static BearerScanSecurity generateDummyReport() {
        BearerScanSecurity report = new BearerScanSecurity();

        // Generate 3 critical items
        List<Item> criticalItems = generateItems("Critical", 3);
        report.setCritical(criticalItems);

        // Generate 3 high items
        List<Item> highItems = generateItems("High", 3);
        report.setHigh(highItems);

        // Generate 3 medium items
        List<Item> mediumItems = generateItems("Medium", 3);
        report.setMedium(mediumItems);

        // Generate 3 low items
        List<Item> lowItems = generateItems("Low", 3);
        report.setLow(lowItems);

        return report;
    }

    private static List<Item> generateItems(String severity, int count) {
        List<Item> items = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            Item item = new Item();
            item.setId("ITEM-" + i);
            item.setTitle(severity + " Item " + i);
            item.setDescription("Description for " + severity + " Item " + i);
            item.setDocumentationUrl("https://example.com/documentation/" + i);
            item.setLineNumber(i + 1);
            item.setFullFilename("file" + i + ".java");
            item.setFilename("file" + i + ".java");
            item.setCategoryGroups(List.of("Category 1", "Category 2"));

            // Generate dummy code locations
            CodeLocation source = new CodeLocation();
            source.setStart(i + 1);
            source.setEnd(i + 10);
            source.setColumn(new Column(i + 1, i + 10));
            item.setSource(source);

            CodeLocation sink = new CodeLocation();
            sink.setStart(i + 11);
            sink.setEnd(i + 20);
            sink.setColumn(new Column(i + 11, i + 20));
            item.setSink(sink);

            item.setParentLineNumber(i + 1);
            item.setFingerprint("FINGERPRINT-" + i);
            item.setCodeExtract("Code extract for " + severity + " Item " + i);

            items.add(item);
        }
        return items;
    }

    private static KicsReport generateDummyReportKics() {
        KicsReport report = new KicsReport();

        report.setKicsVersion("1.0.0");
        report.setFilesScanned(100);
        report.setLinesScanned(1000);
        report.setFilesParsed(80);
        report.setLinesParsed(800);
        report.setLinesIgnored(200);
        report.setFilesFailedToScan(2);
        report.setQueriesTotal(50);
        report.setQueriesFailedToExecute(1);
        report.setQueriesFailedToComputeSimilarityId(0);
        report.setScanId("scan-12345");

        // Generate severity counters
        KicsReport.SeverityCounters severityCounters = new KicsReport.SeverityCounters();
        severityCounters.setCritical(5);
        severityCounters.setHigh(10);
        severityCounters.setInfo(15);
        severityCounters.setLow(20);
        severityCounters.setMedium(25);
        severityCounters.setTrace(0);
        report.setSeverityCounters(severityCounters);

        report.setTotalCounter(75);
        report.setTotalBomResources(30);
        report.setStart("2024-08-23T20:00:00Z");
        report.setEnd("2024-08-23T21:00:00Z");

        // Generate dummy paths
        List<String> paths = new ArrayList<>();
        paths.add("path/to/file1.txt");
        paths.add("path/to/file2.java");
        paths.add("path/to/folder/");
        report.setPaths(paths);

        // Generate dummy queries (limited to 2 for brevity)
        List<KicsReport.Query> queries = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            KicsReport.Query query = new KicsReport.Query();
            query.setQueryName("Query Name " + i);
            query.setQueryId("query-id-" + i);
            query.setQueryUrl("https://example.com/queries/" + i);
            query.setSeverity("HIGH");
            query.setPlatform("Linux");
            query.setCwe("CWE-123");
            query.setCategory("Security");
            query.setExperimental(false);
            query.setDescription("Description for Query " + i);
            query.setDescriptionId("description-id-" + i);

            // Generate dummy file issues (limited to 1 for brevity)
            List<KicsReport.Query.FileIssue> files = new ArrayList<>();
            KicsReport.Query.FileIssue fileIssue = new KicsReport.Query.FileIssue();
            fileIssue.setFileName("file1.txt");
            fileIssue.setSimilarityId("similarity-id-1");
            fileIssue.setLine(10);
            fileIssue.setIssueType("Finding");
            fileIssue.setSearchKey("password");
            fileIssue.setSearchLine(10);
            fileIssue.setSearchValue("plain_text");
            fileIssue.setExpectedValue("hashed_value");
            fileIssue.setActualValue("plain_text");
            files.add(fileIssue);
            query.setFiles(files);

            queries.add(query);
        }
        report.setQueries(queries);

        return report;
    }

    private static List<Secret> generateDummySecretsSecrets() {
        List<Secret> secrets = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            Secret secret = new Secret();
            secret.setDescription("Secret " + i);
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

    @Test
    @Transactional
    void autoSuppressAcrossBranches_ok() {
        // Arrange: repo and three branches
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        CodeRepoBranch branch1 = codeRepo.getDefaultBranch();

        CodeRepoBranch branch2 = new CodeRepoBranch("feature/test-2",codeRepo);
        codeRepoBranchRepository.save(branch2);

        CodeRepoBranch branch3 = new CodeRepoBranch("feature/test-3",codeRepo);
        codeRepoBranchRepository.save(branch3);

        // Prepare 10 findings (take first 10 from bearer mapping)
        BearerScanSecurity dummyReport = generateDummyReport();
        List<Finding> base = createFindingService.mapBearerScanToFindings(dummyReport, codeRepo, branch1);
        List<Finding> tenFindings = base.stream().limit(10).collect(Collectors.toList());

        // Save to branch1/2/3
        createFindingService.saveFindings(tenFindings, branch1, codeRepo, Finding.Source.SAST, null);
        // remap new instances for each branch (entity graphs shouldn't be reused across branches)
        List<Finding> tenFindingsB2 = createFindingService.mapBearerScanToFindings(dummyReport, codeRepo, branch2)
                .stream().limit(10).collect(Collectors.toList());
        createFindingService.saveFindings(tenFindingsB2, branch2, codeRepo, Finding.Source.SAST, null);

        List<Finding> tenFindingsB3 = createFindingService.mapBearerScanToFindings(dummyReport, codeRepo, branch3)
                .stream().limit(10).collect(Collectors.toList());
        createFindingService.saveFindings(tenFindingsB3, branch3, codeRepo, Finding.Source.SAST, null);

        // Act: pick a concrete persisted finding from branch1 and suppress across branches
        List<Finding> branch1Persisted = findFindingService.getCodeRepoFindings(codeRepo, branch1);
        List<Finding> branch2Persisted = findFindingService.getCodeRepoFindings(codeRepo, branch2);
        List<Finding> branch3Persisted = findFindingService.getCodeRepoFindings(codeRepo, branch3);
        assertTrue(branch1Persisted.size() >= 10, "Expected at least 10 findings on branch1");
        Finding toSuppress = branch2Persisted.get(0);
        assertTrue(branch1Persisted.stream().anyMatch(f -> f.getVulnerability().getId() == toSuppress.getVulnerability().getId() && f.getLocation().equals(toSuppress.getLocation())));
        assertTrue(branch2Persisted.stream().anyMatch(f -> f.getVulnerability().getId() == toSuppress.getVulnerability().getId() && f.getLocation().equals(toSuppress.getLocation())));
        assertTrue(branch3Persisted.stream().anyMatch(f -> f.getVulnerability().getId() == toSuppress.getVulnerability().getId() && f.getLocation().equals(toSuppress.getLocation())));

        updateFindingService.suppressFindingAcrossBranches(toSuppress,
                toSuppress.getId(),
                toSuppress.getLocation(),
                toSuppress.getVulnerability().getId(),
                "ACCEPTED");

        // Assert: the chosen (vuln, location) is suppressed on every branch
        for (CodeRepoBranch b : List.of(branch1, branch2, branch3)) {
            List<Finding> list = findFindingService.getCodeRepoFindings(codeRepo, b);
            long suppressedMatches = list.stream()
                    .filter(f -> f.getVulnerability().getId()==(toSuppress.getVulnerability().getId()))
                    .filter(f -> f.getLocation().equals(toSuppress.getLocation()))
                    .filter(f -> f.getStatus() == Finding.Status.SUPRESSED)
                    .count();
            assertEquals(1, suppressedMatches, "Exactly one matching finding should be SUPRESSED on branch " + b.getName());

            long newOrExisting = list.stream()
                    .filter(f -> f.getStatus() == Finding.Status.NEW || f.getStatus() == Finding.Status.EXISTING)
                    .count();

            // Default branch may already have findings; enforce 9 only on newly created branches
            if (!b.equals(branch1)) {
                assertEquals(9, newOrExisting, "Each NEW branch should have 9 NEW/EXISTING after suppression on branch " + b.getName());
            }
        }
    }
    @Test
    @Transactional
    void suppressionPersistsToNewBranch_ok() {
        // 1) repo + first new branch
        CodeRepo repo = findCodeRepoService.findByRemoteId(14493750L);
        CodeRepoBranch branchA = new CodeRepoBranch("feature/seed-suppress", repo);
        codeRepoBranchRepository.save(branchA);

        // 2) generate & save findings on branchA
        List<Finding> seed = createFindingService
                .mapBearerScanToFindings(generateDummyReport(), repo, branchA)
                .stream().limit(10).collect(java.util.stream.Collectors.toList());
        createFindingService.saveFindings(seed, branchA, repo, Finding.Source.SAST, null);

        // pick one persisted finding to suppress (take exact vulnId + location)
        List<Finding> aPersisted = findFindingService.getCodeRepoFindings(repo, branchA);
        assertTrue(aPersisted.size() >= 10, "Expected at least 10 findings on branchA");
        Finding toSuppress = aPersisted.get(0);

        // 3) suppress that one across branches (by repoId + vulnId + location)
        updateFindingService.suppressFindingAcrossBranches(toSuppress,
                toSuppress.getId(),
                toSuppress.getLocation(),
                toSuppress.getVulnerability().getId(),
                "ACCEPTED");

        // 4) create a second new branch (after suppression)
        CodeRepoBranch branchB = new CodeRepoBranch("feature/follow-up", repo);
        codeRepoBranchRepository.save(branchB);

        // 5) save the *same* findings to the new branch
        // Re-generate from the same report so they map to the same vulnId if your model reuses Vulnerability per repo.
        List<Finding> again = createFindingService
                .mapBearerScanToFindings(generateDummyReport(), repo, branchB)
                .stream().limit(10).collect(java.util.stream.Collectors.toList());
        createFindingService.saveFindings(again, branchB, repo, Finding.Source.SAST, null);

        // 6) expect the corresponding finding on branchB to be SUPRESSED
        List<Finding> bPersisted = findFindingService.getCodeRepoFindings(repo, branchB);

        long suppressedMatches = bPersisted.stream()
                .filter(f -> f.getVulnerability().getId()==(toSuppress.getVulnerability().getId()))
                .filter(f -> f.getLocation().equals(toSuppress.getLocation()))
                .filter(f -> f.getStatus() == Finding.Status.SUPRESSED)
                .count();

        assertEquals(1, suppressedMatches,
                "New branch should inherit suppression for the same vulnId+location");

        long newOrExisting = bPersisted.stream()
                .filter(f -> f.getStatus() == Finding.Status.NEW || f.getStatus() == Finding.Status.EXISTING)
                .count();
        assertEquals(9, newOrExisting, "Exactly one finding should be suppressed on the new branch");
    }
}