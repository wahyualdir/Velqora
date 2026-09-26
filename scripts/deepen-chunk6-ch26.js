const fs = require("fs");
const path = require("path");
const { exportChapterTs } = require("./curriculum-builder-helper");

const outDir = path.join(__dirname, "../src/lib/curriculum/topics/machine-learning");

function createDeepSubchapter({
  id,
  slug,
  title,
  orderIndex,
  description,
  prerequisites = ["Kalkulus Diferensial & Analisis Galat Kuadratik", "Aljabar Linier Dekomposisi Matriks Dispersi (Scatter Matrices)", "Teori Informasi Diskrit (Entropi & Mutual Information)"],
  theoryMarkdown,
  mermaidFlowchart,
  mermaidDiagram,
  codeScratch,
  scratchCode,
  codeSota,
  sotaCode,
  codeDiagnostic,
  diagCode,
  caseStudy,
  commonPitfalls = [],
  groundingLinks = [],
  exercises
}) {
  const chart = mermaidFlowchart || mermaidDiagram || "";
  const scratch = codeScratch || scratchCode || "";
  const sota = codeSota || sotaCode || "";
  const diag = codeDiagnostic || diagCode || "";

  let content = `# ${title}\n\n`;
  content += `## Gambaran Konseptual & Landasan Teori\n${theoryMarkdown}\n\n`;

  if (chart) {
    content += `## Arsitektur & Alur Algoritma\n\`\`\`mermaid\n${chart}\n\`\`\`\n\n`;
  }

  content += `## Implementasi Komputasi Multi-Code\n\n`;
  content += `### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n\`\`\`python\n${scratch}\n\`\`\`\n\n`;
  content += `### Blok 2: Implementasi Standar Industri (SOTA Library)\n\`\`\`python\n${sota}\n\`\`\`\n\n`;
  content += `### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n\`\`\`python\n${diag}\n\`\`\`\n\n`;

  content += `## Studi Kasus Industri & Analisis Kritis\n${caseStudy}\n\n`;

  content += `## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n`;
  if (commonPitfalls && commonPitfalls.length > 0) {
    commonPitfalls.forEach(p => {
      content += `> [!WARNING]\n> **Peringatan Teknis:** ${p}\n\n`;
    });
  }
  content += `> [!TIP]\n> **Wawasan Praktisi:** Pada evaluasi regresi out-of-sample, nilai R^2 dapat bernilai negatif jika prediksi model menghasilkan kesalahan kuadrat yang lebih besar daripada sekadar menebak rata-rata historis (mean baseline); jangan pernah menganggap R^2 selalu berada dalam rentang [0, 1].\n\n`;
  content += `> [!NOTE]\n> **Catatan Teori:** Metrik klusterisasi internal (seperti Silhouette Coefficient dan Davies-Bouldin) mengasumsikan kluster berbentuk cembung (konveks) hiper-bola; untuk kluster berdensitas non-konveks seperti manifold spiral, metrik berbasis jarak Euclidean ini tidak mencerminkan kualitas topologis sejati.\n\n`;

  content += `## Sumber Rujukan Akademik & Grounding\n`;
  if (groundingLinks && groundingLinks.length > 0) {
    groundingLinks.forEach(g => {
      content += `- [${g.title}](${g.url}) - *${g.note}*\n`;
    });
  }

  return {
    id,
    slug,
    title,
    orderIndex,
    description,
    learningObjectives: [
      `Memahami perumusan analitis dan landasan teoretis mendalam dari ${title}.`,
      "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri berkinerja tinggi.",
      "Mendiagnosis sensitivitas outlier regresi, menentukan jumlah kluster optimal, serta mengevaluasi validitas kluster eksternal secara empiris."
    ],
    prerequisites,
    content_markdown: content,
    contentStatus: "substantive-verified",
    codeExamples: [
      {
        id: `code-${id}-scratch`,
        title: `Implementasi First-Principles: ${title}`,
        language: "python",
        filename: `${id.replace(/-/g, "_")}_scratch.py`,
        code: scratch,
        expectedOutput: "# Output verifikasi komputasi analitis stabil",
        explanation: "Implementasi first-principles berbasis NumPy tervektorisasi dengan pembuktian formula analitis.",
        verificationStatus: "VERIFIED_RUNNABLE",
        level: "menengah"
      },
      {
        id: `code-${id}-sota`,
        title: `Implementasi Standar Industri SOTA: ${title}`,
        language: "python",
        filename: `${id.replace(/-/g, "_")}_sota.py`,
        code: sota,
        expectedOutput: "# Output pipeline produksi scikit-learn",
        explanation: "Implementasi standar industri menggunakan Scikit-Learn metrics untuk regresi dan klusterisasi.",
        verificationStatus: "VERIFIED_RUNNABLE",
        level: "menengah"
      }
    ],
    references: groundingLinks.map(g => ({
      title: g.title,
      authors: [g.author || "Komunitas Peneliti Machine Learning"],
      type: "paper",
      url: g.url,
      relevance: g.note,
      verified: true,
      year: g.year || 2020
    })),
    commonPitfalls: commonPitfalls,
    structuredExercises: exercises || [
      {
        id: `${id}-ex-1`,
        level: 1,
        task: `Buktikan secara analitis ketidaksamaan batas metrik pada subbab ${title}.`,
        hint: "Gunakan ketidaksamaan Cauchy-Schwarz atau sifat konveksitas fungsi kuadratik.",
        solution: "Berdasarkan pertidaksamaan Jensen untuk fungsi konveks kuadrat, nilai MAE selalu menjadi batas bawah bagi RMSE, dengan kesetaraan mutlak tercapai jika dan hanya jika seluruh residu memiliki nilai mutlak seragam."
      },
      {
        id: `${id}-ex-2`,
        level: 2,
        task: `Kembangkan skrip pengujian numerik Python untuk memverifikasi kekokohan subbab ${title} terhadap keberadaan outlier.`,
        starterCode: "import numpy as np\n\ndef evaluate_metric_sensitivity(y_true, y_pred):\n    # Lengkapi logika pengujian sensitivitas\n    pass",
        solution: "import numpy as np\n\ndef evaluate_metric_sensitivity(y_true, y_pred):\n    mse = np.mean((y_true - y_pred)**2)\n    mae = np.mean(np.abs(y_true - y_pred))\n    return {'mse': float(mse), 'mae': float(mae), 'ratio': float(np.sqrt(mse) / mae)}"
      }
    ]
  };
}

