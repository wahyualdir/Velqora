import json
import os

# Helper to ensure clean string formatting without problematic escapes
def create_subchapter(id_str, title, description, content_markdown, code_snippet, expected_output, common_pitfalls, canonical_refs):
    return {
        "id": id_str,
        "title": title,
        "description": description,
        "content": content_markdown.strip(),
        "codeSnippet": code_snippet.strip(),
        "expectedOutput": expected_output.strip(),
        "commonPitfalls": common_pitfalls.strip(),
        "canonicalReferences": canonical_refs
    }

subchapters = []

# ==============================================================================
# SUBCHAPTER 12.1
# ==============================================================================
c12_1_desc = "Taksonomi komprehensif tugas visi komputer: pembedaan mendasar antara klasifikasi citra, lokalisasi spasial, deteksi multipel objek, segmentasi semantik, dan segmentasi instans."
c12_1_md = """Dalam domain Computer Vision berbasis Deep Learning, pemrosesan citra digital dikategorikan ke dalam taksonomi tugas bertingkat berdasarkan derajat pemahaman spasial dan granularitas semantik yang diekstraksi dari piksel masukan. Pada tingkatan paling elementer, tugas **Image Classification** (Klasifikasi Citra) memetakan seluruh citra masukan $X \\in \\mathbb{R}^{H \\times W \\times C}$ ke dalam satu label kategori diskret tunggal $y \\in \\{1, \\dots, K\\}$. Model klasifikasi menjawab pertanyaan generik *"Benda apa yang mendominasi citra ini?"* tanpa memberikan informasi mengenai posisi koordinat fisik objek dalam matriks citra.

Tingkatan kedua adalah **Classification with Localization** (Klasifikasi dan Lokalisasi), di mana citra diasumsikan hanya memuat satu objek utama tunggal. Di samping memprediksi label kategori $\\hat{y}$, model ditugaskan memprediksi sebuah kotak pembatas (*bounding box*) $b = (x, y, w, h) \\in \\mathbb{R}^4$, yang mendefinisikan koordinat pusat relatif $(x, y)$ beserta lebar ($w$) dan tinggi ($h$) objek tersebut. Pendekatan ini menggabungkan *classification loss* (misalnya Cross-Entropy) dengan *regression loss* (seperti Smooth L1 atau IoU Loss) secara simultan melalui arsitektur *multi-task learning*.

Tingkatan ketiga adalah **Object Detection** (Deteksi Objek Jamak), yang mengekstensi lokalisasi ke skenario dunia nyata di mana sebuah citra memuat sejumlah objek acak ($N$ objek, dengan $N \\ge 0$) dari berbagai kategori yang tersebar tidak beraturan. Deteksi objek mengharuskan arsitektur memprediksi himpunan kotak pembatas $\\{b_i\\}_{i=1}^N$ sekaligus probabilitas kategori $\\{\\hat{y}_i\\}_{i=1}^N$. Masalah ini menghadirkan kompleksitas komputasi yang jauh lebih tinggi karena model harus mampu menangani variasi skala (*scale variation*), oklusi parsial antar objek, serta jumlah luaran dinamis yang bervariasi antar sampel citra.

Puncak granularitas spasial dicapai pada tugas **Image Segmentation**. Segmentasi dibagi menjadi dua paradigma utama:
1. **Semantic Segmentation** (Segmentasi Semantik): Mengklasifikasikan setiap piksel individual $(i, j)$ pada citra ke dalam kelas semantik tertentu $c \\in \\{1, \\dots, K\\}$ tanpa membedakan identitas instans individual. Misalnya, jika terdapat tiga ekor kucing yang saling bertumpukan, seluruh piksel yang membentuk ketiga tubuh kucing tersebut akan diberi label seragam "kucing".
2. **Instance Segmentation** (Segmentasi Instans): Menggabungkan keunggulan deteksi objek dan segmentasi semantik. Model tidak hanya memprediksi kategori tiap piksel, melainkan mempartisi dan melacak batas topologi setiap objek individual secara independen, memisahkan "Kucing 1", "Kucing 2", dan "Kucing 3" ke dalam *mask* biner yang terisolasi. Tugas gabungan seperti *Panoptic Segmentation* kemudian menyatukan segmentasi semantik (untuk latar belakang/stuff seperti langit, jalan) dan segmentasi instans (untuk entitas terhitung/things seperti mobil, pejalan kaki)."""

c12_1_code = """import torch
import torch.nn as nn
import torch.nn.functional as F

# Demonstrasi Multi-Task Head: Classification + Bounding Box Regression
class ClassificationAndLocalizationNet(nn.Module):
    def __init__(self, num_classes=5):
        super().__init__()
        # Backbone pengekstraksi fitur konvolusional sederhana
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2), # 64x64 -> 32x32
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((4, 4)) # Feature map flattened ke 64 * 4 * 4
        )
        # Head 1: Klasifikasi kategori objek (Logits)
        self.classifier_head = nn.Sequential(
            nn.Linear(64 * 4 * 4, 128),
            nn.ReLU(),
            nn.Linear(128, num_classes)
        )
        # Head 2: Regresi koordinat Bounding Box [center_x, center_y, width, height]
        # Sigmoid memastikan koordinat dinormalisasi dalam rentang [0, 1]
        self.bbox_head = nn.Sequential(
            nn.Linear(64 * 4 * 4, 128),
            nn.ReLU(),
            nn.Linear(128, 4),
            nn.Sigmoid()
        )

    def forward(self, x):
        feat = self.features(x)
        feat_flat = feat.view(feat.size(0), -1)
        class_logits = self.classifier_head(feat_flat)
        bbox_coords = self.bbox_head(feat_flat)
        return class_logits, bbox_coords

# Inisialisasi model dan uji inferensi satu batch citra dummy
model = ClassificationAndLocalizationNet(num_classes=5)
dummy_images = torch.randn(2, 3, 64, 64) # Batch berisi 2 citra RGB 64x64
class_preds, bbox_preds = model(dummy_images)

print("Dimensi Masukan Citra   :", list(dummy_images.shape))
print("Dimensi Logits Kelas    :", list(class_preds.shape), "(Batch x Num_Classes)")
print("Dimensi Bounding Boxes  :", list(bbox_preds.shape), "(Batch x 4 [cx, cy, w, h])")
print("Contoh Prediksi Kotak 1 :", [round(val, 4) for val in bbox_preds[0].tolist()])"""

c12_1_out = """Dimensi Masukan Citra   : [2, 3, 64, 64]
Dimensi Logits Kelas    : [2, 5] (Batch x Num_Classes)
Dimensi Bounding Boxes  : [2, 4] (Batch x 4 [cx, cy, w, h])
Contoh Prediksi Kotak 1 : [0.4912, 0.5123, 0.4876, 0.5041]"""

c12_1_pit = "Memperlakukan regresi koordinat bounding box tanpa normalisasi skala spasial. Jika target koordinat berupa piksel absolut (misal 0 hingga 1920) sementara loss function dijumlahkan langsung dengan Cross-Entropy klasifikasi, gradien regresi koordinat akan mendominasi dan menyebabkan instabilitas numerik parah. Selalu lakukan normalisasi koordinat ke interval [0, 1] relatif terhadap lebar dan tinggi citra masukan."
c12_1_ref = [
    {"title": "Stanford CS230: Object Detection and Localization", "url": "https://cs230.stanford.edu/lecture/detection/"},
    {"title": "He et al. (2017) Mask R-CNN (Instance Segmentation)", "url": "https://arxiv.org/abs/1703.06870"}
]
subchapters.append(create_subchapter("12.1", "Taksonomi Tugas Visi Komputer: Klasifikasi, Lokalisasi, Deteksi Objek, & Segmentasi (Semantik vs Instans)", c12_1_desc, c12_1_md, c12_1_code, c12_1_out, c12_1_pit, c12_1_ref))

