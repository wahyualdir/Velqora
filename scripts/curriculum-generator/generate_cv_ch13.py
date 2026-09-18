# -*- coding: utf-8 -*-
"""
Generator untuk Bab 13: Estimasi Pose Manusia & Deteksi Keypoint (10 Subbab)
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
# Subbab 13.1: Taksonomi Human Pose Estimation
# ==============================================================================
code_13_1 = r'''import numpy as np

# Model Simulasi Skalabilitas Waktu Inferensi: Top-Down vs Bottom-Up Pose Estimation
# Top-Down: Waktu bergantung linier terhadap jumlah orang N: T = T_det + N * T_pose
# Bottom-Up: Waktu independen dari jumlah orang N: T = T_backbone + T_PAF + T_parse(N)

def simulate_hpe_latency(num_people_list):
    # Parameter komputasi rata-rata (milidetik pada GPU standar)
    t_det = 20.0       # Detektor Bounding Box (Top-Down)
    t_single_pose = 12.0 # Estimasi pose per-orang (Top-Down)
    
    t_backbone_paf = 45.0 # Jaringan konvolusi holistik citra penuh (Bottom-Up)
    t_parse_base = 3.0    # Asosiasi limb bipartite matching per orang
    
    results = []
    for N in num_people_list:
        lat_top_down = t_det + N * t_single_pose
        fps_top_down = 1000.0 / lat_top_down
        
        # Bottom-up bertambah sangat lambat terhadap N (hanya tahap parsing)
        lat_bottom_up = t_backbone_paf + (t_parse_base * (1.0 + 0.1 * np.log2(max(1, N))))
        fps_bottom_up = 1000.0 / lat_bottom_up
        
        results.append((N, lat_top_down, fps_top_down, lat_bottom_up, fps_bottom_up))
    return results

people_counts = [1, 3, 5, 10, 20]
sim_results = simulate_hpe_latency(people_counts)

print("Perbandingan Skalabilitas Komputasi Human Pose Estimation:")
print(f"{'Orang (N)':<10} | {'Top-Down (ms)':<14} | {'Top-Down FPS':<13} | {'Bottom-Up (ms)':<14} | {'Bottom-Up FPS'}")
print("-" * 75)
for N, l_td, fps_td, l_bu, fps_bu in sim_results:
    print(f"{N:<10d} | {l_td:<14.1f} | {fps_td:<13.1f} | {l_bu:<14.1f} | {fps_bu:.1f}")
print("Kesimpulan: Top-Down unggul saat N kecil; Bottom-Up mendominasi saat kerumunan padat!")
'''

out_13_1 = run_code_capture_output(code_13_1)

subchapters.append({
    "id": "cv-13-1-human-pose-estimation-taxonomy",
    "title": "13.1 Taksonomi Human Pose Estimation: 2D vs 3D, Single vs Multi-Person, Top-Down vs Bottom-Up",
    "content": r"""**Human Pose Estimation (HPE)** adalah bidang fundamental dalam visi komputer yang bertujuan melokalisasi sendi-sendi anatomis tubuh manusia (*anatomical keypoints/joints*) seperti siku, pergelangan tangan, lutut, dan pergelangan kaki dari citra atau video digital.

**1. Sumbu Taksonomi Ruang Spasial**:
- **2D Pose Estimation**: Memperkirakan koordinat planar piksel $(u, v) \in \mathbb{R}^2$ dari setiap sendi pada bidang proyeksi kamera.
- **3D Pose Estimation**: Merekonstruksi koordinat posisi metrik volumetrik $(X, Y, Z) \in \mathbb{R}^3$ relatif terhadap pusat optik kamera (*camera-centric*) atau relatif terhadap sendi panggul tubuh (*root-relative*).

**2. Sumbu Kardinalitas Subjek**:
- **Single-Person**: Mengasumsikan citra hanya memuat satu individu yang telah terpusat dan terpotong secara proporsional.
- **Multi-Person**: Mendeteksi konfigurasi pose banyak individu secara simultan pada adegan terbuka tanpa batasan skala atau posisi.

**3. Paradigma Komputasi Multi-Person: Top-Down vs Bottom-Up**:
Dalam mendeteksi banyak orang, terdapat dua paradigma arsitektur yang saling bertolak belakang:
- **Paradigma Atas-ke-Bawah (*Top-Down*)**:
  1. *Person Detector* (misal Faster R-CNN atau YOLO) mendeteksi kotak pembatas (*bounding box*) dari setiap individu.
  2. Wilayah kotak setiap orang di-crop dan diskalakan ke ukuran tetap.
  3. Model estimasi pose *single-person* dijalankan secara independen untuk tiap kotak.
  *Kompleksitas Komputasi*: Bersifat linier $\mathcal{O}(N)$ terhadap jumlah orang $N$:

$$T_{\text{top-down}}(N) = T_{\text{detector}} + N \cdot T_{\text{pose}}$$

  Pendekatan ini sangat lambat saat adegan dipadati puluhan orang (*crowded scenes*), namun menghasilkan akurasi tinggi karena citra telah dinormalisasi.
- **Paradigma Bawah-ke-Atas (*Bottom-Up*)**:
  1. Model mendeteksi seluruh keypoint dari semua orang di citra secara simultan dalam satu *forward pass*.
  2. Algoritma pengelompokan (*associative parsing*) mengelompokkan sendi-sendi yang terdeteksi ke individu masing-masing.
  *Kompleksitas Komputasi*: Waktu inferensi jaringan bersifat konstan $\mathcal{O}(1)$ terhadap jumlah orang di dalam adegan, menjadikannya standar baku untuk sistem pengawasan kerumunan waktu-nyata (*real-time surveillance*).""",
    "codeSnippet": code_13_1,
    "expectedOutput": out_13_1,
    "commonPitfalls": [
        "Mengasumsikan pendekatan Top-Down selalu lebih unggul dari Bottom-Up; jika detektor bounding box gagal mendeteksi orang karena oklusi, pendekatan Top-Down akan kehilangan seluruh pose orang tersebut secara permanen.",
        "Mengabaikan biaya komputasi NMS dan cropping pada pipeline Top-Down yang dapat menjadi hambatan latensi saat memproses banyak orang."
    ],
    "quiz": {
        "question": "Mengapa pendekatan Bottom-Up (seperti OpenPose) lebih disukai untuk aplikasi pemantauan kerumunan massal dibandingkan pendekatan Top-Down?",
        "options": [
            "Karena pendekatan Bottom-Up tidak menggunakan kartu grafis GPU.",
            "Karena waktu komputasi ekstraksi fitur pada pendekatan Bottom-Up bersifat konstan O(1) independen dari jumlah orang yang hadir pada adegan.",
            "Karena pendekatan Bottom-Up hanya mampu mendeteksi 1 orang.",
            "Karena pendekatan Top-Down tidak dapat dijalankan pada bahasa Python."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Pada pendekatan Bottom-Up, seluruh sendi dari semua orang diekstraksi sekaligus dalam satu kali forward pass. Waktu komputasi tidak membengkak secara linier saat jumlah orang di dalam frame bertambah banyak."
    }
})

# ==============================================================================
# Subbab 13.2: Representasi Keypoint COCO (17 Titik)
# ==============================================================================
code_13_2 = r'''import numpy as np

# Struktur Graf Skeletal Anatomi Manusia Standar Microsoft COCO (17 Keypoints, 19 Limbs)

COCO_KEYPOINTS = [
    'nose',        # 0
    'left_eye',    # 1
    'right_eye',   # 2
    'left_ear',    # 3
    'right_ear',   # 4
    'left_shoulder',  # 5
    'right_shoulder', # 6
    'left_elbow',     # 7
    'right_elbow',    # 8
    'left_wrist',     # 9
    'right_wrist',    # 10
    'left_hip',       # 11
    'right_hip',      # 12
    'left_knee',      # 13
    'right_knee',     # 14
    'left_ankle',     # 15
    'right_ankle'     # 16
]

# Daftar Koneksi Rantai Kinematik Tulang (Limbs/Edges)
COCO_SKELETON_EDGES = [
    (0, 1), (0, 2), (1, 3), (2, 4),             # Wajah
    (5, 6), (5, 7), (7, 9), (6, 8), (8, 10),    # Lengan / Tubuh Atas
    (5, 11), (6, 12), (11, 12),                 # Batang Tubuh (Torso)
    (11, 13), (13, 15), (12, 14), (14, 16)      # Kaki / Tubuh Bawah
]

def build_skeletal_adjacency_matrix():
    num_kpts = len(COCO_KEYPOINTS)
    adj_matrix = np.zeros((num_kpts, num_kpts), dtype=np.int32)
    for u, v in COCO_SKELETON_EDGES:
        adj_matrix[u, v] = 1
        adj_matrix[v, u] = 1
    return adj_matrix

adj = build_skeletal_adjacency_matrix()

print("Topologi Graf Skeletal COCO 17-Keypoint:")
print(f"Total Simpul Sendi (Keypoints) : {len(COCO_KEYPOINTS)}")
print(f"Total Tepi Tulang (Limbs)       : {len(COCO_SKELETON_EDGES)}")
print(f"Derajat Konektivitas Bahu Kiri (Node 5): {np.sum(adj[5])} koneksi (Terhubung ke leher, siku kiri, pinggul kiri)")
print("Format Tuple Anotasi Standar COCO : (x, y, v)")
print("Status Visibilitas: v=0 (Tidak ada), v=1 (Terhalang/Oklusi), v=2 (Terlihat Jelas)")
'''

out_13_2 = run_code_capture_output(code_13_2)

subchapters.append({
    "id": "cv-13-2-coco-17-keypoints-skeletal-graph",
    "title": "13.2 Representasi Keypoint COCO (17 Titik) dan Graf Skeletal",
    "content": r"""Tolok ukur utama evaluasi estimasi pose manusia modern mengadopsi standar topologi anatomi dari **Microsoft COCO Keypoint Challenge**.