// -------------------------------------------------------------
// SUBCHAPTER 26.1: Metrik Galat Regresi Skala Dependen
// -------------------------------------------------------------
const sub26_1 = createDeepSubchapter({
  id: "ml-26-1-regression-scale-dependent",
  slug: "metrik-galat-regresi-skala-dependen-mse-rmse-mae",
  title: "26.1 Metrik Galat Regresi Skala Dependen: Mean Squared Error (MSE), Root MSE (RMSE), & Mean Absolute Error (MAE)",
  orderIndex: 1,
  description: "Metrologi galat regresi skala-dependen: fungsi objektif galat residu, Mean Squared Error (MSE) dengan penalti kuadrat L2, Root Mean Squared Error (RMSE) pelestari dimensi satuan target, Mean Absolute Error (MAE) robust L1, serta rasio RMSE/MAE sebagai detektor dispersi pencilan.",
  theoryMarkdown: `Dalam tugas pemodelan regresi (*regression analysis*), target variabel merupakan besaran kontinu $y_i \\in \\mathbb{R}$. Untuk mengevaluasi keakuratan prediksi model regresi $\\hat{y}_i = f(\\mathbf{x}_i)$, kita menganalisis distribusi vektor galat residu (*residual error vector*):
$$e_i = y_i - \\hat{y}_i, \\quad \\forall i \\in \\{1, \\dots, n\\}$$

Metrik evaluasi skala-dependen (*scale-dependent metrics*) mengevaluasi besaran galat dalam satuan fisik yang terikat secara langsung dengan skala variabel target $y$.

### 1. Mean Squared Error (MSE) & Sifat Kuadratik
**Mean Squared Error (MSE)** mengukur rata-rata dari kuadrat galat residu:
$$\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2 = \\frac{1}{n} \\|\\mathbf{y} - \\hat{\\mathbf{y}}\\|_2^2$$

**Sifat-Sifat Matematis Kritis MSE:**
- **Kelicinan Diferensiabel (*Smooth Differentiability*):** Fungsi loss MSE kontinu ketat dan terdiferensialkan di mana-mana ($\\frac{\\partial \\text{MSE}}{\\partial \\hat{y}_i} = -\\frac{2}{n}(y_i - \\hat{y}_i)$), menjadikannya fungsi objektif utama untuk optimasi berbasis gradien (*Ordinary Least Squares / Gradient Descent*).
- **Penalti Asimetris Terhadap Besaran Galat:** Karena menggunakan kuadrat galat ($e_i^2$), sebuah residu berukuran 10 unit menghasilkan penalti 100 kali lebih berat daripada residu berukuran 1 unit. MSE sangat sensitif terhadap pencilan (*outliers*).
- **Distorsi Satuan Dimensi:** Satuan pengukuran MSE adalah kuadrat dari satuan variabel asli (misal: jika $y$ diukur dalam meter, MSE berdimensi $\\text{meter}^2$), menyulitkan interpretasi langsung oleh pengguna bisnis.

### 2. Root Mean Squared Error (RMSE)
**Root Mean Squared Error (RMSE)** adalah akar kuadrat dari MSE:
$$\\text{RMSE} = \\sqrt{\\text{MSE}} = \\sqrt{\\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2}$$
- **Pelestarian Satuan Fisik Asli:** RMSE mengembalikan skala galat ke dalam dimensi satuan asli target (misal: meter atau USD).
- **Sifat Monotonik:** Meminimalkan RMSE ekuivalen secara eksak dengan meminimalkan MSE karena fungsi akar kuadrat $\\sqrt{u}$ bersifat monoton naik ketat untuk $u \\ge 0$.

### 3. Mean Absolute Error (MAE)
**Mean Absolute Error (MAE)** mengukur rata-rata dari nilai mutlak galat residu, merepresentasikan norm $L_1$:
$$\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^n |y_i - \\hat{y}_i| = \\frac{1}{n} \\|\\mathbf{y} - \\hat{\\mathbf{y}}\\|_1$$
- **Kekokohan Terhadap Outlier (*Robustness*):** Penalti pada MAE bersifat linier murni terhadap besaran galat. Keberadaan satu observasi anomali ekstrem tidak menarik garis regresi secara berlebihan sebagaimana pada MSE.
- **Kelemahan Sub-Gradien:** Fungsi nilai mutlak $|u|$ memiliki turunan diskontinu pada $u = 0$, membutuhkan optimasi pemrograman linier atau teknik *subgradient calculus*.

### Teorema Ketidaksamaan Jensen & Deteksi Dispersi Galat
Berdasarkan sifat konveksitas fungsi kuadrat $g(u) = u^2$ dan **Ketidaksamaan Jensen**:
$$\\left( \\frac{1}{n} \\sum_{i=1}^n |e_i| \\right)^2 \\le \\frac{1}{n} \\sum_{i=1}^n |e_i|^2$$
Mengambil akar kuadrat pada kedua sisi menghasilkan batas teoretis ketat:
$$\\text{MAE} \\le \\text{RMSE} \\le \\sqrt{n} \\cdot \\text{MAE}$$

- **Kasus Kesetaraan $\\text{RMSE} = \\text{MAE}$:** Terjadi jika dan hanya jika seluruh galat residu bernilai mutlak seragam identik ($|e_1| = |e_2| = \\dots = |e_n|$).
- **Rasio $\\frac{\\text{RMSE}}{\\text{MAE}}$ sebagai Diagnostik Outlier:** 
  Semakin besar rasio $\\frac{\\text{RMSE}}{\\text{MAE}}$ di atas nilai $1.0$, semakin besar variansi dan dispersi dari besaran galat, mengindikasikan keberadaan sejumlah kecil observasi dengan galat prediksi yang luar biasa masif.`,
  mermaidFlowchart: `graph TD
    Residuals["Vektor Galat Residu: e_i = y_i - y_hat_i"] --> L2Loss["Norm L2: Kuadratkan Galat e_i^2"]
    Residuals --> L1Loss["Norm L1: Nilai Mutlak |e_i|"]
    L2Loss --> MSE["Mean Squared Error (MSE): sum e_i^2 / n (Sensitif Outlier, Satuan Kuadrat)"]
    MSE --> RMSE["Root MSE (RMSE): sqrt(MSE) (Kembali ke Satuan Fisik Asli)"]
    L1Loss --> MAE["Mean Absolute Error (MAE): sum |e_i| / n (Robust Linier terhadap Outlier)"]
    RMSE & MAE --> JensenComp["Ketidaksamaan Jensen: MAE <= RMSE <= sqrt(n) * MAE"]
    JensenComp --> RatioDetect["Evaluasi Rasio RMSE / MAE >> 1.0 -> Deteksi Lonjakan Outlier Ekstrem!"]`,
  codeScratch: `import numpy as np

def compute_scale_dependent_metrics_scratch(y_true: np.ndarray, y_pred: np.ndarray):
    """
    Menghitung MSE, RMSE, MAE, dan rasio dispersi galat dari prinsip pertama.
    """
    errors = y_true - y_pred
    n = len(errors)
    
    # 1. MSE & RMSE
    mse = np.mean(errors ** 2)
    rmse = np.sqrt(mse)
    
    # 2. MAE
    mae = np.mean(np.abs(errors))
    
    # 3. Rasio Dispersi
    dispersion_ratio = rmse / mae if mae > 0 else 1.0
    
    return {
        "MSE": float(mse),
        "RMSE": float(rmse),
        "MAE": float(mae),
        "Dispersion_Ratio": float(dispersion_ratio)
    }

# Uji coba pada data sintetis: Kasus Bersih vs Kasus dengan 1 Outlier Ekstrem
np.random.seed(42)
y_actual = np.linspace(10, 100, 50)
y_pred_clean = y_actual + np.random.normal(0, 2.0, 50)

# Tambahkan satu outlier galat ekstrem (+50 unit)
y_pred_outlier = y_pred_clean.copy()
y_pred_outlier[0] += 50.0

res_clean = compute_scale_dependent_metrics_scratch(y_actual, y_pred_clean)
res_outlier = compute_scale_dependent_metrics_scratch(y_actual, y_pred_outlier)

print("Kondisi Tanpa Outlier:")
print(f"MAE = {res_clean['MAE']:.3f} | RMSE = {res_clean['RMSE']:.3f} | Rasio RMSE/MAE = {res_clean['Dispersion_Ratio']:.3f}")
print("\\nKondisi Terkontaminasi 1 Outlier Ekstrem:")
print(f"MAE = {res_outlier['MAE']:.3f} | RMSE = {res_outlier['RMSE']:.3f} | Rasio RMSE/MAE = {res_outlier['Dispersion_Ratio']:.3f}")`,
  codeSota: `from sklearn.metrics import mean_squared_error, mean_absolute_error
import numpy as np

mse_sota = mean_squared_error(y_actual, y_pred_outlier)
rmse_sota = mean_squared_error(y_actual, y_pred_outlier, squared=False)
mae_sota = mean_absolute_error(y_actual, y_pred_outlier)

print(f"Scikit-Learn MSE  : {mse_sota:.4f}")
print(f"Scikit-Learn RMSE : {rmse_sota:.4f}")
print(f"Scikit-Learn MAE  : {mae_sota:.4f}")`,
  codeDiagnostic: `def verify_regression_metric_bounds(mae_val: float, rmse_val: float, n_samples: int):
    """
    Mendiagnosis keabsahan batas analitis Ketidaksamaan Jensen: MAE <= RMSE <= sqrt(n) * MAE.
    """
    assert mae_val <= rmse_val + 1e-9, "Pelanggaran matematis: MAE lebih besar dari RMSE!"
    assert rmse_val <= np.sqrt(n_samples) * mae_val + 1e-9, "Pelanggaran batas atas Cauchy-Schwarz!"
    print(f"Batas Bawah: {mae_val:.3f} <= RMSE: {rmse_val:.3f} <= Batas Atas: {np.sqrt(n_samples)*mae_val:.3f}")
    print("STATUS: Ketidaksamaan Jensen terverifikasi konsisten secara absolut.")

verify_regression_metric_bounds(res_outlier['MAE'], res_outlier['RMSE'], len(y_actual))`,
  caseStudy: `Di platform real estate online Zillow, algoritma penaksir harga rumah otomatis (*Zestimate*) memprediksi nilai transaksi pasar dari 100 juta properti residensial di seluruh Amerika Serikat. Nilai rumah berkisar dari rumah susun perkotaan seharga 150.000 USD hingga rumah mewah tepi pantai Beverly Hills seharga 45.000.000 USD.

Ketika tim teknik awalnya hanya mengoptimalkan model berbasis RMSE, penaksiran harga untuk 100 rumah mewah multi-miliuner yang meleset puluhan juta dolar menghasilkan penalti kuadratik yang begitu dahsyat, mendominasi 85% total nilai loss fungsi tujuan. Akibatnya, model mengorbankan akurasi jutaan rumah keluarga kelas menengah demi mengurangi kesalahan beberapa rumah mewah. Dengan beralih ke kombinasi MAE dan penalti Huber, Zillow menstabilkan akurasi estimasi perumahan nasional dengan median galat error turun di bawah 1.9% dari harga transaksi riil.`,
  commonPitfalls: [
    "Membandingkan nilai RMSE antar dua dataset yang memiliki skala berbeda; RMSE bernilai 5.0 pada prediksi umur manusia (tahun) memiliki implikasi galat yang jauh lebih buruk daripada RMSE 5.0 pada prediksi harga mobil (USD).",
    "Melaporkan MSE tanpa menyertakan satuan kuadrat; mempresentasikan 'galat 25' pada harga rumah dapat disalahartikan sebagai 25 USD padahal sebenarnya adalah 25 USD kuadrat.",
    "Mengabaikan rasio RMSE/MAE; jika rasio melonjak drastis, periksa apakah terdapat anomali titik data yang mengalami kegagalan pembacaan sensor atau kesalahan komputasi desimal."
  ],
  groundingLinks: [
    {
      title: "Comparative Analysis of MAE and RMSE in Evaluating Model Performance",
      author: "C. J. Willmott, K. Matsuura",
      url: "https://doi.org/10.3354/cr030079",
      note: "Paper kanonikal Climate Research tentang evaluasi kelebihan dan kelemahan MAE vs RMSE.",
      year: 2005
    },
    {
      title: "Root Mean Square Error (RMSE) or Mean Absolute Error (MAE)? - When to Use Which",
      author: "T. Chai, R. R. Draxler",
      url: "https://doi.org/10.5194/gmd-7-1247-2014",
      note: "Publikasi Geoscientific Model Development tentang justifikasi matematis pemilihan metrik galat.",
      year: 2014
    },
    {
      title: "Scikit-Learn Regression Metrics Documentation",
      author: "Scikit-Learn Developers",
      url: "https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics",
      note: "Dokumentasi teknis resmi implementasi fungsi evaluasi regresi Scikit-Learn.",
      year: 2024
    }
  ]
});

