# -*- coding: utf-8 -*-
"""
Generator untuk Bab 5: Representasi Kata Terdistribusi (Word Embeddings: Word2Vec, GloVe, FastText) (10 Subbab)
Topik: Natural Language Processing (22-natural-language-processing.ts)
"""

import os
import sys
import json
import io
import contextlib
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

def run_code_capture_output(code_str: str) -> str:
    f = io.StringIO()
    with contextlib.redirect_stdout(f):
        scope = {}
        exec(code_str, scope)
    return f.getvalue()

subchapters = []

# ==============================================================================
# Subbab 5.1: Keterbatasan Vektor Sparse & Keunggulan Dense Embeddings
# ==============================================================================
code_5_1 = r'''import numpy as np

# Komparasi Representasi Vektor: Sparse One-Hot vs Dense Distributed Embedding
# Memperlihatkan kompresi dimensi, efisiensi memori, dan keberadaan relasi kemiripan semantik

vocab_size = 50000  # Kosakata 50.000 kata
embed_dim = 100     # Dimensi dense embedding (Word2Vec standar)

# 1. Sparse One-Hot Vector (Simulasi Memori & Ortogonalitas)
# Memori teoritis untuk 1 vektor float64
sparse_bytes = vocab_size * 8
dense_bytes = embed_dim * 8

# 2. Dense Semantic Vector (Simulasi 3 kata: "kucing", "anjing", "mobil")
np.random.seed(42)
# Kucing dan anjing berada di cluster yang berdekatan (hewan peliharaan)
v_kucing = np.array([0.8, 0.6, 0.1, -0.2] + list(np.random.normal(0, 0.1, embed_dim - 4)))
v_anjing = np.array([0.75, 0.65, 0.15, -0.18] + list(np.random.normal(0, 0.1, embed_dim - 4)))
# Mobil berada di orientasi semantik yang sangat berbeda
v_mobil  = np.array([-0.5, -0.2, 0.9, 0.8] + list(np.random.normal(0, 0.1, embed_dim - 4)))

def cos_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

sim_hewan = cos_sim(v_kucing, v_anjing)
sim_kendaraan = cos_sim(v_kucing, v_mobil)

print("Komparasi Vektor Sparse vs Vektor Dense:")
print("-" * 75)
print(f"Dimensi Vektor Sparse (One-Hot) : {vocab_size} dimensi | Ukuran: {sparse_bytes/1024:.1f} KB")
print(f"Dimensi Vektor Dense (Embedding): {embed_dim} dimensi    | Ukuran: {dense_bytes} bytes")
print(f"Rasio Kompresi Memori           : {sparse_bytes / dense_bytes:.1f}x lebih ringkas!")
print("-" * 75)
print(f"Cosine Sim 'kucing' vs 'anjing' : {sim_hewan:.4f} (Kemiripan semantik tinggi!)")
print(f"Cosine Sim 'kucing' vs 'mobil'  : {sim_kendaraan:.4f} (Ortogonal / tidak berkerabat)")
print("-" * 75)
print("Dense embeddings memadatkan makna ke dalam representasi kontinu berdimensi rendah.")
'''

subchapters.append({
    "id": "nlp-5-1-dense-embeddings-sparse-limitations",
    "chapterId": "natural-language-processing-ch-5",
    "title": "Keterbatasan Vektor Sparse & Keunggulan Dense Embeddings: Dari Simbolik ke Kontinu",
    "description": "Paradigma representasi leksikal kontinu: kegagalan vektor diskret berdimensi tinggi, prinsip representasi terdistribusi, dan efisiensi aljabar ruang laten berdimensi rendah.",
    "estimatedMinutes": 35,
    "order": 1,
    "content": {
        "theory": (
            "Sepanjang sejarah awal pemrosesan bahasa alami (1950-an hingga awal 2010-an), teks hampir secara eksklusif diperlakukan sebagai simbol diskret. Model seperti One-Hot Encoding, Bag-of-Words, dan TF-IDF menghasilkan representasi yang dikenal sebagai **Vektor Jarang (*Sparse Vectors*)**.\n\n"
            "Vektor sparse memiliki dua kelemahan fundamental yang tidak dapat dihindari:\n"
            "1. **Ukuran Dimensi Raksasa dan Pemborosan Memori**:\n"
            "   Dimensi vektor sama persis dengan ukuran kosakata $|\\mathcal{V}|$. Jika kamus memiliki $100.000$ kata, setiap kata adalah vektor $100.000$ dimensi di mana $99.999\\%$ nilainya adalah nol. Mengalikan matriks bobot jaringan saraf tiruan dengan vektor sparse sebesar ini membutuhkan operasi memori yang sangat mahal.\n"
            "2. **Ketidakmampuan Menggeneralisasi Semantik**:\n"
            "   Karena seluruh basis vektor sparse ortogonal secara tegak lurus, model klasifikasi teks yang mempelajari bahwa kata *\"hebat\"* berkonotasi positif tidak memiliki cara matematis untuk mentransfer pengetahuan tersebut ke kata *\"luar biasa\"* atau *\"fantastis\"* jika kata-kata tersebut tidak muncul dalam data latih bersamaan.\n\n"
            "Revolusi besar terjadi dengan diperkenalkannya **Representasi Terdistribusi (*Distributed Representations*)** atau **Dense Embeddings** (seperti Word2Vec, GloVe, dan FastText). Alih-alih merepresentasikan satu kata dengan satu dimensi eksklusif, makna kata didistribusikan ke seluruh dimensi kontinu riil berdimensi rendah ($d \\in [50, 300]$):\n"
            "$$\\mathbf{v}_w \\in \\mathbb{R}^d \\quad \\text{di mana } d \\ll |\\mathcal{V}|$$\n\n"
            "Dalam ruang laten kontinu ini:\n"
            "- Setiap dimensi merepresentasikan fitur semantik abstrak laten (seperti jenis kelamin, kehewanan, status sosial, keaktifan, bentuk waktu gramatikal).\n"
            "- Kata-kata yang memiliki makna atau konteks distribusional serupa akan terletak berdekatan dalam ruang geometris, memungkinkan transfer pengetahuan (*generalization*) yang sangat kuat ke seluruh downstream NLP tasks."
        ),
        "codeSnippet": code_5_1,
        "codeSnippetOutput": run_code_capture_output(code_5_1),
        "realWorldApplication": (
            "Lapisan pertama (*lookup table*) pada hampir seluruh model NLP modern (LSTM, GRU, Transformer, BERT, GPT), sistem pencarian semantik (vector database seperti Milvus, Pinecone, Qdrant)."
        ),
        "commonPitfalls": [
            r"Mengira bahwa setiap dimensi tunggal dari dense embedding memiliki label arti linguistik yang mudah diinterpretasikan manusia (makna sebenarnya terdistribusi melintasi kombinasi linear seluruh dimensi).",
            r"Menggunakan dimensi embedding terlalu besar (misal d > 1000) pada dataset kecil yang menyebabkan overfitting dan lambatnya komputasi.",
            r"Lupa menormalkan vektor embedding ke norma unit L2 sebelum melakukan pencarian tetangga terdekat berbasis dot product."
        ],
        "caseStudy": (
            "Sebuah model deteksi ulasan restoran dilatih menggunakan One-Hot Bag-of-Words. Kalimat latih memuat: 'makanannya amat lezat'. Kalimat uji memuat: 'makanannya sungguh sedap'. Jelaskan mengapa model One-Hot gagal menggeneralisasi ulasan tersebut, dan bagaimana representasi Dense Embedding secara otomatis menyelesaikan masalah tersebut."
        ),
        "academicReferences": [
            r"Hinton, G. E. (1986). Learning distributed representations of concepts. In Proceedings of the eighth annual conference of the cognitive science society (Vol. 1, p. 12).",
            r"Bengio, Y., Ducharme, R., Vincent, P., & Jauvin, C. (2003). A neural probabilistic language model. Journal of Machine Learning Research, 3(Feb), 1137-1155.",
            r"Mikolov, T., Chen, K., Corrado, G., & Dean, J. (2013). Efficient estimation of word representations in vector space. arXiv preprint arXiv:1301.3781."
        ]
    }
})

# ==============================================================================
# Subbab 5.2: Arsitektur Word2Vec (CBOW vs Skip-gram)
# ==============================================================================
code_5_2 = r'''import numpy as np

# Komparasi Arsitektur Word2Vec: CBOW (Continuous Bag-of-Words) vs Skip-gram
# CBOW: Memprediksi kata target tengah w_t berdasarkan kata-kata konteks sekitar
# Skip-gram: Memprediksi kata-kata konteks sekitar berdasarkan satu kata target tengah w_t

context_window = ["pemrosesan", "bahasa", "[ TARGET ]", "sangat", "menarik"]
target_true = "alami"

print("Dua Paradigma Arsitektur Word2Vec (Mikolov et al., 2013):")
print("-" * 75)
print(f"Kalimat Konteks: {' '.join(context_window)}\n")

print("1. Arsitektur CBOW (Continuous Bag-of-Words):")
print(f"   - Input  : Kata-kata konteks = ['pemrosesan', 'bahasa', 'sangat', 'menarik']")
print(f"   - Operasi: Rata-rata vektor konteks v_avg = 1/(2C) * sum(v_context)")
print(f"   - Output : Memprediksi probabilitas kata target -> '{target_true}'")
print(f"   - Sifat  : Sangat cepat dilatih, bekerja sangat baik untuk kata-kata frekuensi tinggi.")

print("\n2. Arsitektur Continuous Skip-gram:")
print(f"   - Input  : Tepat satu kata target tengah = '{target_true}'")
print(f"   - Output : Memprediksi serangkaian kata konteks:")
print(f"              P('pemrosesan' | '{target_true}'), P('bahasa' | '{target_true}'),")
print(f"              P('sangat' | '{target_true}'), P('menarik' | '{target_true}')")
print(f"   - Sifat  : Bekerja jauh lebih baik pada kata-kata langka (rare words) dan korpus berukuran sedang.")
print("-" * 75)
'''