**1. Definisi 17 Keypoint Anatomi Kanonikal**:
Konfigurasi tubuh manusia dimodelkan sebagai graf terstruktur $\mathcal{G} = (\mathcal{V}, \mathcal{E})$ dengan $|\mathcal{V}| = 17$ simpul (*joints*) dan $|\mathcal{E}| = 19$ tepi kinematis (*limbs/bones*):
- **Wilayah Kepala & Wajah (5 Titik)**: Hidung ($0$), Mata Kiri ($1$), Mata Kanan ($2$), Telinga Kiri ($3$), Telinga Kanan ($4$).
- **Wilayah Ekstremitas Atas & Bahu (6 Titik)**: Bahu Kiri ($5$), Bahu Kanan ($6$), Siku Kiri ($7$), Siku Kanan ($8$), Pergelangan Tangan Kiri ($9$), Pergelangan Tangan Kanan ($10$).
- **Wilayah Ekstremitas Bawah & Panggul (6 Titik)**: Pinggul Kiri ($11$), Pinggul Kanan ($12$), Lutut Kiri ($13$), Lutut Kanan ($14$), Pergelangan Kaki Kiri ($15$), Pergelangan Kaki Kanan ($16$).

**2. Representasi Anotasi Data**:
Setiap keypoint ke-$j$ pada anotasi *ground truth* direpresentasikan sebagai triplet terurut:

$$\mathbf{k}_j = (x_j, y_j, v_j) \in \mathbb{R}^2 \times \{0, 1, 2\}$$

Di mana status visibilitas $v_j$ didefinisikan secara presisi:
- **$v = 0$ (Unlabeled / Outside Frame)**: Keypoint tidak teranotasi atau berada di luar batas citra.
- **$v = 1$ (Labeled but Occluded)**: Keypoint teranotasi dan berada di dalam batas citra, namun tertutup oleh objek lain atau bagian tubuh sendiri (*self-occlusion*).
- **$v = 2$ (Labeled and Visible)**: Keypoint teranotasi dan terlihat jelas dengan batas visual yang dapat diamati langsung.

**3. Struktur Rantai Kinematika Tubuh**:
Koneksi antar keypoint mematuhi hukum biologis gerak sendi manusia. Informasi struktural graf ini menjadi fondasi bagi algoritma inferensi untuk memulihkan pose yang masuk akal (*kinematically plausible*) dan menyaring deteksi sendi yang tidak wajar.""",
    "codeSnippet": code_13_2,
    "expectedOutput": out_13_2,
    "commonPitfalls": [
        "Menghitung error pada keypoint dengan status visibilitas $v=0$; keypoint yang tidak teranotasi wajib diabaikan (*masked out*) dari fungsi rugi dan metrik evaluasi.",
        "Mencampuradukkan orientasi kiri dan kanan anatomi subjek dengan orientasi layar pengamat; standar COCO menggunakan perspektif anatomi subjek (tangan kiri subjek = kiri anotasi)."
    ],
    "quiz": {
        "question": "Apakah arti dari flag status visibilitas v = 1 pada anotasi keypoint dataset Microsoft COCO?",
        "options": [
            "Keypoint berada di luar batas citra.",
            "Keypoint teranotasi dan berada di dalam citra, namun tertutup oklusi sehingga tidak tampak secara visual.",
            "Keypoint terdeteksi dengan keyakinan 100%.",
            "Keypoint memiliki koordinat bernilai pecahan."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Flag v=1 menandakan bahwa sendi tersebut diketahui keberadaannya di dalam frame, namun posisinya tertutup oleh benda lain atau pakaian (occluded)."
    }
})

# ==============================================================================
# Subbab 13.3: DeepPose
# ==============================================================================
code_13_3 = r'''import numpy as np

# Simulasi Regresi Koordinat Langsung DeepPose (Toshev & Szegedy 2014)
# Memetakan Patch Citra langsung ke Vektor Koordinat Ternormalisasi via Lapisan FC

def simulate_deeppose_regression(gt_keypoints, bbox):
    # bbox: [bx, by, bw, bh]
    bx, by, bw, bh = bbox
    
    # 1. Normalisasi Koordinat ke Rentang Box [-0.5, 0.5]
    # y_i = (x_i - (bx + bw/2)) / bw
    cx, cy = bx + bw / 2.0, by + bh / 2.0
    norm_kpts = np.zeros_like(gt_keypoints)
    norm_kpts[:, 0] = (gt_keypoints[:, 0] - cx) / bw
    norm_kpts[:, 1] = (gt_keypoints[:, 1] - cy) / bh
    
    # 2. Simulasi Prediksi Model dengan Derau Estimasi (Noise)
    np.random.seed(42)
    pred_norm = norm_kpts + np.random.normal(0, 0.04, size=norm_kpts.shape)
    
    # 3. Denormalisasi kembali ke Koordinat Citra Absolut
    pred_abs = np.zeros_like(pred_norm)
    pred_abs[:, 0] = pred_norm[:, 0] * bw + cx
    pred_abs[:, 1] = pred_norm[:, 1] * bh + cy
    
    # 4. Hitung L2 Loss Koordinat
    l2_loss = 0.5 * np.sum((pred_norm - norm_kpts) ** 2)
    mean_pixel_err = np.mean(np.sqrt(np.sum((pred_abs - gt_keypoints) ** 2, axis=-1)))
    
    return norm_kpts, pred_abs, l2_loss, mean_pixel_err

# Contoh 3 Keypoint Ground Truth [Hidung, Bahu Kiri, Bahu Kanan]
sample_kpts = np.array([
    [100.0, 80.0],
    [80.0, 120.0],
    [120.0, 120.0]
], dtype=np.float32)

box = [50.0, 50.0, 100.0, 100.0] # Box 100x100
norm_coords, pred_coords, loss, err_px = simulate_deeppose_regression(sample_kpts, box)

print("Simulasi Regresi Koordinat Langsung DeepPose:")
print(f"Koordinat Ternormalisasi Ground Truth:\n{norm_coords.round(3)}")
print(f"Koordinat Absolut Terprediksi (Pixel Space):\n{pred_coords.round(1)}")
print(f"L2 Coordinate Loss : {loss:.4f}")
print(f"Rata-rata Kesalahan Euklidian: {err_px:.2f} piksel")
'''

out_13_3 = run_code_capture_output(code_13_3)

subchapters.append({
    "id": "cv-13-3-deeppose-coordinate-regression",
    "title": "13.3 DeepPose (Toshev & Szegedy 2014): Regresi Koordinat via Cascade CNN",
    "content": r"""Dipublikasikan oleh Alexander Toshev dan Christian Szegedy pada CVPR 2014, **DeepPose** menjadi tonggak sejarah penting sebagai arsitektur pertama yang menerapkan *Deep Convolutional Neural Networks* untuk estimasi pose manusia.

**1. Paradigma Regresi Koordinat Langsung (*Direct Coordinate Regression*)**:
DeepPose merumuskan estimasi pose sebagai persoalan regresi numerik murni. Citra subjek yang telah dipotong berdasarkan kotak pembatas dinormalisasi, lalu dialirkan ke arsitektur CNN 7-lapisan (berbasis AlexNet). Di akhir jaringan, lapisan *fully-connected* memproyeksikan representasi fitur langsung ke dalam sebuah vektor koordinat kontinu $2k$-dimensi:

$$\mathbf{y} = [x_1, y_1, x_2, y_2, \dots, x_k, y_k]^T$$

Koordinat sendi dinormalisasi terhadap pusat $(c_x, c_y)$ dan dimensi $(w, h)$ dari kotak pembatas:

$$x_i^{\text{norm}} = \frac{x_i - c_x}{w}, \quad y_i^{\text{norm}} = \frac{y_i - c_y}{h}$$

Model dioptimalkan secara langsung menggunakan fungsi rugi kuadrat terkecil (*Mean Squared Error / L2 Loss*):

$$\mathcal{L} = \frac{1}{2} \sum_{i=1}^k \|\mathbf{y}_i - \mathbf{y}_i^*\|_2^2$$