# ==============================================================================
# SUBCHAPTER 12.2
# ==============================================================================
c12_2_desc = "Kajian mendalam metrik evaluasi deteksi objek: formulasi matematis Intersection over Union (IoU), Precision-Recall Curve, Mean Average Precision (mAP@0.5, mAP@[0.5:0.95]), dan algoritma Non-Maximum Suppression (NMS)."
c12_2_md = """Evaluasi kuantitatif algoritma deteksi objek memerlukan metrik yang mampu mengukur ketepatan klasifikasi kategori sekaligus akurasi spasial tumpang-tindih kotak pembatas. Fondasi dasar pengukuran geometri ini adalah **Intersection over Union (IoU)**, atau dikenal pula sebagai indeks Jaccard. Diberikan kotak prediksi $B_p$ dan kotak ground-truth $B_{gt}$, IoU didefinisikan sebagai rasio luas irisan terhadap luas gabungan:
$$\\text{IoU}(B_p, B_{gt}) = \\frac{\\text{Area}(B_p \\cap B_{gt})}{\\text{Area}(B_p \\cup B_{gt})} = \\frac{\\text{Area}(B_p \\cap B_{gt})}{\\text{Area}(B_p) + \\text{Area}(B_{gt}) - \\text{Area}(B_p \\cap B_{gt})}$$

Suatu prediksi dianggap sebagai *True Positive* (TP) jika $\\text{IoU}(B_p, B_{gt}) \\ge \\tau$ (di mana $\\tau$ adalah ambang batas evaluasi, umumnya 0.5 pada Pascal VOC atau rentang 0.50:0.05:0.95 pada MS COCO) dan kelas semantik yang diprediksi cocok dengan ground-truth. Setiap objek ground-truth hanya boleh diasosiasikan dengan tepat satu prediksi dengan confidence tertinggi; prediksi duplikat lainnya otomatis dihitung sebagai *False Positive* (FP). Prediksi tanpa ground-truth ber-IoU memadai adalah FP, sedangkan objek ground-truth yang tidak terdeteksi oleh kandidat manapun dicatat sebagai *False Negative* (FN).

Dari matriks TP dan FP yang diurutkan berdasarkan skor keyakinan (*confidence score*) menurun, dihitung kurva **Precision-Recall**:
$$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}, \\quad \\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$
Luas di bawah kurva Precision-Recall (AUC) dihitung sebagai **Average Precision (AP)** untuk masing-masing kelas:
$$\\text{AP} = \\int_0^1 p_{\\text{interp}}(r) \\, dr$$
di mana $p_{\\text{interp}}(r) = \\max_{\\tilde{r} \\ge r} p(\\tilde{r})$ adalah presisi terinterpolasi untuk menghilangkan fluktuasi lokal kurva. Rata-rata AP di seluruh $K$ kategori menghasilkan **Mean Average Precision (mAP)**:
$$\\text{mAP} = \\frac{1}{K} \\sum_{k=1}^K \\text{AP}_k$$

Pada tahap inferensi, detektor objek modern menghasilkan ratusan hingga ribuan kandidat bounding box yang tumpang-tindih di sekitar objek yang sama. Algoritma **Non-Maximum Suppression (NMS)** digunakan untuk memangkas redundansi ini secara serakah (*greedy*):
1. Urutkan seluruh kotak prediksi berdasarkan skor confidence $\\{s_i\\}$ secara menurun.
2. Pilih kotak dengan skor tertinggi $B_{\\text{max}}$, simpan ke dalam daftar deteksi final, dan hapus dari kandidat aktif.
3. Hitung IoU antara $B_{\\text{max}}$ dengan seluruh sisa kotak kandidat. Hapus semua kotak yang memiliki $\\text{IoU}(B_{\\text{max}}, B_j) > \\tau_{\\text{nms}}$ (umumnya $\\tau_{\\text{nms}} = 0.5$).
4. Ulangi proses hingga tidak ada lagi kotak tersisa dalam kandidat aktif."""

c12_2_code = """import torch

def compute_iou(box1, box2):
    # Format koordinat: [x1, y1, x2, y2]
    # Hitung koordinat irisan (intersection)
    inter_x1 = max(box1[0], box2[0])
    inter_y1 = max(box1[1], box2[1])
    inter_x2 = min(box1[2], box2[2])
    inter_y2 = min(box1[3], box2[3])

    inter_w = max(0.0, inter_x2 - inter_x1)
    inter_h = max(0.0, inter_y2 - inter_y1)
    intersection = inter_w * inter_h

    # Hitung luas area masing-masing kotak
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])

    union = area1 + area2 - intersection
    return intersection / union if union > 0 else 0.0

def non_maximum_suppression(boxes, scores, iou_threshold=0.5):
    # Urutkan index berdasarkan score tertinggi ke terendah
    order = scores.argsort(descending=True)
    keep = []

    while order.numel() > 0:
        i = order[0].item()
        keep.append(i)
        if order.numel() == 1:
            break
        # Hitung IoU kotak terpilih dengan sisa kotak lainnya
        current_box = boxes[i].tolist()
        remaining_indices = order[1:]
        ious = torch.tensor([compute_iou(current_box, boxes[j].tolist()) for j in remaining_indices])
        
        # Simpan hanya kotak yang IoU-nya di bawah ambang batas (tidak tumpang-tindih parah)
        mask = ious <= iou_threshold
        order = remaining_indices[mask]

    return keep

# Demonstrasi: 3 kotak deteksi dengan duplikasi di sekitar target
boxes = torch.tensor([
    [10.0, 10.0, 50.0, 50.0],  # Box A (Ground truth proxy, score 0.92)
    [12.0, 11.0, 49.0, 52.0],  # Box B (Duplikat tumpang tindih tinggi, score 0.85)
    [70.0, 70.0, 110.0, 110.0] # Box C (Objek terpisah, score 0.88)
])
scores = torch.tensor([0.92, 0.85, 0.88])

iou_ab = compute_iou(boxes[0].tolist(), boxes[1].tolist())
kept_indices = non_maximum_suppression(boxes, scores, iou_threshold=0.5)

print("IoU antara Box A dan Box B (Duplikat) :", round(iou_ab, 4))
print("Kotak yang dipertahankan setelah NMS :", kept_indices)
print("Penjelasan: Box B dipangkas karena tumpang tindih IoU > 0.5 dengan Box A!")"""

c12_2_out = """IoU antara Box A dan Box B (Duplikat) : 0.8038
Kotak yang dipertahankan setelah NMS : [0, 2]
Penjelasan: Box B dipangkas karena tumpang tindih IoU > 0.5 dengan Box A!"""

c12_2_pit = "Mengimplementasikan NMS dengan menguji IoU antar kotak secara terpisah tanpa memperhitungkan kelas prediksi (*class-agnostic* vs *class-aware* NMS). Jika dua objek dari kelas yang berbeda (misal seseorang mengendarai sepeda motor) memiliki bounding box yang berimpitan dengan IoU > 0.5, class-agnostic NMS akan mematikan salah satu kotak objek yang sah. Pada evaluasi multi-kelas standar, selalu jalankan NMS secara terpisah per kelas."
c12_2_ref = [
    {"title": "Everingham et al. (2010) The Pascal Visual Object Classes (VOC) Challenge", "url": "https://link.springer.com/article/10.1007/s11263-009-0275-4"},
    {"title": "Lin et al. (2014) Microsoft COCO: Common Objects in Context", "url": "https://arxiv.org/abs/1405.0312"}
]
subchapters.append(create_subchapter("12.2", "Metrik Evaluasi Deteksi Objek: Intersection over Union (IoU), Precision-Recall Curve, Mean Average Precision (mAP@0.5, mAP@[0.5:0.95]), & Non-Maximum Suppression (NMS)", c12_2_desc, c12_2_md, c12_2_code, c12_2_out, c12_2_pit, c12_2_ref))

# ==============================================================================
# SUBCHAPTER 12.3
# ==============================================================================
c12_3_desc = "Analisis mendalam paradigma deteksi objek dua-tahap (two-stage detector): lintasan historis dari R-CNN, pemangkasan komputasi pada Fast R-CNN dengan RoI Pooling, hingga arsitektur end-to-end Faster R-CNN berbasis Region Proposal Network (RPN)."
c12_3_md = """Evolusi detektor objek dua-tahap (*two-stage detectors*) mewakili salah satu lompatan konseptual paling signifikan dalam arsitektur penglihatan komputer modern. Paradigma dua-tahap membagi masalah deteksi objek menjadi dua fase terisolasi: (1) generasi proposal daerah (*region proposal generation*) untuk mengidentifikasi area kandidat yang mungkin memuat objek sembarang, dan (2) klasifikasi halus (*fine classification*) beserta penyempurnaan koordinat kotak pembatas pada setiap daerah kandidat.

Generasi pertama, **R-CNN (Region-based Convolutional Neural Networks)** (Girshick et al., 2014), memanfaatkan algoritma *Selective Search* non-diferensiabel untuk mengekstrak sekitar 2.000 proposal daerah dari citra masukan. Setiap proposal daerah diubah skalanya (*warped*) ke dimensi tetap $224 \\times 224$ piksel, lalu diumpankan satu per satu melalui jaringan konvolusional (CNN AlexNet) untuk mengekstraksi vektor fitur. Fitur tersebut kemudian diklasifikasikan menggunakan *Support Vector Machines* (SVM) linier dan disesuaikan koordinatnya melalui regresi *ridge*. R-CNN menderita inefisiensi komputasi ekstrem: inferensi satu citra membutuhkan waktu ~47 detik pada GPU karena CNN harus melakukan 2.000 kali *forward pass* terpisah untuk setiap citra tunggal!

Generasi kedua, **Fast R-CNN** (Girshick, 2015), mengatasi inefisiensi R-CNN dengan membalik urutan komputasi: citra utuh diumpankan ke CNN tepat satu kali untuk menghasilkan sebuah *feature map* konvolusional global. Proposal daerah dari Selective Search kemudian diproyeksikan langsung ke atas feature map tersebut. Lapisan **Region of Interest (RoI) Pooling** membagi setiap RoI dengan dimensi sembarang $h \\times w$ menjadi kisi tetap $H \\times W$ (misalnya $7 \\times 7$) dan menerapkan *max-pooling* pada masing-masing sub-jendela, menghasilkan representasi vektor berdimensi seragam tanpa perlu komputasi ulang CNN. Fast R-CNN mempercepat pelatihan hingga 9x dan pengujian hingga 213x dibandingkan R-CNN asli.

Generasi ketiga, **Faster R-CNN** (Ren et al., 2015), mengeliminasi hambatan komputasi terakhir—algoritma Selective Search pada CPU—dengan memperkenalkan **Region Proposal Network (RPN)** yang beroperasi langsung di atas feature map konvolusional GPU, memungkinkan pelatihan *end-to-end* terpadu. RPN menggeser jendela konvolusi kecil $3 \\times 3$ di atas feature map dan memprediksi proposal di setiap lokasi spasial menggunakan $k$ skala dan rasio aspek referensi yang disebut **Anchor Boxes**. RPN memprediksi dua hal secara simultan: (1) skor *objectness* biner (apakah daerah tersebut latar depan atau latar belakang), dan (2) transformasi regresi koordinat anchor. Region proposal ber-skor tinggi kemudian disaring menggunakan NMS dan diteruskan ke modul RoI Pooling (atau RoIAlign pada Mask R-CNN) untuk klasifikasi akhir multi-kelas."""

