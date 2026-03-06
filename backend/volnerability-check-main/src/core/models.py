import time

from typing import List, Optional, Any, Literal
from pydantic import BaseModel, Field

# ==========================================
# SYNTHESIS ANALYSIS MODELS
# ==========================================

class VulnerabilityInput(BaseModel):
    """Input data for vulnerability analysis from XLSX file."""
    name: str = Field(..., alias="Name")
    constraints: str = Field(..., alias="Constraints")  # What the LLM analyzes
    repository: str = Field(..., alias="Repository")

    # Optional fields for evaluation mode (when ground truth is available)
    summary: Optional[str] = Field(None, alias="Summary")  # Ground truth summary (not shown to LLM)
    probability: Optional[float] = Field(None, alias="Probability")  # Ground truth probability
    exploitable: Optional[bool] = Field(None, alias="Exploitable")  # Ground truth exploitability

    # Optional NVD data (pre-fetched by external worker)
    nvd_data: Optional[str] = Field(None, alias="NVD_Data")  # JSON string with NVD information

    @property
    def has_ground_truth(self) -> bool:
        """Check if this vulnerability has ground truth data for evaluation."""
        return self.probability is not None and self.exploitable is not None

    @property
    def has_nvd_data(self) -> bool:
        """Check if NVD data was provided."""
        return self.nvd_data is not None and self.nvd_data.strip() != ""

class EvidenceSnippet(BaseModel):
    source: Literal["code_triage", "nvd", "web_research"] = Field(description="The intelligence source this evidence was extracted from.")
    file: Optional[str] = Field(description="File path (if applicable, primarily for code_triage).")
    start_line: Optional[int] = Field( description="Starting line number of the code snippet (if applicable).")
    end_line: Optional[int] = Field(description="Ending line number of the code snippet (if applicable).")
    content: str = Field(description="The relevant evidence content (code snippet, NVD quote, or web research fact).")
    significance: str = Field(description="Detailed explanation of how this specific evidence impacts the final assessment.")

    @classmethod
    def create_fallback(cls, error_message: str) -> EvidenceSnippet:
        return cls(
            source="code_triage",
            file="unknown", start_line=0, end_line=0,
            content=f"Analysis failed: {error_message}",
            significance="System fallback record indicating critical failure."
        )

class Contradiction(BaseModel):
    code_triage: str = Field(description="What the Code Triage analysis found.")
    nvd_data: str = Field(description="What the NVD data shows.")
    web_research: str = Field(description="What the Web Research found.")
    resolution: str = Field(description="Your expert resolution of this contradiction, explaining which source you trusted and why.")
    aspect: str = Field(description="The specific fact or aspect where sources disagree.")

    @classmethod
    def create_fallback(cls, error_message: str) -> Contradiction:
        return cls(
            code_triage="Failed", nvd_data="Failed", web_research="Failed",
            resolution="Cannot resolve due to system error.",
            aspect=f"System Error: {error_message}"
        )

class SourceCorrelation(BaseModel):
    agreements: List[str] = Field(description="List of key facts where all available sources agree.")
    contradictions: List[Contradiction] = Field(description="List of discrepancies between sources and how they were resolved.")
    confidence_factors: List[str] = Field(description="Specific factors that increase confidence in this assessment.")
    uncertainty_factors: List[str] = Field(description="Specific factors (missing data, unclear code) that create uncertainty.")

    @classmethod
    def create_fallback(cls, error_message: str) -> SourceCorrelation:
        return cls(
            agreements=[],
            contradictions=[Contradiction.create_fallback(error_message)],
            confidence_factors=[],
            uncertainty_factors=[f"Critical system failure: {error_message}"]
        )

class DetectedMitigation(BaseModel):
    name: str = Field(description="Name of the mitigation (e.g., 'Input Validation', 'Authentication').")
    source: str = Field(description="Which analysis (Code Triage, Web Research) found this.")
    impact: Literal["ineffective", "partial", "strong", "complete"] = Field(description="Categorical assessment of the mitigation's effectiveness against this specific CVE.")
    assessment: str = Field(description="Detailed explanation of why this mitigation provides the stated level of impact.")

    @classmethod
    def create_fallback(cls, error_message: str) -> DetectedMitigation:
        return cls(
            name="Analysis Failed",
            source="System",
            impact="ineffective",
            assessment=f"Mitigation detection aborted: {error_message}"
        )

