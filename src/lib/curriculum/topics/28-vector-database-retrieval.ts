import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: VECTOR DATABASE & RETRIEVAL SYSTEM (TOPIK 28) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Malkov, Y. A., & Yashunin, D. A. (2018). Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs (HNSW). IEEE TPAMI.
 * - Jégou, H., Douze, M., & Schmid, C. (2010). Product Quantization for Nearest Neighbor Search. IEEE TPAMI.
 * - Robertson, S., & Zaragoza, H. (2009). The Probabilistic Relevance Framework: BM25 and Beyond. FnTIR.
 * - Cormack, G. V., Clarke, C. L., & Buettcher, S. (2009). Reciprocal Rank Fusion outperforms Condorcet and individual machine learning methods. ACM SIGIR.
 * - Liu, N. F., et al. (2023). Lost in the Middle: How Language Models Use Long Contexts. TACL.
 */
export const vectorDatabaseRetrievalCurriculum: AcademicCurriculum = {
  id: "vector-database-retrieval",
  slug: "vector-database-retrieval-system",
  title: "Vector Database & Retrieval System",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Arsitektur penyimpanan dan pencarian kemiripan vektor skala miliaran: metrik jarak ruang berdimensi tinggi, fenomena konsentrasi jarak, struktur indeks grafik Hierarchical Navigable Small World (HNSW), kuantisasi produk (IVF-PQ & ADC), pencarian hibrida Dense + Sparse (BM25 + Reciprocal Rank Fusion), arsitektur Advanced RAG & Reranking, serta implementasi pada PGvector dan Qdrant.",
  estimatedHours: 56,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs",
      authors: ["Yury A. Malkov", "D. A. Yashunin"],
      type: "paper",
      url: "https://arxiv.org/abs/1603.09320",
      doi: "10.1109/TPAMI.2018.2889473",
      relevance: "Algoritma indeks graf multi-layer berbasis Skip-List yang menjadi fondasi Pinecone, Weaviate, Qdrant, dan Milvus.",
      year: 2018,
      publisherOrVenue: "IEEE TPAMI",
    },
    {
      title: "Product Quantization for Nearest Neighbor Search",
      authors: ["Hervé Jégou", "Matthijs Douze", "Cordelia Schmid"],
      type: "paper",
      url: "https://hal.inria.fr/inria-00514462/document",
      doi: "10.1109/TPAMI.2010.57",
      relevance: "Metode kompresi vektor berdimensi tinggi melalui dekomposisi sub-vektor dan kuantisasi kodebook asimetris.",
      year: 2011,
      publisherOrVenue: "IEEE TPAMI",
    },
    {
      title: "Reciprocal Rank Fusion outperforms Condorcet and individual machine learning methods",
      authors: ["Gordon V. Cormack", "Charles L. A. Clarke", "Stefan Buettcher"],
      type: "paper",
      url: "https://dl.acm.org/doi/10.1145/1571941.1572114",
      doi: "10.1145/1571941.1572114",
      relevance: "Metode fusi peringkat non-parametrik yang menggabungkan pencarian leksikal dan dense embedding secara optimal.",
      year: 2009,
      publisherOrVenue: "ACM SIGIR 2009",
    },
  ],
  chapters: [
    {
      id: "vec-bab-1",
      slug: "metrik-jarak-dan-anomali-dimensi-tinggi",
      title: "BAB 1: Metrik Jarak Vektor & Anomali Dimensi Tinggi",
      orderIndex: 1,
      description: "Jarak Euclidean L2, Kesamaan Kosinus, Inner Product (MIPS), dan fenomena kutukan dimensi: Distance Concentration Phenomenon (Beyer et al. 1999) serta Hubness Problem.",
      subchapters: [
        {
          id: "vec-bab-1-1",
          slug: "konsentrasi-jarak-dan-metrik-vektor",
          title: "1.1. Distance Concentration Phenomenon & Hubness Problem",
          orderIndex: 1,
          description: "Pembuktian matematis mengapa rasio selisih jarak terdekat dan terjauh menyusut ke nol ketika dimensi $d \\to \\infty$, dan penanganan normalisasi vektor.",
          content_markdown: `# 1.1. Distance Concentration Phenomenon & Hubness Problem

## 1. Tiga Metrik Kesamaan Vektor Utama
Diberikan dua vektor embedding $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^d$:
1. **Jarak Euclidean ($L_2$)**:
   $$\\|\\mathbf{u} - \\mathbf{v}\\|_2 = \\sqrt{\\sum_{i=1}^d (u_i - v_i)^2}$$
2. **Kesamaan Kosinus (Cosine Similarity)**:
   $$\\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|_2 \\|\\mathbf{v}\\|_2} = \\frac{\\sum_{i=1}^d u_i v_i}{\\sqrt{\\sum_{i=1}^d u_i^2} \\sqrt{\\sum_{i=1}^d v_i^2}}$$
3. **Maximum Inner Product Search (MIPS)**:
   $$\\langle \\mathbf{u}, \\mathbf{v} \\rangle = \\mathbf{u} \\cdot \\mathbf{v}$$
*Catatan*: Jika seluruh vektor dinormalisasi ke panjang satuan ($\\|\\mathbf{u}\\|_2 = 1$), maka:
$$\\|\\mathbf{u} - \\mathbf{v}\\|_2^2 = 2 - 2(\\mathbf{u} \\cdot \\mathbf{v}) = 2(1 - \\cos(\\theta))$$
Mengurutkan berdasarkan kemiripan kosinus, dot product, atau jarak Euclidean menghasilkan pemeringkatan yang **identik secara matematis**.

## 2. Fenomena Konsentrasi Jarak (Beyer et al., 1999)
Ketika dimensi ruang vektor $d$ meningkat tajam ($d > 512$):

$$\\lim_{d \\to \\infty} \\frac{D_{\\max} - D_{\\min}}{D_{\\min}} \\longrightarrow 0$$

Di mana $D_{\\max}$ dan $D_{\\min}$ adalah jarak Euclidean titik kueri ke titik terjauh dan terdekat dalam database.
- *Dampak Fatal*: Seluruh titik dalam database berada pada jarak yang hampir seragam terhadap kueri, menyebabkan struktur pengindeksan spasial pohon klasik (seperti KD-Tree atau R-Tree) meluruh menjadi pencarian sekuensial linear $\\mathcal{O}(N)$ yang sangat lambat.
`,
        },
      ],
    },
    {
      id: "vec-bab-2",
      slug: "algoritma-hnsw-dan-graf-small-world",
      title: "BAB 2: Graf Navigasi Hierarkis: Algoritma HNSW",
      orderIndex: 2,
      description: "Struktur data pencarian kemiripan tetangga terdekat terdepan (Malkov & Yashunin, 2018): analogi Skip-List pada graf multidimensi, parameter $M$, $efConstruction$, $efSearch$, dan greedy routing.",
      subchapters: [
        {
          id: "vec-bab-2-1",
          slug: "arsitektur-multilayer-hnsw-dan-greedy-search",
          title: "2.1. Arsitektur Multi-Layer HNSW & Algoritma Greedy Routing",
          orderIndex: 1,
          description: "Mekanisme perpindahan cepat pada lapisan teratas (long-range links) dan pencarian presisi pada lapisan dasar dengan kompleksitas waktu $\\mathcal{O}(\\log N)$.",
          content_markdown: `# 2.1. Arsitektur Multi-Layer HNSW & Algoritma Greedy Routing

## 1. Konseptual Hierarchical Navigable Small World (HNSW)
HNSW menggabungkan teori graf dunia kecil (*Small-World Graphs*) dengan struktur *Skip-List*:
- Graf diorganisasi ke dalam beberapa lapisan hierarki ($l = 0, 1, \\dots, L_{\\max}$).
- Lapisan teratas memiliki kepadatan simpul sangat jarang dengan jarak antar tautan yang panjang (*express highway*).
- Lapisan dasar ($l = 0$) berisi seluruh vektor dataset dengan koneksi lokal berdensitas tinggi.

Distribusi penetapan tingkat maksimum simpul $l$ mengikuti distribusi eksponensial terbalik:
$$l = \\lfloor -\\ln(\\text{uniform}(0, 1)) \\cdot m_L \\rfloor, \\quad m_L = \\frac{1}{\\ln(M)}$$

## 2. Algoritma Pencarian Greedy Routing
1. Mulai dari simpul masuk (*entry point*) di lapisan paling atas.
2. Evaluasi jarak tetangga di lapisan saat ini secara *greedy*. Pindah ke simpul tetangga yang memperpendek jarak ke kueri $q$.
3. Jika tidak ada lagi tetangga yang lebih dekat, turun satu lapisan ke bawah melalui simpul lokal minimum tersebut.
4. Pada lapisan dasar ($l = 0$), jalankan pencarian berbasis prioritas antrian (*priority queue*) berukuran $efSearch$ untuk mengumpulkan $K$ tetangga terdekat.

Kompleksitas waktu pencarian rata-rata adalah **$\\mathcal{O}(\\log N)$**, dibandingkan dengan pencarian naif $\\mathcal{O}(N)$.
`,
        },
      ],
    },
    {
      id: "vec-bab-3",
      slug: "kuantisasi-produk-ivf-pq-dan-adc",
      title: "BAB 3: Kuantisasi Produk (IVF-PQ) & Asymmetric Distance",
      orderIndex: 3,
      description: "Kompresi vektor miliaran elemen (Jégou et al., IEEE TPAMI 2011): Inverted File (IVF), dekomposisi sub-vektor, k-means centroid codebooks, dan Asymmetric Distance Computation (ADC).",
      subchapters: [
        {
          id: "vec-bab-3-1",
          slug: "dekomposisi-subvektor-dan-tabel-adc",
          title: "3.1. Dekomposisi Sub-Vektor & Asymmetric Distance Computation (ADC)",
          orderIndex: 1,
          description: "Mengompresi vektor 1024-dimensi FP32 (4096 byte) menjadi hanya 64 byte kode byte diskrit, dan perhitungan jarak cepat via tabel look-up.",
          content_markdown: `# 3.1. Dekomposisi Sub-Vektor & Asymmetric Distance Computation (ADC)

## 1. Mekanisme Product Quantization (PQ)
Vektor berdimensi tinggi $\\mathbf{x} \\in \\mathbb{R}^d$ dipecah menjadi $m$ sub-vektor ortogonal:
$$\\mathbf{x} = [\\mathbf{u}_1, \\mathbf{u}_2, \\dots, \\mathbf{u}_m], \\quad \\mathbf{u}_i \\in \\mathbb{R}^{d/m}$$

Untuk setiap ruang bagian ke-$i$, algoritma $k$-means melatih sebuah buku kode (*codebook*) berisi $k^* = 256$ sentroid (dapat diindeks dengan 1 byte unsigned integer).
Setiap sub-vektor $\\mathbf{u}_i$ dikuantisasi ke sentroid terdekatnya:
$$q(\\mathbf{u}_i) = c_i^* \\implies \\mathbf{x} \\approx [c_1^*, c_2^*, \\dots, c_m^*]$$
Vektor 1024-dimensi FP32 ($4096\\text{ byte}$) dipadatkan menjadi array $m=64$ byte ($64\\times$ kompresi memori RAM).

## 2. Asymmetric Distance Computation (ADC)
Ketika kueri $\\mathbf{y}$ masuk, kueri **tidak dikuantisasi** (menjaga presisi).
Jarak kuadratik diaproksimasi dengan menjumlahkan jarak sub-vektor kueri ke sentroid yang tersimpan dalam tabel pencarian pre-komputasi (*look-up table*):

$$d(\\mathbf{y}, q(\\mathbf{x}))^2 = \\sum_{i=1}^m \\|\\mathbf{y}_i - c_{i, \\text{code}[i]}\\|^2$$
Perhitungan jarak dilakukan sepenuhnya melalui operasi pembacaan memori cepat tabel $\\mathcal{O}(m)$ tanpa operasi floating-point matriks berat.
`,
        },
      ],
    },
    {
      id: "vec-bab-4",
      slug: "pencarian-hibrida-bm25-dan-rrf",
      title: "BAB 4: Pencarian Hibrida: Dense + Sparse BM25 & Reciprocal Rank Fusion",
      orderIndex: 4,
      description: "Menyatukan pencarian kata kunci presisi dan kemiripan semantik: formulasi Okapi BM25 (Robertson & Zaragoza 2009), algoritma Reciprocal Rank Fusion (RRF Cormack et al. 2009), dan perankingan gabungan.",
      subchapters: [
        {
          id: "vec-bab-4-1",
          slug: "formulasi-bm25-dan-reciprocal-rank-fusion",
          title: "4.1. Formulasi Matematika Okapi BM25 & Reciprocal Rank Fusion (RRF)",
          orderIndex: 1,
          description: "Mengapa dense retrieval sering gagal pada pencarian akronim / ID produk spesifik, dan fusi non-parametrik yang kebal perbedaan skala skor.",
          content_markdown: `# 4.1. Formulasi Matematika Okapi BM25 & Reciprocal Rank Fusion (RRF)

## 1. Okapi BM25 (Sparse Retrieval)
BM25 menghitung relevansi dokumen $D$ terhadap kueri multi-istilah $Q = \\{q_1, \\dots, q_n\\}$:

$$\\text{Score}_{\\text{BM25}}(D, Q) = \\sum_{i=1}^n \\text{IDF}(q_i) \\cdot \\frac{f(q_i, D) \\cdot (k_1 + 1)}{f(q_i, D) + k_1 \\left( 1 - b + b \\cdot \\frac{|D|}{\\text{avgdl}} \\right)}$$

Di mana:
- $f(q_i, D)$: Frekuensi istilah $q_i$ dalam dokumen $D$.
- $|D|$ dan $\\text{avgdl}$: Panjang dokumen $D$ dan rata-rata panjang dokumen seluruh korpus.
- $k_1 \\in [1.2, 2.0]$: Mengatur tingkat saturasi frekuensi istilah.
- $b \\in [0.75]$: Mengatur intensitas normalisasi panjang dokumen.

## 2. Reciprocal Rank Fusion (RRF) (Cormack et al., 2009)
Skor kemiripan kosinus (rentang $[-1, 1]$ atau $[0, 1]$) dan skor BM25 (rentang $[0, \\infty)$) memiliki skala yang tidak kompatibel dan tidak dapat dijumlahkan secara langsung tanpa normalisasi rumit.

RRF menyatukan hasil hanya berdasarkan **urutan peringkat** (*rank position*):

$$\\text{RRF\\_Score}(d) = \\sum_{m \\in \\mathcal{M}} \\frac{1}{k + r_m(d)}$$

Di mana:
- $\\mathcal{M}$ adalah himpunan sistem pencarian (misal: $\\{\\text{BM25}, \\text{Dense HNSW}\\}$).
- $r_m(d)$ adalah posisi peringkat dokumen $d$ pada sistem $m$ (1-indexed).
- $k$ adalah konstanta perataan (standar industri $k = 60$).

RRF secara konsisten mengungguli metode pembobotan linear karena memberikan prioritas tinggi pada dokumen yang muncul di jajaran teratas pada kedua sistem pencarian.
`,
        },
      ],
    },
    {
      id: "vec-bab-5",
      slug: "advanced-rag-chunking-dan-reranking",
      title: "BAB 5: Advanced RAG: Chunking, Reranking & Lost-in-the-Middle",
      orderIndex: 5,
      description: "Strategi pemotongan dokumen (Fixed, Recursive, Semantic), patologi Lost-in-the-Middle (Liu et al. TACL 2023), Cross-Encoder Rerankers, dan kerangka Self-RAG.",
      subchapters: [
        {
          id: "vec-bab-5-1",
          slug: "lost-in-the-middle-dan-cross-encoder-reranking",
          title: "5.1. Patologi Lost-in-the-Middle & Pipa Reranking Cross-Encoder",
          orderIndex: 1,
          description: "Mengapa menjejalkan 20 dokumen ke dalam prompt LLM justru menurunkan akurasi, dan arsitektur dua tahap Retrieve-then-Rerank.",
          content_markdown: `# 5.1. Patologi Lost-in-the-Middle & Pipa Reranking Cross-Encoder

## 1. Fenomena Lost-in-the-Middle (Liu et al., 2023)
Penelitian membuktikan bahwa kemampuan LLM mengekstraksi fakta akurat sangat tinggi jika informasi relevan berada di **awal** atau **akhir** jendela konteks, namun anjlok drastis (hingga $>30\\%$) ketika informasi tersebut terkubur di bagian tengah dokumen konteks panjang.

## 2. Arsitektur Dua Tahap: Retrieve-then-Rerank
1. **Tahap 1 (Fast Bi-Encoder Retrieval)**: Menggunakan HNSW atau pencarian hibrida untuk mengambil $K_{\\text{initial}} = 50$ dokumen kandidat dengan latensi rendah ($< 10\\text{ ms}$).
2. **Tahap 2 (Deep Cross-Encoder Reranking)**: Memasukkan pasangan \`[CLS] Query [SEP] Document\` secara utuh ke dalam model Transformer (misal: \`bge-reranker-large\`) yang mengevaluasi atensi silang penuh (*full cross-attention*) antar setiap kata kueri dan dokumen.
3. **Penyaringan Akhir**: Hanya $K_{\\text{final}} = 3$ sampai $5$ dokumen paling relevan dengan skor reranker tertinggi yang dikirimkan ke prompt LLM.
`,
        },
      ],
    },
    {
      id: "vec-bab-6",
      slug: "ekosistem-database-vektor-skala-produksi",
      title: "BAB 6: Arsitektur Sistem Database Vektor Produksi (PGvector & Qdrant)",
      orderIndex: 6,
      description: "Penyimpanan vektor terdistribusi: ekstensi PGvector pada PostgreSQL (indeks HNSW vs IVFFlat), replikasi partisi, penapisan metadata ber-payload (Filtered Vector Search), dan arsitektur Qdrant / Milvus.",
      subchapters: [
        {
          id: "vec-bab-6-1",
          slug: "pgvector-dan-filtered-search",
          title: "6.1. Ekstensi PGvector, Indeks HNSW SQL & Pre/Post-Filtering",
          orderIndex: 1,
          description: "Sintaks operasional pgvector, perbandingan kueri indeks kosinus \`<=>\`, dan bahaya over-filtering pada pencarian ber-metadata.",
          content_markdown: `# 6.1. Ekstensi PGvector, Indeks HNSW SQL & Pre/Post-Filtering

## 1. Implementasi Kueri PGvector
\`\`\`sql
-- 1. Inisialisasi Ekstensi dan Tabel Bervektor
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE academic_knowledge_base (
    id BIGSERIAL PRIMARY KEY,
    document_chunk TEXT NOT NULL,
    metadata JSONB,
    embedding vector(1536) -- Dimensi embedding OpenAI text-embedding-3-small
);

-- 2. Membangun Indeks HNSW Terakselerasi
CREATE INDEX ON academic_knowledge_base 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 3. Pencarian K-Nearest Neighbors Berfilter Metadata
SELECT 
    id,
    document_chunk,
    1 - (embedding <=> '[0.012, -0.045, ...]'::vector) AS cosine_similarity
FROM academic_knowledge_base
WHERE metadata->>'category' = 'Machine Learning'
ORDER BY embedding <=> '[0.012, -0.045, ...]'::vector ASC
LIMIT 5;
\`\`\`

## 2. Pre-Filtering vs Post-Filtering
- **Post-Filtering**: Menemukan $K$ tetangga terdekat di graf HNSW terlebih dahulu, baru menerapkan filter metadata. Berisiko fatal: jika seluruh $K$ tetangga tidak memenuhi filter, kueri mengembalikan hasil kosong (*empty result set*).
- **Single-Stage Iterative Filtering (Qdrant / PGvector HNSW)**: Graf HNSW ditelusuri hanya melintasi simpul yang memenuhi kondisi predikat metadata secara simultan.
`,
        },
      ],
    },
    {
      id: "vec-bab-7",
      slug: "proyek-hybrid-search-bm25-rrf",
      title: "BAB 7: Proyek Terapan: Inverted Index BM25 & Hybrid RRF Search Engine",
      orderIndex: 7,
      description: "Membangun search engine hibrida end-to-end: implementasi kalkulasi Okapi BM25 dari nol, fusi peringkat Reciprocal Rank Fusion (RRF), dan evaluasi metrik pencarian Recall@K.",
      subchapters: [
        {
          id: "vec-bab-7-1",
          slug: "proyek-akhir-bm25-rrf-engine-python",
          title: "7.1. Proyek Akhir: Mesin Pencarian Hibrida BM25 + Dense RRF Terverifikasi",
          orderIndex: 1,
          description: "Kode Python mandiri: struktur inverted index, perankingan skor leksikal BM25, simulasi dense cosine search, dan fusi RRF.",
          content_markdown: `# 7.1. Proyek Akhir: Mesin Pencarian Hibrida BM25 + Dense RRF Terverifikasi

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
import math
import collections
from typing import List, Dict, Tuple

class MiniBM25:
    """Implementasi rumus Okapi BM25 murni sesuai Robertson & Zaragoza (2009)."""
    def __init__(self, corpus: List[str], k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.corpus_size = len(corpus)
        self.doc_tokens = [doc.lower().split() for doc in corpus]
        self.doc_lens = [len(tokens) for tokens in self.doc_tokens]
        self.avgdl = sum(self.doc_lens) / float(self.corpus_size)

        # Hitung Document Frequencies (DF) untuk setiap kata
        self.df = collections.defaultdict(int)
        for tokens in self.doc_tokens:
            for token in set(tokens):
                self.df[token] += 1

    def _idf(self, term: str) -> float:
        df_t = self.df.get(term, 0)
        # Formula Robertson-Spärck Jones IDF
        return math.log((self.corpus_size - df_t + 0.5) / (df_t + 0.5) + 1.0)

    def search(self, query: str) -> List[Tuple[int, float]]:
        q_terms = query.lower().split()
        scores = []

        for doc_id, tokens in enumerate(self.doc_tokens):
            score = 0.0
            term_counts = collections.Counter(tokens)
            doc_len = self.doc_lens[doc_id]

            for term in q_terms:
                if term in term_counts:
                    tf = term_counts[term]
                    idf = self._idf(term)
                    numerator = tf * (self.k1 + 1)
                    denominator = tf + self.k1 * (1 - self.b + self.b * (doc_len / self.avgdl))
                    score += idf * (numerator / denominator)

            scores.append((doc_id, score))

        # Urutkan berdasarkan skor tertinggi
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores

def reciprocal_rank_fusion(ranking_lists: List[List[int]], k: int = 60) -> List[Tuple[int, float]]:
    """Menggabungkan beberapa daftar pemeringkatan dokumen menggunakan Reciprocal Rank Fusion (RRF)."""
    rrf_scores = collections.defaultdict(float)
    
    for rank_list in ranking_lists:
        for rank_idx, doc_id in enumerate(rank_list):
            # rank_idx 0 adalah peringkat 1
            rrf_scores[doc_id] += 1.0 / (k + (rank_idx + 1))
            
    fused_results = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
    return fused_results

# --- Demonstrasi Evaluasi Sistem Hibrida ---
dokumen_kb = [
    "Machine learning mengoptimalkan parameter bobot menggunakan algoritma gradient descent.",
    "PostgreSQL mendukung ekstensi pgvector untuk pencarian kesamaan vektor HNSW.",
    "Algoritma HNSW menghubungkan simpul tetangga terdekat pada struktur graf hierarki bertingkat.",
    "Deep learning memerlukan GPU dengan memori bandwidth tinggi untuk pelatihan Transformer skala besar."
]

# Inisialisasi BM25
bm25 = MiniBM25(dokumen_kb)
kueri = "ekstensi pgvector postgresql"

# 1. Hasil Pencarian BM25 (Sparse)
hasil_bm25 = bm25.search(kueri)
ranked_bm25_ids = [doc_id for doc_id, score in hasil_bm25]
print("=== HASIL PENCARIAN BM25 (SPARSE) ===")
for doc_id, score in hasil_bm25[:2]:
    print(f"Doc {doc_id} (Skor {score:.4f}): {dokumen_kb[doc_id]}")

# 2. Simulasi Hasil Pencarian Dense Vector (Dense Embedding)
# Misalkan kueri semantik memiliki kemiripan tinggi dengan Doc 1 dan Doc 2
ranked_dense_ids = [1, 2, 0, 3]

# 3. Fusi Peringkat dengan Reciprocal Rank Fusion
hasil_fusi = reciprocal_rank_fusion([ranked_bm25_ids, ranked_dense_ids], k=60)
print("\\n=== HASIL AKHIR PENCARIAN HIBRIDA (RRF FUSION) ===")
for doc_id, score in hasil_fusi[:2]:
    print(f"Doc {doc_id} (RRF Score {score:.5f}): {dokumen_kb[doc_id]}")

assert hasil_fusi[0][0] == 1, "Dokumen 1 yang unggul pada BM25 dan Dense harus menempati posisi teratas!"
print("=== VERIFIKASI RETRIEVAL ENGINE SUKSES ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Ketepatan Rumus Okapi BM25 (35%)**: Implementasi IDF termodifikasi dan normalisasi panjang dokumen \`avgdl\`.
- **Formulasi Reciprocal Rank Fusion (35%)**: Penjumlahan harmonik terbalik yang akurat tanpa bias ukuran daftar.
- **Analisis Kinerja Hibrida (15%)**: Pemahaman keunggulan gabungan leksikal + semantik.
- **Kerapian & Keterbacaan Kode (15%)**: Kode Python modular, deterministik, dan terdokumentasi.
`,
        },
      ],
    },
  ],
};