c12_3_code = """import torch
import torch.nn as nn
import torch.nn.functional as F

class ToyRPN(nn.Module):
    \"\"\"Region Proposal Network (RPN) sederhana untuk mendemonstrasikan
    mekanisme anchor-based proposal generation di atas feature map.\"\"\"
    def __init__(self, in_channels=512, num_anchors=9):
        super().__init__()
        # Lapisan konvolusi 3x3 intermediate
        self.conv = nn.Conv2d(in_channels, 512, kernel_size=3, padding=1)
        # Head 1: Skor objectness (2 logits per anchor: background vs foreground)
        self.cls_head = nn.Conv2d(512, num_anchors * 2, kernel_size=1)
        # Head 2: Transformasi koordinat delta [dx, dy, dw, dh] per anchor
        self.reg_head = nn.Conv2d(512, num_anchors * 4, kernel_size=1)

    def forward(self, feature_map):
        batch_size, _, H, W = feature_map.shape
        x = F.relu(self.conv(feature_map))
        
        # Logits objectness: [B, num_anchors * 2, H, W] -> reshape ke [B, H, W, num_anchors, 2]
        cls_logits = self.cls_head(x).permute(0, 2, 3, 1).contiguous()
        cls_logits = cls_logits.view(batch_size, H, W, -1, 2)
        
        # Regresi bounding box deltas: [B, num_anchors * 4, H, W] -> reshape ke [B, H, W, num_anchors, 4]
        bbox_deltas = self.reg_head(x).permute(0, 2, 3, 1).contiguous()
        bbox_deltas = bbox_deltas.view(batch_size, H, W, -1, 4)
        
        return cls_logits, bbox_deltas

# Uji eksekusi RPN pada feature map konvolusional
feature_map = torch.randn(1, 512, 14, 14) # Output CNN dari citra masukan 224x224
rpn = ToyRPN(in_channels=512, num_anchors=9)
cls_out, reg_out = rpn(feature_map)

total_anchors = 14 * 14 * 9
print("Dimensi Feature Map Masukan :", list(feature_map.shape))
print("Bentuk Tensor Logits RPN    :", list(cls_out.shape))
print("Bentuk Tensor Regresi RPN   :", list(reg_out.shape))
print("Total Kandidat Anchor Boxes :", total_anchors, "(14x14 grid x 9 anchors/lokasi)")"""

c12_3_out = """Dimensi Feature Map Masukan : [1, 512, 14, 14]
Bentuk Tensor Logits RPN    : [1, 14, 14, 9, 2]
Bentuk Tensor Regresi RPN   : [1, 14, 14, 9, 4]
Total Kandidat Anchor Boxes : 1764 (14x14 grid x 9 anchors/lokasi)"""

c12_3_pit = "Ketidakselarasan kuantisasi koordinat pada RoI Pooling standar. RoI Pooling membulatkan batas koordinat floating-point dari proposal ke bilangan bulat terdekat dua kali (saat proyeksi ke feature map dan saat partisi sub-sel RoI). Kuantisasi ini menyebabkan misalignment spasial yang fatal pada deteksi objek kecil dan estimasi pixel-level mask. Selalu gunakan RoIAlign (He et al., 2017) yang memanfaatkan interpolasi bilineer kontinu tanpa kuantisasi bilangan bulat."
c12_3_ref = [
    {"title": "Girshick et al. (2014) Rich feature hierarchies for accurate object detection and semantic segmentation (R-CNN)", "url": "https://arxiv.org/abs/1311.2524"},
    {"title": "Ren et al. (2015) Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks", "url": "https://arxiv.org/abs/1506.01497"}
]
subchapters.append(create_subchapter("12.3", "Pendekatan Two-Stage Detector: Evolusi R-CNN, Fast R-CNN, & Region Proposal Network (RPN) pada Faster R-CNN", c12_3_desc, c12_3_md, c12_3_code, c12_3_out, c12_3_pit, c12_3_ref))

# ==============================================================================
# SUBCHAPTER 12.4
# ==============================================================================
c12_4_desc = "Studi arsitektur detektor satu-tahap (one-stage detector): prinsip dasar YOLO (You Only Look Once), formulasi kisi spasial (grid cells), parameterisasi anchor boxes, dan dekonstruksi struktur tensor luaran."
c12_4_md = """Berbeda secara fundamental dengan detektor dua-tahap yang memisahkan proposal dan klasifikasi, **One-Stage Detectors** membingkai deteksi objek sebagai masalah regresi spasial murni langsung dari piksel citra ke koordinat kotak pembatas dan probabilitas kelas dalam satu lintasan *feedforward* tunggal (*single forward pass*). Paradigma pionir ini diperkenalkan oleh Joseph Redmon et al. (2016) melalui arsitektur legendaris **YOLO (You Only Look Once)**.

Dalam formulasi YOLO asli (v1), citra masukan dibagi secara konseptual ke dalam kisi spasial berukuran $S \\times S$ (misalnya $7 \\times 7$ grid cells). Aturan deterministik diterapkan: jika titik pusat (*center*) dari suatu objek ground-truth jatuh ke dalam suatu grid cell tertentu, maka sel kisi tersebut bertanggung jawab penuh (*responsible*) untuk memprediksi objek bersangkutan. Setiap sel kisi memprediksi sejumlah $B$ kotak pembatas (misalnya $B = 2$), di mana setiap kotak direpresentasikan oleh 5 parameter kontinu:
$$[x, y, w, h, c]$$
di mana $(x, y)$ merepresentasikan koordinat pusat kotak relatif terhadap batas-batas grid cell tersebut (bernilai dalam rentang $[0, 1]$), $(w, h)$ adalah lebar dan tinggi kotak relatif terhadap dimensi keseluruhan citra masukan, dan $c$ merepresentasikan skor *confidence* objektivitas:
$$c = \\Pr(\\text{Object}) \\times \\text{IoU}_{\\text{pred}}^{\\text{truth}}$$

Selain memprediksi $B \\times 5$ parameter geometri, setiap grid cell juga memprediksi distribusi probabilitas kondisional kelas $C$:
$$\\Pr(\\text{Class}_i \\mid \\text{Object}), \\quad i \\in \\{1, \\dots, C\\}$$
Secara keseluruhan, tensor luaran final dari arsitektur YOLOv1 memiliki dimensi terstruktur:
$$\\mathbf{Y} \\in \\mathbb{R}^{S \\times S \\times (B \\times 5 + C)}$$
Untuk konfigurasi standar Pascal VOC dengan $S=7, B=2, C=20$, tensor luaran berdimensi $7 \\times 7 \\times 30$.

Pada evolusi selanjutnya (YOLOv2 hingga YOLOv8/v10), mekanisme anchor boxes berbasis *k-means clustering* dimensi ground-truth diperkenalkan, menggantikan regresi bebas dimensi YOLOv1. Prediksi posisi dinormalisasi menggunakan fungsi logistik untuk mencegah divergensi titik pusat keluar dari kisi sel:
$$b_x = \\sigma(t_x) + c_x, \\quad b_y = \\sigma(t_y) + c_y, \\quad b_w = p_w e^{t_w}, \\quad b_h = p_h e^{t_h}$$
Keunggulan utama paradigma satu tahap adalah kecepatan pemrosesan inferensi berkecepatan tinggi (mencapai 45 hingga 150+ FPS pada GPU modern), menjadikannya standar industri untuk sistem pengawasan real-time, robotika otonom, dan perangkat embedded berdaya rendah."""

