# -*- coding: utf-8 -*-
"""
Generator untuk Bab 7: Fondasi Deep Learning untuk Penglihatan Komputer (10 Subbab)
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
# Subbab 7.1: Keterbatasan Hand-crafted Features & Representasi Hierarkis
# ==============================================================================
code_7_1 = r"""import numpy as np

# Simulasi kegagalan hand-crafted linear classifier (XOR problem / nonlinear manifold)
# vs representasi bertingkat (hierarchical feature transformation)
np.random.seed(42)

# Dataset sintetis: 4 cluster non-linear (mirip XOR spasial)
X = np.array([
    [0.1, 0.1], [0.2, 0.8], [0.8, 0.1], [0.9, 0.9],
    [0.15, 0.25], [0.25, 0.75], [0.85, 0.15], [0.75, 0.85]
])
y = np.array([0, 1, 1, 0, 0, 1, 1, 0]) # Pola XOR

# Evaluasi linear separability pada fitur mentah spasial
# Akurasi hyperplane linear sederhana
W_linear = np.array([1.0, 1.0])
b_linear = -1.0
preds_raw = (np.dot(X, W_linear) + b_linear > 0).astype(int)
acc_raw = np.mean(preds_raw == y)

# Transformasi hierarkis 2-tahap (representasi non-linear lapis 1 -> lapis 2)
# Lapisan tersembunyi 1: Detektor kombinasi fitur spasial dengan aktivasi ReLU
W1 = np.array([[2.0, -2.0], [-2.0, 2.0]])
b1 = np.array([-0.2, -0.2])
H1 = np.maximum(0, np.dot(X, W1) + b1) # Representasi abstrak hierarkis tingkat 1

# Lapisan 2: Klasifikasi linear pada ruang representasi yang telah disentangle
W2 = np.array([2.5, 2.5])
b2 = -0.5
logits = np.dot(H1, W2) + b2
preds_hierarchical = (logits > 0).astype(int)
acc_hierarchical = np.mean(preds_hierarchical == y)

print("Evaluasi Keterbatasan Fitur Linear vs Representasi Hierarkis:")
print(f"1. Akurasi Pemisah Linear pada Fitur Mentah : {acc_raw * 100:.1f}% (Gagal memisahkan manifold non-linear)")
print(f"2. Akurasi Klasifikasi Representasi Bertingkat: {acc_hierarchical * 100:.1f}% (Pemisahan sempurna)")
print(f"Dimensi Fitur Tersembunyi (Layer 1): {H1.shape}")
print("Contoh representasi tersembunyi (2 sampel pertama):")
print(np.round(H1[:2], 3))
"""

out_7_1 = run_code_capture_output(code_7_1)

subchapters.append({
    "id": "cv-7-1-limitations-handcrafted-features",
    "title": "7.1 Keterbatasan Hand-crafted Features dan Urgensi Representasi Hierarkis",
    "content": r"""Dalam paradigma visi komputer klasik (1970-an hingga awal 2010-an), pemrosesan visual bergantung pada rekayasa fitur manual (*hand-crafted features*) seperti filter Gabor, *Scale-Invariant Feature Transform* (SIFT), *Speeded-Up Robust Features* (SURF), dan *Histogram of Oriented Gradients* (HOG). Paradigma klasik ini mengadopsi struktur terpisah dua tahap (*two-stage decoupled pipeline*): pertama, ahli manusia merancang operator diferensial spasial deterministik untuk mengekstrak vektor deskriptor $\mathbf{x} \in \mathbb{R}^D$; kedua, algoritma pembelajaran mesin seperti *Support Vector Machines* (SVM) atau pemisah linier dilatih untuk mengklasifikasikan deskriptor tersebut:

$$f(\mathbf{x}) = \operatorname{sign}(\mathbf{w}^T \mathbf{x} + b)$$

Meskipun hand-crafted features menunjukkan ketangguhan luar biasa terhadap transformasi geometris lokal seperti rotasi planar dan skala seragam, pendekatan ini memiliki keterbatasan fundamental ketika dihadapkan pada variabilitas dunia nyata:
1. **Ketidakmampuan Mengatasi Transformasi Non-Rigid dan Variasi Semantik**: Fitur manual dirancang berdasarkan asumsi lokal yang kaku (misalnya gradien orientasi tepi). Ketika objek mengalami deformasi plastis, artikulasi sudut sendi, oklusi parsial masif, atau variasi pencahayaan non-Lambertian, distribusi deskriptor manual berubah drastis (*semantic gap*).
2. **Keterpisahan Optimasi (*Decoupled Optimization*)**: Operator ekstraksi fitur manual tidak pernah dioptimalkan bersamaan (*jointly trained*) dengan fungsi objektif tugas akhir (*downstream loss* $\mathcal{L}$). Deskriptor yang dirancang optimal untuk diskriminasi tekstur belum tentu optimal untuk klasifikasi kategori tingkat tinggi.
3. **Ledakan Dimensi dan Biaya Rekayasa (*Heuristic Saturation*)**: Menambahkan ketahanan terhadap faktor lingkungan baru memerlukan perancangan metrik analitis tambahan yang rumit secara matematis dan memerlukan penalaan parameter hiper manual tanpa jaminan konvergensi global.

Urgensi representasi hierarkis (*hierarchical representation*) berakar pada prinsip organisasi korteks visual biologis mamalia (sebagaimana dipelopori oleh David Hubel dan Torsten Wiesel pada 1959 dan 1962). Pemrosesan visual kortikal mengatur resepsi visual secara berjenjang:
- **Sel Sederhana (Simple Cells - V1)**: Memiliki bidang reseptif (*receptive fields*) kecil yang peka terhadap orientasi garis, tepi kontras tinggi, dan frekuensi spasial dasar.
- **Sel Kompleks (Complex Cells - V2/V4)**: Mengintegrasikan keluaran dari sel sederhana, menghasilkan invariansi posisi lokal dan merespons kisi, kurva, dan tekstur berulang.
- **Korteks Inferotemporal (IT Cortex)**: Merepresentasikan konfigurasi spasial global dari bagian-bagian objek, mengkodekan kategori semantik tingkat tinggi (seperti wajah atau hewan) secara invarian terhadap sudut pandang dan iluminasi.

Dalam arsitektur *Deep Learning*, representasi hierarkis ini dipelajari secara end-to-end melalui propagasi balik (*backpropagation*). Setiap lapisan ke-$l$ menerapkan transformasi bertingkat pada manifold representasi:

$$\mathbf{h}^{(l)} = \sigma\left(\mathbf{W}^{(l)} \mathbf{h}^{(l-1)} + \mathbf{b}^{(l)}\right)$$

Lapisan konvolusional awal mempelajari filter diferensial spasial dasar (mirip filter Gabor dan detektor tepi Sobel), lapisan tengah menyusun tepi menjadi motif geometris dan tekstur part-based, dan lapisan akhir merakit motif tersebut menjadi representasi topologis holistik objek.""",
    "codeSnippet": code_7_1,
    "expectedOutput": out_7_1,
    "commonPitfalls": [
        "Mengasumsikan bahwa fitur deep learning sepenuhnya mengabaikan pengetahuan fisika citra klasik, padahal lapisan pertama CNN hampir selalu mengonvergen ke kernel deteksi tepi berorientasi yang identik secara fungsional dengan filter Gabor.",
        "Mengabaikan fenomena *representation collapse* atau kegagalan pemisahan manifold non-linear ketika menggunakan model linear dangkal pada citra dengan variasi intrakelas tinggi.",
        "Mencampuradukkan istilah *feature extraction* manual yang deterministik dengan *feature learning* end-to-end yang mengoptimasi gradien langsung dari loss fungsi akhir."
    ],
    "quiz": {
        "question": "Mengapa arsitektur hierarkis berlapis (deep learning) secara fundamental lebih unggul daripada klasifikasi linear pada fitur hand-crafted klasik untuk citra alami?",
        "options": [
            "Karena deep learning menghapus kebutuhan fungsi aktivasi non-linear di setiap lapisan konvolusi.",
            "Karena arsitektur hierarkis mampu mempelajari representasi fitur multi-tingkat secara end-to-end yang secara bertahap memisahkan (disentangle) manifold data visual non-linear sesuai objektif tugas akhir.",
            "Karena hand-crafted features seperti SIFT dan HOG memiliki kompleksitas waktu inferensi nol dibanding konvolusi.",
            "Karena deep learning tidak menggunakan kernel spasial dalam memproses array piksel berdimensi dua."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Keunggulan fundamental representasi hierarkis deep learning adalah kemampuannya mempelajari abstraksi fitur secara end-to-end: dari tepi dan pola lokal dasar di lapisan awal hingga representasi semantik global di lapisan dalam yang mengurai (disentangle) variasi non-linear data citra alami secara langsung terhadap downstream loss."
    }
})

# ==============================================================================
# Subbab 7.2: Lapisan Konvolusi 2D: Cross-Correlation vs Konvolusi Matematis
# ==============================================================================
code_7_2 = r"""import numpy as np

# Citra masukan 2D (4x4)
I = np.array([
    [1.0, 2.0, 3.0, 0.0],
    [0.0, 1.0, 4.0, 2.0],
    [5.0, 6.0, 0.0, 1.0],
    [2.0, 3.0, 1.0, 4.0]
], dtype=np.float32)

