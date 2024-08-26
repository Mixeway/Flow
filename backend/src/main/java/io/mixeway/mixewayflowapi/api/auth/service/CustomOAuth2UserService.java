package io.mixeway.mixewayflowapi.api.auth.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@Log4j2
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.error("XAXAXAXAXAXAXAXAXAXA");
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // Extracting ID Token and User Info attributes
        Map<String, Object> attributes = oAuth2User.getAttributes();
        OidcIdToken idToken = new OidcIdToken(
                userRequest.getAccessToken().getTokenValue(),
                userRequest.getAccessToken().getIssuedAt(),
                userRequest.getAccessToken().getExpiresAt(),
                attributes
        );
        OidcUserInfo userInfo = new OidcUserInfo(attributes);

        // Creating OidcUser using OidcUserAuthority
        OidcUserAuthority authority = new OidcUserAuthority(idToken, userInfo);
        return new DefaultOidcUser(Collections.singleton(authority), idToken, userInfo);
    }
}
