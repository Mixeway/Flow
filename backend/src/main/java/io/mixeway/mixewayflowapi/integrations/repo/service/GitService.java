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
        String authenticatedUrl = repoUrl.replace("https://", "https://OAUTH2:" + accessToken + "@");
        ProcessBuilder pb = new ProcessBuilder("git", "clone", authenticatedUrl, repoDir);
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
    public String fetchBranch(String repoUrl, String accessToken, CodeRepoBranch branch, String repoDir) throws IOException, InterruptedException {
        String authenticatedUrl = repoUrl.replace("https://", "https://OAUTH2:" + accessToken + "@");
        ProcessBuilder pb = new ProcessBuilder("git", "clone", "--branch", branch.getName(), authenticatedUrl, repoDir);
        pb.environment().put("GIT_ASKPASS", "echo");
        pb.environment().put("GIT_TOKEN", accessToken);
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
    public void fetchCommit(String repoUrl, String accessToken, String commitId, String repoDir) throws IOException, InterruptedException {
        String authenticatedUrl = repoUrl.replace("https://", "https://OAUTH2:" + accessToken + "@");

        File dir = new File(repoDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Clone the repository
        ProcessBuilder pb = new ProcessBuilder("git", "clone", authenticatedUrl, repoDir);
        executeCommand(pb);

        // Navigate to the repo directory
        pb.directory(dir);

        // Fetch all references to ensure origin/HEAD is available
        pb = new ProcessBuilder("git", "fetch", "--all");
        pb.directory(dir);
        executeCommand(pb);

        // Fetch the specific commit with depth 1
        pb = new ProcessBuilder("git", "fetch", "--depth", "1", "origin", commitId);
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
            throw new GitException("Command execution failed: " + String.join(" ", pb.command()) +
                    "\nError Output: " + errorOutput.toString());
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
            throw new GitException("Command execution failed: " + String.join(" ", pb.command()) +
                    "\nError Output: " + errorOutput.toString());
        }

        return output.toString();
    }
}
