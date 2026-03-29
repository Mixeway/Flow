package io.mixeway.mixewayflowapi.modules.scanner.sca.api.controller;

import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.modules.scanner.sca.service.CdxGenService;
import io.mixeway.mixewayflowapi.modules.scanner.sca.service.SCAScannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.cyclonedx.exception.ParseException;
import org.cyclonedx.model.Bom;
import org.cyclonedx.parsers.JsonParser;
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

    public void executeSCAScan(String repoDir, Long codeRepoId, CodeRepoBranch codeRepoBranch) throws IOException, InterruptedException, ParseException {

        cdxGenService.generateBom(repoDir);

        JsonParser parser = new JsonParser();
        Bom bom = parser.parse(new File(repoDir + File.separator + "sbom.json"));

        scaScannerService.scanRepository(codeRepoId, codeRepoBranch, bom);
    }
}
