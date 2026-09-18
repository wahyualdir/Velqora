# -*- coding: utf-8 -*-
"""
Generator untuk Bab 10: Deteksi Objek Satu Tahap (YOLO & SSD) (10 Subbab)
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
# Subbab 10.1: Paradigma Satu Tahap vs Dua Tahap
# ==============================================================================
code_10_1 = r'''import numpy as np

# Simulasi Arsitektur Paradigma Deteksi: Dua Tahap vs Satu Tahap
# Citra input: 448 x 448 x 3 piksel

def simulate_two_stage_computational_profile(num_proposals=2000, kept_proposals=300):
    # Tahap 1: Backbone + RPN menghasilkan proposal kandidat
    t_backbone_rpn = 45.0  # ms
    # Tahap 2: RoI Pooling/Align + FC Head untuk setiap proposal yang disimpan
    t_roi_head_per_box = 0.15  # ms per proposal
    t_stage2 = kept_proposals * t_roi_head_per_box
    t_nms = 5.0  # ms
    total_time = t_backbone_rpn + t_stage2 + t_nms
    fps = 1000.0 / total_time
    return total_time, fps, kept_proposals

def simulate_one_stage_computational_profile(grid_size=7, boxes_per_cell=2, num_classes=20):
    # Satu tahap: Satu forward pass memetakan input langsung ke tensor grid (S, S, B*5 + C)
    t_backbone_head = 22.0  # ms (termasuk regresi dan klasifikasi simultan)
    total_boxes = grid_size * grid_size * boxes_per_cell
    t_nms = 3.0  # ms
    total_time = t_backbone_head + t_nms
    fps = 1000.0 / total_time
    return total_time, fps, total_boxes

t_2s, fps_2s, boxes_2s = simulate_two_stage_computational_profile()
t_1s, fps_1s, boxes_1s = simulate_one_stage_computational_profile()

print("Perbandingan Profil Komputasi Deteksi Objek:")
print(f"Two-Stage (Faster R-CNN) -> Latensi: {t_2s:.1f} ms | Throughput: {fps_2s:.1f} FPS | Evaluated Boxes: {boxes_2s}")
print(f"One-Stage (YOLOv1 Grid)  -> Latensi: {t_1s:.1f} ms | Throughput: {fps_1s:.1f} FPS | Evaluated Boxes: {boxes_1s}")
print(f"Akselerasi Kecepatan     : {fps_1s / fps_2s:.2f}x lebih cepat pada paradigma satu tahap")
'''

out_10_1 = run_code_capture_output(code_10_1)

subchapters.append({
    "id": "cv-10-1-one-stage-vs-two-stage-paradigm",
    "title": "10.1 Paradigma Satu Tahap vs Dua Tahap: Regresi Langsung Kelas + Bounding Box dalam Satu Forward Pass",
    "content": r"""Dalam lanskap deteksi objek berbasis deep learning, terdapat dua filosofi perancangan arsitektur fundamental yang saling bersaing: **Detektor Dua Tahap (*Two-Stage Detectors*)** dan **Detektor Satu Tahap (*One-Stage / Single-Shot Detectors*)**.

**1. Paradigma Detektor Dua Tahap (Two-Stage)**:
Model kanonikal seperti Faster R-CNN membagi persoalan deteksi menjadi dua subtugas terpisah:
- **Tahap 1 (Region Proposal Generation)**: Jaringan proposal wilayah (*Region Proposal Network* / RPN) memindai feature map untuk menemukan sekumpulan kandidat wilayah spasial yang berpotensi memuat objek (*regions of interest* / RoI), biasanya menghasilkan $2000$ proposal kasar.
- **Tahap 2 (Region-Level Classification & Refinement)**: Tiap proposal di-crop menggunakan mekanisme *RoI Pooling* atau *RoIAlign*, lalu dialirkan ke lapisan *fully connected* per-wilayah untuk mengklasifikasikan kategori objek dan meregresi koordinat *bounding box* secara presisi.

Meskipun menawarkan akurasi tinggi, paradigma dua tahap memiliki kelemahan kritis: pemrosesan ratusan RoI per citra menimbulkan beban komputasi besar, menciptakan hambatan latensi (*bottleneck*) yang membatasi kecepatan hingga rentang $5 - 15$ FPS, sehingga tidak layak untuk aplikasi waktu-nyata (*real-time*).

**2. Paradigma Detektor Satu Tahap (One-Stage)**:
Dipopulerkan oleh Joseph Redmon et al. (2016) melalui arsitektur YOLO (*You Only Look Once*), paradigma satu tahap merumuskan deteksi objek sebagai **masalah regresi murni tunggal end-to-end**. Jaringan tidak menghasilkan proposal wilayah terpisah, melainkan memetakan piksel citra masukan langsung ke koordinat *bounding box* dan probabilitas kelas dalam **satu *forward pass* komputasi**:

$$f_\theta: \mathbb{R}^{H \times W \times 3} \to \mathbb{R}^{S \times S \times (B \cdot 5 + C)}$$

Di mana citra dibagi menjadi kisi $S \times S$, dan tiap sel grid memprediksi $B$ kotak pembatas beserta $C$ probabilitas kelas secara simultan.

**Keunggulan dan Tantangan Paradigma Satu Tahap**:
- **Throughput Tinggi (*Real-Time Speed*)**: Inferensi berlangsung sangat cepat ($45 - 150+$ FPS) karena fitur citra hanya dievaluasi satu kali tanpa *cropping* per-wilayah.
- **Pemahaman Konteks Visual Global**: Karena mengevaluasi citra secara utuh dalam satu *forward pass*, detektor satu tahap mengkodekan konteks semantik latar belakang dengan lebih baik, memangkas kesalahan *false positive* pada latar belakang hingga separuh dibanding model berbasis proposal lokal.
- **Tantangan Class Imbalance**: Karena memprediksi kotak secara padat (*dense prediction*) di seluruh kisi spasial, detektor satu tahap menghadapi ketimpangan kelas ekstrim antara kandidat latar depan (*foreground*) dan latar belakang (*background*), dengan rasio mencapai $\mathcal{O}(10^3) - \mathcal{O}(10^4)$ kandidat negatif per citra.""",
    "codeSnippet": code_10_1,
    "expectedOutput": out_10_1,
    "commonPitfalls": [
        "Mengasumsikan bahwa detektor satu tahap selalu memiliki akurasi lokalisasi yang setara dengan dua tahap; pada generasi awal (YOLOv1), akurasi lokalisasi objek kecil tertinggal signifikan dari Faster R-CNN.",
        "Mengabaikan masalah class imbalance pada dense prediction yang dapat menyebabkan model memprediksi seluruh sel sebagai latar belakang jika loss tidak dikalibrasi dengan tepat."
    ],
    "quiz": {
        "question": "Mengapa arsitektur deteksi objek satu tahap (seperti YOLOv1) mampu mencapai throughput frame per second (FPS) yang jauh lebih tinggi dibandingkan model dua tahap (seperti Faster R-CNN)?",
        "options": [
            "Karena detektor satu tahap hanya mendeteksi satu kelas objek saja.",
            "Karena tidak memerlukan tahap pembangkitan proposal wilayah (RPN) dan cropping fitur per-wilayah, melainkan meregresi koordinat box dan kelas secara serentak dalam satu forward pass.",
            "Karena citra masukan diubah menjadi hitam-putih (grayscale) sebelum diproses.",
            "Karena detektor satu tahap meniadakan fungsi aktivasi non-linear."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Detektor satu tahap mengeliminasi overhead pembuatan ribuan proposal wilayah dan pemotongan fitur (RoI pooling) per proposal, sehingga komputasi jaringan diselesaikan dalam satu kali evaluasi konvolusional holistik."
    }
})

# ==============================================================================
# Subbab 10.2: YOLOv1 Arsitektur Grid & Skor Keyakinan
# ==============================================================================
code_10_2 = r'''import numpy as np

# Decoding Output Tensor YOLOv1 (S=7, B=2, C=20)
# Dimensi tensor output: (7, 7, 30) -> 30 = B*5 + C = 2*5 + 20

S = 7
B = 2
C = 20

# Buat tensor dummy keluaran YOLOv1
np.random.seed(42)
pred_tensor = np.zeros((S, S, B * 5 + C), dtype=np.float32)

# Simulasikan sebuah deteksi pada sel grid (row=3, col=4)
# Box 1: [x, y, w, h, conf]
# Box 2: [x, y, w, h, conf]
# Classes: 20 kelas probabilitas bersyarat
target_r, target_c = 3, 4
pred_tensor[target_r, target_c, 0:5] = [0.45, 0.55, 0.30, 0.40, 0.88]  # Box 0
pred_tensor[target_r, target_c, 5:10] = [0.40, 0.50, 0.25, 0.35, 0.42] # Box 1
pred_tensor[target_r, target_c, 10:] = 0.01
pred_tensor[target_r, target_c, 10 + 14] = 0.92  # Kelas 14 (misal: 'person')

def decode_yolov1_cell(tensor, r, c, img_w=448, img_h=448):
    cell_data = tensor[r, c]
    class_probs = cell_data[10:]
    
    boxes = []
    for b in range(B):
        offset = b * 5
        bx, by, bw, bh, conf = cell_data[offset:offset+5]
        
        # Hitung koordinat piksel absolut pada citra
        # x, y adalah offset relatif dalam sel grid [0, 1]
        abs_cx = (c + bx) * (img_w / S)
        abs_cy = (r + by) * (img_h / S)
        abs_w = bw * img_w
        abs_h = bh * img_h
        
        # Skor keyakinan spesifik kelas: Pr(Class_i | Object) * Pr(Object) * IoU
        class_scores = class_probs * conf
        best_cls = np.argmax(class_scores)
        best_score = class_scores[best_cls]
        
        boxes.append({
            'box_idx': b,
            'bbox_xywh': [round(abs_cx, 1), round(abs_cy, 1), round(abs_w, 1), round(abs_h, 1)],
            'confidence': round(float(conf), 3),
            'class_id': int(best_cls),
            'class_score': round(float(best_score), 4)
        })
    return boxes

decoded = decode_yolov1_cell(pred_tensor, target_r, target_c)
print(f"Hasil Decoding Sel Grid ({target_r}, {target_c}):")
for box in decoded:
    print(f"Box {box['box_idx']} -> Koordinat: {box['bbox_xywh']} | Obj Conf: {box['confidence']} | "
          f"Kelas: {box['class_id']} | Skor Akhir: {box['class_score']}")
'''

out_10_2 = run_code_capture_output(code_10_2)

subchapters.append({
    "id": "cv-10-2-yolov1-grid-bounding-boxes-confidence",
    "title": "10.2 YOLOv1 (Redmon et al. 2016): Grid S x S, B Bounding Box per Sel, Skor Keyakinan Pr(Object) x IOU",
    "content": r"""Arsitektur YOLOv1 membagi citra masukan berukuran $448 \times 448$ piksel menjadi kisi spasial berdimensi $S \times S$ (standar implementasi: $S = 7$).

