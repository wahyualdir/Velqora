import { ChapterDef } from "./da-data-ch1-3";

export const CHAPTERS_4_TO_6: ChapterDef[] = [
  // ==========================================
  // BAB 4: Analisis Data Eksploratori (EDA) Berbasis Python & Pandas
  // ==========================================
  {
    orderIndex: 4,
    id: "data-analyst-ch-4",
    slug: "bab-4-analisis-data-eksploratori-eda-berbasis-python-pandas",
    title: "BAB 4: Analisis Data Eksploratori (EDA) Berbasis Python & Pandas",
    desc: "Metodologi eksplorasi data komprehensif: inspeksi univariat, bivariat, dan multivariat, manipulasi tingkat lanjut dengan Pandas (loc, iloc, MultiIndex), operasi reshaping, agregasi GroupBy kompleks, penggabungan relasional, dan analisis deret waktu.",
    coreConcepts: ["Exploratory Data Analysis", "Pandas Advanced Indexing", "Reshaping & Pivot", "Time Series Analysis", "Vectorized Performance"],
    subchapters: [
      {
        num: "4.1",
        slug: "4-1-anatomi-dataframe-indexing-lanjut-loc-iloc-multiindex",
        title: "4.1. Anatomi DataFrame & Indexing Lanjut (loc, iloc, MultiIndex)",
        desc: "Struktur internal DataFrame dua dimensi, pemilihan berbasis label (loc) vs posisi integer (iloc), Boolean indexing multi-kondisi, serta hierarki MultiIndex.",
        concept: `Pandas DataFrame merupakan struktur data tabular dua dimensi berukuran dapat berubah (size-mutable) dan heterogen dengan sumbu berlabel (baris dan kolom). Memahami anatomi internal DataFrame—terdiri dari data array NumPy di balik layar, Index baris, dan Index kolom—sangat penting untuk melakukan kueri data berkecepatan tinggi tanpa overhead salinan memori yang tidak perlu.

Dua metode seleksi utama dalam Pandas adalah .loc[] yang beroperasi berdasarkan label indeks atau kondisi Boolean, dan .iloc[] yang beroperasi murni berdasarkan offset posisi integer (0 hingga N-1). Kesalahan fatal pemula adalah menggunakan chaining indexing seperti df['kolom'][0] yang memicu SettingWithCopyWarning dan memperlambat komputasi.

MultiIndex (Hierarchical Indexing) memungkinkan representasi data dengan dimensi lebih tinggi dalam struktur dua dimensi. Dengan MultiIndex, analis dapat menyusun data berdasarkan multi-level kategori (misalnya Regional -> Cabang -> Departemen) dan melakukan agregasi parsial secara efisien melalui irisan label tuple.`,
        code: `# 4.1: Penguasaan Seleksi Label, Posisi Integer, dan Hirarki MultiIndex
import pandas as pd
import numpy as np

# Membuat dataset operasional penjualan regional
raw_data = {
    ('Jawa_Barat', 'Bandung'): [120, 150, 180],
    ('Jawa_Barat', 'Bekasi'): [200, 210, 240],
    ('Jawa_Timur', 'Surabaya'): [310, 330, 350],
    ('Jawa_Timur', 'Malang'): [90, 110, 130]
}
idx = pd.Index(['Q1', 'Q2', 'Q3'], name='Kuartal')
df_multi = pd.DataFrame(raw_data, index=idx)
df_multi.columns.names = ['Provinsi', 'Kota']

# Seleksi menggunakan MultiIndex slice
jawa_barat = df_multi.loc[:, 'Jawa_Barat']
bandung_q2 = df_multi.loc['Q2', ('Jawa_Barat', 'Bandung')]

print("=== DATAFRAME DENGAN MULTIINDEX KOLOM ===")
print(df_multi)
print(f"\\nPenjualan Bandung Q2: {bandung_q2} unit")
print("\\nSub-Tabel Wilayah Jawa Barat:")
print(jawa_barat)`,
        expectedOutput: "DataFrame MultiIndex terindeks dan terpotong secara akurat.",
        codeExp: "Skrip mendemonstrasikan pembentukan DataFrame dengan kolom bertingkat (MultiIndex) dua level: Provinsi dan Kota. Seleksi label spesifik dilakukan menggunakan tupel ('Jawa_Barat', 'Bandung') melalui pengindeksan .loc[] yang aman tanpa memicu peringatan salinan data.",
        pitfalls: [
          "Melakukan 'chained indexing' df[a][b] alih-alih df.loc[b, a] yang memicu SettingWithCopyWarning.",
          "Menyamakan .iloc[] dengan .loc[] ketika indeks numerik DataFrame tidak berurutan atau berupa indeks tanggal."
        ],
        refTitle: "pandas Documentation: Indexing and selecting data",
        refUrl: "https://pandas.pydata.org/docs/user_guide/indexing.html"
      },
      {
        num: "4.2",
        slug: "4-2-profiling-distribusi-univariat-skewness-transform",
        title: "4.2. Profiling Distribusi Univariat & Skewness Transform",
        desc: "Pemeriksaan karakteristik variabel tunggal: ukuran pemusatan, penyebaran, derajat kemiringan (skewness), kurtosis, serta teknik transformasi log dan Box-Cox.",
        concept: `Profiling univariat merupakan tahap awal EDA di mana analis mengamati karakteristik masing-masing variabel secara independen tanpa mempertimbangkan interaksi dengan variabel lain. Analisis univariat bertujuan untuk memetakan jenis skala pengukuran (nominal, ordinal, interval, rasio) serta memeriksa bentuk sebaran probabilitas empiris data.

Metrik kritis dalam analisis univariat adalah Skewness (kemiringan) dan Kurtosis (kelancipan). Skewness positif (right-skewed) umum ditemukan pada data finansial dan perilaku seperti pendapatan pengguna, nilai transaksi e-commerce, atau durasi sesi web, di mana sebagian besar populasi berada pada nilai kecil namun terdapat ekor panjang ke kanan.

Ketika data memiliki kemiringan tinggi (skewness > 1.0), banyak algoritma statistik dan model linier kehilangan daya diskriminasi karena deviasi kuadrat didominasi oleh nilai ekstrem. Transformasi matematis seperti Logaritma Natural (log1p) atau Transformasi Box-Cox/Yeo-Johnson diterapkan untuk menstabilkan varians dan mendekatkan sebaran ke kurva normal Gauss.`,
        formula: `y^{(\\lambda)} = \\begin{cases} \\frac{y^\\lambda - 1}{\\lambda} & \\text{if } \\lambda \\neq 0 \\\\ \\ln(y) & \\text{if } \\lambda = 0 \\end{cases}`,
        code: `# 4.2: Pemeriksaan Skewness dan Transformasi Logaritmik Data Transaksi
import pandas as pd
import numpy as np

# Mensimulasikan data nilai pesanan dengan kemiringan positif tajam (Right-Skewed)
np.random.seed(42)
nilai_pesanan = np.random.exponential(scale=250000, size=1000) + 15000
df_skew = pd.DataFrame({'Nilai_Transaksi': nilai_pesanan})

# Menghitung skewness sebelum transformasi
skew_awal = df_skew['Nilai_Transaksi'].skew()

# Menerapkan transformasi logaritma natural (log1p untuk menangani nilai kecil)
df_skew['Log_Nilai_Transaksi'] = np.log1p(df_skew['Nilai_Transaksi'])
skew_akhir = df_skew['Log_Nilai_Transaksi'].skew()

print("=== ANALISIS DISTRIBUSI & TRANSFORMASI SKEWNESS ===")
print(f"Skewness Awal (Data Mentah)   : {skew_awal:.4f} (Kemiringan Tajam ke Kanan)")
print(f"Skewness Akhir (Setelah Log)   : {skew_akhir:.4f} (Mendekati Distribusi Normal Simetris)")
print("\\nRingkasan Statistik Setelah Transformasi:")
print(df_skew.describe().round(2))`,
        expectedOutput: "Skewness awal > 1.8 berkurang drastis menjadi mendekati 0 setelah transformasi log1p.",
        codeExp: "Skrip mengukur skewness data nilai transaksi awal yang berdistribusi eksponensial. Penerapan fungsi np.log1p() mengompres rentang ekor panjang ke kanan sehingga nilai skewness turun drastis, memungkinkan data digunakan secara valid untuk uji parametrik.",
        pitfalls: [
          "Menerapkan np.log() murni pada kolom yang memuat nilai nol (0), menghasilkan nilai -infinity; selalu gunakan np.log1p(x) = ln(1 + x).",
          "Lupa melakukan kebalikan transformasi (np.expm1) saat menginterpretasikan hasil prediksi kembali ke satuan mata uang rupiah."
        ],
        refTitle: "SciPy Reference Guide: scipy.stats.skew & boxcox",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.skew.html"
      },
      {
        num: "4.3",
        slug: "4-3-analisis-bivariat-multivariat-matriks-kovarians-korelasi",
        title: "4.3. Analisis Bivariat & Multivariat: Matriks Kovarians & Korelasi",
        desc: "Eksplorasi hubungan antar dua atau lebih variabel: koefisien Pearson, koefisien peringkat Spearman, matriks korelasi, dan peringatan kolinearitas.",
        concept: `Analisis bivariat dan multivariat mengkaji hubungan kovariasi antar sepasang atau sekelompok variabel untuk mendeteksi dependensi, pola linear, atau indikasi redundansi informasi. Analisis ini menjadi dasar pemilihan variabel penjelas dalam pemodelan prediktif bisnis.

Koefisien Korelasi Pearson ($r$) mengukur kekuatan dan arah hubungan linear antara dua variabel berdistribusi normal kontinu. Nilai $r$ berkisar antara -1 (korelasi negatif sempurna) hingga +1 (korelasi positif sempurna). Namun, Pearson sangat sensitif terhadap pencilan dan tidak mampu menangkap hubungan monotonik non-linear.

Untuk variabel ordinal atau kontinu berdistribusi menceng (skewed), Korelasi Peringkat Spearman ($\\rho$) merupakan alternatif non-parametrik yang jauh lebih andal karena menghitung korelasi berdasarkan urutan peringkat data. Matriks korelasi yang dihasilkan membantu analis mendeteksi masalah multikolinearitas ($r > 0.85$), di mana dua fitur mengukur aspek yang identik.`,
        formula: `r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}`,
        code: `# 4.3: Perhitungan Matriks Korelasi Pearson vs Spearman
import pandas as pd
import numpy as np

np.random.seed(42)
n = 100
pengeluaran_iklan = np.random.uniform(5, 50, n)
# Penjualan memiliki korelasi linear + noise
penjualan = pengeluaran_iklan * 3.5 + np.random.normal(0, 15, n)
# Diskon memiliki hubungan non-linear eksponensial terhadap kepuasan
kepuasan = 100 - np.exp(pengeluaran_iklan / 15)

df_corr = pd.DataFrame({
    'Biaya_Iklan_Juta': pengeluaran_iklan,
    'Penjualan_Juta': penjualan,
    'Skor_Kepuasan': kepuasan
})

corr_pearson = df_corr.corr(method='pearson')
corr_spearman = df_corr.corr(method='spearman')

print("=== MATRIKS KORELASI PEARSON ===")
print(corr_pearson.round(3))
print("\\n=== MATRIKS KORELASI SPEARMAN (RANK) ===")
print(corr_spearman.round(3))`,
        expectedOutput: "Matriks korelasi Pearson dan Spearman terhitung dengan presisi 3 desimal.",
        codeExp: "Skrip menghitung matriks korelasi antar fitur menggunakan metode Pearson untuk hubungan linier dan Spearman untuk hubungan non-linear monotonik, memberikan gambaran komparatif dependensi antar variabel bisnis.",
        pitfalls: [
          "Menyimpulkan adanya hubungan kausalitas (sebab-akibat) semata-mata dari nilai korelasi statistik yang tinggi (Correlation does not imply Causation).",
          "Hanya mengandalkan Pearson untuk data yang memiliki outlier ekstrem atau hubungan lengkung kurvilinear."
        ],
        refTitle: "pandas Documentation: DataFrame.corr",
        refUrl: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.corr.html"
      },
      {
        num: "4.4",
        slug: "4-4-pemotongan-pengelompokan-data-groupby-agregasi-jamak",
        title: "4.4. Pemotongan & Pengelompokan Data dengan GroupBy & Agregasi Jamak",
        desc: "Paradigma split-apply-combine: agregasi hierarkis, penggunaan fungsi agregat bawaan dan kustom via agg(), filter segmen via filter(), dan transformasi broadcast via transform().",
        concept: `Operasi GroupBy dalam Pandas mengimplementasikan paradigma 'Split-Apply-Combine' yang diperkenalkan oleh Hadley Wickham. Pada tahap pertama (Split), data dipecah menjadi kelompok-kelompok terisolasi berdasarkan nilai unik dari satu atau beberapa kolom kunci. Pada tahap kedua (Apply), fungsi matematika dijalankan secara independen pada setiap kelompok. Pada tahap ketiga (Combine), hasil kalkulasi disatukan kembali ke dalam struktur DataFrame.

Kemampuan paling fleksibel dari GroupBy adalah fungsi .agg() yang memungkinkan penerapan multi-fungsi berbeda pada kolom yang berbeda dalam satu kali eksekusi kueri, meminimalkan traversal memori ganda.

Selain agregasi reduktif, Pandas menyediakan metode .transform() yang mengembalikan Series dengan dimensi sama persis dengan DataFrame asli. Ini memungkinkan komputasi metrik relatif, seperti menghitung persentase kontribusi penjualan seorang staf terhadap total penjualan cabangnya secara instan.`,
        code: `# 4.4: Split-Apply-Combine dengan Agregasi Jamak dan Transform
import pandas as pd

transaksi = pd.DataFrame({
    'Cabang': ['Jakarta', 'Jakarta', 'Surabaya', 'Surabaya', 'Bandung', 'Bandung', 'Jakarta'],
    'Kategori': ['Elektronik', 'Fashion', 'Elektronik', 'Elektronik', 'Fashion', 'Fashion', 'Elektronik'],
    'Pendapatan': [15000000, 3500000, 12000000, 8000000, 4500000, 6000000, 22000000],
    'Jumlah_Item': [3, 5, 2, 2, 7, 8, 4]
})

# 1. Agregasi jamak dengan penamaan kolom eksplisit
ringkasan_cabang = transaksi.groupby('Cabang').agg(
    Total_Omzet=('Pendapatan', 'sum'),
    Rata_Item_Per_Trx=('Jumlah_Item', 'mean'),
    Jumlah_Transaksi=('Pendapatan', 'count')
).reset_index()

# 2. Transform: Menghitung persentase kontribusi transaksi terhadap cabang masing-masing
transaksi['Total_Cabang'] = transaksi.groupby('Cabang')['Pendapatan'].transform('sum')
transaksi['Kontribusi_Cabang_Pct'] = (transaksi['Pendapatan'] / transaksi['Total_Cabang'] * 100).round(2)

print("=== RINGKASAN KINERJA PER CABANG ===")
print(ringkasan_cabang)
print("\\n=== TRANSAKSI DENGAN METRIK TRANSFORM KONTRIBUSI ===")
print(transaksi[['Cabang', 'Kategori', 'Pendapatan', 'Kontribusi_Cabang_Pct']])`,
        expectedOutput: "Ringkasan GroupBy multi-fungsi dan kolom kontribusi cabang berhasil dihitung.",
        codeExp: "Skrip mendemonstrasikan dua pola GroupBy utama: agregasi reduktif menggunakan nama kolom tupel pada .agg() untuk pelaporan cabang, dan ekspansi dimensi menggunakan .transform() untuk menghitung pangsa kontribusi tiap tiket transaksi terhadap total cabangnya.",
        pitfalls: [
          "Lupa memanggil .reset_index() setelah groupby, menyebabkan kolom grouping terkunci sebagai Index dan menyulitkan operasi merge berikutnya.",
          "Menjalankan perulangan Python 'for group, df in df.groupby()' untuk kalkulasi sederhana alih-alih memanfaatkan fungsi vektorisasi bawaan Pandas."
        ],
        refTitle: "pandas Documentation: Group by: split-apply-combine",
        refUrl: "https://pandas.pydata.org/docs/user_guide/groupby.html"
      },
      {
        num: "4.5",
        slug: "4-5-operasi-reshaping-pivot-table-melt-stack-unstack",
        title: "4.5. Operasi Reshaping: Pivot Table, Melt, Stack & Unstack",
        desc: "Transformasi struktur tabular antara format lebar (wide format) dan format panjang (long/tidy format) menggunakan pivot, pivot_table, melt, serta manajemen sumbu hierarkis.",
        concept: `Reshaping adalah proses mereorganisasi susunan baris dan kolom dalam DataFrame tanpa mengubah nilai data dasarnya. Kebutuhan reshaping timbul karena format data yang optimal untuk visualisasi dan pemodelan statistik (Format Panjang / Long Tidy Format) seringkali berbeda dengan format yang diinginkan eksekutif dalam spreadsheet ringkasan (Format Lebar / Wide Format).

Dalam format Tidy Data, setiap variabel membentuk kolom, setiap observasi membentuk baris, dan setiap unit pengamatan membentuk tabel. Fungsi pd.melt() digunakan untuk mendekomposisi tabel lebar menjadi format panjang dengan mengonversi nama kolom menjadi nilai baris.

Sebaliknya, DataFrame.pivot_table() digunakan untuk mengagregasi dan memutar data dari format panjang ke format lebar matriks dua dimensi dengan baris dan kolom kategorikal serta nilai agregat (seperti SUM atau MEAN) di sel perpotongannya, lengkap dengan kalkulasi total marjinal (margins=True).`,
        code: `# 4.5: Reshaping Data: Pivot Table Agregat dan Un-pivoting dengan Melt
import pandas as pd

# Data penjualan bulanan format panjang (Tidy Format)
df_penjualan = pd.DataFrame({
    'Bulan': ['Jan', 'Jan', 'Feb', 'Feb', 'Mar', 'Mar'],
    'Wilayah': ['Barat', 'Timur', 'Barat', 'Timur', 'Barat', 'Timur'],
    'Omzet_Juta': [120, 85, 140, 95, 160, 110]
})

# 1. Transformasi ke format lebar dengan Pivot Table
tabel_lebar = df_penjualan.pivot_table(
    index='Wilayah',
    columns='Bulan',
    values='Omzet_Juta',
    aggfunc='sum',
    margins=True,
    margins_name='Total'
)

# 2. Re-transformasi format lebar kembali ke format panjang menggunakan pd.melt
df_unpivoted = pd.melt(
    tabel_lebar.drop('Total').drop('Total', axis=1).reset_index(),
    id_vars=['Wilayah'],
    value_vars=['Jan', 'Feb', 'Mar'],
    var_name='Bulan_Periode',
    value_name='Omzet_Tercatat'
)

print("=== TABEL LEBAR (PIVOT TABLE DENGAN MARGINS) ===")
print(tabel_lebar)
print("\\n=== HASIL UN-PIVOT DENGAN PD.MELT ===")
print(df_unpivoted)`,
        expectedOutput: "Tabel matriks wilayah vs bulan terbentuk dan berhasil di-melt kembali ke bentuk tidy.",
        codeExp: "Skrip melakukan transformasi bolak-balik: pertama memadatkan data transaksi menjadi matriks silang wilayah x bulan dengan pivot_table(), kemudian membongkar kembali matriks tersebut menjadi format tidy menggunakan pd.melt().",
        pitfalls: [
          "Menggunakan df.pivot() alih-alih df.pivot_table() ketika data memiliki duplikat kombinasi indeks dan kolom, yang menyebabkan ValueError: Index contains duplicate entries.",
          "Kehilangan tipe data tanggal ketika kolom bulan di-melt menjadi string generik tanpa parsing tipe data."
        ],
        refTitle: "pandas Documentation: Reshaping and pivot tables",
        refUrl: "https://pandas.pydata.org/docs/user_guide/reshaping.html"
      },
      {
        num: "4.6",
        slug: "4-6-penggabungan-data-merge-join-concat-validasi-kunci",
        title: "4.6. Penggabungan Data: Merge, Join, Concat & Validasi Integritas Kunci",
        desc: "Teknik penggabungan data relasional: inner, outer, left, dan right merge, penanganan ketidaksesuaian kunci, validasi hubungan kardinalitas (1:1, 1:m, m:m), dan concatanation.",
        concept: `Dalam dunia nyata, data jarang tersimpan dalam satu berkas terpadu. Data operasional tersimpan dalam beberapa tabel basis data relasional yang terpisah untuk menjaga normalisasi. Analis data harus mampu menggabungkan tabel-tabel ini menggunakan pd.merge() dan pd.concat() dengan memahami implikasi matematis teori himpunan relasional.

Operasi merge mendukung empat mode utama: Inner Join (hanya mempertahankan irisan kunci yang cocok), Left Outer Join (mempertahankan semua baris tabel kiri dan mengisi NaN jika tabel kanan tidak memiliki pasangan), Right Outer Join, dan Full Outer Join. Parameter indicator=True sangat berguna untuk mengaudit asal baris hasil penggabungan (_merge).

Bahaya terbesar dalam penggabungan data adalah 'Cartesian Explosion' atau perkalian baris tidak disengaja akibat relasi many-to-many pada kolom kunci yang tidak unik. Pandas menyediakan parameter validate=('1:1', '1:m', 'm:1', 'm:m') pada fungsi merge untuk menjamin integritas relasi secara otomatis sebelum operasi komputasi dilakukan.`,
        code: `# 4.6: Relational Merge dengan Indikator Audit dan Validasi Kardinalitas
import pandas as pd

# Tabel Pelanggan (Dimensi)
pelanggan = pd.DataFrame({
    'cust_id': ['C001', 'C002', 'C003', 'C004'],
    'nama': ['Ahmad', 'Budi', 'Citra', 'Dewi'],
    'segmen': ['Retail', 'Corporate', 'Retail', 'SME']
})

# Tabel Transaksi (Fakta)
pesanan = pd.DataFrame({
    'order_id': ['TRX-101', 'TRX-102', 'TRX-103', 'TRX-104'],
    'cust_id': ['C001', 'C002', 'C001', 'C005'], # C005 tidak ada di tabel pelanggan
    'nominal': [450000, 1200000, 300000, 850000]
})

# Left merge dengan audit indicator dan validasi hubungan 1-to-many
df_gabung = pd.merge(
    pesanan,
    pelanggan,
    on='cust_id',
    how='left',
    indicator=True,
    validate='m:1' # Setiap pesanan merujuk ke maksimal 1 pelanggan
)

print("=== HASIL LEFT MERGE DENGAN STATUS INDIKATOR AUDIT ===")
print(df_gabung[['order_id', 'cust_id', 'nama', 'nominal', '_merge']])
print("\\nDistribusi Status Kecocokan Data:")
print(df_gabung['_merge'].value_counts())`,
        expectedOutput: "Left merge berhasil dilakukan dengan baris C005 terdeteksi berstatus left_only.",
        codeExp: "Skrip menunjukkan penggabungan tabel transaksi dan pelanggan dengan parameter validate='m:1' untuk memastikan tidak ada duplikasi data pelanggan induk, serta memanfaatkan indicator=True untuk menemukan data transaksi yang merujuk ke ID pelanggan yang tidak terdaftar.",
        pitfalls: [
          "Melakukan merge tanpa memvalidasi keunikan kunci gabungan, yang dapat menggandakan nominal pendapatan akibat duplikasi baris tabel referensi.",
          "Perbedaan tipe data kolom kunci (misalnya string '012' vs integer 12) yang menghasilkan DataFrame kosong tanpa pesan galat eksplisit."
        ],
        refTitle: "pandas Documentation: Merge, join, concatenate and compare",
        refUrl: "https://pandas.pydata.org/docs/user_guide/merging.html"
      },
      {
        num: "4.7",
        slug: "4-7-analisis-deret-waktu-time-series-resampling-rolling-lagging",
        title: "4.7. Analisis Deret Waktu (Time Series): Resampling, Rolling Window & Lagging",
        desc: "Manipulasi data temporal: parsing datetime, pemindahan periode (shift/lag), agregasi frekuensi kalender (resample), kalkulasi jendela berjalan (rolling window), dan deteksi tren.",
        concept: `Sebagian besar data bisnis (transaksi harian, log server web, pergerakan inventaris, detak sensor IoT) adalah data deret waktu (Time Series). Pandas dikembangkan awalnya oleh AQR Capital Management khusus untuk analisis deret waktu keuangan, sehingga memiliki kemampuan penanganan datetime tingkat pertama.

Operasi temporal fundamental melibatkan konversi kolom tanggal menjadi DatetimeIndex. Setelah diindeks berdasarkan waktu, data dapat di-resample ke berbagai tingkat frekuensi (misalnya dari data transaksi per detik menjadi ringkasan harian 'D' atau bulanan 'ME') menggunakan fungsi .resample().

Untuk menganalisis tren dasar dan menghilangkan fluktuasi deret waktu yang bersifat musiman atau berderau tinggi, analis menggunakan statistik jendela bergerak (.rolling()). Selain itu, operasi lag melalui .shift() memungkinkan perhitungan pertumbuhan dari periode ke periode (Month-over-Month / MoM) secara tervektorisasi.`,
        formula: `\\text{MoM Growth} = \\frac{Y_t - Y_{t-1}}{Y_{t-1}} \\times 100\\%`,
        code: `# 4.7: Resampling Deret Waktu, 7-Day Moving Average, dan Analisis Pertumbuhan MoM
import pandas as pd
import numpy as np

# Membuat data transaksi harian selama 90 hari
tanggal = pd.date_range(start='2026-01-01', periods=90, freq='D')
np.random.seed(42)
omzet_harian = np.random.normal(50000000, 8000000, 90).clip(min=20000000)

df_ts = pd.DataFrame({'Tanggal': tanggal, 'Omzet': omzet_harian}).set_index('Tanggal')

# 1. Menghitung 7-Day Moving Average untuk memuluskan derau harian
df_ts['MA_7D'] = df_ts['Omzet'].rolling(window=7, min_periods=1).mean()

# 2. Resampling ke tingkat bulanan dan kalkulasi pertumbuhan MoM
df_bulanan = df_ts[['Omzet']].resample('ME').sum()
df_bulanan['Omzet_Bulan_Lalu'] = df_bulanan['Omzet'].shift(1)
df_bulanan['MoM_Growth_Pct'] = (
    (df_bulanan['Omzet'] - df_bulanan['Omzet_Bulan_Lalu']) / df_bulanan['Omzet_Bulan_Lalu'] * 100
).round(2)

print("=== RINGKASAN AGREGASI BULANAN & PERTUMBUHAN MOM ===")
print(df_bulanan)
print("\\n5 Hari Pertama Data Harian dengan 7-Day Moving Average:")
print(df_ts.head().round(0))`,
        expectedOutput: "Data harian teragregasi bulanan dengan persentase pertumbuhan MoM terhitung.",
        codeExp: "Skrip mengonversi data deret waktu harian, menerapkan rolling window 7 hari untuk memuluskan volatilitas acak harian, dan melakukan downsampling frekuensi bulanan dengan kalkulasi pertumbuhan berbasis shift() lagging.",
        pitfalls: [
          "Lupa mengurutkan indeks tanggal secara kronologis (df.sort_index()) sebelum melakukan operasi rolling atau shift, menyebabkan hasil kalkulasi salah total.",
          "Menggunakan string format tanggal ambigu seperti '01/02/2026' tanpa mendefinisikan format eksplisit di pd.to_datetime(), yang memicu kebingungan antara tanggal 1 Februari atau 2 Januari."
        ],
        refTitle: "pandas Documentation: Time series / date functionality",
        refUrl: "https://pandas.pydata.org/docs/user_guide/timeseries.html"
      },
      {
        num: "4.8",
        slug: "4-8-optimasi-performa-pandas-vectorization-chunks-parquet",
        title: "4.8. Optimasi Performa Pandas: Vectorization, Chunks & Parquet I/O",
        desc: "Strategi komputasi efisien untuk dataset besar: eliminasi iterrows dengan vektorisasi NumPy, manajemen tipe data memori (kategori dan downcasting), pemrosesan berkas bertahap (chunking), serta format penyimpanan Parquet berbasis kolom.",
        concept: `Saat volume data meluas melampaui jutaan baris, operasi Pandas yang ditulis buruk dapat menyebabkan kehabisan memori RAM (Out of Memory) dan pembekuan proses komputasi. Mengoptimalkan performa eksekusi kueri Pandas adalah keahlian wajib analis data tingkat lanjut.

Aturan emas kecepatan Pandas adalah menghindari iterasi perulangan baris (.iterrows() atau .itertuples()). Operasi tervektorisasi (vectorized operations) mengeksekusi komputasi pada level bahasa C array kontigu di NumPy, menghasilkan percepatan waktu eksekusi hingga 100 hingga 1.000 kali lebih cepat daripada loop Python standar.

Optimasi penyimpanan memori dicapai dengan mengonversi kolom string berulang menjadi tipe 'category' dan melakukan downcasting integer (misal int64 ke int32/int16). Selain itu, untuk data yang melebihi ukuran memori, pembacaan berkas dilakukan secara bertahap (chunksize). Format file berbasis kolom seperti Apache Parquet dengan kompresi Snappy jauh lebih unggul dibandingkan CSV mentah dalam hal kecepatan baca-tulis dan efisiensi ruang disk.`,
        code: `# 4.8: Optimasi Memori DataFrame dan Perbandingan Format Parquet vs CSV
import pandas as pd
import numpy as np
import tempfile
import os

# Mensimulasikan dataset transaksi 100.000 baris
n = 100000
df_besar = pd.DataFrame({
    'transaksi_id': np.arange(n),
    'kategori': np.random.choice(['Elektronik', 'Pakaian', 'Makanan', 'Kesehatan'], size=n),
    'nilai': np.random.uniform(10000, 5000000, size=n),
    'status': np.random.choice(['Sukses', 'Gagal', 'Pending'], size=n)
})

mem_awal = df_besar.memory_usage(deep=True).sum() / (1024 * 1024)

# Optimasi tipe data: Konversi object string ke category dan downcast numerik
df_besar['kategori'] = df_besar['kategori'].astype('category')
df_besar['status'] = df_besar['status'].astype('category')
df_besar['transaksi_id'] = pd.to_numeric(df_besar['transaksi_id'], downcast='integer')
df_besar['nilai'] = pd.to_numeric(df_besar['nilai'], downcast='float')

mem_akhir = df_besar.memory_usage(deep=True).sum() / (1024 * 1024)
reduksi_pct = ((mem_awal - mem_akhir) / mem_awal) * 100

# Perbandingan performa I/O file CSV vs Parquet
with tempfile.TemporaryDirectory() as tmpdir:
    csv_path = os.path.join(tmpdir, 'data.csv')
    parquet_path = os.path.join(tmpdir, 'data.parquet')
    
    df_besar.to_csv(csv_path, index=False)
    df_besar.to_parquet(parquet_path, engine='pyarrow', compression='snappy')
    
    size_csv = os.path.getsize(csv_path) / (1024 * 1024)
    size_parquet = os.path.getsize(parquet_path) / (1024 * 1024)

print("=== OPTIMASI PENGGUNAAN MEMORI RAM ===")
print(f"Memori Awal    : {mem_awal:.2f} MB")
print(f"Memori Akhir   : {mem_akhir:.2f} MB (Penghematan: {reduksi_pct:.1f}%)")
print("\\n=== PERBANDINGAN UKURAN BERKAS DISK ===")
print(f"Ukuran File CSV     : {size_csv:.2f} MB")
print(f"Ukuran File Parquet : {size_parquet:.2f} MB (Lebih Ringkas: {((size_csv-size_parquet)/size_csv*100):.1f}%)")`,
        expectedOutput: "Memori RAM berkurang > 60% dan ukuran berkas Parquet jauh lebih kecil dari CSV.",
        codeExp: "Skrip mendemonstrasikan teknik downcasting numerik dan konversi tipe data kategori untuk memotong alokasi RAM secara dramatis, serta memvalidasi efisiensi kompresi biner Apache Parquet terhadap CSV tradisional.",
        pitfalls: [
          "Mengonversi kolom string dengan nilai yang hampir seluruhnya unik (seperti UUID atau nama pengguna lengkap) ke tipe category, yang justru akan meningkatkan konsumsi memori akibat overhead kamus kategori.",
          "Membaca berkas CSV berukuran gigabyte sekaligus dengan pd.read_csv() alih-alih menggunakan parameter chunksize."
        ],
        refTitle: "pandas Documentation: Scaling to large datasets & Categorical data",
        refUrl: "https://pandas.pydata.org/docs/user_guide/scale.html"
      },
      {
        num: "4.9",
        slug: "4-9-visualisasi-diagnostik-distribusi-box-plot-kde-pairplot",
        title: "4.9. Visualisasi Diagnostik Distribusi: Box Plot, KDE & Pairplot",
        desc: "Grafik diagnostik eksploratori: pembacaan kuartil Box Plot, estimasi densitas kernel (KDE), histogram berbobot, dan inspeksi interaksi multivariat via Pairplot.",
        concept: `Visualisasi diagnostik dalam EDA bertujuan mendeteksi anomali matematis, pola tersembunyi, dan ketidaksesuaian asumsi sebelum model statistik diterapkan. Membaca tabel angka statistik saja seringkali menyesatkan, sebagaimana diilustrasikan secara terkenal oleh Anscombe's Quartet dan Datasaurus Dozen—kumpulan dataset dengan rata-rata, standar deviasi, dan korelasi identik namun memiliki bentuk visual yang sama sekali berbeda.

Box Plot (Diagram Kotak-Garis) memberikan visualisasi lima serangkai statistik (Minimum, Q1, Median, Q3, Maksimum) serta menampilkan titik-titik pencilan di luar pagar 1.5 * IQR secara eksplisit.

Estimasi Densitas Kernel (Kernel Density Estimation / KDE) menyajikan aproksimasi kurva probabilitas kontinu yang halus dari distribusi data tanpa dipengaruhi oleh pemilihan lebar bin seperti pada histogram standar. Sementara itu, Pairplot (Scatterplot Matrix) memungkinkan pemindaian serentak terhadap seluruh kombinasi pasangan variabel numerik dengan pewarnaan berdasarkan kategori target.`,
        code: `# 4.9: Diagnostik Statistik Univariat dan Multivariat
import pandas as pd
import numpy as np

# Membuat dataset diagnostik multi-metrik pelanggan
np.random.seed(42)
n = 200
usia = np.random.randint(20, 60, n)
skor_aktivitas = np.random.normal(50, 15, n).clip(10, 95)
total_belanja = usia * 150000 + skor_aktivitas * 80000 + np.random.normal(0, 500000, n)
segmen = np.where(skor_aktivitas > 60, 'Aktif', 'Dormant')

df_diag = pd.DataFrame({
    'Usia': usia,
    'Skor_Aktivitas': skor_aktivitas,
    'Total_Belanja': total_belanja,
    'Segmen': segmen
})

# Menghitung parameter Box Plot secara matematis (5-Number Summary)
q1 = df_diag['Total_Belanja'].quantile(0.25)
q2 = df_diag['Total_Belanja'].median()
q3 = df_diag['Total_Belanja'].quantile(0.75)
iqr = q3 - q1
lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr
outliers = df_diag[(df_diag['Total_Belanja'] < lower_bound) | (df_diag['Total_Belanja'] > upper_bound)]

print("=== DIAGNOSTIK 5-NUMBER SUMMARY TOTAL BELANJA ===")
print(f"Kuartil 1 (Q1) : Rp {q1:,.0f}")
print(f"Median (Q2)    : Rp {q2:,.0f}")
print(f"Kuartil 3 (Q3) : Rp {q3:,.0f}")
print(f"Batas Bawah    : Rp {lower_bound:,.0f}")
print(f"Batas Atas     : Rp {upper_bound:,.0f}")
print(f"Jumlah Pencilan: {len(outliers)} observasi")`,
        expectedOutput: "Parameter diagnostik 5-number summary dan deteksi pencilan terhitung akurat.",
        codeExp: "Skrip menghitung nilai-nilai kunci yang mendasari pembentukan visualisasi Box Plot dan mengidentifikasi entitas pencilan secara matematis untuk menjamin transparansi analisis sebelum digambarkan ke dalam kanvas grafis.",
        pitfalls: [
          "Hanya mengandalkan histogram dengan jumlah bin default yang dapat menyembunyikan pola bimodal (distribusi dua puncak).",
          "Membuat Pairplot pada dataset dengan ratusan kolom numerik sekaligus, yang memicu kehabisan memori komputasi rendering grafik."
        ],
        refTitle: "Seaborn Documentation: Visualizing the distribution of a dataset",
        refUrl: "https://seaborn.pydata.org/tutorial/distributions.html"
      },
      {
        num: "4.10",
        slug: "4-10-penyusunan-laporan-temuan-eda-eksekutif",
        title: "4.10. Penyusunan Laporan Temuan EDA Eksekutif (Executive Summary EDA)",
        desc: "Sintesis wawasan analitik: teknik ekstraksi intisari bisnis dari eksplorasi data, struktur piramida Minto, penyusunan dashboard temuan, dan rekomendasi aksi nyata.",
        concept: `Fase akhir dari Analisis Data Eksploratori bukanlah penumpukan ratusan grafik di notebook Jupyter, melainkan kemampuan menyaring temuan menjadi Laporan Ringkasan Eksekutif (Executive Summary) yang menggerakkan keputusan bisnis. Eksekutif C-level tidak memiliki waktu membaca ribuan baris kode; mereka membutuhkan wawasan strategis, risiko yang teridentifikasi, dan langkah konkrit yang disarankan.

Struktur laporan analitik profesional mengadopsi Prinsip Piramida Minto (The Minto Pyramid Principle) yang dikembangkan oleh Barbara Minto di McKinsey. Prinsip ini menempatkan kesimpulan utama dan rekomendasi tindakan di urutan paling atas (Top-Down), diikuti oleh argumen pendukung berdasarkan data empiris, dan diakhiri dengan data teknis rincian metodologi di lampiran.

Laporan EDA yang efektif memisahkan antara fakta statistik deskriptif (apa yang terjadi), diagnosa inferensial (mengapa itu terjadi), dan implikasi bisnis (apa dampaknya jika tidak ada tindakan yang diambil). Setiap wawasan wajib dilengkapi dengan estimasi kuantitatif nilai finansial atau operasional.`,
        code: `# 4.10: Sintesis Metrik Kunci untuk Laporan Ringkasan Eksekutif EDA
import pandas as pd

# Menghasilkan tabel metrik ringkasan eksekutif
executive_kpis = {
    'Domain_Area': ['Pertumbuhan Pengguna', 'Tingkat Churn', 'Nilai Rata-rata Pesanan (AOV)', 'Efisiensi Saluran Iklan'],
    'Temuan_Faktual': ['Pertumbuhan melambat dari 12% ke 4% MoM di Q3', 'Churn meningkat tajam pada pengguna usia 18-24 tahun', 'AOV pelanggan loyal 2.4x lebih tinggi daripada pengguna baru', 'CPA Google Ads meningkat 45% dengan ROI menurun'],
    'Akar_Masalah_Data': ['Penurunan rasio konversi halaman pendaftaran baru', 'Masalah UX pada aplikasi Android versi v3.2', 'Program bundel produk bernilai tinggi berhasil mendorong basket size', 'Saturasi audiens kata kunci generik non-branded'],
    'Rekomendasi_Aksi': ['Rollback alur pendaftaran dan lakukan A/B testing', 'Rilis hotfix patch Android & kompensasi voucher pengguna terdampak', 'Perluas rekomendasi bundel otomatis ke segmen pengguna baru', 'Alokasikan ulang 30% anggaran ke retargeting dan micro-influencer'],
    'Estimasi_Dampak_Finansial': ['+Rp 250 Juta / Bulan', 'Mencegah potensi kerugian Rp 180 Juta', '+Rp 400 Juta / Kuartal', 'Penghematan biaya iklan Rp 75 Juta']
}

df_exec = pd.DataFrame(executive_kpis)
print("=== TEMUAN UTAMA & REKOMENDASI STRATEGIS EDA EKSEKUTIF ===")
for idx, row in df_exec.iterrows():
    print(f"\\n[{idx+1}] AREA: {row['Domain_Area'].upper()}")
    print(f"    - Temuan    : {row['Temuan_Faktual']}")
    print(f"    - Diagnosa  : {row['Akar_Masalah_Data']}")
    print(f"    - Aksi Solusi: {row['Rekomendasi_Aksi']}")
    print(f"    - Dampak    : {row['Estimasi_Dampak_Finansial']}")`,
        expectedOutput: "Laporan sintesis eksekutif dengan struktur terstandar Minto Pyramid tercetak terstruktur.",
        codeExp: "Skrip menstrukturkan wawasan hasil eksplorasi data teknis menjadi matriks keputusan strategis yang menghubungkan fakta empiris, diagnosa akar masalah, rekomendasi tindakan, dan estimasi dampak moneter bagi jajaran manajemen.",
        pitfalls: [
          "Menyajikan laporan dalam bentuk dump grafik teknis tanpa kesimpulan bisnis eksplisit.",
          "Memberikan rekomendasi generik seperti 'tingkatkan pemasaran' tanpa justifikasi kuantitatif berbasis data yang teruji."
        ],
        refTitle: "OSSU Data Science: Effective Communication & Executive Reporting",
        refUrl: "https://github.com/ossu/data-science"
      }
    ]
  },

  // ==========================================
  // BAB 5: SQL Tingkat Lanjut untuk Analitik (Window Functions, CTEs, Aggregates)
  // ==========================================
  {
    orderIndex: 5,
    id: "data-analyst-ch-5",
    slug: "bab-5-sql-tingkat-lanjut-untuk-analitik-window-functions-ctes-aggregates",
    title: "BAB 5: SQL Tingkat Lanjut untuk Analitik (Window Functions, CTEs, Aggregates)",
    desc: "Keahlian kueri data relasional tingkat profesional: Common Table Expressions (CTE) modular dan rekursif, seluruh spektrum Window Functions (Ranking, Value Navigation, Running Totals), spesifikasi Window Frame presisi, agregasi multidimensi, manipulasi temporal, dan integrasi Python SQLAlchemy.",
    coreConcepts: ["Common Table Expressions", "Window Functions", "Window Frames", "Relational Analytics", "SQLAlchemy Integration"],
    subchapters: [
      {
        num: "5.1",
        slug: "5-1-common-table-expressions-cte-subquery-terstruktur",
        title: "5.1. Common Table Expressions (CTE) & Subquery Terstruktur",
        desc: "Klausa WITH untuk memecah logika analitik modular: perbandingan terhadap subquery inline, optimasi keterbacaan kueri, dan CTE rekursif untuk data hierarkis.",
        concept: `Common Table Expression (CTE) adalah himpunan hasil sementara (temporary result set) bernama yang didefinisikan di awal kueri SQL menggunakan klausa WITH. CTE dapat dirujuk berkali-kali di dalam klausa SELECT, INSERT, UPDATE, atau DELETE utama berikutnya.

Sebelum adanya CTE, analis terpaksa menulis subquery bersarang (nested subqueries) yang panjang dan sulit dipahami (dikenal dengan istilah 'SQL Spaghetti'). Subquery bersarang dievaluasi dari dalam ke luar, sehingga menyulitkan penelusuran logika bisnis dan pemeliharaan kode oleh tim analitik.

Dengan CTE, kueri kompleks dapat disusun seperti alur komputasi sekuensial yang modular. Setiap langkah transformasi—mulai dari penyaringan awal, agregasi menengah, hingga perhitungan persentase akhir—diberi nama yang deskriptif. Selain itu, Recursive CTE memungkinkan penelusuran struktur hierarkis tak berujung seperti bagan organisasi karyawan atau pohon kategori produk.`,
        code: `# 5.1: Eksekusi Common Table Expressions (CTE) pada SQLite In-Memory
import sqlite3
import pandas as pd

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# Membuat tabel transaksi penjualan
cursor.execute('''
CREATE TABLE penjualan (
    id INTEGER PRIMARY KEY,
    sales_rep TEXT,
    wilayah TEXT,
    nominal INTEGER
)''')

data_penjualan = [
    (1, 'Andi', 'Jakarta', 45000000),
    (2, 'Budi', 'Jakarta', 35000000),
    (3, 'Citra', 'Surabaya', 50000000),
    (4, 'Dewi', 'Surabaya', 40000000),
    (5, 'Eko', 'Jakarta', 60000000)
]
cursor.executemany('INSERT INTO penjualan VALUES (?, ?, ?, ?)', data_penjualan)
conn.commit()

# Kueri dengan Multi-CTE: Menghitung total wilayah, lalu mencari sales di atas rata-rata wilayahnya
query_cte = '''
WITH AgregatWilayah AS (
    SELECT 
        wilayah,
        AVG(nominal) AS rerata_wilayah,
        SUM(nominal) AS total_wilayah
    FROM penjualan
    GROUP BY wilayah
),
PeringkatSales AS (
    SELECT 
        p.sales_rep,
        p.wilayah,
        p.nominal,
        w.rerata_wilayah,
        (p.nominal - w.rerata_wilayah) AS selisih_ke_rerata
    FROM penjualan p
    JOIN AgregatWilayah w ON p.wilayah = w.wilayah
)
SELECT * FROM PeringkatSales
WHERE selisih_ke_rerata > 0
ORDER BY selisih_ke_rerata DESC;
'''

df_hasil = pd.read_sql_query(query_cte, conn)
print("=== HASIL EVALUASI SALES DI ATAS RATA-RATA DENGAN MULTI-CTE ===")
print(df_hasil)
conn.close()`,
        expectedOutput: "Kueri CTE berhasil dieksekusi menghasilkan staf dengan penjualan di atas rata-rata wilayah.",
        codeExp: "Skrip memanfaatkan SQLite in-memory untuk mendemonstrasikan perangkaian dua blok CTE: AgregatWilayah untuk menghitung rata-rata grup, dan PeringkatSales untuk mengukur selisih individu terhadap rata-rata tersebut secara elegan.",
        pitfalls: [
          "Mendefinisikan CTE yang terlalu banyak dan berat pada mesin database tanpa materialisasi (seperti PostgreSQL sebelum versi 12), yang dapat memaksa database mengevaluasi ulang CTE berkali-kali.",
          "Lupa menyertakan kondisi terminasi (WHERE anchor) pada Recursive CTE, yang menyebabkan infinite loop pada server basis data."
        ],
        refTitle: "Python Standard Library: sqlite3 — DB-API 2.0 interface",
        refUrl: "https://docs.python.org/3/library/sqlite3.html"
      },
      {
        num: "5.2",
        slug: "5-2-window-functions-ranking-row-number-rank-dense-rank",
        title: "5.2. Window Functions: Ranking (ROW_NUMBER, RANK, DENSE_RANK)",
        desc: "Peringkat baris dalam partisi: perbedaan penanganan seri (ties) antara ROW_NUMBER(), RANK(), dan DENSE_RANK(), serta penggunaan NTILE() untuk pembagian kuartil.",
        concept: `Window Functions melakukan kalkulasi terhadap sekumpulan baris tabel yang berkaitan dengan baris saat ini (disebut sebagai window frame), namun tidak seperti klausa GROUP BY reguler, Window Functions tidak menggabungkan atau mereduksi baris-baris tersebut menjadi satu baris tunggal. Setiap baris individual tetap mempertahankan identitas aslinya.

Fungsi peringkat (Ranking Functions) adalah kelas window functions yang paling sering digunakan dalam analitik bisnis untuk menentukan posisi teratas (Top-N Analysis), seperti mengidentifikasi 3 produk terlaris di setiap kategori secara dinamis.

Perbedaan fundamental antara tiga fungsi ranking utama terletak pada cara menangani nilai yang bernilai kembar (ties):
1. ROW_NUMBER() memberikan nomor urut integer unik berurutan (1, 2, 3, 4) tanpa memedulikan kesamaan nilai.
2. RANK() memberikan peringkat yang sama untuk nilai kembar, namun melompati nomor urut berikutnya (misal: 1, 2, 2, 4).
3. DENSE_RANK() memberikan peringkat yang sama untuk nilai kembar tanpa melompati nomor urut berikutnya (misal: 1, 2, 2, 3).`,
        code: `# 5.2: Perbandingan ROW_NUMBER(), RANK(), dan DENSE_RANK() pada Data Transaksi
import sqlite3
import pandas as pd

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE nilai_tes (
    kandidat TEXT,
    divisi TEXT,
    skor INTEGER
)''')

data_kandidat = [
    ('Ani', 'IT', 95),
    ('Bambang', 'IT', 90),
    ('Caca', 'IT', 90), # Seri dengan Bambang
    ('Doni', 'IT', 85),
    ('Euis', 'Sales', 92),
    ('Fajar', 'Sales', 88),
    ('Gita', 'Sales', 88)  # Seri dengan Fajar
]
cursor.executemany('INSERT INTO nilai_tes VALUES (?, ?, ?)', data_kandidat)
conn.commit()

query_ranking = '''
SELECT 
    divisi,
    kandidat,
    skor,
    ROW_NUMBER() OVER (PARTITION BY divisi ORDER BY skor DESC) AS no_urut,
    RANK() OVER (PARTITION BY divisi ORDER BY skor DESC) AS rank_gap,
    DENSE_RANK() OVER (PARTITION BY divisi ORDER BY skor DESC) AS dense_rank_nogap
FROM nilai_tes
ORDER BY divisi, skor DESC;
'''

df_rank = pd.read_sql_query(query_ranking, conn)
print("=== PERBANDINGAN FUNGSI PERINGKAT WINDOW SQL ===")
print(df_rank)
conn.close()`,
        expectedOutput: "Tabel perbandingan memperlihatkan perbedaan penanganan nilai seri pada kolom rank_gap vs dense_rank_nogap.",
        codeExp: "Skrip menunjukkan bagaimana klausul OVER (PARTITION BY divisi ORDER BY skor DESC) mengisolasi kalkulasi ranking per departemen dan memperlihatkan secara visual perbedaan lompatan peringkat pada RANK() vs DENSE_RANK().",
        pitfalls: [
          "Menggunakan ROW_NUMBER() untuk menentukan pemenang kompetisi atau bonus ketika nilai skor sama persis, yang menghasilkan pemenang tidak adil dan tidak deterministik jika kriteria tie-breaker tidak ditentukan.",
          "Mencoba menyaring hasil window function langsung di klausa WHERE pada kueri yang sama (misal WHERE ROW_NUMBER() <= 3), yang memicu galat SQL karena window function dievaluasi setelah klausa WHERE; solusinya gunakan pembungkus CTE."
        ],
        refTitle: "PostgreSQL Documentation: Window Functions",
        refUrl: "https://www.postgresql.org/docs/current/tutorial-window.html"
      },
      {
        num: "5.3",
        slug: "5-3-window-functions-navigasi-lag-lead-first-value",
        title: "5.3. Window Functions: Navigasi Nilai (LAG, LEAD, FIRST_VALUE)",
        desc: "Akses data antar-baris tanpa self-join: navigasi baris sebelumnya (LAG), baris berikutnya (LEAD), dan nilai batas partisi (FIRST_VALUE, LAST_VALUE).",
        concept: `Sebelum ditemukannya fungsi navigasi nilai dalam standar SQL:2003, membandingkan nilai transaksi hari ini dengan nilai transaksi hari sebelumnya mengharuskan analis melakukan operasi Self-Join yang sangat lambat dan membebani I/O disk basis data.

Fungsi LAG() dan LEAD() memungkinkan analis mengakses nilai atribut dari baris sebelum (LAG) atau baris sesudah (LEAD) baris saat ini dalam partisi yang ditentukan, dengan parameter offset langkah dan nilai default fallback jika baris tersebut berada di luar batas partisi (misalnya baris pertama).

Fungsi ini merupakan fondasi komputasi metrik transisi bisnis, seperti menghitung waktu jeda antar-pembelian pengguna (Days Since Last Purchase), mendeteksi perubahan status pelanggan (Churn Transition), dan menghitung pertumbuhan persentase periode-ke-periode secara instan.`,
        code: `# 5.3: Penggunaan LAG() dan LEAD() untuk Analisis Retensi Transaksi Pengguna
import sqlite3
import pandas as pd

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE riwayat_pesanan (
    user_id TEXT,
    order_date DATE,
    nominal INTEGER
)''')

data_trx = [
    ('U101', '2026-01-05', 250000),
    ('U101', '2026-01-18', 400000),
    ('U101', '2026-02-10', 350000),
    ('U102', '2026-01-10', 150000),
    ('U102', '2026-01-12', 200000)
]
cursor.executemany('INSERT INTO riwayat_pesanan VALUES (?, ?, ?)', data_trx)
conn.commit()

query_lag = '''
SELECT 
    user_id,
    order_date,
    nominal,
    LAG(order_date, 1, 'First Purchase') OVER (
        PARTITION BY user_id ORDER BY order_date
    ) AS tanggal_pesanan_sebelumnya,
    LAG(nominal, 1, 0) OVER (
        PARTITION BY user_id ORDER BY order_date
    ) AS nominal_sebelumnya,
    (nominal - LAG(nominal, 1, nominal) OVER (
        PARTITION BY user_id ORDER BY order_date
    )) AS selisih_nominal_mom
FROM riwayat_pesanan
ORDER BY user_id, order_date;
'''

df_lag = pd.read_sql_query(query_lag, conn)
print("=== ANALISIS PERUBAHAN NOMINAL TRANSAKSI DENGAN LAG() ===")
print(df_lag)
conn.close()`,
        expectedOutput: "Kolom tanggal dan nominal transaksi sebelumnya terisi rapi per pengguna.",
        codeExp: "Skrip memanfaatkan LAG() dengan default value untuk mencegah nilai NULL pada pesanan perdana, dan langsung menghitung selisih nominal transaksi terhadap pembelian sebelumnya tanpa memerlukan join tabel ganda.",
        pitfalls: [
          "Lupa menyertakan klausa ORDER BY di dalam OVER(), yang membuat urutan baris acak sehingga nilai baris sebelumnya tidak memiliki makna kronologis.",
          "Salah menginterpretasikan LAST_VALUE() akibat default window frame yang berhenti di baris saat ini (CURRENT ROW); selalu definisikan frame eksplisit jika menggunakan LAST_VALUE."
        ],
        refTitle: "PostgreSQL Documentation: General-Purpose Window Functions",
        refUrl: "https://www.postgresql.org/docs/current/functions-window.html"
      },
      {
        num: "5.4",
        slug: "5-4-window-functions-agregasi-berjalan-running-total-moving-avg",
        title: "5.4. Window Functions: Agregasi Berjalan (Running Total & Moving Average)",
        desc: "Kalkulasi kumulatif dan rata-rata bergerak: SUM() kumulatif per periode, target pencapaian tahun berjalan (YTD), dan perataan volatilitas.",
        concept: `Agregasi berjalan (Running Aggregates atau Cumulative Aggregates) menghitung akumulasi metrik secara dinamis seiring berjalannya waktu atau urutan peristiwa. Kasus penggunaan paling umum di divisi keuangan dan penjualan adalah menghitung Total Pendapatan Kumulatif (Running Total) dan Akumulasi Tahun Berjalan (Year-to-Date / YTD Revenue).

Ketika fungsi agregat standar seperti SUM(), AVG(), MIN(), atau MAX() digabungkan dengan klausa OVER (ORDER BY tanggal), fungsi tersebut secara otomatis bertransformasi menjadi fungsi agregasi berjalan.

Perhitungan rata-rata bergerak (Moving Average) dengan Window Functions memungkinkan pemantauan performa harian yang bebas dari bias fluktuasi jangka pendek, misalnya menghitung rata-rata penjualan 7 hari terakhir untuk menentukan tren pasokan logistik secara objektif.`,
        code: `# 5.4: Perhitungan Running Total dan Moving Average Penjualan Harian
import sqlite3
import pandas as pd

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE omzet_harian (
    hari_ke INTEGER PRIMARY KEY,
    pendapatan INTEGER
)''')

data_harian = [
    (1, 10000000),
    (2, 12000000),
    (3, 15000000),
    (4, 9000000),
    (5, 14000000),
    (6, 18000000),
    (7, 20000000)
]
cursor.executemany('INSERT INTO omzet_harian VALUES (?, ?)', data_harian)
conn.commit()

query_running = '''
SELECT 
    hari_ke,
    pendapatan,
    SUM(pendapatan) OVER (
        ORDER BY hari_ke
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total_omzet,
    ROUND(AVG(pendapatan) OVER (
        ORDER BY hari_ke
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ), 2) AS moving_avg_3_hari
FROM omzet_harian
ORDER BY hari_ke;
'''

df_running = pd.read_sql_query(query_running, conn)
print("=== KUMULATIF OMZET & 3-DAY MOVING AVERAGE SQL ===")
print(df_running)
conn.close()`,
        expectedOutput: "Running total terakumulasi hingga hari ke-7 dan moving average 3 hari terhitung presisi.",
        codeExp: "Skrip menunjukkan sintaks eksplisit ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW untuk mengakumulasi pendapatan dari awal waktu, serta ROWS BETWEEN 2 PRECEDING AND CURRENT ROW untuk rata-rata bergerak 3 periode.",
        pitfalls: [
          "Mengabaikan spesifikasi frame eksplisit ketika terdapat nilai tanggal yang kembar, yang dapat menyebabkan RANGE default menjumlahkan seluruh baris bertanggal sama sekaligus sebelum melangkah ke baris berikutnya.",
          "Menerapkan running total pada dataset ratusan juta baris tanpa partisi yang tepat, yang dapat memakan memori tempdb server secara berlebih."
        ],
        refTitle: "SQLite Documentation: Window Functions",
        refUrl: "https://www.sqlite.org/windowfunctions.html"
      },
      {
        num: "5.5",
        slug: "5-5-window-frames-rows-vs-range-preceding-following",
        title: "5.5. Window Frames: ROWS vs RANGE BETWEEN PRECEDING AND FOLLOWING",
        desc: "Spesifikasi presisi cakupan baris jendela: perbedaan mendalam baris fisik (ROWS) vs rentang nilai logis (RANGE), serta batas UNBOUNDED dan CURRENT ROW.",
        concept: `Klausul pembingkaian jendela (Window Frame Clause) menentukan batas spesifik subset baris di dalam partisi saat ini yang akan diikutsertakan dalam kalkulasi window function. Memahami perbedaan antara mode ROWS dan RANGE merupakan salah satu pembeda teknis paling krusial antara analis pemula dan senior.

Mode ROWS mendefinisikan pembingkaian berdasarkan posisi fisik baris relatif terhadap baris saat ini (misal: 3 baris secara fisik sebelum baris aktif, tanpa memedulikan nilai yang ada di kolom pengurutan).

Sebaliknya, mode RANGE mendefinisikan pembingkaian berdasarkan rentang nilai logis (value offset) dari ekspresi pengurutan. Jika dua atau lebih baris memiliki nilai ORDER BY yang identik (misal: tanggal yang sama), mode RANGE memperlakukan seluruh baris tersebut sebagai satu entitas kesatuan (peers), sehingga seluruh baris tersebut akan dijumlahkan bersamaan. Default SQL saat ORDER BY disertakan tanpa spesifikasi frame adalah RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.`,
        code: `# 5.5: Demonstrasi Perbedaan Perilaku ROWS vs RANGE pada Nilai Seri (Ties)
import sqlite3
import pandas as pd

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE transaksi_harian (
    tanggal TEXT,
    nominal INTEGER
)''')

# Tanggal 2026-03-02 memiliki dua transaksi kembar
data_ties = [
    ('2026-03-01', 100),
    ('2026-03-02', 200),
    ('2026-03-02', 200), # Nilai tanggal sama persis
    ('2026-03-03', 300)
]
cursor.executemany('INSERT INTO transaksi_harian VALUES (?, ?)', data_ties)
conn.commit()

query_frame = '''
SELECT 
    tanggal,
    nominal,
    SUM(nominal) OVER (
        ORDER BY tanggal
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS sum_rows_fisik,
    SUM(nominal) OVER (
        ORDER BY tanggal
        RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS sum_range_logis
FROM transaksi_harian
ORDER BY tanggal;
'''

df_frame = pd.read_sql_query(query_frame, conn)
print("=== PERBEDAAN ROWS (FISIK) VS RANGE (LOGIS PEERS) ===")
print(df_frame)
conn.close()`,
        expectedOutput: "Pada baris kedua tanggal 2026-03-02, sum_rows menghasilkan 300 sedangkan sum_range langsung melompat ke 500 karena memperlakukan baris kembar secara serentak.",
        codeExp: "Skrip mengilustrasikan jebakan klasik mode RANGE: pada baris bertanggal sama, mode RANGE langsung mengevaluasi seluruh kelompok tanggal tersebut sehingga running total melompat prematur, sedangkan mode ROWS mengakumulasi baris demi baris secara murni.",
        pitfalls: [
          "Tidak menyadari bahwa mengabaikan klausa frame secara otomatis mengaktifkan mode RANGE default yang memperlambat performa komputasi basis data karena mesin database harus memeriksa keberadaan nilai kembar (peers).",
          "Mencoba menggunakan interval waktu spesifik pada mode RANGE (seperti INTERVAL '7 DAYS') pada dialek SQL yang hanya mendukung offset numerik murni."
        ],
        refTitle: "PostgreSQL Documentation: Window Function Syntax & Frames",
        refUrl: "https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS"
      },
      {
        num: "5.6",
        slug: "5-6-operasi-himpunan-multi-table-joins-self-cross-anti",
        title: "5.6. Operasi Himpunan & Multi-Table Joins (Self-Join, Cross-Join, Anti-Join)",
        desc: "Kueri relasional tingkat mahir: pembentukan pasangan data dengan Self-Join, kombinatorika matriks dengan Cross-Join, deteksi anomali dengan Anti-Join (NOT EXISTS), dan operasi himpunan UNION/EXCEPT.",
        concept: `Meskipun join standar seperti INNER dan LEFT JOIN mencakup sebagian besar kebutuhan analitik rutin, skenario bisnis tingkat lanjut seringkali membutuhkan jenis relasi khusus untuk menyelesaikan masalah logika yang tidak konvensional.

Cross Join (Produk Kartesius) menggabungkan setiap baris dari tabel pertama dengan setiap baris dari tabel kedua. Cross Join sangat berguna untuk menghasilkan kisi dasar (grid matrix) lengkap—misalnya menghasilkan seluruh kombinasi Cabang x Bulan untuk memastikan bulan dengan penjualan nol tetap muncul di laporan akhir.

Anti-Join (diimplementasikan via NOT EXISTS atau LEFT JOIN ... WHERE right.id IS NULL) digunakan untuk menemukan entitas yang tidak memiliki keterkaitan sama sekali—misalnya mencari pelanggan yang mendaftar tetapi tidak pernah melakukan transaksi pembelian pertama dalam 30 hari. Sementara itu, operasi himpunan seperti UNION, INTERSECT, dan EXCEPT memproses baris data pada tingkat kesatuan set.`,
        code: `# 5.6: Implementasi Anti-Join dan Cross-Join Matriks Penjualan
import sqlite3
import pandas as pd

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# Tabel Semua Produk
cursor.execute('CREATE TABLE produk (kode TEXT PRIMARY KEY, nama TEXT)')
cursor.executemany('INSERT INTO produk VALUES (?, ?)', [
    ('P1', 'Kopi Susu'),
    ('P2', 'Teh Tarik'),
    ('P3', 'Roti Bakar')
])

# Tabel Transaksi Penjualan Hari Ini (Roti Bakar belum ada yang beli)
cursor.execute('CREATE TABLE transaksi (id INTEGER, kode TEXT, qty INTEGER)')
cursor.executemany('INSERT INTO transaksi VALUES (?, ?, ?)', [
    (101, 'P1', 5),
    (102, 'P2', 3),
    (103, 'P1', 2)
])
conn.commit()

# Anti-Join: Menemukan produk yang belum laku terjual sama sekali hari ini
query_antijoin = '''
SELECT p.kode, p.nama
FROM produk p
LEFT JOIN transaksi t ON p.kode = t.kode
WHERE t.id IS NULL;
'''

df_antijoin = pd.read_sql_query(query_antijoin, conn)
print("=== PRODUK TIDAK TERJUAL HARI INI (ANTI-JOIN) ===")
print(df_antijoin)
conn.close()`,
        expectedOutput: "Produk P3 (Roti Bakar) berhasil diidentifikasi sebagai produk yang tidak terjual.",
        codeExp: "Skrip mendemonstrasikan pola Anti-Join yang efisien: menggabungkan tabel master dengan tabel fakta melalui LEFT JOIN dan memfilter baris yang memiliki nilai foreign key NULL untuk menemukan item yang tidak aktif.",
        pitfalls: [
          "Menggunakan 'NOT IN (SELECT kode FROM transaksi)' ketika kolom transaksi.kode memuat nilai NULL, yang menyebabkan seluruh kueri SQL mengembalikan set kosong secara mengejutkan (Three-Valued Logic NULL trap).",
          "Menjalankan Cross-Join pada dua tabel besar tanpa filter kondisi yang memadai, yang dapat menghasilkan miliaran baris dan menumbangkan server basis data."
        ],
        refTitle: "SQLite Documentation: Query Language - Joins",
        refUrl: "https://www.sqlite.org/optoverview.html"
      },
      {
        num: "5.7",
        slug: "5-7-teknik-pivot-unpivot-kondisional-case-when",
        title: "5.7. Teknik Pivot dan Unpivot Kondisional dengan CASE WHEN",
        desc: "Transformasi matriks langsung dalam mesin basis data: pivoting manual menggunakan ekspresi CASE WHEN terkondensasi, agregasi filter, dan teknik unpivot.",
        concept: `Meskipun beberapa mesin database modern seperti SQL Server dan Oracle menyediakan operator PIVOT bawaan, teknik standar industri yang paling portabel dan berlaku di seluruh dialek SQL (PostgreSQL, MySQL, SQLite, Snowflake, BigQuery) adalah Pivoting Kondisional menggunakan ekspresi agregasi CASE WHEN.

Pivoting kondisional bekerja dengan mengevaluasi kondisi baris di dalam fungsi agregat. Misalnya, untuk menghitung pendapatan per kuartal dalam bentuk kolom-kolom terpisah, analis menulis: SUM(CASE WHEN kuartal = 'Q1' THEN nominal ELSE 0 END) AS pendapatan_q1.

Teknik ini sangat cepat karena dieksekusi langsung di mesin database (in-engine execution) sebelum data dikirimkan melalui jaringan ke aplikasi analitik seperti Python atau BI tools, sehingga secara dramatis mengurangi beban transfer jaringan dan waktu rendering laporan.`,
        code: `# 5.7: Pivoting Matriks Kategori Produk Berbasis SQL CASE WHEN
import sqlite3
import pandas as pd

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE penjualan_bulanan (
    cabang TEXT,
    bulan TEXT,
    omzet INTEGER
)''')

data_omzet = [
    ('Jakarta', 'Januari', 100),
    ('Jakarta', 'Februari', 150),
    ('Jakarta', 'Maret', 200),
    ('Surabaya', 'Januari', 80),
    ('Surabaya', 'Februari', 90),
    ('Surabaya', 'Maret', 110)
]
cursor.executemany('INSERT INTO penjualan_bulanan VALUES (?, ?, ?)', data_omzet)
conn.commit()

query_pivot = '''
SELECT 
    cabang,
    SUM(CASE WHEN bulan = 'Januari' THEN omzet ELSE 0 END) AS jan,
    SUM(CASE WHEN bulan = 'Februari' THEN omzet ELSE 0 END) AS feb,
    SUM(CASE WHEN bulan = 'Maret' THEN omzet ELSE 0 END) AS mar,
    SUM(omzet) AS total_q1
FROM penjualan_bulanan
GROUP BY cabang
ORDER BY total_q1 DESC;
'''

df_pivot = pd.read_sql_query(query_pivot, conn)
print("=== HASIL PIVOT KONDISIONAL SQL IN-ENGINE ===")
print(df_pivot)
conn.close()`,
        expectedOutput: "Tabel matriks dengan kolom jan, feb, mar, dan total_q1 berhasil terbentuk.",
        codeExp: "Skrip memanfaatkan agregasi SUM(CASE WHEN ...) yang dikelompokkan berdasarkan cabang untuk memutar baris bulan menjadi kolom horizontal secara efisien tanpa memerlukan ekstensi khusus database.",
        pitfalls: [
          "Lupa menyertakan klausa ELSE 0 di dalam ekspresi CASE WHEN saat melakukan SUM(), yang menghasilkan nilai NULL jika tidak ada transaksi pada bulan tersebut.",
          "Mencoba membuat pivot dinamis dengan jumlah kolom yang tidak diketahui sebelumnya menggunakan SQL statis murni tanpa bantuan kueri dinamis atau script wrapper."
        ],
        refTitle: "PostgreSQL Documentation: Conditional Expressions (CASE)",
        refUrl: "https://www.postgresql.org/docs/current/functions-conditional.html"
      },
      {
        num: "5.8",
        slug: "5-8-manipulasi-tanggal-agregasi-periode-bisnis-datetrunc",
        title: "5.8. Manipulasi Tanggal & Agregasi Periode Bisnis (DATE_TRUNC, EXTRACT)",
        desc: "Operasi temporal SQL: pemotongan tanggal ke batas periode (DATE_TRUNC, strftime), ekstraksi komponen kalender (EXTRACT, DAYOFWEEK), dan kalkulasi selisih interval waktu.",
        concept: `Data bisnis berputar di sekitar kalender fiskal: kuartal bisnis, minggu penjualan, hari kerja vs akhir pekan, dan jam operasional sibuk. Menguasai fungsi temporal SQL memungkinkan analis menyelaraskan data transaksi yang berbutir halus (granular timestamp) ke dalam periode pelaporan manajemen.

Dua fungsi fundamental dalam manipulasi tanggal SQL adalah DATE_TRUNC() dan EXTRACT(). DATE_TRUNC('month', timestamp) memotong stempel waktu ke tanggal 1 bulan tersebut pada jam 00:00:00, menyederhanakan agregasi bulanan tanpa kehilangan tipe data waktu asli.

Fungsi EXTRACT() digunakan untuk menarik komponen numerik spesifik dari sebuah tanggal, seperti hari dalam minggu (Day of Week, 0-6 atau 1-7) atau jam dalam hari (Hour, 0-23). Ekstraksi ini penting untuk menganalisis perilaku siklikal pelanggan, seperti mengidentifikasi jam puncak pemesanan makanan atau hari dengan volume klaim asuransi tertinggi.`,
        code: `# 5.8: Agregasi Jam Sibuk dan Pemotongan Periode Menggunakan SQL
import sqlite3
import pandas as pd

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE log_transaksi (
    id INTEGER PRIMARY KEY,
    waktu_transaksi TEXT,
    total_belanja INTEGER
)''')

data_waktu = [
    (1, '2026-03-01 08:15:30', 25000),
    (2, '2026-03-01 08:45:10', 45000),
    (3, '2026-03-01 12:30:00', 120000),
    (4, '2026-03-01 12:55:20', 85000),
    (5, '2026-03-01 19:10:00', 210000)
]
cursor.executemany('INSERT INTO log_transaksi VALUES (?, ?, ?)', data_waktu)
conn.commit()

# Ekstraksi jam dan pemotongan tanggal menggunakan strftime SQLite
query_temporal = '''
SELECT 
    strftime('%H', waktu_transaksi) AS jam_transaksi,
    COUNT(id) AS volume_pesanan,
    SUM(total_belanja) AS total_omzet,
    ROUND(AVG(total_belanja), 2) AS rata_rata_belanja
FROM log_transaksi
GROUP BY jam_transaksi
ORDER BY volume_pesanan DESC;
'''

df_temporal = pd.read_sql_query(query_temporal, conn)
print("=== DISTRIBUSI TRANSAKSI BERDASARKAN JAM TRANSAKSI ===")
print(df_temporal)
conn.close()`,
        expectedOutput: "Data teragregasi per jam (jam 08, 12, dan 19) dengan metrik volume dan omzet.",
        codeExp: "Skrip memanfaatkan fungsi strftime() standar SQLite untuk mengekstraksi komponen jam dari stempel waktu string ISO-8601 dan melakukan agregasi kinerja per jam operasional bisnis.",
        pitfalls: [
          "Mengabaikan zona waktu (Time Zone Offset seperti UTC vs WIB/UTC+7), yang dapat menyebabkan transaksi larut malam bergeser ke hari berikutnya dalam laporan.",
          "Menyimpan tanggal sebagai string non-standar (misal 'DD-MM-YYYY') yang tidak dapat diurutkan atau dipotong secara alfabetis oleh mesin SQL."
        ],
        refTitle: "SQLite Documentation: Date And Time Functions",
        refUrl: "https://www.sqlite.org/lang_datefunc.html"
      },
      {
        num: "5.9",
        slug: "5-9-optimasi-kueri-analitik-indeks-relasional-explain-partisi",
        title: "5.9. Optimasi Kueri Analitik: Indeks Relasional, EXPLAIN & Partisi",
        desc: "Peningkatan efisiensi eksekusi kueri: membaca rencana eksekusi (EXPLAIN QUERY PLAN), arsitektur B-Tree vs Hash Index, covering index, dan eliminasi Sequential Scan.",
        concept: `Saat bekerja dengan tabel basis data berukuran gigabyte hingga terabyte di data warehouse perusahaan, kueri yang tidak dioptimalkan dapat memakan waktu berjam-jam dan menghabiskan ribuan dolar biaya komputasi cloud. Analis data senior harus memahami bagaimana mesin basis data mengeksekusi kueri di balik layar.

Perintah EXPLAIN (atau EXPLAIN QUERY PLAN) menampilkan rencana eksekusi (execution plan) yang disusun oleh query optimizer basis data. Rencana ini memperlihatkan urutan operasi: apakah basis data melakukan pemindaian seluruh tabel baris per baris (Sequential Scan / Full Table Scan) yang mahal, atau memanfaatkan Indeks (Index Scan) yang sangat cepat.

Indeks B-Tree memungkinkan pencarian logaritmik O(log N). Membangun Covering Index—indeks gabungan yang memuat seluruh kolom yang dibutuhkan dalam klausa WHERE, JOIN, dan SELECT—memungkinkan basis data mengambil data langsung dari indeks tanpa perlu menyentuh tabel utama (Index Only Scan), menghasilkan percepatan kueri hingga puluhan kali lipat.`,
        code: `# 5.9: Audit Rencana Eksekusi Kueri Menggunakan EXPLAIN QUERY PLAN
import sqlite3
import pandas as pd

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# Membuat tabel pesanan besar
cursor.execute('''
CREATE TABLE pesanan_audit (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    status TEXT,
    nominal INTEGER
)''')

# 1. Audit kueri SEBELUM ada indeks (Full Table Scan)
cursor.execute("EXPLAIN QUERY PLAN SELECT * FROM pesanan_audit WHERE customer_id = 105")
plan_awal = cursor.fetchall()

# Membuat indeks pada kolom customer_id
cursor.execute("CREATE INDEX idx_pesanan_cust ON pesanan_audit (customer_id)")
conn.commit()

# 2. Audit kueri SETELAH ada indeks (Index Search)
cursor.execute("EXPLAIN QUERY PLAN SELECT * FROM pesanan_audit WHERE customer_id = 105")
plan_akhir = cursor.fetchall()

print("=== RENCANA EKSEKUSI SEBELUM INDEKS ===")
for step in plan_awal:
    print(f"Detail: {step[3]}")

print("\\n=== RENCANA EKSEKUSI SETELAH INDEKS (B-TREE SEARCH) ===")
for step in plan_akhir:
    print(f"Detail: {step[3]}")
conn.close()`,
        expectedOutput: "Rencana eksekusi beralih dari SCAN TABLE pesanan_audit menjadi SEARCH TABLE pesanan_audit USING INDEX idx_pesanan_cust.",
        codeExp: "Skrip menunjukkan proses diagnostik rencana kueri: sebelum indeks dibuat, mesin mengeksekusi pemindaian penuh seluruh tabel (SCAN); setelah indeks diterapkan, mesin langsung melompat ke alamat memori yang dituju menggunakan indeks B-Tree (SEARCH USING INDEX).",
        pitfalls: [
          "Menerapkan fungsi pada kolom berindeks di klausa WHERE (misal: WHERE YEAR(tanggal_pesanan) = 2026), yang membatalkan penggunaan indeks dan memaksa database melakukan full table scan; gunakan WHERE tanggal_pesanan >= '2026-01-01' AND tanggal_pesanan < '2027-01-01'.",
          "Membuat indeks pada setiap kolom tanpa perhitungan matang, yang memperlambat operasi penulisan data (INSERT/UPDATE/DELETE) secara signifikan."
        ],
        refTitle: "SQLite Documentation: EXPLAIN QUERY PLAN",
        refUrl: "https://www.sqlite.org/eqp.html"
      },
      {
        num: "5.10",
        slug: "5-10-ekstraksi-data-sql-ke-dataframe-sqlalchemy-sqlite",
        title: "5.10. Ekstraksi Data SQL ke DataFrame Python Menggunakan SQLAlchemy & SQLite",
        desc: "Jembatan pipeline analitik: koneksi basis data aman dengan SQLAlchemy Engine, parameterisasi kueri anti-SQL-Injection, chunking data masif ke Pandas, dan penulisan kembali via to_sql().",
        concept: `Integrasi mulus antara basis data SQL perusahaan dan lingkungan analisis data Python merupakan alur kerja harian paling penting bagi analis data. Data mentah diekstraksi dan disaring di lapisan basis data menggunakan efisiensi SQL, kemudian ditarik ke dalam DataFrame Pandas untuk pemodelan statistik, pembelajaran mesin, atau visualisasi lanjutan.

Standar industri modern untuk mengelola koneksi basis data di Python adalah SQLAlchemy. Dengan SQLAlchemy Engine, analis mendapatkan koneksi connection-pooling yang stabil, aman, dan kompatibel di berbagai sistem manajemen basis data (PostgreSQL, MySQL, SQL Server, Oracle, SQLite, Redshift).

Keamanan adalah aspek kritis: kueri SQL dinamis yang dibuat dengan menggabungkan string mentah (string concatenation atau f-strings) sangat rentan terhadap serangan peretasan SQL Injection. Analis profesional selalu menggunakan kueri berparameter (Parameterized Queries) di mana nilai input pengguna disanitasi secara otomatis oleh driver basis data sebelum dieksekusi.`,
        code: `# 5.10: Ekstraksi Data Aman Menggunakan Parameterized Query ke Pandas
import sqlite3
import pandas as pd

# Inisialisasi basis data dan tabel
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE karyawan (
    nik TEXT PRIMARY KEY,
    nama TEXT,
    departemen TEXT,
    gaji INTEGER
)''')

data_karyawan = [
    ('K01', 'Hendro', 'Finance', 12000000),
    ('K02', 'Indah', 'Marketing', 9500000),
    ('K03', 'Joko', 'Engineering', 18000000),
    ('K04', 'Kiki', 'Finance', 11000000)
]
cursor.executemany('INSERT INTO karyawan VALUES (?, ?, ?, ?)', data_karyawan)
conn.commit()

# Ekstraksi aman dengan parameterisasi (Mencegah SQL Injection)
target_dept = 'Finance'
min_gaji = 10000000

query_aman = '''
SELECT nik, nama, gaji
FROM karyawan
WHERE departemen = ? AND gaji >= ?
ORDER BY gaji DESC;
'''

# Eksekusi langsung ke Pandas DataFrame
df_karyawan = pd.read_sql_query(
    sql=query_aman,
    con=conn,
    params=[target_dept, min_gaji]
)

print(f"=== HASIL EKSTRAKSI KARYAWAN DEPARTEMEN {target_dept.upper()} ===")
print(df_karyawan)
conn.close()`,
        expectedOutput: "Data karyawan departemen Finance dengan gaji di atas 10 juta terekstraksi aman ke DataFrame.",
        codeExp: "Skrip mengekstraksi data secara aman menggunakan pd.read_sql_query() dengan parameterisasi tuple [target_dept, min_gaji], menjamin integritas keamanan kueri tanpa risiko SQL injection.",
        pitfalls: [
          "Menggunakan format string f'SELECT * FROM tabel WHERE user = \"{input_user}\"' yang membuka celah kerentanan fatal SQL Injection.",
          "Membaca seluruh isi tabel transaksi raksasa tanpa klausa LIMIT atau tanpa filter tanggal ke dalam memori RAM laptop lokal."
        ],
        refTitle: "pandas Documentation: Reading and writing SQL databases (read_sql)",
        refUrl: "https://pandas.pydata.org/docs/user_guide/io.html#sql-queries"
      }
    ]
  },

  // ==========================================
  // BAB 6: Visualisasi Data & Storytelling Efektif (Matplotlib, Seaborn, Altair)
  // ==========================================
  {
    orderIndex: 6,
    id: "data-analyst-ch-6",
    slug: "bab-6-visualisasi-data-storytelling-efektif-matplotlib-seaborn-altair",
    title: "BAB 6: Visualisasi Data & Storytelling Efektif (Matplotlib, Seaborn, Altair)",
    desc: "Ilmu dan seni komunikasi grafis berbasis data: psikologi persepsi visual Gestalt, aturan rasio tinta-data Edward Tufte, hierarki Object-Oriented Matplotlib, visualisasi statistik multivariat Seaborn, palet warna aksesibel, anotasi kontekstual, dan pencegahan manipulasi visual.",
    coreConcepts: ["Gestalt Perception", "Edward Tufte Data-Ink Ratio", "Matplotlib OOP Architecture", "Seaborn Statistical Plots", "Accessible Palettes", "Data Storytelling"],
    subchapters: [
      {
        num: "6.1",
        slug: "6-1-prinsip-persepsi-visual-gestalt-teori-edward-tufte",
        title: "6.1. Prinsip Persepsi Visual Gestalt & Teori Edward Tufte",
        desc: "Fondasi kognitif desain informasi: hukum Gestalt (kedekatan, kemiripan, penutupan), konsep Data-Ink Ratio Edward Tufte, dan eliminasi chartjunk.",
        concept: `Visualisasi data bukan sekadar kegiatan mempercantik grafik, melainkan rekayasa kognitif untuk mentransfer informasi kuantitatif dari layar ke otak pembuat keputusan secepat dan seakurat mungkin. Fondasi teoretis dari desain grafis analitik bertumpu pada Psikologi Gestalt dan teori Edward Tufte.

Prinsip Gestalt menjelaskan bagaimana otak manusia mengelompokkan elemen-elemen visual secara otomatis:
1. Proximity (Kedekatan): Objek yang berdekatan secara spasial dianggap sebagai satu kelompok logis.
2. Similarity (Kemiripan): Objek dengan warna, bentuk, atau ukuran yang sama dianggap memiliki fungsi yang sama.
3. Enclosure (Pengurungan): Elemen yang dibatasi oleh batas atau bayangan visual dianggap sebagai satu kesatuan kategori terpisah.

Edward Tufte, pelopor visualisasi data modern dari Universitas Yale, memperkenalkan konsep 'Data-Ink Ratio'—proporsi tinta (atau piksel digital) yang digunakan untuk menampilkan data aktual dibandingkan dengan total tinta yang digunakan untuk keseluruhan grafik. Desain yang unggul memaksimalkan Data-Ink Ratio dengan memangkas 'Chartjunk' (dekorasi 3D berlebih, garis kisi-kisi tebal yang mengganggu, bayangan latar belakang, dan legenda redundan).`,
        formula: `\\text{Data-Ink Ratio} = \\frac{\\text{Data-Ink (Tinta untuk Data)}}{\\text{Total Ink (Total Tinta Grafik)}}`,
        code: `# 6.1: Menghitung Data-Ink Ratio dan Prinsip Minimalisme Grafis
import pandas as pd

# Konseptualisasi audit elemen grafis Tufte pada grafik batang
elemen_grafik = pd.DataFrame({
    'Komponen': ['Batang Data Kategori', 'Label Sumbu Nilai', 'Garis Kisi-kisi Tebal (Grid)', 'Efek 3D / Bayangan', 'Border Bingkai Luar'],
    'Kategori_Tinta': ['Data-Ink', 'Data-Ink', 'Chartjunk', 'Chartjunk', 'Chartjunk'],
    'Piksel_Relatif': [650, 150, 120, 80, 50]
})

total_piksel = elemen_grafik['Piksel_Relatif'].sum()
data_ink = elemen_grafik[elemen_grafik['Kategori_Tinta'] == 'Data-Ink']['Piksel_Relatif'].sum()
ratio_awal = data_ink / total_piksel

# Optimasi: Menghapus seluruh elemen Chartjunk
piksel_optimal = data_ink
ratio_optimal = 1.0

print("=== AUDIT DATA-INK RATIO (EDWARD TUFTE) ===")
print(elemen_grafik.to_string(index=False))
print(f"\\nData-Ink Ratio Awal    : {ratio_awal:.2f} ({ratio_awal*100:.1f}%)")
print(f"Data-Ink Ratio Optimal : {ratio_optimal:.2f} (100.0% Bebas Chartjunk)")`,
        expectedOutput: "Audit menunjukkan eliminasi chartjunk menaikkan Data-Ink ratio dari 76% ke 100%.",
        codeExp: "Skrip menguantifikasi teori Data-Ink Ratio Edward Tufte secara matematis, mengidentifikasi elemen dekoratif yang menambah beban kognitif (cognitive load) audiens tanpa memberikan nilai analitik.",
        pitfalls: [
          "Menambahkan efek 3D pada grafik batang atau pie chart, yang membiaskan perspektif geometris dan menyulitkan perbandingan proporsi data.",
          "Menggunakan garis batas (border) tebal dan warna latar belakang kontras tinggi yang bersaing dengan warna data aktual."
        ],
        refTitle: "Edward Tufte: The Visual Display of Quantitative Information",
        refUrl: "https://www.edwardtufte.com/tufte/books_vdqi"
      },
      {
        num: "6.2",
        slug: "6-2-arsitektur-object-oriented-matplotlib-figure-axes",
        title: "6.2. Arsitektur Object-Oriented Matplotlib: Figure, Axes & Kanvas",
        desc: "Arsitektur kanvas visualisasi Python: perbedaan antarmuka pyplot state-based vs pendekatan Object-Oriented (fig, ax), tata letak multi-panel (subplots, GridSpec), dan kontrol resolusi DPI.",
        concept: `Matplotlib adalah pustaka visualisasi data paling fundamental di ekosistem Python yang menjadi fondasi bagi Seaborn, Pandas plotting, dan banyak alat visualisasi lainnya. Kesalahan paling umum bagi praktisi adalah mencampuradukkan dua antarmuka pemrograman yang sangat berbeda: antarmuka 'pyplot' (state-based ala MATLAB) dan antarmuka 'Object-Oriented' (OO).

Antarmuka pyplot (seperti plt.plot()) menyimpan status grafik saat ini secara implisit di memori global, yang mudah rusak saat membuat grafik multi-panel yang rumit. Sebaliknya, pendekatan Object-Oriented secara eksplisit memisahkan antara objek Figure (kanvas utama tempat seluruh elemen ditarik) dan objek Axes (area koordinat individual tempat data diplot).

Dengan sintaks fig, ax = plt.subplots(), analis memegang kendali penuh atas setiap sumbu, label, batas rentang, penanda tik (ticks), dan penataan sub-grafik berdampingan (side-by-side plots) menggunakan GridSpec untuk tata letak asimetris yang canggih.`,
        code: `# 6.2: Arsitektur Object-Oriented Matplotlib Multi-Panel
import matplotlib.pyplot as plt
import numpy as np

# Inisialisasi Figure dan sepasang Axes berdampingan secara Object-Oriented
fig, (ax1, ax2) = plt.subplots(nrows=1, ncols=2, figsize=(10, 4), dpi=100)

x = np.linspace(0, 10, 100)
y_trend = 2.5 * x + np.random.normal(0, 2, 100)
y_volatilitas = np.sin(x) * 10

# Plot pada panel pertama (Sumbu Scatter)
ax1.scatter(x, y_trend, color='#2563EB', alpha=0.6, edgecolors='none')
ax1.set_title("Pertumbuhan Tren Penjualan", fontsize=11, fontweight='bold')
ax1.set_xlabel("Bulan Operasional")
ax1.set_ylabel("Omzet (Juta Rp)")
ax1.spines['top'].set_visible(False)
ax1.spines['right'].set_visible(False)

# Plot pada panel kedua (Sumbu Line)
ax2.plot(x, y_volatilitas, color='#DC2626', linewidth=2)
ax2.set_title("Fluktuasi Siklikal Musiman", fontsize=11, fontweight='bold')
ax2.set_xlabel("Bulan Operasional")
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)

plt.tight_layout()
print("=== OBJEK GRAFIK MATPLOTLIB OBJECT-ORIENTED ===")
print(f"Tipe Objek Kanvas: {type(fig)}")
print(f"Tipe Objek Sumbu : {type(ax1)}, {type(ax2)}")
plt.close(fig)`,
        expectedOutput: "Objek Figure dan Axes berhasil diinisialisasi dan dikonfigurasi secara independen.",
        codeExp: "Skrip mendemonstrasikan pola OO kanonikal: membuat kanvas multi-panel menggunakan plt.subplots() dan memodifikasi properti tiap sumbu (ax1, ax2) secara terisolasi tanpa saling menimpa status global.",
        pitfalls: [
          "Menggunakan perintah plt.xlabel() atau plt.title() di tengah-tengah pembuatan multi-subplot yang menyebabkan label salah sasaran ke plot terakhir yang aktif.",
          "Lupa menutup figure (plt.close(fig)) saat menghasilkan grafik dalam jumlah besar di skrip otomatis, yang menyebabkan kebocoran memori RAM."
        ],
        refTitle: "Matplotlib Documentation: Coding Styles & The Object-Oriented Interface",
        refUrl: "https://matplotlib.org/stable/tutorials/exploratory/lifecycle.html"
      },
      {
        num: "6.3",
        slug: "6-3-visualisasi-distribusi-ketidakpastian-seaborn",
        title: "6.3. Visualisasi Distribusi & Ketidakpastian dengan Seaborn",
        desc: "Grafik statistik tingkat lanjut: estimasi interval kepercayaan (bootstrap confidence interval), regresi linear bivariat (regplot), histogram KDE multivariat, dan Violin Plot.",
        concept: `Seaborn dibangun di atas Matplotlib dengan integrasi erat terhadap struktur data Pandas DataFrame. Keunggulan utama Seaborn adalah kemampuannya memetakan variabel kategorik dan numerik secara langsung ke atribut estetika (warna hue, gaya garis style, ukuran size) serta melakukan kalkulasi statistik otomatis di balik layar.

Salah satu fitur paling kuat dari Seaborn adalah visualisasi ketidakpastian statistik. Saat menggambar grafik garis atau grafik batang agregat, Seaborn secara otomatis menghitung Interval Kepercayaan 95% (95% Confidence Interval) menggunakan teknik bootstrap resampling non-parametrik.

Selain itu, grafik seperti Violin Plot menggabungkan keunggulan Box Plot (menampilkan kuartil dan median) dengan Kurva Estimasi Densitas Kernel (KDE) simetris di kedua sisinya. Hal ini memungkinkan analis mendeteksi distribusi bimodal (dua kelompok populasi berbeda di dalam satu kategori) yang seringkali luput dari pandangan jika hanya menggunakan Box Plot standar.`,
        code: `# 6.3: Konstruksi Metrik Statistik dan Konseptualisasi Violin Plot
import pandas as pd
import numpy as np

# Mensimulasikan dataset bimodal gaji berdasarkan gender dan divisi
np.random.seed(42)
gaji_junior = np.random.normal(8000000, 1000000, 100)
gaji_senior = np.random.normal(25000000, 3000000, 100)
gaji_gabungan = np.concatenate([gaji_junior, gaji_senior])

df_gaji = pd.DataFrame({
    'Divisi': ['Teknologi'] * 200,
    'Gaji': gaji_gabungan,
    'Level': ['Junior'] * 100 + ['Senior'] * 100
})

# Analisis statistik deskriptif untuk mendeteksi bimodality
mean_val = df_gaji['Gaji'].mean()
median_val = df_gaji['Gaji'].median()
std_val = df_gaji['Gaji'].std()

print("=== STATISTIK DISTRIBUSI GAJI BIMODAL ===")
print(f"Rata-rata Gaji : Rp {mean_val:,.0f}")
print(f"Median Gaji    : Rp {median_val:,.0f}")
print(f"Standar Deviasi: Rp {std_val:,.0f}")
print("\\nObservasi Distribusi:")
print(df_gaji.groupby('Level')['Gaji'].agg(['count', 'mean', 'std']).round(0))`,
        expectedOutput: "Statistik mendeteksi deviasi standar yang sangat lebar akibat distribusi bimodal dua level.",
        codeExp: "Skrip memodelkan data dengan dua puncak sebaran (bimodal). Pemahaman statistik ini menjadi dasar mengapa visualisasi Violin Plot lebih diutamakan daripada grafik batang sederhana yang hanya menampilkan satu rata-rata tunggal.",
        pitfalls: [
          "Menampilkan grafik batang (bar chart) dengan error bar kecil untuk data yang berdistribusi tidak normal atau bimodal, yang memberikan ilusi kepastian palsu pada audiens.",
          "Menghitung bootstrap interval kepercayaan pada dataset dengan ukuran sampel sangat kecil (< 15 observasi) tanpa peringatan ketidakpastian yang memadai."
        ],
        refTitle: "Seaborn Documentation: Statistical estimation and error bars",
        refUrl: "https://seaborn.pydata.org/tutorial/error_bars.html"
      },
      {
        num: "6.4",
        slug: "6-4-visualisasi-komposisi-proporsi-hierarki-treemap",
        title: "6.4. Visualisasi Komposisi, Proporsi & Hubungan Hierarkis (Treemap, Sunburst)",
        desc: "Penyajian struktur bagian-ke-keseluruhan: kelemahan kritis Pie Chart, alternatif Donut Chart beranotasi, Treemap untuk struktur pohon proporsional, dan Sunburst Chart.",
        concept: `Menampilkan proporsi bagian terhadap keseluruhan (Part-to-Whole Relationships) adalah tugas umum analis data. Sayangnya, grafik lingkaran (Pie Chart) adalah jenis grafik yang paling sering disalahgunakan di dunia bisnis.

Secara fisiologis, mata dan korteks visual manusia sangat buruk dalam membedakan sudut (angle) dan luas area lengkung 2D dibandingkan dengan membandingkan panjang garis lurus pada sumbu bersama. Ketika Pie Chart memiliki lebih dari 4 atau 5 irisan, atau ketika perbedaan antar irisan sangat tipis, audiens tidak dapat menentukan urutan besaran data secara akurat.

Untuk data kategorikal proporsional sederhana, Bar Chart horizontal terurut atau Donut Chart dengan persentase di tengah jauh lebih unggul. Untuk data hierarkis bersarang (seperti Pengeluaran Departemen -> Divisi -> Proyek), Treemap menggunakan persegi panjang bertingkat yang mengisi ruang secara optimal dan memungkinkan perbandingan proporsi multi-level secara intuitif.`,
        code: `# 6.4: Dekomposisi Proporsi dan Perbandingan Luas Treemap
import pandas as pd

# Data alokasi anggaran belanja operasional perusahaan
anggaran = pd.DataFrame({
    'Departemen': ['Engineering', 'Marketing', 'Operasional', 'Sales', 'HR & Legal'],
    'Alokasi_Juta': [450, 320, 210, 180, 90]
})

total_anggaran = anggaran['Alokasi_Juta'].sum()
anggaran['Pangsa_Pasar_Pct'] = (anggaran['Alokasi_Juta'] / total_anggaran * 100).round(1)
anggaran['Sudut_Pie_Derajat'] = (anggaran['Pangsa_Pasar_Pct'] * 3.6).round(1)

# Mengurutkan dari kontribusi terbesar
anggaran = anggaran.sort_values(by='Alokasi_Juta', ascending=False)

print("=== DISTRIBUSI ANGGARAN: PANGSA PERSENTASE VS SUDUT BUSUR ===")
print(anggaran.to_string(index=False))`,
        expectedOutput: "Tabel proporsi alokasi anggaran dan padanan sudut geometris terhitung akurat.",
        codeExp: "Skrip menghitung konversi pangsa anggaran ke dalam persentase matematis dan sudut derajat busur lingkaran, memperlihatkan perbedaan tipis sudut antar kategori yang menyulitkan persepsi mata manusia jika dirender dalam Pie Chart.",
        pitfalls: [
          "Membuat Pie Chart dengan lebih dari 7 irisan kategori, yang memaksa penggunaan warna-warni acak dan legenda yang membingungkan.",
          "Menggunakan grafik lingkaran berputar (Exploded 3D Pie Chart) yang secara sengaja membesarkan irisan depan akibat distorsi sudut perspektif kamera."
        ],
        refTitle: "Storytelling with Data: The problem with pie charts",
        refUrl: "https://www.storytellingwithdata.com/blog/2020/5/14/what-is-a-pie-chart"
      },
      {
        num: "6.5",
        slug: "6-5-desain-visualisasi-perbandingan-bar-lollipop-slope",
        title: "6.5. Desain Visualisasi Perbandingan Kategori: Bar Chart, Lollipop & Slope Chart",
        desc: "Grafik komparatif kategori performa tinggi: Bar Chart horizontal untuk label panjang, Lollipop Chart untuk menghemat tinta, dan Slope Chart untuk perbandingan sebelum-sesudah.",
        concept: `Perbandingan antar entitas diskrit (produk, wilayah, kuartal, staf) adalah inti dari pelaporan bisnis. Memilih variasi grafik batang yang tepat dapat meningkatkan keterbacaan laporan secara dramatis.

Grafik batang vertikal seringkali mengalami masalah keterbacaan ketika label kategori cukup panjang (misalnya nama cabang 'Kota Tangerang Selatan'), memaksa analis memutar teks label 45 atau 90 derajat yang menyiksa leher pembaca. Solusi profesional adalah beralih ke Bar Chart Horizontal, di mana label teks dibaca secara alami dari kiri ke kanan.

Lollipop Chart (kombinasi garis tipis dengan lingkaran penanda di ujungnya) mempertahankan akurasi titik data tetapi mengurangi bobot visual yang berat dari batang tebal, sangat ideal untuk membandingkan 20 hingga 50 kategori. Sementara itu, Slope Chart menggunakan dua garis vertikal terhubung untuk membandingkan posisi atau peringkat entitas sebelum dan sesudah intervensi (Before vs After).`,
        code: `# 6.5: Komparasi Kinerja Sebelum-Sesudah (Slope Chart Metrics)
import pandas as pd

# Data skor kepuasan pelanggan sebelum dan sesudah peluncuran fitur baru
fitur_data = pd.DataFrame({
    'Modul_Aplikasi': ['Pencarian Produk', 'Checkout Pembayaran', 'Pelacakan Pengiriman', 'Layanan Pelanggan'],
    'Skor_Sebelum': [68, 72, 55, 80],
    'Skor_Sesudah': [84, 89, 78, 81]
})

fitur_data['Delta_Peningkatan'] = fitur_data['Skor_Sesudah'] - fitur_data['Skor_Sebelum']
fitur_data['Pertumbuhan_Pct'] = (
    (fitur_data['Delta_Peningkatan'] / fitur_data['Skor_Sebelum']) * 100
).round(1)

# Mengurutkan berdasarkan dampak pertumbuhan terbesar
fitur_data = fitur_data.sort_values(by='Delta_Peningkatan', ascending=False)

print("=== ANALISIS DELTA PERUBAHAN PERIODE (DASAR SLOPE CHART) ===")
print(fitur_data.to_string(index=False))`,
        expectedOutput: "Matriks perubahan skor sebelum dan sesudah terurut berdasarkan delta peningkatan.",
        codeExp: "Skrip menghitung selisih absolut dan persentase kenaikan metrik sebelum dan sesudah pembaruan sistem, menyediakan struktur data siap pakai untuk rendering grafik garis miring (Slope Chart).",
        pitfalls: [
          "Memotong sumbu dasar (baseline) Bar Chart tidak dari nol (zero-origin baseline), yang membesar-besarkan perbedaan kecil secara menyesatkan.",
          "Tidak mengurutkan kategori berdasarkan nilai metrik (dibiarkan alfabetis acak), memaksa audiens memindai bolak-balik untuk menemukan item terbaik dan terburuk."
        ],
        refTitle: "Claus O. Wilke: Fundamentals of Data Visualization",
        refUrl: "https://clauswilke.com/dataviz/"
      },
      {
        num: "6.6",
        slug: "6-6-visualisasi-geospasial-pemetaan-choropleth",
        title: "6.6. Visualisasi Geospasial & Pemetaan Choropleth",
        desc: "Analisis data spasial: format GeoJSON, peta tematik Choropleth, normalisasi kepadatan per kapita untuk menghindari distorsi luas wilayah geografis.",
        concept: `Data bisnis seringkali memiliki komponen lokasi geografis (negara, provinsi, kota, kode pos). Menyajikan data wilayah pada peta geografis memungkinkan identifikasi klaster regional, rute distribusi logistik, dan penetrasi pasar lokal secara visual.

Peta Choropleth mewarnai area geografis administratif berdasarkan nilai variabel kuantitatif (misalnya tingkat pengangguran atau penetrasi internet). Namun, peta Choropleth membawa bahaya kognitif serius: area geografis yang sangat luas secara fisik (seperti wilayah pedalaman atau hutan) menarik perhatian visual paling dominan, padahal populasi penduduk atau kontribusi ekonominya mungkin sangat kecil.

Oleh karena itu, visualisasi geospasial yang bertanggung jawab selalu menormalkan metrik terhadap populasi (misalnya Penjualan per 10.000 Penduduk, bukan Penjualan Absolut). Alternatif lain adalah menggunakan Cartogram atau Bubble Map berbasis koordinat lintang-bujur (Latitude/Longitude) di mana ukuran lingkaran merepresentasikan bobot metrik sebenarnya.`,
        code: `# 6.6: Normalisasi Metrik Wilayah untuk Mencegah Bias Geografis
import pandas as pd

wilayah_data = pd.DataFrame({
    'Provinsi': ['DKI Jakarta', 'Jawa Barat', 'Kalimantan Timur', 'Papua Barat'],
    'Total_Omzet_Miliar': [150, 180, 75, 25],
    'Populasi_Juta': [10.5, 48.0, 3.8, 1.1],
    'Luas_Wilayah_Km2': [661, 35377, 127346, 64138]
})

# Menghitung metrik mentah vs metrik dinormalisasi per kapita
wilayah_data['Omzet_Per_Kapita_Ribu'] = (
    (wilayah_data['Total_Omzet_Miliar'] * 1000000000) / (wilayah_data['Populasi_Juta'] * 1000000) / 1000
).round(1)

wilayah_data['Kerapatan_Omzet_Per_Km2'] = (
    (wilayah_data['Total_Omzet_Miliar'] * 1000) / wilayah_data['Luas_Wilayah_Km2']
).round(2)

print("=== DISTRIBUSI OMZET MENTAH VS NORMALISASI PER KAPITA ===")
print(wilayah_data[['Provinsi', 'Total_Omzet_Miliar', 'Omzet_Per_Kapita_Ribu', 'Kerapatan_Omzet_Per_Km2']])`,
        expectedOutput: "Data memperlihatkan DKI Jakarta memiliki omzet per kapita dan kerapatan tertinggi meskipun luas wilayahnya paling kecil.",
        codeExp: "Skrip menunjukkan proses normalisasi spasial: omzet total absolut Jawa Barat lebih tinggi dari Jakarta, namun normalisasi per kapita dan per luas wilayah membuktikan produktivitas Jakarta jauh lebih superior.",
        pitfalls: [
          "Mewarnai peta Choropleth dengan angka total agregat tanpa normalisasi populasi, yang pada dasarnya hanya memetakan di mana orang tinggal (Peta Kepadatan Penduduk).",
          "Menggunakan proyeksi peta bumi datar (seperti Mercator standar) yang mendistorsi proporsi luas wilayah kutub secara berlebihan."
        ],
        refTitle: "GeoPandas Documentation: Mapping and Plotting Tools",
        refUrl: "https://geopandas.org/en/stable/docs/user_guide/mapping.html"
      },
      {
        num: "6.7",
        slug: "6-7-kustomisasi-tipografi-palet-aksesibel-colorblind",
        title: "6.7. Kustomisasi Tipografi, Palet Warna Aksesibel (Colorblind-Friendly)",
        desc: "Desain visual inklusif: psikologi warna, palet perseptual seragam (Viridis, ColorBrewer), aksesibilitas buta warna (Deuteranopia), hierarki tipografi sans-serif.",
        concept: `Sekitar 8% pria dan 0.5% wanita di dunia mengalami defisiensi penglihatan warna (Color Vision Deficiency / buta warna), terutama Deuteranopia dan Protanopia (kesulitan membedakan warna merah dan hijau). Menggunakan kombinasi merah-hijau untuk menandai 'buruk vs baik' pada dasbor perusahaan berisiko membuat visualisasi tidak terbaca oleh sebagian pemangku kepentingan.

Praktisi data modern menggunakan palet warna yang seragam secara perseptual (Perceptually Uniform Color Maps) seperti Viridis, Cividis, atau palet yang telah diuji secara ilmiah oleh ColorBrewer. Palet ini mempertahankan gradasi terang-gelap yang konsisten bahkan jika dicetak dalam format hitam-putih.

Tipografi juga memainkan peran penting dalam menciptakan hierarki informasi. Font sans-serif yang bersih (seperti Inter, Roboto, atau Arial) dengan kontras bobot (Bold untuk judul utama, Regular untuk label sumbu, Light untuk anotasi sekunder) memastikan mata pembaca dipandu secara alami menyusuri cerita data.`,
        code: `# 6.7: Definisi Palet Aksesibel dan Uji Kontras Tipografi
import pandas as pd

# Matriks palet warna aman buta warna (Colorblind-Friendly Hex Palette)
palet_aksesibel = {
    'Nama_Warna': ['Biru Primer', 'Oranye Aksen', 'Teal Netral', 'Kuning Sorotan', 'Abu-abu Latar'],
    'Hex_Code': ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#7F7F7F'],
    'Peruntukan': ['Data Kategori Utama', 'Kategori Pembanding', 'Garis Tren Positif', 'Penanda Peringatan', 'Garis Kisi / Label'],
    'Luminansi_Relatif': [0.21, 0.38, 0.29, 0.18, 0.25]
}

df_palet = pd.DataFrame(palet_aksesibel)
print("=== SPESIFIKASI PALET WARNA AKSESIBEL EKSEKUTIF ===")
print(df_palet.to_string(index=False))`,
        expectedOutput: "Daftar palet warna dengan kode hex dan peruntukan fungsi visual tercetak rapi.",
        codeExp: "Skrip merumuskan palet warna kontras tinggi yang ramah aksesibilitas, menghindari ketergantungan pada pasangan merah-hijau tradisional guna menjamin inklusivitas pemangku kepentingan bisnis.",
        pitfalls: [
          "Mengandalkan warna pelangi (Rainbow / Jet Colormap) yang memiliki lonjakan persepsi luminansi tajam sehingga menciptakan batas semu di tempat yang tidak ada datanya.",
          "Menggunakan ukuran font terlalu kecil (< 9pt) pada label sumbu dan legenda yang menyulitkan pembacaan di proyektor rapat."
        ],
        refTitle: "ColorBrewer 2.0: Color Advice for Cartography",
        refUrl: "https://colorbrewer2.org/"
      },
      {
        num: "6.8",
        slug: "6-8-visualisasi-interaktif-declarative-grammar-altair",
        title: "6.8. Visualisasi Interaktif & Declarative Grammar of Graphics",
        desc: "Grammar of Graphics deklaratif: arsitektur Vega-Lite via Altair, interaktivitas berbasis seleksi (brushing and linking), filter dinamis, dan tooltip informatif.",
        concept: `Grafik statis memiliki keterbatasan mendasar saat audiens ingin menyelidiki data lebih dalam (drill-down). Visualisasi interaktif memungkinkan pengguna menyaring variabel secara langsung, menyorot subset observasi, dan melihat detail numerik saat kursor diarahkan ke titik data (tooltip).

Altair adalah pustaka visualisasi deklaratif Python yang mengimplementasikan konsep 'Grammar of Graphics' (Jacques Bertin dan Leland Wilkinson) berbasis spesifikasi Vega-Lite JSON. Berbeda dengan Matplotlib yang bersifat imperatif (memberi tahu komputer 'bagaimana' cara menggambar langkah demi langkah), Altair bersifat deklaratif (memberi tahu komputer 'apa' hubungan antar data dan elemen visual yang diinginkan).

Fitur paling mengesankan dari visualisasi interaktif adalah 'Brushing and Linking'. Saat analis memilih rentang waktu tertentu di grafik bawah dengan kotak seleksi, grafik sebaran di panel atas secara otomatis memperbarui titik-titik data yang sesuai secara real-time.`,
        code: `# 6.8: Konseptualisasi Skema Deklaratif Grammar of Graphics (Vega-Lite Spec)
import json

# Representasi spesifikasi deklaratif Vega-Lite yang mendasari Altair
vega_spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "Grafik Sebaran Interaktif dengan Tooltip dan Seleksi Interval",
    "data": {"url": "data/penjualan.csv"},
    "mark": "point",
    "encoding": {
        "x": {"field": "Biaya_Iklan", "type": "quantitative", "axis": {"title": "Biaya Iklan (Juta)"}},
        "y": {"field": "Pendapatan", "type": "quantitative", "axis": {"title": "Pendapatan (Juta)"}},
        "color": {"field": "Kategori", "type": "nominal"},
        "tooltip": [
            {"field": "Cabang", "type": "nominal"},
            {"field": "Pendapatan", "type": "quantitative", "format": ",.0f"}
        ]
    },
    "selection": {
        "kotak_pilih": {"type": "interval"}
    }
}

print("=== DEKLARASI TATA BAHASA GRAFIS (VEGA-LITE / ALTAIR SPEC) ===")
print(json.dumps(vega_spec, indent=2))`,
        expectedOutput: "Spesifikasi JSON deklaratif Grammar of Graphics Vega-Lite tercetak terstruktur.",
        codeExp: "Skrip menunjukkan bagaimana arsitektur deklaratif memetakan variabel kolom data (x, y, color) ke properti visual dan interaktivitas seleksi (brushing) tanpa perlu mengelola status kanvas secara manual.",
        pitfalls: [
          "Memuat dataset raksasa (> 50.000 titik data) ke dalam visualisasi web interaktif berbasis browser, yang menyebabkan lag dan konsumsi memori browser meledak.",
          "Menambahkan interaktivitas animasi berlebihan yang justru mengalihkan perhatian dari wawasan inti data."
        ],
        refTitle: "Altair: Declarative Statistical Visualization Library for Python",
        refUrl: "https://altair-viz.github.io/"
      },
      {
        num: "6.9",
        slug: "6-9-storytelling-data-anotasi-naratif-contextual-callouts",
        title: "6.9. Storytelling dengan Data: Anotasi Naratif & Contextual Callouts",
        desc: "Transformasi grafik mentah menjadi cerita bisnis: penulisan judul berbasis wawasan aksi (Action Titles), callout anotasi peristiwa historis, dan teknik pengabuan (decluttering).",
        concept: `Grafik tanpa konteks naratif memaksa pembaca menerka-nerka apa yang sedang terjadi. Storytelling dengan data adalah disiplin memandu audiens secara terstruktur melalui visualisasi untuk mengarahkan mereka pada kesimpulan yang tak terelakkan dan memotivasi aksi nyata.

Teknik utama storytelling grafis adalah mengganti 'Judul Deskriptif' dengan 'Action Title'. Alih-alih menulis judul hambar seperti 'Grafik Penjualan Bulanan 2026', analis menuliskan inti pesan: 'Penjualan Q3 Melonjak 42% Didorong Peluncuran Kampanye Digital'.

Elemen pendukung penting lainnya adalah Anotasi Kontekstual (Contextual Callouts). Panah teks kecil yang menunjuk langsung ke titik anomali—misalnya memberi label 'Server Down 6 Jam' pada titik penurunan transaksi—menghilangkan kebingungan manajemen dan langsung menjawab pertanyaan 'mengapa hal tersebut terjadi'. Teknik pewarnaan selektif (menjadikan semua data lain berwarna abu-abu pudar dan hanya memberi warna kontras cerah pada titik fokus) memastikan perhatian audiens tertuju seketika ke wawasan kunci.`,
        code: `# 6.9: Struktur Narasi Data Storytelling (Action Titles & Callouts)
import pandas as pd

timeline_kampanye = pd.DataFrame({
    'Bulan': ['Mei', 'Jun', 'Jul', 'Agu', 'Sep'],
    'Pengunjung_Web': [12000, 13500, 11800, 24500, 23000],
    'Anotasi_Konteks': [
        'Baseline operasional normal',
        'Pertumbuhan organik stabil',
        'Penurunan musiman liburan sekolah',
        'PELUNCURAN FITUR REFERRAL PROGRAM (Lonjakan 107%)',
        'Retensi pengguna baru pasca-kampanye stabil'
    ]
})

print("=== KERANGKA STORYTELLING: NARRATIVE CALLOUTS TIMELINE ===")
for _, row in timeline_kampanye.iterrows():
    fokus = ">>> [FOKUS NARASI]" if "PELUNCURAN" in row['Anotasi_Konteks'] else "    [DATA BANTUAN]"
    print(f"{fokus} {row['Bulan']}: {row['Pengunjung_Web']:,} Pengunjung | {row['Anotasi_Konteks']}")`,
        expectedOutput: "Garis waktu narasi memperlihatkan penekanan fokus pada peluncuran fitur referral di bulan Agustus.",
        codeExp: "Skrip menyusun struktur data berbasis narasi di mana setiap titik observasi dilengkapi konteks kejadian historis bisnis nyata, mengubah deretan angka mentah menjadi alur cerita yang komprehensif.",
        pitfalls: [
          "Membiarkan judul grafik tetap generik sehingga eksekutif harus menghabiskan waktu menganalisis sendiri grafik tersebut.",
          "Menempatkan terlalu banyak anotasi teks di seluruh grafik hingga kanvas menjadi penuh sesak dan tidak terbaca."
        ],
        refTitle: "Cole Nussbaumer Knaflic: Storytelling with Data",
        refUrl: "https://www.storytellingwithdata.com/"
      },
      {
        num: "6.10",
        slug: "6-10-audit-grafis-menghindari-misleading-visuals-skala",
        title: "6.10. Audit Grafis: Menghindari Misleading Visuals & Manipulasi Skala",
        desc: "Integritas etika visualisasi data: deteksi pemotongan sumbu Y (truncated axis), distorsi rasio aspek (Lie Factor), perbandingan volume 3D vs 1D, dan checklist audit visual.",
        concept: `Visualisasi data memegang kekuatan persuasif yang sangat besar. Namun, dengan kekuatan tersebut datang tanggung jawab etika yang serius. Manipulasi visualisasi data—baik disengaja untuk memanipulasi pemegang saham maupun tidak disengaja akibat ketidaktahuan teknis—dapat merusak reputasi analis dan menjerumuskan perusahaan ke keputusan fatal.

Salah satu pelanggaran etika visual paling umum adalah Pemotongan Sumbu Y (Truncated Y-Axis) pada Bar Chart. Memulai sumbu vertikal pada nilai 90 alih-alih 0 pada grafik yang membandingkan nilai 95 dan 98 membuat perbedaan 3% terlihat seperti perbedaan 300%.

Edward Tufte merumuskan metrik 'Lie Factor'—rasio antara ukuran efek yang ditampilkan dalam grafik dibandingkan dengan ukuran efek aktual yang ada dalam data. Grafik yang jujur memiliki Lie Factor bernilai mendekati 1.0. Nilai Lie Factor di atas 1.05 atau di bawah 0.95 mengindikasikan adanya distorsi visual yang menyesatkan audiens.`,
        formula: `\\text{Lie Factor} = \\frac{\\text{Besar Efek pada Grafik (\\%)}}{\\text{Besar Efek Aktual pada Data (\\%)}} = \\frac{\\frac{|g_2 - g_1|}{g_1}}{\\frac{|d_2 - d_1|}{d_1}}`,
        code: `# 6.10: Perhitungan Lie Factor Edward Tufte untuk Audit Etika Grafik
# Skenario: Penjualan naik dari 100 ke 110 unit (Kenaikan Aktual 10%)
d1 = 100.0
d2 = 110.0
efek_data = (d2 - d1) / d1  # 0.10 (10%)

# Pada grafik batang yang sumbu Y-nya dipotong mulai dari 95:
# Tinggi visual batang 1 = 100 - 95 = 5 piksel
# Tinggi visual batang 2 = 110 - 95 = 15 piksel
g1 = 5.0
g2 = 15.0
efek_grafis = (g2 - g1) / g1  # 2.00 (200%)

lie_factor = efek_grafis / efek_data

print("=== AUDIT INTEGRITAS VISUAL: LIE FACTOR EVALUATION ===")
print(f"Kenaikan Aktual Data  : {efek_data*100:.1f}%")
print(f"Kenaikan Visual Grafik : {efek_grafis*100:.1f}%")
print(f"Lie Factor Terhitung   : {lie_factor:.2f}")

if lie_factor > 1.05:
    print("\\n[PERINGATAN AUDIT] Grafik sangat mendistorsi fakta! (Grafik Melebih-lebihkan Kenaikan Sebesar 20x lipat).")
else:
    print("\\n[AUDIT LOLOS] Visualisasi jujur dan proporsional.")`,
        expectedOutput: "Audit mendeteksi Lie Factor 20.00 yang mengonfirmasi adanya distorsi manipulasi sumbu Y.",
        codeExp: "Skrip mengaudit integritas grafis menggunakan formula Lie Factor Tufte, membuktikan secara matematis bahwa memotong sumbu Y dapat menciptakan ilusi visual kenaikan 20 kali lebih besar dari kenyataan lapangan.",
        pitfalls: [
          "Memotong sumbu nol pada grafik batang; jika ingin menyoroti fluktuasi kecil pada rentang sempit, gunakan grafik garis (Line Chart) bukan grafik batang.",
          "Mengubah skala sumbu ganda (Dual Y-Axis) secara sembarangan hingga dua garis tren yang tidak berhubungan tampak berpotongan atau berkorelasi kuat secara palsu."
        ],
        refTitle: "Alberto Cairo: How Charts Lie - Getting Smarter about Visual Information",
        refUrl: "https://albertocairo.com/"
      }
    ]
  }
];
