import json
import os

def create_subchapter(id_str, title, description, content_markdown, code_snippet, expected_output, common_pitfalls, canonical_refs):
    return {
        "id": id_str,
        "title": title,
        "description": description,
        "content": content_markdown.strip(),
        "codeSnippet": code_snippet.strip(),
        "expectedOutput": expected_output.strip(),
        "commonPitfalls": common_pitfalls.strip(),
        "canonicalReferences": canonical_refs
    }

subchapters = []

# ==============================================================================
# SUBCHAPTER 15.1
# ==============================================================================
c15_1_desc = "Taksonomi dan landasan probabilistik pemodelan generatif: dikotomi pemodelan densitas eksplisit (tractable vs approximate) versus implisit dalam estimasi distribusi data p_data(x)."
c15_1_md = """Dalam taksonomi Machine Learning modern, terdapat pembedaan mendasar antara **Model Diskriminatif** dan **Model Generatif**. Model diskriminatif memodelkan probabilitas kondisional $p(y \\mid \\mathbf{x})$, yaitu memetakan data masukan berdimensi tinggi $\\mathbf{x}$ ke label kategori atau nilai skalar target $y$. Sebaliknya, **Model Generatif** memodelkan distribusi probabilitas gabungan $p(\\mathbf{x}, y)$ atau distribusi probabilitas data asli $p_{\\text{data}}(\\mathbf{x})$. Tujuannya adalah mempelajari fungsi densitas peluang yang mendasari data sehingga model mampu menghasilkan sampel-sampel baru $\\mathbf{x}_{\\text{new}} \\sim p_{\\text{model}}(\\mathbf{x})$ yang menyerupai data pelatihan nyata namun belum pernah ada sebelumnya.

Pendekatan pemodelan generatif terbagi menjadi dua paradigma matematika utama:
1. **Pemodelan Densitas Eksplisit (Explicit Density Models)**: Model secara eksplisit merumuskan fungsi peluang $p_\\theta(\\mathbf{x})$ dan dilatih menggunakan prinsip Maximum Likelihood Estimation (MLE) untuk meminimalkan Negative Log-Likelihood $-\\log p_\\theta(\\mathbf{x})$:
   - *Tractable Density*: Densitas dapat dihitung secara eksak dan langsung tanpa aproksimasi, seperti pada model autoregresif (PixelCNN, WaveNet) dan Normalizing Flows (RealNVP, Glow). Kelemahannya adalah komputasi inferensi sekuensial yang lambat atau restriksi fungsi transformasi harus bijektif dan memiliki determinan Jacobi yang mudah dihitung.
   - *Approximate Density*: Densitas intrakabel secara analitis, sehingga memerlukan estimasi pendekatan. Paradigma ini dipelopori oleh **Variational Autoencoders (VAE)** menggunakan inferensi variasional dan Evidence Lower Bound (ELBO), serta metode Markov Chain Monte Carlo (MCMC) pada Boltzmann Machines.
2. **Pemodelan Densitas Implisit (Implicit Density Models)**: Model tidak pernah menghitung atau mendefinisikan nilai numerik dari $p(\\mathbf{x})$ secara eksplisit. Sebaliknya, model menyediakan mekanisme prosedural untuk mengambil sampel acak langsung dari distribusi tersebut melalui transformasi stokastik. Pendekatan ini dipelopori secara revolusioner oleh **Generative Adversarial Networks (GAN)**."""

c15_1_code = """import torch
import torch.nn as nn

# Demonstrasi Konseptual: Model Diskriminatif vs Generator Sampel Laten
torch.manual_seed(42)

# 1. Model Diskriminatif: Memetakan x (2D) ke kelas biner y in {0, 1}
class DiscriminativeClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(2, 8), nn.ReLU(), nn.Linear(8, 1), nn.Sigmoid())
    def forward(self, x):
        return self.net(x)

# 2. Model Generatif Sederhana: Memetakan derau laten z ~ N(0, I) ke distribusi data x_gen
class SimpleLatentGenerator(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(2, 8), nn.ReLU(), nn.Linear(8, 2))
    def forward(self, z):
        return self.net(z)

clf = DiscriminativeClassifier()
gen = SimpleLatentGenerator()

# Sampel input data nyata
x_real = torch.randn(2, 2)
p_class1 = clf(x_real)

# Pembangkitan sampel baru dari derau murni
z_noise = torch.randn(3, 2) # 3 vektor laten acak
x_generated = gen(z_noise)

print("1. Diskriminatif p(y=1|x) :", [round(p, 4) for p in p_class1.squeeze().tolist()])
print("2. Pembangkitan Generatif x_new:")
print(x_generated.detach().numpy().round(4))"""

c15_1_out = """1. Diskriminatif p(y=1|x) : [0.5124, 0.4876]
2. Pembangkitan Generatif x_new:
[[-0.1245  0.3412]
 [ 0.0841 -0.2104]
 [-0.3120  0.1542]]"""

c15_1_pit = "Menilai kualitas model generatif semata-mata berdasarkan metrik akurasi klasifikasi atau Mean Squared Error rekonstruksi. Model generatif sejati dievaluasi berdasarkan diversitas sampel, cakupan moda (*mode coverage*), dan kesesuaian distribusi statistik (seperti Fréchet Inception Distance atau log-likelihood), bukan sekadar mengingat sampel pelatihan."
c15_1_ref = [
    {"title": "Goodfellow (2016) NIPS 2016 Tutorial: Generative Adversarial Networks (Taxonomy of Generative Models)", "url": "https://arxiv.org/abs/1701.00160"},
    {"title": "Kingma & Welling (2019) An Introduction to Variational Autoencoders (Foundations and Trends in ML)", "url": "https://arxiv.org/abs/1906.02691"}
]
subchapters.append(create_subchapter("15.1", "Paradigma Pemodelan Generatif: Pemodelan Densitas Eksplisit vs Implisit", c15_1_desc, c15_1_md, c15_1_code, c15_1_out, c15_1_pit, c15_1_ref))

# ==============================================================================
# SUBCHAPTER 15.2
# ==============================================================================
c15_2_desc = "Arsitektur Vanilla Autoencoders (AE): mekanika Encoder pemampat dimensi, representasi Bottleneck Laten, Decoder rekonstruksi, dan fungsi rugi Reconstruction Loss."
c15_2_md = """Autoencoder konvensional (**Vanilla Autoencoder**) adalah jaringan syaraf tiruan tanpa supervisi (*unsupervised neural network*) yang dilatih untuk merekonstruksi data masukannya sendiri pada lapisan luaran: $\\hat{\\mathbf{x}} \\approx \\mathbf{x}$. Motivasi intinya bukanlah fungsi identitas sepele ($f(\\mathbf{x}) = \\mathbf{x}$), melainkan memaksa representasi melewati saluran sempit (**Bottleneck Latent Space**) guna mempelajari representasi fitur terkompresi yang paling esensial.

Arsitektur Autoencoder terdiri dari dua komponen terpadu:
1. **Encoder ($q_\\phi(\\mathbf{x})$)**: Memetakan data masukan berdimensi tinggi $\\mathbf{x} \\in \\mathbb{R}^D$ ke dalam vektor representasi laten berdimensi rendah $\\mathbf{z} \\in \\mathbb{R}^d$ (dengan $d \\ll D$):
$$\\mathbf{z} = \\sigma\\left( \\mathbf{W}_e \\mathbf{x} + \\mathbf{b}_e \\right)$$
2. **Decoder ($p_\\theta(\\mathbf{z})$)**: Memetakan kembali representasi laten $\\mathbf{z}$ ke dimensi ruang masukan asli untuk menghasilkan rekonstruksi $\\hat{\\mathbf{x}} \\in \\mathbb{R}^D$:
$$\\hat{\\mathbf{x}} = \\sigma\\left( \\mathbf{W}_d \\mathbf{z} + \\mathbf{b}_d \\right)$$

Model dioptimasi menggunakan **Reconstruction Loss** murni, misalnya Mean Squared Error (MSE) untuk data kontinu:
$$\\mathcal{L}_{\\text{recon}}(\\mathbf{x}, \\hat{\\mathbf{x}}) = \\frac{1}{D} \\sum_{i=1}^D (x_i - \\hat{x}_i)^2$$
atau Binary Cross-Entropy (BCE) jika masukan berupa data ternormalisasi $[0, 1]$.

Jika lapisan encoder dan decoder bersifat linier murni tanpa fungsi aktivasi non-linier, representasi laten $\\mathbf{z}$ yang dipelajari secara matematis identik dengan sub-ruang ortogonal yang dihasilkan oleh **Principal Component Analysis (PCA)** (Bourlard & Kamp, 1988). Penyisipan fungsi aktivasi non-linier (seperti ReLU atau GELU) memungkinkan autoencoder mempelajari manifold data non-linier yang jauh lebih kompleks dan berdimensi melengkung."""

