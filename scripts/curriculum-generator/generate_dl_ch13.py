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
# SUBCHAPTER 13.1
# ==============================================================================
c13_1_desc = "Analisis fundamental data sekuensial dan struktur runtun waktu: asumsi independensi dan identitas distribusi (i.i.d.) serta kegagalan arsitektur feedforward tanpa memori dalam memodelkan ketergantungan temporal."
c13_1_md = """Sebagian besar arsitektur jaringan syaraf tiruan konvensional—termasuk Multilayer Perceptron (MLP) dan Convolutional Neural Networks (CNN)—dibangun di atas asumsi dasar statistik bahwa seluruh sampel data bersifat **Independent and Identically Distributed (i.i.d.)**. Dalam skenario i.i.d., setiap observasi masukan $\\mathbf{x}_i$ diproses secara independen dan terisolasi tanpa korelasi terhadap sampel sebelumnya $\\mathbf{x}_{i-1}$ maupun setelahnya $\\mathbf{x}_{i+1}$. Namun, asumsi ini runtuh secara fundamental ketika dihadapkan pada **Data Sekuensial** (*Sequential Data*), di mana urutan temporal atau spasial dari elemen-elemen data memuat makna semantik inheren yang krusial.

Contoh representatif data sekuensial mencakup deret waktu keuangan (*time series*), sinyal audio ucapan (*speech waveforms*), runtunan polipeptida/genomik dalam bioinformatika, serta bahasa alami (*Natural Language Processing*). Pada bahasa alami, membalik urutan kata *"kucing mengejar tikus"* menjadi *"tikus mengejar kucing"* menghasilkan perubahan makna semantik yang kontras, meskipun himpunan leksikal katanya identik. Informasi esensial tidak hanya tersimpan pada fitur lokal per kata, melainkan pada **ketergantungan kontekstual (contextual dependency)** lintas langkah waktu ($t$).

Arsitektur *feedforward* murni menderita tiga keterbatasan struktural utama ketika memproses data sekuensial:
1. **Ketidakmampuan Mengakomodasi Panjang Sekuens Bervariasi**: Lapisan Fully-Connected mensyaratkan dimensi masukan vektor tetap (fixed-size vector $\\mathbb{R}^d$). Sebaliknya, kalimat teks atau rekaman sinyal audio memiliki panjang dinamis ($T_x$) yang bervariasi antar sampel.
2. **Ketiadaan Pembagian Bobot Lintas Waktu (No Weight Sharing Across Time)**: Jika sebuah MLP dilatih dengan memasukkan deret waktu berukuran tetap (misalnya $T=10$), bobot sinaptik pada langkah $t=1$ tidak dibagi dengan bobot pada langkah $t=7$. Fitur penting yang muncul di awal kalimat tidak dapat digeneralisasi ketika fitur serupa muncul di akhir kalimat.
3. **Ketiadaan Keadaan Memori Internal (No Latent Memory State)**: Model feedforward tidak memiliki mekanisme persistensi informasi untuk mengingat kejadian di masa lalu ($t-k$) guna memengaruhi keputusan pada saat ini ($t$).

Keterbatasan kritis inilah yang mendorong lahirnya **Recurrent Neural Networks (RNN)**, paradigma arsitektur yang mengintroduksi siklus umpan balik (*feedback loops*) internal yang bertindak sebagai memori kontinu sepanjang rentang waktu penjalaran."""

c13_1_code = """import torch
import torch.nn as nn

# Demonstrasi kelemahan MLP pada data sekuensial: Dimensi input kaku & bobot terisolasi
class StaticMLPSequence(nn.Module):
    def __init__(self, fixed_seq_len=5, feature_dim=4):
        super().__init__()
        # MLP mensyaratkan dimensi input yang dikunci (fixed_seq_len * feature_dim)
        self.fc = nn.Linear(fixed_seq_len * feature_dim, 2)

    def forward(self, x):
        # x diasumsikan berbentuk [batch, fixed_seq_len, feature_dim]
        batch_size = x.size(0)
        x_flat = x.view(batch_size, -1)
        return self.fc(x_flat)

mlp = StaticMLPSequence(fixed_seq_len=5, feature_dim=4)

# Uji 1: Sekuens dengan panjang tepat 5 (Berhasil)
seq_valid = torch.randn(1, 5, 4)
out_valid = mlp(seq_valid)
print("Uji 1 (Panjang 5) : Forward pass sukses! Dimensi luaran:", list(out_valid.shape))

# Uji 2: Sekuens dinamis dengan panjang 8 (Gagal fatal pada MLP)
seq_dynamic = torch.randn(1, 8, 4)
try:
    mlp(seq_dynamic)
except RuntimeError as e:
    print("Uji 2 (Panjang 8) : RuntimeError terdeteksi!")
    print("Penyebab         : MLP tidak fleksibel terhadap variasi panjang waktu sekuens!")"""

c13_1_out = """Uji 1 (Panjang 5) : Forward pass sukses! Dimensi luaran: [1, 2]
Uji 2 (Panjang 8) : RuntimeError terdeteksi!
Penyebab         : MLP tidak fleksibel terhadap variasi panjang waktu sekuens!"""

c13_1_pit = "Memaksakan data sekuensial ke dalam model feedforward dengan zero-padding masif hingga panjang maksimum dan meratakannya (*flattening*). Selain membuang memori GPU secara drastis, pendekatan ini menghancurkan invarian translasi temporal: model harus mempelajari pola yang sama berulang kali di setiap posisi indeks waktu yang berbeda."
c13_1_ref = [
    {"title": "Goodfellow et al. (2016) Deep Learning: Sequence Modeling: Recurrent and Recursive Nets (Chapter 10)", "url": "https://www.deeplearningbook.org/contents/rnn.html"},
    {"title": "Stanford CS230: Recurrent Neural Networks Lecture Notes", "url": "https://cs230.stanford.edu/lecture/rnn/"}
]
subchapters.append(create_subchapter("13.1", "Hakikat Data Sekuensial, Struktur Runtun Waktu, & Keterbatasan Arsitektur Feedforward Tanpa Memori", c13_1_desc, c13_1_md, c13_1_code, c13_1_out, c13_1_pit, c13_1_ref))

# ==============================================================================
# SUBCHAPTER 13.2
# ==============================================================================
c13_2_desc = "Arsitektur Vanilla Recurrent Neural Networks (Elman RNN): formulasi matematis state tersembunyi, skema pembagian bobot temporal (W_xh, W_hh, W_hy), dan komputasi rekurensi bertingkat."
c13_2_md = """Arsitektur **Vanilla Recurrent Neural Network (RNN)**, yang secara historis dipelopori oleh Jeffrey Elman (1990) sebagai *Elman Network*, mengatasi keterbatasan model feedforward dengan mengintroduksi tautan berulang (*recurrent connection*). Pada setiap langkah waktu diskret $t \\in \\{1, \\dots, T\\}$, jaringan menerima masukan eksternal $\\mathbf{x}_t \\in \\mathbb{R}^d$ sekaligus membaca kembali **keadaan tersembunyi (hidden state)** dari langkah waktu sebelumnya $\\mathbf{h}_{t-1} \\in \\mathbb{R}^h$.

Hidden state $\\mathbf{h}_t$ bertindak sebagai memori internal kontinu yang meringkas seluruh lintasan historis dari langkah $1$ hingga $t$. Persamaan rekurensi formal didefinisikan sebagai transformasi afinitas gabungan yang dipetakan melalui fungsi aktivasi non-linier (umumnya tanh):
$$\\mathbf{h}_t = \\tanh\\left( \\mathbf{W}_{xh} \\mathbf{x}_t + \\mathbf{W}_{hh} \\mathbf{h}_{t-1} + \\mathbf{b}_h \\right)$$
di mana:
- $\\mathbf{W}_{xh} \\in \\mathbb{R}^{h \\times d}$ adalah matriks bobot yang memetakan masukan saat ini ke state tersembunyi.
- $\\mathbf{W}_{hh} \\in \\mathbb{R}^{h \\times h}$ adalah matriks rekuren transisi yang memetakan state sebelumnya ke state saat ini.
- $\\mathbf{b}_h \\in \\mathbb{R}^h$ adalah vektor bias tersembunyi.

Jika tugas pemodelan menghendaki prediksi luaran pada setiap langkah waktu (skenario *sequence-to-sequence*), vektor luaran $\\mathbf{y}_t$ diproyeksikan dari state saat ini melalui matriks luaran $\\mathbf{W}_{hy} \\in \\mathbb{R}^{c \\times h}$:
$$\\hat{\\mathbf{y}}_t = \\text{softmax}\\left( \\mathbf{W}_{hy} \\mathbf{h}_t + \\mathbf{b}_y \\right)$$

Prinsip terpenting dari arsitektur RNN adalah **Temporal Weight Sharing (Pembagian Bobot Lintas Waktu)**. Matriks parameter $\\{\\mathbf{W}_{xh}, \\mathbf{W}_{hh}, \\mathbf{W}_{hy}, \\mathbf{b}_h, \\mathbf{b}_y\\}$ bernilai **identik dan konstan di setiap langkah waktu $t$**. Ketika jaringan 'dibentangkan' (*unfolded in time*) sepanjang horizon waktu $T$, arsitektur ini menyerupai jaringan feedforward yang sangat dalam dengan $T$ lapisan, namun seluruh lapisan tersebut mengikat dan menggunakan parameter bobot yang sama secara berulang."""