# Kernel konvolusional 2D (3x3)
K = np.array([
    [1.0,  0.0, -1.0],
    [2.0,  0.0, -2.0],
    [1.0,  0.0, -1.0]
], dtype=np.float32)

# 1. Konvolusi Matematis Riil (dengan Kernel Flipping 180 derajat)
# K_flipped(u, v) = K(-u, -v)
K_flipped = np.flip(K)

H, W = I.shape
kH, kW = K.shape
out_H, out_W = H - kH + 1, W - kW + 1

conv_math = np.zeros((out_H, out_W), dtype=np.float32)
cross_corr = np.zeros((out_H, out_W), dtype=np.float32)

for i in range(out_H):
    for j in range(out_W):
        patch = I[i:i+kH, j:j+kW]
        # Cross-Correlation (operasi standar library PyTorch / TensorFlow)
        cross_corr[i, j] = np.sum(patch * K)
        # Mathematical Convolution (operasi konvolusi teoretis sejati)
        conv_math[i, j] = np.sum(patch * K_flipped)

print("Kernel Asli K:")
print(K)
print("\nKernel Terbalik (Flipped 180 deg) K_flipped:")
print(K_flipped)
print("\nHasil Operasi Cross-Correlation (Standard Deep Learning 'Conv2D'):")
print(cross_corr)
print("\nHasil Operasi Mathematical Convolution:")
print(conv_math)
print(f"\nApakah Cross-Correlation sama dengan Mathematical Convolution? {np.array_equal(cross_corr, conv_math)}")
"""

out_7_2 = run_code_capture_output(code_7_2)

subchapters.append({
    "id": "cv-7-2-conv2d-cross-correlation",
    "title": "7.2 Lapisan Konvolusi 2D: Cross-Correlation vs Mathematical Convolution",
    "content": r"""Dalam literatur matematika murni dan pemrosesan sinyal linier (*Linear Time-Invariant Systems*), operasi konvolusi dua dimensi kontinu antara sinyal masukan $I(x, y)$ dan fungsi kernel respon impuls $K(x, y)$ didefinisikan secara formal melalui integral pembalikan spasial:

$$(I * K)(x, y) = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} I(\tau, \eta) K(x - \tau, y - \eta) \, d\tau \, d\eta$$

Dalam domain diskrit citra digital dengan koordinat piksel integer $(i, j)$ dan kernel berukuran $(2k+1) \times (2k+1)$, konvolusi matematis sejati (*mathematical convolution*) diekspresikan sebagai:

$$S(i, j) = (I * K)(i, j) = \sum_{u=-k}^{k} \sum_{v=-k}^{k} I(i - u, j - v) K(u, v) = \sum_{u=-k}^{k} \sum_{v=-k}^{k} I(i + u, j + v) K(-u, -v)$$

Perhatikan bahwa indeks kernel $K(-u, -v)$ mencerminkan operasi **pembalikan kernel (*kernel flipping*)** sebesar $180^\circ$ pada sumbu horizontal dan vertikal sebelum dilakukan perkalian elemen demi elemen (*element-wise multiplication*) dan penjumlahan. Pembalikan ini menjamin sifat aljabar komutatif yang krusial dalam pemrosesan sinyal: $I * K = K * I$.

Namun, pada hampir seluruh kerangka kerja *deep learning* modern (seperti PyTorch `nn.Conv2d` dan TensorFlow/Keras `layers.Conv2D`), operasi yang sesungguhnya diimplementasikan di balik layar bukanlah konvolusi matematis, melainkan **korelasi silang (*cross-correlation*)**:

$$S(i, j) = (I \star K)(i, j) = \sum_{u=-k}^{k} \sum_{v=-k}^{k} I(i + u, j + v) K(u, v)$$

Mengapa kerangka kerja deep learning menggunakan korelasi silang tetapi tetap menyebutnya lapisan "konvolusi"?
1. **Ketidaksignifikanan Pembalikan pada Pembelajaran Bobot**: Dalam deep learning, bobot kernel $K$ tidak bersifat statis atau tetap, melainkan variabel teroptimasi (*learnable parameters*) yang diinisialisasi secara acak dan diperbarui via *gradient descent*. Jika operasi konvolusi sejati membalikkan kernel $K$ menjadi $K_{\text{flip}}$, jaringan saraf cukup mempelajari bobot yang ekuivalen secara langsung tanpa membalikkan kernel.
2. **Efisiensi Komputasional**: Menghilangkan langkah pembalikan matriks menghemat siklus instruksi memori pada komputasi GPU berparalel tinggi (CUDA/cuDNN).
3. **Ketiadaan Kebutuhan Sifat Komutatif**: Dalam pemrosesan sekuensial lapisan jaringan saraf tiruan, input $I$ (aktivasi tensor) dan filter $K$ (bobot parameter) memiliki status ontologis yang berbeda, sehingga komutativitas formal ($I * K = K * I$) tidak diperlukan dalam propagasi maju (*forward pass*).""",
    "codeSnippet": code_7_2,
    "expectedOutput": out_7_2,
    "commonPitfalls": [
        "Mengira bahwa PyTorch `nn.Conv2d` melakukan pembalikan kernel matematis (180 derajat) secara default, padahal yang dihitung adalah korelasi silang murni (cross-correlation).",
        "Mengharapkan sifat komutatif $I \star K = K \star I$ pada cross-correlation tanpa membalik salah satu argumennya.",
        "Mengabaikan bahwa dalam implementasi backpropagation, gradien terhadap input dihitung melalui operasi transpos/korelasi silang balik yang secara struktural setara dengan konvolusi berbobot terbalik."
    ],
    "quiz": {
        "question": "Apakah perbedaan matematis utama antara konvolusi murni dan korelasi silang (cross-correlation) yang diterapkan pada framework deep learning?",
        "options": [
            "Konvolusi murni menambahkan fungsi aktivasi non-linear, sedangkan cross-correlation bersifat linear murni.",
            "Konvolusi murni membalikkan (flip) matriks kernel sebesar 180 derajat sebelum operasi dot product, sedangkan cross-correlation mengalikan kernel langsung tanpa pembalikan.",
            "Cross-correlation mengharuskan tensor input memiliki channel tunggal (grayscale), sedangkan konvolusi murni mendukung multi-channel.",
            "Konvolusi murni hanya beroperasi pada domain frekuensi via FFT, sedangkan cross-correlation hanya pada domain spasial."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Konvolusi matematis formal menyertakan pembalikan spasial kernel (kernel flipping 180 derajat) untuk mempertahankan sifat komutatif, sedangkan korelasi silang (cross-correlation) mengalikan elemen kernel langsung dengan jendela masukan tanpa pembalikan."
    }
})

# ==============================================================================
# Subbab 7.3: Operasi Konvolusi Multi-Channel, Kernel 3D, Dimensi Output
# ==============================================================================
code_7_3 = r"""import numpy as np

# Simulasi konvolusi multi-channel:
# Input: Batch=1, Channels=3 (RGB), H=5, W=5
# Output Channels: 2 filter (feature maps)
# Kernel size: 3x3
np.random.seed(42)

C_in = 3
H_in, W_in = 5, 5
C_out = 2
K_h, K_w = 3, 3

# Input tensor X: shape (C_in, H_in, W_in)
X = np.random.randn(C_in, H_in, W_in).astype(np.float32)

# Weight tensor W: shape (C_out, C_in, K_h, K_w)
W = np.random.randn(C_out, C_in, K_h, K_w).astype(np.float32)
# Bias vector b: shape (C_out,)
b = np.array([0.5, -0.5], dtype=np.float32)

# Hitung dimensi output (valid padding, stride 1)
H_out = H_in - K_h + 1
W_out = W_in - K_w + 1
Y = np.zeros((C_out, H_out, W_out), dtype=np.float32)

for cout in range(C_out):
    for i in range(H_out):
        for j in range(W_out):
            # Ekstraksi receptive field volume 3D: shape (C_in, K_h, K_w)
            receptive_volume = X[:, i:i+K_h, j:j+K_w]
            # Dot product 3D elemen demi elemen dan jumlahkan seluruh channel
            kernel_volume = W[cout, :, :, :]
            channel_sum = np.sum(receptive_volume * kernel_volume)
            # Tambahkan bias skalar
            Y[cout, i, j] = channel_sum + b[cout]

print("Dimensi Tensor Masukan X       :", X.shape)
print("Dimensi Bobot Kernel W        :", W.shape)
print("Dimensi Tensor Keluaran Y     :", Y.shape)
print(f"Total parameter kernel terpelajari: {W.size + b.size} (Bobot: {W.size}, Bias: {b.size})")
print("\nHasil Feature Map Output Filter 0 (H_out x W_out):")
print(np.round(Y[0], 3))
print("\nHasil Feature Map Output Filter 1 (H_out x W_out):")
print(np.round(Y[1], 3))
"""

out_7_3 = run_code_capture_output(code_7_3)

subchapters.append({
    "id": "cv-7-3-multichannel-conv-3d-kernels",
    "title": "7.3 Operasi Konvolusi Multi-Channel, Kernel 3D, dan Dimensi Output",
    "content": r"""Dalam pemrosesan citra berwarna atau lapisan internal jaringan saraf dalam, tensor masukan tidak berbentuk matriks dua dimensi tunggal, melainkan tensor tiga dimensi dengan bentuk $C_{\text{in}} \times H_{\text{in}} \times W_{\text{in}}$, di mana $C_{\text{in}}$ adalah kedalaman channel (misalnya 3 untuk kanal warna $R, G, B$, atau 64/128/256 untuk channel peta fitur intermediate).

