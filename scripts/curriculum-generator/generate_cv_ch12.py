# -*- coding: utf-8 -*-
"""
Generator untuk Bab 12: Segmentasi Instans (Mask R-CNN & Panoptik) (10 Subbab)
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
# Subbab 12.1: Taksonomi Segmentasi
# ==============================================================================
code_12_1 = r'''import numpy as np

# Simulasi Perbedaan Representasi Data:
# Segmentasi Semantik vs Segmentasi Instans vs Segmentasi Panoptik
# Citra simulasi berdimensi 6x8 dengan 2 mobil (things) dan jalan (stuff)

H, W = 6, 8

# 1. Segmentasi Semantik: Hanya label kelas (0: Latar, 1: Jalan, 2: Mobil)
semantic_mask = np.zeros((H, W), dtype=np.int32)
semantic_mask[2:6, :] = 1      # Jalan
semantic_mask[3:5, 1:3] = 2    # Mobil A
semantic_mask[3:5, 4:7] = 2    # Mobil B (label kelas sama dengan Mobil A!)

# 2. Segmentasi Instans: Daftar objek 'things' dengan ID instans dan bounding box
instance_objects = [
    {'id': 101, 'class_name': 'Mobil', 'class_id': 2, 'box': [3, 1, 4, 2], 'mask': np.zeros((H, W), dtype=bool)},
    {'id': 102, 'class_name': 'Mobil', 'class_id': 2, 'box': [3, 4, 4, 6], 'mask': np.zeros((H, W), dtype=bool)}
]
instance_objects[0]['mask'][3:5, 1:3] = True
instance_objects[1]['mask'][3:5, 4:7] = True

# 3. Segmentasi Panoptik: Pasangan (Kategori Semantik, Instance ID) untuk SETIAP piksel
panoptic_category = semantic_mask.copy()
panoptic_instance = np.zeros((H, W), dtype=np.int32)
panoptic_instance[3:5, 1:3] = 101  # Mobil 1
panoptic_instance[3:5, 4:7] = 102  # Mobil 2

print("Taksonomi Representasi Segmentasi:")
print(f"Dimensi Citra Uji: {H}x{W} piksel")
print("1. Semantik Mask (Piksel Mobil A vs B bernilai identik 2):\n", semantic_mask[3:5, :])
print("2. Instans ID    (Diferensiasi Eksplisit Mobil 101 vs 102):\n", panoptic_instance[3:5, :])
print(f"3. Panoptik Unifikasi: {np.sum(panoptic_category == 1)} piksel Stuff (Jalan) + "
      f"2 objek Things ({len(instance_objects)} mobil terpisah)")
'''

out_12_1 = run_code_capture_output(code_12_1)

subchapters.append({
    "id": "cv-12-1-instance-segmentation-taxonomy",
    "title": "12.1 Taksonomi Segmentasi: Segmentasi Instans vs Semantik vs Panoptik",
    "content": r"""Dalam taksonomi visi komputer tingkat lanjut, tugas segmentasi citra terbagi menjadi tiga tingkatan representasi visual dengan karakteristik dan tujuan yang berbeda:

**1. Segmentasi Semantik (*Semantic Segmentation*)**:
Mengelompokkan setiap piksel pada citra ke dalam kategori kelas semantik ($c \in \mathcal{C}$) tanpa memperhitungkan jumlah atau identitas objek individu.
- **Karakteristik**: Bersifat *instance-agnostic*. Wilayah amorf tak terhitung (*stuff* seperti jalan, langit, rumput) dan objek terhitung (*things* seperti mobil, orang) diperlakukan secara seragam.
- **Keterbatasan**: Dua objek dari kelas yang sama yang saling bersentuhan akan menyatu menjadi satu segmen utuh tanpa batas pemisah.

**2. Segmentasi Instans (*Instance Segmentation*)**:
Mendeteksi, melokalisasi, dan mendelineasi batas piksel dari setiap entitas visual individual yang dapat dihitung (**"Things"**).
- **Karakteristik**: Memadukan kekuatan deteksi objek (*object detection*) dan segmentasi semantik. Tiap objek target diberikan pasangan keluaran: sebuah label kategori kelas, kotak pembatas (*bounding box*), dan sebuah topeng biner (*binary segmentation mask*) beresolusi piksel yang membedakan objek tersebut dari objek sejenis lainnya.
- **Batasan**: Mengabaikan wilayah latar belakang amorf (*stuff*) yang tidak memiliki bentuk batas terdefinisi.

**3. Segmentasi Panoptik (*Panoptic Segmentation*)**:
Diperkenalkan oleh Alexander Kirillov et al. (2019), segmentasi panoptik menyatukan segmentasi semantik dan instans ke dalam satu kerangka terpadu holistik:

$$\gamma: p \mapsto (c_p, z_p) \in \mathcal{C} \times \mathbb{N}$$

Di mana untuk setiap piksel $p$:
- $c_p \in \mathcal{C} = \mathcal{C}_{\text{things}} \cup \mathcal{C}_{\text{stuff}}$ merepresentasikan label kategori kelas semantik.
- $z_p \in \mathbb{N}$ merepresentasikan identitas instans unik (*instance ID*). Jika piksel milik kelas *stuff*, nilai $z_p$ kosong atau nol.""",
    "codeSnippet": code_12_1,
    "expectedOutput": out_12_1,
    "commonPitfalls": [
        "Mencampuradukkan istilah 'things' dan 'stuff'; things adalah objek diskrit terhitung dengan batas geometris jelas (mobil, orang), sedangkan stuff adalah wilayah amorf kontinu tak berhitung (langit, air, jalan).",
        "Mengasumsikan segmentasi instans melabeli seluruh piksel pada citra; segmentasi instans hanya memproses wilayah yang melingkupi objek target dan mengabaikan latar belakang."
    ],
    "quiz": {
        "question": "Manakah pernyataan yang paling akurat membedakan Segmentasi Panoptik dari Segmentasi Instans?",
        "options": [
            "Segmentasi panoptik hanya dapat dijalankan pada citra hitam-putih.",
            "Segmentasi panoptik melabeli seluruh piksel citra secara holistik (menyatukan kelas latar 'stuff' dan objek individual 'things'), sedangkan segmentasi instans hanya berfokus pada delineasi objek 'things'.",
            "Segmentasi panoptik tidak menghasilkan mask piksel.",
            "Segmentasi panoptik tidak memerlukan proses pelatihan berbasis deep learning."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Segmentasi panoptik mengintegrasikan pemahaman global seluruh citra dengan memberikan label semantik pada setiap piksel, mencakup wilayah kontinu (stuff) sekaligus memisahkan identitas tiap objek individual (things)."
    }
})

# ==============================================================================
# Subbab 12.2: Mask R-CNN
# ==============================================================================
code_12_2 = r'''import numpy as np

# Arsitektur Multi-Task Mask R-CNN (He et al. 2017)
# 3 Cabang Paralel pada Setiap RoI: Klasifikasi, Bounding Box Regresi, dan Mask FCN

class MockMaskRCNNRoIHead:
    def __init__(self, num_classes=80, mask_resolution=28):
        self.num_classes = num_classes
        self.mask_res = mask_resolution
        
    def forward(self, roi_feature_7x7):
        # roi_feature_7x7: tensor (N_roi, 7, 7, 256)
        num_rois = roi_feature_7x7.shape[0]
        
        # Cabang 1: Klasifikasi Kelas (Softmax)
        cls_logits = np.random.randn(num_rois, self.num_classes)
        
        # Cabang 2: Regresi Bounding Box (4 offset per kelas atau class-agnostic)
        bbox_deltas = np.random.randn(num_rois, 4)
        
        # Cabang 3: Mask Branch (FCN kecil memprediksi mask mxm untuk setiap kelas K)
        # Dimensi output: (N_roi, K, mask_res, mask_res)
        mask_logits = np.random.randn(num_rois, self.num_classes, self.mask_res, self.mask_res)
        
        return cls_logits, bbox_deltas, mask_logits

head = MockMaskRCNNRoIHead(num_classes=20, mask_resolution=28)
dummy_rois = np.zeros((4, 7, 7, 256), dtype=np.float32)
cls_out, box_out, mask_out = head.forward(dummy_rois)

print("Keluaran Multi-Task Head Mask R-CNN untuk 4 RoI:")
print(f"1. Cabang Klasifikasi : {cls_out.shape} -> Logits untuk {cls_out.shape[1]} kelas")
print(f"2. Cabang Bounding Box: {box_out.shape} -> 4 koordinat delta [tx, ty, tw, th]")
print(f"3. Cabang Mask FCN    : {mask_out.shape} -> {mask_out.shape[1]} kanal mask biner beresolusi 28x28")
print(f"Total Mask Terprediksi per RoI: {mask_out.shape[1]} mask (Decoupled per kelas)")
'''

out_12_2 = run_code_capture_output(code_12_2)

subchapters.append({
    "id": "cv-12-2-mask-rcnn-architecture",
    "title": "12.2 Mask R-CNN (He et al. 2017): Cabang Mask FCN Paralel Terhadap Klasifikasi dan Regresi Bounding Box",
    "content": r"""Dipublikasikan oleh Kaiming He, Georgia Gkioxari, Piotr Dollár, dan Ross Girshick (2017), **Mask R-CNN** memenangkan Best Paper Award pada ICCV 2017 dan menjadi tolok ukur universal untuk segmentasi instans.

