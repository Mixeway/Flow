package io.mixeway.mixewayflowapi.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.ProxyProvider;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;

@Configuration
@Log4j2
public class WebClientConfig {

    @Value("${proxy.host:#{null}}")
    private String proxyHost;

    @Value("${proxy.port:#{null}}")
    private Integer proxyPort;

    @Value("${proxy.username:#{null}}")
    private String proxyUsername;

    @Value("${proxy.password:#{null}}")
    private String proxyPassword;

    @Bean
    public WebClient webClient() {
        HttpClient httpClient = HttpClient.create();

        // Configure proxy only if both proxyHost and proxyPort are provided
        if (proxyHost != null && proxyPort != null) {
            httpClient = httpClient.proxy(proxy -> {
                ProxyProvider.Builder proxyBuilder = proxy.type(ProxyProvider.Proxy.HTTP)
                        .host(proxyHost)
                        .port(proxyPort);

                if (proxyUsername != null && proxyPassword != null) {
                    proxyBuilder.username(proxyUsername)
                            .password(ignored -> proxyPassword);
                }
            });
            log.info("[Config] Proxy configured with host: {} and port: {}", proxyHost, proxyPort);
        } else {
            log.info("[Config] No proxy configured.");
        }

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