Untuk memproses masukan multi-channel ini dan menghasilkan $C_{\text{out}}$ buah peta fitur (*feature maps*), lapisan konvolusi memanfaatkan sekumpulan kernel tiga dimensi. Setiap filter ke-$m$ ($m \in \{1, \dots, C_{\text{out}}\}$) memiliki kedalaman yang **selalu persis sama** dengan kedalaman kanal masukan $C_{\text{in}}$, dengan ukuran spasial $K_h \times K_w$. Dengan demikian, tensor parameter bobot keseluruhan berdimensi 4D:

$$\mathbf{W} \in \mathbb{R}^{C_{\text{out}} \times C_{\text{in}} \times K_h \times K_w}, \quad \mathbf{b} \in \mathbb{R}^{C_{\text{out}}}$$

Secara matematis, nilai aktivasi keluaran pada channel $m$, koordinat spasial $(i, j)$ dihitung melalui penjumlahan volume 3D lintas seluruh kanal masukan ditambah bias skalar $b_m$:

$$Y(m, i, j) = b_m + \sum_{c=1}^{C_{\text{in}}} \sum_{u=0}^{K_h-1} \sum_{v=0}^{K_w-1} X(c, i + u, j + v) \cdot W(m, c, u, v)$$

Formula analitis untuk menghitung resolusi spasial keluaran $(H_{\text{out}}, W_{\text{out}})$ dengan bantalan *padding* $P$ dan *stride* $S$ diberikan oleh:

$$H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} - K_h + 2P}{S} \right\rfloor + 1$$
$$W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} - K_w + 2P}{S} \right\rfloor + 1$$

Jumlah parameter terpelajari (*learnable parameters*) dari lapisan konvolusi 2D multi-channel ditentukan murni oleh ukuran kernel dan jumlah kanal, **independen terhadap resolusi spasial citra masukan**:

$$\text{Parameter}_{\text{total}} = (C_{\text{in}} \times K_h \times K_w \times C_{\text{out}}) + C_{\text{out}}$$

Karakteristik *weight sharing* (berbagi bobot spasial) ini memberikan efisiensi parameter yang dramatis dibanding lapisan terhubung penuh (*fully-connected layer*), sekaligus memberikan sifat *equivariance to translation*: jika objek bergeser di citra masukan, representasi fiturnya di peta keluaran akan bergeser dengan magnitudo yang sebanding tanpa mengubah pola aktivasi lokal.""",
    "codeSnippet": code_7_3,
    "expectedOutput": out_7_3,
    "commonPitfalls": [
        "Mengira bahwa kernel 3x3 pada citra RGB hanya memiliki 9 parameter, padahal tiap filter mencakup seluruh channel masukan sehingga memiliki $3 \times 3 \times 3 = 27$ parameter bobot per filter (ditambah 1 bias).",
        "Membingungkan konsep dimensi spasial kernel (misal $3\times3$) dengan kedalaman channel ($C_{\text{in}}$), yang menyebabkan salah estimasi alokasi memori bobot jaringan.",
        "Mengasumsikan resolusi spasial input ($H_{\text{in}}, W_{\text{in}}$) mempengaruhi jumlah parameter bobot lapisan konvolusi; jumlah parameter hanya bergantung pada $C_{\text{in}}, C_{\text{out}}, K_h, K_w$."
    ],
    "quiz": {
        "question": "Sebuah lapisan konvolusi menerima tensor masukan dengan bentuk (64, 56, 56) [Channels, Height, Width] dan memiliki 128 filter dengan ukuran kernel 3x3 serta bias. Berapakah jumlah total parameter terpelajari lapisan tersebut?",
        "options": [
            "73.856 parameter",
            "73.728 parameter",
            "73.856 parameter bobot + 64 bias = 73.920 parameter",
            "73.728 parameter bobot + 128 parameter bias = 73.856 parameter"
        ],
        "correctAnswerIndex": 3,
        "explanation": "Jumlah bobot = $C_{\\text{out}} \\times (C_{\\text{in}} \\times K_h \\times K_w) = 128 \\times (64 \\times 3 \\times 3) = 128 \\times 576 = 73.728$. Ditambah 1 bias untuk setiap output filter ($128$), total parameter terpelajari adalah $73.728 + 128 = 73.856$ parameter."
    }
})

# ==============================================================================
# Subbab 7.4: Padding (Valid, Same, Full) dan Efek Pengurangan Resolusi Spasial
# ==============================================================================
code_7_4 = r"""import numpy as np

# Citra masukan sintetis (4x4)
X = np.array([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 1, 2, 3],
    [4, 5, 6, 7]
], dtype=np.float32)

k_size = 3
H, W = X.shape

# 1. VALID PADDING (P = 0): Tidak ada bantalan, dimensi menyusut
P_valid = 0
H_valid = H - k_size + 1
W_valid = W - k_size + 1

# 2. SAME PADDING (P = floor(k / 2)): Menjaga dimensi spasial konstan (untuk stride 1)
P_same = k_size // 2
X_padded_same = np.pad(X, pad_width=P_same, mode='constant', constant_values=0)
H_same = X_padded_same.shape[0] - k_size + 1
W_same = X_padded_same.shape[1] - k_size + 1

# 3. FULL PADDING (P = k - 1): Menjamin setiap piksel disentuh kernel secara maksimal
P_full = k_size - 1
X_padded_full = np.pad(X, pad_width=P_full, mode='constant', constant_values=0)
H_full = X_padded_full.shape[0] - k_size + 1
W_full = X_padded_full.shape[1] - k_size + 1

print(f"Dimensi Asli Citra (H, W)                 : ({H}, {W})")
print(f"1. Valid Padding (P={P_valid}) -> Dimensi Output   : ({H_valid}, {W_valid})")
print(f"2. Same Padding  (P={P_same}) -> Padded: {X_padded_same.shape} -> Dimensi Output: ({H_same}, {W_same})")
print(f"3. Full Padding  (P={P_full}) -> Padded: {X_padded_full.shape} -> Dimensi Output: ({H_full}, {W_full})")
print("\nMatriks Citra dengan Same Padding (P=1):")
print(X_padded_same)
"""

out_7_4 = run_code_capture_output(code_7_4)

subchapters.append({
    "id": "cv-7-4-padding-valid-same-full",
    "title": "7.4 Padding (Valid, Same, Full) dan Efek Pengurangan Resolusi Spasial",
    "content": r"""Setiap kali operasi konvolusi diterapkan tanpa perlakuan batas khusus, ukuran spasial dari peta fitur masukan akan menyusut sebesar $K - 1$ piksel. Dalam arsitektur jaringan saraf konvolusi yang dalam (*deep architectures*) dengan puluhan atau ratusan lapisan berurutan, penyusutan tanpa kendali ini akan menghancurkan resolusi representasi citra dengan sangat cepat (*boundary effect*). Selain itu, piksel-piksel yang berada di tepi (*border pixels*) hanya diproses oleh sedikit posisi jendela kernel dibanding piksel sentral, mengakibatkan hilangnya informasi spasial batas secara sistematis.

Untuk mengatasi permasalahan batas ini, teknik pemberian bantalan piksel semu atau **padding** ($P$) diterapkan di sekeliling matriks fitur. Terdapat tiga rezim padding fundamental dalam teori pemrosesan citra dan deep learning:

1. **Valid Padding ($P = 0$)**:
   Tidak ada penambahan piksel batas sama sekali. Operasi konvolusi hanya dihitung pada posisi di mana kernel sepenuhnya berada di dalam area citra masukan:
   $$H_{\text{out}} = H_{\text{in}} - K + 1$$
   Pilihan ini menyebabkan erosi dimensi spasial pada setiap lapisan. Jika jaringan memiliki 10 lapisan berturut-turut dengan kernel $3 \times 3$, resolusi spasial akan menyusut sebesar $(3-1) \times 10 = 20$ piksel.

2. **Same (Half) Padding ($P = \lfloor K / 2 \rfloor$ untuk kernel ganjil)**:
   Lapisan masukan diberi bantalan sejumlah $P$ piksel nol (*zero padding*) pada setiap sisi sehingga ukuran spasial keluaran persis identik dengan ukuran masukan ketika melangkah dengan *stride* $S = 1$:
   $$H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} - K + 2 \lfloor K/2 \rfloor}{1} \right\rfloor + 1 = H_{\text{in}}$$
   Penggunaan *same padding* merupakan standar baku dalam arsitektur modern (seperti VGG dan ResNet) karena memisahkan desain kedalaman representasi dari geometri penyusutan dimensi spasial.

3. **Full Padding ($P = K - 1$)**:
   Bantalan ditambahkan dalam jumlah maksimal sehingga kernel diperbolehkan menghitung konvolusi bahkan ketika hanya ada satu piksel sudut kernel yang bersinggungan dengan satu piksel sudut citra:
   $$H_{\text{out}} = H_{\text{in}} + K - 1$$
   Rezim ini menjamin bahwa seluruh piksel masukan mendapatkan pembobotan yang setara di sepanjang area konvolusi, dan sering menjadi basis teoritis pada operasi konvolusi transpos (*transposed convolution / deconvolution*).