**Prinsip Tanggung Jawab Sel Grid (*Grid Cell Responsibility*)**:
Jika titik pusat (*center*) sebuah objek jatuh ke dalam sel grid tertentu, sel tersebut **bertanggung jawab secara eksklusif** untuk mendeteksi objek tersebut. Setiap sel grid memprediksi:
1. Sejumlah $B$ *bounding box* (pada YOLOv1, $B = 2$).
2. Skor keyakinan (*confidence score*) untuk tiap *bounding box*.
3. Sebanyak $C$ nilai probabilitas kelas bersyarat $\Pr(\text{Class}_i \mid \text{Object})$ (pada PASCAL VOC, $C = 20$).

Dengan konfigurasi ini, keluaran akhir jaringan berupa tensor prediksi 3D berukuran:

$$S \times S \times (B \cdot 5 + C) = 7 \times 7 \times (2 \cdot 5 + 20) = 7 \times 7 \times 30$$

**Parameterisasi Bounding Box**:
Tiap *bounding box* direpresentasikan oleh 5 komponen kontinu $[x, y, w, h, C]$:
- Koordinat pusat $(x, y)$ didefinisikan secara relatif terhadap batas sel grid, bernilai dalam interval $[0, 1]$.
- Dimensi $(w, h)$ adalah lebar dan tinggi kotak yang dinormalisasi terhadap dimensi citra penuh, bernilai dalam $[0, 1]$.
- Nilai $C$ adalah **Skor Keyakinan (*Confidence Score*)**, yang merefleksikan seberapa yakin model bahwa kotak memuat objek dan seberapa akurat kotak tersebut melingkupi objek:

$$C = \Pr(\text{Object}) \times \text{IOU}_{\text{pred}}^{\text{truth}}$$

Jika tidak ada objek pada sel tersebut, $\Pr(\text{Object}) = 0$, sehingga skor keyakinan ideal bernilai 0. Jika terdapat objek, skor keyakinan ideal sama persis dengan nilai *Intersection over Union* (IoU) antara kotak prediksi dan *ground truth*.

**Skor Keyakinan Spesifik Kelas (*Class-Specific Confidence Score*)**:
Pada saat inferensi, model mengalikan probabilitas kelas bersyarat dengan skor keyakinan individu dari masing-masing kotak:

$$\Pr(\text{Class}_i \mid \text{Object}) \times (\Pr(\text{Object}) \times \text{IOU}_{\text{pred}}^{\text{truth}}) = \Pr(\text{Class}_i) \times \text{IOU}_{\text{pred}}^{\text{truth}}$$

Skor ini secara simultan mengukur probabilitas kemunculan kelas tertentu pada kotak tersebut dan kecocokan geometris posisi batasnya.""",
    "codeSnippet": code_10_2,
    "expectedOutput": out_10_2,
    "commonPitfalls": [
        "Lupa bahwa probabilitas kelas $C$ diprediksi sekali per sel grid, bukan per bounding box; artinya pada YOLOv1 kedua box dalam satu sel membagi distribusi probabilitas kelas yang sama.",
        "Menghitung koordinat $(x, y)$ sebagai koordinat global citra alih-alih offset relatif terhadap sel grid lokal."
    ],
    "quiz": {
        "question": "Jika citra input dipartisi menjadi kisi 7x7 dengan 2 bounding box per sel dan 20 kelas target, berapakah dimensi vektor prediksi untuk tiap sel grid pada YOLOv1?",
        "options": [
            "25 elemen",
            "30 elemen (2 box x 5 parameter + 20 kelas)",
            "50 elemen (2 box x 25 parameter)",
            "14 elemen"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Setiap box memiliki 5 parameter (x, y, w, h, confidence). Dengan B=2, total parameter box adalah 2 x 5 = 10. Ditambah dengan 20 probabilitas kelas bersyarat per sel, maka tiap sel grid memuat 10 + 20 = 30 elemen."
    }
})

# ==============================================================================
# Subbab 10.3: Fungsi Rugi YOLOv1 (SSE Multi-Part)
# ==============================================================================
code_10_3 = r'''import numpy as np

# Implementasi Fungsi Rugi Lengkap YOLOv1 (Multi-Part SSE Loss)
# 5 Komponen: Loss Pusat (x, y), Loss Dimensi (sqrt w, sqrt h),
#             Confidence Obj, Confidence NoObj, dan Classification Loss

def yolov1_loss(y_pred, y_true, lambda_coord=5.0, lambda_noobj=0.5):
    # Asumsi shape tensor: (S, S, 30) -> [x1, y1, w1, h1, c1, x2, y2, w2, h2, c2, class0..19]
    # Ground truth: y_true memuat flag obj_mask pada channel 0
    
    # 1. Masking Keberadaan Objek
    obj_mask = y_true[:, :, 4] > 0.5  # Shape: (S, S)
    noobj_mask = ~obj_mask
    
    # Pilih prediktor box yang bertanggung jawab (IoU tertinggi dengan ground truth)
    # Untuk simulasi deterministik, asumsikan Box 1 bertanggung jawab jika ada objek
    
    # Suku 1: Loss Koordinat Pusat (x, y)
    loss_xy = lambda_coord * np.sum(
        (y_pred[obj_mask, 0] - y_true[obj_mask, 0])**2 +
        (y_pred[obj_mask, 1] - y_true[obj_mask, 1])**2
    )
    
    # Suku 2: Loss Dimensi Kotak (akar kuadrat w, h)
    # Gunakan np.maximum untuk mencegah akar negatif numerik
    pred_w = np.maximum(y_pred[obj_mask, 2], 1e-6)
    pred_h = np.maximum(y_pred[obj_mask, 3], 1e-6)
    true_w = np.maximum(y_true[obj_mask, 2], 1e-6)
    true_h = np.maximum(y_true[obj_mask, 3], 1e-6)
    loss_wh = lambda_coord * np.sum(
        (np.sqrt(pred_w) - np.sqrt(true_w))**2 +
        (np.sqrt(pred_h) - np.sqrt(true_h))**2
    )
    
    # Suku 3: Loss Keyakinan pada Sel Berobjek
    loss_conf_obj = np.sum((y_pred[obj_mask, 4] - y_true[obj_mask, 4])**2)
    
    # Suku 4: Loss Keyakinan pada Sel Tanpa Objek (dikalikan lambda_noobj)
    # Kedua box (box 0 dan box 1) dihukum pada sel noobj
    loss_conf_noobj = lambda_noobj * (
        np.sum((y_pred[noobj_mask, 4] - 0.0)**2) +
        np.sum((y_pred[noobj_mask, 9] - 0.0)**2)
    )
    
    # Suku 5: Loss Klasifikasi Kelas
    loss_class = np.sum((y_pred[obj_mask, 10:] - y_true[obj_mask, 10:])**2)
    
    total_loss = loss_xy + loss_wh + loss_conf_obj + loss_conf_noobj + loss_class
    return total_loss, loss_xy, loss_wh, loss_conf_obj, loss_conf_noobj, loss_class

# Uji fungsi rugi pada tensor berdimensi (7, 7, 30)
np.random.seed(101)
pred = np.zeros((7, 7, 30), dtype=np.float32)
true = np.zeros((7, 7, 30), dtype=np.float32)

# Tempatkan 1 ground truth objek pada grid (2, 2) kelas 5
true[2, 2, 0:5] = [0.5, 0.5, 0.4, 0.6, 1.0]
true[2, 2, 10 + 5] = 1.0

# Prediksi model yang mendekati ground truth
pred[2, 2, 0:5] = [0.52, 0.48, 0.38, 0.58, 0.85]
pred[2, 2, 10 + 5] = 0.90
# Tambahkan noise kecil pada background confidence
pred[:, :, 4] += 0.05
pred[:, :, 9] += 0.05

tot, l_xy, l_wh, l_co, l_cno, l_cls = yolov1_loss(pred, true)
print("Komponen Fungsi Rugi YOLOv1:")
print(f"Loss Pusat (x, y)          : {l_xy:.4f}")
print(f"Loss Dimensi (sqrt w, h)   : {l_wh:.4f}")
print(f"Loss Keyakinan Objek       : {l_co:.4f}")
print(f"Loss Keyakinan Latar (NoObj): {l_cno:.4f}")
print(f"Loss Probabilitas Kelas    : {l_cls:.4f}")
print(f"Total Loss YOLOv1          : {tot:.4f}")
'''

out_10_3 = run_code_capture_output(code_10_3)

subchapters.append({
    "id": "cv-10-3-yolov1-loss-function",
    "title": "10.3 Fungsi Rugi YOLOv1: Sum-Squared Error dengan Koefisien lambda_coord dan lambda_noobj",
    "content": r"""YOLOv1 mengoptimalkan seluruh komponen deteksi secara terpadu menggunakan satu fungsi rugi gabungan berbasis **Sum-Squared Error (SSE)** multi-komponen.

