package io.mixeway.mixewayflowapi.api.threatintel.dto;

import io.mixeway.mixewayflowapi.db.projection.Item;
import lombok.Data;

import java.util.List;

@Data
public class ItemListResponse {
    private List<Item> items;
    private int numberOfUniqueProjects;
    private int numberOfAllProjects;
    private int numberOfTeams;
    private Long openedVulnerabilities;

    // Constructors
    public ItemListResponse() { }

    public ItemListResponse(List<Item> items, int numberOfUniqueProjects) {
        this.items = items;
        this.numberOfUniqueProjects = numberOfUniqueProjects;
    }

}