Pemilihan nilai padding biasanya menggunakan nol (*zero-padding*), refleksi (*reflection padding*), atau replikasi tepi (*replicate padding*). Zero-padding adalah metode tercepat dan paling umum, meskipun dapat memicu efek visual tepi buatan (*border artifacts*) pada tugas restorasi citra beresolusi super.""",
    "codeSnippet": code_7_4,
    "expectedOutput": out_7_4,
    "commonPitfalls": [
        "Menggunakan ukuran kernel genap (misalnya $4 \times 4$ atau $2 \times 2$) untuk *same padding*, yang menghasilkan padding asimetris karena $K/2$ bukan integer murni dan memicu distorsi pergeseran pusat piksel.",
        "Mengabaikan bahwa zero-padding ekstensif pada batas citra dapat menurunkan rata-rata magnitudo aktivasi di tepi pada lapisan-lapisan konvolusi dalam.",
        "Menghitung dimensi *same padding* tanpa mempertimbangkan parameter stride; jika $S > 1$, output tetap ter-subsample menjadi $\approx H_{\text{in}} / S$."
    ],
    "quiz": {
        "question": "Berapakah ukuran padding P pada setiap sisi yang diperlukan agar kernel 5x5 menghasilkan feature map keluaran dengan resolusi yang sama persis dengan masukan (stride = 1)?",
        "options": [
            "P = 1 piksel",
            "P = 2 piksel",
            "P = 4 piksel",
            "P = 5 piksel"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Untuk kernel berukuran $K=5$, kondisi same padding mensyaratkan $2P = K - 1 = 5 - 1 = 4$, sehingga padding pada tiap sisi adalah $P = 4 / 2 = 2$ piksel."
    }
})

# ==============================================================================
# Subbab 7.5: Stride dan Subsampling Spasial
# ==============================================================================
code_7_5 = r"""import numpy as np

# Citra masukan 6x6
X = np.arange(1, 37, dtype=np.float32).reshape(6, 6)

# Kernel 2x2 sederhana (detektor rata-rata lokal)
K = np.ones((2, 2), dtype=np.float32) / 4.0

# 1. Konvolusi dengan Stride S = 1 (tanpa padding)
S1 = 1
H_out1 = (X.shape[0] - 2) // S1 + 1
W_out1 = (X.shape[1] - 2) // S1 + 1
out_s1 = np.zeros((H_out1, W_out1))
for i in range(H_out1):
    for j in range(W_out1):
        out_s1[i, j] = np.sum(X[i*S1:i*S1+2, j*S1:j*S1+2] * K)

# 2. Konvolusi dengan Stride S = 2 (Strided Convolution / Downsampling 2x)
S2 = 2
H_out2 = (X.shape[0] - 2) // S2 + 1
W_out2 = (X.shape[1] - 2) // S2 + 1
out_s2 = np.zeros((H_out2, W_out2))
for i in range(H_out2):
    for j in range(W_out2):
        out_s2[i, j] = np.sum(X[i*S2:i*S2+2, j*S2:j*S2+2] * K)

print("Matriks Masukan X (6x6):")
print(X.astype(int))
print(f"\n1. Output Stride S=1 (Dimensi: {out_s1.shape}):")
print(out_s1)
print(f"\n2. Output Stride S=2 (Dimensi: {out_s2.shape} -> Resolusi turun separuh):")
print(out_s2)
print(f"Rasio reduksi komputasi piksel: {out_s1.size} piksel -> {out_s2.size} piksel ({out_s1.size/out_s2.size:.2f}x lebih efisien)")
"""

out_7_5 = run_code_capture_output(code_7_5)

subchapters.append({
    "id": "cv-7-5-stride-spatial-subsampling",
    "title": "7.5 Stride dan Subsampling Spasial",
    "content": r"""Dalam operasi konvolusi dasar, jendela kernel bergeser satu piksel pada setiap langkah ($S = 1$). Parameter **stride** ($S$) mendefinisikan jarak langkah spasial perpindahan kernel melintasi baris dan kolom tensor masukan. Jika $S > 1$, operasi ini disebut **strided convolution** dan secara inheren menjalankan fungsi ganda: ekstraksi fitur sekaligus subsampling spasial (*spatial downsampling*).

Secara komputasional, efek stride terhadap resolusi spasial keluaran dirumuskan sebagai:

$$H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} - K + 2P}{S} \right\rfloor + 1$$

Ketika $S = 2$ dengan padding yang sesuai, resolusi spasial horizontal dan vertikal berkurang sekitar $50\%$ (faktor reduksi $2\times$), sehingga total jumlah elemen dalam peta fitur keluaran menyusut sebesar $75\%$ ($4\times$ lebih kecil).

Dampak teknis dan arsitektural dari *strided convolution*:
1. **Reduksi Kompleksitas Komputasi dan Memori**: Penurunan jumlah piksel keluaran secara drastis mereduksi beban *Floating-Point Operations* (FLOPs) dan alokasi memori tensor aktivasi pada lapisan-lapisan selanjutnya dalam jaringan.
2. **Akselerasi Ekspansi Receptive Field**: Melompat $S$ piksel melipatgandakan laju pelebaran bidang reseptif efektif dari lapisan-lapisan setelahnya, memungkinkan neuron lapisan atas menangkap konteks semantik global lebih cepat.
3. **Alternatif Terpelajari Pengganti Pooling (*All Convolutional Net*)**: Dalam pendekatan arsitektur klasik (seperti LeNet dan AlexNet), downsampling dilakukan oleh lapisan *Max Pooling* deterministik non-parametrik. Sebagaimana diargumentasikan oleh Springenberg et al. (2014) dalam paper *"Striving for Simplicity: The All Convolutional Net"*, mengganti pooling dengan konvolusi ber-stride ($S = 2$) memungkinkan jaringan mempelajari sendiri kernel subsampling optimal secara adaptif melalui gradien backpropagation.""",
    "codeSnippet": code_7_5,
    "expectedOutput": out_7_5,
    "commonPitfalls": [
        "Mengasumsikan bahwa stride besar ($S \ge 3$) selalu menguntungkan karena cepat, padahal stride yang terlalu besar memicu aliasing spasial berat dan melewatkan pola visual berfrekuensi tinggi (*Nyquist-Shannon sampling violation*).",
        "Lupa bahwa strided convolution dengan stride $S > 1$ tidak invarian terhadap translasi piksel tunggal karena fase subsampling yang sensitif terhadap pergeseran ganjil/genap.",
        "Mengabaikan penyesuaian padding saat mengubah stride, yang dapat menyebabkan pemotongan baris/kolom paling tepi citra jika $(H_{\text{in}} - K + 2P)$ tidak habis dibagi $S$."
    ],
    "quiz": {
        "question": "Apa keunggulan utama menggunakan Strided Convolution (misal Stride=2) dibandingkan Max Pooling konvensional untuk reduksi dimensi spasial menurut literatur All Convolutional Net?",
        "options": [
            "Strided convolution menjamin resolusi spasial tidak pernah berubah.",
            "Strided convolution memiliki parameter terpelajari yang dapat dioptimalkan gradien untuk memilih metode agregasi spasial terbaik, alih-alih fungsi heuristik tetap seperti mengambil nilai maksimum.",
            "Strided convolution sepenuhnya menghilangkan kebutuhan komputasi floating point.",
            "Strided convolution tidak memerlukan alokasi memori pada GPU."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Strided convolution memungkinkan jaringan mempelajari kernel proyeksi spasial terbaik secara adaptif melalui propagasi balik, berbeda dengan Max Pooling yang menerapkan fungsi deterministik statis tanpa parameter terpelajari."
    }
})

# ==============================================================================
# Subbab 7.6: Operasi Pooling: Max Pooling vs Average Pooling
# ==============================================================================
code_7_6 = r"""import numpy as np

# Peta fitur masukan 4x4 (simulasi aktivasi fitur tepi berderau)
feature_map = np.array([
    [1.2, 0.5, 8.4, 0.1],
    [0.3, 2.1, 7.9, 0.4],
    [0.2, 0.1, 0.3, 0.8],
    [0.9, 0.4, 1.1, 0.5]
], dtype=np.float32)

pool_size = 2
stride = 2

H_out = (feature_map.shape[0] - pool_size) // stride + 1
W_out = (feature_map.shape[1] - pool_size) // stride + 1

max_pooled = np.zeros((H_out, W_out), dtype=np.float32)
avg_pooled = np.zeros((H_out, W_out), dtype=np.float32)

for i in range(H_out):
    for j in range(W_out):
        window = feature_map[i*stride:i*stride+pool_size, j*stride:j*stride+pool_size]
        max_pooled[i, j] = np.max(window)
        avg_pooled[i, j] = np.mean(window)

# Uji Invariansi Translasi Lokal: Geser aktivasi sebesar 1 piksel
shifted_map = np.array([
    [0.5, 1.2, 0.1, 8.4],
    [2.1, 0.3, 0.4, 7.9],
    [0.1, 0.2, 0.8, 0.3],
    [0.4, 0.9, 0.5, 1.1]
], dtype=np.float32)