class VersionAssessment(BaseModel):
    code_analysis: str = Field(description="Version information extracted directly from code dependencies.")
    nvd_data: str = Field(description="Vulnerable version ranges reported by NVD.")
    web_research: str = Field(description="Version information gathered from security advisories and web research.")
    final_determination: str = Field(description="Your synthesized, final conclusion on whether the installed version is vulnerable.")
    confidence: Literal["high", "medium", "low"] = Field(description="Confidence in the final version determination.")

    @classmethod
    def create_fallback(cls, error_message: str) -> VersionAssessment:
        return cls(
            code_analysis="Failed", nvd_data="Failed", web_research="Failed",
            final_determination=f"Unknown due to error: {error_message}",
            confidence="low"
        )

class ExploitAssessment(BaseModel):
    technical_feasibility: str = Field(description="Assessment of technical exploit feasibility based on code paths and prerequisites.")
    attack_scenarios: List[str] = Field(description="Realistic attack scenarios based on all combined intelligence.")
    exploitation_barriers: List[str] = Field(description="Barriers to successful exploitation (e.g., requires admin auth, specific network config).")
    real_world_context: str = Field(description="Context from web research about actual in-the-wild usage or incidents.")

    @classmethod
    def create_fallback(cls, error_message: str) -> ExploitAssessment:
        return cls(
            technical_feasibility="Unknown",
            attack_scenarios=[],
            exploitation_barriers=[f"Analysis aborted: {error_message}"],
            real_world_context="Unknown"
        )

class VulnerabilitySynthesisResult(BaseModel):
    """Output schema for the Synthesis Analysis LLM."""
    status: Literal["confirmed", "not_confirmed", "uncertain"] = Field(description="Final vulnerability status based on rigorous evidence.")
    confidence: int = Field(ge=1, le=5, description="Confidence score from 1 (No evidence) to 5 (Definitive proof).")
    probability: float = Field(
        ge=0.0, le=1.0,
        description="Final calculated probability (0.0 to 1.0) based on the strict decision matrix."
    )
    predicted_probability: float = Field(
        ge=0.0, le=1.0,
        description="Identical to probability (maintained for pipeline compatibility)."
    )
    exploitable: bool = Field(description="True if the vulnerability is practically exploitable in this specific codebase.")
    predicted_exploitable: bool = Field(description="Identical to exploitable (maintained for pipeline compatibility).")
    analysis_summary: str = Field(description="Comprehensive analysis integrating all intelligence sources (2-3 sentences max).")
    detailed_reasoning: str = Field(
        min_length=1500,
        description=(
            "COMPREHENSIVE STEP-BY-STEP JUSTIFICATION (MUST BE EXHAUSTIVE, 1500+ CHARACTERS). "
            "You MUST explicitly include: "
            "1. API USAGE VERIFICATION (Explicitly state if API is called vs imported). "
            "2. VERSION ANALYSIS. "
            "3. CONSTRAINT-BY-CONSTRAINT EVALUATION. "
            "4. EVIDENCE CROSS-VALIDATION. "
            "5. PROBABILITY JUSTIFICATION (Explain the exact numbers). "
            "6. EXPLOITABILITY ASSESSMENT. "
            "7. MITIGATION IMPACT."
        )
    )
    evidence_snippets: List[EvidenceSnippet] = Field(description="Concrete snippets of evidence supporting the analysis.")
    source_correlation: SourceCorrelation = Field(description="Analysis of how the different intelligence sources align or conflict.")
    mitigations_detected: List[DetectedMitigation] = Field(description="List of security controls and their assessed impact.")
    version_assessment: VersionAssessment = Field(description="Synthesized assessment of library versions.")
    exploit_assessment: ExploitAssessment = Field(description="Assessment of how this could actually be exploited.")
    suggested_next_steps: str = Field(description="Prioritized, actionable recommendations based on the complete analysis.")

    @classmethod
    def create_fallback(
            cls, vulnerability: Any, chunks_to_analyze: List[Any], error_message: str, confidence: int = 1
    ) -> VulnerabilitySynthesisResult:

        enhanced_summary = (
            f"Analysis failed for {vulnerability.name}: {error_message}. "
            f"Affects {len(chunks_to_analyze)} code files. "
            f"Expected exploitability: {getattr(vulnerability, 'exploitable', 'Unknown')}, "
            f"Expected probability: {getattr(vulnerability, 'probability', 0.0)}. "
            "Manual analysis required."
        )

        detailed_reasoning = (
            f"ANALYSIS FAILURE REPORT:\n\n"
            f"Error: {error_message}\n\n"
            f"Context: Analysis pipeline encountered an error while processing {vulnerability.name}.\n"
            f"Chunks available: {len(chunks_to_analyze)}\n"
            f"Constraints: {vulnerability.constraints}\n\n"
            "Manual review is required as automated analysis could not complete successfully.\n\n"
        )

        if len(detailed_reasoning) < 1500:
            padding = "--- [SYSTEM LOG: AUTOMATED ANALYSIS ABORTED] ---\n"
            multiplier = (1500 - len(detailed_reasoning)) // len(padding) + 1
            detailed_reasoning += padding * multiplier

        enhanced_next_steps = (
            f"1. Review {vulnerability.name} constraints: {vulnerability.constraints}\n"
            "2. Check system logs for specific API or parsing error details.\n"
            "3. Verify code chunks contain relevant patterns.\n"
            "4. Consider manual code review focusing on constraint areas."
        )

        return cls(
            status="uncertain",
            confidence=confidence,
            probability=0.5,
            predicted_probability=0.5,
            exploitable=False,
            predicted_exploitable=False,
            analysis_summary=enhanced_summary,
            detailed_reasoning=detailed_reasoning,
            evidence_snippets=[EvidenceSnippet.create_fallback(error_message)],
            source_correlation=SourceCorrelation.create_fallback(error_message),
            mitigations_detected=[DetectedMitigation.create_fallback(error_message)],
            version_assessment=VersionAssessment.create_fallback(error_message),
            exploit_assessment=ExploitAssessment.create_fallback(error_message),
            suggested_next_steps=enhanced_next_steps
        )

