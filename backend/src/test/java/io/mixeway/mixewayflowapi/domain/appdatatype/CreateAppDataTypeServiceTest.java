package io.mixeway.mixewayflowapi.domain.appdatatype;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanDataflow;
import org.hibernate.Hibernate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class CreateAppDataTypeServiceTest {

    @Autowired
    private CreateAppDataTypeService createAppDataTypeService;

    @Autowired
    private FindCodeRepoService findCodeRepoService;

    @Autowired
    private CodeRepoRepository codeRepoRepository;

    private CodeRepo codeRepo;

    @BeforeEach
    void setUp() {
        // Initialize CodeRepo before each test
        codeRepo = findCodeRepoService.findByRemoteId(14493750L);

        // Clear existing AppDataTypes to ensure test isolation
        codeRepo.getAppDataTypes().clear();
        codeRepoRepository.save(codeRepo);
    }

    /**
     * Test that getDataTypesForCodeRepo correctly adds AppDataTypes
     * to the CodeRepo when provided with valid BearerScanDataflow data.
     */
    @Test
    @Transactional
    void testGetDataTypesForCodeRepo_WithValidData() {
        BearerScanDataflow bearerScanDataflow = createDummyBearerScanDataflow();

        createAppDataTypeService.getDataTypesForCodeRepo(codeRepo, bearerScanDataflow);

        codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        assertEquals(3, codeRepo.getAppDataTypes().size(), "Should have 3 AppDataTypes");
    }

    /**
     * Test that getDataTypesForCodeRepo throws NullPointerException
     * when provided with null BearerScanDataflow.
     */
    @Test
    @Transactional
    void testGetDataTypesForCodeRepo_WithNullData() {
        assertThrows(NullPointerException.class, () -> {
            createAppDataTypeService.getDataTypesForCodeRepo(codeRepo, null);
        });
    }

    /**
     * Test that getDataTypesForCodeRepo does not add duplicate AppDataTypes
     * when called multiple times with the same data.
     */
    @Test
    @Transactional
    void testGetDataTypesForCodeRepo_NoDuplicateAppDataTypes() {
        BearerScanDataflow bearerScanDataflow = createDummyBearerScanDataflow();

        // First call
        createAppDataTypeService.getDataTypesForCodeRepo(codeRepo, bearerScanDataflow);
        codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        int firstCallSize = codeRepo.getAppDataTypes().size();

        // Second call with the same data
        createAppDataTypeService.getDataTypesForCodeRepo(codeRepo, bearerScanDataflow);
        codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        int secondCallSize = codeRepo.getAppDataTypes().size();

        assertEquals(firstCallSize, secondCallSize, "AppDataTypes size should remain the same without duplicates");
    }

    /**
     * Test that getDataTypesForCodeRepo handles an empty BearerScanDataflow
     * without adding any AppDataTypes to the CodeRepo.
     */
    @Test
    @Transactional
    void testGetDataTypesForCodeRepo_WithEmptyData() {
        BearerScanDataflow emptyDataflow = new BearerScanDataflow();

        createAppDataTypeService.getDataTypesForCodeRepo(codeRepo, emptyDataflow);

        codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        assertTrue(codeRepo.getAppDataTypes().isEmpty(), "AppDataTypes should be empty when dataflow is empty");
    }

    /**
     * Test that dependencies in BearerScanDataflow are processed correctly.
     * Adjust the expected outcome based on how dependencies affect AppDataTypes.
     */
    @Test
    @Transactional
    void testGetDataTypesForCodeRepo_WithDependencies() {
        BearerScanDataflow bearerScanDataflow = createDummyBearerScanDataflowWithDependencies();

        createAppDataTypeService.getDataTypesForCodeRepo(codeRepo, bearerScanDataflow);

        codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        // Adjust expected size based on actual processing logic
        assertEquals(3, codeRepo.getAppDataTypes().size(), "AppDataTypes size should be correct with dependencies");
    }

    /**
     * Helper method to create a dummy BearerScanDataflow with data types.
     *
     * @return BearerScanDataflow with dummy data types.
     */
    private static BearerScanDataflow createDummyBearerScanDataflow() {
        BearerScanDataflow bearerScanDataflow = new BearerScanDataflow();

        List<BearerScanDataflow.DataType> dataTypes = new ArrayList<>();

        // Create 3 DataTypes
        for (int i = 1; i <= 3; i++) {
            BearerScanDataflow.DataType dataType = new BearerScanDataflow.DataType();
            dataType.setCategoryName("Category" + i);
            dataType.setName("DataType" + i);
            dataType.setCategoryGroups(Arrays.asList("GroupA", "GroupB", "GroupC"));

            // Create Detectors
            List<BearerScanDataflow.Detector> detectors = new ArrayList<>();
            for (int j = 1; j <= 2; j++) {
                BearerScanDataflow.Detector detector = new BearerScanDataflow.Detector();
                detector.setName("Detector" + j);

                // Create Locations
                List<BearerScanDataflow.Location> locations = new ArrayList<>();
                for (int k = 1; k <= 2; k++) {
                    BearerScanDataflow.Location location = new BearerScanDataflow.Location();
                    location.setFilename("file" + k + ".java");
                    location.setFullFilename("/path/to/file" + k + ".java");
                    location.setStartLineNumber(k * 10);
                    location.setStartColumnNumber(k * 5);
                    location.setEndColumnNumber(k * 7);
                    location.setFieldName("field" + k);
                    location.setObjectName("Object" + k);
                    locations.add(location);
                }
                detector.setLocations(locations);
                detectors.add(detector);
            }
            dataType.setDetectors(detectors);
            dataTypes.add(dataType);
        }

        bearerScanDataflow.setDataTypes(dataTypes);

        return bearerScanDataflow;
    }

    /**
     * Helper method to create a dummy BearerScanDataflow with data types and dependencies.
     *
     * @return BearerScanDataflow with dummy data types and dependencies.
     */
    private static BearerScanDataflow createDummyBearerScanDataflowWithDependencies() {
        BearerScanDataflow bearerScanDataflow = createDummyBearerScanDataflow();

        // Create Dependencies
        List<BearerScanDataflow.Dependency> dependencies = new ArrayList<>();
        for (int i = 1; i <= 2; i++) {
            BearerScanDataflow.Dependency dependency = new BearerScanDataflow.Dependency();
            dependency.setName("Dependency" + i);
            dependency.setVersion("1.0." + i);
            dependency.setFilename("dependency-file" + i + ".jar");
            dependency.setDetector("Detector" + i);
            dependencies.add(dependency);
        }

        bearerScanDataflow.setDependencies(dependencies);

        return bearerScanDataflow;
    }
}