package io.mixeway.mixewayflowapi.domain.cloudsubscriptionfindingstats;

import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscriptionFindingStats;
import io.mixeway.mixewayflowapi.db.repository.CloudSubscriptionFindingStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FindCloudSubscriptionFindingStatsService {
    private final CloudSubscriptionFindingStatsRepository cloudSubscriptionFindingStatsRepository;

    public List<CloudSubscriptionFindingStats> getStatsForCloudSubscription(CloudSubscription cloudSubscription){
        return cloudSubscriptionFindingStatsRepository.findTop14ByCloudSubscriptionOrderByDateInsertedDesc(cloudSubscription);
    }

}