Meskipun SSE mudah diturunkan, Redmon et al. mengidentifikasi dua kelemahan mendasar:
1. **Ketidakseimbangan Lokalisasi vs Klasifikasi**: Kesalahan lokalisasi koordinat bobotnya setara dengan kesalahan klasifikasi kategori pada SSE standar.
2. **Dominasi Sel Latar Belakang (*Empty Cells*)**: Pada citra umumnya, sebagian besar sel grid tidak memuat objek ($\Pr(\text{Object}) = 0$). Sinyal gradien dari sel-sel kosong ini akan mengalahkan gradien sel yang memuat objek, memicu instabilitas konvergensi.

**Formulasi Matematis Lengkap**:
Untuk mengatasi persoalan tersebut, diperkenalkan dua konstanta penyeimbang: $\lambda_{\text{coord}} = 5$ dan $\lambda_{\text{noobj}} = 0.5$. Fungsi rugi total didefinisikan sebagai:

$$\begin{aligned}
\mathcal{L}_{\text{YOLOv1}} &= \lambda_{\text{coord}} \sum_{i=0}^{S^2} \sum_{j=0}^B \mathbb{I}_{ij}^{\text{obj}} \left[ (x_i - \hat{x}_i)^2 + (y_i - \hat{y}_i)^2 \right] \\
&\quad + \lambda_{\text{coord}} \sum_{i=0}^{S^2} \sum_{j=0}^B \mathbb{I}_{ij}^{\text{obj}} \left[ (\sqrt{w_i} - \sqrt{\hat{w}_i})^2 + (\sqrt{h_i} - \sqrt{\hat{h}_i})^2 \right] \\
&\quad + \sum_{i=0}^{S^2} \sum_{j=0}^B \mathbb{I}_{ij}^{\text{obj}} (C_i - \hat{C}_i)^2 \\
&\quad + \lambda_{\text{noobj}} \sum_{i=0}^{S^2} \sum_{j=0}^B \mathbb{I}_{ij}^{\text{noobj}} (C_i - \hat{C}_i)^2 \\
&\quad + \sum_{i=0}^{S^2} \mathbb{I}_i^{\text{obj}} \sum_{c \in \text{classes}} (p_i(c) - \hat{p}_i(c))^2
\end{aligned}$$

**Penjelasan Notasi & Peran Komponen**:
- $\mathbb{I}_i^{\text{obj}}$ bernilai 1 jika sel $i$ memuat objek, dan 0 jika kosong.
- $\mathbb{I}_{ij}^{\text{obj}}$ bernilai 1 jika prediktor *bounding box* ke-$j$ pada sel $i$ bertanggung jawab (*responsible*) atas deteksi tersebut (memiliki IoU tertinggi terhadap *ground truth*).
- **Akar Kuadrat Lebar & Tinggi ($\sqrt{w}, \sqrt{h}$)**: Pada kotak berukuran besar, deviasi koordinat sebesar 10 piksel tidak terlalu berpengaruh secara visual. Namun pada kotak kecil, deviasi 10 piksel dapat menyebabkan kotak meleset total. Penggunaan akar kuadrat memastikan bahwa deviasi kecil pada kotak kecil menghasilkan penalti yang proporsional lebih berat.""",
    "codeSnippet": code_10_3,
    "expectedOutput": out_10_3,
    "commonPitfalls": [
        "Lupa mengakar-kuadratkan $w$ dan $h$ dalam suku kedua; regresi $w$ dan $h$ langsung tanpa akar menyebabkan penalti kotak besar mendominasi penalti kotak kecil.",
        r"Menerapkan penalti klasifikasi kelas pada sel yang tidak memuat objek; klasifikasi kelas hanya dihitung jika $\mathbb{I}_i^{\text{obj}} = 1$."
    ],
    "quiz": {
        "question": "Mengapa fungsi rugi YOLOv1 menggunakan akar kuadrat dari lebar dan tinggi (sqrt(w) dan sqrt(h)) alih-alih nilai w dan h secara langsung?",
        "options": [
            "Agar dimensi box selalu bernilai positif.",
            "Agar kesalahan deviasi spasial pada kotak berukuran kecil menghasilkan penalti proporsional yang lebih besar dibanding deviasi yang sama pada kotak berukuran besar.",
            "Untuk mempercepat proses perkalian matriks pada GPU.",
            "Karena nilai lebar dan tinggi box selalu di atas 100 piksel."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Fungsi akar memiliki turunan yang lebih curam saat mendekati nol. Akibatnya, perubahan kecil pada dimensi kotak berukuran kecil akan menghasilkan gradien penalti yang jauh lebih besar dibandingkan perubahan yang sama pada kotak berukuran besar."
    }
})

# ==============================================================================
# Subbab 10.4: Keterbatasan YOLOv1
# ==============================================================================
code_10_4 = r'''import numpy as np

# Simulasi Batasan Spasial Keras YOLOv1 (Spatial Constraint Collision)
# Pada kisi 7x7, sebuah sel grid hanya dapat memprediksi 1 label kelas objek

class YOLOv1SpatialGridSimulator:
    def __init__(self, S=7, img_size=448):
        self.S = S
        self.img_size = img_size
        self.cell_size = img_size / S
        
    def assign_objects(self, objects):
        # objects: list of dict {'name': str, 'x': float, 'y': float}
        grid_assignments = {}
        collisions = []
        
        for obj in objects:
            cell_c = int(obj['x'] // self.cell_size)
            cell_r = int(obj['y'] // self.cell_size)
            cell_key = (cell_r, cell_c)
            
            if cell_key not in grid_assignments:
                grid_assignments[cell_key] = [obj]
            else:
                grid_assignments[cell_key].append(obj)
                collisions.append((cell_key, obj['name'], grid_assignments[cell_key][0]['name']))
                
        return grid_assignments, collisions

sim = YOLOv1SpatialGridSimulator()
# Skenario: Kawanan burung (flock of birds) terbang berdekatan
bird_flock = [
    {'name': 'Burung_A', 'x': 210, 'y': 210},
    {'name': 'Burung_B', 'x': 225, 'y': 220},
    {'name': 'Burung_C', 'x': 240, 'y': 235},
    {'name': 'Orang_Jauh', 'x': 350, 'y': 100}
]

assignments, col = sim.assign_objects(bird_flock)
detected_count = len(assignments)
total_objects = len(bird_flock)

print("Simulasi Keterbatasan Spasial YOLOv1:")
print(f"Total Objek Hadir        : {total_objects}")
print(f"Sel Grid Terisi          : {detected_count}")
print(f"Objek yang Hilang/Kalah  : {len(col)} (Recall Maksimum: {detected_count/total_objects*100:.1f}%)")
for cell, lost_obj, won_obj in col:
    print(f" - Tabrakan pada Sel {cell}: '{lost_obj}' diabaikan karena sel telah ditempati '{won_obj}'")
'''

out_10_4 = run_code_capture_output(code_10_4)

subchapters.append({
    "id": "cv-10-4-yolov1-limitations-small-objects-aspect-ratios",
    "title": "10.4 Keterbatasan YOLOv1 pada Objek Kecil Berkelompok dan Rasio Aspek Tidak Lazim",
    "content": r"""Meskipun YOLOv1 mendobrak rekor kecepatan komputasi deteksi waktu-nyata, arsitektur perintis ini memiliki beberapa kelemahan struktural inheren:

