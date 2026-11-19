package io.mixeway.mixewayflowapi.integrations.repo.apiclient;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class GitLabApiClientServicePaginationTest {

    @Test
    void readsKeysetNextLink() {
        String header = "<https://gitlab.com/api/v4/projects?id_after=42&order_by=id&pagination=keyset&per_page=100>; rel=\"next\", "
                + "<https://gitlab.com/api/v4/projects?id_before=1>; rel=\"prev\"";

        assertEquals(
                "https://gitlab.com/api/v4/projects?id_after=42&order_by=id&pagination=keyset&per_page=100",
                GitLabApiClientService.nextPageUrl(header));
    }

    @Test
    void ignoresLinkHeaderWithoutNext() {
        assertNull(GitLabApiClientService.nextPageUrl("<https://gitlab.com/api/v4/projects?id_before=1>; rel=\"prev\""));
        assertNull(GitLabApiClientService.nextPageUrl(null));
    }

    @Test
    void parsesRetryAfterSeconds() {
        assertEquals(30, GitLabApiClientService.retryAfterSeconds("30"));
        assertEquals(3600, GitLabApiClientService.retryAfterSeconds("9000"));
        assertEquals(60, GitLabApiClientService.retryAfterSeconds("Tue, 05 Jan 2021 11:00:00 GMT"));
        assertEquals(60, GitLabApiClientService.retryAfterSeconds(null));
    }
}
