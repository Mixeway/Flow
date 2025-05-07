// OrganizationDto.java
package io.mixeway.mixewayflowapi.api.organization.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationDto {
    private Long id;
    private String name;
    private String planType;
    private LocalDateTime createdDate;
    private boolean active;
    private int teamCount;
    private int repoCount;
    private int userCount;
}