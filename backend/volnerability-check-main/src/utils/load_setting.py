# load_setting.py
import os
import logging
from dotenv import load_dotenv
import psycopg2

logger = logging.getLogger(__name__)

ALLOWED_SETTINGS = {
    "openai_api_key",
    "openai_base_url",
    "openai_model",
    "openai_embedding_model",
    "openai_org_id",
    "openai_max_output_tokens",
    "openai_first_token_timeout_seconds",
    "openai_timeout_seconds",
    "openai_max_retries",
    "cf_access_client_id",
    "cf_access_client_secret",
    "langfuse_base_url",
    "langfuse_secret_key",
    "langfuse_public_key",
    "max_concurrent_api_calls",
    "api_call_delay_seconds",
    "default_top_k",
    "max_chunks_for_analysis",
    "file_filter_mode",
    "custom_extensions",
    "max_file_size_mb",
    "max_file_lines",
    "warn_file_size_mb",
    "warn_file_lines",
    "max_files_for_testing",
    "embedding_batch_size",
    "max_chunk_size_mb",
    "max_total_chunks",
    "memory_limit_gb",
    "max_preprocessing_chars",
    "max_organization_chars",
    "enable_chunk_subdivision",
    "max_chunks_per_file",
    "chunking_parallel_workers",
    "reduce_chunking_logs",
}

ALLOWED_TABLES = {
    "settings",
    "settings_exploitability",
}

load_dotenv(override=False)

def load_setting(setting_name, table_name="settings_exploitability", default=None):
    """
    Safely load a setting from environment or PostgreSQL.
    - Protects against SQL injection by whitelisting allowed column names and table names.
    - Returns the value instead of setting it in environment.
    """

    print(f"Fetching {setting_name} from table {table_name} in database")

    if setting_name not in ALLOWED_SETTINGS:
        raise ValueError(f"Invalid or unsafe setting name: {setting_name}")

    if table_name not in ALLOWED_TABLES:
        raise ValueError(f"Invalid or unsafe table name: {table_name}")

    # Build DB connection string
    db_user = os.getenv("DB_USER", "flow_user")
    db_pass = os.getenv("DB_PASS", "flow_pass")
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME", "flow")

    print(
        "[DEBUG] Preparing to load setting from database\n"
        f"        setting_name={setting_name}\n"
        f"        table_name={table_name}\n"
        f"        db_host={db_host}\n"
        f"        db_port={db_port}\n"
        f"        db_name={db_name}\n"
        f"        db_user={db_user}"
    )

    db_url = f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"

    print("[DEBUG] Opening database connection...")

    conn = psycopg2.connect(db_url)
    try:
        with conn.cursor() as cur:
            query = f"SELECT {setting_name} FROM {table_name} LIMIT 1;"
            cur.execute(query)
            row = cur.fetchone()
            if not row or row[0] is None:
                logger.warning(f"Setting '{setting_name}' is null/missing in DB. Using default: {default}")
                return default
            key = row[0]
            print(f"Returning {key}")
            return key
    finally:
        conn.close()
