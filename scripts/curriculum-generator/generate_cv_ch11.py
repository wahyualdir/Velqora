# -*- coding: utf-8 -*-
"""
Generator untuk Bab 11: Segmentasi Semantik (FCN & U-Net) (10 Subbab)
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
# Subbab 11.1: Definisi Segmentasi Semantik
# ==============================================================================
code_11_1 = r'''import numpy as np

# Representasi Matriks Segmentasi Semantik dan One-Hot Encoding Tensor Spasial
# Citra mini: H=4, W=5, K=3 kelas (0: Background, 1: Jalan, 2: Mobil)

# 1. Mask label integer 2D Ground Truth
gt_mask_2d = np.array([
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 2, 2, 1, 1],
    [1, 2, 2, 1, 1]
], dtype=np.int32)

H, W = gt_mask_2d.shape
num_classes = 3

# 2. Konversi ke Tensor One-Hot 3D: (H, W, K)
one_hot_tensor = np.zeros((H, W, num_classes), dtype=np.float32)
for k in range(num_classes):
    one_hot_tensor[:, :, k] = (gt_mask_2d == k).astype(np.float32)

# 3. Analisis Distribusi Piksel per Kelas
pixel_counts = np.bincount(gt_mask_2d.flatten(), minlength=num_classes)
pixel_fractions = pixel_counts / (H * W)
class_names = ['Background', 'Jalan', 'Mobil']

print("Representasi Data Segmentasi Semantik:")
print(f"Dimensi Mask Label 2D : {gt_mask_2d.shape}")
print(f"Dimensi Tensor One-Hot: {one_hot_tensor.shape}")
print("Distribusi Frekuensi Piksel per Kelas:")
for idx, (name, count, frac) in enumerate(zip(class_names, pixel_counts, pixel_fractions)):
    print(f" Kelas {idx} ({name:<10}): {count:2d} piksel ({frac*100:5.1f}%)")
print(f"Integritas Probabilitas (Sum over K): {np.allclose(np.sum(one_hot_tensor, axis=-1), 1.0)}")
'''

out_11_1 = run_code_capture_output(code_11_1)

subchapters.append({
    "id": "cv-11-1-semantic-segmentation-definition",
    "title": "11.1 Definisi Segmentasi Semantik: Klasifikasi Piksel-Wise Tanpa Diferensiasi Instans",
    "content": r"""Dalam hierarki persepsi visual, **Segmentasi Semantik (*Semantic Segmentation*)** adalah tugas memetakan setiap piksel individu pada citra masukan ke dalam satu kategori kelas semantik yang telah ditentukan sebelumnya.

**1. Formulasi Matematis Pemetaan Spasial**:
Diberikan citra digital 2D $\mathbf{I} \in \mathbb{R}^{H \times W \times C}$ di mana $H$ adalah tinggi, $W$ adalah lebar, dan $C$ adalah jumlah kanal warna (misalnya 3 untuk RGB). Segmentasi semantik bertujuan mempelajari fungsi pemetaan non-linear $f_\theta$ yang memproyeksikan domain spasial $\Omega \subset \mathbb{Z}^2$ ke himpunan label diskrit $\mathcal{C} = \{1, 2, \dots, K\}$:

$$f_\theta: \mathbf{I}(x, y) \mapsto c \in \mathcal{C}, \quad \forall (x, y) \in \Omega$$

Secara komputasional, luaran model umumnya direpresentasikan sebagai **Tensor Distribusi Probabilitas Spasial** $\hat{\mathbf{P}} \in \mathbb{R}^{H \times W \times K}$, di mana $\hat{P}_{x, y, k}$ merefleksikan probabilitas posterior bahwa piksel pada koordinat $(x, y)$ termasuk dalam kategori kelas $k$, dengan konstrain normalisasi:

$$\sum_{k=1}^K \hat{P}_{x, y, k} = 1, \quad \forall (x, y) \in \Omega$$

**2. Karakteristik Inti: Agnostik terhadap Instans Objek**:
Ciri pembeda paling fundamental dari segmentasi semantik adalah **tidak adanya pemisahan instans individu (*instance-agnostic*)**:
- Jika terdapat tiga orang yang berdiri bersisian di dalam citra, segmentasi semantik akan menetapkan label semantik "Person" pada seluruh piksel milik ketiga orang tersebut secara homogen.
- Model tidak membedakan batas pemisah antara Orang A, Orang B, dan Orang C (diferensiasi batas instans ini merupakan domain spesifik dari *Instance Segmentation*).

**3. Spektrum Domain Aplikasi Industri**:
- **Kendaraan Otonom**: Mengklasifikasikan jalan beraspal (*drivable road*), trotoar pejalan kaki (*sidewalk*), garis marka, pembatas jalan, dan vegetasi.
- **Pencitraan Medis**: Mendelineasi batas jaringan tumor, organ paru-paru, atau lesi radiologi untuk perencanaan pembedahan dan terapi radiasi.
- **Penginderaan Jauh & Citra Satelit**: Memetakan tutupan lahan (*land cover*), deforestasi hutan, lahan basah, dan kepadatan kawasan urban secara otomatis.""",
    "codeSnippet": code_11_1,
    "expectedOutput": out_11_1,
    "commonPitfalls": [
        "Mencampuradukkan segmentasi semantik dengan segmentasi instans; segmentasi semantik tidak melacak identitas atau nomor instans objek individual.",
        "Mengabaikan konversi mask label integer menjadi format one-hot sebelum menghitung loss probabilitas multikelas pada modul deep learning."
    ],
    "quiz": {
        "question": "Jika dua mobil saling berdampingan dan menutupi sebagian wilayah dalam citra yang diproses oleh model segmentasi semantik, bagaimana model tersebut melabeli piksel-piksel kedua mobil tersebut?",
        "options": [
            "Memisahkan keduanya menjadi 'Mobil 1' dan 'Mobil 2' dengan mask berbeda warna.",
            "Melabeli seluruh piksel dari kedua mobil dengan satu label kelas semantik 'Mobil' yang sama tanpa membedakan batas antar instans.",
            "Menghapus mobil kedua karena dianggap sebagai duplikasi palsu.",
            "Menghasilkan bounding box mengelilingi kedua mobil."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Segmentasi semantik bersifat instance-agnostic; tujuannya hanya menentukan kategori semantik dari tiap piksel, bukan membedakan identitas atau memisahkan objek-objek individual dari kelas yang sama."
    }
})

# ==============================================================================
# Subbab 11.2: Fully Convolutional Networks (FCN)
# ==============================================================================
code_11_2 = r'''import numpy as np

# Simulasi Transformasi Lapisan Fully Connected (FC) menjadi Konvolusi 1x1 (FCN)
# Ekuivalensi Bobot: Lapisan FC (C_in -> C_out) ekuivalen dengan Conv 1x1 (1, 1, C_in, C_out)

C_in = 4
C_out = 2
H_feat, W_feat = 3, 3

# Inisialisasi bobot dan bias deterministik
np.random.seed(42)
W_fc = np.random.randn(C_in, C_out).astype(np.float32)
b_fc = np.random.randn(C_out).astype(np.float32)

# Bentuk bobot konvolusi 1x1 dari bobot FC
W_conv = W_fc.reshape(1, 1, C_in, C_out)

# Buat feature map masukan spasial berukuran (H, W, C_in)
feat_map = np.random.randn(H_feat, W_feat, C_in).astype(np.float32)

# Pendekatan 1: Forward Pass Konvolusi 1x1 secara Spasial
conv_out = np.zeros((H_feat, W_feat, C_out), dtype=np.float32)
for r in range(H_feat):
    for c in range(W_feat):
        # dot product vektor kanal (C_in) dengan bobot (C_in, C_out)
        conv_out[r, c] = np.dot(feat_map[r, c], W_fc) + b_fc

# Pendekatan 2: Perataan Vektor (FC Klasik pada piksel tertentu, misal r=1, c=2)
fc_pixel_val = np.dot(feat_map[1, 2], W_fc) + b_fc

print("Ekuivalensi Matematis Konvolusi 1x1 (FCN Long et al. 2015):")
print(f"Dimensi Feature Map Masukan: {feat_map.shape}")
print(f"Dimensi Tensor Output 1x1   : {conv_out.shape}")
print(f"Nilai Output Piksel (1, 2) via Conv 1x1: {conv_out[1, 2].round(4).tolist()}")
print(f"Nilai Output Piksel (1, 2) via Lapisan FC: {fc_pixel_val.round(4).tolist()}")
print(f"Selisih Maksimum Absolut: {np.max(np.abs(conv_out[1, 2] - fc_pixel_val)):.2e}")
'''

out_11_2 = run_code_capture_output(code_11_2)

subchapters.append({
    "id": "cv-11-2-fully-convolutional-networks-fcn",
    "title": "11.2 Fully Convolutional Networks (Long et al. 2015): Penggantian Fully-Connected dengan Konvolusi 1x1",
    "content": r"""Hingga tahun 2015, arsitektur CNN populer (seperti AlexNet dan VGG) dirancang eksklusif untuk klasifikasi citra global. Model-model tersebut memiliki kelemahan arsitektur fatal saat diterapkan pada segmentasi piksel: **adanya lapisan Fully Connected (FC) berdimensi kaku di ujung jaringan**.

