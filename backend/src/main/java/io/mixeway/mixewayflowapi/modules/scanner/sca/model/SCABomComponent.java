package io.mixeway.mixewayflowapi.modules.scanner.sca.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@AllArgsConstructor
@EqualsAndHashCode
public class SCABomComponent {

    private String group;
    private String name;
    private String version;
    private boolean transitive;
}
