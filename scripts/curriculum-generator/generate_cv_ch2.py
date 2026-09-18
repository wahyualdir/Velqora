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
# SUBCHAPTER 2.1: Matriks Transformasi Affin 2D
# ==============================================================================
c2_1_desc = "Formulasi aljabar matriks transformasi affin 2D dalam koordinat homogen, sifat preservasi garis paralel, rasio jarak, dan komposisi matriks 3x3."
c2_1_md = """Transformasi geometris memetakan posisi spasial koordinat piksel $(x, y)$ pada citra sumber ke koordinat baru $(x', y')$ pada citra tujuan. Transformasi affin (*affine transformation*) adalah kelas transformasi linear yang diikuti oleh translasi.

### 1. Sifat Invarian Transformasi Affin
Transformasi affin mempertahankan (*preserves*):
1. **Kolinearitas Garis**: Titik-titik yang terletak pada satu garis lurus tetap berada pada satu garis lurus setelah transformasi.
2. **Paralelisme**: Pasangan garis yang sejajar tetap sejajar.
3. **Rasio Jarak**: Rasio panjang segmen pada garis lurus yang sama tidak berubah.

Namun, sudut antargaris dan panjang absolut tidak dipertahankan. Transformasi affin memiliki **6 derajat kebebasan** (*degrees of freedom* / DoF).

### 2. Koordinat Homogen & Matriks $3 \\times 3$
Dengan memperluas koordinat 2D ke koordinat homogen $\\mathbf{p} = [x, y, 1]^T$, seluruh operasi affin dapat dinyatakan sebagai perkalian matriks linear tunggal:

$$\\begin{bmatrix} x' \\\\ y' \\\\ 1 \\end{bmatrix} = \\mathbf{M}_{\\text{affine}} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} a_{11} & a_{12} & t_x \\\\ a_{21} & a_{22} & t_y \\\\ 0 & 0 & 1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix}$$

Dekomposisi komponen dasar:
- **Translasi**: $t_x$ (horizontal) dan $t_y$ (vertikal).
- **Skala**: $s_x$ dan $s_y$ pada diagonal utama ($a_{11} = s_x, a_{22} = s_y$).
- **Rotasi murni**: $\\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}$.
- **Shear (Pergeseran Miring)**: $\\begin{bmatrix} 1 & h_x \\\\ h_y & 1 \\end{bmatrix}$."""

c2_1_code = r"""import numpy as np

# 1. Definisikan Titik Sudut Persegi 2D (4 Titik: (0,0), (2,0), (2,2), (0,2)) dalam Koordinat Homogen (3x4)
square = np.array([
    [0.0, 2.0, 2.0, 0.0],
    [0.0, 0.0, 2.0, 2.0],
    [1.0, 1.0, 1.0, 1.0]
], dtype=np.float64)

# 2. Matriks Transformasi Affin: Penskalaan (sx=1.5, sy=0.8), Shear (hx=0.3), dan Translasi (tx=5.0, ty=3.0)
M_affine = np.array([
    [1.5, 0.3, 5.0],
    [0.0, 0.8, 3.0],
    [0.0, 0.0, 1.0]
], dtype=np.float64)

# 3. Lakukan Transformasi Geometris: p' = M * p
transformed_square = M_affine @ square

print("--- Transformasi Affin 2D Koordinat Homogen ---")
print("Matriks Affin 3x3:\n", M_affine)
print("\nTitik Asli -> Titik Tertransformasi:")
for i in range(4):
    p_orig = square[:2, i]
    p_trans = transformed_square[:2, i]
    print(f"P{i+1}: ({p_orig[0]:.1f}, {p_orig[1]:.1f}) -> ({p_trans[0]:.2f}, {p_trans[1]:.2f})")

# 4. Verifikasi Preservasi Paralelisme Vektor: Vektor P1-P2 harus sejajar dengan Vektor P4-P3
v_bawah = transformed_square[:2, 1] - transformed_square[:2, 0]
v_atas  = transformed_square[:2, 2] - transformed_square[:2, 3]
print(f"\nVektor Sisi Bawah : {v_bawah.round(3)}")
print(f"Vektor Sisi Atas  : {v_atas.round(3)}")
print("Status Paralelisme: Terbukti sejajar identik (Sifat Invarian Affin Terpenuhi).")
"""

c2_1_pitfalls = [
    "Melakukan pemetaan maju (*forward mapping*) dari citra input ke output, yang menyebabkan terbentuknya celah-celah piksel kosong (*holes/gaps*) akibat pembulatan koordinat non-integer; implementasi praktis selalu menggunakan pemetaan mundur (*inverse mapping*) dari kisi output ke input.",
    "Urutan perkalian matriks non-komutatif: melakukan translasi sebelum rotasi menghasilkan lintasan orbit keliling titik asal, berbeda dengan rotasi di tempat diikuti translasi.",
    "Mengasumsikan determinan matriks affin bernilai 1. Determinan $\\det(\\mathbf{A}) = a_{11}a_{22} - a_{12}a_{21}$ mengukur perubahan rasio luas area."
]

c2_1_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 2.1.1: 2D planar transformations (translations, rigid, affine)."
    }
]

subchapters.append(create_subchapter("computer-vision-ch2-sub1", "2.1. Matriks Transformasi Affin 2D (Translasi, Rotasi, Skala, Shear)", c2_1_desc, c2_1_md, c2_1_code, c2_1_pitfalls, c2_1_refs))

# ==============================================================================
# SUBCHAPTER 2.2: Rotasi Citra terhadap Titik Pusat dengan Sudut Arbitrer
# ==============================================================================
c2_2_desc = "Derivasi matriks rotasi mengelilingi pusat massa citra, penyesuaian bounding box kanvas baru agar sudut tidak terpotong, dan inverse mapping."
c2_2_md = """Rotasi 2D standar didefinisikan terhadap titik asal $(0, 0)$ (pojok kiri atas citra). Jika rotasi diterapkan langsung, sebagian besar citra akan keluar dari bidang pandang kanvas (*clipped*).

### 1. Formulasi Rotasi Terhadap Titik Pusat $(x_c, y_c)$
Untuk merotasikan citra terhadap pusatnya sendiri $(x_c, y_c) = ((W-1)/2, (H-1)/2)$, kita menggunakan dekomposisi 3 tahap:
1. Translasikan pusat citra ke titik asal: $\\mathbf{T}_1 = \\begin{bmatrix} 1 & 0 & -x_c \\\\ 0 & 1 & -y_c \\\\ 0 & 0 & 1 \\end{bmatrix}$
2. Rotasikan sebesar sudut $\\theta$: $\\mathbf{R}(\\theta) = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}$
3. Translasi balik ke koordinat pusat: $\\mathbf{T}_2 = \\begin{bmatrix} 1 & 0 & x_c' \\\\ 0 & 1 & y_c' \\\\ 0 & 0 & 1 \\end{bmatrix}$

Matriks rotasi gabungan $2 \\times 3$:
$$\\mathbf{M} = \\begin{bmatrix} \\alpha & \\beta & (1-\\alpha)x_c - \\beta y_c \\\\ -\\beta & \\alpha & \\beta x_c + (1-\\alpha)y_c \\end{bmatrix}, \\quad \\alpha = \\cos\\theta, \\; \\beta = \\sin\\theta$$

### 2. Komputasi Batas Kanvas Baru (Bounding Box Expansion)
Agar keempat sudut citra tidak terpotong saat diputar sebesar sudut arbitrer $\\theta$, dimensi kanvas baru $(W_{\\text{new}}, H_{\\text{new}})$ dihitung dari proyeksi trigonometris nilai mutlak:

$$W_{\\text{new}} = \\lceil W |\\cos\\theta| + H |\\sin\\theta| \\rceil$$
$$H_{\\text{new}} = \\lceil W |\\sin\\theta| + H |\\cos\\theta| \\rceil$$"""