max_pooled_shifted = np.zeros((H_out, W_out), dtype=np.float32)
for i in range(H_out):
    for j in range(W_out):
        w = shifted_map[i*stride:i*stride+pool_size, j*stride:j*stride+pool_size]
        max_pooled_shifted[i, j] = np.max(w)

print("Peta Fitur Asli (4x4):")
print(feature_map)
print(f"\n1. Max Pooling 2x2 (Stride 2):\n{max_pooled}")
print(f"\n2. Average Pooling 2x2 (Stride 2):\n{np.round(avg_pooled, 3)}")
print(f"\n3. Max Pooling pada Fitur Bergeser 1 Piksel (Invariansi Kuat):\n{max_pooled_shifted}")
print(f"Apakah nilai maksimum global tetap tertangkap di pool yang sama? {np.max(max_pooled) == np.max(max_pooled_shifted)}")
"""

out_7_6 = run_code_capture_output(code_7_6)

subchapters.append({
    "id": "cv-7-6-pooling-max-vs-avg",
    "title": "7.6 Operasi Pooling: Max Pooling vs Average Pooling dan Peran Translation Invariance",
    "content": r"""Lapisan *pooling* merupakan operasi subsampling non-linier atau linier yang diterapkan secara independen pada setiap kanal peta fitur ($C_{\text{in}} = C_{\text{out}}$). Tujuan utamanya adalah mereduksi dimensi spasial tensor secara bertahap, mengurangi beban komputasi representasi, serta memberikan sifat **invariansi translasi lokal (*local translation invariance*)**: jika suatu fitur visual bergeser sedikit di dalam jendela pooling, respons aktivasi keluaran tetap stabil.

Dua varian pooling paling fundamental dalam literatur visi komputer:

1. **Max Pooling**:
   Memilih nilai aktivasi maksimum di dalam jendela spasial berukuran $P_h \times P_w$:
   $$Y(c, i, j) = \max_{u \in [0, P_h-1], v \in [0, P_w-1]} X(c, i \cdot S + u, j \cdot S + v)$$
   *Karakteristik Mekanistik*: Max pooling bertindak sebagai detektor keberadaan fitur (*feature detector*). Operasi ini mengekstrak respons aktivasi paling dominan (seperti tepi tajam atau sudut kontras) dan membuang respons latar belakang yang lemah. Secara historis, Max Pooling terbukti paling efektif pada lapisan konvolusi awal dan menengah untuk tugas klasifikasi dan deteksi objek.

2. **Average Pooling**:
   Menghitung nilai rata-rata aritmetika dari seluruh piksel di dalam jendela pooling:
   $$Y(c, i, j) = \frac{1}{P_h \cdot P_w} \sum_{u=0}^{P_h-1} \sum_{v=0}^{P_w-1} X(c, i \cdot S + u, j \cdot S + v)$$
   *Karakteristik Mekanistik*: Average pooling menghaluskan variasi spasial dan mempertahankan informasi latar belakang rata-rata. Namun, jika diterapkan di awal jaringan, operasi ini dapat meredam respons tepi yang tajam.

3. **Global Average Pooling (GAP)**:
   Sebagaimana diperkenalkan oleh Lin et al. (2013) dalam *"Network In Network"*, GAP mengambil rata-rata dari seluruh dimensi spasial ($H \times W$) per channel, menghasilkan vektor 1D berdimensi $C_{\text{out}}$:
   $$\text{GAP}(c) = \frac{1}{H \cdot W} \sum_{i=1}^H \sum_{j=1}^W X(c, i, j)$$
   GAP menggantikan lapisan terhubung penuh (*dense/fully connected layers*) di akhir jaringan konvolusi modern (seperti ResNet dan MobileNet). Hal ini mengeliminasi jutaan parameter rentan *overfitting*, sekaligus memungkinkan jaringan menerima ukuran citra masukan yang fleksibel pada waktu inferensi.""",
    "codeSnippet": code_7_6,
    "expectedOutput": out_7_6,
    "commonPitfalls": [
        "Mencoba melatih parameter pada lapisan Max/Average Pooling; lapisan pooling murni tidak memiliki parameter bobot terpelajari (*zero learnable parameters*).",
        "Mengasumsikan Max Pooling mempertahankan informasi lokasi spasial yang tepat; sebaliknya, pooling sengaja membuang koordinat sub-piksel demi mencapai invariansi translasi.",
        "Menggunakan lapisan Fully Connected masif alih-alih Global Average Pooling di ujung arsitektur klasifikasi modern, yang menyebabkan peningkatan parameter drastis tanpa peningkatan generalisasi yang signifikan."
    ],
    "quiz": {
        "question": "Mengapa Global Average Pooling (GAP) banyak diadopsi dalam arsitektur modern (seperti ResNet) untuk menggantikan lapisan Fully Connected (Dense) konvensional sebelum klasifikasi akhir?",
        "options": [
            "Karena GAP melipatgandakan jumlah parameter jaringan sehingga kapasitas hafalan meningkat.",
            "Karena GAP mereduksi peta fitur menjadi satu nilai per kanal tanpa parameter terpelajari, secara drastis mencegah overfitting dan mendukung ukuran resolusi input yang dinamis.",
            "Karena GAP hanya dapat bekerja jika fungsi aktivasi yang digunakan adalah Sigmoid.",
            "Karena GAP melakukan interpolasi bicubic pada citra keluaran."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Global Average Pooling merata-ratakan seluruh dimensi spasial HxW menjadi vektor skalar tunggal per kanal. Ini memangkas jutaan parameter bobot yang sebelumnya ada pada lapisan Fully-Connected, mencegah overfitting secara drastis, serta memungkinkan input berukuran spasial variabel."
    }
})

# ==============================================================================
# Subbab 7.7: Perhitungan Receptive Field Ekspansi Teoretis
# ==============================================================================
code_7_7 = r'''import numpy as np

def calculate_receptive_field(layers):
    # Menghitung ukuran Receptive Field (RF), Jump (J), dan Start (R)
    # secara sekuensial berdasarkan relasi analitis Dumoulin & Visin (2016).
    # Formula rekursif:
    #   RF_l = RF_{l-1} + (K_l - 1) * J_{l-1}
    #   J_l  = J_{l-1} * S_l
    rf = 1.0     # RF awal pada citra masukan
    jump = 1.0   # Jarak spasial antar pusat fitur (stride kumulatif)
    
    history = [("Input Citra", rf, jump)]
    
    for name, k, s, p in layers:
        rf = rf + (k - 1) * jump
        jump = jump * s
        history.append((name, rf, jump))
        
    return history

# Definisi jaringan konvolusi 5 lapisan:
# Format: (Nama Lapisan, Kernel k, Stride s, Padding p)
network_arch = [
    ("Conv1 (3x3, s=1)", 3, 1, 1),
    ("Conv2 (3x3, s=1)", 3, 1, 1),
    ("MaxPool1 (2x2, s=2)", 2, 2, 0),
    ("Conv3 (3x3, s=1)", 3, 1, 1),
    ("Conv4 (3x3, s=2)", 3, 2, 1)
]

rf_results = calculate_receptive_field(network_arch)

print(f"{'Lapisan':<22} | {'Receptive Field (RF)':<22} | {'Stride Kumulatif (Jump)':<22}")
print("-" * 72)
for name, rf_val, jump_val in rf_results:
    print(f"{name:<22} | {rf_val:<22.0f} | {jump_val:<22.0f}")

print(f"\nKesimpulan Analitis:")
print(f"Dua lapisan Conv 3x3 berurutan (Conv1 & Conv2) menghasilkan RF = {rf_results[2][1]:.0f}x{rf_results[2][1]:.0f} piksel.")
print(f"Setara dengan satu lapisan Conv 5x5, tetapi dengan parameter jauh lebih hemat.")
'''

out_7_7 = run_code_capture_output(code_7_7)

subchapters.append({
    "id": "cv-7-7-receptive-field-calculation",
    "title": "7.7 Perhitungan dan Analisis Ekspansi Receptive Field Teoretis",
    "content": r"""Dalam visi komputer dan jaringan saraf konvolusional, **Receptive Field (RF)** atau bidang reseptif mendefinisikan luas spasial area pada citra masukan mentah yang memengaruhi nilai aktivasi suatu neuron tertentu pada lapisan peta fitur tertentu. Pemahaman kuantitatif tentang ekspansi RF sangat krusial dalam perancangan arsitektur untuk segmentasi semantik dan deteksi objek: jika RF suatu lapisan lebih kecil daripada dimensi fisik objek target, neuron pada lapisan tersebut mustahil mengidentifikasi objek secara utuh (*lack of global visual context*).

Untuk arsitektur sekuensial yang terdiri dari lapisan konvolusi dan pooling, ukuran RF teoretis pada lapisan ke-$l$ dihitung secara rekursif melalui dua variabel keadaan spasial:
1. **Ukuran Receptive Field ($RF_l$)**: Rentang dimensi spasial piksel input asal yang dicakup.
2. **Lompatan Spasial / Stride Kumulatif ($J_l$)**: Jarak spasial pada citra masukan antara dua elemen fitur bertetangga pada lapisan ke-$l$.

Rumus analitis rekursif formal (sebagaimana dijabarkan oleh Araujo et al., 2019 dan Dumoulin & Visin, 2016) adalah:

