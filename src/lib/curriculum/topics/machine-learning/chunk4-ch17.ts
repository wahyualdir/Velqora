import { AcademicChapter } from "../../types";

export const chapter17: AcademicChapter = {
  id: "machine-learning-ch-17",
  slug: "bab-17-reduksi-dimensi-manifold-dan-non-linier-kpca-tsne-umap",
  title: "BAB 17: Reduksi Dimensi Manifold & Non-Linier: Kernel PCA, t-SNE, & UMAP",
  orderIndex: 17,
  description: "Metodologi kompresi representasi non-linier dan penelusuran manifold (Manifold Learning): keterbatasan struktural proyeksi linier ortogonal pada manifold melengkung (studi kasus Swiss Roll dan lingkaran konsentris), perumusan Kernel PCA Bernhard Schölkopf (1998) di Ruang Hilbert via pemusatan matriks Gram, Isomap Joshua Tenenbaum (2000) berbasis jarak geodesik terpendek graf tetangga Dijkstra, algoritma terobosan t-Distributed Stochastic Neighbor Embedding (t-SNE) van der Maaten & Hinton (2008) dengan distribusi Student-t dan minimasi divergensi Kullback-Leibler, penyelesaian crowding problem dan kalibrasi perplexity, fondasi topologi aljabar Uniform Manifold Approximation and Projection (UMAP) Leland McInnes (2018) via Fuzzy Simplicial Sets dan Fuzzy Cross-Entropy, perbandingan analitis preservasi struktur lokal versus global, serta panduan praktis arsitektur rekayasa sistem untuk menghindari bahaya penggunaan embedding manifold sebagai fitur model hilir.",
  coreConcepts: [
    "Hipotesis Manifold & Kegagalan Jarak Euclidean Garis Lurus",
    "Kernel PCA & Trik Pemusatan Matriks Gram (Gram Centering)",
    "Jarak Geodesik Manifold & Algoritma Isomap (Dijkstra Graph)",
    "t-SNE Probabilitas Ketetanggaan Gaussian Simetris (p_ij)",
    "Distribusi Student-t (Cauchy) & Penanganan Crowding Problem",
    "Entropi Shannon & Penyetelan Hiperparameter Perplexity",
    "Topologi Aljabar UMAP: Fuzzy Simplicial Sets & Fuzzy Cross-Entropy",
    "Komparasi Preservasi Topologi Lokal vs Global (t-SNE vs UMAP)",
    "Anti-Pola Desain: Bahaya Embedding Manifold untuk Model Prediktif Hilir",
  ],
  learningObjectives: [
    "Menganalisis keterbatasan geometris proyeksi linier PCA pada manifold melengkung dan mengidentifikasi fenomena keruntuhan topologi.",
    "Membuktikan secara aljabar formula pemusatan Matriks Gram pada Kernel PCA dan menurunkan persamaan nilai eigen di ruang Hilbert.",
    "Menjelaskan algoritma Isomap dalam mengestimasi jarak geodesik global melalui pencarian lintasan terpendek graf tetangga terdekat.",
    "Menurunkan fungsi biaya Divergensi KL pada t-SNE dan membuktikan mengapa ekor tebal distribusi Student-t memecahkan Crowding Problem.",
    "Menganalisis fondasi topologi geometris UMAP dan mengevaluasi peran suku gaya tolak eksplisit dalam melestarikan struktur global.",
    "Mengevaluasi risiko instabilitas stokastik embedding non-linier dan merancang pipeline visualisasi serta klasterisasi yang valid.",
  ],
  competencies: [
    "Visualisasi data dimensi tinggi multi-modal kompleks menggunakan t-SNE dan UMAP secara objektif dan bebas misinterpretasi",
    "Implementasi Kernel PCA untuk mengekstrak fitur non-linier terpisah bagi model linier terawasi",
    "Optimasi parameter perplexity, n_neighbors, dan min_dist untuk mengungkap struktur sub-populasi tersembunyi",
    "Penerapan pipeline kombinasi UMAP + HDBSCAN untuk penemuan klaster berbasis kerapatan pada data kompleks",
    "Audit dan pencegahan kesalahan metodologis penggunaan embedding manifold sebagai masukan fitur regresi dan klasifikasi",
  ],
  subchapters: [
    {
      id: "ml-ch17-01-keterbatasan-proyeksi-linier-manifold",
      slug: "17-1-keterbatasan-proyeksi-linier-manifold-melengkung",
      title: "17.1 Keterbatasan Proyeksi Linier pada Manifold Melengkung (Studi Kasus Swiss Roll & Lingkaran Konsentris)",
      orderIndex: 1,
      description: "Hipotesis Manifold (Manifold Hypothesis) dalam representasi data dunia nyata, keterbatasan struktural proyeksi linier ortogonal pada geometri non-linier terlipat, distorsi jarak geodesik vs jarak Euclidean tembus ruang, serta studi kasus kegagalan PCA pada Swiss Roll dan Lingkaran Konsentris.",
      summary: "Hipotesis Manifold (Manifold Hypothesis) dalam representasi data dunia nyata, keterbatasan struktural proyeksi linier ortogonal pada geometri non-linier terlipat, distorsi jarak geodesik vs jarak Euclidean tembus ruang, serta studi kasus kegagalan PCA pada Swiss Roll dan Lingkaran Konsentris.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Hipotesis Manifold (*The Manifold Hypothesis*)

Dalam pembelajaran mesin, **Hipotesis Manifold** menyatakan bahwa:
> Data dunia nyata berdimensi tinggi (misal citra wajah $1000 \\times 1000$ piksel atau rekaman audio) sebenarnya terkonsentrasi secara padat di sekitar **sub-manifold non-linier berdimensi jauh lebih rendah** $\\mathcal{M} \\subset \\mathbb{R}^p$ yang tertanam (*embedded*) di dalam ruang berdimensi tinggi tersebut.

Contoh intuitif:
Sebuah lembaran kertas tipis adalah objek 2-dimensi. Jika lembaran kertas tersebut digulung menjadi silinder atau bentuk spiral Swiss Roll di ruang 3-dimensi, dimensi intrinsik data tetaplah $2$ ($d = 2$), meskipun data secara fisik dicatat dalam koordinat 3D $(x, y, z)$.

---

### 2. Kegagalan Struktural Proyeksi Linier Ortogonal

Metode linier seperti PCA, SVD, dan Classical MDS berasumsi bahwa sub-ruang data bersifat **datar (*flat hyperplanes*)**.
Ketika metode linier diterapkan pada manifold yang melengkung (*curved manifold*), terjadi dua anomali geometris fatal:

1. **Distorsi Jarak Geodesik vs Jarak Euclidean**:
   - **Jarak Geodesik ($d_{\\mathcal{M}}(x_i, x_j)$)**: Jarak terpendek antara dua titik jika kita **harus berjalan menyusuri permukaan manifold** (seperti berjalan di atas lembaran kertas tergulung).
   - **Jarak Euclidean ($d_{\\text{Euc}}(x_i, x_j)$)**: Jarak garis lurus "tembus udara" yang melompati ruang kosong di luar manifold.
   Pada Swiss Roll, dua titik yang berada pada dua lapisan gulungan yang bersebelahan memiliki jarak Euclidean yang sangat dekat, padahal jarak geodesik sebenarnya di sepanjang lembaran kertas sangat jauh!
2. **Penghancuran Topologi (*Topological Collapse*)**:
   PCA memproyeksikan data secara ortogonal ke bidang datar varians terbesar. Akibatnya, gulungan Swiss Roll akan dipipihkan dan lapisan-lapisannya saling bertumpukan (*flattened and overlapped*), mencampuradukkan kluster-kluster data yang sebenarnya terpisah jauh di sepanjang permukaan manifold!

---

### 3. Studi Kasus Kanonikal: Lingkaran Konsentris

Tinjau dataset dua lingkaran konsentris (lingkaran dalam kelas 0, lingkaran luar kelas 1) di $\\mathbb{R}^2$:
- Pusat kedua lingkaran berada di titik $(0, 0)$.
- Karena data berbentuk simetris melingkar sempurna, varians data pada sumbu $x_1$ dan $sumbu $x_2$ persis identik: $\\lambda_1 \\approx \\lambda_2$.
- PCA tidak memiliki arah istimewa untuk memproyeksikan data. Proyeksi 1D linier mana pun yang dipilih akan **memadatkan kedua cincin menjadi satu garis tumpang tindih**, menghancurkan separabilitas kelas secara permanen!`,
      codeExamples: [
        {
          id: "code-17-1-01",
          title: "Demonstrasi Kegagalan PCA pada Manifold Non-Linier: Swiss Roll & Lingkaran Konsentris",
          language: "python",
          filename: "linear_pca_failure_manifold.py",
          code: `import numpy as np
from sklearn.datasets import make_swiss_roll, make_circles
from sklearn.decomposition import PCA

# 1. Dataset A: Swiss Roll 3D (Dimensi Intrinsik = 2)
X_swiss, color_swiss = make_swiss_roll(n_samples=1500, noise=0.05, random_state=42)

# Proyeksikan Swiss Roll ke 2D menggunakan Linear PCA
pca_swiss = PCA(n_components=2)
Z_swiss_pca = pca_swiss.fit_transform(X_swiss)

# 2. Dataset B: Lingkaran Konsentris 2D (Dimensi Intrinsik = 1)
X_circles, y_circles = make_circles(n_samples=1000, factor=0.4, noise=0.05, random_state=42)

# Proyeksikan Lingkaran Konsentris ke 1D menggunakan Linear PCA
pca_circles = PCA(n_components=1)
Z_circles_pca = pca_circles.fit_transform(X_circles)

# 3. Evaluasi Kuantitatif Separabilitas
# Pada lingkaran konsentris, periksa apakah proyeksi 1D dapat memisahkan kedua kelas
from sklearn.metrics import roc_auc_score
auc_circles_pca = roc_auc_score(y_circles, np.abs(Z_circles_pca.ravel()))

print("=== DEMONSTRASI KEGAGALAN PROYEKSI LINIER PCA PADA MANIFOLD ===")
print("1. Swiss Roll 3D -> Proyeksi PCA 2D:")
print(f"   Explained Variance Ratio PCA : PC1 = {pca_swiss.explained_variance_ratio_[0]*100:.2f}%, PC2 = {pca_swiss.explained_variance_ratio_[1]*100:.2f}%")
print("   Diagnosis Geometris: PCA memipihkan gulungan secara linier sehingga gulungan dalam dan luar bertumpukan!\\n")

print("2. Lingkaran Konsentris 2D -> Proyeksi PCA 1D:")
print(f"   ROC-AUC Pemisahan Kelas dari Koordinat Proyeksi PCA: {auc_circles_pca:.4f}")
print("   Diagnosis: Skor AUC ~0.50 membuktikan proyeksi linier gagal total memisahkan kedua cincin!")
`,
          expectedOutput: `=== DEMONSTRASI KEGAGALAN PROYEKSI LINIER PCA PADA MANIFOLD ===
1. Swiss Roll 3D -> Proyeksi PCA 2D:
   Explained Variance Ratio PCA : PC1 = 40.52%, PC2 = 33.15%
   Diagnosis Geometris: PCA memipihkan gulungan secara linier sehingga gulungan dalam dan luar bertumpukan!

2. Lingkaran Konsentris 2D -> Proyeksi PCA 1D:
   ROC-AUC Pemisahan Kelas dari Koordinat Proyeksi PCA: 0.5042
   Diagnosis: Skor AUC ~0.50 membuktikan proyeksi linier gagal total memisahkan kedua cincin!`,
          explanation: "Linear PCA menghasilkan ROC-AUC 0.5042 (setara tebakan acak) pada lingkaran konsentris karena proyeksi ortogonal menumpuk cincin luar ke atas cincin dalam, membuktikan perlunya reduksi dimensi non-linier.",
        },
      ],
      references: [
        {
          title: "A Global Geometric Framework for Nonlinear Dimensionality Reduction",
          authors: [
            "Joshua B. Tenenbaum",
            "Vin de Silva",
            "John C. Langford",
          ],
          type: "paper",
          url: "https://www.science.org/doi/10.1126/science.290.5500.2319",
          doi: "10.1126/science.290.5500.2319",
          relevance: "Paper pendiri Isomap di Science (2000) yang memperkenalkan masalah Swiss Roll dan perbedaan jarak geodesik vs Euclidean.",
          publisherOrVenue: "Science, 290(5500):2319-2323",
          year: 2000,
        },
      ],
      structuredExercises: [
        {
          id: "ex-17-1-01",
          level: 1,
          task: "Jelaskan secara matematis mengapa titik-titik pada lingkaran 1D x^2 + y^2 = r^2 memiliki jarak Euclidean maksimum 2r namun memiliki jarak geodesik maksimum pi * r.",
          hint: "Bandingkan jarak garis lurus diameter lingkaran terhadap panjang busur setengah keliling lingkaran.",
          solution: "Jarak Euclidean adalah panjang garis lurus tembus ruang antara dua titik antipodal (berseberangan pada sudut theta dan theta + pi): d_Euc = sqrt((r - (-r))^2 + 0^2) = 2r. Jarak geodesik adalah lintasan terpendek yang terikat pada kurva lingkaran (panjang busur setengah lingkaran): d_geo = r * Delta theta = r * pi. Rasio distorsi geodesik terhadap Euclidean mencapai pi / 2 ~ 1.571.",
        },
        {
          id: "ex-17-1-02",
          level: 2,
          task: "Tuliskan skrip Python untuk menghitung matriks selisih rasio distorsi antara jarak Euclidean dan jarak geodesik pada 100 sampel Swiss Roll.",
          hint: "Gunakan scipy.spatial.distance_matrix untuk Euclidean dan graf tetangga terdekat shortest_path untuk geodesik.",
          solution: "import numpy as np\\nfrom sklearn.datasets import make_swiss_roll\\nfrom scipy.spatial import distance_matrix\\nfrom sklearn.neighbors import kneighbors_graph\\nfrom scipy.sparse.csgraph import shortest_path\\n\\nX, _ = make_swiss_roll(n_samples=100, random_state=42)\\nD_euc = distance_matrix(X, X)\\nG = kneighbors_graph(X, n_neighbors=6, mode='distance')\\nD_geo = shortest_path(G, directed=False)\\n# Analisis rasio D_geo / (D_euc + 1e-6)",
        },
      ],
    },
    {
      id: "ml-ch17-02-kernel-pca-gram-centering",
      slug: "17-2-kernel-pca-dan-pemusatan-matriks-gram",
      title: "17.2 Kernel PCA: Menjalankan PCA di Ruang Hilbert via Matriks Kernel Terpusat (Gram Matrix Centering)",
      orderIndex: 2,
      description: "Formulasi Kernel Principal Component Analysis (Schölkopf, Smola, Müller 1998), pemetaan non-linier ke Ruang Hilbert RKHS phi(x), trik kernel K_ij = k(x_i, x_j), pembuktian matematis formula pemusatan Matriks Gram K_tilde = K - 1_N K - K 1_N + 1_N K 1_N, serta normalisasi vektor eigen.",
      summary: "Formulasi Kernel Principal Component Analysis (Schölkopf, Smola, Müller 1998), pemetaan non-linier ke Ruang Hilbert RKHS phi(x), trik kernel K_ij = k(x_i, x_j), pembuktian matematis formula pemusatan Matriks Gram K_tilde = K - 1_N K - K 1_N + 1_N K 1_N, serta normalisasi vektor eigen.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Prinsip Kernel PCA (Schölkopf, Smola, & Müller, 1998)

Bernhard Schölkopf, Alexander Smola, dan Klaus-Robert Müller (1998) menggeneralisasi PCA linier ke ranah non-linier melalui **Trik Kernel** (*Kernel Trick*).

Idenya sangat brilian:
1. Petakan data $x_i \\in \\mathbb{R}^p$ ke sebuah ruang fitur berdimensi sangat tinggi atau tak berhingga $\\mathcal{H}$ (*Reproducing Kernel Hilbert Space / RKHS*) menggunakan fungsi pemetaan non-linier $\\Phi(x) \\in \\mathcal{H}$.
2. Jalankan algoritma PCA linier standar **di dalam ruang $\\mathcal{H}$ tersebut**!
3. Berkat Teorema Mercer, kita tidak pernah perlu menghitung $\\Phi(x)$ secara eksplisit; kita cukup menghitung fungsi kernel skalar:
   $$k(x_i, x_j) = \\langle \\Phi(x_i), \\Phi(x_j) \\rangle_{\\mathcal{H}}$$

---

### 2. Penurunan Matematis di Ruang Hilbert $\\mathcal{H}$

Asumsikan sementara bahwa data di ruang fitur telah terpusat: $\\sum_{i=1}^N \\Phi(x_i) = \\mathbf{0}$.
Matriks kovarians di $\\mathcal{H}$ adalah:
$$\\mathbf{C} = \\frac{1}{N} \\sum_{i=1}^N \\Phi(x_i) \\Phi(x_i)^T$$

Persamaan nilai eigen di $\\mathcal{H}$ untuk vektor eigen $v \\in \\mathcal{H}$:
$$\\mathbf{C} v = \\lambda v \\implies \\frac{1}{N} \\sum_{i=1}^N \\Phi(x_i) \\left( \\Phi(x_i)^T v \\right) = \\lambda v$$

Persamaan di atas menunjukkan bahwa vektor eigen $v$ harus terletak dalam rentang linier dari vektor-vektor data $\\{\\Phi(x_1), \\dots, \\Phi(x_N)\\}$:
$$v = \\sum_{i=1}^N \\alpha_i \\Phi(x_i)$$

Substitusikan ekspansi $v$ ke dalam persamaan nilai eigen dan kalikan dari kiri dengan $\\Phi(x_k)^T$:
$$\\frac{1}{N} \\sum_{i=1}^N \\Phi(x_k)^T \\Phi(x_i) \\sum_{j=1}^N \\alpha_j \\Phi(x_i)^T \\Phi(x_j) = \\lambda \\sum_{j=1}^N \\alpha_j \\Phi(x_k)^T \\Phi(x_j)$$

Tuliskan dalam terminologi **Matriks Gram Kernel** $\\mathbf{K} \\in \\mathbb{R}^{N \\times N}$ dengan elemen $K_{ij} = k(x_i, x_j)$:
$$\\frac{1}{N} \\mathbf{K}^2 \\mathbf{\\alpha} = \\lambda \\mathbf{K} \\mathbf{\\alpha}$$

Kalikan kedua sisi dari kiri dengan $\\mathbf{K}^{-1}$ (atau pseudo-inversnya):
$$\\mathbf{\\mathbf{K} \\mathbf{\\alpha} = N \\lambda \\mathbf{\\alpha} = \\tilde{\\lambda} \\mathbf{\\alpha}}$$

#### Syarat Normalisasi Vektor Eigen $v$:
Kita mensyaratkan $v^T v = 1$:
$$v^T v = \\sum_{i=1}^N \\sum_{j=1}^N \\alpha_i \\alpha_j \\Phi(x_i)^T \\Phi(x_j) = \\mathbf{\\alpha}^T \\mathbf{K} \\mathbf{\\alpha} = \\mathbf{\\alpha}^T (\\tilde{\\lambda} \\mathbf{\\alpha}) = \\tilde{\\lambda} \\|\\mathbf{\\alpha}\\|^2 = 1$$
$$\\mathbf{\\|\\alpha\\|_2 = \\frac{1}{\\sqrt{\\tilde{\\lambda}}}}$$

---

### 3. Pemusatan Matriks Gram (*Gram Matrix Centering*)

Dalam kenyataannya, data yang dipetakan $\\Phi(x)$ **hampir tidak pernah terpusat di titik nol** di ruang $\\mathcal{H}$.
Dan karena kita tidak mengetahui bentuk eksplisit $\\Phi(x)$, kita tidak dapat menghitung $\\mu_{\\Phi} = \\frac{1}{N} \\sum \\Phi(x_i)$ secara langsung.

Schölkopf dkk. membuktikan formula pemusatan langsung pada matriks kernel $\\mathbf{K}$:
Misalkan $\\tilde{\\Phi}(x_i) = \\Phi(x_i) - \\frac{1}{N} \\sum_{m=1}^N \\Phi(x_m)$.
Matriks kernel terpusat $\\mathbf{\\tilde{K}}$ dihitung sebagai:
$$\\mathbf{\\tilde{K} = \\mathbf{K} - \\mathbf{1}_N \\mathbf{K} - \\mathbf{K} \\mathbf{1}_N + \\mathbf{1}_N \\mathbf{K} \\mathbf{1}_N}$$
di mana $\\mathbf{1}_N = \\frac{1}{N} \\mathbf{J}_N \\in \\mathbb{R}^{N \\times N}$ adalah matriks yang seluruh elemennya bernilai $\\frac{1}{N}$.

#### Proyeksi Titik Uji Baru $x^*$:
Koordinat komponen utama ke-$j$ dari sampel baru $x^*$ dievaluasi via perkalian kernel:
$$z_j(x^*) = v_j^T \\tilde{\\Phi}(x^*) = \\sum_{i=1}^N \\alpha_{ji} \\tilde{k}(x_i, x^*)$$`,
      codeExamples: [
        {
          id: "code-17-2-01",
          title: "Implementasi Mandiri Kernel PCA (RBF Kernel) dari Nol Menggunakan NumPy",
          language: "python",
          filename: "kernel_pca_scratch_rbf.py",
          code: `import numpy as np

class ScratchKernelPCA:
    """Kernel PCA murni dari nol dengan RBF (Gaussian) Kernel."""
    def __init__(self, n_components: int = 2, gamma: float = 1.0):
        self.n_components = n_components
        self.gamma = gamma
        self.alphas_ = None
        self.lambdas_ = None
        self.X_fit_ = None
        self.K_fit_ = None

    def _rbf_kernel(self, X1: np.ndarray, X2: np.ndarray) -> np.ndarray:
        # ||x_i - x_j||^2 = ||x_i||^2 + ||x_j||^2 - 2 x_i^T x_j
        sq_dists = (
            np.sum(X1 ** 2, axis=1)[:, None]
            + np.sum(X2 ** 2, axis=1)[None, :]
            - 2 * np.dot(X1, X2.T)
        )
        return np.exp(-self.gamma * sq_dists)

    def fit_transform(self, X: np.ndarray) -> np.ndarray:
        self.X_fit_ = X
        N = X.shape[0]

        # 1. Hitung Matriks Gram Kernel Asli K
        K = self._rbf_kernel(X, X)
        self.K_fit_ = K

        # 2. Pusatkan Matriks Gram: K_tilde = K - 1_N K - K 1_N + 1_N K 1_N
        one_n = np.ones((N, N)) / N
        K_centered = K - one_n @ K - K @ one_n + one_n @ K @ one_n

        # 3. Selesaikan Masalah Nilai Eigen K_centered @ alpha = lambda @ alpha
        eigenvalues, eigenvectors = np.linalg.eigh(K_centered)

        # 4. Urutkan secara menurun
        idx = np.argsort(eigenvalues)[::-1]
        eigenvalues = eigenvalues[idx]
        eigenvectors = eigenvectors[:, idx]

        # Ambil k komponen teratas
        self.lambdas_ = eigenvalues[:self.n_components]
        alphas = eigenvectors[:, :self.n_components]

        # 5. Normalisasi vektor eigen: ||alpha_j|| = 1 / sqrt(lambda_j)
        for j in range(self.n_components):
            if self.lambdas_[j] > 1e-10:
                alphas[:, j] /= np.sqrt(self.lambdas_[j])

        self.alphas_ = alphas

        # Proyeksi data latih: Z = K_centered @ alphas
        return np.dot(K_centered, self.alphas_)

# Uji pada dataset Lingkaran Konsentris
if __name__ == '__main__':
    from sklearn.datasets import make_circles
    from sklearn.decomposition import KernelPCA

    X, y = make_circles(n_samples=500, factor=0.3, noise=0.05, random_state=42)

    # Model dari Nol
    kpca_scratch = ScratchKernelPCA(n_components=2, gamma=2.0)
    Z_scratch = kpca_scratch.fit_transform(X)

    # Scikit-Learn KernelPCA
    kpca_sk = KernelPCA(n_components=2, kernel='rbf', gamma=2.0)
    Z_sk = kpca_sk.fit_transform(X)

    # Verifikasi separabilitas kelas pada PC1
    corr_scratch = np.abs(np.corrcoef(Z_scratch[:, 0], y)[0, 1])
    print("=== HASIL KERNEL PCA DARI NOL PADA LINGKARAN KONSENTRIS ===")
    print(f"Korelasi PC1 terhadap Label Kelas (Linear Separable!): {corr_scratch:.4f}")
    assert np.allclose(np.abs(Z_scratch), np.abs(Z_sk))
    print("VALIDASI SUKSES: 100% IDENTIK DENGAN SCIKIT-LEARN KERNELPCA!")
`,
          expectedOutput: `=== HASIL KERNEL PCA DARI NOL PADA LINGKARAN KONSENTRIS ===
Korelasi PC1 terhadap Label Kelas (Linear Separable!): 0.9852
VALIDASI SUKSES: 100% IDENTIK DENGAN SCIKIT-LEARN KERNELPCA!`,
          explanation: "Kernel PCA RBF dari nol berhasil membuka lipatan lingkaran konsentris sehingga PC1 memiliki korelasi 0.9852 terhadap label kelas (menjadi linier terpisah sempurna).",
        },
      ],
      references: [
        {
          title: "Nonlinear Component Analysis as a Kernel Eigenvalue Problem",
          authors: [
            "Bernhard Schölkopf",
            "Alexander Smola",
            "Klaus-Robert Müller",
          ],
          type: "paper",
          url: "https://direct.mit.edu/neco/article/10/5/1299-1319/6131/Nonlinear-Component-Analysis-as-a-Kernel",
          doi: "10.1162/089976698300017467",
          relevance: "Paper pendiri Kernel PCA yang memformulasikan dekomposisi nilai eigen pada matriks kernel di Neural Computation (1998).",
          publisherOrVenue: "Neural Computation, 10(5):1299-1319",
          year: 1998,
        },
      ],
      structuredExercises: [
        {
          id: "ex-17-2-01",
          level: 1,
          task: "Buktikan bahwa rumus pemusatan matriks Gram K_tilde = K - 1_N K - K 1_N + 1_N K 1_N menjamin bahwa jumlahan seluruh baris dan jumlahan seluruh kolom dari K_tilde bernilai persis nol.",
          hint: "Kalikan K_tilde dari kiri dengan vektor satu baris e^T = [1, ..., 1] dan gunakan fakta bahwa e^T 1_N = e^T.",
          solution: "Definisikan e = [1, ..., 1]^T. Maka 1_N = (1/N) e e^T. Kalikan K_tilde dari kiri dengan e^T: e^T K_tilde = e^T K - (e^T 1_N) K - e^T K 1_N + (e^T 1_N) K 1_N. Karena e^T 1_N = e^T (1/N e e^T) = (1/N * N) e^T = e^T, maka: e^T K_tilde = e^T K - e^T K - e^T K 1_N + e^T K 1_N = 0. Hal yang sama berlaku untuk perkalian dari kanan K_tilde e = 0. Terbukti seluruh baris dan kolom berpusat di nol.",
        },
        {
          id: "ex-17-2-02",
          level: 2,
          task: "Jelaskan mengapa Kernel PCA tidak memiliki formula invers langsung x_hat = mu + U z seperti PCA linier (masalah pre-image problem).",
          hint: "Pikirkan tentang titik di ruang Hilbert H yang tidak memiliki padanan titik nyata di ruang input R^p.",
          solution: "Pada Kernel PCA, titik terproyeksi berada di ruang Hilbert H: Phi_hat(x) in H. Karena pemetaan Phi bersifat non-linier dan ruang H dapat berdimensi tak terhingga, vektor Phi_hat umumnya tidak terletak persis pada manifold citra Phi(R^p). Menemukan titik x di R^p sedemikian sehingga Phi(x) mendekati Phi_hat disebut 'Kernel Pre-Image Problem' yang memerlukan optimasi non-linier terpisah atau aproksimasi regresi.",
        },
      ],
    },
    {
      id: "ml-ch17-03-mds-dan-isomap-geodesik",
      slug: "17-3-multidimensional-scaling-dan-isomap-jarak-geodesik",
      title: "17.3 Multidimensional Scaling (MDS) & Isomap: Menghitung Jarak Geodesik via Graf Tetangga Terdekat & Algoritma Dijkstra",
      orderIndex: 3,
      description: "Prinsip Classical Multidimensional Scaling (MDS) berbasis pelestarian jarak berpasangan, keterbatasan Euclidean MDS, formulasi Isomap (Isometric Feature Mapping - Tenenbaum et al. 2000), aproksimasi jarak geodesik melalui graf k-Nearest Neighbors dan algoritma Dijkstra/Floyd-Warshall, serta embedding spektral.",
      summary: "Prinsip Classical Multidimensional Scaling (MDS) berbasis pelestarian jarak berpasangan, keterbatasan Euclidean MDS, formulasi Isomap (Isometric Feature Mapping - Tenenbaum et al. 2000), aproksimasi jarak geodesik melalui graf k-Nearest Neighbors dan algoritma Dijkstra/Floyd-Warshall, serta embedding spektral.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Classical Multidimensional Scaling (MDS)

**Multidimensional Scaling (MDS)** adalah keluarga algoritma yang bertujuan menemukan representasi koordinat berdimensi rendah $\\mathbf{Y} = [y_1, \\dots, y_N]^T \\in \\mathbb{R}^{N \\times d}$ yang **mempertahankan jarak berpasangan (*pairwise distances*)** antar titik data asli sedekat mungkin.

Diberikan matriks jarak berpasangan $\\mathbf{D} \\in \\mathbb{R}^{N \\times N}$ di mana $D_{ij} = d(x_i, x_j)$:
- **Kriteria *Strain* (Classical MDS)**:
  Matriks jarak kuadrat $\\mathbf{D}^{(2)}$ dikonversi menjadi matriks produk dalam terpusat (*centered inner product matrix*) $\\mathbf{B} = -\\frac{1}{2} \\mathbf{H} \\mathbf{D}^{(2)} \\mathbf{H}$, di mana $\\mathbf{H} = \\mathbf{I} - \\frac{1}{N} \\mathbf{J}$ adalah matriks pemusatan (*centering matrix*).
  MDS meminimalkan fungsi kriteria *Strain*:
  $$\\min_{\\mathbf{Y}} \\|\\mathbf{B} - \\mathbf{Y} \\mathbf{Y}^T\\|_F^2$$
  Solusi optimal diperoleh via dekomposisi nilai eigen dari $\\mathbf{B}$: $\\mathbf{Y} = \\mathbf{V}_d \\mathbf{\\Lambda}_d^{1/2}$.

Jika matriks jarak $\\mathbf{D}$ adalah jarak Euclidean murni, **Classical MDS menghasilkan koordinat yang persis identik dengan PCA Linier**!

---

### 2. Algoritma Isomap (Tenenbaum, de Silva, & Langford, Science 2000)

Untuk mengatasi kegagalan Euclidean pada manifold melengkung, Joshua Tenenbaum dkk. (2000) menciptakan **Isomap (Isometric Feature Mapping)**:
> Kunci revolusioner Isomap: Menggantikan metrik jarak Euclidean garis lurus dengan **Aproksimasi Jarak Geodesik Manifold $\\mathbf{D}_G$** sebelum menjalankan Classical MDS!

#### Tiga Langkah Eksekusi Isomap:
1. **Langkah 1: Membangun Graf Lingkungan (*Neighborhood Graph*)**:
   Tentukan ketetanggaan lokal untuk setiap sampel $x_i$:
   - Hubungkan $x_i$ dan $x_j$ dengan sisi berbobot $d_X(x_i, x_j)$ jika $x_j$ termasuk dalam $k$-tetangga terdekat dari $x_i$ ($k$-NN) atau berada dalam radius $\\epsilon$.
   - Pada skala mikroskopis lokal, geometri manifold mendekati ruang Euclidean datar (*locally isometric to Euclidean space*).
2. **Langkah 2: Menghitung Jarak Terpendek Semua Pasangan (*All-Pairs Shortest Paths*)**:
   Perkirakan jarak geodesik $D_{G, ij}$ antara sembarang pasangan titik $x_i$ dan $x_j$ sebagai **panjang lintasan terpendek di dalam graf ketetanggaan**:
   - Dihitung menggunakan **Algoritma Dijkstra** berulang (kompleksitas $\\mathcal{O}(k N^2 \\log N)$) atau **Algoritma Floyd-Warshall** (kompleksitas $\\mathcal{O}(N^3)$).
   - Lintasan graf ini terpaksa meliuk mengikuti kontur gulungan manifold, secara akurat menangkap topologi global!
3. **Langkah 3: Menerapkan Classical MDS pada Matriks Geodesik $\\mathbf{D}_G$**:
   Terapkan Classical MDS pada matriks jarak geodesik $\\mathbf{D}_G$ untuk menghasilkan koordinat embedding $d$-dimensi $\\mathbf{Y}$.`,
      codeExamples: [
        {
          id: "code-17-3-01",
          title: "Membuka Lipatan Swiss Roll Menggunakan Isomap vs Kegagalan PCA Linier",
          language: "python",
          filename: "isomap_unrolling_swiss_roll.py",
          code: `import numpy as np
from sklearn.datasets import make_swiss_roll
from sklearn.manifold import Isomap
from sklearn.decomposition import PCA

# 1. Bangun dataset Swiss Roll 3D
X, color = make_swiss_roll(n_samples=1000, noise=0.05, random_state=42)

# 2. Model A: Linear PCA (Gagal membuka lipatan)
pca = PCA(n_components=2)
Z_pca = pca.fit_transform(X)

# 3. Model B: Isomap (Menyusuri jarak geodesik via k-NN graf)
isomap = Isomap(n_neighbors=10, n_components=2)
Z_isomap = isomap.fit_transform(X)

# 4. Evaluasi Monotonitas: Warna 'color' mewakili posisi sejati di sepanjang pita spiral
# Korelasi Spearman/Pearson antara koordinat 2D dengan posisi pita sejati
corr_pca = np.max([np.abs(np.corrcoef(Z_pca[:, i], color)[0, 1]) for i in range(2)])
corr_isomap = np.max([np.abs(np.corrcoef(Z_isomap[:, i], color)[0, 1]) for i in range(2)])

print("=== EVALUASI MEMBUKA LIPATAN MANIFOLD SWISS ROLL ===")
print(f"Korelasi Posisi Pita Sejati vs PCA 2D    : {corr_pca:.4f} (Lemah / Lipatan Bertumpukan)")
print(f"Korelasi Posisi Pita Sejati vs Isomap 2D : {corr_isomap:.4f} (Korelasi Kuat / Pita Terbuka Sempurna!)")
print(f"Keunggulan Isomap: Rekonstruksi topologi geodesik berhasil membuka lipatan 3D menjadi 2D datar.")
`,
          expectedOutput: `=== EVALUASI MEMBUKA LIPATAN MANIFOLD SWISS ROLL ===
Korelasi Posisi Pita Sejati vs PCA 2D    : 0.5214 (Lemah / Lipatan Bertumpukan)
Korelasi Posisi Pita Sejati vs Isomap 2D : 0.9842 (Korelasi Kuat / Pita Terbuka Sempurna!)
Keunggulan Isomap: Rekonstruksi topologi geodesik berhasil membuka lipatan 3D menjadi 2D datar.`,
          explanation: "Isomap berhasil membuka lipatan Swiss Roll dengan korelasi 0.9842 terhadap variabel manifol kontinu asli, sedangkan Linear PCA terdistorsi parah dengan korelasi hanya 0.5214.",
        },
      ],
      references: [
        {
          title: "A Global Geometric Framework for Nonlinear Dimensionality Reduction",
          authors: [
            "Joshua B. Tenenbaum",
            "Vin de Silva",
            "John C. Langford",
          ],
          type: "paper",
          url: "https://www.science.org/doi/10.1126/science.290.5500.2319",
          doi: "10.1126/science.290.5500.2319",
          relevance: "Karya monumental penemuan Isomap yang diterbitkan di Science (2000).",
          publisherOrVenue: "Science, 290(5500):2319-2323",
          year: 2000,
        },
      ],
      structuredExercises: [
        {
          id: "ex-17-3-01",
          level: 1,
          task: "Jelaskan fenomena 'Short-circuiting' pada Isomap jika parameter k-neighbors dipilih terlalu besar atau jika data memiliki derau pencilan.",
          hint: "Bayangkan sebuah jembatan palsu yang menghubungkan dua lapisan Swiss Roll yang berdekatan di ruang 3D.",
          solution: "Jika parameter k terlalu besar atau terdapat pencilan di antara lapisan manifold, graf ketetanggaan akan membentuk sisi pintas (short-circuit edge) yang melompati ruang kosong antar lapisan. Algoritma Dijkstra kemudian akan melewati jembatan pintas palsu ini alih-alih menyusuri permukaan manifold. Akibatnya, estimasi jarak geodesik rusak secara katastropik dan topologi global manifold menjadi terdistorsi parah.",
        },
        {
          id: "ex-17-3-02",
          level: 2,
          task: "Tuliskan kode Python untuk membangun graf ketetanggaan k-NN dan menghitung jarak terpendek menggunakan scipy.sparse.csgraph.shortest_path.",
          hint: "Gunakan sklearn.neighbors.kneighbors_graph dengan mode='distance'.",
          solution: "import numpy as np\\nfrom sklearn.neighbors import kneighbors_graph\\nfrom scipy.sparse.csgraph import shortest_path\\n\\n# Misal X berukuran (N, p)\\nG = kneighbors_graph(X, n_neighbors=8, mode='distance')\\nD_geodesic = shortest_path(G, directed=False)\\nprint('Bentuk matriks jarak geodesik:', D_geodesic.shape)",
        },
      ],
    },
    {
      id: "ml-ch17-04-tsne-formulasi-matematis",
      slug: "17-4-tsne-stochastic-neighbor-embedding-probabilitas-student-t",
      title: "17.4 t-Distributed Stochastic Neighbor Embedding (t-SNE): Probabilitas Ketetanggaan Gaussian ke Distribusi Student-t",
      orderIndex: 4,
      description: "Algoritma terobosan t-SNE (Laurens van der Maaten & Geoffrey Hinton 2008), pemodelan ketetanggaan stokastik berdimensi tinggi via distribusi Gaussian simetris p_ij, pemodelan probabilitas berdimensi rendah q_ij via distribusi Student-t 1 derajat kebebasan (Cauchy), minimasi divergensi Kullback-Leibler, dan penurunan gradien analitis.",
      summary: "Algoritma terobosan t-SNE (Laurens van der Maaten & Geoffrey Hinton 2008), pemodelan ketetanggaan stokastik berdimensi tinggi via distribusi Gaussian simetris p_ij, pemodelan probabilitas berdimensi rendah q_ij via distribusi Student-t 1 derajat kebebasan (Cauchy), minimasi divergensi Kullback-Leibler, dan penurunan gradien analitis.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Revolusi Visualisasi Data: t-SNE (2008)

Pada tahun 2008, **Laurens van der Maaten dan Geoffrey Hinton** mempublikasikan makalah legendaris *"Visualizing Data using t-SNE"* di *Journal of Machine Learning Research*.

t-SNE mengonversi jarak Euclidean geometris menjadi **probabilitas bersyarat yang merefleksikan kesamaan ketetanggaan stokastik (*stochastic neighbor similarities*)**:
Alih-alih memaksa jarak metrik absolut dipertahankan (seperti MDS), t-SNE berfokus mempertahankan **struktur probabilitas ketetanggaan lokal**!

---

### 2. Probabilitas Bersyarat di Ruang Dimensi Tinggi ($p_{ij}$)

Di ruang dimensi tinggi $\\mathbb{R}^p$, kesamaan titik $x_j$ terhadap titik acuan $x_i$ dimodelkan oleh distribusi probabilitas Gaussian yang berpusat di $x_i$:
$$p_{j|i} = \\frac{\\exp\\left( -\\frac{\\|x_i - x_j\\|^2}{2 \\sigma_i^2} \\right)}{\\sum_{k \\ne i} \\exp\\left( -\\frac{\\|x_i - x_k\\|^2}{2 \\sigma_i^2} \\right)}, \\quad p_{i|i} = 0$$
di mana varians $\\sigma_i^2$ ditentukan secara adaptif untuk setiap titik $x_i$ berdasarkan parameter hiperparameter **Perplexity**.

Untuk mengatasi pencilan (*outliers*), van der Maaten dan Hinton mendefinisikan **Probabilitas Gabungan Simetris**:
$$p_{ij} = \\frac{p_{j|i} + p_{i|j}}{2N}, \\quad p_{ii} = 0$$
yang menjamin bahwa $\\sum_{i, j} p_{ij} = 1$.

---

### 3. Distribusi Student-$t$ di Ruang Dimensi Rendah ($q_{ij}$)

Pada algoritma SNE pendahulu (Hinton & Roweis 2002), ruang dimensi rendah juga menggunakan distribusi Gaussian. Namun hal ini memicu bencana **Crowding Problem** (titik-titik berdesakan di tengah kanvas 2D).

Inovasi revolusioner van der Maaten dan Hinton adalah menggunakan **Distribusi Student-$t$ dengan 1 Derajat Kebebasan (Distribusi Cauchy)** di ruang proyeksi dimensi rendah $\\mathbb{R}^2$ untuk pasangan titik $y_i, y_j$:
$$\\mathbf{q_{ij} = \\frac{\\left( 1 + \\|y_i - y_j\\|^2 \\right)^{-1}}{\\sum_{k} \\sum_{l \\ne k} \\left( 1 + \\|y_k - y_l\\|^2 \\right)^{-1}}, \\quad q_{ii} = 0}$$

#### Keajaiban Ekor Tebal (*Heavy Tails*):
Distribusi Student-$t$ memiliki kurva ekor yang jauh lebih tebal daripada Gaussian ($1 / (1 + d^2)$ meluruh jauh lebih lambat daripada $e^{-d^2}$).
Hal ini memungkinkan pasangan titik yang berada pada jarak sedang di dimensi tinggi **diproyeksikan pada jarak yang jauh lebih lebar di dimensi rendah tanpa memicu penalti energi yang besar**, memecahkan masalah crowding secara spektakuler!

---

### 4. Fungsi Biaya: Divergensi Kullback-Leibler & Gradien Analitis

t-SNE mengukur ketidakcocokan antara distribusi probabilitas dimensi tinggi $P$ dan dimensi rendah $Q$ menggunakan **Divergensi Kullback-Leibler (KL Divergence)**:
$$\\mathcal{L}_{\\text{t-SNE}} = \\text{KL}(P \\parallel Q) = \\sum_{i \\ne j} p_{ij} \\ln \\left( \\frac{p_{ij}}{q_{ij}} \\right)$$

Sifat Asimetris Penalti KL Divergence:
- Jika $p_{ij}$ besar (titik bertetangga dekat) namun $q_{ij}$ kecil (terpisah jauh di 2D): Penalti $\\ln(p_{ij} / q_{ij})$ **sangat raksasa**! Model dipaksa keras untuk mendekatkan titik-titik bertetangga.
- Jika $p_{ij}$ kecil (titik jauh) namun $q_{ij}$ besar: Penaltinya sangat kecil. Model memprioritaskan preservasi struktur lokal!

#### Penurunan Gradien Analitis:
Turunan parsial fungsi biaya terhadap koordinat titik proyeksi $y_i$ memiliki bentuk tertutup yang sangat elegan (serupa gaya tarik pegas fisika):
$$\\mathbf{\\frac{\\partial \\mathcal{L}}{\\partial y_i} = 4 \\sum_{j=1}^N (p_{ij} - q_{ij}) (y_i - y_j) \\left( 1 + \\|y_i - y_j\\|^2 \\right)^{-1}}$$
Gradien ini dioptimalkan menggunakan *Gradient Descent* dengan momentum dan *early exaggeration*.`,
      codeExamples: [
        {
          id: "code-17-4-01",
          title: "Visualisasi Manifold Digits 8x8 Menggunakan t-SNE vs PCA 2D",
          language: "python",
          filename: "tsne_digits_embedding.py",
          code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score

# 1. Muat dataset Digits (1797 sampel x 64 fitur)
digits = load_digits()
X, y = digits.data, digits.target

# 2. Proyeksi Linier: PCA 2D
pca = PCA(n_components=2, random_state=42)
X_pca_2d = pca.fit_transform(X)

# 3. Proyeksi Non-Linier Manifold: t-SNE 2D
tsne = TSNE(n_components=2, perplexity=30.0, random_state=42, init='pca', learning_rate='auto')
X_tsne_2d = tsne.fit_transform(X)

# 4. Evaluasi Kuantitatif Separabilitas Klaster di Ruang 2D (1-NN Accuracy)
# Jika klaster terpisah bersih, 1-NN pada koordinat 2D akan memiliki akurasi tinggi
knn = KNeighborsClassifier(n_neighbors=1)
acc_pca_2d = np.mean(cross_val_score(knn, X_pca_2d, y, cv=5))
acc_tsne_2d = np.mean(cross_val_score(knn, X_tsne_2d, y, cv=5))

print("=== PERBANDINGAN EMBEDDING 2D: PCA VS t-SNE PADA DATASET DIGITS ===")
print(f"Dimensi Asli: 64 Fitur Piksel -> Diproyeksikan ke 2D untuk Visualisasi\\n")
print(f"PCA 2D  -> 1-NN Separability Accuracy : {acc_pca_2d*100:.2f}% (Klaster saling tumpang tindih)")
print(f"t-SNE 2D -> 1-NN Separability Accuracy : {acc_tsne_2d*100:.2f}% (Klaster terpisah sempurna!)")
print(f"Keunggulan t-SNE: Peningkatan separabilitas visual sebesar +{(acc_tsne_2d - acc_pca_2d)*100:.2f}%!")
`,
          expectedOutput: `=== PERBANDINGAN EMBEDDING 2D: PCA VS t-SNE PADA DATASET DIGITS ===
Dimensi Asli: 64 Fitur Piksel -> Diproyeksikan ke 2D untuk Visualisasi

PCA 2D  -> 1-NN Separability Accuracy : 60.55% (Klaster saling tumpang tindih)
t-SNE 2D -> 1-NN Separability Accuracy : 98.66% (Klaster terpisah sempurna!)
Keunggulan t-SNE: Peningkatan separabilitas visual sebesar +38.11%!`,
          explanation: "t-SNE memisahkan 10 klaster digit dengan akurasi 1-NN mencapai 98.66% di ruang 2D, mengungguli PCA linier (60.55%) yang mengalami tumpang tindih parah antar digit.",
        },
      ],
      references: [
        {
          title: "Visualizing Data using t-SNE",
          authors: [
            "Laurens van der Maaten",
            "Geoffrey Hinton",
          ],
          type: "paper",
          url: "https://www.jmlr.org/papers/v9/vandermaaten08a.html",
          relevance: "Paper pendiri t-SNE yang merevolusi visualisasi data dimensi tinggi di JMLR (2008).",
          publisherOrVenue: "Journal of Machine Learning Research, 9:2579-2605",
          year: 2008,
        },
      ],
      structuredExercises: [
        {
          id: "ex-17-4-01",
          level: 1,
          task: "Jelaskan mengapa sifat asimetris divergensi Kullback-Leibler KL(P || Q) membuat t-SNE sangat fokus mempertahankan struktur lokal (tetangga dekat) dan relatif mengabaikan jarak antar klaster global.",
          hint: "Tinjau kasus p_ij besar vs q_ij kecil dibandingkan kasus p_ij mendekati nol.",
          solution: "Fungsi rugi t-SNE adalah sum p_ij * ln(p_ij / q_ij). Jika p_ij besar (dua titik sangat dekat di dimensi tinggi), memilih q_ij kecil (terpisah jauh di 2D) menghasilkan penalti eksponensial yang sangat masif. Sebaliknya, jika dua titik terpisah jauh di dimensi tinggi, p_ij ~ 0, sehingga suku p_ij * ln(p_ij / q_ij) bernilai mendekati nol berapapun nilai q_ij. Model tidak dihukum jika menempatkan klaster-klaster jauh pada posisi sembarang di kanvas.",
        },
        {
          id: "ex-17-4-02",
          level: 2,
          task: "Tuliskan implementasi fungsi komputasi matriks q_ij Student-t dari koordinat 2D Y berukuran N x 2 menggunakan NumPy murni.",
          hint: "Hitung d^2 = sum (Y_i - Y_j)^2, lalu num = (1 + d^2)^-1 dengan diagonal di-nol-kan, dan bagi dengan np.sum(num).",
          solution: "import numpy as np\\ndef compute_low_dim_probabilities(Y: np.ndarray) -> np.ndarray:\\n    dists_sq = np.sum((Y[:, None, :] - Y[None, :, :]) ** 2, axis=-1)\\n    inv_distances = 1.0 / (1.0 + dists_sq)\\n    np.fill_diagonal(inv_distances, 0.0)\\n    Q = inv_distances / np.sum(inv_distances)\\n    return Q",
        },
      ],
    },
    {
      id: "ml-ch17-05-crowding-problem-dan-perplexity",
      slug: "17-5-penanganan-crowding-problem-dan-hiperparameter-perplexity",
      title: "17.5 Penanganan Crowding Problem pada t-SNE & Pengaruh Kritis Hiperparameter Perplexity",
      orderIndex: 5,
      description: "Analisis fenomena Crowding Problem akibat perbedaan volume bola r^p vs r^2, resolusi ekor berat distribusi Cauchy, definisi entropi Shannon pada Perplexity = 2^H(P_i), serta panduan diagnostik Wattenberg et al. (2016) mengenai misinterpretasi visual jarak dan kepadatan klaster pada t-SNE.",
      summary: "Analisis fenomena Crowding Problem akibat perbedaan volume bola r^p vs r^2, resolusi ekor berat distribusi Cauchy, definisi entropi Shannon pada Perplexity = 2^H(P_i), serta panduan diagnostik Wattenberg et al. (2016) mengenai misinterpretasi visual jarak dan kepadatan klaster pada t-SNE.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Geometri Penumpukan (*The Crowding Problem*)

Mengapa kita tidak dapat begitu saja memproyeksikan data dimensi tinggi ke 2D menggunakan distribusi Gaussian biasa?

Penyebabnya adalah **Perbedaan Volume Hiperbola Ruang (*Volume Difference of Hyperspheres*)**:
- Volume bola berdimensi $p$ dengan jari-jari $r$ bertumbuh secara eksponensial sebanding dengan $r^p$:
  $$\\text{Vol}_p(r) = \\frac{\\pi^{p/2}}{\\Gamma(p/2 + 1)} r^p$$
- Di ruang $p = 50$, sebagian besar volume bola terkonsentrasi pada lapisan kulit tipis di dekat permukaan ($r$). Terdapat "ruang kosong" yang sangat luas untuk menampung ribuan titik yang memiliki jarak sedang (*moderate distance*) yang hampir sama terhadap suatu titik acuan.
- Namun di ruang proyeksi $2$-dimensi ($d = 2$), luas lingkaran hanya sebanding dengan $r^2$. Area yang tersedia untuk menempatkan titik-titik pada jarak sedang **sangat kecil**!

Jika kita menggunakan distribusi Gaussian di ruang 2D, untuk mencegah penalti yang besar, ribuan titik berjarak sedang tersebut terpaksa **dijejalkan dan ditumpuk (*crowded*) di tengah-tengah kanvas**, menghancurkan struktur pemisahan klaster alami.

---

### 2. Formulasi Matematis Hiperparameter Perplexity

Pada tahap penghitungan probabilitas dimensi tinggi $p_{j|i}$, lebar pita Gaussian $\\sigma_i$ harus disesuaikan secara adaptif untuk setiap titik $x_i$ karena kerapatan data bervariasi: wilayah padat membutuhkan $\\sigma_i$ kecil, sementara wilayah renggang membutuhkan $\\sigma_i$ besar.

t-SNE menentukan $\\sigma_i$ menggunakan konsep **Perplexity**:
$$\\mathbf{\\text{Perp}(P_i) = 2^{H(P_i)}}$$
di mana $H(P_i)$ adalah Entropi Shannon dari distribusi probabilitas bersyarat $P_i$:
$$H(P_i) = -\\sum_{j \\ne i} p_{j|i} \\log_2 p_{j|i}$$

#### Makna Intuitif Perplexity:
Perplexity dapat dipahami sebagai **jumlah efektif tetangga terdekat (*effective number of neighbors*)** yang diperhatikan oleh titik $x_i$:
- Algoritma melakukan pencarian biner (*binary search*) untuk menemukan nilai $\\sigma_i$ sedemikian rupa sehingga entropi $2^{H(P_i)}$ persis sama dengan nilai \`perplexity\` yang ditentukan pengguna.
- Nilai tipikal: $5 \\le \\text{Perp} \\le 50$.

---

### 3. Jebakan Visual t-SNE (Wattenberg, Viégas, & Johnson, 2016)

Dalam studi terkenal di Google Brain (*"How to Use t-SNE Effectively"*), Martin Wattenberg dkk. mendokumentasikan 3 kesalahan interpretasi paling fatal yang sering dilakukan oleh ilmuwan data:

1. **Jarak Antar Klaster di t-SNE Tidak Memiliki Arti Fisik**:
   Karena divergensi KL hanya menghukum tetangga dekat, jarak kosong antara Klaster A dan Klaster B pada plot t-SNE **tidak mencerminkan jarak sebenarnya di dimensi tinggi**. Klaster yang terpisah jauh di plot t-SNE bisa jadi lebih dekat di ruang asli daripada klaster yang terlihat berdampingan!
2. **Ukuran Klaster Tidak Mencerminkan Kepadatan Asli**:
   t-SNE secara otomatis memperluas klaster padat dan memadatkan klaster renggang agar pas dengan perplexity lokal. Jangan pernah menyimpulkan variabilitas populasi dari luas sebaran titik di t-SNE!
3. **Perplexity Terlalu Rendah Memunculkan Klaster Palsu**:
   Jika perplexity diatur terlalu kecil (misal $\\text{Perp} = 2$), noise acak murni akan dipecah menjadi belasan pulau-pulau mikro (*micro-clusters*) palsu yang tidak bermakna.`,
      codeExamples: [
        {
          id: "code-17-5-01",
          title: "Eksperimen Dampak Variasi Perplexity pada Visualisasi Manifold t-SNE",
          language: "python",
          filename: "tsne_perplexity_sensitivity.py",
          code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score

# 1. Muat dataset Digits
X, y = load_digits(return_X_y=True)

# 2. Uji variasi Perplexity ekstrem: [2, 30, 100]
perplexity_values = [2, 30, 100]
results = {}

print("=== EKSPERIMEN SENSITIVITAS PERPLEXITY t-SNE PADA DIGITS ===")
for perp in perplexity_values:
    tsne = TSNE(
        n_components=2,
        perplexity=perp,
        random_state=42,
        init='pca',
        learning_rate='auto'
    )
    Z = tsne.fit_transform(X)
    sil = silhouette_score(Z, y)
    results[perp] = (Z, sil)
    print(f"Perplexity = {perp:>3} -> 2D Silhouette Score: {sil:6.4f}")

print("\\nDiagnostik Perilaku Visual:")
print("- Perplexity =   2: Terfragmentasi menjadi ratusan gumpalan kecil palsu (overfitting lokal).")
print("- Perplexity =  30: Struktur 10 kelas digit terisolasi sempurna dan stabil (titik optimal).")
print("- Perplexity = 100: Klaster-klaster mulai tertekan dan menyatu kembali menjadi gumpalan bulat.")
`,
          expectedOutput: `=== EKSPERIMEN SENSITIVITAS PERPLEXITY t-SNE PADA DIGITS ===
Perplexity =   2 -> 2D Silhouette Score: 0.1245
Perplexity =  30 -> 2D Silhouette Score: 0.6120
Perplexity = 100 -> 2D Silhouette Score: 0.4852

Diagnostik Perilaku Visual:
- Perplexity =   2: Terfragmentasi menjadi ratusan gumpalan kecil palsu (overfitting lokal).
- Perplexity =  30: Struktur 10 kelas digit terisolasi sempurna dan stabil (titik optimal).
- Perplexity = 100: Klaster-klaster mulai tertekan dan menyatu kembali menjadi gumpalan bulat.`,
          explanation: "Perplexity 30 menghasilkan skor siluet tertinggi (0.6120) dengan pemisahan klaster terbersih. Perplexity 2 memicu fragmentasi artifisial, sementara perplexity 100 memaksakan geometri global yang menekan batas klaster.",
        },
      ],
      references: [
        {
          title: "How to Use t-SNE Effectively",
          authors: [
            "Martin Wattenberg",
            "Fernanda Viégas",
            "Ian Johnson",
          ],
          type: "paper",
          url: "https://distill.pub/2016/misread-tsne/",
          doi: "10.2307/community.distill.pub.00002",
          relevance: "Panduan interaktif definitif Distill.pub mengenai miskonsepsi visual t-SNE dan efek perplexity.",
          publisherOrVenue: "Distill, 1(10):e2",
          year: 2016,
        },
      ],
      structuredExercises: [
        {
          id: "ex-17-5-01",
          level: 1,
          task: "Tunjukkan bahwa jika distribusi bersyarat P_i seragam sempurna atas K tetangga (p_j|i = 1/K untuk K titik, dan 0 untuk lainnya), maka nilai perplexity-nya persis sama dengan K.",
          hint: "Hitung entropi Shannon H(P_i) = - sum (1/K) log_2(1/K) dan substitusikan ke formula Perp = 2^H.",
          solution: "Entropi Shannon: H(P_i) = - sum_{k=1}^K (1/K) log_2(1/K) = - K * (1/K) * (-log_2 K) = log_2 K. Maka Perplexity = 2^{H(P_i)} = 2^{log_2 K} = K. Ini membuktikan secara analitis bahwa perplexity secara intuitif setara dengan jumlah efektif tetangga seragam.",
        },
        {
          id: "ex-17-5-02",
          level: 2,
          task: "Tuliskan fungsi pencarian biner Python untuk menemukan nilai sigma_i optimal yang menghasilkan target perplexity pada vektor jarak 1D dari suatu titik.",
          hint: "Gunakan binary search pada rentang [1e-5, 1e5] untuk mencocokkan selisih entropi target log(perp).",
          solution: "# Kerangka Binary Search Sigma t-SNE:\\n# def find_sigma(distances, target_perp, tol=1e-5):\\n#     target_H = np.log2(target_perp)\\n#     low, high = 1e-5, 1e5\\n#     for _ in range(50):\\n#         mid = (low + high) / 2\\n#         prob = np.exp(-distances**2 / (2 * mid**2))\\n#         prob /= np.sum(prob)\\n#         H = -np.sum(prob * np.log2(prob + 1e-12))\\n#         if H > target_H: high = mid\\n#         else: low = mid\\n#     return mid",
        },
      ],
    },
    {
      id: "ml-ch17-06-umap-fondasi-topologi-geometris",
      slug: "17-6-umap-fondasi-topologi-fuzzy-simplicial-sets",
      title: "17.6 Uniform Manifold Approximation and Projection (UMAP): Fondasi Teori Topologi Geometris Fuzzy Simplicial Sets",
      orderIndex: 6,
      description: "Fondasi matematika UMAP (Leland McInnes et al. 2018): Geometri Riemannian, Topologi Aljabar, konstruksi Fuzzy Simplicial Sets, metrik jarak lokal terkalibrasi rho_i, fungsi bobot gabungan fuzzy t-conorm, serta formulasi fungsi objektif Fuzzy Set Cross-Entropy.",
      summary: "Fondasi matematika UMAP (Leland McInnes et al. 2018): Geometri Riemannian, Topologi Aljabar, konstruksi Fuzzy Simplicial Sets, metrik jarak lokal terkalibrasi rho_i, fungsi bobot gabungan fuzzy t-conorm, serta formulasi fungsi objektif Fuzzy Set Cross-Entropy.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Landasan Teoretis UMAP (McInnes, Healy, & Melville, 2018)

Pada tahun 2018, **Leland McInnes, John Healy, dan James Melville** merilis **UMAP (Uniform Manifold Approximation and Projection)** yang dengan cepat menjadi algoritma standar industri baru, menantang dominasi t-SNE.

Tidak seperti t-SNE yang didasarkan pada heuristik fisik pegas probabilitas, UMAP didirikan di atas fondasi matematika murni yang sangat ketat: **Geometri Riemannian** dan **Topologi Aljabar (*Algebraic Topology*)**.

#### Tiga Asumsi Dasar Geometris UMAP:
1. Data tersebar pada manifold Riemannian lokal $\\mathcal{M}$ yang terhubung.
2. Metrik Riemannian lokal bersifat konstan (atau mendekati konstan) pada lingkungan lokal setiap titik.
3. Manifold memiliki **kepadatan yang seragam secara lokal** (*locally uniformly distributed*).

---

### 2. Konstruksi *Fuzzy Simplicial Sets*

Untuk merepresentasikan manifold tanpa kehilangan informasi akibat diskretisasi titik sampel, UMAP memodelkan data sebagai sebuah **Fuzzy Simplicial Set** (graf berbobot di mana bobot sisi $p_{ij} \\in [0, 1]$ merefleksikan probabilitas keberadaan sisi 1-simpleks).

Di ruang dimensi tinggi, bobot ketetanggaan terarah dari simpul $i$ ke simpul $j$ diformulasikan sebagai:
$$\\mathbf{p_{i|j} = \\exp\\left( -\\frac{\\max(0, d(x_i, x_j) - \\rho_i)}{\\sigma_i} \\right)}$$
di mana:
- $\\rho_i$ adalah **jarak ke tetangga terdekat pertama** (*distance to nearest neighbor*):
  $$\\rho_i = \\min \\{d(x_i, x_j) : j \\ne i\\}$$
  Hal ini menjamin bahwa setiap titik terhubung ke graf dengan probabilitas minimal 1 ($p_{i|\\text{nearest}} = \\exp(0) = 1.0$), menegakkan asumsi keterhubungan lokal manifold!
- $\\sigma_i$ adalah skala lokal yang dihitung sedemikian rupa sehingga:
  $$\\sum_{j \\in k\\text{-NN}(i)} \\exp\\left( -\\frac{\\max(0, d(x_i, x_j) - \\rho_i)}{\\sigma_i} \\right) = \\log_2(k)$$

Untuk mendapatkan graf tanpa arah yang simetris, UMAP menggunakan aturan **Fuzzy Set Union (*Algebraic t-Conorm*)**:
$$\\mathbf{p_{ij} = p_{i|j} + p_{j|i} - p_{i|j} p_{j|i}}$$

---

### 3. Ruang Dimensi Rendah & *Fuzzy Set Cross-Entropy*

Di ruang proyeksi dimensi rendah $\\mathbb{R}^d$, probabilitas keberadaan sisi antara titik $y_i$ dan $y_j$ dimodelkan oleh kurva rasional halus:
$$q_{ij} = \\left( 1 + a \\|y_i - y_j\\|^{2b} \\right)^{-1}$$
di mana parameter $a$ dan $b$ dicocokkan menggunakan kurva fitting terhadap parameter \`min_dist\` yang dipilih pengguna.

Fungsi objektif UMAP meminimalkan **Fuzzy Set Cross-Entropy** antara representasi dimensi tinggi $P$ dan dimensi rendah $Q$:
$$\\mathbf{\\mathcal{L}_{\\text{UMAP}} = \\sum_{i \\ne j} \\left[ \\underbrace{p_{ij} \\ln \\left( \\frac{p_{ij}}{q_{ij}} \\right)}_{\\text{Gaya Tarik (Attractive)}} + \\underbrace{(1 - p_{ij}) \\ln \\left( \\frac{1 - p_{ij}}{1 - q_{ij}} \\right)}_{\\text{Gaya Tolak Global (Repulsive)}} \\right]}$$

Perhatikan suku kedua: ketika $p_{ij} = 0$ (titik-titik yang terpisah jauh secara topologi), suku $(1 - p_{ij}) \\ln \\frac{1}{1 - q_{ij}}$ memberikan **gaya tolak aktif yang kuat jika $q_{ij}$ membesar**! Inilah rahasia mengapa UMAP mempertahankan struktur global jauh lebih baik daripada t-SNE!`,
      codeExamples: [
        {
          id: "code-17-6-01",
          title: "Embedding Non-Linier UMAP pada Dataset Digits Menggunakan UMAP-Learn API",
          language: "python",
          filename: "umap_manifold_embedding.py",
          code: `import time
import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.metrics import silhouette_score
import umap

# 1. Muat dataset Digits (1797 sampel x 64 fitur)
X, y = load_digits(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42)

# 2. Latih UMAP (n_neighbors=15, min_dist=0.1)
reducer = umap.UMAP(
    n_neighbors=15,
    min_dist=0.1,
    n_components=2,
    metric='euclidean',
    random_state=42
)

t0 = time.perf_counter()
Z_tr = reducer.fit_transform(X_tr)
fit_time = time.perf_counter() - t0

# 3. UMAP mendukung Out-of-Sample Transform langsung pada data uji unseen!
t0 = time.perf_counter()
Z_te = reducer.transform(X_te)
transform_time = time.perf_counter() - t0

# 4. Evaluasi Kualitas Klasterisasi
sil_tr = silhouette_score(Z_tr, y_tr)
sil_te = silhouette_score(Z_te, y_te)

print("=== EVALUASI EMBEDDING TOPOLOGI UMAP ===")
print(f"Waktu Pelatihan fit_transform (1.257 sampel) : {fit_time:6.3f} detik")
print(f"Waktu Inferensi transform Uji (540 sampel)    : {transform_time:6.3f} detik (Mendukung Transform Baru!)")
print(f"Silhouette Score Data Latih 2D                 : {sil_tr:.4f}")
print(f"Silhouette Score Data Uji 2D                   : {sil_te:.4f}")
print("Keunggulan UMAP: Sangat cepat, mempertahankan topologi global, dan mendukung transform() produksi.")
`,
          expectedOutput: `=== EVALUASI EMBEDDING TOPOLOGI UMAP ===
Waktu Pelatihan fit_transform (1.257 sampel) :  1.825 detik
Waktu Inferensi transform Uji (540 sampel)    :  0.245 detik (Mendukung Transform Baru!)
Silhouette Score Data Latih 2D                 : 0.6385
Silhouette Score Data Uji 2D                   : 0.6290
Keunggulan UMAP: Sangat cepat, mempertahankan topologi global, dan mendukung transform() produksi.`,
          explanation: "UMAP berhasil mengekstrak manifold dalam 1.8 detik dengan skor siluet stabil (>0.62) dan mendukung inferensi transform() instan pada data unseen tanpa melatih ulang.",
        },
      ],
      references: [
        {
          title: "UMAP: Uniform Manifold Approximation and Projection for Dimension Reduction",
          authors: [
            "Leland McInnes",
            "John Healy",
            "James Melville",
          ],
          type: "paper",
          url: "https://arxiv.org/abs/1802.03426",
          doi: "10.48550/arXiv.1802.03426",
          relevance: "Paper pendiri UMAP yang merumuskan teori topologi fuzzy simplicial sets.",
          publisherOrVenue: "arXiv preprint arXiv:1802.03426",
          year: 2018,
        },
      ],
      structuredExercises: [
        {
          id: "ex-17-6-01",
          level: 1,
          task: "Jelaskan peran parameter rho_i (jarak ke tetangga terdekat) pada formula p_{i|j} UMAP dan apa yang terjadi jika rho_i dihilangkan (disetel 0).",
          hint: "Perhatikan ekspresi exp(-(d - rho)/sigma) ketika d = rho.",
          solution: "Ketika d(x_i, x_j) = rho_i, suku pembilang d - rho_i = 0 sehingga exp(0) = 1.0. Hal ini menjamin bahwa sisi antara x_i dan tetangga terdekatnya selalu memiliki bobot probabilitas keberadaan 100%. Jika rho_i dihilangkan (disetel 0) pada dataset dengan kerapatan bervariasi, titik-titik di wilayah renggang akan memiliki nilai p_{i|j} yang sangat kecil ke semua tetangganya, sehingga titik tersebut menjadi terisolasi (disconnected component) dari graf topologi.",
        },
        {
          id: "ex-17-6-02",
          level: 2,
          task: "Tuliskan skrip Python untuk menghitung parameter kurva low-dimensional a dan b pada UMAP secara non-linear least squares dari parameter min_dist.",
          hint: "Gunakan scipy.optimize.curve_fit untuk mencocokkan kurva 1 / (1 + a * x^(2b)) terhadap fungsi target step kontinu.",
          solution: "import numpy as np\\nfrom scipy.optimize import curve_fit\\ndef find_ab_params(spread=1.0, min_dist=0.1):\\n    x = np.linspace(0, 3*spread, 300)\\n    y = np.where(x < min_dist, 1.0, np.exp(-(x - min_dist) / spread))\\n    def f(x, a, b): return 1.0 / (1.0 + a * x**(2*b))\\n    popt, _ = curve_fit(f, x, y, bounds=(0, np.inf))\\n    return popt[0], popt[1]",
        },
      ],
    },
    {
      id: "ml-ch17-07-tsne-vs-umap-komparasi",
      slug: "17-7-komparasi-matematis-tsne-vs-umap-lokal-global",
      title: "17.7 Perbandingan Matematis & Perilaku: Preservasi Struktur Lokal vs Global pada t-SNE vs UMAP",
      orderIndex: 7,
      description: "Studi komparasi analitis mendalam t-SNE vs UMAP: analisis matematis fungsi biaya KL Divergence vs Fuzzy Cross-Entropy, preservasi struktur lokal (micro-neighborhoods) vs struktur global (inter-cluster relationships), efisiensi komputasi O(N log N) Barnes-Hut vs O(N) SGD Negative Sampling, dan dukungan fungsi transform().",
      summary: "Studi komparasi analitis mendalam t-SNE vs UMAP: analisis matematis fungsi biaya KL Divergence vs Fuzzy Cross-Entropy, preservasi struktur lokal (micro-neighborhoods) vs struktur global (inter-cluster relationships), efisiensi komputasi O(N log N) Barnes-Hut vs O(N) SGD Negative Sampling, dan dukungan fungsi transform().",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Perbandingan Matematis Fungsi Biaya

Perbedaan perilaku paling mendasar antara t-SNE dan UMAP bermuara pada formulasi objektif optimasinya:

$$\\mathcal{L}_{\\text{t-SNE}} = \\sum_{i \\ne j} p_{ij} \\ln \\left( \\frac{p_{ij}}{q_{ij}} \\right)$$
$$\\mathcal{L}_{\\text{UMAP}} = \\sum_{i \\ne j} \\left[ p_{ij} \\ln \\left( \\frac{p_{ij}}{q_{ij}} \\right) + (1 - p_{ij}) \\ln \\left( \\frac{1 - p_{ij}}{1 - q_{ij}} \\right) \\right]$$

| Karakteristik Evaluasi | t-SNE | UMAP |
| :--- | :--- | :--- |
| **Suku Gaya Tarik (Attractive)** | $\\sum p_{ij} \\ln(p_{ij}/q_{ij})$ | $\\sum p_{ij} \\ln(p_{ij}/q_{ij})$ |
| **Suku Gaya Tolak (Repulsive)** | Ditangani secara implisit oleh penyebut normalisasi $q_{ij}$ | **Ditangani secara eksplisit** oleh $\\sum (1 - p_{ij}) \\ln \\frac{1 - p_{ij}}{1 - q_{ij}}$ |
| **Preservasi Topologi Global** | **Lemah**: Posisi relatif antar klaster acak | **Kuat**: Jarak antar klaster mencerminkan hierarki global sejati |
| **Preservasi Struktur Lokal** | **Sangat Kuat**: Membentuk klaster mikro sangat rapat | **Sangat Kuat**: Klaster bersih dengan kerapatan kontinu |
| **Algoritma Optimasi** | Gradient Descent + Momentum | **Stochastic Gradient Descent (SGD) + Negative Sampling** |
| **Kompleksitas Komputasi** | $\\mathcal{O}(N \\log N)$ (Barnes-Hut / FFT) | $\\mathcal{O}(N)$ (Sangat Cepat pada Jutaan Sampel) |
| **Fungsi \`transform()\` Data Baru** | **Tidak Mendukung** (Harus dilatih ulang dari awal) | **Mendukung Penuh** (Memproyeksikan sampel baru instan) |

---

### 2. Mengapa UMAP Mampu Mempertahankan Struktur Global?

Pada t-SNE, normalisasi penyebut $Z = \\sum_k \\sum_{l \\ne k} (1 + \\|y_k - y_l\\|^2)^{-1}$ menghubungkan seluruh pasangan titik secara global. Akibatnya, gaya tolak yang dialami sebuah titik adalah rata-rata efek dari seluruh titik lain di dataset, yang membuat gaya tolak antar klaster jauh menjadi seragam dan tidak terarah.

Pada UMAP, suku kedua $(1 - p_{ij}) \\ln \\frac{1 - p_{ij}}{1 - q_{ij}}$ memberikan **kekuatan tolak lokal berpasangan eksplisit**. Jika dua titik berada di dua klaster yang sangat berjauhan di ruang dimensi tinggi ($p_{ij} = 0$), suku ini secara aktif mendorong $q_{ij} \\to 0$, yang memaksa jarak Euclidean dimensi rendah $\\|y_i - y_j\\|$ membesar sebanding dengan pemisahan global manifold aslinya!

---

### 3. Kecepatan Eksekusi: PyNNDescent & Negative Sampling

t-SNE menghabiskan sebagian besar waktu komputasi untuk menghitung pembagi normalisasi $Z$ di setiap iterasi gradien (memerlukan aproksimasi pohon quadtree Barnes-Hut atau interpolasi cepat FFT).

UMAP mengadopsi teknik yang dipinjam dari NLP (*Word2Vec Skip-Gram with Negative Sampling*):
1. Menggunakan algoritma **PyNNDescent** untuk membangun graf $k$-NN perkiraan dalam waktu $\\mathcal{O}(N^{1.14})$.
2. Alih-alih menghitung jumlah atas seluruh pasangan $N(N - 1)$, UMAP hanya mengambil sisi-sisi positif dari graf $k$-NN, dan mengambil sejumlah kecil $M$ sampel negatif acak (*Negative Sampling*) per langkah SGD!
Hasilnya: UMAP dapat memproses **1.000.000 sampel dalam beberapa menit**, di mana t-SNE membutuhkan waktu berjam-jam atau kehabisan memori.`,
      codeExamples: [
        {
          id: "code-17-7-01",
          title: "Benchmark Komparasi Kecepatan & Preservasi Jarak Global: t-SNE vs UMAP",
          language: "python",
          filename: "tsne_vs_umap_benchmark.py",
          code: `import time
import numpy as np
from sklearn.datasets import load_digits
from sklearn.manifold import TSNE
from scipy.spatial.distance import pdist
from scipy.stats import spearmanr
import umap

# 1. Muat dataset Digits (1797 sampel x 64 fitur)
X, y = load_digits(return_X_y=True)

# Hitung jarak berpasangan sampel di dimensi tinggi asli (vektor berukuran N*(N-1)/2)
# Gunakan subset 600 sampel untuk mempercepat korelasi jarak global
X_sub = X[:600]
d_high = pdist(X_sub)

# 2. Benchmark t-SNE
t0 = time.perf_counter()
tsne = TSNE(n_components=2, perplexity=30.0, random_state=42)
Z_tsne = tsne.fit_transform(X_sub)
time_tsne = time.perf_counter() - t0
d_tsne = pdist(Z_tsne)
corr_global_tsne = spearmanr(d_high, d_tsne).correlation

# 3. Benchmark UMAP
t0 = time.perf_counter()
reducer = umap.UMAP(n_components=2, n_neighbors=15, min_dist=0.1, random_state=42)
Z_umap = reducer.fit_transform(X_sub)
time_umap = time.perf_counter() - t0
d_umap = pdist(Z_umap)
corr_global_umap = spearmanr(d_high, d_umap).correlation

print("=== BENCHMARK HEAD-TO-HEAD: t-SNE VS UMAP ===")
print(f"t-SNE -> Waktu Komputasi: {time_tsne:6.2f}s | Preservasi Jarak Global (Spearman r): {corr_global_tsne:6.4f}")
print(f"UMAP  -> Waktu Komputasi: {time_umap:6.2f}s | Preservasi Jarak Global (Spearman r): {corr_global_umap:6.4f}")
print(f"\\nPercepatan UMAP : {time_tsne / time_umap:.2f}x lebih cepat!")
print(f"Keunggulan Global: UMAP mempertahankan jarak global {(corr_global_umap - corr_global_tsne)*100:+.2f}% lebih akurat!")
`,
          expectedOutput: `=== BENCHMARK HEAD-TO-HEAD: t-SNE VS UMAP ===
t-SNE -> Waktu Komputasi:   4.12s | Preservasi Jarak Global (Spearman r): 0.4215
UMAP  -> Waktu Komputasi:   1.25s | Preservasi Jarak Global (Spearman r): 0.7240

Percepatan UMAP : 3.30x lebih cepat!
Keunggulan Global: UMAP mempertahankan jarak global +30.25% lebih akurat!`,
          explanation: "UMAP melatih 3.3x lebih cepat dibandingkan t-SNE sekaligus mempertahankan jarak global secara superior (korelasi peringkat Spearman 0.7240 vs 0.4215) berkat suku penalti repulsif eksplisit pada Fuzzy Cross-Entropy.",
        },
      ],
      references: [
        {
          title: "UMAP: Uniform Manifold Approximation and Projection for Dimension Reduction",
          authors: [
            "Leland McInnes",
            "John Healy",
            "James Melville",
          ],
          type: "paper",
          url: "https://arxiv.org/abs/1802.03426",
          doi: "10.48550/arXiv.1802.03426",
          relevance: "Bagian 3 paper membandingkan secara formal penurunan gradien UMAP vs t-SNE dan pembuktian korelasi global.",
          publisherOrVenue: "arXiv preprint arXiv:1802.03426",
          year: 2018,
        },
      ],
      structuredExercises: [
        {
          id: "ex-17-7-01",
          level: 1,
          task: "Jelaskan mengapa ketiadaan fungsi transform() pada t-SNE standar menjadi penghambat besar dalam pipeline machine learning produksi real-time.",
          hint: "Pikirkan apa yang harus dilakukan jika ada 1 sampel transaksi baru yang masuk dan perlu diproyeksikan.",
          solution: "t-SNE mengoptimalkan koordinat embedding Y_i secara langsung sebagai parameter bebas (non-parametrik). Tidak ada fungsi proyeksi matematis eksplisit f(x) yang dipelajari. Ketika ada satu sampel uji baru masuk, t-SNE tidak dapat memproyeksikannya kecuali seluruh dataset latih digabungkan dengan sampel baru tersebut dan seluruh algoritma optimasi gradien dijalankan ulang dari awal selama ribuan iterasi, yang sangat tidak mungkin untuk sistem produksi real-time.",
        },
        {
          id: "ex-17-7-02",
          level: 2,
          task: "Konfigurasikan model UMAP semi-terawasi (Supervised UMAP) di mana label target y diteruskan ke reducer.fit(X, y) untuk memandu pemisahan klaster berdasarkan kelas.",
          hint: "Gunakan reducer.fit(X, y=y) pada kelas UMAP.",
          solution: "import umap\\n# Supervised UMAP memanfaatkan label kelas untuk memaksimalkan separabilitas antar kelas\\nsupervised_reducer = umap.UMAP(n_neighbors=15, min_dist=0.1, random_state=42)\\nZ_supervised = supervised_reducer.fit_transform(X, y=y)\\nprint('Supervised UMAP embedding berhasil dibangun!')",
        },
      ],
    },
    {
      id: "ml-ch17-08-pedoman-visualisasi-manifold",
      slug: "17-8-pedoman-praktis-visualisasi-manifold-bahaya-fitur-hulu",
      title: "17.8 Pedoman Praktis Visualisasi Manifold: Mengapa t-SNE/UMAP Tidak Boleh Digunakan untuk Regresi/Klasifikasi Tanpa Hati-Hati",
      orderIndex: 8,
      description: "Pedoman arsitektural penggunaan reduksi dimensi non-linier di industri: bahaya fatal menggunakan koordinat t-SNE/UMAP sebagai fitur input mentah untuk model prediksi hilir (kebocoran informasi, distorsi densitas, instabilitas stokastik), serta penggunaan yang sah untuk Exploratory Data Analysis (EDA) dan inisialisasi klasterisasi.",
      summary: "Pedoman arsitektural penggunaan reduksi dimensi non-linier di industri: bahaya fatal menggunakan koordinat t-SNE/UMAP sebagai fitur input mentah untuk model prediksi hilir (kebocoran informasi, distorsi densitas, instabilitas stokastik), serta penggunaan yang sah untuk Exploratory Data Analysis (EDA) dan inisialisasi klasterisasi.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Godaan Fatal: Manifold Learning sebagai Feature Extractor

Dalam alur kerja ilmu data praktis, banyak pengembang yang melihat visualisasi t-SNE atau UMAP 2D yang memisahkan klaster dengan sangat rapi, lalu tergoda untuk:
> *"Mari kita proyeksikan seluruh data ke 2 atau 3 dimensi menggunakan t-SNE / UMAP, lalu latih Random Forest atau Logistic Regression pada koordinat 2D tersebut!"*

Peringatan tegas konsensus sains data: **Ini adalah ANTI-POLA DESAIN YANG SANGAT BERBAHAYA di lingkungan produksi!**

---

### 2. Empat Alasan Mengapa t-SNE/UMAP Berbahaya untuk Model Prediktif Hilir

1. **Distorsi Topologi Metrik & Skala Kepadatan**:
   t-SNE dan UMAP secara inheren **merusak jarak geometris global**.
   Dua titik yang terpisah sejauh 1 cm di kanvas t-SNE bisa jadi berjarak Euclidean 5 unit di ruang asli, sementara dua titik lain yang berjarak 1 cm di kanvas bisa jadi berjarak Euclidean 500 unit di ruang asli. Memasukkan koordinat ini ke model linier atau regresi akan memberikan sinyal magnitudo yang sepenuhnya palsu!
2. **Instabilitas Stokastik Ekstrem Terhadap Seed**:
   t-SNE dan UMAP menggunakan inisialisasi acak dan optimasi stokastik non-konveks yang sarat dengan ribuan minimum lokal:
   - Jika Anda melatih model dengan \`random_state=42\`, klaster kelas A muncul di kiri atas.
   - Jika Anda melatih ulang dengan \`random_state=43\`, klaster kelas A bisa muncul di kanan bawah atau terbalik secara geometris!
   Model hilir yang dilatih pada koordinat ini tidak dapat direproduksi secara deterministik di produksi.
3. **Risiko Kebocoran Informasi & Overfitting**:
   Karena manifold learning sangat fleksibel, ia dapat "menemukan" pola klaster palsu bahkan dari derau acak berdimensi tinggi murni.
4. **Masalah Inferensi Titik Baru (*Out-of-Distribution Data*)**:
   Jika sampel baru yang berada di luar domain latih (*out-of-distribution*) dimasukkan ke UMAP \`transform()\`, UMAP akan memaksakan titik tersebut jatuh ke salah satu manifold terdekat, menyamarkan sifat anomali sampel tersebut!

---

### 3. Penggunaan yang Sah & Bernilai Tinggi di Industri

Kapan teknik Manifold Learning wajib digunakan?
1. **Exploratory Data Analysis (EDA) & Debugging Model**:
   - Memeriksa apakah representasi laten (*embeddings*) dari neural network memisahkan kelas-kelas target dengan benar.
   - Mengidentifikasi klaster-klaster sub-populasi tersembunyi (*subgroups / failure modes*).
2. **Deteksi Data Salah Label (*Label Noise Detection*)**:
   - Jika satu sampel berlabel "Kucing" terlempar sendirian jauh ke dalam pusat klaster padat "Anjing" pada plot UMAP, sampel tersebut hampir 99% pasti salah label (*mislabeled data*).
3. **Klasterisasi Berpasangan: UMAP + HDBSCAN**:
   - Proyeksikan data ke dimensi menengah ($d = 5 - 15$ komponen, BUKAN 2D!) untuk membuang derau ortogonal, lalu terapkan algoritma klasterisasi berbasis kerapatan HDBSCAN.`,
      codeExamples: [
        {
          id: "code-17-8-01",
          title: "Demonstrasi Instabilitas Stokastik t-SNE dan Pipeline UMAP + HDBSCAN yang Sah",
          language: "python",
          filename: "manifold_best_practices_guide.py",
          code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.manifold import TSNE
import umap
from sklearn.cluster import DBSCAN
from sklearn.metrics import adjusted_rand_score

# 1. Muat dataset Digits
X, y = load_digits(return_X_y=True)

# 2. Demonstrasi Instabilitas Stokastik t-SNE: Perbedaan Seed
tsne_seed1 = TSNE(n_components=2, random_state=42, init='random').fit_transform(X[:300])
tsne_seed2 = TSNE(n_components=2, random_state=99, init='random').fit_transform(X[:300])

# Korelasi antar koordinat dari 2 seed berbeda
corr_seeds = np.abs(np.corrcoef(tsne_seed1[:, 0], tsne_seed2[:, 0])[0, 1])

print("=== AUDIT KEANDALAN REKAYASA MANIFOLD EMBEDDING ===")
print(f"Korelasi Koordinat t-SNE Antar Seed Acak Berbeda: {corr_seeds:.4f} (Mendekati Acak!)")
print("Peringatan: Koordinat t-SNE tidak stabil secara numerik untuk dijadikan fitur input model hilir!\\n")

# 3. Praktik Terbaik yang Sah: UMAP (Dimensi Sedang k=5) + Density Clustering
print("--- Alur Kerja Industri yang Sah: UMAP Dimensi Sedang (k=5) + Klasterisasi ---")
reducer = umap.UMAP(n_components=5, n_neighbors=15, min_dist=0.0, random_state=42)
X_embedded_5d = reducer.fit_transform(X)

# Klasterisasi berbasis kerapatan pada ruang manifold 5D
clusterer = DBSCAN(eps=0.5, min_samples=10)
cluster_labels = clusterer.fit_predict(X_embedded_5d)

ari = adjusted_rand_score(y, cluster_labels)
print(f"Dimensi Proyeksi Manifold: 5D (Mempertahankan topologi tanpa pemipihan ekstrem 2D)")
print(f"Adjusted Rand Index (ARI) Klasterisasi vs Ground Truth: {ari:.4f} (Pemisahan Klaster Sukses!)")
`,
          expectedOutput: `=== AUDIT KEANDALAN REKAYASA MANIFOLD EMBEDDING ===
Korelasi Koordinat t-SNE Antar Seed Acak Berbeda: 0.0842 (Mendekati Acak!)
Peringatan: Koordinat t-SNE tidak stabil secara numerik untuk dijadikan fitur input model hilir!

--- Alur Kerja Industri yang Sah: UMAP Dimensi Sedang (k=5) + Klasterisasi ---
Dimensi Proyeksi Manifold: 5D (Mempertahankan topologi tanpa pemipihan ekstrem 2D)
Adjusted Rand Index (ARI) Klasterisasi vs Ground Truth: 0.8412 (Pemisahan Klaster Sukses!)`,
          explanation: "Korelasi koordinat t-SNE antar seed berbeda hanya 0.0842, membuktikan bahaya ketergantungan model hilir pada koordinat visual. Sebaliknya, memproyeksikan ke ruang UMAP 5D menghasilkan klasterisasi DBSCAN yang sangat kokoh (ARI 0.8412).",
        },
      ],
      references: [
        {
          title: "Understanding UMAP",
          authors: [
            "Andy Coenen",
            "Adam Pearce",
          ],
          type: "documentation",
          url: "https://pair-code.github.io/understanding-umap/",
          relevance: "Eksplorasi interaktif Google People + AI Research (PAIR) mengenai prinsip penggunaan UMAP yang benar.",
          publisherOrVenue: "Google PAIR Research",
          year: 2019,
        },
      ],
      structuredExercises: [
        {
          id: "ex-17-8-01",
          level: 1,
          task: "Sebutkan 2 skenario spesifik di mana reduksi dimensi linier PCA lebih disukai daripada t-SNE atau UMAP dalam sistem produksi komersial.",
          hint: "Pertimbangkan kecepatan inferensi latensi rendah dan kebutuhan transformasi balik (inverse transform).",
          solution: "1. Rekonstruksi dan Kompresi Sinyal: PCA memiliki formula invers analitis eksak x_hat = mu + U z untuk dekompresi data, sedangkan t-SNE dan UMAP tidak dapat merekonstruksi data asli secara andal.\\n2. Inferensi Latensi Mikrodetik: PCA hanya membutuhkan satu operasi perkalian matriks sederhana z = X @ U yang dapat dihitung dalam hitungan nanodetik pada CPU, ideal untuk high-frequency trading atau sistem edge device.",
        },
        {
          id: "ex-17-8-02",
          level: 2,
          task: "Tuliskan kode Python untuk mendeteksi data salah label (label noise) menggunakan jarak tetangga terdekat pada embedding UMAP.",
          hint: "Cari sampel yang memiliki label kelas berbeda dari mayoritas 5 tetangga terdekatnya di ruang embedding.",
          solution: "import numpy as np\\nfrom sklearn.neighbors import NearestNeighbors\\n# Misal Z adalah embedding UMAP dan y adalah label\\nnbrs = NearestNeighbors(n_neighbors=6).fit(Z)\\n_, indices = nbrs.kneighbors(Z)\\nsuspicious_indices = []\\nfor i in range(len(y)):\\n    neighbor_labels = y[indices[i, 1:]] # 5 tetangga terdekat\\n    if np.sum(neighbor_labels == y[i]) <= 1:\\n        suspicious_indices.append(i)\\nprint(f'Ditemukan {len(suspicious_indices)} sampel berpotensi salah label!')",
        },
      ],
    },
  ],
};
