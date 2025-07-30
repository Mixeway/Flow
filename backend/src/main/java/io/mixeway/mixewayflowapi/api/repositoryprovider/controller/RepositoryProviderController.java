package io.mixeway.mixewayflowapi.api.repositoryprovider.controller;

import io.mixeway.mixewayflowapi.api.repositoryprovider.dto.CreateProviderRequestDto;
import io.mixeway.mixewayflowapi.api.repositoryprovider.dto.RepositoryProviderDto;
import io.mixeway.mixewayflowapi.api.repositoryprovider.service.RepositoryProviderService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/repository-provider")
public class RepositoryProviderController {

    private final RepositoryProviderService repositoryProviderService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/connect")
    public ResponseEntity<StatusDTO> connectProvider(@Valid @RequestBody CreateProviderRequestDto requestDto) {
        try {
            repositoryProviderService.createProvider(requestDto);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.CREATED);
        } catch (Exception e) {
            // Proper exception handling should be implemented
            return new ResponseEntity<>(new StatusDTO("error: " + e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("")
    public ResponseEntity<List<RepositoryProviderDto>> getProviders() {
        // Assuming repositoryProviderService.findAll() is implemented
        List<RepositoryProviderDto> providers = repositoryProviderService.findAll()
                .stream()
                .map(RepositoryProviderDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(providers);
    }
}
