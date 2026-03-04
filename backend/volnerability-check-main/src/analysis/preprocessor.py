import json
import logging
from typing import List, Dict, Any
from pathlib import Path
import time

from tenacity import retry, stop_after_attempt, wait_random_exponential, RetryError
from openai import BadRequestError, APITimeoutError

from ..core.client import client
from ..core.config import settings
from ..core.models import VulnerabilityInput
from ..core.chunk import CodeChunk
from .prompts import (
    CODE_PREPROCESSOR_SYSTEM_PROMPT, 
    CODE_PREPROCESSOR_USER_PROMPT,
    CODE_TRIAGE_SYSTEM_PROMPT,
    CODE_TRIAGE_USER_PROMPT,
    SYNTHESIS_ANALYSIS_SYSTEM_PROMPT,
    SYNTHESIS_ANALYSIS_USER_PROMPT,
    CHUNK_ORGANIZER_SYSTEM_PROMPT,
    CHUNK_ORGANIZER_USER_PROMPT
)
from .dependency_resolver import analyze_dependency_versions


logger = logging.getLogger(__name__)


@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(3))
def preprocess_code_chunks(
    vulnerability: VulnerabilityInput,
    raw_chunks: List[CodeChunk],
    repository_info: Dict[str, Any] = None
) -> str:
    """
    Preprocess raw code chunks to remove duplications and add security annotations.
    Returns structured, clean code ready for vulnerability analysis.
    """
    logger.info("PREPROCESSING CODE CHUNKS")
    logger.info("=" * 40)
    logger.info(f"Processing {len(raw_chunks)} raw chunks for vulnerability: {vulnerability.name}")
    
    # Simple dependency file discovery
    temp_repo_dir = None
    dependency_files = []
    
    # Strategy 1: Use temp_repo_dir from repository_info if available
    if repository_info and 'temp_repo_dir' in repository_info:
        temp_repo_dir = Path(repository_info['temp_repo_dir'])
        logger.info(f"Using temp_repo_dir from repository_info: {temp_repo_dir}")
    
    # Strategy 2: Fallback to deriving from chunk paths
    if not temp_repo_dir and raw_chunks:
        chunk_path = Path(raw_chunks[0].file_path)
        logger.info(f"Deriving repository path from chunk: {chunk_path}")
        
        # Try to find repository root
        current_path = chunk_path.parent
        for i in range(5):  # Check up to 5 levels up
            if (current_path / '.git').exists() or any((current_path / f).exists() for f in ['README.md', 'requirements.txt', 'package.json']):
                temp_repo_dir = current_path
                logger.info(f"Found repository root: {temp_repo_dir}")
                break
            if current_path.parent == current_path:  # Reached filesystem root
                break
            current_path = current_path.parent
        
        if not temp_repo_dir:
            temp_repo_dir = chunk_path.parent  # Last resort
    
    # Simple dependency file reading with version extraction
    version_analysis = []
    if temp_repo_dir:
        logger.info(f"Searching for dependency files in: {temp_repo_dir}")
        
        # Look for UNIVERSAL dependency files across all ecosystems  
        dependency_file_patterns = [
            # Python ecosystem
            'requirements.txt', 'requirements-dev.txt', 'requirements-test.txt', 
            'pyproject.toml', 'setup.py', 'setup.cfg', 'Pipfile', 'Pipfile.lock',
            'environment.yml', 'environment.yaml', 'conda.yml', 'conda.yaml',
            
            # JavaScript/Node.js ecosystem  
            'package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
            'bower.json', '.npmrc', 'lerna.json',
            
            # Java ecosystem
            'pom.xml', 'build.gradle', 'gradle.properties', 'settings.gradle',
            'build.xml', 'ivy.xml', 'project.clj',
            
            # .NET ecosystem
            'packages.config', '*.csproj', '*.fsproj', '*.vbproj', 'paket.dependencies',
            'project.json', 'Directory.Build.props',
            
            # Rust ecosystem
            'Cargo.toml', 'Cargo.lock',
            
            # Go ecosystem  
            'go.mod', 'go.sum', 'glide.yaml', 'dep.toml',
            
            # PHP ecosystem
            'composer.json', 'composer.lock',
            
            # Ruby ecosystem
            'Gemfile', 'Gemfile.lock', 'gemspec',
            
            # C/C++ ecosystem
            'CMakeLists.txt', 'conanfile.txt', 'conanfile.py', 'vcpkg.json',
            
            # Other ecosystems
            'mix.exs', 'mix.lock',  # Elixir
            'pubspec.yaml',  # Dart
            'dune-project',  # OCaml
            'stack.yaml',  # Haskell
            'Package.swift',  # Swift
            'Project.toml', 'Manifest.toml',  # Julia
        ]
        
        # Process dependency files (including wildcards) with enhanced detection
        found_files = []
        logger.info(f"Searching for dependency files in: {temp_repo_dir}")
        logger.info(f"Directory exists: {temp_repo_dir.exists()}")
        
        if temp_repo_dir.exists():
            # List all files in temp_repo_dir for debugging
            all_files = list(temp_repo_dir.rglob('*'))
            logger.info(f"Total files in temp_repo_dir: {len(all_files)}")
            dependency_like_files = [f for f in all_files if f.is_file() and any(
                pattern in f.name.lower() for pattern in ['requirement', 'setup', 'pyproject', 'package', 'pom', 'build', 'cargo', 'go.mod', 'toml', 'json', 'txt', 'yml', 'yaml']
            )]
            logger.info(f"Dependency-like files found: {[f.name for f in dependency_like_files[:20]]}")
        
        for dep_pattern in dependency_file_patterns:
            if '*' in dep_pattern:
                # Handle wildcards with rglob
                matching_files = list(temp_repo_dir.rglob(dep_pattern))[:10]  # Limit for performance
                found_files.extend(matching_files)
                logger.info(f"Pattern '{dep_pattern}' found {len(matching_files)} files")
            else:
                # Handle exact file names - search recursively first
                exact_matches = list(temp_repo_dir.rglob(dep_pattern))
                found_files.extend(exact_matches)
                
                # Also check root directory directly
                dep_path = temp_repo_dir / dep_pattern
                if dep_path.exists() and dep_path not in found_files:
                    found_files.append(dep_path)
                
                if exact_matches:
                    logger.info(f"Pattern '{dep_pattern}' found {len(exact_matches)} files: {[f.name for f in exact_matches[:3]]}")
        
        # Remove duplicates
        found_files = list(set(found_files))
        logger.info(f"Total unique dependency files found: {len(found_files)} - {[f.name for f in found_files[:10]]}")
        
        # Process found dependency files
        for dep_path in found_files[:15]:  # Limit total files processed
            try:
                with open(dep_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()[:2500]  # Increased limit for better version detection
                dependency_files.append(f"\n=== {dep_path.name} ===\n{content}\n")
                logger.info(f"Successfully processed dependency file: {dep_path} ({len(content)} chars)")
                
                # Universal version extraction for ALL libraries
                version_info = _extract_version_info(content, vulnerability.name)
                if version_info:
                    version_analysis.append(f"From {dep_path.name}: {version_info}")
                    logger.info(f"Extracted versions from {dep_path.name}: {version_info[:200]}...")
                else:
                    logger.info(f"No version info extracted from {dep_path.name}")
                    
            except Exception as e:
                logger.warning(f"Could not read {dep_path}: {e}")
    
    # Add version analysis summary
    if version_analysis:
        dependency_files.append(f"\n=== VERSION ANALYSIS ===\n" + "\n".join(version_analysis) + "\n")
        logger.info(f"Version analysis: {len(version_analysis)} entries")

        # NEW: Add Dependency Risk Assessment
        try:
            risk_assessment = analyze_dependency_versions(version_analysis, vulnerability)
            if risk_assessment:
                dependency_files.append(risk_assessment)
                logger.info(f"Generated dependency risk assessment: {risk_assessment}")
        except Exception as e:
            logger.error(f"Failed to generate dependency risk assessment: {e}")

    # Add repository-wide search results
    if temp_repo_dir and temp_repo_dir.exists():
        try:
            search_results = _simple_repository_search(temp_repo_dir, vulnerability)
            if search_results:
                dependency_files.append(search_results)
                logger.info("Repository-wide search completed")
        except Exception as e:
            logger.warning(f"Repository search failed: {e}")
    
    logger.info(f"Found {len(dependency_files)} dependency files")
    
    # Format raw chunks for preprocessing
    formatted_chunks = []
    
    # Add dependency information first
    if dependency_files:
        formatted_chunks.append("=== DEPENDENCY FILES ===")
        formatted_chunks.extend(dependency_files)
        formatted_chunks.append("\n=== SOURCE CODE CHUNKS ===\n")
    
    for i, chunk in enumerate(raw_chunks):
        try:
            # Read chunk content if not available
            if not hasattr(chunk, "content") or not chunk.content:
                with open(chunk.file_path, "r", encoding="utf-8", errors="ignore") as f:
                    lines = f.readlines()
                    start_idx = max(0, chunk.start_line - 1)
                    end_idx = min(len(lines), chunk.end_line)
                    chunk_content = "".join(lines[start_idx:end_idx])
            else:
                chunk_content = chunk.content
            
            # Determine source type (User Code vs Library Code)
            is_library = any(part in str(chunk.file_path).split('/') for part in [
                'node_modules', 'site-packages', 'dist-packages', 'vendor', 'bower_components', 'target/classes'
            ])
            source_type_tag = "[LIBRARY_INTERNAL]" if is_library else "[USER_CODE]"
            
            chunk_header = f"CHUNK {i}: {chunk.file_path.name} (lines {chunk.start_line}-{chunk.end_line}) {source_type_tag}"
            if chunk.symbol_name:
                chunk_header += f" - {chunk.symbol_name}"
            
            formatted_chunk = f"{chunk_header}\n{chunk_content}\n"
            formatted_chunks.append(formatted_chunk)
            
        except Exception as e:
            logger.warning(f"Failed to read chunk {i}: {e}")
            continue
    
    if not formatted_chunks:
        logger.error("No chunks could be processed")
        return ""
    
    raw_chunks_text = "\n---\n".join(formatted_chunks)
    
    # SIMPLE PREPROCESSING WITHOUT LLM TO AVOID HALLUCINATIONS
    # Instead of using LLM for preprocessing (which can hallucinate files),
    # we do simple, deterministic formatting
    
    logger.info(f"Using simple deterministic preprocessing (no LLM, no hallucinations)")
    logger.info(f"Processing {len(formatted_chunks)} chunks ({len(raw_chunks_text)} chars)")
    
    # Build structured output manually
    structured_output = []
    
    # Add header
    structured_output.append(f"=== CODE ANALYSIS FOR {vulnerability.name} ===")
    structured_output.append(f"Vulnerability Constraints: {vulnerability.constraints}\n")
    
    # Add dependency section if present
    if dependency_files:
        structured_output.append("=== DEPENDENCY ANALYSIS ===")
        for dep_file in dependency_files:
            structured_output.append(dep_file)
        structured_output.append("\n=== SOURCE CODE CHUNKS ===\n")
    
    # Add code chunks with clear separation
    for chunk_text in formatted_chunks:
        if chunk_text.strip() and not chunk_text.startswith("==="):  # Skip dependency sections
            structured_output.append(chunk_text)
            structured_output.append("---")
    
    structured_code = "\n".join(structured_output)
    
    logger.info(f"Preprocessing completed: {len(structured_code)} chars")
    
    return structured_code


@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(3))
def check_and_organize_chunks(
    vulnerability: VulnerabilityInput, 
    chunks: List[CodeChunk],
    repository_info: Dict[str, Any] = None
) -> Dict[str, Any]:
    """Organize and prioritize code chunks for analysis (simplified version)."""
    logger.info("ORGANIZING CODE CHUNKS")
    logger.info("=" * 30)
    
    repository_info = repository_info or {}
    
    # Create chunks summary for analysis
    chunks_summary = []
    for i, chunk in enumerate(chunks):
        summary = f"Chunk {i}: {chunk.file_path.name} ({chunk.chunk_type.value})"
        if chunk.symbol_name:
            summary += f" - {chunk.symbol_name}"
        summary += f" (lines {chunk.start_line}-{chunk.end_line})"
        chunks_summary.append(summary)
    
    chunks_text = "\n".join(chunks_summary)
    
    prompt = CHUNK_ORGANIZER_USER_PROMPT.format(
        vuln_name=vulnerability.name,
        vuln_constraints=vulnerability.constraints,
        chunks_summary=chunks_text
    )
    
    # Check input size before sending
    if len(prompt) > settings.MAX_ORGANIZATION_CHARS:
        logger.warning(f"Organization prompt too large ({len(prompt)} chars > {settings.MAX_ORGANIZATION_CHARS}), truncating...")
        prompt = prompt[:settings.MAX_ORGANIZATION_CHARS] + "\n[TRUNCATED DUE TO SIZE LIMIT]"
    
    try:
        completion = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": CHUNK_ORGANIZER_SYSTEM_PROMPT},
                {"role": "user", "content": f"{prompt}\n\nCRITICAL: Return valid JSON only in the specified format."}
            ],
            temperature=0,
            seed=42,
            timeout=settings.OPENAI_TIMEOUT_SECONDS,
        )
        
        result = json.loads(completion.choices[0].message.content)
        logger.info("Chunk organization completed successfully")
        
        return result
        
    except Exception as e:
        logger.error(f"Chunk organization failed: {e}")
        
        # Enhanced error handling for specific error types
        if isinstance(e, APITimeoutError):
            logger.error("API TIMEOUT ERROR in chunk organization - Request took too long")
            logger.error("This may be due to large input size or API server load")
            
        elif isinstance(e, RetryError):
            logger.error("RetryError detected in chunk organization - all retry attempts exhausted")
            if hasattr(e, 'last_attempt') and e.last_attempt and e.last_attempt.exception():
                underlying_error = e.last_attempt.exception()
                logger.error(f"Underlying organization error: {type(underlying_error).__name__}: {str(underlying_error)}")
                
                # Check for specific error types
                if isinstance(underlying_error, APITimeoutError):
                    logger.error("TIMEOUT ERROR in organization retry - Consider reducing input size")
                elif isinstance(underlying_error, BadRequestError):
                    underlying_msg = str(underlying_error)
                    if "tokens exceed" in underlying_msg or "context_length_exceeded" in underlying_msg:
                        logger.error("TOKEN LIMIT EXCEEDED in chunk organization")
        
        logger.warning("Using fallback chunk organization")
        
        # Return fallback organization
        return {
            "organized_chunks": [
                {
                    "index": i,
                    "priority": 5,
                    "relevance": "medium",
                    "focus_areas": ["general analysis"],
                    "notes": "fallback organization"
                }
                for i in range(len(chunks))
            ],
            "strategy": "fallback_due_to_error",
            "key_patterns": [],
            "security_context": "analysis_failed"
        }