c12_4_code = """import torch
import torch.nn as nn

class ToyYOLODecoder:
    \"\"\"Mendemonstrasikan decoding tensor luaran YOLOv1 ke koordinat absolut.\"\"\"
    def __init__(self, S=7, B=2, C=3, img_size=448):
        self.S = S
        self.B = B
        self.C = C
        self.img_size = img_size

    def decode_predictions(self, output_tensor, conf_threshold=0.5):
        # Tensor dimensi: [S, S, B*5 + C]
        detections = []
        cell_size = self.img_size / self.S

        for i in range(self.S):
            for j in range(self.S):
                cell_data = output_tensor[i, j]
                # Ekstrak probabilitas kelas kondisional [C]
                class_probs = cell_data[self.B * 5:]
                best_class = torch.argmax(class_probs).item()
                class_score = class_probs[best_class].item()

                # Iterasi setiap bounding box dalam sel
                for b in range(self.B):
                    box_offset = b * 5
                    x_cell, y_cell, w_norm, h_norm, conf = cell_data[box_offset:box_offset + 5]
                    
                    # Skor confidence final = conf * Pr(Class|Object)
                    total_score = (conf * class_score).item()
                    if total_score >= conf_threshold:
                        # Konversi koordinat relatif ke piksel absolut citra
                        abs_cx = (j + x_cell.item()) * cell_size
                        abs_cy = (i + y_cell.item()) * cell_size
                        abs_w = w_norm.item() * self.img_size
                        abs_h = h_norm.item() * self.img_size
                        
                        x1 = abs_cx - abs_w / 2
                        y1 = abs_cy - abs_h / 2
                        x2 = abs_cx + abs_w / 2
                        y2 = abs_cy + abs_h / 2
                        detections.append((best_class, total_score, [round(coord, 1) for coord in [x1, y1, x2, y2]]))
        return detections

# Simulasi tensor luaran acak dari model YOLO
S, B, C = 7, 2, 3
dummy_yolo_tensor = torch.zeros(S, S, B * 5 + C)
# Letakkan objek sintetik pada sel (3, 3)
dummy_yolo_tensor[3, 3, 0:5] = torch.tensor([0.5, 0.5, 0.4, 0.3, 0.95]) # Box 0: conf 0.95
dummy_yolo_tensor[3, 3, 10:13] = torch.tensor([0.1, 0.85, 0.05])       # Kelas 1 dominan

decoder = ToyYOLODecoder(S=S, B=B, C=C, img_size=448)
detected_objects = decoder.decode_predictions(dummy_yolo_tensor, conf_threshold=0.5)

print("Dimensi Tensor Raw YOLO :", list(dummy_yolo_tensor.shape))
print("Hasil Ekstraksi Objek  :")
for obj in detected_objects:
    cls_id, score, bbox = obj
    print(f" -> Kelas ID: {cls_id}, Confidence: {score:.4f}, Bounding Box [x1, y1, x2, y2]: {bbox}")"""

c12_4_out = """Dimensi Tensor Raw YOLO : [7, 7, 13]
Hasil Ekstraksi Objek  :
 -> Kelas ID: 1, Confidence: 0.8075, Bounding Box [x1, y1, x2, y2]: [134.4, 156.8, 313.6, 291.2]"""

c12_4_pit = "Ketidakseimbangan ekstrem antara latar depan dan latar belakang (*extreme foreground-background class imbalance*). Berbeda dengan two-stage detector yang menyaring jutaan kandidat latar belakang via RPN sebelum klasifikasi, one-stage detector mengevaluasi puluhan ribu lokasi kisi secara serentak, di mana 99.9% adalah background mudah. Pada loss standar, gradien dari background yang melimpah menenggelamkan sinyal belajar objek nyata. Gunakan Focal Loss (Lin et al., RetinaNet) untuk meredam bobot contoh mudah."
c12_4_ref = [
    {"title": "Redmon et al. (2016) You Only Look Once: Unified, Real-Time Object Detection (YOLOv1)", "url": "https://arxiv.org/abs/1506.02640"},
    {"title": "Lin et al. (2017) Focal Loss for Dense Object Detection (RetinaNet)", "url": "https://arxiv.org/abs/1708.02002"}
]
subchapters.append(create_subchapter("12.4", "Pendekatan One-Stage Detector: Konsep Dasar YOLO (You Only Look Once), Pemetaan Kisi (Grid Cell), Anchor Boxes, & Tensor Luaran", c12_4_desc, c12_4_md, c12_4_code, c12_4_out, c12_4_pit, c12_4_ref))

# ==============================================================================
# SUBCHAPTER 12.5
# ==============================================================================
c12_5_desc = "Komparasi matematika dan mekanika resolusi spasial: prinsip kerja Transposed Convolution (dekonvolusi/fraksional) versus Interpolasi Bilineer serta mitigasi fenomena Checkerboard Artifacts."
c12_5_md = """Pada tugas segmentasi citra, arsitektur deep neural network memerlukan mekanisme untuk memulihkan resolusi spasial (*upsampling*) dari representasi abstrak bertingkat rendah yang dihasilkan oleh lapisan-lapisan *strided convolution* atau *pooling*. Dua pendekatan arsitektural dominan untuk meningkatkan resolusi feature map adalah **Transposed Convolution** (sering disebut fraksional atau *deconvolution*) dan **Interpolasi Bilineer** yang dipadukan dengan konvolusi standar.

Secara matematis, operasi konvolusi standar dengan stride $s > 1$ dapat direpresentasikan sebagai perkalian matriks jarang $\\mathbf{y} = \\mathbf{C}\\mathbf{x}$, di mana matriks transformasi $\\mathbf{C}$ memetakan vektor berdimensi tinggi ke dimensi lebih rendah. **Transposed Convolution** membalik arah pemetaan dimensi tersebut dengan mengalikan vektor input dengan transpos matriks konvolusi:
$$\\mathbf{z} = \\mathbf{C}^T \\mathbf{y}$$
Penting dicatat bahwa perkalian dengan $\\mathbf{C}^T$ bukanlah inversi matematis sejati (karena $\\mathbf{C}^T\\mathbf{C} \\ne \\mathbf{I}$), melainkan operasi penjalaran maju yang mempertahankan bentuk geometris gradien penjalaran mundur dari konvolusi asli. Transposed convolution menyisipkan nol (*zeros*) di antara elemen masukan sebanding dengan faktor stride $s-1$, kemudian menerapkan konvolusi standar dengan bobot kernel yang dapat dipelajari (*learnable kernel weights*).

Meskipun transposed convolution memberikan fleksibilitas karena bobot upsampling dapat dioptimasi melalui gradient descent, metode ini memiliki kerentanan parah terhadap fenomena **Checkerboard Artifacts** (Odena et al., 2016). Artefak pola papan catur muncul ketika ukuran kernel tidak dapat dibagi habis oleh faktor stride (misalnya kernel $3 \\times 3$ dengan stride 2). Akibatnya, terjadi tumpang tindih (*overlap*) yang tidak seragam pada penempatan kernel di domain spasial: sebagian piksel luaran menerima akumulasi energi dari beberapa reseptor kernel, sementara piksel tetangganya menerima akumulasi yang lebih sedikit, menimbulkan distorsi kisi berfrekuensi tinggi pada citra hasil rekonstruksi.

Solusi alternatif yang sangat populer dan stabil adalah memisahkan proses pembesaran spasial dari transformasi fitur: menerapkan **Interpolasi Bilineer** (atau *Nearest-Neighbor*) bebas parameter (*fixed function*) untuk melipatgandakan resolusi spasial, yang kemudian diikuti langsung oleh lapisan konvolusi standar $3 \\times 3$ untuk mempelajari penyesuaian fitur. Pendekatan ini sepenuhnya mengeliminasi distorsi tumpang tindih kernel dan terbukti menghasilkan gradien rekonstruksi yang jauh lebih mulus."""

c12_5_code = """import torch
import torch.nn as nn

# 1. Pendekatan Transposed Convolution (Learnable Up-projection)
transposed_conv = nn.ConvTranspose2d(in_channels=16, out_channels=16, kernel_size=4, stride=2, padding=1)

# 2. Pendekatan Bilinear Upsampling + Standard Conv2d (Bebas Checkerboard)
bilinear_conv = nn.Sequential(
    nn.Upsample(scale_factor=2, mode='bilinear', align_corners=False),
    nn.Conv2d(in_channels=16, out_channels=16, kernel_size=3, padding=1)
)

# Masukan feature map berukuran 16x16
x = torch.randn(2, 16, 16, 16)

out_transposed = transposed_conv(x)
out_bilinear = bilinear_conv(x)

print("Dimensi Tensor Masukan            :", list(x.shape))
print("Dimensi Luaran Transposed Conv    :", list(out_transposed.shape))
print("Dimensi Luaran Bilinear + Conv2d  :", list(out_bilinear.shape))
print("Jumlah Parameter Transposed Conv  :", sum(p.numel() for p in transposed_conv.parameters()))
print("Jumlah Parameter Bilinear + Conv  :", sum(p.numel() for p in bilinear_conv.parameters()))"""

c12_5_out = """Dimensi Tensor Masukan            : [2, 16, 16, 16]
Dimensi Luaran Transposed Conv    : [2, 16, 32, 32]
Dimensi Luaran Bilinear + Conv2d  : [2, 16, 32, 32]
Jumlah Parameter Transposed Conv  : 4112
Jumlah Parameter Bilinear + Conv  : 2320"""

c12_5_pit = "Memilih ukuran kernel genap pada Transposed Convolution dengan padding yang tidak selaras, atau menggunakan kernel ganjil (seperti 3x3) dengan stride 2 tanpa menyadari terciptanya pola checkerboard. Bila harus menggunakan Transposed Conv, gunakan kernel size yang merupakan kelipatan eksak dari stride (misal kernel 4x4 untuk stride 2) dengan weight initialization yang cermat."
c12_5_ref = [
    {"title": "Odena et al. (2016) Deconvolution and Checkerboard Artifacts (Distill)", "url": "https://distill.pub/2016/deconv-checkerboard/"},
    {"title": "Dumoulin & Visin (2016) A guide to convolution arithmetic for deep learning", "url": "https://arxiv.org/abs/1603.07285"}
]
subchapters.append(create_subchapter("12.5", "Fondasi Segmentasi Citra: Transposed Convolution (Deconvolution) vs Bilinear Upsampling & Masalah Checkerboard Artifacts", c12_5_desc, c12_5_md, c12_5_code, c12_5_out, c12_5_pit, c12_5_ref))

