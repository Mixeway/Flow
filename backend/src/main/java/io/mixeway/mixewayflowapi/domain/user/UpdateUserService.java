package io.mixeway.mixewayflowapi.domain.user;

import io.mixeway.mixewayflowapi.api.user.dto.ChangePasswordDto;
import io.mixeway.mixewayflowapi.api.user.dto.ChangeRoleRequestDto;
import io.mixeway.mixewayflowapi.api.user.dto.ChangeTeamRequestDto;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.entity.UserRole;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.roles.FindRoleService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.RoleNotExistingException;
import io.mixeway.mixewayflowapi.exceptions.UserNotExistingException;
import io.mixeway.mixewayflowapi.utils.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Log4j2
public class UpdateUserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final FindTeamService findTeamService;
    private final FindUserService findUserService;
    private final FindRoleService findRoleService;


    public void changePassword(UserInfo userInfo, String newPass){
        userInfo.changePassword(bCryptPasswordEncoder.encode(newPass));
        userRepository.save(userInfo);
        log.info("[Auth] Successfully changed password for user {}", userInfo.getUsername());
    }

    public void changePassword(ChangePasswordDto changePasswordDto, Long id){
        Optional<UserInfo> userInfo = findUserService.findById(id);
        if (userInfo.isEmpty()) {
            throw new UserNotExistingException();
        }
        UserInfo user = userInfo.get();
        user.changePassword(bCryptPasswordEncoder.encode(changePasswordDto.getPassword()));
        userRepository.save(user);
        log.info("[UserService] Successfully changed password for user {}", user.getUsername());
    }

    public void changeUsersTeam(ChangeTeamRequestDto changeTeamRequestDto, Long id){
        Optional<UserInfo> userInfo = findUserService.findById(id);
        if (userInfo.isEmpty()) {
            throw new UserNotExistingException();
        }
        UserInfo user = userInfo.get();

        for (Long teamId: changeTeamRequestDto.getTeams()){
            Optional<Team> team = findTeamService.findById(teamId);
            team.ifPresent(user::assignToTeam);
        }
        log.info("[UserService] Successfully changed team for user {}", user.getUsername());
        userRepository.save(user);
    }


    public void changeRole(ChangeRoleRequestDto changeRoleRequestDto, Long id) {
        Optional<UserInfo> userInfo = findUserService.findById(id);
        if (userInfo.isEmpty()) {
            throw new UserNotExistingException();
        }
        UserInfo user = userInfo.get();
        Set<UserRole> roles = new HashSet<>();
        UserRole userRole = findRoleService.findUserRole("USER");
        UserRole adminRole = findRoleService.findUserRole("ADMIN");
        UserRole teamManagerRole = findRoleService.findUserRole("TEAM_MANAGER");

        if (changeRoleRequestDto.getRole().equals(Role.ADMIN)) {
            roles.add(adminRole);
            roles.add(userRole);
            roles.add(teamManagerRole);
        } else if (changeRoleRequestDto.getRole().equals(Role.TEAM_MANAGER)) {
            roles.add(teamManagerRole);
            roles.add(userRole);
        } else if (changeRoleRequestDto.getRole().equals(Role.USER)) {
            roles.add(userRole);
        }

        if (roles.size() > 0){
            user.assignRoles(roles);
            userRepository.save(user);
            log.info("[UserService] Change role of user {} to {}", userInfo.get().getUsername(), changeRoleRequestDto.getRole());
        } else {
            log.warn("[UserService] Problem with change role of user {} to {}", userInfo.get().getUsername(), changeRoleRequestDto.getRole());

            throw new RoleNotExistingException("Trying to add not existing role");

        }
    }
    public void deactivate(Long id) {
        Optional<UserInfo> userInfo = findUserService.findById(id);
        if (userInfo.isEmpty()) {
            throw new UserNotExistingException();
        }
        userInfo.get().changeActiveStatus(false);
        userRepository.save(userInfo.get());
        log.info("[UserService] Deactivated user {}", userInfo.get().getUsername());
    }
    public void activate(Long id) {
        Optional<UserInfo> userInfo = findUserService.findById(id);
        if (userInfo.isEmpty()) {
            throw new UserNotExistingException();
        }
        userInfo.get().changeActiveStatus(true);
        userRepository.save(userInfo.get());
        log.info("[UserService] Activated user {}", userInfo.get().getUsername());
    }
}
