package io.mixeway.mixewayflowapi.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.db.entity.Constraint;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.integrations.exploit.model.nist.NistInputCvssV31;
import io.mixeway.mixewayflowapi.integrations.exploit.model.nist.NistInputVulnerability;
import io.mixeway.mixewayflowapi.integrations.exploit.model.nist.NistInputVulnerableConfiguration;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Log4j2
public class ExcelService {

    public static String createVulnerabilitySummaryExcel(List<Vulnerability> vulnerabilities, String repoUrl, String repoName, String path) {
        try (Workbook workbook = new XSSFWorkbook()) {
            ObjectMapper objectMapper = new ObjectMapper();
            Sheet sheet = workbook.createSheet("Data");
            createHeaderRow(sheet);

            int cnt = 1;
            for(Vulnerability vulnerability: vulnerabilities) {
                if(vulnerability.getName().startsWith("CVE")) {
                    createVulnerabilityRow(sheet, vulnerability, repoUrl, objectMapper, cnt);
                    cnt = cnt + 1;
                }
            }
            log.info("Writing to file {}", path + ".xlsx");
            // Write to file
            try (FileOutputStream out = new FileOutputStream(path + ".xlsx")) {
                workbook.write(out);
            } catch (IOException e) {
                throw new IOException(e);
            }
        return null;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static void createVulnerabilityRow(Sheet sheet, Vulnerability vulnerability, String repoUrl, ObjectMapper objectMapper, int cnt) throws JsonProcessingException {
        Row row = sheet.createRow(cnt);
        row.createCell(0).setCellValue(vulnerability.getName());
        row.createCell(1).setCellValue(vulnerability.getDescription());

        String constraints = vulnerability.getConstraints()
                .stream()
                .map(Constraint::getText)
                .collect(Collectors.joining("; "));
        if (constraints.length() < 32765)
            row.createCell(2).setCellValue(constraints);

        row.createCell(3).setCellValue(repoUrl);
        row.createCell(4).setCellValue(0.5);
        row.createCell(5).setCellValue(false);

        String nistData = getNistJsonData(vulnerability, objectMapper);
        if (nistData.length() < 32765)
            row.createCell(6).setCellValue(nistData);
    }

    private static void createHeaderRow(Sheet sheet) {
        Row row = sheet.createRow(0);
        row.createCell(0).setCellValue("Name");
        row.createCell(1).setCellValue("Summary");
        row.createCell(2).setCellValue("Constraints");
        row.createCell(3).setCellValue("Repository");
        row.createCell(4).setCellValue("Probability");
        row.createCell(5).setCellValue("Exploitable");
        row.createCell(6).setCellValue("NVD_Data");
    }

    private static String getNistJsonData(Vulnerability vulnerability, ObjectMapper objectMapper) throws JsonProcessingException {
        NistInputVulnerability nistInputVulnerability = new NistInputVulnerability();
        nistInputVulnerability.setId(vulnerability.getName());
        nistInputVulnerability.setDescription(vulnerability.getDescription());
        nistInputVulnerability.setPublished_date(String.valueOf(vulnerability.getPublishedDate()));
        nistInputVulnerability.setLast_modified_date(String.valueOf(vulnerability.getNistLastModifiedDate()));
        if(vulnerability.getWeaknesses() != null)
            nistInputVulnerability.setWeaknesses(Arrays.stream(vulnerability.getWeaknesses().split(";")).toList());
        else
            nistInputVulnerability.setWeaknesses(new ArrayList<>());

        nistInputVulnerability.setVulnerable_configurations(vulnerability.getConfigurations().stream().map(NistInputVulnerableConfiguration::new).toList());

        nistInputVulnerability.setCvss_v31(new NistInputCvssV31(vulnerability));

        return objectMapper.writeValueAsString(nistInputVulnerability);
    }
}
