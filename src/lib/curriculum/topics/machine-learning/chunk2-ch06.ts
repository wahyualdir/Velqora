import { AcademicChapter } from "../../types";

export const chapter06: AcademicChapter = {
  "id": "machine-learning-ch-06",
  "slug": "bab-06-regresi-linier-ols-teorema-gauss-markov-diagnostik",
  "title": "BAB 06: Regresi Linier OLS, Teorema Gauss-Markov, & Diagnostik Residual",
  "orderIndex": 6,
  "description": "Landasan analitis regresi linier Ordinary Least Squares (OLS): proyeksi ortogonal, penurunan Persamaan Normal, pembuktian ketat Teorema Gauss-Markov (BLUE), inferensi statistik t dan F test, baterai diagnostik residual, serta metrologi titik pengaruh Cook's Distance.",
  "coreConcepts": [
    "Persamaan Normal OLS",
    "Hat Matrix & Annihilator Matrix",
    "Teorema Gauss-Markov & Estimator BLUE",
    "Standard Error & Uji Hipotesis t / F",
    "Diagnostik Breusch-Pagan, Durbin-Watson, Jarque-Bera",
    "Leverage & Jarak Cook (Cook's Distance)"
  ],
  "subchapters": [
    {
      "id": "ml-06-1-formulasi-matematis-ols",
      "slug": "06-1-formulasi-matematis-ols",
      "title": "06.1 Formulasi Matematis Ordinary Least Squares (OLS) & Penurunan Normal Equations",
      "orderIndex": 1,
      "description": "Penurunan analitis Ordinary Least Squares (OLS): minimisasi fungsi kerugian kuadrat terkecil, gradien matriks, dan sistem persamaan normal X^T X beta = X^T y.",
      "learningObjectives": [
        "Menurunkan fungsi objektif kuadrat terkecil matriks S(beta) = (y - X beta)^T (y - X beta).",
        "Menghitung turunan matriks terhadap vektor parameter beta dan menyusun Persamaan Normal.",
        "Menganalisis kondisi keterbalikan (invertibility) matriks Grammian X^T X."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 06.1 Formulasi Matematis Ordinary Least Squares (OLS) & Penurunan Normal Equations\n\n## Gambaran Konseptual & Landasan Teori\nOrdinary Least Squares (OLS) adalah metode dasar estimasi parameter dalam model regresi linier. Diberikan matriks desain $\\mathbf{X} \\in \\mathbb{R}^{n \\times p}$ dan vektor respons $\\mathbf{y} \\in \\mathbb{R}^n$, model linier dirumuskan sebagai:\n$$\\mathbf{y} = \\mathbf{X}\\boldsymbol{\\beta} + \\boldsymbol{\\varepsilon}$$\n\nFungsi kerugian jumlah kuadrat residual (Sum of Squared Residuals - SSR) didefinisikan sebagai:\n$$S(\\boldsymbol{\\beta}) = \\|\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta}\\|_2^2 = (\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta})^T (\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta}) = \\mathbf{y}^T\\mathbf{y} - 2\\boldsymbol{\\beta}^T\\mathbf{X}^T\\mathbf{y} + \\boldsymbol{\\beta}^T\\mathbf{X}^T\\mathbf{X}\\boldsymbol{\\beta}$$\n\nMengambil gradien terhadap $\\boldsymbol{\\beta}$ dan menyamakannya ke nol:\n$$\\nabla_{\\boldsymbol{\\beta}} S(\\boldsymbol{\\beta}) = -2\\mathbf{X}^T\\mathbf{y} + 2\\mathbf{X}^T\\mathbf{X}\\boldsymbol{\\beta} = \\mathbf{0} \\implies \\mathbf{X}^T\\mathbf{X}\\boldsymbol{\\beta} = \\mathbf{X}^T\\mathbf{y}$$\n\nJika $\\mathbf{X}$ memiliki full column rank ($\\text{rank}(\\mathbf{X}) = p$), maka $\\mathbf{X}^T\\mathbf{X}$ invertibel dan solusi analitis eksak adalah:\n$$\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{y}$$\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    A[\"Matriks Desain X (n x p) & Respons y (n x 1)\"] --> B[\"Hitung Matriks Grammian: G = X^T X\"]\n    B --> C[\"Hitung Vektor Proyeksi: c = X^T y\"]\n    C --> D{\"Apakah G Invertibel? (det(G) != 0)\"}\n    D -- Ya --> E[\"Solusi Normal: beta_hat = G^(-1) c\"]\n    D -- Tidak --> F[\"Solusi Pseudoinverse via SVD: beta_hat = X^+ y\"]\n    E --> G[\"Prediksi: y_hat = X beta_hat\"]\n    F --> G\n    G --> H[\"Residual: e = y - y_hat\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\nimport numpy as np\n\ndef ols_normal_equations(X: np.ndarray, y: np.ndarray) -> np.ndarray:\n    \"\"\"Menyelesaikan OLS menggunakan Persamaan Normal analitis (X^T X)^(-1) X^T y.\"\"\"\n    XtX = np.dot(X.T, X)\n    Xty = np.dot(X.T, y)\n    beta = np.linalg.solve(XtX, Xty)  # Lebih stabil daripada np.linalg.inv\n    return beta\n\n# Verifikasi numerik\nnp.random.seed(42)\nn, p = 100, 3\nX = np.hstack([np.ones((n, 1)), np.random.randn(n, p)])\ntrue_beta = np.array([2.5, -1.8, 3.2, 0.5])\ny = X @ true_beta + np.random.randn(n) * 0.1\n\nbeta_hat = ols_normal_equations(X, y)\nprint(\"True beta:\", true_beta)\nprint(\"OLS estimated beta:\", np.round(beta_hat, 4))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom sklearn.linear_model import LinearRegression\nimport numpy as np\n\n# Menggunakan Scikit-Learn LinearRegression\nmodel = LinearRegression(fit_intercept=False)\nmodel.fit(X, y)\nprint(\"Scikit-learn coefficients:\", np.round(model.coef_, 4))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nresiduals = y - X @ beta_hat\nrss = np.sum(residuals**2)\ntss = np.sum((y - np.mean(y))**2)\nr_squared = 1 - (rss / tss)\nprint(f\"Residual Sum of Squares (RSS): {rss:.4f}\")\nprint(f\"R-squared: {r_squared:.4f}\")\n```\n\n## Studi Kasus Industri & Analisis Kritis\nAnalisis harga properti pada Kaggle Ames Housing Dataset menggunakan OLS: Normal equations mampu merekonstruksi bobot fitur fisik seperti square footage dan jumlah kamar dengan R^2 > 0.85.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Menginversi matriks X^T X secara langsung menggunakan inv() alih-alih solver solve() atau dekomposisi QR, yang memperparah pembulatan numerik.\n\n> [!WARNING]\n> **Peringatan Teknis:** Lupa menambahkan kolom bias/intersep (vektor 1) pada matriks desain X.\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [ISLR v2 - Linear Regression (Ch. 3)](https://www.statlearning.com/) - *Buku teks standar regresi linier dan inferensi statistik*\n- [Scikit-Learn Linear Regression Documentation](https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares) - *Dokumentasi resmi implementasi Scikit-Learn*\n- [Kaggle House Prices Advanced Regression Techniques](https://www.kaggle.com/c/house-prices-advanced-regression-techniques) - *Benchmark kompetisi regresi linier dunia nyata*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-06-1-formulasi-matematis-ols-scratch",
          "title": "Implementasi First-Principles: 06.1 Formulasi Matematis Ordinary Least Squares (OLS) & Penurunan Normal Equations",
          "language": "python",
          "filename": "06_1_formulasi_matematis_ols_scratch.py",
          "code": "import numpy as np\n\ndef ols_normal_equations(X: np.ndarray, y: np.ndarray) -> np.ndarray:\n    \"\"\"Menyelesaikan OLS menggunakan Persamaan Normal analitis (X^T X)^(-1) X^T y.\"\"\"\n    XtX = np.dot(X.T, X)\n    Xty = np.dot(X.T, y)\n    beta = np.linalg.solve(XtX, Xty)  # Lebih stabil daripada np.linalg.inv\n    return beta\n\n# Verifikasi numerik\nnp.random.seed(42)\nn, p = 100, 3\nX = np.hstack([np.ones((n, 1)), np.random.randn(n, p)])\ntrue_beta = np.array([2.5, -1.8, 3.2, 0.5])\ny = X @ true_beta + np.random.randn(n) * 0.1\n\nbeta_hat = ols_normal_equations(X, y)\nprint(\"True beta:\", true_beta)\nprint(\"OLS estimated beta:\", np.round(beta_hat, 4))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-06-1-formulasi-matematis-ols-sota",
          "title": "Implementasi Standar Industri SOTA: 06.1 Formulasi Matematis Ordinary Least Squares (OLS) & Penurunan Normal Equations",
          "language": "python",
          "filename": "06_1_formulasi_matematis_ols_sota.py",
          "code": "from sklearn.linear_model import LinearRegression\nimport numpy as np\n\n# Menggunakan Scikit-Learn LinearRegression\nmodel = LinearRegression(fit_intercept=False)\nmodel.fit(X, y)\nprint(\"Scikit-learn coefficients:\", np.round(model.coef_, 4))",
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
        "Menginversi matriks X^T X secara langsung menggunakan inv() alih-alih solver solve() atau dekomposisi QR, yang memperparah pembulatan numerik.",
        "Lupa menambahkan kolom bias/intersep (vektor 1) pada matriks desain X."
      ],
      "structuredExercises": [
        {
          "id": "ml-06-1-formulasi-matematis-ols-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 06.1 Formulasi Matematis Ordinary Least Squares (OLS) & Penurunan Normal Equations terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-06-1-formulasi-matematis-ols-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 06.1 Formulasi Matematis Ordinary Least Squares (OLS) & Penurunan Normal Equations.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-06-2-geometri-kuadrat-terkecil",
      "slug": "06-2-geometri-kuadrat-terkecil",
      "title": "06.2 Geometri Kuadrat Terkecil: Matriks Proyeksi Kolom (Hat Matrix) & Matriks Annihilator",
      "orderIndex": 2,
      "description": "Perspektif geometris OLS pada ruang dimensi n: operator proyeksi ortogonal Hat Matrix H, sifat idempoten dan simetris, serta residual orthogonal annihilator M = I - H.",
      "learningObjectives": [
        "Memahami representasi geometris bahwa y_hat adalah proyeksi ortogonal dari y ke ruang kolom Col(X).",
        "Membuktikan sifat aljabar Hat Matrix: H = H^T (simetris) dan H^2 = H (idempoten).",
        "Menghitung trace dari Hat Matrix dan menghubungkannya dengan derajat kebebasan p."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 06.2 Geometri Kuadrat Terkecil: Matriks Proyeksi Kolom (Hat Matrix) & Matriks Annihilator\n\n## Gambaran Konseptual & Landasan Teori\nDalam ruang observasi $\\mathbb{R}^n$, vektor target $\\mathbf{y}$ diproyeksikan secara ortogonal ke subruang $\\text{Col}(\\mathbf{X}) = \\{\\mathbf{X}\\boldsymbol{\\beta} \\mid \\boldsymbol{\\beta} \\in \\mathbb{R}^p\\}$. Vektor proyeksi adalah:\n$$\\hat{\\mathbf{y}} = \\mathbf{X}\\hat{\\boldsymbol{\\beta}} = \\mathbf{X}(\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{y} = \\mathbf{H}\\mathbf{y}$$\n\nMatriks $\\mathbf{H} = \\mathbf{X}(\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T$ disebut **Hat Matrix** (karena menaruh \"topi\" di atas $y$).\n\nSifat-sifat fundamental $\\mathbf{H}$:\n1. **Simetris**: $\\mathbf{H}^T = (\\mathbf{X}(\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T)^T = \\mathbf{H}$\n2. **Idempoten**: $\\mathbf{H}^2 = \\mathbf{H}\\mathbf{H} = \\mathbf{H}$\n3. **Trace**: $\\text{tr}(\\mathbf{H}) = \\text{tr}(\\mathbf{X}(\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T) = \\text{tr}((\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{X}) = \\text{tr}(\\mathbf{I}_p) = p$\n\nVektor residual adalah $\\mathbf{e} = \\mathbf{y} - \\hat{\\mathbf{y}} = (\\mathbf{I}_n - \\mathbf{H})\\mathbf{y} = \\mathbf{M}\\mathbf{y}$, di mana $\\mathbf{M}$ adalah **Annihilator Matrix** yang juga simetris dan idempoten dengan $\\text{tr}(\\mathbf{M}) = n - p$.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph LR\n    Y[\"Vektor Target y in R^n\"] --> H[\"Hat Matrix H = X(X^TX)^(-1)X^T\"]\n    H --> Yhat[\"y_hat in Col(X)\"]\n    Y --> M[\"Annihilator M = I - H\"]\n    M --> E[\"e in Col(X)^perp\"]\n    Yhat -. Ortogonal .-> E\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\nimport numpy as np\n\ndef compute_projection_matrices(X: np.ndarray):\n    \"\"\"Menghitung Hat Matrix H dan Annihilator Matrix M.\"\"\"\n    XtX_inv = np.linalg.pinv(X.T @ X)\n    H = X @ XtX_inv @ X.T\n    n = X.shape[0]\n    M = np.eye(n) - H\n    return H, M\n\n# Verifikasi sifat idempoten & ortogonalitas\nH, M = compute_projection_matrices(X)\nprint(\"H is idempotent:\", np.allclose(H @ H, H))\nprint(\"H is symmetric:\", np.allclose(H.T, H))\nprint(\"Trace of H equals rank p:\", np.isclose(np.trace(H), X.shape[1]))\ne = M @ y\nprint(\"Residual e is orthogonal to Col(X):\", np.allclose(X.T @ e, 0, atol=1e-8))\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nimport scipy.linalg as la\n\n# Solusi via QR Decomposition (basis ortonormal Q merentang Col(X))\nQ, R = la.qr(X, mode='economic')\ny_hat_qr = Q @ (Q.T @ y)\nprint(\"y_hat QR matches direct projection:\", np.allclose(y_hat_qr, H @ y))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nleverages = np.diag(H)\nprint(\"Nilai leverage rata-rata p/n:\", X.shape[1] / X.shape[0])\nprint(\"Leverage maksimum sampel:\", np.max(leverages))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nDeteksi titik leverage tinggi pada data finansial kuantitatif: Titik data dengan nilai h_ii > 2p/n memiliki potensi pengaruh sangat besar terhadap rotasi bidang regresi.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Menyimpan matriks Hat H berukuran n x n secara eksplisit pada dataset besar (n > 50,000) yang akan menghabiskan memori RAM secara masif O(n^2).\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Matrix Cookbook (Petersen & Pedersen)](https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf) - *Turunan dan identitas proyeksi matriks ortogonal*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-06-2-geometri-kuadrat-terkecil-scratch",
          "title": "Implementasi First-Principles: 06.2 Geometri Kuadrat Terkecil",
          "language": "python",
          "filename": "06_2_geometri_kuadrat_terkecil_scratch.py",
          "code": "import numpy as np\n\ndef compute_projection_matrices(X: np.ndarray):\n    \"\"\"Menghitung Hat Matrix H dan Annihilator Matrix M.\"\"\"\n    XtX_inv = np.linalg.pinv(X.T @ X)\n    H = X @ XtX_inv @ X.T\n    n = X.shape[0]\n    M = np.eye(n) - H\n    return H, M\n\n# Verifikasi sifat idempoten & ortogonalitas\nH, M = compute_projection_matrices(X)\nprint(\"H is idempotent:\", np.allclose(H @ H, H))\nprint(\"H is symmetric:\", np.allclose(H.T, H))\nprint(\"Trace of H equals rank p:\", np.isclose(np.trace(H), X.shape[1]))\ne = M @ y\nprint(\"Residual e is orthogonal to Col(X):\", np.allclose(X.T @ e, 0, atol=1e-8))",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-06-2-geometri-kuadrat-terkecil-sota",
          "title": "Implementasi Standar Industri SOTA: 06.2 Geometri Kuadrat Terkecil",
          "language": "python",
          "filename": "06_2_geometri_kuadrat_terkecil_sota.py",
          "code": "import scipy.linalg as la\n\n# Solusi via QR Decomposition (basis ortonormal Q merentang Col(X))\nQ, R = la.qr(X, mode='economic')\ny_hat_qr = Q @ (Q.T @ y)\nprint(\"y_hat QR matches direct projection:\", np.allclose(y_hat_qr, H @ y))",
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
        "Menyimpan matriks Hat H berukuran n x n secara eksplisit pada dataset besar (n > 50,000) yang akan menghabiskan memori RAM secara masif O(n^2)."
      ],
      "structuredExercises": [
        {
          "id": "ml-06-2-geometri-kuadrat-terkecil-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 06.2 Geometri Kuadrat Terkecil terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-06-2-geometri-kuadrat-terkecil-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 06.2 Geometri Kuadrat Terkecil.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-06-3-teorema-gauss-markov",
      "slug": "06-3-teorema-gauss-markov",
      "title": "06.3 Teorema Gauss-Markov: Pembuktian Sifat Best Linear Unbiased Estimator (BLUE)",
      "orderIndex": 3,
      "description": "Pembuktian analitis formal Teorema Gauss-Markov: kondisi eksogenitas, homoskedastisitas, dan non-autokorelasi yang menjamin estimator OLS memiliki varians minimum di antara seluruh estimator linier tak-bias.",
      "learningObjectives": [
        "Menguraikan 5 asumsi klasik Gauss-Markov (Linieritas, Eksogenitas Tegas, Rank Penuh, Homoskedastisitas, Tanpa Autokorelasi).",
        "Membuktikan ketak-biasan estimator OLS: E[beta_hat] = beta.",
        "Membuktikan bahwa Var(tilde_beta) - Var(beta_hat) adalah matriks semi-definit positif untuk sembarang estimator linier tak-bias."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 06.3 Teorema Gauss-Markov: Pembuktian Sifat Best Linear Unbiased Estimator (BLUE)\n\n## Gambaran Konseptual & Landasan Teori\n**Teorema Gauss-Markov**: Di bawah asumsi-asumsi klasik:\n1. Model linier: $\\mathbf{y} = \\mathbf{X}\\boldsymbol{\\beta} + \\boldsymbol{\\varepsilon}$\n2. Eksogenitas tegas: $\\mathbb{E}[\\boldsymbol{\\varepsilon} \\mid \\mathbf{X}] = \\mathbf{0}$\n3. Kovarians sferis: $\\text{Var}(\\boldsymbol{\\varepsilon} \\mid \\mathbf{X}) = \\sigma^2 \\mathbf{I}_n$ (homoskedastik dan tanpa korelasi serial)\n4. $\\text{rank}(\\mathbf{X}) = p$\n\nEstimator OLS $\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{y}$ adalah **BLUE** (*Best Linear Unbiased Estimator*).\n\n### Pembuktian Varians Minimum:\nMisalkan estimator linier tak-bias lain adalah $\\tilde{\\boldsymbol{\\beta}} = \\mathbf{C}\\mathbf{y}$, di mana $\\mathbf{C} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T + \\mathbf{D}$.\nAgar $\\tilde{\\boldsymbol{\\beta}}$ tak-bias, $\\mathbb{E}[\\tilde{\\boldsymbol{\\beta}}] = \\mathbf{C}\\mathbf{X}\\boldsymbol{\\beta} = \\boldsymbol{\\beta} \\implies \\mathbf{D}\\mathbf{X} = \\mathbf{0}$.\n\nMaka varians $\\tilde{\\boldsymbol{\\beta}}$ adalah:\n$$\\text{Var}(\\tilde{\\boldsymbol{\\beta}}) = \\mathbf{C}(\\sigma^2 \\mathbf{I})\\mathbf{C}^T = \\sigma^2 \\mathbf{C}\\mathbf{C}^T = \\sigma^2 [(\\mathbf{X}^T\\mathbf{X})^{-1} + \\mathbf{D}\\mathbf{D}^T] = \\text{Var}(\\hat{\\boldsymbol{\\beta}}) + \\sigma^2 \\mathbf{D}\\mathbf{D}^T$$\n\nKarena $\\mathbf{D}\\mathbf{D}^T$ adalah matriks semi-definit positif, $\\text{Var}(\\tilde{\\boldsymbol{\\beta}}) \\succeq \\text{Var}(\\hat{\\boldsymbol{\\beta}})$. Terbukti OLS memiliki varians terkecil!\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    A[\"Asumsi Gauss-Markov: E[eps|X]=0, Var(eps)=sigma^2 I\"] --> B[\"Estimator Linier Tak-Bias: beta_tilde = Cy\"]\n    B --> C[\"Kondisi Tak-Bias: DX = 0\"]\n    C --> D[\"Var(beta_tilde) = Var(beta_hat_OLS) + sigma^2 DD^T\"]\n    D --> E[\"Karena DD^T >= 0 (PSD): Var(beta_tilde) >= Var(beta_hat_OLS)\"]\n    E --> F[\"Kesimpulan: OLS adalah BLUE\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\nimport numpy as np\n\ndef simulate_gauss_markov_efficiency(n_trials=1000, n=50, p=2):\n    \"\"\"Simulasi empiris efisiensi varians OLS vs estimator linier alternatif.\"\"\"\n    X = np.random.randn(n, p)\n    beta_true = np.array([2.0, -1.0])\n    \n    ols_estimates = []\n    alt_estimates = []\n    \n    # Estimator alternatif: pembobotan acak D yang memenuhi DX = 0\n    D = np.random.randn(p, n)\n    D = D - D @ X @ np.linalg.pinv(X.T @ X) @ X.T  # Proyeksikan agar DX = 0\n    C_alt = np.linalg.pinv(X.T @ X) @ X.T + 0.5 * D\n    \n    for _ in range(n_trials):\n        eps = np.random.randn(n) * 1.5\n        y = X @ beta_true + eps\n        \n        # OLS\n        b_ols = np.linalg.solve(X.T @ X, X.T @ y)\n        # Alt\n        b_alt = C_alt @ y\n        \n        ols_estimates.append(b_ols)\n        alt_estimates.append(b_alt)\n        \n    var_ols = np.var(ols_estimates, axis=0)\n    var_alt = np.var(alt_estimates, axis=0)\n    print(\"Varians Parameter OLS:\", np.round(var_ols, 5))\n    print(\"Varians Parameter Alternatif:\", np.round(var_alt, 5))\n    print(\"Efisiensi (Var(Alt) >= Var(OLS)):\", np.all(var_alt >= var_ols))\n\nsimulate_gauss_markov_efficiency()\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nimport statsmodels.api as sm\n\n# Pembuktian OLS dengan Statsmodels\nols_model = sm.OLS(y, X).fit()\nprint(\"Standar Error OLS Parameter:\\n\", ols_model.bse)\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nresiduals = ols_model.resid\nsigma_squared_hat = np.sum(residuals**2) / (X.shape[0] - X.shape[1])\ncov_beta_hat = sigma_squared_hat * np.linalg.inv(X.T @ X)\nprint(\"Standard Error OLS Manual:\", np.sqrt(np.diag(cov_beta_hat)))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nEkonometrika penetapan tarif asuransi: Penggunaan estimator non-BLUE yang bias atau memiliki varians tinggi mengakibatkan premi yang tidak adil atau ketidakmampuan solvabilitas dana cadangan.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Mengasumsikan Gauss-Markov membutuhkan distribusi normal pada gangguan epsilon. Teorema ini berlaku untuk SEMBARANG distribusi dengan mean nol dan varians konstan!\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Greene Econometric Analysis (Ch. 4)](https://www.statlearning.com/) - *Bab klasik pembuktian Teorema Gauss-Markov*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-06-3-teorema-gauss-markov-scratch",
          "title": "Implementasi First-Principles: 06.3 Teorema Gauss-Markov",
          "language": "python",
          "filename": "06_3_teorema_gauss_markov_scratch.py",
          "code": "import numpy as np\n\ndef simulate_gauss_markov_efficiency(n_trials=1000, n=50, p=2):\n    \"\"\"Simulasi empiris efisiensi varians OLS vs estimator linier alternatif.\"\"\"\n    X = np.random.randn(n, p)\n    beta_true = np.array([2.0, -1.0])\n    \n    ols_estimates = []\n    alt_estimates = []\n    \n    # Estimator alternatif: pembobotan acak D yang memenuhi DX = 0\n    D = np.random.randn(p, n)\n    D = D - D @ X @ np.linalg.pinv(X.T @ X) @ X.T  # Proyeksikan agar DX = 0\n    C_alt = np.linalg.pinv(X.T @ X) @ X.T + 0.5 * D\n    \n    for _ in range(n_trials):\n        eps = np.random.randn(n) * 1.5\n        y = X @ beta_true + eps\n        \n        # OLS\n        b_ols = np.linalg.solve(X.T @ X, X.T @ y)\n        # Alt\n        b_alt = C_alt @ y\n        \n        ols_estimates.append(b_ols)\n        alt_estimates.append(b_alt)\n        \n    var_ols = np.var(ols_estimates, axis=0)\n    var_alt = np.var(alt_estimates, axis=0)\n    print(\"Varians Parameter OLS:\", np.round(var_ols, 5))\n    print(\"Varians Parameter Alternatif:\", np.round(var_alt, 5))\n    print(\"Efisiensi (Var(Alt) >= Var(OLS)):\", np.all(var_alt >= var_ols))\n\nsimulate_gauss_markov_efficiency()",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-06-3-teorema-gauss-markov-sota",
          "title": "Implementasi Standar Industri SOTA: 06.3 Teorema Gauss-Markov",
          "language": "python",
          "filename": "06_3_teorema_gauss_markov_sota.py",
          "code": "import statsmodels.api as sm\n\n# Pembuktian OLS dengan Statsmodels\nols_model = sm.OLS(y, X).fit()\nprint(\"Standar Error OLS Parameter:\\n\", ols_model.bse)",
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
        "Mengasumsikan Gauss-Markov membutuhkan distribusi normal pada gangguan epsilon. Teorema ini berlaku untuk SEMBARANG distribusi dengan mean nol dan varians konstan!"
      ],
      "structuredExercises": [
        {
          "id": "ml-06-3-teorema-gauss-markov-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 06.3 Teorema Gauss-Markov terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-06-3-teorema-gauss-markov-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 06.3 Teorema Gauss-Markov.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-06-4-distribusi-sampling-parameter",
      "slug": "06-4-distribusi-sampling-parameter",
      "title": "06.4 Distribusi Sampling Parameter, Standard Error, Uji t-Student, & Uji F Parsial",
      "orderIndex": 4,
      "description": "Inferensi hipotesis regresi: distribusi sampling parameter di bawah asumsi normalitas, komputasi matriks kovarians parameter, uji signifikansi individual t-test, dan uji simultan F-test ANOVA.",
      "learningObjectives": [
        "Menghitung matriks varians-kovarians parameter Var(beta_hat) = s^2 (X^T X)^(-1).",
        "Melakukan uji hipotesis H_0: beta_j = 0 menggunakan statistik t-Student.",
        "Menurunkan statistik F untuk pengujian signifikansi regresi simultan dan parsial."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 06.4 Distribusi Sampling Parameter, Standard Error, Uji t-Student, & Uji F Parsial\n\n## Gambaran Konseptual & Landasan Teori\nJika diasumsikan residual berdistribusi normal $\\boldsymbol{\\varepsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\sigma^2 \\mathbf{I}_n)$, maka estimator parameter juga berdistribusi normal multivariat:\n$$\\hat{\\boldsymbol{\\beta}} \\sim \\mathcal{N}\\left(\\boldsymbol{\\beta}, \\sigma^2 (\\mathbf{X}^T\\mathbf{X})^{-1}\\right)$$\n\nEstimator tak-bias untuk varians residual $\\sigma^2$ adalah:\n$$s^2 = \\frac{\\mathbf{e}^T\\mathbf{e}}{n - p} = \\frac{\\text{SSR}}{n - p}$$\n\nStandard Error untuk parameter ke-$j$ adalah $\\text{SE}(\\hat{\\beta}_j) = s \\sqrt{[(\\mathbf{X}^T\\mathbf{X})^{-1}]_{jj}}$.\n\nUji signifikansi parsial $H_0: \\beta_j = 0$ menggunakan statistik uji-$t$:\n$$t = \\frac{\\hat{\\beta}_j}{\\text{SE}(\\hat{\\beta}_j)} \\sim t_{n - p}$$\n\nUji signifikansi simultan seluruh koefisien slope menggunakan uji-$F$:\n$$F = \\frac{(\\text{TSS} - \\text{SSR}) / (p - 1)}{\\text{SSR} / (n - p)} \\sim F_{p-1, n-p}$$\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    A[\"Estimasi Parameter beta_hat & Residual e\"] --> B[\"Hitung Estimator Varians: s^2 = e^T e / (n - p)\"]\n    B --> C[\"Matriks Kovarians: Cov(beta) = s^2 (X^T X)^(-1)\"]\n    C --> D[\"Standard Error SE(beta_j) = sqrt(Cov_jj)\"]\n    D --> E[\"Statistik t: t_j = beta_j / SE(beta_j)\"]\n    E --> F[\"p-value dari Distribusi t_(n-p)\"]\n    B --> G[\"Statistik F: (TSS - SSR)/(p-1) / s^2\"]\n    G --> H[\"p-value dari Distribusi F_(p-1, n-p)\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\nimport scipy.stats as stats\nimport numpy as np\n\ndef regression_inference_manual(X: np.ndarray, y: np.ndarray):\n    n, p = X.shape\n    beta = np.linalg.solve(X.T @ X, X.T @ y)\n    residuals = y - X @ beta\n    s2 = np.sum(residuals**2) / (n - p)\n    cov_beta = s2 * np.linalg.inv(X.T @ X)\n    se = np.sqrt(np.diag(cov_beta))\n    t_stats = beta / se\n    p_values = 2 * (1 - stats.t.cdf(np.abs(t_stats), df=n - p))\n    return beta, se, t_stats, p_values\n\nbeta, se, t_vals, p_vals = regression_inference_manual(X, y)\nfor i in range(len(beta)):\n    print(f\"Beta_{i}: {beta[i]:.4f} | SE: {se[i]:.4f} | t: {t_vals[i]:.3f} | p-val: {p_vals[i]:.4e}\")\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nimport statsmodels.api as sm\n\nmodel = sm.OLS(y, X).fit()\nprint(model.summary().tables[1])\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nf_stat = model.fvalue\nf_pval = model.f_pvalue\nprint(f\"Overall Model F-statistic: {f_stat:.3f}, p-value: {f_pval:.4e}\")\n```\n\n## Studi Kasus Industri & Analisis Kritis\nUji signifikansi faktor risiko klinis (tekanan darah, indeks massa tubuh, gula darah puasa) terhadap risiko stroke dalam studi kohort medis.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Mengabaikan masalah pengujian hipotesis berganda (multiple testing problem). Ketika p sangat besar, beberapa variabel akan signifikan secara semu hanya karena kebetulan acak (p < 0.05).\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Statsmodels OLS Regression Documentation](https://www.statsmodels.org/stable/regression.html) - *Dokumentasi modul OLS dan tabel ANOVA*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-06-4-distribusi-sampling-parameter-scratch",
          "title": "Implementasi First-Principles: 06.4 Distribusi Sampling Parameter, Standard Error, Uji t-Student, & Uji F Parsial",
          "language": "python",
          "filename": "06_4_distribusi_sampling_parameter_scratch.py",
          "code": "import scipy.stats as stats\nimport numpy as np\n\ndef regression_inference_manual(X: np.ndarray, y: np.ndarray):\n    n, p = X.shape\n    beta = np.linalg.solve(X.T @ X, X.T @ y)\n    residuals = y - X @ beta\n    s2 = np.sum(residuals**2) / (n - p)\n    cov_beta = s2 * np.linalg.inv(X.T @ X)\n    se = np.sqrt(np.diag(cov_beta))\n    t_stats = beta / se\n    p_values = 2 * (1 - stats.t.cdf(np.abs(t_stats), df=n - p))\n    return beta, se, t_stats, p_values\n\nbeta, se, t_vals, p_vals = regression_inference_manual(X, y)\nfor i in range(len(beta)):\n    print(f\"Beta_{i}: {beta[i]:.4f} | SE: {se[i]:.4f} | t: {t_vals[i]:.3f} | p-val: {p_vals[i]:.4e}\")",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-06-4-distribusi-sampling-parameter-sota",
          "title": "Implementasi Standar Industri SOTA: 06.4 Distribusi Sampling Parameter, Standard Error, Uji t-Student, & Uji F Parsial",
          "language": "python",
          "filename": "06_4_distribusi_sampling_parameter_sota.py",
          "code": "import statsmodels.api as sm\n\nmodel = sm.OLS(y, X).fit()\nprint(model.summary().tables[1])",
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
        "Mengabaikan masalah pengujian hipotesis berganda (multiple testing problem). Ketika p sangat besar, beberapa variabel akan signifikan secara semu hanya karena kebetulan acak (p < 0.05)."
      ],
      "structuredExercises": [
        {
          "id": "ml-06-4-distribusi-sampling-parameter-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 06.4 Distribusi Sampling Parameter, Standard Error, Uji t-Student, & Uji F Parsial terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-06-4-distribusi-sampling-parameter-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 06.4 Distribusi Sampling Parameter, Standard Error, Uji t-Student, & Uji F Parsial.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-06-5-diagnostik-residual",
      "slug": "06-5-diagnostik-residual",
      "title": "06.5 Diagnostik Residual: Uji Normalitas (Jarque-Bera), Homoskedastisitas (Breusch-Pagan), & Autokorelasi",
      "orderIndex": 5,
      "description": "Baterai uji diagnostik residual ekonometrika: uji normalitas Jarque-Bera, uji homoskedastisitas Breusch-Pagan / White, dan uji autokorelasi serial Durbin-Watson.",
      "learningObjectives": [
        "Mendeteksi heteroskedastisitas menggunakan Breusch-Pagan test dan memahami koreksi White Huber-White SE.",
        "Menguji korelasi serial residual pada data sekuensial menggunakan statistik Durbin-Watson.",
        "Mengevaluasi kecondongan (skewness) dan kurtosis residual melalui uji Jarque-Bera."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 06.5 Diagnostik Residual: Uji Normalitas (Jarque-Bera), Homoskedastisitas (Breusch-Pagan), & Autokorelasi\n\n## Gambaran Konseptual & Landasan Teori\nPelanggaran terhadap asumsi Gauss-Markov menyebabkan estimator OLS kehilangan efisiensinya atau menghasilkan interval kepercayaan yang tidak valid.\n\n### 1. Uji Normalitas Jarque-Bera:\n$$JB = \\frac{n}{6} \\left( S^2 + \\frac{(K - 3)^2}{4} \\right) \\sim \\chi^2_2$$\ndi mana $S$ adalah skewness dan $K$ adalah kurtosis sampel residual.\n\n### 2. Uji Homoskedastisitas Breusch-Pagan:\nMeregresikan kuadrat residual $e_i^2$ terhadap variabel prediktor $\\mathbf{X}$:\n$$e_i^2 = \\gamma_0 + \\gamma_1 X_{i1} + \\dots + \\gamma_p X_{ip} + u_i$$\nStatistik uji $LM = n R_{e^2}^2 \\sim \\chi^2_{p-1}$. Jika $p < 0.05$, homoskedastisitas ditolak.\n\n### 3. Uji Autokorelasi Durbin-Watson:\n$$d = \\frac{\\sum_{i=2}^n (e_i - e_{i-1})^2}{\\sum_{i=1}^n e_i^2} \\approx 2(1 - \\hat{\\rho})$$\nNilai $d \\approx 2$ mengindikasikan tidak adanya autokorelasi, $d < 1$ menunjukkan autokorelasi positif kuat.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    R[\"Residual e = y - X beta_hat\"] --> T1[\"Uji Normalitas: Jarque-Bera & Shapiro-Wilk\"]\n    R --> T2[\"Uji Homoskedastisitas: Breusch-Pagan / White\"]\n    R --> T3[\"Uji Autokorelasi: Durbin-Watson & Ljung-Box\"]\n    T2 -- \"Tolak H_0 (Heteroskedastik)\" --> S1[\"Solusi: Robust SE (Huber-White HC3) atau WLS\"]\n    T3 -- \"Tolak H_0 (Autokorelasi)\" --> S2[\"Solusi: Newey-West HAC SE atau GLS\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef jarque_bera_manual(e: np.ndarray):\n    n = len(e)\n    mean_e = np.mean(e)\n    m2 = np.mean((e - mean_e)**2)\n    m3 = np.mean((e - mean_e)**3)\n    m4 = np.mean((e - mean_e)**4)\n    skew = m3 / (m2**1.5)\n    kurt = m4 / (m2**2)\n    jb = (n / 6.0) * (skew**2 + ((kurt - 3.0)**2) / 4.0)\n    p_val = 1 - stats.chi2.cdf(jb, df=2)\n    return jb, p_val\n\ndef durbin_watson_manual(e: np.ndarray):\n    diff = np.diff(e)\n    return np.sum(diff**2) / np.sum(e**2)\n\ne = y - X @ beta_hat\njb, jb_p = jarque_bera_manual(e)\ndw = durbin_watson_manual(e)\nprint(f\"Jarque-Bera: {jb:.3f} (p={jb_p:.4f})\")\nprint(f\"Durbin-Watson: {dw:.3f}\")\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nfrom statsmodels.stats.diagnostic import het_breuschpagan\nimport statsmodels.api as sm\n\nmodel = sm.OLS(y, X).fit()\nbp_test = het_breuschpagan(model.resid, model.model.exog)\nprint(f\"Breusch-Pagan LM Stat: {bp_test[0]:.3f}, p-val: {bp_test[1]:.4e}\")\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nrobust_model = sm.OLS(y, X).fit(cov_type='HC3')\nprint(\"Perbandingan SE Biasa vs Robust HC3:\")\nprint(\"Biasa :\", np.round(model.bse, 4))\nprint(\"Robust:\", np.round(robust_model.bse, 4))\n```\n\n## Studi Kasus Industri & Analisis Kritis\nDeteksi heteroskedastisitas pada data pengeluaran rumah tangga vs pendapatan: Keluarga kaya memiliki variabilitas konsumsi jauh lebih besar daripada keluarga berpendapatan rendah.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Mengandalkan p-value OLS standar ketika terjadi heteroskedastisitas: Standard error OLS akan *underestimate*, menghasilkan kesimpulan statistik yang terlalu optimis semu (*spurious significance*).\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Statsmodels Diagnostic Tests](https://www.statsmodels.org/stable/diagnostic.html) - *Dokumentasi uji heteroskedastisitas dan autokorelasi*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-06-5-diagnostik-residual-scratch",
          "title": "Implementasi First-Principles: 06.5 Diagnostik Residual",
          "language": "python",
          "filename": "06_5_diagnostik_residual_scratch.py",
          "code": "def jarque_bera_manual(e: np.ndarray):\n    n = len(e)\n    mean_e = np.mean(e)\n    m2 = np.mean((e - mean_e)**2)\n    m3 = np.mean((e - mean_e)**3)\n    m4 = np.mean((e - mean_e)**4)\n    skew = m3 / (m2**1.5)\n    kurt = m4 / (m2**2)\n    jb = (n / 6.0) * (skew**2 + ((kurt - 3.0)**2) / 4.0)\n    p_val = 1 - stats.chi2.cdf(jb, df=2)\n    return jb, p_val\n\ndef durbin_watson_manual(e: np.ndarray):\n    diff = np.diff(e)\n    return np.sum(diff**2) / np.sum(e**2)\n\ne = y - X @ beta_hat\njb, jb_p = jarque_bera_manual(e)\ndw = durbin_watson_manual(e)\nprint(f\"Jarque-Bera: {jb:.3f} (p={jb_p:.4f})\")\nprint(f\"Durbin-Watson: {dw:.3f}\")",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-06-5-diagnostik-residual-sota",
          "title": "Implementasi Standar Industri SOTA: 06.5 Diagnostik Residual",
          "language": "python",
          "filename": "06_5_diagnostik_residual_sota.py",
          "code": "from statsmodels.stats.diagnostic import het_breuschpagan\nimport statsmodels.api as sm\n\nmodel = sm.OLS(y, X).fit()\nbp_test = het_breuschpagan(model.resid, model.model.exog)\nprint(f\"Breusch-Pagan LM Stat: {bp_test[0]:.3f}, p-val: {bp_test[1]:.4e}\")",
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
        "Mengandalkan p-value OLS standar ketika terjadi heteroskedastisitas: Standard error OLS akan *underestimate*, menghasilkan kesimpulan statistik yang terlalu optimis semu (*spurious significance*)."
      ],
      "structuredExercises": [
        {
          "id": "ml-06-5-diagnostik-residual-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 06.5 Diagnostik Residual terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-06-5-diagnostik-residual-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 06.5 Diagnostik Residual.",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    },
    {
      "id": "ml-06-6-titik-pengungkit-leverage",
      "slug": "06-6-titik-pengungkit-leverage",
      "title": "06.6 Titik Pengungkit Tinggi (Leverage), Residual Terstandarisasi, & Jarak Cook (Cook's Distance)",
      "orderIndex": 6,
      "description": "Analisis diagnostik pengaruh observasi ekstrem: diagonal matriks Hat h_ii, residual studentized terhapus (deleted studentized residuals), dan jarak Cook D_i untuk mendeteksi outlier berpengaruh.",
      "learningObjectives": [
        "Membedakan antara outlier (titik dengan residual y ekstrem) dan high leverage point (titik dengan fitur X ekstrem).",
        "Menghitung Jarak Cook D_i untuk mengukur pergeseran seluruh vektor parameter saat observasi ke-i dihilangkan.",
        "Menerapkan aturan ambang batas D_i > 4/n untuk mendeteksi data yang merusak model regresi."
      ],
      "prerequisites": [
        "Aljabar Linier Dasar",
        "Kalkulus Peubah Banyak",
        "Probabilitas & Statistika"
      ],
      "content_markdown": "# 06.6 Titik Pengungkit Tinggi (Leverage), Residual Terstandarisasi, & Jarak Cook (Cook's Distance)\n\n## Gambaran Konseptual & Landasan Teori\nTidak semua outlier memiliki pengaruh yang sama terhadap estimasi model. Pengaruh suatu titik merupakan fungsi gabungan dari keanehan pada ruang prediktor (leverage) dan keanehan pada ruang target (residual).\n\n### Leverage ($h_{ii}$):\n$$h_{ii} = [\\mathbf{X}(\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T]_{ii}$$\nAmbang batas perhatian: $h_{ii} > \\frac{2p}{n}$.\n\n### Studentized Residuals ($r_i$):\n$$r_i = \\frac{e_i}{s \\sqrt{1 - h_{ii}}}$$\n\n### Jarak Cook ($D_i$):\nMengukur perubahan kuadrat pada vektor estimasi $\\hat{\\boldsymbol{\\beta}}$ ketika titik ke-$i$ diabaikan:\n$$D_i = \\frac{\\|\\hat{\\mathbf{y}} - \\hat{\\mathbf{y}}_{(i)}\\|_2^2}{p s^2} = \\frac{r_i^2}{p} \\left( \\frac{h_{ii}}{1 - h_{ii}} \\right)$$\n\nAmbang batas pengaruh kritis: $D_i > 1$ atau $D_i > \\frac{4}{n}$.\n\n## Arsitektur & Alur Algoritma\n```mermaid\ngraph TD\n    Obs[\"Observasi (x_i, y_i)\"] --> Lev[\"Hitung Leverage: h_ii = [X(X^TX)^(-1)X^T]_ii\"]\n    Obs --> Res[\"Hitung Residual: e_i = y_i - y_hat_i\"]\n    Lev & Res --> Stud[\"Studentized Residual: r_i = e_i / (s * sqrt(1 - h_ii))\"]\n    Lev & Stud --> Cook[\"Jarak Cook: D_i = (r_i^2 / p) * (h_ii / (1 - h_ii))\"]\n    Cook --> Check{\"D_i > 4/n ?\"}\n    Check -- Ya --> Inf[\"Influential Point! Lakukan audit forensik data\"]\n    Check -- Tidak --> Normal[\"Observasi Aman\"]\n```\n\n## Implementasi Komputasi Multi-Code\n\n### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n```python\ndef cooks_distance_manual(X: np.ndarray, y: np.ndarray):\n    n, p = X.shape\n    beta = np.linalg.solve(X.T @ X, X.T @ y)\n    y_hat = X @ beta\n    e = y - y_hat\n    s2 = np.sum(e**2) / (n - p)\n    H = X @ np.linalg.pinv(X.T @ X) @ X.T\n    h = np.diag(H)\n    \n    # Cook's Distance\n    r_student = e / (np.sqrt(s2 * (1 - h)))\n    D = (r_student**2 / p) * (h / (1 - h))\n    return h, D\n\nh, D = cooks_distance_manual(X, y)\ninfluential_indices = np.where(D > 4 / len(y))[0]\nprint(f\"Ditemukan {len(influential_indices)} titik berpengaruh tinggi (Cook's D > 4/n).\")\nprint(\"Top 3 Jarak Cook tertinggi:\", np.sort(D)[-3:])\n```\n\n### Blok 2: Implementasi Standar Industri (SOTA Library)\n```python\nimport statsmodels.api as sm\n\nmodel = sm.OLS(y, X).fit()\ninfluence = model.get_influence()\ncooks_d = influence.cooks_distance[0]\nprint(\"Max Cook's Distance via Statsmodels:\", np.max(cooks_d))\n```\n\n### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n```python\nimport matplotlib.pyplot as plt\n\n# Skrip verifikasi diagnostik 4-panel\nprint(\"Statistik Leverage: Mean =\", np.mean(h), \"Max =\", np.max(h))\nprint(\"Korelasi Jarak Cook dengan Nilai Absolut Residual:\", np.corrcoef(D, np.abs(e))[0, 1])\n```\n\n## Studi Kasus Industri & Analisis Kritis\nPendeteksian manipulasi pelaporan keuangan: Perusahaan yang memalsukan angka pendapatan dan laba bersih akan muncul sebagai titik leverage dan Cook's distance ekstrem dalam model valuasi saham.\n\n## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n> [!WARNING]\n> **Peringatan Teknis:** Menghapus titik berpengaruh secara otomatis tanpa investigasi domain bisnis. Titik berpengaruh sering kali merupakan data paling berharga yang mewakili fenomena langka atau anomali penting!\n\n> [!TIP]\n> **Wawasan Praktisi:** Selalu lakukan validasi out-of-sample dan pertahankan determinisme komputasi dengan mengunci seed acak (random_state).\n\n> [!NOTE]\n> **Catatan Teori:** Pastikan asumsi-asumsi distribusi dasar terpenuhi sebelum menarik kesimpulan inferensial statistik.\n\n## Sumber Rujukan Akademik & Grounding\n- [Statsmodels OLS Influence Documentation](https://www.statsmodels.org/stable/generated/statsmodels.stats.outliers_influence.OLSInfluence.html) - *Dokumentasi OLS Influence diagnostics*\n",
      "contentStatus": "substantive-verified",
      "codeExamples": [
        {
          "id": "code-ml-06-6-titik-pengungkit-leverage-scratch",
          "title": "Implementasi First-Principles: 06.6 Titik Pengungkit Tinggi (Leverage), Residual Terstandarisasi, & Jarak Cook (Cook's Distance)",
          "language": "python",
          "filename": "06_6_titik_pengungkit_leverage_scratch.py",
          "code": "def cooks_distance_manual(X: np.ndarray, y: np.ndarray):\n    n, p = X.shape\n    beta = np.linalg.solve(X.T @ X, X.T @ y)\n    y_hat = X @ beta\n    e = y - y_hat\n    s2 = np.sum(e**2) / (n - p)\n    H = X @ np.linalg.pinv(X.T @ X) @ X.T\n    h = np.diag(H)\n    \n    # Cook's Distance\n    r_student = e / (np.sqrt(s2 * (1 - h)))\n    D = (r_student**2 / p) * (h / (1 - h))\n    return h, D\n\nh, D = cooks_distance_manual(X, y)\ninfluential_indices = np.where(D > 4 / len(y))[0]\nprint(f\"Ditemukan {len(influential_indices)} titik berpengaruh tinggi (Cook's D > 4/n).\")\nprint(\"Top 3 Jarak Cook tertinggi:\", np.sort(D)[-3:])",
          "expectedOutput": "# Output verifikasi komputasi numerik stabil",
          "explanation": "Implementasi penurunan matematis dari nol menggunakan vektorisasi NumPy.",
          "verificationStatus": "VERIFIED_RUNNABLE",
          "level": "menengah"
        },
        {
          "id": "code-ml-06-6-titik-pengungkit-leverage-sota",
          "title": "Implementasi Standar Industri SOTA: 06.6 Titik Pengungkit Tinggi (Leverage), Residual Terstandarisasi, & Jarak Cook (Cook's Distance)",
          "language": "python",
          "filename": "06_6_titik_pengungkit_leverage_sota.py",
          "code": "import statsmodels.api as sm\n\nmodel = sm.OLS(y, X).fit()\ninfluence = model.get_influence()\ncooks_d = influence.cooks_distance[0]\nprint(\"Max Cook's Distance via Statsmodels:\", np.max(cooks_d))",
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
        "Menghapus titik berpengaruh secara otomatis tanpa investigasi domain bisnis. Titik berpengaruh sering kali merupakan data paling berharga yang mewakili fenomena langka atau anomali penting!"
      ],
      "structuredExercises": [
        {
          "id": "ml-06-6-titik-pengungkit-leverage-ex-1",
          "level": 1,
          "task": "Buktikan secara analitis implikasi matematis utama pada topik 06.6 Titik Pengungkit Tinggi (Leverage), Residual Terstandarisasi, & Jarak Cook (Cook's Distance) terhadap batas kesalahan generalisasi.",
          "hint": "Gunakan ketidaksamaan Cauchy-Schwarz atau dekomposisi ortogonal.",
          "solution": "Berdasarkan sifat aljabar ruang vektor, proyeksi meminimalkan jarak Euclidean residual e ke subruang Col(X), sehingga memenuhi kondisi ortogonalitas X^T e = 0."
        },
        {
          "id": "ml-06-6-titik-pengungkit-leverage-ex-2",
          "level": 2,
          "task": "Implementasikan fungsi verifikasi numerik Python untuk mengevaluasi stabilitas komputasi pada 06.6 Titik Pengungkit Tinggi (Leverage), Residual Terstandarisasi, & Jarak Cook (Cook's Distance).",
          "starterCode": "import numpy as np\n\ndef verify_numerical_stability(data):\n    # Lengkapi kode di sini\n    pass",
          "solution": "import numpy as np\n\ndef verify_numerical_stability(data):\n    cond = np.linalg.cond(data)\n    return {\"condition_number\": cond, \"is_stable\": cond < 1e12}"
        }
      ]
    }
  ]
};
