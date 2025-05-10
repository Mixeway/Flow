package io.mixeway.mixewayflowapi.auth;

import io.mixeway.mixewayflowapi.api.user.dto.CreateUserRequestDto;
import io.mixeway.mixewayflowapi.auth.jwt.JwtService;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.domain.user.CreateUserService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.utils.Role;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Log4j2
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final CreateUserService createUserService;
    private final FindUserService findUserService;
    @Value("${frontend.url}")
    String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.debug("Authentication class: {}", authentication.getPrincipal().getClass().getName());
        log.debug("Authentication details: {}", authentication.getPrincipal());

        String username;

        if (authentication.getPrincipal() instanceof OidcUser) {
            // Keycloak OIDC flow
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            username = oidcUser.getPreferredUsername();
            log.debug("Using OidcUser with preferred_username: {}", username);
        } else if (authentication.getPrincipal() instanceof OAuth2User) {
            // GitHub OAuth2 flow
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

            // Try to get username from various possible attributes
            username = (String) oauth2User.getAttribute("login"); // GitHub username

            if (username == null) {
                username = (String) oauth2User.getAttribute("preferred_username"); // Our custom attribute
            }

            if (username == null) {
                username = oauth2User.getName(); // Default from getName()
            }

            log.debug("Using OAuth2User with username: {}", username);
        } else {
            log.error("Unsupported authentication principal type: {}", authentication.getPrincipal().getClass());
            throw new IllegalStateException("Unsupported authentication principal type");
        }

        if (username == null || username.isEmpty()) {
            log.error("Username is null or empty after authentication");
            throw new IllegalStateException("Username cannot be extracted from authentication");
        }

        UserInfo userInfo = findUserService.findUser(username);
        if (userInfo == null) {
            log.debug("Creating new user with username: {}", username);
            userInfo = createUserService.createUser(CreateUserRequestDto.of(username, Role.USER, "xxxxxxxxxxxx", new ArrayList<>()));
        }

        String jwtToken = jwtService.GenerateToken(userInfo.getUsername(), userInfo.getHighestRole());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Set the JWT token in an HTTP-only and secure cookie
        Cookie cookie = new Cookie("flow-token", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(request.isSecure());
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);

        response.addCookie(cookie);

        if (frontendUrl == null) {
            throw new IllegalStateException("FRONTEND_URL environment variable must be set when SSO is enabled");
        }

        log.debug("Authentication successful, redirecting to: {}", frontendUrl);
        response.sendRedirect(frontendUrl);
    }
}
