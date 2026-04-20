package io.mixeway.mixewayflowapi.integrations.ollama.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.mixeway.mixewayflowapi.integrations.ollama.dto.OllamaGenerateResponse;
import io.mixeway.mixewayflowapi.integrations.ollama.dto.OllamaTagsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class OllamaClient {

    private static final Gson GSON = new Gson();
    private final WebClient webClient;

    public Optional<OllamaTagsResponse> tags(String baseUrl, int timeoutSeconds) {
        String url = normalizeBase(baseUrl) + "/api/tags";
        try {
            String body = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(Math.max(5, timeoutSeconds)))
                    .onErrorResume(WebClientResponseException.class, e -> Mono.empty())
                    .block();
            if (body == null || body.isBlank()) {
                return Optional.empty();
            }
            return Optional.of(GSON.fromJson(body, OllamaTagsResponse.class));
        } catch (Exception e) {
            log.debug("[Ollama] tags failed: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<String> generate(String baseUrl, String model, String prompt, boolean jsonFormat, int timeoutSeconds) {
        String url = normalizeBase(baseUrl) + "/api/generate";
        JsonObject req = new JsonObject();
        req.addProperty("model", model);
        req.addProperty("prompt", prompt);
        req.addProperty("stream", false);
        if (jsonFormat) {
            req.addProperty("format", "json");
        }
        JsonObject options = new JsonObject();
        options.addProperty("temperature", 0.0);
        req.add("options", options);
        try {
            String body = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(GSON.toJson(req))
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(Math.max(5, timeoutSeconds)))
                    .block();
            if (body == null || body.isBlank()) {
                return Optional.empty();
            }
            OllamaGenerateResponse parsed = GSON.fromJson(body, OllamaGenerateResponse.class);
            return Optional.ofNullable(parsed != null ? parsed.getResponse() : null);
        } catch (Exception e) {
            log.warn("[Ollama] generate failed: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Tries /api/embed (Ollama 0.5+) then /api/embeddings.
     */
    public Optional<float[]> embed(String baseUrl, String model, String input, int timeoutSeconds) {
        if (model == null || model.isBlank()) {
            return Optional.empty();
        }
        Optional<float[]> fromEmbed = tryEmbedEndpoint(normalizeBase(baseUrl) + "/api/embed", model, input, timeoutSeconds);
        if (fromEmbed.isPresent()) {
            return fromEmbed;
        }
        return tryLegacyEmbeddings(normalizeBase(baseUrl) + "/api/embeddings", model, input, timeoutSeconds);
    }

    private Optional<float[]> tryEmbedEndpoint(String url, String model, String input, int timeoutSeconds) {
        try {
            JsonObject body = new JsonObject();
            body.addProperty("model", model);
            body.addProperty("input", input);
            String resp = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body.toString())
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(Math.max(5, timeoutSeconds)))
                    .block();
            return parseEmbeddingResponse(resp);
        } catch (Exception e) {
            log.debug("[Ollama] /api/embed failed: {}", e.getMessage());
            return Optional.empty();
        }
    }

    private Optional<float[]> tryLegacyEmbeddings(String url, String model, String input, int timeoutSeconds) {
        try {
            JsonObject body = new JsonObject();
            body.addProperty("model", model);
            body.addProperty("prompt", input);
            String resp = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body.toString())
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(Math.max(5, timeoutSeconds)))
                    .block();
            return parseEmbeddingResponse(resp);
        } catch (Exception e) {
            log.debug("[Ollama] /api/embeddings failed: {}", e.getMessage());
            return Optional.empty();
        }
    }

    private Optional<float[]> parseEmbeddingResponse(String resp) {
        if (resp == null || resp.isBlank()) {
            return Optional.empty();
        }
        try {
            JsonObject root = GSON.fromJson(resp, JsonObject.class);
            if (root.has("embedding")) {
                return Optional.of(jsonArrayToFloats(root.getAsJsonArray("embedding")));
            }
            if (root.has("embeddings")) {
                JsonArray arr = root.getAsJsonArray("embeddings");
                if (arr.size() > 0 && arr.get(0).isJsonArray()) {
                    return Optional.of(jsonArrayToFloats(arr.get(0).getAsJsonArray()));
                }
            }
        } catch (Exception e) {
            log.debug("[Ollama] parse embedding: {}", e.getMessage());
        }
        return Optional.empty();
    }

    private static float[] jsonArrayToFloats(JsonArray arr) {
        float[] out = new float[arr.size()];
        for (int i = 0; i < arr.size(); i++) {
            out[i] = arr.get(i).getAsFloat();
        }
        return out;
    }

    public static List<String> modelNames(OllamaTagsResponse tags) {
        List<String> names = new ArrayList<>();
        if (tags == null || tags.getModels() == null) {
            return names;
        }
        for (OllamaTagsResponse.ModelEntry m : tags.getModels()) {
            if (m.getName() != null) {
                names.add(m.getName());
            }
        }
        return names;
    }

    private static String normalizeBase(String baseUrl) {
        if (baseUrl == null || baseUrl.isBlank()) {
            return "http://localhost:11434";
        }
        return baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }
}
