package io.mixeway.mixewayflowapi.domain.finding;

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

    @Test
    void saveFindings() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        List<Finding> findings = createFindingService.mapSecretsToFindings(generateDummySecretsSecrets(),codeRepo.getDefaultBranch(), codeRepo);
        createFindingService.saveFindings(findings,codeRepo.getDefaultBranch(),codeRepo, Finding.Source.SECRETS);

        findings =createFindingService.mapKicsReportToFindings(generateDummyReportKics(),codeRepo, codeRepo.getDefaultBranch());
        createFindingService.saveFindings(findings,codeRepo.getDefaultBranch(),codeRepo, Finding.Source.IAC);

        findings =createFindingService.mapBearerScanToFindings(generateDummyReport(),codeRepo, codeRepo.getDefaultBranch());
        createFindingService.saveFindings(findings,codeRepo.getDefaultBranch(),codeRepo, Finding.Source.SAST);

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
}