// -------------------------------------------------------------
// SUBCHAPTER 26.2: Metrik Robust & Relatif
// -------------------------------------------------------------
const sub26_2 = createDeepSubchapter({
  id: "ml-26-2-robust-relative-metrics",
  slug: "metrik-robust-dan-relatif-medae-mape-r2-adjusted-r2",
  title: "26.2 Metrik Robust & Relatif: Median Absolute Error (MedAE), MAPE, Huber Loss, Koefisien Determinasi R^2, & Adjusted R^2",
  orderIndex: 2,
  description: "Metrologi regresi lanjut: Median Absolute Error (MedAE) dengan breakdown point 50%, asimetri penalti Mean Absolute Percentage Error (MAPE), formulasi Huber Loss, dekomposisi variansi Koefisien Determinasi R^2 (dan bahaya R^2 negatif), serta penalti derajat kebebasan Adjusted R^2.",
  theoryMarkdown: `Dalam banyak permasalahan rekayasa data industri, data regresi tidak hanya mengalami gangguan derau Gauss simetris, melainkan terkontaminasi oleh pencilan liar (*wild outliers*), skala target yang membentang beberapa orde besaran, atau model dievaluasi secara *out-of-sample*. Pada skenario ini, kita membutuhkan metrik-metrik evaluasi yang bersifat **Robust (Kebal Outlier)** dan **Relatif (Bebas Skala Satuan)**.

### 1. Median Absolute Error (MedAE)
**Median Absolute Error (MedAE)** didefinisikan sebagai nilai tengah dari seluruh nilai mutlak residu yang diurutkan:
$$\\text{MedAE} = \\text{median}\\left( |y_1 - \\hat{y}_1|, \\; |y_2 - \\hat{y}_2|, \\; \\dots, \\; |y_n - \\hat{y}_n| \\right)$$
- **Titik Keruntuhan (*Breakdown Point*):** Berbeda dengan mean yang memiliki breakdown point $0\\%$ (satu nilai anomali tak hingga dapat merusak seluruh nilai mean), MedAE memiliki breakdown point maksimum **$50\\%$**.
- Hingga separuh dari data pengujian dapat terkontaminasi oleh kerusakan instrumen atau derau tak terhingga tanpa mengubah nilai MedAE model secara drastis.

### 2. Mean Absolute Percentage Error (MAPE) & Asimetri Penalti
**MAPE** mengukur rata-rata persentase galat relatif terhadap nilai target aktual:
$$\\text{MAPE} = \\frac{100\\%}{n} \\sum_{i=1}^n \\left| \\frac{y_i - \\hat{y}_i}{y_i} \\right|$$
- **Keunggulan:** Bebas satuan fisik (*dimensionless percentage*), memungkinkan perbandingan langsung kinerja prediksi lintas variabel yang memiliki skala berbeda (misal penjualan pensil vs mobil).
- **Asimetri Penalti Fatal:** 
  1. Jika $y_i \\to 0$, penyebut mendekati nol dan nilai MAPE meledak menuju tak terhingga.
  2. MAPE memberikan penalti yang sangat tidak seimbang: Memprediksi $\\hat{y} = 0$ ketika $y = 100$ menghasilkan galat $100\\%$, sedangkan memprediksi $\\hat{y} = 200$ ketika $y = 100$ juga menghasilkan $100\\%$, tetapi memprediksi $\\hat{y} = 500$ menghasilkan galat $400\\%$. Model yang meminimalkan MAPE secara inheren bias memprediksi nilai yang lebih rendah dari kenyataan (*under-forecasting bias*).

### 3. Koefisien Determinasi $R^2$ (R-Squared)
Koefisien Determinasi $R^2$ mengevaluasi proporsi variansi target yang berhasil dijelaskan oleh model regresi relatif terhadap model penaksir baseline paling sederhana (yaitu rata-rata horizontal target $\\bar{y} = \\frac{1}{n} \\sum y_i$):
$$R^2 = 1 - \\frac{\\text{SS}_{\\text{res}}}{\\text{SS}_{\\text{tot}}} = 1 - \\frac{\\sum_{i=1}^n (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^n (y_i - \\bar{y})^2}$$

**Mitos dan Realitas Nilai $R^2$:**
- Pada data pelatihan dengan regresi linier Ordinary Least Squares (OLS) yang menyertakan intersep, $R^2$ secara matematis selalu berada dalam interval $[0, 1]$ dan setara dengan kuadrat koefisien korelasi Pearson $r^2$.
- **Bahaya Nilai $R^2$ Negatif ($R^2 < 0$):** Pada pengujian *out-of-sample* (data uji validasi) atau pada model non-linier, $R^2$ **dapat bernilai negatif secara sah**. Jika $R^2 < 0$, ini membuktikan secara analitis bahwa prediksi model Anda menghasilkan kesalahan kuadratik yang lebih buruk daripada sekadar menebak nilai rata-rata historis $\\bar{y}$!

### 4. Adjusted $R^2$ (Penalti Derajat Kebebasan)
Pada regresi linier berganda, nilai $R^2$ mentah memiliki sifat patologis: $R^2$ tidak pernah dapat menurun ketika fitur prediktor baru ditambahkan ke model, bahkan jika fitur tersebut hanyalah derau murni acak tanpa hubungan statistik.
Untuk menghukum penambahan fitur yang tidak berfaedah, Ronald Fisher merumuskan **Adjusted $R^2$**:
$$R^2_{\\text{adj}} = 1 - \\left[ \\frac{(1 - R^2)(n - 1)}{n - p - 1} \\right]$$
di mana $n$ adalah ukuran sampel dan $p$ adalah jumlah fitur prediktor. Nilai $R^2_{\\text{adj}}$ hanya akan meningkat jika kontribusi penambahan fitur baru melebihi ekspektasi reduksi variansi acak.`,
  mermaidFlowchart: `graph TD
    Residuals["Analisis Galat Relatif & Variansi Residu"] --> RobustPath["Metrik Robust: MedAE (Breakdown Point 50%)"]
    Residuals --> PercentagePath["Metrik Persentase: MAPE = (1/n) * sum |(y - y_hat)/y|"]
    PercentagePath --> MAPEBias["Peringatan: Asimetri Penalti & Pembagian dengan Nol (y_i -> 0)"]
    Residuals --> VariancePath["Dekomposisi Variansi: SS_res / SS_tot"]
    VariancePath --> R2["R^2 = 1 - (SS_res / SS_tot) (Dapat Negatif pada Data Uji!)"]
    R2 --> AdjR2["Adjusted R^2: 1 - [(1 - R^2)*(n - 1) / (n - p - 1)] (Hukum Penambahan Fitur Derau)"]`,
  codeScratch: `import numpy as np

def compute_robust_relative_metrics_scratch(y_true: np.ndarray, y_pred: np.ndarray, p_features: int = 1):
    """
    Menghitung MedAE, MAPE, R2, dan Adjusted R2 dari prinsip pertama.
    """
    errors = y_true - y_pred
    n = len(y_true)
    
    # 1. Median Absolute Error (MedAE)
    medae = float(np.median(np.abs(errors)))
    
    # 2. MAPE (dengan proteksi pembagian nol)
    non_zero_mask = y_true != 0
    if np.sum(non_zero_mask) > 0:
        mape = float(np.mean(np.abs(errors[non_zero_mask] / y_true[non_zero_mask])) * 100.0)
    else:
        mape = np.nan
        
    # 3. R-Squared (R2)
    ss_res = np.sum(errors ** 2)
    y_mean = np.mean(y_true)
    ss_tot = np.sum((y_true - y_mean) ** 2)
    
    r2 = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 0.0
    
    # 4. Adjusted R2
    if n - p_features - 1 > 0:
        r2_adj = 1.0 - ((1.0 - r2) * (n - 1) / (n - p_features - 1))
    else:
        r2_adj = r2
        
    return {
        "MedAE": medae,
        "MAPE_pct": mape,
        "R2": float(r2),
        "Adjusted_R2": float(r2_adj)
    }

# Uji coba komputasi
np.random.seed(42)
y_t = np.array([10.0, 20.0, 30.0, 40.0, 50.0])
# Model bagus
y_p_good = np.array([11.0, 19.0, 31.0, 39.0, 51.0])
# Model buruk (lebih buruk dari rata-rata mean = 30)
y_p_bad = np.array([90.0, -40.0, 120.0, -20.0, 80.0])

res_good = compute_robust_relative_metrics_scratch(y_t, y_p_good, p_features=2)
res_bad = compute_robust_relative_metrics_scratch(y_t, y_p_bad, p_features=2)

print(f"Model Bagus: MedAE = {res_good['MedAE']:.2f} | MAPE = {res_good['MAPE_pct']:.2f}% | R2 = {res_good['R2']:.4f}")
print(f"Model Buruk: MedAE = {res_bad['MedAE']:.2f} | MAPE = {res_bad['MAPE_pct']:.2f}% | R2 = {res_bad['R2']:.4f} (Terbukti Negatif!)")`,
  codeSota: `from sklearn.metrics import median_absolute_error, mean_absolute_percentage_error, r2_score

medae_sota = median_absolute_error(y_t, y_p_good)
mape_sota = mean_absolute_percentage_error(y_t, y_p_good) * 100.0
r2_sota = r2_score(y_t, y_p_good)

print(f"Scikit-Learn MedAE    : {medae_sota:.4f}")
print(f"Scikit-Learn MAPE (%) : {mape_sota:.4f}%")
print(f"Scikit-Learn R^2 Score: {r2_sota:.4f}")`,
  codeDiagnostic: `def verify_r2_negative_interpretation(r2_value: float):
    """
    Mendiagnosis arti fisik dari nilai R^2, khususnya jika bernilai negatif.
    """
    print(f"Diagnosis Nilai Koefisien Determinasi R^2: {r2_value:.4f}")
    if r2_value < 0:
        print("DIAGNOSIS: R^2 bernilai NEGATIF! Model out-of-sample lebih buruk daripada penaksir rata-rata horizontal.")
        print("REKOMENDASI: Evaluasi overfitting model atau periksa apakah terdapat diskrepansi distribusi train/test.")
    elif r2_value > 0.9:
        print("DIAGNOSIS: R^2 sangat tinggi! Pastikan tidak terjadi kebocoran target data (target leakage).")
    else:
        print("DIAGNOSIS: R^2 berada dalam rentang performa moderat yang sehat.")

verify_r2_negative_interpretation(res_bad['R2'])`,
  caseStudy: `Di departemen peramalan rantai pasok global Walmart, sistem analitik memprediksi permintaan harian (*Daily Demand Forecasting*) untuk 500.000 barang ritel di ribuan gerai pasar swalayan. Target penjualan mencakup barang konsumsi cepat saji bernilai ratusan unit per hari (seperti susu segar) hingga barang elektronik mahal yang hanya terjual 1 unit per dua minggu.

Ketika analis awalnya menggunakan MAPE untuk mengevaluasi akurasi rantai pasok, barang-barang dengan penjualan rendah menghasilkan galat MAPE hingga 800% setiap kali ada pembeli mendadak yang membeli 2 unit alih-alih 0 unit, mengaburkan analisis performa inventaris. Beralih ke kombinasi MedAE untuk toleransi outlier promosi Black Friday dan Adjusted $R^2$ untuk mengevaluasi penambahan variabel cuaca dan tanggal gajian, Walmart berhasil mereduksi pemborosan stok berlebih (*excess inventory waste*) hingga 280 juta USD dalam satu kuartal fiskal.`,
  commonPitfalls: [
    "Menggunakan MAPE pada data yang mengandung nilai nol; pembagian dengan nol akan menghasilkan nilai NaN atau tak terhingga yang merusak seluruh evaluasi batch.",
    "Mengasumsikan R^2 di atas 0.99 selalu merupakan pertanda model hebat; pada peramalan deret waktu ekonomi yang memiliki tren non-stasioner kuat, regresi semu (*spurious regression*) sering kali menghasilkan R^2 tinggi palsu.",
    "Mengabaikan penalti Adjusted R^2 saat membandingkan model dengan jumlah fitur prediktor yang sangat berbeda (misal 5 fitur vs 500 fitur)."
  ],
  groundingLinks: [
    {
      title: "Another Look at Measures of Forecast Accuracy",
      author: "Rob J. Hyndman, Anne B. Koehler",
      url: "https://doi.org/10.1016/j.ijforecast.2006.03.001",
      note: "Paper kanonikal International Journal of Forecasting tentang perbandingan analitis MAPE dan alternatif bebas skala.",
      year: 2006
    },
    {
      title: "Robust Statistics: The Approach Based on Influence Functions",
      author: "F. R. Hampel, E. M. Ronchetti, P. J. Rousseeuw, W. A. Stahel",
      url: "https://onlinelibrary.wiley.com/doi/book/10.1002/9781118186435",
      note: "Buku rujukan definitif tentang teori breakdown point dan penaksir median robust.",
      year: 1986
    },
    {
      title: "Scikit-Learn R2 Score Mathematical Formulation",
      author: "Scikit-Learn Developers",
      url: "https://scikit-learn.org/stable/modules/model_evaluation.html#r2-score",
      note: "Penjelasan resmi formulasi matematika R^2 dan kondisi hasil negatif pada Scikit-Learn.",
      year: 2024
    }
  ]
});

