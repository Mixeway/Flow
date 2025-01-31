package io.mixeway.mixewayflowapi.domain.comment;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.Comment;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.repository.CommentRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.exceptions.FindingNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.UnauthorizedAccessException;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.security.Principal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
@Transactional
class CreateCommentServiceTest {
    @Autowired
    private CreateCommentService createCommentService;

    @Autowired
    private FindingRepository findingRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Mock
    private Principal principal;

    @Test
    void createCommentAsAdmin() throws FindingNotFoundException {
        // Given
        Mockito.when(principal.getName()).thenReturn("admin");
        Finding finding = findingRepository.findById(1L).orElseThrow();
        String message = "Test comment";

        // When
        Comment comment = createCommentService.createComment(1L,1L, message, principal);

        // Then
        assertNotNull(comment);
        assertEquals(message, comment.getMessage());
        assertEquals(finding.getId(), comment.getFinding().getId());

        // Verify the comment is in the database
        Comment savedComment = commentRepository.findById(comment.getId()).orElseThrow();
        assertEquals(message, savedComment.getMessage());
        assertEquals(1L, savedComment.getFinding().getId());
    }

    @Test
    void createCommentAsTeamMember() throws FindingNotFoundException {
        // Given
        Mockito.when(principal.getName()).thenReturn("user");
        String message = "Test comment from team member";

        // When
        Comment comment = createCommentService.createComment(1L,1L, message, principal);

        // Then
        assertNotNull(comment);
        assertEquals(message, comment.getMessage());
        assertEquals(1L, comment.getFinding().getId());

        // Verify the comment is in the database
        Comment savedComment = commentRepository.findById(comment.getId()).orElseThrow();
        assertEquals(message, savedComment.getMessage());
    }

    @Test
    void createCommentUnauthorizedUser() {
        // Given
        Mockito.when(principal.getName()).thenReturn("unauthorized_user");
        String message = "Test comment";

        // Then
        assertThrows(UnauthorizedAccessException.class, () ->
                createCommentService.createComment(1L, 1L,message, principal)
        );
    }

    @Test
    void createCommentNonExistentFinding() {
        // Given
        Mockito.when(principal.getName()).thenReturn("admin");
        String message = "Test comment";

        // Then
        assertThrows(FindingNotFoundException.class, () ->
                createCommentService.createComment(999L,1L, message, principal)
        );
    }
}