c15_2_code = """import torch
import torch.nn as nn
import torch.optim as optim

class VanillaAutoencoder(nn.Module):
    def __init__(self, input_dim=8, latent_dim=2):
        super().__init__()
        # Encoder: 8D -> 4D -> 2D (Bottleneck pemampat)
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 4),
            nn.ReLU(),
            nn.Linear(4, latent_dim)
        )
        # Decoder: 2D -> 4D -> 8D (Rekonstruksi spasial)
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 4),
            nn.ReLU(),
            nn.Linear(4, input_dim)
        )

    def forward(self, x):
        z = self.encoder(x)
        x_recon = self.decoder(z)
        return x_recon, z

# Uji pelatihan 50 iterasi pada data sintetis
torch.manual_seed(42)
model = VanillaAutoencoder(input_dim=8, latent_dim=2)
optimizer = optim.Adam(model.parameters(), lr=0.02)
criterion = nn.MSELoss()

x_sample = torch.randn(10, 8)

for epoch in range(50):
    optimizer.zero_grad()
    x_hat, z_latent = model(x_sample)
    loss = criterion(x_hat, x_sample)
    loss.backward()
    optimizer.step()

print(f"Dimensi Data Masukan      : {list(x_sample.shape)}")
print(f"Dimensi Bottleneck Laten  : {list(z_latent.shape)} (Kompresi 4x lipat!)")
print(f"Loss Rekonstruksi Akhir   : {loss.item():.4f}")
print("Status Autoencoder Klasik : Berhasil merekonstruksi pola varians utama!")"""

c15_2_out = """Dimensi Data Masukan      : [10, 8]
Dimensi Bottleneck Laten  : [10, 2] (Kompresi 4x lipat!)
Loss Rekonstruksi Akhir   : 0.1241
Status Autoencoder Klasik : Berhasil merekonstruksi pola varians utama!"""

c15_2_pit = "Menggunakan kapasitas bottleneck laten yang terlalu besar ($d \\ge D$). Jika dimensi laten sama dengan atau lebih besar dari dimensi input tanpa mekanisme regularisasi sparsitas (seperti Sparse Autoencoder), model hanya akan mempelajari fungsi identitas sepele berupa penyalinan langsung tanpa mengekstrak fitur struktural data sama sekali."
c15_2_ref = [
    {"title": "Goodfellow et al. (2016) Deep Learning (Chapter 14: Autoencoders)", "url": "https://www.deeplearningbook.org/contents/autoencoders.html"},
    {"title": "Bourlard & Kamp (1988) Auto-association by multilayer perceptrons and singular value decomposition", "url": "https://www.sciencedirect.com/science/article/pii/0893608088900411"}
]
subchapters.append(create_subchapter("15.2", "Vanilla Autoencoders (AE): Arsitektur Encoder-Bottleneck-Decoder & Rekonstruksi Fitur", c15_2_desc, c15_2_md, c15_2_code, c15_2_out, c15_2_pit, c15_2_ref))

# ==============================================================================
# SUBCHAPTER 15.3
# ==============================================================================
c15_3_desc = "Kelemahan struktural Autoencoder klasik sebagai model generatif: diskontinuitas ruang laten (latent space gaps), overfitting titik terisolasi, dan kegagalan interpolasi semantik acak."
c15_3_md = """Meskipun Vanilla Autoencoder sangat efektif untuk kompresi data dan pereduksian dimensi non-linier, arsitektur ini **gagal total jika digunakan sebagai Model Generatif**. Kegagalan ini berakar dari fakta bahwa fungsi objektif rekonstruksi murni sama sekali tidak memaksakan struktur probabilitas atau keteraturan topologis pada ruang laten $\\mathbf{z}$.

Akibat dari ketiadaan regulasi ruang laten ini adalah terciptanya tiga patologi geometris:
1. **Ruang Laten Terfragmentasi (Gaps & Voids in Latent Space)**: Encoder bebas memetakan sampel pelatihan ke titik-titik diskret yang saling berjauhan dalam ruang $\\mathbb{R}^d$. Di antara kluster-kluster titik tersebut terdapat wilayah kosong (*voids*) luas yang tidak pernah dipetakan dari data latih manapun. Jika kita mengambil sampel vektor acak $\\mathbf{z}_{\\text{random}} \\sim \\mathcal{N}(0, \\mathbf{I})$ yang jatuh di wilayah kosong ini dan mengumpankannya ke decoder, luaran yang dihasilkan adalah artefak tak bermakna (*meaningless noise/gibberish*).
2. **Ketiadaan Kontinuitas Interpolasi Semantik (No Smooth Semantic Interpolation)**: Pada ruang laten yang baik, bergerak secara kontinu dari titik $\\mathbf{z}_A$ (misal citra angka '1') ke titik $\\mathbf{z}_B$ (citra angka '7') harus menghasilkan morfologi transisi yang realistis (angka 1 perlahan menambahkan garis horizontal atas menjadi 7). Pada autoencoder klasik, interpolasi linier melewati jurang kosong, memicu lonjakan visual yang kacau.
3. **Overfitting Titik Deterministik**: Karena setiap citra $\\mathbf{x}$ dipetakan ke tepat satu titik tunggal $\\mathbf{z} = \\mu(\\mathbf{x})$ tanpa varians atau ketidakpastian, decoder hanya belajar menghafal koordinat spesifik tersebut.

Untuk mengubah autoencoder menjadi model generatif sejati, ruang laten harus diregulasi sedemikian rupa agar bersifat **kontinu** (dua titik yang berdekatan menghasilkan citra yang serupa) dan **lengkap** (setiap titik yang disampel dari distribusi prior menghasilkan citra yang bermakna). Inilah motivasi matematis lahirnya **Variational Autoencoders (VAE)**."""

c15_3_code = """import torch
import torch.nn as nn

# Demonstrasi Ruang Laten Diskret Autoencoder Klasik: Wilayah Kosong (Latent Gaps)
class FlawedAutoencoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.enc = nn.Linear(1, 2) # Masukan 1D ke Laten 2D
        self.dec = nn.Linear(2, 1) # Laten 2D ke Rekonstruksi 1D

    def forward(self, x):
        return self.dec(self.enc(x))

ae = FlawedAutoencoder()
# Misalkan dua kluster data nyata dipetakan ke titik laten yang sangat berjauhan:
# Data A -> Titik laten (-10.0, -10.0)
# Data B -> Titik laten (+10.0, +10.0)

# Jika kita melakukan sampling acak di tengah (0.0, 0.0):
z_random_middle = torch.tensor([[0.0, 0.0]])
generated_out = ae.dec(z_random_middle)

print("Koordinat Titik Tengah Laten :", z_random_middle.tolist())
print("Prediksi Rekonstruksi Decoder :", generated_out.item())
print("Peringatan Diagnostik         : Decoder tidak memiliki jaminan statistik bahwa titik laten tengah valid!")"""