def reorder_chunks_by_priority(chunks: List[CodeChunk], organization_result: Dict[str, Any]) -> List[CodeChunk]:
    """Reorder chunks based on priority from organization result."""
    try:
        organized = organization_result.get("organized_chunks", [])
        
        # Create priority mapping
        priority_map = {}
        for org_chunk in organized:
            idx = org_chunk.get("index", 0)
            priority = org_chunk.get("priority", 5)
            if 0 <= idx < len(chunks):
                priority_map[idx] = priority
        
        # Sort chunks by priority (higher priority first)
        indexed_chunks = [(i, chunk) for i, chunk in enumerate(chunks)]
        indexed_chunks.sort(key=lambda x: priority_map.get(x[0], 5), reverse=True)
        
        reordered_chunks = [chunk for _, chunk in indexed_chunks]
        
        logger.info(f"Reordered {len(chunks)} chunks by priority")
        return reordered_chunks
        
    except Exception as e:
        logger.warning(f"Failed to reorder chunks by priority: {e}")
        return chunks


# Aliases for backward compatibility during refactoring
VULNERABILITY_ANALYSIS_SYSTEM_PROMPT = SYNTHESIS_ANALYSIS_SYSTEM_PROMPT
VULNERABILITY_ANALYSIS_USER_PROMPT = SYNTHESIS_ANALYSIS_USER_PROMPT