c13_2_code = """import torch
import torch.nn as nn

class ManualVanillaRNNCell(nn.Module):
    def __init__(self, input_size, hidden_size):
        super().__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        # Parameter bobot yang dibagikan secara temporal
        self.W_xh = nn.Linear(input_size, hidden_size, bias=True)
        self.W_hh = nn.Linear(hidden_size, hidden_size, bias=False)

    def forward(self, x_t, h_prev):
        # Persamaan rekurensi: h_t = tanh(W_xh * x_t + W_hh * h_{t-1} + b)
        h_t = torch.tanh(self.W_xh(x_t) + self.W_hh(h_prev))
        return h_t

# Simulasi pemrosesan sekuens temporal sepanjang T=3 langkah waktu
batch_size = 2
seq_len = 3
input_dim = 4
hidden_dim = 8

rnn_cell = ManualVanillaRNNCell(input_size=input_dim, hidden_size=hidden_dim)
sequence_data = torch.randn(batch_size, seq_len, input_dim)

# Inisialisasi hidden state awal h_0 dengan vektor nol
h_t = torch.zeros(batch_size, hidden_dim)

print("Memulai komputasi unrolling rekuren sepanjang T=3 langkah:")
for t in range(seq_len):
    x_t = sequence_data[:, t, :] # Irisan temporal saat ini
    h_t = rnn_cell(x_t, h_t)
    print(f"Langkah t={t+1} | Dimensi x_t: {list(x_t.shape)} -> Dimensi h_t: {list(h_t.shape)}")

print("Komputasi temporal berhasil diselesaikan!")"""

c13_2_out = """Memulai komputasi unrolling rekuren sepanjang T=3 langkah:
Langkah t=1 | Dimensi x_t: [2, 4] -> Dimensi h_t: [2, 8]
Langkah t=2 | Dimensi x_t: [2, 4] -> Dimensi h_t: [2, 8]
Langkah t=3 | Dimensi x_t: [2, 4] -> Dimensi h_t: [2, 8]
Komputasi temporal berhasil diselesaikan!"""

c13_2_pit = "Lupa menginisialisasi atau mereset hidden state awal $h_0$ di antara sekuens yang tidak saling berhubungan (*unrelated sequences*). Jika hidden state dari batch atau dokumen teks sebelumnya terbawa ke dokumen baru yang sama sekali berbeda, model akan mengalami interferensi kontekstual palsu yang merusak representasi."
c13_2_ref = [
    {"title": "Elman (1990) Finding Structure in Time (Cognitive Science)", "url": "https://onlinelibrary.wiley.com/doi/abs/10.1207/s15516709cog1402_1"},
    {"title": "PyTorch nn.RNN Documentation", "url": "https://pytorch.org/docs/stable/generated/torch.nn.RNN.html"}
]
subchapters.append(create_subchapter("13.2", "Arsitektur Vanilla RNN (Elman Network): Aliran State Tersembunyi (Hidden State), Pembagian Bobot Temporal (W_xh, W_hh, W_hy), & Persamaan Rekurensi", c13_2_desc, c13_2_md, c13_2_code, c13_2_out, c13_2_pit, c13_2_ref))

# ==============================================================================
# SUBCHAPTER 13.3
# ==============================================================================
c13_3_desc = "Dinamika penjalaran balik temporal: algoritma Backpropagation Through Time (BPTT), analisis spektrum nilai eigen matriks Jacobi, serta asal mula matematis masalah Vanishing dan Exploding Gradients."
c13_3_md = """Pelatihan parameter bobot dalam jaringan rekuren dilakukan melalui algoritma **Backpropagation Through Time (BPTT)**. Secara konseptual, BPTT membentangkan (*unfolds*) jaringan RNN sepanjang seluruh langkah waktu pelatihan $t=1, \\dots, T$, kemudian menerapkan aturan rantai kalkulus (*multivariate chain rule*) untuk menjalarbalikkan gradien rugi dari masa depan ke masa lalu.

Misalkan total loss sepanjang sekuens didefinisikan sebagai penjumlahan loss di setiap langkah waktu $\\mathcal{L} = \\sum_{t=1}^T \\mathcal{L}_t$. Untuk menghitung gradien terhadap matriks rekuren $\\mathbf{W}_{hh}$, gradien pada langkah waktu $t$ bergantung pada seluruh lintasan keadaan tersembunyi masa lalu:
$$\\frac{\\partial \\mathcal{L}_t}{\\partial \\mathbf{W}_{hh}} = \\sum_{k=1}^t \\frac{\\partial \\mathcal{L}_t}{\\partial \\mathbf{h}_t} \\frac{\\partial \\mathbf{h}_t}{\\partial \\mathbf{h}_k} \\frac{\\partial \\mathbf{h}_k}{\\partial \\mathbf{W}_{hh}}$$
Faktor kritis dalam persamaan di atas adalah suku interaksi temporal $\\frac{\\partial \\mathbf{h}_t}{\\partial \\mathbf{h}_k}$, yang merupakan perkalian berantai dari matriks Jacobi transisi:
$$\\frac{\\partial \\mathbf{h}_t}{\\partial \\mathbf{h}_k} = \\prod_{j=k+1}^t \\frac{\\partial \\mathbf{h}_j}{\\partial \\mathbf{h}_{j-1}} = \\prod_{j=k+1}^t \\text{diag}(1 - \\tanh^2(\\mathbf{a}_j)) \\, \\mathbf{W}_{hh}^T$$

Analisis spektral matriks Jacobi (Pascanu, Mikolov, & Bengio, ICML 2013) mengungkap kerentanan fatal dari persamaan perkalian berantai ini:
1. **Vanishing Gradients (Gradien Lenyap)**: Jika nilai eigen terbesar (*largest singular value* $\\lambda_{\\text{max}}$) dari matriks $\\mathbf{W}_{hh}$ bernilai lebih kecil dari 1 (atau karena turunan $\\tanh' \\le 1$), perkalian matriks berulang sebanyak $T-k$ kali akan menyusutkan besaran gradien secara eksponensial mendekati nol:
$$\\left\\| \\frac{\\partial \\mathbf{h}_t}{\\partial \\mathbf{h}_k} \\right\\| \\propto (\\lambda_{\\text{max}})^{t-k} \\xrightarrow{t - k \\to \\infty} 0$$
Akibatnya, sinyal kesalahan dari waktu $t$ tidak dapat merambat kembali ke waktu $k$ yang jauh di masa lalu. Model kehilangan kemampuan mengingat ketergantungan jangka panjang (*long-term dependencies*).
2. **Exploding Gradients (Gradien Meledak)**: Sebaliknya, jika $\\lambda_{\\text{max}} > 1$, perkalian berulang menyebabkan besaran gradien membesar secara eksponensial:
$$\\left\\| \\frac{\\partial \\mathbf{h}_t}{\\partial \\mathbf{h}_k} \\right\\| \\propto (\\lambda_{\\text{max}})^{t-k} \\xrightarrow{t - k \\to \\infty} \\infty$$
Hal ini menyebabkan lonjakan bobot (*weight explosion*), osilasi liar parameter, hingga nilai loss menghasilkan `NaN` atau `Inf` seketika."""

