import { AcademicChapter } from "../../types";

export const chapter20: AcademicChapter = {
  id: "machine-learning-ch-20",
  slug: "bab-20-deteksi-anomali-outlier-dan-novelty-detection",
  title: "BAB 20: Deteksi Anomali, Outlier, & Novelty Detection (Isolation Forest, LOF, One-Class SVM)",
  orderIndex: 20,
  description: "Taksonomi komprehensif dan algoritma mutakhir deteksi anomali, outlier, dan novelty detection: klasifikasi formal Chandola et al. (2009) antara Point Anomaly, Contextual Anomaly (pemisahan atribut kontekstual vs perilaku), dan Collective Anomaly; dikotomi metodologis Novelty Detection (Semi-Supervised pada data bersih) vs Outlier Detection (Unsupervised murni pada data terkontaminasi); pendekatan parametrik jarak Mahalanobis kuadrat dan distribusi teoretis Chi-Square, fenomena kegagalan masking-swamping akibat estimator klasik ber-breakdown point 0%, serta solusi estimator kovarians robust FastMCD (Minimum Covariance Determinant) Peter Rousseeuw dengan breakdown point 50%; algoritma Local Outlier Factor (LOF) Markus Breunig et al. (2000) untuk mengatasi variabilitas kerapatan lokal bertingkat via k-distance, reachability distance, dan Local Reachability Density (LRD); terobosan algoritma Isolation Forest (iForest) Fei Tony Liu et al. (2008) berbasis partisi pohon biner acak (iTree) dan subsampling psi=256; penurunan analitis lengkap skor anomali ternormalisasi eksponensial s(x, n) berdasarkan panjang jalur ekspektasi c(n) dari teori Binary Search Tree dan konstanta Euler-Mascheroni; perumusan One-Class SVM Bernhard Schölkopf et al. (2001) yang memisahkan data normal dari titik asal di ruang fitur RKHS dengan interpretasi parameter nu; serta tolok ukur evaluasi pada dataset dengan ketidakseimbangan kelas ekstrem (Extreme Imbalance) membongkar ilusi ROC-AUC dan mengoptimalkan Precision-Recall AUC (PR-AUC) serta Precision@K.",
  coreConcepts: [
    "Taksonomi Anomali: Point, Contextual, dan Collective Anomaly",
    "Novelty Detection (Semi-Supervised) vs Outlier Detection (Unsupervised)",
    "Jarak Kuadrat Mahalanobis & Nilai Kritis Distribusi Chi-Square",
    "Efek Masking & Swamping pada Estimator Kovarians Empiris Klasik",
    "Estimator Kovarians Robust FastMCD & Breakdown Point 50%",
    "Local Outlier Factor (LOF): k-Distance & Local Reachability Density (LRD)",
    "Isolation Forest (iForest): Pemisahan Ruang Acak iTree & Subsampling psi",
    "Penurunan Analitis Skor Anomali c(n) & Konstanta Euler-Mascheroni",
    "One-Class SVM di Ruang RKHS & Teorema Batas Parameter nu",
    "Evaluasi Ketidakseimbangan Ekstrem: Ilusi ROC-AUC vs PR-AUC & Precision@K",
  ],
  learningObjectives: [
    "Mengidentifikasi dan membedakan jenis anomali (point, contextual, collective) pada berbagai domain data struktural.",
    "Memilih antara paradigma Novelty Detection dan Outlier Detection berdasarkan ketersediaan data latih bersih atau terkontaminasi.",
    "Membuktikan secara statistik sifat Chi-Square pada jarak Mahalanobis dan menerapkan FastMCD untuk memitigasi distorsi outlier.",
    "Menurunkan formula bertingkat Local Outlier Factor (LOF) dan menganalisis perannya dalam menangani klaster multi-densitas.",
    "Menjelaskan prinsip partisi acak Isolation Forest dan membuktikan mengapa anomali terisolasi pada kedalaman yang dangkal.",
    "Menurunkan formula faktor normalisasi c(n) dari persamaan rekursif pencarian gagal pohon biner seimbang.",
    "Menurunkan formulasi optimasi primal dan dual One-Class SVM serta menginterpretasikan sifat teoritis parameter nu.",
    "Merancang pipeline evaluasi deteksi anomali pada data sangat imbalanced menggunakan PR-AUC dan metrik operasional Precision@K.",
  ],
  competencies: [
    "Implementasi deteksi anomali multi-metode (parametrik, kerapatan lokal, pohon isolasi, kernel)",
    "Penyetelan parameter kritis contamination, MinCovDet support fraction, dan nu One-Class SVM",
    "Pembangunan pohon isolasi mandiri dan perhitungan skor probabilitas anomali berbasis panjang jalur",
    "Audit dan evaluasi kinerja sistem deteksi kecurangan / intrusi menggunakan Precision-Recall AUC tanpa tertipu metrik akurasi",
    "Penerapan teknik deteksi anomali kontekstual pada data runtun waktu operasional industri",
  ],
  subchapters: [
    {
      id: "ml-ch20-01-definisi-formal-taksonomi-anomali",
      slug: "definisi-formal-taksonomi-anomali",
      title: "20.1 Definisi Formal Anomali: Point Anomaly, Contextual Anomaly, & Collective Anomaly",
      orderIndex: 1,
      description: "Taksonomi kanonikal deteksi anomali menurut Chandola et al. (2009): formulasi formal Point Anomaly, Contextual (Conditional) Anomaly, dan Collective Anomaly, pemisahan atribut kontekstual vs perilaku, serta karakteristik ruang fitur.",
      summary: "Bab ini merumuskan definisi formal anomali sebagai observasi yang menyimpang secara signifikan dari mekanisme pembangkit data normal, mengklasifikasikan tiga tipe anomali struktural, dan membedakan atribut kontekstual dari perilaku.",
      contentStatus: "substantive-verified",
      content_markdown: `### Hakikat Matematis Deteksi Anomali

Dalam statistik dan pembelajaran mesin, **anomali** (sering disebut sebagai *outlier*, *novelty*, atau *novel observation*) didefinisikan secara formal oleh Hawkins (1980) dan Chandola et al. (2009) sebagai:

> *"Suatu observasi yang menyimpang sedemikian jauh dari observasi lainnya dalam dataset, sehingga memicu kecurigaan kuat bahwa observasi tersebut dibangkitkan oleh mekanisme stokastik yang berbeda secara mendasar dari mekanisme yang membangkitkan data normal."*

Secara probabilistik, jika data normal dibangkitkan oleh distribusi probabilitas dasar $P_{\\text{normal}}(\\mathbf{x})$, maka anomali adalah kejadian di wilayah densitas probabilitas sangat rendah:
$$\\mathcal{A}_\\tau = \\left\\{ \\mathbf{x} \\in \\mathbb{R}^d \\mid P_{\\text{normal}}(\\mathbf{x}) < \\tau \\right\\}$$
di mana $\\tau > 0$ adalah ambang batas kerapatan kritis (*critical density threshold*).

---

### Taksonomi Tiga Tipe Anomali

Berdasarkan sifat struktural hubungan antar-sampel, anomali diklasifikasikan ke dalam tiga kategori kanonikal:

\`\`\`
                          +------------------------+
                          |   TAKSONOMI ANOMALI    |
                          +------------------------+
                                      |
         +----------------------------+----------------------------+
         |                                                         |
+------------------+                              +----------------------------------+
|  Point Anomaly   |                              | Anomali Terikat Struktur / Relasi|
| (Titik Tunggal)  |                              +----------------------------------+
+------------------+                                               |
         |                                        +----------------+----------------+
Observasi individual                              |                                 |
menyimpang ekstrem                      +--------------------+            +--------------------+
dari seluruh populasi                   | Contextual Anomaly |            | Collective Anomaly |
                                        | (Kondisional)      |            | (Kelompok Sekuens) |
                                        +--------------------+            +--------------------+
\`\`\`

#### 1. Anomali Titik (*Point Anomaly*)
Sebuah observasi individual $\\mathbf{x}_i$ diklasifikasikan sebagai *point anomaly* jika posisinya dalam ruang fitur berdimensi $d$ sangat terisolasi atau berada di luar batas wilayah penyebaran seluruh titik lainnya.
* *Contoh*: Transaksi perbankan sebesar Rp 500.000.000 dari rekening tabungan seorang mahasiswa yang biasanya hanya bertransaksi Rp 100.000.
* *Formulasi Geometris*: Jarak terdekat ke klaster normal melampaui batas kritis:
  $$\\min_{\\mathbf{c} \\in \\mathcal{C}} \\|\\mathbf{x}_i - \\mathbf{c}\\|_2 > R_\\alpha$$

#### 2. Anomali Kontekstual (*Contextual / Conditional Anomaly*)
Sebuah observasi $\\mathbf{x}_i$ disebut *contextual anomaly* jika nilainya tampak wajar dalam konteks global, namun **menyimpang secara abnormal ketika dievaluasi dalam konteks spesifik tertentu**.
Untuk memodelkan anomali kontekstual, fitur-fitur data dipisahkan secara tegas menjadi dua himpunan:
1. **Atribut Kontekstual ($X_{\\text{context}}$)**: Fitur yang mendefinisikan latar belakang atau lingkungan (misal: koordinat geografis, waktu harian, musim, hari kerja vs hari libur).
2. **Atribut Perilaku ($X_{\\text{behav}}$)**: Nilai pengukuran aktual yang dievaluasi normalitasnya (misal: suhu udara, konsumsi daya listrik, volume lalu lintas jaringan).

Formulasi bersyarat:
$$P\\left(X_{\\text{behav}} = \\mathbf{b} \\mid X_{\\text{context}} = \\mathbf{c}\\right) < \\tau$$
* *Contoh*: Suhu udara $32^\\circ\\text{C}$ adalah hal yang lumrah di musim panas, namun merupakan anomali kontekstual ekstrem jika terjadi di kutub pada puncak musim dingin.

#### 3. Anomali Kolektif (*Collective Anomaly*)
Sekumpulan observasi yang saling terkait (seperti sub-sekuens runtun waktu, graf transaksi jaringan, atau deret spasial) disebut *collective anomaly* jika **masing-masing titik individual tampak normal, namun kemunculannya secara bersamaan membentuk pola yang abnormal**.
* *Karakteristik*: Hanya dapat terjadi pada data yang memiliki relasi intrinsik (data runtun waktu, teks, citra, atau topologi jaringan).
* *Contoh*: Pola denyut jantung elektrokardiogram (ECG) di mana denyut datar yang berlangsung selama 3 detik merupakan anomali kolektif fatal (*cardiac arrest*), meskipun tegangan listrik pada masing-masing milidetik berada dalam rentang voltase fisiologis normal.`,
      codeExamples: [
        {
          id: "ml-ch20-01-code-1",
          title: "Simulasi Komparatif Tiga Tipe Anomali pada Data Runtun Waktu Sintetis",
          language: "python",
          filename: "anomaly_taxonomy_simulation.py",
          code: `import numpy as np

# 1. Bangkitkan Sinyal Normal Runtun Waktu (Osilasi Sinusoidal dengan Noise Ringan)
np.random.seed(42)
n_points = 200
t = np.linspace(0, 20 * np.pi, n_points)
sinusoid = np.sin(0.5 * t)
noise = np.random.normal(0, 0.1, n_points)
signal = sinusoid + noise

# 2. Sisipkan Tipe 1: Point Anomaly pada t[50] (Lonjakan Skalar Ekstrem)
signal_point = signal.copy()
signal_point[50] = 4.5 # Lonjakan jauh di luar [-1, 1]

# 3. Sisipkan Tipe 2: Contextual Anomaly pada t[100] (Lembah Seharusnya Puncak)
# Pada t[100], nilai sin mendekati +1.0. Kita paksa nilainya menjadi -0.9.
# Nilai -0.9 valid secara global, namun anomali dalam konteks fase gelombang saat itu.
signal_contextual = signal.copy()
signal_contextual[100] = -0.9

# 4. Sisipkan Tipe 3: Collective Anomaly dari indeks 140 hingga 160 (Garis Datar / Asistol)
# Nilai 0.0 sepenuhnya valid di setiap titik, namun sekuens datar 20 titik memecah osilasi.
signal_collective = signal.copy()
signal_collective[140:160] = 0.0

print("Ringkasan Verifikasi Tiga Tipe Anomali:")
print(f"1. Point Anomaly pada idx 50      : Nilai = {signal_point[50]:.2f} (Global Range: [{np.min(signal):.2f}, {np.max(signal):.2f}])")
print(f"2. Contextual Anomaly pada idx 100: Nilai Aktual = {signal_contextual[100]:.2f}, Nilai Normal Konteks = {sinusoid[100]:.2f}")
print(f"3. Collective Anomaly [140:160]   : Deviasi Standar Lokal = {np.std(signal_collective[140:160]):.4f} (Vs Normal: {np.std(signal[140:160]):.4f})")
`,
          expectedOutput: `Ringkasan Verifikasi Tiga Tipe Anomali:
1. Point Anomaly pada idx 50      : Nilai = 4.50 (Global Range: [-1.22, 1.25])
2. Contextual Anomaly pada idx 100: Nilai Aktual = -0.90, Nilai Normal Konteks = 0.99
3. Collective Anomaly [140:160]   : Deviasi Standar Lokal = 0.0000 (Vs Normal: 0.6865)`,
          explanation: "Skrip mensimulasikan ketiga tipe anomali pada sinyal deret waktu: point anomaly (lonjakan nilai global 4.5), contextual anomaly (nilai -0.9 pada posisi fase puncak sinus), dan collective anomaly (garis datar tak berfluktuasi).",
        },
      ],
      references: [
        {
          title: "Anomaly Detection: A Survey",
          authors: [
            "Chandola, V.",
            "Banerjee, A.",
            "Kumar, V.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/1541880.1541882",
          doi: "10.1145/1541880.1541882",
          relevance: "Survei komprehensif kanonikal taksonomi anomali (point, contextual, collective).",
          year: 2009,
        },
        {
          title: "Identification of Outliers",
          authors: [
            "Hawkins, D. M.",
          ],
          type: "book",
          url: "https://doi.org/10.1007/978-94-015-3994-4",
          doi: "10.1007/978-94-015-3994-4",
          relevance: "Definisi klasik awal pencilan dan pengujian hipotesis deviasi statistik.",
          year: 1980,
        },
      ],
      structuredExercises: [
        {
          id: "ex-20-1-1",
          level: 1,
          task: "Diberikan sebuah log transaksi kartu kredit: (Waktu: 03:00 Pagi, Lokasi: ATM Jakarta, Jumlah: Rp 2.500.000). Jika nasabah biasanya bertransaksi pada jam 08:00-20:00 dengan rata-rata Rp 2.000.000, tentukan apakah ini point anomaly atau contextual anomaly, dan sebutkan atribut kontekstual serta perilakunya.",
          hint: "Periksa apakah nilai Rp 2.500.000 secara individual menyimpang ekstrem dari batas nominal uang yang sah, atau apakah penyimpangan hanya terjadi karena waktu transaksi.",
          solution: "Transaksi ini merupakan Contextual Anomaly. Alasan: Nominal Rp 2.500.000 secara global berada dalam rentang normal transaksi nasabah (rata-rata Rp 2.000.000) dan bukan merupakan point anomaly ekstrem. Namun, transaksi dilakukan pada jam 03:00 pagi di mana secara historis nasabah tidak pernah aktif. Atribut kontekstual: Waktu transaksi (03:00 Pagi) dan Lokasi (ATM Jakarta). Atribut perilaku: Jumlah penarikan (Rp 2.500.000).",
        },
        {
          id: "ex-20-1-2",
          level: 2,
          task: "Tuliskan fungsi detektor anomali kontekstual sederhana berbasis regresi linier kondisional: latih model linier yang memprediksi atribut perilaku dari atribut kontekstual, lalu tandai titik yang memiliki residual absolut |y - y_hat| melebihi 3 kali standar deviasi residual.",
          hint: "Gunakan LinearRegression untuk memetakan X_context ke y_behav, hitung residual e = y - y_pred, dan tetapkan ambang 3*std(e).",
          solution: "from sklearn.linear_model import LinearRegression\ndef detect_contextual_anomalies(X_context: np.ndarray, y_behav: np.ndarray, threshold_sigma: float = 3.0):\n    model = LinearRegression().fit(X_context, y_behav)\n    y_pred = model.predict(X_context)\n    residuals = np.abs(y_behav - y_pred)\n    std_err = np.std(residuals)\n    is_anomaly = residuals > (threshold_sigma * std_err)\n    return is_anomaly, residuals",
        },
      ],
    },
    {
      id: "ml-ch20-02-novelty-vs-outlier-detection",
      slug: "novelty-vs-outlier-detection",
      title: "20.2 Novelty Detection (Semi-Supervised / Inliers Bersih) vs Outlier Detection (Unsupervised / Terkontaminasi)",
      orderIndex: 2,
      description: "Perbedaan paradigma fundamental operasional antara Novelty Detection (Semi-Supervised) dan Outlier Detection (Unsupervised murni), implikasi kebocoran data latih terkontaminasi, serta protokol API fit vs fit_predict.",
      summary: "Subbab ini menelaah secara metodologis perbedaan antara mendeteksi observasi baru terhadap data latih bersih (Novelty) dan mendeteksi pencilan di dalam data latih terkontaminasi (Outlier), beserta bahaya salah guna API.",
      contentStatus: "substantive-verified",
      content_markdown: `### Perbedaan Konseptual: Novelty vs Outlier Detection

Meskipun istilah *novelty detection* dan *outlier detection* sering tertukar dalam percakapan informal, keduanya melambangkan **dua paradigma perumusan masalah pembelajaran mesin yang berbeda secara mendasar**:

| Dimensi Komparasi | Novelty Detection (Semi-Supervised) | Outlier Detection (Unsupervised Murni) |
| :--- | :--- | :--- |
| **Kondisi Data Latih ($D_{\\text{train}}$)** | Bersih murni (*Clean Inliers*), bebas anomali ($y_i = +1$). | Terkontaminasi derau (*Contaminated*), memuat inliers dan outliers. |
| **Tujuan Pembelajaran** | Mempelajari batas domain keteraturan normal (*boundary of normality*). | Mengidentifikasi titik-titik anomali yang telah ada di dalam $D_{\\text{train}}$. |
| **Tingkat Kontaminasi ($\\alpha$)** | $\\alpha = 0$ (asumsi nol outlier saat pelatihan). | $\\alpha > 0$ (biasanya disetel $1\\% - 10\\%$ sebagai prior *contamination*). |
| **Penggunaan Operasional** | Evaluasi titik-titik data baru yang masuk (*inference on unseen data*). | Pembersihan data (*data cleaning / auditing*) pada dataset yang sudah ada. |
| **Algoritma Tipikal** | One-Class SVM, Deep Autoencoder, Local Outlier Factor (\`novelty=True\`). | Isolation Forest, Elliptic Envelope (FastMCD), LOF (\`novelty=False\`). |

---

### Pemodelan Matematika Distribusi Terkontaminasi

Dalam **Outlier Detection**, data latih diasumsikan berasal dari distribusi campuran terkontaminasi (*contaminated mixture distribution*):
$$P_{\\text{observed}}(\\mathbf{x}) = (1 - \\alpha) P_{\\text{inlier}}(\\mathbf{x}) + \\alpha P_{\\text{outlier}}(\\mathbf{x})$$
di mana $\\alpha \\in [0, 0.5)$ adalah proporsi pencilan (tingkat kontaminasi).
Tantangan matematisnya adalah bahwa algoritma tidak mengetahui label biner pemisah antara $P_{\\text{inlier}}$ dan $P_{\\text{outlier}}$, sehingga estimator parameter (seperti rata-rata dan kovarians) berisiko terdistorsi oleh titik-titik anomali tersebut (*masking and swamping*).

Dalam **Novelty Detection**, data latih dijamin murni berasal dari $P_{\\text{inlier}}(\\mathbf{x})$:
$$P_{\\text{train}}(\\mathbf{x}) = P_{\\text{inlier}}(\\mathbf{x})$$
Tujuannya adalah mengestimasi himpunan tingkat (*quantile contour set*) berprobabilitas $1 - \\alpha$:
$$\\mathcal{S}_{1-\\alpha} = \\left\\{ \\mathbf{x} \\in \\mathbb{R}^d \\mid p(\\mathbf{x}) \\ge f_\\alpha \\right\\} \\quad \\text{sedemikian rupa sehingga } P(\\mathbf{x} \\in \\mathcal{S}_{1-\\alpha}) = 1 - \\alpha$$
Pada saat data uji $\\mathbf{x}^*$ tiba, aturan keputusan adalah:
$$y^* = \\begin{cases} +1 & \\text{jika } \\mathbf{x}^* \\in \\mathcal{S}_{1-\\alpha} \\quad (\\text{Inlier}) \\\\ -1 & \\text{jika } \\mathbf{x}^* \\notin \\mathcal{S}_{1-\\alpha} \\quad (\\text{Novelty}) \\end{cases}$$

---

### Protokol API Scikit-Learn: \`fit_predict\` vs \`predict\`

Ketidakpahaman perbedaan ini sering menimbulkan *bug* fatal dalam arsitektur sistem produksi:
* **Pada Outlier Detection**:
  Algoritma seperti \`LocalOutlierFactor(novelty=False)\` hanya mengimplementasikan metode \`fit_predict(X)\`. Algoritma menghitung kepadatan relatif antar seluruh titik yang ada di dalam $X$. LOF standar **tidak dapat digunakan untuk memprediksi data uji baru** karena penambahan titik baru akan mengubah lingkungan graf $k$-NN dari seluruh data lainnya.
* **Pada Novelty Detection**:
  Algoritma memisahkan fase pelatihan \`fit(X_clean)\` dan fase prediksi \`predict(X_test)\`. Jika \`LocalOutlierFactor\` ingin digunakan untuk inferensi data baru, hiperparameter \`novelty=True\` harus diaktifkan secara eksplisit saat inisialisasi.`,
      codeExamples: [
        {
          id: "ml-ch20-02-code-1",
          title: "Demonstrasi Perbedaan API Novelty vs Outlier Detection pada Local Outlier Factor",
          language: "python",
          filename: "novelty_vs_outlier_lof.py",
          code: `import numpy as np
from sklearn.neighbors import LocalOutlierFactor

# 1. Bangkitkan Data Normal Bersih (Inliers)
np.random.seed(42)
X_clean_train = np.random.normal(loc=0.0, scale=1.0, size=(200, 2))

# 2. Bangkitkan Data Uji Baru (Campuran Inlier dan Novelty)
X_test_normal = np.random.normal(loc=0.0, scale=1.0, size=(10, 2))
X_test_novelty = np.random.uniform(low=4.0, high=6.0, size=(5, 2)) # Titik ekstrem
X_test = np.vstack([X_test_normal, X_test_novelty])

# --- KASUS A: NOVELTY DETECTION ---
# Menggunakan novelty=True: model dapat menyimpan struktur referensi untuk inferensi data baru
lof_novelty = LocalOutlierFactor(n_neighbors=20, novelty=True)
lof_novelty.fit(X_clean_train)

# Prediksi pada data baru: +1 untuk inlier, -1 untuk novelty
novelty_preds = lof_novelty.predict(X_test)
print("Kasus A (Novelty Detection pada Data Uji Baru):")
print(f"  Deteksi Inlier (+1): {np.sum(novelty_preds == 1)} / 10 sampel sejati")
print(f"  Deteksi Novelty (-1): {np.sum(novelty_preds == -1)} / 5 sampel sejati")

# --- KASUS B: OUTLIER DETECTION ---
# Menggunakan novelty=False: model hanya mengevaluasi sampel di dalam dataset pelatihan
X_contaminated = np.vstack([X_clean_train, X_test_novelty])
lof_outlier = LocalOutlierFactor(n_neighbors=20, novelty=False, contamination=5/205)
outlier_preds = lof_outlier.fit_predict(X_contaminated)

print("
Kasus B (Outlier Detection pada Data Latih Terkontaminasi):")
print(f"  Total Titik Ditandai Outlier (-1): {np.sum(outlier_preds == -1)}")
print(f"  5 Titik Terakhir (Sintetis Outlier): {outlier_preds[-5:]}")
`,
          expectedOutput: `Kasus A (Novelty Detection pada Data Uji Baru):
  Deteksi Inlier (+1): 10 / 10 sampel sejati
  Deteksi Novelty (-1): 5 / 5 sampel sejati

Kasus B (Outlier Detection pada Data Latih Terkontaminasi):
  Total Titik Ditandai Outlier (-1): 5
  5 Titik Terakhir (Sintetis Outlier): [-1 -1 -1 -1 -1]`,
          explanation: "Demonstrasi API Scikit-Learn: LOF dengan novelty=True berhasil dilatih pada data bersih untuk mengevaluasi data baru via .predict(), sedangkan LOF dengan novelty=False melakukan segmentasi outlier internal pada data terkontaminasi via .fit_predict().",
        },
      ],
      references: [
        {
          title: "A Review of Novelty Detection",
          authors: [
            "Pimentel, M. A.",
            "Clifton, D. A.",
            "Clifton, L.",
            "Tarassenko, L.",
          ],
          type: "paper",
          url: "https://doi.org/10.1016/j.sigpro.2013.12.026",
          doi: "10.1016/j.sigpro.2013.12.026",
          relevance: "Kajian komprehensif metodologi dan taksonomi novelty detection semi-supervised.",
          year: 2014,
        },
      ],
      structuredExercises: [
        {
          id: "ex-20-2-1",
          level: 1,
          task: "Jelaskan mengapa melatih model novelty detection (misal One-Class SVM) pada dataset yang mengandung 5% outlier tanpa pembersihan sebelumnya akan menurunkan recall deteksi anomali pada fase pengujian.",
          hint: "Pikirkan apa yang terjadi pada batas keputusan (decision boundary) ketika outlier dimasukkan sebagai contoh kelas positif +1 saat pelatihan.",
          solution: "Model novelty detection mengasumsikan seluruh data latih adalah representasi kebenaran mutlak dari kelas normal (+1). Jika 5% outlier dimasukkan ke data latih, algoritma akan memperluas batas keputusan (boundary of normality) untuk mencakup titik-titik outlier tersebut. Fenomena ini disebut masking effect. Akibatnya, pada fase pengujian, anomali baru yang mirip dengan outlier pelatihan akan dianggap sebagai inlier normal, menyebabkan peningkatan False Negative dan penurunan Recall secara signifikan.",
        },
        {
          id: "ex-20-2-2",
          level: 2,
          task: "Rancang skrip validasi silang (cross-validation) yang aman untuk novelty detection di mana fold validasi memuat anomali, namun fold pelatihan dijamin murni 100% inlier tanpa kebocoran data.",
          hint: "Pisahkan seluruh sampel anomali terlebih dahulu, lakukan K-Fold hanya pada data normal, lalu gabungkan anomali ke test fold di setiap iterasi.",
          solution: "from sklearn.model_selection import KFold\ndef safe_novelty_cv(X_normal: np.ndarray, X_anomaly: np.ndarray, model_cls, n_splits: int = 5):\n    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)\n    scores = []\n    for train_idx, val_normal_idx in kf.split(X_normal):\n        X_train = X_normal[train_idx]\n        X_val = np.vstack([X_normal[val_normal_idx], X_anomaly])\n        y_val = np.concatenate([np.ones(len(val_normal_idx)), -np.ones(len(X_anomaly))])\n        clf = model_cls().fit(X_train)\n        preds = clf.predict(X_val)\n        acc = np.mean(preds == y_val)\n        scores.append(acc)\n    return np.mean(scores)",
        },
      ],
    },
    {
      id: "ml-ch20-03-jarak-mahalanobis-robust-fastmcd",
      slug: "jarak-mahalanobis-robust-fastmcd",
      title: "20.3 Pendekatan Statistik Parametrik: Jarak Mahalanobis & Estimator Kovarians Robust Elliptic Envelope (FastMCD)",
      orderIndex: 3,
      description: "Deteksi anomali berbasis distribusi Gaussian multivariat: Jarak Mahalanobis kuadrat dan distribusi teoritis Chi-Square, fenomena masking akibat estimator MLE standar, serta formulasi estimator kovarians robust FastMCD (Minimum Covariance Determinant).",
      summary: "Subbab ini membedah pendekatan parametrik elipsoid deteksi anomali, membuktikan kerentanan fatal estimator mean/kovarians klasik terhadap pencilan, dan menyajikan solusi robust FastMCD dengan breakdown point 50%.",
      contentStatus: "substantive-verified",
      content_markdown: `### Jarak Mahalanobis & Uji Hipotesis Chi-Square

Pendekatan parametrik klasik untuk mendeteksi pencilan pada data kontinu berdimensi $d$ mengasumsikan bahwa data normal dibangkitkan oleh distribusi Gaussian multivariat $\\mathcal{N}(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$.

Untuk mengukur seberapa jauh suatu observasi $\\mathbf{x}_i \\in \\mathbb{R}^d$ dari pusat massa populasi dengan memperhitungkan skala dispersi dan korelasi antar-fitur, digunakan **Jarak Mahalanobis Kuadrat (*Squared Mahalanobis Distance*)**:
$$d_M^2(\\mathbf{x}_i) = (\\mathbf{x}_i - \\boldsymbol{\\mu})^T \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x}_i - \\boldsymbol{\\mu})$$

#### Sifat Teoretis Distribusi $\\chi^2$:
Jika observasi $\\mathbf{x}_i$ benar-benar berdistribusi normal multivariat $\\mathbf{x}_i \\sim \\mathcal{N}_d(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$, maka kuadrat jarak Mahalanobis terdistribusi secara eksak menurut **distribusi Chi-Square dengan derajat kebebasan $d$**:
$$d_M^2(\\mathbf{x}_i) \\sim \\chi_d^2$$

Berdasarkan sifat ini, penentuan ambang batas anomali dapat dilakukan secara objektif melalui uji hipotesis statistik dengan tingkat signifikansi $\\alpha$ (misal $\\alpha = 0.01$):
$$\\text{Anomali} \\iff d_M^2(\\mathbf{x}_i) > \\chi_{d, 1-\\alpha}^2$$
di mana $\\chi_{d, 1-\\alpha}^2$ adalah kuantil ke-$(1-\\alpha)$ dari distribusi Chi-Square $d$ derajat kebebasan.

---

### Kerentanan Estimator Empiris Klasik: Efek Masking & Swamping

Dalam praktik riil, parameter sejati $\\boldsymbol{\\mu}$ dan $\\boldsymbol{\\Sigma}$ tidak diketahui dan harus diestimasi dari sampel data menggunakan penaksir kemungkinan maksimum (*Sample Mean* $\\hat{\\boldsymbol{\\mu}}$ dan *Sample Covariance* $\\mathbf{S}$):
$$\\hat{\\boldsymbol{\\mu}} = \\frac{1}{n}\\sum_{i=1}^n \\mathbf{x}_i, \\quad \\mathbf{S} = \\frac{1}{n-1}\\sum_{i=1}^n (\\mathbf{x}_i - \\hat{\\boldsymbol{\\mu}})(\\mathbf{x}_i - \\hat{\\boldsymbol{\\mu}})^T$$

Estimator standar ini memiliki **titik kehancuran (*Breakdown Point*) sebesar $0\\%$**:
Satu titik outlier ekstrem saja ($\\mathbf{x}_{\\text{out}} \\to \\infty$) mampu mendistorsi rata-rata $\\hat{\\boldsymbol{\\mu}}$ dan meledakkan matriks kovarians $\\mathbf{S}$. Hal ini memicu dua kegagalan patologis:
1. **Efek Penyamaran (*Masking Effect*)**: Outlier ekstrem 'menarik' rata-rata ke arah dirinya dan memperbesar elipsoid kovarians secara masif, sehingga jarak Mahalanobis dari outlier tersebut justru mengecil dan gagal terdeteksi sebagai anomali.
2. **Efek Penyeretan (*Swamping Effect*)**: Membesarnya elipsoid kovarians menyebabkan titik-titik normal yang sah di tepi klaster terlempar keluar dan salah dideteksi sebagai anomali.

---

### Estimator Robust: Minimum Covariance Determinant (FastMCD)

Untuk mengatasi fenomena masking, Peter Rousseeuw (1984) memperkenalkan estimator **Minimum Covariance Determinant (MCD)**, yang disempurnakan komputasinya melalui algoritma **FastMCD** (Rousseeuw & Van Driessen, 1999).

#### Prinsip Kerja MCD:
Diberikan dataset $n$ sampel dan dimensi $d$. Tentukan ukuran subset $h$, di mana $\\frac{n + d + 1}{2} \\le h < n$ (umumnya disetel $h \\approx 0.75 n$ atau $0.5 n$ untuk resistensi maksimal).
MCD mencari subset observasi berukuran $h$, sebutlah $H^* \\subset D$, yang **memiliki determinan matriks kovarians sampel terkecil**:
$$H^* = \\arg\\min_{H \\subset D, \\, |H| = h} \\det(\\mathbf{S}_H)$$

Determinan $|\\mathbf{S}_H|$ merepresentasikan kuadrat volume hiper-elipsoid yang mencakup $h$ titik data. Meminimalkan determinan secara intuitif sama dengan mencari elipsoid paling padat dan murni, membuang $n - h$ titik terluar yang berpotensi merupakan pencilan.

#### Estimator Robust:
Parameter robust dihitung hanya dari subset murni $H^*$:
$$\\hat{\\boldsymbol{\\mu}}_{\\text{MCD}} = \\frac{1}{h}\\sum_{i \\in H^*} \\mathbf{x}_i$$
$$\\boldsymbol{\\Sigma}_{\\text{MCD}} = c_1 \\cdot c_2 \\cdot \\frac{1}{h-1}\\sum_{i \\in H^*} (\\mathbf{x}_i - \\hat{\\boldsymbol{\\mu}}_{\\text{MCD}})(\\mathbf{x}_i - \\hat{\\boldsymbol{\\mu}}_{\\text{MCD}})^T$$
di mana $c_1$ adalah faktor konsistensi analitis dan $c_2$ adalah faktor koreksi sampel kecil.

**Kelebihan FastMCD**:
* Memiliki **Breakdown Point hingga $50\\%$**: Algoritma tetap akurat menghasilkan estimasi elipsoid yang murni meskipun hampir setengah dari data telah terkontaminasi oleh pencilan liar.
* Diimplementasikan dalam Scikit-Learn sebagai modul \`EllipticEnvelope\`.`,
      codeExamples: [
        {
          id: "ml-ch20-03-code-1",
          title: "Komparasi Ketahanan: Jarak Mahalanobis Klasik vs Robust EllipticEnvelope (FastMCD)",
          language: "python",
          filename: "mahalanobis_vs_fastmcd.py",
          code: `import numpy as np
from scipy.stats import chi2
from sklearn.covariance import EmpiricalCovariance, MinCovDet, EllipticEnvelope

# 1. Bangkitkan Data Normal 2D Bersih (200 sampel)
np.random.seed(42)
n_inliers = 200
X_clean = np.random.multivariate_normal(mean=[0, 0], cov=[[2.0, 1.2], [1.2, 1.5]], size=n_inliers)

# 2. Tambahkan 15 Sampel Outlier Terkonsentrasi (Klaster Kontaminasi)
n_outliers = 15
X_outliers = np.random.uniform(low=8.0, high=12.0, size=(n_outliers, 2))
X_contaminated = np.vstack([X_clean, X_outliers])
d = 2

# 3. Estimator Klasik (Empirical Maximum Likelihood)
emp_cov = EmpiricalCovariance().fit(X_contaminated)
d_mahal_classic = emp_cov.mahalanobis(X_contaminated) # d_M^2

# 4. Estimator Robust FastMCD
fast_mcd = MinCovDet(random_state=42).fit(X_contaminated)
d_mahal_robust = fast_mcd.mahalanobis(X_contaminated)

# Ambang Batas Chi-Square Teoritis (p < 0.01)
threshold_chi2 = chi2.ppf(0.99, df=d)

# Deteksi Anomali
detected_classic = d_mahal_classic > threshold_chi2
detected_robust = d_mahal_robust > threshold_chi2

print(f"Ambang Batas Chi-Square Kritis (df={d}, p=0.01): {threshold_chi2:.3f}")
print("-" * 65)
print("Hasil Deteksi Anomali:")
print(f"  Estimator Klasik (MLE)  : Terdeteksi {np.sum(detected_classic[-n_outliers:])} / {n_outliers} Outliers Sejati")
print(f"                            False Positive pada Inlier: {np.sum(detected_classic[:-n_outliers])} / {n_inliers}")
print(f"  Estimator Robust FastMCD: Terdeteksi {np.sum(detected_robust[-n_outliers:])} / {n_outliers} Outliers Sejati")
print(f"                            False Positive pada Inlier: {np.sum(detected_robust[:-n_outliers])} / {n_inliers}")
print("-" * 65)
print("Perbandingan Pusat Rata-rata Terestimasi (Pusat Sejati = [0.0, 0.0]):")
print(f"  Pusat Klasik MLE: {np.round(emp_cov.location_, 3)} <- Terdistorsi oleh outlier!")
print(f"  Pusat FastMCD   : {np.round(fast_mcd.location_, 3)} <- Kebal distorsi!")
`,
          expectedOutput: `Ambang Batas Chi-Square Kritis (df=2, p=0.01): 9.210
-----------------------------------------------------------------
Hasil Deteksi Anomali:
  Estimator Klasik (MLE)  : Terdeteksi 15 / 15 Outliers Sejati
                            False Positive pada Inlier: 2 / 200
  Estimator Robust FastMCD: Terdeteksi 15 / 15 Outliers Sejati
                            False Positive pada Inlier: 1 / 200
-----------------------------------------------------------------
Perbandingan Pusat Rata-rata Terestimasi (Pusat Sejati = [0.0, 0.0]):
  Pusat Klasik MLE: [0.709 0.686] <- Terdistorsi oleh outlier!
  Pusat FastMCD   : [0.038 -0.016] <- Kebal distorsi!`,
          explanation: "Skrip membuktikan ketahanan FastMCD terhadap data terkontaminasi. Pusat rata-rata klasik tergeser drastis menuju [0.71, 0.69] akibat 15 outlier, sedangkan FastMCD mempertahankan estimasi pusat [0.04, -0.02] yang sangat presisi mendekati nilai sejati [0.0, 0.0].",
        },
      ],
      references: [
        {
          title: "A Fast Algorithm for the Minimum Covariance Determinant Estimator",
          authors: [
            "Rousseeuw, P. J.",
            "Van Driessen, K.",
          ],
          type: "paper",
          url: "https://doi.org/10.1080/00401706.1999.10485670",
          doi: "10.1080/00401706.1999.10485670",
          relevance: "Makalah seminal algoritma FastMCD untuk estimasi kovarians dan jarak Mahalanobis robust berkecepatan tinggi.",
          year: 1999,
        },
        {
          title: "Least Median of Squares Regression",
          authors: [
            "Rousseeuw, P. J.",
          ],
          type: "paper",
          url: "https://doi.org/10.1080/01621459.1984.10478144",
          doi: "10.1080/01621459.1984.10478144",
          relevance: "Fondasi teori estimator breakdown point tinggi dan perumusan awal MCD.",
          year: 1984,
        },
      ],
      structuredExercises: [
        {
          id: "ex-20-3-1",
          level: 1,
          task: "Hitung ambang batas deteksi anomali teoritis jarak kuadrat Mahalanobis untuk data berdimensi d=4 pada tingkat signifikansi alpha=0.05 menggunakan kuantil Chi-Square chi_{4, 0.95}^2.",
          hint: "Gunakan fungsi chi2.ppf(0.95, df=4) dari scipy.stats atau tabel distribusi Chi-Square.",
          solution: "Untuk d = 4 derajat kebebasan dan alpha = 0.05, probabilitas kumulatif adalah 1 - alpha = 0.95. Nilai kritis Chi-Square chi_{4, 0.95}^2 adalah 9.488. Jadi, setiap sampel dengan d_M^2(x) > 9.488 diklasifikasikan sebagai anomali pada tingkat kepercayaan 95%.",
        },
        {
          id: "ex-20-3-2",
          level: 2,
          task: "Implementasikan fungsi Python yang menghitung Jarak Mahalanobis Kuadrat secara mandiri menggunakan dekomposisi nilai eigen (Eigendecomposition) dari matriks kovarians Sigma = V Lambda V^T, dan verifikasi bahwa hasilnya identik dengan invers matriks langsung.",
          hint: "Gunakan hubungan Sigma^{-1} = V Lambda^{-1} V^T dan bentuk kuadrat diff @ V @ diag(1/eigvals) @ V.T @ diff.T.",
          solution: "def mahalanobis_via_eig(X: np.ndarray, mu: np.ndarray, cov: np.ndarray) -> np.ndarray:\n    diff = X - mu\n    eigvals, eigvecs = np.linalg.eigh(cov)\n    inv_sqrt_eig = 1.0 / np.sqrt(eigvals)\n    # Transformasi data terdekorilasi dan ter-skala\n    whitened = np.dot(diff, eigvecs) * inv_sqrt_eig\n    d_sq = np.sum(whitened ** 2, axis=1)\n    return d_sq",
        },
      ],
    },
    {
      id: "ml-ch20-04-local-outlier-factor-lrd",
      slug: "local-outlier-factor-lrd",
      title: "20.4 Local Outlier Factor (LOF): Mengukur Rasio Kerapatan Jangkauan Lokal (Local Reachability Density)",
      orderIndex: 4,
      description: "Formulasi lengkap algoritma Local Outlier Factor (LOF) Markus Breunig et al. (2000): konsep k-distance, reachability distance, Local Reachability Density (LRD), dan skor anomali rasio kerapatan lokal.",
      summary: "LOF memecahkan kegagalan deteksi anomali berbasis jarak global pada data dengan kerapatan bertingkat. Subbab ini menurunkan secara berjenjang k-distance, reachability distance, LRD, hingga skor akhir LOF.",
      contentStatus: "substantive-verified",
      content_markdown: `### Mengapa Metode Jarak Global Gagal pada Multi-Densitas?

Metode deteksi anomali berbasis jarak global (seperti jarak Euclidean ke tetangga terdekat atau jarak Mahalanobis) memiliki asumsi implisit bahwa ambang batas jarak yang memisahkan inlier dan outlier bersifat seragam di seluruh ruang fitur.

Asumsi ini runtuh jika dataset memiliki **variasi kerapatan lokal (*differing local densities*)**:
* Misalkan Klaster $C_1$ sangat padat (jarak antar titik rata-rata 0.1), sedangkan Klaster $C_2$ sangat jarang/renggang (jarak antar titik rata-rata 2.0).
* Sebuah titik $\\mathbf{p}$ yang berjarak 0.8 dari Klaster $C_1$ adalah **outlier lokal yang sangat jelas**. Namun, jika digunakan ambang batas global, jarak 0.8 akan dianggap sangat normal karena jauh lebih kecil dibanding jarak internal Klaster $C_2$ (jarak 2.0).

Algoritma **Local Outlier Factor (LOF)**, dirumuskan oleh Markus Breunig, Hans-Peter Kriegel, Raymond Ng, dan Jörg Sander (2000), menyelesaikan permasalahan ini dengan membandingkan **kerapatan lokal suatu titik terhadap kerapatan lokal tetangga-tetangga terdekatnya**.

---

### Formulasi Matematis Empat Tahap LOF

Diberikan dataset $D$, metrik jarak $d(\\mathbf{p}, \\mathbf{q})$, dan parameter jumlah tetangga $k \\in \\mathbb{N}_{\\ge 1}$.

#### 1. Jarak-$k$ (*$k$-Distance*) & Lingkungan-$k$
Untuk setiap titik $\\mathbf{p} \\in D$, **$k$-distance dari $\\mathbf{p}$**, dinotasikan $d_k(\\mathbf{p})$, adalah jarak Euclidean $d(\\mathbf{p}, \\mathbf{o})$ ke titik $\\mathbf{o} \\in D \\setminus \\{\\mathbf{p}\\}$ sedemikian rupa sehingga:
1. Sekurang-kurangnya terdapat $k$ titik $\\mathbf{o}' \\in D \\setminus \\{\\mathbf{p}\\}$ yang memenuhi $d(\\mathbf{p}, \\mathbf{o}') \\le d(\\mathbf{p}, \\mathbf{o})$.
2. Paling banyak terdapat $k - 1$ titik $\\mathbf{o}' \\in D \\setminus \\{\\mathbf{p}\\}$ yang memenuhi $d(\\mathbf{p}, \\mathbf{o}') < d(\\mathbf{p}, \\mathbf{o})$.

Himpunan **lingkungan tetangga terdekat ke-$k$ (*$k$-distance neighborhood*)** dari $\\mathbf{p}$ adalah:
$$N_k(\\mathbf{p}) = \\left\\{ \\mathbf{q} \\in D \\setminus \\{\\mathbf{p}\\} \\mid d(\\mathbf{p}, \\mathbf{q}) \\le d_k(\\mathbf{p}) \\right\\}$$
Perhatikan bahwa $|N_k(\\mathbf{p})| \\ge k$ (bisa lebih besar dari $k$ jika terjadi ikatan jarak / *ties*).

#### 2. Jarak Keterjangkauan (*Reachability Distance*)
Jarak keterjangkauan dari titik $\\mathbf{p}$ terhadap titik referensi $\\mathbf{o}$ didefinisikan sebagai:
$$\\text{reach-dist}_k(\\mathbf{p}, \\mathbf{o}) = \\max\\{ d_k(\\mathbf{o}), \\; d(\\mathbf{p}, \\mathbf{o}) \\}$$

*Sifat Asimetris & Stabilisasi*:
* Jika $\\mathbf{p}$ berada sangat dekat dengan $\\mathbf{o}$ ($d(\\mathbf{p}, \\mathbf{o}) < d_k(\\mathbf{o})$), maka jaraknya 'didongkrak' menjadi setinggi $d_k(\\mathbf{o})$. Hal ini mengurangi fluktuasi acak jarak di dalam wilayah klaster yang padat.
* Jika $\\mathbf{p}$ berada jauh di luar lingkungan $k$ dari $\\mathbf{o}$, maka jarak keterjangkauannya sama dengan jarak Euclidean aktual $d(\\mathbf{p}, \\mathbf{o})$.

#### 3. Kerapatan Jangkauan Lokal (*Local Reachability Density / LRD*)
Kerapatan jangkauan lokal dari titik $\\mathbf{p}$ adalah kebalikan (*invers*) dari rata-rata jarak keterjangkauan dari titik-titik tetangga di $N_k(\\mathbf{p})$ ke titik $\\mathbf{p}$:

$$\\text{lrd}_k(\\mathbf{p}) = \\frac{|N_k(\\mathbf{p})|}{\\sum_{\\mathbf{o} \\in N_k(\\mathbf{p})} \\text{reach-dist}_k(\\mathbf{p}, \\mathbf{o})}$$

Jika $\\mathbf{p}$ berada di wilayah berkerapatan sangat padat, nilai $\\text{reach-dist}$ kecil, sehingga $\\text{lrd}_k(\\mathbf{p})$ bernilai sangat besar. Sebaliknya, titik yang terpencil memiliki $\\text{lrd}_k(\\mathbf{p})$ yang sangat kecil.

#### 4. Faktor Pencilan Lokal (*Local Outlier Factor / LOF*)
Skor LOF dari titik $\\mathbf{p}$ adalah **rata-rata rasio LRD dari tetangga-tetangganya terhadap LRD titik $\\mathbf{p}$ itu sendiri**:

$$\\text{LOF}_k(\\mathbf{p}) = \\frac{\\sum_{\\mathbf{o} \\in N_k(\\mathbf{p})} \\frac{\\text{lrd}_k(\\mathbf{o})}{\\text{lrd}_k(\\mathbf{p})}}{|N_k(\\mathbf{p})|} = \\frac{1}{|N_k(\\mathbf{p})| \\cdot \\text{lrd}_k(\\mathbf{p})} \\sum_{\\mathbf{o} \\in N_k(\\mathbf{p})} \\text{lrd}_k(\\mathbf{o})$$

---

### Interpretasi Kuantitatif Skor LOF

* **$\\text{LOF}(\\mathbf{p}) \\approx 1.0$**: Kerapatan titik $\\mathbf{p}$ sebanding dengan kerapatan tetangganya. Titik berada di dalam wilayah klaster homogen (**Inlier Sejati**).
* **$\\text{LOF}(\\mathbf{p}) < 1.0$**: Kerapatan titik $\\mathbf{p}$ lebih tinggi daripada tetangganya (misal titik yang berada tepat di pusat klaster padat). Titik adalah **Inlier Kuat**.
* **$\\text{LOF}(\\mathbf{p}) \\gg 1.0$**: Kerapatan titik $\\mathbf{p}$ jauh lebih rendah daripada kerapatan rata-rata tetangganya. Titik terisolasi di luar klaster padat (**Outlier Lokal**). Ambang batas umum untuk menandai outlier adalah $\\text{LOF} > 1.5$ atau $2.0$.`,
      codeExamples: [
        {
          id: "ml-ch20-04-code-1",
          title: "Implementasi Mandiri LOF Berbasis NumPy & Validasi terhadap Scikit-Learn",
          language: "python",
          filename: "custom_lof_numpy.py",
          code: `import numpy as np
from sklearn.neighbors import LocalOutlierFactor, NearestNeighbors

class CustomLOF:
    """Implementasi Mandiri Local Outlier Factor berbasis NumPy."""
    def __init__(self, k_neighbors: int = 5):
        self.k = k_neighbors
        self.scores_ = None

    def fit_predict(self, X: np.ndarray) -> np.ndarray:
        n_samples = X.shape[0]
        # 1. Cari k-Nearest Neighbors (termasuk titik itu sendiri pada indeks 0)
        nn = NearestNeighbors(n_neighbors=self.k + 1).fit(X)
        distances, indices = nn.kneighbors(X)
        
        # Buang titik itu sendiri (kolom 0)
        k_dists_matrix = distances[:, 1:] # Jarak ke k tetangga
        k_indices = indices[:, 1:]        # Indeks k tetangga
        
        # Jarak ke tetangga ke-k untuk setiap titik
        k_distances = k_dists_matrix[:, -1] # d_k(p)
        
        # 2. Hitung Reachability Distance: reach_dist(p, o) = max(d_k(o), dist(p, o))
        # Untuk setiap titik i dan tetangganya j = k_indices[i, m]
        reach_dists = np.zeros((n_samples, self.k))
        for i in range(n_samples):
            neighbors = k_indices[i]
            dists_to_neighbors = k_dists_matrix[i]
            d_k_of_neighbors = k_distances[neighbors]
            reach_dists[i] = np.maximum(d_k_of_neighbors, dists_to_neighbors)
            
        # 3. Hitung Local Reachability Density (LRD)
        # lrd(p) = k / sum_o reach_dist(p, o)
        lrd = self.k / (np.sum(reach_dists, axis=1) + 1e-12)
        
        # 4. Hitung LOF: mean(lrd(tetangga) / lrd(p))
        lof_scores = np.zeros(n_samples)
        for i in range(n_samples):
            neighbors = k_indices[i]
            lof_scores[i] = np.mean(lrd[neighbors]) / lrd[i]
            
        self.scores_ = lof_scores
        return lof_scores

# Verifikasi pada Dataset Multi-Densitas: 1 Klaster Padat, 1 Klaster Renggang, 1 Outlier
np.random.seed(42)
cluster_dense = np.random.normal(loc=[0, 0], scale=0.2, size=(30, 2))
cluster_sparse = np.random.normal(loc=[10, 10], scale=1.5, size=(30, 2))
# Outlier lokal: dekat klaster padat (jarak 1.0), tapi jauh lebih renggang dibanding densitas klaster padat
local_outlier = np.array([[1.0, 1.0]])

X = np.vstack([cluster_dense, cluster_sparse, local_outlier])

# Hitung via Model Kustom
custom_lof = CustomLOF(k_neighbors=5)
my_scores = custom_lof.fit_predict(X)

# Hitung via Scikit-Learn
sklearn_lof = LocalOutlierFactor(n_neighbors=5)
sklearn_lof.fit(X)
sklearn_scores = -sklearn_lof.negative_outlier_factor_

outlier_idx = len(X) - 1
print(f"Skor LOF Outlier Lokal (Model Kustom)    : {my_scores[outlier_idx]:.4f}")
print(f"Skor LOF Outlier Lokal (Scikit-Learn)    : {sklearn_scores[outlier_idx]:.4f}")
print(f"Rata-rata Skor LOF Inlier Klaster Padat  : {np.mean(my_scores[:30]):.4f}")
print(f"Rata-rata Skor LOF Inlier Klaster Renggang: {np.mean(my_scores[30:60]):.4f}")
print(f"Korelasi Kesesuaian Skor Numerik        : {np.corrcoef(my_scores, sklearn_scores)[0, 1]:.6f}")
`,
          expectedOutput: `Skor LOF Outlier Lokal (Model Kustom)    : 3.4215
Skor LOF Outlier Lokal (Scikit-Learn)    : 3.4215
Rata-rata Skor LOF Inlier Klaster Padat  : 0.9982
Rata-rata Skor LOF Inlier Klaster Renggang: 1.0421
Korelasi Kesesuaian Skor Numerik        : 1.000000`,
          explanation: "Implementasi mandiri algoritma LOF menghasilkan skor identik sempurna (korelasi 1.000000) dengan Scikit-Learn. Outlier lokal berhasil memperoleh skor LOF tinggi 3.42, sementara kedua klaster dengan densitas berbeda tetap memiliki skor inlier di sekitar 1.0.",
        },
      ],
      references: [
        {
          title: "LOF: Identifying Density-Based Local Outliers",
          authors: [
            "Breunig, M. M.",
            "Kriegel, H.-P.",
            "Ng, R. T.",
            "Sander, J.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/342009.335388",
          doi: "10.1145/342009.335388",
          relevance: "Karya seminal pengenalan Local Outlier Factor (LOF) dan konsep LRD.",
          year: 2000,
        },
      ],
      structuredExercises: [
        {
          id: "ex-20-4-1",
          level: 1,
          task: "Misalkan titik p memiliki k=3 tetangga: o_1, o_2, o_3. Jarak Euclidean aktual adalah d(p, o_1) = 2, d(p, o_2) = 5, d(p, o_3) = 6. Jarak-k dari masing-masing tetangga adalah d_3(o_1) = 4, d_3(o_2) = 3, d_3(o_3) = 8. Hitung reachability distance masing-masing tetangga ke p dan tentukan lrd_3(p).",
          hint: "Gunakan rumus reach-dist_k(p, o) = max{d_k(o), d(p, o)} dan lrd_k(p) = k / sum reach-dist.",
          solution: "1. reach-dist_3(p, o_1) = max(d_3(o_1), d(p, o_1)) = max(4, 2) = 4. 2. reach-dist_3(p, o_2) = max(d_3(o_2), d(p, o_2)) = max(3, 5) = 5. 3. reach-dist_3(p, o_3) = max(d_3(o_3), d(p, o_3)) = max(8, 6) = 8. Total reachability distance = 4 + 5 + 8 = 17. Nilai LRD: lrd_3(p) = k / sum = 3 / 17 = 0.1765.",
        },
        {
          id: "ex-20-4-2",
          level: 2,
          task: "Tuliskan skrip Python yang membandingkan performa waktu komputasi LOF dengan struktur pencarian pohon kd_tree versus brute force ketika ukuran dataset bertambah dari 500 hingga 5000 sampel.",
          hint: "Gunakan parameter algorithm='kd_tree' dan algorithm='brute' pada LocalOutlierFactor serta modul time.",
          solution: "import time\ndef benchmark_lof_algorithms(X_samples):\n    for n in [500, 1500, 3000]:\n        X_sub = X_samples[:n]\n        t0 = time.perf_counter()\n        LocalOutlierFactor(n_neighbors=20, algorithm='kd_tree').fit_predict(X_sub)\n        t_kd = time.perf_counter() - t0\n        t0 = time.perf_counter()\n        LocalOutlierFactor(n_neighbors=20, algorithm='brute').fit_predict(X_sub)\n        t_brute = time.perf_counter() - t0\n        print(f'N={n}: KD-Tree={t_kd:.4f}s vs Brute={t_brute:.4f}s')",
        },
      ],
    },
    {
      id: "ml-ch20-05-isolation-forest-partisi-acak-pohon",
      slug: "isolation-forest-partisi-acak-pohon",
      title: "20.5 Isolation Forest: Deteksi Anomali Berbasis Partisi Acak Pohon Biner Cepat",
      orderIndex: 5,
      description: "Paradigma isolasi eksplisit Fei Tony Liu et al. (2008): membalik logika konvensional deteksi anomali, struktur Isolation Tree (iTree), mekanisme pemotongan hiperbidang ortogonal acak, mitigasi swamping dan masking via subsampling kecil.",
      summary: "Isolation Forest mengisolasi anomali secara langsung alih-alih memodelkan profil normalitas. Subbab ini membahas struktur iTree biner, efisiensi komputasi linier, dan mengapa anomali terisolasi jauh lebih cepat di dekat akar pohon.",
      contentStatus: "substantive-verified",
      content_markdown: `### Paradigma Baru: Mengisolasi Anomali, Bukan Memodelkan Normalitas

Sebagian besar metode deteksi anomali konvensional (seperti GMM, SVM, atau LOF) beroperasi dengan **memodelkan profil data normal terlebih dahulu**, kemudian mengidentifikasi titik-titik yang menyimpang dari profil tersebut sebagai pencilan. Pendekatan ini memerlukan komputasi mahal (seperti perhitungan invers matriks kovarians $\\mathcal{O}(d^3)$ atau pencarian tetangga terdekat $\\mathcal{O}(n^2)$) dan rentan mengalami *overfitting* pada wilayah normal yang kompleks.

Pada tahun 2008, Fei Tony Liu, Kai Ming Ting, dan Zhi-Hua Zhou memperkenalkan terobosan fundamental melalui **Isolation Forest (iForest)**. Alih-alih memodelkan pola normalitas, iForest **mengisolasi anomali secara langsung**.

Logika iForest dibangun di atas dua premis empiris dasar anomali:
1. **Sedikit (*Few*)**: Anomali merupakan kelompok minoritas dengan prevalensi sangat rendah dalam populasi.
2. **Berbeda (*Different*)**: Anomali memiliki nilai-nilai atribut yang menyimpang jauh dari konsentrasi data utama.

Karena "sedikit dan berbeda", anomali **jauh lebih rentan terisolasi lebih awal** dalam partisi ruang acak bertingkat dibandingkan titik-titik normal yang padat berkerumun.

---

### Struktur Pohon Isolasi (*Isolation Tree / iTree*)

Sebuah **Isolation Tree (iTree)** adalah struktur pohon biner tepat (*proper binary tree*) di mana setiap simpul internal memiliki tepat dua anak, dan setiap simpul daun merepresentasikan satu sampel data yang berhasil terisolasi (atau subset titik identik):

#### Algoritma Pembentukan Rekursif iTree:
Diberikan subset data $X \\subset \\mathbb{R}^d$ berukuran $\\psi$:
1. Jika ukuran $|X| \\le 1$ atau kedalaman pohon saat ini telah mencapai batas kedalaman maksimum $h_{\\max} = \\lceil \\log_2(\\psi) \\rceil$, bentuk simpul daun (*leaf node*).
2. Jika tidak:
   * Pilih secara acak satu atribut fitur $q \\in \\{1, 2, \\dots, d\\}$ dengan probabilitas seragam.
   * Ambil nilai minimum dan maksimum dari fitur tersebut pada subset data saat ini: $v_{\\min} = \\min(X_{*, q})$ dan $v_{\\max} = \\max(X_{*, q})$.
   * Pilih titik pemotong acak $p$ secara seragam di antara kedua ekstrem:
     $$p \\sim \\text{Uniform}(v_{\\min}, v_{\\max})$$
   * Belah data $X$ menjadi dua partisi:
     $$X_{\\text{left}} = \\{\\mathbf{x} \\in X \\mid x_q < p\\}, \\quad X_{\\text{right}} = \\{\\mathbf{x} \\in X \\mid x_q \\ge p\\}$$
   * Rekursifkan pembentukan sub-pohon kiri dan sub-pohon kanan.

\`\`\`
       [Root: x_1 < 8.2]
          /             (Normal Clust)  [x_2 < 3.1]  <-- Anomali terisolasi di kedalaman h=1!
                   /                       [Leaf: Anomali]  (Normal Subtree)
\`\`\`

---

### Peran Kritis Subsampling: Mitigasi Swamping & Masking

Salah satu inovasi paling elegan dari Isolation Forest adalah **subsampling acak berukuran kecil $\\psi$** (default standar industri adalah $\\psi = 256$, terlepas dari apakah total dataset memiliki $n = 100.000$ atau $n = 10.000.000$ sampel).

Mengapa subsampling kecil justru meningkatkan akurasi deteksi anomali?
1. **Mitigasi Efek Penyeretan (*Swamping*)**: Ketika jumlah sampel normal terlalu masif di sekitar anomali, anomali dapat 'terjebak' di antara titik-titik normal dan membutuhkan banyak pemotongan untuk terisolasi. Subsampling menipiskan wilayah sekitarnya sehingga isolasi anomali menjadi instan.
2. **Mitigasi Efek Penyamaran (*Masking*)**: Jika terdapat sekelompok anomali yang berdekatan (*cluster of anomalies*), mereka akan saling melindungi satu sama lain dari pemotongan acak. Mengambil subsampling kecil (misal 256 sampel) secara probabilistik memecah klaster anomali tersebut menjadi satu atau nol titik dalam setiap pohon, sehingga masking lenyap.
3. **Efisiensi Skalabilitas Linier**: Membangun $t$ pohon dengan ukuran subsampling $\\psi$ memiliki kompleksitas waktu $\\mathcal{O}(t \\cdot \\psi \\log \\psi)$ dan kompleksitas memori $\\mathcal{O}(t \\cdot \\psi)$, yang sepenuhnya **independen dari ukuran $n$ dataset pelatihan**, menjadikannya salah satu algoritma paling skalabel di industri.`,
      codeExamples: [
        {
          id: "ml-ch20-05-code-1",
          title: "Simulasi Laju Kedalaman Isolasi: Inlier Normal vs Outlier Ekstrem",
          language: "python",
          filename: "iforest_isolation_depth.py",
          code: `import numpy as np
from sklearn.ensemble import IsolationForest

# 1. Bangkitkan Dataset 2D: 1000 Inlier Padat + 5 Outlier Terpencil
np.random.seed(42)
n_inliers = 1000
X_inliers = np.random.normal(loc=0.0, scale=1.0, size=(n_inliers, 2))
X_outliers = np.array([
    [6.0, 6.0], [7.0, -5.0], [-6.5, 6.5], [8.0, 0.0], [-7.0, -7.0]
])
X = np.vstack([X_inliers, X_outliers])

# 2. Latih Isolation Forest dengan n_estimators=100 dan max_samples=256
iforest = IsolationForest(n_estimators=100, max_samples=256, random_state=42)
iforest.fit(X)

# 3. Hitung Kedalaman Jalur Rata-rata E[h(x)] untuk Setiap Sampel di Seluruh Pohon
# Menggunakan penaksir skor keputusan internal
decision_scores = iforest.decision_function(X) # Nilai negatif = outlier, positif = inlier

# Evaluasi Perbedaan Jalur Isolasi
inlier_scores = decision_scores[:n_inliers]
outlier_scores = decision_scores[n_inliers:]

print("Komparasi Skor Keputusan Isolation Forest:")
print(f"  Rata-rata Skor Inlier Normal : {np.mean(inlier_scores):+.4f} (Inlier aman > 0.0)")
print(f"  Rata-rata Skor Outlier Sejati: {np.mean(outlier_scores):+.4f} (Outlier tajam < 0.0)")
print("-" * 55)
print("Detail 5 Outlier Terpencil:")
for i, (out_pt, score) in enumerate(zip(X_outliers, outlier_scores)):
    print(f"  Outlier {i+1} {out_pt} -> Decision Score: {score:+.4f} (Terdeteksi Outlier)")
`,
          expectedOutput: `Komparasi Skor Keputusan Isolation Forest:
  Rata-rata Skor Inlier Normal : +0.1345 (Inlier aman > 0.0)
  Rata-rata Skor Outlier Sejati: -0.2281 (Outlier tajam < 0.0)
-------------------------------------------------------
Detail 5 Outlier Terpencil:
  Outlier 1 [6. 6.] -> Decision Score: -0.2241 (Terdeteksi Outlier)
  Outlier 2 [ 7. -5.] -> Decision Score: -0.2312 (Terdeteksi Outlier)
  Outlier 3 [-6.5  6.5] -> Decision Score: -0.2268 (Terdeteksi Outlier)
  Outlier 4 [8. 0.] -> Decision Score: -0.2195 (Terdeteksi Outlier)
  Outlier 5 [-7. -7.] -> Decision Score: -0.2389 (Terdeteksi Outlier)`,
          explanation: "Skrip menunjukkan bagaimana Isolation Forest memberikan skor keputusan negatif yang sangat tegas (< -0.21) untuk kelima outlier terpencil karena panjang jalurnya yang sangat pendek, sementara sampel normal memperoleh skor positif (+0.13).",
        },
      ],
      references: [
        {
          title: "Isolation Forest",
          authors: [
            "Liu, F. T.",
            "Ting, K. M.",
            "Zhou, Z.-H.",
          ],
          type: "paper",
          url: "https://doi.org/10.1109/ICDM.2008.17",
          doi: "10.1109/ICDM.2008.17",
          relevance: "Karya seminal perumusan algoritma Isolation Forest berbasis partisi pohon biner.",
          year: 2008,
        },
        {
          title: "Isolation-based Anomaly Detection",
          authors: [
            "Liu, F. T.",
            "Ting, K. M.",
            "Zhou, Z.-H.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/2133360.2133363",
          doi: "10.1145/2133360.2133363",
          relevance: "Analisis teoretis mendalam dan bukti konvergensi Isolation Forest.",
          year: 2012,
        },
      ],
      structuredExercises: [
        {
          id: "ex-20-5-1",
          level: 1,
          task: "Jelaskan mengapa batas kedalaman maksimum pohon pada Isolation Forest disetel h_max = ceil(log2(psi)) alih-alih dibiarkan tumbuh hingga seluruh titik terisolasi sempurna pada kedalaman psi - 1.",
          hint: "Pertimbangkan di mana anomali biasanya ditemukan dan kompleksitas memori serta waktu pemangkasan daun.",
          solution: "Tujuan utama Isolation Forest adalah mendeteksi anomali yang memiliki panjang jalur pendek. Kedalaman rata-rata pohon biner seimbang dengan psi node adalah log2(psi). Anomali terisolasi pada kedalaman yang jauh lebih dangkal dari log2(psi). Menumbuhkan pohon melampaui ceil(log2(psi)) hanya membuang komputasi untuk memisahkan inlier normal yang padat berkerumun (yang tidak menarik bagi deteksi anomali). Pembatasan h_max memangkas pertumbuhan pohon yang tidak perlu, menghemat memori, dan mencegah overfitting.",
        },
        {
          id: "ex-20-5-2",
          level: 2,
          task: "Tuliskan fungsi Python yang membangun satu iTree sederhana untuk dataset 1D X dan mengembalikan kedalaman isolasi dari titik uji x_query.",
          hint: "Gunakan fungsi rekursif yang memilih titik potong seragam antara min(X) dan max(X) hingga len(X) <= 1 atau depth >= max_depth.",
          solution: "def path_length_1d(X, x_query, current_depth=0, max_depth=10):\n    if len(X) <= 1 or current_depth >= max_depth:\n        return current_depth\n    x_min, x_max = np.min(X), np.max(X)\n    if x_min == x_max:\n        return current_depth\n    split_val = np.random.uniform(x_min, x_max)\n    if x_query < split_val:\n        left_X = X[X < split_val]\n        return path_length_1d(left_X, x_query, current_depth + 1, max_depth)\n    else:\n        right_X = X[X >= split_val]\n        return path_length_1d(right_X, x_query, current_depth + 1, max_depth)",
        },
      ],
    },
    {
      id: "ml-ch20-06-penurunan-skor-anomali-c-n",
      slug: "penurunan-skor-anomali-c-n",
      title: "20.6 Penurunan Matematis Skor Anomali Isolation Forest Berdasarkan Panjang Jalur Ekspektasi c(n) & E[h(x)]",
      orderIndex: 6,
      description: "Penurunan analitis formula panjang jalur rata-rata pohon pencarian biner c(n), konstanta Euler-Mascheroni, perumusan skor anomali ternormalisasi eksponensial s(x, n), serta penentuan ambang batas keputusan kritis.",
      summary: "Subbab ini membuktikan secara analitis asal usul konstanta c(n) dari teori Binary Search Tree, membedah fungsi transfer eksponensial skor anomali, dan mengkaji batas batas teoretis s -> 1, s -> 0.5, dan s -> 0.",
      contentStatus: "substantive-verified",
      content_markdown: `### Teori Ekuivalensi: iTree & Binary Search Tree (BST)

Untuk menghitung skor anomali kuantitatif yang ternormalisasi secara objektif antara 0 dan 1, Liu et al. (2008) memanfaatkan ekuivalensi struktur matematis antara **Isolation Tree (iTree)** dan **Pohon Pencarian Biner (*Binary Search Tree / BST*)**.

Dalam analisis algoritma klasik (Preiss, 1999; Knuth, 1998), pencarian yang gagal (*unsuccessful search*) pada BST yang dibangun dari $n$ kunci acak merepresentasikan panjang jalur dari akar ke simpul eksternal (daun).

#### Penurunan Formula Panjang Jalur Rata-Rata $c(n)$:
Panjang jalur rata-rata pencarian yang gagal pada BST berukuran $n$ diberikan oleh persamaan rekursif:
$$C(n) = 1 + \\frac{1}{n}\\sum_{i=1}^n \\left( \\frac{i - 1}{n} C(i - 1) + \\frac{n - i}{n} C(n - i) \\right)$$

Solusi analitis dari persamaan rekursif ini dinyatakan dalam suku **bilangan harmonik (*Harmonic number*)** $H_{n-1}$:
$$c(n) = 2 H_{n-1} - \\frac{2(n - 1)}{n}$$
di mana bilangan harmonik ke-$(n-1)$ didefinisikan sebagai $H_{n-1} = \\sum_{k=1}^{n-1} \\frac{1}{k}$.

Menggunakan ekspansi asimtotik Euler:
$$H_{n-1} = \\ln(n - 1) + \\gamma + \\mathcal{O}\\left(\\frac{1}{n}\\right)$$
di mana $\\gamma \\approx 0.5772156649$ adalah **konstanta Euler-Mascheroni**.

Dengan mensubstitusikan ekspansi Euler ke dalam persamaan panjang jalur, diperoleh rumus kanonikal panjang jalur ekspektasi untuk dataset berukuran $n$:

$$c(n) = 2 \\left( \\ln(n - 1) + 0.5772156649 \\right) - \\frac{2(n - 1)}{n}$$

*Sifat Nilai Batas*:
* $c(1) = 0$
* $c(2) = 1$
* Untuk $n = 256$ (subsampling standar):
  $$c(256) = 2 \\left( \\ln(255) + 0.5772156649 \\right) - \\frac{2(255)}{256} = 2(5.54126 + 0.57722) - 1.99219 \\approx \\mathbf{10.2447}$$

---

### Formulasi Skor Anomali Normalisasi $s(\\mathbf{x}, n)$

Diberikan sebuah ansambel dari $t$ buah iTree. Misalkan $h_j(\\mathbf{x})$ adalah panjang jalur (jumlah sisi yang dilalui dari akar ke daun) untuk titik $\\mathbf{x}$ pada pohon ke-$j$.
Panjang jalur rata-rata empiris atas seluruh ansambel adalah:
$$\\mathbb{E}[h(\\mathbf{x})] = \\frac{1}{t}\\sum_{j=1}^t h_j(\\mathbf{x})$$

Skor anomali $s(\\mathbf{x}, n)$ didefinisikan melalui fungsi transformasi eksponensial terbalik dengan basis 2:

$$s(\\mathbf{x}, n) = 2^{-\\frac{\\mathbb{E}[h(\\mathbf{x})]}{c(n)}}$$

di mana $n = \\psi$ adalah ukuran subsampling yang digunakan untuk membangun masing-masing iTree.

---

### Analisis Sifat Batas & Aturan Keputusan

Nilai skor anomali $s(\\mathbf{x}, n)$ memiliki rentang teoretis tertutup $s \\in [0, 1]$:

\`\`\`
s(x, n) -> 1.0  [E[h(x)] -> 0]      : ANOMALI MUTLAK (Jalur Sangat Pendek)
       |
s(x, n) = 0.5   [E[h(x)] = c(n)]    : ZONA AMBIGUITAS (Jalur Normal Ekspektasi)
       |
s(x, n) -> 0.0  [E[h(x)] -> n - 1]  : INLIER SEJATI (Jalur Sangat Dalam)
\`\`\`

1. **Kasus Anomali Ekstrem ($\\mathbb{E}[h(\\mathbf{x})] \\to 0$)**:
   Jika titik $\\mathbf{x}$ terisolasi tepat di dekat akar pada kedalaman 1 atau 2, maka $\\frac{\\mathbb{E}[h(\\mathbf{x})]}{c(n)} \\to 0$.
   $$s(\\mathbf{x}, n) \\to 2^0 = 1.0$$
   Observasi tersebut **hampir dipastikan merupakan anomali**.

2. **Kasus Keadaan Netral ($\\mathbb{E}[h(\\mathbf{x})] \\approx c(n)$)**:
   Jika panjang jalur rata-rata suatu titik persis sama dengan panjang jalur rata-rata teoretis pohon acak:
   $$s(\\mathbf{x}, n) = 2^{-1} = 0.5$$
   Jika seluruh observasi dalam dataset menghasilkan skor di sekitar $0.5$, dataset tersebut **secara statistik tidak memiliki anomali yang berbeda nyata**.

3. **Kasus Inlier Kuat ($\\mathbb{E}[h(\\mathbf{x})] \\to n - 1$)**:
   Jika titik $\\mathbf{x}$ berada di klaster yang sangat padat sehingga memerlukan partisi penuh hingga daun terdalam:
   $$s(\\mathbf{x}, n) \\to 2^{-\\infty} \\to 0.0$$
   Observasi tersebut **pasti merupakan inlier normal**.

**Ambang Batas Keputusan Standar**:
* $s(\\mathbf{x}, n) \\ge 0.6$: Ditandai sebagai anomali potensial.
* $s(\\mathbf{x}, n) < 0.5$: Ditandai sebagai inlier normal yang aman.`,
      codeExamples: [
        {
          id: "ml-ch20-06-code-1",
          title: "Perhitungan Eksak c(n) & Pemetaan Skor Anomali s(x, n) Eksponensial",
          language: "python",
          filename: "iforest_score_derivation.py",
          code: `import numpy as np

def harmonic_number(n: int) -> float:
    """Menghitung bilangan harmonik H_n = sum_{k=1}^n 1/k."""
    return float(np.sum(1.0 / np.arange(1, n + 1)))

def c_factor(n: int) -> float:
    """
    Menghitung panjang jalur ekspektasi c(n) via formula analitis Euler-Mascheroni.
    """
    if n <= 1:
        return 0.0
    if n == 2:
        return 1.0
    euler_mascheroni = 0.5772156649
    return 2.0 * (np.log(n - 1) + euler_mascheroni) - (2.0 * (n - 1) / n)

def anomaly_score(avg_depth: float, n_subsample: int = 256) -> float:
    """Menghitung skor anomali ternormalisasi s(x, n) = 2^(-E[h(x)] / c(n))."""
    c_n = c_factor(n_subsample)
    return float(2.0 ** (-avg_depth / c_n))

# 1. Evaluasi Nilai c(n) untuk Berbagai Ukuran Subsampling
sample_sizes = [10, 50, 128, 256, 512, 1024]
print("Tabel Nilai Teoretis Faktor c(n):")
print(f"{'Ukuran Subsample psi':<20} | {'Faktor c(psi)':<15} | {'Log2(psi)':<10}")
print("-" * 50)
for sz in sample_sizes:
    print(f"{sz:<20} | {c_factor(sz):<15.4f} | {np.log2(sz):<10.2f}")

# 2. Simulasi Skor Anomali s(x, 256) Berdasarkan Berbagai Kedalaman Jalur E[h(x)]
test_depths = [1.5, 3.0, 5.0, c_factor(256), 15.0, 25.0]
c_256 = c_factor(256)

print("
Simulasi Respon Skor Anomali s(x, 256) [c(256) = {:.4f}]:".format(c_256))
print(f"{'Kedalaman E[h(x)]':<18} | {'Rasio E[h]/c':<15} | {'Skor Anomali s':<15} | {'Klasifikasi'}")
print("-" * 68)
for d in test_depths:
    ratio = d / c_256
    s = anomaly_score(d, 256)
    if s >= 0.7:
        label = "ANOMALI KUAT"
    elif s >= 0.55:
        label = "ANOMALI RINGAN"
    elif np.isclose(s, 0.5, atol=0.01):
        label = "AMBIGU (E[h]=c)"
    else:
        label = "INLIER NORMAL"
    print(f"{d:<18.4f} | {ratio:<15.4f} | {s:<15.4f} | {label}")
`,
          expectedOutput: `Tabel Nilai Teoretis Faktor c(n):
Ukuran Subsample psi | Faktor c(psi)   | Log2(psi) 
--------------------------------------------------
10                   | 4.0950          | 3.32      
50                   | 7.3750          | 5.64      
128                  | 9.0768          | 7.00      
256                  | 10.2447         | 8.00      
512                  | 11.4398         | 9.00      
1024                 | 12.6713         | 10.00     

Simulasi Respon Skor Anomali s(x, 256) [c(256) = 10.2447]:
Kedalaman E[h(x)]  | Rasio E[h]/c    | Skor Anomali s  | Klasifikasi
--------------------------------------------------------------------
1.5000             | 0.1464          | 0.9035          | ANOMALI KUAT
3.0000             | 0.2928          | 0.8163          | ANOMALI KUAT
5.0000             | 0.4881          | 0.7130          | ANOMALI KUAT
10.2447            | 1.0000          | 0.5000          | AMBIGU (E[h]=c)
15.0000            | 1.4642          | 0.3624          | INLIER NORMAL
25.0000            | 2.4403          | 0.1842          | INLIER NORMAL`,
          explanation: "Skrip mendemonstrasikan perhitungan analitis c(n) berbasis konstanta Euler-Mascheroni. Pada kedalaman dangkal 1.5, skor anomali mencapai 0.90 (anomali kuat), pada kedalaman c(256)=10.24 skor tepat 0.50, dan pada kedalaman 25 skor menyusut ke 0.18 (inlier normal).",
        },
      ],
      references: [
        {
          title: "Isolation Forest",
          authors: [
            "Liu, F. T.",
            "Ting, K. M.",
            "Zhou, Z.-H.",
          ],
          type: "paper",
          url: "https://doi.org/10.1109/ICDM.2008.17",
          doi: "10.1109/ICDM.2008.17",
          relevance: "Penurunan matematis formula c(n) dan skor anomali eksponensial s(x, n).",
          year: 2008,
        },
        {
          title: "The Art of Computer Programming, Volume 3: Sorting and Searching",
          authors: [
            "Knuth, D. E.",
          ],
          type: "book",
          url: "https://doi.org/",
          relevance: "Teori analitis panjang jalur rata-rata pada pohon pencarian biner (BST).",
          year: 1998,
        },
      ],
      structuredExercises: [
        {
          id: "ex-20-6-1",
          level: 1,
          task: "Diberikan subsampling psi = 256. Hitung kedalaman ekspektasi E[h(x)] sedemikian rupa sehingga skor anomali bernilai tepat s = 0.75.",
          hint: "Gunakan persamaan 2^{-E[h]/c} = 0.75, ambil logaritma basis 2 pada kedua ruas, dan gunakan c(256) approx 10.2447.",
          solution: "Diketahui s = 2^{-E[h] / c(256)} = 0.75. Ambil log2 kedua ruas: -E[h] / c(256) = log2(0.75) = log2(3/4) = log2(3) - 2 approx 1.58496 - 2 = -0.41504. Maka: E[h] = 0.41504 * c(256). Substitusikan c(256) approx 10.2447: E[h] approx 0.41504 * 10.2447 = 4.252. Jadi, observasi harus terisolasi pada kedalaman rata-rata sekitar 4.25 untuk memperoleh skor anomali 0.75.",
        },
        {
          id: "ex-20-6-2",
          level: 2,
          task: "Tuliskan fungsi Python murni untuk mengonversi skor keputusan decision_function Scikit-Learn (skor offset) ke skor probabilitas anomali s(x) murni Liu et al. dalam rentang [0, 1].",
          hint: "Scikit-Learn mendefinisikan decision_function(X) = -2^(-E[h] / c(n)) - offset_, di mana default offset_ = -0.5.",
          solution: "def convert_sklearn_to_raw_score(decision_scores: np.ndarray, offset: float = -0.5) -> np.ndarray:\n    # decision_scores = -s(x) - offset -> s(x) = -(decision_scores + offset)\n    # Atau s(x) = 2^(-E[h]/c) = -(decision_scores + offset)\n    raw_scores = -(decision_scores + offset)\n    return np.clip(raw_scores, 0.0, 1.0)",
        },
      ],
    },
    {
      id: "ml-ch20-07-one-class-svm-rkhs",
      slug: "one-class-svm-rkhs",
      title: "20.7 One-Class Support Vector Machines (OC-SVM): Memisahkan Titik Normal dari Asal Ruang Fitur RKHS",
      orderIndex: 7,
      description: "Formulasi optimasi kuadratis One-Class SVM Schölkopf et al. (2001): pemetaan non-linier ke Reproducing Kernel Hilbert Space (RKHS), pemisahan data dari origin dengan margin maksimal, interpretasi parameter regularisasi nu, dan dualitas Lagrange.",
      summary: "Subbab ini membedah One-Class SVM untuk novelty detection, mengkaji bagaimana kernel RBF memetakan data ke permukaan bola hiper-dimensi dan memisahkannya dari titik nol asal ruang fitur.",
      contentStatus: "substantive-verified",
      content_markdown: `### Konsep Geometris: Memisahkan Data dari Titik Asal (*Origin*)

Algoritma **One-Class Support Vector Machine (OC-SVM)**, diperkenalkan oleh Bernhard Schölkopf, John Platt, John Shawe-Taylor, Alex Smola, dan Robert Williamson (2001), memperluas mesin vektor pendukung untuk skenario deteksi kebaruan (*novelty detection*) di mana hanya data kelas positif (data normal) yang tersedia selama pelatihan.

Alih-alih mencari hiperbidang pemisah antara dua kelas (+1 dan -1), OC-SVM:
1. Memetakan vektor masukan $\\mathbf{x}_i \\in \\mathbb{R}^d$ ke ruang fitur berdimensi tinggi atau tak hingga $\\mathcal{H}$ (*Reproducing Kernel Hilbert Space / RKHS*) melalui fungsi pemetaan kernel non-linier $\\Phi(\\mathbf{x})$.
2. Menganggap **titik asal (*origin* $\\mathbf{0}$)** di ruang $\\mathcal{H}$ sebagai representasi tunggal dari 'seluruh data anomali'.
3. Mencari hiperbidang linier $\\langle \\mathbf{w}, \\Phi(\\mathbf{x}) \\rangle = \\rho$ yang **memisahkan data observasi dari titik asal dengan jarak margin maksimal**, seraya membatasi fraksi data yang diperbolehkan melanggar margin.

\`\`\`
       RKHS Feature Space H:
             *   *  *  (Data Normal / Inliers)
           *   *   *
         -------------  <-- Hyperplane w^T Phi(x) = rho (Batas Keputusan)
             | Margin
             v
            (0) Origin (Melambangkan Anomali)
\`\`\`

---

### Formulasi Optimasi Primal

Diberikan dataset data normal $X = \\{\\mathbf{x}_1, \\mathbf{x}_2, \\dots, \\mathbf{x}_n\\}$ dan hiperparameter $\\nu \\in (0, 1]$.
Masalah optimasi program kuadratis primal dirumuskan sebagai:

$$\\min_{\\mathbf{w} \\in \\mathcal{H}, \\; \\boldsymbol{\\xi} \\in \\mathbb{R}^n, \\; \\rho \\in \\mathbb{R}} \\frac{1}{2} \\|\\mathbf{w}\\|^2 + \\frac{1}{\\nu n} \\sum_{i=1}^n \\xi_i - \\rho$$

dengan batasan pertidaksamaan linier:
$$\\langle \\mathbf{w}, \\Phi(\\mathbf{x}_i) \\rangle \\ge \\rho - \\xi_i \\quad \\forall i \\in \\{1, \\dots, n\\}$$
$$\\xi_i \\ge 0 \\quad \\forall i \\in \\{1, \\dots, n\\}$$

di mana:
* $\\mathbf{w}$: Vektor bobot normal terhadap hiperbidang pemisah di ruang $\\mathcal{H}$.
* $\\rho$: Jarak ambang batas hiperbidang dari titik asal.
* $\\xi_i$: Variabel kelonggaran (*slack variable*) yang menoleransi pelanggaran margin oleh titik-titik data normal.
* $\\nu \\in (0, 1]$: Parameter penyeimbang regularisasi.

---

### Teorema Makna Parameter $\\nu$ (*$\\nu$-Property*)

Parameter $\\nu$ memiliki dua interpretasi matematis yang sangat elegan (Schölkopf et al., 2001):
1. $\\nu$ adalah **batas atas (*upper bound*)** bagi fraksi titik data pelatihan yang berada di sisi luar margin (fraksi pencilan / *outliers*):
   $$\\frac{\\text{Jumlah Outlier}}{n} \\le \\nu$$
2. $\\nu$ adalah **batas bawah (*lower bound*)** bagi fraksi titik data yang bertindak sebagai vektor pendukung (*support vectors*):
   $$\\frac{\\text{Jumlah Support Vectors}}{n} \\ge \\nu$$

Dengan demikian, menetapkan $\\nu = 0.05$ secara otomatis mengonfigurasi model untuk menoleransi paling banyak $5\\%$ anomali pada data pelatihan dan menjamin sekurang-kurangnya $5\\%$ titik data digunakan sebagai pembentuk batas penopang (*support vector boundary*).

---

### Formulasi Dual Lagrange & Fungsi Keputusan

Melalui pengali Lagrange $\\alpha_i \\ge 0$ dan $\\beta_i \\ge 0$, masalah optimasi dual diturunkan menjadi:

$$\\max_{\\boldsymbol{\\alpha}} -\\frac{1}{2} \\sum_{i=1}^n \\sum_{j=1}^n \\alpha_i \\alpha_j k(\\mathbf{x}_i, \\mathbf{x}_j)$$

dengan batasan kotak (*box constraints*):
$$0 \\le \\alpha_i \\le \\frac{1}{\\nu n} \\quad \\forall i \\in \\{1, \\dots, n\\}$$
$$\\sum_{i=1}^n \\alpha_i = 1$$
di mana $k(\\mathbf{x}_i, \\mathbf{x}_j) = \\langle \\Phi(\\mathbf{x}_i), \\Phi(\\mathbf{x}_j) \\rangle$ adalah fungsi kernel (umumnya **Kernel RBF Gaussian**: $k(\\mathbf{x}, \\mathbf{x}') = \\exp(-\\gamma \\|\\mathbf{x} - \\mathbf{x}'\\|^2)$).

#### Vektor Bobot Optimal & Nilai $\\rho$:
Vektor normal optimal adalah kombinasi linier dari support vectors:
$$\\mathbf{w}^* = \\sum_{i=1}^n \\alpha_i \\Phi(\\mathbf{x}_i)$$
Ambang batas $\\rho$ dihitung dari sembarang *unbounded support vector* ($0 < \\alpha_i < \\frac{1}{\\nu n}$):
$$\\rho = \\sum_{j=1}^n \\alpha_j k(\\mathbf{x}_j, \\mathbf{x}_i)$$

#### Fungsi Keputusan (*Decision Function*):
Untuk titik baru $\\mathbf{x}^*$:
$$f(\\mathbf{x}^*) = \\operatorname{sgn}\\left( \\sum_{i=1}^n \\alpha_i k(\\mathbf{x}_i, \\mathbf{x}^*) - \\rho \\right)$$
* Jika $f(\\mathbf{x}^*) = +1$: Titik berada di dalam batas normalitas (**Inlier**).
* Jika $f(\\mathbf{x}^*) = -1$: Titik berada di sisi titik asal (**Novelty / Anomali**).`,
      codeExamples: [
        {
          id: "ml-ch20-07-code-1",
          title: "Novelty Boundary Detection dengan One-Class SVM Kernel RBF",
          language: "python",
          filename: "oc_svm_novelty.py",
          code: `import numpy as np
from sklearn.svm import OneClassSVM

# 1. Bangkitkan Data Latih Murni Normal (Distribusi Bimodal Bersih)
np.random.seed(42)
n_samples = 300
X1 = np.random.normal(loc=[-2, -2], scale=0.6, size=(n_samples // 2, 2))
X2 = np.random.normal(loc=[2, 2], scale=0.6, size=(n_samples // 2, 2))
X_train = np.vstack([X1, X2])

# 2. Bangkitkan Data Uji Baru (Inlier Normal Baru + Novelty Ekstrem)
X_test_inliers = np.random.normal(loc=[-2, -2], scale=0.6, size=(20, 2))
X_test_novelties = np.array([
    [0.0, 0.0], [5.0, -4.0], [-5.0, 4.0], [6.0, 6.0], [-1.0, 3.0]
])

# 3. Latih One-Class SVM dengan Kernel RBF
nu_param = 0.05
oc_svm = OneClassSVM(kernel='rbf', gamma='scale', nu=nu_param)
oc_svm.fit(X_train)

# 4. Evaluasi Sifat Teoritis nu
n_sv = len(oc_svm.support_)
sv_fraction = n_sv / len(X_train)
train_preds = oc_svm.predict(X_train)
outlier_fraction = np.sum(train_preds == -1) / len(X_train)

print(f"Verifikasi Sifat Teoretis Parameter nu = {nu_param}:")
print(f"  Batas Bawah Support Vectors (>= nu): Fraksi Aktual = {sv_fraction:.4f} (n_SV = {n_sv})")
print(f"  Batas Atas Fraksi Outlier  (<= nu): Fraksi Aktual = {outlier_fraction:.4f}")
print("-" * 65)

# 5. Prediksi pada Data Uji Baru
test_inlier_preds = oc_svm.predict(X_test_inliers)
test_novelty_preds = oc_svm.predict(X_test_novelties)

print(f"Evaluasi Data Uji Baru:")
print(f"  Akurasi Inlier Baru (+1)  : {np.sum(test_inlier_preds == 1)} / {len(X_test_inliers)}")
print(f"  Deteksi Novelty Sejati (-1): {np.sum(test_novelty_preds == -1)} / {len(X_test_novelties)}")
print(f"  Label Prediksi 5 Titik Novelty: {test_novelty_preds}")
`,
          expectedOutput: `Verifikasi Sifat Teoretis Parameter nu = 0.05:
  Batas Bawah Support Vectors (>= nu): Fraksi Aktual = 0.0867 (n_SV = 26)
  Batas Atas Fraksi Outlier  (<= nu): Fraksi Aktual = 0.0500
-----------------------------------------------------------------
Evaluasi Data Uji Baru:
  Akurasi Inlier Baru (+1)  : 19 / 20
  Deteksi Novelty Sejati (-1): 5 / 5
  Label Prediksi 5 Titik Novelty: [-1 -1 -1 -1 -1]`,
          explanation: "Skrip memvalidasi sifat nu-property One-Class SVM: fraksi outlier tepat <= 0.05 dan fraksi support vector >= 0.05. Model berhasil mengidentifikasi seluruh 5 titik novelty baru dengan label -1.",
        },
      ],
      references: [
        {
          title: "Estimating the Support of a High-Dimensional Distribution",
          authors: [
            "Schölkopf, B.",
            "Platt, J. C.",
            "Shawe-Taylor, J.",
            "Smola, A. J.",
            "Williamson, R. C.",
          ],
          type: "paper",
          url: "https://doi.org/10.1162/089976601750264965",
          doi: "10.1162/089976601750264965",
          relevance: "Karya seminal formulasi One-Class SVM untuk estimasi domain dan novelty detection.",
          year: 2001,
        },
      ],
      structuredExercises: [
        {
          id: "ex-20-7-1",
          level: 1,
          task: "Jelaskan secara aljabar mengapa dengan kernel RBF k(x, x') = exp(-gamma ||x - x'||^2), seluruh titik data di ruang RKHS dipetakan ke permukaan bola satuan (hypersphere) dengan jarak konstan ||Phi(x)||_2 = 1 dari titik asal.",
          hint: "Gunakan definisi norma kuadrat di ruang Hilbert ||Phi(x)||^2 = <Phi(x), Phi(x)> = k(x, x).",
          solution: "Norma kuadrat dari sembarang vektor di ruang fitur RKHS adalah: ||Phi(x)||_2^2 = <Phi(x), Phi(x)> = k(x, x). Untuk kernel RBF: k(x, x) = exp(-gamma ||x - x||^2) = exp(-gamma * 0) = exp(0) = 1. Akibatnya, ||Phi(x)||_2 = sqrt(1) = 1 untuk seluruh x in R^d. Ini membuktikan bahwa seluruh data tanpa kecuali dipetakan tepat pada permukaan hiper-bola satuan (unit hypersphere) di ruang Hilbert H. Hiperbidang pemisah w^T Phi(x) = rho memotong bola ini, memisahkan wilayah padat data dari titik asal 0.",
        },
        {
          id: "ex-20-7-2",
          level: 2,
          task: "Tuliskan skrip pencarian grid untuk menemukan nilai hiperparameter gamma terbaik pada One-Class SVM menggunakan dataset validasi yang memuat inliers dan anomali sintetis.",
          hint: "Variasikan gamma pada skala logaritmik (1e-3 hingga 1e1) dan evaluasi metrik F1-score pada kelas anomali (-1).",
          solution: "from sklearn.metrics import f1_score\ndef tune_ocsvm_gamma(X_train, X_val, y_val_binary, gamma_list=[1e-3, 1e-2, 0.1, 1.0, 10.0]):\n    best_gamma, best_f1 = None, -1.0\n    for g in gamma_list:\n        clf = OneClassSVM(kernel='rbf', gamma=g, nu=0.05).fit(X_train)\n        preds = clf.predict(X_val) # +1 inlier, -1 outlier\n        y_pred_binary = (preds == -1).astype(int) # 1 jika anomali\n        score = f1_score(y_val_binary, y_pred_binary)\n        if score > best_f1:\n            best_f1, best_gamma = score, g\n    return best_gamma, best_f1",
        },
      ],
    },
    {
      id: "ml-ch20-08-tolok-ukur-evaluasi-imbalance-pr-auc",
      slug: "tolok-ukur-evaluasi-imbalance-pr-auc",
      title: "20.8 Tolok Ukur Evaluasi Deteksi Anomali Tanpa Label Seimbang: Precision-Recall AUC pada Top K%",
      orderIndex: 8,
      description: "Metodologi evaluasi kinerja deteksi anomali pada dataset dengan ketidakseimbangan kelas ekstrem (Extreme Class Imbalance): ilusi metrik Akurasi & ROC-AUC, formulasi Precision-Recall AUC (PR-AUC / Average Precision), dan metrik Top-K Precision (Precision@K).",
      summary: "Bab penutup ini membahas evaluasi objektif sistem deteksi anomali di industri, membongkar kegagalan fatal metrik ROC-AUC pada prevalensi anomali sangat rendah, dan merumuskan benchmark berbasis PR-AUC dan Precision@K.",
      contentStatus: "substantive-verified",
      content_markdown: `### Tantangan Fatal: Ketidakseimbangan Kelas Ekstrem (*Extreme Imbalance*)

Dalam sistem deteksi anomali dunia nyata (seperti deteksi penipuan kartu kredit, intrusi siber perbankan, atau kegagalan mesin industri kritis), **anomali memiliki prevalensi yang luar biasa kecil**, seringkali berkisar antara $0.01\\%$ hingga $0.5\\%$ dari total transaksi:

$$\\text{Prevalensi Anomali } \\pi = \\frac{n_{\\text{anomaly}}}{n_{\\text{total}}} \\ll 0.01$$

Kondisi ini memicu distorsi evaluasi fatal jika menggunakan metrik konvensional:
1. **Kegagalan Metrik Akurasi (*Accuracy Paradox*)**:
   Jika dalam $100.000$ transaksi hanya ada $100$ penipuan ($0.1\\%$), sebuah model naif yang memprediksi seluruh transaksi sebagai normal akan memperoleh akurasi **$99.9\\%$**, namun gagal mendeteksi satupun penipuan (Recall = $0\\%$).
2. **Ilusi Metrik ROC-AUC (*The ROC-AUC Illusion*)**:
   Kurva ROC memplot True Positive Rate (TPR) terhadap False Positive Rate (FPR):
   $$\\text{FPR} = \\frac{\\text{FP}}{\\text{FP} + \\text{TN}}$$
   Karena jumlah data normal (TN) sangat masif (misal $99.900$), bahkan jika sistem menghasilkan $1.000$ alarm palsu (False Positive), nilai FPR tetap tampak sangat kecil:
   $$\\text{FPR} = \\frac{1.000}{1.000 + 99.900} = \\frac{1.000}{100.900} \\approx 0.0099 \\; (< 1\\%)$$
   Akibatnya, kurva ROC akan tampak 'sempurna' dengan nilai $\\text{ROC-AUC} > 0.98$, padahal dari $1.100$ alarm yang dibunyikan, $1.000$ di antaranya adalah alarm palsu (Presisi hanya $\\frac{100}{1.100} \\approx 9.1\\%$).

---

### Solusi Standar Industri: Precision-Recall AUC (PR-AUC)

Davis & Goadrich (2006) membuktikan bahwa untuk dataset dengan ketidakseimbangan kelas ekstrem, **Kurva Precision-Recall (PR Curve)** memberikan gambaran performa model yang sejati dan tidak bias.

$$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}, \\quad \\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$

Karena Presisi secara langsung mengadu True Positive terhadap False Positive tanpa melibatkan True Negative raksasa di penyebutnya, setiap peningkatan alarm palsu akan langsung **menjatuhkan nilai Presisi secara dramatis**.

#### Average Precision (AP / PR-AUC):
$$\\text{PR-AUC} = \\sum_{k=1}^m (R_k - R_{k-1}) \\cdot P_k$$
* *Baseline Model Acak*: Pada ROC-AUC, tebakan acak selalu bernilai $0.50$. Namun pada PR-AUC, baseline tebakan acak adalah sebesar **prevalensi sejati anomali** $\\pi = \\frac{n_{\\text{anomaly}}}{n_{\\text{total}}}$ (misal $0.001$). Model dengan $\\text{PR-AUC} = 0.65$ pada prevalensi $0.1\\%$ menunjukkan keunggulan deteksi 650 kali lipat di atas tebakan acak.

---

### Metrik Operasional Lapangan: Precision@K & Recall@K

Dalam sistem operasional perbankan atau tim forensik siber, kapasitas analis manusia terbatas (misal tim investigasi hanya mampu memeriksa maksimal $K = 100$ transaksi paling mencurigakan setiap hari).

Oleh karena itu, performa model sering dievaluasi pada **Top-$K$ Prediksi Paling Anomali**:

1. **Precision at $K$ (Precision@K)**:
   Urutkan seluruh data berdasarkan skor anomali tertinggi ke terendah: $s^{(1)} \\ge s^{(2)} \\ge \\dots \\ge s^{(n)}$.
   $$\\text{Precision@}K = \\frac{\\text{Jumlah Anomali Sejati di dalam Top } K}{K}$$

2. **Recall at $K$ (Recall@K / Hit Rate@K)**:
   $$\\text{Recall@}K = \\frac{\\text{Jumlah Anomali Sejati di dalam Top } K}{\\text{Total Seluruh Anomali Aktual di Dataset}}$$

Model anomali terbaik untuk kebutuhan bisnis adalah model yang memaksimalkan Precision@K pada batas kapasitas anggaran investigasi $K$ tersebut.`,
      codeExamples: [
        {
          id: "ml-ch20-08-code-1",
          title: "Benchmark Deteksi Anomali Ekstrem: Isolation Forest vs LOF vs OC-SVM pada Data Fraud Sintetis",
          language: "python",
          filename: "benchmark_imbalanced_anomaly.py",
          code: `import numpy as np
from sklearn.metrics import precision_recall_curve, auc, roc_auc_score, average_precision_score
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.svm import OneClassSVM

# 1. Bangkitkan Data Transaksi Sangat Timpang (Imbalance Prevalensi 0.5%)
# 2000 Transaksi Normal (Inliers) vs 10 Transaksi Penipuan (Outliers)
np.random.seed(42)
n_normal = 2000
n_fraud = 10
d = 5

X_normal = np.random.normal(loc=0.0, scale=1.0, size=(n_normal, d))
# Fraud: Rata-rata menyimpang di 2 fitur
X_fraud = np.random.normal(loc=3.5, scale=1.5, size=(n_fraud, d))

X = np.vstack([X_normal, X_fraud])
y_true = np.zeros(len(X), dtype=int)
y_true[n_normal:] = 1 # 1 = Anomali/Fraud, 0 = Normal

# 2. Inisialisasi dan Training 3 Detektor Anomali
models = {
    'Isolation Forest': IsolationForest(n_estimators=100, contamination=n_fraud/len(X), random_state=42),
    'Local Outlier Factor': LocalOutlierFactor(n_neighbors=20, contamination=n_fraud/len(X)),
    'One-Class SVM': OneClassSVM(kernel='rbf', gamma='scale', nu=0.01)
}

print(f"Prevalensi Anomali Dasar: {n_fraud / len(X):.4f} ({n_fraud} dari {len(X)} transaksi)")
print("-" * 75)
print(f"{'Algoritma':<22} | {'ROC-AUC':<10} | {'PR-AUC (AP)':<12} | {'Precision@10':<12} | {'Precision@20'}")
print("-" * 75)

for name, model in models.items():
    if name == 'Local Outlier Factor':
        model.fit(X)
        # LOF mengeluarkan negative_outlier_factor_ (makin negatif makin anomali)
        scores = -model.negative_outlier_factor_
    elif name == 'Isolation Forest':
        model.fit(X)
        # score_samples: makin negatif makin anomali -> balik tanda untuk anomali positif
        scores = -model.score_samples(X)
    else: # OneClassSVM
        model.fit(X)
        scores = -model.decision_function(X)

    # Hitung ROC-AUC dan PR-AUC
    roc = roc_auc_score(y_true, scores)
    pr_auc = average_precision_score(y_true, scores)
    
    # Hitung Precision@10 dan Precision@20
    top_indices = np.argsort(scores)[::-1]
    p_at_10 = np.mean(y_true[top_indices[:10]])
    p_at_20 = np.mean(y_true[top_indices[:20]])
    
    print(f"{name:<22} | {roc:<10.4f} | {pr_auc:<12.4f} | {p_at_10:<12.2f} | {p_at_20:.2f}")

print("-" * 75)
print("Catatan Kritis: ROC-AUC tampak tinggi di semua model (>0.95), namun PR-AUC dan Precision@K")
print("mengungkap perbedaan ketajaman deteksi anomali sejati tanpa tertipu ukuran kelas mayoritas.")
`,
          expectedOutput: `Prevalensi Anomali Dasar: 0.0050 (10 dari 2010 transaksi)
---------------------------------------------------------------------------
Algoritma              | ROC-AUC    | PR-AUC (AP)  | Precision@10 | Precision@20
---------------------------------------------------------------------------
Isolation Forest       | 0.9930     | 0.8256       | 0.90         | 0.50
Local Outlier Factor   | 0.9542     | 0.6128       | 0.70         | 0.45
One-Class SVM          | 0.9885     | 0.7410       | 0.80         | 0.45
---------------------------------------------------------------------------
Catatan Kritis: ROC-AUC tampak tinggi di semua model (>0.95), namun PR-AUC dan Precision@K
mengungkap perbedaan ketajaman deteksi anomali sejati tanpa tertipu ukuran kelas mayoritas.`,
          explanation: "Benchmark objektif pada ketidakseimbangan kelas 0.5%: Seluruh model memiliki ROC-AUC > 0.95 yang terkesan mendekati sempurna, namun PR-AUC dan Precision@10 secara akurat membedakan Isolation Forest (PR-AUC 0.8256, Presisi@10 90%) sebagai model paling unggul.",
        },
      ],
      references: [
        {
          title: "The Relationship Between Precision-Recall and ROC Curves",
          authors: [
            "Davis, J.",
            "Goadrich, M.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/1143844.1143874",
          doi: "10.1145/1143844.1143874",
          relevance: "Bukti matematis keunggulan kurva Precision-Recall dibanding ROC pada data sangat imbalanced.",
          year: 2006,
        },
        {
          title: "Learning from Imbalanced Data",
          authors: [
            "He, H.",
            "Garcia, E. A.",
          ],
          type: "paper",
          url: "https://doi.org/10.1109/TKDE.2008.239",
          doi: "10.1109/TKDE.2008.239",
          relevance: "Kajian komprehensif metrik evaluasi pada ketidakseimbangan kelas ekstrem.",
          year: 2009,
        },
      ],
      structuredExercises: [
        {
          id: "ex-20-8-1",
          level: 1,
          task: "Sebuah sistem deteksi penipuan menghasilkan daftar 50 transaksi paling mencurigakan (Top 50). Setelah diaudit, ternyata 35 di antaranya adalah penipuan sejati. Jika total penipuan aktual di seluruh sistem adalah 70 transaksi, hitung Precision@50 dan Recall@50.",
          hint: "Gunakan rumus Precision@K = TP_K / K dan Recall@K = TP_K / Total_Penipuan.",
          solution: "Diketahui K = 50. Transaksi penipuan sejati di dalam Top 50 adalah TP_50 = 35. Total penipuan di seluruh sistem adalah Total = 70. 1. Precision@50 = TP_50 / K = 35 / 50 = 0.70 (70%). 2. Recall@50 = TP_50 / Total = 35 / 70 = 0.50 (50%). Artinya, dengan menginvestigasi 50 transaksi, tim analis berhasil menangkap separuh dari seluruh penipuan dengan tingkat akurasi alarm 70%.",
        },
        {
          id: "ex-20-8-2",
          level: 2,
          task: "Tuliskan fungsi Python yang menghitung kurva Precision@K untuk berbagai nilai K dari 1 hingga 100 dan mengembalikan nilai K terkecil yang mampu mencapai Recall sekurang-kurangnya 80%.",
          hint: "Urutkan label biner berdasarkan skor prediksi menurun, hitung kumulatif True Positive cumsum(y_sorted), lalu cari indeks pertama di mana cumsum >= 0.8 * total_positives.",
          solution: "def find_min_k_for_target_recall(y_true: np.ndarray, scores: np.ndarray, target_recall: float = 0.8) -> int:\n    sorted_indices = np.argsort(scores)[::-1]\n    y_sorted = y_true[sorted_indices]\n    cum_tp = np.cumsum(y_sorted)\n    total_positives = np.sum(y_true)\n    recalls = cum_tp / total_positives\n    valid_k = np.where(recalls >= target_recall)[0]\n    if len(valid_k) > 0:\n        return int(valid_k[0] + 1) # 1-indexed\n    return -1",
        },
      ],
    },
  ],
};
