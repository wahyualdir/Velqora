# -*- coding: utf-8 -*-
"""
Generator untuk Bab 3: Pemodelan Bahasa Statistik & N-Gram (Statistical Language Modeling) (10 Subbab)
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
# Subbab 3.1: Konsep Pemodelan Bahasa Probabilistik
# ==============================================================================
code_3_1 = r'''import numpy as np

# Konsep Dasar Pemodelan Bahasa Probabilistik
# Menghitung probabilitas bersama kalimat P(W) menggunakan Aturan Rantai Probabilitas (Chain Rule)
# P(w_1, w_2, ..., w_n) = \prod_{i=1}^n P(w_i | w_1, ..., w_{i-1})

corpus_sentences = [
    "saya belajar pemrosesan bahasa alami",
    "saya belajar kecerdasan buatan",
    "pemrosesan bahasa alami sangat menarik",
    "saya suka belajar ilmu komputer"
]

# Toy conditional probability distribution (simulasi log-likelihood)
cond_probs = {
    ("<s>", "saya"): 0.6,
    ("saya", "belajar"): 0.75,
    ("belajar", "pemrosesan"): 0.33,
    ("pemrosesan", "bahasa"): 0.95,
    ("bahasa", "alami"): 0.98,
    ("alami", "</s>"): 0.85
}

test_sentence = ["<s>", "saya", "belajar", "pemrosesan", "bahasa", "alami", "</s>"]

joint_prob = 1.0
log_prob = 0.0

print("Dekomposisi Probabilitas Bersama Rantai Kata:")
print("-" * 65)
for i in range(1, len(test_sentence)):
    prev_word = test_sentence[i-1]
    curr_word = test_sentence[i]
    p = cond_probs.get((prev_word, curr_word), 0.01)
    joint_prob *= p
    log_prob += np.log(p)
    print(f"P({curr_word:<12} | {prev_word:<10}) = {p:.4f}  |  log P = {np.log(p):.4f}")

print("-" * 65)
print(f"Probabilitas Bersama Kalimat P(W) = {joint_prob:.8e}")
print(f"Total Log-Likelihood log P(W)   = {log_prob:.4f}")
'''

subchapters.append({
    "id": "nlp-3-1-probabilistic-language-modeling",
    "chapterId": "natural-language-processing-ch-3",
    "title": "Konsep Pemodelan Bahasa Probabilistik: Prediksi Kata Berikutnya dan Estimasi Kemungkinan Bersama",
    "description": "Prinsip dasar model bahasa probabilistik: penugasan probabilitas pada urutan kata P(W), prediksi kata berikutnya P(w_t | w_<t), dan aturan rantai probabilitas.",
    "estimatedMinutes": 35,
    "order": 1,
    "content": {
        "theory": (
            "Secara formal, **Model Bahasa (*Language Model / LM*)** adalah suatu fungsi probabilitas yang menugaskan nilai kemungkinan $P(W)$ terhadap sembarang urutan kata $W = (w_1, w_2, \\dots, w_n) \\in \\mathcal{V}^*$, atau menghitung probabilitas bersyarat kemunculan kata berikutnya $P(w_t \\mid w_1, w_2, \\dots, w_{t-1})$ dengan mempertimbangkan konteks kata-kata yang mendahuluinya.\n\n"
            "Kemampuan menugaskan probabilitas terhadap urutan simbol bahasa merupakan jantung dari berbagai aplikasi pemrosesan bahasa alami. Sebagai contoh:\n"
            "1. **Pemeriksa Ejaan & Tata Bahasa (*Spell Checking & Grammar Correction*)**: Menentukan bahwa kalimat $P(\\text{\"saya pergi ke kampus\"}) > P(\\text{\"saya pagi ke kampus\"})$.\n"
            "2. **Pengenalan Ucapan (*Automatic Speech Recognition / ASR*)**: Membedakan sinyal audio homofon yang ambigu, misal $P(\\text{\"recognize speech\"}) \\gg P(\\text{\"wreck a nice beach\"})$.\n"
            "3. **Penerjemahan Mesin (*Machine Translation*)**: Memilih susunan kata sasaran yang paling fasih dan alami di antara ribuan kandidat permutasi sintaksis.\n\n"
            "Berdasarkan **Aturan Rantai Probabilitas (*Chain Rule of Probability*)**, probabilitas bersama (*joint probability*) dari sembarang sekuens kata $W = (w_1, w_2, \\dots, w_n)$ dapat difaktorkan secara matematis tanpa kehilangan informasi sebagai produk dari serangkaian probabilitas bersyarat berurutan:\n"
            "$$P(w_1, w_2, \\dots, w_n) = P(w_1) \\cdot P(w_2 \\mid w_1) \\cdot P(w_3 \\mid w_1, w_2) \\dots P(w_n \\mid w_1, \\dots, w_{n-1}) = \\prod_{k=1}^n P(w_k \\mid w_1^{k-1})$$\n"
            "di mana notasi $w_1^{k-1}$ merepresentasikan riwayat konteks kata dari indeks $1$ hingga $k-1$.\n\n"
            "Namun, penerapan langsung aturan rantai tanpa pembatasan menghadapi rintangan komputasi dan statistik yang eksponensial. Seiring bertambahnya panjang kalimat $n$, riwayat konteks $w_1^{n-1}$ menjadi sangat panjang dan unik, sehingga probabilitas bersyarat $P(w_n \\mid w_1^{n-1})$ hampir mustahil diestimasi dari korpus teks berhingga karena sebagian besar kombinasi riwayat panjang tidak pernah muncul sama sekali (*data sparsity*)."
        ),
        "codeSnippet": code_3_1,
        "codeSnippetOutput": run_code_capture_output(code_3_1),
        "realWorldApplication": (
            "Digunakan dalam autokompleksi keyboard ponsel cerdas, mesin scoring kandidat transkripsi audio Whisper, dan modul reranking kandidat terjemahan mesin."
        ),
        "commonPitfalls": [
            r"Mengalikan probabilitas mentah dalam ruang linier pada kalimat panjang yang menyebabkan floating-point underflow menuju nol mutlak (wajib menggunakan log-likelihood).",
            r"Mengabaikan token batas awal <s> dan batas akhir </s> yang menyebabkan model tidak memiliki distribusi probabilitas yang valid atas panjang kalimat.",
            r"Mengasumsikan bahwa probabilitas tinggi selalu berarti kalimat faktual, padahal model bahasa hanya mengukur kebiasaan statistik sintaktis dan leksikal."
        ],
        "caseStudy": (
            "Sebuah sistem ASR menerima dua hipotesis akustik yang identik: 'the sail of the boat' vs 'the sale of the boat'. Bagaimana perancang model bahasa mengevaluasi P(W) kedua kalimat menggunakan model probabilistik n-gram untuk memilih hipotesis transkripsi yang paling tepat secara semantik?"
        ),
        "academicReferences": [
            r"Shannon, C. E. (1948). A mathematical theory of communication. The Bell System Technical Journal, 27(3), 379-423.",
            r"Bahl, L. R., Jelinek, F., & Mercer, R. L. (1983). A maximum likelihood approach to continuous speech recognition. IEEE Transactions on Pattern Analysis and Machine Intelligence, (2), 179-190.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Chapter 3: N-gram Language Models. Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 3.2: Rantai Markov & Asumsi N-Gram
# ==============================================================================
code_3_2 = r'''import numpy as np

# Simulasi Asumsi Markov pada Pemodelan N-gram
# Unigram: P(w_k), Bigram: P(w_k | w_{k-1}), Trigram: P(w_k | w_{k-2}, w_{k-1})

words = ["ekonomi", "digital", "indonesia", "tumbuh", "sangat", "pesat"]

print("Reduksi Konteks Berdasarkan Orde Markov:")
print("-" * 70)
print(f"Kalimat: {' '.join(words)}\n")

for i, w in enumerate(words):
    # Full history
    full_hist = words[:i]
    hist_str = ", ".join(full_hist) if full_hist else "Ø"
    
    # Bigram (Markov Orde 1): hanya 1 kata sebelumnya
    bigram_hist = words[i-1] if i >= 1 else "<s>"
    
    # Trigram (Markov Orde 2): 2 kata sebelumnya
    trigram_hist = f"{words[i-2]}, {words[i-1]}" if i >= 2 else (f"<s>, {words[i-1]}" if i == 1 else "<s>, <s>")
    
    print(f"Kata target: '{w}'")
    print(f"  - Full Exact Chain: P({w} | {hist_str})")
    print(f"  - Bigram (Orde 1) : P({w} | {bigram_hist})")
    print(f"  - Trigram (Orde 2): P({w} | {trigram_hist})")
print("-" * 70)
print("Asumsi Markov membatasi riwayat ke k kata terakhir, menyederhanakan estimasi parameter.")
'''

subchapters.append({
    "id": "nlp-3-2-markov-chain-ngram-assumption",
    "chapterId": "natural-language-processing-ch-3",
    "title": "Rantai Markov & Asumsi N-Gram: Pemfaktoran Probabilitas Menggunakan Aturan Rantai dan Reduksi Konteks",
    "description": "Aproksimasi stokastik rantai Markov: reduksi riwayat konteks tak terbatas menjadi k-langkah terakhir, definisi matematis unigram, bigram, trigram, dan n-gram.",
    "estimatedMinutes": 35,
    "order": 2,
    "content": {
        "theory": (
            "Untuk mengatasi ledakan parameter dan kelangkaan data pada aturan rantai penuh, Andrei Markov merumuskan sebuah pendekatan stokastik di mana masa depan hanya bergantung pada keadaan saat ini, bukan pada seluruh riwayat masa lalu. Dalam linguistik komputasional, prinsip ini dikenal sebagai **Asumsi Markov (*Markov Assumption*)**.\n\n"
            "Sebuah **Model N-Gram** mengaproksimasi probabilitas bersyarat dari sebuah kata dengan hanya melihat $N-1$ kata sebelumnya, bukan seluruh riwayat kalimat sejak awal:\n"
            "$$P(w_k \\mid w_1^{k-1}) \\approx P(w_k \\mid w_{k-N+1}^{k-1})$$\n\n"
            "Berdasarkan nilai orde $N$, model bahasa diklasifikasikan sebagai berikut:\n"
            "1. **Unigram ($N=1$)**: Mengasumsikan setiap kata sepenuhnya independen satu sama lain (Markov orde 0):\n"
            "   $$P(w_1, w_2, \\dots, w_n) = \\prod_{k=1}^n P(w_k)$$\n"
            "2. **Bigram ($N=2$)**: Mengasumsikan kemunculan kata hanya bergantung pada tepat satu kata sebelumnya (Markov orde 1):\n"
            "   $$P(w_1, w_2, \\dots, w_n) = \\prod_{k=1}^n P(w_k \\mid w_{k-1})$$\n"
            "3. **Trigram ($N=3$)**: Mengasumsikan kemunculan kata bergantung pada dua kata sebelumnya (Markov orde 2):\n"
            "   $$P(w_1, w_2, \\dots, w_n) = \\prod_{k=1}^n P(w_k \\mid w_{k-2}, w_{k-1})$$\n\n"
            "Trade-off teoretis pada pemilihan nilai $N$:\n"
            "- Semakin besar $N$ (misal 4-gram atau 5-gram), model menangkap ketergantungan sintaktis lokal dan kolokasi frasa yang jauh lebih kaya dan koheren.\n"
            "- Namun, ruang kemungkinan n-gram tumbuh secara eksponensial sebesar $|\\mathcal{V}|^N$. Untuk kamus kosakata $|\\mathcal{V}| = 100.000$, jumlah parameter bigram adalah $10^{10}$, dan trigram mencapai $10^{15}$. Mayoritas kombinasi n-gram tersebut tidak akan pernah teramati bahkan dalam korpus miliaran kata."
        ),
        "codeSnippet": code_3_2,
        "codeSnippetOutput": run_code_capture_output(code_3_2),
        "realWorldApplication": (
            "Digunakan dalam generasi teks acak terkendali (*Markov text generation*), filter spam Bayesian, dan model akustik kompresi pengenalan wicara tertanam (*embedded ASR*)."
        ),
        "commonPitfalls": [
            r"Mengira bahwa asumsi Markov mampu menangkap kesepakatan gramatikal jarak jauh (long-range dependencies), seperti subjek dan predikat yang terpisah oleh klausa relatif panjang.",
            r"Menyetel nilai N terlalu tinggi (misal N > 5) pada korpus berukuran sedang sehingga model hanya menghafal kalimat latih (overfitting) dan gagal menggeneralisasi kalimat baru.",
            r"Lupa menambahkan token padding awal sebanyak N-1 buah (misal <s> untuk bigram, <s> <s> untuk trigram)."
        ],
        "caseStudy": (
            "Analisis kalimat: 'The books that I bought yesterday at the bookstore [are/is] heavy'. Jelaskan mengapa model bigram dan trigram rentan memilih bentuk kata kerja tunggal 'is' daripada bentuk jamak 'are', dan bagaimana keterbatasan jendela Markov menjelaskan kegagalan ini."
        ),
        "academicReferences": [
            r"Markov, A. A. (1913). An example of statistical investigation of the text Eugene Onegin concerning the connection of samples in chains. Bulletin of the Imperial Academy of Sciences of St. Petersburg, 7(3), 153-162.",
            r"Charniak, E. (1996). Statistical Language Learning. MIT Press.",
            r"Manning, C. D., & Schütze, H. (1999). Foundations of Statistical Natural Language Processing. MIT Press."
        ]
    }
})

# ==============================================================================
# Subbab 3.3: Estimasi Kemungkinan Maksimum (MLE)
# ==============================================================================
code_3_3 = r'''from collections import defaultdict, Counter
import numpy as np

# Estimasi Kemungkinan Maksimum (Maximum Likelihood Estimation / MLE) untuk Bigram
corpus = [
    "<s> saya suka makan nasi </s>",
    "<s> saya suka minum kopi </s>",
    "<s> saya suka makan ayam </s>",
    "<s> dia suka minum teh </s>"
]

unigram_counts = Counter()
bigram_counts = Counter()

for sent in corpus:
    tokens = sent.split()
    for t in tokens:
        unigram_counts[t] += 1
    for i in range(len(tokens) - 1):
        bigram_counts[(tokens[i], tokens[i+1])] += 1

print("Hasil Estimasi Parameter MLE Bigram P(w_i | w_{i-1}):")
print("-" * 65)
print(f"{'Bigram (w_{i-1}, w_i)':<30} | {'Count(w_{i-1}, w_i)':<20} | {'Count(w_{i-1})':<15} | {'P_MLE':<10}")
print("-" * 80)

query_pairs = [
    ("<s>", "saya"),
    ("saya", "suka"),
    ("suka", "makan"),
    ("suka", "minum"),
    ("makan", "nasi"),
    ("makan", "roti")  # Tidak ada di korpus
]

for w_prev, w_curr in query_pairs:
    c_bi = bigram_counts.get((w_prev, w_curr), 0)
    c_uni = unigram_counts.get(w_prev, 0)
    p_mle = c_bi / c_uni if c_uni > 0 else 0.0
    print(f"({w_prev:<8}, {w_curr:<8})             | {c_bi:<20} | {c_uni:<15} | {p_mle:.4f}")

print("-" * 80)
print("MLE mengestimasi probabilitas langsung dari rasio frekuensi relatif (relative frequencies).")
'''

subchapters.append({
    "id": "nlp-3-3-maximum-likelihood-estimation-mle",
    "chapterId": "natural-language-processing-ch-3",
    "title": "Estimasi Kemungkinan Maksimum (MLE): Perhitungan Probabilitas N-gram Berbasis Rasio Frekuensi",
    "description": "Derivasi matematis estimasi kemungkinan maksimum (MLE) untuk parameter model bahasa unigram, bigram, dan trigram berbasis hitungan relatif dalam korpus.",
    "estimatedMinutes": 35,
    "order": 3,
    "content": {
        "theory": (
            "Bagaimana cara kita menghitung nilai parameter probabilitas bersyarat $P(w_n \\mid w_{n-N+1}^{n-1})$ dari sebuah korpus teks pelatihan? Metode standar dan paling mendasar dalam statistika inferensial adalah **Estimasi Kemungkinan Maksimum (*Maximum Likelihood Estimation / MLE*)**.\n\n"
            "Prinsip MLE adalah mencari nilai parameter model yang memaksimalkan fungsi kemungkinan (*likelihood*) dari data observasi korpus. Dalam konteks penghitungan n-gram, estimasi MLE diperoleh dengan menormalisasi frekuensi kemunculan gabungan (*joint count*) n-gram terhadap frekuensi kemunculan prefiks riwayat konteksnya (*history count*).\n\n"
            "Formulasi matematis MLE untuk berbagai orde n-gram:\n"
            "1. **Unigram MLE**:\n"
            "   $$P_{\\text{MLE}}(w_i) = \\frac{C(w_i)}{\\sum_{w \\in \\mathcal{V}} C(w)} = \\frac{C(w_i)}{N}$$\n"
            "   di mana $C(w_i)$ adalah jumlah kemunculan kata $w_i$ dan $N$ adalah total jumlah seluruh token kata dalam korpus.\n\n"
            "2. **Bigram MLE**:\n"
            "   $$P_{\\text{MLE}}(w_i \\mid w_{i-1}) = \\frac{C(w_{i-1}, w_i)}{\\sum_{w} C(w_{i-1}, w)} = \\frac{C(w_{i-1}, w_i)}{C(w_{i-1})}$$\n"
            "   Penyebut $\\sum_{w} C(w_{i-1}, w)$ secara matematis persis sama dengan frekuensi unigram dari kata pendahulu $C(w_{i-1})$.\n\n"
            "3. **N-gram MLE Umum**:\n"
            "   $$P_{\\text{MLE}}(w_i \\mid w_{i-N+1}^{i-1}) = \\frac{C(w_{i-N+1}^{i-1}, w_i)}{C(w_{i-N+1}^{i-1})}$$\n\n"
            "Karakteristik & Kelemahan MLE:\n"
            "MLE memberikan estimasi yang tidak bias (*unbiased estimator*) pada data latih yang sangat besar. Namun, MLE memiliki kelemahan kritis yang fatal: MLE memberikan bobot probabilitas **nol mutlak** ($P = 0$) kepada setiap urutan n-gram yang tidak pernah muncul dalam korpus pelatihan, meskipun urutan tersebut sepenuhnya valid dan bermakna secara gramatikal manusia."
        ),
        "codeSnippet": code_3_3,
        "codeSnippetOutput": run_code_capture_output(code_3_3),
        "realWorldApplication": (
            "Perhitungan baseline cepat untuk pemodelan korpus domain tertutup, analisis kolokasi frasa, dan ekstraksi fitur n-gram pada klasifikasi teks tradisional."
        ),
        "commonPitfalls": [
            r"Membagi dengan nol ketika konteks riwayat (history) tidak pernah muncul sama sekali di dalam data latih.",
            r"Mengasumsikan bahwa n-gram dengan hitungan nol tidak mungkin terjadi di dunia nyata, yang merusak kemampuan generalisasi model.",
            r"Tidak membedakan antara ukuran korpus total N (jumlah token) dengan ukuran kosakata |V| (jumlah kata unik/types)."
        ],
        "caseStudy": (
            "Diberikan korpus pelatihan 100.000 kata. Frasa 'menteri kesehatan' muncul 50 kali, sementara 'menteri keuangan' muncul 120 kali, dan kata 'menteri' muncul total 300 kali. Hitung P_MLE('kesehatan' | 'menteri') dan P_MLE('keuangan' | 'menteri'). Jika frasa 'menteri pariwisata' muncul 0 kali, berapa nilai P_MLE-nya dan apa dampaknya pada evaluasi kalimat baru?"
        ),
        "academicReferences": [
            r"Jelinek, F. (1997). Statistical Methods for Speech Recognition. MIT Press.",
            r"Katz, S. (1987). Estimation of probabilities from sparse data for the language model component of a speech recognizer. IEEE Transactions on Acoustics, Speech, and Signal Processing, 35(3), 400-401.",
            r"Chen, S. F., & Goodman, J. (1996). An empirical study of smoothing techniques for language modeling. In Proceedings of the 34th Annual Meeting of the Association for Computational Linguistics (pp. 310-318)."
        ]
    }
})

# ==============================================================================
# Subbab 3.4: Evaluasi Model Bahasa: Perpleksitas (Perplexity / PPL)
# ==============================================================================
code_3_4 = r'''import numpy as np

# Perhitungan Evaluasi Intrinsik Model Bahasa: Perpleksitas (Perplexity / PPL)
# PPL(W) = P(w_1, ..., w_N)^{-1/N} = \exp( - \frac{1}{N} \sum_{i=1}^N \ln P(w_i | w_{<i}) )

# Misalkan sebuah kalimat uji memiliki N = 5 kata dengan probabilitas kondisional model A dan model B
words = ["saya", "pergi", "ke", "pasar", "pagi"]
N = len(words)

# Model A (Model terlatih baik, prediksi percaya diri)
probs_model_A = np.array([0.25, 0.15, 0.40, 0.30, 0.20])

# Model B (Model buruk, prediksi acak mendekati seragam)
probs_model_B = np.array([0.02, 0.01, 0.05, 0.02, 0.01])

def calculate_perplexity(probs):
    log_probs = np.log(probs)
    cross_entropy = -np.mean(log_probs)
    ppl = np.exp(cross_entropy)
    return cross_entropy, ppl

ce_A, ppl_A = calculate_perplexity(probs_model_A)
ce_B, ppl_B = calculate_perplexity(probs_model_B)

print("Evaluasi Komparasi Model Bahasa (Perpleksitas / PPL):")
print("-" * 65)
print(f"Model A (Superior): Cross-Entropy = {ce_A:.4f} nats | Perplexity = {ppl_A:.2f}")
print(f"Model B (Inferior): Cross-Entropy = {ce_B:.4f} nats | Perplexity = {ppl_B:.2f}")
print("-" * 65)
print(f"Interpretasi: Model A memiliki branching factor rata-rata {ppl_A:.1f} kata kandidat.")
print(f"Model dengan nilai Perpleksitas lebih rendah adalah model yang lebih baik.")
'''

subchapters.append({
    "id": "nlp-3-4-perplexity-evaluation-metric",
    "chapterId": "natural-language-processing-ch-3",
    "title": "Evaluasi Model Bahasa: Perpleksitas (Perplexity / PPL) dan Relasi Cross-Entropy",
    "description": "Metrik evaluasi intrinsik model bahasa: definisi geometrik perpleksitas, relasi terhadap cross-entropy dan information theory, serta interpretasi branching factor.",
    "estimatedMinutes": 35,
    "order": 4,
    "content": {
        "theory": (
            "Bagaimana cara kita membandingkan performa dua model bahasa secara objektif tanpa harus menerapkannya ke dalam aplikasi hilir yang mahal (seperti menjalankan seluruh sistem penerjemahan mesin)? Metode standar dalam evaluasi intrinsik adalah **Perpleksitas (*Perplexity / PPL*)**.\n\n"
            "Secara intuitif, perpleksitas mengukur seberapa 'bingung' atau terkejut (*surprised*) model bahasa ketika disodorkan sekumpulan teks uji (*test set*) yang belum pernah dilihat sebelumnya. Nilai perpleksitas yang lebih rendah mencerminkan model yang lebih baik dalam memprediksi urutan kata riil.\n\n"
            "Secara matematis, perpleksitas dari kumpulan data uji $W = (w_1, w_2, \\dots, w_N)$ didefinisikan sebagai invers dari probabilitas bersyarat geometrik seluruh korpus uji:\n"
            "$$\\text{PPL}(W) = P(w_1, w_2, \\dots, w_N)^{-\\frac{1}{N}} = \\sqrt[N]{\\frac{1}{P(w_1, w_2, \\dots, w_N)}} = \\sqrt[N]{\\prod_{i=1}^N \\frac{1}{P(w_i \\mid w_1^{i-1})}}$$\n\n"
            "Dalam implementasi numerik, perhitungan selalu ditransformasikan ke dalam ruang logaritma natural (atau basis 2) untuk menghindari floating-point underflow:\n"
            "$$\\ln \\text{PPL}(W) = -\\frac{1}{N} \\sum_{i=1}^N \\ln P(w_i \\mid w_1^{i-1}) = H(W)$$\n"
            "$$\\text{PPL}(W) = \\exp\\left( H(W) \\right) = 2^{H_2(W)}$$\n"
            "di mana $H(W)$ adalah nilai **Cross-Entropy** rata-rata per kata dari model terhadap distribusi teks empiris.\n\n"
            "**Interpretasi Faktor Percabangan (*Weighted Branching Factor*)**:\n"
            "Nilai perpleksitas $\\text{PPL} = k$ bermakna bahwa model bahasa mengalami tingkat ketidakpastian yang setara dengan memilih secara acak di antara $k$ kata kandidat yang memiliki probabilitas seragam pada setiap langkah prediksi. Jika model unigram acak memiliki kosakata $|\\mathcal{V}| = 50.000$, maka $\\text{PPL} = 50.000$. Model n-gram atau neural LM yang baik mampu menekan nilai PPL ke rentang $10 - 100$."
        ),
        "codeSnippet": code_3_4,
        "codeSnippetOutput": run_code_capture_output(code_3_4),
        "realWorldApplication": (
            "Metrik evaluasi utama pada tahap pra-pelatihan (*pre-training*) model bahasa autoregresif (GPT series, LLaMA), pemilihan hyperparameter n-gram smoothing, dan deteksi teks sintetis."
        ),
        "commonPitfalls": [
            r"Membandingkan nilai perpleksitas antara dua model yang memiliki kamus kosakata (|V|) berbeda atau strategi tokenisasi berbeda (PPL subword tidak dapat dibandingkan langsung dengan PPL word-level).",
            r"Memasukkan token OOV yang dipetakan ke <UNK> tanpa normalisasi penalti ukuran kosakata, yang secara keliru membuat model dengan banyak token OOV tampak memiliki PPL rendah.",
            r"Menghitung perpleksitas pada data latih (training set) alih-alih data uji independen (held-out test set)."
        ],
        "caseStudy": (
            "Dua tim peneliti melatih model bahasa: Tim A menggunakan word-level tokenizer (|V| = 100.000) menghasilkan PPL 85. Tim B menggunakan byte-level tokenizer (|V| = 256) menghasilkan PPL 3.2. Apakah Tim B secara otomatis menciptakan model yang jauh lebih superior? Jelaskan mengapa perbandingan PPL lintas skema tokenisasi memerlukan normalisasi per-karakter atau per-bit."
        ),
        "academicReferences": [
            r"Jelinek, F., Mercer, R. L., Bahl, L. R., & Baker, J. K. (1977). Perplexity—a measure of the difficulty of speech recognition tasks. The Journal of the Acoustical Society of America, 62(S1), S63-S63.",
            r"Brown, P. F., Pietra, V. J. D., Mercer, R. L., Pietra, S. A. D., & Lai, J. C. (1992). An estimate of an upper bound for the entropy of English. Computational Linguistics, 18(1), 31-40.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Chapter 3: Perplexity. Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 3.5: Masalah Zero-Probability pada N-gram
# ==============================================================================
code_3_5 = r'''import numpy as np

# Demonstrasi Masalah Zero-Probability (Sparsity Catastrophe) pada N-gram
# Munculnya satu n-gram yang belum pernah terlihat (count = 0) menghancurkan seluruh probabilitas kalimat menjadi 0

# Distribusi probabilitas transisi MLE dari korpus kecil
train_bigrams = {
    ("pemerintah", "resmi"): 0.4,
    ("resmi", "mengumumkan"): 0.7,
    ("mengumumkan", "kebijakan"): 0.5,
    ("kebijakan", "fiskal"): 0.3
}

# Kalimat uji 1: Seluruh bigram ada di data latih
test_sent_1 = [("pemerintah", "resmi"), ("resmi", "mengumumkan"), ("mengumumkan", "kebijakan")]

# Kalimat uji 2: Satu bigram tidak ada di data latih (misal: "mengumumkan subsidi")
test_sent_2 = [("pemerintah", "resmi"), ("resmi", "mengumumkan"), ("mengumumkan", "subsidi")]

def evaluate_sentence_mle(bigram_list):
    prob = 1.0
    for bg in bigram_list:
        p = train_bigrams.get(bg, 0.0) # Zero probability if unseen!
        prob *= p
    return prob

prob_1 = evaluate_sentence_mle(test_sent_1)
prob_2 = evaluate_sentence_mle(test_sent_2)

print("Dampak Masalah Probabilitas Nol (Zero-Probability Problem):")
print("-" * 65)
print(f"Kalimat 1 (Semua Bigram Dikenal)   : P(W) = {prob_1:.6f}")
print(f"Kalimat 2 (Satu Bigram Tak Terlihat): P(W) = {prob_2:.6f}")
print("-" * 65)
if prob_2 == 0.0:
    print("Bencana Sparsity: Log-likelihood menjadi minus tak terhingga (-inf),")
    print("dan Perpleksitas PPL menjadi tak terhingga (+inf)! Model lumpuh total.")
'''

subchapters.append({
    "id": "nlp-3-5-zero-probability-sparsity-problem",
    "chapterId": "natural-language-processing-ch-3",
    "title": "Masalah Zero-Probability pada N-gram: Ledakan Kelangkaan Data dan Bencana Probabilitas Nol",
    "description": "Analisis kegagalan MLE murni: kelangkaan kombinasi n-gram, konsekuensi perkalian nol pada evaluasi kalimat, dan kebutuhan absolut terhadap teknik smoothing.",
    "estimatedMinutes": 35,
    "order": 5,
    "content": {
        "theory": (
            "Salah satu tantangan matematis terbesar dalam pemodelan bahasa statistik berbasis n-gram adalah **Masalah Probabilitas Nol (*Zero-Probability Problem*)** atau fenomena kelangkaan data (*Data Sparsity Catastrophe*).\n\n"
            "Dalam estimasi kemungkinan maksimum (MLE), jika suatu pasangan kata atau kombinasi n-gram $(w_{i-1}, w_i)$ tidak pernah muncul dalam korpus pelatihan, maka frekuensinya bernilai nol: $C(w_{i-1}, w_i) = 0$. Akibatnya, estimasi MLE menetapkan probabilitas bersyarat:\n"
            "$$P_{\\text{MLE}}(w_i \\mid w_{i-1}) = \\frac{0}{C(w_{i-1})} = 0$$\n\n"
            "Konsekuensi sistemik dari satu nilai probabilitas nol ini sangat merusak:\n"
            "1. **Kehancuran Probabilitas Bersama**: Karena probabilitas kalimat dihitung melalui perkalian rantai:\n"
            "   $$P(W) = \\prod_{k=1}^n P(w_k \\mid w_{k-1})$$\n"
            "   maka jika ada *tepat satu saja* n-gram tak teramati di mana $P = 0$, maka seluruh probabilitas kalimat $P(W)$ akan runtuh menjadi **nol mutlak** ($0.0$), terlepas dari seberapa fasih dan masuk akalnya sisa kata lainnya dalam kalimat tersebut.\n"
            "2. **Kegagalan Metrik Evaluasi**: Dalam ruang log-likelihood, $\\ln(0) = -\\infty$. Hal ini menyebabkan nilai Cross-Entropy menjadi tak hingga, dan nilai Perpleksitas $\\text{PPL} = \\exp(+\\infty) = +\\infty$.\n"
            "3. **Ilusi Ketidakmungkinan**: Ketiadaan suatu n-gram dalam korpus pelatihan berukuran jutaan kata bukan berarti kombinasi kata tersebut mustahil terjadi dalam bahasa manusia (*grammatically impossible*); hal itu semata-mata adalah artefak keterbatasan ukuran sampel empiris (*finite sample artifact*).\n\n"
            "Oleh karena itu, model bahasa statistik tidak dapat digunakan secara praktis tanpa menerapkan algoritma **Penghalusan (*Smoothing*)** atau redistribusi massa probabilitas dari kejadian berfrekuensi tinggi kepada kejadian tak teramati."
        ),
        "codeSnippet": code_3_5,
        "codeSnippetOutput": run_code_capture_output(code_3_5),
        "realWorldApplication": (
            "Menjadi argumen teoretis fundamental yang melatarbelakangi lahirnya teknik smoothing (Laplace, Good-Turing, Kneser-Ney) dan representasi vektor kontinu dense (Word2Vec, Transformer)."
        ),
        "commonPitfalls": [
            r"Menangani probabilitas nol secara ad-hoc dengan menambahkan konstanta epsilon yang terlalu kecil sehingga menimbulkan distorsi distribusi probabilitas total yang tidak lagi menjumlah ke satu.",
            r"Mengabaikan fakta bahwa sebagian besar n-gram dalam korpus uji nyata (hingga 20-30% bigram pada korpus berita) adalah n-gram baru yang belum pernah muncul di data latih.",
            r"Menganggap pembesaran korpus latih hingga ratusan gigabyte akan menghapus masalah zero-probability (Hukum Heaps membuktikan kosakata dan kombinasi baru terus bertumbuh tanpa henti)."
        ],
        "caseStudy": (
            "Sebuah model bigram dilatih pada 1 juta kalimat korpus Wikipedia bahasa Indonesia. Kalimat uji adalah: 'Presiden meresmikan jembatan gantung terpanjang'. Jika frasa 'jembatan gantung' muncul 100 kali, tetapi frasa 'gantung terpanjang' belum pernah muncul sama sekali (count = 0), jelaskan apa yang terjadi pada evaluasi model dan bagaimana perancang sistem mencegah kegagalan fatal ini."
        ),
        "academicReferences": [
            r"Good, I. J. (1953). The population frequencies of species and the estimation of population parameters. Biometrika, 40(3-4), 237-264.",
            r"Gale, W. A., & Sampson, G. (1995). Good‐turing frequency estimation without tears. Journal of Quantitative Linguistics, 2(3), 217-237.",
            r"Chen, S. F., & Goodman, J. (1999). An empirical study of smoothing techniques for language modeling. Computer Speech & Language, 13(4), 359-394."
        ]
    }
})

# ==============================================================================
# Subbab 3.6: Laplace & Lidstone Smoothing
# ==============================================================================
code_3_6 = r'''from collections import Counter
import numpy as np

# Komparasi Laplace Smoothing (Add-1) dan Lidstone Smoothing (Add-alpha)
# P_{Laplace}(w_i | w_{i-1}) = \frac{C(w_{i-1}, w_i) + 1}{C(w_{i-1}) + |V|}
# P_{Lidstone}(w_i | w_{i-1}) = \frac{C(w_{i-1}, w_i) + \alpha}{C(w_{i-1}) + \alpha |V|}

V_size = 10000  # Ukuran kamus kosakata
c_history = 50   # Misal kata w_{i-1} muncul 50 kali

# Hitungan n-gram teramati dan tak teramati
c_observed = 10  # Pasangan teramati
c_unseen = 0    # Pasangan baru (zero count)

def smooth_prob(c_pair, c_hist, V, alpha=1.0):
    return (c_pair + alpha) / (c_hist + alpha * V)

p_mle_obs = c_observed / c_history
p_mle_unseen = 0.0

p_laplace_obs = smooth_prob(c_observed, c_history, V_size, alpha=1.0)
p_laplace_unseen = smooth_prob(c_unseen, c_history, V_size, alpha=1.0)

p_lidstone_obs = smooth_prob(c_observed, c_history, V_size, alpha=0.05)
p_lidstone_unseen = smooth_prob(c_unseen, c_history, V_size, alpha=0.05)

print("Analisis Redistribusi Probabilitas:")
print("-" * 75)
print(f"Konfigurasi: Count History = {c_history}, Kosakata |V| = {V_size}\n")
print(f"1. MLE Murni:")
print(f"   P(Teramati)    = {p_mle_obs:.6f}")
print(f"   P(Tak Teramati)= {p_mle_unseen:.6f}")
print(f"\n2. Laplace Smoothing (Add-1, alpha = 1.0):")
print(f"   P(Teramati)    = {p_laplace_obs:.6f}  (Turun drastis karena |V| membebani penyebut!)")
print(f"   P(Tak Teramati)= {p_laplace_unseen:.6f}")
print(f"\n3. Lidstone Smoothing (Add-alpha, alpha = 0.05):")
print(f"   P(Teramati)    = {p_lidstone_obs:.6f}  (Jauh lebih mendekati frekuensi empiris)")
print(f"   P(Tak Teramati)= {p_lidstone_unseen:.6f}")
print("-" * 75)
print("Lidstone dengan alpha kecil mencegah diskon berlebihan terhadap n-gram teramati.")
'''

subchapters.append({
    "id": "nlp-3-6-laplace-lidstone-smoothing",
    "chapterId": "natural-language-processing-ch-3",
    "title": "Laplace Smoothing (Add-1) & Lidstone Smoothing (Add-alpha): Teori Reduksi dan Penalti Kosakata",
    "description": "Formulasi penghalusan aditif: penambahan pseudocount, redistribusi massa probabilitas, dampak ukuran kosakata |V|, dan optimasi parameter alpha pada Lidstone smoothing.",
    "estimatedMinutes": 35,
    "order": 6,
    "content": {
        "theory": (
            "Gagasan paling sederhana dan intuitif untuk mengatasi masalah probabilitas nol adalah menambahkan sejumlah angka semu (*pseudocount*) ke setiap kemungkinan n-gram sebelum melakukan normalisasi. Teknik tertua dari keluarga ini diperkenalkan oleh Pierre-Simon Laplace pada abad ke-18, yang dikenal sebagai **Laplace Smoothing (Add-1 Smoothing)**.\n\n"
            "Dalam Laplace smoothing, kita berpura-pura telah melihat setiap kemungkinan kombinasi n-gram tepat satu kali lebih banyak dari kenyataannya. Formulasi untuk unigram dan bigram adalah:\n"
            "$$P_{\\text{Laplace}}(w_i) = \\frac{C(w_i) + 1}{N + |\\mathcal{V}|}$$\n"
            "$$P_{\\text{Laplace}}(w_i \\mid w_{i-1}) = \\frac{C(w_{i-1}, w_i) + 1}{C(w_{i-1}) + |\\mathcal{V}|}$$\n"
            "di mana $|\\mathcal{V}|$ ditambahkan pada penyebut agar total probabilitas bersyarat tetap memenuhi aksioma probabilitas: $\\sum_{w_i \\in \\mathcal{V}} P(w_i \\mid w_{i-1}) = 1$.\n\n"
            "**Kelemahan Kritis Laplace Smoothing pada Kosakata Besar**:\n"
            "Meskipun elegan, Laplace smoothing bekerja sangat buruk pada model bahasa n-gram modern dengan ukuran kosakata besar (misal $|\\mathcal{V}| = 100.000$). Jika $C(w_{i-1}) = 50$, penyebut melonjak menjadi $50 + 100.000 = 100.050$. Akibatnya, n-gram teramati yang sering muncul dipotong probabilitasnya secara sangat drastis, sementara massa probabilitas raksasa justru dibuang untuk mensubsidi puluhan ribu kombinasi yang tidak pernah ada.\n\n"
            "Untuk meringankan penalti yang terlalu agresif ini, **Lidstone Smoothing (Add-$\\alpha$ Smoothing)** memperkenalkan parameter pecahan bebas $0 < \\alpha < 1$ (misal $\\alpha = 0.05$ atau $\\alpha = 0.01$):\n"
            "$$P_{\\text{Lidstone}}(w_i \\mid w_{i-1}) = \\frac{C(w_{i-1}, w_i) + \\alpha}{C(w_{i-1}) + \\alpha |\\mathcal{V}|}$$\n"
            "Dengan menyetel $\\alpha \\ll 1$, pemotongan massa probabilitas dari n-gram teramati dapat dikurangi secara signifikan sambil tetap memastikan tidak ada n-gram dengan probabilitas nol mutlak."
        ),
        "codeSnippet": code_3_6,
        "codeSnippetOutput": run_code_capture_output(code_3_6),
        "realWorldApplication": (
            "Standar de facto untuk klasifikasi teks Naive Bayes (di mana add-1 smoothing sangat efektif karena jumlah kelas sedikit), serta baseline cepat pada pengindeksan dokumen IR."
        ),
        "commonPitfalls": [
            r"Menggunakan Laplace Add-1 pada model bigram atau trigram dengan kosakata besar yang menyebabkan perpleksitas model justru melonjak sangat tinggi.",
            r"Lupa mengalikan |V| dengan alpha pada penyebut Lidstone smoothing sehingga total probabilitas tidak lagi bernilai satu.",
            r"Mengoptimalkan parameter alpha pada data uji (test set) alih-alih pada validation/held-out set."
        ],
        "caseStudy": (
            "Dalam pengklasifikasi spam Naive Bayes, sebuah kata 'jackpot' memiliki count 0 di kelas ham dan count 50 di kelas spam. Mengapa penerapan Laplace smoothing berhasil menyelamatkan inferensi posterior Bayes dari keruntuhan ke nol, namun pada model bahasa trigram teknik yang sama menghasilkan degradasi performa?"
        ),
        "academicReferences": [
            r"Laplace, P. S. (1814). Essai philosophique sur les probabilités. Mme. Ve. Courcier.",
            r"Lidstone, G. J. (1920). Note on the general case of the Bayes-Laplace formula for inductive probabilities. Transactions of the Faculty of Actuaries, 8, 182-192.",
            r"Manning, C. D., Raghavan, P., & Schütze, H. (2008). Introduction to Information Retrieval. Chapter 13: Text classification and Naive Bayes. Cambridge University Press."
        ]
    }
})

# ==============================================================================
# Subbab 3.7: Good-Turing Frequency Estimation
# ==============================================================================
code_3_7 = r'''from collections import Counter
import numpy as np

# Good-Turing Frequency Estimation
# r* = (r + 1) * \frac{N_{r+1}}{N_r}
# Total probabilitas untuk kejadian tak teramati (r = 0): P(unseen) = \frac{N_1}{N}

# Simulasi hitungan kemunculan kata pada korpus kecil
word_counts = Counter({
    "dan": 500, "di": 450, "yang": 400, "ke": 200, "ini": 150,
    "buku": 10, "meja": 5, "komputer": 4, "laptop": 3,
    "antigravity": 2, "quantum": 2,
    "velqora": 1, "nebula": 1, "zephyr": 1, "vortex": 1 # Singletons (N_1 = 4)
})

# Hitung N_r: frekuensi dari frekuensi r
r_counts = Counter(word_counts.values())
N_total = sum(word_counts.values())

N_1 = r_counts[1]
P_unseen = N_1 / N_total

print("Good-Turing Frequency Estimation:")
print("-" * 70)
print(f"Total Token Korpus (N)           = {N_total}")
print(f"Jumlah Singleton (N_1, r = 1)   = {N_1} (kata yang muncul tepat 1 kali)")
print(f"Probabilitas Massa Unseen P_0    = N_1 / N = {P_unseen:.6f} ({P_unseen * 100:.2f}%)")
print("-" * 70)
print(f"{'Frekuensi Asli (r)':<20} | {'Jumlah Tipe (N_r)':<18} | {'Frekuensi Disesuaikan (r*)':<25}")
print("-" * 70)

for r in range(1, 4):
    n_r = r_counts.get(r, 0)
    n_r_plus_1 = r_counts.get(r + 1, 0)
    if n_r > 0 and n_r_plus_1 > 0:
        r_star = (r + 1) * (n_r_plus_1 / n_r)
        print(f"r = {r:<16} | N_{r:<14} = {n_r:<3} | r* = {r_star:.4f}")

print("-" * 70)
print("Good-Turing menggunakan proporsi singleton N_1 untuk memprediksi probabilitas tak teramati.")
'''

subchapters.append({
    "id": "nlp-3-7-good-turing-frequency-estimation",
    "chapterId": "natural-language-processing-ch-3",
    "title": "Good-Turing Frequency Estimation: Memprediksi Probabilitas Kejadian Tak Teramati dari Singletons",
    "description": "Teori estimasi frekuensi Alan Turing & I.J. Good: redistribusi massa probabilitas menggunakan statistik frekuensi dari frekuensi N_r dan peran singletons N_1.",
    "estimatedMinutes": 35,
    "order": 7,
    "content": {
        "theory": (
            "Dikembangkan oleh matematikawan Alan Turing dan asistennya I. J. Good saat memecahkan kode sandi Enigma Jerman di Bletchley Park selama Perang Dunia II, **Estimasi Frekuensi Good-Turing (*Good-Turing Frequency Estimation*)** adalah salah satu pencapaian paling revolusioner dalam statistika data langka.\n\n"
            "Alih-alih menambahkan angka semu sembarangan seperti pada Laplace smoothing, Good-Turing menggunakan informasi empiris dari kejadian-kejadian yang **muncul tepat satu kali (*Singletons*)** untuk mengestimasi probabilitas total dari kejadian yang belum pernah muncul sama sekali (*Unseen Events*).\n\n"
            "Misalkan $N_r$ adalah jumlah tipe n-gram yang muncul tepat $r$ kali dalam korpus data latih (sering disebut sebagai frekuensi dari frekuensi / *frequency of frequencies*). Total token dalam korpus adalah $N = \\sum_{r=1}^\\infty r N_r$.\n\n"
            "Formulasi Good-Turing merumuskan bahwa probabilitas total dari seluruh kejadian tak teramati ($r = 0$) adalah proporsi kemunculan singleton terhadap total ukuran korpus:\n"
            "$$P_{\\text{GT}}(\\text{unseen}) = \\frac{N_1}{N}$$\n\n"
            "Logika intuitifnya sangat elegan: seberapa sering kita akan menjumpai kata atau n-gram baru saat membaca teks selanjutnya? Frekuensinya kira-kira sama dengan seberapa sering kita baru pertama kali melihat kata langka (singleton) selama membaca teks sejauh ini!\n\n"
            "Untuk n-gram yang telah teramati dengan frekuensi $r > 0$, Good-Turing mendiskon hitungan aslinya menjadi **hitungan disesuaikan (*adjusted count*) $r^*$**:\n"
            "$$r^* = (r + 1) \\frac{N_{r+1}}{N_r}$$\n"
            "Dan probabilitas bersyaratnya dihitung sebagai:\n"
            "$$P_{\\text{GT}}(w) = \\frac{r^*}{N}$$\n\n"
            "Karena kurva $N_r$ menjadi bising dan berlubang (*sparse with zeros*) untuk nilai $r$ yang besar, implementasi praktis (seperti *Simple Good-Turing* oleh Gale & Sampson) menerapkan regresi linear log-log $\\ln N_r = a + b \\ln r$ untuk menghaluskan nilai $N_r$."
        ),
        "codeSnippet": code_3_7,
        "codeSnippetOutput": run_code_capture_output(code_3_7),
        "realWorldApplication": (
            "Estimasi keanekaragaman spesies ekologi, estimasi kosakata kamus tak terhingga, dan komponen inti dalam pemodelan akustik Katz Backoff."
        ),
        "commonPitfalls": [
            r"Kegagalan penanganan ketika N_{r+1} bernilai 0 (lubang data) yang menghasilkan r* bernilai nol jika tidak dihaluskan dengan Simple Good-Turing linear smoothing.",
            r"Menerapkan Good-Turing pada r yang sangat besar di mana count empiris MLE sudah sangat akurat dan tidak memerlukan diskon.",
            r"Lupa melakukan renormalisasi probabilitas total jika r* hanya diterapkan pada r bernilai kecil."
        ],
        "caseStudy": (
            "Dalam korpus zoologi 10.000 pengamatan hewan, terdapat 100 spesies yang hanya teramati tepat 1 kali (N_1 = 100). Hitung estimasi Good-Turing untuk probabilitas bahwa hewan berikutnya yang ditemukan oleh peneliti adalah spesies yang belum pernah tercatat sebelumnya."
        ),
        "academicReferences": [
            r"Good, I. J. (1953). The population frequencies of species and the estimation of population parameters. Biometrika, 40(3-4), 237-264.",
            r"Gale, W. A., & Sampson, G. (1995). Good‐turing frequency estimation without tears. Journal of Quantitative Linguistics, 2(3), 217-237.",
            r"Church, K. W., & Gale, W. A. (1991). A comparison of the enhanced Good-Turing and deleted estimation methods for estimating probabilities of English bigrams. Computer Speech & Language, 5(1), 19-54."
        ]
    }
})

# ==============================================================================
# Subbab 3.8: Jelinek-Mercer Interpolation
# ==============================================================================
code_3_8 = r'''import numpy as np

# Jelinek-Mercer Interpolation untuk Trigram
# P_{interp}(w_i | w_{i-2}, w_{i-1}) = \lambda_3 P_{MLE}(w_i | w_{i-2}, w_{i-1}) + \lambda_2 P_{MLE}(w_i | w_{i-1}) + \lambda_1 P_{MLE}(w_i)
# Syarat: \lambda_1 + \lambda_2 + \lambda_3 = 1, \lambda_i >= 0

# Simulasi nilai probabilitas MLE empiris dari korpus
p_trigram_mle = 0.0   # Trigram "saya pergi berlibur" tidak ada di korpus (count = 0)
p_bigram_mle = 0.15   # Bigram "pergi berlibur" ada di korpus
p_unigram_mle = 0.02  # Unigram "berlibur" ada di korpus

# Parameter interpolasi bobot tetap (linear interpolation weights)
lambda_3 = 0.6
lambda_2 = 0.3
lambda_1 = 0.1
assert np.isclose(lambda_1 + lambda_2 + lambda_3, 1.0)

# Kalkulasi probabilitas terinterpolasi
p_interpolated = (lambda_3 * p_trigram_mle) + (lambda_2 * p_bigram_mle) + (lambda_1 * p_unigram_mle)

print("Jelinek-Mercer Linear Interpolation Trigram:")
print("-" * 65)
print(f"P_MLE Trigram (w_i | w_{{i-2}}, w_{{i-1}}) = {p_trigram_mle:.4f} (Bobot lambda_3 = {lambda_3})")
print(f"P_MLE Bigram  (w_i | w_{{i-1}})          = {p_bigram_mle:.4f} (Bobot lambda_2 = {lambda_2})")
print(f"P_MLE Unigram (w_i)                    = {p_unigram_mle:.4f} (Bobot lambda_1 = {lambda_1})")
print("-" * 65)
print(f"Hasil Interpolasi P_interp(w_i | w_{{i-2}}, w_{{i-1}}) = {p_interpolated:.6f}")
print("Meskipun Trigram berprobabilitas nol, informasi Bigram dan Unigram menyelamatkan estimasi.")
'''

subchapters.append({
    "id": "nlp-3-8-jelinek-mercer-interpolation",
    "chapterId": "natural-language-processing-ch-3",
    "title": "Jelinek-Mercer Interpolation: Menggabungkan Estimasi N-gram Bertingkat Secara Proporsional",
    "description": "Prinsip interpolasi linier model bahasa bertingkat: penggabungan unigram, bigram, dan trigram menggunakan koefisien pembobotan lambda, serta optimasi Expectation-Maximization.",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "Jika kita ingin menghitung probabilitas sebuah trigram $P(w_n \\mid w_{n-2}, w_{n-1})$ yang tidak pernah muncul dalam korpus, haruskah kita memperlakukan seluruh kata target secara seragam? Tentu tidak. Kata target yang merupakan kata umum (seperti *\"buku\"*) jauh lebih mungkin terjadi daripada kata langka (seperti *\"ornitorinkus\"*).\n\n"
            "Prinsip fundamental dari **Interpolasi Linier Jelinek-Mercer (*Jelinek-Mercer Linear Interpolation*)** adalah selalu menggabungkan bukti statistik dari model orde lebih tinggi dengan model orde lebih rendah secara proporsional. Dengan demikian, jika bukti orde tinggi langka, model secara mulus bersandar pada distribusi orde rendah yang lebih kaya data.\n\n"
            "Untuk model trigram, probabilitas terinterpolasi dirumuskan sebagai kombinasi cembung (*convex combination*) dari estimasi MLE trigram, bigram, dan unigram:\n"
            "$$P_{\\text{interp}}(w_i \\mid w_{i-2}, w_{i-1}) = \\lambda_3 P_{\\text{MLE}}(w_i \\mid w_{i-2}, w_{i-1}) + \\lambda_2 P_{\\text{MLE}}(w_i \\mid w_{i-1}) + \\lambda_1 P_{\\text{MLE}}(w_i)$$\n"
            "dengan batasan matematis:\n"
            "$$\\sum_{j=1}^3 \\lambda_j = 1 \\quad \\text{dan} \\quad \\lambda_j \\ge 0$$\n\n"
            "**Interpolasi Kontekstual (*Context-Dependent Lambdas*)**:\n"
            "Dalam formulasi lanjutan, nilai $\\lambda$ tidak dibuat statis untuk seluruh korpus, melainkan dibuat bergantung pada frekuensi riwayat konteks $\\lambda(w_{i-2}^{i-1})$. Jika konteks $(w_{i-2}, w_{i-1})$ sangat sering muncul (misal ribuan kali), kita memiliki kepercayaan diri tinggi terhadap estimasi trigram sehingga $\\lambda_3$ disetel mendekati 1. Sebaliknya, jika riwayat konteks jarang muncul, $\\lambda_3$ bernilai kecil dan bobot digeser ke bigram dan unigram.\n\n"
            "Parameter $\\lambda$ dioptimalkan secara otomatis menggunakan algoritma **Expectation-Maximization (EM)** pada korpus validasi independen (*held-out validation set*) untuk meminimalkan nilai perpleksitas."
        ),
        "codeSnippet": code_3_8,
        "codeSnippetOutput": run_code_capture_output(code_3_8),
        "realWorldApplication": (
            "Model bahasa n-gram pada sistem keyboard cerdas (Gboard, SwiftKey), modul scoring terjemahan mesin statistik (Moses), dan perankingan dokumen BM25-LM pada Information Retrieval."
        ),
        "commonPitfalls": [
            r"Menyetel parameter lambda pada korpus pelatihan latih (training data) yang akan menyebabkan lambda_3 bernilai 1.0 (overfitting ekstrem) dan mengabaikan unigram.",
            r"Lupa menegakkan konstrain penjumlahan lambda = 1 sehingga distribusi probabilitas yang dihasilkan tidak valid.",
            r"Mengabaikan unigram MLE termurah yang menjadi pengaman terakhir ketika bigram pun bernilai nol."
        ],
        "caseStudy": (
            "Diberikan kalimat uji dengan riwayat konteks yang sangat langka. Bandingkan bagaimana model Backoff murni (yang hanya mengambil satu distribusi tunggal) versus Interpolasi Jelinek-Mercer (yang selalu memadukan seluruh orde) memperlakukan kata target berfrekuensi tinggi versus kata target berfrekuensi rendah."
        ),
        "academicReferences": [
            r"Jelinek, F., & Mercer, R. L. (1980). Interpolated estimation of Markov source parameters from sparse data. In Proceedings of the Workshop on Pattern Recognition in Practice (pp. 381-397).",
            r"Bahl, L. R., Jelinek, F., & Mercer, R. L. (1983). A maximum likelihood approach to continuous speech recognition. IEEE Transactions on Pattern Analysis and Machine Intelligence, (2), 179-190.",
            r"Chen, S. F., & Goodman, J. (1999). An empirical study of smoothing techniques for language modeling. Computer Speech & Language, 13(4), 359-394."
        ]
    }
})

# ==============================================================================
# Subbab 3.9: Katz Backoff & Kneser-Ney Smoothing (Spot-Check 3)
# ==============================================================================
code_3_9 = r'''from collections import defaultdict, Counter
import numpy as np

# Implementasi Kneser-Ney Smoothing (Absolute Discounting & Continuation Probability)
# P_{KN}(w_i | w_{i-1}) = \frac{\max(C(w_{i-1}, w_i) - d, 0)}{C(w_{i-1})} + \lambda(w_{i-1}) P_{continuation}(w_i)
# P_{continuation}(w_i) = \frac{|\{w_{i-1} : C(w_{i-1}, w_i) > 0\}|}{\sum_{w'} |\{w_{i-1} : C(w_{i-1}, w') > 0\}|}

# Korpus mainan dengan fenomena "San Francisco":
# Kata "Francisco" sering muncul, tapi HANYA mengikuti kata "San".
# Sebaliknya, kata "kopi" muncul mengikuti berbagai kata konteks ("minum kopi", "beli kopi", "secangkir kopi").
corpus = [
    "saya tinggal di San Francisco",
    "dia pergi ke San Francisco",
    "mereka berlibur ke San Francisco",
    "ayah suka minum kopi",
    "ibu mau beli kopi",
    "kakak memesan secangkir kopi"
]

bigram_counts = Counter()
unigram_counts = Counter()
preceding_contexts = defaultdict(set) # {w_i: set of w_{i-1}}

for sent in corpus:
    tokens = sent.split()
    for t in tokens:
        unigram_counts[t] += 1
    for i in range(len(tokens) - 1):
        w_prev, w_curr = tokens[i], tokens[i+1]
        bigram_counts[(w_prev, w_curr)] += 1
        preceding_contexts[w_curr].add(w_prev)

total_bigram_types = len(bigram_counts)
d = 0.75 # Discount parameter standar

# Hitung Continuation Probability
def p_continuation(w):
    num_histories = len(preceding_contexts[w])
    return num_histories / total_bigram_types

print("Komparasi Kneser-Ney Continuation Probability vs Unigram MLE:")
print("-" * 75)
for target in ["Francisco", "kopi"]:
    c_raw = unigram_counts[target]
    n_hist = len(preceding_contexts[target])
    p_cont = p_continuation(target)
    print(f"Target: '{target}':")
    print(f"  - Unigram Count Mentah C(w)             = {c_raw}")
    print(f"  - Jumlah Konteks Pendahulu Unik |{{h}}|  = {n_hist}")
    print(f"  - P_continuation(w)                    = {p_cont:.4f}")

print("-" * 75)
print("Penjelasan Kneser-Ney (1995): 'Francisco' memiliki hitungan unigram tinggi,")
print("tetapi probabilitas kelanjutan sangat rendah karena hanya pernah mengikuti 'San'.")
print("Sebaliknya 'kopi' fleksibel mengikuti banyak riwayat, sehingga P_continuation tinggi.")
'''

subchapters.append({
    "id": "nlp-3-9-katz-backoff-kneser-ney-smoothing",
    "chapterId": "natural-language-processing-ch-3",
    "title": "Katz Backoff & Kneser-Ney Smoothing: Formulasi Absolute Discounting dan Continuation Probability",
    "description": "Algoritma penghalusan kanonikal state-of-the-art: Katz backoff, pemotongan absolut (absolute discounting), dan derivasi Kneser-Ney continuation probability (Spot-Check Literatur Primer).",
    "estimatedMinutes": 40,
    "order": 9,
    "content": {
        "theory": (
            "Di antara seluruh metode penghalusan statistik yang pernah diciptakan dalam sejarah pemrosesan bahasa alami, **Kneser-Ney Smoothing** (Kneser & Ney, 1995; Chen & Goodman, 1996) diakui secara universal sebagai algoritma n-gram smoothing paling unggul dan konsisten mengungguli teknik lainnya.\n\n"
            "Kneser-Ney dibangun di atas dua fondasi matematis utama:\n"
            "1. **Diskon Absolut (*Absolute Discounting*)**:\n"
            "Penelitian empiris oleh Church & Gale (1991) membuktikan bahwa kurva diskon frekuensi Good-Turing mendekati pengurangan substraktif konstan $d \\approx 0.75$ untuk hampir semua n-gram teramati ($C > 0$). Maka alih-alih mengalikan rasio, hitungan langsung dikurangi parameter tetap $d$:\n"
            "$$C_{\\text{discounted}}(w_{i-1}, w_i) = \\max(C(w_{i-1}, w_i) - d, 0)$$\n\n"
            "2. **Probabilitas Kelanjutan (*Continuation Probability*)**:\n"
            "Inovasi paling revolusioner dari Reinhard Kneser & Hermann Ney (1995) adalah pemahaman bahwa ketika model harus mundur (*backoff*) ke orde lebih rendah (unigram), unigram standar $C(w)/N$ memberikan estimasi yang salah. Contoh klasik adalah kata *\"Francisco\"*. Kata ini memiliki frekuensi unigram yang sangat tinggi dalam korpus berita karena sering muncul dalam entitas nama kota *\"San Francisco\"*. Namun, *\"Francisco\"* hampir tidak pernah muncul setelah kata lain selain *\"San\"*. Jika model trigram menghadapi konteks baru seperti *\"secangkir [? ]\"*, model unigram biasa akan memberikan probabilitas tinggi pada *\"Francisco\"* hanya karena frekuensi mentahnya tinggi, menghasilkan frasa aneh *\"secangkir Francisco\"*.\n\n"
            "Kneser-Ney memecahkan masalah ini dengan mengganti frekuensi unigram dengan **Probabilitas Kelanjutan (*Continuation Probability*)**: seberapa fleksibel kata tersebut melengkapi sembarang riwayat konteks baru yang belum pernah terlihat:\n"
            "$$P_{\\text{continuation}}(w_i) = \\frac{|\\{w_{i-1} : C(w_{i-1}, w_i) > 0\\}|}{\\sum_{w'} |\\{w_{i-1} : C(w_{i-1}, w') > 0\\}|} = \\frac{|\\{w_{i-1} : C(w_{i-1}, w_i) > 0\\}|}{|\\{(w_{j-1}, w_j) : C(w_{j-1}, w_j) > 0\\}|}$$\n\n"
            "Formulasi lengkap Interpolated Kneser-Ney untuk Bigram:\n"
            "$$P_{\\text{KN}}(w_i \\mid w_{i-1}) = \\frac{\\max(C(w_{i-1}, w_i) - d, 0)}{C(w_{i-1})} + \\lambda(w_{i-1}) P_{\\text{continuation}}(w_i)$$\n"
            "di mana faktor normalisasi $\\lambda(w_{i-1})$ mengumpulkan seluruh massa probabilitas yang dipotong oleh diskon $d$ dan mendistribusikannya kembali:\n"
            "$$\\lambda(w_{i-1}) = \\frac{d}{C(w_{i-1})} \\cdot |\\{w : C(w_{i-1}, w) > 0\\}|$$\n\n"
            "Dalam **Modified Kneser-Ney** (Chen & Goodman, 1996), diskon konstan tunggal $d$ diperluas menjadi tiga parameter diskon terpisah ($d_1, d_2, d_{3+}$) tergantung apakah hitungan n-gram bernilai 1, 2, atau $\\ge 3$, menghasilkan performa pemodelan bahasa terbaik sebelum era deep learning."
        ),
        "codeSnippet": code_3_9,
        "codeSnippetOutput": run_code_capture_output(code_3_9),
        "realWorldApplication": (
            "Komponen inti mesin translasi Moses, decoder pengenalan wicara Kaldi, dan toolkit pemodelan bahasa produksi tinggi (KenLM, SRILM)."
        ),
        "commonPitfalls": [
            r"Mengganti continuation probability dengan unigram count biasa C(w)/N pada lower-order distribution (kesalahan umum yang menghancurkan sifat Kneser-Ney menjadi sekadar absolute discounting biasa).",
            r"Menyetel diskon d lebih besar dari count n-gram minimum sehingga nilai probabilitas menjadi negatif.",
            r"Lupa menghitung faktor normalisasi lambda(w_{i-1}) secara tepat per-riwayat konteks."
        ],
        "caseStudy": (
            "Bandingkan bagaimana estimasi probabilitas transisi P('Francisco' | 'makan') versus P('apel' | 'makan') diputuskan oleh: (a) Absolute Discounting dengan Unigram MLE, dan (b) Kneser-Ney Smoothing dengan Continuation Probability. Jelaskan mengapa pendekatan kedua jauh lebih masuk akal secara linguistik."
        ),
        "academicReferences": [
            r"Kneser, R., & Ney, H. (1995). Improved backing-off for m-gram language modeling. In 1995 International Conference on Acoustics, Speech, and Signal Processing (ICASSP) (Vol. 1, pp. 181-184). IEEE.",
            r"Chen, S. F., & Goodman, J. (1996). An empirical study of smoothing techniques for language modeling. In Proceedings of the 34th Annual Meeting of the Association for Computational Linguistics (pp. 310-318).",
            r"Chen, S. F., & Goodman, J. (1999). An empirical study of smoothing techniques for language modeling. Computer Speech & Language, 13(4), 359-394."
        ]
    }
})

# ==============================================================================
# Subbab 3.10: Implementasi Model Bahasa Trigram NumPy
# ==============================================================================
code_3_10 = r'''from collections import defaultdict, Counter
import numpy as np

# Implementasi Model Bahasa Trigram Lengkap dengan Laplace & Interpolation Smoothing Berbasis NumPy
class TrigramLanguageModel:
    def __init__(self, smoothing="interpolation", alpha=0.01, lambdas=(0.6, 0.3, 0.1)):
        self.smoothing = smoothing
        self.alpha = alpha
        self.lambdas = lambdas # (lambda_3, lambda_2, lambda_1)
        self.unigram_counts = Counter()
        self.bigram_counts = Counter()
        self.trigram_counts = Counter()
        self.vocab = set()
        self.total_tokens = 0
        
    def fit(self, sentences):
        for sent in sentences:
            tokens = ["<s>", "<s>"] + sent.strip().lower().split() + ["</s>"]
            for t in tokens:
                self.vocab.add(t)
                self.unigram_counts[t] += 1
                self.total_tokens += 1
            for i in range(len(tokens) - 1):
                self.bigram_counts[(tokens[i], tokens[i+1])] += 1
            for i in range(len(tokens) - 2):
                self.trigram_counts[(tokens[i], tokens[i+1], tokens[i+2])] += 1
                
    def get_prob(self, w1, w2, w3):
        # P(w3 | w1, w2)
        v_size = len(self.vocab)
        c_tri = self.trigram_counts.get((w1, w2, w3), 0)
        c_bi_hist = self.bigram_counts.get((w1, w2), 0)
        c_bi_pair = self.bigram_counts.get((w2, w3), 0)
        c_uni_hist = self.unigram_counts.get(w2, 0)
        c_uni_target = self.unigram_counts.get(w3, 0)
        
        if self.smoothing == "laplace":
            return (c_tri + self.alpha) / (c_bi_hist + self.alpha * v_size)
            
        elif self.smoothing == "interpolation":
            l3, l2, l1 = self.lambdas
            p3 = (c_tri / c_bi_hist) if c_bi_hist > 0 else 0.0
            p2 = (c_bi_pair / c_uni_hist) if c_uni_hist > 0 else 0.0
            p1 = (c_uni_target / self.total_tokens) if self.total_tokens > 0 else (1.0 / v_size)
            return (l3 * p3) + (l2 * p2) + (l1 * p1)

    def sentence_perplexity(self, sentence):
        tokens = ["<s>", "<s>"] + sentence.strip().lower().split() + ["</s>"]
        log_prob_sum = 0.0
        n = len(tokens) - 2
        for i in range(len(tokens) - 2):
            w1, w2, w3 = tokens[i], tokens[i+1], tokens[i+2]
            p = self.get_prob(w1, w2, w3)
            p = max(p, 1e-12) # Safety epsilon
            log_prob_sum += np.log(p)
        ppl = np.exp(-log_prob_sum / n)
        return ppl

corpus = [
    "kecerdasan buatan berkembang sangat pesat di era modern",
    "pemrosesan bahasa alami adalah cabang dari kecerdasan buatan",
    "model bahasa memprediksi kata berikutnya dalam suatu kalimat",
    "pembelajaran mendalam merevolusi teknologi visi komputer dan nlp"
]

model_interp = TrigramLanguageModel(smoothing="interpolation")
model_interp.fit(corpus)

test_sent_in_domain = "kecerdasan buatan berkembang sangat pesat"
test_sent_unseen = "teknologi kecerdasan buatan sangat modern"

ppl_in = model_interp.sentence_perplexity(test_sent_in_domain)
ppl_unseen = model_interp.sentence_perplexity(test_sent_unseen)

print("Evaluasi Model Bahasa Trigram NumPy:")
print("-" * 65)
print(f"Ukuran Kosakata |V|     = {len(model_interp.vocab)} kata unik")
print(f"Total Token Korpus N    = {model_interp.total_tokens} token")
print("-" * 65)
print(f"Kalimat Latih (In-Domain): '{test_sent_in_domain}'")
print(f"  -> Perpleksitas (PPL)  = {ppl_in:.2f}")
print(f"\nKalimat Baru (Unseen):     '{test_sent_unseen}'")
print(f"  -> Perpleksitas (PPL)  = {ppl_unseen:.2f}")
print("-" * 65)
print("Model berhasil menghitung PPL kalimat baru tanpa masalah zero-probability berkat interpolasi.")
'''

subchapters.append({
    "id": "nlp-3-10-trigram-lm-numpy-implementation",
    "chapterId": "natural-language-processing-ch-3",
    "title": "Implementasi Model Bahasa Trigram Lengkap dengan Laplace & Interpolation Smoothing Berbasis NumPy",
    "description": "Konstruksi menyeluruh class TrigramLanguageModel dari nol: struktur data hash n-gram, padding batas kalimat, evaluasi perpleksitas kalimat, dan perbandingan smoothing.",
    "estimatedMinutes": 45,
    "order": 10,
    "content": {
        "theory": (
            "Pada subbab penutup Bab 3 ini, kita mengintegrasikan seluruh konsep teoretis yang telah dibahas—mulai dari asumsi Markov rantai trigram, padding batas awal dan akhir kalimat, estimasi probabilitas bersyarat, skema penghalusan aditif (Laplace/Lidstone) dan skema interpolasi cembung Jelinek-Mercer, hingga evaluasi perpleksitas numerik—ke dalam satu arsitektur terpadu berbasis Python murni dan NumPy.\n\n"
            "Arsitektur class `TrigramLanguageModel` dirancang dengan komponen inti berikut:\n"
            "1. **Prapemrosesan Sekuensial & Padding Token**:\n"
            "   Setiap kalimat uji disematkan dua token awal `<s> <s>` untuk memfasilitasi probabilitas kondisional dari kata pertama $P(w_1 \\mid \\text{<s>}, \\text{<s>})$ dan kata kedua $P(w_2 \\mid \\text{<s>}, w_1)$, serta satu token akhir `</s>` untuk memastikan model memodelkan probabilitas terminasi kalimat secara valid.\n"
            "2. **Pencatatan Frekuensi Bertingkat**:\n"
            "   Menggunakan struktur data counter kamus untuk merekam frekuensi unigram $C(w)$, bigram $C(w_1, w_2)$, dan trigram $C(w_1, w_2, w_3)$ secara efisien dalam satu lintasan linear $\\mathcal{O}(N)$.\n"
            "3. **Metode Inferensi Bersyarat `get_prob(w1, w2, w3)`**:\n"
            "   Mendukung pergantian skema penghalusan antara Laplace Add-$\\alpha$ smoothing dan Jelinek-Mercer linear interpolation dengan parameter $(\\lambda_3, \\lambda_2, \\lambda_1)$.\n"
            "4. **Evaluasi Perpleksitas `sentence_perplexity(sentence)`**:\n"
            "   Menghitung cross-entropy empiris rata-rata dalam ruang logaritma natural untuk mencegah keruntuhan angka mengambang (*floating-point underflow*) dan menghasilkan metrik perpleksitas akhir melalui transformasi eksponensial $\\text{PPL} = \\exp(-\\frac{1}{n} \\sum \\ln P)$.\n\n"
            "Secara komputasional, evaluasi probabilitas kalimat pada skala korpus masif menuntut efisiensi aljabar dan perlindungan ketat terhadap underflow numerik. Dalam implementasi kita, fungsi probabilitas bersyarat $P(w_3 \\mid w_1, w_2)$ mengevaluasi distribusi frekuensi n-gram bertingkat dalam waktu konstan berkat struktur tabel hash. Dengan mengombinasikan bobot interpolasi $\\sum_{j=1}^3 \\lambda_j = 1$ secara ketat, model menjamin bahwa probabilitas akhir terdistribusi secara sah di atas ruang simpleks $\\Delta^{|\\mathcal{V}|-1}$ tanpa menyisakan lubang probabilitas nol pada korpus uji."
        ),
        "codeSnippet": code_3_10,
        "codeSnippetOutput": run_code_capture_output(code_3_10),
        "realWorldApplication": (
            "Dijadikan modul baseline formal untuk perbandingan performa model bahasa neural dan Transformer pada benchmark korpus bahasa daerah atau teks berdaya komputasi ultra-rendah."
        ),
        "commonPitfalls": [
            r"Lupa memasukkan token batas akhir </s> dalam evaluasi perpleksitas kalimat sehingga model tidak pernah dievaluasi kemampuannya mengakhiri kalimat.",
            r"Tidak menambahkan padding ganda <s> <s> pada model trigram yang menyebabkan kata pertama tidak memiliki konteks dua kata sebelumnya.",
            r"Mengabaikan penanganan floating-point log-probability dengan nilai epsilon pelindung ketika probabilitas sangat mendekati nol."
        ],
        "caseStudy": (
            "Ujilah class TrigramLanguageModel di atas menggunakan korpus berita singkat. Ubah konfigurasi bobot lambdas=(0.9, 0.08, 0.02) versus lambdas=(0.33, 0.33, 0.34). Amati perubahan nilai perpleksitas pada kalimat yang banyak mengandung kata tak terlihat dan jelaskan mengapa konfigurasi kedua lebih tahan banting terhadap kelangkaan n-gram."
        ),
        "academicReferences": [
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Chapter 3: N-gram Language Models. Stanford University.",
            r"Chen, S. F., & Goodman, J. (1999). An empirical study of smoothing techniques for language modeling. Computer Speech & Language, 13(4), 359-394.",
            r"Heafield, K. (2011). KenLM: Faster and smaller language model queries. In Proceedings of the Sixth Workshop on Statistical Machine Translation (pp. 187-197)."
        ]
    }
})

output_path = os.path.join(os.path.dirname(__file__), "nlp_ch3_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 3 NLP -> {output_path}")
