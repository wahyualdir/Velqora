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
# SUBCHAPTER 3.1: Operasi Konvolusi 2D vs Korelasi Silang (Cross-Correlation)
# ==============================================================================
c3_1_desc = "Perbedaan mendasar konvolusi 2D dan korelasi silang (cross-correlation), pembalikan kernel 180 derajat, sifat komutatif/asosiatif, dan strategi padding batas."
c3_1_md = """Dalam domain pengolahan sinyal dan visi komputer, pemfilteran spasial lingkungan (*neighborhood spatial filtering*) merekayasa nilai suatu piksel berdasarkan kombinasi linier dari piksel-piksel di sekitarnya yang diboboti oleh matriks kecil yang disebut **kernel** atau **mask**.

### 1. Korelasi Silang vs Konvolusi 2D
Diberikan citra kontinu atau diskrit $I(x, y)$ dan kernel berukuran $(2k+1) \\times (2k+1)$ bernama $K(u, v)$:

1. **Korelasi Silang (*Cross-Correlation*)**:
   Kernel digeser langsung di atas citra tanpa pembalikan:
   $$(I \\otimes K)(x, y) = \\sum_{u=-k}^{k} \\sum_{v=-k}^{k} I(x + u, y + v) K(u, v)$$

2. **Konvolusi Matematis 2D (*Convolution*)**:
   Kernel dibalik $180^\\circ$ (dicerminkan secara horizontal dan vertikal) sebelum dikalikan dan dijumlahkan:
   $$(I * K)(x, y) = \\sum_{u=-k}^{k} \\sum_{v=-k}^{k} I(x - u, y - v) K(u, v) = \\sum_{u=-k}^{k} \\sum_{v=-k}^{k} I(x + u, y + v) K(-u, -v)$$

### 2. Signifikansi Teoretis: Sifat Aljabar
Pembalikan kernel $180^\\circ$ memberikan konvolusi sifat aljabar yang sangat krusial:
- **Komutatif**: $I * K = K * I$
- **Asosiatif**: $I * (K_1 * K_2) = (I * K_1) * K_2$
Sifat asosiatif memungkinkan penggabungan beberapa filter berurutan (misal: Gaussian blur dilanjutkan Sobel) menjadi satu kernel komposit tunggal sebelum diaplikasikan ke citra, menghemat komputasi secara drastis.

Sebaliknya, operasi korelasi silang **tidak bersifat asosiatif**. (Catatan teknis: sebagian besar pustaka *deep learning* seperti PyTorch `nn.Conv2d` sebenarnya mengimplementasikan korelasi silang, karena bobot kernel dipelajari secara bebas melalui *backpropagation* sehingga pembalikan kernel tidak berpengaruh)."""

c3_1_code = r"""import numpy as np

def cross_correlation_2d(image: np.ndarray, kernel: np.ndarray) -> np.ndarray:
    '''Operasi Korelasi Silang 2D tanpa pembalikan kernel (mode valid).'''
    H, W = image.shape
    kH, kW = kernel.shape
    pad_y, pad_x = kH // 2, kW // 2
    out = np.zeros((H - 2 * pad_y, W - 2 * pad_x), dtype=np.float64)
    for y in range(out.shape[0]):
        for x in range(out.shape[1]):
            patch = image[y:y + kH, x:x + kW]
            out[y, x] = np.sum(patch * kernel)
    return out

def convolution_2d(image: np.ndarray, kernel: np.ndarray) -> np.ndarray:
    '''Operasi Konvolusi Matematis 2D sejati dengan pembalikan kernel 180 derajat.'''
    # Membalik kernel secara horizontal dan vertikal: K[-u, -v]
    flipped_kernel = np.flipud(np.fliplr(kernel))
    return cross_correlation_2d(image, flipped_kernel)

# Citra Uji 5x5 dengan Fitur Gradien Tajam
img = np.array([
    [10, 10, 10, 10, 10],
    [10, 20, 30, 40, 10],
    [10, 30, 90, 50, 10],
    [10, 40, 50, 60, 10],
    [10, 10, 10, 10, 10]
], dtype=np.float64)

# Kernel Asimetris 3x3 (Detektor Arah Diagonal Tertentu)
kernel_asym = np.array([
    [1.0, 2.0, 0.0],
    [0.0, 0.0, 0.0],
    [-1.0, -2.0, 0.0]
], dtype=np.float64)

corr_res = cross_correlation_2d(img, kernel_asym)
conv_res = convolution_2d(img, kernel_asym)

print("--- Perbandingan Komputasi Konvolusi 2D vs Korelasi Silang ---")
print("Hasil Korelasi Silang (Tengah):\n", corr_res.round(1))
print("\nHasil Konvolusi Sejati (Tengah - Kernel Dibalik 180°):\n", conv_res.round(1))
print(f"\nPerbedaan Nilai Piksel Pusat (y=1, x=1): Korelasi={corr_res[1, 1]} vs Konvolusi={conv_res[1, 1]}")
"""

c3_1_pitfalls = [
    "Mengasumsikan konvolusi dan korelasi silang selalu menghasilkan output yang sama; keduanya hanya identik jika kernel bersifat simetris ganda (*symmetric kernel*, seperti Gaussian atau Laplacian).",
    "Mengabaikan degradasi resolusi pada batas citra jika menggunakan mode valid; strategi *padding* (`constant`, `reflect`, `replicate`) harus dipilih secara sadar sesuai kasus batas.",
    "Menggunakan *zero-padding* pada citra terang tanpa normalisasi, yang menciptakan tepian gelap artifisial (*dark boundary artifact*) di sekeliling batas kanvas."
]

c3_1_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 3.2: Linear filtering, correlation, convolution, and separability."
    }
]

subchapters.append(create_subchapter("computer-vision-ch3-sub1", "3.1. Operasi Konvolusi 2D vs Korelasi Silang (Cross-Correlation)", c3_1_desc, c3_1_md, c3_1_code, c3_1_pitfalls, c3_1_refs))

# ==============================================================================
# SUBCHAPTER 3.2: Filter Penghalus Rata-Rata (Box Filter) dan Gaussian Blur
# ==============================================================================
c3_2_desc = "Perbandingan Box Filter dan Gaussian Blur, distribusi normal 2D, pemisahan kernel spasial (separable filter O(2K) vs O(K^2)), dan teorema batas pusat."
c3_2_md = """Penghalusan spasial (*spatial smoothing*) bertujuan menekan komponen frekuensi tinggi yang berasosiasi dengan derau acak (*high-frequency noise*) sebelum melakukan ekstraksi fitur diferensial.

### 1. Filter Kotak (Box Filter / Mean Filter)
Filter kotak mengganti intensitas setiap piksel dengan rata-rata aritmatika seragam dari tetangganya:
$$K_{\\text{box}} = \\frac{1}{K^2} \\begin{bmatrix} 1 & \\dots & 1 \\\\ \\vdots & \\ddots & \\vdots \\\\ 1 & \\dots & 1 \\end{bmatrix}$$
Meskipun komputasinya murah, filter kotak memicu efek samping buruk: respon frekuensi sinc-nya membiarkan frekuensi tinggi bocor (*leakage*), menghasilkan artefak cincin (*ringing*) dan pengaburan tepi yang tidak wajar.

### 2. Filter Gaussian (Gaussian Blur)
Distribusi Gaussian 2D kontinu dengan deviasi standar $\\sigma$:
$$G(x, y; \\sigma) = \\frac{1}{2\\pi \\sigma^2} \\exp\\left(-\\frac{x^2 + y^2}{2\\sigma^2}\\right)$$

Gaussian adalah satu-satunya operator skala linear kontinu yang bersifat **isotropik murni** (simetris rotasi sempurna) dan tidak memperkenalkan komponen frekuensi palsu baru (*no spurious extrema*).

### 3. Sifat Pemisahan Kernel (*Separability*)
Fungsi Gaussian 2D dapat difaktorkan secara sempurna menjadi perkalian dua fungsi Gaussian 1D ortogonal:
$$G(x, y; \\sigma) = G_{1D}(x; \\sigma) \\cdot G_{1D}(y; \\sigma) = \\left(\\frac{1}{\\sqrt{2\\pi}\\sigma} e^{-\\frac{x^2}{2\\sigma^2}}\\right) \\left(\\frac{1}{\\sqrt{2\\pi}\\sigma} e^{-\\frac{y^2}{2\\sigma^2}}\\right)$$

Implikasi komputasi:
- Konvolusi 2D langsung berukuran $K \\times K$ memerlukan $\\mathcal{O}(K^2)$ perkalian per piksel.
- Konvolusi terpisah (1D horizontal diikuti 1D vertikal) hanya memerlukan $\\mathcal{O}(2K)$ perkalian per piksel. Untuk kernel $15 \\times 15$, ini memberikan percepatan komputasi $7.5\\times$ lipat."""

