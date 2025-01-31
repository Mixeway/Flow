package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnStatsResponseDto;
import io.mixeway.mixewayflowapi.api.threatintel.dto.ItemListResponse;
import io.mixeway.mixewayflowapi.api.threatintel.dto.RemovedVulnerabilityDTO;
import io.mixeway.mixewayflowapi.api.threatintel.dto.ReviewedVulnerabilityDTO;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.projection.*;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FindFindingService {
    private final FindingRepository findingRepository;
    private final FindCodeRepoService findCodeRepoService;
    private final FindUserService findUserService;
    private final FindTeamService findTeamService;

    public VulnStatsResponseDto countFindingStatsForRepo(CodeRepo codeRepo){
        return findingRepository.countFindingsBySource(codeRepo.getId());
    }

    public List<Finding> getCodeRepoFindings(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch){
        if (codeRepoBranch == null) {
            codeRepoBranch = codeRepo.getDefaultBranch();
        }
        return findingRepository.findByCodeRepoAndCodeRepoBranch(codeRepo, codeRepoBranch);
    }
    public Optional<Finding> findById(Long id) {
        return findingRepository.findById(id);
    }

    public List<Finding> findByVulnerability(Vulnerability vulnerability) {
        return findingRepository.findByVulnerability(vulnerability);
    }

    public ItemListResponse getThreatIntelFindings(Principal principal){
        UserInfo userInfo = findUserService.findUser(principal.getName());
        List<ItemProjection> combinedProjections = new ArrayList<>();

        if (userInfo.getHighestRole().equals("ROLE_ADMIN")){
            combinedProjections = findingRepository.findCombinedItemsForAdmin();

        } else {
            combinedProjections = findingRepository.findCombinedItems(findCodeRepoService.findCodeRepoForUser(principal).stream().map(CodeRepo::getId).toList());

        }return mapProjectionsToItems(combinedProjections);
    }

    public ItemListResponse getThreatIntelFindingsForTeam(Principal principal, String remoteId){
        List<Team> teams = findTeamService.findByRemoteId(remoteId);
        if (teams == null){
            throw new TeamNotFoundException("[Threat Intell] Trying to find not existing team " + remoteId);
        }
        List<ItemProjection> combinedProjections = new ArrayList<>();

        combinedProjections = findingRepository.findCombinedItems(
                teams.stream()
                        .flatMap(team -> findCodeRepoService.findByTeam(team).stream())
                        .map(CodeRepo::getId).toList()
        );

        return mapProjectionsToItems(combinedProjections);
    }

    private ItemListResponse mapProjectionsToItems(List<ItemProjection> projections) {
        Map<String, Item> itemMap = new HashMap<>();
        List<Long> allProjectIds = new ArrayList<>();

        for (ItemProjection projection : projections) {
            String vulnerabilityName = projection.getName();
            Item item = itemMap.get(vulnerabilityName);

            if (item == null) {
                item = new Item();
                item.setName(projection.getName());
                item.setUrgency(projection.getUrgency());
                item.setCount(projection.getCount());
                item.setEpss(projection.getEpss());
                item.setPii(projection.isPii());
                item.setExploitAvailable(projection.isExploitAvailable());
                item.setProjects(new ArrayList<>());

                itemMap.put(vulnerabilityName, item);
            } else {
                // Update count and other fields if necessary
                item.setCount(item.getCount() + projection.getCount());
                item.setPii(item.isPii() || projection.isPii());
                item.setExploitAvailable(item.isExploitAvailable() || projection.isExploitAvailable());

                // Determine the highest urgency
                String existingUrgency = item.getUrgency();
                String newUrgency = projection.getUrgency();
                if ("urgent".equals(existingUrgency) || "urgent".equals(newUrgency)) {
                    item.setUrgency("urgent");
                } else if ("notable".equals(existingUrgency) || "notable".equals(newUrgency)) {
                    item.setUrgency("notable");
                }
            }

            // Map project names and IDs to Project objects
            String[] projectNames = projection.getProjectNames().toArray(String[]::new);
            //Integer[] projectIds = projection.getProjectIds().toArray(Integer[]::new);
            List<Object> projectIdObjects = projection.getProjectIds();
            long[] projectIds = projectIdObjects.stream()
                    .mapToLong(obj -> {
                        // Assuming obj is a number that can be converted to long
                        if (obj instanceof Number) {
                            return ((Number) obj).longValue();
                        } else {
                            // handle unexpected type, or throw an exception
                            throw new IllegalArgumentException("Project ID is not numeric.");
                        }
                    })
                    .toArray();
           // allProjectIds.addAll(Arrays.stream(projectIds).toList());

            if (projectNames != null && projectIds != null) {
                for (int i = 0; i < projectNames.length; i++) {
                    Project project = new Project();
                    project.setName(projectNames[i]);
                    project.setHref("/#/show-repo/" + projectIds[i]);

                    // Add project to the item's project list if not already present
                    if (!item.getProjects().contains(project)) {
                        item.getProjects().add(project);
                    }
                }
            }
        }

        // After processing all projections, uniqueProjects contains all unique projects
        int numberOfUniqueProjects = (int) allProjectIds.stream().distinct().count();

        // Prepare the response object
        ItemListResponse response = new ItemListResponse();
        response.setItems(new ArrayList<>(itemMap.values()));
        response.setNumberOfUniqueProjects(numberOfUniqueProjects);

        return response;
    }


    public Long countOpenedVulnerabilities(Principal principal){
        return findingRepository.countAllByCodeRepoInAndStatusIn(findCodeRepoService.findCodeRepoForUser(principal), Arrays.asList("NEW", "EXISTING"));
    }
    public Long countOpenedVulnerabilitiesForRepos(List<CodeRepo> codeRepos){
        return findingRepository.countAllByCodeRepoInAndStatusIn(codeRepos, Arrays.asList("NEW", "EXISTING"));
    }

    public List<RemovedVulnerabilityDTO> getTopRemovedVulns(Principal principal){

        List<RemovedVulnerabilityProjection> projections = findingRepository
                .findTop10RemovedFindingsByCoderepoIds(
                        findCodeRepoService.findCodeRepoForUser(principal)
                                .stream()
                                .map(CodeRepo::getId)
                                .toList()
                );
        return projections.stream()
                .map(proj -> new RemovedVulnerabilityDTO(
                        proj.getName(),
                        proj.getRepositoryUrl(),
                        proj.getDateDeleted(),
                        proj.getCodeRepoId()
                ))
                .collect(Collectors.toList());
    }

    public List<ReviewedVulnerabilityDTO> getTopReviewedVulns(Principal principal){
        List<ReviewedVulnerabilityProjection> projections = findingRepository
                .findTop10SuppressedFindingsByCoderepoIds(findCodeRepoService
                        .findCodeRepoForUser(principal)
                        .stream()
                        .map(CodeRepo::getId)
                        .toList()
                );
        return projections.stream()
                .map(proj -> new ReviewedVulnerabilityDTO(
                        proj.getName(),
                        proj.getRepositoryUrl(),
                        proj.getStatus(),
                        proj.getCodeRepoId()
                ))
                .collect(Collectors.toList());
    }

    public List<Finding> findByVulnerabilityAndTeam(Team team, Vulnerability vulnerability){
        return findingRepository.findByVulnerabilityAndCodeRepoIn(vulnerability, findCodeRepoService.findByTeam(team));
    }

    public List<Finding> findbyVulnerabilityAndCodeRepo(CodeRepo codeRepo, Vulnerability vulnerability) {
        return findingRepository.findByCodeRepoAndVulnerability(codeRepo, vulnerability);
    }
}
