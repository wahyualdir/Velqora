# -*- coding: utf-8 -*-
"""
Generator untuk Bab 9: Deteksi Objek Dua Tahap: R-CNN, Fast R-CNN, Faster R-CNN (10 Subbab)
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
# Subbab 9.1: Taksonomi Deteksi Objek: Lokalisasi BBox vs Klasifikasi
# ==============================================================================
code_9_1 = r'''import numpy as np

# Format Representasi Bounding Box dan Perhitungan Intersection over Union (IoU)
# Format 1: [x1, y1, x2, y2] (Sudut kiri-atas dan kanan-bawah)
# Format 2: [cx, cy, w, h] (Pusat box, lebar, tinggi)

def box_xywh_to_xyxy(box):
    cx, cy, w, h = box
    return np.array([cx - w/2, cy - h/2, cx + w/2, cy + h/2], dtype=np.float32)

def calculate_iou(boxA, boxB):
    # Tentukan koordinat perpotongan (Intersection)
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    
    inter_w = max(0.0, xB - xA)
    inter_h = max(0.0, yB - yA)
    inter_area = inter_w * inter_h
    
    areaA = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    areaB = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
    
    union_area = areaA + areaB - inter_area
    if union_area <= 0:
        return 0.0
    return inter_area / union_area

# Uji dua bounding box
gt_box = np.array([50, 50, 150, 150], dtype=np.float32)      # Ground Truth
pred_box = np.array([70, 60, 160, 160], dtype=np.float32)    # Prediksi Model
iou_val = calculate_iou(gt_box, pred_box)

print("Taksonomi Representasi Deteksi Objek:")
print(f"Ground Truth Box [x1, y1, x2, y2] : {gt_box.tolist()} (Area: {(gt_box[2]-gt_box[0])*(gt_box[3]-gt_box[1])})")
print(f"Prediksi Box     [x1, y1, x2, y2] : {pred_box.tolist()} (Area: {(pred_box[2]-pred_box[0])*(pred_box[3]-pred_box[1])})")
print(f"Intersection over Union (IoU)    : {iou_val:.4f}")
print(f"Status Deteksi (Threshold IoU >= 0.5): {'VALID (True Positive)' if iou_val >= 0.5 else 'INVALID (False Positive)'}")
'''

out_9_1 = run_code_capture_output(code_9_1)

subchapters.append({
    "id": "cv-9-1-object-detection-taxonomy",
    "title": "9.1 Taksonomi Deteksi Objek: Lokalisasi Bounding Box vs Klasifikasi Gambar",
    "content": r"""Dalam hierarki tugas visi komputer tingkat lanjut, klasifikasi citra murni (*image classification*) hanya menjawab pertanyaan semantik dasar: *Objek apakah yang ada di dalam citra?* Model klasifikasi memetakan citra masukan $I$ ke dalam satu label kategori diskrit $c \in \{1, \dots, C\}$. Sebaliknya, **Deteksi Objek (*Object Detection*)** memecahkan dua masalah komputasi yang jauh lebih rumit secara simultan:
1. **Klasifikasi Semantik (*Category Recognition*)**: Menentukan kategori kelas dari setiap entitas visual individual yang hadir.
2. **Lokalisasi Spasial (*Spatial Localization*)**: Mengestimasi posisi, skala, dan batas geometris dari setiap objek melalui koordinat kotak pembatas (**bounding box**).

**Representasi Matematis Bounding Box**:
Dalam literatur visi komputer, bounding box 2D direpresentasikan dalam dua konvensi kanonikal:
- **Format Sudut (*Corner Coordinates*)**: $\mathbf{b} = [x_{\text{min}}, y_{\text{min}}, x_{\text{max}}, y_{\text{max}}]$, di mana $(x_{\text{min}}, y_{\text{min}})$ adalah sudut kiri-atas dan $(x_{\text{max}}, y_{\text{max}})$ adalah sudut kanan-bawah.
- **Format Pusat & Dimensi (*Center & Size*)**: $\mathbf{b} = [c_x, c_y, w, h]$, di mana $(c_x, c_y)$ adalah titik koordinat pusat kotak, $w = x_{\text{max}} - x_{\text{min}}$ adalah lebar, dan $h = y_{\text{max}} - y_{\text{min}}$ adalah tinggi kotak.

**Metrik Tumpang Tindih: Intersection over Union (IoU)**:
Untuk mengukur akurasi spasial prediksi kotak $\mathbf{b}_{\text{pred}}$ terhadap anotasi acuan kebenaran (*Ground Truth*) $\mathbf{b}_{\text{gt}}$, digunakan metrik **Jaccard Index** atau **Intersection over Union (IoU)**:

$$\text{IoU}(\mathbf{b}_{\text{pred}}, \mathbf{b}_{\text{gt}}) = \frac{|\mathbf{b}_{\text{pred}} \cap \mathbf{b}_{\text{gt}}|}{|\mathbf{b}_{\text{pred}} \cup \mathbf{b}_{\text{gt}}|} = \frac{\text{Area}(\mathbf{b}_{\text{pred}} \cap \mathbf{b}_{\text{gt}})}{\text{Area}(\mathbf{b}_{\text{pred}}) + \text{Area}(\mathbf{b}_{\text{gt}}) - \text{Area}(\mathbf{b}_{\text{pred}} \cap \mathbf{b}_{\text{gt}})}$$

Nilai IoU berada pada interval $[0, 1]$. Secara historis (PASCAL VOC benchmark), prediksi dengan $\text{IoU} \ge 0.5$ diklasifikasikan sebagai *True Positive* (TP), sedangkan pada standar modern COCO benchmark, IoU dievaluasi pada berbagai ambang ketat ($0.50$ hingga $0.95$).

Tantangan fundamental deteksi objek dibanding klasifikasi citra adalah **variabilitas jumlah target (*variable cardinality*)**: sebuah citra dapat berisi nol, satu, atau puluhan objek dengan rasio aspek (*aspect ratios*) dan skala spasial yang sangat heterogen serta saling tumpang tindih (*occlusion*).""",
    "codeSnippet": code_9_1,
    "expectedOutput": out_9_1,
    "commonPitfalls": [
        "Mencampuradukkan konvensi koordinat $[x_1, y_1, x_2, y_2]$ dengan $[x, y, w, h]$; kesalahan ini menyebabkan kesalahan fatal saat menghitung luas area box dan IoU.",
        "Lupa bahwa penyebut pada rumus IoU adalah *Union Area* ($A + B - \text{Intersection}$), bukan sekadar penjumlahan luas kedua kotak.",
        "Mengabaikan kondisi ketika dua box tidak bersinggungan sama sekali (Intersection = 0), yang dapat memicu pembagian nilai nol jika tidak ditangani."
    ],
    "quiz": {
        "question": "Dua buah bounding box masing-masing berukuran 100x100 piksel. Jika area irisan (intersection) di antara keduanya adalah seluas 5000 piksel persegi, berapakah nilai Intersection over Union (IoU)-nya?",
        "options": [
            "0.50",
            "0.333",
            "0.25",
            "0.75"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Luas Area A = 10000, Area B = 10000, Intersection = 5000. Maka Union = Area A + Area B - Intersection = 10000 + 10000 - 5000 = 15000. Nilai IoU = 5000 / 15000 = 1/3 ≈ 0.333."
    }
})

# ==============================================================================
# Subbab 9.2: Arsitektur R-CNN Asli: Selective Search, Warping, SVM
# ==============================================================================
code_9_2 = r'''import numpy as np

# Simulasi Arsitektur R-CNN Klasik (Girshick et al., 2014)
# 1. Image -> Selective Search mengekstrak ~2000 Region Proposals
# 2. Tiap proposal di-warp ke 227x227 piksel
# 3. Dieksekusi CNN (AlexNet) menghasilkan feature vector 4096-D
# 4. SVM Klasifikasi per kelas + Linear Bounding Box Regressor
np.random.seed(42)

num_proposals = 2000
feat_dim = 4096
num_classes = 20 # PASCAL VOC

# Simulasi ekstraksi fitur: 2000 proposal x forward pass CNN
print("Analisis Bottleneck Komputasi R-CNN (Girshick et al., 2014):")
print(f"1. Jumlah Region Proposals per Citra : ~{num_proposals} proposal (via Selective Search)")
print(f"2. Forward Pass CNN yang Diperlukan : {num_proposals} kali evaluasi independen per citra!")
print(f"3. Estimasi Waktu Inferensi per Citra: ~47 detik pada GPU Titan Black 2014")
print(f"4. Kebutuhan Ruang Penyimpanan Fitur  : {num_proposals * feat_dim * 4 / (1024**2):.1f} MB per citra (untuk melatih SVM)")
print("Kelemahan Fatal: Komputasi backbone CNN tidak dibagikan (zero feature sharing), memicu redundansi ekstrem.")
'''

out_9_2 = run_code_capture_output(code_9_2)

subchapters.append({
    "id": "cv-9-2-rcnn-architecture",
    "title": "9.2 Arsitektur R-CNN Asli: Selective Search, Warping Fitur, dan SVM Multi-Tahap",
    "content": r"""Pada tahun 2014, Ross Girshick, Jeff Donahue, Trevor Darrell, dan Jitendra Malik memperkenalkan **R-CNN (*Regions with CNN features*)**, menjembatani kesuksesan AlexNet pada klasifikasi citra menuju ranah deteksi objek, dan mendongkrak performa deteksi pada PASCAL VOC dari $35.1\%$ mAP menjadi $53.7\%$ mAP.