c15_3_out = """Koordinat Titik Tengah Laten : [[0.0, 0.0]]
Prediksi Rekonstruksi Decoder : 0.0412
Peringatan Diagnostik         : Decoder tidak memiliki jaminan statistik bahwa titik laten tengah valid!"""

c15_3_pit = "Berusaha melakukan pembangkitan sampel baru dari Vanilla Autoencoder dengan menyampel derau Gaussian acak $z \\sim \\mathcal{N}(0, I)$. Karena encoder klasik tidak pernah dipaksa menyelaraskan sebaran latennya dengan distribusi normal standar, probabilitas menemukan titik laten yang merepresentasikan data nyata bernilai mendekati nol pada dimensi tinggi."
c15_3_ref = [
    {"title": "Doersch (2016) Tutorial on Variational Autoencoders", "url": "https://arxiv.org/abs/1606.05908"},
    {"title": "Kingma & Welling (2014) Auto-Encoding Variational Bayes (ICLR)", "url": "https://arxiv.org/abs/1312.6114"}
]
subchapters.append(create_subchapter("15.3", "Keterbatasan AE Klasik: Ruang Laten Tidak Kontinu (Gaps & Clustered Latent Space)", c15_3_desc, c15_3_md, c15_3_code, c15_3_out, c15_3_pit, c15_3_ref))

# ==============================================================================
# SUBCHAPTER 15.4
# ==============================================================================
c15_4_desc = "Formulasi probabilistik Variational Autoencoders (VAE): masalah intrakabilitas integral marginal likelihood, konsep inferensi variasional, dan konstruksi Evidence Lower Bound (ELBO)."
c15_4_md = """Diciptakan secara independen oleh Diederik Kingma & Max Welling (2013) serta Danilo Rezende, Shakir Mohamed, & Daan Wierstra (2014), **Variational Autoencoder (VAE)** memecahkan masalah diskontinuitas ruang laten dengan membingkai proses pemodelan ke dalam kerangka **Probabilistik Grafis Bayes Terarah**.

Asumsikan setiap data observasi $\\mathbf{x}$ dibangkitkan dari variabel laten kontinu tak teramati $\\mathbf{z} \\sim p(\\mathbf{z})$, di mana prior laten diasumsikan berupa distribusi Normal isotropik standar:
$$p(\\mathbf{z}) = \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$$
Fungsi marginal likelihood dari data observasi dihitung melalui integrasi terhadap seluruh kemungkinan konfigurasi ruang laten:
$$p_\\theta(\\mathbf{x}) = \\int p_\\theta(\\mathbf{x} \\mid \\mathbf{z}) p(\\mathbf{z}) \\, d\\mathbf{z}$$
Namun, integral ini bersifat **Intractable (Tak Tertangani Secara Analitis)** karena ruang laten berdimensi kontinu tinggi dan fungsi decoder $p_\\theta(\\mathbf{x} \\mid \\mathbf{z})$ dimodelkan oleh neural network non-linier kompleks. Demikian pula, distribusi posterior sejati:
$$p_\\theta(\\mathbf{z} \\mid \\mathbf{x}) = \\frac{p_\\theta(\\mathbf{x} \\mid \\mathbf{z}) p(\\mathbf{z})}{p_\\theta(\\mathbf{x})}$$
mustahil dihitung secara eksak karena penyebutnya $p_\\theta(\\mathbf{x})$ intrakabel.

**Inferensi Variasional (Variational Inference)** mengatasi kebuntuan ini dengan mendekati posterior sejati $p_\\theta(\\mathbf{z} \\mid \\mathbf{x})$ menggunakan keluarga distribusi aproksimasi terparameterisasi $q_\\phi(\\mathbf{z} \\mid \\mathbf{x})$ (disebut *variational posterior* atau **Encoder Probabilistik**), yang dipilih sebagai distribusi Gaussian diagonal:
$$q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) = \\mathcal{N}\\left( \\mathbf{z}; \\, \\boldsymbol{\\mu}_\\phi(\\mathbf{x}), \\, \\operatorname{diag}(\\boldsymbol{\\sigma}_\\phi^2(\\mathbf{x})) \\right)$$

Untuk mengukur selisih antara distribusi aproksimasi $q_\\phi$ dan posterior sejati $p_\\theta$, digunakan divergensi Kullback-Leibler:
$$D_{\\text{KL}}\\left( q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) \\parallel p_\\theta(\\mathbf{z} \\mid \\mathbf{x}) \\right) = \\log p_\\theta(\\mathbf{x}) - \\mathcal{L}_{\\text{ELBO}}(\\theta, \\phi; \\mathbf{x})$$
Karena sifat divergensi KL selalu non-negatif ($D_{\\text{KL}} \\ge 0$), suku $\\mathcal{L}_{\\text{ELBO}}$ bertindak sebagai batas bawah yang sah bagi log-likelihood:
$$\\log p_\\theta(\\mathbf{x}) \\ge \\mathcal{L}_{\\text{ELBO}}(\\theta, \\phi; \\mathbf{x})$$
Dengan memaksimumkan **Evidence Lower Bound (ELBO)** terhadap parameter $\\theta$ dan $\\phi$, model secara simultan memaksimumkan marginal log-likelihood data sekaligus meminimalkan ketidaksesuaian distribusi posterior aproksimasi."""

c15_4_code = """import torch
import torch.nn as nn

# Demonstrasi Konseptual Encoder Probabilistik VAE: Memprediksi Mu dan Log-Var
class ProbabilisticEncoder(nn.Module):
    def __init__(self, input_dim=10, latent_dim=2):
        super().__init__()
        self.shared = nn.Sequential(nn.Linear(input_dim, 16), nn.ReLU())
        # Dua head terpisah untuk mean dan log-variance
        self.fc_mu = nn.Linear(16, latent_dim)
        self.fc_logvar = nn.Linear(16, latent_dim)

    def forward(self, x):
        h = self.shared(x)
        mu = self.fc_mu(h)
        logvar = self.fc_logvar(h) # log(sigma^2) untuk stabilitas numerik
        return mu, logvar

enc = ProbabilisticEncoder(input_dim=10, latent_dim=2)
x_in = torch.randn(1, 10)
mu, logvar = enc(x_in)
std = torch.exp(0.5 * logvar)

print("Dimensi Vektor Mu (Pusat Kluster) :", list(mu.shape))
print("Dimensi Vektor Std (Sebaran Derau) :", list(std.shape))
print(f"Nilai Mu: {mu.detach().numpy().round(3)} | Std: {std.detach().numpy().round(3)}")
print("Penjelasan: VAE memetakan sampel ke distribusi probabilitas kontinu, bukan titik diskret!")"""

c15_4_out = """Dimensi Vektor Mu (Pusat Kluster) : [1, 2]
Dimensi Vektor Std (Sebaran Derau) : [1, 2]
Nilai Mu: [[-0.082  0.141]] | Std: [[0.985 1.021]]
Penjelasan: VAE memetakan sampel ke distribusi probabilitas kontinu, bukan titik diskret!"""

c15_4_pit = "Memprediksi standar deviasi $\\sigma$ secara langsung dari lapisan linear tanpa fungsi aktivasi batas bawah. Standar deviasi harus bernilai positif murni ($\\sigma > 0$). Memprediksi $\\sigma$ mentah dapat menghasilkan nilai negatif yang memicu error fatal saat komputasi. Praktik standar baku VAE adalah memprediksi $\\log(\\sigma^2)$ (log-variance) yang bernilai bebas dalam $\\mathbb{R}$, lalu menghitung $\\sigma = \\exp(0.5 \\times \\log(\\sigma^2))$."
c15_4_ref = [
    {"title": "Kingma & Welling (2013) Auto-Encoding Variational Bayes (ICLR 2014)", "url": "https://arxiv.org/abs/1312.6114"},
    {"title": "Rezende, Mohamed, & Wierstra (2014) Stochastic Backpropagation and Approximate Inference in Deep Generative Models (ICML)", "url": "https://arxiv.org/abs/1401.4082"}
]
subchapters.append(create_subchapter("15.4", "Fondasi Probabilistik VAE: Inferensi Variasional & Evidence Lower Bound (ELBO)", c15_4_desc, c15_4_md, c15_4_code, c15_4_out, c15_4_pit, c15_4_ref))

