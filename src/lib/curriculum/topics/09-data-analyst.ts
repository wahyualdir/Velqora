import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: DATA ANALYST (TOPIK 9) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - McKinney, W. (2022). Python for Data Analysis (3rd ed.). O'Reilly Media.
 * - Few, S. (2009). Now You See It: Simple Visualization Techniques for Quantitative Analysis. Analytics Press.
 * - Montgomery, D. C., & Runger, G. C. (2018). Applied Statistics and Probability for Engineers. John Wiley & Sons.
 * - Kohavi, R., Tang, D., & Xu, Y. (2020). Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing. Cambridge University Press.
 * - Tufte, E. R. (2001). The Visual Display of Quantitative Information (2nd ed.). Graphics Press.
 */
export const dataAnalystCurriculum: AcademicCurriculum = {
  id: "data-analyst",
  slug: "data-analyst",
  title: "Data Analyst",
  category: "Kecerdasan Buatan",
  level: "pemula",
  description: "Kurikulum analisis data analitik profesional: pembersihan dan transformasi data menggunakan Pandas 2.0 & NumPy, kueri analitik relasional SQL tingkat lanjut (Window Functions, CTE), statistika inferensial dan pengujian hipotesis (A/B Testing), analisis kohort dan RFM, serta perancangan dashboard visualisasi bisnis.",
  estimatedHours: 56,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Python for Data Analysis: Data Wrangling with pandas, NumPy, and Jupyter (3rd Edition)",
      authors: ["Wes McKinney"],
      type: "book",
      url: "https://wesmckinney.com/book/",
      relevance: "Rujukan kanonikal manipulasi data tabular, agregasi Series/DataFrame, dan pengindeksan multi-level berkinerja tinggi.",
      year: 2022,
      publisherOrVenue: "O'Reilly Media",
    },
    {
      title: "Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing",
      authors: ["Ron Kohavi", "Diane Tang", "Ya Xu"],
      type: "book",
      url: "https://experimentguide.com/",
      relevance: "Metodologi pengujian A/B terkontrol, perhitungan sample size, dan analisis signifikansi statistik.",
      year: 2020,
      publisherOrVenue: "Cambridge University Press",
    },
    {
      title: "The Visual Display of Quantitative Information (2nd Edition)",
      authors: ["Edward R. Tufte"],
      type: "book",
      url: "https://www.edwardtufte.com/tufte/books_vdqi",
      relevance: "Prinsip grafika kuantitatif: data-ink ratio, chartjunk elimination, dan integritas visual.",
      year: 2001,
      publisherOrVenue: "Graphics Press",
    },
  ],
  chapters: [
    {
      id: "da-bab-1",
      slug: "fondasi-analisis-data-dan-siklus-hidup",
      title: "BAB 1: Fondasi Analisis Data & Siklus Hidup Analitik",
      orderIndex: 1,
      description: "Siklus hidup data dari akuisisi hingga preskriptif, taksonomi tipe data variabel (skala Stevens), dan perbedaan fundamental antara EDA dan Confirmatory Data Analysis.",
      subchapters: [
        {
          id: "da-bab-1-1",
          slug: "spektrum-analitik-dan-skala-pengukuran",
          title: "1.1. Spektrum Analitik Bisnis & Skala Pengukuran Stevens",
          orderIndex: 1,
          description: "Klasifikasi analitik (Deskriptif, Diagnostik, Prediktif, Preskriptif) dan 4 skala pengukuran variabel (Nominal, Ordinal, Interval, Rasio).",
          content_markdown: `# 1.1. Spektrum Analitik Bisnis & Skala Pengukuran Stevens

## 1. Empat Tingkatan Spektrum Analitik
Analisis data modern terbagi menjadi empat spektrum kematangan analitik (*Gartner Analytics Maturity Model*):
1. **Analisis Deskriptif (*What happened?*)**: Menghitung ringkasan agregat historis (misal: total penjualan Q3, churn rate bulanan).
2. **Analisis Diagnostik (*Why did it happen?*)**: Penelusuran akar penyebab melalui segmentasi, korelasi, dan *drill-down* multidimensi.
3. **Analisis Prediktif (*What will happen?*)**: Memodelkan tren probabilistik dan estimasi nilai masa depan.
4. **Analisis Preskriptif (*How can we make it happen?*)**: Optimasi keputusan dan simulasi berbasis kendala bisnis.

## 2. Skala Pengukuran Variabel (Stanley Smith Stevens, 1946)
Sebelum melakukan operasi matematika pada kolom data, analis wajib memvalidasi skala pengukuran variabel:

| Skala | Definisi Operasional | Operasi Matematika Legal | Ukuran Pemusatan yang Sah | Contoh |
| :--- | :--- | :--- | :--- | :--- |
| **Nominal** | Kategori tanpa urutan intrinsik | $=, \\neq$ | Modus | Kategori Produk, Gender, Status Pernikahan |
| **Ordinal** | Kategori dengan urutan peringkat | $=, \\neq, <, >$ | Median, Persentil | Tingkat Kepuasan (Skala Likert 1-5), Pangkat Militer |
| **Interval** | Jarak terukur seragam tanpa nol mutlak | $+ , -$ | Rata-rata Aritmatika, Standar Deviasi | Suhu Celsius/Fahrenheit, Skor IQ, Tanggal Kalender |
| **Rasio** | Memiliki nilai nol mutlak sejati | $+ , -, \\times, \\div$ | Rata-rata Geometrik, Koefisien Variasi | Pendapatan (IDR), Bobot (kg), Durasi Waktu (detik) |
`,
        },
      ],
    },
    {
      id: "da-bab-2",
      slug: "data-wrangling-dan-pandas-arrow",
      title: "BAB 2: Data Wrangling & Pengindeksan Lanjut Pandas 2.0",
      orderIndex: 2,
      description: "Optimasi memori dengan PyArrow backend, manipulasi MultiIndex, chaining pattern yang idiomatik, dan strategi imputasi data tabular.",
      subchapters: [
        {
          id: "da-bab-2-1",
          slug: "vektorisasi-pyarrow-dan-optimasi-memori",
          title: "2.1. Efisiensi Vektorisasi & Ekosistem Apache Arrow pada Pandas 2.0",
          orderIndex: 1,
          description: "Pergeseran penyimpanan memori berbasis kolom Apache Arrow vs NumPy, tipe data nullable, dan penghapusan loop Python lambat.",
          content_markdown: `# 2.1. Efisiensi Vektorisasi & Ekosistem Apache Arrow pada Pandas 2.0

## 1. Keunggulan Arsitektur Apache Arrow
Pandas 2.0 memperkenalkan backend Apache Arrow secara penuh. Arrow menyimpan data dalam format kolumnar *contiguous memory*, memungkinkan:
1. **Zero-Copy Memory Sharing**: Akses langsung antar-proses tanpa biaya serialisasi/deserialisasi.
2. **SIMD Vectorization**: Eksekusi satu instruksi CPU ke banyak nilai data secara paralel (*Single Instruction, Multiple Data*).
3. **Native Nullability**: Mendukung nilai hilang (\`pd.NA\`) pada kolom integer dan boolean tanpa perlu melakukan *casting* otomatis ke \`float64\`.

## 2. Kode Implementasi: Wrangling Vektorisasi Berkinerja Tinggi
\`\`\`python
import pandas as pd
import numpy as np

# Simulasi Dataset Transaksi E-Commerce 100,000 Baris
np.random.seed(42)
n_rows = 100_000

raw_data = {
    "order_id": np.arange(1, n_rows + 1),
    "customer_segment": np.random.choice(["Retail", "Corporate", "SME"], size=n_rows),
    "quantity": np.random.randint(1, 20, size=n_rows),
    "unit_price": np.random.uniform(10.0, 500.0, size=n_rows),
    "discount_pct": np.random.choice([0.0, 0.05, 0.1, 0.15, np.nan], size=n_rows, p=[0.5, 0.2, 0.15, 0.1, 0.05])
}

# Inisialisasi DataFrame dengan backend Apache Arrow
df = pd.DataFrame(raw_data).convert_dtypes(dtype_backend="pyarrow")

# Chaining idiomatik: pembersihan, kalkulasi revenue bersih, dan imputasi
clean_df = (
    df
    .assign(
        # Imputasi discount hilang dengan nilai 0.0 (tanpa diskon)
        discount_pct=lambda x: x["discount_pct"].fillna(0.0),
        # Vektorisasi pendapatan kotor dan bersih
        gross_revenue=lambda x: x["quantity"] * x["unit_price"],
        net_revenue=lambda x: x["gross_revenue"] * (1.0 - x["discount_pct"])
    )
    .query("net_revenue > 0")
)

# Ringkasan Kinerja per Segmen Pelanggan
summary = (
    clean_df
    .groupby("customer_segment")
    .agg(
        total_orders=("order_id", "count"),
        total_net_revenue=("net_revenue", "sum"),
        avg_order_value=("net_revenue", "mean"),
        max_discount=("discount_pct", "max")
    )
    .reset_index()
)

print("=== RINGKASAN REVENUE PER SEGMEN ===")
print(summary.to_string(index=False))
\`\`\`
`,
        },
      ],
    },
    {
      id: "da-bab-3",
      slug: "advanced-sql-dan-window-functions",
      title: "BAB 3: Kueri Analitik Relasional & Advanced SQL",
      orderIndex: 3,
      description: "Penguasaan Window Functions SQL (ROW_NUMBER, DENSE_RANK, LAG, LEAD), frame clause ROWS/RANGE, Common Table Expressions (CTE) bertingkat, dan kueri analitik kohort.",
      subchapters: [
        {
          id: "da-bab-3-1",
          slug: "window-functions-dan-frame-specification",
          title: "3.1. Window Functions & Frame Clause Specification",
          orderIndex: 1,
          description: "Mekanisme partisi data OVER(PARTITION BY ... ORDER BY ...), perbandingan ranking deterministik, dan moving window running totals.",
          content_markdown: `# 3.1. Window Functions & Frame Clause Specification

## 1. Anatomi Window Function
Tidak seperti \`GROUP BY\` yang mereduksi baris data menjadi satu baris agregat, **Window Function** menghitung nilai analitik pada partisi data sembari mempertahankan seluruh baris individual:

$$\\text{FUNCTION}(arg) \\quad \\mathbf{OVER} \\quad \\Big( \\mathbf{PARTITION\\;BY} \\; k_1 \\quad \\mathbf{ORDER\\;BY} \\; k_2 \\quad [\\text{window\\_frame}] \\Big)$$

## 2. Kueri SQL Tingkat Lanjut: Analisis MoM Growth & Running Total
Berikut adalah kueri SQL standar ANSI yang mengimplementasikan CTE, \`LAG\`, dan frame spesifikasi bergerak:

\`\`\`sql
WITH MonthlySales AS (
    -- Langkah 1: Agregasi total penjualan bulanan per departemen
    SELECT 
        department_id,
        DATE_TRUNC('month', transaction_date)::DATE AS sales_month,
        SUM(net_amount) AS current_month_sales
    FROM transactions
    WHERE status = 'COMPLETED'
    GROUP BY department_id, DATE_TRUNC('month', transaction_date)::DATE
),
EnrichedMetrics AS (
    -- Langkah 2: Menghitung penjualan bulan sebelumnya, MoM growth %, dan 3-month moving average
    SELECT
        department_id,
        sales_month,
        current_month_sales,
        LAG(current_month_sales, 1) OVER (
            PARTITION BY department_id 
            ORDER BY sales_month ASC
        ) AS previous_month_sales,
        -- Running Total Penjualan sejak awal tahun
        SUM(current_month_sales) OVER (
            PARTITION BY department_id, EXTRACT(YEAR FROM sales_month)
            ORDER BY sales_month ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS ytd_running_total,
        -- 3-Month Moving Average
        AVG(current_month_sales) OVER (
            PARTITION BY department_id
            ORDER BY sales_month ASC
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) AS moving_avg_3m
    FROM MonthlySales
)
SELECT 
    department_id,
    sales_month,
    current_month_sales,
    previous_month_sales,
    ROUND(
        (current_month_sales - previous_month_sales) / NULLIF(previous_month_sales, 0) * 100.0, 
        2
    ) AS mom_growth_pct,
    ytd_running_total,
    ROUND(moving_avg_3m, 2) AS moving_avg_3m
FROM EnrichedMetrics
ORDER BY department_id, sales_month;
\`\`\`
`,
        },
      ],
    },
    {
      id: "da-bab-4",
      slug: "statistika-eksploratori-dan-deteksi-anomali",
      title: "BAB 4: Statistika Deskriptif, Sebaran & Deteksi Outlier",
      orderIndex: 4,
      description: "Parameter ukuran pemusatan dan dispersi, kemencengan (skewness), kurtosis, deteksi pencilan (IQR fences, Z-Score, Modified Z-score MAD), serta analisis korelasi linear vs non-linear.",
      subchapters: [
        {
          id: "da-bab-4-1",
          slug: "deteksi-outlier-iqr-dan-modified-zscore",
          title: "4.1. Metode Deteksi Pencilan: IQR Fences & Modified Z-Score (MAD)",
          orderIndex: 1,
          description: "Kelemahan Z-score konvensional pada distribusi condong (*skewed*), formulasi Median Absolute Deviation (MAD), dan batas pagar Tukey.",
          content_markdown: `# 4.1. Metode Deteksi Pencilan: IQR Fences & Modified Z-Score (MAD)

## 1. Batas Pagar Tukey (IQR Method)
Metode non-parametrik klasik yang tahan terhadap keberadaan nilai ekstrem masif:
$$IQR = Q_3 - Q_1$$
$$\\text{Batas Bawah} = Q_1 - 1.5 \\times IQR$$
$$\\text{Batas Atas} = Q_3 + 1.5 \\times IQR$$

Nilai di luar interval $[Q_1 - 1.5 \\times IQR, Q_3 + 1.5 \\times IQR]$ diklasifikasikan sebagai pencilan potensial (*mild outlier*), sedangkan di luar $3.0 \\times IQR$ merupakan pencilan ekstrem (*extreme outlier*).

## 2. Modified Z-Score Berbasis MAD (Boris Iglewicz & David Hoaglin, 1993)
Ketika data berukuran kecil atau sangat condong, mean dan standar deviasi terdistorsi secara parah oleh outlier itu sendiri. Sebagai alternatif, digunakan **Median Absolute Deviation** (MAD):

$$\\text{MAD} = \\text{median}\\Big( |x_i - \\tilde{x}| \\Big)$$

Di mana $\\tilde{x}$ adalah median dari himpunan data. Skor $M_i$ dihitung sebagai:

$$M_i = \\frac{0.6745 \\cdot (x_i - \\tilde{x})}{\\text{MAD}}$$

Konstanta $0.6745$ berasal dari fakta bahwa untuk distribusi normal standar, $\\mathbb{E}[\\text{MAD}] = 0.6745 \\sigma$. Pengamatan dengan $|M_i| > 3.5$ dinyatakan sebagai pencilan (*outlier*).
`,
        },
      ],
    },
    {
      id: "da-bab-5",
      slug: "statistika-inferensial-dan-ab-testing",
      title: "BAB 5: Statistika Inferensial & Eksperimen A/B Testing",
      orderIndex: 5,
      description: "Uji hipotesis statistik terapan: Teorema Limit Pusat, Welch's Two-Sample t-test, uji Chi-Square untuk data proporsi kategorial, estimasi ukuran sampel minimum (Power Analysis), dan pencegahan jebakan p-hacking.",
      subchapters: [
        {
          id: "da-bab-5-1",
          slug: "matematika-dan-rancangan-ab-testing",
          title: "5.1. Formulasi Matematika A/B Testing & Power Analysis",
          orderIndex: 1,
          description: "Desain eksperimen online acak terkontrol (RCT): perumusan hipotesis nol vs alternatif, galat Tipe I ($\\alpha$), galat Tipe II ($\\beta$), dan ukuran sampel Evan Miller.",
          content_markdown: `# 5.1. Formulasi Matematika A/B Testing & Power Analysis

## 1. Kerangka Uji Hipotesis Dua Sisi
Pada uji A/B testing digital (misal: pengujian desain tombol Checkout A vs B terhadap rasio konversi $p_A$ dan $p_B$):
- **Hipotesis Nol ($H_0$)**: $p_B - p_A = 0$ (Tidak ada efek perbedaan antar perlakuan).
- **Hipotesis Alternatif ($H_1$)**: $p_B - p_A \\neq 0$ (Terdapat perbedaan signifikan).

Ukuran statistik uji $Z$ untuk selisih dua proporsi independen:

$$Z = \\frac{\\hat{p}_B - \\hat{p}_A}{\\sqrt{\\hat{p}(1 - \\hat{p})\\left(\\frac{1}{n_A} + \\frac{1}{n_B}\\right)}}$$

Di mana $\\hat{p} = \\frac{x_A + x_B}{n_A + n_B}$ adalah estimasi proporsi gabungan (*pooled proportion*).

## 2. Kalkulasi Ukuran Sampel Minimum (Evan Miller Formula)
Agar pengujian memiliki kekuatan statistik (*Statistical Power* $1 - \\beta$) untuk mendeteksi *Minimum Detectable Effect* (MDE $\\delta = p_B - p_A$):

$$n = \\frac{2 \\left( Z_{1 - \\alpha/2} + Z_{1 - \\beta} \\right)^2 \\cdot \\bar{p}(1 - \\bar{p})}{\\delta^2}$$

Untuk standar industri (Tingkat signifikansi $\\alpha = 0.05 \\implies Z_{0.975} = 1.96$; Kekuatan uji $1 - \\beta = 0.80 \\implies Z_{0.80} = 0.84$).
`,
        },
      ],
    },
    {
      id: "da-bab-6",
      slug: "analisis-kohort-dan-segmentasi-rfm",
      title: "BAB 6: Analisis Perilaku Bisnis: Kohort & RFM",
      orderIndex: 6,
      description: "Metrik retensi pengguna berbasis waktu: matriks retensi kohort, perhitungan churn rate, Customer Lifetime Value (CLV), dan segmentasi perilaku pelanggan menggunakan skor Recency, Frequency, Monetary (RFM).",
      subchapters: [
        {
          id: "da-bab-6-1",
          slug: "matriks-retensi-dan-segmentasi-rfm",
          title: "6.1. Matriks Retensi Kohort & Model Segmentasi RFM",
          orderIndex: 1,
          description: "Konstruksi tabel kohort berbasis tanggal pendaftaran pengguna, kurva pembusukan retensi (*decay retention*), dan kalkulasi kuantil skor RFM (1-5).",
          content_markdown: `# 6.1. Matriks Retensi Kohort & Model Segmentasi RFM

## 1. Analisis Kohort Berbasis Waktu
Kohort mengelompokkan pelanggan berdasarkan periode terjadinya peristiwa penting pertama (misal: bulan transaksi perdana). Rasio retensi pada bulan ke-$k$ ($R_k$) dihitung sebagai:

$$R_k = \\frac{\\text{Jumlah Pengguna Aktif pada Bulan } t_0 + k}{\\text{Total Pengguna dalam Kohort Periode } t_0} \\times 100\\%$$

Matriks kohort divisualisasikan dalam bentuk tabel segitiga miring untuk mendeteksi apakah perbaikan produk meningkatkan retensi pengguna baru.

## 2. Segmentasi Pelanggan RFM
RFM adalah metode kuantitatif yang mengelompokkan pelanggan ke dalam kuantil berdasarkan tiga parameter transaksi:
1. **Recency ($R$)**: Berapa hari yang lalu pelanggan melakukan transaksi terakhir? (Nilai kecil $\\implies$ Skor tinggi).
2. **Frequency ($F$)**: Berapa kali pelanggan bertransaksi dalam jendela waktu observasi?
3. **Monetary ($M$)**: Berapa total nilai nominal uang yang dibelanjakan pelanggan?

Setiap pelanggan diberi skor kuantil $1$ sampai $5$. Pelanggan dengan skor \`555\` diklasifikasikan sebagai **Champions / Whales**, sedangkan skor \`111\` adalah **Lost Customers**.
`,
        },
      ],
    },
    {
      id: "da-bab-7",
      slug: "visualisasi-dan-desain-dashboard",
      title: "BAB 7: Komunikasi Data, Grafika Tufte & Desain Dashboard",
      orderIndex: 7,
      description: "Prinsip komunikasi visual berbasis kognisi manusia: Data-Ink Ratio Edward Tufte, hukum Gestalt dalam persepsi pola, pemilihan bagan grafis tepat sasaran, dan tata letak dashboard analitik eksekutif.",
      subchapters: [
        {
          id: "da-bab-7-1",
          slug: "data-ink-ratio-dan-persepsi-visual",
          title: "7.1. Prinsip Edward Tufte (Data-Ink Ratio) & Teori Gestalt",
          orderIndex: 1,
          description: "Menghilangkan 'chartjunk', memaksimalkan rasio tinta data, dan menerapkan prinsip Gestalt (Proximity, Similarity, Continuity, Enclosure) dalam antarmuka laporan.",
          content_markdown: `# 7.1. Prinsip Edward Tufte (Data-Ink Ratio) & Teori Gestalt

## 1. Teori Data-Ink Ratio Edward Tufte (2001)
Edward Tufte mendefinisikan prinsip dasar grafika statistik yang efektif:

$$\\text{Data-Ink Ratio} = \\frac{\\text{Data-Ink}}{\\text{Total Ink Used to Print the Graphic}} = 1.0 - \\text{Proportion of Chartjunk}$$

Di mana:
- **Data-Ink**: Tinta/piksel yang tidak dapat dihapus tanpa menghilangkan informasi inti data (garis tren, titik scatter, label angka esensial).
- **Chartjunk**: Elemen dekoratif yang mengacaukan pemrosesan visual (gridline terlalu tebal, efek bayangan 3D palsu, latar belakang warna-warni yang mengalihkan perhatian).

## 2. Prinsip Gestalt dalam Desain Informasi
1. **Proximity**: Elemen yang berjarak dekat dipersepsikan sebagai satu kelompok terkait.
2. **Similarity**: Elemen dengan warna, ukuran, atau bentuk yang identik dianggap memiliki arti kategori yang sama.
3. **Enclosure**: Menempatkan elemen di dalam kotak berlatar abu-abu tipis secara instan memisahkan konteks metrik.
`,
        },
      ],
    },
    {
      id: "da-bab-8",
      slug: "proyek-analisis-churn-pelanggan-end-to-end",
      title: "BAB 8: Proyek Terapan: Analisis Churn Telekomunikasi End-to-End",
      orderIndex: 8,
      description: "Mengeksekusi proyek analitik komprehensif pada dataset riil: pembersihan data mentah, eksplorasi korelasi multivariat, kueri SQL analitik, pengujian signifikansi churn, dan formulasi rekomendasi bisnis.",
      subchapters: [
        {
          id: "da-bab-8-1",
          slug: "proyek-akhir-analisis-telco-churn",
          title: "8.1. Proyek Akhir: Penyelidikan Faktor Churn Pelanggan & Rekomendasi",
          orderIndex: 1,
          description: "Studi kasus industri: Analisis 7.043 data pelanggan telekomunikasi, uji hipotesis efek kontrak jangka panjang terhadap retensi, dan laporan eksekutif.",
          content_markdown: `# 8.1. Proyek Akhir: Penyelidikan Faktor Churn Pelanggan & Rekomendasi

## 1. Latar Belakang Masalah Bisnis
Perusahaan telekomunikasi global mengalami peningkatan *Churn Rate* pelanggan hingga 26.5% dalam kuartal terakhir. Tim kepemimpinan memerlukan diagnosis berbasis bukti data mengenai faktor apa saja yang mendorong pelanggan berhenti berlangganan, serta rekomendasi kebijakan retensi yang dapat diukur.

## 2. Kode Implementasi Analisis Python Terverifikasi
\`\`\`python
import pandas as pd
import numpy as np
from scipy import stats

# 1. Pembuatan Mock Dataset Representatif (Telco Churn Benchmark)
np.random.seed(42)
n_samples = 1000

tenure = np.random.exponential(scale=24, size=n_samples).astype(int) + 1
monthly_charges = np.random.uniform(20.0, 115.0, size=n_samples)
contract_type = np.random.choice(["Month-to-month", "One year", "Two year"], size=n_samples, p=[0.55, 0.25, 0.20])

# Peluang churn dipengaruhi oleh contract type dan monthly charges
churn_prob = np.where(contract_type == "Month-to-month", 0.40, 0.08)
churn_prob += np.where(monthly_charges > 70.0, 0.10, -0.05)
churn_prob = np.clip(churn_prob, 0.02, 0.95)
churn = (np.random.rand(n_samples) < churn_prob).astype(int)

telco_df = pd.DataFrame({
    "customer_id": [f"CUST_{i:04d}" for i in range(1, n_samples + 1)],
    "tenure_months": tenure,
    "contract": contract_type,
    "monthly_charges": np.round(monthly_charges, 2),
    "churn": churn
})

# 2. Analisis Agregat Tingkat Churn per Jenis Kontrak
contract_analysis = (
    telco_df
    .groupby("contract")
    .agg(
        total_customers=("customer_id", "count"),
        churned_customers=("churn", "sum"),
        churn_rate=("churn", "mean"),
        avg_monthly_charges=("monthly_charges", "mean"),
        avg_tenure=("tenure_months", "mean")
    )
    .reset_index()
)
contract_analysis["churn_rate_pct"] = np.round(contract_analysis["churn_rate"] * 100, 2)

print("=== 1. ANALISIS KONTRAK TERHADAP CHURN ===")
print(contract_analysis[["contract", "total_customers", "churn_rate_pct", "avg_monthly_charges", "avg_tenure"]].to_string(index=False))

# 3. Uji Hipotesis Statistika Inferensial (Chi-Square Test of Independence)
# H0: Tidak ada hubungan antara jenis kontrak dan keputusan churn
contingency_table = pd.crosstab(telco_df["contract"], telco_df["churn"])
chi2_stat, p_val, dof, expected = stats.chi2_contingency(contingency_table)

print("\\n=== 2. UJI SIGNIFIKANSI STATISTIK (CHI-SQUARE) ===")
print(f"Statistik Chi-Square : {chi2_stat:.4f}")
print(f"Degrees of Freedom   : {dof}")
print(f"P-Value              : {p_val:.4e}")

if p_val < 0.001:
    print("Keputusan: Tolak H0 pada tingkat signifikansi alpha = 0.001. Hubungan antara jenis kontrak dan churn sangat signifikan secara statistik.")

# 4. Rekomendasi Kebijakan Bisnis
print("\\n=== 3. REKOMENDASI STRATEGIS BISNIS ===")
print("1. Migrasi Pelanggan Month-to-Month: Berikan insentif diskon 15% untuk pelanggan bulanan yang bersedia berpindah ke kontrak 1 tahun.")
print("2. Early Warning System: Lakukan intervensi proaktif pada pelanggan dengan biaya bulanan > $70 yang mendekati masa habis kontrak.")
\`\`\`

## 3. Rubrik Penilaian Proyek
- **Kualitas Kueri & Wrangling Data (25%)**: Ketepatan penanganan tipe data dan efisiensi vektorisasi.
- **Rancangan Eksperimen & Uji Statistik (35%)**: Formulasi hipotesis yang benar, pemilihan uji inferensial yang valid, dan interpretasi $p$-value yang tepat.
- **Kejelasan Komunikasi Visual & Narasi (25%)**: Penyajian tabel ringkas tanpa elemen dekoratif berlebih.
- **Rekomendasi Preskriptif Bisnis (15%)**: Saran tindakan yang realistis dan memiliki dampak ekonomi langsung.
`,
        },
      ],
    },
  ],
};