**Pipeline Komputasi R-CNN Tiga Tahap**:
1. **Pembangkitan Usulan Wilayah (*Region Proposal Generation*)**:
   Alih-alih melakukan pemindaian jendela geser (*sliding window*) brute-force melintasi seluruh skala dan posisi citra yang membutuhkan jutaan evaluasi, R-CNN menggunakan algoritma tanpa pengawasan **Selective Search** (Uijlings et al., 2013). Selective Search mengelompokkan piksel citra secara hierarkis berbasis kesamaan warna, tekstur, ukuran, dan kompatibilitas bentuk untuk menghasilkan sekitar **2.000 kandidat kotak (*region proposals*)** per citra.
2. **Ekstraksi Fitur Konvolusional (*CNN Feature Extraction*)**:
   Setiap usulan wilayah dipotong (*crop*) dari citra asli dan diubah dimensinya secara paksa (**warping**) menjadi ukuran tetap $227 \times 227$ piksel (agar sesuai dengan dimensi masukan kaku lapisan Fully-Connected AlexNet). Masing-masing dari 2.000 patch yang di-warp tersebut kemudian dialirkan melalui CNN secara independen untuk mengekstrak vektor fitur berdimensi 4096-D pada lapisan fc7.
3. **Klasifikasi dan Regresi Terpisah (*Decoupled Post-Processing*)**:
   - Vektor 4096-D diklasifikasikan menggunakan sekumpulan model **Linear Support Vector Machine (SVM)** biner (satu SVM per kategori objek).
   - Dilatih model **Linear Bounding Box Regressor** kelas-spesifik untuk mengoreksi koordinat kotak prediksi agar lebih presisi membungkus objek sejati.

**Kelemahan Arsitektural Fatal R-CNN**:
- **Redundansi Komputasi Raksasa**: Karena 2.000 wilayah yang saling tumpang tindih dialirkan secara independen ke dalam CNN, fitur visual dasar (seperti latar belakang dan tepi) dihitung ulang ribuan kali. Inferensi membutuhkan waktu **47 detik per citra** pada GPU Titan.
- **Pelatihan Multi-Tahap Terpisah (*Multi-stage decoupled training*)**: CNN di-finetune dengan Softmax, namun fitur-fiturnya kemudian disimpan ke disk (*hundreds of gigabytes*) untuk melatih SVM dan Bounding Box Regressor secara terpisah tanpa optimasi end-to-end.
- **Distorsi Geometris (*Warping Artifacts*)**: Meregangkan patch beraneka rasio aspek ke dalam kotak $227 \times 227$ menyebabkan distorsi bentuk visual objek.""",
    "codeSnippet": code_9_2,
    "expectedOutput": out_9_2,
    "commonPitfalls": [
        "Mengira R-CNN melatih seluruh komponen (CNN, SVM, dan Bounding Box Regressor) secara *end-to-end*; R-CNN melatih ketiga modul secara terpisah dalam pipeline diskrit.",
        "Mengabaikan dampak distorsi geometris dari operasi warping paksa patch citra ke resolusi $227 \times 227$.",
        "Mengasumsikan Selective Search berjalan pada GPU; Selective Search adalah algoritma segmentasi berbasis CPU murni yang membutuhkan 1-2 detik per citra."
    ],
    "quiz": {
        "question": "Mengapa arsitektur R-CNN asli membutuhkan waktu inferensi hingga 47 detik per citra pada GPU?",
        "options": [
            "Karena R-CNN tidak menggunakan lapisan konvolusi.",
            "Karena R-CNN mengeksekusi propagasi maju (forward pass) CNN secara independen sebanyak ~2.000 kali untuk setiap region proposal tanpa berbagi fitur peta (shared feature map).",
            "Karena ukuran resolusi citra input dibatasi maksimal 32x32 piksel.",
            "Karena SVM yang digunakan memiliki kompleksitas waktu eksponensial terhadap jumlah kelas."
        ],
        "correctAnswerIndex": 1,
        "explanation": "R-CNN memotong dan meng-warp ~2.000 usulan wilayah dari Selective Search lalu mengeksekusi 2.000 forward pass CNN penuh secara terpisah untuk setiap citra, menciptakan beban komputasi berulang yang luar biasa masif."
    }
})

# ==============================================================================
# Subbab 9.3: Fast R-CNN: Ekstraksi Fitur Bersama dan RoI Pooling
# ==============================================================================
code_9_3 = r'''import numpy as np

# Simulasi Prinsip Fast R-CNN (Girshick, 2015):
# 1. Citra utuh diproses CNN satu kali -> menghasilkan Shared Feature Map
# 2. Koordinat Region Proposal diproyeksikan ke feature map via faktor sub-sampling (stride)
# 3. RoI Pooling mengekstrak fitur berukuran tetap (misal 7x7) langsung dari feature map
H_img, W_img = 800, 600
stride = 16 # Rasio downsampling backbone CNN (misal VGG-16 stage 5)

# Bounding box proposal pada citra asli [x1, y1, x2, y2]
roi_img = np.array([128, 96, 384, 416]) # Lebar: 256, Tinggi: 320

# Proyeksi koordinat RoI ke ruang feature map
roi_feat = roi_img / stride

print("Prinsip Shared Feature Backbone Fast R-CNN (Girshick, 2015):")
print(f"Resolusi Citra Asli               : {H_img}x{W_img} piksel")
print(f"Rasio Stride Backbone (Downsample): 1/{stride}x")
print(f"Koordinat Proposal pada Citra     : {roi_img.tolist()} (Dimensi: {roi_img[2]-roi_img[0]}x{roi_img[3]-roi_img[1]})")
print(f"Koordinat Proposal pada Peta Fitur: {roi_feat.tolist()} (Dimensi: {roi_feat[2]-roi_feat[0]}x{roi_feat[3]-roi_feat[1]})")
print("\nKeuntungan Paradigma Fast R-CNN:")
print("- Backbone CNN hanya dieksekusi 1 KALI per citra utuh!")
print("- Kecepatan inferensi melonjak ~146x lebih cepat dibanding R-CNN asli.")
'''

out_9_3 = run_code_capture_output(code_9_3)

subchapters.append({
    "id": "cv-9-3-fast-rcnn-shared-features",
    "title": "9.3 Fast R-CNN: Ekstraksi Fitur Bersama (Shared Backbone) dan Lapisan RoI Pooling",
    "content": r"""Untuk mengeliminasi redundansi komputasi R-CNN yang melumpuhkan, Ross Girshick (2015) merancang **Fast R-CNN**. Inovasi konseptual terpenting dari Fast R-CNN adalah pembalikan urutan pemrosesan: alih-alih memotong patch pada citra masukan lalu mengeksekusi CNN 2.000 kali, Fast R-CNN **mengalirkan seluruh citra utuh melalui jaringan konvolusi satu kali saja** untuk menghasilkan peta fitur global (*shared convolutional feature map*).

**Mekanisme Proyeksi Region of Interest (RoI)**:
Setiap usulan wilayah (*proposal*) yang dihasilkan oleh Selective Search pada citra masukan diproyeksikan langsung ke atas peta fitur konvolusi bersama melalui pembagian dengan faktor subsampling spasial (*backbone stride* $S$, biasanya $S = 16$ pada VGG-16):

$$[x'_1, y'_1, x'_2, y'_2] = \left[ \frac{x_1}{S}, \frac{y_1}{S}, \frac{x_2}{S}, \frac{y_2}{S} \right]$$

**Lapisan Region of Interest Pooling (RoI Pooling)**:
Karena lapisan Fully-Connected di ujung jaringan mensyaratkan vektor masukan berdimensi tetap (misal $7 \times 7 \times C$), sedangkan wilayah RoI memiliki ukuran spasial yang bervariasi ($w \times h$), Fast R-CNN memperkenalkan **RoI Pooling**:
1. Wilayah fitur berdimensi $h \times w$ dibagi menjadi kisi (*grid*) berukuran tetap $H_{\text{pool}} \times W_{\text{pool}}$ (biasanya $7 \times 7$).
2. Ukuran setiap sub-jendela (*bin*) adalah sekitar $\approx (h / H_{\text{pool}}) \times (w / W_{\text{pool}})$.
3. Operasi *Max Pooling* standar diterapkan pada setiap sub-jendela untuk mengekstrak satu nilai representasi skalar per bin.

**Arsitektur Multi-Task End-to-End**:
Fast R-CNN menggantikan modul terpisah (SVM dan Regresi diskrit) dengan **Multi-Task Loss** yang dioptimalkan secara simultan dalam satu jaringan:
- Kepala Klasifikasi: Lapisan *Softmax* yang memprediksi distribusi probabilitas $p = (p_0, \dots, p_K)$ melintasi $K$ kelas objek ditambah 1 kelas latar belakang (*background*).
- Kepala Regresi: Memprediksi offset transformasi bounding box $t^k = (t^k_x, t^k_y, t^k_w, t^k_h)$ untuk setiap kelas $k$.