c3_2_code = r"""import numpy as np

def generate_gaussian_kernel_1d(sigma: float, radius: int = None) -> np.ndarray:
    '''Membuat kernel Gaussian 1D ternormalisasi.'''
    if radius is None:
        radius = int(np.ceil(3.0 * sigma))
    x = np.arange(-radius, radius + 1, dtype=np.float64)
    kernel_1d = np.exp(-(x**2) / (2.0 * sigma**2))
    kernel_1d /= np.sum(kernel_1d)
    return kernel_1d

# Parameter Sigma = 1.0 (Radius = 3, Ukuran Kernel = 7 piksel)
sigma = 1.0
k_1d = generate_gaussian_kernel_1d(sigma)

# Bentuk Kernel 2D penuh melalui outer product: K_2d = k_1d (kolom) * k_1d (baris)
k_2d = np.outer(k_1d, k_1d)

# Hitung rasio operasi perkalian untuk citra 1000x1000 piksel
K_size = len(k_1d)
ops_2d_direct = K_size ** 2
ops_separable = 2 * K_size
speedup = ops_2d_direct / ops_separable

print("--- Analisis Separable Gaussian Filter ---")
print(f"Sigma: {sigma} -> Ukuran Kernel: {K_size}x{K_size}")
print("Kernel 1D Horizontal (7 Nilai):\n", k_1d.round(4))
print(f"\nJumlah Elemen Kernel 2D: {k_2d.sum():.6f} (Ternormalisasi Sempurna ke 1.0)")
print(f"Operasi per Piksel (2D Langsung) : {ops_2d_direct} FLOPs")
print(f"Operasi per Piksel (Separable 1D): {ops_separable} FLOPs")
print(f"Efisiensi Komputasi               : {speedup:.2f}x lebih cepat")
"""

c3_2_pitfalls = [
    "Memilih ukuran jendela kernel terlalu kecil untuk nilai $\\sigma$ tertentu (misal: $\\sigma=3.0$ tetapi ukuran kernel hanya $3 \\times 3$). Aturan baku mengharuskan ukuran kernel minimal $2 \\lceil 3\\sigma \\rceil + 1$ (mencakup $99.7\\%$ area distribusi normal).",
    "Lupa menormalisasi kernel Gaussian (membagi dengan total jumlah elemen), yang menyebabkan perubahan intensitas rata-rata citra (citra menjadi lebih gelap atau lebih terang secara artifisial).",
    "Menggunakan konvolusi 2D penuh padahal pustaka menyediakan fungsi separable yang jauh lebih hemat memori dan cache prosesor."
]

c3_2_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 3.2.1: Gaussian filters, separability, and scale-space."
    }
]

subchapters.append(create_subchapter("computer-vision-ch3-sub2", "3.2. Filter Penghalus Rata-Rata (Box Filter) dan Gaussian Blur", c3_2_desc, c3_2_md, c3_2_code, c3_2_pitfalls, c3_2_refs))

# ==============================================================================
# SUBCHAPTER 3.3: Filter Median untuk Menghilangkan Derau Salt-and-Pepper
# ==============================================================================
c3_3_desc = "Filter statistik peringkat non-linear (Median Filter), mekanisme penekanan derau impuls (salt-and-pepper), dan keunggulannya dalam menjaga ketajaman tepi."
c3_3_md = """Derau impuls atau derau *salt-and-pepper* terjadi akibat kerusakan sel sensor, kesalahan transmisi data bit, atau partikel debu optik, di mana sejumlah piksel acak berubah menjadi nilai ekstrem maksimum ($255$ / garam) atau minimum ($0$ / lada).

### 1. Keterbatasan Filter Linear (Mean / Gaussian)
Filter linier konvolusional menghitung rata-rata tertimbang piksel lingkungan. Ketika satu piksel ekstrem ($255$) masuk ke dalam jendela, nilai tersebut akan 'mencemari' seluruh tetangganya, menyebarkan satu titik derau tajam menjadi bercak kabur yang lebih luas (*blur artifact*).

### 2. Mekanisme Filter Median Non-linear
Filter median adalah filter statistik peringkat (*order-statistic filter*). Pada setiap posisi $(x, y)$, nilai piksel di dalam jendela lingkungan berukuran $W \\times W$ dikumpulkan, diurutkan (*sorted*), dan nilai median (elemen tengah pada indeks ke-$(W^2 - 1)/2$) dipilih sebagai intensitas baru:

$$\\hat{I}(x, y) = \\operatorname{median}\\{I(x+i, y+j) \\mid -k \\le i, j \\le k\\}$$

### 3. Preservasi Tepi (Edge-Preserving Property)
Karena nilai median selalu merupakan salah satu nilai asli yang benar-benar ada di lingkungan piksel (bukan nilai sintetis baru hasil rata-rata), filter median memiliki kemampuan unik:
1. **Kebal terhadap Pencilan Ekstrem**: Nilai $0$ atau $255$ akan terdorong ke ujung paling kiri atau paling kanan daftar terurut, sehingga hampir tidak pernah terpilih sebagai median.
2. **Preservasi Tepi Step (*Step Edges*)**: Jika jendela melintasi batas tepi tajam (misal separuh bernilai 10 dan separuh bernilai 200), nilai median akan tetap bernilai 10 atau 200 secara tegas tanpa membentuk gradien transisi abu-abu."""

c3_3_code = r"""import numpy as np

def median_filter_2d(image: np.ndarray, kernel_size: int = 3) -> np.ndarray:
    '''Implementasi mandiri filter median non-linear 2D dengan padding replicate.'''
    H, W = image.shape
    pad = kernel_size // 2
    padded = np.pad(image, pad, mode='edge')
    out = np.zeros_like(image)
    
    for y in range(H):
        for x in range(W):
            window = padded[y:y + kernel_size, x:x + kernel_size]
            out[y, x] = np.median(window)
    return out

# Citra Sederhana 5x5 dengan Derau Salt (255) dan Pepper (0)
clean_img = np.full((5, 5), 100, dtype=np.uint8)
noisy_img = clean_img.copy()
# Suntikkan derau impuls ekstrem
noisy_img[1, 1] = 255  # Salt
noisy_img[2, 3] = 0    # Pepper
noisy_img[3, 2] = 255  # Salt

# Aplikasikan Filter Median 3x3 vs Filter Rata-rata 3x3
med_filtered = median_filter_2d(noisy_img, kernel_size=3)
mean_filtered = np.zeros_like(noisy_img)
padded_mean = np.pad(noisy_img.astype(np.float64), 1, mode='edge')
for y in range(5):
    for x in range(5):
        mean_filtered[y, x] = int(np.round(np.mean(padded_mean[y:y+3, x:x+3])))

print("--- Uji Komparasi Filter Median vs Filter Rata-Rata (Derau Impuls) ---")
print("Citra Berderau Salt-and-Pepper:\n", noisy_img)
print("\nHasil Filter Rata-Rata (Mean Filter - Derau Tersebar Menjadi Bercak):\n", mean_filtered)
print("\nHasil Filter Median (Median Filter - Eliminasi Derau Sempurna 100%):\n", med_filtered)
"""

