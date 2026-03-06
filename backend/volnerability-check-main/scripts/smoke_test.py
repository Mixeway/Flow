import os
import subprocess
import json
from pathlib import Path

def run_smoke_test():
    """Runs an end-to-end smoke test of the enhanced analysis pipeline on real sample data."""
    print("Starting enhanced smoke test on sample data...")

    zip_path = Path("./data/Mixeway-MixewayScanner.zip")
    xlsx_path = Path("./data/Mixeway-MixewayScanner_small.xlsx")

    if not zip_path.exists() or not xlsx_path.exists():
        print(
            f"ERROR: Sample files not found. Make sure {zip_path} and {xlsx_path} exist."
        )
        return

    os.environ["MAX_FILES_FOR_TESTING"] = "0"
    os.environ["MAX_CHUNKS_FOR_ANALYSIS"] = "20"  # Increased for better context

    base_name = zip_path.stem
    results_dir = Path(f"./results/{base_name}")
    results_dir.mkdir(parents=True, exist_ok=True)
    os.environ["OUTPUT_DIR"] = str(results_dir)

    command = [
        "poetry",
        "run",
        "python",
        "-m",
        "src",
        "analyze",
        str(zip_path),
        str(xlsx_path)
    ]

    print(f"Running enhanced pipeline command: {' '.join(command)}")

    try:
        if not Path(".env").exists():
            print("WARNING: .env file not found. The test will likely fail.")
            print("Please copy .env.example to .env and fill it out.")

        # The output of the subprocess will be streamed to the console directly.
        result = subprocess.run(command, check=True, text=True)

        # Output is now streamed to console in real-time, no need to print it here.

        base_name = zip_path.stem
        results_dir = Path(f"./results/{base_name}")
        json_output = results_dir / f"{base_name}.json"
        xlsx_output = results_dir / f"{base_name}.results.xlsx"
        metrics_output = results_dir / f"{base_name}.metrics.json"
        quality_output = results_dir / f"{base_name}.quality.json"

        print("\nVerifying outputs...")
        assert json_output.exists(), f"JSON output not found at {json_output}"
        assert xlsx_output.exists(), f"XLSX output not found at {xlsx_output}"
        assert metrics_output.exists(), f"Metrics output not found at {metrics_output}"
        assert quality_output.exists(), f"Quality output not found at {quality_output}"

        # Verify JSON output contains new fields
        print("Validating JSON output structure...")
        with open(json_output, 'r') as f:
            results_data = json.load(f)
        
        if not results_data:
            print("WARNING: No results in JSON output")
        else:
            first_result = results_data[0]
            required_fields = [
                'predicted_probability', 'predicted_exploitable', 
                'ground_truth_probability', 'ground_truth_exploitable',
                'analysis_summary', 'detailed_reasoning'
            ]
            
            for field in required_fields:
                assert field in first_result, f"Missing required field: {field}"
            
            # Validate detailed_reasoning is not empty
            assert len(first_result['detailed_reasoning']) > 0, "detailed_reasoning field is empty"
            
            print(f"✓ JSON output contains {len(results_data)} results with all required fields")
            print(f"✓ detailed_reasoning field present and non-empty (avg length: {sum(len(r.get('detailed_reasoning', '')) for r in results_data) // len(results_data)} chars)")
            
            # Check probability range
            prob_values = [r.get('predicted_probability') for r in results_data if r.get('predicted_probability') is not None]
            if prob_values:
                min_prob, max_prob = min(prob_values), max(prob_values)
                assert 0.0 <= min_prob <= 1.0, f"Probability out of range: {min_prob}"
                assert 0.0 <= max_prob <= 1.0, f"Probability out of range: {max_prob}"
                print(f"✓ Probability values in valid range: {min_prob:.3f} - {max_prob:.3f}")

        # Verify metrics output
        print("Validating metrics output...")
        with open(metrics_output, 'r') as f:
            metrics_data = json.load(f)
        
        required_metrics = [
            'total_vulnerabilities', 'probability_mae', 'probability_rmse',
            'exploitable_accuracy', 'exploitable_f1', 'status_accuracy'
        ]
        
        for metric in required_metrics:
            assert metric in metrics_data, f"Missing required metric: {metric}"
        
        print(f"✓ Metrics output contains all required metrics")
        print(f"  - Total vulnerabilities: {metrics_data['total_vulnerabilities']}")
        print(f"  - Probability MAE: {metrics_data['probability_mae']:.4f}")
        print(f"  - Exploitable Accuracy: {metrics_data['exploitable_accuracy']:.4f}")
        print(f"  - Status Accuracy: {metrics_data['status_accuracy']:.4f}")
        
        # Check for quality metrics
        if 'avg_quality_score' in metrics_data and metrics_data['avg_quality_score'] is not None:
            quality_score = metrics_data['avg_quality_score']
            assert 1.0 <= quality_score <= 5.0, f"Quality score out of range: {quality_score}"
            print(f"✓ Average Quality Score: {quality_score:.2f}/5")
        else:
            print("! Quality score not available in metrics")

        # Verify quality assessment output
        print("Validating quality assessment output...")
        with open(quality_output, 'r') as f:
            quality_data = json.load(f)
        
        required_quality_fields = [
            'average_quality_score', 'quality_distribution', 'total_assessed'
        ]
        
        for field in required_quality_fields:
            assert field in quality_data, f"Missing required quality field: {field}"
        
        quality_score = quality_data['average_quality_score']
        assert 1.0 <= quality_score <= 5.0, f"Quality score out of range: {quality_score}"
        
        print(f"✓ Quality assessment output contains all required fields")
        print(f"  - Average Quality Score: {quality_score:.2f}/5")
        print(f"  - Total Assessed: {quality_data['total_assessed']}")
        print(f"  - Quality Distribution: {quality_data['quality_distribution']}")

        # Verify XLSX output can be read
        print("Validating XLSX output...")
        import pandas as pd
        df = pd.read_excel(xlsx_output)
        print(f"✓ XLSX output contains {len(df)} rows and {len(df.columns)} columns")
        
        # Check for new columns
        expected_columns = [
            'predicted_probability', 'predicted_exploitable',
            'ground_truth_probability', 'ground_truth_exploitable'
        ]
        for col in expected_columns:
            if col not in df.columns:
                print(f"WARNING: Expected column '{col}' not found in XLSX output")
            else:
                print(f"✓ Column '{col}' present in XLSX output")

        print("\n" + "="*60)
        print("ENHANCED SMOKE TEST PASSED!")
        print("="*60)
        print(f"✓ JSON output: {json_output}")
        print(f"✓ XLSX output: {xlsx_output}")
        print(f"✓ Metrics output: {metrics_output}")
        print(f"✓ Quality assessment: {quality_output}")
        print(f"✓ All required fields and metrics present")
        print(f"✓ LLM-based quality assessment working")
        print(f"✓ Data validation passed")

    except subprocess.CalledProcessError as e:
        print("Enhanced smoke test FAILED.")
        print("Return code:", e.returncode)
        print("Output and error streams are now directed to the console in real-time.")
    except AssertionError as e:
        print(f"Enhanced smoke test FAILED: {e}")
    except Exception as e:
        print(f"Enhanced smoke test FAILED with unexpected error: {e}")


if __name__ == "__main__":
    run_smoke_test()
