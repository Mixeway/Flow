package io.mixeway.mixewayflowapi.api.webhook.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BBPullRequestEventDTO {

    @JsonAlias("pullRequest")
    private PullRequestDTO pullrequest;

    private RepositoryDTO repository;

    private String eventKey;

    /**
     * Resolves the repository "full name" regardless of whether the payload
     * originates from Bitbucket Cloud (top-level {@code repository.full_name})
     * or Bitbucket Server/DC ({@code pullRequest.fromRef.repository}).
     */
    public String resolveRepositoryFullName() {
        if (repository != null && repository.getFullName() != null) {
            return repository.getFullName();
        }
        if (pullrequest != null && pullrequest.getFromRef() != null
                && pullrequest.getFromRef().getRepository() != null) {
            ServerRepositoryDTO repo = pullrequest.getFromRef().getRepository();
            String projectKey = repo.getProject() != null ? repo.getProject().getKey() : "";
            return projectKey + "/" + repo.getSlug();
        }
        return "unknown";
    }

    /**
     * Resolves the identifier used as {@code remoteId} source —
     * Cloud: {@code repository.uuid}, Server: numeric {@code id} (as String).
     */
    public String resolveRepositoryId() {
        if (repository != null && repository.getUuid() != null) {
            return repository.getUuid();
        }
        if (pullrequest != null && pullrequest.getFromRef() != null
                && pullrequest.getFromRef().getRepository() != null) {
            return String.valueOf(pullrequest.getFromRef().getRepository().getId());
        }
        return null;
    }

    public String resolveSourceBranch() {
        if (pullrequest == null) return null;
        if (pullrequest.getSource() != null && pullrequest.getSource().getBranch() != null) {
            return pullrequest.getSource().getBranch().getName();
        }
        if (pullrequest.getFromRef() != null) {
            return pullrequest.getFromRef().getDisplayId();
        }
        return null;
    }

    public String resolveSourceCommitHash() {
        if (pullrequest == null) return null;
        if (pullrequest.getSource() != null && pullrequest.getSource().getCommit() != null) {
            return pullrequest.getSource().getCommit().getHash();
        }
        if (pullrequest.getFromRef() != null) {
            return pullrequest.getFromRef().getLatestCommit();
        }
        return null;
    }

    // ── Cloud DTOs ──────────────────────────────────────────────────────

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PullRequestDTO {
        private Long id;
        private String title;
        private String state;
        private BranchRefDTO source;
        private BranchRefDTO destination;
        private ServerRefDTO fromRef;
        private ServerRefDTO toRef;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BranchRefDTO {
        private BranchDTO branch;
        private CommitDTO commit;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BranchDTO {
        private String name;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CommitDTO {
        private String hash;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RepositoryDTO {
        private String uuid;
        @JsonProperty("full_name")
        private String fullName;
        private LinksDTO links;
    }

    // ── Bitbucket Server / Data Center DTOs ─────────────────────────────

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ServerRefDTO {
        private String id;
        private String displayId;
        private String latestCommit;
        private ServerRepositoryDTO repository;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ServerRepositoryDTO {
        private int id;
        private String slug;
        private String name;
        private ServerProjectDTO project;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ServerProjectDTO {
        private String key;
    }

    // ── Shared ──────────────────────────────────────────────────────────

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LinksDTO {
        private HrefDTO html;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class HrefDTO {
        private String href;
    }
}