c3_3_pitfalls = [
    "Kompleksitas komputasi pengurutan: algoritma sorting naif membutuhkan $\\mathcal{O}(W^2 \\log W^2)$ per piksel; untuk citra besar atau jendela lebar, algoritma median berbasis histogram pergeseran (Huang et al., 1979) $\\mathcal{O}(W)$ wajib digunakan.",
    "Filter median cenderung membulatkan sudut-sudut tajam (*corner rounding*) dan dapat menghilangkan fitur garis tipis yang memiliki lebar kurang dari setengah ukuran jendela kernel.",
    "Menerapkan filter median berulang kali pada citra yang sama (iteratif), yang dapat mengubah tekstur alami menjadi area datar kartun (*patchy / watercolor effect*)."
]

c3_3_refs = [
    {
        "title": "A Fast Two-Dimensional Median Filtering Algorithm",
        "authors": ["Thomas S. Huang", "G. J. Yang", "G. Y. Tang"],
        "year": 1979,
        "publisherOrVenue": "IEEE Transactions on Acoustics, Speech, and Signal Processing",
        "url": "https://doi.org/10.1109/TASSP.1979.1163188",
        "relevance": "Algoritma histogram berjalan untuk komputasi filter median berkecepatan tinggi."
    }
]

subchapters.append(create_subchapter("computer-vision-ch3-sub3", "3.3. Filter Median untuk Menghilangkan Derau Salt-and-Pepper", c3_3_desc, c3_3_md, c3_3_code, c3_3_pitfalls, c3_3_refs))

# ==============================================================================
# SUBCHAPTER 3.4: Filter Bilateral: Menghaluskan Permukaan dengan Preservasi Tepi
# ==============================================================================
c3_4_desc = "Formulasi filter bilateral Tomasi-Manduchi (1998), kombinasi kernel kedekatan spasial dan kemiripan fotometrik/radiometrik, serta aplikasi denoising."
c3_4_md = """Kelemahan terbesar filter Gaussian standar adalah sifatnya yang tidak selektif: ia mengaburkan derau sekaligus mengaburkan tepi objek yang penting. Filter Bilateral (Tomasi & Manduchi, 1998) mengatasi masalah ini dengan menggabungkan **kedekatan spasial** (*domain filtering*) dan **kemiripan intensitas fotometrik** (*range filtering*).

### 1. Formulasi Matematis Filter Bilateral
Intensitas terekonstruksi pada piksel $\\mathbf{p} = (x, y)$ dihitung sebagai rata-rata tertimbang non-linear:

$$I_{\\text{filtered}}(\\mathbf{p}) = \\frac{1}{W_p} \\sum_{\\mathbf{q} \\in \\Omega} I(\\mathbf{q}) \\cdot g_s(\\|\\mathbf{p} - \\mathbf{q}\\|) \\cdot g_r(|I(\\mathbf{p}) - I(\\mathbf{q})|)$$

Faktor normalisasi energi:
$$W_p = \\sum_{\\mathbf{q} \\in \\Omega} g_s(\\|\\mathbf{p} - \\mathbf{q}\\|) \\cdot g_r(|I(\\mathbf{p}) - I(\\mathbf{q})|)$$

Di mana:
1. **Bobot Spasial $g_s$**: Fungsi Gaussian berbasis jarak koordinat kartesius:
   $$g_s(\\|\\mathbf{p} - \\mathbf{q}\\|) = \\exp\\left(-\\frac{\\|\\mathbf{p} - \\mathbf{q}\\|^2}{2\\sigma_s^2}\\right)$$
2. **Bobot Radiometrik $g_r$**: Fungsi Gaussian berbasis selisih intensitas piksel:
   $$g_r(|I(\\mathbf{p}) - I(\\mathbf{q})|) = \\exp\\left(-\\frac{(I(\\mathbf{p}) - I(\\mathbf{q}))^2}{2\\sigma_r^2}\\right)$$

### 2. Perilaku Adaptif Dinamis
- **Di area datar homogen**: Selisih intensitas $|I(\\mathbf{p}) - I(\\mathbf{q})| \\approx 0$, sehingga $g_r \\approx 1$. Filter bertindak persis seperti Gaussian blur biasa, menghaluskan derau sensor secara efektif.
- **Di batas tepi tajam**: Piksel tetangga di seberang tepi memiliki intensitas sangat berbeda, sehingga $|I(\\mathbf{p}) - I(\\mathbf{q})| \\gg \\sigma_r$, mengakibatkan $g_r \\approx 0$. Piksel di seberang tepi diabaikan sepenuhnya dari perhitungan bobot, sehingga ketajaman tepi terjaga sempurna."""

c3_4_code = r"""import numpy as np

def bilateral_filter_pixel(patch: np.ndarray, center_val: float, sigma_s: float, sigma_r: float) -> float:
    '''Kalkulasi intensitas filter bilateral untuk 1 patch terpusat.'''
    kH, kW = patch.shape
    cy, cx = kH // 2, kW // 2
    
    # 1. Hitung Jarak Spasial dan Bobot Spasial g_s
    y_idx, x_idx = np.mgrid[0:kH, 0:kW]
    spatial_dist2 = (y_idx - cy)**2 + (x_idx - cx)**2
    g_s = np.exp(-spatial_dist2 / (2.0 * sigma_s**2))
    
    # 2. Hitung Selisih Intensitas dan Bobot Range g_r
    intensity_diff = patch - center_val
    g_r = np.exp(-(intensity_diff**2) / (2.0 * sigma_r**2))
    
    # 3. Bobot Bilateral Gabungan
    weights = g_s * g_r
    w_sum = np.sum(weights)
    return float(np.sum(weights * patch) / w_sum)

# Simulasikan Tepi Tajam 1D (Kiri=20, Kanan=200) dengan Derau Sensor Kecil
step_patch = np.array([
    [20.0, 22.0, 198.0],
    [21.0, 20.0, 202.0],  # Piksel pusat di (1,1) bernilai 20.0 (Sisi Kiri Tepi)
    [19.0, 21.0, 200.0]
], dtype=np.float64)

# Parameter: sigma_s = 1.5 piksel, sigma_r = 30.0 tingkat intensitas
sigma_s, sigma_r = 1.5, 30.0
val_bilateral = bilateral_filter_pixel(step_patch, step_patch[1, 1], sigma_s, sigma_r)
val_gaussian = np.mean(step_patch)  # Aproksimasi blur linier sederhana

print("--- Demonstrasi Preservasi Tepi Filter Bilateral ---")
print("Patch Citra Menyilang Tepi Tajam (Kiri ~20, Kanan ~200):\n", step_patch.round(1))
print(f"Piksel Pusat Asli              : {step_patch[1, 1]:.1f}")
print(f"Hasil Filter Linier Biasa      : {val_gaussian:.1f} (Tepi Rusak Terkaburkan)")
print(f"Hasil Filter Bilateral (Adaptif): {val_bilateral:.1f} (Derau Halus Diredam, Tepi 200 Diabaikan)")
"""

