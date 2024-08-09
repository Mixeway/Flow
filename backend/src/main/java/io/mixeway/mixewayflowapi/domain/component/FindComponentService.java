package io.mixeway.mixewayflowapi.domain.component;

import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.db.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindComponentService {
    private final ComponentRepository componentRepository;

    public List<Component> findAll(){
        return componentRepository.findAll();
    }
}