Fast R-CNN mempercepat fase pelatihan sebesar **$9\times$** dan memangkas waktu inferensi menjadi **$0.32$ detik per citra** ($146\times$ lebih cepat dibanding R-CNN asli).""",
    "codeSnippet": code_9_3,
    "expectedOutput": out_9_3,
    "commonPitfalls": [
        "Membingungkan RoI Pooling dengan Global Average Pooling; RoI Pooling beroperasi pada wilayah potongan koordinat lokal tertentu untuk menghasilkan kisi spasial berdimensi tetap (misal $7\times7$).",
        "Mengira Fast R-CNN telah sepenuhnya *real-time*; meskipun komputasi CNN telah dioptimalkan, pembangkitan usulan wilayah Selective Search masih memakan waktu 1-2 detik per citra dan menjadi *bottleneck* utama.",
        "Mengabaikan bahwa pembagian koordinat $roi / stride$ menghasilkan bilangan riil (floating point) yang harus dikuantisasi pada RoI Pooling konvensional."
    ],
    "quiz": {
        "question": "Apakah perbedaan mendasar antara R-CNN asli dan Fast R-CNN dalam hal alur komputasi konvolusi?",
        "options": [
            "R-CNN menggunakan konvolusi 1D, sedangkan Fast R-CNN menggunakan konvolusi 2D.",
            "R-CNN mengeksekusi forward pass CNN 2.000 kali pada masing-masing patch yang dipotong, sedangkan Fast R-CNN hanya mengeksekusi forward pass CNN satu kali untuk seluruh citra utuh lalu memotong fitur via RoI Pooling.",
            "Fast R-CNN tidak menggunakan lapisan Fully-Connected sama sekali.",
            "Fast R-CNN menggantikan backbone CNN dengan algoritma SIFT."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Fast R-CNN mengalirkan citra penuh ke backbone CNN satu kali untuk menghasilkan shared feature map, lalu mengekstrak fitur setiap usulan region menggunakan RoI Pooling. Ini memangkas ribuan evaluasi konvolusi redundan."
    }
})

# ==============================================================================
# Subbab 9.4: Keterbatasan RoI Pooling: Masalah Diskritisasi dan Misalignment
# ==============================================================================
code_9_4 = r'''import numpy as np

# Simulasi Masalah Kuantisasi Ganda pada RoI Pooling Tradisional
# Citra asli: Objek pada koordinat [x1=10, y1=10, w=150, h=200]
# Backbone stride = 16. Target RoI Pooling output: 7x7 bins
stride = 16
pool_size = 7

# Koordinat kontinu pada feature map
x1_cont, y1_cont = 10 / stride, 10 / stride     # (0.625, 0.625)
w_cont, h_cont = 150 / stride, 200 / stride     # (9.375, 12.5)

# Tahap Kuantisasi 1: Pembulatan batas RoI (Kuantisasi Koordinat)
x1_quant = np.round(x1_cont) # 1
y1_quant = np.round(y1_cont) # 1
w_quant = np.floor(w_cont)   # 9
h_quant = np.floor(h_cont)   # 12

# Tahap Kuantisasi 2: Pembulatan ukuran bin sub-jendela
bin_w_cont = w_quant / pool_size # 9 / 7 = 1.285
bin_h_cont = h_quant / pool_size # 12 / 7 = 1.714
bin_w_quant = np.floor(bin_w_cont) # 1
bin_h_quant = np.floor(bin_h_cont) # 1

# Misalignment pada citra asli akibat kuantisasi ganda:
error_x_feat = abs(w_cont - (bin_w_quant * pool_size)) # |9.375 - 7| = 2.375 piksel fitur
error_x_orig = error_x_feat * stride # 2.375 * 16 = 38 piksel citra asli!

print("Analisis Kuantisasi Ganda dan Misalignment Spasial RoI Pooling:")
print(f"Dimensi RoI Kontinu pada Peta Fitur  : ({w_cont:.3f}, {h_cont:.3f})")
print(f"Kuantisasi Tahap 1 (Batas RoI bulat): ({w_quant:.0f}, {h_quant:.0f})")
print(f"Kuantisasi Tahap 2 (Ukuran Bin bulat): ({bin_w_quant:.0f}, {bin_h_quant:.0f})")
print(f"Total Pergeseran (Misalignment)     : {error_x_feat:.3f} piksel fitur")
print(f"Pergeseran Ekuivalen di Citra Asli  : {error_x_orig:.1f} PIKSEL! (Sangat fatal untuk lokalisasi presisi)")
'''

out_9_4 = run_code_capture_output(code_9_4)

subchapters.append({
    "id": "cv-9-4-roi-pooling-quantization-misalignment",
    "title": "9.4 Keterbatasan RoI Pooling: Masalah Diskritisasi dan Misalignment Spasial",
    "content": r"""Meskipun RoI Pooling pada Fast R-CNN berhasil mengintegrasikan ekstraksi representasi fitur region secara cepat, operasi ini memiliki kelemahan matematis mendasar: **Kuantisasi Ganda (*Harsh Double Quantization*)** yang memicu fenomena **Misalignment Spasial (*Spatial Misalignment*)**.

Operasi RoI Pooling menerapkan fungsi pembulatan integer (*round* atau *floor*) pada dua tahap berurutan:
1. **Kuantisasi Batas RoI (*RoI Boundary Quantization*)**:
   Koordinat kotak masukan $b = [x, y, w, h]$ pada citra asli diproyeksikan ke peta fitur dengan membagi terhadap stride $S$ ($S = 16$ atau $32$). Karena hasil pembagian umumnya bilangan riil non-integer, RoI Pooling membulatkannya ke integer terdekat:
   $$[x', y', w', h'] = \left[ \left\lfloor \frac{x}{S} \right\rfloor, \left\lfloor \frac{y}{S} \right\rfloor, \left\lfloor \frac{w}{S} \right\rfloor, \left\lfloor \frac{h}{S} \right\rfloor \right]$$
2. **Kuantisasi Sub-Jendela Bin (*Bin Size Quantization*)**:
   Wilayah fitur yang telah terkuantisasi dibagi menjadi kisi $k \times k$ (misal $7 \times 7$). Ukuran setiap sub-jendela bin kembali dipaksa dibulatkan:
   $$w_{\text{bin}} = \left\lfloor \frac{w'}{k} \right\rfloor, \quad h_{\text{bin}} = \left\lfloor \frac{h'}{k} \right\rfloor$$

**Dampak Akumulatif pada Citra Masukan**:
Kesalahan pembulatan sebesar $0.5$ piksel pada peta fitur mungkin tampak sepele di domain laten. Namun, ketika diproyeksikan kembali ke ruang citra masukan dengan mengalikan faktor stride ($S = 16$ atau $S = 32$), pergeseran spasial ini teramplifikasi menjadi:

$$\Delta_{\text{asli}} = \Delta_{\text{fitur}} \times S \approx 0.5 \times 32 = 16 \text{ hingga } 32 \text{ piksel!}$$