**2. Cascade CNN untuk Penyempurnaan Iteratif**:
Karena regresi satu tahap dari citra penuh menghasilkan estimasi yang kasar, DeepPose menyusun serangkaian model secara kaskade (*Cascade of Regressors*). Pada tahap berikutnya, wilayah kecil di sekitar keypoint yang diprediksi oleh tahap awal di-crop pada resolusi lebih tinggi, dan model kaskade memprediksi vektor pergeseran offset korektif ($\Delta \mathbf{y}_i$):

$$\mathbf{y}_i^{(s)} = \mathbf{y}_i^{(s-1)} + \Delta \mathbf{y}_i^{(s)}$$

**3. Keterbatasan Inherent Regresi Koordinat**:
Meskipun revolusioner pada masanya, regresi koordinat skalar langsung memiliki kelemahan mendasar: pemetaan fungsi dari matriks intensitas piksel 2D ke dua angka skalar kontinu $(x, y)$ memiliki non-linearitas yang sangat tinggi dan tidak ramah konvergensi gradien (*highly non-linear optimization landscape*). Keterbatasan ini memicu lahirnya paradigma baru berbasis *Heatmaps*.""",
    "codeSnippet": code_13_3,
    "expectedOutput": out_13_3,
    "commonPitfalls": [
        "Menghilangkan normalisasi koordinat bounding box pada regresi langsung; tanpa normalisasi, rentang nilai koordinat piksel yang besar menyebabkan ledakan gradien.",
        "Mengabaikan bahwa regresi koordinat via FC layer membuang seluruh keteraturan spasial fitur 2D konvolusional."
    ],
    "quiz": {
        "question": "Apa kelemahan utama dari pendekatan regresi koordinat langsung (direct coordinate regression) pada DeepPose dibandingkan metode berbasis heatmap modern?",
        "options": [
            "Tidak dapat dijalankan pada citra berwarna.",
            "Pemetaan langsung dari piksel ke koordinat skalar kontinu via lapisan FC sangat non-linear dan membuang keteraturan spasial 2D, mempersulit konvergensi gradien presisi tinggi.",
            "Membutuhkan memori GPU 100 kali lipat lebih besar.",
            "DeepPose tidak mendukung optimasi berbasis backpropagation."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Meregresikan koordinat piksel kontinu secara langsung memaksakan jaringan memetakan ruang representasi visual 2D ke nilai skalar abstrak, yang sangat sulit dioptimalkan dibanding mempertahankan representasi spasial 2D via heatmap."
    }
})

# ==============================================================================
# Subbab 13.4: Heatmap-Based Regression
# ==============================================================================
code_13_4 = r'''import numpy as np

# Implementasi Heatmap-Based Regression dengan Target Gaussian 2D
# H^*(u, v) = exp( - ((u - x)^2 + (v - y)^2) / (2 * sigma^2) )

def generate_gaussian_heatmap_2d(keypoint_xy, map_size=(32, 32), sigma=2.0):
    H, W = map_size
    kx, ky = keypoint_xy
    
    # Buat grid koordinat kontinu
    grid_x = np.arange(0, W, 1, dtype=np.float32)
    grid_y = np.arange(0, H, 1, dtype=np.float32)
    xx, yy = np.meshgrid(grid_x, grid_y)
    
    # Evaluasi fungsi Gaussian 2D kontinu
    dist_sq = (xx - kx) ** 2 + (yy - ky) ** 2
    heatmap = np.exp(-dist_sq / (2.0 * (sigma ** 2)))
    
    # Nolkan nilai probabilitas mikroskopis di bawah ambang numerik
    heatmap[heatmap < 1e-4] = 0.0
    return heatmap

def extract_keypoint_from_heatmap(heatmap):
    # Ekstraksi koordinat via argmax spasial
    idx_flat = np.argmax(heatmap)
    y_idx, x_idx = np.unravel_index(idx_flat, heatmap.shape)
    peak_val = heatmap[y_idx, x_idx]
    return (float(x_idx), float(y_idx)), peak_val

# Uji pada resolusi feature map 32x32 dengan target sendi pada (18.4, 12.2)
true_target = (18.4, 12.2)
gt_heatmap = generate_gaussian_heatmap_2d(true_target, map_size=(32, 32), sigma=1.5)
extracted_coord, conf = extract_keypoint_from_heatmap(gt_heatmap)

print("Karakteristik Target Gaussian Heatmap 2D:")
print(f"Koordinat Sub-Piksel Ground Truth : {true_target}")
print(f"Dimensi Spasial Heatmap          : {gt_heatmap.shape}")
print(f"Nilai Puncak Maksimum Gaussian   : {np.max(gt_heatmap):.4f} (Pusat Sendi)")
print(f"Koordinat Terekstraksi via Argmax : {extracted_coord} | Keyakinan: {conf:.4f}")
print(f"Disparitas Kuantisasi Diskret    : {np.linalg.norm(np.array(true_target) - np.array(extracted_coord)):.3f} piksel")
'''

out_13_4 = run_code_capture_output(code_13_4)

subchapters.append({
    "id": "cv-13-4-heatmap-regression-gaussian-targets",
    "title": "13.4 Heatmap-Based Regression: Target Gaussian 2D per Keypoint",
    "content": r"""Pergeseran dari regresi koordinat langsung ke **Regresi Berbasis Peta Panas (*Heatmap-Based Regression*)** merupakan lompatan paradigma paling krusial yang mendasari keberhasilan seluruh arsitektur estimasi pose modern (Hourglass, SimpleBaseline, HRNet).

**1. Konsep Peta Keyakinan Spasial 2D**:
Alih-alih memprediksi dua skalar numerik $(x, y)$, jaringan mempertahankan representasi spasial 2D penuh. Untuk setiap jenis keypoint ke-$j$, model memprediksi sebuah *feature map* berdimensi $H' \times W'$ yang disebut **Heatmap** $\mathbf{H}_j$. Nilai pada posisi $(u, v)$ mewakili derajat keyakinan bahwa sendi ke-$j$ berlokasi pada titik tersebut.

**2. Pembangkitan Target Gaussian 2D (*Ground Truth Synthesis*)**:
Target ideal $\mathbf{H}_j^*$ dibangkitkan dengan menempatkan fungsi distribusi Gaussian 2D kontinu tanpa normalisasi yang berpusat tepat pada koordinat sejati sendi $(x_j, y_j)$:

$$\mathbf{H}_j^*(u, v) = \exp\left( -\frac{(u - x_j)^2 + (v - y_j)^2}{2\sigma^2} \right)$$

Di mana parameter $\sigma$ mengontrol jari-jari sebaran spasial target (biasanya $\sigma = 1 - 2$ piksel pada feature map resolusi $64 \times 64$).

**3. Fungsi Rugi dan Ekstraksi Koordinat**:
Model dilatih menggunakan fungsi rugi *Mean Squared Error* (MSE) sederhana antara seluruh nilai piksel heatmap prediksi $\hat{\mathbf{H}}_j$ dan ground truth $\mathbf{H}_j^*$:

$$\mathcal{L}_{\text{heat}} = \frac{1}{K} \sum_{j=1}^K \sum_{u=1}^{H'} \sum_{v=1}^{W'} \left( \hat{\mathbf{H}}_j(u, v) - \mathbf{H}_j^*(u, v) \right)^2$$

Pada saat inferensi, koordinat sendi kontinu diekstraksi menggunakan operasi argmax spasial:

$$(x_j, y_j) = \arg\max_{(u, v)} \hat{\mathbf{H}}_j(u, v)$$

Sering kali ditambahkan koreksi offset sub-piksel (*quarter-pixel shift*) ke arah turunan gradien untuk memulihkan resolusi yang hilang akibat kuantisasi grid diskrit.

