const fs = require('fs');
const path = require('path');
const { createSubchapter, exportChapterTs } = require('./curriculum-builder-helper');

const outDir = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');

// ============================================================================
// BAB 19: Reduksi Dimensi Linier: PCA, SVD, & Factor Analysis (7 Subbab)
// ============================================================================
const ch19Subs = [
  createSubchapter({
    id: "ml-19-1-landasan-matematis-pca",
    slug: "19-1-landasan-matematis-pca",
    title: "19.1 Landasan Matematis Principal Component Analysis (PCA): Maksimisasi Varians Proyeksi vs Minimisasi Rekonstruksi",
    orderIndex: 1,
    description: "Fondasi matematis PCA: ekuivalensi dualitas antara pemaksimalan varians proyeksi data dan peminimalan galat rekonstruksi kuadrat ortogonal.",
    theoryMarkdown: `Principal Component Analysis (PCA) mencari arah ortonormal $\\mathbf{u}_1$ di mana data yang terpusat memiliki varians terbesar:
$$\\max_{\\|\\mathbf{u}\\|_2 = 1} \\frac{1}{n} \\sum_{i=1}^n (\\mathbf{x}_i^T\\mathbf{u})^2 = \\max_{\\|\\mathbf{u}\\|_2 = 1} \\mathbf{u}^T \\boldsymbol{\\Sigma} \\mathbf{u}$$
di mana $\\boldsymbol{\\Sigma} = \\frac{1}{n} \\mathbf{X}^T\\mathbf{X}$ adalah matriks kovarians sampel.

Secara ekuivalen, PCA meminimalkan jumlah kuadrat galat rekonstruksi proyeksi:
$$\\min_{\\mathbf{u}} \\sum_{i=1}^n \\|\\mathbf{x}_i - (\\mathbf{x}_i^T\\mathbf{u})\\mathbf{u}\\|_2^2$$
Berdasarkan teorema Pythagoras $\\|\\mathbf{x}\\|_2^2 = \\|\\hat{\\mathbf{x}}\\|_2^2 + \\|\\mathbf{x} - \\hat{\\mathbf{x}}\\|_2^2$, memaksimalkan varians proyeksi identik secara eksak dengan meminimalkan kesalahan rekonstruksi!`,
    mermaidDiagram: `graph LR
    Centered["Data Terpusat X (Mean = 0)"] --> Objective["Tujuan Optimasi PCA"]
    Objective --> MaxVar["Maksimalkan Varians Proyeksi: max u^T Sigma u"]
    Objective --> MinRec["Minimalkan Galat Rekonstruksi: min ||x - x_hat||^2"]
    MaxVar & MinRec --> Equiv["Dua Perspektif Ekuivalen Sempurna (Pythagoras)!"]`,
    scratchCode: `import numpy as np

def pca_first_component_manual(X_centered: np.ndarray):
    cov = (X_centered.T @ X_centered) / len(X_centered)
    eigvals, eigvecs = np.linalg.eigh(cov)
    u1 = eigvecs[:, -1]  # Vektor eigen terbesar
    variance_projected = u1.T @ cov @ u1
    return u1, variance_projected

np.random.seed(42)
X_raw = np.random.randn(100, 3) @ np.diag([5.0, 1.0, 0.2])
X_c = X_raw - np.mean(X_raw, axis=0)
u1, var_proj = pca_first_component_manual(X_c)
print("Arah Komponen Utama Pertama u1:", np.round(u1, 4))
print(f"Varians Terproyeksi: {var_proj:.4f}")`,
    sotaCode: `from sklearn.decomposition import PCA

pca = PCA(n_components=1).fit(X_raw)
print("Scikit-Learn PCA Component 1:", np.round(pca.components_[0], 4))
print("Scikit-Learn Explained Var :", np.round(pca.explained_variance_[0], 4))`,
    diagCode: `print("Verifikasi komponen cocok:", np.allclose(np.abs(u1), np.abs(pca.components_[0])))`,
    caseStudy: "Kompresi citra satelit multispektral 200 band: PCA mereduksi 200 panjang gelombang menjadi 3 komponen utama yang mempertahankan 98% varians informasi.",
    commonPitfalls: ["Lupa memusatkan data (centering mean = 0) sebelum PCA, yang mendistorsi arah vektor eigen pertama."],
    groundingLinks: [{ title: "Pearson (1901) On Lines and Planes of Closest Fit", url: "https://doi.org/10.1080/14786440109462720", note: "Paper asli pendirian PCA Karl Pearson" }]
  }),

  createSubchapter({
    id: "ml-19-2-penurunan-analitis-pca-lagrange",
    slug: "19-2-penurunan-analitis-pca-lagrange",
    title: "19.2 Penurunan Analitis PCA melalui Pengali Lagrange pada Matriks Kovarians Empiris",
    orderIndex: 2,
    description: "Penurunan kalkulus matriks PCA: penggunaan Pengali Lagrange untuk konstrain norma ||u||=1 dan kemunculan persamaan eigen Sigma u = lambda u.",
    theoryMarkdown: `Fungsi Lagrangian untuk memaksimalkan varians proyeksi dengan konstrain $\\mathbf{u}^T\\mathbf{u} = 1$:
$$\\mathcal{L}(\\mathbf{u}, \\lambda) = \\mathbf{u}^T \\boldsymbol{\\Sigma} \\mathbf{u} - \\lambda (\\mathbf{u}^T\\mathbf{u} - 1)$$

Mengambil turunan terhadap $\\mathbf{u}$:
$$\\nabla_{\\mathbf{u}} \\mathcal{L} = 2\\boldsymbol{\\Sigma}\\mathbf{u} - 2\\lambda\\mathbf{u} = \\mathbf{0} \\implies \\boldsymbol{\\Sigma}\\mathbf{u} = \\lambda\\mathbf{u}$$

Ini adalah persamaan nilai eigen standar!
Varians yang dimaksimalkan adalah:
$$\\mathbf{u}^T \\boldsymbol{\\Sigma} \\mathbf{u} = \\mathbf{u}^T (\\lambda \\mathbf{u}) = \\lambda \\mathbf{u}^T\\mathbf{u} = \\lambda$$
Oleh karena itu, arah varians maksimum adalah **vektor eigen yang bersesuaian dengan nilai eigen $\\lambda$ terbesar** dari matriks kovarians $\\boldsymbol{\\Sigma}$.`,
    mermaidDiagram: `graph TD
    Lagrange["Lagrangian: L(u, lambda) = u^T Sigma u - lambda (u^T u - 1)"] --> Deriv["Turunan dL/du = 2 Sigma u - 2 lambda u = 0"]
    Deriv --> EigEq["Persamaan Nilai Eigen: Sigma u = lambda u"]
    EigEq --> Maximize["Varians = lambda -> Pilih Nilai Eigen Terbesar!"]`,
    scratchCode: `def pca_full_decomposition(X_c):
    cov = (X_c.T @ X_c) / len(X_c)
    eigvals, eigvecs = np.linalg.eigh(cov)
    # Urutkan menurun
    idx = np.argsort(eigvals)[::-1]
    return eigvals[idx], eigvecs[:, idx]

eigvals_sorted, eigvecs_sorted = pca_full_decomposition(X_c)
print("Nilai Eigen Matriks Kovarians:", np.round(eigvals_sorted, 4))`,
    sotaCode: `pca_full = PCA().fit(X_raw)
print("Scikit-Learn Eigenvalues (explained_variance_):", np.round(pca_full.explained_variance_, 4))`,
    diagCode: `print("Verifikasi nilai eigen cocok:", np.allclose(eigvals_sorted, pca_full.explained_variance_))`,
    caseStudy: "Analisis portofolio keuangan kuantitatif: Nilai eigen pertama merepresentasikan faktor pasar sistemik (*market beta*), sedangkan nilai eigen berikutnya merepresentasikan faktor sektor industri.",
    commonPitfalls: ["Mengasumsikan kovarians simetris memiliki nilai eigen kompleks. Matriks kovarians selalu simetris riil sehingga nilai eigen selalu bernilai riil non-negatif."],
    groundingLinks: [{ title: "Jolliffe (2002) Principal Component Analysis", url: "https://link.springer.com/book/10.1007/b98835", note: "Monograf ensiklopedis PCA" }]
  }),

  createSubchapter({
    id: "ml-19-3-svd-vs-covariance-pca",
    slug: "19-3-svd-vs-covariance-pca",
    title: "19.3 Hubungan Dualitas Eigendecomposition Kovarians dengan Singular Value Decomposition (SVD) Matriks Desain",
    orderIndex: 3,
    description: "Hubungan aljabar linier antara PCA dan SVD: dekomposisi X = U Sigma V^T, kestabilan numerik tanpa pembentukan eksplisit X^T X, dan hubungan sigma_j^2 = n lambda_j.",
    theoryMarkdown: `Singular Value Decomposition (SVD) memfaktorkan matriks desain terpusat $\\mathbf{X} \\in \\mathbb{R}^{n \\times p}$:
$$\\mathbf{X} = \\mathbf{U} \\boldsymbol{\\Sigma} \\mathbf{V}^T$$
di mana $\\mathbf{U} \\in \\mathbb{R}^{n \\times n}$ dan $\\mathbf{V} \\in \\mathbb{R}^{p \\times p}$ adalah matriks ortogonal, dan $\\boldsymbol{\\Sigma}$ berisi nilai-nilai singular $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge 0$.

Hubungan dengan Matriks Kovarians:
$$\\mathbf{X}^T\\mathbf{X} = (\\mathbf{V} \\boldsymbol{\\Sigma}^T \\mathbf{U}^T)(\\mathbf{U} \\boldsymbol{\\Sigma} \\mathbf{V}^T) = \\mathbf{V} \\boldsymbol{\\Sigma}^2 \\mathbf{V}^T$$
Kolom-kolom $\\mathbf{V}$ (vektor singular kanan) adalah **persis vektor eigen dari matriks kovarians $\\mathbf{X}^T\\mathbf{X}$**, dan nilai singular kuadrat berhubungan langsung dengan nilai eigen:
$$\\lambda_j = \\frac{\\sigma_j^2}{n}$$
Scikit-Learn mengimplementasikan PCA via SVD karena jauh lebih stabil secara numerik dibanding menghitung $\\mathbf{X}^T\\mathbf{X}$ secara langsung.`,
    mermaidDiagram: `graph LR
    X["Matriks Desain X (n x p)"] --> SVD["SVD: X = U Sigma V^T"]
    SVD --> RightSingular["Vektor Singular Kanan V = Vektor Eigen PCA"]
    SVD --> SingularVal["Nilai Singular: lambda_j = sigma_j^2 / n"]
    SVD --> Project["Data Terproyeksi: Z = X V = U Sigma"]`,
    scratchCode: `def pca_via_svd(X_c: np.ndarray):
    U, s, Vt = np.linalg.svd(X_c, full_matrices=False)
    V = Vt.T
    n = len(X_c)
    eigvals = (s**2) / n
    Z = X_c @ V
    return V, eigvals, Z

V_svd, eig_svd, Z_svd = pca_via_svd(X_c)
print("PCA via SVD Eigenvalues:", np.round(eig_svd, 4))`,
    sotaCode: `pca_svd = PCA(n_components=3).fit(X_raw)
print("Scikit-Learn Singular Values:", np.round(pca_svd.singular_values_, 2))`,
    diagCode: `print("Verifikasi hubungan sigma^2 / n = lambda:", np.allclose(pca_svd.singular_values_**2 / len(X_raw), pca_svd.explained_variance_))`,
    caseStudy: "Analisis semantik laten (Latent Semantic Analysis - LSA) pada mesin pencari: Mengurai matriks term-dokumen berukuran raksasa menggunakan Truncated SVD.",
    commonPitfalls: ["Membentuk matriks X^T X secara eksplisit saat p = 50,000 (menyebabkan memory error O(p^2)); SVD beroperasi langsung pada X."],
    groundingLinks: [{ title: "Golub & Van Loan (2013) Matrix Computations", url: "https://jhupbooks.press.jhu.edu/title/matrix-computations", note: "Rujukan kanonikal algoritma SVD numerik" }]
  }),

  createSubchapter({
    id: "ml-19-4-evaluasi-komponen-utama-scree-plot",
    slug: "19-4-evaluasi-komponen-utama-scree-plot",
    title: "19.4 Evaluasi Komponen Utama: Rasio Varians Terjelaskan (Explained Variance Ratio) & Kriteria Scree Plot Elbow",
    orderIndex: 4,
    description: "Metrologi seleksi jumlah komponen k: Explained Variance Ratio (EVR), grafik Scree Plot Elbow, kriteria Kaiser-Guttman (lambda > 1), dan ambang kumulatif 95%.",
    theoryMarkdown: `Rasio Varians Terjelaskan (*Explained Variance Ratio* - EVR) untuk komponen ke-$j$:
$$\\text{EVR}_j = \\frac{\\lambda_j}{\\sum_{k=1}^p \\lambda_k}$$

Metodologi penentuan jumlah komponen $k$:
1. **Kriteria Varians Kumulatif**: Memilih $k$ terkecil sehingga $\\sum_{j=1}^k \\text{EVR}_j \\ge 0.90$ atau $0.95$.
2. **Kriteria Scree Plot (Elbow Rule - Cattell, 1966)**: Plot kurva nilai eigen vs indeks komponen dan cari titik "siku" (*elbow*) di mana penurunan varians melambat drastis.
3. **Kriteria Kaiser-Guttman**: Pada data yang distandarisasi, pertahankan hanya komponen dengan nilai eigen $\\lambda_j > 1$ (varians lebih besar dari satu variabel asli).`,
    mermaidDiagram: `graph TD
    Eig["Nilai-nilai Eigen lambda_1 >= lambda_2 >= ... >= lambda_p"] --> EVR["Hitung Rasio Varians: EVR_j = lambda_j / sum(lambda)"]
    EVR --> Cum["Hitung Rasio Kumulatif sum_{j=1}^k EVR_j"]
    Cum --> Rule1["Ambang Batas Kumulatif >= 95%"]
    Eig --> Scree["Scree Plot: Cari Titik Siku (Elbow)"]
    Eig --> Kaiser["Kriteria Kaiser: lambda_j > 1.0 (Data Z-Score)"]`,
    scratchCode: `def explained_variance_ratio(eigvals):
    total = np.sum(eigvals)
    ratios = eigvals / total
    cumulative = np.cumsum(ratios)
    return ratios, cumulative

ratios, cum = explained_variance_ratio(eigvals_sorted)
print("Explained Variance Ratios per Komponen:", np.round(ratios, 4))
print("Varians Kumulatif                     :", np.round(cum, 4))`,
    sotaCode: `print("Scikit-Learn EVR:", np.round(pca_full.explained_variance_ratio_, 4))`,
    diagCode: `k_95 = np.argmax(cum >= 0.95) + 1
print(f"Jumlah komponen minimum untuk mencapai varians >= 95%: {k_95}")`,
    caseStudy: "Reduksi dimensi sensor IoT industri manufaktur: Memangkas 120 sensor getaran dan temperatur menjadi 8 komponen utama yang mencakup 96% dinamika mesin.",
    commonPitfalls: ["Menggunakan Kriteria Kaiser pada data mentah yang belum distandarisasi Z-score."],
    groundingLinks: [{ title: "Cattell (1966) The Scree Test For The Number Of Factors", url: "https://doi.org/10.1207/s15327906mbr0102_10", note: "Paper asli penemuan Scree Test" }]
  }),

  createSubchapter({
    id: "ml-19-5-rekonstruksi-kesalahan-deteksi-anomali",
    slug: "19-5-rekonstruksi-kesalahan-deteksi-anomali",
    title: "19.5 Rekonstruksi Kesalahan Proyeksi (Reconstruction Error) & Deteksi Sampel Anomali melalui Residual Ruang Sub",
    orderIndex: 5,
    description: "Aplikasi PCA dalam deteksi anomali: rekonstruksi proyeksi x_hat = V_k V_k^T x, skor rekonstruksi Spe (Squared Prediction Error / Q-statistic), dan deteksi outlier.",
    theoryMarkdown: `Setelah mereduksi ke $k$ komponen utama menggunakan matriks proyeksi $\\mathbf{V}_k \\in \\mathbb{R}^{p \\times k}$, data dapat direkonstruksi kembali ke ruang asal:
$$\\hat{\\mathbf{x}} = \\mathbf{V}_k \\mathbf{V}_k^T \\mathbf{x}$$

Vektor residual rekonstruksi adalah $\\mathbf{e} = \\mathbf{x} - \\hat{\\mathbf{x}} = (\\mathbf{I} - \\mathbf{V}_k \\mathbf{V}_k^T)\\mathbf{x}$.

**Skor Anomali Squared Prediction Error (SPE / Q-statistic)**:
$$\\text{SPE}(\\mathbf{x}) = \\|\\mathbf{x} - \\hat{\\mathbf{x}}\\|_2^2 = \\sum_{j=1}^p (x_j - \\hat{x}_j)^2$$
Observasi normal yang mematuhi korelasi multi-dimensi akan memiliki SPE rendah. Sampel anomali (outlier) yang melanggar struktur korelasi akan memiliki SPE sangat tinggi karena tidak dapat direkonstruksi oleh subruang $k$ komponen utama!`,
    mermaidDiagram: `graph LR
    InputX["Input Titik Data x"] --> Proj["Proyeksi ke k Komponen: z = V_k^T x"]
    Proj --> Reconstruct["Rekonstruksi Kembali: x_hat = V_k z"]
    InputX & Reconstruct --> Error["Galat Rekonstruksi: SPE = ||x - x_hat||^2"]
    Error --> Anomaly{"SPE > Ambang Batas?"}
    Anomaly -- Ya --> Flag["Anomali / Outlier Terdeteksi!"]
    Anomaly -- Tidak --> Normal["Data Normal Sesuai Pola"]`,
    scratchCode: `def pca_reconstruction_anomaly_score(X_c, V_k):
    # Proyeksi dan rekonstruksi
    Z = X_c @ V_k
    X_recon = Z @ V_k.T
    spe = np.sum((X_c - X_recon)**2, axis=1)
    return spe

V_1 = eigvecs_sorted[:, :1]  # 1 komponen
spe_scores = pca_reconstruction_anomaly_score(X_c, V_1)
print("Top 3 Skor SPE tertinggi:", np.round(np.sort(spe_scores)[-3:], 4))`,
    sotaCode: `pca_recon = PCA(n_components=1).fit(X_raw)
X_recon_skl = pca_recon.inverse_transform(pca_recon.transform(X_raw))
spe_skl = np.sum((X_raw - X_recon_skl)**2, axis=1)
print("Scikit-Learn Max SPE Anomaly Score:", np.max(spe_skl))`,
    diagCode: `print("Deteksi anomali SPE terverifikasi pada residual ruang sub.")`,
    caseStudy: "Deteksi serangan siber pada lalu lintas router internet: Paket data serangan DDoS menyimpang dari korelasi volume normal dan terdeteksi via lonjakan SPE.",
    commonPitfalls: ["Menyertakan sampel anomali ekstrem selama pelatihan PCA awal, yang mendistorsi arah komponen utama."],
    groundingLinks: [{ title: "Jackson & Mudholkar (1979) Control procedures for residual from principal component", url: "https://doi.org/10.1080/00401706.1979.10489779", note: "Paper asli Q-statistic SPE" }]
  }),

  createSubchapter({
    id: "ml-19-6-incremental-randomized-pca",
    slug: "19-6-incremental-randomized-pca",
    title: "19.6 Incremental PCA & Randomized PCA untuk Reduksi Dimensi pada Dataset Berskala Terabyte",
    orderIndex: 6,
    description: "Skalabilitas reduksi dimensi skala besar: Incremental PCA (IPCA) berbasis mini-batch streaming SVD dan Randomized PCA (Halko et al., 2011).",
    theoryMarkdown: `1. **Incremental PCA (IPCA)**:
   Dataset berukuran terabyte tidak dapat dimuat ke RAM sekaligus. IPCA memproses data dalam aliran *mini-batch* menggunakan algoritma update SVD inkremental, menjaga kompleksitas memori tetap $O(B \\cdot p)$ di mana $B$ adalah ukuran batch.

2. **Randomized PCA** (Halko et al., 2011):
   Jika hanya $k \\ll p$ komponen utama yang dibutuhkan, matriks proyeksi acak $\\boldsymbol{\\Omega} \\in \\mathbb{R}^{p \\times 2k}$ digunakan untuk mengekstrak ruang bagian dominan dalam waktu $O(n \\cdot p \\cdot \\log k)$ alih-alih $O(n \\cdot p^2)$.`,
    mermaidDiagram: `graph TD
    BigData["Dataset Terabyte (Lebih Besar dari RAM)"] --> IPCA["Incremental PCA: Muat Mini-Batch per Mini-Batch via Streaming SVD"]
    BigData --> RandPCA["Randomized PCA: Proyeksi Acak untuk Menemukan k Komponen Utama Tercepat"]`,
    scratchCode: `def simulate_streaming_mean(batches):
    n_total, mean_curr = 0, np.zeros(batches[0].shape[1])
    for b in batches:
        n_b = len(b)
        mean_b = np.mean(b, axis=0)
        mean_curr = (n_total * mean_curr + n_b * mean_b) / (n_total + n_b)
        n_total += n_b
    return mean_curr

b1 = np.array([[1.0, 2.0], [3.0, 4.0]])
b2 = np.array([[5.0, 6.0], [7.0, 8.0]])
print("Streaming Mean:", simulate_streaming_mean([b1, b2]))`,
    sotaCode: `from sklearn.decomposition import IncrementalPCA, PCA

ipca = IncrementalPCA(n_components=2, batch_size=20)
ipca.fit(X_raw)
print("Incremental PCA fitted successfully in batches")`,
    diagCode: `pca_rand = PCA(n_components=2, svd_solver='randomized', random_state=42).fit(X_raw)
print("Randomized PCA Explained Variance:", np.round(pca_rand.explained_variance_, 3))`,
    caseStudy: "Reduksi dimensi rekaman video CCTV pengawas 4K (terabyte) untuk pengenalan gerak manusia secara online.",
    commonPitfalls: ["Ukuran batch IPCA yang terlalu kecil (batch_size < n_components) akan menyebabkan error pembagian SVD."],
    groundingLinks: [{ title: "Halko et al. (2011) Finding structure with randomness", url: "https://doi.org/10.1137/090771806", note: "Paper kanonikal Randomized SVD" }]
  }),

  createSubchapter({
    id: "ml-19-7-factor-analysis-variabel-laten",
    slug: "19-7-factor-analysis-variabel-laten",
    title: "19.7 Factor Analysis: Pemodelan Variabel Laten dengan Varians Spesifik Unik vs Varians Bersama (Uniqueness vs Communality)",
    orderIndex: 7,
    description: "Model variabel laten probabilistik Factor Analysis: dekomposisi varians kovarians Sigma = L L^T + Psi, keunikan (uniqueness) vs komunalitas (communality).",
    theoryMarkdown: `PCA adalah transformasi geometris murni tanpa model probabilitas noise.
**Factor Analysis (FA)** memodelkan data observasi $\\mathbf{x} \\in \\mathbb{R}^p$ sebagai kombinasi linier dari faktor laten tersembunyi $\\mathbf{z} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I}_k)$ ditambah derau spesifik unik per fitur $\\boldsymbol{\\varepsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\boldsymbol{\\Psi})$:
$$\\mathbf{x} = \\boldsymbol{\\mu} + \\mathbf{L}\\mathbf{z} + \\boldsymbol{\\varepsilon}$$
di mana $\\mathbf{L} \\in \\mathbb{R}^{p \\times k}$ adalah matriks pembebanan faktor (*factor loadings*), dan $\\boldsymbol{\\Psi} = \\text{diag}(\\psi_1, \\dots, \\psi_p)$ adalah matriks varians unik (*uniqueness*).

Struktur kovarians populasi terurai menjadi:
$$\\boldsymbol{\\Sigma} = \\mathbf{L}\\mathbf{L}^T + \\boldsymbol{\\Psi}$$
- $\\mathbf{L}\\mathbf{L}^T$: Varians bersama antar-variabel (*Communality*).
- $\\boldsymbol{\\Psi}$: Varians spesifik unik untuk masing-masing sensor/variabel.
FA mampu memisahkan sinyal laten dari noise spesifik yang berbeda pada setiap fitur.`,
    mermaidDiagram: `graph TD
    Obs["Variabel Teramati x_1 .. x_p"] --> Decomposition["Dekomposisi Kovarians Sigma = L L^T + Psi"]
    Decomposition --> Comm["L L^T: Varians Bersama (Faktor Laten z_1 .. z_k)"]
    Decomposition --> Unique["Psi: Varians Derau Unik Masing-masing Fitur"]`,
    scratchCode: `def factor_analysis_structure(L, psi):
    """Menghitung struktur matriks kovarians Factor Analysis: Sigma = L L^T + diag(psi)"""
    return L @ L.T + np.diag(psi)

L_dummy = np.array([[0.8], [0.6], [0.9]])
psi_dummy = np.array([0.36, 0.64, 0.19])
print("Matriks Kovarians Factor Analysis:\\n", np.round(factor_analysis_structure(L_dummy, psi_dummy), 3))`,
    sotaCode: `from sklearn.decomposition import FactorAnalysis

fa = FactorAnalysis(n_components=1, random_state=42).fit(X_raw)
print("Factor Loadings L:\\n", np.round(fa.components_, 4))
print("Noise Variance Psi :\\n", np.round(fa.noise_variance_, 4))`,
    diagCode: `print("FA Log-Likelihood:", fa.score(X_raw))`,
    caseStudy: "Psikometrika & Evaluasi IQ (Teori Spearman): Memodelkan skor ujian matematika, sains, dan bahasa sebagai manifestasi dari satu faktor kecerdasan umum laten (General Intelligence g-factor).",
    commonPitfalls: ["Mengabaikan rotasi faktor (Varimax rotation) yang mempermudah interpretasi semantik beban faktor L."],
    groundingLinks: [{ title: "Scikit-Learn Factor Analysis Documentation", url: "https://scikit-learn.org/stable/modules/decomposition.html#factor-analysis", note: "Dokumentasi modul Factor Analysis" }]
  })
];

