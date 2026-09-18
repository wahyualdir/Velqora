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
# SUBCHAPTER 1.1: Model Kamera Pinhole & Persamaan Proyeksi Perspektif
# ==============================================================================
c1_1_desc = "Formulasi matematis model kamera pinhole ideal, koordinat homogen 3D ke 2D, matriks intrinsik K, ekstrinsik [R|t], dan efek distorsi optik."
c1_1_md = """Model kamera lubang jarum (*pinhole camera model*) merupakan fondasi geometri geometris proyektif dalam visi komputer modern. Model ini mendeskripsikan pemetaan matematis antara titik berdimensi tiga di dunia nyata $\\mathbf{P}_w = [X_w, Y_w, Z_w]^T$ ke bidang gambar berdimensi dua $\\mathbf{p} = [u, v]^T$.

### 1. Geometri Proyeksi Perspektif
Berdasarkan prinsip segitiga sebangun (*similar triangles*), jika pusat proyeksi berada pada titik asal $(0,0,0)$ dan bidang proyeksi (retina/sensor) berjarak $f$ (panjang fokus / *focal length*) di sepanjang sumbu optik $Z$:

$$\\frac{x}{f} = \\frac{X_c}{Z_c} \\implies x = f \\frac{X_c}{Z_c}, \\quad \\frac{y}{f} = \\frac{Y_c}{Z_c} \\implies y = f \\frac{Y_c}{Z_c}$$

Efek pembagian dengan $Z_c$ (*perspective division*) memunculkan fenomena visual fundamental: objek yang lebih jauh tampak mengecil secara proporsional berbanding terbalik dengan jarak kedalamannya.

### 2. Koordinat Homogen & Matriks Intrinsik Kamera
Untuk merepresentasikan proyeksi non-linear ini sebagai perkalian matriks linear tunggal, kita mengadopsi ruang proyektif $\\mathbb{P}^2$ dan $\\mathbb{P}^3$ menggunakan koordinat homogen:

$$\\begin{bmatrix} u \\\\ v \\\\ 1 \\end{bmatrix} \\sim \\mathbf{K} \\begin{bmatrix} X_c \\\\ Y_c \\\\ Z_c \\end{bmatrix} = \\begin{bmatrix} f_x & s & c_x \\\\ 0 & f_y & c_y \\\\ 0 & 0 & 1 \\end{bmatrix} \\begin{bmatrix} X_c \\\\ Y_c \\\\ Z_c \\end{bmatrix}$$

Di mana:
- $f_x = f \\cdot m_x$ dan $f_y = f \\cdot m_y$ adalah panjang fokus efektif dalam satuan piksel ($m_x, m_y$ adalah jumlah piksel per satuan panjang).
- $(c_x, c_y)$ adalah titik utama (*principal point*), yakni perpotongan sumbu optik tegak lurus dengan bidang sensor.
- $s$ adalah parameter ketidaksesuaian sudut sensor (*skew factor*), yang bernilai $0$ pada sensor modern berbasis ortogonal.

### 3. Matriks Transformasi Ekstrinsik $[\\mathbf{R} \\mid \\mathbf{t}]$
Titik dunia $\\mathbf{P}_w$ ditransformasikan ke koordinat kamera $\\mathbf{P}_c$ melalui rotasi $\\mathbf{R} \\in SO(3)$ dan translasi $\\mathbf{t} \\in \\mathbb{R}^3$:

$$\\mathbf{P}_c = \\mathbf{R} \\mathbf{P}_w + \\mathbf{t} = [\\mathbf{R} \\mid \\mathbf{t}] \\begin{bmatrix} X_w \\\\ Y_w \\\\ Z_w \\\\ 1 \\end{bmatrix}$$

Persamaan proyeksi penuh (*full projection matrix*) $\\mathbf{P} = \\mathbf{K}[\\mathbf{R} \\mid \\mathbf{t}] \\in \\mathbb{R}^{3 \\times 4}$ memetakan koordinat dunia 3D homogen langsung ke piksel 2D:

$$\\lambda \\begin{bmatrix} u \\\\ v \\\\ 1 \\end{bmatrix} = \\mathbf{K} [\\mathbf{R} \\mid \\mathbf{t}] \\begin{bmatrix} X_w \\\\ Y_w \\\\ Z_w \\\\ 1 \\end{bmatrix}, \\quad \\lambda = Z_c$$"""

c1_1_code = r"""import numpy as np

# 1. Definisikan Parameter Intrinsik Kamera K (f_x=800, f_y=800, c_x=320, c_y=240, skew=0)
K = np.array([
    [800.0,   0.0, 320.0],
    [  0.0, 800.0, 240.0],
    [  0.0,   0.0,   1.0]
], dtype=np.float64)

# 2. Definisikan Ekstrinsik Kamera: Kamera berada di (0, 0, -2) menghadap sumbu Z positif
# R = Identitas (tanpa rotasi), t = [0, 0, 2]^T (mentranslasikan objek dunia ke koordinat kamera)
R = np.eye(3, dtype=np.float64)
t = np.array([[0.0], [0.0], [2.0]], dtype=np.float64)
extrinsic = np.hstack((R, t))

# 3. Definisikan 3 Titik Uji 3D dalam Koordinat Dunia (X_w, Y_w, Z_w, 1)
# Titik 1: Pusat, Titik 2: Geser kanan X=0.5, Titik 3: Lebih jauh Z=2.0
points_3d = np.array([
    [0.0, 0.0, 1.0, 1.0],
    [0.5, 0.0, 1.0, 1.0],
    [0.5, 0.0, 3.0, 1.0]
], dtype=np.float64).T

# 4. Proyeksikan Titik 3D ke Piksel 2D: lambda * p = K * [R | t] * P_w
P = K @ extrinsic
homogeneous_2d = P @ points_3d

print("--- Hasil Proyeksi Perspektif Pinhole ---")
for i in range(points_3d.shape[1]):
    pw = points_3d[:3, i]
    # Normalisasi perspektif (pembagian dengan koordinat homogen z/lambda)
    z_cam = homogeneous_2d[2, i]
    u = homogeneous_2d[0, i] / z_cam
    v = homogeneous_2d[1, i] / z_cam
    print(f"Titik {i+1} Dunia: {pw} -> Z_cam: {z_cam:.1f}m -> Piksel: (u={u:.1f}, v={v:.1f})")
"""

c1_1_pitfalls = [
    "Lupa membagi dengan faktor skala kedalaman $\\lambda = Z_c$ saat mengonversi koordinat homogen proyektif kembali ke koordinat bidang kartesius $(u, v)$.",
    "Mengasumsikan titik utama $(c_x, c_y)$ selalu tepat di tengah citra $((W-1)/2, (H-1)/2)$ tanpa memperhitungkan toleransi misalignment perakitan modul lensa fisik.",
    "Mengabaikan arah orientasi sumbu koordinat: standar visi komputer mendefinisikan sumbu X ke kanan, sumbu Y ke bawah, dan sumbu Z maju searah pandangan optik."
]