**Keunggulan Mutlak**:
Heatmap mempertahankan topologi spasial citra secara utuh, memungkinkan jaringan memanfaatkan kekuatan representasi konvolusional penuh, serta memberikan pemodelan ketidakpastian spasial (*spatial ambiguity*) ketika sendi mengalami oklusi.""",
    "codeSnippet": code_13_4,
    "expectedOutput": out_13_4,
    "commonPitfalls": [
        "Memilih nilai $\\sigma$ yang terlalu besar (target menjadi buram dan lokalisasi tidak presisi) atau terlalu kecil (area bernilai positif terlalu sempit, memicu gradien lenyap).",
        "Lupa melakukan penskalaan koordinat kembali dari ukuran feature map (misal 64x64) ke ukuran citra asli (misal 256x256) saat inferensi."
    ],
    "quiz": {
        "question": "Mengapa pendekatan Heatmap-Based Regression jauh lebih unggul dan mudah dilatih dibanding Direct Coordinate Regression?",
        "options": [
            "Karena heatmap tidak memerlukan fungsi rugi.",
            "Karena mempertahankan dimensi spasial 2D citra, memungkinkan jaringan konvolusi belajar mendeteksi fitur visual lokal di sekitar sendi secara alami.",
            "Karena heatmap hanya menghasilkan nilai bilangan bulat 0 dan 1.",
            "Karena heatmap menonaktifkan algoritma backpropagation."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Dengan memprediksi peta panas 2D, jaringan konvolusi dapat memanfaatkan konteks ketetanggaan spasial secara langsung, menghasilkan lanskap optimasi gradien yang jauh lebih mulus dan stabil."
    }
})

# ==============================================================================
# Subbab 13.5: Stacked Hourglass Networks
# ==============================================================================
code_13_5 = r'''import numpy as np

# Simulasi Arsitektur Stacked Hourglass Networks (Newell et al. 2016)
# Intermediate Supervision Bertingkat: Perbaikan Heatmap Iteratif Antar Modul

def simulate_stacked_hourglass_refinement():
    # Asumsikan citra dengan 1 sendi pergelangan tangan yang sulit (oklusi sebagian)
    grid_size = (16, 16)
    target_pos = (8, 8)
    
    # Ground truth heatmap Gaussian
    gt_map = np.zeros(grid_size, dtype=np.float32)
    gt_map[target_pos[0], target_pos[1]] = 1.0
    
    # Tahap 1: Hourglass Modul 1 (Prediksi Awal Kasar dengan Ketidakpastian)
    np.random.seed(42)
    pred_stage1 = np.zeros(grid_size, dtype=np.float32)
    # Puncak keliru karena oklusi
    pred_stage1[6, 8] = 0.65
    pred_stage1[8, 8] = 0.40  # Lokasi asli tertekan
    loss_stage1 = np.mean((pred_stage1 - gt_map) ** 2)
    
    # Tahap 2: Hourglass Modul 2 (Pasca Fusi Fitur & Rekontekstualisasi)
    # Modul 2 mengoreksi puncak sendi kembali ke posisi ground truth
    pred_stage2 = np.zeros(grid_size, dtype=np.float32)
    pred_stage2[8, 8] = 0.92  # Terkoreksi tepat pada sasaran
    pred_stage2[6, 8] = 0.10  # Puncak palsu teredam
    loss_stage2 = np.mean((pred_stage2 - gt_map) ** 2)
    
    total_loss = loss_stage1 + loss_stage2
    return loss_stage1, loss_stage2, total_loss

l1, l2, tot_l = simulate_stacked_hourglass_refinement()

print("Simulasi Intermediate Supervision Stacked Hourglass Networks:")
print(f"Loss Tahap 1 (Prediksi Modul Awal) : {l1:.6f} (Puncak salah arah)")
print(f"Loss Tahap 2 (Koreksi Iteratif)     : {l2:.6f} (Reduksi error {(1 - l2/l1)*100:.1f}%)")
print(f"Total Multi-Stage Supervision Loss  : {tot_l:.6f}")
print("Mekanisme: Peta aktivasi diproyeksikan kembali ke ruang fitur untuk penyempurnaan holistik!")
'''

out_13_5 = run_code_capture_output(code_13_5)

subchapters.append({
    "id": "cv-13-5-stacked-hourglass-networks",
    "title": "13.5 Stacked Hourglass Networks (Newell et al. 2016): Intermediate Supervision Iteratif",
    "content": r"""Alejandro Newell, Kaiyu Yang, dan Jia Deng (2016) merancang arsitektur **Stacked Hourglass Networks**, salah satu inovasi paling berpengaruh yang merevolusi cara jaringan konvolusional menangkap relasi spasial tubuh manusia.

**1. Desain Modul Tunggal Hourglass**:
Modul "Hourglass" dinamai demikian karena bentuk arsitekturnya yang simetris menyerupai jam pasir:
- **Bottom-Up Path**: Menggunakan serangkaian konvolusi residual dan *max pooling* untuk memadatkan dimensi spasial dari resolusi tinggi ($64 \times 64$) ke representasi resolusi rendah ($4 \times 4$), menangkap konteks semantik global seluruh tubuh.
- **Top-Down Path**: Memulihkan resolusi spasial menggunakan *upsampling nearest neighbor* simetris.
- **Residual Skip Connections**: Pada setiap tingkatan resolusi, fitur resolusi tinggi dari jalur kontraksi digabungkan dengan jalur ekspansi via penambahan elemen (*element-wise addition*).

Desain ini memastikan jaringan mengevaluasi informasi pada seluruh skala spasial secara berkesinambungan.

**2. Penumpukan Jam Pasir End-to-End (*Stacked End-to-End*)**:
Alih-alih hanya menggunakan satu modul, Newell et al. menyusun $4$ hingga $8$ modul hourglass secara beruntun (*stacked*). Luaran heatmap dari modul pertama tidak langsung menjadi hasil akhir, melainkan dialirkan melalui konvolusi proyeksi untuk **diintegrasikan kembali ke dalam ruang fitur utama**, menjadi masukan kontekstual bagi modul hourglass berikutnya.

**3. Intermediate Supervision**:
Untuk melatih jaringan yang sangat dalam ini tanpa mengalami degradasi gradien, diterapkan teknik **Intermediate Supervision**:
- Fungsi rugi MSE dievaluasi pada luaran heatmap di ujung **setiap modul hourglass** terhadap *ground truth*:

$$\mathcal{L}_{\text{total}} = \sum_{s=1}^S \mathcal{L}_s(\hat{\mathbf{H}}^{(s)}, \mathbf{H}^*)$$

Hal ini memaksa setiap tahap membentuk estimasi pose yang koheren, memungkinkan model merevisi kesalahan lokalisasi, sendi yang tertukar antara kiri dan kanan (*symmetry confusion*), atau sendi yang teroklusi secara iteratif bertahap.""",
    "codeSnippet": code_13_5,
    "expectedOutput": out_13_5,
    "commonPitfalls": [
        "Hanya menghitung loss pada output modul hourglass terakhir; tanpa intermediate supervision pada setiap tahap, lapisan-lapisan awal akan mengalami vanishing gradient dan kehilangan arah koreksi bertahap.",
        "Menggunakan konkatenasi pada skip connections modularitas hourglass; Hourglass kanonikal menggunakan penjumlahan elemen residual untuk menghemat kanal memori."
    ],
    "quiz": {
        "question": "Apa fungsi dari penerapan teknik Intermediate Supervision pada arsitektur Stacked Hourglass Networks?",
        "options": [
            "Memperkecil ukuran citra masukan menjadi 32x32 piksel.",
            "Menghitung fungsi rugi di ujung setiap modul jam pasir secara berurutan, memaksa jaringan merevisi dan menyempurnakan estimasi pose secara iteratif dari tahap ke tahap.",
            "Menonaktifkan lapisan residual skip connection.",
            "Mengubah jenis optimiser dari Adam menjadi SGD."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Intermediate supervision menyuntikkan sinyal gradien pada setiap tahap modular, memungkinkan model mengoreksi prediksi sendi yang ambigu secara iteratif pada modul-modul berikutnya."
    }
})

# ==============================================================================
# Subbab 13.6: HRNet
# ==============================================================================
code_13_6 = r'''import numpy as np

# Simulasi Mekanisme Fusi Multi-Resolusi Paralel HRNet (Sun et al. 2019)
# 3 Aliran Paralel: Resolusi Penuh (1x), Setengah (1/2x), Seperempat (1/4x)

def simulate_hrnet_multi_scale_fusion():
    # Fitur aktivasi 3 aliran sebelum fusi (dimensi spasial berbeda)
    feat_high = np.ones((1, 16, 16, 32), dtype=np.float32) * 1.0  # Aliran 1 (Tinggi)
    feat_med  = np.ones((1, 8, 8, 64), dtype=np.float32) * 2.0    # Aliran 2 (Menengah)
    feat_low  = np.ones((1, 4, 4, 128), dtype=np.float32) * 3.0   # Aliran 3 (Rendah)
    
    # FUSI MENUJU ALIRAN RESOLUSI TINGGI (Target: 16x16x32)
    # 1. Dari Tinggi: Identitas (16x16x32)
    in_high_to_high = feat_high
    
    # 2. Dari Menengah: Bilinear Upsampling 2x (8x8 -> 16x16) + Proyeksi 1x1 (64 -> 32)
    in_med_to_high = np.repeat(np.repeat(feat_med[:, :, :, :32], 2, axis=1), 2, axis=2) * 0.5
    
    # 3. Dari Rendah: Bilinear Upsampling 4x (4x4 -> 16x16) + Proyeksi 1x1 (128 -> 32)
    in_low_to_high = np.repeat(np.repeat(feat_low[:, :, :, :32], 4, axis=1), 4, axis=2) * 0.25
    
    # Penjumlahan Fusi Multi-Skala
    fused_high_stream = in_high_to_high + in_med_to_high + in_low_to_high
    return feat_high.shape, feat_med.shape, feat_low.shape, fused_high_stream.shape

s_h, s_m, s_l, s_fused = simulate_hrnet_multi_scale_fusion()

print("Mekanisme Fusi Paralel HRNet (High-Resolution Network):")
print(f"Aliran 1 (High Res)   : {s_h} (Resolusi penuh terjaga sepanjang waktu!)")
print(f"Aliran 2 (Medium Res) : {s_m} (Receptive field menengah)")
print(f"Aliran 3 (Low Res)    : {s_l} (Semantik global)")
print(f"Keluaran Pasca-Fusi   : {s_fused} (Detail batas piksel tajam + Konteks makro)")
'''

out_13_6 = run_code_capture_output(code_13_6)

subchapters.append({
    "id": "cv-13-6-hrnet-high-resolution-representations",
    "title": "13.6 HRNet (Sun et al. 2019): Representasi Resolusi Tinggi Paralel Sepanjang Jaringan",
    "content": r"""Dipublikasikan oleh Ke Sun, Bin Xiao, Dong Liu, dan Jingdong Wang (2019), **High-Resolution Network (HRNet)** mendobrak paradigma konvensional dalam perancangan arsitektur estimasi pose dan segmentasi citra.

