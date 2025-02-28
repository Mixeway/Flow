package io.mixeway.mixewayflowapi;

import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.repository.CloudSubscriptionRepository;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.scanmanager.scheduler.StatsScheduler;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.List;


@SpringBootApplication
@EnableScheduling
@Log4j2
public class MixewayFlowApiApplication {

    private final ScanManagerService scanManagerService;
    private final StatsScheduler statsScheduler;

    public MixewayFlowApiApplication(ScanManagerService scanManagerService, CloudSubscriptionRepository cloudSubscriptionRepository, TeamRepository teamRepository, CloudSubscriptionRepository cloudSubscriptionRepository1, StatsScheduler statsScheduler) {
        this.scanManagerService = scanManagerService;
        this.statsScheduler = statsScheduler;
    }

    public static void main(String[] args) {
        SpringApplication.run(MixewayFlowApiApplication.class, args);
    }

    @Bean
    public CommandLineRunner fetchVulnerabilityDataAtStartup() {
        return (args) -> {
            log.info("Fetching vulnerability findings at startup...");
            scanManagerService.runCloudScansForAllSubscriptions();
            statsScheduler.collectAndSaveCloudStats();
        };
    }
}