subchapters.append({
    "id": "nlp-5-2-word2vec-cbow-skipgram-architecture",
    "chapterId": "natural-language-processing-ch-5",
    "title": "Arsitektur Word2Vec (Mikolov et al., 2013): CBOW vs Continuous Skip-gram",
    "description": "Perbandingan arsitektural dua model Word2Vec karya Tomas Mikolov et al.: mekanisme Continuous Bag-of-Words (CBOW) vs Continuous Skip-gram, perataan konteks, dan karakteristik data latih.",
    "estimatedMinutes": 40,
    "order": 2,
    "content": {
        "theory": (
            "Pada tahun 2013, tim peneliti Google yang dipimpin oleh **Tomas Mikolov** merevolusi pemrosesan bahasa alami dengan mempublikasikan keluarga algoritma **Word2Vec** (*Efficient Estimation of Word Representations in Vector Space*). Word2Vec membuktikan bahwa representasi vektor kata berkualitas tinggi dapat dipelajari secara mandiri tanpa supervisi manusia (*self-supervised*) dari miliaran kata dalam waktu beberapa jam saja.\n\n"
            "Mikolov dkk. merancang dua arsitektur komplementer yang saling berkebalikan:\n\n"
            "**1. Continuous Bag-of-Words (CBOW)**:\n"
            "- **Tujuan**: Memprediksi kata target sentral $w_t$ dari kumpulan kata konteks sekitarnya $w_{t-c}, \\dots, w_{t+c}$ (di mana $c$ adalah radius ukuran jendela).\n"
            "- **Mekanisme**: Vektor embedding dari seluruh kata konteks dijumlahkan atau dirata-ratakan pada lapisan tersembunyi (*projection layer*):\n"
            "  $$\\mathbf{h} = \\frac{1}{2c} \\sum_{-c \\le j \\le c, j \\neq 0} \\mathbf{v}_{w_{t+j}}$$\n"
            "- Nilai rata-rata $\\mathbf{h}$ kemudian diproyeksikan untuk memprediksi kata target $w_t$.\n"
            "- **Karakteristik**: Waktu pelatihan beberapa kali lipat lebih cepat daripada Skip-gram dan menghasilkan akurasi sintaktis yang sangat baik untuk kata-kata umum berfrekuensi tinggi karena efek perataan konteks menghaluskan derau distribusi.\n\n"
            "**2. Continuous Skip-gram**:\n"
            "- **Tujuan**: Membalik tugas CBOW: diberikan satu kata target tunggal $w_t$, model bertugas memprediksi kata-kata konteks yang mungkin muncul di sekelilingnya $w_{t+j}$ dalam rentang $-c \\le j \\le c$.\n"
            "- **Karakteristik**: Setiap pasangan (target, konteks) diperlakukan sebagai satu contoh pelatihan baru yang independen. Akibatnya, kata-kata yang jarang muncul (*rare words*) tidak tertelan oleh kata-kata umum di sekitarnya. Skip-gram menghasilkan representasi semantik yang jauh lebih kaya dan superior pada dataset berskala besar."
        ),
        "codeSnippet": code_5_2,
        "codeSnippetOutput": run_code_capture_output(code_5_2),
        "realWorldApplication": (
            "Ekstraksi fitur semantik pra-terlatih (*pretrained word vectors*) untuk model klasifikasi teks, mesin rekomendasi item berbasis Graph Embedding (Node2Vec, Item2Vec), dan bioinformatika (Gene2Vec)."
        ),
        "commonPitfalls": [
            r"Mengasumsikan CBOW mempertimbangkan urutan kata pada konteks (nama 'Bag-of-Words' secara eksplisit menunjukkan bahwa urutan kata konteks dijumlahkan tanpa bobot posisi).",
            r"Memilih CBOW ketika fokus tugas adalah menangkap semantik kata-kata teknis atau istilah langka (Skip-gram jauh lebih unggul untuk kata langka).",
            r"Mengabaikan ukuran jendela konteks c (jendela kecil c=2 menangkap fungsi gramatikal, sedangkan jendela besar c=10 menangkap domain topik)."
        ],
        "caseStudy": (
            "Sebuah tim NLP ingin membangun representasi vektor untuk korpus medis yang banyak memuat istilah penyakit langka. Mengapa arsitektur Continuous Skip-gram lebih direkomendasikan daripada CBOW untuk tugas ini? Jelaskan berdasarkan mekanisme pembaruan gradien kedua model."
        ),
        "academicReferences": [
            r"Mikolov, T., Chen, K., Corrado, G., & Dean, J. (2013). Efficient estimation of word representations in vector space. arXiv preprint arXiv:1301.3781.",
            r"Mikolov, T., Sutskever, I., Chen, K., Corrado, G. S., & Dean, J. (2013). Distributed representations of words and phrases and their compositionality. Advances in Neural Information Processing Systems (NeurIPS), 26, 3111-3119.",
            r"Goldberg, Y., & Levy, O. (2014). word2vec Explained: deriving Mikolov et al.'s negative-sampling word-embedding method. arXiv preprint arXiv:1402.3722."
        ]
    }
})

# ==============================================================================
# Subbab 5.3: Fungsi Objektif Skip-gram Standar & Kendala Softmax Penuh
# ==============================================================================
code_5_3 = r'''import numpy as np

# Simulasi Hambatan Komputasi Softmax Penuh pada Skip-gram
# P(w_O | w_I) = \frac{\exp(v'_{w_O}^T v_{w_I})}{\sum_{w=1}^W \exp(v'_w^T v_{w_I})}
# Kompleksitas O(|V|) per langkah pelatihan!

V_small = 1000       # Kosakata kecil
V_large = 100000     # Kosakata realistis industri
d = 300              # Dimensi embedding

v_I = np.random.randn(d)
W_out_small = np.random.randn(V_small, d)
W_out_large = np.random.randn(V_large, d)

# Hitung jumlah operasi floating point (FLOPs) untuk partisi Softmax
flops_small = 2 * V_small * d + V_small  # dot products + exp/sum
flops_large = 2 * V_large * d + V_large

print("Analisis Hambatan Komputasi Full Softmax Word2Vec:")
print("-" * 75)
print(f"Dimensi Embedding d = {d}\n")
print(f"1. Kosakata Kecil (|V| = {V_small:,}):")
print(f"   FLOPs per kata konteks : {flops_small:,} operasi")
print(f"\n2. Kosakata Realistis (|V| = {V_large:,}):")
print(f"   FLOPs per kata konteks : {flops_large:,} operasi ({flops_large/1e6:.2f} MFLOPs)")
print("-" * 75)
print(f"Untuk korpus 1 miliar kata dengan jendela konteks c = 5 (10 pasangan per kata):")
total_ops_large = 1e9 * 10 * flops_large
print(f"Total Operasi Full Softmax : {total_ops_large:.2e} FLOPs (Mustahil dilatih tanpa akselerasi!)")
print("-" * 75)
print("Solusi Mikolov (NeurIPS 2013): Mengganti Full Softmax dengan Negative Sampling (SGNS)!")
'''

subchapters.append({
    "id": "nlp-5-3-skipgram-objective-full-softmax",
    "chapterId": "natural-language-processing-ch-5",
    "title": "Fungsi Objektif Skip-gram Standar & Kendala Komputasi Softmax Penuh",
    "description": "Formulasi fungsi objektif log-likelihood Skip-gram, kendala partisi normalisasi penyebut Softmax berdimensi |V|, dan analisis hambatan kompleksitas waktu O(|V|).",
    "estimatedMinutes": 35,
    "order": 3,
    "content": {
        "theory": (
            "Untuk memahami mengapa penemuan Word2Vec sangat bersejarah, kita harus menelaah fungsi objektif matematis dari Continuous Skip-gram standar dan mengenali rintangan komputasi raksasa yang menghadangnya.\n\n"
            "Diberikan sebuah sekuens kata latih $w_1, w_2, \\dots, w_T$, tujuan pelatihan model Skip-gram adalah memaksimalkan rata-rata log-probability dari prediksi kata-kata konteks sekitar dalam jendela radius $c$:\n"
            "$$\\mathcal{L}_{\\text{Skip-gram}} = \\frac{1}{T} \\sum_{t=1}^T \\sum_{-c \\le j \\le c, j \\neq 0} \\log P(w_{t+j} \\mid w_t)$$\n\n"
            "Dalam formulasi jaringan saraf tiruan standar, probabilitas bersyarat $P(w_O \\mid w_I)$ dirumuskan menggunakan fungsi **Softmax Multikelas**:\n"
            "$$P(w_O \\mid w_I) = \\frac{\\exp\\left( {\\mathbf{v}'_{w_O}}^T \\mathbf{v}_{w_I} \\right)}{\\sum_{w=1}^{|\\mathcal{V}|} \\exp\\left( {\\mathbf{v}'_w}^T \\mathbf{v}_{w_I} \\right)}$$\n"
            "di mana:\n"
            "- $\\mathbf{v}_{w_I} \\in \\mathbb{R}^d$ adalah vektor representasi kata masukan (*input vector*) dari kata target pusat $w_I$.\n"
            "- $\\mathbf{v}'_{w_O} \\in \\mathbb{R}^d$ adalah vektor representasi kata keluaran (*output vector*) dari kata konteks target $w_O$.\n"
            "- $|\\mathcal{V}|$ adalah ukuran total kamus kosakata.\n\n"
            "**Kendala Komputasi Partisi Normalisasi (The Softmax Bottleneck)**:\n"
            "Perhatikan suku penyebut pada persamaan Softmax di atas: $\\sum_{w=1}^{|\\mathcal{V}|} \\exp({\\mathbf{v}'_w}^T \\mathbf{v}_{w_I})$. Untuk menghitung probabilitas tepat dari *satu* kata konteks saja, model harus menghitung hasil kali titik (*dot product*) berdimensi $d$ dan fungsi eksponensial terhadap **setiap kata yang ada di seluruh kamus kosakata** $|\\mathcal{V}|$.\n\n"
            "Kompleksitas komputasi untuk setiap langkah pembaruan gradien adalah $\\\mathcal{O}(|\\mathcal{V}| \\cdot d)$. Pada korpus nyata di mana $|\\mathcal{V}| = 100.000$ hingga $1.000.000$, komputasi ini menuntut ratusan juta operasi perkalian matriks per kata. Melatih model pada korpus miliaran kata menjadi komputasi yang tidak layak (*computationally intractable*), mendorong Mikolov et al. menciptakan **Negative Sampling**."
        ),
        "codeSnippet": code_5_3,
        "codeSnippetOutput": run_code_capture_output(code_5_3),
        "realWorldApplication": (
            "Memahami batas komputasi pelatihan model bahasa probabilitas penuh yang mendasari penggunaan aproksimasi Softmax pada GPT, Transformer (sampled softmax), dan arsitektur pengenalan wicara."
        ),
        "commonPitfalls": [
            r"Menerapkan Softmax penuh secara naif pada kamus kosakata di atas 50.000 kata saat melatih Word2Vec dari nol tanpa GPU cluster besar.",
            r"Lupa membedakan antara matriks vektor input V (bobot W_in) dan matriks vektor output V' (bobot W_out).",
            r"Mengabaikan masalah stabilitas numerik floating-point overflow pada fungsi eksponensial exp(z) tanpa teknik log-sum-exp trick."
        ],
        "caseStudy": (
            "Sebuah model bahasa neural memiliki ukuran kosakata 200.000 kata dan dimensi laten d = 512. Jika dataset pelatihan memuat 500 juta token, hitung perkiraan total operasi floating point yang dihabiskan semata-mata untuk menghitung penyebut fungsi Softmax penuh."
        ),
        "academicReferences": [
            r"Bengio, Y., Ducharme, R., Vincent, P., & Jauvin, C. (2003). A neural probabilistic language model. Journal of Machine Learning Research, 3(Feb), 1137-1155.",
            r"Mikolov, T., Chen, K., Corrado, G., & Dean, J. (2013). Efficient estimation of word representations in vector space. arXiv preprint arXiv:1301.3781.",
            r"Mikolov, T., Sutskever, I., Chen, K., Corrado, G. S., & Dean, J. (2013). Distributed representations of words and phrases and their compositionality. NeurIPS 2013."
        ]
    }
})

