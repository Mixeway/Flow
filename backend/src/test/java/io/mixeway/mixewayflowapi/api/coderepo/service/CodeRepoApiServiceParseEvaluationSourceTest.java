package io.mixeway.mixewayflowapi.api.coderepo.service;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CodeRepoApiServiceParseEvaluationSourceTest {

    @Test
    void acceptsSastAndSecrets() {
        assertEquals(Finding.Source.SAST, CodeRepoApiService.parseEvaluationSource("sast"));
        assertEquals(Finding.Source.SAST, CodeRepoApiService.parseEvaluationSource("SAST"));
        assertEquals(Finding.Source.SECRETS, CodeRepoApiService.parseEvaluationSource("SECRETS"));
        assertEquals(Finding.Source.SECRETS, CodeRepoApiService.parseEvaluationSource("secret"));
    }

    @Test
    void rejectsMissingAndUnsupportedSources() {
        assertThrows(IllegalArgumentException.class, () -> CodeRepoApiService.parseEvaluationSource(null));
        assertThrows(IllegalArgumentException.class, () -> CodeRepoApiService.parseEvaluationSource(" "));
        assertThrows(IllegalArgumentException.class, () -> CodeRepoApiService.parseEvaluationSource("IAC"));
        assertThrows(IllegalArgumentException.class, () -> CodeRepoApiService.parseEvaluationSource("SCA"));
    }
}
