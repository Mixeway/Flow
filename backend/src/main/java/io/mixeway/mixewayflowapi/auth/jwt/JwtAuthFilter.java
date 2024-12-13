package io.mixeway.mixewayflowapi.auth.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import io.mixeway.mixewayflowapi.auth.UserDetailsServiceImpl;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.JwtValidationException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Log4j2
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final FindUserService findUserService; // Add this so we can look up user by API key

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        log.debug("JwtAuthFilter: Processing request " + request.getRequestURI());

        Authentication existingAuth = SecurityContextHolder.getContext().getAuthentication();
        if (existingAuth != null && existingAuth.isAuthenticated()) {
            filterChain.doFilter(request, response);
            return; // Already authenticated
        }

        // 1. Check if API key header is present
        String apiKey = request.getHeader("X-API-KEY");
        if (apiKey != null && !apiKey.isBlank()) {
            log.debug("Attempting API key authentication");
            Optional<UserInfo> userInfo = findUserService.findByApiKey(apiKey);
            if (userInfo.isPresent()) {
                // Validate user's roles and details
                UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(userInfo.get().getUsername());
                // Create an authentication token
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // Set authentication context
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                log.debug("API key authentication successful for user: " + userInfo.get().getUsername());
                filterChain.doFilter(request, response);
                return;
            } else {
                log.warn("Invalid API key provided");
                // If invalid, we do not stop the chain here necessarily. You can choose to reject immediately or let
                // the request continue and be rejected by other mechanisms.
                // For security, you may want to set a response and return here:
                // response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid API Key");
                // return;
            }
        }

        // 2. If no API key authentication, proceed with JWT authentication as before
        String token = null;
        String username = null;

        // Try to get the token from the Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        // If the token is not in the Authorization header, try to get it from cookies
        if (token == null) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("flow-token".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
        }

        // Validate the token
        if (token != null) {
            try {
                username = jwtService.extractUsername(token);
            } catch (ExpiredJwtException | JwtValidationException | SignatureException e) {
                log.error("[JWT Auth] Problem validating JWT token");
            }
        }

        // Authenticate the user via JWT
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);
                if (jwtService.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            } catch (UsernameNotFoundException e) {
                log.error("[Auth] {}", e.getLocalizedMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/v1/sso") ||
                path.startsWith("/oauth2/") ||
                path.startsWith("/api/v1/webhook/") ||
                path.startsWith("/api/v1/status");
    }
}
