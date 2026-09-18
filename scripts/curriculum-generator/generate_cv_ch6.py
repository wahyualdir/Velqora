# -*- coding: utf-8 -*-
"""
Generator untuk Bab 6: Pencocokan Fitur, RANSAC, dan Image Stitching (10 Subbab)
Topik: Computer Vision (08-computer-vision.ts)
"""

import json
import os
import sys
import io

sys.stdout.reconfigure(encoding='utf-8')

def run_snippet_and_get_output(code_str):
    old_stdout = sys.stdout
    redirected = io.StringIO()
    sys.stdout = redirected
    try:
        exec_globals = {}
        exec(code_str, exec_globals)
        out = redirected.getvalue().strip()
        return out
    finally:
        sys.stdout = old_stdout

def create_subchapter(id_str, title, description, content_markdown, code_snippet, common_pitfalls, canonical_refs, quiz):
    expected_output = run_snippet_and_get_output(code_snippet)
    return {
        "id": id_str,
        "title": title,
        "description": description,
        "content": content_markdown.strip(),
        "codeSnippet": code_snippet.strip(),
        "expectedOutput": expected_output.strip(),
        "commonPitfalls": common_pitfalls if isinstance(common_pitfalls, list) else [common_pitfalls.strip()],
        "canonicalReferences": canonical_refs,
        "quiz": quiz
    }

subchapters = []

# ==============================================================================
# SUBCHAPTER 6.1: Metrik Jarak Pencocokan: Euclidean vs Hamming Distance
# ==============================================================================
c6_1_desc = "Analisis metrik jarak fitur visual: Jarak Euclidean L2 dan Manhattan L1 untuk deskriptor float (SIFT), serta Jarak Hamming biner berbasis XOR dan POPCNT untuk deskriptor biner (ORB)."
c6_1_md = r"""Pencocokan fitur (*feature matching*) adalah proses menemukan korespondensi antara kumpulan deskriptor lokal yang diekstraksi dari dua citra berbeda. Pemilihan fungsi jarak (*distance metric*) ditentukan secara mutlak oleh tipe representasi ruang fitur yang digunakan: vektor bilangan riil mengambang (*floating-point*) atau string bit biner.

### 1. Metrik Jarak Ruang Kontinu (Deskriptor Float: SIFT / SURF)
Untuk dua deskriptor vektor kontinu $\mathbf{a}, \mathbf{b} \in \mathbb{R}^D$ (misal $D=128$ pada SIFT):
1. **Jarak Euclidean ($L_2$-norm)**:
   $$d_{L_2}(\mathbf{a}, \mathbf{b}) = \|\mathbf{a} - \mathbf{b}\|_2 = \sqrt{\sum_{i=1}^{D} (a_i - b_i)^2}$$
2. **Jarak Manhattan ($L_1$-norm)**:
   $$d_{L_1}(\mathbf{a}, \mathbf{b}) = \|\mathbf{a} - \mathbf{b}\|_1 = \sum_{i=1}^{D} |a_i - b_i|$$
Jika vektor telah dinormalisasi ke panjang satuan ($\|\mathbf{a}\|_2 = \|\mathbf{b}\|_2 = 1$), jarak Euclidean berhubungan langsung dengan kesamaan kosinus (*cosine similarity*):
$$\|\mathbf{a} - \mathbf{b}\|_2^2 = \|\mathbf{a}\|_2^2 + \|\mathbf{b}\|_2^2 - 2 \mathbf{a}^T \mathbf{b} = 2 - 2 \cos(\theta)$$

### 2. Metrik Jarak Ruang Diskrit (Deskriptor Biner: ORB / BRIEF)
Untuk deskriptor biner $\mathbf{u}, \mathbf{v} \in \{0, 1\}^B$ (misal $B=256$ bit = 32 byte pada ORB):
Perbedaan dihitung melalui **Jarak Hamming**, yaitu jumlah posisi bit di mana kedua string memiliki nilai yang berbeda:

$$d_{\text{Hamming}}(\mathbf{u}, \mathbf{v}) = \sum_{i=1}^{B} (u_i \oplus v_i) = \operatorname{POPCNT}(\mathbf{u} \oplus \mathbf{v})$$

Di mana $\oplus$ melambangkan operasi logika bitwise XOR dan $\operatorname{POPCNT}$ (*population count*) adalah instruksi CPU perangkat keras tingkat rendah yang menghitung jumlah bit 1 dalam satu siklus clock prosesor."""

c6_1_code = r"""import numpy as np

def euclidean_distance(desc_a: np.ndarray, desc_b: np.ndarray) -> float:
    '''Menghitung Jarak Euclidean L2 antara dua deskriptor floating-point.'''
    return float(np.sqrt(np.sum((desc_a - desc_b) ** 2)))

def hamming_distance(desc_a: np.ndarray, desc_b: np.ndarray) -> int:
    '''Menghitung Jarak Hamming antara dua deskriptor biner 256-bit (32 bytes uint8).'''
    # Operasi XOR elemen-demi-elemen, lalu hitung bit 1 (popcount)
    xor_result = np.bitwise_xor(desc_a, desc_b)
    # unpackbits mengonversi setiap uint8 menjadi 8 bit individual
    bits = np.unpackbits(xor_result)
    return int(np.sum(bits))

# 1. Evaluasi Deskriptor SIFT Tiruan (Float 128D, dinormalisasi ke L2)
np.random.seed(42)
sift_1 = np.random.randn(128).astype(np.float32)
sift_1 /= np.linalg.norm(sift_1)

sift_2 = sift_1 + np.random.normal(0, 0.05, 128).astype(np.float32)
sift_2 /= np.linalg.norm(sift_2)

dist_l2 = euclidean_distance(sift_1, sift_2)

# 2. Evaluasi Deskriptor ORB Tiruan (Biner 256-bit = 32 uint8)
orb_1 = np.random.randint(0, 256, size=32, dtype=np.uint8)
# Berikan mutasi derau kecil pada 15 bit
orb_2 = orb_1.copy()
orb_2[0] ^= 0b00000111  # Balik 3 bit
orb_2[1] ^= 0b00001111  # Balik 4 bit
orb_2[2] ^= 0b11111111  # Balik 8 bit

dist_hamming = hamming_distance(orb_1, orb_2)

print("--- Evaluasi Metrik Jarak Deskriptor ---")
print(f"Jarak Euclidean (SIFT 128D Float) : {dist_l2:.4f} (Rentang teoritis: [0, 2])")
print(f"Jarak Hamming   (ORB 256-bit Bin) : {dist_hamming} bit berbeda (Rentang teoritis: [0, 256])")
"""

c6_1_pitfalls = [
    "Menghitung jarak Euclidean pada deskriptor biner seperti ORB atau BRIEF; operasi ini menginterpretasikan byte sebagai integer linier alih-alih representasi string bit, merusak makna topologi ruang Hamming.",
    "Lupa melakukan normalisasi L2 pada deskriptor SIFT/SURF sebelum menghitung jarak atau kesamaan kosinus, memicu bias magnitudo intensitas pencahayaan lokal.",
    "Mengasumsikan jarak Euclidean bernilai nol untuk fitur identik tanpa memperhitungkan galat pembulatan bilangan mengambang (floating-point precision)."
]

c6_1_refs = [
    {
        "title": "Distinctive Image Features from Scale-Invariant Keypoints",
        "authors": ["David G. Lowe"],
        "year": 2004,
        "publisherOrVenue": "International Journal of Computer Vision (IJCV)",
        "url": "https://doi.org/10.1023/B:VISI.0000029664.99615.94",
        "relevance": "Bab 5: Penggunaan metrik jarak Euclidean dan normalisasi vektor gradien 128D."
    }
]

c6_1_quiz = {
    "question": "Mengapa deskriptor biner seperti ORB wajib dipasangkan menggunakan metrik Jarak Hamming alih-alih Jarak Euclidean?",
    "options": [
        "Karena deskriptor biner tidak dapat dimuat ke dalam memori RAM komputer.",
        "Karena deskriptor biner merepresentasikan uji intensitas komparatif di mana setiap bit adalah variabel independen diskrit, sehingga jarak sejati adalah jumlah bit yang berbeda via operasi XOR dan POPCNT.",
        "Karena Jarak Euclidean hanya dapat dihitung jika dimensi vektor lebih dari 1000.",
        "Karena Jarak Hamming menghasilkan nilai floating point desimal yang lebih presisi."
    ],
    "correctAnswerIndex": 1,
    "explanation": "Deskriptor biner seperti ORB dibentuk dari serangkaian uji perbandingan biner lokal independen ($0$ atau $1$). Nilai numerik integer byte-nya tidak memiliki arti besaran linear; perbedaan representasi visual murni diukur oleh berapa banyak posisi bit yang tidak cocok, yang dihitung eksak oleh Jarak Hamming (XOR + POPCNT)."
}

subchapters.append(create_subchapter("computer-vision-ch6-sub1", "6.1. Metrik Jarak Pencocokan: Euclidean vs Hamming Distance", c6_1_desc, c6_1_md, c6_1_code, c6_1_pitfalls, c6_1_refs, c6_1_quiz))

