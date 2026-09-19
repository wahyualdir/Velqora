# -*- coding: utf-8 -*-
"""
Generator untuk Bab 4: Ekstraksi Fitur Leksikal & Representasi Vektor Klasik (10 Subbab)
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
# Subbab 4.1: Representasi One-Hot Encoding
# ==============================================================================
code_4_1 = r'''import numpy as np

# Representasi Vektor One-Hot Encoding Teks
# Setiap kata dipetakan ke vektor biner berdimensi |V| dengan nilai 1 di indeks kata dan 0 di tempat lain

vocabulary = ["belajar", "data", "kecerdasan", "mesin", "nlp"]
word2idx = {w: i for i, w in enumerate(vocabulary)}
V = len(vocabulary)

def to_one_hot(word, word2idx, V):
    vec = np.zeros(V, dtype=int)
    if word in word2idx:
        vec[word2idx[word]] = 1
    return vec

# Bukti Ortogonalitas One-Hot Vectors: dot product antara kata berbeda selalu 0
w1 = "data"
w2 = "nlp"
v1 = to_one_hot(w1, word2idx, V)
v2 = to_one_hot(w2, word2idx, V)
dot_product = np.dot(v1, v2)
cosine_sim = dot_product / (np.linalg.norm(v1) * np.linalg.norm(v2))

print("Representasi Vektor One-Hot Encoding:")
print("-" * 65)
print(f"Kamus Kosakata |V| = {V}: {vocabulary}\n")
for w in vocabulary:
    print(f"Kata: {w:<12} -> One-Hot: {to_one_hot(w, word2idx, V)}")

print("-" * 65)
print(f"Dot Product '{w1}' vs '{w2}' : {dot_product}")
print(f"Cosine Similarity           : {cosine_sim:.4f}")
print("Semua vektor one-hot saling tegak lurus (orthogonal), tidak memiliki relasi semantik!")
'''

subchapters.append({
    "id": "nlp-4-1-one-hot-encoding-curse-dimensionality",
    "chapterId": "natural-language-processing-ch-4",
    "title": "Representasi One-Hot Encoding: Vektor Biner Indeks Kosakata dan Kutukan Dimensi",
    "description": "Representasi simbolik paling elementer: pemetaan kata ke vektor biner orthogonal berdimensi |V|, sifat sparsity ekstrem, dan ketidakmampuan menangkap kemiripan semantik.",
    "estimatedMinutes": 30,
    "order": 1,
    "content": {
        "theory": (
            "Komputer dan algoritma pembelajaran mesin tidak dapat memproses teks mentah berupa karakter atau string alfabet secara langsung. Untuk melakukan pemrosesan matematika, teks harus dikonversi menjadi representasi numerik. Pendekatan diskret paling awal dan paling elementer dalam sejarah pemrosesan teks adalah **One-Hot Encoding**.\n\n"
            "Dalam representasi one-hot encoding, kita pertama-tama membangun kamus kosakata $\\mathcal{V}$ yang berisi seluruh kata unik yang muncul dalam korpus dengan ukuran $|\\mathcal{V}|$. Setiap kata $w \\in \\mathcal{V}$ kemudian dipetakan ke dalam sebuah vektor biner berdimensi $|\\mathcal{V}|$, di mana tepat satu elemen bernilai $1$ pada indeks leksikal kata tersebut, dan seluruh elemen lainnya bernilai $0$:\n"
            "$$\\mathbf{v}_w = [0, 0, \\dots, 1, \\dots, 0]^T \\in \\{0, 1\\}^{|\\mathcal{V}|}$$\n\n"
            "**Karakteristik & Kelemahan Fatal One-Hot Encoding**:\n"
            "1. **Ortogonalitas Mutlak (*Orthogonality Problem*)**:\n"
            "   Karena setiap kata diwakili oleh basis vektor ortonormal standar, hasil kali titik (*dot product*) antara dua kata sembarang yang berbeda $w_i \\neq w_j$ selalu bernilai nol:\n"
            "   $$\\mathbf{v}_{w_i} \\cdot \\mathbf{v}_{w_j} = 0 \\implies \\cos(\\mathbf{v}_{w_i}, \\mathbf{v}_{w_j}) = 0$$\n"
            "   Hal ini berarti secara geometris, kata *\"anjing\"* memiliki jarak dan kesamaan yang persis sama jauhnya dengan *\"kucing\"* sebagaimana dengan kata *\"pesawat\"* atau *\"demokrasi\"*. Model tidak memiliki mekanisme inheren untuk menangkap sinonim atau kedekatan semantik.\n"
            "2. **Kutukan Dimensi (*Curse of Dimensionality*) & Sparsity Ekstrem**:\n"
            "   Pada korpus industri nyata, ukuran kosakata $|\\mathcal{V}|$ dapat mencapai $100.000$ hingga $1.000.000$ kata. Merepresentasikan sebuah kata atau kalimat dengan vektor sebesar satu juta dimensi di mana $99.9999\\%$ nilainya adalah angka nol memboroskan memori secara masif dan memperlambat komputasi aljabar linear secara eksponensial."
        ),
        "codeSnippet": code_4_1,
        "codeSnippetOutput": run_code_capture_output(code_4_1),
        "realWorldApplication": (
            "Input lapisan embedding lookup table pada arsitektur neural network (sebelum dikalikan matriks bobot W), dan representasi variabel kategori diskret pada model tabular."
        ),
        "commonPitfalls": [
            r"Menyimpan matriks one-hot berukuran besar sebagai dense array (np.zeros) yang menyebabkan Out-Of-Memory (OOM); wajib menggunakan representasi sparse matrix (scipy.sparse.csr_matrix).",
            r"Menghitung kemiripan dokumen menggunakan dot product one-hot tanpa normalisasi panjang dokumen.",
            r"Mengabaikan token di luar kamus (OOV) yang tidak memiliki indeks pemetaan pada kamus tetap."
        ],
        "caseStudy": (
            "Sebuah sistem rekomendasi artikel berita menggunakan representasi one-hot encoding atas kosakata 50.000 kata. Artikel A membahas 'dokter mengobati pasien di rumah sakit', sedangkan Artikel B membahas 'tenaga medis merawat penderita di klinik'. Jelaskan mengapa representasi one-hot menghasilkan cosine similarity 0.0 di antara kedua artikel yang bertopik identik tersebut."
        ),
        "academicReferences": [
            r"Harris, Z. S. (1954). Distributional structure. Word, 10(2-3), 146-162.",
            r"Salton, G., Wong, A., & Yang, C. S. (1975). A vector space model for automatic indexing. Communications of the ACM, 18(11), 613-620.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Chapter 6: Vector Semantics and Embeddings. Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 4.2: Bag-of-Words (BoW) & Count Vectorizer
# ==============================================================================
code_4_2 = r'''from collections import Counter
import numpy as np

# Bag-of-Words (BoW) / Count Vectorizer
# Merepresentasikan dokumen sebagai histogram frekuensi kemunculan kata tanpa mempedulikan urutan sintaksis

documents = [
    "kucing mengejar tikus kecil",
    "tikus kecil mengejar kucing",
    "anjing menggonggong di kebun"
]

# Bangun kosakata terurut
vocab = sorted(list(set(" ".join(documents).split())))
word2idx = {w: i for i, w in enumerate(vocab)}

def document_to_bow(doc, word2idx, vocab_size):
    vec = np.zeros(vocab_size, dtype=int)
    for word in doc.split():
        if word in word2idx:
            vec[word2idx[word]] += 1
    return vec

bow_matrix = np.array([document_to_bow(doc, word2idx, len(vocab)) for doc in documents])

print("Representasi Bag-of-Words (BoW):")
print("-" * 65)
print(f"Kosakata Unik ({len(vocab)} kata): {vocab}\n")
for i, doc in enumerate(documents):
    print(f"Dokumen {i+1}: '{doc}'")
    print(f"  Vektor BoW: {bow_matrix[i]}")

print("-" * 65)
print("Kehilangan Urutan Sintaksis (Loss of Word Order):")
diff = np.abs(bow_matrix[0] - bow_matrix[1]).sum()
print(f"Selisih absolut Vektor Dokumen 1 dan Dokumen 2: {diff}")
print("Meskipun makna Dokumen 1 ('kucing mengejar tikus') dan Dokumen 2 ('tikus mengejar kucing')")
print("bertolak belakang secara semantik peran tematik, vektor BoW-nya 100% IDENTIK!")
'''

subchapters.append({
    "id": "nlp-4-2-bag-of-words-count-vectorizer",
    "chapterId": "natural-language-processing-ch-4",
    "title": "Bag-of-Words (BoW) & Count Vectorizer: Pemetaan Dokumen ke Histogram Frekuensi",
    "description": "Model ruang vektor dokumen klasik: agregasi multiset frekuensi kemunculan kata, konstruksi Term-Document Matrix, dan kehilangan informasi urutan sintaksis.",
    "estimatedMinutes": 35,
    "order": 2,
    "content": {
        "theory": (
            "Konsep **Bag-of-Words (BoW)** atau **Count Vectorizer** memperluas representasi kata ke tingkat dokumen utuh. Dalam model BoW, sebuah teks diperlakukan layaknya sebuah 'kantong' (*bag*) atau himpunan ganda (*multiset*) yang menampung kata-kata tanpa mempedulikan struktur gramatikal, urutan kata (*word order*), atau relasi sintaksis antarkata.\n\n"
            "Sebuah dokumen $d$ direpresentasikan sebagai vektor frekuensi berdimensi $|\\mathcal{V}|$:\n"
            "$$\\mathbf{x}_d = [c(w_1, d), c(w_2, d), \\dots, c(w_{|\\mathcal{V}|}, d)]^T$$\n"
            "di mana $c(w_j, d)$ merepresentasikan jumlah kemunculan (*term count*) kata $w_j$ di dalam dokumen $d$.\n\n"
            "Kumpulan dari $M$ dokumen dalam korpus dengan kosakata $|\\mathcal{V}|$ membentuk matriks dua dimensi yang disebut **Matriks Term-Dokumen (*Term-Document Matrix*)** $\\mathbf{X} \\in \\mathbb{R}^{M \\times |\\mathcal{V}|}$.\n\n"
            "**Kelebihan dan Keterbatasan Fundamental BoW**:\n"
            "- **Kelebihan**: Sangat sederhana, cepat dihitung, dan secara mengejutkan sangat efektif untuk klasifikasi teks topik umum (misal membedakan artikel 'Olahraga' vs 'Politik' di mana keberadaan kata seperti *\"bola\"*, *\"wasit\"*, *\"gol\"* sudah cukup menjadi sinyal diskriminatif kuat).\n"
            "- **Kelemahan 1: Kehilangan Urutan Kata (*Loss of Word Order*)**: Dokumen *\"anjing menggigit orang\"* dan *\"orang menggigit anjing\"* menghasilkan representasi vektor BoW yang identik secara persis, meskipun peran semantik subjek-objeknya bertolak belakang.\n"
            "- **Kelemahan 2: Dominasi Kata Frekuensi Tinggi**: Kata-kata fungsional umum (seperti *\"dan\"*, *\"yang\"*, *\"di\"*) mendominasi nilai absolut vektor BoW hanya karena frekuensi alamiahnya tinggi, menenggelamkan kata-kata kunci informatif yang sebenarnya mencirikan topik spesifik dokumen."
        ),
        "codeSnippet": code_4_2,
        "codeSnippetOutput": run_code_capture_output(code_4_2),
        "realWorldApplication": (
            "Fitur input dasar untuk algoritma klasifikasi Naive Bayes, Logistic Regression, dan SVM pada analisis sentimen biner dan penyaringan email spam."
        ),
        "commonPitfalls": [
            r"Menggunakan BoW murni untuk tugas yang sangat bergantung pada struktur sintaksis urutan kata, seperti parsing tata bahasa atau translasi mesin.",
            r"Tidak melakukan pra-pembersihan tanda baca atau case folding sehingga kata yang sama dihitung sebagai fitur terpisah yang berbeda.",
            r"Mengabaikan normalisasi panjang dokumen sehingga dokumen panjang secara artifisial memiliki nilai magnitudo vektor yang jauh lebih besar daripada dokumen pendek."
        ],
        "caseStudy": (
            "Sebuah ulasan produk berbunyi: 'Produk ini tidak jelek, malahan sangat bagus' vs 'Produk ini tidak bagus, malahan sangat jelek'. Jelaskan bagaimana representasi Bag-of-Words unigram menangkap kedua ulasan tersebut dan mengapa klasifikasi sentimen linear dapat mengalami kegagalan deteksi polaritas."
        ),
        "academicReferences": [
            r"Harris, Z. S. (1954). Distributional structure. Word, 10(2-3), 146-162.",
            r"Salton, G. (1989). Automatic Text Processing: The Transformation, Analysis, and Retrieval of Information by Computer. Addison-Wesley.",
            r"Manning, C. D., Raghavan, P., & Schütze, H. (2008). Introduction to Information Retrieval. Chapter 6: Scoring, term weighting and the vector space model. Cambridge University Press."
        ]
    }
})

# ==============================================================================
# Subbab 4.3: Skema Pembobotan TF-IDF (Spot-Check 4)
# ==============================================================================
code_4_3 = r'''import numpy as np

# Skema Pembobotan TF-IDF (Term Frequency - Inverse Document Frequency)
# Formulasi Klasik Karen Spärck Jones (1972):
# TF(t, d) = frekuensi kemunculan term t dalam dokumen d
# IDF(t, D) = \log( N / DF(t) )
# TF-IDF(t, d) = TF(t, d) * IDF(t, D)

corpus = [
    "kecerdasan buatan dan pemrosesan bahasa alami",
    "pemrosesan bahasa alami sangat penting untuk nlp",
    "aplikasi kecerdasan buatan di bidang kesehatan modern",
    "sistem kesehatan dan kedokteran modern"
]

N = len(corpus)
tokenized_docs = [doc.split() for doc in corpus]
vocab = sorted(list(set(sum(tokenized_docs, []))))

# Hitung Document Frequency (DF): jumlah dokumen yang memuat term t
df = {t: 0 for t in vocab}
for doc in tokenized_docs:
    unique_terms = set(doc)
    for t in unique_terms:
        df[t] += 1

# Hitung Spärck Jones (1972) Classical IDF: log(N / DF)
# Menggunakan logaritma natural (atau log basis e/2/10)
idf_sparck_jones = {t: np.log(N / df[t]) for t in vocab}

print("Analisis Spesifisitas Statistik Karen Spärck Jones (1972):")
print("-" * 75)
print(f"Total Dokumen N = {N}\n")
print(f"{'Term (Kata)':<15} | {'Doc Freq (DF)':<15} | {'Rasio N/DF':<12} | {'IDF Spärck Jones':<18}")
print("-" * 75)

sample_terms = ["dan", "kecerdasan", "pemrosesan", "alami", "kedokteran", "sistem"]
for t in sample_terms:
    ratio = N / df[t]
    idf_val = idf_sparck_jones[t]
    print(f"{t:<15} | {df[t]:<15} | {ratio:<12.2f} | {idf_val:.4f}")

print("-" * 75)
print("Prinsip Spärck Jones: Kata yang muncul di semua dokumen (seperti 'dan')")
print("memiliki DF tinggi -> N/DF mendekati 1 -> IDF mendekati 0 (tidak diskriminatif).")
print("Kata yang hanya muncul di 1 dokumen ('kedokteran') memiliki DF rendah -> IDF tinggi (sangat spesifik).")
'''

subchapters.append({
    "id": "nlp-4-3-tfidf-formulation-sparck-jones",
    "chapterId": "natural-language-processing-ch-4",
    "title": "Skema Pembobotan TF-IDF: Formulasi Klasik Karen Spärck Jones (1972) dan Penskalaan Logaritmik",
    "description": "Fondasi Information Retrieval modern: derivasi Term Frequency, spesifisitas statistik istilah Spärck Jones (1972), formulasi Inverse Document Frequency (IDF) (Spot-Check Literatur Primer).",
    "estimatedMinutes": 40,
    "order": 3,
    "content": {
        "theory": (
            "Meskipun Bag-of-Words mampu merekam frekuensi kemunculan kata, BoW menderita kelemahan fatal: kata-kata umum yang sering muncul di hampir semua dokumen (seperti kata penghubung dan kata depan) akan mendominasi nilai vektor, meskipun tidak membawa informasi pembeda mengenai topik dokumen.\n\n"
            "Untuk memecahkan paradoks ini, ilmuwan komputer Inggris **Karen Spärck Jones** (1972) mempublikasikan makalah seminal berjudul *'A Statistical Interpretation of Term Specificity and Its Application in Retrieval'*. Spärck Jones mengajukan prinsip bahwa nilai diskriminatif sebuah kata dalam sistem penelusuran informasi berbanding terbalik dengan frekuensi kemunculannya di seluruh koleksi dokumen:\n"
            "> *\"The specificity of a term can be quantified as an inverse function of its frequency of occurrence in the collection... The term specificity weight is thus defined as an inverse function of document frequency.\"* (Spärck Jones, 1972, p. 11).\n\n"
            "Formulasi matematis **TF-IDF (*Term Frequency - Inverse Document Frequency*)** menggabungkan dua komponen ortogonal:\n"
            "1. **Term Frequency (TF)**: Seberapa penting kata $t$ di dalam dokumen lokal tertentu $d$. Semakin sering kata $t$ muncul dalam dokumen $d$, semakin relevan kata tersebut terhadap konten dokumen:\n"
            "   $$\\text{TF}(t, d) = C(t, d)$$\n\n"
            "2. **Inverse Document Frequency (IDF)**: Seberapa informatif atau langka kata $t$ di seluruh korpus dokumen global $D$. Jika sebuah kata muncul di hampir setiap dokumen, kata tersebut kehilangan kekuatan diskriminatifnya:\n"
            "   $$\\text{IDF}(t, D) = \\log\\left( \\frac{N}{\\text{DF}(t)} \\right)$$\n"
            "   di mana $N = |D|$ adalah total jumlah seluruh dokumen dalam korpus, dan $\\text{DF}(t)$ (*Document Frequency*) adalah jumlah dokumen yang memuat sekurang-kurangnya satu kemunculan kata $t$.\n\n"
            "3. **Bobot Komposit TF-IDF**:\n"
            "   $$\\text{TF-IDF}(t, d, D) = \\text{TF}(t, d) \\times \\text{IDF}(t, D) = C(t, d) \\cdot \\log\\left( \\frac{N}{\\text{DF}(t)} \\right)$$\n\n"
            "Mengapa transformasi logaritmik digunakan pada IDF? Spärck Jones menjelaskan bahwa sensitivitas perbedaan frekuensi dokumen tidak bersifat linear; perbedaan antara kata yang muncul di 1 dokumen vs 10 dokumen jauh lebih signifikan dalam hal spesifisitas daripada perbedaan antara kata yang muncul di 1.000 dokumen vs 1.010 dokumen. Transformasi logaritmik meredam penskalaan linear ini secara optimal."
        ),
        "codeSnippet": code_4_3,
        "codeSnippetOutput": run_code_capture_output(code_4_3),
        "realWorldApplication": (
            "Komponen inti mesin pencari Apache Lucene, Elasticsearch, algoritma perankingan BM25, ekstraksi kata kunci dokumen otomatis, dan sistem penelusuran dokumen legal/paten."
        ),
        "commonPitfalls": [
            r"Membagi dengan nol ketika sebuah term uji tidak pernah muncul dalam korpus pelatihan (DF = 0); memerlukan smoothing IDF seperti log(N / (1 + DF)) atau log(1 + N/DF).",
            r"Mengalikan IDF dengan panjang korpus total alih-alih menghitungnya secara independen per-fitur kata.",
            r"Menggunakan log basis 10 tanpa konsistensi dengan basis logaritma natural (ln) yang dipakai pustaka machine learning standar (scikit-learn menggunakan log natural dengan parameter smooth_idf)."
        ],
        "caseStudy": (
            "Diberikan korpus mesin pencari hukum dengan 10.000 dokumen putusan pengadilan. Kata 'terdakwa' muncul dalam 9.900 dokumen, sementara istilah medis 'keracunan arsenik' hanya muncul dalam 5 dokumen. Hitung bobot IDF kedua istilah tersebut dan jelaskan bagaimana TF-IDF mengarahkan sistem penelusuran untuk menemukan perkara kasus pembunuhan beracun secara akurat."
        ),
        "academicReferences": [
            r"Spärck Jones, K. (1972). A statistical interpretation of term specificity and its application in retrieval. Journal of Documentation, 28(1), 11-21.",
            r"Salton, G., & Buckley, C. (1988). Term-weighting approaches in automatic text retrieval. Information Processing & Management, 24(5), 513-523.",
            r"Robertson, S. (2004). Understanding inverse document frequency: On theoretical arguments for IDF. Journal of Documentation, 60(5), 503-520."
        ]
    }
})

# ==============================================================================
# Subbab 4.4: Varian Formulasi TF-IDF
# ==============================================================================
code_4_4 = r'''import numpy as np

# Komparasi Berbagai Varian Formulasi TF dan IDF
# TF: Raw, Sublinear Log-scaled, Double Normalization K
# IDF: Standard Spärck Jones, Smooth IDF (scikit-learn style), Probabilistic IDF

N = 1000      # Total 1000 dokumen
df_common = 800  # Kata umum
df_rare = 5     # Kata langka

c_tf = 15     # Muncul 15 kali dalam dokumen
max_tf = 20   # Kata paling sering dalam dokumen muncul 20 kali

# Varian Term Frequency (TF)
tf_raw = c_tf
tf_sublinear = 1 + np.log(c_tf) if c_tf > 0 else 0
tf_double_norm = 0.5 + 0.5 * (c_tf / max_tf)

# Varian Inverse Document Frequency (IDF)
idf_standard = np.log(N / df_rare)
idf_smooth = np.log((1 + N) / (1 + df_rare)) + 1  # Scikit-learn default
idf_probabilistic = np.log((N - df_rare) / df_rare)

print("Varian Formulasi Matematis TF-IDF:")
print("-" * 70)
print("1. Varian Term Frequency (TF) untuk count = 15:")
print(f"   - Raw Count TF           = {tf_raw:.4f}")
print(f"   - Sublinear Log TF (1+ln)= {tf_sublinear:.4f}  (Meredam dampak repetisi)")
print(f"   - Double Norm K (K=0.5)  = {tf_double_norm:.4f}  (Normalisasi panjang)")

print("\n2. Varian IDF untuk Term Langka (DF = 5 dari 1000 dokumen):")
print(f"   - Standard Spärck Jones  = {idf_standard:.4f}")
print(f"   - Smooth IDF (sklearn)   = {idf_smooth:.4f}")
print(f"   - Probabilistic IDF      = {idf_probabilistic:.4f}")
print("-" * 70)
print("Varian sublinear mencegah kata yang diulang 100 kali mendominasi secara 100x lipat.")
'''

subchapters.append({
    "id": "nlp-4-4-tfidf-variants-normalization",
    "chapterId": "natural-language-processing-ch-4",
    "title": "Varian Formulasi TF-IDF: Sublinear TF Scaling, Smooth IDF, dan Normalisasi L2",
    "description": "Evolusi varian praktis pembobotan ruang vektor: kompresi logaritmik frekuensi kemunculan sublinear TF, smooth IDF pencegah division by zero, dan normalisasi panjang dokumen kosinus.",
    "estimatedMinutes": 35,
    "order": 4,
    "content": {
        "theory": (
            "Dalam implementasi penelusuran informasi dan pembelajaran mesin skala industri, formulasi dasar TF-IDF dari Spärck Jones sering dimodifikasi untuk mengatasi anomali distribusi teks nyata, seperti dokumen yang sangat panjang dan manipulasi repetisi kata (*keyword stuffing*).\n\n"
            "**1. Varian Penskalaan Term Frequency (TF)**:\n"
            "- **Raw Frequency**: $\\text{TF}(t, d) = f_{t,d}$.\n"
            "- **Sublinear TF Scaling (Logarithmic TF)**: Apakah sebuah dokumen yang memuat kata *\"ekonomi\"* sebanyak 20 kali relevansinya tepat 20 kali lipat dibanding dokumen yang memuatnya 1 kali? Jelas tidak. Kenaikan frekuensi memiliki utilitas marjinal yang menurun (*diminishing returns*). Oleh karena itu, sublinear TF meredam pertumbuhannya secara logaritmik:\n"
            "  $$\\text{TF}_{\\text{sublinear}}(t, d) = \\begin{cases} 1 + \\ln(f_{t,d}) & \\text{jika } f_{t,d} > 0 \\\\ 0 & \\text{lainnya} \\end{cases}$$\n"
            "- **Double Normalization $K$**: Menormalkan frekuensi kata terhadap frekuensi maksimum dari kata terpopuler dalam dokumen tersebut untuk mencegah bias dokumen panjang:\n"
            "  $$\\text{TF}_{\\text{norm}}(t, d) = K + (1 - K) \\frac{f_{t,d}}{\\max_{t' \\in d} f_{t', d}} \\quad (\\text{umumnya } K = 0.5)$$\n\n"
            "**2. Varian Inverse Document Frequency (IDF)**:\n"
            "- **Standard IDF**: $\\text{IDF}(t) = \\ln\\left(\\frac{N}{\\text{DF}(t)}\\right)$. Jika $\\text{DF}(t) = N$, maka $\\text{IDF} = \\ln(1) = 0$.\n"
            "- **Smooth IDF (Standar Scikit-Learn)**: Menambahkan konstanta $1$ pada pembilang dan penyebut untuk mencegah pembagian dengan nol dan menjamin tidak ada term yang bernilai nol mutlak:\n"
            "  $$\\text{IDF}_{\\text{smooth}}(t) = \\ln\\left( \\frac{1 + N}{1 + \\text{DF}(t)} \\right) + 1$$\n\n"
            "**3. Normalisasi Vektor Euclidean ($L_2$-Norm)**:\n"
            "Setelah seluruh elemen $\\mathbf{v}_d$ dihitung, vektor dokumen dinormalisasi ke panjang satuan unit: $\\mathbf{v}_d' = \\frac{\\mathbf{v}_d}{\\|\\mathbf{v}_d\\|_2}$. Normalisasi ini memastikan bahwa dokumen pendek dan dokumen panjang yang membahas materi serupa dapat dibandingkan secara adil tanpa distorsi panjang teks."
        ),
        "codeSnippet": code_4_4,
        "codeSnippetOutput": run_code_capture_output(code_4_4),
        "realWorldApplication": (
            "Standar implementasi `TfidfVectorizer` pada pustaka Python Scikit-Learn, modul scoring term Okapi BM25 pada Lucene, dan representasi teks pada pipeline klasifikasi SGD."
        ),
        "commonPitfalls": [
            r"Tidak menyadari perbedaan formula IDF antara implementasi buku teks murni vs pustaka scikit-learn (scikit-learn menambahkan +1 di dalam dan di luar log).",
            r"Lupa menonaktifkan sublinear_tf=False ketika bekerja dengan teks sangat pendek seperti tweet atau judul berita di mana frekuensi kata jarang melebihi 1.",
            r"Menerapkan normalisasi L2 pada matriks mentah sebelum pembobotan IDF diterapkan."
        ],
        "caseStudy": (
            "Dua artikel olahraga memuat kata 'gol'. Artikel A berukuran 100 kata dan menyebut 'gol' 5 kali. Artikel B berukuran 5.000 kata dan menyebut 'gol' 20 kali. Hitung rasio TF raw versus rasio sublinear TF ternormalisasi L2, dan evaluasi artikel mana yang lebih padat pembahasannya mengenai pencetakan gol."
        ),
        "academicReferences": [
            r"Salton, G., & Buckley, C. (1988). Term-weighting approaches in automatic text retrieval. Information Processing & Management, 24(5), 513-523.",
            r"Pedregosa, F., et al. (2011). Scikit-learn: Machine learning in Python. Journal of Machine Learning Research, 12, 2825-2830.",
            r"Manning, C. D., Raghavan, P., & Schütze, H. (2008). Introduction to Information Retrieval. Cambridge University Press."
        ]
    }
})

# ==============================================================================
# Subbab 4.5: Pengukuran Kesamaan Vektor Teks
# ==============================================================================
code_4_5 = r'''import numpy as np

# Pengukuran Kesamaan Vektor Teks: Euclidean Distance vs Cosine Similarity vs Jaccard Similarity
# Dokumen 1: "kecerdasan buatan" (pendek)
# Dokumen 2: "kecerdasan buatan kecerdasan buatan kecerdasan buatan" (panjang, isi sama berulang 3x)
# Dokumen 3: "rekayasa perangkat lunak" (topik berbeda)

# Fitur: [buatan, kecerdasan, lunak, perangkat, rekayasa]
v1 = np.array([1, 1, 0, 0, 0])
v2 = np.array([3, 3, 0, 0, 0])
v3 = np.array([0, 0, 1, 1, 1])

def euclidean_distance(a, b):
    return np.linalg.norm(a - b)

def cosine_similarity(a, b):
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return np.dot(a, b) / (norm_a * norm_b)

def jaccard_similarity(a, b):
    # Untuk vektor biner/multiset
    intersection = np.minimum(a, b).sum()
    union = np.maximum(a, b).sum()
    return intersection / union if union > 0 else 0.0

print("Analisis Metrik Kesamaan Ruang Vektor:")
print("-" * 75)
print(f"Pasangan Dokumen 1 vs Dokumen 2 (Konten Sama, Beda Panjang 3x):")
print(f"  - Euclidean Distance : {euclidean_distance(v1, v2):.4f} (Jarak besar karena magnitudo berbeda)")
print(f"  - Cosine Similarity  : {cosine_similarity(v1, v2):.4f} (Kecocokan SEMPURNA 1.0, invarian panjang!)")
print(f"  - Jaccard Similarity : {jaccard_similarity(v1, v2):.4f}")

print(f"\nPasangan Dokumen 1 vs Dokumen 3 (Topik Sepenuhnya Berbeda):")
print(f"  - Euclidean Distance : {euclidean_distance(v1, v3):.4f}")
print(f"  - Cosine Similarity  : {cosine_similarity(v1, v3):.4f} (Tegak lurus orthogonal 0.0)")
print("-" * 75)
print("Cosine similarity adalah standar emas NLP karena mengukur sudut arah, bukan magnitudo.")
'''

subchapters.append({
    "id": "nlp-4-5-vector-similarity-metrics",
    "chapterId": "natural-language-processing-ch-4",
    "title": "Pengukuran Kesamaan Vektor Teks: Jarak Euclidean, Cosine Similarity, dan Jaccard Similarity",
    "description": "Geometri komparasi dokumen: kelemahan jarak Euclidean terhadap variasi panjang teks, keunggulan invarian skala Cosine Similarity sudut arah, dan formulasi Jaccard.",
    "estimatedMinutes": 35,
    "order": 5,
    "content": {
        "theory": (
            "Setelah teks ditransformasikan menjadi representasi vektor numerik dalam ruang berdimensi tinggi $\\mathbb{R}^{|\\mathcal{V}|}$, kita memerlukan ukuran matematis untuk mengukur seberapa dekat atau serupa dua dokumen atau dua kata.\n\n"
            "Tiga metrik utama dalam analisis ruang vektor teks:\n"
            "1. **Jarak Euclidean ($L_2$-Distance)**:\n"
            "   $$d_E(\\mathbf{u}, \\mathbf{v}) = \\|\\mathbf{u} - \\mathbf{v}\\|_2 = \\sqrt{\\sum_{i=1}^{|\\mathcal{V}|} (u_i - v_i)^2}$$\n"
            "   Kelemahan kritis jarak Euclidean dalam pemrosesan teks adalah sensitivitasnya yang ekstrem terhadap **panjang dokumen**. Jika dokumen $B$ adalah duplikat persis dari dokumen $A$ yang diulang 5 kali, kedua dokumen tersebut membahas topik yang $100\\%$ identik. Namun, jarak Euclidean antara vektor $\\mathbf{u}_A$ dan $\\mathbf{u}_B$ akan sangat besar karena vektor $\\mathbf{u}_B$ memiliki magnitudo yang jauh lebih panjang.\n\n"
            "2. **Kesamaan Kosinus (*Cosine Similarity*)**:\n"
            "   Standar emas dalam pemrosesan bahasa alami dan penelusuran informasi adalah kesamaan kosinus. Cosine similarity mengabaikan panjang vektor (magnitudo) dan murni mengukur **sudut deviasi arah ($\\theta$)** antara kedua vektor dalam ruang multidimensi:\n"
            "   $$\\text{Sim}_{\\cos}(\\mathbf{u}, \\mathbf{v}) = \\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|_2 \\|\\mathbf{v}\\|_2} = \\frac{\\sum_{i=1}^{|\\mathcal{V}|} u_i v_i}{\\sqrt{\\sum_{i=1}^{|\\mathcal{V}|} u_i^2} \\sqrt{\\sum_{i=1}^{|\\mathcal{V}|} v_i^2}}$$\n"
            "   - Bernilai $1.0$ jika kedua vektor mengarah ke orientasi yang persis sama (proporsi topik identik terlepas dari panjang teks).\n"
            "   - Bernilai $0.0$ jika kedua vektor ortogonal (tidak memiliki satu pun kata persekutuan yang sama).\n\n"
            "3. **Koefisien Kesamaan Jaccard (*Jaccard Similarity*)**:\n"
            "   Mengukur rasio irisan terhadap gabungan himpunan kata biner:\n"
            "   $$J(A, B) = \\frac{|A \\cap B|}{|A \\cup B|}$$\n"
            "   Sangat efisien untuk komparasi leksikal cepat pada deteksi plagiarisme dan deduplikasi teks skala besar menggunakan MinHash."
        ),
        "codeSnippet": code_4_5,
        "codeSnippetOutput": run_code_capture_output(code_4_5),
        "realWorldApplication": (
            "Pencarian dokumen semirip mungkin (*k-nearest neighbors document retrieval*), deduplikasi artikel berita duplikat, dan pencocokan resume kandidat pelamar kerja terhadap deskripsi pekerjaan."
        ),
        "commonPitfalls": [
            r"Menggunakan Euclidean distance mentah tanpa normalisasi panjang dokumen sehingga dokumen pendek selalu dianggap tidak mirip dengan dokumen panjang.",
            r"Membagi dengan nol pada cosine similarity ketika salah satu vektor adalah vektor kosong (semua elemen 0).",
            r"Mengasumsikan cosine similarity bernilai negatif pada TF-IDF standar (karena frekuensi dan bobot TF-IDF selalu >= 0, nilai kosinus selalu berada pada rentang [0, 1])."
        ],
        "caseStudy": (
            "Diberikan dua dokumen hukum: Dokumen X adalah ringkasan perkara 1 halaman, dan Dokumen Y adalah berkas transkrip lengkap 50 halaman dari perkara yang sama. Buktikan secara matematis bahwa vektor TF-IDF kedua dokumen menghasilkan jarak Euclidean yang besar tetapi Cosine Similarity yang sangat mendekati 1.0."
        ),
        "academicReferences": [
            r"Salton, G., Wong, A., & Yang, C. S. (1975). A vector space model for automatic indexing. Communications of the ACM, 18(11), 613-620.",
            r"Singhal, A. (2001). Modern information retrieval: A brief overview. IEEE Data Engineering Bulletin, 24(4), 35-43.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 4.6: Matriks Ko-okurensi Kata
# ==============================================================================
code_4_6 = r'''import numpy as np

# Konstruksi Matriks Ko-okurensi Kata (Word-Word Co-occurrence Matrix)
# Menghitung seberapa sering dua kata muncul bersama dalam jendela konteks simetris w = 1

sentences = [
    "kucing suka minum susu",
    "anak kucing suka minum susu segar",
    "kucing suka makan ikan segar"
]

corpus_tokens = [s.split() for s in sentences]
vocab = sorted(list(set(sum(corpus_tokens, []))))
word2idx = {w: i for i, w in enumerate(vocab)}
V = len(vocab)

cooc_matrix = np.zeros((V, V), dtype=int)
window_size = 1  # Konteks 1 kata ke kiri dan 1 kata ke kanan

for tokens in corpus_tokens:
    n = len(tokens)
    for i, target_word in enumerate(tokens):
        target_idx = word2idx[target_word]
        # Jendela konteks simetris
        start = max(0, i - window_size)
        end = min(n, i + window_size + 1)
        for j in range(start, end):
            if i != j:
                context_word = tokens[j]
                context_idx = word2idx[context_word]
                cooc_matrix[target_idx, context_idx] += 1

print("Matriks Ko-okurensi Kata-ke-Kata (Window Size = 1):")
print("-" * 75)
header = f"{'Term':<10} | " + " | ".join([f"{w[:6]:>6}" for w in vocab])
print(header)
print("-" * 75)
for i, w in enumerate(vocab):
    row_str = " | ".join([f"{cooc_matrix[i, j]:>6}" for j in range(V)])
    print(f"{w:<10} | {row_str}")

print("-" * 75)
print("Matriks ko-okurensi bersifat simetris: Cooc(A, B) = Cooc(B, A).")
print("Setiap baris kini menjadi vektor representasi semantik awal untuk kata tersebut.")
'''

subchapters.append({
    "id": "nlp-4-6-word-cooccurrence-matrix",
    "chapterId": "natural-language-processing-ch-4",
    "title": "Matriks Ko-okurensi Kata (Word Co-occurrence Matrix): Jendela Konteks dan Vektor Term-Term",
    "description": "Realisasi komputasional hipotesis distribusional: konstruksi matriks kata-ke-kata (Term-Term Matrix), penentuan parameter context window simetris, dan sifat simetri matriks.",
    "estimatedMinutes": 35,
    "order": 6,
    "content": {
        "theory": (
            "Jika model Term-Dokumen memetakan kata terhadap dokumen di mana kata tersebut muncul, bagaimana cara kita memodelkan semantik intrinsik sebuah kata secara langsung? Jawaban komputasional paling elegan atas Hipotesis Distribusional Firth (1957) adalah **Matriks Ko-okurensi Kata (*Word-Word Co-occurrence Matrix*)**.\n\n"
            "Alih-alih mengukur relasi dokumen, kita mengukur seberapa sering kata target $w_i$ muncul berdekatan dengan kata konteks $w_j$ dalam suatu rentang jarak lokal yang disebut **Jendela Konteks (*Context Window*)** sebesar $k$ kata ke kiri dan ke kanan ($[-k, +k]$).\n\n"
            "Matriks ko-okurensi $\\mathbf{C} \\in \\mathbb{R}^{|\\mathcal{V}| \\times |\\mathcal{V}|}$ dibentuk dengan aturan:\n"
            "$$C_{i, j} = \\sum_{s \\in \\mathcal{D}} \\sum_{t} \\mathbb{I}(w_t = w_i) \\sum_{1 \\le |m| \\le k} \\mathbb{I}(w_{t+m} = w_j)$$\n"
            "di mana nilai $C_{i, j}$ merepresentasikan berapa kali kata $w_i$ dan kata $w_j$ muncul berdampingan dalam radius $k$ kata.\n\n"
            "**Karakteristik Matematis Matriks Ko-okurensi**:\n"
            "1. **Simetri**: Jika jendela konteks dibuat simetris (kiri dan kanan), maka matriks $\\mathbf{C}$ adalah matriks simetris di mana $C_{i, j} = C_{j, i}$ dan $\\mathbf{C} = \\mathbf{C}^T$.\n"
            "2. **Pilihan Ukuran Jendela ($k$)**:\n"
            "   - **Jendela Kecil ($k = 1$ hingga $k = 2$)**: Menangkap informasi sintaktis, fungsi gramatikal, dan kolokasi langsung (misal kata sifat yang memodifikasi kata benda di sebelahnya).\n"
            "   - **Jendela Besar ($k = 5$ hingga $k = 10$)**: Menangkap informasi semantik topikal umum (misal kata-kata yang berada dalam domain bidang yang sama seperti kedokteran atau olahraga).\n\n"
            "Setiap baris $\\mathbf{C}_{i, :}$ kini menjadi representasi vektor distribusional dari kata $w_i$. Kata-kata dengan makna serupa (seperti *\"kucing\"* dan *\"anjing\"*) akan memiliki vektor baris ko-okurensi yang mirip karena keduanya sering berko-okurensi dengan kata konteks yang sama (seperti *\"makan\"*, *\"minum\"*, *\"berlari\"*, *\"tidur\"*)."
        ),
        "codeSnippet": code_4_6,
        "codeSnippetOutput": run_code_capture_output(code_4_6),
        "realWorldApplication": (
            "Tahap fondasi pembangunan model GloVe (Global Vectors), ekstraksi kolokasi istilah bahasa, dan analisis relasi semantik asosiatif psikolinguistik."
        ),
        "commonPitfalls": [
            r"Menyertakan kata target itu sendiri sebagai konteks pada posisi tengah (i == j) tanpa bobot khusus yang mendistorsi diagonal utama matriks.",
            r"Menggunakan ukuran jendela terlalu besar pada korpus pendek sehingga seluruh kata berko-okurensi satu sama lain dan kehilangan spesifisitas semantik.",
            r"Menyimpan matriks ko-okurensi berukuran |V| x |V| sebagai array memori kontinu tanpa sparse matrix ketika kosakata melebihi 50.000 entri."
        ],
        "caseStudy": (
            "Bandingkan keluaran vektor ko-okurensi kata 'dokter' dan 'perawat' jika jendela konteks disetel k = 1 versus k = 10. Jelaskan mengapa jendela k = 1 lebih mencerminkan relasi sintaktis (subjek predikat), sedangkan k = 10 mencerminkan relasi topikal rumah sakit."
        ),
        "academicReferences": [
            r"Firth, J. R. (1957). A synopsis of linguistic theory, 1930-1955. Studies in linguistic analysis, 1-32.",
            r"Lund, K., & Burgess, C. (1996). Producing high-dimensional semantic spaces from lexical co-occurrence. Behavior Research Methods, Instruments, & Computers, 28(2), 203-208.",
            r"Pennington, J., Socher, R., & Manning, C. D. (2014). GloVe: Global vectors for word representation. In EMNLP (pp. 1532-1543)."
        ]
    }
})

# ==============================================================================
# Subbab 4.7: Pointwise Mutual Information (PMI) & PPMI
# ==============================================================================
code_4_7 = r'''import numpy as np

# Perhitungan Pointwise Mutual Information (PMI) dan Positive PMI (PPMI)
# PMI(w, c) = \log_2 \frac{P(w, c)}{P(w) P(c)} = \log_2 \frac{C(w, c) * N}{C(w) * C(c)}
# PPMI(w, c) = \max(PMI(w, c), 0)

# Matriks ko-okurensi mainan antara 3 kata target dan 3 kata konteks
# Target: ["dokter", "pisang", "mobil"]
# Konteks: ["rumah_sakit", "makan", "jalan"]

cooc = np.array([
    [40,  2,  5],   # dokter: sering dengan rumah_sakit
    [ 0, 50,  1],   # pisang: sering dengan makan
    [ 1,  0, 60]    # mobil : sering dengan jalan
], dtype=float)

N = cooc.sum() # Total seluruh ko-okurensi

# Marginal probabilities
p_wc = cooc / N
p_w = p_wc.sum(axis=1, keepdims=True)
p_c = p_wc.sum(axis=0, keepdims=True)

# Expected probability under independence
p_expected = np.dot(p_w, p_c)

# Hitung PMI dengan safety epsilon untuk menghindari log(0)
epsilon = 1e-12
ratio = np.where(p_wc > 0, p_wc / (p_expected + epsilon), epsilon)
pmi_matrix = np.where(p_wc > 0, np.log2(ratio), 0.0)

# Positive PMI: potong nilai negatif menjadi 0
ppmi_matrix = np.maximum(pmi_matrix, 0.0)

targets = ["dokter", "pisang", "mobil"]
contexts = ["rumah_sakit", "makan", "jalan"]

print("Kalkulasi Matriks PPMI (Positive Pointwise Mutual Information):")
print("-" * 65)
print(f"{'Target':<10} | " + " | ".join([f"{c:>12}" for c in contexts]))
print("-" * 65)
for i, t in enumerate(targets):
    row_str = " | ".join([f"{ppmi_matrix[i, j]:>12.4f}" for j in range(len(contexts))])
    print(f"{t:<10} | {row_str}")

print("-" * 65)
print("PPMI berhasil mengisolasi asosiasi semantik sejati dan membuang relasi kebetulan acak.")
'''

subchapters.append({
    "id": "nlp-4-7-pointwise-mutual-information-ppmi",
    "chapterId": "natural-language-processing-ch-4",
    "title": "Pointwise Mutual Information (PMI) & PPMI: Mengatasi Bias Frekuensi Ko-okurensi",
    "description": "Metrik asosiasi statistik informasi: perbandingan probabilitas bersama vs independensi acak, penanganan nilai negatif, formulasi Positive PMI (PPMI), dan smoothing alpha.",
    "estimatedMinutes": 40,
    "order": 7,
    "content": {
        "theory": (
            "Meskipun matriks ko-okurensi mentah mencatat frekuensi kemunculan bersama kata target dan konteks, matriks tersebut memiliki cacat fundamental: **bias kata berfrekuensi tinggi**. Kata-kata yang secara alamiah sangat sering muncul dalam bahasa (seperti *\"dan\"*, *\"yang\"*, *\"adalah\"*) akan memiliki nilai hitungan ko-okurensi yang sangat tinggi dengan hampir setiap kata lain, semata-mata karena kebetulan statistik acak, bukan karena adanya hubungan semantik yang bermakna.\n\n"
            "Untuk mengoreksi bias ini, Kenneth Church dan Patrick Hanks (1990) mengadaptasi konsep teori informasi ke dalam NLP yang dikenal sebagai **Pointwise Mutual Information (PMI)**.\n\n"
            "PMI mengukur rasio antara seberapa sering dua kata $w$ dan $c$ benar-benar muncul bersama ($P(w, c)$) dibandingkan dengan seberapa sering keduanya diperkirakan akan muncul bersama jika keduanya sepenuhnya independen secara acak ($P(w)P(c)$):\n"
            "$$\\text{PMI}(w, c) = \\log_2\\left( \\frac{P(w, c)}{P(w) P(c)} \\right) = \\log_2\\left( \\frac{C(w, c) \\cdot N}{C(w) \\cdot C(c)} \\right)$$\n"
            "- Jika $\\text{PMI}(w, c) > 0$: Kata $w$ dan $c$ berko-okurensi jauh lebih sering daripada sekadar kebetulan acak (asosiasi semantik positif kuat).\n"
            "- Jika $\\text{PMI}(w, c) = 0$: Kata $w$ dan $c$ muncul bersama persis sesuai probabilitas acak independen.\n"
            "- Jika $\\text{PMI}(w, c) < 0$: Kata $w$ dan $c$ berko-okurensi lebih jarang daripada ekspektasi acak.\n\n"
            "**Masalah Nilai Negatif & Solusi Positive PMI (PPMI)**:\n"
            "Nilai PMI negatif memiliki dua masalah besar: (1) bukti bahwa dua kata *tidak* muncul bersama sangat sulit dipercaya pada korpus data langka (bisa jadi hanya karena keterbatasan sampel korpus), dan (2) $\\log_2(0) = -\\infty$ ketika dua kata tidak pernah muncul bersama sama sekali.\n\n"
            "Oleh karena itu, Niwa & Nitta (1994) memperkenalkan **Positive Pointwise Mutual Information (PPMI)** yang mengganti seluruh nilai PMI negatif atau tak terdefinisi menjadi nol:\n"
            "$$\\text{PPMI}(w, c) = \\max(\\text{PMI}(w, c), 0)$$\n\n"
            "Untuk mengatasi kecenderungan PPMI yang terlalu menyukai kata-kata sangat langka (*rare words*), distribusi marginal konteks sering dipangkatkan parameter smoothing $\\alpha = 0.75$ (mirip distribusi negative sampling Word2Vec): $P_\\alpha(c) = \\frac{C(c)^\\alpha}{\\sum_{c'} C(c')^\\alpha}$."
        ),
        "codeSnippet": code_4_7,
        "codeSnippetOutput": run_code_capture_output(code_4_7),
        "realWorldApplication": (
            "Pembentukan ruang vektor semantik klasik sebelum Word2Vec, metrik evaluasi kemiripan semantik leksikal, dan analisis kolokasi idiom bahasa linguistik."
        ),
        "commonPitfalls": [
            r"Tidak menerapkan pemotongan positif (PPMI) yang menghasilkan nilai minus tak hingga (-inf) untuk pasangan kata dengan hitungan nol.",
            r"Mengabaikan bias PPMI terhadap kata yang sangat langka tanpa menerapkan context discounting atau eksponen smoothing alpha = 0.75.",
            r"Lupa menormalkan total N sebagai jumlah seluruh elemen matriks ko-okurensi gabungan."
        ],
        "caseStudy": (
            "Diberikan kata 'kebijakan' yang sering berpasangan dengan kata 'fiskal' dan kata umum 'dan'. Mengapa matriks ko-okurensi mentah memberikan skor lebih tinggi pada pasangan ('kebijakan', 'dan'), sementara matriks PPMI secara dramatis membalik peringkat sehingga pasangan ('kebijakan', 'fiskal') memiliki nilai yang jauh lebih tinggi?"
        ),
        "academicReferences": [
            r"Church, K. W., & Hanks, P. (1990). Word association norms, mutual information, and lexicography. Computational Linguistics, 16(1), 22-29.",
            r"Niwa, Y., & Nitta, Y. (1994). Co-occurrence vectors from corpora: A new approach to dictionary extraction. In COLING 1994 (pp. 304-309).",
            r"Levy, O., & Goldberg, Y. (2014). Neural word embedding as implicit matrix factorization. Advances in Neural Information Processing Systems (NeurIPS), 27, 2177-2185."
        ]
    }
})

# ==============================================================================
# Subbab 4.8: N-gram Range pada Vectorizer
# ==============================================================================
code_4_8 = r'''from collections import Counter
import numpy as np

# Ekstraksi Fitur Teks dengan N-gram Range (Unigram + Bigram)
# Menangkap konteks lokal frasa dua kata untuk membedakan negasi kalimat

documents = [
    "layanan ini tidak memuaskan",
    "layanan ini sangat memuaskan"
]

def extract_ngrams(tokens, n_min=1, n_max=2):
    ngrams = []
    for n in range(n_min, n_max + 1):
        for i in range(len(tokens) - n + 1):
            ngrams.append(" ".join(tokens[i:i+n]))
    return ngrams

doc_ngrams = [extract_ngrams(d.split(), 1, 2) for d in documents]
all_features = sorted(list(set(sum(doc_ngrams, []))))

print("Ekstraksi Fitur N-Gram Range (1, 2):")
print("-" * 75)
print(f"Total Fitur Kosakata ({len(all_features)} fitur):")
print(all_features)
print("-" * 75)

# Bandingkan fitur unigram murni vs bigram negasi
negation_bigram = "tidak memuaskan"
print(f"Fitur Bigram Penyelamat Polaritas Sentimen: '{negation_bigram}'")
print(f"  - Muncul di Dokumen 1: {negation_bigram in doc_ngrams[0]}")
print(f"  - Muncul di Dokumen 2: {negation_bigram in doc_ngrams[1]}")
print("-" * 75)
print("Penambahan bigram pada vectorizer berhasil membedakan polaritas negasi secara presisi.")
'''

subchapters.append({
    "id": "nlp-4-8-ngram-vectorizer-features",
    "chapterId": "natural-language-processing-ch-4",
    "title": "N-gram Range pada Vectorizer: Menangkap Konteks Frasa Bigram dan Trigram",
    "description": "Perluasan ruang fitur BoW & TF-IDF dengan multi-token n-gram range (1, 2) dan (1, 3): penanganan negasi lokal, kolokasi frasa majemuk, dan trade-off ledakan dimensi fitur.",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "Sebagaimana telah dibahas pada Subbab 4.2, representasi Bag-of-Words unigram murni membuang seluruh informasi urutan sintaksis kata. Hal ini menimbulkan kegagalan fatal pada deteksi **negasi lokal** (*local negation*) dan frasa majemuk idiomatik. Kalimat *\"layanan ini tidak memuaskan\"* dan *\"layanan ini sangat memuaskan\"* berbagi $75\\%$ unigram yang persis sama (*\"layanan\"*, *\"ini\"*, *\"memuaskan\"*), sehingga pengklasifikasi linear sering terkecoh.\n\n"
            "Solusi klasik yang paling efektif dalam pemodelan ruang vektor adalah memperluas kamus fitur menggunakan **Rentang N-gram (*N-gram Range*)**, umumnya rentang unigram dan bigram $(1, 2)$ atau hingga trigram $(1, 3)$.\n\n"
            "Dalam skema `ngram_range=(1, 2)`:\n"
            "1. Kalimat *\"tidak memuaskan\"* diekstrak menjadi tiga fitur:\n"
            "   - Dua fitur unigram: `\"tidak\"`, `\"memuaskan\"`.\n"
            "   - Satu fitur bigram terikat: `\"tidak memuaskan\"`.\n"
            "2. Fitur gabungan `\"tidak memuaskan\"` bertindak sebagai entitas leksikal tunggal baru yang memiliki bobot terpisah pada model klasifikasi sentimen, sehingga bobot negatif dari bigram tersebut mampu membalikkan sentimen positif dari unigram *\"memuaskan\"*.\n\n"
            "**Trade-Off Ledakan Dimensi (*Feature Explosion*)**:\n"
            "Meskipun sangat ampuh, menyertakan bigram dan trigram ke dalam matriks TF-IDF memperluas dimensi kosakata secara dramatis. Jika korpus memiliki $50.000$ unigram unik, jumlah bigram unik dapat mencapai $500.000$ hingga $2.000.000$ fitur. Hal ini menuntut penerapan seleksi fitur statistik atau pemangkasan ambang frekuensi minimum (*min_df threshold*) untuk membuang n-gram langka yang hanya muncul satu kali."
        ),
        "codeSnippet": code_4_8,
        "codeSnippetOutput": run_code_capture_output(code_4_8),
        "realWorldApplication": (
            "Fitur standar klasifikasi sentimen ulasan film/produk, pengelompokan topik dokumen paten, dan sistem deteksi penipuan transaksi berbasis teks."
        ),
        "commonPitfalls": [
            r"Menyetel n-gram range terlalu lebar (misal 1 hingga 5) pada korpus besar yang menyebabkan kehabisan RAM akibat jutaan fitur sparse.",
            r"Lupa menetapkan parameter min_df (misal min_df=3 atau min_df=5) sehingga n-gram yang salah ketik (typo) mengotori kamus fitur.",
            r"Mengabaikan tokenisasi tanda baca yang dapat menggabungkan kata lintas batas kalimat menjadi bigram semu yang tidak valid."
        ],
        "caseStudy": (
            "Sebuah model deteksi ulasan restoran dilatih dengan unigram TF-IDF dan gagal mendeteksi ironi dalam ulasan: 'Tempat ini luar biasa kotor dan sama sekali tidak direkomendasikan'. Jelaskan bagaimana penyertaan fitur bigram 'tidak direkomendasikan' dan 'luar biasa kotor' memperbaiki prediksi model."
        ),
        "academicReferences": [
            r"Pang, B., Lee, L., & Vaithyanathan, S. (2002). Thumbs up? Sentiment classification using machine learning techniques. In EMNLP (pp. 79-86).",
            r"Wang, S., & Manning, C. D. (2012). Baselines and bigrams: Simple, good sentiment and topic classification. In ACL (pp. 90-94).",
            r"Manning, C. D., Raghavan, P., & Schütze, H. (2008). Introduction to Information Retrieval. Cambridge University Press."
        ]
    }
})

# ==============================================================================
# Subbab 4.9: Seleksi Fitur Teks untuk Reduksi Dimensi
# ==============================================================================
code_4_9 = r'''import numpy as np

# Seleksi Fitur Teks Menggunakan Uji Chi-Square (Chi2 / \chi^2)
# Mengukur dependensi statistik antara fitur kata dan label kelas target
# \chi^2 = \frac{N (AD - BC)^2}{(A + B)(C + D)(A + C)(B + D)}
# A = Dokumen memuat term & di Kelas 1
# B = Dokumen memuat term & BUKAN di Kelas 1
# C = Dokumen TIDAK memuat term & di Kelas 1
# D = Dokumen TIDAK memuat term & BUKAN di Kelas 1

# Matriks kontingensi simulasi untuk kata "olahraga" dan "dan" terhadap kelas "Sepakbola"
# Total Dokumen N = 1000. Kelas Sepakbola = 200 dokumen, Non-Sepakbola = 800 dokumen.

def calculate_chi2(A, B, C, D):
    N = A + B + C + D
    numerator = N * ((A * D - B * C) ** 2)
    denominator = (A + B) * (C + D) * (A + C) * (B + D)
    return numerator / denominator if denominator > 0 else 0.0

# Kasus 1: Kata "olahraga" (sangat diskriminatif untuk Sepakbola)
# Muncul di 180 dokumen Sepakbola, hanya di 20 dokumen Non-Sepakbola
A1, B1 = 180, 20
C1, D1 = 20, 780
chi2_olahraga = calculate_chi2(A1, B1, C1, D1)

# Kasus 2: Kata "dan" (kata umum tidak diskriminatif)
# Muncul merata di 190 dokumen Sepakbola, dan di 760 dokumen Non-Sepakbola
A2, B2 = 190, 760
C2, D2 = 10, 40
chi2_dan = calculate_chi2(A2, B2, C2, D2)

print("Seleksi Fitur Teks Menggunakan Statistik Chi-Square (\\chi^2):")
print("-" * 70)
print(f"Fitur 'olahraga' : Chi2 Score = {chi2_olahraga:.2f} (Dependensi kelas SANGAT TINGGI)")
print(f"Fitur 'dan'       : Chi2 Score = {chi2_dan:.2f} (Independen terhadap kelas, tidak berguna)")
print("-" * 70)
print("Fitur dengan skor Chi-Square tinggi dipertahankan, sedangkan skor mendekati 0 dipangkas.")
'''

subchapters.append({
    "id": "nlp-4-9-feature-selection-chi2-mutual-info",
    "chapterId": "natural-language-processing-ch-4",
    "title": "Seleksi Fitur Teks untuk Reduksi Dimensi: Uji Chi-Square dan Mutual Information",
    "description": "Metode seleksi fitur terarah (supervised feature selection): tabel kontingensi dua arah, uji Chi-Square independensi kategori, dan Information Gain untuk pemangkasan dimensi.",
    "estimatedMinutes": 35,
    "order": 9,
    "content": {
        "theory": (
            "Ketika korpus teks diekstraksi menggunakan Bag-of-Words atau N-gram range, dimensi matriks fitur dapat dengan mudah membengkak menjadi puluhan hingga ratusan ribu kolom. Sebagian besar fitur tersebut adalah kata-kata langka, salah ketik (*typo*), atau kata-kata umum yang tidak memberikan kontribusi diskriminatif apa pun terhadap pemisahan kategori sasaran.\n\n"
            "**Seleksi Fitur Terarah (*Supervised Feature Selection*)** bertujuan memilih subset fitur terbaik yang memiliki korelasi statistik paling kuat dengan label kelas target, sekaligus memangkas hingga $90\\%$ fitur bising untuk mempercepat pelatihan model dan mencegah *overfitting*.\n\n"
            "**Uji Chi-Square ($\\chi^2$) untuk Teks**:\n"
            "Dalam klasifikasi teks, uji Chi-Square menguji hipotesis nol ($H_0$) bahwa kemunculan suatu kata $t$ sepenuhnya independen dari keberadaan kelas target $c$.\n\n"
            "Berdasarkan tabel kontingensi $2 \\times 2$:\n"
            "- $A$: Jumlah dokumen kelas $c$ yang memuat kata $t$.\n"
            "- $B$: Jumlah dokumen di luar kelas $c$ yang memuat kata $t$.\n"
            "- $C$: Jumlah dokumen kelas $c$ yang tidak memuat kata $t$.\n"
            "- $D$: Jumlah dokumen di luar kelas $c$ yang tidak memuat kata $t$.\n\n"
            "Statistik uji $\\chi^2$ dirumuskan secara tertutup sebagai:\n"
            "$$\\chi^2(t, c) = \\frac{N (AD - BC)^2}{(A + B)(C + D)(A + C)(B + D)}$$\n"
            "di mana $N = A + B + C + D$ adalah total dokumen dalam korpus.\n\n"
            "Interpretasi:\n"
            "- Nilai $\\chi^2$ yang sangat besar membuktikan penolakan hipotesis nol dengan tingkat signifikansi tinggi, yang berarti kata $t$ memiliki asosiasi ketergantungan yang sangat kuat dengan kelas $c$ (fitur diskriminatif prima).\n"
            "- Nilai $\\chi^2$ mendekati $0$ mengindikasikan bahwa kata tersebut terdistribusi secara acak merata di semua kelas (seperti kata sambung) dan layak dibuang dari kamus model."
        ),
        "codeSnippet": code_4_9,
        "codeSnippetOutput": run_code_capture_output(code_4_9),
        "realWorldApplication": (
            "Optimasi pipeline klasifikasi dokumen medis ICD-10 berdimensi raksasa, penyaringan fitur pada deteksi email phishing, dan klasifikasi topik berita berskala jutaan artikel."
        ),
        "commonPitfalls": [
            r"Menghitung seleksi fitur Chi-Square pada seluruh dataset (termasuk test set) yang menyebabkan kebocoran data (data leakage); wajib dihitung hanya pada data latih.",
            r"Menerapkan Chi-Square pada fitur yang memiliki frekuensi observasi sangat kecil (A + B < 5) di mana asumsi distribusi chi-kuadrat menjadi kurang reliabel.",
            r"Memangkas terlalu agresif (misal membuang 99.9% fitur) sehingga model kehilangan fitur konteks yang jarang namun bernilai tinggi."
        ],
        "caseStudy": (
            "Dalam klasifikasi berita 10 kelas (Politik, Ekonomi, Kesehatan, dsb.), jelaskan bagaimana strategi seleksi fitur macro-averaging Chi-Square memilih kata-kata spesifik yang hanya khas untuk satu kelas tertentu (seperti 'stetoskop' untuk Kesehatan) tanpa tertelan oleh kelas mayoritas Politik."
        ),
        "academicReferences": [
            r"Yang, Y., & Pedersen, J. O. (1997). A comparative study on feature selection in text categorization. In ICML (Vol. 97, pp. 412-420).",
            r"Forman, G. (2003). An extensive empirical study of feature selection metrics for text classification. Journal of Machine Learning Research, 3, 1289-1305.",
            r"Manning, C. D., Raghavan, P., & Schütze, H. (2008). Introduction to Information Retrieval. Chapter 13.5: Feature selection. Cambridge University Press."
        ]
    }
})

# ==============================================================================
# Subbab 4.10: Implementasi TF-IDF dan PPMI NumPy Scratch
# ==============================================================================
code_4_10 = r'''from collections import Counter
import numpy as np

# Implementasi Lengkap TF-IDF Vectorizer dan PPMI Matrix dari Nol Berbasis NumPy

class ClassicalFeatureExtractor:
    def __init__(self, smooth_idf=True, sublinear_tf=True):
        self.smooth_idf = smooth_idf
        self.sublinear_tf = sublinear_tf
        self.vocab = {}
        self.idf_diag = None
        self.vocab_size = 0
        
    def fit_transform_tfidf(self, documents):
        # 1. Bangun kamus kosakata terurut
        doc_tokens = [d.strip().lower().split() for d in documents]
        unique_words = sorted(list(set(sum(doc_tokens, []))))
        self.vocab = {w: i for i, w in enumerate(unique_words)}
        self.vocab_size = len(self.vocab)
        N = len(documents)
        
        # 2. Bangun Term Frequency (TF) matrix
        tf_matrix = np.zeros((N, self.vocab_size), dtype=float)
        df = np.zeros(self.vocab_size, dtype=float)
        
        for i, tokens in enumerate(doc_tokens):
            counts = Counter(tokens)
            for w, c in counts.items():
                if w in self.vocab:
                    idx = self.vocab[w]
                    tf_matrix[i, idx] = (1.0 + np.log(c)) if self.sublinear_tf else float(c)
                    df[idx] += 1
                    
        # 3. Hitung IDF vector (Smooth IDF standar)
        if self.smooth_idf:
            idf = np.log((1.0 + N) / (1.0 + df)) + 1.0
        else:
            idf = np.log(N / np.maximum(df, 1.0))
        self.idf_diag = idf
        
        # 4. Kalikan TF * IDF
        tfidf_raw = tf_matrix * idf
        
        # 5. Normalisasi L2 per dokumen
        norms = np.linalg.norm(tfidf_raw, axis=1, keepdims=True)
        norms = np.where(norms == 0, 1.0, norms)
        tfidf_norm = tfidf_raw / norms
        return tfidf_norm

    def compute_ppmi(self, documents, window_size=2):
        doc_tokens = [d.strip().lower().split() for d in documents]
        V = self.vocab_size
        cooc = np.zeros((V, V), dtype=float)
        
        for tokens in doc_tokens:
            n = len(tokens)
            for i, target in enumerate(tokens):
                if target not in self.vocab:
                    continue
                t_idx = self.vocab[target]
                start = max(0, i - window_size)
                end = min(n, i + window_size + 1)
                for j in range(start, end):
                    if i != j and tokens[j] in self.vocab:
                        c_idx = self.vocab[tokens[j]]
                        cooc[t_idx, c_idx] += 1.0
                        
        # Hitung PPMI
        total_cooc = cooc.sum()
        if total_cooc == 0:
            return np.zeros_like(cooc)
        p_wc = cooc / total_cooc
        p_w = p_wc.sum(axis=1, keepdims=True)
        p_c = p_wc.sum(axis=0, keepdims=True)
        
        expected = np.dot(p_w, p_c)
        epsilon = 1e-12
        pmi = np.where(p_wc > 0, np.log2(np.where(p_wc > 0, p_wc / (expected + epsilon), epsilon)), 0.0)
        ppmi = np.maximum(pmi, 0.0)
        return ppmi

corpus = [
    "kecerdasan buatan dan pemrosesan bahasa alami",
    "pemrosesan bahasa alami sangat penting untuk aplikasi nlp",
    "aplikasi kecerdasan buatan berkembang sangat pesat"
]

extractor = ClassicalFeatureExtractor()
tfidf_result = extractor.fit_transform_tfidf(corpus)
ppmi_result = extractor.compute_ppmi(corpus, window_size=2)

print("Ekstraksi Fitur Teks Klasik Mandiri Berbasis NumPy:")
print("-" * 75)
print(f"Ukuran Kosakata |V| = {extractor.vocab_size} kata unik")
print(f"Dimensi Matriks TF-IDF : {tfidf_result.shape} (N_docs x |V|)")
print(f"Dimensi Matriks PPMI   : {ppmi_result.shape} (|V| x |V|)")
print("-" * 75)
print("Contoh Bobot TF-IDF Dokumen 1 (L2 Normalized):")
for w, idx in list(extractor.vocab.items())[:5]:
    print(f"  Kata '{w:<12}' -> TF-IDF = {tfidf_result[0, idx]:.4f}")
print("-" * 75)
print("Modul berhasil mengekstrak representasi vektor dokumen dan representasi kata.")
'''

subchapters.append({
    "id": "nlp-4-10-tfidf-ppmi-numpy-scratch",
    "chapterId": "natural-language-processing-ch-4",
    "title": "Implementasi Kalkulasi Matriks TF-IDF dan PPMI Lengkap dari Nol Menggunakan NumPy",
    "description": "Pembangunan class menyeluruh ClassicalFeatureExtractor dari nol: penyusunan kosakata, perhitungan sublinear TF, smooth IDF, normalisasi baris L2, dan matriks PPMI.",
    "estimatedMinutes": 45,
    "order": 10,
    "content": {
        "theory": (
            "Sebagai penutup Bab 4, kita menyatukan seluruh derivasi teoretis representasi fitur leksikal klasik ke dalam satu implementasi komprehensif `ClassicalFeatureExtractor` yang dibangun murni menggunakan Python standar dan operasi matriks ter-vektorisasi NumPy tanpa ketergantungan pada pustaka tingkat tinggi pihak ketiga.\n\n"
            "Arsitektur engine mencakup dua metode transformasi utama:\n"
            "1. **`fit_transform_tfidf(documents)`**:\n"
            "   - Membangun indeks leksikal terurut $\\mathcal{V}$ dari korpus teks masukan.\n"
            "   - Menghitung matriks Term Frequency berdimensi $M \\times |\\mathcal{V}|$ dengan opsi kompresi logaritmik sublinear: $\\text{TF} = 1 + \\ln(C)$.\n"
            "   - Menghitung vektor Document Frequency $\\text{DF}$ dan menghitung bobot Smooth IDF standar industri: $\\text{IDF} = \\ln\\left(\\frac{1 + N}{1 + \\text{DF}}\\right) + 1$.\n"
            "   - Menerapkan perkalian Hadamard ter-vektorisasi $\\mathbf{X} = \\mathbf{TF} \\odot \\mathbf{IDF}$.\n"
            "   - Menerapkan normalisasi Euclidean baris demi baris $\\frac{\\mathbf{x}_i}{\\|\\mathbf{x}_i\\|_2}$ untuk menjamin invarian terhadap panjang dokumen.\n\n"
            "2. **`compute_ppmi(documents, window_size)`**:\n"
            "   - Menggeser jendela konteks simetris $[-k, +k]$ di seluruh urutan token kalimat.\n"
            "   - Membangun matriks ko-okurensi kata-ke-kata berdimensi $|\\mathcal{V}| \\times |\\mathcal{V}|$.\n"
            "   - Menghitung distribusi probabilitas gabungan $P(w, c)$ dan probabilitas marginal $P(w), P(c)$.\n"
            "   - Menghitung rasio Pointwise Mutual Information dan memotong nilai negatif menjadi nol ($\nPPMI = \\max(\\text{PMI}, 0)$).\n\n"
            "Secara teoretis, representasi matriks Term-Dokumen TF-IDF $\\mathbf{X} \\in \\mathbb{R}^{M \\times |\\mathcal{V}|}$ dan matriks ko-okurensi kata PPMI $\\mathbf{M} \\in \\mathbb{R}^{|\\mathcal{V}| \\times |\\mathcal{V}|}$ yang kita bangun dari nol ini merupakan pilar utama dari model ruang vektor klasik (*Vector Space Model*). Sebagaimana dibuktikan secara matematis oleh Levy & Goldberg (2014), fungsi objektif model neural Word2Vec SGNS pada dasarnya melakukan faktorisasi implisit terhadap matriks PPMI ini yang digeser oleh konstanta $\\log(k)$, membuktikan kontinuitas teoretis yang sangat erat antara metode ekstraksi leksikal klasik dan representasi embedding terdistribusi modern.\n\n"
            "Class ini merepresentasikan fondasi lengkap pemrosesan fitur teks simbolik klasik sebelum dunia pemrosesan bahasa alami memasuki era representasi vektor kontinu terdistribusi (Word2Vec)."
        ),
        "codeSnippet": code_4_10,
        "codeSnippetOutput": run_code_capture_output(code_4_10),
        "realWorldApplication": (
            "Dapat digunakan sebagai modul ekstraksi fitur teks mandiri pada lingkungan tertanam mikroprosesor (*micro-controller edge NLP*), pipeline pencarian cepat tanpa dependensi berat, dan unit pengujian algoritma."
        ),
        "commonPitfalls": [
            r"Melakukan iterasi per-elemen menggunakan nested loop Python pada perkalian TF-IDF yang sangat lambat; wajib memanfaatkan operasi broadcasting NumPy.",
            r"Lupa menangani vektor dokumen kosong yang memiliki norma nol (norm = 0) saat normalisasi L2 yang menghasilkan pembagian NaN (Not a Number).",
            r"Mengalikan IDF sebelum menerapkan transformasi logaritmik pada TF."
        ],
        "caseStudy": (
            "Ujilah class ClassicalFeatureExtractor dengan sekumpulan 5 paragraf ulasan teknologi. Tampilkan 3 kata teratas dengan skor TF-IDF tertinggi pada masing-masing dokumen, dan bandingkan apakah kata-kata tersebut benar-benar mencerminkan intisari topik paragraf yang bersangkutan."
        ),
        "academicReferences": [
            r"Spärck Jones, K. (1972). A statistical interpretation of term specificity and its application in retrieval. Journal of Documentation, 28(1), 11-21.",
            r"Salton, G., & Buckley, C. (1988). Term-weighting approaches in automatic text retrieval. Information Processing & Management, 24(5), 513-523.",
            r"Levy, O., Goldberg, Y., & Dagan, I. (2015). Improving distributional similarity with lessons learned from word embeddings. Transactions of the Association for Computational Linguistics, 3, 211-225."
        ]
    }
})

output_path = os.path.join(os.path.dirname(__file__), "nlp_ch4_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 4 NLP -> {output_path}")
