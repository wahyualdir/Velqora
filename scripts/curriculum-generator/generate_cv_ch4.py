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

def create_subchapter(id_str, title, description, content_markdown, code_snippet, common_pitfalls, canonical_refs):
    expected_output = run_snippet_and_get_output(code_snippet)
    return {
        "id": id_str,
        "title": title,
        "description": description,
        "content": content_markdown.strip(),
        "codeSnippet": code_snippet.strip(),
        "expectedOutput": expected_output.strip(),
        "commonPitfalls": common_pitfalls if isinstance(common_pitfalls, list) else [common_pitfalls.strip()],
        "canonicalReferences": canonical_refs
    }

subchapters = []

# ==============================================================================
# SUBCHAPTER 4.1: Histogram Intensitas 1D & Perataan Histogram
# ==============================================================================
c4_1_desc = "Fungsi kepadatan probabilitas empiris, fungsi distribusi kumulatif (CDF), transformasi pemetaan monotonik, dan perataan histogram global."
c4_1_md = """Histogram intensitas citra digital adalah representasi statistik orde pertama yang merangkum sebaran global frekuensi kemunculan nilai keabuan tanpa memperhatikan relasi spasial antarpiksel.

### 1. Fungsi Kepadatan Probabilitas Empiris (PDF)
Untuk citra digital berukuran $H \\times W = N$ piksel dengan $L$ tingkat keabuan diskrit $r_k \\in [0, L-1]$ ($L=256$ pada citra 8-bit):
$$p_r(r_k) = \\frac{n_k}{N}, \\quad k = 0, 1, \\dots, L-1$$
Di mana $n_k$ adalah jumlah piksel yang memiliki nilai intensitas $r_k$.

### 2. Teorema Perataan Histogram (*Histogram Equalization*)
Tujuan dari perataan histogram adalah menemukan transformasi intensitas monotonik naik $s = T(r)$ sedemikian rupa sehingga variabel acak keluaran $s$ memiliki fungsi kepadatan probabilitas seragam (*uniform PDF*) di seluruh rentang dinamis:
$$p_s(s) = \\frac{1}{L-1}, \\quad 0 \\le s \\le L-1$$

Dari teori probabilitas variabel acak kontinu:
$$p_s(s) = p_r(r) \\left| \\frac{dr}{ds} \\right| \\implies ds = (L-1) p_r(r) dr$$

Dengan mengintegralkan kedua ruas, fungsi transformasi optimal terbukti merupakan **Fungsi Distribusi Kumulatif** (*Cumulative Distribution Function* / CDF) dari citra input:
$$s_k = T(r_k) = (L - 1) \\sum_{j=0}^{k} p_r(r_j) = \\operatorname{round}\\left( \\frac{L - 1}{N} \\sum_{j=0}^{k} n_j \\right)$$

Transformasi ini secara otomatis memperluas rentang dinamis citra yang berkontras rendah (*low contrast*) menjadi kontras tinggi maksimal."""

c4_1_code = r"""import numpy as np

def histogram_equalization(image: np.ndarray) -> tuple:
    '''Implementasi mandiri perataan histogram (Histogram Equalization) berbasis CDF.'''
    H, W = image.shape
    num_pixels = H * W
    
    # 1. Hitung Histogram Frekuensi 1D (PDF)
    hist, _ = np.histogram(image.flatten(), bins=256, range=[0, 256])
    
    # 2. Hitung Cumulative Distribution Function (CDF)
    cdf = hist.cumsum()
    
    # 3. Masking Nilai Nol dan Normalisasi Pemetaan Monotonik ke [0, 255]
    cdf_m = np.ma.masked_equal(cdf, 0)
    cdf_m = (cdf_m - cdf_m.min()) * 255.0 / (cdf_m.max() - cdf_m.min())
    lookup_table = np.ma.filled(cdf_m, 0).astype(np.uint8)
    
    # 4. Terapkan Lookup Table ke Citra
    equalized_image = lookup_table[image]
    return equalized_image, hist, lookup_table

# Citra Uji Kontras Sangat Rendah (Berkelompok di sekitar intensitas 50-70)
low_contrast = np.array([
    [50, 52, 55, 60],
    [52, 58, 62, 65],
    [54, 60, 68, 70],
    [55, 63, 67, 72]
], dtype=np.uint8)

eq_img, orig_hist, lut = histogram_equalization(low_contrast)

print("--- Hasil Perataan Histogram Berbasis CDF ---")
print("Citra Asli Kontras Rendah (Rentang 50-72):\n", low_contrast)
print(f"\nCitra Hasil Equalization (Rentang Diperluas 0-255):\n", eq_img)
print(f"\nNilai Minimum Citra: Asli={low_contrast.min()} -> Hasil={eq_img.min()}")
print(f"Nilai Maksimum Citra: Asli={low_contrast.max()} -> Hasil={eq_img.max()}")
"""

c4_1_pitfalls = [
    "Menerapkan perataan histogram langsung pada kanal R, G, dan B secara terpisah, yang menyebabkan pergeseran rona (*hue shift*) dan distorsi saturasi warna yang aneh; perataan warna harus dilakukan hanya pada kanal Luminansi (misal: kanal $Y$ pada YCbCr atau $L^*$ pada Lab).",
    "Peningkatan derau latar belakang (*noise over-amplification*): di area datar homogen (seperti langit malam), perataan histogram global akan memperkuat derau sensor menjadi bintik-bintik putih yang sangat mengganggu.",
    "Hilangnya detail halus pada citra yang memiliki distribusi bimodal ekstrim (separuh sangat gelap dan separuh sangat terang)."
]

c4_1_refs = [
    {
        "title": "Digital Image Processing (4th ed.)",
        "authors": ["Rafael C. Gonzalez", "Richard E. Woods"],
        "year": 2018,
        "publisherOrVenue": "Pearson",
        "url": "https://www.pearson.com/",
        "relevance": "Bab 3.3: Histogram processing, histogram equalization, and histogram matching."
    }
]

subchapters.append(create_subchapter("computer-vision-ch4-sub1", "4.1. Histogram Intensitas 1D & Perataan Histogram (Histogram Equalization)", c4_1_desc, c4_1_md, c4_1_code, c4_1_pitfalls, c4_1_refs))

# ==============================================================================
# SUBCHAPTER 4.2: Contrast Limited Adaptive Histogram Equalization (CLAHE)
# ==============================================================================
c4_2_desc = "Keterbatasan histogram global, partisi ubin lokal (contextual tiles), pemotongan batas kontras (clipping limit), redistribusi kelebihan piksel, dan interpolasi bilinear antarubin."
c4_2_md = """Perataan histogram global mengabaikan variasi pencahayaan lokal dan sering kali memperkuat derau latar belakang secara berlebihan. **Contrast Limited Adaptive Histogram Equalization (CLAHE)** (Zuiderveld, 1994) memecahkan kelemahan ini dengan memproses citra dalam ubin-ubin lokal kontekstual dengan pembatasan kontras ketat.

### 1. Partisi Ubin Kontekstual (*Contextual Tiles*)
Citra dibagi menjadi kisi ubin persegi panjang kecil yang tidak tumpang-tindih (biasanya $8 \\times 8$ ubin, berukuran misal $64 \\times 64$ piksel per ubin). Histogram intensitas dihitung secara independen untuk setiap ubin.

### 2. Pemotongan Kontras (*Contrast Limiting / Clip Limit*)
Tinggi histogram berkorelasi langsung dengan kecuraman gradien fungsi CDF: semakin tinggi suatu bin histogram, semakin agresif kontras ditingkatkan di sekitar nilai intensitas tersebut.

Untuk mencegah penguatan derau berlebih, CLAHE menetapkan ambang batas maksimum (**clip limit** $N_{\\text{clip}}$). Jika suatu bin histogram melebihi $N_{\\text{clip}}$:
1. Bagian histogram di atas $N_{\\text{clip}}$ dipotong (*clipped*).
2. Total piksel yang terpotong dijumlahkan dan diredistribusikan secara merata ke seluruh bin histogram.

### 3. Interpolasi Bilinear Antarubin
Jika perataan ubin langsung diterapkan, akan muncul batas garis kotak-kotak artifisial antarubin (*blocking boundary artifacts*). CLAHE mengeliminasi artefak ini dengan menginterpolasi nilai intensitas piksel secara bilinear menggunakan fungsi pemetaan dari 4 pusat ubin tetangga terdekat."""

