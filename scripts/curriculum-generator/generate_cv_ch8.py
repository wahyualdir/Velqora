# -*- coding: utf-8 -*-
"""
Generator untuk Bab 8: Evolusi Arsitektur CNN: AlexNet, VGG, ResNet, dan ConvNeXt (10 Subbab)
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
# Subbab 8.1: AlexNet (2012): Terobosan GPU, Dropout, dan ReLU
# ==============================================================================
code_8_1 = r'''import numpy as np

# Simulasi lapisan pertama AlexNet (Krizhevsky et al., 2012):
# Input: Citra RGB 224x224 (atau 227x227)
# Conv1: Kernel 11x11, Stride 4, Padding 0 (atau 2), 96 filters
np.random.seed(42)

H_in, W_in, C_in = 227, 227, 3
K, S, P = 11, 4, 0
C_out = 96

# Perhitungan dimensi keluaran spasial
H_out = (H_in - K + 2 * P) // S + 1
W_out = (W_in - K + 2 * P) // S + 1

# Perhitungan parameter dan memori aktivasi
params_conv1 = (C_in * K * K * C_out) + C_out
output_elements = C_out * H_out * W_out

# Efek Dropout p=0.5 (Srivastava et al. / Hinton et al.)
mask_dropout = (np.random.rand(10) > 0.5).astype(np.float32)
sample_activations = np.array([2.4, 1.1, 0.5, 3.2, 4.0, 0.1, 1.8, 2.9, 0.7, 3.5])
inverted_dropout_train = (sample_activations * mask_dropout) / 0.5

print("Analisis Teknis Lapisan Pertama AlexNet (Conv1):")
print(f"Resolusi Masukan Citra   : ({C_in}, {H_in}, {W_in})")
print(f"Kernel Size / Stride     : {K}x{K} / Stride {S}")
print(f"Resolusi Feature Map     : ({C_out}, {H_out}, {W_out})")
print(f"Total Parameter Bobot    : {params_conv1:,} parameter")
print(f"Total Elemen Aktivasi    : {output_elements:,} nilai float32")
print("\nSimulasi Inverted Dropout (p=0.5) pada Vektor Fitur FC:")
print(f"Aktivasi Asli            : {sample_activations}")
print(f"Mask Biner Dropout       : {mask_dropout.astype(int)}")
print(f"Aktivasi Setelah Dropout : {inverted_dropout_train}")
'''

out_8_1 = run_code_capture_output(code_8_1)

subchapters.append({
    "id": "cv-8-1-alexnet-architecture",
    "title": "8.1 AlexNet (2012): Terobosan GPU, Dropout, dan ReLU dalam ImageNet",
    "content": r"""Kemenangan monumental **AlexNet** (Krizhevsky, Sutskever, dan Hinton) pada kompetisi *ImageNet Large Scale Visual Recognition Challenge* (ILSVRC) 2012 menandai titik balik sejarah kecerdasan buatan modern. AlexNet berhasil memangkas tingkat galat klasifikasi *top-5 error* dari $26.2\%$ (pendekatan terbaik *hand-crafted* berbasis SIFT/Fisher Vectors) menjadi $15.3\%$, membuktikan keunggulan mutlak representasi fitur hierarkis yang dipelajari secara *end-to-end* langsung dari piksel mentah.

AlexNet dirancang dengan 8 lapisan terpelajari (5 lapisan konvolusi diikuti oleh 3 lapisan terhubung penuh) dan memperkenalkan kombinasi inovasi teknik yang menjadi fondasi *deep learning* modern:

