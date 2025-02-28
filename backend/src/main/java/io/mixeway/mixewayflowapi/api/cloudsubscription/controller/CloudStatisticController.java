package io.mixeway.mixewayflowapi.api.cloudsubscription.controller;



import io.mixeway.mixewayflowapi.api.cloudsubscription.service.CloudStatisticService;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscriptionFindingStats;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.Principal;
import java.util.List;

@RestController
@Validated
@RequiredArgsConstructor
@Log4j2
public class CloudStatisticController {

    private final CloudStatisticService cloudStatisticService;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/cloudsubscription/{id}/finding_stats")
    public ResponseEntity<List<CloudSubscriptionFindingStats>> getCloudFindingStats(@PathVariable("id") Long id, Principal principal){
        try {
            return cloudStatisticService.getCloudFindingStats(id, principal);
        } catch (Exception e){
            log.error("Error fetching cloud finding stats", e);
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }
}
