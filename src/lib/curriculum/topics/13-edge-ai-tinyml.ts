import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: EDGE AI & TINYML (TOPIK 13) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Warden, P., & Situnayake, D. (2019). TinyML: Machine Learning with TensorFlow Lite on Arduino. O'Reilly.
 * - Jacob, B., et al. (2018). Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference. CVPR.
 * - Hinton, G., Vinyals, O., & Dean, J. (2015). Distilling the Knowledge in a Neural Network. NeurIPS Workshop.
 * - Frankle, J., & Carbin, M. (2019). The Lottery Ticket Hypothesis: Finding Sparse, Trainable Neural Networks. ICLR 2019.
 * - Sandler, M., et al. (2018). MobileNetV2: Inverted Residuals and Linear Bottlenecks. CVPR 2018.
 */
export const edgeAiTinymlCurriculum: AcademicCurriculum = {
  id: "edge-ai-tinyml",
  slug: "edge-ai-tinyml",
  title: "Edge AI & TinyML",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Optimalisasi dan penempatan model kecerdasan buatan pada perangkat berdaya rendah dan mikrokontroler (Edge & TinyML): kuantisasi bilangan bulat 8-bit (PTQ & QAT), pemangkasan bobot (Structured & Unstructured Pruning), distilasi pengetahuan (Teacher-Student KD), arsitektur MobileNetV2 Inverted Residuals, serta kompilasi runtime ONNX / TensorRT / TFLite Micro.",
  estimatedHours: 50,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference",
      authors: ["Benoit Jacob", "Skirmantas Kligys", "Bo Chen", "Menglong Zhu", "Matthew Tang", "Andrew Howard", "Hartwig Adam", "Dmitry Kalenichenko"],
      type: "paper",
      url: "https://arxiv.org/abs/1712.05877",
      doi: "10.1109/CVPR.2018.00286",
      relevance: "Skema kuantisasi affine asimetris INT8 yang mendasari TensorFlow Lite dan PyTorch Mobile.",
      year: 2018,
      publisherOrVenue: "IEEE CVPR 2018",
    },
    {
      title: "TinyML: Machine Learning with TensorFlow Lite on Arduino and Ultra-Low-Power Microcontrollers",
      authors: ["Pete Warden", "Daniel Situnayake"],
      type: "book",
      url: "https://www.oreilly.com/library/view/tinyml/9781492052036/",
      relevance: "Implementasi praktis inferensi model pada RAM berukuran kurang dari 256 KB tanpa sistem operasi.",
      year: 2019,
      publisherOrVenue: "O'Reilly Media",
    },
    {
      title: "Distilling the Knowledge in a Neural Network",
      authors: ["Geoffrey Hinton", "Oriol Vinyals", "Jeff Dean"],
      type: "paper",
      url: "https://arxiv.org/abs/1503.02531",
      doi: "10.48550/arXiv.1503.02531",
      relevance: "Metodologi transfer pengetahuan probabilitas 'dark knowledge' dari model raksasa (Teacher) ke model ramping (Student).",
      year: 2015,
      publisherOrVenue: "NeurIPS Workshop 2015",
    },
    {
      title: "The Lottery Ticket Hypothesis: Finding Sparse, Trainable Neural Networks",
      authors: ["Jonathan Frankle", "Michael Carbin"],
      type: "paper",
      url: "https://arxiv.org/abs/1803.03635",
      doi: "10.48550/arXiv.1803.03635",
      relevance: "Membuktikan keberadaan sub-jaringan jarang (sparse subnetworks) yang mampu menyamai akurasi model penuh jika diinisialisasi dari bobot awal yang sama.",
      year: 2019,
      publisherOrVenue: "ICLR 2019",
    },
  ],
  chapters: [
    {
      id: "edg-bab-1",
      slug: "fondasi-kuantisasi-bilangan-bulat-int8",
      title: "BAB 1: Teori Kuantisasi Bilangan Bulat (INT8 PTQ & QAT)",
      orderIndex: 1,
      description: "Pemetaan floating-point FP32 ke fixed-point INT8, parameter skala (Scale) dan titik nol (Zero-point), Post-Training Quantization vs Quantization-Aware Training, dan Straight-Through Estimator (STE).",
      subchapters: [
        {
          id: "edg-bab-1-1",
          slug: "formulasi-affine-quantization-int8",
          title: "1.1. Formulasi Affine Quantization & Perhitungan Skala-Zero Point",
          orderIndex: 1,
          description: "Penurunan matematis transformasi floating-point riil $r$ ke bilangan bulat kuantisasi $q$, serta rekonstruksi dequantization.",
          content_markdown: `# 1.1. Formulasi Affine Quantization & Perhitungan Skala-Zero Point

## 1. Persamaan Transformasi Affine
Nilai floating-point riil kontinu $r \\in [r_{\\min}, r_{\\max}]$ dipetakan ke bilangan bulat berpresisi rendah $q \\in [q_{\\min}, q_{\\max}]$ (misal $[-128, 127]$ untuk INT8 bertanda atau $[0, 255]$ untuk UINT8 tak-bertanda):

$$r = S \\cdot (q - Z)$$

Di mana:
- **$S$ (*Scale factor*)**: Bilangan real positif yang merepresentasikan resolusi numerik per langkah:
  $$S = \\frac{r_{\\max} - r_{\\min}}{q_{\\max} - q_{\\min}}$$
- **$Z$ (*Zero Point*)**: Bilangan bulat yang menjamin bahwa nilai riil $0.0$ dipetakan tepat ke nilai kuantisasi tanpa galat pembulatan (krusial untuk zero-padding pada konvolusi):
  $$Z = \\text{round}\\left( -\\frac{r_{\\min}}{S} \\right) + q_{\\min}$$

## 2. Operator Kuantisasi Maju
Operasi kuantisasi dari nilai riil $r$ ke bilangan bulat $q$:

$$q = \\text{clamp}\\left( \\left\\lfloor \\frac{r}{S} \\right\\rceil + Z, \\; q_{\\min}, \\; q_{\\max} \\right)$$

Di mana $\\lfloor \\cdot \\rceil$ adalah fungsi pembulatan ke bilangan bulat terdekat (*round-to-nearest*).

## 3. PTQ vs QAT
- **Post-Training Quantization (PTQ)**: Model dilatih dalam FP32, kemudian bobot dan aktivasi dikuantisasi menggunakan dataset kalibrasi kecil. Cepat namun rentan degradasi akurasi jika rentang aktivasi dinamis sangat lebar.
- **Quantization-Aware Training (QAT)**: Mensimulasikan galat kuantisasi selama forward pass menggunakan fake-quantization, dan menggunakan **Straight-Through Estimator (STE)** pada backward pass:
  $$\\frac{\\partial q}{\\partial r} \\approx \\mathbf{1}_{|r| \\le r_{\\max}}$$
  Memungkinkan model mengompensasi hilangnya presisi bobot secara langsung selama fase pelatihan.
`,
        },
      ],
    },
    {
      id: "edg-bab-2",
      slug: "pemangkasan-bobot-dan-sparsity",
      title: "BAB 2: Pemangkasan Bobot Jaringan (Pruning) & Sparsity",
      orderIndex: 2,
      description: "Mereduksi jumlah parameter aktif: Magnitude-based Unstructured Pruning, Structured Filter Pruning untuk akselerasi perangkat keras nyata, dan Teori Lottery Ticket Hypothesis.",
      subchapters: [
        {
          id: "edg-bab-2-1",
          slug: "pruning-terstruktur-vs-tidak-terstruktur",
          title: "2.1. Pruning Terstruktur vs Tidak Terstruktur & Lottery Ticket Hypothesis",
          orderIndex: 1,
          description: "Mengapa matriks jarang (*sparse*) acak sulit dipercepat pada GPU konvensional tanpa hardware sparse accelerator, dan keunggulan pemangkasan kanal utuh.",
          content_markdown: `# 2.1. Pruning Terstruktur vs Tidak Terstruktur & Lottery Ticket Hypothesis

## 1. Unstructured Pruning (Magnitude-Based)
Menyetel setiap bobot $w_{ij}$ menjadi nol jika magnitudo absolutnya di bawah ambang batas $\\tau$:
$$w_{ij} = \\begin{cases} 0 & \\text{if } |w_{ij}| < \\tau \\\\ w_{ij} & \\text{if } |w_{ij}| \\ge \\tau \\end{cases}$$
- *Keunggulan*: Mampu memangkas hingga 90% parameter tanpa kehilangan akurasi.
- *Kelemahan*: Menghasilkan pola sparsity acak yang membutuhkan format indeks khusus (CSR/CSC) dan tidak menghasilkan percepatan komputasi pada CPU/GPU standar tanpa sparse cores khusus.

## 2. Structured Pruning (Filter / Channel Pruning)
Membuang seluruh kanal konvolusi atau neuron penuh berdasarkan norma $L_1$ atau $L_2$ filter:
$$\\|F_k\\|_1 = \\sum_{c=1}^C \\sum_{i=1}^K \\sum_{j=1}^K |w_{c, i, j}|$$
- Mengubah dimensi matriks secara fisik menjadi lebih kecil (misal: 64 kanal $\\to$ 32 kanal).
- Langsung menghasilkan percepatan eksekusi (*speedup*) dan pengurangan memori instan pada semua hardware tanpa library khusus.

## 3. The Lottery Ticket Hypothesis (Frankle & Carbin, 2019)
Jaringan saraf acak yang diinisialisasi secara padat mengandung sub-jaringan terisolasi (*winning tickets*) yang jika dilatih sendiri dengan inisialisasi bobot awalnya yang persis sama ($W_0$), mampu mencapai akurasi uji yang setara dengan jaringan penuh dalam jumlah iterasi yang sama.
`,
        },
      ],
    },
    {
      id: "edg-bab-3",
      slug: "distilasi-pengetahuan-knowledge-distillation",
      title: "BAB 3: Distilasi Pengetahuan (Knowledge Distillation)",
      orderIndex: 3,
      description: "Transfer representasi Teacher-Student (Hinton et al. 2015): suhu Softmax ($\\tau$), Dark Knowledge, formulasi gabungan fungsi kerugian Cross-Entropy dan Kullback-Leibler (KL) Divergence.",
      subchapters: [
        {
          id: "edg-bab-3-1",
          slug: "formulasi-matematis-distilasi-hinton",
          title: "3.1. Formulasi Matematika Loss Distilasi & Suhu Softmax",
          orderIndex: 1,
          description: "Membuka distribusi probabilitas laten kelas non-target menggunakan temperatur Softmax tinggi dan perimbangan bobot loss $\\alpha$.",
          content_markdown: `# 3.1. Formulasi Matematika Loss Distilasi & Suhu Softmax

## 1. Konsep 'Dark Knowledge'
Pada klasifikasi gambar angka (MNIST), model besar (*Teacher*) mungkin memprediksi angka '7' dengan probabilitas $0.90$, namun memberikan probabilitas $0.09$ untuk angka '1' dan $10^{-6}$ untuk angka '8'.
Informasi bahwa '7 mirip dengan 1' disebut **Dark Knowledge** dan mengandung geometri ruang fitur yang jauh lebih kaya dibanding label biner ground-truth keras (*one-hot label*).

## 2. Penskalaan Temperatur Softmax (Hinton et al., 2015)
Probabilitas kelas $q_i$ dihitung dengan membagi logit $z_i$ dengan parameter temperatur $\\tau > 1$:

$$q_i = \\frac{\\exp(z_i / \\tau)}{\\sum_j \\exp(z_j / \\tau)}$$

Saat $\\tau \\to \\infty$, distribusi probabilitas melunak (*soft targets*), menonjolkan relasi halus antar-kelas non-target.

## 3. Formulasi Fungsi Kerugian Gabungan
Total loss untuk melatih jaringan kompak (*Student*) adalah kombinasi linear dua komponen:

$$\\mathcal{L}_{\\text{total}} = (1 - \\alpha) \\mathcal{L}_{\\text{CE}}(y_{\\text{true}}, \\sigma(z_s)) + \\alpha \\cdot \\tau^2 \\cdot \\mathcal{L}_{\\text{KL}}\\left( \\sigma\\left( \\frac{z_t}{\\tau} \\right) \\;\\Big\\|\\; \\sigma\\left( \\frac{z_s}{\\tau} \\right) \\right)$$

Faktor pengali $\\tau^2$ wajib disertakan untuk mengimbangi fakta bahwa magnitudo gradien dari $\\mathcal{L}_{\\text{KL}}$ menyusut sebanding dengan $\\frac{1}{\\tau^2}$ ketika temperatur dinaikkan.
`,
        },
      ],
    },
    {
      id: "edg-bab-4",
      slug: "arsitektur-model-kompak-mobilenet",
      title: "BAB 4: Arsitektur Model Kompak: MobileNetV2 & Inverted Residuals",
      orderIndex: 4,
      description: "Desain jaringan saraf efisien untuk komputasi tepi: Depthwise Separable Convolutions, Inverted Residual Block, Linear Bottlenecks, dan reduksi kompleksitas MACs / FLOPs.",
      subchapters: [
        {
          id: "edg-bab-4-1",
          slug: "depthwise-separable-dan-inverted-residuals",
          title: "4.1. Depthwise Separable Convolution & Inverted Residual Bottleneck",
          orderIndex: 1,
          description: "Membagi konvolusi standar menjadi Depthwise dan Pointwise (1x1), menghemat 8-9x komputasi perkalian-akumulasi (MACs).",
          content_markdown: `# 4.1. Depthwise Separable Convolution & Inverted Residual Bottleneck

## 1. Analisis Efisiensi Depthwise Separable Convolution
Konvolusi 2D standar dengan input $H \\times W \\times D_{\\text{in}}$, ukuran kernel $D_k \\times D_k$, dan filter output $D_{\\text{out}}$ membutuhkan biaya komputasi:
$$\\text{Cost}_{\\text{standard}} = H \\cdot W \\cdot D_{\\text{in}} \\cdot D_{\\text{out}} \\cdot D_k^2$$

Depthwise Separable Convolution membagi proses menjadi dua tahap:
1. **Depthwise Convolution**: Menerapkan 1 filter spasial $D_k \\times D_k$ per kanal input tanpa mencampur kanal.
2. **Pointwise Convolution (1x1)**: Mencampur representasi kanal melintasi kedalaman menggunakan kernel $1 \\times 1$.

Rasio penghematan komputasi:
$$\\frac{\\text{Cost}_{\\text{separable}}}{\\text{Cost}_{\\text{standard}}} = \\frac{H \\cdot W \\cdot D_{\\text{in}} \\cdot D_k^2 + H \\cdot W \\cdot D_{\\text{in}} \\cdot D_{\\text{out}}}{H \\cdot W \\cdot D_{\\text{in}} \\cdot D_{\\text{out}} \\cdot D_k^2} = \\frac{1}{D_{\\text{out}}} + \\frac{1}{D_k^2}$$

Untuk kernel standar $3 \\times 3$ ($D_k = 3$), ini menghasilkan penurunan beban komputasi sebesar **$8$ hingga $9$ kali lipat** dengan penurunan akurasi yang sangat minimal.

## 2. Inverted Residuals & Linear Bottlenecks (MobileNetV2)
- **ResNet Klasik**: Kanal Lebar $\\to$ Bottleneck Sempit (1x1) $\\to$ Kanal Lebar.
- **MobileNetV2 Inverted Residual**: Kanal Sempit $\\to$ Ekspansi Lebar (faktor $t=6$) dengan Depthwise Conv $\\to$ Proyeksi Linear ke Kanal Sempit.
- **Linear Bottleneck**: Menghilangkan aktivasi non-linear ReLU pada lapisan bottleneck akhir untuk mencegah penghancuran informasi pada dimensi representasi rendah (*manifold of interest*).
`,
        },
      ],
    },
    {
      id: "edg-bab-5",
      slug: "kompilasi-grafik-dan-runtime-tflite-micro",
      title: "BAB 5: Kompilasi Grafik & Runtime Inferensi Tepi (TFLite Micro)",
      orderIndex: 5,
      description: "Optimalisasi grafik komputasi: fusi operator (Conv + BatchNorm + ReLU), representasi ONNX, TensorRT auto-tuning, dan eksekusi pada mikrokontroler tanpa dynamic heap allocation.",
      subchapters: [
        {
          id: "edg-bab-5-1",
          slug: "fusi-operator-dan-tensor-arena",
          title: "5.1. Operator Fusion & Alokasi Memori Statis Tensor Arena",
          orderIndex: 1,
          description: "Mencegah fragmentasi memori RAM mikrokontroler menggunakan buffer tunggal Tensor Arena dan penggabungan konstanta BatchNorm ke dalam bobot konvolusi.",
          content_markdown: `# 5.1. Operator Fusion & Alokasi Memori Statis Tensor Arena

## 1. Fusi Operator Konvolusi & BatchNorm
Pada saat inferensi, lapisan Batch Normalization dapat digabungkan (*folded*) sepenuhnya ke dalam bobot kernel konvolusi $\\mathbf{W}$ dan bias $\\mathbf{b}$ secara analitik:

$$\\mathbf{W}_{\\text{fused}} = \\frac{\\gamma}{\\sqrt{\\sigma^2 + \\epsilon}} \\mathbf{W}, \\quad \\mathbf{b}_{\\text{fused}} = \\frac{\\gamma}{\\sqrt{\\sigma^2 + \\epsilon}} (\\mathbf{b} - \\mu) + \\beta$$

Operasi BatchNorm dieliminasi 100% dari grafik inferensi saat runtime, menghemat akses memori dan siklus CPU.

## 2. Paradigma Bebas Alokasi Dinamis (TFLite Micro)
Mikrokontroler berarsitektur ARM Cortex-M (seperti ESP32 atau STM32) memiliki memori SRAM sangat terbatas ($< 512\\text{ KB}$) dan ketiadaan OS:
- Fungsi \`malloc()\` dilarang karena menyebabkan fragmentasi memori fatal (*heap fragmentation crash*).
- **Tensor Arena**: Pengembang mendeklarasikan array statis tunggal byte berukuran tetap:
  \`\`\`c
  constexpr int kTensorArenaSize = 60 * 1024; // 60 KB
  uint8_t tensor_arena[kTensorArenaSize];
  \`\`\`
- Perencana memori (*TFLite Micro Memory Planner*) memetakan buffer aktivasi yang tumpang tindih secara temporal ke alamat memori yang sama di dalam arena.
`,
        },
      ],
    },
    {
      id: "edg-bab-6",
      slug: "proyek-engine-kuantisasi-int8",
      title: "BAB 6: Proyek Terapan: Engine Kuantisasi Affine INT8 & Benchmark Kompresi",
      orderIndex: 6,
      description: "Membangun sistem kuantisasi numerik lengkap: transformasi array bobot FP32 ke INT8, rekonstruksi dekuantisasi, kalkulasi Mean Squared Error (MSE), dan estimasi penghematan memori 4x.",
      subchapters: [
        {
          id: "edg-bab-6-1",
          slug: "lab-kuantisasi-affine-python",
          title: "6.1. Proyek Akhir: Quantizer Affine INT8 & Evaluator Distorsi Numerik",
          orderIndex: 1,
          description: "Kode Python mandiri: implementasi fungsi kuantisasi asimetris, pengujian round-trip, dan validasi penghematan memori biner.",
          content_markdown: `# 6.1. Proyek Akhir: Quantizer Affine INT8 & Evaluator Distorsi Numerik

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
import numpy as np

class AffineQuantizerINT8:
    """Implementasi Kuantisasi Affine Asimetris INT8 sesuai standar Jacob et al. (CVPR 2018)."""
    def __init__(self):
        self.scale: float = 1.0
        self.zero_point: int = 0
        self.q_min: int = -128
        self.q_max: int = 127

    def fit(self, tensor: np.ndarray):
        """Menghitung parameter Scale dan Zero-point dari distribusi tensor nyata."""
        r_min = float(np.min(tensor))
        r_max = float(np.max(tensor))
        
        # Pastikan 0.0 selalu tercakup dalam rentang
        r_min = min(r_min, 0.0)
        r_max = max(r_max, 0.0)

        if r_max == r_min:
            self.scale = 1.0
            self.zero_point = 0
        else:
            self.scale = (r_max - r_min) / (self.q_max - self.q_min)
            # Zero-point calculation
            initial_zero_point = self.q_min - (r_min / self.scale)
            self.zero_point = int(np.clip(np.round(initial_zero_point), self.q_min, self.q_max))

    def quantize(self, tensor: np.ndarray) -> np.ndarray:
        """Mengonversi floating-point FP32 ke fixed-point INT8."""
        q_tensor = np.round(tensor / self.scale) + self.zero_point
        return np.clip(q_tensor, self.q_min, self.q_max).astype(np.int8)

    def dequantize(self, q_tensor: np.ndarray) -> np.ndarray:
        """Merekonstruksi estimasi FP32 dari representasi bilangan bulat INT8."""
        return self.scale * (q_tensor.astype(np.float32) - self.zero_point)

# 1. Simulasi Bobot Jaringan Saraf Konvolusi FP32 (10,000 Parameter)
np.random.seed(42)
fp32_weights = np.random.normal(loc=0.05, scale=0.45, size=(100, 100)).astype(np.float32)

quantizer = AffineQuantizerINT8()
quantizer.fit(fp32_weights)

# 2. Proses Kuantisasi ke INT8
int8_weights = quantizer.quantize(fp32_weights)
reconstructed_weights = quantizer.dequantize(int8_weights)

# 3. Metrik Evaluasi Kompresi & Distorsi
fp32_memory_bytes = fp32_weights.nbytes
int8_memory_bytes = int8_weights.nbytes
compression_ratio = fp32_memory_bytes / int8_memory_bytes
reconstruction_mse = float(np.mean((fp32_weights - reconstructed_weights) ** 2))

print("=== HASIL EVALUASI KUANTISASI EDGE AI ===")
print(f"Scale Parameter (S)     : {quantizer.scale:.6f}")
print(f"Zero-Point (Z)          : {quantizer.zero_point}")
print(f"Memori FP32 Asli        : {fp32_memory_bytes:,} bytes")
print(f"Memori INT8 Terkompresi : {int8_memory_bytes:,} bytes")
print(f"Rasio Penghematan RAM   : {compression_ratio:.1f}x lebih hemat!")
print(f"Mean Squared Error (MSE): {reconstruction_mse:.6e}")

assert compression_ratio == 4.0, "Kuantisasi INT8 dari FP32 harus menghemat tepat 4x memori."
assert reconstruction_mse < 1e-4, "Distorsi numerik rekonstruksi kuantisasi harus sangat rendah."
print("=== VERIFIKASI KUANTISASI INT8 SUKSES ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Presisi Perhitungan Parameter Affine (35%)**: Penanganan kasus khusus nol (*zero-clamping*) dan batas overflow INT8.
- **Kesesuaian Spesifikasi Hardware (30%)**: Tipe data output tepat bertipe \`int8\` satu byte per parameter.
- **Evaluasi Distorsi Rekonstruksi (20%)**: Pengukuran MSE dan Signal-to-Quantization-Noise Ratio (SQNR).
- **Kebersihan Kode & Komentar Teknis (15%)**: Kode Python modular yang siap dihubungkan ke runtime mikrokontroler.
`,
        },
      ],
    },
  ],
};