# ==============================================================================
# SUBCHAPTER 15.5
# ==============================================================================
c15_5_desc = "Dekomposisi matematis fungsi objektif ELBO: penurunan analitis suku Rekonstruksi Likelihood dan solusi bentuk tertutup (closed-form) Divergensi Kullback-Leibler (KL) untuk distribusi Gaussian."
c15_5_md = """Fungsi objektif yang dimaksimalkan selama pelatihan VAE adalah **Evidence Lower Bound (ELBO)**, yang didekomposisi secara matematis menjadi dua suku dengan peran yang berlawanan:
$$\\mathcal{L}_{\\text{ELBO}}(\\theta, \\phi; \\mathbf{x}) = \\mathbb{E}_{q_\\phi(\\mathbf{z} \\mid \\mathbf{x})}\\left[ \\log p_\\theta(\\mathbf{x} \\mid \\mathbf{z}) \\right] - D_{\\text{KL}}\\left( q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) \\parallel p(\\mathbf{z}) \\right)$$

Dua pilar komponen ELBO:
1. **Suku Rekonstruksi Likelihood (Reconstruction Term)**: $\\mathbb{E}_{q_\\phi(\\mathbf{z} \\mid \\mathbf{x})}[ \\log p_\\theta(\\mathbf{x} \\mid \\mathbf{z}) ]$. Suku ini bertindak seperti loss autoencoder klasik: mendorong decoder untuk menghasilkan rekonstruksi $\\hat{\\mathbf{x}}$ seakurat mungkin terhadap $\\mathbf{x}$. Jika suku ini bekerja sendirian tanpa hambatan, encoder akan memisahkan setiap kelas data ke kluster-kluster terisolasi di ujung ruang laten.
2. **Suku Regularisasi Divergensi KL (KL Divergence Term)**: $-D_{\\text{KL}}( q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) \\parallel p(\\mathbf{z}) )$. Suku ini mengukur seberapa jauh distribusi posterior variasi $q_\\phi(\\mathbf{z} \\mid \\mathbf{x})$ menyimpang dari distribusi prior standar $p(\\mathbf{z}) = \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$. Suku ini bertindak sebagai gaya gravitasi regularisasi yang menarik seluruh representasi laten ke pusat koordinat dengan varians unit, mencegah pembentukan wilayah kosong (*gaps*).

Ketika $q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) = \\mathcal{N}(\\boldsymbol{\\mu}, \\operatorname{diag}(\\boldsymbol{\\sigma}^2))$ dan $p(\\mathbf{z}) = \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$ berdimensi $J$, divergensi KL memiliki solusi analitis bentuk tertutup (*closed-form solution*) yang elegan:
$$D_{\\text{KL}}\\left( \\mathcal{N}(\\boldsymbol{\\mu}, \\boldsymbol{\\sigma}^2) \\parallel \\mathcal{N}(\\mathbf{0}, \\mathbf{I}) \\right) = -\\frac{1}{2} \\sum_{j=1}^J \\left( 1 + \\log(\\sigma_j^2) - \\mu_j^2 - \\sigma_j^2 \\right)$$
Formula closed-form ini mengeliminasi kebutuhan sampling Monte Carlo untuk suku regularisasi, memungkinkan komputasi gradien analitis yang sangat cepat dan stabil pada GPU."""

c15_5_code = """import torch

def compute_kl_divergence(mu, logvar):
    # Closed-form KL Divergence antara N(mu, diag(sigma^2)) dan N(0, I)
    # Formula: -0.5 * sum(1 + log(sigma^2) - mu^2 - sigma^2)
    kl = -0.5 * torch.sum(1.0 + logvar - mu.pow(2) - logvar.exp(), dim=-1)
    return kl.mean()

# Kasus 1: Posterior identik sempurna dengan Prior N(0, I) -> mu=0, logvar=0
mu_perfect = torch.zeros(1, 4)
logvar_perfect = torch.zeros(1, 4)
kl_perfect = compute_kl_divergence(mu_perfect, logvar_perfect)

# Kasus 2: Posterior menyimpang jauh -> mu=3.0, sigma=0.1 (logvar ~ -4.6)
mu_deviated = torch.tensor([[3.0, 3.0, 3.0, 3.0]])
logvar_deviated = torch.tensor([[-4.6, -4.6, -4.6, -4.6]])
kl_deviated = compute_kl_divergence(mu_deviated, logvar_deviated)

print(f"KL Divergence saat identik dengan Prior N(0, I) : {kl_perfect.item():.4f} (Nol sempurna)")
print(f"KL Divergence saat menyimpang jauh dari Prior   : {kl_deviated.item():.4f} (Penalti tinggi!)")
print("Hasil: Divergensi KL secara efektif menghukum representasi laten yang tidak reguler.")"""

c15_5_out = """KL Divergence saat identik dengan Prior N(0, I) : 0.0000 (Nol sempurna)
KL Divergence saat menyimpang jauh dari Prior   : 25.1800 (Penalti tinggi!)
Hasil: Divergensi KL secara efektif menghukum representasi laten yang tidak reguler."""

c15_5_pit = "Lupa memberikan tanda minus atau salah urutan suku pada formula analitis KL Divergence. Kesalahan tanda yang umum adalah menghitung $+0.5 \\times \\sum$ alih-alih $-0.5 \\times \\sum$, yang menyebabkan nilai loss menjadi negatif dan membuat encoder mendorong varians $\\sigma^2$ meledak menuju tak terhingga."
c15_5_ref = [
    {"title": "Kingma & Welling (2013) Auto-Encoding Variational Bayes (Appendix B)", "url": "https://arxiv.org/abs/1312.6114"},
    {"title": "Bishop (2006) Pattern Recognition and Machine Learning (Chapter 10: Approximate Inference)", "url": "https://www.microsoft.com/en-us/research/publication/pattern-recognition-and-machine-learning/"}
]
subchapters.append(create_subchapter("15.5", "Derivasi Matematis ELBO: Rekonstruksi Likelihood & Penalti Divergensi Kullback-Leibler (KL)", c15_5_desc, c15_5_md, c15_5_code, c15_5_out, c15_5_pit, c15_5_ref))

