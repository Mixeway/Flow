package io.mixeway.mixewayflowapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class MixewayFlowApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MixewayFlowApiApplication.class, args);
    }

}