c1_1_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 2.1: Geometric Image Formation dan model kamera proyektif 3D-ke-2D."
    },
    {
        "title": "Computer Vision: A Modern Approach (2nd ed.)",
        "authors": ["David A. Forsyth", "Jean Ponce"],
        "year": 2011,
        "publisherOrVenue": "Prentice Hall",
        "url": "https://www.pearson.com/",
        "relevance": "Bab 1: Geometric Camera Models, intrinsics, extrinsics, and perspective projection."
    }
]

subchapters.append(create_subchapter("computer-vision-ch1-sub1", "1.1. Model Kamera Pinhole & Persamaan Proyeksi Perspektif", c1_1_desc, c1_1_md, c1_1_code, c1_1_pitfalls, c1_1_refs))

# ==============================================================================
# SUBCHAPTER 1.2: Representasi Citra Digital sebagai Matriks Tensor 3D
# ==============================================================================
c1_2_desc = "Struktur array multidimensi citra digital, tata letak memori HWC vs CHW, indexing spasial baris-kolom, dan tipe data kuantisasi piksel."
c1_2_md = """Secara fisik, citra digital adalah fungsi kontinu intensitas cahaya dua dimensi $I(x, y)$ yang telah melalui dua tahap diskritisasi:
1. **Sampling Spasial**: Membagi bidang kontinu ke dalam kisi-kisi teratur (*regular grid*) piksel berukuran $H \\times W$ (tinggi $\\times$ lebar).
2. **Kuantisasi Intensitas**: Memetakan energi foton kontinu pada setiap sensor ke dalam himpunan diskrit berhingga (biasanya bilangan bulat tak bertanda 8-bit $[0, 255]$).

### 1. Representasi Tensor 3D $(H \\times W \\times C)$
Citra berwarna direpresentasikan sebagai tensor peringkat 3:
- Dimensi 0 ($H$): Sumbu vertikal (baris / $y$-coordinate), berindeks $0$ hingga $H-1$ dari atas ke bawah.
- Dimensi 1 ($W$): Sumbu horizontal (kolom / $x$-coordinate), berindeks $0$ hingga $W-1$ dari kiri ke kanan.
- Dimensi 2 ($C$): Kedalaman kanal warna, bernilai 1 untuk skala abu-abu (*grayscale*), 3 untuk RGB/BGR, dan 4 untuk RGBA.

$$\\mathbf{I} \\in \\mathbb{R}^{H \\times W \\times C}, \\quad \\mathbf{I}[y, x, c] \\in [0, 255] \\subset \\mathbb{Z}$$

### 2. Format Memori: HWC vs CHW
Tata letak memori (*memory layout*) sangat menentukan performa komputasi:
- **Format HWC (Channels-Last)**: Digunakan secara bawaan oleh OpenCV, NumPy, Matplotlib, dan TensorFlow CPU. Piksel warna disimpan secara bersebelahan (*interleaved*): `[R0, G0, B0, R1, G1, B1, ...]`.
- **Format CHW (Channels-First)**: Standar format akselerator GPU pada PyTorch dan cuDNN. Setiap bidang warna (*color plane*) disimpan secara planar berurutan: seluruh bidang R, diikuti bidang G, lalu bidang B. Format ini memaksimalkan efisiensi *vectorized memory access* pada instruksi SIMD/Tensor Core."""

c1_2_code = r"""import numpy as np

# 1. Buat citra sintetis berukuran H=4 (tinggi), W=6 (lebar), C=3 (RGB)
# Menggunakan pola bergradasi deterministik
H, W, C = 4, 6, 3
image_hwc = np.zeros((H, W, C), dtype=np.uint8)

# Isi kanal R dengan gradien vertikal, kanal G dengan gradien horizontal, kanal B bernilai konstan 128
for y in range(H):
    for x in range(W):
        image_hwc[y, x, 0] = int((y / (H - 1)) * 255)  # Red (vertikal)
        image_hwc[y, x, 1] = int((x / (W - 1)) * 255)  # Green (horizontal)
        image_hwc[y, x, 2] = 128                       # Blue (konstan)

print("--- Representasi Array HWC (Channels-Last) ---")
print("Bentuk Tensor (H, W, C):", image_hwc.shape)
print("Tipe Data Memori:", image_hwc.dtype)
print("Ukuran Memori Total:", image_hwc.nbytes, "bytes")
print("Piksel Pojok Kiri-Atas  (y=0, x=0):", image_hwc[0, 0, :].tolist())
print("Piksel Pojok Kanan-Bawah (y=3, x=5):", image_hwc[3, 5, :].tolist())

# 2. Konversi ke Format CHW (Channels-First) untuk PyTorch/GPU processing
image_chw = np.transpose(image_hwc, (2, 0, 1))
print("\n--- Konversi ke Format CHW (Channels-First) ---")
print("Bentuk Tensor (C, H, W):", image_chw.shape)
print("Kanal Hijau Bidang Rata (G plane 4x6):\n", image_chw[1])
"""

c1_2_pitfalls = [
    "Terbalik antara koordinat kartesius $(x, y)$ dan indeks array matriks NumPy `[row, col]` yang setara dengan `[y, x]`.",
    "Melakukan operasi aritmatika langsung pada `np.uint8` tanpa konversi `np.float32`, menyebabkan fenomena *integer overflow* atau *underflow* (misal: $250 + 20 = 14$ modulo 256).",
    "Melewatkan tensor berformat HWC ke modul konvolusi PyTorch yang mengharapkan dimensi $(B, C, H, W)$ sehingga memicu kesalahan fatal ukuran tensor."
]

c1_2_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 2.3: Digital Image Representation and Color Representations."
    }
]

subchapters.append(create_subchapter("computer-vision-ch1-sub2", "1.2. Representasi Citra Digital sebagai Matriks Tensor 3D", c1_2_desc, c1_2_md, c1_2_code, c1_2_pitfalls, c1_2_refs))

# ==============================================================================
# SUBCHAPTER 1.3: Sensor CMOS, Pola Bayer Filter & Demosaicing
# ==============================================================================
c1_3_desc = "Fisika sensor citra CMOS/CCD, susunan Color Filter Array (CFA) Bayer RGGB, dan algoritma rekonstruksi warna demosaicing bilinear."
c1_3_md = """Sensor silikon semikonduktor (CMOS maupun CCD) pada dasarnya bersifat buta warna (*color-blind*). Sensor hanya merespons jumlah foton yang jatuh ke dalam sumur potensial (*photodiode well*) tanpa membedakan panjang gelombang spektrum elektromagnetik.

### 1. Color Filter Array (CFA) & Pola Bayer
Untuk menangkap warna dengan satu keping sensor tanpa menambah bobot dan biaya optik prisma 3-sensor, Bryce Bayer (Eastman Kodak, 1976) merancang susunan filter warna mosaik periodik $2 \\times 2$:

$$\\begin{bmatrix} R & G \\\\ G & B \\end{bmatrix}$$

Proporsi kanal hijau ($50\\%$) sengaja dibuat dua kali lipat dibanding merah ($25\\%$) dan biru ($25\\%$). Desain ini mencerminkan fungsi efisiensi luminositas mata manusia (*human photopic luminous efficiency function* $V(\\lambda)$) yang memiliki kepekaan puncak pada wilayah hijau sekitar $555\\text{ nm}$.

### 2. Algoritma Demosaicing Bilinear
Citra RAW hasil tangkapan sensor berupa citra mosaik monokromatik 1 kanal. Proses merekonstruksi tiga komponen warna penuh $(R, G, B)$ di setiap piksel disebut **demosaicing** atau **de-Bayering**.

Pada algoritma demosaicing bilinear adaptif dasar:
- Pada piksel hijau yang tidak memiliki komponen merah: nilai $R$ diinterpolasi dari rata-rata 2 tetangga horizontal atau vertikal:
  $$R_{G} = \\frac{R_{\\text{kiri}} + R_{\\text{kanan}}}{2} \\quad \\text{atau} \\quad \\frac{R_{\\text{atas}} + R_{\\text{bawah}}}{2}$$
- Pada piksel biru yang tidak memiliki komponen merah: nilai $R$ diinterpolasi dari rata-rata 4 tetangga diagonal:
  $$R_{B} = \\frac{R_{1} + R_{2} + R_{3} + R_{4}}{4}$$
- Nilai hijau $G$ pada lokasi $R$ atau $B$ diinterpolasi dari 4 tetangga ortogonal (atas, bawah, kiri, kanan):
  $$G = \\frac{G_{\\text{atas}} + G_{\\text{bawah}} + G_{\\text{kiri}} + G_{\\text{kanan}}}{4}$$"""