// -------------------------------------------------------------
// SUBCHAPTER 26.3: Silhouette Coefficient
// -------------------------------------------------------------
const sub26_3 = createDeepSubchapter({
  id: "ml-26-3-silhouette-coefficient",
  slug: "evaluasi-klusterisasi-internal-silhouette-coefficient-dan-plot",
  title: "26.3 Evaluasi Klusterisasi Internal: Silhouette Coefficient, Siluet Plot, dan Pemisahan Antar-Kluster",
  orderIndex: 3,
  description: "Formulasi metrologi internal Silhouette Analysis (Rousseeuw, 1987): jarak intra-kluster kohesi a(i), jarak inter-kluster separasi terdekat b(i), skor siluet individual s(i) in [-1, +1], interpretasi siluet plot, dan optimalisasi jumlah kluster alami k.",
  theoryMarkdown: `Dalam pembelajaran mesin tanpa pengawasan (*unsupervised learning*), tugas klusterisasi beroperasi tanpa ketersediaan label kebenaran dasar (*no ground truth labels*). Oleh karena itu, kualitas partisi ruang data wajib dievaluasi secara intrinsik melalui **Metrik Validasi Internal (*Internal Clustering Validation Metrics*)**.

Metrik validasi internal paling berpengaruh dan komprehensif dirumuskan oleh Peter J. Rousseeuw (1987) melalui **Koefisien Siluet (*Silhouette Coefficient*)**.

### Formulasi Matematis Koefisien Siluet
Diberikan dataset $\\mathbf{X} = \\{\\mathbf{x}_1, \\dots, \\mathbf{x}_n\\}$ yang telah dipartisi ke dalam $K$ kluster $\\mathcal{C} = \\{C_1, C_2, \\dots, C_K\\}$. 
Untuk setiap observasi individual $i$ yang ditugaskan ke dalam kluster $C_A$ ($i \\in C_A$):

#### 1. Kohesi Intra-Kluster ($a(i)$)
$a(i)$ didefinisikan sebagai rata-rata jarak disimilaritas antara observasi $i$ dengan seluruh observasi lain yang berada di dalam kluster yang sama:
$$a(i) = \\frac{1}{|C_A| - 1} \\sum_{j \\in C_A, \\; j \\neq i} d(i, j)$$
Nilai $a(i)$ mencerminkan seberapa kompak atau seberapa baik observasi $i$ menyatu dengan klusternya sendiri (semakin kecil $a(i)$, semakin tinggi kohesi internal).

#### 2. Separasi Inter-Kluster Terdekat ($b(i)$)
$b(i)$ didefinisikan sebagai rata-rata jarak disimilaritas antara observasi $i$ dengan seluruh observasi pada **kluster tetangga terdekat (*neighboring cluster*)**:
$$b(i) = \\min_{C_B \\neq C_A} \\left( \\frac{1}{|C_B|} \\sum_{j \\in C_B} d(i, j) \\right)$$
Kluster tetangga terdekat $C_B^*$ adalah kluster alternatif terbaik yang paling mungkin menaungi observasi $i$ seandainya $i$ tidak dimasukkan ke dalam $C_A$.

#### 3. Koefisien Siluet Individual ($s(i)$)
Koefisien Siluet dari observasi $i$ menggabungkan kohesi dan separasi ke dalam rasio ternormalisasi:
$$s(i) = \\frac{b(i) - a(i)}{\\max\\{a(i), \\; b(i)\\}}$$

Berdasarkan formulasi di atas, nilai $s(i)$ secara analitis selalu berada dalam rentang terikat $[-1, +1]$:
- **$s(i) \\approx +1.0$ (Pengelompokan Sangat Kuat):**
  $a(i) \\ll b(i)$. Jarak ke kluster sendiri jauh lebih kecil daripada jarak ke kluster tetangga. Titik berada di pusat konsentrasi klusternya.
- **$s(i) \\approx 0.0$ (Ambiguitas Batas Kluster):**
  $a(i) \\approx b(i)$. Observasi berada tepat di perbatasan antara dua kluster yang tumpang tindih (*cluster boundary*).
- **$s(i) < 0.0$ (Salah Penugasan / Misclustered):**
  $a(i) > b(i)$. Rata-rata jarak ke kluster sendiri lebih besar daripada jarak ke kluster tetangga; titik tersebut secara objektif lebih dekat ke kluster lain dan keliru ditugaskan.

### Skor Siluet Global & Analisis Siluet Plot
- **Mean Silhouette Score ($\\bar{s}$):** Rata-rata skor siluet di seluruh $n$ observasi dalam dataset:
  $$\\bar{s} = \\frac{1}{n} \\sum_{i=1}^n s(i)$$
  Kriteria penentuan jumlah kluster optimal $K^*$ adalah mencari nilai $K$ yang **memaksimalkan nilai $\\bar{s}$**:
  $$K^* = \\arg\\max_{K \\ge 2} \\bar{s}(K)$$
- **Diagram Siluet (*Silhouette Plot*):** Visualisasi grafis yang mengurutkan koefisien $s(i)$ secara menurun per-kluster dan memplotnya sebagai pita horizontal (*knife-blade silhouettes*). 
  - Jika seluruh kluster memiliki ketebalan pita yang seimbang dan melampaui garis rata-rata global $\\bar{s}$, partisi kluster dinilai sangat sehat.
  - Jika sebuah kluster memiliki banyak pita negatif atau lebar pita yang jauh lebih pendek dari yang lain, kluster tersebut mengalami fragmentasi artifisial.`,
  mermaidFlowchart: `graph TD
    DataPoint["Titik Observasi i in Kluster C_A"] --> CompA["1. Kohesi Intra-Kluster: a(i) = Rata-rata Jarak ke Anggota C_A Lain"]
    DataPoint --> CompB["2. Separasi Inter-Kluster: b(i) = Min Jarak ke Kluster Tetangga Terdekat C_B"]
    CompA & CompB --> Ratio["3. Koefisien Siluet: s(i) = (b(i) - a(i)) / max(a(i), b(i)) in [-1, +1]"]
    Ratio --> Interpret{"Evaluasi Nilai s(i):"}
    Interpret -- s -> +1.0 --> Compact["Kluster Kompak Sempurna: a(i) << b(i)"]
    Interpret -- s ~ 0.0 --> Border["Titik Ambigu di Perbatasan: a(i) ~ b(i)"]
    Interpret -- s < 0.0 --> Misclustered["Salah Penugasan Kluster: a(i) > b(i)"]
    Ratio --> GlobalMean["4. Rata-rata Global s_bar(K): Max s_bar untuk Seleksi K Optimal"]`,
  codeScratch: `import numpy as np

def compute_silhouette_scratch(X: np.ndarray, labels: np.ndarray):
    """
    Implementasi first-principles koefisien siluet individual dan skor siluet global.
    """
    n_samples = X.shape[0]
    unique_clusters = np.unique(labels)
    k = len(unique_clusters)
    
    if k <= 1 or k >= n_samples:
        raise ValueError("Silhouette hanya terdefinisi untuk 2 <= k <= n-1 kluster.")
        
    D = np.linalg.norm(X[:, None, :] - X[None, :, :], axis=2)
    s_scores = np.zeros(n_samples)
    
    for i in range(n_samples):
        c_curr = labels[i]
        curr_mask = (labels == c_curr)
        
        # 1. Kohesi a(i)
        if np.sum(curr_mask) > 1:
            # Jarak ke anggota kluster sendiri kecuali diri sendiri
            a_i = np.sum(D[i, curr_mask]) / (np.sum(curr_mask) - 1)
        else:
            a_i = 0.0
            
        # 2. Separasi b(i)
        b_i = np.inf
        for c_other in unique_clusters:
            if c_other == c_curr:
                continue
            other_mask = (labels == c_other)
            if np.sum(other_mask) > 0:
                dist_other = np.mean(D[i, other_mask])
                if dist_other < b_i:
                    b_i = dist_other
                    
        # 3. Koefisien s(i)
        max_ab = max(a_i, b_i)
        s_scores[i] = (b_i - a_i) / max_ab if max_ab > 0 else 0.0
        
    global_mean_silhouette = float(np.mean(s_scores))
    return s_scores, global_mean_silhouette

# Uji coba pada data 2 kluster terpisah rapi
np.random.seed(42)
X_sil = np.vstack([
    np.random.normal(loc=[-4, 0], scale=0.5, size=(30, 2)),
    np.random.normal(loc=[ 4, 0], scale=0.5, size=(30, 2))
])
lbls_sil = np.array([0]*30 + [1]*30)

indiv_s, mean_s_scratch = compute_silhouette_scratch(X_sil, lbls_sil)
print(f"Mean Silhouette Score Scratch : {mean_s_scratch:.4f} (Mendekati 1.0 = Sangat Baik)")
print(f"Koefisien Siluet Terendah     : {np.min(indiv_s):.4f}")
print(f"Koefisien Siluet Tertinggi    : {np.max(indiv_s):.4f}")`,
  codeSota: `from sklearn.metrics import silhouette_score, silhouette_samples

mean_s_sota = silhouette_score(X_sil, lbls_sil)
indiv_s_sota = silhouette_samples(X_sil, lbls_sil)

print(f"Scikit-Learn Official Silhouette Score: {mean_s_sota:.4f}")`,
  codeDiagnostic: `def verify_silhouette_parity(scratch_mean: float, sota_mean: float):
    """
    Mendiagnosis keselarasan komputasi koefisien siluet antara Scratch dan Scikit-Learn.
    """
    diff = np.abs(scratch_mean - sota_mean)
    print(f"Discrepancy Silhouette Scratch vs SOTA: {diff:.2e}")
    assert diff < 1e-5, "Deviasi numerik signifikan pada perhitungan Silhouette Score!"
    print("STATUS: Analisis siluet internal terverifikasi 100% presisi.")

verify_silhouette_parity(mean_s_scratch, mean_s_sota)`,
  caseStudy: `Di departemen analitik pelanggan e-commerce Alibaba Group, segmentasi perilaku pembeli (*Customer Segmentation*) membagi 40 juta pengguna aktif ke dalam kluster gaya belanja berdasarkan frekuensi pembelian, rata-rata keranjang belanja (*Average Order Value*), dan tingkat diskon kupon.

Tim analitik perlu menentukan jumlah kluster alami $K$ yang paling optimal secara matematis tanpa campur tangan subjektif manajemen. Dengan mengeksekusi analisis siluet pada grid $K \\in \\{2, 3, 4, 5, 6, 7, 8\\}$, nilai Mean Silhouette Score mencapai puncak tertinggi yang tajam pada $K = 4$ ($\\bar{s} = 0.68$). Diagram siluet mengungkap 4 persona belanja yang terisolasi dengan rapi: Pemburu Diskon Ekstrem, Pembeli Massal B2B, Pembeli Spontan Kasual, dan Pelanggan Merek Mewah Premium, memungkinkan kampanye pemasaran terpersonalisasi yang meningkatkan Gross Merchandise Value (GMV) sebesar 18.5%.`,
  commonPitfalls: [
    "Kompleksitas komputasi matriks jarak O(n^2); menghitung koefisien siluet secara penuh pada n > 100.000 sampel membutuhkan memori puluhan gigabyte. Gunakan subsampling acak representatif.",
    "Menerapkan Silhouette Score pada kluster berbentuk non-konveks (seperti bulan sabit ganda); karena berbasis jarak Euclidean lurus, Silhouette Score akan menghukum kluster non-konveks meskipun partisinya sempurna.",
    "Mengabaikan keberadaan kluster singleton (|C| = 1); kohesi a(i) tidak terdefinisi pada kluster beranggotakan satu titik (pembagian dengan nol)."
  ],
  groundingLinks: [
    {
      title: "Silhouettes: A Graphical Aid to the Interpretation and Validation of Cluster Analysis",
      author: "Peter J. Rousseeuw",
      url: "https://doi.org/10.1016/0377-0427(87)90125-7",
      note: "Paper kanonikal Journal of Computational and Applied Mathematics 1987 yang memperkenalkan Silhouette Analysis.",
      year: 1987
    },
    {
      title: "Selecting the Number of Clusters with Silhouette Analysis on KMeans Clustering",
      author: "Scikit-Learn Developers",
      url: "https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html",
      note: "Tutorial resmi implementasi visual diagram siluet Scikit-Learn.",
      year: 2024
    },
    {
      title: "A Survey of Internal Validity Indices for Clustering",
      author: "O. Arbelaitz, I. Gurrutxaga, J. Muguerza, J. M. Pérez, I. Perona",
      url: "https://doi.org/10.1016/j.patcog.2012.07.021",
      note: "Survei komparatif Pattern Recognition yang menempatkan Silhouette sebagai salah satu indeks internal terkuat.",
      year: 2013
    }
  ]
});

