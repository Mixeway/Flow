"""
Shared OpenAI client configuration.
"""
import logging
from openai import OpenAI
from .config import settings

logger = logging.getLogger(__name__)

# Build client kwargs dynamically to include optional organization ID
client_kwargs = {
    "base_url": settings.OPENAI_BASE_URL,
    "timeout": settings.OPENAI_TIMEOUT_SECONDS,
    "max_retries": settings.OPENAI_MAX_RETRIES,
}

if settings.OPENAI_API_KEY:
    client_kwargs["api_key"] = settings.OPENAI_API_KEY

if settings.OPENAI_ORG_ID:
    client_kwargs["organization"] = settings.OPENAI_ORG_ID

if settings.CF_ACCESS_CLIENT_ID and settings.CF_ACCESS_CLIENT_SECRET:
    client_kwargs["default_headers"] = {
        "CF-Access-Client-Id": settings.CF_ACCESS_CLIENT_ID,
        "CF-Access-Client-Secret": settings.CF_ACCESS_CLIENT_SECRET,
    }

client = OpenAI(**client_kwargs)

logger.debug(f"OpenAI client initialized with base URL: {settings.OPENAI_BASE_URL}")
