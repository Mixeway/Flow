from pathlib import Path
from typing import List
import logging
import time

from tenacity import retry, wait_random_exponential, stop_after_attempt
from collections import Counter
from langfuse import observe

from ..core.client import client
from ..core.config import settings
from ..core.models import VulnerabilityInput, ExpandedQuery
from ..core.vectorstore import VectorStore
from ..core.chunk import CodeChunk
from ..utils.llm import ask_llm_for_structured_data, create_llm_fallback
from .prompts import QUERY_GENERATION_PROMPT_TEMPLATE, QUERY_GENERATION_SYSTEM_PROMPT

logger = logging.getLogger(__name__)

@retry(
    wait=wait_random_exponential(min=1, max=60),
    stop=stop_after_attempt(3),
    retry_error_callback=create_llm_fallback(
        "QUERY EXPANSION",
        lambda rs, e: ExpandedQuery.create_fallback(rs.args[0], str(e)).expanded_query
    )
)
@observe(as_type="span")
def expand_query_with_llm(vulnerability: VulnerabilityInput) -> str:
    """
    Uses an LLM to expand a vulnerability name and constraints into a targeted search query.
    """
    logger.info("EXPANDING VULNERABILITY TO SEARCH QUERY")
    logger.info("=" * 40)

    user_prompt = QUERY_GENERATION_PROMPT_TEMPLATE.format(
        vuln_name=vulnerability.name,
        vuln_constraints=vulnerability.constraints,
    )

    logger.info("Sending query expansion request to LLM...")
    
    logger.info("FULL QUERY EXPANSION PROMPT:")
    logger.info("-" * 40)
    logger.info(f"User: {user_prompt}")
    logger.info("-" * 40)

    api_start_time = time.time()

    result_obj = ask_llm_for_structured_data(
        client=client,
        model_name=settings.OPENAI_MODEL,
        system_prompt=QUERY_GENERATION_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        response_model=ExpandedQuery
    )

    api_time = time.time() - api_start_time
    logger.info(f"Query expansion completed in {api_time:.2f} seconds")

    expanded_query = result_obj.expanded_query.strip()

    logger.info("FULL EXPANDED QUERY:")
    logger.info("=" * 40)
    logger.info(expanded_query)
    logger.info("=" * 40)

    return expanded_query

def _extract_function_patterns(constraints: str) -> List[str]:
    """Extract function/API patterns from vulnerability constraints for hybrid search."""
    import re
    patterns = []
    
    # Pattern 1: Explicit function mentions like "torch.load(", "torch.jit.script"
    func_patterns = re.findall(r'[a-zA-Z_][a-zA-Z0-9_.]*\([^)]*\)', constraints)
    patterns.extend([p.split('(')[0] for p in func_patterns])
    
    # Pattern 2: Backtick-quoted code like `torch.load`
    backtick_patterns = re.findall(r'`([^`]+)`', constraints)
    patterns.extend(backtick_patterns)
    
    # Pattern 3: Explicit "uses X function" or "calls X"
    uses_patterns = re.findall(r'uses?\s+(?:the\s+)?([a-zA-Z_][a-zA-Z0-9_.]+)', constraints, re.IGNORECASE)
    patterns.extend(uses_patterns)
    
    # Pattern 4: Common API patterns (torch.*, django.*, express.*)
    api_patterns = re.findall(r'\b([a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_.]*)\b', constraints)
    patterns.extend(api_patterns)
    
    # Deduplicate and filter
    unique_patterns = list(set(p.strip() for p in patterns if len(p.strip()) > 3))
    return unique_patterns

