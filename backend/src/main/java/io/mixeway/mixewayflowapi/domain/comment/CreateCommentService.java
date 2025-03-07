package io.mixeway.mixewayflowapi.domain.comment;

import io.mixeway.mixewayflowapi.db.entity.Comment;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.CommentRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.exceptions.FindingNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.UnauthorizedAccessException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;

/**
 * Service responsible for creating comments on findings.
 * Handles authorization checks and ensures users can only comment on findings
 * they have access to through their team membership or admin role.
 */
@Service
@RequiredArgsConstructor
public class CreateCommentService {
    private final CommentRepository commentRepository;
    private final FindingRepository findingRepository;
    private final UserRepository userRepository;

    /**
     * Creates a new comment on a finding after verifying user authorization.
     *
     * @param findingId ID of the finding to comment on
     * @param message Content of the comment
     * @param principal Current authenticated user
     * @return Created comment entity
     * @throws FindingNotFoundException if finding doesn't exist
     * @throws UnauthorizedAccessException if user doesn't have permission to comment
     */
    @Transactional
    public Comment createComment(Long repoId, Long findingId, String message, Principal principal) throws FindingNotFoundException {
        UserInfo userInfo = userRepository.findByUsername(principal.getName());
        Finding finding = findingRepository.findById(findingId)
                .orElseThrow(FindingNotFoundException::new);

        // Verify that the finding belongs to the specified repo
        if (finding.getCodeRepo().getId() != repoId) {
            throw new FindingNotFoundException();
        }

        // Check authorization
        if (!isUserAuthorized(userInfo, finding)) {
            throw new UnauthorizedAccessException("User is not authorized to comment on this finding");
        }

        Comment comment = new Comment(message, finding, userInfo);
        finding.addComment(comment);

        return commentRepository.save(comment);
    }

    @Transactional
    public Comment createCloudComment(Long id, Long findingId, String message, Principal principal) throws FindingNotFoundException {
        UserInfo userInfo = userRepository.findByUsername(principal.getName());
        Finding finding = findingRepository.findById(findingId)
                .orElseThrow(FindingNotFoundException::new);

        // Verify that the finding belongs to the specified repo
        if (finding.getCloudSubscription().getId() != id) {
            throw new FindingNotFoundException();
        }

        // Check authorization
        if (!isUserAuthorized(userInfo, finding)) {
            throw new UnauthorizedAccessException("User is not authorized to comment on this finding");
        }

        Comment comment = new Comment(message, finding, userInfo);
        finding.addComment(comment);

        return commentRepository.save(comment);
    }


    private boolean isUserAuthorized(UserInfo user, Finding finding) {
        // Check if user is admin
        if (user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()))) {
            return true;
        }

        // Check if user belongs to the finding's repo team
        return user.getTeams().contains(finding.getCodeRepo().getTeam());
    }
}