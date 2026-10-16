package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Soft consistency only: when siblings in the same scan share a consistency key but
 * disagree on verdict, log the disagreement. The note is not written into developer-facing
 * reasoning, because the first verdict is not more correct than a later one.
 * Never mutates verdict, confidence, recommendation, or reasoning.
 */
@Service
@Log4j2
public class SastConsistencyService {

    private final Map<String, List<Item>> findingsByKey = new ConcurrentHashMap<>();

    public void clearScope(String scope) {
        String prefix = scopePrefix(scope);
        findingsByKey.keySet().removeIf(key -> key.startsWith(prefix));
    }

    public void recordFinding(String scope, Item item, FindingEvidence evidence) {
        if (item == null || evidence == null || evidence.consistencyKey() == null || evidence.consistencyKey().isBlank()
                || item.getAiVerdict() == null || item.getAiVerdict().isBlank()) {
            return;
        }

        String key = scopePrefix(scope) + evidence.consistencyKey();
        List<Item> siblings = findingsByKey.computeIfAbsent(key, ignored -> new ArrayList<>());
        synchronized (siblings) {
            siblings.add(item);
            warnOnSoftConflict(siblings);
        }
    }

    public void alignBatch(List<Item> items, Map<Item, FindingEvidence> evidenceByItem) {
        if (items == null || items.isEmpty() || evidenceByItem == null) {
            return;
        }
        Map<String, List<Item>> groups = new ConcurrentHashMap<>();
        for (Item item : items) {
            FindingEvidence evidence = evidenceByItem.get(item);
            if (item == null || evidence == null || evidence.consistencyKey() == null
                    || evidence.consistencyKey().isBlank() || item.getAiVerdict() == null) {
                continue;
            }
            groups.computeIfAbsent(evidence.consistencyKey(), ignored -> new ArrayList<>()).add(item);
        }
        for (List<Item> group : groups.values()) {
            synchronized (group) {
                warnOnSoftConflict(group);
            }
        }
    }

    private void warnOnSoftConflict(List<Item> siblings) {
        if (siblings.size() < 2) {
            return;
        }

        Item reference = siblings.get(0);
        String referenceVerdict = reference.getAiVerdict();
        if (referenceVerdict == null) {
            return;
        }

        for (int i = 1; i < siblings.size(); i++) {
            Item item = siblings.get(i);
            String verdict = item.getAiVerdict();
            if (verdict == null || referenceVerdict.equals(verdict)) {
                continue;
            }
            log.info("[SastConsistency] {} ({}) is {} but an earlier similar finding in this scan was {}. "
                            + "Leaving this verdict unchanged.",
                    item.getFilename(), item.getLineNumber(), verdict, referenceVerdict);
        }
    }

    private static String scopePrefix(String scope) {
        String normalized = scope == null ? "" : scope;
        return normalized + "|";
    }
}