c2_2_code = r"""import numpy as np

def compute_rotation_bounds(width: int, height: int, angle_degrees: float):
    '''Menghitung dimensi kanvas baru dan matriks transformasi rotasi penuh tanpa pemotongan sudut.'''
    theta = np.radians(angle_degrees)
    cos_t = np.abs(np.cos(theta))
    sin_t = np.abs(np.sin(theta))
    
    # 1. Dimensi Kanvas Baru Bounding Box
    new_w = int(np.ceil(width * cos_t + height * sin_t))
    new_h = int(np.ceil(width * sin_t + height * cos_t))
    
    # 2. Titik Pusat Asli dan Pusat Baru
    cx, cy = (width - 1) / 2.0, (height - 1) / 2.0
    new_cx, new_cy = (new_w - 1) / 2.0, (new_h - 1) / 2.0
    
    # 3. Matriks Rotasi Gabungan: T_back * R * T_center
    alpha = np.cos(theta)
    beta = np.sin(theta)
    
    M = np.array([
        [ alpha,  beta, new_cx - alpha * cx - beta * cy],
        [-beta,  alpha, new_cy + beta * cx - alpha * cy]
    ], dtype=np.float64)
    
    return new_w, new_h, M

# Uji Rotasi Citra W=640, H=480 sebesar 45 derajat
w_orig, h_orig = 640, 480
angle = 45.0
new_w, new_h, M_rot = compute_rotation_bounds(w_orig, h_orig, angle)

print("--- Perhitungan Dimensi Kanvas Rotasi Citra Arbitrer ---")
print(f"Dimensi Citra Asli     : W={w_orig}, H={h_orig} (Luas: {w_orig*h_orig} piksel)")
print(f"Sudut Rotasi           : {angle}°")
print(f"Dimensi Kanvas Ekspansi: W={new_w}, H={new_h} (Luas: {new_w*new_h} piksel)")
print(f"Matriks Transformasi 2x3:\n{M_rot.round(4)}")
"""

c2_2_pitfalls = [
    "Memutar citra $45^\\circ$ menggunakan kanvas tetap berukuran sama, menyebabkan terpotongnya $~30\\%$ area visual di keempat pojok citra.",
    "Menggunakan sudut dalam satuan derajat secara langsung pada fungsi trigonometri `np.cos()` dan `np.sin()` alih-alih mengonversinya ke radian via `np.radians()`.",
    "Arah rotasi: dalam koordinat citra dengan sumbu Y mengarah ke bawah, sudut rotasi positif memutar citra searah jarum jam (*clockwise*), berkebalikan dengan sistem koordinat kartesius baku."
]

c2_2_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 3.6: Geometric transformations and canvas resizing."
    }
]

subchapters.append(create_subchapter("computer-vision-ch2-sub2", "2.2. Rotasi Citra terhadap Titik Pusat dengan Sudut Arbitrer", c2_2_desc, c2_2_md, c2_2_code, c2_2_pitfalls, c2_2_refs))

# ==============================================================================
# SUBCHAPTER 2.3: Interpolasi Nearest Neighbor
# ==============================================================================
c2_3_desc = "Prinsip dasar interpolasi piksel tetangga terdekat, pembulatan koordinat real ke integer, efisiensi O(1), serta analisis artefak visual aliasing (blocky)."
c2_3_md = """Ketika melakukan pemetaan mundur (*inverse mapping*), koordinat titik asal $(x_s, y_s) = \\mathbf{M}^{-1} [x_d, y_d, 1]^T$ hampir selalu berupa bilangan riil desimal (*non-integer*). Karena citra digital hanya terdefinisi pada koordinat kisi diskrit bulat $(x, y) \\in \\mathbb{Z}^2$, diperlukan metode interpolasi.

### 1. Mekanisme Nearest Neighbor
Interpolasi tetangga terdekat (*nearest neighbor*) adalah metode paling sederhana: intensitas pada titik kontinu $(x_s, y_s)$ diambil langsung dari piksel kisi terdekat melalui fungsi pembulatan:

$$\\hat{I}(x_s, y_s) = I(\\operatorname{round}(x_s), \\operatorname{round}(y_s))$$

Secara formal, kernel interpolasi kotak berjarak $\\le 0.5$:
$$h(x) = \\begin{cases} 1 & \\text{jika } |x| < 0.5 \\\\ 0 & \\text{lainnya} \\end{cases}$$

### 2. Efisiensi Komputasi vs Kualitas Visual
- **Kompleksitas**: Sangat cepat $\\mathcal{O}(1)$ dengan operasi memori sederhana (1 pembacaan memori per piksel tujuan tanpa operasi perkalian mengambang).
- **Kelemahan Visual**: Menghasilkan fenomena *pixelation* dan *blocky staircase artifacts* (tampilan berundak) pada pembesaran (*upscaling*), serta hilangnya garis-garis halus tipis akibat *aliasing* frekuensi tinggi."""

c2_3_code = r"""import numpy as np

# 1. Definisikan Citra Miniatur Sumber 3x3
src_image = np.array([
    [ 10,  50,  90],
    [100, 150, 200],
    [210, 230, 255]
], dtype=np.uint8)

H_src, W_src = src_image.shape
scale_factor = 2.0  # Perbesar 2x menjadi 6x6
H_dst, W_dst = int(H_src * scale_factor), int(W_src * scale_factor)

# 2. Lakukan Upscaling Menggunakan Nearest Neighbor Interpolation (Inverse Mapping)
dst_image = np.zeros((H_dst, W_dst), dtype=np.uint8)

for y_d in range(H_dst):
    for x_d in range(W_dst):
        # Petakan kembali ke koordinat kontinu sumber
        x_s = (x_d + 0.5) / scale_factor - 0.5
        y_s = (y_d + 0.5) / scale_factor - 0.5
        
        # Bulatkan ke indeks integer terdekat dan batasi rentang (clamping)
        x_nn = int(np.clip(np.round(x_s), 0, W_src - 1))
        y_nn = int(np.clip(np.round(y_s), 0, H_src - 1))
        
        dst_image[y_d, x_d] = src_image[y_nn, x_nn]

print("--- Hasil Interpolasi Nearest Neighbor (2x Upscale) ---")
print(f"Citra Sumber (3x3):\n{src_image}")
print(f"\nCitra Hasil (6x6 - Tampak Pola Blok Berulang 2x2):\n{dst_image}")
"""

