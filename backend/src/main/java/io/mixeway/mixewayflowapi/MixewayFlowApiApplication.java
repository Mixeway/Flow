package io.mixeway.mixewayflowapi;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.integrations.scanner.gitlab_scanner.GitLabRules;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Optional;

@SpringBootApplication
@EnableScheduling
@Log4j2
public class MixewayFlowApiApplication {

    private final GitLabRules gitLabRules;
    private final CodeRepoRepository codeRepoRepository;

    public MixewayFlowApiApplication(GitLabRules gitLabRules, CodeRepoRepository codeRepoRepository) {
        this.gitLabRules = gitLabRules;
        this.codeRepoRepository = codeRepoRepository;
    }

    public static void main(String[] args) {
        SpringApplication.run(MixewayFlowApiApplication.class, args);
    }

    @Bean
    CommandLineRunner run() {
        return args -> {
            // Fetch the first repository from the database
            Optional<CodeRepo> repoWithIdOne = codeRepoRepository.findById(1L);

            if (repoWithIdOne.isPresent()) {
                log.info("Running checkDefaultBranchProtection for repository: {}", repoWithIdOne.get().getRepourl());
                gitLabRules.checkDefaultBranchProtection(repoWithIdOne.get());
            } else {
                log.warn("No repositories found in the database.");
            }
        };
    }
}
