package io.mixeway.mixewayflowapi.integrations.rag.service;

public record RetrievedChunk(long id, String filePath, int startLine, int endLine, String language, String content) {}