Lapisan FC menuntut ukuran vektor masukan tetap ($H_{\text{in}} \times W_{\text{in}} = \text{konstan}$), meratakan (*flattening*) representasi 2D spasial menjadi vektor 1D tanpa informasi geometri posisi.

**1. Transformasi Konvolusional (*Convolutionalizing*)**:
Jonathan Long, Evan Shelhamer, dan Trevor Darrell (2015) memperkenalkan paradigma **Fully Convolutional Networks (FCN)**. Terobosan utamanya adalah mereinterpretasikan lapisan FC berukuran $C_{\text{in}} \times C_{\text{out}}$ sebagai lapisan konvolusi dengan kernel berdimensi spasial $1 \times 1$:

$$\mathbf{W}_{\text{conv}} \in \mathbb{R}^{1 \times 1 \times C_{\text{in}} \times C_{\text{out}}} \cong \mathbf{W}_{\text{fc}} \in \mathbb{R}^{C_{\text{in}} \times C_{\text{out}}}$$

Komputasi konvolusi $1 \times 1$ pada setiap lokasi spasial $(i, j)$ didefinisikan sebagai kombinasi linier sepanjang sumbu kanal:

$$\mathbf{O}_{i,j,k} = \sum_{c=1}^{C_{\text{in}}} \mathbf{X}_{i,j,c} \mathbf{W}_{1,1,c,k} + b_k$$

**2. Keunggulan Revolusioner FCN**:
- **Ukuran Citra Fleksibel**: Karena seluruh lapisan terdiri dari konvolusi dan *pooling* murni, FCN dapat menerima citra masukan dengan dimensi tinggi dan lebar sembarang tanpa memerlukan proses *resizing* atau pemotongan distorsif.
- **Efisiensi Komputasi Spasial (*Dense Computation*)**: Alih-alih mengevaluasi jendela citra (*sliding window patch*) secara berulang yang sangat boros komputasi, FCN memproses seluruh piksel citra secara paralel dalam satu *forward pass* terpadu.
- **Peta Spasial Kelas (*Class Heatmaps*)**: Lapisan konvolusi $1 \times 1$ terakhir menghasilkan peta fitur 2D berdimensi $H' \times W' \times K$, di mana tiap kanal $k$ mewakili respon intensitas aktivasi untuk kelas target $k$ pada resolusi yang tereduksi.""",
    "codeSnippet": code_11_2,
    "expectedOutput": out_11_2,
    "commonPitfalls": [
        "Mengira bahwa konvolusi 1x1 mengubah resolusi spasial (tinggi dan lebar) feature map; konvolusi 1x1 hanya mengubah kedalaman kanal tanpa mempengaruhi ukuran spasial.",
        "Mengabaikan bahwa luaran konvolusi 1x1 pada backbone VGG masih beresolusi kasar ($32\\times$ lebih kecil dari citra asli) sehingga memerlukan tahap upsampling."
    ],
    "quiz": {
        "question": "Apa manfaat arsitektural utama dari penggantian lapisan Fully Connected dengan lapisan konvolusi 1x1 pada FCN?",
        "options": [
            "Membuat jaringan hanya mampu memproses citra berukuran 224x224 piksel.",
            "Memungkinkan jaringan memproses citra dengan ukuran spasial sembarang dan mempertahankan topologi spasial 2D untuk prediksi piksel-demi-piksel.",
            "Menghilangkan kebutuhan akan fungsi aktivasi non-linear seperti ReLU.",
            "Mengurangi akurasi model agar inferensi berjalan lebih cepat."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Lapisan konvolusi 1x1 bekerja secara independen pada setiap posisi spasial, sehingga jaringan dapat menerima ukuran citra sembarang dan menghasilkan peta luaran 2D yang mempertahankan keteraturan spasial citra masukan."
    }
})

# ==============================================================================
# Subbab 11.3: Transposed Convolution
# ==============================================================================
code_11_3 = r'''import numpy as np

# Implementasi Transposed Convolution 2D Mandiri (Learnable Upsampling)
# Input: (H_in, W_in) -> Stride s -> Output: (H_out, W_out)
# H_out = (H_in - 1) * s - 2*p + k

def transposed_conv2d_pure(input_mat, kernel, stride=2, padding=0):
    H_in, W_in = input_mat.shape
    k_h, k_w = kernel.shape
    
    # 1. Sisipkan nol antar elemen input (fractionally strided)
    H_up = (H_in - 1) * stride + 1
    W_up = (W_in - 1) * stride + 1
    upsampled = np.zeros((H_up, W_up), dtype=np.float32)
    upsampled[::stride, ::stride] = input_mat
    
    # 2. Tambahkan padding pada matriks upsampled jika diperlukan
    # Pada transposed conv, padding mengurangi ukuran output (p_out = k - p - 1)
    # Di sini kita simulasikan operasi konvolusi penuh (full convolution)
    H_out = H_up + k_h - 1 - 2 * padding
    W_out = W_up + k_w - 1 - 2 * padding
    out = np.zeros((H_out, W_out), dtype=np.float32)
    
    # Akumulasikan perkalian kernel pada grid luaran
    for r in range(H_in):
        for c in range(W_in):
            val = input_mat[r, c]
            out_r = r * stride
            out_c = c * stride
            out[out_r:out_r+k_h, out_c:out_c+k_w] += val * kernel
            
    return out

# Uji pada matriks fitur kecil 2x2 dengan kernel 3x3, stride=2
feat_2x2 = np.array([[1.0, 2.0],
                     [3.0, 4.0]], dtype=np.float32)

kernel_3x3 = np.array([[0.5, 1.0, 0.5],
                       [1.0, 2.0, 1.0],
                       [0.5, 1.0, 0.5]], dtype=np.float32)

trans_out = transposed_conv2d_pure(feat_2x2, kernel_3x3, stride=2, padding=0)

print("Eksperimen Transposed Convolution (Deconvolution):")
print(f"Ukuran Input  : {feat_2x2.shape}")
print(f"Ukuran Kernel : {kernel_3x3.shape} | Stride: 2")
print(f"Ukuran Luaran : {trans_out.shape} (Ekspansi Spasial Berhasil)")
print(f"Matriks Luaran:\n{trans_out.round(2)}")
'''

out_11_3 = run_code_capture_output(code_11_3)

subchapters.append({
    "id": "cv-11-3-transposed-convolution-upsampling",
    "title": "11.3 Transposed Convolution: Upsampling Learnable & Konvolusi Terbalik",
    "content": r"""Setelah melalui serangkaian lapisan konvolusi ber-*stride* dan *max pooling*, resolusi spasial *feature map* pada *backbone* CNN berkurang secara drastis (misalnya menyusut $32\times$ dari $512 \times 512$ menjadi $16 \times 16$). Untuk memetakan representasi semantik abstrak ini kembali ke resolusi citra asli guna klasifikasi per-piksel, diperlukan mekanisme **peningkatan resolusi spasial (*upsampling*)**.

**1. Konsep Transposed Convolution**:
Sering kali secara keliru disebut sebagai *deconvolution* atau *fractionally strided convolution*, **Transposed Convolution** adalah operasi transformasi linier yang memetakan fitur beresolusi rendah ke resolusi yang lebih tinggi dengan parameter bobot kernel yang dapat dioptimalkan (*learnable weights*) melalui *backpropagation*.

Secara aljabar linier, operasi konvolusi maju standar ber-*stride* dapat diformulasikan sebagai perkalian matriks jarang (*sparse matrix*):

$$\mathbf{y} = \mathbf{C} \mathbf{x}$$

Di mana $\mathbf{C}$ adalah matriks representasi filter konvolusi. Operasi *transposed convolution* mengalikan vektor input dengan transposisi dari matriks tersebut:

$$\mathbf{z} = \mathbf{C}^T \mathbf{y}$$

