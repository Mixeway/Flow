package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Soft consistency only: when siblings share a consistency key but disagree on verdict,
 * append a warning to reasoning. Never mutates verdict, confidence, or recommendation.
 */
@Service
@Log4j2
public class SastConsistencyService {

    private final Map<String, List<Item>> findingsByKey = new ConcurrentHashMap<>();

    public void recordFinding(Item item, FindingEvidence evidence) {
        if (item == null || evidence == null || evidence.consistencyKey() == null || evidence.consistencyKey().isBlank()
                || item.getAiVerdict() == null || item.getAiVerdict().isBlank()) {
            return;
        }

        String key = evidence.consistencyKey();
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
            String note = "Consistency warning: a structurally similar finding was previously classified as "
                    + referenceVerdict
                    + ". Re-check whether the same source/sink/primitive case is being judged differently.";
            String reasoning = item.getAiReasoning();
            if (reasoning == null || !reasoning.contains("Consistency warning:")) {
                item.setAiReasoning(reasoning == null || reasoning.isBlank() ? note : reasoning + "\n\n" + note);
            }
        }
    }
}