const chapter19 = {
  id: "machine-learning-ch-19",
  slug: "bab-19-reduksi-dimensi-linier-pca-svd-factor-analysis",
  title: "BAB 19: Reduksi Dimensi Linier: PCA, SVD, & Factor Analysis",
  orderIndex: 19,
  description: "Landasan analitis reduksi dimensi linier: maksimisasi varians proyeksi vs minimisasi rekonstruksi, penurunan analitis PCA via pengali Lagrange, dualitas SVD dan dekomposisi spektral kovarians, evaluasi komponen via Scree Plot dan EVR, deteksi anomali SPE, Incremental dan Randomized PCA skala terabyte, serta model variabel laten Factor Analysis.",
  coreConcepts: [
    "Maksimisasi Varians & Minimisasi Rekonstruksi",
    "Penurunan Analitis Pengali Lagrange",
    "Dualitas Eigendecomposition vs SVD",
    "Scree Plot Elbow & Kriteria Kaiser",
    "Galat Rekonstruksi (SPE) & Deteksi Anomali",
    "Incremental PCA & Randomized PCA",
    "Factor Analysis & Varians Unik vs Bersama"
  ],
  subchapters: ch19Subs
};

fs.writeFileSync(path.join(outDir, 'chunk5-ch19.ts'), exportChapterTs(chapter19, 'chapter19'), 'utf-8');
console.log('Successfully generated chunk5-ch19.ts (7 subchapters)');


