# -*- coding: utf-8 -*-
"""
Generator untuk Bab 14: Vision Transformer (ViT, Swin Transformer) & Multi-Head Self-Attention (10 Subbab)
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
# Subbab 14.1: Pergeseran Paradigma: Konvolusi Spasial Menuju Self-Attention Global
# ==============================================================================
code_14_1 = r'''import numpy as np

# Simulasi Inductive Bias: Receptive Field Konvolusi vs Jarak Interaksi Self-Attention Global
# Citra resolusi 16x16 patch/token

def cnn_receptive_field_growth(num_layers=5, kernel_size=3):
    # Pertumbuhan receptive field linear terhadap kedalaman: RF_(l) = RF_(l-1) + (k - 1)
    rf = 1
    rf_history = [rf]
    for _ in range(num_layers):
        rf += (kernel_size - 1)
        rf_history.append(rf)
    return rf_history

def transformer_global_attention_coverage(num_tokens=256):
    # Self-attention pada layer pertama langsung menghubungkan setiap token ke seluruh token
    layer_coverage = [num_tokens for _ in range(6)]
    return layer_coverage

rf_cnn = cnn_receptive_field_growth(num_layers=5, kernel_size=3)
cov_vit = transformer_global_attention_coverage(num_tokens=256)

print("Komparasi Cakupan Spasial Layer-per-Layer:")
for l, (rf, cov) in enumerate(zip(rf_cnn, cov_vit)):
    print(f"Layer {l}: CNN Receptive Field = {rf}x{rf} piksel | ViT Attention Scope = {cov} tokens (100% Global)")

print("\nKesimpulan Arsitektur:")
print("CNN mengandalkan inductive bias lokalitas spasial dan translasi invarian.")
print("Vision Transformer membuang bias lokalitas untuk interaksi global langsung sejak layer awal.")
'''

subchapters.append({
    "id": "cv-14-1-cnn-to-transformer-paradigm-shift",
    "title": "14.1. Pergeseran Paradigma: Konvolusi Spasial Menuju Self-Attention Global",
    "description": "Analisis transisi arsitektural dari Convolutional Neural Networks menuju Vision Transformers: perbandingan bias induktif lokalitas spasial vs fleksibilitas atensi global.",
    "content": r"""Perkembangan arsitektur visi komputer selama beberapa dekade didominasi oleh Convolutional Neural Networks (CNN). Keberhasilan CNN berakar pada dua **bias induktif (inductive bias)** yang terintegrasi secara inheren ke dalam operator konvolusi:
1. **Lokalitas Spasial (Spatial Locality)**: Piksel-piksel yang berdekatan secara geografis diasumsikan memiliki korelasi semantik yang jauh lebih tinggi daripada piksel yang berjauhan. Operator konvolusi mengeksploitasi asumsi ini melalui filter berukuran kecil (misal $3 \times 3$).
2. **Invariansi Translasi (Translation Equivariance)**: Pola visual yang sama (misal tepi, sudut, tekstur) memiliki makna representasi identik di mana pun pola tersebut muncul pada citra, yang diimplementasikan melalui pembagian bobot (*weight sharing*) filter konvolusi.

Meskipun efisien dan hemat parameter, bias induktif lokalitas membatasi **receptive field** efektif jaringan. Pada CNN konvensional, sebuah neuron di lapisan awal hanya mampu "melihat" beberapa piksel tetangga. Untuk menangkap konteks visual global (misalnya relasi antara moncong dan ekor kucing berukuran besar), CNN harus menumpuk belasan lapisan konvolusi dan pooling secara bertingkat:
$$RF_{l} = RF_{l-1} + (k - 1) \times \prod_{i=1}^{l-1} s_i$$
di mana $k$ adalah ukuran kernel dan $s_i$ adalah stride pada lapisan ke-$i$.

