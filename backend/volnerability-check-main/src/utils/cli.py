#!/usr/bin/env python3

import argparse
import logging
import sys
from pathlib import Path
from ..utils.load_setting import load_setting

# Configure logging IMMEDIATELY - before ANY other imports
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),  # Explicitly use stdout
        logging.FileHandler("vulnerability_analysis.log", mode="w", encoding='utf-8'),
    ],
    force=True,
)

# Test logging immediately
logger = logging.getLogger(__name__)
logger.info("Logging configuration initialized in cli.py")
logger.info("Console output should now be visible")

# Import and log OpenAI configuration
from ..core.config import log_openai_configuration
log_openai_configuration()

from ..analysis.pipeline import run_pipeline

def main():
    """Main entry point for the CLI application."""
    logger.info("Starting application through main()")
    
    parser = argparse.ArgumentParser(
        description="Vulnerability Analysis Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python -m src analyze data/repo.zip data/vulnerabilities.xlsx
  python -m src analyze data/repo.zip data/vulnerabilities.xlsx --top-k 50 --rebuild-index
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Analyze command
    analyze_parser = subparsers.add_parser(
        "analyze", 
        help="Run the enhanced vulnerability analysis pipeline"
    )
    analyze_parser.add_argument(
        "zip_path",
        type=str,
        help="Path to the ZIP file containing the repository"
    )
    analyze_parser.add_argument(
        "xlsx_path", 
        type=str,
        help="Path to the XLSX file containing vulnerabilities"
    )
    analyze_parser.add_argument(
        "--rebuild-index",
        action="store_true",
        help="Rebuild the vector index from scratch"
    )
    
    args = parser.parse_args()
    
    if args.command == "analyze":
        analyze_command(args)
    else:
        parser.print_help()
        sys.exit(1)

def analyze_command(args):
    """Handle the analyze command."""
    # Convert string paths to Path objects
    zip_path_obj = Path(args.zip_path)
    xlsx_path_obj = Path(args.xlsx_path)

    top_k = load_setting("default_top_k")

    logger.info(f"Starting enhanced vulnerability analysis pipeline for {zip_path_obj}")
    logger.info(f"Configuration: top_k={top_k}, rebuild_index={args.rebuild_index}")
    
    # Validate input files
    if not zip_path_obj.exists():
        logger.error(f"ZIP file not found: {zip_path_obj}")
        sys.exit(1)
    
    if not xlsx_path_obj.exists():
        logger.error(f"XLSX file not found: {xlsx_path_obj}")
        sys.exit(1)
    
    try:
        # Run the analysis pipeline
        run_pipeline(
            zip_path=zip_path_obj,
            xlsx_path=xlsx_path_obj,
            top_k=top_k,
            rebuild_index=args.rebuild_index,
        )
        
        logger.info("✅ Analysis pipeline completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Analysis pipeline failed: {str(e)}")
        logger.exception("Full error details:")
        sys.exit(1)

if __name__ == "__main__":
    main()