**1. Kelemahan Paradigma Seri Tradisional (High-to-Low and Low-to-High)**:
Mayoritas model terdahulu (Hourglass, U-Net, SimpleBaseline) menggunakan alur pemrosesan serial: mereduksi resolusi spasial citra menjadi sangat kecil melalui *pooling/striding*, lalu mencoba merekonstruksinya kembali via *upsampling*. Proses kompresi spasial ini menyebabkan hilangnya informasi koordinat presisi secara permanen yang tidak dapat dipulihkan secara sempurna.

**2. Prinsip Representasi Resolusi Tinggi Paralel**:
Alih-alih menyusun tahap resolusi secara serial, HRNet mempertahankan **aliran representasi resolusi tinggi di sepanjang seluruh alur pemrosesan jaringan dari awal hingga akhir**:
1. Dimulai dari satu cabang beresolusi tinggi ($1\times$).
2. Secara bertahap menambahkan cabang-cabang beresolusi lebih rendah ($1/2\times, 1/4\times, 1/8\times$) secara **paralel**.
3. Cabang-cabang multi-resolusi berjalan berdampingan secara terus-menerus.

**3. Fusi Informasi Multi-Skala Berulang (*Repeated Multi-Scale Fusion*)**:
Keunggulan utama HRNet berasal dari mekanisme pertukaran informasi antar-cabang yang berlangsung berulang-ulang (*frequent cross-resolution fusions*):

$$\mathbf{Y}_k = \sum_{i=1}^M f_{i \to k}(\mathbf{X}_i)$$

- Jika cabang beresolusi lebih tinggi mengirim fitur ke cabang lebih rendah ($i < k$), diterapkan konvolusi ber-*stride* $2^{k-i}$ untuk *downsampling*.
- Jika cabang beresolusi lebih rendah mengirim fitur ke cabang lebih tinggi ($i > k$), diterapkan *bilinear upsampling* $2^{i-k}$ diikuti konvolusi $1 \times 1$ untuk menyelaraskan jumlah kanal.

Hasilnya adalah representasi fitur yang secara simultan memiliki **presisi spasial tingkat piksel yang tajam** dan **pemahaman semantik global yang mendalam**, menetapkan rekor akurasi state-of-the-art baru pada COCO Keypoint Benchmark.""",
    "codeSnippet": code_13_6,
    "expectedOutput": out_13_6,
    "commonPitfalls": [
        "Mengira HRNet mengabaikan representasi resolusi rendah; HRNet tetap memproses resolusi rendah, namun melakukannya secara paralel bersamaan dengan resolusi tinggi.",
        "Mengabaikan kompleksitas memori bandwidth pada GPU saat mengimplementasikan HRNet dengan jumlah kanal besar (HRNet-W48)."
    ],
    "quiz": {
        "question": "Apa keunggulan arsitektural utama HRNet dibandingkan model Encoder-Decoder tradisional seperti Hourglass?",
        "options": [
            "HRNet tidak menggunakan fungsi aktivasi non-linear.",
            "HRNet mempertahankan representasi resolusi spasial tinggi secara paralel sepanjang seluruh alur jaringan alih-alih mereduksinya ke resolusi rendah lalu merekonstruksinya kembali.",
            "HRNet hanya dapat dijalankan pada CPU.",
            "HRNet meniadakan lapisan konvolusi 3x3."
        ],
        "correctAnswerIndex": 1,
        "explanation": "HRNet menghubungkan aliran resolusi tinggi dan rendah secara paralel dan melakukan fusi berulang, mencegah hilangnya informasi spasial koordinat yang biasa terjadi pada proses downsampling serial."
    }
})

# ==============================================================================
# Subbab 13.7: Top-Down Multi-Person Pose
# ==============================================================================
code_13_7 = r'''import numpy as np

# Simulasi Pipeline Top-Down Multi-Person Pose Estimation
# Tahap 1: Deteksi Bounding Box -> Tahap 2: Normalisasi Patch -> Tahap 3: Inverse Coordinate Mapping

def top_down_pipeline_simulation(detected_boxes, img_size=(480, 640)):
    # detected_boxes: list of [x1, y1, x2, y2]
    patch_standard_res = (256, 192) # (Tinggi, Lebar) standar industri
    global_keypoints = []
    
    for b_idx, box in enumerate(detected_boxes):
        x1, y1, x2, y2 = box
        bw = x2 - x1
        bh = y2 - y1
        
        # Simulasikan estimasi pose single-person pada patch (koordinat ternormalisasi [0, 1])
        # Asumsikan 2 sendi: Kepala (0.5, 0.2) dan Kaki (0.5, 0.9)
        patch_kpts_norm = np.array([
            [0.5, 0.2],  # Kepala
            [0.5, 0.9]   # Kaki
        ], dtype=np.float32)
        
        # Pemetaan Balik Koordinat (Inverse Mapping) ke Ruang Citra Asli
        abs_kpts = np.zeros_like(patch_kpts_norm)
        abs_kpts[:, 0] = x1 + patch_kpts_norm[:, 0] * bw
        abs_kpts[:, 1] = y1 + patch_kpts_norm[:, 1] * bh
        
        global_keypoints.append({
            'person_id': b_idx + 1,
            'box': box,
            'head_xy': abs_kpts[0].round(1).tolist(),
            'foot_xy': abs_kpts[1].round(1).tolist()
        })
        
    return global_keypoints

# Simulasi 2 orang terdeteksi pada citra
detected_people_boxes = [
    [50.0, 100.0, 150.0, 350.0],  # Orang 1: Dekat kamera (Box besar)
    [300.0, 80.0, 360.0, 220.0]   # Orang 2: Jauh di latar belakang (Box kecil)
]

mapped_results = top_down_pipeline_simulation(detected_people_boxes)

print("Hasil Eksekusi Pipeline Top-Down Pose Estimation:")
for res in mapped_results:
    print(f"Subjek {res['person_id']} -> Box: {res['box']} | Kepala: {res['head_xy']} | Kaki: {res['foot_xy']}")
print("Karakteristik: Kedua subjek diproses dengan akurasi tinggi karena di-crop ke patch seragam 256x192!")
'''

out_13_7 = run_code_capture_output(code_13_7)

subchapters.append({
    "id": "cv-13-7-top-down-multi-person-pose",
    "title": "13.7 Top-Down Multi-Person: Deteksi Bounding Box -> Estimasi Pose per RoI",
    "content": r"""Pendekatan **Top-Down** (diterapkan pada arsitektur terkemuka seperti SimpleBaseline dan AlphaPose) memecah kompleksitas estimasi pose multi-orang menjadi alur dua tahap sekuensial.

**1. Struktur Pipeline Dua Tahap**:
- **Tahap 1 (Human Detection)**: Model deteksi objek berakurasi tinggi (misal Faster R-CNN, YOLO, atau Cascade R-CNN) memindai seluruh citra untuk mengidentifikasi seluruh kotak pembatas (*bounding box*) individu manusia.
- **Tahap 2 (Single-Person Pose Estimation)**: Setiap kotak pembatas di-crop, dinormalisasi ke dimensi persegi panjang tetap (kanonikal berukuran $256 \times 192$ piksel), dan dialirkan ke estimator pose *single-person* (seperti HRNet atau ResNet).
- **Tahap 3 (Inverse Coordinate Transformation)**: Titik-titik sendi yang diprediksi pada patch ternormalisasi dipetakan kembali (*mapped back*) ke koordinat citra asli menggunakan pemetaan affin terbalik:

$$x_{\text{orig}} = x_{\text{box}} + \frac{u}{W_p} \cdot w_{\text{box}}, \quad y_{\text{orig}} = y_{\text{box}} + \frac{v}{H_p} \cdot h_{\text{box}}$$

**2. Keunggulan Dominan**:
Karena setiap individu di-crop dan diskalakan secara seragam, subjek selalu berada di tengah citra (*centered*) dengan skala yang dinormalisasi. Hal ini membebaskan jaringan pose dari keharusan menangani variasi skala ekstrem, menghasilkan **akurasi metrik mAP tertinggi** pada tolok ukur kompetisi.