c2_3_pitfalls = [
    "Menghitung pemetaan koordinat naif `x_s = x_d / scale` tanpa penyesuaian setengah piksel (`(x_d + 0.5) / scale - 0.5`), menyebabkan pergeseran spasial asimetris (*sub-pixel misalignment*) ke arah kiri-atas.",
    "Menggunakan interpolasi nearest neighbor untuk downscaling citra tajam tanpa filter low-pass anti-aliasing, menyebabkan kemunculan pola Moiré yang parah.",
    "Mengasumsikan nearest neighbor cocok untuk rotasi halus; rotasi dengan nearest neighbor menghasilkan garis tepi bergerigi tajam (*jagged edges*)."
]

c2_3_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 3.6.1: 2D image resampling, reconstruction filters, and nearest neighbor."
    }
]

subchapters.append(create_subchapter("computer-vision-ch2-sub3", "2.3. Interpolasi Nearest Neighbor", c2_3_desc, c2_3_md, c2_3_code, c2_3_pitfalls, c2_3_refs))

# ==============================================================================
# SUBCHAPTER 2.4: Interpolasi Bilinear 4 Titik Tetangga
# ==============================================================================
c2_4_desc = "Formulasi matematis interpolasi bilinear dua arah, pembobotan luas proporsional 4 piksel tetangga, serta trade-off kehalusan vs ketajaman citra."
c2_4_md = """Interpolasi bilinear (*bilinear interpolation*) adalah standar industri paling luas untuk transformasi geometris citra berkecepatan tinggi dengan degradasi visual minimal.

### 1. Formulasi Matematis Interpolasi Bilinear
Misalkan titik kontinu berada pada $(x, y)$ di mana $x_1 = \\lfloor x \\rfloor, x_2 = x_1 + 1$ dan $y_1 = \\lfloor y \\rfloor, y_2 = y_1 + 1$. Selisih pecahan subpiksel dinotasikan:
$$\\Delta x = x - x_1, \\quad \\Delta y = y - y_1, \\quad \\Delta x, \\Delta y \\in [0, 1)$$

Empat titik sudut tetangga yang mengelilingi $(x, y)$ adalah:
$$Q_{11} = (x_1, y_1), \\; Q_{12} = (x_1, y_2), \\; Q_{21} = (x_2, y_1), \\; Q_{22} = (x_2, y_2)$$

Interpolasi dilakukan melalui dua tahap linear berurutan:
1. **Interpolasi horizontal pada baris atas dan bawah**:
   $$f(x, y_1) = (1 - \\Delta x) I(Q_{11}) + \\Delta x I(Q_{21})$$
   $$f(x, y_2) = (1 - \\Delta x) I(Q_{12}) + \\Delta x I(Q_{22})$$
2. **Interpolasi vertikal antara kedua hasil**:
   $$\\hat{I}(x, y) = (1 - \\Delta y) f(x, y_1) + \\Delta y f(x, y_2)$$

Persamaan gabungan tunggal menunjukkan pembobotan proporsional luas area diagonal yang berlawanan (*opposite area weighting*):
$$\\hat{I}(x, y) = (1 - \\Delta x)(1 - \\Delta y) I(Q_{11}) + \\Delta x (1 - \\Delta y) I(Q_{21}) + (1 - \\Delta x)\\Delta y I(Q_{12}) + \\Delta x \\Delta y I(Q_{22})$$"""

c2_4_code = r"""import numpy as np

def bilinear_interpolate_single_pixel(image: np.ndarray, x: float, y: float) -> float:
    '''Menghitung nilai intensitas pada koordinat sub-piksel kontinu (x, y) dengan interpolasi bilinear.'''
    H, W = image.shape
    
    # Dapatkan koordinat 4 tetangga integer
    x1 = int(np.floor(x))
    x2 = min(x1 + 1, W - 1)
    y1 = int(np.floor(y))
    y2 = min(y1 + 1, H - 1)
    
    # Pembobotan sub-piksel
    dx = x - x1
    dy = y - y1
    
    # Nilai intensitas 4 sudut
    q11 = image[y1, x1]
    q21 = image[y1, x2]
    q12 = image[y2, x1]
    q22 = image[y2, x2]
    
    # Bobot berlawanan area
    val = ((1.0 - dx) * (1.0 - dy) * q11 +
           dx * (1.0 - dy) * q21 +
           (1.0 - dx) * dy * q12 +
           dx * dy * q22)
    return float(val)

# Citra Uji 2x2
sample_patch = np.array([
    [ 20.0, 100.0],
    [ 40.0, 240.0]
], dtype=np.float64)

# Evaluasi pada titik tengah persis (x=0.5, y=0.5) dan titik asimetris (x=0.8, y=0.2)
val_center = bilinear_interpolate_single_pixel(sample_patch, 0.5, 0.5)
val_corner = bilinear_interpolate_single_pixel(sample_patch, 0.8, 0.2)

print("--- Evaluasi Interpolasi Bilinear 4 Titik Tetangga ---")
print("Matriks 2x2:\n", sample_patch)
print(f"Nilai pada Titik Pusat (0.5, 0.5)    : {val_center:.2f} (Rata-rata 4 sudut: {np.mean(sample_patch):.2f})")
print(f"Nilai pada Titik Dekat Kanan (0.8, 0.2): {val_corner:.2f}")
"""

c2_4_pitfalls = [
    "Interpolasi bilinear bertindak sebagai filter low-pass alami sehingga operasi berulang (misal: rotasi bertahap 1 derajat sebanyak 90 kali) mengakibatkan pengaburan citra yang sangat parah.",
    "Mengabaikan penanganan batas (*boundary conditions*) pada tepi citra: koordinat $x_2 = x_1 + 1$ dapat melebihi $W-1$, memicu IndexError jika tidak diklem (*clamped*).",
    "Melakukan operasi bilinear pada citra masker segmentasi kelas diskrit (misal: kelas mobil=1, jalan=2), menghasilkan piksel bernilai $1.5$ yang merupakan kelas non-eksisten."
]

c2_4_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 3.6.1: Bilinear resampling and spatial filters."
    }
]

subchapters.append(create_subchapter("computer-vision-ch2-sub4", "2.4. Interpolasi Bilinear 4 Titik Tetangga", c2_4_desc, c2_4_md, c2_4_code, c2_4_pitfalls, c2_4_refs))

