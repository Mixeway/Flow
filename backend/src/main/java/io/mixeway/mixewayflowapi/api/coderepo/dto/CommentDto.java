package io.mixeway.mixewayflowapi.api.coderepo.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class CommentDto {
    private LocalDateTime inserted;
    private String author;
    private String message;

    public CommentDto(LocalDateTime inserted, String author, String message) {
        this.inserted = inserted;
        this.author = author;
        this.message = message;
    }
}
