import pickle
from pathlib import Path
from typing import List, Dict, Optional
from collections import defaultdict, Counter
import logging
import time

import faiss
import numpy as np
from tenacity import retry, stop_after_attempt, wait_random_exponential, RetryError
from openai import BadRequestError
from langfuse import get_client, observe

from .client import client
from .chunk import CodeChunk, ChunkType
from .config import settings
from .token_utils import optimize_chunk_size_for_embedding, get_chunk_priority_score
from ..utils.memory import get_memory_usage_gb, check_memory_limit
from ..utils.progress import tqdm, TQDM_AVAILABLE

logger = logging.getLogger(__name__)


# Memory checking function is now imported from utils.memory


@retry(wait=wait_random_exponential(min=5, max=180), stop=stop_after_attempt(15))
@observe(as_type="generation")
def get_embedding(
    text: str, model: str = settings.OPENAI_EMBEDDING_MODEL
) -> List[float]:
    """Generates embeddings for a given text using OpenAI API with rate limiting."""
    text = text.replace("\n", " ")
    
    try:
        logger.debug(f"Generating embedding using model: {model}")
        response = client.embeddings.create(input=[text], model=model)


        if hasattr(response, 'usage') and response.usage:
            langfuse = get_client()
            langfuse.update_current_generation(
                model=model,
                usage_details={
                    "input": getattr(response.usage, 'prompt_tokens', 0),
                    "output": 0,
                    "total": getattr(response.usage, 'total_tokens', 0)
                }
            )

        # Aggressive delay to avoid 429s (embeddings share rate limit with main model)
        embedding = response.data[0].embedding
        time.sleep(1.5)
        return embedding
    except Exception as e:
        logger.warning(f"Embedding API error: {e}")
        # On rate limit, wait longer before retry
        if "429" in str(e) or "rate" in str(e).lower():
            time.sleep(5)
        raise


