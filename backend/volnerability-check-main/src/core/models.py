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
    index: int = Field(...,
        description="The original index of the chunk."
    )
    priority: int = Field(...,
        ge=1, le=10,
        description="Priority ranking from 1 (lowest) to 10 (highest relevance)."
    )
    relevance: Literal["high", "medium", "low"] = Field(...,
        description="Categorical relevance of the chunk."
    )
    focus_areas: List[str] = Field(...,
        description="Specific functions, variables, or logic paths to examine."
    )
    notes: str = Field(...,
        description="Explanation of why this chunk is important for the vulnerability."
    )

class ChunkOrganizerResult(BaseModel):
    """Output schema for the Chunk Organizer LLM."""
    organized_chunks: List[OrganizedChunk] = Field(...,
        description="List of chunks ranked by likelihood of containing the vulnerability."
    )
    strategy: str = Field(...,
        description="Overall step-by-step analysis approach for the Code Agent."
    )
    key_patterns: List[str] = Field(...,
        description="Specific vulnerable code patterns or API misuses to watch for."
    )
    security_context: str = Field(...,
        description="Overall assessment of the codebase's security context based on the summaries."
    )

# ==========================================
# QUERY EXPANSION MODELS
# ==========================================

class ExpandedQuery(BaseModel):
    """Output schema for the Query Expansion LLM."""
    expanded_query: str = Field(...,
        description="The highly optimized, raw search query combining the vulnerability name and constraints. Do not include conversational text."
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
# METRIC RESULTS MODELS
# ==========================================

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