**1. Desain Modular Multi-Task**:
Mask R-CNN memperluas arsitektur Faster R-CNN secara elegan. Pada Faster R-CNN standar, setiap *Region of Interest* (RoI) diproses oleh dua cabang keluaran paralel:
1. **Cabang Klasifikasi (*Classification Branch*)**: Menghasilkan distribusi probabilitas kelas objek $p \in \mathbb{R}^K$.
2. **Cabang Regresi Kotak (*Bounding Box Regression Branch*)**: Menghasilkan 4 parameter offset koordinat $[t_x, t_y, t_w, t_h]$.

Mask R-CNN menambahkan **cabang ketiga yang berjalan secara paralel**:
3. **Cabang Topeng (*Mask Branch*)**: Sebuah sub-jaringan FCN (*Fully Convolutional Network*) kecil yang memprediksi *segmentation mask* beresolusi piksel $m \times m$ (kanonikal $28 \times 28$) untuk setiap RoI.

**2. Formulasi Multi-Task Loss**:
Fungsi rugi gabungan multi-tugas dioptimalkan secara simultan selama pelatihan:

$$\mathcal{L} = \mathcal{L}_{\text{cls}} + \mathcal{L}_{\text{box}} + \mathcal{L}_{\text{mask}}$$

Di mana $\mathcal{L}_{\text{cls}}$ adalah fungsi rugi klasifikasi log-loss, $\mathcal{L}_{\text{box}}$ adalah *Smooth L1 loss* untuk regresi koordinat kotak pembatas, dan $\mathcal{L}_{\text{mask}}$ adalah rata-rata *binary cross-entropy loss* piksel-demi-piksel pada cabang mask.

**3. Prinsip Paralelisme Penuh**:
Berbeda dengan sistem segmentasi terdahulu yang bergantung pada klasifikasi berurutan (misal: klasifikasi mendikte mask, atau mask mendikte klasifikasi), Mask R-CNN mengeksekusi ketiga cabang secara paralel. Penambahan komputasi cabang mask hanya menambahkan sedikit *overhead* (~$20\%$ latensi tambahan dibanding Faster R-CNN), memungkinkan inferensi berlangsung pada kecepatan $\sim 5$ FPS dengan presisi luar biasa.""",
    "codeSnippet": code_12_2,
    "expectedOutput": out_12_2,
    "commonPitfalls": [
        "Mengasumsikan cabang mask dieksekusi setelah cabang klasifikasi selesai; ketiga cabang Mask R-CNN dieksekusi secara paralel dari representasi RoI yang sama.",
        "Menggunakan lapisan fully connected pada cabang mask; cabang mask wajib berupa FCN murni agar topologi spasial 2D tidak hancur oleh perataan vektor 1D."
    ],
    "quiz": {
        "question": "Berapakah jumlah cabang keluaran yang diprediksi secara paralel untuk setiap RoI pada arsitektur Mask R-CNN?",
        "options": [
            "1 cabang (hanya mask)",
            "2 cabang (klasifikasi dan bounding box)",
            "3 cabang (klasifikasi, regresi bounding box, dan mask FCN)",
            "4 cabang"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Mask R-CNN menambahkan cabang ketiga (Mask Branch FCN) secara paralel di samping cabang klasifikasi dan cabang regresi bounding box yang diwarisi dari Faster R-CNN."
    }
})

# ==============================================================================
# Subbab 12.3: RoIAlign Revisited
# ==============================================================================
code_12_3 = r'''import numpy as np

# Demonstrasi Komparatif: RoI Pooling (Kuantisasi Kasar) vs RoIAlign (Interpolasi Bilinear)
# Menguji misalignment spasial pada feature map kontinu

def bilinear_interpolate_2d(feat_map, y, x):
    # feat_map shape: (H, W)
    H, W = feat_map.shape
    x0 = int(np.floor(x))
    x1 = min(x0 + 1, W - 1)
    y0 = int(np.floor(y))
    y1 = min(y0 + 1, H - 1)
    
    wa = (x1 - x) * (y1 - y)
    wb = (x1 - x) * (y - y0)
    wc = (x - x0) * (y1 - y)
    wd = (x - x0) * (y - y0)
    
    val = wa * feat_map[y0, x0] + wb * feat_map[y1, x0] + wc * feat_map[y0, x1] + wd * feat_map[y1, x1]
    return val

# Feature map sintetis dengan gradien spasial tajam
H, W = 8, 8
feat = np.arange(H * W, dtype=np.float32).reshape(H, W)

# Koordinat RoI floating-point kontinu: [x1, y1, x2, y2]
# Pada skala citra asli: [15, 15, 63, 63] dengan spatial stride 16 -> RoI di feature map:
roi_cont = np.array([15.0 / 16.0, 15.0 / 16.0, 63.0 / 16.0, 63.0 / 16.0]) # [0.9375, 0.9375, 3.9375, 3.9375]

# 1. Pendekatan RoI Pooling: Kuantisasi Bulat (Round / Floor)
roi_pooled_x1 = int(np.round(roi_cont[0]))
roi_pooled_y1 = int(np.round(roi_cont[1]))
misalignment_pixels = np.abs(roi_cont[:2] - [roi_pooled_x1, roi_pooled_y1]) * 16.0

# 2. Pendekatan RoIAlign: Sampling 4 Titik Bilinear Kontinu pada Pusat Sub-Bin
sample_x = roi_cont[0] + 0.25 * (roi_cont[2] - roi_cont[0])
sample_y = roi_cont[1] + 0.25 * (roi_cont[3] - roi_cont[1])
val_roialign = bilinear_interpolate_2d(feat, sample_y, sample_x)
val_quantized = feat[roi_pooled_y1, roi_pooled_x1]

print("Evaluasi Presisi Spasial RoIAlign vs RoI Pooling:")
print(f"Koordinat Asli RoI Feature Map : [{roi_cont[0]:.4f}, {roi_cont[1]:.4f}]")
print(f"Kuantisasi RoI Pooling Integer : [{roi_pooled_x1}, {roi_pooled_y1}]")
print(f"Pergeseran Spasial pada Citra : {misalignment_pixels[0]:.1f} piksel (Fatal untuk Mask!)")
print(f"Nilai Fitur Interpolasi RoIAlign: {val_roialign:.4f} (Bebas Distorsi Kuantisasi)")
print(f"Nilai Fitur RoI Pooling Kasar  : {val_quantized:.4f}")
'''

out_12_3 = run_code_capture_output(code_12_3)

subchapters.append({
    "id": "cv-12-3-roialign-revisited",
    "title": "12.3 RoIAlign Revisited: Alignment Piksel-ke-Piksel Bebas Kuantisasi untuk Presisi Mask",
    "content": r"""Lapisan standar *RoI Pooling* pada Fast/Faster R-CNN dirancang khusus untuk klasifikasi kotak, namun menjadi penghambat utama ketika diterapkan pada segmentasi instans berpresisi tinggi.

**1. Masalah Kuantisasi Ganda pada RoI Pooling**:
RoI Pooling melakukan pembulatan integer (*harsh quantization*) pada dua tahap komputasi:
1. **Kuantisasi Koordinat Kotak**: Koordinat RoI floating-point kontinu $[x, y, w, h]$ dibagi dengan faktor *stride* spasial (misalnya $16$), lalu dibulatkan ke bilangan bulat: $[x/16] \to \lfloor x/16 \rfloor$.
2. **Kuantisasi Pembagian Bin**: Wilayah RoI dibagi menjadi kisi berukuran $k \times k$ (misalnya $7 \times 7$), di mana batas sub-bin kembali dibulatkan secara paksa.

Operasi kuantisasi ini memicu pergeseran spasial (*spatial misalignment*) sebesar $0.5$ piksel pada *feature map*, yang berakibat pada pergeseran masif sebesar **$8$ hingga $16$ piksel pada resolusi citra asli**. Untuk klasifikasi citra kasar, pergeseran ini dapat ditoleransi. Namun untuk prediksi batas topeng objek (*mask boundaries*), distorsi $8-16$ piksel merusak akurasi mask secara fatal.

