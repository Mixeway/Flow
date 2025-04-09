package io.mixeway.mixewayflowapi.api.team.service;

import io.mixeway.mixewayflowapi.api.team.dto.TeamIdDto;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
@Log4j2
@RequiredArgsConstructor
public class TeamService {

    private final FindTeamService findTeamService;
    private final UserRepository userRepository;

    public boolean isValidApiKey(String apiKey) {
        Optional<UserInfo> userOptional = userRepository.findByApiKey(apiKey);

        if (userOptional.isPresent()) {
            boolean isAdmin = "ADMIN".equals(userOptional.get().getHighestRole());
            log.info("[Team Service] User's {} API key validation succeeded", userOptional.get().getUsername());
            return isAdmin;
        } else {
            return false;
        }
    }


    public List<TeamIdDto> getTeamIds(Principal principal) {
        return findTeamService.findAllTeamsIds(principal);
    }
}