c4_2_code = r"""import numpy as np

def clip_and_redistribute_histogram(hist: np.ndarray, clip_limit: int) -> np.ndarray:
    '''Memotong histogram pada clip_limit dan meredistribusikan kelebihan secara merata.'''
    excess = 0
    clipped_hist = hist.copy()
    
    # 1. Potong bin yang melebihi batas
    for i in range(len(clipped_hist)):
        if clipped_hist[i] > clip_limit:
            excess += clipped_hist[i] - clip_limit
            clipped_hist[i] = clip_limit
            
    # 2. Redistribusikan piksel berlebih secara merata ke seluruh 256 bin
    bonus = excess // len(clipped_hist)
    remainder = excess % len(clipped_hist)
    
    clipped_hist += bonus
    for i in range(remainder):
        clipped_hist[i] += 1
        
    return clipped_hist

# Simulasikan Histogram Ubin Lokal dengan Puncak Derau Ekstrem pada Intensitas 100
mock_hist = np.full(256, 2, dtype=np.int32)
mock_hist[100] = 50  # Puncak intensitas dominan (penyebab amplifikasi derau)

# Setel Clip Limit = 10
clip_val = 10
processed_hist = clip_and_redistribute_histogram(mock_hist, clip_val)

print("--- Mekanisme Pemotongan dan Redistribusi Kontras CLAHE ---")
print(f"Total Piksel Asli Ubin         : {mock_hist.sum()}")
print(f"Nilai Puncak Asli pada Bin 100 : {mock_hist[100]}")
print(f"Nilai Puncak Setelah Clipping  : {processed_hist[100]} (Terpotong aman)")
print(f"Rata-rata Nilai Bin Lain       : {processed_hist[0]} (Mendapat jatah redistribusi)")
print(f"Total Piksel Pasca-Redistribusi: {processed_hist.sum()} (Preservasi Jumlah Foton 100%)")
"""

c4_2_pitfalls = [
    "Menyetel parameter `clipLimit` terlalu tinggi (misal: di atas 40.0), yang membuat CLAHE terdegenerasi menjadi perataan adaptif naif yang memperkuat derau sensor secara drastis.",
    "Memilih ukuran kisi ubin (`tileGridSize`) terlalu kecil (misal $2 \\times 2$ piksel), yang melenyapkan struktur objek global, atau terlalu besar sehingga kehilangan adaptabilitas lokal.",
    "Mengabaikan interpolasi bilinear pada piksel pojok dan batas terluar citra, memicu kesalahan indeks array saat menghitung 4 pusat tetangga ubin."
]

c4_2_refs = [
    {
        "title": "Contrast Limited Adaptive Histogram Equalization",
        "authors": ["Karel Zuiderveld"],
        "year": 1994,
        "publisherOrVenue": "Graphics Gems IV, Academic Press Professional",
        "url": "https://doi.org/10.1016/B978-0-12-336156-1.50061-6",
        "relevance": "Paper kanonikal orisinal yang mendefinisikan algoritma CLAHE."
    }
]

subchapters.append(create_subchapter("computer-vision-ch4-sub2", "4.2. Contrast Limited Adaptive Histogram Equalization (CLAHE)", c4_2_desc, c4_2_md, c4_2_code, c4_2_pitfalls, c4_2_refs))

# ==============================================================================
# SUBCHAPTER 4.3: Matriks Ko-okurensi Tingkat Abu-abu (GLCM)
# ==============================================================================
c4_3_desc = "Statistik spasial tingkat dua tekstur citra, matriks ko-okurensi Gray-Level Co-occurrence Matrix (GLCM), parameter jarak d dan sudut theta."
c4_3_md = """Sementara histogram 1D hanya mencatat seberapa sering suatu intensitas muncul, **Gray-Level Co-occurrence Matrix (GLCM)** (Haralick et al., 1973) mencatat **hubungan spasial tingkat kedua**: seberapa sering sepasang piksel dengan intensitas $i$ dan $j$ muncul bersamaan pada jarak perpindahan spasial tertentu.

### 1. Definisi Formal GLCM $P(i, j; d, \\theta)$
Diberikan citra $I(x, y)$ berukuran $H \\times W$ dengan $N_g$ tingkat keabuan diskrit, matriks ko-okurensi berukuran $N_g \\times N_g$ didefinisikan berdasarkan vektor perpindahan $(\\Delta x, \\Delta y)$ yang ditentukan oleh jarak $d$ dan sudut orientasi $\\theta$:

$$P(i, j; d, \\theta) = \\sum_{y=1}^{H} \\sum_{x=1}^{W} \\mathbb{I}\\left( I(x, y) = i \\;\\wedge\\; I(x + \\Delta x, y + \\Delta y) = j \\right)$$

Empat orientasi sudut standar:
- $\\theta = 0^\\circ$ (Horizontal): $(\\Delta x = d, \\Delta y = 0)$
- $\\theta = 45^\\circ$ (Diagonal Kanan-Atas): $(\\Delta x = d, \\Delta y = -d)$
- $\\theta = 90^\\circ$ (Vertikal): $(\\Delta x = 0, \\Delta y = d)$
- $\\theta = 135^\\circ$ (Diagonal Kiri-Atas): $(\\Delta x = -d, \\Delta y = -d)$

### 2. Simetrisasi & Normalisasi Probabilitas
Dalam analisis tekstur invarian arah bolak-balik, GLCM dibuat simetris:
$$P_{\\text{sym}} = P + P^T$$
Lalu dinormalisasi menjadi fungsi massa probabilitas gabungan:
$$p(i, j) = \\frac{P_{\\text{sym}}(i, j)}{\\sum_{i} \\sum_{j} P_{\\text{sym}}(i, j)}$$"""

c4_3_code = r"""import numpy as np

def compute_glcm_horizontal(image: np.ndarray, num_levels: int = 4, distance: int = 1) -> np.ndarray:
    '''Menghitung GLCM ter-normalisasi simetris arah horizontal (theta = 0 derajat).'''
    H, W = image.shape
    glcm = np.zeros((num_levels, num_levels), dtype=np.float64)
    
    # Kumpulkan pasangan piksel (i, j) berjarak d secara horizontal
    for y in range(H):
        for x in range(W - distance):
            i = image[y, x]
            j = image[y, x + distance]
            glcm[i, j] += 1
            
    # Simetrisasi (P + P^T) untuk merefleksikan hubungan timbal balik
    glcm_sym = glcm + glcm.T
    
    # Normalisasi probabilitas gabungan
    total_pairs = np.sum(glcm_sym)
    p_norm = glcm_sym / total_pairs if total_pairs > 0 else glcm_sym
    return p_norm

# Citra Sederhana 4x4 dengan Kuantisasi 4 Tingkat Keabuan (0, 1, 2, 3)
# Mengandung Pola Garis-garis Horizontal Tegas (Tekstur Seragam Baris)
textured_patch = np.array([
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [3, 3, 3, 3]
], dtype=np.int32)

glcm_result = compute_glcm_horizontal(textured_patch, num_levels=4, distance=1)

print("--- Hasil Komputasi Matriks Ko-okurensi (GLCM) ---")
print("Citra Tekstur Garis Horizontal (4 Tingkat Abu-abu):\n", textured_patch)
print("\nMatriks Probabilitas GLCM 4x4 (Theta=0°, d=1):\n", glcm_result.round(3))
print(f"\nObservasi Ilmiah: Elemen diagonal utama (p[0,0], p[1,1], p[2,2], p[3,3]) mendominasi ({np.trace(glcm_result):.1f}),")
print("membuktikan konsistensi intensitas horizontal yang sangat tinggi (tekstur berulang).")
"""