**2. Solusi Elegan: RoIAlign**:
Kaiming He et al. merancang **RoIAlign** untuk meniadakan seluruh operasi kuantisasi pembulatan:
- Batas RoI $[x, y, w, h]$ diperlakukan sebagai koordinat kontinu riil ($\mathbb{R}$).
- Setiap bin berukuran $w/k \times h/k$ dibagi menjadi empat titik sampling reguler yang lokasinya ditentukan secara kontinu.
- Nilai fitur pada setiap titik sampling $(x, y)$ dihitung menggunakan **Interpolasi Bilinear (*Bilinear Interpolation*)** dari 4 piksel grid diskrit tetangga terdekatnya pada feature map:

$$f(x, y) = \sum_{i, j} \max(0, 1 - |x - x_i|) \max(0, 1 - |y - y_j|) \, f(x_i, y_j)$$

- Nilai dari empat titik sampling di dalam bin tersebut kemudian diagregasikan menggunakan operasi *max pooling* atau *average pooling*.

Eksperimen membuktikan bahwa penggantian RoI Pooling dengan RoIAlign mendongkrak skor Mask AP sebesar **$3$ hingga $4$ poin penuh**, membuktikan bahwa penjajaran spasial piksel-ke-piksel (*pixel-to-pixel alignment*) adalah fondasi mutlak untuk segmentasi presisi.""",
    "codeSnippet": code_12_3,
    "expectedOutput": out_12_3,
    "commonPitfalls": [
        "Mengasumsikan RoIAlign melakukan pembulatan koordinat; RoIAlign mempertahankan nilai floating-point penuh tanpa pernah membulatkan koordinat batas atau sub-bin.",
        "Menggunakan nearest neighbor interpolation pada RoIAlign; interpolasi bilinear wajib digunakan agar gradien terdiferensiasi secara mulus pada seluruh titik sampling."
    ],
    "quiz": {
        "question": "Mengapa RoIAlign menghasilkan akurasi mask yang jauh lebih tinggi dibandingkan RoI Pooling tradisional pada Mask R-CNN?",
        "options": [
            "Karena RoIAlign melipatgandakan jumlah kanal fitur menjadi 1024 kanal.",
            "Karena RoIAlign meniadakan kuantisasi pembulatan integer dan menggunakan interpolasi bilinear kontinu, menjaga penyelarasan spasial piksel-ke-piksel yang presisi.",
            "Karena RoIAlign menghapus kebutuhan akan GPU.",
            "Karena RoIAlign hanya dapat memproses objek berukuran besar."
        ],
        "correctAnswerIndex": 1,
        "explanation": "RoI Pooling melakukan pembulatan koordinat integer yang menggeser batas objek hingga belasan piksel pada citra asli. RoIAlign menggunakan interpolasi bilinear kontinu tanpa kuantisasi sehingga menyelaraskan posisi mask secara sempurna."
    }
})

# ==============================================================================
# Subbab 12.4: Multi-Task Loss Mask R-CNN
# ==============================================================================
code_12_4 = r'''import numpy as np

# Implementasi Fungsi Rugi Multi-Task Mask R-CNN:
# L_total = L_cls + L_box + L_mask
# L_mask didefinisikan sebagai Binary Cross-Entropy (BCE) per-piksel HANYA pada kelas sejati k*

def compute_mask_rcnn_loss(cls_logits, bbox_pred, mask_logits,
                           gt_class, gt_bbox_delta, gt_mask_binary):
    # 1. Loss Klasifikasi (Cross-Entropy pada seluruh kelas K)
    exp_logits = np.exp(cls_logits - np.max(cls_logits))
    probs = exp_logits / np.sum(exp_logits)
    loss_cls = -np.log(np.maximum(probs[gt_class], 1e-7))
    
    # 2. Loss Regresi Bounding Box (Smooth L1 Loss)
    diff = np.abs(bbox_pred - gt_bbox_delta)
    smooth_l1 = np.where(diff < 1.0, 0.5 * (diff ** 2), diff - 0.5)
    loss_box = np.sum(smooth_l1)
    
    # 3. Loss Mask: Binary Cross-Entropy HANYA pada kanal kelas sejati k* (Decoupling)
    # mask_logits shape: (K, m, m), gt_mask_binary: (m, m)
    k_star_logits = mask_logits[gt_class]
    sig_pred = 1.0 / (1.0 + np.exp(-k_star_logits))
    sig_pred = np.clip(sig_pred, 1e-7, 1.0 - 1e-7)
    
    loss_mask_pixelwise = -(gt_mask_binary * np.log(sig_pred) + (1.0 - gt_mask_binary) * np.log(1.0 - sig_pred))
    loss_mask = np.mean(loss_mask_pixelwise)
    
    total_loss = loss_cls + loss_box + loss_mask
    return total_loss, loss_cls, loss_box, loss_mask

# Simulasi 1 RoI ground truth kelas 3 ('kucing') dengan mask resolusi 4x4
m = 4
K = 5
gt_cls = 3
gt_delta = np.array([0.1, -0.05, 0.2, 0.15], dtype=np.float32)
gt_mask = np.array([
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 0]
], dtype=np.float32)

# Prediksi Model
np.random.seed(42)
pred_logits = np.random.randn(K)
pred_delta = gt_delta + 0.05
pred_masks = np.random.randn(K, m, m)

tot, l_c, l_b, l_m = compute_mask_rcnn_loss(pred_logits, pred_delta, pred_masks, gt_cls, gt_delta, gt_mask)

print("Komponen Multi-Task Loss Mask R-CNN:")
print(f"1. Loss Klasifikasi (Cross-Entropy)      : {l_c:.4f}")
print(f"2. Loss Bounding Box (Smooth L1)        : {l_b:.4f}")
print(f"3. Loss Mask (BCE pada kanal kelas k*={gt_cls}): {l_m:.4f}")
print(f"Total Multi-Task Loss                   : {tot:.4f}")
'''

out_12_4 = run_code_capture_output(code_12_4)

subchapters.append({
    "id": "cv-12-4-multitask-loss-mask-rcnn",
    "title": "12.4 Multi-Task Loss Mask R-CNN: Penambahan L_mask (Binary Cross-Entropy per Piksel per Kelas)",
    "content": r"""Kunci keunggulan arsitektur Mask R-CNN terletak pada perumusan fungsi rugi multi-tugas yang memisahkan (*decoupling*) prediksi mask dari prediksi kategori kelas.

**1. Formulasi Multi-Task Loss**:
Untuk setiap kandidat *Region of Interest* (RoI), didefinisikan fungsi rugi gabungan:

$$\mathcal{L} = \mathcal{L}_{\text{cls}} + \mathcal{L}_{\text{box}} + \mathcal{L}_{\text{mask}}$$

Di mana $\mathcal{L}_{\text{cls}}$ dan $\mathcal{L}_{\text{box}}$ identik dengan formulasi pada Fast/Faster R-CNN.

**2. Formulasi Presisi Cabang Mask**:
Cabang mask menghasilkan luaran berdimensi $K \times m \times m$ untuk setiap RoI, merepresentasikan $K$ buah topeng beresolusi $m \times m$ (satu topeng biner untuk masing-masing dari $K$ kelas target).

Alih-alih menerapkan fungsi *softmax* melintasi seluruh kelas pada setiap piksel (yang memaksakan kompetisi antar-kelas seperti pada FCN segmentasi semantik), Mask R-CNN menerapkan fungsi aktivasi logistik **sigmoid per-piksel**.

Fungsi rugi $\mathcal{L}_{\text{mask}}$ didefinisikan sebagai rata-rata **Binary Cross-Entropy (BCE)** yang dihitung **hanya pada kanal kelas sejati (*ground truth class*) $k^*$**:

$$\mathcal{L}_{\text{mask}} = -\frac{1}{m^2} \sum_{1 \le i, j \le m} \left[ y_{ij} \log \sigma(\hat{y}_{ij}^{k^*}) + (1 - y_{ij}) \log (1 - \sigma(\hat{y}_{ij}^{k^*})) \right]$$

Di mana $y_{ij} \in \{0, 1\}$ adalah label biner ground truth piksel mask pada posisi $(i, j)$, dan $\hat{y}_{ij}^{k^*}$ adalah logit keluaran pada kanal kelas sejati $k^*$. Kanal-kanal kelas lainnya diabaikan dari komputasi fungsi rugi pada langkah tersebut.

**3. Manfaat Arsitektural Decoupling**:
Pemisahan ini memungkinkan model membagi tanggung jawab tugas:
- Cabang klasifikasi bertugas menentukan kategori objek (*what class*).
- Cabang mask bertugas mengekstrak batas siluet biner objek (*spatial silhouette*) tanpa terdistorsi oleh kompetisi probabilitas kelas lain.