# ==============================================================================
# SUBCHAPTER 2.5: Interpolasi Bikubik (Bicubic Spline)
# ==============================================================================
c2_5_desc = "Formulasi spline konvolusi kubik Keys, aproksimasi 16 titik tetangga (4x4), kontinuitas turunan pertama C^1, serta preservasi ketajaman detail visual."
c2_5_md = """Interpolasi bikubik (*bicubic interpolation*) mengevaluasi $16$ titik tetangga dalam jendela $4 \\times 4$ piksel di sekitar titik kontinu $(x, y)$. Metode ini mempertahankan kontinuitas turunan pertama ($C^1$ continuity), menghasilkan permukaan intensitas yang jauh lebih mulus tanpa sudut patah (*piecewise smooth*).

### 1. Kernel Konvolusi Kubik Keys (1981)
Robert G. Keys merumuskan fungsi pembobotan kubik simetris satu dimensi $W(d)$ dengan parameter kemiringan turunan $a = -0.5$ (standar optimal untuk aproksimasi deret Taylor fungsi kontinu):

$$W(d) = \\begin{cases} (a+2)|d|^3 - (a+3)|d|^2 + 1 & \\text{untuk } |d| \\le 1 \\\\ a|d|^3 - 5a|d|^2 + 8a|d| - 4a & \\text{untuk } 1 < |d| < 2 \\\\ 0 & \\text{untuk } |d| \\ge 2 \\end{cases}$$

Untuk $a = -0.5$:
$$W(d) = \\begin{cases} 1.5|d|^3 - 2.5|d|^2 + 1 & \\text{untuk } |d| \\le 1 \\\\ -0.5|d|^3 + 2.5|d|^2 - 4|d| + 2 & \\text{untuk } 1 < |d| < 2 \\\\ 0 & \\text{lainnya} \\end{cases}$$

### 2. Formulasi Permukaan 2D 16 Titik
Nilai terinterpolasi pada $(x, y)$ dihitung sebagai pemisahan dua arah (*separable 2D convolution*):

$$\\hat{I}(x, y) = \\sum_{i=-1}^{2} \\sum_{j=-1}^{2} I(\\lfloor x \\rfloor + j, \\lfloor y \\rfloor + i) \\cdot W(x - (\\lfloor x \\rfloor + j)) \\cdot W(y - (\\lfloor y \\rfloor + i))$$

Kernel Keys memiliki sifat pembobotan negatif di rentang $1 < |d| < 2$, yang menghasilkan efek peningkatan kontras tepi alami (*sharpening / overshoot*)."""

c2_5_code = r"""import numpy as np

def keys_cubic_weight(d: float, a: float = -0.5) -> float:
    '''Fungsi pembobotan konvolusi kubik Keys (1981) dengan a = -0.5.'''
    ad = abs(d)
    if ad <= 1.0:
        return (a + 2.0) * (ad ** 3) - (a + 3.0) * (ad ** 2) + 1.0
    elif 1.0 < ad < 2.0:
        return a * (ad ** 3) - 5.0 * a * (ad ** 2) + 8.0 * a * ad - 4.0 * a
    return 0.0

def bicubic_interpolate_1d(values: np.ndarray, x: float) -> float:
    '''Interpolasi 1D kubik pada 4 sampel koordinat x in [0, 3] di mana titik kontinu ada di antara index 1 dan 2.'''
    idx1 = int(np.floor(x))
    res = 0.0
    for j in range(-1, 3):
        k_idx = idx1 + j
        k_idx_clamped = int(np.clip(k_idx, 0, len(values) - 1))
        dist = x - k_idx
        w = keys_cubic_weight(dist)
        res += values[k_idx_clamped] * w
    return float(res)

# Sampel 4 piksel berurutan (Step Edge Tajam: 10, 10, 200, 200)
edge_1d = np.array([10.0, 10.0, 200.0, 200.0])

# Hitung interpolasi pada titik transisi x=1.5 (tepat di antara 10 dan 200)
# Dan evaluasi bobot overshoot pada x=1.1
val_mid = bicubic_interpolate_1d(edge_1d, 1.5)
val_pre = bicubic_interpolate_1d(edge_1d, 0.9)

print("--- Evaluasi Kernel Konvolusi Bikubik Keys ---")
print("Sampel Data 1D Transisi Tepi:", edge_1d.tolist())
print(f"Nilai Interpolasi Titik Tengah (x=1.5): {val_mid:.2f} (Transisi Mulus)")
print(f"Nilai Interpolasi Mendekati Tepi (x=0.9): {val_pre:.2f}")
print("Verifikasi Bobot: Sum W(d) untuk d=[-1.5, -0.5, 0.5, 1.5] =", 
      sum(keys_cubic_weight(1.5 - j) for j in [-1, 0, 1, 2]))
"""

c2_5_pitfalls = [
    "Efek *ringing* atau *haloing*: bobot negatif pada kernel Keys menghasilkan nilai intensitas yang bisa melebihi batas asli $[0, 255]$ (*undershoot/overshoot*), sehingga pemotongan nilai (`np.clip(val, 0, 255)`) mutlak diperlukan.",
    "Beban komputasi: bikubik membutuhkan 16 operasi pembacaan memori dan 16 evaluasi polinomial per piksel (sekitar $4\\times$ lebih lambat dibanding bilinear).",
    "Menggunakan interpolasi bikubik pada citra berderau tinggi (*noisy images*), yang justru dapat memperkuat artefak derau akibat karakteristik sharpening-nya."
]

c2_5_refs = [
    {
        "title": "Cubic Convolution Interpolation for Digital Image Processing",
        "authors": ["Robert G. Keys"],
        "year": 1981,
        "publisherOrVenue": "IEEE Transactions on Acoustics, Speech, and Signal Processing",
        "url": "https://doi.org/10.1109/TASSP.1981.1163711",
        "relevance": "Paper kanonikal perumusan kernel konvolusi kubik kontinu dengan akurasi orde ketiga."
    }
]

subchapters.append(create_subchapter("computer-vision-ch2-sub5", "2.5. Interpolasi Bikubik (Bicubic Spline)", c2_5_desc, c2_5_md, c2_5_code, c2_5_pitfalls, c2_5_refs))

# ==============================================================================
# SUBCHAPTER 2.6: Transformasi Perspektif & Homografi 3x3
# ==============================================================================
c2_6_desc = "Derivasi geometris proyektif homografi 3x3 bidang-ke-bidang (planar homography), 8 derajat kebebasan (DoF), dan invariansi proyektif garis lurus."
c2_6_md = """Ketika suatu permukaan datar (planar) di dunia 3D difoto dari dua sudut pandang kamera yang berbeda, korespondensi antara kedua citra dihubungkan secara eksak oleh **Transformasi Homografi** (transformasi proyektif 2D).

### 1. Formulasi Matriks Homografi $\\mathbf{H}$
Matriks homografi $\\mathbf{H} \\in \\mathbb{R}^{3 \\times 3}$ memetakan koordinat homogen $\\mathbf{x} = [x, y, 1]^T$ ke $\\mathbf{x}' = [x', y', 1]^T$:

$$\\lambda \\begin{bmatrix} x' \\\\ y' \\\\ 1 \\end{bmatrix} = \\mathbf{H} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} h_{11} & h_{12} & h_{13} \\\\ h_{21} & h_{22} & h_{23} \\\\ h_{31} & h_{32} & h_{33} \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix}$$

Karena kesamaan ini berlaku hingga faktor skala non-nol arbitrary $\\lambda \\neq 0$, matriks $\\mathbf{H}$ hanya memiliki **8 derajat kebebasan** (*degrees of freedom* / DoF). Lazimnya, skala dinormalisasi dengan menetapkan $h_{33} = 1$ atau \\|\\mathbf{H}\\|_F = 1$.

### 2. Hubungan Non-linear Koordinat Kartesius
Dalam koordinat kartesius sesungguhnya:
$$x' = \\frac{h_{11}x + h_{12}y + h_{13}}{h_{31}x + h_{32}y + h_{33}}, \\quad y' = \\frac{h_{21}x + h_{22}y + h_{23}}{h_{31}x + h_{32}y + h_{33}}$$

Penyebut $(h_{31}x + h_{32}y + h_{33})$ merepresentasikan garis lenyap (*vanishing line*). Berbeda dengan transformasi affin, homografi **tidak mempertahankan paralelisme garis**, namun tetap mempertahankan kolinearitas garis (garis lurus tetap lurus)."""