class VulnerabilityAnalysis(VulnerabilitySynthesisResult):
    """
        The complete, final vulnerability assessment record, combining
        the AI's analytical findings with core project metadata.
    """
    vulnerability_id: str = Field(description="The unique identifier for the assessed vulnerability (e.g., CVE-YYYY-NNNN).")
    vulnerability_name: str = Field(description="The standard designation or title of the vulnerability being analyzed.")
    files_analyzed: List[str] = Field(description="The comprehensive list of file paths that were scanned and evaluated during the assessment.")
    ground_truth_probability: Optional[float] = Field(description="The verified, baseline probability of exploitation, used as a benchmark for evaluating analytical accuracy.")
    ground_truth_exploitable: Optional[bool] = Field(description="The verified, real-world exploitability status of the vulnerability, used as a benchmark.")

    @classmethod
    def create_fallback(
            cls, vulnerability: Any, chunks_to_analyze: List[Any], error_message: str, confidence: int = 1
    ) -> VulnerabilityAnalysis:
        base_fallback = VulnerabilitySynthesisResult.create_fallback(
            vulnerability, chunks_to_analyze, error_message, confidence
        )

        return cls(
            **base_fallback.model_dump(),
            vulnerability_id=vulnerability.name,
            vulnerability_name=vulnerability.name,
            files_analyzed=[str(chunk.file_path) for chunk in chunks_to_analyze],
            ground_truth_probability=getattr(vulnerability, 'probability', None),
            ground_truth_exploitable=getattr(vulnerability, 'exploitable', None)
        )

# ==========================================
# CHUNK ORGANIZER MODELS
# ==========================================

class OrganizedChunk(BaseModel):
    """Details for a specific organized code chunk."""
    index: int = Field(description="The original index of the chunk.")
    priority: int = Field(
        ge=1, le=10,
        description="Priority ranking from 1 (lowest) to 10 (highest relevance)."
    )
    relevance: Literal["high", "medium", "low"] = Field(description="Categorical relevance of the chunk.")
    focus_areas: List[str] = Field(description="Specific functions, variables, or logic paths to examine.")
    notes: str = Field(description="Explanation of why this chunk is important for the vulnerability.")

    @classmethod
    def create_fallback(cls, index: int, error_message: str) -> OrganizedChunk:
        return cls(
            index=index,
            priority=5,
            relevance="medium",
            focus_areas=["general analysis"],
            notes=f"Fallback organization due to API failure: {error_message}"
        )

