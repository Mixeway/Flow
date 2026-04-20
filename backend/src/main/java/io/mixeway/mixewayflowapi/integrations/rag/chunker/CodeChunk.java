package io.mixeway.mixewayflowapi.integrations.rag.chunker;

public record CodeChunk(String filePath, int startLine, int endLine, String language, String content) {}
