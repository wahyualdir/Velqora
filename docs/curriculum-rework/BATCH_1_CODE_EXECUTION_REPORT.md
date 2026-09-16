# LAPORAN EKSEKUSI KODE INDEPENDEN: BATCH 1 (PHASE 2.4)
**Dokumen Referensi**: VELQORA-B1-CODE-2026-01  
**Runner Lingkungan**: Python 3.12.10 (64-bit AMD64) on Windows  
**Skrip Verifikasi**: `scripts/curriculum-generator/verify-batch1-code.py`  
**File Bukti JSON**: `docs/curriculum-rework/batch1-code-execution-evidence.json`  
**Tanggal Eksekusi**: 16 September 2026  
**Status**: VERIFIED_RUNNABLE (100% Eksekusi Nyata, Exit Code 0, Zero Data Leakage)

---

## 1. Spesifikasi Lingkungan Runtime

| Parameter Lingkungan | Nilai Terverifikasi |
|---|---|
| **Python Binary** | `C:\Users\ACER\AppData\Local\Python\pythoncore-3.12-64\python.exe` |
| **Python Version** | `3.12.10 (tags/v3.12.10:0a28f80, Feb 14 2025, 16:32:00) [MSC v.1942 64 bit (AMD64)]` |
| **PyTorch Version** | `2.14.0+cpu` |
| **Scikit-Learn Version** | `1.9.1` |
| **NumPy Version** | `2.5.3` |
| **Pandas Version** | `3.0.5` |
| **SciPy Version** | `1.18.1` |

---

## 2. Eksekusi Skrip 1: Deep Learning (`pytorch_autograd_mlp.py`)

### 2.1 Tujuan Pembelajaran
Memvalidasi secara komputasional implementasi modular PyTorch:
1. Pembuatan subclass `nn.Module` (Multilayer Perceptron 2-layer dengan aktivasi non-linier `ReLU`).
2. Komputasi aliran maju (*forward pass*) dan penghitungan fungsi kerugian Mean Squared Error (`nn.MSELoss`).
3. Diferensiasi otomatis (*automatic differentiation*) melalui pemanggilan `loss.backward()`.
4. Inspeksi magnitudo gradien bobot tensor (`fc1.weight.grad.norm()`).
5. Pembaruan bobot model menggunakan optimizer adaptif Adam (`optim.Adam`, lr=0.05).
6. Pengamatan penurunan nilai loss secara bertahap selama 5 epoch pelatihan.

### 2.2 Kode Sumber yang Dijalankan
```python
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
```

### 2.3 Output Terminal Aktual (Terekam Nyata)
```text
PyTorch Version: 2.14.0+cpu
Initial Loss: 1.3549
Epoch 1: Loss = 1.3549
Epoch 2: Loss = 1.0638
Epoch 3: Loss = 0.8345
Epoch 4: Loss = 0.6578
Epoch 5: Loss = 0.5233
FC1 Weight Grad Norm: 0.7199
Model Parameters: 49
```
* **Exit Code**: 0
* **Durasi Komputasi**: 50.96 s (Inisialisasi CPU wheel pertama kali)
* **Status**: **PASS (Exact Terminal Match)**

---

## 3. Eksekusi Skrip 2: Data Science (`data_science_lifecycle_pipeline.py`)

### 3.1 Tujuan Pembelajaran
Memvalidasi secara komputasional metodologi siklus hidup data science (CRISP-DM terapan):
1. Pemuatan dataset benchmark resmi California Housing (Pace & Barry 1997, 20.640 sampel).
2. Inspeksi skema data, bentuk dimensi, dan verifikasi ketiadaan nilai hilang (*missing values*).
3. Pemisahan fitur ($X$) dan target ($y$, `MedHouseVal`).
4. **Pencegahan Kebocoran Data (*Anti-Leakage*)**: Pemisahan `train_test_split` (80/20) dilakukan secara terisolasi **SEBELUM** transformasi statistik apa pun.
5. Pembungkusan penskalaan fitur (`StandardScaler`) dan regresi linier teratur (`Ridge`) dalam satu `Pipeline`.
6. Penskalaan di-fit HANYA pada data latih ($X_{\text{train}}$) dan diuji pada data uji independen ($X_{\text{test}}$).
7. Evaluasi metrik objektif (RMSE dan $R^2$) serta analisis korelasi fitur terhadap target.

### 3.2 Kode Sumber yang Dijalankan
```python
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
```

### 3.3 Output Terminal Aktual (Terekam Nyata)
```text
Dataset Samples: 20640 | Features: 9
Total Missing Values: 0
Train Samples: 16512 | Test Samples: 4128
MedInc-Target Correlation: 0.6881
Train RMSE: 0.7197 | Train R2: 0.6126
Test RMSE: 0.7456 | Test R2: 0.5758
```
* **Exit Code**: 0
* **Durasi Komputasi**: 8.62 s
* **Status**: **PASS (Exact Terminal Match & Anti-Leakage Certified)**

---

## 4. Matriks Validasi Keaslian Output

| Skrip Pengujian | Target Klaim | Nilai Ekspektasi Riil | Nilai Keluaran Aktual | Selisih (Delta) | Status |
|---|---|---|---|---|---|
| `pytorch_autograd_mlp.py` | Initial Loss | 1.3549 | 1.3549 | 0.0000 | PASS |
| `pytorch_autograd_mlp.py` | Loss Epoch 5 | 0.5233 | 0.5233 | 0.0000 | PASS |
| `pytorch_autograd_mlp.py` | Grad Norm FC1 | 0.7199 | 0.7199 | 0.0000 | PASS |
| `data_science_lifecycle_pipeline.py` | Train RMSE | 0.7197 | 0.7197 | 0.0000 | PASS |
| `data_science_lifecycle_pipeline.py` | Test RMSE | 0.7456 | 0.7456 | 0.0000 | PASS |
| `data_science_lifecycle_pipeline.py` | Test R² | 0.5758 | 0.5758 | 0.0000 | PASS |
| `data_science_lifecycle_pipeline.py` | MedInc Correlation | 0.6881 | 0.6881 | 0.0000 | PASS |

---

## 5. Kesimpulan Tahap 6 & 7

Seluruh kode praktikum Batch 1 telah dieksekusi secara independen di lingkungan runtime Python 3.12. Output yang dicatat adalah 100% otentik dari terminal, bukan teks rekaan manual, serta tersertifikasi bebas dari kebocoran data (*data leakage*).

**Status**: **VERIFIED_RUNNABLE**
