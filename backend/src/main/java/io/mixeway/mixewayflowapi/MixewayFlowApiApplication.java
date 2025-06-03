package io.mixeway.mixewayflowapi;

import io.mixeway.mixewayflowapi.scanmanager.scheduler.StatsScheduler;
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

    public static void main(String[] args) {
        SpringApplication.run(MixewayFlowApiApplication.class, args);
    }

}
