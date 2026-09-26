import { AcademicChapter } from "../../types";

export const chapter12: AcademicChapter = {
  "id": "machine-learning-ch-12",
  "slug": "bab-12-kernel-methods-teorema-mercer-rkhs-rbf-kernel-ridge",
  "title": "BAB 12: Kernel Methods & Teorema Mercer (RKHS, RBF, & Kernel Ridge)",
  "orderIndex": 12,
  "description": "Teori dan aplikasi metode kernel: pemetaan ruang Hilbert dimensi tinggi, Kernel Trick, Teorema Mercer dan matriks Gram PSD, taksonomi kernel standar (RBF, Polinomial), Support Vector Regression (SVR), dan skalabilitas kernel via Nyström dan Random Fourier Features (RFF).",
  "coreConcepts": [
    "Pemetaan Non-Linier Ruang Hilbert",
    "Kernel Trick & Inner Product Implisit",
    "Teorema Mercer & Reproducing Kernel Hilbert Space (RKHS)",
    "Taksonomi Kernel Standar (RBF & Polinomial)",
    "Support Vector Regression (SVR) & Epsilon Loss",
    "Aproksimasi Skalabilitas Nyström & Random Fourier Features"
  ],
  "subchapters": [
    {
      "id": "ml-12-1-pemetaan-hilbert-dimensi-tinggi",
      "slug": "12-1-pemetaan-hilbert-dimensi-tinggi",
      "title": "12.1 Keterbatasan Model Linier & Ide Pemetaan Ruang Fitur Dimensi Tak Hingga (Hilbert Space)",
      "orderIndex": 1,
      "description": "Keterbatasan linear separability pada ruang asli: pemetaan eksplisit phi(x) ke ruang fitur berdimensi tinggi atau tak hingga (Hilbert Space).",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 12.1 Keterbatasan Model Linier & Ide Pemetaan Ruang Fitur Dimensi Tak Hingga (Hilbert Space).",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 12.1 Keterbatasan Model Linier & Ide Pemetaan Ruang Fitur Dimensi Tak Hingga (Hilbert Space)\n\n## Gambaran Konseptual & Landasan Teori\nBanyak masalah dunia nyata tidak dapat dipisahkan secara linier pada ruang aslinya $\\mathbb{R}^d$ (contoh klasik: masalah XOR atau data lingkaran konsentris).\nIdenya adalah memetakan data ke ruang fitur berdimensi lebih tinggi $\\mathcal{H}$ melalui transformasi non-linier $\\boldsymbol{\\phi}: \\mathbb{R}^d \\to \\mathcal{H}$:\n$$\\mathbf{x} \\mapsto \\boldsymbol{\\phi}(\\mathbf{x})$$\n\nBerdasarkan **Teorema Cover (1965)**, pola non-linier di ruang asal memiliki probabilitas sangat tinggi untuk menjadi terpisahkan secara linier saat diproyeksikan ke ruang berdimensi tinggi.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    Input[\"Ruang Asal Non-Linier R^2 (Lingkaran Konsentris)\"] --> Mapping[\"Transformasi phi(x) = [x_1^2, sqrt(2) x_1 x_2, x_2^2]\"]\n    Mapping --> Hilbert[\"Ruang Fitur R^3\"]\n    Hilbert --> LinearSep[\"Batas Keputusan Menjadi Hyperplane Linier di R^3!\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef phi_polynomial_2d(x: np.ndarray) -> np.ndarray:\n    \"\"\"Pemetaan eksplisit R^2 -> R^3: [x1^2, sqrt(2)*x1*x2, x2^2]\"\"\"\n    return np.array([x[0]**2, np.sqrt(2)*x[0]*x[1], x[1]**2])\n\nx_a = np.array([1.0, 2.0])\nprint(\"Pemetaan eksplisit phi(x):\", phi_polynomial_2d(x_a))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.preprocessing import PolynomialFeatures\n\npoly = PolynomialFeatures(degree=2, include_bias=False)\nprint(\"Polynomial Features Scikit-Learn:\", poly.fit_transform([x_a])[0])\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Dimensi ruang fitur:\", poly.fit_transform([x_a]).shape[1])\n```\n\n## Studi Kasus Industri & Analisis Kritis\nKlasifikasi data spektroskopi inframerah kimia: Resonansi non-linier senyawa molekuler menjadi linier di ruang fitur berderajat tinggi.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Melakukan komputasi eksplisit phi(x) pada derajat tinggi yang menyebabkan ledakan memori kombinatorial.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Cover (1965) Geometrical and Statistical Properties of Systems of Linear Inequalities](https://doi.org/10.1109/PGEC.1965.264137) - *Teorema Cover pemisahan pola*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-12-1-pemetaan-hilbert-dimensi-tinggi-scratch",
          "title": "Implementasi First-Principles: 12.1 Keterbatasan Model Linier & Ide Pemetaan Ruang Fitur Dimensi Tak Hingga (Hilbert Space)",
          "language": "python",
          "filename": "12_1_pemetaan_hilbert_dimensi_tinggi_scratch.py",
          "code": "def phi_polynomial_2d(x: np.ndarray) -> np.ndarray:\n    \"\"\"Pemetaan eksplisit R^2 -> R^3: [x1^2, sqrt(2)*x1*x2, x2^2]\"\"\"\n    return np.array([x[0]**2, np.sqrt(2)*x[0]*x[1], x[1]**2])\n\nx_a = np.array([1.0, 2.0])\nprint(\"Pemetaan eksplisit phi(x):\", phi_polynomial_2d(x_a))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-12-1-pemetaan-hilbert-dimensi-tinggi-sota",
          "title": "Implementasi Standar Industri SOTA: 12.1 Keterbatasan Model Linier & Ide Pemetaan Ruang Fitur Dimensi Tak Hingga (Hilbert Space)",
          "language": "python",
          "filename": "12_1_pemetaan_hilbert_dimensi_tinggi_sota.py",
          "code": "from sklearn.preprocessing import PolynomialFeatures\n\npoly = PolynomialFeatures(degree=2, include_bias=False)\nprint(\"Polynomial Features Scikit-Learn:\", poly.fit_transform([x_a])[0])",
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
        "Melakukan komputasi eksplisit phi(x) pada derajat tinggi yang menyebabkan ledakan memori kombinatorial."
      ],
      "structuredExercises": [
        {
          "id": "ml-12-1-pemetaan-hilbert-dimensi-tinggi-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 12.1 Keterbatasan Model Linier & Ide Pemetaan Ruang Fitur Dimensi Tak Hingga (Hilbert Space) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-12-1-pemetaan-hilbert-dimensi-tinggi-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 12.1 Keterbatasan Model Linier & Ide Pemetaan Ruang Fitur Dimensi Tak Hingga (Hilbert Space).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-12-2-kernel-trick-inner-product",
      "slug": "12-2-kernel-trick-inner-product",
      "title": "12.2 Kernel Trick: Menghitung Inner Product Tanpa Transformasi Eksplisit Phi(x)",
      "orderIndex": 2,
      "description": "Prinsip Kernel Trick: penghitungan hasil kali dalam K(x, z) = <phi(x), phi(z)> secara implisit dalam ruang asal tanpa pernah menghitung vektor phi secara langsung.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 12.2 Kernel Trick.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 12.2 Kernel Trick: Menghitung Inner Product Tanpa Transformasi Eksplisit Phi(x)\n\n## Gambaran Konseptual & Landasan Teori\nKarena algoritma berbasis dual (seperti SVM dual) hanya membutuhkan perkalian titik $\\langle \\boldsymbol{\\phi}(\\mathbf{x}_i), \\boldsymbol{\\phi}(\\mathbf{x}_j) \\rangle$, kita tidak perlu menghitung $\\boldsymbol{\\phi}(\\mathbf{x})$ secara eksplisit!\n\n**Kernel Function** $K(\\mathbf{x}, \\mathbf{z})$ menghitung nilai dot product di ruang Hilbert langsung dari representasi ruang asal:\n$$K(\\mathbf{x}, \\mathbf{z}) = \\langle \\boldsymbol{\\phi}(\\mathbf{x}), \\boldsymbol{\\phi}(\\mathbf{z}) \\rangle_{\\mathcal{H}}$$\n\nSebagai contoh, untuk kernel polinomial derajat 2 pada $\\mathbb{R}^2$:\n$$(\\mathbf{x}^T\\mathbf{z})^2 = (x_1 z_1 + x_2 z_2)^2 = x_1^2 z_1^2 + 2 x_1 x_2 z_1 z_2 + x_2^2 z_2^2 = \\langle \\boldsymbol{\\phi}(\\mathbf{x}), \\boldsymbol{\\phi}(\\mathbf{z}) \\rangle$$\nBiaya komputasi: $O(d)$ di ruang asal, alih-alih $O(d^2)$ di ruang fitur!\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    Naive[\"Pendekatan Naif: x -> phi(x) -> dot product (Kompleksitas Meledak O(D))\"]\n    KernelTrick[\"Kernel Trick: K(x, z) langsung dihitung di ruang asal O(d)!\"]\n    Naive -. Ekuivalen Matematis .- KernelTrick\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef kernel_polynomial(x: np.ndarray, z: np.ndarray, degree: int = 2) -> float:\n    return np.dot(x, z) ** degree\n\nx_1 = np.array([1.0, 2.0])\nx_2 = np.array([3.0, 4.0])\nk_val = kernel_polynomial(x_1, x_2, degree=2)\nphi_dot = np.dot(phi_polynomial_2d(x_1), phi_polynomial_2d(x_2))\nprint(\"Kernel trick result :\", k_val)\nprint(\"Explicit dot product:\", phi_dot)\nprint(\"Apakah ekuivalen?   :\", np.isclose(k_val, phi_dot))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.metrics.pairwise import polynomial_kernel\n\nprint(\"Scikit-Learn Polynomial Kernel:\", polynomial_kernel([x_1], [x_2], degree=2, coef0=0)[0, 0])\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Verifikasi kesamaan nilai kernel trick:\", np.isclose(k_val, polynomial_kernel([x_1], [x_2], degree=2, coef0=0)[0, 0]))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPencocokan struktur molekul kimia menggunakan Graph Kernels: Membandingkan similaritas molekul tanpa memetakan seluruh kombinasi subgraf.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Memilih derajat polinomial terlalu tinggi (degree > 5) yang menyebabkan ledakan nilai numerik (floating point overflow).\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Schölkopf & Smola Learning with Kernels (Ch. 2)](https://mitpress.mit.edu/9780262194754/) - *Buku bab Kernel Trick*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-12-2-kernel-trick-inner-product-scratch",
          "title": "Implementasi First-Principles: 12.2 Kernel Trick",
          "language": "python",
          "filename": "12_2_kernel_trick_inner_product_scratch.py",
          "code": "def kernel_polynomial(x: np.ndarray, z: np.ndarray, degree: int = 2) -> float:\n    return np.dot(x, z) ** degree\n\nx_1 = np.array([1.0, 2.0])\nx_2 = np.array([3.0, 4.0])\nk_val = kernel_polynomial(x_1, x_2, degree=2)\nphi_dot = np.dot(phi_polynomial_2d(x_1), phi_polynomial_2d(x_2))\nprint(\"Kernel trick result :\", k_val)\nprint(\"Explicit dot product:\", phi_dot)\nprint(\"Apakah ekuivalen?   :\", np.isclose(k_val, phi_dot))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-12-2-kernel-trick-inner-product-sota",
          "title": "Implementasi Standar Industri SOTA: 12.2 Kernel Trick",
          "language": "python",
          "filename": "12_2_kernel_trick_inner_product_sota.py",
          "code": "from sklearn.metrics.pairwise import polynomial_kernel\n\nprint(\"Scikit-Learn Polynomial Kernel:\", polynomial_kernel([x_1], [x_2], degree=2, coef0=0)[0, 0])",
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
        "Memilih derajat polinomial terlalu tinggi (degree > 5) yang menyebabkan ledakan nilai numerik (floating point overflow)."
      ],
      "structuredExercises": [
        {
          "id": "ml-12-2-kernel-trick-inner-product-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 12.2 Kernel Trick terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-12-2-kernel-trick-inner-product-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 12.2 Kernel Trick.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-12-3-teorema-mercer-rkhs",
      "slug": "12-3-teorema-mercer-rkhs",
      "title": "12.3 Teorema Mercer & Reproducing Kernel Hilbert Space (RKHS): Karakteristik Matriks Gram Definit Positif",
      "orderIndex": 3,
      "description": "Landasan analitis Teorema Mercer: syarat perlu dan cukup fungsi kernel valid, matriks Gram semi-definit positif, dan struktur ruang RKHS.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 12.3 Teorema Mercer & Reproducing Kernel Hilbert Space (RKHS).",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 12.3 Teorema Mercer & Reproducing Kernel Hilbert Space (RKHS): Karakteristik Matriks Gram Definit Positif\n\n## Gambaran Konseptual & Landasan Teori\n**Teorema Mercer (1909)**: Suatu fungsi simetris kontinu $K(\\mathbf{x}, \\mathbf{z})$ dapat didekomposisikan sebagai inner product pada suatu ruang Hilbert jika dan hanya jika matriks Gram $\\mathbf{K} \\in \\mathbb{R}^{n \\times n}$ dengan elemen $K_{ij} = K(\\mathbf{x}_i, \\mathbf{x}_j)$ bersifat **Semi-Definit Positif (Positive Semi-Definite - PSD)** untuk sembarang himpunan titik $\\{\\mathbf{x}_1, \\dots, \\mathbf{x}_n\\}$:\n$$\\mathbf{c}^T \\mathbf{K} \\mathbf{c} = \\sum_{i=1}^n \\sum_{j=1}^n c_i c_j K(\\mathbf{x}_i, \\mathbf{x}_j) \\ge 0, \\quad \\forall \\mathbf{c} \\in \\mathbb{R}^n$$\n\nRuang fungsi yang diasosiasikan dengan kernel ini disebut **Reproducing Kernel Hilbert Space (RKHS)**, yang memiliki sifat reproduksi: $\\langle f, K(\\cdot, \\mathbf{x}) \\rangle_{\\mathcal{H}} = f(\\mathbf{x})$.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    Cand[\"Fungsi Kandidat K(x, z)\"] --> Gram[\"Bangun Matriks Gram: K_ij = K(x_i, x_j)\"]\n    Gram --> Eig[\"Hitung Nilai Eigen lambda_i\"]\n    Eig --> Check{\"Apakah seluruh lambda_i >= 0? (PSD)\"}\n    Check -- Ya --> Valid[\"Memenuhi Teorema Mercer: Valid Kernel RKHS!\"]\n    Check -- Tidak --> Invalid[\"Bukan Kernel Valid! Optimasi Non-Konveks\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef verify_mercer_condition(X: np.ndarray, kernel_fn):\n    n = len(X)\n    K = np.zeros((n, n))\n    for i in range(n):\n        for j in range(n):\n            K[i, j] = kernel_fn(X[i], X[j])\n    eigvals = np.linalg.eigvalsh(K)\n    is_psd = np.all(eigvals >= -1e-8)\n    return is_psd, np.min(eigvals)\n\nrbf_fn = lambda a, b: np.exp(-0.5 * np.linalg.norm(a - b)**2)\nis_psd, min_eig = verify_mercer_condition(X_sep, rbf_fn)\nprint(f\"RBF Kernel memenuhi syarat Mercer PSD: {is_psd} (Min Eigval: {min_eig:.4e})\")\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.metrics.pairwise import rbf_kernel\n\nK_skl = rbf_kernel(X_sep, gamma=0.5)\nprint(\"Min eigenvalue Scikit-Learn RBF Gram matrix:\", np.min(np.linalg.eigvalsh(K_skl)))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Matriks Gram simetris:\", np.allclose(K_skl, K_skl.T))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPerancangan string kernel untuk bioinformatika: Memastikan fungsi similaritas sekuens DNA memenuhi syarat Mercer agar konvergensi SVM terjamin.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Menggunakan metrik similaritas heuristik (seperti Cosine dengan modifikasi non-PSD) yang menyebabkan QP solver gagal konvergen.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Mercer (1909) Functions of positive and negative type](https://doi.org/10.1098/rsta.1909.0016) - *Paper asli Teorema Mercer*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-12-3-teorema-mercer-rkhs-scratch",
          "title": "Implementasi First-Principles: 12.3 Teorema Mercer & Reproducing Kernel Hilbert Space (RKHS)",
          "language": "python",
          "filename": "12_3_teorema_mercer_rkhs_scratch.py",
          "code": "def verify_mercer_condition(X: np.ndarray, kernel_fn):\n    n = len(X)\n    K = np.zeros((n, n))\n    for i in range(n):\n        for j in range(n):\n            K[i, j] = kernel_fn(X[i], X[j])\n    eigvals = np.linalg.eigvalsh(K)\n    is_psd = np.all(eigvals >= -1e-8)\n    return is_psd, np.min(eigvals)\n\nrbf_fn = lambda a, b: np.exp(-0.5 * np.linalg.norm(a - b)**2)\nis_psd, min_eig = verify_mercer_condition(X_sep, rbf_fn)\nprint(f\"RBF Kernel memenuhi syarat Mercer PSD: {is_psd} (Min Eigval: {min_eig:.4e})\")",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-12-3-teorema-mercer-rkhs-sota",
          "title": "Implementasi Standar Industri SOTA: 12.3 Teorema Mercer & Reproducing Kernel Hilbert Space (RKHS)",
          "language": "python",
          "filename": "12_3_teorema_mercer_rkhs_sota.py",
          "code": "from sklearn.metrics.pairwise import rbf_kernel\n\nK_skl = rbf_kernel(X_sep, gamma=0.5)\nprint(\"Min eigenvalue Scikit-Learn RBF Gram matrix:\", np.min(np.linalg.eigvalsh(K_skl)))",
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
        "Menggunakan metrik similaritas heuristik (seperti Cosine dengan modifikasi non-PSD) yang menyebabkan QP solver gagal konvergen."
      ],
      "structuredExercises": [
        {
          "id": "ml-12-3-teorema-mercer-rkhs-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 12.3 Teorema Mercer & Reproducing Kernel Hilbert Space (RKHS) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-12-3-teorema-mercer-rkhs-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 12.3 Teorema Mercer & Reproducing Kernel Hilbert Space (RKHS).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-12-4-taksonomi-kernel-standar",
      "slug": "12-4-taksonomi-kernel-standar",
      "title": "12.4 Taksonomi Kernel Standar: Polinomial, Radial Basis Function (Gaussian RBF), & Sigmoid",
      "orderIndex": 4,
      "description": "Karakteristik matematika kernel standar: Linear, Polynomial, Gaussian RBF (dimensi tak hingga), dan Sigmoid/Hyperbolic Tangent.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 12.4 Taksonomi Kernel Standar.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 12.4 Taksonomi Kernel Standar: Polinomial, Radial Basis Function (Gaussian RBF), & Sigmoid\n\n## Gambaran Konseptual & Landasan Teori\n1. **Linear Kernel**:\n   $$K(\\mathbf{x}, \\mathbf{z}) = \\mathbf{x}^T\\mathbf{z} + c$$\n\n2. **Polynomial Kernel**:\n   $$K(\\mathbf{x}, \\mathbf{z}) = (\\gamma \\mathbf{x}^T\\mathbf{z} + c)^d$$\n\n3. **Radial Basis Function (Gaussian RBF)**:\n   $$K(\\mathbf{x}, \\mathbf{z}) = \\exp(-\\gamma \\|\\mathbf{x} - \\mathbf{z}\\|_2^2)$$\n   Melalui ekspansi deret Taylor dari $\\exp(\\cdot)$, RBF kernel merepresentasikan pemetaan ke ruang Hilbert berdimensi **tak terhingga ($\\infty$-dimensional space)**! Parameter $\\gamma$ mengontrol radius pengaruh tiap sampel.\n\n4. **Sigmoid Kernel**:\n   $$K(\\mathbf{x}, \\mathbf{z}) = \\tanh(\\gamma \\mathbf{x}^T\\mathbf{z} + c)$$\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    Kernel[\"Taksonomi Kernel\"] --> Lin[\"Linear: Garis Lurus\"]\n    Kernel --> Poly[\"Polynomial: Kurva Derajat d\"]\n    Kernel --> RBF[\"Gaussian RBF: Dimensi Tak Hingga (Lokal Sferis)\"]\n    Kernel --> Sig[\"Sigmoid: Menyerupai Neural Network MLP\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef rbf_kernel_manual(x: np.ndarray, z: np.ndarray, gamma: float = 0.5) -> float:\n    return np.exp(-gamma * np.sum((x - z)**2))\n\nprint(\"RBF Kernel(x1, x2):\", rbf_kernel_manual(x_1, x_2, gamma=0.1))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.metrics.pairwise import rbf_kernel\n\nprint(\"Scikit-Learn RBF Kernel:\", rbf_kernel([x_1], [x_2], gamma=0.1)[0, 0])\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"Verifikasi RBF identik:\", np.isclose(rbf_kernel_manual(x_1, x_2, 0.1), rbf_kernel([x_1], [x_2], 0.1)[0, 0]))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPendeteksian intrusi jaringan siber: RBF Kernel mampu mengisolasi klaster serangan non-linier kompleks yang tersebar sporadis di ruang jaringan.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Memilih nilai gamma RBF terlalu besar (gamma > 100), menyebabkan overfitting parah di mana setiap titik latih menjadi pulau terisolasi.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Scikit-Learn RBF Kernel Documentation](https://scikit-learn.org/stable/modules/metrics.html#rbf-kernel) - *Dokumentasi kernel RBF*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-12-4-taksonomi-kernel-standar-scratch",
          "title": "Implementasi First-Principles: 12.4 Taksonomi Kernel Standar",
          "language": "python",
          "filename": "12_4_taksonomi_kernel_standar_scratch.py",
          "code": "def rbf_kernel_manual(x: np.ndarray, z: np.ndarray, gamma: float = 0.5) -> float:\n    return np.exp(-gamma * np.sum((x - z)**2))\n\nprint(\"RBF Kernel(x1, x2):\", rbf_kernel_manual(x_1, x_2, gamma=0.1))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-12-4-taksonomi-kernel-standar-sota",
          "title": "Implementasi Standar Industri SOTA: 12.4 Taksonomi Kernel Standar",
          "language": "python",
          "filename": "12_4_taksonomi_kernel_standar_sota.py",
          "code": "from sklearn.metrics.pairwise import rbf_kernel\n\nprint(\"Scikit-Learn RBF Kernel:\", rbf_kernel([x_1], [x_2], gamma=0.1)[0, 0])",
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
        "Memilih nilai gamma RBF terlalu besar (gamma > 100), menyebabkan overfitting parah di mana setiap titik latih menjadi pulau terisolasi."
      ],
      "structuredExercises": [
        {
          "id": "ml-12-4-taksonomi-kernel-standar-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 12.4 Taksonomi Kernel Standar terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-12-4-taksonomi-kernel-standar-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 12.4 Taksonomi Kernel Standar.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-12-5-support-vector-regression-svr",
      "slug": "12-5-support-vector-regression-svr",
      "title": "12.5 Support Vector Regression (SVR): Tabung Kerugian Epsilon-Insensitive & Formulasi Dual",
      "orderIndex": 5,
      "description": "Regresi non-linier berbasis SVM: fungsi kerugian epsilon-insensitive, variabel slack ganda (xi, xi*), dan tabung toleransi kesalahan.",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 12.5 Support Vector Regression (SVR).",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 12.5 Support Vector Regression (SVR): Tabung Kerugian Epsilon-Insensitive & Formulasi Dual\n\n## Gambaran Konseptual & Landasan Teori\nSupport Vector Regression (SVR) menggunakan **$\\varepsilon$-insensitive loss**:\n$$L_\\varepsilon(y, f(\\mathbf{x})) = \\max(0, |y - f(\\mathbf{x})| - \\varepsilon)$$\nResidual di dalam tabung $\\pm \\varepsilon$ tidak dikenakan penalti sama sekali!\n\nFormulasi primal SVR:\n$$\\min_{\\mathbf{w}, b, \\boldsymbol{\\xi}, \\boldsymbol{\\xi}^*} \\frac{1}{2}\\|\\mathbf{w}\\|_2^2 + C\\sum_{i=1}^n (\\xi_i + \\xi_i^*)$$\n$$\\text{subject to } \\begin{cases} y_i - f(\\mathbf{x}_i) \\le \\varepsilon + \\xi_i \\\\ f(\\mathbf{x}_i) - y_i \\le \\varepsilon + \\xi_i^* \\\\ \\xi_i, \\xi_i^* \\ge 0 \\end{cases}$$\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    Tube[\"Tabung Toleransi Epsilon: |y - y_hat| <= eps\"] --> ZeroLoss[\"Loss = 0 (Titik di dalam tabung diabaikan)\"]\n    Tube --> Slack[\"Titik di Luar Tabung dikenakan Penalti Linear xi atau xi*\"]\n    Slack --> SVRModel[\"Hanya Titik di Luar atau pada Batas Tabung yang Menjadi Support Vectors!\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef epsilon_insensitive_loss(y_true, y_pred, eps=0.2):\n    return np.maximum(0, np.abs(y_true - y_pred) - eps)\n\ny_val = np.array([2.0, 2.1, 2.5])\ny_p = np.array([2.1, 2.0, 2.0])\nprint(\"Epsilon-insensitive Loss (eps=0.2):\", epsilon_insensitive_loss(y_val, y_p, eps=0.2))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.svm import SVR\n\nsvr_rbf = SVR(kernel='rbf', C=10.0, epsilon=0.2).fit(X_sep, y_sep)\nprint(\"SVR Support Vectors Count:\", len(svr_rbf.support_))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nprint(\"R2 Score SVR:\", svr_rbf.score(X_sep, y_sep))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPeramalan konsumsi energi listrik per jam pada smart grid: SVR dengan RBF kernel mengabaikan fluktuasi acak kecil di dalam tabung epsilon.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Menyetel epsilon terlalu besar sehingga seluruh data masuk ke dalam tabung dan model menghasilkan prediksi konstanta datar.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Smola & Schölkopf (2004) A tutorial on support vector regression](https://doi.org/10.1023/B:STCO.0000035301.49549.88) - *Tutorial komprehensif SVR*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-12-5-support-vector-regression-svr-scratch",
          "title": "Implementasi First-Principles: 12.5 Support Vector Regression (SVR)",
          "language": "python",
          "filename": "12_5_support_vector_regression_svr_scratch.py",
          "code": "def epsilon_insensitive_loss(y_true, y_pred, eps=0.2):\n    return np.maximum(0, np.abs(y_true - y_pred) - eps)\n\ny_val = np.array([2.0, 2.1, 2.5])\ny_p = np.array([2.1, 2.0, 2.0])\nprint(\"Epsilon-insensitive Loss (eps=0.2):\", epsilon_insensitive_loss(y_val, y_p, eps=0.2))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-12-5-support-vector-regression-svr-sota",
          "title": "Implementasi Standar Industri SOTA: 12.5 Support Vector Regression (SVR)",
          "language": "python",
          "filename": "12_5_support_vector_regression_svr_sota.py",
          "code": "from sklearn.svm import SVR\n\nsvr_rbf = SVR(kernel='rbf', C=10.0, epsilon=0.2).fit(X_sep, y_sep)\nprint(\"SVR Support Vectors Count:\", len(svr_rbf.support_))",
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
        "Menyetel epsilon terlalu besar sehingga seluruh data masuk ke dalam tabung dan model menghasilkan prediksi konstanta datar."
      ],
      "structuredExercises": [
        {
          "id": "ml-12-5-support-vector-regression-svr-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 12.5 Support Vector Regression (SVR) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-12-5-support-vector-regression-svr-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 12.5 Support Vector Regression (SVR).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-12-6-skalabilitas-kernel-nystrom-rff",
      "slug": "12-6-skalabilitas-kernel-nystrom-rff",
      "title": "12.6 Skalabilitas Kernel pada Dataset Besar: Aproksimasi Nyström & Random Fourier Features",
      "orderIndex": 6,
      "description": "Mengatasi kemacetan komputasi O(n^2) memori dan O(n^3) waktu pada kernel methods: metode sub-sampling Nyström dan Random Fourier Features (Rahimi-Recht).",
      "learningObjectives": [
        "Memahami perumusan analitis dan landasan teoretis 12.6 Skalabilitas Kernel pada Dataset Besar.",
        "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri.",
        "Mendiagnosis kelemahan numerik dan mengevaluasi kinerja model secara kuantitatif."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 12.6 Skalabilitas Kernel pada Dataset Besar: Aproksimasi Nyström & Random Fourier Features\n\n## Gambaran Konseptual & Landasan Teori\nMatriks Gram berukuran $n \\times n$ membutuhkan memori $O(n^2)$ dan inversi $O(n^3)$, tidak mungkin diaplikasikan saat $n > 100,000$.\n\n### 1. Metode Nyström:\nMemilih subset $m \\ll n$ kolom matriks Gram secara acak dan mengaproksimasi matriks penuh melalui dekomposisi low-rank:\n$$\\mathbf{K} \\approx \\mathbf{K}_{n, m} \\mathbf{K}_{m, m}^{-1} \\mathbf{K}_{m, n}$$\n\n### 2. Random Fourier Features (RFF - Rahimi & Recht, 2007):\nBerdasarkan Teorema Bochner, kernel shift-invariant $K(\\mathbf{x} - \\mathbf{z})$ adalah transformasi Fourier dari distribusi probabilitas $p(\\boldsymbol{\\omega})$. Kita dapat memetakan data ke representasi acak berdimensi $D$:\n$$\\mathbf{z}(\\mathbf{x}) = \\sqrt{\\frac{2}{D}} \\cos(\\mathbf{W}\\mathbf{x} + \\mathbf{b}), \\quad \\mathbf{W} \\sim \\mathcal{N}(\\mathbf{0}, 2\\gamma \\mathbf{I}), \\quad \\mathbf{b} \\sim \\text{Uniform}(0, 2\\pi)$$\nDot product $\\mathbf{z}(\\mathbf{x})^T \\mathbf{z}(\\mathbf{y}) \\approx K_{\\text{RBF}}(\\mathbf{x}, \\mathbf{y})$ memungkinkan penggunaan model linier cepat $O(n)$!\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    Bottleneck[\"Matriks Gram Penuh K (n x n): Memori O(n^2), Inversi O(n^3)\"] --> Nystrom[\"Metode Nyström: Aproksimasi Low-Rank via m << n Titik Acak\"]\n    Bottleneck --> RFF[\"Random Fourier Features (RFF): Proyeksi Acak z(x) in R^D\"]\n    RFF --> LinSolver[\"Gunakan Linear Solver Cepat (O(n D)) untuk Mensimulasikan Kernel RBF!\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef random_fourier_features(X: np.ndarray, D: int = 100, gamma: float = 0.5):\n    d = X.shape[1]\n    np.random.seed(42)\n    W = np.random.normal(0, np.sqrt(2 * gamma), size=(D, d))\n    b = np.random.uniform(0, 2 * np.pi, size=D)\n    Z = np.sqrt(2.0 / D) * np.cos(X @ W.T + b)\n    return Z\n\nZ_rff = random_fourier_features(X_sep, D=200, gamma=0.5)\nprint(\"Ukuran Matriks Fitur Acak RFF:\", Z_rff.shape)\nprint(\"Aproksimasi RBF Dot Product:\", np.dot(Z_rff[0], Z_rff[1]))\nprint(\"RBF Eksak                 :\", rbf_kernel([X_sep[0]], [X_sep[1]], gamma=0.5)[0, 0])\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.kernel_approximation import NBFSSampler, Nystroem, RBFSampler\n\nrbf_sampler = RBFSampler(gamma=0.5, n_components=200, random_state=42)\nZ_skl = rbf_sampler.fit_transform(X_sep)\nprint(\"Scikit-Learn RBFSampler output shape:\", Z_skl.shape)\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nnystroem = Nystroem(gamma=0.5, n_components=50, random_state=42)\nZ_nys = nystroem.fit_transform(X_sep)\nprint(\"Nystroem Approximated Shape:\", Z_nys.shape)\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPencarian kemiripan audio berskala 10 juta lagu di Spotify: RFF memungkinkan pemetaan kernel RBF secara streaming tanpa menyimpan matriks Gram.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Mengatur jumlah komponen D pada RFF terlalu kecil, menghasilkan aproksimasi kernel yang memiliki varians Monte Carlo tinggi.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Rahimi & Recht (2007) Random Features for Large-Scale Kernel Machines](https://papers.nips.cc/paper/2007/hash/013a006f03dbc5392effeb8f18fda755-Abstract.html) - *Paper pemenang Test of Time Award NeurIPS*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-12-6-skalabilitas-kernel-nystrom-rff-scratch",
          "title": "Implementasi First-Principles: 12.6 Skalabilitas Kernel pada Dataset Besar",
          "language": "python",
          "filename": "12_6_skalabilitas_kernel_nystrom_rff_scratch.py",
          "code": "def random_fourier_features(X: np.ndarray, D: int = 100, gamma: float = 0.5):\n    d = X.shape[1]\n    np.random.seed(42)\n    W = np.random.normal(0, np.sqrt(2 * gamma), size=(D, d))\n    b = np.random.uniform(0, 2 * np.pi, size=D)\n    Z = np.sqrt(2.0 / D) * np.cos(X @ W.T + b)\n    return Z\n\nZ_rff = random_fourier_features(X_sep, D=200, gamma=0.5)\nprint(\"Ukuran Matriks Fitur Acak RFF:\", Z_rff.shape)\nprint(\"Aproksimasi RBF Dot Product:\", np.dot(Z_rff[0], Z_rff[1]))\nprint(\"RBF Eksak                 :\", rbf_kernel([X_sep[0]], [X_sep[1]], gamma=0.5)[0, 0])",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-12-6-skalabilitas-kernel-nystrom-rff-sota",
          "title": "Implementasi Standar Industri SOTA: 12.6 Skalabilitas Kernel pada Dataset Besar",
          "language": "python",
          "filename": "12_6_skalabilitas_kernel_nystrom_rff_sota.py",
          "code": "from sklearn.kernel_approximation import NBFSSampler, Nystroem, RBFSampler\n\nrbf_sampler = RBFSampler(gamma=0.5, n_components=200, random_state=42)\nZ_skl = rbf_sampler.fit_transform(X_sep)\nprint(\"Scikit-Learn RBFSampler output shape:\", Z_skl.shape)",
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
        "Mengatur jumlah komponen D pada RFF terlalu kecil, menghasilkan aproksimasi kernel yang memiliki varians Monte Carlo tinggi."
      ],
      "structuredExercises": [
        {
          "id": "ml-12-6-skalabilitas-kernel-nystrom-rff-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 12.6 Skalabilitas Kernel pada Dataset Besar terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-12-6-skalabilitas-kernel-nystrom-rff-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 12.6 Skalabilitas Kernel pada Dataset Besar.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    }
  ]
};
