import json
from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, field_validator



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


class AnalysisStatus(str, Enum):
    CONFIRMED = "confirmed"
    NOT_CONFIRMED = "not_confirmed"
    UNCERTAIN = "uncertain"


class EvidenceSnippet(BaseModel):
    """Code snippet that provides evidence for vulnerability."""
    file: str
    start_line: int
    end_line: int
    snippet: str


class VulnerabilityResult(BaseModel):
    """Result of vulnerability analysis."""
    vulnerability_id: str
    vulnerability_name: str
    status: AnalysisStatus
    confidence: int = Field(..., ge=1, le=5)
    analysis_summary: str
    detailed_reasoning: str  # Comprehensive justification of the analysis and assessment
    evidence_snippets: List[EvidenceSnippet]
    files_analyzed: List[str]
    mitigations_detected: List[str]
    suggested_next_steps: str
    timestamp_utc: datetime = Field(default_factory=datetime.utcnow)

    # LLM predictions
    predicted_probability: Optional[float] = None  # LLM's predicted probability (0.0-1.0)
    predicted_exploitable: Optional[bool] = None   # LLM's predicted exploitability

    # Ground truth for evaluation
    ground_truth_probability: Optional[float] = None  # From the dataset
    ground_truth_exploitable: Optional[bool] = None   # From the dataset


    @field_validator('suggested_next_steps', mode='before')
    @classmethod
    def dump_to_string(cls, v: Any) -> str:
        if isinstance(v, (list, dict)):
            return json.dumps(v)
        return str(v)

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

class ChunkOrganizerResult(BaseModel):
    """Output schema for the Chunk Organizer LLM."""
    organized_chunks: List[OrganizedChunk] = Field(description="List of chunks ranked by likelihood of containing the vulnerability.")
    strategy: str = Field(description="Overall step-by-step analysis approach for the Code Agent.")
    key_patterns: List[str] = Field(...,
        description="Specific vulnerable code patterns or API misuses to watch for."
    )
    security_context: str = Field(description="Overall assessment of the codebase's security context based on the summaries.")

# ==========================================
# QUERY EXPANSION MODELS
# ==========================================

class ExpandedQuery(BaseModel):
    """Output schema for the Query Expansion LLM."""
    expanded_query: str = Field(description="The highly optimized, raw search query combining the vulnerability name and constraints. Do not include conversational text.")

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

class VersionInformation(BaseModel):
    library: str = Field(description="The name of the library or dependency being analyzed")
    version: str = Field(description="The exact version string found in the dependency file (e.g., '1.2.9', '^2.0.0')")
    file: str = Field(description="The file path of the dependency file (e.g., 'pom.xml', 'requirements.txt')")
    lines: str = Field(description="The line numbers where the version is declared")
    code: str = Field( description="The verbatim code snippet showing the version declaration")

class DependencyAnalysis(BaseModel):
    files_found: List[str] = Field(description="List of dependency/manifest files discovered during the analysis")
    version_information: List[VersionInformation] = Field( description="Detailed version information extracted for the target libraries")
    version_status: Literal["vulnerable", "safe", "unknown"] = Field(description="Assessment of whether the discovered versions fall into the known vulnerable range")
    confidence: Literal["high", "medium", "low"] = Field(description="Confidence level in the dependency and version analysis")
    missing_dependencies: List[str] = Field(description="List specific libraries required by constraints but NOT found in dependency files (critical for co-requisites)")

class SecurityConfiguration(BaseModel):
    type: str = Field(description="The type or category of the configuration (e.g., 'XML Parser', 'HTTP/2 Server')")
    file: str = Field(description="The file path where the configuration is defined")
    setting: str = Field(description="The specific configuration key or setting name found")
    value: str = Field(description="The value assigned to the configuration setting")
    security_relevance: str = Field(description="Detailed explanation of how this specific configuration relates to the vulnerability (e.g., enables the attack vector, disables a security check)")

class MitigationFound(BaseModel):
    type: str = Field(description="The category of mitigation (e.g., 'Input Validation', 'Authentication', 'Safe Parser')")
    location: str = Field(description="File path and line numbers where the mitigation is implemented")
    description: str = Field(description="Explanation of what this mitigation does and how it protects the code")
    effectiveness: str = Field(description="Estimated effectiveness of this mitigation against this specific vulnerability (e.g., 'Prevents SSRF', 'Easily bypassed')")

class PatternExample(BaseModel):
    file: str = Field(description="File path containing the code pattern")
    lines: str = Field(description="Line numbers for the pattern example")
    code: str = Field(description="Verbatim code snippet demonstrating the pattern")

class CodePattern(BaseModel):
    pattern: str = Field(description="Description of the architectural or coding pattern observed")
    matches: int = Field(description="Total number of times this pattern was found in the codebase")
    examples: List[PatternExample] = Field(description="Specific examples of where this pattern was found")