Eksperimen He et al. membuktikan bahwa penggunaan sigmoid per-piksel dengan decoupling kelas memberikan peningkatan performa sebesar **$5.5$ poin AP** dibandingkan penggunaan fungsi softmax multikelas konvensional.""",
    "codeSnippet": code_12_4,
    "expectedOutput": out_12_4,
    "commonPitfalls": [
        "Menerapkan aktivasi softmax lintas-kanal pada cabang mask; cabang mask wajib menggunakan sigmoid per-piksel independen agar terhindar dari kompetisi antar-kelas.",
        "Menghitung loss mask pada seluruh $K$ kanal kelas; loss mask hanya dihitung pada kanal milik kelas sejati $k^*$ ground truth."
    ],
    "quiz": {
        "question": "Bagaimana Mask R-CNN memisahkan (decoupling) tugas prediksi mask dari klasifikasi kategori objek?",
        "options": [
            "Dengan melatih dua model terpisah pada dua server berbeda.",
            "Dengan menggunakan aktivasi sigmoid per-piksel dan menghitung Binary Cross-Entropy loss hanya pada kanal mask milik kelas sejati ground truth, menyerahkan penentuan kelas kepada cabang klasifikasi.",
            "Dengan menghapus cabang bounding box regression.",
            "Dengan mengabaikan label anotasi kelas selama pelatihan."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Mask R-CNN menggunakan aktivasi sigmoid dan hanya mengevaluasi kanal mask milik kelas sejati ground truth (BCE loss), sehingga cabang mask hanya fokus membedakan foreground vs background tanpa berkompetisi menentukan label kelas."
    }
})

# ==============================================================================
# Subbab 12.5: Desain Mask Branch
# ==============================================================================
code_12_5 = r'''import numpy as np

# Rancang Bangun Forward-Pass Mask Branch FCN (He et al. 2017)
# Input RoIAlign: (1, 14, 14, 256) -> 4x Conv 3x3 -> Deconv 2x2 -> Conv 1x1 -> (1, K, 28, 28)

def simulate_mask_branch_forward(roi_input_14x14, num_classes=20):
    N, H, W, C = roi_input_14x14.shape
    
    # 1. Empat lapisan konvolusi berturut-turut 3x3 dengan 256 kanal dan padding='same'
    # Dimensi spasial tetap terjaga pada 14x14
    x = roi_input_14x14
    for layer_idx in range(4):
        # Konvolusi mempertahankan bentuk spasial (14, 14, 256) + ReLU
        x = np.maximum(x * 0.9 + 0.1, 0.0)
        
    # 2. Transposed Convolution 2x2 dengan stride 2 (Upsampling 2x)
    # Ekspansi spasial dari 14x14 menjadi 28x28
    upsampled = np.repeat(np.repeat(x, 2, axis=1), 2, axis=2) # Shape: (N, 28, 28, 256)
    
    # 3. Lapisan Konvolusi 1x1 Terakhir untuk Proyeksi ke K Kelas Target
    # Shape: (N, 28, 28, K) -> Ditransposisikan menjadi (N, K, 28, 28)
    mask_logits = upsampled[:, :, :, :num_classes]
    mask_logits = np.transpose(mask_logits, (0, 3, 1, 2))
    
    # 4. Aktivasi Sigmoid Per-Piksel
    mask_probs = 1.0 / (1.0 + np.exp(-mask_logits))
    return mask_logits.shape, mask_probs.shape, mask_probs

dummy_roi = np.ones((1, 14, 14, 256), dtype=np.float32)
logits_shape, probs_shape, probs = simulate_mask_branch_forward(dummy_roi, num_classes=20)

print("Arsitektur Internal Mask Branch FCN:")
print(f"Dimensi Input dari RoIAlign    : {dummy_roi.shape}")
print(f"Dimensi Logits Pasca-Upsampling: {logits_shape} (28x28 piksel untuk 20 kelas)")
print(f"Dimensi Probabilitas Sigmoid   : {probs_shape}")
print(f"Rentang Nilai Probabilitas Mask : [{np.min(probs):.4f}, {np.max(probs):.4f}] (Biner Kontinu)")
'''

out_12_5 = run_code_capture_output(code_12_5)

subchapters.append({
    "id": "cv-12-5-mask-branch-design",
    "title": "12.5 Desain Mask Branch: Output m x m per Kelas K & Decoupling Klasifikasi dari Mask",
    "content": r"""Struktur internal dari **Mask Branch** dirancang secara cermat menggunakan arsitektur konvolusi penuh (*Fully Convolutional Network*) berbobot ringan yang beroperasi di atas fitur yang telah diekstrak oleh RoIAlign.

**1. Alur Komputasi Feed-Forward**:
Fitur RoI yang masuk memiliki resolusi spasial $14 \times 14$ dengan $256$ kanal kedalaman:
1. **Ekstraksi Fitur Spasial**: Fitur dialirkan melalui $4$ lapisan konvolusi berturut-turut berukuran $3 \times 3$ dengan $256$ filter, *stride* 1, dan *padding same*. Setiap lapisan diikuti oleh fungsi aktivasi ReLU. Tahap ini mempertahankan resolusi spasial $14 \times 14 \times 256$.
2. **Upsampling Resolusi Spasial**: Fitur dinaikkan resolusinya sebesar $2\times$ menggunakan lapisan *transposed convolution* $2 \times 2$ dengan *stride* 2, menghasilkan representasi spasial berdimensi $28 \times 28 \times 256$.
3. **Proyeksi Kanal Kelas**: Lapisan konvolusi $1 \times 1$ memproyeksikan $256$ kanal menjadi $K$ kanal luaran (di mana $K$ adalah jumlah kategori kelas objek).
4. **Aktivasi Sigmoid**: Fungsi logistik sigmoid diterapkan pada setiap piksel secara independen:

$$\mathbf{X}_0 \in \mathbb{R}^{14 \times 14 \times 256} \xrightarrow{4 \times \text{Conv}(3\times 3)} \mathbf{X}_4 \in \mathbb{R}^{14 \times 14 \times 256} \xrightarrow{\text{Deconv}(2\times 2, s=2)} \mathbf{X}_5 \in \mathbb{R}^{28 \times 28 \times 256} \xrightarrow{\text{Conv}(1\times 1)} \mathbf{M} \in \mathbb{R}^{K \times 28 \times 28}$$

**2. Keunggulan Representasi FCN vs Lapisan FC**:
Arsitektur terdahulu meratakan (*flattening*) fitur RoI menjadi vektor 1D sebelum memprediksi mask. Perataan ini menghancurkan topologi geometris 2D citra, menuntut jumlah parameter bobot masif yang rentan *overfitting*.

Dengan mempertahankan struktur matriks 2D melalui konvolusi murni, cabang mask Mask R-CNN mampu mengkodekan topologi batas spasial objek secara alami dengan kebutuhan parameter yang sangat efisien.""",
    "codeSnippet": code_12_5,
    "expectedOutput": out_12_5,
    "commonPitfalls": [
        "Mengasumsikan output mask branch adalah resolusi citra asli; output mask branch berukuran tetap $28 \\times 28$, yang kemudian di-resize ke ukuran bounding box asli citra pada tahap pasca-pemrosesan.",
        "Menggunakan konvolusi tanpa padding pada 4 lapisan awal yang akan menyusutkan resolusi sebelum mencapai dekonvolusi."
    ],
    "quiz": {
        "question": "Berapakah ukuran spasial standar dari output segmentation mask yang diprediksi oleh cabang mask FCN pada Mask R-CNN?",
        "options": [
            "7 x 7 piksel",
            "14 x 14 piksel",
            "28 x 28 piksel",
            "224 x 224 piksel"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Cabang mask melakukan upsampling 2x dari input RoIAlign 14x14 menggunakan dekonvolusi sehingga menghasilkan representasi mask kanonikal berukuran 28x28 piksel."
    }
})

# ==============================================================================
# Subbab 12.6: Integrasi FPN sebagai Backbone
# ==============================================================================
code_12_6 = r'''import numpy as np

# Simulasi Penugasan Level Piramida Fitur FPN (Feature Pyramid Networks)
# Formula Linier Kanonikal: k = floor( k0 + log2( sqrt(w * h) / 224 ) )

def assign_fpn_pyramid_level(boxes_xywh, k0=4):
    # boxes_xywh: array shape (N, 4) memuat [x, y, w, h] pada citra skala asli
    widths = boxes_xywh[:, 2]
    heights = boxes_xywh[:, 3]
    areas = widths * heights
    
    # Hitung level piramida k
    scale_factor = np.sqrt(areas) / 224.0
    # Hindari log2(0) dengan clipping
    scale_factor = np.maximum(scale_factor, 1e-6)
    k = np.floor(k0 + np.log2(scale_factor)).astype(np.int32)
    
    # Batasi level dalam rentang piramida ResNet FPN standar [P2, P5]
    k_clipped = np.clip(k, 2, 5)
    return k_clipped, areas

# Beragam variasi ukuran objek pada citra masukan
sample_rois = np.array([
    [10, 10, 32, 32],     # Objek Sangat Kecil (Area: 1024)
    [50, 50, 80, 80],     # Objek Kecil (Area: 6400)
    [100, 100, 224, 224], # Objek Menengah Standar (Area: 50176, sqrt = 224)
    [200, 200, 450, 400]  # Objek Sangat Besar (Area: 180000)
], dtype=np.float32)

levels, areas = assign_fpn_pyramid_level(sample_rois)

print("Penugasan Level Piramida FPN untuk Beragam Skala RoI:")
for idx, (roi, lvl, a) in enumerate(zip(sample_rois, levels, areas)):
    print(f"RoI {idx+1} [Dimensi: {roi[2]:3.0f}x{roi[3]:3.0f} | Area: {a:6.0f}] -> Dialokasikan ke: P{lvl} "
          f"({'Resolusi Spasial Tertinggi' if lvl==2 else 'Receptive Field Terluas' if lvl==5 else 'Resolusi Menengah'})")
'''

out_12_6 = run_code_capture_output(code_12_6)

subchapters.append({
    "id": "cv-12-6-fpn-backbone-integration",
    "title": "12.6 Integrasi FPN sebagai Backbone untuk Deteksi Multi-Skala",
    "content": r"""Implementasi standar Mask R-CNN mengadopsi **Feature Pyramid Networks (FPN)** (Lin et al. 2017) sebagai *backbone* pengekstraksi fitur multi-skala.

