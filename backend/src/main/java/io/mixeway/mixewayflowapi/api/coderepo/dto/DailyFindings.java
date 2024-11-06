package io.mixeway.mixewayflowapi.api.coderepo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Data
@NoArgsConstructor
@Log4j2
public class DailyFindings {
    private LocalDate date;
    private int findings;


    // Constructor matching the query parameters
    public DailyFindings(Object date, Object findings) {
        // Handle date conversion from String
        if (date instanceof String) {
            String dateString = (String) date;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // Adjust pattern as per your date format
            try {
                this.date = LocalDate.parse(dateString, formatter);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid date format: " + dateString, e);
            }
        }
        // Handle other date types if necessary
        else if (date instanceof java.sql.Date) {
            this.date = ((java.sql.Date) date).toLocalDate();
        } else if (date instanceof java.sql.Timestamp) {
            this.date = ((java.sql.Timestamp) date).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        } else if (date instanceof LocalDate) {
            this.date = (LocalDate) date;
        } else if (date != null) {
            throw new IllegalArgumentException("Unsupported date type: " + date.getClass().getName());
        } else {
            this.date = null; // or handle as per your requirement
        }

        // Handle findings conversion
        if (findings instanceof Integer) {
            this.findings = (Integer) findings;
        } else if (findings instanceof Long) {
            this.findings = ((Long) findings).intValue();
        } else if (findings instanceof BigDecimal) {
            this.findings = ((BigDecimal) findings).intValue();
        } else if (findings instanceof Number) {
            this.findings = ((Number) findings).intValue();
        } else if (findings != null) {
            throw new IllegalArgumentException("Unsupported findings type: " + findings.getClass().getName());
        } else {
            this.findings = 0; // or handle as per your requirement
        }
    }
}