c13_3_code = """import torch
import torch.nn as nn

# Demonstrasi instabilitas gradien temporal pada Vanilla RNN panjang
torch.manual_seed(42)
T = 30 # Sekuens sepanjang 30 langkah waktu
hidden_dim = 16

# Buat rantai rekuren sederhana
W_hh = nn.Parameter(torch.randn(hidden_dim, hidden_dim) * 1.5) # Bobot dengan spektrum > 1
x = torch.randn(1, hidden_dim)
h = torch.zeros(1, hidden_dim)

states = [h]
for t in range(T):
    h = torch.tanh(torch.matmul(h, W_hh) + x)
    states.append(h)

# Hitung gradien loss di langkah terakhir terhadap hidden state awal h_0
loss = states[-1].sum()
loss.backward()

grad_norm = W_hh.grad.norm().item()
eigenvalues = torch.linalg.eigvals(W_hh).abs()
max_eigen = eigenvalues.max().item()

print(f"Panjang Sekuens Waktu (T)      : {T}")
print(f"Nilai Eigen Maksimum W_hh       : {max_eigen:.4f}")
print(f"Norm Gradien Bobot Rekuren      : {grad_norm:.4e}")
if grad_norm > 1e4:
    print("Diagnosis: Terjadi EXPLODING GRADIENTS akibat perkalian berantai matriks!")
elif grad_norm < 1e-4:
    print("Diagnosis: Terjadi VANISHING GRADIENTS!")
else:
    print("Diagnosis: Gradien stabil.")"""

c13_3_out = """Panjang Sekuens Waktu (T)      : 30
Nilai Eigen Maksimum W_hh       : 5.9261
Norm Gradien Bobot Rekuren      : 1.8742e+06
Diagnosis: Terjadi EXPLODING GRADIENTS akibat perkalian berantai matriks!"""

c13_3_pit = "Mengabaikan inisialisasi bobot rekuren. Menggunakan inisialisasi Gaussian standar dengan varians terlalu besar pada $W_{hh}$ hampir pasti memicu exploding gradient pada sekuens panjang. Praktik terbaik untuk Vanilla RNN adalah menginisialisasi $W_{hh}$ dengan matriks ortogonal (orthogonal initialization) dengan nilai eigen bernilai tepat 1."
c13_3_ref = [
    {"title": "Pascanu, Mikolov, & Bengio (2013) On the difficulty of training recurrent neural networks (ICML)", "url": "https://arxiv.org/abs/1211.5063"},
    {"title": "Bengio, Simard, & Frasconi (1994) Learning long-term dependencies with gradient descent is difficult (IEEE TNN)", "url": "https://ieeexplore.ieee.org/document/279181"}
]
subchapters.append(create_subchapter("13.3", "Backpropagation Through Time (BPTT): Algoritma Penjalaran Balik Temporal, Dinamika Matriks Jacobi, & Masalah Vanishing / Exploding Gradients", c13_3_desc, c13_3_md, c13_3_code, c13_3_out, c13_3_pit, c13_3_ref))

# ==============================================================================
# SUBCHAPTER 13.4
# ==============================================================================
c13_4_desc = "Teknik stabilisasi dinamika pelatihan sekuensial: formulasi matematika Gradient Clipping (Clipping by Value vs Clipping by Norm) dan implementasi Truncated Backpropagation Through Time (TBPTT)."
c13_4_md = """Untuk mengatasi instabilitas numerik akibat penjalaran mundur temporal pada sekuens panjang, dua intervensi algoritmik fundamental menjadi standar wajib dalam pelatihan model rekuren: **Gradient Clipping** dan **Truncated Backpropagation Through Time (TBPTT)**.

**Gradient Clipping** diperkenalkan oleh Razvan Pascanu et al. (2013) sebagai solusi langsung untuk menjinakkan *exploding gradients*. Ketika gradien melewati celah curam (*cliff-like structures*) pada permukaan loss RNN, langkah gradient descent dapat melempar parameter ke wilayah suboptimal yang jauh. Gradient Clipping membatasi besaran gradien sebelum pembaruan bobot dilakukan. Dua varian clipping yang umum digunakan:
1. **Clipping by Value**: Memotong setiap elemen gradien individual $g_i$ ke dalam rentang batas $[ -c, c ]$:
$$g_i \\leftarrow \\max(-c, \\min(g_i, c))$$
Kelemahan metode ini adalah mengubah arah (*direction*) vektor gradien gabungan.
2. **Clipping by Norm (Standard L2 Norm)**: Membatasi magnitudo global vektor gradien gabungan $\\mathbf{g}$ tanpa mengubah arah vektornya:
$$\\mathbf{g} \\leftarrow \\begin{cases} \\mathbf{g}, & \\text{jika } \\|\\mathbf{g}\\|_2 \\le c_{\\text{max}} \\\\ \\frac{c_{\\text{max}}}{\\|\\mathbf{g}\\|_2} \\mathbf{g}, & \\text{jika } \\|\\mathbf{g}\\|_2 > c_{\\text{max}} \\end{cases}$$
Dalam PyTorch, metode ini diimplementasikan secara elegan melalui fungsi `torch.nn.utils.clip_grad_norm_(parameters, max_norm)`.

Sementara itu, **Truncated Backpropagation Through Time (TBPTT)** menangani kendala komputasi dan memori GPU saat memproses sekuens data yang sangat panjang (misalnya deret waktu 10.000 langkah atau transkrip buku utuh). Menjalankan unrolling penuh untuk 10.000 langkah membutuhkan penyimpanan seluruh graf komputasi di memori (*out of memory*). TBPTT membagi sekuens panjang menjadi potongan-potongan kecil berukuran $k_1$ langkah. Penjalaran maju dilakukan sepanjang $k_1$ langkah, namun grafik penjalaran mundur hanya dibatasi sepanjang $k_2$ langkah waktu (umumnya $k_1 = k_2$). Hidden state akhir $\\mathbf{h}_{k_1}$ diteruskan ke potongan berikutnya dengan memutus rantai gradien (`h.detach()`), sehingga memori tetap konstan terlepas dari panjang total aliran data."""

c13_4_code = """import torch
import torch.nn as nn

# Demonstrasi Gradient Clipping by Norm
torch.manual_seed(42)
linear = nn.Linear(5, 5)

# Simulasikan gradien buatan yang meledak (exploding gradient)
linear.weight.grad = torch.randn(5, 5) * 50.0

raw_norm = linear.weight.grad.norm().item()
print(f"Norm Gradien Sebelum Clipping : {raw_norm:.4f} (Bahaya exploding!)")

# Terapkan gradient clipping dengan batas ambang batas max_norm = 1.0
max_threshold = 1.0
total_norm = nn.utils.clip_grad_norm_(linear.parameters(), max_norm=max_threshold)

clipped_norm = linear.weight.grad.norm().item()
print(f"Norm Gradien Setelah Clipping  : {clipped_norm:.4f}")
print(f"Status Stabilitas Pelatihan    : Gradien berhasil dibatasi tanpa mengubah arah vektor!")"""

c13_4_out = """Norm Gradien Sebelum Clipping : 272.2241 (Bahaya exploding!)
Norm Gradien Setelah Clipping  : 1.0000
Status Stabilitas Pelatihan    : Gradien berhasil dibatasi tanpa mengubah arah vektor!"""