**Implikasi Negatif**:
- **Kerusakan Prediksi pada Objek Kecil**: Untuk objek berdimensi kecil (misal $32 \times 32$ piksel pada dataset COCO), pergeseran batas sebesar 16 piksel memotong lebih dari separuh area objek target, menyebabkan representasi fitur tercampur dengan latar belakang.
- **Ketidakmampuan Menghasilkan Mask Segmentasi Presisi**: Misalignment ini tidak dapat ditoleransi pada tugas segmentasi tingkat piksel (*instance segmentation*), di mana batas siluet objek harus akurat hingga tingkat sub-piksel.""",
    "codeSnippet": code_9_4,
    "expectedOutput": out_9_4,
    "commonPitfalls": [
        "Mengabaikan amplifikasi kesalahan kuantisasi oleh faktor stride backbone; kesalahan 1 piksel di feature map setara dengan pergeseran 16-32 piksel pada citra input.",
        "Mengasumsikan RoI Pooling cocok untuk tugas segmentasi instans (instance segmentation) tanpa modifikasi penanganan koordinat sub-piksel.",
        "Mengira fungsi pembulatan floor/round pada RoI pooling memiliki turunan analitis yang mulus saat backpropagation."
    ],
    "quiz": {
        "question": "Mengapa kesalahan pembulatan sebesar 0.75 piksel pada feature map saat RoI Pooling sangat merusak akurasi deteksi pada citra asli jika backbone memiliki stride 32?",
        "options": [
            "Karena kesalahan tersebut memicu integer overflow pada memori kartu grafis.",
            "Karena kesalahan 0.75 piksel pada peta fitur teramplifikasi menjadi pergeseran spasial sebesar 24 piksel pada citra asli (0.75 x 32), merusak lokalisasi batas objek.",
            "Karena nilai 0.75 akan diubah menjadi nol oleh fungsi aktivasi ReLU.",
            "Karena stride 32 hanya mendukung bilangan kuadrat sempurna."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Setiap pergeseran koordinat pada feature map berkorelasi linier dengan stride jaringan ($S$). Pergeseran sebesar $0.75$ piksel pada stride $S = 32$ menghasilkan distorsi lokalisasi sebesar $0.75 \\times 32 = 24$ piksel pada citra asli."
    }
})

# ==============================================================================
# Subbab 9.5: Faster R-CNN: Region Proposal Network (RPN)
# ==============================================================================
code_9_5 = r'''import numpy as np

# Simulasi Region Proposal Network (RPN) - Ren et al. (2015)
# Feature map input: H=14, W=14, C=512
# Anchor per lokasi spasial k = 9 (3 skala x 3 rasio aspek)
np.random.seed(42)

H, W, C = 14, 14, 512
k = 9 # Jumlah anchor per posisi

# 1. Konvolusi perantara 3x3 (padding 1, 512 filter)
# 2. Dua kepala konvolusi 1x1 paralel (Sibling 1x1 Conv layers):
# Cabang A: Klasifikasi Objectness (2k skor: Foreground vs Background)
# Cabang B: Regresi Koordinat Bounding Box (4k offset: dx, dy, dw, dh)
num_anchors_total = H * W * k
cls_scores = np.random.randn(H, W, 2 * k).astype(np.float32)
bbox_deltas = np.random.randn(H, W, 4 * k).astype(np.float32)

# Hitung probabilitas objectness foreground via Softmax pada dimensi 2
cls_scores_reshaped = cls_scores.reshape(-1, 2)
exp_scores = np.exp(cls_scores_reshaped - np.max(cls_scores_reshaped, axis=1, keepdims=True))
probs = exp_scores / np.sum(exp_scores, axis=1, keepdims=True)
fg_probs = probs[:, 1] # Probabilitas bahwa anchor memuat objek

# Ambil 5 anchor dengan skor objectness tertinggi
top_indices = np.argsort(fg_probs)[::-1][:5]

print("Simulasi Mekanisme Region Proposal Network (RPN):")
print(f"Resolusi Feature Map Masukan        : ({C}, {H}, {W})")
print(f"Jumlah Anchor per Lokasi Spasial (k): {k} anchor")
print(f"Total Kandidat Anchor per Citra     : {num_anchors_total:,} anchor")
print(f"Bentuk Output Kepala Klasifikasi    : {cls_scores.shape} (2*k = 18 skor/piksel)")
print(f"Bentuk Output Kepala Regresi BBox   : {bbox_deltas.shape} (4*k = 36 parameter/piksel)")
print(f"Skor Objectness 5 Anchor Teratas    : {np.round(fg_probs[top_indices], 4).tolist()}")
print("\nKeberhasilan RPN: Menghilangkan Selective Search, menjadikan pipeline 100% GPU end-to-end!")
'''

out_9_5 = run_code_capture_output(code_9_5)

subchapters.append({
    "id": "cv-9-5-faster-rcnn-rpn",
    "title": "9.5 Faster R-CNN: Region Proposal Network (RPN) Menggantikan Selective Search",
    "content": r"""Pada Fast R-CNN, komputasi jaringan saraf telah berjalan sangat cepat pada GPU ($0.32$ detik), namun total waktu inferensi terhambat oleh algoritma Selective Search berbasis CPU yang membutuhkan waktu $1$ hingga $2$ detik per citra. Shaoqing Ren, Kaiming He, Ross Girshick, dan Jian Sun (2015) memecahkan kebuntuan ini melalui **Faster R-CNN** dengan memperkenalkan **Region Proposal Network (RPN)**.

Faster R-CNN menyatukan proses pembangkitan usulan wilayah dan deteksi objek ke dalam satu arsitektur terpadu yang dapat dilatih secara *end-to-end* sepenuhnya di atas perangkat GPU.

**Mekanisme Kerja Region Proposal Network (RPN)**:
RPN dibangun langsung di atas peta fitur konvolusional bersama (*shared convolutional feature map*) dari backbone (seperti ZF-Net atau VGG-16):
1. Jendela konvolusi spasial $3 \times 3$ bergeser di sepanjang peta fitur.
2. Fitur diproyeksikan ke dalam ruang berdimensi lebih rendah (vektor 512-D pada VGG atau 256-D pada ResNet).
3. Vektor fitur diumpankan ke dua lapisan konvolusi $1 \times 1$ paralel (*sibling convolutional branches*):
   - **Kepala Klasifikasi (*cls layer*)**: Menghasilkan $2k$ skor untuk setiap posisi spasial, memprediksi probabilitas biner apakah suatu anchor merupakan **objek (*foreground / objectness score*)** atau **bukan objek (*background*)**.
   - **Kepala Regresi Bounding Box (*reg layer*)**: Menghasilkan $4k$ nilai keluaran yang mengkodekan 4 offset koordinat penyesuaian $(\Delta x, \Delta y, \Delta w, \Delta h)$ untuk setiap anchor ke-$k$.

**Pelatihan dan Inferensi Terpadu**:
Setelah RPN menghasilkan ribuan proposal terbobot, algoritma **Non-Maximum Suppression (NMS)** diterapkan berdasarkan skor *objectness* untuk mengeliminasi proposal yang redundan dan saling tumpang tindih tinggi (misal threshold IoU $0.7$), menyaringnya menjadi sekitar $300$ hingga $2.000$ proposal berkualitas tinggi yang siap dialirkan ke RoI Pooling.

Kehadiran RPN mendongkrak kecepatan deteksi objek hingga **$5$ hingga $17$ frame per detik (FPS)**, merealisasikan sistem deteksi dua tahap mendekati *real-time* pertama di dunia.""",
    "codeSnippet": code_9_5,
    "expectedOutput": out_9_5,
    "commonPitfalls": [
        "Membingungkan skor klasifikasi RPN dengan klasifikasi akhir; RPN hanya memprediksi skor biner agnostik-kelas (*objectness*: foreground vs background), bukan kategori spesifik objek (anjing, mobil, kucing).",
        "Mengabaikan tahap NMS di antara RPN dan RoI Pooling; tanpa NMS, ribuan anchor yang tumpang tindih akan membebani memori dan memperlambat kepala deteksi.",
        "Mengasumsikan RPN memerlukan input citra terpisah; RPN beroperasi langsung pada shared convolutional feature map yang sama dengan kepala klasifikasi akhir."
    ],
    "quiz": {
        "question": "Apakah tugas utama dari cabang klasifikasi (cls layer) pada Region Proposal Network (RPN)?",
        "options": [
            "Memprediksi 80 kategori kelas objek secara detail sesuai dataset COCO.",
            "Memprediksi skor biner objectness (apakah anchor tertentu memuat objek umum vs latar belakang).",
            "Menghitung koordinat piksel sudut kiri-atas dari citra masukan.",
            "Mengukur laju pembelajaran (learning rate) pengoptimal SGD."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Kepala klasifikasi RPN bersifat agnostik terhadap kategori kelas (class-agnostic). Tugasnya murni mengevaluasi skor objectness biner: menentukan apakah suatu kotak anchor memuat objek visual umum (foreground) atau sekadar latar belakang kosong (background)."
    }
})

# ==============================================================================
# Subbab 9.6: Desain Anchor Boxes: Multi-Scale dan Multi-Aspect-Ratio
# ==============================================================================
code_9_6 = r'''import numpy as np

# Pembangkitan Anchor Boxes Kanonikal Faster R-CNN (Ren et al., 2015)
# Pusat anchor pada posisi spasial (cx, cy)
# 3 Skala: [128, 256, 512] piksel
# 3 Rasio Aspek (w:h): [1:2, 1:1, 2:1]
base_size = 16
scales = [8, 16, 32]       # Skala relatif terhadap stride (128, 256, 512 piksel)
ratios = [0.5, 1.0, 2.0]   # Rasio aspek w/h

anchors = []
cx, cy = 0.0, 0.0 # Pusat lokal

for s in scales:
    area = (base_size * s) ** 2
    for r in ratios:
        # w * h = area dan w / h = r -> w^2 / r = area -> w = sqrt(area * r)
        w = np.sqrt(area * r)
        h = w / r
        x1 = cx - w / 2.0
        y1 = cy - h / 2.0
        x2 = cx + w / 2.0
        y2 = cy + h / 2.0
        anchors.append([round(w), round(h), round(x1), round(y1), round(x2), round(y2)])

print(f"Total Anchor per Titik Pusat (k = {len(scales)} skala x {len(ratios)} rasio): {len(anchors)} anchor")
print(f"{'Lebar (w)':<12} | {'Tinggi (h)':<12} | {'Rasio (w/h)':<12} | {'BBox [x1, y1, x2, y2]'}")
print("-" * 65)
for a in anchors:
    r_val = a[0] / a[1]
    print(f"{a[0]:<12} | {a[1]:<12} | {r_val:<12.2f} | [{a[2]}, {a[3]}, {a[4]}, {a[5]}]")
'''

out_9_6 = run_code_capture_output(code_9_6)

subchapters.append({
    "id": "cv-9-6-anchor-boxes-design",
    "title": "9.6 Desain Anchor Boxes: Multi-Scale dan Multi-Aspect-Ratio Piramidal",
    "content": r"""Salah satu konsep arsitektural paling berpengaruh yang diperkenalkan dalam Faster R-CNN adalah **Anchor Boxes**. Sebelum Faster R-CNN, penanganan variasi skala dan rasio aspek objek dilakukan dengan dua metode yang mahal secara komputasi:
