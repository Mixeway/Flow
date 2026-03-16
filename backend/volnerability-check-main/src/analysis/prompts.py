from enum import Enum

class LangfusePrompt(str, Enum):
    CODE_PREPROCESSOR = "code-preprocessor"
    QUERY_GENERATION = "query-generation"
    CHUNK_ORGANIZER = "chunk-organizer"
    CODE_TRIAGE = "code-triage"
    SYNTHESIS_ANALYSIS = "synthesis-analysis"
    QUALITY_CHECKER = "quality-checker"