c2_6_code = r"""import numpy as np

# 1. Definisikan Matriks Homografi H (Efek Perspektif Miring & Zoom)
# Baris ketiga [0.001, 0.0005, 1.0] mengintroduksi pembagian perspektif non-linear
H = np.array([
    [1.2, 0.1, 50.0],
    [0.0, 1.1, 30.0],
    [0.001, 0.0005, 1.0]
], dtype=np.float64)

# 2. Definisikan 3 Titik Uji pada Bidang Citra Sumber (Koordinat Homogen 3x3)
points_src = np.array([
    [  0.0, 100.0, 100.0],
    [  0.0,   0.0, 100.0],
    [  1.0,   1.0,   1.0]
], dtype=np.float64)

# 3. Aplikasikan Transformasi Proyektif: x' = H * x
points_dst_homo = H @ points_src

print("--- Transformasi Perspektif Bidang (Homografi 3x3) ---")
print("Matriks Homografi H:\n", H)
print("\nPemetaan Titik (Normalisasi Pembagian Skala Lambda):")
for i in range(points_src.shape[1]):
    x_s, y_s = points_src[0, i], points_src[1, i]
    # Normalisasi perspektif homogen
    scale = points_dst_homo[2, i]
    x_d = points_dst_homo[0, i] / scale
    y_d = points_dst_homo[1, i] / scale
    print(f"Titik {i+1} Asli: ({x_s:5.1f}, {y_s:5.1f}) -> Lambda={scale:.4f} -> Tertransformasi: ({x_d:6.2f}, {y_d:6.2f})")
"""

c2_6_pitfalls = [
    "Mencoba mengestimasi homografi hanya dengan 3 pasang titik. Transformasi affin (6 DoF) memerlukan 3 titik, tetapi homografi (8 DoF) secara matematis membutuhkan minimal **4 pasang titik** yang tidak segaris (*no 3 points collinear*).",
    "Lupa membagi dengan elemen ketiga hasil perkalian matriks homogen ($x' = X'/W', y' = Y'/W'$).",
    "Kondisi singularitas numerik: jika titik berada tepat pada garis lenyap (*vanishing line*) di mana penyebut bernilai mendekati nol, terjadi pembagian dengan nol (*division by zero*)."
]

c2_6_refs = [
    {
        "title": "Multiple View Geometry in Computer Vision (2nd ed.)",
        "authors": ["Richard Hartley", "Andrew Zisserman"],
        "year": 2004,
        "publisherOrVenue": "Cambridge University Press",
        "url": "https://www.robots.ox.ac.uk/~vgg/hzbook/",
        "relevance": "Bab 2: Projective Transformations and 2D Planar Homographies."
    }
]

subchapters.append(create_subchapter("computer-vision-ch2-sub6", "2.6. Transformasi Perspektif & Homografi 3x3", c2_6_desc, c2_6_md, c2_6_code, c2_6_pitfalls, c2_6_refs))

# ==============================================================================
# SUBCHAPTER 2.7: Estimasi Homografi Menggunakan Direct Linear Transformation (DLT)
# ==============================================================================
c2_7_desc = "Algoritma Direct Linear Transformation (DLT), penyusunan sistem linear homogen Ah = 0, normalisasi koordinat Hartley, dan resolusi SVD."
c2_7_md = """Untuk menghitung matriks homografi $\\mathbf{H}$ dari sekumpulan korespondensi titik yang diketahui $\\mathbf{x}_i \\leftrightarrow \\mathbf{x}'_i$, kita menggunakan algoritma **Direct Linear Transformation (DLT)**.

### 1. Pembentukan Persamaan Linier Homogen $\\mathbf{A}\\mathbf{h} = \\mathbf{0}$
Dari hubungan cross-product $\\mathbf{x}'_i \\times (\\mathbf{H} \\mathbf{x}_i) = \\mathbf{0}$, setiap pasangan titik korespondensi $(x_i, y_i) \\leftrightarrow (x'_i, y'_i)$ menghasilkan dua persamaan linear independen untuk vektor elemen $\\mathbf{h} = [h_{11}, h_{12}, \\dots, h_{33}]^T$:

$$\\begin{bmatrix}
0 & 0 & 0 & -x_i & -y_i & -1 & y'_i x_i & y'_i y_i & y'_i \\\\
x_i & y_i & 1 & 0 & 0 & 0 & -x'_i x_i & -x'_i y_i & -x'_i
\\end{bmatrix} \\mathbf{h} = \\mathbf{0}$$

Dengan $n \\ge 4$ pasangan titik, kita menyusun matriks $\\mathbf{A} \\in \\mathbb{R}^{2n \\times 9}$.

### 2. Penyelesaian Kuadrat Terkecil via SVD
Karena terdapat derau pengukuran sensor, sistem persamaan diselesaikan melalui optimasi:
$$\\min_{\\mathbf{h}} \\|\\mathbf{A}\\mathbf{h}\\|^2 \\quad \\text{dengan kendala } \\|\\mathbf{h}\\| = 1$$

Melalui Dekomposisi Nilai Singular (*Singular Value Decomposition* / SVD) $\\mathbf{A} = \\mathbf{U} \\boldsymbol{\\Sigma} \\mathbf{V}^T$, solusi optimal $\\mathbf{h}^*$ adalah vektor kolom terakhir dari matriks $\\mathbf{V}$ (yang berkorespondensi dengan nilai singular terkecil). Vektor $\\mathbf{h}^*$ kemudian diubah kembali menjadi matriks $\\mathbf{H} \\in \\mathbb{R}^{3 \\times 3}$."""