c4_3_pitfalls = [
    "Menghitung GLCM langsung pada citra 256 tingkat keabuan (`uint8`), menghasilkan matriks berukuran $256 \\times 256 = 65.536$ sel yang sangat renggang (*extremely sparse*) dan boros memori; citra harus dikuantisasi terlebih dahulu ke 8, 16, atau 32 tingkat keabuan.",
    "Lupa melakukan simetrisasi matriks, sehingga hubungan antara piksel $i$ dan tetangga $j$ tidak invarian terhadap arah bolak-balik.",
    "Mengabaikan piksel batas luar citra saat menghitung offset $(\\Delta x, \\Delta y)$, yang memicu pergeseran koordinat indeks yang salah."
]

c4_3_refs = [
    {
        "title": "Textural Features for Image Classification",
        "authors": ["Robert M. Haralick", "K. Shanmugam", "Its'Hak Dinstein"],
        "year": 1973,
        "publisherOrVenue": "IEEE Transactions on Systems, Man, and Cybernetics",
        "url": "https://doi.org/10.1109/TSMC.1973.4309314",
        "relevance": "Paper kanonikal bersejarah pendefinisian GLCM dan 14 fitur tekstur statistik."
    }
]

subchapters.append(create_subchapter("computer-vision-ch4-sub3", "4.3. Matriks Ko-okurensi Tingkat Abu-abu (GLCM)", c4_3_desc, c4_3_md, c4_3_code, c4_3_pitfalls, c4_3_refs))

# ==============================================================================
# SUBCHAPTER 4.4: Fitur Tekstur Haralick (Kontras, Disimilaritas, Homogenitas, Energi)
# ==============================================================================
c4_4_desc = "Deskriptor statistik tingkat dua Haralick: Kontras, Disimilaritas, Homogenitas (IDM), Energi (Angular Second Moment), dan Entropi informasi."
c4_4_md = """Dari matriks probabilitas ko-okurensi $p(i, j)$, Robert Haralick merumuskan serangkaian deskriptor skalar kompak yang mengukur karakteristik tekstur permukaan visual secara kuantitatif.

### 1. Formulasi Fitur Utama Haralick
Diberikan matriks probabilitas ternormalisasi $p(i, j) \\in [0, 1]$ berukuran $N_g \\times N_g$:

1. **Kontras (*Contrast*)**:
   Mengukur variasi intensitas lokal antara pasangan piksel bertetangga. Nilainya tinggi jika terdapat perbedaan kontras yang tajam (bobot kuadratik $(i-j)^2$):
   $$\\text{Contrast} = \\sum_{i} \\sum_{j} (i - j)^2 \\, p(i, j)$$

2. **Disimilaritas (*Dissimilarity*)**:
   Serupa dengan kontras, namun menggunakan penalti linier absolut $|i - j|$:
   $$\\text{Dissimilarity} = \\sum_{i} \\sum_{j} |i - j| \\, p(i, j)$$

3. **Homogenitas (*Homogeneity / Inverse Difference Moment - IDM*)**:
   Mengukur kedekatan distribusi elemen terhadap diagonal utama matriks GLCM. Bernilai maksimum ($1.0$) jika seluruh piksel bertetangga memiliki nilai identik:
   $$\\text{Homogeneity} = \\sum_{i} \\sum_{j} \\frac{p(i, j)}{1 + (i - j)^2}$$

4. **Energi (*Energy / Angular Second Moment - ASM*)**:
   Mengukur keteraturan tekstur. Bernilai tinggi jika tekstur sangat repetitif atau seragam:
   $$\\text{ASM} = \\sum_{i} \\sum_{j} p(i, j)^2, \\quad \\text{Energy} = \\sqrt{\\text{ASM}}$$

5. **Entropi (*Entropy*)**:
   Mengukur keacakan atau derajat ketidakteraturan distribusi tekstur:
   $$\\text{Entropy} = - \\sum_{i} \\sum_{j} p(i, j) \\log_2(p(i, j) + \\epsilon)$$"""

c4_4_code = r"""import numpy as np

def extract_haralick_features(glcm_prob: np.ndarray) -> dict:
    '''Mengekstrak 5 fitur tekstur utama Haralick dari matriks probabilitas GLCM.'''
    Ng = glcm_prob.shape[0]
    i_idx, j_idx = np.mgrid[0:Ng, 0:Ng]
    
    # 1. Kontras: Sum((i - j)^2 * p(i, j))
    contrast = np.sum(((i_idx - j_idx) ** 2) * glcm_prob)
    
    # 2. Disimilaritas: Sum(|i - j| * p(i, j))
    dissimilarity = np.sum(np.abs(i_idx - j_idx) * glcm_prob)
    
    # 3. Homogenitas (IDM): Sum(p(i, j) / (1 + (i - j)^2))
    homogeneity = np.sum(glcm_prob / (1.0 + (i_idx - j_idx) ** 2))
    
    # 4. Angular Second Moment (ASM) / Energi
    asm = np.sum(glcm_prob ** 2)
    energy = np.sqrt(asm)
    
    # 5. Entropi: -Sum(p * log2(p))
    mask = glcm_prob > 0
    entropy = -np.sum(glcm_prob[mask] * np.log2(glcm_prob[mask]))
    
    return {
        "contrast": float(contrast),
        "dissimilarity": float(dissimilarity),
        "homogeneity": float(homogeneity),
        "energy": float(energy),
        "entropy": float(entropy)
    }

# Evaluasi Dua Kondisi Tekstur Ekstrem (Matriks GLCM 4x4)
# Matriks 1: Tekstur Homogen Sempurna (Hanya Diagonal Utama yang Terisi)
glcm_homogen = np.diag([0.25, 0.25, 0.25, 0.25])

# Matriks 2: Tekstur Acak Berderau Kasar (Tersebar Rata di Luar Diagonal)
glcm_noisy = np.full((4, 4), 1.0 / 16.0)

feat_homogen = extract_haralick_features(glcm_homogen)
feat_noisy = extract_haralick_features(glcm_noisy)

print("--- Ekstraksi dan Komparasi Fitur Tekstur Haralick ---")
print(f"{'Metrik Fitur':15s} | {'Tekstur Homogen':16s} | {'Tekstur Acak Berderau':20s}")
print("-" * 58)
for k in feat_homogen:
    print(f"{k.capitalize():15s} | {feat_homogen[k]:16.4f} | {feat_noisy[k]:20.4f}")
"""

