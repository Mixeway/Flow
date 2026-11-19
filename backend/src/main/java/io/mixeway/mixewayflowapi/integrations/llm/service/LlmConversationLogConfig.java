package io.mixeway.mixewayflowapi.integrations.llm.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

/**
 * Points conversation dumps at a durable directory.
 * Files are written only while logger {@code io.mixeway.mixewayflowapi} is DEBUG.
 */
@Component
public class LlmConversationLogConfig {

    /** Absolute or relative path; empty keeps the default under the process working directory. */
    @Value("${llm.conversation-log.dir:}")
    private String directory;

    @PostConstruct
    void apply() {
        Path dir = directory == null || directory.isBlank()
                ? LlmConversationRecorder.defaultDirectory()
                : Path.of(directory.trim());
        LlmConversationRecorder.configure(dir);
    }
}