c3_4_pitfalls = [
    "Kompleksitas waktu: karena kernel bobot bergantung pada intensitas piksel input lokal ($g_r$), filter bilateral bersifat *non-linear and non-separable*, membutuhkan komputasi $\\mathcal{O}(K^2)$ per piksel (solusi cepat modern menggunakan Bilateral Grid Chen et al., 2007).",
    "Artefak pembalikan gradien (*gradient reversal artifacts*) dan *staircasing* jika parameter $\\sigma_r$ disetel terlalu kecil pada gradien halus.",
    "Mengabaikan kanal warna pada citra RGB: memfilter setiap kanal R, G, B secara independen dengan filter bilateral dapat memicu artefak tepi warna palsu (*color fringing*); jarak radiometrik harus dihitung dalam ruang warna gabungan (seperti CIELAB)."
]

c3_4_refs = [
    {
        "title": "Bilateral Filtering for Gray and Color Images",
        "authors": ["Carlo Tomasi", "Roberto Manduchi"],
        "year": 1998,
        "publisherOrVenue": "IEEE International Conference on Computer Vision (ICCV)",
        "url": "https://doi.org/10.1109/ICCV.1998.710815",
        "relevance": "Paper orisinal pendefinisian konsep filter bilateral untuk preservasi tepi."
    }
]

subchapters.append(create_subchapter("computer-vision-ch3-sub4", "3.4. Filter Bilateral: Menghaluskan Permukaan dengan Preservasi Tepi", c3_4_desc, c3_4_md, c3_4_code, c3_4_pitfalls, c3_4_refs))

# ==============================================================================
# SUBCHAPTER 3.5: Operator Deteksi Tepi Gradien Sobel & Scharr
# ==============================================================================
c3_5_desc = "Derivasi turunan pertama spasial terpusat, kernel Sobel 3x3, aproksimasi diferensial berbobot penghalus, dan kernel optimal Scharr."
c3_5_md = """Tepi (*edges*) secara fisik merepresentasikan batas diskontinuitas lokal intensitas citra, yang muncul akibat perubahan kedalaman permukaan geometris, orientasi bidang, bayangan, atau sifat material pantulan.

### 1. Turunan Pertama Spasial & Gradien Citra
Citra kontinu $I(x, y)$ memiliki vektor gradien dua dimensi:
$$\\nabla I = \\begin{bmatrix} \\frac{\\partial I}{\\partial x} \\\\ \\frac{\\partial I}{\\partial y} \\end{bmatrix} = \\begin{bmatrix} G_x \\\\ G_y \\end{bmatrix}$$

Pada citra digital diskrit, turunan diaproksimasi dengan beda terpusat (*central differences*):
$$\\frac{\\partial I}{\\partial x} \\approx \\frac{I(x+1, y) - I(x-1, y)}{2}$$

### 2. Operator Sobel (Sobel & Feldman, 1968)
Karena diferensiasi sangat rentan memperkuat derau frekuensi tinggi, operator Sobel menggabungkan operasi diferensial pada satu arah dengan operasi penghalusan Gaussian segitiga $[1, 2, 1]^T$ pada arah ortogonal:

$$\\mathbf{G}_x = \\begin{bmatrix} -1 & 0 & +1 \\\\ -2 & 0 & +2 \\\\ -1 & 0 & +1 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 2 \\\\ 1 \\end{bmatrix} * \\begin{bmatrix} -1 & 0 & +1 \\end{bmatrix}$$

$$\\mathbf{G}_y = \\begin{bmatrix} -1 & -2 & -1 \\\\ 0 & 0 & 0 \\\\ +1 & +2 & +1 \\end{bmatrix} = \\begin{bmatrix} -1 \\\\ 0 \\\\ +1 \\end{bmatrix} * \\begin{bmatrix} 1 & 2 & 1 \\end{bmatrix}$$

### 3. Operator Scharr (Aproksimasi Isotropik Optimal)
Untuk kernel kecil $3 \\times 3$, Sobel memiliki kesalahan simetri rotasi (*rotational error*) hingga beberapa derajat. Hanno Scharr (2000) mengoptimalkan koefisien turunan secara matematis untuk meminimalkan deviasi sudut:

$$\\mathbf{G}_x^{\\text{Scharr}} = \\begin{bmatrix} -3 & 0 & +3 \\\\ -10 & 0 & +10 \\\\ -3 & 0 & +3 \\end{bmatrix}, \\quad \\mathbf{G}_y^{\\text{Scharr}} = \\begin{bmatrix} -3 & -10 & -3 \\\\ 0 & 0 & 0 \\\\ +3 & +10 & +3 \\end{bmatrix}$$"""

c3_5_code = r"""import numpy as np

# 1. Definisikan Kernel Sobel dan Scharr Standar 3x3
sobel_x = np.array([
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
], dtype=np.float64)

scharr_x = np.array([
    [-3,  0,  3],
    [-10, 0, 10],
    [-3,  0,  3]
], dtype=np.float64)

# 2. Citra Miniatur 4x4 dengan Tepi Vertikal Tajam di Kolom 2
patch = np.array([
    [10, 10, 200, 200],
    [10, 10, 200, 200],
    [10, 10, 200, 200],
    [10, 10, 200, 200]
], dtype=np.float64)

# 3. Hitung Respon Gradien Horizontal pada Posisi Tengah (y=1, x=1)
# Sub-jendela 3x3 di sekitar (1, 1)
sub_win = patch[0:3, 0:3]

resp_sobel_x = np.sum(sub_win * sobel_x)
resp_scharr_x = np.sum(sub_win * scharr_x)

print("--- Evaluasi Operator Deteksi Gradien Sobel & Scharr ---")
print("Sub-jendela 3x3 Melintasi Tepi Vertikal:\n", sub_win)
print(f"\nRespon Gradien Sobel Gx : {resp_sobel_x:.1f} (Respon Positif Kuat)")
print(f"Respon Gradien Scharr Gx: {resp_scharr_x:.1f} (Sensitivitas Rotasi Tinggi)")
print(f"Rasio Respons Scharr/Sobel: {resp_scharr_x / resp_sobel_x:.2f}x (Bobot Scharr 16/4 = 4x)")
"""

c3_5_pitfalls = [
    "Menyimpan hasil gradien ke tipe data `uint8` tanpa memperhitungkan nilai negatif: gradien transisi dari terang ke gelap bernilai negatif. Jika langsung di-cast ke `uint8`, nilai negatif akan terpotong ke 0 (*clipped*), menghilangkan setengah tepi citra (gunakan tipe `float32` atau `int16`).",
    "Mengabaikan faktor normalisasi skala turunan saat membandingkan respon kernel berukuran berbeda ($3 \\times 3$ vs $5 \\times 5$).",
    "Menerapkan deteksi gradien langsung pada citra tanpa pra-filter Gaussian, yang memicu ribuan tepi semu akibat derau acak sensor."
]

c3_5_refs = [
    {
        "title": "A 3x3 Isotropic Gradient Operator for Image Processing",
        "authors": ["Irwin Sobel", "Gary Feldman"],
        "year": 1968,
        "publisherOrVenue": "Stanford Artificial Intelligence Project",
        "url": "https://www.researchgate.net/",
        "relevance": "Presentasi awal operator gradien berbobot Sobel 3x3."
    }
]

subchapters.append(create_subchapter("computer-vision-ch3-sub5", "3.5. Operator Deteksi Tepi Gradien Sobel & Scharr", c3_5_desc, c3_5_md, c3_5_code, c3_5_pitfalls, c3_5_refs))