# ==============================================================================
# Subbab 5.4: Optimasi Efisien: Negative Sampling (SGNS) (Spot-Check 5)
# ==============================================================================
code_5_4 = r'''from collections import Counter
import numpy as np

# Optimasi Efisien: Skip-gram with Negative Sampling (SGNS) (Mikolov et al., NeurIPS 2013)
# Persamaan Objektif (Mikolov 2013, Eq. 4):
# \log \sigma({v'_{w_O}}^\top v_{w_I}) + \sum_{i=1}^k \mathbb{E}_{w_i \sim P_n(w)} [ \log \sigma(-{v'_{w_i}}^\top v_{w_I}) ]
# Distribusi Noise Unigram Terdistorsi: P_n(w) \propto U(w)^{3/4}

# Korpus frekuensi mainan
unigram_counts = {
    "yang": 10000, "dan": 8000, "di": 7000,
    "teknologi": 500, "komputer": 400,
    "algoritma": 50, "velqora": 2
}

words = list(unigram_counts.keys())
counts = np.array([unigram_counts[w] for w in words], dtype=float)

# Distribusi unigram mentah U(w)
p_raw = counts / counts.sum()

# Distribusi noise Word2Vec U(w)^{3/4}
counts_pow34 = counts ** 0.75
p_noise_34 = counts_pow34 / counts_pow34.sum()

print("Analisis Distribusi Noise Negative Sampling Mikolov et al. (NeurIPS 2013):")
print("-" * 75)
print(f"{'Kata':<12} | {'Count Mentah':<12} | {'P_raw (U(w))':<15} | {'P_noise (U(w)^0.75)':<20} | {'Rasio P_noise/P_raw':<15}")
print("-" * 75)

for i, w in enumerate(words):
    ratio = p_noise_34[i] / p_raw[i]
    print(f"{w:<12} | {int(counts[i]):<12} | {p_raw[i]:<15.6f} | {p_noise_34[i]:<20.6f} | {ratio:<15.2f}x")

print("-" * 75)
print("Temuan Mikolov: Eksponen 3/4 mendongkrak probabilitas sampling kata langka ('algoritma', 'velqora')")
print("secara drastis (hingga belasan kali lipat), sambil menekan dominasi kata sangat umum ('yang', 'dan').")
'''

subchapters.append({
    "id": "nlp-5-4-negative-sampling-sgns-optimization",
    "chapterId": "natural-language-processing-ch-5",
    "title": "Optimasi Efisien: Negative Sampling (SGNS) dan Distribusi Unigram Terdistorsi 3/4",
    "description": "Karya seminal Tomas Mikolov et al. (NeurIPS 2013): reformulasi klasifikasi biner logistik, derivasi fungsi objektif SGNS, dan distribusi sampling kebisingan U(w)^(3/4) (Spot-Check Literatur Primer).",
    "estimatedMinutes": 40,
    "order": 4,
    "content": {
        "theory": (
            "Untuk mengatasi rintangan komputasi Softmax penuh yang menuntut $\\mathcal{O}(|\\mathcal{V}|)$, Tomas Mikolov, Ilya Sutskever, Kai Chen, Greg Corrado, dan Jeffrey Dean (NeurIPS 2013) mempublikasikan karya seminal berjudul *'Distributed Representations of Words and Phrases and their Compositionality'*. Mereka memperkenalkan teknik revolusioner yang disederhanakan dari Noise Contrastive Estimation (Gutmann & Hyvärinen, 2012) yang disebut **Negative Sampling (SGNS)**.\n\n"
            "Gagasan revolusioner di balik Negative Sampling adalah mengubah tugas estimasi probabilitas multikelas atas $|\\mathcal{V}|$ kata menjadi serangkaian **masalah klasifikasi biner logistik sederhana**: membedakan antara pasangan kata konteks riil (*target-context positive pairs*) dari sekumpulan $k$ kata derau acak (*negative samples*) yang diambil dari kamus kosakata.\n\n"
            "Secara formal, pada Section 2.2, Persamaan 4 dari makalah NeurIPS 2013, fungsi objektif Negative Sampling didefinisikan sebagai:\n"
            "$$\\log \\sigma({\\mathbf{v}'_{w_O}}^T \\mathbf{v}_{w_I}) + \\sum_{i=1}^k \\mathbb{E}_{w_i \\sim P_n(w)} \\left[ \\log \\sigma(-{\\mathbf{v}'_{w_i}}^T \\mathbf{v}_{w_I}) \\right]$$\n"
            "di mana:\n"
            "- $\\sigma(x) = \\frac{1}{1 + e^{-x}}$ adalah fungsi sigmoid standar.\n"
            "- Kata konteks sejati $w_O$ dimaksimalkan probabilitas kebenarannya $\\sigma({\\mathbf{v}'_{w_O}}^T \\mathbf{v}_{w_I}) \\to 1$.\n"
            "- Sejumlah $k$ kata sampel negatif $w_i$ dimaksimalkan ketidakbenarannya $\\sigma(-{\\mathbf{v}'_{w_i}}^T \\mathbf{v}_{w_I}) \\to 1$ (ekuivalen dengan $1 - \\sigma({\\mathbf{v}'_{w_i}}^T \\mathbf{v}_{w_I}) \\to 0$).\n"
            "- Nilai hyperparameter $k$ biasanya disetel ke rentang $5 - 20$ untuk dataset kecil, dan $2 - 5$ untuk dataset raksasa.\n\n"
            "Dengan transformasi ini, kompleksitas komputasi per kata turun drastis dari $\\\mathcal{O}(|\\mathcal{V}| \\cdot d)$ menjadi hanya **$\\\mathcal{O}(k \\cdot d)$**—peningkatan efisiensi komputasi ribuan kali lipat!\n\n"
            "**Distribusi Kebisingan Unigram Terdistorsi ($3/4$rd Power)**:\n"
            "Bagaimana cara memilih kata negatif $w_i$? Jika menggunakan distribusi unigram murni $U(w)$, kata-kata umum (seperti *\"dan\"*, *\"yang\"*) akan selalu terpilih, sementara kata-kata langka tidak pernah diperbarui. Jika menggunakan distribusi seragam (*uniform*), kata-kata langka terpilih terlalu sering. Mikolov dkk. melakukan eksperimen empiris komprehensif dan menemukan formula kompromi yang paling optimal: memangkatkan frekuensi unigram dengan eksponen $\\frac{3}{4}$:\n"
            "$$P_n(w) = \\frac{U(w)^{3/4}}{\\sum_{w'} U(w')^{3/4}}$$\n"
            "Pangkat $\\frac{3}{4}$ ini secara matematis mendongkrak probabilitas kemunculan kata-kata langka tanpa mengabaikan frekuensi empiris korpus."
        ),
        "codeSnippet": code_5_4,
        "codeSnippetOutput": run_code_capture_output(code_5_4),
        "realWorldApplication": (
            "Metode optimasi paling dominan pada Graph Neural Networks (Node2Vec, DeepWalk), sistem rekomendasi retrieval kontras dua menara (*two-tower models* YouTube/Pinterest), dan representasi entitas pengetahuan."
        ),
        "commonPitfalls": [
            r"Lupa tanda minus pada sigmoid contoh negatif \log \sigma(-v'^T v), yang menyebabkan gradien mendorong contoh negatif ke arah yang salah.",
            r"Mengambil sampel negatif menggunakan distribusi unigram murni tanpa eksponen 0.75 yang mengakibatkan kata-kata spesifik tidak pernah terperbarui.",
            r"Menyetel nilai k terlalu besar pada korpus besar yang memperlambat kecepatan konvergensi tanpa memberikan peningkatan akurasi representasi."
        ],
        "caseStudy": (
            "Sebuah kata langka 'ornitologi' memiliki probabilitas kemunculan empiris U(w) = 1e-6, sedangkan kata umum 'ini' memiliki U(w) = 0.05. Hitung rasio probabilitas pemilihan kedua kata tersebut dalam distribusi seragam, distribusi unigram murni, dan distribusi unigram terdistorsi 3/4. Jelaskan mengapa formula Mikolov merupakan kompromi paling ideal."
        ),
        "academicReferences": [
            r"Mikolov, T., Sutskever, I., Chen, K., Corrado, G. S., & Dean, J. (2013). Distributed representations of words and phrases and their compositionality. Advances in Neural Information Processing Systems (NeurIPS), 26, 3111-3119.",
            r"Gutmann, M. U., & Hyvärinen, A. (2012). Noise-contrastive estimation of unnormalized statistical models, with applications to natural image statistics. Journal of Machine Learning Research, 13(Feb), 307-361.",
            r"Goldberg, Y., & Levy, O. (2014). word2vec Explained: deriving Mikolov et al.'s negative-sampling word-embedding method. arXiv preprint arXiv:1402.3722."
        ]
    }
})

