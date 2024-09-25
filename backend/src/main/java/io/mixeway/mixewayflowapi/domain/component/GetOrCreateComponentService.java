package io.mixeway.mixewayflowapi.domain.component;

import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.db.repository.ComponentRepository;
import io.mixeway.mixewayflowapi.exceptions.ComponentException;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanDataflow;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
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

        group = group != null ? group : "";

        // Attempt to find the existing component
        Optional<Component> existingComponent = componentRepository.findByNameAndVersionAndGroupid(name, version, group);
        if (existingComponent.isPresent()) {
            return existingComponent.get();
        }

        // If not found, attempt to create a new component
        try {
            return componentRepository.save(new Component(group, name, version, origin));
        } catch (DataIntegrityViolationException e) {
            // This exception occurs if another thread created the component concurrently
            // Fetch the existing component after the exception
            return componentRepository.findByNameAndVersionAndGroupid(name, version, group)
                    .orElseThrow(() -> new ComponentException("Component not found after DataIntegrityViolationException"));
        }
    }


}