# ==============================================================================
# SUBCHAPTER 3.6: Kalkulasi Magnitudo dan Arah Gradien Spasial
# ==============================================================================
c3_6_desc = "Kalkulasi magnitudo gradien Euclidean L2-norm vs aproksimasi L1-norm, orientasi arah tepi arctan2, serta kuantisasi sektor orientasi 8-arah."
c3_6_md = """Setelah menghitung komponen turunan parsial horizontal $G_x$ dan vertikal $G_y$, informasi geometris lengkap gradien direpresentasikan ke dalam bentuk polar: **magnitudo** dan **arah sudut**.

### 1. Magnitudo Gradien (Gradient Magnitude)
Magnitudo gradien mengukur kekuatan laju perubahan intensitas lokal:
- **Norma Euclidean ($L_2$-norm - Eksak)**:
  $$\\|\nabla I\\|_2 = \\sqrt{G_x^2 + G_y^2}$$
- **Norma Manhattan ($L_1$-norm - Aproksimasi Cepat)**:
  $$\\|\nabla I\\|_1 \\approx |G_x| + |G_y|$$
Dalam sistem waktu nyata (*real-time embedded*), $L_1$-norm sering digunakan untuk menghemat operasi akar kuadrat yang mahal tanpa mengorbankan akurasi lokalisasi.

### 2. Arah Sudut Gradien (Gradient Orientation)
Arah vektor gradien tegak lurus (*ortogonal*) terhadap garis batas tepi fisik:
$$\\theta = \\operatorname{arctan2}(G_y, G_x), \\quad \\theta \\in [-\\pi, \\pi] \\quad \\text{atau} \\quad [0^\\circ, 180^\\circ)$$

Penggunaan fungsi 2-argumen `arctan2(Gy, Gx)` wajib dilakukan untuk menangani kasus $G_x = 0$ (pembagian dengan nol pada sudut vertikal $90^\\circ$) serta membedakan tanda kuadran secara konsisten."""

c3_6_code = r"""import numpy as np

def compute_gradient_magnitude_and_direction(gx: float, gy: float):
    '''Menghitung magnitudo L2, L1, dan sudut orientasi gradien dalam derajat.'''
    mag_l2 = np.sqrt(gx**2 + gy**2)
    mag_l1 = abs(gx) + abs(gy)
    
    # Sudut dalam derajat [-180, 180]
    angle_rad = np.arctan2(gy, gx)
    angle_deg = np.degrees(angle_rad)
    
    # Petakan ke rentang positif tak berarah [0, 180) untuk tepi tanpa tanda
    angle_unsigned = angle_deg % 180.0
    return mag_l2, mag_l1, angle_deg, angle_unsigned

# Evaluasi 4 Skenario Vektor Turunan
scenarios = [
    ("Tepi Vertikal Tajam (Gx dominan)",  120.0,    0.0),
    ("Tepi Horizontal (Gy dominan)",        0.0, -100.0),
    ("Tepi Diagonal Miring 45°",           80.0,   80.0),
    ("Area Datar Tanpa Tepi",               1.0,    0.5)
]

print("--- Kalkulasi Magnitudo dan Arah Vektor Gradien ---")
print(f"{'Skenario':32s} | {'L2 Mag':8s} | {'L1 Mag':8s} | {'Sudut Asli':10s} | {'Unsigned 180°':12s}")
print("-" * 75)
for label, gx, gy in scenarios:
    l2, l1, deg, un_deg = compute_gradient_magnitude_and_direction(gx, gy)
    print(f"{label:32s} | {l2:8.2f} | {l1:8.2f} | {deg:9.1f}° | {un_deg:11.1f}°")
"""

c3_6_pitfalls = [
    "Menggunakan fungsi trigonometri `np.arctan(gy / gx)` satu argumen yang memicu `ZeroDivisionError` saat $G_x = 0$ dan kehilangan informasi tanda kuadran.",
    "Tertukar antara arah vektor gradien (yang mengarah ke peningkatan intensitas tercepat, tegak lurus tepi) dan arah garis batas tepi itu sendiri (yang paralel dengan tepi, berbeda $90^\\circ$).",
    "Melakukan ambang batas magnitudo (*thresholding*) pada nilai non-ternormalisasi saat memproses citra yang memiliki variasi pencahayaan global."
]

c3_6_refs = [
    {
        "title": "Computer Vision: Algorithms and Applications (2nd ed.)",
        "authors": ["Richard Szeliski"],
        "year": 2022,
        "publisherOrVenue": "Springer",
        "url": "https://szeliski.org/Book/",
        "relevance": "Bab 7.1: Edges and gradient vector representations."
    }
]

subchapters.append(create_subchapter("computer-vision-ch3-sub6", "3.6. Kalkulasi Magnitudo dan Arah Gradien Spasial", c3_6_desc, c3_6_md, c3_6_code, c3_6_pitfalls, c3_6_refs))

# ==============================================================================
# SUBCHAPTER 3.7: Operator Laplacian dan Laplacian of Gaussian (LoG)
# ==============================================================================
c3_7_desc = "Operator diferensial orde kedua Laplacian, deteksi persilangan nol (zero-crossing), kelemahan derau, dan formulasi filter Laplacian of Gaussian (LoG)."
c3_7_md = """Operator gradien orde pertama (Sobel, Scharr) mendeteksi tepi sebagai nilai puncak (*ekstrema lokal*) magnitudo turunan. Sebaliknya, operator turunan orde kedua mendeteksi tepi pada titik di mana nilai turunan kedua melintasi angka nol (**zero-crossing**).

### 1. Operator Laplacian 2D ($\\nabla^2$)
Operator Laplacian adalah turunan parsial kedua tak-berarah (*isotropic second derivative*):
$$\\nabla^2 I = \\frac{\\partial^2 I}{\\partial x^2} + \\frac{\\partial^2 I}{\\partial y^2}$$

Aproksimasi diskrit standar menggunakan kernel $3 \\times 3$:
$$\\mathbf{L}_4 = \\begin{bmatrix} 0 & 1 & 0 \\\\ 1 & -4 & 1 \\\\ 0 & 1 & 0 \\end{bmatrix}, \\quad \\mathbf{L}_8 = \\begin{bmatrix} 1 & 1 & 1 \\\\ 1 & -8 & 1 \\\\ 1 & 1 & 1 \\end{bmatrix}$$

Kelemahan fatal Laplacian: turunan kedua memiliki respons frekuensi $\\omega^2$, yang berarti derau acak frekuensi tinggi akan diamplifikasi secara kuadratik, menghasilkan ribuan zero-crossing palsu.

### 2. Laplacian of Gaussian (LoG / Marr-Hildreth, 1980)
David Marr dan Ellen Hildreth membuktikan bahwa untuk mendeteksi tepi secara stabil pada berbagai skala, citra harus dihaluskan terlebih dahulu dengan Gaussian sebelum dievaluasi oleh Laplacian:

$$\\nabla^2 [G(x, y; \\sigma) * I(x, y)] = [\\nabla^2 G(x, y; \\sigma)] * I(x, y)$$

Kernel LoG analitis (dikenal sebagai fungsi *Mexican Hat* karena profil kurvanya):
$$\\operatorname{LoG}(x, y; \\sigma) = -\\frac{1}{\\pi \\sigma^4} \\left(1 - \\frac{x^2 + y^2}{2\\sigma^2}\\right) \\exp\\left(-\\frac{x^2 + y^2}{2\\sigma^2}\\right)$$"""

