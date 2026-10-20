package io.mixeway.mixewayflowapi.config;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsExchange;
import com.sun.net.httpserver.HttpsParameters;
import com.sun.net.httpserver.HttpsServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LlmWebClientConfigTest {

    private HttpsServer server;
    private final AtomicReference<String> clientSubject = new AtomicReference<>();

    @BeforeEach
    void startMtlsServer() throws Exception {
        SSLContext sslContext = SSLContext.getInstance("TLS");
        KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        kmf.init(load("llm-client.p12", "testpass"), "testpass".toCharArray());
        TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        tmf.init(load("llm-ca.p12", "trustpass"));
        sslContext.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);

        server = HttpsServer.create(new InetSocketAddress("localhost", 0), 0);
        server.setHttpsConfigurator(new HttpsConfigurator(sslContext) {
            @Override
            public void configure(HttpsParameters params) {
                var sslParams = getSSLContext().getDefaultSSLParameters();
                sslParams.setNeedClientAuth(true);
                params.setSSLParameters(sslParams);
            }
        });
        server.createContext("/v1/chat/completions", exchange -> {
            X509Certificate peer = (X509Certificate) ((HttpsExchange) exchange).getSSLSession().getPeerCertificates()[0];
            clientSubject.set(peer.getSubjectX500Principal().getName());
            byte[] body = "{\"ok\":true}".getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, body.length);
            exchange.getResponseBody().write(body);
            exchange.close();
        });
        server.start();
    }

    @AfterEach
    void stopServer() {
        server.stop(0);
    }

    @Test
    void presentsClientCertificateWhenMtlsEnabled() throws Exception {
        LlmWebClientConfig config = config(true, "classpath:llm-mtls/llm-client.p12");

        String body = post(config.llmWebClient());

        assertThat(body).isEqualTo("{\"ok\":true}");
        assertThat(clientSubject.get()).isEqualTo("CN=llm-mtls-test");
    }

    @Test
    void handshakeFailsWithoutClientCertificateWhenMtlsDisabled() throws Exception {
        WebClient client = config(false, "").llmWebClient();

        assertThatThrownBy(() -> post(client)).isInstanceOf(RuntimeException.class);
    }

    @Test
    void plainHttpEndpointWorksWithMtlsEnabledAndDisabled() throws Exception {
        HttpServer plain = HttpServer.create(new InetSocketAddress("localhost", 0), 0);
        plain.createContext("/v1/chat/completions", exchange -> {
            byte[] body = "{\"plain\":true}".getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, body.length);
            exchange.getResponseBody().write(body);
            exchange.close();
        });
        plain.start();
        try {
            String url = "http://localhost:" + plain.getAddress().getPort() + "/v1/chat/completions";
            for (boolean mtls : new boolean[]{true, false}) {
                String body = config(mtls, "classpath:llm-mtls/llm-client.p12").llmWebClient().post()
                        .uri(url)
                        .bodyValue("{}")
                        .retrieve()
                        .bodyToMono(String.class)
                        .block(Duration.ofSeconds(10));
                assertThat(body).isEqualTo("{\"plain\":true}");
            }
        } finally {
            plain.stop(0);
        }
    }

    @Test
    void failsFastWhenMtlsEnabledWithoutKeyStore() {
        LlmWebClientConfig config = config(true, "");

        assertThatThrownBy(config::llmWebClient)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("llm.mtls.key-store");
    }

    private String post(WebClient client) {
        return client.post()
                .uri("https://localhost:" + server.getAddress().getPort() + "/v1/chat/completions")
                .bodyValue("{}")
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(10));
    }

    private static LlmWebClientConfig config(boolean enabled, String keyStore) {
        LlmWebClientConfig config = new LlmWebClientConfig();
        ReflectionTestUtils.setField(config, "mtlsEnabled", enabled);
        ReflectionTestUtils.setField(config, "keyStore", keyStore);
        ReflectionTestUtils.setField(config, "keyStorePassword", "testpass");
        ReflectionTestUtils.setField(config, "keyPassword", "");
        ReflectionTestUtils.setField(config, "keyStoreType", "PKCS12");
        ReflectionTestUtils.setField(config, "trustStore", "classpath:llm-mtls/llm-ca.p12");
        ReflectionTestUtils.setField(config, "trustStorePassword", "trustpass");
        ReflectionTestUtils.setField(config, "trustStoreType", "PKCS12");
        return config;
    }

    private static KeyStore load(String name, String password) throws Exception {
        KeyStore store = KeyStore.getInstance("PKCS12");
        try (InputStream in = LlmWebClientConfigTest.class.getResourceAsStream("/llm-mtls/" + name)) {
            store.load(in, password.toCharArray());
        }
        return store;
    }
}
