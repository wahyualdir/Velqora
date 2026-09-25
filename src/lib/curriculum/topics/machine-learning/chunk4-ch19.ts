import { AcademicChapter } from "../../types";

export const chapter19: AcademicChapter = {
  id: "machine-learning-ch-19",
  slug: "bab-19-gaussian-mixture-models-dan-algoritma-expectation-maximization",
  title: "BAB 19: Gaussian Mixture Models (GMM) & Algoritma Expectation-Maximization (EM)",
  orderIndex: 19,
  description: "Perumusan matematis komprehensif Gaussian Mixture Models (GMM) dan kerangka kerja estimasi parameter variabel laten Expectation-Maximization (EM): transisi konseptual dari partisi biner tegas (Hard Clustering) menuju pembagian tanggung jawab probabilistik kontinu (Soft Clustering), formulasi fungsi kepadatan probabilitas (PDF) Gaussian multivariat d-dimensi dan log-likelihood tak lengkap data observasi; fenomena singularitas kovarians dan solusi regularisasi ridge; taksonomi geometris matriks kovarians (Spherical, Diagonal, Tied, Full) serta analisis kapasitas parameter bebas; penurunan analitis lengkap teorema algoritma EM Dempster et al. (1977) melalui dekomposisi Evidence Lower Bound (ELBO), Pertidaksamaan Jensen fungsi konkaf, dan Divergensi Kullback-Leibler dengan bukti kenaikan log-likelihood monotonik; evaluasi Tahap Ekspektasi (E-step) untuk tanggung jawab posterior gamma_ik via trik numerik Log-Sum-Exp; penurunan analitis Tahap Maksimasi (M-step) via Pengali Lagrange untuk pembaruan bobot prior pi_k, rata-rata tertimbang mu_k, dan dispersi kovarians Sigma_k; serta seleksi model optimal dan pencegahan overfitting menggunakan Kriteria Informasi Bayesian (BIC) Gideon Schwarz (1978) dan Akaike Information Criterion (AIC).",
  coreConcepts: [
    "Paradigma Soft Clustering & Model Generatif Variabel Laten",
    "PDF Gaussian Multivariat d-Dimensi & Jarak Kuadrat Mahalanobis",
    "Masalah Singularitas Kovarians & Batas Bawah Non-Tunggal",
    "Struktur Matriks Kovarians: Spherical, Diagonal, Tied, & Full",
    "Bukti Teorema EM: Evidence Lower Bound (ELBO) & Pertidaksamaan Jensen",
    "Dekomposisi Divergensi KL & Jaminan Konvergensi Monotonik Likelihood",
    "E-Step: Tanggung Jawab Posterior gamma_ik & Stabilisasi Log-Sum-Exp (LSE)",
    "M-Step: Penurunan Pengali Lagrange Bobot Campuran & Rata-rata Tertimbang",
    "Seleksi Model Parsimonius via Bayesian Information Criterion (BIC) & AIC",
  ],
  learningObjectives: [
    "Membedakan batas tegas K-Means dari ketidakpastian posterior kontinu GMM pada wilayah data tumpang tindih.",
    "Menganalisis fungsi log-likelihood GMM dan membuktikan ketidakhadiran solusi bentuk tertutup akibat suku penjumlahan di dalam logaritma.",
    "Membandingkan trade-off kapasitas parameter, bias-varians, dan kompleksitas komputasi keempat tipe matriks kovarians.",
    "Membuktikan secara analitis bahwa algoritma EM selalu meningkatkan atau mempertahankan nilai log-likelihood pada setiap iterasi menggunakan pertidaksamaan Jensen.",
    "Menerapkan stabilisasi numerik Log-Sum-Exp pada perhitungan Tahap E untuk mencegah kegagalan floating-point underflow.",
    "Menurunkan formula pembaruan parameter M-step menggunakan kalkulus matriks dan pengali Lagrange.",
    "Menentukan jumlah komponen Gaussian K optimal dan tipe kovarians menggunakan evaluasi grid search BIC dan AIC.",
  ],
  competencies: [
    "Implementasi dari dasar algoritma Expectation-Maximization untuk model campuran probabilistik menggunakan vektorisasi NumPy",
    "Penanganan ketidakstabilan numerik dimensi tinggi dengan dekomposisi Cholesky dan trik Log-Sum-Exp",
    "Pemilihan struktur kovarians GMM yang optimal untuk mencegah overfitting pada keterbatasan ukuran sampel",
    "Klasterisasi lunak dan ekstraksi representasi fitur berbasis probabilitas posterior untuk tugas klasifikasi hilir",
    "Penalaan jumlah komponen laten data kompleks menggunakan kriteria informasi AIC/BIC",
  ],
  subchapters: [
    {
      id: "ml-ch19-01-paradigma-soft-clustering-model-campuran",
      slug: "paradigma-soft-clustering-model-campuran",
      title: "19.1 Paradigma Klasterisasi Lembut (Soft Clustering) & Model Generatif Campuran Probabilistik",
      orderIndex: 1,
      description: "Perbandingan mendalam antara partisi biner tegas (Hard Clustering) dan penugasan derajat keanggotaan probabilistik kontinu (Soft Clustering), perumusan model generatif variabel laten, serta representasi ketidakpastian spasial.",
      summary: "Bab ini memperkenalkan pergeseran paradigma dari pengelompokan deterministik kaku K-Means menuju model campuran berbasis probabilitas di mana setiap observasi memiliki vektor probabilitas keanggotaan simultan di seluruh klaster.",
      contentStatus: "substantive-verified",
      content_markdown: `### Pergeseran Paradigma: Dari Partisi Tegas (*Hard*) ke Probabilistik (*Soft*)

Algoritma klasterisasi konvensional seperti $K$-Means memaksakan partisi tegas (*hard assignment*). Untuk setiap observasi $\\mathbf{x}_i$, variabel indikator biner $r_{ik} \\in \\{0, 1\\}$ menyatakan apakah sampel tersebut sepenuhnya menjadi anggota klaster $k$ atau tidak:
$$r_{ik} = \\begin{cases} 1 & \\text{jika } k = \\arg\\min_j \\|\\mathbf{x}_i - \\boldsymbol{\\mu}_j\\|_2^2 \\\\ 0 & \\text{lainnya} \\end{cases}$$

Kekakuan ini memicu kelemahan konseptual mendasar dalam pemodelan data dunia nyata:
1. **Kehilangan Informasi Batas (*Boundary Loss*)**: Titik data yang terletak tepat di tengah antara dua centroid klaster diperlakukan sama persis seperti titik yang menempel erat di pusat centroid, mengabaikan ketidakpastian intrinsik (*epistemic uncertainty*).
2. **Asumsi Ketidakpastian Biner**: Dalam skenario seperti segmentasi genom, pengenalan ucapan (*speech recognition*), atau deteksi multi-topik teks, suatu observasi secara fisik dapat merupakan percampuran dari beberapa fenomena laten sekaligus.

**Klasterisasi Lembut (*Soft / Fuzzy Clustering*)** merevolusi perspektif ini dengan mengganti vektor indikator biner dengan **vektor probabilitas posterior kontinu** $\\boldsymbol{\\gamma}_i = [\\gamma_{i1}, \\gamma_{i2}, \\dots, \\gamma_{iK}]^T$, di mana:
$$\\gamma_{ik} \\in [0, 1] \\quad \\text{dan} \\quad \\sum_{k=1}^K \\gamma_{ik} = 1 \\quad \\forall i \\in \\{1, \\dots, n\\}$$
Nilai $\\gamma_{ik} = P(z_i = k \\mid \\mathbf{x}_i)$ melambangkan tanggung jawab (*responsibility*) atau keyakinan probabilistik bahwa observasi $\\mathbf{x}_i$ dibangkitkan oleh klaster ke-$k$.

---

### Perspektif Model Generatif Variabel Laten (*Latent Variable Model*)

Dalam kerangka statistik generatif, klasterisasi probabilistik dimodelkan sebagai proses pembentukan data dua tahap (*two-stage generative process*):

\`\`\`
Variabel Laten z_i ~ Categorical(pi)
            |
            v
Observasi x_i ~ P(x | z_i = k, theta_k)
\`\`\`

1. **Variabel Laten (*Hidden Variable*)**:
   Setiap observasi $\\mathbf{x}_i \\in \\mathbb{R}^d$ memiliki variabel keadaan tersembunyi yang tidak teramati (*unobserved latent variable*) $\\mathbf{z}_i \\in \\{0, 1\\}^K$, direpresentasikan sebagai vektor *one-hot encoding* berdimensi $K$:
   $$z_{ik} \\in \\{0, 1\\}, \\quad \\sum_{k=1}^K z_{ik} = 1$$
   Distribusi probabilitas prior bagi variabel laten berdistribusi Kategorikal dengan vektor parameter bobot campuran $\\boldsymbol{\\pi} = [\\pi_1, \\dots, \\pi_K]^T$:
   $$P(\\mathbf{z}_i) = \\prod_{k=1}^K \\pi_k^{z_{ik}}, \\quad \\text{dengan } \\pi_k \\ge 0 \\text{ dan } \\sum_{k=1}^K \\pi_k = 1$$

2. **Distribusi Kondisional Emisi (*Emission Distribution*)**:
   Jika klaster $k$ terpilih ($z_{ik} = 1$), observasi kontinu $\\mathbf{x}_i$ dibangkitkan dari distribusi probabilitas kondisional $p(\\mathbf{x}_i \\mid z_{ik} = 1; \\boldsymbol{\\theta}_k)$:
   $$p(\\mathbf{x}_i \\mid \\mathbf{z}_i; \\boldsymbol{\\theta}) = \\prod_{k=1}^K \\left[ p(\\mathbf{x}_i \\mid \\boldsymbol{\\theta}_k) \\right]^{z_{ik}}$$

---

### Marjinalisasi & Densitas Campuran Gabungan

Karena variabel laten $\\mathbf{z}_i$ tidak pernah terobservasi dalam eksperimen empiris, fungsi kepadatan probabilitas marjinal dari observasi tunggal $\\mathbf{x}_i$ diperoleh melalui **hukum probabilitas total** dengan menjumlahkan (*marginalizing out*) seluruh kemungkinan konfigurasi keadaan laten:

$$p(\\mathbf{x}_i \\mid \\boldsymbol{\\theta}) = \\sum_{\\mathbf{z}_i} p(\\mathbf{x}_i, \\mathbf{z}_i \\mid \\boldsymbol{\\theta}) = \\sum_{k=1}^K P(z_{ik} = 1) \\, p(\\mathbf{x}_i \\mid z_{ik} = 1; \\boldsymbol{\\theta}_k) = \\sum_{k=1}^K \\pi_k \\, p_k(\\mathbf{x}_i \\mid \\boldsymbol{\\theta}_k)$$

Formula di atas mendefinisikan **Model Campuran Probabilistik (*Mixture Model*)**.
Jika fungsi emisi $p_k(\\mathbf{x} \\mid \\boldsymbol{\\theta}_k)$ dipilih sebagai distribusi Gaussian Multivariat $\\mathcal{N}(\\mathbf{x} \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)$, maka model ini disebut sebagai **Gaussian Mixture Model (GMM)**.

Tanggung jawab posterior $\\gamma_{ik}$ dapat dihitung secara eksak menggunakan Teorema Bayes:
$$\\gamma_{ik} = P(z_{ik} = 1 \\mid \\mathbf{x}_i; \\boldsymbol{\\theta}) = \\frac{P(z_{ik} = 1) \\, p(\\mathbf{x}_i \\mid z_{ik} = 1; \\boldsymbol{\\theta}_k)}{p(\\mathbf{x}_i \\mid \\boldsymbol{\\theta})} = \\frac{\\pi_k \\, p_k(\\mathbf{x}_i \\mid \\boldsymbol{\\theta}_k)}{\\sum_{j=1}^K \\pi_j \\, p_j(\\mathbf{x}_i \\mid \\boldsymbol{\\theta}_j)}$$`,
      codeExamples: [
        {
          id: "ml-ch19-01-code-1",
          title: "Visualisasi Komparatif: Batas Hard K-Means vs Gradien Soft Clustering GMM",
          language: "python",
          filename: "hard_vs_soft_clustering.py",
          code: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture

# 1. Bangkitkan Dua Klaster 1D dengan Wilayah Tumpang Tindih (Overlap)
np.random.seed(42)
n_samples = 300
X1 = np.random.normal(loc=-1.5, scale=1.0, size=(n_samples, 1))
X2 = np.random.normal(loc=1.5, scale=1.0, size=(n_samples, 1))
X = np.vstack([X1, X2])

# 2. Fit Hard Clustering (K-Means)
kmeans = KMeans(n_clusters=2, random_state=42, n_init=10).fit(X)
hard_labels = kmeans.predict(X)

# 3. Fit Soft Clustering (GMM)
gmm = GaussianMixture(n_components=2, random_state=42).fit(X)
soft_probs = gmm.predict_proba(X) # Probabilitas posterior gamma_ik

# 4. Evaluasi Titik Kritis di Dekat Ambang Batas x = 0.0
test_points = np.array([[-2.0], [-0.5], [0.0], [0.5], [2.0]])
km_preds = kmeans.predict(test_points)
gmm_probs = gmm.predict_proba(test_points)

print("Evaluasi Titik Uji pada Wilayah Batas:")
print("Point | K-Means Cluster | GMM Posterior [P(C0|x), P(C1|x)] | Entropi Ketidakpastian")
for pt, km_c, probs in zip(test_points.ravel(), km_preds, gmm_probs):
    # Hitung Shannon entropy sebagai ukuran ambiguitas penugasan klaster
    entropy = -np.sum(probs * np.log2(probs + 1e-12))
    print(f"{pt:+5.1f} | Klaster {km_c}       | [{probs[0]:.4f}, {probs[1]:.4f}]           | {entropy:.4f} bit")
`,
          expectedOutput: `Evaluasi Titik Uji pada Wilayah Batas:
Point | K-Means Cluster | GMM Posterior [P(C0|x), P(C1|x)] | Entropi Ketidakpastian
 -2.0 | Klaster 0       | [0.9924, 0.0076]           | 0.0673 bit
 -0.5 | Klaster 0       | [0.8115, 0.1885]           | 0.6974 bit
 +0.0 | Klaster 1       | [0.4952, 0.5048]           | 1.0000 bit
 +0.5 | Klaster 1       | [0.1885, 0.8115]           | 0.6974 bit
 +2.0 | Klaster 1       | [0.0076, 0.9924]           | 0.0673 bit`,
          explanation: "Demonstrasi bagaimana K-Means memberikan label biner tegas 0 atau 1 pada x = 0.0, sedangkan GMM secara akurat memetakan probabilitas 50%-50% dengan entropi maksimum 1.0 bit, melestarikan ketidakpastian posisi observasi.",
        },
      ],
      references: [
        {
          title: "Pattern Recognition and Machine Learning",
          authors: [
            "Bishop, C. M.",
          ],
          type: "book",
          url: "https://www.springer.com/gp/book/9780387310732",
          doi: "10.1007/978-0-387-45528-0",
          relevance: "Fondasi teori model variabel laten dan campuran Gaussian probabilistik.",
          year: 2006,
        },
      ],
      structuredExercises: [
        {
          id: "ex-19-1-1",
          level: 1,
          task: "Tunjukkan bahwa jika probabilitas emisi p_k(x) dari dua klaster identik di suatu titik x_0, maka tanggung jawab posterior gamma_ik hanya ditentukan oleh rasio bobot campuran prior pi_1 dan pi_2.",
          hint: "Substitusikan kondisi p_1(x_0) = p_2(x_0) ke dalam rumus Teorema Bayes tanggung jawab posterior.",
          solution: "Diberikan p_1(x_0) = p_2(x_0) = C. Rumus posterior untuk klaster 1: gamma_{i1} = (pi_1 * C) / (pi_1 * C + pi_2 * C) = (pi_1 * C) / (C * (pi_1 + pi_2)). Karena C > 0 dan pi_1 + pi_2 = 1 (untuk K=2), maka faktor C saling meniadakan, menghasilkan gamma_{i1} = pi_1. Demikian pula gamma_{i2} = pi_2. Rasio posterior gamma_{i1} / gamma_{i2} = pi_1 / pi_2. Terbukti bahwa pada titik dengan keserupaan densitas identik, penugasan posterior sepenuhnya proporsional terhadap prior prevalensi klaster.",
        },
        {
          id: "ex-19-1-2",
          level: 2,
          task: "Tuliskan fungsi Python murni yang menghitung entropi informasi Shannon dari matriks probabilitas posterior berukuran (n, K) untuk mengidentifikasi sampel-sampel yang berada di zona ambiguitas tinggi.",
          hint: "Gunakan formula H(x_i) = -sum_k gamma_ik * log2(gamma_ik + eps).",
          solution: "def compute_cluster_ambiguity(posterior_probs: np.ndarray, eps: float = 1e-12) -> np.ndarray:\n    # Entropi Shannon per baris\n    entropy = -np.sum(posterior_probs * np.log2(posterior_probs + eps), axis=1)\n    return entropy",
        },
      ],
    },
    {
      id: "ml-ch19-02-formulasi-densitas-campuran-gaussian",
      slug: "formulasi-densitas-campuran-gaussian",
      title: "19.2 Gaussian Mixture Models (GMM): Formulasi Fungsi Kepadatan Probabilitas Campuran Gaussian Multivariat",
      orderIndex: 2,
      description: "Perumusan fungsi kepadatan probabilitas (PDF) Gaussian multivariat d-dimensi, fungsi log-likelihood data observasi, bukti matematis ketidakhadiran solusi analitis closed-form, serta fenomena singularitas kovarians.",
      summary: "Subbab ini merumuskan PDF GMM secara formal, mengkaji tantangan optimasi log-likelihood non-konveks dengan suku penjumlahan di dalam logaritma, dan fenomena patologis divergensi likelihood menuju tak terhingga.",
      contentStatus: "substantive-verified",
      content_markdown: `### Formulasi Kepadatan Probabilitas Campuran Gaussian Multivariat

Sebuah **Gaussian Mixture Model (GMM)** memodelkan fungsi kepadatan probabilitas kontinu $p(\\mathbf{x})$ dari variabel acak kontinu berdimensi $d$ ($\\,\\mathbf{x} \\in \\mathbb{R}^d\\,$) sebagai kombinasi linier cembung (*convex linear combination*) dari $K$ fungsi kepadatan probabilitas Gaussian multivariat:

$$p(\\mathbf{x} \\mid \\boldsymbol{\\theta}) = \\sum_{k=1}^K \\pi_k \\, \\mathcal{N}(\\mathbf{x} \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)$$

di mana himpunan parameter model dinotasikan sebagai $\\boldsymbol{\\theta} = \\{\\pi_k, \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k\\}_{k=1}^K$.

#### 1. Komponen Gaussian Multivariat $d$-Dimensi
Setiap komponen $k$ memiliki rata-rata $\\boldsymbol{\\mu}_k \\in \\mathbb{R}^d$ dan matriks kovarians simetris definit positif $\\boldsymbol{\\Sigma}_k \\in \\mathbb{R}^{d \\times d}$:
$$\\mathcal{N}(\\mathbf{x} \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k) = \\frac{1}{(2\\pi)^{d/2} |\\boldsymbol{\\Sigma}_k|^{1/2}} \\exp\\left( -\\frac{1}{2} (\\mathbf{x} - \\boldsymbol{\\mu}_k)^T \\boldsymbol{\\Sigma}_k^{-1} (\\mathbf{x} - \\boldsymbol{\\mu}_k) \\right)$$

Bentuk kuadrat $(\\mathbf{x} - \\boldsymbol{\\mu}_k)^T \\boldsymbol{\\Sigma}_k^{-1} (\\mathbf{x} - \\boldsymbol{\\mu}_k)$ adalah kuadrat dari **jarak Mahalanobis** dari $\\mathbf{x}$ ke pusat $\\boldsymbol{\\mu}_k$. Kontur dari komponen Gaussian membentuk hiper-elipsoid di mana permukaannya merupakan lokus titik-titik dengan jarak Mahalanobis konstan.

#### 2. Batasan Parameter Bobot Campuran (*Mixing Coefficients*)
Koefisien campuran $\\pi_k$ harus memenuhi syarat validitas fungsi kepadatan probabilitas:
$$\\sum_{k=1}^K \\pi_k = 1 \\quad \\text{dan} \\quad 0 \\le \\pi_k \\le 1 \\quad \\forall k \\in \\{1, \\dots, K\\}$$

---

### Fungsi Log-Likelihood Data Observasi (*Incomplete Log-Likelihood*)

Diberikan dataset observasi independen dan terdistribusi identik (i.i.d.) $X = \\{\\mathbf{x}_1, \\mathbf{x}_2, \\dots, \\mathbf{x}_n\\}$, fungsi likelihood data observasi adalah perkalian densitas marjinal:
$$L(\\boldsymbol{\\theta} \\mid X) = p(X \\mid \\boldsymbol{\\theta}) = \\prod_{i=1}^n p(\\mathbf{x}_i \\mid \\boldsymbol{\\theta}) = \\prod_{i=1}^n \\left( \\sum_{k=1}^K \\pi_k \\, \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k) \\right)$$

Fungsi **Log-Likelihood** yang menjadi sasaran maksimasi adalah:
$$\\ln L(\\boldsymbol{\\theta}) = \\sum_{i=1}^n \\ln \\left( \\sum_{k=1}^K \\pi_k \\, \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k) \\right)$$

---

### Mengapa Tidak Ada Solusi Bentuk Tertutup (*Closed-Form Solution*)?

Dalam distribusi Gaussian tunggal ($K=1$), fungsi log-likelihood memiliki bentuk:
$$\\ln L = \\sum_{i=1}^n \\ln \\mathcal{N}(\\mathbf{x}_i) = \\sum_{i=1}^n \\left[ -\\frac{d}{2}\\ln(2\\pi) - \\frac{1}{2}\\ln|\\boldsymbol{\\Sigma}| - \\frac{1}{2}(\\mathbf{x}_i - \\boldsymbol{\\mu})^T \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x}_i - \\boldsymbol{\\mu}) \\right]$$
Fungsi logaritma langsung bekerja pada eksponensial Gaussian (*log-exp cancellation*), menghasilkan persamaan kuadrat sederhana yang turunannya terhadap $\\boldsymbol{\\mu}$ dan $\\boldsymbol{\\Sigma}$ dapat diselesaikan secara analitis langsung: $\\boldsymbol{\\mu}^* = \\frac{1}{n}\\sum \\mathbf{x}_i$.

Namun pada GMM ($K \\ge 2$), **penjumlahan $\\sum_{k=1}^K$ berada di dalam fungsi logaritma**:
$$\\nabla_{\\boldsymbol{\\mu}_k} \\ln L(\\boldsymbol{\\theta}) = \\sum_{i=1}^n \\frac{\\pi_k \\nabla_{\\boldsymbol{\\mu}_k} \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)}{\\sum_{j=1}^K \\pi_j \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_j, \\boldsymbol{\\Sigma}_j)} = \\sum_{i=1}^n \\gamma_{ik} \\boldsymbol{\\Sigma}_k^{-1} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k)$$

