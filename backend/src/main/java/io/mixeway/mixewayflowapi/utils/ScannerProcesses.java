package io.mixeway.mixewayflowapi.utils;

import lombok.extern.log4j.Log4j2;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Starts external scanners in their own process group and kills the whole group afterwards.
 * <p>
 * Scanners such as bearer (processing-worker) and cdxgen (mvn, gradle) spawn child processes.
 * {@link Process#destroyForcibly()} only kills the direct child, so those grandchildren get
 * re-parented to PID 1 and keep running with all their threads, eventually exhausting the
 * container PID limit ("unable to create native thread").
 */
@Log4j2
public final class ScannerProcesses {

    private static final String SETSID = findSetsid();

    private ScannerProcesses() {
    }

    /**
     * Starts the process in a new session (and process group) whose id equals the returned process pid.
     */
    public static Process start(ProcessBuilder pb) throws IOException {
        if (SETSID != null) {
            List<String> command = new ArrayList<>(pb.command().size() + 1);
            command.add(SETSID);
            command.addAll(pb.command());
            pb.command(command);
        }
        return pb.start();
    }

    /**
     * Kills the process, all its live descendants and every remaining member of its process group,
     * including children already orphaned by a parent that has exited. Safe to call after normal exit.
     */
    public static void killTree(Process process) {
        process.descendants().forEach(ProcessHandle::destroyForcibly);
        process.destroyForcibly();
        try {
            process.waitFor(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        if (SETSID != null) {
            killProcessGroup(process.pid());
        }
    }

    private static void killProcessGroup(long pgid) {
        try {
            Process kill = new ProcessBuilder("kill", "-KILL", "--", "-" + pgid)
                    .redirectOutput(ProcessBuilder.Redirect.DISCARD)
                    .redirectError(ProcessBuilder.Redirect.DISCARD)
                    .start();
            if (!kill.waitFor(10, TimeUnit.SECONDS)) {
                kill.destroyForcibly();
            }
        } catch (IOException e) {
            log.warn("[ScannerProcesses] Failed to kill process group {}: {}", pgid, e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private static String findSetsid() {
        for (String path : new String[]{"/usr/bin/setsid", "/bin/setsid"}) {
            if (new File(path).canExecute()) {
                return path;
            }
        }
        return null;
    }
}