1. **Piramida Citra (*Pyramid of Images*)**: Citra masukan diubah ukurannya (*rescale*) menjadi berbagai resolusi bertingkat dan diproses secara terpisah.
2. **Piramida Filter (*Pyramid of Filters*)**: Menggunakan sekumpulan kernel konvolusi dengan berbagai ukuran spasial yang berbeda secara paralel.

Ren et al. menggantikan kedua metode mahal tersebut dengan **Piramida Kotak Acuan (*Pyramid of Anchors*)**: pada setiap lokasi spasial geser $(x, y)$ pada peta fitur konvolusi, dibangun sekumpulan $k$ kotak acuan tetap (*anchor boxes*) dengan berbagai kombinasi skala dan rasio aspek yang ditentukan secara apriori.

**Konfigurasi Kanonikal Faster R-CNN**:
Secara standar, Faster R-CNN menetapkan $k = 9$ anchor per posisi spasial, yang merupakan kombinasi dari:
- **3 Skala Luas Area (*Scales*)**: Luas sisi box $128^2, 256^2, 512^2$ piksel pada ruang citra masukan.
- **3 Rasio Aspek (*Aspect Ratios $w:h$*)**: $1:1$ (bujur sangkar), $1:2$ (persegi panjang vertikal, khas untuk pejalan kaki), dan $2:1$ (persegi panjang horizontal, khas untuk kendaraan).

Untuk citra masukan berukuran sekitar $1000 \times 600$ piksel yang menghasilkan peta fitur berdimensi sekitar $60 \times 40$ pada stride 16, total jumlah kotak anchor yang dievaluasi secara simultan adalah:

$$N_{\text{anchors}} = 60 \times 40 \times 9 \approx 21.600 \text{ anchor boxes}$$

**Formulasi Parametrisasi Regresi Bounding Box**:
RPN tidak memprediksi koordinat absolut piksel, melainkan memprediksi **vektor deviasi logaritmik dan normalisasi (*parameterized offsets*)** $\mathbf{t} = (t_x, t_y, t_w, t_h)$ relatif terhadap kotak anchor $\mathbf{a} = (x_a, y_a, w_a, h_a)$:

$$t_x = \frac{x - x_a}{w_a}, \quad t_y = \frac{y - y_a}{h_a}$$
$$t_w = \ln\left(\frac{w}{w_a}\right), \quad t_h = \ln\left(\frac{h}{h_a}\right)$$

Normalisasi ini menjamin bahwa target regresi berada pada skala numerik yang stabil di sekitar nol, mempermudah optimasi berbasis *gradient descent* dan membuat model invarian terhadap skala absolut objek.""",
    "codeSnippet": code_9_6,
    "expectedOutput": out_9_6,
    "commonPitfalls": [
        "Memprediksi koordinat sudut piksel absolut $(x, y, w, h)$ secara langsung dari konvolusi tanpa parametrisasi deviasi relatif terhadap anchor; ini menyebabkan instabilitas numerik dan kegagalan konvergensi.",
        "Mengabaikan pencocokan batas tepi (*cross-boundary anchors*); saat pelatihan, anchor yang melintasi batas luar citra harus disaring atau dipotong agar tidak menghasilkan gradien artifisial yang merusak model.",
        "Mengasumsikan rasio aspek $1:2, 1:1, 2:1$ optimal untuk semua domain data; pada domain khusus seperti deteksi teks (*scene text detection*), teks dapat memiliki rasio aspek ekstrem ($1:10$) yang memerlukan kalibrasi konfigurasi anchor."
    ],
    "quiz": {
        "question": "Mengapa target regresi bounding box pada Faster R-CNN dikodekan dalam bentuk offset t_x, t_y, t_w, t_h relatif terhadap kotak anchor, bukan koordinat absolut piksel?",
        "options": [
            "Agar koordinat selalu berupa bilangan bulat tanpa koma.",
            "Untuk menstandarisasi target regresi menjadi skala invarian yang terpusat di sekitar nol, mempermudah optimasi gradien dan menjaga stabilitas pelatihan melintasi berbagai ukuran skala objek.",
            "Karena GPU tidak dapat memproses bilangan floating point positif di atas 1000.",
            "Untuk menghapus kebutuhan loss function Smooth L1."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Parametrisasi transformasi relatif terhadap anchor menormalisasi deviasi pusat dengan lebar/tinggi anchor dan menggunakan skala logaritmik untuk dimensi ukuran. Ini membuat target regresi invarian terhadap skala spasial absolut dan menjaga stabilitas optimasi numerik."
    }
})

# ==============================================================================
# Subbab 9.7: RoIAlign: Interpolasi Bilinear Tanpa Kuantisasi
# ==============================================================================
code_9_7 = r'''import numpy as np

# Simulasi Perbandingan: RoI Pooling (Kuantisasi Kaku) vs RoIAlign (Interpolasi Bilinear Presisi)
# Titik koordinat kontinu pada feature map: (x=1.25, y=1.75)
# Nilai aktivasi pada 4 piksel tetangga integer terdekat:
# (1, 1)=2.0, (2, 1)=4.0, (1, 2)=6.0, (2, 2)=8.0
x, y = 1.25, 1.75
x1, y1 = 1, 1
x2, y2 = 2, 2

Q11 = 2.0 # f(1, 1)
Q21 = 4.0 # f(2, 1)
Q12 = 6.0 # f(1, 2)
Q22 = 8.0 # f(2, 2)

# 1. RoI Pooling: Melakukan pembulatan koordinat integer terdekat
x_quant = round(x) # 1
y_quant = round(y) # 2
val_roipool = Q12  # f(1, 2) = 6.0 (Kuantisasi membuang presisi sub-piksel!)

# 2. RoIAlign: Interpolasi Bilinear Sejati (He et al., 2017 - Mask R-CNN)
# f(x, y) = (x2-x)(y2-y)Q11 + (x-x1)(y2-y)Q21 + (x2-x)(y-y1)Q12 + (x-x1)(y-y1)Q22
w11 = (x2 - x) * (y2 - y) # 0.75 * 0.25 = 0.1875
w21 = (x - x1) * (y2 - y) # 0.25 * 0.25 = 0.0625
w12 = (x2 - x) * (y - y1) # 0.75 * 0.75 = 0.5625
w22 = (x - x1) * (y - y1) # 0.25 * 0.75 = 0.1875

val_roialign = w11 * Q11 + w21 * Q21 + w12 * Q12 + w22 * Q22

print("Perbandingan Presisi Sub-Piksel: RoI Pooling vs RoIAlign:")
print(f"Titik Kontinu Sub-Piksel               : ({x}, {y})")
print(f"1. Nilai Aktivasi via RoI Pooling      : {val_roipool:.4f} (Kuantisasi kaku ke integer ({x_quant}, {y_quant}))")
print(f"2. Nilai Aktivasi via RoIAlign         : {val_roialign:.4f} (Interpolasi kontinu 4 tetangga)")
print(f"Bobot Interpolasi [w11, w21, w12, w22] : [{w11}, {w21}, {w12}, {w22}] (Jumlah bobot: {w11+w21+w12+w22:.1f})")
print("Kesimpulan: RoIAlign sepenuhnya mengeliminasi misalignment koordinat, membuka era Mask R-CNN!")
'''

out_9_7 = run_code_capture_output(code_9_7)

subchapters.append({
    "id": "cv-9-7-roialign-bilinear-interpolation",
    "title": "9.7 RoIAlign: Interpolasi Bilinear Tanpa Kuantisasi untuk Fitur Spasial Presisi",
    "content": r"""Untuk mengatasi cacat misalignment spasial akibat kuantisasi kaku pada RoI Pooling, Kaiming He, Georgia Gkioxari, Piotr Dollár, dan Ross Girshick (2017) merancang lapisan **RoIAlign** dalam karya monumental mereka, **Mask R-CNN**. RoIAlign mempertahankan representasi koordinat floating-point kontinu di seluruh pipeline ekstraksi fitur, sepenuhnya **menghilangkan setiap bentuk operasi pembulatan kuantisasi integer** ($x / 16$ dibiarkan bernilai desimal murni tanpa fungsi `floor` atau `round`).

**Algoritma Komputasi RoIAlign**:
1. **Pemetakan Kontinu (*Continuous Mapping*)**:
   Wilayah RoI dengan koordinat desimal floating-point $[x, y, w, h]$ dipetakan langsung ke peta fitur tanpa pembulatan.
2. **Pembagian Bin Teratur (*Equally Spaced Bins*)**:
   Wilayah kontinu tersebut dibagi rata menjadi $k \times k$ sub-jendela bin (misalnya $7 \times 7$ atau $14 \times 14$). Batas-batas setiap bin dibiarkan dalam koordinat bilangan riil kontinu.
