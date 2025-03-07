package io.mixeway.mixewayflowapi.domain.scaninfo;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import io.mixeway.mixewayflowapi.db.repository.ScanInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindScanInfoService {
    private final ScanInfoRepository scanInfoRepository;

    public List<ScanInfo> findScanInfoByRepo(CodeRepo repo){
        return scanInfoRepository.findByCodeRepo(repo);
    }
}
