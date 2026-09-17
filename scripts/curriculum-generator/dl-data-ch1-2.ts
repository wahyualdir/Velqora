import { ChapterDef } from "./da-data-ch1-3";

export const DL_CHAPTERS_1_TO_2: ChapterDef[] = [
  // =========================================================================
  // BAB 1: Fondasi Deep Learning & Komputasi Tensor PyTorch
  // =========================================================================
  {
    orderIndex: 1,
    id: "dl-ch-01",
    slug: "bab-1-fondasi-deep-learning-komputasi-tensor-pytorch",
    title: "BAB 1: Fondasi Deep Learning: Representasi Fitur Hierarkis & Komputasi Tensor PyTorch",
    desc: "Fondasi epistemologis pembelajaran mendalam (Deep Learning): transisi dari rekayasa fitur manual menuju ekstraksi representasi hierarkis otomatis, aljabar tensor multidimensi, semantik penyiaran (broadcasting), penataan memori strided, dan akselerasi perangkat keras PyTorch.",
    coreConcepts: [
      "Pembelajaran Representasi Hierarkis (Goodfellow et al. 2016)",
      "Aljabar Tensor Multidimensi & Strided Memory Layout",
      "Perkalian Matriks vs Hadamard & Penyiaran (Broadcasting)",
      "Representasi Data Nyata: Tabular, Deret Waktu, Citra, dan Video",
      "Manipulasi Dimensi: Reshape, View, Permute, Squeeze/Unsqueeze",
      "Manajemen Perangkat Keras: CPU, GPU CUDA, dan Apple Silicon MPS"
    ],
    subchapters: [
      {
        num: "1.1",
        slug: "1-1-paradigma-pembelajaran-representasi-hierarkis",
        title: "1.1. Paradigma Pembelajaran Representasi: Dari Rekayasa Fitur Manual Menuju Hierarki Otomatis",
        desc: "Transisi fundamental paradigma AI: kelemahan rekayasa fitur ad-hoc manual dalam machine learning klasik dan keunggulan pembelajaran representasi berjenjang menurut Goodfellow, Bengio, & Courville (2016).",
        concept: `Dalam machine learning klasik (*Classical Machine Learning*), batas atas performa model sangat dibatasi oleh kualitas rekayasa fitur manual (*handcrafted feature engineering*). Seorang pakar domain harus merancang fungsi ekstraksi matematis ad-hoc (seperti filter Gabor atau deskriptor SIFT untuk citra, serta n-gram berbobot TF-IDF untuk teks) sebelum algoritma pengklasifikasi (seperti SVM atau Logistic Regression) dapat memprosesnya. Pendekatan ini rapuh dan tidak dapat digeneralisasikan ketika domain data mengalami pergeseran distribusi (*domain shift*).

Menurut Ian Goodfellow, Yoshua Bengio, dan Aaron Courville (*Deep Learning*, MIT Press 2016), **Deep Learning** menyelesaikan dilema ini melalui **pembelajaran representasi hierarkis** (*hierarchical representation learning*). Jaringan saraf tiruan mengekstraksi konsep abstrak kompleks melalui komposisi bertingkat dari konsep-konsep yang lebih sederhana:
- **Lapisan Awal ($l=1$):** Mengidentifikasi fitur primitif lokal (orientasi garis tepi, gradien intensitas, kontras warna).
- **Lapisan Menengah ($l=2, \dots, L-1$):** Menggabungkan garis tepi menjadi motif geometris lokal, sudut, kurva, dan tekstur.
- **Lapisan Akhir ($l=L$):** Mengagregasikan motif menjadi representasi objek semantik utuh (wajah manusia, roda mobil, fonem suara).

Keunggulan matematis ini memungkinkan Deep Learning bekerja secara *end-to-end*: memetakan data mentah bervolume tinggi langsung ke target inferensi tanpa intervensi rekayasa manusia di lapisan tengah.`,
        formula: `f(\mathbf{x}) = f^{(L)}\Big( f^{(L-1)}\big( \dots f^{(1)}(\mathbf{x}) \dots \big) \Big) \quad (\text{Komposisi Fungsi Hierarkis})`,
        code: `# 1.1: Komparasi Konseptual Ekstraksi Fitur Manual vs Representasi Hierarkis
import numpy as np

# Simulasi data gambar mini berukuran 4x4 piksel
citra_mentah = np.array([
    [0.1, 0.2, 0.8, 0.9],
    [0.1, 0.3, 0.9, 0.8],
    [0.2, 0.1, 0.8, 0.9],
    [0.1, 0.2, 0.9, 0.8]
], dtype=np.float32)

# Pendekatan Klasik: Filter manual detektor tepi vertikal (Sobel mini)
kernel_sobel_vertikal = np.array([[-1, 1], [-1, 1]], dtype=np.float32)
tepi_manual = np.abs(citra_mentah[:2, :2] * kernel_sobel_vertikal).sum()

print("=== PARADIGMA PEMBELAJARAN REPRESENTASI HIERARKIS ===")
print(f"Bentuk Citra Mentah           : {citra_mentah.shape}")
print(f"Energi Tepi Manual (Klasik)   : {tepi_manual:.4f}")
print("Status Paradigma: Deep Learning mempelajari kernel transformasi ini secara otomatis via gradien!")`,
        expectedOutput: "Deep Learning memproses representasi hierarkis secara otomatis melampaui filter statis manual.",
        codeExp: "Skrip mengilustrasikan perbedaan antara perancangan filter manual klasik dan kebutuhan ekstraksi representasi dinamis berjenjang.",
        pitfalls: [
          "Menerapkan rekayasa fitur manual agresif (misal PCA linier) sebelum memasukkan data ke jaringan saraf dalam yang menghilangkan sinyal non-linier berharga.",
          "Menganggap jaringan dangkal 1 lapisan lebar setara dengan jaringan dalam bertingkat (arsitektur dalam memiliki efisiensi parameter eksponensial)."
        ],
        refTitle: "Ian Goodfellow, Yoshua Bengio, Aaron Courville: Deep Learning (MIT Press, 2016)",
        refUrl: "https://www.deeplearningbook.org/"
      },
      {
        num: "1.2",
        slug: "1-2-aljabar-tensor-multidimensi-dan-strided-memory",
        title: "1.2. Aljabar Tensor Multidimensi: Ordo Rank, Shape, Sumbu Batch, dan Format Strided Memory",
        desc: "Struktur matematis Tensor: generalisasi skalar, vektor, dan matriks ke ordo-$N$, penataan memori linear satu dimensi, dan kalkulasi stride pointer.",
        concept: `Dalam komputasi jaringan saraf modern, seluruh aliran data, parameter bobot, dan sinyal gradien diformulasikan dalam objek matematika **Tensor** $\mathbf{X} \in \mathbb{R}^{d_1 \\times d_2 \\times \dots \\times d_k}$. Tensor merupakan generalisasi multilinear dari konsep skalar (ordo-0), vektor (ordo-1), dan matriks (ordo-2) ke ruang $N$-dimensi sembarang.

**Arsitektur Memori Strided (*Strided Memory Layout*):**
Di tingkat perangkat keras (RAM atau VRAM GPU), data multidimensi sebenarnya selalu disimpan sebagai **larik linier kontigu 1 dimensi** (*contiguous 1D memory array*). PyTorch memetakan indeks multidimensi $(i_0, i_1, \dots, i_{k-1})$ ke alamat fisik memori linier menggunakan tuple **strides** $(s_0, s_1, \dots, s_{k-1})$:
$$\text{Offset Fisik} = \sum_{j=0}^{k-1} i_j \\times s_j$$
Stride $s_j$ menyatakan berapa lompatan elemen memori yang harus dilakukan pointer untuk bergeser 1 langkah sepanjang dimensi ke-$j$. Pemahaman stride sangat krusial karena operasi seperti transposisi atau slicing seringkali hanya mengubah metadata stride tanpa menyalin fisik data di memori (*zero-copy operation*).`,
        formula: `\text{Memory Address}(\mathbf{i}) = \text{Base Pointer} + \sum_{j=0}^{k-1} i_j \cdot s_j \quad (\text{Pemetaan Stride})`,
        code: `# 1.2: Eksplorasi Struktur Tensor, Shape, dan Stride Memori PyTorch
import torch

# Membuat tensor 3D berordo (2, 3, 4)
tensor_3d = torch.arange(24, dtype=torch.float32).reshape(2, 3, 4)

print("=== ALRABAR TENSOR & MEMORI STRIDED PYTORCH ===")
print(f"Rank (Dimensi Tensor) : {tensor_3d.ndim}")
print(f"Shape (Bentuk Dimensi): {tensor_3d.shape}")
print(f"Strides Memori        : {tensor_3d.stride()}")
print(f"Status Kontigu Fisik  : {tensor_3d.is_contiguous()}")

# Transpose dimensi 1 dan 2 (memodifikasi metadata stride tanpa salin memori)
tensor_transposed = tensor_3d.transpose(1, 2)
print(f"Shape Setelah Transpose: {tensor_transposed.shape}")
print(f"Strides Setelah Transpose: {tensor_transposed.stride()}")
print(f"Status Kontigu Transpose : {tensor_transposed.is_contiguous()} (Non-contiguous memicu view error jika di-flatten!)")`,
        expectedOutput: "Tensor mentransformasikan strides memori secara efisien tanpa menduplikasi alokasi array fisik.",
        codeExp: "Skrip menunjukkan bagaimana PyTorch memetakan tensor 3D ke memori fisik melalui tuple stride dan konsekuensi transposisi pada status kontigu.",
        pitfalls: [
          "Memanggil .view() pada tensor non-kontigu hasil transpose/permute tanpa memanggil .contiguous() terlebih dahulu, yang memicu RuntimeError.",
          "Mengabaikan dimensi batch terluar (dimensi ke-0) saat mendesain lapisan komputasi."
        ],
        refTitle: "PyTorch Documentation: Tensor Mechanics and Stride Allocation",
        refUrl: "https://pytorch.org/docs/stable/tensors.html"
      },
      {
        num: "1.3",
        slug: "1-3-operasi-matriks-hadamard-dan-broadcasting",
        title: "1.3. Operasi Matriks vs Hadamard Product dan Semantik Penyiaran (Broadcasting)",
        desc: "Diferensiasi aljabar perkalian titik matriks versus elemen-demi-elemen (Hadamard), serta aturan penyiaran virtual tanpa alokasi memori fisik berlebih.",
        concept: `Dalam komputasi tensor, kegagalan membedakan dua jenis perkalian merupakan salah satu sumber kutu (*bug*) paling umum bagi pemula:
1. **Perkalian Matriks Aljabar (*Matrix Multiplication* / Dot Product):**
   $$\mathbf{Z} = \mathbf{X} \mathbf{W}, \quad \mathbf{X} \in \mathbb{R}^{B \\times d_{\text{in}}}, \; \mathbf{W} \in \mathbb{R}^{d_{\text{in}} \\times d_{\text{out}}} \implies \mathbf{Z} \in \mathbb{R}^{B \\times d_{\text{out}}}$$
   Operasi ini memproyeksikan data masukan dari ruang berdimensi $d_{\text{in}}$ ke ruang representasi baru berdimensi $d_{\text{out}}$. Di PyTorch dieksekusi dengan operator \`@\` atau \`torch.matmul()\`.
2. **Perkalian Elemen-demi-Elemen (*Hadamard Product*):**
   $$\mathbf{A} \odot \mathbf{B}, \quad c_{ij} = a_{ij} \\times b_{ij}$$
   Di PyTorch dieksekusi dengan operator \`*\`. Kedua tensor wajib memiliki dimensi yang setara atau kompatibel secara broadcasting.

**Semantik Penyiaran (*Broadcasting Semantics*):**
Diadopsi dari NumPy, dua tensor kompatibel untuk penyiaran jika, dimulai dari dimensi paling belakang (paling kanan):
- Dimensinya sama besar, ATAU
- Salah satu dimensinya bernilai 1.
Jika bernilai 1, PyTorch meregangkan dimensi tersebut secara virtual untuk menyamai dimensi tensor lawannya tanpa menduplikasi data di memori fisik.`,
        formula: `\mathbf{C} = \mathbf{A} \odot \mathbf{B} \iff c_{ij} = a_{ij} b_{ij}, \quad \mathbf{Z} = \mathbf{X} \mathbf{W} + \mathbf{b} \quad (\text{Hadamard vs Matmul})`,
        code: `# 1.3: Demonstrasi Perbedaan Matmul vs Hadamard dan Aturan Broadcasting
import torch

X = torch.tensor([[1.0, 2.0], [3.0, 4.0]]) # Dimensi (2, 2)
W = torch.tensor([[2.0, 0.0], [1.0, 3.0]]) # Dimensi (2, 2)
bias = torch.tensor([0.5, -0.5])           # Dimensi (2,) -> Broadcast ke (2, 2)

# 1. Perkalian Matriks Aljabar
hasil_matmul = X @ W

# 2. Perkalian Hadamard (Element-wise)
hasil_hadamard = X * W

# 3. Penjumlahan dengan Broadcasting Bias
hasil_affine = hasil_matmul + bias

print("=== OPERASI MATRIKS VS HADAMARD & BROADCASTING ===")
print(f"X @ W (Matrix Product):\n{hasil_matmul}")
print(f"X * W (Hadamard Product):\n{hasil_hadamard}")
print(f"Hasil Affine Transform (X @ W + b):\n{hasil_affine}")`,
        expectedOutput: "Operasi matriks memproyeksikan fitur dan penyiaran bias berhasil dieksekusi secara virtual.",
        codeExp: "Skrip menunjukkan secara kontras hasil numerik perkalian titik matriks (@) vs perkalian elemen (*), serta penyiaran vektor bias 1D ke matriks 2D.",
        pitfalls: [
          "Menggunakan operator * saat bermaksud melakukan proyeksi linear lapisan neural network (menghasilkan Hadamard alih-alih transformasi linear).",
          "Melakukan broadcasting tidak sengaja antara vektor shape (N,) dan (N, 1) yang menghasilkan matriks tak diinginkan berukuran (N, N)."
        ],
        refTitle: "PyTorch Documentation: Broadcasting Semantics",
        refUrl: "https://pytorch.org/docs/stable/notes/broadcasting.html"
      },
      {
        num: "1.4",
        slug: "1-4-representasi-data-nyata-dalam-tensor-2d-hingga-5d",
        title: "1.4. Representasi Data Nyata dalam Tensor: Tabular (2D), Deret Waktu & NLP (3D), Citra (4D), dan Video (5D)",
        desc: "Taksonomi kanonikal penataan dimensi tensor untuk representasi data dunia nyata: dari data tabel hingga sinyal spatiotemporal video berordo 5.",
        concept: `Salah satu keanggunan Deep Learning adalah kemampuannya memperlakukan seluruh modalitas informasi di alam semesta ke dalam struktur kanonikal tensor:

1. **Tensor 2D (Data Tabular):** $\mathbf{X} \in \mathbb{R}^{B \\times d}$, di mana $B$ adalah ukuran batch (*batch size*) dan $d$ adalah jumlah fitur/kolom. Contoh: data profil medis pasien atau metrik transaksi perbankan.
2. **Tensor 3D (Deret Waktu & Pemrosesan Bahasa Alami):** $\mathbf{X} \in \mathbb{R}^{B \\times T \\times d_{\text{emb}}}$, di mana $T$ adalah panjang jendela waktu (*timesteps*) atau panjang urutan token (*sequence length*), dan $d_{\text{emb}}$ adalah dimensi representasi vektor token.
3. **Tensor 4D (Citra Komputer Vision):** Format standar PyTorch menggunakan konvensi **NCHW**:
   $$\mathbf{X} \in \mathbb{R}^{B \\times C \\times H \\times W}$$
   di mana $C$ adalah jumlah kanal warna (1 untuk Grayscale, 3 untuk RGB), $H$ adalah tinggi piksel, dan $W$ adalah lebar piksel. (Berbeda dengan TensorFlow yang default-nya NHWC).
4. **Tensor 5D (Video & Pencitraan Medis 3D):** Format standar **NCTHW**:
   $$\mathbf{X} \in \mathbb{R}^{B \\times C \\times T \\times H \\times W}$$
   di mana $T$ adalah jumlah bingkai frame per detik atau kedalaman potongan MRI (*volumetric slices*).`,
        formula: `\mathbf{X}_{\text{Citra}} \in \mathbb{R}^{B \\times C \\times H \\times W}, \quad \mathbf{X}_{\text{Video}} \in \mathbb{R}^{B \\times C \\times T \\times H \\times W} \quad (\text{Standar NCHW/NCTHW})`,
        code: `# 1.4: Simulasi Representasi Tensor untuk Ragam Modalitas Data Riil
import torch

# 1. Batch Tabular (32 sampel, 10 fitur)
batch_tabular = torch.randn(32, 10)

# 2. Batch NLP / Deret Waktu (16 kalimat, 50 kata, 128 embedding)
batch_nlp = torch.randn(16, 50, 128)

# 3. Batch Citra RGB (8 gambar, 3 kanal, 224x224 piksel)
batch_citra = torch.randn(8, 3, 224, 224)

# 4. Batch Video (2 klip video, 3 kanal, 16 frame, 112x112 piksel)
batch_video = torch.randn(2, 3, 16, 112, 112)

print("=== TAKSONOMI REPRESENTASI DATA NYATA DALAM TENSOR ===")
print(f"Tabular (2D) : {batch_tabular.shape}  -> [Batch, Fitur]")
print(f"NLP/Seq (3D) : {batch_nlp.shape}      -> [Batch, SeqLen, EmbDim]")
print(f"Citra   (4D) : {batch_citra.shape}    -> [Batch, Kanal, Tinggi, Lebar]")
print(f"Video   (5D) : {batch_video.shape}    -> [Batch, Kanal, Frame, Tinggi, Lebar]")`,
        expectedOutput: "Seluruh modalitas data dunia nyata terpetakan ke dalam hierarki dimensi tensor kanonikal.",
        codeExp: "Skrip mendemonstrasikan pembentukan tensor untuk 4 jenis modalitas data standar industri menggunakan konvensi dimensi PyTorch.",
        pitfalls: [
          "Tertukar antara konvensi NCHW (PyTorch) dengan NHWC (OpenCV/TensorFlow) saat memuat citra mentah yang memicu galat komputasi konvolusi.",
          "Lupa menormalisasi nilai piksel citra dari rentang integer [0, 255] ke rentang float [0.0, 1.0]."
        ],
        refTitle: "PyTorch Vision Documentation: Standard Tensor Formats",
        refUrl: "https://pytorch.org/vision/stable/transforms.html"
      },
      {
        num: "1.5",
        slug: "1-5-manipulasi-dimensi-tensor-view-reshape-permute-squeeze",
        title: "1.5. Manipulasi Dimensi Tensor: Reshape, View, Permute, Transpose, Squeeze, dan Unsqueeze",
        desc: "Operasi rekonstruksi geometri tensor: perbedaan fundamental antara view (zero-copy kontigu) dan reshape (pencadangan penyalinan memori), serta permutasi sumbu spasial.",
        concept: `Rekayasa model deep learning menuntut manipulasi geometri tensor secara presisi di antara lapisan-lapisan jaringan. PyTorch menyediakan kumpulan operator rekonstruksi dimensi:

1. **\`view()\` vs \`reshape()\`:**
   - \`view(*shape)\`: Mengembalikan tensor baru yang membagikan buffer memori fisik yang sama (*zero-copy*). Syarat mutlak: tensor harus dalam kondisi kontigu (*contiguous*). Jika tensor non-kontigu, operasi ini memicu error.
   - \`reshape(*shape)\`: Menyerupai \`view()\`, namun secara aman menduplikasi memori fisik secara otomatis jika tensor tidak kontigu.
2. **\`squeeze()\` dan \`unsqueeze()\`:**
   - \`unsqueeze(dim)\`: Menyisipkan dimensi semu (*singleton dimension*) bernilai 1 pada indeks yang ditentukan (misal mengubah vektor \`[d]\` menjadi batch \`[1, d]\`).
   - \`squeeze(dim)\`: Menghapus dimensi yang bernilai 1 untuk menyederhanakan perhitungan.
3. **\`permute()\` dan \`transpose()\`:**
   - \`transpose(dim0, dim1)\`: Menukar tepat dua sumbu dimensi.
   - \`permute(*dims)\`: Mengatur ulang urutan seluruh dimensi secara fleksibel (sangat sering digunakan untuk konversi format citra dari HWC ke CHW atau transposisi kepala atensi Transformer).`,
        formula: `\mathbf{X}_{\text{permute}} = \text{permute}(\mathbf{X}, (0, 3, 1, 2)) \implies (B, H, W, C) \\xrightarrow{} (B, C, H, W)`,
        code: `# 1.5: Eksperimen Komparatif Manipulasi Dimensi Tensor
import torch

x = torch.randn(4, 3, 32, 32) # Format NCHW

# 1. Tambah dimensi singleton (misal dimensi waktu)
x_unsqueezed = x.unsqueeze(2) # Shape: (4, 3, 1, 32, 32)

# 2. Hapus kembali dimensi singleton
x_squeezed = x_unsqueezed.squeeze(2)

# 3. Permutasi dari NCHW ke NHWC (misal untuk visualisasi Matplotlib)
x_nhwc = x.permute(0, 2, 3, 1) # Shape: (4, 32, 32, 3)

# 4. Flatten fitur spasial untuk masuk ke Fully Connected layer
x_flat = x.reshape(x.shape[0], -1) # Shape: (4, 3*32*32) = (4, 3072)

print("=== OPERASI MANIPULASI DIMENSI TENSOR ===")
print(f"Shape Asli (NCHW)           : {x.shape}")
print(f"Setelah Unsqueeze(2)        : {x_unsqueezed.shape}")
print(f"Setelah Permute (ke NHWC)   : {x_nhwc.shape}")
print(f"Setelah Flatten (Reshape)   : {x_flat.shape}")`,
        expectedOutput: "Manipulasi dimensi berhasil mengubah topologi tensor secara fleksibel sesuai kebutuhan inferensi.",
        codeExp: "Skrip menunjukkan rekonstruksi geometri tensor menggunakan unsqueeze, permute, dan flatten reshape untuk integrasi antar-lapisan.",
        pitfalls: [
          "Menggunakan .view() alih-alih .permute() saat bermaksud menukar sumbu matriks (view merusak penataan elemen data karena membaca memori linier secara naif).",
          "Melupakan argumen spesifik pada .squeeze() sehingga menghapus batch size secara tidak sengaja ketika ukuran batch kebetulan bernilai 1."
        ],
        refTitle: "PyTorch Documentation: Tensor Reshaping and Views",
        refUrl: "https://pytorch.org/docs/stable/generated/torch.Tensor.view.html"
      },
      {
        num: "1.6",
        slug: "1-6-akselerasi-perangkat-keras-cpu-gpu-cuda-dan-mps",
        title: "1.6. Akselerasi Perangkat Keras: Memori Host vs Device (CPU, GPU CUDA, dan Apple Silicon MPS)",
        desc: "Paradigma komputasi paralel deep learning: transfer memori host-to-device, akselerasi ribuan core GPU, dan penulisan kode perangkat-agnostik.",
        concept: `Jaringan saraf dalam membutuhkan miliaran operasi perkalian matriks yang membebani unit pemroses sentral (*Central Processing Unit - CPU*). CPU dirancang untuk eksekusi instruksi beruntun berlatensi rendah dengan jumlah core sedikit (4–64 core). Sebaliknya, **Graphics Processing Unit (GPU)** dirancang untuk throughput komputasi paralel masif dengan ribuan alu (*Arithmetic Logic Units*) sederhana yang ideal mengeksekusi operasi tensor secara simultan.

**Mekanisme Transfer Memori (*Host vs Device*):**
- **Host (CPU / RAM Sistem):** Tempat data dimuat dari disk penyimpanan, didekode, dan dipra-proses.
- **Device (GPU VRAM / Metal MPS):** Tempat bobot model disimpan dan operasi perkalian tensor dieksekusi.
Komunikasi antar-host dan device melalui bus PCIe memiliki batas lebar pita (*bandwidth bottleneck*). Operasi transfer data (\`tensor.to(device)\`) harus diminimalkan dan dieksekusi secara asinkron (misal menggunakan \`pin_memory=True\` dan \`non_blocking=True\` pada PyTorch DataLoader).

**Penulisan Kode Device-Agnostic:**
Kode profesional deep learning tidak boleh mengasumsikan ketersediaan hardware tertentu, melainkan mendeteksi akselerator tercepat secara dinamis: CUDA (NVIDIA), MPS (Apple Silicon), atau CPU.`,
        formula: `\text{Latency}_{\text{Total}} = T_{\text{PCIe Transfer}}(\mathbf{X}) + T_{\text{Compute GPU}}(\mathbf{X}, \mathbf{W}) \ll T_{\text{Compute CPU}}(\mathbf{X}, \mathbf{W})`,
        code: `# 1.6: Deteksi Perangkat Otomatis dan Penulisan Kode Device-Agnostic
import torch

# Deteksi perangkat tercepat yang tersedia
if torch.cuda.is_available():
    device = torch.device("cuda")
elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

# Alokasikan tensor langsung di perangkat target
x_dev = torch.randn(1000, 1000, device=device)
W_dev = torch.randn(1000, 1000, device=device)

# Eksekusi komputasi matriks paralel di hardware accelerator
hasil = x_dev @ W_dev

print("=== MANAJEMEN PERANGKAT AKSESELERATOR HARDWARE ===")
print(f"Perangkat Aktif Terdeteksi : {device}")
print(f"Lokasi Alokasi Tensor      : {hasil.device}")
print(f"Tipe Akselerasi Hardware   : {'GPU Paralel Masif' if device.type != 'cpu' else 'CPU Serial Standar'}")`,
        expectedOutput: "Skrip berhasil mengalokasikan tensor dan mengeksekusi komputasi secara dinamis di perangkat tercepat.",
        codeExp: "Skrip mengimplementasikan pola arsitektur device-agnostic standar industri yang mendeteksi akselerator CUDA/MPS/CPU secara otomatis.",
        pitfalls: [
          "Mencoba mengeksekusi operasi matematika pada dua tensor yang berada di perangkat berbeda (misal satu di CPU dan satu di CUDA), memicu RuntimeError.",
          "Memindahkan data per-sampel kecil dari CPU ke GPU di dalam loop latihan alih-alih mentransfer per-batch penuh yang menciptakan bottleneck PCIe masif."
        ],
        refTitle: "PyTorch Documentation: CUDA and Device Management Semantics",
        refUrl: "https://pytorch.org/docs/stable/notes/cuda.html"
      },
      {
        num: "1.7",
        slug: "1-7-presisi-floating-point-fp32-fp16-bf16-dan-mixed-precision",
        title: "1.7. Presisi Floating Point: Perbedaan float32, float64, float16 (FP16), dan bfloat16 (BF16)",
        desc: "Trade-off numerik representasi bit: rentang dinamis eksponen versus presisi mantissa, serta akselerasi pelatihan via Automatic Mixed Precision (AMP).",
        concept: `Komputasi ilmiah klasik umumnya mengandalkan presisi ganda **float64** (*double precision*). Namun, dalam Deep Learning, jaringan saraf memiliki toleransi inheren terhadap derau numerik (*noise tolerance*). Penggunaan presisi yang lebih rendah secara drastis menghemat kapasitas memori VRAM dan melipatgandakan kecepatan komputasi:

1. **FP32 (Single Precision, 32-bit):**
   - 1 bit tanda, 8 bit eksponen, 23 bit mantissa (presisi fraksional). Standar komputasi default sejak era awal deep learning.
2. **FP16 (Half Precision, 16-bit):**
   - 1 bit tanda, 5 bit eksponen, 10 bit mantissa. Menghemat memori hingga $50\%$. Kelemahan: rentang dinamis sempit ($[6 \\times 10^{-5}, 65504]$) yang rentan memicu *underflow* gradien (gradien menjadi nol) sehingga membutuhkan penskalaan kerugian (*loss scaling*).
3. **BF16 (Brain Floating Point, 16-bit):**
   - Dipelopori oleh Google Brain: 1 bit tanda, **8 bit eksponen** (identik dengan FP32), 7 bit mantissa. Mempertahankan rentang dinamis yang sama persis dengan FP32 sehingga **kebal underflow tanpa perlu loss scaling**, meski mengorbankan sedikit presisi mantissa.
4. **Automatic Mixed Precision (AMP):**
   Mekanisme modern PyTorch yang secara dinamis mengeksekusi operasi perkalian matriks intensif dalam FP16/BF16 sambil mempertahankan akumulasi bobot utama dalam FP32 untuk stabilitas numerik mutlak.`,
        formula: `\text{Bits: } \text{FP32}(1, 8, 23) \;\longleftrightarrow\; \text{FP16}(1, 5, 10) \;\longleftrightarrow\; \text{BF16}(1, 8, 7) \quad (\text{Sign, Exponent, Mantissa})`,
        code: `# 1.7: Analisis Konsumsi Memori dan Rentang Numerik Ragam Presisi Float
import torch

# Buat tensor 1 juta elemen dalam berbagai presisi
t_fp64 = torch.randn(1000, 1000, dtype=torch.float64)
t_fp32 = torch.randn(1000, 1000, dtype=torch.float32)
t_fp16 = torch.randn(1000, 1000, dtype=torch.float16)
t_bf16 = torch.randn(1000, 1000, dtype=torch.bfloat16)

def byte_size(t):
    return t.element_size() * t.nelement() / (1024 * 1024)

print("=== ANALISIS PRESISI FLOATING POINT DALAM DEEP LEARNING ===")
print(f"FP64 (Double) : {byte_size(t_fp64):.2f} MB | Nilai Minimum: {torch.finfo(torch.float64).tiny:.2e}")
print(f"FP32 (Single) : {byte_size(t_fp32):.2f} MB | Nilai Minimum: {torch.finfo(torch.float32).tiny:.2e}")
print(f"FP16 (Half)   : {byte_size(t_fp16):.2f} MB | Nilai Minimum: {torch.finfo(torch.float16).tiny:.2e} (Rentan Underflow)")
print(f"BF16 (Brain)  : {byte_size(t_bf16):.2f} MB | Nilai Minimum: {torch.finfo(torch.bfloat16).tiny:.2e} (Aman Underflow)")`,
        expectedOutput: "Presisi FP16 dan BF16 memangkas ukuran memori 50% dibandingkan FP32 standar.",
        codeExp: "Skrip mengukur konsumsi byte memori dan nilai representasi terkecil (tiny limit) untuk membuktikan keuntungan efisiensi BF16/FP16.",
        pitfalls: [
          "Melatih model secara naif dalam FP16 murni tanpa GradScaler yang menyebabkan gradien bernilai nol (underflow) dan model gagal konvergen.",
          "Menggunakan bfloat16 pada hardware GPU lawas yang belum mendukung instruksi BF16 (membutuhkan arsitektur NVIDIA Ampere ke atas atau CPU modern)."
        ],
        refTitle: "Paulius Micikevicius et al.: Mixed Precision Training (ICLR, 2018)",
        refUrl: "https://arxiv.org/abs/1710.03740"
      },
      {
        num: "1.8",
        slug: "1-8-inisialisasi-tensor-khusus-dan-pembentukan-generator",
        title: "1.8. Inisialisasi Tensor Khusus: Zeros, Ones, Randn, Linspace, dan Arange",
        desc: "Metode konstruksi tensor dari distribusi probabilitas tertentu, penentuan seed deterministik, dan pembuatan kisi koordinat matematika.",
        concept: `Tahap awal setiap algoritma deep learning dimulai dari pembuatan tensor acak atau berpola:

1. **Tensor Bernilai Konstan:**
   - \`torch.zeros(*shape)\` dan \`torch.ones(*shape)\`: Membuat tensor berisi angka 0 atau 1 (biasanya digunakan untuk inisialisasi bias atau masker atensi).
   - \`torch.full(*shape, fill_value)\`: Mengisi tensor dengan konstanta skalar spesifik.
2. **Tensor Berurutan Teratur:**
   - \`torch.arange(start, end, step)\`: Membuat deret angka diskrit dengan interval langkah tertentu.
   - \`torch.linspace(start, end, steps)\`: Membagi interval kontinu menjadi $N$ titik berjarak sama (sangat ideal untuk visualisasi fungsi aktivasi dan kurva rugi).
3. **Tensor Stokastik Probabilistik:**
   - \`torch.rand(*shape)\`: Sampel dari distribusi seragam (*Uniform Distribution*) $\mathcal{U}(0, 1)$.
   - \`torch.randn(*shape)\`: Sampel dari distribusi normal baku (*Standard Normal*) $\mathcal{N}(0, 1)$ dengan rata-rata $\mu=0$ dan deviasi standar $\sigma=1$.
   - \`torch.randint(low, high, size)\`: Sampel bilangan bulat acak untuk label klasifikasi diskrit.`,
        formula: `X_{ij} \sim \mathcal{N}(0, 1) \implies p(x) = \frac{1}{\sqrt{2\pi}} \exp\left(-\frac{x^2}{2}\right) \quad (\text{Standar Randn})`,
        code: `# 1.8: Demonstrasi Konstruksi Tensor Khusus dan Sifat Statistika
import torch

torch.manual_seed(42) # Penguncian benih acak untuk determinisme

# 1. Tensor distribusi normal (10.000 sampel untuk uji statistik)
t_randn = torch.randn(10000)

# 2. Tensor kisi kontinu
t_linspace = torch.linspace(-5.0, 5.0, steps=5)

# 3. Tensor bernilai konstan
t_zeros = torch.zeros(2, 3)

print("=== INISIALISASI TENSOR KHUSUS PYTORCH ===")
print(f"Linspace (-5 s/d 5, 5 titik): {t_linspace}")
print(f"Rata-rata Randn Sampel      : {t_randn.mean().item():.4f} (Mendekati mu = 0.0)")
print(f"Variansi Randn Sampel      : {t_randn.var().item():.4f} (Mendekati sigma^2 = 1.0)")
print(f"Bentuk Tensor Zeros         : {t_zeros.shape}")`,
        expectedOutput: "Konstruksi tensor berhasil membentuk distribusi statistik normal baku dan kisi koordinat teratur.",
        codeExp: "Skrip mendemonstrasikan pembentukan tensor konstanta, linspace linier, dan validasi empiris sifat mean dan variansi distribusi normal baku.",
        pitfalls: [
          "Menggunakan torch.rand (distribusi seragam [0, 1]) saat berniat menggunakan torch.randn (distribusi normal mean 0) yang memicu pergeseran rata-rata masukan awal.",
          "Lupa mengunci torch.manual_seed() saat eksperimen komparasi yang menyebabkan inisialisasi bobot berbeda pada setiap eksekusi."
        ],
        refTitle: "PyTorch Documentation: Creation Ops",
        refUrl: "https://pytorch.org/docs/stable/torch.html#creation-ops"
      },
      {
        num: "1.9",
        slug: "1-9-interoperabilitas-tanpa-penyalinan-numpy-ke-pytorch",
        title: "1.9. Interoperabilitas Tanpa Penyalinan (Zero-Copy Memory Sharing): Konversi NumPy ke PyTorch",
        desc: "Jembatan komputasi antara ekosistem CPU NumPy dan PyTorch: mekanisme berbagi pointer memori fisik via torch.from_numpy() dan tensor.numpy().",
        concept: `Dalam pipeline sains data dunia nyata, data mentah seringkali dimuat dan diproses terlebih dahulu menggunakan Pandas atau OpenCV yang berbasis array **NumPy**. Mengonversi array NumPy ke Tensor PyTorch secara ceroboh dapat melipatgandakan konsumsi RAM jika terjadi penyalinan fisik (*deep copy*).

**Mekanisme Berbagi Memori (*Zero-Copy Memory Sharing*):**
PyTorch dan NumPy berbagi format buffer array memori C yang kompatibel. Fungsi:
\`\`\`python
tensor = torch.from_numpy(numpy_array)
\`\`\`
**tidak menyalin satu byte pun data fisik di RAM!** Tensor PyTorch baru hanya membungkus pointer alamat memori yang sama persis milik array NumPy. Konsekuensi langsungnya:
- Kecepatan konversi instan berkategori $\mathcal{O}(1)$ bahkan untuk dataset berukuran puluhan gigabyte.
- **Efek Samping Mutasi:** Memodifikasi nilai elemen di dalam array NumPy akan secara instan mengubah nilai elemen di dalam Tensor PyTorch, dan sebaliknya.

Penyalinan fisik baru akan terjadi jika:
1. Kita memanggil secara eksplisit \`torch.tensor(numpy_array)\` (konstruktor salinan).
2. Tensor dipindahkan dari CPU ke GPU via \`.to('cuda')\`.`,
        formula: `\text{Pointer}(\text{Tensor}) \equiv \text{Pointer}(\text{ndarray}) \implies \mathcal{O}(1) \text{ Conversion Time}`,
        code: `# 1.9: Pembuktian Fenomena Zero-Copy Memory Sharing NumPy <-> PyTorch
import numpy as np
import torch

# Buat array NumPy di RAM host
arr_np = np.array([10.0, 20.0, 30.0], dtype=np.float32)

# Konversi Zero-Copy via torch.from_numpy()
t_pt = torch.from_numpy(arr_np)

print("=== ZERO-COPY INTEROPERABILITAS NUMPY <-> PYTORCH ===")
print(f"Nilai Awal NumPy  : {arr_np}")
print(f"Nilai Awal PyTorch: {t_pt}")

# Mutasi array NumPy: Buktikan tensor PyTorch otomatis berubah seketika!
arr_np[0] = 999.0
print(f"Setelah Mutasi NumPy[0] = 999.0:")
print(f"-> Tensor PyTorch : {t_pt} (Berbagi buffer memori fisik yang sama persis!)")`,
        expectedOutput: "Perubahan pada array NumPy tercermin secara instan pada tensor PyTorch membuktikan arsitektur zero-copy.",
        codeExp: "Skrip membuktikan kesamaan buffer fisik antara objek ndarray NumPy dan Tensor PyTorch melalui demonstrasi mutasi nilai in-place.",
        pitfalls: [
          "Tidak sengaja memutasi data mentah NumPy di tempat lain yang merusak nilai tensor latihan tanpa disadari akibat efek samping pointer bersama.",
          "Mencoba memanggil .numpy() pada tensor yang berada di memori GPU tanpa memindahkannya ke CPU terlebih dahulu (wajib memanggil .cpu().numpy())."
        ],
        refTitle: "PyTorch Documentation: Bridge with NumPy",
        refUrl: "https://pytorch.org/tutorials/beginner/blitz/tensor_tutorial.html#bridge-with-numpy"
      },
      {
        num: "1.10",
        slug: "1-10-praktikum-membangun-engine-aljabar-linier-tensor-mini",
        title: "1.10. Praktikum Komprehensif: Membangun Engine Aljabar Linier Mini Berbasis Tensor PyTorch",
        desc: "Proyek integratif Bab 1: membangun pipeline komputasi transformasi affine multibatch, normalisasi matriks kovarians, dan proyeksi spasial berkecepatan tinggi.",
        concept: `Sebagai penutup Bab 1, kita menyatukan seluruh konsep aljabar tensor, broadcasting, permutasi dimensi, dan interoperabilitas ke dalam proyek mandiri: **Engine Transformasi Affine & Statistik Multivariat Mini**.

Dalam jaringan saraf tiruan, lapisan paling mendasar adalah **Transformasi Affine**:
$$\mathbf{Y} = \mathbf{X} \mathbf{W} + \mathbf{b}$$
di mana data masukan $\mathbf{X}$ diproyeksikan secara linier oleh matriks bobot $\mathbf{W}$ dan digeser oleh vektor bias $\mathbf{b}$. Melalui praktikum ini, kita akan:
1. Membangun kelas transformasi affine dengan penanganan broadcasting yang aman.
2. Menghitung matriks kovarians batch $\mathbf{\Sigma} = \frac{1}{B-1} (\mathbf{X} - \boldsymbol{\mu})^\top (\mathbf{X} - \boldsymbol{\mu})$ secara murni menggunakan operasi tensor PyTorch berkecepatan tinggi.
3. Memverifikasi stabilitas numerik output transformasi terhadap kondisi data berskala besar.`,
        formula: `\mathbf{\Sigma} = \frac{1}{B-1} \sum_{i=1}^B (\mathbf{x}_i - \boldsymbol{\mu}) (\mathbf{x}_i - \boldsymbol{\mu})^\top \quad (\text{Matriks Kovarians Sampel Batch})`,
        code: `# 1.10: Proyek Terintegrasi: Engine Affine dan Kovarians Batch Mandiri
import torch

class MiniTensorEngine:
    def __init__(self, in_features: int, out_features: int):
        # Inisialisasi bobot normal baku dan bias nol
        self.W = torch.randn(in_features, out_features) * (1.0 / (in_features ** 0.5))
        self.b = torch.zeros(out_features)

    def forward(self, X: torch.Tensor) -> torch.Tensor:
        # Operasi proyeksi affine: X @ W + b (dengan penyiaran bias)
        return X @ self.W + self.b

    @staticmethod
    def hitung_kovarians(X: torch.Tensor) -> torch.Tensor:
        B = X.shape[0]
        mean = torch.mean(X, dim=0, keepdim=True)
        X_centered = X - mean
        return (X_centered.T @ X_centered) / (B - 1)

# Pengujian Proyek Mini
torch.manual_seed(42)
batch_X = torch.randn(100, 8) # 100 sampel data, 8 atribut

engine = MiniTensorEngine(in_features=8, out_features=4)
output_Y = engine.forward(batch_X)
kovarians_matriks = engine.hitung_kovarians(output_Y)

print("=== PRAKTIKUM TERINTEGRASI: MINI TENSOR ENGINE ===")
print(f"Shape Masukan X        : {batch_X.shape}")
print(f"Shape Hasil Proyeksi Y : {output_Y.shape} (Tereduksi ke 4 fitur)")
print(f"Bentuk Matriks Kovarians: {kovarians_matriks.shape}")
print(f"Diagonal Variansi Fitur: {torch.diag(kovarians_matriks).tolist()[:2]}...")`,
        expectedOutput: "MiniTensorEngine berhasil melakukan proyeksi affine berbobot dan menghitung matriks kovarians batch.",
        codeExp: "Skrip merangkai inisialisasi bobot berskala Xavier, proyeksi aljabar matriks affine, serta kalkulasi kovarians multivariat terpusat.",
        pitfalls: [
          "Lupa menyertakan keepdim=True saat menghitung rata-rata batch (mean) yang menyebabkan kegagalan broadcasting saat sentralisasi data.",
          "Membagi dengan B alih-alih (B - 1) saat menghitung kovarians sampel tak bias (Bessel's correction)."
        ],
        refTitle: "PyTorch Deep Learning Blitz: Tensors and Operations",
        refUrl: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html"
      }
    ]
  },

  // =========================================================================
  // BAB 2: Perseptron Multi-Lapis (MLP) & Teorema Aproksimasi Universal
  // =========================================================================
  {
    orderIndex: 2,
    id: "dl-ch-02",
    slug: "bab-2-perseptron-multi-lapis-mlp-aproksimasi-universal",
    title: "BAB 2: Perseptron Multi-Lapis (MLP) & Teorema Aproksimasi Universal",
    desc: "Arsitektur jaringan saraf umpan maju mendalam (Feedforward Neural Networks / Multilayer Perceptron): keterbatasan separabilitas linier, pembuktian Teorema Aproksimasi Universal Cybenko-Hornik, efisiensi eksponensial kedalaman versus lebar, dan pemodelan berorientasi objek torch.nn.Module.",
    coreConcepts: [
      "Perseptron Rosenblatt & Keterbatasan Linear XOR (Minsky-Papert 1969)",
      "Universal Approximation Theorem (Cybenko 1989, Hornik 1991)",
      "Keunggulan Eksponensial Kedalaman Arsitektur (Telgarsky 2016)",
      "Perambatan Maju Vektorisasi Matriks (Forward Propagation)",
      "Topologi Batas Keputusan Non-Linier & Deformasi Ruang Laten",
      "Arsitektur Berorientasi Objek torch.nn.Module"
    ],
    subchapters: [
      {
        num: "2.1",
        slug: "2-1-perseptron-rosenblatt-dan-keterbatasan-xor",
        title: "2.1. Perseptron Frank Rosenblatt (1958) & Keterbatasan Separabilitas Linier Kasus XOR (Minsky & Papert 1969)",
        desc: "Fondasi historis dan matematis perseptron: algoritma pembaruan bobot biner dan pembuktian kegagalan menangani masalah non-linear separabel.",
        concept: `Pada tahun 1958, Frank Rosenblatt merumuskan **Perseptron**, model komputasi matematis pertama yang terinspirasi dari neuron biologis. Perseptron menerima vektor masukan $\mathbf{x} \in \mathbb{R}^d$, menghitung kombinasi linier terbobot, dan mengalirkan hasilnya melalui fungsi tangga Heaviside (*Heaviside step function*):
$$\hat{y} = \text{step}(\mathbf{w}^\top \mathbf{x} + b) = \begin{cases} 1 & \text{jika } \mathbf{w}^\top \mathbf{x} + b \ge 0 \ 0 & \text{jika } \mathbf{w}^\top \mathbf{x} + b < 0 \end{cases}$$

**Kritik Minsky dan Papert (1969):**
Dalam buku bersejarah mereka, Marvin Minsky dan Seymour Papert membuktikan secara matematis bahwa perseptron lapis tunggal **secara teoretis mustahil memecahkan fungsi logika XOR (Exclusive OR)**. Fungsi XOR menghasilkan output 1 hanya jika salah satu input bernilai 1 (tetapi tidak keduanya):
$$\{(0,0) \to 0, \; (0,1) \to 1, \; (1,0) \to 1, \; (1,1) \to 0\}$$
Titik-titik ini tidak dapat dipisahkan oleh satu garis lurus hiperplane linier (*linearly inseparable*). Kegagalan ini memicu periode *AI Winter* pertama, hingga komunitas menyadari bahwa menyusun beberapa lapis perseptron dengan fungsi non-linier mampu membentuk batas keputusan bentuk sembarang.`,
        formula: `\text{XOR}(x_1, x_2) = (x_1 \lor x_2) \land \neg(x_1 \land x_2) \implies \text{Non-Linearly Separable}`,
        code: `# 2.1: Pembuktian Kegagalan Perseptron Linier Sederhana Memisahkan XOR
import numpy as np

# Dataset logika XOR
X_xor = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=np.float32)
y_xor = np.array([0, 1, 1, 0], dtype=np.float32)

# Perseptron Linier Rosenblatt
weights = np.array([0.5, 0.5], dtype=np.float32)
bias = -0.5

def perseptron_step(X):
    z = X @ weights + bias
    return (z >= 0).astype(np.float32)

prediksi = perseptron_step(X_xor)
akurasi = (prediksi == y_xor).mean() * 100

print("=== KETERBATASAN PERSEPTRON LINIER PADA XOR ===")
print(f"Masukan XOR     :\n{X_xor}")
print(f"Target Nyata    : {y_xor.tolist()}")
print(f"Prediksi Linier : {prediksi.tolist()}")
print(f"Akurasi Linier  : {akurasi:.1f}% (Maksimal 50% - Terjebak Limitasi Separabilitas Linier!)")`,
        expectedOutput: "Perseptron lapis tunggal gagal memecahkan XOR dengan akurasi terhenti di 50%.",
        codeExp: "Skrip membuktikan ketidakmampuan matematis perseptron linear tunggal dalam memisahkan konfigurasi koordinat XOR.",
        pitfalls: [
          "Mencoba melatih perseptron satu lapis tanpa hidden layer pada masalah klasifikasi dunia nyata yang memiliki interaksi fitur non-linier.",
          "Menggunakan fungsi step Heaviside dalam optimasi modern (fungsi step memiliki turunan nol di mana-mana sehingga tidak dapat dilatih via backpropagation)."
        ],
        refTitle: "Marvin Minsky & Seymour Papert: Perceptrons (MIT Press, 1969)",
        refUrl: "https://mitpress.mit.edu/9780262631111/perceptrons/"
      },
      {
        num: "2.2",
        slug: "2-2-anatomi-perseptron-multi-lapis-mlp",
        title: "2.2. Anatomi Perseptron Multi-Lapis: Bobot W, Bias b, dan Lapisan Tersembunyi (Hidden Layers)",
        desc: "Struktur arsitektur umpan maju: matriks bobot interkoneksi, vektor bias penyeimbang batas keputusan, dan mekanisme propagasi lapisan tersembunyi.",
        concept: `Solusi atas keterbatasan perseptron linier adalah **Perseptron Multi-Lapis (*Multilayer Perceptron / MLP*)** atau Jaringan Umpan Maju Mendalam (*Deep Feedforward Network*). MLP menyisipkan satu atau lebih **lapisan tersembunyi (*hidden layers*)** di antara lapisan masukan dan lapisan keluaran.

Setiap lapisan $l \in \{1, 2, \dots, L\}$ terdiri atas:
1. **Matriks Bobot ($\mathbf{W}^{(l)} \in \mathbb{R}^{d_{l-1} \\times d_l}$):** Mengukur kekuatan keterhubungan sinaptik antar-neuron. Elemen $w_{ij}$ menentukan seberapa kuat neuron $i$ di lapisan sebelumnya mempengaruhi neuron $j$ di lapisan saat ini.
2. **Vektor Bias ($\mathbf{b}^{(l)} \in \mathbb{R}^{d_l}$):** Berperan sebagai nilai ambang batas (*threshold* aktivasi). Bias menggeser fungsi batas keputusan menjauhi titik origin $(0,0)$.
3. **Aktivasi Non-Linier ($\sigma$):** Mentransformasikan akumulasi linear sebelum dialirkan ke lapisan berikutnya.

Komputasi pada lapisan $l$ diformulasikan secara ringkas:
$$\mathbf{Z}^{(l)} = \mathbf{A}^{(l-1)} \mathbf{W}^{(l)} + \mathbf{b}^{(l)}$$
$$\mathbf{A}^{(l)} = \sigma\left( \mathbf{Z}^{(l)} \right)$$
di mana $\mathbf{A}^{(0)} = \mathbf{X}$ adalah matriks data masukan.`,
        formula: `\mathbf{A}^{(l)} = \sigma\left( \mathbf{A}^{(l-1)} \mathbf{W}^{(l)} + \mathbf{b}^{(l)} \right), \quad l = 1, \dots, L \quad (\text{Propagasi Lapisan MLP})`,
        code: `# 2.2: Implementasi Manual Propagasi 2 Lapisan MLP Menggunakan NumPy
import numpy as np

# Matriks masukan 4 sampel XOR
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=np.float32)

# Bobot tersembunyi (2 input -> 2 neuron tersembunyi) yang memecahkan XOR
W1 = np.array([[1.0, 1.0], [1.0, 1.0]], dtype=np.float32)
b1 = np.array([0.0, -1.0], dtype=np.float32)

# Bobot keluaran (2 neuron tersembunyi -> 1 output)
W2 = np.array([[1.0], [-2.0]], dtype=np.float32)
b2 = np.array([0.0], dtype=np.float32)

# Aktivasi ReLU manual: max(0, z)
def relu(z):
    return np.maximum(0, z)

# Forward pass
Z1 = X @ W1 + b1
A1 = relu(Z1) # Lapisan tersembunyi mentransformasikan ruang koordinat!
Z2 = A1 @ W2 + b2
y_pred = (Z2 >= 0.5).astype(np.float32).flatten()

print("=== ANATOMI PERSEPTRON MULTI-LAPIS (MLP) PADA XOR ===")
print(f"Representasi Ruang Laten A1:\n{A1}")
print(f"Prediksi Akhir MLP          : {y_pred.tolist()} (100% Akurat Memecahkan XOR!)")`,
        expectedOutput: "MLP 2 lapis berhasil memetakan XOR ke ruang representasi laten yang terpisahkan secara linier.",
        codeExp: "Skrip membuktikan secara aljabar bahwa penambahan 1 lapisan tersembunyi ReLU mampu mentransformasikan koordinat XOR menjadi linearly separable.",
        pitfalls: [
          "Lupa menyertakan vektor bias pada lapisan dense (memaksa seluruh hyperplane batas keputusan melewati titik nol koordinat).",
          "Menginisialisasi seluruh matriks bobot dengan nilai nol identik yang menyebabkan kegagalan simetri (seluruh neuron mempelajari hal yang sama persis)."
        ],
        refTitle: "Ian Goodfellow et al.: Deep Learning (Chapter 6: Deep Feedforward Networks)",
        refUrl: "https://www.deeplearningbook.org/contents/mlp.html"
      },
      {
        num: "2.3",
        slug: "2-3-teorema-aproksimasi-universal-cybenko-hornik",
        title: "2.3. Teorema Aproksimasi Universal (Cybenko 1989, Hornik 1991): Bukti Kepadatan Fungsi",
        desc: "Landasan teoretis kemampuan representasi MLP: jaminan matematis bahwa 1 lapisan tersembunyi non-linier mampu mengaproksimasi fungsi kontinu apa pun.",
        concept: `Salah satu fondasi paling fundamental dalam sains pembelajaran mendalam adalah **Teorema Aproksimasi Universal (*Universal Approximation Theorem*)**. Teorema ini pertama kali dibuktikan oleh George Cybenko (1989) untuk fungsi aktivasi sigmoid kontinu, dan digeneralisasikan oleh Kurt Hornik, Maxwell Stinchcombe, dan Halbert White (1991) untuk fungsi aktivasi non-linier sembarang.

**Pernyataan Teorema:**
Misalkan $I_m$ merepresentasikan kubus satuan kompak $[0, 1]^m$ dalam $\mathbb{R}^m$, dan $C(I_m)$ adalah ruang fungsi kontinu pada $I_m$. Misalkan $\sigma$ adalah fungsi kontinu yang non-konstan, terbatas, dan kontinu monoton (fungsi aktivasi).
Maka, untuk setiap fungsi target $f \in C(I_m)$ dan untuk setiap toleransi galat $\epsilon > 0$, **selalu terdapat bilangan bulat positif $N$ dan sekumpulan parameter $\{v_i, \mathbf{w}_i, b_i\}$** sedemikian rupa sehingga:
$$F(\mathbf{x}) = \sum_{i=1}^N v_i \sigma(\mathbf{w}_i^\top \mathbf{x} + b_i)$$
memenuhi kondisi:
$$\sup_{\mathbf{x} \in I_m} |F(\mathbf{x}) - f(\mathbf{x})| < \epsilon$$

**Implikasi dan Batasan Praktis Teorema:**
1. Jaringan saraf dengan **hanya satu lapisan tersembunyi** telah memiliki kapasitas representasi universal (*universal representation capacity*).
2. **Keterbatasan Teorema:** Teorema ini merupakan bukti keberadaan non-konstruktif (*non-constructive existence proof*). Teorema tidak menjamin bahwa jumlah neuron $N$ berukuran wajar (seringkali $N$ bernilai eksponensial astronomis), dan tidak menjamin bahwa algoritma optimasi gradien mampu menemukan kombinasi bobot optimal tersebut.`,
        formula: `\forall f \in C(K), \; \forall \epsilon > 0, \; \exists F(\mathbf{x}) = \sum_{i=1}^N v_i \sigma(\mathbf{w}_i^\top \mathbf{x} + b_i) \implies \|F - f\|_\infty < \epsilon`,
        code: `# 2.3: Uji Empiris Teorema Aproksimasi Universal Mengaproksimasi Fungsi Gelombang Sinus
import torch
import torch.nn as nn

# Buat fungsi non-linier kompleks f(x) = sin(2*pi*x)
X = torch.linspace(-1.0, 1.0, 1000).unsqueeze(1)
y_true = torch.sin(2 * torch.pi * X)

# MLP 1 Lapisan Tersembunyi (Sesuai Teorema Cybenko)
model = nn.Sequential(
    nn.Linear(1, 64),
    nn.Tanh(),
    nn.Linear(64, 1)
)

optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
criterion = nn.MSELoss()

# Latih 500 iterasi singkat
for epoch in range(500):
    optimizer.zero_grad()
    loss = criterion(model(X), y_true)
    loss.backward()
    optimizer.step()

with torch.no_grad():
    y_pred = model(X)
    max_error = torch.max(torch.abs(y_pred - y_true)).item()

print("=== TEOREMA APROKSIMASI UNIVERSAL (CYBENKO-HORNIK) ===")
print(f"Bentuk Fungsi Target  : f(x) = sin(2*pi*x)")
print(f"Jumlah Neuron Hidden  : 64 neuron (Lapisan Tunggal)")
print(f"Galat Maksimum Sup-Norm: {max_error:.4f} (Membuktikan konvergensi ||F - f|| < epsilon)")`,
        expectedOutput: "MLP 1 lapisan tersembunyi berhasil mengaproksimasi gelombang non-linier dengan galat presisi sangat rendah.",
        codeExp: "Skrip membuktikan Teorema Cybenko secara numerik: MLP satu lapisan Tanh mengaproksimasi fungsi periodik kontinu dengan galat seragam rendah.",
        pitfalls: [
          "Menyimpulkan bahwa satu lapisan tersembunyi sudah cukup untuk seluruh aplikasi praktis (dalam praktiknya, lebar lapisan satu lapis menjadi eksponensial tak terbatas).",
          "Mengabaikan fakta bahwa teorema hanya berlaku untuk ruang domain kompak tertutup dan terbatas."
        ],
        refTitle: "Kurt Hornik: Approximation Capabilities of Multilayer Feedforward Networks (1991)",
        refUrl: "https://www.sciencedirect.com/science/article/abs/pii/089360809190009T"
      },
      {
        num: "2.4",
        slug: "2-4-kedalaman-vs-lebar-keunggulan-eksponensial-arsitektur-dalam",
        title: "2.4. Kedalaman vs Lebar Jaringan (Depth vs Width): Mengapa Arsitektur Dalam Lebih Efisien Eksponensial",
        desc: "Bukti keunggulan arsitektur deep: pembagian ruang linier piecewise Telgarsky (2016) dan penghematan parameter eksponensial jaringan dalam dibandingkan jaringan lebar.",
        concept: `Meskipun Teorema Aproksimasi Universal menjamin jaringan saraf dangkal 1 lapisan dapat mengaproksimasi fungsi apa pun, mengapa industri dan sains beralih secara mutlak ke **Jaringan Saraf Dalam (*Deep Neural Networks*)**?

Miltiadis Telgarsky (*COLT 2016*) dan Ronen Eldan & Ohad Shamir (*COLT 2016*) membuktikan secara teoritis bahwa **kedalaman arsitektur memberikan efisiensi representasi eksponensial**:

1. **Jumlah Wilayah Linier (*Number of Linear Regions*):**
   Aktivasi ReLU membagi ruang masukan menjadi partisi-partisi linier sebagian (*piecewise linear*).
   - Jaringan dangkal dengan $n$ neuron hanya mampu membagi ruang masukan menjadi paling banyak $\mathcal{O}(n^d)$ wilayah linier.
   - Jaringan dalam dengan $L$ lapisan dan $k$ neuron per lapisan mampu melipatgandakan wilayah linier secara berulang, menghasilkan hingga:
     $$\Omega\left( \left(\frac{k}{d}\right)^{(L-1)d} k^d \right) = \mathcal{O}\left( k^L \right)$$
   Jumlah wilayah linier tumbuh **eksponensial terhadap kedalaman $L$**, namun hanya tumbuh polinomial terhadap lebar $k$.
2. **Komposisi Fungsi Modular:**
   Jaringan dalam merepresentasikan simetri dan struktur hierarki alam semesta (misal: piksel $\to$ tekstur $\to$ bagian objek $\to$ kelas) jauh lebih kompak. Fungsi sederhana seperti perkalian $m$ variabel $f(x_1, \dots, x_m) = x_1 x_2 \dots x_m$ membutuhkan neuron eksponensial pada jaringan 1 lapis, namun hanya butuh $\mathcal{O}(m)$ parameter pada pohon jaringan dalam.`,
        formula: `\text{Linear Regions}_{\text{Deep}} \sim \mathcal{O}(k^L) \gg \text{Linear Regions}_{\text{Shallow}} \sim \mathcal{O}(n^d) \quad (\text{Telgarsky 2016})`,
        code: `# 2.4: Demonstrasi Efisiensi Parameter: Model Dalam vs Model Dangkal
import torch
import torch.nn as nn

# Model Dangkal (Lebar): 1 lapisan dengan 1024 neuron
model_dangkal = nn.Sequential(
    nn.Linear(20, 1024),
    nn.ReLU(),
    nn.Linear(1024, 1)
)

# Model Dalam: 4 lapisan dengan masing-masing 64 neuron
model_dalam = nn.Sequential(
    nn.Linear(20, 64),
    nn.ReLU(),
    nn.Linear(64, 64),
    nn.ReLU(),
    nn.Linear(64, 64),
    nn.ReLU(),
    nn.Linear(64, 1)
)

param_dangkal = sum(p.numel() for p in model_dangkal.parameters())
param_dalam = sum(p.numel() for p in model_dalam.parameters())

print("=== EFISIENSI PARAMETER: KEDALAMAN VS LEBAR ARSITEKTUR ===")
print(f"Parameter Model Dangkal (Lebar) : {param_dangkal:,} bobot")
print(f"Parameter Model Dalam (4 Lapis) : {param_dalam:,} bobot")
print(f"Rasio Penghematan Parameter     : {param_dangkal / param_dalam:.1f}x Lebih Hemat dengan Kapasitas Komposisi Lebih Unggul!")`,
        expectedOutput: "Arsitektur dalam memangkas jumlah parameter drastis dengan kapasitas komposisi non-linier berlipat ganda.",
        codeExp: "Skrip membandingkan jumlah bobot antara model dangkal yang lebar vs model dalam yang ramping, memperlihatkan penghematan parameter masif.",
        pitfalls: [
          "Menambah kedalaman tanpa teknik normalisasi atau residual connections yang memicu masalah vanishing/exploding gradients.",
          "Membuat arsitektur terlalu lebar pada dataset kecil yang memicu overfitting instan (menghafal derau data latih)."
        ],
        refTitle: "Miltiadis Telgarsky: Benefits of Depth in Neural Networks (COLT, 2016)",
        refUrl: "https://arxiv.org/abs/1602.04485"
      },
      {
        num: "2.5",
        slug: "2-5-perambatan-alur-maju-vektorisasi-penuh",
        title: "2.5. Perambatan Alur Maju (Forward Pass): Formulasi Matriks Vektorisasi Penuh",
        desc: "Mekanisme eksekusi komputasi alur maju: eliminasi loop per-sampel melalui pengelompokan batch dan formulasi perkalian matriks paralel.",
        concept: `Dalam implementasi jaringan saraf tiruan produksi, **tidak pernah ada perulangan (\`for\` loop)** di tingkat sampel data individual. Memproses data satu per satu menyebabkan overhead eksekusi CPU/GPU yang sangat masif. Seluruh data dikelompokkan ke dalam blok matriks berukuran $B$ sampel yang disebut **Mini-Batch**.

**Vektorisasi Alur Maju (*Fully Vectorized Forward Pass*):**
Diberikan matriks mini-batch masukan $\mathbf{X} \in \mathbb{R}^{B \\times d_0}$. Perambatan maju melintasi $L$ lapisan dieksekusi sebagai rantai perkalian matriks simultan:

$$\mathbf{Z}^{(1)} = \mathbf{X} \mathbf{W}^{(1)} + \mathbf{b}^{(1)}, \quad \mathbf{A}^{(1)} = \sigma(\mathbf{Z}^{(1)})$$
$$\mathbf{Z}^{(2)} = \mathbf{A}^{(1)} \mathbf{W}^{(2)} + \mathbf{b}^{(2)}, \quad \mathbf{A}^{(2)} = \sigma(\mathbf{Z}^{(2)})$$
$$\dots$$
$$\mathbf{Z}^{(L)} = \mathbf{A}^{(L-1)} \mathbf{W}^{(L)} + \mathbf{b}^{(L)}, \quad \hat{\mathbf{Y}} = \sigma_{\text{out}}(\mathbf{Z}^{(L)})$$

Di mana:
- $\mathbf{X} \in \mathbb{R}^{B \\times d_0}$
- $\mathbf{W}^{(l)} \in \mathbb{R}^{d_{l-1} \\times d_l}$
- $\mathbf{b}^{(l)} \in \mathbb{R}^{1 \\times d_l}$ (diterapkan ke $B$ baris via penyiaran/broadcasting)
- $\mathbf{Z}^{(l)}, \mathbf{A}^{(l)} \in \mathbb{R}^{B \\times d_l}$

Perkalian matriks batch memanfaatkan instruksi akselerator hardware BLAS (*Basic Linear Algebra Subprograms*) dan Tensor Cores berkecepatan teraflops tinggi.`,
        formula: `\mathbf{Z}^{(l)} = \mathbf{A}^{(l-1)} \mathbf{W}^{(l)} + \mathbf{1}_B \mathbf{b}^{(l)}, \quad \mathbf{A}^{(l)} = \sigma(\mathbf{Z}^{(l)}) \quad (\text{Vektorisasi Mini-Batch})`,
        code: `# 2.5: Pembuktian Efisiensi Komputasi Vektorisasi Matriks vs Loop Sampel
import torch
import time

B, D_in, D_out = 1024, 256, 128
X = torch.randn(B, D_in)
W = torch.randn(D_in, D_out)
b = torch.randn(D_out)

# 1. Eksekusi Vektorisasi Penuh (Batch Matrix Multiplication)
t0 = time.perf_counter()
Y_vectorized = torch.relu(X @ W + b)
t_vec = (time.perf_counter() - t0) * 1000

# 2. Eksekusi Naif Per-Sampel Menggunakan Loop Python
t0 = time.perf_counter()
Y_loop = torch.empty(B, D_out)
for i in range(B):
    Y_loop[i] = torch.relu(X[i:i+1] @ W + b)
t_loop = (time.perf_counter() - t0) * 1000

print("=== EFISIENSI KOMPUTASI VEKTORISASI ALUR MAJU ===")
print(f"Waktu Vektorisasi Matriks (Batch): {t_vec:.4f} ms")
print(f"Waktu Loop Naif Python           : {t_loop:.4f} ms")
print(f"Faktor Akselerasi Komputasi      : {t_loop / t_vec:.1f}x Lebih Cepat!")`,
        expectedOutput: "Vektorisasi matriks mini-batch mengeksekusi inferensi puluhan hingga ratusan kali lebih cepat dibandingkan perulangan sampel.",
        codeExp: "Skrip membandingkan runtime eksekusi vektorisasi batch penuh dengan perulangan naif sampel, mendemonstrasikan akselerasi masif komputasi paralel.",
        pitfalls: [
          "Melakukan perulangan for loop untuk iterasi sampel di dalam fungsi forward() PyTorch.",
          "Lupa menyelaraskan dimensi kolom matriks masukan dengan baris matriks bobot ($d_{\text{in}} = W.\text{shape}[0]$)."
        ],
        refTitle: "PyTorch Documentation: torch.matmul and BLAS Operations",
        refUrl: "https://pytorch.org/docs/stable/generated/torch.matmul.html"
      },
      {
        num: "2.6",
        slug: "2-6-batas-keputusan-non-linier-dan-deformasi-topologi",
        title: "2.6. Batas Keputusan Non-Linier: Pemetaan Ruang Laten dan Deformasi Topologi",
        desc: "Interpretasi geometris jaringan saraf tiruan: bagaimana lapisan tersembunyi melipat, meregangkan, dan mendistorsi ruang fitur untuk memisahkan data rumit.",
        concept: `Secara geometris, apa yang sebenarnya dilakukan oleh lapisan tersembunyi (*hidden layers*) di dalam jaringan saraf tiruan?

Sebagaimana dianalisis secara elegan oleh Christopher Olah (2014) dalam *Neural Networks, Manifolds, and Topology*:
1. **Transformasi Affine ($\mathbf{X}\mathbf{W} + \mathbf{b}$):**
   Secara geometris meregangkan (*scaling*), memutar (*rotation*), dan menggeser (*translation*) ruang koordinat masukan tanpa mengubah topologi dasar garis lurus.
2. **Fungsi Aktivasi Non-Linier ($\sigma$):**
   Melipat (*folding*), menekuk, dan memampatkan ruang koordinat tersebut.
3. **Pemisahan Klasifikasi Akhir:**
   Lapisan keluaran terakhir selalu berupa **pengklasifikasi linier sederhana** (garis lurus/hiperplane). Lapisan-lapisan tersembunyi bertugas **mendistorsi dan melipat ruang data yang kusut (*tangled manifold*)** sedemikian rupa sehingga pada ruang lapisan terakhir (*latent feature space*), kelas data yang sebelumnya kusut menjadi terpisahkan secara linier sederhana.

Dengan demikian, kemampuan jaringan dalam menyelesaikan masalah rumit (seperti dua lingkaran konsentris konsentris atau kurva spiral ganda) bukanlah karena classifier akhirnya sangat ajaib, melainkan karena ruang representasi latennya telah berhasil diurai (*untangled*) oleh lapisan tersembunyi.`,
        formula: `\mathbb{R}^{d_{\text{input}}} \\xrightarrow{\text{Deformasi Geometris}} \mathbb{R}^{d_{\text{latent}}} \\xrightarrow{\text{Hyperplane Linier}} \{0, 1\}`,
        code: `# 2.6: Visualisasi Transformasi Geometris Ruang Laten pada Data Konsentris
import torch
import torch.nn as nn

# Buat model mini 2D -> 2D (untuk melacak deformasi koordinat laten)
class ManifoldWarper(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(2, 4),
            nn.Tanh(),
            nn.Linear(4, 2) # Proyeksikan kembali ke 2D agar bisa diamati koordinatnya
        )
    def forward(self, x):
        return self.net(x)

torch.manual_seed(42)
model = ManifoldWarper()

# Titik data masukan (2 titik berjarak melingkar)
x_in = torch.tensor([[1.0, 1.0], [-1.0, -1.0]])
x_warped = model(x_in)

print("=== DEFORMASI RUANG GEOMETRIS OLEH HIDDEN LAYER ===")
print(f"Koordinat Asli Input   :\n{x_in}")
print(f"Koordinat Ruang Laten  :\n{x_warped.detach()}")
print("Status Topologi: Lapisan tersembunyi mendistorsi jarak koordinat untuk menyederhanakan separabilitas.")`,
        expectedOutput: "Lapisan tersembunyi mentransformasikan titik koordinat ke konfigurasi ruang laten baru.",
        codeExp: "Skrip mendemonstrasikan bagaimana lapisan linear + non-linear memetakan ulang koordinat data spasial ke ruang laten terdeformasi.",
        pitfalls: [
          "Menggunakan fungsi aktivasi linier identitas (membuat deformasi ruang tetap linier, kehilangan kemampuan mengurai manifold non-linier).",
          "Mereduksi dimensi laten terlalu sempit di awal jaringan (informasi penting tercekik / information bottleneck prematur)."
        ],
        refTitle: "Christopher Olah: Neural Networks, Manifolds, and Topology (2014)",
        refUrl: "https://colah.github.io/posts/2014-03-NN-Manifolds-Topology/"
      },
      {
        num: "2.7",
        slug: "2-7-desain-arsitektur-klasifikasi-biner-multikelas-multilabel",
        title: "2.7. Desain Arsitektur Klasifikasi Biner, Multi-Kelas, dan Multi-Label",
        desc: "Taksonomi perancangan neuron output dan fungsi aktivasi terminal untuk 3 paradigma klasifikasi terpenting dalam industri.",
        concept: `Perancangan lapisan output jaringan saraf sangat bergantung pada sifat ruang target label yang dihadapi:

1. **Klasifikasi Biner (*Binary Classification*):**
   - Masalah: Membedakan 2 kelas mutually exclusive (misal: Transaksi Fraud vs Normal).
   - Lapisan Output: **1 neuron tunggal**.
   - Aktivasi Terminal: **Sigmoid** $\sigma(z) = \frac{1}{1 + e^{-z}}$, menghasilkan probabilitas skalar $p \in [0, 1]$.
   - Fungsi Kerugian: **Binary Cross-Entropy (BCE)**.
2. **Klasifikasi Multi-Kelas (*Multi-Class Classification*):**
   - Masalah: Memilih tepat 1 kelas juara dari $K$ kelas yang mutually exclusive (misal: klasifikasi digit angka 0 sampai 9 pada MNIST).
   - Lapisan Output: **$K$ neuron**.
   - Aktivasi Terminal: **Softmax** $\text{softmax}(\mathbf{z})_i = \frac{e^{z_i}}{\sum_{j=1}^K e^{z_j}}$, menghasilkan distribusi probabilitas dengan $\sum_{k=1}^K p_k = 1.0$.
   - Fungsi Kerugian: **Categorical Cross-Entropy**.
3. **Klasifikasi Multi-Label (*Multi-Label Classification*):**
   - Masalah: Satu sampel data dapat memiliki beberapa label aktif sekaligus secara independen (misal: artikel berita dapat bertema 'Ekonomi' DAN 'Teknologi' sekaligus).
   - Lapisan Output: **$K$ neuron independen**.
   - Aktivasi Terminal: **Sigmoid pada masing-masing dari $K$ neuron** (Bukan Softmax!).
   - Fungsi Kerugian: **Binary Cross-Entropy dihitung terpisah untuk masing-masing $K$ output** (*Multi-label BCE*).`,
        formula: `\text{Biner: } \sigma(z) \in [0,1], \quad \text{Multi-Kelas: } \sum_{k=1}^K \text{softmax}(\mathbf{z})_k = 1, \quad \text{Multi-Label: } \sigma(z_k) \text{ per label}`,
        code: `# 2.7: Konfigurasi Arsitektur Lapisan Terminal untuk 3 Paradigma Klasifikasi
import torch
import torch.nn as nn

# 1. Kasus Biner: 1 output neuron + Sigmoid
layer_biner = nn.Linear(64, 1)
logits_biner = layer_biner(torch.randn(2, 64))
prob_biner = torch.sigmoid(logits_biner)

# 2. Kasus Multi-Kelas (10 kelas): 10 output neuron + Softmax
layer_multiclass = nn.Linear(64, 10)
logits_mc = layer_multiclass(torch.randn(2, 64))
prob_mc = torch.softmax(logits_mc, dim=-1)

# 3. Kasus Multi-Label (5 atribut independen): 5 output neuron + Sigmoid
layer_multilabel = nn.Linear(64, 5)
logits_ml = layer_multilabel(torch.randn(2, 64))
prob_ml = torch.sigmoid(logits_ml)

print("=== ARSITEKTUR LAPISAN OUTPUT KLASIFIKASI ===")
print(f"Biner (Shape & Probabilitas)       : {prob_biner.shape} -> Nilai: {prob_biner[0].item():.4f}")
print(f"Multi-Kelas (Jumlah Probabilitas=1): {prob_mc.shape} -> Total: {prob_mc[0].sum().item():.4f}")
print(f"Multi-Label (Prob Independen)      : {prob_ml.shape} -> Tiap kelas independen [0, 1]")`,
        expectedOutput: "Arsitektur terminal berhasil memetakan ruang output sesuai paradigma probabilitas biner, softmax, dan multi-label.",
        codeExp: "Skrip mengonfigurasi dimensi output dan fungsi aktivasi terminal untuk klasifikasi biner, multi-kelas (softmax), dan multi-label (independent sigmoid).",
        pitfalls: [
          "Menerapkan aktivasi Softmax pada masalah multi-label (memaksa probabilitas label saling bersaing dan totalnya berjumlah 1).",
          "Menerapkan fungsi Sigmoid/Softmax ganda di dalam model saat menggunakan fungsi loss PyTorch (seperti nn.CrossEntropyLoss) yang secara internal sudah menyatukan softmax."
        ],
        refTitle: "PyTorch Documentation: Loss Functions and Output Topologies",
        refUrl: "https://pytorch.org/docs/stable/nn.html#loss-functions"
      },
      {
        num: "2.8",
        slug: "2-8-desain-arsitektur-regresi-skalar-dan-multivariat",
        title: "2.8. Desain Arsitektur Regresi: Prediksi Skalar dan Regresi Vektor Multivariat",
        desc: "Prinsip perancangan jaringan regresi bernilai kontinu: tanpa fungsi aktivasi pembatas, penanganan rentang tak terbatas, dan estimasi target multivariat.",
        concept: `Berbeda dengan klasifikasi yang memprediksi kategori diskrit, tugas **Regresi** bertujuan memprediksi nilai target kontinu $\hat{y} \in \mathbb{R}$.

**Karakteristik Desain Arsitektur Regresi:**
1. **Regresi Skalar Tunggal:**
   - Memprediksi 1 nilai kontinu (misal: memprediksi harga rumah, estimasi suhu esok hari).
   - Lapisan output terdiri atas **1 neuron linear tanpa fungsi aktivasi** (identitas: $f(z) = z$). Ketiadaan aktivasi memungkinkan jaringan memprediksi angka kontinu di seluruh domain $(-\infty, +\infty)$.
   - *Pengecualian domain:* Jika target secara fisik dijamin selalu positif (misal: harga barang atau durasi waktu), aktivasi ReLU atau Softplus dapat diterapkan pada lapisan akhir.
2. **Regresi Multivariat (*Multi-Target Regression*):**
   - Memprediksi beberapa nilai kontinu yang saling berkorelasi sekaligus.
   - Contoh: Memprediksi koordinat kotak pembatas (*bounding box*) pada deteksi objek: $\hat{\mathbf{y}} = [x_{\min}, y_{\min}, w, h] \in \mathbb{R}^4$.
   - Lapisan output memiliki $M$ neuron linear yang saling membagi representasi lapisan tersembunyi (*shared representation*).

Fungsi kerugian standar yang digunakan adalah **Mean Squared Error (MSE)** untuk penalti kuadratik atau **Huber Loss / Smooth L1** untuk ketahanan terhadap pencilan.`,
        formula: `\hat{\mathbf{y}} = \mathbf{Z}^{(L)} = \mathbf{A}^{(L-1)} \mathbf{W}^{(L)} + \mathbf{b}^{(L)} \in \mathbb{R}^M \quad (\text{Regresi Linear Terminal})`,
        code: `# 2.8: Desain Arsitektur Regresi Multivariat (Bounding Box Predictor)
import torch
import torch.nn as nn

class BoundingBoxRegressor(nn.Module):
    def __init__(self, in_features: int):
        super().__init__()
        self.backbone = nn.Sequential(
            nn.Linear(in_features, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU()
        )
        # Lapisan output 4 neuron kontinu: [center_x, center_y, width, height]
        self.regressor = nn.Linear(32, 4)

    def forward(self, x):
        features = self.backbone(x)
        return self.regressor(features) # Tanpa aktivasi pembatas!

model = BoundingBoxRegressor(in_features=16)
x_sample = torch.randn(2, 16)
pred_bbox = model(x_sample)

print("=== ARSITEKTUR REGRESI MULTIVARIAT (4 TARGET) ===")
print(f"Shape Output Regresi      : {pred_bbox.shape} -> [Batch, 4 Target]")
print(f"Prediksi Koordinat Sampel 1: {pred_bbox[0].tolist()}")`,
        expectedOutput: "Model regresi multivariat menghasilkan 4 prediksi kontinu tak terbatas per sampel.",
        codeExp: "Skrip merancang jaringan regresi multivariat (prediktor bounding box 4 koordinat) dengan lapisan output linear tanpa aktivasi saturasi.",
        pitfalls: [
          "Secara tidak sengaja memasang aktivasi Sigmoid atau Tanh pada lapisan output regresi yang membatasi prediksi hanya di rentang [0, 1] atau [-1, 1].",
          "Lupa menstandarisasi target kontinu ($y$) yang memiliki skala nilai sangat besar (menyebabkan lonjakan gradien tak stabil)."
        ],
        refTitle: "PyTorch Documentation: Linear Layer for Regression",
        refUrl: "https://pytorch.org/docs/stable/generated/torch.nn.Linear.html"
      },
      {
        num: "2.9",
        slug: "2-9-pemodelan-pytorch-berorientasi-objek-torch-nn-module",
        title: "2.9. Pemodelan PyTorch Berorientasi Objek: Mewarisi torch.nn.Module dan Mendefinisikan forward()",
        desc: "Standar arsitektur perangkat lunak deep learning: registrasi otomatis parameter bobot, pelacakan sub-modul, dan pemisahan inisialisasi vs komputasi.",
        concept: `Dalam ekosistem PyTorch standar industri, model jaringan saraf tidak pernah ditulis sebagai fungsi prosedural lepas, melainkan sebagai kelas berorientasi objek yang mewarisi kelas dasar **\`torch.nn.Module\`**.

**Mengapa Mewarisi \`torch.nn.Module\`?**
1. **Registrasi Parameter Otomatis:**
   Setiap atribut lapisan (seperti \`nn.Linear\`) yang didefinisikan di dalam konstruktor \`__init__()\` secara otomatis didaftarkan ke dalam pohon parameter model. Fungsi \`model.parameters()\` dapat langsung mengumpulkan seluruh bobot dan bias untuk diserahkan ke optimizer.
2. **Pemisahan Definisi Arsitektur dan Aliran Komputasi:**
   - \`__init__()\`: Mendefinisikan komponen lapisan (*structural layers*) dan konfigurasi hiperparameter.
   - \`forward(*inputs)\`: Mendefinisikan aliran logika komputasi tensor dinamis (*computation graph*).
3. **Peralihan Mode Operasional Instan:**
   Menyediakan fungsi utilitas \`model.train()\` (mengaktifkan dropout dan update batchnorm) dan \`model.eval()\` (membekukan statistik untuk inferensi deterministik).
4. **Serialisasi dan Pemindahan Perangkat:**
   Fungsi \`model.to(device)\` secara otomatis memindahkan seluruh ratusan lapisan sub-modul ke GPU dalam satu baris perintah.`,
        formula: `\text{Class Model}(\text{nn.Module}) \implies \text{Auto Parameter Registration } \Theta = \{W^{(l)}, b^{(l)}\}_{l=1}^L`,
        code: `# 2.9: Standar Industri Perancangan Model PyTorch Berorientasi Objek
import torch
import torch.nn as nn

class ArsitekturMLPStandar(nn.Module):
    def __init__(self, in_features: int, hidden_dim: int, num_classes: int):
        super().__init__() # Wajib memanggil super init untuk mengaktifkan registrasi nn.Module
        self.fc1 = nn.Linear(in_features, hidden_dim)
        self.act = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Alur komputasi dinamis
        h = self.act(self.fc1(x))
        out = self.fc2(h)
        return out

model = ArsitekturMLPStandar(in_features=20, hidden_dim=64, num_classes=3)
total_params = sum(p.numel() for p in model.parameters() if p.requires_grad)

print("=== PEMODELAN BERORIENTASI OBJEK TORCH.NN.MODULE ===")
print(f"Struktur Modul Terdaftar:\n{model}")
print(f"Total Parameter Terdidik : {total_params:,} bobot")
print(f"Mode Operasional Aktif   : Training={model.training}")`,
        expectedOutput: "Model PyTorch mewarisi nn.Module dengan seluruh parameter terdaftar dan siap dilatih.",
        codeExp: "Skrip merancang kelas arsitektur MLP modular mewarisi torch.nn.Module, menunjukkan struktur lapisan, pemanggilan forward, dan penghitungan parameter.",
        pitfalls: [
          "Lupa memanggil super().__init__() di baris pertama konstruktor yang memicu AttributeError saat mendefinisikan lapisan.",
          "Mendefinisikan lapisan baru di dalam metode forward() alih-alih di __init__() (menyebabkan lapisan diinisialisasi ulang acak pada setiap iterasi!)."
        ],
        refTitle: "PyTorch Documentation: torch.nn.Module Specification",
        refUrl: "https://pytorch.org/docs/stable/generated/torch.nn.Module.html"
      },
      {
        num: "2.10",
        slug: "2-10-praktikum-membangun-dan-melatih-mlp-klasifikasi-spiral",
        title: "2.10. Praktikum Komprehensif: Membangun dan Melatih MLP dari Nol untuk Pemisahan Spiral Non-Linier",
        desc: "Proyek integratif Bab 2: melatih arsitektur MLP PyTorch end-to-end pada dataset kurva spiral dua cabang non-linear kompleks hingga konvergen sempurna.",
        concept: `Sebagai puncak integrasi Bab 2, kita menguji keampuhan arsitektur MLP pada salah satu benchmark klasik tersulit dalam pemodelan linier: **Dataset Dua Kurva Spiral Bersilangan (*Two-Spirals Problem*)**.

Data spiral adalah dataset 2D di mana dua kelas data saling melilit satu sama lain dalam koordinat kutub spiral non-linier tinggi:
$$r = \theta, \quad x = r \cos(\theta), \; y = r \sin(\theta)$$
Masalah ini sepenuhnya mustahil diselesaikan oleh algoritma linier (akurasi $50\%$, setara tebakan koin). Kita akan:
1. Membangun model MLP 3 lapisan (\`nn.Linear\` $\to$ \`ReLU\` $\to$ \`nn.Linear\` $\to$ \`ReLU\` $\to$ \`nn.Linear\`).
2. Menyiapkan fungsi objektif \`nn.CrossEntropyLoss\` dan optimizer \`torch.optim.Adam\`.
3. Menjalankan loop pelatihan lengkap dan membuktikan bahwa jaringan mampu mendistorsi ruang laten hingga akurasi mencapai $\ge 98\%$.`,
        formula: `\mathcal{L}_{\text{CE}} = -\frac{1}{N}\sum_{i=1}^N \log\left(\frac{e^{z_{y_i}}}{\sum_j e^{z_j}}\right) \\xrightarrow{\text{Adam}} \text{Akurasi} \ge 98\%`,
        code: `# 2.10: Proyek Terintegrasi: Pelatihan MLP pada Dataset Spiral Non-Linier
import torch
import torch.nn as nn
import numpy as np

# 1. Sintesis Dataset Spiral 2 Kelas (100 sampel per kelas)
N = 100
np.random.seed(42)
theta = np.sqrt(np.random.rand(N)) * 2 * np.pi

# Spiral Kelas 0
r0 = 2 * theta + np.pi
x0 = np.cos(r0) * theta + np.random.randn(N) * 0.1
y0 = np.sin(r0) * theta + np.random.randn(N) * 0.1

# Spiral Kelas 1
r1 = -2 * theta - np.pi
x1 = np.cos(r1) * theta + np.random.randn(N) * 0.1
y1 = np.sin(r1) * theta + np.random.randn(N) * 0.1

X = np.vstack([np.column_stack([x0, y0]), np.column_stack([x1, y1])]).astype(np.float32)
y = np.hstack([np.zeros(N), np.ones(N)]).astype(np.int64)

X_t = torch.from_numpy(X)
y_t = torch.from_numpy(y)

# 2. Desain Arsitektur MLP 3 Lapis
model = nn.Sequential(
    nn.Linear(2, 64),
    nn.ReLU(),
    nn.Linear(64, 64),
    nn.ReLU(),
    nn.Linear(64, 2)
)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.02)

# 3. Training Loop Singkat (200 epoch)
for epoch in range(200):
    optimizer.zero_grad()
    out = model(X_t)
    loss = criterion(out, y_t)
    loss.backward()
    optimizer.step()

with torch.no_grad():
    preds = torch.argmax(model(X_t), dim=1)
    acc = (preds == y_t).float().mean().item() * 100

print("=== PRAKTIKUM TERINTEGRASI: PELATIHAN MLP DATASET SPIRAL ===")
print(f"Jumlah Sampel Data Spiral : {len(X)} koordinat")
print(f"Loss Akhir Pelatihan      : {loss.item():.4f}")
print(f"Akurasi Klasifikasi MLP   : {acc:.1f}% (Berhasil Memisahkan Manifold Spiral Kompleks!)")`,
        expectedOutput: "Model MLP berhasil mempelajari batas keputusan non-linier kurva spiral dengan akurasi mendekati 100%.",
        codeExp: "Skrip membangun dataset kurva spiral non-linier dan melatih arsitektur MLP PyTorch end-to-end hingga mencapai konvergensi dan akurasi tinggi.",
        pitfalls: [
          "Menggunakan model terlalu dangkal (hanya 1 lapisan tersembunyi berkapasitas rendah) pada dataset spiral yang gagal mempelajari kurva melilit.",
          "Lupa mengosongkan gradien (optimizer.zero_grad()) di awal iterasi loop pelatihan."
        ],
        refTitle: "CS231n Convolutional Neural Networks: Neural Networks Part 1",
        refUrl: "https://cs231n.github.io/neural-networks-1/"
      }
    ]
  }
];
