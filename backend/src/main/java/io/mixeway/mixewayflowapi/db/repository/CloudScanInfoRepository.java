package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.CloudScanInfo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CloudScanInfoRepository extends CrudRepository<CloudScanInfo, Long> {

    Optional<CloudScanInfo> findByCloudSubscription(CloudSubscription cloudSubscription);
}