package io.mixeway.mixewayflowapi.api.constraint.service;

import io.mixeway.mixewayflowapi.api.constraint.dto.ConstraintDto;
import io.mixeway.mixewayflowapi.db.entity.Constraint;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.repository.ConstraintRepository;
import io.mixeway.mixewayflowapi.db.repository.VulnerabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConstraintService {

    private final ConstraintRepository constraintRepository;
    private final VulnerabilityRepository vulnerabilityRepository;


    public List<ConstraintDto> getAllConstraints() {
        return constraintRepository.findAll()
                .stream()
                .map(c -> new ConstraintDto(c.getId(), c.getText(), c.getVulnerability().getId()))
                .toList();
    }

    public ConstraintDto createConstraint(Long vulnerabilityId, String text) {
        Vulnerability vulnerability = vulnerabilityRepository.findById(vulnerabilityId)
                .orElseThrow(() -> new IllegalArgumentException("Vulnerability not found with id: " + vulnerabilityId));
        Constraint constraint = new Constraint(text);
        constraint.setVulnerability(vulnerability);

        Constraint saved = constraintRepository.save(constraint);
        return new ConstraintDto(saved.getId(), saved.getText(), saved.getVulnerability().getId());
    }

    public void deleteConstraint(Long id) {
        constraintRepository.deleteById(id);
    }
}
