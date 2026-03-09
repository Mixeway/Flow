from ..core.models import VulnerabilityInput
import logging
import re

logger = logging.getLogger(__name__)

# A simple semantic version parser

def parse_version(version_str):
    if not version_str:
        return []
    # Remove any non-numeric prefixes/suffixes, but keep dots
    cleaned_version = re.sub(r'[^0-9.]', '', version_str)
    parts = cleaned_version.split('.')
    return [int(p) for p in parts if p.isdigit()]

def analyze_dependency_versions(version_analysis_lines: list[str], vulnerability: VulnerabilityInput) -> str:
    """
    Analyzes extracted version strings to produce a structured risk assessment.
    Handles unbounded dependencies (e.g., '>=') which are high risk.
    """
    logger.info(f"Analyzing {len(version_analysis_lines)} version analysis lines for {vulnerability.name}")
    
    # Extract relevant package name from CVE name (e.g., 'CVE-2025-32434 in PyTorch')
    vulnerable_package_name = "unknown"
    match = re.search(r'in\s+([a-zA-Z0-9_-]+)', vulnerability.name, re.IGNORECASE)
    if match:
        vulnerable_package_name = match.group(1).lower()
    # Fallback for names like 'PyTorch CVE-...'
    elif 'pytorch' in vulnerability.name.lower() or 'torch' in vulnerability.name.lower():
        vulnerable_package_name = 'torch'
    
    logger.info(f"Vulnerable package identified for analysis: {vulnerable_package_name}")

    assessments = []
    
    for line in version_analysis_lines:
        # Clean up the line format "From file.txt: Found library versions: lib1>=1.0; lib2==2.0"
        content = line.split(":", 1)[-1].strip()
        if content.lower().startswith("found library versions:"):
            content = content[len("found library versions:"):].strip()
        
        dependencies = content.split(';')
        
        for dep in dependencies:
            dep = dep.strip()
            if not dep or "PRIORITY CVE-RELEVANT PACKAGES" in dep:
                continue

            # Universal pattern to capture package name, operator, and version
            match = re.match(r'([a-zA-Z0-9_.-]+)\s*([><=~!^]*)\s*v?([0-9a-zA-Z._+-]*)', dep)
            if not match:
                continue

            package, operator, version = match.groups()
            package = package.lower().strip()

            # Focus on the package relevant to the CVE
            if vulnerable_package_name != "unknown" and vulnerable_package_name not in package and package not in vulnerable_package_name:
                continue

            logger.info(f"Found relevant dependency: '{package}' with specifier '{operator}{version}'")

            risk = "UNCLEAR"
            instruction = "Assess based on other evidence."

            if operator in ('>=', '>', '^') and version:
                risk = "HIGH"
                instruction = (f"Unbounded dependency '{operator}{version}'. This range likely includes vulnerable versions. "
                               f"You MUST treat this as a high-risk indicator. **DO NOT** cap probability at 0.15. "
                               f"Proceed with a high base probability (0.6-0.9) if API usage is confirmed.")
            
            elif operator in ('<', '<='):
                risk = "MEDIUM"
                instruction = (f"Upper-bounded dependency '{operator}{version}'. While safer than unbounded, "
                               f"this may still include vulnerable versions. Verify against CVE's affected range.")

            elif operator in ('==', ''): # Handles '==' and exact versions like '1.2.3'
                risk = "INFO"
                instruction = f"Pinned dependency to exact version '{version}'. Verify if this specific version is vulnerable."

            elif operator == '~=':
                risk = "MEDIUM"
                instruction = f"Compatible release dependency '{operator}{version}'. Allows patch updates. Verify affected range."
            
            else:
                risk = "LOW"
                instruction = f"Operator '{operator}' indicates a likely safe, specific range, but verify."

            assessments.append(f"- Dependency: `{package} {operator}{version}` | Risk: **{risk}** | Instruction: {instruction}")

    if not assessments:
        logger.warning(f"No relevant version specifications found for '{vulnerable_package_name}' in provided lines.")
        return ""

    header = "\n=== DEPENDENCY RISK ASSESSMENT ===\n"
    assessment_str = "\n".join(assessments)
    logger.info(f"Generated dependency risk assessment for '{vulnerable_package_name}':\n{assessment_str}")
    
    return header + assessment_str + "\n"
