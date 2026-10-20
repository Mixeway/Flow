package io.mixeway.mixewayflowapi.config;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.ProxyProvider;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.TrustManagerFactory;
import java.io.InputStream;
import java.security.KeyStore;
import java.util.Optional;

/**
 * Dedicated WebClient for LLM providers (SAST, secrets, SCA, IaC, DAST analysis). With
 * {@code llm.mtls.enabled=true} it presents the configured client certificate and verifies the
 * server against the configured trust store (or the JVM default one).
 */
@Configuration
@Log4j2
public class LlmWebClientConfig {

    @Value("${proxy.host:#{null}}")
    private String proxyHost;

    @Value("${proxy.port:#{null}}")
    private Integer proxyPort;

    @Value("${proxy.username:#{null}}")
    private String proxyUsername;

    @Value("${proxy.password:#{null}}")
    private String proxyPassword;

    @Value("${llm.mtls.enabled:false}")
    private boolean mtlsEnabled;

    @Value("${llm.mtls.key-store:}")
    private String keyStore;

    @Value("${llm.mtls.key-store-password:}")
    private String keyStorePassword;

    /** Defaults to the key store password, which is what PKCS12 files almost always use. */
    @Value("${llm.mtls.key-password:}")
    private String keyPassword;

    @Value("${llm.mtls.key-store-type:PKCS12}")
    private String keyStoreType;

    @Value("${llm.mtls.trust-store:}")
    private String trustStore;

    @Value("${llm.mtls.trust-store-password:}")
    private String trustStorePassword;

    @Value("${llm.mtls.trust-store-type:PKCS12}")
    private String trustStoreType;

    /** Injected by name: services must name the dependency {@code llmWebClient}. */
    @Bean
    public WebClient llmWebClient() throws Exception {
        SslContext sslContext = mtlsEnabled ? mtlsSslContext() : insecureSslContext();
        HttpClient httpClient = applyProxy(HttpClient.create().secure(spec -> spec.sslContext(sslContext)));
        if (mtlsEnabled) {
            log.info("[Config] LLM WebClient: mTLS enabled (key store: {}, trust store: {}).",
                    keyStore, StringUtils.hasText(trustStore) ? trustStore : "JVM default");
        } else {
            log.info("[Config] LLM WebClient: mTLS disabled.");
        }
        return WebClient.builder()
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(24 * 1024 * 1024))
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    SslContext mtlsSslContext() throws Exception {
        if (!StringUtils.hasText(keyStore)) {
            throw new IllegalStateException("llm.mtls.enabled=true requires llm.mtls.key-store");
        }
        KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        String password = StringUtils.hasText(keyPassword) ? keyPassword : keyStorePassword;
        kmf.init(loadKeyStore(keyStore, keyStoreType, keyStorePassword), password.toCharArray());

        SslContextBuilder builder = SslContextBuilder.forClient().keyManager(kmf);
        if (StringUtils.hasText(trustStore)) {
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            tmf.init(loadKeyStore(trustStore, trustStoreType, trustStorePassword));
            builder.trustManager(tmf);
        }
        return builder.build();
    }

    private static SslContext insecureSslContext() throws Exception {
        return SslContextBuilder.forClient()
                .trustManager(InsecureTrustManagerFactory.INSTANCE)
                .build();
    }

    private static KeyStore loadKeyStore(String location, String type, String password) throws Exception {
        KeyStore store = KeyStore.getInstance(type);
        try (InputStream in = ResourceUtils.getURL(location).openStream()) {
            store.load(in, password.toCharArray());
        }
        return store;
    }

    private HttpClient applyProxy(HttpClient httpClient) {
        if (proxyHost == null || proxyPort == null) {
            return httpClient;
        }
        String noProxyEnv = Optional.ofNullable(System.getenv("NO_PROXY")).orElse(System.getenv("no_proxy"));
        return httpClient.proxy(proxy -> {
            ProxyProvider.Builder builder = proxy.type(ProxyProvider.Proxy.HTTP)
                    .host(proxyHost)
                    .port(proxyPort);
            if (proxyUsername != null && proxyPassword != null) {
                builder.username(proxyUsername).password(ignored -> proxyPassword);
            }
            if (StringUtils.hasText(noProxyEnv)) {
                builder.nonProxyHosts(String.join("|", noProxyEnv.split(",")));
            }
        });
    }
}
