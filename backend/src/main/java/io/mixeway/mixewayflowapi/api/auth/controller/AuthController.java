package io.mixeway.mixewayflowapi.api.auth.controller;

import io.mixeway.mixewayflowapi.api.auth.service.AuthService;
import io.mixeway.mixewayflowapi.api.auth.dto.AuthRequestDTO;
import io.mixeway.mixewayflowapi.api.auth.dto.JwtResponseDTO;
import io.mixeway.mixewayflowapi.api.auth.dto.PassRequestDTO;
import io.mixeway.mixewayflowapi.auth.jwt.JwtService;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.domain.coderepo.CreateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequiredArgsConstructor
@Log4j2
@Validated
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthService authService;
    private final FindUserService findUserService;
    private final Environment environment;

    @PostMapping("/api/v1/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequestDTO authRequestDTO, HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getPassword()));

        if (authentication.isAuthenticated()) {
            UserInfo loggedUser = findUserService.findUser(authRequestDTO.getUsername());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            JwtResponseDTO jwtResponseDTO = JwtResponseDTO.builder()
                    .accessToken(jwtService.GenerateToken(authRequestDTO.getUsername(), loggedUser.getHighestRole()))
                    .resetPassword(loggedUser.isResetPassword())
                    .build();

            // Determine the domain dynamically from the request
            String domain = request.getServerName();

            log.info("[AuthController] loging from domain {}", domain);

            // Set the JWT token in an HTTP-only and secure cookie
            Cookie cookie = new Cookie("flow-token", jwtResponseDTO.getAccessToken());
            cookie.setHttpOnly(true); // This helps mitigate XSS attacks
            cookie.setSecure(request.isSecure()); // Ensure the cookie is sent only over HTTPS if the request is secure
            cookie.setPath("/"); // Set the path to ensure the cookie is available for all endpoints
            cookie.setMaxAge(7 * 24 * 60 * 60); // Set the expiration time for the cookie (e.g., 1 week)
            //cookie.setAttribute("same-site", "Lax"); // Ensures the cookie is only sent for same-site requests
            cookie.setDomain(domain); // Dynamically set the cookie domain based on the request

            response.addCookie(cookie);

            return ResponseEntity.ok(jwtResponseDTO);
        } else {
            throw new UsernameNotFoundException("invalid user request..!!");
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping(value= "/api/v1/change-password",consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusDTO> changePassword(@Valid @RequestBody PassRequestDTO passRequestDTO, Principal principal){
        try {
            authService.changeUserPassword(principal, passRequestDTO.getPassword(), passRequestDTO.getPasswordRepeat());
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (UnsupportedOperationException e){
            log.error("[Auth] Error changing password for {}", principal.getName());
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }



    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/api/v1/hc")
    public ResponseEntity<StatusDTO> hc(Principal principal) {
        UserInfo userInfo = findUserService.findUser(principal.getName());
        try {
            return new ResponseEntity<>(new StatusDTO(userInfo.getHighestRole()), HttpStatus.OK);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/api/v1/status")
    public ResponseEntity<StatusDTO> status() {
        String[] activeProfiles = environment.getActiveProfiles();
        String profile = "";
        if (activeProfiles.length > 0) {
            profile = activeProfiles[0];
        }
        try {
            return new ResponseEntity<>(new StatusDTO(profile), HttpStatus.OK);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/api/v1/hc/admin")
    public ResponseEntity<String> hcAdmin() {
        try {
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }
    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @GetMapping("/api/v1/hc/tm")
    public ResponseEntity<String> hcTM() {
        try {
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}