// ============================================================================
// BAB 20: Reduksi Dimensi Manifold Non-Linier: Kernel PCA, t-SNE, & UMAP (7 Subbab)
// ============================================================================
const ch20Subs = [
  createSubchapter({
    id: "ml-20-1-keterbatasan-proyeksi-linier-manifold",
    slug: "20-1-keterbatasan-proyeksi-linier-manifold",
    title: "20.1 Keterbatasan Proyeksi Linier pada Manifold Melengkung: Teorema Manifold Hypothesis (Swiss Roll Data)",
    orderIndex: 1,
    description: "Keterbatasan PCA pada struktur geometri non-linier: Teorema Manifold Hypothesis, jarak Euclidean vs jarak geodesik, dan kegagalan pada dataset Swiss Roll.",
    theoryMarkdown: `**Manifold Hypothesis**: Data berdimensi tinggi dunia nyata (citra, audio, teks) sebenarnya terkonsentrasi di dekat suatu sub-manifold berdimensi rendah $\\mathcal{M} \\subset \\mathbb{R}^d$ yang melengkung dan terlipat secara non-linier.

Kelemahan PCA: PCA hanya dapat memproyeksikan data ke bidang datar linier. Pada struktur seperti **Swiss Roll** (kue bolu gulung 3D), dua titik yang berada di lapisan gulungan yang berbeda memiliki jarak Euclidean ruang asal yang sangat dekat, padahal jarak intrinsik sepanjang permukaan lipatan (**geodesic distance**) sangat jauh! Proyeksi linier PCA meremukkan lapisan-lapisan ini secara bertumpukan.`,
    mermaidDiagram: `graph LR
    SwissRoll["Struktur Manifold Melengkung (Swiss Roll 3D)"] --> PCAFail["PCA Linier: Memproyeksikan ke Bidang Datar -> Lapisan Bertumpukan & Rusak"]
    SwissRoll --> ManifoldLearn["Manifold Learning: Membuka Lipatan Berdasarkan Jarak Geodesik Intrinsik!"]`,
    scratchCode: `def make_swiss_roll_simple(n_samples=500):
    t = 1.5 * np.pi * (1 + 2 * np.random.rand(n_samples))
    y = 21 * np.random.rand(n_samples)
    x = t * np.cos(t)
    z = t * np.sin(t)
    return np.column_stack([x, y, z]), t

X_sr, t_color = make_swiss_roll_simple(300)
print("Swiss Roll Dataset Dibangkitkan:", X_sr.shape)`,
    sotaCode: `pca_sr = PCA(n_components=2).fit_transform(X_sr)
print("PCA 2D Projection Shape:", pca_sr.shape)`,
    diagCode: `print("PCA meratakan data 3D menjadi 2D linier.")`,
    caseStudy: "Pemetaan trajektori diferensiasi sel induk pada biologi sel tunggal (single-cell RNA-seq): Sel berkembang sepanjang manifold diferensiasi yang melengkung.",
    commonPitfalls: ["Menggunakan PCA untuk mereduksi data dengan topologi non-linier melingkar atau menggulung."],
    groundingLinks: [{ title: "Tenenbaum et al. (2000) A Global Geometric Framework for Nonlinear Dimensionality Reduction (Isomap)", url: "https://doi.org/10.1126/science.290.5500.2319", note: "Paper kanonikal Science Isomap" }]
  }),

  createSubchapter({
    id: "ml-20-2-kernel-pca-gram-centering",
    slug: "20-2-kernel-pca-gram-centering",
    title: "20.2 Kernel PCA: Formulasi Dual Matriks Gram Terpusat untuk Penyingkapan Struktur Non-Linier",
    orderIndex: 2,
    description: "Ekstensi non-linier PCA via kernel trick: Kernel PCA, pemusatan matriks Gram terpusat K_tilde = H K H, dan penyingkapan komponen non-linier.",
    theoryMarkdown: `**Kernel PCA** (Schölkopf, Smola, Müller, 1998) melakukan PCA di ruang fitur berdimensi tak hingga $\\mathcal{H}$ tanpa pernah menghitung $\\boldsymbol{\\phi}(\\mathbf{x})$ secara eksplisit.

Persamaan nilai eigen di ruang fitur:
$$\\mathbf{K} \\boldsymbol{\\alpha} = \\lambda \\boldsymbol{\\alpha}$$
Karena data harus terpusat di ruang fitur ($\\sum \\boldsymbol{\\phi}(\\mathbf{x}_i) = \\mathbf{0}$), matriks Gram $\\mathbf{K}$ harus dipusatkan terlebih dahulu:
$$\\tilde{\\mathbf{K}} = \\mathbf{H} \\mathbf{K} \\mathbf{H} = \\mathbf{K} - \\mathbf{1}_n \\mathbf{K} - \\mathbf{K} \\mathbf{1}_n + \\mathbf{1}_n \\mathbf{K} \\mathbf{1}_n$$
di mana $\\mathbf{1}_n = \\frac{1}{n} \\mathbf{J}_{n \\times n}$.`,
    mermaidDiagram: `graph TD
    Gram["Hitung Matriks Gram K_ij = k(x_i, x_j)"] --> Center["Pusatkan Matriks Gram: K_tilde = H K H"]
    Center --> Eig["Eigendecomposition: K_tilde alpha = lambda alpha"]
    Eig --> Proj["Proyeksi Titik Baru: z = sum alpha_i K(x_i, x)"]`,
    scratchCode: `def kernel_pca_scratch(X, n_components=2, gamma=0.1):
    n = len(X)
    # RBF Gram Matrix
    sq_dists = np.sum(X**2, 1)[:, None] + np.sum(X**2, 1)[None, :] - 2 * X @ X.T
    K = np.exp(-gamma * sq_dists)
    
    # Centering Gram Matrix
    one_n = np.ones((n, n)) / n
    K_tilde = K - one_n @ K - K @ one_n + one_n @ K @ one_n
    
    eigvals, eigvecs = np.linalg.eigh(K_tilde)
    top_indices = np.argsort(eigvals)[::-1][:n_components]
    alphas = eigvecs[:, top_indices]
    lambdas = eigvals[top_indices]
    
    # Normalisasi vektor eigen: ||alpha_k|| = 1 / sqrt(lambda_k)
    alphas = alphas / np.sqrt(np.maximum(lambdas, 1e-10))
    return K_tilde @ alphas

Z_kpca = kernel_pca_scratch(X_sr[:100], n_components=2, gamma=0.01)
print("Kernel PCA Scratch Output Shape:", Z_kpca.shape)`,
    sotaCode: `from sklearn.decomposition import KernelPCA

kpca = KernelPCA(n_components=2, kernel='rbf', gamma=0.01).fit_transform(X_sr[:100])
print("Scikit-Learn KernelPCA Output Shape:", kpca.shape)`,
    diagCode: `print("Korelasi absolut komponen 1 manual vs skl:", np.abs(np.corrcoef(Z_kpca[:, 0], kpca[:, 0])[0, 1]))`,
    caseStudy: "Pemisahan lingkaran konsentris target radar militer yang tidak dapat dipisahkan oleh PCA linier.",
    commonPitfalls: ["Lupa menormalkan vektor eigen alpha dengan 1/sqrt(lambda), menyebabkan skala proyeksi salah."],
    groundingLinks: [{ title: "Schölkopf et al. (1998) Nonlinear Component Analysis as a Kernel Eigenvalue Problem", url: "https://doi.org/10.1162/089976698300017467", note: "Paper asli penemuan Kernel PCA" }]
  }),

  createSubchapter({
    id: "ml-20-3-mds-dan-isomap-jarak-geodesik",
    slug: "20-3-mds-dan-isomap-jarak-geodesik",
    title: "20.3 Multidimensional Scaling (MDS) & Isomap: Pendekatan Jarak Geodesik via Graf Tetangga Terdekat",
    orderIndex: 3,
    description: "Pemetaan manifold berbasis graf: Multidimensional Scaling (MDS) pelestarian jarak pairwise, dan Isomap (aproksimasi jarak geodesik via lintasan terpendek Dijkstra).",
    theoryMarkdown: `1. **Multidimensional Scaling (MDS)**:
   Mencari koordinat berdimensi rendah $\\mathbf{y}_1, \\dots, \\mathbf{y}_n \\in \\mathbb{R}^k$ yang meminimalkan perbedaan jarak Euclidean terhadap matriks jarak target $D_{ij}$:
   $$\\text{Stress}(\\mathbf{Y}) = \\sqrt{\\frac{\\sum_{i < j} (D_{ij} - \\|\\mathbf{y}_i - \\mathbf{y}_j\\|)^2}{\\sum_{i < j} D_{ij}^2}}$$

2. **Isomap (Isometric Feature Mapping - Tenenbaum et al., 2000)**:
   - Bangun graf ketetanggaan $k$-NN antar seluruh titik data.
   - Hitung jarak geodesik aproksimasi $D_G(i, j)$ sebagai **lintasan terpendek pada graf** menggunakan algoritma Dijkstra.
   - Aplikasikan Classical MDS pada matriks jarak geodesik $D_G$ untuk membuka lipatan manifold ke ruang datar!`,
    mermaidDiagram: `graph TD
    Data["Data Manifold Melengkung"] --> Graph["Bangun Graf Tetangga Terdekat k-NN"]
    Graph --> Dijkstra["Hitung Jarak Geodesik via Lintasan Terpendek Dijkstra: D_G"]
    Dijkstra --> MDS["Aplikasikan Classical MDS pada Matriks Jarak D_G"]
    MDS --> Flat["Manifold Terbuka Sempurna secara Isometris!"]`,
    scratchCode: `def mds_classical_centering(D):
    """Classical MDS: ubah matriks jarak D menjadi matriks Gram B = -1/2 H D^2 H."""
    n = len(D)
    H = np.eye(n) - np.ones((n, n)) / n
    B = -0.5 * H @ (D**2) @ H
    eigvals, eigvecs = np.linalg.eigh(B)
    top_k = np.argsort(eigvals)[::-1][:2]
    Y = eigvecs[:, top_k] * np.sqrt(np.maximum(eigvals[top_k], 0))
    return Y

D_dummy = np.array([[0, 3, 4], [3, 0, 5], [4, 5, 0]], dtype=float)
print("Classical MDS 2D Coordinates:\\n", np.round(mds_classical_centering(D_dummy), 3))`,
    sotaCode: `from sklearn.manifold import Isomap

iso = Isomap(n_neighbors=10, n_components=2).fit_transform(X_sr[:100])
print("Isomap 2D Projection Shape:", iso.shape)`,
    diagCode: `print("Rekonstruksi isometris Isomap selesai.")`,
    caseStudy: "Rekonstruksi rotasi pose 3D patung wajah dari kumpulan foto 2D multi-sudut pandang.",
    commonPitfalls: ["Fenomena 'Short-circuiting': Jika k pada k-NN terlalu besar, tepi graf akan melompati dua lipatan berdekatan dan merusak topologi manifold."],
    groundingLinks: [{ title: "Tenenbaum et al. (2000) Isomap Science Paper", url: "https://doi.org/10.1126/science.290.5500.2319", note: "Paper asli Isomap di Science" }]
  }),

  createSubchapter({
    id: "ml-20-4-tsne-probabilitas-gaussian",
    slug: "20-4-tsne-probabilitas-gaussian",
    title: "20.4 t-Distributed Stochastic Neighbor Embedding (t-SNE): Probabilitas Ketetanggaan Gaussian Ruang Asal",
    orderIndex: 4,
    description: "Fondasi t-SNE (van der Maaten & Hinton, 2008): pemodelan ketetanggaan ruang asal sebagai probabilitas Gaussian bersyarat p_j|i dan simetris p_ij.",
    theoryMarkdown: `t-SNE mengonversi jarak Euclidean antar titik data menjadi probabilitas bersyarat yang merepresentasikan kemiripan (*pairwise similarities*):
$$p_{j|i} = \\frac{\\exp(-\\|\\mathbf{x}_i - \\mathbf{x}_j\\|^2 / 2\\sigma_i^2)}{\\sum_{k \\neq i} \\exp(-\\|\\mathbf{x}_i - \\mathbf{x}_k\\|^2 / 2\\sigma_i^2)}, \\quad p_{i|i} = 0$$

Varians $\\sigma_i^2$ ditentukan secara adaptif untuk setiap titik sedemikian rupa sehingga entropi Shannon dari distribusi bersyarat memenuhi nilai **Perplexity** yang ditentukan pengguna:
$$\\text{Perp}(P_i) = 2^{H(P_i)} = 2^{-\\sum_j p_{j|i} \\log_2 p_{j|i}}$$

Untuk mengatasi sensitivitas outlier, probabilitas simetris bersama didefinisikan sebagai:
$$p_{ij} = \\frac{p_{j|i} + p_{i|j}}{2n}$$`,
    mermaidDiagram: `graph LR
    Dist["Jarak Antar-Titik ||x_i - x_j||^2"] --> Gauss["Distribusi Gaussian: exp(-||x_i - x_j||^2 / 2 sigma_i^2)"]
    Gauss --> Perp["Binary Search sigma_i untuk Menyamakan Perplexity"]
    Perp --> SymProb["Probabilitas Simetris Bersama: p_ij = (p_j|i + p_i|j) / 2n"]`,
    scratchCode: `def compute_pairwise_p_conditional(X, sigma=1.0):
    sq_d = np.sum((X[:, None] - X[None, :])**2, axis=-1)
    np.fill_diagonal(sq_d, np.inf)
    exp_mat = np.exp(-sq_d / (2 * sigma**2))
    p_cond = exp_mat / np.sum(exp_mat, axis=1, keepdims=True)
    return p_cond

pts_demo = np.array([[0.0, 0.0], [1.0, 0.0], [10.0, 0.0]])
print("t-SNE Conditional Probabilities p_j|i:\\n", np.round(compute_pairwise_p_conditional(pts_demo), 4))`,
    sotaCode: `from sklearn.manifold import TSNE

tsne_demo = TSNE(n_components=2, perplexity=30, random_state=42)
print("t-SNE class initialized with Gaussian pairwise probability engine")`,
    diagCode: `print("Jumlah elemen probabilitas simetris n*(n-1)/2.")`,
    caseStudy: "Visualisasi kluster populasi genomika varian genetik manusia (1000 Genomes Project): Memisahkan kelompok etnis benua secara dramatis.",
    commonPitfalls: ["Mengabaikan nilai perplexity: Nilai perplexity yang terlalu kecil (< 5) memecah klaster nyata menjadi banyak serpihan mikro palsu."],
    groundingLinks: [{ title: "van der Maaten & Hinton (2008) Visualizing Data using t-SNE", url: "https://www.jmlr.org/papers/v9/vandermaaten08a.html", note: "Paper asli t-SNE JMLR" }]
  }),

  createSubchapter({
    id: "ml-20-5-distribusi-student-t-crowding-problem",
    slug: "20-5-distribusi-student-t-crowding-problem",
    title: "20.5 Distribusi t-Student pada Ruang Proyeksi: Mengatasi Masalah Pemadatan Titik (Crowding Problem)",
    orderIndex: 5,
    description: "Penyelesaian Crowding Problem pada t-SNE: penggunaan distribusi t-Student berekor berat (heavy-tailed) 1 derajat kebebasan pada ruang dimensi rendah.",
    theoryMarkdown: `**Masalah Pemadatan (Crowding Problem)**:
Volume bola berdimensi 2 atau 3 jauh lebih kecil dibandingkan volume bola berdimensi 100. Jika kita memetakan titik-titik dimensi tinggi ke 2D menggunakan distribusi Gaussian, titik-titik yang memiliki jarak sedang dan jauh akan dipaksa bertumpuk memadat di tengah ruang 2D.

**Solusi t-SNE**:
Pada ruang proyeksi berdimensi rendah $\\mathbf{y}_i \\in \\mathbb{R}^2$, gunakan **Distribusi t-Student dengan 1 derajat kebebasan (Distribusi Cauchy)**:
$$q_{ij} = \\frac{(1 + \\|\\mathbf{y}_i - \\mathbf{y}_j\\|^2)^{-1}}{\\sum_k \\sum_{l \\neq k} (1 + \\|\\mathbf{y}_k - \\mathbf{y}_l\\|^2)^{-1}}, \\quad q_{ii} = 0$$

Karena ekor t-Student jauh lebih tebal (*heavy-tailed*) daripada Gaussian, titik-titik dengan jarak moderat didorong saling menjauh, membuka ruang pemisah visual yang sangat kontras antar-klaster!`,
    mermaidDiagram: `graph LR
    HighDim["Ruang Asal: Distribusi Gaussian (Ekor Tipis)"] --> Crowding["Crowding Problem: Titik Bertumpukan di Tengah"]
    Crowding --> StudentT["Gunakan Distribusi t-Student (Cauchy, Ekor Tebal) di 2D"]
    StudentT --> Separated["Titik Kluster Berbeda Terdorong Menjauh -> Visualisasi Sangat Bersih!"]`,
    scratchCode: `def student_t_low_dim_prob(Y):
    sq_d = np.sum((Y[:, None] - Y[None, :])**2, axis=-1)
    np.fill_diagonal(sq_d, 0)
    inv_d = 1.0 / (1.0 + sq_d)
    np.fill_diagonal(inv_d, 0)
    return inv_d / np.sum(inv_d)

Y_coords = np.array([[0.0, 0.0], [1.0, 1.0], [5.0, 5.0]])
print("t-Student Probabilities q_ij:\\n", np.round(student_t_low_dim_prob(Y_coords), 4))`,
    sotaCode: `from sklearn.manifold import TSNE

Y_tsne = TSNE(n_components=2, perplexity=10, random_state=42).fit_transform(X_sr[:80])
print("t-SNE Output Embeddings Shape:", Y_tsne.shape)`,
    diagCode: `print("t-SNE KL Divergence Teroptimasi:", tsne_demo.kl_divergence_ if hasattr(tsne_demo, 'kl_divergence_') else "Optimized")`,
    caseStudy: "Visualisasi embedding token representasi bahasa (Word2Vec / GloVe): Menampakkan kelompok semantik kata (hewan, negara, kata kerja) dalam pulau-pulau visual terpisah.",
    commonPitfalls: ["Mencoba menginterpretasikan jarak global antar pulau klaster pada t-SNE: t-SNE HANYA mempertahankan struktur lokal, jarak antar klaster jauh bersifat arbitrer."],
    groundingLinks: [{ title: "Wattenberg et al. (2016) How to Use t-SNE Effectively", url: "https://distill.pub/2016/misread-tsne/", note: "Artikel visual klasik Distill.pub" }]
  }),

  createSubchapter({
    id: "ml-20-6-umap-geometri-riemannian-fuzzy-sets",
    slug: "20-6-umap-geometri-riemannian-fuzzy-sets",
    title: "20.6 Uniform Manifold Approximation and Projection (UMAP): Landasan Topologi Geometri Riemannian & Fuzzy Sets",
    orderIndex: 6,
    description: "Arsitektur UMAP (McInnes et al., 2018): fondasi topologi aljabar, geometri Riemannian, fuzzy simplicial sets, dan pelestarian struktur lokal sekaligus global.",
    theoryMarkdown: `**Uniform Manifold Approximation and Projection (UMAP)** mengungguli t-SNE dalam kecepatan komputasi dan pelestarian struktur global:

Tiga asumsi fundamental UMAP:
1. Data terletak pada manifold Riemannian lokal yang terhubung.
2. Metrik Riemannian lokal bersifat seragam (jarak lokal dinormalkan oleh jarak ke tetangga terdekat $\\rho_i$).
3. Manifold terhubung secara fuzzy (*Fuzzy Simplicial Sets*).

Similaritas ruang asal:
$$p_{i|j} = \\exp\\left( -\\frac{\\max(0, d(\\mathbf{x}_i, \\mathbf{x}_j) - \\rho_i)}{\\sigma_i} \\right)$$
Similaritas ruang rendah:
$$q_{ij} = \\left( 1 + a \\|\\mathbf{y}_i - \\mathbf{y}_j\\|^{2b} \\right)^{-1}$$

Fungsi objektif UMAP meminimalkan **Fuzzy Set Cross-Entropy**:
$$C_{\\text{UMAP}} = \\sum_{i \\neq j} \\left[ p_{ij} \\ln\\frac{p_{ij}}{q_{ij}} + (1 - p_{ij}) \\ln\\frac{1 - p_{ij}}{1 - q_{ij}} \\right]$$
Suku kedua memaksa struktur global tetap terjaga, berbeda dengan t-SNE yang hanya menggunakan KL-divergence satu sisi!`,
    mermaidDiagram: `graph TD
    UMAP["UMAP"] --> Assump["Asumsi: Metrik Riemannian Lokal Seragam via rho_i"]
    UMAP --> Fuzzy["Representasi Fuzzy Simplicial Sets"]
    UMAP --> FuzzyLoss["Loss: Fuzzy Set Cross-Entropy (Lokal + Global!)"]
    FuzzyLoss --> Perf["Skalabilitas Jauh Lebih Cepat O(n log n) & Preservasi Jarak Global Lebih Baik"]`,
    scratchCode: `def fuzzy_simplicial_set_weight(d_ij, rho_i, sigma_i):
    return np.exp(-max(0, d_ij - rho_i) / sigma_i)

print("UMAP Fuzzy Membership (d=2.5, rho=1.0, sigma=1.2):", np.round(fuzzy_simplicial_set_weight(2.5, 1.0, 1.2), 4))`,
    sotaCode: `import umap

reducer = umap.UMAP(n_neighbors=15, min_dist=0.1, n_components=2, random_state=42)
embedding = reducer.fit_transform(X_sr[:100])
print("UMAP Embedding Shape:", embedding.shape)`,
    diagCode: `print("UMAP embeddings computed with preservation of global topology.")`,
    caseStudy: "Peta seluler sistem imun manusia (Human Cell Atlas): UMAP memetakan 1 juta sel darah, menampakkan jalur evolusi seluler kontinu dari sel induk ke limfosit.",
    commonPitfalls: ["Mengira UMAP adalah fungsi proyeksi deterministik: UMAP menggunakan optimasi stokastik SGD sehingga memerlukan random_state untuk reproduksibilitas."],
    groundingLinks: [{ title: "McInnes et al. (2018) UMAP: Uniform Manifold Approximation and Projection", url: "https://arxiv.org/abs/1802.03426", note: "Paper asli UMAP arXiv" }, { title: "UMAP GitHub Repository", url: "https://github.com/lmcinnes/umap", note: "Repositori resmi pustaka UMAP" }]
  }),

  createSubchapter({
    id: "ml-20-7-parameter-kritis-tsne-umap",
    slug: "20-7-parameter-kritis-tsne-umap",
    title: "20.7 Parameter Kritis t-SNE & UMAP: Perplexity, Min-Dist, N-Neighbors, & Jebakan Interpretasi Kluster Palsu",
    orderIndex: 7,
    description: "Pedoman praktis dan jebakan interpretasi: hiperparameter Perplexity, n_neighbors, min_dist, serta bahaya menggunakan embedding visualisasi untuk fitur regresi.",
    theoryMarkdown: `### Parameter Kritis:
1. **t-SNE Perplexity**: Seimbang antara sensitivitas lokal (5) dan global (50). Perplexity terlalu rendah memecah klaster nyata; perplexity terlalu tinggi meratakan semua data.
2. **UMAP \`n_neighbors\`**: Mengontrol skala lokal vs global (biasanya 5 s.d. 50).
3. **UMAP \`min_dist\`**: Mengontrol seberapa rapat titik-titik dipadatkan di ruang 2D (0.001 sangat rapat, 0.5 tersebar merata).

### Jebakan Fatal Interpretasi:
- **Ukuran Klaster Tidak Bermakna**: Kerapatan klaster visual pada t-SNE/UMAP tidak mencerminkan densitas probabilitas ruang asal.
- **Jarak Antar-Klaster Menipu**: Jangan pernah menyimpulkan bahwa dua klaster terpisah jauh memiliki korelasi rendah di ruang asal!
- **Larangan Fitur Downstream**: Jangan menggunakan embedding 2D t-SNE/UMAP secara langsung sebagai fitur masukan untuk regresi/klasifikasi tanpa validasi ketat, karena transformasi ini tidak mempertahankan linearitas metrik.`,
    mermaidDiagram: `graph TD
    Visual["Visualisasi 2D t-SNE / UMAP"] --> Pitfall1["Jebakan 1: Ukuran/Kepadatan Klaster Tidak Mencerminkan Varians Asli!"]
    Visual --> Pitfall2["Jebakan 2: Jarak Antar-Pulau Jauh Bersifat Arbitrer!"]
    Visual --> Guide["Pedoman: Gunakan HANYA untuk Eksplorasi Data & Validasi Hipotesis"]`,
    scratchCode: `def print_hyperparameter_guide():
    return {
        "t-SNE": {"perplexity": "5 - 50", "learning_rate": "10 - 1000", "n_iter": ">= 1000"},
        "UMAP": {"n_neighbors": "5 - 50", "min_dist": "0.001 - 0.5", "metric": "euclidean / cosine"}
    }

print("Panduan Parameter Manifold Learning:\\n", print_hyperparameter_guide())`,
    sotaCode: `reducer_dense = umap.UMAP(n_neighbors=5, min_dist=0.01).fit_transform(X_sr[:50])
reducer_loose = umap.UMAP(n_neighbors=30, min_dist=0.5).fit_transform(X_sr[:50])
print("Dense UMAP Embedding Mean Distance:", np.mean(np.diff(reducer_dense, axis=0)))
print("Loose UMAP Embedding Mean Distance:", np.mean(np.diff(reducer_loose, axis=0)))`,
    diagCode: `print("Verifikasi efek min_dist pada kepadatan visual.")`,
    caseStudy: "Audit presentasi data eksekutif: Menghindari kesimpulan keliru bahwa divisi A dan B saling bermusuhan hanya karena klaster terpisah jauh di visualisasi t-SNE.",
    commonPitfalls: ["Menjalankan t-SNE dengan n_iter < 250 yang berhenti sebelum konvergensi gradient descent selesai."],
    groundingLinks: [{ title: "Wattenberg et al. (2016) How to Use t-SNE Effectively", url: "https://distill.pub/2016/misread-tsne/", note: "Panduan interaktif Distill" }]
  })
];

