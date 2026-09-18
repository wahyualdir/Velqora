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
# SUBCHAPTER 5.1: Konsep Titik Sudut (Corner) dan Matriks Autokorelasi Moravec
# ==============================================================================
c5_1_desc = "Definisi geometris titik sudut (corner/interest point), fungsi autokorelasi spasial Moravec, masalah aperture problem, dan perbedaan daerah datar vs tepi vs sudut."
c5_1_md = r"""Titik sudut (*corner*) atau titik minat (*interest point*) adalah lokasi pada citra yang memiliki variasi intensitas dua dimensi yang tajam. Berbeda dengan tepi yang hanya bervariasi pada satu arah ortogonal, titik sudut memiliki variasi intensitas pada **seluruh arah spasial**.

### 1. Masalah Apertur (*The Aperture Problem*)
Jika kita mengamati citra melalui jendela kecil (*aperture*):
1. **Daerah Datar (*Flat Region*)**: Pergeseran jendela ke segala arah tidak menimbulkan perubahan intensitas.
2. **Daerah Tepi (*Edge Region*)**: Pergeseran sejajar dengan garis tepi tidak menimbulkan perubahan intensitas (*aperture problem* - gerak sepanjang garis tepi tidak terdefinisi).
3. **Titik Sudut (*Corner Point*)**: Pergeseran ke arah manapun menghasilkan perubahan intensitas yang signifikan. Titik sudut adalah fitur yang dapat dilokalisasi secara unik pada bidang 2D.

### 2. Detektor Sudut Moravec (1980)
Hans Moravec merumuskan konsep ini dengan mengukur jumlah selisih kuadrat (*Sum of Squared Differences* / SSD) ketika jendela lokal $W$ digeser sejauh $(\Delta x, \Delta y)$ ke empat arah kardinal dan diagonal:

$$E(\Delta x, \Delta y) = \sum_{(x, y) \in W} w(x, y) \left[ I(x + \Delta x, y + \Delta y) - I(x, y) \right]^2$$

Kekuatan sudut Moravec dihitung dari nilai minimum perubahan di seluruh arah uji:
$$C_{\text{Moravec}} = \min_{(\Delta x, \Delta y)} E(\Delta x, \Delta y)$$

Kelemahan Moravec: jendela berbobot biner kaku kotak dan arah pergeseran diskrit terbatas (hanya menguji 4 atau 8 arah diskrit), sehingga sangat sensitif terhadap rotasi sembarang."""

c5_1_code = r"""import numpy as np

def moravec_cornerness(patch_5x5: np.ndarray) -> float:
    '''Kalkulasi respons sudut Moravec dengan menguji pergeseran ke 4 arah kardinal (+-1 piksel).'''
    # Jendela tengah 3x3 di dalam patch 5x5
    w_center = patch_5x5[1:4, 1:4]
    shifts = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    ssd_values = []
    
    for dy, dx in shifts:
        shifted_win = patch_5x5[1 + dy:4 + dy, 1 + dx:4 + dx]
        ssd = np.sum((shifted_win - w_center) ** 2)
        ssd_values.append(ssd)
        
    return float(min(ssd_values))

# Tiga Kondisi Citra Uji 5x5
# 1. Area Datar Homogen
patch_flat = np.full((5, 5), 100.0)
# 2. Tepi Vertikal Lurus
patch_edge = np.zeros((5, 5))
patch_edge[:, 2:] = 200.0
# 3. Titik Sudut L-Junction (Pojok Kiri-Atas Kotak)
patch_corner = np.zeros((5, 5))
patch_corner[2:, 2:] = 200.0

c_flat = moravec_cornerness(patch_flat)
c_edge = moravec_cornerness(patch_edge)
c_corner = moravec_cornerness(patch_corner)

print("--- Evaluasi Detektor Sudut Moravec ---")
print(f"1. Respons Area Datar (Flat)  : {c_flat:8.1f} (Perubahan nol)")
print(f"2. Respons Daerah Tepi (Edge) : {c_edge:8.1f} (Pergeseran vertikal bernilai nol)")
print(f"3. Respons Titik Sudut (Corner): {c_corner:8.1f} (Perubahan signifikan di SEMUA arah)")
"""

c5_1_pitfalls = [
    "Detektor Moravec tidak bersifat invarian terhadap rotasi karena pergeseran hanya diuji pada sudut kelipatan $45^\\circ$ atau $90^\\circ$.",
    "Jendela persegi berbobot seragam memicu respons anisotropik di sekitar pojok jendela persegi itu sendiri.",
    "Komputasi pergeseran manual per piksel sangat lambat dan tidak efisien untuk citra resolusi penuh."
]

c5_1_refs = [
    {
        "title": "Obstacle Avoidance and Navigation in the Real World by a Seeing Robot Rover",
        "authors": ["Hans P. Moravec"],
        "year": 1980,
        "publisherOrVenue": "Stanford University Computer Science Department PhD Thesis",
        "url": "https://www.ri.cmu.edu/pub_files/pub1/moravec_hans_1980_1/moravec_hans_1980_1.pdf",
        "relevance": "Landasan awal operator titik minat berbasis autokorelasi Moravec."
    }
]

subchapters.append(create_subchapter("computer-vision-ch5-sub1", "5.1. Konsep Titik Sudut (Corner) dan Matriks Autokorelasi Moravec", c5_1_desc, c5_1_md, c5_1_code, c5_1_pitfalls, c5_1_refs))

# ==============================================================================
# SUBCHAPTER 5.2: Detektor Sudut Harris (Harris & Stephens, 1988)
# ==============================================================================
c5_2_desc = "Derivasi matematis ekspansi deret Taylor orde pertama, pembentukan Matriks Momen Kedua (Structure Tensor M), bobot Gaussian melingkar, dan elips kovarians."
c5_2_md = r"""Chris Harris dan Mike Stephens (1988) menyempurnakan kelemahan Moravec secara analitis melalui ekspansi deret Taylor dan bobot Gaussian melingkar halus.

### 1. Derivasi Deret Taylor Fungsi Perubahan
Fungsi perubahan intensitas $E(u, v)$ untuk pergeseran arbitrer kontinu $(u, v)$:
$$E(u, v) = \sum_{(x, y)} w(x, y) \left[ I(x + u, y + v) - I(x, y) \right]^2$$

Menggunakan ekspansi deret Taylor orde pertama:
$$I(x + u, y + v) \approx I(x, y) + u I_x(x, y) + v I_y(x, y)$$

Substitusi kembali ke persamaan $E(u, v)$:
$$E(u, v) \approx \sum_{(x, y)} w(x, y) \left[ u I_x + v I_y \right]^2 = \sum_{(x, y)} w(x, y) \left( u^2 I_x^2 + 2 u v I_x I_y + v^2 I_y^2 \right)$$

Dalam notasi matriks bentuk kuadratik (*quadratic form*):
$$E(u, v) \approx \begin{bmatrix} u & v \end{bmatrix} \mathbf{M} \begin{bmatrix} u \\ v \end{bmatrix}$$

### 2. Matriks Momen Kedua (*Structure Tensor / Harris Matrix $\mathbf{M}$*)
Matriks simetris semi-definit positif $\mathbf{M} \in \mathbb{R}^{2 \times 2}$ merangkum distribusi gradien lokal:

$$\mathbf{M} = \sum_{(x, y)} w(x, y) \begin{bmatrix} I_x^2 & I_x I_y \\ I_x I_y & I_y^2 \end{bmatrix} = \begin{bmatrix} \langle I_x^2 \rangle & \langle I_x I_y \rangle \\ \langle I_x I_y \rangle & \langle I_y^2 \rangle \end{bmatrix}$$

Di mana $w(x, y) = \frac{1}{2\pi \sigma^2} \exp\left(-\frac{x^2 + y^2}{2\sigma^2}\right)$ adalah jendela Gaussian melingkar halus yang menjamin **invariansi rotasi isotropik penuh**."""