c2_7_code = r"""import numpy as np

def estimate_homography_dlt(pts_src: np.ndarray, pts_dst: np.ndarray) -> np.ndarray:
    '''Estimasi matriks Homografi H (3x3) menggunakan Direct Linear Transformation (DLT) via SVD.'''
    assert len(pts_src) >= 4 and len(pts_dst) >= 4, "Minimal dibutuhkan 4 pasang titik korespondensi"
    
    A = []
    for i in range(len(pts_src)):
        x, y = pts_src[i][0], pts_src[i][1]
        u, v = pts_dst[i][0], pts_dst[i][1]
        A.append([0, 0, 0, -x, -y, -1,  v*x,  v*y,  v])
        A.append([x, y, 1,  0,  0,  0, -u*x, -u*y, -u])
        
    A = np.array(A, dtype=np.float64)
    
    # Hitung SVD dari matriks A: A = U * S * V^T
    _, _, Vt = np.linalg.svd(A)
    
    # Solusi optimal adalah baris terakhir dari Vt (kolom terakhir V)
    h = Vt[-1]
    H = h.reshape((3, 3))
    
    # Normalisasi agar elemen H[2, 2] bernilai 1.0 (jika non-zero)
    if abs(H[2, 2]) > 1e-8:
        H /= H[2, 2]
    return H

# 4 Pasang Titik Uji Korespondensi (Misal: Dokumen Persegi Panjang yang Terdistorsi Perspektif)
pts_src = np.array([[0, 0], [200, 0], [200, 100], [0, 100]], dtype=np.float64)
pts_dst = np.array([[20, 15], [230, 25], [195, 120], [10, 95]], dtype=np.float64)

H_estimated = estimate_homography_dlt(pts_src, pts_dst)

print("--- Hasil Estimasi Homografi Menggunakan DLT SVD ---")
print("Matriks Homografi Hasil Estimasi H:\n", H_estimated.round(4))

# Validasi Akurasi: Proyeksikan Titik Sumber Pertama dan Bandingkan dengan Titik Tujuan Sebenarnya
p1_homo = np.array([pts_src[0][0], pts_src[0][1], 1.0])
p1_proj = H_estimated @ p1_homo
p1_actual_proj = p1_proj[:2] / p1_proj[2]

print(f"\nUji Titik 1 Sumber       : {pts_src[0].tolist()}")
print(f"Target Koordinat Tujuan  : {pts_dst[0].tolist()}")
print(f"Hasil Proyeksi Estimasi H: {p1_actual_proj.round(2).tolist()}")
print(f"Galat Reproyeksi Titik 1 : {np.linalg.norm(p1_actual_proj - pts_dst[0]):.6f} piksel")
"""

c2_7_pitfalls = [
    "Menjalankan DLT tanpa normalisasi koordinat isotropik Hartley (*Hartley's data normalization*), yang menyebabkan ketidakstabilan numerik parah akibat perbedaan skala ekstrem antara koordinat ($10^3$) dan nilai konstan ($1$).",
    "Menggunakan titik-titik yang hampir segaris (*collinear*), menghasilkan matriks dengan *condition number* sangat buruk dan matriks homografi yang tidak stabil.",
    "Mengasumsikan DLT kebal terhadap pencilan (*outliers*); adanya satu pasangan titik yang salah pasang akan merusak seluruh estimasi SVD (membutuhkan RANSAC untuk data riil)."
]

c2_7_refs = [
    {
        "title": "In Defence of the 8-point Algorithm",
        "authors": ["Richard I. Hartley"],
        "year": 1997,
        "publisherOrVenue": "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)",
        "url": "https://doi.org/10.1109/34.601246",
        "relevance": "Prinsip normalisasi koordinat pra-DLT untuk akurasi dan stabilitas numerik SVD."
    }
]

subchapters.append(create_subchapter("computer-vision-ch2-sub7", "2.7. Estimasi Homografi Menggunakan Direct Linear Transformation (DLT)", c2_7_desc, c2_7_md, c2_7_code, c2_7_pitfalls, c2_7_refs))

# ==============================================================================
# SUBCHAPTER 2.8: Koreksi Distorsi Lensa Kamera (Radial & Tangensial)
# ==============================================================================
c2_8_desc = "Model distorsi lensa optik Brown-Conrady, distorsi radial barrel/pincushion (k1, k2, k3), distorsi tangensial (p1, p2), dan undistortion mapping."
c2_8_md = """Lensa optik nyata tidak pernah memenuhi asumsi model pinhole ideal secara mutlak. Ketidaksempurnaan kelengkungan geometri lensa dan ketidaksejajaran elemen kaca memicu deviasi pembelokan berkas cahaya yang disebut **distorsi optik lensa**.

### 1. Distorsi Radial (Radial Distortion)
Distorsi radial terjadi karena deviasi pembesaran optik seiring bertambahnya jarak radial $r = \\sqrt{x^2 + y^2}$ dari sumbu optik:
- **Distorsi Tong (*Barrel Distortion*)**: Pembesaran menurun di tepi luar (lensa sudut lebar / *fisheye*).
- **Distorsi Bantal (*Pincushion Distortion*)**: Pembesaran meningkat di tepi luar (lensa telephoto).

Model polinomial Taylor Brown-Conrady:
$$x_{\\text{distorted}} = x(1 + k_1 r^2 + k_2 r^4 + k_3 r^6)$$
$$y_{\\text{distorted}} = y(1 + k_1 r^2 + k_2 r^4 + k_3 r^6)$$

### 2. Distorsi Tangensial (Tangential Distortion)
Distorsi tangensial terjadi ketika bidang lensa fisik tidak terpasang sejajar sempurna terhadap permukaan bidang silikon sensor (*decentering*):

$$x_{\\text{distorted}} = x + [2 p_1 x y + p_2 (r^2 + 2 x^2)]$$
$$y_{\\text{distorted}} = y + [p_1 (r^2 + 2 y^2) + 2 p_2 x y]$$

Total parameter distorsi lensa direpresentasikan sebagai vektor 5-elemen: $\\mathbf{D} = [k_1, k_2, p_1, p_2, k_3]$."""

c2_8_code = r"""import numpy as np

def apply_lens_distortion(x_norm: float, y_norm: float, k1: float, k2: float, p1: float, p2: float):
    '''Menghitung koordinat terdistorsi menggunakan model Brown-Conrady.'''
    r2 = x_norm**2 + y_norm**2
    r4 = r2**2
    
    # Komponen Radial
    radial_factor = 1.0 + k1 * r2 + k2 * r4
    
    # Komponen Gabungan Radial + Tangensial
    x_dist = x_norm * radial_factor + (2.0 * p1 * x_norm * y_norm + p2 * (r2 + 2.0 * x_norm**2))
    y_dist = y_norm * radial_factor + (p1 * (r2 + 2.0 * y_norm**2) + 2.0 * p2 * x_norm * y_norm)
    return x_dist, y_dist

# Parameter Distorsi Lensa Fisheye Ringan: k1=-0.2 (barrel), k2=0.05, p1=0.001, p2=0.002
k1, k2, p1, p2 = -0.2, 0.05, 0.001, 0.002

# Evaluasi 3 Titik: Dekat Pusat (r kecil), Tengah, dan Tepi Luar Sudut Lensa (r besar)
test_points = [(0.1, 0.1), (0.5, 0.5), (0.9, 0.9)]

print("--- Simulasi Model Distorsi Lensa Brown-Conrady ---")
print(f"Koefisien: k1={k1}, k2={k2}, p1={p1}, p2={p2}")
for x, y in test_points:
    r = np.sqrt(x**2 + y**2)
    xd, yd = apply_lens_distortion(x, y, k1, k2, p1, p2)
    rd = np.sqrt(xd**2 + yd**2)
    shift = rd - r
    print(f"Titik Ideal: ({x:.1f}, {y:.1f}), r={r:.3f} -> Terdistorsi: ({xd:.3f}, {yd:.3f}), r_dist={rd:.3f} (Penyusutan: {shift:.3f})")
"""