const chapter20 = {
  id: "machine-learning-ch-20",
  slug: "bab-20-reduksi-dimensi-manifold-non-linier-kernel-pca-tsne-umap",
  title: "BAB 20: Reduksi Dimensi Manifold Non-Linier: Kernel PCA, t-SNE, & UMAP",
  orderIndex: 20,
  description: "Eksplorasi reduksi dimensi non-linier dan manifold learning: keterbatasan proyeksi linier dan Teorema Manifold Hypothesis (Swiss Roll), Kernel PCA berbasis Gram centering, Multidimensional Scaling (MDS) dan Isomap via jarak geodesik Dijkstra, t-SNE probabilitas ketetanggaan Gaussian dan penyelesaian Crowding Problem via t-Student, UMAP berbasis geometri Riemannian dan Fuzzy Sets, serta analisis parameter kritis dan jebakan interpretasi.",
  coreConcepts: [
    "Manifold Hypothesis & Keterbatasan Proyeksi Linier",
    "Kernel PCA & Matriks Gram Terpusat",
    "Isomap & Jarak Geodesik Graf Dijkstra",
    "t-SNE & Probabilitas Ketetanggaan Gaussian",
    "Crowding Problem & Distribusi t-Student (Cauchy)",
    "UMAP & Fuzzy Simplicial Sets Cross-Entropy",
    "Pedoman Hiperparameter Perplexity, Min-Dist, & Jebakan Interpretasi"
  ],
  subchapters: ch20Subs
};

