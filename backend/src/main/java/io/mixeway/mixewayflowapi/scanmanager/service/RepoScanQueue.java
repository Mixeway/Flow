package io.mixeway.mixewayflowapi.scanmanager.service;

import lombok.extern.log4j.Log4j2;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.RejectedExecutionException;

/**
 * Runs at most one job (regular scan, AI analysis, SBOM scan) per repository at a time.
 * Later jobs for the same repository wait in FIFO order; different repositories do not block each other.
 */
@Log4j2
class RepoScanQueue {

    private final Map<Long, Deque<Runnable>> waiting = new HashMap<>();
    private final Set<Long> busy = new HashSet<>();

    /**
     * Hands {@code job} to {@code executor} once every earlier job of the repository has finished.
     *
     * @return {@code true} when the job has to wait behind another job of the same repository
     */
    boolean submit(Long repoId, Executor executor, Runnable job) {
        return enqueue(repoId, () -> dispatch(repoId, executor, job));
    }

    /**
     * Blocks the calling thread until it is the repository's turn, then runs {@code job} in that thread.
     *
     * @return {@code false} when the thread was interrupted while waiting and the job did not run
     */
    boolean runBlocking(Long repoId, Runnable job) {
        CompletableFuture<Void> turn = new CompletableFuture<>();
        enqueue(repoId, () -> {
            if (!turn.complete(null)) {
                release(repoId);
            }
        });
        try {
            turn.get();
        } catch (InterruptedException e) {
            if (!turn.cancel(false)) {
                release(repoId);
            }
            Thread.currentThread().interrupt();
            return false;
        } catch (ExecutionException e) {
            throw new IllegalStateException(e);
        }
        try {
            job.run();
        } finally {
            release(repoId);
        }
        return true;
    }

    private boolean enqueue(Long repoId, Runnable starter) {
        synchronized (this) {
            if (!busy.add(repoId)) {
                waiting.computeIfAbsent(repoId, k -> new ArrayDeque<>()).addLast(starter);
                return true;
            }
        }
        starter.run();
        return false;
    }

    private void release(Long repoId) {
        Runnable next;
        synchronized (this) {
            Deque<Runnable> queue = waiting.get(repoId);
            next = queue == null ? null : queue.pollFirst();
            if (queue != null && queue.isEmpty()) {
                waiting.remove(repoId);
            }
            if (next == null) {
                busy.remove(repoId);
            }
        }
        if (next != null) {
            next.run();
        }
    }

    private void dispatch(Long repoId, Executor executor, Runnable job) {
        try {
            executor.execute(() -> {
                try {
                    job.run();
                } finally {
                    release(repoId);
                }
            });
        } catch (RejectedExecutionException e) {
            log.warn("[RepoScanQueue] Executor rejected job for repo {}: {}", repoId, e.getMessage());
            release(repoId);
        }
    }
}