Perhatikan bahwa meskipun pola konektivitas spasialnya terbalik (dari dimensi kecil ke besar), $\mathbf{C}^T$ bukanlah invers matematis dari $\mathbf{C}$ ($\mathbf{C}^T \mathbf{C} \ne \mathbf{I}$).

**2. Relasi Dimensi Spasial**:
Dimensi spasial keluaran dari operasi transposed convolution dengan ukuran kernel $k$, *stride* $s$, dan *padding* $p$ diberikan oleh persamaan:

$$H_{\text{out}} = (H_{\text{in}} - 1) \times s - 2p + k + p_{\text{out}}$$

**3. Fenomena Artefak Papan Catur (*Checkerboard Artifacts*)**:
Salah satu kelemahan teknis dari transposed convolution 2D adalah kemunculan pola garis-garis kotak berulang (*checkerboard artifacts*). Hal ini terjadi ketika ukuran kernel $k$ tidak habis dibagi oleh *stride* $s$, sehingga terjadi penumpukan tumpang tindih (*overlap*) bobot yang tidak merata di beberapa wilayah piksel keluaran. Solusi alternatif yang populer adalah menggabungkan interpolasi *bilinear upsampling* non-parametrik yang diikuti oleh konvolusi standar $3 \times 3$ ber-*stride* 1.""",
    "codeSnippet": code_11_3,
    "expectedOutput": out_11_3,
    "commonPitfalls": [
        "Menyebut transposed convolution sebagai 'deconvolution' matematis; deconvolution sejati adalah inversi sinyal, sedangkan transposed convolution hanyalah perkalian matriks transpos.",
        "Mengabaikan fenomena checkerboard artifacts saat memilih kombinasi ukuran kernel dan stride; gunakan kernel berukuran genap jika stride bernilai 2 (misal kernel 4x4 stride 2) untuk meredam artefak."
    ],
    "quiz": {
        "question": "Jika sebuah feature map berukuran 8x8 piksel diproses menggunakan transposed convolution dengan kernel 4x4, stride 2, dan padding 1, berapakah dimensi spasial matriks keluarannya?",
        "options": [
            "4 x 4 piksel",
            "16 x 16 piksel",
            "32 x 32 piksel",
            "8 x 8 piksel"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Menggunakan formula H_out = (H_in - 1)*s - 2p + k = (8 - 1)*2 - 2(1) + 4 = 14 - 2 + 4 = 16 piksel."
    }
})

# ==============================================================================
# Subbab 11.4: Skip Connections FCN-32s/16s/8s
# ==============================================================================
code_11_4 = r'''import numpy as np

# Simulasi Fusi Multi-Skala FCN: FCN-32s vs FCN-16s vs FCN-8s
# Memadukan fitur semantik abstrak (lapisan dalam) dengan detail spasial (lapisan dangkal)

def bilinear_upsample_2x(tensor_2d):
    H, W = tensor_2d.shape
    # Upsampling sederhana via ekspansi tetangga 2x2
    out = np.repeat(np.repeat(tensor_2d, 2, axis=0), 2, axis=1)
    return out

# Representasi fitur dari kedalaman jaringan VGG:
# Pool 3 (Stride 8): Detail tepi tajam, semantik rendah (dimensi 4x4)
# Pool 4 (Stride 16): Detail menengah, semantik menengah (dimensi 2x2)
# Pool 5 (Stride 32): Semantik tinggi, detail spasial hilang (dimensi 1x1)

np.random.seed(10)
pool3_feat = np.array([
    [1, 2, 8, 9],
    [2, 3, 7, 8],
    [1, 1, 6, 7],
    [0, 1, 5, 6]
], dtype=np.float32)

pool4_feat = np.array([
    [2.0, 8.0],
    [1.0, 6.0]
], dtype=np.float32)

pool5_feat = np.array([[5.0]], dtype=np.float32)

# FCN-32s: Upsample langsung dari Pool 5 sebesar 4x
fcn_32s = np.repeat(np.repeat(pool5_feat, 4, axis=0), 4, axis=1)

# FCN-16s: Upsample Pool 5 sebesar 2x, gabungkan dengan Pool 4, lalu upsample 2x
p5_up2 = bilinear_upsample_2x(pool5_feat)
fused_16 = p5_up2 + pool4_feat
fcn_16s = bilinear_upsample_2x(fused_16)

# FCN-8s: Upsample Fused-16 sebesar 2x, gabungkan dengan Pool 3
fused_8 = bilinear_upsample_2x(fused_16) + pool3_feat
fcn_8s = fused_8  # Resolusi 4x4 penuh

print("Perbandingan Presisi Rekonstruksi FCN Multi-Skala:")
print(f"FCN-32s (Coarse/Rata) Variansi Spasial: {np.var(fcn_32s):.2f} (Nilai homogen)")
print(f"FCN-16s (Intermediate) Variansi Spasial: {np.var(fcn_16s):.2f}")
print(f"FCN-8s  (Fine/Tajam)  Variansi Spasial: {np.var(fcn_8s):.2f} (Batas tepi terjaga)")
print(f"FCN-8s Hasil Fusi Fitur:\n{fcn_8s.round(1)}")
'''

out_11_4 = run_code_capture_output(code_11_4)

subchapters.append({
    "id": "cv-11-4-fcn-skip-connections",
    "title": "11.4 Skip Connections FCN-32s/16s/8s: Fusi Prediksi Coarse dan Fine",
    "content": r"""Model awal FCN (dikenal sebagai **FCN-32s**) melakukan *upsampling* langsung sebesar $32\times$ dari lapisan konvolusi terakhir (pool5) ke resolusi citra masukan. Meskipun mampu mengenali kategori objek secara global, hasil segmentasinya tampak sangat kasar, tumpul (*blobby*), dan kehilangan batas tepi geometris yang tajam.

Untuk memecahkan dilema antara abstraksi semantik (*what*) dan resolusi spasial (*where*), Long et al. memperkenalkan arsitektur **Skip Connections** bertingkat yang melahirkan varian FCN-16s dan FCN-8s.

**1. Hierarki Fusi Fitur Multi-Skala**:
- **FCN-32s (Single-Stream Baseline)**: Mengambil feature map conv7 (stride 32), menerapkan konvolusi $1 \times 1$ untuk proyeksi kelas, lalu melakukan transposed convolution tunggal dengan stride $32\times$.
- **FCN-16s (2-Stream Fusion)**:
  1. Prediksi dari pool5 di-upsample $2\times$ menggunakan transposed convolution ber-stride 2.
  2. Lapisan pool4 (stride 16) dialirkan melalui konvolusi $1 \times 1$ untuk menyamakan jumlah kanal kelas.
  3. Kedua feature map dijumlahkan secara elemen per elemen (*element-wise addition*):

$$\mathbf{M}_{16} = \mathcal{U}_2(\mathbf{P}_5) + \mathbf{P}_4$$

  4. Hasil fusi $\mathbf{M}_{16}$ di-upsample sebesar $16\times$ menuju resolusi citra penuh: $\hat{\mathbf{Y}}_{16} = \mathcal{U}_{16}(\mathbf{M}_{16})$.
- **FCN-8s (3-Stream Fusion)**:
  1. Hasil fusi $\mathbf{M}_{16}$ di-upsample kembali sebesar $2\times$.
  2. Lapisan pool3 (stride 8) diproyeksikan dan dijumlahkan:

$$\mathbf{M}_8 = \mathcal{U}_2(\mathbf{M}_{16}) + \mathbf{P}_3$$

  3. Hasil fusi akhir $\mathbf{M}_8$ di-upsample sebesar $8\times$ menuju citra penuh: $\hat{\mathbf{Y}}_8 = \mathcal{U}_8(\mathbf{M}_8)$.

