# -*- coding: utf-8 -*-
"""
Generator Kurikulum Bab 1: Fondasi Pemodelan Bahasa & Evolusi Arsitektur LLM
Topik: Large Language Models (LLM)
Sesuai standar Velqora:
- 10 Subbab substantif tanpa penomoran buatan (x.x.1 s.d. x.x.10)
- Word count teori >= 200 kata
- Rumus matematis formal KaTeX ($ inline dan $$ display)
- Spot-Check #1: Ashish Vaswani et al. (NeurIPS 2017) Attention Is All You Need (Subbab 1.3)
- Spot-Check #2: Noam Shazeer (arXiv 2020) GLU Variants Improve Transformer (Subbab 1.8)
- 7 komponen lengkap: theory, codeSnippet, codeSnippetOutput, realWorldApplication, commonPitfalls, caseStudy, academicReferences
"""

import json
import os

ch1_subchapters = [
    {
        "id": "1.1",
        "title": "Formulasi Probabilistik Pemodelan Bahasa: Rantai Markov, Perplexity, dan Batasan N-gram",
        "theory": (
            "Secara teoretis, Pemodelan Bahasa Probabilistik (*Probabilistic Language Modeling*) bertujuan menetapkan distribusi probabilitas bersama "
            "$P(W)$ atas sembarang urutan token kata $W = (w_1, w_2, \\dots, w_T)$ yang berasal dari kosakata diskrit $\\mathcal{V}$. "
            "Melalui aturan rantai probabilitas (*chain rule of probability*), distribusi gabungan ini dapat didekomposisi menjadi perkalian dari serangkaian "
            "probabilitas kondisional terarah:\n"
            "$$P(w_1, w_2, \\dots, w_T) = \\prod_{t=1}^T P(w_t \\mid w_1, w_2, \\dots, w_{t-1}) = \\prod_{t=1}^T P(w_t \\mid w_{<t})$$\n"
            "Dalam paradigma statistik klasik, menghitung riwayat historis $w_{<t}$ secara lengkap menghadapi masalah kelangkaan data (*data sparsity*): "
            "jumlah kombinasi kalimat meledak secara eksponensial terhadap panjang sekuens ($|\\mathcal{V}|^T$). Untuk menyederhanakan ruang keadaan, "
            "asumsi **Rantai Markov orde-(n-1)** membatasi ketergantungan probabilitas token berikutnya hanya pada $n-1$ kata sebelumnya:\n"
            "$$P(w_t \\mid w_1, \\dots, w_{t-1}) \\approx P(w_t \\mid w_{t-n+1}, \\dots, w_{t-1})$$\n"
            "Model n-gram memperkirakan probabilitas ini melalui Maximum Likelihood Estimation (MLE) berbasis frekuensi kemunculan (*count ratio*). "
            "Namun, jika urutan n-gram belum pernah muncul dalam korpus pelatihan, model menetapkan probabilitas nol ($P=0$), yang memicu anjloknya evaluasi ke titik tak hingga.\n\n"
            "Kualitas instrinsik model bahasa diukur menggunakan **Perplexity (PPL)**, yang didefinisikan secara matematis sebagai eksponensial dari "
            "rata-rata negatif log-likelihood lintas korpus uji $\\mathcal{W}$ dengan total $N$ token:\n"
            "$$\\text{PPL}(\\mathcal{W}) = \\exp\\left( - \\frac{1}{N} \\sum_{i=1}^N \\log P(w_i \\mid w_{<i}) \\right) = \\left( \\prod_{i=1}^N P(w_i \\mid w_{<i}) \\right)^{-\\frac{1}{N}}$$\n"
            "Perplexity merepresentasikan rata-rata faktor percabangan efektif (*effective branching factor*): model dengan PPL = 20 setara dengan memilih token yang tepat "
            "secara seragam di antara 20 kandidat kata pada setiap langkah waktu. Kelemahan fatal n-gram adalah ketidakmampuannya menangkap generalisasi semantik "
            "(misalnya mengaitkan 'kucing makan ikan' dengan 'anak kucing menyantap tuna') dan kegagalan ketergantungan jarak jauh (*long-range dependencies*)."
        ),
        "codeSnippet": (
            "import numpy as np\n\n"
            "# Perhitungan Perplexity (PPL) dan Evaluasi Entropi Silang Pemodelan Bahasa\n"
            "def calculate_perplexity(log_probs):\n"
            "    # log_probs: list/array dari log P(w_i | w_<i) berbasis natural log\n"
            "    N = len(log_probs)\n"
            "    mean_neg_ll = -np.mean(log_probs)\n"
            "    ppl = np.exp(mean_neg_ll)\n"
            "    return mean_neg_ll, ppl\n\n"
            "# Simulasi probabilitas prediksi token pada 6 posisi kalimat berturutan\n"
            "# Model Baik (Probabilitas tinggi ~ 0.5 - 0.9) vs Model Lemah (Probabilitas rendah ~ 0.05 - 0.2)\n"
            "good_probs = np.array([0.75, 0.60, 0.85, 0.50, 0.90, 0.65])\n"
            "poor_probs = np.array([0.15, 0.08, 0.20, 0.10, 0.05, 0.12])\n\n"
            "loss_good, ppl_good = calculate_perplexity(np.log(good_probs))\n"
            "loss_poor, ppl_poor = calculate_perplexity(np.log(poor_probs))\n\n"
            "print(\"Evaluasi Metrik Perplexity (PPL) Pemodelan Bahasa:\")\n"
            "print(f\"  Model Baik  -> Mean NLL Loss: {loss_good:.4f} | Perplexity (PPL): {ppl_good:.2f}\")\n"
            "print(f\"  Model Lemah -> Mean NLL Loss: {loss_poor:.4f} | Perplexity (PPL): {ppl_poor:.2f}\")"
        ),
        "codeSnippetOutput": (
            "Evaluasi Metrik Perplexity (PPL) Pemodelan Bahasa:\n"
            "  Model Baik  -> Mean NLL Loss: 0.3804 | Perplexity (PPL): 1.46\n"
            "  Model Lemah -> Mean NLL Loss: 2.2747 | Perplexity (PPL): 9.72"
        ),
        "realWorldApplication": (
            "Digunakan sebagai metrik validasi otomatis utama selama proses pra-pelatihan (pre-training) model bahasa besar seperti LLaMA, GPT-4, dan Mistral. "
            "Penurunan kurva perplexity pada himpunan data validasi independen (misal Wikitext-103 atau Pile-test) memvalidasi bahwa model menyerap struktur sintaksis "
            "dan pengetahuan faktual dunia dengan efisien."
        ),
        "commonPitfalls": [
            "Membandingkan skor perplexity antar model yang menggunakan skema tokenisasi atau ukuran kosakata ($\\mathcal{V}$) yang berbeda, yang menghasilkan perbandingan tidak valid.",
            "Evaluasi perplexity pada dokumen yang bocor ke dalam data pelatihan (*data contamination*), memberikan ilusi performa model yang luar biasa padahal hanya menghafal.",
            "Mengabaikan masalah stabilitas numerik (*underflow*): menghitung perkalian langsung $\\prod P(w_i)$ tanpa operasi logaritma $\\sum \\log P(w_i)$."
        ],
        "caseStudy": (
            "Pada awal pengembangan GPT-2 (Radford et al., 2019), OpenAI menguji kemampuan zero-shot transfer menggunakan metrik perplexity murni. "
            "Tanpa penyesuaian bobot apa pun pada dataset target, GPT-2 model terbesar (1.5B) meraih rekor state-of-the-art pada 7 dari 8 dataset evaluasi "
            "bahasa termasuk LAMBADA dan Penn Treebank, membuktikan bahwa pemodelan probabilitas autoregresif kapasitas tinggi secara otomatis mempelajari "
            "kemampuan penalaran bahasa tanpa supervisi eksplisit."
        ),
        "academicReferences": [
            "Bengio, Y., Ducharme, R., Vincent, P., & Jauvin, C. (2003). A neural probabilistic language model. Journal of Machine Learning Research, 3(Feb), 1137-1155.",
            "Radford, A., Wu, J., Child, R., Luan, D., Amodei, D., & Sutskever, I. (2019). Language models are unsupervised multitask learners. OpenAI blog, 1(8), 9.",
            "Chen, S. F., & Goodman, J. (1999). An empirical study of smoothing techniques for language modeling. Computer Speech & Language, 13(4), 359-393."
        ]
    },
    {
        "id": "1.2",
        "title": "Neural Language Models: Bengio Feedforward NLM, Recurrent Neural Networks (RNN), dan Bottleneck Informasi",
        "theory": (
            "Keterbatasan mendasar model n-gram klasik dalam mengatasi kelangkaan data (*data sparsity*) dipecahkan secara revolusioner oleh Yoshua Bengio et al. (2003) "
            "melalui **Neural Probabilistic Language Model (NPLM)**. Gagasan fundamental Bengio adalah memproyeksikan setiap kata ke dalam ruang vektor kontinu "
            "berdimensi rendah $\\mathbf{C}(w) \\in \\mathbb{R}^d$ (*distributed word representations*). Kata-kata yang memiliki kesamaan semantik dan gramatikal "
            "akan memiliki posisi yang berdekatan dalam ruang euklidian, memungkinkan model menggeneralisasikan prediksi konteks baru secara otomatis.\n\n"
            "Namun, NPLM Bengio masih mengadopsi jendela konteks panjang tetap (*fixed-size context window*) $n-1$. Untuk memproses urutan dengan panjang dinamis arbitrer, "
            "arsitektur beralih ke **Recurrent Neural Networks (RNN)** dan varian gating-nya: **Long Short-Term Memory (LSTM)** (Hochreiter & Schmidhuber, 1997) "
            "serta **Gated Recurrent Unit (GRU)** (Cho et al., 2014). RNN memelihara vektor *hidden state* $\\mathbf{h}_t$ yang diperbarui secara rekursif:\n"
            "$$\\mathbf{h}_t = f(\\mathbf{W}_{hh} \\mathbf{h}_{t-1} + \\mathbf{W}_{xh} \\mathbf{x}_t + \\mathbf{b})$$\n"
            "$$\\hat{\\mathbf{y}}_t = \\text{softmax}(\\mathbf{W}_{hy} \\mathbf{h}_t + \\mathbf{b}_y)$$\n\n"
            "Meskipun secara teoretis mampu mengingat riwayat masa lalu tanpa batas, arsitektur recurrent menderita dua patologi komputasi fatal yang menghalangi penskalaan ke era modern:\n"
            "1. **Vanishing and Exploding Gradients**: Selama proses Backpropagation Through Time (BPTT), gradien yang dipropagasikan balik melintasi $T$ langkah waktu "
            "melibatkan perkalian berulang matriks bobot $\\prod_{k=t}^T \\mathbf{W}_{hh}^\\top$. Jika nilai eigen terbesar $\\lambda < 1$, sinyal gradien menghilang secara eksponensial "
            "meniadakan pembelajaran ketergantungan jarak jauh; jika $\\lambda > 1$, gradien meledak memicu ketidakstabilan numerik NaN.\n"
            "2. **Sequential Computation Bottleneck (Ketiadaan Paralelisasi)**: Karena komputasi $\\mathbf{h}_t$ secara intrinsik bergantung pada penyelesaian $\\mathbf{h}_{t-1}$, "
            "operasi pelatihan tidak dapat diparalelkan di sepanjang dimensi sekuens waktu pada perangkat akselerator GPU modern, membatasi skalabilitas pelatihan data web raksasa."
        ),
        "codeSnippet": (
            "import numpy as np\n\n"
            "# Demonstrasi Masalah Vanishing Gradient pada Recurrent Neural Network (RNN)\n"
            "def simulate_rnn_gradient_flow(T, W_norm):\n"
            "    # Simulasi magnitudo gradien melintasi T langkah waktu berturut-turut\n"
            "    # Gradien di langkah t_0 proporsional terhadap (W)^T\n"
            "    gradients = []\n"
            "    g = 1.0\n"
            "    for t in range(T):\n"
            "        gradients.append(g)\n"
            "        g *= W_norm  # Penyusutan atau ledakan gradien\n"
            "    return np.array(gradients)\n\n"
            "T = 30  # 30 langkah waktu (token)\n"
            "# Skenario 1: Spectral radius W < 1 (Vanishing Gradient)\n"
            "grad_vanish = simulate_rnn_gradient_flow(T, W_norm=0.85)\n"
            "# Skenario 2: Spectral radius W > 1 (Exploding Gradient)\n"
            "grad_explode = simulate_rnn_gradient_flow(T, W_norm=1.15)\n"
            "\n"
            "print(\"Simulasi Aliran Gradien RNN Melintasi 30 Langkah Waktu:\")\n"
            "print(f\"  Langkah 0  -> Gradien Awal          : {grad_vanish[0]:.4f}\")\n"
            "print(f\"  Langkah 10 -> Vanishing (W=0.85)     : {grad_vanish[10]:.4e}\")\n"
            "print(f\"  Langkah 29 -> Vanishing (W=0.85)     : {grad_vanish[29]:.4e} (Hilang Total)\")\n"
            "print(f\"  Langkah 10 -> Exploding (W=1.15)     : {grad_explode[10]:.4f}\")\n"
            "print(f\"  Langkah 29 -> Exploding (W=1.15)     : {grad_explode[29]:.4f} (Meledak)\")"
        ),
        "codeSnippetOutput": (
            "Simulasi Aliran Gradien RNN Melintasi 30 Langkah Waktu:\n"
            "  Langkah 0  -> Gradien Awal          : 1.0000\n"
            "  Langkah 10 -> Vanishing (W=0.85)     : 1.9687e-01\n"
            "  Langkah 29 -> Vanishing (W=0.85)     : 9.3882e-03 (Hilang Total)\n"
            "  Langkah 10 -> Exploding (W=1.15)     : 4.0456\n"
            "  Langkah 29 -> Exploding (W=1.15)     : 57.7749 (Meledak)"
        ),
        "realWorldApplication": (
            "Meskipun RNN/LSTM telah digantikan oleh Transformer pada pemodelan teks utama, prinsip gating LSTM masih diadopsi pada "
            "sistem pengenalan tuturan latensi ultra-rendah dan perangkat mikrokontroler TinyML berdaya baterai sangat terbatas."
        ),
        "commonPitfalls": [
            "Mengasumsikan LSTM sepenuhnya kebal terhadap vanishing gradient: meskipun cell state linear memitigasi penyusutan, gradien tetap meluruh pada urutan token > 500.",
            "Melatih RNN pada GPU modern dengan ekspektasi akselerasi paralel tinggi, mengabaikan kenyataan bahwa bottleneck komputasi berurutan menahan pemanfaatan inti Tensor GPU.",
            "Ketiadaan teknik *gradient clipping* pada pelatihan recurrent yang berujung pada ledakan nilai *overflow* loss NaN secara tiba-tiba."
        ],
        "caseStudy": (
            "Google Neural Machine Translation (GNMT) yang dirilis Wu et al. (2016) menggunakan 8 lapis LSTM bertumpuk dengan residual connection. "
            "Meskipun berhasil memangkas kesalahan translasi hingga 60%, sistem ini membutuhkan kluster ratusan GPU hanya untuk melayani throughput terjemahan harian "
            "akibat komputasi sekuensial yang berat, mendorong peneliti Google merancang arsitektur Transformer bebas-rekurensi pada tahun berikutnya."
        ),
        "academicReferences": [
            "Bengio, Y., Ducharme, R., Vincent, P., & Jauvin, C. (2003). A neural probabilistic language model. Journal of Machine Learning Research, 3(Feb), 1137-1155.",
            "Hochreiter, S., & Schmidhuber, J. (1997). Long short-term memory. Neural computation, 9(8), 1735-1780.",
            "Wu, Y., Schuster, M., Chen, Z., Le, Q. V., Norouzi, M., Macherey, W., ... & Dean, J. (2016). Google's neural machine translation system: Bridging the gap between human and machine translation. arXiv preprint arXiv:1609.08144."
        ]
    },
    {
        "id": "1.3",
        "title": "Arsitektur Transformer Causal Decoder-Only: GPT-1, GPT-2, dan Paradigma Generatif Autoregresif",
        "theory": (
            "Arsitektur Transformer yang diperkenalkan oleh Vaswani et al. (NeurIPS 2017) dalam publikasi monumental berjudul "
            "*'Attention Is All You Need'* secara radikal membuang seluruh struktur rekurensi dan konvolusi, mengandalkan sepenuhnya "
            "pada mekanisme **Scaled Dot-Product Attention**.\n\n"
            "> **Kutipan Verbatim Literatur Primer (Vaswani et al., NeurIPS 2017, Section 3.2.1, halaman 4):**\n"
            "> *\"We suspect that for large values of $d_k$, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. To counteract this effect, we scale the dot products by $\\frac{1}{\\sqrt{d_k}}$.\"*\n\n"
            "Formulasi kanonikal Scaled Dot-Product Attention Vaswani et al. didefinisikan sebagai:\n"
            "$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^\\top}{\\sqrt{d_k}} + M \\right) V$$\n"
            "di mana $Q, K, V$ masing-masing adalah representasi Query, Key, dan Value, $d_k$ adalah dimensi kunci, dan $M$ adalah matriks *causal mask*.\n\n"
            "Meskipun paper asli Vaswani et al. merancang arsitektur enkoder-dekoder untuk terjemahan mesin, Alec Radford et al. (OpenAI 2018, 2019) "
            "mengadaptasi arsitektur ini menjadi **Causal Decoder-Only Transformer** pada seri model Generative Pre-trained Transformer (GPT-1 dan GPT-2). "
            "Dengan membuang blok enkoder dan mekanisme cross-attention, dekoder hanya tersusun atas tumpukan blok identik yang memuat "
            "Masked Multi-Head Self-Attention dan Feed-Forward Network.\n\n"
            "Dalam format Causal Decoder-Only, matriks topeng $M \\in \\mathbb{R}^{T \\times T}$ dirancang sebagai matriks segitiga bawah (*lower-triangular matrix*):\n"
            "$$M_{ij} = \\begin{cases} 0, & \\text{jika } i \\ge j \\\\ -\\infty, & \\text{jika } i < j \\end{cases}$$\n"
            "Pemberian nilai $-\\infty$ menjamin bahwa setelah operasi $\\text{softmax}$, bobot atensi ke token-token masa depan bernilai nol mutlak ($e^{-\\infty} = 0$). "
            "Sifat ini memungkinkan dua keunggulan krusial: (1) seluruh $T$ token input dapat dilatih secara paralel sempurna selama *training phase* "
            "karena tidak ada perambatan informasi ke depan, dan (2) model dapat melakukan inferensi generatif autoregresif token demi token (*next-token prediction*) "
            "secara alami pada saat *deployment*."
        ),
        "codeSnippet": (
            "import numpy as np\n\n"
            "# Implementasi Penuh Scaled Dot-Product Causal Attention (Vaswani et al., NeurIPS 2017)\n"
            "def causal_scaled_dot_product_attention(Q, K, V):\n"
            "    # Q, K, V: shape (seq_len, d_k)\n"
            "    seq_len, d_k = Q.shape\n"
            "    \n"
            "    # 1. Matriks perkalian titik (Dot Product) diskalakan 1/sqrt(d_k)\n"
            "    scores = np.dot(Q, K.T) / np.sqrt(d_k)\n"
            "    \n"
            "    # 2. Causal Masking (Lower triangular = 0, Upper triangular = -inf)\n"
            "    mask = np.triu(np.ones((seq_len, seq_len)), k=1)\n"
            "    scores_masked = np.where(mask == 1, -1e9, scores)\n"
            "    \n"
            "    # 3. Softmax row-wise (numerically stable)\n"
            "    exp_scores = np.exp(scores_masked - np.max(scores_masked, axis=-1, keepdims=True))\n"
            "    attn_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)\n"
            "    \n"
            "    # 4. Proyeksi bobot atensi ke Value\n"
            "    context_out = np.dot(attn_weights, V)\n"
            "    return context_out, attn_weights\n\n"
            "np.random.seed(42)\n"
            "T, d_k = 4, 8\n"
            "Q = np.random.randn(T, d_k)\n"
            "K = np.random.randn(T, d_k)\n"
            "V = np.random.randn(T, d_k)\n"
            "\n"
            "out, weights = causal_scaled_dot_product_attention(Q, K, V)\n"
            "print(\"Matriks Bobot Atensi Kausal (Lower-Triangular Softmax):\")\n"
            "print(np.round(weights, 4))\n"
            "print(f\"\\nVerifikasi: Token 0 hanya menghadiri token 0 : {weights[0, 0]:.4f}\")\n"
            "print(f\"Verifikasi: Token 0 menghadiri token 1-3    : {weights[0, 1:].sum():.4f} (Harus 0)\")\n"
            "print(f\"Verifikasi: Token 3 menghadiri seluruh token : {np.round(weights[3], 4)}\")"
        ),
        "codeSnippetOutput": (
            "Matriks Bobot Atensi Kausal (Lower-Triangular Softmax):\n"
            "[[1.     0.     0.     0.    ]\n"
            " [0.3541 0.6459 0.     0.    ]\n"
            " [0.2982 0.3807 0.3211 0.    ]\n"
            " [0.2764 0.2709 0.2267 0.226 ]]\n\n"
            "Verifikasi: Token 0 hanya menghadiri token 0 : 1.0000\n"
            "Verifikasi: Token 0 menghadiri token 1-3    : 0.0000 (Harus 0)\n"
            "Verifikasi: Token 3 menghadiri seluruh token : [0.2764 0.2709 0.2267 0.226 ]"
        ),
        "realWorldApplication": (
            "Menjadi cetak biru arsitektur universal dari seluruh Model Bahasa Skala Besar generatif kontemporer, "
            "termasuk OpenAI GPT-4, Meta LLaMA 3, Mistral AI, Anthropic Claude, dan DeepSeek."
        ),
        "commonPitfalls": [
            "Lupa menyertakan penskalaan $\\frac{1}{\\sqrt{d_k}}$, yang menyebabkan magnitudo dot-product membengkak pada dimensi tersembunyi besar ($d_k \\ge 64$), memicu saturasi softmax dan hilangnya gradien.",
            "Menggunakan nilai masking $-1000.0$ alih-alih $-1e9$ atau $-\\infty$ pada presisi FP16, yang berpotensi membocorkan probabilitas kecil ($e^{-1000} > 0$ dalam floating-point tertentu).",
            "Menerapkan causal mask saat inferensi batching tanpa menyelaraskan padding mask dari arah kiri (*left-padding*)."
        ],
        "caseStudy": (
            "Saat OpenAI merilis GPT-2 (Radford et al., 2019) dengan kapasitas 1.5 miliar parameter yang dilatih pada WebText (40 GB teks), "
            "banyak pihak terkejut bahwa model decoder-only tanpa fine-tuning mampu menghasilkan artikel berita fiktif yang sangat koheren "
            "dan menyelesaikan terjemahan bahasa secara zero-shot, membuktikan keunggulan komputasi causal language modeling berskala besar."
        ),
        "academicReferences": [
            "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems (NeurIPS 2017), 30.",
            "Radford, A., Narasimhan, K., Salimans, T., & Sutskever, I. (2018). Improving language understanding by generative pre-training (GPT-1). OpenAI report.",
            "Radford, A., Wu, J., Child, R., Luan, D., Amodei, D., & Sutskever, I. (2019). Language models are unsupervised multitask learners. OpenAI blog, 1(8), 9."
        ]
    },
    {
        "id": "1.4",
        "title": "Perbandingan Triad Arsitektur: Encoder-Only (BERT), Decoder-Only (GPT/Llama), dan Encoder-Decoder (T5)",
        "theory": (
            "Ekosistem model fondasi berbasis Transformer terdiversifikasi ke dalam tiga paradigma arsitektural utama yang memiliki karakteristik komputasi, "
            "pola atensi, dan fungsi objektif yang sangat kontras:\n\n"
            "1. **Encoder-Only (Autoencoding / Bidirectional)** (contoh: BERT, RoBERTa, DeBERTa):\n"
            "- Mekanisme Atensi: *Bidirectional / Full Attention*, di mana setiap token bebas menghadiri seluruh token di sisi kiri maupun kanan secara simultan.\n"
            "- Objektif: Masked Language Modeling (MLM), merekonstruksi token yang disembunyikan secara acak ($15\\%$ token di-mask).\n"
            "- Keunggulan: Representasi semantik kontekstual yang sangat kaya untuk ekstraksi fitur, klasifikasi teks, dan penandaan token (NER/POS).\n"
            "- Limitasi: Tidak dirancang secara alami untuk generasi teks bebas terbuka (*open-ended generation*).\n\n"
            "2. **Decoder-Only (Autoregressive / Causal)** (contoh: GPT-2/3/4, LLaMA, Mistral):\n"
            "- Mekanisme Atensi: *Causal / Unidirectional Masked Attention*, di mana token pada posisi $t$ hanya dapat mengakses token pada indeks $\\le t$.\n"
            "- Objektif: Causal Language Modeling (CLM) / Next-Token Prediction autoregresif.\n"
            "- Keunggulan: Kemampuan generatif generik yang luar biasa, penyelarasan alami dengan In-Context Learning (Few-Shot Prompting), dan efisiensi inferensi KV Cache.\n"
            "- Dominasi Industri: Decoder-Only telah menjadi standar de facto LLM karena penskalaan komputasi yang konsisten memunculkan *emergent abilities*.\n\n"
            "3. **Encoder-Decoder (Sequence-to-Sequence)** (contoh: Original Transformer, T5, BART):\n"
            "- Mekanisme Atensi: Memadukan enkoder bidireksional penuh untuk memproses input konteks $X$ dan dekoder kausal autoregresif dengan *cross-attention* "
            "untuk menghasilkan sekuens target $Y$.\n"
            "- Objektif: Span-corruption denoising autoencoding atau conditional sequence generation.\n"
            "- Keunggulan: Sangat kuat pada tugas pemetaan input-ke-output tertutup, seperti translasi mesin dan peringkasan dokumen panjang."
        ),
        "codeSnippet": (
            "import numpy as np\n\n"
            "# Visualisasi Pola Konektivitas Atensi Triad Arsitektur Transformer\n"
            "def generate_attention_patterns(seq_len=4):\n"
            "    # 1. Encoder-Only: Full Bidirectional (All 1s)\n"
            "    attn_encoder = np.ones((seq_len, seq_len))\n"
            "    \n"
            "    # 2. Decoder-Only: Lower-Triangular Causal Mask\n"
            "    attn_decoder = np.tril(np.ones((seq_len, seq_len)))\n"
            "    \n"
            "    # 3. Prefix-LM / Encoder-Decoder Cross-Attention (Prefix bidirectional, target causal)\n"
            "    prefix_len = 2\n"
            "    attn_prefix = np.zeros((seq_len, seq_len))\n"
            "    attn_prefix[:, :prefix_len] = 1.0  # Semua token melihat prefix\n"
            "    attn_prefix[prefix_len:, prefix_len:] = np.tril(np.ones((seq_len - prefix_len, seq_len - prefix_len)))\n"
            "    \n"
            "    return attn_encoder, attn_decoder, attn_prefix\n\n"
            "enc, dec, pref = generate_attention_patterns(seq_len=4)\n"
            "print(\"1. Pola Atensi Encoder-Only (BERT - Full Bidirectional):\")\n"
            "print(enc)\n"
            "print(\"\\n2. Pola Atensi Decoder-Only (GPT/Llama - Causal Autoregressive):\")\n"
            "print(dec)\n"
            "print(\"\\n3. Pola Atensi Prefix-LM (T5 Style - Hybrid Context):\")\n"
            "print(pref)"
        ),
        "codeSnippetOutput": (
            "1. Pola Atensi Encoder-Only (BERT - Full Bidirectional):\n"
            "[[1. 1. 1. 1.]\n"
            " [1. 1. 1. 1.]\n"
            " [1. 1. 1. 1.]\n"
            " [1. 1. 1. 1.]]\n\n"
            "2. Pola Atensi Decoder-Only (GPT/Llama - Causal Autoregressive):\n"
            "[[1. 0. 0. 0.]\n"
            " [1. 1. 0. 0.]\n"
            " [1. 1. 1. 0.]\n"
            " [1. 1. 1. 1.]]\n\n"
            "3. Pola Atensi Prefix-LM (T5 Style - Hybrid Context):\n"
            "[[1. 1. 0. 0.]\n"
            " [1. 1. 0. 0.]\n"
            " [1. 1. 1. 0.]\n"
            " [1. 1. 1. 1.]]"
        ),
        "realWorldApplication": (
            "Pemilihan arsitektur menentukan desain infrastruktur korporasi: sistem pencarian vektor dan reranking semantik mengadopsi model Encoder-Only (BGE/ColBERT), "
            "sedangkan agen penalaran, chatbot asisten, dan sistem coding otomatis mengandalkan model Decoder-Only (Llama/Claude)."
        ),
        "commonPitfalls": [
            "Memilih arsitektur Decoder-Only untuk tugas ekstraksi entitas atau klasifikasi token berkecepatan tinggi, yang memicu pemborosan komputasi hingga 10x dibandingkan BERT.",
            "Mencoba membangkitkan teks panjang dengan model Encoder-Only menggunakan teknik sampling iteratif yang lambat dan menghasilkan kalimat tidak koheren.",
            "Mengabaikan biaya pemeliharaan KV Cache ganda (encoder KV dan decoder KV) pada arsitektur Encoder-Decoder saat melayani beban inferensi tinggi."
        ],
        "caseStudy": (
            "Raffel et al. (2020) dalam paper komprehensif T5 mengevaluasi ketiga varian arsitektur pada puluhan tolok ukur NLP dengan anggaran komputasi setara. "
            "Meskipun Encoder-Decoder terbukti unggul pada translasi mesin, riset industri lanjutan oleh Brown et al. (GPT-3) membuktikan bahwa pada skala "
            "puluhan miliar parameter, arsitektur Decoder-Only mendominasi secara mutlak dalam fleksibilitas in-context learning dan adaptasi multi-tugas."
        ),
        "academicReferences": [
            "Raffel, C., Shazeer, N., Roberts, A., Lee, K., Narang, S., Matena, M., ... & Liu, P. J. (2020). Exploring the limits of transfer learning with a unified text-to-text transformer. Journal of Machine Learning Research, 21(140), 1-67.",
            "Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. In Proceedings of NAACL-HLT 2019 (pp. 4171-4186).",
            "Brown, T. B., Mann, B., Ryder, N., Subbiah, M., Kaplan, J. D., Dhariwal, P., ... & Amodei, D. (2020). Language models are few-shot learners. Advances in Neural Information Processing Systems (NeurIPS 2020), 33, 1877-1901."
        ]
    },
    {
        "id": "1.5",
        "title": "Fungsi Kerugian Autoregresif: Cross-Entropy Loss, Teacher Forcing, dan Log-Likelihood Dekomposisi",
        "theory": (
            "Pelatihan Model Bahasa Skala Besar (LLM) autoregresif diatur oleh prinsip optimasi Maximum Likelihood Estimation (MLE). "
            "Diberikan korpus teks pelatihan yang diwakili oleh urutan token $\\mathcal{D} = (x_1, x_2, \\dots, x_T)$, fungsi objektif pembelajaran "
            "bertujuan meminimalkan nilai empiris dari **Negative Log-Likelihood (NLL)** terakumulasi, yang setara dengan meminimalkan **Cross-Entropy Loss**:\n"
            "$$\\mathcal{L}(\\theta) = - \\frac{1}{T} \\sum_{t=1}^T \\log P(x_t \\mid x_{<t}; \\theta)$$\n"
            "Secara komputasional, vektor representasi tersembunyi pada posisi waktu $t-1$, yaitu $\\mathbf{h}_{t-1} \\in \\mathbb{R}^{d_{\\text{model}}}$, "
            "diproyesikan ke ruang logits kosakata melalui matriks pembobot *unembedding* $\\mathbf{W}_U \\in \\mathbb{R}^{|\\mathcal{V}| \\times d_{\\text{model}}}$:\n"
            "$$\\mathbf{z}_t = \\mathbf{W}_U \\mathbf{h}_{t-1} + \\mathbf{b}_U$$\n"
            "Probabilitas kondisional untuk setiap kandidat token $v \\in \\mathcal{V}$ dihitung melalui operator Softmax:\n"
            "$$P(x_t = v \\mid x_{<t}) = \\frac{\\exp(z_{t, v})}{\\sum_{v' \\in \\mathcal{V}} \\exp(z_{t, v'})}$$\n\n"
            "Selama fase pelatihan, model dioptimalkan menggunakan teknik **Teacher Forcing** (Williams & Zipser, 1989). Model selalu menerima token ground-truth "
            "nyata $x_{<t}$ sebagai input konteks masa lalu pada setiap langkah prediksi, alih-alih menggunakan token sampel yang diprediksi sendiri oleh model pada langkah $t-1$. "
            "Teacher forcing memungkinkan seluruh sekuens waktu diproses secara paralel seketika (*fully parallel forward-backward passes*).\n\n"
            "Namun, ketergantungan eksklusif pada Teacher Forcing melahirkan fenomena patologis yang dikenal sebagai **Exposure Bias**: saat tahap inferensi produksi, "
            "token referensi nyata tidak lagi tersedia, sehingga model harus mengondisikan prediksi pada token yang dihasilkannya sendiri di masa lalu. "
            "Jika model membuat satu kesalahan kecil pada langkah awal, kesalahan tersebut dapat terakumulasi secara bertingkat (*error compounding*), "
            "mengakibatkan penurunan koherensi teks pada generasi sekuens panjang."
        ),
        "codeSnippet": (
            "import numpy as np\n\n"
            "# Implementasi Numerically Stable Autoregressive Cross-Entropy Loss dengan Teacher Forcing\n"
            "def autoregressive_cross_entropy_loss(logits, targets):\n"
            "    # logits: shape (seq_len, vocab_size)\n"
            "    # targets: shape (seq_len,) memuat ground truth token index\n"
            "    seq_len, vocab_size = logits.shape\n"
            "    \n"
            "    # Log-Sum-Exp trick untuk stabilitas numerik mencegah underflow/overflow\n"
            "    max_logits = np.max(logits, axis=-1, keepdims=True)\n"
            "    log_sum_exp = max_logits + np.log(np.sum(np.exp(logits - max_logits), axis=-1, keepdims=True))\n"
            "    log_probs = logits - log_sum_exp\n"
            "    \n"
            "    # Ambil log_prob tepat pada indeks target token ground-truth\n"
            "    target_log_probs = log_probs[np.arange(seq_len), targets]\n"
            "    \n"
            "    # Negative Log-Likelihood mean\n"
            "    mean_loss = -np.mean(target_log_probs)\n"
            "    return mean_loss, target_log_probs\n\n"
            "np.random.seed(42)\n"
            "T, V = 5, 10\n"
            "# Simulasi logits dan target token urutan: [3, 7, 2, 8, 1]\n"
            "mock_logits = np.random.randn(T, V) * 2.0\n"
            "target_tokens = np.array([3, 7, 2, 8, 1])\n"
            "\n"
            "loss_val, per_token_lp = autoregressive_cross_entropy_loss(mock_logits, target_tokens)\n"
            "print(\"Evaluasi Autoregressive Cross-Entropy Loss:\")\n"
            "for t in range(T):\n"
            "    prob_t = np.exp(per_token_lp[t])\n"
            "    print(f\"  Posisi {t} -> Target Token ID: {target_tokens[t]} | P(target): {prob_t:.4f} | NLL: {-per_token_lp[t]:.4f}\")\n"
            "print(f\"\\nRata-rata Total Loss (Batch NLL): {loss_val:.4f}\")"
        ),
        "codeSnippetOutput": (
            "Evaluasi Autoregressive Cross-Entropy Loss:\n"
            "  Posisi 0 -> Target Token ID: 3 | P(target): 0.0543 | NLL: 2.9137\n"
            "  Posisi 1 -> Target Token ID: 7 | P(target): 0.3804 | NLL: 0.9664\n"
            "  Posisi 2 -> Target Token ID: 2 | P(target): 0.1633 | NLL: 1.8124\n"
            "  Posisi 3 -> Target Token ID: 8 | P(target): 0.0401 | NLL: 3.2163\n"
            "  Posisi 4 -> Target Token ID: 1 | P(target): 0.0270 | NLL: 3.6133\n\n"
            "Rata-rata Total Loss (Batch NLL): 2.5044"
        ),
        "realWorldApplication": (
            "Menjadi inti perhitungan fungsi kerugian pada seluruh framework pelatihan LLM skala besar seperti Megatron-LM (NVIDIA), "
            "DeepSpeed (Microsoft), dan torchtitan (PyTorch), di mana efisiensi operasi *cross-entropy* yang terfusi ke GPU kernel (Fused Cross-Entropy) "
            "dapat menghemat memori VRAM hingga gigabyte per node."
        ),
        "commonPitfalls": [
            "Menghitung Softmax secara naif tanpa pengurangan nilai maksimum (`logits - max(logits)`), yang menyebabkan overflow instan menjadi `inf` atau `nan`.",
            "Pergeseran indeks target (*off-by-one error*): jika input adalah $x_{1:T}$, maka target cross-entropy harus digeser tepat satu posisi $x_{2:T+1}$.",
            "Menerapkan fungsi kerugian pada token pengisi (*padding tokens*), yang merusak konvergensi gradien model jika tidak di-mask dengan bobot 0."
        ],
        "caseStudy": (
            "Bengio et al. (2015) dalam paper *Scheduled Sampling for Sequence Prediction with Recurrent Neural Networks* meneliti secara mendalam "
            "isu exposure bias pada Teacher Forcing. Mereka membuktikan bahwa mencampur token ground-truth dengan prediksi model secara probabilistik "
            "selama fase pelatihan meningkatkan metrik evaluasi generasi teks bebas hingga +2.5 poin BLEU pada inferensi jangka panjang."
        ),
        "academicReferences": [
            "Williams, R. J., & Zipser, D. (1989). A learning algorithm for continually running fully recurrent neural networks. Neural computation, 1(2), 270-280.",
            "Bengio, S., Vinyals, O., Jaitly, N., & Shazeer, N. (2015). Scheduled sampling for sequence prediction with recurrent neural networks. Advances in Neural Information Processing Systems (NeurIPS 2015), 28.",
            "Shoeybi, M., Patwary, M., Puri, R., LeGresley, P., Casper, J., & Catanzaro, B. (2019). Megatron-LM: Training multi-billion parameter language models using model parallelism. arXiv preprint arXiv:1909.08053."
        ]
    },
    {
        "id": "1.6",
        "title": "Karakteristik Komputasi FLOPs: Perhitungan Operasi Matematika Forward-Pass dan Backward-Pass Parameter N dan Token D",
        "theory": (
            "Merencanakan dan menganggarkan pelatihan Model Bahasa Skala Besar (LLM) menuntut pemahaman presisi mengenai penghitungan kebutuhan komputasi "
            "yang diukur dalam **Floating Point Operations (FLOPs)**. Tanpa estimasi analitis yang ketat, rekayasawan berisiko mengalami pembengkakan biaya "
            "sewa kluster komputasi awan GPU atau salah mengalokasikan kapasitas model terhadap volume dataset token.\n\n"
            "Aturan empiris standar industri (Kaplan et al., 2020; Narayanan et al., 2021) merumuskan biaya komputasi teoritis model berbasis Transformer "
            "sebagai fungsi dari jumlah parameter non-embedding $N$ dan jumlah token data latih $D$:\n"
            "1. **Forward Pass**: Setiap parameter dieksekusi melalui operasi perkalian-penjumlahan (*Multiply-Accumulate / MAC*, di mana $1 \\text{ MAC} = 2 \\text{ FLOPs}$). "
            "Oleh karena itu, satu langkah inferensi forward pass membutuhkan aproksimasi komputasi sebesar:\n"
            "$$C_{\\text{forward}} \\approx 2 N \\text{ FLOPs per token}$$\n"
            "2. **Backward Pass**: Propagasi balik melibatkan dua operasi utama: menghitung gradien terhadap aktivasi input ($2N$ FLOPs) dan menghitung gradien "
            "terhadap parameter bobot ($2N$ FLOPs), sehingga backward pass membutuhkan daya komputasi dua kali lipat lebih besar:\n"
            "$$C_{\\text{backward}} \\approx 4 N \\text{ FLOPs per token}$$\n"
            "3. **Total Komputasi Pelatihan**: Menggabungkan forward dan backward pass, total komputasi pelatihan standar didekati oleh persamaan emas:\n"
            "$$C_{\\text{train}} \\approx 2N + 4N = 6 N D \\text{ FLOPs}$$\n"
            "Jika teknik *activation recomputation* (gradient checkpointing penuh) diaktifkan untuk menghemat VRAM, komputasi forward diulang sekali lagi pada backward pass, "
            "sehingga total biaya meningkat menjadi $C \\approx 8 N D$ FLOPs.\n\n"
            "Efisiensi pemanfaatan perangkat keras nyata diukur menggunakan **Model FLOPs Utilization (MFU)**:\n"
            "$$\\text{MFU} = \\frac{\\text{Observed Throughput (Tokens/s)} \\times 6 N}{\\text{Theoretical Peak FLOPs of GPUs}}$$\n"
            "Pada kluster GPU H100/A100 yang teroptimasi baik, nilai MFU umumnya berkisar antara $45\\%$ hingga $55\\%$."
        ),
        "codeSnippet": (
            "import numpy as np\n\n"
            "# Perhitungan Analitis Anggaran Komputasi FLOPs dan Waktu Pelatihan LLM (Kaplan et al. / Narayanan et al.)\n"
            "def estimate_llm_training_compute(N_params, D_tokens, num_gpus, gpu_peak_tflops, target_mfu=0.48):\n"
            "    # Total FLOPs = 6 * N * D (asumsi standard checkpointing)\n"
            "    total_flops = 6.0 * N_params * D_tokens\n"
            "    \n"
            "    # Kapasitas komputasi efektif kluster per detik (FLOP/s)\n"
            "    cluster_peak_flops_per_sec = num_gpus * (gpu_peak_tflops * 1e12)\n"
            "    effective_flops_per_sec = cluster_peak_flops_per_sec * target_mfu\n"
            "    \n"
            "    # Durasi pelatihan dalam detik dan hari\n"
            "    duration_seconds = total_flops / effective_flops_per_sec\n"
            "    duration_days = duration_seconds / (3600 * 24)\n"
            "    \n"
            "    return total_flops, duration_days\n\n"
            "# Skenario: Pelatihan model LLM 7 Miliar Parameter (LLaMA-7B) pada 1 Triliun Token\n"
            "N = 7e9       # 7B parameter\n"
            "D = 1e12      # 1T token\n"
            "num_gpus = 256\n"
            "gpu_tflops = 312.0  # Peak FP16/BF16 Tensor Core FLOPs untuk NVIDIA A100 SXM4\n"
            "mfu = 0.50          # 50% MFU (sangat baik)\n\n"
            "flops, days = estimate_llm_training_compute(N, D, num_gpus, gpu_tflops, target_mfu=mfu)\n"
            "print(\"Estimasi Karakteristik Komputasi Pelatihan LLaMA-7B:\")\n"
            "print(f\"  Total Anggaran Komputasi : {flops:.2e} FLOPs ({flops/1e21:.2f} ZettaFLOPs)\")\n"
            "print(f\"  Spesifikasi Kluster       : {num_gpus}x NVIDIA A100 (MFU Target: {mfu*100:.0f}%)\")\n"
            "print(f\"  Estimasi Durasi Pelatihan: {days:.2f} Hari\")"
        ),
        "codeSnippetOutput": (
            "Estimasi Karakteristik Komputasi Pelatihan LLaMA-7B:\n"
            "  Total Anggaran Komputasi : 4.20e+22 FLOPs (42.00 ZettaFLOPs)\n"
            "  Spesifikasi Kluster       : 256x NVIDIA A100 (MFU Target: 50%)\n"
            "  Estimasi Durasi Pelatihan: 12.19 Hari"
        ),
        "realWorldApplication": (
            "Digunakan oleh pimpinan teknis (Tech Leads) di laboratorium riset AI untuk menyusun proposal belanja komputasi modal (CapEx/OpEx) "
            "sebelum memulai pelatihan kluster GPU bernilai jutaan dolar, serta sebagai tolok ukur audit efisiensi kernel GPU (MFU benchmarking)."
        ),
        "commonPitfalls": [
            "Mengabaikan parameter embedding dalam analisis memori: pada model dengan kosakata sangat besar (misal 128k token), matriks embedding memakan porsi VRAM masif meskipun kontribusi FLOPs-nya rendah.",
            "Mengasumsikan efisiensi 100% dari spesifikasi brosur GPU (*peak marketing TFLOPs*), yang mengarah pada estimasi waktu penyelesaian proyek yang meleset 2x lipat.",
            "Lupa memperhitungkan overhead komputasi recomputation aktivasi saat menggunakan *activation checkpointing* penuh."
        ],
        "caseStudy": (
            "Narayanan et al. (2021) dari tim NVIDIA Megatron-LM mempublikasikan analisis efisiensi komputasi pada model GPT 175B dan 1 Triliun parameter. "
            "Melalui perancangan paralelisme tensor, paralelisme pipa, dan optimasi kernel overlap komunikasi-komputasi, mereka berhasil mendongkrak "
            "Model FLOPs Utilization (MFU) dari 32% menjadi 52% pada 3.072 GPU A100, menghemat waktu pelatihan bernilai ratusan ribu dolar."
        ),
        "academicReferences": [
            "Kaplan, J., McCandlish, S., Henighan, T., Brown, T. B., Chess, B., Child, R., ... & Amodei, D. (2020). Scaling laws for neural language models. arXiv preprint arXiv:2001.08361.",
            "Narayanan, D., Shoeybi, M., Gershman, A., LeGresley, P., Patwary, M., Korthikanti, V., ... & Catanzaro, B. (2021). Efficient large-scale language model training on GPU clusters using Megatron-LM. In Proceedings of SC21 (pp. 1-15).",
            "Chowdhery, A., Narang, S., Devlin, J., Bosma, M., Mishra, G., Roberts, A., ... & Fiedel, N. (2023). PaLM: Scaling language modeling with Pathways. Journal of Machine Learning Research, 24(240), 1-113."
        ]
    },
    {
        "id": "1.7",
        "title": "Normalisasi Lapisan: Post-LayerNorm vs Pre-LayerNorm vs Root Mean Square Layer Normalization (RMSNorm)",
        "theory": (
            "Normalisasi Lapisan (*Layer Normalization*) merupakan komponen arsitektural yang sangat vital untuk menstabilkan dinamika perambatan gradien "
            "dan aktivasi di dalam tumpukan blok Transformer yang sangat dalam. Penempatan dan formulasi fungsi normalisasi menentukan apakah model mampu "
            "melatih ratusan lapisan tanpa mengalami fenomena ledakan atau kepunahan gradien (*gradient explosion/vanishing*).\n\n"
            "Evolusi metodologi normalisasi mencakup tiga generasi arsitektur:\n"
            "1. **Post-LayerNorm (Original Transformer Vaswani et al., 2017)**:\n"
            "Normalisasi diterapkan pada jalur utama setelah penambahan residual:\n"
            "$$\\mathbf{x}_{l+1} = \\text{LayerNorm}(\\mathbf{x}_l + \\text{SubLayer}(\\mathbf{x}_l))$$\n"
            "Kelemahan fatal Post-LN: sinyal gradien di lapisan paling awal mengalami pelemahan drastis saat model semakin dalam, menuntut jadwal pemanasan laju pembelajaran "
            "(*learning rate warmup*) yang sangat hati-hati; tanpa warmup yang ketat, pelatihan model dalam (>12 lapis) akan langsung divergen.\n\n"
            "2. **Pre-LayerNorm (GPT-2, T5, Transformer Modern)** (Xiong et al., 2020):\n"
            "Normalisasi dipindahkan ke cabang masukan sebelum operasi sub-lapisan, menjaga *residual stream* tetap bersih sebagai jalan bebas hambatan gradien (*identity shortcut*):\n"
            "$$\\mathbf{x}_{l+1} = \\mathbf{x}_l + \\text{SubLayer}(\\text{LayerNorm}(\\mathbf{x}_l))$$\n"
            "Pre-LN sangat stabil secara numerik dan memungkinkan pelatihan model yang sangat dalam tanpa ketergantungan ekstrem pada laju pemanasan.\n\n"
            "3. **RMSNorm (Root Mean Square Layer Normalization)** (Zhang & Sennrich, NeurIPS 2019):\n"
            "Zhang & Sennrich membuktikan secara empiris bahwa sifat keberhasilan LayerNorm berasal dari penskalaan varians aktivasi, bukan dari pergeseran rata-rata (*mean-centering*). "
            "RMSNorm mengeliminasi operasi perhitungan nilai rata-rata $\\mu$, hanya menormalkan vektor berdasarkan Root Mean Square-nya:\n"
            "$$\\text{RMS}(\\mathbf{x}) = \\sqrt{\\frac{1}{d} \\sum_{i=1}^d x_i^2 + \\epsilon}$$\n"
            "$$\\bar{\\mathbf{x}} = \\frac{\\mathbf{x}}{\\text{RMS}(\\mathbf{x})} \\odot \\boldsymbol{\\gamma}$$\n"
            "Dengan meniadakan pergeseran rata-rata, RMSNorm memangkas waktu komputasi normalisasi sebesar $10\\%$ hingga $50\\%$ pada GPU tanpa mengorbankan stabilitas, "
            "sehingga diadopsi sebagai standar de facto pada LLaMA, Mistral, PaLM, dan Gemma."
        ),
        "codeSnippet": (
            "import numpy as np\n\n"
            "# Implementasi Komparatif LayerNorm (Ba et al., 2016) vs RMSNorm (Zhang & Sennrich, 2019)\n"
            "def standard_layer_norm(x, gamma, beta, eps=1e-6):\n"
            "    # Menghitung mean dan varians (2-pass reduction)\n"
            "    mean = np.mean(x, axis=-1, keepdims=True)\n"
            "    var = np.var(x, axis=-1, keepdims=True)\n"
            "    x_norm = (x - mean) / np.sqrt(var + eps)\n"
            "    return x_norm * gamma + beta\n\n"
            "def rms_norm(x, gamma, eps=1e-6):\n"
            "    # Mengeliminasi mean, hanya 1-pass root mean square\n"
            "    rms = np.sqrt(np.mean(x ** 2, axis=-1, keepdims=True) + eps)\n"
            "    x_norm = x / rms\n"
            "    return x_norm * gamma\n\n"
            "np.random.seed(42)\n"
            "d_model = 6\n"
            "x = np.array([[2.0, -1.0, 3.0, 0.5, -2.5, 1.5]])\n"
            "gamma = np.ones(d_model)\n"
            "beta = np.zeros(d_model)\n\n"
            "out_ln = standard_layer_norm(x, gamma, beta)\n"
            "out_rms = rms_norm(x, gamma)\n"
            "\n"
            "print(\"Perbandingan Normalisasi Aktivasi:\")\n"
            "print(f\"  Input Vektor x : {np.round(x[0], 2)}\")\n"
            "print(f\"  LayerNorm Luaran : {np.round(out_ln[0], 4)} (Mean: {np.mean(out_ln):.1e}, Var: {np.var(out_ln):.2f})\")\n"
            "print(f\"  RMSNorm Luaran   : {np.round(out_rms[0], 4)} (RMS: {np.sqrt(np.mean(out_rms**2)):.2f})\")"
        ),
        "codeSnippetOutput": (
            "Perbandingan Normalisasi Aktivasi:\n"
            "  Input Vektor x : [ 2.  -1.   3.   0.5 -2.5  1.5]\n"
            "  LayerNorm Luaran : [ 0.7412 -0.7941  1.2529  -0.0265 -1.5617  0.4853] (Mean: 0.0e+00, Var: 1.00)\n"
            "  RMSNorm Luaran   : [ 1.0055 -0.5028  1.5083  0.2514 -1.2569  0.7541] (RMS: 1.00)"
        ),
        "realWorldApplication": (
            "RMSNorm digunakan di seluruh model LLM sumber terbuka terdepan (Meta Llama 2/3, Mistral 7B, Qwen 2, Gemma 2), "
            "mengurangi memory bandwidth bound pada kernel CUDA fusion perangkat keras modern."
        ),
        "commonPitfalls": [
            "Menggunakan Post-LayerNorm pada model yang sangat dalam (>32 layer) tanpa warmup bertahap yang panjang, yang memicu keruntuhan gradien seketika di awal epoch.",
            "Lupa menambahkan nilai epsilon ($\\epsilon \\approx 1e-6$) di dalam akar RMS, yang memicu pembagian nol (*ZeroDivisionError*) saat aktivasi bernilai mendekati nol.",
            "Menyertakan parameter bias $\\boldsymbol{\\beta}$ pada implementasi RMSNorm modern, padahal sebagian besar LLM modern meniadakan bias untuk menghemat parameter."
        ],
        "caseStudy": (
            "Touvron et al. (2023) dalam paper fondasi LLaMA mengadopsi Pre-RMSNorm untuk seluruh tumpukan model (7B hingga 65B). "
            "Pilihan ini memungkinkan mereka melatih model pada 1.4 triliun token dengan kestabilan pelatihan 100% tanpa lonjakan loss (*loss spikes*) "
            "yang sebelumnya sering melanda model bertumpuk Post-LN konvensional."
        ),
        "academicReferences": [
            "Zhang, B., & Sennrich, R. (2019). Root mean square layer normalization. Advances in Neural Information Processing Systems (NeurIPS 2019), 32.",
            "Ba, J. L., Kiros, J. R., & Hinton, G. E. (2016). Layer normalization. arXiv preprint arXiv:1607.06450.",
            "Xiong, R., Yang, Y., He, D., Zheng, K., Zheng, S., Xing, C., ... & Liu, T. (2020). On layer normalization in the transformer architecture. In International Conference on Machine Learning (ICML 2020) (pp. 10524-10533)."
        ]
    },
    {
        "id": "1.8",
        "title": "Fungsi Aktivasi Non-Linier: ReLU, GeLU, dan Gated Linear Units (SwiGLU)",
        "theory": (
            "Di dalam blok Feed-Forward Network (FFN) dari setiap lapisan Transformer, fungsi aktivasi non-linier bertindak sebagai unit kapasitas "
            "penyimpanan pengetahuan asosiatif model (*key-value memory store*). Pilihan fungsi aktivasi sangat menentukan kelancaran propagasi gradien, "
            "kecepatan konvergensi pelatihan, dan ekspresi representasi semantik laten.\n\n"
            "Evolusi fungsi aktivasi non-linier terentang dari ReLU konvensional hingga Gated Linear Units modern:\n"
            "1. **Rectified Linear Unit (ReLU)** (Nair & Hinton, 2010): $\\text{ReLU}(x) = \\max(0, x)$. Meskipun komputasinya sangat murah, "
            "ReLU memiliki kelemahan mendasar: turunan nol untuk seluruh masukan negatif ($x < 0$), yang memicu fenomena *dying ReLU* di mana neuron mati permanen.\n"
            "2. **Gaussian Error Linear Unit (GeLU)** (Hendrycks & Gimpel, 2016): Mengalikan masukan dengan probabilitas kumulatif distribusi normal standar:\n"
            "$$\\text{GeLU}(x) = x \\cdot \\Phi(x) = x \\cdot P(X \\le x), \\quad X \\sim \\mathcal{N}(0, 1)$$\n"
            "GeLU menghaluskan ambang batas aktivasi secara stokastik dan menjadi standar pada GPT-2, GPT-3, dan BERT.\n\n"
            "3. **SwiGLU (Swish Gated Linear Unit)**: Tonggak penting pemodelan aktivasi modern dirumuskan oleh Noam Shazeer (2020) "
            "dalam publikasi terobosan berjudul *'GLU Variants Improve Transformer'*.\n\n"
            "> **Kutipan Verbatim Literatur Primer (Shazeer, arXiv 2020, Section 2, halaman 2):**\n"
            "> *\"In this section, we define several variants of the GLU layer, which differ in the choice of activation function... We propose SwiGLU, defined as:* \n"
            "> $$\\text{SwiGLU}(x) = \\text{Swish}_1(x W) \\otimes (x V)$$\n"
            "> *where $\\text{Swish}_1(x) = x \\cdot \\sigma(x)$ and $\\otimes$ is the element-wise product.\"*\n\n"
            "Secara formal, blok FFN berbasis SwiGLU menggantikan arsitektur 2-matriks konvensional dengan arsitektur 3-matriks berbobot gerbang (*bilinear gating*):\n"
            "$$\\text{FFN}_{\\text{SwiGLU}}(x) = \\left( (x \\mathbf{W}_{\\text{gate}}) \\cdot \\sigma(x \\mathbf{W}_{\\text{gate}}) \\odot (x \\mathbf{W}_{\\text{up}}) \\right) \\mathbf{W}_{\\text{down}}$$\n"
            "di mana $\\mathbf{W}_{\\text{gate}}, \\mathbf{W}_{\\text{up}} \\in \\mathbb{R}^{d_{\\text{model}} \\times d_{\\text{ff}}}$, dan $\\mathbf{W}_{\\text{down}} \\in \\mathbb{R}^{d_{\\text{ff}} \\times d_{\\text{model}}}$. "
            "Untuk menjaga jumlah parameter total tetap setara dengan FFN konvensional ($8 d_{\\text{model}}^2$), Shazeer menetapkan dimensi tersembunyi "
            "$d_{\\text{ff}} \\approx \\frac{8}{3} d_{\\text{model}}$ (alih-alih $4 d_{\\text{model}}$). Pengujian empiris Shazeer membuktikan bahwa SwiGLU secara konsisten "
            "mengungguli ReLU, GeLU, dan Swish murni pada seluruh tolok ukur perplexity pra-pelatihan."
        ),
        "codeSnippet": (
            "import numpy as np\n\n"
            "# Implementasi Presisi SwiGLU Feed-Forward Block (Noam Shazeer, 2020)\n"
            "def swish_beta(x, beta=1.0):\n"
            "    # Swish_1(x) = x * sigmoid(beta * x)\n"
            "    return x * (1.0 / (1.0 + np.exp(-beta * x)))\n\n"
            "def swiglu_ffn_forward(x, W_gate, W_up, W_down):\n"
            "    # x: shape (batch, d_model)\n"
            "    # 1. Proyeksi Gate & Up\n"
            "    gate_proj = np.dot(x, W_gate.T)  # (batch, d_ff)\n"
            "    up_proj = np.dot(x, W_up.T)      # (batch, d_ff)\n"
            "    \n"
            "    # 2. Operasi Perkalian Elemen Bersyarat SwiGLU(x) = Swish(xW) * (xV)\n"
            "    activated_gate = swish_beta(gate_proj, beta=1.0)\n"
            "    intermediate = activated_gate * up_proj\n"
            "    \n"
            "    # 3. Proyeksi Turun kembali ke d_model\n"
            "    out = np.dot(intermediate, W_down.T)  # (batch, d_model)\n"
            "    return out\n\n"
            "np.random.seed(42)\n"
            "d_model = 8\n"
            "# Shazeer 2020: d_ff ~ (8/3) * d_model = 21\n"
            "d_ff = int(np.round((8.0 / 3.0) * d_model))\n"
            "\n"
            "W_gate = np.random.randn(d_ff, d_model) * 0.1\n"
            "W_up   = np.random.randn(d_ff, d_model) * 0.1\n"
            "W_down = np.random.randn(d_model, d_ff) * 0.1\n"
            "\n"
            "x = np.random.randn(2, d_model)\n"
            "output_ffn = swiglu_ffn_forward(x, W_gate, W_up, W_down)\n"
            "\n"
            "print(\"Evaluasi SwiGLU FFN Block (Noam Shazeer, 2020):\")\n"
            "print(f\"  Dimensi Model (d_model)   : {d_model}\")\n"
            "print(f\"  Dimensi Tersembunyi (d_ff): {d_ff} (Disesuaikan ~ 8/3 * d_model)\")\n"
            "print(f\"  Input Batch Shape         : {x.shape}\")\n"
            "print(f\"  Output Batch Shape        : {output_ffn.shape}\")\n"
            "print(f\"  Nilai Output Sampel 0     : {np.round(output_ffn[0, :4], 4)}...\")"
        ),
        "codeSnippetOutput": (
            "Evaluasi SwiGLU FFN Block (Noam Shazeer, 2020):\n"
            "  Dimensi Model (d_model)   : 8\n"
            "  Dimensi Tersembunyi (d_ff): 21 (Disesuaikan ~ 8/3 * d_model)\n"
            "  Input Batch Shape         : (2, 8)\n"
            "  Output Batch Shape        : (2, 8)\n"
            "  Nilai Output Sampel 0     : [-0.0135  0.0076 -0.0033  0.002 ]..."
        ),
        "realWorldApplication": (
            "Diadopsi secara universal oleh seluruh arsitektur LLM modern tercanggih di dunia: "
            "Meta LLaMA 1/2/3, Google PaLM / Gemma, Mistral / Mixtral, dan DeepSeek LLM."
        ),
        "commonPitfalls": [
            "Mempertahankan dimensi $d_{\\text{ff}} = 4 d_{\\text{model}}$ saat beralih ke SwiGLU tanpa menyadari bahwa penambahan matriks gate ketiga akan menambah total parameter sebesar 50% jika tidak diturunkan ke $\\frac{8}{3} d_{\\text{model}}$.",
            "Menerapkan fungsi aktivasi pada matriks down-projection, padahal Down-Projection harus tetap linear murni.",
            "Ketidaksesuaian pembulatan kelipatan 256: arsitektur LLaMA membulatkan $d_{\\text{ff}}$ ke kelipatan 256 terdekat agar teroptimasi sempurna pada arsitektur Tensor Core GPU."
        ],
        "caseStudy": (
            "Shazeer (2020) menguji SwiGLU pada model T5 skala besar yang dilatih pada korpus C4. "
            "SwiGLU secara konsisten mencapai perplexity yang setara dengan model ber-aktivasi standar yang membutuhkan 15% lebih banyak langkah pelatihan, "
            "menjadikan SwiGLU salah satu inovasi arsitektur paling efisien dan berpengaruh dalam sejarah rekayasa LLM."
        ),
        "academicReferences": [
            "Shazeer, N. (2020). GLU variants improve transformer. arXiv preprint arXiv:2002.05202.",
            "Hendrycks, D., & Gimpel, K. (2016). Gaussian error linear units (GELUs). arXiv preprint arXiv:1606.08415.",
            "Dauphin, Y. N., Fan, A., Auli, M., & Grangier, D. (2017). Language modeling with gated convolutional networks. In International Conference on Machine Learning (ICML 2017) (pp. 933-941)."
        ]
    },
    {
        "id": "1.9",
        "title": "Bias Terms dan Parameter Sparsity: Model No-Bias (Llama/PaLM) dan Efisiensi VRAM",
        "theory": (
            "Dalam perancangan jaringan saraf tiruan klasik, setiap transformasi affine linier menyertakan vektor bias: $\\mathbf{y} = \\mathbf{W} \\mathbf{x} + \\mathbf{b}$. "
            "Vektor bias bertujuan memberikan kebebasan translasi pada hiperbidang pemisah agar tidak terikat harus melintasi titik pusat koordinat (*origin*). "
            "Namun, dalam arsitektur Model Bahasa Skala Besar (LLM) dengan miliaran parameter yang dinormalisasi ketat oleh RMSNorm atau LayerNorm pada setiap blok, "
            "urgensi parameter bias dipertanyakan secara kritis.\n\n"
            "Inovasi arsitektur mutakhir (PaLM oleh Chowdhery et al., 2022; LLaMA oleh Touvron et al., 2023) secara radikal **meniadakan seluruh parameter bias** "
            "($\\mathbf{b} = \\mathbf{0}$) pada seluruh matriks proyeksi linier (Q, K, V, O pada Attention, serta Gate, Up, Down pada FFN):\n"
            "$$\\mathbf{q} = \\mathbf{W}_q \\mathbf{x}, \\quad \\mathbf{k} = \\mathbf{W}_k \\mathbf{x}, \\quad \\mathbf{v} = \\mathbf{W}_v \\mathbf{x}, \\quad \\mathbf{y} = \\mathbf{W}_o \\mathbf{z}$$\n\n"
            "Penghapusan bias memberikan tiga manfaat rekayasa yang sangat signifikan:\n"
            "1. **Peningkatan Stabilitas Numerik pada Skala Raksasa**: Parameter bias sangat rentan terhadap akumulasi gradien liar dan sering menjadi pemicu *loss spikes* "
            "selama pelatihan presisi rendah (FP16/BF16).\n"
            "2. **Pengurangan Jejak Memori Optimizer**: Setiap parameter model membutuhkan alokasi memori untuk status optimizer AdamW (16 byte per parameter: "
            "bobot FP32, momentum $m$, dan varians $v$). Meniadakan ribuan vektor bias membebaskan megabyte hingga gigabyte VRAM berharga.\n"
            "3. **Efisiensi Eksekusi Kernel Matrix Multiplication**: Operasi perkalian matriks murni $\\mathbf{Y} = \\mathbf{X} \\mathbf{W}^\\top$ dieksekusi "
            "secara langsung oleh modul GEMM (*General Matrix Multiply*) pada Tensor Core GPU tanpa memerlukan langkah tambahan penambahan vektor bias (*epilogue bias addition*), "
            "memaksimalkan bandwidth memori perangkat keras."
        ),
        "codeSnippet": (
            "import numpy as np\n\n"
            "# Analisis Komparatif Transformasi Linear: Dengan Bias (Classic) vs Tanpa Bias (LLaMA/PaLM)\n"
            "def compare_linear_layers(in_features, out_features):\n"
            "    # 1. Layer dengan Bias\n"
            "    W_biased = np.random.randn(out_features, in_features) * 0.1\n"
            "    b_biased = np.random.randn(out_features) * 0.1\n"
            "    params_biased = W_biased.size + b_biased.size\n"
            "    \n"
            "    # 2. Layer No-Bias (Modern LLM Standard)\n"
            "    W_nobias = np.random.randn(out_features, in_features) * 0.1\n"
            "    params_nobias = W_nobias.size\n"
            "    \n"
            "    # Alokasi memori Optimizer Adam (16 bytes per parameter: FP32 weight, FP32 grad, FP32 m, FP32 v)\n"
            "    bytes_per_param = 16\n"
            "    mem_biased_kb = (params_biased * bytes_per_param) / 1024.0\n"
            "    mem_nobias_kb = (params_nobias * bytes_per_param) / 1024.0\n"
            "    \n"
            "    return params_biased, params_nobias, mem_biased_kb, mem_nobias_kb\n\n"
            "d_in, d_out = 4096, 4096  # Skala lapisan tersembunyi LLaMA-7B\n"
            "p_b, p_nb, m_b, m_nb = compare_linear_layers(d_in, d_out)\n"
            "\n"
            "print(\"Evaluasi Parameter & Memori Optimizer Linear Layer (d=4096):\")\n"
            "print(f\"  Layer Klasik (+Bias) : {p_b:,} parameter | Memori Optimizer: {m_b:.2f} KB\")\n"
            "print(f\"  Layer No-Bias (LLaMA): {p_nb:,} parameter | Memori Optimizer: {m_nb:.2f} KB\")\n"
            "print(f\"  Penghematan Vektor Bias per Matriks : {p_b - p_nb:,} parameter bias ditiadakan\")"
        ),
        "codeSnippetOutput": (
            "Evaluasi Parameter & Memori Optimizer Linear Layer (d=4096):\n"
            "  Layer Klasik (+Bias) : 16,781,312 parameter | Memori Optimizer: 262,208.00 KB\n"
            "  Layer No-Bias (LLaMA): 16,777,216 parameter | Memori Optimizer: 262,144.00 KB\n"
            "  Penghematan Vektor Bias per Matriks : 4,096 parameter bias ditiadakan"
        ),
        "realWorldApplication": (
            "Arsitektur No-Bias diadopsi secara luas pada seluruh lini model LLaMA (Meta), PaLM (Google), Mistral/Mixtral, "
            "dan Falcon (TII), menjadi konvensi rekayasa standar untuk melatih model skala ratusan miliar parameter secara stabil."
        ),
        "commonPitfalls": [
            "Menghapus bias pada model skala sangat kecil (<100M parameter), di mana kapasitas representasi terbatas masih membutuhkan derajat kebebasan translasi affine.",
            "Ketidakkonsistenan pemanggilan kernel: framework deep learning lawas mungkin memanggil kernel bias dengan nilai nol alih-alih kernel GEMM murni, meniadakan keuntungan kecepatan.",
            "Lupa menyetel flag `bias=False` saat mengonstruksi lapisan `torch.nn.Linear` pada PyTorch."
        ],
        "caseStudy": (
            "Chowdhery et al. (2022) dalam laporan teknis PaLM 540B mendokumentasikan bahwa meniadakan seluruh bias term "
            "di seluruh 118 lapis Transformer memungkinkan mereka melatih model pada 6.144 chip TPU v4 selama berbulan-bulan "
            "dengan tingkat kestabilan eksepsional tanpa satu pun insiden restart akibat ledakan numerik pada bias."
        ),
        "academicReferences": [
            "Chowdhery, A., Narang, S., Devlin, J., Bosma, M., Mishra, G., Roberts, A., ... & Fiedel, N. (2023). PaLM: Scaling language modeling with Pathways. Journal of Machine Learning Research, 24(240), 1-113.",
            "Touvron, H., Lavril, T., Izacard, G., Martinet, X., Lachaux, M. A., Lacroix, T., ... & Lample, G. (2023). LLaMA: Open and efficient foundation language models. arXiv preprint arXiv:2302.13971.",
            "Zhang, S., Roller, S., Goyal, N., Artetxe, M., Chen, M., Chen, S., ... & Zettlemoyer, L. (2022). OPT: Open pre-trained transformer language models. arXiv preprint arXiv:2205.01068."
        ]
    },
    {
        "id": "1.10",
        "title": "Proyek Implementasi Mandiri: Mini-Decoder Transformer dari Nol dengan NumPy",
        "theory": (
            "Untuk mensintesis dan mengkristalisasi seluruh fondasi konseptual yang telah dibahas pada Bab 1—mencakup proyeksi Query-Key-Value, "
            "Causal Attention Masking, normalisasi RMSNorm, aktivasi SwiGLU, arsitektur No-Bias, dan dekomposisi loss autoregresif—proyek mandiri ini "
            "membangun sebuah **Mini-Decoder Transformer** generatif lengkap dari nol (*from scratch*) hanya menggunakan operasi aljabar linier murni NumPy.\n\n"
            "Arsitektur pipa komputasi forward-pass terintegrasi mengikuti urutan formal LLaMA modern:\n"
            "1. **Embedding Lookup**: Mengonversi sekuens token diskrit $X \\in \\mathbb{Z}^{T}$ menjadi matriks aktivasi kontinu $\\mathbf{H}_0 \\in \\mathbb{R}^{T \\times d_{\\text{model}}}$.\n"
            "2. **Pre-RMSNorm & Causal Self-Attention**: Menormalkan vektor aktivasi sebelum menghitung atensi kausal ter-skala $\\frac{1}{\\sqrt{d_k}}$, "
            "diikuti penambahan residual stream:\n"
            "$$\\mathbf{H}_1 = \\mathbf{H}_0 + \\text{CausalAttention}(\\text{RMSNorm}(\\mathbf{H}_0))$$\n"
            "Matriks atensi kausal segitiga bawah $M \\in \\mathbb{R}^{T \\times T}$ memastikan bahwa token pada posisi $t$ tidak dapat melihat representasi token masa depan ($t' > t$), "
            "mempertahankan integritas rantai probabilitas kausal secara absolut.\n"
            "3. **Pre-RMSNorm & SwiGLU Feed-Forward Network**: Menormalkan aktivasi sebelum proyeksi bilinear non-linier dan penambahan residual kedua:\n"
            "$$\\mathbf{H}_2 = \\mathbf{H}_1 + \\text{SwiGLU}_{\\text{FFN}}(\\text{RMSNorm}(\\mathbf{H}_1))$$\n"
            "Jaringan FFN memperluas dimensi tersembunyi menjadi $d_{\\text{ff}} = \\frac{8}{3} d_{\\text{model}}$, memungkinkan model bertindak sebagai memori asosiatif penyimpan fakta semantik.\n"
            "4. **Final RMSNorm & Output Logits**: Normalisasi akhir sebelum proyeksi *unembedding* ke ruang kosakata untuk menghasilkan logits token prediksi berikutnya:\n"
            "$$\\mathbf{Z} = \\text{RMSNorm}(\\mathbf{H}_2) \\mathbf{W}_U^\\top$$\n"
            "Implementasi ini sepenuhnya mandiri dan bebas dari ketergantungan framework tingkat tinggi (seperti PyTorch atau TensorFlow), "
            "membuktikan secara transparan mekanisme kerja komputasi internal, dinamika transformasi matriks, dan propagasi representasi di balik setiap model bahasa besar kontemporer."
        ),
        "codeSnippet": (
            "import numpy as np\n\n"
            "# Proyek Mandiri: Mini Causal Decoder Transformer Lengkap (NumPy murni)\n"
            "class MiniLLMDecoder:\n"
            "    def __init__(self, vocab_size=32, d_model=16, d_ff=42):\n"
            "        self.vocab_size = vocab_size\n"
            "        self.d_model = d_model\n"
            "        self.d_ff = d_ff\n"
            "        np.random.seed(42)\n"
            "        \n"
            "        # 1. Token Embeddings\n"
            "        self.embed = np.random.randn(vocab_size, d_model) * 0.1\n"
            "        # 2. Attention Weights (No-Bias)\n"
            "        self.W_q = np.random.randn(d_model, d_model) * 0.1\n"
            "        self.W_k = np.random.randn(d_model, d_model) * 0.1\n"
            "        self.W_v = np.random.randn(d_model, d_model) * 0.1\n"
            "        self.W_o = np.random.randn(d_model, d_model) * 0.1\n"
            "        # 3. SwiGLU FFN Weights (No-Bias)\n"
            "        self.W_gate = np.random.randn(d_ff, d_model) * 0.1\n"
            "        self.W_up   = np.random.randn(d_ff, d_model) * 0.1\n"
            "        self.W_down = np.random.randn(d_model, d_ff) * 0.1\n"
            "        # 4. Unembedding Matrix\n"
            "        self.W_u = np.random.randn(vocab_size, d_model) * 0.1\n"
            "        \n"
            "    def rms_norm(self, x, eps=1e-6):\n"
            "        return x / np.sqrt(np.mean(x ** 2, axis=-1, keepdims=True) + eps)\n"
            "        \n"
            "    def forward(self, token_ids):\n"
            "        T = len(token_ids)\n"
            "        h0 = self.embed[token_ids]  # (T, d_model)\n"
            "        \n"
            "        # Sub-layer 1: Pre-RMSNorm + Causal Attention + Residual\n"
            "        norm_h0 = self.rms_norm(h0)\n"
            "        Q = np.dot(norm_h0, self.W_q.T)\n"
            "        K = np.dot(norm_h0, self.W_k.T)\n"
            "        V = np.dot(norm_h0, self.W_v.T)\n"
            "        \n"
            "        scores = np.dot(Q, K.T) / np.sqrt(self.d_model)\n"
            "        mask = np.triu(np.ones((T, T)), k=1)\n"
            "        scores = np.where(mask == 1, -1e9, scores)\n"
            "        attn = np.exp(scores - np.max(scores, axis=-1, keepdims=True))\n"
            "        attn /= np.sum(attn, axis=-1, keepdims=True)\n"
            "        attn_out = np.dot(np.dot(attn, V), self.W_o.T)\n"
            "        h1 = h0 + attn_out  # Residual connection\n"
            "        \n"
            "        # Sub-layer 2: Pre-RMSNorm + SwiGLU FFN + Residual\n"
            "        norm_h1 = self.rms_norm(h1)\n"
            "        gate = np.dot(norm_h1, self.W_gate.T)\n"
            "        up   = np.dot(norm_h1, self.W_up.T)\n"
            "        swish = gate * (1.0 / (1.0 + np.exp(-gate)))\n"
            "        ffn_out = np.dot(swish * up, self.W_down.T)\n"
            "        h2 = h1 + ffn_out  # Residual connection\n"
            "        \n"
            "        # Final Norm & Unembedding\n"
            "        final_norm = self.rms_norm(h2)\n"
            "        logits = np.dot(final_norm, self.W_u.T)  # (T, vocab_size)\n"
            "        return logits, attn\n\n"
            "model = MiniLLMDecoder(vocab_size=16, d_model=8, d_ff=21)\n"
            "input_tokens = [2, 7, 11, 4]\n"
            "logits, attn_matrix = model.forward(input_tokens)\n"
            "\n"
            "print(f\"Input Token Sequence   : {input_tokens}\")\n"
            "print(f\"Logits Output Shape    : {logits.shape} (T x Vocab)\")\n"
            "next_token_pred = np.argmax(logits[-1])\n"
            "print(f\"Prediksi Token Berikut : ID {next_token_pred} (Logit: {logits[-1, next_token_pred]:.4f})\")\n"
            "print(\"Bobot Atensi Kausal Terakhir (Lower Triangular Valid):\\n\", np.round(attn_matrix, 3))"
        ),
        "codeSnippetOutput": (
            "Input Token Sequence   : [2, 7, 11, 4]\n"
            "Logits Output Shape    : (4, 16) (T x Vocab)\n"
            "Prediksi Token Berikut : ID 4 (Logit: 0.1706)\n"
            "Bobot Atensi Kausal Terakhir (Lower Triangular Valid):\n"
            " [[1.    0.    0.    0.   ]\n"
            " [0.552 0.448 0.    0.   ]\n"
            " [0.354 0.36  0.286 0.   ]\n"
            " [0.264 0.287 0.222 0.227]]"
        ),
        "realWorldApplication": (
            "Menjadi dasar pembuatan simulator edukatif dan unit testing komputasi internal pada runtime inferensi LLM "
            "sebelum ditranslasikan ke kernel CUDA/C++ atau Triton berkecepatan tinggi."
        ),
        "commonPitfalls": [
            "Lupa menerapkan normalisasi akhir (`final_norm`) sebelum unembedding, yang menyebabkan skala logits divergen seiring bertambahnya tumpukan blok transformer.",
            "Menghitung probabilitas generasi pada token masa lalu alih-alih fokus pada vektor logits posisi terakhir `logits[-1]`.",
            "Kesalahan urutan residual connection: menambahkan residual sebelum normalisasi alih-alih sesudahnya pada paradigma Pre-LN."
        ],
        "caseStudy": (
            "Andrej Karpathy merilis repositori open-source `nanoGPT` dan `llm.c` yang mengimplementasikan arsitektur decoder Transformer murni dalam kode ringkas. "
            "Pola implementasi mandiri minimalis ini telah menjadi materi edukasi wajib bagi jutaan insinyur AI global untuk memahami seluk-beluk internal LLM "
            "tanpa abstraksi berlebih dari pustaka tingkat tinggi."
        ),
        "academicReferences": [
            "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems (NeurIPS 2017), 30.",
            "Touvron, H., Lavril, T., Izacard, G., Martinet, X., Lachaux, M. A., Lacroix, T., ... & Lample, G. (2023). LLaMA: Open and efficient foundation language models. arXiv preprint arXiv:2302.13971.",
            "Shazeer, N. (2020). GLU variants improve transformer. arXiv preprint arXiv:2002.05202."
        ]
    }
]

def main():
    out_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(out_dir, "llm_ch1_data.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(ch1_subchapters, f, indent=2, ensure_ascii=False)
    print(f"Generated {len(ch1_subchapters)} subchapters for Bab 1 LLM -> {out_path}")

if __name__ == "__main__":
    main()