c1_3_code = r"""import numpy as np

# 1. Simulasikan Pola Bayer RGGB 4x4 dari Citra Warna Hipotetis
# Baris genap (y=0, 2): R, G, R, G ...
# Baris ganjil (y=1, 3): G, B, G, B ...
bayer_raw = np.array([
    [220, 140, 210, 135],
    [138,  40, 142,  45],
    [225, 145, 230, 150],
    [140,  50, 148,  55]
], dtype=np.float32)

H, W = bayer_raw.shape
reconstructed_rgb = np.zeros((H, W, 3), dtype=np.float32)

# 2. Rekonstruksi Bilinear Sederhana untuk Piksel Bagian Dalam (y=1, x=1 yang merupakan piksel Biru asli)
# Pada lokasi (1, 1), sensor merekam B=40. Komponen G dan R diinterpolasi:
b_val = bayer_raw[1, 1]
# G diinterpolasi dari 4 tetangga ortogonal (atas, bawah, kiri, kanan)
g_val = (bayer_raw[0, 1] + bayer_raw[2, 1] + bayer_raw[1, 0] + bayer_raw[1, 2]) / 4.0
# R diinterpolasi dari 4 tetangga diagonal
r_val = (bayer_raw[0, 0] + bayer_raw[0, 2] + bayer_raw[2, 0] + bayer_raw[2, 2]) / 4.0

print("--- Evaluasi Demosaicing Pola Bayer RGGB ---")
print(f"Piksel Sensor RAW di (1,1): Nilai Biru Asli = {b_val:.1f}")
print(f"Interpolasi Kanal Hijau (4-tetangga silang): G = {g_val:.2f}")
print(f"Interpolasi Kanal Merah (4-tetangga diagonal): R = {r_val:.2f}")
print(f"Vektor Warna RGB Terekonstruksi: [R={r_val:.1f}, G={g_val:.1f}, B={b_val:.1f}]")
"""

c1_3_pitfalls = [
    "Keliru mengidentifikasi urutan fase Bayer hardware (misal: sensor berfase BGGR atau GBRG diproses menggunakan pipeline RGGB, mengakibatkan *color inversion* ekstrem).",
    "Penggunaan demosaicing bilinear sederhana pada tepi berfrekuensi tinggi (*sharp edges*), memicu artefak visual *zippering* dan *false color fringes*.",
    "Memproses citra RAW sebelum mengurangkan tingkat hitam (*black level calibration*) dan mengoreksi piksel mati (*dead pixel correction*)."
]

c1_3_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 10.3.1: Color filter arrays and demosaicing."
    }
]

subchapters.append(create_subchapter("computer-vision-ch1-sub3", "1.3. Sensor CMOS, Pola Bayer Filter & Demosaicing", c1_3_desc, c1_3_md, c1_3_code, c1_3_pitfalls, c1_3_refs))

# ==============================================================================
# SUBCHAPTER 1.4: Ruang Warna RGB vs BGR (OpenCV Standard)
# ==============================================================================
c1_4_desc = "Analisis historis dan teknis konvensi BGR pada OpenCV, perbedaan susunan kanal memori dengan RGB standar, serta konversi matematis."
c1_4_md = """Salah satu sumber kesalahan paling umum dalam rekayasa visi komputer adalah inkonsistensi urutan kanal warna (*color channel ordering*) antara modul pemuatan citra OpenCV dan pustaka pemrosesan/visualisasi lainnya (seperti Matplotlib, PIL, PyTorch, dan TensorFlow).

### 1. Asal-Usul Historis Konvensi BGR
Ketika Bradski dan tim Intel mengembangkan OpenCV pada tahun 1999–2000, perangkat keras video grafis PC dan format *frame grabber* kamera industri berbasis arsitektur x86 mengandalkan format Windows Bitmap (`.bmp`) dan standar chipset video tertentu yang menyimpan piksel dalam urutan *Blue-Green-Red* (BGR) di ruang memori *little-endian*. Konvensi ini dipertahankan oleh OpenCV hingga saat ini untuk menjaga kompatibilitas mundur (*backward compatibility*).

### 2. Disparitas Visual: Efek Kanal Terbalik
Piksel warna dengan representasi RGB $[R=255, G=0, B=0]$ (merah murni) jika diinterpretasikan oleh pembaca BGR akan diperlakukan sebagai $[B=255, G=0, R=0]$ (biru murni).

Ketika citra BGR yang dimuat via `cv2.imread()` langsung divisualisasikan menggunakan `plt.imshow()`, wajah manusia akan tampak memiliki warna kulit kebiru-biruan abnormal (*zombie skin effect*).

### 3. Operasi Pembalikan Kanal
Konversi dapat dilakukan secara instan tanpa alokasi memori berlebih melalui pembalikan irisan (*negative slicing*) array NumPy atau transformasi geometris sumbu:
$$\\mathbf{I}_{\\text{RGB}} = \\mathbf{I}_{\\text{BGR}}[:, :, ::-1]$$"""

c1_4_code = r"""import numpy as np

# 1. Buat citra BGR 1 piksel dengan warna Merah Oranye khas (R=255, G=80, B=20)
# Dalam format OpenCV BGR, urutannya adalah [B, G, R]
pixel_bgr = np.array([[[20, 80, 255]]], dtype=np.uint8)

# 2. Konversi BGR -> RGB menggunakan array slicing NumPy [..., ::-1]
pixel_rgb = pixel_bgr[:, :, ::-1]

# 3. Bandingkan representasi matematis kedua array
print("--- Perbandingan Kanal Warna BGR vs RGB ---")
print("Format BGR (OpenCV):", pixel_bgr[0, 0].tolist(), "-> Interpretasi: B=20, G=80, R=255")
print("Format RGB (Standar):", pixel_rgb[0, 0].tolist(), "-> Interpretasi: R=255, G=80, B=20")

# 4. Validasi Ekuivalensi Memori
assert pixel_bgr[0, 0, 0] == pixel_rgb[0, 0, 2], "Kanal B pada BGR harus identik dengan kanal B pada RGB"
assert pixel_bgr[0, 0, 2] == pixel_rgb[0, 0, 0], "Kanal R pada BGR harus identik dengan kanal R pada RGB"
print("Status Verifikasi: Konversi kanal dua arah terbukti konsisten 100%.")
"""