c5_2_code = r"""import numpy as np

def compute_harris_structure_tensor(patch_grad_x: np.ndarray, patch_grad_y: np.ndarray) -> np.ndarray:
    '''Menghitung Matriks Momen Kedua (Structure Tensor M) 2x2 dari gradien lokal dengan bobot Gaussian.'''
    H, W = patch_grad_x.shape
    cy, cx = H // 2, W // 2
    y_idx, x_idx = np.mgrid[0:H, 0:W]
    # Bobot Gaussian melingkar sigma = 1.0
    weights = np.exp(-((y_idx - cy)**2 + (x_idx - cx)**2) / 2.0)
    weights /= np.sum(weights)
    
    # Elemen Tensor Momen Kedua
    m11 = np.sum(weights * (patch_grad_x ** 2))
    m12 = np.sum(weights * (patch_grad_x * patch_grad_y))
    m22 = np.sum(weights * (patch_grad_y ** 2))
    
    M = np.array([
        [m11, m12],
        [m12, m22]
    ], dtype=np.float64)
    return M

# Kasus 1: Tepi Horizontal Murni (Gx = 0, Gy = 100)
gx_edge = np.zeros((3, 3))
gy_edge = np.full((3, 3), 100.0)
M_edge = compute_harris_structure_tensor(gx_edge, gy_edge)

# Kasus 2: Titik Sudut Simetris (Gx = 100, Gy = 100)
gx_corner = np.full((3, 3), 100.0)
gy_corner = np.full((3, 3), 100.0)
M_corner = compute_harris_structure_tensor(gx_corner, gy_corner)

print("--- Pembentukan Matriks Momen Kedua (Structure Tensor M) ---")
print("1. Matriks M untuk Daerah Tepi Horizontal:\n", M_edge.round(1))
print("   Nilai Eigen M_edge: lambda1 =", np.linalg.eigvalsh(M_edge).round(1).tolist())

print("\n2. Matriks M untuk Daerah Titik Sudut 2D:\n", M_corner.round(1))
print("   Nilai Eigen M_corner: lambda1, lambda2 =", np.linalg.eigvalsh(M_corner).round(1).tolist())
"""

c5_2_pitfalls = [
    "Menggunakan jendela kotak seragam alih-alih filter Gaussian melingkar, yang mengorbankan sifat invariansi rotasi.",
    "Menghitung gradien citra tanpa konversi ke tipe data bertanda (`float32`), memicu pemotongan gradien negatif.",
    "Mengasumsikan detektor Harris invarian terhadap skala citra; detektor Harris klasik **tidak invarian terhadap perubahan skala** (perubahan zoom mengubah sudut tajam menjadi kurva landai)."
]

c5_2_refs = [
    {
        "title": "A Combined Corner and Edge Detector",
        "authors": ["Chris Harris", "Mike Stephens"],
        "year": 1988,
        "publisherOrVenue": "Proceedings of the 4th Alvey Vision Conference",
        "url": "https://doi.org/10.5244/C.2.23",
        "relevance": "Paper kanonikal penemu detektor sudut Harris dan matriks momen kedua M."
    }
]

subchapters.append(create_subchapter("computer-vision-ch5-sub2", "5.2. Detektor Sudut Harris (Harris & Stephens, 1988)", c5_2_desc, c5_2_md, c5_2_code, c5_2_pitfalls, c5_2_refs))

# ==============================================================================
# SUBCHAPTER 5.3: Fungsi Respon Sudut Harris (Harris Corner Response)
# ==============================================================================
c5_3_desc = "Fungsi respon sudut R = det(M) - k * trace(M)^2, perbandingan dengan nilai eigen Shi-Tomasi min(lambda1, lambda2), dan penentuan ambang batas titik sudut."
c5_3_md = r"""Dua nilai eigen $\lambda_1$ dan $\lambda_2$ dari matriks $\mathbf{M}$ merepresentasikan kelengkungan utama elips kuadratik:
- **Area Datar**: $\lambda_1 \approx 0, \lambda_2 \approx 0$.
- **Daerah Tepi**: Salah satu nilai eigen jauh lebih besar dari yang lain ($\lambda_1 \gg \lambda_2$ atau $\lambda_2 \gg \lambda_1$).
- **Titik Sudut**: Kedua nilai eigen bernilai besar ($\lambda_1 \gg 0$ dan $\lambda_2 \gg 0$).

### 1. Trik Komputasi Determinan & Jejak Harris
Menghitung nilai eigen eksplisit via rumus kuadratik $\lambda = \frac{\operatorname{Tr} \pm \sqrt{\operatorname{Tr}^2 - 4\det}}{2}$ memerlukan operasi akar kuadrat yang lambat. Harris & Stephens merancang fungsi respons skalar $R$ yang hanya bergantung pada **determinan** dan **jejak (*trace*)** matriks tanpa faktorisasi eigen eksplisit:

$$\det(\mathbf{M}) = \lambda_1 \lambda_2 = M_{11} M_{22} - M_{12}^2$$
$$\operatorname{Tr}(\mathbf{M}) = \lambda_1 + \lambda_2 = M_{11} + M_{22}$$

Fungsi Respon Sudut Harris:
$$R = \det(\mathbf{M}) - k \cdot \operatorname{Tr}(\mathbf{M})^2$$

Di mana $k$ adalah konstanta empiris yang lazimnya disetel dalam rentang $k \in [0.04, 0.06]$.
- Jika $R > 0$ (besar): Wilayah **Titik Sudut**.
- Jika $R < 0$ (negatif besar): Wilayah **Tepi**.
- Jika $|R| \approx 0$: Wilayah **Datar**.

### 2. Kriteria Alternatif Shi-Tomasi (1994)
Jianbo Shi dan Carlo Tomasi membuktikan bahwa kriteria yang lebih stabil untuk pelacakan fitur optik (*feature tracking*) adalah nilai eigen minimum secara langsung:
$$R_{\text{Shi-Tomasi}} = \min(\lambda_1, \lambda_2)$$"""

c5_3_code = r"""import numpy as np

def evaluate_corner_metrics(M: np.ndarray, k: float = 0.04):
    '''Menghitung respons Harris R dan respons Shi-Tomasi min(lambda).'''
    det_M = M[0, 0] * M[1, 1] - M[0, 1]**2
    trace_M = M[0, 0] + M[1, 1]
    
    # Harris Response: R = det(M) - k * (trace(M))^2
    R_harris = det_M - k * (trace_M ** 2)
    
    # Nilai Eigen Eksplisit untuk Validasi & Shi-Tomasi
    eigenvals = np.linalg.eigvalsh(M)
    R_shitomasi = eigenvals[0]  # Nilai eigen terkecil
    
    return R_harris, R_shitomasi, eigenvals

# Evaluasi 3 Struktur Tensor M
# 1. Sudut Nyata: lambda1 = 500, lambda2 = 400
M_corner = np.array([[450.0, 50.0], [50.0, 450.0]])
# 2. Tepi Tajam: lambda1 = 1000, lambda2 = 2
M_edge = np.array([[1000.0, 0.0], [0.0, 2.0]])
# 3. Datar: lambda1 = 1, lambda2 = 1
M_flat = np.array([[1.0, 0.0], [0.0, 1.0]])

print("--- Perbandingan Metrik Harris Corner vs Shi-Tomasi ---")
for label, mat in [("Titik Sudut (Corner)", M_corner), ("Garis Tepi (Edge)", M_edge), ("Area Datar (Flat)", M_flat)]:
    r_h, r_st, eigs = evaluate_corner_metrics(mat, k=0.04)
    print(f"\nStruktur: {label}")
    print(f"  Nilai Eigen (lambda1, lambda2): ({eigs[1]:.1f}, {eigs[0]:.1f})")
    print(f"  Respons Harris R              : {r_h:10.1f} -> Klasifikasi: {'SUDUT' if r_h > 1000 else ('TEPI' if r_h < -1000 else 'DATAR')}")
    print(f"  Respons Shi-Tomasi min(lambda): {r_st:10.1f}")
"""

