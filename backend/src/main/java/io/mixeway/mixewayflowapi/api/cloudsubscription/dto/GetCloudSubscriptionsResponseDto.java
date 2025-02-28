package io.mixeway.mixewayflowapi.api.cloudsubscription.dto;


import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;

public class GetCloudSubscriptionsResponseDto {
    private Long id;
    private String cloudSubscription;
    private String team;
    private String externalProjectName;
    private String scanStatus;

    public GetCloudSubscriptionsResponseDto(Long id, String cloudSubscription, String team, String externalProjectName, CloudSubscription.ScanStatus scanStatus) {
        this.id = id;
        this.cloudSubscription = cloudSubscription;
        this.team = team;
        this.externalProjectName = externalProjectName;
        this.scanStatus = scanStatus.name();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCloudSubscription() {
        return cloudSubscription;
    }

    public void setCloudSubscription(String cloudSubscription) {
        this.cloudSubscription = cloudSubscription;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String getExternalProjectName() {
        return externalProjectName;
    }

    public void setExternalProjectName(String externalProjectName) {
        this.externalProjectName = externalProjectName;
    }

    public String getScanStatus() {
        return scanStatus;
    }

    public void setScanStatus(String scanStatus) {
        this.scanStatus = scanStatus;
    }

}
