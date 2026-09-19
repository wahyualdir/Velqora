# -*- coding: utf-8 -*-
"""
Generator untuk Bab 1: Fondasi Pemrosesan Bahasa Alami & Linguistik Komputasional (10 Subbab)
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
# Subbab 1.1: Evolusi Historis NLP
# ==============================================================================
code_1_1 = r'''import numpy as np

# Simulasi Evolusi Paradigma NLP: Symbolic Rules vs Statistical vs Deep Learning
# Mengukur akurasi generalisasi parsing pada variasi ambiguitas kalimat bahasa alami

paradigms = {
    "Rule-Based Simbolik (1950-1980an)": {
        "kompleksitas_aturan": "Tinggi (Eksplisit manual)",
        "cakupan_kosakata": "Sangat Terbatas (Closed domain)",
        "akurasi_ambiguitas": 38.5,
        "penanganan_oov": 0.0
    },
    "Statistik Probabilistik (1990-2010an)": {
        "kompleksitas_aturan": "Sedang (N-Gram, HMM, CRF)",
        "cakupan_kosakata": "Sedang (Korpus teranotasi)",
        "akurasi_ambiguitas": 72.4,
        "penanganan_oov": 45.0
    },
    "Deep Learning & Transformer (2013-Sekarang)": {
        "kompleksitas_aturan": "Implisit (Self-Attention, Embeddings)",
        "cakupan_kosakata": "Sangat Luas (Subword BPE, Triliunan token)",
        "akurasi_ambiguitas": 93.8,
        "penanganan_oov": 98.5
    }
}

print("Analisis Komparatif Paradigma Historis Pemrosesan Bahasa Alami:")
print("-" * 80)
print(f"{'Paradigma':<38} | {'Ambiguitas':<12} | {'Penanganan OOV':<15}")
print("-" * 80)
for name, data in paradigms.items():
    print(f"{name:<38} | {data['akurasi_ambiguitas']:10.1f}% | {data['penanganan_oov']:13.1f}%")
print("-" * 80)
print("Pergeseran dari rekayasa aturan simbolik ke representasi kontinu berbasis data")
print("memungkinkan pemodelan bahasa menangani fleksibilitas semantik dunia nyata.")
'''

subchapters.append({
    "id": "nlp-1-1-historical-evolution",
    "chapterId": "natural-language-processing-ch-1",
    "title": "Evolusi Historis NLP: Dari Pendekatan Berbasis Aturan Simbolik ke Statistik dan Deep Learning",
    "description": "Perjalanan keilmuan pemrosesan bahasa alami: eksperimen Georgetown-IBM, tata bahasa generatif Chomsky, era korpus statistik empiris, hingga revolusi representasi saraf tiruan.",
    "estimatedMinutes": 35,
    "order": 1,
    "content": {
        "theory": (
            "Pemrosesan Bahasa Alami (*Natural Language Processing* / NLP) merupakan disiplin interdisipliner di persimpangan ilmu komputer, kecerdasan buatan, dan linguistik teoretis yang berfokus pada kemampuan mesin komputasi untuk memahami, menafsirkan, memanipulasi, dan memproduksi bahasa manusia yang alami dan ekspresif.\n\n"
            "Secara historis, evolusi NLP terbagi menjadi tiga era metodologis fundamental:\n"
            "1. **Era Simbolik dan Berbasis Aturan (*Symbolic & Rule-Based Era*, 1950-an s.d. 1980-an)**: Dimulai oleh eksperimen penerjemahan mesin Georgetown-IBM (1954) dan pemikiran Noam Chomsky mengenai *Syntactic Structures* (1957) serta hierarki tata bahasa formal (*Chomsky Hierarchy*). Sistem pada era ini (seperti SHRDLU oleh Terry Winograd dan ELIZA oleh Joseph Weizenbaum) mengandalkan ribuan aturan leksikal-sintaksis buatan tangan pakar linguistik (*expert-crafted grammar rules*). Namun, sistem simbolik mengalami kerapuhan katastropik (*combinatorial explosion & brittleness*) saat berhadapan dengan bahasa alami dunia nyata yang penuh dengan variasi ragam, idiom, dan ambiguitas.\n\n"
            "2. **Era Statistik Empiris (*Statistical NLP Era*, 1990-an s.d. awal 2010-an)**: Ditandai oleh ledakan ketersediaan korpus teks terdigitalisasi dan daya komputasi. Paradigma bergeser dari penalaran logika formal ke **estimasi probabilitas statistik** berbasis teori informasi Shannon. Model bahasa N-gram, Hidden Markov Models (HMM) untuk part-of-speech tagging, Maximum Entropy (MaxEnt), dan Conditional Random Fields (CRF) mendominasi, di mana probabilitas urutan kata dihitung menggunakan prinsip kemungkinan maksimum (*Maximum Likelihood Estimation*):\n"
            "$$P(w_1, w_2, \\dots, w_n) = \\prod_{i=1}^n P(w_i \\mid w_1, \\dots, w_{i-1}) \\approx \\prod_{i=1}^n P(w_i \\mid w_{i-k+1}^{i-1})$$\n\n"
            "3. **Era Deep Learning dan Fondasi Transformer (2013 s.d. Sekarang)**: Dimulai oleh revolusi representasi kata kontinu Word2Vec (Mikolov et al., 2013), jaringan sekuensial rekursif (LSTM/GRU), hingga pergeseran paradigma total oleh arsitektur *Self-Attention* pada Transformer (Vaswani et al., 2017). Model tidak lagi bergantung pada representasi ortogonal diskrit yang kaku, melainkan memproyeksikan bahasa ke dalam ruang manifold kontinu berdimensi tinggi (*dense latent embeddings*) yang mampu mengkodekan semantik konteks yang sangat kaya."
        ),
        "codeSnippet": code_1_1,
        "codeSnippetOutput": run_code_capture_output(code_1_1),
        "realWorldApplication": (
            "Mendasari arsitektur mesin pencari modern (Google Search), sistem filter email cerdas, koreksi tata bahasa otomatis (Grammarly), dan sistem transkripsi bicara otomatis di perangkat seluler."
        ),
        "commonPitfalls": [
            r"Mencoba menulis aturan regex manual yang kaku untuk memproses bahasa bebas, yang berujung pada kegagalan menangani variasi typo, slang, dan gaya penulisan pengguna.",
            r"Mengabaikan keterbatasan asumsi Markov pada model statistik N-gram klasik saat memproses relasi gramatikal jarak jauh (long-range dependencies).",
            r"Mengasumsikan bahasa alami memiliki sifat deterministik matematis seperti kode bahasa pemrograman."
        ],
        "caseStudy": (
            "Sebuah firma hukum ingin membangun sistem pengekstraksi klausul kontrak otomatis. Mengapa sistem parser berbasis aturan reguler (rule-based) yang dibangun pada tahun 1995 gagal total ketika menghadapi variasi gaya penulisan dari 50 firma hukum berbeda, dan bagaimana pendekatan modern berbasis data menyelesaikan masalah tersebut?"
        ),
        "academicReferences": [
            r"Chomsky, N. (1957). Syntactic structures. Mouton & Co.",
            r"Manning, C. D., & Schütze, H. (1999). Foundations of statistical natural language processing. MIT press.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 1.2: Tingkatan Analisis Linguistik
# ==============================================================================
code_1_2 = r'''import numpy as np

# Simulasi Hierarki Analisis Linguistik pada Kalimat:
# "Analis membaca laporan keuangan bank dengan teliti."

linguistic_layers = [
    {"level": "1. Fonologi/Grafem", "unit": "Karakter/Suara", "contoh": "['a', 'n', 'a', 'l', 'i', 's']"},
    {"level": "2. Morfologi",     "unit": "Morfem",         "contoh": "mem- + baca (akar: baca, prefiks: meN-)"},
    {"level": "3. Sintaksis",      "unit": "Frasa/Struktur", "contoh": "[S: Analis] [P: membaca] [O: laporan keuangan]"},
    {"level": "4. Semantik",       "unit": "Makna Makna",    "contoh": "bank = lembaga keuangan (bukan tepi sungai)"},
    {"level": "5. Pragmatik",      "unit": "Konteks Situasi","contoh": "Tujuan tuturan: audit profesional, bukan hiburan"}
]

print("Hierarki Analisis Linguistik Komputasional:")
print("=" * 75)
for layer in linguistic_layers:
    print(f"{layer['level']:<22} | Unit: {layer['unit']:<15} | Contoh: {layer['contoh']}")
print("=" * 75)
print("Pipeline NLP komprehensif mengintegrasikan seluruh tingkatan secara sinergis.")
'''

subchapters.append({
    "id": "nlp-1-2-linguistic-levels-analysis",
    "chapterId": "natural-language-processing-ch-1",
    "title": "Tingkatan Analisis Linguistik: Fonologi, Morfologi, Sintaksis, Semantik, dan Pragmatik",
    "description": "Dekomposisi struktural bahasa manusia: representasi bunyi/ortografi, struktur kata dan morfem, tata bahasa konstituen, pemaknaan leksikal, serta konteks sosial wacana.",
    "estimatedMinutes": 35,
    "order": 2,
    "content": {
        "theory": (
            "Bahasa manusia bukan sekadar deretan karakter string acak, melainkan sistem hierarkis yang sangat terstruktur. Untuk membangun sistem pemrosesan bahasa alami yang tangguh, ilmuwan komputer harus memahami **tingkatan analisis linguistik (*levels of linguistic analysis*)**:\n\n"
            "1. **Fonetik dan Fonologi (*Phonetics & Phonology*)**: Studi mengenai bunyi ujaran fisik dan sistem pola bunyi abstrak bahasa. Dalam teks digital tertulis, padanan formalnya adalah **Ortografi dan Grafemik**, yaitu sistem representasi visual huruf, tanda aksen, dan karakter Unicode.\n\n"
            "2. **Morfologi (*Morphology*)**: Studi mengenai struktur internal kata dan pembentukannya dari unit bermakna terkecil yang disebut **Morfem (*Morphemes*)**. Morfem terbagi menjadi *morfem bebas* (akar kata, misal *ajar*) dan *morfem terikat* (afiks: prefiks *peng-*, sufiks *-an*). Bahasa aglutinatif (seperti bahasa Indonesia, Turki, atau Finlandia) memiliki kompleksitas morfologis sangat tinggi karena satu kata dapat memuat banyak afiks bertingkat (*meng-ajar-kan-lah*).\n\n"
            "3. **Sintaksis (*Syntax*)**: Kaidah formal penyusunan kata-kata menjadi frasa (*phrases*) dan klausa (*clauses*) yang gramatikal. Hubungan sintaksis memetakan peran subjek, predikat, dan objek yang dimodelkan melalui *Context-Free Grammars* (CFG) atau relasi pohon ketergantungan (*Dependency Trees*).\n\n"
            "4. **Semantik (*Semantics*)**: Kajian mengenai makna intrinsik yang dikandung oleh kata (*lexical semantics*) dan bagaimana makna kata-kata tersebut berpadu membentuk makna kalimat utuh (*compositional semantics*). Semantik berurusan dengan relasi sinonimi, antonimi, hipernimi, serta peran semantik agen dan tema (*Semantic Role Labeling*).\n\n"
            "5. **Pragmatik dan Wacana (*Pragmatics & Discourse*)**: Tingkatan tertinggi yang menganalisis bagaimana konteks situasional, niat penutur (*speech acts*), pengetahuan umum (*world knowledge*), dan implikatur mempengaruhi interpretasi tuturan. Kalimat *'Dapatkah Anda membuka jendela?'* secara sintaksis adalah pertanyaan ya/tidak, namun secara pragmatik bermakna permintaan tindakan sopan (*indirect request*).\n\n"
            "Secara matematis, prinsip komposisionalitas semantik Frege dirumuskan sebagai fungsi pemetaan $M(e_1 e_2) = f(M(e_1), M(e_2))$, di mana makna ungkapan kompleks ditentukan oleh makna bagian-bagian konstituennya dan aturan sintaksis penggabungannya seperti tata bahasa bebas konteks $S \\to NP \\ VP$."
        ),
        "codeSnippet": code_1_2,
        "codeSnippetOutput": run_code_capture_output(code_1_2),
        "realWorldApplication": (
            "Diterapkan dalam perancangan asisten virtual cerdas (Apple Siri, Amazon Alexa) yang harus mentranskripsikan gelombang audio (fonetik), memecah kata majemuk (morfologi), memahami perintah (sintaksis & semantik), dan merespons tindakan yang relevan secara sosial (pragmatik)."
        ),
        "commonPitfalls": [
            r"Mengabaikan analisis morfologi pada bahasa aglutinatif (seperti bahasa Indonesia), yang mengakibatkan ledakan ukuran kosakata OOV jika hanya mengandalkan pemisahan spasi mentah.",
            r"Menganggap analisis semantik selesai hanya dengan memeriksa kamus kata per kata (mengabaikan prinsip komposisionalitas makna frasa idiom).",
            r"Mencoba memecahkan masalah pragmatik hanya dengan parser sintaksis statis tanpa basis data pengetahuan eksternal."
        ],
        "caseStudy": (
            "Sebuah chatbot layanan pelanggan perbankan menerima pesan: 'Bunga tabungan saya bulan ini kok cuma segini, dingin banget pelayanannya.' Analisis pesan ini pada 5 tingkatan linguistik dan jelaskan mengapa model yang hanya memahami semantik harfiah kata 'bunga' dan 'dingin' akan gagal total merespons keluhan nasabah."
        ),
        "academicReferences": [
            r"Fromkin, V., Rodman, R., & Hyams, N. (2018). An introduction to language (11th ed.). Cengage Learning.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Stanford University.",
            r"Cruse, D. A. (2000). Meaning in language: An introduction to semantics and pragmatics. Oxford University Press."
        ]
    }
})

# ==============================================================================
# Subbab 1.3: Ambiguitas Bahasa Manusia
# ==============================================================================
code_1_3 = r'''import numpy as np

# Simulasi Penanganan Ambiguitas Sintaksis (Prepositional Phrase Attachment)
# Kalimat Klasik: "I saw the man with a telescope"
# Interpretasi 1: [saw [the man] [with a telescope]] -> Teleskop sebagai alat melihat (Instrumen)
# Interpretasi 2: [saw [the man with a telescope]]    -> Pria tersebut membawa teleskop (Modifikasi Objek)

def pp_attachment_probability(verb="saw", noun="man", prep="with", p_obj="telescope"):
    """
    Simulasi estimasi skor asosiasi probabilitas berbasis frekuensi korpus (Hindle & Rooth, 1993)
    """
    # Frekuensi ko-okurensi statistik terkalibrasi dari Penn Treebank
    p_verb_attachment = 0.68  # Asosiasi melihat dengan instrumen optik tinggi
    p_noun_attachment = 0.32  # Asosiasi pria memiliki teleskop lebih rendah
    
    return p_verb_attachment, p_noun_attachment

p_v, p_n = pp_attachment_probability()

print("Analisis Ambiguitas Struktural Keterikatan Frasa Preposisi (PP Attachment):")
print(f"Kalimat: 'I saw the man with a telescope'\n")
print(f"Interpretasi A (V-Attach: Teleskop alat melihat): Peluang = {p_v * 100:.1f}%")
print(f"Interpretasi B (N-Attach: Pria membawa teleskop):  Peluang = {p_n * 100:.1f}%")
print(f"\nDisambiguasi Terpilih: {'Interpretasi A (Alat Melihat)' if p_v > p_n else 'Interpretasi B'}")
print("Ambiguitas mewajibkan model NLP mengintegrasikan konteks semantik dan frekuensi empiris.")
'''

subchapters.append({
    "id": "nlp-1-3-linguistic-ambiguity-types",
    "chapterId": "natural-language-processing-ch-1",
    "title": "Ambiguitas Bahasa Manusia: Leksikal, Sintaksis (Structural Attachment), Semantik, dan Kontekstual",
    "description": "Tantangan mendasar komputasi bahasa: polisemi dan homonimi kata, ambiguitas penempelan frasa preposisi (PP-attachment), ruang lingkup kuantor, serta strategi resolusi komputasional.",
    "estimatedMinutes": 35,
    "order": 3,
    "content": {
        "theory": (
            "Tantangan paling mendasar yang membedakan pemrosesan bahasa alami dari kompilator bahasa pemrograman buatan (seperti C++ atau Python) adalah keberadaan **Ambiguitas Inheren (*Inherent Ambiguity*)**. Bahasa pemrograman didesain bersifat *Context-Free* tanpa ambiguitas, sedangkan bahasa alami manusia berevolusi secara efisien sehingga satu bentuk ujaran dapat memiliki multi-interpretasi bergantung konteks.\n\n"
            "Empat kategori utama ambiguitas dalam komputasi linguistik mencakup:\n"
            "1. **Ambiguitas Leksikal (*Lexical Ambiguity*)**:\n"
            "   - *Homonimi*: Kata dengan ejaan dan pelafalan identik namun memiliki makna historis terpisah total, misal *'bisa'* (racun ular vs mampu/dapat).\n"
            "   - *Polisemi*: Kata dengan makna beragam yang masih saling berkerabat konseptual, misal *'bank'* (institusi finansial vs gedung fisiknya vs simpanan data).\n"
            "   - *Kategori Gramatikal (Part-of-Speech Ambiguity)*: Kata yang dapat berfungsi sebagai kata benda atau kata kerja bergantung posisi, misal *'run'* (bisa nomina: *'a long run'*, atau verba: *'they run fast'*).\n\n"
            "2. **Ambiguitas Sintaksis / Struktural (*Structural Ambiguity*)**:\n"
            "   Terjadi ketika sebuah urutan kata yang sama dapat menghasilkan lebih dari satu pohon parse yang sah. Masalah paling terkenal adalah **Prepositional Phrase (PP) Attachment**:\n"
            "   $$\\text{Kalimat: } \\text{\"I saw the astronomer with a telescope\"}$$\n"
            "   Dua struktur pohon yang valid:\n"
            "   - Pohon A: $[_{VP} \\text{ saw } [_{NP} \\text{ the astronomer }] [_{PP} \\text{ with a telescope }]]$ (Teleskop adalah instrumen yang digunakan subjek untuk melihat).\n"
            "   - Pohon B: $[_{VP} \\text{ saw } [_{NP} \\text{ the astronomer } [_{PP} \\text{ with a telescope }]]]$ (Astronom tersebut yang sedang memegang teleskop).\n\n"
            "3. **Ambiguitas Ruang Lingkup Semantik (*Scope Ambiguity*)**:\n"
            "   Terjadi saat relasi operator logika atau kuantor saling tumpang tindih. Pada kalimat *'Every child loves a dog'*, apakah ada satu anjing spesifik yang dicintai semua anak ($\\exists d \\forall c$), atau setiap anak memiliki anjing cintanya masing-masing ($\\forall c \\exists d$)?\n\n"
            "4. **Ambiguitas Pragmatik & Anafora (*Anaphora Ambiguity*)**:\n"
            "   Ketidakpastian acuan kata ganti (*pronoun resolution*), seperti pada skema Winograd:\n"
            "   *\"The trophy did not fit into the suitcase because it was too big.\"* (Kata *'it'* merujuk pada piala).\n"
            "   *\"The trophy did not fit into the suitcase because it was too small.\"* (Kata *'it'* merujuk pada koper).\n"
            "   Menyelesaikan ambiguitas ini membutuhkan pemahaman akal sehat (*common-sense world reasoning*) melampaui aturan tata bahasa formal."
        ),
        "codeSnippet": code_1_3,
        "codeSnippetOutput": run_code_capture_output(code_1_3),
        "realWorldApplication": (
            "Diterapkan pada sistem penerjemahan mesin (Google Translate), di mana sistem harus memutuskan apakah kata bahasa Inggris 'bank' diterjemahkan ke bahasa Indonesia sebagai 'lembaga bank' atau 'tepian sungai' berdasarkan kata-kata di sekitarnya."
        ),
        "commonPitfalls": [
            r"Mengabaikan ambiguitas POS pada tahapan tokenisasi (misalnya menganggap kata 'bisa' selalu kata kerja bantu, merusak analisis teks medis racun binatang).",
            r"Menggunakan parser deterministik tanpa sistem pembobotan probabilitas (probabilistic CFG), yang gagal memilih parse tree terbaik saat terjadi ledakan pohon sintaksis.",
            r"Menganggap ambiguitas anafora dapat diselesaikan hanya dengan aturan 'cari kata benda terdekat sebelumnya' (recency heuristic)."
        ],
        "caseStudy": (
            "Diberikan kalimat berita finansial: 'Regulator menyetujui merger bank setelah memeriksa laporan keuangannya.' Rancang bagaimana model Word Sense Disambiguation (WSD) dan coreference resolution menyelesaikan makna kata 'bank' dan menentukan rujukan dari kata ganti '-nya'."
        ),
        "academicReferences": [
            r"Hindle, D., & Rooth, M. (1993). Structural ambiguity and lexical relations. Computational Linguistics, 19(1), 103-120.",
            r"Levesque, H., Davis, E., & Morgenstern, L. (2012). The Winograd schema challenge. In Thirteenth International Conference on the Principles of Knowledge Representation and Reasoning.",
            r"Navigli, R. (2009). Word sense disambiguation: A survey. ACM Computing Surveys (CSUR), 41(2), 1-69."
        ]
    }
})

# ==============================================================================
# Subbab 1.4: Hipotesis Distribusional (Distributional Hypothesis) - Spot-Check Firth/Harris
# ==============================================================================
code_1_4 = r'''import numpy as np

# Implementasi Hipotesis Distribusional (Firth 1957 / Harris 1954):
# "Kata-kata yang muncul dalam lingkungan konteks serupa memiliki makna semantik yang mirip."
# Menghitung kesamaan kosinus antara vektor konteks kata dari korpus mini

def compute_cosine_similarity(vec_a, vec_b):
    dot_prod = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_prod / (norm_a * norm_b)

# Simulasi vektor ko-okurensi kata terhadap 4 kata konteks: ['minum', 'manis', 'berjalan', 'mesin']
# Kata target: 'teh', 'kopi', 'mobil'
vectors = {
    "teh":   np.array([12, 10,  0,  0]),  # Sering bersama 'minum' & 'manis'
    "kopi":  np.array([15, 11,  1,  0]),  # Profil konteks sangat mirip dengan 'teh'
    "mobil": np.array([ 0,  0, 14, 18])   # Profil konteks sangat berbeda
}

sim_teh_kopi = compute_cosine_similarity(vectors["teh"], vectors["kopi"])
sim_teh_mobil = compute_cosine_similarity(vectors["teh"], vectors["mobil"])

print("Verifikasi Numerik Hipotesis Distribusional (Distributional Hypothesis):")
print(f"Vektor Konteks 'teh'  : {vectors['teh']}")
print(f"Vektor Konteks 'kopi' : {vectors['kopi']}")
print(f"Vektor Konteks 'mobil': {vectors['mobil']}")
print("-" * 65)
print(f"Kesamaan Kosinus CosSim('teh', 'kopi')  : {sim_teh_kopi:.4f} (Semantik Dekat!)")
print(f"Kesamaan Kosinus CosSim('teh', 'mobil') : {sim_teh_mobil:.4f} (Semantik Jauh)")
print("-" * 65)
print("Terbukti: Kesamaan profil distribusi kontekstual secara langsung merefleksikan kedekatan makna.")
'''

subchapters.append({
    "id": "nlp-1-4-distributional-hypothesis",
    "chapterId": "natural-language-processing-ch-1",
    "title": "Hipotesis Distribusional: Konsep Firth, Harris (1954), dan Fondasi Semantik Vektor",
    "description": "Prinsip fundamental representasi semantik komputasional: aksioma distribusional Zellig Harris, aforisme J.R. Firth, dan transisi ke ruang vektor semantik kontinu.",
    "estimatedMinutes": 35,
    "order": 4,
    "content": {
        "theory": (
            "Landasan teoretis paling fundamental yang menopang seluruh arsitektur representasi kata dalam visi komputer dan NLP modern (mulai dari TF-IDF, Word2Vec, GloVe, hingga model LLM canggih) adalah **Hipotesis Distribusional (*Distributional Hypothesis*)**.\n\n"
            "Gagasan ini dipelopori secara independen oleh ahli bahasa struktural **Zellig S. Harris** (1954) dalam artikel seminalnya *'Distributional Structure'* dan dipopulerkan oleh ahli bahasa Inggris **John Rupert Firth** (1957) melalui aforismenya yang sangat termasyhur:\n"
            "> *\"You shall know a word by the company it keeps!\"* (Firth, 1957, p. 11).\n\n"
            "Dalam formulasi Harris (1954), bahasa dipandang sebagai sistem relasional di mana makna suatu elemen linguistik tidak didefinisikan secara esensialis abstrak, melainkan **didefinisikan secara murni oleh distribusi lingkungan kemunculannya bersama elemen-elemen lain dalam korpus teks**:\n"
            "1. Jika dua kata $w_a$ dan $w_b$ memiliki lingkungan distribusi kata tetangga (*lexical contexts*) yang hampir identik, maka $w_a$ dan $w_b$ memiliki makna semantik yang sangat mirip atau dapat saling menggantikan (*distributionally equivalent*).\n"
            "2. Derajat perbedaan makna antara dua kata berbanding lurus dengan derajat perbedaan lingkungan distribusinya.\n\n"
            "Secara komputasional, hipotesis ini memungkinkan lompatan kuantum: kita dapat mengonversi teks yang tidak terstruktur menjadi **ruang vektor semantik (*vector space semantics*)**. Setiap kata $w$ direpresentasikan sebagai sebuah vektor titik koordinat $\\mathbf{v}_w \\in \\mathbb{R}^D$ di mana masing-masing dimensi merepresentasikan bobot keterikatannya dengan konteks tertentu. Jarak semantik antara dua konsep abstrak dapat dihitung secara elegan menggunakan metrik geometri Euclidean atau kesamaan kosinus (*Cosine Similarity*):\n"
            "$$\\text{Sim}(w_1, w_2) = \\cos(\\mathbf{v}_1, \\mathbf{v}_2) = \\frac{\\mathbf{v}_1 \\cdot \\mathbf{v}_2}{\\|\\mathbf{v}_1\\|_2 \\|\\mathbf{v}_2\\|_2} = \\frac{\\sum_{i=1}^D v_{1,i} v_{2,i}}{\\sqrt{\\sum_{i=1}^D v_{1,i}^2} \\sqrt{\\sum_{i=1}^D v_{2,i}^2}}$$\n"
            "Formula geometris ini mentransformasikan penalaran semantik bahasa yang kualitatif menjadi operasi aljabar linier komputasional berkecepatan tinggi."
        ),
        "codeSnippet": code_1_4,
        "codeSnippetOutput": run_code_capture_output(code_1_4),
        "realWorldApplication": (
            "Menjadi fondasi seluruh sistem pencarian informasi (Information Retrieval), mesin penemu sinonim otomatis, ekstraksi kata kunci SEO, dan algoritma rekomendasi konten berbasis kemiripan teks."
        ),
        "commonPitfalls": [
            r"Mengabaikan masalah antonimi: kata berlawanan makna (misal 'panas' dan 'dingin') sering muncul pada konteks lingkungan yang identik (misal 'cuaca sangat ... hari ini'), sehingga model distribusional naif sering menganggap antonim sebagai sinonim.",
            r"Jendela konteks (context window) yang terlalu sempit hanya menangkap informasi sintaksis, sedangkan jendela yang terlalu lebar mengaburkan fokus semantik.",
            r"Ukuran korpus yang tidak memadai menghasilkan estimasi distribusi frekuensi yang bias dan bising."
        ],
        "caseStudy": (
            "Sebuah mesin pencari e-commerce ingin memastikan bahwa pencarian kueri 'laptop' secara otomatis juga menampilkan produk dengan kata 'notebook'. Jelaskan bagaimana hipotesis distribusional memungkinkan penemuan relasi kesamaan ini secara murni dari log klik pengguna tanpa perlu kamus sinonim manual buatan manusia."
        ),
        "academicReferences": [
            r"Harris, Z. S. (1954). Distributional structure. Word, 10(2-3), 146-162.",
            r"Firth, J. R. (1957). A synopsis of linguistic theory, 1930-1955. Studies in linguistic analysis, 1-32.",
            r"Sahlgren, M. (2008). The distributional hypothesis. Italian Journal of Linguistics, 20(1), 33-54."
        ]
    }
})

# ==============================================================================
# Subbab 1.5: Korpus Linguistik & WordNet (Synsets, Taksonomi)
# ==============================================================================
code_1_5 = r'''import numpy as np

# Simulasi Struktur Graf Taksonomi Hierarkis WordNet (Miller & Fellbaum, Princeton)
# Representasi Synsets (Kumpulan Sinonim) dan Relasi Is-A (Hypernym / Hyponym)

taxonomy = {
    "anjing":  {"hypernym": "karnivora", "synset": ["anjing", "canine", "guguk"]},
    "kucing":  {"hypernym": "karnivora", "synset": ["kucing", "feline", "meong"]},
    "karnivora": {"hypernym": "mamalia",  "synset": ["karnivora", "pemakan_daging"]},
    "mamalia":   {"hypernym": "hewan",    "synset": ["mamalia", "hewan_menyusui"]},
    "hewan":     {"hypernym": "entitas",  "synset": ["hewan", "fauna", "makhluk_hidup"]},
    "entitas":   {"hypernym": None,       "synset": ["entitas", "sesuatu"]}
}

def get_ancestors_and_depth(node, tax):
    path = [node]
    curr = node
    while tax[curr]["hypernym"] is not None:
        curr = tax[curr]["hypernym"]
        path.append(curr)
    return path, len(path) - 1

path_anjing, depth_anjing = get_ancestors_and_depth("anjing", taxonomy)
path_kucing, depth_kucing = get_ancestors_and_depth("kucing", taxonomy)

# Cari Lowest Common Subsumer (LCS)
common_ancestors = [a for a in path_anjing if a in path_kucing]
lcs = common_ancestors[0]
_, depth_lcs = get_ancestors_and_depth(lcs, taxonomy)

print("Representasi Graf Hierarki Taksonomi Semantik WordNet:")
print(f"Jalur Taksonomi 'anjing': {' -> '.join(path_anjing)} (Depth = {depth_anjing})")
print(f"Jalur Taksonomi 'kucing': {' -> '.join(path_kucing)} (Depth = {depth_kucing})")
print(f"\nLowest Common Subsumer (LCS) Leluhur Terdekat: '{lcs}' (Depth = {depth_lcs})")
print("WordNet mengorganisasikan leksikon bahasa ke dalam relasi ontologi pengetahuan eksplisit.")
'''

subchapters.append({
    "id": "nlp-1-5-corpora-wordnet-taxonomy",
    "chapterId": "natural-language-processing-ch-1",
    "title": "Korpus Linguistik & Sumber Daya Bahasa: Brown Corpus, Penn Treebank, dan Taksonomi WordNet",
    "description": "Basis data pengetahuan leksikal komputasional: sejarah korpus teranotasi, struktur graf leksikal WordNet (Fellbaum & Miller), konsep Synsets, dan relasi ontologis.",
    "estimatedMinutes": 35,
    "order": 5,
    "content": {
        "theory": (
            "Sebelum era model bahasa raksasa tanpa supervisi, kemajuan NLP sangat bergantung pada ketersediaan **Korpus Linguistik Terstandar (*Standardized Linguistic Corpora*)** dan **Basis Data Leksikal Terstruktur (*Lexical Databases*)** yang dikurasi secara ketat oleh akademisi.\n\n"
            "Tiga tonggak korpus historis terpenting meliputi:\n"
            "1. **Brown Corpus (Francis & Kucera, 1964, Brown University)**: Korpus digital pertama dari bahasa Inggris Amerika ragam cetak, terdiri dari 500 teks dan tepat 1.014.312 kata dari 15 genre berbeda (mulai dari berita jurnalistik, literatur fiksi ilmiah, hingga teks keagamaan). Menjadi standar pertama penetapan frekuensi kata dan benchmarking linguistik komputasional.\n"
            "2. **Penn Treebank (Mitchell Marcus et al., 1993, University of Pennsylvania)**: Korpus terobosan berisi lebih dari 4,5 juta kata dari artikel Wall Street Journal yang dianotasi secara manual dengan label *Part-of-Speech* (45 tag POS standar) dan pohon sintaksis konstituen penuh (*skeletal syntactic parse trees*). Menjadi tolok ukur universal evaluasi parser probabilistik selama dua dekade.\n\n"
            "Di ranah semantik, **WordNet** (George Miller & Christiane Fellbaum, Princeton University, 1995) merevolusi pemodelan leksikon bahasa Inggris. Alih-alih menyusun kata secara alfabetis seperti kamus konvensional, WordNet mengorganisasi kata ke dalam jaringan graf ontologi berbasis relasi konseptual semantik:\n"
            "- **Synset (Synonym Set)**: Kumpulan lema kata yang dapat saling menggantikan dalam konteks tertentu karena mewakili konsep spesifik yang sama. Sebuah kata polisemi dapat menjadi anggota dari beberapa synset berbeda.\n"
            "- **Relasi Leksikal & Konseptual**:\n"
            "  * *Hipernimi (Hypernymy)* dan *Hiponimi (Hyponymy)*: Relasi taksonomi 'Is-A' hierarkis (misal *mamalia* adalah hipernim dari *kucing*, *kucing* adalah hiponim dari *mamalia*).\n"
            "  * *Meronimi (Meronymy)* dan *Holonimi (Holonymy)*: Relasi bagian-keseluruhan 'Part-Of' (misal *roda* adalah meronim dari *mobil*, *mobil* adalah holonim dari *roda*).\n"
            "  * *Antonimi*: Relasi pertentangan makna biner langsung (misal *panas* vs *dingin*).\n\n"
            "Secara formal dalam topologi graf taksonomi, kedalaman (*depth*) suatu konsep didefinisikan sebagai panjang lintasan terpendek dari simpul akar utama: $depth(c) = \\min_{r \\in \\mathcal{R}} d(r, c)$. Nilai kedalaman ini menjadi variabel penentu dalam mengukur spesifisitas semantik synset pada taksonomi leksikal WordNet."
        ),
        "codeSnippet": code_1_5,
        "codeSnippetOutput": run_code_capture_output(code_1_5),
        "realWorldApplication": (
            "Digunakan dalam sistem tanya-jawab pencarian literatur biomedis (UMLS/MeSH), query expansion pada mesin pencari hukum perpajakan, dan verifikasi konsistensi taksonomi katalog e-commerce."
        ),
        "commonPitfalls": [
            r"Ketergantungan penuh pada WordNet mengabaikan entitas bernama kontemporer (nama orang, merek dagang, istilah teknologi baru) yang tidak ada dalam kamus kurasi.",
            r"Biaya pemeliharaan manual basis data leksikal sangat mahal dan sulit diskalakan ke ratusan bahasa di dunia.",
            r"Granularitas pembagian synset yang terlalu halus pada WordNet (fine-grained sense distinctions) sering kali membingungkan bahkan annotator manusia."
        ],
        "caseStudy": (
            "Sebuah sistem penilai esai otomatis ingin mengevaluasi kekayaan kosakata siswa. Jelaskan bagaimana taksonomi hierarkis WordNet digunakan untuk mengukur kedalaman variasi leksikal siswa tanpa terjebak pada sinonim pengulangan sederhana."
        ),
        "academicReferences": [
            r"Miller, G. A. (1995). WordNet: a lexical database for English. Communications of the ACM, 38(11), 39-41.",
            r"Fellbaum, C. (Ed.). (1998). WordNet: An electronic lexical database. MIT press.",
            r"Marcus, M. P., Marcinkiewicz, M. A., & Santorini, B. (1993). Building a large annotated corpus of English: The Penn Treebank. Computational Linguistics, 19(2), 313-330."
        ]
    }
})

# ==============================================================================
# Subbab 1.6: Metrik Kemiripan Semantik WordNet (Path, Wu-Palmer, Resnik)
# ==============================================================================
code_1_6 = r'''import numpy as np

# Implementasi Metrik Kemiripan Semantik Berbasis Graf Taksonomi WordNet:
# 1. Path Similarity: Sim = 1 / (path_length + 1)
# 2. Wu & Palmer (1994) Similarity: Sim_wup = (2 * depth(LCS)) / (depth(c1) + depth(c2))

def path_similarity(depth_c1, depth_c2, depth_lcs):
    # Panjang lintasan terpendek antar konsep melalui LCS: (depth_c1 - depth_lcs) + (depth_c2 - depth_lcs)
    path_len = (depth_c1 - depth_lcs) + (depth_c2 - depth_lcs)
    return 1.0 / (path_len + 1.0)

def wu_palmer_similarity(depth_c1, depth_c2, depth_lcs):
    # Rasio kedalaman konseptual bersama terhadap total kedalaman
    sim = (2.0 * depth_lcs) / (depth_c1 + depth_c2)
    return sim

# Evaluasi Pasangan:
# Pasangan A: "anjing" (depth=4) dan "kucing" (depth=4) dengan LCS="karnivora" (depth=3)
# Pasangan B: "anjing" (depth=4) dan "ikan" (depth=3) dengan LCS="hewan" (depth=1)

sim_path_ak = path_similarity(4, 4, 3)
sim_wup_ak  = wu_palmer_similarity(4, 4, 3)

sim_path_ai = path_similarity(4, 3, 1)
sim_wup_ai  = wu_palmer_similarity(4, 3, 1)

print("Komparasi Metrik Kemiripan Taksonomi Semantik:")
print(f"1. Pasangan Anjing - Kucing (Satu Ordo Karnivora):")
print(f"   * Path Similarity      : {sim_path_ak:.4f}")
print(f"   * Wu-Palmer Similarity : {sim_wup_ak:.4f}")
print(f"\n2. Pasangan Anjing - Ikan (Leluhur Jauh di Tingkat Hewan):")
print(f"   * Path Similarity      : {sim_path_ai:.4f}")
print(f"   * Wu-Palmer Similarity : {sim_wup_ai:.4f}")
print("\nWu-Palmer memperhitungkan kedalaman absolut LCS untuk kalibrasi spesifisitas konsep.")
'''

subchapters.append({
    "id": "nlp-1-6-wordnet-semantic-similarity",
    "chapterId": "natural-language-processing-ch-1",
    "title": "Metrik Kemiripan Semantik WordNet: Path Similarity, Leacock-Chodorow, Wu-Palmer, dan Resnik",
    "description": "Pengukuran jarak makna matematis pada graf taksonomi hierarkis: formulasi path length, penskalaan kedalaman Wu-Palmer, dan integrasi Information Content (Resnik).",
    "estimatedMinutes": 35,
    "order": 6,
    "content": {
        "theory": (
            "Sebelum era embedding vektor kontinu berdimensi tinggi, pengukuran derajat kesamaan makna antar kata diselesaikan secara matematis melalui metrik jarak topologi pada struktur graf asiklik terarah (*Directed Acyclic Graph* / DAG) dari taksonomi hierarki hipernimi WordNet.\n\n"
            "Diberikan dua synset konsep $c_1$ dan $c_2$, konsep leluhur bersama paling spesifik didefinisikan sebagai **Lowest Common Subsumer (LCS)**:\n"
            "$$\\text{LCS}(c_1, c_2) = \\arg\\max_{c \\in \\text{Ancestors}(c_1) \\cap \\text{Ancestors}(c_2)} \\text{depth}(c)$$\n"
            "di mana $\\text{depth}(c)$ adalah jarak terpendek dari simpul akar (*root node*) taksonomi ke simpul $c$.\n\n"
            "Empat formulasi metrik kemiripan kanonikal meliputi:\n"
            "1. **Path-Based Similarity**: Mengukur invers dari panjang lintasan terpendek $len(c_1, c_2)$ yang menghubungkan kedua konsep melalui LCS:\n"
            "$$\\text{Sim}_{path}(c_1, c_2) = \\frac{1}{len(c_1, c_2) + 1} = \\frac{1}{(\\text{depth}(c_1) - \\text{depth}(\\text{LCS})) + (\\text{depth}(c_2) - \\text{depth}(\\text{LCS})) + 1}$$\n\n"
            "2. **Leacock & Chodorow Similarity (1998)**: Memperbaiki path similarity dengan memperhitungkan kedalaman maksimum seluruh taksonomi $D_{max}$ dalam skala logaritmik:\n"
            "$$\\text{Sim}_{lch}(c_1, c_2) = -\\log \\left( \\frac{len(c_1, c_2)}{2 \\cdot D_{max}} \\right)$$\n\n"
            "3. **Wu & Palmer Similarity (1994)**: Menormalisasi jarak berdasarkan kedalaman posisi LCS terhadap jumlah total kedalaman kedua konsep:\n"
            "$$\\text{Sim}_{wup}(c_1, c_2) = \\frac{2 \\cdot \\text{depth}(\\text{LCS}(c_1, c_2))}{\\text{depth}(c_1) + \\text{depth}(c_2)}$$\n"
            "Nilai $\\text{Sim}_{wup}$ terikat rapi dalam rentang $0 < \\text{Sim}_{wup} \\le 1$.\n\n"
            "4. **Resnik Information Content (1995)**: Mengatasi kelemahan metrik berbasis jarak murni yang mengasumsikan seluruh tautan tepi graf memiliki bobot semantik yang seragam. Resnik menggabungkan frekuensi korpus dengan menghitung **Information Content (IC)** dari konsep leluhur bersama:\n"
            "$$\\text{IC}(c) = -\\log P(c) \\implies \\text{Sim}_{resnik}(c_1, c_2) = \\text{IC}(\\text{LCS}(c_1, c_2))$$\n"
            "Konsep yang sangat umum (seperti *entitas*) memiliki peluang kemunculan tinggi dan IC rendah, sedangkan konsep spesifik (seperti *karnivora*) membawa IC tinggi."
        ),
        "codeSnippet": code_1_6,
        "codeSnippetOutput": run_code_capture_output(code_1_6),
        "realWorldApplication": (
            "Digunakan dalam penentuan kemiripan istilah medis pada ontologi kedokteran SNOMED-CT / Gene Ontology, serta prapemrosesan sistem penegasan kemiripan klaim paten teknologi."
        ),
        "commonPitfalls": [
            r"Mengasumsikan panjang satu langkah tepi graf pada tingkat atas taksonomi (misal 'entitas' ke 'hewan') setara dengan satu langkah pada tingkat bawah (misal 'pudel' ke 'anjing'), yang dapat menimbulkan distorsi jarak semantik jika tidak dikalibrasi kedalaman.",
            r"Menghitung kemiripan kata polisemi tanpa memilih pasangan synset yang tepat, menghasilkan skor kemiripan acak.",
            r"Kegagalan penanganan konsep yang berada pada pohon taksonomi terpisah (tidak memiliki simpul LCS bersama)."
        ],
        "caseStudy": (
            "Diberikan dua kata 'kucing' dan 'harimau' (keduanya dalam famili Felidae pada kedalaman tinggi), dibandingkan dengan 'kucing' dan 'anjing' (keduanya dalam ordo Karnivora). Hitung secara analitis mengapa Wu-Palmer memberikan skor kemiripan yang jauh lebih tinggi pada pasangan kucing-harimau daripada pasangan kucing-anjing."
        ),
        "academicReferences": [
            r"Wu, Z., & Palmer, M. (1994). Verbs semantics and lexical selection. In 32nd annual meeting of the association for computational linguistics (pp. 133-138).",
            r"Resnik, P. (1995). Using information content to evaluate semantic similarity in a taxonomy. arXiv preprint cmp-lg/9511007.",
            r"Leacock, C., & Chodorow, M. (1998). Combining local context and WordNet similarity for word sense identification. WordNet: An electronic lexical database, 49(2), 265-283."
        ]
    }
})

# ==============================================================================
# Subbab 1.7: Hukum Zipf (Zipf's Law)
# ==============================================================================
code_1_7 = r'''import numpy as np

# Simulasi dan Verifikasi Hukum Zipf (Zipf's Law, 1949):
# Frekuensi kata ke-r berbanding terbalik dengan peringkat rank r:
# f(r) = C / (r^s), di mana s ~ 1.0
# Dalam skala logaritma: log(f) = log(C) - s * log(r) (Hubungan Linear Sempurna!)

# Simulasi korpus teks sintetis dengan 10.000 kata unik
ranks = np.arange(1, 21) # 20 peringkat teratas
C_constant = 10000.0
s_param = 1.0

# Frekuensi teoritis Zipf
theoretical_freqs = C_constant / (ranks ** s_param)

# Estimasi linear regresi pada domain log-log
log_ranks = np.log10(ranks)
log_freqs = np.log10(theoretical_freqs)

# Kemiringan kurva (slope): d(log f) / d(log r) = -s
slope, intercept = np.polyfit(log_ranks, log_freqs, 1)

print("Verifikasi Hukum Zipf pada Distribusi Frekuensi Kata:")
print("-" * 70)
print(f"{'Rank (r)':<10} | {'Frekuensi f(r)':<18} | {'Persentase Korpus':<15}")
print("-" * 70)
total_words = np.sum(theoretical_freqs)
for r, f in zip(ranks[:5], theoretical_freqs[:5]):
    print(f"{r:<10} | {f:<18.1f} | {f / total_words * 100:13.2f}%")
print("-" * 70)
print(f"Kemiringan Kurva Log-Log (Slope s): {slope:.4f} (Mendekati eksak -1.0)")
print("Karakteristik Zipf: Kata peringkat 1 muncul 2x lebih sering dari peringkat 2,")
print("dan 10x lebih sering dari peringkat 10!")
'''

subchapters.append({
    "id": "nlp-1-7-zipfs-law-text-distributions",
    "chapterId": "natural-language-processing-ch-1",
    "title": "Hukum Zipf (Zipf's Law): Distribusi Frekuensi Kata dan Implikasi Komputasinya",
    "description": "Hukum daya empiris linguistik kuantitatif George Kingsley Zipf: distribusi frekuensi berbanding terbalik peringkat, linearitas log-log, dan konsekuensi komputasi model bahasa.",
    "estimatedMinutes": 35,
    "order": 7,
    "content": {
        "theory": (
            "Dalam analisis korpus bahasa alami apa pun di dunia, distribusi frekuensi kemunculan kata tidak mengikuti distribusi normal Gaussian, melainkan diatur secara universal oleh hukum fisika linguistik kuantitatif yang dikenal sebagai **Hukum Zipf (*Zipf's Law*)**, dirumuskan oleh ahli bahasa Harvard **George Kingsley Zipf** (1949) dalam karyanya *'Human Behavior and the Principle of Least Effort'*.\n\n"
            "Hukum Zipf menyatakan bahwa dalam korpus bahasa alami berukuran besar, **frekuensi kemunculan suatu kata $f$ berbanding terbalik secara proporsional dengan posisi peringkatnya ($r$) dalam tabel frekuensi terurut**:\n"
            "$$f(r) \\propto \\frac{1}{r^s} \\implies f(r) = \\frac{C}{r^s}$$\n"
            "di mana $r$ adalah peringkat kata ($r=1$ untuk kata paling sering muncul), $s$ adalah eksponen empiris yang nilainya sangat mendekati $1$ ($s \\approx 1.0$ untuk bahasa Inggris dan Indonesia), dan $C$ adalah konstanta normalisasi.\n\n"
            "Transformasi logaritma natural pada kedua sisi persamaan mengungkap sifat kelinieran murni pada ruang log-log (*power-law distribution*):\n"
            "$$\\log f(r) = \\log C - s \\cdot \\log r$$\n"
            "Grafik antara $\\log f(r)$ terhadap $\\log r$ membentuk garis lurus menurun dengan gradien kemiringan $-1$.\n\n"
            "Implikasi komputasional Hukum Zipf sangat mencengangkan dan mendikte arsitektur rekayasa NLP:\n"
            "1. **Puncak Padat Kepala (*Heavy Head*)**: Sejumlah kecil kata fungsional berfrekuensi sangat tinggi (seperti *'the'*, *'of'*, *'dan'*, *'yang'*) menyumbang lebih dari 30–50% dari total seluruh kata dalam korpus teks mana pun.\n"
            "2. **Ekor Sangat Panjang (*Long Tail / Hapax Legomena*)**: Mayoritas besar kosakata dalam kamus (sering kali lebih dari 40–60% dari seluruh kata unik) hanya muncul **tepat satu kali** (*hapax legomena*) di seluruh korpus.\n"
            "Konsekuensinya, model statistik probabilitas tidak akan pernah memiliki data yang cukup untuk mengestimasi kata-kata pada ekor panjang tersebut secara akurat jika hanya mengandalkan perhitungan frekuensi mentah, melahirkan kebutuhan mutlak akan teknik *Smoothing* dan tokenisasi *Subword*."
        ),
        "codeSnippet": code_1_7,
        "codeSnippetOutput": run_code_capture_output(code_1_7),
        "realWorldApplication": (
            "Digunakan dalam perancangan arsitektur mesin pencari komersial untuk menentukan strategi kompresi indeks terbalik (Inverted Index), pemangkasan kamus stopwords, dan pengalokasian memori cache server."
        ),
        "commonPitfalls": [
            r"Mengasumsikan frekuensi kata berdistribusi Gaussian atau Poisson, yang membuat model statistik mengabaikan probabilitas kata langka.",
            r"Memotong kosakata kamus terlalu agresif pada batas frekuensi tertentu tanpa menyediakan tokenisasi fallback subword, yang memicu lonjakan tingkat OOV.",
            r"Mengabaikan fakta bahwa konstanta s dapat sedikit bervariasi pada korpus spesifik (misal teks medis ilmiah memiliki s > 1.2 karena leksikon teknis terkonsentrasi)."
        ],
        "caseStudy": (
            "Diberikan korpus artikel berita bahasa Indonesia dengan 1.000.000 kata total. Kata terpopuler peringkat 1 ('yang') muncul sebanyak 70.000 kali. Berdasarkan Hukum Zipf klasik (s = 1.0), estimasikan frekuensi kemunculan kata pada peringkat 10, peringkat 100, dan peringkat 1.000, lalu analisis implikasinya terhadap alokasi memori tabel embedding."
        ),
        "academicReferences": [
            r"Zipf, G. K. (1949). Human behavior and the principle of least effort: An introduction to human ecology. Addison-Wesley.",
            r"Manning, C. D., & Schütze, H. (1999). Foundations of statistical natural language processing. MIT press.",
            r"Baayen, R. H. (2002). Word frequency distributions. Springer Science & Business Media."
        ]
    }
})

# ==============================================================================
# Subbab 1.8: Hukum Heaps (Heaps' Law)
# ==============================================================================
code_1_8 = r'''import numpy as np

# Simulasi dan Verifikasi Hukum Heaps (Heaps' Law, 1978):
# V(N) = k * N^beta
# V = Jumlah kata unik (kosakata)
# N = Total jumlah kata (panjang korpus)
# Tipikal parameter bahasa Inggris/Indonesia: k in [10, 100], beta in [0.4, 0.6]

k_param = 30.0
beta_param = 0.5 # akar kuadrat sublinear

corpus_sizes_N = np.array([1000, 10000, 100000, 1000000, 10000000])
vocab_sizes_V = k_param * (corpus_sizes_N ** beta_param)

print("Pertumbuhan Kosakata Berdasarkan Hukum Heaps (k=30, beta=0.5):")
print("-" * 75)
print(f"{'Ukuran Korpus N (Token)':<25} | {'Ukuran Kosakata V (Kata Unik)':<30} | {'Rasio V/N'}")
print("-" * 75)
for n, v in zip(corpus_sizes_N, vocab_sizes_V):
    print(f"{n:<25,d} | {int(v):<30,d} | {v/n*100:6.2f}%")
print("-" * 75)
print("Hukum Heaps membuktikan bahwa kosakata TIDAK PERNAH berhenti bertumbuh")
print("seiring bertambahnya data (pertumbuhan sublinear tanpa batas jenuh).")
'''

subchapters.append({
    "id": "nlp-1-8-heaps-law-vocabulary-growth",
    "chapterId": "natural-language-processing-ch-1",
    "title": "Hukum Heaps (Heaps' Law): Pertumbuhan Ukuran Kosakata Terhadap Panjang Korpus",
    "description": "Pemodelan ekspansi kamus leksikal: formulasi sublinear V = k * N^beta, analisis ketidakterhinggaan kosakata, dan justifikasi perlunya tokenisasi berbasis subkata.",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "Pertanyaan teknik fundamental dalam perancangan model bahasa adalah: *'Berapa ukuran kosakata kamus $|V|$ yang harus kita alokasikan ketika korpus teks latih membesar dari ribuan menjadi miliaran kata?'* Jawaban empiris matematis diberikan oleh **Hukum Heaps (*Heaps' Law*)** (Harold Stanley Heaps, 1978), yang terkadang juga dikenal sebagai hukum Herdan dalam linguistik kuantitatif.\n\n"
            "Hukum Heaps menyatakan bahwa hubungan antara jumlah kata unik dalam kamus kosakata ($V$) dan total jumlah kata yang telah dipindai dari korpus ($N$) mengikuti fungsi pangkat sublinear (*sublinear power function*):\n"
            "$$V(N) = k \\cdot N^\\beta$$\n"
            "di mana:\n"
            "- $N$ adalah total jumlah token kata dalam teks (*corpus size in tokens*).\n"
            "- $V$ adalah jumlah tipe kata unik yang berbeda (*vocabulary size in types*).\n"
            "- $k$ adalah parameter skala positif yang bergantung pada kompleksitas morfologi bahasa dan domain teks (biasanya $10 \\le k \\le 100$ untuk korpus tipikal).\n"
            "- $\\beta$ adalah eksponen elastisitas pertumbuhan yang berada dalam rentang $0 < \\beta < 1$ (pada bahasa alami, nilai empiris tipikal berkisar antara $\\beta \\approx 0.4$ hingga $0.6$).\n\n"
            "Secara logaritmik, hubungan ini kembali linear:\n"
            "$$\\log V = \\log k + \\beta \\log N$$\n\n"
            "Dua kesimpulan kritis yang diturunkan dari Hukum Heaps adalah:\n"
            "1. **Kosakata Bersifat Terbuka (*Open-Ended Vocabulary*)**: Karena $\\beta > 0$, grafik pertumbuhan fungsi $V(N)$ **tidak pernah mencapai titik jenuh asimtotik horizontal**. Berapa pun besarnya data teks yang kita kumpulkan (bahkan pada triliunan token Common Crawl), kita akan selalu menemukan kata-kata baru (nama orang, neologisme, istilah teknis, salah ketik, akronim).\n"
            "2. **Kegagalan Representasi Tingkat Kata (*Word-Level Failure*)**: Menetapkan kamus tetap berbasis kata penuh (*fixed full-word vocabulary*) seperti pada era Word2Vec awal pasti akan menghadapi dilema: jika kamus dibuat sangat besar (misal $|V| = 2.000.000$), komputasi matriks embedding meledak; namun jika dibatasi (misal $|V| = 50.000$), sistem akan menderita masalah kata di luar kamus (*Out-Of-Vocabulary / OOV*) yang sangat parah. Fenomena inilah yang secara ilmiah memvalidasi mengapa tokenizer subkata (BPE, WordPiece) menjadi standar wajib pada era modern."
        ),
        "codeSnippet": code_1_8,
        "codeSnippetOutput": run_code_capture_output(code_1_8),
        "realWorldApplication": (
            "Digunakan oleh insinyur infrastruktur AI untuk memproyeksikan kebutuhan alokasi memori RAM/VRAM saat menskalakan dataset pra-pelatihan model dari skala gigabyte ke terabyte."
        ),
        "commonPitfalls": [
            r"Mengalokasikan tabel hash kamus dengan ukuran statis tetap tanpa memperhitungkan ekspansi Heaps, memicu tabrakan hash (hash collisions) yang masif saat korpus membesar.",
            r"Mengasumsikan nilai beta konstan antar bahasa yang berbeda (bahasa aglutinatif seperti bahasa Turki dan Finlandia memiliki nilai beta jauh lebih tinggi ~0.7 dibandingkan bahasa isolatif seperti bahasa Mandarin ~0.3).",
            r"Mengabaikan data teks yang kotor (noisy web text) yang memperbesar nilai k secara artifisial akibat sampah string acak."
        ],
        "caseStudy": (
            "Sebuah tim insinyur melatih model bahasa pada korpus berukuran 100 juta kata dengan k = 40 dan beta = 0.5. Hitung estimasi ukuran kosakata kamus V. Jika dataset diperluas 100 kali lipat menjadi 10 miliar kata, hitung pertambahan ukuran kosakata baru dan jelaskan mengapa memori embedding layer akan membengkak jika tidak menggunakan tokenisasi subkata."
        ),
        "academicReferences": [
            r"Heaps, H. S. (1978). Information retrieval: Computational and theoretical aspects. Academic Press.",
            r"Herdan, G. (1960). Type-token mathematics: A textbook of mathematical linguistics. Mouton & Co.",
            r"Baeza-Yates, R., & Ribeiro-Neto, B. (1999). Modern information retrieval (Vol. 463). New York: ACM press."
        ]
    }
})

# ==============================================================================
# Subbab 1.9: Arsitektur Pipeline NLP Tradisional
# ==============================================================================
code_1_9 = r'''import numpy as np

# Simulasi Alur Pipeline NLP Klasik End-to-End:
# Teks Mentah -> Normalisasi -> Tokenisasi -> Ekstraksi Fitur Vektor -> Inferensi Klasifikasi

class MockNLPPipeline:
    def __init__(self, vocab):
        self.vocab = {word: idx for idx, word in enumerate(vocab)}
        # Bobot regresi logistik terkalibrasi buatan untuk sentimen positif
        self.weights = np.array([1.2, 0.8, -1.5, -0.9]) # ['bagus', 'hebat', 'buruk', 'rusak']
        self.bias = 0.1
        
    def preprocess_and_tokenize(self, text):
        # 1. Case folding dan pembersihan tanda baca sederhana
        clean_text = "".join([c.lower() for c in text if c.isalnum() or c.isspace()])
        # 2. Tokenisasi spasi
        tokens = clean_text.split()
        return tokens
        
    def extract_features(self, tokens):
        # 3. Vektorisasi Bag-of-Words biner
        feat_vec = np.zeros(len(self.vocab))
        for t in tokens:
            if t in self.vocab:
                feat_vec[self.vocab[t]] += 1.0
        return feat_vec
        
    def predict_sentiment(self, text):
        tokens = self.preprocess_and_tokenize(text)
        features = self.extract_features(tokens)
        # 4. Logit dan Sigmoid
        logit = np.dot(features, self.weights) + self.bias
        prob = 1.0 / (1.0 + np.exp(-logit))
        return prob, tokens, features

pipeline = MockNLPPipeline(vocab=["bagus", "hebat", "buruk", "rusak"])
sample_text = "Produk ini SANGAT BAGUS dan hebat kualitasnya!"
prob_pos, toks, feats = pipeline.predict_sentiment(sample_text)

print(f"Kalimat Input   : '{sample_text}'")
print(f"Hasil Tokenisasi : {toks}")
print(f"Vektor Fitur BoW : {feats} (Sesuai vocab ['bagus', 'hebat', 'buruk', 'rusak'])")
print(f"Peluang Sentimen Positif : {prob_pos * 100:.2f}%")
print("Pipeline tradisional memproses bahasa secara bertahap melalui modul independen modular.")
'''

subchapters.append({
    "id": "nlp-1-9-traditional-nlp-pipeline",
    "chapterId": "natural-language-processing-ch-1",
    "title": "Arsitektur Pipeline NLP Tradisional: Tahapan Modular dari Teks Mentah ke Keputusan",
    "description": "Struktur modular sistem pemrosesan teks klasik: pembersihan korpus, segmentasi, ekstraksi fitur leksikal, pemodelan statistik, dan propagasi galat antar modul.",
    "estimatedMinutes": 35,
    "order": 9,
    "content": {
        "theory": (
            "Sebelum maraknya arsitektur *end-to-end deep learning*, sistem NLP komersial dan akademik dibangun menggunakan paradigma **Modular Sequential Pipeline** (seperti yang diimplementasikan pada pustaka klasik CoreNLP Stanford, NLTK, dan OpenNLP). Teks mentah dialirkan melalui serangkaian tahapan diskrit yang masing-masing menjalankan tugas linguistik spesifik secara berurutan.\n\n"
            "Tahapan modular standar pipeline NLP meliputi:\n"
            "1. **Prapemrosesan dan Normalisasi Teks (*Text Preprocessing*)**: Mengubah teks mentah menjadi representasi kanonikal melalui pembersihan tag HTML, normalisasi karakter Unicode, konversi huruf kecil (*case folding*), ekspansi kontraksi, dan segmentasi batas kalimat.\n"
            "2. **Tokenisasi (*Tokenization*)**: Memecah aliran karakter kontinu menjadi potongan unit token diskrit (kata, tanda baca, atau morfem).\n"
            "3. **Penyaringan Leksikal (*Lexical Filtering*)**: Menghapus kata-kata henti umum (*stopwords removal*) dan mereduksi variasi fleksi kata ke bentuk dasarnya menggunakan *Stemmer* atau *Lemmatizer*.\n"
            "4. **Pengayaan Linguistik Sintaksis (*Syntactic Tagging*)**: Menandai kategori gramatikal kata (*Part-of-Speech Tagging*), melokalisasi entitas penting (*Named Entity Recognition*), dan menyusun pohon sintaksis frasa (*Syntactic Parsing*).\n"
            "5. **Vektorisasi Fitur (*Feature Engineering*)**: Mengonversi token-token terstruktur ke dalam format matriks numerik numerik berdimensi tinggi yang dapat diproses oleh algoritma mesin belajar (seperti One-Hot, Bag-of-Words, TF-IDF, atau fitur n-gram leksikal manual).\n"
            "6. **Model Pembelajaran Mesin (*Machine Learning Model*)**: Melatih classifier linear (Naïve Bayes, Logistic Regression, Support Vector Machines) untuk menghasilkan prediksi akhir (klasifikasi sentimen, perutean tiket keluhan, atau deteksi spam).\n\n"
            "Kelemahan paling fatal dari arsitektur modular tradisional ini adalah fenomena **Akumulasi Galat (*Error Propagation*)**: jika modul tokenizer di awal membuat kesalahan pemisahan kata sebesar 5%, kesalahan tersebut akan merusak modul POS tagger, yang selanjutnya merusak parser sintaksis, hingga model klasifikasi akhir menerima representasi fitur yang cacat total.\n\n"
            "Secara formal, arsitektur pipeline sekuensial dimodelkan sebagai komposisi fungsi berurutan $y = (f_k \\circ f_{k-1} \\circ \\dots \\circ f_1)(x)$. Jika masing-masing modul ke-$i$ memiliki probabilitas galat $\\epsilon_i$, maka probabilitas keberhasilan sistem secara keseluruhan dibatasi oleh $P(\\text{sukses}) = \\prod_{i=1}^k (1 - \\epsilon_i)$, yang membuktikan bagaimana akumulasi galat pada tahap awal dengan cepat menurunkan akurasi sistem secara eksponensial."
        ),
        "codeSnippet": code_1_9,
        "codeSnippetOutput": run_code_capture_output(code_1_9),
        "realWorldApplication": (
            "Banyak digunakan pada sistem filter email spam (SpamAssassin), pemilah tiket otomatis departemen IT perusahaan, dan ekstraktor informasi formulir resume lamaran kerja."
        ),
        "commonPitfalls": [
            r"Mengabaikan masalah error propagation: tidak melakukan validasi kualitas output di setiap tahap perantara pipeline sebelum dialirkan ke tahap berikutnya.",
            r"Menerapkan urutan pipeline yang salah (misalnya melakukan stemming sebelum melakukan POS tagging, yang merusak sufiks penanda kelas kata).",
            r"Menghapus seluruh tanda baca tanpa seleksi, yang menghilangkan makna emosi (tanda seru/tanya) dan singkatan angka numerik."
        ],
        "caseStudy": (
            "Sebuah sistem analisis sentimen ulasan film memproses kalimat: 'Film ini tidak jelek, bahkan sangat memukau.' Jelaskan bagaimana tahap pembersihan stopwords dan unigram bag-of-words naif dapat menghilangkan kata negasi 'tidak' dan menyebabkan model memprediksi sentimen negatif karena adanya kata 'jelek'."
        ),
        "academicReferences": [
            r"Manning, C. D., Surdeanu, M., Bauer, J., Finkel, J. R., Bethard, S., & McClosky, D. (2014). The Stanford CoreNLP natural language processing toolkit. In Proceedings of 52nd annual meeting of the association for computational linguistics: system demonstrations (pp. 55-60).",
            r"Bird, S., Klein, E., & Loper, E. (2009). Natural language processing with Python: analyzing text with the natural language toolkit. O'Reilly Media, Inc.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 1.10: Implementasi Eksplorasi Korpus & Validasi Hukum Zipf dari Nol
# ==============================================================================
code_1_10 = r'''import numpy as np
import re
from collections import Counter

# Implementasi Eksplorasi Korpus dan Validasi Empiris Hukum Zipf dari Nol
# Memproses korpus teks multi-dokumen, menghitung frekuensi, dan memvalidasi log-log fit

corpus_raw = """
Kecerdasan buatan dan pemrosesan bahasa alami berkembang sangat pesat dalam dekade terakhir.
Bahasa alami manusia memiliki kompleksitas linguistik yang sangat kaya dan penuh dengan ambiguitas.
Pemrosesan bahasa alami memanfaatkan metode statistik dan pembelajaran mesin untuk memahami teks.
Kecerdasan buatan memerlukan representasi pengetahuan dan pemodelan probabilitas yang kokoh.
Bahasa adalah cermin pikiran manusia dan teknologi terus berupaya menirunya dengan cermat.
Setiap kata dalam korpus teks memiliki distribusi frekuensi yang unik dan bermakna.
"""

def analyze_corpus_zipf(text):
    # 1. Normalisasi dan Tokenisasi regex kata
    words = re.findall(r'\b[a-zA-Z\u00C0-\u00FF]+\b', text.lower())
    total_tokens = len(words)
    
    # 2. Hitung frekuensi kata
    counts = Counter(words)
    vocab_size = len(counts)
    
    # Urutkan berdasarkan frekuensi menurun (Ranking)
    sorted_counts = counts.most_common()
    
    ranks = np.arange(1, vocab_size + 1)
    frequencies = np.array([cnt for _, cnt in sorted_counts])
    
    # 3. Hitung produk konstan r * f(r)
    rf_products = ranks * frequencies
    mean_rf = np.mean(rf_products[:10]) # rata-rata 10 besar
    
    # 4. Regresi log-log: log(f) = a * log(r) + b
    log_r = np.log10(ranks)
    log_f = np.log10(frequencies)
    # Gunakan subset rank > 0 untuk fit linear
    slope, intercept = np.polyfit(log_r, log_f, 1)
    
    return words, sorted_counts, total_tokens, vocab_size, slope, mean_rf

tokens, top_words, N_tot, V_tot, slope_val, rf_const = analyze_corpus_zipf(corpus_raw)

print(f"Statistik Dasar Korpus Uji:")
print(f"- Total Token Kata (N)   : {N_tot}")
print(f"- Ukuran Kosakata Unik (V): {V_tot}")
print(f"- TTR (Type-Token Ratio) : {V_tot / N_tot:.4f}\n")

print("10 Kata Berfrekuensi Tertinggi dan Produk Rank * Frekuensi:")
print(f"{'Rank':<5} | {'Kata':<15} | {'Frekuensi':<10} | {'r * f(r)':<10}")
print("-" * 50)
for idx, (w, cnt) in enumerate(top_words[:10], start=1):
    print(f"{idx:<5} | {w:<15} | {cnt:<10} | {idx * cnt:<10}")

print(f"\nHasil Estimasi Kemiringan Log-Log (Slope): {slope_val:.4f}")
print("Analisis empiris mengonfirmasi pola penurunan frekuensi sublinear khas Hukum Zipf.")
'''

subchapters.append({
    "id": "nlp-1-10-corpus-exploration-zipf-numpy",
    "chapterId": "natural-language-processing-ch-1",
    "title": "Implementasi Eksplorasi Korpus dan Validasi Hukum Zipf dari Nol Berbasis Python/NumPy",
    "description": "Praktikum komputasi mandiri: ekstraksi frekuensi leksikal, kalkulasi rasio tipe-token (TTR), regresi linear pada domain log-log, dan visualisasi empiris distribusi bahasa.",
    "estimatedMinutes": 35,
    "order": 10,
    "content": {
        "theory": (
            "Praktikum penutup pada Bab 1 ini mengintegrasikan seluruh landasan konseptual linguistik komputasional ke dalam sebuah modul kode praktikum mandiri berbasis Python 3 dan pustaka ilmiah NumPy tanpa dependensi eksternal yang membebani.\n\n"
            "Tujuan praktikum ini berpusat pada tiga aspek operasional:\n"
            "1. **Kalkulasi Metrik Keragaman Leksikal (*Type-Token Ratio / TTR*)**: Rasio antara ukuran kosakata unik $V$ terhadap total jumlah kata $N$:\n"
            "$$\\text{TTR} = \\frac{|V|}{N}$$\n"
            "TTR memberikan gambaran cepat tentang densitas informasi leksikal suatu korpus. Pada korpus pendek, nilai TTR cenderung tinggi, namun seiring membesarnya korpus, nilai TTR akan menurun secara sublinear mengikuti Hukum Heaps.\n\n"
            "2. **Penyusunan Tabel Peringkat Frekuensi (*Rank-Frequency Table*)**: Mengurutkan pasangan kata $(w, f_w)$ sedemikian rupa sehingga $r_1$ memegang frekuensi terbesar $f_1 \\ge f_2 \\ge \\dots \\ge f_V$.\n\n"
            "3. **Validasi Empiris Hukum Zipf Melalui Regresi Log-Log**: Mentransformasikan data observasi diskrit ke ruang logaritmik $\\log_{10}(r)$ dan $\\log_{10}(f)$, kemudian melakukan pencocokan garis kuadrat terkecil (*least-squares polynomial fit*) derajat 1:\n"
            "$$\\log_{10}(f) = m \\cdot \\log_{10}(r) + c$$\n"
            "Kemiringan gradien $m$ mencerminkan eksponen negatif $-s$ dari Hukum Zipf. Pada korpus bahasa alami manusia yang otentik, nilai kemiringan $m$ secara konsisten berkisar antara $-0.8$ hingga $-1.2$.\n\n"
            "Modul ini dirancang mandiri menggunakan pustaka standar Python (`collections.Counter`, `re`) dan array multidimensi NumPy untuk menjamin eksekusi yang 100% konsisten, cepat, dan terverifikasi pada lingkungan headless server."
        ),
        "codeSnippet": code_1_10,
        "codeSnippetOutput": run_code_capture_output(code_1_10),
        "realWorldApplication": (
            "Diterapkan dalam tahap diagnostik awal audit dataset (Exploratory Data Analysis / EDA) sebelum melatih model bahasa skala besar untuk mendeteksi anomali korpus, distorsi sampling teks, atau keberadaan data sintetis yang tidak wajar."
        ),
        "commonPitfalls": [
            r"Menghitung logaritma dari frekuensi nol (log(0)), yang memicu kesalahan numerik MathDomainError atau -infinity (wajib memfilter kata dengan f > 0).",
            r"Tokenisasi naif dengan memecah string spasi mentah text.split() yang menyertakan tanda baca melekat pada kata (misal 'kata,' dan 'kata' dihitung sebagai dua tipe terpisah).",
            r"Mengukur TTR untuk membandingkan dua korpus yang memiliki total panjang token N yang berbeda jauh tanpa melakukan normalisasi panjang teks."
        ],
        "caseStudy": (
            "Sebuah lembaga sensus bahasa ingin membandingkan keragaman leksikal antara korpus artikel berita politik dan korpus percakapan media sosial Twitter/X berukuran sama (100.000 token). Rancang metodologi komparasi menggunakan analisis TTR terstandarisasi (Standardized TTR) dan bandingkan nilai slope kurva Hukum Zipf antara kedua domain tersebut."
        ),
        "academicReferences": [
            r"Baayen, R. H. (2002). Word frequency distributions. Springer Science & Business Media.",
            r"Manning, C. D., & Schütze, H. (1999). Foundations of statistical natural language processing. MIT press.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Stanford University."
        ]
    }
})

# Simpan ke JSON
output_path = os.path.join(os.path.dirname(__file__), "nlp_ch1_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 1 NLP -> {output_path}")
