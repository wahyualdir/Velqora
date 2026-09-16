# PILOT CODE EXECUTION REPORT — PHASE 2.3.1

**Auditor**: Senior Machine Learning Engineer & QA Engineer  
**Tanggal**: 16 September 2026  
**Environment**: Python 3.12.10 (AMD64), Scikit-Learn 1.9.1, NumPy 2.5.3, Pandas 3.0.5  
**Artefak Bukti**: [`pilot-code-execution-evidence.json`](file:///c:/Users/ACER/Documents/coba/Koleksi%20Belajar/docs/curriculum-rework/pilot-code-execution-evidence.json)

---

## 1. Executive Summary

Audit ini mengeksekusi secara independen seluruh contoh kode yang terdapat pada materi pilot:
- `reflex_vs_goal_agent.py` (AI Fundamentals Bab 1)
- `polynomial_bias_variance.py` (Machine Learning Bab 6.1)
- `lasso_feature_sparsity.py` (Machine Learning Bab 6.2)

Setiap contoh kode diuji untuk:
1. Kemampuan dieksekusi tanpa error (`exit_code == 0`).
2. Kesesuaian 100% antara *actual stdout* dengan `expectedOutput`.
3. Validasi alur data bebas *data leakage* (pemisahan train-test mendahului proses fitting).
4. Penggunaan modul pipeline resmi `sklearn.pipeline.Pipeline`.
5. Pencatatan *seed* (`random_state=42`) demi reproduksibilitas.

---

## 2. Tabel Hasil Eksekusi Kode Pilot

| No | Berkas Kode | Lokasi Bab / Materi | Status | Exit Code | Runtime | Kecocokan Output | Temuan Data Leakage |
|---|---|---|---|---|---|---|---|
| **1** | `reflex_vs_goal_agent.py` | AI Fundamentals Bab 1.2 | **EXECUTED_PASS** | `0` | < 1 ms | **100% Cocok** | **Tidak Ada** (Simulasi Agen) |
| **2** | `polynomial_bias_variance.py` | Machine Learning Bab 6.1 | **EXECUTED_PASS** | `0` | 5.785 ms | **100% Cocok** | **Zero Leakage** (Fit Train Only) |
| **3** | `lasso_feature_sparsity.py` | Machine Learning Bab 6.2 | **EXECUTED_PASS** | `0` | 18.640 ms | **100% Cocok** | **Zero Leakage** (Pipeline Transform) |

---

## 3. Analisis Forensik Alur Data (Data Flow & Anti-Leakage)

### 3.1 Investigasi Kode `polynomial_bias_variance.py`
```python
# Urutan Operasi yang Terverifikasi:
1. X, y = housing.data[["MedInc"]].values, housing.target.values
2. X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
3. pipe = Pipeline([
       ("poly", PolynomialFeatures(degree=deg, include_bias=False)),
       ("scaler", StandardScaler()),
       ("reg", LinearRegression())
   ])
4. pipe.fit(X_train, y_train)  # <-- HANYA data latih yang dipelajari
5. pred_te = pipe.predict(X_test)  # <-- Transformasi test set menggunakan mean & std train set
```
- **Audit Leakage**: Pemanggilan `train_test_split` terjadi pada baris ke-12, mendahului seluruh pemanggilan `fit()`. Transformasi `StandardScaler` dan `PolynomialFeatures` terisolasi di dalam `Pipeline`, sehingga nilai rata-rata ($\mu$) dan varians ($\sigma^2$) dari test set **tidak pernah bocor** ke dalam parameter model.

### 3.2 Investigasi Kode `lasso_feature_sparsity.py`
```python
# Urutan Operasi yang Terverifikasi:
1. X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
2. lasso_pipe = Pipeline([
       ("poly", PolynomialFeatures(degree=3, include_bias=False)),
       ("scaler", StandardScaler()),
       ("lasso", Lasso(alpha=0.05, random_state=42, max_iter=2000))
   ])
3. lasso_pipe.fit(X_train, y_train)
4. coefs = lasso_pipe.named_steps["lasso"].coef_
5. zero_count = np.sum(coefs == 0)
```
- **Audit Reproduksibilitas**: Parameter `random_state=42` pada `train_test_split` dan `Lasso` menjamin bahwa pembagian data dan urutan optimasi koordinat konvergen secara deterministik.
- **Validasi Nilai Sparsity**: Output aktual konsol:
  ```
  Total Fitur: 164
  Fitur Dieliminasi (Bobot Tepat 0): 156/164
  Test RMSE: 0.7893
  Test R2: 0.5245
  ```
  Nilai ini **100% identik karakter demi karakter** dengan `expectedOutput` pada kurikulum.

---

## 4. Kesimpulan Kepatuhan Mutu Kode

Seluruh contoh kode pada materi pilot:
- **Bukan kode fiktif/pseudocode**.
- **Bebas dari NameError, TypeError, dan missing imports**.
- **Memenuhi standar industri rekayasa data bebas kebocoran (zero data leakage)**.