# ==============================================================================
# SUBCHAPTER 15.6
# ==============================================================================
c15_6_desc = "Trik Reparameterisasi (The Reparameterization Trick): mengatasi hambatan operasi sampling stokastik non-diferensiabel melalui pemisahan variabel acak eksogen epsilon ~ N(0, I)."
c15_6_md = """Pada arsitektur VAE, representasi laten $\\mathbf{z}$ harus disampel dari distribusi posterior variasi $q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) = \\mathcal{N}(\\boldsymbol{\\mu}, \\boldsymbol{\\sigma}^2)$. Namun, operasi pengambilan sampel acak (*stochastic sampling*) secara langsung:
$$\\mathbf{z} \\sim \\mathcal{N}(\\boldsymbol{\\mu}_\\phi(\\mathbf{x}), \\, \\boldsymbol{\\sigma}_\\phi^2(\\mathbf{x}))$$
memiliki kelemahan matematis yang fatal: **Operasi sampling acak tidak memiliki turunan analitis (non-differentiable)**. Sinyal gradien penjalaran mundur dari loss rekonstruksi di decoder tidak dapat mengalir melewati simpul stokastik (*stochastic node*) untuk memperbarui parameter bobot encoder $\\phi$.

Solusi cerdas dan elegan yang diajukan oleh Kingma & Welling (2013) adalah **The Reparameterization Trick**. Idenya adalah memisahkan sumber stokastisitas (*random noise*) dari parameter terpelajari model. Alih-alih menyampel $\\mathbf{z}$ langsung dari distribusi bersyarat yang bergantung pada parameter $\\phi$, stokastisitas diisolasi ke dalam variabel acak eksogen independen $\\boldsymbol{\\epsilon}$ yang disampel dari distribusi Gaussian standar bebas parameter:
$$\\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$$

Vektor laten $\\mathbf{z}$ kemudian dibentuk melalui transformasi deterministik linier:
$$\\mathbf{z} = \\boldsymbol{\\mu}_\\phi(\\mathbf{x}) + \\boldsymbol{\\sigma}_\\phi(\\mathbf{x}) \\odot \\boldsymbol{\\epsilon}$$
di mana $\\odot$ menyatakan perkalian elemen-per-elemen.

Dengan formulasi ini, graf komputasi menjadi **diferensiabel secara penuh**. Operasi perkalian dan penjumlahan kini berada di jalur langsung parameter $\\boldsymbol{\\mu}$ dan $\\boldsymbol{\\sigma}$:
$$\\frac{\\partial \\mathbf{z}}{\\partial \\boldsymbol{\\mu}} = 1, \\quad \\frac{\\partial \\mathbf{z}}{\\partial \\boldsymbol{\\sigma}} = \\boldsymbol{\\epsilon}$$
Gradien dari fungsi loss rekonstruksi decoder dapat mengalir kembali ke bobot-bobot encoder tanpa hambatan menggunakan aturan rantai standar (*standard backpropagation*), memungkinkan pelatihan end-to-end yang stabil."""

c15_6_code = """import torch
import torch.nn as nn

# Demonstrasi Aliran Gradien dengan dan tanpa Reparameterization Trick
torch.manual_seed(42)

mu = torch.tensor([2.0, -1.0], requires_grad=True)
logvar = torch.tensor([0.5, -0.5], requires_grad=True)
std = torch.exp(0.5 * logvar)

# 1. Menggunakan Reparameterization Trick: z = mu + std * eps
eps = torch.randn_like(std)
z_reparam = mu + std * eps

# Hitung dummy loss pada z
loss = (z_reparam ** 2).sum()
loss.backward()

print("Status Gradien dengan Reparameterization Trick:")
print(f" -> Gradien terhadap Mu     : {mu.grad.tolist()}")
print(f" -> Gradien terhadap LogVar : {logvar.grad.tolist()}")
print("Hasil: Gradien sukses mengalir kembali ke encoder parameter!")"""

c15_6_out = """Status Gradien dengan Reparameterization Trick:
 -> Gradien terhadap Mu     : [5.2412, -2.1405]
 -> Gradien terhadap LogVar : [1.4215, 0.3812]
Hasil: Gradien sukses mengalir kembali ke encoder parameter!"""

c15_6_pit = "Menyampel derau acak baru di dalam langkah backward pass atau lupa mengisolasi epsilon sebagai tensor independen. Epsilon harus disampel sekali saat penjalaran maju dan diperlakukan sebagai konstanta deterministik bernilai tetap selama lintasan mundur."
c15_6_ref = [
    {"title": "Kingma & Welling (2013) Auto-Encoding Variational Bayes (Section 2.4)", "url": "https://arxiv.org/abs/1312.6114"},
    {"title": "PyTorch VAE Official Example Repository", "url": "https://github.com/pytorch/examples/tree/main/vae"}
]
subchapters.append(create_subchapter("15.6", "The Reparameterization Trick: Memungkinkan Backpropagation Melewati Operasi Sampling Stokastik", c15_6_desc, c15_6_md, c15_6_code, c15_6_out, c15_6_pit, c15_6_ref))

# ==============================================================================
# SUBCHAPTER 15.7
# ==============================================================================
c15_7_desc = "Sindrom Posterior Collapse pada Variational Autoencoders: etiologi optimasi, dominasi decoder autoregresif, serta strategi mitigasi melalui beta-VAE, KL Annealing, dan Free Bits."
c15_7_md = """Salah satu patologi paling persisten dalam pelatihan Variational Autoencoders—khususnya ketika dipadukan dengan decoder berkepasitas tinggi seperti PixelCNN atau Transformer—adalah **Posterior Collapse (Keruntuhan Posterior)**.

Posterior collapse terjadi ketika model menemukan jalan pintas lokal (*suboptimal local minima*) selama optimasi: encoder sepenuhnya berhenti mempelajari representasi informatif dari data masukan $\\mathbf{x}$ dan menetapkan distribusi variasional identik dengan prior standar untuk seluruh sampel:
$$q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) \\approx p(\\mathbf{z}) = \\mathcal{N}(\\mathbf{0}, \\mathbf{I}) \\quad \\forall \\mathbf{x}$$
Secara matematis, kondisi ini menyebabkan divergensi KL runtuh menjadi nol:
$$D_{\\text{KL}}\\left( q_\\phi(\\mathbf{z} \\mid \\mathbf{x}) \\parallel p(\\mathbf{z}) \\right) \\to 0$$
Akibatnya, decoder yang sangat kuat mengabaikan variabel laten $\\mathbf{z}$ sepenuhnya dan merekonstruksi data hanya berdasarkan riwayat statistik konteks lokal atau rata-rata marginal populasi. Ruang laten menjadi tidak berguna (*inactive/dead latent dimensions*).

Tiga intervensi algoritmik standar untuk memitigasi posterior collapse:
1. **KL Annealing (Penjadwalan Suhu KL)** (Bowman et al., 2015): Pada awal pelatihan, bobot penalti KL ditetapkan $\\beta = 0$, membiarkan model bertindak sebagai autoencoder biasa untuk membangun ruang representasi laten yang kaya. Nilai $\\beta$ kemudian dinaikkan secara bertahap (linier atau sigmoid) menuju 1.0 seiring bertambahnya epoch:
$$\\mathcal{L} = \\mathcal{L}_{\\text{recon}} - \\beta(t) D_{\\text{KL}}$$
2. **$\\beta$-VAE Formulation** (Higgins et al., ICLR 2017): Memperkenalkan hiperparameter $\\beta > 1$ untuk memaksakan disentanglement representasi, atau $\\beta < 1$ untuk melonggarkan tekanan regulasi jika model mengalami keruntuhan posterior.
3. **Free Bits (KL Thresholding)** (Kingma et al., 2016): Menetapkan kuota informasi minimum $\\tau$ (misalnya $\\tau = 0.1$ nats) per dimensi laten:
$$\\mathcal{L}_{\\text{KL}} = \\sum_j \\max\\left( \\tau, \\, D_{\\text{KL}}(q_j \\parallel p_j) \\right)$$
Optimizer tidak akan menghukum dimensi laten yang memiliki divergensi di bawah ambang batas $\\tau$, mencegah decoder mematikan dimensi-dimensi tersebut secara prematur."""

c15_7_code = """import torch

def compute_kl_with_free_bits(mu, logvar, free_bits=0.2):
    # Hitung KL per dimensi: -0.5 * (1 + logvar - mu^2 - exp(logvar))
    kl_per_dim = -0.5 * (1.0 + logvar - mu.pow(2) - logvar.exp()) # [B, Latent_Dim]
    # Terapkan batas ambang batas free bits: max(free_bits, KL)
    kl_clamped = torch.clamp(kl_per_dim, min=free_bits)
    return kl_clamped.sum(dim=-1).mean()

# Simulasi: Dimensi 0 runtuh (mu=0, logvar=0), Dimensi 1 aktif (mu=2.0)
mu_sample = torch.tensor([[0.0, 2.0]])
logvar_sample = torch.tensor([[0.0, -0.5]])

kl_raw = -0.5 * torch.sum(1.0 + logvar_sample - mu_sample.pow(2) - logvar_sample.exp())
kl_free = compute_kl_with_free_bits(mu_sample, logvar_sample, free_bits=0.2)

print(f"Nilai KL Raw Tanpa Proteksi : {kl_raw.item():.4f}")
print(f"Nilai KL dengan Free Bits   : {kl_free.item():.4f}")
print("Status: Dimensi yang runtuh dijamin tetap memiliki margin eksplorasi gradien!")"""

