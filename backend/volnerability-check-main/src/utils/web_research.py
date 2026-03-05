import asyncio
import logging
import itertools
import httpx
import time

from tenacity import retry, wait_random_exponential, stop_after_attempt
from typing import Any, Dict, List

from ..core.config import settings
from ..core.client import client
from ..core.models import WebResearchResult
from ..utils.llm import ask_llm_for_structured_data
from ..analysis.prompts import (
    WEB_RESEARCH_AGENT_SYSTEM_PROMPT,
    WEB_RESEARCH_AGENT_USER_PROMPT,
    WEB_RESEARCH_SYSTEM_PROMPT,
    WEB_RESEARCH_USER_PROMPT
)
from .rate_limiter import rate_limiter

logger = logging.getLogger(__name__)

async def _fetch_searxng_query(http_client: httpx.AsyncClient, query: str) -> List[Dict[str, str]]:
    """Fetches and parses JSON results from SearxNG for a single query."""
    searxng_url = settings.SEARXNG_BASE_URL
    try:
        response = await http_client.get(
            searxng_url,
            params={"q": query, "format": "json"},
            timeout=15.0
        )
        response.raise_for_status()
        data = response.json()

        results = []
        for item in data.get("results", []):
            content = item.get("content", "") or item.get("snippet", "")
            if content:
                results.append({
                    "title": item.get("title", "No Title"),
                    "url": item.get("url", ""),
                    "content": content
                })
            if len(results) >= settings.SEARXNG_TOP_K_QUERY:
                break
        return results
    except Exception as e:
        logger.warning(f"SearxNG query failed for '{query}': {e}")
        return []

async def _gather_web_context(vuln_name: str) -> str:
    """Runs multiple SearxNG queries concurrently."""
    queries = [
        f'"{vuln_name}" site:github.com/advisories OR site:github.com/security/advisories',
        f'"{vuln_name}" site:opencve.io OR site:app.opencve.io',
        f'"{vuln_name}" site:snyk.io/vuln OR site:security.snyk.io',
        f'"{vuln_name}" site:wiz.io/vulnerability-database',
        f'"{vuln_name}" (PoC OR exploit OR "proof of concept" OR writeup OR "technical analysis")',
        f'"{vuln_name}" (patch OR commit OR fix OR "pull request" OR PR) site:github.com',
        f'"{vuln_name}" (advisory OR bulletin OR "security advisory")'
    ]

    all_results = []
    async with httpx.AsyncClient() as http_client:
        tasks = [_fetch_searxng_query(http_client, q) for q in queries]
        query_results = await asyncio.gather(*tasks)

        all_results = list(itertools.chain.from_iterable(query_results))

    seen_urls = set()
    unique_results = []
    for res in all_results:
        if res["url"] and res["url"] not in seen_urls:
            seen_urls.add(res["url"])
            unique_results.append(res)

    context_blocks = []
    for i, res in enumerate(unique_results[:settings.SEARXNG_TOP_K_CONTEXT]):
        context_blocks.append(
            f"--- SOURCE {i+1} ---\n"
            f"URL: {res['url']}\n"
            f"Content: {res['content']}\n"
        )

    return "\n".join(context_blocks)

def return_fallback_web_research(retry_state) -> Dict[str, Any]:
    """All retry attempts exhausted for web research"""
    vuln_name = retry_state.args[0]
    e = retry_state.outcome.exception()

    logger.error(f"All retries failed for web research on {vuln_name}: {e}")
    return _create_fallback_research_report(vuln_name, str(e))

@retry(
    wait=wait_random_exponential(min=1, max=60),
    stop=stop_after_attempt(3),
    retry_error_callback=return_fallback_web_research
)
async def conduct_web_research(vuln_name: str, vuln_constraints: str) -> Dict[str, Any]:
    """Conducts comprehensive web research about a vulnerability using LLM with web search capability."""
    logger.info(f"Conducting web research for {vuln_name}")

    if settings.SEARXNG_BASE_URL:
        logger.info(f"Fetching raw web context from SearxNG fom {settings.SEARXNG_BASE_URL}...")
        web_context = await _gather_web_context(vuln_name)
        if not web_context.strip():
            logger.warning(f"SearxNG returned no context for {vuln_name}.")

        system_prompt = WEB_RESEARCH_SYSTEM_PROMPT
        user_prompt = WEB_RESEARCH_USER_PROMPT.format(
            vuln_name=vuln_name,
            vuln_constraints=vuln_constraints,
            web_context=web_context,
        )
        agent_name = f"SearxNG + {settings.OPENAI_WEB_SEARCH_MODEL}"
    else:
        logger.info("SearxNG NOT configured. Falling back to Agentic Search Model.")
        system_prompt = WEB_RESEARCH_AGENT_SYSTEM_PROMPT
        user_prompt = WEB_RESEARCH_AGENT_USER_PROMPT.format(
            vuln_name=vuln_name,
            vuln_constraints=vuln_constraints
        )
        agent_name = f"Agentic ({settings.OPENAI_WEB_SEARCH_MODEL}"

    await rate_limiter.wait_if_needed()

    result_obj = ask_llm_for_structured_data(
        client=client,
        model_name=settings.OPENAI_WEB_SEARCH_MODEL,
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        response_model=WebResearchResult
    )
    logger.info("Web research LLM generation completed.")

    websearch_data = result_obj.model_dump()

    websearch_data["research_metadata"] = {
        "vuln_name": vuln_name,
        "research_timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "research_agent": agent_name,
        "constraints_analyzed": vuln_constraints
    }

    logger.info(f"Web research successful for {vuln_name}")
    return websearch_data

def _create_fallback_research_report(vuln_name: str, error_message: str) -> Dict[str, Any]:
    """Creates a type-safe fallback research report when web research fails."""
    return {
        "vulnerability_details": {
            "title": f"Research unavailable for {vuln_name}",
            "description": f"Web research could not be completed: {error_message}",
            "impact": "Unknown - research failed",
            "attack_vector": "Unknown - research failed",
            "root_cause": "Unknown - research failed"
        },
        "version_intelligence": {
            "affected_versions": [],
            "patched_versions": [],
            "version_details": "Version information unavailable",
            "upgrade_recommendations": "Consult official sources"
        },
        "exploit_intelligence": {
            "public_exploits": [],
            "poc_available": False,
            "exploit_complexity": "unknown",
            "attack_scenarios": [],
            "exploitation_requirements": []
        },
        "mitigation_intelligence": {
            "vendor_patches": [],
            "workarounds": [],
            "configuration_fixes": [],
            "defensive_measures": []
        },
        "security_advisories": [],
        "real_world_context": {
            "known_incidents": [],
            "industry_impact": "Unknown due to research failure",
            "timeline": ["Timeline unavailable"],
            "vendor_response": "Vendor response information unavailable"
        },
        "research_quality": {
            "sources_consulted": [],
            "information_confidence": "low",
            "gaps_identified": ["All information unavailable due to research failure"],
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
        },
        "research_metadata": {
            "vuln_name": vuln_name,
            "research_timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "research_agent": "LLM Web Research Agent (Fallback)",
            "error": error_message
        }
    }