# ==============================================================================
# SUBCHAPTER 6.2: Brute-Force Matcher vs FLANN
# ==============================================================================
c6_2_desc = "Komparasi kompleksitas komputasi Brute-Force Matcher O(N*M*D) versus FLANN O(N log M) berbasis Randomized KD-Tree dan Hierarchical K-Means Tree."
c6_2_md = r"""Ketika mencocokkan $N$ deskriptor dari Citra Permintaan (*query image*) terhadap $M$ deskriptor dalam Basis Data (*database image*), pemilihan algoritma pencarian tetangga terdekat (*nearest neighbor search*) menentukan apakah sistem visi komputer dapat beroperasi secara waktu-nyata (*real-time*).

### 1. Brute-Force (BF) Matcher
BF Matcher membandingkan setiap vektor query dengan **seluruh** vektor dalam basis data secara mendalam melalui evaluasi jarak Euclidean atau Hamming:
- **Kompleksitas Waktu**: $\mathcal{O}(N \times M \times D)$, di mana $D$ adalah dimensi deskriptor ($D=128$ untuk SIFT, $D=256$ bit untuk ORB).
- **Sifat Matematis**: *Exact Exhaustive Search* (menjamin $100\%$ menemukan pasangan dengan jarak absolut terpendek secara global).
- **Keterbatasan Skalabilitas**: Sangat lambat untuk basis data berskala menengah hingga besar. Sebagai ilustrasi, pencocokan antara dua citra yang masing-masing memiliki $N = 5.000$ dan $M = 50.000$ fitur memerlukan $2.5 \times 10^8$ evaluasi jarak per detik, yang melumpuhkan siklus komputasi CPU konvensional.

### 2. FLANN (Fast Library for Approximate Nearest Neighbors)
FLANN (Muja & Lowe, 2009) mengorbankan kepastian absolut demi efisiensi komputasional dramatis dengan mencari tetangga terdekat perkiraan (*Approximate Nearest Neighbor* / ANN) melalui struktur indeks ruang:
1. **Randomized KD-Trees**: Untuk ruang metrik kontinu (seperti deskriptor float SIFT/SURF), FLANN membangun sekumpulan $T$ pohon pembagi ruang (*multiple randomized kd-trees*, biasanya $T = 4 - 8$). Setiap pohon membagi ruang fitur secara ortogonal pada dimensi yang dipilih secara acak dari sejumlah dimensi teratas dengan varians terbesar. Pengacakan ini secara efektif menembus jebakan dimensi tinggi (*curse of dimensionality*).
2. **Hierarchical K-Means Tree**: Mengelompokkan vektor ke dalam pohon kluster bertingkat dengan faktor percabangan $K$ (*branching factor*).
3. **Pencarian Terpandu Prioritas (*Priority Queue Search*)**: Eksplorasi melintasi seluruh pohon dilakukan secara simultan menggunakan satu antrean prioritas tunggal terpusat. Parameter `checks` (misal 32 atau 64) membatasi jumlah daun (*leaf nodes*) maksimum yang dievaluasi sebelum algoritma menghentikan penelusuran.

Melalui pendekatan berindeks ini, kompleksitas pencarian tereduksi menjadi $\mathcal{O}(N \log M)$, memberikan percepatan $10\times$ hingga $100\times$ lipat dengan mengorbankan akurasi kurang dari $1-2\%$, yang kemudian dapat ditoleransi secara sempurna oleh algoritma estimasi geometri robust RANSAC."""

c6_2_code = r"""import numpy as np

def brute_force_knn_search(query_descs: np.ndarray, database_descs: np.ndarray, k: int = 2):
    '''Pencarian Brute-Force Exact k-Nearest Neighbors.'''
    matches = []
    for q in query_descs:
        # Hitung jarak Euclidean ke seluruh basis data
        dists = np.sqrt(np.sum((database_descs - q) ** 2, axis=1))
        # Dapatkan k indeks terdekat
        nearest_indices = np.argsort(dists)[:k]
        matches.append([(idx, dists[idx]) for idx in nearest_indices])
    return matches

# Simulasikan Basis Data Deskriptor SIFT 128D: N=20 Query, M=500 Database
np.random.seed(42)
N, M, D = 20, 500, 128
query_set = np.random.randn(N, D).astype(np.float32)
query_set /= np.linalg.norm(query_set, axis=1, keepdims=True)

db_set = np.random.randn(M, D).astype(np.float32)
db_set /= np.linalg.norm(db_set, axis=1, keepdims=True)

# Eksekusi Brute Force Matching k=2
knn_results = brute_force_knn_search(query_set, db_set, k=2)
total_pairs = N * M

print("--- Hasil Pencocokan Fitur Brute-Force k-NN ---")
print(f"Jumlah Query: {N} titik | Ukuran Basis Data: {M} titik | Dimensi: {D}")
print(f"Total Pasangan Vektor Dievaluasi: {total_pairs:,} pasangan")
print(f"Contoh Hasil Query 1:")
print(f"  Tetangga Terdekat 1: Indeks={knn_results[0][0][0]}, Jarak={knn_results[0][0][1]:.4f}")
print(f"  Tetangga Terdekat 2: Indeks={knn_results[0][1][0]}, Jarak={knn_results[0][1][1]:.4f}")
"""

c6_2_pitfalls = [
    "Menggunakan indeks randomized kd-tree FLANN untuk deskriptor biner (ORB); untuk deskriptor biner, parameter FLANN wajib disetel ke `LshIndexParams` (Locality Sensitive Hashing) dengan metrik `cv2.NORM_HAMMING`.",
    "Mengasumsikan pencarian FLANN selalu deterministik 100%; karena memanfaatkan pohon teracak (*randomized trees*), dua kali eksekusi dengan seed berbeda dapat menghasilkan urutan tetangga perkiraan yang sedikit berbeda.",
    "Membangun indeks FLANN baru pada setiap frame dalam video beruntun alih-alih mempertahankan indeks pohon yang sudah dibuat (*index reuse*)."
]

c6_2_refs = [
    {
        "title": "Fast Approximate Nearest Neighbors with Automatic Algorithm Configuration",
        "authors": ["Marius Muja", "David G. Lowe"],
        "year": 2009,
        "publisherOrVenue": "International Conference on Computer Vision Theory and Applications (VISAPP)",
        "url": "https://doi.org/10.5220/0001787503310340",
        "relevance": "Paper kanonikal pustaka FLANN untuk pencarian tetangga terdekat berkecepatan tinggi."
    }
]

c6_2_quiz = {
    "question": "Mengapa pustaka FLANN (Fast Library for Approximate Nearest Neighbors) lebih disukai dibanding Brute-Force Matcher dalam sistem visi waktu-nyata dengan puluhan ribu titik fitur?",
    "options": [
        "Karena FLANN sepenuhnya mengeliminasi kebutuhan ruang memori RAM.",
        "Karena FLANN mereduksi kompleksitas pencarian dari O(N * M) menjadi O(N log M) melalui struktur pohon terindeks (Randomized KD-Trees atau Hierarchical K-Means), mempercepat waktu eksekusi secara dramatis.",
        "Karena FLANN menjamin kecocokan 100% tanpa ada kesalahan perkiraan.",
        "Karena FLANN hanya dapat dijalankan pada kamera pengawas beresolusi rendah."
    ],
    "correctAnswerIndex": 1,
    "explanation": "Brute-Force Matcher melakukan perbandingan lengkap exhaustif dengan kompleksitas O(N*M), yang sangat lambat pada skala besar. FLANN membangun struktur data indeks (seperti kumpulan KD-Tree acak) yang memangkas ruang pencarian menjadi O(N log M) secara perkiraan (approximate)."
}

subchapters.append(create_subchapter("computer-vision-ch6-sub2", "6.2. Brute-Force Matcher vs FLANN (Fast Library for Approximate Nearest Neighbors)", c6_2_desc, c6_2_md, c6_2_code, c6_2_pitfalls, c6_2_refs, c6_2_quiz))

# ==============================================================================
# SUBCHAPTER 6.3: Rasio Uji Jarak Lowe (Lowe's Ratio Test)
# ==============================================================================
c6_3_desc = "Formulasi rasio uji jarak terdekat pertama terhadap kedua (d1/d2 < threshold) karya David Lowe untuk eliminasi pasangan fitur ambigu dan repetitif."
c6_3_md = r"""Pencocokan tetangga terdekat sederhana (*global nearest neighbor*) sering menghasilkan kecocokan palsu (*false positive*) ketika suatu fitur visual berada di area tekstur repetitif (seperti kisi jendela gedung, paving jalan) atau latar belakang visual berderau (*clutter*). Ambang batas jarak absolut tunggal ($d < \theta$) terbukti tidak efektif karena beberapa fitur visual memiliki variabilitas pencahayaan intrakelas yang jauh lebih tinggi daripada fitur lainnya.

### 1. Formulasi Matematika Uji Rasio Lowe
David Lowe (2004) memecahkan masalah ambiguitas ini melalui perancangan **Distance Ratio Test**. Alih-alih menggunakan ambang batas jarak absolut, Lowe mengevaluasi rasio jarak relatif antara kandidat tetangga terdekat pertama ($d_1$) dan tetangga terdekat kedua ($d_2$) di dalam ruang fitur:

$$\text{Rasio} = \frac{d_1(\mathbf{q}, \mathbf{p}_{\text{best}})}{d_2(\mathbf{q}, \mathbf{p}_{\text{second}})} = \frac{\|\mathbf{q} - \mathbf{p}_{\text{best}}\|_2}{\|\mathbf{q} - \mathbf{p}_{\text{second}}\|_2} < \tau$$

Di mana:
- $\mathbf{q}$ adalah vektor deskriptor dari citra permintaan (*query*),
- $\mathbf{p}_{\text{best}}$ adalah vektor tetangga terdekat pertama dalam basis data (jarak $d_1$),
- $\mathbf{p}_{\text{second}}$ adalah vektor tetangga terdekat kedua dalam basis data (jarak $d_2$),
- $\tau \in [0.7, 0.8]$ adalah ambang batas diskriminasi (*Lowe's threshold*).

### 2. Landasan Probabilistik dan Analisis Kurva ROC
Landasan teoretis dari uji rasio ini berakar pada distribusi probabilitas ruang dimensi tinggi:
- **Kecocokan Sejati (*Correct Match*)**: Fitur visual yang unik hanya memiliki satu padanan fisik yang benar di citra target ($d_1$ sangat kecil). Padanan kedua terdekat ($\mathbf{p}_{\text{second}}$) adalah fitur acak di latar belakang yang berjarak jauh ($d_2 \gg d_1$). Akibatnya, nilai rasio $d_1 / d_2$ berada pada rentang rendah ($0.2 - 0.6$).
- **Kecocokan Ambigu / Palsu (*Ambiguous / Spurious Match*)**: Jika fitur query berasal dari pola kisi repetitif atau area tanpa tekstur pembeda, ruang fitur akan dipadati oleh banyak kandidat yang memiliki jarak hampir identik ($d_1 \approx d_2$). Dalam kondisi ini, rasio $d_1 / d_2$ mendekati $1.0$ (misalnya $0.90 - 0.98$).

Berdasarkan analisis empiris kurva karakteristik operasi penerima (*Receiver Operating Characteristic* / ROC) oleh Lowe (2004), menetapkan ambang batas $\tau = 0.75 - 0.80$ berhasil memotong lebih dari $90\%$ pasangan korespondensi palsu, sementara mempertahankan lebih dari $95\%$ pasangan inlier sejati. Prinsip ini menjadi penyaring awal paling krusial sebelum data diumpankan ke estimator geometri RANSAC."""