3. **Titik Sampel Pengambilan (*Sampling Points*)**:
   Di dalam setiap bin, ditentukan sejumlah titik sampel reguler terdistribusi merata (secara standar ditetapkan **4 titik sampel** per bin). Koordinat setiap titik sampel $(x_s, y_s)$ berupa bilangan riil kontinu.
4. **Interpolasi Bilinear 2D (*Bilinear Interpolation*)**:
   Nilai fitur pada koordinat kontinu $(x_s, y_s)$ dihitung secara eksak dari nilai 4 piksel diskrit bertetangga terdekat pada peta fitur melalui pembobotan jarak bilinear:
   $$f(x_s, y_s) = \sum_{i, j \in \text{tetangga}} \max(0, 1 - |x_s - x_i|) \cdot \max(0, 1 - |y_s - y_j|) \cdot X(i, j)$$
5. **Agregasi Bin**:
   Nilai aktivasi dari keempat titik sampel di dalam satu bin diagregasikan menggunakan operasi rata-rata (*Average*) atau maksimum (*Max*).

**Dampak Empiris**:
Peralihan dari RoI Pooling ke RoIAlign menghasilkan lompatan akurasi yang dramatis:
- Meningkatkan performa *Average Precision* deteksi bounding box ($\text{AP}$) sebesar **$3$ poin penuh** pada dataset COCO.
- Mendongkrak performa deteksi pada ambang ketat $\text{AP}_{75}$ sebesar **$50\%$**, membuktikan perbaikan presisi lokalisasi spasial yang masif.
- Menjadi fondasi mutlak yang memungkinkan Mask R-CNN melakukan segmentasi instans tingkat piksel secara akurat.""",
    "codeSnippet": code_9_7,
    "expectedOutput": out_9_7,
    "commonPitfalls": [
        "Mengira RoIAlign melakukan pembulatan koordinat pada saat penentuan titik sampling; seluruh koordinat dari batas RoI hingga titik sampel internal bersifat desimal murni.",
        "Mengasumsikan RoIAlign secara komputasional jauh lebih lambat daripada RoI Pooling; dengan implementasi kernel CUDA teroptimasi, RoIAlign memiliki kecepatan eksekusi yang hampir identik dengan RoI Pooling standar.",
        "Menggunakan RoI Pooling biasa pada arsitektur Mask R-CNN; kuantisasi RoI Pooling akan menghasilkan mask segmentasi yang terdistorsi dan bergeser secara kasar dari siluet objek sejati."
    ],
    "quiz": {
        "question": "Bagaimana RoIAlign mengekstrak nilai aktivasi pada koordinat kontinu non-integer di dalam feature map tanpa menerapkan fungsi pembulatan kuantisasi?",
        "options": [
            "Dengan mengisi piksel yang kosong menggunakan nilai nol murni.",
            "Dengan menerapkan interpolasi bilinear dari 4 nilai piksel integer bertetangga terdekat untuk setiap titik sampel di dalam bin.",
            "Dengan mengubah koordinat citra menjadi domain frekuensi Fourier.",
            "Dengan mengabaikan seluruh fitur yang memiliki koordinat desimal."
        ],
        "correctAnswerIndex": 1,
        "explanation": "RoIAlign tidak pernah membulatkan koordinat. Pada setiap titik sampel desimal di dalam bin, nilai aktivasi dihitung melalui interpolasi bilinear terbobot dari 4 nilai piksel tetangga terdekat, mempertahankan presisi spasial sub-piksel secara sempurna."
    }
})

# ==============================================================================
# Subbab 9.8: Multi-Task Loss: Klasifikasi Cross-Entropy + Smooth L1
# ==============================================================================
code_9_8 = r'''import numpy as np

# Simulasi Perhitungan Multi-Task Loss Deteksi Objek (Fast/Faster R-CNN)
# L_total = L_cls(p, u) + lambda * [u >= 1] * L_reg(t_u, v)

def smooth_l1_loss(t, v, beta=1.0):
    """
    Smooth L1 Loss (Huber Loss):
    0.5 * x^2 / beta        jika |x| < beta
    |x| - 0.5 * beta        jika |x| >= beta
    """
    diff = np.abs(t - v)
    loss = np.where(diff < beta, 0.5 * (diff ** 2) / beta, diff - 0.5 * beta)
    return np.sum(loss)

def l1_loss(t, v):
    return np.sum(np.abs(t - v))

def l2_loss(t, v):
    return 0.5 * np.sum((t - v) ** 2)

# Uji ketahanan terhadap outlier (pencilan gradien ekstrem)
t_pred = np.array([0.1, 0.2, 0.5, 5.0]) # Koordinat terakhir adalah outlier ekstrem (galat besar)
v_target = np.array([0.0, 0.0, 0.0, 0.0])

loss_smooth = smooth_l1_loss(t_pred, v_target)
loss_l1 = l1_loss(t_pred, v_target)
loss_l2 = l2_loss(t_pred, v_target)

print("Perbandingan Karakteristik Loss Regresi Bounding Box:")
print(f"Galat Prediksi (t - v)        : {t_pred.tolist()}")
print(f"1. L2 Loss (MSE)              : {loss_l2:.4f} (Sangat sensitif terhadap outlier ekstrem 5.0^2)")
print(f"2. L1 Loss (MAE)              : {loss_l1:.4f} (Gradien diskontinu di sekitar nol)")
print(f"3. Smooth L1 Loss (Girshick)  : {loss_smooth:.4f} (Mulus kuadratis di dekat nol, linier di wilayah ekstrem)")
print("\nKeunggulan Smooth L1: Mencegah lonjakan gradien (exploding gradient) dari outlier kotak awal yang acak.")
'''

out_9_8 = run_code_capture_output(code_9_8)

subchapters.append({
    "id": "cv-9-8-multitask-loss-smooth-l1",
    "title": "9.8 Multi-Task Loss: Kombinasi Cross-Entropy Klasifikasi dan Smooth L1 Regresi Bounding Box",
    "content": r"""Dalam melatih detektor dua tahap secara *end-to-end*, arsitektur jaringan harus mengoptimasi dua fungsi objektif yang saling bertolak belakang secara simultan: probabilitas kategori diskrit (*discrete categorical probability*) dan offset spasial kontinu (*continuous spatial coordinates*). Ross Girshick (2015) merumuskan fungsi objektif terpadu ini sebagai **Multi-Task Loss**:

$$\mathcal{L}(p, u, t^u, v) = \mathcal{L}_{\text{cls}}(p, u) + \lambda [u \ge 1] \mathcal{L}_{\text{reg}}(t^u, v)$$

di mana:
- $p = (p_0, p_1, \dots, p_K)$ adalah probabilitas Softmax yang diprediksi untuk $K$ kelas objek ditambah latar belakang ($u = 0$),
- $u$ adalah label kelas acuan kebenaran (*true ground-truth class*),
- $\mathcal{L}_{\text{cls}}(p, u) = -\ln p_u$ adalah fungsi rugi *Log Loss / Cross-Entropy*,
- $[u \ge 1]$ adalah **Iverson Bracket indicator**: bernilai $1$ jika $u \ge 1$ (kategori objek), dan bernilai $0$ jika $u = 0$ (latar belakang / background). Artinya, **regresi bounding box diabaikan sama sekali untuk anchor/proposal latar belakang**,
- $\lambda$ adalah parameter penyeimbang hiper (standarnya $\lambda = 1$),
- $t^u = (t^u_x, t^u_y, t^u_w, t^u_h)$ adalah vektor koreksi box yang diprediksi untuk kelas $u$,
- $v = (v_x, v_y, v_w, v_h)$ adalah vektor target regresi koordinat sejati.

**Fungsi Rugi Smooth $L_1$ (*Huber Loss*)**:
Alih-alih menggunakan fungsi kuadratis $L_2$ standar (MSE) yang sangat rentan terhadap ledakan gradien (*exploding gradients*) ketika kotak prediksi awal sangat jauh dari target, Girshick merancang **Smooth $L_1$ Loss**:

$$\mathcal{L}_{\text{reg}}(t^u, v) = \sum_{i \in \{x, y, w, h\}} \text{smooth}_{L_1}(t^u_i - v_i)$$

$$\text{smooth}_{L_1}(x) = \begin{cases} 0.5 \, x^2 & \text{jika } |x| < 1 \\ |x| - 0.5 & \text{lainnya} \end{cases}$$