class ChunkOrganizerResult(BaseModel):
    """Output schema for the Chunk Organizer LLM."""
    organized_chunks: List[OrganizedChunk] = Field(description="List of chunks ranked by likelihood of containing the vulnerability.")
    strategy: str = Field(description="Overall step-by-step analysis approach for the Code Agent.")
    key_patterns: List[str] = Field(...,
        description="Specific vulnerable code patterns or API misuses to watch for."
    )
    security_context: str = Field(description="Overall assessment of the codebase's security context based on the summaries.")

    @classmethod
    def create_fallback(cls, original_chunks: List[Any], error_message: str) -> ChunkOrganizerResult:
        fallback_chunks = [
            OrganizedChunk.create_fallback(index=i, error_message=error_message)
            for i in range(len(original_chunks))
        ]

        return cls(
            organized_chunks=fallback_chunks,
            strategy="fallback_due_to_error",
            key_patterns=[],
            security_context=f"analysis_failed: {error_message}"
        )

# ==========================================
# QUERY EXPANSION MODELS
# ==========================================

class ExpandedQuery(BaseModel):
    """Output schema for the Query Expansion LLM."""
    expanded_query: str = Field(description="The highly optimized, raw search query combining the vulnerability name and constraints. Do not include conversational text.")

    @classmethod
    def create_fallback(cls, vulnerability: Any, error_message: str) -> ExpandedQuery:
        fallback_text = f"{vulnerability.name}\n{vulnerability.constraints}"

        return cls(expanded_query=fallback_text)

# ==========================================
# CODE TRIAGE MODELS
# ==========================================

class ApiUsage(BaseModel):
    function: str = Field(description="Exact function name (e.g., torch.load, XMLUnit.transform)")
    file: str = Field(description="path/to/file.ext")
    lines: str = Field(description="Line range")
    code_snippet: str = Field(description="Exact code showing ACTUAL FUNCTION CALL (not just import)")
    active: bool = Field(description="True if in active code path, False if dead/commented")
    context: str = Field(description="Surrounding context explanation")
    usage_type: Literal["function_call", "import_only"] = Field(
        description="CRITICAL: Mark as 'import_only' if it is just an import statement. Mark as 'function_call' only if the function is actively executed."
    )
    location_type: Literal["user_code", "library_internal"] = Field(
        description="Set to 'library_internal' if path contains node_modules, site-packages, vendor, etc. Otherwise 'user_code'."
    )
    note: str = Field(description="Any specific notes about this usage")

    @classmethod
    def create_fallback(cls, error_message: str) -> ApiUsage:
        return cls(
            function="[ANALYSIS FAILED]",
            file="unknown",
            lines="0",
            code_snippet="N/A",
            active=False,
            context=f"API usage analysis failed: {error_message}",
            usage_type="import_only",
            location_type="library_internal",
            note="System fallback record"
        )

class VersionInformation(BaseModel):
    library: str = Field(description="The name of the library or dependency being analyzed")
    version: str = Field(description="The exact version string found in the dependency file (e.g., '1.2.9', '^2.0.0')")
    file: str = Field(description="The file path of the dependency file (e.g., 'pom.xml', 'requirements.txt')")
    lines: str = Field(description="The line numbers where the version is declared")
    code: str = Field( description="The verbatim code snippet showing the version declaration")

    @classmethod
    def create_fallback(cls, error_message: str) -> VersionInformation:
        return cls(
            library="[ANALYSIS FAILED]",
            version="unknown",
            file="unknown",
            lines="0",
            code=f"Version info unavailable: {error_message}"
        )

class DependencyAnalysis(BaseModel):
    files_found: List[str] = Field(description="List of dependency/manifest files discovered during the analysis")
    version_information: List[VersionInformation] = Field( description="Detailed version information extracted for the target libraries")
    version_status: Literal["vulnerable", "safe", "unknown"] = Field(description="Assessment of whether the discovered versions fall into the known vulnerable range")
    confidence: Literal["high", "medium", "low"] = Field(description="Confidence level in the dependency and version analysis")
    missing_dependencies: List[str] = Field(description="List specific libraries required by constraints but NOT found in dependency files (critical for co-requisites)")

    @classmethod
    def create_fallback(cls, error_message: str) -> DependencyAnalysis:
        return cls(
            files_found=[],
            version_information=[VersionInformation.create_fallback(error_message)],
            version_status="unknown",
            confidence="low",
            missing_dependencies=[f"Dependency analysis failed: {error_message}"]
        )