**2. Dampak Visual dan Kuantitatif**:
FCN-8s memulihkan detail batas spasial resolusi tinggi yang sebelumnya hilang di lapisan dalam jaringan. Pada benchmark PASCAL VOC 2011, FCN-8s mendongkrak skor Mean IoU dari $59.4\%$ (FCN-32s) menjadi $62.7\%$ (FCN-8s), menetapkan standar baru bahwa penggabungan representasi dangkal dan dalam adalah esensial untuk segmentasi presisi tinggi.""",
    "codeSnippet": code_11_4,
    "expectedOutput": out_11_4,
    "commonPitfalls": [
        "Menjumlahkan feature map pool5 dan pool4 tanpa menyelaraskan dimensi spasial dan jumlah kanal terlebih dahulu.",
        "Mengasumsikan FCN-8s memerlukan parameter komputasi 4x lipat lebih besar; penambahan parameter hanya berasal dari konvolusi 1x1 penskala kanal tambahan yang sangat efisien."
    ],
    "quiz": {
        "question": "Mengapa varian arsitektur FCN-8s menghasilkan batas delineasi objek yang jauh lebih tajam dibandingkan FCN-32s?",
        "options": [
            "Karena FCN-8s dilatih menggunakan dataset yang 8 kali lebih besar.",
            "Karena FCN-8s menggabungkan fitur beresolusi tinggi dari lapisan dangkal (pool3) dengan fitur semantik dalam dari pool4 dan pool5 melalui skip connections.",
            "Karena FCN-8s tidak menggunakan lapisan konvolusi.",
            "Karena FCN-8s membuang seluruh fitur dari lapisan pool5."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Skip connections pada FCN-8s menyalurkan informasi spasial resolusi tinggi dari lapisan pool3 (stride 8) ke decoder, mempertahankan detail batas piksel yang sebelumnya terdegradasi pada lapisan dalam."
    }
})

# ==============================================================================
# Subbab 11.5: Arsitektur Encoder-Decoder Simetris
# ==============================================================================
code_11_5 = r'''import numpy as np

# Simulasi Pipeline Modular Arsitektur Encoder-Decoder Simetris
# Menelusuri Dimensi Spasial dan Kanal pada Setiap Tingkatan Hierarki

class SymmetricEncoderDecoderSimulator:
    def __init__(self, input_shape=(1, 128, 128, 3), num_classes=5):
        self.input_shape = input_shape
        self.num_classes = num_classes
        
    def trace_architecture(self):
        B, H, W, C = self.input_shape
        trace = []
        trace.append(('Input Image', (H, W, C)))
        
        # --- ENCODER PATH (Downsampling) ---
        # Tahap 1: Conv -> Pool (H/2, W/2, 32)
        e1 = (H // 2, W // 2, 32)
        trace.append(('Encoder Stage 1 (Pool 2x)', e1))
        
        # Tahap 2: Conv -> Pool (H/4, W/4, 64)
        e2 = (e1[0] // 2, e1[1] // 2, 64)
        trace.append(('Encoder Stage 2 (Pool 2x)', e2))
        
        # Tahap 3: Conv -> Pool (H/8, W/8, 128) - Bottleneck
        e3 = (e2[0] // 2, e2[1] // 2, 128)
        trace.append(('Bottleneck Latent (Pool 2x)', e3))
        
        # --- DECODER PATH (Upsampling) ---
        # Tahap 1: UpConv -> (H/4, W/4, 64)
        d1 = (e3[0] * 2, e3[1] * 2, 64)
        trace.append(('Decoder Stage 1 (UpConv 2x)', d1))
        
        # Tahap 2: UpConv -> (H/2, W/2, 32)
        d2 = (d1[0] * 2, d1[1] * 2, 32)
        trace.append(('Decoder Stage 2 (UpConv 2x)', d2))
        
        # Tahap 3: UpConv -> (H, W, 16) -> Conv 1x1 (Classes)
        d3 = (d2[0] * 2, d2[1] * 2, self.num_classes)
        trace.append(('Final Output Mask (1x1 Conv)', d3))
        
        return trace

sim = SymmetricEncoderDecoderSimulator()
pipeline_trace = sim.trace_architecture()

print("Penelusuran Dimensi Arsitektur Encoder-Decoder:")
for name, shape in pipeline_trace:
    print(f" -> {name:<30}: Resolusi Spasial {shape[0]:3d}x{shape[1]:3d} | Kanal: {shape[2]:3d}")
'''

out_11_5 = run_code_capture_output(code_11_5)

subchapters.append({
    "id": "cv-11-5-encoder-decoder-architecture",
    "title": "11.5 Arsitektur Encoder-Decoder Simetris",
    "content": r"""Paradigma **Encoder-Decoder Simetris** telah menjadi fondasi arsitektur kanonikal untuk pemodelan segmentasi citra padat (*dense prediction*).

**1. Jalur Kontraksi (Encoder)**:
Encoder bertindak sebagai pengekstraksi fitur hierarkis (*feature extractor*). Melalui penerapan berulang dari lapisan konvolusi, aktivasi non-linear, dan operasi *spatial pooling* atau konvolusi ber-*stride*, dimensi spasial direduksi secara progresif ($H \to H/2 \to H/4 \dots$):
- Mengurangi kompleksitas memori komputasi pada lapisan dalam.
- Memperluas bidang reseptif (*receptive field*) secara eksponensial, memungkinkan neuron mengagregasi konteks semantik makro dari seluruh bagian citra (*what is in the image*).
- Bagian terdalam dengan resolusi spasial terkecil disebut **Bottleneck (Latent Space)** $\mathbf{z} \in \mathbb{R}^{\frac{H}{2^L} \times \frac{W}{2^L} \times C_L}$.

**2. Jalur Ekspansi (Decoder)**:
Decoder bertugas merekonstruksi rincian spasial dari representasi laten yang terkompresi menuju ukuran citra asli ($H_{\text{in}} \times W_{\text{in}}$). Melalui serangkaian lapisan *transposed convolution* atau *bilinear upsampling* simetris, decoder memetakan fitur semantik kembali ke koordinat piksel (*where the object is located*).

**3. Arsitektur Bersejarah Penting**:
- **SegNet (Badrinarayanan et al. 2017)**: Memperkenalkan mekanisme *Pooling Indices*. Alih-alih menyalin seluruh feature map encoder, SegNet hanya menyimpan indeks posisi koordinat argmax saat *max pooling*, lalu menggunakan indeks tersebut untuk menempatkan kembali aktivasi pada tahap *unpooling* decoder. Pendekatan ini sangat hemat memori pada perangkat *embedded*.
- **DeconvNet (Noh et al. 2015)**: Menyusun decoder simetris penuh berlapis konvolusi terbalik dengan kapasitas parameter besar.
- **ENet (Paszke et al. 2016)**: Mengoptimalkan desain encoder-decoder asimetris untuk segmentasi waktu-nyata berkecepatan tinggi pada perangkat keras komputasi bergerak.""",
    "codeSnippet": code_11_5,
    "expectedOutput": out_11_5,
    "commonPitfalls": [
        "Merancang decoder yang terlalu dangkal dibandingkan encoder; asimetri ekstrem dapat membatasi kapasitas rekonstruksi batas spasial objek.",
        "Lupa menyamakan resolusi spasial keluaran akhir dengan dimensi citra masukan asli, menyebabkan kesalahan penyesuaian dimensi pada evaluasi loss."
    ],
    "quiz": {
        "question": "Bagaimana model SegNet menghemat penggunaan memori GPU pada tahap upsampling decoder dibanding model FCN standar?",
        "options": [
            "Dengan mengonversi seluruh citra ke format biner hitam-putih.",
            "Dengan hanya menyimpan dan mentransfer 'pooling indices' (lokasi piksel argmax saat max pooling) ke decoder alih-alih menyalin seluruh feature map beresolusi tinggi.",
            "Dengan menghapus seluruh lapisan aktivasi ReLU.",
            "Dengan menjalankan evaluasi pada CPU secara bertahap."
        ],
        "correctAnswerIndex": 1,
        "explanation": "SegNet hanya merekam lokasi indeks piksel maksimum yang terpilih saat max pooling di encoder. Informasi ringkas ini digunakan oleh decoder untuk unpooling tanpa perlu mentransfer tensor fitur lengkap yang memakan memori."
    }
})

# ==============================================================================
# Subbab 11.6: U-Net (Ronneberger et al. 2015)
# ==============================================================================
code_11_6 = r'''import numpy as np

# Simulasi Blok U-Net dengan Concatenation Skip Connections (Ronneberger et al. 2015)
# Level Hierarki: Encoder -> Bottleneck -> Decoder (dengan concate skip features)

def unet_block_forward_simulation():
    # Asumsikan input batch 1 citra fitur
    # 1. Level 1 Encoder
    enc_feat = np.ones((1, 16, 16, 64), dtype=np.float32) * 2.0
    
    # Max pooling 2x2 ke Bottleneck
    bottleneck_feat = np.ones((1, 8, 8, 128), dtype=np.float32) * 5.0
    
    # 2. Decoder UpConv 2x2
    # Upsampling spasial 8x8 -> 16x16, reduksi kanal 128 -> 64
    upconv_feat = np.repeat(np.repeat(bottleneck_feat, 2, axis=1), 2, axis=2)[:, :, :, :64] * 0.5
    
    # 3. Concatenation Skip Connection sepanjang sumbu kanal (axis=-1)
    # Gabungkan enc_feat (16, 16, 64) dengan upconv_feat (16, 16, 64)
    concat_feat = np.concatenate([enc_feat, upconv_feat], axis=-1)
    
    # 4. Konvolusi Fusi Pasca-Konkatenasi (128 kanal -> 64 kanal)
    # Mensimulasikan konvolusi 3x3 dengan reduksi kanal rata-rata
    fused_feat = np.mean(concat_feat, axis=-1, keepdims=True)
    
    return enc_feat.shape, bottleneck_feat.shape, upconv_feat.shape, concat_feat.shape, fused_feat.shape

s_enc, s_bot, s_up, s_cat, s_fuse = unet_block_forward_simulation()

print("Simulasi Mekanisme Concatenation Skip Connection U-Net:")
print(f"Fitur Encoder Level 1   : {s_enc} (Disimpan untuk Skip)")
print(f"Fitur Bottleneck Laten  : {s_bot}")
print(f"Fitur Decoder UpConv 2x : {s_up}")
print(f"Hasil Concatenasi Kanal : {s_cat} (64 enc + 64 dec = 128 kanal)")
print(f"Fitur Pasca-Konvolusi   : {s_fuse}")
'''

out_11_6 = run_code_capture_output(code_11_6)

subchapters.append({
    "id": "cv-11-6-unet-biomedical-segmentation",
    "title": "11.6 U-Net (Ronneberger et al. 2015): Skip Connection Concatenation per Level Resolusi untuk Data Biomedis Terbatas",
    "content": r"""Dipublikasikan oleh Olaf Ronneberger, Philipp Fischer, dan Thomas Brox (2015) pada konferensi MICCAI, **U-Net** adalah salah satu arsitektur paling berpengaruh dalam visi komputer modern, yang awalnya dirancang untuk segmentasi citra mikroskopis sel biomedis dengan ketersediaan sampel anotasi yang sangat terbatas.

