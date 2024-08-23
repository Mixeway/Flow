package io.mixeway.mixewayflowapi.domain.appdatatype;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.AppDataType;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanDataflow;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.shaded.org.checkerframework.checker.units.qual.A;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
public class CreateAppDataTypeServiceTest {
    @Autowired
    private CreateAppDataTypeService createAppDataTypeService;
    @Autowired
    private FindCodeRepoService findCodeRepoService;


    @Test
    public void getDataTypesForCodeRepo() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        BearerScanDataflow bearerScanDataflow = createDummyBearerScanDataflow();
        createAppDataTypeService.getDataTypesForCodeRepo(codeRepo, bearerScanDataflow);
        codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        assertEquals(3, codeRepo.getAppDataTypes().size());
    }

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