Sebaliknya, arsitektur **Vision Transformer (ViT)** membuang bias induktif lokalitas secara radikal. ViT memperlakukan citra sebagai sekuens patch independen dan menerapkan mekanisme **Self-Attention Global**:
$$\operatorname{Attention}(Q, K, V) = \operatorname{Softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
Pada lapisan pertama sekalipun, setiap patch citra dapat langsung berinteraksi dengan seluruh patch lain di seluruh permukaan citra tanpa dibatasi jarak spasial. Konsekuensinya, ViT membutuhkan kapasitas data latih yang jauh lebih masif (misalnya pra-pelatihan pada JFT-300M atau ImageNet-21k) untuk "mempelajari sendiri" konsep geometri spasial yang sebelumnya telah diprogram secara tetap ke dalam CNN.""",
    "codeSnippet": code_14_1,
    "commonPitfalls": [
        "Melatih arsitektur Vision Transformer murni dari awal (scratch) pada dataset kecil (misal < 50.000 sampel) yang berakibat overfitting parah akibat ketiadaan bias induktif bawaan.",
        "Mengabaikan kompleksitas komputasi atensi global kuadratik ketika memproses citra resolusi tinggi tanpa strategi pemangkasan jendela atau downsampling bertahap."
    ],
    "canonicalReferences": [
        {
            "title": "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
            "authors": ["Alexey Dosovitskiy", "Lucas Beyer", "Alexander Kolesnikov", "Dirk Weissenborn", "Xiaohua Zhai", "Thomas Unterthiner", "Mostafa Dehghani", "Matthias Minderer", "Georg Heigold", "Sylvain Gelly", "Jakob Uszkoreit", "Neil Houlsby"],
            "url": "https://arxiv.org/abs/2010.11929",
            "relevance": "Paper pendirian Vision Transformer (ViT) yang membuktikan keunggulan self-attention murni tanpa konvolusi pada visi komputer skala besar."
        }
    ],
    "quiz": {
        "question": "Mengapa Vision Transformer (ViT) membutuhkan dataset pra-latih yang jauh lebih besar daripada CNN untuk mencapai akurasi optimal?",
        "options": [
            "Karena ViT memiliki resolusi patch yang tidak dapat diubah setelah inisialisasi",
            "Karena ViT tidak memiliki inductive bias lokalitas dan translasi inheren, sehingga hubungan spasial harus dipelajari murni dari data",
            "Karena ViT menggunakan fungsi aktivasi non-linear yang memperlambat konvergensi gradien",
            "Karena bobot proyeksi linear patch tidak dapat dioptimasi menggunakan optimizer berbasis momentum seperti AdamW"
        ],
        "correctIndex": 1,
        "explanation": "CNN memiliki inductive bias struktural (lokalitas spasial dan weight sharing), sedangkan ViT membuang asumsi tersebut sehingga model harus mempelajari sendiri struktur dan geometri spasial dari korelasi data berskala masif."
    }
})

# ==============================================================================
# Subbab 14.2: Arsitektur Vision Transformer (ViT)
# ==============================================================================
code_14_2 = r'''import numpy as np

# Simulasi Dimensi Tensor Alur Lengkap Vision Transformer (ViT-Base/16)
# Citra input H=224, W=224, C=3, Patch P=16, Hidden D=768

H, W, C = 224, 224, 3
P = 16
D = 768
num_patches = (H // P) * (W // P)
patch_dim = P * P * C

print("Spesifikasi Dimensi Alur Data ViT-Base/16:")
print(f"1. Citra Input            : ({H}, {W}, {C}) = {H*W*C} nilai piksel")
print(f"2. Ukuran Patch (P x P)   : ({P}, {P}, {C}) = {patch_dim} fitur per patch flattened")
print(f"3. Jumlah Patch (N)       : {num_patches} patches (grid {(H//P)}x{(W//P)})")
print(f"4. Proyeksi Linear E      : ({patch_dim}, {D}) memetakan patch ke ruang embedding")
print(f"5. Sequence Length + [CLS]: {num_patches} + 1 = {num_patches + 1} tokens")
print(f"6. Tensor Input Encoder   : (Batch, {num_patches + 1}, {D})")
print(f"7. Hidden Dimension (D)   : {D} kanal representasi terpelajari")
'''

subchapters.append({
    "id": "cv-14-2-vit-architecture-dosovitskiy-2021",
    "title": "14.2. Arsitektur Vision Transformer (ViT - Dosovitskiy et al., ICLR 2021)",
    "description": "Desain arsitektur standar Vision Transformer: pemotongan citra 2D menjadi sekuens patch 1D, proyeksi linear patch embedding, dan tumpukan encoder Transformer standar.",
    "content": r"""Arsitektur **Vision Transformer (ViT)** diperkenalkan oleh Dosovitskiy et al. (ICLR 2021) dengan filosofi desain: mempertahankan arsitektur Transformer standar (Vaswani et al., 2017) sedekat mungkin tanpa menambahkan modifikasi khusus domain visi.

Untuk memproses citra 2D $\mathbf{x} \in \mathbb{R}^{H \times W \times C}$ menggunakan arsitektur Transformer yang dirancang untuk sekuens 1D, citra dipartisi menjadi $N$ buah patch non-overlapping berukuran $P \times P$:
$$N = \frac{HW}{P^2}$$
Setiap patch 2D diratakan (*flattened*) menjadi vektor 1D $\mathbf{x}_p^i \in \mathbb{R}^{P^2 C}$, di mana $i \in \{1, \dots, N\}$. 

Vektor patch yang telah diratakan kemudian diproyeksikan secara linear ke dalam ruang representasi berdimensi konstan $D$ menggunakan matriks bobot terpelajari $\mathbf{E} \in \mathbb{R}^{(P^2 C) \times D}$. Mirip dengan token `[CLS]` pada arsitektur BERT, sebuah vektor embedding kelas terpelajari $\mathbf{x}_{\text{class}} \in \mathbb{R}^D$ ditambahkan di posisi awal sekuens. Vektor posisi terpelajari 1D $\mathbf{E}_{\text{pos}} \in \mathbb{R}^{(N + 1) \times D}$ ditambahkan secara aditif ke seluruh sekuens untuk mempertahankan informasi topologi spasial:
$$\mathbf{z}_0 = [\mathbf{x}_{\text{class}}; \, \mathbf{x}_p^1 \mathbf{E}; \, \mathbf{x}_p^2 \mathbf{E}; \dots; \, \mathbf{x}_p^N \mathbf{E}] + \mathbf{E}_{\text{pos}}$$

Sekuens representasi $\mathbf{z}_0$ kemudian dialirkan melalui $L$ lapisan identik **Transformer Encoder Block**. Setiap blok terdiri dari:
1. **Multi-Head Self-Attention (MSA)** dengan normalisasi lapisan (LayerNorm, LN) sebelum modul (*pre-norm*):
   $$\mathbf{z}'_\ell = \operatorname{MSA}(\operatorname{LN}(\mathbf{z}_{\ell-1})) + \mathbf{z}_{\ell-1}, \quad \ell = 1 \dots L$$
2. **Multi-Layer Perceptron (MLP)** dua lapis dengan fungsi aktivasi GeLU:
   $$\mathbf{z}_\ell = \operatorname{MLP}(\operatorname{LN}(\mathbf{z}'_\ell)) + \mathbf{z}'_\ell, \quad \ell = 1 \dots L$$

Representasi akhir token `[CLS]` pada lapisan puncak $\mathbf{z}_L^0$ diekstraksi dan dilewatkan ke kepala klasifikasi (*MLP Head*) untuk menghasilkan prediksi probabilitas kategori objek:
$$\mathbf{y} = \operatorname{LN}(\mathbf{z}_L^0)$$""",
    "codeSnippet": code_14_2,
    "commonPitfalls": [
        "Lupa menambahkan token `[CLS]` atau salah mengambil indeks token saat melakukan klasifikasi gambar di lapisan output encoder.",
        "Mengabaikan LayerNorm pre-norm yang menyebabkan ketidakstabilan propagasi gradien pada ViT yang sangat dalam (misal ViT-Large dengan 24 blok)."
    ],
    "canonicalReferences": [
        {
            "title": "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
            "authors": ["Alexey Dosovitskiy et al."],
            "url": "https://arxiv.org/abs/2010.11929",
            "relevance": "Dokumentasi perumusan matematis patch projection, token [CLS], dan blok encoder ViT."
        }
    ],
    "quiz": {
        "question": "Jika citra input berukuran 384x384 diproses oleh ViT dengan ukuran patch 16x16, berapa jumlah token patch yang dihasilkan (sebelum penambahan token [CLS])?",
        "options": ["196", "576", "256", "768"],
        "correctIndex": 1,
        "explanation": "Jumlah patch dihitung dengan rumus N = (H x W) / (P x P) = (384 x 384) / (16 x 16) = 24 x 24 = 576 token patch."
    }
})

# ==============================================================================
# Subbab 14.3: Ekstraksi Patch Citra & Proyeksi Linear
# ==============================================================================
code_14_3 = r'''import numpy as np

# Implementasi Ekstraksi Patch Citra dan Proyeksi Linear NumPy Murni
np.random.seed(42)

# Input citra: Batch=1, H=32, W=32, C=3
H, W, C = 32, 32, 3
P = 8 # Ukuran patch 8x8
D = 64 # Dimensi embedding

img = np.random.randn(1, H, W, C)

# 1. Ekstraksi Patch Spasial
# Reshape ke grid patch (B, H//P, P, W//P, P, C) -> transpose ke (B, H//P, W//P, P, P, C)
grid_h, grid_w = H // P, W // P
patches = img.reshape(1, grid_h, P, grid_w, P, C).transpose(0, 1, 3, 2, 4, 5)
num_patches = grid_h * grid_w
patch_dim = P * P * C

# Flatten per patch: (Batch, N, P*P*C)
flattened_patches = patches.reshape(1, num_patches, patch_dim)

# 2. Proyeksi Linear (Matriks Bobot E dan Bias)
E = np.random.randn(patch_dim, D) * 0.02
b = np.zeros(D)

patch_embeddings = np.matmul(flattened_patches, E) + b

print(f"Dimensi Awal Citra            : {img.shape}")
print(f"Dimensi Patch Grid Flattened  : {flattened_patches.shape} (N={num_patches}, D_patch={patch_dim})")
print(f"Dimensi Setelah Proyeksi Linear: {patch_embeddings.shape} (N={num_patches}, D_emb={D})")
print(f"Rata-rata Norm Vektor Patch 0 : {np.linalg.norm(patch_embeddings[0, 0]):.4f}")
'''

subchapters.append({
    "id": "cv-14-3-patch-extraction-linear-projection",
    "title": "14.3. Ekstraksi Patch Citra & Proyeksi Linear (Linear Projection)",
    "description": "Mekanisme pemotongan spasial 2D citra menjadi token-token diskrit dan pemetaan berbobot linear menuju dimensi laten model Transformer.",
    "content": r"""Langkah fundamental pertama dalam Vision Transformer adalah mengonversi matriks piksel citra kontinu dua dimensi menjadi representasi sekuensial vektor diskrit yang setara dengan token kata pada Natural Language Processing (NLP).

Diberikan citra masukan $\mathbf{x} \in \mathbb{R}^{H \times W \times C}$. Citra dipotong secara reguler ke dalam kisi (*grid*) berukuran $(H/P) \times (W/P)$ di mana setiap patch individual berdimensi $P \times P \times C$. 

### 1. Transformasi Flattening
Setiap patch spasial ke-$i$ diratakan menjadi vektor baris berdimensi $P^2 C$:
$$\mathbf{x}_p^i = \operatorname{vec}(\mathbf{x}_{\text{patch } i}) \in \mathbb{R}^{1 \times (P^2 C)}$$
Untuk citra berukuran $224 \times 224 \times 3$ dengan patch $16 \times 16$, setiap vektor patch flattened memiliki panjang:
$$P^2 C = 16 \times 16 \times 3 = 768 \text{ elemen}$$
Total terdapat $N = (224/16) \times (224/16) = 196$ patch.

### 2. Proyeksi Linear Terpelajari
Vektor patch flattened yang berdimensi $P^2 C$ dipetakan ke ruang dimensi laten $D$ (misal $D = 768$ pada ViT-Base) melalui perkalian matriks dengan penambahan bias terpelajari:
$$\mathbf{e}_i = \mathbf{x}_p^i \mathbf{E} + \mathbf{b}_{\text{proj}}$$
di mana $\mathbf{E} \in \mathbb{R}^{(P^2 C) \times D}$ adalah matriks bobot proyeksi dan $\mathbf{b}_{\text{proj}} \in \mathbb{R}^D$ adalah vektor bias.

Secara komputasi, operasi ekstraksi patch dan proyeksi linear ini ekuivalen penuh dengan operasi **lapisan konvolusi 2D 2D tunggal** dengan konfigurasi khusus:
- Jumlah filter output = $D$
- Ukuran kernel spasial = $P \times P$
- Stride langkah konvolusi = $P$
- Padding = 0 (*valid*)

Implementasi berbasis lapisan konvolusi ini sangat dioptimalkan pada akselerator perangkat keras (GPU) menggunakan pustaka cuDNN, memungkinkan ekstraksi patch dan proyeksi linear dilakukan secara simultan dalam satu forward pass tanpa overhead alokasi memori slicing array.""",
    "codeSnippet": code_14_3,
    "commonPitfalls": [
        "Memilih ukuran patch $P$ yang terlalu kecil (misal $P=4$ pada citra resolusi tinggi) yang menyebabkan lonjakan eksponensial jumlah token $N$, melebihi batas kapasitas memori VRAM GPU.",
        "Menggunakan teknik downsampling interpolasi bicubic pada citra mentah sebelum ekstraksi patch alih-alih menyesuaikan stride dan kernel proyeksi patch."
    ],
    "canonicalReferences": [
        {
            "title": "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
            "authors": ["Alexey Dosovitskiy et al."],
            "url": "https://arxiv.org/abs/2010.11929",
            "relevance": "Formulasi perataan patch dan ekivalensi proyeksi linear dengan lapisan konvolusi 2D ber-stride besar."
        }
    ],
    "quiz": {
        "question": "Operasi konvolusi 2D standar apa yang ekuivalen secara matematis dan numerik dengan proses pemotongan patch PxP dan proyeksi linear ke dimensi D?",
        "options": [
            "Conv2D dengan kernel 1x1, stride 1, dan padding Same",
            "Conv2D dengan kernel PxP, stride P, dan padding Valid dengan D filter",
            "Transposed Conv2D dengan kernel PxP dan stride 1",
            "Depthwise Separable Conv2D dengan kernel PxP dan stride 1"
        ],
        "correctIndex": 1,
        "explanation": "Conv2D dengan ukuran kernel PxP, stride langkah konvolusi P (non-overlapping), tanpa padding (Valid), dan jumlah filter output D menghasilkan output spasial (H/P) x (W/P) x D yang identik dengan proyeksi linear sekuens patch."
    }
})

# ==============================================================================
# Subbab 14.4: Token Kelas Khusus [CLS] dan Embedding Posisi 1D & 2D
# ==============================================================================
code_14_4 = r'''import numpy as np

# Implementasi Token [CLS] dan Positional Embedding 1D
np.random.seed(42)

N = 16 # Jumlah patch
D = 32 # Hidden dimension
batch_size = 2

# 1. Patch Embeddings
patch_emb = np.random.randn(batch_size, N, D)

# 2. Token [CLS] terpelajari yang disematkan ke awal setiap sampel
cls_token = np.random.randn(1, 1, D)
cls_expanded = np.tile(cls_token, (batch_size, 1, 1))

# Konkatenasi token [CLS]: (Batch, N+1, D)
tokens = np.concatenate([cls_expanded, patch_emb], axis=1)

# 3. Positional Embedding 1D Terpelajari: (1, N+1, D)
pos_embedding = np.random.randn(1, N + 1, D) * 0.02

# Penjumlahan aditif posisi ke seluruh token
input_transformer = tokens + pos_embedding

print(f"Ukuran Patch Embedding Awal    : {patch_emb.shape}")
print(f"Ukuran Token setelah + [CLS]   : {tokens.shape}")
print(f"Ukuran Positional Embedding    : {pos_embedding.shape}")
print(f"Ukuran Input Final Encoder     : {input_transformer.shape}")
print(f"Token Indeks 0 (Representasi CLS Ter-injeksi Posisi 0): Norm = {np.linalg.norm(input_transformer[0, 0]):.4f}")
'''

subchapters.append({
    "id": "cv-14-4-cls-token-positional-embeddings",
    "title": "14.4. Token Kelas Khusus [CLS] dan Embedding Posisi (Positional Embedding) 1D & 2D",
    "description": "Peran representasi agragatif token [CLS] untuk klasifikasi visual bebas bias spasial serta injeksi informasi koordinat melalui positional embedding terpelajari.",
    "content": r"""Arsitektur Transformer standar bersifat **invarian permutasi (permutation invariant)**: jika urutan token masukan diacak, matriks bobot atensi akan menghasilkan nilai identik yang teracak sesuai urutan masukan. Pada domain citra, mengacak posisi patch akan menghancurkan struktur semantik visual. Oleh karena itu, ViT mengintegrasikan dua mekanisme representasi kritis:

### 1. Token Kelas Khusus `[CLS]`
Pada CNN konvensional, fitur klasifikasi diperoleh melalui operasi Global Average Pooling (GAP) di akhir jaringan. Pada ViT, merata-ratakan seluruh patch dapat memberikan bobot yang tidak adil pada patch latar belakang yang tidak relevan. ViT mengadopsi pendekatan BERT dengan menyisipkan token terpelajari independen $\mathbf{x}_{\text{class}} \in \mathbb{R}^{1 \times D}$ di awal sekuens (posisi indeks 0). 

Karena token `[CLS]` tidak terikat pada patch fisik mana pun dari citra asli, token ini bebas mengagregasi informasi semantik global dari seluruh patch melalui lapisan Multi-Head Self-Attention tanpa bias lokasi spasial tertentu.

### 2. Embedding Posisi (Positional Embeddings)
Untuk memberikan pemahaman spasial kepada model, vektor posisi ditambahkan secara aditif ke setiap token patch:
$$\mathbf{z}_0 = [\mathbf{x}_{\text{class}}; \, \mathbf{e}_1; \, \mathbf{e}_2; \dots; \, \mathbf{e}_N] + \mathbf{E}_{\text{pos}}$$
di mana $\mathbf{E}_{\text{pos}} \in \mathbb{R}^{(N+1) \times D}$.

Dalam paper aslinya, Dosovitskiy et al. mengevaluasi tiga variasi embedding posisi:
1. **1D Positional Embedding Terpelajari**: Memperlakukan sekuens $N$ patch sebagai sekuens linear $1 \dots N$ sederhana.
2. **2D Positional Embedding Terpelajari**: Memisahkan koordinat sumbu $X$ dan sumbu $Y$ secara independen, kemudian menggabungkan representasi $\mathbf{E}_x$ dan $\mathbf{E}_y$.
3. **Sinusoidal Positional Embedding**: Fungsi gelombang trigonometri tetap berbasis frekuensi.

Hasil eksperimen empiris menunjukkan bahwa 1D positional embedding terpelajari memberikan performa akurasi yang identik dengan embedding 2D. Model terbukti secara mandiri mampu mempelajari struktur kisi 2D: matriks kesamaan kosinus antar-vektor posisi menunjukkan bahwa vektor pada baris dan kolom yang sama secara otomatis memiliki korelasi representasi yang tinggi.""",
    "codeSnippet": code_14_4,
    "commonPitfalls": [
        "Mengalikan (multiplication) alih-alih menjumlahkan (addition) positional embedding ke dalam token patch, yang merusak penskalaan magnitudo fitur laten.",
        "Mengabaikan interpolasi bicubic 2D pada positional embedding ketika mengevaluasi model pada resolusi citra yang berbeda dari fase pra-pelatihan."
    ],
    "canonicalReferences": [
        {
            "title": "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
            "authors": ["Alexey Dosovitskiy et al."],
            "url": "https://arxiv.org/abs/2010.11929",
            "relevance": "Eksperimen komparasi 1D vs 2D learnable positional embedding dan adaptasi resolusi posisi via interpolasi 2D."
        }
    ],
    "quiz": {
        "question": "Bagaimana ViT menangani perbedaan jumlah patch ketika diuji pada citra beresolusi lebih tinggi daripada resolusi saat pra-pelatihan?",
        "options": [
            "Memangkas token patch tambahan secara acak",
            "Melakukan interpolasi bicubic 2D pada matriks positional embedding pra-latih agar sesuai dengan grid baru",
            "Menambahkan nol (zero-padding) pada token patch yang melebihi batas",
            "Melatih ulang seluruh matriks bobot encoder dari awal"
        ],
        "correctIndex": 1,
        "explanation": "Ketika resolusi citra meningkat, jumlah patch N bertambah. ViT melakukan interpolasi bicubic 2D pada grid positional embedding terpelajari pra-latih untuk memetakan koordinat spasial kontinu ke resolusi baru."
    }
})

# ==============================================================================
# Subbab 14.5: Multi-Head Self-Attention (MHSA) pada Patch Citra
# ==============================================================================
code_14_5 = r'''import numpy as np

# Implementasi Multi-Head Self-Attention (MHSA) NumPy Murni
np.random.seed(42)

def softmax(x, axis=-1):
    e_x = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e_x / np.sum(e_x, axis=axis, keepdims=True)

# Parameter: Batch=1, SeqLen=5 (1 CLS + 4 Patches), D=16, NumHeads=2
B, N, D = 1, 5, 16
H = 2
d_k = D // H

X = np.random.randn(B, N, D)

# Bobot Proyeksi Q, K, V dan Output Proyeksi W_o
W_q = np.random.randn(D, D) * 0.1
W_k = np.random.randn(D, D) * 0.1
W_v = np.random.randn(D, D) * 0.1
W_o = np.random.randn(D, D) * 0.1

# 1. Proyeksi Linear
Q = np.matmul(X, W_q).reshape(B, N, H, d_k).transpose(0, 2, 1, 3) # (B, H, N, d_k)
K = np.matmul(X, W_k).reshape(B, N, H, d_k).transpose(0, 2, 1, 3)
V = np.matmul(X, W_v).reshape(B, N, H, d_k).transpose(0, 2, 1, 3)

# 2. Scaled Dot-Product Attention: Softmax(Q K^T / sqrt(d_k)) V
scores = np.matmul(Q, K.transpose(0, 1, 3, 2)) / np.sqrt(d_k) # (B, H, N, N)
attn_weights = softmax(scores, axis=-1)
head_out = np.matmul(attn_weights, V) # (B, H, N, d_k)

# 3. Penggabungan Head (Concatenation) dan Proyeksi Akhir
out_concat = head_out.transpose(0, 2, 1, 3).reshape(B, N, D)
output = np.matmul(out_concat, W_o)

print(f"Bentuk Matriks Bobot Atensi (Per Head) : {attn_weights.shape} -> (Batch, Heads, Token, Token)")
print(f"Distribusi Bobot Atensi Token CLS Head 0 : {attn_weights[0, 0, 0]}")
print(f"Total Jumlah Bobot Atensi Baris CLS      : {np.sum(attn_weights[0, 0, 0]):.4f}")
print(f"Dimensi Output Multi-Head Self-Attention : {output.shape}")
'''

subchapters.append({
    "id": "cv-14-5-multi-head-self-attention-patches",
    "title": "14.5. Multi-Head Self-Attention (MHSA) pada Patch Citra",
    "description": "Perumusan analitis mekanisme Scaled Dot-Product Attention multi-kepala untuk pemetaan relasi non-lokal antar-wilayah visual dalam ruang laten berdimensi tinggi.",
    "content": r"""Inti komputasi yang memberikan daya ekspresi luar biasa pada Vision Transformer adalah mekanisme **Multi-Head Self-Attention (MHSA)**. Mekanisme ini memungkinkan setiap patch citra untuk menimbang relevansi semantik relatif terhadap seluruh patch lainnya secara dinamis.

Diberikan matriks token masukan $\mathbf{Z} \in \mathbb{R}^{N \times D}$. Matriks ini diproyeksikan secara linear menjadi tiga representasi: **Query ($\mathbf{Q}$)**, **Key ($\mathbf{K}$)**, dan **Value ($\mathbf{V}$)**:
$$\mathbf{Q} = \mathbf{Z} \mathbf{W}_Q, \quad \mathbf{K} = \mathbf{Z} \mathbf{W}_K, \quad \mathbf{V} = \mathbf{Z} \mathbf{W}_V$$
di mana $\mathbf{W}_Q, \mathbf{W}_K, \mathbf{W}_V \in \mathbb{R}^{D \times D}$.

### 1. Scaled Dot-Product Attention
Skor keselarasan antar-patch dihitung melalui perkalian titik (*dot product*) antara Query dan Key. Untuk mencegah nilai dot-product yang terlalu besar pada dimensi tinggi yang dapat mendorong fungsi softmax ke daerah gradien mendekati nol (*vanishing gradient*), skor diskalakan dengan faktor $\frac{1}{\sqrt{d_k}}$:
$$\mathbf{A} = \operatorname{Softmax}\left(\frac{\mathbf{Q} \mathbf{K}^T}{\sqrt{d_k}}\right)$$
Matriks atensi $\mathbf{A} \in \mathbb{R}^{N \times N}$ memuat bobot probabilistik baris di mana $\sum_{j=1}^N A_{ij} = 1$. Representasi akhir merupakan kombinasi linear berbobot dari matriks Value:
$$\operatorname{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \mathbf{A} \mathbf{V}$$

### 2. Multi-Head Formulation
Daripada melakukan fungsi atensi tunggal pada dimensi $D$, representasi dipecah menjadi $h$ kepala (*heads*) independen dengan dimensi $d_k = D / h$:
$$\operatorname{MHSA}(\mathbf{Z}) = [\operatorname{head}_1; \, \operatorname{head}_2; \dots; \, \operatorname{head}_h] \mathbf{W}_O$$
di mana setiap kepala $\operatorname{head}_i = \operatorname{Attention}(\mathbf{Q}_i, \mathbf{K}_i, \mathbf{V}_i)$ memproyeksikan token ke sub-ruang representasi berbeda.

Dalam domain visi komputer, visualisasi bobot atensi per kepala mengungkapkan spesialisasi fungsional yang menakjubkan: beberapa kepala memusatkan perhatian pada batas siluet lokal objek (*edge/boundary heads*), sementara kepala lainnya secara langsung menghubungkan bagian anatomi yang terpisah jauh (*semantic part heads*).""",
    "codeSnippet": code_14_5,
    "commonPitfalls": [
        "Lupa membagi matriks skor dengan faktor penskala $\sqrt{d_k}$ yang menyebabkan nilai softmax tersaturasi menjadi matriks one-hot ekstrem dan menghentikan pembaruan gradien.",
        "Mengabaikan kompleksitas memori penyimpanan matriks atensi $\mathcal{O}(B \times h \times N^2)$ yang dapat memicu Out-Of-Memory (OOM) pada inferensi citra besar."
    ],
    "canonicalReferences": [
        {
            "title": "Attention Is All You Need",
            "authors": ["Ashish Vaswani et al."],
            "url": "https://arxiv.org/abs/1706.03762",
            "relevance": "Perumusan formal Scaled Dot-Product Attention dan Multi-Head Attention."
        }
    ],
    "quiz": {
        "question": "Mengapa perkalian dot product antara matriks Query dan Key harus diskalakan dengan pembagian sqrt(d_k)?",
        "options": [
            "Untuk menjamin matriks atensi berukuran persegi N x N",
            "Untuk mencegah magnitudo nilai menjadi terlalu besar pada dimensi tinggi yang menyebabkan gradien softmax mendekati nol",
            "Untuk mengubah representasi bilangan floating-point menjadi integer biner",
            "Untuk memastikan jumlah elemen pada matriks Query sama dengan matriks Value"
        ],
        "correctIndex": 1,
        "explanation": "Pada dimensi d_k yang besar, dot product bertumbuh besar dalam magnitudo, mendorong fungsi softmax ke daerah dengan gradien sangat kecil (vanishing gradient). Penskalaan dengan 1/sqrt(d_k) menstabilkan varians skor dot product ke 1."
    }
})

# ==============================================================================
# Subbab 14.6: Kompleksitas Komputasi Kuadratik ViT terhadap Resolusi Citra
# ==============================================================================
code_14_6 = r'''import numpy as np

# Analisis Komparasi Kompleksitas Komputasi Kuadratik ViT vs Linier CNN terhadap Resolusi
def compute_flops(resolution, patch_size=16, hidden_dim=768, cnn_channels=64):
    H = W = resolution
    # ViT: N = (H/P) * (W/P)
    N = (H // patch_size) * (W // patch_size)
    
    # Kompleksitas MHSA: O(N * D^2 + N^2 * D)
    # 1. Proyeksi Linear Q, K, V: 3 * 2 * N * D^2
    flops_qkv = 6 * N * (hidden_dim ** 2)
    # 2. Attention Score (Q * K^T): 2 * N^2 * D
    flops_attn_score = 2 * (N ** 2) * hidden_dim
    # 3. Context Projection (A * V): 2 * N^2 * D
    flops_attn_context = 2 * (N ** 2) * hidden_dim
    # 4. Out Projection W_o: 2 * N * D^2
    flops_out = 2 * N * (hidden_dim ** 2)
    vit_flops = flops_qkv + flops_attn_score + flops_attn_context + flops_out
    
    # CNN Layer 3x3: 2 * K^2 * C_in * C_out * H * W
    cnn_flops = 2 * (3 * 3) * cnn_channels * cnn_channels * H * W
    
    return N, vit_flops, cnn_flops

resolutions = [224, 448, 896]
print("Skalabilitas Komputasi Terhadap Peningkatan Resolusi Citra (Patch 16x16, D=768):")
for r in resolutions:
    N, vit_f, cnn_f = compute_flops(r)
    print(f"Resolusi {r}x{r} -> Token (N)={N:4d} | ViT MHSA: {vit_f/1e9:6.2f} GFLOPs | CNN Layer: {cnn_f/1e9:5.2f} GFLOPs")

print("\nObservasi:")
print("Ketika resolusi naik 4x (224 -> 896), jumlah token N naik 16x lipat.")
print("Komponen N^2 pada ViT menyebabkan beban komputasi melonjak drastis secara kuadratik!")
'''

subchapters.append({
    "id": "cv-14-6-quadratic-computational-complexity-vit",
    "title": "14.6. Kompleksitas Komputasi Kuadratik ViT terhadap Resolusi Citra",
    "description": "Dekomposisi analitis batasan bottleneck memori dan komputasi kuadratik O(N^2) pada mekanisme atensi global standar ketika memproses citra resolusi tinggi.",
    "content": r"""Meskipun arsitektur Vision Transformer standar memiliki kapasitas representasi global yang sangat kuat, model ini menghadapi kendala komputasi yang berat ketika diaplikasikan pada citra beresolusi tinggi (misalnya untuk tugas deteksi objek padat dan segmentasi semantik tingkat piksel).

Kendala ini bersumber dari **kompleksitas kuadratik** mekanisme Scaled Dot-Product Attention terhadap panjang sekuens token $N$:

### 1. Dekomposisi Flop Atensi
Untuk sekuens dengan $N$ token dan dimensi embedding $D$:
1. **Proyeksi Linear ($\mathbf{Q}, \mathbf{K}, \mathbf{V}$)**:
   Masing-masing operasi berdimensi $N \times D$ dikalikan $D \times D$, menghasilkan kompleksitas:
   $$\mathcal{O}_{\text{proj}} = 3 \times 2 N D^2 = \mathcal{O}(N D^2)$$
2. **Matriks Kesamaan Atensi ($\mathbf{Q} \mathbf{K}^T$)**:
   Perkalian matriks $(N \times d_k) \times (d_k \times N)$ untuk seluruh $h$ kepala menghasilkan matriks berukuran $N \times N$:
   $$\mathcal{O}_{\text{score}} = 2 N^2 D = \mathcal{O}(N^2 D)$$
3. **Agregasi Nilai ($\mathbf{A} \mathbf{V}$)**:
   Perkalian matriks $(N \times N) \times (N \times d_k)$ untuk seluruh kepala:
   $$\mathcal{O}_{\text{value}} = 2 N^2 D = \mathcal{O}(N^2 D)$$

Total kompleksitas waktu dan alokasi memori per blok atensi adalah:
$$\mathcal{O}(\operatorname{ViT-Layer}) = \mathcal{O}(N D^2 + N^2 D)$$

### 2. Efek Eskalasi Resolusi Spasial
Jumlah token $N$ berbanding lurus dengan kuadrat resolusi spasial citra input:
$$N = \frac{H \times W}{P^2}$$
Jika resolusi citra digandakan dari $224 \times 224$ menjadi $448 \times 448$ dengan ukuran patch tetap $P = 16$:
- Jumlah patch $N$ melonjak $4 \times$ lipat (dari $196$ menjadi $784$).
- Beban komputasi matriks atensi $N^2 D$ melonjak sebesar $4^2 = 16 \times$ lipat!
- Kebutuhan memori penyimpanan tensor atensi $(B \times h \times N \times N)$ melonjak $16 \times$ lipat.

Karakteristik kuadratik $\mathcal{O}(N^2)$ ini menjadi penghalang utama penggunaan ViT standar untuk tugas-tugas *dense prediction* (seperti segmentasi medis $1024 \times 1024$ atau deteksi objek citra satelit), yang kemudian memicu lahirnya inovasi arsitektur berjendela hierarkis seperti **Swin Transformer**.""",
    "codeSnippet": code_14_6,
    "commonPitfalls": [
        "Mencoba melatih ViT standar pada citra resolusi tinggi (misal $1024 \times 1024$) dengan patch kecil ($P=8$) tanpa teknik optimasi memori seperti FlashAttention atau gradient checkpointing.",
        "Mengasumsikan bahwa menambah kedalaman layer lebih membebani memori daripada meningkatkan resolusi citra masukan."
    ],
    "canonicalReferences": [
        {
            "title": "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows",
            "authors": ["Ze Liu et al."],
            "url": "https://arxiv.org/abs/2103.14030",
            "relevance": "Analisis teoritis bottleneck kuadratik ViT konvensional dan perbandingan kompleksitas komputasi."
        }
    ],
    "quiz": {
        "question": "Jika resolusi citra input dinaikkan 2 kali lipat pada sumbu horizontal dan 2 kali lipat pada sumbu vertikal (total piksel 4x lipat), berapa kali lipat kenaikan memori matriks atensi (Q K^T) pada ViT?",
        "options": ["2 kali lipat", "4 kali lipat", "8 kali lipat", "16 kali lipat"],
        "correctIndex": 3,
        "explanation": "Jumlah patch N bertambah 4x lipat (2 x 2). Karena matriks atensi berukuran N x N, kebutuhan memori penyimpanan matriks tersebut melonjak sebesar N^2 = 4^2 = 16 kali lipat."
    }
})

# ==============================================================================
# Subbab 14.7: Swin Transformer: Hierarchical Vision Transformer
# ==============================================================================
code_14_7 = r'''import numpy as np

# Simulasi Struktur Hierarkis 4-Tahap Swin Transformer (Swin-T)
# Citra Input: 224 x 224 x 3, Patch Dasar 4x4 piksel

def swin_stage_hierarchy(H=224, W=224, C=3, base_patch=4, C_dim=96):
    stages = []
    current_h = H // base_patch
    current_w = W // base_patch
    current_c = C_dim
    
    for stage_idx in range(1, 5):
        num_patches = current_h * current_w
        stages.append({
            "stage": stage_idx,
            "resolution": f"{current_h}x{current_w}",
            "channels": current_c,
            "total_tokens": num_patches,
            "scale": f"1/{2**(stage_idx+1)}"
        })
        # Patch Merging menurunkan resolusi spasial 2x dan melipatgandakan kanal 2x
        current_h //= 2
        current_w //= 2
        current_c *= 2
        
    return stages

hierarchy = swin_stage_hierarchy()
print("Struktur Representasi Hierarkis Swin Transformer (Piramidal):")
for s in hierarchy:
    print(f"Stage {s['stage']} -> Resolusi Fitur: {s['resolution']:7s} | Dimensi Kanal: {s['channels']:4d} | Skala Relatif: {s['scale']}")

print("\nKeunggulan Arsitektur:")
print("Menghasilkan representasi multi-skala piramidal yang kompatibel langsung dengan FPN untuk Deteksi & Segmentasi.")
'''

subchapters.append({
    "id": "cv-14-7-swin-transformer-hierarchical-design",
    "title": "14.7. Swin Transformer (Liu et al., ICCV 2021): Hierarchical Vision Transformer",
    "description": "Desain arsitektur Swin Transformer: konstruksi representasi piramidal hierarkis multi-skala yang menjembatani keunggulan Transformer dengan efisiensi linier O(N).",
    "content": r"""Untuk mengatasi batasan komputasi kuadratik ViT dan memungkinkannya berfungsi sebagai backbone serbaguna (*general-purpose backbone*) untuk seluruh spektrum tugas visi komputer, Liu et al. (ICCV 2021) memperkenalkan **Swin Transformer** (*Shifted Window Transformer*).

Swin Transformer mengintegrasikan dua prinsip arsitektural kunci:
1. **Representasi Fitur Hierarkis (Hierarchical Feature Representation)**.
2. **Komputasi Self-Attention Berjendela Lokal (Shifted Window Self-Attention)** dengan kompleksitas linear terhadap ukuran citra.

### 1. Struktur Piramidal Multi-Tahap (4 Stages)
Berbeda dari ViT standar yang mempertahankan resolusi spasial konstan ($N$ token berdimensi $D$) sepanjang seluruh lapisan encoder, Swin Transformer membangun representasi hierarkis piramidal mirip dengan ResNet:
- **Patch Partition**: Citra masukan $H \times W \times 3$ dipartisi menggunakan patch kecil berukuran $4 \times 4$ piksel. Dimensi awal fitur adalah $\frac{H}{4} \times \frac{W}{4} \times 48$.
- **Linear Embedding**: Memetakan fitur ke dimensi awal $C$ (misal $C = 96$ pada Swin-Tiny).
- **Stage 1**: Mempertahankan resolusi spasial $\frac{H}{4} \times \frac{W}{4}$ dengan dimensi kanal $C$.
- **Stage 2**: Melalui lapisan *Patch Merging*, resolusi spasial diturunkan menjadi $\frac{H}{8} \times \frac{W}{8}$ dan kanal ditingkatkan menjadi $2C$.
- **Stage 3**: Resolusi diturunkan menjadi $\frac{H}{16} \times \frac{W}{16}$ dan kanal ditingkatkan menjadi $4C$.
- **Stage 4**: Resolusi diturunkan menjadi $\frac{H}{32} \times \frac{W}{32}$ dan kanal ditingkatkan menjadi $8C$.

### 2. Kompatibilitas dengan Dense Prediction
Struktur resolusi multi-skala bertingkat ($\frac{1}{4}, \frac{1}{8}, \frac{1}{16}, \frac{1}{32}$) ini memungkinkan Swin Transformer untuk dipasangkan secara langsung (*plug-and-play*) dengan arsitektur **Feature Pyramid Networks (FPN)**, U-Net, dan Mask R-CNN. Karakteristik ini sebelumnya mustahil dilakukan secara optimal menggunakan ViT konvensional tanpa modul adaptasi resolusi yang sangat membebani komputasi.""",
    "codeSnippet": code_14_7,
    "commonPitfalls": [
        "Menghubungkan output ViT bertipe resolusi tunggal (single-scale) ke FPN tanpa dekonvolusi atau interpolasi resolusi multi-tingkat.",
        "Mengabaikan ukuran patch awal $4 \times 4$ pada Swin yang menghasilkan jumlah token awal 16x lebih banyak daripada ViT patch $16 \times 16$."
    ],
    "canonicalReferences": [
        {
            "title": "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows",
            "authors": ["Ze Liu", "Yutong Lin", "Yue Cao", "Han Hu", "Yixuan Wei", "Zheng Zhang", "Stephen Lin", "Baining Guo"],
            "url": "https://arxiv.org/abs/2103.14030",
            "relevance": "Paper pemenang ICCV 2021 Marr Prize yang mendirikan paradigma hierarkis Swin Transformer."
        }
    ],
    "quiz": {
        "question": "Mengapa struktur fitur hierarkis multi-skala pada Swin Transformer sangat penting untuk tugas Object Detection dan Semantic Segmentation?",
        "options": [
            "Karena membuat model dapat berjalan tanpa normalisasi gradien",
            "Karena menyediakan peta fitur multi-resolusi yang cocok langsung diintegrasikan dengan Feature Pyramid Networks (FPN)",
            "Karena meniadakan kebutuhan akan fungsi aktivasi non-linear",
            "Karena mengubah token citra menjadi representasi vektor satu dimensi murni"
        ],
        "correctIndex": 1,
        "explanation": "Deteksi objek dan segmentasi semantik membutuhkan fitur beresolusi tinggi untuk objek kecil dan fitur beresolusi rendah kaya semantik untuk objek besar. Arsitektur hierarkis Swin menyediakan peta fitur multi-skala alami yang kompatibel dengan FPN."
    }
})

# ==============================================================================
# Subbab 14.8: Shifted Window Self-Attention (W-MSA & SW-MSA)
# ==============================================================================
code_14_8 = r'''import numpy as np

# Simulasi Shifted Window Masking dan Komparasi Kompleksitas Swin vs ViT
# Jendela lokal M x M (misal M=7)

def compare_attention_complexity(H=56, W=56, M=7, D=96):
    # Luas citra: N token
    N = H * W
    
    # 1. Global Multi-Head Self-Attention (ViT Standard)
    flops_vit_global = 4 * N * (D ** 2) + 2 * (N ** 2) * D
    
    # 2. Window-Based Multi-Head Self-Attention (Swin W-MSA)
    # Jumlah jendela: (H/M) * (W/M)
    # Flop per jendela: 4 * M^2 * D^2 + 2 * M^4 * D
    num_windows = (H // M) * (W // M)
    flops_swin_window = num_windows * (4 * (M ** 2) * (D ** 2) + 2 * (M ** 4) * D)
    
    return flops_vit_global, flops_swin_window, flops_vit_global / flops_swin_window

flops_vit, flops_swin, ratio = compare_attention_complexity(H=56, W=56, M=7, D=96)
print("Efisiensi Komputasi Atensi pada Feature Map 56x56 piksel (N=3136 token):")
print(f"ViT Global Self-Attention   : {flops_vit / 1e6:.2f} MFLOPs")
print(f"Swin Local Window Attention : {flops_swin / 1e6:.2f} MFLOPs")
print(f"Akselerasi Penghematan      : {ratio:.2f}x lebih efisien!")
print("\nShifted Window (SW-MSA) menggeser koordinat jendela sejauh (M//2, M//2) = (3, 3)")
print("untuk menghubungkan informasi batas antar-jendela tanpa overhead komputasi.")
'''

subchapters.append({
    "id": "cv-14-8-shifted-window-self-attention",
    "title": "14.8. Shifted Window Self-Attention (W-MSA & SW-MSA)",
    "description": "Formulasi komputasi atensi berjendela lokal W-MSA dan mekanisme pergeseran jendela SW-MSA dengan masking efisien untuk pertukaran informasi lintas batas.",
    "content": r"""Untuk mencapai kompleksitas komputasi linear terhadap ukuran citra, Swin Transformer membatasi komputasi self-attention hanya di dalam **jendela lokal non-overlapping (local windows)** berukuran $M \times M$ patch (secara default $M = 7$).

### 1. Window-based Multi-Head Self-Attention (W-MSA)
Diberikan citra atau peta fitur berukuran $h \times w$ patch. Citra dipartisi secara merata menjadi $\lceil \frac{h}{M} \rceil \times \lceil \frac{w}{M} \rceil$ jendela independen.

Komparasi komputasi antara Global MSA standar dan Window-based MSA:
$$\mathcal{O}(\operatorname{Global-MSA}) = 4 h w D^2 + 2 (h w)^2 D$$
$$\mathcal{O}(\operatorname{W-MSA}) = 4 h w D^2 + 2 M^2 (h w) D$$
Karena ukuran jendela $M$ bernilai konstan tetap (misal $M=7$), suku $(hw)^2$ yang bersifat kuadratik berubah menjadi suku linear $M^2(hw) \propto \mathcal{O}(N)$, menghasilkan efisiensi komputasi yang masif pada resolusi tinggi.

### 2. Shifted Window Self-Attention (SW-MSA)
Kelemahan utama W-MSA adalah ketiadaan pertukaran informasi antar-jendela yang berbeda (terisolasi secara lokal). Untuk mengatasi hal ini tanpa mengorbankan efisiensi, Swin Transformer menerapkan skema berulang dua blok berurutan:
1. **Blok Pertama**: Menjalankan W-MSA reguler dengan partisi jendela mulai dari koordinat $(0, 0)$.
2. **Blok Kedua**: Menjalankan **Shifted Window (SW-MSA)** di mana jendela spasial digeser secara diagonal sejauh $(\lfloor \frac{M}{2} \rfloor, \lfloor \frac{M}{2} \rfloor) = (3, 3)$ piksel patch dari konfigurasi blok sebelumnya.

Pergeseran ini secara alami menghubungkan batas-batas jendela tetangga pada blok sebelumnya, memungkinkan representasi visual mengalir melintasi seluruh citra secara hierarkis.

### 3. Efisiensi Cyclic Shift & Masking
Pergeseran jendela menyebabkan bertambahnya jumlah jendela dari $\frac{h}{M} \times \frac{w}{M}$ menjadi $(\frac{h}{M} + 1) \times (\frac{w}{M} + 1)$, dan beberapa jendela di tepi memiliki ukuran lebih kecil dari $M \times M$.

Swin Transformer menyelesaikan masalah ini secara brilian menggunakan **Cyclic Shifting**: bagian tepi yang terpotong digeser secara siklik ke sisi berlawanan sehingga ukuran matriks tetap $M \times M$. Sebuah **masking atensi khusus (attention mask)** bernilai $-\infty$ kemudian diterapkan pada sub-wilayah yang tidak bersebelahan di dunia nyata, menjamin bahwa hanya piksel yang sah yang dapat saling memberi bobot atensi.""",
    "codeSnippet": code_14_8,
    "commonPitfalls": [
        "Tidak menerapkan attention mask pada SW-MSA setelah pergeseran siklik, yang mengakibatkan patch dari sudut kiri-atas berinteraksi secara keliru dengan patch dari sudut kanan-bawah.",
        "Mengubah ukuran jendela $M$ secara dinamis tanpa memastikan bahwa dimensi peta fitur $H$ dan $W$ dapat dibagi habis oleh $M$."
    ],
    "canonicalReferences": [
        {
            "title": "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows",
            "authors": ["Ze Liu et al."],
            "url": "https://arxiv.org/abs/2103.14030",
            "relevance": "Desain W-MSA, SW-MSA, dan implementasi efisien batch computation dengan cyclic shift dan masked attention."
        }
    ],
    "quiz": {
        "question": "Berapa jarak pergeseran (displacement) koordinat jendela spasial yang diterapkan pada mekanisme SW-MSA jika ukuran jendela lokal M = 7?",
        "options": ["(1, 1)", "(3, 3)", "(7, 7)", "(14, 14)"],
        "correctIndex": 1,
        "explanation": "Swin Transformer menggeser koordinat jendela sejauh floor(M/2) pada kedua sumbu. Untuk M=7, pergeserannya adalah floor(7/2) = 3 patch secara horizontal dan vertikal: (3, 3)."
    }
})

# ==============================================================================
# Subbab 14.9: Patch Merging untuk Reduksi Dimensi Piramidal
# ==============================================================================
code_14_9 = r'''import numpy as np

# Implementasi Operasi Patch Merging Swin Transformer NumPy Murni
np.random.seed(42)

def patch_merging(x, W_down):
    # x: (B, H, W, C)
    B, H, W, C = x.shape
    assert H % 2 == 0 and W % 2 == 0, "H dan W harus genap"
    
    # Ambil 4 sub-piksel tetangga 2x2
    x0 = x[:, 0::2, 0::2, :] # (B, H/2, W/2, C)
    x1 = x[:, 1::2, 0::2, :] # (B, H/2, W/2, C)
    x2 = x[:, 0::2, 1::2, :] # (B, H/2, W/2, C)
    x3 = x[:, 1::2, 1::2, :] # (B, H/2, W/2, C)
    
    # Konkatenasi pada sumbu kanal: (B, H/2, W/2, 4C)
    x_concat = np.concatenate([x0, x1, x2, x3], axis=-1)
    
    # Proyeksi linear ke dimensi 2C: W_down berukuran (4C, 2C)
    out = np.matmul(x_concat, W_down)
    return out

B, H, W, C = 1, 8, 8, 16
x_in = np.random.randn(B, H, W, C)
W_down = np.random.randn(4 * C, 2 * C) * 0.1

x_out = patch_merging(x_in, W_down)

print(f"Dimensi Input Tensor Sebelum Patch Merging : {x_in.shape} (H={H}, W={W}, C={C})")
print(f"Dimensi Output Tensor Setelah Patch Merging: {x_out.shape} (H/2={H//2}, W/2={W//2}, 2C={2*C})")
print("Hasil: Resolusi spasial turun 2x, kapasitas representasi kanal berlipat ganda 2x.")
'''

subchapters.append({
    "id": "cv-14-9-patch-merging-pyramidal-reduction",
    "title": "14.9. Patch Merging untuk Reduksi Dimensi Piramidal",
    "description": "Mekanisme downsampling spasial berbasis pengelompokan sub-patch dan proyeksi linear untuk mereduksi resolusi dan melipatgandakan dimensi kanal.",
    "content": r"""Pada CNN tradisional, reduksi resolusi spasial dan penggandaan kapasitas representasi fitur dilakukan melalui lapisan **Strided Convolution** atau **Max Pooling**. Pada arsitektur Vision Transformer, mekanisme yang setara dan menjaga integritas representasi tensor adalah **Patch Merging**.

Lapisan Patch Merging ditempatkan di antara setiap tahap (*stage*) pada Swin Transformer (antara Stage 1-2, Stage 2-3, dan Stage 3-4).

### 1. Sampling Spasial $2 \times 2$
Diberikan peta fitur masukan $\mathbf{X} \in \mathbb{R}^{H \times W \times C}$. Patch Merging membagi fitur menjadi empat grup sub-piksel berdasarkan paritas koordinat genap/ganjil:
$$\mathbf{X}_{00} = \mathbf{X}[0::2, 0::2, :] \in \mathbb{R}^{\frac{H}{2} \times \frac{W}{2} \times C}$$
$$\mathbf{X}_{10} = \mathbf{X}[1::2, 0::2, :] \in \mathbb{R}^{\frac{H}{2} \times \frac{W}{2} \times C}$$
$$\mathbf{X}_{01} = \mathbf{X}[0::2, 1::2, :] \in \mathbb{R}^{\frac{H}{2} \times \frac{W}{2} \times C}$$
$$\mathbf{X}_{11} = \mathbf{X}[1::2, 1::2, :] \in \mathbb{R}^{\frac{H}{2} \times \frac{W}{2} \times C}$$

### 2. Konkatenasi dan Proyeksi Linear
Keempat tensor berukuran $\frac{H}{2} \times \frac{W}{2} \times C$ ini digabungkan (*concatenated*) sepanjang sumbu kanal fitur:
$$\mathbf{X}_{\text{concat}} = [\mathbf{X}_{00}; \, \mathbf{X}_{10}; \, \mathbf{X}_{01}; \, \mathbf{X}_{11}] \in \mathbb{R}^{\frac{H}{2} \times \frac{W}{2} \times 4C}$$
Penggabungan ini menghasilkan tensor dengan resolusi spasial setengah dari resolusi semula tetapi memiliki dimensi kanal $4C$.

Untuk mengontrol pertumbuhan dimensi parameter agar tetap sejalan dengan prinsip piramidal standar ($2C$), sebuah lapisan normalisasi (LayerNorm) dan proyeksi linear diterapkan:
$$\mathbf{X}_{\text{out}} = \operatorname{LN}(\mathbf{X}_{\text{concat}}) \mathbf{W}_{\text{down}}$$
di mana matriks bobot proyeksi $\mathbf{W}_{\text{down}} \in \mathbb{R}^{4C \times 2C}$.

Hasil akhir operasi Patch Merging adalah tensor representasi baru $\mathbf{X}_{\text{out}} \in \mathbb{R}^{\frac{H}{2} \times \frac{W}{2} \times 2C}$, yang berhasil menurunkan resolusi spasial sebesar $2 \times$ lipat dan menggandakan kapasitas representasi semantik kanal sebesar $2 \times$ lipat tanpa kehilangan informasi akibat pooling destruktif.""",
    "codeSnippet": code_14_9,
    "commonPitfalls": [
        "Mengabaikan pengecekan dimensi genap ($H$ dan $W$ kelipatan 2) yang menyebabkan error slicing indeks ganjil pada implementasi Patch Merging.",
        "Menggantikan Patch Merging dengan Max Pooling sederhana yang membuang 75% informasi piksel tanpa bobot adaptif terpelajari."
    ],
    "canonicalReferences": [
        {
            "title": "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows",
            "authors": ["Ze Liu et al."],
            "url": "https://arxiv.org/abs/2103.14030",
            "relevance": "Deskripsi mekanisme operasional Patch Merging untuk pembentukan hierarki multi-stage."
        }
    ],
    "quiz": {
        "question": "Berapakah dimensi kanal tensor output dari penggabungan 4 sub-patch pada Patch Merging SEBELUM dilewatkan ke proyeksi linear W_down jika kanal input adalah C?",
        "options": ["C", "2C", "4C", "8C"],
        "correctIndex": 2,
        "explanation": "Empat sub-patch berdimensi C (X_00, X_10, X_01, X_11) dikonkatenasikan sepanjang dimensi kanal, menghasilkan 4 x C = 4C sebelum diproyeksikan turun menjadi 2C oleh matriks W_down."
    }
})

# ==============================================================================
# Subbab 14.10: Implementasi Forward-Pass Self-Attention ViT dari Nol dengan NumPy
# ==============================================================================
code_14_10 = r'''import numpy as np

# Implementasi Lengkap Forward-Pass 1 Blok Vision Transformer Encoder (Pre-LN)
np.random.seed(42)

def layer_norm(x, eps=1e-6):
    mean = np.mean(x, axis=-1, keepdims=True)
    var = np.var(x, axis=-1, keepdims=True)
    return (x - mean) / np.sqrt(var + eps)

def gelu(x):
    return 0.5 * x * (1.0 + np.tanh(np.sqrt(2.0 / np.pi) * (x + 0.044715 * np.power(x, 3))))

class ViTEncoderBlockNumPy:
    def __init__(self, d_model=32, num_heads=4, mlp_ratio=4):
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        d_mlp = d_model * mlp_ratio
        
        # Bobot MHSA
        self.W_qkv = np.random.randn(d_model, 3 * d_model) * 0.05
        self.W_o = np.random.randn(d_model, d_model) * 0.05
        
        # Bobot MLP
        self.W_mlp1 = np.random.randn(d_model, d_mlp) * 0.05
        self.b_mlp1 = np.zeros(d_mlp)
        self.W_mlp2 = np.random.randn(d_mlp, d_model) * 0.05
        self.b_mlp2 = np.zeros(d_model)

    def forward(self, x):
        B, N, D = x.shape
        # --- 1. Multi-Head Self-Attention dengan Pre-LN dan Residual Connection ---
        norm_x1 = layer_norm(x)
        
        qkv = np.matmul(norm_x1, self.W_qkv) # (B, N, 3D)
        qkv = qkv.reshape(B, N, 3, self.num_heads, self.d_k).transpose(2, 0, 3, 1, 4)
        Q, K, V = qkv[0], qkv[1], qkv[2] # Masing-masing (B, H, N, d_k)
        
        scores = np.matmul(Q, K.transpose(0, 1, 3, 2)) / np.sqrt(self.d_k)
        scores_max = np.max(scores, axis=-1, keepdims=True)
        attn = np.exp(scores - scores_max)
        attn = attn / np.sum(attn, axis=-1, keepdims=True)
        
        out_mhsa = np.matmul(attn, V).transpose(0, 2, 1, 3).reshape(B, N, D)
        out_mhsa = np.matmul(out_mhsa, self.W_o)
        
        # Residual 1
        x = x + out_mhsa
        
        # --- 2. Feed-Forward MLP dengan Pre-LN dan Residual Connection ---
        norm_x2 = layer_norm(x)
        mlp_act = gelu(np.matmul(norm_x2, self.W_mlp1) + self.b_mlp1)
        mlp_out = np.matmul(mlp_act, self.W_mlp2) + self.b_mlp2
        
        # Residual 2
        x = x + mlp_out
        return x, attn

block = ViTEncoderBlockNumPy(d_model=32, num_heads=4, mlp_ratio=4)
x_in = np.random.randn(2, 9, 32) # Batch 2, 9 Token (1 CLS + 8 Patches), D=32

x_out, attn_map = block.forward(x_in)

print("Verifikasi Eksekusi Blok ViT Encoder NumPy Murni:")
print(f"Dimensi Input Tensor       : {x_in.shape}")
print(f"Dimensi Output Tensor      : {x_out.shape} (Invariant Preserved)")
print(f"Dimensi Attention Map      : {attn_map.shape} (Batch, Heads, Token, Token)")
print(f"Nilai Rata-rata Output     : {np.mean(x_out):.6f}")
print(f"Varians Output             : {np.var(x_out):.6f}")
print("Status: Forward-pass sukses tanpa error numerik dan bebas dependensi PyTorch.")
'''

subchapters.append({
    "id": "cv-14-10-vit-encoder-numpy-scratch",
    "title": "14.10. Implementasi Forward-Pass Self-Attention ViT dari Nol Menggunakan NumPy Murni",
    "description": "Konstruksi terpadu satu blok penuh Transformer Encoder berstandar Pre-LayerNorm, Multi-Head Self-Attention, dan MLP GeLU menggunakan operasi matriks array NumPy murni.",
    "content": r"""Sebagai sintesis pemahaman arsitektural Bab 14, subbab ini mengonstruksi implementasi forward-pass satu blok penuh **Vision Transformer Encoder** secara mandiri (*from scratch*) hanya menggunakan operasi aljabar linier matriks NumPy murni tanpa pustaka kerangka kerja deep learning eksternal (PyTorch / TensorFlow).

### 1. Arsitektur Blok Transformer Pre-LN
Sesuai standar kontemporer ViT, normalisasi lapisan (**Pre-LayerNorm**) diterapkan sebelum modul atensi dan modul MLP, yang terbukti secara matematis menjamin propagasi gradien yang stabil pada inisialisasi awal tanpa membutuhkan tahapan learning rate warmup yang ekstrem:

$$\mathbf{z}'_\ell = \operatorname{MHSA}(\operatorname{LN}(\mathbf{z}_{\ell-1})) + \mathbf{z}_{\ell-1}$$
$$\mathbf{z}_\ell = \operatorname{MLP}(\operatorname{LN}(\mathbf{z}'_\ell)) + \mathbf{z}'_\ell$$

### 2. Formulasi Komponen Inti
1. **Layer Normalization**:
   Normalisasi dilakukan melintasi sumbu kanal fitur laten $D$ untuk setiap token secara independen:
   $$\operatorname{LN}(\mathbf{x}) = \frac{\mathbf{x} - \mu}{\sqrt{\sigma^2 + \epsilon}}$$
2. **Kombinasi Proyeksi Linear Tunggal $\mathbf{W}_{qkv}$**:
   Alih-alih menghitung tiga perkalian matriks terpisah untuk $\mathbf{Q}, \mathbf{K}, \mathbf{V}$, representasi masukan dikalikan ke matriks terpadu berdimensi $D \times 3D$, yang kemudian dipecah (*split*) dan di-reshape menjadi multi-kepala.
3. **Fungsi Aktivasi GeLU (Gaussian Error Linear Unit)**:
   Aktivasi non-linear probabilistik yang mendominasi model Transformer:
   $$\operatorname{GeLU}(x) \approx 0.5 x \left(1 + \tanh\left(\sqrt{\frac{2}{\pi}} (x + 0.044715 x^3)\right)\right)$$
4. **Sambungan Residual Jalur Ganda**:
   Operator penjumlahan elemen identitas menjaga integritas informasi representasi dasar dari degradasi gradien sepanjang tumpukan lapisan.

Modul yang dibangun mendemonstrasikan secara transparan bagaimana struktur tensor multi-dimensi bertransformasi dari citra spasial menjadi peta atensi probabilitas dinamis.""",
    "codeSnippet": code_14_10,
    "commonPitfalls": [
        "Menerapkan LayerNorm setelah residual addition (Post-LN seperti model lama) yang menyebabkan instabilitas numerik dan kegagalan konvergensi gradien pada ViT dalam.",
        "Lupa melakukan reshape dan transpose pada tensor QKV gabungan dengan urutan sumbu yang benar saat memecah ke representasi multi-head."
    ],
    "canonicalReferences": [
        {
            "title": "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
            "authors": ["Alexey Dosovitskiy et al."],
            "url": "https://arxiv.org/abs/2010.11929",
            "relevance": "Spesifikasi matematis blok ViT Encoder standar Pre-LayerNorm dan aktivasi GeLU."
        }
    ],
    "quiz": {
        "question": "Apa fungsi utama dari sambungan residual (skip connection) x = x + sublayer(LN(x)) pada setiap tahapan blok Transformer?",
        "options": [
            "Menghapus token yang memiliki bobot atensi mendekati nol",
            "Memungkinkan aliran gradien mengalir secara langsung tanpa hambatan selama backpropagation untuk mencegah vanishing gradient",
            "Mengubah representasi token menjadi format biner terkuantisasi",
            "Mereduksi dimensi kanal representasi menjadi setengahnya"
        ],
        "correctIndex": 1,
        "explanation": "Sambungan residual menyediakan jalur pintas identitas bergradien +1, memungkinkan sinyal gradien mengalir tanpa pelemahan eksponensial langsung ke lapisan-lapisan awal jaringan selama backpropagation."
    }
})

output_path = os.path.join(os.path.dirname(__file__), "cv_ch14_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, ensure_ascii=False, indent=2)
print(f"Generated {len(subchapters)} subchapters for Bab 14 -> {output_path}")
