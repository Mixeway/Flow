package io.mixeway.mixewayflowapi.api.user.dto;

import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import lombok.Data;

import java.util.List;

@Data
public class UserDto {
    Long id;
    String username;
    String role;
    List<Team> teams;
    Boolean active;

    public UserDto(UserInfo userInfo){
        this.id = userInfo.getId();
        this.username = userInfo.getUsername();
        this.teams = userInfo.getTeams().stream().toList();
        this.active = userInfo.isActive();
        this.role = userInfo.getHighestRole();
    }
}