c6_3_code = r"""import numpy as np

def apply_lowes_ratio_test(knn_matches, threshold: float = 0.75):
    '''Menyaring kecocokan k-NN (k=2) menggunakan Lowe's Ratio Test.'''
    good_matches = []
    for m in knn_matches:
        if len(m) >= 2:
            d1 = m[0][1] # Jarak ke tetangga ke-1
            d2 = m[1][1] # Jarak ke tetangga ke-2
            if d2 > 0 and (d1 / d2) < threshold:
                good_matches.append((m[0][0], d1, d2, d1 / d2))
    return good_matches

# Simulasikan hasil k-NN (k=2) untuk 5 query:
# Format: [[(idx1, d1), (idx2, d2)], ...]
simulated_knn = [
    [ (101, 0.21), (305, 0.88) ],  # Rasio: 0.21/0.88 = 0.238 -> Kecocokan Unik Sangat Kuat
    [ (42,  0.65), (189, 0.69) ],  # Rasio: 0.65/0.69 = 0.942 -> Pola Repetitif / Ambigu
    [ (214, 0.35), (88,  0.72) ],  # Rasio: 0.35/0.72 = 0.486 -> Kecocokan Valid
    [ (12,  0.58), (99,  0.61) ],  # Rasio: 0.58/0.61 = 0.950 -> Derau Ambigu
    [ (512, 0.29), (411, 0.45) ]   # Rasio: 0.29/0.45 = 0.644 -> Kecocokan Valid
]

threshold = 0.75
valid_matches = apply_lowes_ratio_test(simulated_knn, threshold=threshold)

print("--- Evaluasi Penyaringan Lowe's Ratio Test ---")
print(f"Total Pasangan Awal: {len(simulated_knn)} kandidat | Threshold Tau: {threshold}")
print(f"Jumlah Pasangan Lolos Seleksi: {len(valid_matches)}")
for i, m in enumerate(valid_matches):
    print(f"  Match Lolos #{i+1}: Indeks DB={m[0]}, d1={m[1]:.2f}, d2={m[2]:.2f}, Rasio={m[3]:.3f}")
"""

c6_3_pitfalls = [
    "Menggunakan uji rasio Lowe langsung pada deskriptor biner dengan rentang diskrit kecil tanpa penyesuaian threshold (pada Hamming distance, ambang batas rasio sering disesuaikan ke ~0.8-0.85).",
    "Hanya meminta $k=1$ tetangga dari matcher saat berencana menerapkan uji rasio; uji rasio Lowe mutlak membutuhkan minimal $k=2$ tetangga terdekat.",
    "Menyetel threshold terlalu ketat ($\tau \le 0.5$) yang membuang terlalu banyak inlier valid pada citra dengan variasi sudut pandang signifikan."
]

c6_3_refs = [
    {
        "title": "Distinctive Image Features from Scale-Invariant Keypoints",
        "authors": ["David G. Lowe"],
        "year": 2004,
        "publisherOrVenue": "International Journal of Computer Vision (IJCV)",
        "url": "https://doi.org/10.1023/B:VISI.0000029664.99615.94",
        "relevance": "Halaman 104-105: Rasio jarak tetangga terdekat pertama dan kedua untuk penolakan false matches."
    }
]

c6_3_quiz = {
    "question": "Apa intuisi matematika di balik penggunaan Lowe's Ratio Test (d1 / d2 < tau) pada pencocokan fitur lokal?",
    "options": [
        "Untuk memastikan bahwa citra input telah dikonversi ke domain frekuensi Fourier.",
        "Untuk menolak fitur ambigu atau repetitif, karena fitur visual yang unik dan benar memiliki tetangga terdekat pertama yang jauh lebih dekat dibanding tetangga kedua (d1 << d2).",
        "Untuk memaksa jumlah titik fitur menjadi genap.",
        "Untuk memperbesar skala deskriptor menjadi dua kali lipat."
    ],
    "correctAnswerIndex": 1,
    "explanation": "Pada pola repetitif atau latar berderau, jarak ke tetangga terdekat pertama ($d_1$) dan kedua ($d_2$) hampir sama besar ($d_1 / d_2 \\approx 1$). Sebaliknya, titik fitur unik sejati memiliki padanan yang sangat dominan ($d_1 \\ll d_2$), sehingga rasio $d_1/d_2 < 0.75$ secara efektif mengeliminasi 90% pasangan ambigu."
}

subchapters.append(create_subchapter("computer-vision-ch6-sub3", "6.3. Rasio Uji Jarak Lowe (Lowe's Ratio Test)", c6_3_desc, c6_3_md, c6_3_code, c6_3_pitfalls, c6_3_refs, c6_3_quiz))

# ==============================================================================
# SUBCHAPTER 6.4: Cross-Checking
# ==============================================================================
c6_4_desc = "Mekanisme Cross-Checking (pencocokan konsistensi timbal balik dua arah) f(A)=B dan f(B)=A untuk eliminasi korespondensi asimetris."
c6_4_md = r"""Metode pelengkap uji rasio Lowe untuk menjamin keaslian dan kemurnian pasangan korespondensi adalah **Cross-Checking** atau **Pencocokan Konsistensi Timbal Balik (*Mutual Consistency Check*)**.

### 1. Prinsip Formulasi Simetris dan Pemetaan Bijektif
Pencocokan satu arah standar (*forward matching*) bersifat asimetris: jika fitur $\mathbf{a}_i$ pada Citra 1 ($\mathcal{I}_1$) memiliki tetangga terdekat $\mathbf{b}_j$ pada Citra 2 ($\mathcal{I}_2$), tidak ada jaminan bahwa tetangga terdekat dari $\mathbf{b}_j$ adalah $\mathbf{a}_i$. Sering kali, $\mathbf{b}_j$ memiliki tetangga terdekat lain $\mathbf{a}_k$ pada Citra 1 yang memiliki kemiripan lebih tinggi, sehingga asosiasi $\mathbf{a}_i \to \mathbf{b}_j$ bersifat semu (*one-way spurious match*).

Sebuah pasangan korespondensi $(\mathbf{a}_i, \mathbf{b}_j)$ dinyatakan valid di bawah aturan Cross-Checking jika dan hanya jika memenuhi relasi bijektif timbal-balik (*mutual nearest neighbor*):

$$\operatorname{Match}_{1 \to 2}(\mathbf{a}_i) = \arg\min_{\mathbf{b} \in \mathcal{I}_2} \|\mathbf{a}_i - \mathbf{b}\| = \mathbf{b}_j$$
$$\operatorname{Match}_{2 \to 1}(\mathbf{b}_j) = \arg\min_{\mathbf{a} \in \mathcal{I}_1} \|\mathbf{b}_j - \mathbf{a}\| = \mathbf{a}_i$$

Secara formal logika predikat:
$$\operatorname{Valid}(\mathbf{a}_i, \mathbf{b}_j) \iff \left( \operatorname{Match}_{1 \to 2}(\mathbf{a}_i) = \mathbf{b}_j \right) \wedge \left( \operatorname{Match}_{2 \to 1}(\mathbf{b}_j) = \mathbf{a}_i \right)$$

### 2. Hubungan dengan Lowe's Ratio Test dan Praktik Rekayasa
Dalam implementasi praktis (seperti `cv2.BFMatcher(crossCheck=True)`):
1. **Penerapan pada Deskriptor Biner**: Cross-Checking sangat efektif dan banyak diadopsi untuk deskriptor biner (seperti ORB, BRIEF, dan BRISK). Pada deskriptor biner, Jarak Hamming memiliki resolusi nilai diskrit terbatas ($0, 1, 2, \dots, 256$), yang menyebabkan uji rasio Lowe terkadang sulit dikalibrasi karena penyebut $d_2$ kerap sama persis dengan $d_1$ tanpa selisih kontinu.
2. **Keterbatasan Komputasional**: Cross-Checking membutuhkan dua kali pencarian terpisah: pencarian maju ($N$ query terhadap basis data $M$) dan pencarian mundur ($M$ query terhadap basis data $N$), melipatgandakan beban waktu komputasi jika tidak dihitung melalui matriks jarak berpasangan terpadu.
3. **Sinergi dengan RANSAC**: Meskipun Cross-Checking memangkas sebagian besar korespondensi asimetris, metode ini beroperasi secara murni pada ruang deskriptor lokal fotometrik. Verifikasi geometri global menggunakan RANSAC tetap mutlak diperlukan untuk membuang pencilan yang lolos seleksi Cross-Checking."""

