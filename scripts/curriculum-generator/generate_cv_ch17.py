# -*- coding: utf-8 -*-
"""
Generator untuk Bab 17: Model Generatif untuk Visi: GANs, VAE, & Diffusion Models (10 Subbab)
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
# Subbab 17.1: Taksonomi Model Generatif Visual
# ==============================================================================
code_17_1 = r'''import numpy as np

# Taksonomi Komparatif Model Generatif Visual: Trade-off 'Generative Trilemma'
# Tiga pilar ideal: 1. Kualitas Sampel Tinggi (High Quality), 2. Kecepatan Sampling Cepat (Fast Sampling), 3. Keragaman Mode Penuh (Mode Coverage)

models = {
    "GAN (Generative Adversarial Networks)": {
        "High_Quality": "Sangat Tinggi (Tajam)",
        "Fast_Sampling": "Sangat Cepat (1-step forward pass)",
        "Mode_Coverage": "Rendah-Sedang (Rentan Mode Collapse)",
        "Prinsip_Densitas": "Implisit (Dua pemain Minimax)"
    },
    "VAE (Variational Autoencoders)": {
        "High_Quality": "Sedang (Cenderung Buram/Oversmoothed)",
        "Fast_Sampling": "Sangat Cepat (1-step forward pass)",
        "Mode_Coverage": "Tinggi (Tahanan ELBO stabil)",
        "Prinsip_Densitas": "Aproksimasi Eksplisit (ELBO)"
    },
    "Diffusion Models (DDPM/LDM)": {
        "High_Quality": "Sangat Tinggi (State-of-the-art)",
        "Fast_Sampling": "Lambat (Multi-step Denoising, 20-1000 langkah)",
        "Mode_Coverage": "Sangat Tinggi (Menghindari Mode Collapse)",
        "Prinsip_Densitas": "Eksplisit Bertingkat (Score matching/Markov)"
    }
}

print("Analisis 'Generative Learning Trilemma' dalam Visi Komputer:")
print("-" * 75)
for name, attrs in models.items():
    print(f"Model: {name}")
    print(f"  * Prinsip Densitas: {attrs['Prinsip_Densitas']}")
    print(f"  * Kualitas Sampel:  {attrs['High_Quality']}")
    print(f"  * Waktu Inferensi:  {attrs['Fast_Sampling']}")
    print(f"  * Cakupan Distribusi: {attrs['Mode_Coverage']}")
    print("-" * 75)
'''

subchapters.append({
    "id": "cv-17-1-generative-models-taxonomy",
    "chapterId": "computer-vision-ch-15",
    "title": "Taksonomi Model Generatif Visual: Pemodelan Densitas Eksplisit vs Implisit dan Trilema Generatif",
    "description": "Peta lanskap model generatif modern: autoregressive, flow-based, VAE, GAN, dan diffusion; analisis komparatif teorema 'Generative Trilemma'.",
    "estimatedMinutes": 35,
    "order": 1,
    "content": {
        "theory": (
            "Model generatif dalam visi komputer berupaya menyelesaikan masalah fundamental: memodelkan distribusi probabilitas data dunia nyata yang sangat rumit $p_{data}(\\mathbf{x})$ (di mana $\\mathbf{x} \\in \\mathbb{R}^{H \\times W \\times C}$) dari himpunan sampel pelatihan berhingga, sedemikian rupa sehingga model mampu menarik sampel baru $\\mathbf{x}_{baru} \\sim p_\\theta(\\mathbf{x})$ yang tampak otentik dan bervariasi.\n\n"
            "Taksonomi model generatif terbagi secara fundamental berdasarkan cara penanganan fungsi densitas probabilitas $p_\\theta(\\mathbf{x})$:\n"
            "1. **Pemodelan Densitas Eksplisit Berdaya Hitung Langsung (*Tractable Explicit Density*)**:\n"
            "   - *Autoregressive Models* (PixelCNN, Image Transformer): Memfaktorkan distribusi gabungan menggunakan aturan rantai probabilitas $p(\\mathbf{x}) = \\prod_{i=1}^N p(x_i \\mid x_1, \\dots, x_{i-1})$. Inferensi bersifat sekuensial piksel demi piksel sehingga sangat lambat.\n"
            "   - *Normalizing Flows* (RealNVP, Glow): Mentransformasikan distribusi dasar Gaussian sederhana melalui serangkaian fungsi bijektif yang memiliki determinan matriks Jacobi yang mudah dihitung.\n"
            "2. **Pemodelan Densitas Eksplisit Berdaya Hitung Aproksimasi (*Approximate Explicit Density*)**:\n"
            "   - *Variational Autoencoders (VAE)*: Menggunakan inferensi variasional untuk memaksimalkan batas bawah bukti statistik (*Evidence Lower Bound / ELBO*).\n"
            "   - *Diffusion Models (DDPM / Score-based)*: Memodelkan gradien log densitas (score function) melalui proses pembalikan difusi Markov berulang.\n"
            "3. **Pemodelan Densitas Implisit (*Implicit Density*)**:\n"
            "   - *Generative Adversarial Networks (GAN)*: Tidak pernah mendefinisikan bentuk matematis dari fungsi densitas $p_\\theta(\\mathbf{x})$. Sebaliknya, model hanya mendefinisikan proses transformasi sampel $G(\\mathbf{z})$ yang diuji oleh jaringan diskriminator saingan $D(\\mathbf{x})$.\n\n"
            "Setiap keluarga model diikat oleh teorema kompromi yang dikenal sebagai **The Generative Learning Trilemma** (Xiao et al., 2022). Trilema ini menyatakan bahwa model generatif ideal harus memenuhi tiga kriteria simultan: (1) Kualitas visual fotorealistik tinggi, (2) Sampling cepat satu langkah (*one-step generation*), dan (3) Cakupan mode penuh (*full mode coverage* tanpa mode collapse). Secara historis, GAN unggul pada (1) dan (2) tetapi gagal pada (3); VAE unggul pada (2) dan (3) tetapi kualitas visualnya kabur; sedangkan Diffusion Models unggul pada (1) dan (3) namun menderita komputasi sampling yang lambat."
        ),
        "codeSnippet": code_17_1,
        "codeSnippetOutput": run_code_capture_output(code_17_1),
        "realWorldApplication": (
            "Memandu pemilihan arsitektur AI generatif di industri: aplikasi filter foto real-time kamera smartphone memprioritaskan GAN karena inferensi satu langkah (sub-10ms), sedangkan studio pembuatan film dan desain grafis profesional memprioritaskan Diffusion Models karena stabilitas mode dan kualitas visual fotorealistik."
        ),
        "commonPitfalls": [
            r"Memilih arsitektur Diffusion standar untuk aplikasi video real-time berlatensi rendah tanpa teknik akselerasi (distillation/DDIM).",
            r"Mengasumsikan model dengan loss VAE terendah otomatis menghasilkan gambar paling tajam (loss ELBO dapat optimal meskipun gambar buram akibat over-regularization KL).",
            r"Mengabaikan fenomena mode collapse pada GAN yang menghasilkan gambar indah namun dengan variasi subjek yang sangat terbatas."
        ],
        "caseStudy": (
            "Sebuah startup medis ingin mensintesis citra X-Ray dada untuk augmentasi diagnosis kanker paru-paru langka. Mengapa penggunaan GAN klasik sangat berisiko tinggi memicu mode collapse (kehilangan variasi tipe tumor langka), dan mengapa Diffusion Models jauh lebih direkomendasikan untuk integritas sebaran statistik medis?"
        ),
        "academicReferences": [
            r"Xiao, Z., Kreis, K., & Vahdat, A. (2022). Tackling the generative learning trilemma with denoising diffusion gans. In International Conference on Learning Representations (ICLR).",
            r"Kingma, D. P., & Welling, M. (2013). Auto-encoding variational bayes. arXiv preprint arXiv:1312.6114.",
            r"Goodfellow, I., Pouget-Abadie, J., Mirza, M., Xu, B., Warde-Farley, D., Ozair, S., ... & Bengio, Y. (2014). Generative adversarial nets. In Advances in Neural Information Processing Systems (pp. 2672-2680)."
        ]
    }
})

# ==============================================================================
# Subbab 17.2: Variational Autoencoders (VAE): ELBO & Reparameterization Trick
# ==============================================================================
code_17_2 = r'''import numpy as np

# Implementasi Reparameterization Trick dan Komponen Loss VAE (ELBO)
# z = mu + sigma * epsilon, di mana epsilon ~ N(0, I)
# Loss = Rekonstruksi (BCE / MSE) + KL_Divergence
# KL( q(z|x) || p(z) ) = -0.5 * sum( 1 + log(sigma^2) - mu^2 - sigma^2 )

def reparameterize(mu, log_var):
    """
    Mengalirkan gradien backpropagation melalui operasi stokastik
    mu: (B, D) rata-rata laten
    log_var: (B, D) logaritma varians laten ln(sigma^2)
    """
    std = np.exp(0.5 * log_var)
    eps = np.random.randn(*mu.shape) # Kebisingan Gaussian acak dari luar graf
    z = mu + eps * std
    return z

def vae_kl_divergence(mu, log_var):
    """
    Kullback-Leibler Divergence tertutup terhadap prior Gauss N(0, I)
    """
    kl = -0.5 * np.sum(1.0 + log_var - np.square(mu) - np.exp(log_var), axis=1)
    return np.mean(kl)

# Simulasi forward pass 2 sampel dengan laten berdimensi 4
np.random.seed(42)
mu_dummy = np.array([[0.5, -0.2, 0.1, 0.0], [1.2, -1.0, 0.8, -0.5]])
log_var_dummy = np.array([[0.1, -0.1, 0.0, -0.2], [-0.5, 0.2, -0.1, 0.3]])

z_sampled = reparameterize(mu_dummy, log_var_dummy)
kl_loss = vae_kl_divergence(mu_dummy, log_var_dummy)

print("Simulasi Operasi Variational Autoencoder:")
print(f"Rata-rata Laten (mu) Sampel 0:       {mu_dummy[0]}")
print(f"Sampel Laten Terekstraksi (z):       {np.round(z_sampled[0], 4)}")
print(f"Rata-rata KL Divergence Loss Batch:  {kl_loss:.4f}")
print("Reparameterization trick memisahkan ketidakpastian stokastik sehingga backpropagation dapat bekerja mulus.")
'''

subchapters.append({
    "id": "cv-17-2-vae-reparameterization-trick-elbo",
    "chapterId": "computer-vision-ch-15",
    "title": "Variational Autoencoders (VAE): Reparameterization Trick, ELBO, dan Disentangled Latent Space",
    "description": "Inferensi variasional terukur: formulasi Evidence Lower Bound (ELBO), trik reparameterisasi diferensiabel, dan regulasi ruang laten Gaussian.",
    "estimatedMinutes": 35,
    "order": 2,
    "content": {
        "theory": (
            "**Variational Autoencoders (VAE)** (Kingma & Welling, 2013; Rezende et al., 2014) memadukan teori probabilitas Bayesian dengan kapasitas representasi jaringan saraf tiruan mendalam. Masalah mendasar dalam pemodelan variabel laten adalah integral marginal *log-likelihood* data $\\log p_\\theta(\\mathbf{x}) = \\log \\int p_\\theta(\\mathbf{x} \\mid \\mathbf{z}) p(\\mathbf{z}) \\, d\\mathbf{z}$ tidak dapat dihitung secara langsung (*intractable*) karena dimensi ruang laten $\\mathbf{z}$ yang tinggi.\n\n"
            "VAE mendekati distribusi posterior sejati $p_\\theta(\\mathbf{z} \\mid \\mathbf{x})$ menggunakan keluarga distribusi aproksimasi $q_\\phi(\\mathbf{z} \\mid \\mathbf{x})$ yang diparameterisasi oleh encoder. Melalui pertidaksamaan Jensen, diperoleh **Evidence Lower Bound (ELBO)** yang dapat dimaksimalkan:\n"
            "$$\\log p_\\theta(\\mathbf{x}) \\ge \\mathbb{E}_{q_\\phi(\\mathbf{z} \\mid \\mathbf{x})}\\left[ \\log p_\\theta(\\mathbf{x} \\mid \\mathbf{z}) \\right] - D_{KL}\\left( q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) \\parallel p(\\mathbf{z}) \\right) = \\mathcal{L}_{ELBO}(\\theta, \\phi; \\mathbf{x})$$\n\n"
            "Fungsi objektif VAE terdiri dari dua gaya yang saling mengimbangi:\n"
            "1. **Reconstruction Loss**: Ekspektasi kemiripan data yang didekode terhadap citra asli, mendorong rekonstruksi visual berkualitas tinggi.\n"
            "2. **KL Divergence Regularizer**: Penalti jarak statistik antara aproksimasi posterior $q_\\phi(\\mathbf{z} \\mid \\mathbf{x})$ dan prior standar $p(\\mathbf{z}) = \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$. Komponen ini bertindak sebagai gaya sentripetal yang memadatkan ruang laten, mencegah celah kosong (*holes*) pada manifold sehingga setiap titik di ruang laten dapat didekode menjadi citra yang valid.\n\n"
            "Tantangan komputasi utama adalah operasi sampling stokastik $\\mathbf{z} \\sim q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) = \\mathcal{N}(\\mathbf{\\mu}_\\phi(\\mathbf{x}), \\mathbf{\\Sigma}_\\phi(\\mathbf{x}))$ tidak memiliki turunan analitik (memutus rantai backpropagation). Kingma & Welling memecahkan kendala ini melalui **Reparameterization Trick**:\n"
            "$$\\mathbf{z} = \\mathbf{\\mu}_\\phi(\\mathbf{x}) + \\mathbf{\\sigma}_\\phi(\\mathbf{x}) \\odot \\mathbf{\\epsilon}, \\quad \\text{di mana} \\quad \\mathbf{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$$\n"
            "Dengan mengisolasi keacakan stokastik ke dalam variabel pembantu $\\mathbf{\\epsilon}$ di luar graf komputasi, operasi transformasi menjadi deterministik dan sepenuhnya diferensiabel terhadap parameter jaringan $\\phi$."
        ),
        "codeSnippet": code_17_2,
        "codeSnippetOutput": run_code_capture_output(code_17_2),
        "realWorldApplication": (
            "Diterapkan sebagai kompresor ruang laten (Perceptual Autoencoder) pada arsitektur Stable Diffusion untuk memampatkan citra 512x512 piksel menjadi representasi kompak 64x64 laten 4-channel sebelum proses difusi."
        ),
        "commonPitfalls": [
            r"Fenomena Posterior Collapse: decoder terlalu kuat (misal PixelCNN autoregressive) sehingga mengabaikan vektor laten z sama sekali, menyebabkan KL divergence kolaps ke 0.",
            r"Gambar hasil rekonstruksi cenderung buram karena loss piksel L2/MSE mengasumsikan distribusi Gaussian mandiri per piksel alih-alih persepsi visual global.",
            r"Lupa memodelkan log-variance log(sigma^2) alih-alih standard deviation langsung, yang menyebabkan instabilitas numerik saat varians mendekati 0 atau negatif."
        ],
        "caseStudy": (
            "Sebuah model VAE menghasilkan citra sintesis wajah manusia yang sangat halus namun kehilangan ketajaman helai rambut dan pori-pori kulit. Jelaskan bagaimana pengenalan bobot penyeimbang beta pada beta-VAE atau penambahan Perceptual Loss (VGG feature matching) dapat memulihkan ketajaman tekstur frekuensi tinggi."
        ),
        "academicReferences": [
            r"Kingma, D. P., & Welling, M. (2013). Auto-encoding variational bayes. arXiv preprint arXiv:1312.6114.",
            r"Higgins, I., Matthey, L., Pal, A., Burgess, C., Glorot, X., Botvinick, M., ... & Lerchner, A. (2017). beta-VAE: Learning basic visual concepts with a constrained variational framework. In ICLR.",
            r"Rombach, R., Blattmann, A., Lorenz, D., Esser, P., & Ommer, B. (2022). High-resolution image synthesis with latent diffusion models. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 10684-10695)."
        ]
    }
})

# ==============================================================================
# Subbab 17.3: Generative Adversarial Networks (GAN) - Minimax & JS Divergence
# ==============================================================================
code_17_3 = r'''import numpy as np

# Implementasi Game Teori Minimax GAN (Goodfellow et al., NeurIPS 2014)
# min_G max_D V(D, G) = E_{x~p_data}[log D(x)] + E_{z~p_z}[log(1 - D(G(z)))]
# Solusi optimal global tercapai saat p_g = p_data, dengan nilai optimal D*(x) = 1/2 dan V(D*, G) = -log(4)

def gan_discriminator_loss(d_real_preds, d_fake_preds):
    """
    d_real_preds: prediksi D terhadap data nyata (idealnya -> 1)
    d_fake_preds: prediksi D terhadap data palsu G(z) (idealnya -> 0)
    """
    eps = 1e-8
    loss_real = -np.mean(np.log(d_real_preds + eps))
    loss_fake = -np.mean(np.log(1.0 - d_fake_preds + eps))
    total_d_loss = 0.5 * (loss_real + loss_fake)
    return total_d_loss

def gan_generator_non_saturating_loss(d_fake_preds):
    """
    Heuristik Non-Saturating Game (Goodfellow et al., 2014):
    Alih-alih min log(1 - D(G(z))) yang gradiennya jenuh (vanishing),
    Generator memaksimalkan log(D(G(z))) -> Loss_G = -E[log(D(G(z)))]
    """
    eps = 1e-8
    loss_g = -np.mean(np.log(d_fake_preds + eps))
    return loss_g

# Simulasi kondisi setimbang (Equilibrium state: D*(x) = 0.5 untuk seluruh sampel)
d_real_eq = np.array([0.5, 0.5, 0.5, 0.5])
d_fake_eq = np.array([0.5, 0.5, 0.5, 0.5])

loss_d_eq = gan_discriminator_loss(d_real_eq, d_fake_eq)
loss_g_eq = gan_generator_non_saturating_loss(d_fake_eq)

print(f"Loss Diskriminator pada Titik Ekuilibrium Teoretis: {loss_d_eq:.4f} (Identik dengan ln(2) = {np.log(2):.4f})")
print(f"Loss Generator pada Titik Ekuilibrium:              {loss_g_eq:.4f}")
print("Pada kesetimbangan Nash sempurna, diskriminator bingung sempurna (peluang 50% untuk setiap citra).")
'''

subchapters.append({
    "id": "cv-17-3-gan-foundations-minimax-js-divergence",
    "chapterId": "computer-vision-ch-15",
    "title": "Generative Adversarial Networks (GAN): Teori Minimax Dua Pemain, JS Divergence, dan Mode Collapse",
    "description": "Fondasi teori permainan GAN: fungsi nilai minimax V(D,G), ekuilibrium Nash, pembuktian relasi Jensen-Shannon divergence, dan patologi mode collapse.",
    "estimatedMinutes": 35,
    "order": 3,
    "content": {
        "theory": (
            "Diperkenalkan oleh Ian Goodfellow et al. (University of Montreal, NeurIPS 2014), **Generative Adversarial Networks (GAN)** merevolusi pemodelan generatif melalui formulasi **Teori Permainan Minimax Dua Pemain** (*Two-Player Minimax Game*). GAN mempertemukan dua jaringan saraf tiruan yang saling bersaing:\n"
            "1. **Generator ($G_{\\theta}$)**: Memetakan vektor kebisingan acak prior $\\mathbf{z} \\sim p_{\\mathbf{z}}$ menjadi citra sintetis $G(\\mathbf{z}) \\in \\mathbb{R}^{H \\times W \\times C}$. Tujuannya adalah menipu diskriminator semaksimal mungkin.\n"
            "2. **Diskriminator ($D_{\\phi}$)**: Memetakan sebuah citra $\\mathbf{x}$ menjadi skalar peluang $D(\\mathbf{x}) \\in [0, 1]$ bahwa citra tersebut berasal dari distribusi data nyata $p_{data}$ alih-alih data palsu dari generator.\n\n"
            "Interaksi persaingan ini dirumuskan dalam fungsi nilai objektif terpadu:\n"
            "$$\\min_G \\max_D V(D, G) = \\mathbb{E}_{\\mathbf{x} \\sim p_{data}(\\mathbf{x})}[\\log D(\\mathbf{x})] + \\mathbb{E}_{\\mathbf{z} \\sim p_{\\mathbf{z}}(\\mathbf{z})}[\\log(1 - D(G(\\mathbf{z})))]$$\n\n"
            "Goodfellow et al. membuktikan secara matematis bahwa untuk generator $G$ tertentu, diskriminator optimal adalah:\n"
            "$$D^*_G(\\mathbf{x}) = \\frac{p_{data}(\\mathbf{x})}{p_{data}(\\mathbf{x}) + p_g(\\mathbf{x})}$$\n"
            "Jika nilai optimal $D^*$ ini disubstitusikan kembali ke dalam fungsi nilai minimax, fungsi objektif generator berubah menjadi minimalisasi **Jensen-Shannon Divergence (JSD)** antara distribusi nyata dan distribusi generatif:\n"
            "$$V(D^*, G) = -\\log(4) + 2 \\cdot D_{JS}(p_{data} \\parallel p_g)$$\n"
            "Titik minimum global tercapai jika dan hanya jika $p_g = p_{data}$, di mana $D^*(\\mathbf{x}) = \\frac{1}{2}$ untuk seluruh ruang data dan $V(D^*, G) = -\\log(4) \\approx -1.386$.\n\n"
            "Meskipun elegan, pelatihan GAN klasik terkenal sangat tidak stabil dan rentan terhadap dua patologi besar:\n"
            "- **Vanishing Gradient**: Pada awal pelatihan saat $G$ masih buruk, $D$ dengan sangat mudah membedakan data nyata dan palsu ($D(G(\\mathbf{z})) \\approx 0$), menyebabkan gradien $\\nabla_{\\theta} \\log(1 - D(G(\\mathbf{z}))) \\to 0$ jenuh dan menghentikan pembelajaran. Solusinya adalah melatih generator dengan objektif non-saturating $\\max_G \\log D(G(\\mathbf{z}))$.\n"
            "- **Mode Collapse**: Generator hanya mempelajari cara memproduksi subset kecil sampel yang sangat sukses menipu diskriminator (misalnya hanya menghasilkan gambar digit '1' pada MNIST atau hanya satu jenis wajah), mengabaikan keragaman variasi data lainnya."
        ),
        "codeSnippet": code_17_3,
        "codeSnippetOutput": run_code_capture_output(code_17_3),
        "realWorldApplication": (
            "Menjadi tonggak awal sintesis citra modern fotorealistik, transfer gaya artistik neural, peningkatan resolusi super (SRGAN), dan manipulasi atribut foto potret wajah."
        ),
        "commonPitfalls": [
            r"Pelatihan generator menggunakan formulasi saturating min log(1 - D(G(z))), yang membunuh gradien pada tahap awal.",
            r"Diskriminator terlalu kuat melampaui generator sejak iterasi pertama, yang menyebabkan diskriminator mencapai akurasi 100% dan mematikan sinyal pembelajaran.",
            r"Menghentikan pelatihan saat loss generator tinggi, padahal loss GAN berosilasi secara alami dan tidak berkorelasi langsung dengan kualitas visual sampel."
        ],
        "caseStudy": (
            "Diberikan dua distribusi probabilitas pada garis 1D: data nyata p_data terkonsentrasi di x = 0, sedangkan generator p_g terkonsentrasi di x = theta. Tunjukkan mengapa Jensen-Shannon Divergence bernilai konstan log(2) untuk setiap nilai theta != 0, dan jelaskan mengapa ketiadaan informasi gradien ini memicu kegagalan pelatihan GAN standar saat support kedua distribusi tidak saling tumpang tindih."
        ),
        "academicReferences": [
            r"Goodfellow, I., Pouget-Abadie, J., Mirza, M., Xu, B., Warde-Farley, D., Ozair, S., ... & Bengio, Y. (2014). Generative adversarial nets. In Advances in Neural Information Processing Systems (pp. 2672-2680).",
            r"Arjovsky, M., & Bottou, L. (2017). Towards principled methods for training generative adversarial networks. In International Conference on Learning Representations (ICLR).",
            r"Salimans, T., Goodfellow, I., Zaremba, W., Cheung, V., Radford, A., & Chen, X. (2016). Improved techniques for training gans. Advances in Neural Information Processing Systems, 29."
        ]
    }
})

# ==============================================================================
# Subbab 17.4: DCGAN & Progressive Growing GAN (ProGAN)
# ==============================================================================
code_17_4 = r'''import numpy as np

# Simulasi Konsep Progressive Growing GAN (Karras et al., ICLR 2018 / ProGAN)
# Transisi resolusi halus dari 4x4 ke 8x8 piksel menggunakan parameter blending alpha in [0, 1]
# Output = (1 - alpha) * Upsample(LowRes) + alpha * HighResConv(Upsample(LowRes))

def progan_fade_in_transition(low_res_img, high_res_feat, alpha):
    """
    low_res_img: citra resolusi 4x4
    high_res_feat: fitur hasil konvolusi resolusi 8x8
    alpha: parameter transisi linier dari 0.0 ke 1.0 seiring bertambahnya iterasi latih
    """
    # 1. Upsample citra resolusi rendah ke 8x8 via nearest neighbor replication
    upsampled_low = np.repeat(np.repeat(low_res_img, 2, axis=0), 2, axis=1)
    
    # 2. Linear fade-in blending
    blended_output = (1.0 - alpha) * upsampled_low + alpha * high_res_feat
    return blended_output

# Simulasi citra 4x4
np.random.seed(42)
img_4x4 = np.array([
    [0.1, 0.2, 0.2, 0.1],
    [0.3, 0.8, 0.9, 0.4],
    [0.3, 0.9, 0.8, 0.3],
    [0.1, 0.2, 0.2, 0.1]
])

# Simulasi fitur 8x8 baru
feat_8x8 = np.random.uniform(0.1, 0.9, (8, 8))

# Amati output pada alpha = 0.0 (awal transisi), alpha = 0.5, dan alpha = 1.0 (transisi tuntas)
out_start = progan_fade_in_transition(img_4x4, feat_8x8, alpha=0.0)
out_mid   = progan_fade_in_transition(img_4x4, feat_8x8, alpha=0.5)
out_end   = progan_fade_in_transition(img_4x4, feat_8x8, alpha=1.0)

print("Simulasi Fade-in Bertahap Progressive Growing GAN:")
print(f"Alpha = 0.0 (100% Citra Kasar Ter-upsample) - Piksel [0,0]: {out_start[0,0]:.3f}")
print(f"Alpha = 0.5 (Campuran Seimbang 50:50)      - Piksel [0,0]: {out_mid[0,0]:.3f}")
print(f"Alpha = 1.0 (100% Layer Resolusi Baru)       - Piksel [0,0]: {out_end[0,0]:.3f}")
print("Progressive growing menstabilkan sintesis resolusi tinggi (1024x1024) dari skala mikro.")
'''

subchapters.append({
    "id": "cv-17-4-dcgan-progan-architectures",
    "chapterId": "computer-vision-ch-15",
    "title": "Deep Convolutional GAN (DCGAN) & Progressive Growing GAN (ProGAN): Skalabilitas Resolusi",
    "description": "Pedoman arsitektur konvolusional stabil DCGAN, normalisasi batch spasial, dan teknik progressive growing pematangan multi-resolusi 1024x1024 piksel.",
    "estimatedMinutes": 35,
    "order": 4,
    "content": {
        "theory": (
            "Pada masa-masa awal, pelatihan GAN dengan lapisan konvolusional penuh sangat tidak stabil dan sering kali gagal total. Terobosan arsitektur pertama dipelopori oleh **DCGAN** (*Deep Convolutional Generative Adversarial Networks*, Radford, Metz, & Chintala, ICLR 2016). Radford et al. merumuskan seperangkat panduan arsitektur empiris ketat yang memungkinkan konvergensi stabil:\n"
            "1. Menghilangkan lapisan pooling spasial secara total: menggantinya dengan *Strided Convolutions* pada diskriminator dan *Fractionally-Strided Convolutions* (transposed convolution) pada generator.\n"
            "2. Menggunakan *Batch Normalization* pada generator dan diskriminator untuk menstabilkan aliran gradien.\n"
            "3. Menghilangkan lapisan fully connected dense di lapisan tersembunyi.\n"
            "4. Menggunakan aktivasi *ReLU* pada seluruh lapisan generator (kecuali output yang menggunakan *Tanh* pada rentang $[-1, 1]$).\n"
            "5. Menggunakan aktivasi *LeakyReLU* (dengan kemiringan 0.2) pada seluruh lapisan diskriminator.\n\n"
            "Meskipun DCGAN stabil untuk resolusi kecil ($64 \\times 64$), melatih GAN langsung pada resolusi tinggi ($1024 \\times 1024$) hampir selalu gagal karena gradien menjadi sangat kacau dan memori GPU meledak. Tero Karras et al. (NVIDIA Research, ICLR 2018) memecahkan kebuntuan ini melalui **ProGAN** (*Progressive Growing of GANs for Improved Quality, Stability, and Variation*).\n\n"
            "Prinsip utama ProGAN adalah melatih model secara bertahap dari skala spasial terkasar ke skala paling halus:\n"
            "- Pelatihan dimulai pada resolusi $4 \\times 4$ piksel, di mana jaringan mempelajari struktur dasar dan tata letak global pemandangan.\n"
            "- Secara berkala, lapisan konvolusi baru ditambahkan ke generator dan diskriminator untuk melipatgandakan resolusi ($8 \\times 8 \\to 16 \\times 16 \\to \\dots \\to 1024 \\times 1024$).\n"
            "- Penambahan lapisan baru dilakukan secara halus melalui mekanisme **fade-in** menggunakan parameter skalar $\\alpha \\in [0, 1]$ yang dinaikkan secara bertahap dari 0 ke 1 selama fase transisi:\n"
            "$$\\mathbf{y} = (1 - \\alpha) \\cdot \\text{Upsample}(\\mathbf{x}_{low}) + \\alpha \\cdot \\text{Conv}_{high}(\\text{Upsample}(\\mathbf{x}_{low}))$$\n"
            "Mekanisme ini mencegah kejutan gradien mendadak pada lapisan yang baru ditambahkan, memungkinkan sintesis wajah manusia resolusi fotorealistik $1024 \\times 1024$ pertama dalam sejarah AI."
        ),
        "codeSnippet": code_17_4,
        "codeSnippetOutput": run_code_capture_output(code_17_4),
        "realWorldApplication": (
            "Diterapkan dalam generasi potret wajah resolusi tinggi untuk industri film, pembuatan avatar 3D game virtual, dan restorasi foto bersejarah resolusi rendah."
        ),
        "commonPitfalls": [
            r"Menambahkan layer resolusi baru secara instan tanpa fade-in alpha, yang merusak parameter layer sebelumnya yang sudah konvergen stabil.",
            r"Menggunakan transposed convolution biasa tanpa penanganan stride yang tepat, yang memicu artefak kisi-kisi catur (checkerboard artifacts).",
            r"Lupa menormalkan citra input pelatihan ke interval [-1, 1] yang sesuai dengan rentang fungsi aktivasi Tanh generator."
        ],
        "caseStudy": (
            "Sebuah tim insinyur melatih ProGAN untuk menghasilkan citra satelit resolusi 512x512. Mengapa waktu komputasi pelatihan ProGAN secara keseluruhan justru jauh lebih cepat dibandingkan melatih model langsung pada resolusi 512x512 sejak awal?"
        ),
        "academicReferences": [
            r"Radford, A., Metz, L., & Chintala, S. (2016). Unsupervised representation learning with deep convolutional generative adversarial networks. In ICLR.",
            r"Karras, T., Aila, T., Laine, S., & Lehtinen, J. (2018). Progressive growing of gans for improved quality, stability, and variation. In ICLR.",
            r"Odena, A., Dumoulin, V., & Olah, C. (2016). Deconvolution and checkerboard artifacts. Distill, 1(10), e3."
        ]
    }
})

# ==============================================================================
# Subbab 17.5: Wasserstein GAN (WGAN) & WGAN-GP: 1-Lipschitz & Gradient Penalty
# ==============================================================================
code_17_5 = r'''import numpy as np

# Implementasi Wasserstein GAN dengan Gradient Penalty (WGAN-GP, Gulrajani et al., NeurIPS 2017)
# Loss Kritikus: L = E[D(x_fake)] - E[D(x_real)] + lambda * E[( ||grad_{x_hat} D(x_hat)||_2 - 1 )^2]
# x_hat = epsilon * x_real + (1 - epsilon) * x_fake

def wgan_gp_loss(d_real, d_fake, grad_norm_on_interp, lambda_gp=10.0):
    """
    d_real: skor kritikus tanpa aktivasi sigmoid pada data nyata (W-distance)
    d_fake: skor kritikus pada data palsu
    grad_norm_on_interp: ||nabla_{x_hat} D(x_hat)||_2 norm gradien interpolasi
    lambda_gp: penalti gradien (standar = 10.0)
    """
    # 1. Wasserstein Distance Loss (maksimalkan E[D(real)] - E[D(fake)] -> minimalkan selisih sebaliknya)
    w_loss = np.mean(d_fake) - np.mean(d_real)
    
    # 2. Gradient Penalty: membatasi gradien kritikus agar bernilai mendekati 1 (1-Lipschitz continuity)
    gp = lambda_gp * np.mean(np.square(grad_norm_on_interp - 1.0))
    
    total_critic_loss = w_loss + gp
    return total_critic_loss, w_loss, gp

# Simulasi evaluasi batch
d_real_samples = np.array([2.5, 3.1, 2.8, 3.5]) # Skor data nyata
d_fake_samples = np.array([-1.2, -0.8, -1.5, -0.5]) # Skor data palsu
# Simulasi norm gradien hasil interpolasi: sampel 0,1,2 mendekati 1.0; sampel 3 melanggar (1.6)
grad_norms = np.array([1.02, 0.98, 1.05, 1.60])

total_loss, raw_w, gp_val = wgan_gp_loss(d_real_samples, d_fake_samples, grad_norms, lambda_gp=10.0)

print("Evaluasi Wasserstein GAN with Gradient Penalty (WGAN-GP):")
print(f"Estimasi Earth Mover's Distance E[D(real)] - E[D(fake)]: {-raw_w:.4f}")
print(f"Penalti Gradien Lipschitz (lambda * (||grad|| - 1)^2):    {gp_val:.4f}")
print(f"Total Loss Kritikus:                                       {total_loss:.4f}")
print("WGAN-GP menghapuskan weight clipping dan memberikan sinyal gradien yang bermakna di seluruh ruang.")
'''

subchapters.append({
    "id": "cv-17-5-wgan-gp-wasserstein-distance",
    "chapterId": "computer-vision-ch-15",
    "title": "Wasserstein GAN (WGAN) & WGAN-GP: Earth Mover's Distance, Batasan 1-Lipschitz, dan Gradient Penalty",
    "description": "Formulasi fundamental Wasserstein GAN: dualitas Kantorovich-Rubinstein, kegagalan weight clipping, dan regularisasi kontinuitas 1-Lipschitz melalui gradient penalty.",
    "estimatedMinutes": 35,
    "order": 5,
    "content": {
        "theory": (
            "Ketidakstabilan mendasar pada GAN klasik berakar pada sifat diskontinu dari Jensen-Shannon Divergence ketika dua distribusi probabilitas berada pada manifold berdimensi rendah tanpa irisan tumpang tindih (*disjoint supports*). Untuk memecahkan masalah ini secara fundamental, Martin Arjovsky et al. (NeurIPS 2017) memperkenalkan **Wasserstein GAN (WGAN)** yang menggantikan JSD dengan **Earth Mover's (Wasserstein-1) Distance**:\n"
            "$$W(p_{data}, p_g) = \\inf_{\\gamma \\in \\Pi(p_{data}, p_g)} \\mathbb{E}_{(\\mathbf{x}, \\mathbf{y}) \\sim \\gamma}\\left[ \\| \\mathbf{x} - \\mathbf{y} \\| \\right]$$\n"
            "Keunggulan luar biasa dari metrik Wasserstein adalah ia bersifat kontinu dan diferensiabel hampir di mana-mana, menyediakan aliran gradien yang mulus ke generator bahkan ketika distribusi data nyata dan sintetik sama sekali tidak beririsan.\n\n"
            "Karena bentuk infimum di atas tidak mungkin dihitung secara langsung, Arjovsky et al. memanfaatkan **Teorema Dualitas Kantorovich-Rubinstein** untuk mentransformasikan masalah ke dalam bentuk supremum atas seluruh keluarga fungsi $D$ yang memenuhi batasan **1-Lipschitz Continuous**:\n"
            "$$\\max_{w \\in \\mathcal{W}, \\| D_w \\|_L \\le 1} \\mathbb{E}_{\\mathbf{x} \\sim p_{data}}[D_w(\\mathbf{x})] - \\mathbb{E}_{\\mathbf{z} \\sim p_{\\mathbf{z}}}[D_w(G_\\theta(\\mathbf{z}))]$$\n"
            "Dalam WGAN, diskriminator tidak lagi mengeluarkan probabilitas biner (tanpa aktivasi Sigmoid) dan disebut sebagai **Kritikus (*Critic*)**, di mana nilai outputnya berbanding lurus dengan jarak Wasserstein.\n\n"
            "Untuk menegakkan batasan 1-Lipschitz, WGAN asli menggunakan *weight clipping* drastis ($w \\in [-c, c]$), yang ternyata memicu masalah baru: kapasitas model tereduksi ekstrem dan gradien meledak/menghilang di batas ekstrem. Solusi definitif ditemukan oleh Ishaan Gulrajani et al. (NeurIPS 2017) melalui **WGAN-GP** (*Gradient Penalty*), yang menambahkan fungsi penalti diferensiabel langsung pada norm gradien kritikus terhadap sampel interpolasi acak $\\hat{\\mathbf{x}} = \\epsilon \\mathbf{x} + (1 - \\epsilon) G(\\mathbf{z})$:\n"
            "$$\\mathcal{L}_{critic} = \\mathbb{E}[D(\\tilde{\\mathbf{x}})] - \\mathbb{E}[D(\\mathbf{x})] + \\lambda \\, \\mathbb{E}_{\\hat{\\mathbf{x}}}\\left[ \\left( \\| \\nabla_{\\hat{\\mathbf{x}}} D(\\hat{\\mathbf{x}}) \\|_2 - 1 \\right)^2 \\right]$$\n"
            "Penalti ini secara ketat memaksa magnitudo gradien bernilai 1 di sepanjang garis penghubung data nyata dan palsu, menghasilkan stabilitas pelatihan yang belum pernah tercapai sebelumnya."
        ),
        "codeSnippet": code_17_5,
        "codeSnippetOutput": run_code_capture_output(code_17_5),
        "realWorldApplication": (
            "Menjadi standar fungsi kerugian (loss function) wajib pada arsitektur generatif modern seperti StyleGAN dan ESRGAN untuk menjamin stabilitas pelatihan tanpa risiko mode collapse."
        ),
        "commonPitfalls": [
            r"Menggunakan Batch Normalization pada kritikus saat melatih WGAN-GP, yang merusak keabsahan penalti gradien per sampel (harus diganti dengan Layer Normalization atau Spectral Normalization).",
            r"Masih menyertakan aktivasi Sigmoid di layer output kritikus (kritikus WGAN harus berupa regresi linear unbounded).",
            r"Menyetel koefisien lambda_gp terlalu kecil sehingga kendala 1-Lipschitz runtuh dan pelatihan kembali tidak stabil."
        ],
        "caseStudy": (
            "Mengapa nilai loss dari kritikus WGAN (E[D(fake)] - E[D(real)]) dapat dijadikan metrik pemantau kualitas citra secara visual yang linier (semakin mendekati nol semakin realistis), berbeda dengan loss GAN klasik yang berosilasi liar?"
        ),
        "academicReferences": [
            r"Arjovsky, M., Chintala, S., & Bottou, L. (2017). Wasserstein generative adversarial networks. In International conference on machine learning (pp. 214-223).",
            r"Gulrajani, I., Ahmed, F., Arjovsky, M., Dumoulin, V., & Courville, A. C. (2017). Improved training of wasserstein gans. Advances in neural information processing systems, 30.",
            r"Miyato, T., Kataoka, T., Koyama, M., & Yoshida, Y. (2018). Spectral normalization for generative adversarial networks. In International Conference on Learning Representations (ICLR)."
        ]
    }
})

# ==============================================================================
# Subbab 17.6: StyleGAN: Mapping Network, AdaIN, dan Style Modulation
# ==============================================================================
code_17_6 = r'''import numpy as np

# Implementasi Adaptive Instance Normalization (AdaIN, Huang & Belongie 2017 / StyleGAN)
# AdaIN(x, y) = y_{s,i} * ( (x_i - mu(x_i)) / sigma(x_i) ) + y_{b,i}
# Memodulasi peta aktivasi spasial x menggunakan gaya skala y_s dan gaya bias y_b dari ruang laten W

def adain(content_feat, style_scale, style_bias):
    """
    content_feat: (C, H, W) peta fitur konten
    style_scale: (C,) parameter gaya skala afina (y_s)
    style_bias: (C,) parameter gaya bias afina (y_b)
    """
    eps = 1e-6
    # 1. Hitung mean dan varians spasial per kanal konten
    mean = np.mean(content_feat, axis=(1, 2), keepdims=True)
    var = np.var(content_feat, axis=(1, 2), keepdims=True)
    std = np.sqrt(var + eps)
    
    # 2. Normalisasi kanal ke distribusi unit (mean=0, std=1)
    norm_feat = (content_feat - mean) / std
    
    # 3. Modulasi dengan gaya eksternal dari ruang W
    s = style_scale[:, np.newaxis, np.newaxis]
    b = style_bias[:, np.newaxis, np.newaxis]
    modulated = s * norm_feat + b
    return modulated

# Simulasi kanal aktivasi 2x4x4 (2 kanal, resolusi 4x4)
np.random.seed(42)
feat = np.random.randn(2, 4, 4) * 2.0 + 3.0 # mean ~ 3, std ~ 2
y_scale = np.array([0.5, 1.5]) # Skala gaya kanal 0 ditekan, kanal 1 diperbesar
y_bias  = np.array([1.0, -1.0])

out_modulated = adain(feat, y_scale, y_bias)

print(f"Kanal 0 Sebelum AdaIN: Mean = {np.mean(feat[0]):.2f} | Std = {np.std(feat[0]):.2f}")
print(f"Kanal 0 Setelah AdaIN: Mean = {np.mean(out_modulated[0]):.2f} (Target y_b=1.0) | Std = {np.std(out_modulated[0]):.2f} (Target y_s=0.5)")
print(f"Kanal 1 Setelah AdaIN: Mean = {np.mean(out_modulated[1]):.2f} (Target y_b=-1.0) | Std = {np.std(out_modulated[1]):.2f} (Target y_s=1.5)")
print("AdaIN memungkinkan injeksi gaya laten ke setiap layer sintesis secara independen tanpa memodifikasi geometri dasar.")
'''

subchapters.append({
    "id": "cv-17-6-stylegan-adain-latent-w",
    "chapterId": "computer-vision-ch-15",
    "title": "StyleGAN (v1–v3): Mapping Network ($Z \\to W$), AdaIN, Weight Modulation, dan Disentanglement",
    "description": "Arsitektur generatif revolusioner NVIDIA: pemetaan ruang laten perantara W, mekanisme AdaIN dan modulasi bobot demodulasi, serta eliminasi aliasing translasi/rotasi.",
    "estimatedMinutes": 40,
    "order": 6,
    "content": {
        "theory": (
            "Arsitektur **StyleGAN** (Karras et al., NVIDIA Research, CVPR 2019, IEEE TPAMI 2020, NeurIPS 2021) menandai puncak tertinggi era Generative Adversarial Networks dalam sintesis citra resolusi tinggi. StyleGAN mendesain ulang arsitektur generator secara radikal dengan memisahkan konsep *struktur geometri dasar* dari *gaya visual atribut* (*style attributes*).\n\n"
            "Tiga inovasi arsitektur fundamental StyleGAN meliputi:\n"
            "1. **Mapping Network & Intermediate Latent Space $\\mathcal{W}$**: Pada GAN standar, input acak $\\mathbf{z} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$ ditarik dari distribusi hiperbola yang terikat ketat (*entangled*). Ruang data nyata memiliki kurvatura manifold non-linear yang jika dipaksakan memetakan langsung dari bola Gauss akan menghasilkan distorsi atribut. StyleGAN melewatkan $\\mathbf{z}$ melalui jaringan **Mapping Network** 8 lapis MLP untuk menghasilkan vektor laten perantara $\\mathbf{w} \\in \\mathcal{W}$. Ruang $\\mathcal{W}$ bersifat **disentangled** (terurai bebas), memungkinkan manipulasi independen terhadap atribut wajah (seperti usia, sudut pose, senyuman, atau warna rambut).\n"
            "2. **Adaptive Instance Normalization (AdaIN) & Constant Input**: Generator StyleGAN tidak lagi menerima vektor laten di awal lapisan. Sebagai gantinya, generator dimulai dari **tensor konstan terpelajari $4 \\times 4 \\times 512$**, dan vektor gaya $\\mathbf{w}$ diinjeksikan ke setiap blok konvolusi melalui modulasi **AdaIN**:\n"
            "$$\\text{AdaIN}(\\mathbf{x}_i, \\mathbf{y}) = \\mathbf{y}_{s, i} \\left( \\frac{\\mathbf{x}_i - \\mu(\\mathbf{x}_i)}{\\sigma(\\mathbf{x}_i)} \\right) + \\mathbf{y}_{b, i}$$\n"
            "di mana $\\mathbf{y} = (\\mathbf{y}_s, \\mathbf{y}_b)$ adalah parameter skala dan bias yang dihasilkan dari transformasi affine terspesialisasi dari $\\mathbf{w}$.\n"
            "3. **Injeksi Kebisingan Per-Piksel (*Per-Pixel Stochastic Noise*)**: Kebisingan Gauss acak skala kecil diinjeksikan langsung ke setiap layer untuk mengontrol detail stokastik mikroskopis (seperti penempatan helai rambut individu, bintik kulit, atau kerutan) tanpa mengubah identitas global wajah.\n\n"
            "Dalam **StyleGAN2** (2020), AdaIN digantikan oleh operasi **Weight Demodulation** yang memodulasi bobot konvolusi secara langsung untuk menghilangkan artefak tetesan air (*water droplet artifacts*). Dalam **StyleGAN3** (2021), seluruh operasi resampling dikonversi menjadi representasi kontinu berbasis pemrosesan sinyal sampling Shannon-Whittaker murni untuk mengeliminasi keterikatan koordinat piksel absolut (*texture sticking*)."
        ),
        "codeSnippet": code_17_6,
        "codeSnippetOutput": run_code_capture_output(code_17_6),
        "realWorldApplication": (
            "Diterapkan pada situs fenomenal 'This Person Does Not Exist', pengeditan potret AI Photoshop (Neural Filters), pembuatan karakter fotorealistik dalam produksi film efek visual, dan augmentasi data sintetis kecerdasan buatan."
        ),
        "commonPitfalls": [
            r"Mencoba melakukan interpolasi linier pada ruang laten Z alih-alih ruang W, yang menghasilkan transisi visual yang patah dan tidak realistis.",
            r"Menonaktifkan injeksi noise stokastik, yang menyebabkan rambut dan permukaan kulit tampak kaku seperti plastik (plastic mannequin look).",
            r"Trimming path length regularization loss pada StyleGAN2 yang menyebabkan inversi proyeksi citra nyata ke ruang laten menjadi tidak stabil."
        ],
        "caseStudy": (
            "Jelaskan fenomena 'Texture Sticking' yang terjadi pada StyleGAN2 ketika pose wajah berputar namun tekstur rambut atau janggut tetap terpaku pada koordinat piksel layar yang sama. Bagaimana StyleGAN3 merekayasa ulang seluruh operasi non-linear dan konvolusi dengan filter low-pass ideal untuk mencapai equivariance rotasi dan translasi murni?"
        ),
        "academicReferences": [
            r"Karras, T., Laine, S., & Aila, T. (2019). A style-based generator architecture for generative adversarial networks. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 4401-4410).",
            r"Karras, T., Laine, S., Aittala, M., Hellsten, J., Lehtinen, J., & Aila, T. (2020). Analyzing and improving the image quality of stylegan. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 8110-8119).",
            r"Karras, T., Aittala, M., Laine, S., Härkönen, E., Hellsten, J., Lehtinen, J., & Aila, T. (2021). Alias-free generative adversarial networks. Advances in Neural Information Processing Systems, 34, 852-863."
        ]
    }
})

# ==============================================================================
# Subbab 17.7: DDPM (Denoising Diffusion Probabilistic Models) - Spot-Check NeurIPS 2020
# ==============================================================================
code_17_7 = r'''import numpy as np

# Implementasi Forward Diffusion Process dan Simplified Training Objective DDPM
# Berdasarkan Ho et al., NeurIPS 2020 (Persamaan 4 dan Persamaan 14):
# q(x_t | x_0) = N(x_t; sqrt(alpha_bar_t) * x_0, (1 - alpha_bar_t) * I)
# L_simple(theta) = E_{t, x_0, eps} [ || eps - eps_theta(sqrt(alpha_bar_t)*x_0 + sqrt(1 - alpha_bar_t)*eps, t) ||^2 ]

def linear_beta_schedule(timesteps=1000, beta_start=0.0001, beta_end=0.02):
    """
    Jadwal varians linear beta_t sesuai spesifikasi Ho et al. 2020
    """
    betas = np.linspace(beta_start, beta_end, timesteps)
    alphas = 1.0 - betas
    alphas_bar = np.cumprod(alphas)
    return betas, alphas, alphas_bar

def q_sample_closed_form(x_0, t, alphas_bar, noise=None):
    """
    Sampling langsung x_t pada sembarang timestep t tanpa iterasi bertahap (Persamaan 4 Ho et al.)
    x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * epsilon
    """
    if noise is None:
        noise = np.random.randn(*x_0.shape)
        
    alpha_bar = alphas_bar[t]
    sqrt_alpha_bar = np.sqrt(alpha_bar)
    sqrt_one_minus_alpha_bar = np.sqrt(1.0 - alpha_bar)
    
    x_t = sqrt_alpha_bar * x_0 + sqrt_one_minus_alpha_bar * noise
    return x_t, noise

# Inisialisasi schedule 1000 langkah
betas, alphas, alphas_bar = linear_beta_schedule(timesteps=1000)

# Simulasi citra data nyata x_0 (sinyal murni bernilai konstan 1.0)
np.random.seed(42)
x_zero = np.ones((1, 4))
test_timesteps = [0, 100, 500, 999]

print("Verifikasi Numerik Closed-Form Forward Process DDPM (Ho et al., NeurIPS 2020):")
for step in test_timesteps:
    x_t, eps = q_sample_closed_form(x_zero, step, alphas_bar)
    snr = alphas_bar[step] / (1.0 - alphas_bar[step])
    print(f"Timestep t={step:3d} | alpha_bar={alphas_bar[step]:.4f} | SNR={snr:9.4f} | Sampel x_t: {np.round(x_t[0], 3)}")

print("\nPada t=999, alpha_bar -> 0 (SNR -> 0), sinyal asli x_0 hancur sempurna menjadi Gaussian Noise murni N(0, I)!")
'''

subchapters.append({
    "id": "cv-17-7-ddpm-diffusion-models-ho-2020",
    "chapterId": "computer-vision-ch-15",
    "title": "Denoising Diffusion Probabilistic Models (DDPM): Formulasi Forward-Reverse Process dan Simplified Loss",
    "description": "Analisis mendalam karya monumental Ho, Jain, & Abbeel (NeurIPS 2020): proses difusi forward Markov, sifat sampling bentuk tertutup q(x_t|x_0), prediksi derau epsilon_theta, dan objektif L_simple.",
    "estimatedMinutes": 40,
    "order": 7,
    "content": {
        "theory": (
            "Publikasi fenomenal oleh **Jonathan Ho, Ajay Jain, dan Pieter Abbeel** (*UC Berkeley*, NeurIPS 2020) berjudul *'Denoising Diffusion Probabilistic Models'* (DDPM) menandai dimulainya era dominasi Diffusion Models dalam AI generatif visual modern. Ho et al. memadukan teori fisika termodinamika non-ekuilibrium (Sohl-Dickstein et al., 2015) dengan estimasi skor denoising (*denoising score matching*), menghasilkan sintesis citra dengan kualitas dan cakupan mode yang melampaui GAN.\n\n"
            "DDPM memodelkan generasi citra melalui dua proses dinamis yang berlawanan arah:\n"
            "1. **Forward (Diffusion) Process ($q$)**: Rantai Markov berarah maju yang secara bertahap merusak sinyal data asli $\\mathbf{x}_0 \\sim q(\\mathbf{x}_0)$ dengan menambahkan derau Gaussian kecil menurut jadwal varians $\\beta_1, \\dots, \\beta_T$:\n"
            "$$q(\\mathbf{x}_{1:T} \\mid \\mathbf{x}_0) := \\prod_{t=1}^T q(\\mathbf{x}_t \\mid \\mathbf{x}_{t-1}), \\quad q(\\mathbf{x}_t \\mid \\mathbf{x}_{t-1}) := \\mathcal{N}(\\mathbf{x}_t; \\sqrt{1 - \\beta_t} \\mathbf{x}_{t-1}, \\beta_t \\mathbf{I})$$\n\n"
            "Sifat paling krusial dari proses maju ini adalah ia dapat dihitung secara langsung pada sembarang *timestep* $t$ secara **bentuk tertutup (*closed-form*)** tanpa perlu mengiterasi langkah-langkah sebelumnya. Dengan mendefinisikan $\\alpha_t := 1 - \\beta_t$ dan $\\bar{\\alpha}_t := \\prod_{s=1}^t \\alpha_s$:\n"
            "$$q(\\mathbf{x}_t \\mid \\mathbf{x}_0) = \\mathcal{N}\\left(\\mathbf{x}_t; \\sqrt{\\bar{\\alpha}_t} \\mathbf{x}_0, (1 - \\bar{\\alpha}_t) \\mathbf{I}\\right)$$\n"
            "yang setara dengan formulasi reparameterisasi:\n"
            "$$\\mathbf{x}_t = \\sqrt{\\bar{\\alpha}_t} \\mathbf{x}_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\mathbf{\\epsilon}, \\quad \\text{di mana} \\quad \\mathbf{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$$\n\n"
            "2. **Reverse (Denoising) Process ($p_\\theta$)**: Rantai Markov pembalikan yang dipelajari oleh jaringan saraf tiruan berarsitektur U-Net $p_\\theta(\\mathbf{x}_{t-1} \\mid \\mathbf{x}_t) := \\mathcal{N}(\\mathbf{x}_{t-1}; \\mathbf{\\mu}_\\theta(\\mathbf{x}_t, t), \\mathbf{\\Sigma}_\\theta(\\mathbf{x}_t, t))$.\n\n"
            "Alih-alih melatih jaringan untuk memprediksi rata-rata $\\mathbf{\\mu}_\\theta$ atau citra bersih $\\mathbf{x}_0$ secara langsung, Ho et al. menemukan bahwa kualitas sampel meningkat secara dramatis jika jaringan dioptimalkan dengan fungsi objektif yang sangat sederhana (**Simplified Training Objective**):\n"
            "$$L_{simple}(\\theta) := \\mathbb{E}_{t, \\mathbf{x}_0, \\mathbf{\\epsilon}} \\left[ \\left\\| \\mathbf{\\epsilon} - \\mathbf{\\epsilon}_\\theta\\left(\\sqrt{\\bar{\\alpha}_t} \\mathbf{x}_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\mathbf{\\epsilon}, t\\right) \\right\\|^2 \\right]$$\n"
            "di mana $t$ ditarik secara seragam dari $\\{1, \\dots, T\\}$. Model $\\mathbf{\\epsilon}_\\theta$ dilatih murni untuk **menebak vektor derau Gaussian acak $\\mathbf{\\epsilon}$** yang ditambahkan pada langkah ke-$t$. Selama inferensi, citra bersih disintesis dari derau murni $\\mathbf{x}_T \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$ dengan melakukan pengurangan derau secara bertahap mundur hingga mencapai $\\mathbf{x}_0$."
        ),
        "codeSnippet": code_17_7,
        "codeSnippetOutput": run_code_capture_output(code_17_7),
        "realWorldApplication": (
            "Menjadi fondasi teoretis seluruh generator citra generasi mutakhir dunia saat ini (seperti OpenAI DALL-E 2/3, Midjourney, Stability AI Stable Diffusion, dan Google Imagen)."
        ),
        "commonPitfalls": [
            r"Mengiterasi proses forward langkah demi langkah saat training (sangat lambat dan boros memori) alih-alih menggunakan rumus closed-form q(x_t | x_0).",
            r"Lupa memasukkan timestep embedding t (menggunakan Sinusoidal Embedding) ke dalam setiap residual block U-Net, sehingga model tidak mengetahui level noise yang harus dibersihkan.",
            r"Menyetel beta_end terlalu kecil sehingga pada t=T sinyal data asli masih tersisa dan tidak sepenuhnya menjadi Gaussian murni."
        ],
        "caseStudy": (
            "Buktikan secara matematis mengapa L_simple pada DDPM merupakan bentuk penimbangan ulang (re-weighted) dari Variational Bound (ELBO) konvensional, dan jelaskan mengapa membuang faktor pembobot analitik snr(t) justru secara dramatis meningkatkan kualitas persepsi visual citra hasil rekonstruksi."
        ),
        "academicReferences": [
            r"Ho, J., Jain, A., & Abbeel, P. (2020). Denoising diffusion probabilistic models. Advances in Neural Information Processing Systems, 33, 6840-6851.",
            r"Sohl-Dickstein, J., Weiss, E., Khan, N., & Sompolinsky, H. (2015). Deep unsupervised learning using nonequilibrium thermodynamics. In International Conference on Machine Learning (pp. 2256-2265).",
            r"Song, Y., & Ermon, S. (2019). Generative modeling by estimating gradients of the data distribution. Advances in Neural Information Processing Systems, 32."
        ]
    }
})

# ==============================================================================
# Subbab 17.8: DDIM (Denoising Diffusion Implicit Models)
# ==============================================================================
code_17_8 = r'''import numpy as np

# Implementasi Akselerasi Sampling Deterministik DDIM (Song et al., ICLR 2021)
# Mengubah proses Markov DDPM menjadi Non-Markovian dengan parameter stokastik eta = 0 (deterministik murni)
# Memangkas langkah sampling dari T=1000 menjadi S=50 langkah tanpa perlu melatih ulang model!

def ddim_step(x_t, eps_pred, alpha_bar_t, alpha_bar_prev, eta=0.0):
    """
    x_t: tensor state saat ini
    eps_pred: derau prediksi dari U-Net epsilon_theta(x_t, t)
    alpha_bar_t: akumulasi varians pada langkah t
    alpha_bar_prev: akumulasi varians pada langkah sebelumnya t_prev (bisa lompat 20 langkah)
    eta: parameter stokastik (eta=0 untuk DDIM deterministik; eta=1 untuk DDPM)
    """
    # 1. Estimasi citra bersih awal x_0 'predicted x_0'
    pred_x0 = (x_t - np.sqrt(1.0 - alpha_bar_t) * eps_pred) / np.sqrt(alpha_bar_t)
    
    # 2. Hitung varians stokastik sigma_t
    sigma_t = eta * np.sqrt((1.0 - alpha_bar_prev) / (1.0 - alpha_bar_t)) * np.sqrt(1.0 - alpha_bar_t / alpha_bar_prev)
    
    # 3. Hitung arah pointing ke x_t
    dir_xt = np.sqrt(1.0 - alpha_bar_prev - sigma_t**2) * eps_pred
    
    # 4. Hitung x_{t_prev}
    noise = np.random.randn(*x_t.shape) if eta > 0 else 0.0
    x_prev = np.sqrt(alpha_bar_prev) * pred_x0 + dir_xt + sigma_t * noise
    return x_prev, pred_x0

# Simulasi 1 langkah sampling DDIM deterministik (eta = 0.0)
np.random.seed(42)
x_curr = np.random.randn(1, 4)
eps_dummy = np.random.randn(1, 4) * 0.5
a_bar_t = 0.50
a_bar_prev = 0.70 # Melompat ke langkah dengan noise lebih rendah

x_next, est_x0 = ddim_step(x_curr, eps_dummy, a_bar_t, a_bar_prev, eta=0.0)

print("Simulasi Akselerasi Sampling Deterministik DDIM (eta = 0.0):")
print(f"State Derau x_t:              {np.round(x_curr[0], 3)}")
print(f"Estimasi Citra Bersih pred_x0: {np.round(est_x0[0], 3)}")
print(f"Hasil Langkah Loncatan x_prev: {np.round(x_next[0], 3)}")
print("DDIM memungkinkan penelusuran balik ODE secara deterministik dan pemangkasan langkah hingga 20x lebih cepat.")
'''

subchapters.append({
    "id": "cv-17-8-ddim-non-markovian-fast-sampling",
    "chapterId": "computer-vision-ch-15",
    "title": "Denoising Diffusion Implicit Models (DDIM): Proses Non-Markovian dan Akselerasi Sampling Deterministik",
    "description": "Generalisasi proses difusi non-Markovian: parameterisasi eta, pemetaan ekuivalen Neural Ordinary Differential Equations (ODEs), dan rekonstruksi inversi laten sempurna.",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "Kelemahan paling fatal dari DDPM asli (Ho et al., 2020) adalah kecepatan inferensi yang sangat lambat: untuk mensintesis satu gambar, model harus mengevaluasi jaringan U-Net secara sekuensial sebanyak $T = 1000$ langkah berturut-turut. Hal ini disebabkan oleh sifat **Rantai Markov** pada proses maju, di mana $\\mathbf{x}_{t-1}$ hanya bergantung secara lokal pada $\\mathbf{x}_t$.\n\n"
            "Jiaming Song, Chenlin Meng, dan Stefano Ermon (Stanford University, ICLR 2021) memecahkan kendala ini melalui publikasi **DDIM** (*Denoising Diffusion Implicit Models*). Song et al. membuktikan temuan teoritis luar biasa: **fungsi objektif pelatihan $L_{simple}$ dari DDPM tidak secara eksklusif mengasumsikan rantai Markov**. Kita dapat merancang keluarga proses maju **Non-Markovian** yang memiliki distribusi marginal $q(\\mathbf{x}_t \\mid \\mathbf{x}_0)$ yang identik persis dengan DDPM, namun dengan jalur kondisional bersama yang fleksibel.\n\n"
            "Distribusi pembalikan sampling DDIM diparameterisasi oleh koefisien stokastik $\\eta \\ge 0$:\n"
            "$$\\mathbf{x}_{t-1} = \\sqrt{\\bar{\\alpha}_{t-1}} \\left( \\frac{\\mathbf{x}_t - \\sqrt{1 - \\bar{\\alpha}_t} \\mathbf{\\epsilon}_\\theta(\\mathbf{x}_t, t)}{\\sqrt{\\bar{\\alpha}_t}} \\right) + \\sqrt{1 - \\bar{\\alpha}_{t-1} - \\sigma_t^2} \\, \\mathbf{\\epsilon}_\\theta(\\mathbf{x}_t, t) + \\sigma_t \\mathbf{\\epsilon}$$\n"
            "di mana:\n"
            "$$\\sigma_t = \\eta \\sqrt{\\frac{1 - \\bar{\\alpha}_{t-1}}{1 - \\bar{\\alpha}_t}} \\sqrt{1 - \\frac{\\bar{\\alpha}_t}{\\bar{\\alpha}_{t-1}}}$$\n\n"
            "Dua kasus batas parameter $\\eta$ mengungkap wawasan mendalam:\n"
            "1. **Jika $\\eta = 1$**: Formulasi kembali menjadi proses stokastik standar DDPM.\n"
            "2. **Jika $\\eta = 0$**: Varians $\\sigma_t = 0$, menjadikan proses pembalikan **sepenuhnya deterministik**. Aliran pengambilan sampel menjadi diskritisasi dari lintasan kontinu **Probability Flow Ordinary Differential Equation (ODE)**.\n\n"
            "Keunggulan fundamental DDIM mencakup:\n"
            "- **Akselerasi Langkah Radikal**: Jumlah langkah dapat dipangkas dari 1000 menjadi 20–50 langkah dengan melompati subhimpunan timestep tanpa perlu melakukan pelatihan ulang (*zero-shot acceleration*).\n"
            "- **Inversi Laten Sempurna (*DDIM Inversion*)**: Karena prosesnya deterministik dan dapat dibalik secara matematis, citra nyata dapat dipetakan kembali ke vektor derau laten uniknya untuk manipulasi atribut foto secara presisi."
        ),
        "codeSnippet": code_17_8,
        "codeSnippetOutput": run_code_capture_output(code_17_8),
        "realWorldApplication": (
            "Digunakan sebagai sampler default pada UI generator gambar populer (seperti Automatic1111 WebUI, ComfyUI) untuk menghasilkan gambar berkualitas tinggi dalam 20-30 langkah, serta pada pipeline penyuntingan foto berbasis teks (Prompt-to-Prompt, Null-text Inversion)."
        ),
        "commonPitfalls": [
            r"Mengasumsikan DDIM memerlukan training ulang bobot model dari nol, padahal DDIM hanya mengubah algoritma sampling pada checkpoint DDPM yang sudah ada.",
            r"Menggunakan loncatan langkah yang terlalu ekstrem (misal S < 10) tanpa solver numerik orde tinggi (seperti DPM-Solver atau UniPC), yang memicu artefak distorsi.",
            r"Ketidaktepatan akumulasi numerik pada DDIM Inversion yang menyebabkan gambar hasil rekonstruksi tidak identik dengan foto asli saat di-edit."
        ],
        "caseStudy": (
            "Diberikan sebuah model difusi terlatih dengan T = 1000. Jelaskan bagaimana jadwal sub-sekuensial langkah tau = [1, 21, 41, ..., 981] dibentuk untuk mengeksekusi sampling 50 langkah DDIM, dan mengapa integritas estimasi x_0 terjaga di setiap lompatan."
        ),
        "academicReferences": [
            r"Song, J., Meng, C., & Ermon, S. (2021). Denoising diffusion implicit models. In International Conference on Learning Representations (ICLR).",
            r"Song, Y., Sohl-Dickstein, J., Kingma, D. P., Kumar, A., Ermon, S., & Poole, B. (2021). Score-based generative modeling through stochastic differential equations. In ICLR.",
            r"Lu, C., Zhou, Y., Bao, F., Chen, J., Li, C., & Zhu, J. (2022). Dpm-solver: A fast ode solver for diffusion probabilistic model sampling in around 10 steps. Advances in Neural Information Processing Systems, 35, 5775-5787."
        ]
    }
})

# ==============================================================================
# Subbab 17.9: Latent Diffusion Models (LDM / Stable Diffusion)
# ==============================================================================
code_17_9 = r'''import numpy as np

# Simulasi Latent Diffusion Models (Rombach et al., CVPR 2022 / Stable Diffusion)
# Menggeser proses difusi dari Pixel Space (H x W x 3) ke Latent Space (H/8 x W/8 x 4)
# Mengurangi kompleksitas komputasi dimensi sebesar 64x lipat!

img_h, img_w, img_c = 512, 512, 3
downsample_factor = 8
latent_c = 4

latent_h = img_h // downsample_factor
latent_w = img_w // downsample_factor

pixel_dim = img_h * img_w * img_c
latent_dim = latent_h * latent_w * latent_c
compression_ratio = pixel_dim / latent_dim

# Simulasi Cross-Attention Pengkondisian Teks pada U-Net Laten
# Attention(Q, K, V) = softmax(Q * K^T / sqrt(d)) * V
# Q: Proyeksi dari peta fitur laten visual (N_pixels, d_k)
# K, V: Proyeksi dari representasi teks CLIP (N_tokens, d_k)

n_tokens = 77
d_model = 64

np.random.seed(42)
Q_latent = np.random.randn(latent_h * latent_w, d_model) * 0.1 # (4096, 64)
K_text   = np.random.randn(n_tokens, d_model) * 0.1            # (77, 64)
V_text   = np.random.randn(n_tokens, d_model)                  # (77, 64)

# Evaluasi atensi cross-attention untuk 1 patch laten
scores = np.dot(Q_latent[0:1], K_text.T) / np.sqrt(d_model) # (1, 77)
attn_weights = np.exp(scores - np.max(scores))
attn_weights /= np.sum(attn_weights, axis=1, keepdims=True)
context_vector = np.dot(attn_weights, V_text) # (1, 64)

print("Analisis Efisiensi Latent Diffusion Models (Stable Diffusion):")
print(f"Dimensi Ruang Piksel Asli:  {img_h}x{img_w}x{img_c} = {pixel_dim:,} nilai")
print(f"Dimensi Ruang Laten VAE:    {latent_h}x{latent_w}x{latent_c} = {latent_dim:,} nilai")
print(f"Faktor Reduksi Komputasi:   {compression_ratio:.1f}x lebih efisien!")
print(f"Cross-Attention Berhasil Menghubungkan Laten Visual dengan {n_tokens} Token Teks CLIP.")
'''

subchapters.append({
    "id": "cv-17-9-latent-diffusion-stable-diffusion",
    "chapterId": "computer-vision-ch-15",
    "title": "Latent Diffusion Models (LDM / Stable Diffusion): Kompresi Ruang Laten dan Cross-Attention",
    "description": "Dekomposisi kompresi perseptual dan difusi semantik: autoencoder VAE kontinu f=8, integrasi mekanisme Cross-Attention multi-modalitas, dan demokratisasi AI generatif.",
    "estimatedMinutes": 40,
    "order": 9,
    "content": {
        "theory": (
            "Meskipun model difusi piksel seperti DDPM menghasilkan sampel yang spektakuler, kebutuhan komputasinya sangat mahal: melatih dan menjalankan difusi pada ruang piksel beresolusi tinggi $512 \\times 512 \\times 3$ menghabiskan ratusan ribu GPU-hours karena jaringan U-Net terpaksa menghabiskan sebagian besar kapasitasnya untuk memodelkan derau mikroskopis frekuensi tinggi yang tidak memiliki makna semantik.\n\n"
            "Robin Rombach, Andreas Blattmann, Dominik Lorenz, Patrick Esser, dan Björn Ommer (*LMU Munich & Runway & Stability AI*, CVPR 2022) menciptakan terobosan paling berpengaruh melalui **Latent Diffusion Models (LDM)**, yang menjadi fondasi model sumber terbuka legendaris **Stable Diffusion**.\n\n"
            "Inovasi kunci LDM adalah **Pemisahan Tahap Pembelajaran Menjadi Dua Tingkat (*Two-Stage Separation*)**:\n"
            "1. **Kompresi Perseptual (Perceptual Compression via VAE)**: Jaringan Autoencoder dilatih terlebih dahulu untuk memampatkan citra piksel $\\mathbf{x} \\in \\mathbb{R}^{H \\times W \\times 3}$ ke dalam ruang manifold laten berdimensi rendah $\\mathbf{z} = \\mathcal{E}(\\mathbf{x}) \\in \\mathbb{R}^{h \\times w \\times c}$ (dengan faktor reduksi spasial $f = H/h = W/w = 8$ dan $c = 4$). Dengan rasio reduksi ini, ruang laten berukuran $64 \\times 64 \\times 4$ mempertahankan integritas semantik penuh sembari membuang detail imperseptual.\n"
            "2. **Difusi Semantik di Ruang Laten**: Proses difusi forward dan reverse dijalankan murni di dalam **ruang representasi laten $\\mathbf{z}$**, memangkas beban komputasi dan memori GPU hingga lebih dari 64 kali lipat.\n\n"
            "Untuk memungkinkan sintesis yang dikontrol secara fleksibel oleh modalitas teks, sketsa, atau citra lain, LDM mengintegrasikan mekanisme **Cross-Attention** di dalam blok U-Net laten:\n"
            "$$\\text{Attention}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{softmax}\\left( \\frac{\\mathbf{Q} \\mathbf{K}^T}{\\sqrt{d}} \\right) \\mathbf{V}$$\n"
            "di mana kueri $\\mathbf{Q} = \\mathbf{W}_Q \\cdot \\phi_i(\\mathbf{z}_t)$ diproyeksikan dari peta fitur spasial perantara U-Net, sedangkan kunci $\\mathbf{K} = \\mathbf{W}_K \\cdot \\tau_\\theta(y)$ dan nilai $\\mathbf{V} = \\mathbf{W}_V \\cdot \\tau_\\theta(y)$ diproyeksikan dari representasi embedding teks yang dihasilkan oleh enkoder pra-terlatih (seperti CLIP ViT-L/14 atau T5)."
        ),
        "codeSnippet": code_17_9,
        "codeSnippetOutput": run_code_capture_output(code_17_9),
        "realWorldApplication": (
            "Menjadi mesin utama ekosistem Text-to-Image global sumber terbuka (Stable Diffusion v1.5, SDXL, SD3) yang berjalan di jutaan kartu grafis konsumen (RTX 3060/4090) untuk pembuatan ilustrasi, konsep seni, dan desain produk."
        ),
        "commonPitfalls": [
            r"Mencoba melatih autoencoder VAE bersamaan secara end-to-end dengan U-Net difusi (keduanya harus dilatih dalam dua tahap terpisah agar ruang laten stabil).",
            r"Mengabaikan penskalaan faktor varians laten (scaling factor ~ 0.18215 pada SD v1.5) saat mengalirkan output VAE ke proses difusi.",
            r"Resolusi input non-kelipatan 8 atau 64 yang memicu dimensional mismatch pada layer konvolusi terkompresi."
        ],
        "caseStudy": (
            "Bandingkan kebutuhan komputasi floating-point operations (FLOPs) untuk satu langkah denoising U-Net pada resolusi piksel mentah 512x512x3 versus U-Net laten pada 64x64x4. Mengapa reduksi spasial f=8 menjadi titik keseimbangan (sweet spot) optimal antara kualitas rekonstruksi persepsi visual dan efisiensi memori VRAM?"
        ),
        "academicReferences": [
            r"Rombach, R., Blattmann, A., Lorenz, D., Esser, P., & Ommer, B. (2022). High-resolution image synthesis with latent diffusion models. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 10684-10695).",
            r"Esser, P., Rombach, R., & Ommer, B. (2021). Taming transformers for high-resolution image synthesis. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 12873-12883).",
            r"Podell, D., English, Z., Lacey, K., Blattmann, A., Dockhorn, T., Müller, J., ... & Rombach, R. (2023). SDXL: Improving latent diffusion models for high-resolution image synthesis. arXiv preprint arXiv:2307.01952."
        ]
    }
})

# ==============================================================================
# Subbab 17.10: Pengkondisian & Kontrol: CFG, ControlNet, FID & IS
# ==============================================================================
code_17_10 = r'''import numpy as np

# Implementasi Classifier-Free Guidance (CFG, Ho & Salimans, NeurIPS 2021)
# eps_cfg = eps_uncond + s * (eps_cond - eps_uncond)
# s > 1.0 memperkuat keselarasan terhadap teks (prompt adherence) dengan mengorbankan sedikit diversitas

def apply_classifier_free_guidance(eps_uncond, eps_cond, guidance_scale=7.5):
    """
    eps_uncond: prediksi derau tanpa teks (kondisi kosong / unconditional)
    eps_cond: prediksi derau dengan teks (conditional prompt)
    guidance_scale: faktor pengali s (biasanya 7.0 - 8.0)
    """
    return eps_uncond + guidance_scale * (eps_cond - eps_uncond)

# Simulasi vektor prediksi derau pada 4 kanal
np.random.seed(42)
pred_uncond = np.array([0.15, -0.20, 0.05, 0.40])
pred_cond   = np.array([0.25, -0.10, 0.08, 0.35])

# Hitung arah panduan semantik (cond - uncond)
direction = pred_cond - pred_uncond
guided_eps = apply_classifier_free_guidance(pred_uncond, pred_cond, guidance_scale=7.5)

print("Simulasi Classifier-Free Guidance (CFG s = 7.5):")
print(f"Prediksi Unconditional (Arah Bebas): {pred_uncond}")
print(f"Prediksi Conditional (Arah Teks):   {pred_cond}")
print(f"Vektor Sinyal Teks (Cond - Uncond):  {np.round(direction, 3)}")
print(f"Prediksi Terpadu Ter-amplifikasi:   {np.round(guided_eps, 3)}")
print("\nCFG secara drastis mendongkrak ketajaman dan keselarasan prompt teks tanpa model classifier eksternal!")
'''

subchapters.append({
    "id": "cv-17-10-conditioning-controlnet-cfg-metrics",
    "chapterId": "computer-vision-ch-15",
    "title": "Pengkondisian & Kontrol Generatif: Classifier-Free Guidance (CFG), ControlNet, serta Evaluasi FID/IS",
    "description": "Teknik pengendalian presisi generasi visual: formulasi amplifikasi CFG, arsitektur ControlNet berbasis zero-convolution, serta metrik evaluasi Fréchet Inception Distance (FID).",
    "estimatedMinutes": 40,
    "order": 10,
    "content": {
        "theory": (
            "Model difusi bersyarat (*conditional diffusion*) menghadapi tantangan dalam menyeimbangkan antara fidelitas kepatuhan terhadap teks input (*prompt adherence*) dan keragaman visual sampel (*sample diversity*). Ho & Salimans (NeurIPS 2021) merancang solusi tanpa memerlukan model klasifikasi tambahan bernama **Classifier-Free Guidance (CFG)**.\n\n"
            "Selama pelatihan, kondisi teks $c$ diganti dengan token kosong $\\emptyset$ dengan probabilitas $p_{uncond} \\approx 0.1$. Selama inferensi, model mengevaluasi dua jalur: jalur tanpa teks $\\mathbf{\\epsilon}_\\theta(\\mathbf{x}_t, \\emptyset)$ dan jalur dengan teks $\\mathbf{\\epsilon}_\\theta(\\mathbf{x}_t, c)$. Prediksi derau akhir diekstrapolasikan secara linier:\n"
            "$$\\tilde{\\mathbf{\\epsilon}}_\\theta(\\mathbf{x}_t, c) = \\mathbf{\\epsilon}_\\theta(\\mathbf{x}_t, \\emptyset) + s \\cdot \\left( \\mathbf{\\epsilon}_\\theta(\\mathbf{x}_t, c) - \\mathbf{\\epsilon}_\\theta(\\mathbf{x}_t, \\emptyset) \\right)$$\n"
            "di mana $s > 1.0$ (biasanya $s \\in [7, 8]$) adalah **skala panduan (*guidance scale*)**. Parameter ini mengamplifikasi fitur-fitur pembeda yang spesifik diminta oleh teks prompt.\n\n"
            "Untuk kontrol spasial berkepresisian tinggi (seperti mempertahankan pose kerangka manusia, garis tepi Canny, atau peta kedalaman), Lvmin Zhang & Maneesh Agrawala (Stanford University, ICCV 2023) memperkenalkan **ControlNet**. ControlNet mengunci (*locks*) parameter bobot U-Net utama yang sudah terlatih, membuat salinan cabang encoder yang dapat dilatih (*trainable copy*), dan menghubungkannya melalui lapisan **Zero-Convolution** ($1 \\times 1$ convolution dengan bobot dan bias diinisialisasi nol murni):\n"
            "$$\\mathcal{Z}(\\mathbf{x}; \\Theta) = \\mathbf{W} \\mathbf{x} + \\mathbf{b} = \\mathbf{0} \\cdot \\mathbf{x} + \\mathbf{0} = \\mathbf{0}$$\n"
            "Karena inisialisasi nol ini, ControlNet tidak memberikan gangguan berbahaya pada model difusi utama di awal pelatihan, memungkinkan pembelajaran kontrol spasial baru yang sangat cepat dan stabil.\n\n"
            "Evaluasi performa model generatif visual secara ilmiah diukur menggunakan metrik standar:\n"
            "1. **Fréchet Inception Distance (FID)** (Heusel et al., 2017): Mengukur jarak Wasserstein-2 antara distribusi fitur Gaussian dari lapisan pooling Inception-v3 pada data nyata $(\\mu_r, \\Sigma_r)$ dan data sintetis $(\\mu_g, \\Sigma_g)$:\n"
            "$$\\text{FID} = \\| \\mu_r - \\mu_g \\|^2 + \\text{Tr}\\left( \\Sigma_r + \\Sigma_g - 2(\\Sigma_r \\Sigma_g)^{1/2} \\right)$$\n"
            "Nilai FID yang lebih rendah menunjukkan kualitas visual yang lebih realistis dan keragaman distribusi yang lebih baik.\n"
            "2. **Inception Score (IS)**: Mengukur kejelasan objek individual (entropi rendah $p(y|x)$) dan keragaman kelas global (entropi tinggi marginal $p(y)$)."
        ),
        "codeSnippet": code_17_10,
        "codeSnippetOutput": run_code_capture_output(code_17_10),
        "realWorldApplication": (
            "Diterapkan secara masif pada alur kerja profesional industri kreatif: ControlNet OpenPose untuk mengontrol pose model pakaian pada e-commerce fashion, ControlNet Canny/Depth untuk visualisasi arsitektur interior, dan pengukuran benchmark otomatis model generatif di Hugging Face."
        ),
        "commonPitfalls": [
            r"Menyetel nilai guidance scale s terlalu ekstrem (misal s > 15), yang menyebabkan fenomena oversaturation, kontras warna terbakar (burned colors), dan artefak visual tajam.",
            r"Mengukur nilai FID dengan jumlah sampel terlalu sedikit (standar evaluasi ilmiah wajib menggunakan minimal 50.000 sampel untuk stabilitas matriks kovarians).",
            r"Mengabaikan inisialisasi nol murni pada Zero-Convolution ControlNet, yang langsung merusak stabilitas generasi model fondasi dasar."
        ],
        "caseStudy": (
            "Sebuah studio animasi ingin menggunakan ControlNet untuk mentransfer sketsa tangan kasar animator menjadi ilustrasi anime penuh. Jelaskan alur transfer fitur dari Zero-Convolution cabang trainable ControlNet ke skip-connections decoder U-Net utama, dan bagaimana nilai bobot nol melindungi pengetahuan dasar model difusi."
        ),
        "academicReferences": [
            r"Ho, J., & Salimans, T. (2022). Classifier-free diffusion guidance. arXiv preprint arXiv:2207.12598.",
            r"Zhang, L., Rao, A., & Agrawala, M. (2023). Adding conditional control to text-to-image diffusion models. In Proceedings of the IEEE/CVF International Conference on Computer Vision (pp. 3836-3847).",
            r"Heusel, M., Ramsauer, H., Unterthiner, T., Nessler, B., & Hochreiter, S. (2017). Gans trained by a two time-scale update rule converge to a local nash equilibrium. Advances in Neural Information Processing Systems, 30."
        ]
    }
})

# Simpan ke JSON
output_path = os.path.join(os.path.dirname(__file__), "cv_ch17_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 17 -> {output_path}")
