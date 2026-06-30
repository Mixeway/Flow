package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.exceptions.GitException;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service class for interacting with Git repositories.
 * <p>
 * This service provides methods for cloning repositories, fetching branches and commits,
 * checking out branches and commits, and executing Git commands.
 * </p>
 */
@Service
@Log4j2
public class GitService {

    /**
     * Clones a Git repository to the specified directory.
     *
     * @param repoUrl      the URL of the Git repository
     * @param accessToken  the access token for authentication
     * @param repoDir      the directory where the repository will be cloned
     * @throws IOException          if an I/O error occurs
     * @throws InterruptedException if the process is interrupted
     */
    public void cloneRepo(String repoUrl, String accessToken, String repoDir) throws IOException, InterruptedException {
        String authenticatedUrl = buildAuthenticatedUrl(repoUrl, accessToken, null);
        ProcessBuilder pb = new ProcessBuilder(gitWithAuth(repoUrl, accessToken, null, "clone", authenticatedUrl, repoDir));
        executeCommand(pb);
    }

    /**
     * Fetches a specific branch from a Git repository and returns the current commit ID.
     *
     * @param repoUrl      the URL of the Git repository
     * @param accessToken  the access token for authentication
     * @param branch       the {@link CodeRepoBranch} to be fetched
     * @param repoDir      the directory where the repository will be cloned
     * @return the current commit ID of the fetched branch
     * @throws IOException          if an I/O error occurs
     * @throws InterruptedException if the process is interrupted
     */
    public String fetchBranch(String repoUrl, String accessToken, CodeRepoBranch branch, String repoDir, CodeRepo.RepoType repoType) throws IOException, InterruptedException {
        new java.io.File(repoDir).getParentFile().mkdirs();
        String authenticatedUrl = buildAuthenticatedUrl(repoUrl, accessToken, repoType);
        ProcessBuilder pb = new ProcessBuilder(gitWithAuth(repoUrl, accessToken, repoType, "clone", "--branch", branch.getName(), authenticatedUrl, repoDir));
        pb.environment().put("GIT_ASKPASS", "echo");
        executeCommand(pb);

        // Get the current commit ID after cloning the branch
        pb = new ProcessBuilder("git", "rev-parse", "HEAD");
        pb.directory(new File(repoDir));
        String commitId = executeCommandAndGetOutput(pb).trim();

        log.info("[Git Service] Fetched branch {} for {}: commit ID {}", branch.getName(), repoDir, commitId);

        return commitId;
    }

    /**
     * Fetches a specific commit from a Git repository.
     *
     * @param repoUrl      the URL of the Git repository
     * @param accessToken  the access token for authentication
     * @param commitId     the commit ID to fetch
     * @param repoDir      the directory where the repository will be initialized
     * @throws IOException          if an I/O error occurs
     * @throws InterruptedException if the process is interrupted
     */
    public void fetchCommit(String repoUrl, String accessToken, String commitId, String repoDir, CodeRepo.RepoType repoType) throws IOException, InterruptedException {
        String authenticatedUrl = buildAuthenticatedUrl(repoUrl, accessToken, repoType);

        File dir = new File(repoDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Clone the repository
        ProcessBuilder pb = new ProcessBuilder(gitWithAuth(repoUrl, accessToken, repoType, "clone", authenticatedUrl, repoDir));
        executeCommand(pb);

        // Navigate to the repo directory
        pb.directory(dir);

        // Fetch all references to ensure origin/HEAD is available
        pb = new ProcessBuilder(gitWithAuth(repoUrl, accessToken, repoType, "fetch", "--all"));
        pb.directory(dir);
        executeCommand(pb);

        // Fetch the specific commit with depth 1
        pb = new ProcessBuilder(gitWithAuth(repoUrl, accessToken, repoType, "fetch", "--depth", "1", "origin", commitId));
        pb.directory(dir);
        executeCommand(pb);

        // Generate a random UUID for the new branch name
        String branchName = UUID.randomUUID().toString();

        // Check out the commit into the new branch
        pb = new ProcessBuilder("git", "checkout", "-b", branchName, commitId);
        pb.directory(dir);
        executeCommand(pb);

        log.info("[Git Service] Fetched commit {} for {} and checked out to new branch {}", commitId, repoDir, branchName);
    }



    /**
     * Checks out a specific branch in a Git repository.
     *
     * @param repoDir    the directory of the repository
     * @param branchName the name of the branch to check out
     * @throws IOException          if an I/O error occurs
     * @throws InterruptedException if the process is interrupted
     */
    public void checkoutBranch(String repoDir, String branchName) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("git", "checkout", branchName);
        pb.directory(new File(repoDir));
        executeCommand(pb);
    }