c4_4_pitfalls = [
    "Menghitung entropi tanpa memeriksa kondisi $p(i, j) = 0$, yang memicu `ValueError: math domain error` atau peringatan `RuntimeWarning: divide by zero encountered in log2`.",
    "Mengabaikan ketergantungan fitur terhadap orientasi $\\theta$; untuk mencapai invariansi rotasi tekstur, fitur biasanya dihitung pada 4 sudut ($0^\\circ, 45^\\circ, 90^\\circ, 135^\\circ$) lalu dirata-ratakan.",
    "Mencampuradukkan istilah Energi (Energy) dan Angular Second Moment (ASM); Energi adalah akar kuadrat dari ASM."
]

c4_4_refs = [
    {
        "title": "Textural Features for Image Classification",
        "authors": ["Robert M. Haralick", "K. Shanmugam", "Its'Hak Dinstein"],
        "year": 1973,
        "publisherOrVenue": "IEEE Transactions on Systems, Man, and Cybernetics",
        "url": "https://doi.org/10.1109/TSMC.1973.4309314",
        "relevance": "Persamaan analitis 14 fitur tekstur Haralick."
    }
]

subchapters.append(create_subchapter("computer-vision-ch4-sub4", "4.4. Fitur Tekstur Haralick (Kontras, Disimilaritas, Homogenitas, Energi)", c4_4_desc, c4_4_md, c4_4_code, c4_4_pitfalls, c4_4_refs))

# ==============================================================================
# SUBCHAPTER 4.5: Local Binary Patterns (LBP) untuk Pengenalan Tekstur Wajah
# ==============================================================================
c4_5_desc = "Operator tekstur mikro Local Binary Patterns (LBP), ambang batas 3x3, bobot biner berpangkat dua, invariansi pencahayaan monotonik, dan variasi sirkular LBP(P, R)."
c4_5_md = """Operator **Local Binary Patterns (LBP)** (Ojala et al., 1996, 2002) adalah salah satu deskriptor tekstur visual paling efisien dan populer untuk pengenalan wajah (*face recognition*), analisis pola kain, dan klasifikasi tekstur permukaan.

### 1. Formulasi Operator LBP $3 \\times 3$ Dasar
Pada setiap piksel pusat $p_c$ dengan intensitas $I(x_c, y_c)$, intensitas 8 piksel tetangganya $p_p$ ($p = 0, 1, \\dots, 7$) dibandingkan dengan nilai pusat:

$$s(I(p_p) - I(p_c)) = \\begin{cases} 1 & \\text{jika } I(p_p) \\ge I(p_c) \\\\ 0 & \\text{jika } I(p_p) < I(p_c) \\end{cases}$$

Nilai biner 8-bit yang dihasilkan dikalikan dengan bobot binomial berpangkat dua $2^p$ searah jarum jam untuk membentuk kode desimal tunggal:

$$\\operatorname{LBP}(x_c, y_c) = \\sum_{p=0}^{7} s(I(p_p) - I(p_c)) \\cdot 2^p, \\quad \\operatorname{LBP} \\in [0, 255]$$

### 2. Invariansi Transformasi Monotonik Abu-abu
Keunggulan fundamental LBP adalah sifat invariansi mutlak terhadap transformasi pencahayaan monotonik:
Jika seluruh piksel mengalami pergeseran pencahayaan linear maupun non-linear strictly increasing $g(x) = f(x) + c$, relasi urutan biner tanda $s(g(p_p) - g(p_c)) = s(p_p - p_c)$ tidak berubah sama sekali!

### 3. Ekstensi Sirkular $\\operatorname{LBP}_{P, R}$
Untuk mengatasi batasan kisi kaku $3 \\times 3$, Ojala merumuskan lingkungan sirkular dengan $P$ titik sampel pada radius lingkaran $R$:
$$x_p = x_c + R \\cos\\left(\\frac{2\\pi p}{P}\\right), \\quad y_p = y_c - R \\sin\\left(\\frac{2\\pi p}{P}\\right)$$
Nilai piksel pada koordinat kontinu diinterpolasi menggunakan interpolasi bilinear."""

c4_5_code = r"""import numpy as np

def compute_lbp_basic_3x3(patch_3x3: np.ndarray) -> int:
    '''Menghitung kode desimal LBP 8-bit untuk patch 3x3 di sekitar piksel pusat.'''
    center = patch_3x3[1, 1]
    
    # 8 Tetangga diurutkan searah jarum jam mulai dari Top-Left:
    # (0,0), (0,1), (0,2), (1,2), (2,2), (2,1), (2,0), (1,0)
    neighbors = [
        patch_3x3[0, 0], patch_3x3[0, 1], patch_3x3[0, 2],
        patch_3x3[1, 2], patch_3x3[2, 2], patch_3x3[2, 1],
        patch_3x3[2, 0], patch_3x3[1, 0]
    ]
    
    lbp_code = 0
    for p, val in enumerate(neighbors):
        bit = 1 if val >= center else 0
        lbp_code |= (bit << p)
        
    return lbp_code

# Patch 3x3 Asli (Spot Terang di Tengah / Local Peak)
patch_peak = np.array([
    [ 50,  60,  55],
    [ 40, 200,  45],  # Pusat 200 (lebih besar dari seluruh tetangganya)
    [ 60,  50,  55]
], dtype=np.uint8)

# Patch 3x3 Transisi Tepi Miring (Edge Patch)
patch_edge = np.array([
    [ 20,  30, 210],
    [ 25, 100, 220],
    [ 30,  35, 215]
], dtype=np.uint8)

code_peak = compute_lbp_basic_3x3(patch_peak)
code_edge = compute_lbp_basic_3x3(patch_edge)

print("--- Demonstrasi Operator Local Binary Patterns (LBP) ---")
print("Patch Titik Puncak (Pusat Dominan):\n", patch_peak)
print(f"Kode LBP Titik Puncak : {code_peak} (Binary: {code_peak:08b} - Seluruh bit 0 karena pusat > tetangga)")
print("\nPatch Transisi Tepi:\n", patch_edge)
print(f"Kode LBP Transisi Tepi: {code_edge} (Binary: {code_edge:08b})")
"""

c4_5_pitfalls = [
    "Urutan pelabelan tetangga yang tidak konsisten antar modul (misal: dimulai dari Timur vs Barat Laut), menghasilkan histogram LBP yang tidak dapat dicocokkan satu sama lain.",
    "LBP dasar sangat sensitif terhadap derau acak pada area datar yang homogen, di mana fluktuasi intensitas $\\pm 1$ dapat membalikkan bit biner dari 0 ke 1 (diatasi dengan Local Ternary Patterns / LTP).",
    "Dimensi histogram LBP sirkular tanpa pola seragam (*uniform patterns*): untuk $P=16$ titik sampel, dimensi histogram membengkak menjadi $2^{16} = 65.536$ bin."
]

c4_5_refs = [
    {
        "title": "Multiresolution Gray-Scale and Rotation Invariant Texture Classification with Local Binary Patterns",
        "authors": ["Timo Ojala", "Matti Pietikäinen", "Topi Mäenpää"],
        "year": 2002,
        "publisherOrVenue": "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)",
        "url": "https://doi.org/10.1109/TPAMI.2002.1017623",
        "relevance": "Paper kanonikal LBP sirkular dan pola seragam (uniform patterns)."
    }
]

subchapters.append(create_subchapter("computer-vision-ch4-sub4", "4.4. Fitur Tekstur Haralick (Kontras, Disimilaritas, Homogenitas, Energi)", c4_4_desc, c4_4_md, c4_4_code, c4_4_pitfalls, c4_4_refs))