**3. Kerentanan dan Kelemahan Struktural**:
1. **Ketergantungan Mutlak pada Detektor**: Jika detektor gagal menemukan kotak seseorang (*missed detection*) atau mengalami *false positive*, pose orang tersebut tidak akan pernah terestimasi.
2. **Masalah Pemotongan Anggota Tubuh (*Truncated Boxes*)**: Jika kotak pembatas memotong bagian kaki atau tangan karena oklusi, estimator pose tidak dapat memprediksi keypoint di luar batas crop tersebut.
3. **Bottleneck Latensi Kerumunan**: Waktu inferensi membengkak secara linier $\mathcal{O}(N)$ seiring bertambahnya jumlah orang di dalam citra.""",
    "codeSnippet": code_13_7,
    "expectedOutput": out_13_7,
    "commonPitfalls": [
        "Lupa menambahkan margin padding (sekitar 20-30%) di sekitar bounding box sebelum melakukan crop; tanpa margin, gerakan tangan atau kaki yang merentang akan terpotong keluar dari patch.",
        "Mengabaikan kesalahan estimasi detektor; jika kotak deteksi terlalu longgar atau bergeser, akurasi lokalisasi sendi akan anjlok."
    ],
    "quiz": {
        "question": "Apa kelemahan mendasar yang tidak dapat dihindari dari arsitektur estimasi pose Top-Down?",
        "options": [
            "Tidak dapat menggunakan resolusi citra di atas 100 piksel.",
            "Sangat rentan terhadap kegagalan detektor awal; jika seseorang gagal dideteksi pada tahap kotak pembatas, posenya tidak akan pernah bisa diestimasi.",
            "Selalu menghasilkan koordinat negatif.",
            "Tidak mendukung arsitektur CNN modern."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Alur Top-Down bergantung penuh secara serial pada output detektor bounding box. Kesalahan detektor pada tahap pertama akan langsung menyebar ke tahap estimasi pose tanpa mekanisme pemulihan."
    }
})

# ==============================================================================
# Subbab 13.8: Bottom-Up OpenPose (PAF)
# ==============================================================================
code_13_8 = r'''import numpy as np

# Implementasi Pembentukan Ground Truth Part Affinity Fields (PAF) 2D (Cao et al. 2017)
# Memodelkan vektor unit orientasi limb antara sendi j1 (siku) dan j2 (pergelangan)

def generate_paf_limb_2d(p_j1, p_j2, canvas_shape=(32, 32), limb_width=2.0):
    H, W = canvas_shape
    x1, y1 = p_j1
    x2, y2 = p_j2
    
    # 1. Vektor arah garis limb
    dx = x2 - x1
    dy = y2 - y1
    limb_len = np.sqrt(dx**2 + dy**2)
    if limb_len < 1e-6:
        return np.zeros((H, W, 2), dtype=np.float32)
        
    # Vektor satuan unit (v)
    vx = dx / limb_len
    vy = dy / limb_len
    
    # Vektor tegak lurus (v_perp)
    v_perp_x = -vy
    v_perp_y = vx
    
    # 2. Evaluasi Setiap Piksel pada Kanvas
    grid_x, grid_y = np.meshgrid(np.arange(W), np.arange(H))
    p_x = grid_x - x1
    p_y = grid_y - y1
    
    # Proyeksi sepanjang garis limb: 0 <= dot(v, p - j1) <= limb_len
    u = p_x * vx + p_y * vy
    # Jarak tegak lurus: |dot(v_perp, p - j1)| <= limb_width
    d_perp = np.abs(p_x * v_perp_x + p_y * v_perp_y)
    
    # Mask wilayah limb
    in_limb = (u >= 0.0) & (u <= limb_len) & (d_perp <= limb_width)
    
    # Bentuk tensor PAF 2D (H, W, 2 kanal: [vx, vy])
    paf = np.zeros((H, W, 2), dtype=np.float32)
    paf[in_limb, 0] = vx
    paf[in_limb, 1] = vy
    
    return paf, in_limb, (vx, vy), limb_len

# Uji pembentukan limb lengan: Siku (8, 6) menuju Pergelangan Tangan (24, 18)
siku = (8.0, 6.0)
pergelangan = (24.0, 18.0)
paf_tensor, mask_limb, unit_v, l_len = generate_paf_limb_2d(siku, pergelangan, canvas_shape=(32, 32), limb_width=2.0)

print("Karakteristik Part Affinity Fields (PAF) OpenPose:")
print(f"Titik Awal (Siku)        : {siku} | Titik Akhir (Pergelangan): {pergelangan}")
print(f"Panjang Anggota Tubuh (Limb) : {l_len:.2f} piksel")
print(f"Vektor Satuan Arah Unit (v)  : [{unit_v[0]:.3f}, {unit_v[1]:.3f}] (Magnitudo = {np.linalg.norm(unit_v):.1f})")
print(f"Dimensi Tensor PAF           : {paf_tensor.shape} (2 Kanal Orientasi Vektor)")
print(f"Jumlah Piksel Asosiasi Limb : {np.sum(mask_limb)} piksel teraktivasi")
'''

out_13_8 = run_code_capture_output(code_13_8)

subchapters.append({
    "id": "cv-13-8-openpose-part-affinity-fields",
    "title": "13.8 Bottom-Up (OpenPose, Cao et al. 2017): Part Affinity Fields (PAF) untuk Asosiasi Limb",
    "content": r"""Dipublikasikan oleh Zhe Cao, Tomas Simon, Shih-En Wei, dan Yaser Sheikh (CVPR 2017 / TPAMI 2019), **OpenPose** adalah sistem estimasi pose multi-orang waktu-nyata pertama yang mendunia berkat penemuan representasi **Part Affinity Fields (PAF)**.

**1. Tantangan Asosiasi Kombinatorial pada Pendekatan Bottom-Up**:
Pada pendekatan *bottom-up*, detektor mendeteksi seluruh keypoint dari semua individu sekaligus dalam bentuk himpunan koordinat diskrit: sekumpulan pergelangan tangan, sekumpulan siku, dan sekumpulan bahu. Tantangan paling sulit adalah: **Bagaimana menghubungkan sendi-sendi tersebut ke individu yang tepat ketika banyak orang saling berdekatan?** Pencarian menyeluruh (*exhaustive search*) memicu ledakan kombinatorial eksponensial $\mathcal{O}(K^N)$.

**2. Formulasi Part Affinity Fields (PAF)**:
Cao et al. merancang PAF $\mathbf{L}_c \in \mathbb{R}^{H \times W \times 2}$ sebagai medan vektor 2D kontinu yang mengkodekan **derajat asosiasi dan orientasi arah di sepanjang anggota tubuh (*limbs*)** yang menghubungkan dua jenis sendi tertentu.

Untuk sebuah anggota tubuh $c$ (misalnya lengan bawah yang menghubungkan siku $\mathbf{x}_{j_1}$ ke pergelangan tangan $\mathbf{x}_{j_2}$):
- Vektor satuan arah didefinisikan sebagai:

$$\mathbf{v} = \frac{\mathbf{x}_{j_2} - \mathbf{x}_{j_1}}{\|\mathbf{x}_{j_2} - \mathbf{x}_{j_1}\|_2}$$

- Medan vektor ground truth $\mathbf{L}_c^*(p)$ pada setiap piksel $p$ bernilai:

$$\mathbf{L}_c^*(p) = \begin{cases} \mathbf{v}, & \text{jika } p \text{ berada di dalam wilayah silinder limb } c \\ \mathbf{0}, & \text{lainnya} \end{cases}$$

Sebuah piksel $p$ dinyatakan berada di dalam limb jika memenuhi dua pertidaksamaan geometris:

$$0 \le \mathbf{v} \cdot (p - \mathbf{x}_{j_1}) \le l_c \quad \text{dan} \quad |\mathbf{v}_\perp \cdot (p - \mathbf{x}_{j_1})| \le \sigma_l$$

Di mana $l_c = \|\mathbf{x}_{j_2} - \mathbf{x}_{j_1}\|_2$ adalah panjang limb, $\sigma_l$ adalah lebar ambang batas silinder limb, dan $\mathbf{v}_\perp$ adalah vektor ortogonal tegak lurus terhadap $\mathbf{v}$.

**3. Arsitektur Jaringan OpenPose**:
OpenPose memproses citra melalui dua cabang paralel:
1. **Cabang 1 (Confidence Maps $\mathbf{S}$)**: Memprediksi lokasi sendi-sendi individual via heatmap Gaussian.
2. **Cabang 2 (Part Affinity Fields $\mathbf{L}$)**: Memprediksi medan vektor asosiasi anggota tubuh.

