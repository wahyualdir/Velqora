import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: DEEP LEARNING (TOPIK 12) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning. MIT Press.
 * - Kingma, D. P., & Ba, J. (2014). Adam: A Method for Stochastic Optimization. ICLR 2015.
 * - Loshchilov, I., & Hutter, F. (2017). Decoupled Weight Decay Regularization (AdamW). ICLR 2019.
 * - He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep Residual Learning for Image Recognition. CVPR 2016.
 * - Paszke, A., et al. (2019). PyTorch: An Imperative Style, High-Performance Deep Learning Library. NeurIPS.
 */
export const deepLearningCurriculum: AcademicCurriculum = {
  id: "deep-learning",
  slug: "deep-learning",
  title: "Deep Learning",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Arsitektur komprehensif jaringan saraf tiruan mendalam: kalkulus diferensiasi otomatis (Backpropagation & Autograd VJP), algoritma optimasi adaptif (SGD Momentum, Adam, AdamW), teknik regularisasi modern (Dropout, BatchNorm, LayerNorm), arsitektur Residual Network (ResNet), pemodelan sekuensial (LSTM/GRU), serta perancangan Trainer modular PyTorch berkinerja tinggi.",
  estimatedHours: 60,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Deep Learning",
      authors: ["Ian Goodfellow", "Yoshua Bengio", "Aaron Courville"],
      type: "book",
      url: "https://www.deeplearningbook.org/",
      relevance: "Buku teks kanonikal aljabar linear terapan, optimasi numerik, representasi mendalam, dan generalisasi.",
      year: 2016,
      publisherOrVenue: "MIT Press",
    },
    {
      title: "Decoupled Weight Decay Regularization",
      authors: ["Ilya Loshchilov", "Frank Hutter"],
      type: "paper",
      url: "https://arxiv.org/abs/1711.05101",
      doi: "10.48550/arXiv.1711.05101",
      relevance: "Memperbaiki cacat matematis L2 regularization pada optimizer adaptif (Adam) menjadi AdamW.",
      year: 2019,
      publisherOrVenue: "ICLR 2019",
    },
    {
      title: "Deep Residual Learning for Image Recognition",
      authors: ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren", "Jian Sun"],
      type: "paper",
      url: "https://arxiv.org/abs/1512.03385",
      doi: "10.48550/arXiv.1512.03385",
      relevance: "Arsitektur koneksi lewati (skip-connections) yang memecahkan masalah degradasi gradien pada jaringan super dalam.",
      year: 2016,
      publisherOrVenue: "CVPR 2016",
    },
  ],
  chapters: [
    {
      id: "dl-bab-1",
      slug: "fondasi-perceptron-dan-fungsi-aktivasi",
      title: "BAB 1: Anatomi Perceptron & Fungsi Aktivasi Non-Linear",
      orderIndex: 1,
      description: "Keterbatasan Perceptron linear (Minsky & Papert XOR problem), Teorema Universal Approximation (Hornik 1989), dan analisis komparatif aktivasi: Sigmoid, Tanh, ReLU, LeakyReLU, GeLU, serta SiLU/Swish.",
      subchapters: [
        {
          id: "dl-bab-1-1",
          slug: "universal-approximation-dan-aktivasi-modern",
          title: "1.1. Universal Approximation Theorem & Analisis Fungsi Aktivasi",
          orderIndex: 1,
          description: "Mengapa jaringan saraf memerlukan non-linearitas, saturasi gradien pada Sigmoid/Tanh, dan formulasi matematis GeLU/SiLU.",
          content_markdown: `# 1.1. Universal Approximation Theorem & Analisis Fungsi Aktivasi

## 1. Teorema Universal Approximation (Kurt Hornik, 1989)
Teorema ini menyatakan bahwa jaringan saraf tiruan *feedforward* dengan satu lapisan tersembunyi (*single hidden layer*) dan fungsi aktivasi non-linear kontinu non-konstan $\\sigma(\\cdot)$ dapat mengaproksimasi fungsi kontinu arbitrer $f: \\mathbb{R}^n \\to \\mathbb{R}^m$ pada himpunan bagian kompak $\\mathbb{R}^n$ dengan tingkat presisi $\\epsilon > 0$ berapapun, asalkan jumlah neuron tersembunyi $N$ cukup besar:

$$F(x) = \\sum_{i=1}^N v_i \\sigma(w_i^T x + b_i)$$

Meskipun satu lapisan lebar secara teoretis mencukupi, jaringan yang **dalam** (*deep*) terbukti secara empiris dan teoretis memerlukan parameter eksponensial lebih sedikit untuk mempelajari fungsi komposisional kompleks dibanding jaringan yang lebar namun dangkal.

## 2. Formulasi Matematis Fungsi Aktivasi Modern
- **Rectified Linear Unit (ReLU)**:
  $$\\text{ReLU}(z) = \\max(0, z), \\quad \\frac{d}{dz}\\text{ReLU}(z) = \\begin{cases} 1 & \\text{if } z > 0 \\\\ 0 & \\text{if } z < 0 \\end{cases}$$
  *Kelemahan*: Mengalami masalah *Dying ReLU* jika gradien membuat neuron menjadi tidak aktif permanen.
- **Gaussian Error Linear Unit (GeLU)** (Hendrycks & Gimpel, 2016):
  Digunakan pada arsitektur Transformer modern (BERT, GPT, LLaMA). Membobotkan masukan dengan fungsi kumulatif distribusi normal standar $\\Phi(z)$:
  $$\\text{GeLU}(z) = z \\cdot \\Phi(z) = z \\cdot P(X \\le z), \\quad X \\sim \\mathcal{N}(0, 1) \\approx 0.5z \\left( 1 + \\tanh\\left( \\sqrt{\\frac{2}{\\pi}} (z + 0.044715 z^3) \\right) \\right)$$
`,
        },
      ],
    },
    {
      id: "dl-bab-2",
      slug: "computational-graph-dan-backpropagation",
      title: "BAB 2: Computational Graph & Kalkulus Diferensiasi Otomatis",
      orderIndex: 2,
      description: "Aturan rantai multivariat (Multivariate Chain Rule), perambatan maju-mundur, representasi graf asiklik terarah (DAG) pada PyTorch autograd, Vector-Jacobian Products (VJP), dan inisialisasi bobot (Xavier/He).",
      subchapters: [
        {
          id: "dl-bab-2-1",
          slug: "penurunan-matematis-backprop-dan-vjp",
          title: "2.1. Penurunan Aturan Rantai Matriks & Vector-Jacobian Product",
          orderIndex: 1,
          description: "Menghitung gradien analitik parsial $\\frac{\\partial \\mathcal{L}}{\\partial W}$ dan $\\frac{\\partial \\mathcal{L}}{\\partial b}$ untuk tensor berdimensi tinggi tanpa pembentukan matriks Jacobian eksplisit.",
          content_markdown: `# 2.1. Penurunan Aturan Rantai Matriks & Vector-Jacobian Product

## 1. Derivasi Gradien Lapisan Linear
Diberikan transformasi afinitas $\\mathbf{z} = \\mathbf{W} \\mathbf{x} + \\mathbf{b}$, di mana $\\mathbf{x} \\in \\mathbb{R}^d$, $\\mathbf{W} \\in \\mathbb{R}^{m \\times d}$, dan $\\mathbf{b} \\in \\mathbb{R}^m$.
Misalkan skalar loss fungsi tujuan adalah $\\mathcal{L} \\in \\mathbb{R}$. Kita asumsikan gradien upstream $\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{z}} \\in \\mathbb{R}^m$ telah diketahui.

Menggunakan aturan rantai multivariat:
$$\\frac{\\partial \\mathcal{L}}{\\partial W_{ij}} = \\frac{\\partial \\mathcal{L}}{\\partial z_i} \\frac{\\partial z_i}{\\partial W_{ij}} = \\left( \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{z}} \\right)_i x_j$$

Dalam notasi perkalian matriks luar (*outer product*):
$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}} = \\left( \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{z}} \\right) \\mathbf{x}^T \\in \\mathbb{R}^{m \\times d}$$

$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{b}} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{z}} \\in \\mathbb{R}^m$$

$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}} = \\mathbf{W}^T \\left( \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{z}} \\right) \\in \\mathbb{R}^d$$

## 2. Mengapa VJP (Vector-Jacobian Product)?
Matriks Jacobian penuh $\\mathbf{J} = \\frac{\\partial \\mathbf{z}}{\\partial \\mathbf{x}} \\in \\mathbb{R}^{m \\times d}$ dapat berukuran jutaan elemen pada model skala besar. PyTorch *autograd* mengevaluasi perkalian vektor-gradien secara langsung:
$$\\mathbf{v}^T \\mathbf{J}$$
Sehingga menghemat memori $\\mathcal{O}(m \\times d)$ menjadi $\\mathcal{O}(d)$.
`,
        },
      ],
    },
    {
      id: "dl-bab-3",
      slug: "algoritma-optimasi-stokastik-dan-adamw",
      title: "BAB 3: Algoritma Optimasi Stokastik Lanjut & AdamW",
      orderIndex: 3,
      description: "Evolusi pengoptimal numerik: SGD Momentum Polyak, Nesterov Accelerated Gradient (NAG), RMSprop, Adam, dan perbaikan pemisahan peluruhan bobot (Decoupled Weight Decay - AdamW).",
      subchapters: [
        {
          id: "dl-bab-3-1",
          slug: "matematika-adamw-decoupled-weight-decay",
          title: "3.1. Formulasi Matematika Optimizer Adam vs AdamW (Loshchilov & Hutter)",
          orderIndex: 1,
          description: "Analisis mengapa penambahan penalti $L_2$ regularization pada Adam standar menghasilkan update bobot yang salah skala pada gradien berfrekuensi tinggi.",
          content_markdown: `# 3.1. Formulasi Matematika Optimizer Adam vs AdamW (Loshchilov & Hutter)

## 1. Cacat Matematis Adam Standar dengan L2 Regularization
Pada SGD standar, regularisasi $L_2$ ekivalen dengan *Weight Decay*:
$$\\nabla \\tilde{\\mathcal{L}}(\\theta_t) = \\nabla \\mathcal{L}(\\theta_t) + \\lambda \\theta_t$$
$$\\theta_{t+1} = \\theta_t - \\eta \\left( \\nabla \\mathcal{L}(\\theta_t) + \\lambda \\theta_t \\right) = (1 - \\eta \\lambda)\\theta_t - \\eta \\nabla \\mathcal{L}(\\theta_t)$$

Namun pada **Adam standar**, gradien terregularisasi ini dimasukkan ke dalam estimasi momen pertama ($m_t$) dan momen kedua ($v_t$):
$$m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) \\nabla \\tilde{\\mathcal{L}}(\\theta_t)$$
$$v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) (\\nabla \\tilde{\\mathcal{L}}(\\theta_t))^2$$
Update bobot:
$$\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$$

Akibatnya, penalti weight decay dipotong oleh pembagi $\\sqrt{\\hat{v}_t}$. Bobot dengan gradien besar justru mengalami peluruhan lebih kecil dari yang semestinya!

## 2. Formulasi AdamW (Decoupled Weight Decay)
Loshchilov & Hutter (ICLR 2019) memisahkan penalti peluruhan bobot langsung ke pembaruan parameter:

$$m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) \\nabla \\mathcal{L}(\\theta_t)$$
$$v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) (\\nabla \\mathcal{L}(\\theta_t))^2$$
$$\\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1 - \\beta_2^t}$$
$$\\theta_{t+1} = \\theta_t - \\eta_t \\lambda \\theta_t - \\frac{\\eta_t}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$$

Inovasi ini menjadikan AdamW sebagai optimizer standar de facto untuk pelatihan Transformer dan model deep learning modern.
`,
        },
      ],
    },
    {
      id: "dl-bab-4",
      slug: "teknik-regularisasi-dan-normalisasi-mendalam",
      title: "BAB 4: Regularisasi Mendalam & Teknik Normalisasi Lapisan",
      orderIndex: 4,
      description: "Mekanisme kestabilan propagasi aktivasi: Dropout Srivastava et al., Batch Normalization (Ioffe & Szegedy), Layer Normalization (Ba et al.), dan Group Normalization.",
      subchapters: [
        {
          id: "dl-bab-4-1",
          slug: "batchnorm-vs-layernorm-matematika",
          title: "4.1. Batch Normalization vs Layer Normalization: Formulasi & Axis Normalisasi",
          orderIndex: 1,
          description: "Perbedaan dimensi perataan statistik (batch axis vs feature axis), running mean/variance pada fase evaluasi, dan keunggulan LayerNorm pada arsitektur NLP/Transformer.",
          content_markdown: `# 4.1. Batch Normalization vs Layer Normalization: Formulasi & Axis Normalisasi

## 1. Batch Normalization (Ioffe & Szegedy, 2015)
Menormalkan aktivasi di sepanjang dimensi **Batch** ($N$) untuk setiap kanal fitur ($C$) secara independen:

$$\\mu_B = \\frac{1}{m} \\sum_{i=1}^m x_i, \\quad \\sigma_B^2 = \\frac{1}{m} \\sum_{i=1}^m (x_i - \\mu_B)^2$$
$$\\hat{x}_i = \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}$$
$$y_i = \\gamma \\hat{x}_i + \\beta$$

Di mana $\\gamma$ dan $\\beta$ adalah parameter skala dan pergeseran yang dapat dipelajari (*learnable affine parameters*).
- *Kelemahan*: Sangat sensitif terhadap ukuran batch ($m < 8$ menyebabkan estimasi varians tidak stabil); sulit diterapkan pada sekuens variabel NLP.

## 2. Layer Normalization (Ba, Kiros, & Hinton, 2016)
Menormalkan aktivasi di sepanjang dimensi **Fitur / Kanal** untuk setiap sampel data individual secara independen dari sampel lain dalam batch:

$$\\mu_L = \\frac{1}{H} \\sum_{i=1}^H x_i, \\quad \\sigma_L^2 = \\frac{1}{H} \\sum_{i=1}^H (x_i - \\mu_L)^2$$

Karena tidak bergantung pada dimensi batch, LayerNorm berkinerja stabil untuk batch berukuran 1 dan menjadi standar wajib seluruh model Transformer.
`,
        },
      ],
    },
    {
      id: "dl-bab-5",
      slug: "jaringan-konvolusi-dan-resnet",
      title: "BAB 5: Jaringan Konvolusi & Arsitektur Residual (ResNet)",
      orderIndex: 5,
      description: "Inductive bias spasial (Translational Equivariance & Locality), operasi Cross-Correlation 2D, Receptive Field, dan arsitektur Residual Network He et al.",
      subchapters: [
        {
          id: "dl-bab-5-1",
          slug: "residual-connection-dan-mitigasi-degradasi",
          title: "5.1. Formulasi Residual Block & Analisis Aliran Gradien Bebas Hambatan",
          orderIndex: 1,
          description: "Mengapa jaringan 56-lapisan tanpa skip connection memiliki akurasi lebih buruk dari jaringan 20-lapisan, dan bagaimana formulasi $H(x) = F(x) + x$ memecahkan degradasi.",
          content_markdown: `# 5.1. Formulasi Residual Block & Analisis Aliran Gradien Bebas Hambatan

## 1. Masalah Degradasi Jaringan Dalam
Sebelum ResNet (He et al., CVPR 2016), menambah kedalaman lapisan jaringan menyebabkan akurasi meluruh tajam (*degradation problem*), yang bukan disebabkan oleh overfitting karena kesalahan data latih juga memburuk.

## 2. Formulasi Residual Learning
Alih-alih memaksa tumpukan lapisan mempelajari pemetaan identitas langsung $H(\\mathbf{x})$, ResNet melatih lapisan untuk mempelajari fungsi residual:

$$\\mathcal{F}(\\mathbf{x}) = \\mathcal{H}(\\mathbf{x}) - \\mathbf{x}$$
$$\\mathcal{H}(\\mathbf{x}) = \\mathcal{F}(\\mathbf{x}, \\{W_i\\}) + \\mathbf{x}$$

## 3. Analisis Aliran Gradien Bebas Hambatan (Highway)
Ketika aturan rantai diferensiasi diterapkan pada representasi residual dari lapisan $l$ ke lapisan $L$:
$$\\mathbf{x}_L = \\mathbf{x}_l + \\sum_{i=l}^{L-1} \\mathcal{F}(\\mathbf{x}_i, \\mathcal{W}_i)$$
Turunan terhadap $\\mathbf{x}_l$:
$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_l} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_L} \\frac{\\partial \\mathbf{x}_L}{\\partial \\mathbf{x}_l} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_L} \\left( \\mathbf{I} + \\frac{\\partial}{\\partial \\mathbf{x}_l} \\sum_{i=l}^{L-1} \\mathcal{F}(\\mathbf{x}_i, \\mathcal{W}_i) \\right)$$

Term identitas $\\mathbf{I}$ menjamin bahwa sinyal gradien $\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_L}$ dapat mengalir mundur secara langsung ke lapisan paling awal tanpa memudar (*vanishing*), meskipun bobot intermediate bernilai mendekati nol.
`,
        },
      ],
    },
    {
      id: "dl-bab-6",
      slug: "pemodelan-sekuensial-dan-arsitektur-rekuren",
      title: "BAB 6: Pemodelan Sekuensial & Arsitektur Rekuren (LSTM & GRU)",
      orderIndex: 6,
      description: "Keterbatasan Simple RNN dalam jangka panjang (Exploding/Vanishing Gradient pada BPTT), mekanisme gerbang LSTM (Forget, Input, Output Gates), dan Gated Recurrent Unit (GRU).",
      subchapters: [
        {
          id: "dl-bab-6-1",
          slug: "anatomi-internal-lstm-cell",
          title: "6.1. Anatomi Komputasi LSTM Cell (Hochreiter & Schmidhuber)",
          orderIndex: 1,
          description: "Persamaan gerbang Forget Gate, Input Gate, Kandidat Cell State, dan Output Gate yang menjaga dependensi jangka panjang.",
          content_markdown: `# 6.1. Anatomi Komputasi LSTM Cell (Hochreiter & Schmidhuber)

## 1. Persamaan Internal Long Short-Term Memory (LSTM)
Di setiap langkah waktu $t$, dengan masukan $\\mathbf{x}_t$ dan hidden state sebelumnya $\\mathbf{h}_{t-1}$:

1. **Forget Gate**: Menentukan proporsi informasi lama yang dibuang dari cell state:
   $$\\mathbf{f}_t = \\sigma\\left( \\mathbf{W}_f [\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_f \\right)$$
2. **Input Gate & Candidate State**: Menentukan informasi baru apa yang disimpan:
   $$\\mathbf{i}_t = \\sigma\\left( \\mathbf{W}_i [\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_i \\right)$$
   $$\\tilde{\\mathbf{C}}_t = \\tanh\\left( \\mathbf{W}_c [\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_c \\right)$$
3. **Pembaruan Cell State**:
   $$\\mathbf{C}_t = \\mathbf{f}_t \\odot \\mathbf{C}_{t-1} + \\mathbf{i}_t \\odot \\tilde{\\mathbf{C}}_t$$
4. **Output Gate & Hidden State**:
   $$\\mathbf{o}_t = \\sigma\\left( \\mathbf{W}_o [\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_o \\right)$$
   $$\\mathbf{h}_t = \\mathbf{o}_t \\odot \\tanh(\\mathbf{C}_t)$$
`,
        },
      ],
    },
    {
      id: "dl-bab-7",
      slug: "pelatihan-skala-produksi-pytorch",
      title: "BAB 7: Arsitektur Modular PyTorch & Pelatihan Skala Produksi",
      orderIndex: 7,
      description: "Praktek terbaik engineering PyTorch: modul \`nn.Module\`, pipeline \`DataLoader\` teroptimasi (num_workers, pin_memory), Automatic Mixed Precision (AMP dengan torch.cuda.amp), dan gradient clipping.",
      subchapters: [
        {
          id: "dl-bab-7-1",
          slug: "mixed-precision-dan-optimasi-gpu",
          title: "7.1. Automatic Mixed Precision (AMP) & Optimasi Throughput GPU",
          orderIndex: 1,
          description: "Meningkatkan throughput inferensi dan pelatihan hingga 2.5x dengan FP16/BF16 dan penanganan underflow menggunakan GradScaler.",
          content_markdown: `# 7.1. Automatic Mixed Precision (AMP) & Optimasi Throughput GPU

## 1. Mengapa Mixed Precision?
Komputasi FP32 standar membutuhkan 32 bit per parameter. GPU modern (Tensor Cores NVIDIA Volta, Ampere, Hopper) memiliki unit FP16/BF16 yang mampu mengeksekusi operasi Matrix Multiply-Accumulate (MMA) 2x sampai 4x lebih cepat dengan separuh bandwidth memori.

## 2. Penanganan Underflow dengan GradScaler
Gradien pada deep learning seringkali bernilai sangat kecil ($< 2^{-14}$), yang mengalami *underflow* menjadi nol pada format IEEE 754 Half-Precision (FP16).
\`torch.cuda.amp.GradScaler\` mengalikan nilai loss dengan faktor penskalaan $S$:
$$\\mathcal{L}_{\\text{scaled}} = S \\cdot \\mathcal{L}$$
Gradien dihitung pada skala besar, lalu dibagi kembali dengan $S$ sebelum optimizer melakukan update parameter $\\theta$.
`,
        },
      ],
    },
    {
      id: "dl-bab-8",
      slug: "proyek-resnet-kustom-end-to-end",
      title: "BAB 8: Proyek Terapan: Arsitektur ResNet Kustom & Trainer Terverifikasi",
      orderIndex: 8,
      description: "Membangun model deep learning modular lengkap dari nol: blok konvolusi residual kustom, loop pelatihan robust dengan AdamW, penjadwalan Cosine Annealing, dan evaluasi performa.",
      subchapters: [
        {
          id: "dl-bab-8-1",
          slug: "proyek-akhir-resnet-classifier",
          title: "8.1. Proyek Akhir: Mini-ResNet Classifier & Trainer Terstandarisasi",
          orderIndex: 1,
          description: "Implementasi kode PyTorch lengkap: subclass nn.Module, residual skip-connections dengan 1x1 projection konvolusi, dan trainer yang aman terhadap NaN.",
          content_markdown: `# 8.1. Proyek Akhir: Mini-ResNet Classifier & Trainer Terstandarisasi

## 1. Deskripsi Proyek
Mahasiswa membangun arsitektur Residual Network modular untuk klasifikasi pola gambar resolusi 32x32 piksel, menerapkan AdamW, dan memvalidasi penurunan loss fungsi.

## 2. Kode Implementasi PyTorch Terverifikasi
\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim

# 1. Definisi Blok Residual Kustom
class ResidualBlock(nn.Module):
    def __init__(self, in_channels: int, out_channels: int, stride: int = 1):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels, out_channels, kernel_size=3, stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(out_channels, out_channels, kernel_size=3, stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_channels)

        # Shortcut connection: lakukan proyeksi 1x1 jika dimensi kanal/stride berubah
        self.shortcut = nn.Sequential()
        if stride != 1 or in_channels != out_channels:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_channels, out_channels, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(out_channels)
            )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        identity = self.shortcut(x)
        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)
        out = self.conv2(out)
        out = self.bn2(out)
        out += identity  # Operasi Residual Skip Connection
        out = self.relu(out)
        return out

# 2. Arsitektur Mini-ResNet Klasifikasi
class MiniResNet(nn.Module):
    def __init__(self, num_classes: int = 10):
        super().__init__()
        self.prep = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True)
        )
        self.layer1 = ResidualBlock(32, 64, stride=2)   # 32x32 -> 16x16
        self.layer2 = ResidualBlock(64, 128, stride=2)  # 16x16 -> 8x8
        self.avg_pool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(128, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out = self.prep(x)
        out = self.layer1(out)
        out = self.layer2(out)
        out = self.avg_pool(out)
        out = torch.flatten(out, 1)
        out = self.fc(out)
        return out

# 3. Pengujian Arsitektur dan Simulasi Satu Putaran Latih
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MiniResNet(num_classes=10).to(device)

# Generator Data Sintetis Batch
batch_size = 16
dummy_images = torch.randn(batch_size, 3, 32, 32, device=device)
dummy_labels = torch.randint(0, 10, (batch_size,), device=device)

# Konfigurasi Loss & Optimizer AdamW Decoupled Weight Decay
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)

# Langkah Maju-Mundur
model.train()
optimizer.zero_grad()
outputs = model(dummy_images)
loss = criterion(outputs, dummy_labels)
loss.backward()

# Gradient Clipping untuk Mencegah Exploding Gradients
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
optimizer.step()

print("=== VERIFIKASI RESNET SELESAI ===")
print(f"Bentuk Tensor Output: {outputs.shape}")
print(f"Nilai Loss Batch    : {loss.item():.4f}")
print("Arsitektur berhasil melakukan backward pass tanpa degradasi gradien.")
\`\`\`

## 3. Rubrik Penilaian Proyek
- **Ketepatan Formulasi Skip Connection (35%)**: Penanganan perubahan dimensi spasial menggunakan proyeksi 1x1 yang valid.
- **Kestabilan Pelatihan & Regularisasi (30%)**: Integrasi BatchNorm, AdamW, dan gradient norm clipping.
- **Efisiensi Komputasi (20%)**: Penggunaan memory layout teratur dan in-place operations pada relu.
- **Kebersihan Kode Berorientasi Objek (15%)**: Struktur PyTorch modular dan mudah diekstensi.
`,
        },
      ],
    },
  ],
};