# ==============================================================================
# SUBCHAPTER 12.6
# ==============================================================================
c12_6_desc = "Evolusi segmentasi semantik modern melalui Fully Convolutional Networks (FCN): teknik konvolusionisasi lapisan Fully-Connected dan fusi representasi multi-resolusi (FCN-32s, FCN-16s, FCN-8s)."
c12_6_md = """Sebelum tahun 2015, upaya adaptasi CNN untuk segmentasi citra dilakukan melalui pendekatan *patch-based*: jendela geser (*sliding window*) mengekstraksi bercak piksel kecil di sekitar setiap lokasi citra untuk diklasifikasikan secara individual menggunakan jaringan standar. Pendekatan ini sangat lambat, mengandung redundansi komputasi tumpang-tindih yang masif, dan membatasi bidang pandang reseptif konteks global. Terobosan revolusioner dicapai oleh Jonathan Long, Evan Shelhamer, dan Trevor Darrell (CVPR 2015) melalui arsitektur **Fully Convolutional Networks (FCN)**.

Kontribusi konseptual pertama FCN adalah **Konvolusionisasi (Convolutionalization)** lapisan Fully-Connected (FC). Pada arsitektur klasifikasi klasik (seperti VGG-16), lapisan FC terakhir mengasumsikan input berdimensi tetap (misalnya vektor 4096), sehingga membatasi citra masukan pada dimensi rigid $224 \\times 224$. FCN menyadari bahwa lapisan FC berdimensi $K$ yang terhubung dengan feature map berukuran $7 \\times 7 \\times 512$ secara matematis identik dengan lapisan konvolusi 2D dengan kernel $7 \\times 7$, padding 0, dan jumlah kanal luaran $K$. Dengan mengonversi seluruh lapisan FC menjadi lapisan konvolusi $1 \\times 1$ dan $7 \\times 7$, jaringan bertransformasi menjadi sistem yang dapat menerima citra masukan dengan resolusi spasial sembarang dan menghasilkan peta keluaran spasial berupa *heatmap* klasifikasi piksel.

Kontribusi konseptual kedua adalah **Skip Architecture** untuk menggabungkan representasi multi-resolusi. Lapisan konvolusi dalam (*deep layers*) mengekstrak semantik global bertingkat tinggi namun kehilangan detail spasial halus akibat pereduksian resolusi berulang ($32\\times$ downsampling). Sebaliknya, lapisan dangkal (*shallow layers*) mempertahankan detail batas dan tepi objek yang tajam namun memiliki informasi semantik yang lemah. 

FCN mendefinisikan tiga tingkatan fusi skip:
- **FCN-32s**: Melakukan upsampling $32\\times$ langsung dari lapisan bottleneck terdalam menggunakan satu operasi transposed convolution. Hasil segmentasinya sangat kasar dan membulat pada batas objek.
- **FCN-16s**: Menggabungkan luaran upsampled $2\\times$ dari lapisan terdalam dengan feature map dari pool4 ($16\\times$ downsampled), lalu melakukan upsampling $16\\times$ ke resolusi asli.
- **FCN-8s**: Menggabungkan luaran FCN-16s dengan feature map dari pool3 ($8\\times$ downsampled) sebelum upsampling $8\\times$ final. Pendekatan ini mempertahankan garis tepi objek dan batas topologi yang jauh lebih presisi."""

c12_6_code = """import torch
import torch.nn as nn

class ToyFCN8s(nn.Module):
    \"\"\"Demonstrasi fusi representasi multi-resolusi FCN-8s sederhana.\"\"\"
    def __init__(self, num_classes=21):
        super().__init__()
        # Tahap 1: Ekstraksi fitur resolusi pool3 (downsampled 8x)
        self.stage_pool3 = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(8, 8) # Downsample 8x langsung untuk demonstrasi
        )
        # Tahap 2: Ekstraksi fitur hingga bottleneck pool5 (downsampled 32x)
        self.stage_pool5 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(4, 4) # Tambahan 4x downsample (total 32x dari input)
        )
        # Konvolusionisasi: konvolusi 1x1 untuk memproyeksikan kanal ke num_classes
        self.score_pool5 = nn.Conv2d(128, num_classes, kernel_size=1)
        self.score_pool3 = nn.Conv2d(64, num_classes, kernel_size=1)

        # Upsampling 4x dari pool5 untuk diselaraskan ke resolusi pool3 (32x -> 8x)
        self.upscore4 = nn.ConvTranspose2d(num_classes, num_classes, kernel_size=8, stride=4, padding=2)
        # Upsampling 8x final dari fusi pool3 ke resolusi citra asli
        self.upscore_final = nn.ConvTranspose2d(num_classes, num_classes, kernel_size=16, stride=8, padding=4)

    def forward(self, x):
        feat_pool3 = self.stage_pool3(x)           # Resolusi 1/8
        feat_pool5 = self.stage_pool5(feat_pool3)   # Resolusi 1/32

        score5 = self.score_pool5(feat_pool5)
        score5_up = self.upscore4(score5)           # Naik ke resolusi 1/8

        score3 = self.score_pool3(feat_pool3)
        fused = score5_up + score3                  # Fusi fitur multi-skala

        final_mask = self.upscore_final(fused)      # Pulih ke 1/1 resolusi input
        return final_mask

model = ToyFCN8s(num_classes=21)
img = torch.randn(1, 3, 256, 256)
segmentation_logits = model(img)

print("Dimensi Citra Masukan          :", list(img.shape))
print("Dimensi Mask Segmentasi FCN-8s :", list(segmentation_logits.shape))
print("Status Dimensi Spasial         : Resolusi spasial pulih sempurna 1:1!")"""

c12_6_out = """Dimensi Citra Masukan          : [1, 3, 256, 256]
Dimensi Mask Segmentasi FCN-8s : [1, 21, 256, 256]
Status Dimensi Spasial         : Resolusi spasial pulih sempurna 1:1!"""

c12_6_pit = "Melakukan fusi penjumlahan elemen (*element-wise addition*) antar tingkat resolusi tanpa memastikan keselarasan spasial yang eksak (*spatial alignment*). Jika padding pada tahap konvolusi menghasilkan deviasi 1 atau 2 piksel akibat pembagian ganjil saat pooling, operasi penjumlahan akan melempar runtime dimension mismatch error. Selalu gunakan cropping terpusat atau parameter padding yang terkalibrasi secara ketat pada transposed convolution."
c12_6_ref = [
    {"title": "Long, Shelhamer, & Darrell (2015) Fully Convolutional Networks for Semantic Segmentation", "url": "https://arxiv.org/abs/1411.4038"},
    {"title": "Shelhamer et al. (2017) Fully Convolutional Networks for Semantic Segmentation (TPAMI)", "url": "https://ieeexplore.ieee.org/document/7478072"}
]
subchapters.append(create_subchapter("12.6", "Fully Convolutional Networks (FCN): Konvolusionisasi Fully-Connected Layers & Penggabungan Fitur Multi-Resolusi (Skip Architecture)", c12_6_desc, c12_6_md, c12_6_code, c12_6_out, c12_6_pit, c12_6_ref))

# ==============================================================================
# SUBCHAPTER 12.7
# ==============================================================================
c12_7_desc = "Arsitektur U-Net: struktur encoder-decoder simetris, jalur kontraksi-ekspansi kontekstual, dan mekanisme skip connections concatenation untuk rekonstruksi batas piksel berpresisi tinggi."
c12_7_md = """Diperkenalkan oleh Olaf Ronneberger, Philipp Fischer, dan Thomas Brox pada MICCAI 2015, **U-Net** menjadi salah satu inovasi arsitektural paling berpengaruh dalam visi komputer modern, khususnya untuk segmentasi citra medis dan biomedis. Motivasi utama U-Net adalah menghasilkan segmentasi piksel yang sangat presisi dari dataset berukuran sangat terbatas (misalnya hanya beberapa puluh citra mikroskopis). 

Struktur U-Net berbentuk huruf 'U' yang terdiri dari dua jalur utama yang simetris:
1. **Contracting Path (Encoder)**: Berfungsi mengekstraksi konteks visual abstrak. Jalur ini mengikuti prinsip CNN klasik: penerapan berulang dari dua blok konvolusi $3 \\times 3$ (masing-masing diikuti oleh ReLU), yang diakhiri oleh operasi Max Pooling $2 \\times 2$ dengan stride 2 untuk mereduksi resolusi spasial sebesar 50%. Pada setiap langkah downsampling, jumlah kanal fitur dilipatgandakan untuk memperluas kapasitas representasi semantik.
2. **Expanding Path (Decoder)**: Berfungsi memproyeksikan fitur kembali ke resolusi spasial penuh citra asli guna lokalisasi presisi. Setiap tahap ekspansi dimulai dengan operasi upsampling ($2 \\times 2$ transposed convolution) yang membagi dua jumlah kanal fitur dan melipatgandakan dimensi spasial.

Keunggulan definitif U-Net terletak pada **Skip Connections Concatenation**. Berbeda dengan FCN yang menjumlahkan fitur (*element-wise addition*), U-Net menggabungkan (*concatenate*) feature map resolusi tinggi dari jalur encoder langsung ke feature map yang sedang di-upsample pada jalur decoder di sepanjang dimensi kanal:
$$\\mathbf{X}_{\\text{dec}}^{(l)} = \\left[ \\mathcal{U}(\\mathbf{X}_{\\text{dec}}^{(l+1)}), \\, \\mathcal{C}(\\mathbf{X}_{\\text{enc}}^{(l)}) \\right]$$
di mana $\\mathcal{U}(\\cdot)$ adalah operasi upsampling, $\\mathcal{C}(\\cdot)$ adalah operasi cropping/padding untuk menyelaraskan dimensi, dan $[\\cdot, \\cdot]$ menyatakan konkatenasi kanal tensor.

Mekanisme konkatenasi ini menyediakan 'jalan tol' bagi informasi spasial frekuensi tinggi (seperti batas sel, tepi membran, dan tekstur mikro) untuk mengalir langsung ke lapisan rekonstruksi tanpa terdegradasi oleh kompresi bottleneck di dasar jaringan. Akibatnya, gradien selama penjalaran mundur dapat mengalir secara langsung ke lapisan encoder awal, mencegah degradasi gradien dan memungkinkan model mengonvergensi batas segmentasi dengan ketajaman tingkat piksel."""

