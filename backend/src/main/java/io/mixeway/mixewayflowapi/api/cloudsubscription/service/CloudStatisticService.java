package io.mixeway.mixewayflowapi.api.cloudsubscription.service;

import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscriptionFindingStats;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.FindCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.cloudsubscriptionfindingstats.FindCloudSubscriptionFindingStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CloudStatisticService {
    private final FindCloudSubscriptionService findCloudSubscriptionService;
    private final FindCloudSubscriptionFindingStatsService findCloudSubscriptionFindingStatsService;

    public ResponseEntity<List<CloudSubscriptionFindingStats>> getCloudFindingStats(Long id, Principal principal) {
        CloudSubscription cloudSubscription = findCloudSubscriptionService.findById(id, principal);
        if (cloudSubscription != null) {
            return new ResponseEntity<>(findCloudSubscriptionFindingStatsService.getStatsForCloudSubscription(cloudSubscription), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

