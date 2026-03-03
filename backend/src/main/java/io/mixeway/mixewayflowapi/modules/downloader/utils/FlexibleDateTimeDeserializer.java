package io.mixeway.mixewayflowapi.modules.downloader.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public class FlexibleDateTimeDeserializer extends JsonDeserializer<OffsetDateTime> {

    @Override
    public OffsetDateTime deserialize(JsonParser p, DeserializationContext context) throws IOException {
        String dateString = p.getText();

        try {
            return OffsetDateTime.parse(dateString);
        } catch (Exception e) {
            LocalDateTime localDateTime = LocalDateTime.parse(dateString);
            return localDateTime.atOffset(ZoneOffset.UTC);
        }
    }
}
