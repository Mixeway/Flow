package io.mixeway.mixewayflowapi.api.auth.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@Log4j2
@Profile("saas")
public class GitHubOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // Log the attributes to debug
        log.debug("GitHub OAuth2 attributes: {}", oAuth2User.getAttributes());

        // Extract GitHub attributes
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Create a new attributes map with necessary fields
        Map<String, Object> customAttributes = new HashMap<>(attributes);

        // Add a "sub" attribute if needed by your application
        // GitHub uses "id" as a unique identifier
        if (!customAttributes.containsKey("sub") && customAttributes.containsKey("id")) {
            customAttributes.put("sub", customAttributes.get("id").toString());
        }

        // Add a "preferred_username" attribute if your app looks for it
        if (!customAttributes.containsKey("preferred_username") && customAttributes.containsKey("login")) {
            customAttributes.put("preferred_username", customAttributes.get("login"));
        }

        // GitHub uses "login" as the username attribute
        String userNameAttributeName = "login";

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                customAttributes,
                userNameAttributeName
        );
    }
}