**1. Batasan Spasial Keras (*Strict Spatial Constraints*)**:
Setiap sel grid $S \times S$ memprediksi $B=2$ *bounding box*, namun hanya dapat menetapkan **tepat satu probabilitas kelas objek**. Hal ini membatasi kapasitas deteksi spasial model:
- Jika beberapa objek berdekatan (misalnya kawanan burung, sekerumunan orang, atau sekumpulan koin) berada di dalam sel grid yang sama, sel tersebut hanya mampu mendeteksi satu objek saja, sedangkan objek lainnya diabaikan (*spatial collision*).
- Batas teoretis kapasitas deteksi maksimum pada citra dibatasi oleh:

$$N_{\max} = S \times S = 7 \times 7 = 49 \text{ objek}$$

**2. Kesulitan pada Objek Berukuran Kecil (*Small Object Sensitivity*)**:
YOLOv1 menggunakan faktor *downsampling* spasial yang sangat besar dari citra masukan ke *feature map* akhir:

$$R = \frac{H_{\text{in}}}{H_{\text{grid}}} = \frac{448}{7} = 64$$

Resolusi spasial $7 \times 7$ yang sangat tereduksi kehilangan rincian spasial resolusi tinggi. Akibatnya, fitur representasi objek kecil lenyap di lapisan-lapisan konvolusi dalam, mengakibatkan tingkat *recall* objek kecil yang jauh lebih rendah dibanding Faster R-CNN.

**3. Generalisasi Rasio Aspek Tidak Lazim (*Unseen Aspect Ratios*)**:
Karena meregresi koordinat secara bebas dari data pelatihan tanpa *anchor prior*, YOLOv1 kesulitan memperkirakan kotak untuk objek dengan konfigurasi orientasi atau rasio aspek yang belum pernah terlihat sebelumnya (misalnya objek yang sangat pipih horizontal atau sangat memanjang vertikal).

**4. Dominasi Kesalahan Lokalisasi**:
Analisis diagnostik kesalahan (Redmon et al. 2016) membuktikan bahwa sumber kesalahan terbesar YOLOv1 bukanlah *false positive* pada latar belakang (yang justru sangat rendah dibanding Faster R-CNN), melainkan **kesalahan lokalisasi (*localization error*)** di mana kotak deteksi meleset beberapa piksel dari batas objek sebenarnya.""",
    "codeSnippet": code_10_4,
    "expectedOutput": out_10_4,
    "commonPitfalls": [
        "Menyimpulkan bahwa YOLOv1 gagal mendeteksi objek kecil karena kurangnya data; akar masalahnya adalah reduksi resolusi fitur spasial ekstrem ($64\\times$) dan batasan 1 kelas per sel.",
        "Mengasumsikan bahwa menambah $B=5$ pada YOLOv1 akan menyelesaikan masalah kawanan objek; menambah $B$ hanya menambah kandidat box, bukan jumlah kelas objek unik per sel."
    ],
    "quiz": {
        "question": "Berapakah jumlah objek maksimum absolut yang secara teoritis dapat dideteksi secara bersamaan oleh model YOLOv1 standar pada satu citra input?",
        "options": [
            "98 objek (7 x 7 x 2)",
            "49 objek (karena dibatasi oleh 1 kelas per sel grid 7x7)",
            "Tak terhingga",
            "20 objek (sesuai jumlah kelas PASCAL VOC)"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Meskipun tiap sel memprediksi 2 bounding box (total 98 box), setiap sel grid hanya memprediksi satu distribusi probabilitas kelas. Oleh karena itu, maksimal hanya 49 objek unik (satu per sel) yang dapat dideteksi secara independen."
    }
})

# ==============================================================================
# Subbab 10.5: YOLOv2 / YOLO9000
# ==============================================================================
code_10_5 = r'''import numpy as np

# Algoritma K-Means Dimension Clustering untuk Penentuan Anchor Box (YOLOv2)
# Metrik jarak: d(box, centroid) = 1 - IoU(box, centroid)

def compute_box_iou(boxA, boxB):
    # box format: [w, h] dengan pusat diasumsikan berimpit pada (0, 0)
    inter_w = np.minimum(boxA[0], boxB[0])
    inter_h = np.minimum(boxA[1], boxB[1])
    inter_area = inter_w * inter_h
    union_area = boxA[0] * boxA[1] + boxB[0] * boxB[1] - inter_area
    return inter_area / np.maximum(union_area, 1e-6)

def kmeans_dimension_clustering(boxes, k=5, max_iter=50):
    n = len(boxes)
    # Inisialisasi centroid secara deterministik
    np.random.seed(42)
    indices = np.random.choice(n, k, replace=False)
    centroids = boxes[indices].copy()
    
    for _ in range(max_iter):
        # Hitung jarak 1 - IoU ke seluruh centroid
        distances = np.zeros((n, k))
        for j in range(k):
            for i in range(n):
                distances[i, j] = 1.0 - compute_box_iou(boxes[i], centroids[j])
                
        # Tetapkan ke cluster terdekat
        labels = np.argmin(distances, axis=1)
        
        # Perbarui centroid menggunakan median dimensi cluster
        new_centroids = np.zeros_like(centroids)
        for j in range(k):
            cluster_boxes = boxes[labels == j]
            if len(cluster_boxes) > 0:
                new_centroids[j] = np.mean(cluster_boxes, axis=0)
            else:
                new_centroids[j] = centroids[j]
                
        if np.allclose(centroids, new_centroids, atol=1e-3):
            break
        centroids = new_centroids
        
    return centroids

# Sampel dimensi bounding box ternormalisasi [w, h] dari dataset
sample_boxes = np.array([
    [0.08, 0.12], [0.10, 0.15], [0.12, 0.18],  # Objek kecil
    [0.25, 0.50], [0.28, 0.55], [0.30, 0.60],  # Objek vertikal (orang)
    [0.60, 0.30], [0.65, 0.35], [0.70, 0.40],  # Objek horizontal (mobil)
    [0.75, 0.80], [0.80, 0.85], [0.85, 0.90],  # Objek besar
    [0.40, 0.40], [0.45, 0.45], [0.50, 0.50]   # Objek menengah
], dtype=np.float32)

optimal_anchors = kmeans_dimension_clustering(sample_boxes, k=5)
# Urutkan berdasarkan area
optimal_anchors = optimal_anchors[np.argsort(optimal_anchors[:, 0] * optimal_anchors[:, 1])]

print("Optimal Anchor Boxes Terklaster (K=5):")
for idx, anc in enumerate(optimal_anchors):
    print(f"Anchor {idx+1}: Lebar = {anc[0]:.3f} | Tinggi = {anc[1]:.3f} | Area = {anc[0]*anc[1]:.4f}")
'''

out_10_5 = run_code_capture_output(code_10_5)

subchapters.append({
    "id": "cv-10-5-yolov2-anchor-boxes-dimension-clustering",
    "title": "10.5 YOLOv2 / YOLO9000 (Redmon & Farhadi 2017): Anchor Box via K-Means Dimension Clustering & Passthrough Layer",
    "content": r"""YOLOv2 (dikenal juga sebagai YOLO9000) memperkenalkan serangkaian penyempurnaan mendalam yang merombak stabilitas pelatihan dan meningkatkan akurasi deteksi secara dramatis.

**1. Adopsi Anchor Boxes & Dimension Clustering**:
Berbeda dengan Faster R-CNN yang memilih rasio aspek *anchor boxes* secara manual (skala $128, 256, 512$ dan rasio $1:1, 1:2, 2:1$), YOLOv2 menerapkan **K-Means Clustering** langsung pada dimensi kotak anotasi dataset pelatihan.

Jarak Euclidean standar tidak cocok digunakan untuk clustering kotak pembatas karena menghasilkan bias kesalahan yang lebih besar pada kotak besar. Redmon & Farhadi mendefinisikan metrik jarak kustom berbasis IoU:

$$d(\text{box}, \text{centroid}) = 1 - \text{IOU}(\text{box}, \text{centroid})$$

Dengan metrik ini, kesalahan penskalaan dinilai secara invarian terhadap dimensi absolut kotak. Eksperimen menunjukkan bahwa $k = 5$ *anchor priors* memberikan representasi bentuk representatif optimal dengan efisiensi komputasi tinggi.

**2. Direct Location Prediction**:
Pada Faster R-CNN, koordinat diprediksi tanpa batas melalui formulasi $x = (t_x \cdot w_a) + x_a$. Hal ini menyebabkan prediksi titik tengah box dapat bergeser ke lokasi mana pun pada citra, memicu instabilitas selama inisialisasi awal.

YOLOv2 membatasi pergeseran titik tengah tetap berada di dalam batas sel grid yang bersangkutan menggunakan fungsi logistik sigmoid $\sigma$:

