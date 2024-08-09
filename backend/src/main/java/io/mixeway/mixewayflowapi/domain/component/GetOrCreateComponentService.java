package io.mixeway.mixewayflowapi.domain.component;

import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.db.repository.ComponentRepository;
import io.mixeway.mixewayflowapi.exceptions.ComponentException;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanDataflow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetOrCreateComponentService {
    private final ComponentRepository componentRepository;

    public Component getOrCreate(String name, String group, String version, String origin) {
        if (name == null || version == null) {
            throw new ComponentException("Either name or version is null");
        }

        return componentRepository.findByNameAndVersionAndGroupid(name, version, group)
                .orElseGet(() -> componentRepository.save(new Component(group, name, version, origin)));
    }

    public List<Component> getOrCreateAndMap(BearerScanDataflow bearerScanDataflow){
        List<Component> components = new ArrayList<>();
        for (BearerScanDataflow.Dependency dependency : bearerScanDataflow.getDependencies()){
            Component component = getOrCreate(dependency.getName(), null, dependency.getVersion(), dependency.getDetector());
            components.add(component);
        }
        return componentRepository.saveAll(components);
    }
}
