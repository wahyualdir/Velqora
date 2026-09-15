import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: NATURAL LANGUAGE PROCESSING (TOPIK 22) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Stanford University.
 * - Mikolov, T., Chen, K., Corrado, G., & Dean, J. (2013). Efficient Estimation of Word Representations in Vector Space (Word2Vec). ICLR.
 * - Vaswani, A., et al. (2017). Attention Is All You Need. NeurIPS 2017.
 * - Devlin, J., et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers. NAACL-HLT.
 * - Papineni, K., et al. (2002). BLEU: a Method for Automatic Evaluation of Machine Translation. ACL.
 */
export const naturalLanguageProcessingCurriculum: AcademicCurriculum = {
  id: "natural-language-processing",
  slug: "natural-language-processing",
  title: "Natural Language Processing",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Pemrosesan bahasa alami berbasis komputasi statistik dan neural: pemodelan distribusi kata (TF-IDF, Word2Vec Skip-Gram & Negative Sampling, GloVe), pemodelan sekuensial (N-Gram Perplexity, Bahdanau Attention), arsitektur dasar Transformer (Scaled Dot-Product Attention), representasi kontekstual BERT, evaluasi teks (BLEU, ROUGE, BERTScore), serta pembangunan tokenizer BPE dari nol.",
  estimatedHours: 56,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Speech and Language Processing (3rd Edition Draft)",
      authors: ["Daniel Jurafsky", "James H. Martin"],
      type: "book",
      url: "https://web.stanford.edu/~jurafsky/slp3/",
      relevance: "Buku teks definitif pemrosesan bahasa manusia, morfologi, parsing sintaksis, dan semantik formal.",
      year: 2024,
      publisherOrVenue: "Stanford University / Prentice Hall",
    },
    {
      title: "Attention Is All You Need",
      authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Łukasz Kaiser", "Illia Polosukhin"],
      type: "paper",
      url: "https://arxiv.org/abs/1706.03762",
      doi: "10.48550/arXiv.1706.03762",
      relevance: "Makalah penemu arsitektur Transformer murni berbasis mekanisme self-attention tanpa rekurensi.",
      year: 2017,
      publisherOrVenue: "NeurIPS 2017",
    },
    {
      title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
      authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
      type: "paper",
      url: "https://arxiv.org/abs/1810.04805",
      doi: "10.48550/arXiv.1810.04805",
      relevance: "Arsitektur Transformer encoder dua arah dengan pra-pelatihan Masked Language Modeling (MLM).",
      year: 2019,
      publisherOrVenue: "NAACL-HLT 2019",
    },
  ],
  chapters: [
    {
      id: "nlp-bab-1",
      slug: "vektorisasi-teks-dan-word-embeddings",
      title: "BAB 1: Representasi Kata: TF-IDF, Word2Vec & Hipotesis Distribusi",
      orderIndex: 1,
      description: "Hipotesis distribusi Harris & Firth, formulasi bobot TF-IDF, arsitektur Word2Vec (Skip-gram vs CBOW), optimasi Negative Sampling, dan faktorisasi matriks GloVe.",
      subchapters: [
        {
          id: "nlp-bab-1-1",
          slug: "formulasi-matematis-word2vec-skipgram",
          title: "1.1. Formulasi Matematika Word2Vec Skip-Gram & Negative Sampling",
          orderIndex: 1,
          description: "Memaksimalkan probabilitas kata konteks $w_{t+j}$ dari kata pusat $w_t$, dan aproksimasi komputasi softmax penuh melalui Negative Sampling.",
          content_markdown: `# 1.1. Formulasi Matematika Word2Vec Skip-Gram & Negative Sampling

## 1. Hipotesis Distribusi (Firth, 1957)
> *"You shall know a word by the company it keeps."*
Kata-kata yang muncul dalam konteks yang serupa cenderung memiliki makna semantik yang berdekatan dalam ruang vektor laten.

## 2. Formulasi Skip-Gram
Diberikan sekuens kata $w_1, w_2, \\dots, w_T$, tujuannya adalah memaksimalkan rata-rata log-probability dalam jendela konteks ukuran $c$:

$$\\mathcal{L}_{\\text{SG}} = \\frac{1}{T} \\sum_{t=1}^T \\sum_{-c \\le j \\le c, j \\neq 0} \\log P(w_{t+j} \\mid w_t)$$

Probabilitas kondisional standar menggunakan Softmax:
$$P(w_o \\mid w_i) = \\frac{\\exp(\\mathbf{v}_{w_o}'^T \\mathbf{v}_{w_i})}{\\sum_{w=1}^{|V|} \\exp(\\mathbf{v}_w'^T \\mathbf{v}_{w_i})}$$

## 3. Optimasi Komputasi: Negative Sampling (Mikolov et al., 2013)
Menghitung penyebut Softmax melintasi seluruh kosakata $|V| > 100.000$ sangat mahal komputasi $\\mathcal{O}(|V|)$.
Negative Sampling mengubah masalah multi-kelas menjadi klasifikasi biner logistik:

$$\\log \\sigma(\\mathbf{v}_{w_o}'^T \\mathbf{v}_{w_i}) + \\sum_{k=1}^K \\mathbb{E}_{w_n \\sim P_n(w)}\\left[ \\log \\sigma(-\\mathbf{v}_{w_n}'^T \\mathbf{v}_{w_i}) \\right]$$

Di mana $P_n(w) \\propto U(w)^{3/4}$ adalah distribusi unigram teredam untuk memberi bobot lebih adil pada kata-kata langka.
`,
        },
      ],
    },
    {
      id: "nlp-bab-2",
      slug: "model-bahasa-probabilistik-dan-ngram",
      title: "BAB 2: Model Bahasa Probabilistik, N-Gram & Perplexity",
      orderIndex: 2,
      description: "Model bahasa Markovian autoregresif, estimasi Maximum Likelihood (MLE), metode pemulusan frekuensi (Laplace & Kneser-Ney), dan metrik evaluasi Perplexity.",
      subchapters: [
        {
          id: "nlp-bab-2-1",
          slug: "matematika-perplexity-dan-kneser-ney",
          title: "2.1. Formulasi Matematika Perplexity & Pemulusan Kneser-Ney",
          orderIndex: 1,
          description: "Mengevaluasi kualitas model bahasa melalui eksponensial cross-entropy dan interpolasi probabilitas continuation.",
          content_markdown: `# 2.1. Formulasi Matematika Perplexity & Pemulusan Kneser-Ney

## 1. Formulasi Perplexity (PP)
Perplexity mengukur ketidakpastian model bahasa dalam memprediksi kata berikutnya dalam korpus uji $W = (w_1, w_2, \\dots, w_N)$:

$$PP(W) = P(w_1, w_2, \\dots, w_N)^{-\\frac{1}{N}} = \\sqrt[N]{\\prod_{i=1}^N \\frac{1}{P(w_i \\mid w_1, \\dots, w_{i-1})}} = 2^{-\\frac{1}{N} \\sum_{i=1}^N \\log_2 P(w_i \\mid w_{<i})}$$

Model bahasa yang lebih baik memiliki nilai Perplexity yang **lebih rendah** (secara intuitif: model memilih di antara lebih sedikit kata alternatif yang membingungkan).

## 2. Pemulusan Kneser-Ney (Kneser & Ney, 1995)
Metode pemulusan paling unggul untuk N-Gram klasik: tidak hanya memperhitungkan seberapa sering sebuah kata muncul unigram, melainkan seberapa serbaguna kata tersebut muncul sebagai kelanjutan dari kata lain (*continuation probability* $P_{\\text{cont}}$).
`,
        },
      ],
    },
    {
      id: "nlp-bab-3",
      slug: "arsitektur-seq2seq-dan-perhatian-bahdanau",
      title: "BAB 3: Sekuens-ke-Sekuens (Seq2Seq) & Mekanisme Perhatian Bahdanau",
      orderIndex: 3,
      description: "Keterbatasan information bottleneck pada Encoder-Decoder LSTM konvensional (Sutskever et al. 2014) dan terobosan mekanisme perhatian aditif (Bahdanau et al. ICLR 2015).",
      subchapters: [
        {
          id: "nlp-bab-3-1",
          slug: "persamaan-perhatian-aditif-bahdanau",
          title: "3.1. Formulasi Alignment Score & Context Vector Bahdanau",
          orderIndex: 1,
          description: "Menghubungkan status tersembunyi decoder $s_i$ dengan seluruh status encoder $h_j$ melalui energi alignment non-linear.",
          content_markdown: `# 3.1. Formulasi Alignment Score & Context Vector Bahdanau

## 1. Masalah Bottleneck Seq2Seq Klasik
Pada arsitektur Encoder-Decoder awal, seluruh kalimat masukan (baik 5 kata maupun 100 kata) dipaksa diringkas ke dalam satu vektor berdimensi tetap $h_T$. Ini menyebabkan performa terjemahan mesin anjlok drastis pada kalimat panjang.

## 2. Mekanisme Perhatian Aditif (Bahdanau et al., 2015)
Decoder diizinkan 'melihat' kembali seluruh status tersembunyi encoder $h_j$ di setiap langkah dekoding $i$:

$$e_{ij} = \\mathbf{v}_a^T \\tanh\\left( \\mathbf{W}_a s_{i-1} + \\mathbf{U}_a h_j \\right)$$

Skor keselarasan (*alignment weights*) dinormalisasi menggunakan Softmax:
$$\\alpha_{ij} = \\frac{\\exp(e_{ij})}{\\sum_{k=1}^{T_x} \\exp(e_{ik})}$$

Vektor konteks dinamis $c_i$ dihitung sebagai kombinasi linear terbobot:
$$c_i = \\sum_{j=1}^{T_x} \\alpha_{ij} h_j$$

Status baru decoder diperbarui menggunakan $s_i = f(s_{i-1}, y_{i-1}, c_i)$.
`,
        },
      ],
    },
    {
      id: "nlp-bab-4",
      slug: "arsitektur-dasar-transformer-self-attention",
      title: "BAB 4: Arsitektur Transformer Klasik & Scaled Dot-Product Attention",
      orderIndex: 4,
      description: "Revolusi Vaswani et al. (NeurIPS 2017): formulasi Query, Key, Value, faktor penskalaan $\\sqrt{d_k}$, Multi-Head Attention, dan Sinusoidal Positional Encoding.",
      subchapters: [
        {
          id: "nlp-bab-4-1",
          slug: "scaled-dot-product-dan-multihead-attention",
          title: "4.1. Formulasi Matematika Scaled Dot-Product & Multi-Head Attention",
          orderIndex: 1,
          description: "Mengapa pembagian $\\sqrt{d_k}$ mencegah saturasi gradien Softmax, dan proyeksi ruang representasi majemuk.",
          content_markdown: `# 4.1. Formulasi Matematika Scaled Dot-Product & Multi-Head Attention

## 1. Scaled Dot-Product Attention
Diberikan matriks Query $\\mathbf{Q} \\in \\mathbb{R}^{n \\times d_k}$, Key $\\mathbf{K} \\in \\mathbb{R}^{m \\times d_k}$, dan Value $\\mathbf{V} \\in \\mathbb{R}^{m \\times d_v}$:

$$\\text{Attention}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{softmax}\\left( \\frac{\\mathbf{Q} \\mathbf{K}^T}{\\sqrt{d_k}} \\right) \\mathbf{V}$$

### Mengapa Faktor Skala $\\sqrt{d_k}$ Sangat Krusial?
Jika komponen $q$ dan $k$ adalah variabel acak independen berdistribusi rata-rata 0 dan varians 1:
$$\\mathbb{E}[\\mathbf{q} \\cdot \\mathbf{k}] = 0, \\quad \\text{Var}(\\mathbf{q} \\cdot \\mathbf{k}) = d_k$$
Untuk dimensi besar (misal $d_k = 64$ atau $128$), magnitudo perkalian titik membesar tajam ($|\\mathbf{q} \\cdot \\mathbf{k}| \\approx \\sqrt{d_k}$), mendorong fungsi Softmax ke daerah saturasi dengan gradien mendekati nol (*vanishing gradient*). Pembagian dengan $\\sqrt{d_k}$ mengembalikan varians ke $1.0$.

## 2. Multi-Head Attention
$$\\text{MultiHead}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) \\mathbf{W}^O$$
$$\\text{head}_i = \\text{Attention}(\\mathbf{Q} \\mathbf{W}_i^Q, \\mathbf{K} \\mathbf{W}_i^K, \\mathbf{V} \\mathbf{W}_i^V)$$
Memungkinkan model secara simultan memperhatikan informasi dari ruang representasi yang berbeda pada posisi yang berbeda.
`,
        },
      ],
    },
    {
      id: "nlp-bab-5",
      slug: "representasi-kontekstual-bert",
      title: "BAB 5: Model Kontekstual Dua Arah: BERT & RoBERTa",
      orderIndex: 5,
      description: "Pra-pelatihan representasi dua arah mendalam: Masked Language Model (MLM 80-10-10 rule), Next Sentence Prediction (NSP), segment embeddings, dan fine-tuning klasifikasi / NER.",
      subchapters: [
        {
          id: "nlp-bab-5-1",
          slug: "masked-language-modeling-dan-finetuning",
          title: "5.1. Masked Language Modeling (MLM) & Skema Fine-Tuning BERT",
          orderIndex: 1,
          description: "Mengatasi masalah ketergantungan sepihak pada model bahasa kiri-ke-kanan standar dan pemanfaatan token [CLS] untuk klasifikasi.",
          content_markdown: `# 5.1. Masked Language Modeling (MLM) & Skema Fine-Tuning BERT

## 1. Masalah Model Satu Arah (Left-to-Right)
Model bahasa konvensional (seperti GPT) dilatih secara autoregresif $P(w_t \\mid w_1, \\dots, w_{t-1})$. Untuk tugas pemahaman bahasa (misal: penentuan entitas bernama atau analisis sentimen), konteks dari kedua arah (*kiri dan kanan*) sangat krusial.

## 2. Masked Language Model (Devlin et al., 2019)
BERT me-masking 15% dari seluruh token input secara acak:
- **80%**: Diganti dengan token khusus \`[MASK]\`.
- **10%**: Diganti dengan kata acak acak.
- **10%**: Dipertahankan kata aslinya.

Fungsi kerugian dihitung hanya pada token yang di-masking:
$$\\mathcal{L}_{\\text{MLM}} = -\\sum_{i \\in \\text{masked}} \\log P(w_i \\mid \\tilde{\\mathbf{x}})$$
`,
        },
      ],
    },
    {
      id: "nlp-bab-6",
      slug: "metrik-evaluasi-generasi-teks-bleu-rouge",
      title: "BAB 6: Evaluasi Generasi Bahasa: BLEU, ROUGE & BERTScore",
      orderIndex: 6,
      description: "Pengukuran objektif kualitas teks terjemahan dan rangkuman: modified n-gram precision, brevity penalty pada BLEU (Papineni et al. 2002), recall-oriented ROUGE, dan kesamaan semantik embedding BERTScore.",
      subchapters: [
        {
          id: "nlp-bab-6-1",
          slug: "formulasi-bleu-dan-brevity-penalty",
          title: "6.1. Formulasi Matematika BLEU Score & Brevity Penalty",
          orderIndex: 1,
          description: "Mencegah kecurangan teks pendek menggunakan Brevity Penalty dan penghitungan presisi termodifikasi berbobot geometrik.",
          content_markdown: `# 6.1. Formulasi Matematika BLEU Score & Brevity Penalty

## 1. Modified N-Gram Precision ($p_n$)
Menghitung proporsi n-gram dalam kandidat hipotesis yang muncul dalam referensi manusia, dengan pemotongan batas frekuensi maksimum (*clipping*) agar pengulangan kata tunggal (misal: "the the the") tidak menghasilkan skor tinggi.

## 2. Brevity Penalty (BP)
Jika panjang hipotesis $c$ lebih pendek dari panjang referensi efektif $r$, teks dikenakan penalti eksponensial:

$$\\text{BP} = \\begin{cases} 1 & \\text{if } c > r \\\\ \\exp\\left( 1 - \\frac{r}{c} \\right) & \\text{if } c \\le r \\end{cases}$$

## 3. Rumus Akhir BLEU
$$\\text{BLEU} = \\text{BP} \\cdot \\exp\\left( \\sum_{n=1}^N w_n \\log p_n \\right)$$
Standar BLEU-4 menggunakan $N = 4$ dan bobot seragam $w_n = 1/4$.
`,
        },
      ],
    },
    {
      id: "nlp-bab-7",
      slug: "proyek-tokenizer-bpe-dan-klasifikasi",
      title: "BAB 7: Proyek Terapan: Tokenizer BPE dari Nol & Evaluator BLEU",
      orderIndex: 7,
      description: "Membangun sistem NLP fundamental: implementasi algoritma Byte-Pair Encoding (BPE) subword tokenization dari nol, kalkulasi BLEU score, dan pengujian sentimen berbasis representasi vektor.",
      subchapters: [
        {
          id: "nlp-bab-7-1",
          slug: "proyek-akhir-bpe-dan-bleu-python",
          title: "7.1. Proyek Akhir: Engine Tokenizer BPE & Evaluator BLEU Python",
          orderIndex: 1,
          description: "Kode Python mandiri: iterasi penggabungan pasangan frekuensi tertinggi BPE dan penghitungan modified n-gram precision BLEU.",
          content_markdown: `# 7.1. Proyek Akhir: Engine Tokenizer BPE & Evaluator BLEU Python

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
import collections
import math
from typing import Dict, List, Tuple

# --- Bagian 1: Algoritma Byte-Pair Encoding (BPE) Tokenizer ---
class SimpleBPETokenizer:
    def __init__(self, num_merges: int = 10):
        self.num_merges = num_merges
        self.merges: List[Tuple[str, str]] = []

    def get_stats(self, vocab: Dict[str, int]) -> Dict[Tuple[str, str], int]:
        pairs = collections.defaultdict(int)
        for word, freq in vocab.items():
            symbols = word.split()
            for i in range(len(symbols) - 1):
                pairs[(symbols[i], symbols[i + 1])] += freq
        return pairs

    def merge_vocab(self, pair: Tuple[str, str], vocab: Dict[str, int]) -> Dict[str, int]:
        new_vocab = {}
        bigram = " ".join(pair)
        replacement = "".join(pair)
        for word in vocab:
            new_word = word.replace(bigram, replacement)
            new_vocab[new_word] = vocab[word]
        return new_vocab

    def fit(self, corpus: List[str]):
        # Inisialisasi kosakata dengan spasi antar karakter dan end-of-word '</w>'
        vocab = collections.defaultdict(int)
        for text in corpus:
            for word in text.split():
                spaced_word = " ".join(list(word)) + " </w>"
                vocab[spaced_word] += 1

        print("=== MEMULAI PELATIHAN TOKENIZER BPE ===")
        for i in range(self.num_merges):
            pairs = self.get_stats(vocab)
            if not pairs:
                break
            best_pair = max(pairs, key=pairs.get)
            vocab = self.merge_vocab(best_pair, vocab)
            self.merges.append(best_pair)
            print(f"Iterasi {i+1:02d}: Menggabungkan pasangan {best_pair} (Frekuensi: {pairs[best_pair]})")

        return vocab

# --- Bagian 2: Evaluator BLEU-1 & BLEU-2 ---
def compute_bleu(reference: List[str], candidate: List[str]) -> float:
    """Menghitung skor BLEU-2 dengan Brevity Penalty sederhana."""
    c = len(candidate)
    r = len(reference)
    if c == 0:
        return 0.0

    # Brevity Penalty
    bp = 1.0 if c > r else math.exp(1.0 - (r / c))

    # Unigram Precision
    ref_counts = collections.Counter(reference)
    cand_counts = collections.Counter(candidate)
    clipped_unigrams = sum(min(count, ref_counts[word]) for word, count in cand_counts.items())
    p1 = clipped_unigrams / c

    # Bigram Precision
    cand_bigrams = [tuple(candidate[i:i+2]) for i in range(len(candidate) - 1)]
    ref_bigrams = [tuple(reference[i:i+2]) for i in range(len(reference) - 1)]
    
    if len(cand_bigrams) == 0:
        return bp * p1

    ref_bg_counts = collections.Counter(ref_bigrams)
    cand_bg_counts = collections.Counter(cand_bigrams)
    clipped_bigrams = sum(min(count, ref_bg_counts[bg]) for bg, count in cand_bg_counts.items())
    p2 = clipped_bigrams / len(cand_bigrams)

    # Rata-rata geometrik p1 dan p2
    if p1 == 0 or p2 == 0:
        return 0.0
    bleu_score = bp * math.exp(0.5 * math.log(p1) + 0.5 * math.log(p2))
    return round(bleu_score, 4)

# Demonstrasi Eksekusi BPE & BLEU
corpus_latih = [
    "kecerdasan buatan dan pemrosesan bahasa",
    "kecerdasan mesin dalam bahasa alami",
    "pemrosesan data cerdas untuk bahasa manusia"
]

bpe = SimpleBPETokenizer(num_merges=6)
vocab_hasil = bpe.fit(corpus_latih)

# Uji Evaluasi BLEU Mesin Terjemahan
ref_kalimat = "model transformer sangat efisien dalam pemrosesan bahasa".split()
hyp_kalimat = "model transformer sangat efektif dalam pemrosesan bahasa".split() # 1 kata beda

skor_bleu = compute_bleu(ref_kalimat, hyp_kalimat)
print(f"\\nSkor BLEU-2 Terkomputasi: {skor_bleu:.4f}")
assert skor_bleu > 0.60, "Skor BLEU untuk kalimat yang sangat mirip harus tinggi."
print("=== VERIFIKASI ENGINE NLP BERHASIL ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Ketepatan Algoritma BPE (35%)**: Penanganan simbol penanda batas kata dan pembaruan frekuensi pasangan bigram secara iteratif.
- **Formulasi BLEU & Brevity Penalty (35%)**: Penghitungan clipping frequency dan pembobotan n-gram yang benar.
- **Analisis Kinerja Komputasi (15%)**: Efisiensi manipulasi string dan struktur kamus data.
- **Kebersihan Kode & Modul Berorientasi Objek (15%)**: Kode Python modular yang dapat diintegrasikan ke pipeline pelatihan.
`,
        },
      ],
    },
  ],
};