c6_4_code = r"""import numpy as np

def cross_check_matching(descs1: np.ndarray, descs2: np.ndarray):
    '''Implementasi mandiri algoritma Mutual Best Match (Cross-Checking).'''
    # Matriks jarak berpasangan (N x M)
    diff = descs1[:, np.newaxis, :] - descs2[np.newaxis, :, :]
    dist_matrix = np.sqrt(np.sum(diff ** 2, axis=2))
    
    # 1. A -> B: Untuk setiap titik di citra 1, cari indeks terdekat di citra 2
    forward_matches = np.argmin(dist_matrix, axis=1) # shape: (N,)
    
    # 2. B -> A: Untuk setiap titik di citra 2, cari indeks terdekat di citra 1
    backward_matches = np.argmin(dist_matrix, axis=0) # shape: (M,)
    
    # 3. Verifikasi Konsistensi Timbal Balik: i == backward_matches[forward_matches[i]]
    mutual_matches = []
    for i, j in enumerate(forward_matches):
        if backward_matches[j] == i:
            mutual_matches.append((i, j, dist_matrix[i, j]))
            
    return mutual_matches, forward_matches

# Simulasikan 5 titik fitur pada Citra 1 dan 5 titik fitur pada Citra 2
np.random.seed(42)
descs_img1 = np.random.randn(5, 16)
descs_img2 = np.random.randn(5, 16)

# Sengaja buat titik indeks 0 dan 1 saling berpasangan kuat
descs_img2[0] = descs_img1[0] + 0.05
descs_img2[1] = descs_img1[1] + 0.08

mutual, fwd = cross_check_matching(descs_img1, descs_img2)

print("--- Hasil Pencocokan Cross-Checking ---")
print(f"Kandidat Pencocokan Satu Arah (A -> B)  : {list(enumerate(fwd))}")
print(f"Pasangan Lolos Konsistensi Dua Arah   : {[(m[0], m[1]) for m in mutual]}")
print(f"Jumlah Tereliminasi Akibat Asimetris  : {len(descs_img1) - len(mutual)}")
"""

c6_4_pitfalls = [
    "Menyalakan `crossCheck=True` pada OpenCV BFMatcher saat menggunakan fungsi `knnMatch(k=2)`; OpenCV akan melempar pengecualian karena cross-check secara internal hanya dirancang untuk `match()` satu-ke-satu.",
    "Mengasumsikan Cross-Check sepenuhnya menggantikan RANSAC; Cross-Check hanya menyaring ketidakkonsistenan deskriptor lokal dan tidak memverifikasi keselarasan geometri global.",
    "Biaya komputasi memori meningkat dua kali lipat karena matriks jarak harus dievaluasi atau dicari secara dua arah ($A \to B$ dan $B \to A$)."
]

c6_4_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 7.1.3: Mutual consistency check and asymmetric matching elimination."
    }
]

c6_4_quiz = {
    "question": "Kondisi apakah yang harus dipenuhi agar pasangan titik fitur (A_i, B_j) dinyatakan lolos seleksi Cross-Checking?",
    "options": [
        "Jarak Euclidean antara A_i dan B_j harus bernilai tepat nol.",
        "Tetangga terdekat dari A_i pada citra kedua adalah B_j, DAN tetangga terdekat dari B_j pada citra pertama haruslah A_i.",
        "Titik A_i dan B_j harus memiliki koordinat piksel spasial yang identik.",
        "Jumlah bit 1 pada deskriptor A_i harus sama dengan jumlah bit 0 pada B_j."
    ],
    "correctAnswerIndex": 1,
    "explanation": "Cross-checking menegakkan aturan konsistensi timbal balik (mutual consistency): $f(A_i) = B_j$ dan $f(B_j) = A_i$. Jika relasi tersebut asimetris (misal tetangga terdekat $B_j$ adalah $A_k$ dengan $k \\neq i$), pasangan tersebut ditolak sebagai pasangan spurious."
}

subchapters.append(create_subchapter("computer-vision-ch6-sub4", "6.4. Cross-Checking (Pencocokan Konsistensi Dua Arah)", c6_4_desc, c6_4_md, c6_4_code, c6_4_pitfalls, c6_4_refs, c6_4_quiz))

# ==============================================================================
# SUBCHAPTER 6.5: Masalah Outlier dalam Pencocokan Titik Korespondensi
# ==============================================================================
c6_5_desc = "Karakterisasi matematis pencilan (outliers), kegagalan fatal regresi kuadrat terkecil (Least Squares), breakdown point, dan perlunya estimasi robust."
c6_5_md = r"""Meskipun telah melalui penyaringan selektif berbasis Lowe's Ratio Test dan Cross-Checking, kumpulan korespondensi fitur dalam skenario visi komputer dunia nyata hampir selalu masih terkontaminasi oleh **pencilan (*outliers*)** dalam proporsi yang signifikan (sering kali mencapai $20\% - 70\%$).

### 1. Sumber Munculnya Pencilan Fisik dalam Visi Komputer
Pencilan visual muncul dari fenomena optik dan geometri lingkungan nyata:
1. **Oklusi Parsial (*Partial Occlusion*)**: Objek pada Citra 1 terhalang oleh penghalang lain pada Citra 2, memaksa deskriptor mencocokkan pola latar belakang yang tidak berkorelasi.
2. **Kekeliruan Ambigu Tekstur Repetitif**: Fitur pada satu ubin lantai atau jendela gedung dicocokkan dengan ubin lantai atau jendela yang secara visual identik namun berada pada posisi spasial yang salah.
3. **Disparitas Parallax Kedalaman (*Depth Parallax*)**: Objek latar depan (*foreground*) dan latar belakang (*background*) mengalami pergeseran proyektif yang berbeda jika kamera mengalami translasi fisik, melanggar asumsi homografi bidang datar tunggal.
4. **Variasi Pencahayaan Non-Lambertian**: Refleksi spekular dan bayangan bergerak merusak kesamaan fotometrik deskriptor lokal.

### 2. Kerapuhan Fatal Kuadrat Terkecil (*The Fragility of Least Squares*)
Metode estimasi parametrik konvensional seperti regresi Kuadrat Terkecil (*Ordinary Least Squares* / OLS) meminimalkan jumlah kuadrat residual dari seluruh data secara serentak:

$$\min_{\mathbf{\theta}} \sum_{i=1}^{N} r_i(\mathbf{\theta})^2 = \min_{\mathbf{\theta}} \sum_{i=1}^{N} \|\mathbf{y}_i - f(\mathbf{x}_i; \mathbf{\theta})\|_2^2$$

Karena fungsi penalti penyesuaian model bersifat kuadratik ($r^2$), sebuah pencilan tunggal ekstrem yang memiliki residual besar ($r_i = 500$ piksel) akan memberikan bobot penalti sebesar $250.000$, mendominasi fungsi objektif dan menarik model estimasi menjauh secara drastis dari parameter sejati.

Dalam teori statistik tangguh (*Robust Statistics*), kerapuhan ini diukur melalui **Breakdown Point** ($\epsilon^*$), yaitu proporsi terkecil data pencilan yang dapat merusak estimator hingga menghasilkan nilai tak terbatas. Kuadrat Terkecil memiliki titik hancur nol:

$$\epsilon^*_{\text{OLS}} = \frac{1}{N} \xrightarrow[N \to \infty]{} 0\%$$

Satu pencilan ekstrem saja sudah cukup untuk menggagalkan estimasi matriks transformasi afina atau homografi proyektif. Oleh karena itu, estimasi geometri dalam visi komputer mutlak memerlukan estimator yang memiliki titik hancur tinggi ($\epsilon^* \approx 50\%$), seperti RANSAC."""

c6_5_code = r"""import numpy as np

# 1. Bangun Data Garis Sejati: y = 2.0 * x + 5.0 (8 Inliers Sejati)
np.random.seed(42)
x_inliers = np.linspace(0, 10, 8)
y_inliers = 2.0 * x_inliers + 5.0 + np.random.normal(0, 0.2, 8)

# 2. Tambahkan 2 Pencilan Ekstrem (Outliers Parah akibat salah cocok)
x_outliers = np.array([3.0, 7.0])
y_outliers = np.array([45.0, -20.0])  # Deviasi masif dari garis y = 2x + 5

x_all = np.concatenate([x_inliers, x_outliers])
y_all = np.concatenate([y_inliers, y_outliers])

# 3. Fitting Kuadrat Terkecil (Least Squares) pada Seluruh Data (Terkontaminasi)
A_all = np.vstack([x_all, np.ones(len(x_all))]).T
m_ls, c_ls = np.linalg.lstsq(A_all, y_all, rcond=None)[0]

# 4. Fitting Kuadrat Terkecil hanya pada Inliers Sejati
A_in = np.vstack([x_inliers, np.ones(len(x_inliers))]).T
m_true, c_true = np.linalg.lstsq(A_in, y_inliers, rcond=None)[0]

print("--- Demonstrasi Kerentanan Fatal Kuadrat Terkecil terhadap Outliers ---")
print(f"Jumlah Titik: {len(x_inliers)} Inliers + {len(x_outliers)} Outliers = {len(x_all)} Total")
print(f"Parameter Garis Ideal (Inliers Saja) : Kemiringan m={m_true:.2f}, Intercept c={c_true:.2f}")
print(f"Hasil Fitting Kuadrat Terkecil (LS)   : Kemiringan m={m_ls:.2f}, Intercept c={c_ls:.2f}")
print(f"Deviasi Galat Kemiringan Akibat 2 Outliers: {abs(m_ls - m_true):.2f} (Model Rusak Total)")
"""

c6_5_pitfalls = [
    "Mencoba menghitung homografi langsung menggunakan `cv2.findHomography` tanpa menyertakan flag robust `cv2.RANSAC` atau `cv2.USAC_MAGSAC`.",
    "Mengasumsikan bahwa menambah jumlah pasangan fitur akan 'merata-ratakan' kesalahan pencilan; kuadrat terkecil tetap gagal berapapun jumlah datanya jika rasio outlier signifikan.",
    "Menghapus pencilan secara manual berdasarkan nilai residual dari model kuadrat terkecil awal (metode ini gagal karena model awal sudah ditarik condong ke arah outlier, sehingga inlier sejati justru bisa memiliki residual tinggi)."
]

