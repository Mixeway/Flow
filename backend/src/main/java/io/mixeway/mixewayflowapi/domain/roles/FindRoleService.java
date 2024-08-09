package io.mixeway.mixewayflowapi.domain.roles;

import io.mixeway.mixewayflowapi.db.entity.UserRole;
import io.mixeway.mixewayflowapi.db.repository.UserRoleRepository;
import io.mixeway.mixewayflowapi.exceptions.RoleNotExistingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class FindRoleService {
    private final UserRoleRepository roleRepository;

    public UserRole findUserRole(String role) {
        return roleRepository.findByName(role)
                .orElseThrow(() -> new RoleNotExistingException("Role not existing: " + role));
    }
}