# ==============================================================================
# Subbab 5.5: Hierarchical Softmax
# ==============================================================================
code_5_5 = r'''import numpy as np

# Konsep Hierarchical Softmax Menggunakan Pohon Biner Huffman
# Mengurangi kompleksitas komputasi dari O(|V|) menjadi O(log_2 |V|)
# Probabilitas kata w adalah hasil kali probabilitas percabangan sigmoid sepanjang lintasan akar ke daun

# Contoh pohon biner sederhana untuk 4 kata dengan kedalaman 2
# Root -> Node 1 (kiri: "anjing", kanan: "kucing")
#      -> Node 2 (kiri: "mobil",  kanan: "pesawat")

v_input = np.array([0.5, -0.3]) # Vektor kata masukan

# Bobot simpul internal pohon biner
theta_root = np.array([0.2, 0.4])
theta_node1 = np.array([0.8, -0.1])

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))

# Misalkan kata target adalah "anjing" (lintasan: Root -> belok Kiri -> Node 1 -> belok Kiri -> Daun "anjing")
# Belok Kiri = sigmoid(theta^T v), Belok Kanan = 1 - sigmoid(theta^T v)
p_root_left = sigmoid(np.dot(theta_root, v_input))
p_node1_left = sigmoid(np.dot(theta_node1, v_input))

p_anjing = p_root_left * p_node1_left

print("Hierarchical Softmax Berbasis Pohon Biner:")
print("-" * 65)
print(f"Probabilitas Belok Kiri di Root (menuju Hewan)   : {p_root_left:.4f}")
print(f"Probabilitas Belok Kiri di Node 1 (menuju Anjing): {p_node1_left:.4f}")
print(f"Probabilitas Komposit Akhir P('anjing' | v_in)    : {p_anjing:.4f}")
print("-" * 65)
print("Komparasi Kompleksitas Evaluasi untuk Kosakata |V| = 1.000.000:")
print(f"  - Full Softmax        : 1.000.000 evaluasi dot product")
print(f"  - Hierarchical Softmax: log2(1.000.000) ≈ 20 evaluasi dot product! (50.000x lebih cepat)")
'''

subchapters.append({
    "id": "nlp-5-5-hierarchical-softmax-huffman",
    "chapterId": "natural-language-processing-ch-5",
    "title": "Hierarchical Softmax: Dekomposisi Pohon Huffman Biner Menuju Kompleksitas O(log |V|)",
    "description": "Metode aproksimasi pohon probabilitas: dekomposisi ruang kosakata ke dalam pohon Huffman biner, kalkulasi probabilitas bersyarat lintasan simpul internal, dan efisiensi logaritmik.",
    "estimatedMinutes": 35,
    "order": 5,
    "content": {
        "theory": (
            "Selain Negative Sampling, pendekatan alternatif yang sangat elegan secara matematis untuk menyelesaikan kendala Softmax penuh adalah **Hierarchical Softmax** (Morin & Bengio, 2005; Mikolov et al., 2013).\n\n"
            "Alih-alih memperlakukan penentuan kata target sebagai pemilihan datar atas $|\\mathcal{V}|$ kelas secara serempak, Hierarchical Softmax mengorganisasi seluruh kosakata ke dalam daun-daun (*leaves*) dari sebuah **Pohon Biner (*Binary Tree*)**.\n\n"
            "Dalam arsitektur pohon biner:\n"
            "- Setiap kata $w \\in \\mathcal{V}$ diposisikan tepat pada satu simpul daun (*leaf node*).\n"
            "- Untuk setiap simpul daun, terdapat lintasan tunggal unik (*unique path*) dari simpul akar (*root*) menuju daun tersebut.\n"
            "- Setiap simpul internal $j$ pada pohon memiliki vektor parameter yang dapat dipelajari $\\boldsymbol{\\theta}_j$.\n\n"
            "Probabilitas bersyarat $P(w \\mid w_I)$ dihitung sebagai produk probabilitas dari serangkaian keputusan biner (belok kiri vs belok kanan) di setiap simpul internal sepanjang lintasan akar ke daun:\n"
            "$$P(w \\mid w_I) = \\prod_{j=1}^{L(w) - 1} P(n(w, j+1) \\mid n(w, j))$$\n"
            "$$P(\\text{belok kiri}) = \\sigma\\left( \\boldsymbol{\\theta}_{n(w, j)}^T \\mathbf{v}_{w_I} \\right), \\quad P(\\text{belok kanan}) = 1 - \\sigma\\left( \\boldsymbol{\\theta}_{n(w, j)}^T \\mathbf{v}_{w_I} \\right)$$\n"
            "di mana $L(w)$ adalah panjang lintasan simpul, dan $n(w, j)$ adalah simpul ke-$j$ pada lintasan kata $w$.\n\n"
            "**Efisiensi Pohon Huffman (*Huffman Tree Decomposition*)**:\n"
            "Mikolov dkk. menggunakan pohon pengkodean Huffman biner di mana kata-kata yang sangat sering muncul ditempatkan pada kedalaman pohon yang dangkal (lintasan pendek), sedangkan kata-kata langka ditempatkan pada kedalaman yang lebih dalam. Hasilnya, rata-rata panjang lintasan hanya sebanding dengan $\\\mathcal{O}(\\log_2 |\\mathcal{V}|)$. Untuk kosakata $1.000.000$ kata, model hanya perlu mengevaluasi sekitar $\\approx 20$ simpul per kata, menjamin normalisasi probabilitas yang ketat tanpa komputasi eksponensial."
        ),
        "codeSnippet": code_5_5,
        "codeSnippetOutput": run_code_capture_output(code_5_5),
        "realWorldApplication": (
            "Model bahasa statistik pada perangkat memori terbatas, FastText teks klasifikasi (Joulin et al., 2017) untuk klasifikasi ribuan label kelas secara real-time pada CPU."
        ),
        "commonPitfalls": [
            r"Mengasumsikan Hierarchical Softmax membutuhkan matriks bobot keluaran berukuran |V| x d (bobot keluaran disimpan pada simpul internal yang berjumlah |V| - 1).",
            r"Membangun pohon biner acak alih-alih pohon Huffman berbasis frekuensi yang menghilangkan keuntungan panjang lintasan pendek untuk kata umum.",
            r"Lupa menegakkan konstrain penjumlahan probabilitas belok kiri + belok kanan = 1.0 pada setiap simpul internal."
        ],
        "caseStudy": (
            "Bandingkan keuntungan komputasi dan karakteristik representasi antara Hierarchical Softmax vs Negative Sampling. Jelaskan mengapa Negative Sampling lebih populer untuk representasi semantik umum, sedangkan Hierarchical Softmax lebih unggul jika model diwajibkan menghasilkan distribusi probabilitas sejati yang menjumlah ke satu."
        ),
        "academicReferences": [
            r"Morin, F., & Bengio, Y. (2005). Hierarchical probabilistic neural network language model. In AISTATS (Vol. 5, pp. 246-252).",
            r"Mnih, A., & Hinton, G. E. (2009). A scalable hierarchical distributed language model. Advances in Neural Information Processing Systems (NeurIPS), 21.",
            r"Mikolov, T., Sutskever, I., Chen, K., Corrado, G. S., & Dean, J. (2013). Distributed representations of words and phrases and their compositionality. NeurIPS 2013."
        ]
    }
})

# ==============================================================================
# Subbab 5.6: Geometri & Sifat Aljabar Vektor Word2Vec
# ==============================================================================
code_5_6 = r'''import numpy as np

# Demonstrasi Sifat Aljabar Vektor Word2Vec: Penalaran Analogis Geometris
# v("King") - v("Man") + v("Woman") \approx v("Queen")

# Vektor semantik terkonfigurasi dengan fitur laten: [Gender (-1 Pria, +1 Wanita), Royalti (0 Rakyat, 1 Raja/Ratu), Usia]
v_man   = np.array([-0.9, 0.05, 0.6])
v_woman = np.array([ 0.9, 0.05, 0.6])
v_king  = np.array([-0.85, 0.95, 0.65])
v_queen = np.array([ 0.88, 0.96, 0.64])
v_apple = np.array([ 0.0, -0.8, -0.2]) # Kontrol non-royalti

# Hitung vektor analogi sintesis: v_analogy = v_king - v_man + v_woman
v_analogy = v_king - v_man + v_woman

def cos_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

sim_to_queen = cos_sim(v_analogy, v_queen)
sim_to_apple = cos_sim(v_analogy, v_apple)

print("Aljabar Vektor dan Penalaran Analogi Word2Vec:")
print("-" * 75)
print(f"Vektor Man       : {v_man}")
print(f"Vektor Woman     : {v_woman}")
print(f"Vektor King      : {v_king}")
print(f"Vektor Queen     : {v_queen}\n")
print(f"Sintesis Geometrik (King - Man + Woman) = {v_analogy}")
print("-" * 75)
print(f"Cosine Similarity(Analogi, 'Queen') = {sim_to_queen:.4f} (Kecocokan geometri SANGAT TINGGI!)")
print(f"Cosine Similarity(Analogi, 'Apple') = {sim_to_apple:.4f} (Tidak relevan)")
print("-" * 75)
print("Word2Vec secara otomatis mengkodekan relasi semantik linear dalam ruang vektor.")
'''