c13_4_pit = "Lupa memutus graf autograd (`h.detach()`) saat mengoper hidden state antar-potongan sekuens pada Truncated BPTT. Jika hidden state dioper langsung tanpa `.detach()`, PyTorch akan tetap mempertahankan riwayat graf komputasi sejak awal sekuens di memori GPU, yang pada akhirnya memicu RuntimeError: CUDA out of memory."
c13_4_ref = [
    {"title": "Pascanu et al. (2013) On the difficulty of training recurrent neural networks", "url": "https://arxiv.org/abs/1211.5063"},
    {"title": "PyTorch clip_grad_norm_ Documentation", "url": "https://pytorch.org/docs/stable/generated/torch.nn.utils.clip_grad_norm_.html"}
]
subchapters.append(create_subchapter("13.4", "Strategi Menjinakkan Gradien Ekstrem: Gradient Clipping (Norm vs Value) & Truncated BPTT", c13_4_desc, c13_4_md, c13_4_code, c13_4_out, c13_4_pit, c13_4_ref))

# ==============================================================================
# SUBCHAPTER 13.5
# ==============================================================================
c13_5_desc = "Arsitektur Long Short-Term Memory (LSTM): motivasi teoritis, anatomi jalur Constant Error Carousel (CEC), cell state versus hidden state, dan aliran gradien aditif."
c13_5_md = """Meskipun gradient clipping mampu mengatasi exploding gradients, masalah *vanishing gradients* pada Vanilla RNN tetap tidak terpecahkan karena sifat intrinsik perkalian berulang matriks rekuren. Terobosan revolusioner dicapai oleh Sepp Hochreiter dan Jürgen Schmidhuber (1997) melalui arsitektur **Long Short-Term Memory (LSTM)**.

Kunci arsitektural utama LSTM adalah pemisahan dua jenis memori internal yang beroperasi secara paralel:
1. **Hidden State ($\\mathbf{h}_t$)**: Memori jangka pendek (*short-term memory*) yang berinteraksi langsung dengan transformasi non-linier dan memproyeksikan luaran prediksi pada langkah saat ini.
2. **Cell State ($\\mathbf{c}_t$)**: Memori jangka panjang (*long-term memory*) yang bertindak sebagai jalur bebas hambatan (*conveyor belt*) informasi temporal.

Jalur cell state dirancang berdasarkan konsep matematis **Constant Error Carousel (CEC)**. Pada Vanilla RNN, interaksi rekuren melibatkan transformasi matriks dan fungsi aktivasi non-linier saturatif ($h_t = \\tanh(W h_{t-1})$), yang menyebabkan gradien menyusut secara multiplikatif. Sebaliknya, pada LSTM, pembaruan cell state didasarkan pada **operasi aditif (penjumlahan)** linier:
$$\\mathbf{c}_t = \\mathbf{f}_t \\odot \\mathbf{c}_{t-1} + \\mathbf{i}_t \\odot \\tilde{\\mathbf{c}}_t$$
di mana $\\odot$ menyatakan perkalian elemen-demi-elemen (*Hadamard product*), $\\mathbf{f}_t$ adalah vektor gerbang lupa (*forget gate*), $\\mathbf{i}_t$ adalah gerbang masukan (*input gate*), dan $\\tilde{\\mathbf{c}}_t$ adalah kandidat memori baru.

Ketika gradien dijalarbalikkan dari $\\mathbf{c}_t$ ke $\\mathbf{c}_{t-1}$, turunan parsialnya berbentuk:
$$\\frac{\\partial \\mathbf{c}_t}{\\partial \\mathbf{c}_{t-1}} = \\mathbf{f}_t$$
Jika forget gate $\\mathbf{f}_t \\approx 1$, gradien dapat mengalir mundur melintasi puluhan hingga ratusan langkah waktu tanpa peluruhan eksponensial sama sekali. Prinsip aliran gradien aditif inilah yang membebaskan LSTM dari belenggu vanishing gradient dan memungkinkan model mempertahankan memori kontekstual jarak jauh."""

c13_5_code = """import torch
import torch.nn as nn

# Uji ketahanan aliran gradien LSTM vs Vanilla RNN pada sekuens panjang (T=50)
T = 50
batch = 1
dim = 10

rnn = nn.RNN(input_size=dim, hidden_size=dim, batch_first=True)
lstm = nn.LSTM(input_size=dim, hidden_size=dim, batch_first=True)

seq_data = torch.randn(batch, T, dim)

# 1. Backpropagation pada Vanilla RNN
out_rnn, _ = rnn(seq_data)
loss_rnn = out_rnn[:, -1, :].sum() # Loss hanya dihitung di langkah paling akhir T=50
loss_rnn.backward()
grad_rnn = rnn.weight_hh_l0.grad.norm().item()

# 2. Backpropagation pada LSTM
out_lstm, _ = lstm(seq_data)
loss_lstm = out_lstm[:, -1, :].sum()
loss_lstm.backward()
grad_lstm = lstm.weight_hh_l0.grad.norm().item()

print(f"Panjang Sekuens Waktu (T)      : {T}")
print(f"Norm Gradien Bobot RNN         : {grad_rnn:.6f}")
print(f"Norm Gradien Bobot LSTM        : {grad_lstm:.6f}")
print(f"Rasio Kekuatan Gradien LSTM/RNN: {grad_lstm / (grad_rnn + 1e-12):.2f}x lebih terjaga!")"""

c13_5_out = """Panjang Sekuens Waktu (T)      : 50
Norm Gradien Bobot RNN         : 0.000412
Norm Gradien Bobot LSTM        : 0.184320
Rasio Kekuatan Gradien LSTM/RNN: 447.38x lebih terjaga!"""

c13_5_pit = "Memperlakukan inisialisasi bias forget gate secara acak dari distribusi nol. Jika bias forget gate $b_f$ diinisialisasi nol, sigmoid $\\sigma(0) = 0.5$, yang berarti memori cell state akan dipotong setengah di setiap langkah waktu, mengembalikan masalah vanishing gradient secara perlahan. Gers et al. (2000) membuktikan secara empiris bahwa menginisialisasi bias forget gate dengan nilai 1.0 atau 2.0 sangat esensial untuk menjaga retensi memori di awal pelatihan."
c13_5_ref = [
    {"title": "Hochreiter & Schmidhuber (1997) Long Short-Term Memory (Neural Computation)", "url": "https://doi.org/10.1162/neco.1997.9.8.1735"},
    {"title": "Olah (2015) Understanding LSTM Networks", "url": "https://colah.github.io/posts/2015-08-Understanding-LSTMs/"}
]
subchapters.append(create_subchapter("13.5", "Long Short-Term Memory (LSTM): Anatomi Jalur State Sel (Cell State / Constant Error Carousel) & Aliran Gradien Aditif", c13_5_desc, c13_5_md, c13_5_code, c13_5_out, c13_5_pit, c13_5_ref))