**1. Struktur Morfologi Bentuk 'U'**:
Jaringan terdiri dari dua jalur simetris:
- **Contracting Path (Kiri)**: Berfungsi sebagai encoder konvolusional standar. Mengaplikasikan konvolusi berulang $3 \times 3$, aktivasi ReLU, dan *max pooling* $2 \times 2$ (stride 2) untuk mereduksi resolusi spasial dan menggandakan jumlah kanal fitur pada setiap tahapan.
- **Expansive Path (Kanan)**: Berfungsi sebagai decoder. Pada setiap langkah, feature map di-upsample menggunakan konvolusi $2 \times 2$ (*up-convolution*) yang membagi separuh jumlah kanal fitur.

**2. Concatenation Skip Connection (Inovasi Kunci)**:
Perbedaan arsitektur paling radikal antara U-Net dan FCN adalah cara penggabungan fitur:
- FCN menggunakan operasi penjumlahan elemen (*element-wise addition*).
- U-Net menggunakan **Konkatenasi Kanal Langsung (*Channel-Wise Concatenation*)**:

$$\mathbf{F}_{\text{dec}}^l = \left[ \mathcal{U}(\mathbf{F}_{\text{dec}}^{l+1}) \; ; \; \mathcal{C}(\mathbf{F}_{\text{enc}}^l) \right] \in \mathbb{R}^{H_l \times W_l \times (C_{\text{dec}} + C_{\text{enc}})}$$

Di mana $\mathcal{C}$ adalah operasi penyesuaian spasial (*cropping* pada U-Net asli tanpa padding, atau *identity* pada implementasi modern dengan padding).

Fitur resolusi tinggi dari contracting path digabungkan secara utuh dengan fitur hasil upsampling. Hal ini memberikan decoder akses langsung ke representasi detail tekstur dan batas spasial tanpa distorsi, memungkinkan jaringan melokalisasi batas sel dengan presisi piksel yang luar biasa tajam meskipun dilatih hanya pada puluhan citra biomedis.

**3. Strategi Overlap-Tile**:
Untuk menyegmentasikan citra medis berukuran raksasa yang melampaui kapasitas memori GPU, U-Net menerapkan *overlap-tile strategy*: memprediksi wilayah citra dalam jendela bergeser (*tiles*), di mana piksel batas diekstrapolasi menggunakan cerminan (*mirroring*) untuk mempertahankan konteks.""",
    "codeSnippet": code_11_6,
    "expectedOutput": out_11_6,
    "commonPitfalls": [
        "Mencampuradukkan operasi concatenation (penumpukan kanal sepanjang axis=-1) dengan operasi addition (penjumlahan elemen); concatenation menggandakan kedalaman kanal sedangkan addition tidak.",
        "Mengabaikan penyesuaian dimensi spasial saat melakukan konkatenasi jika encoder menggunakan konvolusi tanpa padding (valid padding)."
    ],
    "quiz": {
        "question": "Bagaimana cara U-Net menggabungkan fitur dari contracting path (encoder) ke expanding path (decoder) pada tingkat resolusi yang sama?",
        "options": [
            "Melalui perkalian dot-product skalar.",
            "Melalui konkatenasi langsung sepanjang dimensi kanal (channel-wise concatenation).",
            "Dengan merata-ratakan nilai kedua matriks fitur.",
            "Melalui pengurangan nilai aktivasi."
        ],
        "correctAnswerIndex": 1,
        "explanation": "U-Net menggunakan konkatenasi kanal (axis=-1) untuk mempertahankan seluruh informasi spasial detail dari encoder dan informasi kontekstual dari decoder secara simultan tanpa mereduksinya."
    }
})

# ==============================================================================
# Subbab 11.7: Pixel-Wise CE vs Dice Loss
# ==============================================================================
code_11_7 = r'''import numpy as np

# Implementasi Komparatif: Pixel-wise Cross-Entropy vs Soft Dice Loss
# Uji pada Skenario Extreme Class Imbalance: Lesi tumor hanya 2% dari total piksel

def compute_pixel_cross_entropy(y_pred_prob, y_true):
    # y_pred_prob, y_true: array 1D
    eps = 1e-7
    prob_clipped = np.clip(y_pred_prob, eps, 1.0 - eps)
    ce = -np.mean(y_true * np.log(prob_clipped) + (1.0 - y_true) * np.log(1.0 - prob_clipped))
    return ce

def compute_soft_dice_loss(y_pred_prob, y_true, smooth=1.0):
    intersection = np.sum(y_pred_prob * y_true)
    cardinality = np.sum(y_pred_prob**2) + np.sum(y_true**2)
    dice_coeff = (2.0 * intersection + smooth) / (cardinality + smooth)
    return 1.0 - dice_coeff, dice_coeff

# Simulasi citra medis 100 piksel: 2 piksel tumor (positif), 98 latar (negatif)
np.random.seed(42)
N = 100
y_true_mask = np.zeros(N, dtype=np.float32)
y_true_mask[[45, 46]] = 1.0  # Hanya 2% target

# Kasus A: Model Trivial / Malas (Memprediksi seluruh piksel sebagai Latar Belakang)
pred_lazy = np.zeros(N, dtype=np.float32) + 0.01

# Kasus B: Model Bagus (Memprediksi kedua piksel tumor dengan benar)
pred_good = np.zeros(N, dtype=np.float32) + 0.01
pred_good[[45, 46]] = 0.95

ce_lazy = compute_pixel_cross_entropy(pred_lazy, y_true_mask)
ce_good = compute_pixel_cross_entropy(pred_good, y_true_mask)

dice_loss_lazy, d_coeff_lazy = compute_soft_dice_loss(pred_lazy, y_true_mask)
dice_loss_good, d_coeff_good = compute_soft_dice_loss(pred_good, y_true_mask)

print("Evaluasi Fungsi Rugi pada Kasus Extreme Imbalance (2% Positif):")
print(f"Model Malas -> Cross-Entropy: {ce_lazy:.4f} (Menyesatkan! Nilai loss tampak rendah)")
print(f"Model Bagus -> Cross-Entropy: {ce_good:.4f}")
print("-" * 65)
print(f"Model Malas -> Dice Score: {d_coeff_lazy:.4f} | Dice Loss: {dice_loss_lazy:.4f} (Penalti Sangat Berat)")
print(f"Model Bagus -> Dice Score: {d_coeff_good:.4f} | Dice Loss: {dice_loss_good:.4f} (Akurat)")
'''

out_11_7 = run_code_capture_output(code_11_7)

subchapters.append({
    "id": "cv-11-7-pixel-cross-entropy-vs-dice-loss",
    "title": "11.7 Pixel-Wise Cross-Entropy vs Dice Loss / Soft Dice Coefficient",
    "content": r"""Dalam pelatihan model segmentasi semantik, pemilihan fungsi objektif (*loss function*) sangat menentukan keberhasilan model dalam memisahkan target dari latar belakang, terutama saat menghadapi **ketimpangan kelas spasial (*spatial class imbalance*)**.

