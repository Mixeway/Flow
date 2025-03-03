package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscriptionFindingStats;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface CloudSubscriptionFindingStatsRepository extends CrudRepository<CloudSubscriptionFindingStats, Long> {

    @Query("SELECT s FROM CloudSubscriptionFindingStats s WHERE s.cloudSubscription = :cloudSubscription ORDER BY s.dateInserted DESC limit 14")
    List<CloudSubscriptionFindingStats> findTop14ByCloudSubscriptionOrderByDateInsertedDesc(@Param("cloudSubscription") CloudSubscription cloudSubscription);

}