    /**
     * Checks out a specific commit in a Git repository.
     *
     * @param repoDir  the directory of the repository
     * @param commitId the commit ID to check out
     * @throws IOException          if an I/O error occurs
     * @throws InterruptedException if the process is interrupted
     */
    public void checkoutCommit(String repoDir, String commitId) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("git", "checkout", commitId);
        pb.directory(new File(repoDir));
        executeCommand(pb);
    }

    /**
     * Lists all remote branches of a Git repository without cloning it.
     *
     * @param repoUrl      the URL of the Git repository
     * @param accessToken  the access token for authentication
     * @param repoType     the type of the repository
     * @return list of branch names
     * @throws IOException          if an I/O error occurs
     * @throws InterruptedException if the process is interrupted
     */
    public List<String> listRemoteBranches(String repoUrl, String accessToken, CodeRepo.RepoType repoType) throws IOException, InterruptedException {
        String authenticatedUrl = buildAuthenticatedUrl(repoUrl, accessToken, repoType);
        ProcessBuilder pb = new ProcessBuilder(gitWithAuth(repoUrl, accessToken, repoType, "ls-remote", "--heads", authenticatedUrl));
        String output = executeCommandAndGetOutput(pb);
        List<String> branches = new ArrayList<>();
        for (String line : output.split("\n")) {
            line = line.trim();
            if (line.contains("refs/heads/")) {
                String branchName = line.replaceAll(".*refs/heads/", "").trim();
                if (!branchName.isEmpty()) {
                    branches.add(branchName);
                }
            }
        }
        return branches;
    }

    /**
     * Detects whether the repository is hosted on Bitbucket.
     * Relies on the explicit {@code repoType}, falling back to a hostname check when it is {@code null}.
     */
    private boolean isBitbucket(String repoUrl, CodeRepo.RepoType repoType) {
        return repoType == CodeRepo.RepoType.BITBUCKET
                || (repoType == null && repoUrl != null && repoUrl.contains("bitbucket"));
    }

    /**
     * Builds the URL used for git commands.
     * <ul>
     *   <li>Bitbucket Server/Data Center HTTP access tokens authenticate via the
     *       {@code Authorization: Bearer <token>} header (see {@link #gitWithAuth}), so the URL
     *       is kept credential-free. The legacy {@code x-token-auth} basic-auth form is rejected
     *       by Bitbucket DC.</li>
     *   <li>GitLab, GitHub and Gitea embed the token as {@code OAUTH2:<token>@} basic auth.</li>
     * </ul>
     */
    private String buildAuthenticatedUrl(String repoUrl, String accessToken, CodeRepo.RepoType repoType) {
        String normalizedRepoUrl = normalizeRepoUrl(repoUrl);
        if (isBitbucket(repoUrl, repoType)) {
            return normalizedRepoUrl;
        }
        if (accessToken == null || accessToken.isBlank()) {
            return normalizedRepoUrl;
        }
        String encodedToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        return normalizedRepoUrl.replace("https://", "https://oauth2:" + encodedToken + "@");
    }

    /**
     * Ensures the repository URL is canonical for git clone.
     * Some providers redirect non-".git" URLs to ".git", and HTTP auth credentials may be
     * lost during that redirect depending on git/curl behavior.
     */
    private String normalizeRepoUrl(String repoUrl) {
        if (repoUrl == null || repoUrl.isBlank()) {
            return repoUrl;
        }
        int querySeparator = repoUrl.indexOf('?');
        String baseUrl = querySeparator >= 0 ? repoUrl.substring(0, querySeparator) : repoUrl;
        String query = querySeparator >= 0 ? repoUrl.substring(querySeparator) : "";
        if (baseUrl.endsWith(".git")) {
            return repoUrl;
        }
        return baseUrl + ".git" + query;
    }

    /**
     * Assembles a {@code git} command, injecting the Bitbucket bearer-token header
     * ({@code -c http.extraHeader=Authorization: Bearer <token>}) for Bitbucket repositories.
     * For other providers the token travels in the URL (see {@link #buildAuthenticatedUrl}),
     * so no extra config is added.
     */
    private List<String> gitWithAuth(String repoUrl, String accessToken, CodeRepo.RepoType repoType, String... args) {
        List<String> command = new ArrayList<>();
        command.add("git");
        if (isBitbucket(repoUrl, repoType) && accessToken != null && !accessToken.isBlank()) {
            command.add("-c");
            command.add("http.extraHeader=Authorization: Bearer " + accessToken);
        }
        for (String arg : args) {
            command.add(arg);
        }
        return command;
    }

    /**
     * Executes a Git command using a {@link ProcessBuilder}.
     *
     * @param pb the {@link ProcessBuilder} configured with the Git command to execute
     * @throws IOException          if an I/O error occurs during command execution
     * @throws InterruptedException if the process is interrupted
     */
    private void executeCommand(ProcessBuilder pb) throws IOException, InterruptedException {
        Process process = pb.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            StringBuilder errorOutput = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    errorOutput.append(line).append(System.lineSeparator());
                }
            }
            throw new GitException("Command execution failed: " + sanitizeCommand(pb.command()) +
                    "\nError Output: " + sanitizeOutput(errorOutput.toString()));
        }
    }

    /**
     * Executes a Git command using a {@link ProcessBuilder} and returns the output.
     *
     * @param pb the {@link ProcessBuilder} configured with the Git command to execute
     * @return the output of the executed command as a {@link String}
     * @throws IOException          if an I/O error occurs during command execution
     * @throws InterruptedException if the process is interrupted
     */
    private String executeCommandAndGetOutput(ProcessBuilder pb) throws IOException, InterruptedException {
        Process process = pb.start();
        StringBuilder output = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append(System.lineSeparator());
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            StringBuilder errorOutput = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    errorOutput.append(line).append(System.lineSeparator());
                }
            }
            throw new GitException("Command execution failed: " + sanitizeCommand(pb.command()) +
                    "\nError Output: " + sanitizeOutput(errorOutput.toString()));
        }

        return output.toString();
    }

    /**
     * Joins a command for logging while masking any inline credentials in URLs
     * (e.g. {@code https://user:token@host} becomes {@code https://***@host}) so access
     * tokens are never written to logs or exception messages.
     */
    private String sanitizeCommand(List<String> command) {
        StringBuilder sb = new StringBuilder();
        for (String arg : command) {
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(maskCredentials(arg));
        }
        return sb.toString();
    }

    private String sanitizeOutput(String output) {
        if (output == null) {
            return null;
        }
        return maskCredentials(output);
    }

    private String maskCredentials(String arg) {
        if (arg == null) {
            return null;
        }
        String masked = arg.replaceAll("(https?://)[^@/\\s]+@", "$1***@");
        masked = masked.replaceAll("(?i)(Authorization:\\s*Bearer\\s+)\\S+", "$1***");
        masked = masked.replaceAll("(?i)(PRIVATE-TOKEN:\\s*)\\S+", "$1***");
        masked = masked.replaceAll("(?i)(X-Auth-Token:\\s*)\\S+", "$1***");
        masked = masked.replaceAll("(?i)(x-token-auth:)\\S+", "$1***");
        masked = masked.replaceAll("(?i)([?&](?:access_token|token|private_token)=)[^&\\s]+", "$1***");
        return masked;
    }
}
