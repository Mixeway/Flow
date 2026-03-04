from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union, Optional
from pydantic import Field
import logging
from ..utils.load_setting import load_setting

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # =============================================================================
    # OpenAI API Configuration (REQUIRED)
    # =============================================================================
    OPENAI_API_KEY: Optional[str] = load_setting("openai_api_key", "settings")
    OPENAI_BASE_URL: str = load_setting("openai_base_url")
    OPENAI_MODEL: str = load_setting("openai_model")
    OPENAI_WEB_SEARCH_MODEL: str = load_setting("openai_web_search_model")
    OPENAI_EMBEDDING_MODEL: str = load_setting("openai_embedding_model")
    OPENAI_ORG_ID: Optional[str] = load_setting("openai_org_id")
    
    # =============================================================================
    # NVD API Configuration (Deprecated - Use Pre-fetched Data Instead)
    # =============================================================================
    # NVD_API_KEY is no longer used during analysis
    # NVD data should be pre-fetched and provided in the NVD_Data column of Excel input
    # See README "NVD Data Format" section for details

    # ===============================================================================
    # Cloudflare Access
    # ===============================================================================
    CF_ACCESS_CLIENT_ID: Optional[str] = load_setting("cf_access_client_id")
    CF_ACCESS_CLIENT_SECRET: Optional[str] = load_setting("cf_access_client_secret")

    # =============================================================================
    # OpenAI Timeout & Retry Configuration
    # =============================================================================
    # Timeout configuration
    OPENAI_TIMEOUT_SECONDS: float = load_setting("openai_timeout_seconds")
    OPENAI_MAX_RETRIES: int = load_setting("openai_max_retries")
    
    # Rate limiting configuration
    MAX_CONCURRENT_API_CALLS: int = load_setting("max_concurrent_api_calls")
    API_CALL_DELAY_SECONDS: float = load_setting("api_call_delay_seconds")

    DEFAULT_TOP_K: int = load_setting("default_top_k")

    # File filtering settings
    FILE_FILTER_MODE: str = load_setting("file_filter_mode")  # Options: "python", "all", "custom" - Default to "all" for universal analysis
    CUSTOM_EXTENSIONS: str = load_setting("custom_extensions")  # Used when mode is "custom" - comma-separated extensions like ".py,.js,.ts"

    # Resource optimization settings
    EMBEDDING_BATCH_SIZE: int = load_setting("embedding_batch_size")  # Process embeddings in batches
    MAX_CHUNK_SIZE_MB: float = load_setting("max_chunk_size_mb")  # Max size per chunk in MB
    MAX_TOTAL_CHUNKS: int = load_setting("max_total_chunks")  # Increased limit to process all files (0 = no limit)
    MEMORY_LIMIT_GB: float = load_setting("memory_limit_gb")  # Soft memory limit in GB (increased for full processing)
    MAX_FILE_SIZE_MB: float = load_setting("max_file_size_mb")   # Skip files larger than 2MB (typical code files are <100KB)
    MAX_FILE_LINES: int = load_setting("max_file_lines")      # Skip files with more than 5000 lines (typical files: 200-500 lines)
    WARN_FILE_SIZE_MB: float = load_setting("warn_file_size_mb")  # Warn about files larger than 500KB
    WARN_FILE_LINES: int = load_setting("warn_file_lines")     # Warn about files with more than 2000 lines
    MAX_FILES_FOR_TESTING: int = load_setting("max_files_for_testing") # 0 - no limit

    # Analysis optimization settings
    MAX_CHUNKS_FOR_ANALYSIS: int = load_setting("max_chunks_for_analysis")  # Maximum chunks sent to LLM analysis (increased for better context)
    
    # Input size limits for preprocessing
    MAX_PREPROCESSING_CHARS: int = load_setting("max_preprocessing_chars")  # ~50k tokens max for preprocessing
    MAX_ORGANIZATION_CHARS: int = load_setting("max_organization_chars")    # ~12k tokens max for organization

    # Chunking optimization settings
    ENABLE_CHUNK_SUBDIVISION: bool = load_setting("enable_chunk_subdivision")  # Disable subdivision for speed
    MAX_CHUNKS_PER_FILE: int = load_setting("max_chunks_per_file")  # Increased limit for chunks per file (0 = no limit)
    CHUNKING_PARALLEL_WORKERS: int = load_setting("chunking_parallel_workers")  # Parallel file processing
    REDUCE_CHUNKING_LOGS: bool = load_setting("reduce_chunking_logs")  # Reduce verbose logging

    # File extension mappings
    @property
    def PYTHON_EXTENSIONS(self) -> List[str]:
        return [".py", ".pyx", ".pyi"]

    @property
    def ALL_CODE_EXTENSIONS(self) -> List[str]:
        return [
            # Python
            ".py",
            ".pyx",
            ".pyi",
            # JavaScript/TypeScript
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".mjs",
            # Java
            ".java",
            ".kt",
            ".scala",
            # C/C++
            ".c",
            ".cpp",
            ".cc",
            ".cxx",
            ".h",
            ".hpp",
            ".hxx",
            # C#
            ".cs",
            # Go
            ".go",
            # Rust
            ".rs",
            # Ruby
            ".rb",
            # PHP
            ".php",
            # Swift
            ".swift",
            # Dart
            ".dart",
            # Shell
            ".sh",
            ".bash",
            ".zsh",
            # Other
            ".lua",
            ".r",
            ".R",
            ".sql",
        ]

    @property
    def DEPENDENCY_FILES_BY_LANGUAGE(self) -> dict:
        """Universal dependency file patterns by language/ecosystem."""
        return {
            # Python
            "python": ["requirements.txt", "pyproject.toml", "poetry.lock", "setup.py", "setup.cfg", "Pipfile", "Pipfile.lock"],
            # JavaScript/TypeScript/Node.js
            "javascript": ["package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml", ".nvmrc"],
            # Java/Maven/Gradle  
            "java": ["pom.xml", "build.gradle", "build.gradle.kts", "gradle.properties", "settings.gradle"],
            # Go
            "go": ["go.mod", "go.sum", "Gopkg.toml", "Gopkg.lock"],
            # Rust
            "rust": ["Cargo.toml", "Cargo.lock"],
            # Ruby
            "ruby": ["Gemfile", "Gemfile.lock", "*.gemspec"],
            # PHP
            "php": ["composer.json", "composer.lock"],
            # C#/.NET
            "csharp": ["*.csproj", "*.sln", "packages.config", "*.nuspec"],
            # C/C++
            "cpp": ["CMakeLists.txt", "Makefile", "conanfile.txt", "conanfile.py", "vcpkg.json"],
            # Dart/Flutter
            "dart": ["pubspec.yaml", "pubspec.lock"],
            # Swift
            "swift": ["Package.swift", "Podfile", "Podfile.lock"],
            # R
            "r": ["DESCRIPTION", "renv.lock"],
            # Docker/Infrastructure
            "infrastructure": ["Dockerfile", "docker-compose.yml", "docker-compose.yaml", ".dockerignore"],
            # General
            "general": ["VERSION", "version.txt", ".tool-versions", "runtime.txt"]
        }
    
    @property 
    def ALL_DEPENDENCY_FILES(self) -> List[str]:
        """Get all dependency files across all languages."""
        all_files = []
        for files_list in self.DEPENDENCY_FILES_BY_LANGUAGE.values():
            all_files.extend(files_list)
        return list(set(all_files))  # Remove duplicates

    def get_allowed_extensions(self) -> List[str]:
        """Get the list of allowed file extensions based on current mode."""
        if self.FILE_FILTER_MODE == "python":
            return self.PYTHON_EXTENSIONS
        elif self.FILE_FILTER_MODE == "all":
            return self.ALL_CODE_EXTENSIONS
        elif self.FILE_FILTER_MODE == "custom":
            # Parse comma-separated extensions string into list
            if self.CUSTOM_EXTENSIONS:
                return [ext.strip() for ext in self.CUSTOM_EXTENSIONS.split(",") if ext.strip()]
            else:
                return self.ALL_CODE_EXTENSIONS  # Fallback to all extensions
        else:
            return self.ALL_CODE_EXTENSIONS  # Default to universal for better coverage


settings = Settings()


def log_openai_configuration():
    """Log the OpenAI configuration being used. Call this after logging is initialized."""
    logger.info("=" * 80)
    logger.info("OPENAI CONFIGURATION:")
    logger.info(f"  Main Analysis Model:    {settings.OPENAI_MODEL}")
    logger.info(f"  Web Search Model:       {settings.OPENAI_WEB_SEARCH_MODEL}")
    logger.info(f"  Embedding Model:        {settings.OPENAI_EMBEDDING_MODEL}")
    logger.info(f"  API Base URL:           {settings.OPENAI_BASE_URL}")
    logger.info(f"  Timeout (seconds):      {settings.OPENAI_TIMEOUT_SECONDS}")
    logger.info(f"  Max Retries:            {settings.OPENAI_MAX_RETRIES}")
    logger.info("=" * 80)
