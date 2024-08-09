package io.mixeway.mixewayflowapi.utils;


import lombok.Data;

@Data
public class StatusDTO {
    private String status;

    public StatusDTO(String status){
        this.status = status;
    }
}
