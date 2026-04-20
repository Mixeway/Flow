package io.mixeway.mixewayflowapi.integrations.rag.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EmbeddingFloatCodecTest {

    @Test
    void roundTripAndCosine() {
        float[] v = new float[]{1f, 0f, 0f};
        byte[] bytes = EmbeddingFloatCodec.toBytes(v);
        float[] back = EmbeddingFloatCodec.fromBytes(bytes, 3);
        assertEquals(1f, back[0], 1e-6);
        assertEquals(1.0, EmbeddingFloatCodec.cosineSimilarity(v, v), 1e-6);
    }
}