c1_4_pitfalls = [
    "Menyimpan citra RGB menggunakan `cv2.imwrite()` tanpa konversi balik ke BGR, menyebabkan berkas citra disk tersimpan dengan warna merah dan biru yang tertukar.",
    "Mengasumsikan `np.ascontiguousarray()` otomatis terjadi saat melakukan pembalikan irisan `[::-1]`. Tensor non-contiguous dapat menimbulkan penurunan performa pada operasi GPU PyTorch.",
    "Melatih model deep learning visi (ResNet, YOLO) dengan input BGR tetapi mengevaluasinya di tahap inferensi dengan citra RGB, menurunkan akurasi model secara drastis."
]

c1_4_refs = [
    {
        "title": "OpenCV Documentation & Design Patterns",
        "authors": ["OpenCV Team"],
        "year": 2024,
        "publisherOrVenue": "OpenCV Foundation",
        "url": "https://docs.opencv.org/",
        "relevance": "Core API Reference: Color Conversions (COLOR_BGR2RGB and COLOR_RGB2BGR)."
    }
]

subchapters.append(create_subchapter("computer-vision-ch1-sub4", "1.4. Ruang Warna RGB vs BGR (OpenCV Standard)", c1_4_desc, c1_4_md, c1_4_code, c1_4_pitfalls, c1_4_refs))

# ==============================================================================
# SUBCHAPTER 1.5: Ruang Warna HSV/HSL: Pemisahan Kromatisitas dan Intensitas
# ==============================================================================
c1_5_desc = "Model silinder warna HSV (Hue, Saturation, Value), formulasi analitis konversi RGB ke HSV, serta keunggulannya dalam segmentasi warna invarian iluminasi."
c1_5_md = """Meskipun ruang warna RGB sangat sesuai dengan karakteristik perangkat keras penampil (*display hardware*), model ini memiliki kelemahan mendasar untuk analisis visi komputer: ketiga kanal $(R, G, B)$ memiliki korelasi tinggi terhadap variasi intensitas pencahayaan (*illumination*). Perubahan bayangan atau kecerahan lampu akan mengubah ketiga nilai $R, G,$ dan $B$ secara drastis.

### 1. Struktur Silinder Ruang Warna HSV
Model HSV (Smith, 1978) memisahkan informasi warna menjadi komponen kromatisitas murni dan intensitas kecerahan:
- **Hue ($H \\in [0^\\circ, 360^\\circ)$)**: Panjang gelombang warna dominan (merah murni pada $0^\\circ$, hijau pada $120^\\circ$, biru pada $240^\\circ$).
- **Saturation ($S \\in [0, 1]$)**: Kemurnian warna (kejenuhan). $S=0$ menunjukkan skala abu-abu netral, sedangkan $S=1$ adalah warna murni tersaturasi penuh.
- **Value ($V \\in [0, 1]$)**: Intensitas kecerahan fotometrik ($V = \\max(R, G, B)$).

### 2. Formulasi Konversi Matematis RGB ke HSV
Diberikan nilai $R, G, B \\in [0, 1]$, tentukan $V_{\\max} = \\max(R, G, B)$ dan $V_{\\min} = \\min(R, G, B)$, serta rentang diferensial $\\Delta = V_{\\max} - V_{\\min}$.

Kalkulasi komponen:
$$V = V_{\\max}$$

$$S = \\begin{cases} 0 & \\text{jika } V_{\\max} = 0 \\\\ \\frac{\\Delta}{V_{\\max}} & \\text{jika } V_{\\max} > 0 \\end{cases}$$

$$H = \\begin{cases} 
0^\\circ & \\text{jika } \\Delta = 0 \\\\
60^\\circ \\times \\left(\\frac{G - B}{\\Delta} \\pmod 6\\right) & \\text{jika } V_{\\max} = R \\\\
60^\\circ \\times \\left(\\frac{B - R}{\\Delta} + 2\\right) & \\text{jika } V_{\\max} = G \\\\
60^\\circ \\times \\left(\\frac{R - G}{\\Delta} + 4\\right) & \\text{jika } V_{\\max} = B
\\end{cases}$$

Dalam segmentasi objek visual (seperti deteksi rambu lalu lintas atau pelacakan bola), kita cukup mendefinisikan batas ambang (*thresholding*) pada rentang $H$ dan $S$ tertentu, sambil membiarkan rentang $V$ fleksibel lebar untuk mengabaikan bayangan."""

c1_5_code = r"""import numpy as np

def rgb_to_hsv_pure(r: float, g: float, b: float) -> tuple:
    '''Konversi nilai RGB normalisasi [0, 1] ke HSV (H dalam derajat 0-360, S dan V dalam 0-1).'''
    v_max = max(r, g, b)
    v_min = min(r, g, b)
    delta = v_max - v_min
    
    # Value
    v = v_max
    
    # Saturation
    s = 0.0 if v_max == 0.0 else delta / v_max
    
    # Hue
    if delta == 0.0:
        h = 0.0
    elif v_max == r:
        h = 60.0 * (((g - b) / delta) % 6)
    elif v_max == g:
        h = 60.0 * (((b - r) / delta) + 2)
    else:
        h = 60.0 * (((r - g) / delta) + 4)
        
    return h, s, v

# Evaluasi 3 sampel warna: Merah Murni, Kuning Terang, dan Merah di Bawah Bayangan Gelap
samples = [
    ("Merah Cerah", (1.0, 0.0, 0.0)),
    ("Kuning Terang", (1.0, 1.0, 0.0)),
    ("Merah Bayangan (Gelap)", (0.4, 0.0, 0.0))
]

print("--- Demonstrasi Konversi RGB ke HSV & Invariansi Iluminasi ---")
for label, (r, g, b) in samples:
    h, s, v = rgb_to_hsv_pure(r, g, b)
    print(f"{label:22s} | RGB: ({r:.1f}, {g:.1f}, {b:.1f}) -> H={h:5.1f}°, S={s:.2f}, V={v:.2f}")

print("\nObservasi Ilmiah: Perhatikan bahwa 'Merah Cerah' dan 'Merah Bayangan' memiliki Hue identik (0.0°)")
print("dan Saturation identik (1.00), membuktikan ketahanan komponen warna terhadap perubahan intensitas V.")
"""

c1_5_pitfalls = [
    "Di OpenCV, nilai Hue pada citra 8-bit dipetakan ke rentang $[0, 179]$ (bukan $[0, 359]$) agar muat dalam tipe data `uint8` ($360 / 2 = 180$). Lupa membagi dua rentang target menyebabkan kegagalan deteksi.",
    "Warna merah melintasi diskontinuitas sudut $0^\\circ$ dan $360^\\circ$. Filter ambang batas merah memerlukan operasi logika OR antara dua rentang: misal $[0, 10]$ dan $[170, 180]$.",
    "Nilai Hue menjadi tidak terdefinisi secara matematis (*singularity*) ketika Saturation bernilai 0 (kondisi hitam, putih, atau abu-abu murni)."
]

