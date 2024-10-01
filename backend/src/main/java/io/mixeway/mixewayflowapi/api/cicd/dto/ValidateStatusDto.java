package io.mixeway.mixewayflowapi.api.cicd.dto;

import lombok.Data;

import java.util.List;

@Data
public class ValidateStatusDto {
    String result;
    List<Threat> detectedTreats;

    @Data
    public static class Threat {
        String location;
        String name;
        String severity;

        public Threat(String location, String name, String severity) {
            this.location = location;
            this.name = name;
            this.severity = severity;
        }
    }

}

