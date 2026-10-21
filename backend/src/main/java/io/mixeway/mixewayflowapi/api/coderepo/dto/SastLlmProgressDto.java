package io.mixeway.mixewayflowapi.api.coderepo.dto;

public record SastLlmProgressDto(boolean active, String phase, int analyzed, int total) {
}
