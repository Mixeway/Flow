package io.mixeway.mixewayflowapi.api.coderepo.dto;

public record SastLlmProgressDto(boolean active, int analyzed, int total) {
}
