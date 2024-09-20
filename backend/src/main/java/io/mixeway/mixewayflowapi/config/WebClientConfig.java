package io.mixeway.mixewayflowapi.config;

import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.ProxyProvider;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;

import javax.net.ssl.SSLException;

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
        httpClient = httpClient.secure(sslContextSpec -> {
            try {
                sslContextSpec.sslContext(
                        SslContextBuilder.forClient()
                                .trustManager(InsecureTrustManagerFactory.INSTANCE)
                                .build());
            } catch (SSLException e) {
                log.error("Unable to config trust on WebClient instance - {}",e.getLocalizedMessage());
            }
        });

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
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(16 * 1024 * 1024))
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
