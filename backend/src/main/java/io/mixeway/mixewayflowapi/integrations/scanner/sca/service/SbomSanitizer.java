package io.mixeway.mixewayflowapi.integrations.scanner.sca.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.packageurl.MalformedPackageURLException;
import com.github.packageurl.PackageURL;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

/**
 * Removes components without a concrete version from a CycloneDX SBOM before it is passed to grype.
 *
 * <p>When cdxgen cannot resolve a Maven project it falls back to parsing {@code pom.xml}, which leaves
 * dependencies managed by an unresolved parent without a version. Grype then matches such packages by
 * name only (via CPE) and reports every known CVE of the library regardless of the version in use.</p>
 */
@Service
@Log4j2
@RequiredArgsConstructor
public class SbomSanitizer {

    private final ObjectMapper objectMapper;

    /**
     * Rewrites {@code sbomFile} in place without unversioned components and without dependency
     * entries referring to them.
     *
     * @return identifiers (purl or name) of the removed components
     */
    public List<String> removeUnversionedComponents(File sbomFile) throws IOException {
        JsonNode root = objectMapper.readTree(sbomFile);
        if (!(root instanceof ObjectNode)) {
            return List.of();
        }

        List<String> removed = new ArrayList<>();
        Set<String> removedRefs = new HashSet<>();
        removeFromComponentList(root.get("components"), removed, removedRefs);

        if (removed.isEmpty()) {
            return removed;
        }

        JsonNode dependencies = root.get("dependencies");
        if (dependencies instanceof ArrayNode dependencyArray) {
            Iterator<JsonNode> it = dependencyArray.elements();
            while (it.hasNext()) {
                JsonNode dependency = it.next();
                if (removedRefs.contains(dependency.path("ref").asText(null))) {
                    it.remove();
                    continue;
                }
                JsonNode dependsOn = dependency.get("dependsOn");
                if (dependsOn instanceof ArrayNode dependsOnArray) {
                    Iterator<JsonNode> depIt = dependsOnArray.elements();
                    while (depIt.hasNext()) {
                        if (removedRefs.contains(depIt.next().asText())) {
                            depIt.remove();
                        }
                    }
                }
            }
        }

        objectMapper.writeValue(sbomFile, root);
        log.warn("[SbomSanitizer] Removed {} component(s) without a version from {}: {}",
                removed.size(), sbomFile.getAbsolutePath(), removed);
        return removed;
    }

    private void removeFromComponentList(JsonNode components, List<String> removed, Set<String> removedRefs) {
        if (!(components instanceof ArrayNode componentArray)) {
            return;
        }
        Iterator<JsonNode> it = componentArray.elements();
        while (it.hasNext()) {
            JsonNode component = it.next();
            if (hasUsableVersion(component)) {
                removeFromComponentList(component.get("components"), removed, removedRefs);
                continue;
            }
            String purl = component.path("purl").asText("");
            String bomRef = component.path("bom-ref").asText("");
            removed.add(!purl.isBlank() ? purl : component.path("name").asText(""));
            if (!bomRef.isBlank()) {
                removedRefs.add(bomRef);
            }
            if (!purl.isBlank()) {
                removedRefs.add(purl);
            }
            it.remove();
        }
    }

    private static boolean hasUsableVersion(JsonNode component) {
        String version = component.path("version").asText("");
        String purl = component.path("purl").asText("");
        if (!purl.isBlank()) {
            try {
                String purlVersion = new PackageURL(purl).getVersion();
                if (purlVersion != null) {
                    version = purlVersion;
                }
            } catch (MalformedPackageURLException ignored) {
            }
        }
        return !version.isBlank() && !version.contains("${");
    }
}
