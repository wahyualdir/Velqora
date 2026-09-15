import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: LARGE LANGUAGE MODEL (TOPIK 18) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Vaswani, A., et al. (2017). Attention Is All You Need. NeurIPS 2017.
 * - Hoffmann, J., et al. (2022). Training Compute-Optimal Large Language Models (Chinchilla). NeurIPS.
 * - Hu, E. J., et al. (2021). LoRA: Low-Rank Adaptation of Large Language Models. ICLR 2022.
 * - Rafailov, R., et al. (2023). Direct Preference Optimization: Your Language Model is Secretly a Reward Model. NeurIPS 2023.
 * - Dao, T., et al. (2022). FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness. NeurIPS 2022.
 * - Su, J., et al. (2024). RoFormer: Enhanced Transformer with Rotary Position Embedding (RoPE). Neurocomputing.
 */
export const largeLanguageModelCurriculum: AcademicCurriculum = {
  id: "large-language-model",
  slug: "large-language-model",
  title: "Large Language Model",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Arsitektur model fondasi bahasa skala besar: mekanisme autoregresif Transformer decoder-only, formulasi Causal Attention & RoPE (Rotary Position Embedding), FlashAttention, hukum penskalaan Chinchilla, adaptasi efisien parameter rendah (LoRA & QLoRA), penyelarasan preferensi manusia (SFT, RLHF, DPO), akselerasi KV Cache & GQA, serta evaluasi benchmark.",
  estimatedHours: 60,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "LoRA: Low-Rank Adaptation of Large Language Models",
      authors: ["Edward J. Hu", "Yelong Shen", "Phillip Wallis", "Zeyuan Allen-Zhu", "Yuanzhi Li", "Shean Wang", "Lu Wang", "Weizhu Chen"],
      type: "paper",
      url: "https://arxiv.org/abs/2106.09685",
      doi: "10.48550/arXiv.2106.09685",
      relevance: "Metodologi parameter-efficient fine-tuning (PEFT) dengan dekomposisi matriks rank rendah $W_0 + \\frac{\\alpha}{r} B A$.",
      year: 2022,
      publisherOrVenue: "ICLR 2022",
    },
    {
      title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
      authors: ["Rafael Rafailov", "Archit Sharma", "Eric Mitchell", "Stefano Ermon", "Christopher D. Manning", "Chelsea Finn"],
      type: "paper",
      url: "https://arxiv.org/abs/2305.18290",
      doi: "10.48550/arXiv.2305.18290",
      relevance: "Penyelarasan preferensi manusia analitis (DPO) yang mengeliminasi pelatihan model reward terpisah dan loop RL PPO yang tidak stabil.",
      year: 2023,
      publisherOrVenue: "NeurIPS 2023",
    },
    {
      title: "Training Compute-Optimal Large Language Models (Chinchilla)",
      authors: ["Jordan Hoffmann", "Sebastian Borgeaud", "Arthur Mensch", "Elena Buchatskaya", "et al."],
      type: "paper",
      url: "https://arxiv.org/abs/2203.15556",
      doi: "10.48550/arXiv.2203.15556",
      relevance: "Hukum penskalaan optimal komputasi yang membuktikan bahwa parameter model dan jumlah token data latih harus diskalakan secara seimbang 1:1.",
      year: 2022,
      publisherOrVenue: "NeurIPS 2022",
    },
    {
      title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
      authors: ["Tri Dao", "Daniel Y. Fu", "Stefano Ermon", "Atri Rudra", "Christopher Ré"],
      type: "paper",
      url: "https://arxiv.org/abs/2205.14135",
      doi: "10.48550/arXiv.2205.14135",
      relevance: "Optimasi akses memori GPU (SRAM tiling & online softmax) yang mempercepat atensi 2-4x dan memangkas memori dari kuadratik ke linier.",
      year: 2022,
      publisherOrVenue: "NeurIPS 2022",
    },
  ],
  chapters: [
    {
      id: "llm-bab-1",
      slug: "arsitektur-transformer-decoder-dan-rope",
      title: "BAB 1: Arsitektur Transformer Decoder-Only, Causal Masking & RoPE",
      orderIndex: 1,
      description: "Generasi autoregresif teks, topologi Decoder-Only (GPT, LLaMA), matriks masking kausal segitiga bawah, embedding posisi Rotary Position Embedding (RoPE), dan fusi kernel FlashAttention.",
      subchapters: [
        {
          id: "llm-bab-1-1",
          slug: "causal-attention-dan-rope-matematika",
          title: "1.1. Causal Attention Masking & Derivasi Matematika RoPE",
          orderIndex: 1,
          description: "Mencegah kebocoran masa depan menggunakan matriks $-\\infty$ atas dan rotasi 2D kompleks vektor Query-Key.",
          content_markdown: `# 1.1. Causal Attention Masking & Derivasi Matematika RoPE

## 1. Causal Attention Masking
Pada model autoregresif, token pada posisi $i$ hanya diizinkan memperhatikan token-token sebelumnya $j \\le i$:

$$\\mathbf{M}_{ij} = \\begin{cases} 0 & \\text{if } j \\le i \\\\ -\\infty & \\text{if } j > i \\end{cases}$$

$$\\text{Attention}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{softmax}\\left( \\frac{\\mathbf{Q} \\mathbf{K}^T}{\\sqrt{d_k}} + \\mathbf{M} \\right) \\mathbf{V}$$
Karena $\\exp(-\\infty) = 0$, probabilitas perhatian ke token masa depan tereliminasi 100%.

## 2. Rotary Position Embedding (RoPE) (Su et al., 2024)
Alih-alih menambahkan vektor posisi ke token embedding ($x + p$), RoPE memutar vektor Query dan Key dalam bidang kompleks 2D berdasarkan posisinya $m$:

$$\\mathbf{q}_m = \\mathbf{R}_{\\Theta, m}^d \\mathbf{W}_q \\mathbf{x}_m, \\quad \\mathbf{k}_n = \\mathbf{R}_{\\Theta, n}^d \\mathbf{W}_k \\mathbf{x}_n$$

Di mana $\\mathbf{R}_{\\Theta, m}^d$ adalah matriks ortogonal blok-diagonal berukuran $d \\times d$:
$$\\mathbf{R}_{\\Theta, m}^d = \\text{diag}\\left( \\begin{bmatrix} \\cos m\\theta_1 & -\\sin m\\theta_1 \\\\ \\sin m\\theta_1 & \\cos m\\theta_1 \\end{bmatrix}, \\dots, \\begin{bmatrix} \\cos m\\theta_{d/2} & -\\sin m\\theta_{d/2} \\\\ \\sin m\\theta_{d/2} & \\cos m\\theta_{d/2} \\end{bmatrix} \\right)$$

Hasil kali dalam (*inner product*) secara natural mengekspresikan informasi posisi relatif:
$$\\langle \\mathbf{q}_m, \\mathbf{k}_n \\rangle = \\text{Re}\\left[ \\mathbf{q}_m \\mathbf{k}_n^* \\right] = g(\\mathbf{x}_m, \\mathbf{x}_n, m - n)$$
Memberikan kapabilitas ekstrapolasi panjang konteks yang jauh lebih superior dibanding absolute positional embeddings.
`,
        },
      ],
    },
    {
      id: "llm-bab-2",
      slug: "hukum-penskalaan-dan-pra-pelatihan",
      title: "BAB 2: Hukum Penskalaan (Scaling Laws) & Pra-Pelatihan Fondasi",
      orderIndex: 2,
      description: "Penskalaan komputasi FLOPs: Hukum Kaplan et al. (OpenAI 2020) vs Chinchilla (DeepMind 2022), rasio optimal parameter vs token data, kurasi korpus raksasa, dan stabilitas pelatihan.",
      subchapters: [
        {
          id: "llm-bab-2-1",
          slug: "hukum-chinchilla-dan-budget-komputasi",
          title: "2.1. Hukum Penskalaan Komputasi Optimal Chinchilla (Hoffmann et al.)",
          orderIndex: 1,
          description: "Mengapa model seperti GPT-3 (175B) terlatih kurang optimal (*undertrained*), dan pembuktian rasio seimbang $N \\propto D$.",
          content_markdown: `# 2.1. Hukum Penskalaan Komputasi Optimal Chinchilla (Hoffmann et al.)

## 1. Aproksimasi Budget Komputasi FLOPs
Untuk Transformer decoder-only, komputasi floating-point per token selama satu langkah forward-backward pass diaproksimasi sebagai:
$$C \\approx 6 N D$$
Di mana:
- $C$: Total komputasi FLOPs yang tersedia.
- $N$: Jumlah parameter model (tanpa menghitung embedding).
- $D$: Jumlah token teks dalam dataset latih.

## 2. Temuan Hukum Chinchilla
Hoffmann et al. (NeurIPS 2022) membuktikan bahwa untuk budget komputasi $C$ tertentu, ukuran model $N$ dan jumlah data $D$ harus diskalakan secara proporsional sama:

$$N_{\\text{opt}} \\propto C^{a}, \\quad D_{\\text{opt}} \\propto C^{b}, \\quad a \\approx b \\approx 0.5$$

Secara praktis, untuk setiap parameter model, dibutuhkan sekitar **20 token data latih**:
$$D \\approx 20 \\times N$$
Sebagian besar model generasi awal (seperti GPT-3 175B yang hanya dilatih pada 300 miliar token, rasio $< 2$) sangat *undertrained*. Model yang lebih kecil namun dilatih pada data jauh lebih banyak (seperti LLaMA-7B pada 1.4 triliun token) mengungguli model raksasa dengan biaya inferensi jauh lebih murah.
`,
        },
      ],
    },
    {
      id: "llm-bab-3",
      slug: "adaptasi-efisien-peft-dan-lora",
      title: "BAB 3: Fine-Tuning Efisien: PEFT, LoRA & QLoRA",
      orderIndex: 3,
      description: "Mengadaptasi model miliaran parameter tanpa melatih ulang seluruh bobot: Hipotesis Intrinsic Rank, Low-Rank Adaptation (LoRA Hu et al. 2021), kuantisasi 4-bit NormalFloat (NF4), dan QLoRA.",
      subchapters: [
        {
          id: "llm-bab-3-1",
          slug: "matematika-dekomposisi-lora-dan-qlora",
          title: "3.1. Formulasi Matematika Dekomposisi Rank Rendah LoRA",
          orderIndex: 1,
          description: "Penurunan dekomposisi matriks pembaruan bobot $\\Delta W = \\frac{\\alpha}{r} B A$, inisialisasi nol matriks $B$, dan penggabungan bobot saat inferensi.",
          content_markdown: `# 3.1. Formulasi Matematika Dekomposisi Rank Rendah LoRA

## 1. Hipotesis Intrinsic Rank
Meskipun matriks bobot model bahasa $\\mathbf{W}_0 \\in \\mathbb{R}^{d \\times k}$ memiliki dimensi penuh, pembaruan gradien untuk adaptasi tugas spesifik $\\Delta \\mathbf{W}$ beroperasi pada dimensi intrinsik yang sangat rendah (*low intrinsic dimension*).

## 2. Formulasi LoRA (Hu et al., ICLR 2022)
Matriks bobot asli $\\mathbf{W}_0$ dibekukan (*frozen*). Pembaruan diparameterisasi melalui perkalian dua matriks rank rendah:

$$\\mathbf{W} = \\mathbf{W}_0 + \\Delta \\mathbf{W} = \\mathbf{W}_0 + \\frac{\\alpha}{r} \\mathbf{B} \\mathbf{A}$$

Di mana:
- $\\mathbf{A} \\in \\mathbb{R}^{r \\times k}$, diinisialisasi dari distribusi acak Gaussian $\\mathcal{N}(0, \\sigma^2)$.
- $\\mathbf{B} \\in \\mathbb{R}^{d \\times r}$, diinisialisasi dengan **nilai nol** tepat (sehingga pada awal pelatihan $\\Delta \\mathbf{W} = \\mathbf{0}$).
- $r \\ll \\min(d, k)$ adalah rank adaptasi (umumnya $r \\in \\{8, 16, 32\\}$).
- $\\alpha$ adalah konstanta penskalaan hyperparameter (umumnya $\\alpha = 2r$).

Forward pass untuk masukan $\\mathbf{x}$:
$$\\mathbf{h} = \\mathbf{W}_0 \\mathbf{x} + \\frac{\\alpha}{r} \\mathbf{B} \\mathbf{A} \\mathbf{x}$$

Mengurangi parameter yang perlu dioptimasi hingga $>99.9\\%$, serta menghilangkan latensi inferensi tambahan karena bobot $\\frac{\\alpha}{r}\\mathbf{BA}$ dapat digabungkan langsung ke $\\mathbf{W}_0$ sebelum penempatan produksi.
`,
        },
      ],
    },
    {
      id: "llm-bab-4",
      slug: "penyelarasan-manusia-rlhf-dan-dpo",
      title: "BAB 4: Penyelarasan Preferensi Manusia: SFT, RLHF & DPO",
      orderIndex: 4,
      description: "Mentransformasikan generator teks mentah menjadi asisten yang bermanfaat dan aman: Supervised Fine-Tuning (SFT), model preferensi Bradley-Terry, PPO, dan Direct Preference Optimization (DPO).",
      subchapters: [
        {
          id: "llm-bab-4-1",
          slug: "formulasi-dpo-vs-rlhf-bradley-terry",
          title: "4.1. Direct Preference Optimization (DPO): Penurunan Matematis Solusi Eksak",
          orderIndex: 1,
          description: "Membuktikan bahwa loss RLHF teroptimasi dapat diselesaikan secara analitis langsung dari probabilitas model tanpa melatih Reward Model terpisah.",
          content_markdown: `# 4.1. Direct Preference Optimization (DPO): Penurunan Matematis Solusi Eksak

## 1. Formulasi Klasik RLHF dengan PPO
Tujuan optimasi RLHF:
$$\\max_{\\pi_\\theta} \\mathbb{E}_{x \\sim \\mathcal{D}, y \\sim \\pi_\\theta(y \\mid x)} \\left[ r_\\phi(x, y) \\right] - \\beta \\mathbb{D}_{\\text{KL}}\\left( \\pi_\\theta(y \\mid x) \\;\\big\\|\\; \\pi_{\\text{ref}}(y \\mid x) \\right)$$
Kelemahan: Memerlukan pelatihan 4 model sekaligus di VRAM (Policy, Reference, Reward Model, Value Critic) dan sangat rentan terhadap divergensi pelatihan RL.

## 2. Terobosan DPO (Rafailov et al., NeurIPS 2023)
Menggunakan fakta aljabar bahwa reward implisit dapat diekspresikan langsung melalui rasio log-probabilitas:
$$r(x, y) = \\beta \\log \\frac{\\pi_\\theta(y \\mid x)}{\\pi_{\\text{ref}}(y \\mid x)} + \\beta \\log Z(x)$$

Ketika disubstitusikan ke dalam model preferensi Bradley-Terry $P(y_w \\succ y_l \\mid x) = \\sigma(r(x, y_w) - r(x, y_l))$, konstanta partisi $Z(x)$ saling membatalkan secara analitik!

Fungsi kerugian DPO menjadi sangat elegan:

$$\\mathcal{L}_{\\text{DPO}}(\\pi_\\theta; \\pi_{\\text{ref}}) = -\\mathbb{E}_{(x, y_w, y_l) \\sim \\mathcal{D}} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\log \\frac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)} \\right) \\right]$$

Di mana $y_w$ adalah respons yang disukai (*winning completion*) dan $y_l$ adalah respons yang tidak disukai (*losing completion*). Menghilangkan kebutuhan Reward Model dan loop PPO secara menyeluruh.
`,
        },
      ],
    },
    {
      id: "llm-bab-5",
      slug: "inferensi-cepat-kv-cache-dan-gqa",
      title: "BAB 5: Akselerasi Inferensi: KV Cache, MQA & Grouped-Query Attention (GQA)",
      orderIndex: 5,
      description: "Memecahkan bottleneck memori saat inferensi: kalkulasi footprint memori KV Cache, Multi-Query Attention (MQA), Grouped-Query Attention (GQA LLaMA-2/3), dan Speculative Decoding.",
      subchapters: [
        {
          id: "llm-bab-5-1",
          slug: "kalkulasi-kv-cache-dan-arsitektur-gqa",
          title: "5.1. Kalkulasi Memori KV Cache & Grouped-Query Attention (GQA)",
          orderIndex: 1,
          description: "Mengapa inferensi LLM dibatasi oleh bandwidth memori (Memory Bandwidth Bound) dan penghematan memori melalui pengelompokan key/value heads.",
          content_markdown: `# 5.1. Kalkulasi Memori KV Cache & Grouped-Query Attention (GQA)

## 1. Beban Memori KV Cache
Selama generasi autoregresif, vektor Key dan Value dari token-token sebelumnya disimpan di memori (*KV Cache*) untuk menghindari komputasi ulang kuadratik. Ukuran memori KV Cache per sekuens dalam satuan byte:

$$\\text{Mem}_{\\text{KV}} = 2 \\times 2 \\times n_{\\text{layers}} \\times n_{\\text{heads}} \\times d_{\\text{head}} \\times L_{\\text{seq}} \\times b_{\\text{precision}}$$
- Faktor 2 pertama: untuk menyimpan Key dan Value.
- Faktor 2 kedua: representasi FP16 (2 byte per elemen).
Untuk model 70B dengan konteks 8192 token, KV Cache standar memakan lebih dari 10 GB VRAM per pengguna!

## 2. Grouped-Query Attention (Ainslie et al., 2023)
- **Multi-Head Attention (MHA)**: Setiap Query head memiliki 1 Key head dan 1 Value head ($H_Q = H_{KV}$).
- **Multi-Query Attention (MQA)**: Seluruh Query heads berbagi tepat 1 Key head dan 1 Value head tunggal ($H_{KV} = 1$). Sangat hemat memori namun menurunkan kapasitas representasi.
- **Grouped-Query Attention (GQA)**: Titik kompromi ideal: $H_Q$ query heads dikelompokkan ke dalam $G$ grup, di mana setiap grup berbagi 1 pasang KV head:
  $$H_Q = G \\times H_{KV}$$
Digunakan pada LLaMA-2 70B dan LLaMA-3 untuk memangkas memori KV Cache hingga 8x dengan mempertahankan performa MHA penuh.
`,
        },
      ],
    },
    {
      id: "llm-bab-6",
      slug: "evaluasi-benchmark-dan-safety-guardrails",
      title: "BAB 6: Evaluasi Kinerja, Standar Benchmark & Guardrails",
      orderIndex: 6,
      description: "Evaluasi kapabilitas model fondasi: benchmark akademik standar (MMLU, GSM8K, HumanEval, ARC), degradasi halusinasi, teknik Red-Teaming, dan implementasi Safety Guardrails.",
      subchapters: [
        {
          id: "llm-bab-6-1",
          slug: "metodologi-benchmark-dan-red-teaming",
          title: "6.1. Standar Metrik Benchmark (MMLU, GSM8K) & Pertahanan Adversarial",
          orderIndex: 1,
          description: "Pengukuran penalaran matematika multi-langkah, eksekusi kode, dan mitigasi serangan jailbreaking melalui filter pagar pembatas.",
          content_markdown: `# 6.1. Standar Metrik Benchmark (MMLU, GSM8K) & Pertahanan Adversarial

## 1. Benchmark Standar Industri
1. **MMLU (Massive Multitask Language Understanding)**: Menguji pengetahuan faktual melintasi 57 bidang ilmu (kedokteran, hukum, matematika, filsafat).
2. **GSM8K (Grade School Math 8K)**: Menguji kemampuan penalaran kuantitatif multi-langkah (*chain-of-thought*).
3. **HumanEval**: Menguji sintesis kode pemrograman Python berbasis fungsionalitas unit test pass@1.

## 2. Pagar Pembatas Keamanan (Safety Guardrails)
- **Input Sanitization**: Memeriksa injeksi prompt (*prompt injection*) dan karakter kontrol tersembunyi.
- **Output Moderation**: Memindai token terlarang (konten berbahaya, PII - data pribadi) menggunakan model pengawas terdedikasi (*Llama-Guard*).
`,
        },
      ],
    },
    {
      id: "llm-bab-7",
      slug: "proyek-lora-dan-kv-cache-engine",
      title: "BAB 7: Proyek Terapan: Implementasi LoRA Linear & Engine KV Cache",
      orderIndex: 7,
      description: "Membangun komponen inti arsitektur LLM dari nol menggunakan PyTorch: lapisan LoRA Linear kustom, forward pass berbobot gabungan, dan inferensi autoregresif dengan pemeliharaan KV Cache.",
      subchapters: [
        {
          id: "llm-bab-7-1",
          slug: "proyek-akhir-lora-dan-kv-cache-python",
          title: "7.1. Proyek Akhir: LoRA Layer Kustom & Simulator KV Cache Autoregresif",
          orderIndex: 1,
          description: "Kode PyTorch modular: pembekuan bobot dasar, inisialisasi rank rendah, dan simulasi penambahan token autoregresif dengan penyimpanan cache.",
          content_markdown: `# 7.1. Proyek Akhir: LoRA Layer Kustom & Simulator KV Cache Autoregresif

## 1. Kode Implementasi PyTorch Terverifikasi
\`\`\`python
import torch
import torch.nn as nn
import math

class LoRALinear(nn.Module):
    """Lapisan Linear dengan Adaptasi Rank Rendah (LoRA) sesuai Hu et al. (2021)."""
    def __init__(self, in_features: int, out_features: int, r: int = 4, lora_alpha: float = 8.0):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        self.r = r
        self.scaling = lora_alpha / r

        # Bobot Asli Model Dasar (Dibekukan)
        self.weight = nn.Parameter(torch.randn(out_features, in_features) * 0.02)
        self.weight.requires_grad = False

        # Matriks Adaptasi LoRA
        self.lora_A = nn.Parameter(torch.zeros(r, in_features))
        self.lora_B = nn.Parameter(torch.zeros(out_features, r))

        # Inisialisasi: A ~ N(0, 1/r), B = 0 (menjamin delta W = 0 pada awal)
        nn.init.kaiming_uniform_(self.lora_A, a=math.sqrt(5))
        nn.init.zeros_(self.lora_B)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Base forward
        base_out = nn.functional.linear(x, self.weight)
        # LoRA forward: (x @ A.T) @ B.T * scaling
        lora_out = (x @ self.lora_A.T) @ self.lora_B.T * self.scaling
        return base_out + lora_out

# 2. Simulator KV Cache Generator Autoregresif Sederhana
class SimpleKVCacheAttention(nn.Module):
    def __init__(self, d_model: int = 64):
        super().__init__()
        self.d_model = d_model
        self.q_proj = nn.Linear(d_model, d_model, bias=False)
        self.k_proj = nn.Linear(d_model, d_model, bias=False)
        self.v_proj = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x_new: torch.Tensor, past_k: torch.Tensor = None, past_v: torch.Tensor = None):
        """
        x_new: [batch_size, 1, d_model] - Hanya token terbaru
        past_k, past_v: [batch_size, seq_len_past, d_model]
        """
        q = self.q_proj(x_new)
        k_new = self.k_proj(x_new)
        v_new = self.v_proj(x_new)

        if past_k is not None and past_v is not None:
            # Concatenate dengan riwayat cache sebelumnya
            k = torch.cat([past_k, k_new], dim=1)
            v = torch.cat([past_v, v_new], dim=1)
        else:
            k = k_new
            v = v_new

        # Perhatian Scaled Dot-Product pada riwayat token
        scores = (q @ k.transpose(-2, -1)) / math.sqrt(self.d_model)
        attn_weights = nn.functional.softmax(scores, dim=-1)
        out = attn_weights @ v

        return out, k, v

# 3. Demonstrasi Eksekusi
print("=== VERIFIKASI LORA & KV CACHE ===")
lora_layer = LoRALinear(in_features=128, out_features=128, r=4)
x_dummy = torch.randn(2, 128)
y_lora = lora_layer(x_dummy)
print(f"Output LoRA Tensor: {y_lora.shape}")
assert y_lora.shape == (2, 128)

attn = SimpleKVCacheAttention(d_model=64)
k_cache, v_cache = None, None

# Simulasi generasi 3 token autoregresif
for step in range(3):
    token_embed = torch.randn(1, 1, 64) # 1 token baru
    out, k_cache, v_cache = attn(token_embed, k_cache, v_cache)
    print(f"Langkah {step+1}: Token diproses, Panjang KV Cache = {k_cache.shape[1]}")

assert k_cache.shape[1] == 3, "KV Cache harus bertambah 1 token setiap langkah."
print("=== VERIFIKASI ARSITEKTUR LLM SUKSES ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Ketepatan Inisialisasi LoRA (30%)**: Verifikasi bahwa matriks B bernilai nol saat awal dan parameter dasar dibekukan.
- **Mekanisme Akumulasi KV Cache (35%)**: Penanganan dimensi batch dan pembaruan sekuensial tanpa alokasi ulang berlebih.
- **Efisiensi Memori (20%)**: Pemahaman perbedaan kompleksitas komputasi dengan dan tanpa cache.
- **Struktur Kode & Dokumentasi (15%)**: Penulisan modul PyTorch bersih yang siap pakai.
`,
        },
      ],
    },
  ],
};