1. **Aktivasi Non-Linear Rectified Linear Unit (ReLU)**:
   Menggantikan fungsi saturasi konvensional $\tanh(x)$ atau sigmoid dengan $f(x) = \max(0, x)$. ReLU mempercepat laju konvergensi *Stochastic Gradient Descent* (SGD) hingga 6 kali lipat karena tidak mengalami saturasi pada domain positif ($f'(x) = 1$ untuk $x > 0$), menyelesaikan masalah degradasi gradien pada lapisan dalam.
2. **Pelatihan Paralel pada Multi-GPU**:
   Pada tahun 2012, memori GPU NVIDIA GeForce GTX 580 hanya sebesar 3 GB, tidak memadai untuk menampung seluruh arsitektur model 60 juta parameter dan peta aktivasi batch. AlexNet membagi arsitektur secara simetris melintasi 2 GPU mandiri, di mana komunikasi antar-GPU hanya dilakukan pada lapisan konvolusi tertentu (Conv3) dan lapisan terhubung penuh (*dense layers*).
3. **Regularisasi Dropout**:
   Untuk mencegah *overfitting* parah pada lapisan terhubung penuh yang memiliki lebih dari 58 juta parameter (hampir $90\%$ dari total parameter model), Hinton et al. menerapkan **Dropout** dengan probabilitas retensi $p = 0.5$. Pada setiap iterasi pelatihan, neuron dinonaktifkan secara acak, memaksa jaringan mempelajari fitur visual yang terdistribusi dan *robust* tanpa saling bergantung patologis (*co-adaptation*).
4. **Augmentasi Data Ekstensif**:
   Menghasilkan data variasi secara *on-the-fly* via pergeseran horizontal (*random crops* $224 \times 224$ dari citra $256 \times 256$), pencerminan horizontal (*horizontal flipping*), dan manipulasi intensitas warna berbasis analisis komponen utama (*PCA color jittering / fancy PCA*).

Lapisan pertama AlexNet menggunakan filter berukuran sangat besar ($11 \times 11$ dengan *stride* 4), mencerminkan strategi agresif untuk langsung mereduksi resolusi spasial citra masukan berukuran besar sekaligus menangkap konteks frekuensi rendah.""",
    "codeSnippet": code_8_1,
    "expectedOutput": out_8_1,
    "commonPitfalls": [
        "Mengabaikan penskalaan $1/p$ pada implementasi Inverted Dropout saat pelatihan, yang dapat menyebabkan diskrepansi magnitudo ekspektasi aktivasi antara fase pelatihan dan evaluasi.",
        "Menggunakan lapisan Normalisasi Respons Lokal (LRN - *Local Response Normalization*) pada arsitektur modern; LRN terbukti inferior dibanding Batch Normalization dan kini telah usang.",
        "Mengira resolusi masukan AlexNet adalah $224 \times 224$ murni; secara matematis formula konvolusi stride 4 dengan kernel 11x11 menghasilkan bilangan bulat jika resolusi masukan adalah $227 \times 227$ ($ (227-11)/4 + 1 = 55 $)."
    ],
    "quiz": {
        "question": "Mengapa penggunaan fungsi aktivasi ReLU dalam AlexNet mampu mempercepat pelatihan jaringan saraf konvolusi secara signifikan dibanding fungsi Tanh?",
        "options": [
            "Karena ReLU mengubah bobot konvolusi menjadi bilangan integer biner.",
            "Karena turunan ReLU bernilai konstan 1 pada domain positif sehingga gradien tidak mengalami fenomena saturasi (vanishing gradient).",
            "Karena ReLU menghapus seluruh operasi dot product antar filter.",
            "Karena ReLU secara otomatis membagi model ke dalam dua GPU."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Fungsi ReLU ($f(x) = \\max(0, x)$) memiliki gradien konstan 1 untuk semua $x > 0$. Ini menghindarkan jaringan dari saturasi kurva asimtotik yang terjadi pada Tanh atau Sigmoid saat aktivasi bernilai besar, mempercepat konvergensi SGD hingga 6x lipat."
    }
})

# ==============================================================================
# Subbab 8.2: VGGNet (2014): Filosofi Homogenitas, Stacking Kernel 3x3
# ==============================================================================
code_8_2 = r'''import numpy as np

# Perbandingan Komparatif: 1 Lapisan Conv 7x7 vs 3 Lapisan Stacking Conv 3x3
# Asumsi channel masukan C_in = C dan channel keluaran C_out = C
C = 64

# Opsi A: 1 lapisan Conv 7x7 (stride 1, padding 3)
params_7x7 = (C * 7 * 7 * C) + C
flops_factor_7x7 = 7 * 7

# Opsi B: 3 lapisan Conv 3x3 (stride 1, padding 1) berturut-turut
# Receptive field efektif:
# Layer 1: RF = 1 + 2 = 3
# Layer 2: RF = 3 + 2 = 5
# Layer 3: RF = 5 + 2 = 7 (Sama persis dengan RF satu filter 7x7!)
params_3x3_stack = 3 * ((C * 3 * 3 * C) + C)
flops_factor_3x3_stack = 3 * (3 * 3)

rasio_penghematan = (1.0 - (params_3x3_stack / params_7x7)) * 100

print("Analisis Desain Homogenitas VGG (Simonyan & Zisserman, 2014):")
print(f"Jumlah Channel C                         : {C}")
print(f"1. Satu Lapisan Conv 7x7 (RF 7x7)        : {params_7x7:,} parameter")
print(f"2. Tiga Lapisan Conv 3x3 Stacking (RF 7x7): {params_3x3_stack:,} parameter")
print(f"Penghematan Parameter Bobot              : {rasio_penghematan:.1f}% lebih efisien!")
print(f"Faktor Skalar FLOPs Kernel Spasial       : 49 (7x7) vs 27 (3x 3x3)")
print(f"Jumlah Fungsi Non-Linearitas (ReLU)     : 1 lapisan vs 3 lapisan (Kapasitas diskriminasi meningkat)")
'''

out_8_2 = run_code_capture_output(code_8_2)

subchapters.append({
    "id": "cv-8-2-vggnet-homogeneity",
    "title": "8.2 VGGNet (2014): Filosofi Homogenitas, Stacking Kernel 3x3, dan Efisiensi Parameter",
    "content": r"""Dikembangkan oleh Karen Simonyan dan Andrew Zisserman dari *Visual Geometry Group* Universitas Oxford, **VGGNet** (2014) memperkenalkan revolusi konseptual dalam perancangan arsitektur jaringan saraf konvolusi: **homogenitas struktural (*architectural simplicity & homogeneity*)**. Sebelum VGG, arsitektur CNN (seperti LeNet dan AlexNet) dirancang dengan kombinasi ukuran kernel yang bervariasi dan heuristik ($11 \times 11, 7 \times 7, 5 \times 5$). VGG menunjukkan bahwa kedalaman (*depth*) merupakan dimensi paling krusial untuk performa representasi visual, dan seluruh kernel besar dapat digantikan oleh tumpukan berulang kernel terkecil yang bermakna secara spasial: **$3 \times 3$**.

**Mekanisme Matematika Stacking Kernel $3 \times 3$**:
Jika kita menumpuk $k$ lapisan konvolusi dengan ukuran kernel spasial $3 \times 3$ berurutan (stride $S = 1$), receptive field teoretis yang terbentuk setara dengan satu lapisan konvolusi tunggal berukuran $(2k + 1) \times (2k + 1)$:
- **2 tumpukan $3 \times 3$**: Menghasilkan receptive field $5 \times 5$.
- **3 tumpukan $3 \times 3$**: Menghasilkan receptive field $7 \times 7$.

Keuntungan fundamental dari strategi *stacking* ini:
1. **Efisiensi Parameter Drastis**:
   Misalkan sebuah blok mempertahankan kedalaman $C$ channel dari input ke output. Satu lapisan konvolusi $7 \times 7$ memerlukan:
   $$\text{Params}_{7 \times 7} = 7^2 \cdot C^2 = 49 C^2$$
   Sebaliknya, tiga lapisan konvolusi $3 \times 3$ berturut-turut hanya membutuhkan:
   $$\text{Params}_{3 \times (3 \times 3)} = 3 \cdot (3^2 \cdot C^2) = 27 C^2$$
   Penggunaan tiga kernel $3 \times 3$ menghemat parameter bobot sebesar $\frac{49 - 27}{49} \approx 44.9\%$, sekaligus mengurangi beban komputasi FLOPs.
2. **Peningkatan Kapasitas Diskriminasi Non-Linear**:
   Alih-alih hanya menerapkan satu fungsi aktivasi ReLU setelah satu lapisan $7 \times 7$, tiga tumpukan lapisan $3 \times 3$ menyisipkan tiga fungsi aktivasi ReLU independen, memungkinkan jaringan memetakan fungsi pemisah manifold visual yang jauh lebih ekspresif dan diskriminatif.

Arsitektur kanonikal **VGG-16** dan **VGG-19** mengadopsi pola modular blok berulang yang elegan: blok konvolusi $3 \times 3$ (dengan penggandaan jumlah channel dari 64, 128, 256, hingga 512 setiap kali dimensi spasial diperkecil separuhnya oleh Max Pooling $2 \times 2$). Meskipun sangat tangguh sebagai *backbone feature extractor*, VGG memiliki kelemahan komputasi: ukuran model sangat besar (138 juta parameter pada VGG-16), dengan lebih dari 100 juta parameter terakumulasi hanya pada lapisan Fully-Connected pertama (FC1: $7 \times 7 \times 512 \times 4096$).""",
    "codeSnippet": code_8_2,
    "expectedOutput": out_8_2,
    "commonPitfalls": [
        "Mengasumsikan kernel $1 \times 1$ dapat mengekstrak konteks spasial ketetanggaan; kernel terkecil yang mempertahankan kemampuan menangkap arah kiri-kanan dan atas-bawah adalah $3 \times 3$.",
        "Mengabaikan biaya komputasi dan memori aktivasi raksasa pada lapisan awal VGG-16, di mana citra beresolusi tinggi $224 \times 224$ mempertahankan channel 64-128 sebelum downsampling agresif.",
        "Menggunakan lapisan FC 4096 konvensional di era modern; arsitektur penerus mengganti FC masif ini dengan Global Average Pooling (GAP) untuk menghemat lebih dari 100 juta parameter."
    ],
    "quiz": {
        "question": "Mengapa VGGNet memilih menumpuk dua lapisan konvolusi 3x3 alih-alih menggunakan satu lapisan konvolusi 5x5?",
        "options": [
            "Karena konvolusi 5x5 tidak dapat diimplementasikan pada GPU NVIDIA.",
            "Karena tumpukan dua lapisan 3x3 menghasilkan receptive field efektif yang sama (5x5) namun menghemat sekitar 28% parameter bobot dan menyertakan dua fungsi aktivasi non-linear.",
            "Karena konvolusi 3x3 tidak membutuhkan padding sama sekali.",
            "Karena dua lapisan 3x3 menghilangkan kebutuhan normalisasi batch."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Dua lapisan $3\\times 3$ memiliki receptive field efektif $5\\times 5$, membutuhkan bobot $2 \\times 3^2 C^2 = 18 C^2$ dibanding $1 \\times 5^2 C^2 = 25 C^2$ (hemat ~28%), serta menyisipkan dua fungsi aktivasi non-linear yang memperkaya representasi fitur."
    }
})

# ==============================================================================
# Subbab 8.3: Inception/GoogLeNet: Multi-Scale Aggregation & 1x1 Bottleneck
# ==============================================================================
code_8_3 = r'''import numpy as np

# Simulasi Efisiensi Konvolusi 1x1 sebagai Dimensionality Reduction (Bottleneck)
# Input: Feature map dengan 256 channel, H=28, W=28
# Target: Menghasilkan 128 channel fitur dengan kernel 3x3
H, W, C_in, C_out = 28, 28, 256, 128
K = 3

# Opsi 1: Konvolusi 3x3 Langsung (Naive)
params_naive = C_in * K * K * C_out
flops_naive = H * W * params_naive

# Opsi 2: Konvolusi 1x1 Bottleneck (reduksi ke 64 channel) -> dilanjutkan Conv 3x3
C_bottleneck = 64
params_1x1 = C_in * 1 * 1 * C_bottleneck
params_3x3_reduced = C_bottleneck * K * K * C_out
params_inception = params_1x1 + params_3x3_reduced
flops_inception = (H * W * params_1x1) + (H * W * params_3x3_reduced)

print("Analisis Bottleneck 1x1 Inception (Szegedy et al., 2015):")
print(f"Tensor Masukan            : ({C_in}, {H}, {W}) -> Target: ({C_out}, {H}, {W})")
print(f"1. Naive Conv 3x3 Langsung: {params_naive:,} parameter | {flops_naive:,} FLOPs")
print(f"2. Inception Bottleneck   : {params_inception:,} parameter | {flops_inception:,} FLOPs")
print(f"Rasio Penghematan Komputasi: {flops_naive / flops_inception:.2f}x lebih hemat!")
'''

out_8_3 = run_code_capture_output(code_8_3)

subchapters.append({
    "id": "cv-8-3-inception-googlenet",
    "title": "8.3 Inception/GoogLeNet (2014): Multi-Scale Feature Aggregation dan Bottleneck 1x1",
    "content": r"""Pada kompetisi ILSVRC 2014 yang sama dengan VGGNet, pemenang kategori klasifikasi adalah **GoogLeNet / Inception-v1** (Szegedy et al.). Berbeda dengan pendekatan VGG yang memperdalam jaringan melalui penumpukan lapisan sekuensial homogen, GoogLeNet mengeksplorasi dimensi **lebar jaringan (*width*)** dan **agregasi multi-skala spasial (*multi-scale spatial aggregation*)** dengan batasan ketat efisiensi komputasi (hanya memiliki 6.8 juta parameter, sekitar $1/20$ dari ukuran VGG-16).

Prinsip dasar **Inception Module**:
Dalam citra alami, skala fitur visual bervariasi secara ekstrem: detail lokal halus memerlukan kernel kecil ($1 \times 1$ atau $3 \times 3$), sedangkan struktur objek besar memerlukan kernel spasial lebar ($5 \times 5$). Alih-alih memaksa perancang memilih satu ukuran kernel secara apriori di setiap lapisan, modul Inception mengeksekusi beberapa cabang konvolusi secara paralel dan menggabungkan (*concatenate*) keluaran mereka di sepanjang sumbu channel:
- Cabang 1: Konvolusi $1 \times 1$ (ekstraksi fitur titik/lintas-kanal).
- Cabang 2: Konvolusi $3 \times 3$ (ekstraksi konteks spasial sedang).
- Cabang 3: Konvolusi $5 \times 5$ (ekstraksi konteks spasial luas).
- Cabang 4: Max Pooling $3 \times 3$ (ekstraksi fitur topologis dominan).

**Peran Kunci Konvolusi $1 \times 1$ sebagai Proyeksi Bottleneck**:
Jika operasi konvolusi multi-cabang diterapkan langsung pada peta fitur dengan jumlah kanal besar, dimensi kanal keluaran gabungan akan meledak secara eksponensial (*computational blow-up*). Di sinilah konvolusi $1 \times 1$ memainkan peran revolusioner sebagai **reduksi dimensi (bottleneck)**:
- Konvolusi $1 \times 1$ menerapkan kombinasi linier terpelajari lintas kanal pada setiap posisi spasial piksel $(x, y)$ secara independen.
- Dengan memproyeksikan tensor dari $C_{\text{in}}$ (misal 256 kanal) ke ruang yang lebih sempit $C_{\text{squeeze}}$ (misal 64 kanal) sebelum konvolusi spasial $3 \times 3$ atau $5 \times 5$, beban komputasi FLOPs dan jumlah parameter dapat ditekan hingga $70\% - 80\%$, tanpa mengorbankan kapasitas representasi spasial.

Selain modul Inception, GoogLeNet memperkenalkan **Auxiliary Classifiers** (dua kepala klasifikasi tambahan pada lapisan perantara) saat pelatihan untuk menyuntikkan gradien secara langsung ke lapisan-lapisan bawah guna menangkal pelemahan gradien pada jaringan sedalam 22 lapisan.""",
    "codeSnippet": code_8_3,
    "expectedOutput": out_8_3,
    "commonPitfalls": [
        "Membingungkan konvolusi $1 \times 1$ dengan operasi skalar sederhana; konvolusi $1 \times 1$ adalah proyeksi linear matriks dimensi $(C_{\text{out}} \times C_{\text{in}})$ pada setiap koordinat spasial piksel.",
        "Mengabaikan bahwa konvolusi $1 \times 1$ menyertakan fungsi aktivasi non-linear (ReLU) setelahnya, sehingga bukan sekadar reduksi dimensi linier seperti PCA melainkan transformasi manifold non-linear.",
        "Menyertakan Auxiliary Classifiers pada saat fase inferensi produksi; kepala klasifikasi perantara ini hanya digunakan sebagai injektor gradien saat pelatihan dan harus dibuang saat inferensi."
    ],
    "quiz": {
        "question": "Fungsi utama konvolusi 1x1 dalam modul Inception GoogLeNet adalah:",
        "options": [
            "Memperluas receptive field spasial citra masukan menjadi dua kali lipat.",
            "Melakukan reduksi dimensi channel (bottleneck) untuk menekan biaya komputasi sebelum operasi konvolusi spasial yang lebih besar seperti 3x3 dan 5x5.",
            "Menggantikan fungsi padding pada batas tepi citra.",
            "Mengubah tensor 4D menjadi array 1D tanpa perkalian bobot."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Konvolusi 1x1 bertindak sebagai operator proyeksi fitur antar-kanal (cross-channel linear projection) yang memangkas kedalaman channel tensor aktivasi, mereduksi kompleksitas komputasi FLOPs secara dramatis sebelum diaplikasikan kernel spasial 3x3 atau 5x5."
    }
})

# ==============================================================================
# Subbab 8.4: Fenomena Degradasi Kedalaman Jaringan dan Hilangnya Gradien
# ==============================================================================
code_8_4 = r'''import numpy as np

# Simulasi Rantai Propagasi Balik Gradien pada Jaringan Konvolusi Dalam Polos (Plain Net)
# dL/dX_0 = dL/dX_L * prod_{l=1}^L W_l^T
np.random.seed(42)

kedalaman_list = [5, 20, 50, 100]
gradien_awal = 1.0

print("Simulasi Dinamika Magnitudo Gradien pada Plain Deep Network:")
print(f"{'Kedalaman Lapisan (L)':<24} | {'Norm Gradien di Lapisan 1':<28} | {'Status Aliran Gradien'}")
print("-" * 75)

for L in kedalaman_list:
    # Asumsikan rata-rata nilai singular efektif turunan Jacobian per lapisan
    # Kasus A: Sedikit di bawah 1.0 (misal 0.85 -> Vanishing Gradient)
    s_val = 0.85
    grad_norm = gradien_awal * (s_val ** L)
    
    status = "Stabil" if grad_norm > 1e-3 else ("Meredam Ekstrem (Vanished)" if grad_norm < 1e-6 else "Mulai Lenyap")
    print(f"{L:<24} | {grad_norm:<28.2e} | {status}")

print("\nObservasi Eksperimental He et al. (2016):")
print("- Pada Plain-56, galat pelatihan (*training error*) justru LEBIH TINGGI daripada Plain-20.")
print("- Ini BUKAN overfitting (karena training error memburuk), melainkan kesulitan optimasi (degradation problem).")
'''

out_8_4 = run_code_capture_output(code_8_4)

subchapters.append({
    "id": "cv-8-4-network-depth-degradation",
    "title": "8.4 Fenomena Degradasi Kedalaman Jaringan dan Masalah Hilangnya Gradien",
    "content": r"""Secara intuisi teoretis, memperdalam arsitektur jaringan saraf (*increasing network depth*) seharusnya selalu meningkatkan atau setidaknya mempertahankan kapasitas representasi model: jika lapisan tambahan hanya mempelajari fungsi identitas (*identity mapping* $\mathcal{H}(\mathbf{x}) = \mathbf{x}$), model yang lebih dalam seharusnya menghasilkan galat pelatihan (*training error*) yang tidak lebih besar dibanding model yang lebih dangkal.

Namun, pada pertengahan 2015, Kaiming He, Xiangyu Zhang, Shaoqing Ren, dan Jian Sun mendokumentasikan fenomena paradoks yang mencengangkan: **Masalah Degradasi (*The Degradation Problem*)**. Ketika arsitektur jaringan konvolusi polos (*plain networks*) diperdalam melampaui 20–30 lapisan:
1. **Akurasi Menurun Drastis**: Galat pelatihan (*training error*) meningkat secara signifikan, bukan hanya galat pengujian (*test error*). Hal ini membuktikan bahwa degradasi **bukan disebabkan oleh *overfitting*** (jika overfitting terjadi, training error akan mendekati nol sedangkan test error membengkak).
2. **Kegagalan Optimasi (*Optimization Failure*)**: Pengoptimal *stochastic gradient descent* konvensional gagal menemukan pemetaan identitas sederhana melalui serangkaian transformasi non-linear $\mathbf{x}_{l} = \sigma(\mathbf{W}_l \mathbf{x}_{l-1} + \mathbf{b}_l)$.

**Akar Masalah Matematis: Dinamika Spektral Gradien**:
Melalui aturan rantai (*chain rule*) kalkulus multivariat, gradien fungsi rugi $\mathcal{L}$ terhadap aktivasi pada lapisan awal $\mathbf{x}_0$ merupakan perkalian beruntun matriks Jacobian dari setiap lapisan berikutnya:

$$\frac{\partial \mathcal{L}}{\partial \mathbf{x}_0} = \frac{\partial \mathcal{L}}{\partial \mathbf{x}_L} \prod_{l=1}^L \frac{\partial \mathbf{x}_l}{\partial \mathbf{x}_{l-1}} = \frac{\partial \mathcal{L}}{\partial \mathbf{x}_L} \prod_{l=1}^L \left( \operatorname{diag}(\sigma'(\mathbf{z}_l)) \mathbf{W}_l \right)$$

Jika nilai singular efektif (*effective singular values*) dari matriks transisi rata-rata berada sedikit di bawah 1 ($\lambda < 1.0$), magnitudo gradien akan meluruh secara eksponensial terhadap kedalaman:

$$\left\| \frac{\partial \mathcal{L}}{\partial \mathbf{x}_0} \right\| \propto \lambda^L \xrightarrow[L \to \infty]{} 0 \quad (\textbf{Vanishing Gradient})$$

Sebaliknya, jika $\lambda > 1.0$, gradien akan membesar secara eksponensial menuju tak hingga ($\textbf{Exploding Gradient}$). Meskipun teknik seperti *Normalized Initialization* (He initialization / Xavier initialization) dan *Batch Normalization* mampu menjaga varians gradien pada jaringan berkedalaman 20-30 lapisan, kedua teknik tersebut tidak mampu memecahkan *degradation problem* saat kedalaman didorong hingga 50, 100, atau 1000 lapisan.""",
    "codeSnippet": code_8_4,
    "expectedOutput": out_8_4,
    "commonPitfalls": [
        "Mendiagnosis fenomena degradasi sebagai *overfitting*; degradasi ditandai dengan meningkatnya galat pada data latih (*training error*), sedangkan overfitting ditandai dengan training error sangat rendah namun test error tinggi.",
        "Mengasumsikan bahwa Batch Normalization saja sudah cukup untuk melatih jaringan konvolusional dengan kedalaman sembarang (misal 150 lapisan) tanpa skip connection.",
        "Mengabaikan stabilitas inisialisasi bobot (He init) saat melatih jaringan konvolusi tanpa residual blocks."
    ],
    "quiz": {
        "question": "Bagaimana cara membedakan fenomena degradasi jaringan (degradation problem) dari fenomena overfitting pada arsitektur konvolusi yang sangat dalam?",
        "options": [
            "Degradasi hanya terjadi pada dataset klasifikasi biner, sedangkan overfitting pada multi-kelas.",
            "Degradasi ditandai dengan memburuknya performa pada dataset latih (training error meningkat) seiring bertambahnya kedalaman, sedangkan overfitting ditandai dengan training error sangat rendah namun validation error membengkak.",
            "Degradasi ditandai dengan parameter bobot yang berubah menjadi NaN secara instan.",
            "Degradasi terjadi ketika ukuran batch terlalu besar."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Degradasi adalah masalah optimasi mendasar di mana jaringan yang lebih dalam gagal mengonvergen ke solusi optimal sehingga training loss-nya justru lebih tinggi daripada model dangkal pembandingnya. Sebaliknya, overfitting menghasilkan training loss yang sangat rendah tetapi generalisasinya buruk."
    }
})

# ==============================================================================
# Subbab 8.5: Residual Learning Framework (ResNet): Skip-Connection
# ==============================================================================
code_8_5 = r'''import numpy as np

# Simulasi Residual Block Dasar: y = F(x, {W_i}) + x
# Forward dan Backward gradient flow
np.random.seed(42)

dim = 4
x = np.array([1.2, -0.5, 2.0, 0.8], dtype=np.float32)

# Bobot lapisan residual F(x)
W1 = np.random.randn(dim, dim).astype(np.float32) * 0.1
W2 = np.random.randn(dim, dim).astype(np.float32) * 0.1

# Forward pass:
# Transformasi F(x) = W2 * ReLU(W1 * x)
h1 = np.maximum(0, np.dot(W1, x))
fx = np.dot(W2, h1)

# Residual connection (Skip Connection):
y = fx + x

# Analisis Aliran Gradien Backpropagation:
# dL/dx = dL/dy * dy/dx = dL/dy * (dF/dx + I)
# Di mana I adalah matriks identitas!
grad_out = np.array([1.0, 1.0, 1.0, 1.0], dtype=np.float32) # Misal dL/dy
grad_identity = grad_out * 1.0 # Jalur tol bebas hambatan (Skip connection)
# dF/dx terhambat oleh bobot W, tetapi grad_identity menjamin aliran gradien tidak pernah nol!

print("Mekanisme Aliran Sinyal Residual Block (ResNet - He et al., 2016):")
print(f"Tensor Masukan x            : {x}")
print(f"Residual Sub-network F(x)   : {np.round(fx, 4)}")
print(f"Keluaran Gabungan y = F(x)+x: {np.round(y, 4)}")
print(f"\nAliran Gradien Backward dy/dx:")
print(f"- Komponen Skip Connection (Identitas I) : {grad_identity} (Menjamin gradien tak lenyap)")
print(f"- Bahkan jika seluruh bobot F(x) runtuh ke 0, gradien tetap mengalir 100% via Identitas!")
'''

out_8_5 = run_code_capture_output(code_8_5)

subchapters.append({
    "id": "cv-8-5-resnet-skip-connections",
    "title": "8.5 Residual Learning Framework (ResNet): Formulasi Skip-Connection",
    "content": r"""Untuk mengatasi masalah degradasi kedalaman, Kaiming He et al. (2016) mengusulkan **Deep Residual Learning Framework (ResNet)** yang memenangkan kompetisi ILSVRC 2015 pada seluruh kategori (klasifikasi, deteksi, dan lokalisasi) dengan arsitektur radikal sedalam 152 lapisan.

**Formulasi Pembelajaran Residual**:
Alih-alih berasumsi bahwa beberapa lapisan berturut-turut harus secara langsung mencocokkan pemetaan dasar yang diinginkan $\mathcal{H}(\mathbf{x})$, ResNet secara eksplisit membiarkan lapisan-lapisan tersebut mempelajari **pemetaan residual (*residual mapping*)**:

$$\mathcal{F}(\mathbf{x}) = \mathcal{H}(\mathbf{x}) - \mathbf{x}$$

Pemetaan target asli dikonstruksi ulang melalui operasi penjumlahan elemen demi elemen (*shortcut / skip connection*):

$$\mathcal{H}(\mathbf{x}) = \mathcal{F}(\mathbf{x}) + \mathbf{x}$$

Mengapa reformulasi residual ini secara mendasar memudahkan optimasi?
1. **Kemudahan Mempelajari Fungsi Identitas**: Jika suatu lapisan tambahan tidak diperlukan untuk meningkatkan representasi, algoritma optimasi cukup mendorong bobot transformasi residual menuju nol ($\mathcal{F}(\mathbf{x}) \to 0$). Memaksa fungsi residual mendekati nol jauh lebih mudah dicapai melalui regularisasi weight decay dibanding memaksa lapisan konvolusi non-linear mempertahankan transformasi identitas linier sempurna.
2. **Jalur Bebas Hambatan Aliran Gradien (*Gradient Highway*)**:
   Tinjau turunan fungsi rugi $\mathcal{L}$ terhadap masukan blok $\mathbf{x}$:
   $$\frac{\partial \mathcal{L}}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathcal{H}(\mathbf{x})} \frac{\partial \mathcal{H}(\mathbf{x})}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathcal{H}(\mathbf{x})} \left( \frac{\partial \mathcal{F}(\mathbf{x})}{\partial \mathbf{x}} + \mathbf{I} \right)$$
   Keberadaan matriks identitas $\mathbf{I}$ menjamin bahwa suku gradien $\frac{\partial \mathcal{L}}{\partial \mathcal{H}(\mathbf{x})}$ dipropagasikan balik secara langsung ke lapisan sebelumnya **tanpa terhalang oleh bobot transformasi $\mathcal{F}$**. Bahkan jika magnitudo gradien transformasi $\frac{\partial \mathcal{F}}{\partial \mathbf{x}}$ mendekati nol, gradien keseluruhan tidak akan pernah lenyap karena suku identitas $\mathbf{I}$ selalu bernilai 1.

ResNet memungkinkan pelatihan jaringan saraf yang sangat dalam secara stabil (mencapai ribuan lapisan pada CIFAR-10) tanpa mengalami degradasi optimasi.""",
    "codeSnippet": code_8_5,
    "expectedOutput": out_8_5,
    "commonPitfalls": [
        "Membingungkan operasi penjumlahan elemen demi elemen ($+$) pada ResNet dengan operasi penggabungan kanal (*concatenation*) pada DenseNet; ResNet tidak menambah jumlah dimensi kanal tensor.",
        "Mengabaikan ketidaksesuaian dimensi saat resolusi spasial atau kedalaman kanal berubah; jika dimensi $\mathcal{F}(\mathbf{x})$ berbeda dari $\mathbf{x}$, jalur skip connection memerlukan proyeksi linear $1 \times 1$ ($\mathbf{W}_s \mathbf{x}$).",
        "Menaruh fungsi aktivasi ReLU setelah skip connection tanpa memperhatikan urutan pre-activation vs post-activation (He et al., 2016 kemudian membuktikan bahwa Pre-Activation ResNet memberikan propagasi gradien yang lebih murni)."
    ],
    "quiz": {
        "question": "Mengapa suku identitas (+ x) pada skip connection ResNet secara teoretis mencegah fenomena vanishing gradient?",
        "options": [
            "Karena suku identitas mengubah seluruh operasi perkalian matriks menjadi pembagian skalar.",
            "Karena dalam aturan rantai turunan, turunan terhadap x menghasilkan suku + I (matriks identitas), yang menjamin gradien dapat mengalir langsung tanpa teredam oleh bobot lapisan transformasi.",
            "Karena skip connection memaksa seluruh bobot lapisan residual menjadi bernilai positif.",
            "Karena skip connection secara otomatis mereduksi dimensi tensor masukan menjadi separuhnya."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Turunan $\\frac{\\partial (\\mathcal{F}(\\mathbf{x}) + \\mathbf{x})}{\\partial \\mathbf{x}} = \\frac{\\partial \\mathcal{F}}{\\partial \\mathbf{x}} + \\mathbf{I}$. Suku $\\mathbf{I}$ bertindak sebagai jalan tol gradien yang menyalurkan sinyal error kembali ke lapisan-lapisan paling awal tanpa meluruh akibat perkalian bobot berulang."
    }
})

# ==============================================================================
# Subbab 8.6: Bottleneck Residual Block dan ResNet-50/101/152
# ==============================================================================
code_8_6 = r'''import numpy as np

# Perbandingan Kompleksitas: Basic Residual Block (ResNet-18/34) vs Bottleneck Block (ResNet-50/101/152)
# Misalkan input fitur memiliki channel C = 256
C = 256

# 1. Basic Block: 2x Conv 3x3 (Channel tetap 256)
params_basic = 2 * (C * 3 * 3 * C)

# 2. Bottleneck Block: Conv 1x1 (Squeeze ke C/4) -> Conv 3x3 -> Conv 1x1 (Expand ke C)
C_bottleneck = C // 4 # 64 channel
params_conv1 = C * 1 * 1 * C_bottleneck          # Squeeze 1x1: 256 -> 64
params_conv2 = C_bottleneck * 3 * 3 * C_bottleneck # Spasial 3x3: 64 -> 64
params_conv3 = C_bottleneck * 1 * 1 * C          # Expand 1x1: 64 -> 256
params_bottleneck = params_conv1 + params_conv2 + params_conv3

print("Perbandingan Kompleksitas Parameter Blok Residual (He et al., 2016):")
print(f"Dimensi Kanal Input/Output: {C} -> Kanal Bottleneck: {C_bottleneck}")
print(f"1. Basic Block (Dua Conv 3x3)      : {params_basic:,} parameter")
print(f"2. Bottleneck Block (1x1 -> 3x3 -> 1x1): {params_bottleneck:,} parameter")
print(f"Rasio Efisiensi Parameter          : {params_basic / params_bottleneck:.2f}x lebih ringkas!")
print(f"Keuntungan Arsitektural            : Memungkinkan ResNet dibangun hingga 50, 101, dan 152 lapisan tanpa ledakan komputasi.")
'''

out_8_6 = run_code_capture_output(code_8_6)

subchapters.append({
    "id": "cv-8-6-bottleneck-residual-blocks",
    "title": "8.6 Bottleneck Residual Block dan ResNet-50/101/152",
    "content": r"""Dalam perancangan arsitektur ResNet berkedalaman tinggi (seperti **ResNet-50, ResNet-101, dan ResNet-152**), penggunaan blok residual dasar (*Basic Residual Block* yang tersusun atas dua lapisan konvolusi $3 \times 3$) menjadi tidak memungkinkan secara komputasional karena pertumbuhan beban FLOPs yang masif. Untuk menanggulangi batasan ini, Kaiming He et al. merancang **Bottleneck Residual Block**.

Struktur **Bottleneck Residual Block** membagi transformasi $\mathcal{F}(\mathbf{x})$ menjadi tiga lapisan terpisah (*three-layer stack*):
1. **Konvolusi $1 \times 1$ (*Squeeze / Compression*)**:
   Mereduksi dimensi kanal masukan dari $C$ menjadi sub-ruang yang jauh lebih sempit, biasanya faktor kompresi $4\times$ ($C_{\text{neck}} = C / 4$).
2. **Konvolusi $3 \times 3$ (*Spatial Feature Extraction*)**:
   Melakukan agregasi spasial pada ruang kanal berdimensi rendah ($C_{\text{neck}}$).
3. **Konvolusi $1 \times 1$ (*Expansion / Restoration*)**:
   Memulihkan dan memperluas dimensi kanal kembali ke kapasitas aslinya $C$ sebelum dijumlahkan dengan skip connection identitas $\mathbf{x}$.

**Analisis Kuantitatif Parameter**:
Untuk blok dengan $C = 256$ kanal masukan dan keluaran:
- *Basic Block ($2 \times 3 \times 3$)*:
  $$\text{Params}_{\text{Basic}} = 2 \times (256 \times 3 \times 3 \times 256) = 1.179.648 \text{ parameter}$$
- *Bottleneck Block ($1 \times 1 \to 3 \times 3 \to 1 \times 1$ dengan $C_{\text{neck}} = 64$)*:
  $$\text{Conv1} = 256 \times 1 \times 1 \times 64 = 16.384$$
  $$\text{Conv2} = 64 \times 3 \times 3 \times 64 = 36.864$$
  $$\text{Conv3} = 64 \times 1 \times 1 \times 256 = 16.384$$
  $$\text{Params}_{\text{Bottleneck}} = 16.384 + 36.864 + 16.384 = 69.632 \text{ parameter}$$

Penggunaan struktur bottleneck menghasilkan pengurangan parameter sebesar **$16.9\times$ lebih hemat** dibanding basic block dengan kapasitas kanal yang setara! Penghematan parameter dan FLOPs yang dramatis ini memungkinkan ResNet-50 dan ResNet-101 memiliki akurasi yang jauh lebih tinggi daripada ResNet-34 dengan kompleksitas waktu pelatihan yang tetap terkendali.""",
    "codeSnippet": code_8_6,
    "expectedOutput": out_8_6,
    "commonPitfalls": [
        "Mengasumsikan ResNet-18 dan ResNet-34 menggunakan Bottleneck Blocks; model berkedalaman lebih rendah ini menggunakan Basic Blocks ($3 \times 3$ berurutan), sedangkan Bottleneck Blocks baru digunakan mulai dari ResNet-50 ke atas.",
        "Mengabaikan bahwa pada blok pertama setiap tahapan (stage) saat terjadi downsampling spasial, jalur skip connection harus menggunakan konvolusi proyeksi $1 \times 1$ dengan stride 2 agar dimensi spasial dan kanalnya cocok dengan keluaran bottleneck.",
        "Menerapkan bottleneck compression terlalu agresif (misal $C/16$), yang dapat memicu kehilangan informasi representasi visual penting (*information bottleneck*)."
    ],
    "quiz": {
        "question": "Mengapa arsitektur ResNet-50 ke atas mengadopsi Bottleneck Block (1x1 -> 3x3 -> 1x1) alih-alih Basic Block (3x3 -> 3x3)?",
        "options": [
            "Karena Bottleneck Block tidak memerlukan fungsi aktivasi non-linear.",
            "Karena Bottleneck Block menekan jumlah kanal masukan ke ruang berdimensi rendah sebelum konvolusi 3x3 dan memulihkannya kembali, menghemat parameter dan komputasi secara masif sehingga model dapat dibuat jauh lebih dalam.",
            "Karena Basic Block tidak mendukung proses optimasi Adam.",
            "Karena Bottleneck Block sepenuhnya menghilangkan jalur skip connection."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Bottleneck block mereduksi jumlah kanal sebesar 4x menggunakan konvolusi 1x1 sebelum menerapkan filter spasial 3x3, lalu mengembangkannya kembali. Ini memangkas jumlah operasi FLOPs dan parameter secara drastis, memungkinkan jaringan dibangun hingga ratusan lapisan."
    }
})

# ==============================================================================
# Subbab 8.7: ResNeXt (2017): Agregasi Kardinalitas (Split-Transform-Merge)
# ==============================================================================
code_8_7 = r'''import numpy as np

# Simulasi Kardinalitas ResNeXt (Xie et al., 2017): Split-Transform-Merge
# Paradigma: y = x + sum_{i=1}^C T_i(x)
# Di mana C adalah Kardinalitas (jumlah jalur transformasi independen)
np.random.seed(42)

dim_in = 64
cardinality = 4 # C = 4 cabang (paths)
dim_group = 4   # lebar kanal per jalur

x = np.random.randn(dim_in).astype(np.float32)

# Eksekusi Transformasi Paralel (Split-Transform-Merge)
# Ekuivalen matematis dengan Grouped Convolution!
branch_outputs = []
for c in range(cardinality):
    # Proyeksi ke subruang (Split & Transform)
    W_branch = np.random.randn(dim_in, dim_group).astype(np.float32) * 0.1
    W_expand = np.random.randn(dim_group, dim_in).astype(np.float32) * 0.1
    h = np.maximum(0, np.dot(x, W_branch))
    out_c = np.dot(h, W_expand)
    branch_outputs.append(out_c)

# Merge: Penjumlahan seluruh cabang
aggregated = np.sum(branch_outputs, axis=0)
y_resnext = x + aggregated

print("Prinsip Split-Transform-Merge ResNeXt (Xie et al., 2017):")
print(f"Kardinalitas (Jumlah Cabang Paralel C): {cardinality}")
print(f"Dimensi Vektor Masukan x              : {x.shape}")
print(f"Norm L2 Masukan x                     : {np.linalg.norm(x):.3f}")
print(f"Norm L2 Respon Agregasi Cabang        : {np.linalg.norm(aggregated):.3f}")
print(f"Norm L2 Keluaran Akhir y = x + sum(T) : {np.linalg.norm(y_resnext):.3f}")
print("Kesimpulan: Meningkatkan Kardinalitas lebih efektif mendongkrak akurasi daripada memperdalam atau memperlebar jaringan.")
'''

out_8_7 = run_code_capture_output(code_8_7)

subchapters.append({
    "id": "cv-8-7-resnext-cardinality",
    "title": "8.7 ResNeXt (2017): Dimensi Agregasi Kardinalitas (Split-Transform-Merge)",
    "content": r"""Dalam merancang arsitektur jaringan saraf konvolusional berkinerja tinggi, paradigma konvensional berfokus pada dua dimensi utama: **kedalaman jaringan (*depth*)** (sebagaimana dipelopori oleh VGG dan ResNet) dan **lebar jaringan (*width*)** (jumlah kanal pada setiap lapisan). Pada tahun 2017, Saining Xie, Ross Girshick, Piotr Dollár, Zhuowen Tu, dan Kaiming He memperkenalkan dimensi arsitektural ketiga yang fundamental: **Kardinalitas (*Cardinality*)** melalui arsitektur **ResNeXt**.

**Strategi Split-Transform-Merge**:
ResNeXt memadukan filosofi desain berulang homogen milik VGG/ResNet dengan pendekatan multi-cabang terpecah milik Inception ke dalam formulasi matematika yang sangat teratur:

$$\mathbf{y} = \mathbf{x} + \sum_{i=1}^C \mathcal{T}_i(\mathbf{x})$$

di mana:
- $\mathbf{x}$ adalah tensor masukan,
- $\mathcal{T}_i(\mathbf{x})$ adalah transformasi fungsi jaringan arbiter (biasanya struktur bottleneck $1 \times 1 \to 3 \times 3 \to 1 \times 1$),
- $C$ mendefinisikan **Kardinalitas (*Cardinality*)**, yaitu ukuran himpunan jalur transformasi mandiri yang diisolasi.

**Keunggulan Kuantitatif Kardinalitas**:
Temuan empiris terpenting dari ResNeXt adalah bahwa di bawah batasan kompleksitas parameter dan FLOPs yang identik, **meningkatkan kardinalitas $C$ secara konsisten menghasilkan penurunan galat klasifikasi yang lebih signifikan** dibanding memperdalam jaringan (*depth*) atau memperlebar kapasitas kanal (*width*).

**Ekuivalensi Komputasional dengan Grouped Convolution**:
Mengeksekusi $C$ cabang transformasi terpisah secara eksplisit akan sangat tidak efisien pada perangkat keras GPU karena latensi peluncuran kernel (*kernel launch overhead*). Xie et al. membuktikan secara matematis bahwa agregasi paralel $C$ cabang transformasi identik secara aljabar setara dengan satu lapisan **Grouped Convolution** (konvolusi terkelompok dengan parameter `groups = C`). Dengan formulasi ini, seluruh cabang dieksekusi secara simultan dalam satu operasi tensor GPU yang sangat teroptimasi tanpa penurunan throughput inferensi.""",
    "codeSnippet": code_8_7,
    "expectedOutput": out_8_7,
    "commonPitfalls": [
        "Membingungkan konsep kardinalitas (jumlah kelompok cabang transformasi) dengan lebar channel jaringan; kardinalitas mengukur diversitas sub-ruang representasi.",
        "Mengimplementasikan ResNeXt dengan loop Python multi-cabang terpisah, yang sangat lambat; implementasi wajib menggunakan parameter `groups` pada lapisan Conv2D PyTorch/cuDNN.",
        "Mengasumsikan ResNeXt menambah parameter bobot dibanding ResNet setara; ResNeXt dirancang dengan aturan kapasitas parameter konstan melalui penyesuaian lebar kanal kelompok (*group width*)."
    ],
    "quiz": {
        "question": "Apakah temuan kunci dari makalah ResNeXt mengenai dimensi desain arsitektur jaringan saraf?",
        "options": [
            "Meningkatkan kardinalitas (jumlah jalur transformasi independen) lebih efektif mendongkrak akurasi representasi visual dibanding memperdalam atau memperlebar kanal pada kompleksitas FLOPs yang sama.",
            "Jalur skip connection identitas harus dihilangkan pada arsitektur multi-cabang.",
            "Konvolusi spasial 3x3 harus digantikan seluruhnya oleh konvolusi 1x1.",
            "Grouped convolution hanya dapat bekerja pada dataset citra beresolusi sangat kecil."
        ],
        "correctAnswerIndex": 0,
        "explanation": "Penelitian ResNeXt menunjukkan bahwa meningkatkan Kardinalitas (cardinality)—yaitu jumlah cabang agregasi fitur mandiri via grouped convolution—secara konsisten mengungguli strategi memperdalam lapisan atau memperlebar channel di bawah alokasi FLOPs yang sama."
    }
})

# ==============================================================================
# Subbab 8.8: DenseNet (2017): Feature Reuse Ekstrem dan Concatenation
# ==============================================================================
code_8_8 = r'''import numpy as np

# Simulasi Konektivitas DenseNet (Huang et al., 2017)
# x_l = H_l([x_0, x_1, ..., x_{l-1}])
# Growth rate k = 4 (setiap lapisan menghasilkan 4 kanal baru)
np.random.seed(42)

k = 4
H, W = 4, 4

# Input awal x0: 6 kanal fitur
x0 = np.random.randn(6, H, W).astype(np.float32)

# Lapisan 1: menerima x0 (6 kanal) -> menghasilkan 4 kanal baru
x1 = np.random.randn(k, H, W).astype(np.float32)

# Lapisan 2: menerima concatenation [x0, x1] (6 + 4 = 10 kanal) -> menghasilkan 4 kanal baru
cat_l2 = np.concatenate([x0, x1], axis=0)
x2 = np.random.randn(k, H, W).astype(np.float32)

# Lapisan 3: menerima concatenation [x0, x1, x2] (10 + 4 = 14 kanal) -> menghasilkan 4 kanal baru
cat_l3 = np.concatenate([x0, x1, x2], axis=0)
x3 = np.random.randn(k, H, W).astype(np.float32)

print("Konektivitas Ekstrem DenseNet (DenseBlock):")
print(f"Growth Rate (k)           : {k} kanal per lapisan")
print(f"Kanal Masukan Awal x0     : {x0.shape[0]} kanal")
print(f"Kanal Masukan Lapisan 2   : {cat_l2.shape[0]} kanal (Feature reuse dari x0, x1)")
print(f"Kanal Masukan Lapisan 3   : {cat_l3.shape[0]} kanal (Feature reuse dari x0, x1, x2)")
print(f"Total Koneksi pada Blok N=4 lapisan: {4 * (4 + 1) // 2} koneksi direct skip!")
'''

out_8_8 = run_code_capture_output(code_8_8)

subchapters.append({
    "id": "cv-8-8-densenet-feature-reuse",
    "title": "8.8 DenseNet (2017): Feature Reuse Ekstrem dan Concatenation Skip Connection",
    "content": r"""Dalam arsitektur ResNet, sinyal masukan dan keluaran residual digabungkan melalui operasi penjumlahan elemen demi elemen ($\mathbf{x} + \mathcal{F}(\mathbf{x})$). Meskipun efektif meloloskan gradien, operasi penjumlahan linier berpotensi menghalangi aliran informasi representasi fitur secara terpisah (*impeding information flow*). Untuk memaksimalkan penggunaan kembali fitur (*feature reuse*), Gao Huang, Zhuang Liu, Laurens van der Maaten, dan Kilian Q. Weinberger (2017) memperkenalkan **Densely Connected Convolutional Networks (DenseNet)**.

**Prinsip Konektivitas Padat (*Dense Connectivity*)**:
Dalam sebuah *DenseBlock*, setiap lapisan ke-$l$ menerima seluruh peta fitur keluaran dari **semua lapisan sebelumnya** sebagai masukannya melalui operasi penggabungan kanal (*channel concatenation* $[\dots]$):

$$\mathbf{x}_l = H_l([\mathbf{x}_0, \mathbf{x}_1, \dots, \mathbf{x}_{l-1}])$$

Jika sebuah blok memiliki $L$ lapisan, maka terdapat total $\frac{L(L+1)}{2}$ koneksi langsung antar lapisan.

Parameter paling mendasar dalam DenseNet adalah **Growth Rate ($k$)**:
Jika setiap fungsi transformasi $H_l$ menghasilkan $k$ buah peta fitur keluaran (misal $k = 12$ atau $k = 32$), maka lapisan ke-$l$ menerima sejumlah kanal masukan sebesar:

$$k_l = k_0 + k \times (l - 1)$$

di mana $k_0$ adalah jumlah kanal masukan awal blok.

**Keunggulan Utama DenseNet**:
1. **Penggunaan Kembali Fitur Ekstrem (*Substantial Feature Reuse*)**: Lapisan-lapisan akhir jaringan memiliki akses langsung terhadap fitur-fitur spasial frekuensi tinggi (tepi dan tekstur primitif) yang diekstraksi oleh lapisan pertama, tanpa perlu mempelajari representasi redundan secara berulang.
2. **Supervision Implisit Mendalam (*Deep Supervision*)**: Jalur koneksi langsung memungkinkan gradien dari fungsi rugi akhir mengalir seketika ke seluruh lapisan terdahulu, memberikan regularisasi alami yang kuat dan menangkal fenomena lenyapnya gradien pada dataset kecil.
3. **Efisiensi Parameter**: Karena fitur digunakan kembali secara kolektif, setiap lapisan hanya perlu mempelajari sedikit filter baru ($k = 32$), menghasilkan model yang sangat ramping dibanding arsitektur tradisional.

**Lapisan Transisi (*Transition Layers*)**:
Karena operasi penggabungan kanal mensyaratkan dimensi spasial $(H \times W)$ yang persis sama, pooling downsampling tidak dapat dilakukan di dalam DenseBlock. Sebagai gantinya, di antara dua DenseBlock disisipkan **Transition Layer** yang terdiri atas konvolusi $1 \times 1$ (dengan faktor kompresi kanal $\theta$, misal $\theta = 0.5$) dan Average Pooling $2 \times 2$.""",
    "codeSnippet": code_8_8,
    "expectedOutput": out_8_8,
    "commonPitfalls": [
        "Mencoba menggabungkan feature maps dengan resolusi spasial yang berbeda menggunakan `np.concatenate` atau `torch.cat` tanpa lapisan transisi downsampling.",
        "Mengabaikan konsumsi memori GPU (VRAM) yang tinggi saat melatih DenseNet standar tanpa optimasi *memory-efficient checkpointing*, karena operasi concatenation mempertahankan tensor aktivasi di memori.",
        "Menyetel growth rate $k$ terlalu besar ($k > 64$), yang menyebabkan ledakan jumlah channel pada lapisan-lapisan akhir blok."
    ],
    "quiz": {
        "question": "Apakah perbedaan fundamental mekanisme penggabungan fitur antara ResNet dan DenseNet?",
        "options": [
            "ResNet menggabungkan fitur via perkalian skalar, sedangkan DenseNet via pengurangan matriks.",
            "ResNet menggabungkan fitur via penjumlahan elemen demi elemen (element-wise addition), sedangkan DenseNet via penggabungan kanal (channel concatenation).",
            "ResNet hanya beroperasi pada citra grayscale, sedangkan DenseNet pada citra berwarna.",
            "DenseNet menghapus seluruh lapisan aktivasi ReLU."
        ],
        "correctAnswerIndex": 1,
        "explanation": "ResNet menggunakan penjumlahan element-wise ($y = \\mathcal{F}(x) + x$) yang mempertahankan jumlah kanal, sedangkan DenseNet menggabungkan seluruh aktivasi sebelumnya di sepanjang dimensi kedalaman kanal ($[x_0, x_1, \\dots, x_{l-1}]$), mendorong feature reuse secara masif."
    }
})

# ==============================================================================
# Subbab 8.9: MobileNetV1 & V2: Depthwise Separable & Inverted Residuals
# ==============================================================================
code_8_9 = r'''import numpy as np

# Perbandingan Komparatif: Standard Conv2D vs Depthwise Separable Conv (MobileNetV1)
# Input: HxW, C_in = 64, C_out = 128, Kernel K = 3
H, W, C_in, C_out = 14, 14, 64, 128
K = 3

# 1. Konvolusi 2D Standar:
flops_standard = H * W * (C_in * K * K * C_out)
params_standard = C_in * K * K * C_out

# 2. Depthwise Separable Convolution:
# Tahap 1: Depthwise Conv (1 filter spasial KxK per channel input)
flops_dw = H * W * (C_in * K * K * 1)
params_dw = C_in * K * K * 1

# Tahap 2: Pointwise Conv (Konvolusi 1x1 lintas channel)
flops_pw = H * W * (C_in * 1 * 1 * C_out)
params_pw = C_in * 1 * 1 * C_out

flops_dwise_sep = flops_dw + flops_pw
params_dwise_sep = params_dw + params_pw

rasio_teoretis = (1.0 / C_out) + (1.0 / (K * K))
rasio_aktual = flops_dwise_sep / flops_standard

print("Efisiensi Depthwise Separable Conv (Howard et al., MobileNetV1):")
print(f"1. Standard Conv2D (3x3)           : {params_standard:,} params | {flops_standard:,} FLOPs")
print(f"2. Depthwise Separable Conv (3x3)  : {params_dwise_sep:,} params | {flops_dwise_sep:,} FLOPs")
print(f"Rasio Teoretis (1/C_out + 1/K^2)   : {rasio_teoretis:.4f} (~{1/rasio_teoretis:.1f}x lebih hemat!)")
print(f"Rasio Pengurangan Komputasi Aktual : {rasio_aktual:.4f} (~{1/rasio_aktual:.1f}x lebih efisien)")
'''

out_8_9 = run_code_capture_output(code_8_9)

subchapters.append({
    "id": "cv-8-9-mobilenet-depthwise-separable",
    "title": "8.9 MobileNetV1 & V2: Depthwise Separable Convolution dan Inverted Residuals",
    "content": r"""Untuk mengimplementasikan visi komputer pada perangkat komputasi tepi (*edge devices*), *smartphones*, dan robotika otonom, arsitektur seperti VGG atau ResNet terlalu boros daya baterai dan memori. Andrew Howard et al. dari Google Research (2017) memperkenalkan **MobileNetV1** yang memfaktorkan konvolusi standar menjadi **Depthwise Separable Convolution**.

**Mekanisme Depthwise Separable Convolution**:
Operasi konvolusi standar menggabungkan pemfilteran spasial dan kombinasi kanal secara simultan dalam satu langkah. Depthwise Separable memecahnya menjadi dua operasi terpisah:
1. **Depthwise Convolution**: Menerapkan satu filter spasial $K \times K$ untuk setiap kanal masukan secara independen tanpa komunikasi antar kanal ($C_{\text{in}}$ filter berdimensi $K \times K \times 1$).
2. **Pointwise Convolution**: Menerapkan konvolusi $1 \times 1$ untuk menghitung kombinasi linier terpelajari dari seluruh kanal keluaran depthwise menuju $C_{\text{out}}$ kanal baru.

**Rasio Efisiensi Komputasi**:
Penghematan beban komputasi FLOPs dan parameter dirumuskan secara analitis sebagai:

$$\frac{\text{FLOPs}_{\text{Depthwise-Separable}}}{\text{FLOPs}_{\text{Standard}}} = \frac{H \cdot W \cdot (C_{\text{in}} \cdot K^2 + C_{\text{in}} \cdot C_{\text{out}})}{H \cdot W \cdot (C_{\text{in}} \cdot K^2 \cdot C_{\text{out}})} = \frac{1}{C_{\text{out}}} + \frac{1}{K^2}$$

Untuk kernel $3 \times 3$ ($K=3$) dan $C_{\text{out}} \ge 64$, operasi ini mereduksi biaya komputasi hingga **$8$ hingga $9$ kali lipat** dibanding konvolusi standar dengan penurunan akurasi yang sangat marginal.

**Inovasi MobileNetV2: Inverted Residuals & Linear Bottlenecks**:
Mark Sandler et al. (2018) memperbarui arsitektur ini melalui dua prinsip krusial:
- **Inverted Residuals**: ResNet konvensional menggunakan pola *Wide $\to$ Narrow $\to$ Wide* (bottleneck menyempit). Sebaliknya, MobileNetV2 menggunakan struktur terbalik: **Narrow $\to$ Wide $\to$ Narrow**. Tensor masukan berkanal sempit diekspansi sebesar faktor $t$ ($t=6$) ke ruang berdimensi tinggi melalui konvolusi $1 \times 1$, diproses spasial oleh Depthwise Conv $3 \times 3$, lalu dikompresi kembali ke kanal sempit melalui Pointwise Conv $1 \times 1$. Skip connection langsung menghubungkan sub-ruang kanal sempit tersebut.
- **Linear Bottlenecks**: Sandler et al. membuktikan bahwa menerapkan aktivasi non-linear ReLU pada sub-ruang kanal berdimensi rendah akan menghancurkan informasi representasi secara ireversibel (*manifold collapse*). Oleh karena itu, aktivasi ReLU dihilangkan pada lapisan proyeksi $1 \times 1$ terakhir di setiap blok (menggunakan fungsi linier murni).""",
    "codeSnippet": code_8_9,
    "expectedOutput": out_8_9,
    "commonPitfalls": [
        "Menerapkan fungsi aktivasi ReLU setelah lapisan pointwise bottleneck terakhir pada MobileNetV2, yang menghancurkan manifold representasi visual berdimensi rendah (*manifold destruction*).",
        "Mengasumsikan bahwa Depthwise Convolution berinteraksi antar kanal; depthwise murni hanya memproses relasi spasial per-kanal secara terisolasi.",
        "Mengabaikan bahwa pada perangkat komputasi non-teroptimasi, fragmentasi kernel depthwise separable kadang memiliki efisiensi pemanfaatan memori GPU yang lebih rendah dibanding satu kernel GEMM besar."
    ],
    "quiz": {
        "question": "Mengapa MobileNetV2 mempertahankan lapisan linier tanpa aktivasi non-linear (Linear Bottleneck) pada akhir setiap blok inverted residual?",
        "options": [
            "Karena aktivasi non-linear seperti ReLU akan memotong nilai negatif dan menghancurkan informasi pada representasi ruang berdimensi rendah (low-dimensional manifold collapse).",
            "Karena perangkat mobile tidak mendukung komputasi fungsi non-linear.",
            "Untuk membuat model setara dengan regresi linier murni.",
            "Agar gradien bernilai nol pada seluruh lapisan pelatihan."
        ],
        "correctAnswerIndex": 0,
        "explanation": "Penelitian Sandler et al. (2018) menunjukkan bahwa jika aktivasi ReLU diterapkan pada sub-ruang berdimensi rendah (low-dimensional bottleneck), manifold representasi akan runtuh (collapse) akibat pemotongan nilai negatif, sehingga lapisan proyeksi akhir harus dibiarkan linier."
    }
})

# ==============================================================================
# Subbab 8.10: ConvNeXt (2022): Memodernisasi CNN Mengadopsi Desain ViT
# ==============================================================================
code_8_10 = r'''import numpy as np

# Simulasi Desain Blok ConvNeXt (Liu et al., 2022)
# Urutan: Depthwise 7x7 -> LayerNorm -> Pointwise 1x1 (Expand 4x) -> GELU -> Pointwise 1x1 (Compress)
np.random.seed(42)

dim = 64
H, W = 7, 7
x = np.random.randn(dim, H, W).astype(np.float32)

# 1. Depthwise Conv dengan Kernel Besar (7x7, padding 3)
# Mengadopsi jendela reseptif besar mirip Multi-Head Self-Attention Swin Transformer
K = 7
# Simulasi respons depthwise spasial 7x7 terpad
dw_out = x * 0.95 + 0.05 * np.roll(x, shift=1, axis=(1, 2))

# 2. Layer Normalization (menggantikan Batch Normalization)
# Menormalkan lintas sumbu channel per posisi spasial
mean_ln = np.mean(dw_out, axis=0, keepdims=True)
var_ln = np.var(dw_out, axis=0, keepdims=True)
norm_out = (dw_out - mean_ln) / np.sqrt(var_ln + 1e-6)

# 3. Inverted Bottleneck 1x1: 64 -> 256 channel (Inverted MLP block ViT)
mlp_ratio = 4
dim_expanded = dim * mlp_ratio
# 4. Fungsi Aktivasi GeLU (menggantikan ReLU)
expanded = np.maximum(0, norm_out.repeat(mlp_ratio, axis=0) * 0.5) # Aproksimasi aktivasi
# 5. Pointwise 1x1 Projection kembali ke 64 kanal
proj_back = np.mean(expanded.reshape(dim, mlp_ratio, H, W), axis=1)

# Skip connection residual
y_convnext = x + proj_back

print("Simulasi Prinsip Desain Blok ConvNeXt (Liu et al., 2022):")
print(f"Tensor Masukan Spasial             : {x.shape}")
print(f"1. Ukuran Kernel Depthwise Spasial : {K}x{K} (Mengadopsi patch window Swin-T)")
print(f"2. Jenis Normalisasi               : LayerNorm (Lebih stabil dari BatchNorm)")
print(f"3. Rasio Inverted MLP Bottleneck   : {mlp_ratio}x ({dim} -> {dim_expanded} -> {dim})")
print(f"4. Fungsi Non-linearitas           : GeLU murni")
print(f"Tensor Keluaran Akhir              : {y_convnext.shape}")
print("Hasil: Menghidupkan kembali dominasi arsitektur murni konvolusional menandingi Vision Transformer!")
'''

out_8_10 = run_code_capture_output(code_8_10)

subchapters.append({
    "id": "cv-8-10-convnext-modernization",
    "title": "8.10 ConvNeXt (2022): Memodernisasi CNN Mengadopsi Desain Vision Transformer (ViT)",
    "content": r"""Dengan diperkenalkannya *Vision Transformer* (ViT; Dosovitskiy et al., 2020) dan *Swin Transformer* (Liu et al., 2021), komunitas visi komputer sempat menganggap bahwa lapisan konvolusional telah usang dan akan sepenuhnya digantikan oleh mekanisme *Self-Attention*. Menanggapi fenomena ini, Zhuang Liu et al. dari Meta AI Research dan UC Berkeley (2022) mengajukan pertanyaan ilmiah mendasar: *Apakah keunggulan ViT berasal dari mekanisme self-attention, ataukah berasal dari praktik desain arsitektur modern dan resep pelatihan kontemporer?*

Melalui investigasi empiris bertahap, Liu et al. memodernisasi arsitektur standar ResNet-50 langkah demi langkah menuju desain **ConvNeXt** murni berbasis konvolusi yang mampu menyaingi dan melampaui performa Swin Transformer di bawah metrik akurasi ImageNet, efisiensi FLOPs, dan throughput inferensi.

Trajektori modernisasi arsitektur ConvNeXt:
1. **Resep Pelatihan Modern (*Training Recipe Modernization*)**:
   Mengadopsi pelatihan 300 epoch dengan pengoptimal AdamW, augmentasi ekstensif (Mixup, CutMix, RandAugment), dan regularisasi *Stochastic Depth* serta *Label Smoothing*. Langkah ini saja mendongkrak performa ResNet-50 standar dari $76.1\%$ menjadi $78.8\%$.
2. **Penyelarasan Rasio Blok Spasial (*Macro Design*)**:
   Mengubah rasio jumlah blok pada 4 tahap resolusi dari $(3, 4, 6, 3)$ pada ResNet menjadi $(3, 3, 9, 3)$, menyelaraskannya dengan Swin-T. Selain itu, lapisan awal *stem* diganti dari konvolusi $7 \times 7$ ber-stride 2 dengan *patchifying layer* berupa konvolusi $4 \times 4$ ber-stride 4 tanpa overlap.
3. **ResNeXt-fication & Inverted Bottleneck Design**:
   Menerapkan *Depthwise Convolution* untuk memisahkan komputasi spasial dan kanal. Menata ulang urutan blok menyerupai blok Transformer MLP: menempatkan konvolusi depthwise di awal, diikuti oleh ekspansi kanal $4\times$ menggunakan konvolusi $1 \times 1$, aktivasi, dan kompresi kembali ke dimensi asal.
4. **Peningkatan Ukuran Kernel Spasial ($7 \times 7$)**:
   ViT memiliki receptive field global melalui mekanisme self-attention lokal/jendela. Untuk menirunya, ukuran kernel depthwise diperbesar dari $3 \times 3$ menjadi **$7 \times 7$**, secara signifikan memperluas *Effective Receptive Field* tanpa meningkatkan beban komputasi kanal.
5. **Penyederhanaan Mikro (*Micro Design*)**:
   - Mengganti fungsi aktivasi ReLU dengan **GELU (Gaussian Error Linear Unit)**.
   - Mengurangi jumlah fungsi aktivasi: hanya menggunakan satu aktivasi non-linear per blok (seperti pada modul MLP Transformer).
   - Mengganti *Batch Normalization* dengan **Layer Normalization (LN)**, mengeliminasi dependensi statistik antar-sampel mini-batch.""",
    "codeSnippet": code_8_10,
    "expectedOutput": out_8_10,
    "commonPitfalls": [
        "Mengira ConvNeXt menyertakan modul self-attention atau transformer; ConvNeXt adalah model konvolusional murni 100% tanpa matriks attention.",
        "Mengabaikan bahwa memperbesar kernel depthwise menjadi $7 \times 7$ hanya hemat komputasi jika diterapkan pada konvolusi depthwise (memperbesar kernel standar non-depthwise menjadi $7 \times 7$ akan memicu ledakan parameter kuadratis $C_{\text{in}} \times C_{\text{out}}$).",
        "Menerapkan Batch Normalization setelah Depthwise 7x7 pada ConvNeXt; ConvNeXt secara spesifik mengadopsi Layer Normalization untuk konsistensi spasial."
    ],
    "quiz": {
        "question": "Manakah modifikasi berikut yang TIDAK termasuk dalam proses modernisasi ResNet menjadi ConvNeXt menurut Liu et al. (2022)?",
        "options": [
            "Memperbesar ukuran kernel spasial depthwise dari 3x3 menjadi 7x7.",
            "Mengganti Batch Normalization dengan Layer Normalization.",
            "Menyisipkan modul Multi-Head Self-Attention pada lapisan intermediate.",
            "Menggunakan struktur Inverted Bottleneck di mana konvolusi depthwise ditempatkan di lapisan paling awal blok."
        ],
        "correctAnswerIndex": 2,
        "explanation": "ConvNeXt mempertahankan 100% operasi konvolusional standar tanpa menyisipkan modul Multi-Head Self-Attention. Keunggulannya dicapai murni melalui adopsi resep pelatihan modern, inverted bottleneck, kernel spasial depthwise 7x7, LayerNorm, dan GeLU."
    }
})

output_path = os.path.join(os.path.dirname(__file__), "cv_ch8_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 8 data with {len(subchapters)} subchapters: {output_path}")
