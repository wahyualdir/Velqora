import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: MULTIMODAL AI (TOPIK 21) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Radford, A., et al. (2021). Learning Transferable Visual Models From Natural Language Supervision (CLIP). ICML.
 * - Liu, H., et al. (2023). Visual Instruction Tuning (LLaVA). NeurIPS 2023.
 * - Alayrac, J. B., et al. (2022). Flamingo: a Visual Language Model for Few-Shot Learning. NeurIPS 2022.
 * - Kirillov, A., et al. (2023). Segment Anything (SAM). ICCV 2023.
 * - Li, Y., et al. (2023). Evaluating Object Hallucination in Large Vision-Language Models (POPE). EMNLP 2023.
 */
export const multimodalAiCurriculum: AcademicCurriculum = {
  id: "multimodal-ai",
  slug: "multimodal-ai",
  title: "Multimodal AI",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Fusi representasi lintas modalitas: pembelajaran kontras visual-linguistik (Contrastive Language-Image Pre-training / CLIP), arsitektur Vision-Language Models (LLaVA, Flamingo), Perceiver Resampler, grounding visual & promptable segmentation (SAM), interleaving teks-gambar-audio, mitigasi halusinasi visual (POPE), serta search engine lintas modalitas terverifikasi.",
  estimatedHours: 52,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Learning Transferable Visual Models From Natural Language Supervision",
      authors: ["Alec Radford", "Jong Wook Kim", "Chris Hallacy", "Aditya Ramesh", "Gabriel Goh", "Sandhini Agarwal", "Girish Sastry", "Amanda Askell", "Pamela Mishkin", "Jack Clark", "Gretchen Krueger", "Ilya Sutskever"],
      type: "paper",
      url: "https://arxiv.org/abs/2103.00020",
      doi: "10.48550/arXiv.2103.00020",
      relevance: "Perintis pembelajaran representasi multimodal menggunakan fungsi kerugian InfoNCE simetris pada 400 juta pasangan teks-gambar.",
      year: 2021,
      publisherOrVenue: "ICML 2021",
    },
    {
      title: "Visual Instruction Tuning (LLaVA)",
      authors: ["Haotian Liu", "Chunyuan Li", "Qingyang Wu", "Yong Jae Lee"],
      type: "paper",
      url: "https://arxiv.org/abs/2304.08485",
      doi: "10.48550/arXiv.2304.08485",
      relevance: "Arsitektur LLaVA yang menghubungkan encoder visual ViT dengan LLM melalui proyeksi linear sederhana.",
      year: 2023,
      publisherOrVenue: "NeurIPS 2023",
    },
    {
      title: "Segment Anything",
      authors: ["Alexander Kirillov", "Eric Mintun", "Nikhila Ravi", "Hanzi Mao", "Chloe Rolland", "Laura Gustafson", "Tete Xiao", "Spencer Whitehead", "Alexander C. Berg", "Wan-Yen Lo", "Piotr Dollár", "Ross Girshick"],
      type: "paper",
      url: "https://arxiv.org/abs/2304.02643",
      doi: "10.48550/arXiv.2304.02643",
      relevance: "Arsitektur model fondasi untuk segmentasi citra berbasis prompt spasial dan teks (SAM).",
      year: 2023,
      publisherOrVenue: "ICCV 2023",
    },
  ],
  chapters: [
    {
      id: "mm-bab-1",
      slug: "arsitektur-clip-dan-contrastive-loss",
      title: "BAB 1: Arsitektur CLIP & Pembelajaran Kontras Gambar-Teks",
      orderIndex: 1,
      description: "Arsitektur Two-Tower (Image Encoder ViT/ResNet dan Text Encoder Transformer), normalisasi $L_2$, matriks kesamaan kosinus $N \\times N$, penskalaan suhu terpelajari $\\tau$, dan fungsi kerugian InfoNCE simetris.",
      subchapters: [
        {
          id: "mm-bab-1-1",
          slug: "formulasi-matematika-clip-loss",
          title: "1.1. Formulasi Matematis Symmetric Contrastive Loss (InfoNCE)",
          orderIndex: 1,
          description: "Memaksimalkan kesamaan kosinus pasangan positif $(I_i, T_i)$ pada diagonal utama sekaligus meminimalkan pasangan negatif di luar diagonal.",
          content_markdown: `# 1.1. Formulasi Matematis Symmetric Contrastive Loss (InfoNCE)

## 1. Arsitektur Dua Menara (Two-Tower Architecture)
Diberikan batch berukuran $N$ yang berisi pasangan citra dan teks $(\\mathbf{x}_i^I, \\mathbf{x}_i^T)_{i=1}^N$:
1. **Image Encoder**: $\\mathbf{z}_i^I = f_{\\text{image}}(\\mathbf{x}_i^I) \\in \\mathbb{R}^d$, dinormalisasi: $\\hat{\\mathbf{z}}_i^I = \\frac{\\mathbf{z}_i^I}{\\|\\mathbf{z}_i^I\\|_2}$
2. **Text Encoder**: $\\mathbf{z}_j^T = f_{\\text{text}}(\\mathbf{x}_j^T) \\in \\mathbb{R}^d$, dinormalisasi: $\\hat{\\mathbf{z}}_j^T = \\frac{\\mathbf{z}_j^T}{\\|\\mathbf{z}_j^T\\|_2}$

Matriks kesamaan kosinus berukuran $N \\times N$ dihitung dengan mengalikan matriks fitur terpasang dan diproyeksikan dengan faktor suhu terpelajari $\\tau$:

$$S_{ij} = \\frac{\\hat{\\mathbf{z}}_i^I \\cdot \\hat{\\mathbf{z}}_j^T}{\\tau}$$

## 2. Symmetric InfoNCE Loss
Total loss adalah rata-rata kerugian Cross-Entropy di sepanjang sumbu baris (Image-to-Text) dan kolom (Text-to-Image):

$$\\mathcal{L}_{I \\to T} = -\\frac{1}{N} \\sum_{i=1}^N \\log \\frac{\\exp(S_{ii})}{\\sum_{j=1}^N \\exp(S_{ij})}$$
$$\\mathcal{L}_{T \\to I} = -\\frac{1}{N} \\sum_{j=1}^N \\log \\frac{\\exp(S_{jj})}{\\sum_{i=1}^N \\exp(S_{ij})}$$
$$\\mathcal{L}_{\\text{CLIP}} = \\frac{1}{2} \\left( \\mathcal{L}_{I \\to T} + \\mathcal{L}_{T \\to I} \\right)$$

## 3. Zero-Shot Classification
Untuk mengklasifikasikan citra ke dalam $K$ kelas tanpa fine-tuning:
1. Bentuk prompt teks: *"A photo of a {class_name}"* untuk setiap kelas $k$.
2. Ekstrak embedding teks $\\hat{\\mathbf{z}}_k^T$.
3. Prediksi kelas dengan kesamaan kosinus tertinggi: $\\hat{y} = \\arg\\max_k (\\hat{\\mathbf{z}}^I \\cdot \\hat{\\mathbf{z}}_k^T)$.
`,
        },
      ],
    },
    {
      id: "mm-bab-2",
      slug: "vision-language-models-dan-llava",
      title: "BAB 2: Model Bahasa-Visi (VLM) & Visual Instruction Tuning",
      orderIndex: 2,
      description: "Arsitektur multimodal generatif: LLaVA (Liu et al. NeurIPS 2023), modul konektor proyeksi linear/MLP, Flamingo Perceiver Resampler, dan pre-training penyelarasan fitur.",
      subchapters: [
        {
          id: "mm-bab-2-1",
          slug: "arsitektur-konektor-llava-dan-flamingo",
          title: "2.1. Arsitektur Proyeksi Linear LLaVA & Perceiver Resampler Flamingo",
          orderIndex: 1,
          description: "Menghubungkan ruang representasi visual ViT ke ruang token embedding LLM tanpa melatih ulang backbone model dari nol.",
          content_markdown: `# 2.1. Arsitektur Proyeksi Linear LLaVA & Perceiver Resampler Flamingo

## 1. Arsitektur LLaVA (Liu et al., 2023)
LLaVA menggunakan pendekatan desain minimalis yang sangat elegan:
1. **Vision Backbone**: Menggunakan CLIP ViT-L/14 yang telah dilatih sebelumnya (bobot dibekukan). Ekstrak token fitur sebelum lapisan pooling terakhir: $\\mathbf{Z}_v = g(\\mathbf{X}_v) \\in \\mathbb{R}^{N_v \\times D_v}$ (misal: 576 token berdimensi 1024).
2. **Modal Connector**: Matriks proyeksi linear atau MLP dua lapis $\\mathbf{W}$:
   $$\\mathbf{H}_v = \\mathbf{Z}_v \\mathbf{W} \\in \\mathbb{R}^{N_v \\times D_{\\text{LLM}}}$$
3. **LLM Backbone**: Vektor visual $\\mathbf{H}_v$ diperlakukan persis seperti token embedding teks biasa dan disambungkan di awal prompt:
   $$\\text{Input Sequence} = [\\mathbf{H}_v ; \\; \\mathbf{E}_{\\text{text}}]$$

## 2. Perceiver Resampler (Flamingo - Alayrac et al., 2022)
Untuk mengatasi masalah citra beresolusi tinggi atau video banyak frame yang menghasilkan ribuan token visual, Perceiver Resampler menggunakan $K$ learned query tokens (misal $K = 64$) untuk memadatkan fitur visual ke jumlah token tetap menggunakan Cross-Attention.
`,
        },
      ],
    },
    {
      id: "mm-bab-3",
      slug: "grounding-visual-dan-sam",
      title: "BAB 3: Grounding Visual & Segment Anything Model (SAM)",
      orderIndex: 3,
      description: "Menghubungkan instruksi bahasa ke koordinat fisik citra: Grounding DINO, arsitektur Segment Anything Model (SAM Kirillov et al. 2023), dan promptable mask decoder.",
      subchapters: [
        {
          id: "mm-bab-3-1",
          slug: "arsitektur-dan-prompting-sam",
          title: "3.1. Arsitektur Tiga Komponen SAM & Penguraian Masker Multitugas",
          orderIndex: 1,
          description: "Image Encoder MAE-ViT berbiaya tinggi yang dijalankan sekali, Prompt Encoder ringan (titik, kotak, teks), dan Mask Decoder dua arah.",
          content_markdown: `# 3.1. Arsitektur Tiga Komponen SAM & Penguraian Masker Multitugas

## 1. Tiga Komponen Utama SAM (Kirillov et al., 2023)
1. **Heavy Image Encoder**: ViT berukuran raksasa yang memproses citra resolusi tinggi $1024 \\times 1024$ menghasilkan embedding spasial $64 \\times 64 \\times 256$. Dijalankan **tepat sekali** per citra.
2. **Flexible Prompt Encoder**: Memetakan prompt interaktif pengguna ke dalam vektor representasi:
   - *Titik (Points)* & *Bounding Boxes*: Dienkode menggunakan positional encodings Fourier.
   - *Masker Parsial*: Diproses menggunakan konvolusi 2D.
   - *Teks*: Dienkode menggunakan text encoder CLIP.
3. **Lightweight Mask Decoder**: Transformer dua arah berkecepatan tinggi ($< 50\\text{ ms}$ di browser/CPU) yang melakukan cross-attention antara prompt tokens dan image embedding untuk menghasilkan masker segmentasi biner.
`,
        },
      ],
    },
    {
      id: "mm-bab-4",
      slug: "fusi-multimodal-dan-interleaving",
      title: "BAB 4: Taksonomi Fusi Multimodal & Sekuens Interleaved",
      orderIndex: 4,
      description: "Strategi integrasi modalitas: Early Fusion, Late Fusion, Hybrid Cross-Attention, serta pemrosesan dokumen campuran sekuensial (Interleaved Image-Text-Audio).",
      subchapters: [
        {
          id: "mm-bab-4-1",
          slug: "taksonomi-fusi-dan-interleaved-modeling",
          title: "4.1. Taksonomi Fusi Representasi & Dokumen Interleaved",
          orderIndex: 1,
          description: "Analisis kelemahan fusi akhir (kehilangan interaksi lintas fitur awal) vs fusi awal (ketidakcocokan laju konvergensi antar modalitas).",
          content_markdown: `# 4.1. Taksonomi Fusi Representasi & Dokumen Interleaved

## 1. Tiga Paradigma Fusi Multimodal
1. **Early Fusion**: Menggabungkan fitur mentah pada lapisan masukan (misal: konkatenasi fitur piksel dan spektrogram). Rentan terhadap ketidakseimbangan dimensi.
2. **Late Fusion**: Setiap modalitas dilatih oleh model terpisah hingga menghasilkan keputusan prediksi atau skor logit, lalu digabungkan menggunakan voting terbobot atau regresi logistik. Kelemahan: mengabaikan interaksi korelasional tingkat menengah.
3. **Cross-Attention Fusion (Modern)**: Lapisan perhatian mandiri di mana Query berasal dari satu modalitas (misal teks) dan Key/Value berasal dari modalitas lain (misal visual).

## 2. Dokumen Interleaved (Any-to-Any)
Model multimodal generasi terbaru (seperti GPT-4o dan Gemini) memproses aliran token campuran:
$$\\mathcal{S} = \\{ \\text{token}_1, \\text{token}_2, [\\text{IMG}], \\text{token}_3, [\\text{AUDIO}], \\dots \\}$$
Memungkinkan model menghasilkan respons yang memadukan diagram, narasi teks, dan klip audio secara serentak.
`,
        },
      ],
    },
    {
      id: "mm-bab-5",
      slug: "halusinasi-visual-dan-evaluasi-vlm",
      title: "BAB 5: Halusinasi Visual & Metrik Evaluasi VLM (POPE)",
      orderIndex: 5,
      description: "Patologi model visi-bahasa: kecenderungan model mengklaim keberadaan objek yang tidak tampak pada citra akibat bias prioritas bahasa, metrik POPE, dan benchmark multimodal.",
      subchapters: [
        {
          id: "mm-bab-5-1",
          slug: "metrik-pope-dan-mitigasi-halusinasi",
          title: "5.1. Formulasi Benchmark POPE & Deteksi Halusinasi Objek",
          orderIndex: 1,
          description: "Mengapa VLM menjawab 'Ya' pada 80% pertanyaan keberadaan objek acak, dan protokol pengujian Polling-based Object Probing Evaluation.",
          content_markdown: `# 5.1. Formulasi Benchmark POPE & Deteksi Halusinasi Objek

## 1. Fenomena Halusinasi Objek pada VLM
Jika sebuah citra menampilkan ruang makan, VLM cenderung menjawab *"Ya"* ketika ditanya *"Apakah ada sendok di atas meja?"*, meskipun tidak ada sendok sama sekali pada gambar. Hal ini terjadi karena model bahasa (LLM backbone) memiliki korelasi statistik teks yang sangat kuat bahwa ruang makan biasanya memiliki sendok (*language prior bias* mendominasi sinyal visual).

## 2. Kerangka Evaluasi POPE (Li et al., EMNLP 2023)
POPE menguji model melalui kueri biner diskrit (*Yes/No questions*) pada tiga strategi sampling objek negatif:
1. **Random Strategy**: Objek negatif dipilih secara acak dari seluruh dataset.
2. **Popular Strategy**: Objek negatif dipilih dari objek-objek yang paling sering muncul di seluruh dataset.
3. **Adversarial Strategy**: Objek negatif dipilih dari objek yang paling sering berkorelasi kuat dengan objek yang ada di citra (pengujian terberat).

Metrik dihitung menggunakan Precision, Recall, dan F1-Score pada proporsi jawaban 'Yes'.
`,
        },
      ],
    },
    {
      id: "mm-bab-6",
      slug: "proyek-semantic-search-clip",
      title: "BAB 6: Proyek Terapan: Engine Pencarian Semantik Gambar-Teks & Zero-Shot",
      orderIndex: 6,
      description: "Membangun sistem multimodal komprehensif: normalisasi vektor embedding L2, kalkulasi matriks kesamaan kosinus terbobot temperatur, dan klasifikasi Zero-Shot mandiri.",
      subchapters: [
        {
          id: "mm-bab-6-1",
          slug: "proyek-akhir-clip-search-python",
          title: "6.1. Proyek Akhir: Zero-Shot Image Classifier & Semantic Search Engine",
          orderIndex: 1,
          description: "Kode Python mandiri tanpa dependensi library berat: normalisasi embedding, forward projection multimodal, dan perankingan probabilitas.",
          content_markdown: `# 6.1. Proyek Akhir: Zero-Shot Image Classifier & Semantic Search Engine

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
import numpy as np

class MockCLIPEngine:
    """Simulator inferensi representasi ruang bersama multimodal CLIP (Radford et al., 2021)."""
    def __init__(self, d_embed: int = 128, temperature: float = 0.07):
        self.d_embed = d_embed
        self.temperature = temperature

    def normalize(self, vectors: np.ndarray) -> np.ndarray:
        """Normalisasi L2: menjamin perkalian titik setara dengan kesamaan kosinus."""
        norms = np.linalg.norm(vectors, axis=-1, keepdims=True)
        return vectors / np.maximum(norms, 1e-12)

    def compute_similarity(self, image_embeddings: np.ndarray, text_embeddings: np.ndarray) -> np.ndarray:
        """Menghitung matriks kesamaan kosinus terskala temperatur: S_ij = (I_i . T_j) / tau"""
        norm_img = self.normalize(image_embeddings)
        norm_txt = self.normalize(text_embeddings)
        return (norm_img @ norm_txt.T) / self.temperature

    def zero_shot_classify(self, image_features: np.ndarray, text_prompts: list, class_embeddings: np.ndarray) -> list:
        """Memprediksi label kelas untuk sekumpulan citra menggunakan kesamaan probabilitas Softmax."""
        sim_matrix = self.compute_similarity(image_features, class_embeddings)
        # Softmax di sepanjang sumbu kelas teks
        exp_sim = np.exp(sim_matrix - np.max(sim_matrix, axis=-1, keepdims=True))
        probs = exp_sim / np.sum(exp_sim, axis=-1, keepdims=True)
        
        predictions = []
        for i in range(len(image_features)):
            best_idx = int(np.argmax(probs[i]))
            predictions.append({
                "predicted_label": text_prompts[best_idx],
                "confidence": float(probs[i, best_idx])
            })
        return predictions

# --- Demonstrasi Uji Klasifikasi Zero-Shot ---
np.random.seed(42)
engine = MockCLIPEngine(d_embed=64, temperature=0.1)

# Simulasi 3 kelas label teks
class_labels = ["a photo of a cat", "a photo of an airplane", "a photo of a car"]
# Embedding vektor teks terdefinisi
text_emb = np.array([
    [1.0, 0.2, -0.1] + [0.0]*61,   # Profil Kucing
    [-0.2, 1.2, 0.5] + [0.0]*61,   # Profil Pesawat
    [0.1, 0.4, 1.1] + [0.0]*61     # Profil Mobil
], dtype=np.float64)

# Simulasi 1 citra masukan yang memiliki kemiripan tinggi dengan profil Kucing
test_image_emb = np.array([
    [0.95, 0.18, -0.08] + [0.0]*61
], dtype=np.float64)

results = engine.zero_shot_classify(test_image_emb, class_labels, text_emb)
print("=== HASIL ZERO-SHOT MULTIMODAL CLASSIFICATION ===")
print(f"Prediksi Label : '{results[0]['predicted_label']}'")
print(f"Confidence     : {results[0]['confidence']*100:.2f}%")

assert results[0]["predicted_label"] == "a photo of a cat"
assert results[0]["confidence"] > 0.90
print("=== VERIFIKASI ENGINE MULTIMODAL BERHASIL ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Ketepatan Normalisasi L2 (30%)**: Jaminan bahwa seluruh representasi vektor memiliki norma satuan sebelum perkalian titik.
- **Penerapan Skala Temperatur Softmax (35%)**: Penanganan stabilitas numerik (*overflow prevention*) dan pemilihan nilai $\\tau$ yang tepat.
- **Pemahaman Konseptual Zero-Shot Multimodal (20%)**: Analisis mengapa embedding teks dapat berfungsi sebagai bobot klasifikasi linear.
- **Kerapian & Keterbacaan Kode (15%)**: Struktur kode Python bersih dan modular.
`,
        },
      ],
    },
  ],
};