c6_5_refs = [
    {
        "title": "Robust Statistics (2nd ed.)",
        "authors": ["Peter J. Huber", "Elvezio M. Ronchetti"],
        "year": 2009,
        "publisherOrVenue": "John Wiley & Sons",
        "url": "https://doi.org/10.1002/9780470434697",
        "relevance": "Landasan teori statistik robust dan breakdown point estimator kuadrat terkecil."
    }
]

c6_5_quiz = {
    "question": "Mengapa regresi Kuadrat Terkecil (Least Squares) memiliki Breakdown Point mendekati 0% terhadap data yang mengandung pencilan (outliers)?",
    "options": [
        "Karena kuadrat terkecil hanya dapat memproses matriks singular berdimensi ganjil.",
        "Karena fungsi penalti kuadratik (residual pangkat dua) memberikan bobot tak terhingga besar pada pencilan ekstrem, sehingga satu pencilan saja mampu menarik parameter model menjauh dari solusi sejati.",
        "Karena algoritma kuadrat terkecil membutuhkan GPU berkemampuan khusus.",
        "Karena pencilan secara otomatis mengubah tipe data dari float menjadi integer."
    ],
    "correctAnswerIndex": 1,
    "explanation": "Pada Least Squares, penalti residual dihitung secara kuadratis ($r^2$). Sebuah pencilan dengan residual besar mendominasi total akumulasi galat dan memaksa garis/model membengkok ekstrem ke arah titik tersebut demi memperkecil residual kuadratnya, menghasilkan breakdown point teoritis sebesar 0%."
}

subchapters.append(create_subchapter("computer-vision-ch6-sub5", "6.5. Masalah Outlier dalam Pencocokan Titik Korespondensi", c6_5_desc, c6_5_md, c6_5_code, c6_5_pitfalls, c6_5_refs, c6_5_quiz))

# ==============================================================================
# SUBCHAPTER 6.6: Algoritma RANSAC (RANdom SAmple Consensus)
# ==============================================================================
c6_6_desc = "Paradigma algoritma RANSAC (Fischler & Bolles, 1981), himpunan sampel minimal (MSS), penghitungan residual model, dan pembentukan himpunan konsensus inlier."
c6_6_md = r"""Untuk mengatasi kerapuhan kuadrat terkecil terhadap pencilan, Martin A. Fischler dan Robert C. Bolles (1981) memperkenalkan **RANSAC (RANdom SAmple Consensus)**. Berbeda dengan pendekatan fitting konvensional yang menggunakan seluruh data sekaligus, RANSAC beroperasi dengan prinsip terbalik: **memulai dari himpunan sampel data seminimal mungkin, lalu mengumpulkan konsensus dukungan**.

### 1. Siklus Empat Tahap Algoritma RANSAC
Diberikan himpunan data $\mathcal{P}$ dengan proporsi pencilan tinggi:
1. **Sampling Minimal (*Minimal Sample Set* / MSS)**:
   Pilih secara acak sejumlah $s$ titik sampel terkecil yang cukup untuk menentukan parameter model secara unik (misal: $s = 2$ untuk garis 2D, $s = 4$ untuk homografi planar 2D, $s = 8$ untuk matriks fundamental epipolar).
2. **Estimasi Model Hipotesis**:
   Hitung parameter model hipotesis $\mathcal{M}$ dari $s$ titik sampel acak tersebut.
3. **Evaluasi Konsensus Inliers**:
   Hitung residual galat $r_i$ untuk **seluruh data** terhadap model $\mathcal{M}$. Titik yang memenuhi $|r_i| \le \delta$ (ambang batas jarak inlier) dimasukkan ke dalam **himpunan konsensus** (*Consensus Set* $\mathcal{S}_{\text{in}}$).
4. **Pembaruan Model Terbaik**:
   Jika ukuran himpunan konsensus $|\mathcal{S}_{\text{in}}|$ lebih besar dari rekor model terbaik sejauh ini, simpan $\mathcal{M}$ sebagai model terbaik.

### 2. Refitting Akhir (*Final Model Re-estimation*)
Setelah seluruh $N$ iterasi selesai, model parameter final diestimasi ulang menggunakan seluruh inlier yang terkumpul dalam himpunan konsensus terbaik menggunakan Kuadrat Terkecil standar, menghasilkan akurasi sub-piksel optimal tanpa pengaruh outlier."""

c6_6_code = r"""import numpy as np

def simple_ransac_line(x: np.ndarray, y: np.ndarray, num_iterations: int = 100, threshold: float = 0.5):
    '''Implementasi dasar algoritma RANSAC untuk estimasi garis 2D.'''
    best_inliers = []
    best_model = (0.0, 0.0) # (m, c)
    n_points = len(x)
    
    for _ in range(num_iterations):
        # 1. Pilih Minimal Sample Set (MSS): s=2 titik acak
        idx = np.random.choice(n_points, size=2, replace=False)
        x1, y1 = x[idx[0]], y[idx[0]]
        x2, y2 = x[idx[1]], y[idx[1]]
        
        if abs(x2 - x1) < 1e-6:
            continue # Hindari pembagian dengan nol (garis vertikal)
            
        # 2. Estimasi Model Hipotesis: y = m*x + c
        m = (y2 - y1) / (x2 - x1)
        c = y1 - m * x1
        
        # 3. Hitung Residual Jarak Ortogonal/Vertikal ke Model
        residuals = np.abs(y - (m * x + c)) / np.sqrt(1 + m**2)
        
        # 4. Tentukan Himpunan Konsensus Inliers
        inliers = np.where(residuals <= threshold)[0]
        
        if len(inliers) > len(best_inliers):
            best_inliers = inliers
            best_model = (m, c)
            
    # 5. Refit Model Menggunakan Seluruh Inliers Konsensus Terbaik
    if len(best_inliers) >= 2:
        A = np.vstack([x[best_inliers], np.ones(len(best_inliers))]).T
        m_refit, c_refit = np.linalg.lstsq(A, y[best_inliers], rcond=None)[0]
        return m_refit, c_refit, best_inliers
    return best_model[0], best_model[1], best_inliers

# Jalankan RANSAC pada data garis ber-outliers dari subbab sebelumnya
np.random.seed(42)
x_inliers = np.linspace(0, 10, 8)
y_inliers = 2.0 * x_inliers + 5.0 + np.random.normal(0, 0.1, 8)
x_all = np.concatenate([x_inliers, [3.0, 7.0]])
y_all = np.concatenate([y_inliers, [45.0, -20.0]])

m_ransac, c_ransac, inliers = simple_ransac_line(x_all, y_all, num_iterations=50, threshold=0.5)

print("--- Hasil Estimasi Robust Garis Menggunakan RANSAC ---")
print(f"Jumlah Titik Masukan  : {len(x_all)} (8 Inliers + 2 Outliers)")
print(f"Inliers Teridentifikasi: {len(inliers)} dari 10 titik (Indeks: {inliers.tolist()})")
print(f"Parameter Garis RANSAC: Kemiringan m={m_ransac:.2f}, Intercept c={c_ransac:.2f}")
print("Kesimpulan: RANSAC sepenuhnya mengabaikan pencilan ekstrem dan memulihkan parameter sejati!")
"""

c6_6_pitfalls = [
    "Menyetel nilai ambang batas inlier threshold terlalu longgar, meloloskan pencilan ke dalam himpunan konsensus; atau terlalu ketat sehingga inlier berderau sensor wajar ikut terbuang.",
    "Menggunakan seluruh inlier yang ditemukan langsung tanpa melakukan *refitting* kuadrat terkecil akhir; model sampel minimal hanya memiliki akurasi dari 2 titik acak.",
    "Memilih ukuran sampel acak yang lebih besar dari Minimal Sample Set ($s > s_{\\text{min}}$); menambah titik sampel secara eksponensial menurunkan peluang terpilihnya sampel yang bebas pencilan."
]

c6_6_refs = [
    {
        "title": "Random Sample Consensus: A Paradigm for Model Fitting with Applications to Image Analysis and Automated Cartography",
        "authors": ["Martin A. Fischler", "Robert C. Bolles"],
        "year": 1981,
        "publisherOrVenue": "Communications of the ACM (CACM)",
        "url": "https://doi.org/10.1145/358669.358692",
        "relevance": "Paper orisinal penemuan algoritma RANSAC dan formulasi konsensus himpunan minimal."
    }
]

c6_6_quiz = {
    "question": "Mengapa ukuran himpunan sampel awal (Minimal Sample Set / MSS) pada algoritma RANSAC harus dibatasi sekecil mungkin (misal s=4 untuk homografi)?",
    "options": [
        "Karena GPU tidak dapat memproses matriks dengan ukuran lebih dari 4.",
        "Karena semakin sedikit jumlah titik sampel yang diambil acak, semakin tinggi peluang matematis bahwa seluruh titik dalam sampel tersebut bebas dari kontaminasi pencilan (outliers).",
        "Untuk memperkecil nilai ambang batas inlier.",
        "Karena RANSAC hanya dapat bekerja pada himpunan data bilangan genap."
    ],
    "correctAnswerIndex": 1,
    "explanation": "Peluang memilih sampel yang bebas pencilan adalah $(1 - e)^s$, di mana $e$ adalah rasio pencilan dan $s$ adalah ukuran sampel. Semakin besar $s$, peluang tersebut merosot tajam secara eksponensial, sehingga $s$ wajib disetel ke batas minimal absolut yang dibutuhkan untuk mengestimasi parameter model."
}

