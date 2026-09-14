import { DocSectionItem } from "@/components/modul/doc-reader-layout";
import { ModuleSection } from "@/types/module-drive";
import { slugify } from "@/lib/utils";

/**
 * Universal Curriculum Enricher — Domain-Aware Specialized AI Engine
 *
 * Mengubah daftar ModuleSection standar dari seluruh kategori AI Velqora menjadi
 * materi ensiklopedis otentik sesuai bidang masing-masing (Deep Learning, Computer Vision,
 * NLP, Reinforcement Learning, Generative AI, MLOps, Data Science, Robotics, dll.).
 * 
 * Menghindari penyeragaman materi ke Machine Learning umum dengan menyediakan formulasi matematis,
 * pustaka resmi (PyTorch, OpenCV, Transformers, Gymnasium, FastAPI, Spark), tabel parameter,
 * dan implementasi kode Python yang relevan untuk setiap domain.
 */

interface DomainProfile {
  domainName: string;
  frameworks: string;
  foundations: string;
  mathTitle: string;
  mathFormula: string;
  mathExplanation: string;
  defaultCode: (subtopic: string, chapter: string) => string;
  parameterRows: Array<{ param: string; type: string; defaultValue: string; desc: string }>;
  bestPractices: string[];
}

/**
 * Mendeteksi profil domain AI spesifik berdasarkan nama kategori dan topik
 */