**1. Struktur Arsitektur FPN**:
FPN menyusun jalur bawah-ke-atas (*bottom-up*) dan jalur atas-ke-bawah (*top-down*) dengan sambungan lateral (*lateral connections*), menghasilkan piramida tingkat fitur $\{P_2, P_3, P_4, P_5\}$ dengan kedalaman seragam ($256$ kanal):
- **$P_2$ (Stride 4)**: Resolusi spasial tertinggi, menangkap objek-objek berukuran sangat kecil.
- **$P_3$ (Stride 8)**: Resolusi menengah-tinggi untuk objek kecil-menengah.
- **$P_4$ (Stride 16)**: Resolusi menengah untuk objek berskala sedang.
- **$P_5$ (Stride 32)**: Resolusi terendah dengan bidang reseptif terluas untuk objek berskala besar.

**2. Alokasi Tingkat Piramida untuk RoI**:
Selama proses inferensi, proposal RoI memiliki skala spasial yang sangat heterogen. Alih-alih mengekstrak seluruh RoI dari lapisan terakhir, Mask R-CNN mengalokasikan RoI berukuran $w \times h$ ke level piramida fitur $P_k$ tertentu berdasarkan formula kanonikal:

$$k = \left\lfloor k_0 + \log_2 \left( \frac{\sqrt{w h}}{224} \right) \right\rfloor$$

Di mana:
- $224$ adalah dimensi ukuran acuan standar citra ImageNet.
- $k_0 = 4$ adalah tingkat target acuan dasar untuk RoI berukuran $224 \times 224$ (dialokasikan ke $P_4$).
- Jika sebuah RoI berukuran lebih kecil (misalnya $112 \times 112$), nilai $\log_2(112/224) = -1$, sehingga dialokasikan ke level beresolusi lebih tinggi $P_3$.
- Nilai $k$ dibatasi (*clipped*) dalam interval $[2, 5]$.

Fitur RoI yang telah diarahkan ke level $P_k$ yang tepat kemudian dipotong menggunakan RoIAlign beresolusi tetap ($14 \times 14$) sebelum dialirkan ke cabang prediksi.""",
    "codeSnippet": code_12_6,
    "expectedOutput": out_12_6,
    "commonPitfalls": [
        "Mengekstrak seluruh RoI dari satu tingkat fitur saja; tanpa routing multi-skala FPN, deteksi objek kecil akan mengalami penurunan recall drastis.",
        "Lupa melakukan clipping nilai $k$ pada batas [2, 5], yang dapat memicu indeks error jika ada RoI mikroskopis atau raksasa."
    ],
    "quiz": {
        "question": "Ke level piramida FPN manakah sebuah Region of Interest (RoI) berukuran 112x112 piksel akan dialokasikan jika k0 = 4?",
        "options": [
            "Level P2",
            "Level P3 (karena floor(4 + log2(112/224)) = floor(4 - 1) = 3)",
            "Level P4",
            "Level P5"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Menggunakan formula k = floor(4 + log2(sqrt(112*112)/224)) = floor(4 + log2(0.5)) = floor(4 - 1) = 3. RoI dialokasikan ke level P3 beresolusi lebih tinggi."
    }
})

# ==============================================================================
# Subbab 12.7: Panoptic Segmentation
# ==============================================================================
code_12_7 = r'''import numpy as np

# Algoritma Resolusi Fusi Panoptik (Panoptic FPN Fusion)
# Menggabungkan Prediksi 'Things' (Mask R-CNN) dan 'Stuff' (FCN Semantic)

def fuse_panoptic_predictions(things_detections, stuff_segments, canvas_shape=(8, 8)):
    H, W = canvas_shape
    panoptic_cat = np.zeros((H, W), dtype=np.int32)
    panoptic_inst = np.zeros((H, W), dtype=np.int32)
    occupied_mask = np.zeros((H, W), dtype=bool)
    
    # 1. Tempatkan Things terlebih dahulu berdasarkan peringkat skor keyakinan tertinggi
    sorted_things = sorted(things_detections, key=lambda x: -x['score'])
    for obj in sorted_things:
        obj_mask = obj['mask']
        # Wilayah valid yang belum ditempati oleh objek things berkeyakinan lebih tinggi
        valid_pixels = obj_mask & (~occupied_mask)
        if np.sum(valid_pixels) > 0:
            panoptic_cat[valid_pixels] = obj['class_id']
            panoptic_inst[valid_pixels] = obj['instance_id']
            occupied_mask[valid_pixels] = True
            
    # 2. Isi sisa piksel yang kosong dengan prediksi Stuff (Jalan, Langit, dll)
    for stuff in stuff_segments:
        stuff_mask = stuff['mask']
        valid_stuff = stuff_mask & (~occupied_mask)
        if np.sum(valid_stuff) > 0:
            panoptic_cat[valid_stuff] = stuff['class_id']
            panoptic_inst[valid_stuff] = 0  # Stuff tidak memiliki ID instans
            occupied_mask[valid_stuff] = True
            
    return panoptic_cat, panoptic_inst

# Data Dummy
H, W = 6, 6
things = [
    {'instance_id': 101, 'class_id': 2, 'score': 0.95, 'mask': np.zeros((H, W), dtype=bool)},
    {'instance_id': 102, 'class_id': 2, 'score': 0.70, 'mask': np.zeros((H, W), dtype=bool)}
]
things[0]['mask'][1:4, 1:4] = True  # Orang A
things[1]['mask'][2:5, 2:5] = True  # Orang B (tumpang tindih dengan Orang A pada [2:4, 2:4])

stuff = [
    {'class_id': 1, 'mask': np.ones((H, W), dtype=bool)} # Latar Belakang / Rumput
]

p_cat, p_inst = fuse_panoptic_predictions(things, stuff, (H, W))

print("Hasil Fusi Segmentasi Panoptik (Resolusi Konflik Spasial):")
print(f"Canvas Instans ID:\n{p_inst}")
print(f"Jumlah Piksel Milik Orang 101 (Skor 0.95, Prioritas Menang): {np.sum(p_inst == 101)}")
print(f"Jumlah Piksel Milik Orang 102 (Skor 0.70, Sisanya): {np.sum(p_inst == 102)}")
print(f"Jumlah Piksel Latar Belakang Stuff (ID 0): {np.sum(p_inst == 0)}")
'''

out_12_7 = run_code_capture_output(code_12_7)

subchapters.append({
    "id": "cv-12-7-panoptic-segmentation",
    "title": "12.7 Panoptic Segmentation (Kirillov et al. 2019): Unifikasi Label 'Stuff' dan 'Things'",
    "content": r"""Sebelum tahun 2019, segmentasi semantik dan segmentasi instans diteliti dan dikembangkan dalam dua lintasan riset terpisah dengan format anotasi dan metrik evaluasi yang saling tidak kompatibel.