class SecurityConfiguration(BaseModel):
    type: str = Field(description="The type or category of the configuration (e.g., 'XML Parser', 'HTTP/2 Server')")
    file: str = Field(description="The file path where the configuration is defined")
    setting: str = Field(description="The specific configuration key or setting name found")
    value: str = Field(description="The value assigned to the configuration setting")
    security_relevance: str = Field(description="Detailed explanation of how this specific configuration relates to the vulnerability (e.g., enables the attack vector, disables a security check)")

    @classmethod
    def create_fallback(cls, error_message: str) -> SecurityConfiguration:
        return cls(
            type="[ANALYSIS FAILED]",
            file="unknown",
            setting="unknown",
            value="unknown",
            security_relevance=f"Configuration analysis aborted: {error_message}"
        )

class MitigationFound(BaseModel):
    type: str = Field(description="The category of mitigation (e.g., 'Input Validation', 'Authentication', 'Safe Parser')")
    location: str = Field(description="File path and line numbers where the mitigation is implemented")
    description: str = Field(description="Explanation of what this mitigation does and how it protects the code")
    effectiveness: str = Field(description="Estimated effectiveness of this mitigation against this specific vulnerability (e.g., 'Prevents SSRF', 'Easily bypassed')")

    @classmethod
    def create_fallback(cls, error_message: str) -> MitigationFound:
        return cls(
            type="[ANALYSIS FAILED]",
            location="unknown",
            description=f"Mitigation analysis aborted: {error_message}",
            effectiveness="unknown"
        )

class PatternExample(BaseModel):
    file: str = Field(description="File path containing the code pattern")
    lines: str = Field(description="Line numbers for the pattern example")
    code: str = Field(description="Verbatim code snippet demonstrating the pattern")

    @classmethod
    def create_fallback(cls) -> PatternExample:
        return cls(
            file="unknown",
            lines="0",
            code="N/A"
        )

class CodePattern(BaseModel):
    pattern: str = Field(description="Description of the architectural or coding pattern observed")
    matches: int = Field(description="Total number of times this pattern was found in the codebase")
    examples: List[PatternExample] = Field(description="Specific examples of where this pattern was found")

    @classmethod
    def create_fallback(cls, error_message: str) -> CodePattern:
        return cls(
            pattern=f"[ANALYSIS FAILED] Pattern extraction aborted: {error_message}",
            matches=0,
            examples=[PatternExample.create_fallback()]
        )

class NegativeEvidence(BaseModel):
    searched_for: str = Field(description="The specific API, pattern, or constraint that was searched for but NOT found")
    matches: int = Field(description="The number of matches found (should be 0 for negative evidence)")
    confidence: Literal["high", "medium", "low"] = Field(description="Confidence level in this negative result (e.g., high if a thorough regex/keyword search was performed)")

    @classmethod
    def create_fallback(cls, error_message: str) -> NegativeEvidence:
        return cls(
            searched_for=f"Analysis aborted due to error: {error_message}",
            matches=0,
            confidence="low"
        )

class CodeTriageResult(BaseModel):
    """The raw, objective facts extracted from the codebase."""
    api_usage: List[ApiUsage] = Field(description="List of all discovered usages of the target APIs")
    dependency_analysis: DependencyAnalysis = Field(description="Comprehensive analysis of project dependencies and versions")
    security_configurations: List[SecurityConfiguration] = Field(description="List of relevant security configurations discovered")
    mitigations_found: List[MitigationFound] = Field(description="List of defensive coding practices or mitigations found in the code")
    code_patterns: List[CodePattern] = Field(description="Broader code patterns relevant to the vulnerability constraints")
    negative_evidence: List[NegativeEvidence] = Field(description="Explicit documentation of things searched for but not found")
    analysis_summary: str = Field(description="An objective, factual summary of the code findings without speculative risk assessment")
    evidence_quality: str = Field(description="An assessment of the completeness and reliability of the evidence extracted")

    @classmethod
    def create_fallback(cls, error_message: str) -> CodeTriageResult:
        return cls(
            api_usage=[ApiUsage.create_fallback(error_message)],
            dependency_analysis=DependencyAnalysis.create_fallback(error_message),
            security_configurations=[SecurityConfiguration.create_fallback(error_message)],
            mitigations_found=[MitigationFound.create_fallback(error_message)],
            code_patterns=[CodePattern.create_fallback(error_message)],
            negative_evidence=[NegativeEvidence.create_fallback(error_message)],
            analysis_summary=f"Code triage comprehensively aborted. System Error: {error_message}",
            evidence_quality="low"
        )