$$\begin{aligned}
b_x &= \sigma(t_x) + c_x \\
b_y &= \sigma(t_y) + c_y \\
b_w &= p_w e^{t_w} \\
b_h &= p_h e^{t_h} \\
\Pr(\text{object}) \times \text{IOU}(b, \text{object}) &= \sigma(t_o)
\end{aligned}$$

Di mana $(c_x, c_y)$ adalah koordinat sudut kiri-atas sel grid, dan $(p_w, p_h)$ adalah dimensi *anchor prior*.

**3. Passthrough Layer (Fine-Grained Features)**:
Untuk meningkatkan deteksi objek kecil, YOLOv2 menambahkan *passthrough layer* yang mengambil *feature map* beresolusi lebih tinggi ($26 \times 26 \times 512$) dari lapisan sebelumnya, menata ulang susunan spasialnya menjadi tensor berdimensi ($13 \times 13 \times 2048$), lalu menggabungkannya (*concatenation*) dengan fitur lapisan akhir.""",
    "codeSnippet": code_10_5,
    "expectedOutput": out_10_5,
    "commonPitfalls": [
        "Menggunakan metrik jarak Euclidean $(w_1 - w_2)^2 + (h_1 - h_2)^2$ pada clustering dimensi bounding box; ini akan membuat cluster didominasi oleh objek-objek besar.",
        "Lupa menambahkan fungsi sigmoid pada $t_x$ dan $t_y$, yang dapat menyebabkan model memprediksi titik pusat box di luar sel grid lokal."
    ],
    "quiz": {
        "question": "Mengapa YOLOv2 menggunakan fungsi jarak d(box, centroid) = 1 - IoU(box, centroid) pada K-Means clustering alih-alih jarak Euclidean standar?",
        "options": [
            "Karena jarak Euclidean tidak dapat dihitung pada array dua dimensi.",
            "Agar penalti jarak tidak bergantung pada skala dimensi absolut kotak, sehingga kotak kecil dan kotak besar diperlakukan secara seimbang.",
            "Untuk menjamin bahwa seluruh centroid bernilai bilangan bulat.",
            "Karena pustaka NumPy melarang penggunaan jarak Euclidean."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Metrik berbasis 1 - IoU memastikan evaluasi kemiripan bentuk bersifat invarian terhadap ukuran absolut bounding box, mencegah clustering terdistorsi oleh dimensi kotak-kotak besar."
    }
})

# ==============================================================================
# Subbab 10.6: YOLOv3
# ==============================================================================
code_10_6 = r'''import numpy as np

# Rekonstruksi Multi-Scale Prediction Head YOLOv3 (3 Skala Spasial)
# Skala 1 (Stride 32): 13 x 13 (Objek Besar)
# Skala 2 (Stride 16): 26 x 26 (Objek Menengah)
# Skala 3 (Stride 8) : 52 x 52 (Objek Kecil)

def simulate_yolov3_multiscale_prediction(img_dim=416, num_classes=80):
    scales = [
        {'stride': 32, 'grid': img_dim // 32, 'target_obj': 'Besar', 'anchors': [(116, 90), (156, 198), (373, 326)]},
        {'stride': 16, 'grid': img_dim // 16, 'target_obj': 'Menengah', 'anchors': [(30, 61), (62, 45), (59, 119)]},
        {'stride': 8,  'grid': img_dim // 8,  'target_obj': 'Kecil', 'anchors': [(10, 13), (16, 30), (33, 23)]}
    ]
    
    total_predictions = 0
    head_summaries = []
    
    for s in scales:
        g = s['grid']
        num_anchors = len(s['anchors'])
        # Tiap anchor memprediksi: 4 koordinat + 1 obj_conf + num_classes
        channels_per_anchor = 4 + 1 + num_classes
        total_channels = num_anchors * channels_per_anchor
        boxes_at_scale = g * g * num_anchors
        total_predictions += boxes_at_scale
        
        head_summaries.append({
            'stride': s['stride'],
            'grid_shape': (g, g),
            'channels': total_channels,
            'boxes_count': boxes_at_scale,
            'specialization': s['target_obj']
        })
        
    return total_predictions, head_summaries

tot_boxes, summaries = simulate_yolov3_multiscale_prediction()
print("Arsitektur Prediksi Multi-Skala YOLOv3 (Input 416x416):")
for s in summaries:
    print(f"Skala Stride {s['stride']:2d} -> Grid: {s['grid_shape']} | Kanal: {s['channels']} | "
          f"Box: {s['boxes_count']:5d} | Target: Objek {s['specialization']}")
print(f"Total Bounding Boxes Diprediksi per Citra: {tot_boxes:,}")
'''

out_10_6 = run_code_capture_output(code_10_6)

subchapters.append({
    "id": "cv-10-6-yolov3-darknet53-multiscale-predictions",
    "title": "10.6 YOLOv3: Backbone Darknet-53, Prediksi Multi-Skala 3 Level & Klasifikasi Multilabel Sigmoid Independen",
    "content": r"""YOLOv3 (Redmon & Farhadi 2018) membawa detektor satu tahap ke tingkat kematangan baru melalui integrasi tiga pilar inovasi:

**1. Backbone Darknet-53**:
Darknet-53 menggabungkan konvolusi berturut-turut $3 \times 3$ dan $1 \times 1$ dengan sambungan jalan pintas residual (*residual skip connections*). Memiliki 53 lapisan konvolusi murni, Darknet-53 jauh lebih bertenaga daripada Darknet-19 dan menyamai performa ResNet-152 dengan efisiensi komputasi dua kali lipat lebih cepat.

**2. Prediksi Multi-Skala 3 Tingkat (Feature Pyramid Network)**:
Untuk mengatasi kelemahan deteksi objek kecil pada versi terdahulu, YOLOv3 melakukan prediksi pada **tiga skala spasial berbeda** yang diekstraksi pada kedalaman berbeda dengan rasio *stride* 32, 16, dan 8:
- **Skala 1 (Stride 32 $\to 13 \times 13$)**: Menggunakan *receptive field* luas untuk mendeteksi objek berskala besar.
- **Skala 2 (Stride 16 $\to 26 \times 26$)**: Menggabungkan fitur konvolusional dari lapisan terdahulu via *upsampling $2\times$* untuk mendeteksi objek berskala menengah.
- **Skala 3 (Stride 8 $\to 52 \times 52$)**: Memanfaatkan resolusi spasial tinggi untuk mendeteksi objek-objek kecil berkerumun.

Total $9$ *anchor boxes* (3 anchor per skala) dialokasikan secara khusus sesuai ukuran target. Pada input $416 \times 416$, total prediksi mencapai $10.647$ kotak per citra (meningkat drastis dari 98 kotak pada YOLOv1).

**3. Klasifikasi Multilabel Menggunakan Sigmoid Independen**:
YOLOv3 meniadakan fungsi aktivasi *Softmax* untuk klasifikasi kelas. Softmax memaksakan asumsi mutual eksklusif di mana tiap kotak hanya boleh memiliki tepat satu kelas. Dalam domain dunia nyata, sebuah objek dapat memiliki anotasi bertingkat (misal: *Person* sekaligus *Woman*).

YOLOv3 mengganti Softmax dengan **klasifikasi logistik sigmoid independen** untuk tiap kelas, menggunakan fungsi rugi *Binary Cross-Entropy* (BCE):

$$\mathcal{L}_{\text{cls}} = -\sum_{c=1}^C \left[ y_c \log \sigma(\hat{s}_c) + (1 - y_c) \log (1 - \sigma(\hat{s}_c)) \right]$$

