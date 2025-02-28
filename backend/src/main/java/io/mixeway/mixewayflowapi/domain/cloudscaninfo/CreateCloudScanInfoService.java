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

        Optional<CloudScanInfo> existingScanInfoOpt = cloudScanInfoRepository.findByCloudSubscription(cloudSubscription);

        CloudScanInfo cloudScanInfo;

        if (existingScanInfoOpt.isPresent()) {
            cloudScanInfo = existingScanInfoOpt.get();
            cloudScanInfo.updateScanInfo(scanStatus, highFindings, criticalFindings);
        } else {
            cloudScanInfo = new CloudScanInfo(cloudSubscription, scanStatus, highFindings, criticalFindings);
        }

        return cloudScanInfoRepository.save(cloudScanInfo);
    }
}