# Note: ensure correct mapping for 4.5
subchapters[-1] = create_subchapter("computer-vision-ch4-sub5", "4.5. Local Binary Patterns (LBP) untuk Pengenalan Tekstur Wajah", c4_5_desc, c4_5_md, c4_5_code, c4_5_pitfalls, c4_5_refs)

# ==============================================================================
# SUBCHAPTER 4.6: Histogram of Oriented Gradients (HOG - Dalal & Triggs, 2005)
# ==============================================================================
c4_6_desc = "Filosofi fitur penampakan bentuk lokal Dalal & Triggs (2005), invariansi bentuk tubuh manusia terhadap variasi pakaian, dan pipeline arsitektur HOG."
c4_6_md = """Pada konferensi CVPR 2005, Navneet Dalal dan Bill Triggs memperkenalkan **Histogram of Oriented Gradients (HOG)** untuk deteksi pejalan kaki (*pedestrian detection*). Paper ini merevolusi bidang visi komputer sebelum era deep learning.

### 1. Filosofi Representasi HOG
Premis ilmiah Dalal & Triggs adalah bahwa **penampakan dan bentuk objek lokal dapat dikarakterisasi secara sangat baik melalui distribusi gradien intensitas lokal atau arah tepi**, bahkan tanpa pengetahuan presisi mengenai posisi tepi absolut.

Fitur HOG memberikan kekebalan (*invariance*) terhadap:
- Variasi warna dan tekstur pakaian (karena menggunakan arah gradien tepi siluet tubuh, bukan warna).
- Perubahan pencahayaan fotometrik global (melalui normalisasi blok kontras lokal).
- Deformasi dan variasi pose kecil (melalui perataan spasial pada sel-sel berukuran $8 \\times 8$ piksel).

### 2. Arsitektur Pipeline HOG Standar
Untuk jendela deteksi kanonikal $64 \\times 128$ piksel:
1. **Kalkulasi Gradien**: Menghitung $G_x$ dan $G_y$ menggunakan filter diferensial 1D tanpa penghalusan ($[-1, 0, 1]$).
2. **Spatial / Orientation Binning**: Membagi citra ke dalam sel grid kecil ($8 \\times 8$ piksel) dan memetakan gradien ke histogram 9 bin orientasi.
3. **Normalisasi Blok**: Mengelompokkan sel ke dalam blok $2 \\times 2$ yang bertumpang tindih (*overlapping*) untuk normalisasi kontras.
4. **Vektor Fitur & Klasifikasi**: Menggabungkan seluruh vektor blok menjadi satu deskriptor panjang (3.780 dimensi) untuk diklasifikasikan oleh Linear SVM."""

c4_6_code = r"""import numpy as np

def compute_gradient_1d_centered(image: np.ndarray):
    '''Kalkulasi gradien 1D terpusat Dalal-Triggs menggunakan kernel [-1, 0, 1].'''
    H, W = image.shape
    gx = np.zeros_like(image, dtype=np.float64)
    gy = np.zeros_like(image, dtype=np.float64)
    
    # Gradien horizontal Gx: I(x+1) - I(x-1)
    gx[:, 1:-1] = image[:, 2:] - image[:, :-2]
    # Gradien vertikal Gy: I(y+1) - I(y-1)
    gy[1:-1, :] = image[2:, :] - image[:-2, :]
    
    mag = np.sqrt(gx**2 + gy**2)
    # Sudut tak berarah [0, 180) derajat
    ang = (np.degrees(np.arctan2(gy, gx))) % 180.0
    return mag, ang

# Citra Sederhana 6x6 dengan Siluet Tubuh Vertikal di Tengah
pedestrian_patch = np.zeros((6, 6), dtype=np.float64)
pedestrian_patch[:, 2:4] = 180.0  # Siluet vertikal pejalan kaki

mag, ang = compute_gradient_1d_centered(pedestrian_patch)

print("--- Ekstraksi Gradien Dalal & Triggs HOG ---")
print("Citra Siluet Vertikal:\n", pedestrian_patch)
print("\nMagnitudo Gradien Tepi:\n", mag.round(1))
print("\nSudut Orientasi Gradien Tepi (Kolom 1=0°, Kolom 3=0°):\n", ang.round(1))
print("\nObservasi: Pada batas siluet vertikal, orientasi gradien terpusat tajam pada 0°.")
"""

c4_6_pitfalls = [
    "Menerapkan Gaussian blur tebal sebelum menghitung gradien HOG; Dalal & Triggs menemukan secara empiris bahwa menggunakan kernel turunan $[-1, 0, 1]$ tanpa smoothing awal mempertahankan tepi halus yang esensial untuk deteksi pejalan kaki.",
    "Menggunakan orientasi bertanda (*signed gradients* $0-360^\\circ$); untuk deteksi pejalan kaki, orientasi tak bertanda (*unsigned gradients* $0-180^\\circ$) terbukti secara konsisten mengungguli karena tidak terpengaruh oleh warna baju terang vs gelap.",
    "Menghitung sel tanpa normalisasi blok lokal, yang menyebabkan fitur HOG sangat rentan terhadap variasi bayangan dan kontras matahari."
]

c4_6_refs = [
    {
        "title": "Histograms of Oriented Gradients for Human Detection",
        "authors": ["Navneet Dalal", "Bill Triggs"],
        "year": 2005,
        "publisherOrVenue": "IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR)",
        "url": "https://doi.org/10.1109/CVPR.2005.177",
        "relevance": "Paper kanonikal fundamental penemu deskriptor HOG untuk deteksi pejalan kaki."
    }
]

subchapters.append(create_subchapter("computer-vision-ch4-sub6", "4.6. Histogram of Oriented Gradients (HOG - Dalal & Triggs, 2005)", c4_6_desc, c4_6_md, c4_6_code, c4_6_pitfalls, c4_6_refs))

# ==============================================================================
# SUBCHAPTER 4.7: Pembagian Sel Grid, Voting Sudut & Interpolasi Trilinear HOG
# ==============================================================================
c4_7_desc = "Pembagian sel spasial 8x8 piksel, histogram 9 bin orientasi (0-180 derajat), voting bobot magnitudo, dan interpolasi trilinear kontinu spasial-orientasi."
c4_7_md = """Pada tahap spatial binning HOG, informasi gradien piksel individual diagregasikan ke dalam sel spasial kompak.

### 1. Pembagian Sel Spasial & 9 Bin Orientasi
Citra dibagi menjadi sel-sel grid independen berukuran $8 \\times 8$ piksel. Di setiap sel, histogram orientasi gradien 1D dibentuk dengan **9 kantong (*bins*)** yang mencakup rentang tak bertanda $[0^\\circ, 180^\\circ)$, masing-masing selebar $20^\\circ$:
- Bin 0: Pusat $0^\\circ$ (rentang $0^\\circ - 20^\\circ$)
- Bin 1: Pusat $20^\\circ$ (rentang $20^\\circ - 40^\\circ$)
- ...
- Bin 8: Pusat $160^\\circ$ (rentang $160^\\circ - 180^\\circ$)

### 2. Voting Bobot Magnitudo Gradien
Setiap piksel memberikan suara (*vote*) ke dalam bin histogram sebanding dengan **magnitudo gradiennya** $M(x, y)$ (bukan suara seragam bernilai 1). Dengan demikian, tepi yang tajam dan kontras memberikan kontribusi dominan pada profil bentuk, sedangkan fluktuasi derau halus terabaikan.

### 3. Interpolasi Trilinear (Trilinear Interpolation)
Untuk mencegah diskontinuitas kasar (*aliasing*) saat suatu piksel melintasi batas sel atau batas bin sudut, voting didistribusikan secara halus ke **8 sel-bin terdekat** melalui interpolasi linier 3 arah:
1. Interpolasi linear pada sumbu horizontal sel ($x$).
2. Interpolasi linear pada sumbu vertikal sel ($y$).
3. Interpolasi linear pada sumbu sudut orientasi ($\\theta$)."""

