package io.mixeway.mixewayflowapi.api.components.service;

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
import java.util.List;

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
    @Transactional
    public List<GetComponentsResponseDto> getComponentsWithVulnerabilitiesAndRepos(Principal principal) {
        // Fetch all components from the service
        List<Component> components = findComponentService.findAll();

        // Get the list of repositories the user can access
        List<CodeRepo> accessibleRepos = findCodeRepoService.findCodeRepoForUser(principal);

        // Map each component to a GetComponentsResponseDto
        return components.stream().map(component -> {
            // Initialize the component's associated repositories and vulnerabilities
            Hibernate.initialize(component.getCodeRepos());
            Hibernate.initialize(component.getVulnerabilities());

            // Filter the repositories to only include those the user can access
            List<String> affectedRepoUrls = component.getCodeRepos().stream()
                    .filter(accessibleRepos::contains) // Only include repos in the accessibleRepos list
                    .map(CodeRepo::getRepourl)
                    .toList();

            // Extract the names of the vulnerabilities associated with this component
            List<String> vulnerabilityNames = component.getVulnerabilities().stream()
                    .map(Vulnerability::getName)
                    .toList();

            // Create and return the DTO
            return new GetComponentsResponseDto(
                    component,
                    vulnerabilityNames,
                    affectedRepoUrls
            );
        }).toList();
    }
}
