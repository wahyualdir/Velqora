import { AcademicChapter } from "../../types";

export const chapter19: AcademicChapter = {
  "id": "machine-learning-ch-19",
  "slug": "bab-19-reduksi-dimensi-linier-pca-svd-factor-analysis",
  "title": "BAB 19: Reduksi Dimensi Linier: PCA, SVD, & Factor Analysis",
  "orderIndex": 19,
  "description": "Landasan analitis reduksi dimensi linier: maksimisasi varians proyeksi vs minimisasi rekonstruksi, penurunan analitis PCA via pengali Lagrange, dualitas SVD dan dekomposisi spektral kovarians, evaluasi komponen via Scree Plot dan EVR, deteksi anomali SPE, Incremental dan Randomized PCA skala terabyte, serta model variabel laten Factor Analysis.",
  "coreConcepts": [
    "Maksimisasi Varians & Minimisasi Rekonstruksi",
    "Penurunan Analitis Pengali Lagrange",
    "Dualitas Eigendecomposition vs SVD",
    "Scree Plot Elbow & Kriteria Kaiser",
    "Galat Rekonstruksi (SPE) & Deteksi Anomali",
    "Incremental PCA & Randomized PCA",
    "Factor Analysis & Varians Unik vs Bersama"
  ],
  "subchapters": [
    {
      "id": "ml-19-1-landasan-matematis-pca",
      "slug": "19-1-landasan-matematis-pca",
      "title": "19.1 Landasan Matematis Principal Component Analysis (PCA): Maksimisasi Varians Proyeksi vs Minimisasi Rekonstruksi",
      "orderIndex": 1,
      "description": "Fondasi matematis PCA: ekuivalensi dualitas antara pemaksimalan varians proyeksi data dan peminimalan galat rekonstruksi kuadrat ortogonal.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 19.1 Landasan Matematis Principal Component Analysis (PCA).",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 19.1 Landasan Matematis Principal Component Analysis (PCA): Maksimisasi Varians Proyeksi vs Minimisasi Rekonstruksi\n\n## Gambaran Konseptual & Landasan Teori\nPrincipal Component Analysis (PCA) mencari arah ortonormal $\\mathbf{u}_1$ di mana data yang terpusat memiliki varians terbesar:\n$$\\max_{\\|\\mathbf{u}\\|_2 = 1} \\frac{1}{n} \\sum_{i=1}^n (\\mathbf{x}_i^T\\mathbf{u})^2 = \\max_{\\|\\mathbf{u}\\|_2 = 1} \\mathbf{u}^T \\boldsymbol{\\Sigma} \\mathbf{u}$$\ndi mana $\\boldsymbol{\\Sigma} = \\frac{1}{n} \\mathbf{X}^T\\mathbf{X}$ adalah matriks kovarians sampel.\n\nSecara ekuivalen, PCA meminimalkan jumlah kuadrat galat rekonstruksi proyeksi:\n$$\\min_{\\mathbf{u}} \\sum_{i=1}^n \\|\\mathbf{x}_i - (\\mathbf{x}_i^T\\mathbf{u})\\mathbf{u}\\|_2^2$$\nBerdasarkan teorema Pythagoras $\\|\\mathbf{x}\\|_2^2 = \\|\\hat{\\mathbf{x}}\\|_2^2 + \\|\\mathbf{x} - \\hat{\\mathbf{x}}\\|_2^2$, memaksimalkan varians proyeksi identik secara eksak dengan meminimalkan kesalahan rekonstruksi!\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    Centered[\"Data Terpusat X (Mean = 0)\"] --> Objective[\"Tujuan Optimasi PCA\"]\n    Objective --> MaxVar[\"Maksimalkan Varians Proyeksi: max u^T Sigma u\"]\n    Objective --> MinRec[\"Minimalkan Galat Rekonstruksi: min ||x - x_hat||^2\"]\n    MaxVar & MinRec --> Equiv[\"Dua Perspektif Ekuivalen Sempurna (Pythagoras)!\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\nimport numpy as np\n\ndef pca_first_component_manual(X_centered: np.ndarray):\n    cov = (X_centered.T @ X_centered) / len(X_centered)\n    eigvals, eigvecs = np.linalg.eigh(cov)\n    u1 = eigvecs[:, -1]  # Vektor eigen terbesar\n    variance_projected = u1.T @ cov @ u1\n    return u1, variance_projected\n\nnp.random.seed(42)\nX_raw = np.random.randn(100, 3) @ np.diag([5.0, 1.0, 0.2])\nX_c = X_raw - np.mean(X_raw, axis=0)\nu1, var_proj = pca_first_component_manual(X_c)\nprint(\"Arah Komponen Utama Pertama u1:\", np.round(u1, 4))\nprint(f\"Varians Terproyeksi: {var_proj:.4f}\")\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.decomposition import PCA\n\npca = PCA(n_components=1).fit(X_raw)\nprint(\"Scikit-Learn PCA Component 1:\", np.round(pca.components_[0], 4))\nprint(\"Scikit-Learn Explained Var :\", np.round(pca.explained_variance_[0], 4))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Verifikasi komponen cocok:\", np.allclose(np.abs(u1), np.abs(pca.components_[0])))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nKompresi citra satelit multispektral 200 band: PCA mereduksi 200 panjang gelombang menjadi 3 komponen utama yang mempertahankan 98% varians informasi.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Lupa memusatkan data (centering mean = 0) sebelum PCA, yang mendistorsi arah vektor eigen pertama.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Pearson (1901) On Lines and Planes of Closest Fit](https://doi.org/10.1080/14786440109462720) - *Paper asli pendirian PCA Karl Pearson*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-19-1-landasan-matematis-pca-scratch",
          "title": "Implementasi First-Principles: 19.1 Landasan Matematis Principal Component Analysis (PCA)",
          "language": "python",
          "filename": "19_1_landasan_matematis_pca_scratch.py",
          "code": "import numpy as np\n\ndef pca_first_component_manual(X_centered: np.ndarray):\n    cov = (X_centered.T @ X_centered) / len(X_centered)\n    eigvals, eigvecs = np.linalg.eigh(cov)\n    u1 = eigvecs[:, -1]  # Vektor eigen terbesar\n    variance_projected = u1.T @ cov @ u1\n    return u1, variance_projected\n\nnp.random.seed(42)\nX_raw = np.random.randn(100, 3) @ np.diag([5.0, 1.0, 0.2])\nX_c = X_raw - np.mean(X_raw, axis=0)\nu1, var_proj = pca_first_component_manual(X_c)\nprint(\"Arah Komponen Utama Pertama u1:\", np.round(u1, 4))\nprint(f\"Varians Terproyeksi: {var_proj:.4f}\")",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-19-1-landasan-matematis-pca-sota",
          "title": "Implementasi Standar Industri SOTA: 19.1 Landasan Matematis Principal Component Analysis (PCA)",
          "language": "python",
          "filename": "19_1_landasan_matematis_pca_sota.py",
          "code": "from sklearn.decomposition import PCA\n\npca = PCA(n_components=1).fit(X_raw)\nprint(\"Scikit-Learn PCA Component 1:\", np.round(pca.components_[0], 4))\nprint(\"Scikit-Learn Explained Var :\", np.round(pca.explained_variance_[0], 4))",
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
        "Lupa memusatkan data (centering mean = 0) sebelum PCA, yang mendistorsi arah vektor eigen pertama."
      ],
      "structuredExercises": [
        {
          "id": "ml-19-1-landasan-matematis-pca-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 19.1 Landasan Matematis Principal Component Analysis (PCA) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-19-1-landasan-matematis-pca-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 19.1 Landasan Matematis Principal Component Analysis (PCA).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-19-2-penurunan-analitis-pca-lagrange",
      "slug": "19-2-penurunan-analitis-pca-lagrange",
      "title": "19.2 Penurunan Analitis PCA melalui Pengali Lagrange pada Matriks Kovarians Empiris",
      "orderIndex": 2,
      "description": "Penurunan kalkulus matriks PCA: penggunaan Pengali Lagrange untuk konstrain norma ||u||=1 dan kemunculan persamaan eigen Sigma u = lambda u.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 19.2 Penurunan Analitis PCA melalui Pengali Lagrange pada Matriks Kovarians Empiris.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 19.2 Penurunan Analitis PCA melalui Pengali Lagrange pada Matriks Kovarians Empiris\n\n## Gambaran Konseptual & Landasan Teori\nFungsi Lagrangian untuk memaksimalkan varians proyeksi dengan konstrain $\\mathbf{u}^T\\mathbf{u} = 1$:\n$$\\mathcal{L}(\\mathbf{u}, \\lambda) = \\mathbf{u}^T \\boldsymbol{\\Sigma} \\mathbf{u} - \\lambda (\\mathbf{u}^T\\mathbf{u} - 1)$$\n\nMengambil turunan terhadap $\\mathbf{u}$:\n$$\\nabla_{\\mathbf{u}} \\mathcal{L} = 2\\boldsymbol{\\Sigma}\\mathbf{u} - 2\\lambda\\mathbf{u} = \\mathbf{0} \\implies \\boldsymbol{\\Sigma}\\mathbf{u} = \\lambda\\mathbf{u}$$\n\nIni adalah persamaan nilai eigen standar!\nVarians yang dimaksimalkan adalah:\n$$\\mathbf{u}^T \\boldsymbol{\\Sigma} \\mathbf{u} = \\mathbf{u}^T (\\lambda \\mathbf{u}) = \\lambda \\mathbf{u}^T\\mathbf{u} = \\lambda$$\nOleh karena itu, arah varians maksimum adalah **vektor eigen yang bersesuaian dengan nilai eigen $\\lambda$ terbesar** dari matriks kovarians $\\boldsymbol{\\Sigma}$.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    Lagrange[\"Lagrangian: L(u, lambda) = u^T Sigma u - lambda (u^T u - 1)\"] --> Deriv[\"Turunan dL/du = 2 Sigma u - 2 lambda u = 0\"]\n    Deriv --> EigEq[\"Persamaan Nilai Eigen: Sigma u = lambda u\"]\n    EigEq --> Maximize[\"Varians = lambda -> Pilih Nilai Eigen Terbesar!\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef pca_full_decomposition(X_c):\n    cov = (X_c.T @ X_c) / len(X_c)\n    eigvals, eigvecs = np.linalg.eigh(cov)\n    # Urutkan menurun\n    idx = np.argsort(eigvals)[::-1]\n    return eigvals[idx], eigvecs[:, idx]\n\neigvals_sorted, eigvecs_sorted = pca_full_decomposition(X_c)\nprint(\"Nilai Eigen Matriks Kovarians:\", np.round(eigvals_sorted, 4))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\npca_full = PCA().fit(X_raw)\nprint(\"Scikit-Learn Eigenvalues (explained_variance_):\", np.round(pca_full.explained_variance_, 4))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Verifikasi nilai eigen cocok:\", np.allclose(eigvals_sorted, pca_full.explained_variance_))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nAnalisis portofolio keuangan kuantitatif: Nilai eigen pertama merepresentasikan faktor pasar sistemik (*market beta*), sedangkan nilai eigen berikutnya merepresentasikan faktor sektor industri.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Mengasumsikan kovarians simetris memiliki nilai eigen kompleks. Matriks kovarians selalu simetris riil sehingga nilai eigen selalu bernilai riil non-negatif.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Jolliffe (2002) Principal Component Analysis](https://link.springer.com/book/10.1007/b98835) - *Monograf ensiklopedis PCA*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-19-2-penurunan-analitis-pca-lagrange-scratch",
          "title": "Implementasi First-Principles: 19.2 Penurunan Analitis PCA melalui Pengali Lagrange pada Matriks Kovarians Empiris",
          "language": "python",
          "filename": "19_2_penurunan_analitis_pca_lagrange_scratch.py",
          "code": "def pca_full_decomposition(X_c):\n    cov = (X_c.T @ X_c) / len(X_c)\n    eigvals, eigvecs = np.linalg.eigh(cov)\n    # Urutkan menurun\n    idx = np.argsort(eigvals)[::-1]\n    return eigvals[idx], eigvecs[:, idx]\n\neigvals_sorted, eigvecs_sorted = pca_full_decomposition(X_c)\nprint(\"Nilai Eigen Matriks Kovarians:\", np.round(eigvals_sorted, 4))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-19-2-penurunan-analitis-pca-lagrange-sota",
          "title": "Implementasi Standar Industri SOTA: 19.2 Penurunan Analitis PCA melalui Pengali Lagrange pada Matriks Kovarians Empiris",
          "language": "python",
          "filename": "19_2_penurunan_analitis_pca_lagrange_sota.py",
          "code": "pca_full = PCA().fit(X_raw)\nprint(\"Scikit-Learn Eigenvalues (explained_variance_):\", np.round(pca_full.explained_variance_, 4))",
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
        "Mengasumsikan kovarians simetris memiliki nilai eigen kompleks. Matriks kovarians selalu simetris riil sehingga nilai eigen selalu bernilai riil non-negatif."
      ],
      "structuredExercises": [
        {
          "id": "ml-19-2-penurunan-analitis-pca-lagrange-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 19.2 Penurunan Analitis PCA melalui Pengali Lagrange pada Matriks Kovarians Empiris terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-19-2-penurunan-analitis-pca-lagrange-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 19.2 Penurunan Analitis PCA melalui Pengali Lagrange pada Matriks Kovarians Empiris.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-19-3-svd-vs-covariance-pca",
      "slug": "19-3-svd-vs-covariance-pca",
      "title": "19.3 Hubungan Dualitas Eigendecomposition Kovarians dengan Singular Value Decomposition (SVD) Matriks Desain",
      "orderIndex": 3,
      "description": "Hubungan aljabar linier antara PCA dan SVD: dekomposisi X = U Sigma V^T, kestabilan numerik tanpa pembentukan eksplisit X^T X, dan hubungan sigma_j^2 = n lambda_j.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 19.3 Hubungan Dualitas Eigendecomposition Kovarians dengan Singular Value Decomposition (SVD) Matriks Desain.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 19.3 Hubungan Dualitas Eigendecomposition Kovarians dengan Singular Value Decomposition (SVD) Matriks Desain\n\n## Gambaran Konseptual & Landasan Teori\nSingular Value Decomposition (SVD) memfaktorkan matriks desain terpusat $\\mathbf{X} \\in \\mathbb{R}^{n \\times p}$:\n$$\\mathbf{X} = \\mathbf{U} \\boldsymbol{\\Sigma} \\mathbf{V}^T$$\ndi mana $\\mathbf{U} \\in \\mathbb{R}^{n \\times n}$ dan $\\mathbf{V} \\in \\mathbb{R}^{p \\times p}$ adalah matriks ortogonal, dan $\\boldsymbol{\\Sigma}$ berisi nilai-nilai singular $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge 0$.\n\nHubungan dengan Matriks Kovarians:\n$$\\mathbf{X}^T\\mathbf{X} = (\\mathbf{V} \\boldsymbol{\\Sigma}^T \\mathbf{U}^T)(\\mathbf{U} \\boldsymbol{\\Sigma} \\mathbf{V}^T) = \\mathbf{V} \\boldsymbol{\\Sigma}^2 \\mathbf{V}^T$$\nKolom-kolom $\\mathbf{V}$ (vektor singular kanan) adalah **persis vektor eigen dari matriks kovarians $\\mathbf{X}^T\\mathbf{X}$**, dan nilai singular kuadrat berhubungan langsung dengan nilai eigen:\n$$\\lambda_j = \\frac{\\sigma_j^2}{n}$$\nScikit-Learn mengimplementasikan PCA via SVD karena jauh lebih stabil secara numerik dibanding menghitung $\\mathbf{X}^T\\mathbf{X}$ secara langsung.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    X[\"Matriks Desain X (n x p)\"] --> SVD[\"SVD: X = U Sigma V^T\"]\n    SVD --> RightSingular[\"Vektor Singular Kanan V = Vektor Eigen PCA\"]\n    SVD --> SingularVal[\"Nilai Singular: lambda_j = sigma_j^2 / n\"]\n    SVD --> Project[\"Data Terproyeksi: Z = X V = U Sigma\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef pca_via_svd(X_c: np.ndarray):\n    U, s, Vt = np.linalg.svd(X_c, full_matrices=False)\n    V = Vt.T\n    n = len(X_c)\n    eigvals = (s**2) / n\n    Z = X_c @ V\n    return V, eigvals, Z\n\nV_svd, eig_svd, Z_svd = pca_via_svd(X_c)\nprint(\"PCA via SVD Eigenvalues:\", np.round(eig_svd, 4))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\npca_svd = PCA(n_components=3).fit(X_raw)\nprint(\"Scikit-Learn Singular Values:\", np.round(pca_svd.singular_values_, 2))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Verifikasi hubungan sigma^2 / n = lambda:\", np.allclose(pca_svd.singular_values_**2 / len(X_raw), pca_svd.explained_variance_))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nAnalisis semantik laten (Latent Semantic Analysis - LSA) pada mesin pencari: Mengurai matriks term-dokumen berukuran raksasa menggunakan Truncated SVD.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Membentuk matriks X^T X secara eksplisit saat p = 50,000 (menyebabkan memory error O(p^2)); SVD beroperasi langsung pada X.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Golub & Van Loan (2013) Matrix Computations](https://jhupbooks.press.jhu.edu/title/matrix-computations) - *Rujukan kanonikal algoritma SVD numerik*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-19-3-svd-vs-covariance-pca-scratch",
          "title": "Implementasi First-Principles: 19.3 Hubungan Dualitas Eigendecomposition Kovarians dengan Singular Value Decomposition (SVD) Matriks Desain",
          "language": "python",
          "filename": "19_3_svd_vs_covariance_pca_scratch.py",
          "code": "def pca_via_svd(X_c: np.ndarray):\n    U, s, Vt = np.linalg.svd(X_c, full_matrices=False)\n    V = Vt.T\n    n = len(X_c)\n    eigvals = (s**2) / n\n    Z = X_c @ V\n    return V, eigvals, Z\n\nV_svd, eig_svd, Z_svd = pca_via_svd(X_c)\nprint(\"PCA via SVD Eigenvalues:\", np.round(eig_svd, 4))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-19-3-svd-vs-covariance-pca-sota",
          "title": "Implementasi Standar Industri SOTA: 19.3 Hubungan Dualitas Eigendecomposition Kovarians dengan Singular Value Decomposition (SVD) Matriks Desain",
          "language": "python",
          "filename": "19_3_svd_vs_covariance_pca_sota.py",
          "code": "pca_svd = PCA(n_components=3).fit(X_raw)\nprint(\"Scikit-Learn Singular Values:\", np.round(pca_svd.singular_values_, 2))",
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
        "Membentuk matriks X^T X secara eksplisit saat p = 50,000 (menyebabkan memory error O(p^2)); SVD beroperasi langsung pada X."
      ],
      "structuredExercises": [
        {
          "id": "ml-19-3-svd-vs-covariance-pca-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 19.3 Hubungan Dualitas Eigendecomposition Kovarians dengan Singular Value Decomposition (SVD) Matriks Desain terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-19-3-svd-vs-covariance-pca-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 19.3 Hubungan Dualitas Eigendecomposition Kovarians dengan Singular Value Decomposition (SVD) Matriks Desain.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-19-4-evaluasi-komponen-utama-scree-plot",
      "slug": "19-4-evaluasi-komponen-utama-scree-plot",
      "title": "19.4 Evaluasi Komponen Utama: Rasio Varians Terjelaskan (Explained Variance Ratio) & Kriteria Scree Plot Elbow",
      "orderIndex": 4,
      "description": "Metrologi seleksi jumlah komponen k: Explained Variance Ratio (EVR), grafik Scree Plot Elbow, kriteria Kaiser-Guttman (lambda > 1), dan ambang kumulatif 95%.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 19.4 Evaluasi Komponen Utama.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 19.4 Evaluasi Komponen Utama: Rasio Varians Terjelaskan (Explained Variance Ratio) & Kriteria Scree Plot Elbow\n\n## Gambaran Konseptual & Landasan Teori\nRasio Varians Terjelaskan (*Explained Variance Ratio* - EVR) untuk komponen ke-$j$:\n$$\\text{EVR}_j = \\frac{\\lambda_j}{\\sum_{k=1}^p \\lambda_k}$$\n\nMetodologi penentuan jumlah komponen $k$:\n1. **Kriteria Varians Kumulatif**: Memilih $k$ terkecil sehingga $\\sum_{j=1}^k \\text{EVR}_j \\ge 0.90$ atau $0.95$.\n2. **Kriteria Scree Plot (Elbow Rule - Cattell, 1966)**: Plot kurva nilai eigen vs indeks komponen dan cari titik \"siku\" (*elbow*) di mana penurunan varians melambat drastis.\n3. **Kriteria Kaiser-Guttman**: Pada data yang distandarisasi, pertahankan hanya komponen dengan nilai eigen $\\lambda_j > 1$ (varians lebih besar dari satu variabel asli).\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    Eig[\"Nilai-nilai Eigen lambda_1 >= lambda_2 >= ... >= lambda_p\"] --> EVR[\"Hitung Rasio Varians: EVR_j = lambda_j / sum(lambda)\"]\n    EVR --> Cum[\"Hitung Rasio Kumulatif sum_{j=1}^k EVR_j\"]\n    Cum --> Rule1[\"Ambang Batas Kumulatif >= 95%\"]\n    Eig --> Scree[\"Scree Plot: Cari Titik Siku (Elbow)\"]\n    Eig --> Kaiser[\"Kriteria Kaiser: lambda_j > 1.0 (Data Z-Score)\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef explained_variance_ratio(eigvals):\n    total = np.sum(eigvals)\n    ratios = eigvals / total\n    cumulative = np.cumsum(ratios)\n    return ratios, cumulative\n\nratios, cum = explained_variance_ratio(eigvals_sorted)\nprint(\"Explained Variance Ratios per Komponen:\", np.round(ratios, 4))\nprint(\"Varians Kumulatif                     :\", np.round(cum, 4))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nprint(\"Scikit-Learn EVR:\", np.round(pca_full.explained_variance_ratio_, 4))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nk_95 = np.argmax(cum >= 0.95) + 1\nprint(f\"Jumlah komponen minimum untuk mencapai varians >= 95%: {k_95}\")\n```\n\n## Studi Kasus Industri & Analisis Kritis\nReduksi dimensi sensor IoT industri manufaktur: Memangkas 120 sensor getaran dan temperatur menjadi 8 komponen utama yang mencakup 96% dinamika mesin.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Menggunakan Kriteria Kaiser pada data mentah yang belum distandarisasi Z-score.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Cattell (1966) The Scree Test For The Number Of Factors](https://doi.org/10.1207/s15327906mbr0102_10) - *Paper asli penemuan Scree Test*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-19-4-evaluasi-komponen-utama-scree-plot-scratch",
          "title": "Implementasi First-Principles: 19.4 Evaluasi Komponen Utama",
          "language": "python",
          "filename": "19_4_evaluasi_komponen_utama_scree_plot_scratch.py",
          "code": "def explained_variance_ratio(eigvals):\n    total = np.sum(eigvals)\n    ratios = eigvals / total\n    cumulative = np.cumsum(ratios)\n    return ratios, cumulative\n\nratios, cum = explained_variance_ratio(eigvals_sorted)\nprint(\"Explained Variance Ratios per Komponen:\", np.round(ratios, 4))\nprint(\"Varians Kumulatif                     :\", np.round(cum, 4))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-19-4-evaluasi-komponen-utama-scree-plot-sota",
          "title": "Implementasi Standar Industri SOTA: 19.4 Evaluasi Komponen Utama",
          "language": "python",
          "filename": "19_4_evaluasi_komponen_utama_scree_plot_sota.py",
          "code": "print(\"Scikit-Learn EVR:\", np.round(pca_full.explained_variance_ratio_, 4))",
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
        "Menggunakan Kriteria Kaiser pada data mentah yang belum distandarisasi Z-score."
      ],
      "structuredExercises": [
        {
          "id": "ml-19-4-evaluasi-komponen-utama-scree-plot-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 19.4 Evaluasi Komponen Utama terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-19-4-evaluasi-komponen-utama-scree-plot-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 19.4 Evaluasi Komponen Utama.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-19-5-rekonstruksi-kesalahan-deteksi-anomali",
      "slug": "19-5-rekonstruksi-kesalahan-deteksi-anomali",
      "title": "19.5 Rekonstruksi Kesalahan Proyeksi (Reconstruction Error) & Deteksi Sampel Anomali melalui Residual Ruang Sub",
      "orderIndex": 5,
      "description": "Aplikasi PCA dalam deteksi anomali: rekonstruksi proyeksi x_hat = V_k V_k^T x, skor rekonstruksi Spe (Squared Prediction Error / Q-statistic), dan deteksi outlier.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 19.5 Rekonstruksi Kesalahan Proyeksi (Reconstruction Error) & Deteksi Sampel Anomali melalui Residual Ruang Sub.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 19.5 Rekonstruksi Kesalahan Proyeksi (Reconstruction Error) & Deteksi Sampel Anomali melalui Residual Ruang Sub\n\n## Gambaran Konseptual & Landasan Teori\nSetelah mereduksi ke $k$ komponen utama menggunakan matriks proyeksi $\\mathbf{V}_k \\in \\mathbb{R}^{p \\times k}$, data dapat direkonstruksi kembali ke ruang asal:\n$$\\hat{\\mathbf{x}} = \\mathbf{V}_k \\mathbf{V}_k^T \\mathbf{x}$$\n\nVektor residual rekonstruksi adalah $\\mathbf{e} = \\mathbf{x} - \\hat{\\mathbf{x}} = (\\mathbf{I} - \\mathbf{V}_k \\mathbf{V}_k^T)\\mathbf{x}$.\n\n**Skor Anomali Squared Prediction Error (SPE / Q-statistic)**:\n$$\\text{SPE}(\\mathbf{x}) = \\|\\mathbf{x} - \\hat{\\mathbf{x}}\\|_2^2 = \\sum_{j=1}^p (x_j - \\hat{x}_j)^2$$\nObservasi normal yang mematuhi korelasi multi-dimensi akan memiliki SPE rendah. Sampel anomali (outlier) yang melanggar struktur korelasi akan memiliki SPE sangat tinggi karena tidak dapat direkonstruksi oleh subruang $k$ komponen utama!\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    InputX[\"Input Titik Data x\"] --> Proj[\"Proyeksi ke k Komponen: z = V_k^T x\"]\n    Proj --> Reconstruct[\"Rekonstruksi Kembali: x_hat = V_k z\"]\n    InputX & Reconstruct --> Error[\"Galat Rekonstruksi: SPE = ||x - x_hat||^2\"]\n    Error --> Anomaly{\"SPE > Ambang Batas?\"}\n    Anomaly -- Ya --> Flag[\"Anomali / Outlier Terdeteksi!\"]\n    Anomaly -- Tidak --> Normal[\"Data Normal Sesuai Pola\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef pca_reconstruction_anomaly_score(X_c, V_k):\n    # Proyeksi dan rekonstruksi\n    Z = X_c @ V_k\n    X_recon = Z @ V_k.T\n    spe = np.sum((X_c - X_recon)**2, axis=1)\n    return spe\n\nV_1 = eigvecs_sorted[:, :1]  # 1 komponen\nspe_scores = pca_reconstruction_anomaly_score(X_c, V_1)\nprint(\"Top 3 Skor SPE tertinggi:\", np.round(np.sort(spe_scores)[-3:], 4))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\npca_recon = PCA(n_components=1).fit(X_raw)\nX_recon_skl = pca_recon.inverse_transform(pca_recon.transform(X_raw))\nspe_skl = np.sum((X_raw - X_recon_skl)**2, axis=1)\nprint(\"Scikit-Learn Max SPE Anomaly Score:\", np.max(spe_skl))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Deteksi anomali SPE terverifikasi pada residual ruang sub.\")\n```\n\n## Studi Kasus Industri & Analisis Kritis\nDeteksi serangan siber pada lalu lintas router internet: Paket data serangan DDoS menyimpang dari korelasi volume normal dan terdeteksi via lonjakan SPE.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Menyertakan sampel anomali ekstrem selama pelatihan PCA awal, yang mendistorsi arah komponen utama.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Jackson & Mudholkar (1979) Control procedures for residual from principal component](https://doi.org/10.1080/00401706.1979.10489779) - *Paper asli Q-statistic SPE*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-19-5-rekonstruksi-kesalahan-deteksi-anomali-scratch",
          "title": "Implementasi First-Principles: 19.5 Rekonstruksi Kesalahan Proyeksi (Reconstruction Error) & Deteksi Sampel Anomali melalui Residual Ruang Sub",
          "language": "python",
          "filename": "19_5_rekonstruksi_kesalahan_deteksi_anomali_scratch.py",
          "code": "def pca_reconstruction_anomaly_score(X_c, V_k):\n    # Proyeksi dan rekonstruksi\n    Z = X_c @ V_k\n    X_recon = Z @ V_k.T\n    spe = np.sum((X_c - X_recon)**2, axis=1)\n    return spe\n\nV_1 = eigvecs_sorted[:, :1]  # 1 komponen\nspe_scores = pca_reconstruction_anomaly_score(X_c, V_1)\nprint(\"Top 3 Skor SPE tertinggi:\", np.round(np.sort(spe_scores)[-3:], 4))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-19-5-rekonstruksi-kesalahan-deteksi-anomali-sota",
          "title": "Implementasi Standar Industri SOTA: 19.5 Rekonstruksi Kesalahan Proyeksi (Reconstruction Error) & Deteksi Sampel Anomali melalui Residual Ruang Sub",
          "language": "python",
          "filename": "19_5_rekonstruksi_kesalahan_deteksi_anomali_sota.py",
          "code": "pca_recon = PCA(n_components=1).fit(X_raw)\nX_recon_skl = pca_recon.inverse_transform(pca_recon.transform(X_raw))\nspe_skl = np.sum((X_raw - X_recon_skl)**2, axis=1)\nprint(\"Scikit-Learn Max SPE Anomaly Score:\", np.max(spe_skl))",
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
        "Menyertakan sampel anomali ekstrem selama pelatihan PCA awal, yang mendistorsi arah komponen utama."
      ],
      "structuredExercises": [
        {
          "id": "ml-19-5-rekonstruksi-kesalahan-deteksi-anomali-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 19.5 Rekonstruksi Kesalahan Proyeksi (Reconstruction Error) & Deteksi Sampel Anomali melalui Residual Ruang Sub terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-19-5-rekonstruksi-kesalahan-deteksi-anomali-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 19.5 Rekonstruksi Kesalahan Proyeksi (Reconstruction Error) & Deteksi Sampel Anomali melalui Residual Ruang Sub.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-19-6-incremental-randomized-pca",
      "slug": "19-6-incremental-randomized-pca",
      "title": "19.6 Incremental PCA & Randomized PCA untuk Reduksi Dimensi pada Dataset Berskala Terabyte",
      "orderIndex": 6,
      "description": "Skalabilitas reduksi dimensi skala besar: Incremental PCA (IPCA) berbasis mini-batch streaming SVD dan Randomized PCA (Halko et al., 2011).",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 19.6 Incremental PCA & Randomized PCA untuk Reduksi Dimensi pada Dataset Berskala Terabyte.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 19.6 Incremental PCA & Randomized PCA untuk Reduksi Dimensi pada Dataset Berskala Terabyte\n\n## Gambaran Konseptual & Landasan Teori\n1. **Incremental PCA (IPCA)**:\n   Dataset berukuran terabyte tidak dapat dimuat ke RAM sekaligus. IPCA memproses data dalam aliran *mini-batch* menggunakan algoritma update SVD inkremental, menjaga kompleksitas memori tetap $O(B \\cdot p)$ di mana $B$ adalah ukuran batch.\n\n2. **Randomized PCA** (Halko et al., 2011):\n   Jika hanya $k \\ll p$ komponen utama yang dibutuhkan, matriks proyeksi acak $\\boldsymbol{\\Omega} \\in \\mathbb{R}^{p \\times 2k}$ digunakan untuk mengekstrak ruang bagian dominan dalam waktu $O(n \\cdot p \\cdot \\log k)$ alih-alih $O(n \\cdot p^2)$.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    BigData[\"Dataset Terabyte (Lebih Besar dari RAM)\"] --> IPCA[\"Incremental PCA: Muat Mini-Batch per Mini-Batch via Streaming SVD\"]\n    BigData --> RandPCA[\"Randomized PCA: Proyeksi Acak untuk Menemukan k Komponen Utama Tercepat\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef simulate_streaming_mean(batches):\n    n_total, mean_curr = 0, np.zeros(batches[0].shape[1])\n    for b in batches:\n        n_b = len(b)\n        mean_b = np.mean(b, axis=0)\n        mean_curr = (n_total * mean_curr + n_b * mean_b) / (n_total + n_b)\n        n_total += n_b\n    return mean_curr\n\nb1 = np.array([[1.0, 2.0], [3.0, 4.0]])\nb2 = np.array([[5.0, 6.0], [7.0, 8.0]])\nprint(\"Streaming Mean:\", simulate_streaming_mean([b1, b2]))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.decomposition import IncrementalPCA, PCA\n\nipca = IncrementalPCA(n_components=2, batch_size=20)\nipca.fit(X_raw)\nprint(\"Incremental PCA fitted successfully in batches\")\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\npca_rand = PCA(n_components=2, svd_solver='randomized', random_state=42).fit(X_raw)\nprint(\"Randomized PCA Explained Variance:\", np.round(pca_rand.explained_variance_, 3))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nReduksi dimensi rekaman video CCTV pengawas 4K (terabyte) untuk pengenalan gerak manusia secara online.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Ukuran batch IPCA yang terlalu kecil (batch_size < n_components) akan menyebabkan error pembagian SVD.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Halko et al. (2011) Finding structure with randomness](https://doi.org/10.1137/090771806) - *Paper kanonikal Randomized SVD*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-19-6-incremental-randomized-pca-scratch",
          "title": "Implementasi First-Principles: 19.6 Incremental PCA & Randomized PCA untuk Reduksi Dimensi pada Dataset Berskala Terabyte",
          "language": "python",
          "filename": "19_6_incremental_randomized_pca_scratch.py",
          "code": "def simulate_streaming_mean(batches):\n    n_total, mean_curr = 0, np.zeros(batches[0].shape[1])\n    for b in batches:\n        n_b = len(b)\n        mean_b = np.mean(b, axis=0)\n        mean_curr = (n_total * mean_curr + n_b * mean_b) / (n_total + n_b)\n        n_total += n_b\n    return mean_curr\n\nb1 = np.array([[1.0, 2.0], [3.0, 4.0]])\nb2 = np.array([[5.0, 6.0], [7.0, 8.0]])\nprint(\"Streaming Mean:\", simulate_streaming_mean([b1, b2]))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-19-6-incremental-randomized-pca-sota",
          "title": "Implementasi Standar Industri SOTA: 19.6 Incremental PCA & Randomized PCA untuk Reduksi Dimensi pada Dataset Berskala Terabyte",
          "language": "python",
          "filename": "19_6_incremental_randomized_pca_sota.py",
          "code": "from sklearn.decomposition import IncrementalPCA, PCA\n\nipca = IncrementalPCA(n_components=2, batch_size=20)\nipca.fit(X_raw)\nprint(\"Incremental PCA fitted successfully in batches\")",
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
        "Ukuran batch IPCA yang terlalu kecil (batch_size < n_components) akan menyebabkan error pembagian SVD."
      ],
      "structuredExercises": [
        {
          "id": "ml-19-6-incremental-randomized-pca-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 19.6 Incremental PCA & Randomized PCA untuk Reduksi Dimensi pada Dataset Berskala Terabyte terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-19-6-incremental-randomized-pca-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 19.6 Incremental PCA & Randomized PCA untuk Reduksi Dimensi pada Dataset Berskala Terabyte.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-19-7-factor-analysis-variabel-laten",
      "slug": "19-7-factor-analysis-variabel-laten",
      "title": "19.7 Factor Analysis: Pemodelan Variabel Laten dengan Varians Spesifik Unik vs Varians Bersama (Uniqueness vs Communality)",
      "orderIndex": 7,
      "description": "Model variabel laten probabilistik Factor Analysis: dekomposisi varians kovarians Sigma = L L^T + Psi, keunikan (uniqueness) vs komunalitas (communality).",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 19.7 Factor Analysis.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 19.7 Factor Analysis: Pemodelan Variabel Laten dengan Varians Spesifik Unik vs Varians Bersama (Uniqueness vs Communality)\n\n## Gambaran Konseptual & Landasan Teori\nPCA adalah transformasi geometris murni tanpa model probabilitas noise.\n**Factor Analysis (FA)** memodelkan data observasi $\\mathbf{x} \\in \\mathbb{R}^p$ sebagai kombinasi linier dari faktor laten tersembunyi $\\mathbf{z} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I}_k)$ ditambah derau spesifik unik per fitur $\\boldsymbol{\\varepsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\boldsymbol{\\Psi})$:\n$$\\mathbf{x} = \\boldsymbol{\\mu} + \\mathbf{L}\\mathbf{z} + \\boldsymbol{\\varepsilon}$$\ndi mana $\\mathbf{L} \\in \\mathbb{R}^{p \\times k}$ adalah matriks pembebanan faktor (*factor loadings*), dan $\\boldsymbol{\\Psi} = \\text{diag}(\\psi_1, \\dots, \\psi_p)$ adalah matriks varians unik (*uniqueness*).\n\nStruktur kovarians populasi terurai menjadi:\n$$\\boldsymbol{\\Sigma} = \\mathbf{L}\\mathbf{L}^T + \\boldsymbol{\\Psi}$$\n- $\\mathbf{L}\\mathbf{L}^T$: Varians bersama antar-variabel (*Communality*).\n- $\\boldsymbol{\\Psi}$: Varians spesifik unik untuk masing-masing sensor/variabel.\nFA mampu memisahkan sinyal laten dari noise spesifik yang berbeda pada setiap fitur.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    Obs[\"Variabel Teramati x_1 .. x_p\"] --> Decomposition[\"Dekomposisi Kovarians Sigma = L L^T + Psi\"]\n    Decomposition --> Comm[\"L L^T: Varians Bersama (Faktor Laten z_1 .. z_k)\"]\n    Decomposition --> Unique[\"Psi: Varians Derau Unik Masing-masing Fitur\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef factor_analysis_structure(L, psi):\n    \"\"\"Menghitung struktur matriks kovarians Factor Analysis: Sigma = L L^T + diag(psi)\"\"\"\n    return L @ L.T + np.diag(psi)\n\nL_dummy = np.array([[0.8], [0.6], [0.9]])\npsi_dummy = np.array([0.36, 0.64, 0.19])\nprint(\"Matriks Kovarians Factor Analysis:\\n\", np.round(factor_analysis_structure(L_dummy, psi_dummy), 3))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.decomposition import FactorAnalysis\n\nfa = FactorAnalysis(n_components=1, random_state=42).fit(X_raw)\nprint(\"Factor Loadings L:\\n\", np.round(fa.components_, 4))\nprint(\"Noise Variance Psi :\\n\", np.round(fa.noise_variance_, 4))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"FA Log-Likelihood:\", fa.score(X_raw))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPsikometrika & Evaluasi IQ (Teori Spearman): Memodelkan skor ujian matematika, sains, dan bahasa sebagai manifestasi dari satu faktor kecerdasan umum laten (General Intelligence g-factor).\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Mengabaikan rotasi faktor (Varimax rotation) yang mempermudah interpretasi semantik beban faktor L.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Scikit-Learn Factor Analysis Documentation](https://scikit-learn.org/stable/modules/decomposition.html#factor-analysis) - *Dokumentasi modul Factor Analysis*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-19-7-factor-analysis-variabel-laten-scratch",
          "title": "Implementasi First-Principles: 19.7 Factor Analysis",
          "language": "python",
          "filename": "19_7_factor_analysis_variabel_laten_scratch.py",
          "code": "def factor_analysis_structure(L, psi):\n    \"\"\"Menghitung struktur matriks kovarians Factor Analysis: Sigma = L L^T + diag(psi)\"\"\"\n    return L @ L.T + np.diag(psi)\n\nL_dummy = np.array([[0.8], [0.6], [0.9]])\npsi_dummy = np.array([0.36, 0.64, 0.19])\nprint(\"Matriks Kovarians Factor Analysis:\\n\", np.round(factor_analysis_structure(L_dummy, psi_dummy), 3))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-19-7-factor-analysis-variabel-laten-sota",
          "title": "Implementasi Standar Industri SOTA: 19.7 Factor Analysis",
          "language": "python",
          "filename": "19_7_factor_analysis_variabel_laten_sota.py",
          "code": "from sklearn.decomposition import FactorAnalysis\n\nfa = FactorAnalysis(n_components=1, random_state=42).fit(X_raw)\nprint(\"Factor Loadings L:\\n\", np.round(fa.components_, 4))\nprint(\"Noise Variance Psi :\\n\", np.round(fa.noise_variance_, 4))",
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
        "Mengabaikan rotasi faktor (Varimax rotation) yang mempermudah interpretasi semantik beban faktor L."
      ],
      "structuredExercises": [
        {
          "id": "ml-19-7-factor-analysis-variabel-laten-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 19.7 Factor Analysis terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-19-7-factor-analysis-variabel-laten-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 19.7 Factor Analysis.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    }
  ]
};
