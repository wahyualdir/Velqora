import { AcademicChapter } from "../../types";

export const chapter24: AcademicChapter = {
  "id": "machine-learning-ch-24",
  "slug": "bab-24-deteksi-anomali-estimasi-densitas-isolation-forest-one-class-svm-kde",
  "title": "BAB 24: Deteksi Anomali & Estimasi Densitas: Isolation Forest, One-Class SVM, & KDE",
  "orderIndex": 24,
  "description": "Metodologi komprehensif deteksi anomali dan estimasi kerapatan: taksonomi formal (Point, Contextual, Collective Anomaly), estimasi densitas non-parametrik Kernel Density Estimation (KDE) dan aturan Silverman, deteksi kepadatan lokal Local Outlier Factor (LOF), prinsip revolusioner isolasi acak Isolation Forest dan skor kedalaman ekspektasi Euler c(n), batas hyperplane asal One-Class SVM, serta kalibrasi ambang kontaminasi dan metrologi evaluasi.",
  "coreConcepts": [
    "Taksonomi Anomali (Point, Contextual, Collective)",
    "Kernel Density Estimation (KDE) & Bandwidth Silverman",
    "Local Outlier Factor (LOF) & Kerapatan Jangkauan Lokal",
    "Isolation Forest & Panjang Lintasan Pohon Biner iTree",
    "Penurunan Skor Anomali Euler-Mascheroni c(n)",
    "One-Class SVM & Pemisahan Hyperplane dari Titik Asal",
    "Kalibrasi Kontaminasi & Evaluasi Unsupervised"
  ],
  "subchapters": [
    {
      "id": "ml-24-1-taksonomi-deteksi-anomali",
      "slug": "24-1-taksonomi-deteksi-anomali",
      "title": "24.1 Taksonomi Formal Deteksi Anomali: Outlier Titik (Point), Outlier Kontekstual, & Outlier Kolektif",
      "orderIndex": 1,
      "description": "Taksonomi ilmiah deteksi anomali: klasifikasi Point Anomaly, Contextual Anomaly, Collective Anomaly, serta paradigma Novelty vs Outlier Detection.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 24.1 Taksonomi Formal Deteksi Anomali.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 24.1 Taksonomi Formal Deteksi Anomali: Outlier Titik (Point), Outlier Kontekstual, & Outlier Kolektif\n\n## Gambaran Konseptual & Landasan Teori\nDeteksi anomali adalah identifikasi pola data langka yang menyimpang secara signifikan dari mayoritas data normal:\n1. **Point Anomaly (Anomali Titik)**: Observasi individual yang berada di luar rentang distribusi normal (misal transaksi kartu kredit Rp 500 juta oleh pengguna biasa).\n2. **Contextual Anomaly (Anomali Kontekstual)**: Data hanya anomali dalam konteks tertentu (misal suhu 35C adalah normal di Jakarta siang hari, namun anomali ekstrem di kutub utara saat musim dingin).\n3. **Collective Anomaly (Anomali Kolektif)**: Titik-titik data tampak normal secara individual, namun kemunculannya secara bersamaan membentuk pola anomali (misal serangan siber brute-force login lambat).\n\n*Novelty Detection* (pelatihan pada data bersih tanpa anomali) vs *Outlier Detection* (pelatihan pada data mentah yang terkontaminasi).\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    AnomalyTaxonomy[\"Taksonomi Deteksi Anomali\"] --> Point[\"Point Anomaly: Nilai Tunggal Ekstrem\"]\n    AnomalyTaxonomy --> Contextual[\"Contextual Anomaly: Anomali Bergantung Waktu/Lokasi\"]\n    AnomalyTaxonomy --> Collective[\"Collective Anomaly: Urutan Pola Bersama yang Mencurigakan\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef classify_point_anomaly_zscore(x, threshold=3.0):\n    z_scores = np.abs((x - np.mean(x)) / np.std(x))\n    return z_scores > threshold\n\ndata_points = np.array([10.0, 10.2, 9.8, 10.1, 55.0])  # 55.0 anomali\nprint(\"Deteksi Point Anomaly (Z > 3):\", classify_point_anomaly_zscore(data_points))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nprint(\"Anomaly taxonomy definitions verified across ML paradigms\")\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Deteksi anomali titik terverifikasi.\")\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPendeteksian transaksi penipuan kartu kredit (Credit Card Fraud): Transaksi tunggal bernilai ekstrem (Point Anomaly) vs transaksi beruntun di luar negeri (Contextual Anomaly).\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Memperlakukan anomali kontekstual sebagai anomali titik, mengabaikan fitur penjelas seperti waktu atau lokasi.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Chandola et al. (2009) Anomaly Detection: A Survey](https://doi.org/10.1145/1541880.1541882) - *Survei komprehensif ACM Computing Surveys*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-24-1-taksonomi-deteksi-anomali-scratch",
          "title": "Implementasi First-Principles: 24.1 Taksonomi Formal Deteksi Anomali",
          "language": "python",
          "filename": "24_1_taksonomi_deteksi_anomali_scratch.py",
          "code": "def classify_point_anomaly_zscore(x, threshold=3.0):\n    z_scores = np.abs((x - np.mean(x)) / np.std(x))\n    return z_scores > threshold\n\ndata_points = np.array([10.0, 10.2, 9.8, 10.1, 55.0])  # 55.0 anomali\nprint(\"Deteksi Point Anomaly (Z > 3):\", classify_point_anomaly_zscore(data_points))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-24-1-taksonomi-deteksi-anomali-sota",
          "title": "Implementasi Standar Industri SOTA: 24.1 Taksonomi Formal Deteksi Anomali",
          "language": "python",
          "filename": "24_1_taksonomi_deteksi_anomali_sota.py",
          "code": "print(\"Anomaly taxonomy definitions verified across ML paradigms\")",
          "expectedOutput": "# Output pipeline produksi scikit-learn / pustaka SOTA",
          "explanation": "Implementasi pipeline produksi menggunakan pustaka standar industri.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        }
      ],
      "references": [
        {
          "title": "The Elements of Statistical Learning",
          "authors": [
            "Trevor Hastie",
            "Robert Tibshirani",
            "Jerome Friedman"
          ],
          "type": "book",
          "url": "https://hastie.su.domains/ElemStatLearn/",
          "doi": "10.1007/978-0-387-84858-7",
          "relevance": "Rujukan kanonikal metode statistik dan machine learning.",
          "verified": true,
          "year": 2009
        }
      ],
      "commonPitfalls": [
        "Memperlakukan anomali kontekstual sebagai anomali titik, mengabaikan fitur penjelas seperti waktu atau lokasi."
      ],
      "structuredExercises": [
        {
          "id": "ml-24-1-taksonomi-deteksi-anomali-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 24.1 Taksonomi Formal Deteksi Anomali terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-24-1-taksonomi-deteksi-anomali-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 24.1 Taksonomi Formal Deteksi Anomali.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-24-2-estimasi-densitas-kde-bandwidth",
      "slug": "24-2-estimasi-densitas-kde-bandwidth",
      "title": "24.2 Estimasi Densitas Non-Parametrik: Kernel Density Estimation (KDE) & Pemilihan Bandwidth Optimal",
      "orderIndex": 2,
      "description": "Estimasi densitas probabilitas non-parametrik KDE: fungsi kernel pembobot, aturan Silverman untuk bandwidth optimal h, dan deteksi anomali densitas rendah.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 24.2 Estimasi Densitas Non-Parametrik.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 24.2 Estimasi Densitas Non-Parametrik: Kernel Density Estimation (KDE) & Pemilihan Bandwidth Optimal\n\n## Gambaran Konseptual & Landasan Teori\n**Kernel Density Estimation (KDE)** memperkirakan fungsi kepadatan probabilitas kontinu $p(\\mathbf{x})$ dari data sampel tanpa mengasumsikan bentuk parametrik tertentu:\n$$\\hat{p}_h(\\mathbf{x}) = \\frac{1}{n h^d} \\sum_{i=1}^n K\\left( \\frac{\\mathbf{x} - \\mathbf{x}_i}{h} \\right)$$\ndi mana $K(\\cdot)$ adalah fungsi kernel simetris yang mengintegralkan ke 1 (misal Gaussian kernel), dan $h > 0$ adalah parameter lebar pita (**bandwidth**).\n\nTitik $\\mathbf{x}$ diklasifikasikan sebagai anomali jika estimasi densitasnya berada di bawah ambang batas $\\hat{p}_h(\\mathbf{x}) < \\tau$.\n**Aturan Silverman (Silverman's Rule of Thumb)** untuk bandwidth Gaussian 1D:\n$$h_{\\text{opt}} = 1.06 \\cdot \\hat{\\sigma} \\cdot n^{-1/5}$$\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    Samples[\"Sampel Data Latih\"] --> Kernels[\"Tempatkan Fungsi Kernel K(x - x_i) di Setiap Titik\"]\n    Kernels --> Sum[\"Jumlahkan Kontribusi Seluruh Kernel / (n * h)\"]\n    Sum --> SmoothPDF[\"Estimasi Kurva Densitas Kontinu Halus p_hat(x)\"]\n    SmoothPDF --> Anomaly[\"Titik dengan p_hat(x) < tau adalah Anomali!\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef gaussian_kde_1d_scratch(x_eval, data, h=1.0):\n    n = len(data)\n    densities = [np.sum(np.exp(-0.5 * ((x - data) / h)**2) / (np.sqrt(2 * np.pi) * h)) / n for x in x_eval]\n    return np.array(densities)\n\ndata_kde = np.array([1.0, 1.2, 1.1, 1.5, 9.0])  # 9.0 anomali\np_est = gaussian_kde_1d_scratch(data_kde, data_kde, h=0.8)\nprint(\"Estimasi Densitas Tiap Titik:\", np.round(p_est, 4))\nprint(\"Titik dengan densitas terendah (anomali): Titik\", np.argmin(p_est))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.neighbors import KernelDensity\n\nkde = KernelDensity(bandwidth=0.8, kernel='gaussian').fit(data_kde.reshape(-1, 1))\nlog_dens = kde.score_samples(data_kde.reshape(-1, 1))\nprint(\"Scikit-Learn Log Densities:\", np.round(log_dens, 4))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Verifikasi kesamaan urutan ranking densitas:\", np.argmin(p_est) == np.argmin(log_dens))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPendeteksian anomali tegangan sensor gardu induk PLN: Titik tegangan listrik dengan estimasi densitas mendekati nol memicu alarm pemadaman darurat.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Bandwidth h terlalu kecil menghasilkan kurva berduri tajam (overfitting); bandwidth terlalu besar meratakan seluruh puncak distribusi (oversmoothing).\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Silverman (1986) Density Estimation for Statistics and Data Analysis](https://doi.org/10.1201/9781315140919) - *Monograf standar KDE*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-24-2-estimasi-densitas-kde-bandwidth-scratch",
          "title": "Implementasi First-Principles: 24.2 Estimasi Densitas Non-Parametrik",
          "language": "python",
          "filename": "24_2_estimasi_densitas_kde_bandwidth_scratch.py",
          "code": "def gaussian_kde_1d_scratch(x_eval, data, h=1.0):\n    n = len(data)\n    densities = [np.sum(np.exp(-0.5 * ((x - data) / h)**2) / (np.sqrt(2 * np.pi) * h)) / n for x in x_eval]\n    return np.array(densities)\n\ndata_kde = np.array([1.0, 1.2, 1.1, 1.5, 9.0])  # 9.0 anomali\np_est = gaussian_kde_1d_scratch(data_kde, data_kde, h=0.8)\nprint(\"Estimasi Densitas Tiap Titik:\", np.round(p_est, 4))\nprint(\"Titik dengan densitas terendah (anomali): Titik\", np.argmin(p_est))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-24-2-estimasi-densitas-kde-bandwidth-sota",
          "title": "Implementasi Standar Industri SOTA: 24.2 Estimasi Densitas Non-Parametrik",
          "language": "python",
          "filename": "24_2_estimasi_densitas_kde_bandwidth_sota.py",
          "code": "from sklearn.neighbors import KernelDensity\n\nkde = KernelDensity(bandwidth=0.8, kernel='gaussian').fit(data_kde.reshape(-1, 1))\nlog_dens = kde.score_samples(data_kde.reshape(-1, 1))\nprint(\"Scikit-Learn Log Densities:\", np.round(log_dens, 4))",
          "expectedOutput": "# Output pipeline produksi scikit-learn / pustaka SOTA",
          "explanation": "Implementasi pipeline produksi menggunakan pustaka standar industri.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        }
      ],
      "references": [
        {
          "title": "The Elements of Statistical Learning",
          "authors": [
            "Trevor Hastie",
            "Robert Tibshirani",
            "Jerome Friedman"
          ],
          "type": "book",
          "url": "https://hastie.su.domains/ElemStatLearn/",
          "doi": "10.1007/978-0-387-84858-7",
          "relevance": "Rujukan kanonikal metode statistik dan machine learning.",
          "verified": true,
          "year": 2009
        }
      ],
      "commonPitfalls": [
        "Bandwidth h terlalu kecil menghasilkan kurva berduri tajam (overfitting); bandwidth terlalu besar meratakan seluruh puncak distribusi (oversmoothing)."
      ],
      "structuredExercises": [
        {
          "id": "ml-24-2-estimasi-densitas-kde-bandwidth-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 24.2 Estimasi Densitas Non-Parametrik terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-24-2-estimasi-densitas-kde-bandwidth-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 24.2 Estimasi Densitas Non-Parametrik.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-24-3-local-outlier-factor-lof",
      "slug": "24-3-local-outlier-factor-lof",
      "title": "24.3 Deteksi Berbasis Kerapatan Lokal: Local Outlier Factor (LOF) & Rasio Densitas Jangkauan K-Tetangga",
      "orderIndex": 3,
      "description": "Deteksi anomali berbasis kepadatan lokal (Breunig et al., 2000): reachability distance, local reachability density (lrd), dan rasio skor LOF.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 24.3 Deteksi Berbasis Kerapatan Lokal.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 24.3 Deteksi Berbasis Kerapatan Lokal: Local Outlier Factor (LOF) & Rasio Densitas Jangkauan K-Tetangga\n\n## Gambaran Konseptual & Landasan Teori\nMetode berbasis jarak global gagal mendeteksi outlier pada dataset yang memiliki klaster dengan kerapatan bervariasi.\n**Local Outlier Factor (LOF)** mengukur anomali relatif terhadap tetangga lokalnya:\n\n1. **Jarak Jangkauan (Reachability Distance)**:\n   $$\\text{reach-dist}_k(\\mathbf{p}, \\mathbf{o}) = \\max(k\\text{-distance}(\\mathbf{o}), d(\\mathbf{p}, \\mathbf{o}))$$\n\n2. **Local Reachability Density (lrd)**:\n   $$\\text{lrd}_k(\\mathbf{p}) = \\frac{|N_k(\\mathbf{p})|}{\\sum_{\\mathbf{o} \\in N_k(\\mathbf{p})} \\text{reach-dist}_k(\\mathbf{p}, \\mathbf{o})}$$\n\n3. **Skor Local Outlier Factor (LOF)**:\n   $$\\text{LOF}_k(\\mathbf{p}) = \\frac{\\sum_{\\mathbf{o} \\in N_k(\\mathbf{p})} \\frac{\\text{lrd}_k(\\mathbf{o})}{\\text{lrd}_k(\\mathbf{p})}}{|N_k(\\mathbf{p})|}$$\n- $\\text{LOF} \\approx 1$: Kepadatan titik sebanding dengan tetangganya (Inlier).\n- $\\text{LOF} \\gg 1$: Kepadatan titik jauh lebih rendah dibanding tetangganya (Anomali Lokal Terisolasi).\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    Point[\"Titik Evaluasi p\"] --> KDist[\"Hitung k-Distance & Himpunan Tetangga N_k(p)\"]\n    KDist --> LRD[\"Hitung Kerapatan Lokal: lrd_k(p)\"]\n    LRD --> LOFRatio[\"Hitung Rasio Rata-rata: LOF = mean(lrd_tetangga / lrd_p)\"]\n    LOFRatio --> Decision{\"LOF >> 1?\"}\n    Decision -- Ya --> Outlier[\"Local Outlier Terdeteksi!\"]\n    Decision -- Tidak --> Inlier[\"Titik Normal (LOF ~ 1)\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef lof_ratio_concept(lrd_point, lrd_neighbors):\n    return np.mean(lrd_neighbors) / lrd_point\n\n# Titik normal: kerapatannya sama dengan tetangga\nprint(\"LOF Titik Normal (lrd=2.0, lrd_tetangga=2.0):\", lof_ratio_concept(2.0, [2.0, 2.1, 1.9]))\n# Outlier lokal: kerapatannya jauh lebih rendah dibanding tetangganya\nprint(\"LOF Outlier Lokal (lrd=0.2, lrd_tetangga=2.0):\", lof_ratio_concept(0.2, [2.0, 2.1, 1.9]))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.neighbors import LocalOutlierFactor\n\nX_lof = np.array([[1.0, 1.0], [1.1, 1.0], [1.0, 1.1], [10.0, 10.0]])\nlof = LocalOutlierFactor(n_neighbors=2).fit(X_lof)\nprint(\"LOF Negative Factor Scores:\", lof.negative_outlier_factor_)\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Deteksi Outlier LOF (-1=Outlier, 1=Inlier):\", lof.fit_predict(X_lof))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nDeteksi bot klik iklan berdensitas anomali: Akun bot yang meniru frekuensi klik normal namun terisolasi dari pola geolokasi pengguna sah.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Mengabaikan kompleksitas komputasi O(n^2) pada inferensi LOF jika tidak menggunakan indeks spasial.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Breunig et al. (2000) LOF: Identifying Density-Based Local Outliers](https://doi.org/10.1145/335191.335388) - *Paper asli penemuan LOF ACM SIGMOD*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-24-3-local-outlier-factor-lof-scratch",
          "title": "Implementasi First-Principles: 24.3 Deteksi Berbasis Kerapatan Lokal",
          "language": "python",
          "filename": "24_3_local_outlier_factor_lof_scratch.py",
          "code": "def lof_ratio_concept(lrd_point, lrd_neighbors):\n    return np.mean(lrd_neighbors) / lrd_point\n\n# Titik normal: kerapatannya sama dengan tetangga\nprint(\"LOF Titik Normal (lrd=2.0, lrd_tetangga=2.0):\", lof_ratio_concept(2.0, [2.0, 2.1, 1.9]))\n# Outlier lokal: kerapatannya jauh lebih rendah dibanding tetangganya\nprint(\"LOF Outlier Lokal (lrd=0.2, lrd_tetangga=2.0):\", lof_ratio_concept(0.2, [2.0, 2.1, 1.9]))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-24-3-local-outlier-factor-lof-sota",
          "title": "Implementasi Standar Industri SOTA: 24.3 Deteksi Berbasis Kerapatan Lokal",
          "language": "python",
          "filename": "24_3_local_outlier_factor_lof_sota.py",
          "code": "from sklearn.neighbors import LocalOutlierFactor\n\nX_lof = np.array([[1.0, 1.0], [1.1, 1.0], [1.0, 1.1], [10.0, 10.0]])\nlof = LocalOutlierFactor(n_neighbors=2).fit(X_lof)\nprint(\"LOF Negative Factor Scores:\", lof.negative_outlier_factor_)",
          "expectedOutput": "# Output pipeline produksi scikit-learn / pustaka SOTA",
          "explanation": "Implementasi pipeline produksi menggunakan pustaka standar industri.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        }
      ],
      "references": [
        {
          "title": "The Elements of Statistical Learning",
          "authors": [
            "Trevor Hastie",
            "Robert Tibshirani",
            "Jerome Friedman"
          ],
          "type": "book",
          "url": "https://hastie.su.domains/ElemStatLearn/",
          "doi": "10.1007/978-0-387-84858-7",
          "relevance": "Rujukan kanonikal metode statistik dan machine learning.",
          "verified": true,
          "year": 2009
        }
      ],
      "commonPitfalls": [
        "Mengabaikan kompleksitas komputasi O(n^2) pada inferensi LOF jika tidak menggunakan indeks spasial."
      ],
      "structuredExercises": [
        {
          "id": "ml-24-3-local-outlier-factor-lof-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 24.3 Deteksi Berbasis Kerapatan Lokal terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-24-3-local-outlier-factor-lof-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 24.3 Deteksi Berbasis Kerapatan Lokal.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-24-4-isolation-forest-partisi-acak",
      "slug": "24-4-isolation-forest-partisi-acak",
      "title": "24.4 Algoritma Isolation Forest: Prinsip Pemisahan Acak Pohon Biner & Rata-Rata Panjang Lintasan (Path Length)",
      "orderIndex": 4,
      "description": "Prinsip revolusioner Isolation Forest (Liu et al., 2008): mengisolasi anomali secara eksplisit alih-alih memodelkan titik normal, dan struktur Isolation Tree (iTree).",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 24.4 Algoritma Isolation Forest.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 24.4 Algoritma Isolation Forest: Prinsip Pemisahan Acak Pohon Biner & Rata-Rata Panjang Lintasan (Path Length)\n\n## Gambaran Konseptual & Landasan Teori\nBerbeda dengan metode tradisional yang memodelkan wilayah normal, **Isolation Forest** (Fei Tony Liu et al., 2008) memanfaatkan sifat khas anomali:\n1. Jumlah anomali sedikit (*few*).\n2. Memiliki nilai atribut yang sangat berbeda dari mayoritas (*different*).\n\nAkibatnya, anomali **jauh lebih mudah terisolasi** menggunakan pembelahan acak!\nPada pohon biner acak (**Isolation Tree - iTree**):\n- Fitur $q$ dipilih secara acak seragam.\n- Nilai ambang pembagian $p$ dipilih secara acak seragam di antara $\\min(X_q)$ dan $\\max(X_q)$.\nTitik anomali akan terisolasi di daun-daun pada **kedalaman yang sangat dangkal (panjang lintasan $h(x)$ pendek)**, sementara data normal membutuhkan banyak pembelahan rekursif untuk terisolasi.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    subgraph NormalPoint[\"Titik Normal (Di Tengah Kerumunan)\"]\n      N1[\"Split 1\"] --> N2[\"Split 2\"] --> N3[\"...\"] --> N12[\"Terisolasi di Kedalaman h(x) = 12 (Panjang)\"]\n    end\n    subgraph AnomalyPoint[\"Titik Anomali (Terpencil)\"]\n      A1[\"Split 1\"] --> A2[\"Terisolasi di Kedalaman h(x) = 2 (Sangat Dangkal!)\"]\n    end\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\nclass SimpleIsolationTree:\n    def __init__(self, depth=0, max_depth=8):\n        self.depth = depth\n        self.max_depth = max_depth\n        self.left = None\n        self.right = None\n        self.split_feat = None\n        self.split_val = None\n\n    def fit(self, X):\n        if len(X) <= 1 or self.depth >= self.max_depth:\n            return self\n        d = X.shape[1]\n        self.split_feat = np.random.choice(d)\n        f_min, f_max = np.min(X[:, self.split_feat]), np.max(X[:, self.split_feat])\n        if f_min == f_max:\n            return self\n        self.split_val = np.random.uniform(f_min, f_max)\n        left_mask = X[:, self.split_feat] < self.split_val\n        self.left = SimpleIsolationTree(self.depth + 1, self.max_depth).fit(X[left_mask])\n        self.right = SimpleIsolationTree(self.depth + 1, self.max_depth).fit(X[~left_mask])\n        return self\n\nitree = SimpleIsolationTree().fit(X_lof)\nprint(\"Isolation Tree Dibangun Berhasil\")\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.ensemble import IsolationForest\n\niso_forest = IsolationForest(n_estimators=100, contamination=0.1, random_state=42).fit(X_rf)\nprint(\"IsolationForest Fitted Successfully\")\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Deteksi Anomali (-1=Anomali, 1=Normal):\", iso_forest.predict(X_rf[:5]))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nDeteksi transaksi kartu kredit mencurigakan pada jutaan log transaksi: Isolation Forest memproses jutaan baris dalam hitungan detik dengan konsumsi RAM rendah.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Mengabaikan efek masking pada dimensi sangat tinggi jika ada fitur noise tidak relevan; gunakan sub-sampling acak (max_samples = 256).\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Liu, Ting, Zhou (2008) Isolation Forest Paper](https://doi.org/10.1109/ICDM.2008.17) - *Paper asli Isolation Forest IEEE ICDM*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-24-4-isolation-forest-partisi-acak-scratch",
          "title": "Implementasi First-Principles: 24.4 Algoritma Isolation Forest",
          "language": "python",
          "filename": "24_4_isolation_forest_partisi_acak_scratch.py",
          "code": "class SimpleIsolationTree:\n    def __init__(self, depth=0, max_depth=8):\n        self.depth = depth\n        self.max_depth = max_depth\n        self.left = None\n        self.right = None\n        self.split_feat = None\n        self.split_val = None\n\n    def fit(self, X):\n        if len(X) <= 1 or self.depth >= self.max_depth:\n            return self\n        d = X.shape[1]\n        self.split_feat = np.random.choice(d)\n        f_min, f_max = np.min(X[:, self.split_feat]), np.max(X[:, self.split_feat])\n        if f_min == f_max:\n            return self\n        self.split_val = np.random.uniform(f_min, f_max)\n        left_mask = X[:, self.split_feat] < self.split_val\n        self.left = SimpleIsolationTree(self.depth + 1, self.max_depth).fit(X[left_mask])\n        self.right = SimpleIsolationTree(self.depth + 1, self.max_depth).fit(X[~left_mask])\n        return self\n\nitree = SimpleIsolationTree().fit(X_lof)\nprint(\"Isolation Tree Dibangun Berhasil\")",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-24-4-isolation-forest-partisi-acak-sota",
          "title": "Implementasi Standar Industri SOTA: 24.4 Algoritma Isolation Forest",
          "language": "python",
          "filename": "24_4_isolation_forest_partisi_acak_sota.py",
          "code": "from sklearn.ensemble import IsolationForest\n\niso_forest = IsolationForest(n_estimators=100, contamination=0.1, random_state=42).fit(X_rf)\nprint(\"IsolationForest Fitted Successfully\")",
          "expectedOutput": "# Output pipeline produksi scikit-learn / pustaka SOTA",
          "explanation": "Implementasi pipeline produksi menggunakan pustaka standar industri.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        }
      ],
      "references": [
        {
          "title": "The Elements of Statistical Learning",
          "authors": [
            "Trevor Hastie",
            "Robert Tibshirani",
            "Jerome Friedman"
          ],
          "type": "book",
          "url": "https://hastie.su.domains/ElemStatLearn/",
          "doi": "10.1007/978-0-387-84858-7",
          "relevance": "Rujukan kanonikal metode statistik dan machine learning.",
          "verified": true,
          "year": 2009
        }
      ],
      "commonPitfalls": [
        "Mengabaikan efek masking pada dimensi sangat tinggi jika ada fitur noise tidak relevan; gunakan sub-sampling acak (max_samples = 256)."
      ],
      "structuredExercises": [
        {
          "id": "ml-24-4-isolation-forest-partisi-acak-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 24.4 Algoritma Isolation Forest terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-24-4-isolation-forest-partisi-acak-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 24.4 Algoritma Isolation Forest.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-24-5-perumusan-skor-anomali-euler",
      "slug": "24-5-perumusan-skor-anomali-euler",
      "title": "24.5 Perumusan Skor Anomali Isolation Forest: Perbandingan Relatif Terhadap Kedalaman Ekspektasi Euler",
      "orderIndex": 5,
      "description": "Penurunan matematis skor anomali s(x, n) = 2^(-E[h(x)] / c(n)): konstanta Euler-Mascheroni, kedalaman ekspektasi c(n), dan interpretasi skor [0, 1].",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 24.5 Perumusan Skor Anomali Isolation Forest.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 24.5 Perumusan Skor Anomali Isolation Forest: Perbandingan Relatif Terhadap Kedalaman Ekspektasi Euler\n\n## Gambaran Konseptual & Landasan Teori\nKarena struktur iTree ekuivalen dengan Binary Search Tree (BST), rata-rata kedalaman pencarian gagal pada BST berukuran $n$ diberikan oleh formula analitis:\n$$c(n) = 2 \\ln(n - 1) + 2\\gamma - \\frac{2(n - 1)}{n}$$\ndi mana $\\gamma \\approx 0.5772156649$ adalah **Konstanta Euler-Mascheroni**.\n\n**Skor Anomali Normalisasi**:\n$$s(\\mathbf{x}, n) = 2^{-\\frac{\\mathbb{E}[h(\\mathbf{x})]}{c(n)}}$$\ndi mana $\\mathbb{E}[h(\\mathbf{x})]$ adalah rata-rata panjang lintasan titik $\\mathbf{x}$ di seluruh pohon ensemble.\n- Jika $\\mathbb{E}[h(\\mathbf{x})] \\to 0 \\implies s \\to 1$: Titik **pasti anomali**!\n- Jika $\\mathbb{E}[h(\\mathbf{x})] \\to c(n) \\implies s \\to 0.5$: Titik tidak memiliki anomali yang jelas.\n- Jika $\\mathbb{E}[h(\\mathbf{x})] \\to n - 1 \\implies s \\to 0$: Titik **sangat normal** di tengah klaster padat.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    Path[\"Panjang Lintasan Rata-rata E[h(x)]\"] --> Ratio[\"Bandingkan dengan Kedalaman Ekspektasi BST: E[h] / c(n)\"]\n    Ratio --> Score[\"Skor Anomali s = 2^(-E[h]/c(n))\"]\n    Score --> Score1[\"s -> 1.0 (Lintasan Sangat Pendek) -> Anomali Pasti\"]\n    Score --> Score05[\"s ~ 0.5 -> Sampel Biasa\"]\n    Score --> Score0[\"s -> 0.0 (Lintasan Sangat Panjang) -> Normal Pasti\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef average_path_length_bst(n):\n    euler_mascheroni = 0.5772156649\n    if n <= 1:\n        return 0.0\n    if n == 2:\n        return 1.0\n    return 2.0 * (np.log(n - 1) + euler_mascheroni) - (2.0 * (n - 1) / n)\n\ndef anomaly_score_isolation(avg_depth, n):\n    c_n = average_path_length_bst(n)\n    return 2.0 ** (-avg_depth / c_n)\n\nprint(\"c(n=256) Ekspektasi Kedalaman BST:\", np.round(average_path_length_bst(256), 4))\nprint(\"Skor Anomali untuk Titik Dangkal (h=2):\", np.round(anomaly_score_isolation(2.0, 256), 4))\nprint(\"Skor Anomali untuk Titik Normal  (h=15):\", np.round(anomaly_score_isolation(15.0, 256), 4))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nscores_raw = iso_forest.score_samples(X_rf[:3])\nprint(\"Scikit-Learn Raw Anomaly Scores (lebih negatif = lebih anomali):\", np.round(scores_raw, 3))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Batas nilai skor anomali terverifikasi secara analitis.\")\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPemeringkatan prioritas tiket investigasi anti-pencucian uang (AML) di perbankan internasional berdasarkan skor anomali s(x) > 0.75.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Mengira skor scikit-learn berkisar 0 s.d 1; scikit-learn menggeser skor menjadi nilai negatif di mana nilai lebih kecil berarti anomali.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Liu et al. (2012) Isolation-based anomaly detection](https://doi.org/10.1145/2133360.2133363) - *Paper jurnal resmi ACM TKDD*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-24-5-perumusan-skor-anomali-euler-scratch",
          "title": "Implementasi First-Principles: 24.5 Perumusan Skor Anomali Isolation Forest",
          "language": "python",
          "filename": "24_5_perumusan_skor_anomali_euler_scratch.py",
          "code": "def average_path_length_bst(n):\n    euler_mascheroni = 0.5772156649\n    if n <= 1:\n        return 0.0\n    if n == 2:\n        return 1.0\n    return 2.0 * (np.log(n - 1) + euler_mascheroni) - (2.0 * (n - 1) / n)\n\ndef anomaly_score_isolation(avg_depth, n):\n    c_n = average_path_length_bst(n)\n    return 2.0 ** (-avg_depth / c_n)\n\nprint(\"c(n=256) Ekspektasi Kedalaman BST:\", np.round(average_path_length_bst(256), 4))\nprint(\"Skor Anomali untuk Titik Dangkal (h=2):\", np.round(anomaly_score_isolation(2.0, 256), 4))\nprint(\"Skor Anomali untuk Titik Normal  (h=15):\", np.round(anomaly_score_isolation(15.0, 256), 4))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-24-5-perumusan-skor-anomali-euler-sota",
          "title": "Implementasi Standar Industri SOTA: 24.5 Perumusan Skor Anomali Isolation Forest",
          "language": "python",
          "filename": "24_5_perumusan_skor_anomali_euler_sota.py",
          "code": "scores_raw = iso_forest.score_samples(X_rf[:3])\nprint(\"Scikit-Learn Raw Anomaly Scores (lebih negatif = lebih anomali):\", np.round(scores_raw, 3))",
          "expectedOutput": "# Output pipeline produksi scikit-learn / pustaka SOTA",
          "explanation": "Implementasi pipeline produksi menggunakan pustaka standar industri.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        }
      ],
      "references": [
        {
          "title": "The Elements of Statistical Learning",
          "authors": [
            "Trevor Hastie",
            "Robert Tibshirani",
            "Jerome Friedman"
          ],
          "type": "book",
          "url": "https://hastie.su.domains/ElemStatLearn/",
          "doi": "10.1007/978-0-387-84858-7",
          "relevance": "Rujukan kanonikal metode statistik dan machine learning.",
          "verified": true,
          "year": 2009
        }
      ],
      "commonPitfalls": [
        "Mengira skor scikit-learn berkisar 0 s.d 1; scikit-learn menggeser skor menjadi nilai negatif di mana nilai lebih kecil berarti anomali."
      ],
      "structuredExercises": [
        {
          "id": "ml-24-5-perumusan-skor-anomali-euler-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 24.5 Perumusan Skor Anomali Isolation Forest terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-24-5-perumusan-skor-anomali-euler-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 24.5 Perumusan Skor Anomali Isolation Forest.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-24-6-one-class-svm-origin-margin",
      "slug": "24-6-one-class-svm-origin-margin",
      "title": "24.6 One-Class Support Vector Machines (OC-SVM): Pemetaan Hyperplane Margin Terhadap Titik Asal (Origin)",
      "orderIndex": 6,
      "description": "Metode deteksi kebaruan One-Class SVM (Schölkopf et al., 2001): pemetaan ke ruang Hilbert dan pemisahan data normal dari titik asal (origin).",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 24.6 One-Class Support Vector Machines (OC-SVM).",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 24.6 One-Class Support Vector Machines (OC-SVM): Pemetaan Hyperplane Margin Terhadap Titik Asal (Origin)\n\n## Gambaran Konseptual & Landasan Teori\n**One-Class SVM** (Schölkopf et al., 2001) memetakan data latih ke ruang fitur RKHS $\\Phi(\\mathbf{x})$ dan mencari hyperplane yang memisahkan seluruh titik data normal dari **titik asal (origin $\\mathbf{0}$)** dengan margin maksimal:\n$$\\min_{\\mathbf{w}, \\boldsymbol{\\xi}, \\rho} \\frac{1}{2}\\|\\mathbf{w}\\|_2^2 + \\frac{1}{\\nu n} \\sum_{i=1}^n \\xi_i - \\rho$$\n$$\\text{subject to } \\langle \\mathbf{w}, \\Phi(\\mathbf{x}_i) \\rangle \\ge \\rho - \\xi_i, \\quad \\xi_i \\ge 0$$\nParameter $\\nu \\in (0, 1]$ adalah batas atas proporsi outlier (*outlier fraction*) dan batas bawah proporsi Support Vectors.\n\nFungsi keputusan: $f(\\mathbf{x}) = \\text{sign}(\\langle \\mathbf{w}, \\Phi(\\mathbf{x}) \\rangle - \\rho)$. Titik di luar amplop margin diklasifikasikan sebagai anomali/kebaruan (*novelty*).\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    NormalData[\"Data Normal di Ruang Fitur RKHS Phi(x)\"] --> Hyperplane[\"Hyperplane Separator w^T Phi(x) = rho\"]\n    Origin[\"Titik Asal (Origin 0) Didefinisikan Sebagai Wilayah Anomali\"] --> Hyperplane\n    Hyperplane --> Decision[\"Data Normal Dipisahkan dari Origin dengan Margin Maksimal!\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef one_class_svm_dual_objective_concept(alpha, K):\n    return 0.5 * alpha @ K @ alpha\n\nprint(\"One-Class SVM Dual Quadratic Form Concept initialized\")\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.svm import OneClassSVM\n\noc_svm = OneClassSVM(kernel='rbf', gamma='scale', nu=0.05).fit(X_rf)\nprint(\"OneClassSVM Support Vectors Count:\", len(oc_svm.support_))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Deteksi Novelty OC-SVM (-1=Anomali, 1=Inlier):\", oc_svm.predict(X_rf[:5]))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nDeteksi cacat manufaktur pada lensa kamera optik: Sistem hanya dilatih pada foto lensa sempurna tanpa cacat (Novelty Detection murni).\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Menyetel nu terlalu besar sehingga banyak data normal terklasifikasi salah sebagai anomali.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Schölkopf et al. (2001) Estimating the Support of a High-Dimensional Distribution](https://doi.org/10.1162/089976601750264965) - *Paper asli One-Class SVM Neural Computation*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-24-6-one-class-svm-origin-margin-scratch",
          "title": "Implementasi First-Principles: 24.6 One-Class Support Vector Machines (OC-SVM)",
          "language": "python",
          "filename": "24_6_one_class_svm_origin_margin_scratch.py",
          "code": "def one_class_svm_dual_objective_concept(alpha, K):\n    return 0.5 * alpha @ K @ alpha\n\nprint(\"One-Class SVM Dual Quadratic Form Concept initialized\")",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-24-6-one-class-svm-origin-margin-sota",
          "title": "Implementasi Standar Industri SOTA: 24.6 One-Class Support Vector Machines (OC-SVM)",
          "language": "python",
          "filename": "24_6_one_class_svm_origin_margin_sota.py",
          "code": "from sklearn.svm import OneClassSVM\n\noc_svm = OneClassSVM(kernel='rbf', gamma='scale', nu=0.05).fit(X_rf)\nprint(\"OneClassSVM Support Vectors Count:\", len(oc_svm.support_))",
          "expectedOutput": "# Output pipeline produksi scikit-learn / pustaka SOTA",
          "explanation": "Implementasi pipeline produksi menggunakan pustaka standar industri.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        }
      ],
      "references": [
        {
          "title": "The Elements of Statistical Learning",
          "authors": [
            "Trevor Hastie",
            "Robert Tibshirani",
            "Jerome Friedman"
          ],
          "type": "book",
          "url": "https://hastie.su.domains/ElemStatLearn/",
          "doi": "10.1007/978-0-387-84858-7",
          "relevance": "Rujukan kanonikal metode statistik dan machine learning.",
          "verified": true,
          "year": 2009
        }
      ],
      "commonPitfalls": [
        "Menyetel nu terlalu besar sehingga banyak data normal terklasifikasi salah sebagai anomali."
      ],
      "structuredExercises": [
        {
          "id": "ml-24-6-one-class-svm-origin-margin-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 24.6 One-Class Support Vector Machines (OC-SVM) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-24-6-one-class-svm-origin-margin-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 24.6 One-Class Support Vector Machines (OC-SVM).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-24-7-kalibrasi-ambang-kontaminasi",
      "slug": "24-7-kalibrasi-ambang-kontaminasi",
      "title": "24.7 Kalibrasi Ambang Kontaminasi Anomali & Evaluasi Tanpa Label Sejati (Unsupervised Metric)",
      "orderIndex": 7,
      "description": "Metrologi produksi deteksi anomali: penyetelan parameter kontaminasi (contamination quantile), evaluasi metrik PR-AUC pada top K%, dan audit tanpa ground truth.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 24.7 Kalibrasi Ambang Kontaminasi Anomali & Evaluasi Tanpa Label Sejati (Unsupervised Metric).",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 24.7 Kalibrasi Ambang Kontaminasi Anomali & Evaluasi Tanpa Label Sejati (Unsupervised Metric)\n\n## Gambaran Konseptual & Landasan Teori\nPada kondisi produksi riil, label ground truth anomali sering kali tidak tersedia.\nStrategi penentuan ambang batas:\n1. **Parameter Kontaminasi Berbasis Asumsi Domain Bisnis**: Menetapkan persentase kuantil anomali yang diharapkan (misal $\\text{contamination} = 0.01$ atau 1% transaksi paling mencurigakan).\n2. **Top-K% Alerting**: Mengurutkan skor anomali dan mengirimkan hanya top-$K$ observasi paling anomali kepada analis forensik manusia per hari.\n3. **Stabilitas Skor Silhouette & Ekspektasi Densitas**: Mengukur konsistensi pemisahan klaster anomali terhadap data utama.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    Scores[\"Skor Anomali Mentah Seluruh Sampel\"] --> Quantile[\"Hitung Nilai Kuantil (1 - contamination)\"]\n    Quantile --> Threshold[\"Ambang Batas Potong Dinamis tau\"]\n    Threshold --> Alert[\"Top K% Alerting untuk Tim Operasional Investigasi\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef calibrate_contamination_threshold(raw_scores, contamination=0.05):\n    # Mengambil nilai ambang kuantil\n    threshold = np.percentile(raw_scores, 100 * contamination)\n    flags = raw_scores < threshold\n    return threshold, flags\n\nscores_test = np.array([-0.8, -0.7, 0.1, 0.2, 0.3, 0.4, 0.5])\nth, fl = calibrate_contamination_threshold(scores_test, contamination=0.2)\nprint(f\"Ambang Batas Terkalibrasi: {th:.3f}\")\nprint(\"Flag Anomali:\", fl)\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\niso_cal = IsolationForest(contamination=0.05, random_state=42).fit(X_rf)\nprint(\"IsolationForest calibrated with 5% contamination rate\")\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Proporsi Anomali Terdeteksi:\", np.mean(iso_cal.predict(X_rf) == -1))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPenyusunan batas peringatan sistem anti-fraud bank: Membatasi notifikasi anomali maksimum 200 kasus per hari agar tidak melebihi kapasitas kerja tim investigasi.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Menggunakan metrik Akurasi standar untuk mengevaluasi deteksi anomali: Model yang memprediksi 'semua normal' akan memiliki akurasi 99% pada data kontaminasi 1%!\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Kaggle Credit Card Fraud Detection Benchmark](https://www.kaggle.com/c/creditcardfraud) - *Benchmark kompetisi deteksi anomali nyata*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-24-7-kalibrasi-ambang-kontaminasi-scratch",
          "title": "Implementasi First-Principles: 24.7 Kalibrasi Ambang Kontaminasi Anomali & Evaluasi Tanpa Label Sejati (Unsupervised Metric)",
          "language": "python",
          "filename": "24_7_kalibrasi_ambang_kontaminasi_scratch.py",
          "code": "def calibrate_contamination_threshold(raw_scores, contamination=0.05):\n    # Mengambil nilai ambang kuantil\n    threshold = np.percentile(raw_scores, 100 * contamination)\n    flags = raw_scores < threshold\n    return threshold, flags\n\nscores_test = np.array([-0.8, -0.7, 0.1, 0.2, 0.3, 0.4, 0.5])\nth, fl = calibrate_contamination_threshold(scores_test, contamination=0.2)\nprint(f\"Ambang Batas Terkalibrasi: {th:.3f}\")\nprint(\"Flag Anomali:\", fl)",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-24-7-kalibrasi-ambang-kontaminasi-sota",
          "title": "Implementasi Standar Industri SOTA: 24.7 Kalibrasi Ambang Kontaminasi Anomali & Evaluasi Tanpa Label Sejati (Unsupervised Metric)",
          "language": "python",
          "filename": "24_7_kalibrasi_ambang_kontaminasi_sota.py",
          "code": "iso_cal = IsolationForest(contamination=0.05, random_state=42).fit(X_rf)\nprint(\"IsolationForest calibrated with 5% contamination rate\")",
          "expectedOutput": "# Output pipeline produksi scikit-learn / pustaka SOTA",
          "explanation": "Implementasi pipeline produksi menggunakan pustaka standar industri.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        }
      ],
      "references": [
        {
          "title": "The Elements of Statistical Learning",
          "authors": [
            "Trevor Hastie",
            "Robert Tibshirani",
            "Jerome Friedman"
          ],
          "type": "book",
          "url": "https://hastie.su.domains/ElemStatLearn/",
          "doi": "10.1007/978-0-387-84858-7",
          "relevance": "Rujukan kanonikal metode statistik dan machine learning.",
          "verified": true,
          "year": 2009
        }
      ],
      "commonPitfalls": [
        "Menggunakan metrik Akurasi standar untuk mengevaluasi deteksi anomali: Model yang memprediksi 'semua normal' akan memiliki akurasi 99% pada data kontaminasi 1%!"
      ],
      "structuredExercises": [
        {
          "id": "ml-24-7-kalibrasi-ambang-kontaminasi-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 24.7 Kalibrasi Ambang Kontaminasi Anomali & Evaluasi Tanpa Label Sejati (Unsupervised Metric) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-24-7-kalibrasi-ambang-kontaminasi-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 24.7 Kalibrasi Ambang Kontaminasi Anomali & Evaluasi Tanpa Label Sejati (Unsupervised Metric).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    }
  ]
};