**1. Pixel-Wise Cross-Entropy (CE)**:
Fungsi rugi *Cross-Entropy* mengevaluasi probabilitas prediksi secara independen pada setiap piksel:

$$\mathcal{L}_{\text{CE}} = -\frac{1}{N} \sum_{i=1}^N \sum_{k=1}^K y_{ik} \log(\hat{p}_{ik})$$

**Kelemahan Kritis pada Citra Medis**:
Dalam banyak kasus nyata (misalnya segmentasi lesi kanker, mikro-aneurisma retina, atau retakan mikroskopis material), objek target hanya mencakup sebagian kecil wilayah citra ($< 1 - 2\%$ total piksel). Model yang memprediksi latar belakang di seluruh piksel (*lazy trivial predictor*) dapat mencapai akurasi $98\%$ dengan nilai CE loss yang tampak rendah. Sinyal gradien dari piksel target tenggelam oleh akumulasi gradien jutaan piksel latar belakang.

**2. Soft Dice Loss (Sørensen–Dice Coefficient)**:
Untuk mengatasi ketimpangan ini, Millek et al. (V-Net 2016) merumuskan fungsi objektif berbasis **Koefisien Sørensen–Dice**:

$$\mathcal{L}_{\text{Dice}} = 1 - \frac{2 \sum_{i=1}^N p_i g_i + \epsilon}{\sum_{i=1}^N p_i^2 + \sum_{i=1}^N g_i^2 + \epsilon}$$

Di mana $p_i \in [0, 1]$ adalah probabilitas prediksi kontinu, $g_i \in \{0, 1\}$ adalah ground truth biner, dan $\epsilon$ adalah konstanta penghalus (*smoothing factor*) untuk mencegah pembagian dengan nol.

**Keunggulan Dice Loss**:
Dice Loss mengukur derajat tumpang tindih (*overlap*) global antara himpunan prediksi dan *ground truth*. Ukuran absolut dari latar belakang tidak memengaruhi pembilang formula ini. Hasilnya, gradien tetap kuat dan terarah meskipun target objek berukuran sangat mungil.

**3. Fungsi Rugi Hibrida (Combo Loss / BCE-Dice)**:
Dalam praktik produksi mutakhir, kedua fungsi rugi ini sering digabungkan secara linier untuk memanfaatkan keunggulan kelancaran kurva gradien CE dan ketahanan imbalance dari Dice Loss:

$$\mathcal{L}_{\text{total}} = \alpha \mathcal{L}_{\text{CE}} + (1 - \alpha) \mathcal{L}_{\text{Dice}}$$""",
    "codeSnippet": code_11_7,
    "expectedOutput": out_11_7,
    "commonPitfalls": [
        "Lupa menambahkan parameter smoothing $\\epsilon$ pada penyebut Dice Loss; ini dapat memicu nilai NaN jika ground truth kosong dan prediksi model mendekati nol.",
        "Menggunakan kuadrat probabilitas $p_i^2$ pada formulasi penyebut Dice Loss saat menghitung metrik evaluasi evaluasi standar (metrik evaluasi menggunakan nilai linier $|P| + |G|$)."
    ],
    "quiz": {
        "question": "Mengapa Dice Loss jauh lebih efektif daripada Cross-Entropy standar dalam melatih model segmentasi tumor otak berukuran kecil?",
        "options": [
            "Karena Dice Loss hanya dapat dihitung pada sistem operasi 64-bit.",
            "Karena Dice Loss mengukur rasio tumpang tindih (overlap) langsung antara prediksi dan ground truth tanpa terdistorsi oleh jutaan piksel latar belakang yang mendominasi citra.",
            "Karena Dice Loss tidak memerlukan proses diferensiasi gradien.",
            "Karena Cross-Entropy selalu menghasilkan nilai kerugian bernilai negatif."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Dice Loss berfokus pada area irisan dan gabungan antara target prediksi dan ground truth. Luasnya area latar belakang yang tidak memuat tumor tidak mendistorsi nilai loss, sehingga gradien tetap seimbang."
    }
})

# ==============================================================================
# Subbab 11.8: Weighted Loss Map U-Net
# ==============================================================================
code_11_8 = r'''import numpy as np
from scipy.ndimage import distance_transform_edt

# Implementasi Pembentukan Weighted Loss Map U-Net (Ronneberger et al. 2015)
# Formula: w(x) = w_c(x) + w0 * exp( - (d1(x) + d2(x))^2 / (2 * sigma^2) )

def compute_unet_weight_map(mask_labeled, w0=10.0, sigma=5.0):
    # mask_labeled: matriks 2D integer dengan ID sel unik (1, 2, ...) dan 0 = background
    H, W = mask_labeled.shape
    num_objects = np.max(mask_labeled)
    
    if num_objects < 2:
        # Jika kurang dari 2 sel, bobot perbatasan nol
        return np.ones((H, W), dtype=np.float32)
        
    # Hitung jarak Euclidean ke setiap objek individu
    distances = np.zeros((H, W, num_objects), dtype=np.float32)
    for idx in range(num_objects):
        obj_id = idx + 1
        obj_mask = (mask_labeled == obj_id)
        # distance_transform_edt menghitung jarak piksel latar ke batas sel
        distances[:, :, idx] = distance_transform_edt(~obj_mask)
        
    # Urutkan jarak sepanjang sumbu objek untuk mendapatkan d1 (terdekat) dan d2 (kedua terdekat)
    sorted_dist = np.sort(distances, axis=-1)
    d1 = sorted_dist[:, :, 0]
    d2 = sorted_dist[:, :, 1]
    
    # Hitung penalti eksponensial batas perbatasan antar-sel
    border_penalty = w0 * np.exp(-((d1 + d2) ** 2) / (2.0 * (sigma ** 2)))
    
    # Bobot penyeimbang frekuensi kelas dasar w_c
    w_c = np.ones((H, W), dtype=np.float32)
    weight_map = w_c + border_penalty
    return weight_map, border_penalty

# Simulasi 2 sel yang saling berdekatan (hanya terpisah 2 piksel celah)
cell_mask = np.zeros((20, 20), dtype=np.int32)
cell_mask[5:15, 2:9] = 1   # Sel 1
cell_mask[5:15, 11:18] = 2 # Sel 2 (celah pada kolom 9 dan 10)

w_map, penalty = compute_unet_weight_map(cell_mask, w0=10.0, sigma=2.0)

print("Karakteristik Weighted Loss Map U-Net:")
print(f"Dimensi Mask Input : {cell_mask.shape}")
print(f"Bobot pada Wilayah Bebas Latar (Jauh) : {w_map[0, 0]:.2f} (Bobot dasar)")
print(f"Bobot pada Interior Sel 1            : {w_map[10, 5]:.2f}")
print(f"Bobot Puncak pada Celah Sempit Antara: {w_map[10, 9]:.2f} (Penalti Perbatasan Maksimal)")
print(f"Faktor Penguatan Bobot Celah         : {w_map[10, 9] / w_map[0, 0]:.1f}x lebih besar")
'''

out_11_8 = run_code_capture_output(code_11_8)

subchapters.append({
    "id": "cv-11-8-unet-weighted-loss-map",
    "title": "11.8 Weighted Loss Map U-Net: Border-Weighting Antar Instans Berdekatan",
    "content": r"""Pada citra mikroskopis biomedis, salah satu tantangan paling berat adalah memisahkan sel-sel individual yang saling menempel erat (*touching cells*). Karena segmentasi semantik memperlakukan seluruh piksel sel sebagai kelas "Cell" yang homogen, model cenderung menyatukan dua sel yang bersentuhan menjadi satu objek raksasa (*merging error*).

**1. Formulasi Analitis Ronneberger et al.**:
Untuk memaksa jaringan mempelajari celah batas sempit (*background separation ridges*) di antara sel-sel yang saling menyentuh, Ronneberger et al. memperkenalkan **Peta Bobot Kerugian Spasial (*Weighted Loss Map*)** $w(\mathbf{x})$ yang telah dihitung sebelumnya (*pre-computed*):

$$w(\mathbf{x}) = w_c(\mathbf{x}) + w_0 \cdot \exp\left( -\frac{(d_1(\mathbf{x}) + d_2(\mathbf{x}))^2}{2\sigma^2} \right)$$

