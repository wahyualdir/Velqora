import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: RECOMMENDATION SYSTEM (TOPIK 23) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Koren, Y., Bell, R., & Volinsky, C. (2009). Matrix Factorization Techniques for Recommender Systems. IEEE Computer.
 * - Covington, P., Adams, J., & Sargin, E. (2016). Deep Neural Networks for YouTube Recommendations. ACM RecSys.
 * - He, X., et al. (2017). Neural Collaborative Filtering. WWW 2017.
 * - He, X., et al. (2020). LightGCN: Simplifying and Powering Graph Convolution Network for Recommendation. ACM SIGIR.
 * - Cheng, H. T., et al. (2016). Wide & Deep Learning for Recommender Systems. ACM RecSys.
 */
export const recommendationSystemCurriculum: AcademicCurriculum = {
  id: "recommendation-system",
  slug: "recommendation-system",
  title: "Recommendation System",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Arsitektur sistem temu balik rekomendasi personalisasi skala industri: pemfilteran kolaboratif pengguna/item, faktorisasi matriks laten (SVD & Implicit ALS), pola dua tahap (Candidate Generation & Heavy Ranking YouTube DNN), Wide & Deep Learning, Neural Collaborative Filtering (NCF), LightGCN, serta metrik perankingan (Hit Rate@K, MRR, NDCG@K).",
  estimatedHours: 54,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Matrix Factorization Techniques for Recommender Systems",
      authors: ["Yehuda Koren", "Robert Bell", "Chris Volinsky"],
      type: "paper",
      url: "https://ieeexplore.ieee.org/document/5197422",
      doi: "10.1109/MC.2009.263",
      relevance: "Makalah pemenang kompetisi Netflix Prize mengenai model faktor laten dan bias pengguna/item.",
      year: 2009,
      publisherOrVenue: "IEEE Computer",
    },
    {
      title: "Deep Neural Networks for YouTube Recommendations",
      authors: ["Paul Covington", "Jay Adams", "Emre Sargin"],
      type: "paper",
      url: "https://dl.acm.org/doi/10.1145/2959100.2959190",
      doi: "10.1145/2959100.2959190",
      relevance: "Pola arsitektur industri dua tahap: Candidate Generation (skala jutaan video) dan Ranking (skala ratusan).",
      year: 2016,
      publisherOrVenue: "ACM RecSys 2016",
    },
    {
      title: "LightGCN: Simplifying and Powering Graph Convolution Network for Recommendation",
      authors: ["Xiangnan He", "Kuan Deng", "Xiang Wang", "Yan Li", "Yongdong Zhang", "Meng Wang"],
      type: "paper",
      url: "https://arxiv.org/abs/2002.02126",
      doi: "10.1145/3397271.3401063",
      relevance: "Arsitektur Graph Convolutional Network yang disederhanakan murni untuk propagasi ketetanggaan pengguna-item.",
      year: 2020,
      publisherOrVenue: "ACM SIGIR 2020",
    },
  ],
  chapters: [
    {
      id: "rec-bab-1",
      slug: "collaborative-filtering-dan-matrix-factorization",
      title: "BAB 1: Pemfilteran Kolaboratif & Faktorisasi Matriks Laten (SVD/ALS)",
      orderIndex: 1,
      description: "Dekomposisi matriks interaksi pengguna-item yang renggang ($R \\approx P \\cdot Q^T$), estimasi bias baseline, regularisasi L2, dan penurunan algoritma Alternating Least Squares (ALS) untuk implicit feedback.",
      subchapters: [
        {
          id: "rec-bab-1-1",
          slug: "formulasi-matematis-svd-recsys",
          title: "1.1. Formulasi Matematika Model Faktor Laten SVD (Koren et al., 2009)",
          orderIndex: 1,
          description: "Memprediksi rating tak teramati $\\hat{r}_{ui} = \\mu + b_u + b_i + p_u^T q_i$ melalui minimasi kerugian kuadrat ter-regularisasi.",
          content_markdown: `# 1.1. Formulasi Matematika Model Faktor Laten SVD (Koren et al., 2009)

## 1. Problem Sparsity Matriks Interaksi
Matriks rating pengguna-item $R \\in \\mathbb{R}^{m \\times n}$ pada sistem nyata (seperti Netflix atau Tokopedia) memiliki tingkat kekosongan (*sparsity*) $>99\\%$. Sebagian besar pengguna hanya berinteraksi dengan puluhan dari jutaan item yang tersedia.

## 2. Model Baseline Predictor
Sebagian besar variasi rating berasal dari efek bias intrinsik:
$$b_{ui} = \\mu + b_u + b_i$$
Di mana:
- $\\mu$: Rata-rata rating seluruh sistem secara global.
- $b_u$: Bias pengguna $u$ (misal: pengguna yang cenderung selalu memberi nilai kritis rendah).
- $b_i$: Bias item $i$ (misal: film mahakarya yang secara konsisten dinilai tinggi).

## 3. Faktor Laten & Fungsi Objektif SVD
Interaksi spesifik dimodelkan sebagai hasil kali dalam vektor profil laten pengguna $\\mathbf{p}_u \\in \\mathbb{R}^f$ dan vektor atribut laten item $\\mathbf{q}_i \\in \\mathbb{R}^f$:

$$\\hat{r}_{ui} = \\mu + b_u + b_i + \\mathbf{p}_u^T \\mathbf{q}_i$$

Fungsi objektif yang diminimalkan melintasi himpunan rating teramati $\\mathcal{K} = \\{(u, i) \\mid r_{ui} \\text{ diketahui}\\}$:

$$\\min_{p, q, b} \\sum_{(u, i) \\in \\mathcal{K}} \\left( r_{ui} - \\hat{r}_{ui} \\right)^2 + \\lambda \\left( b_u^2 + b_i^2 + \\|\\mathbf{p}_u\\|_2^2 + \\|\\mathbf{q}_i\\|_2^2 \\right)$$

Dioptimalkan menggunakan Stochastic Gradient Descent (SGD) atau Alternating Least Squares (ALS).
`,
        },
      ],
    },
    {
      id: "rec-bab-2",
      slug: "arsitektur-dua-tahap-candidate-dan-ranking",
      title: "BAB 2: Arsitektur Dua Tahap Industri: Candidate Generation & Ranking",
      orderIndex: 2,
      description: "Pola arsitektur standar produksi YouTube RecSys (Covington et al. 2016): penyaringan jutaan video ke ratusan kandidat dengan Two-Tower DNN, diikuti model Heavy Ranking berbasis fitur kontekstual lengkap.",
      subchapters: [
        {
          id: "rec-bab-2-1",
          slug: "funnel-rekomendasi-youtube-dnn",
          title: "2.1. Funnel Rekomendasi Industri: Candidate Retrieval vs Scoring",
          orderIndex: 1,
          description: "Trade-off latensi vs akurasi: pencarian ANN berbasis MIPS di tahap awal dan evaluasi fitur terinci di tahap penilaian.",
          content_markdown: `# 2.1. Funnel Rekomendasi Industri: Candidate Retrieval vs Scoring

## 1. Funnel Rekomendasi Dua Tahap (YouTube DNN)
1. **Tahap 1: Candidate Generation (Nomination)**
   - *Input*: Seluruh korpus video (skala $\\approx 10^9$).
   - *Tugas*: Mengambil $K \\approx 100-500$ video paling relevan bagi pengguna berdasarkan riwayat tontonan dan demografi.
   - *Metode*: Jaringan saraf Two-Tower yang memetakan pengguna ke vektor embedding, kemudian memanggil indeks pencarian tetangga terdekat terakselerasi (*Approximate MIPS*) dalam waktu $< 10\\text{ ms}$.
2. **Tahap 2: Heavy Ranking (Scoring)**
   - *Input*: Ratusan video kandidat dari Tahap 1.
   - *Tugas*: Memprediksi secara presisi probabilitas klik atau durasi waktu menonton (*expected watch time*).
   - *Metode*: Jaringan saraf dalam dengan rekayasa fitur masif (fitur kontekstual perangkat, waktu tayang, interaksi silang pengguna-item, dan waktu sejak penayangan terakhir).
`,
        },
      ],
    },
    {
      id: "rec-bab-3",
      slug: "deep-learning-recsys-wide-deep-dan-ncf",
      title: "BAB 3: Deep Learning RecSys: Wide & Deep dan NCF",
      orderIndex: 3,
      description: "Model personalisasi berbasis jaringan saraf tiruan: Wide & Deep (Cheng et al. Google 2016) untuk menyeimbangkan memorization dan generalization, serta Neural Collaborative Filtering (He et al. WWW 2017).",
      subchapters: [
        {
          id: "rec-bab-3-1",
          slug: "wide-and-deep-dan-neural-collaborative-filtering",
          title: "3.1. Arsitektur Wide & Deep (Google) & Neural Matrix Factorization",
          orderIndex: 1,
          description: "Mengkombinasikan model linier dengan fitur cross-product jarang dan model deep neural network dengan embedding padat kontinu.",
          content_markdown: `# 3.1. Arsitektur Wide & Deep (Google) & Neural Matrix Factorization

## 1. Paradigma Wide & Deep (Cheng et al., 2016)
- **Komponen Wide (Memorization)**: Regresi linear tunggal yang memproses fitur interaksi silang diskrit yang jarang (*cross-product transformations*, misal: \`UserInstalled=Netflix\` $\\times$ \`Impression=Hulu\`). Menghafal korelasi aturan spesifik historis.
- **Komponen Deep (Generalization)**: Multi-Layer Perceptron yang menerima embedding kontinu berdimensi rendah. Menemukan kombinasi item baru yang belum pernah muncul bersamaan di data latih.

Prediksi gabungan:
$$P(Y = 1 \\mid \\mathbf{x}) = \\sigma\\left( \\mathbf{w}_{\\text{wide}}^T [\\mathbf{x}, \\phi(\\mathbf{x})] + \\mathbf{w}_{\\text{deep}}^T a^{(L)} + b \\right)$$

## 2. Neural Collaborative Filtering (NCF) (He et al., 2017)
Menggantikan perkalian titik dot product linier $\\mathbf{p}_u^T \\mathbf{q}_i$ yang kaku dengan kombinasi:
- **Generalized Matrix Factorization (GMF)**: Mengalikan embedding pengguna dan item secara element-wise.
- **Multi-Layer Perceptron (MLP)**: Menggabungkan embedding pengguna dan item untuk mempelajari fungsi interaksi non-linear kompleks.
`,
        },
      ],
    },
    {
      id: "rec-bab-4",
      slug: "rekomendasi-berurutan-dan-graf-lightgcn",
      title: "BAB 4: Rekomendasi Berurutan (SASRec) & Graf Interaksi (LightGCN)",
      orderIndex: 4,
      description: "Memodelkan dinamika minat pengguna berbasis waktu (Self-Attentive Sequential Recommendation / SASRec) dan propagasi graf interaksi bipartit (LightGCN He et al. SIGIR 2020).",
      subchapters: [
        {
          id: "rec-bab-4-1",
          slug: "lightgcn-dan-propagasi-tanpa-transformasi",
          title: "4.1. Arsitektur LightGCN: Penyederhanaan Graph Convolutional Networks",
          orderIndex: 1,
          description: "Menghapus transformasi matriks bobot $W$ dan fungsi aktivasi non-linear yang merusak performa rekomendasi kolaboratif pada GCN klasik.",
          content_markdown: `# 4.1. Arsitektur LightGCN: Penyederhanaan Graph Convolutional Networks

## 1. Temuan Terobosan LightGCN (He et al., 2020)
Pada tugas klasifikasi simpul graf standar, transformasi fitur linier $\\mathbf{W}$ dan aktivasi non-linear $\\sigma(\\cdot)$ sangat esensial. Namun pada sistem rekomendasi kolaboratif di mana simpul hanya direpresentasikan oleh ID embedding unik tanpa atribut teks, operasi tersebut justru memperlambat pelatihan dan menurunkan performa!

## 2. Aturan Propagasi Tetangga LightGCN
LightGCN hanya mempertahankan agregasi rata-rata normalisasi derajat simpul:

$$\\mathbf{e}_u^{(k+1)} = \\sum_{i \\in \\mathcal{N}_u} \\frac{1}{\\sqrt{|\\mathcal{N}_u|} \\sqrt{|\\mathcal{N}_i|}} \\mathbf{e}_i^{(k)}$$
$$\\mathbf{e}_i^{(k+1)} = \\sum_{u \\in \\mathcal{N}_i} \\frac{1}{\\sqrt{|\\mathcal{N}_i|} \\sqrt{|\\mathcal{N}_u|}} \\mathbf{e}_u^{(k)}$$

Representasi akhir simpul pengguna diperoleh dari kombinasi berbobot seluruh lapisan:
$$\\mathbf{e}_u^* = \\sum_{k=0}^K \\alpha_k \\mathbf{e}_u^{(k)}$$
Sangat cepat dilatih dan mendominasi benchmark rekomendasi graf skala besar.
`,
        },
      ],
    },
    {
      id: "rec-bab-5",
      slug: "metrik-evaluasi-perankingan-dan-ndcg",
      title: "BAB 5: Metrik Evaluasi Perankingan & Dilema Eksplorasi (MAB)",
      orderIndex: 5,
      description: "Kuantifikasi kualitas rekomendasi daftar Top-K: Hit Rate@K, Mean Reciprocal Rank (MRR), Normalized Discounted Cumulative Gain (NDCG@K), dan algoritma Multi-Armed Bandit (Thompson Sampling).",
      subchapters: [
        {
          id: "rec-bab-5-1",
          slug: "formulasi-ndcg-dan-mrr",
          title: "5.1. Formulasi Matematika DCG@K, IDCG@K & NDCG@K",
          orderIndex: 1,
          description: "Memberikan bobot penalti logaritmik terhadap item relevan yang muncul di urutan bawah daftar rekomendasi.",
          content_markdown: `# 5.1. Formulasi Matematika DCG@K, IDCG@K & NDCG@K

## 1. Discounted Cumulative Gain (DCG@K)
Menghitung akumulasi nilai relevansi $rel_i$ item yang direkomendasikan pada posisi $i=1$ hingga $K$, dengan diskonto logaritmik posisi peringkat:

$$\\text{DCG}@K = \\sum_{i=1}^K \\frac{2^{rel_i} - 1}{\\log_2(i + 1)}$$

## 2. Normalized Discounted Cumulative Gain (NDCG@K)
Nilai DCG bergantung pada jumlah item relevan yang dimiliki pengguna. Agar bernilai komparatif seragam dalam rentang $[0.0, 1.0]$, DCG dinormalisasi dengan **Ideal DCG (IDCG@K)**, yaitu nilai DCG teoritis maksimum jika seluruh item relevan berada di posisi paling atas:

$$\\text{IDCG}@K = \\sum_{i=1}^{|\\mathcal{R}_K|} \\frac{2^{rel_i^{\\text{ideal}}} - 1}{\\log_2(i + 1)}$$

$$\\text{NDCG}@K = \\frac{\\text{DCG}@K}{\\text{IDCG}@K} \\in [0, 1]$$

## 3. Mean Reciprocal Rank (MRR)
Menghitung kebalikan dari posisi peringkat item relevan pertama yang ditemukan:
$$\\text{MRR} = \\frac{1}{|U|} \\sum_{u=1}^{|U|} \\frac{1}{\\text{rank}_u^*}$$
`,
        },
      ],
    },
    {
      id: "rec-bab-6",
      slug: "proyek-engine-recsys-dan-ndcg",
      title: "BAB 6: Proyek Terapan: Engine Matrix Factorization ALS & Evaluator NDCG@K",
      orderIndex: 6,
      description: "Membangun sistem rekomendasi personalisasi lengkap: faktorisasi matriks laten ALS dari nol, kalkulasi prediksi interaksi pengguna-item, dan evaluasi perankingan presisi NDCG@K.",
      subchapters: [
        {
          id: "rec-bab-6-1",
          slug: "proyek-akhir-als-dan-ndcg-python",
          title: "6.1. Proyek Akhir: Recommender Matrix Factorization & Calculator NDCG@K",
          orderIndex: 1,
          description: "Kode Python mandiri: optimasi solver ALS kuadrat terkecil, rekonstruksi matriks rating, dan penghitungan NDCG pada data rekomendasi sintetis.",
          content_markdown: `# 6.1. Proyek Akhir: Recommender Matrix Factorization & Calculator NDCG@K

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
import numpy as np
import math
from typing import List

class MiniMatrixFactorizationALS:
    """Implementasi Faktorisasi Matriks Alternating Least Squares (ALS) sederhana."""
    def __init__(self, n_factors: int = 4, reg: float = 0.1, n_iters: int = 10):
        self.n_factors = n_factors
        self.reg = reg
        self.n_iters = n_iters
        self.user_factors: np.ndarray = None
        self.item_factors: np.ndarray = None

    def fit(self, R: np.ndarray):
        """
        R: matriks rating pengguna-item berukuran (n_users, n_items).
        Nilai 0 mengindikasikan interaksi tak teramati.
        """
        n_users, n_items = R.shape
        np.random.seed(42)
        # Inisialisasi faktor acak
        self.user_factors = np.random.normal(0, 0.1, size=(n_users, self.n_factors))
        self.item_factors = np.random.normal(0, 0.1, size=(n_items, self.n_factors))

        print(f"=== MEMULAI PELATIHAN MATRIX FACTORIZATION (ALS {self.n_iters} Iterasi) ===")
        for iteration in range(self.n_iters):
            # 1. Optimasi Faktor Pengguna (P) dengan Q tetap
            for u in range(n_users):
                rated_idx = np.where(R[u, :] > 0)[0]
                if len(rated_idx) > 0:
                    Q_sub = self.item_factors[rated_idx, :]
                    r_sub = R[u, rated_idx]
                    A = Q_sub.T @ Q_sub + self.reg * np.eye(self.n_factors)
                    b = Q_sub.T @ r_sub
                    self.user_factors[u, :] = np.linalg.solve(A, b)

            # 2. Optimasi Faktor Item (Q) dengan P tetap
            for i in range(n_items):
                rated_idx = np.where(R[:, i] > 0)[0]
                if len(rated_idx) > 0:
                    P_sub = self.user_factors[rated_idx, :]
                    r_sub = R[rated_idx, i]
                    A = P_sub.T @ P_sub + self.reg * np.eye(self.n_factors)
                    b = P_sub.T @ r_sub
                    self.item_factors[i, :] = np.linalg.solve(A, b)

    def predict(self) -> np.ndarray:
        return self.user_factors @ self.item_factors.T

def compute_ndcg_at_k(actual_relevances: List[int], k: int = 5) -> float:
    """Menghitung skor Normalized Discounted Cumulative Gain pada Top-K (NDCG@K)."""
    relevances = actual_relevances[:k]
    if len(relevances) == 0:
        return 0.0

    # Hitung DCG
    dcg = 0.0
    for i, rel in enumerate(relevances):
        dcg += (2.0 ** rel - 1.0) / math.log2((i + 1) + 1.0)

    # Hitung IDCG (urutan ideal)
    ideal_relevances = sorted(actual_relevances, reverse=True)[:k]
    idcg = 0.0
    for i, rel in enumerate(ideal_relevances):
        idcg += (2.0 ** rel - 1.0) / math.log2((i + 1) + 1.0)

    if idcg == 0.0:
        return 0.0
    return dcg / idcg

# --- Demonstrasi Eksekusi Sistem Rekomendasi ---
# Matriks 4 Pengguna x 5 Item (Skala Rating 1-5, 0 = Belum dinilai)
R_sample = np.array([
    [5, 3, 0, 0, 1],
    [4, 0, 0, 1, 4],
    [1, 1, 0, 5, 4],
    [0, 0, 5, 4, 0]
], dtype=np.float64)

recommender = MiniMatrixFactorizationALS(n_factors=2, reg=0.05, n_iters=15)
recommender.fit(R_sample)
R_predicted = recommender.predict()

print("=== MATRIKS PREDIKSI RATING HASIL REKONSTRUKSI ===")
print(np.round(R_predicted, 2))

# Uji Evaluasi Metrik NDCG@3 pada Rekomendasi Pengguna 0
# Misalkan urutan item yang direkomendasikan memiliki relevansi ground-truth [3, 2, 0]
test_relevances = [3, 2, 0]
ndcg_score = compute_ndcg_at_k(test_relevances, k=3)
print(f"\\nRelevansi Rekomendasi Top-3 : {test_relevances}")
print(f"Skor NDCG@3 Terkomputasi   : {ndcg_score:.4f}")
assert ndcg_score > 0.80, "Skor NDCG untuk rekomendasi relevan teratas harus tinggi."
print("=== VERIFIKASI RECOMMENDATION ENGINE SUKSES ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Ketepatan Formulasi Solver ALS (35%)**: Inversi kuadrat terkecil dengan penalti identitas regulasi $L_2$ yang stabil.
- **Formulasi Matematika NDCG@K (35%)**: Penghitungan DCG diskonto logaritmik dan normalisasi IDCG ideal.
- **Analisis Kinerja Rekomendasi (15%)**: Pemahaman penanganan nilai 0 (unobserved) vs rating negatif.
- **Kualitas Kerapian Arsitektur Kode (15%)**: Struktur kelas Python modular dan berorientasi objek.
`,
        },
      ],
    },
  ],
};