# ==========================================
# WEB RESEARCH MODELS
# ==========================================

class VulnerabilityDetails(BaseModel):
    title: str = Field(description="Official vulnerability title")
    description: str = Field(description="Detailed technical description")
    impact: str = Field(description="Potential impact and severity")
    attack_vector: str = Field(description="How the vulnerability can be exploited")
    root_cause: str = Field(description="Technical root cause analysis")

    @classmethod
    def create_fallback(cls, vuln_name: str, error_message: str) -> VulnerabilityDetails:
        return cls(
            title=f"Research unavailable for {vuln_name}",
            description=f"Web research could not be completed: {error_message}",
            impact="Unknown - research failed",
            attack_vector="Unknown - research failed",
            root_cause="Unknown - research failed"
        )

class VersionIntelligence(BaseModel):
    affected_versions: List[str] = Field(description="List of affected version ranges")
    patched_versions: List[str] = Field(description="List of versions with fixes")
    version_details: str = Field(description="Additional version-specific information")
    upgrade_recommendations: str = Field(description="Recommended upgrade path")

    @classmethod
    def create_fallback(cls) -> VersionIntelligence:
        return cls(
            affected_versions=[],
            patched_versions=[],
            version_details="Version information unavailable",
            upgrade_recommendations="Consult official sources"
        )

class ExploitIntelligence(BaseModel):
    public_exploits: List[str] = Field(description="List of known public exploits with sources")
    poc_available: bool = Field(description="Whether a proof of concept (PoC) is available (true/false)")
    exploit_complexity: Literal["low", "medium", "high"] = Field(description="low|medium|high")
    attack_scenarios: List[str] = Field(description="List of realistic attack scenarios")
    exploitation_requirements: List[str] = Field(description="Prerequisites for successful exploitation")

    @classmethod
    def create_fallback(cls) -> ExploitIntelligence:
        return cls(
            public_exploits=[],
            poc_available=False,
            exploit_complexity="medium",
            attack_scenarios=[],
            exploitation_requirements=[]
        )

class MitigationIntelligence(BaseModel):
    vendor_patches: List[str] = Field(description="Official patches with release info")
    workarounds: List[str] = Field(description="Temporary mitigation strategies")
    configuration_fixes: List[str] = Field(description="Configuration changes to prevent exploitation")
    defensive_measures: List[str] = Field(description="Additional security controls")

    @classmethod
    def create_fallback(cls) -> MitigationIntelligence:
        return cls(
            vendor_patches=[],
            workarounds=[],
            configuration_fixes=[],
            defensive_measures=[]
        )

class SecurityAdvisory(BaseModel):
    source: str = Field(description="Advisory source (e.g., Snyk, GitHub, vendor)")
    url: str = Field(description="Direct URL to advisory")
    date: str = Field(description="Advisory publication date")
    severity: str = Field(description="Severity rating from this source")
    key_points: List[str] = Field(description="Important points from this advisory")

    @classmethod
    def create_fallback(cls, error_message: str) -> SecurityAdvisory:
        return cls(
            source="System Fallback",
            url="N/A",
            date=time.strftime("%Y-%m-%d", time.gmtime()),
            severity="Unknown",
            key_points=[f"Advisory information unavailable due to research failure: {error_message}"]
        )

class RealWorldContext(BaseModel):
    known_incidents: List[str] = Field(description="Documented security incidents using this vulnerability")
    industry_impact: str = Field(description="Impact on specific industries or use cases")
    timeline: str = Field(description="Key dates in vulnerability lifecycle")
    vendor_response: str = Field(description="How vendors/maintainers have responded")

    @classmethod
    def create_fallback(cls) -> RealWorldContext:
        return cls(
            known_incidents=[],
            industry_impact="Unknown due to research failure",
            timeline="Timeline unavailable",
            vendor_response="Vendor response information unavailable"
        )

