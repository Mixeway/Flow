package io.mixeway.mixewayflowapi.domain.cloudsubscriptionfindingstats;

import io.mixeway.mixewayflowapi.db.entity.CloudSubscriptionFindingStats;
import io.mixeway.mixewayflowapi.db.repository.CloudSubscriptionFindingStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateCloudSubscriptionFindingStatsService {
    private final CloudSubscriptionFindingStatsRepository cloudSubscriptionFindingStatsRepository;

    public void create(CloudSubscriptionFindingStats cloudSubscriptionFindingStats){
        cloudSubscriptionFindingStatsRepository.save(cloudSubscriptionFindingStats);
    }
}