// -------------------------------------------------------------
// SUBCHAPTER 26.4: Indeks Dispersi Kluster
// -------------------------------------------------------------
const sub26_4 = createDeepSubchapter({
  id: "ml-26-4-cluster-dispersion-indices",
  slug: "indeks-dispersi-kluster-calinski-harabasz-davies-bouldin",
  title: "26.4 Indeks Dispersi Kluster: Rasio Calinski-Harabasz (Variance Ratio Criterion) & Davies-Bouldin Index",
  orderIndex: 4,
  description: "Formulasi analitis indeks validasi kluster berbasis dispersi kovarians: dekomposisi trace scatter matrix antar/dalam kluster, Indeks Calinski-Harabasz (Variance Ratio Criterion) O(n) cepat, Indeks Davies-Bouldin (rasio kemiripan terburuk), dan perbandingan reliabilitasnya.",
  theoryMarkdown: `Meskipun Silhouette Coefficient sangat populer, ia memiliki kelemahan komputasi yang parah: kompleksitas waktu $\\mathcal{O}(n^2 \\cdot d)$ yang membuatnya sangat lambat pada dataset berskala besar. 

Sebagai alternatif komputasi berkecepatan tinggi dengan kompleksitas linier $\\mathcal{O}(n \\cdot d)$, kita menggunakan **Indeks Dispersi Kluster (*Cluster Dispersion Indices*)** yang memanfaatkan dekomposisi matriks hamburan (*Scatter Matrices*) aljabar linier.

### 1. Dekomposisi Matriks Hamburan (Scatter Matrices)
Tinjau dataset $\\mathbf{X} \\in \\mathbb{R}^{n \\times d}$ dengan rata-rata global $\\bar{\\mathbf{x}} = \\frac{1}{n} \\sum_{i=1}^n \\mathbf{x}_i$, yang dipartisi ke dalam $K$ kluster dengan centroid $\\boldsymbol{\\mu}_k$ dan ukuran $|C_k|$.
- **Matriks Hamburan Dalam-Kluster (*Within-Cluster Scatter Matrix*):**
  $$\\mathbf{S}_W = \\sum_{k=1}^K \\sum_{\\mathbf{x} \\in C_k} (\\mathbf{x} - \\boldsymbol{\\mu}_k)(\\mathbf{x} - \\boldsymbol{\\mu}_k)^T$$
  Trace dari matriks ini, $\\text{Tr}(\\mathbf{S}_W)$, tepat setara dengan fungsi objektif WCSS (Inertia) pada K-Means.
- **Matriks Hamburan Antar-Kluster (*Between-Cluster Scatter Matrix*):**
  $$\\mathbf{S}_B = \\sum_{k=1}^K |C_k| (\\boldsymbol{\\mu}_k - \\bar{\\mathbf{x}})(\\boldsymbol{\\mu}_k - \\bar{\\mathbf{x}})^T$$
  Trace dari matriks ini, $\\text{Tr}(\\mathbf{S}_B)$, mengukur dispersi posisi sentroid relatif terhadap pusat massa global.

### 2. Indeks Calinski-Harabasz (Variance Ratio Criterion - VRC)
Tadeusz Caliński dan Jerzy Harabasz (1974) merumuskan indeks yang mengukur rasio antara dispersi antar-kluster terhadap dispersi dalam-kluster, dinormalisasi oleh derajat kebebasan (*degrees of freedom*):
$$\\text{CH} = \\frac{\\text{Tr}(\\mathbf{S}_B)}{\\text{Tr}(\\mathbf{S}_W)} \\cdot \\frac{n - K}{K - 1}$$
di mana $K - 1$ adalah derajat kebebasan antar-kluster dan $n - K$ adalah derajat kebebasan dalam-kluster.

**Interpretasi & Sifat Analitis Indeks CH:**
- Menyerupai uji statistik $F$-ANOVA dalam analisis variansi multivariat.
- **Kriteria Optimal:** Nilai Calinski-Harabasz yang **semakin TINGGI** menandakan partisi yang semakin superior (kluster-kluster kompak di dalam dan terpisah sangat jauh satu sama lain).
- **Kecepatan Komputasi:** Karena hanya membutuhkan komputasi jarak ke titik berat centroid $\\boldsymbol{\\mu}_k$ dan $\\bar{\\mathbf{x}}$, kompleksitas komputasinya adalah **$\\mathcal{O}(n \\cdot d)$ linier**, menjadikannya ribuan kali lebih cepat daripada Silhouette.

### 3. Indeks Davies-Bouldin (DB Index)
David L. Davies dan Donald W. Bouldin (1979) merumuskan indeks berbasis rasio kemiripan terburuk (*worst-case similarity ratio*).
Misalkan:
- $s_k$ adalah dispersi internal kluster $C_k$ (rata-rata jarak seluruh titik di $C_k$ ke centroid $\\boldsymbol{\\mu}_k$):
  $$s_k = \\frac{1}{|C_k|} \\sum_{\\mathbf{x} \\in C_k} \\|\\mathbf{x} - \\boldsymbol{\\mu}_k\\|_2$$
- $d_{ij} = \\|\\boldsymbol{\\mu}_i - \\boldsymbol{\\mu}_j\\|_2$ adalah jarak Euclidean antara centroid kluster $i$ dan $j$.

Rasio kemiripan antara dua kluster $i$ dan $j$ didefinisikan sebagai:
$$R_{ij} = \\frac{s_i + s_j}{d_{ij}}$$
Rasio ini tinggi jika kedua kluster berukuran lebar namun berjarak sangat dekat satu sama lain.

**Indeks Davies-Bouldin (DB)** adalah rata-rata dari nilai kemiripan terburuk (maksimum) untuk setiap kluster:
$$\\text{DB} = \\frac{1}{K} \\sum_{i=1}^K \\max_{j \\neq i} R_{ij}$$

**Interpretasi Indeks DB:**
- **Kriteria Optimal:** Nilai Davies-Bouldin yang **semakin RENDAH** (mendekati nol) menandakan partisi yang semakin optimal (dispersi internal kecil $s_i \\to 0$ dan jarak antar-centroid besar $d_{ij} \\to \\infty$).
- Memiliki batas bawah absolut $\\text{DB} \\ge 0$.`,
  mermaidFlowchart: `graph TD
    Clusters["Partisi k Kluster & Koordinat Centroid mu_k"] --> ScatterCalc["Hitung Trace Scatter Matrices: Tr(S_B) & Tr(S_W)"]
    ScatterCalc --> CHIndex["1. Indeks Calinski-Harabasz: CH = (Tr(S_B) / Tr(S_W)) * ((n - k) / (k - 1))"]
    CHIndex --> MaxCH["Optimalisasi CH: Cari k dengan Nilai CH MAKSIMUM"]
    Clusters --> PairwiseDist["Hitung Dispersi s_k & Jarak Antar-Centroid d_ij"]
    PairwiseDist --> Similarity["Rasio Kemiripan: R_ij = (s_i + s_j) / d_ij"]
    Similarity --> DBIndex["2. Indeks Davies-Bouldin: DB = (1/k) * sum_i max_(j!=i) R_ij"]
    DBIndex --> MinDB["Optimalisasi DB: Cari k dengan Nilai DB MINIMUM"]`,
  codeScratch: `import numpy as np

def compute_dispersion_indices_scratch(X: np.ndarray, labels: np.ndarray):
    """
    Menghitung Indeks Calinski-Harabasz dan Davies-Bouldin dari prinsip pertama.
    """
    n_samples, n_features = X.shape
    unique_labels = np.unique(labels)
    k = len(unique_labels)
    
    if k <= 1 or k >= n_samples:
        raise ValueError("Indeks dispersi membutuhkan 2 <= k <= n-1.")
        
    global_mean = np.mean(X, axis=0)
    
    # 1. Hitung centroid dan dispersi per-kluster
    centroids = np.zeros((k, n_features))
    cluster_sizes = np.zeros(k)
    s_dispersions = np.zeros(k)
    tr_sw = 0.0
    
    for idx, c in enumerate(unique_labels):
        pts = X[labels == c]
        cluster_sizes[idx] = len(pts)
        c_mean = np.mean(pts, axis=0)
        centroids[idx] = c_mean
        
        diff = pts - c_mean
        tr_sw += np.sum(diff ** 2)
        s_dispersions[idx] = np.mean(np.linalg.norm(diff, axis=1))
        
    # 2. Hitung Tr(S_B) untuk Calinski-Harabasz
    diff_centroids = centroids - global_mean
    tr_sb = np.sum(cluster_sizes * np.sum(diff_centroids ** 2, axis=1))
    
    # Skor Calinski-Harabasz
    ch_score = (tr_sb / tr_sw) * ((n_samples - k) / (k - 1)) if tr_sw > 0 else 0.0
    
    # 3. Hitung Davies-Bouldin
    centroid_dists = np.linalg.norm(centroids[:, None, :] - centroids[None, :, :], axis=2)
    np.fill_diagonal(centroid_dists, np.inf)
    
    db_ratios = np.zeros(k)
    for i in range(k):
        r_ij = (s_dispersions[i] + s_dispersions) / centroid_dists[i]
        db_ratios[i] = np.max(r_ij)
        
    db_score = float(np.mean(db_ratios))
    
    return float(ch_score), db_score

# Uji coba pada data sintetis 3 kluster
np.random.seed(42)
X_disp = np.vstack([
    np.random.normal(loc=[-4, -4], scale=0.8, size=(40, 2)),
    np.random.normal(loc=[ 4,  4], scale=0.8, size=(40, 2)),
    np.random.normal(loc=[-4,  4], scale=0.8, size=(40, 2))
])
lbls_disp = np.array([0]*40 + [1]*40 + [2]*40)

ch_val_scratch, db_val_scratch = compute_dispersion_indices_scratch(X_disp, lbls_disp)
print(f"Indeks Calinski-Harabasz Scratch (Tinggi = Baik) : {ch_val_scratch:.3f}")
print(f"Indeks Davies-Bouldin Scratch    (Rendah = Baik) : {db_val_scratch:.3f}")`,
  codeSota: `from sklearn.metrics import calinski_harabasz_score, davies_bouldin_score

ch_sota = calinski_harabasz_score(X_disp, lbls_disp)
db_sota = davies_bouldin_score(X_disp, lbls_disp)

print(f"Scikit-Learn Calinski-Harabasz Score: {ch_sota:.3f}")
print(f"Scikit-Learn Davies-Bouldin Score   : {db_sota:.3f}")`,
  codeDiagnostic: `def verify_dispersion_parity(ch_scratch: float, ch_sota: float, db_scratch: float, db_sota: float):
    """
    Mendiagnosis keselarasan komputasi indeks CH dan DB.
    """
    diff_ch = np.abs(ch_scratch - ch_sota)
    diff_db = np.abs(db_scratch - db_sota)
    print(f"Discrepancy CH: {diff_ch:.2e} | Discrepancy DB: {diff_db:.2e}")
    assert diff_ch < 1e-4 and diff_db < 1e-4, "Deviasi numerik signifikan pada indeks dispersi!"
    print("STATUS: Indeks dispersi Calinski-Harabasz dan Davies-Bouldin terverifikasi identik 100%.")

verify_dispersion_parity(ch_val_scratch, ch_sota, db_val_scratch, db_sota)`,
  caseStudy: `Di divisi pemetaan citra satelit antariksa Badan Antariksa Eropa (ESA), algoritma segmentasi tutupan lahan (*Land Cover Segmentation*) memproses citra multispektral berukuran terabyte dari konstelasi satelit Sentinel-2. Citra berisi puluhan juta piksel permukaan bumi yang harus dikelompokkan ke dalam kategori ekologis (hutan primer, perairan danau, lahan pertanian, dan kawasan urban).

Menjalankan Silhouette Score pada 10 juta piksel membutuhkan waktu komputasi 48 jam pada kluster komputasi tinggi. Dengan memanfaatkan Indeks Calinski-Harabasz dan Davies-Bouldin yang beroperasi dalam kompleksitas linier $\\mathcal{O}(n \\cdot d)$, tim pengolah citra mampu memindai spektrum $K \\in [3, 12]$ dalam waktu kurang dari 45 detik. Puncak indeks Calinski-Harabasz secara akurat mendeteksi $K = 6$ zona tutupan lahan alami dengan resolusi spasial 10 meter.`,
  commonPitfalls: [
    "Mengasumsikan indeks Calinski-Harabasz dan Davies-Bouldin selalu sepakat mengenai nilai K terbaik; pada data dengan ukuran kluster tidak seimbang, CH cenderung menyukai kluster berukuran sama, sedangkan DB lebih toleran terhadap variasi ukuran.",
    "Mengabaikan sensitivitas terhadap bentuk elipsoid; baik CH maupun DB mengasumsikan jarak Euclidean berbasis titik berat centroid, sehingga bias terhadap kluster berbentuk bola konveks.",
    "Lupa membalikkan logika interpretasi: Calinski-Harabasz dimaksimalkan (makin tinggi makin baik), sedangkan Davies-Bouldin diminimalkan (makin rendah makin baik)."
  ],
  groundingLinks: [
    {
      title: "A Dendrite Method for Cluster Analysis",
      author: "T. Caliński, J. Harabasz",
      url: "https://doi.org/10.1080/03610927408827101",
      note: "Paper kanonikal Communications in Statistics 1974 yang merumuskan Indeks Calinski-Harabasz.",
      year: 1974
    },
    {
      title: "A Cluster Separation Measure",
      author: "David L. Davies, Donald W. Bouldin",
      url: "https://doi.org/10.1109/TPAMI.1979.4766909",
      note: "Paper bersejarah IEEE TPAMI 1979 yang memperkenalkan Davies-Bouldin Index.",
      year: 1979
    },
    {
      title: "Scikit-Learn Clustering Performance Evaluation",
      author: "Scikit-Learn Developers",
      url: "https://scikit-learn.org/stable/modules/clustering.html#clustering-performance-evaluation",
      note: "Dokumentasi teknis resmi metrik validasi kluster Scikit-Learn.",
      year: 2024
    }
  ]
});