c3_7_code = r"""import numpy as np

def generate_log_kernel(sigma: float, size: int = 5) -> np.ndarray:
    '''Membuat kernel Laplacian of Gaussian (LoG) 2D ternormalisasi (jumlah elemen = 0).'''
    radius = size // 2
    y, x = np.mgrid[-radius:radius+1, -radius:radius+1]
    
    r2 = x**2 + y**2
    sigma2 = sigma**2
    sigma4 = sigma2**2
    
    # Formulasi Mexican Hat LoG
    log_kernel = -(1.0 / (np.pi * sigma4)) * (1.0 - r2 / (2.0 * sigma2)) * np.exp(-r2 / (2.0 * sigma2))
    
    # Normalisasi agar integral/sum persis 0.0 (respons nol pada area datar)
    log_kernel -= np.mean(log_kernel)
    return log_kernel

# Buat Kernel LoG 5x5 dengan sigma=1.0
kernel_log = generate_log_kernel(sigma=1.0, size=5)

# Uji pada Profil Tepi 1D (Step Edge) yang Diperluas ke 5x5
# Sisi Kiri bernilai 50, Sisi Kanan bernilai 200 (Transisi Tajam di Tengah Kolom 2)
edge_patch = np.zeros((5, 5), dtype=np.float64)
edge_patch[:, :2] = 50.0
edge_patch[:, 2:] = 200.0

response = np.sum(edge_patch * kernel_log)

print("--- Karakteristik Filter Laplacian of Gaussian (LoG) ---")
print(f"Kernel LoG 5x5 (Sigma=1.0):\n{kernel_log.round(4)}")
print(f"\nJumlah Total Elemen Kernel: {np.sum(kernel_log):.8f} (Invarian Konservasi DC)")
print(f"Respon pada Area Transisi Tepi: {response:.4f}")
"""

c3_7_pitfalls = [
    "Mencari titik zero-crossing tanpa memeriksa kecuraman gradien (*gradient slope threshold*); derau halus pada latar belakang seragam akan memicu persilangan nol semu berulang.",
    "Kernel LoG tidak dapat dipisahkan secara langsung menjadi 1D (*not separable*); solusinya adalah menggunakan pendekatan Difference of Gaussians (DoG) yang memisahkan dua filter Gaussian 1D.",
    "Batas kernel: ukuran kernel LoG harus cukup besar (minimal $6\\sigma$) agar sayap luar Gaussian meluruh sempurna mendekati nol."
]

c3_7_refs = [
    {
        "title": "Theory of Edge Detection",
        "authors": ["David Marr", "Ellen Hildreth"],
        "year": 1980,
        "publisherOrVenue": "Proceedings of the Royal Society of London. Series B. Biological Sciences",
        "url": "https://doi.org/10.1098/rspb.1980.0020",
        "relevance": "Paper perintis deteksi tepi zero-crossing berbasis operator Laplacian of Gaussian (Marr-Hildreth)."
    }
]

subchapters.append(create_subchapter("computer-vision-ch3-sub7", "3.7. Operator Laplacian dan Laplacian of Gaussian (LoG)", c3_7_desc, c3_7_md, c3_7_code, c3_7_pitfalls, c3_7_refs))

# ==============================================================================
# SUBCHAPTER 3.8: Algoritma Deteksi Tepi Canny: Reduksi Derau & Gradien
# ==============================================================================
c3_8_desc = "Tiga kriteria optimal Canny (1986): Signal-to-Noise Ratio, lokalisasi presisi, respon tunggal, serta Tahap 1 (Gaussian Smoothing) dan Tahap 2 (Sobel Gradient)."
c3_8_md = """Pada tahun 1986, John F. Canny menerbitkan karya monumental *"A Computational Approach to Edge Detection"*, merumuskan deteksi tepi sebagai masalah optimasi matematis formal berdasarkan tiga kriteria kualitas optimal:

### 1. Tiga Kriteria Optimal Canny (1986)
1. **Probabilitas Deteksi Rendah Galat (*Low Error Rate / High SNR*)**:
   Memaksimalkan deteksi tepi yang benar-benar ada dan meminimalkan tepi palsu akibat derau (*false positives* maupun *false negatives*).
2. **Lokalisasi Presisi (*Localization Accuracy*)**:
   Jarak Euclidean antara titik tepi yang dideteksi oleh algoritma dan pusat tepi fisik yang sebenarnya harus seminimal mungkin mendekati nol.
3. **Respon Tunggal (*Single Response to a Single Edge*)**:
   Satu tepi fisik hanya boleh menghasilkan tepat satu respon piksel tepi, mencegah respon berulang (*multiple peaks/thick edges*).

Canny membuktikan secara analitis melalui kalkulus variasi bahwa fungsi turunan pertama Gaussian ($G'(x)$) memberikan aproksimasi numerik paling mendekati operator optimal untuk model tepi *step edge*.

### 2. Arsitektur 5 Tahap Algoritma Canny
Pipeline deteksi tepi Canny terdiri dari 5 tahapan berurutan:
- **Tahap 1**: Penghalusan Gaussian (*Gaussian Smoothing*) untuk menekan derau frekuensi tinggi berdasar skala parameter $\\sigma$.
- **Tahap 2**: Kalkulasi Magnitudo dan Arah Gradien menggunakan operator diferensial Sobel.
- **Tahap 3**: Penipisan Tepi via *Non-Maximum Suppression* (NMS).
- **Tahap 4**: Penyaringan Ambang Ganda (*Double / Hysteresis Thresholding*).
- **Tahap 5**: Pelacakan Tepi Kontigu (*Edge Tracking by Hysteresis*)."""

c3_8_code = r"""import numpy as np

def canny_stage1_and_2(image: np.ndarray, sigma: float = 1.0):
    '''Tahap 1 (Gaussian Blur) dan Tahap 2 (Sobel Gradients) dari Algoritma Canny.'''
    # 1. Bangun Kernel Gaussian 1D
    radius = int(np.ceil(3.0 * sigma))
    x = np.arange(-radius, radius + 1, dtype=np.float64)
    g_1d = np.exp(-(x**2) / (2.0 * sigma**2))
    g_1d /= np.sum(g_1d)
    
    # Konvolusi 1D separable
    H, W = image.shape
    padded = np.pad(image.astype(np.float64), radius, mode='edge')
    blurred_h = np.zeros_like(image, dtype=np.float64)
    for y in range(H):
        for c in range(W):
            blurred_h[y, c] = np.sum(padded[y + radius, c:c + 2*radius + 1] * g_1d)
            
    padded_v = np.pad(blurred_h, radius, mode='edge')
    blurred = np.zeros_like(image, dtype=np.float64)
    for y in range(H):
        for c in range(W):
            blurred[y, c] = np.sum(padded_v[y:y + 2*radius + 1, c + radius] * g_1d)
            
    # 2. Hitung Gradien Sobel Gx dan Gy
    pad_b = np.pad(blurred, 1, mode='edge')
    gx = np.zeros_like(blurred)
    gy = np.zeros_like(blurred)
    
    sobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float64)
    sobel_y = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=np.float64)
    
    for y in range(H):
        for x in range(W):
            patch = pad_b[y:y+3, x:x+3]
            gx[y, x] = np.sum(patch * sobel_x)
            gy[y, x] = np.sum(patch * sobel_y)
            
    magnitude = np.sqrt(gx**2 + gy**2)
    direction = np.arctan2(gy, gx) # Rentang [-pi, pi]
    return blurred, magnitude, direction

# Uji pada Citra Sederhana 6x6 dengan Tepi Kotak Terang di Tengah
test_img = np.zeros((6, 6), dtype=np.uint8)
test_img[1:5, 1:5] = 200

blurred, mag, dir_rad = canny_stage1_and_2(test_img, sigma=0.8)

print("--- Algoritma Canny: Eksekusi Tahap 1 & 2 ---")
print("Citra Biner Asli (Kotak 4x4):\n", test_img)
print("\nTahap 1 - Citra Terhaluskan Gaussian (Tengah 4x4):\n", blurred[1:5, 1:5].round(1))
print("\nTahap 2 - Magnitudo Gradien Sobel:\n", mag.round(1))
print(f"\nNilai Maksimum Magnitudo Tepi: {np.max(mag):.2f}")
"""

