package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-process state of a SAST LLM analysis: waiting in the queue, preparing (clone + Bearer scan),
 * then a counter of findings already reviewed by the LLM.
 * Lives only for the duration of one analysis in this JVM.
 */
@Component
public class SastLlmProgress {

    public enum Phase {
        IDLE,
        QUEUED,
        PREPARING,
        ANALYZING
    }

    public record Snapshot(boolean active, Phase phase, int analyzed, int total) {
        public static Snapshot idle() {
            return new Snapshot(false, Phase.IDLE, 0, 0);
        }
    }

    private static final class Progress {
        private final Phase phase;
        private final int total;
        private final AtomicInteger analyzed = new AtomicInteger();

        private Progress(Phase phase, int total) {
            this.phase = phase;
            this.total = total;
        }
    }

    private final ConcurrentHashMap<Long, Progress> byRepoId = new ConcurrentHashMap<>();

    public void queue(long repoId) {
        byRepoId.putIfAbsent(repoId, new Progress(Phase.QUEUED, 0));
    }

    public void prepare(long repoId) {
        byRepoId.put(repoId, new Progress(Phase.PREPARING, 0));
    }

    public void begin(long repoId, int total) {
        if (total <= 0) {
            byRepoId.remove(repoId);
            return;
        }
        byRepoId.put(repoId, new Progress(Phase.ANALYZING, total));
    }

    public void advance(long repoId) {
        Progress progress = byRepoId.get(repoId);
        if (progress != null) {
            progress.analyzed.incrementAndGet();
        }
    }

    public void clear(long repoId) {
        byRepoId.remove(repoId);
    }

    public Snapshot get(long repoId) {
        Progress progress = byRepoId.get(repoId);
        if (progress == null) {
            return Snapshot.idle();
        }
        int analyzed = Math.min(progress.analyzed.get(), progress.total);
        return new Snapshot(true, progress.phase, analyzed, progress.total);
    }
}
