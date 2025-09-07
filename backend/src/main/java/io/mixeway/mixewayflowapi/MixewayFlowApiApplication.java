package io.mixeway.mixewayflowapi;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
@Log4j2
public class MixewayFlowApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MixewayFlowApiApplication.class, args);
    }
}