c1_5_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 2.3.2: Color spaces (HSV and HSL representations)."
    }
]

subchapters.append(create_subchapter("computer-vision-ch1-sub5", "1.5. Ruang Warna HSV/HSL: Pemisahan Kromatisitas dan Intensitas", c1_5_desc, c1_5_md, c1_5_code, c1_5_pitfalls, c1_5_refs))

# ==============================================================================
# SUBCHAPTER 1.6: Ruang Warna CIELAB ($L^*a^*b^*$) untuk Keseragaman Persepsi
# ==============================================================================
c1_6_desc = "Standar ruang warna perseptual CIE 1976 L*a*b*, non-linearitas persepsi visual manusia, dan metrik selisih warna Euclidean Delta E."
c1_6_md = """Ruang warna RGB maupun HSV tidak bersifat *perceptually uniform*: jarak Euclidean matematis antara dua titik warna dalam ruang RGB tidak berkorelasi linier dengan persepsi perbedaan warna yang dirasakan oleh mata manusia.

### 1. Ruang Warna Perseptual CIE $L^*a^*b^*$ (1976)
Komisi Internasional Pencahayaan (CIE) merancang ruang warna $L^*a^*b^*$ yang dipetakan melalui ruang perantara CIE XYZ berdasarkan fungsi kepekaan sel kerucut mata (*tristimulus values*):
- $L^*$ (**Lightness**): Persepsi kecerahan manusia, bernilai $0$ (hitam sempurna) hingga $100$ (putih difus sempurna).
- $a^*$: Sumbu kromatisitas hijau (negatif) ke merah (positif).
- $b^*$: Sumbu kromatisitas biru (negatif) ke kuning (positif).

Transformasi dari nilai XYZ yang dinormalisasi terhadap titik putih acuan ($X_n, Y_n, Z_n$):
$$L^* = 116 f(Y / Y_n) - 16$$
$$a^* = 500 [f(X / X_n) - f(Y / Y_n)]$$
$$b^* = 200 [f(Y / Y_n) - f(Z / Z_n)]$$

Fungsi non-linear $f(t)$ mengoreksi respons logaritmik mata manusia:
$$f(t) = \\begin{cases} t^{1/3} & \\text{jika } t > \\left(\\frac{6}{29}\\right)^3 \\\\ \\frac{1}{3} \\left(\\frac{29}{6}\\right)^2 t + \\frac{4}{29} & \\text{lainnya} \\end{cases}$$

### 2. Metrik Jarak Warna $\\Delta E^*_{ab}$
Keunggulan utama CIELAB adalah keseragaman persepsinya: perbedaan warna total antara dua sampel $\\mathbf{C}_1$ dan $\\mathbf{C}_2$ dapat dihitung langsung melalui jarak Euclidean:

$$\\Delta E^*_{ab} = \\sqrt{(L_1^* - L_2^*)^2 + (a_1^* - a_2^*)^2 + (b_1^* - b_2^*)^2}$$

Ambangan empiris:
- $\\Delta E^* < 1.0$: Perbedaan tidak dapat dideteksi oleh mata manusia normal (*Just Noticeable Difference* / JND).
- $1.0 < \\Delta E^* < 2.0$: Perbedaan hanya dapat dideteksi melalui inspeksi visual teliti.
- $\\Delta E^* > 3.5$: Perbedaan terlihat jelas oleh pengamat awam."""

c1_6_code = r"""import numpy as np

def delta_e_cielab(lab1: np.ndarray, lab2: np.ndarray) -> float:
    '''Menghitung jarak Euclidean Delta E 76 antara dua vektor warna CIELAB.'''
    return float(np.sqrt(np.sum((lab1 - lab2) ** 2)))

# Nilai CIELAB (L*, a*, b*) untuk 3 sampel warna
# Sampel 1: Referensi Cat Biru Laut
color_ref = np.array([50.0, -10.0, -35.0])
# Sampel 2: Batch Pabrik A (Variasi sangat tipis)
color_batch_a = np.array([50.8, -9.5, -34.7])
# Sampel 3: Batch Pabrik B (Variasi nyata terlihat)
color_batch_b = np.array([55.0, -5.0, -28.0])

de_a = delta_e_cielab(color_ref, color_batch_a)
de_b = delta_e_cielab(color_ref, color_batch_b)

print("--- Evaluasi Toleransi Warna Industri dengan CIELAB Delta E ---")
print(f"Referensi: L*={color_ref[0]}, a*={color_ref[1]}, b*={color_ref[2]}")
print(f"Batch A  : Delta E = {de_a:.2f} -> Status: {'Lolos Toleransi (Perbedaan Halus)' if de_a < 1.5 else 'Gagal'}")
print(f"Batch B  : Delta E = {de_b:.2f} -> Status: {'Lolos Toleransi' if de_b < 1.5 else 'Gagal (Perbedaan Nyata Melebihi Ambang)'}")
"""

c1_6_pitfalls = [
    "Mengasumsikan formula $\\Delta E^*_{ab}$ Euclidean (1976) sepenuhnya sempurna di seluruh spektrum warna; pada warna jenuh tinggi, CIE merumuskan metrik revisi yang lebih presisi seperti CIEDE2000 ($\\Delta E_{00}$).",
    "Di OpenCV, nilai $L^*, a^*, b^*$ pada citra 8-bit dipetakan ulang: $L^* \\gets L^* \\times 255 / 100$, $a^* \\gets a^* + 128$, $b^* \\gets b^* + 128$ agar masuk dalam rentang byte $[0, 255]$.",
    "Melakukan interpolasi linear langsung pada ruang non-linear tanpa memperhitungkan *color gamut clipping*."
]

c1_6_refs = [
    {
        "title": "Colorimetry (4th ed.)",
        "authors": ["Janos Schanda"],
        "year": 2007,
        "publisherOrVenue": "CIE & Wiley",
        "url": "https://cie.co.at/",
        "relevance": "CIE standard colorimetric systems, CIELAB 1976 formulas, and color difference metrics."
    }
]

subchapters.append(create_subchapter("computer-vision-ch1-sub6", "1.6. Ruang Warna CIELAB ($L^*a^*b^*$) untuk Keseragaman Persepsi", c1_6_desc, c1_6_md, c1_6_code, c1_6_pitfalls, c1_6_refs))

