package io.mixeway.mixewayflowapi.api.constraint.controller;

import io.mixeway.mixewayflowapi.api.constraint.dto.ConstraintDto;
import io.mixeway.mixewayflowapi.api.constraint.service.ConstraintService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@Validated
@RequiredArgsConstructor
@Log4j2
public class ConstraintController {

    private final ConstraintService constraintService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = "/api/v1/constraints")
    public ResponseEntity<List<ConstraintDto>> getConstraints() {
        try {
            return new ResponseEntity<List<ConstraintDto>>(constraintService.getAllConstraints(), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Failed to retrieve constraints", e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
