package io.mixeway.mixewayflowapi.integrations.ollama.service;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import io.mixeway.mixewayflowapi.integrations.ollama.dto.FpVerdictDto;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Log4j2
public class OllamaResponseParser {

    private static final Gson GSON = new Gson();
    public Optional<FpVerdictDto> parseVerdictJson(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        String trimmed = raw.trim();
        Optional<FpVerdictDto> direct = tryParse(trimmed);
        if (direct.isPresent()) {
            return direct;
        }
        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');
        if (start >= 0 && end > start) {
            Optional<FpVerdictDto> inner = tryParse(trimmed.substring(start, end + 1));
            if (inner.isPresent()) {
                return inner;
            }
        }
        log.debug("[AiFp] Could not parse verdict JSON from: {}", trimmed.length() > 200 ? trimmed.substring(0, 200) + "..." : trimmed);
        return Optional.empty();
    }

    private static Optional<FpVerdictDto> tryParse(String json) {
        try {
            FpVerdictDto dto = GSON.fromJson(json, FpVerdictDto.class);
            if (dto != null && dto.getVerdict() != null) {
                return Optional.of(dto);
            }
        } catch (JsonSyntaxException ignored) {
        }
        return Optional.empty();
    }
}