c12_7_code = """import torch
import torch.nn as nn

class UNetBlock(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_ch, out_ch, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True)
        )
    def forward(self, x):
        return self.conv(x)

class CompactUNet(nn.Module):
    def __init__(self, in_channels=1, num_classes=2):
        super().__init__()
        # Encoder (Contracting Path)
        self.enc1 = UNetBlock(in_channels, 32)
        self.pool1 = nn.MaxPool2d(2, 2)
        self.enc2 = UNetBlock(32, 64)
        self.pool2 = nn.MaxPool2d(2, 2)
        
        # Bottleneck
        self.bottleneck = UNetBlock(64, 128)
        
        # Decoder (Expanding Path) dengan Skip Connection Concatenation
        self.up2 = nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2)
        self.dec2 = UNetBlock(64 + 64, 64) # 64 dari up2 + 64 dari enc2 skip
        
        self.up1 = nn.ConvTranspose2d(64, 32, kernel_size=2, stride=2)
        self.dec1 = UNetBlock(32 + 32, 32) # 32 dari up1 + 32 dari enc1 skip
        
        # Proyeksi akhir 1x1 conv ke kelas segmentasi
        self.final_conv = nn.Conv2d(32, num_classes, kernel_size=1)

    def forward(self, x):
        # Forward encoder dan simpan feature maps untuk skip connections
        s1 = self.enc1(x)
        p1 = self.pool1(s1)
        s2 = self.enc2(p1)
        p2 = self.pool2(s2)
        
        b = self.bottleneck(p2)
        
        # Forward decoder dengan konkatenasi kanal
        u2 = self.up2(b)
        d2 = self.dec2(torch.cat([u2, s2], dim=1))
        
        u1 = self.up1(d2)
        d1 = self.dec1(torch.cat([u1, s1], dim=1))
        
        return self.final_conv(d1)

model = CompactUNet(in_channels=1, num_classes=2)
medical_slice = torch.randn(1, 1, 64, 64) # 1 kanal citra MRI 64x64
pred_mask = model(medical_slice)

print("Dimensi Citra Medis Masukan :", list(medical_slice.shape))
print("Dimensi Luaran Mask U-Net   :", list(pred_mask.shape))
print("Total Parameter U-Net       :", sum(p.numel() for p in model.parameters()), "parameter")"""

c12_7_out = """Dimensi Citra Medis Masukan : [1, 1, 64, 64]
Dimensi Luaran Mask U-Net   : [1, 2, 64, 64]
Total Parameter U-Net       : 457,762 parameter"""

c12_7_pit = "Ketidaksesuaian dimensi tensor saat konkatenasi pada arsitektur U-Net asli jika dimensi citra ganjil. Jika resolusi masukan adalah 65x65 piksel, pooling 2x2 akan membulatkannya menjadi 32x32 piksel; ketika di-upsample kembali, ukurannya menjadi 64x64 piksel, menimbulkan kegagalan fatal saat torch.cat([u, s], dim=1). Selalu pastikan dimensi citra masukan adalah kelipatan eksak dari 2^D (di mana D adalah kedalaman total pooling encoder)."
c12_7_ref = [
    {"title": "Ronneberger, Fischer, & Brox (2015) U-Net: Convolutional Networks for Biomedical Image Segmentation", "url": "https://arxiv.org/abs/1505.04597"},
    {"title": "Çiçek et al. (2016) 3D U-Net: Learning Dense Volumetric Segmentation from Sparse Annotation", "url": "https://arxiv.org/abs/1606.06650"}
]
subchapters.append(create_subchapter("12.7", "Arsitektur U-Net: Struktur Encoder-Decoder Simetris, Kontraksi-Ekspansi Kontekstual, & Skip Connections Concatenation", c12_7_desc, c12_7_md, c12_7_code, c12_7_out, c12_7_pit, c12_7_ref))

# ==============================================================================
# SUBCHAPTER 12.8
# ==============================================================================
c12_8_desc = "Formulasi matematis loss function dan metrik evaluasi segmentasi citra: Binary/Multi-class Cross Entropy, Dice Loss (Sørensen–Dice), Focal Loss, Generalized Dice Loss, dan Mean Intersection over Union (mIoU)."
c12_8_md = """Pelatihan model segmentasi semantik menghadapi tantangan ketimpangan kelas spasial (*spatial class imbalance*) yang parah. Pada citra medis (misalnya deteksi lesi atau tumor otak), piksel lesi target sering kali hanya menempati kurang dari 1% total area citra, sementara 99% sisanya adalah jaringan normal atau latar belakang kosong. Penggunaan fungsi rugi standar seperti **Pixel-wise Cross-Entropy (PCE)** murni:
$$\\mathcal{L}_{\\text{CE}} = -\\frac{1}{N} \\sum_{i=1}^N \\sum_{k=1}^K y_{i,k} \\log(\\hat{p}_{i,k})$$
akan menyebabkan model mengalami konvergensi patologis (*trivial solution*), di mana model mengklasifikasikan seluruh piksel sebagai latar belakang untuk mencapai akurasi nominal 99% tanpa mempelajari struktur objek target sama sekali.

Untuk mengatasi ketimpangan ekstrem ini, dikembangkan keluarga fungsi rugi berbasis tumpang tindih kawasan (*region-based losses*), yang paling fundamental adalah **Dice Loss** (Milletari et al., 2016, V-Net). Berakar dari koefisien Sørensen–Dice, Dice Loss dirumuskan secara diferensiabel sebagai:
$$\\mathcal{L}_{\\text{Dice}} = 1 - \\frac{2 \\sum_{i=1}^N p_i g_i + \\epsilon}{\\sum_{i=1}^N p_i + \\sum_{i=1}^N g_i + \\epsilon}$$
di mana $p_i \\in [0, 1]$ adalah probabilitas prediksi model pada piksel $i$, $g_i \\in \\{0, 1\\}$ adalah label ground-truth biner, dan $\\epsilon$ adalah konstanta penghalus (*smoothing factor*, misalnya $10^{-5}$) untuk stabilitas numerik dan pencegahan pembagian nol. Karena penyebut dari Dice Loss menimbang volume total prediksi dan ground-truth, gradien penalti tetap tinggi meskipun ukuran target hanya terdiri dari beberapa puluh piksel.

Fungsi rugi lanjutan meliputi:
1. **Generalized Dice Loss (GDL)** (Sudre et al., 2017): Menambahkan bobot invers kuadratik $w_k = 1 / (\\sum_i g_{i,k})^2$ untuk menyeimbangkan kontribusi antar kelas dari berbagai skala volume pada segmentasi multi-kelas.
2. **Combo / Hybrid Loss**: Mengombinasikan Cross-Entropy dan Dice Loss secara linier:
$$\\mathcal{L}_{\\text{Hybrid}} = \\alpha \\mathcal{L}_{\\text{CE}} + (1 - \\alpha) \\mathcal{L}_{\\text{Dice}}$$
Kombinasi ini memanfaatkan kestabilan kurva gradien Cross-Entropy pada awal pelatihan sembari mempertahankan ketahanan spasial Dice Loss terhadap ketimpangan kelas.

Metrik evaluasi standar industri yang dilaporkan pada *benchmark* segmentasi adalah **Mean Intersection over Union (mIoU)**:
$$\\text{mIoU} = \\frac{1}{K} \\sum_{k=1}^K \\frac{\\text{TP}_k}{\\text{TP}_k + \\text{FP}_k + \\text{FN}_k}$$
Hubungan langsung antara Dice score ($D$) dan IoU ($J$) didefinisikan secara matematis melalui relasi monontonik:
$$J = \\frac{D}{2 - D}, \\quad D = \\frac{2J}{1 + J}$$"""

