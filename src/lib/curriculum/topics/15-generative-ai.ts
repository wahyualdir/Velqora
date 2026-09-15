import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: GENERATIVE AI (TOPIK 15) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Kingma, D. P., & Welling, M. (2013). Auto-Encoding Variational Bayes (VAE). ICLR 2014.
 * - Goodfellow, I., et al. (2014). Generative Adversarial Nets (GAN). NeurIPS 2014.
 * - Arjovsky, M., Chintala, S., & Bottou, L. (2017). Wasserstein Generative Adversarial Networks. ICML 2017.
 * - Ho, J., Jain, A., & Abbeel, P. (2020). Denoising Diffusion Probabilistic Models (DDPM). NeurIPS 2020.
 * - Rombach, R., et al. (2022). High-Resolution Image Synthesis with Latent Diffusion Models. CVPR 2022.
 * - Heusel, M., et al. (2017). GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium (FID). NeurIPS.
 */
export const generativeAiCurriculum: AcademicCurriculum = {
  id: "generative-ai",
  slug: "generative-ai",
  title: "Generative AI",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Teori matematika dan arsitektur model generatif mendalam: inferensi variasi (Variational Autoencoders & batas bawah ELBO), teori permainan minimax (GAN, WGAN-GP), proses stokastik difusi (DDPM & DDIM), model difusi ruang laten (Stable Diffusion & Classifier-Free Guidance), model aliran konsistensi (Flow Matching), serta evaluasi Fréchet Inception Distance (FID).",
  estimatedHours: 58,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Auto-Encoding Variational Bayes",
      authors: ["Diederik P. Kingma", "Max Welling"],
      type: "paper",
      url: "https://arxiv.org/abs/1312.6114",
      doi: "10.48550/arXiv.1312.6114",
      relevance: "Perumusan Evidence Lower Bound (ELBO) dan trik reparameterisasi diferensiabel.",
      year: 2014,
      publisherOrVenue: "ICLR 2014",
    },
    {
      title: "Generative Adversarial Nets",
      authors: ["Ian Goodfellow", "Jean Pouget-Abadie", "Mehdi Mirza", "Bing Xu", "David Warde-Farley", "Sherjil Ozair", "Aaron Courville", "Yoshua Bengio"],
      type: "paper",
      url: "https://arxiv.org/abs/1406.2661",
      doi: "10.48550/arXiv.1406.2661",
      relevance: "Formulasi minimax zero-sum game dan divergensi Jensen-Shannon.",
      year: 2014,
      publisherOrVenue: "NeurIPS 2014",
    },
    {
      title: "Denoising Diffusion Probabilistic Models",
      authors: ["Jonathan Ho", "Ajay Jain", "Pieter Abbeel"],
      type: "paper",
      url: "https://arxiv.org/abs/2006.11239",
      doi: "10.48550/arXiv.2006.11239",
      relevance: "Fondasi matematis proses difusi maju Markovian dan pembalikan derau bertahap.",
      year: 2020,
      publisherOrVenue: "NeurIPS 2020",
    },
    {
      title: "High-Resolution Image Synthesis with Latent Diffusion Models",
      authors: ["Robin Rombach", "Andreas Blattmann", "Dominik Lorenz", "Patrick Esser", "Björn Ommer"],
      type: "paper",
      url: "https://arxiv.org/abs/2112.10752",
      doi: "10.48550/arXiv.2112.10752",
      relevance: "Arsitektur Stable Diffusion: kompresi ruang laten dengan VAE dan Cross-Attention conditioning.",
      year: 2022,
      publisherOrVenue: "IEEE CVPR 2022",
    },
  ],
  chapters: [
    {
      id: "gen-bab-1",
      slug: "variational-autoencoders-dan-elbo",
      title: "BAB 1: Variational Autoencoders (VAE) & Teori Batas Bawah ELBO",
      orderIndex: 1,
      description: "Inferensi variasi aproksimasi posterior $q_\\phi(z|x)$, penurunan matematis Evidence Lower Bound (ELBO), divergensi Kullback-Leibler, dan Reparameterization Trick.",
      subchapters: [
        {
          id: "gen-bab-1-1",
          slug: "derivasi-matematis-elbo-dan-reparameterisasi",
          title: "1.1. Penurunan Analitik ELBO & Reparameterization Trick",
          orderIndex: 1,
          description: "Menghitung gradien stochastic backpropagation melalui variabel acak laten Gaussian menggunakan deterministik scaling dan pergeseran.",
          content_markdown: `# 1.1. Penurunan Analitik ELBO & Reparameterization Trick

## 1. Masalah Ketidakterjangkauan Marginal Likelihood
Tujuan kita adalah memaksimalkan log-likelihood data $\\log p_\\theta(\\mathbf{x}) = \\log \\int p_\\theta(\\mathbf{x}, \\mathbf{z}) \\, d\\mathbf{z}$.
Integral melintasi ruang variabel laten berdimensi tinggi $\\mathbf{z}$ secara komputasi tidak terjangkau (*intractable*).

## 2. Derivasi Evidence Lower Bound (ELBO)
Memperkenalkan distribusi aproksimasi posterior $q_\\phi(\\mathbf{z} \\mid \\mathbf{x})$:

$$\\log p_\\theta(\\mathbf{x}) = \\mathbb{E}_{q_\\phi(\\mathbf{z} \\mid \\mathbf{x})}\\left[ \\log \\frac{p_\\theta(\\mathbf{x}, \\mathbf{z})}{q_\\phi(\\mathbf{z} \\mid \\mathbf{x})} \\right] + D_{\\text{KL}}\\Big( q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) \\;\\parallel\\; p_\\theta(\\mathbf{z} \\mid \\mathbf{x}) \\Big)$$

Karena divergensi KL selalu non-negatif ($D_{\\text{KL}} \\ge 0$), suku pertama menjadi batas bawah:

$$\\text{ELBO}(\\theta, \\phi; \\mathbf{x}) = \\underbrace{\\mathbb{E}_{q_\\phi(\\mathbf{z} \\mid \\mathbf{x})}\\left[ \\log p_\\theta(\\mathbf{x} \\mid \\mathbf{z}) \\right]}_{\\text{Reconstruction Term}} - \\underbrace{D_{\\text{KL}}\\Big( q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) \\;\\parallel\\; p(\\mathbf{z}) \\Big)}_{\\text{Regularization Term}}$$

Untuk prior Gaussian standar $p(\\mathbf{z}) = \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$ dan encoder Gaussian $q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) = \\mathcal{N}(\\boldsymbol{\\mu}, \\text{diag}(\\boldsymbol{\\sigma}^2))$, divergensi KL memiliki solusi analitik tertutup:
$$D_{\\text{KL}} = -\\frac{1}{2} \\sum_{j=1}^J \\left( 1 + \\log(\\sigma_j^2) - \\mu_j^2 - \\sigma_j^2 \\right)$$

## 3. Reparameterization Trick (Kingma & Welling, 2013)
Operasi pencuplikan acak $\\mathbf{z} \\sim \\mathcal{N}(\\boldsymbol{\\mu}, \\boldsymbol{\\sigma}^2)$ tidak dapat diturunkan gradiennya terhadap parameter encoder $(\\boldsymbol{\\mu}, \\boldsymbol{\\sigma})$.
Solusi: memisahkan stokastisitas ke variabel derau independen $\\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$:

$$\\mathbf{z} = \\boldsymbol{\\mu} + \\boldsymbol{\\sigma} \\odot \\boldsymbol{\\epsilon}$$

Gradien $\\nabla_\\phi$ kini dapat dialirkan balik secara deterministik (*differentiable sampling*).
`,
        },
      ],
    },
    {
      id: "gen-bab-2",
      slug: "generative-adversarial-networks-dan-wgan",
      title: "BAB 2: Generative Adversarial Networks (GAN) & WGAN-GP",
      orderIndex: 2,
      description: "Permainan dua pemain minimax Goodfellow et al., masalah vanishing gradient pada saturasi diskriminator, Wasserstein GAN (Earth Mover's Distance), dan Gradient Penalty (WGAN-GP).",
      subchapters: [
        {
          id: "gen-bab-2-1",
          slug: "minimax-game-dan-wasserstein-distance",
          title: "2.1. Teori Permainan Minimax & Dualitas Wasserstein WGAN-GP",
          orderIndex: 1,
          description: "Mengapa Divergensi Jensen-Shannon gagal saat support distribusi tidak beririsan, dan pembatasan 1-Lipschitz menggunakan penalti gradien.",
          content_markdown: `# 2.1. Teori Permainan Minimax & Dualitas Wasserstein WGAN-GP

## 1. Formulasi Minimax Asli (Goodfellow et al., 2014)
$$\\min_G \\max_D \\quad V(D, G) = \\mathbb{E}_{\\mathbf{x} \\sim p_{\\text{data}}}[\\log D(\\mathbf{x})] + \\mathbb{E}_{\\mathbf{z} \\sim p_z}[\\log(1 - D(G(\\mathbf{z})))]$$
Ketika diskriminator optimal $D^*(\\mathbf{x}) = \\frac{p_{\\text{data}}(\\mathbf{x})}{p_{\\text{data}}(\\mathbf{x}) + p_g(\\mathbf{x})}$, fungsi objektif setara dengan meminimalkan Divergensi Jensen-Shannon (JSD).
- *Kelemahan Fatal*: Jika manifold data nyata dan data hasil generasi berada di subruang berdimensi rendah tanpa irisan sempurna, $JSD = \\log 2$ konstan, menghasilkan gradien nol yang memicu kegagalan pelatihan (*mode collapse*).

## 2. Wasserstein GAN (Arjovsky et al., ICML 2017)
Mengganti JSD dengan **Earth Mover's Distance** ($W_1$):
$$W(p_r, p_g) = \\inf_{\\gamma \\in \\Pi(p_r, p_g)} \\mathbb{E}_{(\\mathbf{x}, \\mathbf{y}) \\sim \\gamma}\\left[ \\|\\mathbf{x} - \\mathbf{y}\\| \\right]$$

Melalui dualitas Kantorovich-Rubinstein:
$$\\max_{\\|D\\|_L \\le 1} \\quad \\mathbb{E}_{\\mathbf{x} \\sim p_r}[D(\\mathbf{x})] - \\mathbb{E}_{\\mathbf{x} \\sim p_g}[D(\\mathbf{x})]$$

WGAN-GP (Gulrajani et al., 2017) memaksakan kendala 1-Lipschitz melalui penalti gradien langsung pada titik interpolasi $\\hat{\\mathbf{x}}$:
$$\\mathcal{L}_{\\text{critic}} = \\mathbb{E}[D(\\mathbf{x}_g)] - \\mathbb{E}[D(\\mathbf{x}_r)] + \\lambda \\mathbb{E}_{\\hat{\\mathbf{x}}}\\left[ \\left( \\|\\nabla_{\\hat{\\mathbf{x}}} D(\\hat{\\mathbf{x}})\\|_2 - 1 \\right)^2 \\right]$$
Menjamin pelatihan stabil tanpa keruntuhan modus (*mode collapse*).
`,
        },
      ],
    },
    {
      id: "gen-bab-3",
      slug: "proses-stokastik-difusi-ddpm",
      title: "BAB 3: Proses Stokastik Difusi: DDPM & Teori Skor",
      orderIndex: 3,
      description: "Formulasi Denoising Diffusion Probabilistic Models (Ho et al., NeurIPS 2020): proses difusi maju Markovian, closed-form direct sampling, proses denoising terbalik, dan arsitektur U-Net noise predictor.",
      subchapters: [
        {
          id: "gen-bab-3-1",
          slug: "formulasi-matematis-proses-maju-dan-mundur-ddpm",
          title: "3.1. Formulasi Matematika Proses Maju & Mundur DDPM",
          orderIndex: 1,
          description: "Penurunan analitis sampling langsung $x_t = \\sqrt{\\bar{\\alpha}_t}x_0 + \\sqrt{1 - \\bar{\\alpha}_t}\\epsilon$ dan loss function MSE penyederhanaan Ho et al.",
          content_markdown: `# 3.1. Formulasi Matematika Proses Maju & Mundur DDPM

## 1. Proses Maju (Forward Diffusion Process $q$)
Menambahkan derau Gaussian secara bertahap selama $T$ langkah waktu ($t=1, \\dots, T$) dengan jadwal varians $0 < \\beta_1 < \\dots < \\beta_T < 1$:

$$q(\\mathbf{x}_t \\mid \\mathbf{x}_{t-1}) = \\mathcal{N}\\left( \\mathbf{x}_t; \\; \\sqrt{1 - \\beta_t}\\mathbf{x}_{t-1}, \\; \\beta_t \\mathbf{I} \\right)$$

Mendefinisikan $\\alpha_t = 1 - \\beta_t$ dan $\\bar{\\alpha}_t = \\prod_{s=1}^t \\alpha_s$.
Melalui sifat aditivitas distribusi Gaussian, sampel $\\mathbf{x}_t$ pada langkah arbitrer $t$ dapat dicuplik **secara langsung dari $\\mathbf{x}_0$** tanpa menjalankan loop iteratif:

$$\\mathbf{x}_t = \\sqrt{\\bar{\\alpha}_t} \\mathbf{x}_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\boldsymbol{\\epsilon}, \\quad \\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$$

## 2. Proses Mundur (Reverse Denoising Process $p_\\theta$)
$$p_\\theta(\\mathbf{x}_{t-1} \\mid \\mathbf{x}_t) = \\mathcal{N}\\left( \\mathbf{x}_{t-1}; \\; \\boldsymbol{\\mu}_\\theta(\\mathbf{x}_t, t), \\; \\sigma_t^2 \\mathbf{I} \\right)$$

Ho et al. mereparameterisasi rata-rata $\\boldsymbol{\\mu}_\\theta$ untuk memprediksi derau Gaussian $\\boldsymbol{\\epsilon}$ yang ditambahkan:
$$\\boldsymbol{\\mu}_\\theta(\\mathbf{x}_t, t) = \\frac{1}{\\sqrt{\\alpha_t}} \\left( \\mathbf{x}_t - \\frac{\\beta_t}{\\sqrt{1 - \\bar{\\alpha}_t}} \\boldsymbol{\\epsilon}_\\theta(\\mathbf{x}_t, t) \\right)$$

Fungsi objektif pelatihan disederhanakan menjadi regresi Mean Squared Error murni:
$$\\mathcal{L}_{\\text{simple}}(\\theta) = \\mathbb{E}_{t, \\mathbf{x}_0, \\boldsymbol{\\epsilon}}\\left[ \\left\\| \\boldsymbol{\\epsilon} - \\boldsymbol{\\epsilon}_\\theta\\left( \\sqrt{\\bar{\\alpha}_t}\\mathbf{x}_0 + \\sqrt{1 - \\bar{\\alpha}_t}\\boldsymbol{\\epsilon}, \\; t \\right) \\right\\|^2 \\right]$$
`,
        },
      ],
    },
    {
      id: "gen-bab-4",
      slug: "latent-diffusion-dan-stable-diffusion",
      title: "BAB 4: Model Difusi Ruang Laten (Stable Diffusion) & CFG",
      orderIndex: 4,
      description: "Membawa proses difusi ke ruang representasi laten terkompresi (Rombach et al., CVPR 2022): autoencoder perseptual, pengkondisian teks Cross-Attention, dan Classifier-Free Guidance (CFG).",
      subchapters: [
        {
          id: "gen-bab-4-1",
          slug: "latent-space-dan-classifier-free-guidance",
          title: "4.1. Kompresi Ruang Laten & Formulasi Classifier-Free Guidance (CFG)",
          orderIndex: 1,
          description: "Mengapa difusi di ruang piksel $512 \\times 512$ tidak efisien, dan bagaimana CFG mengontrol keselarasan prompt teks tanpa model classifier terpisah.",
          content_markdown: `# 4.1. Kompresi Ruang Laten & Formulasi Classifier-Free Guidance (CFG)

## 1. Arsitektur Latent Diffusion Models (LDM)
Menjalankan difusi pada piksel mentah $512 \\times 512 \\times 3$ menghabiskan daya komputasi masif pada detail frekuensi tinggi yang tidak terlihat mata. LDM membagi sistem menjadi dua tahap:
1. **Perceptual Compression**: Model VAE encoder memetakan citra $\\mathbf{x}$ ke ruang laten $\\mathbf{z} = \\mathcal{E}(\\mathbf{x})$ dengan faktor kompresi spasial $8\\times$ ($64 \\times 64 \\times 4$), mengeliminasi redundansi komputasi 64x lipat.
2. **Latent Denoising**: U-Net difusi hanya beroperasi pada ruang laten $\\mathbf{z}$.
3. **Synthesis**: VAE decoder merekonstruksi citra akhir $\\tilde{\\mathbf{x}} = \\mathcal{D}(\\mathbf{z})$.

## 2. Formulasi Classifier-Free Guidance (CFG) (Ho & Salimans, 2021)
Selama pelatihan, kondisi teks $c$ (misal embedding CLIP) di-drop secara acak (biasanya $10\\%$ peluang) digantikan dengan token kosong $\\emptyset$.
Saat inferensi, estimasi derau akhir diinterpolasi secara ekstrapolatif dengan faktor skala panduan $s > 1$:

$$\\tilde{\\boldsymbol{\\epsilon}}_\\theta(\\mathbf{z}_t, c) = \\boldsymbol{\\epsilon}_\\theta(\\mathbf{z}_t, \\emptyset) + s \\cdot \\Big( \\boldsymbol{\\epsilon}_\\theta(\\mathbf{z}_t, c) - \\boldsymbol{\\epsilon}_\\theta(\\mathbf{z}_t, \\emptyset) \\Big)$$

- $s = 1.0$: Sampling standar tanpa panduan.
- $s > 7.0$: Memaksa sampel bergerak menjauhi generasi tanpa arah menuju kepatuhan ketat terhadap prompt teks masukan.
`,
        },
      ],
    },
    {
      id: "gen-bab-5",
      slug: "flow-matching-dan-consistency-models",
      title: "BAB 5: Model Aliran Termodifikasi: Flow Matching & Consistency Models",
      orderIndex: 5,
      description: "Generasi cepat melintasi Ordinary Differential Equations (ODEs): Continuous Normalizing Flows, Flow Matching (Lipman et al., ICLR 2023) dengan lintasan Optimal Transport, dan Consistency Models.",
      subchapters: [
        {
          id: "gen-bab-5-1",
          slug: "flow-matching-dan-optimal-transport",
          title: "5.1. Formulasi Vektor Aliran Kontinu & Optimal Transport Flow Matching",
          orderIndex: 1,
          description: "Menghubungkan distribusi derau Gaussian ke data riil melalui medan kecepatan linier lurus $v_t(x) = x_1 - x_0$.",
          content_markdown: `# 5.1. Formulasi Vektor Aliran Kontinu & Optimal Transport Flow Matching

## 1. Keterbatasan Kurva Lintasan Difusi Standar
Proses pembalikan derau pada DDPM mengikuti trajektori kurva non-linier berkelok-kelok di ruang probabilitas, membutuhkan 50 hingga 1000 langkah numerik Euler/Heun untuk konvergen.

## 2. Flow Matching (Lipman et al., 2023)
Alih-alih memprediksi derau acak, model dilatih untuk memprediksi **medan vektor kecepatan waktu** $\\mathbf{v}_t(\\mathbf{x})$ yang mendorong partikel probabilitas dari derau $\\mathbf{x}_0 \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$ ke data riil $\\mathbf{x}_1 \\sim p_{\\text{data}}$:

$$\\frac{d\\mathbf{x}_t}{dt} = \\mathbf{v}_t(\\mathbf{x}_t)$$

Dengan interpolasi linier Optimal Transport (OT):
$$\\mathbf{x}_t = t \\mathbf{x}_1 + (1 - t) \\mathbf{x}_0$$
Kecepatan target analitis menjadi garis lurus konstan:
$$\\frac{d\\mathbf{x}_t}{dt} = \\mathbf{x}_1 - \\mathbf{x}_0$$

Fungsi kerugian Flow Matching sangat sederhana dan stabil:
$$\\mathcal{L}_{\\text{FM}}(\\theta) = \\mathbb{E}_{t, \\mathbf{x}_0, \\mathbf{x}_1}\\left[ \\left\\| \\mathbf{v}_\\theta(\\mathbf{x}_t, t) - (\\mathbf{x}_1 - \\mathbf{x}_0) \\right\\|^2 \\right]$$
Memungkinkan generasi berkualitas tinggi hanya dalam 4 sampai 8 langkah evaluasi solver ODE!
`,
        },
      ],
    },
    {
      id: "gen-bab-6",
      slug: "metrik-evaluasi-fid-dan-clip-score",
      title: "BAB 6: Evaluasi Kualitas Citra: Fréchet Inception Distance (FID)",
      orderIndex: 6,
      description: "Kuantifikasi keaslian dan keragaman distribusi generatif: penurunan analitik jarak Fréchet (Wasserstein-2) pada ruang fitur Inception-v3 (Heusel et al. 2017) dan CLIP Score.",
      subchapters: [
        {
          id: "gen-bab-6-1",
          slug: "derivasi-matematis-frechet-inception-distance",
          title: "6.1. Penurunan Analitis Fréchet Inception Distance (FID)",
          orderIndex: 1,
          description: "Menghitung jarak Wasserstein-2 antara dua distribusi Gaussian multivariat $\\mathcal{N}(\\boldsymbol{\\mu}_r, \\mathbf{\\Sigma}_r)$ dan $\\mathcal{N}(\\boldsymbol{\\mu}_g, \\mathbf{\\Sigma}_g)$.",
          content_markdown: `# 6.1. Penurunan Analitis Fréchet Inception Distance (FID)

## 1. Mengapa Evaluasi Generatif Sulit?
Kita tidak dapat menggunakan metrik rekonstruksi piksel langsung (seperti MSE atau PSNR) karena model generatif dirancang untuk menghasilkan sampel baru yang realistis, bukan menyalin persis citra latih.

## 2. Formulasi Matematika FID (Heusel et al., NeurIPS 2017)
Citra nyata ($r$) dan citra sintetis ($g$) diproyeksikan ke lapisan pool3 model Inception-v3 (vektor fitur berdimensi 2048). Fitur diasumsikan berdistribusi Gaussian multivariat $\\mathcal{N}(\\boldsymbol{\\mu}_r, \\mathbf{\\Sigma}_r)$ dan $\\mathcal{N}(\\boldsymbol{\\mu}_g, \\mathbf{\\Sigma}_g)$.

Jarak Fréchet (Wasserstein-2 metric) antara kedua distribusi dihitung sebagai:

$$\\text{FID} = \\|\\boldsymbol{\\mu}_r - \\boldsymbol{\\mu}_g\\|_2^2 + \\text{Tr}\\left( \\mathbf{\\Sigma}_r + \\mathbf{\\Sigma}_g - 2 \\left( \\mathbf{\\Sigma}_r \\mathbf{\\Sigma}_g \\right)^{1/2} \\right)$$

Di mana $\\text{Tr}(\\cdot)$ adalah trace (jumlah elemen diagonal) matriks, dan $\\left( \\mathbf{\\Sigma}_r \\mathbf{\\Sigma}_g \\right)^{1/2}$ adalah akar kuadrat matriks (*matrix square root*).
- Nilai FID yang **lebih rendah** mengindikasikan bahwa distribusi data sintetis semakin mirip dengan distribusi data nyata (kualitas fotorealistis dan keragaman tinggi).
`,
        },
      ],
    },
    {
      id: "gen-bab-7",
      slug: "proyek-simulator-ddpm-dan-fid-engine",
      title: "BAB 7: Proyek Terapan: Simulator Jadwal Difusi DDPM & Engine FID",
      orderIndex: 7,
      description: "Membangun sistem komputasi generatif dari nol: implementasi jadwal varians linier DDPM forward pass, closed-form noise injection, dan penghitungan analitis Fréchet Inception Distance.",
      subchapters: [
        {
          id: "gen-bab-7-1",
          slug: "proyek-akhir-ddpm-dan-fid-python",
          title: "7.1. Proyek Akhir: DDPM Forward Sampler & Calculator Jarak FID",
          orderIndex: 1,
          description: "Kode Python mandiri: jadwal alpha/beta difusi, injeksi derau analitik $x_t$, dan penghitungan matriks kovarians trace FID.",
          content_markdown: `# 7.1. Proyek Akhir: DDPM Forward Sampler & Calculator Jarak FID

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
import numpy as np
from scipy import linalg

class DDPMNoiseSchedule:
    """Manajer Jadwal Derau Difusi Maju (Ho et al., 2020)."""
    def __init__(self, timesteps: int = 1000, beta_start: float = 1e-4, beta_end: float = 0.02):
        self.timesteps = timesteps
        self.betas = np.linspace(beta_start, beta_end, timesteps, dtype=np.float64)
        self.alphas = 1.0 - self.betas
        self.alphas_cumprod = np.cumprod(self.alphas)
        self.sqrt_alphas_cumprod = np.sqrt(self.alphas_cumprod)
        self.sqrt_one_minus_alphas_cumprod = np.sqrt(1.0 - self.alphas_cumprod)

    def q_sample(self, x_0: np.ndarray, t: int, noise: np.ndarray = None) -> np.ndarray:
        """Injeksi derau Gaussian closed-form langsung ke langkah waktu t."""
        if noise is None:
            noise = np.random.normal(size=x_0.shape)
        
        sqrt_alpha_bar = self.sqrt_alphas_cumprod[t]
        sqrt_one_minus_alpha_bar = self.sqrt_one_minus_alphas_cumprod[t]
        
        return sqrt_alpha_bar * x_0 + sqrt_one_minus_alpha_bar * noise

def calculate_frechet_distance(mu1: np.ndarray, sigma1: np.ndarray, mu2: np.ndarray, sigma2: np.ndarray) -> float:
    """Menghitung jarak Fréchet (FID) antara dua distribusi Gaussian multivariat."""
    diff = mu1 - mu2
    # Perkalian kovarians
    covmean, _ = linalg.sqrtm(sigma1.dot(sigma2), disp=False)
    
    # Penanganan instabilitas numerik bilangan kompleks imajiner kecil
    if np.iscomplexobj(covmean):
        covmean = covmean.real

    tr_covmean = np.trace(covmean)
    fid = diff.dot(diff) + np.trace(sigma1) + np.trace(sigma2) - 2 * tr_covmean
    return float(fid)

# 1. Demonstrasi Eksekusi Simulator Difusi DDPM
schedule = DDPMNoiseSchedule(timesteps=1000)
x_clean = np.array([2.5, -1.8, 0.4, 3.1])

# Sample pada t=0, t=500 (tengah), dan t=999 (hampir murni noise)
sample_t0 = schedule.q_sample(x_clean, t=0)
sample_t500 = schedule.q_sample(x_clean, t=500)
sample_t999 = schedule.q_sample(x_clean, t=999)

print("=== VERIFIKASI JADWAL DIFUSI DDPM ===")
print(f"Sinyal Asli x_0      : {x_clean}")
print(f"Sample Difusi t=0    : {np.round(sample_t0, 4)} (Pertahankan struktur)")
print(f"Sample Difusi t=500  : {np.round(sample_t500, 4)} (Separuh derau)")
print(f"Sample Difusi t=999  : {np.round(sample_t999, 4)} (Derau Gaussian murni)")

# 2. Uji Metrik Fréchet Inception Distance (FID)
# Distribusi Asli Real
mu_real = np.array([0.5, 1.2])
sigma_real = np.array([[1.0, 0.2], [0.2, 1.5]])

# Distribusi Model Generator Bagus (Sangat dekat)
mu_gen_good = np.array([0.52, 1.18])
sigma_gen_good = np.array([[0.98, 0.21], [0.21, 1.48]])

# Distribusi Model Generator Buruk (Jauh menyimpang)
mu_gen_bad = np.array([2.5, -0.8])
sigma_gen_bad = np.array([[3.0, 0.1], [0.1, 2.5]])

fid_good = calculate_frechet_distance(mu_real, sigma_real, mu_gen_good, sigma_gen_good)
fid_bad = calculate_frechet_distance(mu_real, sigma_real, mu_gen_bad, sigma_gen_bad)

print("\\n=== VERIFIKASI METRIK EVALUASI FID ===")
print(f"FID Generator Bagus : {fid_good:.6f}")
print(f"FID Generator Buruk : {fid_bad:.6f}")
assert fid_good < fid_bad, "Generator yang lebih mirip dengan data nyata wajib memiliki skor FID lebih rendah!"
print("=== VERIFIKASI ENGINE GENERATIVE AI SUKSES ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Ketepatan Formulasi Closed-Form DDPM (35%)**: Implementasi kumulatif produk alpha tanpa kebocoran indeks waktu.
- **Penanganan Numerik Jarak FID (35%)**: Penanganan matriks akar kuadrat imajiner dan perkalian trace yang akurat.
- **Pemahaman Teori Probabilitas Difusi (15%)**: Analisis transisi dari data murni ke isotropic Gaussian noise.
- **Kualitas Kerapian Arsitektur Kode (15%)**: Kode Python modular dengan validasi assertion otomatis.
`,
        },
      ],
    },
  ],
};