# ==============================================================================
# SUBCHAPTER 1.7: Ruang Warna YUV / YCbCr pada Kompresi Video
# ==============================================================================
c1_7_desc = "Kompresi video dan penyiaran digital, pemisahan Luminance Y dan Chrominance Cb/Cr, serta teknik Chroma Subsampling (4:4:4, 4:2:2, 4:2:0)."
c1_7_md = """Sistem penglihatan manusia (*human visual system* / HVS) memiliki kepekaan resolusi spasial yang jauh lebih tajam terhadap perbedaan intensitas cahaya/luminansi dibandingkan perbedaan rona warna/krominansi. Prinsip biologis ini mendasari ruang warna YUV dan YCbCr yang digunakan dalam kompresi JPEG, WebP, MPEG, dan standar streaming H.264/H.265.

### 1. Komponen YCbCr (Standar ITU-R BT.601)
- $Y$ (**Luminance / Luma**): Informasi monokromatik abu-abu beresolusi penuh.
- $Cb$ (**Chroma Blue-difference**): Deviasi warna biru terhadap luminansi ($B - Y$).
- $Cr$ (**Chroma Red-difference**): Deviasi warna merah terhadap luminansi ($R - Y$).

Matriks transformasi digital dari komponen $R, G, B \\in [0, 255]$:
$$\\begin{bmatrix} Y \\\\ Cb \\\\ Cr \\end{bmatrix} = \\begin{bmatrix} 0.299 & 0.587 & 0.114 \\\\ -0.168736 & -0.331264 & 0.5 \\\\ 0.5 & -0.418688 & -0.081312 \\end{bmatrix} \\begin{bmatrix} R \\\\ G \\\\ B \\end{bmatrix} + \\begin{bmatrix} 0 \\\\ 128 \\\\ 128 \\end{bmatrix}$$

### 2. Skema Chroma Subsampling (J:a:b)
Dengan mengalokasikan laju bit lebih sedikit untuk kanal $Cb$ dan $Cr$, penghematan *bandwidth* signifikan tercapai tanpa penurunan kualitas visual yang kentara:
- **4:4:4 (Tanpa Subsampling)**: Setiap piksel memiliki data $Y, Cb, Cr$ lengkap (100% ukuran data).
- **4:2:2**: Kanal kroma di-subsample $2\\times$ secara horizontal. Setiap 2 piksel horizontal berbagi 1 pasang sampel $Cb/Cr$ (penghematan $33.3\\%$ ukuran data).
- **4:2:0 (Standar Web & Video)**: Kanal kroma di-subsample $2\\times$ secara horizontal dan $2\\times$ vertikal. Setiap blok $2 \\times 2$ (4 piksel) berbagi 1 pasang sampel $Cb/Cr$ tunggal (penghematan $50\\%$ ukuran data)."""

c1_7_code = r"""import numpy as np

# 1. Definisikan Matriks Transformasi ITU-R BT.601 (RGB ke YCbCr)
rgb_to_ycbcr_mat = np.array([
    [ 0.299000,  0.587000,  0.114000],
    [-0.168736, -0.331264,  0.500000],
    [ 0.500000, -0.418688, -0.081312]
], dtype=np.float64)
offset = np.array([0.0, 128.0, 128.0], dtype=np.float64)

# 2. Sampel Blok Piksel 2x2 Warna Hijau Daun (R=34, G=139, B=34)
block_rgb = np.tile(np.array([34.0, 139.0, 34.0]), (2, 2, 1))

# Konversi setiap piksel ke YCbCr
block_ycbcr = np.zeros_like(block_rgb)
for r in range(2):
    for c in range(2):
        block_ycbcr[r, c] = rgb_to_ycbcr_mat @ block_rgb[r, c] + offset

# 3. Simulasi Chroma Subsampling 4:2:0:
# Y dipertahankan 4 sampel penuh (2x2), Cb dan Cr dirata-ratakan menjadi 1 sampel tunggal
luma_y = block_ycbcr[:, :, 0]
chroma_cb_avg = np.mean(block_ycbcr[:, :, 1])
chroma_cr_avg = np.mean(block_ycbcr[:, :, 2])

print("--- Komputasi Ruang Warna YCbCr & Chroma Subsampling 4:2:0 ---")
print(f"Ukuran Data Asli (RGB 4:4:4) : 4 piksel x 3 kanal = 12 nilai")
print(f"Luma Y (4 piksel penuh):\n{luma_y.round(1)}")
print(f"Chroma Subsampled (1 pasang) : Cb={chroma_cb_avg:.2f}, Cr={chroma_cr_avg:.2f}")
print(f"Ukuran Data Hasil (4:2:0)    : 4 nilai Y + 1 Cb + 1 Cr = 6 nilai (Kompresi 50%)")
"""

c1_7_pitfalls = [
    "Mengabaikan standar koefisien warna: ITU-R BT.601 digunakan untuk video SD/JPEG, sedangkan video HD/UHD menggunakan koefisien ITU-R BT.709 atau BT.2020 yang memiliki bobot berbeda.",
    "Rentang dinamis YCbCr: terdapat varian *full-range* ($Y \\in [0, 255]$) dan *limited-range* / *TV broadcast* ($Y \\in [16, 235]$). Mengabaikan perbedaan ini memicu kontras pudar (*washed-out blacks*).",
    "Melakukan downsampling kroma tanpa pra-filter anti-aliasing spasial, menghasilkan artefak tepi warna berundak."
]

c1_7_refs = [
    {
        "title": "Digital Video and HD: Algorithms and Interfaces (2nd ed.)",
        "authors": ["Charles Poynton"],
        "year": 2012,
        "publisherOrVenue": "Morgan Kaufmann",
        "url": "https://poynton.ca/",
        "relevance": "Bab 8: Y'CbCr and color spaces in video processing, ITU-R standards, and subsampling."
    }
]

subchapters.append(create_subchapter("computer-vision-ch1-sub7", "1.7. Ruang Warna YUV / YCbCr pada Kompresi Video", c1_7_desc, c1_7_md, c1_7_code, c1_7_pitfalls, c1_7_refs))

# ==============================================================================
# SUBCHAPTER 1.8: Kedalaman Bit (Bit Depth) & Format Gambar (PNG, JPEG, WebP)
# ==============================================================================
c1_8_desc = "Kedalaman bit intensitas (8-bit, 16-bit, 32-bit float), format kontainer raster, kompresi lossless vs lossy, dan implikasinya pada analisis citra medis/ilmiah."
c1_8_md = """Kedalaman bit (*bit depth*) menentukan jumlah bit biner yang dialokasikan untuk merepresentasikan tingkat intensitas setiap kanal warna pada suatu piksel.

### 1. Taksonomi Kedalaman Bit
- **8-bit per kanal (`uint8`)**: Standar komputasi konsumen dan web. Menghasilkan $2^8 = 256$ tingkat diskrit per kanal ($16.7$ juta kombinasi warna pada mode 24-bit TrueColor).
- **16-bit per kanal (`uint16`)**: Standar pencitraan medis (DICOM, CT/MRI), astronomi, dan format RAW kamera profesional. Menyediakan $2^{16} = 65.536$ tingkat diskrit, krusial untuk mencegah distorsi kuantisasi pada proses manipulasi kontras agresif.
- **32-bit float per kanal (`float32`)**: Standar pemrosesan deep learning dan komputasi grafis HDR (*High Dynamic Range*), merepresentasikan radiansi fisik dalam rentang tak terbatas $[-\\infty, +\\infty]$.

### 2. Karakteristik Format Berkas Citra
1. **JPEG (Joint Photographic Experts Group)**:
   - Jenis: Kompresi *lossy* berbasis *Discrete Cosine Transform* (DCT) $8 \\times 8$ piksel.
   - Kelebihan: Rasio kompresi sangat tinggi untuk citra fotografi alami.
   - Kelemahan: Memunculkan *blocking artifacts* dan *ringing noise* di sekitar tepi tajam.
2. **PNG (Portable Network Graphics)**:
   - Jenis: Kompresi *lossless* berbasis filter prediksi spasial 2D dan algoritma DEFLATE (LZ77 + Huffman).
   - Kelebihan: Preservasi data 100% tanpa distorsi, mendukung kanal transparansi alfa 8/16-bit.
3. **WebP**:
   - Jenis: Format modern kontemporer dari Google yang mendukung kompresi *lossy* (prediksi intra-frame VP8) maupun *lossless*, dengan efisiensi ukuran $25-34\\%$ lebih hemat dibanding JPEG/PNG."""

