# -*- coding: utf-8 -*-
"""
Generator untuk Bab 7: Pelabelan Urutan & Ekstraksi Entitas Bernama (POS Tagging & NER) (10 Subbab)
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
# Subbab 7.1: Fondasi Pelabelan Urutan (Sequence Labeling)
# ==============================================================================
code_7_1 = r'''import numpy as np

# Konsep Dasar Pelabelan Urutan (Sequence Labeling): x_{1:T} -> y_{1:T}
# Pemetaan sekuens token masukan ke sekuens label terstruktur yang saling bergantung

sentence = ["saya", "makan", "nasi", "goreng"]
pos_tags = ["PRON", "VERB", "NOUN", "ADJ"]

print("Representasi Pasangan Pelabelan Sekuens (Token-ke-Label):")
print("-" * 65)
print(f"{'Posisi (t)':<12} | {'Token Kata (x_t)':<18} | {'Tag Gramatikal (y_t)':<15}")
print("-" * 65)
for t, (tok, tag) in enumerate(zip(sentence, pos_tags), start=1):
    print(f"t = {t:<8} | {tok:<18} | {tag:<15}")
print("-" * 65)
print("Sifat Kritis: Label y_t bergantung erat pada konteks observasi x dan label sebelumnya y_{t-1}.")
'''

subchapters.append({
    "id": "nlp-7-1-sequence-labeling-foundations",
    "chapterId": "natural-language-processing-ch-7",
    "title": "Fondasi Pelabelan Urutan (Sequence Labeling): Klasifikasi Token vs Inferensi Bersama",
    "description": "Prinsip pemodelan data sekuensial: pemetaan dari sekuens masukan x ke sekuens keluaran diskret y, ketergantungan Markov antar label, dan batas klasifikasi token independen.",
    "estimatedMinutes": 35,
    "order": 1,
    "content": {
        "theory": (
            "Dalam bab-bab sebelumnya, kita telah mempelajari klasifikasi teks di mana sebuah kalimat atau dokumen utuh dipetakan ke tepat satu label kategori diskret $f: \\mathcal{X} \\to \\mathcal{Y}$. Namun, banyak tugas inti pemrosesan bahasa alami menuntut prediksi linguistik pada **setiap token kata secara berurutan**.\n\n"
            "Tugas ini diformulasikan secara matematis sebagai **Pelabelan Urutan (*Sequence Labeling*)**:\n"
            "Diberikan sekuens observasi token kata masukan $\\mathbf{x} = (x_1, x_2, \\dots, x_T) \\in \\mathcal{V}^T$, model bertugas memprediksi sekuens label keadaan diskret $\\mathbf{y} = (y_1, y_2, \\dots, y_T) \\in \\mathcal{S}^T$ yang memiliki panjang identik $T$.\n\n"
            "**Keterbatasan Klasifikasi Token Independen (*Pointwise Classification*)**:\n"
            "Pendekatan paling naif adalah memperlakukan setiap kata $x_t$ sebagai contoh klasifikasi yang berdiri sendiri menggunakan pengklasifikasi standar (seperti Logistic Regression atau MLP) untuk memprediksi $\\hat{y}_t = \\arg\\max P(y_t \\mid x_t)$.\n"
            "Pendekatan pointwise ini memiliki cacat struktural fatal: mengabaikan **ketergantungan struktural antartag (*label dependencies*)**.\n"
            "Dalam tata bahasa alami, urutan label terikat oleh aturan gramatikal yang sangat ketat:\n"
            "- Kata penentu (*determiner*, misal *'the'*) hampir selalu diikuti oleh kata benda (*noun*) atau kata sifat (*adjective*), dan hampir mustahil diikuti oleh kata kerja bentuk lampau (*past-tense verb*).\n"
            "- Dalam ekstraksi entitas bernama dengan skema BIO, tag `I-PER` (*Inside-Person*) secara sintaktis tidak boleh muncul setelah tag `O` (*Outside*) tanpa didahului oleh `B-PER` (*Begin-Person*).\n\n"
            "Oleh karena itu, model sekuensial sejati harus melakukan **Inferensi Bersama (*Joint Inference*)**: mencari sekuens label global $\\mathbf{y}^*$ yang memaksimalkan probabilitas gabungan seluruh lintasan:\n"
            "$$\\mathbf{y}^* = \\arg\\max_{\\mathbf{y} \\in \\mathcal{S}^T} P(y_1, y_2, \\dots, y_T \\mid x_1, x_2, \\dots, x_T)$$\n"
            "Karena terdapat $|\mathcal{S}|^T$ kemungkinan kombinasi sekuens label yang tumbuh secara eksponensial terhadap panjang kalimat, inferensi ini menuntut algoritma pemrograman dinamis yang efisien."
        ),
        "codeSnippet": code_7_1,
        "codeSnippetOutput": run_code_capture_output(code_7_1),
        "realWorldApplication": (
            "Part-of-Speech (POS) tagging, Named Entity Recognition (NER), chunking frasa leksikal, pemecahan batas kata bahasa Mandarin/Jepang, dan analisis sekuens genetik DNA/RNA."
        ),
        "commonPitfalls": [
            r"Melatih model klasifikasi token secara terisolasi tanpa menyertakan fitur transisi label sebelumnya yang menghasilkan urutan tag yang tidak sah secara gramatikal.",
            r"Melakukan pencarian sekuens label terbaik menggunakan brute-force O(|S|^T) yang menyebabkan pembekuan komputasi pada kalimat berpanjang lebih dari 15 kata.",
            r"Mengabaikan penanganan token di luar kamus (OOV) yang frekuensi emisinya tidak pernah teramati pada data latih."
        ],
        "caseStudy": (
            "Dalam kalimat bahasa Inggris: 'The bank will bank on our deposit'. Kata 'bank' muncul dua kali berturut-turut: pertama sebagai kata benda (Noun) dan kedua sebagai kata kerja (Verb). Jelaskan mengapa model klasifikasi token independen rentan menetapkan tag yang sama pada kedua kata tersebut, sedangkan model pelabelan sekuens bersama mampu membedakannya secara akurat."
        ),
        "academicReferences": [
            r"Rabiner, L. R. (1989). A tutorial on hidden Markov models and selected applications in speech recognition. Proceedings of the IEEE, 77(2), 257-286.",
            r"Dietterich, T. G. (2002). Machine learning for sequential data: A review. In Joint IAPR International Workshops on Statistical Techniques in Pattern Recognition (pp. 15-30). Springer.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Chapter 8: Sequence Labeling for Parts of Speech and Named Entities. Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 7.2: Skema Penandaan Morfosintaksis (POS Tagging)
# ==============================================================================
code_7_2 = r'''# Skema Penandaan POS Tagging: Penn Treebank (45 Tag) vs Universal Dependencies (17 Tag)
# Komparasi pemetaan granularitas kelas kata leksikal dan gramatikal

sample_sentence = "Google resmi mengakuisisi perusahaan rintisan kecerdasan buatan baru ."
tokens = sample_sentence.split()

# Anotasi Universal Dependencies (UPOS - 17 Tag Kanonikal)
ud_tags = ["PROPN", "ADV", "VERB", "NOUN", "NOUN", "NOUN", "NOUN", "ADJ", "PUNCT"]

# Anotasi Penn Treebank (PTB - Fine-grained 45 Tag)
ptb_tags = ["NNP", "RB", "VB", "NN", "NN", "NN", "NN", "JJ", "."]

print("Komparasi Granularitas Skema Part-of-Speech Tagging:")
print("-" * 75)
print(f"{'Token':<14} | {'Universal Dependencies (UPOS)':<30} | {'Penn Treebank (PTB)':<20}")
print("-" * 75)
for tok, ud, ptb in zip(tokens, ud_tags, ptb_tags):
    print(f"{tok:<14} | {ud:<30} | {ptb:<20}")
print("-" * 75)
print("UPOS menyajikan standar lintas bahasa (cross-lingual), sedangkan PTB membedakan fleksi bahasa Inggris secara spesifik.")
'''

subchapters.append({
    "id": "nlp-7-2-pos-tagging-penn-treebank-ud",
    "chapterId": "natural-language-processing-ch-7",
    "title": "Skema Penandaan Morfosintaksis (POS Tagging): Penn Treebank vs Universal Dependencies",
    "description": "Taksonomi kelas kata gramatikal: kata terbuka (open classes) vs tertutup (closed classes), standar Penn Treebank 45 tag, dan evolusi Universal Dependencies 17 UPOS.",
    "estimatedMinutes": 35,
    "order": 2,
    "content": {
        "theory": (
            "**Part-of-Speech (POS) Tagging** adalah proses pelabelan setiap kata dalam teks korpus dengan kategori sintaktis atau leksikal formalnya (seperti nomina, verba, adjektiva, adverbia, preposisi, dan konjungsi). Penandaan kelas kata ini menyediakan informasi kontekstual yang sangat berharga mengenai fungsi sintaksis dan pola pelafalan fonetis kata.\n\n"
            "Secara formal, tugas ini memodelkan pemetaan dari ruang leksikal dan konteks sekuensial ke dalam ruang tagset diskret $\\mathcal{T}$:\n"
            "$$f: \\mathcal{V} \\times \\mathcal{C} \\to \\mathcal{T}$$\n"
            "di mana kardinalitas himpunan tag $|\mathcal{T}| = 45$ pada skema terperinci Penn Treebank dan $|\mathcal{T}| = 17$ pada skema universal Universal Dependencies.\n\n"
            "Dalam linguistik komputasional, kelas kata dibagi menjadi dua kategori fundamental:\n"
            "1. **Kelas Terbuka (*Open Word Classes*)**: Kategori kata yang secara konstan menerima kosakata baru seiring perkembangan zaman. Mencakup:\n"
            "   - Nomina (*Nouns*): Menyebut benda, orang, atau entitas konsep (misal *komputer*, *internet*).\n"
            "   - Verba (*Verbs*): Menyatakan aksi, proses, atau keadaan (misal *mengunduh*, *melatih*).\n"
            "   - Adjektiva (*Adjectives*): Memodifikasi atau mencirikan nomina (misal *cepat*, *akurat*).\n"
            "   - Adverbia (*Adverbs*): Memodifikasi verba, adjektiva, atau klausa (misal *sangat*, *kemarin*).\n"
            "2. **Kelas Tertutup (*Closed Word Classes*)**: Kategori fungsional struktural yang memiliki anggota himpunan tetap dan jarang berubah (kata depan *prepositions*, kata sambung *conjunctions*, kata ganti *pronouns*, partikel *particles*, dan kata sandang *determiners*).\n\n"
            "**Dua Standar Skema Tagset Utama Dunia**:\n"
            "- **Penn Treebank Tagset (Santorini, 1990)**: Memuat 45 tag yang sangat terperinci (*fine-grained*) khusus untuk bahasa Inggris. Skema ini membedakan bentuk gramatikal secara eksplisit, misal membedakan verba dasar `VB` (*eat*), past tense `VBD` (*ate*), gerund `VBG` (*eating*), past participle `VBN` (*eaten*), dan singular present `VBZ` (*eats*).\n"
            "- **Universal Dependencies (UD - Nivre et al., 2016)**: Standar global modern yang mendefinisikan **17 Universal POS tags (UPOS)** yang dirancang konsisten dan dapat diterapkan ke seluruh bahasa di dunia (mencakup `NOUN`, `PROPN`, `VERB`, `ADJ`, `ADV`, `PRON`, `DET`, `PREP/ADP`, `PUNCT`, dsb.), dengan distribusi kemungkinan emisi leksikal $P(w_t \\mid t_t)$ dan ketergantungan urutan $P(t_t \\mid t_{t-1})$."
        ),
        "codeSnippet": code_7_2,
        "codeSnippetOutput": run_code_capture_output(code_7_2),
        "realWorldApplication": (
            "Komponen prapemrosesan esensial pada lemmatizer (membedakan 'leaves' sebagai kata kerja vs kata benda jamak), sistem text-to-speech (membedakan pelafalan homograf 'lead' /li:d/ vs /lɛd/), dan dependency parser."
        ),
        "commonPitfalls": [
            r"Mencampuradukkan tagset yang berbeda dalam satu pipeline (misal melatih parser dependensi yang mengharapkan input UPOS menggunakan model tagger yang mengeluarkan tag Penn Treebank).",
            r"Mengabaikan ambiguitas leksikal di mana satu kata yang sama memiliki multi-tag tergantung posisinya dalam kalimat.",
            r"Tidak menyertakan penanganan khusus untuk tanda baca dan simbol mata uang yang memiliki tag resmi tersendiri."
        ],
        "caseStudy": (
            "Sebuah mesin Text-to-Speech (TTS) membaca kalimat: 'I record a new record'. Kata 'record' pertama dilafalkan /rɪˈkɔːrd/ (verba) sedangkan 'record' kedua dilafalkan /ˈrɛk.ərd/ (nomina). Jelaskan bagaimana subsistem POS tagger mendisambiguasi kedua kata tersebut untuk menghasilkan sintesis audio yang tepat."
        ),
        "academicReferences": [
            r"Santorini, B. (1990). Part-of-speech tagging guidelines for the Penn Treebank Project (3rd revision). Department of Computer and Information Science, University of Pennsylvania.",
            r"Nivre, J., et al. (2016). Universal Dependencies v1: A multilingual treebank collection. In LREC 2016 (pp. 1659-1666).",
            r"Petrov, S., Das, D., & McDonald, R. (2012). A universal part-of-speech tagset. In LREC 2012 (pp. 2089-2096)."
        ]
    }
})

# ==============================================================================
# Subbab 7.3: Hidden Markov Models (HMM) untuk Pelabelan Urutan
# ==============================================================================
code_7_3 = r'''from collections import Counter, defaultdict
import numpy as np

# Hidden Markov Models (HMM) untuk POS Tagging
# State Tersembunyi (Hidden States) = POS Tags (S)
# Observasi Terlihat (Observations) = Kata-kata Teks (V)
# Parameter:
# 1. Probabilitas Awal \pi_i = P(s_i | <s>)
# 2. Matriks Transisi A_{ij} = P(s_j | s_i)
# 3. Matriks Emisi B_{j}(k) = P(w_k | s_j)

tagged_corpus = [
    [("dia", "PRON"), ("membaca", "VERB"), ("buku", "NOUN")],
    [("saya", "PRON"), ("membeli", "VERB"), ("buku", "NOUN")],
    [("buku", "NOUN"), ("itu", "DET"), ("bagus", "ADJ")]
]

# Estimasi Parameter MLE HMM dengan Laplace Smoothing
tag_transitions = defaultdict(Counter)
tag_emissions = defaultdict(Counter)
initial_tags = Counter()
tag_totals = Counter()

for sent in tagged_corpus:
    prev_tag = "<s>"
    initial_tags[sent[0][1]] += 1
    for word, tag in sent:
        tag_transitions[prev_tag][tag] += 1
        tag_emissions[tag][word] += 1
        tag_totals[tag] += 1
        prev_tag = tag

print("Estimasi Parameter Hidden Markov Models (HMM):")
print("-" * 65)
print(f"Probabilitas Transisi P(VERB | PRON) : {tag_transitions['PRON']['VERB'] / tag_totals['PRON']:.4f}")
print(f"Probabilitas Transisi P(NOUN | VERB) : {tag_transitions['VERB']['NOUN'] / tag_totals['VERB']:.4f}")
print(f"Probabilitas Emisi P('buku' | NOUN)   : {tag_emissions['NOUN']['buku'] / tag_totals['NOUN']:.4f}")
print(f"Probabilitas Emisi P('membaca' | VERB): {tag_emissions['VERB']['membaca'] / tag_totals['VERB']:.4f}")
print("-" * 65)
print("HMM memfaktorkan probabilitas gabungan menjadi rantai transisi tag dan emisi leksikal.")
'''

subchapters.append({
    "id": "nlp-7-3-hidden-markov-models-pos",
    "chapterId": "natural-language-processing-ch-7",
    "title": "Hidden Markov Models (HMM) untuk Pelabelan Urutan: State Tersembunyi dan Matriks Emisi",
    "description": "Model grafis generatif berarah: pemisahan urutan keadaan tersembunyi (hidden states) dari observasi tampak, asumsi independensi keluaran, dan estimasi MLE parameter.",
    "estimatedMinutes": 35,
    "order": 3,
    "content": {
        "theory": (
            "Salah satu model probabilistik generatif klasik paling berhasil untuk pelabelan urutan adalah **Hidden Markov Models (HMM)**. Dalam konteks penandaan kelas kata (POS tagging), kita hanya dapat mengamati secara langsung kata-kata teks tertulis $\\mathbf{x} = (x_1, \\dots, x_T)$ (**simbol observasi yang terlihat**), sedangkan urutan tag gramatikal yang menghasilkannya $\\mathbf{y} = (y_1, \\dots, y_T)$ bersifat tersembunyi (**keadaan laten / hidden states**).\n\n"
            "HMM didefinisikan secara formal oleh tupel parameter $\\lambda = (\\mathbf{A}, \\mathbf{B}, \\boldsymbol{\\pi})$:\n"
            "1. **Himpunan State Tersembunyi**: $\\mathcal{S} = \\{s_1, s_2, \\dots, s_N\\}$ (tag POS).\n"
            "2. **Himpunan Simbol Observasi**: $\\mathcal{V} = \\{v_1, v_2, \\dots, v_M\\}$ (kosakata leksikal kata).\n"
            "3. **Matriks Probabilitas Transisi State ($\\mathbf{A} \\in \\mathbb{R}^{N \\times N}$)**:\n"
            "   Probabilitas berpindah dari tag $s_i$ ke tag $s_j$ pada langkah waktu berikutnya:\n"
            "   $$a_{ij} = P(y_t = s_j \\mid y_{t-1} = s_i) = \\frac{C(s_i, s_j)}{C(s_i)}$$\n"
            "4. **Matriks Probabilitas Emisi Observasi ($\\mathbf{B} \\in \\mathbb{R}^{N \\times M}$)**:\n"
            "   Probabilitas bahwa state tersembunyi $s_j$ memancarkan kata terlihat $v_k$:\n"
            "   $$b_j(k) = P(x_t = v_k \\mid y_t = s_j) = \\frac{C(s_j, v_k)}{C(s_j)}$$\n"
            "5. **Distribusi Probabilitas Awal ($\\boldsymbol{\\pi} \\in \\mathbb{R}^N$)**:\n"
            "   $$\\pi_i = P(y_1 = s_i)$$\n\n"
            "**Dua Asumsi Penyederhanaan HMM**:\n"
            "- **Asumsi Markov Orde-1**: Probabilitas state saat ini $y_t$ hanya bergantung pada tepat satu state sebelumnya $y_{t-1}$: $P(y_t \\mid y_1^{t-1}) = P(y_t \\mid y_{t-1})$.\n"
            "- **Asumsi Independensi Keluaran (*Output Independence*)**: Probabilitas kata observasi $x_t$ hanya bergantung pada state tersembunyi yang menghasilkannya $y_t$, dan sepenuhnya independen dari kata-kata atau tag di sekitarnya: $P(x_t \\mid y_1^T, x_1^T) = P(x_t \\mid y_t)$.\n\n"
            "Probabilitas gabungan sekuens kata dan tag adalah produk rantai:\n"
            "$$P(\\mathbf{x}, \\mathbf{y}) = \\prod_{t=1}^T P(y_t \\mid y_{t-1}) P(x_t \\mid y_t)$$"
        ),
        "codeSnippet": code_7_3,
        "codeSnippetOutput": run_code_capture_output(code_7_3),
        "realWorldApplication": (
            "POS Tagger tertanam pada sistem ASR kompresi tinggi, analisis sinyal biomedis elektrokardiogram (EKG), dan pemodelan sekuens profil biologis Pfam HMMER."
        ),
        "commonPitfalls": [
            r"Mengabaikan masalah observasi tak teramati (unseen words) di mana emisi bernilai nol mutlak yang meruntuhkan probabilitas seluruh kalimat; memerlukan smoothing emisi leksikal.",
            r"Mengabaikan fakta bahwa asumsi output independence sangat kaku (kata observasi di dunia nyata sangat bergantung pada kata-kata di sekitarnya).",
            r"Lupa memasukkan token batas awal <s> dan batas akhir </s> pada estimasi matriks transisi."
        ],
        "caseStudy": (
            "Dalam korpus pengujian, kata 'will' dapat bertindak sebagai Modal Verb ('she will go') atau Noun ('the last will'). Jelaskan bagaimana matriks emisi B merekam ambiguitas kata 'will', dan bagaimana matriks transisi A mengarahkan model untuk memilih tag yang tepat berdasarkan konteks kata sebelumnya."
        ),
        "academicReferences": [
            r"Rabiner, L. R. (1989). A tutorial on hidden Markov models and selected applications in speech recognition. Proceedings of the IEEE, 77(2), 257-286.",
            r"Brants, T. (2000). TnT: a statistical part-of-speech tagger. In Proceedings of the sixth conference on Applied natural language processing (pp. 224-231).",
            r"Manning, C. D., & Schütze, H. (1999). Foundations of Statistical Natural Language Processing. Chapter 9: Markov Models. MIT Press."
        ]
    }
})

# ==============================================================================
# Subbab 7.4: Algoritma Viterbi untuk Decoding HMM Optimal
# ==============================================================================
code_7_4 = r'''import numpy as np

# Algoritma Viterbi: Decoding Pemrograman Dinamis untuk HMM POS Tagging
# v_t(j) = \max_i [ v_{t-1}(i) * a_{ij} ] * b_j(o_t)
# Kompleksitas O(T * |S|^2) alih-alih O(|S|^T)

states = ["NOUN", "VERB"]
obs = ["mereka", "makan"]
N = len(states)
T = len(obs)

# Parameter HMM simulasi
pi = np.array([0.7, 0.3]) # [NOUN, VERB]
A = np.array([
    [0.3, 0.7],  # NOUN -> [NOUN, VERB]
    [0.8, 0.2]   # VERB -> [NOUN, VERB]
])
# Emisi: B[:, 0] untuk 'mereka', B[:, 1] untuk 'makan'
B = np.array([
    [0.6, 0.1],  # NOUN -> ['mereka', 'makan']
    [0.05, 0.7]  # VERB -> ['mereka', 'makan']
])

# Tabel Viterbi dan Backpointer
viterbi = np.zeros((N, T))
backpointer = np.zeros((N, T), dtype=int)

# Inisialisasi t = 0
for s in range(N):
    viterbi[s, 0] = pi[s] * B[s, 0]
    backpointer[s, 0] = 0

# Rekursi t = 1 .. T-1
for t in range(1, T):
    for s in range(N):
        # max_i [ v_{t-1}(i) * a_{is} ]
        trans_probs = viterbi[:, t-1] * A[:, s]
        best_prev = np.argmax(trans_probs)
        viterbi[s, t] = trans_probs[best_prev] * B[s, 1]
        backpointer[s, t] = best_prev

# Terminasi & Backtracking
best_last_state = np.argmax(viterbi[:, T-1])
best_path = [best_last_state]
for t in range(T-1, 0, -1):
    best_path.insert(0, backpointer[best_path[0], t])

optimal_tags = [states[idx] for idx in best_path]

print("Eksekusi Algoritma Viterbi (HMM Decoding):")
print("-" * 65)
print(f"Kalimat Observasi: {obs}")
print(f"Tabel Viterbi Probabilitas:\n{viterbi}\n")
print(f"Lintasan State Optimal Terpilih: {optimal_tags}")
print(f"Probabilitas Bersama Tertinggi : {np.max(viterbi[:, T-1]):.6f}")
print("-" * 65)
print("Viterbi menemukan sekuens state paling optimal secara pasti dalam waktu O(T * |S|^2).")
'''

subchapters.append({
    "id": "nlp-7-4-viterbi-decoding-algorithm",
    "chapterId": "natural-language-processing-ch-7",
    "title": "Algoritma Viterbi untuk Decoding HMM: Pemrograman Dinamis Jalur State Paling Mungkin",
    "description": "Prinsip optimalitas Bellman pada pelabelan sekuens: struktur tabel kisi kisi (trellis), rekursi fungsi Viterbi, pointer lacak balik (backtracking), dan kompleksitas O(T|S|^2).",
    "estimatedMinutes": 40,
    "order": 4,
    "content": {
        "theory": (
            "Diberikan sebuah kalimat yang terdiri dari $T$ kata observasi $\\mathbf{x} = (x_1, x_2, \\dots, x_T)$ dan parameter model HMM $\\lambda = (\\mathbf{A}, \\mathbf{B}, \\boldsymbol{\\pi})$, bagaimana cara kita menemukan urutan tag tersembunyi $\\mathbf{y} = (y_1, y_2, \\dots, y_T)$ yang paling optimal?\n\n"
            "Masalah ini disebut sebagai **Tugas Decoding (*The Decoding Problem*)**. Jika kita mencoba setiap kombinasi sekuens secara brute-force, untuk tagset Penn Treebank ($|\\mathcal{S}| = 45$) dan kalimat bersahaja 10 kata, terdapat $45^{10} \\approx 3,4 \\times 10^{16}$ kombinasi lintasan—mustahil diselesaikan dengan komputasi langsung.\n\n"
            "Solusi optimal yang eksak ditemukan oleh Andrew Viterbi pada tahun 1967 melalui **Algoritma Viterbi**, sebuah algoritma pemrograman dinamis berbasis **Prinsip Optimalitas Bellman**.\n\n"
            "**Formulasi Matematika Rekursi Viterbi**:\n"
            "Definisikan variabel kisi-kisi (*trellis*) $v_t(j)$ sebagai probabilitas lintasan state terlengkap paling optimal yang menghasilkan observasi $x_1, \\dots, x_t$ dan berakhir pada state $s_j$ pada langkah waktu $t$:\n"
            "$$v_t(j) = \\max_{y_1, \\dots, y_{t-1}} P(x_1, \\dots, x_t, y_1, \\dots, y_{t-1}, y_t = s_j \\mid \\lambda)$$\n\n"
            "Tahapan eksekusi Viterbi:\n"
            "1. **Inisialisasi ($t = 1$)**:\n"
            "   $$v_1(j) = \\pi_j \\cdot b_j(x_1), \\quad bptr_1(j) = 0 \\quad (1 \\le j \\le N)$$\n"
            "2. **Rekursi Maju ($t = 2, \\dots, T$)**:\n"
            "   $$v_t(j) = \\max_{i=1}^N \\left[ v_{t-1}(i) \\cdot a_{ij} \\right] \\cdot b_j(x_t)$$\n"
            "   $$bptr_t(j) = \\arg\\max_{i=1}^N \\left[ v_{t-1}(i) \\cdot a_{ij} \\right]$$\n"
            "3. **Terminasi ($t = T$)**:\n"
            "   $$P^* = \\max_{i=1}^N v_T(i), \\quad y_T^* = \\arg\\max_{i=1}^N v_T(i)$$\n"
            "4. **Pelacakan Balik (*Backtracking*)**:\n"
            "   $$y_t^* = bptr_{t+1}(y_{t+1}^*) \\quad \\text{untuk } t = T-1, T-2, \\dots, 1$$\n\n"
            "Kompleksitas komputasi Algoritma Viterbi turun secara drastis menjadi hanya **$\\mathcal{O}(T \\cdot |\\mathcal{S}|^2)$**, yang dapat dieksekusi dalam hitungan milidetik pada kalimat panjang."
        ),
        "codeSnippet": code_7_4,
        "codeSnippetOutput": run_code_capture_output(code_7_4),
        "realWorldApplication": (
            "Decoding lintasan fonem pada model akustik pengenalan ucapan (ASR), koreksi kesalahan transmisi data nirkabel seluler (telekomunikasi GSM/5G), dan alignment sekuens DNA."
        ),
        "commonPitfalls": [
            r"Menghitung probabilitas Viterbi dalam domain perkalian linier pada kalimat panjang yang memicu floating-point underflow menuju nol (wajib ditransformasikan ke Log-Viterbi dengan penjumlahan logaritma).",
            r"Lupa mencatat matriks backpointer sehingga model hanya mengetahui skor probabilitas maksimum akhir namun tidak dapat merekonstruksi urutan tag pembentuknya.",
            r"Mengabaikan token emisi yang belum pernah terlihat (unseen words) yang menyebabkan seluruh kolom trellis bernilai nol."
        ],
        "caseStudy": (
            "Diberikan kisi-kisi trellis Viterbi dengan 2 state [NOUN, VERB] dan 3 kata observasi. Buktikan secara matematis bahwa jalur Viterbi global tidak selalu identik dengan serangkaian state individual yang memiliki probabilitas marginal lokal tertinggi pada masing-masing langkah waktu."
        ),
        "academicReferences": [
            r"Viterbi, A. (1967). Error bounds for convolutional codes and an asymptotically optimum decoding algorithm. IEEE Transactions on Information Theory, 13(2), 260-269.",
            r"Forney, G. D. (1973). The Viterbi algorithm. Proceedings of the IEEE, 61(3), 268-278.",
            r"Rabiner, L. R. (1989). A tutorial on hidden Markov models and selected applications in speech recognition. Proceedings of the IEEE, 77(2), 257-286."
        ]
    }
})

# ==============================================================================
# Subbab 7.5: Algoritma Forward-Backward & Baum-Welch (EM)
# ==============================================================================
code_7_5 = r'''import numpy as np

# Algoritma Forward-Backward untuk HMM
# Forward Variable: \alpha_t(i) = P(x_1, ..., x_t, y_t = s_i)
# Backward Variable: \beta_t(i) = P(x_{t+1}, ..., x_T | y_t = s_i)
# Posterior State Probability: \gamma_t(i) = P(y_t = s_i | x_{1:T}) = \frac{\alpha_t(i) \beta_t(i)}{P(x_{1:T})}

pi = np.array([0.5, 0.5])
A = np.array([[0.7, 0.3], [0.4, 0.6]])
B = np.array([[0.8, 0.2], [0.1, 0.9]])
obs = [0, 1]  # T = 2 observasi
N = len(pi)
T = len(obs)

# 1. Forward Pass
alpha = np.zeros((N, T))
alpha[:, 0] = pi * B[:, obs[0]]
for t in range(1, T):
    for j in range(N):
        alpha[j, t] = np.sum(alpha[:, t-1] * A[:, j]) * B[j, obs[t]]

p_total_obs = np.sum(alpha[:, T-1])

# 2. Backward Pass
beta = np.zeros((N, T))
beta[:, T-1] = 1.0
for t in reversed(range(T-1)):
    for i in range(N):
        beta[i, t] = np.sum(A[i, :] * B[:, obs[t+1]] * beta[:, t+1])

# 3. Posterior Probability gamma_t(i)
gamma = (alpha * beta) / p_total_obs

print("Kalkulasi Algoritma Forward-Backward HMM:")
print("-" * 65)
print(f"Probabilitas Total Observasi P(X) : {p_total_obs:.6f}\n")
print("Tabel Probabilitas Posterior State Tersembunyi gamma_t(s):")
print(f"t = 1: P(State 0 | X) = {gamma[0, 0]:.4f} | P(State 1 | X) = {gamma[1, 0]:.4f}")
print(f"t = 2: P(State 0 | X) = {gamma[0, 1]:.4f} | P(State 1 | X) = {gamma[1, 1]:.4f}")
print("-" * 65)
print("Forward-Backward menghitung ekspektasi statistik untuk estimasi tanpa supervisi Baum-Welch (EM).")
'''

subchapters.append({
    "id": "nlp-7-5-forward-backward-baum-welch",
    "chapterId": "natural-language-processing-ch-7",
    "title": "Algoritma Forward-Backward & Estimasi Baum-Welch: Probabilitas Posterior dan EM",
    "description": "Inferensi statistik HMM: variabel forward alpha, variabel backward beta, kalkulasi probabilitas posterior gamma, dan algoritma Baum-Welch (Expectation-Maximization).",
    "estimatedMinutes": 35,
    "order": 5,
    "content": {
        "theory": (
            "Jika Algoritma Viterbi mencari satu lintasan tunggal terbaik $\\arg\\max_{\\mathbf{y}} P(\\mathbf{x}, \\mathbf{y})$, bagaimana cara kita menjawab dua pertanyaan probabilistic fundamental lainnya:\n"
            "1. Berapa total kemungkinan dari seluruh urutan observasi $P(\\mathbf{x}) = \\sum_{\\mathbf{y}} P(\\mathbf{x}, \\mathbf{y})$?\n"
            "2. Berapa probabilitas bahwa model berada pada state tertentu $s_i$ pada waktu $t$, dengan mempertimbangkan **seluruh kalimat secara holistik** $P(y_t = s_i \\mid \\mathbf{x})$?\n\n"
            "Jawaban matematisnya adalah **Algoritma Forward-Backward**:\n"
            "- **Variabel Forward ($\\alpha_t(i)$)**: Probabilitas bersama dari mengamati prefiks kalimat $x_1, \\dots, x_t$ dan berada pada state $s_i$ pada waktu $t$:\n"
            "  $$\\alpha_t(i) = P(x_1, \\dots, x_t, y_t = s_i) = \\left[ \\sum_{j=1}^N \\alpha_{t-1}(j) a_{ji} \\right] b_i(x_t)$$\n"
            "- **Variabel Backward ($\\beta_t(i)$)**: Probabilitas bersyarat dari mengamati sufiks kalimat mendatang $x_{t+1}, \\dots, x_T$ dengan syarat berada pada state $s_i$ saat ini:\n"
            "  $$\\beta_t(i) = P(x_{t+1}, \\dots, x_T \\mid y_t = s_i) = \\sum_{j=1}^N a_{ij} b_j(x_{t+1}) \\beta_{t+1}(j)$$\n\n"
            "Dengan menggabungkan kedua variabel tersebut, probabilitas posterior state tersembunyi dirumuskan secara elegan sebagai:\n"
            "$$\\gamma_t(i) = P(y_t = s_i \\mid \\mathbf{x}) = \\frac{\\alpha_t(i) \\beta_t(i)}{P(\\mathbf{x})} = \\frac{\\alpha_t(i) \\beta_t(i)}{\\sum_{j=1}^N \\alpha_t(j) \\beta_t(j)}$$\n\n"
            "**Algoritma Baum-Welch (Expectation-Maximization)**:\n"
            "Ketika kita memiliki korpus teks masukan yang belum dianotasi tag (*unsupervised learning*), algoritma Baum-Welch mengiterasikan dua langkah: (1) **E-step**: menghitung nilai harapan statistik $\\gamma_t(i)$ dan $\\xi_t(i, j)$ menggunakan Forward-Backward, dan (2) **M-step**: memperbarui parameter transisi $\\hat{a}_{ij}$ dan emisi $\\hat{b}_j(k)$ hingga konvergen menuju nilai kemungkinan lokal maksimum."
        ),
        "codeSnippet": code_7_5,
        "codeSnippetOutput": run_code_capture_output(code_7_5),
        "realWorldApplication": (
            "Pelatihan model akustik pengenalan ucapan tanpa transkripsi alignment tingkat fonem, penemuan motif biologis pada sekuens asam amino protein, dan pemodelan pasar keuangan kuantitatif."
        ),
        "commonPitfalls": [
            r"Mengalikan alpha dan beta secara langsung tanpa normalisasi skala numerik per langkah waktu yang memicu floating-point underflow pada sekuens panjang.",
            r"Menganggap algoritma Baum-Welch selalu mencapai optimum global (Baum-Welch adalah algoritma EM yang rentan terjebak di local optima tergantung inisialisasi awal).",
            r"Lupa bahwa beta_T(i) diinisialisasi bernilai 1.0 untuk semua state i pada langkah waktu terakhir."
        ],
        "caseStudy": (
            "Diberikan kalimat uji ambigu. Jelaskan bagaimana probabilitas posterior gamma_t(i) dari Forward-Backward dapat digunakan untuk menghasilkan decoding berbasis batas keputusan Bayes (Minimum Risk Decoding) alih-alih Viterbi decoding murni."
        ),
        "academicReferences": [
            r"Baum, L. E., Petrie, T., Soules, G., & Weiss, N. (1970). A maximization technique occurring in the statistical analysis of probabilistic functions of Markov chains. The Annals of Mathematical Statistics, 41(1), 164-171.",
            r"Dempster, A. P., Laird, N. M., & Rubin, D. B. (1977). Maximum likelihood from incomplete data via the EM algorithm. Journal of the Royal Statistical Society: Series B, 39(1), 1-38.",
            r"Rabiner, L. R. (1989). A tutorial on hidden Markov models. Proceedings of the IEEE, 77(2), 257-286."
        ]
    }
})

# ==============================================================================
# Subbab 7.6: Maximum Entropy Markov Models (MEMM) & Label Bias Problem
# ==============================================================================
code_7_6 = r'''import numpy as np

# Demonstrasi Fenomena Label Bias Problem pada Maximum Entropy Markov Models (MEMM)
# Normalisasi Lokal: \sum_{s'} P(s' | s, x) = 1 pada SETIAP state s
# State dengan sedikit transisi keluar (low entropy) mendominasi inferensi terlepas dari observasi!

# Simulasi graf sederhana dengan 2 cabang:
# State 1 (Cabang A): memiliki 5 cabang keluar yang bersaing (entropi tinggi)
# State 2 (Cabang B): hanya memiliki 1 cabang keluar tunggal (probabilitas lokal dipaksa 1.0!)

p_branch_A = np.array([0.2, 0.2, 0.2, 0.2, 0.2])  # Rata 1/5
p_branch_B = np.array([1.0])                       # Dipaksa 1.0 oleh normalisasi lokal!

# Misalkan bukti observasi x sangat tidak mendukung Cabang B (skor kecocokan observasi buruk = 0.05)
# Namun karena normalisasi lokal Softmax per-state:
# P(next | state 2, x) = exp(w^T x) / exp(w^T x) = 1.0!

print("Demonstrasi Fenomena Label Bias Problem (Lafferty et al., 2001):")
print("-" * 70)
print("Pada MEMM dengan normalisasi probabilitas bersyarat lokal:")
print(f"Probabilitas Transisi Lokal Cabang A (5 pilihan) : {p_branch_A[0]:.4f} per transisi")
print(f"Probabilitas Transisi Lokal Cabang B (1 pilihan) : {p_branch_B[0]:.4f} (SELALU 1.0!)")
print("-" * 70)
print("Akibatnya, model MEMM bias secara degeneratif terhadap state yang memiliki derajat percabangan keluar rendah,")
print("mengabaikan bukti observasi x. Solusi sejati: Normalisasi Partisi Global CRF (Z(x))!")
'''

subchapters.append({
    "id": "nlp-7-6-memm-label-bias-problem",
    "chapterId": "natural-language-processing-ch-7",
    "title": "Maximum Entropy Markov Models (MEMM) & Masalah Label Bias: Batasan Normalisasi Lokal",
    "description": "Transisi dari generatif ke diskriminatif: arsitektur MEMM (McCallum et al., 2000), normalisasi probabilitas transisi lokal, dan analisis matematis kegagalan Label Bias Problem.",
    "estimatedMinutes": 35,
    "order": 6,
    "content": {
        "theory": (
            "Meskipun HMM sangat elegan, model ini adalah model generatif yang mewajibkan penghitungan probabilitas gabungan $P(\\mathbf{x}, \\mathbf{y})$. Akibatnya, HMM sangat kaku: model tidak dapat menyertakan fitur-fitur kontekstual yang saling tumpang tindih (*overlapping features*), seperti: apakah kata diawali huruf kapital? apakah kata berakhiran *-tion*? apakah kata sebelumnya adalah angka?\n\n"
            "Untuk memungkinkan rekayasa fitur diskriminatif yang kaya, McCallum, Freitag, dan Pereira (2000) memperkenalkan **Maximum Entropy Markov Models (MEMM)**. MEMM menggabungkan pengklasifikasi Maximum Entropy ke dalam struktur sekuensial rantai Markov dengan memodelkan probabilitas transisi bersyarat lokal:\n"
            "$$P(y_t \\mid y_{t-1}, \\mathbf{x}) = \\frac{\\exp\\left( \\sum_k \\lambda_k f_k(y_t, y_{t-1}, \\mathbf{x}) \\right)}{\\sum_{y' \\in \\mathcal{S}} \\exp\\left( \\sum_k \\lambda_k f_k(y', y_{t-1}, \\mathbf{x}) \\right)}$$\n\n"
            "**Bencana Label Bias (*The Label Bias Problem*)**:\n"
            "Meskipun fleksibel dalam representasi fitur, MEMM menderita kelemahan teoritis fatal yang diidentifikasi oleh Lafferty, McCallum, dan Pereira (2001), yang dikenal sebagai **Masalah Label Bias (*Label Bias Problem*)**.\n\n"
            "Perhatikan penyebut pada persamaan MEMM di atas: normalisasi probabilitas dilakukan **secara lokal pada setiap state $y_{t-1}$ individual** sehingga $\\sum_{y'} P(y' \\mid y_{t-1}, \\mathbf{x}) = 1$.\n"
            "Konsekuensi matematisnya sangat merusak:\n"
            "1. Transisi yang keluar dari suatu state tertentu hanya bersaing melawan transisi lain yang keluar dari state yang sama, bukan terhadap seluruh transisi di seluruh model.\n"
            "2. Jika suatu state hanya memiliki satu (atau sangat sedikit) kemungkinan transisi keluar, probabilitas transisi tersebut akan mendekati atau tepat bernilai $1.0$, **terlepas dari seberapa buruk bukti observasi kata $\\mathbf{x}$ yang masuk**.\n"
            "3. Akibatnya, algoritma decoding Viterbi akan secara bias memilih lintasan yang melewati state dengan derajat keluar rendah (*low-entropy states*), mengabaikan sinyal observasi riil."
        ),
        "codeSnippet": code_7_6,
        "codeSnippetOutput": run_code_capture_output(code_7_6),
        "realWorldApplication": (
            "Memahami batas teoritis arsitektur sekuensial lokal yang melatarbelakangi penggunaan Linear-Chain CRF dan lapisan CRF pada model ekstraksi informasi modern (BiLSTM-CRF, BERT-CRF)."
        ),
        "commonPitfalls": [
            r"Mengabaikan fenomena label bias saat merancang klasifikasi sekuens bertingkat lokal tanpa fungsi partisi global.",
            r"Mengasumsikan penambahan data latih dapat menghilangkan masalah label bias (label bias adalah cacat struktural normalisasi lokal fungsi objektif, bukan masalah kelangkaan data).",
            r"Mencoba mengatasi label bias hanya dengan menambah regularisasi bobot tanpa mengubah arsitektur graf."
        ],
        "caseStudy": (
            "Rancang sebuah topologi graf sederhana dengan dua jalur: Jalur 1 melewati state dengan 10 percabangan keluar berbobot seimbang, Jalur 2 melewati state dengan 1 percabangan keluar tunggal. Buktikan bagaimana MEMM memilih Jalur 2 meskipun bukti observasi kata mendukung Jalur 1 secara masif."
        ),
        "academicReferences": [
            r"McCallum, A., Freitag, D., & Pereira, F. C. (2000). Maximum Entropy Markov Models for Information Extraction and Segmentation. In ICML (Vol. 17, pp. 591-598).",
            r"Lafferty, J., McCallum, A., & Pereira, F. C. (2001). Conditional random fields: Probabilistic models for segmenting and labeling sequence data. In ICML 2001 (pp. 282-289).",
            r"Bottou, L. (1991). Une approche théorique de l'apprentissage connexionniste: applications à la reconnaissance de la parole. Doctoral dissertation, Université de Paris-Sud."
        ]
    }
})

# ==============================================================================
# Subbab 7.7: Linear-Chain Conditional Random Fields (Spot-Check 7)
# ==============================================================================
code_7_7 = r'''import numpy as np

# Linear-Chain Conditional Random Fields (CRF - Lafferty et al., ICML 2001)
# Distribusi Probabilitas Bersyarat Global (Lafferty 2001, Eq. 1 & 2):
# p_\Lambda(y | x) = \frac{1}{Z(x)} \exp( \sum_{t=1}^T \sum_k \lambda_k f_k(y_{t-1}, y_t, x, t) )
# Fungsi Partisi Global Z(x) = \sum_{y'} \exp( \sum_{t=1}^T \sum_k \lambda_k f_k(y'_{t-1}, y'_t, x, t) )

# Sekuens T = 3 langkah waktu, |S| = 2 state [O, PER]
T = 3
S = ["O", "PER"]
n_states = len(S)

# Skor emisi lokal (unnormalized potential): emisi kata terhadap state
emission_scores = np.array([
    [ 2.0, -1.0],  # t=1: kata "Budi" -> condong PER (state 1)
    [-1.5,  2.5],  # t=2: kata "Santoso" -> condong PER
    [ 1.8, -1.2]   # t=3: kata "pergi" -> condong O
])

# Skor transisi global (tidak dinormalisasi lokal!)
transition_matrix = np.array([
    [ 1.0,  2.0],  # O -> [O, PER]
    [-0.5,  2.5]   # PER -> [O, PER] (Transisi PER -> PER memiliki bonus asosiasi tinggi!)
])

# Hitung skor potensial eksak untuk satu urutan label tertentu: y = [PER, PER, O]
y_seq = [1, 1, 0]
score_seq = 0.0
for t in range(T):
    score_seq += emission_scores[t, y_seq[t]]
    if t > 0:
        score_seq += transition_matrix[y_seq[t-1], y_seq[t]]

unnormalized_potential = np.exp(score_seq)

print("Linear-Chain Conditional Random Fields (Lafferty et al., 2001):")
print("-" * 75)
print(f"Sekuens Label Uji: {[S[idx] for idx in y_seq]}")
print(f"Skor Potensial Tak Ternormalisasi (Energi) : {score_seq:.4f}")
print(f"Eksponensial Faktor exp(Skor)            : {unnormalized_potential:.4f}")
print("-" * 75)
print("Keunggulan CRF: Normalisasi dilakukan secara GLOBAL melalui fungsi partisi Z(x)")
print("melintasi seluruh lintasan sekuens, menyelesaikan Masalah Label Bias secara tuntas!")
'''

subchapters.append({
    "id": "nlp-7-7-linear-chain-crf-lafferty",
    "chapterId": "natural-language-processing-ch-7",
    "title": "Linear-Chain Conditional Random Fields (CRF - Lafferty et al., 2001): Normalisasi Global",
    "description": "Karya revolusioner John Lafferty, Andrew McCallum, dan Fernando Pereira (ICML 2001): graf tak berarah acak bersyarat, normalisasi partisi global Z(x), dan eliminasi label bias (Spot-Check Literatur Primer).",
    "estimatedMinutes": 40,
    "order": 7,
    "content": {
        "theory": (
            "Pada tahun 2001, **John Lafferty, Andrew McCallum, dan Fernando Pereira** mempublikasikan makalah monumental berjudul *'Conditional Random Fields: Probabilistic Models for Segmenting and Labeling Sequence Data'* pada konferensi ICML. Makalah ini memperkenalkan **Conditional Random Fields (CRF)**, sebuah kerangka kerja pemodelan statistik grafis tak berarah yang secara elegan menggabungkan keunggulan diskriminatif Maximum Entropy dengan struktur sekuensial HMM, sekaligus melenyapkan *Label Bias Problem* secara matematis.\n\n"
            "**Definisi Formal CRF (Section 2, Lafferty et al., 2001)**:\n"
            "Misalkan $G = (V, E)$ adalah sebuah graf tak berarah sedemikian rupa sehingga $\\mathbf{Y} = (Y_v)_{v \\in V}$ diindeks oleh simpul-simpul $G$. Maka $(\\mathbf{X}, \\mathbf{Y})$ adalah *Conditional Random Field* jika, ketika dikondisikan pada $\\mathbf{X}$, variabel-variabel acak $Y_v$ memenuhi sifat Markov terhadap graf:\n"
            "$$P(Y_v \\mid \\mathbf{X}, Y_w, w \\neq v) = P(Y_v \\mid \\mathbf{X}, Y_w, w \\sim v)$$\n"
            "di mana $w \\sim v$ menandakan bahwa simpul $w$ dan $v$ bertetangga langsung di graf $G$.\n\n"
            "**Formulasi Linear-Chain CRF (Persamaan 1 & 2, Lafferty 2001)**:\n"
            "Untuk struktur rantai sekuensial linear, probabilitas bersyarat global dari sekuens label $\\mathbf{y}$ diberikan sekuens kata $\\mathbf{x}$ didefinisikan sebagai:\n"
            "$$P_\\Lambda(\\mathbf{y} \\mid \\mathbf{x}) = \\frac{1}{Z(\\mathbf{x})} \\exp\\left( \\sum_{e \\in E, k} \\lambda_k f_k(e, \\mathbf{y}|_e, \\mathbf{x}) + \\sum_{v \\in V, k} \\mu_k g_k(v, \\mathbf{y}|_v, \\mathbf{x}) \\right)$$\n"
            "di mana $Z(\\mathbf{x})$ adalah faktor normalisasi dependen-observasi yang disebut **Fungsi Partisi Global (*Global Partition Function*)**:\n"
            "$$Z(\\mathbf{x}) = \\sum_{\\mathbf{y}'} \\exp\\left( \\sum_{e \\in E, k} \\lambda_k f_k(e, \\mathbf{y}'|_e, \\mathbf{x}) + \\sum_{v \\in V, k} \\mu_k g_k(v, \\mathbf{y}'|_v, \\mathbf{x}) \\right)$$\n"
            "di mana $f_k$ merepresentasikan fitur transisi tepi (relasi antara label $y_{t-1}$ dan $y_t$) dan $g_k$ merepresentasikan fitur keadaan simpul (relasi antara label $y_t$ dan seluruh observasi $\\mathbf{x}$).\n\n"
            "**Bagaimana CRF Melenyapkan Label Bias?**\n"
            "Kunci kemenangan teoretis CRF terletak pada fungsi partisi $Z(\\mathbf{x})$. Normalisasi probabilitas **TIDAK dilakukan secara lokal per-state** seperti pada MEMM, melainkan dilakukan **secara global melintasi seluruh kemungkinan sekuens $\\mathbf{y}'$**. Akibatnya, state yang memiliki sedikit percabangan keluar tidak lagi dapat memaksakan probabilitas lokal $1.0$; setiap langkah bersaing secara adil dalam ruang energi global terhadap seluruh lintasan sekuens."
        ),
        "codeSnippet": code_7_7,
        "codeSnippetOutput": run_code_capture_output(code_7_7),
        "realWorldApplication": (
            "Lapisan penutup paling dominan pada arsitektur ekstraksi informasi named entity recognition (BiLSTM-CRF, BERT-CRF, Clinical NER), serta part-of-speech tagging dan segmentasi teks biomedis."
        ),
        "commonPitfalls": [
            r"Mencoba menghitung fungsi partisi global Z(x) dengan menjumlahkan seluruh y' secara eksplisit O(|S|^T); wajib dihitung menggunakan Algoritma Forward-Backward pada aljabar semiring (log-sum-exp).",
            r"Lupa menambahkan regularisasi L2 (Gaussian prior) pada bobot lambda dan mu yang menyebabkan parameter meledak pada korpus dengan fitur sparse berlimpah.",
            r"Mengabaikan transisi awal dari state khusus <s> dan transisi akhir menuju </s>."
        ],
        "caseStudy": (
            "Bandingkan alur inferensi Viterbi pada Linear-Chain CRF versus MEMM ketika menghadapi kalimat dengan kata observasi yang sangat kontradiktif terhadap transisi gramatikal. Jelaskan secara matematis mengapa fungsi partisi Z(x) memungkinkan CRF menganulir transisi yang keliru."
        ),
        "academicReferences": [
            r"Lafferty, J., McCallum, A., & Pereira, F. C. (2001). Conditional random fields: Probabilistic models for segmenting and labeling sequence data. In ICML 2001 (pp. 282-289).",
            r"Sutton, C., & McCallum, A. (2012). An introduction to conditional random fields. Foundations and Trends in Machine Learning, 4(4), 267-373.",
            r"Lample, G., Ballesteros, M., Subramanian, S., Kawakami, K., & Dyer, C. (2016). Neural architectures for named entity recognition. In NAACL-HLT (pp. 260-270)."
        ]
    }
})

# ==============================================================================
# Subbab 7.8: Named Entity Recognition (NER) & Skema Pelabelan
# ==============================================================================
code_7_8 = r'''# Skema Penandaan Rentang Teks Ekstraksi Entitas Bernama (NER): IO vs BIO/IOB2 vs BIOES/BILOU
# Kalimat: "Presiden Joko Widodo mengunjungi Jakarta Timur kemarin ."

tokens = ["Presiden", "Joko", "Widodo", "mengunjungi", "Jakarta", "Timur", "kemarin", "."]

# 1. Skema IO (Naif: tidak membedakan batas entitas berurutan)
io_tags = ["O", "PER", "PER", "O", "LOC", "LOC", "O", "O"]

# 2. Skema BIO / IOB2 (Standar industri: B=Begin, I=Inside, O=Outside)
bio_tags = ["O", "B-PER", "I-PER", "O", "B-LOC", "I-LOC", "O", "O"]

# 3. Skema BIOES / BILOU (Maksimal ekspresif: E=End, S=Single / L=Last, U=Unit)
bioes_tags = ["O", "B-PER", "E-PER", "O", "B-LOC", "E-LOC", "O", "O"]

print("Perbandingan Skema Penandaan Rentang Entitas Bernama (NER):")
print("-" * 75)
print(f"{'Token':<14} | {'Skema IO':<12} | {'Skema BIO / IOB2':<18} | {'Skema BIOES / BILOU':<18}")
print("-" * 75)
for t, io_t, bio_t, bioes_t in zip(tokens, io_tags, bio_tags, bioes_tags):
    print(f"{t:<14} | {io_t:<12} | {bio_t:<18} | {bioes_t:<18}")
print("-" * 75)
print("Skema BIO memecahkan masalah segmentasi dua entitas bernama berjenis sama yang bersebelahan.")
'''

subchapters.append({
    "id": "nlp-7-8-named-entity-recognition-schemes",
    "chapterId": "natural-language-processing-ch-7",
    "title": "Ekstraksi Entitas Bernama (NER) & Skema Pelabelan: IO, BIO/IOB2, dan BIOES/BILOU",
    "description": "Pengenalan entitas bernama informasi: definisi entitas rigid designator, skema pelabelan batas span (BIO, BIOES), penanganan entitas bersebelahan, dan tantangan nested NER.",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "**Ekstraksi Entitas Bernama (*Named Entity Recognition / NER*)** adalah sub-tugas fundamental dalam ekstraksi informasi yang bertujuan melokalisasi dan mengklasifikasikan rentang kata (*spans of text*) ke dalam kategori entitas terdefinisi (seperti Nama Orang `PER`, Organisasi `ORG`, Lokasi Geografis `LOC`, Ekspresi Waktu `TIME`, dan Nilai Moneter `MONEY`).\n\n"
            "Berbeda dari POS tagging di mana setiap token memiliki kategori gramatikal mandiri, dalam NER sebagian besar kata adalah kata umum di luar entitas, sementara entitas bernama sering kali berupa **frasa multi-kata (*multi-word entities*)** seperti *'Universitas Gadjah Mada'*.\n\n"
            "Untuk memetakan deteksi rentang multi-kata ke dalam masalah pelabelan urutan token, para peneliti merancang **Skema Pelabelan Batas (*Boundary Tagging Schemes*)**:\n"
            "1. **Skema IO (In / Out)**: Skema paling naif yang hanya menugaskan label entitas atau non-entitas `O`. Kelemahan fatalnya: tidak dapat membedakan batas ketika dua entitas dari tipe yang sama muncul berdampingan (misal *'Jane Mary'* akan dianggap sebagai satu orang tunggal bernama *'Jane Mary'* alih-alih dua orang berbeda *'Jane'* dan *'Mary'*).\n"
            "2. **Skema BIO / IOB2 (Begin, Inside, Outside - Ramshaw & Marcus, 1995)**: Standar de facto industri:\n"
            "   - `B-Type`: Menandai token pertama dari sebuah entitas bernama.\n"
            "   - `I-Type`: Menandai token lanjutan di dalam entitas bernama yang sama.\n"
            "   - `O`: Menandai token di luar entitas apa pun.\n"
            "   Dua entitas berurutan dapat dipisahkan secara sempurna: `B-PER`, `B-PER`.\n"
            "3. **Skema BIOES / BILOU**: Menambahkan tag eksplisit untuk token penutup `E-Type` (*End*) dan entitas kata tunggal `S-Type` (*Single / Unit*). Eksperimen oleh Ratinov & Roth (2009) membuktikan bahwa skema BIOES secara konsisten menghasilkan skor $F_1$ yang lebih tinggi pada model neural dan CRF karena model secara tegas mempelajari struktur batas awal dan akhir."
        ),
        "codeSnippet": code_7_8,
        "codeSnippetOutput": run_code_capture_output(code_7_8),
        "realWorldApplication": (
            "Ekstraksi entitas dari dokumen kontrak hukum (nama pihak, nominal denda), analisis resep obat dan riwayat penyakit dari rekam medis elektronik (EHR), dan penandaan entitas pada mesin pencari cerdas."
        ),
        "commonPitfalls": [
            r"Menghasilkan urutan transisi ilegal (misal transisi O langsung menuju I-PER tanpa melalui B-PER); lapisan CRF di atas neural network secara otomatis mencegah kesalahan struktural ini.",
            r"Mengabaikan fenomena entitas bersarang (Nested NER), misal 'Bank Indonesia Jakarta' di mana 'Bank Indonesia' adalah ORG dan seluruh frasa berada dalam konteks LOC.",
            r"Mengandalkan pencocokan kamus nama kaku (gazetteers) murni tanpa mempertimbangkan konteks kalimat di sekitarnya."
        ],
        "caseStudy": (
            "Diberikan kalimat: 'Klinik Rumah Sakit Cipto Mangunkusumo Jakarta mengumumkan direktur baru'. Identifikasi rentang entitas bernama menggunakan skema BIOES dan jelaskan bagaimana skema tersebut mencegah penggabungan keliru antara entitas Organisasi (RSCM) dan entitas Lokasi (Jakarta)."
        ),
        "academicReferences": [
            r"Ramshaw, L. A., & Marcus, M. P. (1995). Text chunking using transformation-based learning. In Third Workshop on Very Large Corpora.",
            r"Ratinov, L., & Roth, D. (2009). Design challenges and misconceptions in named entity recognition. In CoNLL 2009 (pp. 147-155).",
            r"Nadeau, D., & Sekine, S. (2007). A survey of named entity recognition and classification. Lingvisticae Investigationes, 30(1), 3-26."
        ]
    }
})

# ==============================================================================
# Subbab 7.9: Evaluasi Standar NER CoNLL
# ==============================================================================
code_7_9 = r'''import numpy as np

# Evaluasi Standar Ekstraksi Entitas Bernama: Metrik CoNLL Exact Span Match
# Evaluasi NER dihitung pada TINGKAT ENTITAS PENUH (Span-level), BUKAN pada tingkat token individual!
# Pasangan Entitas Sejati (Ground Truth) vs Prediksi Model:
# GT   : [("Joko Widodo", "PER"), ("Jakarta Timur", "LOC")]
# Pred : [("Joko", "PER"), ("Jakarta Timur", "LOC")]  # "Joko" salah batas (partial match = SALAH!)

ground_truth = {("Joko Widodo", "PER"), ("Jakarta Timur", "LOC")}
predictions  = {("Joko", "PER"), ("Jakarta Timur", "LOC")}

# Exact Match Evaluation
tp = len(ground_truth.intersection(predictions))
fp = len(predictions - ground_truth)
fn = len(ground_truth - predictions)

prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
rec  = tp / (tp + fn) if (tp + fn) > 0 else 0.0
f1   = 2 * (prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0

print("Evaluasi Standar CoNLL Exact Span Match NER:")
print("-" * 65)
print(f"Entitas Ground Truth : {ground_truth}")
print(f"Entitas Prediksi     : {predictions}\n")
print(f"True Positives (TP)  : {tp} (Tepat span & tipe: ('Jakarta Timur', 'LOC'))")
print(f"False Positives (FP) : {fp} (Prediksi parsial 'Joko' dianggap SALAH PENUH!)")
print(f"False Negatives (FN) : {fn} (Entitas 'Joko Widodo' terlewat)")
print("-" * 65)
print(f"CoNLL Precision : {prec:.4f} ({prec*100:.1f}%)")
print(f"CoNLL Recall    : {rec:.4f} ({rec*100:.1f}%)")
print(f"CoNLL F1-Score  : {f1:.4f} ({f1*100:.1f}%)")
print("-" * 65)
print("Standar CoNLL menolak partial match: seluruh rentang kata dan tipe entitas wajib cocok 100%!")
'''

subchapters.append({
    "id": "nlp-7-9-conll-ner-evaluation-metrics",
    "chapterId": "natural-language-processing-ch-7",
    "title": "Evaluasi Standar NER CoNLL: Exact Span Match, Boundary Matching, dan Span F1",
    "description": "Protokol evaluasi resmi benchmark CoNLL-2003: perbedaan fundamental evaluasi tingkat token vs tingkat rentang entitas (exact span match), perlakuan partial matches, dan span F1.",
    "estimatedMinutes": 35,
    "order": 9,
    "content": {
        "theory": (
            "Salah satu kesalahan paling umum dalam rekayasa sistem NLP pemula adalah mengevaluasi performa model Named Entity Recognition pada tingkat akurasi token individual (*token-level accuracy*). Mengapa evaluasi tingkat token sangat menyesatkan?\n\n"
            "Dalam korpus teks tipikal, lebih dari $90\\%$ token adalah kata biasa bertag `O`. Model yang tidak melakukan apa pun selain memprediksi seluruh token sebagai `O` akan meraih akurasi token $90\\%$, namun sistem tersebut gagal total mengekstrak entitas apa pun.\n\n"
            "Oleh karena itu, sejak kompetisi **CoNLL-2003 (Tjong Kim Sang & De Meulder, 2003)**, komunitas akademis global menetapkan **CoNLL Exact Span-Level Matching** sebagai standar emas universal evaluasi NER.\n\n"
            "**Aturan Baku CoNLL Exact Match**:\n"
            "Sebuah entitas prediksi dinyatakan sebagai **True Positive ($TP$)** jika dan hanya jika memenuhi dua kriteria absolut secara simultan:\n"
            "1. **Batas Rentang Tepat (*Exact Boundary Match*)**: Indeks awal dan indeks akhir token entitas harus sama persis dengan anotasi ground truth.\n"
            "2. **Tipe Kategori Tepat (*Exact Type Match*)**: Label kategori entitas (misal `PER`, `ORG`, `LOC`) harus cocok secara identik.\n\n"
            "Jika entitas sejati adalah *'Kementerian Keuangan Republik Indonesia'* (`ORG`), dan model memprediksi *'Kementerian Keuangan'* (`ORG`):\n"
            "- Dalam evaluasi token naif, model mendapatkan akurasi token tinggi ($2$ token benar).\n"
            "- Namun dalam standar CoNLL resmi, prediksi tersebut menghasilkan **$1$ False Positive** (karena *'Kementerian Keuangan'* bukan entitas sah) sekaligus **$1$ False Negative** (karena entitas utuh *'Kementerian Keuangan Republik Indonesia'* gagal ditemukan)!\n\n"
            "Rumus evaluasi Span Precision, Span Recall, dan Span $F_1$:\n"
            "$$\\text{Precision} = \\frac{\\text{Jumlah Entitas Tepat Lengkap}}{\\text{Total Entitas yang Dihasilkan Model}}, \\quad \\text{Recall} = \\frac{\\text{Jumlah Entitas Tepat Lengkap}}{\\text{Total Entitas Ground Truth}}$$\n"
            "$$\\text{Span } F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$"
        ),
        "codeSnippet": code_7_9,
        "codeSnippetOutput": run_code_capture_output(code_7_9),
        "realWorldApplication": (
            "Tolok ukur resmi pengujian leaderboard model NER industri (HuggingFace, spaCy benchmarks, MUC conferences), dan evaluasi kontrak hukum pintar."
        ),
        "commonPitfalls": [
            r"Melaporkan token-level accuracy atau macro F1 token alih-alih CoNLL span-level F1 (pustaka seqeval adalah pustaka standar untuk evaluasi span NER yang benar).",
            r"Menghitung token bertag 'O' ke dalam perhitungan rata-rata F1 yang secara semu mendongkrak skor metrik.",
            r"Mengabaikan spasi dan tanda baca dalam penentuan offset karakter rentang entitas."
        ],
        "caseStudy": (
            "Diberikan kalimat medis: 'pasien menderita infeksi saluran pernapasan akut'. Entitas ground truth adalah [infeksi saluran pernapasan akut] (Disease). Model memprediksi [infeksi] (Disease) dan [pernapasan akut] (Disease). Hitung skor CoNLL Precision, Recall, dan F1 dari prediksi tersebut dan jelaskan mengapa skor F1 bernilai 0.0."
        ),
        "academicReferences": [
            r"Tjong Kim Sang, E. F., & De Meulder, F. (2003). Introduction to the CoNLL-2003 shared task: Language-independent named entity recognition. In CoNLL 2003 (pp. 142-147).",
            r"Chinchor, N., & Sundheim, B. (1993). MUC-5 evaluation metrics. In Fifth Message Understanding Conference (MUC-5) (pp. 69-78).",
            r"Nakayama, H. (2018). seqeval: A Python framework for sequence labeling evaluation. Software available from https://github.com/chakki-works/seqeval."
        ]
    }
})

# ==============================================================================
# Subbab 7.10: Implementasi Viterbi HMM POS Tagger Berbasis NumPy
# ==============================================================================
code_7_10 = r'''from collections import defaultdict, Counter
import numpy as np

# Implementasi Menyeluruh HMM POS Tagger dengan Log-Viterbi Decoding Berbasis NumPy
class HMM_POSTagger:
    def __init__(self, alpha=1e-3):
        self.alpha = alpha # Smoothing parameter
        self.states = []
        self.state2idx = {}
        self.vocab = set()
        self.A = None # Transition log-prob
        self.B = None # Emission log-prob
        self.pi = None # Initial log-prob
        
    def fit(self, tagged_sentences):
        # 1. Kumpulkan statistik frekuensi
        tag_transitions = defaultdict(Counter)
        tag_emissions = defaultdict(Counter)
        initial_counts = Counter()
        tag_counts = Counter()
        
        for sent in tagged_sentences:
            if not sent: continue
            first_tag = sent[0][1]
            initial_counts[first_tag] += 1
            prev_tag = "<s>"
            for word, tag in sent:
                self.vocab.add(word)
                tag_counts[tag] += 1
                tag_transitions[prev_tag][tag] += 1
                tag_emissions[tag][word] += 1
                prev_tag = tag
                
        self.states = sorted(list(tag_counts.keys()))
        self.state2idx = {s: i for i, s in enumerate(self.states)}
        N = len(self.states)
        V = len(self.vocab)
        
        # 2. Bangun Matriks Initial, Transisi, dan Emisi dalam ruang Log
        total_sents = len(tagged_sentences)
        self.pi = np.log([(initial_counts[s] + self.alpha) / (total_sents + self.alpha * N) for s in self.states])
        
        self.A = np.zeros((N, N))
        for i, s_prev in enumerate(self.states):
            denom = tag_counts[s_prev] + self.alpha * N
            for j, s_curr in enumerate(self.states):
                nom = tag_transitions[s_prev][s_curr] + self.alpha
                self.A[i, j] = np.log(nom / denom)
                
        self.tag_emissions = tag_emissions
        self.tag_counts = tag_counts
        
    def get_emission_logprob(self, state_idx, word):
        state = self.states[state_idx]
        denom = self.tag_counts[state] + self.alpha * (len(self.vocab) + 1)
        nom = self.tag_emissions[state][word] + self.alpha
        return np.log(nom / denom)

    def decode_viterbi(self, words):
        T = len(words)
        N = len(self.states)
        
        # Tabel Log-Viterbi dan Backpointer
        log_viterbi = np.zeros((N, T))
        backpointer = np.zeros((N, T), dtype=int)
        
        # Inisialisasi t = 0
        for s in range(N):
            log_viterbi[s, 0] = self.pi[s] + self.get_emission_logprob(s, words[0])
            backpointer[s, 0] = 0
            
        # Rekursi t = 1 .. T-1
        for t in range(1, T):
            for s in range(N):
                # max_i [ log_v_{t-1}(i) + log_a_{is} ]
                scores = log_viterbi[:, t-1] + self.A[:, s]
                best_prev = np.argmax(scores)
                log_viterbi[s, t] = scores[best_prev] + self.get_emission_logprob(s, words[t])
                backpointer[s, t] = best_prev
                
        # Backtracking
        best_last = np.argmax(log_viterbi[:, T-1])
        best_path = [best_last]
        for t in range(T-1, 0, -1):
            best_path.insert(0, backpointer[best_path[0], t])
            
        return [self.states[idx] for idx in best_path]

train_sents = [
    [("presiden", "NOUN"), ("mengunjungi", "VERB"), ("ibu", "NOUN"), ("kota", "NOUN")],
    [("dia", "PRON"), ("membaca", "VERB"), ("laporan", "NOUN"), ("resmi", "ADJ")],
    [("dia", "PRON"), ("mengunjungi", "VERB"), ("kantor", "NOUN")]
]

tagger = HMM_POSTagger()
tagger.fit(train_sents)

test_words = ["dia", "mengunjungi", "ibu", "kota"]
predicted_tags = tagger.decode_viterbi(test_words)

print("Inferensi Lengkap HMM POS Tagger (Log-Viterbi NumPy):")
print("-" * 75)
print(f"Kata Masukan : {test_words}")
print(f"Tag Prediksi : {predicted_tags}")
print("-" * 75)
print("Pipeline berhasil melatih parameter HMM dan melakukan penandaan sekuensial optimal.")
'''

subchapters.append({
    "id": "nlp-7-10-viterbi-hmm-pos-tagger-numpy",
    "chapterId": "natural-language-processing-ch-7",
    "title": "Implementasi Algoritma Viterbi HMM POS Tagger Mandiri dari Nol Menggunakan NumPy",
    "description": "Konstruksi menyeluruh class HMM_POSTagger dari nol: estimasi parameter log-probability MLE, stabilisasi underflow, decoding Log-Viterbi, dan pelacakan balik backpointer.",
    "estimatedMinutes": 45,
    "order": 10,
    "content": {
        "theory": (
            "Sebagai puncak dari Bab 7, kita merangkum seluruh prinsip pemodelan sekuensial probabilistik ke dalam implementasi mandiri class `HMM_POSTagger` yang dibangun murni dari nol menggunakan Python standar dan operasi matriks NumPy tanpa dependensi pada pustaka eksternal tingkat tinggi (seperti NLTK atau spaCy).\n\n"
            "Arsitektur engine HMM POS Tagger ini mencakup komponen rekayasa inti berikut:\n"
            "1. **Pemisahan Ruang Probabilitas Log (*Log-Space Computation*)**:\n"
            "   Untuk mencegah keruntuhan angka mengambang (*floating-point underflow*) yang tidak dapat dihindari saat mengalikan probabilitas bersyarat kecil pada sekuens panjang, seluruh parameter model—probabilitas awal $\\boldsymbol{\\pi}$, matriks transisi $\\mathbf{A}$, dan matriks emisi $\\mathbf{B}$—disimpan dan dihitung dalam ruang logaritma natural: $\\log(a \\cdot b) = \\log(a) + \\log(b)$.\n"
            "2. **Penghalusan Aditif Lapisan Emisi (*Lidstone/Laplace Smoothing*)**:\n"
            "   Setiap pasangan kata-tag yang tidak pernah terlihat pada data latih dilindungi dengan nilai $\\alpha = 10^{-3}$, menjamin model tidak pernah menghasilkan nilai $-\\infty$ ketika menjumpai kata baru pada kalimat uji.\n"
            "3. **Tabel Trellis Log-Viterbi & Matriks Backpointer**:\n"
            "   Mengalokasikan array NumPy dua dimensi berukuran $N \\times T$ untuk mencatat skor terbaik lintasan parsial dan indeks state pendahulu yang menghasilkan skor maksimum tersebut.\n"
            "4. **Runtun Pelacakan Balik (*Exact Backtracking Trace*)**:\n"
            "   Setelah kolom terakhir $t = T-1$ dievaluasi, algoritma melakukan penelusuran mundur dari simpul terbaik akhir menuju akar awal kalimat untuk merekonstruksi urutan tag dengan probabilitas gabungan tertinggi.\n\n"
            "Implementasi ini membuktikan secara transparan bagaimana inferensi struktur sekuensial kompleks dapat dieksekusi secara deterministik dalam kompleksitas waktu optimal $\\mathcal{O}(T \\cdot N^2)$."
        ),
        "codeSnippet": code_7_10,
        "codeSnippetOutput": run_code_capture_output(code_7_10),
        "realWorldApplication": (
            "Dapat digunakan sebagai modul POS tagging deterministik mandiri pada prosesor embedded, pra-tokenisasi mesin pencari internal, dan modul pengujian unit testing."
        ),
        "commonPitfalls": [
            r"Melakukan eksponensial kembali di tengah-tengah kalkulasi Log-Viterbi yang merusak stabilitas numerik.",
            r"Lupa memperhitungkan ukuran kosakata |V| pada penyebut smoothing emisi kata tak dikenal.",
            r"Menginisialisasi tabel backpointer dengan nilai float (wajib integer array dtype=int untuk mengindeks state pendahulu)."
        ],
        "caseStudy": (
            "Ujilah class HMM_POSTagger di atas dengan menambahkan kalimat uji yang memuat satu kata yang belum pernah muncul di data latih. Tampilkan bagaimana smoothing emisi memandu model untuk tetap memilih tag yang masuk akal secara gramatikal berdasarkan probabilitas transisi konteks sekitarnya."
        ),
        "academicReferences": [
            r"Brants, T. (2000). TnT: a statistical part-of-speech tagger. In Proceedings of the sixth conference on Applied natural language processing (pp. 224-231).",
            r"Rabiner, L. R. (1989). A tutorial on hidden Markov models. Proceedings of the IEEE, 77(2), 257-286.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Chapter 8. Stanford University."
        ]
    }
})

output_path = os.path.join(os.path.dirname(__file__), "nlp_ch7_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 7 NLP -> {output_path}")