c5_3_pitfalls = [
    "Menyetel nilai $k$ terlalu kecil ($k < 0.02$), yang menyebabkan respons Harris salah mengklasifikasikan garis tepi bergradien tinggi sebagai titik sudut.",
    "Menyetel nilai $k$ terlalu besar ($k > 0.1$), yang menekan respon titik sudut sehingga fitur penting terlewatkan.",
    "Mengabaikan penipisan Non-Maximum Suppression pada peta respon $R$; titik sudut akan membentuk kelompok kluster tebal tanpa lokalisasi subpiksel."
]

c5_3_refs = [
    {
        "title": "A Combined Corner and Edge Detector",
        "authors": ["Chris Harris", "Mike Stephens"],
        "year": 1988,
        "publisherOrVenue": "Proceedings of the 4th Alvey Vision Conference",
        "url": "https://doi.org/10.5244/C.2.23",
        "relevance": "Rumus respon sudut Harris R = det(M) - k * trace(M)^2."
    },
    {
        "title": "Good Features to Track",
        "authors": ["Jianbo Shi", "Carlo Tomasi"],
        "year": 1994,
        "publisherOrVenue": "IEEE Conference on Computer Vision and Pattern Recognition (CVPR)",
        "url": "https://doi.org/10.1109/CVPR.1994.323794",
        "relevance": "Kriteria nilai eigen minimum Shi-Tomasi min(lambda1, lambda2)."
    }
]

subchapters.append(create_subchapter("computer-vision-ch5-sub3", "5.3. Fungsi Respon Sudut Harris (Harris Corner Response)", c5_3_desc, c5_3_md, c5_3_code, c5_3_pitfalls, c5_3_refs))

# ==============================================================================
# SUBCHAPTER 5.4: Skala Ruang Gaussian (Gaussian Scale Space) & Invariansi Skala
# ==============================================================================
c5_4_desc = "Teorema Witkin dan Koenderink mengenai skala ruang linier, piramida citra multiresolusi, evolusi skala difusi panas kontinu, dan invariansi skala fitur visual."
c5_4_md = r"""Objek di dunia fisik dapat diamati pada resolusi jarak yang sangat beragam: pemandangan sebuah bangunan dari jarak 1 kilometer menampakkan struktur geometris global, sedangkan pengamatan dari jarak 1 meter menampakkan tekstur mikroskopis batu bata. Agar sistem visi komputer mampu mencocokkan objek yang sama pada berbagai jarak pembesaran (*zoom*), representasi citra harus dibangun di dalam **Skala Ruang Gaussian** (*Gaussian Scale Space*).

### 1. Teorema Keunikan Skala Ruang Witkin-Koenderink
Andrew Witkin (1983) dan Jan Koenderink (1984) membuktikan secara matematis bahwa **fungsi kernel Gaussian adalah satu-satunya operator skala linear kontinu** yang memenuhi aksioma *causality* (tidak menciptakan struktur atau ekstrema palsu baru saat skala diperbesar):

$$L(x, y; \sigma) = G(x, y; \sigma) * I(x, y)$$

Proses ini setara dengan persamaan difusi panas linier (*heat diffusion equation*):
$$\frac{\partial L}{\partial t} = \frac{1}{2} \nabla^2 L, \quad t = \sigma^2$$

### 2. Diskritisasi Piramida Oktaf
Dalam implementasi komputasi digital:
- Ruang skala dibagi menjadi beberapa **Oktaf** (*Octaves*). Setiap oktaf berkorespondensi dengan penggandaan deviasi standar skala $\sigma \to 2\sigma$.
- Di setiap oktaf, citra dihaluskan dengan beberapa tingkat skala perantara $s$ sub-level ($k = 2^{1/s}$).
- Di akhir setiap oktaf, citra di-downsample $2\times$ secara spasial untuk menghemat memori dan mempercepat komputasi oktaf berikutnya."""

c5_4_code = r"""import numpy as np

def build_toy_scale_space_octave(image: np.ndarray, sigma0: float = 1.6, num_intervals: int = 3):
    '''Membangun satu oktaf skala ruang Gaussian dengan s=3 interval perantara.'''
    k = 2.0 ** (1.0 / num_intervals)
    scales = [sigma0 * (k ** i) for i in range(num_intervals + 3)]
    
    H, W = image.shape
    scale_images = []
    
    for s in scales:
        # Buat kernel Gaussian 1D dengan radius proporsional
        rad = int(np.ceil(3.0 * s))
        x = np.arange(-rad, rad + 1, dtype=np.float64)
        g = np.exp(-(x**2) / (2.0 * s**2))
        g /= np.sum(g)
        
        # Konvolusi separable
        padded = np.pad(image.astype(np.float64), rad, mode='edge')
        tmp = np.zeros_like(image, dtype=np.float64)
        for y in range(H):
            for c in range(W):
                tmp[y, c] = np.sum(padded[y + rad, c:c + 2*rad + 1] * g)
                
        padded_v = np.pad(tmp, rad, mode='edge')
        blurred = np.zeros_like(image, dtype=np.float64)
        for y in range(H):
            for c in range(W):
                blurred[y, c] = np.sum(padded_v[y:y + 2*rad + 1, c + rad] * g)
                
        scale_images.append(blurred)
        
    return scales, scale_images

# Citra Sederhana 6x6 dengan Fitur Frekuensi Tinggi (Bintik Tunggal Tajam)
toy_img = np.zeros((6, 6), dtype=np.uint8)
toy_img[2, 2] = 255

scales, octave_imgs = build_toy_scale_space_octave(toy_img, sigma0=1.0, num_intervals=3)

print("--- Pembangunan Skala Ruang Gaussian (Scale Space) ---")
print(f"Skala Rasio Multiplikatif k = 2^(1/3) = {2**(1/3):.4f}")
for idx, s in enumerate(scales):
    peak_val = octave_imgs[idx][2, 2]
    print(f"Level {idx}: Skala Sigma={s:5.2f} -> Nilai Puncak Bintik di (2,2): {peak_val:6.2f} (Meluruh Halus)")
"""

c5_4_pitfalls = [
    r"Menghaluskan citra dari citra asli pada setiap skala bertingkat secara independen; implementasi efisien mengaplikasikan blur secara inkremental $\sigma_{\text{inc}} = \sqrt{\sigma_{\text{target}}^2 - \sigma_{\text{current}}^2}$ dari level sebelumnya.",
    r"Mengabaikan blur bawaan sensor kamera fisik ($\sigma_0 \approx 0.5$); Lowe (2004) melakukan pra-interpolasi upscaling $2\times$ pada citra asli untuk menangkap skala terkecil secara optimal.",
    "Downsampling citra tanpa filter anti-aliasing Gaussian awal, yang memicu distorsi frekuensi tinggi (*subsampling aliasing*)."
]

c5_4_refs = [
    {
        "title": "Scale-Space Filtering: A New Approach to Multi-Scale Description",
        "authors": ["Andrew P. Witkin"],
        "year": 1983,
        "publisherOrVenue": "IEEE International Conference on Acoustics, Speech, and Signal Processing (ICASSP)",
        "url": "https://doi.org/10.1109/ICASSP.1984.1172729",
        "relevance": "Paper perintis konsep skala ruang kontinu Gaussian."
    }
]