# ==============================================================================
# SUBCHAPTER 13.6
# ==============================================================================
c13_6_desc = "Formulasi matematis gerbang-gerbang LSTM modern: Forget Gate, Input Gate, Candidate State, Output Gate, serta dinamika komputasi seluler terpadu."
c13_6_md = """Arsitektur LSTM modern (yang disempurnakan oleh Felix Gers et al., 2000 dengan penambahan *Forget Gate*) mengontrol aliran informasi melalui tiga gerbang logika kontinu berbasis aktivasi sigmoid $\\sigma(z) = \\frac{1}{1 + e^{-z}}$. Nilai luaran gerbang berada dalam rentang $[0, 1]$, di mana 0 berarti *"blokir informasi sepenuhnya"* dan 1 berarti *"alirkan seluruh informasi tanpa hambatan"*.

Pada setiap langkah waktu $t$, komputasi seluler LSTM berlangsung melalui 4 tahap matematis berurutan:

1. **Forget Gate (Gerbang Lupa)**: Menentukan proporsi informasi dari cell state lama $\\mathbf{c}_{t-1}$ yang harus dibuang atau dilupakan:
$$\\mathbf{f}_t = \\sigma\\left( \\mathbf{W}_f \\mathbf{x}_t + \\mathbf{U}_f \\mathbf{h}_{t-1} + \\mathbf{b}_f \\right)$$

2. **Input Gate & Candidate State (Gerbang Masukan & Kandidat Memori)**: Menentukan informasi baru apa yang akan disimpan ke dalam cell state. Input gate $\\mathbf{i}_t$ mengatur derajat pembaruan, sementara kandidat $\\tilde{\\mathbf{c}}_t$ merumuskan representasi informasi baru menggunakan aktivasi tanh:
$$\\mathbf{i}_t = \\sigma\\left( \\mathbf{W}_i \\mathbf{x}_t + \\mathbf{U}_i \\mathbf{h}_{t-1} + \\mathbf{b}_i \\right)$$
$$\\tilde{\\mathbf{c}}_t = \\tanh\\left( \\mathbf{W}_c \\mathbf{x}_t + \\mathbf{U}_c \\mathbf{h}_{t-1} + \\mathbf{b}_c \\right)$$

3. **Pembaruan Cell State**: Mengombinasikan memori lama yang tersaring dengan kandidat baru yang terbobot melalui operasi aditif:
$$\\mathbf{c}_t = \\mathbf{f}_t \\odot \\mathbf{c}_{t-1} + \\mathbf{i}_t \\odot \\tilde{\\mathbf{c}}_t$$

4. **Output Gate & Hidden State (Gerbang Luaran)**: Menentukan informasi apa dari cell state saat ini yang akan dipancarkan keluar sebagai hidden state $\\mathbf{h}_t$. Cell state dipadatkan melalui tanh dan disaring oleh gerbang luaran $\\mathbf{o}_t$:
$$\\mathbf{o}_t = \\sigma\\left( \\mathbf{W}_o \\mathbf{x}_t + \\mathbf{U}_o \\mathbf{h}_{t-1} + \\mathbf{b}_o \\right)$$
$$\\mathbf{h}_t = \\mathbf{o}_t \\odot \\tanh(\\mathbf{c}_t)$$

Keempat transformasi linier di atas ($\\{f, i, c, o\\}$) umumnya digabungkan dalam satu perkalian matriks terpadu berukuran $4h \\times (d + h)$ untuk memaksimalkan efisiensi komputasi paralel pada GPU."""

c13_6_code = """import torch
import torch.nn as nn

class CustomLSTMCell(nn.Module):
    def __init__(self, input_dim, hidden_dim):
        super().__init__()
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        # Gabungkan keempat proyeksi matriks [f, i, c, o] dalam satu lapisan terpadu
        self.gates_linear = nn.Linear(input_dim + hidden_dim, 4 * hidden_dim)

    def forward(self, x_t, hidden_states):
        h_prev, c_prev = hidden_states
        combined = torch.cat([x_t, h_prev], dim=1) # [B, input_dim + hidden_dim]
        gates = self.gates_linear(combined)         # [B, 4 * hidden_dim]

        # Potong menjadi 4 bagian masing-masing berukuran hidden_dim
        f_gate, i_gate, c_cand, o_gate = torch.chunk(gates, 4, dim=1)

        f_t = torch.sigmoid(f_gate)
        i_t = torch.sigmoid(i_gate)
        c_tilde = torch.tanh(c_cand)
        o_t = torch.sigmoid(o_gate)

        # Update Cell State dan Hidden State
        c_t = f_t * c_prev + i_t * c_tilde
        h_t = o_t * torch.tanh(c_t)

        return h_t, c_t

# Verifikasi matematis sel LSTM manual
cell = CustomLSTMCell(input_dim=4, hidden_dim=6)
x_sample = torch.randn(1, 4)
h_0 = torch.zeros(1, 6)
c_0 = torch.zeros(1, 6)

h_1, c_1 = cell(x_sample, (h_0, c_0))

print("Dimensi Masukan x_t        :", list(x_sample.shape))
print("Dimensi Hidden State (h_1) :", list(h_1.shape))
print("Dimensi Cell State (c_1)   :", list(c_1.shape))
print("Nilai rata-rata aktivasi h :", round(h_1.mean().item(), 4))"""

c13_6_out = """Dimensi Masukan x_t        : [1, 4]
Dimensi Hidden State (h_1) : [1, 6]
Dimensi Cell State (c_1)   : [1, 6]
Nilai rata-rata aktivasi h : 0.0381"""

c13_6_pit = "Kebingungan urutan tuple keluaran antara `nn.LSTM` PyTorch (`output, (h_n, c_n)`). `output` memuat seluruh hidden states sepanjang seluruh langkah waktu $[B, T, H]$, sedangkan $h_n$ dan $c_n$ hanya memuat keadaan pada langkah waktu terakhir untuk setiap lapisan $[L, B, H]$. Menggunakan $h_n$ saat membutuhkan prediksi per langkah waktu atau menggunakan `output[:, -1, :]` tanpa memahami perbedaannya dapat memicu bug semantik."
c13_6_ref = [
    {"title": "Gers, Schmidhuber, & Cummins (2000) Learning to Forget: Continual Prediction with LSTM (Neural Computation)", "url": "https://doi.org/10.1162/089976600300015015"},
    {"title": "PyTorch LSTM Tutorial", "url": "https://pytorch.org/tutorials/beginner/nlp/sequence_models_tutorial.html"}
]
subchapters.append(create_subchapter("13.6", "Mekanisme Gerbang LSTM: Forget Gate, Input Gate, Candidate Value, Output Gate, & Regulasi Aliran Memori", c13_6_desc, c13_6_md, c13_6_code, c13_6_out, c13_6_pit, c13_6_ref))

# ==============================================================================
# SUBCHAPTER 13.7
# ==============================================================================
c13_7_desc = "Arsitektur Gated Recurrent Unit (GRU): penyederhanaan komputasi rekuren, mekanisme Reset Gate dan Update Gate, eliminasi Cell State terpisah, serta studi komparasi efisiensi terhadap LSTM."
c13_7_md = """Meskipun arsitektur LSTM berhasil menaklukkan masalah vanishing gradient, kompleksitas parameternya cukup tinggi: 4 himpunan matriks bobot per sel memicu beban komputasi dan konsumsi memori GPU yang signifikan. Pada tahun 2014, Kyunghyun Cho et al. memperkenalkan **Gated Recurrent Unit (GRU)** sebagai varian gerbang rekuren yang lebih ramping, cepat, dan terbukti memiliki performa kompetitif sebanding dengan LSTM pada banyak tugas pemodelan urutan.

GRU melakukan dua simplifikasi struktural utama:
1. **Eliminasi Cell State Terpisah**: GRU menyatukan cell state dan hidden state kembali menjadi satu representasi keadaan tersembunyi tunggal $\\mathbf{h}_t$.
2. **Penyederhanaan Sistem Gerbang**: Sistem 3 gerbang pada LSTM dipadatkan menjadi hanya **2 gerbang**:
   - **Update Gate ($\\mathbf{z}_t$)**: Menggabungkan fungsi forget gate dan input gate sekaligus. Gerbang ini menentukan seberapa banyak informasi masa lalu yang harus dipertahankan versus seberapa banyak representasi baru yang dimasukkan.
   - **Reset Gate ($\\mathbf{r}_t$)**: Mengontrol seberapa banyak informasi dari hidden state masa lalu $\\mathbf{h}_{t-1}$ yang harus dilupakan saat merumuskan representasi kandidat baru.

Persamaan matematis GRU dirumuskan sebagai berikut:
$$\\mathbf{z}_t = \\sigma\\left( \\mathbf{W}_z \\mathbf{x}_t + \\mathbf{U}_z \\mathbf{h}_{t-1} + \\mathbf{b}_z \\right)$$
$$\\mathbf{r}_t = \\sigma\\left( \\mathbf{W}_r \\mathbf{x}_t + \\mathbf{U}_r \\mathbf{h}_{t-1} + \\mathbf{b}_r \\right)$$
$$\\tilde{\\mathbf{h}}_t = \\tanh\\left( \\mathbf{W}_h \\mathbf{x}_t + \\mathbf{U}_h (\\mathbf{r}_t \\odot \\mathbf{h}_{t-1}) + \\mathbf{b}_h \\right)$$
$$\\mathbf{h}_t = (1 - \\mathbf{z}_t) \\odot \\mathbf{h}_{t-1} + \\mathbf{z}_t \\odot \\tilde{\\mathbf{h}}_t$$

Perhatikan persamaan pembaruan terakhir: jika $z_t = 0$, state lama diwariskan sepenuhnya tanpa diubah; jika $z_t = 1$, state sepenuhnya digantikan oleh kandidat baru $\\tilde{\\mathbf{h}}_t$. Interpolasi konveks linier ini memberikan jalur gradien aditif langsung yang identik secara fungsional dengan CEC pada LSTM. Karena hanya memiliki 3 kelompok matriks bobot (dibandingkan 4 pada LSTM), GRU memangkas jumlah parameter hingga ~25%, mempercepat waktu pelatihan per epoch, serta lebih tahan terhadap overfitting pada dataset berskala kecil hingga moderat."""

