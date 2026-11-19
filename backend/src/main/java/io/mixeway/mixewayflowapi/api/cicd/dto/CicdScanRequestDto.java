package io.mixeway.mixewayflowapi.api.cicd.dto;

import lombok.Data;

/**
 * A pipeline's request to scan the commit it is building.
 */
@Data
public class CicdScanRequestDto {
    /** Clone URL of the repository, as registered in Flow. */
    String repoUrl;
    String branch;
    /** The commit being built; when missing, the head of the branch is scanned. */
    String commitId;
    /** Pull / merge request to comment on with the result, if any. */
    Long pullRequestId;
    /**
     * The pipeline builds the SBOM itself and uploads it with {@code POST /api/v1/cicd/sbom}: Flow
     * does not generate one and holds the verdict back until that SBOM has been scanned.
     */
    boolean sbomFromPipeline;
}
