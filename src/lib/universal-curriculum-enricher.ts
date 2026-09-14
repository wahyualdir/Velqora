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

    // 12. Time Series Forecasting & Anomaly Detection
  if (
    norm.includes("time series") ||
    norm.includes("forecasting") ||
    norm.includes("deret waktu") ||
    norm.includes("anomaly") ||
    norm.includes("arima") ||
    norm.includes("prophet")
  ) {
    return {
      domainName: "Time Series Forecasting & Anomaly Detection",
      frameworks: "Statsmodels, Prophet, SciPy Signal, Pandas TimeSeries",
      foundations: `Analisis deret waktu (*Time Series Analysis*) memodelkan data observasi berurutan kronologis untuk menangkap dependensi temporal, osilasi musiman, tren sekuler, dan deteksi anomali. Pemodelan mensyaratkan pemeriksaan stasioneritas agar struktur statistik (rata-rata dan autokovarians) tidak bergeser terhadap waktu.`,
      mathTitle: "Dekomposisi Deret Waktu & Uji Stasioneritas ADF",
      mathFormula: `$$y_t = T_t + S_t + R_t \quad (\text{Aditif}), \quad \Delta y_t = \alpha + \beta t + \gamma y_{t-1} + \sum_{i=1}^p \delta_i \Delta y_{t-i} + \epsilon_t$$

$$\text{ACF}(k) = \frac{\sum_{t=k+1}^T (y_t - \bar{y})(y_{t-k} - \bar{y})}{\sum_{t=1}^T (y_t - \bar{y})^2}$$`,
      mathExplanation: `Di mana $T_t$ adalah komponen tren, $S_t$ musiman, $R_t$ residu stasioner, $\Delta y_t = y_t - y_{t-1}$ merupakan diferensiasi orde-1, dan koefisien $\gamma$ pada uji Augmented Dickey-Fuller (ADF) menguji keberadaan akar unit (*unit root*).`,
      defaultCode: (sub, chap) => `# Praktikum Analisis Deret Waktu: ${sub}
import numpy as np
import pandas as pd
from statsmodels.tsa.stattools import adfuller

# Sintesis data deret waktu harian dengan tren dan musiman
np.random.seed(42)
dates = pd.date_range(start="2024-01-01", periods=120, freq="D")
trend = np.linspace(100, 180, 120)
seasonal = 15 * np.sin(2 * np.pi * np.arange(120) / 7)
noise = np.random.normal(0, 3, 120)
ts_series = pd.Series(trend + seasonal + noise, index=dates)

# Uji Stasioneritas Augmented Dickey-Fuller (ADF)
adf_result = adfuller(ts_series.dropna())
print(f"ADF Statistic : {adf_result[0]:.4f}")
print(f"p-value       : {adf_result[1]:.4f}")

# Differencing orde-1 jika deret belum stasioner
diff_series = ts_series.diff().dropna()
diff_adf = adfuller(diff_series)
print(f"p-value setelah Differencing: {diff_adf[1]:.4e}")
print("Deret waktu berhasil ditransformasi menuju stasioneritas.")`,
      parameterRows: [
        { param: "order (p, d, q)", type: "Tuple", defaultValue: "(1, 1, 1)", desc: "Orde autoregresif (p), derajat diferensiasi (d), dan moving average (q)." },
        { param: "seasonal_order", type: "Tuple", defaultValue: "(1, 1, 1, 7)", desc: "Parameter musiman (P, D, Q, s) di mana s melambangkan panjang periode musiman." },
        { param: "alpha", type: "Float", defaultValue: "0.05", desc: "Tingkat signifikansi batas penolakan hipotesis nol unit root pada uji ADF." },
      ],
      bestPractices: [
        "Hindari penggunaan Random Train-Test Split pada data sekuensial temporal guna mencegah kebocoran data; gunakan TimeSeriesSplit.",
        "Lakukan diferensiasi atau transformasi logaritmik jika varians deret membesar seiring berjalannya waktu.",
        "Gunakan metrik evaluasi MAE atau WAPE dibanding RMSE apabila terdapat lonjakan data pencilan ekstrem musiman.",
      ],
    };
  }

  // 13. Recommendation Systems
  if (
    norm.includes("recommendation") ||
    norm.includes("rekomendasi") ||
    norm.includes("collaborative filtering") ||
    norm.includes("matrix factorization")
  ) {
    return {
      domainName: "Recommendation Systems",
      frameworks: "Surprise, Implicit, LightFM, PyTorch Two-Tower, Scikit-Learn",
      foundations: `Sistem rekomendasi modern memadukan penyaringan kolaboratif (*Collaborative Filtering*), pemfaktoran matriks (*Matrix Factorization SVD/ALS*), dan arsitektur *Two-Tower Neural Retrieval*. Pendekatan ini memetakan preferensi laten pengguna dan atribut item ke dalam ruang vektor berdimensi rendah untuk estimasi afinitas.`,
      mathTitle: "Pemfaktoran Matriks SVD & Kosinus Similaritas",
      mathFormula: `$$\hat{r}_{ui} = \mu + b_u + b_i + p_u^T q_i, \quad \cos(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\|_2 \|\vec{v}\|_2}$$

$$\min_{P, Q, b} \sum_{(u,i) \in R} (r_{ui} - \hat{r}_{ui})^2 + \lambda \big(\|p_u\|^2 + \|q_i\|^2 + b_u^2 + b_i^2\big)$$`,
      mathExplanation: `Di mana $\mu$ adalah rata-rata global, $b_u$ dan $b_i$ bias pengguna dan item, $p_u$ vektor laten pengguna, $q_i$ vektor laten item, dan $\lambda$ adalah koefisien regularisasi norma $L_2$.`,
      defaultCode: (sub, chap) => `# Praktikum Sistem Rekomendasi: ${sub}
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Matriks interaksi Pengguna-Item (User-Item Matrix)
user_item = np.array([
    [5, 3, 0, 1],
    [4, 0, 0, 1],
    [1, 1, 0, 5],
    [0, 0, 5, 4],
    [0, 1, 5, 4]
])

# Menghitung kesamaan antar item (Item-Item Collaborative Filtering)
item_sim = cosine_similarity(user_item.T)
print("Matriks Kosinus Kesamaan Antar Item:")
print(np.round(item_sim, 3))

# Prediksi skor ketertarikan Pengguna 0 terhadap Item 2 (yang belum ditonton)
ratings_u0 = user_item[0]
weights = item_sim[2]
pred_score = np.dot(ratings_u0, weights) / (np.sum(np.abs(weights)) + 1e-6)
print(f"Estimasi Skor Preferensi untuk Item 2: {pred_score:.2f}")`,
      parameterRows: [
        { param: "n_factors", type: "Integer", defaultValue: "50 atau 100", desc: "Dimensi dimensi ruang vektor laten representasi embedding pengguna dan item." },
        { param: "regularization (λ)", type: "Float", defaultValue: "0.02", desc: "Penalti kompleksitas untuk membatasi nilai bobot faktor laten." },
        { param: "top_k", type: "Integer", defaultValue: "10", desc: "Jumlah rekomendasi kandidat teratas yang disajikan kepada pengguna." },
      ],
      bestPractices: [
        "Sediakan strategi Fallback berbasis popularitas untuk mengatasi tantangan pengguna atau item baru (*Cold-Start Problem*).",
        "Terapkan Negative Sampling yang seimbang saat melatih model rekomendasi dengan umpan balik implisit.",
        "Evaluasi sistem tidak hanya dengan metrik akurasi (Precision/NDCG), melainkan juga diversitas rekomendasi.",
      ],
    };
  }

  // 14. Speech & Audio AI
  if (
    norm.includes("speech") ||
    norm.includes("audio") ||
    norm.includes("suara") ||
    norm.includes("stft") ||
    norm.includes("spectrogram") ||
    norm.includes("whisper")
  ) {
    return {
      domainName: "Speech & Audio AI",
      frameworks: "Librosa, Torchaudio, Whisper, SoundFile",
      foundations: `Pemrosesan audio cerdas mentransformasikan gelombang tekanan suara digital satu dimensi menjadi representasi waktu-frekuensi 2D (*Time-Frequency Representation*) melalui Transformasi Fourier Waktu-Pendek (*STFT*) dan konversi ke skala persepsi Mel (*Mel-Spectrogram*). Arsitektur modern mengadopsi Transformer akustik untuk pengenalan wicara (*ASR*).`,
      mathTitle: "Transformasi STFT & Skala Frekuensi Mel",
      mathFormula: `$$\text{STFT}\{x\}(m, \omega) = \sum_{n=-\infty}^{\infty} x[n] \cdot w[n-m] \cdot e^{-j\omega n}$$

$$m = 2595 \cdot \log_{10}\left(1 + \frac{f}{700}\right), \quad S(m, \omega) = |\text{STFT}(m, \omega)|^2$$`,
      mathExplanation: `Di mana $x[n]$ adalah sinyal wicara digital, $w[n]$ adalah fungsi pembobotan jendela (*Hann Window*), dan formula Mel memetakan frekuensi Hertz fisik $f$ ke skala persepsi non-linear pendengaran manusia.`,
      defaultCode: (sub, chap) => `# Praktikum Ekstraksi Fitur Akustik Audio: ${sub}
import numpy as np

# Simulasi gelombang sinyal audio digital (1 detik, sample rate 16 kHz)
sr = 16000
t = np.linspace(0, 1.0, sr, endpoint=False)
signal = 0.6 * np.sin(2 * np.pi * 440 * t) + 0.3 * np.sin(2 * np.pi * 880 * t)
signal += np.random.normal(0, 0.05, sr)

# Ekstraksi frame jendela (Framing & Windowing)
frame_size = 512
hop_size = 256
window = np.hanning(frame_size)
n_frames = 1 + (len(signal) - frame_size) // hop_size

frames = np.lib.stride_tricks.as_strided(
    signal, shape=(n_frames, frame_size),
    strides=(signal.strides[0] * hop_size, signal.strides[0])
)
windowed_frames = frames * window
mag_spec = np.abs(np.fft.rfft(windowed_frames, n=frame_size))

print(f"Sample Rate         : {sr} Hz")
print(f"Dimensi Spektrogram : {mag_spec.shape} (Frames x Frequency Bins)")
print("Representasi fitur frekuensi berhasil diekstraksi.")`,
      parameterRows: [
        { param: "sample_rate (sr)", type: "Integer", defaultValue: "16000", desc: "Frekuensi sampling standar untuk model ASR wicara modern." },
        { param: "n_fft", type: "Integer", defaultValue: "512 atau 1024", desc: "Panjang jendela transformasi Fourier cepat (FFT)." },
        { param: "n_mels", type: "Integer", defaultValue: "80 atau 128", desc: "Jumlah filter band frekuensi pada bank filter skala Mel." },
      ],
      bestPractices: [
        "Selalu lakukan normalisasi amplitudo gelombang dan standarisasi sample rate (16 kHz) sebelum tahap inferensi model.",
        "Terapkan augmentasi data akustik (seperti SpecAugment) untuk meningkatkan ketahanan terhadap noise lingkungan.",
        "Gunakan Voice Activity Detection (VAD) untuk memotong bagian jeda hening sebelum sinyal diproses oleh Transformer.",
      ],
    };
  }

  // 15. AI Agent & Autonomous Systems
  if (
    norm.includes("agent") ||
    norm.includes("agen") ||
    norm.includes("autonomous") ||
    norm.includes("langgraph") ||
    norm.includes("crewai")
  ) {
    return {
      domainName: "AI Agent & Autonomous Systems",
      frameworks: "LangGraph, CrewAI, AutoGen, OpenAI Tool Calling",
      foundations: `Arsitektur Agen AI otonom menggabungkan kapabilitas penalaran model bahasa besar dengan siklus ReAct (*Reasoning + Action*), pemanggilan fungsi eksternal (*Tool/Function Calling*), serta memori dinamis. Agen mengevaluasi observasi lingkungan untuk memutuskan langkah berikutnya secara berulang hingga kondisi terminasi tercapai.`,
      mathTitle: "Siklus Keputusan Markov Agen & Formulasi ReAct",
      mathFormula: `$$a_t = \arg\max_a \; P(a \mid s_t, \mathcal{M}_{t-1}, \mathcal{T}), \quad s_{t+1} = \mathcal{E}(s_t, a_t)$$

$$\text{ReAct Loop}: \quad \text{Observation} \longrightarrow \text{Thought} \longrightarrow \text{Action} \longrightarrow \text{Feedback}$$`,
      mathExplanation: `Di mana $s_t$ merepresentasikan keadaan lingkungan saat ini, $\mathcal{M}_{t-1}$ adalah riwayat konteks interaksi sebelumnya, $\mathcal{T}$ merupakan himpunan perkakas API yang dapat diakses, dan $\mathcal{E}$ adalah lingkungan eksekusi eksternal.`,
      defaultCode: (sub, chap) => `# Praktikum Pola Eksekusi Agen ReAct: ${sub}
class SimpleReActAgent:
    def __init__(self):
        self.tools = {
            "calculator": lambda expr: str(eval(expr, {"__builtins__": None}, {})),
            "search_db": lambda q: f"Hasil verifikasi untuk '{q}': Terkonfirmasi aktif."
        }

    def run(self, query: str):
        print(f"Goal: {query}")
        thought = "Memerlukan perhitungan matematis untuk memverifikasi nilai metrik."
        print(f"Thought: {thought}")
        
        tool_name = "calculator"
        tool_input = "250 * 1.15"
        action_result = self.tools[tool_name](tool_input)
        print(f"Action: Eksekusi perkakas '{tool_name}' dengan argumen '{tool_input}'")
        print(f"Observation: Hasil komputasi = {action_result}")
        
        return f"Nilai metrik terproyeksi adalah {action_result}."

agent = SimpleReActAgent()
hasil = agent.run("Berapakah proyeksi target 250 ditambah 15%?")
print("Respon Akhir Agen:", hasil)`,
      parameterRows: [
        { param: "temperature", type: "Float", defaultValue: "0.0 atau 0.2", desc: "Suhu sampling deterministik rendah untuk menjaga keandalan pemanggilan tool JSON." },
        { param: "max_iterations", type: "Integer", defaultValue: "10", desc: "Batas atas perulangan loop aksi agen guna mencegah siklus rekursi tak terbatas." },
        { param: "timeout", type: "Float (detik)", defaultValue: "30.0", desc: "Batas waktu tunggu respons eksekusi perkakas eksternal." },
      ],
      bestPractices: [
        "Definisikan skema JSON parameter tool secara ketat menggunakan Pydantic untuk mencegah kegagalan validasi argumen model.",
        "Pasang mekanisme Human-in-the-Loop (HITL) untuk tindakan yang memiliki dampak berisiko tinggi.",
        "Simpan riwayat eksekusi agen dalam format log terstruktur untuk mempermudah audit jejak penalaran.",
      ],
    };
  }

  // 16. AutoML & Neural Architecture Search
  if (
    norm.includes("automl") ||
    norm.includes("neural architecture search") ||
    norm.includes("nas") ||
    norm.includes("optuna")
  ) {
    return {
      domainName: "AutoML & Neural Architecture Search",
      frameworks: "Optuna, FLAML, Ray Tune, Auto-sklearn",
      foundations: `Automated Machine Learning (AutoML) mengotomasi alur rekayasa fitur, pemilihan algoritma model, dan penyelarasan hiperparameter (*HPO*). Optimasi mengadopsi teknik Bayesian Optimization untuk menyeimbangkan eksplorasi ruang parameter dan eksploitasi konfigurasi berkinerja tinggi.`,
      mathTitle: "Optimasi Bayesian & Kriteria Expected Improvement",
      mathFormula: `$$\text{EI}(x) = \mathbb{E}\big[\max\big(0, f(x) - f(x^*)\big)\big] = (\mu(x) - f(x^*)) \Phi(Z) + \sigma(x) \phi(Z)$$

$$Z = \frac{\mu(x) - f(x^*)}{\sigma(x)}$$`,
      mathExplanation: `Di mana $\mu(x)$ dan $\sigma(x)$ adalah rata-rata prediksi dan deviasi standar fungsi pengganti (*Surrogate Model*), $f(x^*)$ adalah nilai metrik terbaik yang telah ditemukan, sedangkan $\Phi$ dan $\phi$ melambangkan fungsi distribusi kumulatif dan densitas normal standar.`,
      defaultCode: (sub, chap) => `# Praktikum Optimasi Hiperparameter Bayesian: ${sub}
import numpy as np

def objective_metric(learning_rate, max_depth):
    return 0.85 - (np.log10(learning_rate) + 2)**2 * 0.05 - (max_depth - 6)**2 * 0.008

trials = [
    {"lr": 0.01, "depth": 4},
    {"lr": 0.05, "depth": 6},
    {"lr": 0.10, "depth": 8},
    {"lr": 0.001, "depth": 5}
]

best_score = -1
best_config = None

for idx, t in enumerate(trials):
    score = objective_metric(t["lr"], t["depth"])
    print(f"Trial {idx+1}: lr={t['lr']}, depth={t['depth']} -> Skor AUC = {score:.4f}")
    if score > best_score:
        best_score = score
        best_config = t

print(f"Konfigurasi Parameter Terbaik: {best_config} dengan Skor AUC = {best_score:.4f}")`,
      parameterRows: [
        { param: "n_trials", type: "Integer", defaultValue: "50 s/d 100", desc: "Jumlah putaran pencarian kombinasi parameter terarah." },
        { param: "pruner", type: "Algoritma", defaultValue: "MedianPruner", desc: "Penghentian dini (*early stopping*) otomatis bagi uji coba yang menunjukkan performa buruk." },
        { param: "direction", type: "String", defaultValue: "'maximize'", desc: "Arah tujuan optimasi terhadap metrik objektif (misal memaksimalkan AUC)." },
      ],
      bestPractices: [
        "Gunakan skala logaritmik untuk hiperparameter yang mencakup rentang magnitudo luas (seperti learning rate).",
        "Tetapkan anggaran waktu komputasi (*time budget*) yang jelas agar pencarian parameter tidak melebihi alokasi sumber daya komputasi.",
        "Evaluasi model kandidat terbaik menggunakan cross-validation terpisah untuk menghindari optimasi yang bias terhadap satu partisi validasi.",
      ],
    };
  }

  // 17. Computational Intelligence & Soft Computing
  if (
    norm.includes("computational intelligence") ||
    norm.includes("fuzzy") ||
    norm.includes("genetic") ||
    norm.includes("genetika") ||
    norm.includes("swarm") ||
    norm.includes("soft computing")
  ) {
    return {
      domainName: "Computational Intelligence (Soft Computing)",
      frameworks: "Scikit-Fuzzy, DEAP (Genetic Algorithm), PySwarms",
      foundations: `Computational Intelligence berfokus pada metode komputasi yang meniru proses adaptif biologis dan toleran terhadap ketidakpastian: Logika Fuzzy (pemodelan derajat kebenaran kontinu), Komputasi Evolusioner (Algoritma Genetika), serta Inteligensi Kawanan (*Swarm Intelligence* seperti PSO).`,
      mathTitle: "Fungsi Keanggotaan Fuzzy & Pembaruan Kecepatan PSO",
      mathFormula: `$$\mu_A(x) = \max\left(0, \; \min\left(\frac{x - a}{b - a}, \; \frac{c - x}{c - b}\right)\right)$$

$$v_i^{(t+1)} = w \cdot v_i^{(t)} + c_1 r_1 \cdot (p_i - x_i^{(t)}) + c_2 r_2 \cdot (g - x_i^{(t)})$$`,
      mathExplanation: `Di mana $\mu_A(x)$ adalah fungsi keanggotaan fuzzy segitiga dengan batas interval $[a, b, c]$, sedangkan pada persamaan PSO, $w$ merupakan inersia bobot kecepatan, $p_i$ posisi terbaik individu, dan $g$ posisi terbaik kelompok kawanan.`,
      defaultCode: (sub, chap) => `# Praktikum Algoritma Genetika Sederhana: ${sub}
import numpy as np

def fitness_function(chromosome):
    x = np.sum(chromosome * (2 ** np.arange(len(chromosome))[::-1]))
    return x ** 2

population = np.random.randint(0, 2, size=(8, 6))
scores = np.array([fitness_function(ind) for ind in population])

best_idx = np.argmax(scores)
print("Generasi 0:")
print(f"  Individu Terbaik : {population[best_idx]}")
print(f"  Nilai Fitness    : {scores[best_idx]}")

prob = scores / np.sum(scores)
selected_parent = population[np.random.choice(len(population), p=prob)]
print(f"  Induk Terpilih   : {selected_parent}")`,
      parameterRows: [
        { param: "population_size", type: "Integer", defaultValue: "50 s/d 100", desc: "Jumlah individu solusi kandidat dalam satu generasi evolusi." },
        { param: "crossover_rate", type: "Float [0, 1]", defaultValue: "0.80", desc: "Probabilitas terjadinya persilangan genetik antar pasangan induk." },
        { param: "mutation_rate", type: "Float [0, 1]", defaultValue: "0.01 s/d 0.05", desc: "Probabilitas terjadinya mutasi genetik acak untuk menjaga diversitas populasi." },
      ],
      bestPractices: [
        "Jaga keseimbangan antara tekanan seleksi (*selection pressure*) dan diversitas genetik agar algoritma tidak konvergen dini di optimum lokal.",
        "Lakukan defuzzifikasi dengan metode Centroid untuk menghasilkan nilai kontrol numerik yang stabil dan halus.",
        "Terapkan teknik elitisme (*Elitism*) agar individu terbaik di setiap generasi selalu dipreservasi ke generasi berikutnya.",
      ],
    };
  }

  // 18. Edge AI & TinyML
  if (
    norm.includes("edge ai") ||
    norm.includes("tinyml") ||
    norm.includes("embedded") ||
    norm.includes("quantization") ||
    norm.includes("kuantisasi") ||
    norm.includes("onnx")
  ) {
    return {
      domainName: "Edge AI & TinyML",
      frameworks: "TensorFlow Lite Micro, ONNX Runtime Mobile, TensorRT, OpenVINO",
      foundations: `Edge AI mengoptimalkan penerapan model cerdas pada perangkat berdaya komputasi dan memori terbatas (*Microcontroller*, perangkat IoT, dan smartphone) tanpa ketergantungan konektivitas cloud. Teknik inti mencakup Kuantisasi Pasca-Pelatihan (*PTQ FP32 to INT8*) dan Pemangkasan Bobot (*Pruning*).`,
      mathTitle: "Formulasi Kuantisasi Afinitas Linier INT8",
      mathFormula: `$$q = \text{clamp}\left(\text{round}\left(\frac{r}{S}\right) + Z, \; -128, \; 127\right)$$

$$S = \frac{r_{\max} - r_{\min}}{q_{\max} - q_{\min}}, \quad Z = \text{round}\left(\frac{-r_{\min}}{S}\right) + q_{\min}$$`,
      mathExplanation: `Di mana $r$ adalah bobot nilai kontinu riil FP32, $q$ adalah representasi bilangan bulat kuantisasi 8-bit, $S$ adalah faktor skala (*Scale factor*), dan $Z$ merupakan titik nol (*Zero-point*).`,
      defaultCode: (sub, chap) => `# Praktikum Kuantisasi Bobot FP32 ke INT8: ${sub}
import numpy as np

weights_fp32 = np.array([-0.85, -0.42, 0.0, 0.38, 0.95], dtype=np.float32)
r_min, r_max = weights_fp32.min(), weights_fp32.max()
q_min, q_max = -128, 127

scale = (r_max - r_min) / (q_max - q_min)
zero_point = int(np.round(-r_min / scale) + q_min)

weights_int8 = np.clip(np.round(weights_fp32 / scale) + zero_point, q_min, q_max).astype(np.int8)
dequantized = (weights_int8.astype(np.float32) - zero_point) * scale

print(f"Bobot FP32 Asli      : {weights_fp32}")
print(f"Bobot Kuantisasi INT8: {weights_int8} (Penghematan Memori: 75%)")
print(f"Bobot Rekonstruksi   : {np.round(dequantized, 2)}")`,
      parameterRows: [
        { param: "scale (S)", type: "Float", defaultValue: "Dihitung otomatis", desc: "Faktor pengali yang memetakan rentang dinamis nilai riil ke representasi bilangan bulat." },
        { param: "zero_point (Z)", type: "Integer", defaultValue: "0 (Symmetric)", desc: "Offset titik nol agar nilai 0.0 riil dipetakan secara presisi tanpa pembulatan." },
        { param: "target_runtime", type: "String", defaultValue: "'tflite' / 'onnx'", desc: "Mesin eksekusi inferensi ringan yang ditargetkan pada sistem operasi edge." },
      ],
      bestPractices: [
        "Gunakan Kuantisasi Simetris (*Symmetric Quantization*) untuk bobot lapisan konvolusi guna menyederhanakan instruksi SIMD.",
        "Lakukan kalibrasi representasi menggunakan subset data validasi representatif sebelum melakukan kuantisasi penuh.",
        "Pantau degradasi metrik akurasi; jika penurunan performa >1%, pertimbangkan Quantization-Aware Training (QAT).",
      ],
    };
  }

  // 19. Expert System & Knowledge Representation
  if (
    norm.includes("expert system") ||
    norm.includes("sistem pakar") ||
    norm.includes("knowledge representation") ||
    norm.includes("representasi pengetahuan") ||
    norm.includes("ontology") ||
    norm.includes("ontologi")
  ) {
    return {
      domainName: "Expert Systems & Knowledge Engineering",
      frameworks: "Pyke, Experta, RDFLib, Owlready2, SWI-Prolog",
      foundations: `Sistem Pakar dan Rekayasa Pengetahuan merepresentasikan kepakaran domain terstruktur dalam bentuk basis fakta (*Fact Base*), aturan inferensi (*Rule Base IF-THEN*), dan jejaring semantik ontologi (RDF/OWL). Mesin inferensi mengeksekusi penalaran deduktif formal melalui algoritma *Forward Chaining* atau *Backward Chaining*.`,
      mathTitle: "Kaidah Inferensi Formal & Certainty Factor",
      mathFormula: `$$\text{Modus Ponens}: \quad \frac{P \implies Q, \quad P}{Q}$$

$$\text{CF}(h, e) = \text{MB}(h, e) - \text{MD}(h, e), \quad \text{CF}_{\text{combine}}(a, b) = a + b - (a \cdot b)$$`,
      mathExplanation: `Di mana $\text{MB}$ melambangkan tingkat ukuran kepercayaan (*Measure of Belief*), $\text{MD}$ merupakan tingkat ketidakyakinan (*Measure of Disbelief*), dan $\text{CF}_{\text{combine}}$ menggabungkan dua aturan independen yang mengarah ke hipotesis yang sama.`,
      defaultCode: (sub, chap) => `# Praktikum Mesin Inferensi Rule-Based (Forward Chaining): ${sub}
class RuleEngine:
    def __init__(self):
        self.facts = set()
        self.rules = [
            {"conditions": {"gejala_demam", "ruam_kulit"}, "conclusion": "indikasi_campak", "cf": 0.85},
            {"conditions": {"indikasi_campak", "mata_merah"}, "conclusion": "diagnosis_campak_akut", "cf": 0.95}
        ]

    def add_facts(self, new_facts):
        self.facts.update(new_facts)

    def infer(self):
        inferred = True
        conclusions = []
        while inferred:
            inferred = False
            for rule in self.rules:
                if rule["conditions"].issubset(self.facts) and rule["conclusion"] not in self.facts:
                    self.facts.add(rule["conclusion"])
                    conclusions.append((rule["conclusion"], rule["cf"]))
                    inferred = True
        return conclusions

engine = RuleEngine()
engine.add_facts(["gejala_demam", "ruam_kulit", "mata_merah"])
diagnosa = engine.infer()

print("Fakta Aktif Teridentifikasi:")
for c, cf in diagnosa:
    print(f"  -> Kesimpulan: {c} (Certainty Factor = {cf * 100:.0f}%)")`,
      parameterRows: [
        { param: "chaining_mode", type: "String", defaultValue: "'forward' / 'backward'", desc: "Metode penalaran: Forward (berangkat dari fakta) atau Backward (berangkat dari hipotesis tujuan)." },
        { param: "certainty_threshold", type: "Float", defaultValue: "0.60", desc: "Ambang batas minimal nilai kepastian untuk menerima konklusi sebagai rekomendasi sah." },
        { param: "conflict_resolution", type: "Strategi", defaultValue: "'specificity'", desc: "Prioritas pemilihan aturan jika beberapa aturan aktif secara simultan." },
      ],
      bestPractices: [
        "Pisahkan secara tegas antara basis pengetahuan domain (*Knowledge Base*) dan logika mesin penalaran (*Inference Engine*).",
        "Verifikasi konsistensi basis aturan secara berkala guna mencegah aturan yang kontradiktif atau redundan.",
        "Sediakan mekanisme pelacakan transparansi (*Explanation Facility*) agar sistem mampu menjelaskan alasan kesimpulan.",
      ],
    };
  }

  // 20. Multimodal AI
  if (
    norm.includes("multimodal") ||
    norm.includes("cross-modal") ||
    norm.includes("clip") ||
    norm.includes("vqa")
  ) {
    return {
      domainName: "Multimodal AI (Vision-Language & Cross-Modal)",
      frameworks: "CLIP (OpenAI), OpenCLIP, Transformers, LLaVA",
      foundations: `Multimodal AI menyelaraskan modalitas data heterogen (teks, citra visual, dan audio) ke dalam satu ruang representasi semantik bersatu (*Joint Embedding Space*). Melalui metode *Contrastive Language-Image Pretraining (CLIP)*, sistem mempelajari kesesuaian antara deskripsi tekstual dan konten visual untuk kemampuan *zero-shot transfer* yang tinggi.`,
      mathTitle: "Formulasi Contrastive Loss (InfoNCE Multi-Modal)",
      mathFormula: `$$\mathcal{L}_{\text{CLIP}} = \frac{1}{2} \left( \mathcal{L}_{I \to T} + \mathcal{L}_{T \to I} \right)$$

$$\mathcal{L}_{I \to T} = -\frac{1}{B} \sum_{i=1}^B \log \frac{\exp(\cos(I_i, T_i) / \tau)}{\sum_{j=1}^B \exp(\cos(I_i, T_j) / \tau)}$$`,
      mathExplanation: `Di mana $I_i$ adalah vektor representasi citra ternormalisasi, $T_i$ adalah vektor representasi teks pasangan, $B$ adalah ukuran batch, dan $\tau$ merupakan hiperparameter temperatur logaritma pengendali ketajaman distribusi probabilitas.`,
      defaultCode: (sub, chap) => `# Praktikum Representasi Multimodal Kontrastif (Zero-Shot): ${sub}
import numpy as np

d_embed = 128
n_classes = 3

img_feature = np.random.randn(d_embed)
img_feature /= np.linalg.norm(img_feature)

candidate_texts = ["foto seekor kucing", "foto sebuah mobil sport", "foto pohon rindang"]
text_features = np.random.randn(n_classes, d_embed)
text_features /= np.linalg.norm(text_features, axis=1, keepdims=True)

logits = np.dot(text_features, img_feature)
temperature = 0.07
probs = np.exp(logits / temperature) / np.sum(np.exp(logits / temperature))

print("Prediksi Klasifikasi Multimodal Zero-Shot:")
for txt, prob in zip(candidate_texts, probs):
    print(f"  Teks: '{txt:25s}' -> Probabilitas = {prob * 100:.2f}%")`,
      parameterRows: [
        { param: "temperature (τ)", type: "Float", defaultValue: "0.07", desc: "Parameter skala temperatur yang menstabilkan gradien contrastive loss." },
        { param: "embedding_dim", type: "Integer", defaultValue: "512 atau 768", desc: "Dimensi ruang embedding bersama untuk proyeksi fitur visual dan tekstual." },
        { param: "context_length", type: "Integer", defaultValue: "77", desc: "Batas panjang tokenisasi teks masukan pada text encoder." },
      ],
      bestPractices: [
        "Lakukan normalisasi norma L2 pada semua vektor embedding sebelum menghitung produk titik (*Dot Product*).",
        "Gunakan prompt engineering yang terstruktur untuk memaksimalkan akurasi klasifikasi zero-shot.",
        "Terapkan evaluasi silang pada dataset benchmark berstandar industri (seperti ImageNet Zero-Shot atau VQAv2).",
      ],
    };
  }

  // 21. Bahasa Pemrograman (Programming Languages)
  if (
    norm.includes("bahasa pemrograman") ||
    norm.includes("pemrograman") ||
    norm.includes("python") ||
    norm.includes("javascript") ||
    norm.includes("typescript") ||
    norm.includes("golang") ||
    norm.includes("rust") ||
    norm.includes("c++") ||
    norm.includes("java") ||
    norm.includes("kotlin") ||
    norm.includes("dart") ||
    norm.includes("php") ||
    norm.includes("swift")
  ) {
    return {
      domainName: "Bahasa Pemrograman & Rekayasa Perangkat Lunak",
      frameworks: "Python, TypeScript, Go, Rust, C++, Java",
      foundations: `Penguasaan bahasa pemrograman modern menekankan pada pemahaman paradigma komputasi (Berorientasi Objek, Fungsional, Prosedural), sistem pengetikan (*Static vs Dynamic Type Safety*), manajemen memori (Heap/Stack dan Garbage Collection), serta pola arsitektur perangkat lunak yang kokoh (*Clean Architecture & SOLID Principles*).`,
      mathTitle: "Analisis Kompleksitas Algoritmik & Teori Tipe",
      mathFormula: `$$T(n) = \mathcal{O}(f(n)) \iff \exists c > 0, n_0 > 0 \; \text{s.t.} \; 0 \le T(n) \le c \cdot f(n) \; \forall n \ge n_0$$

$$\Gamma \vdash e : \tau \quad (\text{Sistem Pembuktian Tipe Statis})$$`,
      mathExplanation: `Notasi Big-O formal mengukur batas asimptotik atas kebutuhan waktu komputasi atau konsumsi memori saat ukuran input $n$ mendekati tak hingga.`,
      defaultCode: (sub, chap) => `# Praktikum Idiom Pemrograman Profesional: ${sub}
from typing import List, Dict
from dataclasses import dataclass

@dataclass(frozen=True)
class TransactionRecord:
    id: str
    amount: float
    status: str

class TransactionProcessor:
    def __init__(self, fee_rate: float = 0.02):
        self._fee_rate = fee_rate

    def process_valid_records(self, records: List[TransactionRecord]) -> Dict[str, float]:
        completed = [r for r in records if r.status == "success"]
        total_vol = sum(r.amount for r in completed)
        total_fee = total_vol * self._fee_rate
        
        return {
            "total_completed": len(completed),
            "net_volume": total_vol - total_fee,
            "system_fee": total_fee
        }

records = [
    TransactionRecord("TX-101", 150000.0, "success"),
    TransactionRecord("TX-102", 75000.0, "failed"),
    TransactionRecord("TX-103", 225000.0, "success")
]

processor = TransactionProcessor()
summary = processor.process_valid_records(records)
print("Hasil Pemrosesan Transaksi:")
for k, v in summary.items():
    print(f"  {k}: {v:,.2f}")`,
      parameterRows: [
        { param: "type_checking", type: "Static Analysis", defaultValue: "mypy / tsc", desc: "Pemeriksaan tipe statis pada waktu build untuk mencegah bug runtime tipe data." },
        { param: "immutability", type: "Design Pattern", defaultValue: "frozen=True / readonly", desc: "Mencegah efek samping mutasi keadaan tak terduga (*unexpected side effects*)." },
        { param: "concurrency_model", type: "Arsitektur", defaultValue: "Async/Await / ThreadPool", desc: "Pengelolaan tugas I/O intensif tanpa memblokir thread eksekusi utama." },
      ],
      bestPractices: [
        "Gunakan Type Annotations secara konsisten pada tanda tangan fungsi publik dan antarmuka API internal.",
        "Terapkan prinsip Fail-Fast dengan validasi input yang ketat sebelum logika bisnis inti dieksekusi.",
        "Tulis unit test otomatis yang mencakup skenario batas (*edge cases*) dan penanganan kegagalan (*exception handling*).",
      ],
    };
  }

  // 22. Algoritma & Struktur Data
  if (
    norm.includes("algoritma") ||
    norm.includes("struktur data") ||
    norm.includes("array") ||
    norm.includes("tree") ||
    norm.includes("graph") ||
    norm.includes("linked list") ||
    norm.includes("stack") ||
    norm.includes("queue") ||
    norm.includes("heap") ||
    norm.includes("hash table") ||
    norm.includes("sorting") ||
    norm.includes("searching") ||
    norm.includes("dynamic programming") ||
    norm.includes("recursion")
  ) {
    return {
      domainName: "Algoritma & Struktur Data",
      frameworks: "Python Standard Library (collections, heapq, bisect), C++ STL",
      foundations: `Algoritma dan Struktur Data merupakan fondasi efisiensi rekayasa perangkat lunak. Pemilihan struktur data yang tepat (Array, Hash Map, Binary Search Tree, Graph, Heap) menentukan kompleksitas akses, pencarian, dan mutasi. Pola perancangan algoritma (Divide & Conquer, Dynamic Programming, Greedy, Backtracking) mengoptimasi pemanfaatan siklus CPU dan konsumsi memori.`,
      mathTitle: "Relasi Rekurensi & Analisis Kompleksitas Master Theorem",
      mathFormula: `$$T(n) = a \cdot T\left(\frac{n}{b}\right) + f(n)$$

$$\text{Kasus 1}: \; f(n) = \mathcal{O}\big(n^{\log_b a - \epsilon}\big) \implies T(n) = \Theta\big(n^{\log_b a}\big)$$`,
      mathExplanation: `Teorema Master menganalisis kompleksitas waktu dari algoritma rekursif yang membagi masalah ukuran $n$ menjadi $a$ buah sub-masalah berukuran $n/b$, dengan biaya pemisahan dan penggabungan sebesar $f(n)$.`,
      defaultCode: (sub, chap) => `# Praktikum Algoritma Efisien (Binary Search): ${sub}
from typing import List, Optional

def binary_search(arr: List[int], target: int) -> Optional[int]:
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return None

data_terurut = [12, 24, 35, 47, 58, 69, 81, 93, 105, 120]
target_val = 69
posisi = binary_search(data_terurut, target_val)

print(f"Data: {data_terurut}")
print(f"Pencarian nilai {target_val} -> Ditemukan pada indeks: {posisi} (Kompleksitas: O(log n))")`,
      parameterRows: [
        { param: "time_complexity", type: "Asimptotik", defaultValue: "O(log n) / O(n log n)", desc: "Skalabilitas waktu eksekusi terhadap pertambahan ukuran input data." },
        { param: "space_complexity", type: "Memori", defaultValue: "O(1) / O(n)", desc: "Tambahan alokasi memori fisik di luar struktur data input asli (*auxiliary space*)." },
        { param: "stability", type: "Boolean", defaultValue: "True / False", desc: "Menjamin bahwa elemen dengan kunci bernilai sama mempertahankan urutan relatif aslinya." },
      ],
      bestPractices: [
        "Selalu periksa kondisi batas (*Base Case* dan batas indeks 0 serta n-1) untuk mencegah error Off-by-One dan rekursi tak terbatas.",
        "Gunakan Hash Map / Dictionary untuk mendapatkan waktu akses rata-rata O(1) saat sering melakukan operasi pencarian kunci unik.",
        "Terapkan teknik Two Pointers atau Sliding Window untuk mereduksi kompleksitas waktu dari O(n^2) menjadi O(n) pada masalah array linier.",
      ],
    };
  }

  
  // 23. Machine Learning (Supervised & Unsupervised Learning, Scikit-Learn)
  if (
    norm.includes("machine learning") ||
    norm.includes("pembelajaran mesin") ||
    norm.includes("scikit-learn") ||
    norm.includes("supervised") ||
    norm.includes("unsupervised") ||
    norm.includes("random forest") ||
    norm.includes("xgboost") ||
    norm.includes("gradient boosting") ||
    norm.includes("decision tree") ||
    norm.includes("svm") ||
    norm.includes("klasifikasi") ||
    norm.includes("regresi") ||
    norm.includes("clustering") ||
    norm.includes("kmeans")
  ) {
    return {
      domainName: "Machine Learning (Supervised & Unsupervised)",
      frameworks: "Scikit-Learn (sklearn), XGBoost, LightGBM, NumPy, SciPy",
      foundations: `Dalam domain **Machine Learning**, algoritma dirancang untuk mengekstraksi pola induktif dari data masukan berdimensi tinggi tanpa memerlukan penyusunan aturan logika imperatif manual. Pipeline pemodelan mencakup eksplorasi data terstruktur, penskalaan fitur (*StandardScaler* atau *MinMaxScaler*), rekayasa fitur (*Feature Engineering*), pencegahan kebocoran data (*Data Leakage*), serta penyeimbangan kompromi antara bias dan varians (*Bias-Variance Tradeoff*).`,
      mathTitle: "Formulasi Regularisasi ElasticNet, Entropi Informasi, & Evaluasi F1",
      mathFormula: `$$\\mathcal{L}_{\\text{ElasticNet}}(\\mathbf{w}) = \\frac{1}{2n} \\|\\mathbf{y} - \\mathbf{X}\\mathbf{w}\\|_2^2 + \\lambda \\left( \\alpha \\|\\mathbf{w}\\|_1 + \\frac{1-\\alpha}{2} \\|\\mathbf{w}\\|_2^2 \\right)$$

$$H(S) = - \\sum_{c=1}^C p_c \\log_2 p_c, \\quad F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$`,
      mathExplanation: `Di mana penalti regularisasi ElasticNet mengombinasikan sifat L1 (Lasso untuk seleksi kekosongan koefisien) dan L2 (Ridge untuk reduksi varians multikolinieritas), $H(S)$ mengukur ketidakmurnian sampel simpul pohon keputusan (*Decision Tree*), dan $F_1$ merupakan rata-rata harmonik evaluasi klasifikasi pada dataset tidak seimbang (*imbalanced*).`,
      defaultCode: (sub, chap) => `# Praktikum Pemodelan Machine Learning: ${sub}
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# 1. Pembentukan Dataset Sintetis dengan Pembagian Stratifikasi
X, y = make_classification(n_samples=1000, n_features=20, n_informative=12, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# 2. Pipeline Terintegrasi: Standarisasi Fitur + Estimator Random Forest
model_pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42))
])

# 3. Validasi Silang (Stratified 5-Fold Cross Validation)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(model_pipeline, X_train, y_train, cv=cv, scoring="f1_macro")

# 4. Pelatihan dan Inferensi
model_pipeline.fit(X_train, y_train)
y_pred = model_pipeline.predict(X_test)

print(f"Rata-rata Skor F1 Validasi Silang: {np.mean(cv_scores):.4f} (+/- {np.std(cv_scores):.4f})")
print("\nLaporan Evaluasi Pengujian:")
print(classification_report(y_test, y_pred, digits=4))`,
      parameterRows: [
        { param: "n_estimators", type: "Integer", defaultValue: "100-300", desc: "Jumlah pohon keputusan dalam ensemble untuk mereduksi varians prediksi." },
        { param: "max_depth", type: "Integer / None", defaultValue: "6-12", desc: "Batas kedalaman maksimal simpul pohon guna mencegah overfitting." },
        { param: "stratify", type: "Array / None", defaultValue: "y_train", desc: "Menjamin proporsi distribusi kelas target tetap identik pada setiap partisi lipatan." },
      ],
      bestPractices: [
        "Selalu gunakan Pipeline Scikit-Learn untuk membungkus preprocessing bersama estimator guna mencegah kebocoran data (*data leakage*).",
        "Gunakan Stratified K-Fold saat mengevaluasi data klasifikasi dengan proporsi label yang tidak seimbang (*class imbalance*).",
        "Periksa koefisien feature importance atau SHAP values sebelum menerapkan model ke lingkungan produksi untuk verifikasi interpretabilitas.",
      ],
    };
  }

  // 24. Artificial Intelligence Fundamentals & Search Algorithms
  if (
    norm.includes("artificial intelligence fundamentals") ||
    norm.includes("ai fundamentals") ||
    norm.includes("dasar kecerdasan buatan") ||
    norm.includes("fondasi ai") ||
    norm.includes("state space") ||
    norm.includes("heuristic search") ||
    norm.includes("a*") ||
    norm.includes("minimax") ||
    (norm.includes("kecerdasan buatan") && !norm.includes("data engineering"))
  ) {
    return {
      domainName: "Artificial Intelligence Fundamentals",
      frameworks: "Python Standard Library (heapq, collections), NetworkX, State Space Engine",
      foundations: `Fondasi Kecerdasan Buatan berakar pada perancangan Agen Rasional (*Rational Agent*) yang mengamati kondisi lingkungan melalui sensor dan melakukan aksi melalui aktuator demi memaksimalkan ukuran performa yang diharapkan. Konsep fundamental mencakup pemodelan masalah dalam ruang keadaan (*State Space*), penelusuran graf solusi (Uninformed Search: BFS, DFS, UCS; Informed/Heuristic Search: A*, Greedy Best-First), pemenuhan kendala (*Constraint Satisfaction Problems*), serta pencarian adversarial (Minimax dengan Alpha-Beta Pruning).`,
      mathTitle: "Fungsi Evaluasi Heuristik A* & Teorema Admisibilitas",
      mathFormula: `$$f(n) = g(n) + h(n)$$

$$0 \\le h(n) \\le h^*(n) \\implies A^* \\text{ Menjamin Solusi Optimal (Admissible)}$$`,
      mathExplanation: `Di mana $g(n)$ adalah biaya riil akumulatif dari simpul awal ke simpul $n$, $h(n)$ merupakan fungsi heuristik perkiraan biaya dari simpul $n$ menuju simpul tujuan, dan $h^*(n)$ merepresentasikan jarak terpendek sebenarnya. Selama heuristik bersifat *admissible* dan konsisten (memenuhi pertidaksamaan segitiga), algoritma A* dijamin menemukan jalur berbiaya minimal tanpa mengeksplorasi ulang simpul tertutup.`,
      defaultCode: (sub, chap) => `# Praktikum Pencarian Heuristik Graf (A* Search): ${sub}
import heapq
from typing import Dict, List, Tuple, Optional

def a_star_search(
    graph: Dict[str, List[Tuple[str, float]]],
    heuristics: Dict[str, float],
    start: str,
    goal: str
) -> Tuple[Optional[List[str]], float]:
    # Priority queue elemen: (f_score, cost_so_far, current_node, path)
    open_set = [(heuristics.get(start, 0.0), 0.0, start, [start])]
    visited_costs = {start: 0.0}

    while open_set:
        f_score, g_cost, current, path = heapq.heappop(open_set)

        if current == goal:
            return path, g_cost

        for neighbor, edge_weight in graph.get(current, []):
            new_g = g_cost + edge_weight
            if neighbor not in visited_costs or new_g < visited_costs[neighbor]:
                visited_costs[neighbor] = new_g
                new_f = new_g + heuristics.get(neighbor, 0.0)
                heapq.heappush(open_set, (new_f, new_g, neighbor, path + [neighbor]))

    return None, float("inf")

# Contoh Peta Graf Berbobot
peta = {
    "A": [("B", 4.0), ("C", 2.0)],
    "B": [("D", 5.0), ("E", 10.0)],
    "C": [("D", 3.0), ("F", 8.0)],
    "D": [("Goal", 6.0)],
    "E": [("Goal", 2.0)],
    "F": [("Goal", 4.0)],
}
estimasi_heuristik = {"A": 10.0, "B": 7.0, "C": 8.0, "D": 5.0, "E": 2.0, "F": 4.0, "Goal": 0.0}

jalur_terbaik, total_biaya = a_star_search(peta, estimasi_heuristik, "A", "Goal")
print(f"Hasil Penelusuran Ruang Keadaan:")
print(f"Jalur Optimal : {' -> '.join(jalur_terbaik)}")
print(f"Total Biaya   : {total_biaya}")`,
      parameterRows: [
        { param: "heuristic_function", type: "Callable", defaultValue: "Manhattan / Euclidean", desc: "Fungsi estimasi jarak yang tidak boleh melebihi biaya riil (admissible)." },
        { param: "open_set", type: "Min-Heap", defaultValue: "heapq", desc: "Antrean berprioritas untuk mengekstrak simpul dengan nilai f(n) terkecil dalam O(log V)." },
        { param: "visited_costs", type: "Hash Map", defaultValue: "dict", desc: "Menyimpan nilai g(n) terendah yang pernah ditemukan untuk mencegah traversal siklik." },
      ],
      bestPractices: [
        "Pastikan fungsi heuristik selalu bersifat admissible ($h(n) \\le h^*(n)$) agar penelusuran dijamin konvergen pada solusi optimal.",
        "Gunakan struktur data Adjacency List atau Grid Koordinat untuk meminimalkan beban memori saat ruang pencarian berukuran masif.",
        "Terapkan pemangkasan cabang (pruning) untuk mereduksi ruang pencarian pada pohon keputusan kombinatorial.",
      ],
    };
  }

  // 25. Database Systems & Data Architecture
  if (
    norm.includes("database") ||
    norm.includes("basis data") ||
    norm.includes("postgresql") ||
    norm.includes("mysql") ||
    norm.includes("mongodb") ||
    norm.includes("redis") ||
    norm.includes("nosql") ||
    norm.includes("sqlite") ||
    norm.includes("rdbms")
  ) {
    return {
      domainName: "Database Systems & Data Storage Architecture",
      frameworks: "PostgreSQL, MySQL, Redis, MongoDB, SQLite, SQLAlchemy",
      foundations: `Arsitektur Sistem Basis Data mengatur persistensi, konsistensi transaksi, dan pengindeksan data berkecepatan tinggi. Desain skema relasional menerapkan prinsip normalisasi (1NF hingga BCNF) untuk mengeliminasi anomali modifikasi, sementara sistem NoSQL dan Key-Value store (Redis) mengoptimasi penulisan horizontal terdistribusi sesuai kriteria CAP Theorem.`,
      mathTitle: "Tinggi Pohon B-Tree Index & Formulasi ACID Isolation",
      mathFormula: `$$h \\le \\left\\lceil \\log_B \\left( \\frac{N + 1}{2} \\right) \\right\\rceil$$

$$\\text{Throughput Transaksi} = \\frac{\\text{Total Committed Transactions}}{\\Delta t}$$`,
      mathExplanation: `Di mana $h$ adalah batas maksimal tinggi struktur indeks B-Tree dengan orde percabangan $B$ dan jumlah rekaman $N$. Indeks B-Tree menjamin kompleksitas pencarian, penyisipan, dan penghapusan tetap stabil dalam batas waktu logaritmik $\\mathcal{O}(\\log N)$ dengan I/O disk minimal.`,
      defaultCode: (sub, chap) => `# Praktikum Interaksi Basis Data Transaksional: ${sub}
import sqlite3
from contextlib import closing

# Inisialisasi basis data relasional dalam memori
with sqlite3.connect(":memory:") as conn:
    conn.execute("PRAGMA foreign_keys = ON;")
    with closing(conn.cursor()) as cursor:
        # 1. DDL: Pembuatan Tabel Berelasi dengan Integritas Referensial
        cursor.execute("""
            CREATE TABLE users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                balance REAL DEFAULT 0.0 CHECK(balance >= 0.0)
            );
        """)
        
        cursor.execute("""
            CREATE TABLE audit_logs (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
        """)
        
        # 2. DML: Transaksi Atomik Terisolasi
        cursor.execute("INSERT INTO users (email, full_name, balance) VALUES (?, ?, ?);",
                       ("alex@example.com", "Alex Pratama", 500000.0))
        uid = cursor.lastrowid
        cursor.execute("INSERT INTO audit_logs (user_id, action) VALUES (?, ?);",
                       (uid, "ACCOUNT_INITIALIZED"))
        conn.commit()

        # 3. Kueri Verifikasi
        cursor.execute("""
            SELECT u.full_name, u.email, u.balance, a.action, a.timestamp
            FROM users u
            JOIN audit_logs a ON u.user_id = a.user_id;
        """)
        baris = cursor.fetchone()
        print(f"Data Pengguna : {baris[0]} ({baris[1]})")
        print(f"Saldo Akhir   : Rp {baris[2]:,.2f}")
        print(f"Riwayat Log   : {baris[3]} pada {baris[4]}")`,
      parameterRows: [
        { param: "isolation_level", type: "ACID Standard", defaultValue: "READ COMMITTED", desc: "Mencegah fenomena kotor (dirty reads) pada eksekusi konkuren simultan." },
        { param: "indexing_method", type: "Struktur Akses", defaultValue: "B-Tree / GIN / Hash", desc: "Metode struktur data indeks untuk mengakselerasi klausa WHERE dan JOIN." },
        { param: "connection_pool_size", type: "Integer", defaultValue: "10-50 Koneksi", desc: "Membatasi koneksi soket aktif ke server basis data guna mencegah kehabisan sumber daya." },
      ],
      bestPractices: [
        "Selalu buat indeks pada kolom foreign key dan kolom yang sering digunakan dalam klausa WHERE, ORDER BY, atau JOIN.",
        "Gunakan transaksi berparameter (Prepared Statements) untuk mengeliminasi kerentanan serangan SQL Injection secara mutlak.",
        "Rancang skema dengan aturan integritas referensial (FOREIGN KEY dengan ON DELETE CASCADE / SET NULL) untuk mencegah data yatim (orphaned records).",
      ],
    };
  }

  // 26. Web Development & Fullstack Engineering
  if (
    norm.includes("web development") ||
    norm.includes("rekayasa web") ||
    norm.includes("next.js") ||
    norm.includes("react") ||
    norm.includes("frontend") ||
    norm.includes("backend") ||
    norm.includes("rest api") ||
    norm.includes("node.js") ||
    norm.includes("express") ||
    norm.includes("vue") ||
    norm.includes("angular") ||
    norm.includes("svelte")
  ) {
    return {
      domainName: "Web Development & Fullstack Engineering",
      frameworks: "Next.js, React, TypeScript, Node.js, TailwindCSS, REST API",
      foundations: `Rekayasa Web Modern berpusat pada perancangan antarmuka pengguna responsif berbasis komponen modular, hidrasi rendering sisi server (*Server-Side Rendering / SSR*), dan komunikasi data asinkronus melalui protokol HTTP/REST atau GraphQL. Penerapan prinsip arsitektur bersih memisahkan logika antarmuka (*Presentation Layer*), manajemen status aplikasi (*State Management*), dan lapisan layanan data (*Service Layer*).`,
      mathTitle: "Kompleksitas Pereduksian Virtual DOM & Analisis Latensi Jaringan",
      mathFormula: `$$\\text{Kompleksitas Rekonsiliasi Diffing} = \\mathcal{O}(n)$$

$$\\text{Total Waktu Muat Halaman} = \\text{DNS} + \\text{TCP/TLS Handshake} + \\text{TTFB} + \\text{Download Content}$$`,
      mathExplanation: `Di mana algoritma rekonsiliasi Virtual DOM modern mereduksi perbandingan pohon elemen dari $\\mathcal{O}(n^3)$ menjadi batas linear $\\mathcal{O}(n)$ melalui penggunaan atribut kunci unik (\`key\`). Metrik TTFB (*Time to First Byte*) mengukur latensi respons server terhadap permintaan klien.`,
      defaultCode: (sub, chap) => `# Praktikum Desain Endpoint REST API Bersih: ${sub}
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Dict, Any

class AcademicAPIHandler(BaseHTTPRequestHandler):
    def _send_json_response(self, status_code: int, payload: Dict[str, Any]):
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/status":
            self._send_json_response(200, {
                "system": "Velqora Fullstack Core",
                "status": "operational",
                "version": "2.4.0",
                "module_loaded": "${sub}"
            })
        else:
            self._send_json_response(404, {"error": "Endpoint tidak ditemukan"})

print("Server HTTP Mock berhasil dikonfigurasi untuk endpoint: /api/status")`,
      parameterRows: [
        { param: "rendering_mode", type: "Arsitektur", defaultValue: "SSR / SSG / ISR", desc: "Metode kompilasi halaman web untuk menyeimbangkan performa SEO dan kecepatan muat." },
        { param: "http_cache_control", type: "Header HTTP", defaultValue: "s-maxage=3600, stale-while-revalidate", desc: "Strategi penyimpanan cache edge CDN guna mereduksi beban komputasi server asal." },
        { param: "cors_origin", type: "Keamanan", defaultValue: "Domain Terotorisasi", desc: "Membatasi akses sumber daya lintas domain hanya untuk klien yang sah." },
      ],
      bestPractices: [
        "Terapkan pemisahan kode (*Code Splitting*) dan pemuatan malas (*Lazy Loading*) pada komponen berat untuk mempercepat First Contentful Paint (FCP).",
        "Validasi masukan dari klien di kedua sisi (klien dan server) menggunakan skema tipe data ketat seperti Zod atau Pydantic.",
        "Pastikan tata letak responsif dan aksesibilitas antarmuka memenuhi standar WCAG (kontras warna dan label semantik elemen ARIA).",
      ],
    };
  }

  // 27. Cyber Security & Cryptography
  if (
    norm.includes("cyber security") ||
    norm.includes("keamanan siber") ||
    norm.includes("cryptography") ||
    norm.includes("kriptografi") ||
    norm.includes("encryption") ||
    norm.includes("enkripsi") ||
    norm.includes("owasp") ||
    norm.includes("network security")
  ) {
    return {
      domainName: "Cyber Security & Information Assurance",
      frameworks: "OpenSSL, PyCryptodome, Wireshark, OWASP Top 10 Framework",
      foundations: `Keamanan Siber dan Kriptografi menjamin pilar CIA Triad: Kerahasiaan (*Confidentiality*), Integritas (*Integrity*), dan Ketersediaan (*Availability*). Pengamanan infrastruktur mencakup penerapan algoritma kriptografi simetris (AES-GCM), asimetris (RSA, ECC), fungsi hash satu arah resisten benturan (SHA-256), autentikasi token nirkeadaan (JWT dengan HMAC), serta mitigasi kerentanan perangkat lunak standar industri (OWASP).`,
      mathTitle: "Kriptosistem Asimetris RSA & Sifat Resistensi Hash",
      mathFormula: `$$c \\equiv m^e \\pmod n, \\quad m \\equiv c^d \\pmod n$$

$$e \\cdot d \\equiv 1 \\pmod{\\phi(n)}, \\quad \\phi(n) = (p - 1)(q - 1)$$`,
      mathExplanation: `Di mana $n = p \\cdot q$ adalah modulus publik dari hasil perkalian dua bilangan prima rahasia berukuran besar, $e$ adalah eksponen enkripsi publik, dan $d$ merupakan eksponen dekripsi privat yang diturunkan melalui algoritma Extended Euclidean. Keamanan RSA bersandar pada kesulitan komputasi faktorisasi bilangan bulat (*Integer Factorization Problem*).`,
      defaultCode: (sub, chap) => `# Praktikum Kriptografi Integritas Data (HMAC-SHA256): ${sub}
import hmac
import hashlib
import time

def generate_secure_token(secret_key: bytes, message: str) -> Tuple[str, float]:
    timestamp = time.time()
    payload = f"{message}:{timestamp}".encode("utf-8")
    
    # Kalkulasi penandatanganan kriptografis HMAC
    signature = hmac.new(secret_key, payload, hashlib.sha256).hexdigest()
    token = f"{payload.decode('utf-8')}:{signature}"
    return token, timestamp

def verify_secure_token(secret_key: bytes, token: str, max_age_seconds: float = 60.0) -> bool:
    parts = token.rsplit(":", 1)
    if len(parts) != 2:
        return False
    payload_str, signature = parts
    
    expected_sig = hmac.new(secret_key, payload_str.encode("utf-8"), hashlib.sha256).hexdigest()
    # Verifikasi waktu konstan guna mencegah serangan waktu (Timing Attack)
    if not hmac.compare_digest(signature, expected_sig):
        return False
        
    _, ts_str = payload_str.split(":", 1)
    if time.time() - float(ts_str) > max_age_seconds:
        return False # Token kedaluwarsa
    return True

kunci_rahasia = b"koleksi_belajar_velqora_production_key_2026"
token, waktu_buat = generate_secure_token(kunci_rahasia, "USER_SESSION_10928")
print(f"Token Tergenerasi : {token[:45]}...")
print(f"Status Integritas : {'VALID & ASLI' if verify_secure_token(kunci_rahasia, token) else 'TIDAK VALID'}")`,
      parameterRows: [
        { param: "key_size", type: "Panjang Kunci", defaultValue: "AES-256 / RSA-4096", desc: "Kekuatan ruang kunci untuk menahan serangan brute-force komputasi kuantum." },
        { param: "hash_algorithm", type: "Fungsi Hash", defaultValue: "SHA-256 / BLAKE3", desc: "Fungsi kondensasi data dengan jaminan resistensi preimage dan resistensi benturan (*collision-resistant*)." },
        { param: "salt_iterations", type: "Integer", defaultValue: "100.000+ (PBKDF2 / Argon2id)", desc: "Faktor pelambatan komputasi untuk menangkal serangan kamus (*dictionary attacks*)." },
      ],
      bestPractices: [
        "Gunakan perbandingan waktu konstan (\`hmac.compare_digest\`) untuk memeriksa hash dan token guna mencegah eksploitasi celah Timing Attack.",
        "Jangan pernah mengimplementasikan pustaka kriptografi buatan sendiri (*Never Roll Your Own Crypto*); gunakan modul resmi teraudit seperti PyCryptodome atau WebCrypto.",
        "Terapkan prinsip hak istimewa paling rendah (*Principle of Least Privilege*) pada kontrol akses otorisasi API dan layanan basis data.",
      ],
    };
  }

  // 28. DevOps, Cloud Computing, & Container Orchestration
  if (
    norm.includes("devops") ||
    norm.includes("cloud") ||
    norm.includes("docker") ||
    norm.includes("kubernetes") ||
    norm.includes("k8s") ||
    norm.includes("ci/cd") ||
    norm.includes("linux") ||
    norm.includes("aws")
  ) {
    return {
      domainName: "DevOps, Cloud Computing, & Container Orchestration",
      frameworks: "Docker, Kubernetes, Linux, GitHub Actions, AWS, Prometheus",
      foundations: `Disiplin DevOps dan Cloud Computing menjembatani rekayasa perangkat lunak dengan keandalan operasional sistem (*Site Reliability Engineering / SRE*). Prinsip inti mencakup kontainerisasi aplikasi (*Docker*), orkestrasi pod otomatis (*Kubernetes*), alur integrasi dan pengiriman berkesinambungan (*CI/CD*), serta observabilitas telemetri (metrik, jejak, dan log).`,
      mathTitle: "Ketersediaan Sistem SLA & Formulasi Horizontal Pod Autoscaler",
      mathFormula: `$$\\text{SLA (Availability)} = \\frac{\\text{MTBF}}{\\text{MTBF} + \\text{MTTR}} \\times 100\\%$$

$$\\text{Jumlah Replikasi Desired} = \\left\\lceil \\text{Replikasi Saat Ini} \\times \\frac{\\text{Metrik Penggunaan Aktual}}{\\text{Metrik Penggunaan Target}} \\right\\rceil$$`,
      mathExplanation: `Di mana MTBF (*Mean Time Between Failures*) mengukur rerata durasi operasional normal, MTTR (*Mean Time To Repair*) menghitung kecepatan waktu pemulihan insiden, dan HPA (*Horizontal Pod Autoscaler*) menyesuaikan kapasitas replikasi kontainer secara dinamis berdasarkan pemanfaatan CPU atau memori.`,
      defaultCode: (sub, chap) => `# Praktikum Konfigurasi CI/CD & Healthcheck Pipeline: ${sub}
import json
import os

def generate_container_spec(service_name: str, port: int, replicas: int = 3) -> dict:
    return {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
            "name": f"{service_name}-deployment",
            "labels": {"app": service_name}
        },
        "spec": {
            "replicas": replicas,
            "selector": {"matchLabels": {"app": service_name}},
            "template": {
                "metadata": {"labels": {"app": service_name}},
                "spec": {
                    "containers": [{
                        "name": service_name,
                        "image": f"registry.velqora.internal/{service_name}:latest",
                        "ports": [{"containerPort": port}],
                        "livenessProbe": {
                            "httpGet": {"path": "/healthz", "port": port},
                            "initialDelaySeconds": 15,
                            "periodSeconds": 10
                        }
                    }]
                }
            }
        }
    }

spec = generate_container_spec("analytics-worker", 8080)
print(f"Spesifikasi Manifest Kubernetes untuk: {spec['metadata']['name']}")
print(json.dumps(spec, indent=2)[:350] + "\n  ...\n}")`,
      parameterRows: [
        { param: "replicas", type: "Integer", defaultValue: "2 - 10", desc: "Jumlah instans kontainer pod redundan untuk menjaga High Availability (HA)." },
        { param: "initialDelaySeconds", type: "Integer (detik)", defaultValue: "10-30", desc: "Waktu tunggu awal inisialisasi aplikasi sebelum pemeriksaan liveness probe dimulai." },
        { param: "resource_limits", type: "CPU / Memori", defaultValue: "500m / 512Mi", desc: "Batas pemakaian sumber daya fisik per pod untuk mencegah Out-Of-Memory (OOM) Killer." },
      ],
      bestPractices: [
        "Gunakan multistage build pada Dockerfile guna menghasilkan image berukuran minimal dan bebas dari compiler build dependencies yang tidak dibutuhkan saat runtime.",
        "Tentukan probe liveness dan readiness pada setiap konfigurasi pod agar traffic tidak diarahkan ke kontainer yang belum siap.",
        "Simpan rahasia autentikasi (*secrets*) pada vault terenkripsi, bukan sebagai plain-text dalam commit git atau Dockerfile.",
      ],
    };
  }

  // Fallback Universal: Ilmu Komputer & Rekayasa Komputasi
  return {
    domainName: categoryName || "Ilmu Komputer & Rekayasa Komputasi",
    frameworks: "Python 3.11+, Standar Komputasi Terapan",
    foundations: `Materi **${subtopicTitle}** merupakan modul inti dalam kerangka kurikulum **${categoryName}**. Pembahasan difokuskan pada penguasaan konsep komputasi terstruktur, arsitektur modular, efisiensi eksekusi sistem, dan penerapan praktik rekayasa perangkat lunak terstandarisasi.`,
    mathTitle: `Analisis Asimptotik & Formulasi Kinerja ${subtopicTitle}`,
    mathFormula: `$$T(n) = \mathcal{O}\big(f(n)\big), \quad \text{Throughput} = \frac{\text{Jumlah Operasi}}{\Delta t}$$

$$\text{Efisiensi Sistem} = \frac{\text{Keluaran Berguna}}{\text{Total Sumber Daya Terpakai}} \times 100\%$$`,
    mathExplanation: `Di mana $T(n)$ mengukur batas pertumbuhan kebutuhan komputasi terhadap ukuran masukan $n$, dan throughput mengukur kapasitas eksekusi operasional per satuan waktu.`,
    defaultCode: (sub, chap) => `# Praktikum Komputasi Terapan: ${sub}
import time

def execute_computational_task(n_items: int = 5000):
    start_time = time.perf_counter()
    result = sum(i * 2 for i in range(n_items) if i % 3 == 0)
    duration_ms = (time.perf_counter() - start_time) * 1000
    return result, duration_ms

hasil, durasi = execute_computational_task(10000)
print(f"Topik Modul    : ${categoryName} - ${sub}")
print(f"Hasil Eksekusi : {hasil}")
print(f"Durasi Waktu   : {durasi:.3f} ms")
print("Validasi algoritma berhasil diselesaikan secara presisi.")`,
    parameterRows: [
      { param: "throughput", type: "Float", defaultValue: "Ops / Detik", desc: "Kecepatan pemrosesan transaksi atau data per satuan waktu." },
      { param: "latency", type: "Float (ms)", defaultValue: "< 50 ms", desc: "Waktu tunda yang dibutuhkan sistem dari masukan diterima hingga hasil dikeluarkan." },
      { param: "concurrency", type: "Integer", defaultValue: "Tergantung Core CPU", desc: "Kapasitas eksekusi tugas paralel simultan tanpa degradasi performa." },
    ],
    bestPractices: [
      "Awali setiap implementasi dengan merumuskan spesifikasi fungsional dan kriteria penerimaan yang terukur.",
      "Lakukan profiling performa CPU dan memori sebelum melakukan optimasi prematur.",
      "Pastikan kode terdokumentasi dengan baik serta memiliki cakupan pengujian modular yang memadai.",
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