Analisis Perilaku Gradien Smooth $L_1$:
1. **Pada Galat Kecil ($|x| < 1$)**: Berperilaku kuadratis seperti $L_2$, memberikan kurva penurunan mulus di sekitar nol tanpa osilasi tajam, memfasilitasi konvergensi sub-piksel yang presisi.
2. **Pada Galat Besar ($|x| \ge 1$)**: Berperilaku linier seperti $L_1$, di mana turunan magnitudo gradien bernilai konstan $\pm 1$. Hal ini membatasi magnitudo gradien maksimum sehingga model kebal terhadap pencilan (*outliers*) dan terhindar dari ketidakstabilan numerik saat inisialisasi awal.""",
    "codeSnippet": code_9_8,
    "expectedOutput": out_9_8,
    "commonPitfalls": [
        "Menghitung loss regresi bounding box pada sampel latar belakang (background, $u = 0$); background tidak memiliki koordinat target acuan, sehingga harus dinolkan oleh indikator $[u \ge 1]$.",
        "Menggunakan loss $L_2$ (MSE) biasa tanpa penskalaan untuk regresi bounding box, yang kerap memicu fenomena gradient explosion pada awal pelatihan saat box prediksi masih terdistribusi acak.",
        "Mengabaikan penyetelan faktor penyeimbang $\lambda$; jika loss regresi mendominasi loss klasifikasi secara ekstrem, model akan menghasilkan lokalisasi kotak yang rapi namun salah mengidentifikasi kelas objek."
    ],
    "quiz": {
        "question": "Mengapa fungsi Smooth L1 Loss lebih disukai dibanding L2 Loss untuk regresi bounding box dalam Fast dan Faster R-CNN?",
        "options": [
            "Karena Smooth L1 Loss tidak membutuhkan operasi matematika floating point.",
            "Karena Smooth L1 Loss memiliki magnitudo gradien konstan (+/- 1) pada galat besar sehingga mencegah lonjakan gradien akibat outlier, serta memiliki kurva kuadratis mulus di sekitar nol.",
            "Karena Smooth L1 Loss hanya dapat digunakan jika jumlah kelas objek kurang dari 5.",
            "Karena Smooth L1 Loss mengubah bounding box menjadi segmentasi poligon."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Smooth L1 Loss menggabungkan keunggulan L1 dan L2: berperilaku kuadratis halus di sekitar titik nol untuk stabilitas konvergensi, dan bertransisi menjadi linier pada galat besar untuk membatasi turunan gradien agar tidak meledak akibat outlier acak."
    }
})

# ==============================================================================
# Subbab 9.9: Feature Pyramid Networks (FPN): Integrasi Multi-Skala Top-Down
# ==============================================================================
code_9_9 = r'''import numpy as np

# Simulasi Arsitektur Feature Pyramid Networks (FPN) - Lin et al. (2017)
# Jalur Bottom-Up (ResNet C2, C3, C4, C5) -> Jalur Top-Down dengan Lateral Connections
# P5 = Conv1x1(C5)
# P4 = Conv1x1(C4) + Upsample(P5)
# P3 = Conv1x1(C3) + Upsample(P4)
# P2 = Conv1x1(C2) + Upsample(P3)
# Diikuti Conv 3x3 pada setiap P_i untuk meredam efek aliasing upsampling

d_out = 256 # Standar FPN: seluruh tingkat piramida diseragamkan ke 256 channel

# Simulasi dimensi feature maps ResNet:
shapes = {
    "C2": (256, 112, 112), # Stride 4
    "C3": (512, 56, 56),   # Stride 8
    "C4": (1024, 28, 28),  # Stride 16
    "C5": (2048, 14, 14)   # Stride 32
}

print("Struktur Multi-Skala Feature Pyramid Networks (FPN):")
print(f"{'Tingkat Piramida':<18} | {'Resolusi Spasial':<18} | {'Stride Relatif':<16} | {'Target Deteksi Objek'}")
print("-" * 75)
print(f"{'P2 (dari C2 + P3)':<18} | {'112 x 112':<18} | {'Stride 4':<16} | Objek Sangat Kecil (Small)")
print(f"{'P3 (dari C3 + P4)':<18} | {'56 x 56':<18} | {'Stride 8':<16} | Objek Kecil (Medium-Small)")
print(f"{'P4 (dari C4 + P5)':<18} | {'28 x 28':<18} | {'Stride 16':<16} | Objek Sedang (Medium-Large)")
print(f"{'P5 (dari C5)':<18} | {'14 x 14':<18} | {'Stride 32':<16} | Objek Sangat Besar (Large)")
print(f"{'P6 (Subsample P5)':<18} | {'7 x 7':<18} | {'Stride 64':<16} | Proposal Ekstrem RPN")
print("\nSeluruh tingkatan P2 s.d. P5 memiliki kedalaman kanal identik (C = 256 channel).")
print("Kekuatan FPN: Menggabungkan resolusi spasial tinggi (bottom-up) dengan kekayaan semantik dalam (top-down).")
'''

out_9_9 = run_code_capture_output(code_9_9)

subchapters.append({
    "id": "cv-9-9-feature-pyramid-networks-fpn",
    "title": "9.9 Feature Pyramid Networks (FPN): Integrasi Fitur Semantik Multi-Skala Top-Down",
    "content": r"""Salah satu keterbatasan paling kronis pada Faster R-CNN klasik adalah ketergantungannya pada satu peta fitur lapisan tunggal di ujung backbone (*single-scale feature map*, misal lapisan Conv5/C5). Fitur pada lapisan dalam C5 memiliki **konten semantik tingkat tinggi (*high semantic richness*)** namun telah mengalami penyusutan spasial agresif (stride 16 atau 32), sehingga seluruh informasi detail spasial dari **objek berukuran kecil telah musnah**. Sebaliknya, lapisan awal seperti C2 memiliki resolusi spasial tinggi namun muatan semantiknya sangat rendah.

Untuk memecahkan dilema skala ini tanpa menambah beban komputasi secara signifikan, Tsung-Yi Lin, Piotr Dollár, Ross Girshick, Kaiming He, Bharath Hariharan, dan Serge Belongie (2017) memperkenalkan **Feature Pyramid Networks (FPN)**.

**Arsitektur FPN Tiga Komponen**:
1. **Jalur Maju Bawah-ke-Atas (*Bottom-Up Pathway*)**:
   Komputasi *feedforward* standar dari backbone CNN (seperti ResNet) yang menghasilkan hierarki peta fitur pada berbagai skala spasial dengan rasio downsampling $2\times$: $\{C_2, C_3, C_4, C_5\}$ dengan stride masing-masing $\{4, 8, 16, 32\}$.
2. **Jalur Atas-ke-Bawah (*Top-Down Pathway*)**:
   Menyebarkan informasi fitur semantik kuat dari lapisan atas menuju lapisan beresolusi spasial lebih tinggi di bawahnya melalui operasi upsampling spasial ($2\times$ *nearest-neighbor* atau *bilinear upsampling*).
3. **Koneksi Lateral (*Lateral Connections*)**:
   Peta fitur dari jalur bottom-up diproyeksikan menggunakan konvolusi $1 \times 1$ untuk menyamakan kedalaman kanal menjadi $d = 256$ kanal seragam, kemudian **dijumlahkan secara elemen demi elemen (*element-wise addition*)** dengan peta fitur yang di-upsample dari jalur top-down:
   $$P_l = \text{Conv}_{1 \times 1}(C_l) + \text{Upsample}_{2\times}(P_{l+1})$$
   Diikuti oleh satu konvolusi $3 \times 3$ pada setiap tingkat $P_l$ untuk mereduksi efek *aliasing* akibat upsampling.

**Alokasi Skala Objek Adaptif**:
Dalam FPN, prediksi deteksi tidak lagi dilakukan pada satu tingkat saja, melainkan didistribusikan secara hierarkis:
- Sebuah RoI dengan lebar $w$ dan tinggi $h$ pada citra masukan dialokasikan ke tingkat piramida $P_k$ berdasarkan rumus logaritmik:
  $$k = \left\lfloor k_0 + \log_2 \left( \frac{\sqrt{w \cdot h}}{224} \right) \right\rfloor$$
  di mana $k_0 = 4$ (skala acuan $224 \times 224$ dipetakan ke $P_4$).
- Objek kecil ($\sqrt{w \cdot h} < 112$) secara otomatis diarahkan ke $P_2$ atau $P_3$ (resolusi spasial tinggi), sedangkan objek besar diarahkan ke $P_5$.

