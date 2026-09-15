import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: COMPUTER VISION (TOPIK 8) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Szeliski, R. (2022). Computer Vision: Algorithms and Applications (2nd ed.). Springer.
 * - He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep Residual Learning for Image Recognition. CVPR.
 * - Redmon, J., et al. (2016). You Only Look Once: Unified, Real-Time Object Detection. CVPR.
 * - Ronneberger, O., et al. (2015). U-Net: Convolutional Networks for Biomedical Image Segmentation. MICCAI.
 * - Dosovitskiy, A., et al. (2020). An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale. ICLR 2021.
 * - Mildenhall, B., et al. (2020). NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis. ECCV 2020.
 */
export const computerVisionCurriculum: AcademicCurriculum = {
  id: "computer-vision",
  slug: "computer-vision",
  title: "Computer Vision",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Pemrosesan citra digital dan penglihatan komputer tingkat lanjut: manipulasi spasial tensor, deteksi tepi Sobel & Canny, arsitektur Convolutional Neural Networks (CNN) & ResNet, deteksi objek real-time (YOLO, IoU, NMS, mAP), segmentasi citra U-Net, Vision Transformers (ViT), sintesis pandangan baru Neural Radiance Fields (NeRF), serta proyek deteksi objek terverifikasi.",
  estimatedHours: 60,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Computer Vision: Algorithms and Applications (2nd Edition)",
      authors: ["Richard Szeliski"],
      type: "book",
      url: "https://szeliski.org/Book/",
      relevance: "Buku teks otoritatif fondasi matematika pengolahan citra, geometri proyeksi, dan penglihatan komputasional.",
      year: 2022,
      publisherOrVenue: "Springer",
    },
    {
      title: "Deep Residual Learning for Image Recognition",
      authors: ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren", "Jian Sun"],
      type: "paper",
      url: "https://arxiv.org/abs/1512.03385",
      doi: "10.48550/arXiv.1512.03385",
      relevance: "Makalah penemu koneksi pintas residual (skip connection) yang merevolusi pelatihan jaringan dalam (ResNet).",
      year: 2016,
      publisherOrVenue: "IEEE CVPR 2016",
    },
    {
      title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
      authors: ["Alexey Dosovitskiy", "Lucas Beyer", "Alexander Kolesnikov", "Dirk Weissenborn", "et al."],
      type: "paper",
      url: "https://arxiv.org/abs/2010.11929",
      doi: "10.48550/arXiv.2010.11929",
      relevance: "Memperkenalkan Vision Transformer (ViT) yang menggantikan konvolusi murni dengan self-attention pada patch citra.",
      year: 2021,
      publisherOrVenue: "ICLR 2021",
    },
    {
      title: "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis",
      authors: ["Ben Mildenhall", "Pratul P. Srinivasan", "Matthew Tancik", "Jonathan T. Barron", "Ravi Ramamoorthi", "Ren Ng"],
      type: "paper",
      url: "https://arxiv.org/abs/2003.08934",
      doi: "10.48550/arXiv.2003.08934",
      relevance: "Sintesis pandangan 3D fotorealistis menggunakan jaringan saraf kontinu dan volume rendering.",
      year: 2020,
      publisherOrVenue: "ECCV 2020",
    },
  ],
  chapters: [
    {
      id: "cv-bab-1",
      slug: "fondasi-citra-digital-dan-pemrosesan-spasial",
      title: "BAB 1: Fondasi Citra Digital & Pemrosesan Ruang Spasial",
      orderIndex: 1,
      description: "Representasi tensor citra, ruang warna (RGB, HSV, Grayscale), konvolusi matriks 2D diskrit, dan filter penghalusan spasial Gaussian.",
      subchapters: [
        {
          id: "cv-bab-1-1",
          slug: "representasi-tensor-dan-ruang-warna",
          title: "1.1. Representasi Tensor Citra & Ruang Warna",
          orderIndex: 1,
          description: "Struktur data citra sebagai tensor berdimensi $H \\times W \\times C$, konversi ruang warna, dan normalisasi rentang dinamis.",
          content_markdown: `# 1.1. Representasi Tensor Citra & Ruang Warna

## 1. Formulasi Citra Digital
Citra digital berwarna dimodelkan sebagai tensor terurut:
$$I \\in \\mathbb{R}^{H \\times W \\times C}$$
Di mana:
- $H$: Tinggi citra (*Height* / jumlah baris piksel).
- $W$: Lebar citra (*Width* / jumlah kolom piksel).
- $C$: Jumlah kanal (*Channels*), umumnya $C = 3$ untuk RGB atau $C = 1$ untuk Grayscale.

### Rumus Konversi RGB ke Grayscale Berbobot Luminans (ITU-R BT.601)
Sensitivitas fotoreseptor mata manusia terhadap warna hijau jauh lebih tinggi daripada merah dan biru. Konversi standar menggunakan pembobotan perseptual:

$$Y = 0.299 \\cdot R + 0.587 \\cdot G + 0.114 \\cdot B$$
`,
        },
        {
          id: "cv-bab-1-2",
          slug: "konvolusi-matriks-2d-diskrit",
          title: "1.2. Konvolusi Matriks 2D Diskrit & Pemfilteran Spasial",
          orderIndex: 2,
          description: "Operasi konvolusi matematis antara citra input dan kernel filter (Gaussian Blur, Box Filter), padding, dan stride.",
          content_markdown: `# 1.2. Konvolusi Matriks 2D Diskrit & Pemfilteran Spasial

## 1. Formulasi Matematika Konvolusi 2D
Diberikan citra berdimensi dua $I$ dan kernel filter $K$ berukuran $(2k + 1) \\times (2k + 1)$:

$$(I * K)(i, j) = \\sum_{u=-k}^k \\sum_{v=-k}^k I(i - u, j - v) \\cdot K(u, v)$$

Dalam komputasi deep learning, operasi yang umum diimplementasikan adalah **korelasi silang** (*cross-correlation*):
$$(I \\star K)(i, j) = \\sum_{u=-k}^k \\sum_{v=-k}^k I(i + u, j + v) \\cdot K(u, v)$$

## 2. Kernel Gaussian Smoothing
Kernel Gaussian 2D kontinu didefinisikan sebagai:
$$G(x, y) = \\frac{1}{2\\pi \\sigma^2} \\exp\\left( -\\frac{x^2 + y^2}{2\\sigma^2} \\right)$$
Filter ini mereduksi derau (*noise*) berfrekuensi tinggi tanpa menghasilkan artefak cincin (*ringing artifacts*).
`,
        },
      ],
    },
    {
      id: "cv-bab-2",
      slug: "deteksi-tepi-dan-ekstraksi-fitur-klasik",
      title: "BAB 2: Deteksi Tepi & Ekstraksi Fitur Spasial Klasik",
      orderIndex: 2,
      description: "Operator gradien Sobel, algoritma deteksi tepi optimal Canny multi-tahap (non-maximum suppression & hysteresis thresholding), dan deskriptor sudut Harris.",
      subchapters: [
        {
          id: "cv-bab-2-1",
          slug: "operator-sobel-dan-canny-edge-detector",
          title: "2.1. Operator Gradien Sobel & Algoritma Deteksi Tepi Canny",
          orderIndex: 1,
          description: "Penghitungan magnitudo dan orientasi gradien piksel menggunakan kernel Sobel horizontal dan vertikal.",
          content_markdown: `# 2.1. Operator Gradien Sobel & Algoritma Deteksi Tepi Canny

## 1. Operator Gradien Sobel
Gradien citra $\\nabla I = (G_x, G_y)^T$ diaproksimasi menggunakan dua kernel konvolusi $3 \\times 3$:

$$G_x = \\begin{bmatrix} -1 & 0 & +1 \\\\ -2 & 0 & +2 \\\\ -1 & 0 & +1 \\end{bmatrix} * I, \\quad G_y = \\begin{bmatrix} -1 & -2 & -1 \\\\ 0 & 0 & 0 \\\\ +1 & +2 & +1 \\end{bmatrix} * I$$

- **Magnitudo Gradien**: $|\\nabla I| = \\sqrt{G_x^2 + G_y^2}$
- **Arah Orientasi Gradien**: $\\theta = \\text{atan2}(G_y, G_x)$

## 2. Empat Tahap Algoritma Canny (1986)
1. **Gaussian Smoothing**: Mereduksi derau frekuensi tinggi.
2. **Gradient Calculation**: Menghitung $G_x, G_y$, magnitudo, dan arah sudut $\\theta$.
3. **Non-Maximum Suppression (NMS)**: Mempertahankan hanya piksel yang merupakan nilai lokal maksimum di sepanjang arah gradien untuk menghasilkan garis setebal 1 piksel.
4. **Hysteresis Thresholding**: Menggunakan dua ambang batas ($T_{\\text{high}}$ dan $T_{\\text{low}}$) untuk mempertahankan tepi kuat dan menyambungkan tepi lemah yang terhubung ke tepi kuat.
`,
        },
      ],
    },
    {
      id: "cv-bab-3",
      slug: "arsitektur-convolutional-neural-networks",
      title: "BAB 3: Arsitektur Convolutional Neural Networks & ResNet",
      orderIndex: 3,
      description: "Prinsip dasar translasi equivariance, kalkulasi dimensi fitur output konvolusi, vanishing gradient problem, dan arsitektur Residual Blocks (He et al. 2016).",
      subchapters: [
        {
          id: "cv-bab-3-1",
          slug: "kalkulasi-dimensi-dan-residual-learning",
          title: "3.1. Kalkulasi Dimensi Output & Residual Learning (ResNet)",
          orderIndex: 1,
          description: "Penurunan analitis dimensi spasial konvolusi serta formulasi residual skip connection $F(x) + x$ untuk melatih jaringan 100+ layer.",
          content_markdown: `# 3.1. Kalkulasi Dimensi Output & Residual Learning (ResNet)

## 1. Rumus Dimensi Spasial Feature Map
Untuk citra masukan berukuran $W_{\\text{in}} \\times H_{\\text{in}}$, ukuran kernel $K$, padding $P$, dan stride $S$:

$$W_{\\text{out}} = \\left\\lfloor \\frac{W_{\\text{in}} - K + 2P}{S} \\right\\rfloor + 1, \\quad H_{\\text{out}} = \\left\\lfloor \\frac{H_{\\text{in}} - K + 2P}{S} \\right\\rfloor + 1$$

## 2. Formulasi Residual Learning (He et al., 2016)
$$\\mathcal{H}(x) = \\mathcal{F}(x, \\{W_i\\}) + x$$
$$\\text{Output Blok Residual}: \\quad y = \\sigma(\\mathcal{F}(x) + x)$$

Keberadaan suku identitas $+x$ menjamin gradien dapat mengalir langsung ke lapisan paling awal tanpa teredam oleh perkalian bobot berulang.
`,
        },
      ],
    },
    {
      id: "cv-bab-4",
      slug: "deteksi-objek-modern-yolo-dan-map",
      title: "BAB 4: Deteksi Objek Modern: YOLO, Anchor Boxes & mAP",
      orderIndex: 4,
      description: "Deteksi objek satu tahap (You Only Look Once), formulasi Intersection over Union (IoU, GIoU, CIoU), Non-Maximum Suppression (NMS), dan metrik Mean Average Precision (mAP COCO).",
      subchapters: [
        {
          id: "cv-bab-4-1",
          slug: "formulasi-iou-nms-dan-yolo",
          title: "4.1. Formulasi Matematis IoU, NMS, dan Paradigma YOLO",
          orderIndex: 1,
          description: "Menghitung luas irisan atas gabungan bounding box, pemangkasan tumpang tindih NMS, dan regresi bounding box terpusat.",
          content_markdown: `# 4.1. Formulasi Matematis IoU, NMS, dan Paradigma YOLO

## 1. Intersection over Union (IoU)
$$\\text{IoU}(B_p, B_{gt}) = \\frac{\\text{Area}(B_p \\cap B_{gt})}{\\text{Area}(B_p \\cup B_{gt})}$$

## 2. Algoritma Non-Maximum Suppression (NMS)
1. Urutkan seluruh kandidat bounding box berdasarkan confidence score $s_i$.
2. Pilih box dengan confidence tertinggi $M$, simpan ke output.
3. Hapus seluruh box lain $B_j$ yang memiliki $\\text{IoU}(M, B_j) > \\text{Threshold}_{\\text{NMS}}$ (biasanya $0.45$).
4. Ulangi secara iteratif hingga tidak ada box tersisa.
`,
        },
      ],
    },
    {
      id: "cv-bab-5",
      slug: "segmentasi-citra-semantik-u-net",
      title: "BAB 5: Segmentasi Citra Semantik & U-Net",
      orderIndex: 5,
      description: "Klasifikasi tingkat piksel, arsitektur simetris U-Net (Contraction path, Expansion path, Skip connections), serta fungsi kerugian Soft Dice Loss.",
      subchapters: [
        {
          id: "cv-bab-5-1",
          slug: "arsitektur-u-net-dan-dice-coefficient",
          title: "5.1. Arsitektur U-Net & Koefisien Dice Loss",
          orderIndex: 1,
          description: "Penurunan fungsi kerugian Dice Loss untuk mengatasi ketidakseimbangan ekstrem antara piksel latar belakang dan objek kecil.",
          content_markdown: `# 5.1. Arsitektur U-Net & Koefisien Dice Loss

## 1. Koefisien Sorensen-Dice
$$\\text{Dice}(P, G) = \\frac{2 |P \\cap G|}{|P| + |G|} = \\frac{2 \\sum_i p_i g_i}{\\sum_i p_i^2 + \\sum_i g_i^2}$$

### Soft Dice Loss untuk Optimasi Gradien
$$\\mathcal{L}_{\\text{Dice}} = 1 - \\frac{2 \\sum_i p_i g_i + \\epsilon}{\\sum_i p_i + \\sum_i g_i + \\epsilon}$$
Di mana $\\epsilon$ adalah konstanta Laplace smoothing untuk mencegah pembagian dengan nol saat $P$ dan $G$ kosong.
`,
        },
      ],
    },
    {
      id: "cv-bab-6",
      slug: "vision-transformers-dan-perhatian-spasial",
      title: "BAB 6: Vision Transformers (ViT) & Masked Autoencoders",
      orderIndex: 6,
      description: "Paradigma perhatian mandiri pada visi: tokenisasi patch $16 \\times 16$, embedding posisi 1D/2D, perbandingan ViT vs CNN (inductive bias vs model capacity), dan Swin Transformer.",
      subchapters: [
        {
          id: "cv-bab-6-1",
          slug: "mekanisme-patch-projection-vit",
          title: "6.1. Tokenisasi Patch Citra & Mekanisme Self-Attention ViT",
          orderIndex: 1,
          description: "Mengonversi citra 2D menjadi sekuens token linear menggunakan proyeksi linear teratur, penambahan token [CLS], dan analisis receptive field global.",
          content_markdown: `# 6.1. Tokenisasi Patch Citra & Mekanisme Self-Attention ViT

## 1. Tokenisasi Patch (Dosovitskiy et al., ICLR 2021)
Citra 2D $\\mathbf{x} \\in \\mathbb{R}^{H \\times W \\times C}$ dipecah menjadi $N$ patch berukuran $P \\times P$:
$$N = \\frac{H \\cdot W}{P^2}$$
Setiap patch diratakan menjadi vektor berdimensi $P^2 \\cdot C$, kemudian diproyeksikan secara linear ke dimensi model $D$:
$$\\mathbf{z}_0 = \\Big[ \\mathbf{x}_{\\text{class}} ; \\; \\mathbf{x}_p^1 \\mathbf{E} ; \\; \\mathbf{x}_p^2 \\mathbf{E} ; \\dots ; \\; \\mathbf{x}_p^N \\mathbf{E} \\Big] + \\mathbf{E}_{\\text{pos}}$$
Di mana $\\mathbf{E} \\in \\mathbb{R}^{(P^2 C) \\times D}$ adalah matriks proyeksi patch, dan $\\mathbf{E}_{\\text{pos}} \\in \\mathbb{R}^{(N+1) \\times D}$ adalah representasi posisi spasial.

## 2. ViT vs CNN: Trade-Off Inductive Bias
- **CNN**: Memiliki *inductive bias* yang kuat berupa translasi equivariance dan lokalitas spasial. Berkinerja baik pada dataset berukuran kecil hingga menengah.
- **ViT**: Tidak memiliki asumsi lokalitas spasial sejak awal (mempelajari relasi antar patch secara bebas dari data). Pada dataset masif ($>100$ juta citra JFT-300M), ViT melampaui CNN terbaik karena kapasitas model yang jauh lebih tinggi.
`,
        },
      ],
    },
    {
      id: "cv-bab-7",
      slug: "rekonstruksi-3d-dan-nerf",
      title: "BAB 7: Rekonstruksi 3D & Neural Radiance Fields (NeRF)",
      orderIndex: 7,
      description: "Dari piksel 2D ke representasi volumetrik 3D: geometri epipolar, Structure from Motion (SfM), formulasi kontinu NeRF (Mildenhall et al., 2020), dan volume rendering.",
      subchapters: [
        {
          id: "cv-bab-7-1",
          slug: "formulasi-kontinu-dan-volume-rendering-nerf",
          title: "7.1. Representasi Pemandangan Implisit & Persamaan Volume Rendering NeRF",
          orderIndex: 1,
          description: "Memetakan koordinat spasial 5D $(x, y, z, \\theta, \\phi)$ menjadi warna RGB dan densitas volume $\\sigma$ menggunakan Multi-Layer Perceptron berposisi tereksitasi.",
          content_markdown: `# 7.1. Representasi Pemandangan Implisit & Persamaan Volume Rendering NeRF

## 1. Fungsi Pemandangan 5D Kontinu
NeRF merepresentasikan adegan 3D sebagai fungsi kontinu:
$$F_\\Theta: (\\mathbf{x}, \\mathbf{d}) \\longrightarrow (\\mathbf{c}, \\sigma)$$
Di mana:
- $\\mathbf{x} = (x, y, z)$ adalah posisi spasial 3D.
- $\\mathbf{d} = (\\theta, \\phi)$ adalah sudut arah pandang kamera 2D.
- $\\mathbf{c} = (r, g, b)$ adalah warna cahaya yang dipancarkan.
- $\\sigma$ adalah densitas volume materi pada titik tersebut.

## 2. Persamaan Integral Volume Rendering
Warna yang diproyeksikan pada sinar kamera $\\mathbf{r}(t) = \\mathbf{o} + t\\mathbf{d}$ dari batas dekat $t_n$ ke batas jauh $t_f$:

$$C(\\mathbf{r}) = \\int_{t_n}^{t_f} T(t) \\cdot \\sigma(\\mathbf{r}(t)) \\cdot \\mathbf{c}(\\mathbf{r}(t), \\mathbf{d}) \\, dt$$

Di mana transmitansi $T(t)$ merepresentasikan probabilitas sinar melewati materi dari $t_n$ ke $t$ tanpa terhalang:
$$T(t) = \\exp\\left( -\\int_{t_n}^t \\sigma(\\mathbf{r}(s)) \\, ds \\right)$$
`,
        },
      ],
    },
    {
      id: "cv-bab-8",
      slug: "praktikum-computer-vision-terpadu",
      title: "BAB 8: Proyek Terapan: Sistem Deteksi Objek & Evaluasi Real-Time",
      orderIndex: 8,
      description: "Membangun sistem computer vision terpadu: konvolusi 2D, pemfilteran Sobel, deteksi tepi Canny, kalkulasi IoU, dan Non-Maximum Suppression (NMS) terverifikasi.",
      subchapters: [
        {
          id: "cv-bab-8-1",
          slug: "lab-konvolusi-dan-iou-python",
          title: "8.1. Proyek Akhir: Engine Konvolusi 2D Spasial & Evaluator IoU / NMS",
          orderIndex: 1,
          description: "Kode Python mandiri tanpa library eksternal berat untuk menguji dan memvalidasi pipeline deteksi objek dan pemfilteran citra.",
          content_markdown: `# 8.1. Proyek Akhir: Engine Konvolusi 2D Spasial & Evaluator IoU / NMS

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
import numpy as np

def convolve2d_manual(image: np.ndarray, kernel: np.ndarray) -> np.ndarray:
    """Melakukan operasi konvolusi 2D spasial tanpa dependensi library eksternal."""
    img_h, img_w = image.shape
    k_h, k_w = kernel.shape
    pad_h, pad_w = k_h // 2, k_w // 2
    
    padded = np.pad(image, ((pad_h, pad_h), (pad_w, pad_w)), mode='constant', constant_values=0)
    output = np.zeros_like(image, dtype=np.float64)
    
    for r in range(img_h):
        for c in range(img_w):
            region = padded[r:r + k_h, c:c + k_w]
            output[r, c] = np.sum(region * kernel)
            
    return output

def compute_iou(boxA: list, boxB: list) -> float:
    """Menghitung Intersection over Union (IoU) dari dua bounding box [x1, y1, x2, y2]."""
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interArea = max(0, xB - xA) * max(0, yB - yA)
    boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

    iou = interArea / float(boxAArea + boxBArea - interArea)
    return iou

def non_maximum_suppression(boxes: list, scores: list, iou_threshold: float = 0.5) -> list:
    """Menjalankan NMS untuk memangkas kotak prediksi tumpang tindih."""
    indices = np.argsort(scores)[::-1]
    keep = []
    
    while len(indices) > 0:
        current = indices[0]
        keep.append(current)
        
        remaining = []
        for idx in indices[1:]:
            iou = compute_iou(boxes[current], boxes[idx])
            if iou <= iou_threshold:
                remaining.append(idx)
        indices = np.array(remaining)
        
    return keep

# Demonstrasi Uji Pipeline
sample_img = np.array([
    [10, 10, 10, 80, 80, 80],
    [10, 10, 10, 80, 80, 80],
    [10, 10, 10, 80, 80, 80],
    [10, 10, 10, 80, 80, 80],
    [10, 10, 10, 80, 80, 80],
    [10, 10, 10, 80, 80, 80]
], dtype=np.float64)

sobel_v = np.array([
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
], dtype=np.float64)

edge_result = convolve2d_manual(sample_img, sobel_v)
print("=== HASIL FILTER SOBEL VERTIKAL ===")
print(np.round(edge_result, 1))

# Uji NMS dengan Tiga Prediksi Deteksi
pred_boxes = [
    [50, 50, 150, 150],
    [52, 53, 148, 152], # Sangat overlap dengan box 1
    [200, 200, 300, 300] # Terpisah jauh
]
conf_scores = [0.92, 0.78, 0.88]

kept_indices = non_maximum_suppression(pred_boxes, conf_scores, iou_threshold=0.45)
print(f"\\nIndeks Bounding Box yang Dipertahankan NMS: {kept_indices}")
assert 0 in kept_indices and 2 in kept_indices and 1 not in kept_indices
print("Verifikasi NMS Berhasil: Duplikasi berhasil dipangkas dengan tepat.")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Pemahaman Konvolusi & Filter Spasial (30%)**: Implementasi padding dan sliding window yang bebas off-by-one error.
- **Formulasi IoU & NMS (35%)**: Penanganan kasus khusus tanpa irisan dan pengurutan confidence score yang benar.
- **Kerapian & Efisiensi Algoritma (20%)**: Kompleksitas waktu optimal dalam iterasi pemangkasan.
- **Validasi Eksperimental (15%)**: Keberhasilan uji assertion pada skenario deterministik.
`,
        },
      ],
    },
  ],
};