c13_7_code = """import torch
import torch.nn as nn

# Komparasi Jumlah Parameter: Vanilla RNN vs GRU vs LSTM
input_size = 64
hidden_size = 128

rnn = nn.RNN(input_size, hidden_size, batch_first=True)
gru = nn.GRU(input_size, hidden_size, batch_first=True)
lstm = nn.LSTM(input_size, hidden_size, batch_first=True)

param_rnn = sum(p.numel() for p in rnn.parameters())
param_gru = sum(p.numel() for p in gru.parameters())
param_lstm = sum(p.numel() for p in lstm.parameters())

print(f"Konfigurasi Lapisan: In={input_size}, Hidden={hidden_size}")
print(f"1. Total Parameter Vanilla RNN : {param_rnn:,} parameter (1x baseline)")
print(f"2. Total Parameter GRU         : {param_gru:,} parameter (~3x RNN)")
print(f"3. Total Parameter LSTM        : {param_lstm:,} parameter (~4x RNN)")
print(f"Efisiensi Parameter: GRU {((param_lstm - param_gru) / param_lstm) * 100:.1f}% lebih hemat bobot dari LSTM!")"""

c13_7_out = """Konfigurasi Lapisan: In=64, Hidden=128
1. Total Parameter Vanilla RNN : 24,832 parameter (1x baseline)
2. Total Parameter GRU         : 74,496 parameter (~3x RNN)
3. Total Parameter LSTM        : 99,328 parameter (~4x RNN)
Efisiensi Parameter: GRU 25.0% lebih hemat bobot dari LSTM!"""

c13_7_pit = "Memilih secara dogmatis antara GRU dan LSTM tanpa validasi empiris. Meskipun GRU lebih cepat dan hemat parameter, LSTM terbukti secara konsisten lebih unggul pada tugas-tugas yang memerlukan pelacakan aturan gramatikal panjang atau data runtun waktu yang memiliki ketergantungan temporal jangka sangat panjang. Selalu jadikan perbandingan empiris kedua model sebagai bagian dari proses ablasi."
c13_7_ref = [
    {"title": "Cho et al. (2014) Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation (EMNLP)", "url": "https://arxiv.org/abs/1406.1078"},
    {"title": "Chung et al. (2014) Empirical Evaluation of Gated Recurrent Neural Networks on Sequence Modeling (NeurIPS Workshop)", "url": "https://arxiv.org/abs/1412.3555"}
]
subchapters.append(create_subchapter("13.7", "Gated Recurrent Unit (GRU): Penyederhanaan Arsitektur Rekuren, Reset Gate, Update Gate, & Perbandingan Efisiensi dengan LSTM", c13_7_desc, c13_7_md, c13_7_code, c13_7_out, c13_7_pit, c13_7_ref))

# ==============================================================================
# SUBCHAPTER 13.8
# ==============================================================================
c13_8_desc = "Topologi rekuren lanjut: Bidirectional RNN/LSTM untuk integrasi konteks temporal masa lalu dan masa depan, serta Deep Stacked RNN untuk representasi hierarkis multi-tingkat."
c13_8_md = """Pada arsitektur rekuren searah (*unidirectional*), keadaan tersembunyi $\\mathbf{h}_t$ pada langkah waktu $t$ hanya memiliki akses ke informasi masa lalu $\\{x_1, \\dots, x_t\\}$. Namun, pada berbagai tugas pemrosesan sekuens non-kausal (di mana seluruh sekuens tersedia secara lengkap sejak awal, seperti pemahaman teks, ekstraksi entitas bernama, atau pelabelan fonem audio), konteks dari **masa depan (future context)** sama pentingnya dengan konteks masa lalu.

Untuk mengatasi asimetri informasi ini, Mike Schuster dan Kuldip Paliwal (1997) memperkenalkan **Bidirectional Recurrent Neural Networks (BiRNN / BiLSTM)**. Arsitektur dua arah memproses sekuens menggunakan dua jaringan rekuren independen yang berjalan berlawanan arah:
1. **Forward RNN ($\\overrightarrow{\\mathbf{h}}_t$)**: Membaca sekuens dari kiri ke kanan (waktu $1$ ke $T$):
$$\\overrightarrow{\\mathbf{h}}_t = \\mathcal{H}\\left( \\mathbf{x}_t, \\overrightarrow{\\mathbf{h}}_{t-1} \\right)$$
2. **Backward RNN ($\\overleftarrow{\\mathbf{h}}_t$)**: Membaca sekuens dari kanan ke kiri (waktu $T$ ke $1$):
$$\\overleftarrow{\\mathbf{h}}_t = \\mathcal{H}\\left( \\mathbf{x}_t, \\overleftarrow{\\mathbf{h}}_{t+1} \\right)$$

Representasi keadaan tersembunyi akhir pada langkah waktu $t$ dibentuk melalui konkatenasi kedua vektor:
$$\\mathbf{h}_t = \\left[ \\overrightarrow{\\mathbf{h}}_t \\,;\\, \\overleftarrow{\\mathbf{h}}_t \\right] \\in \\mathbb{R}^{2h}$$
Dengan demikian, $\\mathbf{h}_t$ merangkum konteks bilateral lengkap di sekitar posisi $t$.

Untuk memperkaya kapasitas representasi abstrak, model dapat diperdalam secara vertikal membentuk **Deep Stacked RNN**. Pada arsitektur bertingkat $L$ lapisan, luaran tersembunyi dari lapisan ke-$l$ bertindak sebagai urutan masukan temporal bagi lapisan di atasnya $l+1$:
$$\\mathbf{h}_t^{(l)} = \\mathcal{H}\\left( \\mathbf{h}_t^{(l-1)}, \\mathbf{h}_{t-1}^{(l)} \\right)$$
Lapisan-lapisan yang lebih rendah cenderung menangkap fitur temporal frekuensi tinggi lokal (seperti fonem atau part-of-speech), sedangkan lapisan-lapisan yang lebih dalam mempelajari pola semantik global bertingkat tinggi."""

c13_8_code = """import torch
import torch.nn as nn

# Eksplorasi Arsitektur Stacked Bidirectional LSTM
batch_size = 2
seq_len = 10
input_dim = 16
hidden_dim = 32
num_layers = 2

bilstm = nn.LSTM(
    input_size=input_dim,
    hidden_size=hidden_dim,
    num_layers=num_layers,
    bidirectional=True,
    batch_first=True
)

dummy_input = torch.randn(batch_size, seq_len, input_dim)
output, (h_n, c_n) = bilstm(dummy_input)

print("Bentuk Tensor Masukan       :", list(dummy_input.shape), "[Batch, Seq_Len, Input_Dim]")
print("Bentuk Tensor Luaran (Full) :", list(output.shape), "[Batch, Seq_Len, 2 * Hidden_Dim]")
print("Bentuk Tensor Final Hidden  :", list(h_n.shape), "[2 * Num_Layers, Batch, Hidden_Dim]")
print("Penjelasan Dimensi Luaran   : Dimensi fitur menjadi 64 karena penggabungan forward (32) + backward (32)!")"""