subchapters.append(create_subchapter("computer-vision-ch5-sub4", "5.4. Skala Ruang Gaussian (Gaussian Scale Space) & Invariansi Skala", c5_4_desc, c5_4_md, c5_4_code, c5_4_pitfalls, c5_4_refs))

# ==============================================================================
# SUBCHAPTER 5.5: Difference of Gaussians (DoG) sebagai Aproksimasi LoG pada SIFT
# ==============================================================================
c5_5_desc = "Derivasi analitis aproksimasi Laplacian of Gaussian ternormalisasi skala oleh Difference of Gaussians (DoG), rasio faktor k, dan efisiensi komputasi SIFT."
c5_5_md = r"""Tonne Lindeberg (1998) membuktikan bahwa fungsi **Laplacian of Gaussian Ternormalisasi Skala** ($\sigma^2 \nabla^2 G$) adalah operator invarian skala sejati untuk deteksi blob dan titik kunci visual. Namun, menghitung konvolusi LoG pada berbagai skala secara langsung membutuhkan biaya komputasi yang sangat tinggi.

### 1. Derivasi Analitis Diferensiasi Gaussian
David G. Lowe (1999, 2004) memanfaatkan hubungan diferensial fundamental antara turunan terhadap skala $\sigma$ dan turunan spasial Laplacian:

$$\frac{\partial G}{\partial \sigma} = \sigma \nabla^2 G$$

Dari definisi kalkulus dasar turunan parsial terhadap $\sigma$:
$$\frac{\partial G}{\partial \sigma} = \lim_{\Delta \sigma \to 0} \frac{G(x, y; \sigma + \Delta \sigma) - G(x, y; \sigma)}{\Delta \sigma}$$

Jika kita memilih skala bertingkat dengan rasio pengali konstan $k$ sedemikian rupa sehingga $\Delta \sigma = (k - 1)\sigma$:
$$\frac{G(x, y; k\sigma) - G(x, y; \sigma)}{(k - 1)\sigma} \approx \frac{\partial G}{\partial \sigma} = \sigma \nabla^2 G$$

Dengan mengalikan kedua ruas dengan $(k - 1)\sigma$, diperoleh hubungan analitis yang sangat elegan:
$$D(x, y; \sigma) = (G(x, y; k\sigma) - G(x, y; \sigma)) * I(x, y) \approx (k - 1) \sigma^2 \nabla^2 G * I(x, y)$$

### 2. Efisiensi Komputasi Difference of Gaussians (DoG)
Persamaan di atas menunjukkan bahwa fungsi **Difference of Gaussians (DoG)**:
$$D(x, y; \sigma) = L(x, y; k\sigma) - L(x, y; \sigma)$$
secara langsung mengaproksimasi operator Laplacian of Gaussian ternormalisasi skala $\sigma^2 \nabla^2 L$, dengan faktor skala pengali konstan $(k - 1)$ yang tidak mempengaruhi lokasi nilai ekstrema!

Keuntungan komputasi: Citra $L(x, y; \sigma)$ sudah harus dihitung terlebih dahulu untuk representasi ruang skala. Oleh karena itu, piramida DoG dapat diperoleh secara **hampir gratis** hanya melalui pengurangan sederhana antarcitra (*simple image subtraction*) tanpa operasi konvolusi tambahan apapun!"""

c5_5_code = r"""import numpy as np

# 1. Simulasikan Dua Tingkat Skala Gaussian Bertetangga pada Citra Miniatur 5x5
# L1 pada skala sigma = 1.0, L2 pada skala k*sigma = 1.259 * 1.0
L1 = np.array([
    [10.0, 15.0, 20.0, 15.0, 10.0],
    [15.0, 40.0, 70.0, 40.0, 15.0],
    [20.0, 70.0, 150.0, 70.0, 20.0],
    [15.0, 40.0, 70.0, 40.0, 15.0],
    [10.0, 15.0, 20.0, 15.0, 10.0]
], dtype=np.float64)

# L2 lebih kabur/terhalus seiring bertambahnya skala
L2 = np.array([
    [12.0, 18.0, 22.0, 18.0, 12.0],
    [18.0, 38.0, 60.0, 38.0, 18.0],
    [22.0, 60.0, 110.0, 60.0, 22.0],
    [18.0, 38.0, 60.0, 38.0, 18.0],
    [12.0, 18.0, 22.0, 18.0, 12.0]
], dtype=np.float64)

# 2. Hitung Difference of Gaussians (DoG): D = L2 - L1
DoG = L2 - L1

print("--- Komputasi Difference of Gaussians (DoG) Lowe ---")
print("Skala L1 (Sigma=1.0) Nilai Pusat:", L1[2, 2])
print("Skala L2 (Sigma=1.26) Nilai Pusat:", L2[2, 2])
print("\nMatriks DoG Hasil Pengurangan (L2 - L1):\n", DoG.round(1))
print(f"\nRespon Puncak DoG di Pusat (Blob Extrema): {DoG[2, 2]:.1f} (Nilai negatif kuat menandakan puncak intensitas)")
"""

c5_5_pitfalls = [
    "Mengurangi citra dari dua oktaf yang berbeda yang memiliki resolusi spasial berbeda; pengurangan DoG hanya valid dilakukan antara citra bertetangga dalam oktaf yang sama.",
    r"Memilih nilai $k$ terlalu besar ($k > 2.0$), yang menyebabkan galat aproksimasi deret Taylor terhadap $\sigma^2 \nabla^2 G$ menjadi sangat besar.",
    "Lupa bahwa konstanta pengali $(k - 1)$ konstan di seluruh skala sehingga tidak menggeser posisi puncak maksimum/minimum lokal."
]

c5_5_refs = [
    {
        "title": "Distinctive Image Features from Scale-Invariant Keypoints",
        "authors": ["David G. Lowe"],
        "year": 2004,
        "publisherOrVenue": "International Journal of Computer Vision (IJCV)",
        "url": "https://doi.org/10.1023/B:VISI.0000029664.99615.94",
        "relevance": "Bagian 3: Detection of scale-space extrema and Difference-of-Gaussian approximation."
    }
]

subchapters.append(create_subchapter("computer-vision-ch5-sub5", "5.5. Difference of Gaussians (DoG) sebagai Aproksimasi LoG pada SIFT", c5_5_desc, c5_5_md, c5_5_code, c5_5_pitfalls, c5_5_refs))