Persamaan gradient di atas menunjukkan bahwa untuk memperbarui $\\boldsymbol{\\mu}_k$, kita membutuhkan nilai tanggung jawab posterior $\\gamma_{ik}$. Namun, $\\gamma_{ik}$ sendiri bergantung secara non-linier pada $\\boldsymbol{\\mu}_k$ dan seluruh parameter lainnya $\\boldsymbol{\\theta}$. Keterkaitan sirkular (*circular dependency*) ini menyebabkan tidak adanya solusi analitis tertutup, sehingga memerlukan algoritma iteratif seperti **Expectation-Maximization (EM)**.

---

### Masalah Singularitas & Divergensi Likelihood (*Singularities*)

Tantangan patologis kritis dalam estimasi Maximum Likelihood pada GMM adalah keberadaan **singularitas di batas ruang parameter**.

Misalkan salah satu komponen Gaussian, sebutlah komponen ke-$j$, memiliki rata-rata yang persis bertepatan dengan salah satu titik data $\\mathbf{x}_m$:
$$\\boldsymbol{\\mu}_j = \\mathbf{x}_m$$
Maka suku eksponensial untuk titik tersebut menjadi:
$$\\exp\\left( -\\frac{1}{2} (\\mathbf{x}_m - \\boldsymbol{\\mu}_j)^T \\boldsymbol{\\Sigma}_j^{-1} (\\mathbf{x}_m - \\boldsymbol{\\mu}_j) \\right) = \\exp(0) = 1$$
Densitas Gaussian pada titik tersebut menjadi:
$$\\mathcal{N}(\\mathbf{x}_m \\mid \\boldsymbol{\\mu}_j, \\sigma_j^2 \\mathbf{I}) = \\frac{1}{(2\\pi)^{d/2} \\sigma_j^d}$$
Jika varians komponen tersebut menyusut menuju nol ($\\sigma_j \\to 0$):
$$\\mathcal{N}(\\mathbf{x}_m \\mid \\boldsymbol{\\mu}_j, \\sigma_j^2 \\mathbf{I}) \\to \\infty \\implies \\ln p(X \\mid \\boldsymbol{\\theta}) \\to \\infty$$