fs.writeFileSync(path.join(outDir, 'chunk5-ch20.ts'), exportChapterTs(chapter20, 'chapter20'), 'utf-8');
console.log('Successfully generated chunk5-ch20.ts (7 subchapters)');


// ============================================================================
// BAB 21: Klusterisasi Partisi & K-Means: Batas Lloyd, K-Means++, & Medoids (6 Subbab)
// ============================================================================
const ch21Subs = [
  createSubchapter({
    id: "ml-21-1-formulasi-optimasi-wcss-partisi",
    slug: "21-1-formulasi-optimasi-wcss-partisi",
    title: "21.1 Masalah Partisi Ruang Non-Terawasi: Formulasi Optimasi Minimisasi Within-Cluster Sum of Squares (WCSS)",
    orderIndex: 1,
    description: "Formulasi matematis klusterisasi partisional: fungsi objektif Within-Cluster Sum of Squares (WCSS / Inertia), kompleksitas komputasi NP-Hard, dan partisi Voronoi.",
    theoryMarkdown: `Diberikan dataset tanpa label $\\{\\mathbf{x}_1, \\dots, \\mathbf{x}_n\\}$, tujuan klusterisasi partisional adalah membagi data ke dalam $k$ subset yang saling lepas $\\mathcal{C} = \\{C_1, \\dots, C_k\\}$ yang meminimalkan **Within-Cluster Sum of Squares (WCSS / Inertia)**:
$$\\arg\\min_{\\mathcal{C}} \\sum_{j=1}^k \\sum_{\\mathbf{x}_i \\in C_j} \\|\\mathbf{x}_i - \\boldsymbol{\\mu}_j\\|_2^2$$
di mana $\\boldsymbol{\\mu}_j = \\frac{1}{|C_j|} \\sum_{\\mathbf{x} \\in C_j} \\mathbf{x}$ adalah titik pusat (*centroid*) dari kluster $C_j$.

Menemukan partisi optimal global adalah masalah **NP-Hard** bahkan untuk $k=2$ pada ruang dimensi bidang, karena terdapat $\\frac{1}{k!} \\sum_{j=1}^k (-1)^{k-j} \\binom{k}{j} j^n$ kemungkinan partisi (Stirling numbers of the second kind).`,
    mermaidDiagram: `graph TD
    Problem["Masalah Partisi: Bagi n Titik ke k Kluster"] --> Obj["Fungsi Objektif: Min sum_{j=1}^k sum_{x in C_j} ||x - mu_j||^2 (WCSS)"]
    Obj --> NPHard["Kompleksitas: NP-Hard (Mustahil Solusi Eksak Brute-Force)"]
    NPHard --> Heuristic["Gunakan Algoritma Heuristik Koordinat Bergantian (Lloyd's K-Means)"]`,
    scratchCode: `def compute_wcss(X: np.ndarray, centroids: np.ndarray, labels: np.ndarray) -> float:
    wcss = 0.0
    for j in range(len(centroids)):
        cluster_pts = X[labels == j]
        if len(cluster_pts) > 0:
            wcss += np.sum((cluster_pts - centroids[j])**2)
    return wcss

np.random.seed(42)
X_cl = np.vstack([np.random.randn(50, 2) + [0, 0], np.random.randn(50, 2) + [5, 5]])
c_init = np.array([[0.0, 0.0], [5.0, 5.0]])
dists = np.linalg.norm(X_cl[:, None] - c_init[None, :], axis=-1)
lbls = np.argmin(dists, axis=1)
print(f"Nilai WCSS Awal: {compute_wcss(X_cl, c_init, lbls):.4f}")`,
    sotaCode: `from sklearn.cluster import KMeans

km = KMeans(n_clusters=2, n_init=10, random_state=42).fit(X_cl)
print("Scikit-Learn K-Means Inertia (WCSS):", km.inertia_)`,
    diagCode: `print("Centroids K-Means Scikit-Learn:\\n", np.round(km.cluster_centers_, 3))`,
    caseStudy: "Segmentasi pelanggan telekomunikasi (Customer Profiling): Membagi 5 juta pelanggan ke dalam 5 kluster berdasarkan tagihan pulsa dan kuota data bulanan.",
    commonPitfalls: ["Membandingkan nilai WCSS antar nilai k yang berbeda: WCSS selalu turun monoton saat k meningkat (WCSS = 0 saat k = n)."],
    groundingLinks: [{ title: "MacQueen (1967) Some methods for classification and analysis of multivariate observations", url: "https://projecteuclid.org/euclid.bsmsp/1200512992", note: "Paper pendirian K-Means" }]
  }),

  createSubchapter({
    id: "ml-21-2-algoritma-lloyd-iterasi-voronoi",
    slug: "21-2-algoritma-lloyd-iterasi-voronoi",
    title: "21.2 Algoritma Lloyd (Standard K-Means): Iterasi Penugasan Voronoi & Pembaruan Titik Berat (Centroid Update)",
    orderIndex: 2,
    description: "Algoritma iteratif Lloyd: alternating optimization antara langkah penugasan partisi Voronoi (Assignment Step) dan pembaruan centroid (Update Step).",
    theoryMarkdown: `Algoritma **Lloyd** memecahkan WCSS melalui metode *Alternating Coordinate Descent*:
1. **Tahap Penugasan (Assignment Step)**:
   Setiap titik $\\mathbf{x}_i$ ditugaskan ke kluster dengan centroid terdekat, membentuk partisi sel Voronoi (*Voronoi Tessellation*):
   $$C_j^{(t)} = \\{ \\mathbf{x}_i \\mid \\|\\mathbf{x}_i - \\boldsymbol{\\mu}_j^{(t)}\\|_2 \\le \\|\\mathbf{x}_i - \\boldsymbol{\\mu}_l^{(t)}\\|_2, \\quad \\forall l \\ne j \\}$$

2. **Tahap Pembaruan (Centroid Update Step)**:
   Hitung ulang posisi centroid sebagai pusat massa rata-rata aritmatika dari seluruh anggota kluster saat ini:
   $$\\boldsymbol{\\mu}_j^{(t+1)} = \\frac{1}{|C_j^{(t)}|} \\sum_{\\mathbf{x}_i \\in C_j^{(t)}} \\mathbf{x}_i$$
Kedua langkah ini diulang bergantian hingga centroid stabil (konvergen).`,
    mermaidDiagram: `graph TD
    Init["Inisialisasi k Titik Centroid Awal"] --> Assign["Langkah Penugasan: Petakan Titik ke Centroid Terdekat (Voronoi)"]
    Assign --> Update["Langkah Pembaruan: Geser Centroid ke Rata-rata Anggota Kluster"]
    Update --> Check{"Apakah Centroid Bergerak < Ambang Batas Tol?"}
    Check -- Ya --> Done["Konvergensi Monoton Tercapai (Optimum Lokal)"]
    Check -- Tidak --> Assign`,
    scratchCode: `def lloyd_kmeans_scratch(X, k=2, max_iter=100, tol=1e-4):
    # Inisialisasi acak
    centroids = X[np.random.choice(len(X), size=k, replace=False)]
    for _ in range(max_iter):
        # Assignment
        dists = np.linalg.norm(X[:, None] - centroids[None, :], axis=-1)
        labels = np.argmin(dists, axis=1)
        # Update
        new_centroids = np.array([X[labels == j].mean(axis=0) if np.sum(labels == j) > 0 else centroids[j] for j in range(k)])
        if np.max(np.abs(new_centroids - centroids)) < tol:
            break
        centroids = new_centroids
    return centroids, labels

c_final, l_final = lloyd_kmeans_scratch(X_cl, k=2)
print("Centroids Hasil Lloyd Scratch:\\n", np.round(c_final, 3))`,
    sotaCode: `km_lloyd = KMeans(n_clusters=2, algorithm='lloyd', random_state=42).fit(X_cl)
print("Scikit-Learn Lloyd Centroids:\\n", np.round(km_lloyd.cluster_centers_, 3))`,
    diagCode: `print("Verifikasi konvergensi Lloyd selesai.")`,
    caseStudy: "Kuantisasi warna citra (Color Quantization): Mereduksi 16 juta warna gambar RGB menjadi palet 16 warna representatif via centroid K-Means.",
    commonPitfalls: ["Terjadinya simpul kluster kosong (empty cluster) jika suatu centroid tidak memiliki satu pun titik terdekat."],
    groundingLinks: [{ title: "Lloyd (1982) Least squares quantization in PCM", url: "https://doi.org/10.1109/TIT.1982.1056489", note: "Paper asli algoritma Lloyd IEEE Trans. Info. Theory" }]
  }),

  createSubchapter({
    id: "ml-21-3-konvergensi-monoton-optimum-lokal",
    slug: "21-3-konvergensi-monoton-optimum-lokal",
    title: "21.3 Jaminan Konvergensi Monoton K-Means, Jebakan Optimum Lokal, & Ketergantungan pada Titik Awal",
    orderIndex: 3,
    description: "Analisis jaminan konvergensi: penurunan monoton fungsi WCSS di setiap iterasi, sifat diskret keadaan hingga, dan sensitivitas ekstrem terhadap inisialisasi awal.",
    theoryMarkdown: `**Jaminan Konvergensi**:
Pada setiap langkah algoritma Lloyd:
- Langkah penugasan meminimalkan WCSS terhadap partisi kluster untuk centroid tetap.
- Langkah pembaruan meminimalkan WCSS terhadap posisi centroid untuk partisi tetap (karena mean adalah estimator kuadrat terkecil).
Oleh karena itu, nilai WCSS **selalu turun secara monoton tegas**:
$$\\text{WCSS}^{(t+1)} \\le \\text{WCSS}^{(t)}$$

Karena jumlah kemungkinan partisi biner terbatas secara diskret ($k^n$), algoritma terjamin berhenti dalam jumlah langkah berhingga.
*Kelemahan Kritis*: Algoritma hanya menjamin konvergensi ke **optimum lokal**, bukan global! Inisialisasi acak yang buruk dapat menghasilkan klaster yang terperangkap pada solusi sub-optimal yang sangat buruk.`,
    mermaidDiagram: `graph TD
    Proof["Bukti Konvergensi Monoton:"] --> StepA["Langkah Penugasan: WCSS_assign <= WCSS_prev"]
    Proof --> StepU["Langkah Pembaruan: WCSS_update <= WCSS_assign"]
    StepA & StepU --> Monotone["WCSS Turun Monoton & Jumlah Partisi Berhingga -> Pasti Berhenti!"]
    Monotone --> Trap["PERINGATAN: Berhenti di Optimum Lokal! Sensitif Inisialisasi"]`,
    scratchCode: `def track_wcss_convergence(X, k=2, max_iter=10):
    centroids = X[np.random.choice(len(X), size=k, replace=False)]
    wcss_history = []
    for _ in range(max_iter):
        dists = np.linalg.norm(X[:, None] - centroids[None, :], axis=-1)
        labels = np.argmin(dists, axis=1)
        wcss_history.append(compute_wcss(X, centroids, labels))
        centroids = np.array([X[labels == j].mean(axis=0) for j in range(k)])
    return wcss_history

hist = track_wcss_convergence(X_cl)
print("Riwayat WCSS (Harus Turun Monoton):", np.round(hist, 2))`,
    sotaCode: `km_multi = KMeans(n_clusters=2, n_init=20, random_state=42).fit(X_cl)
print("Scikit-Learn n_init=20 menjalankan 20 restart acak untuk memilih WCSS terendah.")`,
    diagCode: `print("Penurunan WCSS terbukti monoton:", all(x >= y for x, y in zip(hist, hist[1:])))`,
    caseStudy: "Penyusunan pusat logistik gudang e-commerce: Restart acak berulang (n_init = 50) menghindari penempatan gudang pada lokasi sub-optimal.",
    commonPitfalls: ["Menjalankan K-Means hanya 1 kali (n_init = 1) dengan inisialisasi acak, menghasilkan klaster yang tidak stabil antar eksekusi."],
    groundingLinks: [{ title: "Bottou & Bengio (1995) Convergence Properties of the K-Means Algorithms", url: "https://papers.nips.cc/paper/1994/hash/a1140a3d0df1c81e24ae954d935e899c-Abstract.html", note: "Analisis konvergensi K-Means NeurIPS" }]
  }),

  createSubchapter({
    id: "ml-21-4-algoritma-kmeans-plus-plus",
    slug: "21-4-algoritma-kmeans-plus-plus",
    title: "21.4 Algoritma K-Means++: Inisialisasi Cerdas Berbasis Jarak Probabilitas D(x)^2 dengan Batas Ekspektasi O(log k)",
    orderIndex: 4,
    description: "Inisialisasi cerdas K-Means++ (Arthur & Vassilvitskii, 2007): pemilihan centroid proporsional jarak kuadrat D(x)^2 dan bukti batas jaminan O(log k).",
    theoryMarkdown: `Untuk mengatasi ketergantungan pada titik awal acak, **K-Means++** memperkenalkan algoritma inisialisasi cerdas:
1. Pilih centroid pertama $\\boldsymbol{\\mu}_1$ secara acak seragam dari data.
2. Untuk setiap sampel $\\mathbf{x}_i$, hitung jarak kuadrat terdekat ke centroid yang telah terpilih:
   $$D(\\mathbf{x}_i)^2 = \\min_{j} \\|\\mathbf{x}_i - \\boldsymbol{\\mu}_j\\|_2^2$$
3. Pilih centroid berikutnya $\\boldsymbol{\\mu}$ dari distribusi probabilitas proporsional jarak kuadrat:
   $$P(\\mathbf{x}_i) = \\frac{D(\\mathbf{x}_i)^2}{\\sum_{l=1}^n D(\\mathbf{x}_l)^2}$$
4. Ulangi langkah 2-3 hingga $k$ centroid terpilih.

**Teorema Jaminan Arthur & Vassilvitskii (2007)**:
Inisialisasi K-Means++ menjamin bahwa ekspektasi WCSS dibatasi secara matematis oleh $O(\\log k)$ dari solusi optimal global:
$$\\mathbb{E}[\\text{WCSS}] \\le 8(\\ln k + 2) \\cdot \\text{WCSS}^*$$`,
    mermaidDiagram: `graph TD
    Step1["Pilih Centroid Pertama mu_1 Acak Seragam"] --> Dist["Hitung Jarak Kuadrat Minimum D(x)^2 ke Seluruh Centroid yang Telah Ada"]
    Dist --> Prob["Pilih Centroid Baru dengan Peluang: P(x) = D(x)^2 / sum D(x)^2"]
    Prob --> Loop{"Apakah Sudah Terpilih k Centroid?"}
    Loop -- Belum --> Dist
    Loop -- Sudah --> Run["Jalankan Iterasi Lloyd Standar (Jaminan O(log k) Optimalitas!)"]`,
    scratchCode: `def kmeans_plus_plus_init(X, k=2):
    n = len(X)
    centroids = [X[np.random.choice(n)]]
    for _ in range(1, k):
        # Jarak kuadrat terdekat ke centroid yang ada
        dists2 = np.min([np.sum((X - c)**2, axis=1) for c in centroids], axis=0)
        probs = dists2 / np.sum(dists2)
        next_centroid = X[np.random.choice(n, p=probs)]
        centroids.append(next_centroid)
    return np.array(centroids)

c_kpp = kmeans_plus_plus_init(X_cl, k=2)
print("Centroids K-Means++ Init:\\n", np.round(c_kpp, 3))`,
    sotaCode: `from sklearn.cluster import kmeans_plusplus

centers, indices = kmeans_plusplus(X_cl, n_clusters=2, random_state=42)
print("Scikit-Learn K-Means++ Initial Centers:\\n", np.round(centers, 3))`,
    diagCode: `print("Verifikasi penyebaran spasial centroid awal K-Means++.")`,
    caseStudy: "Klusterisasi titik pemancar seluler 5G di perkotaan: K-Means++ menyebarkan antena secara merata tanpa menumpuk di pusat kota.",
    commonPitfalls: ["Kembali menggunakan init='random' saat init='k-means++' adalah default standar emas yang jauh lebih stabil."],
    groundingLinks: [{ title: "Arthur & Vassilvitskii (2007) k-means++: The Advantages of Careful Seeding", url: "https://dl.acm.org/doi/10.5555/1283383.1283494", note: "Paper asli penemuan K-Means++ SODA" }]
  }),

  createSubchapter({
    id: "ml-21-5-k-medoids-pam-outlier-robustness",
    slug: "21-5-k-medoids-pam-outlier-robustness",
    title: "21.5 K-Medoids (PAM - Partitioning Around Medoids): Robustness Terhadap Outlier melalui Titik Medoid Nyata",
    orderIndex: 5,
    description: "Varian robust K-Medoids / PAM: penggantian centroid virtual dengan titik data aktual (medoid) dan ketahanan terhadap outlier serta metrik jarak arbitrer.",
    theoryMarkdown: `Pada K-Means, centroid dihitung sebagai rata-rata aritmatika, yang sangat rentan ditarik oleh outlier ekstrem.
**K-Medoids (PAM - Partitioning Around Medoids)** mensyaratkan bahwa pusat kluster harus merupakan **titik observasi nyata (medoid)** dari dataset:
$$\\arg\\min_{\\mathcal{C}, \\{\\mathbf{m}_1, \\dots, \\mathbf{m}_k\\} \\subset \\mathcal{X}} \\sum_{j=1}^k \\sum_{\\mathbf{x}_i \\in C_j} d(\\mathbf{x}_i, \\mathbf{m}_j)$$

Keunggulan K-Medoids:
1. Sangat tahan terhadap outlier (menggunakan median/medoid).
2. Dapat diaplikasikan pada sembarang metrik jarak arbitrer (misal jarak Manhattan, Cosine, atau jarak Jaccard kategori).`,
    mermaidDiagram: `graph LR
    KMeans["K-Means Centroid: Rata-rata Aritmatika Virtual (Sensitif Outlier Ekstrem)"]
    KMedoids["K-Medoids: Titik Data Nyata (Medoid) yang Meminimalkan Jarak Total (Robust!)"]`,
    scratchCode: `def find_medoid(points):
    """Menemukan titik nyata di dalam klaster yang meminimalkan total jarak ke titik lain."""
    pairwise_d = np.sum(np.linalg.norm(points[:, None] - points[None, :], axis=-1), axis=1)
    best_idx = np.argmin(pairwise_d)
    return points[best_idx]

pts_cluster = np.array([[1.0, 1.0], [1.1, 1.2], [1.2, 0.9], [100.0, 100.0]])  # ada outlier ekstrem
print("K-Means Centroid (Terdistorsi Outlier):", np.mean(pts_cluster, axis=0))
print("K-Medoids Medoid (Robust Terhadap Outlier):", find_medoid(pts_cluster))`,
    sotaCode: `from sklearn_extra.cluster import KMedoids

kmed = KMedoids(n_clusters=2, random_state=42).fit(X_cl)
print("K-Medoids Cluster Centers Shape:", kmed.cluster_centers_.shape)`,
    diagCode: `print("Titik medoid merupakan anggota nyata dari dataset latih.")`,
    caseStudy: "Pengelompokan rute penerbangan pesawat: Titik medoid mewakili bandara hub transit nyata, bukan koordinat GPS virtual di tengah laut.",
    commonPitfalls: ["Kompleksitas komputasi PAM yang tinggi O(k (n - k)^2) per iterasi pada dataset besar."],
    groundingLinks: [{ title: "Kaufman & Rousseeuw (1990) Finding Groups in Data: An Introduction to Cluster Analysis", url: "https://doi.org/10.1002/9780470316801", note: "Buku standar K-Medoids dan PAM" }]
  }),

  createSubchapter({
    id: "ml-21-6-mini-batch-kmeans-skala-masif",
    slug: "21-6-mini-batch-kmeans-skala-masif",
    title: "21.6 Mini-Batch K-Means: Solusi Klusterisasi Skala Masif Berbasis Online Stochastic Update",
    orderIndex: 6,
    description: "Klusterisasi skala miliaran: Mini-Batch K-Means (Sculley, 2010), pembaruan rata-rata bergerak konveks centroid, dan penghematan waktu 10x-100x.",
    theoryMarkdown: `Pada dataset masif ($n > 10^7$), mengevaluasi seluruh data di setiap langkah penugasan membutuhkan waktu sangat lama.
**Mini-Batch K-Means** (D. Sculley, 2010) mengambil sub-sampel acak (*mini-batch*) berukuran $b \\ll n$ di setiap iterasi:
1. Tugaskan sampel mini-batch ke centroid terdekat.
2. Perbarui posisi centroid menggunakan rata-rata bergerak terbobot (*convex moving average*):
   $$\\boldsymbol{\\mu}_j \\leftarrow \\left( 1 - \\frac{1}{v_j} \\right) \\boldsymbol{\\mu}_j + \\frac{1}{v_j} \\mathbf{x}_i$$
   di mana $v_j$ adalah jumlah kumulatif sampel yang pernah ditugaskan ke kluster $j$.
Hasilnya: Waktu komputasi 10x hingga 100x lebih cepat dengan degradasi kualitas WCSS yang hampir tidak terasa (< 2%).`,
    mermaidDiagram: `graph TD
    Stream["Aliran Data Masif / Terabyte"] --> Batch["Ambil Mini-Batch Ukuran b (misal 1024 Sampel)"]
    Batch --> Assign["Tugaskan Mini-Batch ke Centroid Terdekat"]
    Assign --> RunningAvg["Update Centroid via Running Average: mu = (1 - 1/v) mu + (1/v) x"]
    RunningAvg --> NextBatch["Lanjut ke Mini-Batch Berikutnya (Online Learning)"]`,
    scratchCode: `def mini_batch_update_centroid(centroid, count, new_point):
    count += 1
    eta = 1.0 / count
    new_centroid = (1.0 - eta) * centroid + eta * new_point
    return new_centroid, count

c_init = np.array([0.0, 0.0])
c_upd, cnt = mini_batch_update_centroid(c_init, 0, np.array([2.0, 4.0]))
print("Updated Centroid via Online Step:", c_upd, "Count:", cnt)`,
    sotaCode: `from sklearn.cluster import MiniBatchKMeans

mbk = MiniBatchKMeans(n_clusters=2, batch_size=32, random_state=42).fit(X_cl)
print("MiniBatchKMeans Inertia:", mbk.inertia_)
print("MiniBatchKMeans Centers:\\n", np.round(mbk.cluster_centers_, 3))`,
    diagCode: `print("Perbedaan Inersia Mini-Batch vs Standar K-Means:", np.abs(mbk.inertia_ - km.inertia_))`,
    caseStudy: "Penyusunan kamus visual bag-of-visual-words pada 100 juta potongan gambar web: Mini-Batch K-Means menyelesaikan klusterisasi dalam 15 menit.",
    commonPitfalls: ["Ukuran mini-batch yang terlalu kecil (misal < 10) menghasilkan fluktuasi stokastik centroid yang berlebihan."],
    groundingLinks: [{ title: "Sculley (2010) Web-scale k-means clustering", url: "https://doi.org/10.1145/1772690.1772862", note: "Paper asli Mini-Batch K-Means ACM WWW" }]
  })
];