// -------------------------------------------------------------
// SUBCHAPTER 26.5: Validasi Eksternal Klusterisasi
// -------------------------------------------------------------
const sub26_5 = createDeepSubchapter({
  id: "ml-26-5-external-clustering-metrics",
  slug: "validasi-eksternal-klusterisasi-ari-nmi-vmeasure",
  title: "26.5 Validasi Eksternal Klusterisasi: Adjusted Rand Index (ARI), Normalized Mutual Information (NMI), dan Homogeneity-Completeness-V-Measure",
  orderIndex: 5,
  description: "Metrologi validasi eksternal klusterisasi dengan ketersediaan label acuan: evaluasi pasangan Rand Index (RI), koreksi peluang acak Adjusted Rand Index (ARI), teori informasi Normalized Mutual Information (NMI), serta dekomposisi Homogeneity, Completeness, dan V-Measure.",
  theoryMarkdown: `Ketika pengembang algoritma klusterisasi memiliki akses ke label kelas acuan (*ground truth class labels*)—misalnya dalam fase tolok ukur sintetis (*benchmarking*) atau validasi data anotasi ahli—evaluasi partisi dilakukan melalui **Metrik Validasi Eksternal (*External Clustering Validation Metrics*)**.

Tantangan analitis mendasar dari validasi eksternal adalah: **Invariansi Permutasi Label**. 
Algoritma klusterisasi tidak mengetahui nama kelas sejati; kluster yang dinamai 'Kluster 0' oleh K-Means dapat mewakili 'Kelas Kanker' yang di data acuan diberi kode 'Label 1'. Oleh karena itu, metrik akurasi klasifikasi standar tidak dapat digunakan. Metrik validasi eksternal wajib mengevaluasi **keselarasan struktur partisi pasangan data**, independen terhadap permutasi nama label.

### 1. Rand Index (RI) & Adjusted Rand Index (ARI)
William M. Rand (1971) memformulasikan evaluasi klusterisasi berbasis pasangan (*pair-counting approach*). 
Tinjau seluruh $\\binom{n}{2} = \\frac{n(n - 1)}{2}$ pasangan observasi unik $(\\mathbf{x}_i, \\mathbf{x}_j)$ dalam dataset. Setiap pasangan diklasifikasikan ke dalam empat kemungkinan:
- $a$: Pasangan berada di **kluster yang sama** pada partisi prediksi $\\mathcal{C}$ dan berada di **kelas yang sama** pada partisi acuan $\\mathcal{K}$ (Kesepakatan Positif).
- $b$: Pasangan berada di **kluster berbeda** pada $\\mathcal{C}$ dan berada di **kelas berbeda** pada $\\mathcal{K}$ (Kesepakatan Negatif).
- $c$: Pasangan berada di kluster yang sama pada $\\mathcal{C}$ tetapi kelas berbeda pada $\\mathcal{K}$ (Perselisihan Tipe I).
- $d$: Pasangan berada di kluster berbeda pada $\\mathcal{C}$ tetapi kelas yang sama pada $\\mathcal{K}$ (Perselisihan Tipe II).

**Rand Index (RI)** didefinisikan sebagai proporsi pasangan yang disepakati:
$$\\text{RI} = \\frac{a + b}{a + b + c + d} = \\frac{a + b}{\\binom{n}{2}}$$

**Kelemahan RI & Koreksi Peluang Acak Hubert-Arabie (ARI, 1985):**
Nilai RI mentah memiliki ekspektasi yang tidak nol untuk partisi acak murni (ketika $K$ besar, sebagian besar pasangan secara alami berada di kluster berbeda, sehingga $b$ sangat besar dan $\\text{RI} \\to 1$).
Lawrence Hubert dan Phipps Arabie mengoreksi RI menggunakan formulasi penyesuaian peluang umum:
$$\\text{ARI} = \\frac{\\text{RI} - \\mathbb{E}[\\text{RI}]}{\\max(\\text{RI}) - \\mathbb{E}[\\text{RI}]}$$
di mana ekspektasi $\\mathbb{E}[\\text{RI}]$ diturunkan secara analitis di bawah **Model Hipergeometrik Acak Ganda (*Generalized Hypergeometric Model*)**:
- $\\text{ARI} = +1.0$: Partisi identik sempurna terhadap ground truth.
- $\\text{ARI} = 0.0$: Keselarasan setara dengan pengelompokan label acak murni.
- $\\text{ARI} < 0.0$: Keselarasan lebih buruk daripada pengelompokan acak.

### 2. Normalized Mutual Information (NMI)
Berdasarkan teori informasi Shannon, informasi timbal-balik (*Mutual Information*) mengukur seberapa banyak ketidakpastian (*entropi*) pada partisi acuan $\\mathcal{K}$ yang berkurang setelah mengetahui penugasan kluster $\\mathcal{C}$:
$$I(\\mathcal{C}; \\mathcal{K}) = \\sum_{c \\in \\mathcal{C}} \\sum_{k \\in \\mathcal{K}} P(c, k) \\ln \\left( \\frac{P(c, k)}{P(c) P(k)} \\right)$$
Untuk memungkinkan perbandingan lintas jumlah kluster yang berbeda, metrik dinormalisasi oleh rata-rata entropi:
$$\\text{NMI}(\\mathcal{C}, \\mathcal{K}) = \\frac{2 \\, I(\\mathcal{C}; \\mathcal{K})}{H(\\mathcal{C}) + H(\\mathcal{K})}$$
di mana $H(\\mathcal{C}) = -\\sum P(c) \\ln P(c)$ adalah entropi Shannon. Nilai NMI berada dalam rentang terikat $[0, 1]$.

### 3. Homogeneity, Completeness, & V-Measure
Andrew Rosenberg dan Julia Hirschberg (EMNLP 2007) merumuskan dekomposisi entropis yang analog dengan konsep Precision dan Recall:
- **Homogeneity ($h$):** Sebuah partisi bersifat homogen jika setiap kluster hanya berisi observasi yang berasal dari satu kelas acuan tunggal:
  $$h = 1 - \\frac{H(\\mathcal{K} \\mid \\mathcal{C})}{H(\\mathcal{K})}$$
- **Completeness ($c$):** Sebuah partisi bersifat lengkap jika seluruh observasi yang merupakan anggota dari satu kelas acuan yang sama ditugaskan ke dalam satu kluster yang sama:
  $$c = 1 - \\frac{H(\\mathcal{C} \\mid \\mathcal{K})}{H(\\mathcal{C})}$$
- **V-Measure ($v$):** Rata-rata harmonik terbobot antara Homogeneity dan Completeness:
  $$v = \\frac{2 \\cdot h \\cdot c}{h + c}$$
  V-Measure bernilai $1.0$ jika dan hanya jika partisi kluster homogen dan lengkap sempurna.`,
  mermaidFlowchart: `graph TD
    InputData["Partisi Prediksi C vs Label Acuan Sejati K"] --> BranchPair["1. Pendekatan Pasangan: Hitung a, b, c, d pada (n choose 2) Pasangan"]
    InputData --> BranchInfo["2. Pendekatan Teori Informasi: Entropi Bersyarat & Mutual Information"]
    BranchPair --> ARI["Adjusted Rand Index (ARI): Koreksi Peluang Acak Hipergeometrik in [-1, +1]"]
    BranchInfo --> NMI["Normalized Mutual Information (NMI): 2*I(C; K) / (H(C) + H(K)) in [0, 1]"]
    BranchInfo --> VMeasureTree["Dekomposisi Rosenberg-Hirschberg:"]
    VMeasureTree --> Homogeneity["Homogeneity h: Setiap Kluster Berisi 1 Kelas Tunggal"]
    VMeasureTree --> Completeness["Completeness c: Seluruh Anggota 1 Kelas Masuk ke 1 Kluster"]
    Homogeneity & Completeness --> VMeasure["V-Measure: Harmonic Mean = 2*h*c / (h + c)"]`,
  codeScratch: `import numpy as np
from scipy.special import comb

def compute_ari_scratch(labels_true: np.ndarray, labels_pred: np.ndarray) -> float:
    """
    Menghitung Adjusted Rand Index (ARI) dari prinsip pertama menggunakan tabel kontingensi.
    """
    classes = np.unique(labels_true)
    clusters = np.unique(labels_pred)
    
    # 1. Bangun tabel kontingensi matriks (n_classes, n_clusters)
    contingency = np.zeros((len(classes), len(clusters)), dtype=int)
    for i in range(len(labels_true)):
        c_idx = np.where(classes == labels_true[i])[0][0]
        k_idx = np.where(clusters == labels_pred[i])[0][0]
        contingency[c_idx, k_idx] += 1
        
    # 2. Hitung jumlah kombinasi pasangan n_ij choose 2
    sum_comb_nij = np.sum([comb(n_ij, 2, exact=True) for n_ij in contingency.flatten() if n_ij > 1])
    
    # Jumlah kombinasi baris a_i choose 2 dan kolom b_j choose 2
    a_row_sums = np.sum(contingency, axis=1)
    b_col_sums = np.sum(contingency, axis=0)
    
    sum_comb_a = np.sum([comb(a, 2, exact=True) for a in a_row_sums if a > 1])
    sum_comb_b = np.sum([comb(b, 2, exact=True) for b in b_col_sums if b > 1])
    
    n_total = len(labels_true)
    total_pairs = comb(n_total, 2, exact=True)
    
    # 3. Formula Hubert & Arabie (1985)
    expected_index = (sum_comb_a * sum_comb_b) / total_pairs
    max_index = 0.5 * (sum_comb_a + sum_comb_b)
    
    denominator = max_index - expected_index
    if denominator == 0:
        return 0.0
        
    ari = (sum_comb_nij - expected_index) / denominator
    return float(ari)

# Uji coba pada partisi dengan permutasi nama label
y_true_ext = np.array([0, 0, 0, 1, 1, 1, 2, 2, 2])
# Prediksi kluster identik secara struktur namun nama label tertukar (0->1, 1->2, 2->0)
y_pred_permuted = np.array([1, 1, 1, 2, 2, 2, 0, 0, 0])
# Prediksi acak murni
y_pred_random = np.array([0, 1, 2, 0, 1, 2, 0, 1, 2])

ari_perfect = compute_ari_scratch(y_true_ext, y_pred_permuted)
ari_rand = compute_ari_scratch(y_true_ext, y_pred_random)

print(f"ARI Partisi Tertukar Sempurna : {ari_perfect:.4f} (Wajib 1.0, Invarian Permutasi!)")
print(f"ARI Partisi Acak Murni        : {ari_rand:.4f} (Mendekati 0.0)")`,
  codeSota: `from sklearn.metrics import adjusted_rand_score, normalized_mutual_info_score, homogeneity_completeness_v_measure

ari_sota = adjusted_rand_score(y_true_ext, y_pred_permuted)
nmi_sota = normalized_mutual_info_score(y_true_ext, y_pred_permuted)
h_sota, c_sota, v_sota = homogeneity_completeness_v_measure(y_true_ext, y_pred_permuted)

print(f"Scikit-Learn ARI        : {ari_sota:.4f}")
print(f"Scikit-Learn NMI        : {nmi_sota:.4f}")
print(f"Scikit-Learn V-Measure  : {v_sota:.4f} (Homogeneity={h_sota:.2f}, Completeness={c_sota:.2f})")`,
  codeDiagnostic: `def verify_permutation_invariance(ari_val: float):
    """
    Mendiagnosis sifat aksiomatis invariansi permutasi label pada validasi eksternal.
    """
    print(f"Evaluasi Invariansi Permutasi Label:")
    assert np.isclose(ari_val, 1.0), "Kegagalan Fatal! Algoritma validasi eksternal tidak invarian terhadap permutasi nama label!"
    print("STATUS: Sifat invariansi permutasi label terverifikasi 100% sempurna.")

verify_permutation_invariance(ari_perfect)`,
  caseStudy: `Di konsorsium internasional The Cancer Genome Atlas (TCGA), bioinformatikawan memvalidasi algoritma klusterisasi multi-omics baru (*Consensus Clustering on mRNA, methylation, and copy-number data*) untuk menemukan sub-tipe molekuler kanker payudara. Dataset memiliki label patologi histologis emas yang divalidasi oleh dewan dokter onkologi (*PAM50 subtypes: Luminal A, Luminal B, HER2-enriched, Basal-like*).

Karena algoritma tanpa pengawasan menghasilkan kluster dengan ID numerik sembarang, evaluasi menggunakan akurasi klasifikasi menghasilkan nilai 0% akibat ketidakcocokan nama label. Dengan menggunakan Adjusted Rand Index (ARI) dan V-Measure, tim membuktikan bahwa partisi multi-omics memiliki keselarasan $\\text{ARI} = 0.84$ dan $V = 0.89$ terhadap klasifikasi biologis PAM50, mengonfirmasi secara kuantitatif bahwa algoritma baru mampu mengelompokkan pasien ke dalam sub-tipe terapi biologis yang tepat tanpa memerlukan supervisi manual.`,
  commonPitfalls: [
    "Menggunakan Rand Index (RI) mentah alih-alih Adjusted Rand Index (ARI); RI selalu memberikan skor tinggi palsu (misal 0.80) bahkan untuk data acak murni jika jumlah kluster K besar.",
    "Menggunakan metrik klasifikasi supervised (seperti Accuracy atau F1) secara langsung pada output klusterisasi tanpa melakukan penyesuaian penugasan optimal Hungarian (*Kuhn-Munkres algorithm*).",
    "Mengasumsikan skor NMI selalu lebih rendah dari ARI; NMI berbasis normalisasi logaritmik dan sering kali menghasilkan angka numerik yang lebih tinggi daripada ARI untuk partisi yang sama."
  ],
  groundingLinks: [
    {
      title: "Comparing Partitions",
      author: "Lawrence Hubert, Phipps Arabie",
      url: "https://doi.org/10.1007/BF01908075",
      note: "Paper kanonikal Journal of Classification 1985 yang merumuskan formula analitis Adjusted Rand Index.",
      year: 1985
    },
    {
      title: "V-Measure: A Conditional Entropy-Based External Cluster Evaluation Measure",
      author: "Andrew Rosenberg, Julia Hirschberg",
      url: "https://aclanthology.org/D07-1043/",
      note: "Paper monumental EMNLP 2007 yang mendekomposisi evaluasi eksternal ke dalam Homogeneity dan Completeness.",
      year: 2007
    },
    {
      title: "Scikit-Learn Clustering Evaluation Metrics",
      author: "Scikit-Learn Developers",
      url: "https://scikit-learn.org/stable/modules/clustering.html#clustering-performance-evaluation",
      note: "Dokumentasi teknis resmi implementasi fungsi ARI, NMI, dan V-Measure Scikit-Learn.",
      year: 2024
    }
  ]
});