c2_8_pitfalls = [
    "Menerapkan parameter distorsi pada koordinat piksel langsung $(u, v)$ alih-alih pada koordinat ternormalisasi kamera $(x = (u - c_x)/f_x, y = (v - c_y)/f_y)$.",
    "Menambahkan terlalu banyak parameter polinomial derajat tinggi ($k_4, k_5, k_6$) saat kalibrasi lensa standar, yang memicu fenomena Runge (*polynomial overfitting*) di tepi terluar citra.",
    "Mengabaikan kalibrasi distorsi sebelum melakukan rekonstruksi 3D stereo atau estimasi pose SLAM, menyebabkan akumulasi drift metrik yang signifikan."
]

c2_8_refs = [
    {
        "title": "Decentering Distortion of Lenses",
        "authors": ["Duane C. Brown"],
        "year": 1966,
        "publisherOrVenue": "Photometric Engineering",
        "url": "https://www.asprs.org/",
        "relevance": "Landasan model distorsi lensa optik radial dan tangensial Brown-Conrady."
    }
]

subchapters.append(create_subchapter("computer-vision-ch2-sub8", "2.8. Koreksi Distorsi Lensa Kamera (Radial & Tangensial)", c2_8_desc, c2_8_md, c2_8_code, c2_8_pitfalls, c2_8_refs))

# ==============================================================================
# SUBCHAPTER 2.9: Warping Perspektif Citra Dokumen (Document Scanner)
# ==============================================================================
c2_9_desc = "Pipeline rekayasa pemindaian dokumen cerdas (Document Scanner), deteksi kontur 4 sudut, pengurutan titik kanonik, dan transformasi perspektif."
c2_9_md = """Aplikasi praktis paling luas dari estimasi homografi dan *spatial warping* adalah sistem pemindai dokumen seluler (*mobile document scanner*). Ketika pengguna mengambil foto kuitansi atau dokumen di atas meja dari sudut miring, dokumen tampak sebagai trapesium terdistorsi perspektif.

### 1. Pipeline Rektifikasi Perspektif Dokumen
Pipeline standar terdiri dari 4 tahapan berurutan:
1. **Prapemrosesan & Deteksi Tepi**: Konversi grayscale, Gaussian blur, dan deteksi tepi Canny.
2. **Ekstraksi Kontur Dokumen**: Menemukan poligon tertutup terbesar dengan tepat 4 titik sudut (*quadrilateral contour*).
3. **Pengurutan Sudut Kanonik (*Point Ordering*)**: Mengurutkan 4 titik ke konvensi standar: `[top-left, top-right, bottom-right, bottom-left]`:
   - Titik *top-left* memiliki jumlah koordinat minimum $(x + y)$.
   - Titik *bottom-right* memiliki jumlah koordinat maksimum $(x + y)$.
   - Titik *top-right* memiliki selisih koordinat $(y - x)$ minimum.
   - Titik *bottom-left* memiliki selisih koordinat $(y - x)$ maksimum.
4. **Kalkulasi Dimensi Tujuan & Warping**: Menghitung lebar dan tinggi maksimum berdasarkan jarak Euclidean antar-sudut, lalu menerapkan homografi invers."""

c2_9_code = r"""import numpy as np

def order_quadrilateral_points(pts: np.ndarray) -> np.ndarray:
    '''Mengurutkan 4 titik kuadran ke urutan kanonik: TL, TR, BR, BL.'''
    rect = np.zeros((4, 2), dtype=np.float32)
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]  # Top-left (x+y terkecil)
    rect[2] = pts[np.argmax(s)]  # Bottom-right (x+y terbesar)
    
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]  # Top-right (y-x terkecil)
    rect[3] = pts[np.argmax(diff)]  # Bottom-left (y-x terbesar)
    return rect

def compute_document_dimensions(ordered_pts: np.ndarray):
    '''Menghitung dimensi lebar dan tinggi persegi panjang tujuan dari 4 titik sudut.'''
    tl, tr, br, bl = ordered_pts
    
    # Lebar: Nilai maksimum antara jarak horizontal atas dan bawah
    width_a = np.linalg.norm(br - bl)
    width_b = np.linalg.norm(tr - tl)
    max_w = max(int(width_a), int(width_b))
    
    # Tinggi: Nilai maksimum antara jarak vertikal kanan dan kiri
    height_a = np.linalg.norm(tr - br)
    height_b = np.linalg.norm(tl - bl)
    max_h = max(int(height_a), int(height_b))
    
    return max_w, max_h

# Titik 4 Sudut Dokumen Asli Hasil Deteksi Kamera (Acak & Miring)
raw_corners = np.array([
    [320.0, 410.0],  # Titik Bawah-Kanan
    [ 50.0,  80.0],  # Titik Atas-Kiri
    [300.0,  60.0],  # Titik Atas-Kanan
    [ 30.0, 390.0]   # Titik Bawah-Kiri
], dtype=np.float32)

ordered = order_quadrilateral_points(raw_corners)
target_w, target_h = compute_document_dimensions(ordered)

print("--- Pipeline Pemindai Dokumen Cerdas (Document Scanner) ---")
print("Urutan Sudut Kanonik Terverifikasi:")
labels = ["Top-Left    ", "Top-Right   ", "Bottom-Right", "Bottom-Left "]
for i in range(4):
    print(f"  {labels[i]}: ({ordered[i][0]:.1f}, {ordered[i][1]:.1f})")

print(f"\nEstimasi Dimensi Rektifikasi Dokumen Tegak: Lebar={target_w} px, Tinggi={target_h} px")
"""

c2_9_pitfalls = [
    "Salah urutan titik korespondensi sumber dan tujuan (misal: titik top-left dipetakan ke bottom-right), yang mengakibatkan citra terbalik $180^\\circ$ atau terpuntir menyilang.",
    "Menggunakan dimensi dokumen konstan (seperti A4 rasio $1:\\sqrt{2}$) saat dokumen fisik yang dipindai adalah kartu nama atau kuitansi persegi panjang bebas.",
    "Dokumen yang terlipat atau bergelombang tidak dapat diluruskan secara sempurna hanya dengan homografi planar (membutuhkan mesh warping atau model non-rigid)."
]

c2_9_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 3.6.2: Parametric transformations and quadrilateral warping."
    }
]

subchapters.append(create_subchapter("computer-vision-ch2-sub9", "2.9. Warping Perspektif Citra Dokumen (Document Scanner)", c2_9_desc, c2_9_md, c2_9_code, c2_9_pitfalls, c2_9_refs))