**1. Kerangka Unifikasi Panoptik**:
Alexander Kirillov, Kaiming He, Ross Girshick, Carsten Rother, dan Piotr Dollár (2019) merumuskan **Panoptic Segmentation** sebagai unifikasi matematis komprehensif dari seluruh piksel citra:

$$\mathcal{P} = \{ (c_p, z_p) \mid p \in \Omega \}$$

- Menetapkan label semantik $c_p \in \mathcal{C}$ untuk setiap piksel $p$.
- Menetapkan *instance ID* $z_p$ jika piksel termasuk dalam kategori entitas terhitung (**Things**, $\mathcal{C}_{\text{things}}$).
- Menetapkan $z_p = \text{None}$ (atau 0) jika piksel termasuk dalam wilayah amorf tak berhitung (**Stuff**, $\mathcal{C}_{\text{stuff}}$).

Syarat konsistensi ketat: **Tidak boleh ada piksel yang memiliki lebih dari satu label segmen (non-overlapping constraint)**. Setiap piksel harus memiliki tepat satu pasangan kategori dan instans.

**2. Arsitektur Panoptic FPN**:
Arsitektur Panoptic FPN mengintegrasikan kepala deteksi Mask R-CNN (untuk *things*) dan kepala segmentasi semantik FCN (untuk *stuff*) di atas satu tulang punggung FPN bersama.

**3. Strategi Resolusi Konflik (*Heuristic Fusion*)**:
Karena prediksi dari cabang *things* dan *stuff* dapat saling tumpang tindih secara spasial, diterapkan protokol resolusi fusi deterministik:
1. Urutkan seluruh segmen *things* berdasarkan skor keyakinan deteksi.
2. Tempatkan mask *things* berkeyakinan tertinggi ke kanvas panoptik terlebih dahulu. Wilayah yang telah terisi dikunci (*locked*).
3. Isi wilayah sisa kanvas yang belum terisi dengan prediksi dari cabang *stuff*.
4. Jika terdapat bagian *things* dengan skor rendah yang bertabrakan dengan *stuff* berkeyakinan sangat tinggi, wilayah tersebut diserahkan kepada *stuff*.""",
    "codeSnippet": code_12_7,
    "expectedOutput": out_12_7,
    "commonPitfalls": [
        "Membiarkan piksel memiliki multi-label pada segmentasi panoptik; format panoptik mewajibkan setiap piksel diasosiasikan dengan tepat satu segmen tunggal.",
        "Mengabaikan urutan skor keyakinan saat menggabungkan segmen things yang tumpang tindih."
    ],
    "quiz": {
        "question": "Bagaimana representasi anotasi panoptik memperlakukan piksel yang termasuk dalam kategori 'stuff' (seperti langit atau trotoar)?",
        "options": [
            "Menghapus piksel tersebut dari citra.",
            "Memberikan label kelas semantik yang valid, namun menetapkan nilai instance ID kosong atau nol.",
            "Memberikan ID instans yang berbeda untuk setiap 10 piksel.",
            "Membuat bounding box mengelilingi seluruh langit."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Kelas stuff merupakan wilayah amorf tak berhitung sehingga tidak memiliki batas instans individual. Piksel stuff memiliki label kelas semantik tetapi instance ID-nya bernilai kosong/nol."
    }
})

# ==============================================================================
# Subbab 12.8: Metrik Panoptic Quality
# ==============================================================================
code_12_8 = r'''import numpy as np

# Implementasi Metrik Panoptic Quality (PQ = SQ * RQ) (Kirillov et al. 2019)
# Kriteria Matching Unik: IoU(pred, gt) > 0.5

def compute_panoptic_quality(pred_segments, gt_segments):
    # segments format: dict of {seg_id: {'class': int, 'mask': np.ndarray bool}}
    matched_tp = []
    unmatched_fp = []
    unmatched_fn = list(gt_segments.keys())
    
    # 1. Cari pasangan True Positive dengan IoU > 0.5
    for p_id, p_data in pred_segments.items():
        match_found = False
        for g_id in list(unmatched_fn):
            g_data = gt_segments[g_id]
            # Kelas semantik harus cocok
            if p_data['class'] == g_data['class']:
                inter = np.sum(p_data['mask'] & g_data['mask'])
                union = np.sum(p_data['mask'] | g_data['mask'])
                iou = inter / union if union > 0 else 0.0
                
                # Syarat teorema Kirillov: IoU > 0.5 menjamin pencocokan bipartit unik
                if iou > 0.5:
                    matched_tp.append((iou, p_id, g_id))
                    unmatched_fn.remove(g_id)
                    match_found = True
                    break
        if not match_found:
            unmatched_fp.append(p_id)
            
    num_tp = len(matched_tp)
    num_fp = len(unmatched_fp)
    num_fn = len(unmatched_fn)
    
    # 2. Segmentation Quality (SQ)
    sum_iou = sum([item[0] for item in matched_tp])
    sq = sum_iou / num_tp if num_tp > 0 else 0.0
    
    # 3. Recognition Quality (RQ) -> F1-Score
    rq = num_tp / (num_tp + 0.5 * num_fp + 0.5 * num_fn) if (num_tp + num_fp + num_fn) > 0 else 0.0
    
    # 4. Panoptic Quality (PQ)
    pq = sq * rq
    return pq, sq, rq, num_tp, num_fp, num_fn

# Skenario Uji: 2 GT Segmen, Model memprediksi 2 cocok (TP) dan 1 prediksi palsu (FP)
H, W = 10, 10
gt_segs = {
    1: {'class': 1, 'mask': np.zeros((H, W), dtype=bool)},
    2: {'class': 2, 'mask': np.zeros((H, W), dtype=bool)}
}
gt_segs[1]['mask'][:5, :] = True   # Segmen GT 1
gt_segs[2]['mask'][5:, :] = True   # Segmen GT 2

pred_segs = {
    101: {'class': 1, 'mask': np.zeros((H, W), dtype=bool)}, # Cocok dengan GT 1 (IoU ~ 0.85)
    102: {'class': 2, 'mask': np.zeros((H, W), dtype=bool)}, # Cocok dengan GT 2 (IoU ~ 0.90)
    103: {'class': 2, 'mask': np.zeros((H, W), dtype=bool)}  # False Positive (Objek khayalan)
}
pred_segs[101]['mask'][:4, :] = True
pred_segs[102]['mask'][5:, :8] = True
pred_segs[103]['mask'][8:, 8:] = True

pq_val, sq_val, rq_val, tp_n, fp_n, fn_n = compute_panoptic_quality(pred_segs, gt_segs)

print("Evaluasi Metrik Panoptic Quality (PQ):")
print(f"True Positives (TP): {tp_n} | False Positives (FP): {fp_n} | False Negatives (FN): {fn_n}")
print(f"Segmentation Quality (SQ): {sq_val*100:.2f}% (Presisi Batas Mask)")
print(f"Recognition Quality  (RQ): {rq_val*100:.2f}% (Akurasi Deteksi Segmen)")
print(f"Panoptic Quality     (PQ): {pq_val*100:.2f}% (PQ = SQ x RQ)")
'''

out_12_8 = run_code_capture_output(code_12_8)

subchapters.append({
    "id": "cv-12-8-panoptic-quality-metric",
    "title": "12.8 Metrik Panoptic Quality: PQ = SQ x RQ",
    "content": r"""Untuk mengevaluasi performa segmentasi panoptik secara terpadu, Kirillov et al. (2019) merumuskan metrik **Panoptic Quality (PQ)** yang memadukan akurasi lokalisasi spasial dan ketepatan pengenalan kategori ke dalam satu nilai skalar elegan.

**1. Kriteria Pencocokan Bipartit Unik**:
Sebuah segmen prediksi $p$ dan segmen *ground truth* $g$ dinyatakan sebagai pasangan cocok (**True Positive** / TP) jika dan hanya jika memenuhi dua syarat:
1. Memiliki label kelas semantik yang sama ($c_p = c_g$).
2. Nilai tumpang tindih spasial memenuhi batas ketat:

$$\text{IOU}(p, g) > 0.5$$

**Teorema Keunikan**: Karena $\text{IOU} > 0.5$, secara matematis tidak mungkin ada lebih dari satu segmen prediksi yang cocok dengan satu segmen *ground truth* yang sama. Hal ini menghilangkan ambiguitas penugasan dan meniadakan kebutuhan akan algoritma pencocokan rumit seperti *Hungarian Matching*.

Segmen prediksi tanpa pasangan ground truth diklasifikasikan sebagai **False Positives (FP)**, dan segmen ground truth yang tidak terdeteksi diklasifikasikan sebagai **False Negatives (FN)**.

**2. Dekomposisi Multiplikatif: PQ = SQ x RQ**:
Formula Panoptic Quality didefinisikan secara utuh sebagai:

