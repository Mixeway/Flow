package io.mixeway.mixewayflowapi.api.user.controller;

import io.mixeway.mixewayflowapi.api.user.dto.*;
import io.mixeway.mixewayflowapi.api.user.service.AppModeInfoService;
import io.mixeway.mixewayflowapi.domain.user.CreateUserService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.domain.user.UpdateUserService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Log4j2
public class UserController {
    private final FindUserService findUserService;
    private final CreateUserService createUserService;
    private final UpdateUserService updateUserService;
    private final AppModeInfoService appModeInfoService;


    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @GetMapping(value= "/api/v1/users")
    public ResponseEntity<List<UserDto>> getUsers(){
        try {
            return new ResponseEntity<>(findUserService.findAll().stream()
                    .map(UserDto::new)
                    .collect(Collectors.toList()), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value= "/api/v1/user/create")
    public ResponseEntity<StatusDTO> createUser(@Valid @RequestBody CreateUserRequestDto createUserRequestDto){
        try {
            createUserService.createUser(createUserRequestDto);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value= "/api/v1/user/{id}/change/role")
    public ResponseEntity<StatusDTO> changeUserRole(@Valid @RequestBody ChangeRoleRequestDto changeRoleRequestDto, @PathVariable("id")Long id){
        try {
            updateUserService.changeRole(changeRoleRequestDto, id);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value= "/api/v1/user/{id}/change/team")
    public ResponseEntity<StatusDTO> changeUserTams(@Valid @RequestBody ChangeTeamRequestDto changeRoleRequestDto, @PathVariable("id")Long id){
        try {
            updateUserService.changeUsersTeam(changeRoleRequestDto, id);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value= "/api/v1/user/{id}/change/password")
    public ResponseEntity<StatusDTO> changeUserPassword(@Valid @RequestBody ChangePasswordDto changePasswordDto, @PathVariable("id")Long id){
        try {
            updateUserService.changePassword(changePasswordDto, id);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value= "/api/v1/user/{id}/deactivate")
    public ResponseEntity<StatusDTO> deactivateUser(@PathVariable("id")Long id){
        try {
            updateUserService.deactivate(id);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value= "/api/v1/user/{id}/activate")
    public ResponseEntity<StatusDTO> activate( @PathVariable("id")Long id){
        try {
            updateUserService.activate( id);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/user/app-info")
    public ResponseEntity<AppModeInfoDto> getAppModeInfo(Principal principal){
        try {
            AppModeInfoDto appModeInfo = appModeInfoService.getAppModeInfo(principal);
            return ResponseEntity.ok(appModeInfo);
        } catch (Exception e) {
            log.error("[AppInfoController] Error getting app mode info: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