Pendekatan ini memungkinkan klasifikasi multilabel yang fleksibel pada dataset berlabel kompleks.""",
    "codeSnippet": code_10_6,
    "expectedOutput": out_10_6,
    "commonPitfalls": [
        "Menggunakan aktivasi Softmax pada output kelas YOLOv3; hal ini melanggar desain klasifikasi multilabel independen berbasis sigmoid.",
        "Mengasumsikan semua 9 anchor diterapkan pada setiap skala; pada YOLOv3, 3 anchor terbesar diterapkan pada grid 13x13, 3 menengah pada 26x26, dan 3 terkecil pada 52x52."
    ],
    "quiz": {
        "question": "Mengapa YOLOv3 beralih dari aktivasi Softmax ke aktivasi Sigmoid independen untuk klasifikasi kategori objek?",
        "options": [
            "Karena aktivasi Sigmoid mengonsumsi memori GPU lebih sedikit.",
            "Untuk mendukung klasifikasi multilabel, di mana objek dapat memiliki lebih dari satu label kelas yang valid secara simultan tanpa asumsi mutual-eksklusif.",
            "Agar akurasi mAP selalu mencapai 100%.",
            "Karena Softmax tidak dapat diturunkan menggunakan algoritma backpropagation."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Softmax mengasumsikan setiap kandidat objek hanya memiliki satu label mutlak (mutual eksklusif). Penggunaan logistic sigmoid independen memungkinkan model memprediksi multilabel non-eksklusif secara bersamaan."
    }
})

# ==============================================================================
# Subbab 10.7: SSD (Single Shot MultiBox Detector)
# ==============================================================================
code_10_7 = r'''import numpy as np

# Generator Default Boxes Multi-Skala SSD (Liu et al. 2016)
# Skala default box: s_k = s_min + (s_max - s_min)/(m - 1) * (k - 1)

def generate_ssd_default_boxes(img_size=300):
    feature_maps = [38, 19, 10, 5, 3, 1]
    m = len(feature_maps)
    s_min, s_max = 0.2, 0.9
    aspect_ratios_dict = {
        38: [1.0, 2.0, 0.5],
        19: [1.0, 2.0, 0.5, 3.0, 1.0/3.0],
        10: [1.0, 2.0, 0.5, 3.0, 1.0/3.0],
        5:  [1.0, 2.0, 0.5, 3.0, 1.0/3.0],
        3:  [1.0, 2.0, 0.5],
        1:  [1.0, 2.0, 0.5]
    }
    
    total_boxes = 0
    layer_stats = []
    
    for k_idx, f_k in enumerate(feature_maps):
        k = k_idx + 1
        s_k = s_min + (s_max - s_min) / (m - 1) * (k - 1)
        ratios = aspect_ratios_dict[f_k]
        # Tiap rasio menghasilkan 1 box, rasio 1.0 memiliki box ekstra s'_k
        num_boxes_per_cell = len(ratios) + 1
        boxes_in_layer = f_k * f_k * num_boxes_per_cell
        total_boxes += boxes_in_layer
        
        layer_stats.append({
            'layer_idx': k,
            'feat_dim': f_k,
            'scale': round(s_k, 3),
            'boxes_per_cell': num_boxes_per_cell,
            'total_layer_boxes': boxes_in_layer
        })
        
    return total_boxes, layer_stats

tot_ssd_boxes, stats = generate_ssd_default_boxes()
print("Konfigurasi Default Boxes Multi-Skala SSD-300:")
for st in stats:
    print(f"Layer {st['layer_idx']} ({st['feat_dim']:2d}x{st['feat_dim']:2d}) -> "
          f"Skala: {st['scale']:.3f} | Box/Sel: {st['boxes_per_cell']} | Total: {st['total_layer_boxes']:4d} box")
print(f"Total Default Boxes SSD-300: {tot_ssd_boxes} (Kanonikal 8732 boxes)")
'''

out_10_7 = run_code_capture_output(code_10_7)

subchapters.append({
    "id": "cv-10-7-ssd-multiscale-feature-maps-default-boxes",
    "title": "10.7 SSD (Liu et al. 2016): Multi-Scale Feature Maps Langsung dari Backbone & Default Boxes Multi-Rasio",
    "content": r"""Diperkenalkan oleh Wei Liu et al. (2016), **Single Shot MultiBox Detector (SSD)** menjadi pelopor penting dalam deteksi objek multi-skala berkecepatan tinggi tanpa memerlukan arsitektur *feature pyramid* berjalur balik (*top-down pathway*).

**1. Multi-Scale Feature Maps Langsung dari Backbone**:
SSD menambahkan lapisan-lapisan konvolusi tambahan di ujung *backbone* (klasiknya VGG-16 terpotong). Ukuran *feature map* menyusut secara bertahap: $38 \times 38$, $19 \times 19$, $10 \times 10$, $5 \times 5$, $3 \times 3$, dan $1 \times 1$.

Alih-alih hanya mendeteksi pada lapisan terakhir (seperti YOLOv1), SSD menempatkan kepala prediktor konvolusional kecil ($3 \times 3$) pada **setiap tingkatan feature map**:
- Lapisan dangkal ($38 \times 38$, conv4_3) memiliki resolusi tinggi untuk mendeteksi objek-objek kecil.
- Lapisan dalam ($1 \times 1$) memiliki *receptive field* masif untuk mendeteksi objek besar yang mencakup seluruh layar.

**2. Formulasi Default Boxes**:
Pada setiap lokasi sel feature map ke-$k$, didefinisikan sekumpulan *default boxes* (ekuivalen dengan *anchor boxes*). Skala kotak dinormalisasi secara teratur menggunakan formula linier:

$$s_k = s_{\min} + \frac{s_{\max} - s_{\min}}{m - 1}(k - 1), \quad k \in [1, m]$$

Di mana $s_{\min} = 0.2$ dan $s_{\max} = 0.9$. Berbagai rasio aspek $a_r \in \{1, 2, 3, \frac{1}{2}, \frac{1}{3}\}$ diterapkan pada setiap skala:

$$w_k^a = s_k \sqrt{a_r}, \quad h_k^a = \frac{s_k}{\sqrt{a_r}}$$

Untuk rasio $a_r = 1$, SSD menambahkan satu kotak ekstra dengan skala rata-rata geometris:

$$s_k' = \sqrt{s_k s_{k+1}}$$

Pada SSD-300, kombinasi seluruh lapisan menghasilkan tepat **8.732 default boxes per citra**, memberikan cakupan spasial yang sangat rapat melintasi berbagai skala.""",
    "codeSnippet": code_10_7,
    "expectedOutput": out_10_7,
    "commonPitfalls": [
        "Lupa menyertakan box ekstra $s_k'$ pada rasio aspek $a_r=1$, yang mengakibatkan jumlah default box tidak cocok dengan standar 8732 pada SSD-300.",
        "Mengabaikan normalisasi $L_2$ pada lapisan conv4_3; karena skala aktivasi pada conv4_3 jauh lebih besar dari lapisan akhir, normalisasi skala penting agar loss stabil."
    ],
    "quiz": {
        "question": "Berapakah total default boxes yang dihasilkan oleh arsitektur SSD-300 standar melintasi 6 tingkatan feature map-nya?",
        "options": [
            "98 boxes",
            "8.732 boxes",
            "1.000 boxes",
            "10.647 boxes"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Pada SSD-300, penjumlahan dari seluruh level (38x38x4 + 19x19x6 + 10x10x6 + 5x5x6 + 3x3x4 + 1x1x4) menghasilkan tepat 8.732 default boxes."
    }
})

# ==============================================================================
# Subbab 10.8: Hard Negative Mining pada SSD
# ==============================================================================
code_10_8 = r'''import numpy as np

# Implementasi Hard Negative Mining pada SSD
# Menjaga rasio sampel Negatif : Positif maksimal 3 : 1

def hard_negative_mining(conf_loss_all, match_mask, neg_pos_ratio=3):
    # conf_loss_all: array 1D berisi confidence loss tiap default box
    # match_mask: array boolean (True jika positif, False jika negatif)
    
    num_pos = np.sum(match_mask)
    if num_pos == 0:
        # Jika tidak ada objek positif pada citra
        num_pos = 1
        
    num_neg_target = int(num_pos * neg_pos_ratio)
    
    # Nolkan loss dari sampel positif agar tidak terpilih dalam ranking negatif
    neg_losses = conf_loss_all.copy()
    neg_losses[match_mask] = -1.0
    
    # Ambil indeks sampel negatif dengan loss tertinggi (Hard Negatives)
    sorted_neg_indices = np.argsort(-neg_losses)
    selected_neg_indices = sorted_neg_indices[:num_neg_target]
    
    # Mask final yang terpilih untuk backpropagation
    selected_mask = np.zeros_like(match_mask, dtype=bool)
    selected_mask[match_mask] = True
    selected_mask[selected_neg_indices] = True
    
    return selected_mask, num_pos, len(selected_neg_indices)

# Simulasi 100 default boxes: 5 positif, 95 negatif
np.random.seed(42)
num_boxes = 100
matches = np.zeros(num_boxes, dtype=bool)
matches[[12, 34, 55, 78, 89]] = True  # 5 positif

# Simulasikan loss keyakinan
losses = np.random.exponential(scale=0.5, size=num_boxes)
# Buat beberapa false alarms negatif bernilai loss tinggi (hard negatives)
losses[7] = 4.2
losses[23] = 3.8
losses[61] = 3.5

mask, n_pos, n_neg = hard_negative_mining(losses, matches, neg_pos_ratio=3)

print("Hasil Eksekusi Hard Negative Mining:")
print(f"Total Default Boxes      : {num_boxes}")
print(f"Sampel Positif Teridentifikasi : {n_pos}")
print(f"Sampel Negatif Terpilih  : {n_neg} (Rasio Negatif:Positif = {n_neg/n_pos:.1f}:1)")
print(f"Total Sampel Masuk Loss  : {np.sum(mask)} ({n_pos + n_neg})")
print(f"Sampel Negatif Dibuang   : {num_boxes - np.sum(mask)} (Easy Negatives diabaikan)")
'''

out_10_8 = run_code_capture_output(code_10_8)

subchapters.append({
    "id": "cv-10-8-ssd-hard-negative-mining",
    "title": "10.8 Hard Negative Mining pada SSD: Rasio Negatif:Positif 3:1 Mengatasi Class Imbalance Latar Belakang",
    "content": r"""Tantangan paling kritis pada detektor satu tahap yang membangkitkan ribuan kotak default secara padat (*dense prior boxes*) adalah **ketimpangan kelas ekstrem (*extreme class imbalance*)**.