$$RF_0 = 1, \quad J_0 = 1$$
$$RF_l = RF_{l-1} + (K_l - 1) \cdot J_{l-1}$$
$$J_l = J_{l-1} \cdot S_l$$

di mana:
- $K_l$ adalah ukuran kernel spasial lapisan ke-$l$,
- $S_l$ adalah nilai stride lapisan ke-$l$.

**Prinsip Ekuivalensi Stacking Kernel VGG**:
Salah satu temuan paling berpengaruh dalam desain CNN (Simonyan & Zisserman, VGGNet 2014) adalah bahwa menumpuk dua lapisan konvolusi $3 \times 3$ dengan stride 1 menghasilkan receptive field efektif sebesar:
$$RF_1 = 1 + (3 - 1) \cdot 1 = 3$$
$$RF_2 = 3 + (3 - 1) \cdot 1 = 5$$
Dua konvolusi $3 \times 3$ memiliki cakupan spasial yang persis sama dengan satu konvolusi $5 \times 5$, namun hanya membutuhkan $2 \times (3^2 \cdot C^2) = 18 C^2$ parameter dibanding $1 \times (5^2 \cdot C^2) = 25 C^2$ parameter (penghematan parameter sebesar $28\%$), sekaligus menyisipkan dua fungsi non-linearitas alih-alih satu.

**Effective Receptive Field (ERF) vs Theoretical Receptive Field**:
Perlu dicatat bahwa dalam praktiknya, sebagaimana dibuktikan oleh Luo et al. (2016) dalam *"Understanding the Effective Receptive Field in Deep Convolutional Neural Networks"*, kontribusi piksel masukan terhadap aktivasi pusat tidak seragam seperti kotak diskrit, melainkan mengikuti distribusi Gauss 2D terpusat. ERF efektif yang berkontribusi signifikan terhadap gradien umumnya hanya mencakup sebagian kecil dari batas RF teoretis analitis.""",
    "codeSnippet": code_7_7,
    "expectedOutput": out_7_7,
    "commonPitfalls": [
        "Mengabaikan akumulasi stride ($J_{l-1}$) saat menghitung RF lapisan dalam; menjumlahkan $(K - 1)$ secara linier tanpa mengalikan dengan stride kumulatif menghasilkan estimasi RF yang salah fatal.",
        "Mengasumsikan bahwa seluruh piksel di dalam kotak teoretis Receptive Field memberikan kontribusi magnitudo gradien yang seragam (mengabaikan fenomena Gaussian Effective Receptive Field).",
        "Menghilangkan lapisan downsampling (stride/pooling) demi mempertahankan resolusi citra, namun menyebabkan receptive field jaringan gagal mencakup keseluruhan objek besar pada citra beresolusi tinggi."
    ],
    "quiz": {
        "question": "Jika tiga lapisan konvolusi berturut-turut masing-masing menggunakan kernel 3x3 dengan stride 1, berapakah ukuran receptive field teoretis pada keluaran lapisan ketiga?",
        "options": [
            "3x3 piksel",
            "5x5 piksel",
            "7x7 piksel",
            "9x9 piksel"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Dengan $RF_0 = 1, J_0 = 1$: Layer 1: $RF_1 = 1 + (3-1)\\cdot 1 = 3, J_1 = 1$. Layer 2: $RF_2 = 3 + (3-1)\\cdot 1 = 5, J_2 = 1$. Layer 3: $RF_3 = 5 + (3-1)\\cdot 1 = 7, J_3 = 1$. Jadi ukuran RF teoretis adalah 7x7 piksel."
    }
})

# ==============================================================================
# Subbab 7.8: Fungsi Aktivasi Non-Linear: ReLU, LeakyReLU, PReLU, GeLU
# ==============================================================================
code_7_8 = r"""import numpy as np

# Rentang nilai masukan fitur (mencakup domain negatif dan positif)
x = np.array([-3.0, -1.5, -0.5, 0.0, 0.5, 1.5, 3.0], dtype=np.float32)

# 1. ReLU (Rectified Linear Unit) - Nair & Hinton (2010)
relu = np.maximum(0.0, x)

# 2. LeakyReLU (alpha = 0.1) - Maas et al. (2013)
alpha = 0.1
leaky_relu = np.where(x > 0, x, alpha * x)

# 3. ELU (Exponential Linear Unit, alpha = 1.0) - Clevert et al. (2015)
elu = np.where(x > 0, x, 1.0 * (np.exp(x) - 1.0))

# 4. GeLU (Gaussian Error Linear Unit) - Hendrycks & Gimpel (2016)
# Aproksimasi analitis: 0.5 * x * (1 + tanh(sqrt(2/pi) * (x + 0.044715 * x^3)))
gelu = 0.5 * x * (1.0 + np.tanh(np.sqrt(2.0 / np.pi) * (x + 0.044715 * np.power(x, 3))))

print(f"{'Input (x)':<12} | {'ReLU':<10} | {'LeakyReLU':<12} | {'ELU':<10} | {'GeLU':<10}")
print("-" * 65)
for i in range(len(x)):
    print(f"{x[i]:<12.2f} | {relu[i]:<10.2f} | {leaky_relu[i]:<12.2f} | {elu[i]:<10.2f} | {gelu[i]:<10.2f}")

print("\nKarakteristik Gradien pada Wilayah Negatif (x = -2.0):")
print(f"- Gradien d(ReLU)/dx      : 0.0 (Dying ReLU risk)")
print(f"- Gradien d(LeakyReLU)/dx : {alpha} (Aliran gradien tetap terjaga)")
"""

out_7_8 = run_code_capture_output(code_7_8)

subchapters.append({
    "id": "cv-7-8-activation-functions-conv",
    "title": "7.8 Fungsi Aktivasi Non-Linear dalam Konvolusi: ReLU, LeakyReLU, Parametric ReLU, dan GeLU",
    "content": r"""Lapisan konvolusi dan perkalian matriks bobot merupakan operasi linier affine murni. Tanpa adanya fungsi aktivasi non-linear di antara lapisan-lapisan konvolusi, susunan $N$ lapisan konvolusi sedalam apa pun dapat disederhanakan secara matematis menjadi satu operasi linier tunggal ekuivalen: $\mathbf{W}_{\text{eff}} = \mathbf{W}_N \dots \mathbf{W}_2 \mathbf{W}_1$. Fungsi aktivasi menyuntikkan non-linearitas yang memungkinkan jaringan saraf bertindak sebagai *universal approximator* untuk memetakan manifold data visual kompleks.

Evolusi fungsi aktivasi dalam visi komputer:

