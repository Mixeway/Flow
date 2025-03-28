package io.mixeway.mixewayflowapi.domain.cloudscaninfo;

import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.CloudScanInfo;
import io.mixeway.mixewayflowapi.db.repository.CloudScanInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CreateCloudScanInfoService {

    private final CloudScanInfoRepository cloudScanInfoRepository;

    public CloudScanInfo createOrUpdateCloudScanInfo(CloudSubscription cloudSubscription, CloudSubscription.ScanStatus scanStatus, int highFindings, int criticalFindings) {

        CloudScanInfo cloudScanInfo = new CloudScanInfo(cloudSubscription, scanStatus, highFindings, criticalFindings);

        return cloudScanInfoRepository.save(cloudScanInfo);
    }
}