function resolveDomainProfile(categoryName: string, chapterTitle: string, subtopicTitle: string): DomainProfile {
  const norm = `${categoryName} ${chapterTitle} ${subtopicTitle}`.toLowerCase();

  // 0. Data Analyst & Business Intelligence Specializations
  if (norm.includes("data analyst") || norm.includes("analisis data") || norm.includes("business intelligence") || norm.includes("analyst") || norm.includes("bi ")) {
    if (norm.includes("sql") || norm.includes("query") || norm.includes("database") || norm.includes("join") || norm.includes("window")) {
      return {
        domainName: "Data Analytics (SQL & RDBMS)",
        frameworks: "PostgreSQL, ANSI SQL, CTE, Window Functions",
        foundations: `Dalam analisis data relasional, penguasaan SQL tingkat lanjut memungkinkan ekstraksi wawasan bisnis langsung dari Data Warehouse tanpa membebani memori lokal. Penggunaan Window Functions dan Common Table Expressions (CTE) memisahkan tahapan logika transformasi data secara deklaratif dan modular.`,
        mathTitle: "Relasi Logika Agregasi & Window Partition",
        mathFormula: `$$\\text{Cohort Retention Ratio}(m, t) = \\frac{|\\mathcal{U}_m \\cap \\mathcal{A}_{m+t}|}{|\\mathcal{U}_m|} \\times 100\\%$$

$$\\text{Moving Average}_k(t) = \\frac{1}{k} \\sum_{i=0}^{k-1} y(t-i)$$`,
        mathExplanation: `Di mana $\\mathcal{U}_m$ adalah kohort pengguna yang diakuisisi pada periode $m$, dan $\\mathcal{A}_{m+t}$ merepresentasikan pengguna yang tetap aktif bertransaksi pada $t$ periode setelahnya.`,
        defaultCode: (sub, chap) => `-- Query Analisis Praktikum: ${sub}
WITH transaksi_agregat AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', order_date) AS bulan_transaksi,
        total_amount,
        ROW_NUMBER() OVER (
            PARTITION BY customer_id
            ORDER BY order_date ASC
        ) AS transaksi_ke,
        LAG(total_amount, 1) OVER (
            PARTITION BY customer_id
            ORDER BY order_date ASC
        ) AS nominal_sebelumnya
    FROM sales.orders
    WHERE order_status = 'completed'
)
SELECT
    bulan_transaksi,
    COUNT(DISTINCT customer_id) AS pelanggan_aktif,
    ROUND(AVG(total_amount), 2) AS rata_rata_pembelian,
    ROUND(SUM(total_amount), 2) AS total_omset
FROM transaksi_agregat
GROUP BY 1
ORDER BY 1;`,
        parameterRows: [
          { param: "PARTITION BY", type: "Klausa Window", defaultValue: "customer_id", desc: "Membagi himpunan baris menjadi partisi terpisah sebelum operasi agregasi berjalan." },
          { param: "ROWS BETWEEN", type: "Window Frame", defaultValue: "2 PRECEDING AND CURRENT ROW", desc: "Membatasi jendela baris fisik untuk kalkulasi metrik bergerak (rolling average)." },
          { param: "COALESCE", type: "Fungsi Null", defaultValue: "0 atau default", desc: "Menggantikan nilai NULL yang dihasilkan oleh operasi OUTER JOIN agar integritas kalkulasi terjaga." },
        ],
        bestPractices: [
          "Hindari penggunaan SELECT * pada tabel produksi skala besar guna mengurangi overhead I/O dan transfer jaringan.",
          "Gunakan Common Table Expressions (CTE) untuk memecah logika query bersarang yang kompleks agar mudah dibaca dan di-debug.",
          "Verifikasi rencana eksekusi menggunakan EXPLAIN ANALYZE guna memastikan pemanfaatan indeks berjalan optimal.",
        ],
      };
    }

    if (norm.includes("pandas") || norm.includes("wrangling") || norm.includes("cleaning") || norm.includes("rfm")) {
      return {
        domainName: "Data Analytics (Pandas & Wrangling)",
        frameworks: "Pandas 2.0+, NumPy, PyArrow Backend",
        foundations: `Manipulasi data terstruktur dengan Pandas berfokus pada efisiensi memori, operasi berbasis vektor (*vectorized operations*), dan transformasi data relasional. Transformasi yang tepat menghindari loop Python murni yang lambat dan mengoptimalkan representasi tipe data kolom (*downcasting* numerik dan tipe *category*).`,
        mathTitle: "Formulasi Segmentasi RFM & Agregasi",
        mathFormula: `$$\\text{RFM Score} = w_R \\cdot R_{\\text{rank}} + w_F \\cdot F_{\\text{rank}} + w_M \\cdot M_{\\text{rank}}$$

$$\\text{IQR} = Q_3 - Q_1, \\quad \\text{Batas Outlier} = [Q_1 - 1.5 \\cdot \\text{IQR}, \\; Q_3 + 1.5 \\cdot \\text{IQR}]$$`,
        mathExplanation: `Di mana $R$ (Recency) mengukur kebaruan transaksi terakhir, $F$ (Frequency) menghitung intensitas transaksi, $M$ (Monetary) mengukur total kontribusi pengeluaran, dan $Q_1, Q_3$ melambangkan kuartil data untuk deteksi data pencilan (outlier).`,
        defaultCode: (sub, chap) => `# Praktikum Analisis Data: ${sub}
import pandas as pd
import numpy as np

# Inisialisasi dataset transaksi sintetis
np.random.seed(42)
n_records = 200
data = {
    "customer_id": np.random.randint(1001, 1050, n_records),
    "total_amount": np.random.exponential(scale=250000, size=n_records).round(-3),
    "category": np.random.choice(["Elektronik", "Fashion", "Kebutuhan Rumah", "Makanan"], size=n_records)
}
df = pd.DataFrame(data)

# Pipeline transformasi: Agregasi RFM dan Ringkasan Kategori
summary = (
    df.groupby("category", observed=True)
    .agg(
        total_omset=("total_amount", "sum"),
        rata_rata_transaksi=("total_amount", "mean"),
        jumlah_transaksi=("customer_id", "count")
    )
    .sort_values("total_omset", ascending=False)
    .reset_index()
)

print("Ringkasan Metrik Transaksi:")
print(summary.to_string(index=False))`,
        parameterRows: [
          { param: "observed", type: "Boolean", defaultValue: "True", desc: "Mencegah alokasi memori kosong untuk kombinasi kategori yang tidak memiliki data riil." },
          { param: "aggfunc", type: "String / Dict", defaultValue: "'sum' / 'mean'", desc: "Fungsi agregasi deterministik untuk meringkas distribusi baris per partisi." },
          { param: "dtype='category'", type: "Tipe Data", defaultValue: "Object -> Category", desc: "Mengurangi konsumsi RAM hingga 80% pada kolom string dengan nilai berulang." },
        ],
        bestPractices: [
          "Terapkan Method Chaining yang terstruktur dengan tanda kurung buka-tutup untuk meningkatkan keterbacaan kode pipa analisis.",
          "Gunakan tipe data numerik terkecil yang memadai (misal int32 atau float32) saat memproses dataset berukuran di atas 100 ribu baris.",
          "Lakukan validasi tipe data dan deteksi nilai kosong di awal pipa transformasi sebelum operasi agregasi dieksekusi.",
        ],
      };
    }

    if (norm.includes("visualisasi") || norm.includes("matplotlib") || norm.includes("seaborn") || norm.includes("dashboard") || norm.includes("chart")) {
      return {
        domainName: "Data Analytics (Visualisasi Data)",
        frameworks: "Matplotlib (OOP Architecture), Seaborn, Plotly",
        foundations: `Visualisasi data efektif dibangun di atas hierarki visual yang jelas (*Visual Hierarchy*) dan teori persepsi grafis Bertin. Pendekatan berorientasi objek (*Object-Oriented API*) pada Matplotlib memberikan kendali penuh terhadap setiap elemen kanvas, sumbu, anotasi, dan palet warna yang ramah aksesibilitas (*color-blind friendly*).`,
        mathTitle: "Prinsip Data-to-Ink Ratio & Skala Visual",
        mathFormula: `$$\\text{Data-Ink Ratio} = \\frac{\\text{Tinta yang mewakili data riil}}{\\text{Total tinta yang digunakan pada grafik}} \\approx 1.0$$

$$z_i = \\frac{x_i - \\min(X)}{\\max(X) - \\min(X)}$$`,
        mathExplanation: `Prinsip Edward Tufte menyatakan bahwa setiap elemen grafis (garis grid, bingkai, label) yang tidak menyampaikan informasi data baru harus diminimalkan guna memusatkan atensi kognitif audiens pada pola inti.`,
        defaultCode: (sub, chap) => `# Praktikum Visualisasi Data Berbasis Objek (OOP): ${sub}
import matplotlib.pyplot as plt
import numpy as np

kategori = ["Elektronik", "Fashion", "Otomotif", "Makanan", "Buku"]
pendapatan = [145.2, 98.4, 76.8, 64.0, 42.1]
pertumbuhan = [12.4, 8.1, -3.2, 15.6, 2.0]

fig, ax1 = plt.subplots(figsize=(9, 5), dpi=100)

# Bar plot pendapatan utama
warna_bar = ["#0284C7" if p >= 0 else "#EF4444" for p in pertumbuhan]
bars = ax1.bar(kategori, pendapatan, color=warna_bar, width=0.55, edgecolor="none")

# Anotasi langsung di atas batang
for bar in bars:
    tinggi = bar.get_height()
    ax1.annotate(f"Rp {tinggi:.1f}M",
                 xy=(bar.get_x() + bar.get_width() / 2, tinggi),
                 xytext=(0, 4), textcoords="offset points",
                 ha="center", va="bottom", fontsize=9, fontweight="semibold")

ax1.set_title("Distribusi Pendapatan & Pertumbuhan Tahunan per Kategori", fontsize=12, pad=15)
ax1.set_ylabel("Pendapatan (Miliar IDR)", fontsize=10)
ax1.spines["top"].set_visible(False)
ax1.spines["right"].set_visible(False)
plt.tight_layout()
print("Grafik profesional berhasil dibangun.")`,
        parameterRows: [
          { param: "figsize", type: "Tuple (w, h)", defaultValue: "(9, 5)", desc: "Rasio dimensi kanvas gambar dalam satuan inci standar penerbitan." },
          { param: "dpi", type: "Integer", defaultValue: "100", desc: "Kerapatan piksel per inci untuk ketajaman visual di layar maupun dokumen cetak." },
          { param: "tight_layout", type: "Fungsi", defaultValue: "Aktif", desc: "Menyesuaikan bantalan tepi secara otomatis agar label sumbu tidak terpotong." },
        ],
        bestPractices: [
          "Gunakan palet warna yang memiliki kontras teruji dan hindari penggunaan kombinasi merah-hijau murni untuk memastikan keterbacaan universal.",
          "Hapus garis bingkai atas dan kanan (*spines*) untuk mengurangi distorsi visual yang tidak informatif.",
          "Berikan judul grafik yang menyatakan kesimpulan utama (*actionable title*), bukan sekadar menyebutkan nama variabel pada sumbu.",
        ],
      };
    }

    if (norm.includes("statistik") || norm.includes("hipotesis") || norm.includes("t-test") || norm.includes("anova") || norm.includes("chi-square") || norm.includes("distribusi")) {
      return {
        domainName: "Data Analytics (Statistika Bisnis & Inferensial)",
        frameworks: "SciPy Stats, Statsmodels, NumPy",
        foundations: `Statistika bisnis menyediakan kerangka kerja kuantitatif untuk mengambil keputusan berbasis bukti di tengah ketidakpastian. Analisis memadukan statistika deskriptif (pemusatan dan dispersi yang kokoh terhadap outlier) serta statistika inferensial (uji hipotesis, penaksiran interval kepercayaan, dan pemodelan hubungan bivariat).`,
        mathTitle: "Formulasi Uji Hipotesis & Interval Kepercayaan",
        mathFormula: `$$\\text{CI}_{95\\%} = \\bar{x} \\pm t_{\\alpha/2, \\; df} \\cdot \\frac{s}{\\sqrt{n}}$$

$$t_{\\text{Welch}} = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}, \\quad \\chi^2 = \\sum_{i=1}^k \\frac{(O_i - E_i)^2}{E_i}$$`,
        mathExplanation: `Di mana $\\bar{x}$ adalah rata-rata sampel, $s$ adalah standar deviasi sampel, $n$ melambangkan ukuran sampel, $O_i$ adalah frekuensi teramati, dan $E_i$ merupakan frekuensi teoritis yang diharapkan jika hipotesis nol ($H_0$) benar.`,
        defaultCode: (sub, chap) => `# Pengujian Hipotesis Statistik Inferensial: ${sub}
from scipy import stats
import numpy as np

# Data eksperimen A/B Testing tingkat konversi
np.random.seed(42)
grup_kontrol = np.random.normal(loc=12.5, scale=2.8, size=150)
grup_variasi = np.random.normal(loc=13.4, scale=3.1, size=150)

# Uji Welch's t-test (tidak mengasumsikan varians kedua populasi sama)
t_stat, p_val = stats.ttest_ind(grup_variasi, grup_kontrol, equal_var=False)

print(f"Rata-rata Grup Kontrol : {np.mean(grup_kontrol):.2f}%")
print(f"Rata-rata Grup Variasi : {np.mean(grup_variasi):.2f}%")
print(f"Nilai t-hitung         : {t_stat:.3f}")
print(f"Nilai p-value          : {p_val:.4f}")

alpha = 0.05
if p_val < alpha:
    print("Keputusan: Tolak H0. Terdapat perbedaan performa yang signifikan secara statistik.")
else:
    print("Keputusan: Gagal tolak H0. Belum cukup bukti statistik untuk menyatakan ada perbedaan.")`,
        parameterRows: [
          { param: "equal_var", type: "Boolean", defaultValue: "False", desc: "Menerapkan uji Welch's t-test yang lebih kokoh ketika varians kedua sampel tidak identik." },
          { param: "alpha (α)", type: "Float", defaultValue: "0.05", desc: "Tingkat signifikansi batas toleransi kesalahan Tipe I (False Positive)." },
          { param: "confidence", type: "Float", defaultValue: "0.95", desc: "Tingkat keyakinan probabilitas bahwa parameter populasi berada dalam rentang estimasi." },
        ],
        bestPractices: [
          "Selalu uji asumsi normalitas (misal via Shapiro-Wilk) sebelum memilih antara uji parametrik (t-test/ANOVA) atau non-parametrik (Mann-Whitney U).",
          "Jangan mengandalkan p-value semata; selalu sertakan ukuran efek (*Effect Size* seperti Cohen's d) dan estimasi interval kepercayaan.",
          "Laporkan median dan Interquartile Range (IQR) sebagai alternatif mean dan standar deviasi apabila distribusi data condong miring (*skewed*).",
        ],
      };
    }

    // Default umum Data Analyst
    return {
      domainName: "Data Analytics & Business Intelligence",
      frameworks: "Python (Pandas, NumPy, Matplotlib, Seaborn), SQL, SciPy",
      foundations: `Kurikulum Data Analyst membekali praktisi dengan kemampuan end-to-end dalam mengubah data mentah menjadi wawasan strategis. Alur kerja mencakup siklus CRISP-DM: pemahaman bisnis, eksplorasi data mendalam, pembersihan anomali, agregasi metrik kunci, dan penyampaian rekomendasi berbasis data.`,
      mathTitle: "Ukuran Pemusatan, Variabilitas, & Korelasi",
      mathFormula: `$$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i, \\quad s = \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})^2}$$

$$r_{xy} = \\frac{\\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^n (x_i - \\bar{x})^2 \\cdot \\sum_{i=1}^n (y_i - \\bar{y})^2}}$$`,
      mathExplanation: `Di mana $\\bar{x}$ melambangkan mean sampel, $s$ merupakan deviasi standar untuk mengukur dispersi data dari titik pusat, dan $r_{xy}$ merepresentasikan koefisien korelasi Pearson antara dua variabel kuantitatif pada rentang $[-1, 1]$.`,
      defaultCode: (sub, chap) => `# Praktikum Komputasi Analisis Data: ${sub}
import pandas as pd
import numpy as np

# Simulasi metrik bisnis 12 bulan
np.random.seed(42)
bulan = [f"2026-{m:02d}" for m in range(1, 13)]
pengunjung = np.random.randint(15000, 30000, size=12)
konversi = np.random.uniform(2.1, 4.5, size=12)
pendapatan = pengunjung * (konversi / 100) * 150000

df_tren = pd.DataFrame({
    "Bulan": bulan,
    "Pengunjung": pengunjung,
    "Conversion_Rate": konversi.round(2),
    "Estimasi_Revenue": pendapatan.round(-3)
})

print("Tabel Tren Kinerja Bisnis:")
print(df_tren.head(6).to_string(index=False))`,
      parameterRows: [
        { param: "aggfunc", type: "String / List", defaultValue: "['mean', 'median']", desc: "Menghitung nilai pemusatan ganda untuk membandingkan simetri distribusi data." },
        { param: "subset", type: "List Kolom", defaultValue: "Kunci Unik", desc: "Membatasi cakupan verifikasi data duplikat pada kolom identitas utama." },
        { param: "inplace", type: "Boolean", defaultValue: "False", desc: "Menghindari mutasi objek asli secara langsung untuk menjaga kemurnian pipeline fungsional." },
      ],
      bestPractices: [
        "Awali setiap sesi analisis dengan perumusan pertanyaan bisnis yang spesifik, terukur, dan dapat ditindaklanjuti.",
        "Dokumentasikan asumsi dan batasan data secara transparan sebelum menarik kesimpulan strategis.",
        "Padukan tabel data ringkas dengan grafik visual yang memiliki hierarki fokus yang tegas.",
      ],
    };
  }

  // 1. Deep Learning & Neural Networks
  if (norm.includes("deep learning") || norm.includes("pembelajaran mendalam") || norm.includes("neural network") || norm.includes("perceptron") || norm.includes("backprop")) {
    return {
      domainName: "Deep Learning",
      frameworks: "PyTorch (torch.nn, autograd, torch.optim) & CUDA Acceleration",
      foundations: `Dalam domain **Deep Learning**, topik ini berfokus pada representasi fitur berjenjang (*Hierarchical Feature Representation*) di mana jaringan saraf tiruan mengekstraksi pola dari level rendah (tepi, bobot lokal) hingga level semantik abstrak tingkat tinggi. Melalui optimasi fungsi objektif non-konveks, parameter bobot $W$ dan bias $b$ disesuaikan menggunakan turunan parsial aturan rantai (*chain rule*).`,
      mathTitle: "Formulasi Forward Pass & Backpropagation",
      mathFormula: `$$z^{[l]} = W^{[l]} a^{[l-1]} + b^{[l]}, \\quad a^{[l]} = \\sigma\\big(z^{[l]}\\big)$$

$$\\mathcal{L}_{\\text{CE}} = -\\frac{1}{N} \\sum_{i=1}^N \\sum_{c=1}^C y_{i,c} \\log \\hat{y}_{i,c}$$

$$\\frac{\\partial \\mathcal{L}}{\\partial W^{[l]}} = \\delta^{[l]} \\big(a^{[l-1]}\\big)^T, \\quad \\delta^{[l]} = \\big(W^{[l+1]}\\big)^T \\delta^{[l+1]} \\odot \\sigma'\\big(z^{[l]}\\big)$$`,
      mathExplanation: `Di mana $W^{[l]}$ adalah matriks bobot lapisan ke-$l$, $\\sigma(\\cdot)$ melambangkan fungsi aktivasi non-linear (seperti ReLU atau GELU), $\\mathcal{L}_{\\text{CE}}$ adalah fungsi kerugian Cross-Entropy, dan $\\delta^{[l]}$ merupakan vektor galat gradien per lapisan.`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum Deep Learning: ${sub}
import torch
import torch.nn as nn
import torch.optim as optim

class DeepNeuralNetwork(nn.Module):
    def __init__(self, input_dim=64, hidden_dim=128, output_dim=10):
        super(DeepNeuralNetwork, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(p=0.2),
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.GELU(),
            nn.Linear(hidden_dim // 2, output_dim)
        )

    def forward(self, x):
        return self.network(x)

# Inisialisasi model dan tensor sintetis
torch.manual_seed(42)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = DeepNeuralNetwork().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)

# Simulasi forward pass dan perhitungan backward pass
X_batch = torch.randn(32, 64).to(device)
y_batch = torch.randint(0, 10, (32,)).to(device)

optimizer.zero_grad()
outputs = model(X_batch)
loss = criterion(outputs, y_batch)
loss.backward()
optimizer.step()

print(f"Status Eksekusi  : Device [{device}]")
print(f"Batch Loss       : {loss.item():.4f}")
print(f"Output Shape     : {outputs.shape}")
print("Pembaruan gradien bobot neural network berhasil dijalankan.")`,
      parameterRows: [
        { param: "learning_rate (η)", type: "Float", defaultValue: "0.001", desc: "Kecepatan pembaruan bobot optimizer (AdamW)." },
        { param: "hidden_dim", type: "Integer", defaultValue: "128", desc: "Jumlah neuron pada lapisan tersembunyi (hidden layer)." },
        { param: "dropout_rate", type: "Float [0, 1)", defaultValue: "0.20", desc: "Probabilitas regularisasi deaktifasi neuron untuk mencegah overfitting." },
        { param: "weight_decay (L2)", type: "Float", defaultValue: "1e-4", desc: "Koefisien penalti norma bobot untuk stabilitas konvergensi." },
      ],
      bestPractices: [
        "Terapkan Batch Normalization atau Layer Normalization untuk menstabilkan distribusi aktivasi antar lapisan (*Internal Covariate Shift*).",
        "Gunakan Learning Rate Scheduler (seperti Cosine Annealing dengan Warmup) guna menghindari terjebak di local minima sub-optimal.",
        "Pantau gradien dengan Gradient Clipping (`torch.nn.utils.clip_grad_norm_`) untuk mengantisipasi fenomena *exploding gradients*.",
      ],
    };
  }

  // 2. Computer Vision & Pengolahan Citra
  if (norm.includes("computer vision") || norm.includes("vision") || norm.includes("citra") || norm.includes("gambar") || norm.includes("yolo") || norm.includes("cnn") || norm.includes("segmentasi")) {
    return {
      domainName: "Computer Vision",
      frameworks: "OpenCV (cv2), PyTorch Torchvision, Albumentations",
      foundations: `Dalam domain **Computer Vision**, sistem memproses data spasial 2D/3D (matriks piksel) untuk mengidentifikasi fitur geometris, tekstur, dan semantik visual. Konvolusi diskrit memanfaatkan kernel spasial (*filter*) untuk mengekstraksi peta fitur (*feature maps*) yang invarian terhadap translasi spasial objek dalam citra.`,
      mathTitle: "Operasi Konvolusi 2D & Dimensi Feature Map",
      mathFormula: `$$S(i, j) = (I * K)(i, j) = \\sum_{m} \\sum_{n} I(i - m, j - n) \\cdot K(m, n)$$

$$W_{\\text{out}} = \\left\\lfloor \\frac{W_{\\text{in}} - K + 2P}{S} \\right\\rfloor + 1$$

$$\\text{IoU} = \\frac{\\text{Area}(B_{\\text{pred}} \\cap B_{\\text{gt}})}{\\text{Area}(B_{\\text{pred}} \\cup B_{\\text{gt}})}$$`,
      mathExplanation: `Di mana $I$ adalah citra masukan, $K$ adalah kernel konvolusi, $W$ adalah dimensi lebar, $P$ adalah padding, $S$ adalah stride langkah geser, dan $\\text{IoU}$ adalah metrik Intersection over Union untuk deteksi objek.`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum Computer Vision: ${sub}
import numpy as np

def apply_2d_convolution(image, kernel, stride=1, padding=1):
    # Tambahkan zero padding
    if padding > 0:
        padded = np.pad(image, ((padding, padding), (padding, padding)), mode='constant')
    else:
        padded = image
    
    H_in, W_in = image.shape
    K_h, K_w = kernel.shape
    H_out = int((H_in - K_h + 2 * padding) / stride) + 1
    W_out = int((W_in - K_w + 2 * padding) / stride) + 1
    
    output = np.zeros((H_out, W_out), dtype=np.float32)
    for i in range(H_out):
        for j in range(W_out):
            r_start, c_start = i * stride, j * stride
            region = padded[r_start:r_start + K_h, c_start:c_start + K_w]
            output[i, j] = np.sum(region * kernel)
    return output

# Contoh Kernel Sobel Horizontal untuk Deteksi Tepi Citra
sobel_kernel_x = np.array([[-1, 0, 1],
                           [-2, 0, 2],
                           [-1, 0, 1]], dtype=np.float32)

# Citra sintetis 8x8 piksel
synthetic_img = np.random.randint(0, 256, (8, 8)).astype(np.float32)
edge_map = apply_2d_convolution(synthetic_img, sobel_kernel_x, stride=1, padding=1)

print(f"Dimensi Input Image       : {synthetic_img.shape}")
print(f"Dimensi Output Feature Map: {edge_map.shape}")
print(f"Intensitas Respon Tepi    : Min={edge_map.min():.2f}, Max={edge_map.max():.2f}")
print("Ekstraksi fitur konvolusi spasial berhasil.")`,
      parameterRows: [
        { param: "kernel_size", type: "Tuple (K_h, K_w)", defaultValue: "(3, 3)", desc: "Ukuran jendela filter konvolusi spasial." },
        { param: "stride", type: "Integer", defaultValue: "1", desc: "Besaran langkah pergeseran jendela konvolusi pada citra." },
        { param: "padding", type: "Integer / Str", defaultValue: "'same' (1)", desc: "Jumlah piksel nol di sekeliling batas citra masukan." },
        { param: "iou_threshold", type: "Float", defaultValue: "0.50", desc: "Ambang batas overlap deteksi objek untuk Non-Maximum Suppression (NMS)." },
      ],
      bestPractices: [
        "Normalisasi nilai intensitas piksel citra ke rentang [0, 1] atau standardisasi z-score terhadap kanal RGB ImageNet.",
        "Gunakan augmentasi citra variatif (random rotation, scaling, color jitter) untuk meningkatkan generalisasi visual.",
        "Pertimbangkan Non-Maximum Suppression (NMS) untuk mengeliminasi bounding box redundan pada pipeline object detection.",
      ],
    };
  }

  // 3. Natural Language Processing (NLP) & Pemrosesan Bahasa Alami
  if (norm.includes("natural language") || norm.includes("nlp") || norm.includes("bahasa") || norm.includes("teks") || norm.includes("token") || norm.includes("bert") || norm.includes("embedding")) {
    return {
      domainName: "Natural Language Processing",
      frameworks: "Hugging Face Transformers, NLTK, Spacy, PyTorch",
      foundations: `Dalam **Natural Language Processing (NLP)**, teks tak terstruktur diubah menjadi representasi numerik bernilai riil (vektor embedding semantik) melalui tokenisasi sub-kata (*Byte-Pair Encoding* atau *WordPiece*). Mekanisme *Self-Attention* memungkinkan model menangkap ketergantungan kontekstual antar-kata tanpa memandang jarak jarak linier dalam kalimat.`,
      mathTitle: "Scaled Dot-Product Attention & TF-IDF",
      mathFormula: `$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V$$

$$\\text{MHA}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$

$$\\text{TF-IDF}(t, d, D) = \\text{TF}(t, d) \\times \\ln\\left( \\frac{1 + |D|}{1 + |\\{d \\in D : t \\in d\\}|} \\right) + 1$$`,
      mathExplanation: `Di mana $Q$ (Query), $K$ (Key), dan $V$ (Value) adalah proyeksi linear token, $d_k$ adalah dimensi skalar skala pembagi agar gradien tidak jenuh pada softmax, dan $\\text{TF-IDF}$ mengukur bobot pentingnya token dalam korpus dokumen.`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum NLP: ${sub}
import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    scores = np.matmul(Q, K.swapaxes(-1, -2)) / np.sqrt(d_k)
    
    if mask is not None:
        scores = np.where(mask == 0, -1e9, scores)
        
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    attention_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    output = np.matmul(attention_weights, V)
    return output, attention_weights

# Simulasi sekuens 4 token dengan dimensi embedding d_k = 8
np.random.seed(42)
seq_len, d_k = 4, 8
Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_k)

output, attn_weights = scaled_dot_product_attention(Q, K, V)

print(f"Panjang Sekuens Token   : {seq_len}")
print(f"Dimensi Embedding (d_k) : {d_k}")
print(f"Matriks Bobot Perhatian :\\n{np.round(attn_weights, 3)}")
print(f"Bentuk Vektor Kontekstual: {output.shape}")
print("Mekanisme Self-Attention berhasil memetakan representasi kontekstual.")`,
      parameterRows: [
        { param: "vocab_size", type: "Integer", defaultValue: "32,000", desc: "Kapasitas leksikon token tokenizer." },
        { param: "embedding_dim (d_model)", type: "Integer", defaultValue: "512 atau 768", desc: "Dimensi vektor representasi semantik token." },
        { param: "num_heads", type: "Integer", defaultValue: "8 atau 12", desc: "Jumlah kepala proyeksi multi-head attention paralel." },
        { param: "max_seq_length", type: "Integer", defaultValue: "512", desc: "Batas maksimal panjang jendela konteks sekuens kalimat." },
      ],
      bestPractices: [
        "Selalu gunakan subword tokenizer (BPE / SentencePiece) untuk meminimalisir masalah Out-of-Vocabulary (OOV).",
        "Terapkan masking attention pada token padding agar komputasi bobot perhatian tidak terdistorsi oleh noise.",
        "Lakukan fine-tuning model pre-trained (seperti IndoBERT / RoBERTa) untuk tugas klasifikasi teks spesifik domain.",
      ],
    };
  }

  // 4. Reinforcement Learning (RL)
  if (norm.includes("reinforcement") || norm.includes("penguatan") || norm.includes("bellman") || norm.includes("q-learning") || norm.includes("policy gradient") || norm.includes("mdp")) {
    return {
      domainName: "Reinforcement Learning",
      frameworks: "Gymnasium, Stable-Baselines3, PyTorch",
      foundations: `Dalam **Reinforcement Learning (RL)**, agen otonom belajar mengambil tindakan (*actions*) dalam lingkungan dinamis (*environment*) untuk memaksimalkan imbalan kumulatif (*cumulative return*). Kerangka kerja ini dimodelkan secara matematis sebagai *Markov Decision Process* (MDP) beranggotakan tupel $(\\mathcal{S}, \\mathcal{A}, \\mathcal{P}, \\mathcal{R}, \\gamma)$.`,
      mathTitle: "Persamaan Bellman & Pembaruan Q-Learning",
      mathFormula: `$$Q^*(s, a) = \\mathcal{R}(s, a) + \\gamma \\sum_{s'} \\mathcal{P}(s' \\mid s, a) \\max_{a'} Q^*(s', a')$$

$$Q(s_t, a_t) \\leftarrow Q(s_t, a_t) + \\alpha \\Big[ r_{t+1} + \\gamma \\max_{a} Q(s_{t+1}, a) - Q(s_t, a_t) \\Big]$$

$$\\nabla_\\theta J(\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta} \\left[ \\sum_{t=0}^T \\nabla_\\theta \\ln \\pi_\\theta(a_t \\mid s_t) \\cdot G_t \\right]$$`,
      mathExplanation: `Di mana $Q(s, a)$ adalah nilai estimasi imbalan aksi pada keadaan $s$, $\\gamma \\in [0, 1)$ adalah faktor diskon imbalan masa depan, $\\alpha$ adalah learning rate temporal difference, dan $G_t$ adalah total diskon return.`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum Reinforcement Learning: ${sub}
import numpy as np

# Inisialisasi Q-Table untuk Grid Environment (4 State, 2 Aksi)
num_states = 4
num_actions = 2
Q_table = np.zeros((num_states, num_actions))

alpha = 0.1   # Learning rate
gamma = 0.95  # Discount factor
epsilon = 0.2 # Eksplorasi epsilon-greedy

# Simulasi satu transisi step: State 1, Action 0 -> Reward +1, Next State 2
state = 1
action = 0 if np.random.rand() > epsilon else np.random.choice(num_actions)
reward = 1.0
next_state = 2

# Pembaruan Temporal Difference (TD Update)
best_next_action_val = np.max(Q_table[next_state])
td_target = reward + gamma * best_next_action_val
td_error = td_target - Q_table[state, action]
Q_table[state, action] += alpha * td_error

print(f"State: {state} | Action: {action} | Reward: {reward} -> Next State: {next_state}")
print(f"TD Target : {td_target:.4f} | TD Error : {td_error:.4f}")
print(f"Tabel Nilai Q Terkini:\\n{np.round(Q_table, 4)}")
print("Iterasi pembelajaran kebijakan berbasis reward berhasil dieksekusi.")`,
      parameterRows: [
        { param: "discount_factor (γ)", type: "Float [0, 1)", defaultValue: "0.99", desc: "Bobot kepentingan imbalan jangka panjang vs imbalan instan." },
        { param: "learning_rate (α)", type: "Float", defaultValue: "0.01 - 0.1", desc: "Besaran langkah adaptasi nilai Q terhadap galat temporal difference." },
        { param: "epsilon (ε)", type: "Float [0, 1]", defaultValue: "1.0 -> 0.05", desc: "Tingkat probabilitas eksplorasi aksi acak (decay over time)." },
        { param: "replay_buffer_size", type: "Integer", defaultValue: "100,000", desc: "Kapasitas memori transisi riwayat pengalaman agen (DQN)." },
      ],
      bestPractices: [
        "Terapkan Replay Buffer teracak untuk memutus korelasi serial antar-sampel transisi berurutan.",
        "Gunakan Target Network terpisah yang diperbarui secara periodik (atau soft-update $\\tau$) guna mencegah osilasi divergen.",
        "Lakukan normalisasi reward untuk menstabilkan variansi gradien optimasi fungsi nilai.",
      ],
    };
  }

  // 5. Large Language Model (LLM) & Generative AI
  if (norm.includes("large language model") || norm.includes("llm") || norm.includes("generative ai") || norm.includes("genai") || norm.includes("generatif") || norm.includes("lora") || norm.includes("rag")) {
    return {
      domainName: "Large Language Models & Generative AI",
      frameworks: "PyTorch, vLLM, Hugging Face PEFT (LoRA), LangChain",
      foundations: `Domain **Large Language Model (LLM) & Generative AI** berfokus pada pemodelan probabilitas gabungan sekuens token dan sintesis konten baru. Melalui arsitektur Transformer Decoder-only autoregresif, model memprediksi distribusi probabilitas token berikutnya (*Next-Token Prediction*), dengan efisiensi fine-tuning parameter terdistribusi via *Low-Rank Adaptation* (LoRA).`,
      mathTitle: "Causal Language Modeling & Dekomposisi LoRA",
      mathFormula: `$$\\mathcal{L}_{\\text{CLM}}(\\theta) = -\\sum_{t=1}^T \\ln P_\\theta(x_t \\mid x_1, x_2, \\dots, x_{t-1})$$

$$W = W_0 + \\Delta W = W_0 + \\frac{\\alpha}{r} (B \\cdot A), \\quad B \\in \\mathbb{R}^{d \\times r}, A \\in \\mathbb{R}^{r \\times k}$$

$$\\text{VRAM}_{\\text{KV}} = 2 \\times \\text{Batch} \\times \\text{SeqLen} \\times n_{\\text{layers}} \\times d_{\\text{head}} \\times 2 \\text{ bytes}$$`,
      mathExplanation: `Di mana $\\mathcal{L}_{\\text{CLM}}$ adalah objektif log-likelihood autoregresif, $W_0$ adalah bobot model dasar beku, $r \\ll \\min(d, k)$ adalah rank dekomposisi matriks intrinsik LoRA, dan $\\text{VRAM}_{\\text{KV}}$ memperkirakan konsumsi memori cache konteks.`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum LLM & GenAI: ${sub}
import numpy as np

class LoRALinearSimulation:
    def __init__(self, in_features, out_features, rank=4, alpha=16):
        self.in_features = in_features
        self.out_features = out_features
        self.rank = rank
        self.scaling = alpha / rank
        
        # Bobot dasar beku (W0)
        self.W0 = np.random.randn(out_features, in_features) * 0.02
        # Matriks adaptasi berdimensi rendah A dan B
        self.A = np.random.randn(rank, in_features) * (1 / np.sqrt(in_features))
        self.B = np.zeros((out_features, rank))  # Diinisialisasi nol agar awalnya netral

    def forward(self, x):
        base_out = np.dot(x, self.W0.T)
        lora_out = np.dot(np.dot(x, self.A.T), self.B.T) * self.scaling
        return base_out + lora_out

# Simulasi masukan token berdimensi 768
x = np.random.randn(1, 768)
adapter = LoRALinearSimulation(768, 768, rank=8, alpha=16)
out = adapter.forward(x)

params_full = 768 * 768
params_lora = (768 * 8) + (8 * 768)
print(f"Total Parameter Bobot Penuh  : {params_full:,}")
print(f"Parameter Adapter LoRA (r=8) : {params_lora:,} (Hemat {(1 - params_lora/params_full)*100:.1f}%)")
print(f"Bentuk Vektor Output Inferensi: {out.shape}")
print("Inferensi modul efisien parameter (PEFT) berhasil disimulasikan.")`,
      parameterRows: [
        { param: "rank (r)", type: "Integer", defaultValue: "8 atau 16", desc: "Dimensi sub-ruang rank dekomposisi matriks LoRA." },
        { param: "lora_alpha (α)", type: "Float", defaultValue: "16 atau 32", desc: "Faktor skala konstan pembaruan bobot adapter." },
        { param: "temperature", type: "Float [0, 2]", defaultValue: "0.70", desc: "Pengendali keragaman sampling token (rendah = deterministik, tinggi = kreatif)." },
        { param: "top_p (Nucleus)", type: "Float (0, 1]", defaultValue: "0.90", desc: "Ambang batas kumulatif pemilihan kandidat token berprobabilitas tertinggi." },
      ],
      bestPractices: [
        "Gunakan KV-Caching (PagedAttention pada vLLM) untuk menghindari re-komputasi token terdahulu pada inferensi sekuensial.",
        "Terapkan kuantisasi 4-bit (QLoRA / AWQ / GPTQ) untuk memuat model skala besar ke VRAM GPU workstation secara efisien.",
        "Bangun arsitektur Retrieval-Augmented Generation (RAG) untuk mengatasi keterbatasan data pengetahuan statis dan halusinasi.",
      ],
    };
  }

  // 6. MLOps & AI Deployment
  if (norm.includes("mlops") || norm.includes("deployment") || norm.includes("serving") || norm.includes("docker") || norm.includes("kubernetes") || norm.includes("monitoring") || norm.includes("drift")) {
    return {
      domainName: "MLOps & AI Deployment",
      frameworks: "FastAPI, Docker, MLflow, Prometheus, DVC",
      foundations: `Domain **MLOps (Machine Learning Operations)** mengintegrasikan prinsip rekayasa perangkat lunak DevOps dengan siklus hidup model AI. Fokus utamanya mencakup otomasi pipeline pengujian (*CI/CD*), pelacakan eksperimen, reproduktibilitas data & model (*versioning*), *containerization*, serta observabilitas produksi untuk mendeteksi degradasi performa akibat pergeseran data (*Data/Concept Drift*).`,
      mathTitle: "Metrik Drift: Population Stability Index (PSI)",
      mathFormula: `$$\\text{PSI} = \\sum_{i=1}^B \\big(P_{\\text{actual}, i} - P_{\\text{expected}, i}\\big) \\times \\ln\\left( \\frac{P_{\\text{actual}, i}}{P_{\\text{expected}, i}} \\right)$$

$$\\text{Throughput} = \\frac{N_{\\text{requests}}}{\\Delta t_{\\text{seconds}}}, \\quad P_{99} = \\text{Persentil}_{99}\\big(\\tau_1, \\tau_2, \\dots, \\tau_N\\big)$$`,
      mathExplanation: `Di mana $P_{\\text{actual}}$ adalah distribusi data produksi, $P_{\\text{expected}}$ adalah distribusi data pelatihan dasar, $\\text{PSI} < 0.1$ mengindikasikan stabilitas, $0.1 \\le \\text{PSI} \\le 0.25$ pergeseran moderat, dan $\\text{PSI} > 0.25$ memicu pemicu retraining otomatis.`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum MLOps: ${sub}
import numpy as np

def calculate_psi(expected, actual, num_buckets=10):
    # Buat bucket kuantil dari data baseline
    percentiles = np.linspace(0, 100, num_buckets + 1)
    bucket_bounds = np.percentile(expected, percentiles)
    bucket_bounds[0] -= 1e-5
    bucket_bounds[-1] += 1e-5

    # Hitung proporsi di setiap bucket
    exp_counts, _ = np.histogram(expected, bins=bucket_bounds)
    act_counts, _ = np.histogram(actual, bins=bucket_bounds)

    exp_pct = exp_counts / len(expected)
    act_pct = act_counts / len(actual)

    # Hindari pembagian nol dengan epsilon
    exp_pct = np.clip(exp_pct, 1e-4, 1.0)
    act_pct = np.clip(act_pct, 1e-4, 1.0)

    psi_value = np.sum((act_pct - exp_pct) * np.log(act_pct / exp_pct))
    return psi_value

# Simulasi data pelatihan vs data produksi satu bulan kemudian
np.random.seed(42)
baseline_data = np.random.normal(0, 1, 1000)
prod_drifted = np.random.normal(0.4, 1.2, 1000)

psi = calculate_psi(baseline_data, prod_drifted)
status = "STABIL" if psi < 0.1 else ("MODERATE DRIFT" if psi <= 0.25 else "SIGNIFICANT DRIFT (RETRAIN)")

print(f"Skor Populasi PSI  : {psi:.4f}")
print(f"Status Kelaikan    : [{status}]")
print("Sistem monitoring mendeteksi kondisi drift data produksi secara otomatis.")`,
      parameterRows: [
        { param: "psi_threshold", type: "Float", defaultValue: "0.20", desc: "Batas toleransi deviasi distribusi fitur sebelum retraining otomatis." },
        { param: "p99_latency_sla", type: "Float (ms)", defaultValue: "150 ms", desc: "Batas atas latensi inferensi 99% request pengguna." },
        { param: "workers", type: "Integer", defaultValue: "4", desc: "Jumlah proses worker asynchronous ASGI (Uvicorn / Gunicorn)." },
        { param: "canary_ratio", type: "Float [0, 1]", defaultValue: "0.10", desc: "Proporsi lalu lintas pengguna ke versi model baru saat rilis bertahap." },
      ],
      bestPractices: [
        "Gunakan model registry terpusat (seperti MLflow atau W&B) dengan tata kelola izin transisi status Staging -> Production.",
        "Terapkan containerization Docker multi-stage build untuk memperkecil ukuran image dan menutup kerentanan dependensi.",
        "Gunakan protokol rilis Canary atau Blue/Green deployment guna menjamin zero downtime saat pembaruan model di produksi.",
      ],
    };
  }

  // 7. Data Science & Data Analyst
  if (norm.includes("data science") || norm.includes("sains data") || norm.includes("data analyst") || norm.includes("analisis data") || norm.includes("eda") || norm.includes("statistik")) {
    return {
      domainName: "Data Science & Data Analytics",
      frameworks: "Pandas, NumPy, SciPy, Matplotlib / Seaborn",
      foundations: `Dalam **Data Science & Data Analytics**, proses diawali dengan *Exploratory Data Analysis* (EDA), kurasi kualitas data, pembersihan nilai hilang/pencilan (*outliers*), hingga inferensi statistik dan validasi hipotesis. Pendekatan analitik menggabungkan pemahaman domain bisnis dengan formulasi metrik kuantitatif terpercaya.`,
      mathTitle: "Korelasi Pearson & Uji Hipotesis Statistik (t-test)",
      mathFormula: `$$r_{xy} = \\frac{\\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^n (x_i - \\bar{x})^2} \\sqrt{\\sum_{i=1}^n (y_i - \\bar{y})^2}}$$

$$t = \\frac{\\bar{X}_1 - \\bar{X}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}, \\quad \\text{IQR} = Q_3 - Q_1$$`,
      mathExplanation: `Di mana $r_{xy} \\in [-1, 1]$ adalah koefisien korelasi linear antar-variabel, $t$ adalah statistik uji Welch untuk membandingkan perbedaan dua populasi tanpa asumsi varians sama, dan $\\text{IQR}$ digunakan mendeteksi pencilan di luar rentang $[Q_1 - 1.5\\text{IQR}, Q_3 + 1.5\\text{IQR}]$.`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum Data Science: ${sub}
import numpy as np

# Simulasi Dataset 2 Variabel Bisnis
np.random.seed(42)
spend_ad = np.random.uniform(10, 100, 50)
revenue = 2.8 * spend_ad + np.random.normal(0, 15, 50)

# 1. Perhitungan Korelasi Pearson
r_pearson = np.corrcoef(spend_ad, revenue)[0, 1]

# 2. Deteksi Pencilan dengan Interquartile Range (IQR)
q25, q75 = np.percentile(revenue, [25, 75])
iqr = q75 - q25
lower_bound = q25 - 1.5 * iqr
upper_bound = q75 + 1.5 * iqr
outliers = revenue[(revenue < lower_bound) | (revenue > upper_bound)]

print(f"Koefisien Korelasi Pearson : {r_pearson:.4f} (Korelasi Kuat Positif)")
print(f"Rentang Batas Normal IQR   : [{lower_bound:.2f}, {upper_bound:.2f}]")
print(f"Jumlah Pencilan Terdeteksi : {len(outliers)}")
print("Pipeline validasi statistik data berhasil dijalankan.")`,
      parameterRows: [
        { param: "significance_level (α)", type: "Float", defaultValue: "0.05", desc: "Ambang batas penolakan hipotesis nol (p-value < 0.05)." },
        { param: "iqr_multiplier", type: "Float", defaultValue: "1.5", desc: "Faktor pengali rentang interkuartil untuk penentuan batas pencilan Tukey." },
        { param: "correlation_threshold", type: "Float", defaultValue: "0.70", desc: "Batas multikolinieritas antar-fitur independen." },
        { param: "missing_strategy", type: "String", defaultValue: "'median' / 'knn'", desc: "Strategi imputasi data kosong pada fitur bertipe kontinu." },
      ],
      bestPractices: [
        "Hindari jebakan korelasi vs kausalitas (*Correlation != Causation*) dengan merancang pengujian A/B terkontrol.",
        "Pisahkan secara ketat data training dan testing sebelum melakukan imputasi data untuk mencegah kebocoran data (*data leakage*).",
        "Visualisasikan distribusi variabel target untuk memeriksa skewness sebelum memilih metrik mean vs median.",
      ],
    };
  }

  // 8. Data Engineering & Big Data
  if (norm.includes("data engineering") || norm.includes("big data") || norm.includes("lakehouse") || norm.includes("spark") || norm.includes("etl") || norm.includes("kafka")) {
    return {
      domainName: "Data Engineering & Big Data AI",
      frameworks: "Apache Spark (PySpark), Apache Kafka, Delta Lake, Apache Airflow",
      foundations: `Dalam **Data Engineering & Big Data**, arsitektur dirancang untuk mengelola aliran data volume raksasa (*Volume, Velocity, Variety*) secara andal. Pipeline ETL/ELT mendistribusikan komputasi transformasi data di kluster server, menyimpan data ke format kolumnar terkompresi (Parquet/Delta), dan menyajikan data bersih ke Feature Store untuk konsumsi model AI.`,
      mathTitle: "Hukum Amdahl Komputasi Terdistribusi & Partisi",
      mathFormula: `$$S_{\\text{latency}}(s) = \\frac{1}{(1 - p) + \\frac{p}{s}}$$

$$N_{\\text{partitions}} = \\left\\lceil \\frac{\\text{Total Raw Size (MB)}}{\\text{Target Partition Size (128 MB)}} \\right\\rceil$$`,
      mathExplanation: `Di mana $p$ adalah proporsi proses yang dapat diparalelkan, $s$ adalah jumlah node pekerja (*workers*), dan partisi menentukan granularitas shuffle jaringan antar-node dalam komputasi MapReduce / Apache Spark.`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum Data Engineering: ${sub}
import json

# Simulasi Pipeline Ekstraksi, Transformasi, dan Pemuatan (ETL)
raw_event_stream = [
    {"user_id": "usr_101", "event": "click", "amount": 0.0, "status": "200"},
    {"user_id": "usr_102", "event": "purchase", "amount": 149.50, "status": "200"},
    {"user_id": "usr_103", "event": "purchase", "amount": -10.0, "status": "400"}, # Anomali
    {"user_id": "usr_104", "event": "checkout", "amount": 89.0, "status": "200"}
]

# Transformasi data: pembersihan anomali dan validasi skema
clean_records = []
for record in raw_event_stream:
    if record["status"] == "200" and record["amount"] >= 0:
        clean_records.append({
            "user_id": record["user_id"],
            "event_type": record["event"].upper(),
            "amount_usd": round(record["amount"], 2),
            "processed_ts": 1726290000
        })

print(f"Jumlah Event Masuk  : {len(raw_event_stream)}")
print(f"Jumlah Event Bersih : {len(clean_records)} (Tersaring {len(raw_event_stream) - len(clean_records)} anomali)")
print(f"Sampel Baris Parquet Bersih:\\n{json.dumps(clean_records[0], indent=2)}")
print("Transformasi pipeline batch berhasil dieksekusi.")`,
      parameterRows: [
        { param: "shuffle_partitions", type: "Integer", defaultValue: "200", desc: "Jumlah partisi default saat operasi join / groupBy pada Spark SQL." },
        { param: "partition_size_mb", type: "Integer", defaultValue: "128 MB", desc: "Ukuran ideal satu berkas partisi Parquet pada Data Lake." },
        { param: "watermark_delay", type: "String", defaultValue: "'10 minutes'", desc: "Toleransi keterlambatan data pada pemrosesan streaming Kafka." },
        { param: "compression_codec", type: "String", defaultValue: "'snappy'", desc: "Format kompresi berkas biner efisien untuk format kolumnar." },
      ],
      bestPractices: [
        "Hindari fenomena Data Skew dengan menambahkan salting key pada operasi JOIN dengan kardinalitas data ekstrem.",
        "Gunakan format tabel penyimpanan ACID modern (Delta Lake / Apache Iceberg) untuk mendukung time-travel audit data.",
        "Implementasikan skema data validation (seperti Great Expectations) sebelum menulis output ke Data Warehouse.",
      ],
    };
  }

  // 9. Vector Database & Retrieval Systems
  if (norm.includes("vector") || norm.includes("retrieval") || norm.includes("vektor") || norm.includes("faiss") || norm.includes("hnsw")) {
    return {
      domainName: "Vector Database & Retrieval Systems",
      frameworks: "FAISS, Qdrant, Milvus, Pinecone, ChromaDB",
      foundations: `Domain **Vector Database & Retrieval System** menangani pencarian kemiripan semantik (*Approximate Nearest Neighbor* / ANN) pada ruang vektor dimensi tinggi. Alih-alih pencarian sekuensial $O(N)$, algoritma berbasis graf (seperti HNSW) atau kuantisasi produk (IVF-PQ) memungkinkan pencarian dokumen berlatensi sub-milidetik untuk jutaan vektor embedding.`,
      mathTitle: "Jarak Cosine & Indeks Hierarchical Navigable Small World (HNSW)",
      mathFormula: `$$\\text{CosineSimilarity}(u, v) = \\frac{u \\cdot v}{\\|u\\|_2 \\|v\\|_2} = \\frac{\\sum_{i=1}^d u_i v_i}{\\sqrt{\\sum_{i=1}^d u_i^2} \\sqrt{\\sum_{i=1}^d v_i^2}}$$

$$\\text{RRF\\_Score}(d) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}$$`,
      mathExplanation: `Di mana $u, v$ adalah representasi vektor embedding teks/citra, $d$ adalah dimensi embedding, dan $\\text{RRF}$ adalah Reciprocal Rank Fusion untuk menggabungkan skor pencarian Dense Vector dengan Sparse BM25 (Hybrid Search).`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum Vector Database: ${sub}
import numpy as np

def cosine_similarity_matrix(query_vec, doc_vectors):
    # Normalisasi L2 vektor
    q_norm = query_vec / np.linalg.norm(query_vec)
    d_norm = doc_vectors / np.linalg.norm(doc_vectors, axis=1, keepdims=True)
    return np.dot(d_norm, q_norm)

# Database vektor sintetis (1000 dokumen, 128 dimensi)
np.random.seed(42)
dim = 128
corpus_embeddings = np.random.randn(1000, dim)
query_embedding = np.random.randn(dim)

similarities = cosine_similarity_matrix(query_embedding, corpus_embeddings)
top_k_indices = np.argsort(similarities)[-3:][::-1]

print(f"Dimensi Vektor Embedding : {dim}")
print(f"Total Dokumen Vektor     : {len(corpus_embeddings):,}")
print("Hasil Pencarian Top-3 Terdekat (Cosine Similarity):")
for rank, idx in enumerate(top_k_indices, 1):
    print(f"  {rank}. Dokumen Index [{idx}] -> Skor: {similarities[idx]:.4f}")
print("Retrieval Approximate Nearest Neighbor berhasil dieksekusi.")`,
      parameterRows: [
        { param: "dimension (d)", type: "Integer", defaultValue: "768 atau 1536", desc: "Panjang vektor embedding yang dihasilkan encoder teks." },
        { param: "M", type: "Integer", defaultValue: "16 atau 32", desc: "Jumlah koneksi tetangga maksimum per node pada graf HNSW." },
        { param: "ef_construction", type: "Integer", defaultValue: "128 atau 200", desc: "Akurasi penelusuran saat membangun indeks graf HNSW." },
        { param: "distance_metric", type: "String", defaultValue: "'cosine' / 'ip'", desc: "Metrik jarak geometris ruang vektor (Cosine, Inner Product, L2)." },
      ],
      bestPractices: [
        "Normalisasikan vektor masukan ke satuan norma $L_2 = 1$ agar perhitungan Cosine Similarity setara dengan Dot Product cepat.",
        "Gunakan Hybrid Search (vektor padat + kata kunci BM25) untuk mengantisipasi kegagalan pencarian istilah spesifik/kode produk.",
        "Terapkan Re-ranking (Cross-Encoder) pada kandidat Top-K teratas untuk meningkatkan relevansi akhir ke LLM.",
      ],
    };
  }

  // 10. AI Security & Adversarial Machine Learning
  if (norm.includes("security") || norm.includes("keamanan") || norm.includes("adversarial") || norm.includes("robustness") || norm.includes("attack")) {
    return {
      domainName: "AI Security & Adversarial Machine Learning",
      frameworks: "Adversarial Robustness Toolbox (ART), PyTorch, CleverHans",
      foundations: `Domain **AI Security & Adversarial Machine Learning** mempelajari kerentanan sistem AI terhadap serangan musuh (*adversarial attacks*), seperti manipulasi data masukan bergradien (FGSM/PGD), peracunan data latih (*data poisoning*), injeksi prompt (*prompt injection*), dan ekstraksi model. Pertahanan dibangun melalui *adversarial training* dan komputasi privasi diferensial (*Differential Privacy*).`,
      mathTitle: "Fast Gradient Sign Method (FGSM) & Perturbasi Musuh",
      mathFormula: `$$x_{\\text{adv}} = x + \\epsilon \\cdot \\text{sign}\\big(\\nabla_x \\mathcal{L}(\\theta, x, y)\\big)$$

$$\\|x_{\\text{adv}} - x\\|_\\infty \\le \\epsilon, \\quad P(\\mathcal{M}(D) \\in S) \\le e^\\epsilon P(\\mathcal{M}(D') \\in S) + \\delta$$`,
      mathExplanation: `Di mana $x$ adalah sampel bersih, $\\epsilon$ mengontrol amplitudo batas perturbasi kasat mata, $\\nabla_x \\mathcal{L}$ adalah turunan kerugian terhadap masukan piksel, dan formulasi kedua adalah kriteria Privasi Diferensial $(\\epsilon, \\delta)$.`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum AI Security: ${sub}
import numpy as np

def fgsm_perturbation_attack(input_features, loss_gradient, epsilon=0.05):
    # Hitung arah tanda gradien
    perturbation = epsilon * np.sign(loss_gradient)
    # Tambahkan perturbasi ke fitur bersih
    adversarial_features = input_features + perturbation
    # Batasi nilai masukan ke rentang sah [0, 1]
    return np.clip(adversarial_features, 0.0, 1.0)

# Simulasi vektor fitur masukan dan gradien galat
np.random.seed(42)
clean_input = np.array([0.25, 0.60, 0.85, 0.10])
mock_gradient = np.array([1.2, -0.8, 0.4, -1.5])
eps = 0.08

adv_input = fgsm_perturbation_attack(clean_input, mock_gradient, epsilon=eps)

print(f"Fitur Masukan Asli       : {clean_input}")
print(f"Fitur Termanipulasi FGSM : {np.round(adv_input, 4)}")
print(f"Deviasi Maksimum (L-inf) : {np.max(np.abs(adv_input - clean_input)):.4f} (<= eps {eps})")
print("Simulasi serangan manipulasi gradien adversarial berhasil dijalankan.")`,
      parameterRows: [
        { param: "epsilon (ε)", type: "Float", defaultValue: "0.03 - 0.10", desc: "Besaran magnitudo kebisingan perturbasi musuh." },
        { param: "norm_type", type: "String", defaultValue: "'Linf' atau 'L2'", desc: "Metrik pengukuran batas jarak perturbasi adversarial." },
        { param: "differential_privacy (ε)", type: "Float", defaultValue: "1.0 - 5.0", desc: "Anggaran privasi (privacy budget) noise diferensial." },
      ],
      bestPractices: [
        "Lakukan Adversarial Training secara rutin dengan menginjeksikan sampel hasil perturbasi FGSM/PGD ke dataset latih.",
        "Sanitasi dan validasi input secara ketat sebelum diteruskan ke model untuk memblokir prompt injection pada LLM.",
        "Gunakan format file bobot aman (*SafeTensors*) alih-alih berkas pickle (.pkl) untuk mencegah eksekusi kode berbahaya.",
      ],
    };
  }

  // 11. AI Ethics, Governance, & Explainable AI
  if (norm.includes("ethics") || norm.includes("governance") || norm.includes("etika") || norm.includes("regulasi") || norm.includes("fairness") || norm.includes("bias") || norm.includes("shap")) {
    return {
      domainName: "AI Ethics & Governance",
      frameworks: "Fairlearn, AIF360, SHAP, LIME",
      foundations: `Domain **AI Ethics & Governance** menjamin sistem kecerdasan buatan dikembangkan secara adil (*fair*), transparan, dapat dipertanggungjawabkan (*accountable*), dan patuh regulasi (seperti EU AI Act, NIST AI RMF, ISO 42001). Audit keadilan memitigasi bias algoritmik terhadap kelompok rentan menggunakan metrik kuantitatif terstandarisasi.`,
      mathTitle: "Disparate Impact Ratio & Nilai Kontribusi Shapley",
      mathFormula: `$$\\text{DIR} = \\frac{P(\\hat{Y} = 1 \\mid A = \\text{Kelompok Tidak Diuntungkan})}{P(\\hat{Y} = 1 \\mid A = \\text{Kelompok Diuntungkan})} \\ge 0.80$$

$$\\phi_i = \\sum_{S \\subseteq N \\setminus \\{i\\}} \\frac{|S|! \\, (|N| - |S| - 1)!}{|N|!} \\Big( v(S \\cup \\{i\\}) - v(S) \\Big)$$`,
      mathExplanation: `Di mana $\\text{DIR}$ mengukur kriteria keadilan Four-Fifths Rule (80%), dan $\\phi_i$ adalah nilai Shapley dalam kooperatif game theory untuk mengatribusikan kontribusi murni fitur $i$ terhadap prediksi keluaran model.`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum AI Ethics & Fairness: ${sub}
import numpy as np

def evaluate_disparate_impact(y_pred, sensitive_group):
    # sensitive_group: 1 = Mayoritas, 0 = Minoritas
    rate_majority = np.mean(y_pred[sensitive_group == 1])
    rate_minority = np.mean(y_pred[sensitive_group == 0])
    
    dir_ratio = rate_minority / (rate_majority + 1e-7)
    return rate_majority, rate_minority, dir_ratio

# Simulasi data keputusan persetujuan pinjaman (500 sampel)
np.random.seed(42)
group = np.random.binomial(1, 0.7, 500) # 70% grup mayoritas
predictions = np.random.binomial(1, 0.65, 500) # Hasil prediksi

r_maj, r_min, dir_score = evaluate_disparate_impact(predictions, group)
compliance = "LOLOS REGULASI (DIR >= 0.80)" if dir_score >= 0.80 else "POTENSI BIAS DISPARITAS SISTEMIK"

print(f"Persetujuan Grup Mayoritas : {r_maj*100:.1f}%")
print(f"Persetujuan Grup Minoritas : {r_min*100:.1f}%")
print(f"Rasio Disparate Impact     : {dir_score:.4f} -> [{compliance}]")
print("Audit kepatuhan etika dan tata kelola model berhasil dihitung.")`,
      parameterRows: [
        { param: "dir_threshold", type: "Float", defaultValue: "0.80", desc: "Batas ambang rasio Disparate Impact sesuai standar hukum Four-Fifths Rule." },
        { param: "fairness_criterion", type: "String", defaultValue: "'Equalized Odds'", desc: "Definisi kesetaraan tingkat False Positive dan True Positive antar-grup." },
        { param: "risk_classification", type: "String", defaultValue: "'High Risk'", desc: "Tingkatan klasifikasi risiko sistem AI menurut regulasi EU AI Act." },
      ],
      bestPractices: [
        "Dokumentasikan arsitektur, batasan, dan metrik performa model dalam dokumen standar Model Card transparan.",
        "Terapkan teknik de-biasing pra-pemrosesan (seperti reweighing) jika terdeteksi bias representasi pada dataset latih.",
        "Sediakan mekanisme human-in-the-loop (intervensi manusia) pada sistem berisiko tinggi yang berdampak langsung pada hak individu.",
      ],
    };
  }

  // 12. Robotics & Embodied AI
  if (norm.includes("robot") || norm.includes("embodied") || norm.includes("kinematik") || norm.includes("pid") || norm.includes("slam")) {
    return {
      domainName: "Robotics & Embodied AI",
      frameworks: "ROS2, Gazebo, PyBullet, MuJoCo",
      foundations: `Domain **Robotics & Embodied AI** memadukan persepsi kecerdasan buatan dengan aktuasi fisik real-time di dunia nyata. Sistem menangani pemodelan kinematika (*forward/inverse kinematics*), kontrol umpan balik kontinu (*PID controller*), navigasi lokalisasi simultan (*SLAM*), dan transfer simulasi-ke-nyata (*Sim-to-Real*).`,
      mathTitle: "Kontroler PID & Matriks Transformasi Kinematika",
      mathFormula: `$$u(t) = K_p \\, e(t) + K_i \\int_0^t e(\\tau) \\, d\\tau + K_d \\, \\frac{de(t)}{dt}$$

$$T = \\begin{bmatrix} R_{3 \\times 3} & p_{3 \\times 1} \\\\ 0_{1 \\times 3} & 1 \\end{bmatrix}, \\quad e(t) = y_{\\text{target}}(t) - y_{\\text{actual}}(t)$$`,
      mathExplanation: `Di mana $u(t)$ adalah sinyal kontrol torsi aktuator, $K_p, K_i, K_d$ adalah gain proporsional-integral-derivatif, $e(t)$ adalah galat posisi real-time, dan $T$ adalah matriks transformasi koordinat homogen $4 \\times 4$.`,
      defaultCode: (sub, chap) => `# Implementasi Praktikum Robotics & Embodied AI: ${sub}
import numpy as np

class PIDController:
    def __init__(self, Kp, Ki, Kd, dt=0.01):
        self.Kp, self.Ki, self.Kd = Kp, Ki, Kd
        self.dt = dt
        self.prev_error = 0.0
        self.integral = 0.0

    def compute(self, target, current):
        error = target - current
        self.integral += error * self.dt
        derivative = (error - self.prev_error) / self.dt
        self.prev_error = error
        return self.Kp * error + self.Ki * self.integral + self.Kd * derivative

pid = PIDController(Kp=2.5, Ki=0.2, Kd=0.15)
target_angle = 90.0 # Derajat posisi sendi robot
current_angle = 10.0

print("Simulasi Loop Umpan Balik Kontrol Sendi Robot (3 Langkah):")
for step in range(1, 4):
    control_torque = pid.compute(target_angle, current_angle)
    current_angle += control_torque * 0.1 # Simulasi pergerakan aktuator
    print(f"  Step {step}: Sinyal Torsi = {control_torque:.2f} | Posisi Sudut = {current_angle:.2f}°")
print("Kontrol kestabilan gerakan robotik berhasil disimulasikan.")`,
      parameterRows: [
        { param: "Kp", type: "Float", defaultValue: "2.5", desc: "Gain proporsional untuk respons kecepatan terhadap galat saat ini." },
        { param: "Ki", type: "Float", defaultValue: "0.2", desc: "Gain integral untuk mengeliminasi galat sisa kondisi tunak (*steady-state error*)." },
        { param: "Kd", type: "Float", defaultValue: "0.15", desc: "Gain derivatif untuk meredam osilasi getaran overshoot." },
        { param: "dt", type: "Float (detik)", defaultValue: "0.01", desc: "Periode waktu sampling loop kontrol fisik real-time." },
      ],
      bestPractices: [
        "Terapkan Anti-Windup pada komponen integral untuk mencegah akumulasi saturasi aktuator saat terjadi lonjakan galat sesaat.",
        "Lakukan kalibrasi parameter kinematika robot di lingkungan simulator fisik (Gazebo/Isaac Sim) sebelum diaplikasikan ke hardware fisik.",
        "Pasang filter lolos-rendah (*Low-pass filter*) pada pembacaan sensor encoder guna meredam derau derivatif frekuensi tinggi.",
      ],
    };
  }

  // Fallback: AI Fundamentals & Kurikulum Standar AI
  return {
    domainName: categoryName || "Kecerdasan Buatan",
    frameworks: "Python 3.11+, NumPy, SciPy",
    foundations: `Materi **${subtopicTitle}** merupakan pilar penting dalam penguasaan komprehensif kurikulum **${categoryName}**. Konsep ini dirancang untuk memecahkan tantangan representasi pengetahuan, optimasi algoritma, dan integrasi sistem cerdas modern dengan efisiensi komputasi terukur.`,
    mathTitle: `Formulasi Matematis & Optimasi ${subtopicTitle}`,
    mathFormula: `$$\\min_{\\theta} \\; \\mathcal{J}(\\theta) = \\frac{1}{N} \\sum_{i=1}^N \\mathcal{L}\\big(f(x_i; \\theta), y_i\\big) + \\lambda \\cdot \\Omega(\\theta)$$

$$\\theta^{(t+1)} = \\theta^{(t)} - \\eta \\cdot \\nabla_\\theta \\mathcal{J}\\big(\\theta^{(t)}\\big)$$`,
    mathExplanation: `Di mana $\\theta$ adalah himpunan parameter teroptimasi, $\\mathcal{L}$ adalah fungsi kerugian objektif, $\\Omega(\\theta)$ adalah fungsi pembatas kompleksitas (regularisasi), dan $\\eta$ merepresentasikan laju pembelajaran adaptif.`,
    defaultCode: (sub, chap) => `# Implementasi Praktikum Python: ${sub}
import numpy as np

print("=" * 60)
print(f"Modul   : ${categoryName}")
print(f"Topik   : ${sub}")
print("=" * 60)

# Simulasi evaluasi algoritma dan pengujian fungsi objektif
np.random.seed(42)
data_samples = np.random.randn(50, 4)
weights = np.random.uniform(0.1, 1.0, 4)

scores = np.dot(data_samples, weights)
print(f"Jumlah Sampel Uji : {len(data_samples)}")
print(f"Rata-rata Skor    : {np.mean(scores):.4f}")
print(f"Standar Deviasi   : {np.std(scores):.4f}")
print("Validasi algoritma selesai dieksekusi secara sukses.")`,
    parameterRows: [
      { param: "learning_rate (η)", type: "Float", defaultValue: "0.001", desc: "Besaran langkah adaptasi pembaruan parameter per iterasi." },
      { param: "batch_size", type: "Integer", defaultValue: "32 atau 64", desc: "Ukuran partisi sampel yang diproses secara simultan." },
      { param: "regularization (λ)", type: "Float", defaultValue: "0.01", desc: "Koefisien pembatas kompleksitas bobot model." },
    ],
    bestPractices: [
      "Selalu pisahkan data pengujian independen guna memverifikasi kapasitas generalisasi model pada data baru.",
      "Terapkan teknik standardisasi data masukan agar skala nilai tidak mendistorsi bobot optimasi.",
      "Lakukan logging metrik secara berkala untuk memantau tren konvergensi algoritma.",
    ],
  };
}

/**
 * Memecah deskripsi bab menjadi daftar topik subbab yang terstruktur
 */
function extractSubtopicsFromDescription(description: string): string[] {
  if (!description) return ["Fondasi Teori & Konsep Inti", "Implementasi Praktikum & Kasus Nyata"];

  // Bersihkan dan pisahkan berdasarkan koma atau titik koma atau kata penghubung
  const cleaned = description.replace(/\s+serta\s+/gi, ", ").replace(/\s+dan\s+/gi, ", ");
  const rawParts = cleaned.split(/[,;]+/).map((s) => s.trim()).filter((s) => s.length > 2);

  if (rawParts.length >= 2) {
    return rawParts.slice(0, 4); // Ambil maksimal 4 subbab per bab
  }

  return [description.trim(), "Praktikum Implementasi & Optimasi Kode"];
}

/**
 * Menghasilkan konten markdown ensiklopedis otentik sesuai domain materi AI
 */
function generateRichMarkdownForSubtopic(
  chapterTitle: string,
  chapterNumber: number,
  subtopicTitle: string,
  subIndex: number,
  categoryName: string,
  existingCode?: string
): string {
  const profile = resolveDomainProfile(categoryName, chapterTitle, subtopicTitle);
  const code = existingCode || profile.defaultCode(subtopicTitle, chapterTitle);

  // Buat baris tabel parameter dinamis
  const paramTable = profile.parameterRows
    .map((r) => `| \`${r.param}\` | ${r.type} | \`${r.defaultValue}\` | ${r.desc} |`)
    .join("\n");

  // Buat daftar praktik terbaik dinamis
  const bestPracticesList = profile.bestPractices
    .map((bp, idx) => `${idx + 1}. **${bp.split(":")[0]}**: ${bp.includes(":") ? bp.split(":").slice(1).join(":") : bp}`)
    .join("\n");

  return `# ${chapterNumber}.${subIndex}. ${subtopicTitle}

> Materi kurikulum spesialisasi **${profile.domainName}** dalam modul **${categoryName}** (${chapterTitle}). Ekosistem standar: \`${profile.frameworks}\`.

---

## 1. Landasan Teori & Konsep Fundamental

${profile.foundations}

Dalam pembahasan **${subtopicTitle}**, aspek-aspek esensial yang menjadi fokus utama meliputi:
1. **Representasi & Struktur Data**: Pemodelan entitas dan representasi masukan secara matematis agar arsitektur komputasi mampu mengekstraksi relasi intrinsik data.
2. **Kriteria Objektif & Fungsi Kerugian**: Formulasi target optimasi terukur yang mengarahkan algoritma menuju konvergensi yang kokoh (*robust*).
3. **Efisiensi Komputasi & Skalabilitas**: Penerapan teknik komputasi modern untuk memproses volume data riil dengan latensi rendah dan konsumsi memori yang terkendali.

---

## 2. ${profile.mathTitle}

Secara formal, model komputasi pada materi ini diatur oleh relasi matematis berikut:

${profile.mathFormula}

${profile.mathExplanation}

---

## 3. Implementasi Praktikum Python

Berikut adalah skrip Python lengkap yang siap dieksekusi secara mandiri menggunakan modul dan pustaka standar domain **${profile.domainName}**:

\`\`\`python
${code}
\`\`\`

---

## 4. Parameter Utama & Pertimbangan Desain

| Parameter / Konsep | Tipe / Rentang | Nilai Default | Penjelasan Fungsional & Rekomendasi |
|---|---|---|---|
${paramTable}

---

## 5. Ringkasan & Praktik Terbaik (Best Practices)

${bestPracticesList}
`;
}

/**
 * Memperkaya modul kurikulum standar menjadi DocSectionItem hierarkis
 * dengan konten otentik sesuai domain masing-masing.
 */
export function enrichCurriculumToDocSections(
  sections: ModuleSection[],
  categoryName: string
): DocSectionItem[] {
  return sections.map((sec, chapterIdx) => {
    const chapterNum = sec.orderIndex || chapterIdx + 1;
    const subtopics = extractSubtopicsFromDescription(sec.description || "");

    const subsections: DocSectionItem[] = subtopics.map((subTitle, subIdx) => {
      const subNum = subIdx + 1;
      const subId = `${sec.id}-sub-${subNum}`;
      // Gunakan snippet spesifik jika ada, atau fallback ke snippet bab jika cocok
      const existingSnip = sec.codeSnippets && sec.codeSnippets[subIdx]?.code 
        ? sec.codeSnippets[subIdx].code 
        : (subIdx === 0 && sec.codeSnippets?.[0]?.code ? sec.codeSnippets[0].code : undefined);

      return {
        id: subId,
        slug: slugify(`${chapterNum}-${subNum}-${subTitle}`),
        title: `${chapterNum}.${subNum}. ${subTitle}`,
        orderIndex: subNum,
        description: `Pembahasan mendalam konsep dan praktikum ${subTitle} untuk ${sec.title}.`,
        content_markdown: generateRichMarkdownForSubtopic(
          sec.title,
          chapterNum,
          subTitle,
          subNum,
          categoryName,
          existingSnip
        ),
        codeSnippets: sec.codeSnippets || [],
      };
    });

    return {
      id: sec.id,
      slug: slugify(sec.title),
      title: sec.title,
      orderIndex: chapterNum,
      description: sec.description || "",
      content_markdown: subsections[0]?.content_markdown || null,
      subsections,
      codeSnippets: sec.codeSnippets || [],
    };
  });
}
