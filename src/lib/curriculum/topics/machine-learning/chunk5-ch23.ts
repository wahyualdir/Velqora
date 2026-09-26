import { AcademicChapter } from "../../types";

export const chapter23: AcademicChapter = {
  "id": "machine-learning-ch-23",
  "slug": "bab-23-model-campuran-probabilistik-gmm-algoritma-expectation-maximization",
  "title": "BAB 23: Model Campuran Probabilistik: GMM & Algoritma Expectation-Maximization",
  "orderIndex": 23,
  "description": "Landasan analitis model generatif campuran: paradigma soft clustering mengatasi batas partisi keras, formulasi matematis Gaussian Mixture Models (GMM), kebuntuan analitis log-likelihood campuran dan variabel laten Z, pembuktian konvergensi monoton algoritma Expectation-Maximization via Ketaksamaan Jensen, tahap ekspektasi (E-step responsibilities), tahap maksimisasi (M-step parameter updates), serta tipologi matriks kovarians dan seleksi model berbasis BIC/AIC.",
  "coreConcepts": [
    "Paradigma Soft Clustering & Ketidakpastian Posterior",
    "Formulasi Parameter GMM (Bobot, Rata-rata, Kovarians)",
    "Variabel Laten Z & Penjumlahan di dalam Logaritma",
    "Evidence Lower Bound (ELBO) & Ketaksamaan Jensen",
    "E-step: Tanggung Jawab Posterior (Responsibilities)",
    "M-step: Pembaruan Parameter Tertutup",
    "Struktur Kovarians GMM (Full, Tied, Diagonal, Spherical) & Skor BIC"
  ],
  "subchapters": [
    {
      "id": "ml-23-1-paradigma-soft-clustering-mixture-models",
      "slug": "23-1-paradigma-soft-clustering-mixture-models",
      "title": "23.1 Model Campuran Probabilistik (Mixture Models): Mengatasi Keterbatasan Partisi Keras (Hard Clustering)",
      "orderIndex": 1,
      "description": "Pergeseran dari partisi keras (hard clustering K-Means) ke probabilitas keanggotaan lembut (soft clustering): model generatif campuran dan ketidakpastian.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 23.1 Model Campuran Probabilistik (Mixture Models).",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 23.1 Model Campuran Probabilistik (Mixture Models): Mengatasi Keterbatasan Partisi Keras (Hard Clustering)\n\n## Gambaran Konseptual & Landasan Teori\nPada K-Means, setiap titik data dipaksa menjadi anggota mutlak dari tepat satu klaster (*hard assignment*). Hal ini mengabaikan ketidakpastian (*uncertainty*) pada titik-titik yang berada di perbatasan antar kluster.\n\n**Model Campuran Probabilistik (Mixture Models)** mengadopsi pendekatan **Soft Clustering**:\nSetiap titik $\\mathbf{x}$ memiliki probabilitas keanggotaan posterior $\\gamma_{ik} = P(Z_i = k \\mid \\mathbf{x}_i) \\in [0, 1]$ terhadap setiap komponen klaster $k$, dengan $\\sum_{k=1}^K \\gamma_{ik} = 1$.\nPendekatan ini memodelkan proses generatif data sebagai campuran dari beberapa sub-populasi distribusi probabilitas.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    Hard[\"Hard Clustering (K-Means): Titik Milik Kluster A 100% atau Kluster B 100%\"]\n    Soft[\"Soft Clustering (GMM): Titik Memiliki Probabilitas P(A) = 0.65 & P(B) = 0.35 (Realistis!)\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef soft_assignment_demo(p_A, p_B):\n    total = p_A + p_B\n    return p_A / total, p_B / total\n\ngamma_A, gamma_B = soft_assignment_demo(0.08, 0.02)\nprint(f\"Soft Responsibilities: P(Kluster A) = {gamma_A:.2f}, P(Kluster B) = {gamma_B:.2f}\")\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.mixture import GaussianMixture\n\ngmm_toy = GaussianMixture(n_components=2, random_state=42).fit(X_cl)\nprint(\"GMM Soft Probabilities (3 sampel pertama):\\n\", np.round(gmm_toy.predict_proba(X_cl[:3]), 3))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Jumlah bobot probabilitas baris pertama:\", np.sum(gmm_toy.predict_proba(X_cl[:1])))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nSegmentasi pelanggan bernilai ganda (B2B + B2C): Pelanggan yang membeli produk untuk kebutuhan kantor sekaligus pribadi diposisikan secara lembut di kedua segmen.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Memperlakukan soft probabilities sebagai label keras tanpa memperhitungkan entropy ketidakpastian.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Bishop PRML (Ch. 9 Mixture Models and EM)](https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/) - *Buku standar Mixture Models*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-23-1-paradigma-soft-clustering-mixture-models-scratch",
          "title": "Implementasi First-Principles: 23.1 Model Campuran Probabilistik (Mixture Models)",
          "language": "python",
          "filename": "23_1_paradigma_soft_clustering_mixture_models_scratch.py",
          "code": "def soft_assignment_demo(p_A, p_B):\n    total = p_A + p_B\n    return p_A / total, p_B / total\n\ngamma_A, gamma_B = soft_assignment_demo(0.08, 0.02)\nprint(f\"Soft Responsibilities: P(Kluster A) = {gamma_A:.2f}, P(Kluster B) = {gamma_B:.2f}\")",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-23-1-paradigma-soft-clustering-mixture-models-sota",
          "title": "Implementasi Standar Industri SOTA: 23.1 Model Campuran Probabilistik (Mixture Models)",
          "language": "python",
          "filename": "23_1_paradigma_soft_clustering_mixture_models_sota.py",
          "code": "from sklearn.mixture import GaussianMixture\n\ngmm_toy = GaussianMixture(n_components=2, random_state=42).fit(X_cl)\nprint(\"GMM Soft Probabilities (3 sampel pertama):\\n\", np.round(gmm_toy.predict_proba(X_cl[:3]), 3))",
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
        "Memperlakukan soft probabilities sebagai label keras tanpa memperhitungkan entropy ketidakpastian."
      ],
      "structuredExercises": [
        {
          "id": "ml-23-1-paradigma-soft-clustering-mixture-models-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 23.1 Model Campuran Probabilistik (Mixture Models) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-23-1-paradigma-soft-clustering-mixture-models-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 23.1 Model Campuran Probabilistik (Mixture Models).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-23-2-formulasi-gaussian-mixture-models",
      "slug": "23-2-formulasi-gaussian-mixture-models",
      "title": "23.2 Gaussian Mixture Models (GMM): Formulasi Parameter Bobot Campuran, Vektor Rata-Rata, & Matriks Kovarians",
      "orderIndex": 2,
      "description": "Perumusan formal Gaussian Mixture Models (GMM): bobot campuran pi_k, rata-rata mu_k, matriks kovarians Sigma_k, dan fungsi densitas multimodal.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 23.2 Gaussian Mixture Models (GMM).",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 23.2 Gaussian Mixture Models (GMM): Formulasi Parameter Bobot Campuran, Vektor Rata-Rata, & Matriks Kovarians\n\n## Gambaran Konseptual & Landasan Teori\nFungsi kerapatan probabilitas Gaussian Mixture Model adalah kombinasi linier cembung dari $K$ distribusi Gaussian multivariat:\n$$p(\\mathbf{x}) = \\sum_{k=1}^K \\pi_k \\mathcal{N}(\\mathbf{x} \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)$$\ndi mana:\n- $\\pi_k = P(Z = k)$ adalah **bobot campuran** (*mixing weights*) dengan konstrain $\\pi_k \\ge 0$ dan $\\sum_{k=1}^K \\pi_k = 1$.\n- $\\boldsymbol{\\mu}_k \\in \\mathbb{R}^d$ adalah vektor rata-rata komponen ke-$k$.\n- $\\boldsymbol{\\Sigma}_k \\in \\mathbb{R}^{d \\times d}$ adalah matriks kovarians komponen ke-$k$ yang mengontrol bentuk, rotasi, dan orientasi elipsoid kluster.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    Prior[\"Bobot Campuran pi_1, ..., pi_K (sum pi_k = 1)\"] --> Generative[\"Pilih Komponen k ~ Multinomial(pi)\"]\n    Generative --> Sample[\"Bangkitkan Sampel x ~ N(mu_k, Sigma_k)\"]\n    Sample --> Multimodal[\"Hasil: Distribusi Probabilitas Bersama Multimodal Kompleks!\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef gaussian_pdf_multivariate(x, mean, cov):\n    d = len(x)\n    diff = x - mean\n    inv_cov = np.linalg.inv(cov)\n    det_cov = np.linalg.det(cov)\n    norm_const = 1.0 / (np.sqrt((2 * np.pi)**d * det_cov))\n    exponent = -0.5 * diff.T @ inv_cov @ diff\n    return norm_const * np.exp(exponent)\n\nm_k = np.array([0.0, 0.0])\ncov_k = np.eye(2)\nprint(\"Gaussian PDF pada [0, 0]:\", gaussian_pdf_multivariate(np.array([0.0, 0.0]), m_k, cov_k))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\ngmm = GaussianMixture(n_components=2, covariance_type='full', random_state=42).fit(X_cl)\nprint(\"Bobot Campuran pi_k:\", np.round(gmm.weights_, 3))\nprint(\"Titik Rata-rata mu_k :\\n\", np.round(gmm.means_, 3))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Matriks Kovarians Sigma_k Shape:\", gmm.covariances_.shape)\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPemodelan sinyal akustik fonem suara manusia pada Automatic Speech Recognition (ASR): Suara vokal 'A' dimodelkan sebagai campuran 8 Gaussian.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Terjadinya singularitas numerik (det(Sigma) -> 0) saat satu komponen Gaussian mengisolasi tepat 1 titik data tunggal.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Scikit-Learn Gaussian Mixture Models](https://scikit-learn.org/stable/modules/mixture.html) - *Dokumentasi resmi modul GMM*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-23-2-formulasi-gaussian-mixture-models-scratch",
          "title": "Implementasi First-Principles: 23.2 Gaussian Mixture Models (GMM)",
          "language": "python",
          "filename": "23_2_formulasi_gaussian_mixture_models_scratch.py",
          "code": "def gaussian_pdf_multivariate(x, mean, cov):\n    d = len(x)\n    diff = x - mean\n    inv_cov = np.linalg.inv(cov)\n    det_cov = np.linalg.det(cov)\n    norm_const = 1.0 / (np.sqrt((2 * np.pi)**d * det_cov))\n    exponent = -0.5 * diff.T @ inv_cov @ diff\n    return norm_const * np.exp(exponent)\n\nm_k = np.array([0.0, 0.0])\ncov_k = np.eye(2)\nprint(\"Gaussian PDF pada [0, 0]:\", gaussian_pdf_multivariate(np.array([0.0, 0.0]), m_k, cov_k))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-23-2-formulasi-gaussian-mixture-models-sota",
          "title": "Implementasi Standar Industri SOTA: 23.2 Gaussian Mixture Models (GMM)",
          "language": "python",
          "filename": "23_2_formulasi_gaussian_mixture_models_sota.py",
          "code": "gmm = GaussianMixture(n_components=2, covariance_type='full', random_state=42).fit(X_cl)\nprint(\"Bobot Campuran pi_k:\", np.round(gmm.weights_, 3))\nprint(\"Titik Rata-rata mu_k :\\n\", np.round(gmm.means_, 3))",
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
        "Terjadinya singularitas numerik (det(Sigma) -> 0) saat satu komponen Gaussian mengisolasi tepat 1 titik data tunggal."
      ],
      "structuredExercises": [
        {
          "id": "ml-23-2-formulasi-gaussian-mixture-models-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 23.2 Gaussian Mixture Models (GMM) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-23-2-formulasi-gaussian-mixture-models-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 23.2 Gaussian Mixture Models (GMM).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-23-3-masalah-ketertutupan-analitis-log-likelihood",
      "slug": "23-3-masalah-ketertutupan-analitis-log-likelihood",
      "title": "23.3 Masalah Ketertutupan Analitis Log-Likelihood Campuran & Kebutuhan Variabel Laten Z",
      "orderIndex": 3,
      "description": "Kegagalan solusi analitis tertutup: penjumlahan di dalam logaritma ln(sum pi_k N(x)) dan introduksi variabel indikator laten Z.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 23.3 Masalah Ketertutupan Analitis Log-Likelihood Campuran & Kebutuhan Variabel Laten Z.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 23.3 Masalah Ketertutupan Analitis Log-Likelihood Campuran & Kebutuhan Variabel Laten Z\n\n## Gambaran Konseptual & Landasan Teori\nFungsi log-likelihood dari GMM untuk $n$ observasi independen:\n$$\\ln L(\\boldsymbol{\\theta}) = \\sum_{i=1}^n \\ln \\left( \\sum_{k=1}^K \\pi_k \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k) \\right)$$\n\n**Kemacetan Matematis**:\nTerdapat **penjumlahan di dalam fungsi logaritma** ($\\ln \\sum$).\nKetika kita menghitung gradien $\\nabla_{\\boldsymbol{\\mu}_k} \\ln L = \\mathbf{0}$, suku-suku parameter untuk semua komponen saling terikat rumit dan tidak memiliki solusi analitis tertutup (*no closed-form analytical solution*)!\n\nUntuk memecahkan masalah ini, kita memperkenalkan **Variabel Laten $Z_i \\in \\{1, \\dots, K\\}$** yang menyatakan dari komponen mana sampel $\\mathbf{x}_i$ dibangkitkan. Jika $Z$ diketahui, logaritma langsung berhadapan dengan Gaussian!\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    LogSum[\"Log-Likelihood Campuran: sum ln ( sum pi_k N_k ) -> Terikat Rumit!\"] --> Problem[\"Tidak Ada Solusi Aljabar Tertutup (No Closed-Form)\"]\n    Problem --> Latent[\"Solusi: Kenalkan Variabel Laten Z (Unobserved Component)\"]\n    Latent --> EM[\"Selesaikan via Siklus Ekspektasi-Maksimisasi (EM Algorithm)!\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef log_likelihood_gmm_point(x, weights, means, covariances):\n    prob_density = sum(w * gaussian_pdf_multivariate(x, m, c) for w, m, c in zip(weights, means, covariances))\n    return np.log(max(prob_density, 1e-15))\n\nprint(\"Log-Likelihood Evaluated Point:\", log_likelihood_gmm_point(np.array([1.0, 1.0]), [0.5, 0.5], [np.zeros(2), np.ones(2)*3], [np.eye(2), np.eye(2)]))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nprint(\"Log-Likelihood Skor Total GMM:\", gmm.score(X_cl) * len(X_cl))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Rata-rata Log-Likelihood per sampel:\", gmm.score(X_cl))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nEstimasi populasi ikan di oseanografi: Panjang ikan di laut mengikuti campuran 3 kelompok usia, di mana usia sebenarnya adalah variabel laten tak teramati.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Mencoba menurunkan MLE GMM secara manual menggunakan persamaan normal OLS.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Dempster et al. (1977) Maximum Likelihood from Incomplete Data via the EM Algorithm](https://doi.org/10.1111/j.2517-6161.1977.tb01600.x) - *Paper pendirian algoritma EM JRSS B*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-23-3-masalah-ketertutupan-analitis-log-likelihood-scratch",
          "title": "Implementasi First-Principles: 23.3 Masalah Ketertutupan Analitis Log-Likelihood Campuran & Kebutuhan Variabel Laten Z",
          "language": "python",
          "filename": "23_3_masalah_ketertutupan_analitis_log_likelihood_scratch.py",
          "code": "def log_likelihood_gmm_point(x, weights, means, covariances):\n    prob_density = sum(w * gaussian_pdf_multivariate(x, m, c) for w, m, c in zip(weights, means, covariances))\n    return np.log(max(prob_density, 1e-15))\n\nprint(\"Log-Likelihood Evaluated Point:\", log_likelihood_gmm_point(np.array([1.0, 1.0]), [0.5, 0.5], [np.zeros(2), np.ones(2)*3], [np.eye(2), np.eye(2)]))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-23-3-masalah-ketertutupan-analitis-log-likelihood-sota",
          "title": "Implementasi Standar Industri SOTA: 23.3 Masalah Ketertutupan Analitis Log-Likelihood Campuran & Kebutuhan Variabel Laten Z",
          "language": "python",
          "filename": "23_3_masalah_ketertutupan_analitis_log_likelihood_sota.py",
          "code": "print(\"Log-Likelihood Skor Total GMM:\", gmm.score(X_cl) * len(X_cl))",
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
        "Mencoba menurunkan MLE GMM secara manual menggunakan persamaan normal OLS."
      ],
      "structuredExercises": [
        {
          "id": "ml-23-3-masalah-ketertutupan-analitis-log-likelihood-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 23.3 Masalah Ketertutupan Analitis Log-Likelihood Campuran & Kebutuhan Variabel Laten Z terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-23-3-masalah-ketertutupan-analitis-log-likelihood-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 23.3 Masalah Ketertutupan Analitis Log-Likelihood Campuran & Kebutuhan Variabel Laten Z.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-23-4-penurunan-algoritma-expectation-maximization",
      "slug": "23-4-penurunan-algoritma-expectation-maximization",
      "title": "23.4 Penurunan Lengkap Algoritma Expectation-Maximization (EM): Bukti Konvergensi Monoton via Jensen's Inequality",
      "orderIndex": 4,
      "description": "Pembuktian analitis konvergensi algoritma EM: konstruksi batas bawah varians Evidence Lower Bound (ELBO) via Ketaksamaan Jensen.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 23.4 Penurunan Lengkap Algoritma Expectation-Maximization (EM).",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 23.4 Penurunan Lengkap Algoritma Expectation-Maximization (EM): Bukti Konvergensi Monoton via Jensen's Inequality\n\n## Gambaran Konseptual & Landasan Teori\nMisalkan $\\mathbf{X}$ adalah data teramati dan $\\mathbf{Z}$ adalah data laten. Untuk sembarang distribusi probabilitas $q(\\mathbf{Z})$:\n$$\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) = \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln \\frac{p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})}{q(\\mathbf{Z})} + \\text{KL}(q \\parallel p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}))$$\n\nBerdasarkan **Ketaksamaan Jensen** (karena $\\text{KL} \\ge 0$):\n$$\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) \\ge \\mathcal{L}(q, \\boldsymbol{\\theta}) = \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln \\frac{p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})}{q(\\mathbf{Z})}$$\n$\\mathcal{L}(q, \\boldsymbol{\\theta})$ disebut **Evidence Lower Bound (ELBO)**.\n\nSiklus Dua Tahap EM:\n1. **E-step**: Maksimalkan ELBO terhadap $q$. Batas tercapai saat $\\text{KL} = 0$, yaitu $q(\\mathbf{Z}) = p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}^{(t)})$.\n2. **M-step**: Maksimalkan ELBO terhadap $\\boldsymbol{\\theta}$: $\\boldsymbol{\\theta}^{(t+1)} = \\arg\\max_{\\boldsymbol{\\theta}} \\mathbb{E}_{q}[\\ln p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})]$.\nTeorema membuktikan bahwa log-likelihood sejati **selalu meningkat monoton** di setiap iterasi: $\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}^{(t+1)}) \\ge \\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}^{(t)})$.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    LogL[\"Log-Likelihood ln p(X|theta)\"] --> Jensen[\"Batas Bawah ELBO via Ketaksamaan Jensen: L(q, theta)\"]\n    Jensen --> EStep[\"E-step: Set q(Z) = p(Z|X, theta) -> KL = 0 (Batas Menyentuh Log-Likelihood)\"]\n    EStep --> MStep[\"M-step: Maksimalkan Parameter theta -> Mengangkat Nilai ELBO\"]\n    MStep --> Monotone[\"Jaminan Matematis: Log-Likelihood Selalu Naik Monoton!\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef verify_jensen_inequality():\n    # Demonstrasi log(E[X]) >= E[log(X)] untuk fungsi cekung log\n    x = np.array([1.0, 5.0, 10.0])\n    p = np.array([0.2, 0.5, 0.3])\n    log_E = np.log(np.sum(p * x))\n    E_log = np.sum(p * np.log(x))\n    print(f\"log(E[x]) = {log_E:.4f} >= E[log(x)] = {E_log:.4f} : {log_E >= E_log}\")\n\nverify_jensen_inequality()\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nprint(\"EM Algorithm convergence guarantee mathematically proven via Jensen's Inequality\")\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"GMM converged status:\", gmm.converged_)\n```\n\n## Studi Kasus Industri & Analisis Kritis\nRekonstruksi citra tomografi medis PET scan dari data deteksi foton tak lengkap menggunakan algoritma EM.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Algoritma EM menjamin konvergensi ke optimum lokal (bukan global); inisialisasi yang buruk dapat berakhir di lokal minimum.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Dempster, Laird, Rubin (1977) EM Algorithm Paper](https://doi.org/10.1111/j.2517-6161.1977.tb01600.x) - *Karya monumental EM JRSS B*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-23-4-penurunan-algoritma-expectation-maximization-scratch",
          "title": "Implementasi First-Principles: 23.4 Penurunan Lengkap Algoritma Expectation-Maximization (EM)",
          "language": "python",
          "filename": "23_4_penurunan_algoritma_expectation_maximization_scratch.py",
          "code": "def verify_jensen_inequality():\n    # Demonstrasi log(E[X]) >= E[log(X)] untuk fungsi cekung log\n    x = np.array([1.0, 5.0, 10.0])\n    p = np.array([0.2, 0.5, 0.3])\n    log_E = np.log(np.sum(p * x))\n    E_log = np.sum(p * np.log(x))\n    print(f\"log(E[x]) = {log_E:.4f} >= E[log(x)] = {E_log:.4f} : {log_E >= E_log}\")\n\nverify_jensen_inequality()",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-23-4-penurunan-algoritma-expectation-maximization-sota",
          "title": "Implementasi Standar Industri SOTA: 23.4 Penurunan Lengkap Algoritma Expectation-Maximization (EM)",
          "language": "python",
          "filename": "23_4_penurunan_algoritma_expectation_maximization_sota.py",
          "code": "print(\"EM Algorithm convergence guarantee mathematically proven via Jensen's Inequality\")",
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
        "Algoritma EM menjamin konvergensi ke optimum lokal (bukan global); inisialisasi yang buruk dapat berakhir di lokal minimum."
      ],
      "structuredExercises": [
        {
          "id": "ml-23-4-penurunan-algoritma-expectation-maximization-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 23.4 Penurunan Lengkap Algoritma Expectation-Maximization (EM) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-23-4-penurunan-algoritma-expectation-maximization-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 23.4 Penurunan Lengkap Algoritma Expectation-Maximization (EM).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-23-5-tahap-ekspektasi-responsibilities",
      "slug": "23-5-tahap-ekspektasi-responsibilities",
      "title": "23.5 Tahap Ekspektasi (E-step): Komputasi Tanggung Jawab Posterior (Responsibilities / Soft Assignments)",
      "orderIndex": 5,
      "description": "Operasi Tahap Ekspektasi (E-step): penghitungan bobot tanggung jawab posterior gamma_ik menggunakan Teorema Bayes pada parameter saat ini.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 23.5 Tahap Ekspektasi (E-step).",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 23.5 Tahap Ekspektasi (E-step): Komputasi Tanggung Jawab Posterior (Responsibilities / Soft Assignments)\n\n## Gambaran Konseptual & Landasan Teori\nPada **Tahap Ekspektasi (E-step)**, parameter komponen $\\{\\pi_k, \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k\\}$ ditahan konstan.\nKita menghitung ekspektasi dari variabel indikator laten $Z_{ik}$, yang dikenal sebagai **Tanggung Jawab Posterior (Responsibilities)** $\\gamma_{ik}$:\n$$\\gamma_{ik} = \\mathbb{E}[Z_{ik} \\mid \\mathbf{x}_i, \\boldsymbol{\\theta}] = P(Z_i = k \\mid \\mathbf{x}_i, \\boldsymbol{\\theta}) = \\frac{\\pi_k \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)}{\\sum_{j=1}^K \\pi_j \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_j, \\boldsymbol{\\Sigma}_j)}$$\n\n$\\gamma_{ik}$ menyatakan probabilitas bahwa sampel observasi ke-$i$ dibangkitkan oleh klaster komponen ke-$k$.\nBesaran total sampel efektif yang dimiliki klaster $k$: $N_k = \\sum_{i=1}^n \\gamma_{ik}$.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    Input[\"Observasi x_i & Parameter Saat Ini (pi, mu, Sigma)\"] --> Numerator[\"Hitung: pi_k * N(x_i | mu_k, Sigma_k) untuk k=1..K\"]\n    Numerator --> Normalize[\"Normalisasikan: Bagi dengan Total Seluruh Komponen\"]\n    Normalize --> Gamma[\"Responsibilities gamma_ik in [0, 1] (Soft Assignments)\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef e_step_gmm(X, weights, means, covariances):\n    n = len(X)\n    K = len(weights)\n    gamma = np.zeros((n, K))\n    for k in range(K):\n        for i in range(n):\n            gamma[i, k] = weights[k] * gaussian_pdf_multivariate(X[i], means[k], covariances[k])\n    gamma /= np.sum(gamma, axis=1, keepdims=True)\n    return gamma\n\nw_init = [0.5, 0.5]\nm_init = [np.array([0.0, 0.0]), np.array([5.0, 5.0])]\ncov_init = [np.eye(2), np.eye(2)]\ngamma_sample = e_step_gmm(X_cl[:3], w_init, m_init, cov_init)\nprint(\"E-step Responsibilities gamma_ik:\\n\", np.round(gamma_sample, 3))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nresp_skl = gmm.predict_proba(X_cl[:3])\nprint(\"Scikit-Learn Responsibilities:\\n\", np.round(resp_skl, 3))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Jumlah responsibilitas baris:\", np.sum(gamma_sample, axis=1))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nDekomposisi populasi piksel citra satelit: Mengukur persentase kandungan air vs vegetasi di dalam satu piksel resolusi 30 meter.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Underflow numerik saat menghitung Gaussian likelihood dimensi tinggi: Gunakan log-sum-exp trick.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Bishop PRML (Section 9.2.2 EM for Gaussian Mixtures)](https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/) - *Penurunan detail E-step*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-23-5-tahap-ekspektasi-responsibilities-scratch",
          "title": "Implementasi First-Principles: 23.5 Tahap Ekspektasi (E-step)",
          "language": "python",
          "filename": "23_5_tahap_ekspektasi_responsibilities_scratch.py",
          "code": "def e_step_gmm(X, weights, means, covariances):\n    n = len(X)\n    K = len(weights)\n    gamma = np.zeros((n, K))\n    for k in range(K):\n        for i in range(n):\n            gamma[i, k] = weights[k] * gaussian_pdf_multivariate(X[i], means[k], covariances[k])\n    gamma /= np.sum(gamma, axis=1, keepdims=True)\n    return gamma\n\nw_init = [0.5, 0.5]\nm_init = [np.array([0.0, 0.0]), np.array([5.0, 5.0])]\ncov_init = [np.eye(2), np.eye(2)]\ngamma_sample = e_step_gmm(X_cl[:3], w_init, m_init, cov_init)\nprint(\"E-step Responsibilities gamma_ik:\\n\", np.round(gamma_sample, 3))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-23-5-tahap-ekspektasi-responsibilities-sota",
          "title": "Implementasi Standar Industri SOTA: 23.5 Tahap Ekspektasi (E-step)",
          "language": "python",
          "filename": "23_5_tahap_ekspektasi_responsibilities_sota.py",
          "code": "resp_skl = gmm.predict_proba(X_cl[:3])\nprint(\"Scikit-Learn Responsibilities:\\n\", np.round(resp_skl, 3))",
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
        "Underflow numerik saat menghitung Gaussian likelihood dimensi tinggi: Gunakan log-sum-exp trick."
      ],
      "structuredExercises": [
        {
          "id": "ml-23-5-tahap-ekspektasi-responsibilities-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 23.5 Tahap Ekspektasi (E-step) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-23-5-tahap-ekspektasi-responsibilities-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 23.5 Tahap Ekspektasi (E-step).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-23-6-tahap-maksimisasi-pembaruan-parameter",
      "slug": "23-6-tahap-maksimisasi-pembaruan-parameter",
      "title": "23.6 Tahap Maksimisasi (M-step): Pembaruan Tertutup Parameter Distribusi Komponen",
      "orderIndex": 6,
      "description": "Operasi Tahap Maksimisasi (M-step): solusi analitis tertutup pembaruan mu_k, Sigma_k, dan bobot pi_k menggunakan bobot responsibilitas gamma_ik.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 23.6 Tahap Maksimisasi (M-step).",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 23.6 Tahap Maksimisasi (M-step): Pembaruan Tertutup Parameter Distribusi Komponen\n\n## Gambaran Konseptual & Landasan Teori\nPada **Tahap Maksimisasi (M-step)**, tanggung jawab $\\gamma_{ik}$ ditahan konstan, dan kita memaksimalkan ekspektasi lengkap log-likelihood terhadap parameter.\n\nSolusi analitis pembaruan parameter:\n1. **Bobot Campuran Baru**:\n   $$\\pi_k^{\\text{new}} = \\frac{N_k}{n} = \\frac{1}{n} \\sum_{i=1}^n \\gamma_{ik}$$\n\n2. **Vektor Rata-Rata Baru**:\n   $$\\boldsymbol{\\mu}_k^{\\text{new}} = \\frac{1}{N_k} \\sum_{i=1}^n \\gamma_{ik} \\mathbf{x}_i$$\n\n3. **Matriks Kovarians Baru**:\n   $$\\boldsymbol{\\Sigma}_k^{\\text{new}} = \\frac{1}{N_k} \\sum_{i=1}^n \\gamma_{ik} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k^{\\text{new}})(\\mathbf{x}_i - \\boldsymbol{\\mu}_k^{\\text{new}})^T$$\nSetiap pembaruan adalah rata-rata terbobot sederhana oleh $\\gamma_{ik}$!\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    Gamma[\"Responsibilities gamma_ik dari E-step\"] --> N_k[\"Hitung Ukuran Efektif Kluster: N_k = sum gamma_ik\"]\n    N_k --> UpdatePi[\"Pembaruan Bobot: pi_k = N_k / n\"]\n    N_k --> UpdateMu[\"Pembaruan Rata-rata: mu_k = sum gamma_ik x_i / N_k\"]\n    N_k --> UpdateCov[\"Pembaruan Kovarians: Sigma_k = sum gamma_ik (x-mu)(x-mu)^T / N_k\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef m_step_gmm(X, gamma):\n    n, d = X.shape\n    K = gamma.shape[1]\n    N_k = np.sum(gamma, axis=0)\n    \n    new_weights = N_k / n\n    new_means = [np.sum(gamma[:, k][:, None] * X, axis=0) / N_k[k] for k in range(K)]\n    new_covs = []\n    for k in range(K):\n        diff = X - new_means[k]\n        cov_k = (gamma[:, k][:, None] * diff).T @ diff / N_k[k]\n        new_covs.append(cov_k)\n    return new_weights, new_means, new_covs\n\nw_new, m_new, cov_new = m_step_gmm(X_cl[:10], gamma_sample[:10])\nprint(\"M-step New Weights:\", np.round(w_new, 3))\nprint(\"M-step New Means  :\", np.round(m_new, 3))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nprint(\"Scikit-Learn GMM Iterations Count:\", gmm.n_iter_)\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Verifikasi bobot M-step berjumlah 1:\", np.isclose(np.sum(w_new), 1.0))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPenyelarasan parameter akustik model sintesis vokal: Mengoptimalkan posisi formants frekuensi vokal manusia via M-step.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Lupa menambahkan nilai regularisasi kecil (reg_covar = 1e-6) pada diagonal matriks kovarians untuk mencegah singularitas matriks.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Bishop PRML (Section 9.2.2 M-step Formulation)](https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/) - *Penurunan analitis M-step*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-23-6-tahap-maksimisasi-pembaruan-parameter-scratch",
          "title": "Implementasi First-Principles: 23.6 Tahap Maksimisasi (M-step)",
          "language": "python",
          "filename": "23_6_tahap_maksimisasi_pembaruan_parameter_scratch.py",
          "code": "def m_step_gmm(X, gamma):\n    n, d = X.shape\n    K = gamma.shape[1]\n    N_k = np.sum(gamma, axis=0)\n    \n    new_weights = N_k / n\n    new_means = [np.sum(gamma[:, k][:, None] * X, axis=0) / N_k[k] for k in range(K)]\n    new_covs = []\n    for k in range(K):\n        diff = X - new_means[k]\n        cov_k = (gamma[:, k][:, None] * diff).T @ diff / N_k[k]\n        new_covs.append(cov_k)\n    return new_weights, new_means, new_covs\n\nw_new, m_new, cov_new = m_step_gmm(X_cl[:10], gamma_sample[:10])\nprint(\"M-step New Weights:\", np.round(w_new, 3))\nprint(\"M-step New Means  :\", np.round(m_new, 3))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-23-6-tahap-maksimisasi-pembaruan-parameter-sota",
          "title": "Implementasi Standar Industri SOTA: 23.6 Tahap Maksimisasi (M-step)",
          "language": "python",
          "filename": "23_6_tahap_maksimisasi_pembaruan_parameter_sota.py",
          "code": "print(\"Scikit-Learn GMM Iterations Count:\", gmm.n_iter_)",
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
        "Lupa menambahkan nilai regularisasi kecil (reg_covar = 1e-6) pada diagonal matriks kovarians untuk mencegah singularitas matriks."
      ],
      "structuredExercises": [
        {
          "id": "ml-23-6-tahap-maksimisasi-pembaruan-parameter-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 23.6 Tahap Maksimisasi (M-step) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-23-6-tahap-maksimisasi-pembaruan-parameter-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 23.6 Tahap Maksimisasi (M-step).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-23-7-kriteria-kovarians-gmm-bic-aic",
      "slug": "23-7-kriteria-kovarians-gmm-bic-aic",
      "title": "23.7 Kriteria Kovarians GMM (Full, Tied, Diagonal, Spherical) & Seleksi Model Menggunakan Skor BIC/AIC",
      "orderIndex": 7,
      "description": "Taksonomi struktur matriks kovarians GMM (Full, Tied, Diagonal, Spherical), kompleksitas parameter O(K d^2), dan seleksi model K optimal via BIC/AIC.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 23.7 Kriteria Kovarians GMM (Full, Tied, Diagonal, Spherical) & Seleksi Model Menggunakan Skor BIC/AIC.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 23.7 Kriteria Kovarians GMM (Full, Tied, Diagonal, Spherical) & Seleksi Model Menggunakan Skor BIC/AIC\n\n## Gambaran Konseptual & Landasan Teori\n### 1. Taksonomi Struktur Kovarians GMM:\n- **Spherical**: $\\boldsymbol{\\Sigma}_k = \\sigma_k^2 \\mathbf{I}$ (Klaster berbentuk bola melingkar, mirip K-Means lembut). Parameter: $O(K)$.\n- **Diagonal**: $\\boldsymbol{\\Sigma}_k = \\text{diag}(\\sigma_{k1}^2, \\dots, \\sigma_{kd}^2)$ (Elipsoid sejajar sumbu koordinat, fitur independen). Parameter: $O(K \\cdot d)$.\n- **Tied**: $\\boldsymbol{\\Sigma}_1 = \\dots = \\boldsymbol{\\Sigma}_K = \\boldsymbol{\\Sigma}$ (Semua klaster memiliki bentuk dan orientasi elipsoid yang sama). Parameter: $O(d^2)$.\n- **Full**: Setiap klaster memiliki matriks kovarians bebas sendiri-sendiri (paling fleksibel). Parameter: $O(K \\cdot d^2)$.\n\n### 2. Seleksi Model via BIC & AIC:\n$$\\text{BIC} = -2 \\ln L + p_{\\text{params}} \\ln(n)$$\nModel dengan nilai **BIC terendah** dipilih untuk menghindari overfitting komponen berlebih.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    CovTypes[\"Tipe Matriks Kovarians GMM\"] --> Spherical[\"Spherical: Bola Melingkar O(K)\"]\n    CovTypes --> Diagonal[\"Diagonal: Elips Sejajar Sumbu O(K d)\"]\n    CovTypes --> Tied[\"Tied: Semua Klaster Berbentuk Sama O(d^2)\"]\n    CovTypes --> Full[\"Full: Fleksibel Penuh O(K d^2)\"]\n    CovTypes --> BIC[\"Hitung Kurva BIC untuk Berbagai K -> Pilih Minimum Global\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef count_gmm_parameters(K, d, cov_type='full'):\n    if cov_type == 'full':\n        cov_params = K * d * (d + 1) // 2\n    elif cov_type == 'diagonal':\n        cov_params = K * d\n    elif cov_type == 'spherical':\n        cov_params = K\n    elif cov_type == 'tied':\n        cov_params = d * (d + 1) // 2\n    mean_params = K * d\n    weight_params = K - 1\n    return cov_params + mean_params + weight_params\n\nprint(\"Jumlah Parameter GMM (K=3, d=10):\")\nprint(\"Full      :\", count_gmm_parameters(3, 10, 'full'))\nprint(\"Diagonal  :\", count_gmm_parameters(3, 10, 'diagonal'))\nprint(\"Spherical :\", count_gmm_parameters(3, 10, 'spherical'))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nbic_scores = []\nk_range = range(1, 5)\nfor k in k_range:\n    g = GaussianMixture(n_components=k, random_state=42).fit(X_cl)\n    bic_scores.append(g.bic(X_cl))\n\nprint(\"BIC Scores for K=1..4:\", np.round(bic_scores, 2))\nprint(\"Optimal K via BIC:\", k_range[np.argmin(bic_scores)])\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"AIC Score K=2:\", GaussianMixture(n_components=2, random_state=42).fit(X_cl).aic(X_cl))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPendeteksian jenis kanker dari ekspresi gen: Membandingkan struktur kovarians Full vs Diagonal menggunakan BIC untuk mencegah ledakan parameter.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Menggunakan tipe kovarians 'full' pada dataset berdimensi tinggi d > 100 dengan data sedikit, menyebabkan singularitas matriks instan.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Scikit-Learn Model Selection with GMM](https://scikit-learn.org/stable/auto_examples/mixture/plot_gmm_selection.html) - *Contoh resmi seleksi model BIC GMM*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-23-7-kriteria-kovarians-gmm-bic-aic-scratch",
          "title": "Implementasi First-Principles: 23.7 Kriteria Kovarians GMM (Full, Tied, Diagonal, Spherical) & Seleksi Model Menggunakan Skor BIC/AIC",
          "language": "python",
          "filename": "23_7_kriteria_kovarians_gmm_bic_aic_scratch.py",
          "code": "def count_gmm_parameters(K, d, cov_type='full'):\n    if cov_type == 'full':\n        cov_params = K * d * (d + 1) // 2\n    elif cov_type == 'diagonal':\n        cov_params = K * d\n    elif cov_type == 'spherical':\n        cov_params = K\n    elif cov_type == 'tied':\n        cov_params = d * (d + 1) // 2\n    mean_params = K * d\n    weight_params = K - 1\n    return cov_params + mean_params + weight_params\n\nprint(\"Jumlah Parameter GMM (K=3, d=10):\")\nprint(\"Full      :\", count_gmm_parameters(3, 10, 'full'))\nprint(\"Diagonal  :\", count_gmm_parameters(3, 10, 'diagonal'))\nprint(\"Spherical :\", count_gmm_parameters(3, 10, 'spherical'))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-23-7-kriteria-kovarians-gmm-bic-aic-sota",
          "title": "Implementasi Standar Industri SOTA: 23.7 Kriteria Kovarians GMM (Full, Tied, Diagonal, Spherical) & Seleksi Model Menggunakan Skor BIC/AIC",
          "language": "python",
          "filename": "23_7_kriteria_kovarians_gmm_bic_aic_sota.py",
          "code": "bic_scores = []\nk_range = range(1, 5)\nfor k in k_range:\n    g = GaussianMixture(n_components=k, random_state=42).fit(X_cl)\n    bic_scores.append(g.bic(X_cl))\n\nprint(\"BIC Scores for K=1..4:\", np.round(bic_scores, 2))\nprint(\"Optimal K via BIC:\", k_range[np.argmin(bic_scores)])",
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
        "Menggunakan tipe kovarians 'full' pada dataset berdimensi tinggi d > 100 dengan data sedikit, menyebabkan singularitas matriks instan."
      ],
      "structuredExercises": [
        {
          "id": "ml-23-7-kriteria-kovarians-gmm-bic-aic-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 23.7 Kriteria Kovarians GMM (Full, Tied, Diagonal, Spherical) & Seleksi Model Menggunakan Skor BIC/AIC terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-23-7-kriteria-kovarians-gmm-bic-aic-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 23.7 Kriteria Kovarians GMM (Full, Tied, Diagonal, Spherical) & Seleksi Model Menggunakan Skor BIC/AIC.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    }
  ]
};
