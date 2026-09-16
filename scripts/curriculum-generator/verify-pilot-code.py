"""
VELQORA PHASE 2.3.1: INDEPENDENT PILOT CODE EXECUTION AUDITOR
Mengeksekusi secara independen setiap blok kode yang tercantum pada materi pilot:
1. reflex_vs_goal_agent.py (AI Fundamentals Bab 1)
2. polynomial_bias_variance.py (Machine Learning Bab 6 Subbab 1)
3. lasso_feature_sparsity.py (Machine Learning Bab 6 Subbab 2)
Memverifikasi kecocokan exact stdout vs expectedOutput, anti-leakage data flow, runtime, dan dependensi.
"""

import sys
import io
import time
import json
import os
import re
import numpy as np

def run_pilot_verification():
    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "python_version": sys.version,
        "results": []
    }

    # -------------------------------------------------------------------------
    # TEST 1: AI Fundamentals Bab 1 - Reflex vs Goal Agent
    # -------------------------------------------------------------------------
    code_1 = """class VacuumEnvironment:
    def __init__(self, locations=("A", "B")):
        self.status = {loc: "Dirty" for loc in locations}
        self.agent_loc = "A"

    def is_clean(self):
        return all(s == "Clean" for s in self.status.values())

class SimpleReflexAgent:
    def select_action(self, location, state):
        if state == "Dirty":
            return "Suck"
        return "Right" if location == "A" else "Left"

env = VacuumEnvironment()
agent = SimpleReflexAgent()
steps_history = []

for step in range(4):
    curr_loc = env.agent_loc
    curr_state = env.status[curr_loc]
    action = agent.select_action(curr_loc, curr_state)
    steps_history.append(f"Step {step+1}: Loc={curr_loc}, State={curr_state} -> Action={action}")
    
    if action == "Suck":
        env.status[curr_loc] = "Clean"
    elif action == "Right":
        env.agent_loc = "B"
    elif action == "Left":
        env.agent_loc = "A"

print("\\n".join(steps_history))
print("Final Status:", env.status, "| Cleaned All:", env.is_clean())"""

    expected_1 = """Step 1: Loc=A, State=Dirty -> Action=Suck
Step 2: Loc=A, State=Clean -> Action=Right
Step 3: Loc=B, State=Dirty -> Action=Suck
Step 4: Loc=B, State=Clean -> Action=Left
Final Status: {'A': 'Clean', 'B': 'Clean'} | Cleaned All: True"""

    res1 = execute_snippet("reflex_vs_goal_agent.py", code_1, expected_1, "AI Fundamentals Bab 1", "python>=3.8")
    report["results"].append(res1)

    # -------------------------------------------------------------------------
    # TEST 2: Machine Learning Bab 6 - Polynomial Bias-Variance Analysis
    # -------------------------------------------------------------------------
    code_2 = """import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

housing = fetch_california_housing(as_frame=True)
X = housing.data[["MedInc"]].values
y = housing.target.values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

for deg in [1, 3, 15]:
    pipe = Pipeline([
        ("poly", PolynomialFeatures(degree=deg, include_bias=False)),
        ("scaler", StandardScaler()),
        ("reg", LinearRegression())
    ])
    pipe.fit(X_train, y_train)
    pred_te = pipe.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, pred_te))
    r2 = r2_score(y_test, pred_te)
    print(f"Degree {deg:2d} -> Test RMSE: {rmse:.4f} | Test R2: {r2:.4f}")"""

    expected_2 = """Degree  1 -> Test RMSE: 0.8421 | Test R2: 0.4589
Degree  3 -> Test RMSE: 0.8356 | Test R2: 0.4671
Degree 15 -> Test RMSE: 0.8322 | Test R2: 0.4714"""

    res2 = execute_snippet("polynomial_bias_variance.py", code_2, expected_2, "Machine Learning Bab 6.1", "scikit-learn>=1.4, numpy>=1.26")
    report["results"].append(res2)

    # -------------------------------------------------------------------------
    # TEST 3: Machine Learning Bab 6 - Lasso L1 Feature Sparsity
    # -------------------------------------------------------------------------
    code_3 = """import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Lasso
from sklearn.metrics import mean_squared_error, r2_score

housing = fetch_california_housing(as_frame=True)
X, y = housing.data, housing.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

lasso_pipe = Pipeline([
    ("poly", PolynomialFeatures(degree=3, include_bias=False)),
    ("scaler", StandardScaler()),
    ("lasso", Lasso(alpha=0.05, random_state=42, max_iter=2000))
])

lasso_pipe.fit(X_train, y_train)
y_pred = lasso_pipe.predict(X_test)
coefs = lasso_pipe.named_steps["lasso"].coef_
zero_count = np.sum(coefs == 0)

print(f"Total Fitur: {len(coefs)}")
print(f"Fitur Dieliminasi (Bobot Tepat 0): {zero_count}/{len(coefs)}")
print(f"Test RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")
print(f"Test R2: {r2_score(y_test, y_pred):.4f}")"""

    expected_3 = """Total Fitur: 164
Fitur Dieliminasi (Bobot Tepat 0): 156/164
Test RMSE: 0.7893
Test R2: 0.5245"""

    res3 = execute_snippet("lasso_feature_sparsity.py", code_3, expected_3, "Machine Learning Bab 6.2", "scikit-learn>=1.4, numpy>=1.26")
    report["results"].append(res3)

    return report

def execute_snippet(filename, code, expected, chapter_ref, deps):
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    redirected_out = io.StringIO()
    redirected_err = io.StringIO()
    sys.stdout = redirected_out
    sys.stderr = redirected_err

    t0 = time.time()
    exit_code = 0
    error_msg = ""
    actual_out = ""

    try:
        exec_globals = {}
        exec(code, exec_globals)
        actual_out = redirected_out.getvalue().strip()
    except Exception as e:
        exit_code = 1
        error_msg = str(e)
    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr

    elapsed_ms = round((time.time() - t0) * 1000, 2)
    normalized_actual = actual_out.replace("\r\n", "\n").strip()
    normalized_expected = expected.replace("\r\n", "\n").strip()
    output_matches = (normalized_actual == normalized_expected)

    # Data leakage check
    has_leakage = False
    if "train_test_split" in code:
        split_pos = code.find("train_test_split")
        fit_pos = code.find(".fit(")
        if fit_pos != -1 and fit_pos < split_pos:
            has_leakage = True

    status = "EXECUTED_PASS" if (exit_code == 0 and output_matches and not has_leakage) else "EXECUTED_FAIL"

    return {
        "filename": filename,
        "chapter": chapter_ref,
        "status": status,
        "exit_code": exit_code,
        "runtime_ms": elapsed_ms,
        "dependencies": deps,
        "output_matches": output_matches,
        "data_leakage_detected": has_leakage,
        "actual_output": actual_out,
        "expected_output": expected,
        "error": error_msg
    }

if __name__ == "__main__":
    rep = run_pilot_verification()
    output_path = os.path.join(os.path.dirname(__file__), "../../docs/curriculum-rework/pilot-code-execution-evidence.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(rep, f, indent=2)
    print(json.dumps(rep, indent=2))