def _extract_version_info(content: str, vulnerability_name: str) -> str:
    """Extract ALL version information from dependency file content - ENHANCED UNIVERSAL approach."""
    import re
    
    logger.info(f"Extracting ALL library versions from dependency content (length: {len(content)} chars)")
    
    version_info = []
    
    # ENHANCED PATTERNS - more aggressive version detection
    
    # Pattern 1: Python requirements.txt style: "library>=1.2.3", "library==1.2.3", etc.
    python_pattern = r'([a-zA-Z0-9_-]+[a-zA-Z0-9_.-]*)\s*([><=~!]+)\s*([0-9]+(?:\.[0-9]+)*(?:[a-zA-Z0-9._+-]*)?)'
    python_matches = re.findall(python_pattern, content, re.MULTILINE)
    for lib, operator, version in python_matches:
        if len(lib) > 1 and not lib.isdigit():  # Filter out noise
            version_info.append(f"{lib}{operator}{version}")
    
    # Pattern 2: JSON package.json style: "library": "^1.2.3", "library": "~1.2.3"
    json_pattern = r'["\']([a-zA-Z0-9_@/-]+)["\']:\s*["\']([^"\']*?[0-9]+(?:\.[0-9]+)*[^"\']*)["\']'
    json_matches = re.findall(json_pattern, content, re.MULTILINE)
    for lib, version in json_matches:
        if len(lib) > 1 and not lib.isdigit():  # Filter out noise
            version_info.append(f"{lib}:{version}")
    
    # Pattern 3: XML Maven/Gradle style: <version>1.2.3</version>, version "1.2.3"
    xml_context = r'([a-zA-Z0-9._-]+).*?(?:<version>|version\s*["\']?)([0-9]+(?:\.[0-9]+)+)(?:</version>|["\']?)'
    xml_matches = re.findall(xml_context, content, re.DOTALL | re.IGNORECASE)
    for lib, version in xml_matches:
        if len(lib) > 1 and not lib.isdigit():
            version_info.append(f"{lib}:{version}")
    
    # Pattern 4: Cargo.toml style: library = "1.2.3"
    cargo_pattern = r'([a-zA-Z0-9_-]+)\s*=\s*["\']([0-9]+(?:\.[0-9]+)*[^"\']*)["\']'
    cargo_matches = re.findall(cargo_pattern, content, re.MULTILINE)
    for lib, version in cargo_matches:
        if len(lib) > 1 and not lib.isdigit():
            version_info.append(f"{lib}:{version}")
    
    # Pattern 5: Go mod style: library v1.2.3
    go_pattern = r'([a-zA-Z0-9._/-]+)\s+v([0-9]+(?:\.[0-9]+)*(?:[a-zA-Z0-9.-]*)?)'
    go_matches = re.findall(go_pattern, content, re.MULTILINE)
    for lib, version in go_matches:
        if len(lib) > 2:
            version_info.append(f"{lib}:v{version}")
    
    # Pattern 6: TOML dependencies section: name = "version" 
    toml_pattern = r'(\w+)\s*=\s*["\']([0-9]+(?:\.[0-9]+)*[^"\']*)["\']'
    toml_matches = re.findall(toml_pattern, content, re.MULTILINE)
    for lib, version in toml_matches:
        if len(lib) > 2 and not lib.isdigit():
            version_info.append(f"{lib}={version}")
    
    # Pattern 7: Environment.yml/conda style: - library=1.2.3, - library==1.2.3
    conda_pattern = r'-\s+([a-zA-Z0-9_-]+)([>=<~!]*=)([0-9]+(?:\.[0-9]+)*[a-zA-Z0-9._+-]*)?'
    conda_matches = re.findall(conda_pattern, content, re.MULTILINE)
    for lib, operator, version in conda_matches:
        if len(lib) > 1 and not lib.isdigit() and version:
            version_info.append(f"{lib}{operator}{version}")
    
    # Pattern 8: Setup.py install_requires style: 'library>=1.2.3'
    setup_pattern = r'["\']([a-zA-Z0-9_-]+[a-zA-Z0-9_.-]*)\s*([><=~!]+)\s*([0-9]+(?:\.[0-9]+)*(?:[a-zA-Z0-9._+-]*)?)["\']'
    setup_matches = re.findall(setup_pattern, content, re.MULTILINE)
    for lib, operator, version in setup_matches:
        if len(lib) > 1 and not lib.isdigit():
            version_info.append(f"{lib}{operator}{version}")
    
    # Pattern 9: PyTorch/Torch specific patterns (enhanced for CVE analysis)
    torch_patterns = [
        r'torch[a-z]*\s*([><=~!]+)\s*([0-9]+(?:\.[0-9]+)*(?:[a-zA-Z0-9._+-]*)?)',
        r'pytorch[a-z]*\s*([><=~!]+)\s*([0-9]+(?:\.[0-9]+)*(?:[a-zA-Z0-9._+-]*)?)',
        r'["\']torch[a-z]*["\']:\s*["\']([^"\']*?[0-9]+(?:\.[0-9]+)*[^"\']*)["\']',
    ]
    for pattern in torch_patterns:
        torch_matches = re.findall(pattern, content, re.MULTILINE | re.IGNORECASE)
        for match in torch_matches:
            if len(match) == 2:  # (operator, version)
                operator, version = match
                version_info.append(f"torch{operator}{version}")
            elif len(match) == 1:  # (version,)
                version_info.append(f"torch:{match[0]}")
    
    # Remove duplicates and prioritize CVE-relevant packages
    unique_versions = list(set(version_info))
    
    # Prioritize packages relevant to common CVEs
    priority_packages = ['torch', 'pytorch', 'tensorflow', 'spring', 'logback', 'jetty', 'xmlunit', 'bouncy', 'tomcat']
    priority_versions = [v for v in unique_versions if any(pkg in v.lower() for pkg in priority_packages)]
    other_versions = [v for v in unique_versions if v not in priority_versions]
    
    # Combine with priority packages first, limit total
    final_versions = (priority_versions + other_versions)[:60]
    
    logger.info(f"Extracted {len(final_versions)} library versions (including {len(priority_versions)} priority packages)")
    
    if final_versions:
        result = "Found library versions: " + "; ".join(sorted(final_versions))
        if priority_versions:
            result += f" | PRIORITY CVE-RELEVANT PACKAGES: {'; '.join(priority_versions)}"
        return result
    else:
        logger.info("No library versions found in dependency file")
        return "No library versions detected in this dependency file."