$$\text{PQ} = \frac{\sum_{(p, g) \in \text{TP}} \text{IOU}(p, g)}{|\text{TP}| + \frac{1}{2}|\text{FP}| + \frac{1}{2}|\text{FN}|}$$

Formula ini secara matematis dapat didekomposisikan secara sempurna menjadi perkalian dua komponen ortogonal yang independen:

$$\text{PQ} = \underbrace{\frac{\sum_{(p, g) \in \text{TP}} \text{IOU}(p, g)}{|\text{TP}|}}_{\text{Segmentation Quality (SQ)}} \times \underbrace{\frac{|\text{TP}|}{|\text{TP}| + \frac{1}{2}|\text{FP}| + \frac{1}{2}|\text{FN}|}}_{\text{Recognition Quality (RQ)}}$$

- **Segmentation Quality (SQ)**: Mengukur rata-rata kualitas geometris batas topeng dari segmen-segmen yang berhasil dikenali secara tepat.
- **Recognition Quality (RQ)**: Merupakan formulasi standar F1-Score yang mengevaluasi performa deteksi dan diskriminasi kategori objek, menghukum kemunculan deteksi palsu dan objek yang terlewat.""",
    "codeSnippet": code_12_8,
    "expectedOutput": out_12_8,
    "commonPitfalls": [
        "Mencocokkan segmen dengan ambang IoU <= 0.5; ambang batas IoU > 0.5 mutlak diperlukan agar relasi pencocokan bipartit bersifat unik dan strictly non-overlapping.",
        "Mengabaikan kelas stuff saat menghitung rata-rata PQ; metrik PQ kanonikal dihitung melintasi seluruh kelas (baik things maupun stuff)."
    ],
    "quiz": {
        "question": "Mengapa kriteria IoU > 0.5 digunakan untuk menentukan pasangan True Positive pada metrik Panoptic Quality (PQ)?",
        "options": [
            "Agar proses komputasi dapat diselesaikan tanpa kartu grafis GPU.",
            "Karena secara matematis batas IoU > 0.5 menjamin bahwa suatu segmen ground truth hanya dapat berpasangan dengan maksimal satu segmen prediksi unik tanpa tumpang tindih.",
            "Karena nilai IoU di bawah 0.5 selalu bernilai imajiner.",
            "Untuk memperbesar nilai skor akhir."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Dua segmen yang masing-masing memiliki IoU > 0.5 dengan segmen target yang sama pasti akan saling bertumpang tindih lebih dari 50%, yang mustahil terjadi pada mask panoptik non-overlapping. Dengan demikian pencocokan dijamin unik."
    }
})

# ==============================================================================
# Subbab 12.9: YOLACT
# ==============================================================================
code_12_9 = r'''import numpy as np

# Implementasi Forward Pass Linear YOLACT (Bolya et al. 2019)
# Mask = Sigmoid( Prototype_Masks @ Mask_Coefficients^T ) diikuti Bounding Box Crop

def yolact_generate_masks(prototype_masks, mask_coefficients, bboxes, img_shape=(32, 32)):
    # prototype_masks: (H_proto, W_proto, k) -> k prototype global
    # mask_coefficients: (N_obj, k) -> koefisien per instans
    # bboxes: (N_obj, 4) -> [y1, x1, y2, x2]
    
    H_p, W_p, k = prototype_masks.shape
    N_obj = mask_coefficients.shape[0]
    
    # 1. Reshape prototype menjadi matriks 2D: (H*W, k)
    proto_flat = prototype_masks.reshape(-1, k)
    
    # 2. Perkalian Matriks Cepat: (H*W, k) @ (k, N_obj) -> (H*W, N_obj)
    raw_masks_flat = np.dot(proto_flat, mask_coefficients.T)
    
    # 3. Kembalikan ke bentuk spasial dan terapkan aktivasi Sigmoid: (N_obj, H_p, W_p)
    raw_masks = raw_masks_flat.T.reshape(N_obj, H_p, W_p)
    sigmoid_masks = 1.0 / (1.0 + np.exp(-raw_masks))
    
    # 4. Pemotongan Bounding Box (Bounding Box Cropping)
    final_masks = np.zeros_like(sigmoid_masks)
    for i in range(N_obj):
        y1, x1, y2, x2 = bboxes[i]
        # Buat crop mask biner
        crop_box = np.zeros((H_p, W_p), dtype=bool)
        crop_box[y1:y2, x1:x2] = True
        final_masks[i] = sigmoid_masks[i] * crop_box
        
    return final_masks

# Simulasi k=4 prototype masks pada resolusi 16x16
np.random.seed(42)
k_prototypes = 4
H_p, W_p = 16, 16
protos = np.random.randn(H_p, W_p, k_prototypes).astype(np.float32)

# Simulasikan 2 instans objek terdeteksi dengan koefisien linear masing-masing
coeffs = np.array([
    [1.5, -0.8, 0.2, 2.1],   # Instans 1
    [-0.5, 2.2, -1.1, 0.4]   # Instans 2
], dtype=np.float32)

boxes = np.array([
    [2, 2, 8, 8],     # Box 1
    [8, 8, 14, 15]    # Box 2
], dtype=np.int32)

masks_out = yolact_generate_masks(protos, coeffs, boxes)

print("Hasil Perakitan Mask Instans YOLACT Real-Time:")
print(f"Dimensi Prototype Masks Global: {protos.shape} (Hanya dievaluasi 1x per citra)")
print(f"Dimensi Vektor Koefisien     : {coeffs.shape}")
print(f"Dimensi Mask Instans Final   : {masks_out.shape} (Dihasilkan via perkalian matriks linear kilat)")
print(f"Aktivasi Mask 1 di dalam Box : {np.mean(masks_out[0, 2:8, 2:8]):.4f}")
print(f"Aktivasi Mask 1 di luar Box  : {np.max(masks_out[0, 10:, 10:]):.4f} (Ter-crop sempurna)")
'''

out_12_9 = run_code_capture_output(code_12_9)

subchapters.append({
    "id": "cv-12-9-yolact-realtime-instance-segmentation",
    "title": "12.9 YOLACT (Bolya et al. 2019): Prototype Mask Linear + Koefisien per-Instans Real-Time",
    "content": r"""Meskipun Mask R-CNN sangat akurat, arsitektur *two-stage* berbasis *repooling* per-wilayah memiliki hambatan latensi yang membatasi kecepatan inferensi pada $\sim 5$ FPS.

Daniel Bolya et al. (2019) memecahkan kebuntuan ini melalui arsitektur **YOLACT** (*You Only Look At CoEfficienTs*), detektor segmentasi instans satu tahap murni pertama yang mampu menembus kecepatan waktu-nyata **$> 30$ FPS** pada GPU standar industri.

**1. Pemisahan Tugas Paralel**:
YOLACT memecah tugas segmentasi instans yang rumit menjadi dua sub-tugas independen yang berjalan serentak:
1. **Protonet (Prototype Generation)**: Sebuah sub-jaringan FCN yang memprediksi sekumpulan $k$ buah **Prototype Masks** $\mathbf{P} \in \mathbb{R}^{H' \times W' \times k}$ (biasanya $k = 32$) untuk seluruh citra secara global. Prototype ini tidak terikat pada satu instans tertentu, melainkan mengkodekan pola bentuk geometris dasar (misalnya tepi kiri, siluet melingkar, kuadran kanan).
2. **Prediction Head (Coefficient Branch)**: Cabang kepala deteksi objek yang memprediksi sebuah vektor **Koefisien Mask** $\mathbf{c} \in \mathbb{R}^k$ untuk setiap kandidat bounding box yang terdeteksi.

**2. Perakitan Mask Melalui Kombinasi Linier Matriks**:
Topeng instans akhir dibentuk melalui **perkalian matriks linier sederhana** antara prototype global dan koefisien instans, diikuti fungsi aktivasi sigmoid:

$$M = \sigma\left( \mathbf{P} \mathbf{c}^T \right)$$

Di mana $\mathbf{P}$ adalah representasi terflaten dari prototype masks ($H'W' \times k$). Setelah itu, mask dipotong (*cropped*) menggunakan kotak pembatas yang diprediksi:

$$M_{\text{final}} = M \odot \mathbf{B}_{\text{crop}}$$

