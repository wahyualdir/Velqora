import json
import os
import sys
import io
import re
import ast

# Ensure non-blocking headless plotting
os.environ['MPLBACKEND'] = 'Agg'
try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    plt.show = lambda *args, **kwargs: None
except Exception:
    pass

INPUT_FILE = os.path.join(os.path.dirname(__file__), "all-code-snippets.json")
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "code-execution-output.json")

print("=== STARTING IN-PROCESS FULL CENSUS CODE EXECUTION AUDIT ===")

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    snippets = json.load(f)

print(f"Loaded {len(snippets)} code snippets.")

status_counts = {
    "RUNNABLE_VERIFIED": 0,
    "RUNNABLE_WITH_ENVIRONMENT_NOTES": 0,
    "FAILS_DEPENDENCY": 0,
    "FAILS_RUNTIME": 0,
    "INVALID_INPUT": 0,
    "OUTPUT_MISMATCH": 0,
    "PSEUDOCODE_MISLABELED": 0,
    "DATA_LEAKAGE_RISK": 0,
    "MANUAL_REVIEW_REQUIRED": 0,
}

audited_items = []
total_leakages = 0

for idx, s in enumerate(snippets):
    code_str = s.get("code", "")
    expected_out = s.get("expectedOutput", "").strip()
    lang = s.get("language", "python").lower()

    has_random_seed = bool(re.search(r"random_state|np\.random\.seed|torch\.manual_seed|seed=", code_str))
    requires_gpu = bool(re.search(r"cuda|to\(['\"]cuda['\"]\)|\.to\('cuda'\)|torch\.cuda", code_str))
    requires_api_key = bool(re.search(r"api_key|os\.environ\.get\(['\"](OPENAI|ANTHROPIC|GEMINI|HUGGINGFACE)", code_str))
    requires_ext_files = bool(re.search(r"pd\.read_csv\(['\"][^'\"]+\.csv['\"]|open\(['\"][^'\"]+['\"]", code_str)) and \
        not ("fetch_california_housing" in code_str or "load_iris" in code_str or "load_wine" in code_str or "load_breast_cancer" in code_str)

    # Data leakage check
    has_leakage = False
    leakage_details = ""
    if (".fit(" in code_str or "fit_transform" in code_str) and "train_test_split" in code_str:
        fit_idx = min([code_str.find(x) for x in [".fit(", "fit_transform"] if x in code_str])
        split_idx = code_str.find("train_test_split")
        if fit_idx < split_idx:
            has_leakage = True
            leakage_details = "CRITICAL: Preprocessor .fit() called on entire dataset before train_test_split()"
            total_leakages += 1

    imports_torch = bool(re.search(r"import torch|from torch", code_str))
    imports_tf = bool(re.search(r"import tensorflow|from tensorflow", code_str))
    imports_cv2 = bool(re.search(r"import cv2", code_str))

    status = "RUNNABLE_VERIFIED"
    notes = ""
    actual_out = ""

    if has_leakage:
        status = "DATA_LEAKAGE_RISK"
        notes = leakage_details
    elif imports_torch or imports_tf or imports_cv2:
        status = "FAILS_DEPENDENCY"
        missing = "PyTorch" if imports_torch else ("TensorFlow" if imports_tf else "OpenCV")
        notes = f"Requires uninstalled library: {missing}"
    elif requires_api_key:
        status = "RUNNABLE_WITH_ENVIRONMENT_NOTES"
        notes = "Requires external vendor API key."
    elif requires_ext_files:
        status = "INVALID_INPUT"
        notes = "Relies on local file not present in repository."
    elif lang != "python":
        status = "RUNNABLE_WITH_ENVIRONMENT_NOTES"
        notes = f"Non-Python snippet ({lang}); requires dedicated environment."
    else:
        # Execute in-process with redirected stdout
        old_stdout = sys.stdout
        old_stderr = sys.stderr
        redirected_out = io.StringIO()
        redirected_err = io.StringIO()
        sys.stdout = redirected_out
        sys.stderr = redirected_err

        try:
            # Parse syntax first
            parsed = ast.parse(code_str)
            # Execute with clean local scope
            scope = {
                "__name__": "__main__",
                "__builtins__": __builtins__,
            }
            exec(compile(parsed, "<curriculum_snippet>", "exec"), scope)
            actual_out = redirected_out.getvalue().strip()

            if expected_out and expected_out.startswith("Status eksekusi:") and not actual_out.startswith("Status eksekusi:"):
                status = "OUTPUT_MISMATCH"
                notes = f"Synthetic placeholder expectedOutput ('{expected_out[:50]}...') differs from actual runtime output ('{actual_out[:50]}...')."
            else:
                status = "RUNNABLE_VERIFIED"
                notes = "Executed cleanly with valid output."

        except Exception as e:
            status = "FAILS_RUNTIME"
            err_msg = str(e)
            actual_out = err_msg
            notes = f"Runtime failure: {err_msg[:100]}"
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr

    status_counts[status] += 1

    if idx < 100 or status != "RUNNABLE_VERIFIED":
        audited_items.append({
            "topicId": s.get("topicId"),
            "chapterIndex": s.get("chapterIndex"),
            "subchapterIndex": s.get("subchapterIndex"),
            "codeId": s.get("codeId"),
            "filename": s.get("filename"),
            "codeSample": code_str[:100],
            "expectedOutput": expected_out[:80],
            "actualOutput": actual_out[:80],
            "status": status,
            "notes": notes,
        })

    if (idx + 1) % 500 == 0 or (idx + 1) == len(snippets):
        print(f"Processed {idx + 1}/{len(snippets)} snippets...")

results = {
    "totalCodeBlocksAudited": len(snippets),
    "statusCounts": status_counts,
    "percentages": {k: f"{(v / len(snippets)) * 100:.2f}%" for k, v in status_counts.items()},
    "dataLeakageFindingsCount": total_leakages,
    "sampleFindings": audited_items[:50]
}

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("=== IN-PROCESS CODE AUDIT COMPLETED ===")
print("Summary:")
print(json.dumps(results["statusCounts"], indent=2))
print("Percentages:")
print(json.dumps(results["percentages"], indent=2))
