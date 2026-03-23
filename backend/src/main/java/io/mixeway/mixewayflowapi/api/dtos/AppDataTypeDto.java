package io.mixeway.mixewayflowapi.api.dtos;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AppDataTypeDto {
    private Long id;
    private String categoryName;
    private String name;
    private List<String> categoryGroups;
    private Map<String, String> location;
}
