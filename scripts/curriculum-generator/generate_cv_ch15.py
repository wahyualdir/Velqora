# -*- coding: utf-8 -*-
"""
Generator untuk Bab 15: Pengenalan Wajah (Face Recognition) & Deep Metric Learning (10 Subbab)
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
# Subbab 15.1: Deteksi dan Penyelarasan Wajah (Face Detection & Alignment: MTCNN, RetinaFace, 5 Landmarks, Transformasi Kesamaan)
# ==============================================================================
code_15_1 = r'''import numpy as np

# Implementasi Penyelarasan Wajah 2D Berbasis Transformasi Kesamaan (Similarity Transform)
# Menghitung matriks transformasi affine kesamaan (skala, rotasi, translasi)
# untuk memetakan 5 titik landmark wajah terdeteksi ke template kanonikal standar.

def estimate_similarity_transform(src_pts, dst_pts):
    """
    Menghitung matriks transformasi affine kesamaan 2x3 [s*R | t]
    dari src_pts (Nx2) ke dst_pts (Nx2) menggunakan metode kuadrat terkecil (Umeyama/Least Squares).
    """
    src_mean = np.mean(src_pts, axis=0)
    dst_mean = np.mean(dst_pts, axis=0)
    
    src_centered = src_pts - src_mean
    dst_centered = dst_pts - dst_mean
    
    # Kovarians cross-correlation
    cov = np.dot(dst_centered.T, src_centered) / src_pts.shape[0]
    
    # Singular Value Decomposition
    U, D, Vt = np.linalg.svd(cov)
    
    # Matriks rotasi
    R = np.dot(U, Vt)
    if np.linalg.det(R) < 0:
        U[:, -1] *= -1
        R = np.dot(U, Vt)
        
    var_src = np.var(src_pts, axis=0).sum()
    scale = np.trace(np.diag(D)) / var_src
    
    translation = dst_mean - scale * np.dot(R, src_mean)
    
    M = np.zeros((2, 3))
    M[:, :2] = scale * R
    M[:, 2] = translation
    return M

# 5 Landmark Kanonikal Standar (ArcFace/RetinaFace 112x112 pixel crop)
# Urutan landmark: [Mata Kiri, Mata Kanan, Ujung Hidung, Sudut Kiri Mulut, Sudut Kanan Mulut]
canonical_landmarks = np.array([
    [38.2946, 51.6963],
    [73.5318, 51.5014],
    [56.0252, 71.7366],
    [41.5493, 92.3655],
    [70.7299, 92.2041]
], dtype=np.float32)

# Simulasi deteksi landmark wajah pada citra mentah yang mengalami rotasi 15 derajat dan translasi
theta = np.radians(15.0)
rot_mat = np.array([[np.cos(theta), -np.sin(theta)], [np.sin(theta), np.cos(theta)]])
detected_landmarks = np.dot(canonical_landmarks - np.array([56.0, 71.0]), rot_mat.T) * 1.25 + np.array([120.0, 140.0])

# Estimasi matriks transformasi penyelarasan (alignment)
M_align = estimate_similarity_transform(detected_landmarks, canonical_landmarks)

# Terapkan transformasi untuk memvalidasi pemetaan landmark terdeteksi kembali ke kanonikal
aligned_pts = np.dot(detected_landmarks, M_align[:, :2].T) + M_align[:, 2]
mean_l2_error = np.mean(np.linalg.norm(aligned_pts - canonical_landmarks, axis=1))

print("Matriks Transformasi Kesamaan (Similarity Transform Matrix 2x3):")
print(np.round(M_align, 4))
print(f"\nRata-rata Residual L2 Error Penyelarasan: {mean_l2_error:.6f} pixel")
print("Penyelarasan 5 landmark berhasil menormalkan pose, rotasi, dan skala ke kanonikal 112x112.")
'''

subchapters.append({
    "id": "cv-15-1-face-detection-alignment",
    "chapterId": "computer-vision-ch-15",
    "title": "Deteksi dan Penyelarasan Wajah (Face Detection & Alignment: MTCNN, RetinaFace, Transformasi Kesamaan)",
    "description": "Prinsip hulu pengenalan wajah: lokalisasi multi-skala, regresi 5 titik landmark kanonikal, dan transformasi affine kesamaan untuk normalisasi pose spasial.",
    "estimatedMinutes": 35,
    "order": 1,
    "content": {
        "theory": (
            "Dalam pipeline modern sistem pengenalan wajah (*deep face recognition*), akurasi model verifikasi fitur sangat ditentukan oleh kualitas prapemrosesan pada subsistem hulu: deteksi wajah dan penyelarasan pose (*face alignment*). Tanpa normalisasi spasial yang ketat, jaringan saraf konvolusional (*deep CNNs*) terpaksa membuang kapasitas representasi untuk mempelajari variasi sudut yaw, pitch, roll, serta distorsi skala yang tidak relevan dengan identitas intrinsik subjek.\n\n"
            "Secara historis, arsitektur bertingkat seperti **MTCNN** (*Multi-task Cascaded Convolutional Networks*, Zhang et al., 2016) menggunakan tiga tahap konvolusional berurutan (P-Net, R-Net, O-Net) untuk menyaring kandidat *bounding box* sembari memprediksi probabilitas wajah dan lima titik kunci fitur wajah (*facial landmarks*): pusat pupil mata kiri, pusat pupil mata kanan, ujung hidung, sudut kiri bibir, dan sudut kanan bibir. Arsitektur generasi mutakhir seperti **RetinaFace** (Deng et al., 2020) mengintegrasikan deteksi multi-tugas *single-stage* berbasis *Feature Pyramid Network* (FPN) dan *Context Module* dengan *deformable convolution*, memungkinkan lokalisasi wajah skala ekstrim beserta 5 landmark berkepresisian tinggi secara simultan.\n\n"
            "Setelah 5 titik landmark terdeteksi pada citra sumber $X \\in \\mathbb{R}^{5 \\times 2}$, tahap penyelarasan kanonikal (*canonical face alignment*) memetakan koordinat tersebut ke titik target standar $Y \\in \\mathbb{R}^{5 \\times 2}$ (misalnya konfigurasi standar crop ArcFace $112 \\times 112$ piksel). Transformasi yang digunakan adalah **Transformasi Kesamaan Spasial 2D** (*2D Similarity Transform*), yang membatasi transformasi hanya pada translasi linear, rotasi bidang, dan penskalaan seragam isometrik tanpa *shearing* (peregangan miring) agar rasio geometris wajah asli tetap terpreservasi murni.\n\n"
            "Formulasi optimasi kuadrat terkecil (*least-squares similarity transform*) meminimalkan fungsi energi residual:\n"
            "$$\\min_{s, R, t} \\sum_{i=1}^5 \\| Y_i - (s R X_i + t) \\|^2$$\n"
            "di mana $s > 0$ merepresentasikan faktor skala skalar, $R \\in SO(2)$ adalah matriks rotasi ortogonal 2D dengan determinan $\\det(R) = +1$, dan $t \\in \\mathbb{R}^2$ merepresentasikan vektor translasi 2D. Solusi analitik diperoleh melalui dekomposisi nilai singular (SVD) dari matriks kovarians silang koordinat terpusat (algoritma Umeyama)."
        ),
        "codeSnippet": code_15_1,
        "codeSnippetOutput": run_code_capture_output(code_15_1),
        "realWorldApplication": (
            "Diterapkan secara universal pada gerbang imigrasi otomatis (Automated Border Control / e-Gates), sistem presensi biometrik karyawan, dan sistem otentikasi smartphone biometrik. Setiap wajah yang tertangkap kamera video dipotong dan disejajarkan secara geometris ke resolusi standar 112x112 piksel sebelum dialirkan ke model ekstraksi fitur deep learning."
        ),
        "commonPitfalls": [
            r"Menggunakan transformasi affine penuh (6 DoF) alih-alih transformasi kesamaan (4 DoF), yang mengakibatkan distorsi peregangan (shear) pada proporsi anatomi wajah.",
            r"Mengabaikan deteksi nilai singular negatif pada SVD matriks kovarians, yang menghasilkan matriks refleksi (pencerminan wajah terbalik) alih-alih rotasi murni.",
            r"Mengabaikan penanganan oklusi ekstrem ketika salah satu mata tidak terdeteksi, yang menyebabkan estimasi transformasi kolaps secara numerik."
        ],
        "caseStudy": (
            "Pada sistem pengawasan keamanan bandara, sebuah kamera CCTV menangkap wajah penumpang dari sudut miring elevasi 25 derajat dengan resolusi wajah tidak menentu (30x30 hingga 200x200 piksel). Jelaskan urutan pemrosesan dari deteksi RetinaFace multi-skala, ekstraksi 5 landmark, estimasi transformasi kesamaan Umeyama, hingga penghasilan crop terpusat 112x112 piksel yang siap diekstraksi fiturnya."
        ),
        "academicReferences": [
            r"Zhang, K., Zhang, Z., Li, Z., & Qiao, Y. (2016). Joint face detection and alignment using multitask cascaded convolutional networks. IEEE Signal Processing Letters, 23(10), 1499-1503.",
            r"Deng, J., Guo, J., Ververas, E., Kotsia, I., & Zafeiriou, S. (2020). RetinaFace: Single-shot multi-level face localisation in the wild. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 5203-5212).",
            r"Umeyama, S. (1991). Least-squares estimation of transformation parameters between two point patterns. IEEE Transactions on Pattern Analysis and Machine Intelligence, 13(4), 376-380."
        ]
    }
})

# ==============================================================================
# Subbab 15.2: Deep Metric Learning vs Softmax Konvensional: Closed-Set vs Open-Set
# ==============================================================================
code_15_2 = r'''import numpy as np

# Simulasi Pembatasan Softmax Klasifikasi (Closed-Set) vs Metric Learning (Open-Set)
# Pada closed-set, bobot kelas W bertindak sebagai hyperplane pemisah.
# Pada open-set metric learning, embedding x harus memiliki intra-class compactness dan inter-class separability.

np.random.seed(42)

# Simulasi 3 kelas identitas latih (Closed-Set)
dim = 2
n_samples_per_class = 20
c1 = np.random.randn(n_samples_per_class, dim) * 0.3 + np.array([2.0, 2.0])
c2 = np.random.randn(n_samples_per_class, dim) * 0.3 + np.array([-2.0, 2.0])
c3 = np.random.randn(n_samples_per_class, dim) * 0.3 + np.array([0.0, -2.0])

# Identitas baru di luar data latih (Unseen Open-Set Identities: Subjek A dan Subjek B)
unseen_A_sample1 = np.array([1.5, -1.0])
unseen_A_sample2 = np.array([1.7, -0.9])
unseen_B_sample1 = np.array([-1.5, -1.0])

# Jarak Euclidean dalam ruang metrik
dist_intra_unseen_A = np.linalg.norm(unseen_A_sample1 - unseen_A_sample2)
dist_inter_unseen_AB = np.linalg.norm(unseen_A_sample1 - unseen_B_sample1)

print(f"Jarak Intra-Class Identitas Baru (Unseen A1 ke A2): {dist_intra_unseen_A:.4f}")
print(f"Jarak Inter-Class Identitas Baru (Unseen A1 ke B1): {dist_inter_unseen_AB:.4f}")
print(f"Rasio Separabilitas Metrik (Inter/Intra): {dist_inter_unseen_AB / dist_intra_unseen_A:.2f}x")
print("Kesimpulan: Deep Metric Learning memungkinkan diskriminasi identitas yang belum pernah dilihat saat pelatihan.")
'''

subchapters.append({
    "id": "cv-15-2-deep-metric-learning-open-set",
    "chapterId": "computer-vision-ch-15",
    "title": "Deep Metric Learning vs Softmax Konvensional: Batas Ruang Fitur Euclidian & Verifikasi Open-Set",
    "description": "Analisis teoritis perbedaan paradigma closed-set classification dan open-set verification pada ruang metrik representasi berdimensi tinggi.",
    "estimatedMinutes": 35,
    "order": 2,
    "content": {
        "theory": (
            "Permasalahan pengenalan wajah pada dunia nyata hampir selalu beroperasi dalam paradigma **Open-Set Identification/Verification**, di mana individu yang diuji (*unseen testing subjects*) tidak pernah muncul sama sekali dalam himpunan data pelatihan (*training identities*). Hal ini secara fundamental membedakan pengenalan wajah dari klasifikasi citra standar (*Closed-Set Classification*) seperti ImageNet atau CIFAR.\n\n"
            "Pada klasifikasi closed-set konvensional yang dioptimalkan dengan fungsi *Cross-Entropy Loss* standar berbobot linear $W$:\n"
            "$$\\mathcal{L}_{CE} = - \\sum_{i=1}^N \\log \\frac{\\exp(W_{y_i}^T x_i + b_{y_i})}{\\sum_{j=1}^C \\exp(W_j^T x_i + b_j)}$$\n"
            "jaringan saraf hanya dipaksa untuk memisahkan fitur $x_i$ antar kelas latih menggunakan *hyperplane linear* pemisah ($W_j^T x_i = 0$). Sifat optimasi ini mendorong *inter-class separability* (pemisahan batas antar kelas yang diketahui), namun sama sekali tidak memberikan insentif matematis untuk menghasilkan **intra-class compactness** (pemadatan fitur dari individu yang sama pada ruang metrik).\n\n"
            "Akibatnya, ketika representasi fitur $x \\in \\mathbb{R}^d$ dari subjek baru yang tidak terdaftar (*unseen subject*) diekstrak, jarak metrik Euclidean $\\| x_a - x_b \\|$ atau *cosine similarity* $\\cos(x_a, x_b)$ tidak dapat diandalkan, karena variasi intra-kelas (misalnya perubahan pencahayaan, usia, atau ekspresi) dapat melampaui variasi antar-kelas.\n\n"
            "**Deep Metric Learning** mentransformasikan tugas pelatihan: alih-alih memprediksi label kelas diskrit, jaringan dilatih untuk memetakan citra wajah mentah $I$ ke dalam ruang manifold berdimensi $d$ (biasanya $d \\in [128, 512]$) di mana jarak metrik $D(f(I_a), f(I_b))$ berbanding lurus dengan disimilaritas semantik semesta identitas. Syarat fundamental ruang metrik ideal adalah:\n"
            "$$\\| f(I_i^1) - f(I_i^2) \\|_2 < \\tau \\quad \\text{dan} \\quad \\| f(I_i^1) - f(I_j^1) \\|_2 \\ge \\tau + \\epsilon, \\quad \\forall i \\neq j$$"
        ),
        "codeSnippet": code_15_2,
        "codeSnippetOutput": run_code_capture_output(code_15_2),
        "realWorldApplication": (
            "Menjadi fondasi mesin verifikasi identitas berskala miliaran pengguna seperti sistem verifikasi e-KTP, Apple Face ID, dan basis data kepolisian interpol, di mana sistem harus mampu memverifikasi jutaan warga negara baru tanpa perlu melakukan pelatihan ulang (re-training) model."
        ),
        "commonPitfalls": [
            r"Mencoba menambahkan layer klasifikasi softmax baru setiap kali ada karyawan atau warga baru yang terdaftar, yang mengharuskan proses retraining berulang.",
            r"Mengabaikan normalisasi vektor fitur (L2 normalization) yang menyebabkan panjang vektor didominasi oleh kecerahan citra alih-alih fitur struktural wajah.",
            r"Mengasumsikan ambang batas (threshold) jarak Euclidean konstan pada distribusi demografi atau pencahayaan yang berbeda drastis."
        ],
        "caseStudy": (
            "Sebuah bank nasional ingin mengimplementasikan fitur e-KYC (electronic Know Your Customer) untuk pembukaan rekening baru via aplikasi seluler. Mengapa arsitektur ResNet-50 yang dilatih dengan klasifikasi softmax 10.000 selebriti tidak dapat langsung digunakan untuk memprediksi label calon nasabah, dan bagaimana metric learning menyelesaikan masalah verifikasi foto KTP terhadap swafoto nasabah?"
        ),
        "academicReferences": [
            r"Kaya, M., & Bilge, H. Ş. (2019). Deep metric learning: A survey. Symmetry, 11(9), 1066.",
            r"Taigman, Y., Yang, M., Ranzato, M. A., & Wolf, L. (2014). DeepFace: Closing the gap to human-level performance in face verification. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 1701-1708).",
            r"Chopra, S., Hadsell, R., & LeCun, Y. (2005). Learning a similarity metric discriminatively, with application to face verification. In IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR'05) (Vol. 1, pp. 539-546)."
        ]
    }
})

# ==============================================================================
# Subbab 15.3: Arsitektur Siamese Networks & Contrastive Loss
# ==============================================================================
code_15_3 = r'''import numpy as np

# Implementasi Contrastive Loss untuk Pasangan Wajah (Siamese Network)
# Loss = (1 - y) * 0.5 * D^2 + y * 0.5 * max(0, margin - D)^2
# y = 0 jika pasangan sama (positive pair), y = 1 jika pasangan beda (negative pair)

def contrastive_loss(x1, x2, y, margin=1.0):
    """
    x1, x2: embedding vektor wajah shape (B, D)
    y: label pasangan (0 = similar/genuine, 1 = dissimilar/imposter)
    margin: batas pemisah minimum jarak antar subjek berbeda
    """
    euclidean_dist = np.linalg.norm(x1 - x2, axis=1)
    
    # Komponen loss pasangan positif (memadatkan jarak hingga mendekati 0)
    loss_pos = (1 - y) * 0.5 * np.square(euclidean_dist)
    
    # Komponen loss pasangan negatif (mendorong jarak hingga minimal melebihi margin)
    loss_neg = y * 0.5 * np.square(np.maximum(0.0, margin - euclidean_dist))
    
    total_loss = np.mean(loss_pos + loss_neg)
    return total_loss, euclidean_dist

# Simulasi batch: 2 pasangan genuine (y=0) dan 2 pasangan imposter (y=1)
x1_batch = np.array([
    [0.5, 0.5],   # Wajah A1
    [0.1, 0.9],   # Wajah B1
    [0.5, 0.5],   # Wajah A1
    [0.9, 0.1]    # Wajah C1
])

x2_batch = np.array([
    [0.52, 0.48], # Wajah A2 (sama identitas) -> jarak kecil
    [0.12, 0.88], # Wajah B2 (sama identitas) -> jarak kecil
    [-0.5, -0.5], # Wajah D1 (beda identitas) -> jarak besar (> margin)
    [0.85, 0.15]  # Wajah C2-mirip (beda identitas tapi jarak terlalu dekat < margin)
])

y_labels = np.array([0, 0, 1, 1]) # 0 = sama, 1 = beda

loss_val, dists = contrastive_loss(x1_batch, x2_batch, y_labels, margin=1.0)

print(f"Jarak Pasangan 1 (Genuine A1-A2): {dists[0]:.4f}")
print(f"Jarak Pasangan 2 (Genuine B1-B2): {dists[1]:.4f}")
print(f"Jarak Pasangan 3 (Imposter A1-D1): {dists[2]:.4f} (Aman > margin 1.0)")
print(f"Jarak Pasangan 4 (Imposter C1-C2): {dists[3]:.4f} (Melanggar margin 1.0!)")
print(f"Total Contrastive Loss Batch: {loss_val:.4f}")
'''

subchapters.append({
    "id": "cv-15-3-siamese-networks-contrastive-loss",
    "chapterId": "computer-vision-ch-15",
    "title": "Arsitektur Siamese Networks: Contrastive Loss, Margin Euclidian, dan Verifikasi Pasangan Citra",
    "description": "Konsep jaringan kembar dengan bobot bersama (weight sharing), formulasi contrastive loss, dan dinamika penataan jarak pasangan citra wajah.",
    "estimatedMinutes": 35,
    "order": 3,
    "content": {
        "theory": (
            "Arsitektur **Siamese Network** (Bromley & LeCun et al., 1993; Chopra et al., 2005) merupakan pelopor pemodelan deep metric learning untuk verifikasi citra pasangan. Struktur Siamese terdiri atas dua (atau lebih) cabang jaringan saraf tiruan konvolusional yang **identik secara topologis dan berbagi parameter bobot yang sama persis** (*weight sharing*: $W_1 = W_2 = W$).\n\n"
            "Ketika dua citra wajah $I_1$ dan $I_2$ dimasukkan ke masing-masing cabang, jaringan menghasilkan dua vektor embedding $f_W(I_1) \\in \\mathbb{R}^d$ dan $f_W(I_2) \\in \\mathbb{R}^d$. Kualitas ruang fitur dievaluasi langsung menggunakan jarak metrik Euclidean:\n"
            "$$D_W(I_1, I_2) = \\| f_W(I_1) - f_W(I_2) \\|_2$$\n\n"
            "Untuk melatih parameter bobot $W$, dipekerjakan fungsi **Contrastive Loss** (Hadsell et al., 2006). Didefinisikan label biner pasangan $Y \\in \\{0, 1\\}$, di mana $Y = 0$ menandakan pasangan positif/genuine (*same identity*), sedangkan $Y = 1$ menandakan pasangan negatif/imposter (*different identity*):\n"
            "$$\\mathcal{L}(W, Y, I_1, I_2) = (1 - Y) \\frac{1}{2} \\left( D_W \\right)^2 + Y \\frac{1}{2} \\left\\{ \\max(0, m - D_W) \\right\\}^2$$\n"
            "di mana $m > 0$ merupakan ambang **margin Euclidean**. Analisis turunan gradien parsial terhadap embedding menunjukkan dinamika ganda:\n"
            "1. **Pasangan Positif ($Y=0$)**: Fungsi rugi berbentuk kuadratik $\\frac{1}{2} D_W^2$. Gradien $\\nabla D_W$ menarik kedua embedding mendekat seolah-olah dihubungkan oleh pegas Hooke hingga $D_W \\to 0$.\n"
            "2. **Pasangan Negatif ($Y=1$)**: Jika jarak $D_W \\ge m$, loss bernilai nol dan tidak ada gaya tolak yang diberikan (wilayah pasif). Namun jika $D_W < m$ (terlalu dekat), gradien mendorong kedua embedding menjauh hingga jarak spasialnya minimal mencapai batas ambang $m$.\n\n"
            "Kelemahan utama formulasi pasangan (*pair-based*) ini adalah ruang kombinasi pasangan yang meledak $\\mathcal{O}(N^2)$ dan ketidakmampuannya mengevaluasi batas pemisah relatif antar-kelas secara bersamaan dalam satu langkah komparasi."
        ),
        "codeSnippet": code_15_3,
        "codeSnippetOutput": run_code_capture_output(code_15_3),
        "realWorldApplication": (
            "Digunakan dalam sistem tanda tangan digital, verifikasi sidik jari, perbandingan dokumen forensik, dan verifikasi foto selfie liveness terhadap foto chip paspor RFID (ICAO Doc 9303)."
        ),
        "commonPitfalls": [
            r"Memilih nilai margin Euclidean m secara sembarang tanpa memperhitungkan dimensionalitas d embedding, yang dapat memicu gradient vanishing atau representasi kolaps.",
            r"Mengabaikan pembagian bobot (weight sharing) antar cabang, sehingga cabang 1 dan cabang 2 memetakan ke ruang manifold yang tidak kompatibel.",
            r"Ketidakseimbangan sampling pasangan: melatih dengan 99% pasangan imposter dan 1% pasangan genuine membuat jaringan memprediksi jarak maksimum secara konstan."
        ],
        "caseStudy": (
            "Dua sampel wajah dari subjek yang berbeda menghasilkan jarak Euclidean D = 0.4 pada ruang metrik saat margin m diatur ke 1.2. Hitung kontribusi loss pasangan negatif tersebut, dan jelaskan bagaimana backpropagation akan mengubah orientasi embedding kedua wajah pada iterasi berikutnya."
        ),
        "academicReferences": [
            r"Chopra, S., Hadsell, R., & LeCun, Y. (2005). Learning a similarity metric discriminatively, with application to face verification. In IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR'05) (Vol. 1, pp. 539-546).",
            r"Hadsell, R., Chopra, S., & LeCun, Y. (2006). Dimensionality reduction by learning an invariant mapping. In 2006 IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR'06) (Vol. 2, pp. 1735-1742).",
            r"Bromley, J., Guyon, I., LeCun, Y., Säckinger, E., & Shah, R. (1993). Signature verification using a 'Siamese' time delay neural network. Advances in Neural Information Processing Systems, 6."
        ]
    }
})

# ==============================================================================
# Subbab 15.4: FaceNet dan Triplet Loss: Anchor, Positive, Negative
# ==============================================================================
code_15_4 = r'''import numpy as np

# Implementasi Triplet Loss (Schroff et al., CVPR 2015 / FaceNet)
# L = max(0, ||f(x_a) - f(x_p)||^2 - ||f(x_a) - f(x_n)||^2 + alpha)
# Seluruh embedding dinormalisasi L2 (||f(x)||_2 = 1) pada permukaan hipersfer unit

def triplet_loss(anchor, positive, negative, alpha=0.2):
    """
    anchor, positive, negative: matriks embedding shape (B, D) yang sudah L2-normalized.
    alpha: margin angular/euclidean
    """
    # Jarak kuadrat Euclidean
    dist_ap = np.sum(np.square(anchor - positive), axis=1)
    dist_an = np.sum(np.square(anchor - negative), axis=1)
    
    # Triplet loss per sampel
    loss = np.maximum(0.0, dist_ap - dist_an + alpha)
    return np.mean(loss), dist_ap, dist_an

# Simulasi 3 skenario Triplet (B=3, D=128)
# Skenario 1: Easy Triplet (dist_an jauh lebih besar dari dist_ap + alpha) -> Loss = 0
# Skenario 2: Semi-Hard Triplet (dist_ap < dist_an < dist_ap + alpha) -> Menghasilkan Loss positif
# Skenario 3: Hard Triplet (dist_an < dist_ap) -> Pelanggaran berat, Loss tinggi

np.random.seed(101)
a = np.random.randn(3, 128)
a /= np.linalg.norm(a, axis=1, keepdims=True)

# Positive embedding (dekat ke anchor)
p = a + np.random.randn(3, 128) * 0.1
p /= np.linalg.norm(p, axis=1, keepdims=True)

# Negative embedding untuk 3 skenario
n = np.zeros_like(a)
# Skenario 1: Easy Negative (arah berlawanan)
n[0] = -a[0]
# Skenario 2: Semi-Hard (agak dekat tapi masih lebih jauh dari p)
n[1] = a[1] + np.random.randn(128) * 0.15
# Skenario 3: Hard Negative (sangat dekat ke anchor, bahkan lebih dekat dari p)
n[2] = a[2] + np.random.randn(128) * 0.05

n /= np.linalg.norm(n, axis=1, keepdims=True)

loss_total, d_ap, d_an = triplet_loss(a, p, n, alpha=0.2)

print("Evaluasi Geometri Triplet Loss (alpha = 0.2):")
labels = ["Easy Triplet", "Semi-Hard Triplet", "Hard Triplet"]
for i in range(3):
    sample_loss = max(0.0, d_ap[i] - d_an[i] + 0.2)
    print(f"{labels[i]}: ||a-p||^2 = {d_ap[i]:.4f} | ||a-n||^2 = {d_an[i]:.4f} | Loss = {sample_loss:.4f}")

print(f"\nRata-rata Triplet Loss Batch: {loss_total:.4f}")
'''

subchapters.append({
    "id": "cv-15-4-facenet-triplet-loss",
    "chapterId": "computer-vision-ch-15",
    "title": "FaceNet dan Triplet Loss: Anchor, Positive, Negative, Margin Pemisah, dan Geometri Embedding",
    "description": "Formulasi fundamental FaceNet: normalisasi hipersferis, struktur triplet (a, p, n), margin separasi alfa, dan optimasi langsung ruang metrik wajah.",
    "estimatedMinutes": 35,
    "order": 4,
    "content": {
        "theory": (
            "Terobosan monumental dalam deep face recognition dicapai oleh **FaceNet** (Schroff, Kalenichenko, & Philbin, Google, CVPR 2015). Alih-alih melatih jaringan melalui layer klasifikasi perantara, FaceNet melatih representasi *deep embedding* secara langsung ke ruang metrik Euclidean menggunakan fungsi objektif **Triplet Loss**.\n\n"
            "Sebuah triplet terdiri dari tiga sampel data:\n"
            "1. **Anchor ($x_i^a$)**: Citra wajah dari individu target tertentu.\n"
            "2. **Positive ($x_i^p$)**: Citra wajah lain dari individu yang sama persis dengan anchor.\n"
            "3. **Negative ($x_i^n$)**: Citra wajah dari individu yang berbeda sama sekali.\n\n"
            "Seluruh vektor embedding $f(x) \\in \\mathbb{R}^d$ diproyeksikan ke permukaan **hipersfer unit berdimensi $d$** melalui normalisasi L2 ketat: $\\| f(x) \\|_2 = 1$. Batasan normalisasi ini mengunci representasi dalam ruang metrik kompak, menghilangkan pengaruh magnitudo aktivasi yang tidak stabil.\n\n"
            "Tujuan geometris Triplet Loss adalah memastikan bahwa jarak antara anchor dan positive selalu lebih kecil daripada jarak antara anchor dan negative dengan selisih minimal sebesar margin $\\alpha > 0$:\n"
            "$$\\| f(x_i^a) - f(x_i^p) \\|_2^2 + \\alpha < \\| f(x_i^a) - f(x_i^n) \\|_2^2, \\quad \\forall (x_i^a, x_i^p, x_i^n) \\in \\mathcal{T}$$\n\n"
            "Fungsi kerugian global yang diminimalkan didefinisikan sebagai:\n"
            "$$\\mathcal{L}_{triplet} = \\sum_{i=1}^M \\max \\left( 0, \\| f(x_i^a) - f(x_i^p) \\|_2^2 - \\| f(x_i^a) - f(x_i^n) \\|_2^2 + \\alpha \\right)$$\n"
            "Secara geometris, optimasi ini mendorong kluster representasi dari individu yang sama (*intra-class cluster*) untuk mengerut menjadi titik kompak pada permukaan bola, sembari mendorong kluster dari individu lain (*inter-class clusters*) menjauh setidaknya sejauh jarak $\\alpha$."
        ),
        "codeSnippet": code_15_4,
        "codeSnippetOutput": run_code_capture_output(code_15_4),
        "realWorldApplication": (
            "Diterapkan pada Google Photos untuk pengelompokan album wajah otomatis, sistem pengawasan lalu lintas pintar, dan otentikasi biometrik aplikasi perbankan modern yang memerlukan komputasi jarak Euclidean cepat pada edge device."
        ),
        "commonPitfalls": [
            r"Lupa melakukan L2 normalization pada embedding f(x), sehingga jaringan mengeksploitasi magnitudo vektor untuk memperkecil loss tanpa memadatkan struktur sudut.",
            r"Menggunakan margin alpha yang terlalu besar (misal alpha > 1.5 pada hipersfer unit), yang menyebabkan representasi kolaps atau gradien meledak.",
            r"Mengabaikan sampling triplet yang selektif: mayoritas triplet acak menghasilkan loss 0 (easy negatives), menyebabkan konvergensi berjalan ribuan kali lebih lambat."
        ],
        "caseStudy": (
            "Pada sebuah sistem pengenalan wajah dengan embedding 128 dimensi pada bola unit, sebuah triplet memiliki jarak ||a-p||^2 = 0.35 dan ||a-n||^2 = 0.45. Jika margin alpha disetel ke 0.20, tentukan apakah triplet ini menghasilkan loss positif, jelaskan klasifikasinya (easy, semi-hard, atau hard), dan bagaimana perubahan bobot akan dipicu."
        ),
        "academicReferences": [
            r"Schroff, F., Kalenichenko, D., & Philbin, J. (2015). FaceNet: A unified embedding for face recognition and clustering. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 815-823).",
            r"Weinberger, K. Q., & Saul, L. K. (2009). Distance metric learning for large margin nearest neighbor classification. Journal of Machine Learning Research, 10(2).",
            r"Wang, F., Xiang, X., Cheng, J., & Yuille, A. L. (2017). NormFace: L2 hypersphere embedding for face verification. In Proceedings of the 25th ACM International Conference on Multimedia (pp. 1041-1049)."
        ]
    }
})

# ==============================================================================
# Subbab 15.5: Strategi Triplet Mining: Hard, Semi-Hard, Online Batch Mining
# ==============================================================================
code_15_5 = r'''import numpy as np

# Implementasi Online Semi-Hard Triplet Mining dalam Satu Mini-Batch
# Untuk setiap anchor dan positive berlabel sama, cari negative berlabel beda yang memenuhi:
# ||a - p||^2 < ||a - n||^2 < ||a - p||^2 + alpha

def online_semi_hard_mining(embeddings, labels, alpha=0.2):
    """
    embeddings: (B, D) L2-normalized
    labels: (B,) integer identitas
    """
    B = embeddings.shape[0]
    # Matriks jarak berpasangan: D_ij^2 = ||x_i - x_j||^2
    # ||u - v||^2 = ||u||^2 + ||v||^2 - 2 u.v = 2 - 2 u.v (karena L2 normalized)
    similarity = np.dot(embeddings, embeddings.T)
    pairwise_dist_sq = 2.0 - 2.0 * similarity
    pairwise_dist_sq = np.maximum(0.0, pairwise_dist_sq)
    
    triplets = []
    
    for i in range(B):
        anchor_label = labels[i]
        for j in range(B):
            if i != j and labels[j] == anchor_label:
                d_ap = pairwise_dist_sq[i, j]
                # Cari semi-hard negative k
                candidates = []
                for k in range(B):
                    if labels[k] != anchor_label:
                        d_an = pairwise_dist_sq[i, k]
                        # Kondisi semi-hard: d_ap < d_an < d_ap + alpha
                        if d_ap < d_an < (d_ap + alpha):
                            candidates.append((k, d_an))
                
                if candidates:
                    # Pilih kandidat negative terdekat (paling informatif)
                    best_k, best_dan = min(candidates, key=lambda item: item[1])
                    triplets.append((i, j, best_k, d_ap, best_dan, d_ap - best_dan + alpha))
                    
    return triplets

# Simulasi mini-batch dengan 6 sampel dari 3 identitas berbeda (masing-masing 2 foto)
np.random.seed(42)
labels = np.array([0, 0, 1, 1, 2, 2])
emb = np.random.randn(6, 64)
# Berikan kedekatan buatan untuk sampel sekelas
emb[1] = emb[0] + np.random.randn(64) * 0.3
emb[3] = emb[2] + np.random.randn(64) * 0.3
emb[5] = emb[4] + np.random.randn(64) * 0.3
# Normalisasi L2
emb /= np.linalg.norm(emb, axis=1, keepdims=True)

mined_triplets = online_semi_hard_mining(emb, labels, alpha=0.25)

print(f"Total Sampel Batch: 6 | Triplet Semi-Hard Terseleksi: {len(mined_triplets)}")
for idx, (a, p, n, dap, dan, loss_val) in enumerate(mined_triplets[:3]):
    print(f"Triplet {idx+1}: Anchor ID={labels[a]} (idx {a}), Pos (idx {p}), Neg ID={labels[n]} (idx {n})")
    print(f"   d(a,p)^2={dap:.4f} < d(a,n)^2={dan:.4f} < dap+alpha={dap+0.25:.4f} | Loss: {loss_val:.4f}")
print("\nStrategi semi-hard mining mencegah gradien kolaps dan mempercepat konvergensi pelatihan.")
'''

subchapters.append({
    "id": "cv-15-5-triplet-mining-strategies",
    "chapterId": "computer-vision-ch-15",
    "title": "Strategi Triplet Mining: Hard Negative, Semi-Hard Negative Mining, dan Stabilitas Konvergensi",
    "description": "Kritikalitas pemilihan triplet dalam mini-batch: patologi easy negatives, kolaps model akibat extreme hard negatives, dan algoritma semi-hard mining.",
    "estimatedMinutes": 35,
    "order": 5,
    "content": {
        "theory": (
            "Meskipun Triplet Loss secara matematis sangat elegan, keberhasilan praktisnya sepenuhnya bergantung pada strategi pemilihan sampel (*triplet mining*). Jika sebuah dataset memiliki $N$ gambar, terdapat $\\mathcal{O}(N^3)$ kemungkinan triplet. Pada sebagian besar pasangan acak, jarak antar identitas berbeda sudah secara alami jauh melampaui margin $\\alpha$:\n"
            "$$\\| f(x_i^a) - f(x_i^p) \\|_2^2 + \\alpha < \\| f(x_i^a) - f(x_i^n) \\|_2^2 \\implies \\mathcal{L} = 0$$\n"
            "Kondisi ini disebut **Easy Negatives**, di mana sampel tidak menghasilkan gradien apa pun ($\\nabla \\mathcal{L} = 0$), sehingga proses pelatihan model menjadi stagnan dan sangat lambat.\n\n"
            "Sebaliknya, jika kita secara naif selalu memilih **Hard Negatives** paling ekstrem (yaitu negatif dengan jarak terkecil $\\min_n \\| f(x_i^a) - f(x_i^n) \\|_2^2$), optimasi gradien pada tahap awal pelatihan sering kali mengalami **model collapse** (kejatuhan ke representasi lokal minimum di mana seluruh representasi memetakan ke satu vektor konstan, atau menghasilkan gradien meledak akibat kesalahan anotasi label / noisy labels).\n\n"
            "Untuk mengatasi dilema ini, Schroff et al. (2015) memperkenalkan strategi **Semi-Hard Negative Mining**, di mana sampel negatif $x_i^n$ dipilih sedemikian rupa sehingga jaraknya ke anchor lebih jauh daripada pasangan positif, namun masih berada di dalam koridor margin $\\alpha$:\n"
            "$$\\| f(x_i^a) - f(x_i^p) \\|_2^2 < \\| f(x_i^a) - f(x_i^n) \\|_2^2 < \\| f(x_i^a) - f(x_i^p) \\|_2^2 + \\alpha$$\n\n"
            "Kondisi ini memastikan dua hal krusial:\n"
            "1. Nilai fungsi kerugian bernilai positif ($\\mathcal{L} > 0$), menghasilkan gradien pembaruan bobot yang aktif dan bermakna.\n"
            "2. Hubungan relatif geometris tetap stabil (sampel negatif belum secara salah dinilai lebih dekat daripada sampel positif), menghindarkan jaringan dari guncangan gradien yang merusak manifold fitur.\n\n"
            "Secara komputasi modern, pemilihan ini dieksekusi secara **Online Batch Mining**, di mana seluruh matriks jarak berpasangan $B \\times B$ dihitung secara paralel pada GPU untuk memfilter triplet aktif secara real-time."
        ),
        "codeSnippet": code_15_5,
        "codeSnippetOutput": run_code_capture_output(code_15_5),
        "realWorldApplication": (
            "Diterapkan dalam sistem *person re-identification* (Re-ID) pelacakan tersangka di jaringan kamera perkotaan, pencarian produk berbasis gambar e-commerce (reverse image search), dan pengelompokan citra biometrik skala besar."
        ),
        "commonPitfalls": [
            r"Melakukan offline triplet mining sebelum training dimulai, yang membutuhkan waktu komputasi raksasa dan cepat usang seiring berjalannya pembaruan bobot model.",
            r"Batch size terlalu kecil (misal B < 32), sehingga probabilitas menemukan pasangan semi-hard berlabel sama dalam satu batch menjadi sangat rendah.",
            r"Adanya noise label pada dataset (misalnya dua orang berbeda diberi ID yang sama), yang jika terpilih sebagai hard negative akan merusak seluruh manifold embedding."
        ],
        "caseStudy": (
            "Sebuah tim insinyur melatih model FaceNet dengan batch size 64 dan menemukan bahwa setelah epoch ke-10, 98% triplet dalam batch menghasilkan loss 0. Jelaskan mengapa fenomena ini terjadi, dan bagaimana modifikasi pipeline sampling mini-batch (P subjek x K foto per subjek) dapat mengatasi kelangkaan triplet aktif."
        ),
        "academicReferences": [
            r"Schroff, F., Kalenichenko, D., & Philbin, J. (2015). FaceNet: A unified embedding for face recognition and clustering. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 815-823).",
            r"Hermans, A., Beyer, L., & Leibe, B. (2017). In defense of the triplet loss for person re-identification. arXiv preprint arXiv:1703.07737.",
            r"Xuan, H., Souvenir, R., & Pless, R. (2020). Improved embeddings with easy positive triplet mining. In Proceedings of the IEEE/CVF Winter Conference on Applications of Computer Vision (pp. 2474-2482)."
        ]
    }
})

# ==============================================================================
# Subbab 15.6: Margin Angular pada Manifold Bola: Normalisasi Bobot dan Fitur
# ==============================================================================
code_15_6 = r'''import numpy as np

# Simulasi Normalisasi Bobot dan Fitur: W_j / ||W_j|| dan x / ||x||
# Logit softmax standar: W_j^T x = ||W_j|| * ||x|| * cos(theta_j)
# Dengan normalisasi L2: ||W_j|| = 1 dan ||x|| diproyeksikan dan diskalakan ke s
# Logit menjadi: s * cos(theta_j)

def normalized_cosine_logits(features, weights, scale=16.0):
    """
    features: (B, D) vektor aktivasi representasi wajah
    weights: (C, D) vektor bobot klasifikasi untuk C kelas identitas
    scale: faktor skala temperatur s
    """
    # L2 Normalization bobot dan fitur
    f_norm = features / np.linalg.norm(features, axis=1, keepdims=True)
    w_norm = weights / np.linalg.norm(weights, axis=1, keepdims=True)
    
    # Cosine theta = f_norm . w_norm^T
    cos_theta = np.dot(f_norm, w_norm.T)
    cos_theta = np.clip(cos_theta, -1.0, 1.0)
    
    # Penskalaan dengan faktor s
    scaled_logits = scale * cos_theta
    return scaled_logits, cos_theta

# Simulasi 1 fitur wajah berdimensi 4 dan 3 prototipe kelas
x = np.array([[3.0, 1.0, 0.0, 4.0]]) # Magnitudo awal = sqrt(9+1+16) = 5.099
W = np.array([
    [1.0, 0.0, 0.0, 0.0],  # Kelas 1
    [3.0, 1.0, 0.0, 4.0],  # Kelas 2 (arah sama persis dengan x)
    [-1.0, -1.0, 0.0, 0.0] # Kelas 3 (arah berlawanan)
])

logits, cos_t = normalized_cosine_logits(x, W, scale=10.0)

print(f"Cosine Theta terhadap Kelas 1: {cos_t[0, 0]:.4f} (Sudut = {np.degrees(np.arccos(cos_t[0, 0])):.1f} deg)")
print(f"Cosine Theta terhadap Kelas 2: {cos_t[0, 1]:.4f} (Sudut = {np.degrees(np.arccos(cos_t[0, 1])):.1f} deg - Identik)")
print(f"Cosine Theta terhadap Kelas 3: {cos_t[0, 2]:.4f} (Sudut = {np.degrees(np.arccos(cos_t[0, 2])):.1f} deg)")
print(f"\nScaled Logits (s=10): Kelas 1={logits[0,0]:.2f}, Kelas 2={logits[0,1]:.2f}, Kelas 3={logits[0,2]:.2f}")
print("Normalisasi mengeliminasi bias magnitudo dan mendasarkan klasifikasi murni pada sudut geometris.")
'''

subchapters.append({
    "id": "cv-15-6-angular-margin-spherical-manifold",
    "chapterId": "computer-vision-ch-15",
    "title": "Margin Angular pada Manifold Bola: Normalisasi Bobot dan Fitur serta Geometri Cosine",
    "description": "Transisi dari ruang metrik Euclidean ke manifold hipersferis: dekomposisi dot product, normalisasi L2 ganda, dan fungsi penskalaan temperatur skalar.",
    "estimatedMinutes": 35,
    "order": 6,
    "content": {
        "theory": (
            "Meskipun Triplet Loss berhasil melatih representasi wajah open-set, efisiensi pelatihannya terhambat oleh proses mining kombinatorial yang rumit dan konvergensi yang lambat. Sejak 2017, komunitas visi komputer beralih ke paradigma **Angular Margin Loss** berbasis klasifikasi pada manifold bola (*spherical manifold*).\n\n"
            "Titik awal pergeseran ini adalah analisis terhadap logit dalam fungsi softmax konvensional:\n"
            "$$W_j^T x_i = \\| W_j \\| \\| x_i \\| \\cos \\theta_j$$\n"
            "di mana $\\theta_j$ adalah sudut spasial antara vektor bobot kelas $W_j$ dan vektor fitur $x_i$. Dalam softmax standar, nilai logit dapat membesar melalui dua mekanisme berbeda: (1) memperkecil sudut $\\theta_j$ (keselarasan semantik fitur), atau (2) memperbesar magnitudo $\\| x_i \\|$ atau $\\| W_j \\|$. Ditemukan secara empiris bahwa jaringan cenderung memperbesar magnitudo fitur untuk citra berkualitas tinggi dan memperkecilnya untuk citra buram, yang merusak keseragaman ruang metrik.\n\n"
            "Untuk memurnikan representasi, dilakukan **normalisasi L2 ganda** (*dual normalization*):\n"
            "1. Menormalkan bobot kelas: $\\| W_j \\|_2 = 1$ dengan menetapkan bias $b_j = 0$.\n"
            "2. Menormalkan vektor fitur: $\\frac{x_i}{\\| x_i \\|_2}$, kemudian menskalakannya dengan konstanta skalar hiperparameter $s$ (*feature scale parameter*).\n\n"
            "Dengan transformasi ini, logit klasifikasi menjadi murni berbasis kosinus sudut:\n"
            "$$\\mathcal{L} = - \\log \\frac{\\exp(s \\cos \\theta_{y_i})}{\\sum_{j=1}^C \\exp(s \\cos \\theta_j)}$$\n"
            "Dalam formulasi ini, seluruh representasi fitur terdistribusi pada **permukaan hipersfer unit**, dan vektor bobot $W_j$ bertindak sebagai pusat massa (*class centers / prototypes*) dari masing-masing identitas. Parameter skala $s$ memegang peran kritis sebagai invers temperatur Boltzmann: jika $s$ terlalu kecil, fungsi softmax tidak memiliki kapasitas diskriminasi yang cukup untuk memisahkan ribuan kelas pada permukaan bola."
        ),
        "codeSnippet": code_15_6,
        "codeSnippetOutput": run_code_capture_output(code_15_6),
        "realWorldApplication": (
            "Menjadi fondasi seluruh pustaka pengenalan wajah modern tingkat industri (seperti InsightFace, DeepFace, FaceX-Zoo) untuk melatih model pada dataset raksasa berisi jutaan identitas (MS-Celeb-1M, Glint360k) secara stabil."
        ),
        "commonPitfalls": [
            r"Menyetel nilai skala s terlalu kecil (misal s < 10) pada klasifikasi ribuan identitas, yang menyebabkan fungsi softmax jenuh pada nilai peluang seragam 1/C.",
            r"Tidak menonaktifkan bias b_j pada layer linear klasifikasi terakhir, yang merusak simetri proyeksi hipersferis.",
            r"Lupa memotong nilai cos(theta) ke interval [-1.0, 1.0] sebelum operasi arccos, yang memicu nilai NaN akibat ketidakpresisian floating-point."
        ],
        "caseStudy": (
            "Diberikan sebuah model pengenalan wajah yang dilatih dengan skala s = 64 pada hipersfer unit. Hitung nilai batas bawah teoretis untuk sudut kosinus theta agar peluang softmax terhadap kelas yang benar mencapai minimal 90% ketika terdapat 10.000 kelas pengganggu."
        ),
        "academicReferences": [
            r"Wang, F., Xiang, X., Cheng, J., & Yuille, A. L. (2017). NormFace: L2 hypersphere embedding for face verification. In Proceedings of the 25th ACM International Conference on Multimedia (pp. 1041-1049).",
            r"Liu, W., Wen, Y., Yu, Z., & Yang, M. (2016). Large-margin softmax loss for convolutional neural networks. In ICML (Vol. 2, p. 7).",
            r"Ranjan, R., Castillo, C. D., & Chellappa, R. (2017). L2-constrained softmax loss for discriminative face verification. arXiv preprint arXiv:1703.09507."
        ]
    }
})

# ==============================================================================
# Subbab 15.7: SphereFace: Multiplicative Angular Margin (A-Softmax)
# ==============================================================================
code_15_7 = r'''import numpy as np

# Implementasi Multiplicative Angular Margin Loss (SphereFace / A-Softmax)
# Logit kelas target: cos(m * theta)
# Membutuhkan fungsi monoton piecewise psi(theta) untuk menjamin penurunan monotonik pada [0, pi]

def sphereface_psi_theta(cos_theta, m=4):
    """
    Fungsi psi(theta) = (-1)^k * cos(m * theta) - 2*k
    di mana k * pi / m <= theta <= (k + 1) * pi / m
    """
    theta = np.arccos(np.clip(cos_theta, -1.0, 1.0))
    # Untuk m=4: cos(4*theta) = 8*cos^4(t) - 8*cos^2(t) + 1
    # Implementasi analitik umum menggunakan k
    k = np.floor(theta * m / np.pi)
    psi = ((-1.0)**k) * np.cos(m * theta) - 2.0 * k
    return psi, theta

# Simulasi evaluasi sudut theta dari 0 hingga pi (0 hingga 180 derajat)
sample_thetas_deg = np.array([15.0, 40.0, 60.0, 90.0])
cos_vals = np.cos(np.radians(sample_thetas_deg))

psi_vals, thetas_rad = sphereface_psi_theta(cos_vals, m=4)

print("Evaluasi Margin Multiplikatif SphereFace (m=4):")
for deg, c, p in zip(sample_thetas_deg, cos_vals, psi_vals):
    print(f"Sudut: {deg:5.1f} deg | cos(theta): {c:7.4f} | psi(theta) (Logit Termargin): {p:7.4f}")

print("\nKarakteristik: SphereFace mempersempit batas keputusan dengan faktor pengali integer m.")
'''

subchapters.append({
    "id": "cv-15-7-sphereface-angular-margin",
    "chapterId": "computer-vision-ch-15",
    "title": "SphereFace: Multiplicative Angular Margin ($m\\theta$) dan Batas Keputusan Non-Linear",
    "description": "Arsitektur A-Softmax (SphereFace): pengenalan margin multiplikatif pada sudut, formulasi fungsi piecewise monotonik, dan batas keputusan manifold.",
    "estimatedMinutes": 35,
    "order": 7,
    "content": {
        "theory": (
            "Tonggak penting pertama dalam penerapan margin angular eksplisit dirintis oleh **SphereFace** (*Angular Softmax / A-Softmax*, Liu et al., CVPR 2017). SphereFace memaksakan margin diskriminatif langsung pada domain sudut $\\theta$ dengan mengalikan sudut target dengan integer faktor margin $m \\ge 1$.\n\n"
            "Dalam klasifikasi biner antara kelas 1 ($W_1$) dan kelas 2 ($W_2$), batas keputusan softmax ternormalisasi konvensional terjadi saat $\\cos \\theta_1 = \\cos \\theta_2$, atau $\\theta_1 = \\theta_2$. SphereFace memodifikasi syarat batas ini sehingga sampel dari kelas 1 harus memenuhi kondisi yang jauh lebih ketat:\n"
            "$$\\cos(m \\theta_1) \\ge \\cos \\theta_2, \\quad \\text{untuk class 1}$$\n"
            "yang setara dengan mengharuskan $\\theta_1 \\le \\frac{\\theta_2}{m}$. Dengan kata lain, batas sudut toleransi untuk kelas target ditekan menjadi $1/m$ dari sudut terhadap kelas saingan, menghasilkan zona penyangga bebas sampel (*angular margin*) sebesar $\\frac{m-1}{m+1} \\theta_2$.\n\n"
            "Formulasi fungsi kerugian **A-Softmax Loss** didefinisikan sebagai:\n"
            "$$\\mathcal{L}_{A\\text{-softmax}} = - \\frac{1}{N} \\sum_{i=1}^N \\log \\frac{\\exp(\\| x_i \\| \\psi(\\theta_{y_i}))}{\\exp(\\| x_i \\| \\psi(\\theta_{y_i})) + \\sum_{j \\neq y_i} \\exp(\\| x_i \\| \\cos \\theta_j)}$$\n"
            "Tantangan matematis utama dalam SphereFace adalah fungsi $\\cos(m \\theta)$ tidak monoton turun pada interval $\\theta \\in [0, \\pi]$ ketika $m > 1$. Untuk menjaga konsistensi optimasi gradien, Liu et al. mendesain fungsi *piecewise monotonic surrogate* $\\psi(\\theta)$:\n"
            "$$\\psi(\\theta) = (-1)^k \\cos(m \\theta) - 2k, \\quad \\theta \\in \\left[ \\frac{k\\pi}{m}, \\frac{(k+1)\\pi}{m} \\right], \\quad k \\in [0, m-1]$$\n\n"
            "Meskipun membuktikan superioritas margin sudut dibandingkan margin Euclidean, SphereFace terkenal sangat sulit dilatih secara stabil (*training instability*) dan memerlukan penjadwalan *annealing parameter* yang sangat rumit untuk melonggarkan nilai $m$ di awal pelatihan sebelum menaikkannya secara bertahap."
        ),
        "codeSnippet": code_15_7,
        "codeSnippetOutput": run_code_capture_output(code_15_7),
        "realWorldApplication": (
            "Diterapkan pada generasi awal model pengenalan wajah berskala besar (2017-2018) dan menjadi dasar verifikasi open-set pada dataset benchmark LFW (Labeled Faces in the Wild) dan MegaFace."
        ),
        "commonPitfalls": [
            r"Mengimplementasikan cos(m * theta) secara langsung tanpa piecewise surrogate psi(theta), yang menyebabkan osilasi gradien liar saat m*theta melampaui pi.",
            r"Pelatihan langsung dengan m=4 sejak iterasi pertama tanpa kurva annealing hiperparameter lambda, yang hampir pasti memicu konvergensi gagal.",
            r"Kompleksitas komputasi turunan trigonometri yang tinggi pada backward pass memperlambat throughput pelatihan batch."
        ],
        "caseStudy": (
            "Jelaskan mengapa pada klasifikasi 2 kelas dengan A-Softmax (m=2), batas keputusan angular kelas 1 mengharuskan sudut theta_1 <= 60 derajat jika sudut pemisah antar bobot W1 dan W2 adalah 120 derajat. Gambarkan bagaimana zona margin angular ini memadatkan manifold fitur."
        ),
        "academicReferences": [
            r"Liu, W., Wen, Y., Yu, Z., Li, M., Raj, B., & Song, L. (2017). SphereFace: Deep hypersphere embedding for face recognition. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 212-220).",
            r"Liu, W., Zhang, Y. M., Li, X., Yu, Z., Dai, B., Zhao, T., & Song, L. (2018). Deep hyperspherical learning. In Advances in Neural Information Processing Systems (pp. 3950-3960).",
            r"Wang, H., Wang, Y., Zhou, Z., Ji, X., Gong, D., Zhou, J., ... & Liu, W. (2018). CosFace: Large margin cosine loss for deep face recognition. In CVPR (pp. 5265-5274)."
        ]
    }
})

# ==============================================================================
# Subbab 15.8: CosFace: Large Margin Cosine Loss (LMCL)
# ==============================================================================
code_15_8 = r'''import numpy as np

# Implementasi Large Margin Cosine Loss (CosFace / LMCL)
# Logit target: s * (cos(theta_{y_i}) - m)
# Logit non-target: s * cos(theta_j)
# Pengurangan margin aditif m langsung pada domain cosine menjamin kemonotonan murni.

def cosface_loss(features, targets, weights, scale=30.0, margin=0.35):
    """
    features: (B, D) vektor fitur
    targets: (B,) indeks label kelas
    weights: (C, D) matriks bobot kelas
    scale: faktor skala s
    margin: margin cosine aditif m
    """
    # Normalisasi L2
    f_norm = features / np.linalg.norm(features, axis=1, keepdims=True)
    w_norm = weights / np.linalg.norm(weights, axis=1, keepdims=True)
    
    # Cosine similarities: (B, C)
    cos_theta = np.dot(f_norm, w_norm.T)
    cos_theta = np.clip(cos_theta, -1.0, 1.0)
    
    # Salin matriks kosinus untuk membangun logit ter-margin
    margin_logits = scale * cos_theta.copy()
    
    B = features.shape[0]
    for i in range(B):
        target_class = targets[i]
        # Terapkan penalti margin aditif pada kelas target yang benar
        margin_logits[i, target_class] = scale * (cos_theta[i, target_class] - margin)
        
    # Cross-Entropy Softmax Loss
    max_logits = np.max(margin_logits, axis=1, keepdims=True)
    exp_logits = np.exp(margin_logits - max_logits)
    probs = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)
    
    loss = -np.mean(np.log(probs[np.arange(B), targets] + 1e-12))
    return loss, cos_theta

# Simulasi evaluasi numerik CosFace
np.random.seed(42)
B, D, C = 2, 16, 4
feats = np.random.randn(B, D)
W_mat = np.random.randn(C, D)
y_true = np.array([1, 2])

loss_val, cos_mat = cosface_loss(feats, y_true, W_mat, scale=30.0, margin=0.35)

print(f"CosFace Loss: {loss_val:.4f}")
print(f"Kosinus Awal Sampel 0 terhadap Kelas Target {y_true[0]}: {cos_mat[0, y_true[0]]:.4f}")
print(f"Nilai Kosinus Setelah Penalti Margin (cos - 0.35): {cos_mat[0, y_true[0]] - 0.35:.4f}")
print("Penerapan margin aditif pada domain kosinus menyederhanakan stabilitas pelatihan secara dramatis.")
'''

subchapters.append({
    "id": "cv-15-8-cosface-large-margin-cosine",
    "chapterId": "computer-vision-ch-15",
    "title": "CosFace (Large Margin Cosine Loss / LMCL): Additive Cosine Margin dan Simplifikasi Optimasi",
    "description": "Formulasi CosFace: substitusi margin sudut multiplikatif dengan margin kosinus aditif, stabilitas optimasi gradien, dan sifat konvergensi analitik.",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "Untuk mengatasi ketidakstabilan optimasi dan kompleksitas fungsi piecewise pada SphereFace, Wang et al. (Tencent AI Lab, CVPR 2018) memperkenalkan **CosFace** (*Large Margin Cosine Loss / LMCL*). Inovasi kunci CosFace adalah memindahkan penalti margin dari domain sudut multiplikatif ($m\\theta$) langsung ke **domain kosinus aditif** ($\\cos \\theta - m$).\n\n"
            "Dalam CosFace, fitur dinormalkan dengan L2 norm dan diskalakan oleh konstanta $s$, dan bobot kelas dinormalkan $\\| W_j \\| = 1$. Fungsi kerugian LMCL didefinisikan secara elegan sebagai:\n"
            "$$\\mathcal{L}_{LMCL} = - \\frac{1}{N} \\sum_{i=1}^N \\log \\frac{\\exp(s (\\cos \\theta_{y_i} - m))}{\\exp(s (\\cos \\theta_{y_i} - m)) + \\sum_{j \\neq y_i} \\exp(s \\cos \\theta_j)}$$\n"
            "dengan batasan operasional pada sudut kosinus:\n"
            "$$\\cos \\theta_{y_i} - m \\ge 0 \\quad \\text{dan} \\quad \\| W_j \\| = 1, \\quad \\frac{\\| x_i \\|}{\\| x_i \\|} = 1$$\n\n"
            "Batas keputusan biner antara kelas 1 dan kelas 2 menjadi:\n"
            "$$\\cos \\theta_1 - m \\ge \\cos \\theta_2 \\implies \\cos \\theta_1 \\ge \\cos \\theta_2 + m$$\n"
            "Artinya, untuk diklasifikasikan dengan benar ke kelas 1, proyeksi kosinus sampel harus melebihi proyeksi kosinus terhadap kelas 2 setidaknya sebesar margin skalar konstan $m$.\n\n"
            "Keunggulan fundamental CosFace meliputi:\n"
            "1. **Kemonotonan Alami**: Karena fungsi $\\cos \\theta - m$ adalah pergeseran linear sederhana dari fungsi kosinus, ia secara alami monoton turun pada interval $\\theta \\in [0, \\pi]$ tanpa memerlukan fungsi pengganti piecewise buatan seperti $\\psi(\\theta)$ pada SphereFace.\n"
            "2. **Stabilitas Konvergensi Penuh**: Model dapat dilatih secara *end-to-end* sejak iterasi pertama tanpa trik *annealing schedule* apa pun.\n"
            "3. **Interpretasi Margin Global**: Margin $m \\in [0.35, 0.45]$ memberikan batas separasi seragam di seluruh ruang kosinus."
        ),
        "codeSnippet": code_15_8,
        "codeSnippetOutput": run_code_capture_output(code_15_8),
        "realWorldApplication": (
            "Banyak diimplementasikan pada sistem verifikasi biometrik perbankan seluler dan pengenalan wajah skala masif karena kebutuhan komputasinya yang ringan dan proses pelatihan yang sangat tangguh terhadap hiperparameter."
        ),
        "commonPitfalls": [
            r"Memilih nilai margin kosinus m terlalu besar (misal m > 0.6) yang menyebabkan nilai (cos(theta) - m) menjadi sangat negatif dan mematikan sinyal gradien.",
            r"Lupa menyertakan penskalaan temperatur s pada seluruh logit (baik kelas target maupun non-target), yang mengakibatkan gradien softmax tercekik.",
            r"Mengabaikan clipping nilai cosinus pada rentang [-1.0, 1.0] setelah penambahan margin."
        ],
        "caseStudy": (
            "Bandingkan batas keputusan ruang sudut antara Softmax standar (cos theta1 = cos theta2), SphereFace (cos 2*theta1 = cos theta2), dan CosFace (cos theta1 - 0.35 = cos theta2). Mengapa CosFace memberikan margin pemisah yang lebih konsisten pada seluruh rentang sudut?"
        ),
        "academicReferences": [
            r"Wang, H., Wang, Y., Zhou, Z., Ji, X., Gong, D., Zhou, J., ... & Liu, W. (2018). CosFace: Large margin cosine loss for deep face recognition. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 5265-5274).",
            r"Wang, F., Cheng, J., Liu, W., & Liu, H. (2018). Additive margin softmax for face verification. IEEE Signal Processing Letters, 25(7), 926-930.",
            r"Deng, J., Guo, J., Niannan, X., & Zafeiriou, S. (2019). ArcFace: Additive angular margin loss for deep face recognition. In CVPR (pp. 4690-4699)."
        ]
    }
})

# ==============================================================================
# Subbab 15.9: ArcFace: Additive Angular Margin Loss (Spot-Check Paper CVPR 2019)
# ==============================================================================
code_15_9 = r'''import numpy as np

# Implementasi ArcFace (Additive Angular Margin Loss, Deng et al., CVPR 2019)
# Rumus kanonikal: L = -log( exp(s * cos(theta_{y_i} + m)) / ( exp(s * cos(theta_{y_i} + m)) + sum_{j!=y_i} exp(s * cos(theta_j)) ) )
# Margin m ditambahkan langsung ke sudut geodesik: cos(theta + m) = cos(theta)*cos(m) - sin(theta)*sin(m)

def arcface_loss(features, targets, weights, scale=64.0, margin=0.5):
    """
    features: (B, D) embedding wajah
    targets: (B,) label kelas identitas
    weights: (C, D) matriks pusat bobot kelas
    scale: s = 64.0 (rekomendasi paper resmi)
    margin: m = 0.5 radian (~28.6 derajat, rekomendasi paper resmi)
    """
    # 1. Normalisasi L2 fitur dan bobot
    f_norm = features / np.linalg.norm(features, axis=1, keepdims=True)
    w_norm = weights / np.linalg.norm(weights, axis=1, keepdims=True)
    
    # 2. Hitung cos(theta) = f_norm . w_norm^T
    cos_theta = np.dot(f_norm, w_norm.T)
    cos_theta = np.clip(cos_theta, -1.0 + 1e-7, 1.0 - 1e-7)
    
    # 3. Hitung cos(theta + m) menggunakan identitas trigonometri:
    # cos(theta + m) = cos(theta)*cos(m) - sin(theta)*sin(m)
    cos_m = np.cos(margin)
    sin_m = np.sin(margin)
    sin_theta = np.sqrt(1.0 - np.square(cos_theta))
    cos_theta_m = cos_theta * cos_m - sin_theta * sin_m
    
    # Thresholding untuk memastikan penurunan monotonik ketika theta + m > pi
    threshold = np.cos(np.pi - margin)
    cos_theta_m_safe = np.where(cos_theta > threshold, cos_theta_m, cos_theta - np.sin(np.pi - margin) * margin)
    
    # 4. Bangun logits ter-margin
    logits = scale * cos_theta.copy()
    B = features.shape[0]
    for i in range(B):
        target_idx = targets[i]
        logits[i, target_idx] = scale * cos_theta_m_safe[i, target_idx]
        
    # 5. Softmax Cross-Entropy
    max_l = np.max(logits, axis=1, keepdims=True)
    exp_l = np.exp(logits - max_l)
    probs = exp_l / np.sum(exp_l, axis=1, keepdims=True)
    
    loss = -np.mean(np.log(probs[np.arange(B), targets] + 1e-12))
    return loss, cos_theta, cos_theta_m

# Evaluasi numerik
np.random.seed(42)
B, D, C = 2, 512, 5
f_dummy = np.random.randn(B, D)
w_dummy = np.random.randn(C, D)
y_dummy = np.array([0, 3])

loss_arc, c_orig, c_arc = arcface_loss(f_dummy, y_dummy, w_dummy, scale=64.0, margin=0.5)

print("Verifikasi Numerik ArcFace Loss (Deng et al., CVPR 2019):")
print(f"ArcFace Loss Batch: {loss_arc:.4f}")
print(f"Sampel 0 Target {y_dummy[0]}: cos(theta) = {c_orig[0, y_dummy[0]]:.4f} (theta = {np.degrees(np.arccos(c_orig[0, y_dummy[0]])) :.2f} deg)")
print(f"Setelah Penambahan Margin Geodesik m=0.5 rad (28.65 deg):")
print(f"cos(theta + m) = {c_arc[0, y_dummy[0]]:.4f} (theta+m = {np.degrees(np.arccos(c_orig[0, y_dummy[0]])) + 28.65:.2f} deg)")
print("\nArcFace secara eksak menerapkan margin jarak geodesik pada manifold hipersferis!")
'''

subchapters.append({
    "id": "cv-15-9-arcface-additive-angular-margin",
    "chapterId": "computer-vision-ch-15",
    "title": "ArcFace (Additive Angular Margin Loss): Additive Geodesic Margin, Distribusi Fitur Hipersferis, dan State-of-the-Art",
    "description": "Analisis mendalam ArcFace (Deng et al., CVPR 2019): integrasi margin geodesik aditif s*cos(theta + m), pembuktian geometris pada hipersfer unit, dan perbandingan komprehensif terhadap SphereFace dan CosFace.",
    "estimatedMinutes": 40,
    "order": 9,
    "content": {
        "theory": (
            "Dalam ranah pengenalan wajah berbasis deep learning, **ArcFace** (*Additive Angular Margin Loss*, Deng et al., Imperial College London / InsightFace, CVPR 2019) diakui secara universal sebagai salah satu karya paling berpengaruh dan menjadi standar industri de facto (*state-of-the-art*). ArcFace menyempurnakan batasan geometris manifold bola dengan menambahkan penalti margin sudut aditif langsung ke dalam sudut target $\\theta$ sebelum dievaluasi oleh fungsi kosinus.\n\n"
            "Deng et al. membedah fungsi klasifikasi softmax konvensional:\n"
            "$$L_1 = - \\frac{1}{N} \\sum_{i=1}^N \\log \\frac{e^{W_{y_i}^T x_i + b_{y_i}}}{\\sum_{j=1}^n e^{W_j^T x_i + b_j}}$$\n"
            "di mana $x_i \\in \\mathbb{R}^d$ merepresentasikan fitur deep dari sampel ke-$i$ yang berlabel kelas $y_i$. Dengan menetapkan bias $b_j = 0$, logit ditransformasikan menjadi $W_j^T x_i = \\| W_j \\| \\| x_i \\| \\cos \\theta_j$. Melalui normalisasi L2 pada bobot ($\\frac{W_j}{\\| W_j \\|}$) dan fitur ($\\frac{x_i}{\\| x_i \\|}$), serta penskalaan magnitudo fitur dengan skalar radius $s$, prediksi hanya bergantung murni pada sudut spasial $\\theta$ antara fitur dan bobot kelas.\n\n"
            "Berdasarkan formulasi tersebut, ArcFace menambahkan **penalti margin sudut aditif** $m$ (*additive angular margin penalty*) antara vektor fitur $x_i$ dan bobot kelas target $W_{y_i}$. Karena penalti sudut aditif pada permukaan hipersfer ternormalisasi identik secara matematis dengan **margin jarak geodesik** (*geodesic distance margin penalty*) pada manifold bola, metode ini dinamakan **ArcFace**.\n\n"
            "Formulasi kanonikal fungsi kerugian ArcFace didefinisikan sebagai:\n"
            "$$L_3 = - \\frac{1}{N} \\sum_{i=1}^N \\log \\frac{e^{s(\\cos(\\theta_{y_i} + m))}}{e^{s(\\cos(\\theta_{y_i} + m))} + \\sum_{j=1, j \\neq y_i}^n e^{s \\cos \\theta_j}}$$\n\n"
            "Perbandingan geometris batas keputusan biner kelas 1 terhadap kelas 2 memperlihatkan keunggulan inheren masing-masing pendekatan:\n"
            "1. **Softmax Konvensional**: $\\cos \\theta_1 = \\cos \\theta_2$.\n"
            "2. **SphereFace**: $\\cos(m \\theta_1) = \\cos \\theta_2$ (margin sudut non-linear non-aditif).\n"
            "3. **CosFace**: $\\cos \\theta_1 - m = \\cos \\theta_2$ (margin kosinus aditif).\n"
            "4. **ArcFace**: $\\cos(\\theta_1 + m) = \\cos \\theta_2$ (margin geodesik sudut konstan murni).\n\n"
            "Karena sudut geodesik terikat langsung dengan panjang busur busur lingkaran pada bola unit ($s = r \\cdot \\theta = 1 \\cdot \\theta = \\theta$), penambahan $m$ memberikan pemisahan margin geometris yang paling konstan, linear, dan seragam di seluruh rentang orientasi sudut manapun pada manifold representasi."
        ),
        "codeSnippet": code_15_9,
        "codeSnippetOutput": run_code_capture_output(code_15_9),
        "realWorldApplication": (
            "Menjadi mesin inti sistem pengenalan wajah komersial skala nasional (seperti e-Passport gates di bandara internasional, sistem otentikasi perbankan digital, dan platform pencarian wajah InsightFace yang digunakan jutaan pengembang di seluruh dunia)."
        ),
        "commonPitfalls": [
            r"Menghitung cos(theta + m) dengan memanggil arccos(cos_theta) lalu menjumlahkan m secara naif, yang memicu latensi tinggi dan instabilitas gradien float saat cos_theta mendekati 1.0.",
            r"Tidak menerapkan ekspansi trigonometri cos(t+m) = cos(t)cos(m) - sin(t)sin(m) yang jauh lebih efisien dan ramah GPU.",
            r"Mengabaikan batas nilai saat (theta + m) > pi, di mana fungsi cosinus mulai berbalik naik, yang dapat melemahkan penalti pada sampel yang sangat salah."
        ],
        "caseStudy": (
            "Diberikan fitur wajah dengan cos(theta) = 0.866 (theta = 30 derajat) terhadap kelas target yang benar. Jika model menerapkan ArcFace dengan s = 64 dan m = 0.5 radian (~28.65 derajat), hitung nilai logit target ter-margin s * cos(theta + m), dan bandingkan penurunannya terhadap logit tanpa margin s * cos(theta)."
        ),
        "academicReferences": [
            r"Deng, J., Guo, J., Xue, N., & Zafeiriou, S. (2019). ArcFace: Additive angular margin loss for deep face recognition. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR), pp. 4690-4699.",
            r"Deng, J., Guo, J., Liu, T., Gong, M., & Zafeiriou, S. (2020). Sub-center ArcFace: Boosting face recognition by large-scale noisy web faces. In Computer Vision–ECCV 2020: 16th European Conference (pp. 741-757).",
            r"An, X., Zhu, X., Yang, J., Wu, D., Zhang, B., & He, J. (2021). Partial FC: Training 10 million identities on a single machine. arXiv preprint arXiv:2010.05265."
        ]
    }
})

# ==============================================================================
# Subbab 15.10: Evaluasi Biometrik: FAR, FRR, ROC, EER, dan Liveness Detection
# ==============================================================================
code_15_10 = r'''import numpy as np

# Simulasi Evaluasi Sistem Biometrik Wajah
# Menghitung False Acceptance Rate (FAR), False Rejection Rate (FRR),
# dan Equal Error Rate (EER) pada variasi ambang batas similarity threshold.

def compute_biometric_metrics(genuine_scores, imposter_scores, thresholds):
    """
    genuine_scores: skor kesamaan kosinus pasangan subjek sama (idealnya tinggi mendekati 1)
    imposter_scores: skor kesamaan kosinus pasangan subjek beda (idealnya rendah mendekati 0)
    """
    far_list = []
    frr_list = []
    
    n_gen = len(genuine_scores)
    n_imp = len(imposter_scores)
    
    for t in thresholds:
        # FAR: Persentase imposter yang salah diterima (skor >= t)
        far = np.sum(imposter_scores >= t) / n_imp
        # FRR: Persentase genuine yang salah ditolak (skor < t)
        frr = np.sum(genuine_scores < t) / n_gen
        
        far_list.append(far)
        frr_list.append(frr)
        
    far_arr = np.array(far_list)
    frr_arr = np.array(frr_list)
    
    # Cari Equal Error Rate (EER) saat |FAR - FRR| minimum
    eer_idx = np.argmin(np.abs(far_arr - frr_arr))
    eer_threshold = thresholds[eer_idx]
    eer_val = (far_arr[eer_idx] + frr_arr[eer_idx]) / 2.0
    
    return far_arr, frr_arr, eer_threshold, eer_val

# Simulasi 1000 pasangan genuine dan 1000 pasangan imposter
np.random.seed(42)
genuine = np.random.normal(loc=0.75, scale=0.10, size=1000)
genuine = np.clip(genuine, -1.0, 1.0)

imposter = np.random.normal(loc=0.25, scale=0.12, size=1000)
imposter = np.clip(imposter, -1.0, 1.0)

thresholds = np.linspace(0.0, 1.0, 101)
far, frr, eer_t, eer = compute_biometric_metrics(genuine, imposter, thresholds)

# Cari ambang batas untuk standar industri keamanan tinggi (FAR = 0.001 / 0.1% atau 1:1000)
idx_far_001 = np.where(far <= 0.001)[0][0]
t_secure = thresholds[idx_far_001]
frr_at_secure = frr[idx_far_001]

print("Hasil Analisis Metrik Biometrik Verifikasi Wajah:")
print(f"Equal Error Rate (EER): {eer * 100:.2f}% pada Ambang Batas Kesamaan t = {eer_t:.2f}")
print(f"Ambang Batas Keamanan Tinggi (FAR <= 0.1%): t = {t_secure:.2f} | FRR (False Reject) = {frr_at_secure * 100:.2f}%")
print("Sistem terverifikasi memiliki separasi distribusi skor kesamaan yang kuat antara genuine dan imposter.")
'''

subchapters.append({
    "id": "cv-15-10-biometric-evaluation-liveness",
    "chapterId": "computer-vision-ch-15",
    "title": "Metrik Evaluasi Biometrik Wajah: FAR, FRR, ROC, EER, dan Face Anti-Spoofing / Liveness Detection",
    "description": "Standar evaluasi verifikasi biometrik internasional (ISO/IEC 19795): kurva ROC, analisis tradeoff FAR vs FRR, penentuan ambang EER, dan teknologi anti-spoofing.",
    "estimatedMinutes": 35,
    "order": 10,
    "content": {
        "theory": (
            "Evaluasi performa sistem pengenalan wajah biometrik tidak dapat diukur hanya dengan akurasi klasifikasi persentase sederhana, melainkan diatur secara ketat oleh standar internasional (seperti **ISO/IEC 19795-1** Biometric Performance Testing and Reporting). Dalam tugas verifikasi 1:1 (*Face Verification*), sistem membandingkan skor kesamaan $s = \\cos(f_1, f_2)$ terhadap sebuah nilai ambang keputusan (*operating threshold*) $\\tau$.\n\n"
            "Terdapat dua jenis kesalahan fundamental yang saling bertolak belakang (*trade-off*):\n"
            "1. **False Acceptance Rate (FAR)** atau False Match Rate (FMR): Probabilitas sistem secara keliru menerima orang asing (*imposter*) sebagai pengguna yang sah:\n"
            "$$\\text{FAR}(\\tau) = \\frac{\\sum_{i=1}^{N_{imp}} \\mathbb{I}(s_i \\ge \\tau)}{N_{imp}} = \\int_\\tau^1 p(s | \\text{imposter}) \\, ds$$\n"
            "2. **False Rejection Rate (FRR)** atau False Non-Match Rate (FNMR): Probabilitas sistem secara keliru menolak pengguna asli (*genuine user*) yang sah:\n"
            "$$\\text{FRR}(\\tau) = \\frac{\\sum_{j=1}^{N_{gen}} \\mathbb{I}(s_j < \\tau)}{N_{gen}} = \\int_{-1}^\\tau p(s | \\text{genuine}) \\, ds$$\n\n"
            "Hubungan dinamis antara FAR dan FRR divisualisasikan melalui kurva **Receiver Operating Characteristic (ROC)** (True Accept Rate $1 - \\text{FRR}$ terhadap FAR dalam skala logaritmik) atau kurva **Detection Error Tradeoff (DET)**. Titik perpotongan di mana $\\text{FAR}(\\tau^*) = \\text{FRR}(\\tau^*)$ disebut sebagai **Equal Error Rate (EER)**, yang merepresentasikan ukuran ringkas kapasitas diskriminasi intrinsik model.\n\n"
            "Dalam implementasi produksi dunia nyata, sistem pengenalan wajah menghadapi ancaman serangan fisik (*Presentation Attacks*), seperti foto cetak resolusi tinggi, video tayangan layar tablet, atau topeng silikon 3D. Oleh karena itu, subsistem **Face Anti-Spoofing (FAS) / Liveness Detection** wajib dipasang di garda terdepan menggunakan kombinasi:\n"
            "- *Passive Liveness*: Analisis tekstur mikroskopis cetakan (Fourier spectrum analysis), analisis pola moiré layar, dan inferensi *Color Texture CNN*.\n"
            "- *Active Liveness*: Permintaan interaksi acak pengguna (berkedip, tersenyum, menolehkan kepala).\n"
            "- *Hardware-Assisted Liveness*: Sensor inframerah terstruktur (Structured-Light 3D infrared) atau kamera Time-of-Flight (ToF)."
        ),
        "codeSnippet": code_15_10,
        "codeSnippetOutput": run_code_capture_output(code_15_10),
        "realWorldApplication": (
            "Diterapkan secara wajib pada aplikasi mobile banking untuk transaksi bernilai tinggi, verifikasi KYC pinjaman online, gerbang boarding bandara nirsentuh, dan sistem absensi kehadiran aparatur sipil negara."
        ),
        "commonPitfalls": [
            r"Menentukan ambang batas verifikasi hanya berdasarkan titik EER untuk aplikasi keamanan perbankan, padahal perbankan mewajibkan FAR sangat rendah (misal FAR <= 0.001% / 1:100.000).",
            r"Mengabaikan bias demografis pada dataset evaluasi (misal performa FAR/FRR berbeda signifikan pada kelompok usia atau warna kulit tertentu).",
            r"Menonaktifkan modul liveness detection untuk mempercepat latensi aplikasi, yang membuka celah serangan spoofing cetak foto sederhana."
        ],
        "caseStudy": (
            "Sebuah platform fintech ingin menetapkan ambang batas verifikasi wajah untuk otentikasi transfer dana di atas 50 juta rupiah. Tim keamanan mensyaratkan FAR maksimum sebesar 0.01% (1 per 10.000). Dari kurva ROC hasil evaluasi, pada FAR 0.01% nilai FRR tercatat sebesar 3.5%. Jelaskan implikasi bisnis dari angka tersebut terhadap pengalaman pengguna dan strategi mitigasi fallback-nya."
        ),
        "academicReferences": [
            r"Grother, P., Ngan, M., & Hanaoka, K. (2019). Ongoing face recognition vendor test (FRVT) part 2: Identification. NIST Interagency Report, 8271.",
            r"ISO/IEC 19795-1:2021 Information technology — Biometric performance testing and reporting — Part 1: Principles and framework.",
            r"Yu, Z., Qin, Y., Li, X., Wang, Z., Zhao, C., & Zhao, G. (2020). Multi-modal face anti-spoofing based on central difference networks. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops (pp. 650-651)."
        ]
    }
})

# Simpan ke JSON
output_path = os.path.join(os.path.dirname(__file__), "cv_ch15_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 15 -> {output_path}")