# ==============================================================================
# SUBCHAPTER 5.6: Algoritma SIFT (Scale-Invariant Feature Transform - Lowe, 2004)
# ==============================================================================
c5_6_desc = "Deteksi ekstrema lokal pada volume 3x3x3 ruang skala DoG, eliminasi respon tepi via rasio eigenvalue Hessian, dan lokalisasi subpiksel kuadratik."
c5_6_md = r"""Algoritma **Scale-Invariant Feature Transform (SIFT)** (Lowe, 2004) mendeteksi titik kunci yang sangat diskriminatif dan invarian terhadap skala, rotasi, perubahan pencahayaan, serta pergeseran sudut pandang 3D minor.

### 1. Deteksi Ekstrema Lokal Ruang Skala ($3 \times 3 \times 3$)
Untuk mendeteksi titik kunci kandidat, setiap piksel pada citra DoG dibandingkan dengan **26 titik tetangga** di sekelilingnya:
- 8 tetangga pada skala saat ini ($D(x, y, \sigma)$).
- 9 tetangga pada skala di bawahnya ($D(x, y, \sigma / k)$).
- 9 tetangga pada skala di atasnya ($D(x, y, k\sigma)$).

Piksel terpilih sebagai kandidat ekstrema jika nilainya secara mutlak **lebih besar dari seluruh 26 tetangga** (maksimum lokal) atau **lebih kecil dari seluruh 26 tetangga** (minimum lokal).

### 2. Eliminasi Respon Tepi Menggunakan Matriks Hessian
Mirip dengan detektor Harris, fungsi DoG memiliki respons yang sangat kuat di sepanjang garis tepi, yang tidak stabil terhadap derau. Matriks Hessian $2 \times 2$ dihitung pada lokasi kandidat:

$$\mathbf{H} = \begin{bmatrix} D_{xx} & D_{xy} \\ D_{xy} & D_{yy} \end{bmatrix}$$

Misalkan $\alpha$ adalah nilai eigen terbesar dan $\beta$ adalah nilai eigen terkecil, dengan rasio $r = \alpha / \beta$:
$$\operatorname{Tr}(\mathbf{H}) = D_{xx} + D_{yy} = \alpha + \beta$$
$$\det(\mathbf{H}) = D_{xx} D_{yy} - D_{xy}^2 = \alpha \beta$$

Rasio eigenvalue dirumuskan tanpa faktorisasi eksplisit:
$$\frac{\operatorname{Tr}(\mathbf{H})^2}{\det(\mathbf{H})} = \frac{(\alpha + \beta)^2}{\alpha \beta} = \frac{(r + 1)^2}{r}$$

Lowe menetapkan ambang batas rasio $r_{\text{threshold}} = 10$. Jika:
$$\frac{\operatorname{Tr}(\mathbf{H})^2}{\det(\mathbf{H})} > \frac{(r_{\text{threshold}} + 1)^2}{r_{\text{threshold}}} = \frac{11^2}{10} = 12.1$$
maka kandidat titik kunci tersebut dibuang karena merupakan respon tepi yang tidak stabil."""

c5_6_code = r"""import numpy as np

def is_scale_space_extremum(dog_volume: np.ndarray, x: int, y: int, s: int) -> bool:
    '''Memeriksa apakah piksel (x, y) pada skala s adalah ekstrema lokal terhadap 26 tetangga.'''
    val = dog_volume[s, y, x]
    cube = dog_volume[s-1:s+2, y-1:y+2, x-1:x+2]
    
    # Nilai harus lebih besar dari seluruh 26 tetangga ATAU lebih kecil dari seluruh 26 tetangga
    # Masking diri sendiri
    is_max = True
    is_min = True
    for ds in range(3):
        for dy in range(3):
            for dx in range(3):
                if ds == 1 and dy == 1 and dx == 1:
                    continue
                neighbor = cube[ds, dy, dx]
                if neighbor >= val:
                    is_max = False
                if neighbor <= val:
                    is_min = False
                    
    return is_max or is_min

def filter_edge_responses(Dxx: float, Dyy: float, Dxy: float, r_thresh: float = 10.0) -> bool:
    '''Eliminasi respon tepi menggunakan rasio trace dan determinant Hessian (Lowe 2004).'''
    tr = Dxx + Dyy
    det = Dxx * Dyy - (Dxy ** 2)
    if det <= 0:
        return False  # Titik pelana (saddle point) dibuang
        
    ratio = (tr ** 2) / det
    thresh_val = ((r_thresh + 1.0) ** 2) / r_thresh  # 12.1 untuk r=10
    return ratio < thresh_val

# Uji Ekstrema pada Kubus 3x3x3 Sintetis
vol_3x3x3 = np.zeros((3, 3, 3), dtype=np.float64)
vol_3x3x3[1, 1, 1] = 50.0  # Pusat maksimum lokal tajam

is_ext = is_scale_space_extremum(vol_3x3x3, x=1, y=1, s=1)

# Uji Respon Tepi vs Sudut pada Hessian
# Kasus A: Titik Sudut Bulat Simetris (Dxx=20, Dyy=25, Dxy=2)
keep_corner = filter_edge_responses(20.0, 25.0, 2.0, r_thresh=10.0)
# Kasus B: Garis Tepi Memanjang (Dxx=100, Dyy=2, Dxy=0 -> r = 50 >> 10)
keep_edge = filter_edge_responses(100.0, 2.0, 0.0, r_thresh=10.0)

print("--- Verifikasi Seleksi Titik Kunci SIFT Lowe (2004) ---")
print(f"Uji 26 Tetangga Ruang Skala : Status Ekstrema = {is_ext}")
print(f"Filter Hessian Titik Sudut  : Dipertahankan = {keep_corner} (Rasio Hessian < 12.1)")
print(f"Filter Hessian Garis Tepi   : Dipertahankan = {keep_edge} (Dieliminasi karena r=50 > 10)")
"""

c5_6_pitfalls = [
    "Tidak melakukan lokalisasi subpiksel 3D (Brown & Lowe Taylor expansion), yang menyebabkan ketidakstabilan posisi titik kunci pada pergeseran diskrit kisi.",
    r"Mengabaikan titik pelana (*saddle point*) di mana $\det(\mathbf{H}) < 0$, yang menghasilkan eigenvalue dengan tanda berlawanan.",
    "Menyetel ambang kontras $|D(x)|$ terlalu rendah, meloloskan ribuan titik kunci derau yang tidak dapat dicocokkan."
]

c5_6_refs = [
    {
        "title": "Distinctive Image Features from Scale-Invariant Keypoints",
        "authors": ["David G. Lowe"],
        "year": 2004,
        "publisherOrVenue": "International Journal of Computer Vision (IJCV)",
        "url": "https://doi.org/10.1023/B:VISI.0000029664.99615.94",
        "relevance": "Bagian 4: Accurate keypoint localization and Eliminating edge responses."
    }
]

subchapters.append(create_subchapter("computer-vision-ch5-sub6", "5.6. Algoritma SIFT (Scale-Invariant Feature Transform - Lowe, 2004)", c5_6_desc, c5_6_md, c5_6_code, c5_6_pitfalls, c5_6_refs))

# ==============================================================================
# SUBCHAPTER 5.7: Penetapan Orientasi Utama & Deskriptor SIFT 128 Dimensi
# ==============================================================================
c5_7_desc = "Penetapan orientasi kanonik berbasis histogram 36-bin lokal, ekstraksi kisi 4x4 subwilayah dengan 8 bin sudut, dan pembentukan deskriptor 128 dimensi."
c5_7_md = r"""Setelah posisi dan skala titik kunci terlokalisasi secara presisi, langkah krusial berikutnya adalah menyematkan **invariansi rotasi** dan membentuk representasi deskriptor yang khas (*distinctive*).

### 1. Penetapan Orientasi Kanonik Utama (Orientation Assignment)
r"Pada skala titik kunci yang terpilih $\sigma$, gradien magnitudo dan orientasi dihitung untuk piksel di sekitarnya dengan pembobotan Gaussian $\sigma_w = 1.5\sigma$.
- Sebuah **histogram orientasi 36 bin** (mencakup $360^\circ$, selebar $10^\circ$ per bin) dibentuk.
- Puncak tertinggi dalam histogram ditetapkan sebagai **orientasi utama** ($\theta_0$) dari titik kunci.
- Jika terdapat puncak sekunder yang memiliki tinggi $\ge 80\%$ dari puncak utama, sebuah titik kunci baru dibuat dengan posisi dan skala sama namun orientasi berbeda.

Seluruh perhitungan deskriptor selanjutnya akan **dirotasikan relatif terhadap orientasi kanonik $\theta_0$**, menjamin invariansi rotasi $360^\circ$ penuh.

### 2. Deskriptor SIFT 128 Dimensi
Di sekitar titik kunci yang telah disejajarkan orientasinya:
1. Wilayah lingkungan dibagi menjadi kisi **$4 \times 4$ subwilayah** (masing-masing berukuran $4 \times 4$ piksel).
2. Di setiap subwilayah, dibentuk histogram orientasi gradien **8 bin arah kardinal dan diagonal** ($0^\circ, 45^\circ, 90^\circ, \dots$).
3. Total dimensi vektor fitur adalah:
   $$4 \times 4 \text{ subwilayah} \times 8 \text{ bin arah} = \mathbf{128 \text{ dimensi}}$$
4. Vektor 128D dinormalisasi ke panjang satuan (*unit length*), dipotong pada nilai maksimum $0.2$ (*clamped*) untuk meredam non-linearitas pencahayaan, dan dinormalisasi ulang ke unit length."""