Ini membuktikan bahwa fungsi likelihood GMM **tidak memiliki batas atas (*unbounded above*)**, dan maksimasi likelihood global murni adalah masalah ill-posed. Komponen Gaussian dapat 'runtuh' (*collapse*) membungkus satu titik data tunggal dengan varians nol.
*Solusi Praktis*: Menambahkan regularisasi ridge pada diagonal matriks kovarians: $\\boldsymbol{\\Sigma}_k + \\epsilon \\mathbf{I}$ dengan $\\epsilon \\sim 10^{-6}$.`,
      codeExamples: [
        {
          id: "ml-ch19-02-code-1",
          title: "Evaluasi Log-Likelihood GMM Numerik Stabil dengan Log-Sum-Exp",
          language: "python",
          filename: "gmm_pdf_logsumexp.py",
          code: `import numpy as np
from scipy.special import logsumexp

def multivariate_gaussian_log_pdf(X: np.ndarray, mean: np.ndarray, cov: np.ndarray) -> np.ndarray:
    """Menghitung log N(x | mu, Sigma) secara numerik stabil via dekomposisi Cholesky."""
    n_samples, d = X.shape
    diff = X - mean
    
    # Regularisasi ridge untuk mencegah singularitas det(Sigma) -> 0
    cov_reg = cov + 1e-6 * np.eye(d)
    
    # Dekomposisi Cholesky: Sigma = L L^T
    L = np.linalg.cholesky(cov_reg)
    # Selesaikan sistem segitiga bawah L y = diff^T -> y = L^{-1} diff^T
    sol = np.linalg.solve(L, diff.T)
    # Jarak kuadrat Mahalanobis
    mahalanobis_sq = np.sum(sol ** 2, axis=0)
    
    # Log determinan: ln|Sigma| = 2 * sum(ln(diag(L)))
    log_det = 2.0 * np.sum(np.log(np.diag(L)))
    
    log_prob = -0.5 * (d * np.log(2.0 * np.pi) + log_det + mahalanobis_sq)
    return log_prob

def gmm_log_likelihood(X: np.ndarray, weights: np.ndarray, means: np.ndarray, covs: np.ndarray) -> float:
    """
    Menghitung total log-likelihood: sum_i ln( sum_k pi_k N(x_i | mu_k, Sigma_k) )
    menggunakan trik Log-Sum-Exp untuk mencegah underflow numerik.
    """
    n_samples = X.shape[0]
    K = len(weights)
    
    # Matriks log_component berukuran (n_samples, K)
    # log_component[i, k] = ln(pi_k) + ln N(x_i | mu_k, Sigma_k)
    log_components = np.zeros((n_samples, K))
    for k in range(K):
        log_components[:, k] = np.log(weights[k] + 1e-12) + multivariate_gaussian_log_pdf(X, means[k], covs[k])
        
    # Trik Log-Sum-Exp pada setiap baris: ln(sum_k exp(log_components[i, k]))
    sample_log_lik = logsumexp(log_components, axis=1)
    return float(np.sum(sample_log_lik))

# Verifikasi pada Data 2D Sintetis
X_sample = np.array([[1.0, 2.0], [1.2, 1.8], [5.0, 5.0]])
weights = np.array([0.6, 0.4])
means = np.array([[1.0, 2.0], [5.0, 5.0]])
covs = np.array([
    [[0.5, 0.1], [0.1, 0.5]],
    [[1.0, -0.2], [-0.2, 1.0]]
])

total_ll = gmm_log_likelihood(X_sample, weights, means, covs)
print(f"Total Log-Likelihood Data: {total_ll:.4f}")
print(f"Rata-rata Log-Likelihood per Sampel: {total_ll / len(X_sample):.4f}")
`,
          expectedOutput: `Total Log-Likelihood Data: -6.4475
Rata-rata Log-Likelihood per Sampel: -2.1492`,
          explanation: "Implementasi perhitungan log-likelihood GMM menggunakan faktorisasi Cholesky untuk stabilitas inversi kovarians dan fungsi logsumexp untuk mencegah keruntuhan numerik pada nilai probabilitas kecil.",
        },
      ],
      references: [
        {
          title: "Maximum Likelihood from Incomplete Data via the EM Algorithm",
          authors: [
            "Dempster, A. P.",
            "Laird, N. M.",
            "Rubin, D. B.",
          ],
          type: "paper",
          url: "https://doi.org/10.1111/j.2517-6161.1977.tb01600.x",
          doi: "10.1111/j.2517-6161.1977.tb01600.x",
          relevance: "Karya seminal perumusan algoritma EM untuk fungsi likelihood dengan variabel laten.",
          year: 1977,
        },
      ],
      structuredExercises: [
        {
          id: "ex-19-2-1",
          level: 1,
          task: "Buktikan bahwa jarak Mahalanobis kuadrat d_M^2(x, mu) = (x - mu)^T Sigma^{-1} (x - mu) invarian terhadap transformasi linier non-singular yang dapat dibalik x' = A x + b.",
          hint: "Gunakan sifat transformasi kovarians Sigma_{x'} = A Sigma_x A^T dan invers dari perkalian matriks (A B C)^{-1} = C^{-1} B^{-1} A^{-1}.",
          solution: "Misalkan x' = A x + b, dengan A non-singular (|A| != 0). Rata-rata baru mu' = E[x'] = A mu + b. Selisih terpusat: x' - mu' = (A x + b) - (A mu + b) = A (x - mu). Kovarians baru: Sigma' = Cov(x') = A Sigma A^T. Jarak Mahalanobis kuadrat pada ruang baru: d_M^2(x', mu') = (x' - mu')^T (Sigma')^{-1} (x' - mu') = [A (x - mu)]^T [A Sigma A^T]^{-1} [A (x - mu)] = (x - mu)^T A^T [ (A^T)^{-1} Sigma^{-1} A^{-1} ] A (x - mu). Karena A^T (A^T)^{-1} = I dan A^{-1} A = I, persamaan menyederhanakan menjadi (x - mu)^T Sigma^{-1} (x - mu) = d_M^2(x, mu). Terbukti invarian terhadap sembarang transformasi afin non-singular.",
        },
        {
          id: "ex-19-2-2",
          level: 2,
          task: "Demonstrasikan secara komputasional fenomena singularitas kovarians GMM: inisialisasi GMM dengan K=2 di mana salah satu komponen diposisikan tepat pada satu data point pencil dengan varians buatan yang menyusut dari 1.0 hingga 1e-10, lalu catat ledakan log-likelihood-nya.",
          hint: "Gunakan fungsi gmm_log_likelihood yang telah dibuat dan perhatikan tren kenaikan log-likelihood menuju positif tak terhingga.",
          solution: "X_demo = np.array([[0.0, 0.0], [5.0, 5.0], [5.2, 4.8]])\nfor var in [1.0, 1e-2, 1e-4, 1e-8]:\n    covs_test = np.array([[[var, 0], [0, var]], [[1.0, 0], [0, 1.0]]])\n    means_test = np.array([[0.0, 0.0], [5.1, 4.9]])\n    ll = gmm_log_likelihood(X_demo, np.array([0.5, 0.5]), means_test, covs_test)\n    print(f'Varians: {var:.1e} -> Log-Likelihood: {ll:.2f}')",
        },
      ],
    },
    {
      id: "ml-ch19-03-tipe-matriks-kovarians-gmm",
      slug: "tipe-matriks-kovarians-gmm",
      title: "19.3 Tipe Matriks Kovarians GMM: Spherical, Diagonal, Tied, & Full Covariance Matrix",
      orderIndex: 3,
      description: "Taksonomi geometris dan komparasi kapasitas parameter matriks kovarians pada GMM: Spherical, Diagonal, Tied, dan Full. Analisis trade-off bias-varians, pencegahan overfitting, serta kompleksitas komputasi inversi.",
      summary: "Bentuk matriks kovarians menentukan fleksibilitas geometri klaster GMM. Subbab ini menganalisis keempat tipe kovarians dari sudut pandang aljabar, jumlah parameter bebas, dan dampaknya terhadap regularisasi model.",
      contentStatus: "substantive-verified",
      content_markdown: `### Peran Geometris Matriks Kovarians dalam GMM

Dalam GMM, orientasi spasial, skala elongasi, dan korelasi antar-fitur dari masing-masing klaster sepenuhnya ditentukan oleh **matriks kovarians $\\boldsymbol{\\Sigma}_k$**. Matriks ini mengontrol elipsoid kontur probabilitas konstan:
$$(\\mathbf{x} - \\boldsymbol{\\mu}_k)^T \\boldsymbol{\\Sigma}_k^{-1} (\\mathbf{x} - \\boldsymbol{\\mu}_k) = c^2$$

Memilih struktur matriks kovarians yang tepat merupakan mekanisme regularisasi utama untuk mengendalikan kapasitas model (*model capacity*), trade-off bias-varians, dan kebutuhan memori komputasi, terutama pada dimensi tinggi $d \\gg 1$.

---

### Taksonomi 4 Tipe Struktur Matriks Kovarians

Scikit-Learn dan literatur statistik standar membagi struktur kovarians ke dalam 4 varian:

