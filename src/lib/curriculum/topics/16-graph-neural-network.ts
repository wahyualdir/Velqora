import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: GRAPH NEURAL NETWORK (GNN) (TOPIK 16) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Kipf, T. N., & Welling, M. (2016). Semi-Supervised Classification with Graph Convolutional Networks (GCN). ICLR.
 * - Veličković, P., et al. (2017). Graph Attention Networks (GAT). ICLR 2018.
 * - Gilmer, J., et al. (2017). Neural Message Passing for Quantum Chemistry (MPNN). ICML 2017.
 * - Xu, K., et al. (2019). How Powerful are Graph Neural Networks? (GIN). ICLR 2019.
 * - Hamilton, W. L. (2020). Graph Representation Learning. Morgan & Claypool Publishers.
 */
export const graphNeuralNetworkCurriculum: AcademicCurriculum = {
  id: "graph-neural-network",
  slug: "graph-neural-network",
  title: "Graph Neural Network (GNN)",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Representasi pembelajaran mendalam pada domain relasional non-Euclidean: kerangka kerja pengiriman pesan terpadu (Message Passing Neural Networks / MPNN), konvolusi spektral dan spasial graf (GCN), mekanisme atensi anisotropik (GAT), batas ekspresivitas uji Weisfeiler-Lehman (GIN), mitigasi patologi Over-Smoothing & Over-Squashing, serta implementasi GCN mandiri.",
  estimatedHours: 52,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Semi-Supervised Classification with Graph Convolutional Networks",
      authors: ["Thomas N. Kipf", "Max Welling"],
      type: "paper",
      url: "https://arxiv.org/abs/1609.02907",
      doi: "10.48550/arXiv.1609.02907",
      relevance: "Aproksimasi orde pertama konvolusi spektral graf terpotong Chebyshev polinomial dan trik renormalisasi.",
      year: 2017,
      publisherOrVenue: "ICLR 2017",
    },
    {
      title: "Graph Attention Networks",
      authors: ["Petar Veličković", "Guillem Cucurull", "Arantxa Casanova", "Adriana Romero", "Pietro Liò", "Yoshua Bengio"],
      type: "paper",
      url: "https://arxiv.org/abs/1710.10903",
      doi: "10.48550/arXiv.1710.10903",
      relevance: "Penetapan bobot dinamis anisotropik pada ketetanggaan simpul graf menggunakan perhatian terpelajari.",
      year: 2018,
      publisherOrVenue: "ICLR 2018",
    },
    {
      title: "How Powerful are Graph Neural Networks?",
      authors: ["Keyulu Xu", "Weihua Hu", "Jure Leskovec", "Stefanie Jegelka"],
      type: "paper",
      url: "https://arxiv.org/abs/1810.00826",
      doi: "10.48550/arXiv.1810.00826",
      relevance: "Membuktikan batas ekspresivitas GNN setara dengan 1-Weisfeiler-Lehman graph isomorphism test (GIN).",
      year: 2019,
      publisherOrVenue: "ICLR 2019",
    },
  ],
  chapters: [
    {
      id: "gnn-bab-1",
      slug: "fondasi-teori-graf-dan-mpnn",
      title: "BAB 1: Fondasi Teori Graf & Kerangka Kerja Message Passing (MPNN)",
      orderIndex: 1,
      description: "Representasi aljabar graf: Matriks Ketetanggaan (Adjacency $A$), Matriks Derajat ($D$), Matriks Laplacian ($L = D - A$), dan kerangka terpadu Message-Aggregate-Update Gilmer et al.",
      subchapters: [
        {
          id: "gnn-bab-1-1",
          slug: "aljabar-laplacian-dan-paradigma-mpnn",
          title: "1.1. Aljabar Spektral Laplacian & Paradigma Message Passing",
          orderIndex: 1,
          description: "Penurunan sifat ortogonalitas dan semi-positif definit matriks Laplacian graf, serta tiga fase siklus MPNN.",
          content_markdown: `# 1.1. Aljabar Spektral Laplacian & Paradigma Message Passing

## 1. Representasi Aljabar Graf
Graf didefinisikan sebagai $\\mathcal{G} = (\\mathcal{V}, \\mathcal{E})$ dengan $N = |\\mathcal{V}|$ simpul dan matriks fitur $\\mathbf{X} \\in \\mathbb{R}^{N \\times F}$.
- **Matriks Ketetanggaan (Adjacency Matrix $\\mathbf{A}$)**: $\\mathbf{A}_{ij} = 1$ jika ada sisi $(i, j) \\in \\mathcal{E}$, $0$ lainnya.
- **Matriks Derajat (Degree Matrix $\\mathbf{D}$)**: Matriks diagonal dengan $\\mathbf{D}_{ii} = \\sum_j \\mathbf{A}_{ij}$.
- **Matriks Laplacian Tak Ternormalisasi**:
  $$\\mathbf{L} = \\mathbf{D} - \\mathbf{A}$$
- **Symmetric Normalized Laplacian**:
  $$\\mathbf{L}_{\\text{sym}} = \\mathbf{D}^{-1/2} \\mathbf{L} \\mathbf{D}^{-1/2} = \\mathbf{I} - \\mathbf{D}^{-1/2} \\mathbf{A} \\mathbf{D}^{-1/2}$$

## 2. Kerangka Kerja MPNN (Gilmer et al., 2017)
Di setiap lapisan propagasi $k$:
1. **Message Phase**: Setiap simpul tetangga $v \\in \\mathcal{N}(u)$ menghasilkan pesan:
   $$\\mathbf{m}_{uv}^{(k)} = M_k\\left( \\mathbf{h}_u^{(k-1)}, \\mathbf{h}_v^{(k-1)}, \\mathbf{e}_{uv} \\right)$$
2. **Aggregation Phase**: Mengumpulkan seluruh pesan tetangga menggunakan operator simetris invarian-permutasi $\\bigoplus \\in \\{\\sum, \\text{mean}, \\max\\}$:
   $$\\mathbf{m}_u^{(k)} = \\bigoplus_{v \\in \\mathcal{N}(u)} \\mathbf{m}_{uv}^{(k)}$$
3. **Update Phase**: Memperbarui embedding simpul:
   $$\\mathbf{h}_u^{(k)} = U_k\\left( \\mathbf{h}_u^{(k-1)}, \\mathbf{m}_u^{(k)} \\right)$$
`,
        },
      ],
    },
    {
      id: "gnn-bab-2",
      slug: "konvolusi-graf-gcn-kipf-welling",
      title: "BAB 2: Graph Convolutional Networks (GCN) & Trik Renormalisasi",
      orderIndex: 2,
      description: "Dari teori konvolusi spektral Fourier graf menuju konvolusi spasial terlokalisasi: deret polinomial Chebyshev, aproksimasi orde pertama, dan trik renormalisasi Kipf & Welling (ICLR 2017).",
      subchapters: [
        {
          id: "gnn-bab-2-1",
          slug: "derivasi-matematis-gcn-renormalization",
          title: "2.1. Derivasi Matematis GCN & Trik Renormalisasi",
          orderIndex: 1,
          description: "Mencegah ledakan/penyusutan magnitudo sinyal saat kedalaman bertambah melalui penambahan self-loops dan normalisasi derajat dua sisi.",
          content_markdown: `# 2.1. Derivasi Matematis GCN & Trik Renormalisasi

## 1. Konvolusi Spektral Graf
Konvolusi sinyal graf $\\mathbf{x}$ dengan filter $g_\\theta$ didefinisikan dalam domain Fourier graf:
$$g_\\theta \\star \\mathbf{x} = \\mathbf{U} g_\\theta(\\mathbf{\\Lambda}) \\mathbf{U}^T \\mathbf{x}$$
Di mana $\\mathbf{U}$ adalah matriks vektor eigen dari Laplacian $\\mathbf{L}_{\\text{sym}} = \\mathbf{U} \\mathbf{\\Lambda} \\mathbf{U}^T$.
Perhitungan ini sangat lambat karena faktorisasi nilai eigen berbiaya $\\mathcal{O}(N^3)$.

## 2. Trik Renormalisasi (Kipf & Welling, 2017)
Menggunakan aproksimasi polinomial Chebyshev orde-1 dan membatasi $\\lambda_{\\max} \\approx 2$:
$$g_\\theta \\star \\mathbf{x} \\approx \\theta \\left( \\mathbf{I}_N + \\mathbf{D}^{-1/2} \\mathbf{A} \\mathbf{D}^{-1/2} \\right) \\mathbf{x}$$

Karena operator $\\mathbf{I}_N + \\mathbf{D}^{-1/2} \\mathbf{A} \\mathbf{D}^{-1/2}$ memiliki nilai eigen dalam rentang $[0, 2]$, perkalian berulang pada jaringan dalam menyebabkan **ledakan/kepunahan gradien**.
Kipf & Welling menambahkan self-loop ke matriks adjacency:

$$\\tilde{\\mathbf{A}} = \\mathbf{A} + \\mathbf{I}_N, \\quad \\tilde{\\mathbf{D}}_{ii} = \\sum_j \\tilde{\\mathbf{A}}_{ij}$$

Persamaan lapisan GCN yang terkenal:

$$\\mathbf{H}^{(l+1)} = \\sigma\\left( \\tilde{\\mathbf{D}}^{-1/2} \\tilde{\\mathbf{A}} \\tilde{\\mathbf{D}}^{-1/2} \\mathbf{H}^{(l)} \\mathbf{W}^{(l)} \\right)$$
Memastikan spektrum nilai eigen kembali stabil di sekitar $[-1, 1]$.
`,
        },
      ],
    },
    {
      id: "gnn-bab-3",
      slug: "graph-attention-networks-gat",
      title: "BAB 3: Graph Attention Networks (GAT) & GraphSAGE",
      orderIndex: 3,
      description: "Mekanisme perhatian anisotropik terpelajari (Veličković et al. ICLR 2018), Multi-Head Graph Attention, dan inductive neighborhood sampling berskala besar GraphSAGE (Hamilton et al. 2017).",
      subchapters: [
        {
          id: "gnn-bab-3-1",
          slug: "koefisien-atensi-gat-dan-multihead",
          title: "3.1. Formulasi Koefisien Perhatian GAT & Induksi GraphSAGE",
          orderIndex: 1,
          description: "Membobotkan kontribusi setiap simpul tetangga secara adaptif menggunakan fungsi aktivasi LeakyReLU dan softmax terlokalisasi.",
          content_markdown: `# 3.1. Formulasi Koefisien Perhatian GAT & Induksi GraphSAGE

## 1. Koefisien Perhatian GAT
Berbeda dari GCN yang memberikan bobot tetap berbasis derajat topologi, GAT menghitung koefisien perhatian dinamis $\\alpha_{ij}$ berdasarkan kecocokan semantik fitur simpul $i$ dan $j$:

$$e_{ij} = \\text{LeakyReLU}\\left( \\mathbf{a}^T [\\mathbf{W} \\mathbf{h}_i \\;\\Vert\\; \\mathbf{W} \\mathbf{h}_j] \\right)$$

Dinormalisasi melintasi seluruh tetangga langsung $k \\in \\mathcal{N}_i$:

$$\\alpha_{ij} = \\frac{\\exp\\left( \\text{LeakyReLU}\\left( \\mathbf{a}^T [\\mathbf{W} \\mathbf{h}_i \\;\\Vert\\; \\mathbf{W} \\mathbf{h}_j] \\right) \\right)}{\\sum_{k \\in \\mathcal{N}_i} \\exp\\left( \\text{LeakyReLU}\\left( \\mathbf{a}^T [\\mathbf{W} \\mathbf{h}_i \\;\\Vert\\; \\mathbf{W} \\mathbf{h}_k] \\right) \\right)}$$

Pembaruan fitur dengan Multi-Head Attention ($K$ kepala):
$$\\mathbf{h}_i' = \\prod_{k=1}^K \\sigma\\left( \\sum_{j \\in \\mathcal{N}_i} \\alpha_{ij}^k \\mathbf{W}^k \\mathbf{h}_j \\right)$$

## 2. GraphSAGE (Sample and Aggregate)
Menghilangkan ketergantungan pada seluruh matriks graf yang harus dimuat ke memori (transductive). GraphSAGE melakukan sampling seragam sejumlah tetap tetangga (misal: $S_1 = 25, S_2 = 10$) secara batch mini, memungkinkan generalisasi induktif ke graf baru yang belum pernah dilihat saat pelatihan.
`,
        },
      ],
    },
    {
      id: "gnn-bab-4",
      slug: "uji-weisfeiler-lehman-dan-gin",
      title: "BAB 4: Batas Ekspresivitas GNN: Uji Weisfeiler-Lehman & GIN",
      orderIndex: 4,
      description: "Analisis kapasitas representasi GNN: Uji Isomorfisme 1-Weisfeiler-Lehman (1-WL Test), keterbatasan GCN dan GAT dalam membedakan struktur siklik, dan Graph Isomorphism Network (GIN Xu et al. ICLR 2019).",
      subchapters: [
        {
          id: "gnn-bab-4-1",
          slug: "teorema-injektivitas-gin",
          title: "4.1. Uji Isomorfisme 1-WL & Teorema Fungsi Agregasi Injektif GIN",
          orderIndex: 1,
          description: "Mengapa operator agregasi mean dan max gagal membedakan graf multi-himpunan, dan keunggulan matematis agregasi penjumlahan berskala (Sum Aggregation).",
          content_markdown: `# 4.1. Uji Isomorfisme 1-WL & Teorema Fungsi Agregasi Injektif GIN

## 1. Uji Isomorfisme Graf 1-Weisfeiler-Lehman (1-WL)
Uji 1-WL mewarnai simpul secara iteratif dengan menghash tuple warna simpul dan multi-set warna tetangga:
$$c_v^{(t+1)} = \\text{HASH}\\left( c_v^{(t)}, \\{\\{ c_u^{(t)} \\mid u \\in \\mathcal{N}(v) \\}\\} \\right)$$
Dua graf dikatakan tidak isomorfik jika distribusi warna simpul pada akhirnya berbeda.

## 2. Teorema Injektivitas GIN (Xu et al., ICLR 2019)
Sebuah MPNN memiliki daya diskriminasi isomorfisme paling tinggi (setara dengan uji 1-WL) **jika dan hanya jika** fungsi agregasi dan pembaruannya bersifat **injektif**:
- **Operator Mean**: Gagal membedakan proporsi simpul (graf dengan 2 simpul berfitur identik menghasilkan representasi sama dengan graf 4 simpul).
- **Operator Max**: Gagal membedakan jumlah keberadaan fitur identik.
- **Operator Sum**: Bersifat injektif pada multi-set terhitung.

Formulasi lapisan GIN:
$$\\mathbf{h}_v^{(k)} = \\text{MLP}^{(k)}\\left( \\left( 1 + \\epsilon^{(k)} \\right) \\mathbf{h}_v^{(k-1)} + \\sum_{u \\in \\mathcal{N}(v)} \\mathbf{h}_u^{(k-1)} \\right)$$
Di mana $\\epsilon$ adalah parameter terpelajari atau skalar tetap.
`,
        },
      ],
    },
    {
      id: "gnn-bab-5",
      slug: "patologi-oversmoothing-dan-oversquashing",
      title: "BAB 5: Patologi GNN: Over-Smoothing, Over-Squashing & Heterofili",
      orderIndex: 5,
      description: "Hambatan mendasar dalam melatih GNN dalam: peluruhan energi Dirichlet (Over-Smoothing), hambatan kompresi eksponensial informasi (Over-Squashing pada bottleneck Ricci curvature), dan graf heterofilik.",
      subchapters: [
        {
          id: "gnn-bab-5-1",
          slug: "energi-dirichlet-dan-mitigasi-oversmoothing",
          title: "5.1. Analisis Energi Dirichlet pada Over-Smoothing & Teknik Mitigasi",
          orderIndex: 1,
          description: "Pembuktian bahwa ketika $L \\to \\infty$, seluruh embedding simpul konvergen ke ruang nol Laplacian (menjadi homogen tak terbedakan), dan teknik DropEdge / Jumping Knowledge.",
          content_markdown: `# 5.1. Analisis Energi Dirichlet pada Over-Smoothing & Teknik Mitigasi

## 1. Fenomena Over-Smoothing
Ketika kedalaman lapisan GNN dinaikkan melampaui 4 lapisan ($L > 4$), akurasi klasifikasi anjlok drastis. Hal ini terjadi karena operasi konvolusi graf setara dengan proses difusi panas (*Laplacian smoothing*).

Energi Dirichlet dari representasi fitur graf didefinisikan sebagai:
$$\\mathcal{E}(\\mathbf{H}) = \\frac{1}{2} \\text{Tr}\\left( \\mathbf{H}^T \\mathbf{L}_{\\text{sym}} \\mathbf{H} \\right) = \\frac{1}{2} \\sum_{(u, v) \\in \\mathcal{E}} \\left\\| \\frac{\\mathbf{h}_u}{\\sqrt{d_u}} - \\frac{\\mathbf{h}_v}{\\sqrt{d_v}} \\right\\|_2^2$$

Ketika jumlah lapisan $L \\to \\infty$:
$$\\lim_{L \\to \\infty} \\mathcal{E}(\\mathbf{H}^{(L)}) \\longrightarrow 0$$
Seluruh simpul memiliki vektor representasi yang **identik dan tidak dapat dibedakan**, menghilangkan seluruh informasi fitur individual.

## 2. Strategi Mitigasi
1. **DropEdge (Rong et al., ICLR 2020)**: Membuang sebagian sisi graf secara acak di setiap iterasi pelatihan untuk memperlambat laju difusi informasi.
2. **Jumping Knowledge Networks (JK-Net)**: Menghubungkan seluruh representasi lapisan tersembunyi intermediate ($k=1, \\dots, L$) langsung ke lapisan klasifikasi akhir menggunakan concatenation atau max-pooling.
`,
        },
      ],
    },
    {
      id: "gnn-bab-6",
      slug: "proyek-engine-gcn-mandiri",
      title: "BAB 6: Proyek Terapan: Implementasi Lapisan GCN & Message Passing Engine",
      orderIndex: 6,
      description: "Membangun sistem komputasi graf lengkap dari nol menggunakan Python & NumPy: konstruksi matriks Laplacian ter-renormalisasi, propagasi forward pass GCN, dan evaluasi klasifikasi simpul semi-supervised.",
      subchapters: [
        {
          id: "gnn-bab-6-1",
          slug: "proyek-akhir-gcn-layer-python",
          title: "6.1. Proyek Akhir: GCN Layer Ter-renormalisasi & Klasifikasi Simpul Graf",
          orderIndex: 1,
          description: "Kode Python mandiri: kalkulasi D_tilde^{-1/2} A_tilde D_tilde^{-1/2} secara eksak, forward propagation fitur, dan klasifikasi pada graf benchmark sintetis.",
          content_markdown: `# 6.1. Proyek Akhir: GCN Layer Ter-renormalisasi & Klasifikasi Simpul Graf

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
import numpy as np

class GraphConvolutionLayer:
    """Implementasi Lapisan Konvolusi Graf Ter-renormalisasi sesuai Kipf & Welling (2017)."""
    def __init__(self, in_features: int, out_features: int):
        self.in_features = in_features
        self.out_features = out_features
        # Inisialisasi bobot Xavier/Glorot
        limit = np.sqrt(6.0 / (in_features + out_features))
        self.W = np.random.uniform(-limit, limit, size=(in_features, out_features))

    @staticmethod
    def compute_normalized_adjacency(A: np.ndarray) -> np.ndarray:
        """Menghitung S = D_tilde^{-1/2} * A_tilde * D_tilde^{-1/2}."""
        N = A.shape[0]
        # 1. Tambahkan self-loops: A_tilde = A + I_N
        A_tilde = A + np.eye(N)
        
        # 2. Hitung matriks derajat D_tilde
        degrees = np.sum(A_tilde, axis=1)
        
        # 3. Hitung D_tilde^{-1/2}
        deg_inv_sqrt = np.power(degrees, -0.5, where=(degrees > 0))
        deg_inv_sqrt[degrees == 0] = 0.0
        D_tilde_inv = np.diag(deg_inv_sqrt)
        
        # 4. Perkalian simetris: D^{-1/2} @ A_tilde @ D^{-1/2}
        return D_tilde_inv @ A_tilde @ D_tilde_inv

    def forward(self, X: np.ndarray, S: np.ndarray, activation: bool = True) -> np.ndarray:
        """
        X: Matriks fitur simpul berukuran (N, in_features)
        S: Matriks adjacency ter-renormalisasi berukuran (N, N)
        """
        # Transformasi fitur linear: X @ W
        support = X @ self.W
        # Agregasi spasial tetangga: S @ support
        output = S @ support
        
        if activation:
            # Aktivasi ReLU
            return np.maximum(0, output)
        return output

# --- Demonstrasi Uji Komputasi GNN ---
np.random.seed(42)

# Simulasi Graf 5 Simpul (Topologi Komunitas Dua Kluster)
# Simpul 0, 1, 2 (Komunitas A) terhubung erat
# Simpul 3, 4 (Komunitas B) terhubung erat
# Ada 1 jembatan antara simpul 2 dan 3
A_sample = np.array([
    [0, 1, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 1, 0, 1],
    [0, 0, 0, 1, 0]
], dtype=np.float64)

# Fitur masukan (5 simpul, 4 dimensi fitur acak)
X_features = np.random.normal(0, 1, size=(5, 4))

# 1. Hitung Operator Konvolusi Graf Ter-renormalisasi
S_norm = GraphConvolutionLayer.compute_normalized_adjacency(A_sample)
print("=== OPERATOR ADJACENCY TER-RENORMALISASI (S) ===")
print(np.round(S_norm, 3))

# 2. Inisialisasi Model GCN Dua Lapisan
gcn_l1 = GraphConvolutionLayer(in_features=4, out_features=8)
gcn_l2 = GraphConvolutionLayer(in_features=8, out_features=2) # 2 kelas prediksi

# Forward Pass Multi-Hop
h1 = gcn_l1.forward(X_features, S_norm, activation=True)
logits = gcn_l2.forward(h1, S_norm, activation=False)

# Normalisasi Softmax untuk probabilitas kelas
exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
probs = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)

print("\\n=== PROBABILITAS PREDIKSI KELAS SIMPUL GCN ===")
for node_idx, p in enumerate(probs):
    pred_cls = int(np.argmax(p))
    print(f"Simpul {node_idx}: Prediksi Kelas = {pred_cls} | Probabilitas = {p[pred_cls]:.4f}")

assert probs.shape == (5, 2), "Dimensi output klasifikasi harus sesuai jumlah simpul x kelas."
assert np.allclose(np.sum(probs, axis=1), 1.0), "Probabilitas Softmax harus berjumlah 1.0."
print("=== VERIFIKASI GNN MESSAGE PASSING SUKSES ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Ketepatan Renormalisasi Adjacency (35%)**: Penambahan self-loops identitas dan perkalian matriks derajat invers simetris yang presisi.
- **Mekanisme Message Passing Dua Lapisan (35%)**: Propagasi fitur multi-hop yang melintasi tetangga tingkat satu dan dua secara benar.
- **Pemahaman Teoretis Over-Smoothing (15%)**: Analisis mengapa kedalaman lapisan GNN harus dibatasi.
- **Kerapian & Modularitas Kode (15%)**: Implementasi kelas berbasis objek tanpa kebocoran numerik.
`,
        },
      ],
    },
  ],
};