Karena operasi ini tereduksi menjadi satu perkalian dot-product matriks yang sangat teroptimasi pada kartu grafis, perakitan mask berlangsung secara instan tanpa membebani latensi inferensi.""",
    "codeSnippet": code_12_9,
    "expectedOutput": out_12_9,
    "commonPitfalls": [
        "Mengira bahwa setiap prototype mask secara langsung mewakili satu objek utuh; prototype mask hanyalah fungsi basis spasial linear yang baru membentuk objek setelah dikombinasikan dengan koefisiennya.",
        "Lupa melakukan cropping bounding box pasca perkalian matriks; tanpa cropping, mask akan bocor ke luar batas objek."
    ],
    "quiz": {
        "question": "Bagaimana YOLACT mampu menghasilkan segmentation mask instans pada kecepatan real-time di atas 30 FPS?",
        "options": [
            "Dengan mengubah citra menjadi resolusi 16x16 piksel.",
            "Dengan memecah tugas menjadi prediksi prototype masks global dan koefisien mask per-instans, lalu merakit mask akhir via kombinasi linier perkalian matriks cepat.",
            "Dengan menghilangkan fungsi aktivasi sigmoid.",
            "Dengan menonaktifkan algoritma Non-Maximum Suppression."
        ],
        "correctAnswerIndex": 1,
        "explanation": "YOLACT menghindari komputasi lambat cropping fitur berulang per-RoI dengan memprediksi prototype mask citra penuh sekali saja, lalu merakit mask instans individual melalui perkalian matriks linier kilat dengan vektor koefisien."
    }
})

# ==============================================================================
# Subbab 12.10: Forward-Pass Mask Branch NumPy Mandiri
# ==============================================================================
code_12_10 = r'''import numpy as np

# Implementasi Lengkap Forward-Pass Mask Branch NumPy Mandiri:
# RoIAlign Bilinear -> Konvolusi Fitur -> Transposed Conv 2x -> Sigmoid -> Binarisasi & Pasting

def pure_numpy_mask_branch_pipeline(feat_map, box_xyxy, img_shape=(64, 64)):
    # 1. RoIAlign Bilinear Sederhana (Sampling 7x7 dari koordinat continuous box)
    x1, y1, x2, y2 = box_xyxy
    grid_res = 7
    xs = np.linspace(x1, x2, grid_res)
    ys = np.linspace(y1, y2, grid_res)
    
    roi_feat = np.zeros((grid_res, grid_res), dtype=np.float32)
    for r_idx, y in enumerate(ys):
        for c_idx, x in enumerate(xs):
            # Interpolasi bilinear dari feature map
            x0, y0 = int(np.floor(x)), int(np.floor(y))
            x1_c = min(x0 + 1, feat_map.shape[1] - 1)
            y1_c = min(y0 + 1, feat_map.shape[0] - 1)
            wx = x - x0
            wy = y - y0
            val = (1 - wx)*(1 - wy)*feat_map[y0, x0] + wx*(1 - wy)*feat_map[y0, x1_c] + \
                  (1 - wx)*wy*feat_map[y1_c, x0] + wx*wy*feat_map[y1_c, x1_c]
            roi_feat[r_idx, c_idx] = val
            
    # 2. Konvolusi & Aktivasi ReLU
    conv_feat = np.maximum(roi_feat * 1.5 - 0.2, 0.0)
    
    # 3. Transposed Conv Upsampling 2x (7x7 -> 14x14)
    up_feat = np.repeat(np.repeat(conv_feat, 2, axis=0), 2, axis=1)
    
    # 4. Aktivasi Sigmoid
    mask_prob_14x14 = 1.0 / (1.0 + np.exp(-up_feat))
    
    # 5. Binarisasi Mask (Ambang batas tau = 0.5)
    binary_mask = (mask_prob_14x14 >= 0.5).astype(np.uint8)
    
    # 6. Pasting kembali mask ke kanvas citra penuh
    canvas = np.zeros(img_shape, dtype=np.uint8)
    # Tentukan area box integer
    bx1, by1 = int(np.round(x1)), int(np.round(y1))
    bw = int(np.round(x2 - x1))
    bh = int(np.round(y2 - y1))
    
    # Resize mask 14x14 ke ukuran box [bh, bw] via nearest sampling
    if bw > 0 and bh > 0:
        row_indices = (np.linspace(0, 13, bh)).astype(int)
        col_indices = (np.linspace(0, 13, bw)).astype(int)
        pasted_patch = binary_mask[np.ix_(row_indices, col_indices)]
        canvas[by1:by1+bh, bx1:bx1+bw] = pasted_patch
        
    return roi_feat.shape, mask_prob_14x14.shape, np.sum(canvas)

# Uji pipeline pada feature map 16x16
np.random.seed(42)
feature_map_16x16 = np.random.uniform(0.1, 1.0, (16, 16)).astype(np.float32)
target_box = np.array([3.4, 2.8, 10.2, 11.6]) # Koordinat kontinu RoI

s_roi, s_mask, total_pasted = pure_numpy_mask_branch_pipeline(feature_map_16x16, target_box)

print("Verifikasi Forward-Pass Mask Branch NumPy:")
print(f"Ukuran Fitur Ekstraksi RoIAlign: {s_roi}")
print(f"Ukuran Mask Probabilitas Akhir : {s_mask}")
print(f"Total Piksel Mask Terpasang pada Kanvas Citra: {total_pasted} piksel")
print("Status Pipeline: Sukses 100% Eksekusi Komputasi Mandiri!")
'''

out_12_10 = run_code_capture_output(code_12_10)

subchapters.append({
    "id": "cv-12-10-pure-numpy-mask-branch-forward",
    "title": "12.10 Implementasi Forward-Pass Mask Branch NumPy Mandiri",
    "content": r"""Dalam penerapan industri dan sistem produksi headless, memahami alur eksekusi komputasi tingkat rendah (*low-level execution flow*) dari cabang mask Mask R-CNN sangat penting untuk debugging dan optimasi latensi inferensi.

**1. Siklus Hidup Eksekusi Forward-Pass**:
Seluruh siklus komputasi inferensi dari feature map hingga topeng citra akhir melalui 5 tahapan sekuensial:
1. **RoI Sampling Kontinu**: Mengambil koordinat bounding box mengambang $[x_1, y_1, x_2, y_2] \in \mathbb{R}^4$ dari cabang deteksi, mengekstrak kisi spasial beresolusi tetap ($7 \times 7$ atau $14 \times 14$) melalui interpolasi bilinear kontinu bebas kuantisasi.
2. **Transformasi Konvolusi Fitur**: Memproses fitur RoI melalui filter konvolusi berbobot untuk mengekstrak aktivasi spasial siluet bentuk objek.
3. **Upsampling Spasial Terkonvolusi**: Meningkatkan resolusi spasial sebesar $2\times$ menggunakan operasi *transposed convolution* (dari $14 \times 14$ menjadi $28 \times 28$).
4. **Normalisasi Probabilitas Sigmoid**: Memetakan logit kontinu ke rentang probabilitas biner $[0, 1]$.
5. **Binarisasi dan Pengepasan Kanvas (*Pasting*)**:
Topeng probabilitas $28 \times 28$ dibinarisasi menggunakan ambang batas $\tau = 0.5$:

$$B(u, v) = \mathbb{I}(\sigma(M(u, v)) \ge 0.5)$$

Topeng biner $28 \times 28$ tersebut kemudian diskalakan (*resized*) kembali ke dimensi piksel asli dari bounding box $[w_{\text{box}} \times h_{\text{box}}]$, lalu ditempelkan (*pasted*) ke koordinat kanvas citra penuh sesuai lokasi deteksi asal.""",
    "codeSnippet": code_12_10,
    "expectedOutput": out_12_10,
    "commonPitfalls": [
        "Melakukan thresholding biner (>= 0.5) sebelum melakukan resizing ke ukuran citra asli; resizing probabilitas kontinu terlebih dahulu sebelum binarisasi menghasilkan tepi siluet yang jauh lebih halus.",
        "Mengabaikan batas kanvas citra saat menempelkan (pasting) mask; pastikan koordinat box dipotong (clipping) agar tidak melampaui dimensi citra [H, W]."
    ],
    "quiz": {
        "question": "Mengapa disarankan untuk melakukan resizing mask ke ukuran bounding box asli citra sebelum menerapkan ambang batas binarisasi (thresholding 0.5)?",
        "options": [
            "Agar proses komputasi memakan waktu lebih lama.",
            "Karena interpolasi pada nilai probabilitas kontinu menghasilkan batas tepi yang jauh lebih halus (anti-aliased) dibanding meresize mask biner bernilai 0 dan 1 yang memicu tepi bergerigi.",
            "Karena format PNG melarang penggunaan bilangan bulat.",
            "Untuk mengubah citra menjadi hitam-putih."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Melakukan interpolasi pada probabilitas kontinu menghasilkan gradien kehalusan sub-piksel (anti-aliasing) yang alami. Jika mask biner 0/1 di-resize, tepi objek akan tampak bergerigi (pixelated)."
    }
})

output_path = os.path.join(os.path.dirname(__file__), "cv_ch12_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 12 data with {len(subchapters)} subchapters: {output_path}")