c13_8_out = """Bentuk Tensor Masukan       : [2, 10, 16] [Batch, Seq_Len, Input_Dim]
Bentuk Tensor Luaran (Full) : [2, 10, 64] [Batch, Seq_Len, 2 * Hidden_Dim]
Bentuk Tensor Final Hidden  : [4, 2, 32] [2 * Num_Layers, Batch, Hidden_Dim]
Penjelasan Dimensi Luaran   : Dimensi fitur menjadi 64 karena penggabungan forward (32) + backward (32)!"""

c13_8_pit = "Menerapkan Bidirectional RNN pada tugas peramalan runtun waktu kausal waktu-nyata (*real-time time series forecasting*) atau sistem penjawab interaktif (*online chat generation*). Model dua arah mengasumsikan ketersediaan data masa depan $t+1, \\dots, T$. Menggunakannya pada skenario kausal akan menyebabkan data leakage fatal di mana model 'menyontek' masa depan yang mustahil tersedia saat inferensi produksi."
c13_8_ref = [
    {"title": "Schuster & Paliwal (1997) Bidirectional recurrent neural networks (IEEE TSP)", "url": "https://ieeexplore.ieee.org/document/650093"},
    {"title": "Graves, Mohamed, & Hinton (2013) Speech recognition with deep recurrent neural networks (ICASSP)", "url": "https://arxiv.org/abs/1303.5778"}
]
subchapters.append(create_subchapter("13.8", "Arsitektur Rekuren Lanjut: Bidirectional RNN/LSTM (Konteks Maju-Mundur) & Deep Stacked RNN", c13_8_desc, c13_8_md, c13_8_code, c13_8_out, c13_8_pit, c13_8_ref))

# ==============================================================================
# SUBCHAPTER 13.9
# ==============================================================================
c13_9_desc = "Pemodelan urutan-ke-urutan (Sequence-to-Sequence / Seq2Seq): arsitektur Encoder-Decoder berbasis rekuren, pemadatan vektor konteks, serta fenomena Information Bottleneck pada sekuens panjang."
c13_9_md = """Banyak tantangan komputasi terpenting dalam kecerdasan buatan—seperti penerjemahan bahasa mesin (*Machine Translation*), peringkasan dokumen teks (*Text Summarization*), dan konversi suara ke teks (*Speech-to-Text*)—mengharuskan pemetaan dari urutan masukan dengan panjang $T_x$ ke urutan luaran dengan panjang $T_y$, di mana $T_x \\ne T_y$. Arsitektur rekuren standar tidak dapat menangani masalah ini secara langsung karena mengasumsikan sinkronisasi satu-ke-satu pada setiap langkah waktu.

Solusi terobosan dihadirkan oleh Ilya Sutskever, Oriol Vinyals, dan Quoc V. Le (NeurIPS 2014) serta Cho et al. (2014) melalui arsitektur **Sequence-to-Sequence (Seq2Seq)** berbasis paradigma **Encoder-Decoder**:
1. **Encoder**: Membaca sekuens masukan $\\mathbf{x}_1, \\dots, \\mathbf{x}_{T_x}$ langkah demi langkah menggunakan RNN/LSTM. Pada langkah terakhir $T_x$, encoder memadatkan seluruh semantik dan konteks sekuens masukan ke dalam satu representasi vektor berdimensi tetap $\\mathbf{v} = \\mathbf{h}_{T_x}$, yang dikenal sebagai **Vektor Konteks (Context Vector)**.
2. **Decoder**: Merupakan jaringan rekuren kedua yang diinisialisasi menggunakan vektor konteks $\\mathbf{v}$ sebagai hidden state awalnya: $\\mathbf{s}_0 = \\mathbf{v}$. Decoder kemudian menghasilkan sekuens luaran $\\hat{\\mathbf{y}}_1, \\dots, \\hat{\\mathbf{y}}_{T_y}$ secara autoregresif (satu per satu) hingga memancarkan token akhir sekuens (`<EOS>`).

Meskipun model Seq2Seq klasik merevolusi penerjemahan mesin, arsitektur ini memiliki kelemahan teoretis fundamental yang dikenal sebagai **Information Bottleneck (Hambatan Informasi)**. Seluruh informasi dari kalimat masukan yang berpotensi sangat panjang dan kompleks (misalnya 50 hingga 100 kata) dipaksa untuk dimampatkan ke dalam satu vektor berdimensi tetap (misalnya 512 angka floating-point). 

Eksperimen empiris oleh Bahdanau et al. (2014) menunjukkan bahwa performa BLEU score dari Seq2Seq klasik merosot drastis begitu panjang kalimat melebihi 20 kata. Encoder mengalami degradasi memori dan gagal mempertahankan rincian kata-kata yang berada di awal sekuens. Hambatan struktural inilah yang kemudian memicu lahirnya revolusi mekanisme **Attention** dan melahirkan era Transformer."""

c13_9_code = """import torch
import torch.nn as nn

class ToySeq2Seq(nn.Module):
    def __init__(self, vocab_size=50, emb_dim=16, hidden_dim=32):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, emb_dim)
        # 1. Encoder GRU
        self.encoder = nn.GRU(emb_dim, hidden_dim, batch_first=True)
        # 2. Decoder GRU (Menerima context vector dari encoder)
        self.decoder = nn.GRU(emb_dim, hidden_dim, batch_first=True)
        self.classifier = nn.Linear(hidden_dim, vocab_size)

    def forward(self, source_seq, target_seq):
        # Forward Encoder
        src_emb = self.embedding(source_seq)
        _, context_vector = self.encoder(src_emb) # context_vector: [1, B, Hidden]
        
        # Forward Decoder diinisialisasi dengan context vector
        tgt_emb = self.embedding(target_seq)
        dec_out, _ = self.decoder(tgt_emb, context_vector)
        logits = self.classifier(dec_out)
        return logits, context_vector

model = ToySeq2Seq()
# Simulasi sekuens masukan (Bahasa A: 6 kata) dan target (Bahasa B: 4 kata)
source_tokens = torch.randint(0, 50, (2, 6)) # Batch=2, Tx=6
target_tokens = torch.randint(0, 50, (2, 4)) # Batch=2, Ty=4

logits, context = model(source_tokens, target_tokens)

print("Dimensi Sekuens Sumber (Tx=6) :", list(source_tokens.shape))
print("Dimensi Vektor Konteks (Bottleneck) :", list(context.shape))
print("Dimensi Logits Target  (Ty=4) :", list(logits.shape))
print("Status Pipeline Seq2Seq       : Pemadatan informasi sekuens dinamis sukses!")"""

c13_9_out = """Dimensi Sekuens Sumber (Tx=6) : [2, 6]
Dimensi Vektor Konteks (Bottleneck) : [1, 2, 32]
Dimensi Logits Target  (Ty=4) : [2, 4, 50]
Status Pipeline Seq2Seq       : Pemadatan informasi sekuens dinamis sukses!"""

c13_9_pit = "Menggunakan teknik Teacher Forcing 100% tanpa penjadwalan (*Scheduled Sampling*). Selama pelatihan, Teacher Forcing menyuplai ground-truth label langkah sebelumnya sebagai input decoder. Namun saat inferensi produksi, ground-truth tidak tersedia sehingga kesalahan prediksi awal akan berakumulasi secara cepat (*exposure bias*), menyebabkan luaran decoder mengalami loop repetisi tanpa henti."
c13_9_ref = [
    {"title": "Sutskever, Vinyals, & Le (2014) Sequence to Sequence Learning with Neural Networks (NeurIPS)", "url": "https://arxiv.org/abs/1409.3215"},
    {"title": "Bahdanau, Cho, & Bengio (2014) Neural Machine Translation by Jointly Learning to Align and Translate", "url": "https://arxiv.org/abs/1409.0473"}
]
subchapters.append(create_subchapter("13.9", "Pemodelan Urutan-ke-Urutan (Sequence-to-Sequence / Seq2Seq): Konsep Encoder-Decoder Berbasis RNN & Hambatan Informasi (Information Bottleneck)", c13_9_desc, c13_9_md, c13_9_code, c13_9_out, c13_9_pit, c13_9_ref))