**Anatomi Permasalahan**:
Pada SSD-300, terdapat $8.732$ kotak default. Sebuah citra biasa umumnya hanya memuat $2$ hingga $10$ objek nyata (*ground truth*). Setelah pencocokan kotak berdasarkan batas ambang $\text{IOU} \ge 0.5$, hanya belasan kotak yang ditetapkan sebagai sampel positif (*positives*).

Lebih dari $8.700$ kotak sisanya adalah sampel latar belakang (*negatives*). Sebagian besar negatif ini adalah negatif mudah (*easy negatives*) berupa wilayah langit kosong, lantai polos, atau dinding tanpa tekstur. Jika seluruh sampel negatif dihitung dalam fungsi rugi, sinyal gradien akan tenggelam oleh akumulasi ribuan error kecil dari latar belakang, mencegah jaringan mempelajari pemisahan fitur objek yang diskriminatif.

**Mekanisme Hard Negative Mining**:
Untuk mengatasi ketimpangan ini tanpa merusak konvergensi gradien, Liu et al. (2016) merancang strategi **Hard Negative Mining**:
1. Hitung nilai kerugian klasifikasi keyakinan (*confidence loss*) untuk seluruh kotak default negatif menggunakan fungsi *cross-entropy*:

$$\mathcal{L}_{\text{conf}}^i = -\log(\hat{c}_{i0})$$

2. Urutkan seluruh kotak default negatif berdasarkan nilai kerugiannya secara menurun. Kotak dengan nilai kerugian tertinggi disebut **Hard Negatives** (wilayah latar belakang yang secara keliru diprediksi sebagai objek dengan keyakinan tinggi).
3. Pilih sejumlah $N_{\text{neg}}$ sampel negatif teratas sehingga rasio terhadap jumlah sampel positif $N_{\text{pos}}$ terkendali secara ketat:

$$N_{\text{neg}} \le 3 \cdot N_{\text{pos}}$$

4. Seluruh sisa sampel negatif mudah (*easy negatives*) diabaikan (*masked out*) dari fungsi rugi *backpropagation*.

Strategi ini terbukti secara empiris meningkatkan stabilitas pelatihan dan mempercepat laju konvergensi model.""",
    "codeSnippet": code_10_8,
    "expectedOutput": out_10_8,
    "commonPitfalls": [
        "Memilih hard negatives secara global melintasi batch daripada per citra, yang dapat menyebabkan citra dengan banyak objek mendominasi citra dengan sedikit objek.",
        "Lupa menangani kondisi edge case ketika suatu citra tidak memuat objek sama sekali ($N_{\\text{pos}} = 0$), yang dapat memicu kesalahan pembagian dengan nol jika tidak diproteksi."
    ],
    "quiz": {
        "question": "Berapakah rasio perbandingan jumlah sampel negatif terhadap positif yang secara kanonikal dipertahankan pada algoritma Hard Negative Mining SSD?",
        "options": [
            "1 : 1",
            "3 : 1",
            "10 : 1",
            "100 : 1"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Liu et al. menetapkan rasio negatif terhadap positif maksimal 3:1 sebagai batas optimal untuk menjaga keseimbangan sinyal gradien antara fitur objek dan latar belakang."
    }
})

# ==============================================================================
# Subbab 10.9: Non-Maximum Suppression (Greedy vs Soft-NMS)
# ==============================================================================
code_10_9 = r'''import numpy as np

# Implementasi Komparatif: Greedy NMS vs Soft-NMS (Linear & Gaussian Decay)

def compute_iou_xyxy(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    inter = max(0.0, xB - xA) * max(0.0, yB - yA)
    areaA = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    areaB = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
    union = areaA + areaB - inter
    return inter / union if union > 0 else 0.0

def greedy_nms(boxes, scores, iou_thresh=0.5):
    order = np.argsort(-scores).tolist()
    keep = []
    
    while order:
        idx = order.pop(0)
        keep.append(idx)
        order = [i for i in order if compute_iou_xyxy(boxes[idx], boxes[i]) <= iou_thresh]
        
    return keep

def soft_nms(boxes, scores, iou_thresh=0.5, sigma=0.5, method='gaussian', score_thresh=0.1):
    N = len(boxes)
    current_scores = scores.copy()
    keep_indices = []
    
    for i in range(N):
        # Ambil skor tertinggi dari sisa box
        max_idx = i + np.argmax(current_scores[i:])
        # Tukar posisi ke i
        boxes[[i, max_idx]] = boxes[[max_idx, i]]
        current_scores[[i, max_idx]] = current_scores[[max_idx, i]]
        
        pos_box = boxes[i]
        pos_score = current_scores[i]
        
        if pos_score < score_thresh:
            break
        keep_indices.append(i)
        
        # Turunkan skor box yang tersisa
        for j in range(i + 1, N):
            iou = compute_iou_xyxy(pos_box, boxes[j])
            if method == 'linear':
                if iou >= iou_thresh:
                    current_scores[j] *= (1.0 - iou)
            elif method == 'gaussian':
                current_scores[j] *= np.exp(-(iou ** 2) / sigma)
                
    return keep_indices, current_scores[keep_indices]

# Skenario: Dua orang berjalan bersisian (kotak tumpang tindih tinggi IoU = 0.58)
test_boxes = np.array([
    [50, 50, 150, 200],   # Orang 1 (skor 0.95)
    [70, 50, 165, 200],   # Orang 2 berdekatan (skor 0.88, IoU ~ 0.58)
    [52, 53, 148, 198]    # Duplikasi Orang 1 (skor 0.75, IoU ~ 0.90)
], dtype=np.float32)
test_scores = np.array([0.95, 0.88, 0.75], dtype=np.float32)

greedy_res = greedy_nms(test_boxes, test_scores, iou_thresh=0.5)
soft_res_idx, soft_scores = soft_nms(test_boxes.copy(), test_scores.copy(), iou_thresh=0.5, method='gaussian')

print("Perbandingan Non-Maximum Suppression:")
print(f"Greedy NMS (IoU th=0.5)  -> Kotak dipertahankan: {greedy_res} (Orang kedua ikut terhapus!)")
print(f"Soft-NMS (Metode Gaussian)-> Kotak dipertahankan: {soft_res_idx} | Skor baru: {[round(s, 3) for s in soft_scores]}")
'''

out_10_9 = run_code_capture_output(code_10_9)

subchapters.append({
    "id": "cv-10-9-non-maximum-suppression-greedy-vs-soft-nms",
    "title": "10.9 Non-Maximum Suppression: Greedy NMS Berbasis Ambang IoU vs Soft-NMS Kontinu",
    "content": r"""Pada tahap akhir inferensi, detektor objek menghasilkan ribuan kotak kandidat di mana banyak kotak saling bertumpang tindih melingkupi objek yang sama. **Non-Maximum Suppression (NMS)** bertindak sebagai algoritma pembersih krusial untuk menyaring duplikasi ini.

**1. Algoritma Greedy NMS Klasik**:
Greedy NMS bekerja secara iteratif dan deterministik:
1. Urutkan seluruh kotak prediksi berdasarkan skor keyakinannya secara menurun.
2. Pilih kotak dengan skor tertinggi $M$, simpan ke dalam daftar deteksi akhir.
3. Hapus secara mutlak (*hard zeroing*) seluruh kotak lain $b_i$ yang memiliki nilai tumpang tindih $\text{IOU}(M, b_i) \ge N_t$, di mana $N_t$ adalah ambang batas (biasanya $0.5$).
4. Ulangi langkah 2–3 untuk sisa kotak hingga daftar kosong.

**Keterbatasan Fatal Greedy NMS**:
Jika dua objek nyata berada saling bersebelahan atau saling menutupi (*occlusion*, misalnya dua penumpang di dalam kereta atau kerumunan pejalan kaki), kotak objek kedua akan memiliki IoU tinggi terhadap kotak objek pertama. Greedy NMS akan menghapus kotak objek kedua secara permanen, menimbulkan kesalahan *false negative* yang merusak metrik *recall*.

**2. Soft-NMS (Bodla et al. 2017)**:
Navaneeth Bodla et al. (2017) mengusulkan **Soft-NMS** yang mengganti penghapusan biner dengan **degradasi skor kontinu**. Kotak yang tumpang tindih tidak langsung dibuang, melainkan skor keyakinannya diturunkan secara proporsional sesuai tingkat tumpang tindihnya:

- **Aturan Linear**:
$$s_i = \begin{cases} s_i, & \text{IOU}(M, b_i) < N_t \\ s_i (1 - \text{IOU}(M, b_i)), & \text{IOU}(M, b_i) \ge N_t \end{cases}$$

- **Aturan Gaussian**:
$$s_i = s_i \exp\left( -\frac{\text{IOU}(M, b_i)^2}{\sigma} \right), \quad \forall b_i \notin \mathcal{D}$$