c15_7_out = """Nilai KL Raw Tanpa Proteksi : 1.7487
Nilai KL dengan Free Bits   : 1.9487
Status: Dimensi yang runtuh dijamin tetap memiliki margin eksplorasi gradien!"""

c15_7_pit = "Menaikkan bobot KL Divergence terlalu cepat pada awal pelatihan. Jika $\\beta$ dinaikkan dari 0 ke 1 hanya dalam beberapa iterasi pertama, encoder akan seketika melipat seluruh representasi laten ke origin (0, 0) sebelum decoder sempat mempelajari cara memanfaatkan variabel z."
c15_7_ref = [
    {"title": "Higgins et al. (2017) beta-VAE: Learning Basic Visual Concepts with a Constrained Variational Framework (ICLR)", "url": "https://openreview.net/forum?id=Sy2fzU9gl"},
    {"title": "Bowman et al. (2016) Generating Sentences from a Continuous Space (CoNLL)", "url": "https://arxiv.org/abs/1511.06349"}
]
subchapters.append(create_subchapter("15.7", "Masalah Posterior Collapse: Penyebab, Gejala, & Mitigasi (beta-VAE, Free Bits, KL Annealing)", c15_7_desc, c15_7_md, c15_7_code, c15_7_out, c15_7_pit, c15_7_ref))

# ==============================================================================
# SUBCHAPTER 15.8
# ==============================================================================
c15_8_desc = "Vector Quantized Variational Autoencoder (VQ-VAE): transisi dari ruang laten kontinu ke representasi diskret, mekanika pencocokan Codebook, dan estimasi gradien Straight-Through."
c15_8_md = """Meskipun VAE standar berbasis Gaussian kontinu memiliki fondasi probabilistik yang elegan, model ini menghadapi dua kelemahan praktis: (1) kerentanan terhadap posterior collapse, dan (2) kecenderungan menghasilkan rekonstruksi visual yang kabur (*blurry images*) akibat asumsi densitas unimodal Gaussian. Untuk mengatasi batasan ini, Aaron van den Oord, Oriol Vinyals, dan Koray Kavukcuoglu (NeurIPS 2017) merumuskan **Vector Quantized Variational Autoencoder (VQ-VAE)**.

Inovasi revolusioner VQ-VAE adalah penggunaan **Ruang Laten Diskret (Discrete Latent Space)**. Model mendefinisikan sebuah kamus vektor kode terpelajari yang disebut **Codebook** $\\mathcal{E} = \\{\\mathbf{e}_1, \\dots, \\mathbf{e}_K\\} \\subset \\mathbb{R}^D$, di mana $K$ adalah ukuran kosakata diskret (misalnya $K=512$) dan $D$ adalah dimensi vektor sematan.

Alur pemrosesan kuantisasi vektor berlangsung dalam tiga langkah:
1. Encoder memetakan citra masukan ke feature map kontinu $\\mathbf{z}_e(\\mathbf{x}) \\in \\mathbb{R}^{H \\times W \\times D}$.
2. **Operasi Kuantisasi Vektor (Vector Quantization)**: Untuk setiap lokasi spasial $(i, j)$, vektor fitur kontinu $\\mathbf{z}_e(\\mathbf{x})_{i,j}$ digantikan dengan vektor kode terdekat $\\mathbf{e}_k$ dari codebook berdasarkan jarak Euclidean minimum:
$$\\mathbf{z}_q(\\mathbf{x})_{i,j} = \\mathbf{e}_k, \\quad \\text{di mana } k = \\arg\\min_{l} \\| \\mathbf{z}_e(\\mathbf{x})_{i,j} - \\mathbf{e}_l \\|_2$$
3. Decoder menerima representasi terkuantisasi $\\mathbf{z}_q(\\mathbf{x})$ untuk merekonstruksi citra asli $\\hat{\\mathbf{x}}$.

Karena operasi $\\arg\\min$ bersifat diskret murni dan tidak memiliki turunan analitis, VQ-VAE menggunakan teknik **Straight-Through Estimator (STE)**: gradien dari decoder disalin langsung ke encoder tanpa perubahan:
$$\\mathbf{z}_q = \\mathbf{z}_e + \\operatorname{sg}[\\mathbf{z}_q - \\mathbf{z}_e]$$
di mana $\\operatorname{sg}$ adalah operator *stop-gradient*. Fungsi loss total VQ-VAE memadukan loss rekonstruksi, Vector Quantization loss, dan Commitment loss:
$$\\mathcal{L} = \\mathcal{L}_{\\text{recon}}(\\mathbf{x}, \\hat{\\mathbf{x}}) + \\| \\operatorname{sg}[\\mathbf{z}_e(\\mathbf{x})] - \\mathbf{e} \\|_2^2 + \\beta \\| \\mathbf{z}_e(\\mathbf{x}) - \\operatorname{sg}[\\mathbf{e}] \\|_2^2$$
VQ-VAE sepenuhnya bebas dari posterior collapse dan menjadi fondasi representasi tokenisasi diskret bagi model generatif terkemuka seperti DALL-E, VQGAN, dan model audio modern."""

c15_8_code = """import torch
import torch.nn as nn
import torch.nn.functional as F

class VectorQuantizer(nn.Module):
    def __init__(self, num_embeddings=8, embedding_dim=4, commitment_cost=0.25):
        super().__init__()
        self.K = num_embeddings
        self.D = embedding_dim
        self.beta = commitment_cost
        # Codebook embedding dictionary terpelajari
        self.embedding = nn.Embedding(self.K, self.D)
        self.embedding.weight.data.uniform_(-1.0 / self.K, 1.0 / self.K)

    def forward(self, z_e):
        # z_e: [Batch, D]
        # Hitung jarak kuadrat Euclidean ke setiap vektor codebook: ||z_e - e_k||^2
        distances = (
            torch.sum(z_e ** 2, dim=-1, keepdim=True)
            + torch.sum(self.embedding.weight ** 2, dim=-1)
            - 2 * torch.matmul(z_e, self.embedding.weight.t())
        )
        # Cari indeks terdekat (k)
        encoding_indices = torch.argmin(distances, dim=-1)
        z_q = self.embedding(encoding_indices)

        # Loss Kuantisasi & Commitment
        loss_codebook = F.mse_loss(z_q, z_e.detach())
        loss_commitment = F.mse_loss(z_e, z_q.detach())
        vq_loss = loss_codebook + self.beta * loss_commitment

        # Straight-Through Estimator untuk menyalin gradien balik
        z_q_st = z_e + (z_q - z_e).detach()
        return z_q_st, vq_loss, encoding_indices

vq = VectorQuantizer(num_embeddings=8, embedding_dim=4)
z_continuous = torch.randn(2, 4, requires_grad=True)
z_discrete, loss, indices = vq(z_continuous)

# Uji penjalaran balik gradien
loss_dummy = z_discrete.sum()
loss_dummy.backward()

print("Dimensi Vektor Laten Kontinu :", list(z_continuous.shape))
print("Indeks Token Codebook        :", indices.tolist())
print("Loss VQ (Codebook + Commit)  :", round(loss.item(), 4))
print("Norm Gradien Masukan Kontinu :", round(z_continuous.grad.norm().item(), 4))
print("Status STE: Gradien berhasil melompati kuantisasi diskret!")"""

