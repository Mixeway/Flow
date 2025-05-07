package io.mixeway.mixewayflowapi.domain.user;

import io.mixeway.mixewayflowapi.api.user.dto.CreateUserRequestDto;
import io.mixeway.mixewayflowapi.config.AppConfigService;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.entity.UserRole;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.onboarding.OnboardingService;
import io.mixeway.mixewayflowapi.domain.roles.FindRoleService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.RoleNotExistingException;
import io.mixeway.mixewayflowapi.exceptions.UserAlreadyExistsException;
import io.mixeway.mixewayflowapi.utils.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Log4j2
public class CreateUserService {
    private final UserRepository userRepository;
    private final FindRoleService findRoleService;
    private final FindUserService findUserService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final FindTeamService findTeamService;
    private final OnboardingService onboardingService;
    private final AppConfigService appConfigService;


    public UserInfo createUser(CreateUserRequestDto createUserRequestDto) {
        UserInfo existingUser = findUserService.findUser(createUserRequestDto.getUsername());
        if (existingUser != null) {
            throw new UserAlreadyExistsException("User already exists: " + createUserRequestDto.getUsername());
        }

        UserInfo newUser = initializeUser(createUserRequestDto.getUsername(), createUserRequestDto.getPassword(), createUserRequestDto.getRole());
        if (appConfigService.isSaasMode()) {
            onboardingService.onboardFreePlanUser(newUser);
        }
        assignTeamsToUser(newUser, createUserRequestDto.getTeams());

        log.info("[UserService] User {} created by Admin", newUser.getUsername());
        return userRepository.save(newUser);
    }

    private UserInfo initializeUser(String username, String password, Role role) {
        return new UserInfo(username, bCryptPasswordEncoder.encode(password),assignRolesToUser(role));
    }

    private Set<UserRole> assignRolesToUser( Role role) {
        Set<UserRole> roles = new HashSet<>();
        UserRole userRole = findRoleService.findUserRole("USER");
        UserRole adminRole = findRoleService.findUserRole("ADMIN");
        UserRole teamManagerRole = findRoleService.findUserRole("TEAM_MANAGER");

        switch (role) {
            case ADMIN -> {
                roles.add(adminRole);
                roles.add(userRole);
                roles.add(teamManagerRole);
            }
            case TEAM_MANAGER -> {
                roles.add(teamManagerRole);
                roles.add(userRole);
            }
            case USER -> roles.add(userRole);
            default -> throw new RoleNotExistingException("Role does not exist: " + role);
        }
        return roles;
    }

    private void assignTeamsToUser(UserInfo user, List<Long> teams) {
        for (Long id : teams) {
            Optional<Team> team = findTeamService.findById(id);
            team.ifPresent(value -> user.getTeams().add(value));
        }
    }
}