subchapters.append({
    "id": "nlp-5-6-vector-geometry-analogical-reasoning",
    "chapterId": "natural-language-processing-ch-5",
    "title": "Geometri & Sifat Aljabar Vektor Word2Vec: Penalaran Analogis dan Struktur Ruang Laten",
    "description": "Fenomena keteraturan linear ruang laten: aritmatika vektor semantik dan sintaktis (King - Man + Woman ≈ Queen), metrik 3CosAdd vs 3CosMul, dan visualisasi manifold t-SNE.",
    "estimatedMinutes": 35,
    "order": 6,
    "content": {
        "theory": (
            "Salah satu penemuan paling memukau dan tidak terduga dari Word2Vec yang mengguncang komunitas kecerdasan buatan global adalah munculnya **Keteraturan Linear (*Linear Vector Substructures*)** dalam ruang embedding.\n\n"
            "Meskipun model Word2Vec dilatih murni untuk tugas prediksi statistik probabilitas lokal tanpa instruksi semantik eksplisit mengenai gramatika atau relasi dunia nyata, ruang vektor yang terbentuk secara spontan mengorganisasi dirinya sedemikian rupa sehingga relasi semantik antar konsep dipetakan sebagai **vektor perpindahan linear (*displacement vectors*)** yang konsisten.\n\n"
            "Contoh paling terkenal di dunia adalah formula analogi raja-ratu:\n"
            "$$\\mathbf{v}_{\\text{King}} - \\mathbf{v}_{\\text{Man}} + \\mathbf{v}_{\\text{Woman}} \\approx \\mathbf{v}_{\\text{Queen}}$$\n"
            "Aritmatika ini membuktikan bahwa selisih vektor $\\mathbf{v}_{\\text{Woman}} - \\mathbf{v}_{\\text{Man}}$ mengisolasi komponen arah gender murni. Menambahkan arah gender wanita tersebut ke konsep monarki $\\mathbf{v}_{\\text{King}}$ secara tepat memindahkan koordinat spasial ke lingkungan vektor $\\mathbf{v}_{\\text{Queen}}$.\n\n"
            "**Bentuk Keteraturan Lainnya**:\n"
            "1. **Relasi Geografis Ibukota-Negara**: $\\mathbf{v}_{\\text{Paris}} - \\mathbf{v}_{\\text{France}} + \\mathbf{v}_{\\text{Japan}} \\approx \\mathbf{v}_{\\text{Tokyo}}$.\n"
            "2. **Morfologi Gramatikal Bahasa**: Bentuk lampau (*past tense*): $\\mathbf{v}_{\\text{walking}} - \\mathbf{v}_{\\text{walked}} + \\mathbf{v}_{\\text{swam}} \\approx \\mathbf{v}_{\\text{swimming}}$.\n"
            "3. **Relasi Komparatif & Superlatif**: $\\mathbf{v}_{\\text{bigger}} - \\mathbf{v}_{\\text{big}} + \\mathbf{v}_{\\text{cold}} \\approx \\mathbf{v}_{\\text{colder}}$.\n\n"
            "Dalam penyelesaian kueri analogi $a : b :: c : d$, algoritma mencari kata kandidat $w^*$ yang memaksimalkan metrik **3CosAdd** atau **3CosMul** (Levy & Goldberg, 2014):\n"
            "$$w^* = \\arg\\max_{w \\notin \\{a, b, c\\}} \\cos(\\mathbf{v}_w, \\mathbf{v}_b - \\mathbf{v}_a + \\mathbf{v}_c)$$\n"
            "$$w^*_{\\text{3CosMul}} = \\arg\\max_{w \\notin \\{a, b, c\\}} \\frac{\\cos(\\mathbf{v}_w, \\mathbf{v}_b) \\cdot \\cos(\\mathbf{v}_w, \\mathbf{v}_c)}{\\cos(\\mathbf{v}_w, \\mathbf{v}_a) + \\epsilon}$$\n"
            "Metode multiplicative 3CosMul mencegah satu suku komponen mendominasi hasil seleksi kesamaan kosinus."
        ),
        "codeSnippet": code_5_6,
        "codeSnippetOutput": run_code_capture_output(code_5_6),
        "realWorldApplication": (
            "Penyelesaian tes analogi kata SAT secara otomatis, perluasan leksikon dwibahasa tanpa kamus paralel (*cross-lingual zero-shot alignment*), dan audit bias gender/sosial pada representasi AI."
        ),
        "commonPitfalls": [
            r"Lupa mengeluarkan kata-kata input kueri (a, b, c) dari pencarian argmax sehingga model sering mengembalikan kata c itu sendiri karena kedekatan kosinus tinggi.",
            r"Mengabaikan bias sosiologis laten yang terserap dari korpus teks manusia (misal analogi bias: Doctor - Man + Woman = Nurse) yang memerlukan teknik debiasing ruang proyeksi.",
            r"Mengasumsikan seluruh relasi semantik kompleks dapat diselesaikan dengan penjumlahan linear sederhana (relasi hierarki taksonomi bagian-keseluruhan sering gagal pada geometri Euclidean murni)."
        ],
        "caseStudy": (
            "Diberikan kuartet analogi negara dan ibukota: 'Jakarta' : 'Indonesia' :: 'Tokyo' : 'Jepang'. Jelaskan bagaimana representasi Word2Vec memetakan relasi ini ke dalam bentuk jajaran genjang dalam ruang embedding multidimensi dan mengapa jarak vektor (Jakarta - Indonesia) sejajar dengan (Tokyo - Jepang)."
        ),
        "academicReferences": [
            r"Mikolov, T., Yih, W. T., & Zweig, G. (2013). Linguistic regularities in continuous space word representations. In NAACL-HLT (pp. 746-751).",
            r"Levy, O., & Goldberg, Y. (2014). Linguistic regularities in sparse and explicit word representations. In CoNLL (pp. 171-180).",
            r"Bolukbasi, T., Chang, K. W., Zou, J. Y., Saligrama, V., & Kalai, A. T. (2016). Man is to computer programmer as woman is to homemaker? debiasing word embeddings. NeurIPS 2016."
        ]
    }
})

# ==============================================================================
# Subbab 5.7: GloVe (Global Vectors for Word Representation)
# ==============================================================================
code_5_7 = r'''import numpy as np

# GloVe (Global Vectors for Word Representation - Pennington et al., EMNLP 2014)
# Fungsi Objektif Loss Kuadrat Terbobot (Pennington 2014, Eq. 8):
# J = \sum_{i,j=1}^V f(X_{i,j}) (w_i^T \tilde{w}_j + b_i + \tilde{b}_j - \log X_{i,j})^2
# Fungsi Pembobotan f(x) = (x / x_max)^\alpha jika x < x_max, else 1.0 (x_max = 100, \alpha = 0.75)

x_max = 100.0
alpha = 0.75

def glove_weighting_fn(x, x_max=100.0, alpha=0.75):
    return np.where(x < x_max, (x / x_max) ** alpha, 1.0)

# Simulasi ko-okurensi: kata langka (x=2), sedang (x=50), sangat sering (x=10000)
cooc_counts = np.array([2.0, 10.0, 50.0, 100.0, 500.0, 10000.0])
weights = glove_weighting_fn(cooc_counts, x_max, alpha)

print("Analisis Fungsi Pembobotan GloVe (Pennington et al., 2014):")
print("-" * 75)
print(f"Parameter: x_max = {x_max}, alpha = {alpha}\n")
print(f"{'Hitungan Ko-okurensi X_{i,j}':<30} | {'Bobot Loss f(X_{i,j})':<25}")
print("-" * 75)
for x, w in zip(cooc_counts, weights):
    cap_str = " (Terpotong di Plafon 1.0)" if x >= x_max else ""
    print(f"X = {x:<25.1f} | f(X) = {w:<10.4f}{cap_str}")

print("-" * 75)
print("Prinsip GloVe: f(X) bernilai 0 saat X=0 (tidak membuang waktu komputasi pasangan 0),")
print("dan f(X) dibatasi maksimum 1.0 agar kata seperti 'dan' tidak mendominasi gradien.")
'''