FPN menjadi standar arsitektur tulang punggung (*backbone standard*) universal untuk hampir seluruh detektor objek modern.""",
    "codeSnippet": code_9_9,
    "expectedOutput": out_9_9,
    "commonPitfalls": [
        "Lupa menerapkan konvolusi $3 \times 3$ setelah penjumlahan lateral pada setiap tingkat piramida; konvolusi ini sangat esensial untuk menghilangkan artefak aliasing dari operasi upsampling $2\times$.",
        "Mengalokasikan seluruh ukuran proposal RoI ke tingkat piramida teratas ($P_5$) secara seragam; ini menggagalkan fungsi multi-skala FPN dan merusak deteksi objek kecil.",
        "Mengasumsikan channel pada tingkat $P_2$ hingga $P_5$ bervariasi mengikuti $C_2$ s.d. $C_5$; FPN secara ketat menstandarisasi seluruh keluaran piramida menjadi $256$ kanal identik via konvolusi $1 \times 1$."
    ],
    "quiz": {
        "question": "Bagaimana cara Feature Pyramid Networks (FPN) menyelesaikan masalah deteksi objek kecil tanpa membuat piramida citra berulang yang lambat?",
        "options": [
            "Dengan mengabaikan objek berukuran di bawah 32 piksel.",
            "Dengan menggabungkan representasi semantik tingkat tinggi dari lapisan atas (top-down) ke lapisan beresolusi spasial tinggi di bawahnya melalui koneksi lateral dan upsampling 2x.",
            "Dengan melatih model hanya pada citra yang diperbesar 10x.",
            "Dengan mengubah seluruh lapisan konvolusi menjadi lapisan fully connected."
        ],
        "correctAnswerIndex": 1,
        "explanation": "FPN menyalurkan fitur semantik kaya dari lapisan dalam kembali ke lapisan spasial beresolusi tinggi di bawahnya melalui top-down pathway dan lateral connections, memungkinkan objek kecil terdeteksi pada representasi bersolusi tinggi yang kaya semantik."
    }
})

# ==============================================================================
# Subbab 9.10: Metrik Evaluasi Deteksi Objek: IoU, PR-Curve, mAP@50, mAP@50:95
# ==============================================================================
code_9_10 = r'''import numpy as np

# Simulasi Perhitungan Kurva Precision-Recall dan Average Precision (AP)
# Berdasarkan PASCAL VOC 11-point interpolation & Area Under PR Curve (AUC)
# 6 Prediksi deteksi yang diurutkan menurun berdasarkan skor keyakinan (Confidence)
predictions = [
    {"conf": 0.95, "match": True},   # TP
    {"conf": 0.88, "match": True},   # TP
    {"conf": 0.75, "match": False},  # FP (salah lokalisasi atau salah kelas)
    {"conf": 0.60, "match": True},   # TP
    {"conf": 0.45, "match": False},  # FP
    {"conf": 0.20, "match": False}   # FP
]
num_ground_truths = 4 # Total objek sejati dalam dataset

tp_cum = np.cumsum([1 if p["match"] else 0 for p in predictions])
fp_cum = np.cumsum([0 if p["match"] else 1 for p in predictions])

recalls = tp_cum / num_ground_truths
precisions = tp_cum / (tp_cum + fp_cum)

# Interpolasi 11 Titik (PASCAL VOC 2007 metric)
# AP = 1/11 * sum_{r in [0, 0.1, ..., 1.0]} max_{r' >= r} p(r')
recall_thresholds = np.linspace(0.0, 1.0, 11)
interp_precisions = []

for r_t in recall_thresholds:
    # Ambil presisi maksimum untuk seluruh recall >= r_t
    prec_candidates = precisions[recalls >= r_t]
    interp_p = np.max(prec_candidates) if len(prec_candidates) > 0 else 0.0
    interp_precisions.append(interp_p)

ap_11_point = np.mean(interp_precisions)

# COCO mAP Metric: Rata-rata mAP di 10 ambang IoU berbeda: [0.50, 0.55, ..., 0.95]
simulated_ap_iou_range = [0.72, 0.68, 0.64, 0.59, 0.53, 0.46, 0.38, 0.28, 0.16, 0.06]
map_coco_50_95 = np.mean(simulated_ap_iou_range)

print("Evaluasi Metrik Deteksi Objek Formal:")
print(f"Total Objek Sejati (Ground Truths): {num_ground_truths}")
print(f"{'Rank':<6} | {'Confidence':<12} | {'Recall':<10} | {'Precision':<10} | {'Status'}")
print("-" * 55)
for i in range(len(predictions)):
    print(f"{i+1:<6} | {predictions[i]['conf']:<12.2f} | {recalls[i]:<10.2f} | {precisions[i]:<10.2f} | {'TP' if predictions[i]['match'] else 'FP'}")

print(f"\n1. Average Precision (AP VOC 11-Point Interpolasi): {ap_11_point:.4f}")
print(f"2. Simulasi Metrik Standar COCO mAP@[0.50:0.95]  : {map_coco_50_95:.4f}")
print("Catatan: Metrik COCO mAP@[0.50:0.95] menghukum detektor dengan lokalisasi batas yang tidak presisi.")
'''

out_9_10 = run_code_capture_output(code_9_10)

subchapters.append({
    "id": "cv-9-10-evaluation-metrics-map",
    "title": "9.10 Metrik Evaluasi Deteksi Objek: IoU, Precision-Recall Curve, mAP@50, dan mAP@50:95",
    "content": r"""Mengevaluasi kinerja model deteksi objek jauh lebih kompleks dibanding klasifikasi citra sederhana (yang cukup diukur dengan akurasi top-1 atau top-5). Model deteksi objek harus dinilai berdasarkan dua kapabilitas simultan: kebenaran identifikasi kelas dan ketepatan lokalisasi koordinat spasial bounding box.

**Komponen Penentuan True Positive (TP) dan False Positive (FP)**:
Setiap kotak prediksi diurutkan secara menurun (*descending*) berdasarkan skor keyakinan keyakinannya (*confidence score*). Prediksi dicocokkan dengan kotak *Ground Truth* (GT) dari kelas yang sama:
- **True Positive (TP)**: Prediksi memiliki nilai $\text{IoU} \ge \text{threshold}$ terhadap kotak GT yang belum pernah dipasangkan sebelumnya.
- **False Positive (FP)**: Prediksi memiliki $\text{IoU} < \text{threshold}$, atau jika kotak GT tersebut telah diklaim oleh prediksi lain dengan keyakinan lebih tinggi (*duplicate detection*), atau salah kelas.
- **False Negative (FN)**: Kotak GT yang tidak berhasil dideteksi oleh satu pun kotak prediksi yang valid.

**Kurva Precision-Recall (PR-Curve) dan Average Precision (AP)**:
Untuk setiap peringkat keyakinan terakumulasi, dihitung metrik:

$$\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}}, \quad \text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}}$$

**Average Precision (AP)** meringkas kurva PR menjadi satu nilai numerik skalar di antara $[0, 1]$. Terdapat dua metodologi kanonikal penghitungan AP:
1. **Interpolasi 11 Titik (PASCAL VOC 2007)**:
   Merata-ratakan presisi maksimum pada 11 nilai recall reguler $r \in \{0.0, 0.1, 0.2, \dots, 1.0\}$:
   $$\text{AP} = \frac{1}{11} \sum_{r \in \{0, 0.1, \dots, 1.0\}} \max_{\tilde{r} \ge r} p(\tilde{r})$$
2. **Luas di Bawah Kurva PR Terintegrasi (*Area Under Curve / AUC*) (PASCAL VOC 2010+)**:
   Mengintegrasikan area presisi terinterpolasi secara kontinu di sepanjang domain recall.

**Perbedaan Standar Tolok Ukur: PASCAL VOC vs COCO Benchmark**:
- **mAP@50 (PASCAL VOC metric)**: Ambang IoU ditetapkan longgar pada $\text{IoU} \ge 0.50$. Detektor dianggap sukses meskipun batas kotaknya bergeser beberapa piksel.
- **mAP@[0.50:0.95] (COCO primary challenge metric)**: Dihitung dengan merata-ratakan nilai mAP melintasi **10 ambang batas IoU bertingkat** secara sekuensial:
  $$\text{mAP}_{@[0.50:0.95]} = \frac{1}{10} \sum_{k=0}^9 \text{mAP}_{\text{IoU} = 0.50 + 0.05 \cdot k}$$
  Metrik COCO ini memberikan hukuman berat bagi detektor yang menghasilkan kotak longgar, dan secara signifikan membedakan keunggulan model berpresisi tinggi seperti Mask R-CNN (dengan RoIAlign) dibanding detektor generasi sebelumnya.""",
    "codeSnippet": code_9_10,
    "expectedOutput": out_9_10,
    "commonPitfalls": [
        "Membiarkan multiple bounding box mencocokkan ground truth yang sama sebagai beberapa TP; hanya prediksi dengan skor keyakinan tertinggi yang berhak menjadi TP, sedangkan sisanya wajib ditandai sebagai FP (duplikasi).",
        "Menghitung rata-rata AP hanya pada kelas-kelas yang muncul dalam batch pengujian alih-alih seluruh kelas target yang terdefinisi pada dataset.",
        "Menyamakan metrik mAP@50 dengan COCO mAP; skor model pada mAP@50 biasanya $15-25$ poin lebih tinggi dibanding metrik ketat COCO mAP@[0.50:0.95]."
    ],
    "quiz": {
        "question": "Mengapa tolok ukur kompetisi Microsoft COCO menggunakan metrik mAP@[0.50:0.95] alih-alih mAP@50 tradisional?",
        "options": [
            "Karena dataset COCO tidak memiliki anotasi bounding box.",
            "Karena merata-ratakan nilai mAP pada 10 ambang IoU ketat dari 0.50 hingga 0.95 secara eksplisit memberi penghargaan pada detektor yang mampu melokalisasi batas objek dengan presisi geometris tinggi.",
            "Untuk mempercepat waktu komputasi evaluasi hingga 10 kali lipat.",
            "Karena mAP@50 tidak dapat dihitung pada komputer 64-bit."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Metrik mAP@[0.50:0.95] milik COCO mengevaluasi akurasi deteksi pada rentang ambang IoU dari 0.50 hingga 0.95 dengan interval 0.05. Ini menguji tidak hanya kemampuan menemukan objek, tetapi juga presisi geometris ketat dari koordinat batas yang diprediksi."
    }
})

output_path = os.path.join(os.path.dirname(__file__), "cv_ch9_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 9 data with {len(subchapters)} subchapters: {output_path}")