def _simple_repository_search(temp_repo_dir: Path, vulnerability: "VulnerabilityInput") -> str:
    """UNIVERSAL repository-wide search for constraint patterns - works with any language/framework."""
    import re
    from pathlib import Path
    
    logger.info("Starting UNIVERSAL repository-wide search for constraint patterns")
    
    # UNIVERSAL PATTERN EXTRACTION - works for any vulnerability/language
    search_patterns = set()
    full_text = f"{vulnerability.name} {vulnerability.constraints}"
    
    # Extract ALL potential identifiers (function names, methods, classes, etc.)
    # This works for ANY programming language and framework
    
    # Pattern 1: Function/method calls: word() or word.method()
    function_calls = re.findall(r'\b([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\s*\(', full_text)
    for func in function_calls:
        search_patterns.add(func)
        # Also add variations
        search_patterns.add(f"{func}(")
        if '.' in func:
            # Add individual parts: torch.load -> also search for "load"
            parts = func.split('.')
            search_patterns.update(parts)
    
    # Pattern 2: Class/namespace references: Class.method or namespace::function
    qualified_names = re.findall(r'\b([a-zA-Z_][a-zA-Z0-9_]*(?:[:.])[a-zA-Z_][a-zA-Z0-9_.:]*)', full_text)
    for name in qualified_names:
        search_patterns.add(name)
        # Add variations
        if '.' in name:
            search_patterns.update(name.split('.'))
        elif '::' in name:
            search_patterns.update(name.split('::'))
    
    # Pattern 3: CamelCase identifiers (common in many languages)
    camel_case = re.findall(r'\b([A-Z][a-zA-Z0-9]*(?:[A-Z][a-zA-Z0-9]*)+)', full_text)
    search_patterns.update(camel_case)
    
    # Pattern 4: snake_case identifiers 
    snake_case = re.findall(r'\b([a-z_][a-z0-9_]*_[a-z0-9_]+)', full_text)
    search_patterns.update(snake_case)
    
    # Pattern 5: Technical terms and library names
    technical_words = re.findall(r'\b([a-zA-Z_][a-zA-Z0-9_]{3,})', full_text)
    for word in technical_words:
        # Include common technical terms
        if any(pattern in word.lower() for pattern in [
            'load', 'save', 'parse', 'serialize', 'deserialize', 'execute', 'eval', 
            'script', 'import', 'require', 'include', 'init', 'create', 'new',
            'server', 'client', 'request', 'response', 'http', 'api', 'sql',
            'xml', 'json', 'yaml', 'config', 'auth', 'token', 'session',
            'buffer', 'stream', 'file', 'path', 'url', 'uri'
        ]):
            search_patterns.add(word)
    
    # Convert to sorted list and limit for performance
    search_patterns = sorted(list(search_patterns))[:25]  # Reasonable limit
    search_patterns = [p for p in search_patterns if len(p) >= 3 and not p.isdigit()]  # Filter noise
    
    logger.info(f"Extracted {len(search_patterns)} universal search patterns: {search_patterns[:10]}...")
    
    # UNIVERSAL FILE SEARCH - multiple language extensions
    search_results = []
    
    # Search across multiple programming languages
    file_extensions = [
        '*.py', '*.js', '*.ts', '*.java', '*.cpp', '*.c', '*.h', '*.hpp',
        '*.cs', '*.go', '*.rs', '*.php', '*.rb', '*.scala', '*.kt', '*.swift',
        '*.m', '*.mm', '*.R', '*.sql', '*.sh', '*.ps1', '*.pl', '*.lua',
        '*.dart', '*.elm', '*.clj', '*.ex', '*.fs', '*.hs', '*.ml'
    ]
    
    all_files = []
    for ext in file_extensions:
        files = list(temp_repo_dir.rglob(ext))
        all_files.extend(files)
        if len(all_files) >= 200:  # Performance limit
            break
    
    logger.info(f"Searching in {len(all_files)} source files across multiple languages")
    
    for pattern in search_patterns[:15]:  # Limit patterns for performance
        matches = 0
        files_with_matches = []
        
        for source_file in all_files:
            try:
                with open(source_file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    
                # Case-insensitive search
                if pattern.lower() in content.lower():
                    matches += 1
                    files_with_matches.append(source_file.name)
                    if len(files_with_matches) >= 8:  # Limit file names
                        break
                        
            except Exception:
                continue
        
        if matches > 0:
            files_str = ', '.join(files_with_matches)
            if matches > 8:
                files_str += f" (+{matches-8} more)"
            search_results.append(f"'{pattern}': {matches} matches in {len(files_with_matches)} files: {files_str}")
    
    if search_results:
        logger.info(f"Repository search completed: {len(search_results)} patterns found matches")
        return "\n=== REPOSITORY-WIDE SEARCH RESULTS ===\n" + "\n".join(search_results) + "\n"
    else:
        logger.info("Repository search completed: no matches found")
        return "\n=== REPOSITORY-WIDE SEARCH RESULTS ===\nNo matches found for vulnerability patterns in repository.\n" 