@retry(wait=wait_random_exponential(min=5, max=180), stop=stop_after_attempt(10))
@observe(as_type="generation")
def get_embeddings_batch(
    texts: List[str], model: str = settings.OPENAI_EMBEDDING_MODEL, max_tokens_per_text: int = 8000
) -> List[List[float]]:
    """Generate embeddings for multiple texts in a single API call with rate limiting.
    
    Automatically truncates texts that exceed the token limit to prevent API errors.
    """
    from .token_utils import count_tokens
    
    # Clean and validate texts - ensure none exceed token limit
    cleaned_texts = []
    for text in texts:
        cleaned = text.replace("\n", " ")
        tokens = count_tokens(cleaned)
        
        if tokens > max_tokens_per_text:
            # Truncate by characters (roughly 4 chars per token)
            chars_per_token = max(1, len(cleaned) // tokens) if tokens > 0 else 4
            max_chars = chars_per_token * max_tokens_per_text
            cleaned = cleaned[:max_chars]
            
            # Verify truncation worked
            while count_tokens(cleaned) > max_tokens_per_text and len(cleaned) > 100:
                cleaned = cleaned[:int(len(cleaned) * 0.9)]
            
            logger.debug(f"Truncated text from {tokens} to {count_tokens(cleaned)} tokens for embedding")
        
        cleaned_texts.append(cleaned)

    try:
        response = client.embeddings.create(input=cleaned_texts, model=model)

        if hasattr(response, 'usage') and response.usage:
            langfuse = get_client()
            langfuse.update_current_generation(
                model=model,
                usage_details={
                    "input": getattr(response.usage, 'prompt_tokens', 0),
                    "output": 0,
                    "total": getattr(response.usage, 'total_tokens', 0)
                }
            )

        # Aggressive delay for batch operations
        time.sleep(2.0)
        return [data.embedding for data in response.data]
    except Exception as e:
        logger.warning(f"Batch embedding API error: {e}")
        if "429" in str(e) or "rate" in str(e).lower():
            time.sleep(10)  # Wait 10s on rate limit before retry
        raise


class VectorStore:
    def __init__(self, index_dir: Path, chunks: List[CodeChunk] = None):
        self.index_dir = index_dir
        self.index_path = self.index_dir / "faiss.index"
        self.metadata_path = self.index_dir / "metadata.pkl"
        self.stats_path = self.index_dir / "chunk_stats.pkl"
        self.index = None
        self.metadata: List[CodeChunk] = []
        self.chunk_stats: Dict = {}

        if chunks:
            self.metadata = chunks

    def index_exists(self) -> bool:
        return self.index_path.exists() and self.metadata_path.exists()

    def set_chunks(self, chunks: List[CodeChunk]) -> None:
        self.metadata = chunks


    @observe(as_type="span", name="Build FAISS Index")
    def build_index(self, rebuild: bool = False):
        """Builds or rebuilds the FAISS index with enhanced chunking support."""
        self.index_dir.mkdir(parents=True, exist_ok=True)

        if not rebuild and self.index_path.exists() and self.metadata_path.exists():
            self.load_index()
            return

        if not self.metadata:
            raise ValueError("No chunks provided to build the index.")

        # Process chunks for optimal embedding
        processed_chunks = self._process_chunks_for_embedding()

        # Memory check before processing
        initial_memory = get_memory_usage_gb()
        logger.info(
            f"Starting embedding generation. Memory usage: {initial_memory:.1f}GB"
        )
        logger.info(
            f"Memory usage: {initial_memory:.1f}GB (limit: {settings.MEMORY_LIMIT_GB}GB)"
        )

        # Generate embeddings in batches to manage memory and API limits
        logger.info(
            f"Generating embeddings for {len(processed_chunks)} chunks in batches..."
        )
        print(f"Generating embeddings for {len(processed_chunks)} chunks...")

        embeddings = []
        batch_size = settings.EMBEDDING_BATCH_SIZE
        total_batches = (len(processed_chunks) + batch_size - 1) // batch_size

        progress_bar = (
            tqdm(range(total_batches), desc="Embedding batches", unit="batch")
            if TQDM_AVAILABLE
            else range(total_batches)
        )

        for batch_idx in progress_bar:
            start_idx = batch_idx * batch_size
            end_idx = min(start_idx + batch_size, len(processed_chunks))
            batch_chunks = processed_chunks[start_idx:end_idx]

            # Prepare batch texts
            batch_texts = []
            chunk_info = []

            for chunk in batch_chunks:
                content, was_truncated = optimize_chunk_size_for_embedding(
                    chunk.content, target_tokens=512
                )
                if was_truncated:
                    logger.debug(
                        f"Truncated chunk {chunk.symbol_name} from {chunk.file_path}"
                    )

                batch_texts.append(content)
                chunk_info.append(
                    {
                        "file": chunk.file_path.name,
                        "type": chunk.chunk_type.value,
                        "tokens": chunk.tokens_count,
                        "truncated": was_truncated,
                    }
                )

            # Generate embeddings for batch
            try:
                batch_embeddings = get_embeddings_batch(batch_texts)
                embeddings.extend(batch_embeddings)

                # Update progress bar
                if TQDM_AVAILABLE:
                    progress_bar.set_postfix(
                        {
                            "chunks": f"{end_idx}/{len(processed_chunks)}",
                            "memory": f"{get_memory_usage_gb():.1f}GB",
                        }
                    )

                # Memory check after each batch
                if check_memory_limit():
                    logger.warning("Memory limit reached, forcing garbage collection")
                    time.sleep(0.1)  # Brief pause to let system recover

            except Exception as e:
                logger.error(f"Failed to process batch {batch_idx}: {e}")
                
                # Enhanced error handling for RetryError
                if isinstance(e, RetryError):
                    logger.error("RetryError detected in batch embedding - all retry attempts exhausted")
                    if hasattr(e, 'last_attempt') and e.last_attempt and e.last_attempt.exception():
                        underlying_error = e.last_attempt.exception()
                        logger.error(f"Underlying batch embedding error: {type(underlying_error).__name__}: {str(underlying_error)}")
                        
                        # Check for token limit specifically
                        if isinstance(underlying_error, BadRequestError):
                            underlying_msg = str(underlying_error)
                            if "tokens exceed" in underlying_msg or "context_length_exceeded" in underlying_msg:
                                logger.error("TOKEN LIMIT EXCEEDED in batch embedding")
                
                # Fallback to individual processing for this batch
                logger.info(
                    "Falling back to individual embedding generation for this batch"
                )
                for chunk in batch_chunks:
                    try:
                        content, _ = optimize_chunk_size_for_embedding(
                            chunk.content, target_tokens=512
                        )
                        embedding = get_embedding(content)
                        embeddings.append(embedding)
                    except Exception as individual_error:
                        logger.error(
                            f"Failed to embed individual chunk: {individual_error}"
                        )
                        
                        # Enhanced error handling for individual embedding RetryError
                        if isinstance(individual_error, RetryError):
                            logger.error("RetryError detected in individual embedding")
                            if hasattr(individual_error, 'last_attempt') and individual_error.last_attempt and individual_error.last_attempt.exception():
                                underlying_error = individual_error.last_attempt.exception()
                                logger.error(f"Underlying individual embedding error: {type(underlying_error).__name__}: {str(underlying_error)}")
                                
                                if isinstance(underlying_error, BadRequestError):
                                    underlying_msg = str(underlying_error)
                                    if "tokens exceed" in underlying_msg or "context_length_exceeded" in underlying_msg:
                                        logger.error("TOKEN LIMIT EXCEEDED in individual embedding")
                        
                        # Skip this chunk
                        processed_chunks.remove(chunk)

        final_memory = get_memory_usage_gb()
        logger.info(
            f"Embedding generation complete. Memory usage: {final_memory:.1f}GB (delta: +{final_memory-initial_memory:.1f}GB)"
        )
        logger.info(
            f"Generated {len(embeddings)} embeddings (Memory: {final_memory:.1f}GB)"
        )

        # Build FAISS index
        dimension = len(embeddings[0])
        self.index = faiss.IndexFlatL2(dimension)
        self.index = faiss.IndexIDMap(self.index)

        embeddings_np = np.array(embeddings).astype("float32")
        ids = np.array(range(len(processed_chunks)))
        self.index.add_with_ids(embeddings_np, ids)

        # Update metadata with processed chunks
        self.metadata = processed_chunks

        # Generate and save statistics
        self._generate_chunk_statistics()

        self.save_index()
        print(f"Index built successfully with {len(processed_chunks)} chunks")
        self._print_chunk_statistics()

    def _process_chunks_for_embedding(self) -> List[CodeChunk]:
        """Process and prioritize chunks for embedding generation with resource limits."""
        logger.info("Processing chunks for embedding with resource optimization...")

        processed_chunks = []

        # Memory check at start
        initial_memory = get_memory_usage_gb()
        logger.info(f"Initial memory usage: {initial_memory:.1f}GB")

        # Filter out oversized chunks first
        valid_chunks = []
        oversized_count = 0

        for chunk in self.metadata:
            chunk_size_mb = len(chunk.content.encode("utf-8")) / (1024 * 1024)
            if chunk_size_mb > settings.MAX_CHUNK_SIZE_MB:
                logger.debug(
                    f"Skipping oversized chunk: {chunk.symbol_name} ({chunk_size_mb:.1f}MB)"
                )
                oversized_count += 1
                continue
            valid_chunks.append(chunk)

        if oversized_count > 0:
            logger.info(
                f"Filtered out {oversized_count} oversized chunks (>{settings.MAX_CHUNK_SIZE_MB}MB)"
            )
            print(f"Skipped {oversized_count} oversized chunks")

        # Add priority scores to valid chunks
        logger.info("Calculating priority scores...")
        for chunk in tqdm(
            valid_chunks, desc="Scoring chunks", disable=not TQDM_AVAILABLE
        ):
            chunk.priority_score = get_chunk_priority_score(
                chunk.content, chunk.chunk_type.value
            )

        # Sort by priority (highest first)
        sorted_chunks = sorted(
            valid_chunks, key=lambda x: x.priority_score, reverse=True
        )

        # Group chunks by type for better organization
        chunks_by_type = defaultdict(list)
        for chunk in sorted_chunks:
            chunks_by_type[chunk.chunk_type].append(chunk)

        # Process each type with specific strategies and limits
        total_selected = 0

        for chunk_type, chunks in chunks_by_type.items():
            if total_selected >= settings.MAX_TOTAL_CHUNKS:
                logger.warning(
                    f"Reached maximum chunk limit ({settings.MAX_TOTAL_CHUNKS}), stopping selection"
                )
                break

            remaining_slots = settings.MAX_TOTAL_CHUNKS - total_selected

            if chunk_type == ChunkType.FILE:
                # For file chunks, limit to avoid overwhelming the index
                selected = chunks[: min(50, remaining_slots)]  # Reduced from 100
                processed_chunks.extend(selected)
                logger.info(
                    f"Selected {len(selected)} file chunks (priority >= {selected[-1].priority_score:.1f})"
                )

            elif chunk_type in [ChunkType.FUNCTION, ChunkType.METHOD]:
                # For functions/methods, prioritize high-quality ones
                high_priority = [c for c in chunks if c.priority_score >= 6.0]
                medium_priority = [c for c in chunks if 4.0 <= c.priority_score < 6.0]

                # Take high priority first
                high_selected = high_priority[
                    : min(len(high_priority), remaining_slots)
                ]
                processed_chunks.extend(high_selected)
                remaining_slots -= len(high_selected)

                # Then medium priority if we have space
                if remaining_slots > 0:
                    medium_selected = medium_priority[: min(100, remaining_slots)]
                    processed_chunks.extend(medium_selected)

                logger.info(
                    f"Selected {len(high_selected)} high-priority + {len(medium_selected) if remaining_slots > 0 else 0} medium-priority {chunk_type.value} chunks"
                )

            elif chunk_type == ChunkType.CLASS:
                # For classes, take most high-priority ones
                selected = chunks[: min(75, remaining_slots)]  # Reduced from 150
                processed_chunks.extend(selected)
                logger.info(f"Selected {len(selected)} class chunks")

            else:
                # For other types (like line-based fallbacks), take selectively
                selected = chunks[: min(25, remaining_slots)]  # Reduced from 50
                processed_chunks.extend(selected)
                logger.info(f"Selected {len(selected)} {chunk_type.value} chunks")

            total_selected = len(processed_chunks)

            # Memory check during processing
            if check_memory_limit():
                logger.warning(
                    "Memory limit approached during chunk selection, stopping early"
                )
                break

        logger.info(
            f"Final chunk selection: {len(processed_chunks)} chunks from {len(self.metadata)} total"
        )
        logger.info(f"Memory usage after selection: {get_memory_usage_gb():.1f}GB")

        return processed_chunks

    def _generate_chunk_statistics(self):
        """Generate statistics about the chunks in the index."""
        stats = {
            "total_chunks": len(self.metadata),
            "chunks_by_type": Counter(
                chunk.chunk_type.value for chunk in self.metadata
            ),
            "chunks_by_language": Counter(
                chunk.language for chunk in self.metadata if chunk.language
            ),
            "chunks_by_file": Counter(str(chunk.file_path) for chunk in self.metadata),
            "average_tokens": (
                sum(chunk.tokens_count for chunk in self.metadata) / len(self.metadata)
                if self.metadata
                else 0
            ),
            "average_complexity": (
                sum(chunk.complexity_score for chunk in self.metadata)
                / len(self.metadata)
                if self.metadata
                else 0
            ),
            "files_processed": len(
                set(str(chunk.file_path) for chunk in self.metadata)
            ),
            "token_distribution": {
                "small_chunks_0_100": len(
                    [c for c in self.metadata if c.tokens_count <= 100]
                ),
                "medium_chunks_100_300": len(
                    [c for c in self.metadata if 100 < c.tokens_count <= 300]
                ),
                "large_chunks_300_plus": len(
                    [c for c in self.metadata if c.tokens_count > 300]
                ),
            },
        }
        self.chunk_stats = stats

    def _print_chunk_statistics(self):
        """Print chunk statistics to console."""
        stats = self.chunk_stats
        print("\n" + "=" * 60)
        print("CHUNK STATISTICS")
        print("=" * 60)
        print(f"Total chunks: {stats['total_chunks']}")
        print(f"Files processed: {stats['files_processed']}")
        print(f"Average tokens per chunk: {stats['average_tokens']:.1f}")
        print(f"Average complexity score: {stats['average_complexity']:.1f}")

        print("\nChunks by type:")
        for chunk_type, count in stats["chunks_by_type"].most_common():
            print(f"  {chunk_type}: {count}")

        print("\nChunks by language:")
        for language, count in stats["chunks_by_language"].most_common(10):
            print(f"  {language or 'unknown'}: {count}")

        print("\nToken distribution:")
        token_dist = stats["token_distribution"]
        print(f"  Small (≤100 tokens): {token_dist['small_chunks_0_100']}")
        print(f"  Medium (100-300 tokens): {token_dist['medium_chunks_100_300']}")
        print(f"  Large (>300 tokens): {token_dist['large_chunks_300_plus']}")

        print("=" * 60 + "\n")

    def save_index(self):
        """Saves the FAISS index, metadata, and statistics to disk."""
        faiss.write_index(self.index, str(self.index_path))
        with open(self.metadata_path, "wb") as f:
            pickle.dump(self.metadata, f)
        with open(self.stats_path, "wb") as f:
            pickle.dump(self.chunk_stats, f)

    def load_index(self):
        """Loads the FAISS index, metadata, and statistics from disk."""
        self.index = faiss.read_index(str(self.index_path))
        with open(self.metadata_path, "rb") as f:
            self.metadata = pickle.load(f)

        # Load statistics if available
        if self.stats_path.exists():
            with open(self.stats_path, "rb") as f:
                self.chunk_stats = pickle.load(f)
        else:
            self.chunk_stats = {}

    @observe(as_type="span", name="Vector Similarity Search")
    def search(self, query: str, k: int) -> List[CodeChunk]:
        """Searches the index for the top-k most similar chunks with enhanced filtering."""
        if self.index is None:
            self.load_index()

        try:
            query_embedding = get_embedding(query)
            query_vector = np.array([query_embedding]).astype("float32")

            # Search for more results than requested to allow for filtering
            search_k = min(k * 3, len(self.metadata))
            distances, indices = self.index.search(query_vector, search_k)

            # Filter out invalid indices (-1)
            valid_indices = [i for i in indices[0] if i != -1]

            # Get chunks and apply intelligent filtering
            candidate_chunks = [self.metadata[i] for i in valid_indices]

            # Filter and rank results
            filtered_chunks = self._filter_and_rank_results(candidate_chunks, query, k)

            return filtered_chunks[:k]
            
        except Exception as e:
            logger.error(f"Search failed: {e}")
            
            # Enhanced error handling for RetryError
            if isinstance(e, RetryError):
                logger.error("RetryError detected in search embedding - all retry attempts exhausted")
                if hasattr(e, 'last_attempt') and e.last_attempt and e.last_attempt.exception():
                    underlying_error = e.last_attempt.exception()
                    logger.error(f"Underlying search embedding error: {type(underlying_error).__name__}: {str(underlying_error)}")
                    
                    # Check for token limit specifically
                    if isinstance(underlying_error, BadRequestError):
                        underlying_msg = str(underlying_error)
                        if "tokens exceed" in underlying_msg or "context_length_exceeded" in underlying_msg:
                            logger.error("TOKEN LIMIT EXCEEDED in search query embedding")
            
            logger.error("Returning empty search results due to embedding failure")
            return []

    def _filter_and_rank_results(
        self, chunks: List[CodeChunk], query: str, target_k: int
    ) -> List[CodeChunk]:
        """Apply intelligent filtering and ranking to search results."""
        if not chunks:
            return []

        # Remove duplicates while preserving order
        seen_content = set()
        unique_chunks = []
        for chunk in chunks:
            content_hash = hash(
                chunk.content[:200]
            )  # Use first 200 chars as fingerprint
            if content_hash not in seen_content:
                seen_content.add(content_hash)
                unique_chunks.append(chunk)

        # Diversity filter - avoid too many chunks from the same file
        diversified_chunks = []
        file_counts = Counter()
        max_per_file = max(2, target_k // 3)  # At most 1/3 of results from same file

        for chunk in unique_chunks:
            file_path = str(chunk.file_path)
            if file_counts[file_path] < max_per_file:
                diversified_chunks.append(chunk)
                file_counts[file_path] += 1

            if len(diversified_chunks) >= target_k * 2:  # Get enough candidates
                break

        return diversified_chunks

    def get_chunks_by_type(
        self, chunk_type: ChunkType, limit: Optional[int] = None
    ) -> List[CodeChunk]:
        """Get chunks filtered by type."""
        if self.index is None:
            self.load_index()

        filtered_chunks = [
            chunk for chunk in self.metadata if chunk.chunk_type == chunk_type
        ]

        if limit:
            filtered_chunks = filtered_chunks[:limit]

        return filtered_chunks

    def get_chunks_by_file(
        self, file_path: Path, limit: Optional[int] = None
    ) -> List[CodeChunk]:
        """Get all chunks from a specific file."""
        if self.index is None:
            self.load_index()

        filtered_chunks = [
            chunk for chunk in self.metadata if chunk.file_path == file_path
        ]

        # Sort by start line for logical order
        filtered_chunks.sort(key=lambda x: x.start_line)

        if limit:
            filtered_chunks = filtered_chunks[:limit]

        return filtered_chunks

    def get_statistics(self) -> Dict:
        """Return chunk statistics."""
        if not self.chunk_stats and self.stats_path.exists():
            with open(self.stats_path, "rb") as f:
                self.chunk_stats = pickle.load(f)

        return self.chunk_stats
