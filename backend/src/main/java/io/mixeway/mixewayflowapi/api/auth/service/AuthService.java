package io.mixeway.mixewayflowapi.api.auth.service;

import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.domain.user.UpdateUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final FindUserService findUserService;
    private final UpdateUserService updateUserService;

    public void changeUserPassword(Principal principal, String password, String passwordRepeat){
        UserInfo userInfo = findUserService.findUser(principal.getName());
        if (userInfo!= null && (passwordRepeat.equals(password))){
            updateUserService.changePassword(userInfo, password);
        } else {
            throw new UnsupportedOperationException("Error changing password");
        }
    }
}