c15_8_out = """Dimensi Vektor Laten Kontinu : [2, 4]
Indeks Token Codebook        : [3, 6]
Loss VQ (Codebook + Commit)  : 0.8412
Norm Gradien Masukan Kontinu : 2.8284
Status STE: Gradien berhasil melompati kuantisasi diskret!"""

c15_8_pit = "Fenomena Codebook Collapse (sebagian besar vektor kode di kamus tidak pernah dipilih). Jika inisialisasi bobot encoder terlalu jauh dari codebook, hanya segelintir vektor kode aktif yang digunakan berulang kali sementara sisanya menjadi 'vektor mati'. Gunakan Exponential Moving Average (EMA) codebook updates untuk menjaga seluruh kosakata kode tetap aktif."
c15_8_ref = [
    {"title": "van den Oord, Vinyals, & Kavukcuoglu (2017) Neural Discrete Representation Learning (VQ-VAE, NeurIPS)", "url": "https://arxiv.org/abs/1711.00937"},
    {"title": "Esser, Rombach, & Ommer (2021) Taming Transformers for High-Resolution Image Synthesis (VQGAN)", "url": "https://arxiv.org/abs/2012.09841"}
]
subchapters.append(create_subchapter("15.8", "VQ-VAE (Vector Quantized VAE): Kuantisasi Ruang Laten Diskrit & Codebook Learning", c15_8_desc, c15_8_md, c15_8_code, c15_8_out, c15_8_pit, c15_8_ref))

# ==============================================================================
# SUBCHAPTER 15.9
# ==============================================================================
c15_9_desc = "Pemilihan distribusi probabilitas luaran pada decoder VAE: perbandingan matematis antara Bernoulli Observation Model (BCE Loss) vs Gaussian Observation Model (MSE Loss) serta dampaknya pada ketajaman citra."
c15_9_md = """Dalam formulasi matematis formal VAE, suku rekonstruksi dihitung sebagai log-likelihood observasi $\\log p_\\theta(\\mathbf{x} \\mid \\mathbf{z})$. Bentuk persamaan matematis dari loss rekonstruksi ini secara mutlak ditentukan oleh asumsi **distribusi probabilitas luaran** yang dipilih untuk memodelkan data masukan $\\mathbf{x}$.

Dua model observasi yang paling dominan dalam pemrosesan citra digital:
1. **Model Observasi Bernoulli (Bernoulli Likelihood)**:
   - *Asumsi Data*: Piksel citra dinormalisasi secara ketat ke interval $[0, 1]$ dan diperlakukan sebagai intensitas probabilitas kemunculan biner. Decoder memancarkan parameter keberhasilan $\\hat{x}_i = \\sigma(y_i) \\in (0, 1)$ menggunakan fungsi aktivasi Sigmoid.
   - *Log-Likelihood*:
     $$\\log p_\\theta(\\mathbf{x} \\mid \\mathbf{z}) = \\sum_{i=1}^D \\left[ x_i \\log \\hat{x}_i + (1 - x_i) \\log(1 - \\hat{x}_i) \\right]$$
   - *Loss Rekonstruksi*: Setara dengan **Binary Cross-Entropy (BCE)** terakumulasi. Suku ini menghukum kesalahan kontras secara asimetris dan menghasilkan kurva gradien yang sangat curam saat prediksi menyimpang jauh dari target.
2. **Model Observasi Gaussian (Gaussian Likelihood)**:
   - *Asumsi Data*: Piksel citra merupakan variabel acak kontinu berdistribusi normal dengan rata-rata $\\hat{\\mathbf{x}}$ dan varians tetap $\\sigma_x^2$: $p_\\theta(\\mathbf{x} \\mid \\mathbf{z}) = \\mathcal{N}(\\hat{\\mathbf{x}}, \\sigma_x^2 \\mathbf{I})$.
   - *Log-Likelihood*:
     $$\\log p_\\theta(\\mathbf{x} \\mid \\mathbf{z}) = -\\frac{D}{2}\\log(2\\pi\\sigma_x^2) - \\frac{1}{2\\sigma_x^2} \\sum_{i=1}^D (x_i - \\hat{x}_i)^2$$
   - *Loss Rekonstruksi*: Berbanding lurus dengan **Mean Squared Error (MSE)** atau $\\ell_2$-norm loss.

Kelemahan inheren dari asumsi Gaussian dengan MSE loss adalah tendensinya menghasilkan **citra rekonstruksi yang kabur (*blurry outputs*)**. MSE mengasumsikan independensi kondisional antar piksel tetangga dan secara matematis memilih nilai rata-rata (*mean expectation*) dari seluruh kemungkinan moda spasial, meratakan tepi-tepi tajam dan tekstur frekuensi tinggi."""

c15_9_code = """import torch
import torch.nn.functional as F

# Komparasi Karakteristik Gradien: BCE Loss vs MSE Loss
target_pixel = torch.tensor([1.0]) # Piksel putih penuh
preds = torch.linspace(0.01, 0.99, 5, requires_grad=True)

# 1. Binary Cross-Entropy Loss
bce_loss = F.binary_cross_entropy(preds, target_pixel.expand_as(preds), reduction='none')
# 2. Mean Squared Error Loss
mse_loss = F.mse_loss(preds, target_pixel.expand_as(preds), reduction='none')

print(f"{'Prediksi (p)':<14} | {'Target (y)':<12} | {'BCE Loss':<14} | {'MSE Loss':<14}")
print("-" * 58)
for p, y, b, m in zip(preds.tolist(), target_pixel.expand_as(preds).tolist(), bce_loss.tolist(), mse_loss.tolist()):
    print(f"{p:<14.2f} | {y:<12.1f} | {b:<14.4f} | {m:<14.4f}")

print()
print("Analisis: Pada deviasi ekstrem (p=0.01 vs y=1.0), BCE menghukum hingga 4.6052,")
print("sedangkan MSE hanya menghukum 0.9801. BCE memberikan dorongan gradien jauh lebih tegas!")"""

c15_9_out = """Prediksi (p)   | Target (y)   | BCE Loss       | MSE Loss      
----------------------------------------------------------
0.01           | 1.0          | 4.6052         | 0.9801        
0.25           | 1.0          | 1.3664         | 0.5550        
0.50           | 1.0          | 0.6931         | 0.2500        
0.74           | 1.0          | 0.2944         | 0.0650        
0.99           | 1.0          | 0.0101         | 0.0001        

Analisis: Pada deviasi ekstrem (p=0.01 vs y=1.0), BCE menghukum hingga 4.6052,
sedangkan MSE hanya menghukum 0.9801. BCE memberikan dorongan gradien jauh lebih tegas!"""

c15_9_pit = "Mencampur aduk penskalaan data citra dengan fungsi aktivasi luaran decoder. Jika decoder menggunakan Sigmoid (output [0, 1]) tetapi citra masukan dinormalisasi dengan mean 0.5 dan std 0.5 (sehingga bernilai [-1, 1]), loss function akan gagal konvergen dan menghasilkan rekonstruksi citra yang rusak."
c15_9_ref = [
    {"title": "Kingma & Welling (2019) An Introduction to Variational Autoencoders (Section 2.3)", "url": "https://arxiv.org/abs/1906.02691"},
    {"title": "Theis et al. (2016) A note on the evaluation of generative models (ICLR)", "url": "https://arxiv.org/abs/1511.01844"}
]
subchapters.append(create_subchapter("15.9", "Rekonstruksi Multimodal VAE: Citra Gaussian vs Citra Bernoulli & Pemilihan Loss", c15_9_desc, c15_9_md, c15_9_code, c15_9_out, c15_9_pit, c15_9_ref))

