// PlanLimitsRepository.java
package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.PlanLimits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlanLimitsRepository extends JpaRepository<PlanLimits, Long> {
    Optional<PlanLimits> findByPlanType(String planType);
}