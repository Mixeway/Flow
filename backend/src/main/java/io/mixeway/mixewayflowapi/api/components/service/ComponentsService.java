package io.mixeway.mixewayflowapi.api.components.service;

import io.mixeway.mixewayflowapi.api.components.dto.ComponentDto;
import io.mixeway.mixewayflowapi.api.components.dto.ComponentRawDataDto;
import io.mixeway.mixewayflowapi.api.components.dto.GetComponentsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.component.FindComponentService;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.*;

/**
 * Service class responsible for managing and retrieving information about components,
 * their associated vulnerabilities, and the repositories in which they are used.
 */
@Service
@RequiredArgsConstructor
public class ComponentsService {
    private final FindCodeRepoService findCodeRepoService;
    private final FindComponentService findComponentService;

    /**
     * Retrieves a list of components along with the associated vulnerabilities and
     * the repositories in which these components are used. The repositories included
     * in the response are filtered based on the user's access rights.
     *
     * @param principal the security principal representing the currently authenticated user
     * @return a list of GetComponentsResponseDto, each containing a component, a list of vulnerability names, and a list of affected repository URLs
     */
    @Transactional(readOnly = true)
    public List<GetComponentsResponseDto> getComponentsWithVulnerabilitiesAndRepos(Principal principal) {
        // Fetch accessible repositories for the user
        List<CodeRepo> accessibleRepos = findCodeRepoService.findCodeRepoForUser(principal);

        // Fetch raw data
        List<ComponentRawDataDto> rawData = findComponentService.findComponentData(accessibleRepos);

        // Group data by component ID
        Map<Long, GetComponentsResponseDto> componentsMap = new LinkedHashMap<>();

        for (ComponentRawDataDto dto : rawData) {
            GetComponentsResponseDto componentDto = componentsMap.get(dto.getComponentId());
            if (componentDto == null) {
                // Create new DTO for the component
                componentDto = new GetComponentsResponseDto();
                ComponentDto dtoC = new ComponentDto();
                dtoC.setName(dto.getComponentName());
                dtoC.setVersion(dto.getComponentVersion());
                dtoC.setGroupId(dto.getComponentGroupId());
                dtoC.setId(dto.getComponentId());
                componentDto.setComponent(dtoC);
                componentDto.setVulnerabilities(new ArrayList<>());
                componentDto.setAffectedReposUrl(new ArrayList<>());
                componentsMap.put(dto.getComponentId(), componentDto);
            }

            // Add vulnerability name if present
            if (dto.getVulnerabilityName() != null) {
                componentDto.getVulnerabilities().add(dto.getVulnerabilityName());
            }

            // Add repository URL if present
            if (dto.getRepoUrl() != null) {
                componentDto.getAffectedReposUrl().add(dto.getRepoUrl());
            }
            Set<String> set = new HashSet<>(componentDto.getVulnerabilities());
            componentDto.getVulnerabilities().clear();
            componentDto.getVulnerabilities().addAll(set);

            set = new HashSet<>(componentDto.getAffectedReposUrl());
            componentDto.getAffectedReposUrl().clear();
            componentDto.getAffectedReposUrl().addAll(set);

        }

        // Convert the map values to a list
        return new ArrayList<>(componentsMap.values());
    }
}