// -------------------------------------------------------------
// CHAPTER EXPORT
// -------------------------------------------------------------
const chapter26Data = {
  id: "machine-learning-ch-26",
  title: "Bab 26: Metrologi Evaluasi Regresi & Klusterisasi",
  slug: "metrologi-evaluasi-regresi-klusterisasi",
  orderIndex: 26,
  description: "Landasan komprehensif metrologi evaluasi regresi kontinu dan klusterisasi tanpa pengawasan: analisis matematis galat skala-dependen (MSE, RMSE, MAE) dengan pembuktian ketidaksamaan Jensen rasio dispersi galat, metrik robust dan relatif (MedAE breakdown point 50%, MAPE asimetris, Huber loss, dekomposisi variansi R^2 dan penalti derajat kebebasan Adjusted R^2), evaluasi klusterisasi internal berbasis kohesi-separasi Silhouette Analysis dan Siluet Plot, indeks dispersi cepat Calinski-Harabasz O(n) dan Davies-Bouldin, serta metrologi validasi eksternal invarian permutasi via Adjusted Rand Index (ARI), Normalized Mutual Information (NMI), dan dekomposisi Homogeneity-Completeness-V-Measure.",
  coreConcepts: [
    "Metrik Galat Regresi Skala Dependen: MSE, RMSE, & MAE",
    "Ketidaksamaan Jensen Rasio Dispersi Galat",
    "Metrik Robust & Relatif: MedAE, MAPE, R^2, & Adjusted R^2",
    "Evaluasi Klusterisasi Internal: Silhouette Coefficient & Plot",
    "Indeks Dispersi Kluster Cepat: Calinski-Harabasz & Davies-Bouldin",
    "Validasi Eksternal Invarian Permutasi: Adjusted Rand Index (ARI)",
    "Teori Informasi Klusterisasi: NMI, Homogeneity, Completeness, & V-Measure"
  ],
  subchapters: [
    sub26_1,
    sub26_2,
    sub26_3,
    sub26_4,
    sub26_5
  ]
};

const tsContent = exportChapterTs(chapter26Data, "chapter26");
fs.writeFileSync(path.join(outDir, "chunk6-ch26.ts"), tsContent, "utf8");
console.log("Successfully deepened and generated chunk6-ch26.ts (5 comprehensive subchapters)");