c4_7_code = r"""import numpy as np

def vote_gradient_to_bins(magnitude: float, angle_deg: float, num_bins: int = 9) -> np.ndarray:
    '''Mendistribusikan voting magnitudo gradien secara linier ke dua bin sudut terdekat.'''
    hist = np.zeros(num_bins, dtype=np.float64)
    bin_width = 180.0 / num_bins  # 20 derajat per bin
    
    # Normalisasi sudut ke rentang [0, 180)
    ang = angle_deg % 180.0
    
    # Hitung posisi kontinu dalam indeks bin (pusat bin: 10, 30, 50, ...)
    # Pergeseran -bin_width/2 agar bin 0 berpusat pada 0° (simetris melingkar)
    cont_bin = (ang / bin_width) - 0.5
    idx_low = int(np.floor(cont_bin))
    idx_high = idx_low + 1
    
    weight_high = cont_bin - idx_low
    weight_low = 1.0 - weight_high
    
    # Modulo sirkular untuk penanganan sudut melingkar di sekitar 0 dan 180 derajat
    idx_low_mod = idx_low % num_bins
    idx_high_mod = idx_high % num_bins
    
    hist[idx_low_mod] += magnitude * weight_low
    hist[idx_high_mod] += magnitude * weight_high
    return hist

# Uji voting piksel dengan sudut 25 derajat (berada di antara bin 1 (20°) dan bin 2 (40°))
mag_test = 100.0
ang_test = 25.0
hist_vote = vote_gradient_to_bins(mag_test, ang_test, num_bins=9)

print("--- Voting Sudut Orientasi HOG dengan Interpolasi Linier ---")
print(f"Piksel Input: Magnitudo={mag_test:.1f}, Sudut={ang_test:.1f}°")
print("Distribusi Histogram 9-Bin (Lebar 20° per bin):")
for b in range(9):
    center = b * 20.0
    if hist_vote[b] > 0:
        print(f"  Bin {b} (Pusat {center:4.1f}°): Bobot Suara = {hist_vote[b]:.2f}")
    else:
        print(f"  Bin {b} (Pusat {center:4.1f}°): 0.0")

print(f"\nTotal Akumulasi Voting: {np.sum(hist_vote):.1f} (Konservasi Energi Magnitudo Penuh)")
"""

c4_7_pitfalls = [
    "Memasukkan seluruh magnitudo gradien ke satu bin terdekat (*hard assignment*), yang menyebabkan perubahan deskriptor yang tidak stabil ketika objek sedikit berotasi.",
    "Lupa memperlakukan sudut sebagai variabel periodik sirkular: sudut $175^\\circ$ dan $5^\\circ$ bertetangga secara sirkular melintasi diskontinuitas $0^\\circ/180^\\circ$.",
    "Mengabaikan interpolasi spasial antar-sel: piksel yang terletak tepat di perbatasan dua sel harus mendistribusikan suaranya ke kedua sel tersebut."
]

c4_7_refs = [
    {
        "title": "Histograms of Oriented Gradients for Human Detection",
        "authors": ["Navneet Dalal", "Bill Triggs"],
        "year": 2005,
        "publisherOrVenue": "IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR)",
        "url": "https://doi.org/10.1109/CVPR.2005.177",
        "relevance": "Bagian 3: Spatial and Orientation Binning, Trilinear interpolation."
    }
]

subchapters.append(create_subchapter("computer-vision-ch4-sub7", "4.7. Pembagian Sel Grid, Voting Sudut & Interpolasi Trilinear HOG", c4_7_desc, c4_7_md, c4_7_code, c4_7_pitfalls, c4_7_refs))

# ==============================================================================
# SUBCHAPTER 4.8: Normalisasi Blok HOG (L2-Hys / L2-Norm Clamped)
# ==============================================================================
c4_8_desc = "Skema pengelompokan sel ke blok 2x2 tumpang tindih (overlapping blocks), formulasi normalisasi L2-norm, L1-sqrt, dan L2-Hys (clamped 0.2)."
c4_8_md = """Gradien intensitas sangat bergantung pada kontras pencahayaan lokal. Untuk mencapai invariansi terhadap bayangan, variasi kontras, dan iluminasi, vektor fitur sel dinormalisasi dalam blok spasial lokal.

### 1. Struktur Blok Tumpang Tindih (*Overlapping Blocks*)
Dalal & Triggs menggunakan blok persegi panjang berukuran $2 \\times 2$ sel (atau $16 \\times 16$ piksel). Setiap blok menggabungkan vektor fitur dari 4 sel di dalamnya menjadi vektor gabungan sepanjang:
$$4 \\text{ sel} \\times 9 \\text{ bin/sel} = 36 \\text{ dimensi}$$

Blok bergeser (*stride*) sejauh $1$ sel ($8$ piksel). Akibatnya, setiap sel internal berkontribusi pada **4 blok yang berbeda**, masing-masing dinormalisasi terhadap konteks lingkungan lokal yang berbeda. Redundansi terstruktur ini meningkatkan diskriminasi pengenalan secara signifikan.

### 2. Skema Normalisasi $L_2\\text{-Hys}$ (L2-Hysteresis)
Diberikan vektor gabungan blok tak-ternormalisasi $\\mathbf{v} \\in \\mathbb{R}^{36}$:

1. **Normalisasi $L_2$-norm standar**:
   $$\\mathbf{v}' = \\frac{\\mathbf{v}}{\\sqrt{\\|\\mathbf{v}\\|_2^2 + \\epsilon^2}}$$
   Di mana $\\epsilon$ adalah konstanta regulasi kecil untuk mencegah pembagian dengan nol pada area kosong.

2. **Pemotongan Ambang Batas (*Clipping / Hysteresis*)**:
   Komponen vektor yang bernilai sangat tinggi dipotong pada ambang batas $0.2$:
   $$v''_k = \\min(v'_k, 0.2), \\quad \\forall k$$
   Langkah ini menekan dampak gradien non-linear ekstrem yang disebabkan oleh kilauan cahaya (*specular highlights*).

3. **Renormalisasi Ulang**:
   $$\\mathbf{v}_{\\text{final}} = \\frac{\\mathbf{v}''}{\\sqrt{\\|\\mathbf{v}''\\|_2^2 + \\epsilon^2}}$$"""

