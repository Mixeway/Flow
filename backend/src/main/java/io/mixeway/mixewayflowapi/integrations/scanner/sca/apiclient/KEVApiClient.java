package io.mixeway.mixewayflowapi.integrations.scanner.sca.apiclient;

import io.mixeway.mixewayflowapi.integrations.scanner.sca.dto.CatalogDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Log4j2
public class KEVApiClient {
    private final WebClient webClient;

    public Mono<CatalogDto> loadKev() {

        return webClient.get()
                .uri("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json")
                .retrieve()
                .bodyToMono(CatalogDto.class);
    }
}