c5_7_code = r"""import numpy as np

def assign_canonical_orientation(magnitudes: np.ndarray, angles_deg: np.ndarray, num_bins: int = 36) -> float:
    '''Menentukan sudut orientasi kanonik dominan dari histogram 36-bin (10 derajat per bin).'''
    hist = np.zeros(num_bins, dtype=np.float64)
    bin_width = 360.0 / num_bins
    
    for mag, ang in zip(magnitudes.flatten(), angles_deg.flatten()):
        bin_idx = int(np.floor(ang / bin_width)) % num_bins
        hist[bin_idx] += mag
        
    dominant_bin = np.argmax(hist)
    dominant_angle = (dominant_bin + 0.5) * bin_width
    return float(dominant_angle)

# Simulasikan Distribusi Gradien Lokal dengan Dominasi Aliran ke Sudut 135 Derajat
np.random.seed(42)
mags = np.random.uniform(5.0, 15.0, (16, 16))
angles = np.random.uniform(130.0, 140.0, (16, 16))  # Terpusat di sekitar 135°

theta_canon = assign_canonical_orientation(mags, angles, num_bins=36)

# Verifikasi Dimensi Deskriptor SIFT: 4x4 kisi x 8 arah
grid_cells = 4 * 4
bins_per_cell = 8
total_sift_dim = grid_cells * bins_per_cell

print("--- Penetapan Orientasi & Arsitektur Deskriptor SIFT ---")
print(f"Sudut Kanonik Utama Terpilih : {theta_canon:.1f}°")
print(f"Kisi Subwilayah Spasial      : 4x4 = {grid_cells} sel")
print(f"Bin Orientasi per Subwilayah : {bins_per_cell} arah (Kelipatan 45°)")
print(f"Total Panjang Vektor SIFT    : {total_sift_dim} Dimensi")
"""

c5_7_pitfalls = [
    "Lupa merotasikan koordinat sampel subwilayah terhadap sudut kanonik $\theta_0$, yang menghilangkan sifat invariansi rotasi deskriptor.",
    "Mengabaikan interpolasi trilinear (spasial $x, y$ dan orientasi $\theta$), yang memicu perubahan nilai deskriptor secara diskontinu saat titik kunci bergeser sangat tipis.",
    "Tidak melakukan *threshold clamping* $0.2$ pada vektor ternormalisasi, membuat SIFT rentan terhadap pantulan kilauan cahaya non-linear."
]

c5_7_refs = [
    {
        "title": "Distinctive Image Features from Scale-Invariant Keypoints",
        "authors": ["David G. Lowe"],
        "year": 2004,
        "publisherOrVenue": "International Journal of Computer Vision (IJCV)",
        "url": "https://doi.org/10.1023/B:VISI.0000029664.99615.94",
        "relevance": "Bagian 5 dan 6: Orientation assignment and The local image descriptor (128-D SIFT)."
    }
]

subchapters.append(create_subchapter("computer-vision-ch5-sub7", "5.7. Penetapan Orientasi Utama & Deskriptor SIFT 128 Dimensi", c5_7_desc, c5_7_md, c5_7_code, c5_7_pitfalls, c5_7_refs))

# ==============================================================================
# SUBCHAPTER 5.8: Detektor Sudut Cepat FAST (Features from Accelerated Segment Test)
# ==============================================================================
c5_8_desc = "Detektor sudut waktu nyata FAST (Rosten & Drummond, 2006), uji lingkaran Bresenham 16 piksel, segment test terakselerasi 4 piksel kardinal, dan optimasi ID3 decision tree."
c5_8_md = r"""Meskipun SIFT dan Harris sangat akurat, biaya komputasinya terlalu berat untuk aplikasi waktu nyata berkecepatan tinggi seperti pelacakan visual SLAM pada perangkat seluler. Edward Rosten dan Tom Drummond (2006) merancang **FAST (Features from Accelerated Segment Test)**.

### 1. Prinsip Uji Lingkaran Bresenham 16 Piksel
Untuk menguji apakah piksel kandidat $p$ dengan intensitas $I_p$ merupakan titik sudut:
1. Ambil **lingkaran diskrit Bresenham beradius 3 piksel** yang memuat $16$ piksel keliling (dinomori $1$ hingga $16$) di sekitar $p$.
2. Piksel $p$ diklasifikasikan sebagai titik sudut jika terdapat **busur bersambung (*contiguous arc*) minimal $n$ piksel** (umumnya $n = 9$ atau $n = 12$) pada lingkaran yang semuanya:
   - Lebih terang dari $I_p + t$, ATAU
   - Lebih gelap dari $I_p - t$,
   di mana $t$ adalah ambang batas kontras (*threshold*).

### 2. Tes Eliminasi Cepat (*High-Speed Test*)
Untuk mengeliminasi sebagian besar piksel non-sudut dalam waktu singkat tanpa memeriksa ke-16 piksel:
- Cukup periksa **4 piksel kardinal**: piksel 1 (Utara), 9 (Selatan), 5 (Timur), dan 13 (Barat).
- Agar busur 12 piksel kontinu dapat terwujud, **minimal 3 dari 4 piksel kardinal ini harus memenuhi kriteria ambang**.
- Jika kurang dari 3 piksel yang memenuhi, piksel $p$ langsung ditolak secara instan $\mathcal{O}(1)$!"""

c5_8_code = r"""import numpy as np

def fast_corner_test(patch_7x7: np.ndarray, t: float = 20.0, n_contiguous: int = 9) -> bool:
    '''Implementasi uji sudut FAST pada lingkaran Bresenham 16-piksel radius 3.'''
    cp = patch_7x7[3, 3]  # Piksel pusat p
    
    # 16 Piksel pada keliling lingkaran Bresenham radius 3
    # Relatif terhadap pusat (3, 3)
    circle_offsets = [
        (-3,  0), (-3,  1), (-2,  2), (-1,  3),  # 1, 2, 3, 4
        ( 0,  3), ( 1,  3), ( 2,  2), ( 3,  1),  # 5, 6, 7, 8
        ( 3,  0), ( 3, -1), ( 2, -2), ( 1, -3),  # 9, 10, 11, 12
        ( 0, -3), (-1, -3), (-2, -2), (-3, -1)   # 13, 14, 15, 16
    ]
    
    vals = [patch_7x7[3 + dy, 3 + dx] for dy, dx in circle_offsets]
    
    # Kategori: +1 (Terang: >= cp + t), -1 (Gelap: <= cp - t), 0 (Mirip)
    labels = []
    for v in vals:
        if v >= cp + t:
            labels.append(1)
        elif v <= cp - t:
            labels.append(-1)
        else:
            labels.append(0)
            
    # Periksa keberadaan rantai bersambung minimal n piksel identik (+1 atau -1)
    # Gandakan list untuk menangani kesinambungan melingkar (circular wrap-around)
    labels_circular = labels + labels
    
    max_bright_arc = 0
    max_dark_arc = 0
    curr_b, curr_d = 0, 0
    
    for lbl in labels_circular:
        if lbl == 1:
            curr_b += 1
            max_bright_arc = max(max_bright_arc, curr_b)
        else:
            curr_b = 0
            
        if lbl == -1:
            curr_d += 1
            max_dark_arc = max(max_dark_arc, curr_d)
        else:
            curr_d = 0
            
    return (max_bright_arc >= n_contiguous) or (max_dark_arc >= n_contiguous)

# Patch 7x7 Sintetis dengan Titik Sudut Tajam (Pusat Gelap dikelilingi Busur Terang Lebar)
patch_corner = np.full((7, 7), 50.0)
patch_corner[3, 3] = 40.0  # Pusat
# Buat busur piksel terang di sisi kanan dan bawah (intensitas 150)
patch_corner[2:, 3:] = 150.0

is_corner = fast_corner_test(patch_corner, t=30.0, n_contiguous=9)

print("--- Uji Detektor Sudut Waktu Nyata FAST ---")
print(f"Intensitas Piksel Pusat: {patch_corner[3, 3]}")
print(f"Status Deteksi Sudut FAST-9 (t=30.0): {is_corner} (Rantai busur kontinu terdeteksi valid)")
"""