subchapters.append({
    "id": "nlp-5-7-glove-global-vectors-formulation",
    "chapterId": "natural-language-processing-ch-5",
    "title": "GloVe: Global Vectors for Word Representation (Pennington et al., 2014)",
    "description": "Sintesis matriks faktorisasi global dan jendela konteks lokal: rasio probabilitas ko-okurensi, formulasi objektif kuadrat terbobot, fungsi saturasi f(X), dan perbandingan performa.",
    "estimatedMinutes": 40,
    "order": 7,
    "content": {
        "theory": (
            "Pada tahun 2014, tim peneliti Universitas Stanford yang dipimpin oleh **Jeffrey Pennington, Richard Socher, dan Christopher D. Manning** mempublikasikan model **GloVe (*Global Vectors for Word Representation*)**. GloVe lahir dari wawasan teoretis tajam yang mengidentifikasi dua mazhab utama dalam representasi kata:\n\n"
            "1. **Metode Faktorisasi Matriks Global (seperti LSA / SVD)**: Efisien dalam memanfaatkan statistik korpus global, tetapi sangat buruk dalam menangkap struktur analogi geometris lokal.\n"
            "2. **Metode Jendela Lokal Berbasis Pembelajaran Dangkal (seperti Word2Vec)**: Sangat unggul dalam penalaran analogis, tetapi tidak efisien karena memindai jendela teks kata per kata tanpa memanfaatkan statistik frekuensi ko-okurensi global secara langsung.\n\n"
            "GloVe menyatukan keunggulan kedua mazhab tersebut dengan melatih representasi vektor langsung pada **Matriks Ko-okurensi Global** $\\mathbf{X}$.\n\n"
            "**Rasio Probabilitas Ko-okurensi sebagai Fondasi Makna**:\n"
            "Pennington dkk. membuktikan bahwa makna semantik kata tidak terletak pada probabilitas mentah $P(k \\mid w)$, melainkan pada **Rasio Probabilitas Ko-okurensi** $\\frac{P(k \\mid w_i)}{P(k \\mid w_j)}$.\n"
            "Sebagai contoh:\n"
            "- Misalkan $w_i = \\text{ice}$ (es) dan $w_j = \\text{steam}$ (uap air).\n"
            "- Jika kata konteks $k = \\text{solid}$ (padat): $\\frac{P(\\text{solid} \\mid \\text{ice})}{P(\\text{solid} \\mid \\text{steam})}$ bernilai sangat besar ($> 8$).\n"
            "- Jika kata konteks $k = \\text{gas}$: rasio bernilai sangat kecil ($< 0.08$).\n"
            "- Jika kata konteks $k = \\text{water}$ (air) atau $k = \\text{fashion}$ (tidak relevan): rasio mendekati $1.0$.\n\n"
            "**Fungsi Objektif Kuadrat Terbobot GloVe**:\n"
            "GloVe merumuskan fungsi objektif regresi kuadrat terkecil terbobot (*weighted least-squares objective*):\n"
            "$$J = \\sum_{i=1}^{|\\mathcal{V}|} \\sum_{j=1}^{|\\mathcal{V}|} f(X_{i, j}) \\left( \\mathbf{w}_i^T \\tilde{\\mathbf{w}}_j + b_i + \\tilde{b}_j - \\log X_{i, j} \\right)^2$$\n"
            "di mana fungsi pembobotan $f(X_{i, j})$ dirancang khusus untuk memotong dominasi frekuensi ekstrem:\n"
            "$$f(x) = \\begin{cases} \\left( \\frac{x}{x_{\\max}} \\right)^\\alpha & \\text{jika } x < x_{\\max} \\\\ 1 & \\text{lainnya} \\end{cases}$$\n"
            "dengan parameter standar $x_{\\max} = 100$ dan $\\alpha = 0.75$. Fungsi ini memastikan bahwa pasangan kata yang tidak pernah muncul ($X = 0$) tidak membebani komputasi ($f(0) = 0$), sementara pasangan kata yang sangat sering muncul tidak mendominasi pembaruan gradien."
        ),
        "codeSnippet": code_5_7,
        "codeSnippetOutput": run_code_capture_output(code_5_7),
        "realWorldApplication": (
            "Vektor pra-terlatih standar (GloVe 6B, GloVe 840B) yang digunakan selama bertahun-tahun pada model klasifikasi teks, Named Entity Recognition (NER), dan Question Answering berbasis BiLSTM."
        ),
        "commonPitfalls": [
            r"Lupa menjumlahkan vektor w_i dan vektor konteks w~_j pada representasi akhir (karena matriks ko-okurensi simetris, menjumlahkan w + w~ secara konsisten meningkatkan performa model).",
            r"Mengabaikan fungsi pemotong plafon f(x) yang menyebabkan pasangan stopwords berfrekuensi ratusan ribu merusak konvergensi gradien.",
            r"Menyetel parameter alpha = 1.0 yang membuat pembobotan bersifat linear murni tanpa peredaman logaritmik."
        ],
        "caseStudy": (
            "Bandingkan alur komputasi pelatihan Word2Vec Skip-gram versus Stanford GloVe pada korpus 5 miliar kata. Jelaskan mengapa pelatihan GloVe dapat diselesaikan jauh lebih cepat setelah matriks ko-okurensi global selesai dikonstruksi dalam satu kali lintasan awal."
        ),
        "academicReferences": [
            r"Pennington, J., Socher, R., & Manning, C. D. (2014). GloVe: Global vectors for word representation. In Proceedings of the 2014 conference on empirical methods in natural language processing (EMNLP) (pp. 1532-1543).",
            r"Levy, O., & Goldberg, Y. (2014). Neural word embedding as implicit matrix factorization. Advances in Neural Information Processing Systems (NeurIPS), 27, 2177-2185.",
            r"Arora, S., Li, Y., Liang, Y., Ma, T., & Risteski, A. (2016). A latent variable model approach to PMI-based word embeddings. Transactions of the Association for Computational Linguistics, 4, 385-399."
        ]
    }
})

# ==============================================================================
# Subbab 5.8: FastText (Subword Character N-grams)
# ==============================================================================
code_5_8 = r'''import numpy as np

# FastText (Bojanowski et al., TACL 2017)
# Representasi Kata Berbasis Subkata Karakter N-Gram
# Kata "makanan" dengan batas < dan >, n-gram rentang 3 hingga 5:
# <makanan> -> n=3: <ma, mak, aka, kan, ana, nan, an>
# Vektor kata adalah jumlah vektor subkata n-gram: v_word = sum_{g \in G_w} z_g

word = "makanan"
word_padded = f"<{word}>"
n_min, n_max = 3, 5

subwords = []
for n in range(n_min, n_max + 1):
    for i in range(len(word_padded) - n + 1):
        subwords.append(word_padded[i:i+n])

# Tambahkan representasi kata utuh
subwords.append(word_padded)

print("Dekomposisi Subkata Karakter N-Gram FastText (Bojanowski et al., 2017):")
print("-" * 75)
print(f"Kata Asli: '{word}' -> Padded: '{word_padded}'\n")
print(f"Total Subkata N-Gram ({len(subwords)} pecahan subkata):")
print(f"  - 3-grams: {[s for s in subwords if len(s) == 3]}")
print(f"  - 4-grams: {[s for s in subwords if len(s) == 4]}")
print(f"  - 5-grams: {[s for s in subwords if len(s) == 5]}")
print("-" * 75)

# Penanganan Kata Tak Dikenal (Out-Of-Vocabulary / OOV)
oov_word = "termakanan"  # Misal tidak ada di kamus kata latih
oov_padded = f"<{oov_word}>"
oov_3grams = [oov_padded[i:i+3] for i in range(len(oov_padded) - 2)]
shared_subwords = set(subwords).intersection(set(oov_3grams))

print(f"Kata Baru (OOV): '{oov_word}'")
print(f"Subkata yang terbagi dengan '{word}': {shared_subwords}")
print("FastText mampu menghasilkan vektor berkualitas untuk kata OOV yang belum pernah")
print("dilihat sebelumnya melalui agregasi vektor subkata n-gram yang dimilikinya!")
'''

subchapters.append({
    "id": "nlp-5-8-fasttext-subword-character-ngrams",
    "chapterId": "natural-language-processing-ch-5",
    "title": "FastText (Bojanowski et al., 2017): Representasi Subkata Karakter N-gram untuk Bahasa Morfologis Kaya",
    "description": "Inovasi representasi leksikal Piotr Bojanowski dkk.: pengayaan arsitektur Skip-gram dengan karakter n-gram, penanganan kata OOV secara intrinsik, dan keunggulan morfologis.",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "Meskipun Word2Vec dan GloVe merevolusi representasi kata, keduanya memiliki satu kelemahan arsitektural mendasar yang sangat merugikan bahasa-bahasa berafiksasi kaya (seperti bahasa Indonesia, Turki, Jerman, Finlandia, dan Arab): **asumsi unit kata atomik**.\n\n"
            "Dalam Word2Vec dan GloVe, setiap kata diperlakukan sebagai entitas simbolik yang sepenuhnya terisolasi dan mandiri. Kata *\"makan\"*, *\"makanan\"*, *\"memakan\"*, *\"termakan\"*, dan *\"pemakan\"* masing-masing memiliki vektor representasi yang independen dan tidak saling berbagi parameter morfologi sama sekali. Terlebih lagi, jika kata *\"termakanlah\"* tidak pernah muncul dalam data latih, model menetapkannya sebagai **Out-of-Vocabulary (OOV)** tanpa vektor representasi apa pun.\n\n"
            "Untuk mengatasi batasan ini, tim peneliti Facebook AI Research (FAIR) yang dipimpin oleh **Piotr Bojanowski, Edouard Grave, Armand Joulin, dan Tomas Mikolov** (2017) mempublikasikan model **FastText** (*Enriching Word Vectors with Subword Information*).\n\n"
            "**Dekomposisi Subkata Karakter N-Gram**:\n"
            "Alih-alih mempelajari vektor untuk kata secara atomik, FastText merepresentasikan setiap kata sebagai **himpunan subkata n-gram karakter (*bag of character n-grams*)**.\n"
            "Sebagai contoh, untuk kata *\"di mana\"* dengan simbol pembatas `<` dan `>`, karakter n-gram dengan panjang $3 \\le n \\le 6$ diekstrak:\n"
            "$$\\text{\"<dimana>\"} \\implies \\{\\text{\"<di\"}, \\text{\"dim\"}, \\text{\"ima\"}, \\text{\"man\"}, \\text{\"ana\"}, \\text{\"na>\"}, \\dots, \\text{\"<dimana>\"}\\}$$\n\n"
            "Vektor representasi akhir dari sebuah kata $w$ dihitung secara elegan sebagai penjumlahan vektor dari seluruh subkata n-gram pembentuknya:\n"
            "$$\\mathbf{v}_w = \\sum_{g \\in \\mathcal{G}_w} \\mathbf{z}_g$$\n"
            "di mana $\\mathcal{G}_w$ adalah himpunan seluruh subkata n-gram karakter dari kata $w$, dan $\\mathbf{z}_g$ adalah vektor embedding dari subkata $g$.\n\n"
            "**Dua Keunggulan Revolusioner FastText**:\n"
            "1. **Penanganan OOV Sempurna**: Jika sebuah kata baru tidak pernah muncul dalam pelatihan, FastText tetap dapat menghasilkan representasi vektor semantik yang sangat akurat dengan menjumlahkan vektor subkata pembentuknya yang sudah dikenal.\n"
            "2. **Menangkap Morfologi Kaya**: Prefiks (*me-*, *di-*, *pe-*) dan sufiks (*-kan*, *-an*, *-nya*) secara alami memiliki representasi vektor subkata tersendiri yang memperkuat hubungan morfosintaksis antar varian kata."
        ),
        "codeSnippet": code_5_8,
        "codeSnippetOutput": run_code_capture_output(code_5_8),
        "realWorldApplication": (
            "Klasifikasi teks multispesialisasi produksi Facebook/Meta, pemrosesan korpus media sosial dengan banyak salah ketik/slang/singkatan, dan pipeline NLP untuk bahasa morfologis non-Inggris."
        ),
        "commonPitfalls": [
            r"Ukuran model FastText biner (.bin) yang sangat besar (bisa mencapai puluhan gigabyte) karena jutaan hash bucket subkata; wajib menerapkan kuantisasi model atau pemangkasan kamus.",
            r"Memilih rentang n-gram karakter yang terlalu pendek (misal n=1 atau n=2) yang memasukkan derau karakter acak tanpa arti morfologis.",
            r"Lupa menambahkan simbol pembatas batas kata '<' dan '>' yang membedakan morfem awalan/akhiran dengan bagian tengah kata."
        ],
        "caseStudy": (
            "Dalam korpus media sosial Twitter Indonesia, pengguna sering menulis kata dengan variasi typo: 'bangeeet', 'bgt', 'bangeet'. Bandingkan bagaimana Word2Vec standar vs FastText menangani variasi penulisan ini dan jelaskan mengapa FastText mampu memetakan seluruh varian tersebut ke vektor yang hampir identik."
        ),
        "academicReferences": [
            r"Bojanowski, P., Grave, E., Joulin, A., & Mikolov, T. (2017). Enriching word vectors with subword information. Transactions of the Association for Computational Linguistics, 5, 135-146.",
            r"Joulin, A., Grave, E., Bojanowski, P., & Mikolov, T. (2017). Bag of tricks for efficient text classification. In EACL (pp. 427-431).",
            r"Grave, E., Bojanowski, P., Gupta, P., Joulin, A., & Mikolov, T. (2018). Learning word vectors for 157 languages. In LREC 2018."
        ]
    }
})