subchapters.append(create_subchapter("computer-vision-ch6-sub6", "6.6. Algoritma RANSAC (RANdom SAmple Consensus - Fischler & Bolles)", c6_6_desc, c6_6_md, c6_6_code, c6_6_pitfalls, c6_6_refs, c6_6_quiz))

# ==============================================================================
# SUBCHAPTER 6.7: Perhitungan Jumlah Iterasi RANSAC Teoretis
# ==============================================================================
c6_7_desc = "Formulasi analitis jumlah iterasi adaptif RANSAC N = ln(1-p) / ln(1 - (1-e)^s) untuk menjamin konvergensi probabilistik bebas pencilan."
c6_7_md = r"""Berapa kali pengulangan iterasi sampling yang diperlukan agar kita yakin bahwa RANSAC telah menemukan himpunan konsensus yang benar? Fischler dan Bolles (1981) menurunkan batas analitis jumlah iterasi $N$.

### 1. Penurunan Rumus Probabilistik
Misalkan:
- $s$ adalah ukuran sampel minimal (*Minimal Sample Set*),
- $e$ adalah rasio pencilan (*outlier ratio*), sehingga $w = 1 - e$ adalah rasio inliers,
- $p$ adalah probabilitas keberhasilan yang diinginkan (misal $p = 0.99$ untuk kepastian $99\%$).

Peluang bahwa dalam satu kali pengambilan acak, **seluruh $s$ titik adalah inliers murni** adalah:
$$P(\text{sampel bersih}) = w^s = (1 - e)^s$$

Peluang bahwa dalam satu kali pengambilan, sampel terkontaminasi oleh **setidaknya satu pencilan** adalah:
$$P(\text{sampel kotor}) = 1 - (1 - e)^s$$

Peluang bahwa dalam **seluruh $N$ iterasi independen**, RANSAC selalu gagal mengambil sampel bersih adalah:
$$P(\text{selalu gagal dalam } N \text{ iterasi}) = \left( 1 - (1 - e)^s \right)^N$$

Kita menghendaki peluang kegagalan ini tidak melampaui $1 - p$:
$$\left( 1 - (1 - e)^s \right)^N \le 1 - p$$

Mengambil logaritma natural pada kedua sisi:
$$N \ln\left( 1 - (1 - e)^s \right) \le \ln(1 - p)$$

Karena $\ln(x) < 0$ untuk $x \in (0, 1)$, membagi dengan $\ln(1 - (1 - e)^s)$ membalik tanda pertidaksamaan:

$$N \ge \frac{\ln(1 - p)}{\ln\left( 1 - (1 - e)^s \right)}$$"""

c6_7_code = r"""import numpy as np

def calculate_ransac_iterations(p: float, s: int, e: float) -> int:
    '''Menghitung batas iterasi teoretis RANSAC: N = ln(1-p) / ln(1 - (1-e)^s).'''
    w = 1.0 - e
    prob_all_inliers = w ** s
    if prob_all_inliers <= 0:
        return int(1e6)
    numerator = np.log(1.0 - p)
    denominator = np.log(1.0 - prob_all_inliers)
    return int(np.ceil(numerator / denominator))

# Analisis Komparatif Kebutuhan Iterasi untuk Homografi (s = 4 titik)
# dengan keyakinan sukses p = 0.99 (99%) melintasi berbagai rasio outlier
outlier_ratios = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70]
s_homography = 4
p_confidence = 0.99

print(f"--- Kebutuhan Iterasi RANSAC untuk Estimasi Homografi (s={s_homography}, p={p_confidence}) ---")
print(f"{'Rasio Outlier (e)':<20} | {'Rasio Inlier (w)':<18} | {'Iterasi Minimum (N)':<20}")
print("-" * 62)
for e in outlier_ratios:
    n_iter = calculate_ransac_iterations(p_confidence, s_homography, e)
    print(f"{e * 100:<19.0f}% | {(1-e) * 100:<17.0f}% | {n_iter:<20,}")
"""

c6_7_pitfalls = [
    "Mengabaikan batas atas iterasi maksimum (*timeout cap*); jika citra tidak memiliki korespondensi yang cocok sama sekali ($e \\to 1.0$), rumus analitis akan menghasilkan $N \\to \\infty$ dan menyebabkan program mengalami infinite loop.",
    "Menggunakan nilai rasio inlier statis konstan; dalam RANSAC modern adaptif, estimasi $e$ diperbarui secara dinamis setiap kali ditemukan himpunan konsensus yang lebih besar.",
    "Mengasumsikan $p = 1.0$ mutlak; secara matematis $\\ln(1 - 1) = \\ln(0) = -\\infty$, sehingga nilai kepastian selalu disetel pada bilangan riil mendekati 1 seperti $0.99$ atau $0.999$."
]

c6_7_refs = [
    {
        "title": "Multiple View Geometry in Computer Vision (2nd ed.)",
        "authors": ["Richard Hartley", "Andrew Zisserman"],
        "year": 2004,
        "publisherOrVenue": "Cambridge University Press",
        "url": "https://doi.org/10.1017/CBO9780511811685",
        "relevance": "Bab 4.7: Robust estimation and RANSAC iteration bounds."
    }
]

