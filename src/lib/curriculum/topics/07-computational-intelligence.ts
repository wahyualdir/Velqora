import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: COMPUTATIONAL INTELLIGENCE (TOPIK 7)
 * Rujukan Utama:
 * - Engelbrecht, A. P. (2007). Computational Intelligence: An Introduction (2nd ed.). John Wiley & Sons.
 * - Zadeh, L. A. (1965). Fuzzy sets. Information and Control, 8(3), 338-353.
 * - Goldberg, D. E. (1989). Genetic Algorithms in Search, Optimization, and Machine Learning. Addison-Wesley.
 * - Kennedy, J., & Eberhart, R. (1995). Particle swarm optimization. IEEE ICNN 1995.
 * - Dorigo, M., & Stützle, T. (2004). Ant Colony Optimization. MIT Press.
 * - Jang, J. S. R. (1993). ANFIS: Adaptive-Network-Based Fuzzy Inference System. IEEE Trans. Syst., Man, Cybern.
 */
export const computationalIntelligenceCurriculum: AcademicCurriculum = {
  id: "computational-intelligence",
  slug: "computational-intelligence",
  title: "Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence)",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Paradigma kecerdasan komputasional yang menoleransi ketidaktepatan, ketidakpastian, dan kebenaran parsial: teori himpunan kabur (*Fuzzy Sets*), mesin inferensi Mamdani & Sugeno, komputasi evolusioner dan algoritma genetika (GA), kecerdasan kawanan (*Particle Swarm Optimization* & *Ant Colony Optimization*), serta sistem hibrida neuro-fuzzy (*ANFIS*).",
  estimatedHours: 52,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Computational Intelligence: An Introduction (2nd Edition)",
      authors: ["Andries P. Engelbrecht"],
      type: "book",
      url: "https://www.wiley.com/en-us/Computational+Intelligence%3A+An+Introduction%2C+2nd+Edition-p-9780470035993",
      relevance: "Buku teks komprehensif yang mengintegrasikan jaringan saraf tiruan, sistem kabur, komputasi evolusioner, dan kecerdasan kawanan.",
      year: 2007,
      publisherOrVenue: "John Wiley & Sons",
    },
    {
      title: "Fuzzy Sets",
      authors: ["Lotfi A. Zadeh"],
      type: "paper",
      url: "https://www.sciencedirect.com/science/article/pii/S001999586590241X",
      doi: "10.1016/S0019-9958(65)90241-X",
      relevance: "Makalah seminal yang memperkenalkan fungsi keanggotaan derajat kontinum dan aljabar himpunan kabur.",
      year: 1965,
      publisherOrVenue: "Information and Control",
    },
    {
      title: "Particle Swarm Optimization",
      authors: ["James Kennedy", "Russell Eberhart"],
      type: "paper",
      url: "https://ieeexplore.ieee.org/document/488968",
      doi: "10.1109/ICNN.1995.488968",
      relevance: "Fondasi matematis dinamika vektor kecepatan dan posisi kawanan partikel dalam ruang pencarian kontinu.",
      year: 1995,
      publisherOrVenue: "IEEE International Conference on Neural Networks",
    },
    {
      title: "ANFIS: Adaptive-Network-Based Fuzzy Inference System",
      authors: ["J.-S. R. Jang"],
      type: "paper",
      url: "https://ieeexplore.ieee.org/document/256541",
      doi: "10.1109/21.256541",
      relevance: "Arsitektur integrasi jaringan saraf tiruan dan sistem inferensi fuzzy Takagi-Sugeno yang dapat dilatih dengan backpropagation.",
      year: 1993,
      publisherOrVenue: "IEEE Transactions on Systems, Man, and Cybernetics",
    },
  ],
  chapters: [
    {
      id: "ci-bab-1",
      slug: "paradigma-kecerdasan-komputasional",
      title: "BAB 1: Paradigma Kecerdasan Komputasional & Soft Computing",
      orderIndex: 1,
      description: "Pergeseran dari komputasi tegas (*Hard Computing*) yang membutuhkan model matematika eksak menuju *Soft Computing* Zadeh yang memanfaatkan toleransi terhadap ketidakpastian dan ketidakakuratan parsial.",
      subchapters: [
        {
          id: "ci-bab-1-1",
          slug: "hard-vs-soft-computing",
          title: "1.1. Hard Computing vs Soft Computing: Prinsip Eksploitasi Toleransi",
          orderIndex: 1,
          description: "Mengapa masalah dunia nyata non-linear, stokastik, dan kompleksitas tinggi tidak dapat diselesaikan dengan analisis numerik analitik murni.",
          content_markdown: `# 1.1. Hard Computing vs Soft Computing: Prinsip Eksploitasi Toleransi

## 1. Tujuan Pembelajaran
Mahasiswa mampu:
1. Membedakan *Hard Computing* (berbasis logika biner tegas, matematika analitik, determinisme) dan *Soft Computing* (berbasis toleransi ketidaktepatan).
2. Menjelaskan pilar utama Kecerdasan Komputasional (CI): **Fuzzy Systems**, **Evolutionary Computation**, **Swarm Intelligence**, dan **Neural Systems**.
3. Menilai kapan pendekatan heuristik dan aproksimasi biologis lebih unggul daripada solver matematis eksak.

## 2. Prinsip Utama Soft Computing (Zadeh, 1994)
> *"The essence of soft computing is that unlike conventional, hard computing, it is tolerant of imprecision, uncertainty, partial truth, and approximation."*

Tiga tujuan utama:
1. **Traktabilitas**: Mampu menemukan solusi mendekati optimal pada masalah NP-Hard dalam waktu polinomial.
2. **Robustness**: Sistem tidak runtuh jika ada noise atau data yang hilang sebagian.
3. **Low Solution Cost**: Menghindari biaya komputasi analitik yang tidak realistis di lapangan.
`,
        },
      ],
    },
    {
      id: "ci-bab-2",
      slug: "teori-himpunan-kabur-dan-aljabar-fuzzy",
      title: "BAB 2: Teori Himpunan Kabur (Fuzzy Sets) & Aljabar Zadeh",
      orderIndex: 2,
      description: "Fungsi keanggotaan derajat kontinum $[0, 1]$, operator T-Norm (irisan) dan S-Norm (gabungan), sifat komplemen, dan prinsip perluasan Zadeh (*Extension Principle*).",
      subchapters: [
        {
          id: "ci-bab-2-1",
          slug: "fungsi-keanggotaan-dan-t-norm",
          title: "2.1. Fungsi Keanggotaan Kontinu & Operator Triangular Norm (T-Norm / S-Norm)",
          orderIndex: 1,
          description: "Formulasi matematis kurva segitiga, trapesium, dan Gaussian bell curve serta aksioma T-norm irisan dan S-norm gabungan.",
          content_markdown: `# 2.1. Fungsi Keanggotaan Kontinu & Operator Triangular Norm (T-Norm / S-Norm)

## 1. Formulasi Fungsi Keanggotaan
Sebuah himpunan kabur $A$ didefinisikan oleh fungsi pemetaan:

$$\\mu_A: X \\longrightarrow [0, 1]$$

### A. Fungsi Keanggotaan Segitiga (*Triangular*):
$$\\mu_{\\text{tri}}(x; a, b, c) = \\max\\left(0, \\; \\min\\left(\\frac{x - a}{b - a}, \\; \\frac{c - x}{c - b}\\right)\\right)$$

### B. Fungsi Keanggotaan Gaussian:
$$\\mu_{\\text{gauss}}(x; c, \\sigma) = \\exp\\left( -\\frac{(x - c)^2}{2 \\sigma^2} \\right)$$

## 2. Aksioma Operator T-Norm & S-Norm
- **T-Norm (Fuzzy Intersection / AND)**: Fungsi biner $T: [0, 1] \\times [0, 1] \\to [0, 1]$ yang komutatif, asosiatif, monoton naik, dan memiliki elemen identitas $T(a, 1) = a$.
  - Standar Zadeh: $T_{\\min}(a, b) = \\min(a, b)$
  - Aljabar Produk: $T_{\\text{prod}}(a, b) = a \\cdot b$
- **S-Norm (Fuzzy Union / OR)**: Fungsi biner $S: [0, 1] \\times [0, 1] \\to [0, 1]$ dengan elemen identitas $S(a, 0) = a$.
  - Standar Zadeh: $S_{\\max}(a, b) = \\max(a, b)$
  - Jumlah Aljabar: $S_{\\text{sum}}(a, b) = a + b - a \\cdot b$
`,
        },
      ],
    },
    {
      id: "ci-bab-3",
      slug: "sistem-inferensi-fuzzy-mamdani-dan-sugeno",
      title: "BAB 3: Sistem Inferensi Fuzzy: Mamdani vs Takagi-Sugeno",
      orderIndex: 3,
      description: "Fuzzifikasi masukan tegas, evaluasi aturan IF-THEN majemuk, agregasi implikasi konklusif, serta metode defuzzifikasi Center of Gravity (COG), Mean of Maximum (MOM), dan Weighted Average.",
      subchapters: [
        {
          id: "ci-bab-3-1",
          slug: "mamdani-vs-sugeno-dan-defuzzifikasi",
          title: "3.1. Perbandingan Inferensi Mamdani vs Sugeno & Metode Defuzzifikasi Centroid",
          orderIndex: 1,
          description: "Perbedaan mendasar konsekuen linguistik vs konsekuen polinomial linier, dan penurunan integral titik berat defuzzifikasi.",
          content_markdown: `# 3.1. Perbandingan Inferensi Mamdani vs Sugeno & Metode Defuzzifikasi Centroid

## 1. Perbedaan Mamdani vs Takagi-Sugeno-Kang (TSK)
1. **Model Mamdani (1975)**:
   - Aturan: $\\text{IF } x_1 \\text{ is } A_1 \\land x_2 \\text{ is } A_2 \\implies y \\text{ is } B$
   - Konsekuen adalah **himpunan kabur linguistik** (misal: "Kecepatan Kipas = TINGGI").
   - Membutuhkan proses defuzzifikasi integral yang intensif komputasi.
2. **Model Takagi-Sugeno (1985)**:
   - Aturan: $\\text{IF } x_1 \\text{ is } A_1 \\land x_2 \\text{ is } A_2 \\implies y = p_0 + p_1 x_1 + p_2 x_2$
   - Konsekuen adalah **persamaan matematis tegas (*crisp polynomial*)**.
   - Defuzzifikasi langsung menggunakan rata-rata terbobot (*Weighted Average*):
     $$y^* = \\frac{\\sum_{i=1}^M w_i \\cdot y_i}{\\sum_{i=1}^M w_i}$$

## 2. Defuzzifikasi Center of Gravity (Centroid) Mamdani
$$y^* = \\frac{\\int_Y y \\cdot \\mu_{\\text{agregat}}(y) \\, dy}{\\int_Y \\mu_{\\text{agregat}}(y) \\, dy}$$
`,
        },
      ],
    },
    {
      id: "ci-bab-4",
      slug: "komputasi-evolusioner-dan-algoritma-genetika",
      title: "BAB 4: Komputasi Evolusioner & Algoritma Genetika (GA)",
      orderIndex: 4,
      description: "Prinsip seleksi alam Darwinian, pengkodean kromosom biner vs riil, fungsi fitness penalti konstrain, operator seleksi (Roulette Wheel, Tournament), rekombinasi crossover, mutasi, dan elitisme.",
      subchapters: [
        {
          id: "ci-bab-4-1",
          slug: "teorema-skema-dan-operator-genetika",
          title: "4.1. Teorema Skema Holland & Implementasi Operator GA Lengkap",
          orderIndex: 1,
          description: "Membuktikan peningkatan proporsi building blocks berorde rendah dan performa di atas rata-rata seiring bertambahnya generasi.",
          content_markdown: `# 4.1. Teorema Skema Holland & Implementasi Operator GA Lengkap

## 1. Teorema Skema (Holland's Schema Theorem)
Sebuah skema $H$ adalah pola string kromosom yang memuat simbol $\\{0, 1, *\\}$. Ekspektasi jumlah sampel skema $H$ pada generasi $t+1$:

$$m(H, t+1) \\ge m(H, t) \\cdot \\frac{f(H)}{\\bar{f}} \\left[ 1 - p_c \\frac{\\delta(H)}{L - 1} - o(H) p_m \\right]$$

Di mana:
- $f(H)$: Rata-rata fitness individu yang cocok dengan skema $H$.
- $\\bar{f}$: Rata-rata fitness seluruh populasi saat ini.
- $o(H)$: Orde skema (jumlah posisi bit non-wildcard).
- $\\delta(H)$: Panjang rentang jarak antara bit terdefinisi pertama dan terakhir (*defining length*).

Skema dengan panjang rentang pendek, orde rendah, dan fitness di atas rata-rata (*Building Blocks*) akan bertambah secara eksponensial dalam populasi.
`,
        },
      ],
    },
    {
      id: "ci-bab-5",
      slug: "swarm-intelligence-pso",
      title: "BAB 5: Swarm Intelligence: Particle Swarm Optimization (PSO)",
      orderIndex: 5,
      description: "Dinamika gerak kawanan kawanan partikel Kennedy-Eberhart, konstanta inersia Shi-Eberhart $w$, akselerasi kognitif $c_1$ dan sosial $c_2$, pencegahan konvergensi prematur, dan topologi ketetanggaan.",
      subchapters: [
        {
          id: "ci-bab-5-1",
          slug: "dinamika-pso-dan-topologi-swarm",
          title: "5.1. Analisis Trajektori Kecepatan Partikel & Topologi Gbest vs Lbest",
          orderIndex: 1,
          description: "Menghindari osilasi tak terkendali dengan faktor konstriksi Clerc dan eksplorasi topologi cincin ring.",
          content_markdown: `# 5.1. Analisis Trajektori Kecepatan Partikel & Topologi Gbest vs Lbest

## 1. Persamaan Pembaruan dengan Faktor Konstriksi (Clerc & Kennedy, 2002)
$$v_i(t+1) = \\chi \\left[ v_i(t) + c_1 r_1 (p_i^{\\text{best}} - x_i(t)) + c_2 r_2 (g^{\\text{best}} - x_i(t)) \\right]$$

Faktor konstriksi $\\chi$ menjamin konvergensi trajektori partikel tanpa memerlukan batas kecepatan buatan $v_{\\max}$:

$$\\chi = \\frac{2}{|2 - \\phi - \\sqrt{\\phi^2 - 4\\phi}|}, \\quad \\text{dengan } \\phi = c_1 + c_2 > 4$$

Untuk nilai standar $c_1 = c_2 = 2.05 \\implies \\phi = 4.1$:
$$\\chi \\approx 0.7298, \\quad c_1 \\chi = c_2 \\chi \\approx 1.4962$$
`,
        },
      ],
    },
    {
      id: "ci-bab-6",
      slug: "ant-colony-optimization-dan-aco",
      title: "BAB 6: Ant Colony Optimization (ACO) & Algoritma Metaheuristik",
      orderIndex: 6,
      description: "Pelepasan feromon semut Dorigo, penguapan feromon $\\rho$, penelusuran graf kombinatorial Traveling Salesperson Problem (TSP), dan transisi probabilitas stokastik.",
      subchapters: [
        {
          id: "ci-bab-6-1",
          slug: "formulasi-aco-tsp",
          title: "6.1. Formulasi Matematis Ant Colony System pada Traveling Salesperson Problem",
          orderIndex: 1,
          description: "Probabilitas pemilihan jalur simpul $j$ oleh semut $k$ dari simpul $i$ berdasarkan jejak feromon $\\tau_{ij}$ dan heuristik jarak $\\eta_{ij} = 1/d_{ij}$.",
          content_markdown: `# 6.1. Formulasi Matematis Ant Colony System pada Traveling Salesperson Problem

## 1. Probabilitas Transisi Semut (Dorigo et al., 2004)
Semut $k$ yang berada di kota $i$ memilih kota $j \\in \\mathcal{N}_i^k$ berikutnya berdasarkan aturan probabilitas:

$$P_{ij}^k(t) = \\frac{\\left[ \\tau_{ij}(t) \\right]^\\alpha \\cdot \\left[ \\eta_{ij} \\right]^\\beta}{\\sum_{l \\in \\mathcal{N}_i^k} \\left[ \\tau_{il}(t) \\right]^\\alpha \\cdot \\left[ \\eta_{il} \\right]^\\beta}$$

Di mana:
- $\\tau_{ij}$: Intensitas jejak feromon pada jalur $(i, j)$.
- $\\eta_{ij} = \\frac{1}{d_{ij}}$: Nilai heuristik visibilitas lokal (kebalikan dari jarak fisik kota).
- $\\alpha$: Parameter pengendali pengaruh relatif jejak historis feromon.
- $\\beta$: Parameter pengendali pengaruh visibilitas jarak terdekat.

## 2. Pembaruan & Penguapan Feromon (Evaporation)
$$\\tau_{ij}(t+1) = (1 - \\rho) \\tau_{ij}(t) + \\sum_{k=1}^m \\Delta \\tau_{ij}^k(t)$$

Di mana $\\rho \\in (0, 1]$ adalah koefisien penguapan untuk mencegah semut terjebak pada lintasan sub-optimal secara dini.
`,
        },
      ],
    },
    {
      id: "ci-bab-7",
      slug: "sistem-hibrida-neuro-fuzzy-dan-proyek-akhir",
      title: "BAB 7: Sistem Hibrida Neuro-Fuzzy (ANFIS) & Proyek Akhir",
      orderIndex: 7,
      description: "Integrasi sistem fuzzy Takagi-Sugeno dengan jaringan saraf tiruan 5 lapis (ANFIS), algoritma pelatihan hibrida (Least Squares Estimator + Gradient Descent), dan proyek optimasi kontrol.",
      subchapters: [
        {
          id: "ci-bab-7-1",
          slug: "proyek-pso-optimasi-multidimensi",
          title: "7.1. Proyek Akhir: Solver Optimasi Multimodal Fungsi Non-Konveks dengan PSO",
          orderIndex: 1,
          description: "Membangun modul optimasi berbasis Particle Swarm Optimization di Python untuk mencari minimum global fungsi Ackley/Rastrigin dengan visualisasi konvergensi.",
          content_markdown: `# 7.1. Proyek Akhir: Solver Optimasi Multimodal Fungsi Non-Konveks dengan PSO

## 1. Spesifikasi Proyek
Mahasiswa mengimplementasikan algoritma PSO lengkap:
1. Mendukung ruang dimensi sembarang $D$.
2. Menggunakan faktor inersia yang meluruh secara linear:
   $$w(t) = w_{\\max} - \\frac{t}{T_{\\max}} (w_{\\max} - w_{\\min})$$
3. Menemukan titik global minimum fungsi uji Ackley multidimensi:
   $$f(x) = -20 \\exp\\left(-0.2 \\sqrt{\\frac{1}{D} \\sum_{i=1}^D x_i^2}\\right) - \\exp\\left(\\frac{1}{D} \\sum_{i=1}^D \\cos(2\\pi x_i)\\right) + 20 + e$$

## 2. Kode Solusi Acuan Proyek
\`\`\`python
import numpy as np

def ackley(x: np.ndarray) -> float:
    """Fungsi benchmark Ackley (Global minimum di x = 0, f(x) = 0)."""
    d = len(x)
    sum_sq = np.sum(x**2)
    sum_cos = np.sum(np.cos(2 * np.pi * x))
    return -20.0 * np.exp(-0.2 * np.sqrt(sum_sq / d)) - np.exp(sum_cos / d) + 20.0 + np.e

class ParticleSwarmOptimizer:
    def __init__(self, dim: int, num_particles: int = 40, max_iter: int = 100,
                 bounds: tuple = (-32.768, 32.768)):
        self.dim = dim
        self.num_particles = num_particles
        self.max_iter = max_iter
        self.lb, self.ub = bounds

        # Inisialisasi posisi dan kecepatan acak
        self.X = np.random.uniform(self.lb, self.ub, (num_particles, dim))
        self.V = np.random.uniform(-(self.ub - self.lb)*0.1, (self.ub - self.lb)*0.1, (num_particles, dim))
        
        self.pbest_X = self.X.copy()
        self.pbest_val = np.array([ackley(ind) for ind in self.X])
        
        best_idx = np.argmin(self.pbest_val)
        self.gbest_X = self.pbest_X[best_idx].copy()
        self.gbest_val = self.pbest_val[best_idx]

    def optimize(self):
        w_max, w_min = 0.9, 0.4
        c1, c2 = 1.496, 1.496

        for t in range(self.max_iter):
            # Dynamic inertia weight
            w = w_max - (t / self.max_iter) * (w_max - w_min)
            
            r1 = np.random.rand(self.num_particles, self.dim)
            r2 = np.random.rand(self.num_particles, self.dim)
            
            # Update kecepatan
            self.V = (w * self.V + 
                      c1 * r1 * (self.pbest_X - self.X) + 
                      c2 * r2 * (self.gbest_X - self.X))
            
            # Update posisi dan pembatasan batas (clamping)
            self.X = np.clip(self.X + self.V, self.lb, self.ub)
            
            # Evaluasi fitness
            current_vals = np.array([ackley(ind) for ind in self.X])
            
            # Perbarui pbest
            improved = current_vals < self.pbest_val
            self.pbest_X[improved] = self.X[improved]
            self.pbest_val[improved] = current_vals[improved]
            
            # Perbarui gbest
            min_val = np.min(self.pbest_val)
            if min_val < self.gbest_val:
                self.gbest_val = min_val
                self.gbest_X = self.pbest_X[np.argmin(self.pbest_val)].copy()

        return self.gbest_X, self.gbest_val

pso = ParticleSwarmOptimizer(dim=4, num_particles=50, max_iter=150)
sol, val = pso.optimize()
print(f"Solusi Terbaik D=4: {np.round(sol, 4)}")
print(f"Nilai Minimum Ackley Ditemukan: {val:.8f}")
\`\`\`
`,
        },
      ],
    },
  ],
};