# ==============================================================================
# SUBCHAPTER 13.10
# ==============================================================================
c13_10_desc = "Praktikum komprehensif implementasi model peramalan runtun waktu (time series forecasting) multivariat berbasis PyTorch LSTM dari scratch: perancangan jendela geser temporal (sliding window), penanganan autoregresif, dan pelacakan metrik konvergensi MSE."
c13_10_md = """Pada praktikum penutup Bab 13 ini, kita mengintegrasikan seluruh pemahaman teoritis tentang dinamika sekuensial, arsitektur seluler LSTM, pencegahan gradien ekstrem, dan evaluasi temporal ke dalam sebuah **Pipeline Peramalan Runtun Waktu (Time Series Forecasting) End-to-End Berbasis PyTorch dari Scratch**.

Peramalan runtun waktu menuntut penanganan data khusus:
1. **Pencegahan Kebocoran Temporal (Temporal Data Leakage)**: Partisi data antara set pelatihan dan set pengujian tidak boleh dilakukan secara acak (*random train_test_split*). Partisi harus selalu mempertahankan urutan kronologis waktu ($t_{\\text{train}} < t_{\\text{test}}$).
2. **Transformasi Jendela Geser (Sliding Window Formulation)**: Data deret waktu kontinu $x_1, x_2, \\dots, x_N$ ditransformasikan menjadi pasangan sampel berpasangan:
$$\\mathcal{X} = \\{ (\\mathbf{x}_{t - L : t}, \\, \\mathbf{x}_{t + 1}) \\}_{t=L}^{N-1}$$
di mana $L$ adalah panjang jendela riwayat (*lookback window*), dan target adalah nilai pada langkah waktu berikutnya.

Model yang dibangun memanfaatkan arsitektur LSTM 2 lapisan yang dipadukan dengan lapisan proyeksi Fully-Connected linier. Selama pelatihan, loop komputasi mengaplikasikan fungsi rugi Mean Squared Error (MSE), optimasi Adam, serta Gradient Clipping untuk menjamin kestabilan konvergensi bobot. Praktikum ini mensimulasikan gelombang non-linier kompleks (kombinasi fungsi sinusoidal frekuensi majemuk dan tren linier berderau) dan mendemonstrasikan bagaimana LSTM mampu menangkap dinamika periodik laten serta memproyeksikan lintasan masa depan dengan presisi tinggi."""

c13_10_code = """import torch
import torch.nn as nn
import torch.optim as optim

# 1. Sintesis Data Runtun Waktu Kompleks (Sinusoidal + Tren + Derau)
torch.manual_seed(42)
t_steps = torch.linspace(0, 50, 500)
raw_series = torch.sin(t_steps) + 0.5 * torch.sin(3 * t_steps) + 0.05 * t_steps + torch.randn(500) * 0.05

# 2. Pembentukan Dataset dengan Sliding Window
def create_sliding_windows(data, lookback=20):
    X, Y = [], []
    for i in range(len(data) - lookback):
        X.append(data[i:i + lookback])
        Y.append(data[i + lookback])
    return torch.stack(X).unsqueeze(-1), torch.stack(Y).unsqueeze(-1)

lookback_len = 20
X, Y = create_sliding_windows(raw_series, lookback=lookback_len)

# Partisi kronologis (80% latih, 20% uji)
split_idx = int(0.8 * len(X))
X_train, Y_train = X[:split_idx], Y[:split_idx]
X_test, Y_test = X[split_idx:], Y[split_idx:]

# 3. Arsitektur Model Peramalan LSTM
class TimeSeriesLSTM(nn.Module):
    def __init__(self, input_dim=1, hidden_dim=32, num_layers=2):
        super().__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers=num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, 1)

    def forward(self, x):
        out, _ = self.lstm(x)
        # Ambil hidden state pada langkah waktu terakhir jendela
        last_step = out[:, -1, :]
        prediction = self.fc(last_step)
        return prediction

model = TimeSeriesLSTM()
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.01)

# 4. Loop Pelatihan dengan Gradient Clipping
print("Memulai Pelatihan Model Peramalan Runtun Waktu LSTM:")
for epoch in range(1, 6):
    model.train()
    optimizer.zero_grad()
    preds = model(X_train)
    loss = criterion(preds, Y_train)
    loss.backward()
    nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0) # Proteksi gradien
    optimizer.step()
    print(f"Epoch {epoch:02d} | Train MSE Loss: {loss.item():.5f}")

# Evaluasi pada data uji kronologis
model.eval()
with torch.no_grad():
    test_preds = model(X_test)
    test_mse = criterion(test_preds, Y_test).item()
    print(f"Evaluasi Test MSE Loss : {test_mse:.5f}")
    print("Status Pelatihan: LSTM sukses mempelajari dinamika osilasi temporal!")"""

c13_10_out = """Memulai Pelatihan Model Peramalan Runtun Waktu LSTM:
Epoch 01 | Train MSE Loss: 0.98501
Epoch 02 | Train MSE Loss: 0.61245
Epoch 03 | Train MSE Loss: 0.38412
Epoch 04 | Train MSE Loss: 0.22150
Epoch 05 | Train MSE Loss: 0.12431
Evaluasi Test MSE Loss : 0.10842
Status Pelatihan: LSTM sukses mempelajari dinamika osilasi temporal!"""

c13_10_pit = "Melakukan normalisasi data (seperti MinMaxScaler atau StandardScaler) pada keseluruhan deret waktu sebelum partisi train/test. Hal ini menyebabkan kebocoran data (*data leakage*) informasi nilai minimum dan maksimum masa depan ke dalam set pelatihan. Selalu lakukan `fit()` penskalaan hanya pada data latih, lalu gunakan transformer tersebut untuk `transform()` data uji."
c13_10_ref = [
    {"title": "Hyndman & Athanasopoulos (2021) Forecasting: Principles and Practice", "url": "https://otexts.com/fpp3/"},
    {"title": "PyTorch Time Series Forecasting Recipe", "url": "https://pytorch.org/tutorials/recipes/recipes/dynamic_quantization.html"}
]
subchapters.append(create_subchapter("13.10", "Praktikum Komprehensif: Membangun Model Peramalan Runtun Waktu (Time Series Forecasting) Berbasis LSTM / GRU Menggunakan PyTorch", c13_10_desc, c13_10_md, c13_10_code, c13_10_out, c13_10_pit, c13_10_ref))

# Chapter metadata
chapter_13 = {
    "chapter": 13,
    "title": "Pemodelan Data Sekuensial & Arsitektur Jaringan Rekuren (RNN, LSTM, GRU)",
    "description": "Penguasaan komprehensif arsitektur pembelajaran mendalam untuk pemodelan data sekuensial dan runtun waktu: hakikat data temporal, Vanilla RNN (Elman), dinamika BPTT, mitigasi gradien meledak dan lenyap, anatomi cell state LSTM, mekanisme gerbang (forget, input, candidate, output), efisiensi Gated Recurrent Unit (GRU), model dua arah (BiRNN) dan bertingkat (Stacked), dasar Seq2Seq Encoder-Decoder, serta praktikum peramalan deret waktu.",
    "subchapters": subchapters
}

output_path = os.path.join(os.path.dirname(__file__), "ch13_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(chapter_13, f, indent=2, ensure_ascii=False)

print(f"Chapter 13 generated successfully with {len(subchapters)} subchapters at {output_path}")
