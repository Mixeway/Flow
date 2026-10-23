package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CodeSearchServiceTest {

    @TempDir
    Path repo;

    private final CodeSearchService service = new CodeSearchService();

    @BeforeEach
    void setUp() throws IOException {
        write("src/main/java/app/Runner.java", "@Value(\"${script.path}\") String scriptPath;");
        write("src/main/resources/application.yml", "script:\n  path: /opt/app/run.sh\n");
        write("src/main/resources/application-prod.properties", "script.path=/opt/prod/run.sh\n");
        write("config/settings.py", "PRE_CONSUME_SCRIPT = os.getenv('PRE_CONSUME_SCRIPT')\n");
        write(".env", "PRE_CONSUME_SCRIPT=/usr/local/bin/consume.sh\n");
        write("web/appsettings.json", "{\"Script\": {\"Path\": \"/srv/run.sh\"}}\n");
        write("package-lock.json", "{\"script.path\": \"lockfile noise\"}\n");
        write("node_modules/lib/application.yml", "script:\n  path: vendored\n");
    }

    @Test
    void searchRepoReadsConfigFiles() {
        String yml = service.searchRepo(repo.toString(), "path: /opt/app", "");
        assertTrue(yml.contains("src/main/resources/application.yml:2"));

        String properties = service.searchRepo(repo.toString(), "script\\.path=", "");
        assertTrue(properties.contains("application-prod.properties:1"));

        String env = service.searchRepo(repo.toString(), "PRE_CONSUME_SCRIPT=", "");
        assertTrue(env.contains(".env:1"));

        String json = service.searchRepo(repo.toString(), "\"Path\"", "*.json");
        assertTrue(json.contains("web/appsettings.json:1"));
    }

    @Test
    void searchRepoSkipsLockfilesAndVendoredDirectories() {
        String result = service.searchRepo(repo.toString(), "script", "");
        assertFalse(result.contains("package-lock.json"));
        assertFalse(result.contains("node_modules"));
    }

    @Test
    void findFilesMatchesNamesAnywhereInTheTree() {
        String result = service.findFiles(repo.toString(), "application*");
        assertTrue(result.contains("src/main/resources/application.yml"));
        assertTrue(result.contains("src/main/resources/application-prod.properties"));
        assertFalse(result.contains("node_modules"));

        assertTrue(service.findFiles(repo.toString(), "settings*.py").contains("config/settings.py"));
        assertTrue(service.findFiles(repo.toString(), ".env*").contains(".env"));
        assertTrue(service.findFiles(repo.toString(), "web/*.json").contains("web/appsettings.json"));
    }

    @Test
    void findFilesReportsEmptyAndInvalidInput() {
        assertTrue(service.findFiles(repo.toString(), "*.gradle").startsWith("No matches found for glob"));
        assertTrue(service.findFiles(repo.toString(), "").startsWith("No results"));
        assertTrue(service.findFiles(repo.toString(), "[").startsWith("No results (invalid glob"));
    }

    private void write(String relative, String content) throws IOException {
        Path file = repo.resolve(relative);
        Files.createDirectories(file.getParent());
        Files.writeString(file, content);
    }
}
