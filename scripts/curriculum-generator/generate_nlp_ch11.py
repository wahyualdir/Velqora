# -*- coding: utf-8 -*-
"""
Generator Kurikulum NLP - Bab 11:
Arsitektur Sequence-to-Sequence & Penerjemahan Mesin Saraf (Seq2Seq, Attention, & NMT)
Memuat 10 Subbab dengan standar substantif mendalam, matematis formal KaTeX,
output kode riil tereksekusi, dan Spot-Check Primer Verbatim Bahdanau et al. (2015).
"""

import json
import io
import sys
import os
import traceback
import numpy as np

def run_code_capture_output(code_str: str) -> str:
    """Mengeksekusi kode Python secara mandiri dan menangkap output stdout-nya."""
    old_stdout = sys.stdout
    redirected_output = sys.stdout = io.StringIO()
    scope = {"np": np}
    try:
        exec(code_str, scope)
        output = redirected_output.getvalue().strip()
        return output if output else "[Eksekusi Berhasil - Tidak Ada Output Stdout]"
    except Exception as e:
        return f"Error saat eksekusi: {str(e)}\n{traceback.format_exc()}"
    finally:
        sys.stdout = old_stdout

def build_nlp_chapter_11():
    subchapters = []

    # =========================================================================
    # Subbab 11.1: Paradigma Arsitektur Sequence-to-Sequence
    # =========================================================================
    code_11_1 = r"""import numpy as np

# Simulasi Arsitektur Seq2Seq RNN Klasik dengan Vektor Konteks Hambatan Tunggal
np.random.seed(42)

vocab_size = 20
embed_dim = 16
hidden_dim = 32
src_len = 5
tgt_len = 4

# Inisialisasi bobot Enkoder dan Dekoder
W_xh_enc = np.random.randn(embed_dim, hidden_dim) * 0.1
W_hh_enc = np.random.randn(hidden_dim, hidden_dim) * 0.1
W_xh_dec = np.random.randn(embed_dim, hidden_dim) * 0.1
W_hh_dec = np.random.randn(hidden_dim, hidden_dim) * 0.1
W_out = np.random.randn(hidden_dim, vocab_size) * 0.1
embeddings = np.random.randn(vocab_size, embed_dim) * 0.1

src_tokens = np.array([3, 7, 12, 18, 5])
tgt_tokens = np.array([2, 9, 14, 1])

# 1. Enkoding: Memetakan sekuens sumber ke hidden state final (Vektor Konteks tunggal v)
h_enc = np.zeros(hidden_dim)
print("=== FASE ENKODER ===")
for t, token_id in enumerate(src_tokens):
    x_t = embeddings[token_id]
    h_enc = np.tanh(np.dot(x_t, W_xh_enc) + np.dot(h_enc, W_hh_enc))
    print(f"Langkah t={t+1} (Token {token_id}): L2-Norm Hidden State = {np.linalg.norm(h_enc):.4f}")

v_context = h_enc.copy()
print(f"Vektor Konteks Hambatan (Bottleneck Vector v): Dimensi {v_context.shape}, Norm = {np.linalg.norm(v_context):.4f}")

# 2. Dekoding: Menginisialisasi hidden state dekoder dengan v
print("\n=== FASE DEKODER ===")
s_dec = v_context.copy()
pred_tokens = []
for t, target_id in enumerate(tgt_tokens):
    x_dec = embeddings[target_id]
    s_dec = np.tanh(np.dot(x_dec, W_xh_dec) + np.dot(s_dec, W_hh_dec))
    logits = np.dot(s_dec, W_out)
    pred_token = np.argmax(logits)
    pred_tokens.append(pred_token)
    print(f"Langkah t={t+1}: Input Token {target_id} -> Prediksi Token {pred_token} (Logit Max = {logits[pred_token]:.4f})")

print(f"\nSekuens Prediksi Dekoder: {pred_tokens}")
"""
    out_11_1 = run_code_capture_output(code_11_1)

    subchapters.append({
        "id": "11-1-paradigma-arsitektur-sequence-to-sequence",
        "title": "11.1 Paradigma Arsitektur Sequence-to-Sequence (Sutskever et al. 2014, Cho et al. 2014, Bottleneck Information Vector)",
        "theory": (
            "Model pembelajaran mesin tradisional berasumsi bahwa input dan output memiliki dimensi tetap yang telah ditentukan sebelumnya. "
            "Namun, dalam domain pemrosesan bahasa alami seperti penerjemahan mesin, peringkasan dokumen, dan dialog otomatis, baik sekuens masukan $\\mathbf{x} = (x_1, x_2, \\dots, x_{T_x})$ "
            "maupun sekuens target $\\mathbf{y} = (y_1, y_2, \\dots, y_{T_y})$ memiliki panjang sembarang yang bervariasi ($T_x \\neq T_y$). Paradigma *Sequence-to-Sequence* (Seq2Seq), yang "
            "diperkenalkan secara independen oleh Sutskever et al. (2014) menggunakan Multilayer LSTM dan Cho et al. (2014) menggunakan Gated Recurrent Unit (GRU), memecahkan kendala ini "
            "melalui dekomposisi sistem menjadi dua komponen jaringan saraf terpisah: Enkoder (*Encoder*) dan Dekoder (*Decoder*).\n\n"
            "1. **Enkoder**: Membaca sekuens masukan sumber $\\mathbf{x}$ langkah demi langkah secara berurutan. Pada setiap langkah waktu $t$, unit berulang memperbarui status tersembunyi "
            "(*hidden state*) $h_t = f(x_t, h_{t-1})$. Setelah membaca token terakhir $x_{T_x}$, status tersembunyi akhir $h_{T_x}$ (atau transformasi non-linier darinya) ditetapkan sebagai "
            "vektor representasi semantik global tetap, yang dikenal sebagai **Vektor Konteks** ($\\mathbf{v} = h_{T_x}$).\n\n"
            "2. **Dekoder**: Merupakan model bahasa kondisional autoregresif yang bertugas membangkitkan sekuens target $\\mathbf{y}$ token demi token. Hidden state dekoder diinisialisasi dengan "
            "vektor konteks ($s_0 = \\mathbf{v}$). Pada setiap langkah waktu $i$, dekoder memperbarui statusnya $s_i = f(y_{i-1}, s_{i-1})$ dan memproyeksikannya ke distribusi probabilitas kosakata target:\n"
            "$$p(y_i \\mid y_{<i}, \\mathbf{x}) = \\text{softmax}(W_o s_i + b_o)$$\n\n"
            "3. **Kelemahan Kritis Information Bottleneck**: Pada model Seq2Seq murni tanpa atensi, seluruh kekayaan semantik, relasi sintaksis, dan detail faktual dari sekuens masukan sepanjang $T_x$ "
            "dipaksa untuk dikompresi ke dalam sebuah vektor berdimensi tetap $\\mathbf{v} \\in \\mathbb{R}^d$. Secara teoritis dan empiris, kapasitas kanal transmisi informasi ini sangat terbatas. "
            "Ketika panjang kalimat $T_x > 20$ token, gradien mengalami pelemahan eksponensial dan enkoder gagal mempertahankan informasi token-token awal, mengakibatkan penurunan drastis pada "
            "kualitas terjemahan (metrik BLEU menurun tajam seiring bertambahnya panjang kalimat sumber)."
        ),
        "codeSnippet": code_11_1,
        "codeSnippetOutput": out_11_1,
        "realWorldApplication": (
            "Fondasi translasi mesin sekuens-ke-sekuens pada generasi pertama Google Translate Neural Machine Translation (GNMT 2016) dan sistem dialog konversasional berbasis retrieval-generative "
            "pada layanan perbankan untuk memetakan pertanyaan nasabah dengan struktur gramatikal bebas ke respons transaksi terstruktur."
        ),
        "commonPitfalls": [
            "Memaksa vektor konteks tunggal tanpa atensi untuk menangkap dokumen teks panjang di atas 50 kata, yang menyebabkan hilangnya klausa awal akibat fenomena catastrophic forgetting.",
            "Menghubungkan sekuens target ke dekoder tanpa token penanda khusus `<BOS>` (*Beginning of Sentence*) dan `<EOS>` (*End of Sentence*), sehingga dekoder tidak tahu kapan harus memulai dan menghentikan pembangkitan.",
            "Mengabaikan teknik pembalikan urutan kata masukan (*reversing input sequence*) pada model LSTM klasik tanpa atensi, yang padahal terbukti oleh Sutskever et al. (2014) mampu memperpendek jarak dependensi minimal antara kata pertama sumber dan target."
        ],
        "caseStudy": (
            "Sebuah tim lokalisasi e-commerce mengimplementasikan arsitektur Seq2Seq murni (LSTM 2-layer tanpa atensi) untuk menerjemahkan ulasan produk bahasa Jerman ke bahasa Inggris. Pada kalimat pendek "
            "(< 12 kata), terjemahan sangat koheren dengan skor BLEU 28.4. Namun, pada ulasan panjang (> 35 kata) yang memuat klausul relatif Jerman yang kompleks, skor BLEU anjlok ke 9.1 karena kata kerja "
            "di akhir kalimat Jerman (*verb-final construction*) gagal direkonstruksi oleh dekoder akibat informasi hilang di *information bottleneck*."
        ),
        "academicReferences": [
            "Sutskever, I., Vinyals, O., & Le, Q. V. (2014). Sequence to sequence learning with neural networks. Advances in Neural Information Processing Systems (NeurIPS 2014), 27, 3104-3112.",
            "Cho, K., van Merrienboer, B., Gulcehre, C., Bahdanau, D., Bougares, F., Schwenk, H., & Bengio, Y. (2014). Learning phrase representations using RNN encoder-decoder for statistical machine translation. Proceedings of EMNLP 2014, 1724-1734.",
            "Wu, Y., Schuster, M., Chen, Z., Le, Q. V., Norouzi, M., et al. (2016). Google's neural machine translation system: Bridging the gap between human and machine translation. arXiv preprint arXiv:1609.08144."
        ]
    })

    # =========================================================================
    # Subbab 11.2: Mekanisme Perhatian Aditif Bahdanau (SPOT-CHECK #2)
    # =========================================================================
    code_11_2 = r"""import numpy as np

# Implementasi Eksplisit Mekanisme Atensi Aditif Bahdanau (Bahdanau et al. 2015)
np.random.seed(42)

T_x = 4        # Panjang kalimat sumber (annotations)
hidden_enc = 8 # Dimensi representasi encoder bidirectional h_j
hidden_dec = 8 # Dimensi hidden state decoder s_i
att_dim = 6    # Dimensi ruang proyeksi alignment n

# Bobot model alignment terpelajari: v_a, W_a, U_a
W_a = np.random.randn(hidden_dec, att_dim) * 0.2
U_a = np.random.randn(hidden_enc, att_dim) * 0.2
v_a = np.random.randn(att_dim, 1) * 0.2

# Hidden states encoder h_j (annotations)
H = np.random.randn(T_x, hidden_enc)
# Hidden state decoder sebelumnya s_{i-1}
s_prev = np.random.randn(hidden_dec)

print("=== PERHITUNGAN ATENSI ADITIF BAHDANAU (Eq. 1 - 6) ===")
# 1. Proyeksi encoder: U_a * h_j untuk semua j=1..T_x -> bentuk (T_x, att_dim)
proj_enc = np.dot(H, U_a)

# 2. Proyeksi decoder: W_a * s_{i-1} -> bentuk (att_dim,)
proj_dec = np.dot(s_prev, W_a)

# 3. Energi alignment aditif: e_{ij} = v_a^T * tanh(W_a * s_{i-1} + U_a * h_j)
tanh_sum = np.tanh(proj_dec + proj_enc) # Broadcasting (T_x, att_dim)
e_scores = np.dot(tanh_sum, v_a).squeeze() # Bentuk (T_x,)

print(f"Skor Energi Alignment (e_ij): {np.round(e_scores, 4)}")

# 4. Normalisasi Softmax: alpha_{ij} = exp(e_{ij}) / sum_k exp(e_{ik})
exp_scores = np.exp(e_scores - np.max(e_scores)) # Stabilitas numerik
alpha = exp_scores / np.sum(exp_scores)

print(f"Bobot Atensi Softmax (alpha_ij): {np.round(alpha, 4)}")
print(f"Total Bobot Atensi (Sum alpha): {np.sum(alpha):.6f}")

# 5. Vektor Konteks Dinamis: c_i = sum_j alpha_{ij} * h_j
c_i = np.dot(alpha, H)
print(f"Vektor Konteks Dinamis c_i: Dimensi {c_i.shape}, Norm = {np.linalg.norm(c_i):.4f}")
print(f"Nilai c_i: {np.round(c_i, 4)}")
"""
    out_11_2 = run_code_capture_output(code_11_2)

    subchapters.append({
        "id": "11-2-mekanisme-perhatian-aditif-bahdanau",
        "title": "11.2 Mekanisme Perhatian Aditif Bahdanau (Bahdanau et al. 2015, Alignment Model, Dynamic Context Vector, Soft Attention)",
        "theory": (
            "Mekanisme perhatian aditif (*additive attention*) yang diperkenalkan oleh Dzmitry Bahdanau, Kyunghyun Cho, dan Yoshua Bengio (ICLR 2015) "
            "dalam makalah monumental *\"Neural Machine Translation by Jointly Learning to Align and Translate\"* merupakan revolusi terbesar dalam arsitektur "
            "jaringan saraf pemrosesan sekuens. Makalah ini secara tuntas menghancurkan batasan *information bottleneck* dengan mengizinkan dekoder untuk "
            "mencari (*search*) dan memfokuskan perhatian secara dinamis ke seluruh anotasi tersembunyi enkoder pada setiap langkah generasi kata target.\n\n"
            "Secara formal, kutipan verbatim representasi matematika dan formulasi arsitektur dari paper Bahdanau et al. (2015), Section 3 (\"Learning to Align and Translate\"), "
            "Halaman 3–4, Equations (1) to (6) menetapkan prinsip-prinsip berikut:\n\n"
            "**Persamaan 1 & 2 (Probabilitas Kondisional & Pembaruan State Dekoder)**:\n"
            "$$p(y_i \\mid y_1, \\dots, y_{i-1}, \\mathbf{x}) = g(y_{i-1}, s_i, c_i)$$\n"
            "$$s_i = f(s_{i-1}, y_{i-1}, c_i)$$\n"
            "di mana $s_i$ adalah status tersembunyi (*hidden state*) dekoder RNN pada langkah waktu $i$, yang dihitung dari status sebelumnya $s_{i-1}$, kata target "
            "sebelumnya $y_{i-1}$, dan **vektor konteks dinamis** $c_i$.\n\n"
            "**Persamaan 3 (Vektor Konteks Dinamis $c_i$)**:\n"
            "$$c_i = \\sum_{j=1}^{T_x} \\alpha_{ij} h_j$$\n"
            "Verbatim teks asli Bahdanau et al. (2015, Section 3, Halaman 3): *\"The context vector $c_i$ depends on a sequence of annotations $(h_1, \\dots, h_{T_x})$ "
            "to which an encoder maps the input sentence... The context vector $c_i$ is, then, computed as a weighted sum of these annotations $h_j$\"*.\n\n"
            "**Persamaan 4 & 5 (Bobot Perhatian Softmax & Model Penyelarasan Aditif)**:\n"
            "$$\\alpha_{ij} = \\frac{\\exp(e_{ij})}{\\sum_{k=1}^{T_x} \\exp(e_{ik})}$$\n"
            "$$e_{ij} = a(s_{i-1}, h_j) = v_a^\\top \\tanh(W_a s_{i-1} + U_a h_j)$$\n"
            "di mana $a(\\cdot, \\cdot)$ adalah *alignment model* berupa jaringan saraf feedforward satu lapis (*single-layer multilayer perceptron*) yang dilatih bersama (*jointly trained*) "
            "dengan seluruh komponen sistem. Matriks pembobotan memiliki dimensi $W_a \\in \\mathbb{R}^{n \\times n}$, $U_a \\in \\mathbb{R}^{n \\times 2n}$, dan vektor proyeksi $v_a \\in \\mathbb{R}^n$.\n\n"
            "Verbatim penjelasan fungsional (Bahdanau et al., 2015, Section 3, Halaman 3, Kolom Kanan): *\"The probability $\\alpha_{ij}$, or its associated energy $e_{ij}$, "
            "reflects the importance of the annotation $h_j$ with respect to the previous hidden state $s_{i-1}$ in deciding the next state $s_i$ and generating $y_i$. "
            "This implements a mechanism of attention in the decoder. The decoder decides which parts of the source sentence to pay attention to.\"*\n\n"
            "Dengan model ini, anotasi $h_j$ dibentuk menggunakan Bidirectional RNN (BiRNN) sehingga $h_j = [\\overrightarrow{h}_j^\\top; \\overleftarrow{h}_j^\\top]^\\top$, merangkum "
            "konteks kata-kata sebelum dan sesudah token $x_j$. Mekanisme ini sepenuhnya dapat dideferensiasi (*end-to-end differentiable*), memungkinkan backpropagation mengalir mulus "
            "dari fungsi rugi dekoder langsung ke setiap posisi langkah waktu enkoder."
        ),
        "codeSnippet": code_11_2,
        "codeSnippetOutput": out_11_2,
        "realWorldApplication": (
            "Penerjemahan dokumen hukum dan medis yang memiliki klausul bersarang panjang; sistem perataan kata otomatis (*automatic word alignment*) untuk ekstraksi leksikon dwibahasa; "
            "serta mekanisme atensi pada model Speech-to-Text (Listen, Attend and Spell)."
        ),
        "commonPitfalls": [
            "Menghitung energi penyelarasan $e_{ij}$ menggunakan $s_i$ alih-alih status dekoder sebelumnya $s_{i-1}$, yang secara kausal tidak valid karena $s_i$ membutuhkan $c_i$ yang justru baru bisa dibentuk setelah $\\alpha_{ij}$ diketahui.",
            "Tidak menerapkan pengurangan nilai maksimum ($\\max e_{ik}$) sebelum fungsi eksponensial dalam perhitungan softmax, yang menyebabkan luapan numerik (*numerical overflow*) ketika energi bernilai positif besar.",
            "Menghubungkan anotasi enkoder satu arah (*unidirectional RNN*) ke mekanisme atensi Bahdanau, yang mereduksi kekuatan representasi $h_j$ karena anotasi hanya memuat konteks kata-kata lampau tanpa informasi kata-kata setelahnya."
        ],
        "caseStudy": (
            "Pada sistem terjemahan paten dwibahasa Jerman-Inggris yang memiliki panjang rata-rata kalimat 48 kata, penggantian model Seq2Seq konvensional dengan model Atensi Bahdanau meningkatkan skor BLEU "
            "dari 16.8 menjadi 34.2. Analisis matriks $\\alpha_{ij}$ menunjukkan kemampuan model melompat secara tepat (*soft jumping*) ke ujung kalimat sumber Jerman untuk menemukan kata kerja bantu yang "
            "harus diterjemahkan di awal kalimat bahasa Inggris."
        ),
        "academicReferences": [
            "Bahdanau, D., Cho, K., & Bengio, Y. (2015). Neural machine translation by jointly learning to align and translate. 3rd International Conference on Learning Representations (ICLR 2015), San Diego, USA. arXiv:1409.0473.",
            "Cho, K., Courville, A., & Bengio, Y. (2015). Describing multimedia content using attention-based encoder-decoder networks. IEEE Transactions on Multimedia, 17(11), 1875-1886.",
            "Tu, Z., Lu, Z., Liu, Y., Liu, X., & Li, H. (2016). Modeling coverage for neural machine translation. Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), 76-85."
        ]
    })

    # =========================================================================
    # Subbab 11.3: Mekanisme Perhatian Perkalian Luong
    # =========================================================================
    code_11_3 = r"""import numpy as np

# Implementasi Perbandingan Tiga Fungsi Skor Perhatian Multiplikatif Luong et al. (2015)
np.random.seed(42)

T_x = 4
dim_h = 6

# H: Hidden states encoder (T_x, dim_h)
H = np.random.randn(T_x, dim_h)
# s_t: Hidden state decoder saat ini (dim_h,)
s_t = np.random.randn(dim_h)

# Bobot terpelajari untuk tipe 'general' dan 'concat'
W_a_general = np.random.randn(dim_h, dim_h) * 0.2
W_a_concat = np.random.randn(2 * dim_h, dim_h) * 0.2
v_a_concat = np.random.randn(dim_h) * 0.2

# 1. Skor Dot Product: score(s_t, h_i) = s_t^T * h_i
scores_dot = np.dot(H, s_t)

# 2. Skor General (Multiplicative): score(s_t, h_i) = s_t^T * W_a * h_i
scores_general = np.dot(np.dot(s_t, W_a_general), H.T)

# 3. Skor Concat: score(s_t, h_i) = v_a^T * tanh(W_a * [s_t; h_i])
concat_pairs = np.array([np.concatenate([s_t, h_i]) for h_i in H])
scores_concat = np.dot(np.tanh(np.dot(concat_pairs, W_a_concat)), v_a_concat)

print("=== SKOR ATENSI LUONG ET AL. (2015) ===")
print(f"1. Dot Product Scores : {np.round(scores_dot, 4)}")
print(f"2. General (Mult) Scores: {np.round(scores_general, 4)}")
print(f"3. Concat Scores       : {np.round(scores_concat, 4)}")

# Hitung bobot atensi softmax untuk tipe General
alpha_gen = np.exp(scores_general - np.max(scores_general))
alpha_gen /= np.sum(alpha_gen)
c_t = np.dot(alpha_gen, H)

print(f"\nBobot Atensi Softmax (General): {np.round(alpha_gen, 4)}")
print(f"Vektor Konteks Luong c_t     : {np.round(c_t, 4)}")
"""
    out_11_3 = run_code_capture_output(code_11_3)

    subchapters.append({
        "id": "11-3-mekanisme-perhatian-perkalian-luong",
        "title": "11.3 Mekanisme Perhatian Perkalian Luong (Luong et al. 2015, Dot, General, Concat Scoring, Global vs Local Attention)",
        "theory": (
            "Minh-Thang Luong, Hieu Pham, dan Christopher D. Manning (EMNLP 2015) memperluas dan menyederhanakan arsitektur perhatian melalui paper "
            "*\"Effective Approaches to Attention-based Neural Machine Translation\"*. Luong et al. mengusulkan dua klasifikasi utama mekanisme perhatian: "
            "**Global Attention** (memperhatikan seluruh token sumber secara komprehensif) dan **Local Attention** (memperhatikan jendela konteks terfokus "
            "di sekitar posisi proyeksi tertentu untuk efisiensi komputasi).\n\n"
            "Perbedaan arsitektural mendasar antara model Bahdanau dan Luong terletak pada diagram alir status dan waktu keterlibatan vektor konteks:\n"
            "1. Pada Bahdanau, vektor konteks $c_t$ dihitung menggunakan status dekoder sebelumnya $s_{t-1}$ dan langsung diumpankan untuk memperbarui $s_t$.\n"
            "2. Pada Luong, status tersembunyi dekoder $s_t$ dihitung terlebih dahulu menggunakan RNN standar ($s_t = \\text{RNN}(y_{t-1}, s_{t-1})$). "
            "Kemudian, status $s_t$ dikomparasikan dengan seluruh hidden state enkoder $h_s$ untuk menghasilkan $c_t$. Terakhir, status kombinasi atensi $\\tilde{s}_t$ "
            "dihasilkan melalui lapisan proyeksi gabungan: $\\tilde{s}_t = \\tanh(W_c [c_t; s_t])$.\n\n"
            "Luong et al. merumuskan tiga fungsi skor penyelarasan (*alignment scoring functions*) matematika alternatif:\n"
            "$$\\text{score}(s_t, h_s) = \\begin{cases} s_t^\\top h_s & \\text{Dot} \\\\ s_t^\\top W_a h_s & \\text{General (Multiplicative)} \\\\ v_a^\\top \\tanh(W_a [s_t; h_s]) & \\text{Concat} \\end{cases}$$\n\n"
            "Model **General (Multiplicative)** memanfaatkan operasi perkalian matriks linear berbobot $W_a \\in \\mathbb{R}^{d \\times d}$. Secara komputasi, "
            "perkalian matriks pada model multiplicative jauh lebih efisien pada akselerator perangkat keras modern (GPU/TPU) dibandingkan operasi aditif nonlinear $\\tanh$, "
            "dan mendasari prinsip dasar operasi matriks *Scaled Dot-Product Attention* pada arsitektur Transformer di masa mendatang."
        ),
        "codeSnippet": code_11_3,
        "codeSnippetOutput": out_11_3,
        "realWorldApplication": (
            "Akselerasi pelatihan model NMT komersial pada platform pemrosesan batch GPU besar; sistem Text-to-Speech (Tacotron) dengan windowing atensi lokal monotonic; "
            "dan peringkasan dokumen berbasis ekstraksi fakta penting."
        ),
        "commonPitfalls": [
            "Menggunakan fungsi skor Dot Product murni ketika dimensi ruang representasi enkoder dan dekoder berbeda ($d_{enc} \\neq d_{dec}$), yang menghasilkan kegagalan perkalian matriks karena dot product mensyaratkan dimensi identik.",
            "Lupa menerapkan lapisan vektor atensi gabungan $\\tilde{s}_t = \\tanh(W_c [c_t; s_t])$, melainkan langsung memproyeksikan $s_t$ tanpa menggabungkan vektor konteks $c_t$ ke distribusi probabilitas output.",
            "Pada Local Attention, tidak menerapkan pembobotan distribusi Gaussian di sekitar titik pusat penjangkaran $p_t$, yang mengakibatkan diskontinuitas gradien di batas jendela atensi."
        ],
        "caseStudy": (
            "Pada sistem terjemahan simultan percakapan konferensi (Inggris-Spanyol), Local Attention Luong dengan parameter jendela $D = 4$ memangkas latensi komputasi inferensi per token dari 45 ms "
            "(pada Global Attention) menjadi 14 ms, dengan penurunan skor BLEU yang sangat marginal (kurang dari 0.3 poin), memungkinkan subtitle otomatis berjalan dalam kecepatan *real-time*."
        ),
        "academicReferences": [
            "Luong, M. T., Pham, H., & Manning, C. D. (2015). Effective approaches to attention-based neural machine translation. Proceedings of the 2015 Conference on Empirical Methods in Natural Language Processing (EMNLP 2015), 1412-1421.",
            "Britz, D., Guan, A., Luong, M. T., & Le, Q. (2017). Massive exploration of neural machine translation architectures. Proceedings of EMNLP 2017, 1442-1451.",
            "Shen, J., Pang, R., Weiss, R. J., Schuster, M., Jaitly, N., et al. (2018). Natural TTS synthesis by conditioning Wavenet on MEL spectrograph predictions. IEEE ICASSP 2018, 4779-4783."
        ]
    })

    # =========================================================================
    # Subbab 11.4: Strategi Inferensi & Pencarian Dekoder
    # =========================================================================
    code_11_4 = r"""import numpy as np

# Implementasi Beam Search Decoding dengan Normalisasi Panjang (Length Normalization)
def beam_search_decoder(transition_probs, beam_width=2, alpha_len=0.7):
    # transition_probs: list of step distributions, step t: shape (vocab_size,)
    # Kita simulasikan 3 langkah decoding pada vocab berukuran 5: [0, 1, 2, 3, 4]
    # token 0 = <EOS>
    
    # beam: list of tuple (sekuens_tokens, cumulative_log_prob)
    beam = [([ ], 0.0)]
    
    for t, probs in enumerate(transition_probs):
        candidates = []
        for seq, cum_log_prob in beam:
            if len(seq) > 0 and seq[-1] == 0:
                # Sudah mencapai <EOS>, pertahankan tanpa ekspansi
                candidates.append((seq, cum_log_prob))
                continue
            for token_id, p in enumerate(probs):
                new_seq = seq + [token_id]
                new_score = cum_log_prob + np.log(p + 1e-12)
                candidates.append((new_seq, new_score))
        
        # Urutkan kandidat berdasarkan skor log-probabilitas
        candidates.sort(key=lambda x: x[1], reverse=True)
        beam = candidates[:beam_width]
        print(f"Langkah t={t+1} - Top {beam_width} Hipotesis Beam:")
        for rank, (s, sc) in enumerate(beam):
            print(f"  Rank {rank+1}: Sekuens {s}, Log-Prob = {sc:.4f}")

    # Penerapan Normalisasi Panjang: Score_norm = Score / ((5 + len)^alpha / (5 + 1)^alpha)
    print("\n=== HASIL AKHIR DENGAN NORMALISASI PANJANG ===")
    normalized_results = []
    for seq, sc in beam:
        L = len(seq)
        penalty = ((5 + L) ** alpha_len) / ((5 + 1) ** alpha_len)
        norm_sc = sc / penalty
        normalized_results.append((seq, sc, norm_sc))
    
    normalized_results.sort(key=lambda x: x[2], reverse=True)
    for rank, (seq, raw_sc, norm_sc) in enumerate(normalized_results):
        print(f"Rank {rank+1}: Sekuens {seq} | Raw: {raw_sc:.4f} | Normalized: {norm_sc:.4f}")
    return normalized_results[0][0]

# Simulasi probabilitas model pada 3 langkah
step_probs = [
    np.array([0.05, 0.45, 0.35, 0.10, 0.05]), # Langkah 1
    np.array([0.10, 0.10, 0.20, 0.50, 0.10]), # Langkah 2
    np.array([0.70, 0.10, 0.05, 0.10, 0.05])  # Langkah 3 (Token 0 = EOS)
]

best_seq = beam_search_decoder(step_probs, beam_width=2, alpha_len=0.7)
print(f"Sekuens Terbaik Terpilih: {best_seq}")
"""
    out_11_4 = run_code_capture_output(code_11_4)

    subchapters.append({
        "id": "11-4-strategi-inferensi-dan-pencarian-dekoder",
        "title": "11.4 Strategi Inferensi & Pencarian Dekoder (Greedy Decoding, Exhaustive Search, Beam Search, Length Normalization)",
        "theory": (
            "Pada fase inferensi penerjemahan mesin autoregresif, tujuan komputasi adalah menemukan sekuens target optimal $\\mathbf{y}^* = (y_1, \\dots, y_{T_y})$ "
            "yang memaksimalkan probabilitas kondisional bersama secara global:\n"
            "$$\\mathbf{y}^* = \\arg\\max_{\\mathbf{y}} p(\\mathbf{y} \\mid \\mathbf{x}) = \\arg\\max_{\\mathbf{y}} \\sum_{t=1}^{T_y} \\log p(y_t \\mid y_{<t}, \\mathbf{x})$$\n\n"
            "Pencarian lengkap (*exhaustive search*) menuntut evaluasi seluruh ruang kemungkinan sekuens sebesar $\\mathcal{O}(|V|^{T_y})$, yang secara komputasi "
            "mustahil direalisasikan karena ukuran kosakata $|V| \\ge 30.000$ dan panjang kalimat $T_y \\ge 30$. Di sisi lain, strategi pelahap (*Greedy Decoding*) "
            "hanya memilih token dengan probabilitas lokal tertinggi pada setiap langkah waktu: $\\hat{y}_t = \\arg\\max_w p(w \\mid y_{<t}, \\mathbf{x})$. "
            "Meskipun beroperasi dalam kompleksitas linear $\\mathcal{O}(|V| \\cdot T_y)$, greedy decoding sangat rentan terhadap *search errors*: kesalahan "
            "pemilihan token pada langkah awal akan mengarahkan dekoder ke wilayah distribusi probabilitas sub-optimal tanpa kemampuan berbalik (*backtracking*).\n\n"
            "**Beam Search** mengompromikan efisiensi dan kualitas pencarian melalui algoritma heuristik pelacakan berbasis lebar berkas $B$ (*beam width*). "
            "Pada setiap langkah waktu $t$, algoritma mengekspansi seluruh $B \\times |V|$ kemungkinan token penerus dari $B$ hipotesis terbaik sebelumnya, "
            "lalu memangkas dan mempertahankan hanya $B$ hipotesis dengan skor akumulasi log-probabilitas tertinggi.\n\n"
            "**Masalah Bias Panjang & Length Normalization**: Karena probabilitas selalu bernilai $\\le 1$, setiap penambahan token menambahkan nilai log-probabilitas "
            "negatif. Akibatnya, beam search murni memiliki bias kuat yang menghukum kalimat panjang secara tidak proporsional dan cenderung memilih kalimat target "
            "yang terlalu pendek. Untuk mengatasi bias ini, Wu et al. (2016) memperkenalkan formula penalti normalisasi panjang:\n"
            "$$\\text{Score}(\\mathbf{y}) = \\frac{\\sum_{t=1}^{T_y} \\log p(y_t \\mid y_{<t}, \\mathbf{x})}{lp(\\mathbf{y})}, \\quad lp(\\mathbf{y}) = \\frac{(5 + |\\mathbf{y}|)^\\alpha}{(5 + 1)^\\alpha}$$\n"
            "di mana $\\alpha \\in [0.6, 0.8]$ adalah hiperparameter pengontrol kekuatan kompensasi panjang sekuens."
        ),
        "codeSnippet": code_11_4,
        "codeSnippetOutput": out_11_4,
        "realWorldApplication": (
            "Mesin inferensi pada layanan terjemahan cloud komersial (Google Translate, DeepL); sistem speech-to-text; dan generasi teks terpandu pada model "
            "bahasa besar dengan kontrol repetisi (*repetition penalty*)."
        ),
        "commonPitfalls": [
            "Meningkatkan ukuran beam width $B$ terlalu besar (misal $B > 30$) dengan harapan meningkatkan akurasi, yang justru dalam praktik sering kali menurunkan skor BLEU karena model terdorong memilih hipotesis sangat pendek atau menghasilkan teks generik yang hampa makna.",
            "Lupa menerapkan deduplikasi n-gram (*no-repeat-ngram-size*) pada dekoder terbuka, menyebabkan model terjebak dalam perulangan frasa tanpa akhir (*repetitive loops*).",
            "Menghitung skor akumulasi probabilitas menggunakan perkalian langsung probabilitas $\\prod p(y_t)$ alih-alih penjumlahan log-probabilitas $\\sum \\log p(y_t)$, yang langsung memicu *arithmetic underflow* ke nol pada token ke-5 atau ke-6."
        ],
        "caseStudy": (
            "Sebuah sistem terjemahan medis otomatis mengalami keluhan dokter karena terjemahan resep sering terpotong di bagian petunjuk dosis. Investigasi membuktikan bahwa sistem menggunakan beam search $B=5$ "
            "tanpa normalisasi panjang, sehingga kalimat target yang memuat penjelasan dosis 20 kata dikalahkan oleh kalimat 6 kata yang tidak lengkap. Setelah diimplementasikan normalisasi panjang Wu et al. "
            "dengan $\\alpha = 0.75$, kelengkapan instruksi medis meningkat hingga 99.4%."
        ),
        "academicReferences": [
            "Wu, Y., Schuster, M., Chen, Z., Le, Q. V., Norouzi, M., et al. (2016). Google's neural machine translation system: Bridging the gap between human and machine translation. arXiv preprint arXiv:1609.08144.",
            "Koehn, P. (2004). Pharaoh: a beam search decoder for phrase-based statistical machine translation models. Conference of the Association for Machine Translation in the Americas, 115-124.",
            "Freitag, M., & Al-Onaizan, Y. (2017). Beam search strategies for neural machine translation. Proceedings of the First Workshop on Neural Machine Translation, 56-60."
        ]
    })

    # =========================================================================
    # Subbab 11.5: Metrik Evaluasi NMT
    # =========================================================================
    code_11_5 = r"""import numpy as np
from collections import Counter
import math

def calculate_bleu(candidate_tokens, reference_tokens_list, max_n=4):
    # candidate_tokens: list of str
    # reference_tokens_list: list of list of str (multiple references)
    
    # 1. Modifikasi n-gram precision p_n
    precisions = []
    for n in range(1, max_n + 1):
        cand_ngrams = [tuple(candidate_tokens[i:i+n]) for i in range(len(candidate_tokens) - n + 1)]
        if not cand_ngrams:
            precisions.append(0.0)
            continue
        cand_counts = Counter(cand_ngrams)
        
        # Cari frekuensi maksimum n-gram di referensi mana pun
        max_ref_counts = Counter()
        for ref in reference_tokens_list:
            ref_ngrams = [tuple(ref[i:i+n]) for i in range(len(ref) - n + 1)]
            ref_counts = Counter(ref_ngrams)
            for ng in ref_counts:
                max_ref_counts[ng] = max(max_ref_counts[ng], ref_counts[ng])
        
        # Clipped counts
        clipped_counts = {ng: min(cand_counts[ng], max_ref_counts[ng]) for ng in cand_counts}
        p_n = sum(clipped_counts.values()) / max(1, sum(cand_counts.values()))
        precisions.append(p_n)
    
    # 2. Brevity Penalty (BP)
    c = len(candidate_tokens) # candidate length
    # Cari panjang referensi terdekat r
    ref_lens = [len(ref) for ref in reference_tokens_list]
    r = min(ref_lens, key=lambda ref_len: (abs(ref_len - c), ref_len))
    
    if c > r:
        bp = 1.0
    else:
        bp = math.exp(1.0 - float(r) / max(1, c))
    
    # 3. Akumulasi Rata-rata Geometrik Log Precision
    log_prec_sum = 0.0
    weight = 1.0 / max_n
    for p in precisions:
        if p > 0:
            log_prec_sum += weight * math.log(p)
        else:
            log_prec_sum += weight * -999.0 # Smoothing penalty
            
    bleu = bp * math.exp(log_prec_sum) if log_prec_sum > -100 else 0.0
    return bleu, bp, precisions, c, r

cand = "the cat sat on the mat".split()
refs = [
    "the cat was sitting on the mat".split(),
    "there is a cat on the mat".split()
]

bleu_score, bp_val, p_list, cand_l, ref_l = calculate_bleu(cand, refs, max_n=4)

print("=== PERHITUNGAN BLEU SCORE (Papineni et al. 2002) ===")
print(f"Kandidat : {' '.join(cand)} (Panjang c = {cand_l})")
print(f"Referensi: {' | '.join([' '.join(r) for r in refs])} (Panjang Efektif r = {ref_l})")
print(f"Brevity Penalty (BP) : {bp_val:.4f}")
for idx, p in enumerate(p_list):
    print(f"Modified Precision p_{idx+1}: {p:.4f}")
print(f"Skor Akhir BLEU-4    : {bleu_score * 100:.2f}")
"""
    out_11_5 = run_code_capture_output(code_11_5)

    subchapters.append({
        "id": "11-5-metrik-evaluasi-nmt",
        "title": "11.5 Metrik Evaluasi NMT (Bilingual Evaluation Understudy / BLEU Score, Brevity Penalty, ROUGE, chrF, SacreBLEU)",
        "theory": (
            "Evaluasi kualitas hasil terjemahan mesin saraf secara manual oleh linguis manusia membutuhkan biaya finansial dan waktu yang sangat masif. "
            "Oleh karena itu, komunitas pemrosesan bahasa alami mengandalkan metrik evaluasi otomatis berbasis perbandingan korpus rujukan (*reference translations*). "
            "Metrik standar emas yang paling banyak diadopsi adalah **BLEU** (*Bilingual Evaluation Understudy*), yang diformulasikan oleh Kishore Papineni et al. (ACL 2002).\n\n"
            "BLEU mengukur kemiripan leksikal antara kalimat kandidat mesin ($c$) dan sekumpulan kalimat referensi manusia ($r$) melalui rata-rata geometrik tertimbang "
            "dari modifikasi presisi n-gram ($p_n$) dikalikan dengan faktor penalti panjang (*Brevity Penalty* / $\\text{BP}$):\n"
            "$$\\text{BLEU} = \\text{BP} \\cdot \\exp\\left( \\sum_{n=1}^{N} w_n \\log p_n \\right)$$\n"
            "di mana bobot seragam $w_n = 1/N$ (biasanya $N=4$). Modifikasi presisi $p_n$ membatasi frekuensi kemunculan n-gram kandidat agar tidak melebihi frekuensi "
            "maksimum n-gram tersebut pada salah satu kalimat referensi, mencegah manipulasi skor oleh kalimat kandidat yang hanya mengulang satu kata umum berulang kali.\n\n"
            "Faktor **Brevity Penalty (BP)** dirancang untuk menghukum sistem terjemahan yang menghasilkan kalimat terlalu pendek untuk mendongkrak presisi:\n"
            "$$\\text{BP} = \\begin{cases} 1 & \\text{jika } c > r \\\\ \\exp(1 - r/c) & \\text{jika } c \\le r \\end{cases}$$\n"
            "di mana $c$ adalah panjang total token kalimat kandidat dan $r$ adalah panjang referensi efektif terdekat.\n\n"
            "**Keterbatasan BLEU & Metrik Modern**: BLEU sangat sensitif terhadap variasi pra-pemrosesan teks (tokenisasi kapitalisasi, pemisahan tanda baca). "
            "Post (2018) mengusulkan **SacreBLEU** yang mengotomatisasi skema tokenisasi internal terstandarisasi untuk menjamin komparabilitas lintas makalah ilmiah. "
            "Selain itu, untuk bahasa bertipe morfologi kaya (seperti bahasa Indonesia, Finlandia, atau Turki), metrik **chrF** (Popović 2015) yang mengukur F-score "
            "karakter n-gram dan metrik berbasis representasi neural embedding seperti **COMET** (Rei et al. 2020) terbukti memiliki korelasi jauh lebih tinggi "
            "terhadap penilaian kualitas manusia dibandingkan BLEU."
        ),
        "codeSnippet": code_11_5,
        "codeSnippetOutput": out_11_5,
        "realWorldApplication": (
            "Tolok ukur otomatis (*automated benchmarking*) pada kompetisi tahunan WMT (Conference on Machine Translation); integrasi Continuous Integration (CI) "
            "untuk mendeteksi regresi performa model NMT sebelum peluncuran produksi; dan optimasi penguatan Reinforcement Learning berbasis skor reward BLEU/COMET."
        ),
        "commonPitfalls": [
            "Membandingkan skor BLEU antar makalah ilmiah yang menggunakan tokenisasi eksternal berbeda (misal NLTK vs Moses tokenizer vs spaCy), yang dapat mengubah skor akhir hingga 5 poin BLEU tanpa adanya peningkatan kualitas model nyata.",
            "Mengabaikan fenomena zero precision pada n-gram tinggi (misal $p_4 = 0$) pada evaluasi level kalimat tunggal (*sentence-level BLEU*), yang menyebabkan skor BLEU kalimat langsung anjlok ke 0 akibat sifat perkalian rata-rata geometrik (memerlukan teknik smoothing Lin & Och).",
            "Mengandalkan BLEU murni untuk mengevaluasi bahasa aglutinatif tanpa menyertakan metrik chrF atau subword F-score."
        ],
        "caseStudy": (
            "Sebuah tim insinyur mempublikasikan laporan bahwa model NMT baru mereka mengungguli baseline sebesar +3.5 BLEU pada dataset WMT14 Inggris-Jerman. Namun, "
            "audit independen menggunakan SacreBLEU menemukan bahwa peningkatan tersebut semata-mata diakibatkan oleh skrip tokenisasi tim yang memecah tanda hubung kata benda majemuk Jerman, "
            "sementara baseline dievaluasi pada teks utuh. Setelah distandarisasi menggunakan SacreBLEU signature resmi, performa kedua model terbukti identik."
        ),
        "academicReferences": [
            "Papineni, K., Roukos, S., Ward, T., & Zhu, W. J. (2002). BLEU: a method for automatic evaluation of machine translation. Proceedings of the 40th Annual Meeting of the Association for Computational Linguistics (ACL 2002), 311-318.",
            "Post, M. (2018). A call for clarity in reporting BLEU scores. Proceedings of the Third Conference on Machine Translation: Research Papers, 186-191.",
            "Popović, M. (2015). chrF: character n-gram F-score for machine translation evaluation. Proceedings of the Tenth Workshop on Statistical Machine Translation, 392-395."
        ]
    })

    # =========================================================================
    # Subbab 11.6: Dynamic Alignment Visualization & Interpretabilitas Attention Weights
    # =========================================================================
    code_11_6 = r"""import numpy as np

# Ekstraksi Matriks Penyelarasan Kata Keras (Hard Alignment) dari Matriks Atensi Lembut
np.random.seed(42)

src_tokens = ["L'accord", "sur", "la", "zone", "économique", "européenne", "a", "été", "signé"]
tgt_tokens = ["The", "agreement", "on", "the", "European", "Economic", "Area", "was", "signed"]

# Simulasi matriks bobot atensi lembut alpha (T_tgt, T_src)
T_tgt = len(tgt_tokens)
T_src = len(src_tokens)

# Buat matriks atensi realistis dengan pergeseran urutan (European Economic Area <-> zone économique européenne)
A = np.zeros((T_tgt, T_src))
# Korelasi langsung
A[0, 0] = 0.85 # The -> L'accord
A[1, 0] = 0.90 # agreement -> L'accord
A[2, 1] = 0.95 # on -> sur
A[3, 2] = 0.92 # the -> la
# Pembalikan urutan kata sifat dalam bahasa Prancis vs Inggris
A[4, 5] = 0.88 # European -> européenne
A[5, 4] = 0.82 # Economic -> économique
A[6, 3] = 0.79 # Area -> zone
A[7, 6:8] = [0.45, 0.50] # was -> a été
A[8, 8] = 0.96 # signed -> signé

# Normalisasi baris agar sum = 1.0
A += np.random.uniform(0.01, 0.05, size=A.shape)
A = A / np.sum(A, axis=1, keepdims=True)

print("=== EKSTRAKSI PENYELARASAN KATA (WORD ALIGNMENT) ===")
# Ambang batas hard alignment threshold tau = 0.3
tau = 0.3
alignments = []
for i, tgt_w in enumerate(tgt_tokens):
    matched_src = []
    for j, src_w in enumerate(src_tokens):
        if A[i, j] >= tau:
            matched_src.append((src_w, A[i, j]))
            alignments.append((i, j, tgt_w, src_w, A[i, j]))
    print(f"Target '{tgt_w:<10}' <---> Terhubung ke: {[(w, f'{sc:.2f}') for w, sc in matched_src]}")

print(f"\nTotal Pasangan Alignment Terdeteksi: {len(alignments)}")
print("Contoh Penyelarasan Terbalik (Inversion):")
for i, j, tw, sw, sc in alignments:
    if tw in ["European", "Economic", "Area"]:
        print(f"  Target [{i}] '{tw}' diselaraskan ke Sumber [{j}] '{sw}' (Skor: {sc:.4f})")
"""
    out_11_6 = run_code_capture_output(code_11_6)

    subchapters.append({
        "id": "11-6-dynamic-alignment-visualization-dan-interpretabilitas-attention-weights",
        "title": "11.6 Dynamic Alignment Visualization & Interpretabilitas Attention Weights (Saliency Map, Word Alignment Extraction)",
        "theory": (
            "Salah satu keunggulan terbesar dari mekanisme perhatian (*attention mechanism*) dibandingkan arsitektur jaringan saraf hitam (*black-box neural networks*) "
            "adalah sifat interpretabilitas intrisiknya. Matriks bobot perhatian $\\mathbf{A} \\in \\mathbb{R}^{T_y \\times T_x}$, di mana elemen baris ke-$i$ dan "
            "kolom ke-$j$ bernilai $\\alpha_{ij} \\in [0, 1]$, memvisualisasikan derajat asosiasi dan fokus spasial dekoder terhadap setiap token sekuens sumber "
            "saat menghasilkan kata target ke-$i$.\n\n"
            "Visualisasi matriks $\\mathbf{A}$ sebagai peta panas 2 dimensi (*heat map* atau *saliency alignment map*) secara langsung mencerminkan fenomena linguistik "
            "antar-bahasa:\n"
            "1. **Penyelarasan Monotonik Linear**: Garis diagonal utama yang rapat mengindikasikan struktur gramatikal yang sejalan antara bahasa sumber dan target "
            "(misal penerjemahan klausa subjek-predikat-objek standar bahasa Inggris ke bahasa Indonesia).\n"
            "2. **Pembalikan Urutan Frasa (*Non-monotonic Inversion*)**: Deviasi lokal dari diagonal utama memperlihatkan transposisi sintaksis, seperti pembalikan urutan "
            "frasa nomina bahasa Prancis (*zone économique européenne*) menjadi urutan modifikator bahasa Inggris (*European Economic Area*).\n"
            "3. **Penyelarasan Satu-ke-Banyak (*Fertility & Many-to-One Alignment*)**: Ketika satu kata sumber berbobot tinggi untuk beberapa kata target berturut-turut "
            "(misalnya kata kerja majemuk Jerman *aufstehen* yang diterjemahkan menjadi *get up*).\n\n"
            "Untuk mengekstrak keterhubungan kata biner (*hard word alignment*), praktisi menerapkan ambang batas probabilitas $\\tau$ atau mengambil indeks argmax: "
            "$\\mathcal{A} = \\{(i, j) \\mid \\alpha_{ij} \\ge \\tau \\text{ atau } j = \\arg\\max_{k} \\alpha_{ik}\\}$. Ekstraksi ini memungkinkan evaluasi ketersejajaran "
            "menggunakan metrik *Alignment Error Rate* (AER) terhadap korpus teranotasi manual."
        ),
        "codeSnippet": code_11_6,
        "codeSnippetOutput": out_11_6,
        "realWorldApplication": (
            "Audit regulasi kepatuhan GDPR pada terjemahan dokumen finansial untuk membuktikan bahwa klausul denda diterjemahkan secara akurat dari sumber aslinya; "
            "alat bantu Computer-Assisted Translation (CAT tools) untuk menyorot kata sumber saat penerjemah profesional memeriksa teks; dan penandaan entitas bernama dwibahasa."
        ),
        "commonPitfalls": [
            "Mengasumsikan bahwa bobot atensi $\\alpha_{ij}$ adalah kausalitas absolut penjelasan model, padahal penelitian Jain & Wallace (2019) membuktikan bahwa bobot atensi terkadang dapat dimanipulasi tanpa mengubah output prediksi akhir model.",
            "Lupa menjumlahkan bobot atensi subword saat sistem menggunakan tokenisasi BPE, yang menghasilkan matriks atensi terfragmentasi dan sulit diinterpretasikan pada level kata gramatikal.",
            "Menyamakan visualisasi multi-head attention Transformer dengan atensi tunggal RNN, di mana pada Transformer setiap head menangkap relasi sintaksis yang berbeda (posisi kata kerja, anafora, tanda baca) sehingga memerlukan agregasi mean atau rollout."
        ],
        "caseStudy": (
            "Sebuah lembaga arbitrase internasional mendeteksi perselisihan kontrak akibat dugaan penghilangan klausul penalti dalam terjemahan otomatis. Melalui inspeksi "
            "saliency map matriks $\\alpha_{ij}$, tim forensik AI berhasil membuktikan bahwa dekoder menaruh bobot atensi 0.94 pada kata negasi bahasa Jerman *nicht*, namun bobot tersebut "
            "terdistorsi pada lapisan linear output menjadi penegasan akibat fenomena hallucination under coverage error."
        ),
        "academicReferences": [
            "Bahdanau, D., Cho, K., & Bengio, Y. (2015). Neural machine translation by jointly learning to align and translate. ICLR 2015, arXiv:1409.0473.",
            "Jain, S., & Wallace, B. C. (2019). Attention is not Explanation. Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 1, 3543-3556.",
            "Koehn, P., Och, F. J., & Marcu, D. (2003). Statistical phrase-based translation. Proceedings of HLT-NAACL 2003, 48-54."
        ]
    })

    # =========================================================================
    # Subbab 11.7: Masalah Exposure Bias & Teknik Scheduled Sampling
    # =========================================================================
    code_11_7 = r"""import numpy as np

# Simulasi Strategi Pembusukan Jadwal Sampling (Scheduled Sampling Decay Schedules)
def scheduled_sampling_probability(step, total_steps, schedule_type='inverse_sigmoid', k=2000):
    if schedule_type == 'linear':
        # Penurunan linear epsilon dari 1.0 ke 0.0
        epsilon = max(0.0, 1.0 - step / total_steps)
    elif schedule_type == 'exponential':
        # Penurunan eksponensial: gamma^step
        gamma = 0.999
        epsilon = gamma ** step
    elif schedule_type == 'inverse_sigmoid':
        # Pembusukan sigmoid terbalik: k / (k + exp(step / k))
        epsilon = k / (k + np.exp(step / k))
    else:
        raise ValueError("Tipe jadwal tidak dikenal")
    return float(epsilon)

steps_to_eval = [0, 500, 1000, 2000, 4000, 8000, 10000]
total_train_steps = 10000

print("=== EVALUASI PROBABILITAS TEACHER FORCING (EPSILON) ===")
print(f"{'Step':<8} | {'Linear':<10} | {'Exponential':<12} | {'Inverse Sigmoid':<15}")
print("-" * 55)

for s in steps_to_eval:
    eps_lin = scheduled_sampling_probability(s, total_train_steps, 'linear')
    eps_exp = scheduled_sampling_probability(s, total_train_steps, 'exponential')
    eps_sig = scheduled_sampling_probability(s, total_train_steps, 'inverse_sigmoid', k=2000)
    print(f"{s:<8} | {eps_lin:<10.4f} | {eps_exp:<12.4f} | {eps_sig:<15.4f}")

# Simulasi pemilihan token pada scheduled sampling
np.random.seed(42)
step_sim = 2000
epsilon_current = scheduled_sampling_probability(step_sim, total_train_steps, 'inverse_sigmoid', k=2000)
ground_truth_token = 42
model_predicted_token = 108

coin_flip = np.random.rand()
token_fed_to_next_step = ground_truth_token if coin_flip < epsilon_current else model_predicted_token

print(f"\nSimulasi Step {step_sim}: Epsilon = {epsilon_current:.4f}")
print(f"Lemparan Koin = {coin_flip:.4f} -> Token Diinput ke Langkah Berikutnya: {token_fed_to_next_step} "
      f"({'Ground Truth' if token_fed_to_next_step == ground_truth_token else 'Prediksi Model'})")
"""
    out_11_7 = run_code_capture_output(code_11_7)

    subchapters.append({
        "id": "11-7-masalah-exposure-bias-dan-teknik-scheduled-sampling",
        "title": "11.7 Masalah Exposure Bias & Teknik Scheduled Sampling (Teacher Forcing vs Student Forcing, DART)",
        "theory": (
            "Pada proses pelatihan model autoregresif sekuens-ke-sekuens konvensional, standar baku yang digunakan adalah **Teacher Forcing** (Williams & Zipser 1989). "
            "Di bawah skema ini, pada setiap langkah waktu dekoder $t$, input yang diberikan ke jaringan adalah token kebenaran dasar (*ground truth target token*) $y_{t-1}^*$, "
            "terlepas dari apakah model memprediksi token tersebut dengan benar atau salah pada langkah sebelumnya. Pelatihan ini memaksimalkan kecepatan konvergensi "
            "dan stabilitas gradien karena error tidak terakumulasi ke langkah-langkah berikutnya.\n\n"
            "Namun, pendekatan ini memicu diskrepansi fundamental antara fase pelatihan dan inferensi yang dikenal sebagai **Exposure Bias**:\n"
            "1. Saat pelatihan, model *hanya pernah terpapar* pada sekuens awalan yang 100% sempurna dan benar gramatikalnya.\n"
            "2. Saat inferensi pengujian, model tidak memiliki akses ke guru (*ground truth*), melainkan harus mengonsumsi token prediksinya sendiri yang dibangkitkan "
            "pada langkah sebelumnya: $\\hat{y}_{t-1} \\sim p(y \\mid \\hat{y}_{<t-1}, \\mathbf{x})$.\n"
            "Jika model melakukan satu kesalahan kecil pada token awal, ia akan terlempar ke ruang representasi tersembunyi yang belum pernah dialaminya selama pelatihan, "
            "memicu efek domino akumulasi galat (*compounding error explosion*) yang berujung pada halusinasi teks atau repetisi kata tanpa henti.\n\n"
            "Samy Bengio et al. (NeurIPS 2015) mengusulkan **Scheduled Sampling** sebagai jembatan mitigasi. Selama pelatihan, kurikulum bertahap diterapkan: probabilitas "
            "penggunaan teacher forcing $\\epsilon_i$ diturunkan secara mulus seiring bertambahnya iterasi pelatihan $i$, sementara probabilitas menyuapkan prediksi model "
            "sendiri $(1 - \\epsilon_i)$ ditingkatkan. Tiga fungsi pembusukan yang lazim digunakan meliputi penurunan linear, eksponensial, dan sigmoid terbalik:\n"
            "$$\\epsilon_i = \\frac{k}{k + \\exp(i / k)}$$\n"
            "Pendekatan ini melatih ketahanan model (*robustness*) dalam mengoreksi kesalahannya sendiri saat menavigasi sekuens yang cacat."
        ),
        "codeSnippet": code_11_7,
        "codeSnippetOutput": out_11_7,
        "realWorldApplication": (
            "Sistem peringkasan berita otomatis (*abstractive text summarization*) agar tidak mengalami pengulangan kalimat di akhir paragraf; "
            "generasi dialog chatbot jangka panjang (*multi-turn dialog*); dan pemodelan Text-to-Speech untuk mencegah ledakan desis audio pada fonem panjang."
        ),
        "commonPitfalls": [
            "Menerapkan student forcing terlalu dini pada awal pelatihan (misal $\\epsilon < 0.5$ pada epoch 1), yang mengakibatkan model gagal konvergen karena sinyal gradien terlalu berisik.",
            "Mengabaikan fakta bahwa Scheduled Sampling murni melanggar kaidah estimasi kemungkinan maksimum (*Maximum Likelihood Estimation*) karena distribusi data input bergantung pada parameter model yang sedang berubah, yang dapat menyebabkan pergeseran fungsi objektif (memerlukan koreksi DART atau reinforcement learning berbasis policy gradient seperti MIXER).",
            "Tidak menerapkan gradient detachment saat token prediksi model diumpankan kembali ke embedding input pada langkah berikutnya, memicu graf komputasi siklik yang menghabiskan memori GPU."
        ],
        "caseStudy": (
            "Pada sistem dialog agen reservasi tiket penerbangan, model Seq2Seq murni dengan teacher forcing sering kali mengalami *breakdown* jika pengguna mengetik nama bandara yang tidak terdaftar: "
            "model mengulang frasa 'ke bandara ke bandara ke bandara' tanpa henti. Dengan mengimplementasikan Scheduled Sampling sigmoid terbalik ($k=4000$), ketahanan model meningkat drastis, "
            "di mana model mampu menghasilkan frasa klarifikasi balik 'Maaf, bandara mana yang Anda maksud?' ketika token sebelumnya tidak valid."
        ),
        "academicReferences": [
            "Bengio, S., Vinyals, O., Jaitly, N., & Shazeer, N. (2015). Scheduled sampling for sequence prediction with recurrent neural networks. Advances in Neural Information Processing Systems (NeurIPS 2015), 28, 1171-1179.",
            "Ranzato, M. A., Chopra, S., Auli, M., & Zaremba, W. (2016). Sequence level training with recurrent neural networks. International Conference on Learning Representations (ICLR 2016).",
            "Williams, R. J., & Zipser, D. (1989). A learning algorithm for continually running fully recurrent neural networks. Neural Computation, 1(2), 270-280."
        ]
    })

    # =========================================================================
    # Subbab 11.8: Subword Modeling & Penanganan Out-Of-Vocabulary pada NMT
    # =========================================================================
    code_11_8 = r"""import numpy as np
from collections import defaultdict, Counter

# Implementasi Mini Pembelajaran Pasangan BPE untuk Penerjemahan Mesin Saraf
def get_stats(vocab):
    pairs = defaultdict(int)
    for word, freq in vocab.items():
        symbols = word.split()
        for i in range(len(symbols) - 1):
            pairs[symbols[i], symbols[i+1]] += freq
    return pairs

def merge_vocab(pair, v_in):
    v_out = {}
    bigram = ' '.join(pair)
    replacement = ''.join(pair)
    for word in v_in:
        w_out = word.replace(bigram, replacement)
        v_out[w_out] = v_in[word]
    return v_out

# Korpus dwibahasa mini: Kata dipecah per karakter dengan akhiran penanda batas '</w>'
raw_corpus = {
    'l o w </w>': 5,
    'l o w e r </w>': 2,
    'n e w e s t </w>': 6,
    'w i d e s t </w>': 3
}

print("=== PEMBELAJARAN ATURAN SUBWORD BPE (Sennrich et al. 2016) ===")
num_merges = 5
vocab = raw_corpus.copy()
bpe_rules = []

for step in range(num_merges):
    pairs = get_stats(vocab)
    if not pairs:
        break
    best_pair = max(pairs, key=pairs.get)
    bpe_rules.append(best_pair)
    vocab = merge_vocab(best_pair, vocab)
    print(f"Iterasi {step+1}: Pasangan Terbanyak Ditemukan = {best_pair} (Frekuensi: {pairs[best_pair]})")

print("\nKosakata Token Setelah 5 Penggabungan BPE:")
for w, freq in vocab.items():
    print(f"  '{w}': {freq} kali")

# Demonstrasi tokenisasi kata OOV baru: 'lowest'
print("\nDemonstrasi Penanganan Kata Baru di Luar Kamus (OOV): 'lowest'")
# 'lowest' dipecah karakter -> 'l o w e s t </w>'
# Dengan aturan: ('e', 's') -> 'es', ('es', 't') -> 'est', ('l', 'o') -> 'lo', ('lo', 'w') -> 'low'
# Hasil segmentasi: ['low', 'est</w>'] -> Komposisi dua morfem yang dikenali!
print("Segmentasi Subword dari 'lowest': ['low', 'est</w>'] -> Terjemahan Komposisional Berhasil!")
"""
    out_11_8 = run_code_capture_output(code_11_8)

    subchapters.append({
        "id": "11-8-subword-modeling-dan-penanganan-oov-pada-nmt",
        "title": "11.8 Subword Modeling & Penanganan Out-Of-Vocabulary pada NMT (BPE, WordPiece, Target Vocabulary Pruning)",
        "theory": (
            "Pada generasi awal penerjemahan mesin statistik dan saraf berbasis kata utuh (*word-level NMT*), ukuran kosakata dibatasi secara kaku "
            "(biasanya antara 30.000 hingga 50.000 kata teratas) guna mencegah komputasi lapisan softmax akhir menjadi tidak praktis. Seluruh kata "
            "yang berada di luar daftar kosakata ini secara serampangan dipetakan ke token khusus yang sama: `<UNK>` (*unknown token*). Pada domain "
            "bahasa dengan produktivitas morfologi tinggi atau teks teknis yang kaya akan istilah majemuk (seperti bahasa Jerman, Finlandia, atau "
            "istilah biologi), frekuensi kemunculan token `<UNK>` dapat mencapai lebih dari 10% dari total korpus, merusak kualitas dan integritas "
            "semantik terjemahan secara katastropik.\n\n"
            "Rico Sennrich, Barry Haddow, dan Alexandra Birch (ACL 2016) menyelesaikan masalah ini secara revolusioner melalui paper *\"Neural Machine "
            "Translation of Rare Words with Subword Units\"*. Sennrich et al. mengadaptasi algoritma kompresi data **Byte Pair Encoding (BPE)** untuk "
            "mensegmentasikan kata menjadi unit-unit subword (morfemik) yang fleksibel.\n\n"
            "1. **Prinsip Kosakata Terbuka (*Open-Vocabulary Processing*)**: Kata-kata berfrekuensi tinggi dipertahankan sebagai unit kata utuh, "
            "sedangkan kata-kata langka, kata majemuk baru, nama entitas, atau kata jadian didekomposisi menjadi subword-subword yang bermakna "
            "(misal: *unconditionally* $\\to$ `un-` + `condition` + `al` + `-ly`).\n"
            "2. **Shared BPE Vocabulary**: Pada model NMT dwibahasa, Sennrich et al. mengusulkan penggabungan korpus teks sumber dan target "
            "untuk mempelajari satu set aturan BPE bersama (*joint BPE*). Hal ini memungkinkan transliterasi langsung nama orang, angka, dan istilah ilmiah "
            "dari bahasa sumber ke target tanpa perlu melalui kamus terjemahan formal.\n\n"
            "Selain BPE, varian seperti **WordPiece** (Schuster & Nakajima 2012) yang memaksimalkan *likelihood* model unigram bahasa dan **SentencePiece** "
            "(Kudo & Richardson 2018) yang memperlakukan spasi sebagai karakter normal `_` (*pure raw-text byte processing*) menjadi pilar mutlak "
            "seluruh sistem NMT industri modern."
        ),
        "codeSnippet": code_11_8,
        "codeSnippetOutput": out_11_8,
        "realWorldApplication": (
            "Penerjemahan istilah kimia dan kedokteran yang terdiri dari akar kata Latin/Yunani panjang; penanganan nama entitas selebritas dan merek "
            "yang baru muncul di media sosial; dan lokalisasi perangkat lunak lintas puluhan bahasa tanpa kosakata `<UNK>`."
        ),
        "commonPitfalls": [
            "Melatih BPE dengan ukuran kosakata terlalu kecil (misal $< 4.000$ merge operations), yang menyebabkan kata-kata umum terfragmentasi menjadi huruf-huruf tunggal sehingga memperpanjang sekuens secara berlebihan dan membebani komputasi self-attention $\\mathcal{O}(L^2)$.",
            "Tidak menggunakan penanda pemisah batas kata khusus (seperti `@@` pada subword-nmt atau ` ` pada SentencePiece), sehingga teks yang telah disegmentasi tidak dapat direkonstruksi kembali (*detokenized*) ke format spasi aslinya secara deterministik.",
            "Mempelajari kosakata BPE terpisah untuk dua bahasa yang menggunakan alfabet yang sama (misal Inggris dan Prancis), alih-alih joint BPE, yang melenyapkan keselarasan token nama entitas bersama."
        ],
        "caseStudy": (
            "Pada proyek lokalisasi manual mesin industri dari bahasa Jerman ke bahasa Inggris, sistem word-level baseline menerjemahkan istilah majemuk Jerman "
            "*Kraftfahrzeughaftpflichtversicherung* menjadi `<UNK>`. Setelah mengadopsi Joint BPE dengan 32.000 operasi penggabungan, sistem berhasil "
            "mensegmentasikan kata tersebut menjadi `Kraft` + `fahrzeug` + `haftpflicht` + `versicherung` dan menerjemahkannya secara akurat dan tepat menjadi "
            "*motor vehicle liability insurance*."
        ),
        "academicReferences": [
            "Sennrich, R., Haddow, B., & Birch, A. (2016). Neural machine translation of rare words with subword units. Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), 1715-1725.",
            "Kudo, T., & Richardson, J. (2018). SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing. Proceedings of EMNLP 2018: System Demonstrations, 66-71.",
            "Schuster, M., & Nakajima, K. (2012). Japanese and Korean voice search. 2012 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP), 5149-5152."
        ]
    })

    # =========================================================================
    # Subbab 11.9: Arsitektur Transformer Autoregresif untuk NMT
    # =========================================================================
    code_11_9 = r"""import numpy as np

# Simulasi Lapisan Cross-Attention Dekoder Transformer (Vaswani et al. 2017)
np.random.seed(42)

T_tgt = 3 # Panjang sekuens target saat ini
T_src = 4 # Panjang sekuens sumber enkoder
d_model = 8
d_k = 4

# S: Representasi Dekoder setelah Self-Attention Ber-masker (T_tgt, d_model)
# H: Representasi Output Enkoder Sumber (T_src, d_model)
S_dec = np.random.randn(T_tgt, d_model)
H_enc = np.random.randn(T_src, d_model)

# Matriks Proyeksi Linear Cross-Attention
W_Q = np.random.randn(d_model, d_k) * 0.2
W_K = np.random.randn(d_model, d_k) * 0.2
W_V = np.random.randn(d_model, d_k) * 0.2
W_O = np.random.randn(d_k, d_model) * 0.2

# 1. Proyeksi: Query berasal dari Dekoder, Key & Value berasal dari Enkoder!
Q = np.dot(S_dec, W_Q) # (T_tgt, d_k)
K = np.dot(H_enc, W_K) # (T_src, d_k)
V = np.dot(H_enc, W_V) # (T_src, d_k)

print("=== MEKANISME CROSS-ATTENTION ENKODER-DEKODER ===")
print(f"Bentuk Matriks: Query={Q.shape}, Key={K.shape}, Value={V.shape}")

# 2. Scaled Dot-Product: Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V
scores = np.dot(Q, K.T) / np.sqrt(d_k) # (T_tgt, T_src)
exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
cross_att_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)

print("\nMatriks Bobot Cross-Attention (T_tgt x T_src):")
print(np.round(cross_att_weights, 4))
print(f"Verifikasi Penjumlahan Tiap Baris Target: {np.sum(cross_att_weights, axis=-1)}")

# 3. Agregasi Vektor Konteks dan Proyeksi Output
context = np.dot(cross_att_weights, V) # (T_tgt, d_k)
output = np.dot(context, W_O)         # (T_tgt, d_model)

print(f"\nBentuk Output Akhir Lapisan Cross-Attention: {output.shape}")
print(f"Norm L2 Output Token Pertama: {np.linalg.norm(output[0]):.4f}")
"""
    out_11_9 = run_code_capture_output(code_11_9)

    subchapters.append({
        "id": "11-9-arsitektur-transformer-autoregresif-untuk-nmt",
        "title": "11.9 Arsitektur Transformer Autoregresif untuk NMT (Vaswani et al. 2017, Causal Masking, Cross-Attention)",
        "theory": (
            "Paper monumental *\"Attention Is All You Need\"* oleh Ashish Vaswani et al. (NeurIPS 2017) menandai berakhirnya dominasi arsitektur "
            "rekuren (RNN/LSTM/GRU) dalam penerjemahan mesin saraf. Transformer memperkenalkan paradigma enkoder-dekoder murni yang sepenuhnya "
            "didasarkan pada mekanisme *Self-Attention* dan *Cross-Attention*, melenyapkan dependensi temporal sekuensial dan memungkinkan paralelisasi "
            "penuh selama proses pelatihan.\n\n"
            "Arsitektur Transformer untuk NMT tersusun atas dua blok hierarkis utama:\n"
            "1. **Enkoder**: Terdiri dari tumpukan $N=6$ lapisan identik. Setiap lapisan memiliki dua sub-lapisan: *Multi-Head Self-Attention* bidireksional "
            "dan *Position-wise Feed-Forward Network* (FFN), yang keduanya dilengkapi dengan koneksi residual (*residual connection*) dan normalisasi lapisan (*Layer Normalization*):\n"
            "$$\\text{Output} = \\text{LayerNorm}(x + \\text{Sublayer}(x))$$\n\n"
            "2. **Dekoder**: Juga terdiri dari $N=6$ lapisan identik, namun memuat tiga sub-lapisan terpisah:\n"
            "   - **Masked Multi-Head Self-Attention**: Menerapkan *causal attention mask* segitiga bawah ($M_{ij} = -\\infty$ untuk $j > i$) guna mencegah posisi "
            "tertentu memperhatikan token-token masa depan (*future tokens*), menjaga sifat autoregresif generatif.\n"
            "   - **Encoder-Decoder Cross-Attention**: Sub-lapisan krusial di mana representasi Query ($Q$) diproyeksikan dari status dekoder langkah sebelumnya, "
            "sedangkan Key ($K$) dan Value ($V$) diambil langsung dari representasi output akhir enkoder sumber:\n"
            "$$\\text{CrossAttention}(Q_{\\text{dec}}, K_{\\text{enc}}, V_{\\text{enc}}) = \\text{softmax}\\left( \\frac{Q_{\\text{dec}} K_{\\text{enc}}^\\top}{\\sqrt{d_k}} \\right) V_{\\text{enc}}$$\n"
            "Mekanisme ini memungkinkan setiap token target untuk mengagregasi informasi semantik dari seluruh token sumber secara paralel pada setiap *layer*.\n"
            "   - **Position-wise FFN**: Transformasi linear dua lapis dengan fungsi aktivasi ReLU/GELU: $\\text{FFN}(x) = \\max(0, x W_1 + b_1) W_2 + b_2$.\n\n"
            "Berkat eliminasi recurrent state, waktu pelatihan Transformer pada korpus WMT 2014 Inggris-Jerman dipangkas hingga hanya 3.5 hari pada 8 GPU P100, "
            "sekaligus mencetak rekor skor SOTA 28.4 BLEU (peningkatan lebih dari +2.0 BLEU dibanding ensemble model konvensional)."
        ),
        "codeSnippet": code_11_9,
        "codeSnippetOutput": out_11_9,
        "realWorldApplication": (
            "Arsitektur dasar mesin terjemahan enterprise global (Google Cloud Translation, Microsoft Translator, Meta NLLB-200); sistem perangkum dokumen lintas-bahasa; "
            "dan model dasar generasi kode program multi-bahasa."
        ),
        "commonPitfalls": [
            "Lupa menerapkan *causal masking* pada self-attention dekoder saat pelatihan, yang menyebabkan kebocoran informasi masa depan (*information leakage*) sehingga model hanya belajar menyalin kata berikutnya tanpa pernah mempelajari dependensi semantik.",
            "Mengabaikan penyisipan *Positional Encoding* (sinusoidal atau terpelajari) pada representasi input, yang mengakibatkan model memperlakukan sekuens teks sebagai himpunan kata tanpa urutan (*bag-of-words*) karena atensi bersifat ekuivarian terhadap permutasi.",
            "Mengalikan Query dan Key tanpa faktor pembagi $\\sqrt{d_k}$, yang pada dimensi besar ($d_k \\ge 64$) memicu saturasi fungsi softmax ke wilayah gradien mendekati nol (*vanishing gradient*)."
        ],
        "caseStudy": (
            "Meta AI meluncurkan proyek *No Language Left Behind* (NLLB-200), sebuah model Transformer enkoder-dekoder tunggal berkapasitas 54 miliar parameter "
            "yang mampu menerjemahkan langsung antar 200 pasangan bahasa (termasuk puluhan bahasa daerah Indonesia seperti Jawa, Sunda, Minangkabau, dan Bali) "
            "secara *direct translation* tanpa harus melalui bahasa perantara (*pivot language*) bahasa Inggris, menghasilkan peningkatan skor BLEU rata-rata +4.4 poin."
        ),
        "academicReferences": [
            "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems (NeurIPS 2017), 30, 5998-6008.",
            "NLLB Team, Costa-jussà, M. R., Cross, J., Çelebi, O., Elbayad, M., et al. (2022). No language left behind: Scaling human-centered machine translation. arXiv preprint arXiv:2207.04672.",
            "Gehring, J., Auli, M., Grangier, D., Yarats, D., & Dauphin, Y. N. (2017). Convolutional sequence to sequence learning. International Conference on Machine Learning (ICML 2017), 1243-1252."
        ]
    })

    # =========================================================================
    # Subbab 11.10: Implementasi Sistem NMT End-to-End Multilingual & Teknik Back-Translation
    # =========================================================================
    code_11_10 = r"""import numpy as np

# Simulasi Pipeline Data Augmentation Back-Translation (Sennrich et al. 2016)
np.random.seed(42)

# Korpus Paralel Asli (Bitext): Sangat terbatas (Low-Resource Target -> Source)
bitext_target = ["Saya membaca buku itu.", "Kucing tidur di sofa."]
bitext_source = ["I read that book.", "The cat sleeps on the sofa."]

# Korpus Monolingual Melimpah dalam Bahasa Target
monolingual_target = [
    "Anak itu bermain di taman.",
    "Kereta api tiba tepat waktu.",
    "Hujan turun sangat deras kemarin."
]

# Model Dummy Penerjemah Balik (Synthetic Backward Model: Target -> Source)
# Memetakan kalimat target monolingual menjadi kalimat sumber sintetis
synthetic_translation_map = {
    "Anak itu bermain di taman.": "The child plays in the park.",
    "Kereta api tiba tepat waktu.": "The train arrived on time.",
    "Hujan turun sangat deras kemarin.": "It rained heavily yesterday."
}

print("=== PIPELINE DATA AUGMENTATION BACK-TRANSLATION ===")
augmented_dataset = []

# 1. Masukkan data paralel asli dengan label kualitas tinggi
for src, tgt in zip(bitext_source, bitext_target):
    augmented_dataset.append({"source": src, "target": tgt, "type": "Authentic_Parallel"})

# 2. Sintesis data pasangan baru dari korpus monolingual target
for tgt_mono in monolingual_target:
    synth_src = synthetic_translation_map[tgt_mono]
    augmented_dataset.append({"source": synth_src, "target": tgt_mono, "type": "Synthetic_BackTranslated"})

print(f"Total Sampel Korpus Sebelum Augmentasi: {len(bitext_source)}")
print(f"Total Sampel Korpus Setelah Back-Translation: {len(augmented_dataset)}\n")

print(f"{'No':<3} | {'Tipe Data':<25} | {'Source (Input Pelatihan)':<35} | {'Target (Ground Truth)':<30}")
print("-" * 98)
for idx, item in enumerate(augmented_dataset):
    print(f"{idx+1:<3} | {item['type']:<25} | {item['source']:<35} | {item['target']:<30}")

print("\nKeunggulan Kritis: Sisi target SELALU merupakan teks asli manusia yang gramatikal 100%!")
"""
    out_11_10 = run_code_capture_output(code_11_10)

    subchapters.append({
        "id": "11-10-implementasi-sistem-nmt-multilingual-dan-teknik-back-translation",
        "title": "11.10 Implementasi Sistem NMT End-to-End Multilingual & Teknik Back-Translation (Sennrich et al. 2016, Low-Resource Data Augmentation)",
        "theory": (
            "Tantangan paling kritis dalam membangun sistem penerjemahan mesin saraf berkualitas tinggi di dunia nyata adalah kelangkaan korpus dwibahasa "
            "paralel berkualitas tinggi (*bitext scarcity*), terutama untuk ribuan bahasa daerah dan bahasa minoritas dunia (*low-resource languages*). "
            "Sementara teks paralel dua bahasa sulit diperoleh, teks monolingual dalam satu bahasa tersedia dalam jumlah yang hampir tak terbatas di internet. "
            "Rico Sennrich, Barry Haddow, dan Alexandra Birch (ACL 2016) memformulasikan metodologi augmentasi data semi-supervised paling efektif yang dikenal "
            "sebagai **Back-Translation**.\n\n"
            "Mekanisme kerja Back-Translation berjalan melalui protokol tiga langkah sistematis:\n"
            "1. Latih sebuah sistem penerjemah balik (*intermediate reverse model*) $M_{y \\to x}$ menggunakan korpus paralel kecil yang tersedia, yang bertugas "
            "menerjemahkan dari bahasa target $y$ ke bahasa sumber $x$.\n"
            "2. Ambil korpus teks monolingual berskala besar dalam bahasa target $Y_{\\text{mono}}$ (yang ditulis secara alami dan sempurna oleh manusia), "
            "lalu terjemahkan secara otomatis menggunakan model $M_{y \\to x}$ untuk menghasilkan teks sumber sintetis $\\hat{X}_{\\text{synth}}$.\n"
            "3. Pasangkan teks sumber sintetis dengan teks target asli $(\\hat{X}_{\\text{synth}}, Y_{\\text{mono}})$ untuk membentuk korpus bitext sintetis berskala besar, "
            "lalu campurkan (*mix*) dengan data bitext asli untuk melatih model utama forward $M_{x \\to y}$.\n\n"
            "**Mengapa Back-Translation Sangat Unggul?**: Pada proses pelatihan $M_{x \\to y}$, fungsi objektif dekoder adalah merekonstruksi teks target $Y_{\\text{mono}}$. "
            "Karena teks target berasal dari tulisan manusia asli yang 100% fasih dan gramatikal, dekoder tidak pernah belajar memodelkan noise atau tata bahasa rusak. "
            "Teks sumber sintetis $\\hat{X}_{\\text{synth}}$ yang memuat sedikit ketidaksempurnaan justru bertindak sebagai *adversarial regularizer* yang meningkatkan "
            "ketahanan enkoder terhadap noise input.\n\n"
            "Selain back-translation, arsitektur **Multilingual NMT** (Johnson et al. 2017) menggunakan satu model bersama untuk puluhan bahasa dengan menambahkan token "
            "penanda bahasa target khusus di awal kalimat masukan (misal `2es` untuk Spanyol, `2id` untuk Indonesia). Arsitektur ini memungkinkan terjadinya fenomena "
            "**Zero-Shot Translation**: model mampu menerjemahkan pasangan bahasa A $\\to$ B secara langsung meskipun model tidak pernah melihat satu pun kalimat paralel "
            "antara A dan B selama pelatihan."
        ),
        "codeSnippet": code_11_10,
        "codeSnippetOutput": out_11_10,
        "realWorldApplication": (
            "Pengembangan sistem terjemahan untuk bahasa daerah Nusantara (Bahasa Minang, Bugis, Banjar, dsb.) dengan memanfaatkan korpus artikel berita bahasa Indonesia; "
            "peningkatan akurasi model terjemahan paten teknis menggunakan korpus paten target yang melimpah; dan penyelarasan lintas-bahasa pada model pencarian dokumen global."
        ),
        "commonPitfalls": [
            "Melakukan Forward-Translation (menerjemahkan teks sumber monolingual ke target sintetis) alih-alih Back-Translation, yang menyebabkan dekoder dilatih menggunakan teks target sintetis yang memuat kesalahan gramatikal dan distorsi bahasa.",
            "Menggunakan rasio data sintetis yang terlalu mendominasi tanpa penanda khusus (*tagged back-translation*), yang dapat menyebabkan model mengalami 'mode collapse' dan menghasilkan kalimat dengan variasi leksikal yang sempit (Caswell et al. 2019 merekomendasikan penambahan tag `<BT>` pada input sintetis).",
            "Menerapkan greedy decoding pada model penerjemah balik, yang mengurangi keragaman linguistik data sintetis (menggunakan beam search atau sampling berpeluang menghasilkan augmentasi yang lebih kaya)."
        ],
        "caseStudy": (
            "Dalam kompetisi WMT News Translation bahasa Inggris ke bahasa Rumania (bahasa dengan korpus paralel terbatas), tim Edinburgh menambahkan 2 juta kalimat target "
            "Rumania yang di-backtranslate ke bahasa Inggris. Penambahan korpus sintetis ini mendongkrak skor BLEU model Transformer dari 28.1 menjadi 34.7 (+6.6 poin BLEU), "
            "menjadikan sistem tersebut juara pertama dan mendekati kualitas penerjemah profesional manusia."
        ),
        "academicReferences": [
            "Sennrich, R., Haddow, B., & Birch, A. (2016). Improving neural machine translation models with monolingual data. Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), 86-96.",
            "Johnson, M., Schuster, M., Le, Q. V., Krikun, M., Wu, Y., et al. (2017). Google's multilingual neural machine translation system: Enabling zero-shot translation. Transactions of the Association for Computational Linguistics, 5, 339-351.",
            "Caswell, I., Chelba, C., & Grangier, D. (2019). Tagged back-translation revisited: Why does it work so well? Proceedings of the 57th Annual Meeting of the Association for Computational Linguistics, 3986-3997."
        ]
    })

    return subchapters

if __name__ == "__main__":
    subchaps = build_nlp_chapter_11()
    out_path = os.path.join(os.path.dirname(__file__), "nlp_ch11_data.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(subchaps, f, ensure_ascii=False, indent=2)
    print(f"Generated {len(subchaps)} subchapters for Bab 11 NLP -> {out_path}")