# ==============================================================================
# Subbab 5.9: Evaluasi Intrinsik Word Embeddings
# ==============================================================================
code_5_9 = r'''import numpy as np

# Evaluasi Intrinsik Word Embeddings: Uji Kemiripan Kata (WordSim-353) & Korelasi Spearman
# Mengukur korelasi peringkat kemiripan kosinus model vs penilaian psikolinguistik manusia

# Dataset simulasi: Pasangan kata dan skor kesamaan penilaian manusia (rentang 0 - 10)
benchmark_data = [
    ("uang", "bank", 8.9),
    ("komputer", "perangkat_keras", 8.4),
    ("dokter", "perawat", 7.5),
    ("mobil", "apel", 1.2),
    ("kucing", "batu", 0.5)
]

# Simulasi cosine similarity dari model embedding terlatih
model_similarities = [0.88, 0.81, 0.73, 0.15, 0.04]
human_scores = [item[2] for item in benchmark_data]

def spearman_rank_correlation(x, y):
    # Hitung peringkat
    rank_x = np.argsort(np.argsort(-np.array(x)))
    rank_y = np.argsort(np.argsort(-np.array(y)))
    d = rank_x - rank_y
    n = len(x)
    rho = 1.0 - (6.0 * np.sum(d ** 2)) / (n * (n ** 2 - 1))
    return rho

rho = spearman_rank_correlation(human_scores, model_similarities)

print("Evaluasi Intrinsik Word Embedding (Benchmark WordSim-353):")
print("-" * 75)
print(f"{'Pasangan Kata':<25} | {'Skor Manusia (0-10)':<20} | {'Cosine Sim Model':<18}")
print("-" * 75)
for i, (w1, w2, h_score) in enumerate(benchmark_data):
    pair_str = f"({w1}, {w2})"
    print(f"{pair_str:<25} | {h_score:<20.1f} | {model_similarities[i]:<18.4f}")

print("-" * 75)
print(f"Koefisien Korelasi Peringkat Spearman (Spearman rho): {rho:.4f}")
print("Evaluasi intrinsik menilai kesesuaian ruang geometris model dengan persepsi semantik manusia.")
'''

subchapters.append({
    "id": "nlp-5-9-intrinsic-evaluation-word-embeddings",
    "chapterId": "natural-language-processing-ch-5",
    "title": "Evaluasi Intrinsik Word Embeddings: Uji Kemiripan Kata dan Uji Analogi",
    "description": "Metodologi evaluasi representasi leksikal: benchmark kemiripan kata WordSim-353 dan SimLex-999, korelasi Spearman rho, dataset analogi Google, dan perdebatan intrinsik vs ekstrinsik.",
    "estimatedMinutes": 35,
    "order": 9,
    "content": {
        "theory": (
            "Setelah vektor embedding kata selesai dilatih, bagaimana cara kita memverifikasi bahwa ruang representasi yang terbentuk benar-benar merefleksikan hubungan semantik yang akurat? Dalam literatur NLP, evaluasi model embedding terbagi menjadi dua paradigma utama:\n\n"
            "**1. Evaluasi Intrinsik (*Intrinsic Evaluation*)**:\n"
            "Menguji kualitas matematis ruang vektor secara langsung pada tugas-tugas linguistik terisolasi tanpa memerlukan model klasifikasi eksternal:\n"
            "- **Uji Kemiripan Kata (*Word Similarity Benchmarks*)**:\n"
            "  Dataset standar industri seperti **WordSim-353** (Finkelstein et al., 2002), **SimLex-999** (Hill et al., 2015), dan **MEN** memuat ratusan pasangan kata yang dinilai tingkat kemiripannya oleh sekelompok panelis manusia pada skala numerik (misal $0 - 10$).\n"
            "  Evaluasi dilakukan dengan menghitung **Koefisien Korelasi Peringkat Spearman ($\\rho$)** antara jarak kosinus model dan skor penilaian manusia:\n"
            "  $$\\rho = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)}$$\n"
            "  di mana $d_i$ adalah selisih peringkat pada pasangan ke-$i$.\n"
            "- **Perbedaan Kritis Antara Kemiripan (*Similarity*) vs Keterkaitan (*Relatedness*)**:\n"
            "  SimLex-999 menekankan perbedaan fundamental ini: *cangkir* dan *kopi* memiliki keterkaitan asosiatif tinggi (*highly related*), tetapi secara semantik keduanya bukan hal yang serupa (*not similar*). Sebaliknya, *cangkir* dan *mug* adalah sinonim yang serupa (*similar*).\n"
            "- **Uji Analogi (*Word Analogy Benchmark*)**:\n"
            "  **Google Analogy Dataset** (Mikolov et al., 2013) memuat $19.544$ kueri analogi sintaktis (kata kerja, komparatif) dan semantik (ibukota-negara, mata uang) untuk menguji akurasi aljabar $a : b :: c : ?$.\n\n"
            "**2. Evaluasi Ekstrinsik (*Extrinsic Evaluation*)**:\n"
            "Menerapkan vektor embedding ke dalam tugas akhir nyata (*downstream tasks*), seperti akurasi klasifikasi sentimen ulasan, F1-score Named Entity Recognition (NER), atau BLEU score translasi mesin. Meskipun evaluasi intrinsik cepat dan mudah dihitung, para peneliti sepakat bahwa skor intrinsik yang tinggi tidak selalu menjamin performa terbaik pada aplikasi ekstrinsik nyata."
        ),
        "codeSnippet": code_5_9,
        "codeSnippetOutput": run_code_capture_output(code_5_9),
        "realWorldApplication": (
            "Validasi kualitas checkpoint model embedding sebelum dirilis ke produksi, pemilihan hyperparameter dimensi laten, dan benchmarking embedding multibahasa."
        ),
        "commonPitfalls": [
            r"Mengandalkan metrik korelasi Pearson alih-alih korelasi non-parametrik Spearman (skor manusia sering tidak terdistribusi normal).",
            r"Menyimpulkan model terbaik semata-mata dari WordSim-353 (karena WordSim mencampuradukkan kemiripan sejati dengan asosiasi topikal).",
            r"Mengabaikan kata-kata uji benchmark yang tidak ada di dalam kosakata model (OOV) tanpa prosedur penanganan penalti yang transparan."
        ],
        "caseStudy": (
            "Dua model embedding A dan B dievaluasi: Model A meraih skor Spearman rho 0.78 pada WordSim-353, tetapi hanya meraih akurasi F1 82% pada downstream sentiment analysis. Model B meraih rho 0.65 pada WordSim, tetapi meraih F1 89% pada sentiment analysis. Jelaskan mengapa diskrepansi antara evaluasi intrinsik dan ekstrinsik ini dapat terjadi."
        ),
        "academicReferences": [
            r"Finkelstein, L., et al. (2002). Placing search in context: The concept based information retrieval. ACM Transactions on Information Systems, 20(1), 116-132.",
            r"Hill, F., Reichart, R., & Korhonen, A. (2015). Simlex-999: Evaluating semantic models with (genuine) similarity estimation. Computational Linguistics, 41(4), 665-695.",
            r"Schnabel, T., Labutov, I., Mimno, D., & Joachims, T. (2015). Evaluation methods for unsupervised word embeddings. In EMNLP (pp. 298-307)."
        ]
    }
})

