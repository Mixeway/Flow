package io.mixeway.mixewayflowapi.domain.cloudsubscription;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.CloudSubscriptionRepository;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.domain.team.CreateTeamService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.CloudSubscriptionNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.DuplicateCloudSubscriptionException;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.UnauthorizedException;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("ut")
@Import(TestConfig.class)
@Transactional
class CloudSubscriptionDomainServicesTest {

    @Autowired
    private CreateCloudSubscriptionService createCloudSubscriptionService;

    @Autowired
    private UpdateCloudSubscriptionService updateCloudSubscriptionService;

    @Autowired
    private DeleteCloudSubscriptionService deleteCloudSubscriptionService;

    @Autowired
    private FindCloudSubscriptionService findCloudSubscriptionService;

    @Autowired
    private FindTeamService findTeamService;

    @Autowired
    private CreateTeamService createTeamService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private CloudSubscriptionRepository cloudSubscriptionRepository;

    @MockBean
    private PermissionFactory permissionFactory;

    @Mock
    private Principal principal;

    private Team team;
    private CloudSubscription subscription;

    @BeforeEach
    void setUp() {
        // Mock principal
        when(principal.getName()).thenReturn("admin");

        // Mock PermissionFactory to allow access by default
        doNothing().when(permissionFactory).canUserManageTeam(any(), any());

        // Create Team for testing
        createTeamService.createTeam("cloudSubscriptionTest", "cloudSubscriptionTest", new ArrayList<>(), principal);

        team = findTeamService.findAll().stream()
                .filter(t -> t.getName().equals("cloudSubscriptionTest"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Team not found in setup"));
    }

    // Create CloudSubscription Tests
    @Test
    void testCreateCloudSubscription() {
        CloudSubscription created = createCloudSubscriptionService.create("test-subscription", team.getId(), principal);

        assertNotNull(created);
        assertEquals("test-subscription", created.getName());
        assertEquals(team.getId(), created.getTeam().getId());
    }

    @Test
    void testCreateCloudSubscription_DuplicateName() {
        createCloudSubscriptionService.create("test-subscription", team.getId(), principal);

        assertThrows(DuplicateCloudSubscriptionException.class, () -> {
            createCloudSubscriptionService.create("test-subscription", team.getId(), principal);
        });
    }

    @Test
    void testCreateCloudSubscription_InvalidTeam() {
        assertThrows(TeamNotFoundException.class, () -> {
            createCloudSubscriptionService.create("test-subscription", 999L, principal);
        });
    }

    @Test
    void testCreateCloudSubscription_Unauthorized() {
        doThrow(new UnauthorizedException()).when(permissionFactory).canUserManageTeam(any(), any());

        assertThrows(UnauthorizedException.class, () -> {
            createCloudSubscriptionService.create("test-subscription", team.getId(), principal);
        });
    }

    // Update CloudSubscription Tests
    @Test
    void testUpdateCloudSubscription() {
        // Create initial subscription
        CloudSubscription initial = createCloudSubscriptionService.create("test-subscription", team.getId(), principal);

        // Update subscription
        CloudSubscription updated = updateCloudSubscriptionService.update(
                initial.getId(), "updated-subscription", team.getId(), principal);

        assertNotNull(updated);
        assertEquals("updated-subscription", updated.getName());
        assertEquals(team.getId(), updated.getTeam().getId());
    }

    @Test
    void testUpdateCloudSubscription_NotFound() {
        assertThrows(CloudSubscriptionNotFoundException.class, () -> {
            updateCloudSubscriptionService.update(999L, "updated-subscription", team.getId(), principal);
        });
    }

    @Test
    void testUpdateCloudSubscription_DuplicateName() {
        // Create two subscriptions
        CloudSubscription sub1 = createCloudSubscriptionService.create("sub1", team.getId(), principal);
        CloudSubscription sub2 = createCloudSubscriptionService.create("sub2", team.getId(), principal);

        // Try to update sub2 to have the same name as sub1
        assertThrows(DuplicateCloudSubscriptionException.class, () -> {
            updateCloudSubscriptionService.update(sub2.getId(), "sub1", team.getId(), principal);
        });
    }

    // Delete CloudSubscription Tests
    @Test
    void testDeleteCloudSubscription() {
        // Create subscription
        CloudSubscription toDelete = createCloudSubscriptionService.create("to-delete", team.getId(), principal);

        // Delete subscription
        deleteCloudSubscriptionService.delete(toDelete.getId(), team.getId(), principal);

        // Verify deletion
        assertTrue(cloudSubscriptionRepository.findById(toDelete.getId()).isEmpty());
    }

    @Test
    void testDeleteCloudSubscription_NotFound() {
        assertThrows(CloudSubscriptionNotFoundException.class, () -> {
            deleteCloudSubscriptionService.delete(999L, team.getId(), principal);
        });
    }

    // Find CloudSubscription Tests
    @Test
    void testFindCloudSubscriptionsByTeam() {
        // Create multiple subscriptions
        createCloudSubscriptionService.create("sub1", team.getId(), principal);
        createCloudSubscriptionService.create("sub2", team.getId(), principal);

        // Find subscriptions
        List<CloudSubscription> found = findCloudSubscriptionService.getByTeam(team.getId(), principal);

        assertNotNull(found);
        assertEquals(2, found.size());
        assertTrue(found.stream().anyMatch(s -> s.getName().equals("sub1")));
        assertTrue(found.stream().anyMatch(s -> s.getName().equals("sub2")));
    }

    @Test
    void testFindCloudSubscriptionsByTeam_InvalidTeam() {
        assertThrows(TeamNotFoundException.class, () -> {
            findCloudSubscriptionService.getByTeam(999L, principal);
        });
    }

    @Test
    void testFindCloudSubscriptionsByTeam_Unauthorized() {
        doThrow(new UnauthorizedException()).when(permissionFactory).canUserManageTeam(any(), any());

        assertThrows(UnauthorizedException.class, () -> {
            findCloudSubscriptionService.getByTeam(team.getId(), principal);
        });
    }

    // Cross-Team Operation Tests
    @Test
    void testCrossTeamOperations() {
        // Create another team
        createTeamService.createTeam("anotherTeam", "anotherTeam", new ArrayList<>(), principal);
        Team anotherTeam = findTeamService.findAll().stream()
                .filter(t -> t.getName().equals("anotherTeam"))
                .findFirst()
                .orElseThrow();

        // Create subscription in original team
        CloudSubscription subscription = createCloudSubscriptionService.create("test-sub", team.getId(), principal);

        // Try to update subscription using another team's ID
        assertThrows(IllegalArgumentException.class, () -> {
            updateCloudSubscriptionService.update(subscription.getId(), "new-name", anotherTeam.getId(), principal);
        });

        // Try to delete subscription using another team's ID
        assertThrows(IllegalArgumentException.class, () -> {
            deleteCloudSubscriptionService.delete(subscription.getId(), anotherTeam.getId(), principal);
        });
    }
}