1. **Sigmoid dan Tanh (Era Pra-2012)**:
   $$\sigma(x) = \frac{1}{1 + e^{-x}}, \quad \tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$$
   Fungsi-fungsi berbasis saturasi ini mengalami masalah fatal **vanishing gradient**: ketika $|x|$ besar, turunan analitis mendekati nol ($\sigma'(x) \to 0$). Dalam jaringan dengan lebih dari 4-5 lapisan, gradien lenyap sebelum mencapai lapisan konvolusi awal.

2. **ReLU (Rectified Linear Unit)**:
   Dipopulerkan oleh Nair & Hinton (2010) dan diadopsi dalam AlexNet (Krizhevsky et al., 2012):
   $$f(x) = \max(0, x), \quad f'(x) = \begin{cases} 1 & \text{jika } x > 0 \\ 0 & \text{jika } x \le 0 \end{cases}$$
   ReLU mempercepat konvergensi *Stochastic Gradient Descent* (SGD) hingga 6 kali lipat dibanding tanh karena gradiennya bernilai konstan 1 pada domain positif tanpa mengalami saturasi. Namun, ReLU rentan terhadap masalah **Dying ReLU**: neuron yang menerima aktivasi negatif terus-menerus akan memiliki gradien 0 dan menjadi tidak aktif permanen.

3. **Leaky ReLU dan PReLU**:
   Untuk mengatasi Dying ReLU, Maas et al. (2013) dan He et al. (2015) memperkenalkan kemiringan linier kecil pada domain negatif:
   $$f(x) = \max(\alpha x, x)$$
   Pada LeakyReLU, $\alpha$ adalah hiperparameter tetap (misal $\alpha = 0.01$). Pada *Parametric ReLU* (PReLU), $\alpha$ menjadi parameter yang dipelajari melalui backpropagation.

4. **GeLU (Gaussian Error Linear Unit)**:
   Dirumuskan oleh Hendrycks & Gimpel (2016), GeLU menjadi standar baku dalam arsitektur modern (Vision Transformer dan ConvNeXt):
   $$\text{GELU}(x) = x \cdot \Phi(x) = x \cdot P(X \le x), \quad X \sim \mathcal{N}(0, 1)$$
   Aproksimasi analitis cepatnya adalah:
   $$\text{GELU}(x) \approx 0.5x \left(1 + \tanh\left(\sqrt{\frac{2}{\pi}} (x + 0.044715 x^3)\right)\right)$$
   GeLU memadukan sifat non-linearitas deterministik dengan modulasi stokastik halus (probabilistik), memberikan kurva kurvatur mulus (*smooth curvature*) di sekitar nol yang terbukti meningkatkan stabilitas optimasi representasi visual mendalam.""",
    "codeSnippet": code_7_8,
    "expectedOutput": out_7_8,
    "commonPitfalls": [
        "Menggunakan fungsi aktivasi Sigmoid pada lapisan-lapisan konvolusi dalam, yang memicu fenomena vanishing gradient dan menggagalkan pelatihan jaringan.",
        "Mengabaikan fenomena 'Dying ReLU' pada model dengan learning rate tinggi; gradien besar dapat mendorong bobot ke wilayah aktivasi negatif permanen.",
        "Menerapkan fungsi aktivasi sebelum lapisan Batch Normalization pada arsitektur klasik (urutan standar Conv -> BN -> Activation vs Activation -> Conv)."
    ],
    "quiz": {
        "question": "Mengapa GeLU (Gaussian Error Linear Unit) banyak menggantikan ReLU pada arsitektur penglihatan modern seperti ConvNeXt dan Vision Transformer (ViT)?",
        "options": [
            "Karena GeLU tidak membutuhkan komputasi perkalian float.",
            "Karena GeLU memberikan fungsi yang mulus (smooth) dan non-monotonik di sekitar titik nol yang memungkinkan aliran gradien probabilistik bernilai kecil pada domain negatif ringan.",
            "Karena GeLU membatasi nilai aktivasi maksimum secara ketat pada angka +1.0.",
            "Karena GeLU hanya beroperasi pada domain biner 0 dan 1."
        ],
        "correctAnswerIndex": 1,
        "explanation": "GeLU memadukan non-linearitas dengan modulasi kurvatur halus probabilitas Gaussian. Sifat non-monotoniknya yang mulus di sekitar nol mencegah neuron mati mendadak dan memberikan dinamika propagasi gradien yang lebih stabil pada arsitektur kontemporer."
    }
})

# ==============================================================================
# Subbab 7.9: Normalisasi Batch (Batch Normalization): Forward & Backward
# ==============================================================================
code_7_9 = r"""import numpy as np

# Simulasi Forward Pass Batch Normalization 2D (Spatial Batch Norm untuk Conv)
# Tensor aktivasi: N=2 sampel, C=2 kanal, H=2, W=2
np.random.seed(42)
N, C, H, W = 2, 2, 2, 2
X = np.random.randn(N, C, H, W).astype(np.float32) * 2.0 + 5.0

# Parameter terpelajari: gamma (skala) dan beta (pergeseran) per kanal
gamma = np.ones((1, C, 1, 1), dtype=np.float32)
beta = np.zeros((1, C, 1, 1), dtype=np.float32)
eps = 1e-5

# 1. Hitung mean batch lintas sumbu (N, H, W) untuk setiap kanal independen
# Dimensi perataan kanal: m = N * H * W
m = N * H * W
mu = np.mean(X, axis=(0, 2, 3), keepdims=True)

# 2. Hitung varians batch
var = np.var(X, axis=(0, 2, 3), keepdims=True)

# 3. Normalisasi (standarisasi zero-mean unit-variance)
X_hat = (X - mu) / np.sqrt(var + eps)

# 4. Transformasi Affine Terpelajari (Scale and Shift)
Y = gamma * X_hat + beta

print(f"Bentuk Tensor Masukan X : {X.shape}")
print(f"Mean Masukan per Kanal  : {mu.flatten()}")
print(f"Var Masukan per Kanal   : {var.flatten()}")
print(f"\nMean Keluaran Ternormalisasi (X_hat) : {np.round(np.mean(X_hat, axis=(0,2,3)), 5)}")
print(f"Var Keluaran Ternormalisasi (X_hat)  : {np.round(np.var(X_hat, axis=(0,2,3)), 5)}")
print(f"\nHasil Tensor Keluaran Y (Kanal 0, Sampel 0):\n{np.round(Y[0, 0], 3)}")
"""

out_7_9 = run_code_capture_output(code_7_9)

subchapters.append({
    "id": "cv-7-9-batch-normalization",
    "title": "7.9 Normalisasi Batch (Batch Normalization): Formulasi Forward dan Backward",
    "content": r"""Dalam melatih jaringan saraf konvolusi yang dalam, distribusi nilai aktivasi pada lapisan dalam terus-menerus bergeser seiring diperbaruinya parameter bobot pada lapisan-lapisan sebelumnya. Fenomena ini diidentifikasi oleh Sergey Ioffe dan Christian Szegedy (2015) sebagai **Internal Covariate Shift**. Pergeseran distribusi ini memaksa lapisan berikutnya terus beradaptasi dengan skala input yang berubah, mengharuskan laju pembelajaran (*learning rate*) yang sangat kecil dan inisialisasi bobot yang luar biasa sensitif.

Untuk menstabilkan dinamika pelatihan, Ioffe & Szegedy memperkenalkan **Batch Normalization (BN)**. Pada lapisan konvolusi spasial 2D, normalisasi dilakukan secara terpisah untuk setiap kanal fitur $c \in \{1, \dots, C\}$, merata-ratakan nilai aktivasi di sepanjang dimensi *mini-batch* ($N$) dan dimensi spasial ($H \times W$). Dengan ukuran efektif batch spasial $m = N \times H \times W$:

1. **Perhitungan Rata-rata Mini-Batch**:
   $$\mu_c = \frac{1}{m} \sum_{n=1}^N \sum_{i=1}^H \sum_{j=1}^W X(n, c, i, j)$$

2. **Perhitungan Varians Mini-Batch**:
   $$\sigma_c^2 = \frac{1}{m} \sum_{n=1}^N \sum_{i=1}^H \sum_{j=1}^W \left( X(n, c, i, j) - \mu_c \right)^2$$

3. **Standarisasi Spasial**:
   $$\widehat{X}(n, c, i, j) = \frac{X(n, c, i, j) - \mu_c}{\sqrt{\sigma_c^2 + \epsilon}}$$
   di mana $\epsilon > 0$ (misal $10^{-5}$) adalah konstanta stabilitas numerik untuk mencegah pembagian dengan nol.

4. **Transformasi Affine Terpelajari (*Scale & Shift*)**:
   Jika seluruh aktivasi dipaksa memiliki mean 0 dan varians 1 secara kaku, kapasitas representasi jaringan dapat berkurang (misalnya jika jaringan membutuhkan aktivasi pada rezim non-linear tertentu). Oleh karena itu, diperkenalkan parameter terpelajari $\gamma_c$ (*skala*) dan $\beta_c$ (*pergeseran*):
   $$Y(n, c, i, j) = \gamma_c \widehat{X}(n, c, i, j) + \beta_c$$
   Jika jaringan menghendaki fungsi identitas murni, pengoptimalan dapat mengatur $\gamma_c = \sqrt{\sigma_c^2 + \epsilon}$ dan $\beta_c = \mu_c$.

**Perbedaan Perilaku: Mode Pelatihan vs Mode Inferensi**:
- **Saat Pelatihan (*Training*)**: $\mu$ dan $\sigma^2$ dihitung langsung dari sampel mini-batch saat ini, dan nilai *running mean* serta *running variance* diperbarui melalui rata-rata bergerak eksponensial (*exponential moving average* / EMA).
- **Saat Pengujian (*Inference/Evaluation*)**: Mini-batch aktual tidak digunakan (bahkan batch size bisa bernilai 1). Normalisasi menggunakan statistik global populasi terakumulasi ($\mu_{\text{running}}$ dan $\sigma^2_{\text{running}}$). Ketidakkonsistenan antara batch training kecil dan statistik inferensi dapat memicu kegagalan prediksi jika tidak ditangani dengan tepat.""",
    "codeSnippet": code_7_9,
    "expectedOutput": out_7_9,
    "commonPitfalls": [
        "Lupa beralih ke mode evaluasi (`model.eval()`) saat inferensi pada PyTorch, yang menyebabkan model tetap menghitung mean/var dari mini-batch pengujian saat itu (sangat merusak jika batch size = 1).",
        "Menggunakan ukuran batch yang sangat kecil ($N \le 4$) saat melatih Batch Normalization; estimasi statistik $\mu$ dan $\sigma^2$ menjadi sangat berderau dan mengganggu konvergensi (dalam kasus ini, Group Normalization atau Layer Normalization lebih disukai).",
        "Menyertakan parameter bias pada lapisan konvolusi tepat sebelum Batch Normalization; parameter bias tersebut sepenuhnya redundan karena akan dikurangi habis oleh operasi $-\mu$ dalam normalisasi."
    ],
    "quiz": {
        "question": "Mengapa parameter bias (b) pada lapisan Conv2D tidak diperlukan jika lapisan tersebut langsung diikuti oleh Batch Normalization?",
        "options": [
            "Karena konvolusi tidak mendukung operasi penjumlahan skalar.",
            "Karena nilai konstanta bias akan sepenuhnya tereliminasi oleh pengurangan mean batch (mu) pada tahap standarisasi Batch Normalization, dan pergeseran telah diakomodasi oleh parameter beta.",
            "Karena Batch Normalization hanya bekerja pada nilai bobot negatif.",
            "Karena PyTorch akan memunculkan RuntimeError jika Conv2D memiliki bias saat terhubung ke BatchNorm2d."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Jika $X = \\text{Conv}(W) + b$, maka saat menghitung mean: $\\mu = \\text{mean}(\\text{Conv}(W)) + b$. Pengurangan $(X - \\mu)$ menghasilkan $([\\text{Conv}(W) + b] - [\\text{mean}(\\text{Conv}(W)) + b]) = \\text{Conv}(W) - \\text{mean}(\\text{Conv}(W))$. Nilai bias $b$ saling menghilangkan secara aljabar, dan fungsi pergeseran diambil alih oleh parameter terpelajari $\\beta$."
    }
})

# ==============================================================================
# Subbab 7.10: Implementasi Forward-Pass CNN Lengkap dari Nol NumPy
# ==============================================================================
code_7_10 = r"""import numpy as np

class Conv2DLayer:
    # Implementasi Mandiri Forward-Pass Conv2D Multi-Channel NumPy
    def __init__(self, in_channels, out_channels, kernel_size, stride=1, padding=0):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.k = kernel_size
        self.stride = stride
        self.padding = padding
        
        # Inisialisasi bobot He (Kaiming Normal)
        std = np.sqrt(2.0 / (in_channels * kernel_size * kernel_size))
        self.W = np.random.randn(out_channels, in_channels, kernel_size, kernel_size).astype(np.float32) * std
        self.b = np.zeros((out_channels,), dtype=np.float32)
        
    def forward(self, X):
        N, C, H, W = X.shape
        # Tambahkan zero padding spasial jika P > 0
        if self.padding > 0:
            X_pad = np.pad(X, ((0,0), (0,0), (self.padding, self.padding), (self.padding, self.padding)), mode='constant')
        else:
            X_pad = X
            
        H_pad, W_pad = X_pad.shape[2], X_pad.shape[3]
        H_out = (H_pad - self.k) // self.stride + 1
        W_out = (W_pad - self.k) // self.stride + 1
        
        out = np.zeros((N, self.out_channels, H_out, W_out), dtype=np.float32)
        for n in range(N):
            for oc in range(self.out_channels):
                for i in range(H_out):
                    for j in range(W_out):
                        h_start = i * self.stride
                        w_start = j * self.stride
                        patch = X_pad[n, :, h_start:h_start+self.k, w_start:w_start+self.k]
                        out[n, oc, i, j] = np.sum(patch * self.W[oc]) + self.b[oc]
        return out

class MaxPool2DLayer:
    # Implementasi Mandiri Forward-Pass MaxPool2D NumPy
    def __init__(self, pool_size=2, stride=2):
        self.pool_size = pool_size
        self.stride = stride
        
    def forward(self, X):
        N, C, H, W = X.shape
        H_out = (H - self.pool_size) // self.stride + 1
        W_out = (W - self.pool_size) // self.stride + 1
        out = np.zeros((N, C, H_out, W_out), dtype=np.float32)
        for n in range(N):
            for c in range(C):
                for i in range(H_out):
                    for j in range(W_out):
                        h_start = i * self.stride
                        w_start = j * self.stride
                        patch = X[n, c, h_start:h_start+self.pool_size, w_start:w_start+self.pool_size]
                        out[n, c, i, j] = np.max(patch)
        return out

# Uji pipeline forward-pass mini CNN: Conv -> ReLU -> MaxPool
np.random.seed(42)
batch_input = np.random.randn(1, 3, 8, 8).astype(np.float32) # Batch 1, RGB, 8x8

conv = Conv2DLayer(in_channels=3, out_channels=4, kernel_size=3, stride=1, padding=1)
pool = MaxPool2DLayer(pool_size=2, stride=2)

conv_out = conv.forward(batch_input)
relu_out = np.maximum(0.0, conv_out)
pool_out = pool.forward(relu_out)

print("Pipeline Forward-Pass CNN dari Nol (NumPy):")
print(f"1. Input Citra     : {batch_input.shape}")
print(f"2. Setelah Conv2D  : {conv_out.shape} (Channels bertambah dari 3 -> 4, same padding)")
print(f"3. Setelah ReLU    : {relu_out.shape} (Aktivasi non-linear element-wise)")
print(f"4. Setelah MaxPool : {pool_out.shape} (Resolusi spasial ter-subsample 2x: 8x8 -> 4x4)")
print(f"\nNilai Aktivasi Terkompresi (Kanal 0, 4x4):\n{np.round(pool_out[0, 0], 3)}")
"""

out_7_10 = run_code_capture_output(code_7_10)

subchapters.append({
    "id": "cv-7-10-cnn-forward-pass-numpy",
    "title": "7.10 Implementasi Forward-Pass Lapisan Konvolusi 2D dan Pooling dari Nol dengan NumPy",
    "content": r"""Untuk menguasai mekanika komputasi internal dari jaringan saraf konvolusional (*deep learning frameworks* seperti PyTorch, TensorFlow, atau CUDA C++ kernels), kita harus mampu merekonstruksi operasi propagasi maju (*forward-pass*) secara deterministik dari nol (*from scratch*) hanya dengan pustaka array multidimensi murni (`numpy`).

Suatu blok konvolusional kanonikal tersusun atas tiga transformasi berurutan:
1. **Lapisan Konvolusi Linier 2D**:
   Menerima tensor masukan 4D $\mathbf{X} \in \mathbb{R}^{N \times C_{\text{in}} \times H_{\text{in}} \times W_{\text{in}}}$.
   Menerapkan *zero-padding* simetris $P$ sehingga resolusi spasial bertambah menjadi $(H_{\text{in}} + 2P) \times (W_{\text{in}} + 2P)$.
   Melakukan iterasi jendela geser dengan *stride* $S$ untuk menghitung *inner product* 3D terhadap sekumpulan filter $\mathbf{W} \in \mathbb{R}^{C_{\text{out}} \times C_{\text{in}} \times K_h \times K_w}$ dan bias $\mathbf{b} \in \mathbb{R}^{C_{\text{out}}}$.
2. **Aktivasi Non-Linear (Pointwise ReLU)**:
   Menerapkan fungsi rectifikasi elemen demi elemen: $\mathbf{A} = \max(0, \mathbf{Z})$, memproyeksikan representasi ke dalam kerucut positif (*positive cone*) dan mengintroduksi kapasitas pemisahan manifold visual non-linear.
3. **Subsampling Spasial (Max Pooling 2D)**:
   Mengekstrak nilai puncak lokal di dalam jendela $P_h \times P_w$ dengan langkah stride $S_p$, mereduksi dimensi spasial menjadi $\lfloor (H_A - P_h)/S_p \rfloor + 1$ tanpa mengubah dimensi kanal ($C_{\text{out}}$).

Dalam implementasi produksi tingkat industri seperti NVIDIA cuDNN, komputasi konvolusi multi-channel tidak dieksekusi menggunakan loop bersarang (*nested loops*) yang lambat, melainkan ditransformasikan menjadi operasi perkalian matriks standar (*General Matrix Multiply* / **GEMM**) melalui algoritma **im2col** (image-to-column). Algoritma im2col menduplikasi setiap jendela reseptif spasial 3D dari citra masukan menjadi satu kolom matriks raksasa, sehingga seluruh operasi konvolusi multi-channel dapat dihitung dalam satu instruksi perkalian matriks perangkat keras GPU yang sangat dioptimalkan:

$$\mathbf{Y}_{\text{flat}} = \mathbf{W}_{\text{flat}} \times \mathbf{X}_{\text{im2col}}$$

Implementasi mandiri berbasis NumPy memberikan fondasi intuisi yang esensial untuk mendeteksi galat dimensi (*shape mismatch*), memahami biaya memori penampung aktivasi intermediate, dan merancang operator visi kustom yang inovatif.""",
    "codeSnippet": code_7_10,
    "expectedOutput": out_7_10,
    "commonPitfalls": [
        "Mencoba menggunakan loop bersarang 6 tingkat pada citra beresolusi tinggi ($224 \times 224$) di Python tanpa vektorisasi; loop murni Python sangat lambat untuk ukuran tensor realistis dibanding algoritma im2col.",
        "Lupa memperhitungkan dimensi batch ($N$) dalam pengindeksan array tensor NumPy saat membangun operator kustom.",
        "Mengabaikan penanganan kondisi batas ketika nilai $(H - K + 2P)$ tidak dapat dibagi bulat oleh stride, yang menyebabkan IndexError pada pemotongan patch irisan array."
    ],
    "quiz": {
        "question": "Bagaimana algoritma im2col mempercepat operasi konvolusi multi-channel pada GPU modern?",
        "options": [
            "Dengan mengonversi citra RGB menjadi citra biner hitam-putih sebelum konvolusi.",
            "Dengan menyusun ulang setiap patch reseptif spasial 3D dari citra masukan menjadi baris/kolom matriks sehingga seluruh konvolusi dapat diselesaikan via satu perkalian matriks teroptimasi (GEMM).",
            "Dengan menghapus kebutuhan parameter bobot dan bias pada lapisan konvolusi.",
            "Dengan mengalihkan pemrosesan dari GPU kembali ke CPU murni."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Algoritma im2col meregangkan setiap volume jendela konvolusional spasial 3D menjadi kolom/baris matriks 2D, mentransformasikan operasi konvolusi menjadi perkalian matriks berparalel tinggi (General Matrix Multiply / GEMM) yang sangat cepat dieksekusi oleh core tensor GPU."
    }
})

output_path = os.path.join(os.path.dirname(__file__), "cv_ch7_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 7 data with {len(subchapters)} subchapters: {output_path}")