# ==============================================================================
# Subbab 5.10: Implementasi Skip-gram SGNS NumPy
# ==============================================================================
code_5_10 = r'''import numpy as np

# Implementasi Forward Pass dan Pembaruan Gradien Model Skip-gram SGNS Sederhana Berbasis NumPy
class ToyWord2VecSGNS:
    def __init__(self, vocab_size, embedding_dim=10, learning_rate=0.025):
        self.V = vocab_size
        self.d = embedding_dim
        self.lr = learning_rate
        # Inisialisasi bobot matriks Input (W_in) dan Output (W_out)
        np.random.seed(42)
        self.W_in = np.random.uniform(-0.5/self.d, 0.5/self.d, (self.V, self.d))
        self.W_out = np.zeros((self.V, self.d))
        
    def sigmoid(self, x):
        return 1.0 / (1.0 + np.exp(-np.clip(x, -10, 10)))
        
    def train_step(self, target_idx, pos_context_idx, neg_indices):
        # 1. Forward Pass
        v_target = self.W_in[target_idx]                 # (d,)
        v_pos = self.W_out[pos_context_idx]              # (d,)
        v_negs = self.W_out[neg_indices]                 # (k, d)
        
        # Prediksi probabilitas pasangan positif: sigma(v_pos^T v_target)
        p_pos = self.sigmoid(np.dot(v_pos, v_target))
        # Prediksi probabilitas pasangan negatif: sigma(v_neg^T v_target)
        p_negs = self.sigmoid(np.dot(v_negs, v_target))
        
        # Loss SGNS: -log(p_pos) - sum(log(1 - p_negs))
        loss = -np.log(p_pos + 1e-12) - np.sum(np.log(1.0 - p_negs + 1e-12))
        
        # 2. Backward Pass (Perhitungan Gradien)
        # Turunan terhadap dot product: grad_pos = p_pos - 1, grad_neg = p_negs
        g_pos = p_pos - 1.0                              # scalar
        g_negs = p_negs                                  # (k,)
        
        # Gradien untuk vektor target: g_pos * v_pos + sum(g_neg * v_neg)
        grad_target = g_pos * v_pos + np.dot(g_negs, v_negs)
        
        # 3. Update Bobot (SGD)
        self.W_out[pos_context_idx] -= self.lr * (g_pos * v_target)
        for i, neg_idx in enumerate(neg_indices):
            self.W_out[neg_idx] -= self.lr * (g_negs[i] * v_target)
        self.W_in[target_idx] -= self.lr * grad_target
        
        return loss

# Inisialisasi dan uji coba 5 langkah pembaruan SGD
model = ToyWord2VecSGNS(vocab_size=8, embedding_dim=4, learning_rate=0.1)

# Pasangan positif: target=2 ("bahasa"), context=3 ("alami")
# Pasangan negatif acak (k=3): [0, 5, 7]
target_idx = 2
pos_idx = 3
neg_indices = [0, 5, 7]

print("Pelatihan Forward & Backward Pass Skip-gram SGNS Berbasis NumPy:")
print("-" * 75)
for step in range(1, 6):
    loss = model.train_step(target_idx, pos_idx, neg_indices)
    v_target = model.W_in[target_idx]
    v_pos = model.W_out[pos_idx]
    dot_prod = np.dot(v_target, v_pos)
    print(f"Langkah {step}: Loss SGNS = {loss:.4f} | Dot Product Positif = {dot_prod:.4f}")

print("-" * 75)
print("Konvergensi Gradien: Loss menurun konsisten dan dot product pasangan positif meningkat!")
'''

subchapters.append({
    "id": "nlp-5-10-skipgram-sgns-numpy-implementation",
    "chapterId": "natural-language-processing-ch-5",
    "title": "Implementasi Forward Pass dan Pembaruan Gradien Model Skip-gram SGNS Berbasis NumPy",
    "description": "Konstruksi menyeluruh class ToyWord2VecSGNS dari nol: inisialisasi bobot matriks W_in dan W_out, komputasi loss klasifikasi biner, derivasi gradien analitik, dan optimasi SGD.",
    "estimatedMinutes": 45,
    "order": 10,
    "content": {
        "theory": (
            "Sebagai puncak dari Bab 5 dan penutup seluruh rangkaian modul Chunk 1 NLP, kita mewujudkan seluruh formulasi matematis Skip-gram Negative Sampling (Mikolov et al., NeurIPS 2013) ke dalam sebuah class implementasi mandiri `ToyWord2VecSGNS` yang dibangun murni dari nol menggunakan aljabar matriks NumPy tanpa memanfaatkan framework deep learning eksternal.\n\n"
            "Arsitektur engine ini mendemonstrasikan secara transparan bagaimana vektor representasi kata benar-benar dipelajari melalui optimasi gradien numerik:\n\n"
            "**1. Struktur Matriks Parameter Ganda**:\n"
            "- $\\mathbf{W}_{\\text{in}} \\in \\mathbb{R}^{|\\mathcal{V}| \\times d}$: Matriks representasi kata masukan (*input embedding*), di mana baris ke-$i$ merepresentasikan $\\mathbf{v}_{w_i}$ ketika kata bertindak sebagai kata target pusat.\n"
            "- $\\mathbf{W}_{\\text{out}} \\in \\mathbb{R}^{|\\mathcal{V}| \\times d}$: Matriks representasi kata keluaran (*output embedding*), di mana baris ke-$j$ merepresentasikan $\\mathbf{v}'_{w_j}$ ketika kata bertindak sebagai kata konteks sasaran atau sampel negatif.\n\n"
            "**2. Derivasi Gradien Analitik (*Exact Analytical Gradients*)**:\n"
            "Diberikan fungsi loss Negative Sampling untuk satu pasangan positif $(w_I, w_O)$ dan $k$ sampel negatif $\\{w_1, \\dots, w_k\\}$:\n"
            "$$\\mathcal{L} = -\\log \\sigma({\\mathbf{v}'_{w_O}}^T \\mathbf{v}_{w_I}) - \\sum_{i=1}^k \\log \\sigma(-{\\mathbf{v}'_{w_i}}^T \\mathbf{v}_{w_I})$$\n"
            "Dengan memanfaatkan turunan analitik fungsi sigmoid $\\frac{d}{dx} \\sigma(x) = \\sigma(x)(1 - \\sigma(x))$, turunan parsial terhadap setiap vektor parameter diperoleh secara tertutup:\n"
            "- Terhadap vektor konteks positif $\\mathbf{v}'_{w_O}$:\n"
            "  $$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{v}'_{w_O}} = (\\sigma({\\mathbf{v}'_{w_O}}^T \\mathbf{v}_{w_I}) - 1) \\cdot \\mathbf{v}_{w_I}$$\n"
            "- Terhadap vektor konteks negatif $\\mathbf{v}'_{w_i}$:\n"
            "  $$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{v}'_{w_i}} = \\sigma({\\mathbf{v}'_{w_i}}^T \\mathbf{v}_{w_I}) \\cdot \\mathbf{v}_{w_I}$$\n"
            "- Terhadap vektor kata target $\\mathbf{v}_{w_I}$:\n"
            "  $$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{v}_{w_I}} = (\\sigma({\\mathbf{v}'_{w_O}}^T \\mathbf{v}_{w_I}) - 1) \\cdot \\mathbf{v}'_{w_O} + \\sum_{i=1}^k \\sigma({\\mathbf{v}'_{w_i}}^T \\mathbf{v}_{w_I}) \\cdot \\mathbf{v}'_{w_i}$$\n\n"
            "Pembaruan Stochastic Gradient Descent (SGD) pada setiap langkah mendorong vektor target dan konteks positif untuk saling mendekat (meningkatkan *dot product*), sekaligus mendorong vektor target menjauhi seluruh sampel negatif di sekitarnya."
        ),
        "codeSnippet": code_5_10,
        "codeSnippetOutput": run_code_capture_output(code_5_10),
        "realWorldApplication": (
            "Fondasi esensial untuk memahami pelatihan representasi kontras (*contrastive learning* seperti SimCLR, CLIP), embedding rekomendasi produk e-commerce, dan optimasi arsitektur neural network."
        ),
        "commonPitfalls": [
            r"Lupa memperbarui matriks W_in setelah matriks W_out diperbarui (wajib menggunakan gradien target yang dihitung dari bobot sebelum diperbarui).",
            r"Menginisialisasi W_in dan W_out keduanya dengan angka nol (inisialisasi simetris nol merusak diferensiasi representasi; W_in wajib diinisialisasi acak seragam).",
            r"Tidak melakukan clipping nilai dot product pada fungsi sigmoid yang menimbulkan floating-point overflow RuntimeWarning."
        ],
        "caseStudy": (
            "Lakukan iterasi 100 langkah pada implementasi ToyWord2VecSGNS di atas dengan dua pasang kata konteks positif yang berbeda. Plot pergerakan trajektori vektor W_in dalam ruang 2 dimensi menggunakan matplotlib dan amati bagaimana vektor kata target bermigrasi menuju rata-rata posisi kedua kata konteks positifnya."
        ),
        "academicReferences": [
            r"Mikolov, T., Sutskever, I., Chen, K., Corrado, G. S., & Dean, J. (2013). Distributed representations of words and phrases and their compositionality. NeurIPS 2013.",
            r"Goldberg, Y., & Levy, O. (2014). word2vec Explained: deriving Mikolov et al.'s negative-sampling word-embedding method. arXiv preprint arXiv:1402.3722.",
            r"Rong, X. (2014). word2vec parameter learning explained. arXiv preprint arXiv:1411.2738."
        ]
    }
})

output_path = os.path.join(os.path.dirname(__file__), "nlp_ch5_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 5 NLP -> {output_path}")