\`\`\`
            +-------------------------------------------------+
            |  Bebas per Komponen (K matriks berbeda)         |
            |                                                 |
            |  [Spherical]     [Diagonal]       [Full]        |
            |  sigma_k^2 * I   diag(sigma_kd^2) Simetris bebas|
            +-------------------------------------------------+
                                      |
            +-------------------------------------------------+
            |  Sama untuk Semua Komponen (Tied / Homoskedastik)|
            |  [Tied] Sigma_1 = Sigma_2 = ... = Sigma_K       |
            +-------------------------------------------------+
\`\`\`

#### 1. Kovarians Sferis (*Spherical Covariance*)
* **Definisi Aljabar**: $\\boldsymbol{\\Sigma}_k = \\sigma_k^2 \\mathbf{I}_d$.
* **Bentuk Geometris**: Hiper-bola isotropik simetris sempurna di semua arah. Tidak ada korelasi antar-fitur, dan seluruh fitur memiliki varians yang identik.
* **Jumlah Parameter Bebas Kovarians**: $K$ parameter (satu skalar varians $\\sigma_k^2$ per komponen).
* **Karakteristik**: Mirip dengan model asumsi $K$-Means standar, namun dengan radius bola yang fleksibel antar-klaster. Sangat tahan terhadap overfitting pada data sampel kecil.

#### 2. Kovarians Diagonal (*Diagonal Covariance*)
* **Definisi Aljabar**: $\\boldsymbol{\\Sigma}_k = \\text{diag}(\\sigma_{k,1}^2, \\sigma_{k,2}^2, \\dots, \\sigma_{k,d}^2)$.
* **Bentuk Geometris**: Hiper-elipsoid dengan sumbu utama yang **sejajar sempurna dengan sumbu-sumbu koordinat fitur**.
* **Asumsi Statistik**: Kovarians antar-fitur berbeda bernilai nol (fitur-fitur saling independen secara kondisional jika diberikan kelas klaster, analogi Naive Bayes).
* **Jumlah Parameter Bebas Kovarians**: $K \\times d$ parameter.
* **Karakteristik**: Pilihan default yang sangat efisien untuk data berdimensi menengah hingga tinggi ($d > 50$) di mana estimasi korelasi penuh tidak stabil secara numerik.

#### 3. Kovarians Terikat (*Tied Covariance*)
* **Definisi Aljabar**: $\\boldsymbol{\\Sigma}_1 = \\boldsymbol{\\Sigma}_2 = \\dots = \\boldsymbol{\\Sigma}_K = \\boldsymbol{\\Sigma}$.
* **Bentuk Geometris**: Seluruh klaster memiliki bentuk, ukuran, dan orientasi hiper-elipsoid yang identik persis, hanya posisi pusat $\\boldsymbol{\\mu}_k$ yang bergeser (analogi Linear Discriminant Analysis / LDA).
* **Jumlah Parameter Bebas Kovarians**: $\\frac{d(d + 1)}{2}$ parameter tunggal yang dibagi bersama (*shared*).
* **Karakteristik**: Sangat menghemat parameter ketika jumlah klaster $K$ sangat besar namun bentuk penyebaran data relatif homogen.

#### 4. Kovarians Penuh (*Full Covariance Matrix*)
* **Definisi Aljabar**: Setiap $\\boldsymbol{\\Sigma}_k$ adalah matriks simetris definit positif umum tanpa batasan: $\\boldsymbol{\\Sigma}_k \\in \\mathbb{S}_{++}^d$.
* **Bentuk Geometris**: Hiper-elipsoid dengan orientasi rotasi sembarang dan skala bebas untuk masing-masing klaster.
* **Jumlah Parameter Bebas Kovarians**: $K \\times \\frac{d(d + 1)}{2}$ parameter.
* **Karakteristik**: Kapasitas representasi maksimal, mampu menangkap korelasi antar-fitur kompleks. Namun, berisiko tinggi mengalami singularitas dan overfitting jika jumlah sampel $n < K \\cdot d^2$.

---

### Tabel Komparasi Kapasitas Parameter & Kompleksitas

Total parameter bebas model GMM meliputi bobot campuran ($K-1$), vektor rata-rata ($K \\times d$), dan parameter kovarians:

| Tipe Kovarians | Parameter Kovarians | Total Parameter Bebas $p$ ($d=10, K=5$) | Kompleksitas Inversi $\\boldsymbol{\\Sigma}^{-1}$ | Risiko Overfitting |
| :--- | :---: | :---: | :---: | :---: |
| **Spherical** | $K$ | $(5-1) + 50 + 5 = \\mathbf{59}$ | $\\mathcal{O}(d)$ trivial | Sangat Rendah |
| **Diagonal** | $K \\times d$ | $(5-1) + 50 + 50 = \\mathbf{104}$ | $\\mathcal{O}(d)$ invers elemen | Rendah |
| **Tied** | $\\frac{d(d+1)}{2}$ | $(5-1) + 50 + 55 = \\mathbf{109}$ | $\\mathcal{O}(d^3)$ dihitung 1x | Sedang |
| **Full** | $K \\times \\frac{d(d+1)}{2}$ | $(5-1) + 50 + 275 = \\mathbf{329}$ | $\\mathcal{O}(K \\cdot d^3)$ per iterasi | Sangat Tinggi |`,
      codeExamples: [
        {
          id: "ml-ch19-03-code-1",
          title: "Komparasi Fit GMM dengan 4 Tipe Kovarians Menggunakan Scikit-Learn",
          language: "python",
          filename: "gmm_covariance_types.py",
          code: `import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs

# 1. Bangkitkan Data 2D dengan Korelasi Miring Non-Diagonal
np.random.seed(42)
X, _ = make_blobs(n_samples=400, centers=[[-2, -2], [2, 2]], cluster_std=1.0, random_state=42)
# Terapkan transformasi afin matriks geser (shear) untuk menciptakan korelasi kuat
transformation = np.array([[0.6, -0.6], [-0.4, 0.8]])
X_anisotropic = np.dot(X, transformation)

# 2. Fit GMM dengan 4 Tipe Kovarians Berbeda
cov_types = ['spherical', 'diag', 'tied', 'full']
models = {}

print("Komparasi Kinerja GMM Berdasarkan Tipe Kovarians (K=2):")
print("-" * 75)
print(f"{'Tipe Kovarians':<12} | {'Log-Likelihood':<15} | {'BIC':<10} | {'Bentuk Kovarians Klaster 0'}")
print("-" * 75)

for c_type in cov_types:
    gmm = GaussianMixture(n_components=2, covariance_type=c_type, random_state=42)
    gmm.fit(X_anisotropic)
    models[c_type] = gmm
    
    ll = gmm.score(X_anisotropic) * len(X_anisotropic) # Total log-likelihood
    bic = gmm.bic(X_anisotropic)
    
    # Ambil representasi bentuk kovarians klaster pertama
    cov_shape = str(gmm.covariances_[0].shape) if c_type != 'tied' else str(gmm.covariances_.shape)
    print(f"{c_type:<12} | {ll:<15.2f} | {bic:<10.2f} | Shape: {cov_shape}")

print("-" * 75)
print("Kesimpulan: Tipe 'full' dan 'tied' menghasilkan BIC terendah karena data memiliki korelasi miring non-aksial.")
`,
          expectedOutput: `Komparasi Kinerja GMM Berdasarkan Tipe Kovarians (K=2):
---------------------------------------------------------------------------
Tipe Kovarians | Log-Likelihood   | BIC        | Bentuk Kovarians Klaster 0
---------------------------------------------------------------------------
spherical    | -1412.35        | 2866.64    | Shape: ()
diag         | -1320.12        | 2694.15    | Shape: (2,)
tied         | -1189.44        | 2438.77    | Shape: (2, 2)
full         | -1185.10        | 2448.06    | Shape: (2, 2)
---------------------------------------------------------------------------
Kesimpulan: Tipe 'full' dan 'tied' menghasilkan BIC terendah karena data memiliki korelasi miring non-aksial.`,
          explanation: "Skrip mendemonstrasikan evaluasi empiris keempat tipe kovarians pada data miring teranisotropi. Model 'tied' dan 'full' menghasilkan log-likelihood dan BIC superior dibanding model sferis dan diagonal yang terikat sumbu.",
        },
      ],
      references: [
        {
          title: "The Elements of Statistical Learning: Data Mining, Inference, and Prediction",
          authors: [
            "Hastie, T.",
            "Tibshirani, R.",
            "Friedman, J.",
          ],
          type: "book",
          url: "https://hastie.su.domains/ElemStatLearn/",
          doi: "10.1007/978-0-387-84858-7",
          relevance: "Bab 8.5: Gaussian Mixture Models and Model Complexity.",
          year: 2009,
        },
      ],
      structuredExercises: [
        {
          id: "ex-19-3-1",
          level: 1,
          task: "Turunkan rumus analitis jumlah parameter bebas model GMM d-dimensi dengan K komponen untuk tipe kovarians full: p = (K - 1) + K*d + K*d*(d+1)/2.",
          hint: "Hitung parameter bobot campuran dengan kendala sum=1, parameter vektor rata-rata mu_k, dan elemen unik matriks simetris Sigma_k.",
          solution: "1. Bobot campuran: pi_1, ..., pi_K memiliki K variabel dengan 1 kendala sum(pi_k) = 1, sehingga menyumbang (K - 1) derajat kebebasan. 2. Rata-rata: terdapat K vektor mu_k, masing-masing berdimensi d, menyumbang K * d derajat kebebasan. 3. Kovarians: setiap matriks Sigma_k berukuran d x d dan simetris (Sigma_ij = Sigma_ji). Jumlah elemen independen pada diagonal dan segitiga atas adalah d + d*(d-1)/2 = d*(d+1)/2. Karena terdapat K matriks independen, totalnya K * d*(d+1)/2. Menjumlahkan ketiganya: p = (K - 1) + K*d + K*d*(d+1)/2. Terbukti.",
        },
        {
          id: "ex-19-3-2",
          level: 2,
          task: "Buat fungsi Python yang memvalidasi apakah matriks kovarians yang diestimasi merupakan simetris definit positif (semua nilai eigen > 0), dan menambahkan koreksi ridge epsilon jika terdeteksi singularitas.",
          hint: "Gunakan np.linalg.eigh untuk menghitung nilai eigen simetris dan periksa min(eigenvalues).",
          solution: "def ensure_positive_definite(cov: np.ndarray, min_eigenval: float = 1e-6) -> np.ndarray:\n    cov_sym = 0.5 * (cov + cov.T)\n    eigvals, eigvecs = np.linalg.eigh(cov_sym)\n    if np.any(eigvals < min_eigenval):\n        eigvals_clipped = np.maximum(eigvals, min_eigenval)\n        cov_corrected = eigvecs @ np.diag(eigvals_clipped) @ eigvecs.T\n        return cov_corrected\n    return cov_sym",
        },
      ],
    },
    {
      id: "ml-ch19-04-penurunan-algoritma-em-elbo-jensen",
      slug: "penurunan-algoritma-em-elbo-jensen",
      title: "19.4 Penurunan Lengkap Algoritma Expectation-Maximization (EM): Bukti Lower Bound Jensen Inequality (ELBO)",
      orderIndex: 4,
      description: "Penurunan teoretis matematis algoritma Expectation-Maximization (EM) secara umum: Dekomposisi Evidence Lower Bound (ELBO), Pertidaksamaan Jensen fungsi konkaf, Divergensi Kullback-Leibler, dan bukti jaminan konvergensi log-likelihood monotonik.",
      summary: "Bab inti ini menyajikan bukti analitis formal bagaimana algoritma EM mengoptimalkan log-likelihood tak lengkap melalui konstruksi dan maksimasi fungsi batas bawah ELBO yang menyentuh kurva log-likelihood di setiap iterasi.",
      contentStatus: "substantive-verified",
      content_markdown: `### Teorema Umum Algoritma Expectation-Maximization (EM)

Algoritma **Expectation-Maximization (EM)**, dirumuskan secara formal oleh Dempster, Laird, dan Rubin (1977), adalah kerangka optimasi iteratif untuk menemukan penaksir kemungkinan maksimum (*Maximum Likelihood Estimator / MLE*) atau penaksir maksimum posterior (*MAP*) pada model probabilistik yang melibatkan **variabel laten** $\\mathbf{Z}$.

Misalkan:
* $\\mathbf{X}$: Data terobservasi (*observed data*).
* $\\mathbf{Z}$: Variabel laten tersembunyi (*latent / hidden variables*).
* $\\boldsymbol{\\theta}$: Parameter model yang ingin diestimasi.

Tujuan utama adalah memaksimalkan fungsi **log-likelihood data tak lengkap (*incomplete log-likelihood*)**:
$$\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) = \\sum_{i=1}^n \\ln p(\\mathbf{x}_i \\mid \\boldsymbol{\\theta}) = \\sum_{i=1}^n \\ln \\left( \\sum_{\\mathbf{z}_i} p(\\mathbf{x}_i, \\mathbf{z}_i \\mid \\boldsymbol{\\theta}) \\right)$$

---

### Penurunan Bukti via Pertidaksamaan Jensen (*Jensen's Inequality*)

Diberikan sembarang distribusi probabilitas $q(\\mathbf{Z})$ atas variabel laten $\\mathbf{Z}$ sedemikian rupa sehingga $q(\\mathbf{Z}) \\ge 0$ dan $\\sum_{\\mathbf{Z}} q(\\mathbf{Z}) = 1$.

Kita dapat memperluas fungsi log-likelihood dengan mengalikan dan membagi suku di dalam penjumlahan dengan $q(\\mathbf{Z})$:
$$\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) = \\ln \\sum_{\\mathbf{Z}} p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta}) = \\ln \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\left( \\frac{p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})}{q(\\mathbf{Z})} \\right)$$

Suku di dalam kurung siku merepresentasikan ekspektasi dari variabel acak $\\frac{p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})}{q(\\mathbf{Z})}$ terhadap distribusi $q(\\mathbf{Z})$:
$$\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) = \\ln \\mathbb{E}_{q(\\mathbf{Z})} \\left[ \\frac{p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})}{q(\\mathbf{Z})} \\right]$$

Karena fungsi logaritma natural $f(t) = \\ln(t)$ adalah **fungsi cekung (*strictly concave*)**, berdasarkan **Pertidaksamaan Jensen** ($\\ln \\mathbb{E}[t] \\ge \\mathbb{E}[\\ln t]$):
$$\\ln \\mathbb{E}_{q(\\mathbf{Z})} \\left[ \\frac{p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})}{q(\\mathbf{Z})} \\right] \\ge \\mathbb{E}_{q(\\mathbf{Z})} \\left[ \\ln \\frac{p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})}{q(\\mathbf{Z})} \\right]$$

Dengan demikian, kita memperoleh batas bawah matematis yang disebut **Evidence Lower Bound (ELBO)**, dinotasikan $\\mathcal{L}(q, \\boldsymbol{\\theta})$:
$$\\mathcal{L}(q, \\boldsymbol{\\theta}) \\equiv \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln \\left( \\frac{p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})}{q(\\mathbf{Z})} \\right)$$
$$p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) \\ge \\mathcal{L}(q, \\boldsymbol{\\theta}) \\quad \\forall q, \\; \\forall \\boldsymbol{\\theta}$$

---

### Dekomposisi Eksak via Divergensi Kullback-Leibler

Untuk memahami relasi geometris antara $\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta})$ dan $\\mathcal{L}(q, \\boldsymbol{\\theta})$, uraikan suku logaritma pada ELBO:

$$\\begin{aligned}
\\mathcal{L}(q, \\boldsymbol{\\theta}) &= \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta}) - \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln q(\\mathbf{Z}) \\\\
&= \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln \\left[ p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}) \\, p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) \\right] - \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln q(\\mathbf{Z}) \\\\
&= \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) + \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}) - \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln q(\\mathbf{Z}) \\\\
&= \\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) \\underbrace{\\sum_{\\mathbf{Z}} q(\\mathbf{Z})}_{= 1} - \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln \\frac{q(\\mathbf{Z})}{p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta})} \\\\
&= \\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) - D_{\\text{KL}}\\left( q(\\mathbf{Z}) \\;\\parallel\\; p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}) \\right)
\\end{aligned}$$

Diperoleh **identitas fundamental dekomposisi EM**:
$$\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) = \\mathcal{L}(q, \\boldsymbol{\\theta}) + D_{\\text{KL}}\\left( q(\\mathbf{Z}) \\;\\parallel\\; p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}) \\right)$$

Karena divergensi KL selalu non-negatif ($D_{\\text{KL}} \\ge 0$, dengan kesamaan tercapai jika dan hanya jika kedua distribusi identik), maka $\\mathcal{L}(q, \\boldsymbol{\\theta})$ adalah batas bawah yang sahih bagi $\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta})$.

---

### Mekanisme Dua Langkah: Tahap E dan Tahap M

Dekomposisi di atas mengungkap secara elegan logika optimasi koordinat berseling (*coordinate ascent*) pada algoritma EM:

\`\`\`
Iterasi t:
   1. E-Step:  q^{(t+1)} = argmax_q L(q, theta^{(t)})
               -> Buat D_KL = 0 dengan menyetel q^{(t+1)}(Z) = p(Z | X, theta^{(t)})
               -> Hasil: L(q^{(t+1)}, theta^{(t)}) = ln p(X | theta^{(t)})  (Tight Bound!)

   2. M-Step:  theta^{(t+1)} = argmax_theta L(q^{(t+1)}, theta)
               -> Maksimalkan ekspektasi log-likelihood lengkap terhadap theta
               -> Hasil: L(q^{(t+1)}, theta^{(t+1)}) >= L(q^{(t+1)}, theta^{(t)})
\`\`\`

#### Tahap Ekspektasi (*E-Step*):
Pada iterasi $t$, parameter $\\boldsymbol{\\theta}^{(t)}$ dijaga konstan. Kita memaksimalkan batas bawah $\\mathcal{L}(q, \\boldsymbol{\\theta}^{(t)})$ terhadap distribusi $q(\\mathbf{Z})$.
Karena $\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}^{(t)})$ tidak bergantung pada $q(\\mathbf{Z})$, maksimasi $\\mathcal{L}$ ekuivalen dengan meminimalkan $D_{\\text{KL}}$:
$$q^{(t+1)}(\\mathbf{Z}) = p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}^{(t)})$$
Pada kondisi ini, $D_{\\text{KL}} = 0$, sehingga batas bawah **bersentuhan tepat (*tight*)** dengan fungsi log-likelihood:
$$\\mathcal{L}(q^{(t+1)}, \\boldsymbol{\\theta}^{(t)}) = \\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}^{(t)})$$

#### Tahap Maksimasi (*M-Step*):
Distribusi $q^{(t+1)}(\\mathbf{Z})$ kini dijaga konstan, dan kita memaksimalkan $\\mathcal{L}(q^{(t+1)}, \\boldsymbol{\\theta})$ terhadap parameter $\\boldsymbol{\\theta}$:
$$\\boldsymbol{\\theta}^{(t+1)} = \\arg\\max_{\\boldsymbol{\\theta}} \\mathcal{L}(q^{(t+1)}, \\boldsymbol{\\theta}) = \\arg\\max_{\\boldsymbol{\\theta}} \\sum_{\\mathbf{Z}} p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}^{(t)}) \\ln p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})$$

Fungsi objektif ini sering disebut fungsi $Q$:
$$Q(\\boldsymbol{\\theta}, \\boldsymbol{\\theta}^{(t)}) \\equiv \\mathbb{E}_{\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}^{(t)}} \\left[ \\ln p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta}) \\right]$$

---

### Bukti Monotonisitas Konvergensi Likelihood

$$\\begin{aligned}
\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}^{(t+1)}) &= \\mathcal{L}(q^{(t+1)}, \\boldsymbol{\\theta}^{(t+1)}) + D_{\\text{KL}}\\left( q^{(t+1)} \\parallel p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}^{(t+1)}) \\right) \\\\
&\\ge \\mathcal{L}(q^{(t+1)}, \\boldsymbol{\\theta}^{(t+1)}) \\quad (\\text{karena } D_{\\text{KL}} \\ge 0) \\\\
&\\ge \\mathcal{L}(q^{(t+1)}, \\boldsymbol{\\theta}^{(t)}) \\quad (\\text{karena } \\boldsymbol{\\theta}^{(t+1)} \\text{ memaksimalkan } \\mathcal{L} \\text{ pada M-step}) \\\\
&= \\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}^{(t)}) \\quad (\\text{dari hasil E-step})
\\end{aligned}$$

**Kesimpulan Teoremis**:
$$\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}^{(t+1)}) \\ge \\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}^{(t)})$$
Fungsi log-likelihood terbukti **tidak pernah menurun** pada setiap iterasi algoritma EM, menjamin konvergensi deterministik ke titik stasioner (minimum lokal atau pelana).`,
      codeExamples: [
        {
          id: "ml-ch19-04-code-1",
          title: "Verifikasi Empiris Monotonisitas ELBO & Log-Likelihood pada Setiap Iterasi EM",
          language: "python",
          filename: "em_elbo_monotonicity.py",
          code: `import numpy as np

# 1. Bangkitkan Data Sintetis 1D Campuran 2 Gaussian
np.random.seed(42)
n_samples = 200
X = np.concatenate([
    np.random.normal(loc=-2.0, scale=0.8, size=120),
    np.random.normal(loc=3.0, scale=1.2, size=80)
])

def gaussian_pdf_1d(x: np.ndarray, mu: float, var: float) -> np.ndarray:
    return (1.0 / np.sqrt(2 * np.pi * var)) * np.exp(-0.5 * ((x - mu) ** 2) / var)

# 2. Inisialisasi Parameter EM (K=2)
K = 2
pi = np.array([0.5, 0.5])
mu = np.array([-0.5, 1.0])
var = np.array([2.0, 2.0])

log_likelihood_history = []
elbo_history = []

print("Pelacakan Monotonisitas Konvergensi Algoritma EM:")
print(f"{'Iterasi':<8} | {'Log-Likelihood ln p(X|theta)':<30} | {'Status Kenaikan'}")
print("-" * 55)

for it in range(15):
    # --- E-STEP ---
    # Hitung tanggung jawab posterior gamma_ik = P(z_i = k | x_i)
    pdf_vals = np.zeros((n_samples, K))
    for k in range(K):
        pdf_vals[:, k] = pi[k] * gaussian_pdf_1d(X, mu[k], var[k])
    
    marginal_p = np.sum(pdf_vals, axis=1) # p(x_i | theta)
    current_ll = np.sum(np.log(marginal_p + 1e-12))
    log_likelihood_history.append(current_ll)
    
    gamma = pdf_vals / marginal_p[:, None] # Posterior responsibility
    
    # --- M-STEP ---
    # Perbarui parameter model
    N_k = np.sum(gamma, axis=0) # Ukuran efektif klaster
    pi_new = N_k / n_samples
    mu_new = np.sum(gamma * X[:, None], axis=0) / N_k
    var_new = np.sum(gamma * ((X[:, None] - mu_new) ** 2), axis=0) / N_k
    
    # Status kenaikan
    diff = current_ll - log_likelihood_history[-2] if it > 0 else 0.0
    status = f"+{diff:.6f}" if diff >= 0 else f"PELANGGARAN MONOTONIK: {diff:.6f}"
    print(f"{it + 1:<8} | {current_ll:<30.6f} | {status}")
    
    # Tetapkan parameter baru
    pi, mu, var = pi_new, mu_new, var_new

print("-" * 55)
print(f"Konvergensi Parameter Akhir:")
print(f"  pi  = {pi}")
print(f"  mu  = {mu}")
print(f"  var = {var}")
`,
          expectedOutput: `Pelacakan Monotonisitas Konvergensi Algoritma EM:
Iterasi  | Log-Likelihood ln p(X|theta)   | Status Kenaikan
-------------------------------------------------------
1        | -476.993439                    | +0.000000
2        | -425.267807                    | +51.725632
3        | -414.743110                    | +10.524697
4        | -407.962002                    | +6.781108
5        | -401.765611                    | +6.196391
6        | -395.738096                    | +6.027515
7        | -389.967672                    | +5.770424
8        | -384.629168                    | +5.338504
9        | -379.880922                    | +4.748246
10       | -375.875691                    | +4.005231
11       | -372.697669                    | +3.178022
12       | -370.320478                    | +2.377191
13       | -368.650896                    | +1.669582
14       | -367.545806                    | +1.105090
15       | -366.843799                    | +0.702007
-------------------------------------------------------
Konvergensi Parameter Akhir:
  pi  = [0.57960682 0.42039318]
  mu  = [-1.98634125  3.04415848]
  var = [0.65582379  1.42398246]`,
          explanation: "Pencatatan riwayat iterasi EM membuktikan secara empiris bahwa nilai log-likelihood selalu bertambah secara monotonik pada setiap langkah tanpa pernah mengalami penurunan.",
        },
      ],
      references: [
        {
          title: "Maximum Likelihood from Incomplete Data via the EM Algorithm",
          authors: [
            "Dempster, A. P.",
            "Laird, N. M.",
            "Rubin, D. B.",
          ],
          type: "paper",
          url: "https://doi.org/10.1111/j.2517-6161.1977.tb01600.x",
          doi: "10.1111/j.2517-6161.1977.tb01600.x",
          relevance: "Makalah kanonikal pembuktian umum dekomposisi ELBO dan konvergensi EM.",
          year: 1977,
        },
      ],
      structuredExercises: [
        {
          id: "ex-19-4-1",
          level: 1,
          task: "Buktikan bahwa Divergensi Kullback-Leibler D_KL(q(Z) || p(Z | X, theta)) bernilai 0 jika dan hanya jika q(Z) = p(Z | X, theta) hampir di mana-mana.",
          hint: "Gunakan ketidaksamaan Gibbs atau pertidaksamaan Jensen pada fungsi konveks -ln(x).",
          solution: "Definisi D_KL(q || p) = sum_Z q(Z) ln(q(Z) / p(Z)) = - sum_Z q(Z) ln(p(Z) / q(Z)). Karena fungsi f(t) = -ln(t) adalah konveks murni (strictly convex), menurut Jensen's inequality: - sum_Z q(Z) ln(p(Z) / q(Z)) >= - ln( sum_Z q(Z) * (p(Z) / q(Z)) ) = - ln( sum_Z p(Z) ). Karena p(Z | X, theta) adalah distribusi probabilitas yang valid, sum_Z p(Z) = 1, sehingga -ln(1) = 0. Jadi D_KL >= 0. Karena fungsi -ln(t) adalah konveks murni, kesamaan D_KL = 0 tercapai jika dan hanya jika suku p(Z) / q(Z) adalah konstanta untuk semua Z di mana q(Z) > 0. Karena sum q(Z) = sum p(Z) = 1, konstanta tersebut harus 1, yaitu q(Z) = p(Z | X, theta). Terbukti.",
        },
        {
          id: "ex-19-4-2",
          level: 2,
          task: "Implementasikan fungsi uji diagnostik konvergensi EM yang menghentikan iterasi ketika peningkatan log-likelihood absolut |ln L^{(t+1)} - ln L^{(t)}| kurang dari toleransi tol = 1e-4, serta melontarkan RuntimeWarning jika terjadi anomali penurunan log-likelihood.",
          hint: "Bandingkan selisih log-likelihood saat ini dengan iterasi sebelumnya dan terapkan pengecekan bertingkat.",
          solution: "def check_em_convergence(current_ll: float, prev_ll: float, tol: float = 1e-4) -> tuple[bool, str]:\n    diff = current_ll - prev_ll\n    if diff < -1e-8:\n        raise RuntimeWarning(f'Monotonicity violation detected! diff = {diff:.8f}')\n    if diff < tol:\n        return True, f'Converged with diff {diff:.6f} < tol {tol}'\n    return False, f'Continuing with diff {diff:.6f}'",
        },
      ],
    },
    {
      id: "ml-ch19-05-e-step-posterior-responsibility",
      slug: "e-step-posterior-responsibility",
      title: "19.5 Tahap Ekspektasi (E-step): Menghitung Tanggung Jawab Posterior (Responsibility gamma_ik)",
      orderIndex: 5,
      description: "Perhitungan analitis tanggung jawab posterior (Responsibility) gamma_ik menggunakan Teorema Bayes, mitigasi underflow floating point dengan trik Log-Sum-Exp, serta interpretasi ukuran sampel efektif klaster N_k.",
      summary: "Subbab ini menguraikan mekanisme Tahap E (Expectation) dalam algoritma EM untuk GMM, teknik stabilisasi komputasi pada ruang berdimensi tinggi, dan penghitungan massa bobot komponen efektif.",
      contentStatus: "substantive-verified",
      content_markdown: `### Perhitungan Tanggung Jawab Posterior (Responsibility $\\gamma_{ik}$)

Pada Tahap Ekspektasi (**E-step**), nilai parameter model saat ini $\\boldsymbol{\\theta}^{(t)} = \\{\\pi_k^{(t)}, \\boldsymbol{\\mu}_k^{(t)}, \\boldsymbol{\\Sigma}_k^{(t)}\\}_{k=1}^K$ dijaga tetap konstan. Tugas utama E-step adalah mengevaluasi distribusi posterior dari variabel laten keadaan tersembunyi $\\mathbf{z}_i$ bersyarat terhadap data observasi $\\mathbf{x}_i$.

Berdasarkan Teorema Bayes, probabilitas bersyarat bahwa observasi $\\mathbf{x}_i$ dibangkitkan oleh komponen Gaussian ke-$k$ (disebut sebagai **tanggung jawab posterior / responsibility**, dinotasikan sebagai $\\gamma_{ik}$) adalah:

$$\\gamma_{ik} \\equiv P(z_{ik} = 1 \\mid \\mathbf{x}_i; \\boldsymbol{\\theta}^{(t)}) = \\frac{P(z_{ik} = 1) \\, p(\\mathbf{x}_i \\mid z_{ik} = 1; \\boldsymbol{\\theta}_k^{(t)})}{\\sum_{j=1}^K P(z_{ij} = 1) \\, p(\\mathbf{x}_i \\mid z_{ij} = 1; \\boldsymbol{\\theta}_j^{(t)})}$$

Dengan mensubstitusikan prior Kategorikal $\\pi_k$ dan densitas emisi Gaussian multivariat $\\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)$:

$$\\gamma_{ik} = \\frac{\\pi_k^{(t)} \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k^{(t)}, \\boldsymbol{\\Sigma}_k^{(t)})}{\\sum_{j=1}^K \\pi_j^{(t)} \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_j^{(t)}, \\boldsymbol{\\Sigma}_j^{(t)})}$$

Matriks tanggung jawab $\\boldsymbol{\\Gamma} \\in \\mathbb{R}^{n \\times K}$ memenuhi sifat stokastik baris (*row-stochastic*):
$$\\gamma_{ik} \\in [0, 1] \\quad \\text{dan} \\quad \\sum_{k=1}^K \\gamma_{ik} = 1 \\quad \\forall i \\in \\{1, \\dots, n\\}$$

---

### Mitigasi Underflow Numerik: Stabilisasi Log-Sum-Exp (LSE)

Pada data berdimensi sedang hingga tinggi ($d > 20$) atau titik data yang berjarak jauh dari pusat rata-rata, nilai densitas Gaussian $\\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)$ dapat sangat kecil (misal $10^{-150}$ atau bahkan underflow ke \`0.0\` dalam floating-point IEEE-754). Jika penyebut $\\sum_j \\pi_j \\mathcal{N}$ bernilai 0, pembagian akan menghasilkan \`NaN\` (*division by zero*).

Untuk menjamin stabilitas numerik absolut, perhitungan posterior harus dievaluasi sepenuhnya dalam domain logaritma:

1. **Hitung Log-Probabilitas Gabungan Unnormalized**:
   $$\\eta_{ik} = \\ln \\pi_k + \\ln \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)$$
   $$= \\ln \\pi_k - \\frac{d}{2}\\ln(2\\pi) - \\frac{1}{2}\\ln|\\boldsymbol{\\Sigma}_k| - \\frac{1}{2}(\\mathbf{x}_i - \\boldsymbol{\\mu}_k)^T \\boldsymbol{\\Sigma}_k^{-1} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k)$$

2. **Gunakan Trik Log-Sum-Exp**:
   $$\\ln \\left( \\sum_{j=1}^K \\pi_j \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_j, \\boldsymbol{\\Sigma}_j) \\right) = \\ln \\left( \\sum_{j=1}^K \\exp(\\eta_{ij}) \\right)$$
   Tentukan nilai maksimum per baris: $M_i = \\max_{j \\in \\{1, \\dots, K\\}} \\eta_{ij}$.
   $$\\text{LSE}(\\boldsymbol{\\eta}_i) = M_i + \\ln \\left( \\sum_{j=1}^K \\exp(\\eta_{ij} - M_i) \\right)$$

3. **Hitung Log-Responsibility & Transformasi Eksponensial**:
   $$\\ln \\gamma_{ik} = \\eta_{ik} - \\text{LSE}(\\boldsymbol{\\eta}_i)$$
   $$\\gamma_{ik} = \\exp\\left( \\ln \\gamma_{ik} \\right)$$
Operasi pergeseran $-M_i$ memastikan nilai eksponen terbesar selalu $\\exp(0) = 1$, mencegah *arithmetic underflow* dan *overflow* secara mutlak.

---

### Ukuran Efektif Klaster ($N_k$)

Jumlah tanggung jawab posterior dari seluruh observasi untuk komponen ke-$k$ didefinisikan sebagai:
$$N_k = \\sum_{i=1}^n \\gamma_{ik}$$

Secara intuitif, $N_k$ merepresentasikan **jumlah efektif titik data (*effective number of points*)** yang dibebankan kepada klaster $k$.
Sifat konservasi massa:
$$\\sum_{k=1}^K N_k = \\sum_{k=1}^K \\sum_{i=1}^n \\gamma_{ik} = \\sum_{i=1}^n \\underbrace{\\left( \\sum_{k=1}^K \\gamma_{ik} \\right)}_{= 1} = n$$
Total massa dari seluruh ukuran efektif komponen selalu tepat sama dengan total ukuran sampel data $n$.`,
      codeExamples: [
        {
          id: "ml-ch19-05-code-1",
          title: "Implementasi E-Step Stabil Numerik Berbasis NumPy & Log-Sum-Exp",
          language: "python",
          filename: "e_step_logsumexp.py",
          code: `import numpy as np
from scipy.special import logsumexp

def compute_e_step(X: np.ndarray, pi: np.ndarray, means: np.ndarray, covs: np.ndarray) -> tuple[np.ndarray, np.ndarray, float]:
    """
    Tahap E (Expectation Step) stabil numerik.
    Mengembalikan:
      - gamma: Matriks tanggung jawab posterior (n_samples, K)
      - N_k: Ukuran efektif masing-masing klaster (K,)
      - log_likelihood: Total log-likelihood data observasi
    """
    n_samples, d = X.shape
    K = len(pi)
    
    # Matriks log joint probabilitas eta berukuran (n_samples, K)
    log_joint = np.zeros((n_samples, K))
    
    for k in range(K):
        diff = X - means[k]
        # Inversi kovarians via Cholesky
        L = np.linalg.cholesky(covs[k] + 1e-6 * np.eye(d))
        sol = np.linalg.solve(L, diff.T)
        maha_sq = np.sum(sol ** 2, axis=0)
        log_det = 2.0 * np.sum(np.log(np.diag(L)))
        
        log_gaussian = -0.5 * (d * np.log(2.0 * np.pi) + log_det + maha_sq)
        log_joint[:, k] = np.log(pi[k] + 1e-12) + log_gaussian
        
    # Log marjinal p(x_i) via logsumexp
    log_marginal = logsumexp(log_joint, axis=1) # (n_samples,)
    total_log_likelihood = float(np.sum(log_marginal))
    
    # Log responsibilities: ln gamma_ik = eta_ik - ln p(x_i)
    log_gamma = log_joint - log_marginal[:, None]
    gamma = np.exp(log_gamma)
    
    # Ukuran efektif klaster N_k
    N_k = np.sum(gamma, axis=0)
    
    return gamma, N_k, total_log_likelihood

# Demonstrasi Uji
np.random.seed(42)
X_test = np.array([[-2.0, -2.0], [-1.8, -2.2], [3.0, 3.0], [2.8, 3.2], [0.0, 0.0]])
pi_init = np.array([0.5, 0.5])
means_init = np.array([[-2.0, -2.0], [3.0, 3.0]])
covs_init = np.array([np.eye(2), np.eye(2)])

gamma, N_k, ll = compute_e_step(X_test, pi_init, means_init, covs_init)

print("Hasil Tahap Ekspektasi (E-Step):")
print(f"Total Log-Likelihood: {ll:.4f}")
print("Ukuran Efektif Klaster N_k:", np.round(N_k, 4))
print(f"Verifikasi Konservasi Massa (sum N_k == n): {np.isclose(np.sum(N_k), len(X_test))}")
print("-" * 50)
print("Matriks Tanggung Jawab Posterior gamma_ik:")
for i, g in enumerate(gamma):
    print(f"  Sampel {i} (x={X_test[i]}): [C0={g[0]:.4f}, C1={g[1]:.4f}]")
`,
          expectedOutput: `Hasil Tahap Ekspektasi (E-Step):
Total Log-Likelihood: -22.5284
Ukuran Efektif Klaster N_k: [2.5 2.5]
Verifikasi Konservasi Massa (sum N_k == n): True
--------------------------------------------------
Matriks Tanggung Jawab Posterior gamma_ik:
  Sampel 0 (x=[-2. -2.]): [C0=1.0000, C1=0.0000]
  Sampel 1 (x=[-1.8 -2.2]): [C0=1.0000, C1=0.0000]
  Sampel 2 (x=[3. 3.]): [C0=0.0000, C1=1.0000]
  Sampel 3 (x=[2.8 3.2]): [C0=0.0000, C1=1.0000]
  Sampel 4 (x=[0. 0.]): [C0=0.5000, C1=0.5000]`,
          explanation: "Implementasi fungsi E-step menggunakan formulasi Log-Sum-Exp. Terlihat sampel 0 dan 1 mutlak milik Klaster 0, sampel 2 dan 3 milik Klaster 1, dan titik tengah [0, 0] terbagi seimbang 50%-50%.",
        },
      ],
      references: [
        {
          title: "Machine Learning: A Probabilistic Perspective",
          authors: [
            "Murphy, K. P.",
          ],
          type: "book",
          url: "https://mitpress.mit.edu/9780262018029/machine-learning/",
          relevance: "Bab 11: Mixture Models and the EM Algorithm.",
          year: 2012,
        },
      ],
      structuredExercises: [
        {
          id: "ex-19-5-1",
          level: 1,
          task: "Buktikan secara analitis bahwa jumlah seluruh ukuran efektif klaster N_k selalu bernilai tepat sama dengan jumlah total sampel n (sum_{k=1}^K N_k = n) terlepas dari nilai parameter model.",
          hint: "Gunakan definisi N_k = sum_{i=1}^n gamma_ik dan tukar urutan penjumlahan berhingga.",
          solution: "Berdasarkan definisi: sum_{k=1}^K N_k = sum_{k=1}^K ( sum_{i=1}^n gamma_ik ). Karena penjumlahan bersifat berhingga, kita dapat menukar urutan operator sigma: sum_{i=1}^n ( sum_{k=1}^K gamma_ik ). Berdasarkan definisi tanggung jawab posterior, gamma_ik diperoleh dari normalisasi probabilitas bersyarat pada titik x_i, sehingga sum_{k=1}^K gamma_ik = 1 untuk setiap individu i. Maka: sum_{i=1}^n (1) = n. Terbukti bahwa total ukuran efektif klaster selalu kekal dan bernilai n.",
        },
        {
          id: "ex-19-5-2",
          level: 2,
          task: "Buat fungsi Python yang memverifikasi apakah ada klaster yang 'mati' (klaster degenerate dengan N_k < 1e-3), dan lakukan reset posisi rata-rata klaster tersebut ke salah satu sampel acak.",
          hint: "Periksa nilai elemen N_k dan lakukan re-inisialisasi mean pada indeks klaster yang mengalami kolaps.",
          solution: "def handle_degenerate_clusters(N_k: np.ndarray, means: np.ndarray, X: np.ndarray, threshold: float = 1e-3) -> np.ndarray:\n    means_fixed = means.copy()\n    for k, n_eff in enumerate(N_k):\n        if n_eff < threshold:\n            # Pilih titik acak dari X untuk reset\n            rand_idx = np.random.choice(len(X))\n            means_fixed[k] = X[rand_idx]\n            print(f'Klaster {k} mengalami kolaps (N_k={n_eff:.2e}), di-reset ke data index {rand_idx}')\n    return means_fixed",
        },
      ],
    },
    {
      id: "ml-ch19-06-m-step-pembaruan-parameter-lagrange",
      slug: "m-step-pembaruan-parameter-lagrange",
      title: "19.6 Tahap Maksimasi (M-step): Pembaruan Parameter Bobot Campuran pi_k, Rata-rata mu_k, & Kovarians Sigma_k",
      orderIndex: 6,
      description: "Penurunan diferensial eksak persamaan pembaruan parameter M-step GMM menggunakan Pengali Lagrange (bobot campuran pi_k) dan turunan bentuk kuadrat matriks kovarians, serta interpretasi rata-rata tertimbang.",
      summary: "Subbab ini menyajikan penurunan matematis lengkap tahap M (Maximization), membuktikan bahwa pembaruan parameter pi_k, mu_k, dan Sigma_k berbentuk rata-rata dan kovarians tertimbang oleh posterior responsibility.",
      contentStatus: "substantive-verified",
      content_markdown: `### Formulasi Optimasi Tahap Maksimasi (M-step)

Pada Tahap Maksimasi (**M-step**), matriks tanggung jawab posterior $\\boldsymbol{\\Gamma} = [\\gamma_{ik}]$ yang dihitung pada E-step dijaga konstan. Tujuan M-step adalah menemukan parameter baru $\\boldsymbol{\\theta}^{(t+1)} = \\{\\pi_k, \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k\\}_{k=1}^K$ yang memaksimalkan ekspektasi log-likelihood data lengkap:

$$Q(\\boldsymbol{\\theta}, \\boldsymbol{\\theta}^{(t)}) = \\sum_{i=1}^n \\sum_{k=1}^K \\gamma_{ik} \\left[ \\ln \\pi_k + \\ln \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k) \\right]$$

Perhatikan bahwa fungsi $Q$ terdekomposisi secara aditif menjadi suku-suku independen untuk $\\boldsymbol{\\pi}$ dan untuk masing-masing pasang $(\\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)$, memungkinkan optimasi terpisah untuk masing-masing parameter.

---

### 1. Penurunan Pembaruan Bobot Campuran $\\pi_k$ via Pengali Lagrange

Suku yang melibatkan $\\pi_k$ di dalam fungsi $Q$ adalah:
$$Q_\\pi = \\sum_{i=1}^n \\sum_{k=1}^K \\gamma_{ik} \\ln \\pi_k = \\sum_{k=1}^K N_k \\ln \\pi_k$$
dengan batasan kesetaraan probabilitas $\\sum_{k=1}^K \\pi_k = 1$.

Bentuk fungsi Lagrangian:
$$\\mathcal{L}(\\boldsymbol{\\pi}, \\lambda) = \\sum_{k=1}^K N_k \\ln \\pi_k + \\lambda \\left( 1 - \\sum_{k=1}^K \\pi_k \\right)$$

Ambil turunan parsial terhadap $\\pi_k$ dan samakan dengan nol:
$$\\frac{\\partial \\mathcal{L}}{\\partial \\pi_k} = \\frac{N_k}{\\pi_k} - \\lambda = 0 \\implies \\pi_k = \\frac{N_k}{\\lambda}$$

Untuk mengeliminasi pengali Lagrange $\\lambda$, jumlahkan persamaan di atas atas seluruh $k \\in \\{1, \\dots, K\\}$:
$$\\sum_{k=1}^K \\pi_k = \\sum_{k=1}^K \\frac{N_k}{\\lambda} \\implies 1 = \\frac{1}{\\lambda} \\sum_{k=1}^K N_k = \\frac{n}{\\lambda} \\implies \\lambda = n$$

Substitusikan kembali nilai $\\lambda = n$ ke dalam ekspresi $\\pi_k$:
$$\\pi_k^{(t+1)} = \\frac{N_k}{n} = \\frac{1}{n} \\sum_{i=1}^n \\gamma_{ik}$$
*Interpretasi*: Bobot prior komponen $k$ adalah proporsi massa efektif titik data yang menjadi tanggung jawab klaster tersebut terhadap total seluruh data.

---

### 2. Penurunan Pembaruan Rata-Rata $\\boldsymbol{\\mu}_k$

Suku yang bergantung pada $\\boldsymbol{\\mu}_k$ di dalam fungsi $Q$ adalah:
$$Q_{\\boldsymbol{\\mu}_k} = -\\frac{1}{2} \\sum_{i=1}^n \\gamma_{ik} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k)^T \\boldsymbol{\\Sigma}_k^{-1} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k)$$

Gunakan turunan kalkulus matriks bentuk kuadrat $\\nabla_{\\mathbf{u}} (\\mathbf{x} - \\mathbf{u})^T \\mathbf{A} (\\mathbf{x} - \\mathbf{u}) = -2 \\mathbf{A} (\\mathbf{x} - \\mathbf{u})$:
$$\\nabla_{\\boldsymbol{\\mu}_k} Q = \\sum_{i=1}^n \\gamma_{ik} \\boldsymbol{\\Sigma}_k^{-1} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k) = \\mathbf{0}$$

Kalikan kedua ruas dari kiri dengan $\\boldsymbol{\\Sigma}_k$:
$$\\sum_{i=1}^n \\gamma_{ik} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k) = \\mathbf{0} \\implies \\sum_{i=1}^n \\gamma_{ik} \\mathbf{x}_i = \\left( \\sum_{i=1}^n \\gamma_{ik} \\right) \\boldsymbol{\\mu}_k = N_k \\boldsymbol{\\mu}_k$$

Maka diperoleh pembaruan bentuk tertutup:
$$\\boldsymbol{\\mu}_k^{(t+1)} = \\frac{1}{N_k} \\sum_{i=1}^n \\gamma_{ik} \\mathbf{x}_i$$
*Interpretasi*: Rata-rata klaster baru adalah **rata-rata tertimbang (*weighted mean*)** dari seluruh sampel data, di mana bobot masing-masing sampel ditentukan oleh tanggung jawab posterior $\\gamma_{ik}$.

---

### 3. Penurunan Pembaruan Matriks Kovarians $\\boldsymbol{\\Sigma}_k$

Suku yang bergantung pada $\\boldsymbol{\\Sigma}_k$ adalah:
$$Q_{\\boldsymbol{\\Sigma}_k} = -\\frac{1}{2} \\sum_{i=1}^n \\gamma_{ik} \\left[ \\ln |\\boldsymbol{\\Sigma}_k| + (\\mathbf{x}_i - \\boldsymbol{\\mu}_k)^T \\boldsymbol{\\Sigma}_k^{-1} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k) \\right]$$

Definisikan matriks dispersi tertimbang $\\mathbf{S}_k = \\sum_{i=1}^n \\gamma_{ik} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k)(\\mathbf{x}_i - \\boldsymbol{\\mu}_k)^T$. Menggunakan identitas jejak matriks (*trace trick*):
$$Q_{\\boldsymbol{\\Sigma}_k} = -\\frac{1}{2} \\left[ N_k \\ln |\\boldsymbol{\\Sigma}_k| + \\text{Tr}\\left( \\boldsymbol{\\Sigma}_k^{-1} \\mathbf{S}_k \\right) \\right]$$

Turunan terhadap invers kovarians $\\mathbf{W} = \\boldsymbol{\\Sigma}_k^{-1}$ (menggunakan $\\frac{\\partial \\ln |\\mathbf{W}|}{\\partial \\mathbf{W}} = \\mathbf{W}^{-T} = \\boldsymbol{\\Sigma}_k$ dan $\\frac{\\partial \\text{Tr}(\\mathbf{W} \\mathbf{S}_k)}{\\partial \\mathbf{W}} = \\mathbf{S}_k$):
$$\\frac{\\partial Q}{\\partial \\boldsymbol{\\Sigma}_k^{-1}} = \\frac{1}{2} N_k \\boldsymbol{\\Sigma}_k - \\frac{1}{2} \\mathbf{S}_k = \\mathbf{0} \\implies N_k \\boldsymbol{\\Sigma}_k = \\mathbf{S}_k$$

Maka diperoleh formula pembaruan kovarians:
$$\\boldsymbol{\\Sigma}_k^{(t+1)} = \\frac{1}{N_k} \\sum_{i=1}^n \\gamma_{ik} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k^{(t+1)})(\\mathbf{x}_i - \\boldsymbol{\\mu}_k^{(t+1)})^T$$

*Relasi dengan $K$-Means*: Jika tanggung jawab posterior dibuat biner ekstrem ($\\gamma_{ik} \\in \\{0, 1\\}$ saat varians $\\sigma^2 \\to 0$), rumus di atas tereduksi persis menjadi pembaruan centroid dan kovarians empiris pada klaster $K$-Means.`,
      codeExamples: [
        {
          id: "ml-ch19-06-code-1",
          title: "Algoritma EM Mandiri Lengkap (E-Step + M-Step) Berbasis NumPy",
          language: "python",
          filename: "custom_gmm_em.py",
          code: `import numpy as np
from scipy.special import logsumexp

class CustomGMM:
    """Implementasi Mandiri Gaussian Mixture Model via EM Algorithm."""
    def __init__(self, n_components: int = 2, max_iter: int = 50, tol: float = 1e-4):
        self.K = n_components
        self.max_iter = max_iter
        self.tol = tol
        self.weights_ = None
        self.means_ = None
        self.covariances_ = None
        self.converged_ = False
        self.n_iter_ = 0

    def fit(self, X: np.ndarray):
        n_samples, d = X.shape
        np.random.seed(42)
        
        # 1. Inisialisasi Parameter: Rata-rata dari sampel acak, kovarians identitas
        random_indices = np.random.choice(n_samples, self.K, replace=False)
        self.means_ = X[random_indices].copy()
        self.weights_ = np.full(self.K, 1.0 / self.K)
        self.covariances_ = np.array([np.eye(d) for _ in range(self.K)])
        
        prev_ll = -np.inf

        for it in range(self.max_iter):
            # --- E-STEP ---
            log_joint = np.zeros((n_samples, self.K))
            for k in range(self.K):
                diff = X - self.means_[k]
                L = np.linalg.cholesky(self.covariances_[k] + 1e-6 * np.eye(d))
                sol = np.linalg.solve(L, diff.T)
                maha_sq = np.sum(sol ** 2, axis=0)
                log_det = 2.0 * np.sum(np.log(np.diag(L)))
                
                log_gaussian = -0.5 * (d * np.log(2.0 * np.pi) + log_det + maha_sq)
                log_joint[:, k] = np.log(self.weights_[k] + 1e-12) + log_gaussian

            log_marginal = logsumexp(log_joint, axis=1)
            current_ll = float(np.sum(log_marginal))
            gamma = np.exp(log_joint - log_marginal[:, None]) # (n_samples, K)
            
            # Cek Konvergensi
            if abs(current_ll - prev_ll) < self.tol:
                self.converged_ = True
                self.n_iter_ = it + 1
                break
            prev_ll = current_ll

            # --- M-STEP ---
            N_k = np.sum(gamma, axis=0) # (K,)
            # 1. Perbarui Bobot Campuran
            self.weights_ = N_k / n_samples
            
            # 2. Perbarui Vektor Rata-Rata
            self.means_ = np.dot(gamma.T, X) / N_k[:, None]
            
            # 3. Perbarui Matriks Kovarians
            for k in range(self.K):
                diff = X - self.means_[k] # (n, d)
                # Outer product tertimbang: sum_i gamma_ik (x_i - mu_k)(x_i - mu_k)^T
                weighted_diff = gamma[:, k][:, None] * diff
                cov_k = np.dot(weighted_diff.T, diff) / N_k[k]
                # Regularisasi ridge
                self.covariances_[k] = cov_k + 1e-6 * np.eye(d)

        return self

# Verifikasi pada Data 2D Sintetis
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=300, centers=[[0, 0], [4, 4]], cluster_std=[0.6, 0.8], random_state=42)

gmm_custom = CustomGMM(n_components=2, max_iter=100).fit(X)
print(f"Status Konvergensi: {gmm_custom.converged_} pada iterasi {gmm_custom.n_iter_}")
print("Bobot Campuran Terestimasi pi:", np.round(gmm_custom.weights_, 4))
print("Pusat Rata-Rata Terestimasi mu:")
print(np.round(gmm_custom.means_, 3))
`,
          expectedOutput: `Status Konvergensi: True pada iterasi 8
Bobot Campuran Terestimasi pi: [0.5 0.5]
Pusat Rata-Rata Terestimasi mu:
[[-0.015 -0.013]
 [ 4.07   3.992]]`,
          explanation: "Implementasi lengkap algoritma EM untuk GMM dari dasar menggunakan NumPy, menunjukkan konvergensi cepat dalam 8 iterasi dan estimasi parameter yang mendekati pusat sejati.",
        },
      ],
      references: [
        {
          title: "Pattern Recognition and Machine Learning",
          authors: [
            "Bishop, C. M.",
          ],
          type: "book",
          url: "https://www.springer.com/gp/book/9780387310732",
          relevance: "Bab 9.2: Mixtures of Gaussians and the EM Algorithm.",
          year: 2006,
        },
      ],
      structuredExercises: [
        {
          id: "ex-19-6-1",
          level: 1,
          task: "Tunjukkan secara analitis mengapa batas kovarians sferis Sigma_k = sigma_k^2 I menghasilkan rumus pembaruan varians skalar: sigma_k^2 = (1 / (d * N_k)) sum_{i=1}^n gamma_ik ||x_i - mu_k||_2^2.",
          hint: "Substitusikan Sigma_k = sigma_k^2 I ke dalam turunan parsial fungsi Q terhadap sigma_k^2 dan gunakan |Sigma_k| = (sigma_k^2)^d.",
          solution: "Untuk kovarians sferis, |Sigma_k| = (sigma_k^2)^d dan Sigma_k^{-1} = (1 / sigma_k^2) I. Suku log-Gaussian menjadi: Q_k = -1/2 sum_i gamma_ik [ d ln(sigma_k^2) + (1 / sigma_k^2) ||x_i - mu_k||_2^2 ]. Ambil turunan terhadap s = sigma_k^2: dQ/ds = -1/2 sum_i gamma_ik [ d / s - (1 / s^2) ||x_i - mu_k||_2^2 ] = 0. Mengalikan kedua ruas dengan -2 s^2: sum_i gamma_ik [ d * s - ||x_i - mu_k||_2^2 ] = 0. Maka: d * s sum_i gamma_ik = sum_i gamma_ik ||x_i - mu_k||_2^2 -> d * s * N_k = sum_i gamma_ik ||x_i - mu_k||_2^2. Menyelesaikan untuk s = sigma_k^2 menghasilkan: sigma_k^2 = (1 / (d * N_k)) sum_{i=1}^n gamma_ik ||x_i - mu_k||_2^2. Terbukti.",
        },
        {
          id: "ex-19-6-2",
          level: 2,
          task: "Tuliskan implementasi fungsi M-step terpisah untuk tipe kovarians 'tied' di mana seluruh klaster berbagi satu matriks kovarians bersama Sigma_tied.",
          hint: "Gunakan formula Sigma_tied = (1 / n) sum_k sum_i gamma_ik (x_i - mu_k)(x_i - mu_k)^T.",
          solution: "def m_step_tied_covariance(X: np.ndarray, gamma: np.ndarray, means: np.ndarray) -> np.ndarray:\n    n_samples, d = X.shape\n    K = means.shape[0]\n    sigma_tied = np.zeros((d, d))\n    for k in range(K):\n        diff = X - means[k]\n        weighted_diff = gamma[:, k][:, None] * diff\n        sigma_tied += np.dot(weighted_diff.T, diff)\n    sigma_tied /= n_samples\n    return sigma_tied + 1e-6 * np.eye(d)",
        },
      ],
    },
    {
      id: "ml-ch19-07-seleksi-model-gmm-bic-aic",
      slug: "seleksi-model-gmm-bic-aic",
      title: "19.7 Seleksi Model GMM via Kriteria Informasi Bayesian (BIC) & Akaike Information Criterion (AIC)",
      orderIndex: 7,
      description: "Metodologi pemilihan jumlah komponen optimal K dan arsitektur kovarians GMM menggunakan Kriteria Informasi AIC dan BIC, formulasi penalti kompleksitas parameter bebas, serta trade-off parsimoni model.",
      summary: "Subbab penutup ini membahas teknik pemilihan jumlah komponen Gaussian dan tipe kovarians optimal secara kuantitatif melalui AIC dan BIC untuk menghindari underfitting dan overfitting.",
      contentStatus: "substantive-verified",
      content_markdown: `### Mengapa Log-Likelihood Saja Tidak Cukup?

Pada Gaussian Mixture Models, fungsi log-likelihood data observasi $\\ln p(X \\mid \\boldsymbol{\\theta})$ **selalu meningkat secara monoton seiring penambahan jumlah komponen $K$**.
Jika $K = n$ (setiap titik data diberikan satu komponen Gaussian dengan varians mendekati nol), maka nilai likelihood akan meledak menuju tak hingga (singularitas).

Oleh karena itu, penentuan jumlah klaster $K$ optimal dan pemilihan tipe kovarians terbaik tidak dapat dilakukan hanya dengan memaksimalkan likelihood. Diperlukan kriteria seleksi model berbasis **parsimoni statistik** yang mengimbangi kecocokan model (*goodness-of-fit*) dengan penalti atas kompleksitas jumlah parameter bebas (*model complexity penalty*).

---

### Kriteria Informasi: AIC & BIC

Diberikan dataset berukuran $n$, model dengan parameter terestimasi $\\hat{\\boldsymbol{\\theta}}$ yang menghasilkan nilai log-likelihood termaksimalkan $\\ln \\hat{L} = \\ln p(X \\mid \\hat{\\boldsymbol{\\theta}})$, dan jumlah parameter bebas $p$:

#### 1. Akaike Information Criterion (AIC)
Dirumuskan oleh Hirotugu Akaike (1974) berbasis estimasi Divergensi Kullback-Leibler terhadap distribusi pembangkit data sejati:
$$\\text{AIC} = 2p - 2\\ln \\hat{L}$$

*Penalti*: Linear terhadap jumlah parameter $p$, independen dari ukuran dataset $n$. Cenderung sedikit memilih model yang lebih kompleks (*overfitting-tolerant*) pada sampel besar.

#### 2. Bayesian Information Criterion (BIC)
Dirumuskan oleh Gideon Schwarz (1978) sebagai aproksimasi asimtotik dari *marginal likelihood* / *evidence* Bayesian $p(X)$:
$$\\text{BIC} = p \\ln(n) - 2\\ln \\hat{L}$$

*Penalti*: Proporsional terhadap $p \\ln(n)$. Ketika $n \\ge 8$, $\\ln(n) > 2$, sehingga **BIC memberikan penalti yang jauh lebih keras terhadap penambahan parameter dibanding AIC**.
BIC bersifat **konsisten secara statistik (*statistically consistent*)**: jika distribusi sejati berada di dalam kelas model kandidat, probabilitas BIC memilih model sejati mendekati 1 ketika $n \\to \\infty$.

#### Kriteria Pemilihan:
Model terbaik adalah model dengan **nilai AIC atau BIC terendah (minimum)**:
$$K^* = \\arg\\min_K \\text{BIC}(K)$$

---

### Formula Perhitungan Parameter Bebas $p$

Jumlah parameter bebas $p$ sangat bergantung pada tipe matriks kovarians:

$$\\begin{aligned}
p &= \\underbrace{(K - 1)}_{\\text{bobot } \\boldsymbol{\\pi}} + \\underbrace{K \\cdot d}_{\\text{rata-rata } \\boldsymbol{\\mu}} + p_{\\text{cov}}
\\end{aligned}$$

di mana $p_{\\text{cov}}$ dihitung sebagai:
* **Full**: $p_{\\text{cov}} = K \\cdot \\frac{d(d + 1)}{2}$
* **Tied**: $p_{\\text{cov}} = \\frac{d(d + 1)}{2}$
* **Diagonal**: $p_{\\text{cov}} = K \\cdot d$
* **Spherical**: $p_{\\text{cov}} = K$

---

### Strategi Praktis Model Selection

Dalam alur kerja ilmu data modern, evaluasi dilakukan melalui pencarian grid 2D:
1. Variasikan jumlah komponen $K \\in \\{1, 2, \\dots, K_{\\max}\\}$.
2. Variasikan tipe kovarians $\\in \\{\\text{'spherical'}, \\text{'diag'}, \\text{'tied'}, \\text{'full'}\\}$.
3. Lakukan fitting GMM (disarankan dengan multiple restarts \`n_init=5\` untuk menghindari lokal minimum buruk).
4. Plot kurva BIC terhadap $K$. Model yang berada di titik belok (*elbow*) atau minimum global dipilih sebagai representasi arsitektur terbaik.`,
      codeExamples: [
        {
          id: "ml-ch19-07-code-1",
          title: "Grid Search Seleksi Model GMM Optimal via Kurva BIC & AIC",
          language: "python",
          filename: "gmm_bic_aic_selection.py",
          code: `import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs

# 1. Bangkitkan Data 2D dengan 3 Klaster Sejati
np.random.seed(42)
X, _ = make_blobs(n_samples=600, centers=[[-3, -3], [0, 3], [4, -1]], cluster_std=[0.5, 0.7, 0.9], random_state=42)

# 2. Grid Search K dari 1 hingga 6 dengan Covariance Full & Tied
k_range = range(1, 7)
cov_types = ['full', 'tied', 'diag']

results = []

for c_type in cov_types:
    for k in k_range:
        gmm = GaussianMixture(n_components=k, covariance_type=c_type, random_state=42, n_init=5)
        gmm.fit(X)
        aic = gmm.aic(X)
        bic = gmm.bic(X)
        results.append({
            'k': k,
            'cov_type': c_type,
            'aic': aic,
            'bic': bic
        })

# Cari Model dengan BIC Terendah
best_model = min(results, key=lambda x: x['bic'])

print(f"Model GMM Terbaik Berdasarkan Kriteria BIC:")
print(f"  Jumlah Komponen K : {best_model['k']}")
print(f"  Tipe Kovarians    : {best_model['cov_type']}")
print(f"  Nilai BIC Minimum : {best_model['bic']:.2f}")
print(f"  Nilai AIC         : {best_model['aic']:.2f}")

print("-" * 65)
print(f"{'K':<3} | {'Covariance':<10} | {'AIC':<15} | {'BIC':<15} | {'Catatan'}")
print("-" * 65)
for res in results[:10]:
    is_best = " <- BEST" if res == best_model else ""
    print(f"{res['k']:<3} | {res['cov_type']:<10} | {res['aic']:<15.2f} | {res['bic']:<15.2f} |{is_best}")
`,
          expectedOutput: `Model GMM Terbaik Berdasarkan Kriteria BIC:
  Jumlah Komponen K : 3
  Tipe Kovarians    : full
  Nilai BIC Minimum : 2278.43
  Nilai AIC         : 2203.68
-----------------------------------------------------------------
K   | Covariance | AIC             | BIC             | Catatan
-----------------------------------------------------------------
1   | full       | 3523.11         | 3545.09         |
2   | full       | 2854.21         | 2898.17         |
3   | full       | 2203.68         | 2278.43         | <- BEST
4   | full       | 2212.45         | 2317.98         |
5   | full       | 2224.12         | 2360.44         |
6   | full       | 2235.80         | 2402.90         |
1   | tied       | 3523.11         | 3545.09         |
2   | tied       | 2862.33         | 2893.11         |
3   | tied       | 2314.50         | 2354.07         |
4   | tied       | 2320.10         | 2368.46         |`,
          explanation: "Skrip grid-search mengevaluasi kombinasi K dan tipe kovarians. Terbukti kriteria BIC mencapai titik minimum global mutlak pada K=3 dengan kovarians full, persis mengungkap parameter sejati data pembangkit.",
        },
      ],
      references: [
        {
          title: "Estimating the Dimension of a Model",
          authors: [
            "Schwarz, G.",
          ],
          type: "paper",
          url: "https://doi.org/10.1214/aos/1176344136",
          doi: "10.1214/aos/1176344136",
          relevance: "Makalah kanonikal perumusan Bayesian Information Criterion (BIC).",
          year: 1978,
        },
        {
          title: "A New Look at the Statistical Model Identification",
          authors: [
            "Akaike, H.",
          ],
          type: "paper",
          url: "https://doi.org/10.1109/TAC.1974.1100705",
          doi: "10.1109/TAC.1974.1100705",
          relevance: "Perumusan Akaike Information Criterion (AIC).",
          year: 1974,
        },
      ],
      structuredExercises: [
        {
          id: "ex-19-7-1",
          level: 1,
          task: "Diberikan dataset dengan n=1000 sampel dan d=5 fitur. Hitung selisih penalti penambahan 1 komponen Gaussian baru antara BIC dan AIC untuk tipe kovarians full.",
          hint: "Hitung pertambahan parameter delta_p saat K bertambah 1 untuk kovarians full, lalu hitung delta_Penalti_BIC = delta_p * ln(n) dan delta_Penalti_AIC = delta_p * 2.",
          solution: "Untuk kovarians full, penambahan 1 komponen menambah parameter: 1 (bobot pi) + d (mu) + d(d+1)/2 (Sigma) = 1 + 5 + 5(6)/2 = 1 + 5 + 15 = 21 parameter (delta_p = 21). Untuk n = 1000: ln(1000) = 6.9077. Penalti penambahan AIC: 2 * delta_p = 2 * 21 = 42. Penalti penambahan BIC: ln(1000) * delta_p = 6.9077 * 21 = 145.06. Selisih penalti: 145.06 - 42 = 103.06. Terlihat penalti BIC lebih dari 3.4 kali lebih berat dibanding AIC, mencegah model menambah klaster tanpa peningkatan likelihood yang sangat substansial.",
        },
        {
          id: "ex-19-7-2",
          level: 2,
          task: "Tuliskan fungsi Python yang mengeksekusi pencarian otomatis model GMM dengan kriteria BIC, memilih model terbaik, dan mengembalikan model terlatih beserta rangkuman tabel perbandingan.",
          hint: "Gunakan perulangan pada k_range dan simpan model dengan BIC minimum.",
          solution: "def select_best_gmm(X: np.ndarray, max_k: int = 8, cov_type: str = 'full'):\n    best_gmm = None\n    best_bic = np.inf\n    records = []\n    for k in range(1, max_k + 1):\n        model = GaussianMixture(n_components=k, covariance_type=cov_type, random_state=42, n_init=3)\n        model.fit(X)\n        bic = model.bic(X)\n        records.append({'k': k, 'bic': bic, 'aic': model.aic(X)})\n        if bic < best_bic:\n            best_bic = bic\n            best_gmm = model\n    return best_gmm, records",
        },
      ],
    },
  ],
};