c5_8_pitfalls = [
    "FAST adalah detektor titik sudut murni dan **tidak menghasilkan deskriptor fitur** apapun; FAST harus dipasangkan dengan deskriptor independen (seperti BRIEF atau ORB) untuk pencocokan.",
    "Banyaknya deteksi terkelompok (*clustering*): FAST mendeteksi banyak titik bertetangga pada sudut yang sama, sehingga Non-Maximum Suppression berbasis skor respon sudut wajib diterapkan.",
    "FAST tidak invarian terhadap skala citra (FAST beroperasi pada satu skala tetap kecuali dijalankan di atas piramida citra multi-level)."
]

c5_8_refs = [
    {
        "title": "Machine Learning for High-Speed Corner Detection",
        "authors": ["Edward Rosten", "Tom Drummond"],
        "year": 2006,
        "publisherOrVenue": "European Conference on Computer Vision (ECCV)",
        "url": "https://doi.org/10.1007/11744023_34",
        "relevance": "Paper kanonikal detektor sudut FAST berbasis uji lingkaran Bresenham."
    }
]

subchapters.append(create_subchapter("computer-vision-ch5-sub8", "5.8. Detektor Sudut Cepat FAST (Features from Accelerated Segment Test)", c5_8_desc, c5_8_md, c5_8_code, c5_8_pitfalls, c5_8_refs))

# ==============================================================================
# SUBCHAPTER 5.9: Deskriptor Biner BRIEF (Binary Robust Independent Elementary Features)
# ==============================================================================
c5_9_desc = "Deskriptor string bit biner BRIEF (Calonder et al., 2010), uji perbandingan intensitas pasangan acak, jarak Hamming berkecepatan tinggi via instruksi POPCNT."
c5_9_md = r"""Deskriptor vektor float tradisional (seperti SIFT 128D yang memakan 512 byte per titik) membutuhkan memori besar dan pencocokan jarak Euclidean $L_2$ yang lambat. Michael Calonder et al. (2010) memperkenalkan **BRIEF**, yang merevolusi representasi fitur melalui **string bit biner**.

### 1. Uji Intensitas Berpasangan Biner
Di sekitar patch citra terhalus $P$ berukuran $S \times S$, sebuah uji biner $\tau$ didefinisikan pada sepasang titik piksel koordinat $x$ dan $y$:

$$\tau(P; x, y) = \begin{cases} 1 & \text{jika } I(x) < I(y) \\ 0 & \text{jika } I(x) \ge I(y) \end{cases}$$

Deskriptor BRIEF dibentuk dengan menggabungkan hasil dari $n_d$ pasangan uji acak (biasanya $n_d = 256$ bit = 32 byte):
$$f_{n_d}(P) = \sum_{1 \le i \le n_d} 2^{i-1} \tau(P; x_i, y_i)$$

Pasangan titik $(x_i, y_i)$ disampel secara acak dari distribusi Gaussian 2D $\mathcal{N}(0, \frac{1}{25}S^2)$ yang terpusat di tengah patch.

### 2. Kecepatan Pencocokan Ekstrem: Jarak Hamming & POPCNT
Perbedaan antara dua deskriptor biner $\mathbf{a}$ dan $\mathbf{b}$ dihitung melalui **Jarak Hamming** (jumlah bit yang berbeda):

$$D_{\text{Hamming}}(\mathbf{a}, \mathbf{b}) = \operatorname{POPCNT}(\mathbf{a} \oplus \mathbf{b})$$

Operasi ini dieksekusi secara instan pada tingkat perangkat keras prosesor modern menggunakan operasi bitwise XOR ($\oplus$) diikuti instruksi CPU tunggal `POPCNT` (*population count*), hingga **puluhan kali lebih cepat** dibanding kalkulasi jarak floating-point Euclidean."""

c5_9_code = r"""import numpy as np

def compute_brief_descriptor(patch: np.ndarray, test_pairs: list) -> int:
    '''Menghasilkan deskriptor biner BRIEF dari daftar pasangan uji titik (x, y).'''
    desc = 0
    for i, ((y1, x1), (y2, x2)) in enumerate(test_pairs):
        bit = 1 if patch[y1, x1] < patch[y2, x2] else 0
        desc |= (bit << i)
    return desc

def hamming_distance(desc_a: int, desc_b: int) -> int:
    '''Menghitung jarak Hamming antara dua string bit biner.'''
    xor_res = desc_a ^ desc_b
    return bin(xor_res).count('1')

# Definisikan 8 Pasang Uji Koordinat Acak pada Patch 9x9 (Pusat di (4,4))
np.random.seed(42)
pairs_8 = [
    ((np.random.randint(1, 8), np.random.randint(1, 8)), 
     (np.random.randint(1, 8), np.random.randint(1, 8))) for _ in range(8)
]

# Patch 1: Citra Asli
patch_1 = np.random.randint(50, 200, (9, 9), dtype=np.uint8)
# Patch 2: Patch 1 dengan Derau Sensor Halus +-2 tingkat intensitas
patch_noisy = np.clip(patch_1.astype(int) + np.random.randint(-2, 3, (9, 9)), 0, 255).astype(np.uint8)
# Patch 3: Citra Berbeda Sepenuhnya
patch_diff = np.random.randint(50, 200, (9, 9), dtype=np.uint8)

d1 = compute_brief_descriptor(patch_1, pairs_8)
d2 = compute_brief_descriptor(patch_noisy, pairs_8)
d3 = compute_brief_descriptor(patch_diff, pairs_8)

dist_match = hamming_distance(d1, d2)
dist_diff = hamming_distance(d1, d3)

print("--- Uji Deskriptor Biner BRIEF & Jarak Hamming ---")
print(f"Deskriptor Patch 1 (Asli) : {d1:08b} (Desimal: {d1})")
print(f"Deskriptor Patch 2 (Derau): {d2:08b} (Desimal: {d2})")
print(f"Deskriptor Patch 3 (Beda) : {d3:08b} (Desimal: {d3})")
print(f"\nJarak Hamming Pasangan Cocok (Patch 1 vs Patch 2): {dist_match}/8 bit berbeda (Sangat Mirip)")
print(f"Jarak Hamming Pasangan Beda  (Patch 1 vs Patch 3): {dist_diff}/8 bit berbeda (Sangat Berbeda)")
"""