c3_8_pitfalls = [
    "Memilih nilai $\\sigma$ Gaussian yang tidak proporsional: $\\sigma$ terlalu besar akan melenyapkan tepi halus dan memindahkan posisi tepi (*edge displacement*), sedangkan $\\sigma$ terlalu kecil membiarkan derau lolos.",
    "Mengabaikan arah gradien pada Tahap 2: arah sudut gradien mutlak diperlukan untuk operasi Non-Maximum Suppression pada Tahap 3.",
    "Menggunakan kernel Sobel yang belum dinormalisasi tanpa menyesuaikan nilai ambang batas hipotesis secara proporsional."
]

c3_8_refs = [
    {
        "title": "A Computational Approach to Edge Detection",
        "authors": ["John Canny"],
        "year": 1986,
        "publisherOrVenue": "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)",
        "url": "https://doi.org/10.1109/TPAMI.1986.4767851",
        "relevance": "Paper kanonikal fundamental yang merumuskan 3 kriteria matematis optimal deteksi tepi Canny."
    }
]

subchapters.append(create_subchapter("computer-vision-ch3-sub8", "3.8. Algoritma Deteksi Tepi Canny: Reduksi Derau & Gradien", c3_8_desc, c3_8_md, c3_8_code, c3_8_pitfalls, c3_8_refs))

# ==============================================================================
# SUBCHAPTER 3.9: Canny: Non-Maximum Suppression (NMS) Penipisan Tepi
# ==============================================================================
c3_9_desc = "Mekanisme penipisan respon tepi lokal Canny NMS, kuantisasi arah 4 sektor (0, 45, 90, 135 derajat), dan eliminasi respon tebal multi-piksel."
c3_9_md = """Respon magnitudo gradien dari Tahap 2 menghasilkan pita tepi yang lebar dan kabur (*thick ridge* selebar beberapa piksel). Kriteria ketiga Canny (*single response*) menuntut agar garis tepi memiliki **ketebalan tepat 1 piksel**.

### 1. Prinsip Kerja Non-Maximum Suppression (NMS)
NMS menelusuri setiap piksel pada citra magnitudo gradien dan memeriksa apakah nilai magnitudo piksel saat ini $M(x, y)$ merupakan nilai **maksimum lokal** di sepanjang garis arah gradien $\\theta(x, y)$.
- Jika $M(x, y)$ lebih besar atau sama dengan kedua tetangganya di sepanjang arah gradien: pertahankan nilainya.
- Jika ada salah satu tetangga yang memiliki magnitudo lebih besar: tekan nilainya menjadi nol ($M(x, y) \\gets 0$).

### 2. Kuantisasi 4 Sektor Arah
Karena kisi citra bersifat diskrit, sudut orientasi kontinu $\\theta \\in [0^\\circ, 180^\\circ)$ dikuantisasikan ke salah satu dari $4$ sektor sudut utama:
1. **Sektor $0^\\circ$ (Horizontal, rentang $[-22.5^\\circ, 22.5^\\circ) \\cup [157.5^\\circ, 180^\\circ)$)**:
   Arah gradien horizontal $\\implies$ garis tepi vertikal. Bandingkan dengan tetangga Barat $(x-1, y)$ dan Timur $(x+1, y)$.
2. **Sektor $45^\\circ$ (Diagonal Kanan-Atas, rentang $[22.5^\\circ, 67.5^\\circ)$)**:
   Bandingkan dengan Timur Laut $(x+1, y-1)$ dan Barat Daya $(x-1, y+1)$.
3. **Sektor $90^\\circ$ (Vertikal, rentang $[67.5^\\circ, 112.5^\\circ)$)**:
   Arah gradien vertikal $\\implies$ garis tepi horizontal. Bandingkan dengan Utara $(x, y-1)$ dan Selatan $(x, y+1)$.
4. **Sektor $135^\\circ$ (Diagonal Kiri-Atas, rentang $[112.5^\\circ, 157.5^\\circ)$)**:
   Bandingkan dengan Barat Laut $(x-1, y-1)$ dan Tenggara $(x+1, y+1)$."""

c3_9_code = r"""import numpy as np

def non_maximum_suppression(magnitude: np.ndarray, direction: np.ndarray) -> np.ndarray:
    '''Penipisan respon tepi Canny Non-Maximum Suppression (NMS).'''
    H, W = magnitude.shape
    nms_out = np.zeros_like(magnitude)
    
    # Konversi sudut ke derajat rentang [0, 180)
    angle = np.degrees(direction) % 180.0
    
    for y in range(1, H - 1):
        for x in range(1, W - 1):
            q, r = 255.0, 255.0
            theta = angle[y, x]
            
            # Sektor 0: Horizontal (derajat 0 +- 22.5)
            if (0 <= theta < 22.5) or (157.5 <= theta <= 180):
                q = magnitude[y, x + 1]
                r = magnitude[y, x - 1]
            # Sektor 45: Diagonal Kanan-Atas (derajat 45 +- 22.5)
            elif 22.5 <= theta < 67.5:
                q = magnitude[y - 1, x + 1]
                r = magnitude[y + 1, x - 1]
            # Sektor 90: Vertikal (derajat 90 +- 22.5)
            elif 67.5 <= theta < 112.5:
                q = magnitude[y - 1, x]
                r = magnitude[y + 1, x]
            # Sektor 135: Diagonal Kiri-Atas (derajat 135 +- 22.5)
            elif 112.5 <= theta < 157.5:
                q = magnitude[y - 1, x - 1]
                r = magnitude[y + 1, x + 1]
                
            # Pertahankan hanya jika nilai saat ini adalah puncak lokal (strictly greater than both)
            if magnitude[y, x] >= q and magnitude[y, x] >= r:
                nms_out[y, x] = magnitude[y, x]
            else:
                nms_out[y, x] = 0.0
                
    return nms_out

# Uji dengan Profil Tebal Tepi Vertikal (Pita Lebar 3 Piksel pada Kolom 1, 2, 3)
mag_thick = np.array([
    [10.0,  80.0, 200.0,  90.0, 15.0],
    [10.0,  85.0, 210.0,  95.0, 15.0],
    [10.0,  80.0, 205.0,  90.0, 15.0]
], dtype=np.float64)

# Arah gradien 0 derajat (Gx dominan horizontal)
dir_horizontal = np.zeros_like(mag_thick)

nms_thin = non_maximum_suppression(mag_thick, dir_horizontal)

print("--- Canny Tahap 3: Non-Maximum Suppression (NMS) ---")
print("Magnitudo Gradien Tebal Asli (3 Kolom Bernilai Tinggi):\n", mag_thick)
print("\nHasil Setelah NMS (Tepi Tertipiskan Menjadi Tepat 1 Piksel):\n", nms_thin)
print(f"\nStatus Penipisan: Kolom puncak tengah ({nms_thin[1, 2]:.1f}) dipertahankan,")
print(f"sedangkan nilai tetangga samping ({mag_thick[1, 1]:.1f} dan {mag_thick[1, 3]:.1f}) ditekan menjadi 0.0.")
"""

c3_9_pitfalls = [
    "Membandingkan tetangga sejajar dengan garis tepi alih-alih tegak lurus tepi (searah gradien), yang menyebabkan penghapusan garis tepi yang valid.",
    "Menggunakan operator perbandingan non-ketat `>` pada kedua sisi yang dapat melenyapkan seluruh piksel pada area puncak tepi datar (*flat plateaus*) di mana $M(x, y) == M(x+1, y)$.",
    "Kuantisasi 4 sektor adalah aproksimasi kasar; Canny asli menyarankan interpolasi linear nilai magnitudo subpiksel pada vektor kontinu."
]