Kedua representasi ini diekstraksi secara bersamaan dalam waktu konstan $\mathcal{O}(1)$, menyediakan informasi topologis lengkap untuk merakit kerangka tubuh manusia secara instan.""",
    "codeSnippet": code_13_8,
    "expectedOutput": out_13_8,
    "commonPitfalls": [
        "Mengira PAF memprediksi skalar probabilitas; PAF adalah medan vektor 2D berarah yang memuat komponen horizontal dan vertikal [vx, vy] di setiap piksel.",
        "Mengabaikan normalisasi vektor satuan unit $\\mathbf{v}$; vektor PAF wajib memiliki panjang unit 1.0 agar integrasi garis tidak terdistorsi oleh panjang anggota tubuh."
    ],
    "quiz": {
        "question": "Apakah fungsi utama dari Part Affinity Fields (PAF) pada arsitektur OpenPose?",
        "options": [
            "Menghapus bayangan pada citra latar belakang.",
            "Menyediakan medan vektor 2D berarah yang mengkodekan hubungan konektivitas dan orientasi anggota tubuh untuk mengasosiasikan sendi-sendi ke individu yang tepat.",
            "Mengubah pose 2D menjadi 3D secara otomatis.",
            "Menghitung jumlah kalori yang terbakar oleh subjek manusia."
        ],
        "correctAnswerIndex": 1,
        "explanation": "PAF memodelkan arah aliran vektor di sepanjang anggota tubuh yang menghubungkan dua sendi, memungkinkan algoritma memasangkan sendi milik individu yang sama secara efisien."
    }
})

# ==============================================================================
# Subbab 13.9: Bipartite Matching Berbasis Skor PAF Integral
# ==============================================================================
code_13_9 = r'''import numpy as np

# Implementasi Integrasi Garis Numerik PAF dan Greedy Bipartite Matching
# E = Integral_{u=0}^1 L_c(p(u)) . ((d_j2 - d_j1) / ||d_j2 - d_j1||) du

def compute_paf_line_integral(paf_map, pt1, pt2, num_samples=10):
    # paf_map: (H, W, 2)
    # pt1, pt2: [x, y]
    x1, y1 = pt1
    x2, y2 = pt2
    dx = x2 - x1
    dy = y2 - y1
    dist = np.sqrt(dx**2 + dy**2)
    if dist < 1e-6:
        return 0.0
        
    vec_unit = np.array([dx / dist, dy / dist], dtype=np.float32)
    
    # Ambil sampel diskrit teratur di sepanjang garis penghubung
    sample_points = np.linspace(0.0, 1.0, num_samples)
    scores = []
    
    H, W, _ = paf_map.shape
    for u in sample_points:
        sx = int(round(x1 + u * dx))
        sy = int(round(y1 + u * dy))
        if 0 <= sx < W and 0 <= sy < H:
            paf_vec = paf_map[sy, sx]
            # Dot product antara medan vektor PAF dengan arah garis
            score = np.dot(paf_vec, vec_unit)
            scores.append(score)
        else:
            scores.append(0.0)
            
    # Integral didekati dengan rata-rata sampel
    return np.mean(scores)

def greedy_bipartite_matching(candidate_j1, candidate_j2, paf_map, score_thresh=0.2):
    # candidate_j1, candidate_j2: list of [x, y]
    connections = []
    for i, p1 in enumerate(candidate_j1):
        for j, p2 in enumerate(candidate_j2):
            score = compute_paf_line_integral(paf_map, p1, p2)
            if score > score_thresh:
                connections.append((score, i, j))
                
    # Urutkan berdasarkan skor integral tertinggi
    connections.sort(key=lambda x: -x[0])
    
    matched_pairs = []
    used_j1 = set()
    used_j2 = set()
    
    for score, idx1, idx2 in connections:
        if idx1 not in used_j1 and idx2 not in used_j2:
            matched_pairs.append((idx1, idx2, score))
            used_j1.add(idx1)
            used_j2.add(idx2)
            
    return matched_pairs

# Simulasi: 2 kandidat siku dan 2 kandidat pergelangan tangan (2 orang berdekatan)
H, W = 30, 30
mock_paf = np.zeros((H, W, 2), dtype=np.float32)
# Simulasikan medan PAF orang 1 yang mengarah ke kanan bawah [0.707, 0.707]
mock_paf[5:25, 5:25] = [0.707, 0.707]

siku_kandidat = [[6.0, 6.0], [8.0, 8.0]]       # Siku Orang 1 & 2
pergelangan_kandidat = [[20.0, 20.0], [22.0, 22.0]] # Pergelangan Orang 1 & 2

pairs = greedy_bipartite_matching(siku_kandidat, pergelangan_kandidat, mock_paf)

print("Hasil Asosiasi Bipartite Matching berbasis Skor Integral PAF:")
for idx1, idx2, s in pairs:
    print(f"Koneksi Limb Terbentuk: Siku {idx1} -> Pergelangan {idx2} (Skor Keyakinan Asosiasi: {s:.3f})")
print(f"Total Pasangan Valid Terakit: {len(pairs)} pasangan sendi manusia.")
'''

out_13_9 = run_code_capture_output(code_13_9)

subchapters.append({
    "id": "cv-13-9-bipartite-matching-paf-integral",
    "title": "13.9 Bipartite Matching (Hungarian / Greedy) Berbasis Skor PAF Integral",
    "content": r"""Setelah jaringan menghasilkan kumpulan titik kandidat sendi dan medan vektor Part Affinity Fields (PAF), tantangan berikutnya adalah merakit kandidat-kandidat sendi tersebut menjadi kerangka tubuh manusia utuh yang bebas kontradiksi.

**1. Formulasi Integral Garis PAF**:
Untuk menentukan apakah dua kandidat sendi anatomis yang terhubung (misalnya kandidat siku $d_{j_1}$ dan kandidat pergelangan tangan $d_{j_2}$) berasal dari individu yang sama, dihitung **skor keyakinan asosiasi $E$ melalui integral garis PAF** di sepanjang segmen yang menghubungkan kedua titik tersebut:

$$E = \int_{u=0}^1 \mathbf{L}_c(\mathbf{p}(u)) \cdot \frac{d_{j_2} - d_{j_1}}{\|d_{j_2} - d_{j_1}\|_2} \, du$$

Di mana titik sampel kontinu pada garis diberikan oleh interpolasi linier:

$$\mathbf{p}(u) = (1 - u) d_{j_1} + u \, d_{j_2}$$

Secara komputasional, integral kontinu ini diaproksimasi dengan menjumlahkan nilai *dot-product* pada $N_{\text{samp}}$ titik sampling berjarak teratur (biasanya $N_{\text{samp}} = 10$):

$$E \approx \frac{1}{N_{\text{samp}}} \sum_{n=1}^{N_{\text{samp}}} \mathbf{L}_c(\mathbf{p}(u_n)) \cdot \frac{d_{j_2} - d_{j_1}}{\|d_{j_2} - d_{j_1}\|_2}$$

Jika segmen garis tersebut benar-benar melintasi anggota tubuh manusia asli, vektor PAF akan searah sempurna dengan garis penghubung ($\mathbf{L} \cdot \mathbf{v} \approx 1.0$). Jika garis melintasi ruang kosong atau menghubungkan sendi dari dua orang yang berbeda, nilai skor integral akan mendekati nol atau negatif.

**2. Optimasi Bipartite Matching**:
Untuk setiap jenis limb anatomis, persoalan penugasan pasangan kandidat sendi dapat dirumuskan sebagai **Maximum Weight Bipartite Matching Problem**:

$$\max \sum_{m \in \mathcal{M}} E_m \quad \text{dengan konstrain tiap sendi berpasangan maksimal 1 kali}$$