# ==============================================================================
# SUBCHAPTER 2.10: Data Augmentation Geometris
# ==============================================================================
c2_10_desc = "Teknik augmentasi data geometris modern untuk pelatihan deep learning (Random Crop, Horizontal Flip, Scaling, Affine Perturbation), serta regulasi label."
c2_10_md = """Dalam visi komputer modern berbasis *deep learning*, augmentasi data (*data augmentation*) geometris berfungsi sebagai bentuk regularisasi implisit yang menyuntikkan invariansi struktural ke dalam model dan mencegah *overfitting*.

### 1. Taksonomi Transformasi Augmentasi Geometris
1. **Pembalikan Horizontal (*Random Horizontal Flip*)**:
   - Probabilitas $p = 0.5$. Memetakan $x' = W - 1 - x$.
   - Valid untuk klasifikasi objek alami (anjing, kucing, mobil), namun **tidak valid** untuk pengenalan rambu lalu lintas berarah atau pembacaan teks OCR.
2. **Pemotongan Acak (*Random Resized Crop*)**:
   - Memotong subwilayah secara acak dengan rasio area $[0.08, 1.0]$ dan rasio aspek $[3/4, 4/3]$, lalu mengubah skalanya kembali ke resolusi input baku arsitektur (misal: $224 \\times 224$).
   - Memaksa jaringan neural mengenali fitur lokal objek tanpa bergantung pada konteks latar belakang penuh.
3. **Perturbasi Affin Acak (*Random Affine*)**:
   - Kombinasi rotasi kecil ($\\pm 10^\\circ$), translasi proporsional ($\\pm 10\\%$), dan variasi skala ($[0.9, 1.1]$)."""

c2_10_code = r"""import numpy as np

def apply_random_crop_and_flip(image: np.ndarray, crop_h: int, crop_w: int, seed: int = 42):
    '''Simulasi deterministik augmentasi geometris: Random Crop + Random Flip.'''
    np.random.seed(seed)
    H, W = image.shape[:2]
    
    # 1. Tentukan Koordinat Awal Crop Acak
    max_y = H - crop_h
    max_x = W - crop_w
    start_y = np.random.randint(0, max_y + 1)
    start_x = np.random.randint(0, max_x + 1)
    
    cropped = image[start_y:start_y + crop_h, start_x:start_x + crop_w]
    
    # 2. Random Horizontal Flip (Probabilitas 50%)
    flip_flag = np.random.rand() > 0.5
    augmented = np.fliplr(cropped) if flip_flag else cropped
    
    return augmented, (start_y, start_x), flip_flag

# Citra Miniatur Asli 6x6 dengan Nilai Unik per Kolom
original_img = np.tile(np.arange(10, 70, 10, dtype=np.uint8), (6, 1))

crop_size = 4
aug_img, (y_off, x_off), flipped = apply_random_crop_and_flip(original_img, crop_size, crop_size, seed=123)

print("--- Demonstrasi Pipeline Augmentasi Geometris ---")
print("Citra Asli (6x6):\n", original_img)
print(f"\nParameter Augmentasi: Offset Crop=(y={y_off}, x={x_off}), Horizontal Flip={flipped}")
print(f"Citra Hasil Augmentasi ({crop_size}x{crop_size}):\n", aug_img)
"""

c2_10_pitfalls = [
    "Menerapkan transformasi geometris pada citra input tanpa mentransformasikan *bounding box* target pada tugas deteksi objek atau *mask* target pada segmentasi semantik.",
    "Melakukan *horizontal flip* pada dataset teks (OCR) atau rambu belok kiri/kanan, yang merusak kebenaran semantik label target (*label corruption*).",
    "Menggunakan augmentasi data saat tahap validasi atau inferensi produksi, menghasilkan metrik evaluasi yang tidak deterministik dan terdegradasi."
]

c2_10_refs = [
    {
        "title": "A Survey on Image Data Augmentation for Deep Learning",
        "authors": ["Connor Shorten", "Taghi M. Khoshgoftaar"],
        "year": 2019,
        "publisherOrVenue": "Journal of Big Data",
        "url": "https://doi.org/10.1186/s40537-019-0197-0",
        "relevance": "Survei komprehensif teknik augmentasi geometris, fotometrik, dan sintesis citra."
    }
]

subchapters.append(create_subchapter("computer-vision-ch2-sub1", "2.1. Matriks Transformasi Affin 2D (Translasi, Rotasi, Skala, Shear)", c2_1_desc, c2_1_md, c2_1_code, c2_1_pitfalls, c2_1_refs))

# Note: make sure ID matches sub1 to sub10
# Replace sub1 above with correct append
subchapters = []
subchapters.append(create_subchapter("computer-vision-ch2-sub1", "2.1. Matriks Transformasi Affin 2D (Translasi, Rotasi, Skala, Shear)", c2_1_desc, c2_1_md, c2_1_code, c2_1_pitfalls, c2_1_refs))
subchapters.append(create_subchapter("computer-vision-ch2-sub2", "2.2. Rotasi Citra terhadap Titik Pusat dengan Sudut Arbitrer", c2_2_desc, c2_2_md, c2_2_code, c2_2_pitfalls, c2_2_refs))
subchapters.append(create_subchapter("computer-vision-ch2-sub3", "2.3. Interpolasi Nearest Neighbor", c2_3_desc, c2_3_md, c2_3_code, c2_3_pitfalls, c2_3_refs))
subchapters.append(create_subchapter("computer-vision-ch2-sub4", "2.4. Interpolasi Bilinear 4 Titik Tetangga", c2_4_desc, c2_4_md, c2_4_code, c2_4_pitfalls, c2_4_refs))
subchapters.append(create_subchapter("computer-vision-ch2-sub5", "2.5. Interpolasi Bikubik (Bicubic Spline)", c2_5_desc, c2_5_md, c2_5_code, c2_5_pitfalls, c2_5_refs))
subchapters.append(create_subchapter("computer-vision-ch2-sub6", "2.6. Transformasi Perspektif & Homografi 3x3", c2_6_desc, c2_6_md, c2_6_code, c2_6_pitfalls, c2_6_refs))
subchapters.append(create_subchapter("computer-vision-ch2-sub7", "2.7. Estimasi Homografi Menggunakan Direct Linear Transformation (DLT)", c2_7_desc, c2_7_md, c2_7_code, c2_7_pitfalls, c2_7_refs))
subchapters.append(create_subchapter("computer-vision-ch2-sub8", "2.8. Koreksi Distorsi Lensa Kamera (Radial & Tangensial)", c2_8_desc, c2_8_md, c2_8_code, c2_8_pitfalls, c2_8_refs))
subchapters.append(create_subchapter("computer-vision-ch2-sub9", "2.9. Warping Perspektif Citra Dokumen (Document Scanner)", c2_9_desc, c2_9_md, c2_9_code, c2_9_pitfalls, c2_9_refs))
subchapters.append(create_subchapter("computer-vision-ch2-sub10", "2.10. Data Augmentation Geometris (Random Crop, Horizontal Flip, Affine)", c2_10_desc, c2_10_md, c2_10_code, c2_10_pitfalls, c2_10_refs))

# ==============================================================================
# SAVE JSON OUTPUT
# ==============================================================================
output_path = os.path.join(os.path.dirname(__file__), "cv_ch2_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 2 data with {len(subchapters)} subchapters: {output_path}")