c5_9_pitfalls = [
    r"Kelemahan fatal BRIEF orisinal: **tidak memiliki invariansi rotasi sama sekali**. Rotasi citra sebesar $15^\circ$ saja sudah merusak pencocokan jarak Hamming secara drastis (diatasi oleh ORB).",
    "Melakukan uji BRIEF langsung pada citra tanpa pra-penghalusan Gaussian; karena uji membandingkan piksel tunggal, derau frekuensi tinggi dapat mengubah bit secara acak.",
    "Memilih pasangan uji yang sangat berkorelasi; pasangan sampel harus memiliki korelasi serendah mungkin dan varians setinggi mungkin untuk memaksimalkan kapasitas informasi 256 bit."
]

c5_9_refs = [
    {
        "title": "BRIEF: Binary Robust Independent Elementary Features",
        "authors": ["Michael Calonder", "Vincent Lepetit", "Christoph Strecha", "Pascal Fua"],
        "year": 2010,
        "publisherOrVenue": "European Conference on Computer Vision (ECCV)",
        "url": "https://doi.org/10.1007/978-3-642-15561-1_56",
        "relevance": "Paper orisinal pendefinisian deskriptor biner BRIEF berbasis uji titik acak."
    }
]

subchapters.append(create_subchapter("computer-vision-ch5-sub9", "5.9. Deskriptor Biner BRIEF (Binary Robust Independent Elementary Features)", c5_9_desc, c5_9_md, c5_9_code, c5_9_pitfalls, c5_9_refs))

# ==============================================================================
# SUBCHAPTER 5.10: ORB (Oriented FAST and Rotated BRIEF - Rublee et al., 2011)
# ==============================================================================
c5_10_desc = "Arsitektur ORB (Rublee et al., 2011), oFAST dengan orientasi centroid momen intensitas, rBRIEF terotasi terarah (steered BRIEF), dan pembelajaran pasangan tak berkorelasi."
c5_10_md = r"""Pada konferensi ICCV 2011, Ethan Rublee, Vincent Rabaud, Kurt Konolige, dan Gary Bradski mempublikasikan **ORB (Oriented FAST and Rotated BRIEF)** sebagai alternatif berkinerja tinggi yang bebas paten (*open-source*) terhadap SIFT dan SURF, dengan kecepatan hingga **dua orde magnitudo ($100\times$) lebih cepat**.

### 1. oFAST: FAST Berorientasi Momen Intensitas
Untuk menambahkan invariansi rotasi pada detektor FAST, ORB menggunakan metode **Intensity Centroid** (Rosin, 1999). Momen intensitas 2D orde $(p, q)$ dari patch lingkaran $B$ didefinisikan sebagai:

$$m_{pq} = \sum_{x, y \in B} x^p y^q I(x, y)$$

Pusat massa intensitas (*centroid*) adalah:
$$C = \left( \frac{m_{10}}{m_{00}}, \frac{m_{01}}{m_{00}} \right)$$

Vektor yang menghubungkan pusat geometris patch $O(0, 0)$ ke pusat massa $C$ mendefinisikan sudut orientasi kanonik patch:
$$\theta = \operatorname{arctan2}(m_{01}, m_{10})$$

### 2. rBRIEF: Rotated / Steered BRIEF
Untuk membuat deskriptor BRIEF invarian terhadap rotasi $\theta$, himpunan koordinat pasangan uji biner $2 \times n$ bernama $\mathbf{S} = \begin{pmatrix} x_1 & \dots & x_n \\ y_1 & \dots & y_n \end{pmatrix}$ dirotasikan menggunakan matriks rotasi 2D $\mathbf{R}_\theta$:

$$\mathbf{S}_\theta = \mathbf{R}_\theta \mathbf{S} = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix} \mathbf{S}$$

### 3. Pemilihan Pasangan Ber-varians Tinggi (Uncorrelated Pairs)
Rotasi pasangan uji menyebabkan hilangnya independensi antar-bit. Rublee et al. menggunakan algoritma pembelajaran rakus (*greedy learning*) pada basis data pelatihan besar untuk memilih 256 pasangan uji optimal yang memiliki nilai rata-rata mendekati $0.5$ (entropi maksimum) dan korelasi timbal-balik terendah."""

c5_10_code = r"""import numpy as np

def compute_intensity_centroid_orientation(patch: np.ndarray) -> float:
    '''Menghitung sudut orientasi kanonik patch menggunakan Momen Sentroid Intensitas Rosin-ORB.'''
    H, W = patch.shape
    cy, cx = (H - 1) / 2.0, (W - 1) / 2.0
    
    y_idx, x_idx = np.mgrid[0:H, 0:W]
    x_rel = x_idx - cx
    y_rel = y_idx - cy
    
    # Hitung momen m00, m10, m01
    m00 = np.sum(patch)
    m10 = np.sum(x_rel * patch)
    m01 = np.sum(y_rel * patch)
    
    # Sudut kanonik dalam derajat
    theta_rad = np.arctan2(m01, m10)
    return float(np.degrees(theta_rad))

# Simulasikan Patch Sudut yang Diputar pada Dua Orientasi:
# Patch A: Massa Terang Terkonsentrasi di Sumbu X Positif (Kanan)
patch_a = np.full((7, 7), 50.0)
patch_a[:, 4:] = 200.0  # Dominan kanan

# Patch B: Citra yang Sama tetapi Diputar 90 Derajat (Massa Terang Terkonsentrasi di Sumbu Y Positif / Bawah)
patch_b = np.full((7, 7), 50.0)
patch_b[4:, :] = 200.0  # Dominan bawah

angle_a = compute_intensity_centroid_orientation(patch_a)
angle_b = compute_intensity_centroid_orientation(patch_b)

print("--- Algoritma ORB: Orientasi Centroid Momen Intensitas (oFAST) ---")
print(f"1. Sudut Kanonik Patch A (Terang di Kanan) : {angle_a:6.1f}° (Mendekati 0° Sumbu X)")
print(f"2. Sudut Kanonik Patch B (Terang di Bawah) : {angle_b:6.1f}° (Mendekati 90° Sumbu Y)")
print(f"Selisih Rotasi Terukur: {abs(angle_b - angle_a):.1f}° (Rotasi 90° Terdeteksi Presisi)")
"""

c5_10_pitfalls = [
    "Menghitung momen intensitas pada jendela kotak alih-alih patch lingkaran radius $r$, yang menyebabkan momen centroid berfluktuasi saat objek berotasi.",
    "Mengabaikan piramida skala multi-level: ORB standar membangun 8 level piramida dengan faktor skala $1.2$ untuk menjamin invariansi skala pada deteksi oFAST.",
    "Menggunakan jarak Euclidean $L_2$ saat mencocokkan fitur ORB; deskriptor ORB adalah string biner 256-bit (32 byte) dan **wajib dicocokkan menggunakan Jarak Hamming** (`cv2.NORM_HAMMING`)."
]

c5_10_refs = [
    {
        "title": "ORB: An efficient alternative to SIFT or SURF",
        "authors": ["Ethan Rublee", "Vincent Rabaud", "Kurt Konolige", "Gary Bradski"],
        "year": 2011,
        "publisherOrVenue": "IEEE International Conference on Computer Vision (ICCV)",
        "url": "https://doi.org/10.1109/ICCV.2011.6126544",
        "relevance": "Paper kanonikal penemu algoritma ORB (oFAST dan rBRIEF)."
    }
]

subchapters.append(create_subchapter("computer-vision-ch5-sub10", "5.10. ORB (Oriented FAST and Rotated BRIEF - Rublee et al., 2011)", c5_10_desc, c5_10_md, c5_10_code, c5_10_pitfalls, c5_10_refs))

# ==============================================================================
# SAVE JSON OUTPUT
# ==============================================================================
output_path = os.path.join(os.path.dirname(__file__), "cv_ch5_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 5 data with {len(subchapters)} subchapters: {output_path}")