class NegativeEvidence(BaseModel):
    searched_for: str = Field(description="The specific API, pattern, or constraint that was searched for but NOT found")
    matches: int = Field(description="The number of matches found (should be 0 for negative evidence)")
    confidence: Literal["high", "medium", "low"] = Field(description="Confidence level in this negative result (e.g., high if a thorough regex/keyword search was performed)")

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

# ==========================================
# WEB RESEARCH MODELS
# ==========================================

class VulnerabilityDetails(BaseModel):
    title: str = Field(description="Official vulnerability title")
    description: str = Field(description="Detailed technical description")
    impact: str = Field(description="Potential impact and severity")
    attack_vector: str = Field(description="How the vulnerability can be exploited")
    root_cause: str = Field(description="Technical root cause analysis")

class VersionIntelligence(BaseModel):
    affected_versions: List[str] = Field(description="List of affected version ranges")
    patched_versions: List[str] = Field(description="List of versions with fixes")
    version_details: str = Field(description="Additional version-specific information")
    upgrade_recommendations: str = Field(description="Recommended upgrade path")

class ExploitIntelligence(BaseModel):
    public_exploits: List[str] = Field(description="List of known public exploits with sources")
    poc_available: bool = Field(description="Whether a proof of concept (PoC) is available (true/false)")
    exploit_complexity: Literal["low", "medium", "high"] = Field(description="low|medium|high")
    attack_scenarios: List[str] = Field(description="List of realistic attack scenarios")
    exploitation_requirements: List[str] = Field(description="Prerequisites for successful exploitation")

class MitigationIntelligence(BaseModel):
    vendor_patches: List[str] = Field(description="Official patches with release info")
    workarounds: List[str] = Field(description="Temporary mitigation strategies")
    configuration_fixes: List[str] = Field(description="Configuration changes to prevent exploitation")
    defensive_measures: List[str] = Field(description="Additional security controls")

class SecurityAdvisory(BaseModel):
    source: str = Field(description="Advisory source (e.g., Snyk, GitHub, vendor)")
    url: str = Field(description="Direct URL to advisory")
    date: str = Field(description="Advisory publication date")
    severity: str = Field(description="Severity rating from this source")
    key_points: List[str] = Field(description="Important points from this advisory")

class RealWorldContext(BaseModel):
    known_incidents: List[str] = Field(description="Documented security incidents using this vulnerability")
    industry_impact: str = Field(description="Impact on specific industries or use cases")
    timeline: str = Field(description="Key dates in vulnerability lifecycle")
    vendor_response: str = Field(description="How vendors/maintainers have responded")

class ResearchQuality(BaseModel):
    sources_consulted: List[str] = Field(description="List of sources checked")
    information_confidence: Literal["high", "medium", "low"] = Field(description="high|medium|low")
    gaps_identified: List[str] = Field(description="Areas where information is limited")
    last_updated: str = Field(description="When this research was conducted")

class WebResearchResult(BaseModel):
    vulnerability_details: VulnerabilityDetails
    version_intelligence: VersionIntelligence
    exploit_intelligence: ExploitIntelligence
    mitigation_intelligence: MitigationIntelligence
    security_advisories: List[SecurityAdvisory]
    real_world_context: RealWorldContext
    research_quality: ResearchQuality

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

class BatchQualityDistribution(BaseModel):
    excellent: int = 0
    good: int = 0
    average: int = 0
    below_average: int = 0
    poor: int = 0

class BatchQualityAssessmentResult(BaseModel):
    average_quality_score: float = Field(description="The mean quality score across the batch.")
    quality_distribution: BatchQualityDistribution
    individual_assessments: List[Dict[str, Any]] = Field(description="List of all individual quality assessments.")
    total_assessed: int = Field(description="Total number of vulnerability results assessed.")

class MetricsResult(BaseModel):
    """Metrics comparing LLM predictions with ground truth."""
    total_vulnerabilities: int
    
    # Probability metrics
    probability_mae: float  # Mean Absolute Error for probability
    probability_rmse: float  # Root Mean Square Error for probability
    
    # Exploitability metrics
    exploitable_accuracy: float
    exploitable_precision: float
    exploitable_recall: float
    exploitable_f1: float
    
    # Status metrics
    status_accuracy: float  # Accuracy for vulnerability status
    
    # General metrics
    avg_confidence: float
    
    # LLM-based quality assessment metrics
    avg_quality_score: Optional[float] = None  # Average LLM quality score (1-5)
    quality_distribution: Optional[dict] = None  # Distribution of quality scores
    total_quality_assessed: Optional[int] = None  # Number of results assessed for quality
