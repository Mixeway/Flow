package io.mixeway.mixewayflowapi.modules.scanner.sca.api.controller;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.modules.scanner.sca.service.CdxGenService;
import io.mixeway.mixewayflowapi.modules.scanner.sca.service.SCAScannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.cyclonedx.exception.ParseException;
import org.cyclonedx.model.Bom;
import org.cyclonedx.parsers.JsonParser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Log4j2
public class SCAScannerController {

    private final CdxGenService cdxGenService;
    private final CodeRepoRepository codeRepoRepository;
    private final SCAScannerService scaScannerService;

    @GetMapping(value ="/api/v1/sca/scan")
    public ResponseEntity<String> performSCAScan(@RequestParam Long codeRepoId) throws IOException, InterruptedException, ParseException {
        CodeRepo codeRepo = codeRepoRepository.findById(codeRepoId).orElseThrow();
        CodeRepoBranch codeRepoBranch = codeRepo.getBranches().getFirst();

        executeSCAScan("\\tmp\\Mixeway\\MixewayScanner", codeRepo, codeRepoBranch);

        return ResponseEntity.ok("Offline scan not yet implemented");
    }

    public void executeSCAScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) throws IOException, InterruptedException, ParseException {

        cdxGenService.generateBom(repoDir, codeRepo, codeRepoBranch);

        JsonParser parser = new JsonParser();
        Bom bom = parser.parse(new File(repoDir + "\\sbom.json"));

        scaScannerService.scanRepository(codeRepo, codeRepoBranch, bom);
    }
}