Dengan fungsi Gaussian, tidak ada diskontinuitas ambang batas keras. Kotak milik objek kedua yang berdekatan tetap bertahan dengan skor yang disesuaikan secara anggun, secara konsisten meningkatkan mAP sebesar $1.5 - 2.0\%$ pada dataset padat seperti MS COCO tanpa memerlukan pelatihan ulang parameter model.""",
    "codeSnippet": code_10_9,
    "expectedOutput": out_10_9,
    "commonPitfalls": [
        "Menerapkan NMS melintasi seluruh kelas secara serentak; NMS harus diterapkan secara independen per kelas (*class-wise NMS*) agar box objek dari kelas berbeda tidak saling menghapus.",
        "Memilih nilai parameter $\\sigma$ Gaussian yang terlalu besar, yang menyebabkan duplikasi kotak tidak tertekan secara memadai."
    ],
    "quiz": {
        "question": "Apa kelemahan utama algoritma Greedy NMS standar saat menghadapi kerumunan objek yang saling berdekatan (crowded scenes)?",
        "options": [
            "Membutuhkan waktu komputasi berjam-jam pada CPU.",
            "Dapat menghapus kotak objek nyata kedua jika kotak tersebut memiliki IoU di atas ambang batas terhadap objek pertama.",
            "Mengubah orientasi kotak pembatas secara acak.",
            "Tidak dapat dijalankan pada bahasa pemrograman Python."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Greedy NMS menghapus seluruh kotak kandidat dengan IoU di atas ambang secara mutlak. Ketika dua objek nyata saling menempel atau tumpang tindih, kotak objek kedua akan terhapus sebagai duplikasi palsu."
    }
})

# ==============================================================================
# Subbab 10.10: Trade-Off Akurasi vs Kecepatan (mAP vs FPS)
# ==============================================================================
code_10_10 = r'''import numpy as np

# Pemodelan Kurva Pareto Trade-off Akurasi vs Kecepatan (mAP vs Latensi/FPS)
# Evaluasi pada GPU Standar Industri (Resolusi Uji Standar)

detectors_benchmark = [
    {'name': 'Faster R-CNN (ResNet-101)', 'paradigm': 'Two-Stage', 'mAP_50': 76.4, 'latency_ms': 95.0},
    {'name': 'Faster R-CNN (ResNet-50)',  'paradigm': 'Two-Stage', 'mAP_50': 74.2, 'latency_ms': 68.0},
    {'name': 'SSD-512 (VGG-16)',          'paradigm': 'One-Stage', 'mAP_50': 76.8, 'latency_ms': 52.0},
    {'name': 'SSD-300 (VGG-16)',          'paradigm': 'One-Stage', 'mAP_50': 74.3, 'latency_ms': 22.0},
    {'name': 'YOLOv3-416 (Darknet-53)',   'paradigm': 'One-Stage', 'mAP_50': 75.2, 'latency_ms': 29.0},
    {'name': 'YOLOv4-tiny (CSP-OS)',      'paradigm': 'One-Stage', 'mAP_50': 40.2, 'latency_ms': 5.8}
]

def analyze_efficiency(models):
    for m in models:
        m['fps'] = 1000.0 / m['latency_ms']
        # Rasio Efisiensi mAP per satuan latensi
        m['efficiency_ratio'] = m['mAP_50'] / m['latency_ms']
    return models

results = analyze_efficiency(detectors_benchmark)

print("Analisis Komparatif Akurasi vs Kecepatan Deteksi Objek:")
print(f"{'Model':<28} | {'Paradigma':<9} | {'mAP@50':<6} | {'Latensi':<7} | {'FPS':<6} | {'Efisiensi'}")
print("-" * 75)
for r in results:
    print(f"{r['name']:<28} | {r['paradigm']:<9} | {r['mAP_50']:<6.1f} | {r['latency_ms']:<5.1f}ms | "
          f"{r['fps']:<5.1f} | {r['efficiency_ratio']:.2f}")

# Deteksi Batas Pareto (Pareto Frontier)
# Model dikatakan Pareto-optimal jika tidak ada model lain yang lebih akurat sekaligus lebih cepat
print("\nModel pada Garis Batas Optimal Pareto:")
for r in results:
    is_pareto = True
    for other in results:
        if other['mAP_50'] >= r['mAP_50'] and other['latency_ms'] < r['latency_ms']:
            is_pareto = False
            break
    if is_pareto:
        print(f" -> {r['name']} (mAP: {r['mAP_50']}%, Throughput: {r['fps']:.1f} FPS)")
'''

out_10_10 = run_code_capture_output(code_10_10)

subchapters.append({
    "id": "cv-10-10-accuracy-vs-speed-tradeoff-one-stage-vs-two-stage",
    "title": "10.10 Trade-Off Akurasi vs Kecepatan (mAP vs FPS) Two-Stage vs One-Stage",
    "content": r"""Dalam perancangan sistem visi komputer komputasional, pemilihan arsitektur deteksi objek selalu melibatkan kompromi mendasar (*fundamental engineering trade-off*) antara **akurasi lokalisasi (*Mean Average Precision* / mAP)** dan **latensi komputasi / kecepatan throughput (*Frames Per Second* / FPS)**.

**1. Analisis Spektrum Arsitektur**:
- **Detektor Dua Tahap (Two-Stage)** seperti Faster R-CNN dan Cascade R-CNN mengalokasikan kapasitas representasi besar untuk memproses fitur lokal pada resolusi tinggi secara berulang. Hasilnya adalah presisi batas spasial yang sangat tinggi (unggul pada tolok ukur ketat COCO mAP@[0.50:0.95]), namun terbebani latensi inferensi $60 - 100+$ ms per citra ($10 - 15$ FPS). Paradigma ini ideal untuk aplikasi medis, inspeksi cacat manufaktur presisi, dan analisis forensik di mana akurasi menjadi prioritas mutlak.
- **Detektor Satu Tahap (One-Stage)** seperti keluarga YOLO dan SSD menghilangkan tahapan proposal terpisah dan komputasi per-wilayah. Dengan mengevaluasi citra dalam satu *pass* terpadu, latensi dapat ditekan ke kisaran $5 - 30$ ms ($30 - 170+$ FPS) dengan mAP kompetitif. Paradigma ini menjadi pilihan wajib untuk sistem otonom waktu-nyata, pelacakan robotik, dan perangkat *edge computing* berdaya komputasi terbatas.

**2. Formulasi Metrik dan Batas Optimal Pareto (*Pareto Frontier*)**:
Throughput waktu-nyata didefinisikan sebagai invers dari total waktu pemrosesan perangkat keras:

$$\text{FPS} = \frac{1000}{t_{\text{backbone}} + t_{\text{neck}} + t_{\text{head}} + t_{\text{nms}}} \quad (\text{dalam milidetik})$$

Sebuah arsitektur model $d \in \mathcal{D}$ dinyatakan **Pareto-optimal** jika tidak ada arsitektur lain $d'$ yang memiliki akurasi lebih tinggi sekaligus waktu latensi yang lebih rendah:

$$\mathcal{P} = \{d \in \mathcal{D} \mid \nexists d' \in \mathcal{D} : \text{mAP}(d') \ge \text{mAP}(d) \land \text{latensi}(d') \le \text{latensi}(d)\}$$

Evolusi detektor modern (YOLOv3, YOLOv4, SSD) secara sistematis menggeser kurva batas Pareto ke arah kanan-atas: mencapai akurasi setara detektor dua tahap generasi sebelumnya dengan kecepatan operasi berkali-kali lipat lebih gesit.""",
    "codeSnippet": code_10_10,
    "expectedOutput": out_10_10,
    "commonPitfalls": [
        "Membandingkan FPS antar model tanpa menyamakan spesifikasi perangkat keras GPU/CPU dan resolusi citra input.",
        "Mengukur latensi murni model tanpa menyertakan waktu eksekusi algoritma pasca-pemrosesan Non-Maximum Suppression (NMS)."
    ],
    "quiz": {
        "question": "Model deteksi objek manakah yang paling sesuai untuk deployment pada kamera mobil otonom berkecepatan tinggi yang mensyaratkan latensi inferensi di bawah 30 ms?",
        "options": [
            "Faster R-CNN dengan backbone ResNet-101 murni (latensi ~95 ms).",
            "Model detektor satu tahap berbobot efisien seperti YOLOv3-416 atau SSD-300 (latensi ~22-29 ms).",
            "Algoritma Selective Search tanpa GPU.",
            "Deformable Parts Model (DPM) klasik berbasis CPU."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Detektor satu tahap (YOLOv3, SSD) dirancang khusus untuk memproses inferensi dalam satu pass cepat, memberikan latensi di bawah 30 ms yang menjamin respons waktu-nyata pada sistem kemudi otonom."
    }
})

output_path = os.path.join(os.path.dirname(__file__), "cv_ch10_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 10 data with {len(subchapters)} subchapters: {output_path}")