c3_9_refs = [
    {
        "title": "A Computational Approach to Edge Detection",
        "authors": ["John Canny"],
        "year": 1986,
        "publisherOrVenue": "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)",
        "url": "https://doi.org/10.1109/TPAMI.1986.4767851",
        "relevance": "Bagian IV: Sub-pixel localization and Non-Maximum Suppression."
    }
]

subchapters.append(create_subchapter("computer-vision-ch3-sub9", "3.9. Canny: Non-Maximum Suppression (NMS) Penipisan Tepi", c3_9_desc, c3_9_md, c3_9_code, c3_9_pitfalls, c3_9_refs))

# ==============================================================================
# SUBCHAPTER 3.10: Canny: Hysteresis Thresholding & Edge Tracking
# ==============================================================================
c3_10_desc = "Ambang ganda histeresis (High dan Low thresholds), klasifikasi piksel kuat/lemah, dan penelusuran kontiguitas tepi berbasis graf 8-konektivitas."
c3_10_md = """Setelah NMS, piksel tepi telah menipis menjadi 1 piksel, namun citra masih memuat banyak tepi palsu yang dihasilkan oleh derau atau variasi tekstur minor. 

### 1. Masalah Ambang Tunggal (*Single Thresholding Dilemma*)
- Jika ambang batas disetel **terlalu tinggi**: tepi lemah yang merupakan bagian penting dari kontur objek akan putus-putus (*fragmented edges*).
- Jika ambang batas disetel **terlalu rendah**: derau latar belakang akan terdeteksi sebagai tepi palsu (*noise contamination*).

### 2. Ambang Ganda Histeresis (*Hysteresis Thresholding*)
Canny menyelesaikan dilema ini secara elegan menggunakan dua ambang batas: $T_{\\text{high}}$ dan $T_{\\text{low}}$ (dengan rasio rekomendasi $T_{\\text{high}} : T_{\\text{low}} \\approx 2:1$ atau $3:1$).

Setiap piksel diklasifikasikan ke dalam 3 kategori:
1. **Piksel Kuat (*Strong Edge*)**: $M(x, y) \\ge T_{\\text{high}}$. Dipastikan sebagai tepi sejati definitif.
2. **Piksel Lemah (*Weak Edge*)**: $T_{\\text{low}} \\le M(x, y) < T_{\\text{high}}$. Kandidat tepi yang dipertahankan hanya jika terhubung dengan piksel kuat.
3. **Piksel Non-Tepi**: $M(x, y) < T_{\\text{low}}$. Dibuang seketika ($M \\gets 0$).

### 3. Pelacakan Tepi Kontigu (*Edge Tracking by Hysteresis*)
Menggunakan algoritma pencarian penelusuran graf (BFS atau DFS dengan konektivitas 8-tetangga):
Dimulai dari setiap piksel kuat yang terverifikasi, algoritma menelusuri seluruh piksel lemah tetangganya. Jika piksel lemah bersambung dengan rantai piksel kuat, ia dipromosikan menjadi tepi definitif. Piksel lemah yang terisolasi (tidak terhubung ke piksel kuat manapun) dibuang."""

c3_10_code = r"""import numpy as np
from collections import deque

def hysteresis_edge_tracking(nms_image: np.ndarray, t_low: float, t_high: float) -> np.ndarray:
    '''Tahap 4 & 5 Canny: Hysteresis Double Thresholding dan 8-Connected Edge Tracking.'''
    H, W = nms_image.shape
    
    # 1. Klasifikasi 3 Kategori Piksel
    # 255: Kuat, 50: Lemah, 0: Bukan Tepi
    res = np.zeros((H, W), dtype=np.uint8)
    strong_y, strong_x = np.where(nms_image >= t_high)
    weak_y, weak_x = np.where((nms_image >= t_low) & (nms_image < t_high))
    
    res[strong_y, strong_x] = 255
    res[weak_y, weak_x] = 50
    
    # 2. Penelusuran Kontiguitas 8-Tetangga via BFS Queue
    queue = deque(zip(strong_y, strong_x))
    visited = set(zip(strong_y, strong_x))
    
    # 8 Arah Offset Spasial
    dx = [-1, -1, -1,  0, 0,  1, 1, 1]
    dy = [-1,  0,  1, -1, 1, -1, 0, 1]
    
    while queue:
        cy, cx = queue.popleft()
        for i in range(8):
            ny, nx = cy + dy[i], cx + dx[i]
            if 0 <= ny < H and 0 <= nx < W:
                if res[ny, nx] == 50 and (ny, nx) not in visited:
                    # Promosikan piksel lemah menjadi tepi kuat
                    res[ny, nx] = 255
                    visited.add((ny, nx))
                    queue.append((ny, nx))
                    
    # Hapus seluruh sisa piksel lemah yang tidak terhubung
    res[res == 50] = 0
    return res

# Simulasi Hasil NMS: Rantai Tepi Kuat (200), Sambungan Tepi Lemah (80), dan Derau Terisolasi (70)
nms_mock = np.array([
    [  0.0, 210.0,   0.0,   0.0,   0.0],
    [  0.0, 200.0,   0.0,   0.0,  70.0],  # 70.0 adalah derau acak terisolasi
    [  0.0,  85.0,   0.0,   0.0,   0.0],  # 85.0 adalah tepi lemah bersambung dengan 200
    [  0.0,   0.0,  80.0,   0.0,   0.0],  # 80.0 adalah tepi lemah bersambung dengan 85
    [  0.0,   0.0,   0.0,   0.0,   0.0]
], dtype=np.float64)

# Ambang Batas: T_low = 60, T_high = 150
t_low, t_high = 60.0, 150.0
final_edges = hysteresis_edge_tracking(nms_mock, t_low, t_high)

print("--- Canny Tahap 4 & 5: Hysteresis Thresholding & Edge Tracking ---")
print("Input Citra NMS:\n", nms_mock)
print(f"\nParameter Ambang: T_low={t_low}, T_high={t_high}")
print("\nCitra Tepi Biner Akhir (255=Tepi, 0=Latar Belakang):\n", final_edges)
print("\nAnalisis Validasi:")
print("- Piksel lemah bernilai 85 dan 80 berhasil diselamatkan karena terhubung ke piksel kuat (210, 200).")
print("- Derau acak bernilai 70 pada pojok kanan berhasil dibuang 100% karena terisolasi.")
"""

c3_10_pitfalls = [
    "Menyetel $T_{\\text{low}}$ terlalu dekat dengan $T_{\\text{high}}$, yang meniadakan manfaat histeresis dan mengembalikan perilaku rapuh ambang tunggal.",
    "Menggunakan rekursi DFS naif pada citra beresolusi tinggi (4K/8K) tanpa meningkatkan batas kedalaman rekursi Python (`sys.setrecursionlimit`), yang memicu `RecursionError: maximum recursion depth exceeded` (gunakan queue BFS iteratif).",
    "Mengasumsikan ambang batas Canny universal untuk semua kondisi pencahayaan: citra medis radiografi memerlukan ambang yang sangat berbeda dibanding citra jalan raya siang hari."
]

c3_10_refs = [
    {
        "title": "A Computational Approach to Edge Detection",
        "authors": ["John Canny"],
        "year": 1986,
        "publisherOrVenue": "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)",
        "url": "https://doi.org/10.1109/TPAMI.1986.4767851",
        "relevance": "Bagian V: Thresholding with Hysteresis and contour synthesis."
    }
]

subchapters.append(create_subchapter("computer-vision-ch3-sub10", "3.10. Canny: Hysteresis Thresholding & Edge Tracking", c3_10_desc, c3_10_md, c3_10_code, c3_10_pitfalls, c3_10_refs))

# ==============================================================================
# SAVE JSON OUTPUT
# ==============================================================================
output_path = os.path.join(os.path.dirname(__file__), "cv_ch3_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 3 data with {len(subchapters)} subchapters: {output_path}")
