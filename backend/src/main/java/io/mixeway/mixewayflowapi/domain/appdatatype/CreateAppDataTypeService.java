package io.mixeway.mixewayflowapi.domain.appdatatype;

import io.mixeway.mixewayflowapi.db.entity.AppDataType;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.repository.AppDataTypeRepository;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanDataflow;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Log4j2
@RequiredArgsConstructor
public class CreateAppDataTypeService {
    private final AppDataTypeRepository appDataTypeRepository;

    @Transactional
    public void getDataTypesForCodeRepo(CodeRepo codeRepo, BearerScanDataflow bearerScanDataflow){
        if (bearerScanDataflow.getDataTypes() != null ){
            log.info("[DataFlowAPI] Removing all data entities from {}", codeRepo.getRepourl());
            appDataTypeRepository.deleteAllByCodeRepo(codeRepo);
            List<AppDataType> appDataTypeList = mapReportToAppData(codeRepo, bearerScanDataflow);
            log.info("[DataFlowAPI] Saving new {} data entities from {}",appDataTypeList.size(), codeRepo.getRepourl());
            appDataTypeRepository.saveAll(appDataTypeList);

        }
    }

    private List<AppDataType> mapReportToAppData(CodeRepo codeRepo, BearerScanDataflow bearerScanDataflow) {
        List<AppDataType> appDataTypeList = new ArrayList<>();
        for (BearerScanDataflow.DataType dType : bearerScanDataflow.getDataTypes()){
            List<String> groups = new ArrayList<>();
            Map<String, String> locationMap = new HashMap<>();

            for (String group :  dType.getCategoryGroups()){
                groups.add(group);
            }
            for(BearerScanDataflow.Detector detector : dType.getDetectors()){
                for (BearerScanDataflow.Location location : detector.getLocations()){
                    locationMap.put(location.getFieldName(),location.getFilename());
                }
            }
            AppDataType appDataType = new AppDataType(dType.getCategoryName(), dType.getName(), codeRepo);
            appDataType.updateCategory(groups);
            appDataType.updateLocations(locationMap);
            appDataTypeList.add(appDataType);
        }
        return appDataTypeList;
    }
}
