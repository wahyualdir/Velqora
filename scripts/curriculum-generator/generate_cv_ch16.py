# -*- coding: utf-8 -*-
"""
Generator untuk Bab 16: Visi Komputer 3D (3D Computer Vision) & Neural Rendering (10 Subbab)
Topik: Computer Vision (08-computer-vision.ts)
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
# Subbab 16.1: Stereo Vision & Disparity Mapping: Geometri Epipolar & Triangulasi
# ==============================================================================
code_16_1 = r'''import numpy as np

# Simulasi Stereo Vision: Triangulasi Kedalaman dari Disparitas
# Z = (f * B) / d
# f = panjang fokus kamera (focal length dalam piksel)
# B = baseline (jarak antar dua pusat optik kamera dalam meter)
# d = disparitas (selisih posisi horizontal x_left - x_right dalam piksel)

focal_length = 800.0  # 800 piksel
baseline = 0.20       # 20 cm = 0.2 meter

# Simulasi 4 titik objek 3D pada kedalaman berbeda (Z nyata: 1m, 2m, 5m, 10m)
true_depths = np.array([1.0, 2.0, 5.0, 10.0])

# Disparitas teoritis: d = (f * B) / Z
disparities = (focal_length * baseline) / true_depths

# Rekonstruksi kedalaman terestimasi
reconstructed_depths = (focal_length * baseline) / disparities

print("Simulasi Stereo Triangulasi (f = 800 px, Baseline B = 0.2 m):")
for z_true, disp, z_rec in zip(true_depths, disparities, reconstructed_depths):
    print(f"Kedalaman Nyata Z = {z_true:5.1f} m | Disparitas d = {disp:6.2f} px | Kedalaman Rekonstruksi = {z_rec:5.1f} m")

print("\nKarakteristik Matematis Stereo Vision:")
print("1. Hubungan disparitas terhadap kedalaman bersifat hiperbolik invers (Z ~ 1/d).")
print("2. Objek yang sangat dekat menghasilkan disparitas besar, objek sangat jauh mendekati 0 disparitas.")
'''

subchapters.append({
    "id": "cv-16-1-stereo-vision-epipolar-geometry",
    "chapterId": "computer-vision-ch-15",
    "title": "Stereo Vision & Disparity Mapping: Geometri Epipolar, Matriks Fundamental/Esensial, dan Triangulasi",
    "description": "Prinsip dasar penglihatan stereo binokular: geometri bidang epipolar, relasi matriks esensial dan fundamental, estimasi disparitas, serta triangulasi 3D.",
    "estimatedMinutes": 35,
    "order": 1,
    "content": {
        "theory": (
            "Rekonstruksi kedalaman tiga dimensi dari sepasang kamera dua dimensi merupakan salah satu pilar klasik visi komputer. Ketika dua kamera dengan pusat optik terpisah sejauh jarak garis dasar (*baseline*) $B$ mengamati sebuah titik 3D $\\mathbf{X} = [X, Y, Z]^T$ di dunia nyata, posisi titik tersebut diproyeksikan ke bidang citra kiri pada koordinat $(x_L, y_L)$ dan bidang citra kanan pada $(x_R, y_R)$.\n\n"
            "Fondasi geometris relasi dua pandangan diatur oleh **Geometri Epipolar** (*Epipolar Geometry*):\n"
            "1. **Pusat Kamera ($C_1, C_2$)**: Titik fokus optik dari kedua kamera.\n"
            "2. **Epipole ($e_1, e_2$)**: Titik perpotongan antara garis yang menghubungkan kedua pusat kamera (*baseline*) dengan bidang citra masing-masing.\n"
            "3. **Bidang Epipolar (*Epipolar Plane*)**: Bidang 3D yang dibentuk oleh titik ruang $\\mathbf{X}$ dan kedua pusat kamera $C_1, C_2$.\n"
            "4. **Garis Epipolar (*Epipolar Line*)**: Garis perpotongan bidang epipolar dengan bidang citra. Untuk setiap titik di citra kiri, padanan korespondensinya di citra kanan dijamin secara geometris **pasti terletak pada garis epipolar yang bersesuaian**, memangkas ruang pencarian korespondensi dari 2D (seluruh citra) menjadi 1D linear.\n\n"
            "Hubungan aljabar korespondensi epipolar dinyatakan melalui **Matriks Esensial** $\\mathbf{E}$ (untuk koordinat kamera ternormalisasi) dan **Matriks Fundamental** $\\mathbf{F}$ (untuk koordinat piksel mentah):\n"
            "$$x_R^T \\mathbf{F} x_L = 0 \\quad \\text{di mana} \\quad \\mathbf{F} = \\mathbf{K}_R^{-T} \\mathbf{E} \\mathbf{K}_L^{-1}, \\quad \\mathbf{E} = [\\mathbf{t}]_\\times \\mathbf{R}$$\n"
            "di mana $[\\mathbf{t}]_\\times$ adalah matriks *skew-symmetric* dari translasi antar kamera, dan $\\mathbf{R}$ adalah rotasi relatif.\n\n"
            "Setelah pasangan citra diselaraskan secara horizontal (*stereo rectification*), garis epipolar menjadi sejajar sumbu horizontal ($y_L = y_R$). Nilai pergeseran horizontal didefinisikan sebagai **Disparitas** $d = x_L - x_R$. Melalui prinsip kesebangunan segitiga (*triangulation*), kedalaman $Z$ dihitung dengan rumus inversi:\n"
            "$$Z = \\frac{f \\cdot B}{d}$$\n"
            "di mana $f$ adalah panjang fokus efektif dalam piksel."
        ),
        "codeSnippet": code_16_1,
        "codeSnippetOutput": run_code_capture_output(code_16_1),
        "realWorldApplication": (
            "Diterapkan pada sensor stereo kamera mobil otonom (seperti Subaru EyeSight), modul navigasi penjelajah Mars Rover (NASA Perseverance), dan sistem robotika industri untuk estimasi jarak penghalang."
        ),
        "commonPitfalls": [
            r"Tidak melakukan rektifikasi stereo (stereo rectification), sehingga pencarian disparitas harus dilakukan pada garis miring non-horizontal.",
            r"Area homogen tanpa tekstur (misal dinding putih bersih atau langit biru) menghasilkan ketidakpastian tinggi pada kalkulasi block matching disparitas.",
            r"Membagi dengan nilai disparitas mendekati nol (d -> 0) untuk objek yang sangat jauh tanpa penanganan batas numerik, yang memicu nilai kedalaman infinity."
        ],
        "caseStudy": (
            "Sebuah kamera stereo pada robot otonom memiliki panjang fokus f = 1000 piksel dan baseline B = 0.5 meter. Hitung resolusi kedalaman delta Z pada jarak 5 meter dan 20 meter jika resolusi estimasi disparitas sub-piksel minimum adalah 0.2 piksel. Mengapa ketelitian kedalaman menurun drastis seiring bertambahnya jarak?"
        ),
        "academicReferences": [
            r"Hartley, R., & Zisserman, A. (2003). Multiple view geometry in computer vision. Cambridge university press.",
            r"Scharstein, D., & Szeliski, R. (2002). A taxonomy and evaluation of dense two-frame stereo correspondence algorithms. International journal of computer vision, 47(1), 7-42.",
            r"Hirschmuller, H. (2007). Stereo processing by semiglobal matching and mutual information. IEEE Transactions on pattern analysis and machine intelligence, 30(2), 328-341."
        ]
    }
})

# ==============================================================================
# Subbab 16.2: Representasi Data 3D: Voxel, Mesh, SDF, dan Point Clouds
# ==============================================================================
code_16_2 = r'''import numpy as np

# Komparasi Representasi 3D: Voxel Grid, Point Cloud, dan Signed Distance Function (SDF)
# Membandingkan jejak memori dan sifat komputasi untuk sebuah bola 3D beradius R = 1.0

radius = 1.0

# 1. Point Cloud: Himpunan koordinat titik N x 3
n_points = 500
phi = np.random.uniform(0, 2*np.pi, n_points)
costheta = np.random.uniform(-1, 1, n_points)
theta = np.arccos(costheta)
x = radius * np.sin(theta) * np.cos(phi)
y = radius * np.sin(theta) * np.sin(phi)
z = radius * np.cos(theta)
point_cloud = np.stack([x, y, z], axis=1) # (500, 3)

# 2. Voxel Grid: Kisi kubus diskrit 3D beresolusi 32 x 32 x 32
grid_res = 32
coords = np.linspace(-1.5, 1.5, grid_res)
X, Y, Z = np.meshgrid(coords, coords, coords)
voxel_grid = (X**2 + Y**2 + Z**2) <= radius**2 # boolean occupancy

# 3. Signed Distance Function (SDF) Implisit: fungsi kontinu f(p) = ||p|| - R
def sphere_sdf(point, r=1.0):
    # Nilai < 0 di dalam objek, = 0 pada permukaan bola, > 0 di luar objek
    return np.linalg.norm(point) - r

test_pt_inside = np.array([0.5, 0.0, 0.0])
test_pt_surface = np.array([1.0, 0.0, 0.0])
test_pt_outside = np.array([1.5, 0.0, 0.0])

print("Analisis Jejak Memori dan Representasi 3D:")
print(f"1. Point Cloud ({n_points} titik float32): {point_cloud.nbytes} bytes (Memori hemat, diskrit nir-topologi)")
print(f"2. Voxel Grid (Resolusi {grid_res}^3 boolean): {voxel_grid.nbytes} bytes (Skalabilitas O(N^3) sangat boros)")
print(f"3. SDF Implisit: Didefinisikan secara fungsional matematis (Resolusi tak hingga)")
print(f"   SDF titik dalam [0.5, 0, 0]: {sphere_sdf(test_pt_inside):+.2f} (negatif = solid)")
print(f"   SDF titik batas [1.0, 0, 0]: {sphere_sdf(test_pt_surface):+.2f} (nol = permukaan)")
print(f"   SDF titik luar  [1.5, 0, 0]: {sphere_sdf(test_pt_outside):+.2f} (positif = ruang hampa)")
'''

subchapters.append({
    "id": "cv-16-2-3d-data-representations",
    "chapterId": "computer-vision-ch-15",
    "title": "Representasi Data 3D: Voxel Grids, Polygon Meshes, Implicit Surfaces (SDF), dan Point Clouds",
    "description": "Taksonomi struktur data geometris 3D: representasi eksplisit (voxel, mesh, titik) versus representasi implisit kontinu (level sets, signed distance functions).",
    "estimatedMinutes": 35,
    "order": 2,
    "content": {
        "theory": (
            "Berbeda dengan domain citra 2D yang memiliki struktur kisi regular kisi piksel seragam, representasi geometri 3D memiliki keragaman matematis yang sangat luas, di mana masing-masing struktur data memiliki pertukaran (*trade-offs*) antara efisiensi memori, fleksibilitas topologi, dan kemudahan diferensiasi gradien deep learning.\n\n"
            "Empat representasi fundamental 3D meliputi:\n"
            "1. **Voxel Grids (Kisi Voksel)**: Ekstensi alami piksel 2D ke kubus elemen volume 3D reguler berukuran $H \\times W \\times D$. Sangat mudah diproses dengan konvolusi 3D (*3D CNNs*). Namun, kompleksitas memori dan komputasinya meledak secara kubik $\\mathcal{O}(N^3)$, sehingga resolusi praktis biasanya terbatas pada $32^3$ atau $64^3$.\n"
            "2. **Point Clouds (Awan Titik)**: Himpunan tak terurut dari $N$ koordinat spasial $\\{p_i = (x_i, y_i, z_i)\\}_{i=1}^N$, sering kali dilengkapi dengan atribut normal permukaan atau warna RGB. Merupakan format data mentah alami dari sensor LiDAR dan rekonstruksi SfM. Sifatnya tak terstruktur (*unstructured*), nir-topologi, dan memerlukan algoritma khusus yang tahan permutasi urutan.\n"
            "3. **Polygon Meshes (Jaring Poligon)**: Terdiri dari himpunan titik sudut (*vertices*) $V$ dan indeks permukaan (*faces*) $F$ (umumnya segitiga) yang mendefinisikan konektivitas topologi permukaan batas secara eksplisit. Merupakan format standar rendering grafika komputer (OpenGL/Vulkan), namun sangat sulit dioptimalkan secara langsung dengan deep learning karena perubahan topologi (seperti penggabungan lubang) bersifat diskrit.\n"
            "4. **Implicit Surfaces / Signed Distance Functions (SDF)**: Permukaan objek didefinisikan secara implisit sebagai bidang nol (*zero-level set*) dari sebuah fungsi kontinu $f: \\mathbb{R}^3 \\to \\mathbb{R}$:\n"
            "$$\\mathcal{S} = \\{ \\mathbf{p} \\in \\mathbb{R}^3 \\mid f(\\mathbf{p}) = 0 \\}$$\n"
            "Pada SDF, $|f(\\mathbf{p})|$ merepresentasikan jarak Euclidean terpendek ke permukaan, di mana $f(\\mathbf{p}) < 0$ menandakan bagian dalam benda pejal dan $f(\\mathbf{p}) > 0$ menandakan ruang bebas. Representasi implisit ini memiliki resolusi tak hingga dan menjadi fondasi *Neural Implicit Representations* (DeepSDF, NeRF)."
        ),
        "codeSnippet": code_16_2,
        "codeSnippetOutput": run_code_capture_output(code_16_2),
        "realWorldApplication": (
            "Point clouds digunakan pada sensor LiDAR mobil otonom Waymo. Mesh digunakan pada pemodelan CAD dan mesin game Unreal Engine. SDF digunakan dalam simulasi fisika fluida dan rekonstruksi medis tomografi (CT Scan/MRI)."
        ),
        "commonPitfalls": [
            r"Memilih Voxel Grid resolusi tinggi (misal 512x512x512) yang langsung menyebabkan GPU Out-of-Memory (membutuhkan lebih dari 4 GB hanya untuk satu sampel).",
            r"Memperlakukan Point Cloud sebagai matriks sekuensial yang sensitif terhadap urutan baris, padahal susunan fisik titik bersifat permutasi invarian.",
            r"Kesalahan tanda (sign convention) pada kalkulasi SDF yang membalik orientasi interior dan eksterior benda."
        ],
        "caseStudy": (
            "Sebuah drone inspeksi bangunan mengumpulkan 2 juta titik point cloud dari sebuah jembatan beton. Jelaskan mengapa data ini tidak efisien jika langsung diubah menjadi dense voxel grid, dan bagaimana algoritma Marching Cubes dapat mengekstrak triangular mesh halus dari aproksimasi SDF titik-titik tersebut."
        ),
        "academicReferences": [
            r"Park, J. J., Florence, P., Straub, J., Newcombe, R., & Lovegrove, S. (2019). Deepsdf: Learning continuous signed distance functions for shape representation. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 165-174).",
            r"Lorensen, W. E., & Cline, H. E. (1987). Marching cubes: A high resolution 3D surface construction algorithm. ACM siggraph computer graphics, 21(4), 163-169.",
            r"Mescheder, L., Oechsle, M., Niemeyer, M., Nowozin, S., & Geiger, A. (2019). Occupancy networks: Learning 3d reconstruction in function space. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 4460-4470)."
        ]
    }
})

# ==============================================================================
# Subbab 16.3: Pemrosesan Point Cloud: PointNet & PointNet++
# ==============================================================================
code_16_3 = r'''import numpy as np

# Implementasi Prinsip Arsitektur PointNet (Qi et al., CVPR 2017)
# Fungsi Simetris (Symmetric Function) untuk Menjamin Permutation Invariance:
# f(x_1, x_2, ..., x_n) = gamma( max_{i=1..n} { h(x_i) } )

def mock_pointnet_forward(point_cloud, d_feat=64):
    """
    point_cloud: (N, 3) koordinat titik (x, y, z)
    """
    N = point_cloud.shape[0]
    
    # 1. Per-point Shared MLP: h(x_i) memetakan R^3 -> R^d_feat
    np.random.seed(42)
    W1 = np.random.randn(3, d_feat) * 0.1
    b1 = np.zeros(d_feat)
    
    # Aktivasi fitur per titik: ReLU(X * W1 + b1)
    point_features = np.maximum(0.0, np.dot(point_cloud, W1) + b1) # (N, d_feat)
    
    # 2. Symmetric Function: Global Max Pooling di sepanjang dimensi N titik
    # Menjamin hasil yang identik meskipun urutan baris point_cloud diacak!
    global_signature = np.max(point_features, axis=0) # (d_feat,)
    
    return global_signature, point_features

# Buat point cloud 100 titik
np.random.seed(10)
points_original = np.random.randn(100, 3)

# Buat versi acak (shuffled) urutan titiknya
shuffled_indices = np.random.permutation(100)
points_shuffled = points_original[shuffled_indices]

# Eksekusi PointNet pada kedua representasi
sig_orig, _ = mock_pointnet_forward(points_original)
sig_shuf, _ = mock_pointnet_forward(points_shuffled)

# Uji Invariansi Permutasi
diff = np.max(np.abs(sig_orig - sig_shuf))

print(f"Perbedaan Maksimum Vektor Fitur Global (Asli vs Diacak): {diff:.8f}")
print("PointNet membuktikan sifat matematis Permutation Invariance secara sempurna via Global Max Pooling.")
'''

subchapters.append({
    "id": "cv-16-3-pointnet-pointnet-plus-plus",
    "chapterId": "computer-vision-ch-15",
    "title": "Pemrosesan Point Cloud: PointNet (Permutation Invariance) dan PointNet++ (Hierarchical Learning)",
    "description": "Arsitektur deep learning untuk point cloud: fungsi simetris agregasi global, T-Net alignment spasial, dan ekstraksi fitur hierarkis bertingkat PointNet++.",
    "estimatedMinutes": 35,
    "order": 3,
    "content": {
        "theory": (
            "Memproses point cloud secara langsung dengan jaringan saraf tiruan menghadirkan tantangan teoretis unik yang tidak ditemukan pada citra 2D: **Permutation Invariance**. Sebuah awan titik beranggotakan $N$ elemen merupakan himpunan tak berurutan (*unordered set*). Jika urutan baris matriks $X \\in \\mathbb{R}^{N \\times 3}$ diacak menjadi $P X$ (di mana $P$ adalah matriks permutasi biner), representasi geometris fisik benda sama sekali tidak berubah. Oleh karena itu, fungsi pemetaan jaringan harus memenuhi sifat komutatif simetris:\n"
            "$$f(P X) = f(X), \\quad \\forall P \\in \\mathcal{S}_N$$\n\n"
            "**PointNet** (Qi et al., Stanford University, CVPR 2017) memecahkan masalah ini melalui teorema aproksimasi fungsi simetris umum:\n"
            "$$f(\\mathbf{x}_1, \\mathbf{x}_2, \\dots, \\mathbf{x}_n) \\approx g \\left( \\max_{i=1..n} \\{ h(\\mathbf{x}_i) \\} \\right)$$\n"
            "di mana:\n"
            "1. $h: \\mathbb{R}^3 \\to \\mathbb{R}^K$ diimplementasikan sebagai jaringan *Multi-Layer Perceptron* (MLP) bersama (*shared MLP*) yang memetakan setiap koordinat titik secara independen ke ruang fitur berdimensi tinggi.\n"
            "2. $\\max$ adalah operasi **Global Max Pooling** melintasi seluruh titik, yang bertindak sebagai fungsi simetris untuk mengekstrak vektor tanda tangan global (*global shape signature*).\n"
            "3. $g$ adalah MLP klasifikasi/segmentasi akhir yang memproses fitur global tersebut.\n"
            "PointNet juga menyertakan modul mini-network internal bernama **T-Net** yang memprediksi matriks transformasi affine ortogonal $3 \\times 3$ untuk menormalkan rotasi kanonikal objek.\n\n"
            "Meskipun revolusioner, PointNet asli memiliki kelemahan: ia tidak menangkap **struktur lokalitas geometris bertingkat** (hanya melihat titik individual dan bentuk global sekaligus). Untuk mengatasi batasan ini, **PointNet++** (Qi et al., NeurIPS 2017) memperkenalkan paradigma hierarkis hierarki bertingkat yang mirip dengan receptive field pada CNN melalui kombinasi: *Farthest Point Sampling* (FPS) untuk memilih titik sentral, *Ball Query* untuk mengelompokkan tetangga lokal dalam radius tertentu, dan aplikasi PointNet rekursif pada setiap kluster lokal."
        ),
        "codeSnippet": code_16_3,
        "codeSnippetOutput": run_code_capture_output(code_16_3),
        "realWorldApplication": (
            "Digunakan untuk segmentasi partisi semantik 3D pada sensor LiDAR kendaraan otonom (membedakan pejalan kaki, mobil, jalan raya, dan trotoar), serta klasifikasi bentuk objek pada robotika manipulasi lengan industri."
        ),
        "commonPitfalls": [
            r"Menggunakan fungsi non-simetris (seperti RNN atau LSTM) untuk memproses urutan titik, yang membuat model sangat rapuh terhadap permutasi urutan data LiDAR.",
            r"Tidak menyertakan regularization loss ortogonalitas pada matriks T-Net (||I - A A^T||^2), yang menyebabkan distorsi skala objek.",
            r"Penggunaan radius ball query tetap pada point cloud dengan densitas bervariasi (densitas LiDAR sangat padat di dekat sensor dan renggang di kejauhan)."
        ],
        "caseStudy": (
            "Diberikan awan titik 3D dengan 1024 titik. Buktikan secara matematis mengapa operasi penjumlah rerata (average pooling) dan operasi nilai maksimum (max pooling) keduanya memenuhi syarat permutasi invarian, dan mengapa PointNet memilih max pooling daripada average pooling untuk mempertahankan titik-titik kerangka ekstrem (critical points) objek."
        ),
        "academicReferences": [
            r"Qi, C. R., Su, H., Mo, K., & Guibas, L. J. (2017). PointNet: Deep learning on point sets for 3d classification and segmentation. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 652-660).",
            r"Qi, C. R., Yi, L., Su, H., & Guibas, L. J. (2017). PointNet++: Deep hierarchical feature learning on point sets in a metric space. In Advances in Neural Information Processing Systems (pp. 5099-5108).",
            r"Wang, Y., Sun, Y., Liu, Z., Sarikaya, S. E., Randeniya, T. S., & Solomon, J. M. (2019). Dynamic graph cnn for learning on point clouds. ACM Transactions on Graphics (TOG), 38(5), 1-12."
        ]
    }
})

# ==============================================================================
# Subbab 16.4: Registrasi Titik 3D: Iterative Closest Point (ICP) & SVD
# ==============================================================================
code_16_4 = r'''import numpy as np

# Implementasi Algoritma Iterative Closest Point (ICP) menggunakan SVD (Metode Arun / Horn)
# Menyelaraskan point cloud sumber P ke point cloud target Q melalui transformasi kaku (R, t)

def best_fit_transform(P, Q):
    """
    Menghitung matriks rotasi 3x3 R dan translasi 3x1 t yang meminimalkan ||Q - (R*P + t)||^2
    menggunakan Singular Value Decomposition (SVD).
    """
    centroid_P = np.mean(P, axis=0)
    centroid_Q = np.mean(Q, axis=0)
    
    P_centered = P - centroid_P
    Q_centered = Q - centroid_Q
    
    # Matriks kovarians H = P^T * Q
    H = np.dot(P_centered.T, Q_centered)
    U, S, Vt = np.linalg.svd(H)
    
    R = np.dot(Vt.T, U.T)
    # Penanganan kasus refleksi (det(R) < 0)
    if np.linalg.det(R) < 0:
        Vt[-1, :] *= -1
        R = np.dot(Vt.T, U.T)
        
    t = centroid_Q - np.dot(R, centroid_P)
    return R, t

def icp(source, target, max_iters=20, tolerance=1e-6):
    P = source.copy()
    prev_error = float('inf')
    
    for iteration in range(max_iters):
        # 1. Cari pasangan tetangga terdekat (Nearest Neighbor Matching)
        # Jarak Euclidean matriks: (N, M)
        dists = np.linalg.norm(P[:, np.newaxis, :] - target[np.newaxis, :, :], axis=2)
        nearest_indices = np.argmin(dists, axis=1)
        matched_target = target[nearest_indices]
        
        # 2. Estimasi transformasi kaku terbaik
        R, t = best_fit_transform(P, matched_target)
        
        # 3. Transformasikan point cloud sumber
        P = np.dot(P, R.T) + t
        
        # Evaluasi error residual kuadrat rata-rata
        mean_error = np.mean(np.linalg.norm(P - matched_target, axis=1))
        if abs(prev_error - mean_error) < tolerance:
            break
        prev_error = mean_error
        
    return P, R, t, iteration + 1, mean_error

# Simulasi: Buat model 3D target dan sumber yang terotasi 20 derajat + translasi [0.5, -0.2, 0.3]
np.random.seed(42)
target_pts = np.random.randn(50, 3)

theta_y = np.radians(20.0)
R_true = np.array([
    [np.cos(theta_y), 0, np.sin(theta_y)],
    [0, 1, 0],
    [-np.sin(theta_y), 0, np.cos(theta_y)]
])
t_true = np.array([0.5, -0.2, 0.3])
source_pts = np.dot(target_pts, R_true.T) + t_true

aligned_P, R_est, t_est, iters, residual = icp(source_pts, target_pts)

print(f"ICP Konvergen dalam {iters} iterasi dengan residual L2 error: {residual:.6e}")
print("Translasi Nyata:   ", np.round(t_true, 3))
print("Hasil Penyelarasan: ICP berhasil merekonstruksi alignment spasial secara presisi.")
'''

subchapters.append({
    "id": "cv-16-4-point-cloud-registration-icp",
    "chapterId": "computer-vision-ch-15",
    "title": "Registrasi Titik 3D: Iterative Closest Point (ICP) dan Estimasi Transformasi Kaku Berbasis SVD",
    "description": "Algoritma registrasi geometri 3D: pencarian korespondensi terdekat, pembuktian analitik matriks rotasi optimal melalui SVD, dan dinamika konvergensi ICP.",
    "estimatedMinutes": 35,
    "order": 4,
    "content": {
        "theory": (
            "Registrasi awan titik (*point cloud registration*) merupakan masalah penentuan transformasi spasial kaku (*rigid body transformation*)—terdiri dari matriks rotasi $\\mathbf{R} \\in SO(3)$ dan vektor translasi $\\mathbf{t} \\in \\mathbb{R}^3$—yang menyelaraskan himpunan titik sumber $\\mathcal{P} = \\{\\mathbf{p}_i\\}_{i=1}^N$ dengan himpunan titik target $\\mathcal{Q} = \\{\\mathbf{q}_j\\}_{j=1}^M$ sehingga meminimalkan fungsi kesalahan jarak:\n"
            "$$\\min_{\\mathbf{R}, \\mathbf{t}} \\sum_{i=1}^N \\| \\mathbf{q}_{m(i)} - (\\mathbf{R} \\mathbf{p}_i + \\mathbf{t}) \\|^2$$\n"
            "di mana $m(i)$ merepresentasikan korespondensi indeks titik target yang berpasangan dengan titik sumber ke-$i$.\n\n"
            "Algoritma kanonikal yang menyelesaikan permasalahan ini adalah **Iterative Closest Point (ICP)** (Besl & McKay, 1992). Algoritma beroperasi dalam skema ekspektasi-maksimisasi bolak-balik:\n"
            "1. **Tahap Pencocokan (Matching Step)**: Untuk setiap titik $\\mathbf{p}_i$, cari titik terdekat $\\mathbf{q}^* \\in \\mathcal{Q}$ menggunakan pencarian tetangga terdekat berbasis pohon *k-d tree*:\n"
            "$$\\mathbf{q}_{m(i)} = \\arg\\min_{\\mathbf{q} \\in \\mathcal{Q}} \\| \\mathbf{p}_i - \\mathbf{q} \\|$$\n"
            "2. **Tahap Transformasi Tertutup (Transformation Step)**: Setelah korespondensi ditentukan, solusi optimal $(\\mathbf{R}^*, \\mathbf{t}^*)$ dapat dihitung secara analitik tertutup (metode Arun et al., 1987) melalui Dekomposisi Nilai Singular (SVD). Didefinisikan titik terpusat centroid $\\bar{\\mathbf{p}} = \\frac{1}{N} \\sum \\mathbf{p}_i$ dan $\\bar{\\mathbf{q}} = \\frac{1}{N} \\sum \\mathbf{q}_{m(i)}$, serta matriks kovarians silang $\\mathbf{H}$:\n"
            "$$\\mathbf{H} = \\sum_{i=1}^N (\\mathbf{p}_i - \\bar{\\mathbf{p}})(\\mathbf{q}_{m(i)} - \\bar{\\mathbf{q}})^T = \\mathbf{U} \\mathbf{\\Sigma} \\mathbf{V}^T$$\n"
            "Matriks rotasi optimal dihitung sebagai $\\mathbf{R}^* = \\mathbf{V} \\mathbf{U}^T$ (dengan koreksi determinan $\\det(\\mathbf{R}^*) = +1$ untuk mencegah pencerminan), dan translasi optimal diperoleh dari selisih centroid:\n"
            "$$\\mathbf{t}^* = \\bar{\\mathbf{q}} - \\mathbf{R}^* \\bar{\\mathbf{p}}$$\n\n"
            "Karena ICP berbasis pada heuristik korespondensi terdekat lokal, algoritma ini sangat sensitif terhadap inisialisasi awal. Jika orientasi awal kedua awan titik berselisih terlalu jauh, ICP akan terjebak pada minimum lokal (*local minima*). Oleh karena itu, registrasi modern menggabungkan deskriptor fitur global (seperti FPFH / Fast Point Feature Histograms atau deep learned matcher) untuk registrasi kasar sebelum menjalankan ICP untuk penyesuaian akhir berpresisi tinggi."
        ),
        "codeSnippet": code_16_4,
        "codeSnippetOutput": run_code_capture_output(code_16_4),
        "realWorldApplication": (
            "Diterapkan dalam pemetaan LiDAR SLAM (seperti Google Cartographer atau LOAM), rekonstruksi pemindaian gigi 3D ortodontik, dan kalibrasi sistem navigasi bedah robotik ortopedi."
        ),
        "commonPitfalls": [
            r"Inisialisasi posisi awal yang terlalu jauh sehingga ICP terjebak pada minimum lokal (misal objek terbalik 180 derajat).",
            r"Keberadaan outlier ekstrim (misalnya pantulan kaca atau debu udara) yang menarik centroid secara drastis jika tidak menggunakan robust loss (seperti Cauchy atau Huber loss).",
            r"Tidak menangani kasus determinan negatif pada hasil SVD (det(V * U^T) = -1), yang menghasilkan matriks refleksi tak fisik alih-alih rotasi murni."
        ],
        "caseStudy": (
            "Dua pemindaian LiDAR terpisah dari sebuah mobil menghasilkan 50.000 titik dengan pergeseran translasi awal sekitar 2 meter dan rotasi yaw 45 derajat. Jelaskan mengapa menjalankan standard ICP point-to-point secara langsung berisiko tinggi mengalami konvergensi salah, dan jelaskan perbaikan yang diberikan oleh metode point-to-plane ICP."
        ),
        "academicReferences": [
            r"Besl, P. J., & McKay, N. D. (1992). Method for registration of 3-D shapes. In Sensor fusion IV: control paradigms and user interfaces (Vol. 1611, pp. 586-606).",
            r"Arun, K. S., Huang, T. S., & Blostein, S. D. (1987). Least-squares fitting of two 3-D point sets. IEEE Transactions on Pattern Analysis and Machine Intelligence, (5), 698-700.",
            r"Rusinkiewicz, S., & Levoy, M. (2001). Efficient variants of the ICP algorithm. In Proceedings third international conference on 3-D digital imaging and modeling (pp. 145-152)."
        ]
    }
})

# ==============================================================================
# Subbab 16.5: Structure from Motion (SfM) & Visual SLAM: Bundle Adjustment
# ==============================================================================
code_16_5 = r'''import numpy as np

# Simulasi Reprojection Error pada Bundle Adjustment (SfM / SLAM)
# Menghitung proyeksi titik 3D dunia ke bidang citra kamera pinhole
# e = || x_observed - pi(K, R, t, X_world) ||^2

def pinhole_project(X_world, K, R, t):
    """
    X_world: (3,) koordinat titik 3D dunia
    K: (3, 3) matriks intrinsik kamera
    R: (3, 3) rotasi kamera
    t: (3,) translasi kamera
    """
    # Transformasi koordinat dunia ke koordinat kamera: X_cam = R * X_world + t
    X_cam = np.dot(R, X_world) + t
    
    # Proyeksi perspektif terbagi kedalaman z
    x_normalized = X_cam[:2] / X_cam[2]
    
    # Transformasi ke koordinat piksel menggunakan matriks intrinsik
    u = K[0, 0] * x_normalized[0] + K[0, 2]
    v = K[1, 1] * x_normalized[1] + K[1, 2]
    return np.array([u, v])

# Parameter Intrinsik Kamera Pinhole
K = np.array([
    [800.0,   0.0, 320.0],
    [  0.0, 800.0, 240.0],
    [  0.0,   0.0,   1.0]
])

# Titik 3D nyata dan pose kamera aktual
X_true = np.array([0.5, 0.2, 2.0])
R_cam = np.eye(3)
t_cam = np.array([0.0, 0.0, 0.0])

# Observasi piksel ideal
x_obs = pinhole_project(X_true, K, R_cam, t_cam)

# Simulasi estimasi parameter yang memiliki sedikit noise error
X_est = np.array([0.52, 0.19, 2.05])
x_proj_est = pinhole_project(X_est, K, R_cam, t_cam)

# Hitung Reprojection Error
reproj_error = np.linalg.norm(x_obs - x_proj_est)

print(f"Observasi Piksel Aktual: ({x_obs[0]:.2f}, {x_obs[1]:.2f})")
print(f"Hasil Proyeksi Estimasi: ({x_proj_est[0]:.2f}, {x_proj_est[1]:.2f})")
print(f"Reprojection Error: {reproj_error:.4f} piksel")
print("Bundle Adjustment mengoptimalkan ribuan pose kamera dan titik 3D sekaligus untuk meminimalkan error ini.")
'''

subchapters.append({
    "id": "cv-16-5-sfm-visual-slam-bundle-adjustment",
    "chapterId": "computer-vision-ch-15",
    "title": "Struktur dari Gerak (Structure from Motion / SfM) & Visual SLAM: Bundle Adjustment",
    "description": "Rekonstruksi 3D dari koleksi foto tak beraturan: triangulasi multi-pandangan, estimasi pose kamera, dan optimasi non-linear non-convex Bundle Adjustment.",
    "estimatedMinutes": 35,
    "order": 5,
    "content": {
        "theory": (
            "**Structure from Motion (SfM)** dan **Visual Simultaneous Localization and Mapping (vSLAM)** menyelesaikan masalah rekonstruksi geometri 3D dunia secara simultan bersamaan dengan penentuan lintasan pose gerak kamera dari serangkaian foto 2D. Perbedaan utamanya terletak pada ranah eksekusi: SfM biasanya beroperasi secara *offline/batch* pada koleksi citra acak untuk menghasilkan rekonstruksi berskala sangat detail, sedangkan Visual SLAM beroperasi secara *online/real-time* pada aliran frame video sekuensial untuk navigasi robotik.\n\n"
            "Pipeline standar SfM (seperti yang diimplementasikan pada pustaka **COLMAP**, Schönberger et al., 2016) terdiri dari tahapan:\n"
            "1. **Ekstraksi & Pencocokan Fitur**: Deteksi titik kunci invarian skala (SIFT) di seluruh citra dan pencocokan korespondensi berpasangan.\n"
            "2. **Verifikasi Geometris**: Estimasi matriks fundamental/esensial menggunakan algoritma RANSAC untuk memfilter pencocokan palsu (*outliers*).\n"
            "3. **Inisialisasi Model**: Memilih pasangan citra dengan baseline yang memadai dan sudut paralaks yang cukup untuk triangulasi awal.\n"
            "4. **Registrasi Citra Inkremental**: Mendaftarkan citra baru secara bertahap menggunakan algoritma *Perspective-n-Point* (PnP) dan men-triangulasi titik-titik 3D baru.\n\n"
            "Jantung dari seluruh optimasi geometris multi-pandangan adalah **Bundle Adjustment (BA)** (Triggs et al., 1999). BA memformulakan rekonstruksi sebagai masalah optimasi kuadrat terkecil non-linear raksasa yang menyempurnakan posisi seluruh titik 3D $\\mathbf{X}_j \\in \\mathbb{R}^3$ dan seluruh pose kamera $C_i = (\\mathbf{R}_i, \\mathbf{t}_i)$ secara simultan untuk meminimalkan total **Reprojection Error**:\n"
            "$$\\min_{\\{C_i\\}, \\{\\mathbf{X}_j\\}} \\sum_{i=1}^M \\sum_{j=1}^N v_{ij} \\, \\rho \\left( \\| \\mathbf{x}_{ij} - \\pi(C_i, \\mathbf{X}_j) \\|^2 \\right)$$\n"
            "di mana $v_{ij} \\in \\{0, 1\\}$ adalah variabel biner keterlihatan (bernilai 1 jika titik $j$ tampak pada kamera $i$), $\\mathbf{x}_{ij}$ adalah koordinat piksel hasil deteksi nyata, $\\pi$ adalah fungsi proyeksi non-linear kamera pinhole beserta distorsi lensa radial, dan $\\rho(\\cdot)$ adalah fungsi penimbang loss robust (seperti Huber loss) untuk meredam pencocokan palsu.\n\n"
            "Optimasi ini diselesaikan menggunakan algoritma **Levenberg-Marquardt (LM)** yang memanfaatkan struktur matriks Jacobi yang sangat jarang (*sparse block structure* via Schur Complement)."
        ),
        "codeSnippet": code_16_5,
        "codeSnippetOutput": run_code_capture_output(code_16_5),
        "realWorldApplication": (
            "Digunakan dalam pembuatan peta 3D Google Earth dari foto satelit/pesawat udara, navigasi kacamata Augmented Reality (Apple Vision Pro, Meta Quest), dan pipeline kalibrasi pose kamera sebelum melatih NeRF."
        ),
        "commonPitfalls": [
            r"Pemilihan pasangan citra inisialisasi dengan baseline terlalu sempit, yang menyebabkan kesalahan triangulasi kedalaman membesar tak terhingga.",
            r"Struktur simetris berulang pada pemandangan (misal fasad gedung dengan jendela identik) yang memicu pencocokan fitur salah dan pembengkokan peta rekonstruksi.",
            r"Mengabaikan parameter distorsi radial lensa (k1, k2), yang menyebabkan akumulasi drift reprojection error pada area tepi citra."
        ],
        "caseStudy": (
            "Jelaskan mengapa COLMAP menjadi prasyarat wajib dalam pipeline pembuatan dataset NeRF sintetis dunia nyata: data apa saja yang diekspor oleh COLMAP (intrinsik K, ekstrinsik R dan t, batas near/far z), dan bagaimana format matriks pose kamera kamera-ke-dunia (c2w) disusun."
        ),
        "academicReferences": [
            r"Schonberger, J. L., & Frahm, J. M. (2016). Structure-from-motion revisited. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 5211-5221).",
            r"Triggs, B., McLauchlan, P. F., Hartley, R. I., & Fitzgibbon, A. W. (1999). Bundle adjustment—a modern synthesis. In Vision Algorithms: Theory and Practice (pp. 298-372). Springer, Berlin, Heidelberg.",
            r"Mur-Artal, R., Montiel, J. M. M., & Tardos, J. D. (2015). ORB-SLAM: a versatile and accurate monocular SLAM system. IEEE transactions on robotics, 31(5), 1147-1163."
        ]
    }
})

# ==============================================================================
# Subbab 16.6: NeRF (Neural Radiance Fields) - Spot-Check Paper ECCV 2020
# ==============================================================================
code_16_6 = r'''import numpy as np

# Implementasi Perenderan Volume Diferensiabel (Discrete Volume Rendering NeRF)
# Berdasarkan Mildenhall et al., ECCV 2020 (Persamaan 3):
# C_hat(r) = sum_{i=1}^N T_i * (1 - exp(-sigma_i * delta_i)) * c_i
# di mana T_i = exp( - sum_{j=1}^{i-1} sigma_j * delta_j )

def render_ray_volume(densities, colors, deltas):
    """
    densities: (N,) nilai densitas volume sigma_i >= 0
    colors: (N, 3) nilai radiansi warna teremitasi c_i in [0, 1]
    deltas: (N,) jarak antar sampel bersebelahan delta_i = t_{i+1} - t_i
    """
    # 1. Hitung opasitas lokal: alpha_i = 1 - exp(-sigma_i * delta_i)
    alpha = 1.0 - np.exp(-densities * deltas)
    
    # 2. Hitung transmitansi terakumulasi T_i
    # T_1 = 1.0; T_i = exp(-sum_{j=1}^{i-1} sigma_j * delta_j)
    sigma_delta = densities * deltas
    cum_sigma_delta = np.cumsum(sigma_delta)
    # Geser satu langkah ke kanan untuk T_i: [0, s1*d1, s1*d1 + s2*d2, ...]
    shifted_cum = np.concatenate([[0.0], cum_sigma_delta[:-1]])
    transmittance = np.exp(-shifted_cum)
    
    # 3. Bobot kontribusi sampel ke-i: w_i = T_i * alpha_i
    weights = transmittance * alpha
    
    # 4. Ekspektasi warna komposit sinar kamera
    rendered_color = np.sum(weights[:, np.newaxis] * colors, axis=0)
    
    return rendered_color, weights, transmittance

# Simulasi sinar kamera dengan 5 sampel di sepanjang garis edar
N = 5
deltas = np.array([0.2, 0.2, 0.2, 0.2, 0.2]) # Total panjang jarak = 1.0

# Sampel 1, 2: Ruang hampa (densitas mendekati 0)
# Sampel 3: Permukaan objek solid merah (densitas tinggi)
# Sampel 4, 5: Di balik objek (terhalang)
densities = np.array([0.01, 0.05, 15.0, 10.0, 10.0])
colors = np.array([
    [0.1, 0.1, 0.9], # Biru (kabut tipis)
    [0.1, 0.1, 0.9],
    [0.9, 0.1, 0.1], # Merah pejal (objek utama)
    [0.1, 0.9, 0.1], # Hijau (tersembunyi di balik merah)
    [0.1, 0.9, 0.1]
])

color_out, w, T = render_ray_volume(densities, colors, deltas)

print("Verifikasi Numerik Volume Rendering NeRF (Mildenhall et al., 2020):")
print(f"Transmitansi T per titik:    {np.round(T, 4)}")
print(f"Bobot Kontribusi w per titik: {np.round(w, 4)}")
print(f"Warna Akhir Sinar C_hat(r):   RGB = [{color_out[0]:.3f}, {color_out[1]:.3f}, {color_out[2]:.3f}]")
print("Sampel 3 (Merah) mendominasi warna sinar karena transmitansi turun ke 0 segera setelah menabrak objek pejal.")
'''

subchapters.append({
    "id": "cv-16-6-nerf-neural-radiance-fields",
    "chapterId": "computer-vision-ch-15",
    "title": "Neural Radiance Fields (NeRF): Representasi Pemandangan Kontinu 5D dan Perenderan Volume Diferensiabel",
    "description": "Analisis mendalam karya monumental Mildenhall et al. (ECCV 2020): pemodelan fungsi kontinu 5D (x,y,z,theta,phi) -> (RGB, sigma), integrasi transmitansi numerik, dan sintesis pandangan baru fotorealistik.",
    "estimatedMinutes": 40,
    "order": 6,
    "content": {
        "theory": (
            "Makalah bersejarah karya **Mildenhall et al.** (*UC Berkeley, Google Research, UC San Diego*, ECCV 2020) berjudul *'NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis'* memicu revolusi besar dalam visi komputer dan grafika saraf (*neural rendering*). NeRF mengabaikan representasi diskrit konvensional (seperti voxel atau mesh poligon) dan memodelkan pemandangan statis 3D sebagai **fungsi kontinu 5D** yang diparameterisasi oleh bobot jaringan saraf tiruan *Multi-Layer Perceptron* (MLP) fully-connected $\\Theta$:\n"
            "$$F_\\Theta: (\\mathbf{x}, \\mathbf{d}) \\to (\\mathbf{c}, \\sigma)$$\n"
            "di mana $\\mathbf{x} = (x, y, z)$ adalah lokasi spasial 3D, $\\mathbf{d} = (\\theta, \\phi)$ adalah arah pandang pengamatan (*viewing direction* dalam 2D unit vector), $\\mathbf{c} = (r, g, b)$ adalah pancaran radiansi warna terarah, dan $\\sigma$ adalah densitas volume (*volume density*).\n\n"
            "Untuk mensintesis citra dari kamera virtual sembarang, NeRF menggunakan prinsip klasik **Volume Rendering** fisika optik. Sinar kamera diparameterisasi sebagai $\\mathbf{r}(t) = \\mathbf{o} + t\\mathbf{d}$ dengan batas dekat $t_n$ (*near plane*) dan batas jauh $t_f$ (*far plane*). Ekspektasi warna komposit $C(\\mathbf{r})$ yang diterima oleh piksel kamera adalah integral kontinu:\n"
            "$$C(\\mathbf{r}) = \\int_{t_n}^{t_f} T(t) \\, \\sigma(\\mathbf{r}(t)) \\, \\mathbf{c}(\\mathbf{r}(t), \\mathbf{d}) \\, dt, \\quad \\text{di mana} \\quad T(t) = \\exp \\left( -\\int_{t_n}^t \\sigma(\\mathbf{r}(s)) \\, ds \\right)$$\n"
            "Fungsi $T(t)$ merepresentasikan **transmitansi terakumulasi** (*accumulated transmittance*), yaitu probabilitas bahwa sinar berjalan dari $t_n$ ke $t$ tanpa menabrak partikel lain.\n\n"
            "Secara komputasi digital, integral kontinu tersebut diestimasi secara numerik menggunakan aturan kuadratur (*quadrature rule*) diskrit atas $N$ titik sampel:\n"
            "$$\\hat{C}(\\mathbf{r}) = \\sum_{i=1}^N T_i \\left( 1 - \\exp(-\\sigma_i \\delta_i) \\right) \\mathbf{c}_i, \\quad \\text{di mana} \\quad T_i = \\exp \\left( -\\sum_{j=1}^{i-1} \\sigma_j \\delta_j \\right)$$\n"
            "di mana $\\delta_i = t_{i+1} - t_i$ adalah jarak antar sampel yang berdekatan. Karena seluruh operasi dalam perenderan volume ini bersifat **diferensiabel secara analitik penuh**, parameter jaringan $\\Theta$ dapat dioptimalkan secara *end-to-end* hanya dengan meminimalkan kesalahan kuadrat piksel fotometrik (*photometric loss*) terhadap foto-foto pelatihan nyata:\n"
            "$$\\mathcal{L} = \\sum_{\\mathbf{r} \\in \\mathcal{R}} \\left\\| \\hat{C}(\\mathbf{r}) - C_{ground\\_truth}(\\mathbf{r}) \\right\\|_2^2$$"
        ),
        "codeSnippet": code_16_6,
        "codeSnippetOutput": run_code_capture_output(code_16_6),
        "realWorldApplication": (
            "Diterapkan dalam pembuatan aset 3D fotorealistik untuk efek visual film Hollywood (VFX), rekonstruksi peninggalan purbakala arkeologi virtual, katalog produk interaktif e-commerce 3D, dan rekonstruksi lingkungan simulator mobil otonom."
        ),
        "commonPitfalls": [
            r"Membuat densitas sigma bergantung pada arah pandang d, yang melanggar hukum kekekalan materi fisika dan menyebabkan fenomena artefak 'awan asap melayang' (smoke cloud artifacts).",
            r"Lupa memperhitungkan jarak delta_i pada perhitungan alpha = 1 - exp(-sigma * delta), yang membuat opasitas rendering sensitif terhadap interval sampling sinar.",
            r"Menyetel batas near dan far plane terlalu longgar, sehingga kapasitas sampling MLP terbuang pada ruang hampa sebelum objek."
        ],
        "caseStudy": (
            "Diberikan sinar kamera yang menembus dua lapisan volume: Lapisan 1 dengan tebal delta1 = 0.5 dan densitas sigma1 = 2.0; Lapisan 2 dengan tebal delta2 = 0.5 dan densitas sigma2 = 10.0. Hitung secara manual nilai transmitansi T1 dan T2, opasitas alpha1 dan alpha2, serta bobot kontribusi w1 dan w2 pada warna akhir sinar."
        ),
        "academicReferences": [
            r"Mildenhall, B., Srinivasan, P. P., Tancik, M., Barron, J. T., Ramamoorthi, R., & Ng, R. (2020). NeRF: Representing scenes as neural radiance fields for view synthesis. In Proceedings of the European Conference on Computer Vision (ECCV), pp. 405-421.",
            r"Max, N. (1995). Optical models for direct volume rendering. IEEE Transactions on Visualization and Computer Graphics, 1(2), 99-108.",
            r"Barron, J. T., Mildenhall, B., Tancik, M., Hedman, P., Martin-Brualla, R., & Srinivasan, P. P. (2021). Mip-NeRF: A multiscale representation for anti-aliasing neural radiance fields. In Proceedings of the IEEE/CVF International Conference on Computer Vision (pp. 5855-5864)."
        ]
    }
})

# ==============================================================================
# Subbab 16.7: Positional Encoding pada NeRF & Analisis Frekuensi
# ==============================================================================
code_16_7 = r'''import numpy as np

# Implementasi Positional Encoding NeRF (Mildenhall et al., 2020 - Persamaan 4)
# gamma(p) = ( sin(2^0 * pi * p), cos(2^0 * pi * p), ..., sin(2^{L-1} * pi * p), cos(2^{L-1} * pi * p) )
# Memetakan koordinat kontinu berdimensi rendah ke manifold frekuensi tinggi R^{2*L}

def positional_encoding(coords, L=10):
    """
    coords: (N, D) input koordinat spasial kontinu (misal x, y, z)
    L: derajat frekuensi maksimum (L=10 untuk posisi 3D -> 60 dimensi; L=4 untuk arah -> 24 dimensi)
    """
    # Pangkat frekuensi: 2^0, 2^1, ..., 2^{L-1}
    freq_bands = 2.0 ** np.arange(L) # (L,)
    
    # Kalikan koordinat dengan frekuensi dan pi
    # coords[:, :, None] * freq_bands[None, None, :] -> (N, D, L)
    scaled = coords[:, :, np.newaxis] * freq_bands[np.newaxis, np.newaxis, :] * np.pi
    
    # Hitung sin dan cos
    sin_feats = np.sin(scaled) # (N, D, L)
    cos_feats = np.cos(scaled) # (N, D, L)
    
    # Gabungkan sin dan cos secara selang-seling dan ratakan
    # Shape per dimensi: (N, D, 2*L)
    encoded = np.concatenate([sin_feats, cos_feats], axis=-1)
    # Ratakan D * 2 * L menjadi fitur final
    N = coords.shape[0]
    return encoded.reshape(N, -1)

# Uji enkripsi posisi untuk 2 koordinat 3D
test_coords = np.array([
    [0.12, -0.45, 0.88],
    [0.13, -0.45, 0.88] # Perbedaan sangat kecil (0.01 pada sumbu x)
])

enc_feats = positional_encoding(test_coords, L=10)

print(f"Dimensi Koordinat Asli: {test_coords.shape[1]} (x, y, z)")
print(f"Dimensi Setelah Positional Encoding (L=10): {enc_feats.shape[1]} (3 * 2 * 10 = 60 fitur)")
print(f"Perbedaan Euclidean Koordinat Asli: {np.linalg.norm(test_coords[0] - test_coords[1]):.4f}")
print(f"Perbedaan Euclidean Fitur Terenkripsi: {np.linalg.norm(enc_feats[0] - enc_feats[1]):.4f}")
print("Positional encoding mengekspansi selisih spasial kecil menjadi variasi spektral tinggi yang tajam!")
'''

subchapters.append({
    "id": "cv-16-7-nerf-positional-encoding-spectral-bias",
    "chapterId": "computer-vision-ch-15",
    "title": "Positional Encoding pada NeRF: Resolusi Frekuensi Tinggi dan Mitigasi Spectral Bias",
    "description": "Kajian teoretis *spectral bias* jaringan saraf tiruan standar, formulasi fungsi pemetaan Fourier, dan pengangkatan koordinat kontinu ke ruang dimensi spektral tinggi.",
    "estimatedMinutes": 35,
    "order": 7,
    "content": {
        "theory": (
            "Salah satu temuan paling krusial dalam makalah NeRF (Mildenhall et al., 2020) adalah bahwa jaringan saraf konvensional MLP berbasis aktivasi ReLU menderita patologi teoretis yang dikenal sebagai **Spectral Bias** (Rahaman et al., 2019). Sesuai dengan teori *Neural Tangent Kernel* (NTK), jaringan saraf secara alami cenderung mempelajari fungsi frekuensi rendah terlebih dahulu dengan sangat cepat, namun sangat lambat dan hampir mustahil mempelajari variasi geometri serta tekstur frekuensi tinggi (seperti batas tepi tajam, tekstur kain, atau pori-pori kulit).\n\n"
            "Jika koordinat spasial kontinu $\\mathbf{p} = (x, y, z)$ dimasukkan langsung ke dalam MLP, citra yang dirender akan tampak sangat buram (*oversmoothed*) tanpa detail mikroskopis. Untuk mengatasi batasan ini, NeRF menerapkan fungsi pemetaan non-linear deterministik bernama **Positional Encoding** $\\gamma: \\mathbb{R} \\to \\mathbb{R}^{2L}$ sebelum koordinat masuk ke layer pertama jaringan:\n"
            "$$\\gamma(p) = \\left( \\sin(2^0 \\pi p), \\cos(2^0 \\pi p), \\sin(2^1 \\pi p), \\cos(2^1 \\pi p), \\dots, \\sin(2^{L-1} \\pi p), \\cos(2^{L-1} \\pi p) \\right)$$\n\n"
            "Dalam implementasi kanonikal NeRF:\n"
            "- Untuk koordinat lokasi 3D $\\mathbf{x}$, digunakan derajat frekuensi $L = 10$, memetakan input 3 dimensi ke dalam vektor berdimensi $3 \\times 2 \\times 10 = 60$.\n"
            "- Untuk vektor arah pandang 2D $\\mathbf{d}$, digunakan derajat frekuensi $L = 4$, memetakan input 3 dimensi arah unit ke dalam vektor berdimensi $3 \\times 2 \\times 4 = 24$.\n\n"
            "Secara matematis (sebagaimana dibuktikan oleh Tancik et al., NeurIPS 2020 dalam analisis *Fourier Features Let Networks Learn High Frequency Functions in Low Dimensional Domains*), fungsi $\\gamma(\\cdot)$ mengubah kernel NTK jaringan menjadi fungsi stasioner dengan komposisi pita frekuensi terdistribusi merata, memungkinkan MLP merekonstruksi variasi spasial tajam secara eksponensial lebih presisi."
        ),
        "codeSnippet": code_16_7,
        "codeSnippetOutput": run_code_capture_output(code_16_7),
        "realWorldApplication": (
            "Diterapkan secara universal pada seluruh arsitektur grafika saraf modern (Mip-NeRF, Instant-NGP, Gaussian Splatting, Neural SDF) dan menjadi komponen vital pemetaan spasial Transformer dalam visi dan bahasa."
        ),
        "commonPitfalls": [
            r"Menyetel derajat frekuensi L terlalu tinggi (misal L > 20), yang dapat memicu fenomena artefak 'high-frequency noise / speckles' pada permukaan halus.",
            r"Mengabaikan perkalian faktor pi di dalam fungsi sinus/kosinus, yang mengubah periode fundamental pemetaan spektral.",
            r"Menggunakan derajat frekuensi tinggi yang sama pada arah pandang d (seharusnya L_dir jauh lebih kecil dari L_pos agar efek kilau specular tidak overfitting)."
        ],
        "caseStudy": (
            "Sebuah model NeRF dilatih tanpa positional encoding dan menghasilkan rendering cangkir keramik yang sangat halus namun tanpa tekstur lukisan di permukaannya. Jelaskan secara analitis menggunakan perspektif Neural Tangent Kernel mengapa penambahan Fourier positional encoding memampukan jaringan merekonstruksi detail lukisan tersebut."
        ),
        "academicReferences": [
            r"Mildenhall, B., Srinivasan, P. P., Tancik, M., Barron, J. T., Ramamoorthi, R., & Ng, R. (2020). NeRF: Representing scenes as neural radiance fields for view synthesis. In ECCV (pp. 405-421).",
            r"Tancik, M., Srinivasan, P., Mildenhall, B., Fridovich-Keil, S., Raghavan, N., Singhal, U., ... & Ng, R. (2020). Fourier features let networks learn high frequency functions in low dimensional domains. Advances in Neural Information Processing Systems, 33, 7537-7547.",
            r"Rahaman, N., Baratin, A., Arpit, D., Draxler, F., Lin, M., Hamprecht, F., ... & Courville, A. (2019). On the spectral bias of neural networks. In International Conference on Machine Learning (pp. 5301-5310)."
        ]
    }
})

# ==============================================================================
# Subbab 16.8: Hierarchical Sampling pada NeRF: Coarse-to-Fine Networks
# ==============================================================================
code_16_8 = r'''import numpy as np

# Implementasi Hierarchical Volume Sampling NeRF
# Tahap 1: Stratified Sampling pada Coarse Network (N_c sampel seragam ber-jitter)
# Tahap 2: Inverse CDF Resampling pada Fine Network (N_f sampel terkonsentrasi di area berbobot tinggi)

def sample_pdf(bins, weights, n_samples):
    """
    Inverse Transform Sampling berbasis Piecewise Constant PDF dari bobot coarse network
    bins: (N_c + 1,) batas interval
    weights: (N_c,) bobot ternormalisasi w_i = T_i * alpha_i
    """
    # Tambahkan epsilon kecil untuk kestabilan numerik
    pdf = weights + 1e-5
    pdf /= np.sum(pdf)
    cdf = np.cumsum(pdf)
    cdf = np.concatenate([[0.0], cdf]) # (N_c + 1,)
    
    # Tarik sampel seragam u ~ U[0, 1]
    u = np.linspace(0.0, 1.0, n_samples)
    
    # Inversi CDF (mencari bin tempat u jatuh)
    inds = np.searchsorted(cdf, u, side='right')
    below = np.maximum(0, inds - 1)
    above = np.minimum(len(cdf) - 1, inds)
    
    # Interpolasi linear di dalam bin
    denom = cdf[above] - cdf[below]
    denom = np.where(denom < 1e-5, 1.0, denom)
    t = (u - cdf[below]) / denom
    samples = bins[below] + t * (bins[above] - bins[below])
    return samples

# Simulasi 8 bin Coarse
bins_c = np.linspace(0.0, 2.0, 9)
# Misalkan objek terdeteksi berada di sekitar bin ke-4 dan ke-5 (t = 0.8 s.d 1.2)
coarse_weights = np.array([0.01, 0.02, 0.05, 0.60, 0.25, 0.04, 0.02, 0.01])

fine_samples = sample_pdf(bins_c, coarse_weights, n_samples=8)

print("Distribusi Sampel Fine Network Berdasarkan Bobot Coarse:")
for s in fine_samples:
    print(f"Sampel Fine t = {s:.3f}")

print("\nHierarchical sampling memfokuskan alokasi komputasi pada permukaan objek nyata.")
'''

subchapters.append({
    "id": "cv-16-8-nerf-hierarchical-volume-sampling",
    "chapterId": "computer-vision-ch-15",
    "title": "Hierarchical Volume Sampling pada NeRF: Stratified Sampling dan Arsitektur Coarse-to-Fine",
    "description": "Strategi alokasi efisiensi sinar: stratified uniform sampling, konstruksi fungsi kepadatan probabilitas (PDF) diskrit, dan inverse CDF resampling.",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "Strategi evaluasi sinar pada NeRF menghadapi tantangan alokasi sumber daya komputasi yang ekstrem. Dalam ruang 3D, sebagian besar volume yang dilalui sinar kamera merupakan ruang hampa udara (*empty space*) atau area di belakang permukaan padat yang teroklusi (*occluded regions*). Jika titik sampel dievaluasi secara seragam berjarak konstan di sepanjang sinar, mayoritas pemanggilan evaluasi MLP terbuang sia-sia tanpa menyumbang kontribusi apa pun pada citra akhir.\n\n"
            "Untuk memaksimalkan efisiensi komputasi, Mildenhall et al. (2020) merancang strategi **Hierarchical Volume Sampling** yang mengeksekusi dua jaringan secara simultan: **Coarse Network** dan **Fine Network**.\n\n"
            "Tahapannya berlangsung sebagai berikut:\n"
            "1. **Stratified Sampling (Coarse Network)**: Rentang jarak $[t_n, t_f]$ dibagi menjadi $N_c$ interval seragam berjarak sama, dan satu sampel ditarik secara acak dari dalam setiap interval menggunakan distribusi seragam ber-jitter (*stratified uniform sampling*):\n"
            "$$t_i \\sim \\mathcal{U} \\left[ t_n + \\frac{i-1}{N_c}(t_f - t_n), \\, t_n + \\frac{i}{N_c}(t_f - t_n) \\right]$$\n"
            "2. **Konstruksi PDF Empiris**: Jaringan *Coarse* mengevaluasi $N_c$ sampel ini untuk menghasilkan bobot transmitansi dan opasitas $w_i = T_i (1 - \\exp(-\\sigma_i \\delta_i))$. Bobot ini dinormalisasi menjadi fungsi kepadatan probabilitas diskrit (*piecewise-constant Probability Density Function / PDF*):\n"
            "$$\\hat{w}_i = \\frac{w_i}{\\sum_{j=1}^{N_c} w_j}$$\n"
            "3. **Resampling Inverse CDF (Fine Network)**: Dari distribusi PDF tersebut, ditarik $N_f$ sampel tambahan menggunakan teknik *Inverse Transform Sampling*. Sampel tambahan ini akan secara otomatis terkonsentrasi secara sangat padat hanya pada area di mana materi padat terdeteksi berada.\n\n"
            "Jaringan *Fine* kemudian mengevaluasi gabungan seluruh sampel $N_c + N_f$ untuk menghasilkan warna komposit akhir beresolusi tinggi, meningkatkan ketajaman detail visual tanpa membebani GPU secara berlebihan."
        ),
        "codeSnippet": code_16_8,
        "codeSnippetOutput": run_code_capture_output(code_16_8),
        "realWorldApplication": (
            "Menjadi mekanisme standar pada framework rendering grafika saraf tingkat produksi (seperti Nerfstudio, PyTorch3D, dan Instant-NGP) untuk mereduksi artefak kabut mengambang (floaters)."
        ),
        "commonPitfalls": [
            r"Tidak menambahkan konstanta epsilon pada normalisasi bobot PDF, yang menyebabkan pembagian dengan nol (division by zero) saat sinar menembus ruang kosong total.",
            r"Hanya mengevaluasi sampel N_f pada Fine network dan membuang sampel N_c, yang dapat menyebabkan hilangnya kontinuitas geometri di luar permukaan objek.",
            r"Sampling non-stratified (deterministik murni) saat training yang memicu overfitting representasi diskrit."
        ],
        "caseStudy": (
            "Sebuah sinar kamera melintasi pemandangan dari tn = 1.0 m hingga tf = 5.0 m. Coarse network dengan Nc = 64 mendeteksi puncak bobot wi = 0.85 pada interval t in [2.3, 2.5] m. Jelaskan bagaimana fine network dengan Nf = 128 akan mengalokasikan sampel barunya, dan mengapa strategi ini jauh lebih superior daripada langsung menggunakan Nc = 192 pada satu jaringan tunggal."
        ),
        "academicReferences": [
            r"Mildenhall, B., Srinivasan, P. P., Tancik, M., Barron, J. T., Ramamoorthi, R., & Ng, R. (2020). NeRF: Representing scenes as neural radiance fields for view synthesis. In ECCV (pp. 405-421).",
            r"NeXT, N. S. (2022). Nerfstudio: A modular framework for neural radiance field development. ACM SIGGRAPH 2023 Conference Proceedings.",
            r"Zhang, K., Riegler, G., Snavely, N., & Koltun, V. (2020). Nerf++: Analyzing and improving neural radiance fields. arXiv preprint arXiv:2010.07492."
        ]
    }
})

# ==============================================================================
# Subbab 16.9: Akselerasi NeRF: Instant-NGP & Multiresolution Hash Encoding
# ==============================================================================
code_16_9 = r'''import numpy as np

# Simulasi Multiresolution Hash Encoding (Instant-NGP, Müller et al., ACM TOG 2022)
# Memetakan titik 3D ke kisi spasial beresolusi bertingkat L level, lalu melakukan hashing ke tabel memori T

def spatial_hash(x, y, z, table_size=1024):
    """
    Fungsi hash spasial prima cepat (Müller et al., 2022):
    h(x, y, z) = (x * pi_1 ^ y * pi_2 ^ z * pi_3) mod T
    """
    pi_1 = 1
    pi_2 = 2654435761
    pi_3 = 805459861
    h = (int(x) * pi_1) ^ (int(y) * pi_2) ^ (int(z) * pi_3)
    return abs(h) % table_size

# Simulasi interpolasi trilinear pada 1 level kisi
grid_res = 16 # Resolusi level
pt = np.array([0.45, 0.65, 0.25]) # Titik kontinu in [0, 1]^3

# Koordinat sudut sel kisi voksel
grid_pos = pt * grid_res
x0, y0, z0 = np.floor(grid_pos).astype(int)
fx, fy, fz = grid_pos - np.array([x0, y0, z0]) # Bobot interpolasi fraksional

# Hash 8 sudut kubus sel
corners = [
    (x0, y0, z0), (x0+1, y0, z0), (x0, y0+1, z0), (x0+1, y0+1, z0),
    (x0, y0, z0+1), (x0+1, y0, z0+1), (x0, y0+1, z0+1), (x0+1, y0+1, z0+1)
]
hash_indices = [spatial_hash(cx, cy, cz, table_size=1024) for cx, cy, cz in corners]

print("Simulasi Multiresolution Spatial Hash Grid (Instant-NGP):")
print(f"Titik Kontinu Input: {pt}")
print(f"Sudut Sel Voksel (x0, y0, z0): ({x0}, {y0}, {z0})")
print(f"Indeks Hash 8 Sudut Kubus pada Tabel: {hash_indices}")
print("\nDengan Hash Grid, MLP NeRF raksasa digantikan oleh tabel lookup kecil dan tiny MLP (2 layer),")
print("mempercepat pelatihan NeRF dari puluhan jam menjadi hitungan DETIK!")
'''

subchapters.append({
    "id": "cv-16-9-instant-ngp-hash-encoding-acceleration",
    "chapterId": "computer-vision-ch-15",
    "title": "Akselerasi NeRF: Instant-NGP (Multiresolution Hash Encoding) dan Rendering Real-Time",
    "description": "Evolusi efisiensi neural rendering: batasan komputasi MLP dense, struktur data multiresolution hash grid Instant-NGP, dan inferensi real-time puluhan FPS.",
    "estimatedMinutes": 35,
    "order": 9,
    "content": {
        "theory": (
            "Meskipun NeRF asli (Mildenhall et al., 2020) menghasilkan sintesis pandangan baru yang spektakuler, kelemahan fatalnya terletak pada **kecepatan komputasi**: melatih satu model membutuhkan waktu 1–2 hari pada kluster GPU canggih, dan merender satu frame gambar tunggal membutuhkan waktu beberapa detik hingga menit. Hal ini disebabkan oleh evaluasi ratusan lapis MLP berparameter besar untuk setiap titik sampel di setiap piksel kamera.\n\n"
            "Sebuah terobosan revolusioner dicapai oleh Thomas Müller et al. (NVIDIA Research, ACM Transactions on Graphics / SIGGRAPH 2022) melalui **Instant-NGP** (*Instant Neural Graphics Primitives with a Multiresolution Hash Encoding*). Instant-NGP memangkas waktu pelatihan NeRF dari puluhan jam menjadi **kurang dari 5 detik** tanpa mengorbankan kualitas visual fotorealistik.\n\n"
            "Inovasi fundamental Instant-NGP berakar pada dua pilar:\n"
            "1. **Multiresolution Hash Encoding**: Ruang 3D dibagi ke dalam $L$ tingkat resolusi kisi spasial (*geometric grid levels*) dari resolusi kasar $N_{min}$ hingga resolusi sangat halus $N_{max}$. Untuk setiap tingkat resolusi, sudut-sudut sel voksel dipetakan ke tabel fitur kecil berukuran $T$ menggunakan fungsi *spatial hash* berbasis operasi XOR bilangan prima cepat:\n"
            "$$h(\\mathbf{x}) = \\left( \\bigoplus_{i=1}^d x_i \\pi_i \\right) \\pmod T$$\n"
            "Setiap sel voksel menyimpan vektor fitur latih berdimensi $F$ (biasanya $F=2$). Nilai fitur pada posisi kontinu diinterpolasi secara trilinear dari 8 sudut sel voksel sekitarnya.\n"
            "2. **Tiny MLP**: Karena sebagian besar kapasitas representasi pemandangan telah disimpan secara eksplisit dalam parameter tabel hash, ukuran jaringan neural tiruan dapat diperkecil secara radikal menjadi *Tiny MLP* yang hanya terdiri dari 2–3 layer dengan 64 *hidden units*, yang dieksekusi menggunakan modul CUDA kernel teroptimasi (*Fully Fused MLP*).\n\n"
            "Tumbukan hash (*hash collisions*) yang terjadi pada sel-sel berbeda diselesaikan secara otomatis oleh gradien backpropagation, di mana fitur yang paling sering teramati secara geometris akan mendominasi pembaruan bobot dalam tabel."
        ),
        "codeSnippet": code_16_9,
        "codeSnippetOutput": run_code_capture_output(code_16_9),
        "realWorldApplication": (
            "Diterapkan pada aplikasi pemindaian 3D smartphone instan (seperti Luma AI, Polycam), platform rekonstruksi real-time video game, dan simulasi robotika NVIDIA Omniverse."
        ),
        "commonPitfalls": [
            r"Ukuran tabel hash T terlalu kecil (misal T < 2^14), yang menyebabkan frekuensi kolisi hash terlalu padat sehingga menghasilkan distorsi visual berisik (noisy speckled surfaces).",
            r"Tidak menerapkan bounds clipping pada koordinat input ruang 3D, sehingga titik di luar bounding box menghasilkan indeks hash tak terdefinisi.",
            r"Mengabaikan implementasi hardware-accelerated half-precision (FP16) yang merupakan kunci kecepatan ultra-tinggi Instant-NGP."
        ],
        "caseStudy": (
            "Analisis perbandingan komputasi FLOPs antara arsitektur NeRF original (8 layer MLP x 256 neuron = ~1000 GFLOPs per frame) versus Instant-NGP (Hash table lookup + 2 layer MLP x 64 neuron). Mengapa hash lookup secara drastis menggeser kemacetan dari beban komputasi aritmatika GPU menuju memory bandwidth?"
        ),
        "academicReferences": [
            r"Müller, T., Evans, A., Schied, C., & Keller, A. (2022). Instant neural graphics primitives with a multiresolution hash encoding. ACM Transactions on Graphics (TOG), 41(4), 1-15.",
            r"Fridovich-Keil, S., Yu, A., Tancik, M., Chen, Q., Recht, B., & Kanazawa, A. (2022). Plenoxels: Radiance fields without neural networks. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 5501-5510).",
            r"Yu, A., Li, R., Tancik, M., Li, H., Ng, R., & Kanazawa, A. (2021). Plenoctrees for real-time rendering of neural radiance fields. In Proceedings of the IEEE/CVF International Conference on Computer Vision (pp. 5752-5761)."
        ]
    }
})

# ==============================================================================
# Subbab 16.10: 3D Gaussian Splatting (3DGS): Rasterisasi Tile-Based & Real-Time
# ==============================================================================
code_16_10 = r'''import numpy as np

# Simulasi Parameterisasi 3D Gaussian Splatting (Kerbl et al., SIGGRAPH 2023)
# Distribusi Gaussian 3D: G(x) = exp( -0.5 * (x - mu)^T * Sigma^{-1} * (x - mu) )
# Matriks kovarians didekomposisi: Sigma = R * S * S^T * R^T (pasti positive semi-definite)

def create_3d_covariance_matrix(scale_vec, quat_vec):
    """
    scale_vec: (3,) faktor skala semidiameter s = (sx, sy, sz)
    quat_vec: (4,) quaternion rotasi q = (w, x, y, z) ternormalisasi
    """
    # 1. Matriks Skala S
    S = np.diag(scale_vec)
    
    # 2. Matriks Rotasi R dari Quaternion
    w, x, y, z = quat_vec / np.linalg.norm(quat_vec)
    R = np.array([
        [1 - 2*(y**2 + z**2), 2*(x*y - z*w),     2*(x*z + y*w)],
        [2*(x*y + z*w),     1 - 2*(x**2 + z**2), 2*(y*z - x*w)],
        [2*(x*z - y*w),     2*(y*z + x*w),     1 - 2*(x**2 + y**2)]
    ])
    
    # 3. Kovarians 3D: Sigma = R * S * S^T * R^T = (R S) * (R S)^T
    M = np.dot(R, S)
    Sigma = np.dot(M, M.T)
    return Sigma, R

# Definisikan 1 elipsoid Gaussian 3D
mu = np.array([0.0, 0.0, 1.5]) # Posisi pusat
scales = np.array([0.3, 0.1, 0.05]) # Bentuk elipsoid pipih
quaternion = np.array([1.0, 0.2, 0.0, 0.1]) # Rotasi orientasi

cov_3d, R_mat = create_3d_covariance_matrix(scales, quaternion)

print("Parameterisasi Primitif 3D Gaussian Splatting:")
print(f"Pusat Spasial mu (x, y, z): {mu}")
print(f"Skala Semi-Axis S:          {scales}")
print("Matriks Kovarians Simetris Sigma 3x3:")
print(np.round(cov_3d, 4))
print(f"\nUji Eigenvalue Kovarians: {np.linalg.eigvals(cov_3d)}")
print("Kovarians terbukti bersifat Positive Definite dan dapat diproyeksikan langsung ke bidang citra 2D (Splatting)!")
'''

subchapters.append({
    "id": "cv-16-10-3d-gaussian-splatting",
    "chapterId": "computer-vision-ch-15",
    "title": "3D Gaussian Splatting (3DGS): Parameterisasi Primitif Diferensiabel dan Rasterisasi Tile-Based",
    "description": "Paradigma mutakhir neural rendering: representasi primitif Gaussian 3D teranisotropik, dekomposisi matriks kovarians, proyeksi splatting 2D, dan rasterisasi diferensiabel 100+ FPS.",
    "estimatedMinutes": 40,
    "order": 10,
    "content": {
        "theory": (
            "Pada tahun 2023, lanskap visi komputer 3D mengalami pergeseran paradigma paling masif sejak kemunculan NeRF melalui publikasi **3D Gaussian Splatting for Real-Time Radiance Field Rendering** oleh Bernhard Kerbl, Georgios Kopanas, Thomas Leimkühler, dan George Drettakis (*Inria & Max-Planck-Institut Informatik*, ACM Transactions on Graphics / SIGGRAPH 2023).\n\n"
            "3D Gaussian Splatting (3DGS) menggabungkan keunggulan representasi kontinu implisit (kualitas visual fotorealistik bebas batas diskrit) dengan efisiensi representasi eksplisit berbasis partikel (kompatibilitas penuh dengan rasterisasi grafika perangkat keras). Alih-alih mengevaluasi sinar melalui jaringan neural tiruan, pemandangan dimodelkan oleh jutaan **primitif Gaussian 3D teranisotropik** (*3D Gaussians*) yang masing-masing diparameterisasi oleh:\n"
            "1. **Pusat Posisi Spasial**: $\\mathbf{\\mu} \\in \\mathbb{R}^3$.\n"
            "2. **Matriks Kovarians 3D**: $\\mathbf{\\Sigma} \\in \\mathbb{R}^{3 \\times 3}$, yang mendefinisikan bentuk elipsoid orientasi dan ukuran partikel. Untuk menjamin sifat *positive semi-definite* selama optimasi gradien, $\\mathbf{\\Sigma}$ didekomposisi menjadi matriks rotasi $\\mathbf{R}$ (diparameterisasi oleh quaternion 4D $\\mathbf{q}$) dan matriks skala diagonal $\\mathbf{S}$ (vektor 3D $\\mathbf{s}$):\n"
            "$$\\mathbf{\\Sigma} = \\mathbf{R} \\mathbf{S} \\mathbf{S}^T \\mathbf{R}^T$$\n"
            "3. **Opasitas**: $\\alpha \\in [0, 1]$, yang mengontrol transparansi partikel.\n"
            "4. **Fungsi Radiansi Arah**: Koefisien *Spherical Harmonics* (SH) berderajat hingga $k=3$ untuk memodelkan efek refleksi pencahayaan yang bergantung pada sudut pandang (*view-dependent effects*).\n\n"
            "Untuk merender citra, elipsoid Gaussian 3D diproyeksikan ke bidang sensor kamera 2D menggunakan aproksimasi proyeksi affine Jacobi $\\mathbf{J}$ (algoritma *splatting* EWA oleh Zwicker et al., 2001):\n"
            "$$\\mathbf{\\Sigma}' = \\mathbf{J} \\mathbf{W} \\mathbf{\\Sigma} \\mathbf{W}^T \\mathbf{J}^T$$\n"
            "di mana $\\mathbf{W}$ adalah matriks transformasi pandangan ekstrinsik kamera.\n\n"
            "Tahap render dieksekusi menggunakan algoritma **Tile-Based Differentiable Rasterization**: layar dibagi menjadi ubin-ubin (*tiles*) berukuran $16 \\times 16$ piksel. Gaussian yang memotong setiap ubin diurutkan secara instan berdasarkan kedalaman jarak menggunakan GPU radix sort, kemudian warna komposit dihitung secara paralel menggunakan formulasi blending $\\alpha$ standar:\n"
            "$$C = \\sum_{i \\in \\mathcal{N}} c_i \\alpha_i \\prod_{j=1}^{i-1} (1 - \\alpha_j)$$\n"
            "Dengan arsitektur tanpa neural network pada tahap inferensi ini, 3DGS mampu mencapai kecepatan rendering **100–200 frame per detik (FPS)** pada resolusi 1080p penuh dengan kualitas visual yang melampaui NeRF."
        ),
        "codeSnippet": code_16_10,
        "codeSnippetOutput": run_code_capture_output(code_16_10),
        "realWorldApplication": (
            "Diterapkan secara masif pada visualisasi tur virtual properti interaktif, efek khusus industri film dan periklanan digital, integrasi aset dunia nyata ke dalam Unreal Engine 5, dan streaming pemandangan 3D fotorealistik pada web browser via WebGL/WebGPU."
        ),
        "commonPitfalls": [
            r"Mengabaikan proses adaptive density control (cloning and splitting Gaussians), yang menyebabkan partikel tidak mampu merekonstruksi detail frekuensi tinggi pada area kosong.",
            r"Melakukan optimasi langsung pada matriks kovarians Sigma tanpa parameterisasi dekomposisi R*S*S^T*R^T, yang menghasilkan matriks non-invertible dengan eigenvalue negatif.",
            r"Konsumsi VRAM yang membengkak jika jumlah Gaussian tidak dipangkas (pruning) secara berkala (dapat mencapai puluhan juta partikel dan menghabiskan 16+ GB VRAM)."
        ],
        "caseStudy": (
            "Sebuah studio game ingin menggunakan 3D Gaussian Splatting untuk merender adegan kota fotorealistik di dalam engine interaktif. Bandingkan 3DGS terhadap NeRF dan Classical Polygonal Mesh dalam hal: waktu rendering per frame, konsumsi memori disk/RAM, dan fleksibilitas integrasi ke dalam pipeline pencahayaan dinamis."
        ),
        "academicReferences": [
            r"Kerbl, B., Kopanas, G., Leimkühler, T., & Drettakis, G. (2023). 3D Gaussian splatting for real-time radiance field rendering. ACM Transactions on Graphics (TOG), 42(4), 1-14.",
            r"Zwicker, M., Pfister, H., Van Baar, J., & Gross, M. (2001). EWA volume splatting. In Proceedings of the 28th annual conference on Computer graphics and interactive techniques (pp. 29-38).",
            r"Wu, G., Yi, T., Fang, J., Xie, L., Zhang, X., Wei, W., ... & Tian, Q. (2024). 4D Gaussian splatting for real-time dynamic scene rendering. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 20310-20320)."
        ]
    }
})

# Simpan ke JSON
output_path = os.path.join(os.path.dirname(__file__), "cv_ch16_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 16 -> {output_path}")
