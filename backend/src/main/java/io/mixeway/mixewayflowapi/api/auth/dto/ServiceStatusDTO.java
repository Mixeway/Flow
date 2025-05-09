package io.mixeway.mixewayflowapi.api.auth.dto;


import lombok.Data;

@Data
public class ServiceStatusDTO {
    private String status;
    private String mode;

    public ServiceStatusDTO(String status, String mode){
        this.status = status;
        this.mode = mode;
    }
}