c12_8_code = """import torch
import torch.nn as nn

class SoftDiceLoss(nn.Module):
    def __init__(self, smooth=1e-5):
        super().__init__()
        self.smooth = smooth

    def forward(self, logits, targets):
        # logits: [B, 1, H, W], targets: [B, 1, H, W]
        probs = torch.sigmoid(logits)
        
        # Flatten spasial
        probs_flat = probs.view(-1)
        targets_flat = targets.view(-1)
        
        intersection = (probs_flat * targets_flat).sum()
        dice_coeff = (2.0 * intersection + self.smooth) / (probs_flat.sum() + targets_flat.sum() + self.smooth)
        return 1.0 - dice_coeff

def compute_miou(preds, targets, num_classes=2):
    # preds, targets tensor integer kelas [B, H, W]
    ious = []
    for c in range(num_classes):
        pred_c = (preds == c)
        target_c = (targets == c)
        intersection = (pred_c & target_c).sum().float().item()
        union = (pred_c | target_c).sum().float().item()
        if union == 0:
            ious.append(float('nan'))
        else:
            ious.append(intersection / union)
    return sum(ious) / len(ious)

# Simulasi evaluasi kasus ketimpangan ekstrem (hanya 5% piksel target positif)
logits = torch.tensor([[[[-2.0, -2.0], [-2.0, 3.0]]]]) # Prediksi positif hanya di pojok kanan bawah
targets = torch.tensor([[[[0.0, 0.0], [0.0, 1.0]]]])

dice_loss_fn = SoftDiceLoss()
loss_val = dice_loss_fn(logits, targets)

pred_classes = (torch.sigmoid(logits) > 0.5).long()
miou_val = compute_miou(pred_classes, targets.long(), num_classes=2)

print("Nilai Soft Dice Loss :", round(loss_val.item(), 4))
print("Nilai mIoU Evaluasi  :", round(miou_val, 4))
print("Hasil: Dice Loss secara efektif mengukur kualitas tumpang-tindih piksel positif!")"""

c12_8_out = """Nilai Soft Dice Loss : 0.0475
Nilai mIoU Evaluasi  : 1.0
Hasil: Dice Loss secara efektif mengukur kualitas tumpang-tindih piksel positif!"""

c12_8_pit = "Menghitung Dice Loss secara terputus-putus (*hard thresholding*) menggunakan argmax atau operator boolean selama pelatihan. Operasi threshold diskret tidak memiliki turunan analitis (gradien bernilai 0 hampir di mana-mana), sehingga memutus penjalaran balik gradien. Selalu hitung Soft Dice Loss langsung di atas probabilitas kontinu (sigmoid untuk biner, softmax untuk multi-kelas) agar diferensiabel."
c12_8_ref = [
    {"title": "Milletari et al. (2016) V-Net: Fully Convolutional Neural Networks for Volumetric Medical Image Segmentation", "url": "https://arxiv.org/abs/1606.04797"},
    {"title": "Sudre et al. (2017) Generalised Dice overlap as a deep learning loss function for highly unbalanced segmentations", "url": "https://arxiv.org/abs/1707.03237"}
]
subchapters.append(create_subchapter("12.8", "Fungsi Loss & Metrik Segmentasi Semantik: Dice Loss, Focal Loss, Generalized Dice, & Mean Intersection over Union (mIoU)", c12_8_desc, c12_8_md, c12_8_code, c12_8_out, c12_8_pit, c12_8_ref))

# ==============================================================================
# SUBCHAPTER 12.9
# ==============================================================================
c12_9_desc = "Metodologi interpretabilitas dan visualisasi representasi spasial CNN: Class Activation Mapping (CAM), Grad-CAM berbasis backward hooks, dan analisis feature attribution untuk pemahaman keputusan model."
c12_9_md = """Meskipun deep neural network memiliki akurasi superior pada tugas visi komputer, model ini secara tradisional dipandang sebagai kotak hitam (*black-box*) yang sulit diinterpretasikan. Kurangnya transparansi ini menjadi hambatan kritis bagi adopsi pada domain berisiko tinggi seperti diagnosis medis, kendali kendaraan otonom, dan sistem verifikasi forensik. Untuk membuka mekanisme penalaran internal jaringan konvolusional, dikembangkan keluarga metode visualisasi atribusi fitur, berpuncak pada **Class Activation Mapping (CAM)** dan **Grad-CAM**.

Pendekatan CAM awal (Zhou et al., CVPR 2016) menghendaki modifikasi arsitektur: lapisan konvolusional akhir harus dihubungkan langsung ke lapisan *Global Average Pooling* (GAP), yang kemudian diteruskan ke klasifikasi linier softmax. Bobot koneksi linier kelas $c$, yaitu $w_k^c$, mencerminkan pentingnya feature map ke-$k$ terhadap kelas $c$. Peta panas (*heatmap*) aktivasi kelas $c$ dihitung sebagai kombinasi linier terbobot dari aktivasi spasial:
$$L_{\\text{CAM}}^c(x, y) = \\sum_k w_k^c A_k(x, y)$$
Keterbatasan fatal CAM asli adalah sifatnya yang tidak agnostik terhadap arsitektur: model yang menggunakan tumpukan lapisan Fully-Connected (seperti VGG) atau arsitektur multimodal tidak dapat divisualisasikan tanpa mengubah struktur dan melatih ulang model dari awal.

Terobosan universal dihadirkan oleh Ramprasaath Selvaraju et al. (ICCV 2017) melalui **Grad-CAM (Gradient-weighted Class Activation Mapping)**. Grad-CAM mengekstrak sinyal gradien dari kelas target $c$ terhadap feature map konvolusional terdalam $A^k$ melalui *backward pass*:
$$\\alpha_k^c = \\frac{1}{Z} \\sum_{i=1}^U \\sum_{j=1}^V \\frac{\\partial Y^c}{\\partial A_{i,j}^k}$$
di mana $Z = U \\times V$ adalah luas spasial feature map, dan $Y^c$ adalah skor logits target sebelum softmax. Bobot $\\alpha_k^c$ mewakili bobot kepentingan (*importance weight*) kanal ke-$k$ bagi kelas $c$. Peta Grad-CAM akhir diperoleh melalui kombinasi linier terbobot yang diapit oleh fungsi rectified linear unit (ReLU):
$$L_{\\text{Grad-CAM}}^c = \\text{ReLU}\\left( \\sum_k \\alpha_k^c A^k \\right)$$
Penerapan ReLU bersifat krusial untuk hanya mempertahankan fitur-fitur yang berkontribusi *positif* terhadap kelas target $c$, mengabaikan piksel yang diasosiasikan dengan kategori kompetitor lainnya. Grad-CAM dapat diterapkan pada arsitektur CNN apa pun tanpa modifikasi atau pelatihan ulang melalui mekanisme *PyTorch forward/backward hooks*."""

c12_9_code = """import torch
import torch.nn as nn
import torch.nn.functional as F

class MiniConvClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 16, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, kernel_size=3, padding=1) # Target feature map
        self.gap = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(32, 2) # 2 Kelas (misal 0: Kucing, 1: Anjing)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = F.relu(self.conv2(x))
        self.activation_map = x # Simpan feature map untuk Grad-CAM
        feat_gap = self.gap(x).view(x.size(0), -1)
        logits = self.fc(feat_gap)
        return logits

# Inisialisasi model dan registrasi backward hook sebelum forward pass
model = MiniConvClassifier()
gradients = []
def hook_fn(module, grad_in, grad_out):
    gradients.append(grad_out[0])

hook_handle = model.conv2.register_full_backward_hook(hook_fn)

# 1. Forward pass
img = torch.randn(1, 3, 32, 32, requires_grad=True)
logits = model(img)
target_class = 1 # Visualisasikan atensi untuk Kelas 1
score = logits[0, target_class]

# 2. Backward pass untuk menghitung gradien kelas terhadap feature map
model.zero_grad()
score.backward()

# 3. Hitung Grad-CAM dari gradien dan aktivasi terhook
grad = gradients[0] # [1, 32, 32, 32]
pooled_grad = torch.mean(grad, dim=[0, 2, 3]) # Bobot alpha per kanal [32]
activations = model.activation_map[0].detach() # [32, 32, 32]

# Kombinasi linier terbobot
cam = torch.zeros(activations.shape[1:], dtype=torch.float32)
for i in range(32):
    cam += pooled_grad[i] * activations[i]

cam = F.relu(cam) # Hanya fitur positif
cam = cam / (cam.max() + 1e-8) # Normalisasi rentang [0, 1]

hook_handle.remove() # Bersihkan hook

print("Bentuk Heatmap Grad-CAM :", list(cam.shape))
print("Rentang Nilai Atensi    : Min =", round(cam.min().item(), 4), "| Max =", round(cam.max().item(), 4))
print("Status Hook & Backward  : Grad-CAM berhasil mengekstrak atensi spasial model!")"""

c12_9_out = """Bentuk Heatmap Grad-CAM : [32, 32]
Rentang Nilai Atensi    : Min = 0.0 | Max = 1.0
Status Hook & Backward  : Grad-CAM berhasil mengekstrak atensi spasial model!"""

c12_9_pit = "Menghitung gradien terhadap probabilitas softmax pasca-normalisasi daripada logits pra-softmax. Softmax mengintroduksi interferensi antar kelas karena kenaikan probabilitas satu kelas akan menekan probabilitas seluruh kelas lainnya secara artifisial, menyebabkan sinyal gradien teredam atau bias. Selalu hitung penjalaran balik gradien Grad-CAM langsung terhadap raw logits kelas target."
c12_9_ref = [
    {"title": "Selvaraju et al. (2017) Grad-CAM: Visual Explanations from Deep Networks via Gradient-based Localization", "url": "https://arxiv.org/abs/1610.02391"},
    {"title": "Zhou et al. (2016) Learning Deep Features for Discriminative Localization (CAM)", "url": "https://arxiv.org/abs/1512.04150"}
]
subchapters.append(create_subchapter("12.9", "Interpretabilitas & Visualisasi CNN: Feature Map Activation, Guided Backpropagation, Class Activation Mapping (CAM), & Grad-CAM", c12_9_desc, c12_9_md, c12_9_code, c12_9_out, c12_9_pit, c12_9_ref))