@observe(as_type="span")
def retrieve_chunks(
    vector_store: VectorStore,
    vulnerability: VulnerabilityInput,
    top_k: int,
    repo_root: Path,
) -> List[CodeChunk]:
    """
    Retrieves the most relevant code chunks for vulnerability analysis with detailed logging.
    Uses hybrid search: semantic (vector) + keyword (function patterns).

    Args:
        vector_store: The vector store containing code chunks
        vulnerability: Vulnerability to analyze
        top_k: Number of chunks to retrieve from vector search
        repo_root: Root path of the repository (for path validation)

    Returns:
        List of code chunks selected for analysis (limited to MAX_CHUNKS_FOR_ANALYSIS)
    """
    logger.info("STARTING CHUNK RETRIEVAL (HYBRID SEARCH)")
    logger.info("=" * 60)
    logger.info(f"Parameters: top_k={top_k}")
    logger.info(f"Max chunks for analysis: {settings.MAX_CHUNKS_FOR_ANALYSIS}")
    logger.info(f"Vulnerability: {vulnerability.name}")

    logger.info("\nSTEP 1: QUERY CONSTRUCTION (LLM-EXPANDED)")
    logger.info("-" * 30)

    query_start = time.time()
    query = expand_query_with_llm(vulnerability)
    query_time = time.time() - query_start

    logger.info(f"Query construction completed in {query_time:.3f} seconds")

    # Extract function patterns for keyword boost
    function_patterns = _extract_function_patterns(vulnerability.constraints)
    if function_patterns:
        logger.info(f"Extracted function patterns for keyword boost: {function_patterns}")

    logger.info("\nSTEP 2: HYBRID SEARCH (VECTOR + KEYWORD)")
    logger.info("-" * 30)

    logger.info(f"Searching for top {top_k} similar code chunks...")
    search_start = time.time()

    try:
        # Primary: Vector search
        similar_chunks = vector_store.search(query, top_k)
        search_time = time.time() - search_start

        logger.info(f"Vector search completed in {search_time:.3f} seconds")
        logger.info(f"Retrieved {len(similar_chunks)} chunks from vector search")
        
        # Secondary: Keyword boost - load content and search for patterns
        if function_patterns:
            logger.info(f"Applying keyword boost for patterns: {function_patterns[:5]}")
            boosted_chunks = []
            seen_ids = set()
            matched_count = 0
            
            # Load content for chunks and check patterns
            for chunk in similar_chunks:
                chunk_id = f"{chunk.file_path}:{chunk.start_line}"
                if chunk_id in seen_ids:
                    continue
                
                # Load content if not present
                try:
                    if not hasattr(chunk, 'content') or not chunk.content:
                        if chunk.file_path.exists():
                            with open(chunk.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                                lines = f.readlines()
                                start_idx = max(0, chunk.start_line - 1)
                                end_idx = min(len(lines), chunk.end_line)
                                chunk.content = "".join(lines[start_idx:end_idx])
                    
                    # Check if chunk matches any pattern
                    if chunk.content:
                        content_lower = chunk.content.lower()
                        matches_pattern = any(pattern.lower() in content_lower for pattern in function_patterns)
                        if matches_pattern:
                            boosted_chunks.append(chunk)
                            seen_ids.add(chunk_id)
                            matched_count += 1
                            logger.debug(f"  KEYWORD MATCH: {chunk.file_path.name} - {chunk.symbol_name}")
                            continue
                except Exception as e:
                    logger.debug(f"Failed to load content for {chunk.file_path}: {e}")
                
                # Add non-matching chunks after matches
                # (they'll be added in second pass)
            
            # Second pass: add remaining chunks from vector search
            for chunk in similar_chunks:
                chunk_id = f"{chunk.file_path}:{chunk.start_line}"
                if chunk_id not in seen_ids:
                    boosted_chunks.append(chunk)
                    seen_ids.add(chunk_id)
            
            similar_chunks = boosted_chunks[:top_k]
            logger.info(f"After keyword boost: {matched_count} chunks with pattern matches (prioritized)")

    except Exception as e:
        logger.error(f"Vector search failed: {str(e)}")
        logger.exception("Full error details:")
        return []

    if not similar_chunks:
        logger.warning("No similar chunks found")
        return []

    logger.info("Retrieved chunks details:")
    chunk_types = Counter(chunk.chunk_type.value for chunk in similar_chunks)
    chunk_languages = Counter(chunk.language for chunk in similar_chunks if chunk.language)
    
    logger.info("  Chunk types:")
    for chunk_type, count in chunk_types.most_common():
        logger.info(f"    - {chunk_type}: {count}")
    
    logger.info("  Languages:")
    for lang, count in chunk_languages.most_common():
        logger.info(f"    - {lang}: {count}")

    # Show first few chunks
    logger.info("  First few chunks:")
    for i, chunk in enumerate(similar_chunks[:5]):
        logger.info(f"    [{i+1}] {chunk.symbol_name or 'unnamed'} in {chunk.file_path.name}")
        logger.info(f"        Type: {chunk.chunk_type.value}, Lines: {chunk.start_line}-{chunk.end_line}")

    # STEP 3: Path validation and remapping
    logger.info("\nSTEP 3: PATH VALIDATION AND REMAPPING")
    logger.info("-" * 30)

    logger.info("Validating chunk file paths...")

    valid_chunks = []
    for chunk in similar_chunks:
        # If the file_path doesn't exist, attempt to remap it to the current repo_root
        candidate_path = chunk.file_path
        if not candidate_path.exists():
            # Try to rebuild the path by stripping the old extraction prefix
            base_name = repo_root.name  # e.g. 'transformers-main'
            if base_name in candidate_path.parts:
                rel_index = candidate_path.parts.index(base_name) + 1
                relative_subpath = Path(*candidate_path.parts[rel_index:])
                remapped_path = repo_root / relative_subpath
                if remapped_path.exists():
                    # Update the chunk's file_path
                    chunk.file_path = remapped_path
                    candidate_path = remapped_path

        # Final existence check
        if candidate_path.exists() and candidate_path.is_file():
            valid_chunks.append(chunk)
        else:
            logger.warning(f"Invalid or missing file for chunk: {candidate_path}")

    logger.info(f"Returning {len(valid_chunks)} valid chunks")
    if len(similar_chunks) - len(valid_chunks) > 0:
        logger.warning(
            f"{len(similar_chunks) - len(valid_chunks)} chunks were invalid and skipped"
        )

    # STEP 4: Apply analysis limit to prevent token overflow
    logger.info("\nSTEP 4: APPLYING ANALYSIS LIMIT")
    logger.info("-" * 30)
    
    if len(valid_chunks) > settings.MAX_CHUNKS_FOR_ANALYSIS:
        logger.warning(f"Limiting chunks from {len(valid_chunks)} to {settings.MAX_CHUNKS_FOR_ANALYSIS} to prevent token overflow")
        # Keep the most relevant chunks (already sorted by similarity)
        limited_chunks = valid_chunks[:settings.MAX_CHUNKS_FOR_ANALYSIS]
        logger.info("Chunks being kept:")
        for i, chunk in enumerate(limited_chunks):
            logger.info(f"  [{i+1}] {chunk.symbol_name or 'unnamed'} in {chunk.file_path.name} (lines {chunk.start_line}-{chunk.end_line})")
        
        logger.info("Chunks being dropped:")
        for i, chunk in enumerate(valid_chunks[settings.MAX_CHUNKS_FOR_ANALYSIS:]):
            logger.info(f"  [dropped] {chunk.symbol_name or 'unnamed'} in {chunk.file_path.name} (lines {chunk.start_line}-{chunk.end_line})")
        
        valid_chunks = limited_chunks

    # Final summary
    logger.info("\nFINAL SELECTION SUMMARY")
    logger.info("-" * 30)

    total_tokens = sum(chunk.tokens_count for chunk in valid_chunks)
    files_represented = len(set(chunk.file_path for chunk in valid_chunks))

    logger.info(f"Selected chunks: {len(valid_chunks)}")
    logger.info(f"Total tokens: {total_tokens}")
    logger.info(f"Files represented: {files_represented}")

    return valid_chunks
