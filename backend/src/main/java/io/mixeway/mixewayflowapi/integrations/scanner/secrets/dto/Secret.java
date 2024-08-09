package io.mixeway.mixewayflowapi.integrations.scanner.secrets.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

import java.util.List;

@Value
public class Secret {
    @JsonProperty("Description")
    String description;

    @JsonProperty("StartLine")
    int startLine;

    @JsonProperty("EndLine")
    int endLine;

    @JsonProperty("StartColumn")
    int startColumn;

    @JsonProperty("EndColumn")
    int endColumn;

    @JsonProperty("Match")
    String match;

    @JsonProperty("Secret")
    String secret;

    @JsonProperty("File")
    String file;

    @JsonProperty("SymlinkFile")
    String symlinkFile;

    @JsonProperty("Commit")
    String commit;

    @JsonProperty("Entropy")
    double entropy;

    @JsonProperty("Author")
    String author;

    @JsonProperty("Email")
    String email;

    @JsonProperty("Date")
    String date;

    @JsonProperty("Message")
    String message;

    @JsonProperty("Tags")
    List<String> tags;

    @JsonProperty("RuleID")
    String ruleId;

    @JsonProperty("Fingerprint")
    String fingerprint;
}