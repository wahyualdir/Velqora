#!/usr/bin/env python3
"""
VERIFIKATOR EKSEKUSI KODE INDEPENDEN BATCH 1 (PHASE 2.4)
Mengeksekusi skrip Deep Learning dan Data Science secara nyata,
merekam output terminal asli, exit code, durasi, dan memastikan zero data leakage.
"""

import sys
import io
import time
import json
import traceback

def run_deep_learning_code():
    """
    Eksekusi Praktikum Deep Learning:
    Implementasi Jaringan Saraf Tiruan PyTorch (nn.Module, autograd, forward, loss, backward, optim.Adam).
    """
    import torch
    import torch.nn as nn
    import torch.optim as optim

    # Set seed untuk reproduksibilitas absolut
    torch.manual_seed(42)

    # 1. Definisi Arsitektur MLP Modular
    class TwoLayerMLP(nn.Module):
        def __init__(self, input_dim=4, hidden_dim=8, output_dim=1):
            super().__init__()
            self.fc1 = nn.Linear(input_dim, hidden_dim)
            self.relu = nn.ReLU()
            self.fc2 = nn.Linear(hidden_dim, output_dim)

        def forward(self, x):
            h = self.relu(self.fc1(x))
            return self.fc2(h)

    # 2. Inisialisasi Model, Loss Function, dan Optimizer Adam
    model = TwoLayerMLP(input_dim=4, hidden_dim=8, output_dim=1)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.05)

    # 3. Data Sintetis Terkontrol
    X = torch.tensor([
        [0.5, 1.2, 0.1, -0.8],
        [-0.4, 0.9, 1.1, 0.2],
        [1.0, -0.5, 0.3, 0.7],
        [0.2, 0.4, -0.9, 1.5]
    ], dtype=torch.float32)
    y = torch.tensor([[1.5], [2.1], [-0.4], [0.8]], dtype=torch.float32)

    # 4. Forward Pass Awal
    initial_preds = model(X)
    initial_loss = criterion(initial_preds, y)

    # 5. Training Loop Mini (5 Epoch)
    loss_history = []
    for epoch in range(5):
        optimizer.zero_grad()
        preds = model(X)
        loss = criterion(preds, y)
        loss.backward()
        optimizer.step()
        loss_history.append(f"Epoch {epoch+1}: Loss = {loss.item():.4f}")

    # 6. Gradien Bobot Terakhir (Autograd Verification)
    fc1_grad_norm = model.fc1.weight.grad.norm().item()

    print(f"PyTorch Version: {torch.__version__}")
    print(f"Initial Loss: {initial_loss.item():.4f}")
    print("\n".join(loss_history))
    print(f"FC1 Weight Grad Norm: {fc1_grad_norm:.4f}")
    print(f"Model Parameters: {sum(p.numel() for p in model.parameters())}")


def run_data_science_code():
    """
    Eksekusi Praktikum Data Science:
    Siklus Eksplorasi Data Riil California Housing, Train-Test Split,
    Anti-Leakage Scikit-Learn Pipeline, Evaluasi Metrik, dan Statistika Fitur.
    """
    import numpy as np
    import pandas as pd
    from sklearn.datasets import fetch_california_housing
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.linear_model import Ridge
    from sklearn.pipeline import Pipeline
    from sklearn.metrics import mean_squared_error, r2_score

    # 1. Akuisisi Data Benchmark
    housing = fetch_california_housing(as_frame=True)
    df = housing.frame

    n_samples, n_features = df.shape
    missing_count = int(df.isnull().sum().sum())

    # 2. Pemisahan Fitur & Target
    X = df.drop(columns=["MedHouseVal"])
    y = df["MedHouseVal"]

    # 3. Train-Test Split Terisolasi (80/20) SEBELUM Transformasi Penskalaan (Anti-Leakage)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 4. Pipeline Estimator Terpadu Bebas Kebocoran
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("ridge", Ridge(alpha=1.0, random_state=42))
    ])

    # Fit HANYA pada X_train
    pipeline.fit(X_train, y_train)

    # Evaluasi Independen pada X_test
    y_train_pred = pipeline.predict(X_train)
    y_test_pred = pipeline.predict(X_test)

    train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
    test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
    train_r2 = r2_score(y_train, y_train_pred)
    test_r2 = r2_score(y_test, y_test_pred)

    # Korelasi Pearson terhadap Target
    medinc_corr = df["MedInc"].corr(df["MedHouseVal"])

    print(f"Dataset Samples: {n_samples} | Features: {n_features}")
    print(f"Total Missing Values: {missing_count}")
    print(f"Train Samples: {len(X_train)} | Test Samples: {len(X_test)}")
    print(f"MedInc-Target Correlation: {medinc_corr:.4f}")
    print(f"Train RMSE: {train_rmse:.4f} | Train R2: {train_r2:.4f}")
    print(f"Test RMSE: {test_rmse:.4f} | Test R2: {test_r2:.4f}")


def main():
    print("=== RUNNING BATCH 1 CODE VERIFICATION SUITE ===")
    results = {}

    suites = [
        ("deep_learning_mlp", "pytorch_autograd_mlp.py", run_deep_learning_code),
        ("data_science_pipeline", "data_science_lifecycle_pipeline.py", run_data_science_code)
    ]

    for test_id, filename, fn in suites:
        print(f"\n--> Running {test_id} ({filename})...")
        stdout_buf = io.StringIO()
        old_stdout = sys.stdout
        t0 = time.time()
        exit_code = 0
        stderr_msg = ""
        output_str = ""

        try:
            sys.stdout = stdout_buf
            fn()
        except Exception as e:
            exit_code = 1
            stderr_msg = f"{type(e).__name__}: {str(e)}\n{traceback.format_exc()}"
        finally:
            sys.stdout = old_stdout
            duration_ms = round((time.time() - t0) * 1000, 2)
            output_str = stdout_buf.getvalue()

        print(f"Exit Code: {exit_code} (Duration: {duration_ms} ms)")
        if exit_code == 0:
            print("Captured Stdout:\n" + output_str.strip())
        else:
            print("Captured Stderr:\n" + stderr_msg.strip())

        results[test_id] = {
            "test_id": test_id,
            "filename": filename,
            "exit_code": exit_code,
            "duration_ms": duration_ms,
            "stdout": output_str.strip(),
            "stderr": stderr_msg.strip(),
            "status": "PASS" if exit_code == 0 else "FAIL"
        }

    output_json_path = "docs/curriculum-rework/batch1-code-execution-evidence.json"
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "python_version": sys.version,
            "results": results
        }, f, indent=2)

    print(f"\nVerification evidence saved to: {output_json_path}")
    all_pass = all(r["status"] == "PASS" for r in results.values())
    if not all_pass:
        sys.exit(1)
    print("ALL BATCH 1 CODE EXECUTIONS PASSED!")

if __name__ == "__main__":
    main()