Alih-alih menyelesaikan penugasan seluruh tubuh secara global (yang merupakan masalah NP-hard), OpenPose memecahnya menjadi serangkaian sub-persoalan *bipartite matching* independen untuk setiap limb kinematis. Solusi dapat dicapai secara optimal menggunakan **Hungarian Algorithm** atau pendekatan **Greedy Matching** yang sangat efisien, merakit kerangka manusia lengkap dalam hitungan milidetik.""",
    "codeSnippet": code_13_9,
    "expectedOutput": out_13_9,
    "commonPitfalls": [
        "Menggunakan jumlah titik sampling integrasi garis yang terlalu sedikit (misal < 3); sampling yang terlalu renggang dapat melewatkan diskontinuitas PAF dan memicu pasangan salah.",
        "Lupa memfilter skor integral di bawah ambang batas (thresholding); pasangan dengan skor rendah harus ditolak agar tidak membentuk koneksi tubuh yang cacat."
    ],
    "quiz": {
        "question": "Bagaimana skor keyakinan koneksi antara dua kandidat sendi dihitung pada algoritma OpenPose?",
        "options": [
            "Dengan menghitung jarak Euclidean murni antar kedua sendi.",
            "Melalui aproksimasi integral garis dari dot product antara medan vektor PAF dengan vektor arah segmen yang menghubungkan kedua sendi.",
            "Dengan menebak secara acak.",
            "Menggunakan regresi linear satu variabel."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Skor asosiasi dihitung dengan mengintegrasikan keselarasan arah medan vektor PAF di sepanjang garis yang membentang di antara kedua titik kandidat sendi."
    }
})

# ==============================================================================
# Subbab 13.10: Metrik Estimasi Pose
# ==============================================================================
code_13_10 = r'''import numpy as np

# Implementasi Metrik Evaluasi Human Pose Estimation:
# 1. Percentage of Correct Keypoints (PCK)
# 2. Object Keypoint Similarity (OKS) Standar Microsoft COCO

# Konstanta Deviasi Standar Anatomis Variasi Anotator Manusia COCO (sigma_k)
COCO_SIGMAS = np.array([
    0.026, 0.025, 0.025, 0.035, 0.035, # Wajah (Hidung, Mata, Telinga)
    0.079, 0.079, 0.072, 0.072, 0.062, 0.062, # Bahu, Siku, Pergelangan
    0.107, 0.107, 0.087, 0.087, 0.089, 0.089  # Pinggul, Lutut, Ankle
], dtype=np.float32)

def compute_oks(pred_kpts, gt_kpts, visibility, box_area):
    # pred_kpts, gt_kpts: shape (17, 2)
    # visibility: shape (17,) flag v > 0
    # box_area: luas bounding box orang dalam piksel (skala s^2)
    
    dists = np.sum((pred_kpts - gt_kpts) ** 2, axis=-1) # d_i^2
    s_sq = box_area # Skala luas s^2
    
    # Penyebut toleransi per sendi: 2 * s^2 * sigma_i^2
    vars = 2.0 * s_sq * (COCO_SIGMAS ** 2)
    
    # Eksponensial penalti jarak
    e = np.exp(-dists / vars)
    
    # Hanya evaluasi sendi dengan visibilitas v > 0
    valid_mask = (visibility > 0)
    if np.sum(valid_mask) == 0:
        return 0.0
        
    oks = np.sum(e[valid_mask]) / np.sum(valid_mask)
    return oks

def compute_pck(pred_kpts, gt_kpts, visibility, torso_diameter, threshold=0.2):
    # PCK@threshold: Jarak Euklidian <= threshold * diameter
    dists = np.sqrt(np.sum((pred_kpts - gt_kpts) ** 2, axis=-1))
    valid = (visibility > 0)
    correct = (dists <= (threshold * torso_diameter)) & valid
    pck = np.sum(correct) / np.sum(valid) if np.sum(valid) > 0 else 0.0
    return pck

# Skenario Uji 17 Keypoint Orang dengan Luas Bounding Box 200x100 piksel (Area = 20000)
np.random.seed(42)
num_kpts = 17
gt_k = np.random.uniform(50, 200, (num_kpts, 2))
# Simulasikan prediksi model dengan sedikit pergeseran acak (rata-rata 4 piksel)
pred_k = gt_k + np.random.normal(0, 4.0, (num_kpts, 2))
vis = np.ones(num_kpts, dtype=np.int32)
vis[[3, 4]] = 0 # 2 telinga tertutup/tidak teranotasi

area = 200.0 * 100.0 # 20.000 piksel persegi
torso_d = 120.0      # Diameter torso 120 piksel

oks_score = compute_oks(pred_k, gt_k, vis, area)
pck_score = compute_pck(pred_k, gt_k, vis, torso_d, threshold=0.1)

print("Hasil Evaluasi Metrik Human Pose Estimation:")
print(f"Total Keypoint Dievaluasi  : {np.sum(vis > 0)} dari 17 titik")
print(f"Skala Area Objek (s^2)     : {area:.0f} piksel persegi")
print(f"Object Keypoint Similarity : {oks_score*100:.2f}% (Standar COCO mAP)")
print(f"PCK@0.1 (Ambang 12 piksel) : {pck_score*100:.2f}%")
print("Status: Metrik OKS memperlakukan toleransi deviasi pergelangan/mata lebih ketat dari pinggul!")
'''

out_13_10 = run_code_capture_output(code_13_10)

subchapters.append({
    "id": "cv-13-10-pose-estimation-metrics",
    "title": "13.10 Metrik Estimasi Pose: Object Keypoint Similarity (OKS), mAP@OKS, dan PCK",
    "content": r"""Evaluasi performa model estimasi pose manusia membutuhkan metrik khusus yang memperhitungkan variasi anatomis tubuh manusia dan toleransi anotasi visual.

**1. Percentage of Correct Keypoints (PCK)**:
Secara historis populer pada dataset MPII dan FLIC. Sebuah sendi prediksi dinyatakan benar (*correct*) jika jarak Euclidean $d_i$ ke ground truth berada di dalam batas ambang proporsional:

$$\text{PCK}@\alpha = \frac{\sum_i \mathbb{I}(d_i \le \alpha \cdot D)}{\sum_i \mathbb{I}(v_i > 0)}$$

Di mana parameter normalisasi $D$ dapat berupa:
- **PCKh**: Diameter kepala (*head segment length*), biasanya dengan ambang $\alpha = 0.5$.
- **PCK**: Diameter batang tubuh (*torso diameter* jarak bahu ke pinggul), biasanya dengan ambang $\alpha = 0.2$.

**2. Object Keypoint Similarity (OKS)**:
Merupakan **standar emas universal** yang digunakan pada Microsoft COCO Keypoint Benchmark. OKS memainkan peran yang ekuivalen dengan *Intersection over Union* (IoU) pada deteksi objek, menghasilkan nilai skalar dalam rentang $[0, 1]$:

$$\text{OKS} = \frac{\sum_i \exp\left( -\frac{d_i^2}{2 s^2 \sigma_i^2} \right) \delta(v_i > 0)}{\sum_i \delta(v_i > 0)}$$

Di mana:
- $d_i$ adalah jarak Euclidean antara koordinat keypoint prediksi dan ground truth ke-$i$.
- $s^2$ adalah skala luas area kotak pembatas objek subjek (*object scale / bounding box area*). Penggunaan $s$ memastikan bahwa toleransi pergeseran piksel diskalakan secara adil (pergeseran 5 piksel pada anak kecil di kejauhan dihukum lebih berat daripada orang dewasa di latar depan).
- $\sigma_i$ adalah **konstanta deviasi standar anatomis** per-keypoint yang dikalibrasi secara empiris dari ribuan variasi anotator manusia. Titik sendi yang memiliki batas kaku (misal: hidung dan mata, $\sigma \approx 0.025$) memiliki toleransi penalti yang jauh lebih ketat dibandingkan sendi bertubuh longgar (misal: pinggul dan lutut, $\sigma \approx 0.089 - 0.107$).
- $\delta(v_i > 0)$ adalah fungsi indikator yang hanya mengevaluasi sendi-sendi yang teranotasi.

**3. Evaluasi mAP@OKS**:
Sama seperti pada deteksi objek, tolok ukur akhir dihitung menggunakan **Mean Average Precision (mAP)** melintasi 10 ambang batas OKS bertingkat:

$$\text{mAP}_{\text{OKS}} = \frac{1}{10} \sum_{\tau \in \{0.50, 0.55, \dots, 0.95\}} \text{AP}_{\text{OKS} \ge \tau}$$

Metrik ini mengevaluasi tidak hanya kemampuan model menemukan keberadaan orang, tetapi juga ketepatan geometris milimetrik dari penempatan setiap sendi anatomis tubuh.""",
    "codeSnippet": code_13_10,
    "expectedOutput": out_13_10,
    "commonPitfalls": [
        "Menyamakan nilai konstanta $\\sigma_i$ untuk seluruh keypoint; mata dan hidung wajib memiliki $\\sigma$ yang lebih kecil daripada pinggul dan bahu karena toleransi anotasi sendi fleksibel jauh lebih longgar.",
        "Lupa menormalisasi jarak $d_i$ dengan skala area objek $s^2$; tanpa pembagi skala, model akan bias menguntungkan subjek berukuran besar dan menghukum subjek berukuran kecil."
    ],
    "quiz": {
        "question": "Mengapa konstanta deviasi anatomis sigma_i pada formula OKS COCO bernilai berbeda-beda untuk setiap jenis sendi (misalnya mata sigma=0.025 vs pinggul sigma=0.107)?",
        "options": [
            "Karena angka tersebut dipilih secara acak oleh komputer.",
            "Untuk mencerminkan variabilitas empiris anotator manusia; sendi dengan fitur visual kaku (mata) memiliki ketidakpastian anotasi kecil sehingga dituntut presisi lebih ketat, sedangkan sendi besar (pinggul) memiliki batas visual lebih lentur.",
            "Karena pinggul bergerak lebih cepat daripada mata.",
            "Untuk memperlambat komputasi metrik evaluasi."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Konstanta sigma dikalibrasi dari deviasi standar anotasi manusia asli. Fitur wajah yang mudah dilokalisasi diberi toleransi ketat, sedangkan sendi tubuh besar seperti pinggul diberi toleransi yang lebih lapang."
    }
})

output_path = os.path.join(os.path.dirname(__file__), "cv_ch13_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 13 data with {len(subchapters)} subchapters: {output_path}")
