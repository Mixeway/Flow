package io.mixeway.mixewayflowapi.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "rag_code_chunk")
public class RagCodeChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coderepo_id", nullable = false)
    private CodeRepo codeRepo;

    @Column(name = "commit_id", length = 64)
    private String commitId;

    @Column(name = "file_path", nullable = false, columnDefinition = "TEXT")
    private String filePath;

    @Column(name = "start_line", nullable = false)
    private int startLine;

    @Column(name = "end_line", nullable = false)
    private int endLine;

    @Column(name = "language", length = 40)
    private String language;

    @Column(name = "chunk_text", nullable = false, columnDefinition = "TEXT")
    private String chunkText;

    @Column(name = "embedding")
    private byte[] embedding;

    @Column(name = "embedding_dim")
    private Integer embeddingDim;

    @Column(name = "content_hash", length = 64)
    private String contentHash;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public RagCodeChunk(CodeRepo codeRepo, String commitId, String filePath, int startLine, int endLine,
                        String language, String chunkText, byte[] embedding, int embeddingDim, String contentHash) {
        this.codeRepo = codeRepo;
        this.commitId = commitId;
        this.filePath = filePath;
        this.startLine = startLine;
        this.endLine = endLine;
        this.language = language;
        this.chunkText = chunkText;
        this.embedding = embedding;
        this.embeddingDim = embeddingDim;
        this.contentHash = contentHash;
        this.createdAt = LocalDateTime.now();
    }
}