c4_8_code = r"""import numpy as np

def normalize_l2_hys(v: np.ndarray, clip_threshold: float = 0.2, eps: float = 1e-4) -> np.ndarray:
    '''Normalisasi blok HOG L2-Hys (L2-norm dengan clipping 0.2 dan re-normalisasi).'''
    # 1. Tahap 1: L2-norm dasar
    l2_norm = np.sqrt(np.sum(v ** 2) + eps**2)
    v_prime = v / l2_norm
    
    # 2. Tahap 2: Clipping pada batas maksimum 0.2
    v_clipped = np.clip(v_prime, 0.0, clip_threshold)
    
    # 3. Tahap 3: Re-normalisasi L2-norm
    l2_norm_clipped = np.sqrt(np.sum(v_clipped ** 2) + eps**2)
    v_final = v_clipped / l2_norm_clipped
    return v_final

# Buat Vektor Blok HOG Sintetis 36 Dimensi (4 Sel x 9 Bin)
# Memuat satu fitur gradien sangat ekstrem akibat kilauan cahaya (specular flare) di bin ke-0
np.random.seed(42)
block_features = np.random.uniform(1.0, 5.0, 36)
block_features[0] = 100.0  # Kilauan ekstrem

# Bandingkan L2-norm murni vs L2-Hys
l2_standard = block_features / np.sqrt(np.sum(block_features**2) + 1e-4)
l2_hys = normalize_l2_hys(block_features, clip_threshold=0.2)

print("--- Uji Komparasi Normalisasi Blok HOG (L2 vs L2-Hys) ---")
print(f"Nilai Elemen Ekstrem [0] Sebelum Normalisasi : {block_features[0]:.1f}")
print(f"Nilai Elemen Ekstrem [0] Pasca-L2 Standar     : {l2_standard[0]:.4f} (Mendominasi 98% energi vektor)")
print(f"Nilai Elemen Ekstrem [0] Pasca-L2-Hys Clamped : {l2_hys[0]:.4f} (Terpotong aman pada bobot proporsional)")
print(f"Norma Akhir Vektor L2-Hys                     : {np.linalg.norm(l2_hys):.6f} (Unit Length 1.0)")
"""

c4_8_pitfalls = [
    "Mengabaikan konstanta regulasi $\\epsilon$, menyebabkan `FloatingPointError` atau `NaN` pada blok citra yang sepenuhnya seragam (seperti langit biru atau latar belakang gelap).",
    "Menghitung normalisasi secara global untuk seluruh citra alih-alih per blok lokal bertumpang-tindih; normalisasi lokal adalah kunci ketahanan HOG terhadap variasi bayangan parsial.",
    "Lupa melakukan re-normalisasi setelah tahap *clipping* $0.2$, yang menyebabkan panjang vektor tidak lagi bernilai satu (*unit length*)."
]

c4_8_refs = [
    {
        "title": "Histograms of Oriented Gradients for Human Detection",
        "authors": ["Navneet Dalal", "Bill Triggs"],
        "year": 2005,
        "publisherOrVenue": "IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR)",
        "url": "https://doi.org/10.1109/CVPR.2005.177",
        "relevance": "Bagian 4: Block Normalization Schemes (L2-Hys, L2-norm, L1-sqrt)."
    }
]

subchapters.append(create_subchapter("computer-vision-ch4-sub8", "4.8. Normalisasi Blok HOG (L2-Hys / L2-Norm Clamped)", c4_8_desc, c4_8_md, c4_8_code, c4_8_pitfalls, c4_8_refs))

# ==============================================================================
# SUBCHAPTER 4.9: Deteksi Pejalan Kaki (Pedestrian Detection) Menggunakan HOG + Linear SVM
# ==============================================================================
c4_9_desc = "Arsitektur deteksi objek klasik sliding window, kalkulasi skor margin SVM w^T x + b, thresholding kepercayaan, dan Non-Maximum Suppression (NMS) bounding box."
c4_9_md = """Pipeline deteksi pejalan kaki klasik menggabungkan ekstraksi deskriptor HOG dengan pengklasifikasi **Support Vector Machine (SVM) Linear**.

### 1. Klasifikasi Margin SVM Linear
Diberikan vektor deskriptor HOG $\\mathbf{x} \\in \\mathbb{R}^{3780}$ dari suatu jendela deteksi kandidat, model SVM linear menghitung skor keputusan:

$$f(\\mathbf{x}) = \\mathbf{w}^T \\mathbf{x} + b$$

Di mana:
- $\\mathbf{w}$ adalah vektor bobot hiperbidang optimal yang dipelajari selama pelatihan.
- $b$ adalah bias skalar.
- Jika $f(\\mathbf{x}) > \\text{threshold}$ (biasanya $0.0$), jendela diklasifikasikan sebagai pejalan kaki (*pedestrian*).

### 2. Multi-Scale Sliding Window & Bounding Box NMS
Karena pejalan kaki dapat muncul pada berbagai ukuran jarak dan posisi dalam citra:
1. Citra diperkecil secara bertingkat membentuk **Piramida Citra** (*Image Pyramid*) dengan faktor skala (misal $1.05\\times$).
2. Jendela kanonikal $64 \\times 128$ piksel digeser di setiap tingkat piramida.
3. Seluruh jendela dengan skor SVM tinggi memicu beberapa deteksi tumpang tindih untuk objek pejalan kaki yang sama.
4. **Bounding Box Non-Maximum Suppression (NMS)** mengeliminasi duplikasi deteksi berdasarkan metrik *Intersection over Union* (IoU):
   $$\\operatorname{IoU}(B_1, B_2) = \\frac{\\operatorname{Area}(B_1 \\cap B_2)}{\\operatorname{Area}(B_1 \\cup B_2)}$$"""

c4_9_code = r"""import numpy as np

def bounding_box_nms(boxes: np.ndarray, scores: np.ndarray, iou_threshold: float = 0.5) -> list:
    '''Eliminasi duplikasi deteksi kotak pembatas (Bounding Box NMS).'''
    if len(boxes) == 0:
        return []
        
    x1 = boxes[:, 0]
    y1 = boxes[:, 1]
    x2 = boxes[:, 2]
    y2 = boxes[:, 3]
    areas = (x2 - x1) * (y2 - y1)
    
    # Urutkan berdasarkan skor SVM tertinggi
    order = scores.argsort()[::-1]
    keep = []
    
    while len(order) > 0:
        i = order[0]
        keep.append(i)
        if len(order) == 1:
            break
            
        # Hitung koordinat perpotongan (Intersection)
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])
        
        w = np.maximum(0.0, xx2 - xx1)
        h = np.maximum(0.0, yy2 - yy1)
        intersection = w * h
        
        # Hitung IoU
        union = areas[i] + areas[order[1:]] - intersection
        iou = intersection / union
        
        # Pertahankan hanya kotak dengan IoU di bawah ambang batas (tidak tumpang tindih berlebih)
        inds = np.where(iou <= iou_threshold)[0]
        order = order[inds + 1]
        
    return keep

# Simulasikan 3 Kotak Deteksi Tumpang Tindih di Sekitar 1 Pejalan Kaki
# Format: [x1, y1, x2, y2]
detected_boxes = np.array([
    [100.0, 100.0, 164.0, 228.0],  # Deteksi Utama (Skor 2.8)
    [105.0, 102.0, 168.0, 230.0],  # Duplikasi Geser Tipis (Skor 2.1)
    [ 98.0,  99.0, 160.0, 225.0],  # Duplikasi Geser Tipis (Skor 1.5)
    [300.0, 150.0, 364.0, 278.0]   # Pejalan Kaki Kedua Terpisah (Skor 2.4)
], dtype=np.float64)

svm_scores = np.array([2.8, 2.1, 1.5, 2.4], dtype=np.float64)

kept_indices = bounding_box_nms(detected_boxes, svm_scores, iou_threshold=0.3)

print("--- Hasil Bounding Box NMS pada Deteksi Pejalan Kaki HOG+SVM ---")
print(f"Jumlah Kotak Deteksi Mentah: {len(detected_boxes)}")
print(f"Kotak yang Dipertahankan Setelah NMS: {len(kept_indices)} kotak (Indeks: {kept_indices})")
for idx in kept_indices:
    box = detected_boxes[idx].astype(int)
    print(f"  Deteksi Terverifikasi: Koordinat={box.tolist()} | Skor SVM={svm_scores[idx]:.2f}")
"""

