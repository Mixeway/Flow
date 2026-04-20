package io.mixeway.mixewayflowapi.integrations.rag.util;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public final class EmbeddingFloatCodec {

    private EmbeddingFloatCodec() {}

    public static byte[] toBytes(float[] v) {
        ByteBuffer bb = ByteBuffer.allocate(v.length * 4).order(ByteOrder.LITTLE_ENDIAN);
        for (float f : v) {
            bb.putFloat(f);
        }
        return bb.array();
    }

    public static float[] fromBytes(byte[] b, int dim) {
        ByteBuffer bb = ByteBuffer.wrap(b).order(ByteOrder.LITTLE_ENDIAN);
        float[] out = new float[dim];
        for (int i = 0; i < dim; i++) {
            out[i] = bb.getFloat();
        }
        return out;
    }

    public static double cosineSimilarity(float[] a, float[] b) {
        if (a.length != b.length) {
            return 0;
        }
        double dot = 0;
        double na = 0;
        double nb = 0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            na += a[i] * a[i];
            nb += b[i] * b[i];
        }
        if (na <= 0 || nb <= 0) {
            return 0;
        }
        return dot / (Math.sqrt(na) * Math.sqrt(nb));
    }
}
