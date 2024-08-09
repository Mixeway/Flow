package io.mixeway.mixewayflowapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.ProxyProvider;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;

@Configuration
public class WebClientConfig {

    @Value("${proxy.host}")
    private String proxyHost;

    @Value("${proxy.port}")
    private int proxyPort;

    @Value("${proxy.username:#{null}}")
    private String proxyUsername;

    @Value("${proxy.password:#{null}}")
    private String proxyPassword;

    @Bean
    public WebClient webClient() {
        HttpClient httpClient = HttpClient.create()
                .proxy(proxy -> {
                    ProxyProvider.Builder proxyBuilder = proxy.type(ProxyProvider.Proxy.HTTP)
                            .host(proxyHost)
                            .port(proxyPort);

                    if (proxyUsername != null && proxyPassword != null) {
                        proxyBuilder.username(proxyUsername)
                                .password(ignored -> proxyPassword);
                    }
                });

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