c4_9_pitfalls = [
    "Menggunakan Linear SVM tanpa penambangan contoh negatif keras (*hard negative mining*); model awal akan menghasilkan ribuan positif palsu (*false positives*) pada cabang pohon atau tiang lampu jalan.",
    "Langkah pergeseran jendela (*sliding window stride*) yang terlalu lebar menyebabkan terlewatnya objek pejalan kaki yang berada di antara langkah grid.",
    "Mengabaikan rasio aspek pejalan kaki standar ($1:2$ rasio lebar:tinggi) saat menerapkan jendela deteksi."
]

c4_9_refs = [
    {
        "title": "Histograms of Oriented Gradients for Human Detection",
        "authors": ["Navneet Dalal", "Bill Triggs"],
        "year": 2005,
        "publisherOrVenue": "IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR)",
        "url": "https://doi.org/10.1109/CVPR.2005.177",
        "relevance": "Bagian 6: Linear SVM training, Hard negative mining, and Pedestrian detection performance."
    }
]

subchapters.append(create_subchapter("computer-vision-ch4-sub9", "4.9. Deteksi Pejalan Kaki (Pedestrian Detection) Menggunakan HOG + Linear SVM", c4_9_desc, c4_9_md, c4_9_code, c4_9_pitfalls, c4_9_refs))

# ==============================================================================
# SUBCHAPTER 4.10: Analisis Efisiensi Komputasi & Dimensi Vektor Deskriptor HOG
# ==============================================================================
c4_10_desc = "Derivasi matematis dimensi vektor deskriptor HOG (3.780 dimensi), pemetaan tata letak memori, efisiensi citra integral untuk percepatan inferensi."
c4_10_md = """Memahami komposisi dimensi vektor fitur HOG sangat penting untuk mendesain pipeline visi komputer berlatensi rendah dan menentukan kebutuhan memori model.

### 1. Derivasi Matematis Dimensi HOG Baku
Untuk jendela deteksi standar Dalal & Triggs berukuran $W = 64$ dan $H = 128$ piksel:
- Ukuran sel: $8 \\times 8$ piksel.
- Jumlah sel horizontal: $N_x = 64 / 8 = 8$ sel.
- Jumlah sel vertikal: $N_y = 128 / 8 = 16$ sel.
- Ukuran blok: $2 \\times 2$ sel ($16 \\times 16$ piksel).
- Pergeseran blok (*block stride*): $1$ sel ($8$ piksel).

Jumlah blok horizontal:
$$B_x = (N_x - 2) + 1 = 8 - 2 + 1 = 7 \\text{ blok}$$

Jumlah blok vertikal:
$$B_y = (N_y - 2) + 1 = 16 - 2 + 1 = 15 \\text{ blok}$$

Total jumlah blok per jendela deteksi:
$$B_{\\text{total}} = B_x \\times B_y = 7 \\times 15 = 105 \\text{ blok}$$

Setiap blok memuat $2 \\times 2 = 4$ sel, dan setiap sel memiliki $9$ bin histogram orientasi. Maka panjang vektor per blok adalah:
$$D_{\\text{block}} = 4 \\times 9 = 36 \\text{ dimensi}$$

Total dimensi akhir vektor deskriptor HOG:
$$D_{\\text{total}} = B_{\\text{total}} \\times D_{\\text{block}} = 105 \\times 36 = \\mathbf{3.780 \\text{ dimensi}}$$

### 2. Optimasi Kecepatan: Integral Histograms
Menghitung histogram gradien berulang kali untuk ribuan jendela sliding window sangat mahal. Porikli (2005) mengadaptasi konsep *Integral Images* Viola-Jones ke dalam **Integral Histograms**: dengan menyimpan akumulasi histogram integral, histogram sel berukuran arbitrer dapat dievaluasi hanya dalam 4 kali pembacaan array memori $\\mathcal{O}(1)$."""

c4_10_code = r"""import numpy as np

def calculate_hog_descriptor_dimension(win_w: int, win_h: int, cell_size: int, block_size_cells: int, num_bins: int):
    '''Menghitung secara analitis jumlah blok dan total dimensi vektor fitur HOG.'''
    cells_x = win_w // cell_size
    cells_y = win_h // cell_size
    
    blocks_x = cells_x - block_size_cells + 1
    blocks_y = cells_y - block_size_cells + 1
    
    total_blocks = blocks_x * blocks_y
    dims_per_block = (block_size_cells ** 2) * num_bins
    total_dimensions = total_blocks * dims_per_block
    
    return {
        "cells_grid": (cells_x, cells_y),
        "blocks_grid": (blocks_x, blocks_y),
        "total_blocks": total_blocks,
        "dims_per_block": dims_per_block,
        "total_dimensions": total_dimensions
    }

# Konfigurasi Standar Dalal-Triggs: Jendela 64x128, Sel 8x8, Blok 2x2 sel, 9 Bin
config_standard = calculate_hog_descriptor_dimension(
    win_w=64, win_h=128, cell_size=8, block_size_cells=2, num_bins=9
)

# Konfigurasi Mobil / Rambu Lalu Lintas: Jendela 64x64 Bujursangkar
config_square = calculate_hog_descriptor_dimension(
    win_w=64, win_h=64, cell_size=8, block_size_cells=2, num_bins=9
)

print("--- Analisis Dimensi Vektor Deskriptor HOG ---")
print("1. Standar Pejalan Kaki (64x128 piksel):")
for k, v in config_standard.items():
    print(f"   - {k:18s}: {v}")

print(f"\n2. Deteksi Rambu Bujursangkar (64x64 piksel):")
for k, v in config_square.items():
    print(f"   - {k:18s}: {v}")

# Verifikasi Aljabar: 105 blok * 36 dimensi = 3780 dimensi
assert config_standard["total_dimensions"] == 3780, "Dimensi HOG standar harus tepat 3.780"
print("\nStatus Validasi: Perhitungan matematis dimensi HOG terbukti eksak 3.780 dimensi.")
"""

c4_10_pitfalls = [
    "Salah menghitung jumlah blok karena melupakan sifat tumpang tindih (*overlap*): $B_x = N_x - 1$ jika ukuran blok $2 \\times 2$ dan pergeseran stride adalah 1 sel.",
    "Mengalokasikan memori vektor baru pada setiap pergeseran jendela sliding window tanpa menggunakan buffer array terpadu (*pre-allocated memory*), memicu *garbage collection pauses* parah.",
    "Mencoba melatih model non-linear SVM (seperti RBF kernel) pada jutaan sampel vektor 3.780 dimensi; kompleksitas kuadratik $\\mathcal{O}(N^2)$ akan menyebabkan waktu pelatihan memakan waktu berhari-hari (selalu gunakan Linear SVM seperti LIBLINEAR)."
]

c4_10_refs = [
    {
        "title": "Histograms of Oriented Gradients for Human Detection",
        "authors": ["Navneet Dalal", "Bill Triggs"],
        "year": 2005,
        "publisherOrVenue": "IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR)",
        "url": "https://doi.org/10.1109/CVPR.2005.177",
        "relevance": "Bagian 6.1: Implementation details and detector window dimension parameters."
    }
]

subchapters.append(create_subchapter("computer-vision-ch4-sub10", "4.10. Analisis Efisiensi Komputasi & Dimensi Vektor Deskriptor HOG", c4_10_desc, c4_10_md, c4_10_code, c4_10_pitfalls, c4_10_refs))

# ==============================================================================
# SAVE JSON OUTPUT
# ==============================================================================
output_path = os.path.join(os.path.dirname(__file__), "cv_ch4_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 4 data with {len(subchapters)} subchapters: {output_path}")