class ResearchQuality(BaseModel):
    sources_consulted: List[str] = Field(description="List of sources checked")
    information_confidence: Literal["high", "medium", "low"] = Field(description="high|medium|low")
    gaps_identified: List[str] = Field(description="Areas where information is limited")
    last_updated: str = Field(description="When this research was conducted")

    @classmethod
    def create_fallback(cls, error_message: str) -> ResearchQuality:
        return cls(
            sources_consulted=[],
            information_confidence="low",
            gaps_identified=[f"All information unavailable due to research failure: {error_message}"],
            last_updated=time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
        )

class WebResearchResult(BaseModel):
    vulnerability_details: VulnerabilityDetails
    version_intelligence: VersionIntelligence
    exploit_intelligence: ExploitIntelligence
    mitigation_intelligence: MitigationIntelligence
    security_advisories: List[SecurityAdvisory]
    real_world_context: RealWorldContext
    research_quality: ResearchQuality

    @classmethod
    def create_fallback(cls, vuln_name: str, error_message: str) -> WebResearchResult:
        return cls(
            vulnerability_details=VulnerabilityDetails.create_fallback(vuln_name, error_message),
            version_intelligence=VersionIntelligence.create_fallback(),
            exploit_intelligence=ExploitIntelligence.create_fallback(),
            mitigation_intelligence=MitigationIntelligence.create_fallback(),
            security_advisories=[SecurityAdvisory.create_fallback(error_message)],
            real_world_context=RealWorldContext.create_fallback(),
            research_quality=ResearchQuality.create_fallback(error_message)
        )

# ==========================================
# QUALITY ASSESSMENT MODELS
# ==========================================

class QualityAssessmentResult(BaseModel):
    """Evaluation of the vulnerability analysis quality."""
    quality_score: int = Field(
        ge=1, le=5,
        description="Overall quality score from 1 (Poor) to 5 (Excellent)."
    )
    accuracy_assessment: str = Field(description="Detailed assessment of how accurately the analysis identifies or rules out the vulnerability.")
    completeness_assessment: str = Field(description="Assessment of whether the analysis addressed all aspects mentioned in the constraints.")
    evidence_quality: str = Field(description="Evaluation of whether the provided evidence snippets are relevant and convincing.")
    reasoning_quality: str = Field(description="Assessment of whether the analysis summary is logical and well-reasoned.")
    consistency_check: str = Field(description="Evaluation of internal consistency (e.g., do the status, probability, and exploitability match?).")
    strengths: List[str] = Field( description="List of specific strengths in the analysis.")
    weaknesses: List[str] = Field(description="List of specific weaknesses, errors, or omissions in the analysis.")
    overall_feedback: str = Field(description="Comprehensive, final feedback on the analysis quality.")

    @classmethod
    def create_fallback(cls, error_message: str) -> QualityAssessmentResult:
        return cls(
            quality_score=3,
            accuracy_assessment=f"Unable to assess due to quality checker failure: {error_message}",
            completeness_assessment=f"Unable to assess due to quality checker failure",
            evidence_quality=f"Unable to assess due to quality checker failure",
            reasoning_quality=f"Unable to assess due to quality checker failure",
            consistency_check=f"Unable to assess due to quality checker failure",
            strengths=["None identified due to system failure"],
            weaknesses=[f"Quality assessment failed"],
            overall_feedback="Quality assessment could not be completed due to technical issues."
        )

class BatchQualityDistribution(BaseModel):
    excellent: int = 0
    good: int = 0
    average: int = 0
    below_average: int = 0
    poor: int = 0

class BatchQualityAssessmentResult(BaseModel):
    average_quality_score: float = Field(description="The mean quality score across the batch.")
    quality_distribution: BatchQualityDistribution
    individual_assessments: List[QualityAssessmentResult] = Field(description="List of all individual quality assessments.")
    total_assessed: int = Field(description="Total number of vulnerability results assessed.")

class MetricsResult(BaseModel):
    """Metrics comparing LLM predictions with ground truth."""
    total_vulnerabilities: int
    
    # Probability metrics
    probability_mae: float
    probability_rmse: float
    
    # Exploitability metrics
    exploitable_accuracy: float
    exploitable_precision: float
    exploitable_recall: float
    exploitable_f1: float
    
    # Status metrics
    status_accuracy: float
    
    # General metrics
    avg_confidence: float
    
    # LLM-based quality assessment metrics
    avg_quality_score: Optional[float] = None
    quality_distribution: Optional[dict] = None
    total_quality_assessed: Optional[int] = None