c1_8_code = r"""import numpy as np

# 1. Simulasikan Gradien Intensitas Halus pada 8-bit vs 16-bit
# Panjang garis 100 piksel melintasi rentang intensitas relatif 0.0 hingga 1.0
t = np.linspace(0.0, 1.0, 100)

# Kuantisasi ke 8-bit [0, 255]
grad_8bit = np.round(t * 255).astype(np.uint8)
# Kuantisasi ke 16-bit [0, 65535]
grad_16bit = np.round(t * 65535).astype(np.uint16)

# 2. Hitung jumlah tingkat unik yang dapat dibedakan
unique_8bit = len(np.unique(grad_8bit))
unique_16bit = len(np.unique(grad_16bit))

# 3. Hitung Galat Kuantisasi Rata-Rata (Mean Absolute Error terhadap nilai kontinu)
mae_8bit = np.mean(np.abs(t - (grad_8bit / 255.0)))
mae_16bit = np.mean(np.abs(t - (grad_16bit / 65535.0)))

print("--- Analisis Resolusi Kedalaman Bit (Bit Depth) ---")
print(f"Jumlah sampel pengujian      : 100 piksel")
print(f"Tingkat Unik 8-bit (uint8)   : {unique_8bit}/100 tingkat | MAE Kuantisasi: {mae_8bit:.6f}")
print(f"Tingkat Unik 16-bit (uint16) : {unique_16bit}/100 tingkat | MAE Kuantisasi: {mae_16bit:.9f}")
print(f"Rasio Presisi Kuantisasi 16-bit vs 8-bit: {mae_8bit / mae_16bit:.1f}x lebih presisi")
"""

c1_8_pitfalls = [
    "Menyimpan citra segmentasi masker (*ground truth masks*) dalam format JPEG, yang memicu nilai piksel kontinu artifisial di sekitar tepi akibat kuantisasi DCT lossy.",
    "Mengonversi array `float32` dengan rentang $[0.0, 1.0]$ langsung ke `uint8` tanpa perkalian skala 255 (`(img * 255).astype(np.uint8)`), menyebabkan citra berubah menjadi hitam pekat (semua nilai $\\le 0.99$ dibulatkan ke 0).",
    "Membuka citra 16-bit DICOM atau TIFF menggunakan flag default `cv2.imread()` yang secara otomatis memotong dan menguantisasi data ke 8-bit kecuali parameter `cv2.IMREAD_UNCHANGED` disertakan."
]

c1_8_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 2.3.3: Quantization, bit depth, and image compression formats."
    }
]

subchapters.append(create_subchapter("computer-vision-ch1-sub8", "1.8. Kedalaman Bit (Bit Depth) & Format Gambar (PNG, JPEG, WebP)", c1_8_desc, c1_8_md, c1_8_code, c1_8_pitfalls, c1_8_refs))

# ==============================================================================
# SUBCHAPTER 1.9: Kuantisasi Intensitas & Dynamic Range (HDR vs SDR)
# ==============================================================================
c1_9_desc = "Rentang dinamis pencitraan (Dynamic Range), kontras rasio fisik, koreksi gamma non-linear, dan operator Tone Mapping Reinhard untuk tampilan HDR ke SDR."
c1_9_md = """Rentang dinamis (*dynamic range*) dalam visi komputer adalah rasio antara intensitas radiansi tertinggi yang dapat diukur tanpa saturasi (*over-exposure*) dan intensitas terendah yang masih dapat dibedakan di atas ambang batas derau sensor (*noise floor*):

$$\\text{DR} = \\frac{I_{\\max}}{I_{\\min}}, \\quad \\text{DR}_{\\text{dB}} = 20 \\log_{10} \\left(\\frac{I_{\\max}}{I_{\\min}}\\right)$$

### 1. Keterbatasan Sensor SDR vs Realitas Fisik
Pemandangan dunia nyata sering kali memiliki rentang dinamis ekstrem melebihi $100.000:1$ (100 dB) — misal interior ruangan redup yang memiliki jendela menghadap matahari terik. Sensor standar SDR (*Standard Dynamic Range*) 8-bit hanya mampu menangkap rasio sekitar $255:1$ (~48 dB). Akibatnya terjadi pemotongan informasi (*clipping*): area gelap menjadi hitam pekat (*underexposed / crushed blacks*), sedangkan area terang menjadi putih jenuh (*blown highlights*).

### 2. Koreksi Gamma Non-linear ($\\gamma$)
Mata manusia merespons cahaya secara non-linear mendekati fungsi daya. Standar sRGB menerapkan koreksi gamma $\\gamma \\approx 2.2$ untuk mendistribusikan bit kuantisasi lebih efisien ke area gelap:

$$I_{\\text{display}} = I_{\\text{linear}}^{1 / \\gamma}$$

### 3. Operator Pemetaan Nada (Reinhard Tone Mapping)
Untuk menampilkan citra HDR (*High Dynamic Range*) berbasis radiansi fisik mengambang (`float32`) pada monitor SDR biasa, digunakan operator pemetaan nada (*tone mapping*). Operator global Reinhard (2002) memetakan rentang $[0, \\infty)$ ke $[0, 1)$ secara halus:

$$I_{\\text{sdr}}(x, y) = \\frac{I_{\\text{hdr}}(x, y)}{1 + I_{\\text{hdr}}(x, y)}$$"""

c1_9_code = r"""import numpy as np

# 1. Simulasikan Array Radiansi HDR (Float32) dengan Rentang Dinamis Ekstrem
# Mengandung area gelap (0.01), normal (1.0), dan pantulan cahaya luar ruangan ekstrem (50.0)
hdr_radiance = np.array([0.01, 0.1, 0.5, 1.0, 5.0, 20.0, 50.0], dtype=np.float32)

# 2. Pemetaan Linier Naif dengan Clipping Sederhana [0, 1]
sdr_naive = np.clip(hdr_radiance, 0.0, 1.0)

# 3. Reinhard Global Tone Mapping Operator: L_sdr = L_hdr / (1 + L_hdr)
sdr_reinhard = hdr_radiance / (1.0 + hdr_radiance)

# 4. Aplikasi Koreksi Gamma sRGB (gamma = 2.2) pada Output Reinhard
sdr_gamma = np.power(sdr_reinhard, 1.0 / 2.2)

print("--- Komparasi Operator Tone Mapping HDR ke SDR ---")
print(f"{'Radiansi Asli':15s} | {'Naif Clip':10s} | {'Reinhard':10s} | {'Reinhard + Gamma':16s}")
print("-" * 60)
for i in range(len(hdr_radiance)):
    rad = hdr_radiance[i]
    print(f"{rad:15.2f} | {sdr_naive[i]:10.2f} | {sdr_reinhard[i]:10.3f} | {sdr_gamma[i]:16.3f}")

print("\nAnalisis: Perhatikan bahwa pada radiansi tinggi (20.0 dan 50.0), Reinhard mencegah saturasi total")
print("dan mempertahankan gradasi relatif, tidak seperti clipping naif yang langsung jenuh di 1.00.")
"""