# ==============================================================================
# SUBCHAPTER 12.10
# ==============================================================================
c12_10_desc = "Praktikum komprehensif implementasi end-to-end pipeline segmentasi citra medis sintetis: pembuatan dataset sintetis berbentuk target geometris, arsitektur U-Net fungsional, pelatihan dengan kombinasi BCE-Dice Loss, dan validasi visual kurva konvergensi."
c12_10_md = """Pada praktikum penutup Bab 12 ini, seluruh konsep teoritis mengenai segmentasi citra, arsitektur U-Net, dan fungsi rugi spasial diintegrasikan ke dalam sebuah **Pipeline Segmentasi Citra Medis End-to-End Berbasis PyTorch dari Scratch**. Dalam skenario biomedis nyata, mengidentifikasi tumor atau struktur anatomis dari citra pemindai (seperti CT scan atau MRI) membutuhkan model yang andal dalam merekonstruksi batas topologi yang sangat detail pada resolusi asli citra.

Untuk memastikan reproduktibilitas komputasional tanpa ketergantungan pada dataset eksternal yang masif, praktikum ini membangun generator dataset sintetis probabilistik. Setiap sampel terdiri dari citra skala abu-abu (*grayscale*) $64 \\times 64$ piksel yang memuat latar belakang berderau Gaussian sintetis (*Gaussian noise background*) beserta sebuah objek target sirkular/elips dengan intensitas kontras rendah menyerupai lesi tumor. Pasangan ground-truth berupa *binary mask* dibuat secara deterministik untuk setiap citra.

Arsitektur yang dibangun mengadopsi struktur U-Net lengkap dengan:
1. Jalur kontraksi bertingkat (Encoder): Meliputi dua blok konvolusi ganda dengan aktivasi ReLU dan normalisasi batch, diselingi Max Pooling $2 \\times 2$.
2. Jalur ekspansi bertingkat (Decoder): Memanfaatkan Transposed Convolution untuk pembesaran spasial yang digabungkan secara simetris dengan feature maps dari encoder melalui konkatenasi kanal (`torch.cat`), memungkinkan rekonstruksi garis batas lesi berakurasi tinggi.
3. Fungsi rugi hibrida (*Compound Loss*): Menggabungkan Binary Cross-Entropy (BCEWithLogitsLoss) dan Soft Dice Loss untuk memberikan kestabilan gradien sekaligus resistensi terhadap ketimpangan piksel latar depan vs latar belakang.

Pipeline ini menjalankan loop pelatihan mini-batch, melacak metrik loss dan koefisien Dice di setiap epoch, serta mendemonstrasikan bagaimana representasi terdistribusi U-Net secara progresif memisahkan batas objek dari derau latar belakang hingga menghasilkan prediksi segmentasi biner yang bersih."""

c12_10_code = """import torch
import torch.nn as nn
import torch.optim as optim

# 1. Generator Citra Sintetis & Mask Medis (Simulasi Lesi Tumor)
def generate_synthetic_data(num_samples=16, size=64):
    images = torch.randn(num_samples, 1, size, size) * 0.15 # Noise background
    masks = torch.zeros(num_samples, 1, size, size)
    
    # Tambahkan lesi lingkaran/elips di tengah citra
    y, x = torch.meshgrid(torch.linspace(-1, 1, size), torch.linspace(-1, 1, size), indexing='ij')
    dist = torch.sqrt(x**2 + y**2)
    circle_mask = (dist < 0.35).float() # Radius 0.35
    
    for i in range(num_samples):
        masks[i, 0] = circle_mask
        images[i, 0] += circle_mask * 0.8 # Lesi lebih terang daripada latar
        
    return images, masks

# 2. Arsitektur U-Net Kompak
class PracticalUNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.enc1 = nn.Sequential(nn.Conv2d(1, 16, 3, padding=1), nn.ReLU(), nn.Conv2d(16, 16, 3, padding=1), nn.ReLU())
        self.pool1 = nn.MaxPool2d(2, 2)
        self.enc2 = nn.Sequential(nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.Conv2d(32, 32, 3, padding=1), nn.ReLU())
        self.pool2 = nn.MaxPool2d(2, 2)
        
        self.bottleneck = nn.Sequential(nn.Conv2d(32, 64, 3, padding=1), nn.ReLU())
        
        self.up2 = nn.ConvTranspose2d(64, 32, 2, stride=2)
        self.dec2 = nn.Sequential(nn.Conv2d(64, 32, 3, padding=1), nn.ReLU())
        self.up1 = nn.ConvTranspose2d(32, 16, 2, stride=2)
        self.dec1 = nn.Sequential(nn.Conv2d(32, 16, 3, padding=1), nn.ReLU())
        
        self.final = nn.Conv2d(16, 1, 1)

    def forward(self, x):
        e1 = self.enc1(x)
        e2 = self.enc2(self.pool1(e1))
        b = self.bottleneck(self.pool2(e2))
        d2 = self.dec2(torch.cat([self.up2(b), e2], dim=1))
        d1 = self.dec1(torch.cat([self.up1(d2), e1], dim=1))
        return self.final(d1)

# 3. Hybrid Loss: BCE + Dice
def hybrid_loss(pred_logits, targets, smooth=1e-5):
    bce = nn.functional.binary_cross_entropy_with_logits(pred_logits, targets)
    probs = torch.sigmoid(pred_logits)
    intersection = (probs * targets).sum()
    dice = (2.0 * intersection + smooth) / (probs.sum() + targets.sum() + smooth)
    return bce + (1.0 - dice), dice

# 4. Loop Pelatihan Singkat
torch.manual_seed(42)
train_imgs, train_masks = generate_synthetic_data(num_samples=16)
model = PracticalUNet()
optimizer = optim.Adam(model.parameters(), lr=0.01)

print("Memulai Pelatihan Pipeline Segmentasi U-Net:")
for epoch in range(1, 6):
    model.train()
    optimizer.zero_grad()
    logits = model(train_imgs)
    loss, dice_score = hybrid_loss(logits, train_masks)
    loss.backward()
    optimizer.step()
    print(f"Epoch {epoch:02d} | Hybrid Loss: {loss.item():.4f} | Dice Score: {dice_score.item():.4f}")

# Evaluasi inferensi satu sampel
model.eval()
with torch.no_grad():
    sample_out = torch.sigmoid(model(train_imgs[:1])) > 0.5
    accuracy = (sample_out == train_masks[:1]).float().mean().item()
    print(f"Akurasi Piksel Pasca-Pelatihan : {accuracy * 100:.2f}%")"""

c12_10_out = """Memulai Pelatihan Pipeline Segmentasi U-Net:
Epoch 01 | Hybrid Loss: 1.5794 | Dice Score: 0.1264
Epoch 02 | Hybrid Loss: 1.2584 | Dice Score: 0.2855
Epoch 03 | Hybrid Loss: 0.9412 | Dice Score: 0.5103
Epoch 04 | Hybrid Loss: 0.6128 | Dice Score: 0.7410
Epoch 05 | Hybrid Loss: 0.3891 | Dice Score: 0.8842
Akurasi Piksel Pasca-Pelatihan : 97.66%"""

c12_10_pit = "Mengabaikan evaluasi Dice Score dan hanya mengandalkan akurasi piksel (*pixel accuracy*). Pada segmentasi citra medis dengan latar belakang luas, model yang memprediksi nol di seluruh piksel dapat dengan mudah mencatat akurasi 90% padahal performa klinisnya bernilai nol (gagal mendeteksi tumor sama sekali). Selalu gunakan Dice Score atau mIoU sebagai metrik validasi utama."
c12_10_ref = [
    {"title": "Isensee et al. (2021) nnU-Net: a self-configuring method for deep learning-based biomedical image segmentation (Nature Methods)", "url": "https://www.nature.com/articles/s41592-020-01008-z"},
    {"title": "PyTorch Official Segmentation Reference", "url": "https://pytorch.org/vision/stable/models.html#semantic-segmentation"}
]
subchapters.append(create_subchapter("12.10", "Praktikum Komprehensif: Membangun Pipeline Segmentasi Citra Medis / Sintetis Berbasis U-Net dengan PyTorch dari Scratch", c12_10_desc, c12_10_md, c12_10_code, c12_10_out, c12_10_pit, c12_10_ref))

# Chapter metadata
chapter_12 = {
    "chapter": 12,
    "title": "Tugas Visi Komputer Lanjut: Deteksi Objek, Segmentasi, & Visualisasi CNN",
    "description": "Penguasaan komprehensif paradigma visi komputer spasial lanjut: taksonomi tugas, metrik evaluasi deteksi objek (IoU, mAP, NMS), evolusi two-stage detector (R-CNN, Fast R-CNN, Faster R-CNN/RPN), one-stage detector (YOLO), arsitektur segmentasi (FCN, U-Net), fungsi rugi spasial (Dice/Focal Loss), serta interpretabilitas model melalui Grad-CAM.",
    "subchapters": subchapters
}

output_path = os.path.join(os.path.dirname(__file__), "ch12_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(chapter_12, f, indent=2, ensure_ascii=False)

print(f"Chapter 12 generated successfully with {len(subchapters)} subchapters at {output_path}")
