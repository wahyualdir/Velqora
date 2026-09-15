import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: TIME SERIES FORECASTING & ANOMALY DETECTION (TOPIK 27) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Box, G. E., Jenkins, G. M., Reinsel, G. C., & Ljung, G. M. (2015). Time Series Analysis: Forecasting and Control (5th ed.). Wiley.
 * - Hyndman, R. J., & Athanasopoulos, G. (2021). Forecasting: Principles and Practice (3rd ed.). OTexts.
 * - Liu, F. T., Ting, K. M., & Zhou, Z. H. (2008). Isolation Forest. IEEE ICDM.
 * - Zeng, A., et al. (2023). Are Transformers Effective for Time Series? (DLinear). AAAI 2023.
 * - Nie, Y., et al. (2023). A Time Series is Worth 64 Words: Long-term Forecasting with Transformers (PatchTST). ICLR 2023.
 */
export const timeSeriesForecastingCurriculum: AcademicCurriculum = {
  id: "time-series-forecasting",
  slug: "time-series-forecasting-anomaly-detection",
  title: "Time Series Forecasting & Anomaly Detection",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Pemodelan data deret waktu dan deteksi anomali: uji stasioneritas formal (Augmented Dickey-Fuller & KPSS), metodologi Box-Jenkins (ARIMA & SARIMAX), arsitektur modern neural time-series (DLinear & PatchTST), deteksi anomali tanpa supervisi (Isolation Forest & Autoencoder Reconstruction Error), protokol evaluasi Walk-Forward, serta Time Series Foundation Models.",
  estimatedHours: 56,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Forecasting: Principles and Practice (3rd Edition)",
      authors: ["Rob J. Hyndman", "George Athanasopoulos"],
      type: "book",
      url: "https://otexts.com/fpp3/",
      relevance: "Rujukan komprehensif stasioneritas, transformasi Box-Cox, ACF/PACF, dan metodologi pemodelan deret waktu terapan.",
      year: 2021,
      publisherOrVenue: "OTexts",
    },
    {
      title: "Isolation Forest",
      authors: ["Fei Tony Liu", "Kai Ming Ting", "Zhi-Hua Zhou"],
      type: "paper",
      url: "https://ieeexplore.ieee.org/document/4781136",
      doi: "10.1109/ICDM.2008.17",
      relevance: "Algoritma deteksi anomali berbasis pemisahan partisi pohon acak dengan kompleksitas linear O(n).",
      year: 2008,
      publisherOrVenue: "IEEE ICDM 2008",
    },
    {
      title: "Are Transformers Effective for Time Series?",
      authors: ["Ailing Zeng", "Muxin Chen", "Lei Zhang", "Qiang Xu"],
      type: "paper",
      url: "https://arxiv.org/abs/2205.13504",
      doi: "10.48550/arXiv.2205.13504",
      relevance: "Membuktikan secara empiris bahwa model linear terdekomposisi (DLinear) mengungguli Transformer kompleks pada peramalan deret waktu.",
      year: 2023,
      publisherOrVenue: "AAAI 2023",
    },
  ],
  chapters: [
    {
      id: "ts-bab-1",
      slug: "stasioneritas-dan-dekomposisi-deret-waktu",
      title: "BAB 1: Stasioneritas, Dekomposisi STL & Uji Akar Unit (ADF)",
      orderIndex: 1,
      description: "Definisi formal stasioneritas lemah (Covariance Stationarity), dekomposisi Tren-Musiman-Residu, dan pengujian hipotesis akar unit Augmented Dickey-Fuller (ADF).",
      subchapters: [
        {
          id: "ts-bab-1-1",
          slug: "uji-augmented-dickey-fuller-dan-differencing",
          title: "1.1. Formulasi Matematis Uji ADF & Teknik Differencing",
          orderIndex: 1,
          description: "Mendeteksi proses random walk berkendala akar unit $\\phi = 1$ melalui regresi selisih $\\Delta y_t = \\alpha + \\beta t + \\gamma y_{t-1} + \\sum_{i=1}^p \\delta_i \\Delta y_{t-i} + \\epsilon_t$.",
          content_markdown: `# 1.1. Formulasi Matematis Uji ADF & Teknik Differencing

## 1. Definisi Stasioneritas Lemah (Weak Stationarity)
Deret waktu $\\{y_t\\}$ dikatakan stasioner secara kovarians jika memenuhi tiga kondisi:
1. **Rata-rata konstan**: $\\mathbb{E}[y_t] = \\mu \\quad \\forall t$.
2. **Varians konstan**: $\\text{Var}(y_t) = \\sigma^2 < \\infty \\quad \\forall t$.
3. **Autokovarians bergantung hanya pada jeda waktu (*lag* $k$)**:
   $$\\text{Cov}(y_t, y_{t-k}) = \\gamma_k \\quad \\forall t$$

## 2. Uji Akar Unit Augmented Dickey-Fuller (ADF)
Diberikan model autoregresif AR(1): $y_t = \\phi y_{t-1} + \\epsilon_t$.
Jika $\\phi = 1$, proses adalah *Random Walk* murni yang tidak stasioner dengan varians tak terhingga ($t \\cdot \\sigma^2$).

Kurangkan $y_{t-1}$ dari kedua sisi:
$$\\Delta y_t = (\\phi - 1) y_{t-1} + \\epsilon_t = \\gamma y_{t-1} + \\epsilon_t$$

Regresi penuh uji ADF dengan tren linier dan $p$ lag selisih:
$$\\Delta y_t = \\alpha + \\beta t + \\gamma y_{t-1} + \\sum_{i=1}^p \\delta_i \\Delta y_{t-i} + \\epsilon_t$$

- **Hipotesis Nol ($H_0$)**: $\\gamma = 0$ (Terdapat akar unit, deret waktu **tidak stasioner**).
- **Hipotesis Alternatif ($H_1$)**: $\\gamma < 0$ (Deret waktu **stasioner**).
Statistik uji $t = \\hat{\\gamma} / \\text{SE}(\\hat{\\gamma})$ dibandingkan terhadap nilai kritis Dickey-Fuller non-standar.
`,
        },
      ],
    },
    {
      id: "ts-bab-2",
      slug: "metodologi-box-jenkins-arima-sarimax",
      title: "BAB 2: Metodologi Box-Jenkins: ARIMA & SARIMAX",
      orderIndex: 2,
      description: "Identifikasi orde melalui fungsi autokorelasi (ACF & PACF), parameterisasi $(p, d, q)$, operator lag $B$, musiman musiman $(P, D, Q)_s$, dan kovariat eksogen SARIMAX.",
      subchapters: [
        {
          id: "ts-bab-2-1",
          slug: "formulasi-operator-lag-arima",
          title: "2.1. Operator Polinomial Lag & Formulasi Kompak SARIMAX",
          orderIndex: 1,
          description: "Representasi elegan model deret waktu menggunakan operator pergeseran mundur $B y_t = y_{t-1}$ dan penanganan komponen Moving Average.",
          content_markdown: `# 2.1. Operator Polinomial Lag & Formulasi Kompak SARIMAX

## 1. Notasi Operator Lag (Backshift Operator $B$)
$$B^k y_t = y_{t-k}, \\quad \\Delta y_t = (1 - B) y_t$$

Model **ARIMA($p, d, q$)** dirumuskan secara terpadu sebagai:

$$\\Phi_p(B) (1 - B)^d y_t = \\Theta_q(B) \\epsilon_t$$

Di mana:
- Polinomial Autoregressive: $\\Phi_p(B) = 1 - \\sum_{i=1}^p \\phi_i B^i$
- Polinomial Moving Average: $\\Theta_q(B) = 1 + \\sum_{j=1}^q \\theta_j B^j$
- $\\epsilon_t \\sim \\text{WN}(0, \\sigma^2)$ adalah proses *White Noise* independen.

## 2. Model Musiman SARIMAX dengan Kovariat Eksogen
$$\\Phi_p(B) \\tilde{\\Phi}_P(B^s) (1 - B)^d (1 - B^s)^D (y_t - \\boldsymbol{\\beta}^T \\mathbf{x}_t) = \\Theta_q(B) \\tilde{\\Theta}_Q(B^s) \\epsilon_t$$
Di mana $\\mathbf{x}_t$ adalah vektor variabel eksogen (misal: suhu cuaca atau indikator hari libur nasional).
`,
        },
      ],
    },
    {
      id: "ts-bab-3",
      slug: "deep-learning-time-series-dlinear-patchtst",
      title: "BAB 3: Deep Learning Deret Waktu: DLinear & PatchTST",
      orderIndex: 3,
      description: "Kritik terhadap efektivitas Transformer sekuensial: arsitektur DLinear (Zeng et al. AAAI 2023) dan peramalan jangka panjang berbasis pemotongan patch (PatchTST Nie et al. ICLR 2023).",
      subchapters: [
        {
          id: "ts-bab-3-1",
          slug: "arsitektur-dlinear-dan-patchtst",
          title: "3.1. Dekomposisi Linier DLinear & Kemandirian Kanal PatchTST",
          orderIndex: 1,
          description: "Mengapa pemodelan autoregresif titik per titik gagal menangkap dependensi temporal panjang, dan keunggulan segmentasi sub-sekuens 64-token.",
          content_markdown: `# 3.1. Dekomposisi Linier DLinear & Kemandirian Kanal PatchTST

## 1. Temuan Kontroversial DLinear (Zeng et al., AAAI 2023)
Zeng et al. membuktikan bahwa Transformer kompleks (Informer, Autoformer, Fedformer) seringkali kalah akurat dan ratusan kali lebih lambat dibanding model linear sederhana satu lapisan dengan dekomposisi:
1. Deret waktu dipecah menjadi komponen tren $\\mathbf{T}$ (via moving average filter) dan musiman $\\mathbf{S} = \\mathbf{X} - \\mathbf{T}$.
2. Dua lapisan linier independen memproyeksikan masing-masing komponen ke masa depan:
   $$\\hat{\\mathbf{X}} = \\mathbf{W}_{\\text{trend}} \\mathbf{T} + \\mathbf{W}_{\\text{season}} \\mathbf{S}$$

## 2. Terobosan PatchTST (Nie et al., ICLR 2023)
PatchTST merehabilitasi Transformer untuk deret waktu melalui dua prinsip desain:
- **Patching**: Memecah deret waktu kontinu menjadi patch sub-sekuens (misal panjang 16 langkah) yang saling bertumpang-tindih. Mengurangi panjang sekuens atensi $N$ menjadi $N/P$, memangkas memori kuadratik secara signifikan.
- **Channel Independence**: Setiap variabel multivariat diproses secara independen oleh Transformer yang sama tanpa pencampuran kanal awal, mencegah overfitting korelasi palsu.
`,
        },
      ],
    },
    {
      id: "ts-bab-4",
      slug: "deteksi-anomali-tanpa-supervisi",
      title: "BAB 4: Deteksi Anomali Tanpa Supervisi: Isolation Forest & Autoencoder",
      orderIndex: 4,
      description: "Mendeteksi perilaku menyimpang pada aliran data: Isolation Forest (Liu et al. 2008), skor anomali berbasis panjang jalur pohon, dan Autoencoder Reconstruction Error.",
      subchapters: [
        {
          id: "ts-bab-4-1",
          slug: "algoritma-isolation-forest-matematika",
          title: "4.1. Formulasi Skor Anomali Isolation Forest (Liu et al., 2008)",
          orderIndex: 1,
          description: "Mengapa anomali lebih mudah diisolasi dalam partisi acak, kedalaman rata-rata jalur $h(x)$, dan normalisasi konstanta Euler.",
          content_markdown: `# 4.1. Formulasi Skor Anomali Isolation Forest (Liu et al., 2008)

## 1. Premis Dasar Isolation Forest
Titik anomali memiliki dua sifat intrinsik:
1. Jumlahnya **sedikit** (*minority*).
2. Memiliki nilai atribut yang **sangat berbeda** dari populasi umum.
Konsekuensi matematis: anomali dapat **diisolasi lebih cepat** (memerlukan lebih sedikit pemisahan acak / *fewer random splits*) sehingga menempati simpul dangkal pada pohon partisi biner acak (*iTree*).

## 2. Formulasi Skor Anomali
Rata-rata panjang jalur pencarian gagal pada Binary Search Tree (BST) untuk $n$ sampel:
$$c(n) = 2 \\left( \\ln(n - 1) + 0.5772156649 \\right) - \\frac{2(n - 1)}{n}$$
Di mana $0.5772156649$ adalah konstanta Euler-Mascheroni.

Skor anomali $s(x, n)$ untuk sampel $x$:

$$s(x, n) = 2^{-\\frac{\\mathbb{E}[h(x)]}{c(n)}} \\in [0, 1]$$

Di mana $\\mathbb{E}[h(x)]$ adalah rata-rata kedalaman jalur pohon $x$ melintasi hutan ensemble:
- Jika $\\mathbb{E}[h(x)] \\to 0 \\implies s \\to 1$: Sampel **sangat anomali** (terisolasi di puncak pohon).
- Jika $\\mathbb{E}[h(x)] \\to n - 1 \\implies s \\to 0$: Sampel **sangat normal**.
- Jika $\\mathbb{E}[h(x)] \\to c(n) \\implies s \\to 0.5$: Sampel tidak memiliki indikasi anomali yang jelas.
`,
        },
      ],
    },
    {
      id: "ts-bab-5",
      slug: "validasi-deret-waktu-dan-metrik-evaluasi",
      title: "BAB 5: Validasi Deret Waktu Bebas Bocor & Metrik Evaluasi",
      orderIndex: 5,
      description: "Protokol validasi silang temporal: Walk-Forward Cross-Validation (Expanding vs Rolling Window), pencegahan lookahead bias, dan metrik akurasi (sMAPE, MASE Hyndman).",
      subchapters: [
        {
          id: "ts-bab-5-1",
          slug: "walk-forward-validation-dan-mase",
          title: "5.1. Protokol Walk-Forward Validation & Metrik Bebas Skala MASE",
          orderIndex: 1,
          description: "Mengapa pembagian data acak (K-Fold standar) ilegal pada deret waktu, dan formulasi Mean Absolute Scaled Error (MASE).",
          content_markdown: `# 5.1. Protokol Walk-Forward Validation & Metrik Bebas Skala MASE

## 1. Bahaya Kebocoran Temporal (Temporal Leakage)
Pada data deret waktu, urutan waktu adalah dimensi fundamental. Menggunakan sampel masa depan $t+k$ untuk melatih model yang memprediksi waktu $t$ melanggar kausalitas fisik (*lookahead bias*).
Solusi: **Walk-Forward Validation** di mana data uji selalu berada strictly di masa depan setelah data latih:
$$\\text{Fold } k: \\quad \\mathcal{D}_{\\text{train}} = [1, \\dots, T_k], \\quad \\mathcal{D}_{\\text{test}} = [T_k + 1, \\dots, T_k + H]$$

## 2. Mean Absolute Scaled Error (MASE) (Hyndman & Koehler, 2006)
Metrik seperti MAPE tidak terdefinisi jika ada nilai nol ($y_t = 0$), dan RMSE sangat sensitif terhadap skala satuan data.
MASE membandingkan kesalahan absolut model terhadap kesalahan prediksi naif satu langkah di masa lalu (*naive persistence model*):

$$\\text{MASE} = \\frac{\\frac{1}{H} \\sum_{t=1}^H |y_t - \\hat{y}_t|}{\\frac{1}{T-1} \\sum_{t=2}^T |y_t - y_{t-1}|}$$
- $\\text{MASE} < 1$: Model lebih akurat dibanding estimasi naif.
- $\\text{MASE} > 1$: Model lebih buruk dari sekadar menebak nilai kemarin!
`,
        },
      ],
    },
    {
      id: "ts-bab-6",
      slug: "model-fondasi-deret-waktu",
      title: "BAB 6: Model Fondasi Deret Waktu (Time Series Foundation Models)",
      orderIndex: 6,
      description: "Pergeseran paradigma menuju zero-shot forecasting: Amazon Chronos (Ansari et al. 2024 tokenisasi kuantisasi sekuensial) dan TimeGPT (Garza et al.).",
      subchapters: [
        {
          id: "ts-bab-6-1",
          slug: "arsitektur-amazon-chronos",
          title: "6.1. Arsitektur Amazon Chronos: Merawat Deret Waktu sebagai Bahasa",
          orderIndex: 1,
          description: "Penskalaan dan kuantisasi deret waktu kontinu ke dalam token kamus diskrit berukuran tetap untuk dilatih menggunakan arsitektur T5.",
          content_markdown: `# 6.1. Arsitektur Amazon Chronos: Merawat Deret Waktu sebagai Bahasa

## 1. Paradigma Tokenisasi Deret Waktu (Amazon Chronos, 2024)
Alih-alih melatih model regresi spesifik per dataset, Chronos memperlakukan nilai numerik kontinu persis seperti token kata dalam LLM:
1. **Penskalaan Rata-Rata**: Menormalkan sekuens input dengan membaginya terhadap rata-rata absolut:
   $$\\tilde{y}_t = \\frac{y_t}{\\frac{1}{T}\\sum |y_i|}$$
2. **Kuantisasi Diskrit**: Membagi rentang nilai menjadi $B = 4096$ bin seragam. Setiap titik data dipetakan ke ID token integer diskrit.
3. **Pelatihan Autoregresif**: Arsitektur encoder-decoder (T5) dilatih memaksimalkan Cross-Entropy Loss pada jutaan deret waktu sintetis dan riil.
Mampu melakukan inferensi *zero-shot* pada domain baru tanpa pelatihan ulang.
`,
        },
      ],
    },
    {
      id: "ts-bab-7",
      slug: "proyek-peramalan-dan-deteksi-anomali",
      title: "BAB 7: Proyek Terapan: Pipeline Prediksi Deret Waktu & Deteksi Anomali",
      orderIndex: 7,
      description: "Membangun sistem analisis deret waktu lengkap: implementasi uji stasioneritas differencing, simulasi peramalan AR(1), dan deteksi anomali Isolation Forest terverifikasi.",
      subchapters: [
        {
          id: "ts-bab-7-1",
          slug: "proyek-akhir-ar-dan-isolation-tree-python",
          title: "7.1. Proyek Akhir: Autoregressive Forecaster & Engine Isolation Forest",
          orderIndex: 1,
          description: "Kode Python mandiri: transformasi differencing, solver koefisien AR(1), pembentukan pohon isolasi biner, dan penghitungan skor anomali.",
          content_markdown: `# 7.1. Proyek Akhir: Autoregressive Forecaster & Engine Isolation Forest

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
import numpy as np
import math

# --- Bagian 1: Peramalan Autoregresif Sederhana AR(1) ---
class SimpleAR1Forecaster:
    """Model peramalan linier satu langkah: y_t = phi * y_{t-1} + c"""
    def __init__(self):
        self.phi: float = 0.0
        self.c: float = 0.0

    def fit(self, series: np.ndarray):
        y = series[1:]
        x = series[:-1]
        # Regresi linear kuadrat terkecil untuk phi dan c
        A = np.vstack([x, np.ones(len(x))]).T
        self.phi, self.c = np.linalg.lstsq(A, y, rcond=None)[0]

    def predict(self, last_val: float, steps: int = 3) -> np.ndarray:
        forecast = []
        cur = last_val
        for _ in range(steps):
            next_val = self.phi * cur + self.c
            forecast.append(next_val)
            cur = next_val
        return np.array(forecast)

# --- Bagian 2: Mini Isolation Forest (Deteksi Anomali 1D) ---
class SimpleIsolationTree1D:
    def __init__(self, depth_limit: int = 8):
        self.depth_limit = depth_limit
        self.split_val: float = None
        self.left = None
        self.right = None
        self.size = 0

    def fit(self, X: np.ndarray, current_depth: int = 0):
        self.size = len(X)
        if current_depth >= self.depth_limit or self.size <= 1:
            return

        min_val = np.min(X)
        max_val = np.max(X)
        if min_val == max_val:
            return

        # Pilih titik potong seragam acak
        self.split_val = float(np.random.uniform(min_val, max_val))
        left_mask = X < self.split_val
        right_mask = ~left_mask

        self.left = SimpleIsolationTree1D(self.depth_limit)
        self.left.fit(X[left_mask], current_depth + 1)

        self.right = SimpleIsolationTree1D(self.depth_limit)
        self.right.fit(X[right_mask], current_depth + 1)

    def path_length(self, x: float, current_depth: int = 0) -> float:
        if self.split_val is None or self.size <= 1:
            # c(size) aproksimasi pohon gagal
            return current_depth
        if x < self.split_val:
            return self.left.path_length(x, current_depth + 1)
        else:
            return self.right.path_length(x, current_depth + 1)

def c_factor(n: int) -> float:
    if n <= 1:
        return 1.0
    return 2.0 * (math.log(n - 1) + 0.5772156649) - (2.0 * (n - 1) / n)

# --- Demonstrasi Uji Pipeline Deret Waktu ---
np.random.seed(42)

# 1. Simulasi Deret Waktu AR(1) Stasioner (phi = 0.75, c = 2.0)
n_steps = 200
ts_data = np.zeros(n_steps)
ts_data[0] = 5.0
for t in range(1, n_steps):
    ts_data[t] = 0.75 * ts_data[t-1] + 2.0 + np.random.normal(0, 0.5)

forecaster = SimpleAR1Forecaster()
forecaster.fit(ts_data[:180])
preds = forecaster.predict(ts_data[179], steps=5)

print("=== VERIFIKASI FORECASTING AR(1) ===")
print(f"Koefisien Terestimasi : phi={forecaster.phi:.4f}, c={forecaster.c:.4f}")
print(f"Prediksi 5 Langkah    : {np.round(preds, 2)}")
assert abs(forecaster.phi - 0.75) < 0.10, "Estimasi parameter AR(1) harus mendekati nilai asli."

# 2. Uji Deteksi Anomali dengan Isolation Forest
train_points = ts_data[:180]
# Tambahkan 1 titik lonjakan anomali ekstrem
anomaly_point = 45.0 # Normalnya berkisar antara 6 - 10
normal_point = 8.0

# Bangun Ensemble 20 Isolation Trees
n_trees = 20
trees = [SimpleIsolationTree1D(depth_limit=8) for _ in range(n_trees)]
for tree in trees:
    tree.fit(train_points)

avg_path_normal = np.mean([tree.path_length(normal_point) for tree in trees])
avg_path_anomaly = np.mean([tree.path_length(anomaly_point) for tree in trees])

c_n = c_factor(len(train_points))
score_normal = 2.0 ** (-avg_path_normal / c_n)
score_anomaly = 2.0 ** (-avg_path_anomaly / c_n)

print("\\n=== VERIFIKASI DETEKSI ANOMALI ISOLATION FOREST ===")
print(f"Titik Normal ({normal_point})   : Rata-rata Kedalaman = {avg_path_normal:.2f} | Skor Anomali = {score_normal:.4f}")
print(f"Titik Anomali ({anomaly_point}) : Rata-rata Kedalaman = {avg_path_anomaly:.2f} | Skor Anomali = {score_anomaly:.4f}")

assert score_anomaly > score_normal, "Titik ekstrem harus memiliki skor anomali lebih tinggi!"
assert avg_path_anomaly < avg_path_normal, "Titik ekstrem harus terisolasi pada kedalaman yang jauh lebih dangkal!"
print("=== VERIFIKASI ENGINE TIME SERIES SUKSES ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Pemodelan Parameter Deret Waktu (35%)**: Formulasi kuadrat terkecil autoregresif yang stabil dan akurat.
- **Logika Partisi Isolation Tree (35%)**: Implementasi pemilihan split seragam dan penelusuran rekursif kedalaman jalur.
- **Formulasi Matematika Faktor Normalisasi c(n) (15%)**: Penanganan konstanta Euler-Mascheroni dan kedalaman gagal.
- **Kualitas Kerapian Arsitektur Kode (15%)**: Kode Python modular dengan validasi assertion otomatis.
`,
        },
      ],
    },
  ],
};