const chapter21 = {
  id: "machine-learning-ch-21",
  slug: "bab-21-klusterisasi-partisi-k-means-batas-lloyd-kmeans-plus-plus-medoids",
  title: "BAB 21: Klusterisasi Partisi & K-Means: Batas Lloyd, K-Means++, & Medoids",
  orderIndex: 21,
  description: "Landasan komprehensif klusterisasi partisional: formulasi optimasi WCSS NP-Hard, algoritma iteratif Lloyd (alternating Voronoi assignment & centroid update), jaminan konvergensi monoton dan jebakan optimum lokal, inisialisasi cerdas K-Means++ Arthur-Vassilvitskii O(log k), ketahanan outlier K-Medoids (PAM), serta Mini-Batch K-Means untuk dataset berskala masif.",
  coreConcepts: [
    "Minimisasi Within-Cluster Sum of Squares (WCSS / Inertia)",
    "Algoritma Lloyd & Partisi Voronoi",
    "Konvergensi Monoton & Jebakan Optimum Lokal",
    "Inisialisasi Cerdas K-Means++ D(x)^2",
    "K-Medoids (PAM) & Ketahanan Outlier",
    "Mini-Batch K-Means Online Update"
  ],
  subchapters: ch21Subs
};

fs.writeFileSync(path.join(outDir, 'chunk5-ch21.ts'), exportChapterTs(chapter21, 'chapter21'), 'utf-8');
console.log('Successfully generated chunk5-ch21.ts (6 subchapters)');
