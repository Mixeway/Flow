package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class OpenRedirectSafetyEvidenceTest {

    @Test
    void detectsGeoServerSearchParamsOnlyPattern() {
        String code = """
                var url = new URL(window.location.href);
                if (workspace) {
                    url.searchParams.set('workspace', workspace);
                }
                url.searchParams.delete('layer');
                window.location.href = url.toString();
                """;
        assertTrue(OpenRedirectSafetyEvidence.present(code));
    }

    @Test
    void detectsLocationHrefBase() {
        String code = """
                const url = new URL(location.href);
                url.searchParams.set('q', q);
                location.assign(url.toString());
                """;
        assertTrue(OpenRedirectSafetyEvidence.present(code));
    }

    @Test
    void detectsRelativeLiteralRedirect() {
        assertTrue(OpenRedirectSafetyEvidence.present("window.location.href = '/dashboard';"));
        assertTrue(OpenRedirectSafetyEvidence.present("location.assign('./next');"));
    }

    @Test
    void detectsReviewerSameOriginPhrasing() {
        assertTrue(OpenRedirectSafetyEvidence.present(
                "window.location.href = url.toString();",
                "The url variable is constructed from window.location.href. "
                        + "The code modifies search parameters and is not being redirected to an external host."));
    }

    @Test
    void rawUserControlledRedirectIsNotEvidence() {
        assertFalse(OpenRedirectSafetyEvidence.present("window.location.href = request.getParameter('next');"));
        assertFalse(OpenRedirectSafetyEvidence.present("location.href = userUrl;"));
    }

    @Test
    void sameOriginBaseWithHostMutationIsNotEvidence() {
        String code = """
                var url = new URL(window.location.href);
                url.host = attackerHost;
                url.searchParams.set('x', '1');
                window.location.href = url.toString();
                """;
        assertFalse(OpenRedirectSafetyEvidence.present(code));
    }

    @Test
    void newUrlFromUserInputIsNotEvidence() {
        String code = """
                var url = new URL(userInput);
                url.searchParams.set('x', '1');
                window.location.href = url.toString();
                """;
        assertFalse(OpenRedirectSafetyEvidence.present(code));
    }
}
