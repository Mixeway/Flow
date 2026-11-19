package io.mixeway.mixewayflowapi.api.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LlmConnectivityResultDto {
    private final boolean ok;
    private final String message;
    private final Integer httpStatus;
    private final Long elapsedMs;

    public static LlmConnectivityResultDto success(long elapsedMs) {
        return new LlmConnectivityResultDto(true, "LLM connection successful", 200, elapsedMs);
    }

    public static LlmConnectivityResultDto failure(String message, Integer httpStatus, long elapsedMs) {
        return new LlmConnectivityResultDto(false, message, httpStatus, elapsedMs);
    }
}