c6_7_quiz = {
    "question": "Berapa banyak iterasi RANSAC yang dibutuhkan untuk mengestimasi homografi 4-titik (s=4) dengan tingkat keyakinan 99% (p=0.99) jika 50% korespondensi adalah pencilan (e=0.5)?",
    "options": [
        "12 iterasi",
        "72 iterasi",
        "1.200 iterasi",
        "10.000 iterasi"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Peluang sampel 4 titik seluruhnya inlier adalah $w^s = (1 - 0.5)^4 = (0.5)^4 = 0.0625$. Rumus $N = \\ln(1 - 0.99) / \\ln(1 - 0.0625) = \\ln(0.01) / \\ln(0.9375) \\approx -4.605 / -0.06453 \\approx 71.36$. Dibulatkan ke atas menjadi 72 iterasi."
}

subchapters.append(create_subchapter("computer-vision-ch6-sub7", "6.7. Perhitungan Jumlah Iterasi RANSAC Teoretis", c6_7_desc, c6_7_md, c6_7_code, c6_7_pitfalls, c6_7_refs, c6_7_quiz))

# ==============================================================================
# SUBCHAPTER 6.8: Estimasi Matriks Homografi 2D
# ==============================================================================
c6_8_desc = "Formulasi matematis Homografi Proyektif 3x3 (8 Derajat Kebebasan), algoritma Direct Linear Transformation (DLT) via SVD, dan evaluasi galat reproyeksi."
c6_8_md = r"""Dalam visi komputer multi-tampilan, transformasi antara dua citra bidang datar atau dua citra yang diambil oleh kamera yang berputar murni pada pusat optiknya dimodelkan secara tepat oleh **Homografi Proyektif Bidang Datar (*Planar Projective Homography*)**.

### 1. Formulasi Koordinat Homogen
Homografi adalah pemetaan proyektif linier antara koordinat homogen $\mathbf{x} = [x, y, 1]^T$ pada Citra 1 dan $\mathbf{x}' = [x', y', 1]^T$ pada Citra 2 melalui matriks non-singular $\mathbf{H} \in \mathbb{R}^{3 \times 3}$:

$$\mathbf{x}' \sim \mathbf{H} \mathbf{x} \iff \begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix} \sim \begin{bmatrix} h_{11} & h_{12} & h_{13} \\ h_{21} & h_{22} & h_{23} \\ h_{31} & h_{32} & h_{33} \end{bmatrix} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$$

Simbol $\sim$ melambangkan kesetaraan hingga faktor skala skalar tak-nol. Matriks $\mathbf{H}$ memiliki 9 elemen, namun karena faktor skala proyektif arbiter, $\mathbf{H}$ hanya memiliki **8 Derajat Kebebasan (DoF)**.

### 2. Algoritma Direct Linear Transformation (DLT)
Setiap pasang korespondensi titik $(x_i, y_i) \leftrightarrow (x'_i, y'_i)$ memberikan dua persamaan linier independen. Dengan mengeliminasi faktor skala melalui perkalian silang $\mathbf{x}'_i \times (\mathbf{H} \mathbf{x}_i) = \mathbf{0}$, diperoleh sistem persamaan:

$$\mathbf{A}_i \mathbf{h} = \mathbf{0}$$

$$\begin{bmatrix} -x_i & -y_i & -1 & 0 & 0 & 0 & x_i x'_i & y_i x'_i & x'_i \\ 0 & 0 & 0 & -x_i & -y_i & -1 & x_i y'_i & y_i y'_i & y'_i \end{bmatrix} \begin{bmatrix} h_{11} \\ \vdots \\ h_{33} \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$

Karena setiap pasangan memberikan 2 persamaan, **minimal diperlukan 4 pasangan titik korespondensi** ($4 \times 2 = 8$ persamaan) tanpa ada 3 titik yang segaris (*no 3 collinear points*). Untuk $N \ge 4$ titik, solusi vektor $\mathbf{h}$ diperoleh melalui Dekomposisi Nilai Singular (*Singular Value Decomposition* / SVD) dari matriks $\mathbf{A}$, yaitu vektor singular kanan yang bersesuaian dengan nilai singular terkecil."""

c6_8_code = r"""import numpy as np

def estimate_homography_dlt(pts_src: np.ndarray, pts_dst: np.ndarray) -> np.ndarray:
    '''Menghitung Matriks Homografi 3x3 menggunakan Direct Linear Transformation (DLT).'''
    N = pts_src.shape[0]
    A = []
    for i in range(N):
        x, y = pts_src[i, 0], pts_src[i, 1]
        xp, yp = pts_dst[i, 0], pts_dst[i, 1]
        A.append([-x, -y, -1, 0, 0, 0, x * xp, y * xp, xp])
        A.append([0, 0, 0, -x, -y, -1, x * yp, y * yp, yp])
    A = np.array(A, dtype=np.float64)
    
    # SVD: A = U * S * V^T. Solusi h adalah kolom terakhir dari V (baris terakhir V^T)
    _, _, Vt = np.linalg.svd(A)
    H = Vt[-1].reshape(3, 3)
    return H / H[2, 2] # Normalisasi skala elemen terakhir ke 1.0

# 4 Pasangan Titik Korespondensi Sintetis (Rotasi + Translasi + Skala Proyektif)
src_pts = np.array([[0, 0], [100, 0], [100, 100], [0, 100]], dtype=np.float32)
# Transformasikan ke bidang target
H_ground_truth = np.array([
    [1.2, 0.2, 50.0],
    [-0.1, 1.1, 30.0],
    [0.0005, 0.0002, 1.0]
])

# Proyeksikan src_pts menggunakan H_ground_truth
src_homo = np.hstack([src_pts, np.ones((4, 1))])
dst_homo = (H_ground_truth @ src_homo.T).T
dst_pts = dst_homo[:, :2] / dst_homo[:, 2:3]

# Hitung estimasi DLT
H_est = estimate_homography_dlt(src_pts, dst_pts)

print("--- Hasil Estimasi Matriks Homografi DLT ---")
print("Matriks Ground Truth H:")
print(np.round(H_ground_truth / H_ground_truth[2, 2], 5))
print("\nMatriks Estimasi H_dlt:")
print(np.round(H_est, 5))
print(f"\nGalat Selisih Mutlak Maksimum Frobenius: {np.max(np.abs(H_ground_truth/H_ground_truth[2,2] - H_est)):.2e}")
"""

c6_8_pitfalls = [
    "Menjalankan DLT tanpa normalisasi koordinat Hartley (Hartley isotropic scaling); pada koordinat piksel besar ($1000 \\times 1000$), matriks $\\mathbf{A}$ menjadi sangat buruk kondisinya (*ill-conditioned*) dan rentan galat numerik.",
    "Memasukkan 4 titik yang 3 di antaranya kolinier (segaris); konfigurasi degenerasi ini menghasilkan matriks dengan rank deficient.",
    "Mengabaikan pembagian koordinat homogen dengan elemen ketiga ($w = h_{31}x + h_{32}y + h_{33}$) saat menerapkan homografi untuk transformasi koordinat piksel."
]

c6_8_refs = [
    {
        "title": "In Defence of the 8-point Algorithm",
        "authors": ["Richard I. Hartley"],
        "year": 1997,
        "publisherOrVenue": "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)",
        "url": "https://doi.org/10.1109/34.601246",
        "relevance": "Pentingnya normalisasi koordinat sebelum DLT untuk menjaga stabilitas numerik SVD."
    }
]

c6_8_quiz = {
    "question": "Berapakah jumlah pasangan titik korespondensi minimum yang mutlak diperlukan untuk mengestimasi matriks Homografi 2D menggunakan algoritma DLT?",
    "options": [
        "2 pasang titik",
        "3 pasang titik",
        "4 pasang titik",
        "8 pasang titik"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Matriks homografi memiliki 8 derajat kebebasan (DoF). Karena setiap pasangan titik memberikan 2 persamaan linier independen pada algoritma DLT, maka dibutuhkan minimal $8 / 2 = 4$ pasangan titik korespondensi tanpa ada 3 titik yang segaris."
}

subchapters.append(create_subchapter("computer-vision-ch6-sub8", "6.8. Estimasi Matriks Homografi 2D (Direct Linear Transformation - DLT)", c6_8_desc, c6_8_md, c6_8_code, c6_8_pitfalls, c6_8_refs, c6_8_quiz))

# ==============================================================================
# SUBCHAPTER 6.9: Penyatuan Gambar (Image Warping & Blending)
# ==============================================================================
c6_9_desc = "Teknik deformasi koordinat proyektif (backward warping dengan interpolasi bilinear), perataan batas (linear feathering), dan Multi-band Laplacian Pyramid Blending."
c6_9_md = r"""Setelah matriks homografi $\mathbf{H}$ terestimasi secara robust melalui RANSAC, citra sumber harus dideformasi secara geometris (*warping*) ke kanvas koordinat citra referensi dan disatukan (*blended*) secara mulus tanpa meninggalkan batas sambungan visual atau artefak pencahayaan.

### 1. Forward vs Backward Image Warping
- **Forward Warping**: Menghitung koordinat target $[x', y']^T = \mathbf{H} [x, y]^T$ untuk setiap piksel sumber. Masalah matematis: Pemetaan koordinat bilangan riil ke grid diskrit integer meninggalkan celah kosong (*holes*) dan tumpang tindih piksel acak pada kanvas target akibat pembulatan koordinat non-injektif.
- **Backward (Inverse) Warping**: Mengiterasi setiap koordinat piksel $[x', y']$ pada kanvas target dan mencari koordinat asalnya pada citra sumber menggunakan inversi matriks homografi:
  $$[x, y, 1]^T \sim \mathbf{H}^{-1} [x', y', 1]^T$$
  Diikuti oleh **Interpolasi Bilinear 2D** pada 4 piksel tetangga di citra sumber. Metode ini menjamin bahwa seluruh piksel kanvas target terisi sempurna secara kontinu tanpa celah kosong.

### 2. Algoritma Perpaduan Multi-Band Laplacian Pyramid (Burt & Adelson, 1983)
Jika dua citra yang bertumpang tindih langsung digabungkan menggunakan rata-rata linier sederhana (*linear alpha feathering*), dua artefak visual parah akan muncul: bayangan ganda (*ghosting*) jika terdapat sedikit kesalahan kalibrasi geometris, serta batas sambungan tajam (*seam lines*) jika kedua citra diambil dengan eksposur atau white balance berbeda.

Peter J. Burt dan Edward H. Adelson (1983) memecahkan paradoks ini melalui **Multi-band Laplacian Pyramid Blending**:
1. **Dekomposisi Piramida Gauss**: Citra masukan $I_A$ dan $I_B$ disaring dengan filter Gauss berulang dan di-subsample $2\times$ untuk menghasilkan piramida skala spasial:
   $$G_0 = I, \quad G_{l+1} = \operatorname{Downsample}(\operatorname{GaussFilter}(G_l))$$
2. **Konstruksi Piramida Laplacian**: Menghitung selisih antar-tingkatan untuk mengisolasi band frekuensi spasial tertentu:
   $$L_l = G_l - \operatorname{Upsample}(G_{l+1})$$
   Tingkat piramida terbawah ($L_0$) memuat detail frekuensi spasial tertinggi (tepi tajam dan tekstur halus), sedangkan tingkat teratas ($G_k$) memuat komponen frekuensi sangat rendah (luminansi dan pencahayaan global).
3. **Penyatuan Terpisah per Frekuensi**:
   Setiap pita frekuensi dipadukan menggunakan masker bobot spasial $W_l$ yang sesuai:
   $$L_{\text{mosaik}, l} = W_l \cdot L_{A, l} + (1 - W_l) \cdot L_{B, l}$$
   Untuk frekuensi tinggi, transisi masker $W$ dibuat sangat sempit (beberapa piksel saja) guna menghindari *ghosting*. Untuk frekuensi rendah, transisi masker dibuat sangat lebar dan landai guna meratakan perbedaan eksposur secara imperseptibel.
4. **Rekonstruksi Mosaik Citra**: Mosaik akhir dipulihkan melalui ekspansi bertingkat dari atas ke bawah:
   $$I_{\text{final}} = \sum_{l=0}^{k} \operatorname{Upsample}^{(l)}(L_{\text{mosaik}, l})$$"""

c6_9_code = r"""import numpy as np

def linear_feathering_blend(img_left: np.ndarray, img_right: np.ndarray, overlap_width: int) -> np.ndarray:
    '''Simulasi perpaduan Linear Feathering (Alpha Blending Bergradien) pada zona tumpang tindih.'''
    H, W = img_left.shape
    blended = np.zeros((H, W * 2 - overlap_width), dtype=np.float32)
    
    # 1. Salin bagian non-overlap kiri
    blended[:, :W - overlap_width] = img_left[:, :W - overlap_width]
    
    # 2. Perpaduan pada zona overlap dengan bobot linier alpha
    alpha = np.linspace(1.0, 0.0, overlap_width) # Transisi 1 -> 0 untuk gambar kiri
    for col in range(overlap_width):
        w_left = alpha[col]
        w_right = 1.0 - w_left
        blended[:, W - overlap_width + col] = (
            w_left * img_left[:, W - overlap_width + col] +
            w_right * img_right[:, col]
        )
        
    # 3. Salin bagian non-overlap kanan
    blended[:, W:] = img_right[:, overlap_width:]
    return blended

# Simulasi dua potongan citra 1D dengan ketidaksesuaian eksposur (Kiri: 120, Kanan: 180)
H, W = 4, 10
overlap = 4
img_A = np.full((H, W), 120.0, dtype=np.float32)
img_B = np.full((H, W), 180.0, dtype=np.float32)

result = linear_feathering_blend(img_A, img_B, overlap_width=overlap)

print("--- Hasil Perpaduan Mulus (Linear Feathering Blending) ---")
print(f"Dimensi Citra Input : ({H}, {W}) per citra | Lebar Zona Overlap: {overlap} piksel")
print(f"Dimensi Kanvas Mosaik: {result.shape}")
print("Profil Nilai Intensitas Baris Tengah Melintasi Batas Sambungan:")
print(np.round(result[0, W-overlap-2 : W+3], 1))
print("Terlihat transisi mulus: 120.0 -> 132.0 -> 144.0 -> 156.0 -> 168.0 -> 180.0 tanpa patahan!")
"""

c6_9_pitfalls = [
    "Menggunakan linear feathering sederhana pada zona overlap yang memuat objek dinamis bergerak; feathering akan memicu artefak ghosting parah (solusi: gunakan pemotongan grafik *optimal seam cutting* via Graph-Cut optimization).",
    "Melakukan blending di ruang warna non-linear ter-gamma (sRGB), yang menyebabkan hilangnya energi luminansi fisik pada batas sambungan.",
    "Mengabaikan kompensasi penguatan (*gain compensation* / radiometric calibration) sebelum perpaduan multi-band."
]

c6_9_refs = [
    {
        "title": "A Multiresolution Spline with Application to Image Mosaics",
        "authors": ["Peter J. Burt", "Edward H. Adelson"],
        "year": 1983,
        "publisherOrVenue": "ACM Transactions on Graphics (TOG)",
        "url": "https://doi.org/10.1145/245.247",
        "relevance": "Paper kanonikal penemu algoritma Multi-band Laplacian Pyramid Blending."
    }
]

c6_9_quiz = {
    "question": "Mengapa backward warping dengan interpolasi bilinear selalu lebih disukai dibanding forward warping saat melakukan deformasi koordinat homografi?",
    "options": [
        "Karena backward warping tidak membutuhkan perkalian matriks.",
        "Karena forward warping memetakan koordinat diskrit ke koordinat kontinu yang dapat meninggalkan celah kosong (holes) dan piksel bertumpuk pada kanvas target.",
        "Karena backward warping hanya bekerja pada citra hitam-putih.",
        "Karena backward warping menghilangkan kebutuhan matriks invers H."
    ],
    "correctAnswerIndex": 1,
    "explanation": "Pada forward warping, titik integer sumber diproyeksikan ke koordinat float target yang setelah dibulatkan sering meninggalkan celah kosong (holes) atau piksel tumpang tindih. Backward warping mengiterasi setiap piksel kanvas target dan menarik nilai dari citra asal via interpolasi bilinear, menjamin kanvas terisi penuh secara kontinu."
}

subchapters.append(create_subchapter("computer-vision-ch6-sub9", "6.9. Penyatuan Gambar (Image Warping & Blending: Feathering & Multi-band)", c6_9_desc, c6_9_md, c6_9_code, c6_9_pitfalls, c6_9_refs, c6_9_quiz))

# ==============================================================================
# SUBCHAPTER 6.10: Pipeline Lengkap Pembuatan Panorama Otomatis
# ==============================================================================
c6_10_desc = "Arsitektur end-to-end pembuatan panorama citra otomatis Brown & Lowe (2007): proyeksi silindris/bola, ekstraksi fitur, graf keterhubungan, bundle adjustment, dan rendering komposit."
c6_10_md = r"""Sistem pembuatan panorama otomatis modern beroperasi sepenuhnya tanpa intervensi pengguna (*fully automated image stitching*), mampu menyusun puluhan foto acak menjadi mosaik panorama tanpa informasi urutan input awal. Arsitektur kanonikal dirumuskan oleh Matthew Brown dan David G. Lowe (2007).

### 1. Tahapan Arsitektur Brown & Lowe (2007)
1. **Ekstraksi Fitur SIFT/ORB**: Mengekstrak ribuan titik kunci dan deskriptor invarian skala/rotasi dari setiap citra input.
2. **Pencocokan Semua-ke-Semua (*All-to-All Pairwise Matching*)**: Mencocokkan fitur antar setiap pasangan citra menggunakan k-NN FLANN dan Lowe's Ratio Test.
3. **Verifikasi Geometris RANSAC**: Untuk setiap pasangan kandidat, jalankan RANSAC homografi. Pasangan citra yang memiliki jumlah inlier konsensus melebihi ambang batas statistik:
   $$N_{\text{inliers}} > 5.9 + 0.22 N_{\text{matches}}$$
   dikonfirmasi memiliki tumpang tindih visual (*image overlap*). Formula probabilistik ini menjamin tingkat kesalahan deteksi palsu (*false positive rate*) di bawah $10^{-6}$.
4. **Pembentukan Graf Komponen Terhubung**: Membangun graf di mana simpul (*nodes*) adalah citra dan sisi (*edges*) adalah pasangan terverifikasi RANSAC. Komponen terhubung terbesar membentuk satu kelompok panorama utuh.
5. **Penyesuaian Berkas Global (*Bundle Adjustment*)**: Mengoptimasi parameter orientasi rotasi kamera seluruh citra ($\mathbf{R}_i$) dan panjang fokus intrinsik ($f$) secara simultan untuk meminimalkan akumulasi galat reproyeksi (*accumulated drift*):
   $$\min_{\{\mathbf{R}_k, f\}} \sum_{i} \sum_{j \in \mathcal{N}(i)} \sum_{k \in \mathcal{M}_{ij}} \|\mathbf{u}_{ik} - \pi(\mathbf{R}_i, \mathbf{R}_j, \mathbf{u}_{jk})\|^2$$
6. **Kompensasi Penguatan (*Gain Compensation*)**: Menyelaraskan distribusi fluks luminansi antar-kamera sebelum perpaduan akhir.
7. **Proyeksi Silindris atau Bola (*Cylindrical / Spherical Warping*)**:
   Memetakan koordinat bidang datar ke permukaan silinder radius $s = f$:
   $$x' = s \cdot \arctan\left(\frac{x - x_c}{f}\right), \quad y' = s \cdot \frac{y - y_c}{\sqrt{(x - x_c)^2 + f^2}}$$
   Transformasi silindris ini mengeliminasi distorsi regangan ekstrem pada bidang datar untuk panorama bersudut pandang lebar ($> 90^\circ$)."""

c6_10_code = r"""import numpy as np

def verify_panorama_image_match(num_raw_matches: int, num_ransac_inliers: int) -> bool:
    '''Kriteria verifikasi probabilistik kecocokan pasangan citra Brown & Lowe (2007).'''
    # Formula statistik probabilistik model false positive Brown & Lowe: N_inliers > 5.9 + 0.22 * N_matches
    threshold = 5.9 + 0.22 * num_raw_matches
    return num_ransac_inliers > threshold

# Uji Evaluasi 3 Pasangan Citra Kandidat Panorama
pair_candidates = [
    ("Foto 1 vs Foto 2 (Tumpang Tindih Sejati)", 120, 48),
    ("Foto 1 vs Foto 5 (Objek Berbeda / Luar Lapangan)", 85, 8),
    ("Foto 2 vs Foto 3 (Tumpang Tindih Kuat)", 200, 95)
]

print("--- Evaluasi Kriteria Verifikasi Pasangan Panorama Brown & Lowe ---")
for label, n_matches, n_inliers in pair_candidates:
    is_valid = verify_panorama_image_match(n_matches, n_inliers)
    thresh = 5.9 + 0.22 * n_matches
    print(f"{label}:")
    print(f"  Matches: {n_matches}, Inliers: {n_inliers} | Syarat Ambang: > {thresh:.1f} -> {'TERKONFIRMASI VALID' if is_valid else 'DITOLAK'}")
"""

c6_10_pitfalls = [
    "Menggunakan proyeksi bidang datar untuk panorama dengan sudut pandang lebar (> 90 derajat), yang memicu distorsi regangan ekstrem di tepi kanvas (wajib menggunakan proyeksi silinder atau bola).",
    "Melakukan stitching sekuensial berantai (Image 1 -> 2 -> 3) tanpa Bundle Adjustment global; akumulasi kesalahan rotasi akan menyebabkan batas akhir panorama tidak menutup mulus (loop closure failure).",
    "Mengabaikan kalibrasi panjang fokus kamera (focal length); jika nilai f salah, proyeksi silindris akan melengkungkan garis lurus horizontal."
]

c6_10_refs = [
    {
        "title": "Automatic Panoramic Image Stitching using Invariant Features",
        "authors": ["Matthew Brown", "David G. Lowe"],
        "year": 2007,
        "publisherOrVenue": "International Journal of Computer Vision (IJCV)",
        "url": "https://doi.org/10.1007/s11263-006-0002-3",
        "relevance": "Paper arsitektur kanonikal modern penggabungan panorama citra otomatis tanpa intervensi manual."
    }
]

c6_10_quiz = {
    "question": "Mengapa pembuatan panorama bersudut pandang lebar (> 90 derajat) wajib menggunakan proyeksi silinder atau bola alih-alih proyeksi bidang datar murni?",
    "options": [
        "Karena proyeksi bidang datar tidak mendukung warna RGB.",
        "Karena pada sudut pandang lebar, fungsi proyeksi planar membentang tak terhingga di sepanjang sumbu tangen (tan theta), memicu distorsi regangan ekstrem di tepi kanvas.",
        "Karena proyeksi silindris menghapus kebutuhan ekstraksi fitur SIFT.",
        "Karena algoritma RANSAC hanya dapat bekerja pada permukaan melengkung."
    ],
    "correctAnswerIndex": 1,
    "explanation": "Pada proyeksi planar, koordinat tepi diproyeksikan melalui relasi $x = f \\tan(\\theta)$. Ketika sudut pandang melebihi $90^\\circ$ (atau $\\theta \\to 90^\\circ$), nilai tangen mendekati tak hingga sehingga citra meregang ekstrem. Proyeksi silindris/bola memetakan sudut secara linear melingkar ($x' = s \\theta$), mempertahankan proporsi visual panorama."
}

subchapters.append(create_subchapter("computer-vision-ch6-sub10", "6.10. Pipeline Lengkap Pembuatan Panorama Otomatis (Brown & Lowe)", c6_10_desc, c6_10_md, c6_10_code, c6_10_pitfalls, c6_10_refs, c6_10_quiz))

output_path = os.path.join(os.path.dirname(__file__), "cv_ch6_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 6 data with {len(subchapters)} subchapters: {output_path}")
