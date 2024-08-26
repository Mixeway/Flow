package io.mixeway.mixewayflowapi.config;

import io.mixeway.mixewayflowapi.auth.CustomAuthenticationEntryPoint;
import io.mixeway.mixewayflowapi.auth.OAuth2LoginSuccessHandler;
import io.mixeway.mixewayflowapi.auth.jwt.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Profile("devsso | prodsso")
@RequiredArgsConstructor
public class Oauth2SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/api/v1/status").permitAll()
                                .requestMatchers("/api/v1/webhook/**").permitAll() // Public webhook endpoint
                                .requestMatchers("/api/v1/sso").permitAll() // Ensure the SSO endpoint is public
                ) // Ensure the SSO endpoint is public
                .exceptionHandling((exception)-> exception.authenticationEntryPoint(new Http403ForbiddenEntryPoint()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/api/**").authenticated() // All /api/** endpoints require authentication
                                .anyRequest().authenticated() // Any other request requires authentication
                )
                .oauth2Login(oauth2 -> oauth2
                        .redirectionEndpoint(redirectionEndpoint ->
                                redirectionEndpoint.baseUri("/api/v1/sso")
                        )
                        .successHandler(oAuth2LoginSuccessHandler))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, OAuth2LoginAuthenticationFilter.class)
                .build();
    }


    @Bean
    public OidcUserService oidcUserService() {
        return new OidcUserService();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