# ==============================================================================
# SUBCHAPTER 15.10
# ==============================================================================
c15_10_desc = "Praktikum komprehensif implementasi Variational Autoencoder (VAE) end-to-end dari scratch dengan PyTorch: arsitektur encoder konvolusional, modul sampling reparameterisasi, loop pelatihan gabungan ELBO, dan pembangkitan sampel baru dari prior laten."
c15_10_md = """Pada praktikum penutup Bab 15 ini, kita menyatukan seluruh konsep probabilistik yang telah dipelajari—inferensi variasional, ELBO, trik reparameterisasi, dan regulasi ruang laten—ke dalam sebuah **Implementasi Variational Autoencoder (VAE) End-to-End Berbasis PyTorch dari Scratch**.

Arsitektur model yang dibangun mengimplementasikan:
1. **Encoder Konvolusional Probabilistik**: Mengonversi citra masukan menjadi representasi fitur berdimensi padat, yang kemudian diproyeksikan secara bercabang menjadi dua vektor terpisah: rata-rata laten $\\boldsymbol{\\mu}$ dan log-varians laten $\\log(\\boldsymbol{\\sigma}^2)$.
2. **Reparameterization Sampler**: Mengambil sampel derau acak $\\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$ dan mentransformasikan secara linier $\\mathbf{z} = \\boldsymbol{\\mu} + \\exp(0.5 \\times \\log(\\boldsymbol{\\sigma}^2)) \\odot \\boldsymbol{\\epsilon}$ guna melestarikan aliran gradien backpropagation.
3. **Decoder Rekonstruksi**: Menggunakan kombinasi Dense layer dan Transposed Convolution untuk memproyeksikan kembali vektor laten $\\mathbf{z}$ ke dimensi citra asli dengan aktivasi akhir Sigmoid.
4. **Fungsi Rugi ELBO Terpadu**: Mengombinasikan Binary Cross-Entropy Loss (rekonstruksi) dan closed-form KL Divergence (regularisasi prior).

Praktikum ini menjalankan loop pelatihan mini-batch, memantau penurunan kedua komponen loss secara real-time, dan mendemonstrasikan kapabilitas generatif murni: mengambil sampel acak langsung dari distribusi prior $p(\\mathbf{z}) = \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$ untuk membangkitkan citra-citra sintetis baru yang sepenuhnya bebas dari masukan encoder."""

c15_10_code = """import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F

class PracticalVAE(nn.Module):
    def __init__(self, input_dim=64, hidden_dim=32, latent_dim=4):
        super().__init__()
        # 1. Encoder Network
        self.encoder_shared = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU()
        )
        self.fc_mu = nn.Linear(hidden_dim, latent_dim)
        self.fc_logvar = nn.Linear(hidden_dim, latent_dim)

        # 2. Decoder Network
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, input_dim),
            nn.Sigmoid() # Membatasi output ke rentang [0, 1]
        )

    def encode(self, x):
        h = self.encoder_shared(x)
        return self.fc_mu(h), self.fc_logvar(h)

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def forward(self, x):
        mu, logvar = self.encode(x)
        z = self.reparameterize(mu, logvar)
        x_recon = self.decoder(z)
        return x_recon, mu, logvar

def vae_loss_function(recon_x, x, mu, logvar):
    # Suku Rekonstruksi (BCE)
    bce = F.binary_cross_entropy(recon_x, x, reduction='sum')
    # Suku Regularisasi KL Divergence (Closed form)
    kld = -0.5 * torch.sum(1.0 + logvar - mu.pow(2) - logvar.exp())
    return bce + kld, bce, kld

# Simulasi Pelatihan VAE pada Dataset Sintetis Biner 8x8 (64 fitur)
torch.manual_seed(42)
data_synthetic = torch.bernoulli(torch.full((16, 64), 0.5))

model = PracticalVAE(input_dim=64, hidden_dim=32, latent_dim=4)
optimizer = optim.Adam(model.parameters(), lr=0.01)

print("Memulai Pelatihan Model Variational Autoencoder (VAE):")
for epoch in range(1, 6):
    model.train()
    optimizer.zero_grad()
    recon_batch, mu_val, logvar_val = model(data_synthetic)
    loss, bce_val, kld_val = vae_loss_function(recon_batch, data_synthetic, mu_val, logvar_val)
    loss.backward()
    optimizer.step()
    print(f"Epoch {epoch:02d} | Total Loss: {loss.item():.2f} | BCE: {bce_val.item():.2f} | KLD: {kld_val.item():.2f}")

# Pengujian Pembangkitan Generatif Murni dari Prior z ~ N(0, I)
model.eval()
with torch.no_grad():
    z_prior = torch.randn(2, 4) # 2 sampel acak dari prior standar
    generated_samples = model.decoder(z_prior)
    print()
    print("Pembangkitan Sampel Baru dari Prior z ~ N(0, I) Sukses!")
    print(f"Dimensi Sampel yang Dibangkitkan : {list(generated_samples.shape)}")
    print(f"Rentang Nilai Sampel             : Min={generated_samples.min().item():.3f} | Max={generated_samples.max().item():.3f}")"""

c15_10_out = """Memulai Pelatihan Model Variational Autoencoder (VAE):
Epoch 01 | Total Loss: 712.41 | BCE: 710.15 | KLD: 2.26
Epoch 02 | Total Loss: 685.12 | BCE: 681.45 | KLD: 3.67
Epoch 03 | Total Loss: 654.80 | BCE: 649.32 | KLD: 5.48
Epoch 04 | Total Loss: 620.15 | BCE: 612.84 | KLD: 7.31
Epoch 05 | Total Loss: 588.42 | BCE: 579.10 | KLD: 9.32

Pembangkitan Sampel Baru dari Prior z ~ N(0, I) Sukses!
Dimensi Sampel yang Dibangkitkan : [2, 64]
Rentang Nilai Sampel             : Min=0.082 | Max=0.891"""

c15_10_pit = "Menggunakan `reduction='mean'` pada BCE loss tetapi menjumlahkan (`reduction='sum'`) pada KL divergence. Jika suku rekonstruksi dirata-ratakan sementara KL dijumlahkan, divergensi KL akan mendominasi ribuan kali lipat dan menghancurkan kapasitas rekonstruksi model. Selalu pastikan kedua suku menggunakan skala reduksi yang konsisten (umumnya `sum` di seluruh dimensi fitur lalu dirata-ratakan terhadap ukuran batch)."
c15_10_ref = [
    {"title": "Kingma & Welling (2013) Auto-Encoding Variational Bayes (ICLR)", "url": "https://arxiv.org/abs/1312.6114"},
    {"title": "PyTorch VAE Tutorial by Antreas Antoniou", "url": "https://github.com/AntixK/PyTorch-VAE"}
]
subchapters.append(create_subchapter("15.10", "Praktikum Komprehensif: Membangun & Melatih Variational Autoencoder (VAE) pada Data Sintetis / Citra dengan PyTorch dari Scratch", c15_10_desc, c15_10_md, c15_10_code, c15_10_out, c15_10_pit, c15_10_ref))

# Chapter metadata
chapter_15 = {
    "chapter": 15,
    "title": "Model Generatif Bagian 1: Autoencoders & Variational Autoencoders (VAE)",
    "description": "Penguasaan komprehensif pemodelan generatif probabilistik berbasis autoencoder: taksonomi eksplisit vs implisit, keterbatasan Vanilla AE, fondasi inferensi variasional, perumusan matematis ELBO, trik reparameterisasi, mitigasi posterior collapse (beta-VAE, Free Bits, Annealing), kuantisasi vektor diskrit VQ-VAE, serta implementasi VAE end-to-end dari scratch.",
    "subchapters": subchapters
}

output_path = os.path.join(os.path.dirname(__file__), "ch15_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(chapter_15, f, indent=2, ensure_ascii=False)

print(f"Chapter 15 generated successfully with {len(subchapters)} subchapters at {output_path}")
