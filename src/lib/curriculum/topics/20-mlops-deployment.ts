import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: MLOPS & AI DEPLOYMENT (TOPIK 20) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Sculley, D., et al. (2015). Hidden Technical Debt in Machine Learning Systems. NeurIPS.
 * - Huyen, C. (2022). Designing Machine Learning Systems. O'Reilly Media.
 * - Kreuzberger, D., Kühl, N., & Hirschl, S. (2023). Machine Learning Operations (MLOps): Overview, Definition, and Architecture. IEEE Access.
 * - Zaharia, M., et al. (2018). Accelerating the Machine Learning Lifecycle with MLflow. IEEE Data Eng. Bull.
 */
export const mlopsDeploymentCurriculum: AcademicCurriculum = {
  id: "mlops-deployment",
  slug: "mlops-ai-deployment",
  title: "MLOps & AI Deployment",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Siklus hidup operasional sistem machine learning produksi: pelacakan eksperimen dan model registry (MLflow), pembungkusan microservice kontainer (Docker & FastAPI), strategi deployment minim-downtime (Canary, Blue-Green, Shadow), arsitektur Feature Store (Feast), pemantauan berkelanjutan Data Drift & Concept Drift (Kolmogorov-Smirnov & Population Stability Index), serta pipa CI/CD/CT terotomasi.",
  estimatedHours: 58,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Hidden Technical Debt in Machine Learning Systems",
      authors: ["D. Sculley", "Gary Holt", "Daniel Golovin", "Eugene Davydov", "Todd Phillips", "Dietmar Ebner", "Vinay Chaudhary", "Michael Young", "Jean-François Crespo", "Dan Dennison"],
      type: "paper",
      url: "https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems.pdf",
      relevance: "Makalah seminal Google yang mendokumentasikan bahwa kode ML hanya sebagian kecil (<5%) dari keseluruhan ekosistem infrastruktur produksi.",
      year: 2015,
      publisherOrVenue: "NeurIPS 2015",
    },
    {
      title: "Designing Machine Learning Systems",
      authors: ["Chip Huyen"],
      type: "book",
      url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",
      relevance: "Rujukan kanonikal arsitektur feature store, monitoring drift, continual learning, dan latency engineering.",
      year: 2022,
      publisherOrVenue: "O'Reilly Media",
    },
    {
      title: "Machine Learning Operations (MLOps): Overview, Definition, and Architecture",
      authors: ["Dominik Kreuzberger", "Niklas Kühl", "Sebastian Hirschl"],
      type: "paper",
      url: "https://ieeexplore.ieee.org/document/10041989",
      doi: "10.1109/ACCESS.2023.3249292",
      relevance: "Survei komprehensif taksonomi prinsip MLOps, tingkat kematangan (Level 0-2), dan arsitektur pipa.",
      year: 2023,
      publisherOrVenue: "IEEE Access",
    },
  ],
  chapters: [
    {
      id: "mlp-bab-1",
      slug: "pelacakan-eksperimen-dan-model-registry",
      title: "BAB 1: Pelacakan Eksperimen & Registry Model Produksi (MLflow)",
      orderIndex: 1,
      description: "Pencatatan parameter, metrik, artefak biner model, transisi status model (Staging, Production, Archived), penegakan skema model signature, dan reproduktibilitas.",
      subchapters: [
        {
          id: "mlp-bab-1-1",
          slug: "mlflow-tracking-dan-lifecycle",
          title: "1.1. Arsitektur MLflow: Tracking Server, Artifact Store, dan Registry",
          orderIndex: 1,
          description: "Mencegah hilangnya konfigurasi model dengan versioning otomatis artefak bobot dan reproducibility tracking.",
          content_markdown: `# 1.1. Arsitektur MLflow: Tracking Server, Artifact Store, dan Registry

## 1. Beban Utang Teknis Sistem ML (Sculley et al., 2015)
Dalam sistem Machine Learning produksi, kode algoritma pemodelan (*ML code*) hanya mencakup kurang dari 5% total basis kode. Sisanya didominasi oleh:
- Manajemen konfigurasi (*Configuration*).
- Verifikasi dan pembersihan data (*Data Verification*).
- Pengekstraksian fitur (*Feature Extraction*).
- Pemantauan degradasi (*Monitoring*).
- Pengelolaan sumber daya komputasi (*Resource Management*).

## 2. Tiga Komponen Utama MLflow
1. **MLflow Tracking**: Backend database relasional (PostgreSQL/MySQL) untuk mencatat hyperparameter, metrik evaluasi per epoch, dan metadata run.
2. **Artifact Store**: Object storage (AWS S3, GCS, MinIO) untuk menyimpan file model biner yang telah di-*serialize* (pickle, ONNX, TorchScript).
3. **MLflow Model Registry**: Antarmuka terpusat untuk mengelola siklus hidup versi model:
   $$\\text{Candidate} \\longrightarrow \\text{Staging} \\xrightarrow{\\text{A/B & Validation Gate}} \\text{Production} \\longrightarrow \\text{Archived}$$
`,
        },
      ],
    },
    {
      id: "mlp-bab-2",
      slug: "kontainerisasi-dan-microservice-fastapi",
      title: "BAB 2: Kontainerisasi Microservice & Pengemasan Model (Docker & FastAPI)",
      orderIndex: 2,
      description: "Membangun layanan inferensi berkinerja tinggi: Docker multi-stage builds berbobot ringan, non-root security, endpoint asinkron FastAPI, validasi kontrak Pydantic, dan runtime ONNX.",
      subchapters: [
        {
          id: "mlp-bab-2-1",
          slug: "arsitektur-fastapi-dan-dockerfile",
          title: "2.1. Arsitektur Inferensi FastAPI & Praktik Terbaik Docker Multi-Stage",
          orderIndex: 1,
          description: "Mereduksi ukuran image kontainer dari 4 GB ke 300 MB dan menangani kueri inferensi konkurensi tinggi.",
          content_markdown: `# 2.1. Arsitektur Inferensi FastAPI & Praktik Terbaik Docker Multi-Stage

## 1. Mengapa Multi-Stage Dockerfile?
Membangun image dengan compiler CUDA dan dependensi build menghasilkan image berukuran $>4\\text{ GB}$ yang lambat ditarik (*cold start*). Docker Multi-Stage memisahkan tahap kompilasi dan tahap runtime:

\`\`\`dockerfile
# Stage 1: Builder
FROM python:3.11-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Minimal Runtime
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY src/ /app/src/
ENV PATH=/root/.local/bin:$PATH
USER 10001:10001
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
\`\`\`

## 2. Validasi Kontrak Data Menggunakan Pydantic
Mencegah input data rusak yang dapat menyebabkan error tak terduga (*500 Internal Server Error*) dengan validasi skema bertipe kuat.
`,
        },
      ],
    },
    {
      id: "mlp-bab-3",
      slug: "strategi-deployment-dan-kubernetes",
      title: "BAB 3: Strategi Deployment Produksi & Orkestrasi Kubernetes",
      orderIndex: 3,
      description: "Metodologi perilisan tanpa downtime: Blue-Green Deployment, Canary Release dengan pembagian lalu lintas (Traffic Splitting), Shadow Deployment, dan Horizontal Pod Autoscaling (HPA).",
      subchapters: [
        {
          id: "mlp-bab-3-1",
          slug: "canary-release-dan-shadow-deployment",
          title: "3.1. Pola Canary Release vs Shadow Deployment & Skalabilitas Pod",
          orderIndex: 1,
          description: "Menguji keandalan model baru pada 5% lalu lintas nyata sebelum migrasi penuh dan teknik penggandaan request non-intrusif.",
          content_markdown: `# 3.1. Pola Canary Release vs Shadow Deployment & Skalabilitas Pod

## 1. Perbandingan Strategi Deployment
| Strategi | Mekanisme | Kelebihan | Risiko / Kekurangan |
| :--- | :--- | :--- | :--- |
| **Blue-Green** | Dua lingkungan identik (Blue=Aktif, Green=Baru). Switch router seketika. | Rollback instan ($<1\\text{ detik}$). | Memerlukan sumber daya infrastruktur 2x lipat. |
| **Canary** | Mengarahkan 5% lalu lintas ke model baru, 95% ke model stabil lama. | Mendeteksi bug pada dampak pengguna minimal. | Memerlukan router pintar (Istio / Envoy proxy). |
| **Shadow** | Menduplikasi (*mirroring*) 100% request nyata ke model baru tanpa mengembalikan hasilnya ke pengguna. | Menguji latensi & akurasi pada skala penuh tanpa risiko bisnis. | Beban komputasi ganda; tidak cocok untuk mutasi data. |

## 2. Horizontal Pod Autoscaler (HPA) Kubernetes
Menyesuaikan jumlah replika pod inferensi secara otomatis berdasarkan metrik pemanfaatan GPU/CPU atau throughput kueri:
$$\\text{Target Replicas} = \\left\\lceil \\text{Current Replicas} \\times \\frac{\\text{Current Metric Value}}{\\text{Target Metric Value}} \\right\\rceil$$
`,
        },
      ],
    },
    {
      id: "mlp-bab-4",
      slug: "pemantauan-data-drift-dan-concept-drift",
      title: "BAB 4: Pemantauan Berkelanjutan: Data Drift & Concept Drift",
      orderIndex: 4,
      description: "Mendeteksi degradasi performa model di produksi: perbedaan distribusi input $P(X)$ (Data Drift), perubahan relasi target $P(Y|X)$ (Concept Drift), uji Kolmogorov-Smirnov, dan Population Stability Index (PSI).",
      subchapters: [
        {
          id: "mlp-bab-4-1",
          slug: "matematika-psi-dan-uji-ks",
          title: "4.1. Formulasi Matematika Population Stability Index (PSI) & Uji KS",
          orderIndex: 1,
          description: "Kuantifikasi pergeseran distribusi populasi referensi vs aktual, dan penentuan ambang batas intervensi retrain model.",
          content_markdown: `# 4.1. Formulasi Matematika Population Stability Index (PSI) & Uji KS

## 1. Taksonomi Pergeseran Distribusi (Drift)
- **Data Drift (Covariate Shift)**: Distribusi fitur input berubah:
  $$P_{\\text{train}}(X) \\neq P_{\\text{prod}}(X), \\quad \\text{namun } P(Y \\mid X) \\text{ tetap konstan}$$
- **Concept Drift**: Hubungan fungsional antara fitur dan target berubah:
  $$P_{\\text{train}}(Y \\mid X) \\neq P_{\\text{prod}}(Y \\mid X)$$
- **Prior Probability Shift**: Distribusi label target berubah: $P_{\\text{train}}(Y) \\neq P_{\\text{prod}}(Y)$.

## 2. Formulasi Population Stability Index (PSI)
Membagi rentang fitur kontinu menjadi $B$ bin kuantil seragam (biasanya $B = 10$). Diberikan proporsi aktual di produksi $A_i$ dan proporsi yang diharapkan dari data latih $E_i$:

$$\\text{PSI} = \\sum_{i=1}^B (A_i - E_i) \\times \\ln\\left( \\frac{A_i}{E_i} \\right)$$

### Aturan Intervensi Standar Industri
- $\\text{PSI} < 0.10$: **Stabil** (Tidak ada pergeseran signifikan).
- $0.10 \\le \\text{PSI} < 0.25$: **Moderate Drift** (Perlu pemantauan intensif).
- $\\text{PSI} \\ge 0.25$: **Significant Drift** (Wajib memicu pelatihan ulang / *automated retraining*).

## 3. Uji Kolmogorov-Smirnov Dua Sampel (KS-Test)
Mengukur jarak supremum absolut antara dua fungsi distribusi kumulatif empiris (ECDF):
$$D = \\sup_x |F_1(x) - F_2(x)|$$
Jika nilai $p$-value $< 0.05$, hipotesis bahwa kedua sampel berasal dari distribusi yang sama ditolak.
`,
        },
      ],
    },
    {
      id: "mlp-bab-5",
      slug: "arsitektur-feature-store-feast",
      title: "BAB 5: Arsitektur Feature Store & Konsistensi Pelatihan-Inferensi",
      orderIndex: 5,
      description: "Mencegah duplikasi rekayasa fitur dan kebocoran waktu: pemisahan Online Feature Store berlatensi rendah (Redis) vs Offline Feature Store (Parquet/BigQuery), serta Time-Travel Point-in-Time Joins.",
      subchapters: [
        {
          id: "mlp-bab-5-1",
          slug: "online-vs-offline-store-dan-point-in-time",
          title: "5.1. Dual-Storage Engine & Point-in-Time Joins (Feast)",
          orderIndex: 1,
          description: "Menghindari training-serving skew dengan merekonstruksi nilai fitur persis pada stempel waktu terjadinya peristiwa masa lalu.",
          content_markdown: `# 5.1. Dual-Storage Engine & Point-in-Time Joins (Feast)

## 1. Problem Training-Serving Skew
Kondisi di mana representasi fitur yang digunakan saat pelatihan berbeda secara halus dari fitur yang dihitung saat inferensi real-time. Misalnya: tim analitik menghitung \`user_avg_spend\` menggunakan query SQL batch, sementara tim backend menghitungnya menggunakan rumus Python yang berbeda di microservice.

## 2. Arsitektur Dua Lapisan Feature Store
1. **Offline Store (Warehouse / Lakehouse)**:
   - Menyimpan seluruh data historis fitur (bulanan/tahunan).
   - Dioptimalkan untuk kueri agregasi throughput tinggi pada pelatihan model batch.
2. **Online Store (In-Memory Key-Value DB seperti Redis)**:
   - Menyimpan hanya nilai fitur **paling mutakhir** untuk setiap entitas.
   - Dioptimalkan untuk pembacaan dengan latensi sub-milidetik ($< 2\\text{ ms}$) saat pengguna meminta rekomendasi.

## 3. Point-in-Time Join (Time-Travel)
Mencegah kebocoran masa depan saat menghasilkan dataset latih: untuk setiap label transaksi di waktu $t_{\\text{event}}$, Feature Store hanya menggabungkan fitur yang memiliki stempel waktu valid $t_{\\text{feature}} \\le t_{\\text{event}}$.
`,
        },
      ],
    },
    {
      id: "mlp-bab-6",
      slug: "pipa-cicd-dan-continuous-training",
      title: "BAB 6: Otomasi Pipa CI/CD & Pelatihan Berkelanjutan (CT)",
      orderIndex: 6,
      description: "Pematangan MLOps Level 2: integrasi berkelanjutan kode & data, pengujian model otomatis terhadap baseline produksi, deteksi degradasi, dan pemicu pelatihan ulang otomatis (Continuous Training).",
      subchapters: [
        {
          id: "mlp-bab-6-1",
          slug: "arsitektur-continuous-training-pipeline",
          title: "6.1. Pipa Continuous Training & Gate Promosi Model Terotomasi",
          orderIndex: 1,
          description: "Membangun alur otomatis dari deteksi drift $\\to$ pemicu Airflow $\\to$ evaluasi model bayangan $\\to$ promosi produksi.",
          content_markdown: `# 6.1. Pipa Continuous Training & Gate Promosi Model Terotomasi

## 1. Tiga Tingkat Kematangan MLOps (Google Cloud Architecture)
- **Level 0 (Manual Process)**: Pelatihan model dilakukan secara manual di Jupyter Notebook; deployment dilakukan via penyerahan file biner.
- **Level 1 (Automated Pipeline)**: Pipa pelatihan otomatis dijalankan saat data baru tiba; validasi data dan model dilakukan secara terprogram.
- **Level 2 (Full CI/CD & CT)**: Pipa pengiriman kode dan pelatihan model terintegrasi penuh. Setiap perubahan kode otomatis memicu pengujian unit, pengujian integrasi, pelatihan model kandidat, dan pengujian perbandingan terhadap model aktif di produksi.

## 2. Gate Promosi Model Otomatis
Model baru hanya dipromosikan ke tahap Canary jika:
1. Akurasi/F1 pada dataset evaluasi terstandarisasi lebih tinggi dari model aktif: $\\text{Metric}_{\\text{new}} > \\text{Metric}_{\\text{prod}} + \\epsilon$.
2. Latensi inferensi P99 di bawah ambang batas toleransi SLA ($< 50\\text{ ms}$).
3. Lolos uji ketahanan keamanan adversarial (*adversarial robustness test*).
`,
        },
      ],
    },
    {
      id: "mlp-bab-7",
      slug: "proyek-deteksi-drift-dan-serving-api",
      title: "BAB 7: Proyek Terapan: Engine Deteksi Drift Data & Microservice Inferensi",
      orderIndex: 7,
      description: "Membangun sistem pemantauan produksi lengkap: implementasi kalkulasi Population Stability Index (PSI) dari nol, uji pergeseran Kolmogorov-Smirnov, dan logging drift.",
      subchapters: [
        {
          id: "mlp-bab-7-1",
          slug: "proyek-akhir-psi-calculator-python",
          title: "7.1. Proyek Akhir: Calculator PSI, Uji KS & Alarm Degradasi Model",
          orderIndex: 1,
          description: "Kode Python mandiri: partisi kuantil, penghitungan formula PSI eksak, uji statistik KS, dan logika pemicu peringatan otomatis.",
          content_markdown: `# 7.1. Proyek Akhir: Calculator PSI, Uji KS & Alarm Degradasi Model

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
import numpy as np
from scipy import stats
from typing import Dict, Any

class ModelDriftMonitor:
    """Engine Pemantauan Pergeseran Distribusi Data Produksi (MLOps)."""
    def __init__(self, reference_data: np.ndarray, num_bins: int = 10):
        self.ref_data = reference_data
        self.num_bins = num_bins
        # Tentukan batas-batas bin kuantil dari data referensi (baseline latih)
        self.quantiles = np.linspace(0, 100, num_bins + 1)
        self.bin_edges = np.percentile(reference_data, self.quantiles)
        # Pastikan batas ekstrem mencakup seluruh kemungkinan
        self.bin_edges[0] = -np.inf
        self.bin_edges[-1] = np.inf

        # Hitung proporsi referensi E_i
        ref_counts, _ = np.histogram(reference_data, bins=self.bin_edges)
        self.expected_props = ref_counts / float(len(reference_data))
        # Hindari pembagian nol dengan epsilon kecil
        self.expected_props = np.maximum(self.expected_props, 1e-6)

    def compute_psi(self, current_data: np.ndarray) -> float:
        """Menghitung skor Population Stability Index (PSI)."""
        curr_counts, _ = np.histogram(current_data, bins=self.bin_edges)
        actual_props = curr_counts / float(len(current_data))
        actual_props = np.maximum(actual_props, 1e-6)

        # Formula PSI: sum((A_i - E_i) * ln(A_i / E_i))
        psi_value = np.sum((actual_props - self.expected_props) * np.log(actual_props / self.expected_props))
        return float(psi_value)

    def evaluate_drift(self, current_data: np.ndarray) -> Dict[str, Any]:
        """Menjalankan evaluasi gabungan PSI dan Kolmogorov-Smirnov Test."""
        psi_val = self.compute_psi(current_data)
        ks_stat, p_val = stats.ks_2samp(self.ref_data, current_data)

        if psi_val < 0.10:
            status = "STABLE"
            action = "No action required."
        elif psi_val < 0.25:
            status = "MODERATE_DRIFT"
            action = "Increase monitoring frequency; inspect upstream data pipelines."
        else:
            status = "SIGNIFICANT_DRIFT"
            action = "TRIGGER_AUTOMATED_RETRAIN: Model retraining pipeline initiated."

        return {
            "psi_score": round(psi_val, 4),
            "ks_statistic": round(float(ks_stat), 4),
            "ks_p_value": float(p_val),
            "drift_status": status,
            "recommended_action": action
        }

# --- Demonstrasi Uji Sistem Pemantauan Drift ---
np.random.seed(42)

# 1. Distribusi Baseline Data Latih (10,000 sampel normal)
baseline_features = np.random.normal(loc=50.0, scale=10.0, size=10000)
monitor = ModelDriftMonitor(baseline_features, num_bins=10)

# Skenario A: Data Produksi Hari ke-1 (Distribusi Identik Normal)
prod_day1 = np.random.normal(loc=50.1, scale=9.9, size=2000)
eval_day1 = monitor.evaluate_drift(prod_day1)

print("=== EVALUASI PRODUKSI HARI KE-1 (NORMAL) ===")
print(f"Skor PSI           : {eval_day1['psi_score']}")
print(f"Status             : {eval_day1['drift_status']}")
print(f"Rekomendasi        : {eval_day1['recommended_action']}")
assert eval_day1["drift_status"] == "STABLE"

# Skenario B: Data Produksi Hari ke-30 (Terjadi Pergeseran Nilai Menuju 62.0)
prod_day30 = np.random.normal(loc=62.0, scale=12.0, size=2000)
eval_day30 = monitor.evaluate_drift(prod_day30)

print("\\n=== EVALUASI PRODUKSI HARI KE-30 (DRIFT DETECTED) ===")
print(f"Skor PSI           : {eval_day30['psi_score']}")
print(f"KS Statistic       : {eval_day30['ks_statistic']}")
print(f"KS P-Value         : {eval_day30['ks_p_value']:.4e}")
print(f"Status             : {eval_day30['drift_status']}")
print(f"Rekomendasi        : {eval_day30['recommended_action']}")

assert eval_day30["psi_score"] >= 0.25, "Pergeseran rata-rata 1.2 sigma harus menghasilkan PSI >= 0.25."
assert eval_day30["drift_status"] == "SIGNIFICANT_DRIFT"
print("=== VERIFIKASI MONITORING MLOPS SUKSES ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Ketepatan Formulasi Matematika PSI (35%)**: Pembagian kuantil referensi yang konsisten dan pencegahan logaritma nol.
- **Integrasi Uji Hipotesis KS-Test (35%)**: Analisis gabungan antara metrik magnitudo (PSI) dan uji signifikansi statistik ($p$-value).
- **Logika Otomasi Keputusan MLOps (15%)**: Pemetaan threshold yang sesuai dengan standar industri.
- **Kerapian & Keterbacaan Kode (15%)**: Struktur kelas berorientasi objek yang siap diintegrasikan ke Prometheus/Grafana.
`,
        },
      ],
    },
  ],
};
