package io.mixeway.mixewayflowapi.api.coderepo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RunScanBranchRequestDto {
    @NotBlank
    private String branchName;
}