Di mana:
- $\mathbf{x} \in \Omega$ adalah koordinat posisi piksel pada citra.
- $w_c(\mathbf{x})$ adalah bobot penyeimbang frekuensi kelas dasar untuk mengkompensasi rasio sel vs latar belakang.
- $d_1(\mathbf{x})$ adalah jarak Euclidean dari titik $\mathbf{x}$ ke batas objek sel terdekat pertama.
- $d_2(\mathbf{x})$ adalah jarak Euclidean dari titik $\mathbf{x}$ ke batas objek sel terdekat kedua.
- $w_0$ adalah konstanta penguatan penalti (biasanya ditetapkan $w_0 = 10$).
- $\sigma$ adalah parameter skala lebar penyebaran Gaussian batas (biasanya $\sigma \approx 5$ piksel).

**2. Mekanisme Kerja Penalti Perbatasan**:
Pada wilayah latar belakang yang jauh dari objek, nilai $d_1 + d_2$ sangat besar, sehingga suku eksponensial meluruh mendekati nol dan bobot kembali ke nilai dasar $w_c(\mathbf{x})$.

Namun pada celah sempit di antara dua sel yang bersentuhan, $d_1$ dan $d_2$ keduanya bernilai sangat kecil secara simultan (misalnya $1-2$ piksel). Akibatnya, nilai fungsi eksponensial mencapai puncaknya, memberikan penguatan bobot hingga $10\times$ lipat pada garis batas sempit tersebut. Model dihukum sangat berat jika gagal memprediksi latar belakang pada celah pemisah antar sel, memaksa terbentuknya pemisahan instans yang bersih.""",
    "codeSnippet": code_11_8,
    "expectedOutput": out_11_8,
    "commonPitfalls": [
        "Menghitung $d_1$ dan $d_2$ ke sel yang sama; kedua jarak tersebut wajib dihitung ke dua entitas objek sel yang berbeda secara individual.",
        "Mengabaikan komputasi pre-processing peta bobot; karena transformasi jarak Euclidean membutuhkan komputasi intensif, peta bobot harus dibuat secara offline sebelum pelatihan dimulai."
    ],
    "quiz": {
        "question": "Mengapa formula U-Net Weighted Loss Map menggunakan penjumlahan jarak d1(x) + d2(x) alih-alih hanya jarak ke objek terdekat d1(x)?",
        "options": [
            "Agar bobot bernilai nol pada seluruh piksel citra.",
            "Agar penalti bobot hanya terfokus secara spesifik pada celah sempit di antara dua sel yang saling bersentuhan, di mana kedua sel berada dekat secara bersamaan.",
            "Untuk mempercepat proses augmentasi citra pada CPU.",
            "Karena nilai d2(x) selalu bernilai negatif."
        ],
        "correctAnswerIndex": 1,
        "explanation": "Jika hanya menggunakan d1, seluruh area dekat batas sel akan berbobot besar. Dengan mensyaratkan d1 + d2 bernilai kecil, bobot besar hanya terkonsentrasi di celah sempit di antara dua objek sel yang saling bersebelahan."
    }
})

# ==============================================================================
# Subbab 11.9: Dilated / Atrous Convolutions
# ==============================================================================
code_11_9 = r'''import numpy as np

# Implementasi Dilated Convolution 2D Mandiri (Yu & Koltun 2015)
# Kernel efektif dengan dilation rate r: k_eff = k + (k - 1) * (r - 1)

def apply_dilated_conv2d(input_2d, kernel, dilation_rate=1):
    H, W = input_2d.shape
    kh, kw = kernel.shape
    kh_eff = kh + (kh - 1) * (dilation_rate - 1)
    kw_eff = kw + (kw - 1) * (dilation_rate - 1)
    
    # Buat kernel terdilasi (menyisipkan nol)
    dilated_k = np.zeros((kh_eff, kw_eff), dtype=np.float32)
    dilated_k[::dilation_rate, ::dilation_rate] = kernel
    
    # Konvolusi valid padding
    H_out = H - kh_eff + 1
    W_out = W - kw_eff + 1
    out = np.zeros((H_out, W_out), dtype=np.float32)
    
    for r in range(H_out):
        for c in range(W_out):
            patch = input_2d[r:r+kh_eff, c:c+kw_eff]
            out[r, c] = np.sum(patch * dilated_k)
            
    return out, (kh_eff, kw_eff)

# Matriks masukan 9x9 dan kernel dasar 3x3
input_mat = np.ones((9, 9), dtype=np.float32)
base_kernel = np.ones((3, 3), dtype=np.float32)

# Uji dengan dilation rate r=1 (standar), r=2, dan r=4
out_r1, k_eff_1 = apply_dilated_conv2d(input_mat, base_kernel, dilation_rate=1)
out_r2, k_eff_2 = apply_dilated_conv2d(input_mat, base_kernel, dilation_rate=2)
out_r4, k_eff_4 = apply_dilated_conv2d(input_mat, base_kernel, dilation_rate=4)

print("Analisis Eksponensial Dilated (Atrous) Convolution:")
print(f"Rate r=1 -> Ukuran Kernel Efektif: {k_eff_1[0]}x{k_eff_1[1]} | Dimensi Luaran: {out_r1.shape}")
print(f"Rate r=2 -> Ukuran Kernel Efektif: {k_eff_2[0]}x{k_eff_2[1]} | Dimensi Luaran: {out_r2.shape}")
print(f"Rate r=4 -> Ukuran Kernel Efektif: {k_eff_4[0]}x{k_eff_4[1]} | Dimensi Luaran: {out_r4.shape}")
print(f"Jumlah Parameter Bobot Asli yang Dipelajari: Tetap {base_kernel.size} bobot untuk seluruh rate!")
'''

out_11_9 = run_code_capture_output(code_11_9)

subchapters.append({
    "id": "cv-11-9-dilated-atrous-convolutions",
    "title": "11.9 Dilated / Atrous Convolution (Yu & Koltun 2015): Perluasan Receptive Field dengan Rate Dilasi r",
    "content": r"""Dalam perancangan CNN untuk segmentasi semantik, perancang menghadapi **dilema spasial fundamental**:
1. Menggunakan *pooling* dan *stride* memperluas bidang reseptif (*receptive field*), namun menurunkan resolusi spasial dan menghapus detail tepi halus.
2. Mempertahankan resolusi penuh tanpa *pooling* membatasi *receptive field*, sehingga model kehilangan pemahaman konteks semantik global.

**1. Definisi Matematis Dilated Convolution**:
Fisher Yu dan Vladlen Koltun (2015) serta Chen et al. (DeepLab) mengatasi dilema ini dengan menerapkan **Dilated Convolution** (disebut juga *atrous convolution* dari bahasa Prancis *à trous* yang berarti "dengan lubang-lubang").

Operasi konvolusi 2D terdilasi dengan tingkat dilasi $r \in \mathbb{N}$ didefinisikan sebagai:

$$(\mathbf{x} *_r \mathbf{w})[p] = \sum_{k \in \mathcal{K}} \mathbf{x}[p + r \cdot k] \, \mathbf{w}[k]$$

Di mana $r$ adalah parameter *dilation rate*. Jika $r = 1$, operasi ini tereduksi menjadi konvolusi standar. Jika $r > 1$, operasi ini menyisipkan celah $r - 1$ nol di antara koefisien filter kernel tanpa menambah jumlah parameter terhitung.

**2. Ekspansi Receptive Field Efektif**:
Ukuran spasial kernel efektif $k_{\text{eff}}$ tumbuh secara linier terhadap laju dilasi $r$:

$$k_{\text{eff}} = k + (k - 1)(r - 1)$$

Sebuah kernel $3 \times 3$ dengan $r = 2$ memiliki bidang reseptif setara dengan filter $5 \times 5$, dan dengan $r = 4$ setara dengan filter $9 \times 9$, namun hanya membutuhkan tepat **9 operasi perkalian bobot**.

Dengan menumpuk lapisan terdilasi dengan laju $r$ yang meningkat secara eksponensial ($r = 1, 2, 4, 8\dots$), *receptive field* jaringan dapat mencakup seluruh area citra masukan tanpa pernah menurunkan resolusi spasial atau kehilangan keutuhan fitur piksel.