c1_9_pitfalls = [
    "Menghitung rata-rata atau konvolusi pada citra yang telah melalui koreksi gamma (ruang non-linear), yang secara fisik melanggar hukum penambahan foton linier (*radiometric linearity*).",
    "Melakukan tonemapping global sederhana pada pemandangan dengan gradien lokal tinggi, yang dapat menyebabkan hilangnya kontras mikro (*local contrast loss*); solusi modern menggunakan tonemapping lokal berbasis bilateral filter.",
    "Mengabaikan kalibrasi eksposur saat menggabungkan eksposur multi-frame (*exposure bracketing*) pada rekonstruksi kurva respons kamera Debevec-Malik."
]

c1_9_refs = [
    {
        "title": "Photographic Tone Reproduction for Digital Images",
        "authors": ["Erik Reinhard", "Michael Stark", "Peter Shirley", "James Ferwerda"],
        "year": 2002,
        "publisherOrVenue": "ACM Transactions on Graphics (SIGGRAPH)",
        "url": "https://doi.org/10.1145/566654.566575",
        "relevance": "Landasan operator tone mapping global dan lokal untuk kompresi rentang dinamis HDR."
    }
]

subchapters.append(create_subchapter("computer-vision-ch1-sub9", "1.9. Kuantisasi Intensitas & Dynamic Range (HDR vs SDR)", c1_9_desc, c1_9_md, c1_9_code, c1_9_pitfalls, c1_9_refs))

# ==============================================================================
# SUBCHAPTER 1.10: Pemuatan, Manipulasi & Visualisasi Citra Menggunakan OpenCV & Matplotlib
# ==============================================================================
c1_10_desc = "Praktikum terpadu pemuatan berkas, manipulasi irisan matriks NumPy, penyesuaian kontras berbasis lookup table, kalkulasi histogram, dan visualisasi kanvas."
c1_10_md = """Dalam lingkungan rekayasa visi komputer modern, NumPy bertindak sebagai tulang punggung struktur data internal (*in-memory data structure*), menghubungkan antarmuka I/O OpenCV dengan ekosistem visualisasi dan deep learning.

### 1. Operasi Irisan Array (Slicing) & Wilayah Minat (ROI)
Karena citra adalah array NumPy 2D/3D, ekstraksi wilayah minat (*Region of Interest* / ROI) dapat dilakukan dengan kompleksitas waktu $\\mathcal{O}(1)$ melalui *view* memori tanpa menyalin data:
$$\\mathbf{ROI} = \\mathbf{I}[y_1:y_2, x_1:x_2]$$

### 2. Histogram Intensitas Citra
Histogram intensitas adalah perkiraan empiris fungsi kepadatan probabilitas (PDF) tingkat keabuan citra. Untuk citra dengan $L$ tingkat keabuan ($L=256$ pada 8-bit), histogram $h(k)$ menghitung frekuensi kemunculan nilai intensitas $k$:
$$h(k) = \\sum_{y=0}^{H-1} \\sum_{x=0}^{W-1} \\mathbb{I}(I(y, x) == k), \\quad k \\in [0, L-1]$$

### 3. Penyesuaian Kontras & Kecerahan Linear
Manipulasi titik piksel linear dirumuskan sebagai:
$$g(x, y) = \\operatorname{clip}(\\alpha \\cdot f(x, y) + \\beta, 0, 255)$$
Di mana $\\alpha > 0$ mengendalikan kontras (penguatan gradien) dan $\\beta \\in [-255, 255]$ mengendalikan kecerahan (*brightness offset*)."""

c1_10_code = r"""import numpy as np

# 1. Bangun Citra Uji Sintetis 8x8 Skala Abu-Abu dengan Objek di Tengah
image = np.full((8, 8), 50, dtype=np.uint8)
# Beri objek terang di wilayah tengah (ROI: baris 2..5, kolom 2..5)
image[2:6, 2:6] = 200

# 2. Ekstraksi Region of Interest (ROI)
roi = image[2:6, 2:6]

# 3. Transformasi Kontras dan Kecerahan Linear: g = clip(alpha * f + beta, 0, 255)
alpha = 1.2   # Penguatan kontras
beta = 10.0   # Peningkatan kecerahan
adjusted_image = np.clip(alpha * image.astype(np.float32) + beta, 0, 255).astype(np.uint8)

# 4. Kalkulasi Histogram Intensitas 8-bit secara Manual Berbasis Frekuensi
bins = np.zeros(256, dtype=np.int32)
for val in image.ravel():
    bins[val] += 1

# Temukan nilai intensitas yang benar-benar muncul dalam citra
non_zero_bins = [(k, int(bins[k])) for k in range(256) if bins[k] > 0]

print("--- Hasil Manipulasi Matriks Citra & Analisis Histogram ---")
print("Dimensi Citra Asli :", image.shape)
print("Dimensi ROI Terpotong :", roi.shape)
print("Intensitas Asli Latar:", image[0, 0], "-> Setelah Transformasi:", adjusted_image[0, 0])
print("Intensitas Asli Objek:", image[3, 3], "-> Setelah Transformasi:", adjusted_image[3, 3])
print("Frekuensi Histogram Citra Asli (Nilai Intensitas, Jumlah Piksel):", non_zero_bins)
"""

c1_10_pitfalls = [
    "Memodifikasi array ROI hasil irisan (`roi = img[y1:y2, x1:x2]`) secara tidak sengaja mengubah citra asli karena irisan NumPy secara default mengembalikan *memory view*, bukan salinan independen (`.copy()`).",
    "Melakukan operasi kontras langsung pada array `uint8` (`img * 1.2 + 10`), memicu kesalahan tipe float atau *silent rollover overflow*.",
    "Menggunakan fungsi GUI interaktif (`cv2.imshow()`, `cv2.waitKey()`) dalam lingkungan server/backend tanpa layar tampilan (headless server / CI/CD pipeline), menyebabkan proses hang tanpa batas."
]

c1_10_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 3.1: Point operators and pixel transformations."
    }
]

subchapters.append(create_subchapter("computer-vision-ch1-sub10", "1.10. Pemuatan, Manipulasi & Visualisasi Citra Menggunakan OpenCV & Matplotlib", c1_10_desc, c1_10_md, c1_10_code, c1_10_pitfalls, c1_10_refs))

# ==============================================================================
# SAVE JSON OUTPUT
# ==============================================================================
output_path = os.path.join(os.path.dirname(__file__), "cv_ch1_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 1 data with {len(subchapters)} subchapters: {output_path}")
