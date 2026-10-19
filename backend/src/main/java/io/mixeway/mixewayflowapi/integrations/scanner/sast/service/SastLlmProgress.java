package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-process counter of SAST findings already reviewed by the LLM.
 * Lives only for the duration of one analysis in this JVM.
 */
@Component
public class SastLlmProgress {

    public record Snapshot(boolean active, int analyzed, int total) {
        public static Snapshot idle() {
            return new Snapshot(false, 0, 0);
        }
    }

    private static final class Progress {
        private final int total;
        private final AtomicInteger analyzed = new AtomicInteger();

        private Progress(int total) {
            this.total = total;
        }
    }

    private final ConcurrentHashMap<Long, Progress> byRepoId = new ConcurrentHashMap<>();

    public void begin(long repoId, int total) {
        if (total <= 0) {
            byRepoId.remove(repoId);
            return;
        }
        byRepoId.put(repoId, new Progress(total));
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
        return new Snapshot(true, analyzed, progress.total);
    }
}