**3. Fenomena Gridding Effect**:
Kelemahan teknis dari konvolusi terdilasi murni adalah *gridding effect*: karena sampling dilakukan secara berjarak, informasi dari piksel-piksel di antara celah tidak dievaluasi secara lokal. Solusinya adalah penggunaan skema multi-skala terpadu seperti **Atrous Spatial Pyramid Pooling (ASPP)** pada arsitektur DeepLabv3.""",
    "codeSnippet": code_11_9,
    "expectedOutput": out_11_9,
    "commonPitfalls": [
        "Mengasumsikan bahwa dilation rate r=2 melipatgandakan jumlah parameter bobot model; jumlah bobot yang dipelajari tetap sama, hanya jarak spasial antar titik sampling yang diperluas.",
        "Menggunakan laju dilasi yang seragam di seluruh lapisan berturut-turut, yang memicu artefak kisi (gridding effect); gunakan variasi laju hierarkis seperti r=[1, 2, 3] untuk sampling yang rapat."
    ],
    "quiz": {
        "question": "Berapakah ukuran receptive field efektif spasial dari filter konvolusi 3x3 standar jika diterapkan dengan dilation rate r = 3?",
        "options": [
            "3 x 3 piksel",
            "5 x 5 piksel",
            "7 x 7 piksel",
            "9 x 9 piksel"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Menggunakan formula k_eff = k + (k - 1)*(r - 1) = 3 + (3 - 1)*(3 - 1) = 3 + 2*(2) = 7 piksel."
    }
})

# ==============================================================================
# Subbab 11.10: Metrik Segmentasi Semantik
# ==============================================================================
code_11_10 = r'''import numpy as np

# Implementasi Evaluasi Kuantitatif Segmentasi Semantik
# Metrik: Pixel Accuracy (PA), Mean Pixel Accuracy (MPA), Mean IoU (mIoU), Dice Score

def evaluate_semantic_segmentation(confusion_matrix):
    # confusion_matrix shape: (K, K) di mana baris=GroundTruth, kolom=Prediction
    # n_ii: True Positive per kelas
    tp = np.diag(confusion_matrix)
    # Total piksel ground truth per kelas (baris)
    t_i = np.sum(confusion_matrix, axis=1)
    # Total piksel prediksi per kelas (kolom)
    p_i = np.sum(confusion_matrix, axis=0)
    total_pixels = np.sum(confusion_matrix)
    
    # 1. Pixel Accuracy (PA)
    pa = np.sum(tp) / total_pixels
    
    # 2. Mean Pixel Accuracy (MPA)
    # Gunakan np.maximum untuk mencegah pembagian nol pada kelas kosong
    class_acc = tp / np.maximum(t_i, 1e-6)
    mpa = np.mean(class_acc)
    
    # 3. Mean Intersection over Union (mIoU / Jaccard Index)
    # IoU_i = TP / (TP + FP + FN) = TP / (t_i + p_i - TP)
    union_i = t_i + p_i - tp
    class_iou = tp / np.maximum(union_i, 1e-6)
    miou = np.mean(class_iou)
    
    # 4. Mean Dice Score (F1 per kelas)
    class_dice = (2.0 * tp) / np.maximum(t_i + p_i, 1e-6)
    mean_dice = np.mean(class_dice)
    
    return pa, mpa, miou, mean_dice, class_iou, class_acc

# Contoh Matriks Kebingungan 3 Kelas: [0: Jalan, 1: Bangunan, 2: Mobil]
cm = np.array([
    [850,  30,  20],   # Kelas 0: 900 piksel GT
    [ 40, 500,  10],   # Kelas 1: 550 piksel GT
    [ 15,  15, 120]    # Kelas 2: 150 piksel GT
], dtype=np.float64)

pa_val, mpa_val, miou_val, mdice_val, per_iou, per_acc = evaluate_semantic_segmentation(cm)

class_names = ['Jalan', 'Bangunan', 'Mobil']
print("Hasil Evaluasi Metrik Segmentasi Semantik:")
print(f"Pixel Accuracy (PA)     : {pa_val*100:.2f}%")
print(f"Mean Pixel Accuracy (MPA): {mpa_val*100:.2f}%")
print(f"Mean IoU (mIoU)         : {miou_val*100:.2f}% (Standar Tolok Ukur)")
print(f"Mean Dice Score         : {mdice_val*100:.2f}%")
print("-" * 55)
print("Perincian per Kategori Kelas:")
for name, iou, acc in zip(class_names, per_iou, per_acc):
    print(f" Kelas {name:<10} -> IoU: {iou*100:5.2f}% | Akurasi Piksel: {acc*100:5.2f}%")
'''

out_11_10 = run_code_capture_output(code_11_10)

subchapters.append({
    "id": "cv-11-10-segmentation-metrics",
    "title": "11.10 Metrik Segmentasi Semantik: Pixel Accuracy, Mean IoU, dan Dice Coefficient",
    "content": r"""Untuk mengukur performa model segmentasi semantik secara obyektif melintasi beragam konfigurasi data, komunitas visi komputer menggunakan serangkaian metrik standar berbasis **Matriks Kontinjensi Spasial (*Confusion Matrix*)** $n_{ij}$, di mana $n_{ij}$ merepresentasikan jumlah piksel dari kelas sejati $i$ yang diprediksi sebagai kelas $j$.

Didefinisikan $t_i = \sum_j n_{ij}$ sebagai total piksel *ground truth* kelas $i$, dan $K$ sebagai jumlah kelas target.

**1. Pixel Accuracy (PA)**:
Rasio sederhana antara total piksel yang terklasifikasi secara tepat terhadap seluruh piksel dalam citra:

$$\text{PA} = \frac{\sum_{i=1}^K n_{ii}}{\sum_{i=1}^K t_i}$$

*Keterbatasan*: Sangat bias terhadap kelas mayoritas. Jika latar belakang mencakup $90\%$ area, model yang memprediksi latar belakang di seluruh citra akan memperoleh $\text{PA} = 90\%$.

**2. Mean Pixel Accuracy (MPA)**:
Akurasi piksel dihitung untuk masing-masing kelas secara terpisah, kemudian dirata-ratakan:

$$\text{MPA} = \frac{1}{K} \sum_{i=1}^K \frac{n_{ii}}{t_i}$$

MPA memperlakukan setiap kelas secara setara terlepas dari frekuensi spasialnya, namun tidak menghukum kesalahan *false positive* (prediksi berlebih).

**3. Mean Intersection over Union (mIoU / Jaccard Index)**:
Merupakan **standar emas evaluasi industri** pada seluruh tolok ukur bergengsi (PASCAL VOC, Cityscapes, ADE20K). Menghitung rasio irisan terhadap gabungan untuk setiap kelas:

$$\text{mIoU} = \frac{1}{K} \sum_{i=1}^K \frac{n_{ii}}{t_i + \sum_j n_{ji} - n_{ii}}$$

Metrik ini secara komprehensif menghukum kesalahan *False Positive* ($FP = \sum_j n_{ji} - n_{ii}$) dan *False Negative* ($FN = t_i - n_{ii}$).

**4. Mean Dice Coefficient (F1-Score)**:
Rata-rata harmonik antara presisi dan sensitivitas per-piksel:

$$\text{Dice}_i = \frac{2 n_{ii}}{t_i + \sum_j n_{ji}}$$

Metrik Dice sangat sensitif terhadap tumpang tindih pada objek-objek berukuran kecil dan menjadi tolok ukur utama pada kompetisi segmentasi citra medis.""",
    "codeSnippet": code_11_10,
    "expectedOutput": out_11_10,
    "commonPitfalls": [
        "Hanya mengandalkan Pixel Accuracy (PA) untuk melaporkan performa model; PA dapat memberikan ilusi kesuksesan yang keliru pada dataset dengan ketimpangan latar belakang ekstrim.",
        "Menghitung mIoU dengan merata-ratakan langsung piksel per piksel alih-alih menghitung rasio per kelas terlebih dahulu (macro-averaging wajib digunakan)."
    ],
    "quiz": {
        "question": "Mengapa Mean IoU (mIoU) dianggap sebagai metrik evaluasi yang jauh lebih terpercaya daripada Pixel Accuracy (PA) dalam kompetisi segmentasi semantik?",
        "options": [
            "Karena nilai mIoU selalu berkisar antara 100 hingga 1000.",
            "Karena mIoU menghitung rasio overlap per-kelas secara independen, secara ketat menghukum false positive dan false negative tanpa terbias oleh dominasi luas kelas latar belakang.",
            "Karena mIoU tidak dapat dihitung pada citra berwarna.",
            "Karena mIoU hanya mengevaluasi citra berukuran kecil."
        ],
        "correctAnswerIndex": 1,
        "explanation": "mIoU mengevaluasi perbandingan irisan terhadap gabungan untuk setiap kelas secara adil. Hal ini mencegah model memperoleh skor tinggi semata-mata karena memprediksi kelas latar belakang yang luas secara benar."
    }
})

output_path = os.path.join(os.path.dirname(__file__), "cv_ch11_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated Chapter 11 data with {len(subchapters)} subchapters: {output_path}")
