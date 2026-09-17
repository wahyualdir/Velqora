import { ChapterDef } from "./da-data-ch1-3";

export const CHAPTERS_7_TO_10: ChapterDef[] = [
  // ==========================================
  // BAB 7: Business Intelligence & Dashboard Interaktif (Power BI, Tableau)
  // ==========================================
  {
    orderIndex: 7,
    id: "data-analyst-ch-7",
    slug: "bab-7-business-intelligence-dashboard-interaktif-power-bi-tableau",
    title: "BAB 7: Business Intelligence & Dashboard Interaktif (Power BI, Tableau)",
    desc: "Arsitektur Business Intelligence modern: pemodelan data dimensional (Star & Snowflake Schema), tabel fakta vs dimensi, logika perhitungan DAX, ekspresi Tableau LOD, prinsip UX dashboard eksekutif, dan tata kelola Row-Level Security (RLS).",
    coreConcepts: ["Dimensional Modeling", "Star & Snowflake Schema", "DAX Evaluation Context", "Tableau LOD Expressions", "Dashboard UX", "Enterprise Governance"],
    subchapters: [
      {
        num: "7.1",
        slug: "7-1-fondasi-arsitektur-bi-self-service-analytics",
        title: "7.1. Fondasi Arsitektur Business Intelligence & Self-Service Analytics",
        desc: "Evolusi sistem analitik bisnis: dari sistem operasional OLTP ke sistem analitik OLAP, arsitektur data warehouse modern, dan transisi menuju Self-Service BI.",
        concept: `Business Intelligence (BI) adalah kombinasi arsitektur teknologi, aplikasi, dan metodologi yang mengubah data transaksional mentah menjadi wawasan bermakna yang dapat ditindaklanjuti untuk mendukung pengambilan keputusan bisnis strategis dan taktis.

Perbedaan paling mendasar dalam arsitektur data perusahaan adalah pemisahan antara sistem OLTP (Online Transaction Processing) dan sistem OLAP (Online Analytical Processing). Sistem OLTP (seperti PostgreSQL atau MySQL operasional e-commerce) dioptimalkan untuk kecepatan transaksi baca-tulis atomik berkecepatan tinggi per baris, dengan skema ternormalisasi penuh (3NF) guna mencegah redundansi data. Sebaliknya, menjalankan kueri agregasi laporan tahunan di sistem OLTP akan mengunci tabel dan melumpuhkan operasional bisnis.

Oleh karena itu, sistem OLAP dan Data Warehouse (seperti Snowflake, BigQuery, atau Databricks) dibangun khusus untuk membaca jutaan baris data sekaligus secara berbasis kolom (columnar storage). Dalam ekosistem ini, platform Self-Service BI modern (seperti Microsoft Power BI dan Tableau) memberdayakan pengguna bisnis non-teknis untuk mengeksplorasi metrik dan membangun visualisasi mereka sendiri di atas Semantic Data Layer yang telah diaudit oleh tim analitik.`,
        code: `# 7.1: Perbandingan Performa Simulasi Beban Baca Agregat OLAP vs OLTP
import pandas as pd
import numpy as np
import time

# Mensimulasikan data log transaksi berjumlah 1.000.000 observasi
n = 1000000
np.random.seed(42)
transaksi = pd.DataFrame({
    'user_id': np.random.randint(1000, 50000, n),
    'kategori_id': np.random.choice(['KAT-A', 'KAT-B', 'KAT-C', 'KAT-D'], n),
    'nominal': np.random.uniform(50000, 2000000, n)
})

# Simulasi komputasi agregasi berbasis kolom (OLAP-style vectorization)
t0 = time.perf_counter()
agregat_olap = transaksi.groupby('kategori_id')['nominal'].agg(['count', 'sum', 'mean'])
durasi_olap = time.perf_counter() - t0

print("=== EFISIENSI AGREGASI DATA DIMENSIONAL (OLAP STYLE) ===")
print(f"Total Baris Diproses : {n:,} observasi")
print(f"Waktu Eksekusi       : {durasi_olap*1000:.2f} ms")
print("\\nHasil Agregat Metrik Bisnis:")
print(agregat_olap.round(2))`,
        expectedOutput: "Agregasi 1.000.000 baris selesai dalam hitungan puluhan milidetik secara tervektorisasi.",
        codeExp: "Skrip mendemonstrasikan bagaimana agregasi berbasis kolom ala mesin OLAP mampu memproses satu juta observasi transaksi bisnis dalam sepersekian detik, mendasari kecepatan interaktivitas dashboard analitik modern.",
        pitfalls: [
          "Mengarahkan dashboard BI publik langsung ke database OLTP operasional utama perusahaan tanpa lapisan replikasi atau data warehouse.",
          "Menerapkan Self-Service BI tanpa mendefinisikan Single Source of Truth untuk rumus metrik kunci, yang menyebabkan perbedaan angka antar departemen."
        ],
        refTitle: "Microsoft Learn: Power BI Architecture & Semantic Models",
        refUrl: "https://learn.microsoft.com/en-us/power-bi/guidance/"
      },
      {
        num: "7.2",
        slug: "7-2-pemodelan-data-relasional-star-vs-snowflake-schema",
        title: "7.2. Pemodelan Data Relasional: Skema Star vs Snowflake",
        desc: "Desain pemodelan dimensional Ralph Kimball: struktur Skema Bintang (Star Schema), Skema Kepingan Salju (Snowflake Schema), dan dampaknya pada efisiensi kueri BI.",
        concept: `Pemodelan dimensional yang dipelopori oleh Ralph Kimball merupakan standar emas desain data warehouse dan model semantik Power BI. Berbeda dengan normalisasi relasional Edgar F. Codd yang memecah data menjadi belasan tabel kecil terhubung, pemodelan dimensional sengaja melakukan denormalisasi terkontrol demi mengoptimalkan kecepatan pembacaan kueri analitik.

Dua arsitektur utama pemodelan dimensional adalah Skema Bintang (Star Schema) dan Skema Kepingan Salju (Snowflake Schema):
1. Star Schema: Terdiri dari satu Tabel Fakta di tengah yang dikelilingi langsung oleh Tabel-Tabel Dimensi secara terisolasi (relasi 1-to-many langsung). Star schema adalah arsitektur paling disukai oleh mesin komputasi Power BI VertiPaq karena meminimalkan jumlah relasi join dan memaksimalkan kompresi memori.
2. Snowflake Schema: Tabel-tabel dimensi dipecah lebih lanjut ke dalam hierarki sub-dimensi yang ternormalisasi (misal: Produk -> Subkategori -> Kategori). Meskipun menghemat sedikit ruang disk pada sistem lama, Snowflake schema memperlambat performa kueri analitik karena mesin database harus melintasi rantai join bertingkat.`,
        code: `# 7.2: Pemetaan Struktur Relasi Star Schema dalam Pandas
import pandas as pd

# 1. Tabel Dimensi Pelanggan (dim_customer)
dim_customer = pd.DataFrame({
    'customer_key': [1, 2, 3],
    'nama': ['Budi', 'Siti', 'Agus'],
    'kota': ['Jakarta', 'Surabaya', 'Bandung']
})

# 2. Tabel Dimensi Produk (dim_product)
dim_product = pd.DataFrame({
    'product_key': [101, 102],
    'nama_produk': ['Laptop Pro', 'Mouse Wireless'],
    'kategori': ['Hardware', 'Aksesoris']
})

# 3. Tabel Fakta Penjualan (fact_sales) dengan Foreign Keys
fact_sales = pd.DataFrame({
    'sales_id': [1001, 1002, 1003],
    'customer_key': [1, 2, 1],
    'product_key': [101, 102, 102],
    'qty': [1, 2, 1],
    'pendapatan': [15000000, 500000, 250000]
})

# Kueri Star Schema: Penggabungan fakta ke dimensi
star_query = fact_sales.merge(dim_customer, on='customer_key').merge(dim_product, on='product_key')
laporan = star_query.groupby(['kota', 'kategori'])['pendapatan'].sum().reset_index()

print("=== LAPORAN MULTI-DIMENSI STAR SCHEMA ===")
print(laporan)`,
        expectedOutput: "Laporan gabungan fakta-dimensi tersaji rapi berdasarkan kota dan kategori produk.",
        codeExp: "Skrip merepresentasikan arsitektur Star Schema di mana tabel transaksi fakta (fact_sales) merujuk langsung ke tabel dimensi melalui primary-foreign key tunggal tanpa join rantai bersarang.",
        pitfalls: [
          "Membangun skema relasional di Power BI dengan banyak hubungan Many-to-Many atau relasi dua arah (Bi-directional cross-filtering), yang menyebabkan ambiguitas jalur evaluasi dan hasil perhitungan salah.",
          "Mencampurkan metrik fakta numerik (seperti nominal pendapatan) ke dalam tabel dimensi deskriptif."
        ],
        refTitle: "Ralph Kimball: The Data Warehouse Toolkit",
        refUrl: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling/"
      },
      {
        num: "7.3",
        slug: "7-3-konsep-tabel-fakta-tabel-dimensi-granularitas-grain",
        title: "7.3. Konsep Tabel Fakta, Tabel Dimensi & Tingkat Granularitas (Grain)",
        desc: "Komponen inti data warehouse: klasifikasi fakta (transaksional, snapshot periodik, akumulasi snapshot), atribut dimensi, dan penentuan Grain data secara presisi.",
        concept: `Keputusan paling kritis dalam merancang sistem analitik adalah menentukan 'Grain' (Tingkat Butiran / Granularitas) dari tabel fakta. Grain mendefinisikan apa yang direpresentasikan oleh tepat satu baris tunggal dalam tabel fakta.

Sebagai contoh, apakah satu baris dalam fact_sales merepresentasikan: satu transaksi belanja pelanggan secara keseluruhan (Header Level), satu jenis barang individual di dalam struk belanja (Line Item Level), atau ringkasan penjualan harian per cabang (Daily Aggregated Level)?

Menentukan grain pada tingkat paling mendalam (Atomic Grain—seperti Line Item Level) memberikan fleksibilitas maksimal bagi analis untuk membedah data hingga rincian terkecil. Sebaliknya, memilih grain yang terlalu tinggi membatasi kemampuan eksplorasi bisnis dan tidak dapat dipecah kembali setelah data disimpan.

Tabel dimensi menyimpan konteks deskriptif (Siapa, Apa, Di mana, Kapan, Mengapa) yang digunakan untuk memfilter, mengelompokkan, dan memberi label pada metrik kuantitatif di tabel fakta.`,
        code: `# 7.3: Transformasi Granularitas: Line-Item Grain ke Header-Level Grain
import pandas as pd

# Tabel Fakta pada Tingkat Atomic Grain (Line Item per Barang)
fact_order_items = pd.DataFrame({
    'order_id': ['TRX-01', 'TRX-01', 'TRX-02', 'TRX-03', 'TRX-03'],
    'item_seq': [1, 2, 1, 1, 2],
    'sku': ['SKU-A', 'SKU-B', 'SKU-A', 'SKU-C', 'SKU-D'],
    'subtotal': [150000, 75000, 150000, 300000, 50000],
    'diskon': [0, 5000, 0, 25000, 0]
})

# Mengubah Grain ke Header Level (1 Baris = 1 Transaksi)
fact_orders_header = fact_order_items.groupby('order_id').agg(
    total_item=('item_seq', 'count'),
    gross_revenue=('subtotal', 'sum'),
    total_diskon=('diskon', 'sum')
).reset_index()
fact_orders_header['net_revenue'] = fact_orders_header['gross_revenue'] - fact_orders_header['total_diskon']

print("=== DATA ATOMIC GRAIN (LINE ITEM) ===")
print(fact_order_items)
print("\\n=== DATA GRAIN TERTINGGI (ORDER HEADER GRAIN) ===")
print(fact_orders_header)`,
        expectedOutput: "Data atomic line item berhasil diagregasi ke tingkat header pesanan dengan metrik net revenue.",
        codeExp: "Skrip memperlihatkan perpindahan tingkat granularitas data: bagaimana rincian barang per baris dipadatkan menjadi ringkasan transaksi pesanan tunggal melalui agregasi terencana.",
        pitfalls: [
          "Mencampurkan baris dengan granularitas berbeda di dalam satu tabel fakta yang sama (misal ada baris pesanan harian dan ada baris target bulanan), yang memicu penghitungan ganda (double-counting).",
          "Gagal mendokumentasikan grain tabel secara tertulis di kamus data, sehingga analis lain salah menafsirkan arti satu baris data."
        ],
        refTitle: "Kimball Group: Fundamental Grains in Dimensional Data Warehouses",
        refUrl: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling/grain/"
      },
      {
        num: "7.4",
        slug: "7-4-pengenalan-bahasa-analitik-dax-calculated-columns",
        title: "7.4. Pengenalan Bahasa Analitik DAX (Data Analysis Expressions) & Calculated Columns",
        desc: "Bahasa formula Power BI: sintaks dasar DAX, perbedaan kritis antara Calculated Column (evaluasi baris) dan Measure (evaluasi dinamis agregat), serta fungsi dasar SUM, DIVIDE, RELATED.",
        concept: `Data Analysis Expressions (DAX) adalah bahasa formula fungsional yang dikembangkan oleh Microsoft untuk Power BI, Analysis Services, dan Power Pivot di Excel. DAX dirancang khusus untuk memanipulasi data relasional tabular dan melakukan perhitungan analitik dinamis.

Dilema paling sering dihadapi pemula dalam Power BI adalah memilih antara membuat 'Calculated Column' atau 'Measure':
1. Calculated Column: Dihitung saat proses penyegaran data (refresh) baris demi baris, disimpan secara fisik di dalam memori RAM komputer, dan menambah ukuran berkas model data. Calculated Column hanya boleh dibuat jika nilainya akan digunakan sebagai Slicer atau Label Kategori pada sumbu grafik.
2. Measure: Tidak memakan ruang memori disk sama sekali karena tidak menyimpan data statis. Measure dihitung secara dinamis saat pengguna berinteraksi dengan dashboard (mengklik filter, mengubah tanggal, atau menyorot wilayah).

Fungsi DIVIDE(pembilang, penyebut, [alternatif]) adalah praktik wajib dalam DAX untuk mencegah galat fatal pembagian dengan nol (Divide-by-Zero error).`,
        code: `# 7.4: Simulasi Logika Komputasi DAX Measure vs Calculated Column
import pandas as pd

# Simulasi tabel penjualan di Power BI
penjualan = pd.DataFrame({
    'unit_terjual': [10, 0, 25, 40],
    'harga_satuan': [50000, 75000, 30000, 20000],
    'modal_satuan': [35000, 50000, 22000, 15000]
})

# 1. Simulasi Calculated Column (Dievaluasi per baris statis)
penjualan['Omzet_Row'] = penjualan['unit_terjual'] * penjualan['harga_satuan']
penjualan['Laba_Row'] = (penjualan['harga_satuan'] - penjualan['modal_satuan']) * penjualan['unit_terjual']

# 2. Simulasi DAX Measure: Margin Laba (%) = DIVIDE(SUM(Laba), SUM(Omzet), 0)
def dax_measure_margin_laba(df):
    total_laba = df['Laba_Row'].sum()
    total_omzet = df['Omzet_Row'].sum()
    if total_omzet == 0:
        return 0.0
    return (total_laba / total_omzet) * 100

margin_keseluruhan = dax_measure_margin_laba(penjualan)

print("=== TABEL DENGAN SIMULASI CALCULATED COLUMNS ===")
print(penjualan)
print(f"\\nDAX Measure: Margin Laba Agregat Dinamis = {margin_keseluruhan:.2f}%")`,
        expectedOutput: "Tabel terisi nilai calculated column dan nilai measure margin laba terhitung sebesar 28.75%.",
        codeExp: "Skrip memodelkan perbedaan mendasar DAX: Calculated Column menambah kolom fisik per baris, sedangkan Measure mengevaluasi rasio margin laba secara agregat dinamis di atas total populasi yang tersaring.",
        pitfalls: [
          "Membuat ratusan Calculated Columns untuk perhitungan metrik sederhana, yang membuat file Power BI (.pbix) membengkak menjadi gigabyte dan menghabiskan kuota RAM server.",
          "Menghitung rata-rata dari rasio persentase di calculated column alih-alih menghitung rasio dari jumlah total menggunakan Measure."
        ],
        refTitle: "Microsoft Learn: DAX basics in Power BI Desktop",
        refUrl: "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-quickstart-learn-dax-basics"
      },
      {
        num: "7.5",
        slug: "7-5-evaluasi-konteks-dax-row-context-filter-context-calculate",
        title: "7.5. Evaluasi Konteks DAX: Row Context vs Filter Context & CALCULATE",
        desc: "Jantung pemikiran analitik DAX: interaksi antara Row Context dan Filter Context, transisi konteks via CALCULATE(), modifikasi filter via ALL(), ALLEXCEPT(), dan KEEPFILTERS().",
        concept: `Menguasai DAX bermuara pada satu pemahaman krusial: Teori Konteks Evaluasi (Evaluation Context). Tanpa memahami konteks evaluasi, formula DAX yang tampaknya sederhana akan menghasilkan angka-angka yang sama sekali tidak dapat dipahami.

Dua jenis konteks dalam DAX adalah:
1. Row Context: Konteks 'baris saat ini'. Row Context aktif saat membuat Calculated Column atau di dalam fungsi iterator seperti SUMX() dan AVERAGEX(). Row context hanya mengetahui nilai sel pada baris tempat ia berada, dan tidak mengetahui filter apa yang sedang aktif di visual dashboard.
2. Filter Context: Himpunan filter aktif yang diterapkan pada model data oleh Slicer, pemilihan baris pada matriks visual, filter halaman, dan izin keamanan pengguna.

Fungsi CALCULATE() adalah fungsi paling sakti dan paling sering digunakan dalam seluruh ekosistem DAX. CALCULATE() adalah satu-satunya fungsi yang memiliki kemampuan mengubah, menambah, menghapus, atau menimpa Filter Context yang ada. Selain itu, CALCULATE() melakukan 'Context Transition'—mengubah Row Context yang aktif menjadi Filter Context yang setara.`,
        code: `# 7.5: Simulasi Logika CALCULATE(..., ALL()) untuk Menghitung Pangsa Pasar
import pandas as pd

penjualan_wilayah = pd.DataFrame({
    'Wilayah': ['Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi'],
    'Omzet_Juta': [500, 200, 150, 150]
})

# Simulasi CALCULATE(SUM(penjualan[Omzet]), ALL(penjualan[Wilayah]))
# ALL() menghapus seluruh filter konteks wilayah sehingga mengembalikan total global
total_omzet_global = penjualan_wilayah['Omzet_Juta'].sum()

# Simulasi Measure: Pangsa Pasar (%) = DIVIDE([Omzet], CALCULATE([Omzet], ALL(Wilayah)))
penjualan_wilayah['Total_Nasional'] = total_omzet_global
penjualan_wilayah['Pangsa_Pasar_Pct'] = (
    penjualan_wilayah['Omzet_Juta'] / penjualan_wilayah['Total_Nasional'] * 100
).round(1)

print("=== SIMULASI KONTEKS FILTER DAX: CALCULATE DENGAN ALL() ===")
print(penjualan_wilayah[['Wilayah', 'Omzet_Juta', 'Pangsa_Pasar_Pct']])`,
        expectedOutput: "Pangsa pasar per wilayah terhitung terhadap total nasional 1000 juta.",
        codeExp: "Skrip mendemonstrasikan perilaku fungsi ALL() di dalam CALCULATE: meniadakan filter baris wilayah untuk mendapatkan total populasi nasional sebagai penyebut dalam kalkulasi persentase kontribusi.",
        pitfalls: [
          "Menggunakan fungsi ALL() tanpa menyadari bahwa ia menghapus seluruh filter kolom lain yang mungkin diinginkan tetap aktif; pertimbangkan ALLEXCEPT() jika filter tertentu harus dipertahankan.",
          "Mencoba menggunakan CALCULATE di dalam Calculated Column tanpa memahami bahwa context transition akan memfilter tabel fakta berdasarkan nilai seluruh kolom baris tersebut, yang seringkali menyebabkan galat performa."
        ],
        refTitle: "SQLBI (Marco Russo & Alberto Ferrari): The definitive guide to DAX & CALCULATE",
        refUrl: "https://www.sqlbi.com/articles/understanding-context-transition/"
      },
      {
        num: "7.6",
        slug: "7-6-tableau-calculations-level-of-detail-lod-expressions",
        title: "7.6. Pengenalan Tableau Calculation & Level of Detail (LOD) Expressions",
        desc: "Kalkulasi analitik Tableau: Basic Calculations vs Table Calculations vs Level of Detail (LOD), sintaks FIXED, INCLUDE, dan EXCLUDE untuk mengontrol granularitas agregasi independen dari visual.",
        concept: `Dalam Tableau, kalkulasi analitik dibagi menjadi tiga tingkatan fleksibilitas: Basic Calculations (operasi matematika per baris atau agregat sederhana), Table Calculations (kalkulasi sekunder yang beroperasi pada tabel ringkasan visual yang sudah dirender di layar, seperti Running Sum), dan Level of Detail (LOD) Expressions.

LOD Expressions merevolusi analitik di Tableau dengan memungkinkan analis menentukan granularitas kalkulasi secara independen dari dimensi apa pun yang ada di visualisasi kartu (canvas shelf).

Tiga kata kunci LOD utama dalam Tableau adalah:
1. FIXED: Menghitung metrik pada tingkat dimensi yang ditentukan secara spesifik, mengabaikan dimensi lain yang ada di visualisasi. Misalnya: {FIXED [Customer ID] : MIN([Order Date])} untuk menemukan tanggal pesanan perdana pelanggan.
2. INCLUDE: Menghitung metrik pada tingkat detail dimensi visual DITAMBAH dimensi tambahan yang ditentukan. Sangat berguna untuk menghitung rata-rata penjualan per kota di dalam grafik tingkat provinsi.
3. EXCLUDE: Menghitung metrik dengan mengabaikan dimensi tertentu yang ada di visualisasi.`,
        code: `# 7.6: Simulasi Tableau FIXED LOD Expression untuk Mencari Pembelian Perdana
import pandas as pd

# Data transaksi pelanggan multi-pesanan
transaksi_cust = pd.DataFrame({
    'customer_id': ['C1', 'C1', 'C2', 'C3', 'C3'],
    'order_id': [101, 102, 103, 104, 105],
    'order_date': pd.to_datetime(['2026-01-10', '2026-02-15', '2026-01-20', '2026-01-05', '2026-03-01']),
    'nominal': [250000, 450000, 150000, 800000, 300000]
})

# Simulasi { FIXED [customer_id] : MIN([order_date]) }
first_order_map = transaksi_cust.groupby('customer_id')['order_date'].min().to_dict()
transaksi_cust['First_Order_Date_LOD'] = transaksi_cust['customer_id'].map(first_order_map)

# Menentukan apakah pesanan adalah Repeat Purchase
transaksi_cust['Is_Repeat_Order'] = transaksi_cust['order_date'] > transaksi_cust['First_Order_Date_LOD']

print("=== SIMULASI TABLEAU FIXED LOD: PEMBELIAN PERDANA ===")
print(transaksi_cust[['customer_id', 'order_id', 'order_date', 'First_Order_Date_LOD', 'Is_Repeat_Order']])`,
        expectedOutput: "Kolom First_Order_Date_LOD terisi tanggal pertama pelanggan berbelanja dan bendera repeat order teridentifikasi.",
        codeExp: "Skrip menunjukkan bagaimana ekspresi FIXED LOD mengunci kalkulasi pada tingkat dimensi customer_id tanpa memedulikan baris transaksi individu, menghasilkan atribut acuan tetap untuk analisis kohort repeat order.",
        pitfalls: [
          "Tidak memahami urutan operasi Tableau (Tableau Order of Operations): filter dimensi biasa dievaluasi SETELAH ekspresi FIXED LOD dihitung; jika ingin filter memengaruhi FIXED LOD, filter harus diubah menjadi Context Filter.",
          "Menumpuk ekspresi INCLUDE/EXCLUDE yang berbelit-belit yang membingungkan logika rendering visual."
        ],
        refTitle: "Tableau Help: Overview of Level of Detail Expressions",
        refUrl: "https://help.tableau.com/current/pro/desktop/en-us/calculations_calculatedfields_lod_overview.htm"
      },
      {
        num: "7.7",
        slug: "7-7-desain-ux-dashboard-eksekutif-f-pattern-ruang-negatif",
        title: "7.7. Desain UX Dashboard Eksekutif: F-Pattern, Z-Pattern & Ruang Negatif",
        desc: "Prinsip desain antarmuka dasbor bisnis: ergonomi mata manusia (F-Pattern dan Z-Pattern), hierarki visual kartu KPI, pemanfaatan ruang negatif (whitespace), dan aturan 5-Second Rule.",
        concept: `Sebuah dashboard analitik bisa saja memiliki model data yang sempurna dan rumus matematika yang mutakhir, namun jika antarmuka visualnya berantakan, pengguna bisnis akan menolak menggunakannya. Desain UX dashboard adalah penerapan ergonomi visual dan arsitektur informasi untuk membuat data mudah dicerna dalam hitungan detik.

Penelitian eye-tracking menunjukkan bahwa tatapan mata pengguna saat melihat layar komputer mengikuti Pola F (F-Pattern) atau Pola Z (Z-Pattern). Pengguna memindai dari sudut kiri atas ke kanan atas terlebih dahulu, kemudian turun ke bawah dan memindai secara horizontal lebih pendek.

Oleh karena itu, area kiri atas dasbor adalah 'Prime Real Estate' yang wajib dialokasikan untuk kartu metrik paling strategis (Headline KPI Cards: Total Pendapatan, Laba Bersih, Target Tercapai). Bagian tengah dialokasikan untuk visualisasi tren waktu dan rincian kategori utama. Bagian bawah dialokasikan untuk tabel rincian data transaksional yang mendalam.

Prinsip '5-Second Rule' menyatakan bahwa seorang eksekutif harus dapat memahami status kesehatan bisnis secara umum hanya dalam 5 detik pertama melihat dasbor. Penggunaan ruang negatif (whitespace) yang cukup mencegah rasa sesak visual dan mengarahkan fokus ke metrik penting.`,
        code: `# 7.7: Perancangan Tata Letak Wireframe Dashboard Berbasis Hierarki Z-Pattern
wireframe_layout = {
    'Zona_1_Kiri_Atas (Prioritas 1)': 'Headline KPI Cards: Total Omzet, Active Users, Net Profit, MoM Growth',
    'Zona_2_Kanan_Atas (Prioritas 2)': 'Filter Kontrol Global: Periode Kalender, Slicer Regional, Kategori Produk',
    'Zona_3_Tengah_Kiri (Prioritas 3)': 'Grafik Garis Tren Pendapatan vs Target Bulanan (Waktu & Arah Pergerakan)',
    'Zona_4_Tengah_Kanan (Prioritas 4)': 'Grafik Batang Horizontal: Top 5 Kategori Produk Berkontribusi Tertinggi',
    'Zona_5_Bawah_Penuh (Prioritas 5)': 'Tabel Rincian Drill-Down Cabang Operasional dengan Format Kondisional'
}

print("=== STRUKTUR ARSITEKTUR INFORMASI DASHBOARD UX ===")
for zona, deskripsi in wireframe_layout.items():
    print(f"[{zona}]\\n  -> {deskripsi}\\n")`,
        expectedOutput: "Spesifikasi tata letak wireframe 5 zona dashboard eksekutif tercetak terstruktur.",
        codeExp: "Skrip merangkum pembagian tata letak antarmuka dashboard berdasarkan pola navigasi mata Z-Pattern, memastikan metrik tingkat tertinggi diletakkan di zona pandang utama.",
        pitfalls: [
          "Memasukkan lebih dari 9 visual dalam satu halaman dasbor tunggal, yang memicu kelebihan beban kognitif (cognitive overload).",
          "Menggunakan warna latar belakang gelap kontras tinggi yang melelahkan mata pengguna saat dilihat berjam-jam selama jam kerja operasional."
        ],
        refTitle: "Nielsen Norman Group: F-Shaped Pattern for Reading Web Content",
        refUrl: "https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/"
      },
      {
        num: "7.8",
        slug: "7-8-interaktivitas-dashboard-cross-filtering-drill-down",
        title: "7.8. Interaktivitas Dashboard: Cross-Filtering, Drill-Down & URL Actions",
        desc: "Mekanisme interaksi pengguna: Cross-filtering antar visual, hierarki drill-down (Tahun -> Kuartal -> Bulan), drill-through ke halaman detail entitas, dan sinkronisasi slicer.",
        concept: `Keunggulan utama dashboard modern dibandingkan laporan cetak PDF statis adalah interaktivitas dinamisnya. Ketika pengguna mengklik sebuah elemen pada satu grafik (misalnya batang kategori 'Elektronik'), seluruh grafik lain pada dasbor secara otomatis tersaring untuk menampilkan konteks data khusus barang elektronik tersebut. Mekanisme ini disebut Cross-Filtering (atau Cross-Highlighting).

Fitur navigasi kritis lainnya adalah Hierarki Drill-Down. Dengan menyusun hierarki atribut (seperti Tahun -> Kuartal -> Bulan -> Tanggal, atau Benua -> Negara -> Kota), pengguna dapat menjelajahi data dari tingkat ringkasan makro hingga rincian mikro hanya dengan mengklik ikon navigasi tanpa perlu berpindah dasbor.

Drill-Through memungkinkan pengguna mengklik kanan pada entitas tertentu (misalnya seorang sales representative atau cabang tertentu) dan diarahkan ke halaman detail khusus yang membedah riwayat lengkap entitas tersebut secara terisolasi.`,
        code: `# 7.8: Simulasi Mesin Cross-Filtering Interaktif Antar Dua Visual
import pandas as pd

# Basis data transaksi toko
data_toko = pd.DataFrame({
    'transaksi_id': [1, 2, 3, 4, 5],
    'kota': ['Jakarta', 'Jakarta', 'Surabaya', 'Bandung', 'Jakarta'],
    'kategori': ['Fashion', 'Elektronik', 'Elektronik', 'Fashion', 'Makanan'],
    'nilai': [350000, 1500000, 2200000, 450000, 120000]
})

# Pengguna mengklik kota 'Jakarta' pada Visual 1 (Peta / Bar Chart Kota)
kota_terpilih = 'Jakarta'

# Mesin cross-filtering menerapkan filter konteks ke Visual 2 (Ringkasan Kategori)
data_filtered = data_toko[data_toko['kota'] == kota_terpilih]
visual_kategori_jakarta = data_filtered.groupby('kategori')['nilai'].sum().reset_index()

print(f"=== HASIL CROSS-FILTERING UNTUK SELEKSI KOTA: {kota_terpilih} ===")
print(visual_kategori_jakarta)`,
        expectedOutput: "Visual kategori secara dinamis hanya menampilkan kategori transaksi yang terjadi di Jakarta.",
        codeExp: "Skrip memodelkan mekanisme cross-filtering yang terjadi di balik layar software BI: event klik pada suatu dimensi langsung memicu penyaringan data pada seluruh komponen visual terkait lainnya.",
        pitfalls: [
          "Membiarkan interaksi cross-highlighting default di Power BI yang menampilkan batang redup (faded bars) yang seringkali membingungkan pengguna; ubah interaksi menjadi Cross-Filter murni.",
          "Menerapkan cross-filtering pada model data yang belum dioptimalkan, menyebabkan latensi rendering beberapa detik setiap kali pengguna mengklik visual."
        ],
        refTitle: "Microsoft Learn: Change how visuals interact in a Power BI report",
        refUrl: "https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions"
      },
      {
        num: "7.9",
        slug: "7-9-refresh-data-otomatis-gateway-onpremise-rls-bi",
        title: "7.9. Refresh Data Otomatis, Gateway On-Premise & Keamanan Baris (RLS BI)",
        desc: "Manajemen siklus hidup dashboard di lingkungan produksi: penjadwalan pembaruan otomatis (Scheduled Refresh), On-Premises Data Gateway, dan implementasi Row-Level Security (RLS) dinamis berbasis peran.",
        concept: `Membangun dashboard di komputer lokal analis hanyalah setengah dari perjuangan. Agar dashboard tersebut dapat digunakan secara berkelanjutan oleh ratusan karyawan perusahaan setiap hari, analis harus mengelola infrastruktur deployment di cloud (Power BI Service atau Tableau Cloud/Server).

Pembaruan data otomatis (Scheduled Refresh) memastikan data yang ditampilkan selalu mutakhir tanpa intervensi manual analis setiap pagi. Jika database sumber tersimpan di server lokal internal kantor (on-premise firewalled network), dibutuhkan jembatan perangkat lunak aman bernama On-Premises Data Gateway untuk mentransfer kueri terenkripsi ke cloud.

Keamanan data adalah prioritas tertinggi: seorang Manajer Wilayah Jawa Barat tidak boleh melihat angka penjualan cabang Jawa Timur di dasbor yang sama. Row-Level Security (RLS) membatasi akses baris data berdasarkan identitas login pengguna (USERPRINCIPALNAME() di Power BI atau USERNAME() di Tableau) secara dinamis, sehingga ratusan manajer dapat menggunakan satu dasbor terpadu yang menampilkan data berbeda sesuai otoritas masing-masing.`,
        code: `# 7.9: Simulasi Logika Dinamis Row-Level Security (RLS) Berbasis Email Pengguna
import pandas as pd

# Tabel Otoritas Hak Akses Pengguna (User Security Mapping)
tabel_akses = pd.DataFrame({
    'user_email': ['budi@perusahaan.co.id', 'siti@perusahaan.co.id', 'direktur@perusahaan.co.id'],
    'wilayah_otoritas': ['Jawa Barat', 'Jawa Timur', 'ALL']
})

# Tabel Fakta Penjualan Nasional
penjualan_nasional = pd.DataFrame({
    'trx_id': [1, 2, 3, 4],
    'wilayah': ['Jawa Barat', 'Jawa Barat', 'Jawa Timur', 'Bali'],
    'omzet': [120, 150, 200, 80]
})

# Simulasi evaluasi RLS saat login
def evaluasi_rls(email_login):
    rule = tabel_akses[tabel_akses['user_email'] == email_login]
    if rule.empty:
        return pd.DataFrame() # Akses ditolak (Kosong)
    
    wilayah_ijin = rule.iloc[0]['wilayah_otoritas']
    if wilayah_ijin == 'ALL':
        return penjualan_nasional
    return penjualan_nasional[penjualan_nasional['wilayah'] == wilayah_ijin]

print("=== TAMPILAN DASHBOARD UNTUK BUDI (MANAJER JAWA BARAT) ===")
print(evaluasi_rls('budi@perusahaan.co.id'))
print("\\n=== TAMPILAN DASHBOARD UNTUK DIREKTUR (AKSES GLOBAL) ===")
print(evaluasi_rls('direktur@perusahaan.co.id'))`,
        expectedOutput: "Budi hanya melihat 2 baris data Jawa Barat sedangkan Direktur melihat seluruh 4 baris data.",
        codeExp: "Skrip mendemonstrasikan evaluasi aturan Row-Level Security (RLS): kueri secara otomatis menyisipkan predikat filter wilayah berdasarkan kredensial email pengguna yang sedang login.",
        pitfalls: [
          "Membagikan laporan BI dengan mengekspor file mentah (.pbix) melalui email yang melangkahi aturan keamanan RLS server.",
          "Menyusun aturan RLS statis dengan membuat puluhan salinan dashboard berbeda untuk setiap departemen alih-alih memanfaatkan RLS dinamis berbasis tabel peran terpusat."
        ],
        refTitle: "Microsoft Learn: Row-level security (RLS) with Power BI",
        refUrl: "https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-rls"
      },
      {
        num: "7.10",
        slug: "7-10-studi-kasus-dashboard-eksekutif-clevel-cac-burnrate",
        title: "7.10. Studi Kasus Dashboard Eksekutif C-Level: Revenue, Burn Rate & CAC",
        desc: "Implementasi end-to-end dashboard strategis perusahaan rintisan/enterprise: perumusan metrik Annual Recurring Revenue (ARR), Burn Rate, Customer Acquisition Cost (CAC), dan LTV/CAC Ratio.",
        concept: `Sebagai puncak dari penerapan Business Intelligence, subbab ini mengintegrasikan seluruh konsep pemodelan dimensional, DAX, dan desain UX ke dalam Studi Kasus Nyata: Merancang Dashboard Keuangan & Pertumbuhan untuk Eksekutif C-Level (CEO, CFO, CMO).

Eksekutif puncak perusahaan rintisan dan teknologi SaaS (Software-as-a-Service) memantau kesehatan bisnis melalui sekumpulan metrik finansial terstandarisasi:
1. Annual Recurring Revenue (ARR): Nilai kontrak langganan yang dinormalisasi ke tingkat tahunan.
2. Net Burn Rate: Selisih defisit kas bulanan (Total Pengeluaran Kas - Total Pemasukan Kas).
3. Cash Runway: Jumlah bulan tersisa sebelum saldo kas perusahaan habis berdasarkan burn rate saat ini.
4. LTV to CAC Ratio: Rasio antara nilai seumur hidup pelanggan (Customer Lifetime Value) terhadap biaya akuisisi pelanggan (Customer Acquisition Cost). Rasio ideal industri adalah di atas 3:1.`,
        formula: `\\text{Cash Runway (Bulan)} = \\frac{\\text{Saldo Kas Saat Ini}}{\\text{Net Monthly Burn Rate}}`,
        code: `# 7.10: Perhitungan Komprehensif Metrik Kesehatan Finansial Startup SaaS
kas_saat_ini = 12000000000    # Rp 12 Miliar di rekening bank
pengeluaran_kas_bln = 1800000000 # Beban gaji + server + pemasaran (Rp 1.8 Miliar)
pendapatan_kas_bln = 950000000   # Pemasukan kas dari langganan (Rp 950 Juta)

net_burn_rate = pengeluaran_kas_bln - pendapatan_kas_bln
runway_bulan = kas_saat_ini / net_burn_rate

# Metrik Efisiensi Akuisisi Pelanggan (Unit Economics)
total_biaya_marketing_q = 600000000 # Rp 600 Juta
pelanggan_baru_diperoleh = 400
cac = total_biaya_marketing_q / pelanggan_baru_diperoleh
arpu_tahunan = 3600000 # Average Revenue per User (Rp 3.6 Juta)
churn_rate_tahunan = 0.20 # 20% Churn
ltv = arpu_tahunan / churn_rate_tahunan
ltv_cac_ratio = ltv / cac

print("=== METRIK DASHBOARD EKSEKUTIF C-LEVEL FINANSIAL ===")
print(f"Saldo Kas Aktif      : Rp {kas_saat_ini:,.0f}")
print(f"Net Burn Rate Bulanan: Rp {net_burn_rate:,.0f} / Bulan")
print(f"Cash Runway Tersisa  : {runway_bulan:.1f} Bulan")
print("\\n=== UNIT ECONOMICS EFISIENSI PEMASARAN ===")
print(f"Customer Acquisition Cost (CAC) : Rp {cac:,.0f}")
print(f"Customer Lifetime Value (LTV)   : Rp {ltv:,.0f}")
print(f"LTV / CAC Ratio                 : {ltv_cac_ratio:.2f}x (Target Ideal: > 3.0x)")`,
        expectedOutput: "Kalkulasi menghasilkan Runway 14.1 bulan dan rasio LTV/CAC 12.00x yang sangat sehat.",
        codeExp: "Skrip menyimulasikan perhitungan matematis indikator kinerja utama tingkat eksekutif, menghubungkan metrik kas makro dan efisiensi unit economics mikro ke dalam satu formula analitik padu.",
        pitfalls: [
          "Mencampuradukkan perhitungan pendapatan akuntansi berbasis akrual (Accrual GAAP Revenue) dengan pergerakan kas riil (Cash Flow), yang dapat menutupi krisis likuiditas mendesak.",
          "Menghitung CAC tanpa memasukkan biaya gaji tim pemasaran dan agensi eksternal, yang menyebabkan angka biaya akuisisi terlihat lebih murah dari kenyataannya."
        ],
        refTitle: "Bessemer Venture Partners: 10 Laws of Cloud & SaaS Metrics",
        refUrl: "https://www.bvp.com/atlas/the-ten-laws-of-cloud"
      }
    ]
  },

  // ==========================================
  // BAB 8: Analisis Kohort, Segmentasi RFM & Funnel Conversion
  // ==========================================
  {
    orderIndex: 8,
    id: "data-analyst-ch-8",
    slug: "bab-8-analisis-kohort-segmentasi-rfm-funnel-conversion",
    title: "BAB 8: Analisis Kohort, Segmentasi RFM & Funnel Conversion",
    desc: "Analisis perilaku pengguna tingkat lanjut: konstruksi matriks retensi kohort waktu, segmentasi berbasis nilai pelanggan RFM (Recency, Frequency, Monetary), pemodelan jalur konversi (Funnel Analysis), dan evaluasi Customer Lifetime Value (CLV).",
    coreConcepts: ["Cohort Retention Analysis", "RFM Segmentation", "Funnel Drop-Off", "Customer Lifetime Value", "Market Basket Analysis"],
    subchapters: [
      {
        num: "8.1",
        slug: "8-1-konsep-dasar-analisis-kohort-retensi-pelanggan",
        title: "8.1. Konsep Dasar Analisis Kohort & Dinamika Retensi Pelanggan",
        desc: "Pengenalan analisis kohort: pembagian kelompok berdasarkan karakteristik waktu (Acquisition Cohort), kurva peluruhan retensi, dan pentingnya retensi dibandingkan akuisisi.",
        concept: `Dalam bisnis modern, mengukur jumlah pengguna aktif total (Vanity Metrics) seringkali memberikan gambaran kemajuan palsu. Sebuah aplikasi bisa saja mengalami pertumbuhan pengguna baru yang tinggi akibat belanja iklan masif, namun jika 90% pengguna tersebut langsung berhenti menggunakan aplikasi setelah minggu pertama, bisnis tersebut berada dalam bahaya kehancuran tersembunyi.

Analisis Kohort (Cohort Analysis) membedah data perilaku dengan membagi pengguna ke dalam kelompok-kelompok homogen yang memiliki karakteristik awal yang sama dalam periode waktu tertentu—paling umum adalah Kohort Akuisisi (Acquisition Cohorts), yaitu pengguna yang mendaftar atau melakukan transaksi pertama pada bulan yang sama.

Dengan memantau perilaku masing-masing kelompok kohort dari waktu ke waktu secara independen, analis dapat melihat apakah produk semakin baik dalam mempertahankan pengguna (Kurva Retensi yang mendatar) atau justru memburuk seiring berjalannya waktu.`,
        code: `# 8.1: Konseptualisasi Kohort Akuisisi dan Penurunan Retensi
import pandas as pd

kohort_ringkasan = pd.DataFrame({
    'Bulan_Daftar': ['Jan 2026', 'Feb 2026', 'Mar 2026'],
    'Ukuran_Awal': [1000, 1200, 1500],
    'Aktif_Bulan_0': [1000, 1200, 1500],
    'Aktif_Bulan_1': [450, 600, 825],
    'Aktif_Bulan_2': [320, 480, None]
})

# Menghitung persentase retensi Bulan 1
kohort_ringkasan['Retensi_M1_Pct'] = (
    kohort_ringkasan['Aktif_Bulan_1'] / kohort_ringkasan['Ukuran_Awal'] * 100
).round(1)

print("=== RINGKASAN DINAMIKA RETENSI KOHORT AWAL ===")
print(kohort_ringkasan.to_string(index=False))`,
        expectedOutput: "Tabel retensi menunjukkan peningkatan retensi Bulan 1 dari 45% (Jan) menjadi 55% (Mar).",
        codeExp: "Skrip mendemonstrasikan evaluasi kohort akuisisi dasar: peningkatan persentase retensi pada bulan pertama membuktikan bahwa inisiatif onboarding produk di bulan Maret berhasil meningkatkan loyalitas pengguna baru.",
        pitfalls: [
          "Mencampurkan pengguna baru dan pengguna lama ke dalam satu metrik retensi agregat tunggal yang mengaburkan tren retensi yang sebenarnya.",
          "Hanya berfokus pada akuisisi pengguna tanpa memantau tingkat retensi jangka panjang."
        ],
        refTitle: "Amplitude: The Retention Playbook",
        refUrl: "https://amplitude.com/retention-playbook"
      },
      {
        num: "8.2",
        slug: "8-2-konstruksi-matriks-retensi-kohort-pandas",
        title: "8.2. Konstruksi Matriks Retensi Kohort Berbasis Waktu di Pandas",
        desc: "Transformasi data transaksional mentah menjadi matriks kohort segitiga (Triangular Cohort Matrix) di Pandas: ekstraksi bulan pesanan perdana, penentuan cohort index, dan agregasi pivot.",
        concept: `Membangun Matriks Retensi Kohort Segitiga secara mandiri di Python adalah keterampilan penting analis data yang sering diujikan dalam tes teknis wawancara kerja. Proses ini melibatkan serangkaian manipulasi DataFrame yang terstruktur dan metodologis.

Langkah-langkah rekayasa data matriks kohort meliputi:
1. Menentukan Invoice Month (Tahun-Bulan saat transaksi terjadi) untuk setiap transaksi.
2. Mengelompokkan data berdasarkan ID pengguna dan mencari nilai transaksi terkecil untuk menetapkan Cohort Month (Bulan Transaksi Perdana) bagi masing-masing pengguna.
3. Menghitung 'Cohort Index'—selisih waktu integer (Bulan ke-0, Bulan ke-1, Bulan ke-2, dst.) antara Invoice Month dan Cohort Month.
4. Mengagregasi jumlah pengguna aktif unik menggunakan pivot_table(index='CohortMonth', columns='CohortIndex', values='UserID', aggfunc='nunique').
5. Membagi setiap baris dengan jumlah pengguna pada Bulan ke-0 untuk memperoleh matriks rasio retensi persentase.`,
        code: `# 8.2: Konstruksi Lengkap Matriks Retensi Kohort Transaksional di Pandas
import pandas as pd
import numpy as np

# Membuat data transaksi pelanggan sintetis
data_transaksi = pd.DataFrame({
    'user_id': [1, 2, 1, 3, 2, 1, 4, 3, 2],
    'trx_date': pd.to_datetime([
        '2026-01-15', '2026-01-20', '2026-02-10',
        '2026-02-05', '2026-02-18', '2026-03-01',
        '2026-02-25', '2026-03-12', '2026-03-20'
    ])
})

# 1. Ekstraksi Invoice Month (Periode Transaksi)
data_transaksi['order_month'] = data_transaksi['trx_date'].dt.to_period('M')

# 2. Menentukan Cohort Month (Bulan Transaksi Pertama Pengguna)
data_transaksi['cohort_month'] = data_transaksi.groupby('user_id')['order_month'].transform('min')

# 3. Menghitung Cohort Index (Selisih Bulan Integer)
def get_month_diff(d1, d2):
    return (d1.dt.year - d2.dt.year) * 12 + (d1.dt.month - d2.dt.month)

data_transaksi['cohort_index'] = (
    (data_transaksi['order_month'].dt.year - data_transaksi['cohort_month'].dt.year) * 12 +
    (data_transaksi['order_month'].dt.month - data_transaksi['cohort_month'].dt.month)
)

# 4. Agregasi Pivot Matriks Jumlah Pengguna Unik
cohort_counts = data_transaksi.pivot_table(
    index='cohort_month',
    columns='cohort_index',
    values='user_id',
    aggfunc='nunique'
)

# 5. Konversi ke Matriks Persentase Retensi
cohort_size = cohort_counts.iloc[:, 0]
retention_matrix = cohort_counts.divide(cohort_size, axis=0) * 100

print("=== MATRIKS JUMLAH PENGGUNA KOHORT ===")
print(cohort_counts)
print("\\n=== MATRIKS PERSENTASE RETENSI KOHORT (%) ===")
print(retention_matrix.round(1))`,
        expectedOutput: "Matriks retensi segitiga terbentuk dengan kolom index 0, 1, dan 2.",
        codeExp: "Skrip menunjukkan algoritma lengkap pembentukan matriks kohort: menghitung bulan perdana pengguna dengan transform('min'), menghitung selisih integer bulan, dan membagi pivot table untuk menghasilkan persentase retensi.",
        pitfalls: [
          "Menghitung selisih bulan murni dari selisih hari (hari / 30) yang menghasilkan pergeseran indeks akibat jumlah hari bulan kalender yang berbeda-beda.",
          "Lupa menyaring transaksi yang dibatalkan atau direfund yang dapat mendistorsi status keaktifan pengguna."
        ],
        refTitle: "pandas User Guide: Reshaping and Pivot Tables",
        refUrl: "https://pandas.pydata.org/docs/user_guide/reshaping.html"
      },
      {
        num: "8.3",
        slug: "8-3-visualisasi-heatmap-retensi-retention-curve",
        title: "8.3. Visualisasi Heatmap Retensi & Identifikasi Drop-off Retention Curve",
        desc: "Teknik visualisasi matriks kohort: pewarnaan Heatmap bersyarat, bentuk kurva retensi (Smile Curve vs Falling Curve), dan identifikasi Product-Market Fit.",
        concept: `Membaca matriks angka retensi dalam bentuk tabel teks murni sangat melelahkan. Visualisasi Heatmap dengan gradasi warna bersyarat (Conditional Formatting Color Scale) menyoroti area keberhasilan dan kelemahan retensi secara seketika.

Membaca Heatmap Kohort dilakukan dalam tiga arah pandang:
1. Membaca Horizontal (Sepanjang Baris): Menunjukkan bagaimana retensi kelompok pengguna tertentu meluruh seiring bertambahnya usia kohort.
2. Membaca Vertikal (Sepanjang Kolom): Membandingkan retensi pada usia yang sama (misalnya Retensi Bulan ke-1) antar kohort yang berbeda untuk melihat apakah kualitas produk mengalami perbaikan dari bulan ke bulan.
3. Membaca Diagonal: Menunjukkan dampak dari peristiwa kalender eksternal tertentu (misalnya promo hari belanja nasional atau server down) yang memengaruhi seluruh kohort pada saat yang sama.

Bentuk Kurva Retensi (Retention Curve) adalah indikator utama Product-Market Fit. Jika kurva terus merosot menuju angka nol (Falling Curve), produk belum memiliki kecocokan pasar. Namun, jika kurva mendatar sejajar dengan sumbu horizontal pada tingkat tertentu (misalnya stabil di angka 25%), produk telah mencapai retensi stabil yang siap untuk ekspansi pertumbuhan.`,
        code: `# 8.3: Evaluasi Kurva Retensi untuk Menilai Product-Market Fit
import pandas as pd
import numpy as np

# Mensimulasikan kurva retensi selama 6 bulan untuk dua fitur berbeda
periode = np.arange(0, 6)
# Fitur A: Kurva mendatar (Stabil di 30% - Retensi Sehat)
retensi_fitur_a = [100.0, 52.0, 38.0, 31.0, 30.0, 29.5]
# Fitur B: Kurva terus meluruh mendekati 0 (Leaky Bucket)
retensi_fitur_b = [100.0, 35.0, 18.0, 8.0, 3.0, 0.8]

df_kurva = pd.DataFrame({
    'Bulan_Ke': periode,
    'Fitur_A_Retensi_Pct': retensi_fitur_a,
    'Fitur_B_Retensi_Pct': retensi_fitur_b
})

print("=== EVALUASI PROFIL RETENTION CURVE ===")
print(df_kurva.to_string(index=False))
print("\\nDiagnosa:")
print(f"Fitur A: Kurva mendatar pada level {retensi_fitur_a[-1]}% -> Indikasi Kuat Product-Market Fit.")
print(f"Fitur B: Kurva meluruh ke {retensi_fitur_b[-1]}% -> Gejala Leaky Bucket (Pengguna Meninggalkan Aplikasi).")`,
        expectedOutput: "Diagnosa memperlihatkan perbedaan karakteristik antara kurva retensi yang stabil vs yang meluruh.",
        codeExp: "Skrip membandingkan dua lintasan kurva retensi secara empiris, mendemonstrasikan kriteria kuantitatif untuk mengidentifikasi keberhasilan retensi produk jangka panjang.",
        pitfalls: [
          "Mewarnai Heatmap dengan skala warna yang salah sehingga perbedaan retensi penting antara 15% dan 25% terlihat pudar dan luput dari perhatian manajemen.",
          "Menyimpulkan keberhasilan fitur baru terlalu cepat hanya berdasarkan angka Bulan ke-0 tanpa menunggu kurva mendatar di Bulan ke-2 atau ke-3."
        ],
        refTitle: "Brian Balfour: Retention is the King of Growth",
        refUrl: "https://brianbalfour.com/essays/retention-is-king"
      },
      {
        num: "8.4",
        slug: "8-4-metodologi-segmentasi-rfm-recency-frequency-monetary",
        title: "8.4. Metodologi Segmentasi RFM (Recency, Frequency, Monetary)",
        desc: "Prinsip segmentasi perilaku pelanggan: definisi metrik Recency (keterkinian), Frequency (frekuensi transaksi), Monetary (total nilai belanja), serta penentuan tanggal referensi analisis.",
        concept: `Segmentasi pelanggan tradisional seringkali didasarkan pada data demografi (usia, jenis kelamin, kota tempat tinggal). Namun, dalam pemasaran modern, segmentasi berbasis perilaku aktual (Behavioral Segmentation) terbukti jauh lebih efektif dalam memprediksi respons kampanye dan mencegah churn. Metodologi segmentasi perilaku yang paling mapan adalah Analisis RFM.

Metrik RFM mengevaluasi pelanggan berdasarkan tiga dimensi transaksi kuantitatif:
1. Recency ($R$): Berapa hari yang telah berlalu sejak transaksi terakhir pelanggan hingga tanggal analisis? Semakin kecil nilai $R$, semakin segar keterlibatan pelanggan dengan merek.
2. Frequency ($F$): Berapa kali pelanggan melakukan transaksi dalam jendela waktu observasi (misal 1 tahun terakhir)? Nilai $F$ mengukur tingkat loyalitas kebiasaan belanja.
3. Monetary ($M$): Berapa total jumlah uang yang telah dibelanjakan pelanggan selama periode tersebut? Nilai $M$ mengukur kontribusi pendapatan moneter pelanggan terhadap kelangsungan bisnis.`,
        formula: `\\text{Recency} = \\text{Snapshot Date} - \\max(\\text{Transaction Date})`,
        code: `# 8.4: Ekstraksi Nilai Mentah RFM dari Riwayat Transaksi Penjualan
import pandas as pd

transaksi_retail = pd.DataFrame({
    'cust_id': ['C101', 'C102', 'C101', 'C103', 'C102', 'C104'],
    'order_id': [1, 2, 3, 4, 5, 6],
    'tanggal': pd.to_datetime(['2026-03-01', '2026-02-15', '2026-03-10', '2026-01-05', '2026-03-05', '2026-03-12']),
    'nominal': [250000, 1000000, 450000, 150000, 800000, 300000]
})

# Menentukan Snapshot Date analisis (1 hari setelah transaksi paling mutakhir)
snapshot_date = transaksi_retail['tanggal'].max() + pd.Timedelta(days=1)

# Agregasi tabel RFM per pelanggan
rfm_raw = transaksi_retail.groupby('cust_id').agg(
    Recency=('tanggal', lambda x: (snapshot_date - x.max()).days),
    Frequency=('order_id', 'count'),
    Monetary=('nominal', 'sum')
).reset_index()

print(f"=== REKAYASA METRIK MENTAH RFM (SNAPSHOT: {snapshot_date.date()}) ===")
print(rfm_raw)`,
        expectedOutput: "Tabel mentah RFM per pelanggan terhitung dengan nilai Recency dalam satuan hari.",
        codeExp: "Skrip menghitung nilai Recency (hari sejak transaksi terakhir), Frequency (jumlah invoice unik), dan Monetary (total belanja) menggunakan fungsi agregasi Pandas terhadap tanggal acuan snapshot.",
        pitfalls: [
          "Menggunakan tanggal hari ini saat menjalankan skrip (datetime.now()) pada dataset historis masa lalu alih-alih tanggal transaksi maksimum data, yang menyebabkan nilai Recency membengkak salah.",
          "Memasukkan transaksi dengan nominal bernilai nol (klaim garansi atau voucher promo 100%) ke dalam perhitungan Monetary."
        ],
        refTitle: "Arthur Hughes: Strategic Database Marketing & RFM",
        refUrl: "https://www.dbmarketing.com/"
      },
      {
        num: "8.5",
        slug: "8-5-skoring-kuantil-rfm-pembagian-segmen-pelanggan",
        title: "8.5. Skoring Kuartil / Kuantil RFM & Pembagian Segmen Pelanggan",
        desc: "Transformasi metrik mentah ke skor diskrit 1-5 menggunakan qcut: pembuatan kode gabungan RFM_Score, dan pemetaan ke taksonomi segmen bisnis (Champions, Loyal, At-Risk, Lost).",
        concept: `Karena nilai mentah Recency, Frequency, dan Monetary memiliki satuan dan skala yang berbeda (hari vs frekuensi kali vs rupiah jutaan), metrik mentah harus dinormalisasi menjadi skor seragam—biasanya menggunakan skala 1 sampai 5 menggunakan metode pembagian kuintil (pd.qcut()).

Untuk Frequency dan Monetary, skor 5 diberikan kepada 20% pelanggan teratas dengan nilai tertinggi (semakin besar semakin baik). Sebaliknya, untuk Recency, skor 5 diberikan kepada 20% pelanggan dengan hari terkecil (paling baru berbelanja).

Setelah setiap pelanggan memiliki skor $R$, $F$, dan $M$ (misal 5-5-5 atau 1-1-1), pelanggan dikelompokkan ke dalam segmen bisnis terstandar:
1. Champions (R: 4-5, F: 4-5, M: 4-5): Pelanggan terbaik, baru saja belanja, sangat sering bertransaksi, dan menyumbang omzet besar.
2. Loyal Customers (R: 2-4, F: 3-5, M: 3-5): Pelanggan setia yang responsif terhadap promosi.
3. At Risk / Churn Risk (R: 1-2, F: 3-5, M: 3-5): Dulu sering belanja dalam jumlah besar, tetapi sudah lama tidak pernah kembali.
4. Lost Customers (R: 1-2, F: 1-2, M: 1-2): Pelanggan lama yang sudah meninggalkan aplikasi.`,
        code: `# 8.5: Skoring Kuintil dan Pemetaan Taksonomi Segmen RFM
import pandas as pd
import numpy as np

# Simulasi data mentah RFM untuk 100 pelanggan
np.random.seed(42)
n = 100
df_pelanggan = pd.DataFrame({
    'cust_id': [f'C{i:03d}' for i in range(1, n+1)],
    'recency': np.random.randint(1, 365, n),
    'frequency': np.random.poisson(lam=4, size=n) + 1,
    'monetary': np.random.exponential(scale=1500000, size=n) + 100000
})

# Skoring Kuantil 1-5 (Rank-based discretization untuk menangani nilai duplikat)
df_pelanggan['R_Score'] = pd.qcut(df_pelanggan['recency'].rank(method='first'), q=5, labels=[5, 4, 3, 2, 1]).astype(int)
df_pelanggan['F_Score'] = pd.qcut(df_pelanggan['frequency'].rank(method='first'), q=5, labels=[1, 2, 3, 4, 5]).astype(int)
df_pelanggan['M_Score'] = pd.qcut(df_pelanggan['monetary'].rank(method='first'), q=5, labels=[1, 2, 3, 4, 5]).astype(int)

# Pemetaan Segmen Bisnis Berdasarkan Kombinasi R dan F
def petakan_segmen(row):
    r, f = row['R_Score'], row['F_Score']
    if r >= 4 and f >= 4:
        return 'Champions'
    elif r >= 3 and f >= 3:
        return 'Loyal Customers'
    elif r >= 4 and f <= 2:
        return 'Promising New Users'
    elif r <= 2 and f >= 3:
        return 'At-Risk High Value'
    else:
        return 'Lost / Hibernating'

df_pelanggan['Segmen'] = df_pelanggan.apply(petakan_segmen, axis=1)

print("=== DISTRIBUSI SEGMEN PELANGGAN RFM ===")
print(df_pelanggan['Segmen'].value_counts())
print("\\nContoh Data Pelanggan dengan Skor:")
print(df_pelanggan[['cust_id', 'R_Score', 'F_Score', 'M_Score', 'Segmen']].head())`,
        expectedOutput: "Pelanggan terkelompokkan ke dalam segmen Champions, Loyal, At-Risk, dll.",
        codeExp: "Skrip mendemonstrasikan proses diskretisasi kuintil menggunakan pd.qcut() dengan penanganan rank() untuk menghindari ambiguitas nilai kembar, serta memetakan matriks skor R-F ke label aksi bisnis nyata.",
        pitfalls: [
          "Terjebak galat 'Bin edges must be unique' pada pd.qcut() akibat banyak pelanggan memiliki nilai frekuensi identik (misal sama-sama belanja 1 kali); selalu gunakan parameter duplicates='drop' atau rank(method='first').",
          "Memperlakukan semua segmen dengan strategi promosi yang sama, membuang anggaran diskon untuk pelanggan yang sudah tergolong Champions."
        ],
        refTitle: "Kaggle Learn: Customer Segmentation with RFM",
        refUrl: "https://www.kaggle.com/code/learn-pandas"
      },
      {
        num: "8.6",
        slug: "8-6-pemodelan-jalur-konversi-pelanggan-funnel-analysis",
        title: "8.6. Pemodelan Jalur Konversi Pelanggan (Funnel Analysis)",
        desc: "Pemetaan alur pengguna (User Journey): tahapan funnel e-commerce (Impression, Product View, Add to Cart, Checkout, Purchase), dan definisi alur terbuka vs tertutup.",
        concept: `Funnel Analysis (Analisis Corong Konversi) melacak pergerakan pengguna melalui serangkaian langkah sekuensial terstruktur yang dirancang untuk membawa mereka menuju tujuan konversi akhir (misalnya menyelesaikan pembayaran atau berlangganan tahunan).

Nama 'Corong' (Funnel) digunakan karena jumlah pengguna secara alami menyusut pada setiap langkah berikutnya: tidak semua orang yang melihat iklan akan mengklik produk, tidak semua yang melihat produk akan memasukkan ke keranjang (Add to Cart), dan tidak semua yang mulai mengisi alamat akan menyelesaikan transaksi checkout.

Dua tipe arsitektur funnel adalah:
1. Closed Funnel (Corong Tertutup): Pengguna wajib menyelesaikan setiap langkah secara berurutan persis dari Langkah 1 hingga selesai untuk dihitung sebagai konversi.
2. Open Funnel (Corong Terbuka): Pengguna dapat melompat masuk ke tahapan mana pun di tengah-tengah jalur alur dan tetap dihitung pada langkah tersebut.`,
        code: `# 8.6: Konstruksi Data Corong Konversi E-Commerce (Funnel Tracking)
import pandas as pd

# Data langkah konversi perjalanan pengguna di platform e-commerce
funnel_data = pd.DataFrame({
    'Tahap_Alur': ['1. Kunjungan Beranda', '2. Lihat Detail Produk', '3. Masuk Keranjang (Cart)', '4. Mulai Checkout', '5. Transaksi Selesai'],
    'Jumlah_Pengguna': [100000, 45000, 18000, 9000, 3600]
})

# Menghitung konversi absolut terhadap langkah pertama (Top of Funnel)
total_awal = funnel_data.iloc[0]['Jumlah_Pengguna']
funnel_data['Konversi_Overall_Pct'] = (funnel_data['Jumlah_Pengguna'] / total_awal * 100).round(2)

print("=== CORONG KONVERSI E-COMMERCE END-TO-END ===")
print(funnel_data.to_string(index=False))`,
        expectedOutput: "Tabel corong konversi menampilkan penurunan dari 100.000 kunjungan ke 3.600 transaksi (3.6% konversi).",
        codeExp: "Skrip memodelkan hierarki lima tahap alur perjalanan belanja pengguna dan menghitung konversi keseluruhan relatif terhadap populasi teratas corong.",
        pitfalls: [
          "Mendefinisikan langkah funnel yang tidak memiliki batasan waktu (Time Window Constraints), menganggap orang yang melihat produk 6 bulan lalu dan checkout hari ini sebagai satu alur konversi langsung.",
          "Mengabaikan pengguna yang melakukan browsing multi-tab secara simultan yang mencatatkan duplikasi event log."
        ],
        refTitle: "Amplitude: Mastering Funnel Analysis in Product Analytics",
        refUrl: "https://amplitude.com/blog/funnel-analysis"
      },
      {
        num: "8.7",
        slug: "8-7-kuantifikasi-drop-off-tiap-tahap-corong-penjualan",
        title: "8.7. Kuantifikasi Drop-Off Tiap Tahap Corong Penjualan",
        desc: "Diagnosa kebocoran corong: perhitungan Conversion Rate langkah-ke-langkah (Step-to-Step CR), Drop-Off Rate, dan identifikasi friksi terbesar (Bottleneck Analysis).",
        concept: `Mengukur rasio konversi keseluruhan (Overall CR) saja tidak cukup untuk memperbaiki produk. Analis data harus mampu menunjukkan dengan tepat di mana letak 'kebocoran' terbesar dalam corong penjualan (Leakage Point / Bottleneck).

Metrik yang digunakan untuk diagnosa ini adalah Rasio Konversi Langkah-ke-Langkah (Step-to-Step Conversion Rate) dan Rasio Pengabaian (Drop-off Rate). Drop-off Rate pada Tahap $k$ mengukur persentase pengguna yang telah menyelesaikan Tahap $k-1$ namun gagal melanjutkan ke Tahap $k$.

Tahap dengan Drop-off Rate paling tajam—misalnya penurunan 70% antara tahap 'Mulai Checkout' dan 'Transaksi Selesai'—merupakan petunjuk langsung bagi tim produk untuk menyelidiki masalah teknis atau psikologis pada halaman tersebut, seperti metode pembayaran yang tidak lengkap, biaya ongkos kirim tersembunyi yang mengejutkan pembeli, atau tombol submit yang error pada peramban seluler.`,
        formula: `\\text{Drop-Off Rate}_k = \\left( 1 - \\frac{\\text{Pengguna}_k}{\\text{Pengguna}_{k-1}} \\right) \\times 100\\%`,
        code: `# 8.7: Perhitungan Step-to-Step Conversion dan Drop-off Rate
import pandas as pd

funnel_bottleneck = pd.DataFrame({
    'Tahapan': ['Homepage', 'Product Page', 'Cart', 'Checkout', 'Success Payment'],
    'Pengunjung': [50000, 20000, 12000, 4000, 3200]
})

# Menghitung retensi langkah sebelumnya via shift()
funnel_bottleneck['Pengunjung_Langkah_Sebelumnya'] = funnel_bottleneck['Pengunjung'].shift(1)
funnel_bottleneck['Step_CR_Pct'] = (
    (funnel_bottleneck['Pengunjung'] / funnel_bottleneck['Pengunjung_Langkah_Sebelumnya']) * 100
).round(1)
funnel_bottleneck['Drop_Off_Pct'] = (100 - funnel_bottleneck['Step_CR_Pct']).round(1)

print("=== DIAGNOSA KEBOCORAN ALUR KONVERSI (BOTTLENECK AUDIT) ===")
print(funnel_bottleneck[['Tahapan', 'Pengunjung', 'Step_CR_Pct', 'Drop_Off_Pct']])

# Menemukan titik kebocoran terbesar (Drop-off tertinggi)
terburuk = funnel_bottleneck.loc[funnel_bottleneck['Drop_Off_Pct'].idxmax()]
print(f"\\n[AKAR MASALAH] Titik kebocoran paling kritis berada pada tahap '{terburuk['Tahapan']}'")
print(f"               dengan Drop-Off sebesar {terburuk['Drop_Off_Pct']}%!")`,
        expectedOutput: "Diagnosa mengidentifikasi tahap Checkout memiliki drop-off tertinggi sebesar 66.7%.",
        codeExp: "Skrip memanfaatkan operasi shift() untuk membandingkan pengguna antar langkah berturutan secara tervektorisasi dan mendeteksi secara otomatis titik kebocoran terbesar yang membutuhkan intervensi mendesak.",
        pitfalls: [
          "Menyimpulkan penyebab drop-off tanpa memeriksa segmentasi perangkat (misal: drop-off checkout ternyata 90% terjadi di browser Safari iOS akibat bug JavaScript).",
          "Membandingkan rasio konversi funnel antar periode tanpa memastikan volume trafik yang masuk memiliki komposisi sumber kanal yang sama."
        ],
        refTitle: "Google Analytics 4 Help: Funnel Exploration",
        refUrl: "https://support.google.com/analytics/answer/9327972"
      },
      {
        num: "8.8",
        slug: "8-8-perhitungan-customer-lifetime-value-clv-cac",
        title: "8.8. Perhitungan Customer Lifetime Value (CLV) & Customer Acquisition Cost (CAC)",
        desc: "Metrik kelayakan finansial jangka panjang: formula Historic vs Predictive CLV, Average Order Value (AOV), Purchase Frequency, Gross Margin, dan rasio emas LTV/CAC.",
        concept: `Customer Lifetime Value (CLV atau LTV) adalah proyeksi total pendapatan bersih atau laba kotor yang akan dihasilkan oleh seorang pelanggan selama kurun waktu hubungan bisnisnya dengan perusahaan. CLV adalah salah satu metrik bisnis terpenting karena menentukan berapa batas biaya maksimum yang boleh dikeluarkan perusahaan untuk mengakuisisi pelanggan baru (Customer Acquisition Cost / CAC).

Secara fundamental, formula dasar CLV historis merupakan fungsi dari empat komponen ekonomi:
1. Rata-rata Nilai Pesanan (Average Order Value / AOV)
2. Frekuensi Pembelian Tahunan (Purchase Frequency / PF)
3. Rata-rata Masa Retensi Pelanggan (Customer Lifespan / $t = 1 / \\text{Churn Rate}$)
4. Margin Laba Kotor (Gross Margin Percentage)

Jika CLV seorang pelanggan adalah Rp 1.500.000 dan biaya akuisisi pemasarannya (CAC) adalah Rp 300.000, rasio LTV:CAC bernilai 5:1, yang menunjukkan model bisnis yang sangat menguntungkan dan siap untuk percepatan ekspansi modal.`,
        formula: `\\text{CLV} = \\text{AOV} \\times \\text{Purchase Frequency} \\times \\left( \\frac{1}{\\text{Churn Rate}} \\right) \\times \\text{Gross Margin \\%}`,
        code: `# 8.8: Model Komputasi Customer Lifetime Value (CLV) Multi-Skenario
aov = 450000              # Rata-rata belanja per pesanan (Rp)
frekuensi_tahunan = 4.2   # Pesanan per tahun
gross_margin_pct = 0.40   # 40% Margin kotor
churn_rate_tahunan = 0.25 # 25% Pelanggan berhenti per tahun

# 1. Menghitung Customer Lifespan (Tahun)
customer_lifespan_thn = 1.0 / churn_rate_tahunan  # 4.0 Tahun

# 2. Menghitung Nilai Pelanggan Tahunan (Annual Customer Value)
nilai_tahunan = aov * frekuensi_tahunan

# 3. Menghitung Customer Lifetime Value
clv = nilai_tahunan * customer_lifespan_thn * gross_margin_pct

# Evaluasi terhadap Biaya Akuisisi (CAC)
cac = 500000 # Biaya akuisisi Rp 500.000 per user
ltv_to_cac = clv / cac

print("=== MODEL PERHITUNGAN CUSTOMER LIFETIME VALUE (CLV) ===")
print(f"Average Order Value (AOV)     : Rp {aov:,.0f}")
print(f"Frekuensi Belanja Tahunan     : {frekuensi_tahunan:.1f} kali / tahun")
print(f"Proyeksi Umur Pelanggan       : {customer_lifespan_thn:.1f} tahun")
print(f"Customer Lifetime Value (CLV) : Rp {clv:,.0f}")
print(f"Rasio LTV terhadap CAC        : {ltv_to_cac:.2f}x")`,
        expectedOutput: "Kalkulasi menghasilkan umur pelanggan 4 tahun dan CLV Rp 3.024.000 dengan rasio LTV:CAC 6.05x.",
        codeExp: "Skrip menerapkan formula resmi ekonomi unit bisnis untuk memproyeksikan nilai moneter seumur hidup pelanggan berdasarkan interaksi frekuensi, batas churn, dan margin laba kotor.",
        pitfalls: [
          "Menghitung CLV berbasis pendapatan kotor (Revenue) alih-alih laba kotor (Gross Profit), yang menghasilkan estimasi nilai berlebih yang berbahaya.",
          "Mengasumsikan churn rate nol atau menggunakan masa hidup pelanggan tak terhingga (infinity lifespan) dalam proyeksi."
        ],
        refTitle: "Harvard Business Review: Customer Lifetime Value Made Simple",
        refUrl: "https://hbr.org/2014/07/how-valuable-is-your-best-customer"
      },
      {
        num: "8.9",
        slug: "8-9-analisis-basket-belanja-market-basket-apriori",
        title: "8.9. Analisis Basket Belanja (Market Basket Analysis & Apriori Association)",
        desc: "Penemuan pola asosiasi produk: konsep Support, Confidence, Lift, aturan keterkaitan (Association Rules), dan penerapannya pada rekomendasi bundel produk (Cross-Selling).",
        concept: `Market Basket Analysis (Analisis Keranjang Belanja) meneliti kumpulan barang yang dibeli bersamaan oleh konsumen dalam satu transaksi untuk menemukan asosiasi produk yang tersembunyi. Contoh klasik dalam legenda analitik ritel adalah penemuan bahwa pembeli popok bayi di hari Jumat sore seringkali membeli bir secara bersamaan.

Tiga metrik matematis yang mendasari algoritma asosiasi (seperti Apriori):
1. Support: Frekuensi kemunculan kombinasi produk $A$ dan $B$ di seluruh transaksi (seberapa populer bundel ini?).
2. Confidence: Probabilitas bersyarat bahwa pembeli produk $A$ juga akan membeli produk $B$ (jika membeli $A$, seberapa yakin mereka membeli $B$?).
3. Lift: Rasio antara frekuensi pembelian bersama aktual terhadap ekspektasi pembelian bersama acak independen. Nilai Lift > 1.0 membuktikan adanya asosiasi positif yang kuat (kedua produk saling mendorong penjualan).`,
        formula: `\\text{Lift}(A \\rightarrow B) = \\frac{\\text{Confidence}(A \\rightarrow B)}{\\text{Support}(B)} = \\frac{P(A \\cap B)}{P(A) \\times P(B)}`,
        code: `# 8.9: Perhitungan Metrik Asosiasi Market Basket: Support, Confidence, Lift
import pandas as pd

# Matriks transaksi pembelian toko buku
transaksi_buku = [
    {'Buku_Python': 1, 'Buku_SQL': 1, 'Kopi_Sachet': 1},
    {'Buku_Python': 1, 'Buku_SQL': 1, 'Kopi_Sachet': 0},
    {'Buku_Python': 1, 'Buku_SQL': 0, 'Kopi_Sachet': 0},
    {'Buku_Python': 0, 'Buku_SQL': 1, 'Kopi_Sachet': 1},
    {'Buku_Python': 1, 'Buku_SQL': 1, 'Kopi_Sachet': 1}
]
df_transaksi = pd.DataFrame(transaksi_buku)
total_trx = len(df_transaksi)

# Aturan: Jika beli Buku Python (A) -> Apakah beli Buku SQL (B)?
support_a = df_transaksi['Buku_Python'].sum() / total_trx
support_b = df_transaksi['Buku_SQL'].sum() / total_trx
support_a_dan_b = ((df_transaksi['Buku_Python'] == 1) & (df_transaksi['Buku_SQL'] == 1)).sum() / total_trx

confidence = support_a_dan_b / support_a
lift = confidence / support_b

print("=== EVALUASI ATURAN ASOSIASI (MARKET BASKET) ===")
print(f"Aturan: [Buku Python] ---> [Buku SQL]")
print(f"Support (A dan B Muncul Bersama) : {support_a_dan_b*100:.1f}%")
print(f"Confidence (Keyakinan Aturan)     : {confidence*100:.1f}%")
print(f"Lift Ratio                       : {lift:.2f} (Lift > 1.0: Asosiasi Positif Signifikan)")`,
        expectedOutput: "Kalkulasi menghasilkan Support 60%, Confidence 75%, dan Lift 0.94 (mendekati 1).",
        codeExp: "Skrip menghitung metrik fundamental algoritma asosiasi Apriori secara deterministik menggunakan operasi Boolean Pandas untuk mengevaluasi kelayakan strategi bundling produk.",
        pitfalls: [
          "Menerapkan diskon bundel pada dua produk yang memiliki Lift bernilai 1.0 (produk yang dibeli independen murni secara kebetulan), yang membuang margin laba tanpa menaikkan volume.",
          "Menjalankan algoritma Apriori pada ribuan produk sekaligus tanpa ambang batas minimum support (min_support), yang memicu ledakan komputasi kombinatorial."
        ],
        refTitle: "Agrawal, Imieliński, Swami: Mining Association Rules between Sets of Items in Large Databases",
        refUrl: "https://dl.acm.org/doi/10.1145/170035.170072"
      },
      {
        num: "8.10",
        slug: "8-10-translasi-segmen-rfm-funnel-menjadi-strategi-bisnis",
        title: "8.10. Translasi Segmen RFM & Funnel Menjadi Strategi Retensi Bisnis Nyata",
        desc: "Penerapan strategi operasional: pemetaan taktik pemasaran per segmen RFM, alokasi anggaran retensi vs akuisisi, otomatisasi kampanye email/push-notification, dan pengukuran kenaikan omzet (Incrementality).",
        concept: `Wawasan analitik tidak bernilai jika berhenti sebagai laporan presentasi. Nilai sebenarnya dari segmentasi RFM dan analisis funnel terwujud ketika hasil analisis ditranslasikan menjadi otomatisasi tindakan operasional bisnis (Actionable Execution).

Setiap segmen pelanggan menuntut pesan, insentif, dan saluran komunikasi yang berbeda secara spesifik:
1. Champions: Jangan beri diskon harga (karena mereka akan tetap membeli dengan harga normal). Berikan perlakuan VIP, akses awal ke produk baru, dan program loyalitas eksklusif.
2. At-Risk High Value: Segmen paling kritis untuk diselamatkan. Kirimkan email personalisasi dengan diskon agresif atau hubungi melalui tim Customer Success sebelum mereka berpindah secara permanen ke kompetitor.
3. Drop-off Cart: Picu notifikasi dorong otomatis (Abandoned Cart Push Notification) dalam kurun waktu 1 hingga 3 jam setelah pengguna meninggalkan aplikasi, lengkap dengan pengingat stok terbatas.

Pengukuran keberhasilan strategi harus selalu menggunakan grup kontrol (A/B Test Holdout Group) untuk memastikan kenaikan transaksi benar-benar disebabkan oleh intervensi analitik (Incremental Lift), bukan transaksi organik yang memang akan terjadi dengan sendirinya.`,
        code: `# 8.10: Matriks Tindakan Operasional Pemasaran Berdasarkan Segmen RFM
import pandas as pd

matriks_aksi = pd.DataFrame({
    'Segmen_RFM': ['Champions', 'Loyal Customers', 'Promising New Users', 'At-Risk High Value', 'Lost Customers'],
    'Prioritas_Bisnis': ['Pertahankan & Apresiasi', 'Dorong Cross-Selling', 'Bimbing Onboarding', 'Penyelamatan Agresif', 'Filter / Kurangi Biaya'],
    'Taktik_Komunikasi': [
        'Akses eksklusif VIP & Early Access produk baru tanpa diskon',
        'Rekomendasi bundel produk terkait (Market Basket Cross-sell)',
        'Edukasi fitur utama & voucher diskon pembelian kedua',
        'Diskon re-aktivasi 25% + Pesan personal dari tim layanan',
        'Keluarkan dari kampanye iklan berbayar (Hemat Anggaran CPA)'
    ],
    'KPI_Evaluasi': ['Net Promoter Score (NPS)', 'Average Order Value (AOV)', '2nd Purchase Rate', 'Win-Back Conversion Rate', 'Penghematan Ad Spend']
})

print("=== MATRIKS OPERASIONALISASI TINDAKAN STRATEGIS RFM ===")
print(matriks_aksi.to_string(index=False))`,
        expectedOutput: "Matriks panduan operasional tindakan bisnis per segmen tercetak terstruktur.",
        codeExp: "Skrip merumuskan cetak biru operasionalisasi data analitik ke dunia nyata, memetakan setiap segmen perilaku ke tindakan taktis, saluran pesan yang tepat, dan metrik keberhasilan objektif.",
        pitfalls: [
          "Menghabiskan biaya pemasaran terbesar untuk mencoba mengaktifkan kembali segmen 'Lost' yang sudah tidak aktif selama bertahun-tahun alih-alih menyelamatkan segmen 'At-Risk'.",
          "Melakukan spam notifikasi kepada seluruh basis pengguna secara serentak tanpa memperhatikan preferensi segmen RFM."
        ],
        refTitle: "Philip Kotler: Marketing Management - Customer Retention Strategies",
        refUrl: "https://www.pearson.com/"
      }
    ]
  },

  // ==========================================
  // BAB 9: Pengujian Hipotesis A/B Testing & Eksperimentasi Bisnis
  // ==========================================
  {
    orderIndex: 9,
    id: "data-analyst-ch-9",
    slug: "bab-9-pengujian-hipotesis-ab-testing-eksperimentasi-bisnis",
    title: "BAB 9: Pengujian Hipotesis A/B Testing & Eksperimentasi Bisnis",
    desc: "Metodologi eksperimentasi ilmiah dalam bisnis: perumusan hipotesis statistik formal, penentuan ukuran sampel dan kekuatan uji (Statistical Power), mitigasi Sample Ratio Mismatch (SRM), uji parametrik (t-test, Z-test), uji non-parametrik Mann-Whitney, serta pencegahan p-hacking.",
    coreConcepts: ["Controlled Experimentation", "Statistical Power & Sample Size", "Sample Ratio Mismatch", "Two-Sample t-Test", "Two-Proportion Z-Test", "P-Hacking Mitigation"],
    subchapters: [
      {
        num: "9.1",
        slug: "9-1-fondasi-eksperimentasi-bisnis-terkontrol-ab-testing",
        title: "9.1. Fondasi Eksperimentasi Bisnis Terkontrol & Konsep A/B Testing",
        desc: "Metode ilmiah dalam inovasi produk: Randomized Controlled Trials (RCT) di lingkungan digital, pembagian varian Kontrol vs Perlakuan (Treatment), dan bahaya membuat keputusan berbasis opini HiPPO.",
        concept: `Dalam dunia bisnis tradisional, keputusan perubahan produk seringkali didasarkan pada opini subjektif orang dengan gaji tertinggi di ruang rapat (dikenal dengan akronim HiPPO: Highest Paid Person's Opinion). Pendekatan ini terbukti sangat berbahaya dan seringkali merugikan jutaan dolar.

A/B Testing—atau Randomized Controlled Trial (RCT) di dunia digital—menggantikan dugaan subjektif dengan bukti empiris objektif. Dalam eksperimen A/B terkontrol standar, pengguna yang masuk ke platform secara acak dibagi menjadi dua kelompok terisolasi:
1. Kelompok Kontrol ($A$): Melihat versi produk yang sudah ada saat ini (Baseline).
2. Kelompok Perlakuan ($B$ / Treatment): Melihat versi baru dengan modifikasi spesifik (misalnya alur pembayaran baru, tombol aksi berbeda, atau algoritma rekomendasi baru).

Karena kedua kelompok berjalan secara bersamaan di waktu yang sama, seluruh faktor eksternal (musim belanja, kondisi ekonomi makro, gangguan server) memengaruhi kedua kelompok secara seimbang. Perbedaan performa metrik yang diamati dapat diatribusikan secara kausal murni terhadap perubahan fitur yang diuji.`,
        code: `# 9.1: Konseptualisasi Alokasi Acak Eksperimen A/B Testing
import pandas as pd
import numpy as np

# Simulasi pengalokasian 10.000 pengguna ke Kontrol vs Treatment (50:50)
np.random.seed(42)
n_users = 10000
user_ids = np.arange(1, n_users + 1)
alokasi = np.random.choice(['Kontrol (A)', 'Treatment (B)'], size=n_users, p=[0.5, 0.5])

df_ab = pd.DataFrame({'user_id': user_ids, 'varian': alokasi})
ringkasan_alokasi = df_ab['varian'].value_counts()

print("=== DISTRIBUSI ALOKASI PENGGUNA EKSPERIMEN TERKONTROL ===")
print(ringkasan_alokasi)
print(f"\\nDeviasi Proporsi dari 50%: {abs(ringkasan_alokasi['Kontrol (A)'] - 5000) / 10000 * 100:.2f}%")`,
        expectedOutput: "Pengguna terbagi hampir persis 50:50 dengan deviasi acak sangat kecil (0.2%).",
        codeExp: "Skrip menyimulasikan proses randomisasi pengguna secara seragam, fondasi utama yang menjamin kedua kelompok eksperimen memiliki karakteristik demografi dan perilaku yang seimbang.",
        pitfalls: [
          "Menjalankan varian A di minggu pertama dan varian B di minggu kedua (Before-and-After test) alih-alih menjalankannya secara bersamaan, yang mencampuradukkan efek musiman dengan efek fitur.",
          "Mengizinkan pemangku kepentingan mengubah alokasi di tengah eksperimen yang sedang berjalan."
        ],
        refTitle: "Ron Kohavi, Diane Tang, Ya Xu: Trustworthy Online Controlled Experiments",
        refUrl: "https://experimentguide.com/"
      },
      {
        num: "9.2",
        slug: "9-2-perumusan-hipotesis-statistik-h0-h1-bisnis",
        title: "9.2. Perumusan Hipotesis Nol (H0) dan Hipotesis Alternatif (H1) Bisnis",
        desc: "Formalisasi pengujian ilmiah: definisi Hipotesis Nol (ketiadaan efek), Hipotesis Alternatif satu-arah vs dua-arah, penetapan tingkat signifikansi alpha, dan risiko Type I vs Type II Error.",
        concept: `Sebelum eksperimen dimulai, analis wajib merumuskan hipotesis ilmiah secara formal tertulis guna mencegah bias konfirmasi pasca-eksperimen. Pengujian statistik selalu membandingkan dua hipotesis yang saling bertentangan:

1. Hipotesis Nol ($H_0$): Asumsi konservatif bahwa perubahan pada varian $B$ tidak memberikan pengaruh apa pun terhadap metrik bisnis (perbedaan yang teramati semata-mata akibat fluktuasi acak sampling):
   $$H_0: \\mu_B - \\mu_A = 0$$
2. Hipotesis Alternatif ($H_1$): Asumsi bahwa varian $B$ memberikan pengaruh nyata yang signifikan secara statistik:
   $$H_1: \\mu_B - \\mu_A \\neq 0$$

Pengambilan keputusan statistik selalu dihadapkan pada dua jenis risiko kesalahan:
- Kesalahan Tipe I (False Positive / $\\alpha$): Menolak $H_0$ padahal $H_0$ sebenarnya benar (meluncurkan fitur baru yang sebenarnya tidak berguna). Standar industri menetapkan $\\alpha = 0.05$ (toleransi kesalahan 5%).
- Kesalahan Tipe II (False Negative / $\\beta$): Gagal menolak $H_0$ padahal fitur baru sebenarnya memberikan perbaikan nyata. Standar industri menargetkan $\\beta = 0.20$ (Statistical Power = $1 - \\beta = 80\\%$).`,
        formula: `\\text{Statistical Power} = 1 - \\beta = P(\\text{Tolak } H_0 \\mid H_1 \\text{ Benar})`,
        code: `# 9.2: Matriks Kontingensi Risiko Keputusan Hipotesis Statistik
import pandas as pd

matriks_keputusan = pd.DataFrame({
    'Kenyataan_Fakta': ['H0 Sebenarnya Benar (Fitur Tidak Berguna)', 'H1 Sebenarnya Benar (Fitur Efektif)'],
    'Keputusan_Luncurkan_Fitur': ['Type I Error (False Positive, alpha = 0.05)', 'Keputusan Benar (True Positive / Power = 0.80)'],
    'Keputusan_Jangan_Luncurkan': ['Keputusan Benar (True Negative = 0.95)', 'Type II Error (False Negative, beta = 0.20)']
})

print("=== MATRIKS RISIKO PENGUJIAN HIPOTESIS STATISTIK ===")
print(matriks_keputusan.to_string(index=False))`,
        expectedOutput: "Tabel matriks kontingensi Type I dan Type II error tercetak rapi.",
        codeExp: "Skrip merangkum kerangka kerja pengambilan keputusan statistik formal, memetakan risiko False Positive (alpha) dan False Negative (beta) dalam eksperimentasi produk digital.",
        pitfalls: [
          "Merumuskan hipotesis satu arah (One-Tailed Test) hanya untuk mempermudah mendapatkan p-value kecil, yang mengabaikan risiko jika fitur baru ternyata merusak metrik bisnis.",
          "Mengubah definisi hipotesis di tengah jalan setelah melihat data sementara."
        ],
        refTitle: "OpenStax Introductory Statistics: Hypothesis Testing",
        refUrl: "https://openstax.org/details/books/introductory-statistics"
      },
      {
        num: "9.3",
        slug: "9-3-penentuan-ukuran-sampel-sample-size-statistical-power",
        title: "9.3. Penentuan Ukuran Sampel (Sample Size Calculation) & Analisis Power",
        desc: "Kalkulasi ukuran sampel sebelum eksperimen: interaksi antara baseline conversion, Minimum Detectable Effect (MDE), tingkat signifikansi alpha, dan statistical power beta.",
        concept: `Berapa banyak pengguna yang harus masuk ke dalam eksperimen A/B sebelum analis dapat menarik kesimpulan yang sah? Menjalankan eksperimen dengan sampel terlalu sedikit membuat eksperimen 'Underpowered' (tidak memiliki daya statistik untuk mendeteksi perubahan nyata). Sebaliknya, menjalankan eksperimen terlalu lama membuang peluang bisnis dan waktu pengembangan.

Perhitungan ukuran sampel bergantung pada empat parameter:
1. Baseline Conversion Rate ($p_1$): Rasio konversi saat ini sebelum perubahan.
2. Minimum Detectable Effect (MDE / $\\delta$): Kenaikan relatif terkecil yang dianggap bermakna secara bisnis untuk dipertahankan (misalnya perbaikan konversi minimal 5%). Semakin kecil efek yang ingin dideteksi, semakin banyak ukuran sampel yang dibutuhkan secara kuadratik.
3. Tingkat Signifikansi ($\\alpha$): Umumnya 5% ($Z_{\\alpha/2} = 1.96$).
4. Kekuatan Statistik ($1 - \\beta$): Umumnya 80% ($Z_\\beta = 0.84$).`,
        formula: `n = \\frac{2 \\left( Z_{\\alpha/2} + Z_\\beta \\right)^2 \\times p(1-p)}{\\delta^2}`,
        code: `# 9.3: Kalkulasi Kebutuhan Ukuran Sampel A/B Testing secara Matematis
import numpy as np
import scipy.stats as stats

def hitung_ukuran_sampel(baseline_cr, mde_relatif, alpha=0.05, power=0.80):
    p1 = baseline_cr
    p2 = baseline_cr * (1 + mde_relatif)
    p_bar = (p1 + p2) / 2
    
    z_alpha = stats.norm.ppf(1 - alpha / 2)
    z_beta = stats.norm.ppf(power)
    
    # Formula Evan Miller untuk perbandingan dua proporsi
    n_per_varian = (
        (z_alpha * np.sqrt(2 * p_bar * (1 - p_bar)) + 
         z_beta * np.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2
    ) / ((p2 - p1) ** 2)
    
    return int(np.ceil(n_per_varian))

# Skenario: Baseline Konversi 5.0%, Ingin Mendeteksi Kenaikan Relatif 10% (ke 5.5%)
baseline = 0.05
mde = 0.10
n_sampel = hitung_ukuran_sampel(baseline, mde)

print("=== KALKULASI UKURAN SAMPEL EKSPERIMEN A/B ===")
print(f"Baseline Conversion Rate : {baseline*100:.1f}%")
print(f"Target Deteksi (MDE)    : +{mde*100:.1f}% Relatif (Menjadi {baseline*(1+mde)*100:.2f}%)")
print(f"Signifikansi (Alpha)     : 5.0%")
print(f"Statistical Power        : 80.0%")
print(f"Kebutuhan Sampel Minimum : {n_sampel:,} Pengguna PER VARIAN")
print(f"Total Pengguna Dibutuhkan: {n_sampel * 2:,} Pengguna (Kontrol + Treatment)")`,
        expectedOutput: "Kalkulasi menunjukkan kebutuhan sekitar 31.000 pengguna per varian untuk mendeteksi MDE 10%.",
        codeExp: "Skrip menerapkan formula ukuran sampel statistik presisi menggunakan persentil distribusi normal baku dari scipy.stats, memberikan jaminan bahwa eksperimen memiliki kekuatan statistik memadai sebelum diluncurkan.",
        pitfalls: [
          "Menghentikan eksperimen lebih awal begitu melihat p-value < 0.05 padahal target ukuran sampel belum tercapai (Peeking Problem).",
          "Memasang target MDE yang terlalu optimis dan tidak realistis (misal +50%) hanya agar kebutuhan sampel terlihat sedikit."
        ],
        refTitle: "Evan Miller: Sample Size Calculator for A/B Testing",
        refUrl: "https://www.evanmiller.org/ab-testing/sample-size.html"
      },
      {
        num: "9.4",
        slug: "9-4-desain-randomisasi-mitigasi-sample-ratio-mismatch-srm",
        title: "9.4. Desain Randomisasi Pengguna & Mitigasi Sample Ratio Mismatch (SRM)",
        desc: "Audit integritas eksperimen: uji kesesuaian rasio sampel menggunakan Chi-Square Goodness-of-Fit test, penyebab umum SRM (bot filtering, redirect latency), dan protokol pembatalan eksperimen.",
        concept: `Sebelum analis memeriksa metrik bisnis apa pun (seperti pendapatan atau konversi), ada satu uji kesehatan eksperimen wajib yang harus dilakukan terlebih dahulu: Uji Sample Ratio Mismatch (SRM).

Jika eksperimen dirancang untuk membagi pengguna dengan rasio 50:50 antara Kontrol dan Treatment, maka rasio jumlah pengguna yang tercatat di database juga harus mendekati 50:50. Jika hasil pencatatan menunjukkan 51.500 pengguna di Kontrol dan 48.500 di Treatment, perbedaan 3.000 pengguna ini hampir pasti bukan karena kebetulan acak ($p < 0.001$).

Kondisi ini disebut Sample Ratio Mismatch (SRM). SRM mengindikasikan adanya kerusakan mendasar pada sistem pengalokasian atau pencatatan log—misalnya varian Treatment mengalami crash di browser tertentu, lambat memuat halaman sehingga pengguna mental sebelum tracker mencatat event, atau bot scraping tersaring secara asimetris. Eksperimen yang mengalami SRM harus dinyatakan tidak valid dan hasilnya dibatalkan sepenuhnya.`,
        formula: `\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}`,
        code: `# 9.4: Uji Chi-Square Goodness-of-Fit untuk Mendeteksi SRM
import scipy.stats as stats

# Kasus: Rencana alokasi 50:50, observasi lapangan tercatat:
n_kontrol = 51200
n_treatment = 48800
total_users = n_kontrol + n_treatment

# Ekspektasi teoritis (50% dari total)
ekspektasi_kontrol = total_users * 0.5
ekspektasi_treatment = total_users * 0.5

# Uji Chi-Square Goodness of Fit
chi2_stat, p_value = stats.chisquare(
    f_obs=[n_kontrol, n_treatment],
    f_exp=[ekspektasi_kontrol, ekspektasi_treatment]
)

print("=== DIAGNOSA SAMPLE RATIO MISMATCH (SRM) ===")
print(f"Pengguna Kontrol   : {n_kontrol:,}")
print(f"Pengguna Treatment : {n_treatment:,}")
print(f"Chi-Square Statistik: {chi2_stat:.4f}")
print(f"p-value            : {p_value:.4e}")

if p_value < 0.001:
    print("\\n[BAHAYA KRITIS] Terdeteksi Sample Ratio Mismatch (SRM)! Eksperimen CACAT & Tidak Valid.")
else:
    print("\\n[LOLOS AUDIT] Rasio sampel seimbang dan sehat.")`,
        expectedOutput: "Uji mendeteksi p-value sangat kecil (< 0.001) yang membuktikan adanya SRM signifikan.",
        codeExp: "Skrip mengeksekusi uji Chi-Square untuk mendeteksi deviasi alokasi sampel, menyediakan prosedur audit keamanan otomatis sebelum metrik konversi dievaluasi.",
        pitfalls: [
          "Menganalisis hasil konversi pada eksperimen yang mengalami SRM, yang menghasilkan kesimpulan palsu akibat populasi yang bias.",
          "Menganggap deviasi rasio kecil (misal 51:49) sebagai variasi acak wajar pada dataset berukuran besar tanpa melakukan uji Chi-Square formal."
        ],
        refTitle: "Lukas Vermeer: Diagnosing Sample Ratio Mismatch in Online Experiments",
        refUrl: "https://exp-platform.com/Documents/2019_FabijanGupteVermeerTxu_SRM.pdf"
      },
      {
        num: "9.5",
        slug: "9-5-uji-hipotesis-rata-rata-two-sample-t-test",
        title: "9.5. Uji Hipotesis Rata-rata: Two-Sample Independent Student's t-Test",
        desc: "Pengujian variabel metrik kontinu: formula Welch's t-test (varians tidak homogen), penentuan derajat kebebasan (df), evaluasi p-value, dan batas interval kepercayaan delta rata-rata.",
        concept: `Saat metrik keberhasilan bisnis berupa variabel kontinu (seperti Nilai Belanja Rata-rata / AOV, Pendapatan per Pengguna / ARPU, atau Durasi Waktu di Situs), alat statistik yang tepat adalah Two-Sample Independent t-Test.

Dalam pengujian data dunia nyata, varians populasi kelompok kontrol dan perlakuan jarang sekali bernilai homogen (sama persis). Oleh karena itu, standar industri yang direkomendasikan adalah Welch's t-Test (t-test tidak berpasangan dengan varians tidak sama / unequal variances), bukan Student's t-test klasik yang mengasumsikan homogenitas varians.

Nilai p-value yang dihasilkan menyatakan probabilitas mengamati selisih rata-rata sebesar itu (atau lebih ekstrem) jika hipotesis nol benar. Jika $p < 0.05$, analis dapat menolak $H_0$ dan menyimpulkan bahwa varian baru secara nyata meningkatkan pendapatan rata-rata pengguna.`,
        formula: `t = \\frac{\\bar{X}_1 - \\bar{X}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}`,
        code: `# 9.5: Pengujian Welch's t-Test Dua Sampel Independen di SciPy
import numpy as np
import scipy.stats as stats

# Mensimulasikan data nilai belanja pengguna (AOV dalam Rupiah)
np.random.seed(42)
belanja_kontrol = np.random.normal(loc=250000, scale=40000, size=1500)
# Treatment menghasilkan kenaikan rata-rata belanja sebesar Rp 6.000
belanja_treatment = np.random.normal(loc=256000, scale=45000, size=1500)

# Uji Welch's t-Test (equal_var=False)
t_stat, p_val = stats.ttest_ind(belanja_treatment, belanja_kontrol, equal_var=False)

mean_ctrl = np.mean(belanja_kontrol)
mean_trt = np.mean(belanja_treatment)
delta_mean = mean_trt - mean_ctrl
pct_lift = (delta_mean / mean_ctrl) * 100

print("=== PENGUJIAN METRIK KONTINU (WELCH'S T-TEST) ===")
print(f"Rata-rata Kontrol   : Rp {mean_ctrl:,.2f}")
print(f"Rata-rata Treatment : Rp {mean_trt:,.2f}")
print(f"Kenaikan Delta      : Rp {delta_mean:,.2f} (+{pct_lift:.2f}%)")
print(f"t-statistic         : {t_stat:.4f}")
print(f"p-value             : {p_val:.4f}")

if p_val < 0.05:
    print("\\n[SIGNIFIKAN] Perbedaan rata-rata terbukti nyata secara statistik (Tolak H0).")
else:
    print("\\n[TIDAK SIGNIFIKAN] Perbedaan belum cukup bukti statistik (Gagal Tolak H0).")`,
        expectedOutput: "Welch's t-test membuktikan p-value < 0.001 sehingga kenaikan belanja dinyatakan signifikan.",
        codeExp: "Skrip mendemonstrasikan eksekusi uji t dua sampel independen Welch via stats.ttest_ind(..., equal_var=False) untuk menguji signifikansi perbedaan pendapatan belanja antar varian.",
        pitfalls: [
          "Menggunakan Student's t-test standar (equal_var=True) pada data yang memiliki varians berbeda secara mencolok.",
          "Menerapkan t-test langsung pada data yang memiliki pencilan masif bernilai miliaran tanpa pembersihan batas wajar terlebih dahulu."
        ],
        refTitle: "SciPy Reference Guide: scipy.stats.ttest_ind",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html"
      },
      {
        num: "9.6",
        slug: "9-6-uji-hipotesis-proporsi-two-proportion-z-test",
        title: "9.6. Uji Hipotesis Proporsi: Two-Proportion Z-Test untuk Conversion Rate",
        desc: "Pengujian variabel biner proporsional: konversi checkout (Ya/Tidak), proporsi gabungan (Pooled Proportion), perhitungan Z-score, dan p-value dua arah.",
        concept: `Sebagian besar metrik A/B testing di industri digital bertipe biner (Bernoulli trial): pengguna mengklik tombol atau tidak, mendaftar akun atau tidak, membeli atau tidak. Metrik ini dinyatakan dalam bentuk Tingkat Konversi (Conversion Rate / Proporsi $p = X / n$).

Untuk membandingkan dua proporsi sampel independen berukuran besar ($n > 30$), uji statistik yang paling tepat dan efisien adalah Two-Proportion Z-Test.

Uji ini menghitung proporsi gabungan (Pooled Proportion $\\hat{p}$) dengan asumsi hipotesis nol bahwa kedua kelompok berasal dari populasi dengan tingkat konversi yang identik. Standar deviasi gabungan kemudian digunakan untuk menghitung nilai Z-Score yang merefleksikan seberapa jauh selisih proporsi tersebut dari nol dalam satuan deviasi standar kurva normal Gauss.`,
        formula: `Z = \\frac{(p_1 - p_2)}{\\sqrt{\\hat{p}(1-\\hat{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}`,
        code: `# 9.6: Pelaksanaan Two-Proportion Z-Test untuk Conversion Rate
import numpy as np
import scipy.stats as stats

# Data Eksperimen: Tombol Checkout Merah (Kontrol) vs Hijau (Treatment)
n_kontrol = 12500
konversi_kontrol = 625   # CR = 5.00%

n_treatment = 12500
konversi_treatment = 720 # CR = 5.76%

p1 = konversi_kontrol / n_kontrol
p2 = konversi_treatment / n_treatment

# Proporsi Gabungan (Pooled Proportion)
p_pooled = (konversi_kontrol + konversi_treatment) / (n_kontrol + n_treatment)
se_pooled = np.sqrt(p_pooled * (1 - p_pooled) * (1/n_kontrol + 1/n_treatment))

# Hitung Z-Score dan p-value dua sisi
z_score = (p2 - p1) / se_pooled
p_value = 2 * (1 - stats.norm.cdf(abs(z_score)))

lift_relatif = ((p2 - p1) / p1) * 100

print("=== TWO-PROPORTION Z-TEST CONVERSION RATE ===")
print(f"Kontrol Conversion Rate   : {p1*100:.2f}% ({konversi_kontrol:,} / {n_kontrol:,})")
print(f"Treatment Conversion Rate : {p2*100:.2f}% ({konversi_treatment:,} / {n_treatment:,})")
print(f"Kenaikan Relatif (Lift)   : +{lift_relatif:.2f}%")
print(f"Z-Score                   : {z_score:.4f}")
print(f"p-value                   : {p_value:.4f}")

if p_value < 0.05:
    print("\\n[KESIMPULAN BISNIS] Varian Treatment terbukti unggul secara signifikan! Fitur Siap Dirilis.")
else:
    print("\\n[KESIMPULAN BISNIS] Tidak ada perbedaan signifikan. Pertahankan versi lama.")`,
        expectedOutput: "Z-test membuktikan p-value = 0.0084 (< 0.05) dengan Z-Score 2.636.",
        codeExp: "Skrip menerapkan perhitungan manual Two-Proportion Z-Test lengkap dengan pooled proportion dan verifikasi p-value terhadap ambang batas alpha 5%.",
        pitfalls: [
          "Menerapkan Z-Test proporsi pada sampel yang sangat kecil di mana $n \\times p < 5$; untuk sampel kecil gunakan Fisher's Exact Test.",
          "Melaporkan kenaikan persentase relatif (Lift +15%) kepada manajemen tanpa menyebutkan bahwa kenaikan absolutnya hanya dari 1.0% ke 1.15%."
        ],
        refTitle: "statsmodels Documentation: proportions_ztest",
        refUrl: "https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportions_ztest.html"
      },
      {
        num: "9.7",
        slug: "9-7-uji-non-parametrik-mann-whitney-u-test",
        title: "9.7. Uji Non-Parametrik: Mann-Whitney U Test untuk Data Skewed",
        desc: "Metode analitik bebas asumsi distribusi: ranking observasi Wilcoxon/Mann-Whitney, penanganan data pendapatan yang sangat menceng, dan perbandingan median.",
        concept: `Banyak data bisnis yang tidak memenuhi asumsi distribusi normal kurva Gauss—terutama metrik pendapatan e-commerce, lama waktu sesi pengguna, atau waktu penyelesaian tiket layanan. Data tersebut memiliki kemiringan tajam ke kanan (heavy right-tailed) dengan keberadaan sebagian kecil pengguna 'Whales' yang berbelanja miliaran rupiah.

Ketika asumsi normalitas dilanggar secara parah dan ukuran sampel terbatas, t-test parametrik dapat menghasilkan kesimpulan yang tidak valid. Solusi ilmiahnya adalah beralih ke Uji Non-Parametrik Mann-Whitney U (dikenal juga sebagai Wilcoxon Rank-Sum Test).

Mann-Whitney U Test tidak membandingkan nilai rata-rata numerik mentah, melainkan membandingkan urutan peringkat (ranks) dari seluruh data gabungan kedua kelompok. Uji ini mengevaluasi apakah ada kecenderungan stokastik bahwa nilai dari kelompok perlakuan lebih tinggi daripada kelompok kontrol secara konsisten, tanpa terdistorsi oleh satu atau dua nilai pencilan raksasa.`,
        code: `# 9.7: Penerapan Mann-Whitney U Test pada Data Pendapatan Berskew Tinggi
import numpy as np
import scipy.stats as stats

# Mensimulasikan data pendapatan log-normal dengan beberapa pencilan masif
np.random.seed(42)
rev_kontrol = np.random.lognormal(mean=10, sigma=1.5, size=200)
rev_treatment = np.random.lognormal(mean=10.4, sigma=1.5, size=200)

# Uji Mann-Whitney U Test
u_stat, p_val = stats.mannwhitneyu(rev_treatment, rev_kontrol, alternative='two-sided')

print("=== UJI NON-PARAMETRIK MANN-WHITNEY U TEST ===")
print(f"Median Kontrol   : Rp {np.median(rev_kontrol):,.0f}")
print(f"Median Treatment : Rp {np.median(rev_treatment):,.0f}")
print(f"U-Statistic      : {u_stat:.1f}")
print(f"p-value          : {p_val:.4f}")

if p_val < 0.05:
    print("\\n[HASIL] Distribusi Treatment terbukti secara signifikan lebih tinggi daripada Kontrol.")
else:
    print("\\n[HASIL] Tidak ada perbedaan peringkat yang signifikan antar kedua varian.")`,
        expectedOutput: "Mann-Whitney U test membuktikan signifikansi distribusi median pada data non-normal.",
        codeExp: "Skrip mengeksekusi stats.mannwhitneyu() untuk membuktikan keunggulan varian baru pada distribusi log-normal tanpa memerlukan asumsi kurva simetris Gauss.",
        pitfalls: [
          "Mengasumsikan bahwa Mann-Whitney U murni membandingkan median; uji ini sebenarnya membandingkan seluruh bentuk distribusi peringkat, dan hanya ekuivalen dengan uji beda median jika bentuk distribusi kedua kelompok identik.",
          "Menggunakan uji non-parametrik secara membabi-buta pada dataset yang berukuran jutaan baris padahal Central Limit Theorem (CLT) sudah menjamin validitas t-test."
        ],
        refTitle: "SciPy Reference Guide: scipy.stats.mannwhitneyu",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mannwhitneyu.html"
      },
      {
        num: "9.8",
        slug: "9-8-signifikansi-statistik-vs-signifikansi-praktis-mde",
        title: "9.8. Penafsiran Signifikansi Statistik vs Signifikansi Praktis (MDE)",
        desc: "Kematangan interpretasi bisnis: perbedaan antara p-value kecil pada sampel masif (Statistical Significance) vs dampak finansial riil (Practical Significance), analisis biaya-manfaat.",
        concept: `Salah satu jebakan paling berbahaya bagi analis pemula adalah menyamakan 'Signifikan secara Statistik' dengan 'Bermakna secara Bisnis'. Dengan ukuran sampel yang sangat besar (misalnya 10 juta pengguna di Google atau Amazon), perbedaan sekecil 0.01% dalam rasio klik akan menghasilkan $p < 0.0001$ (sangat signifikan secara statistik).

Namun, apakah meluncurkan perubahan tersebut layak secara bisnis? Praktisi profesional selalu mempertimbangkan Signifikansi Praktis (Practical Significance).

Jika untuk mengimplementasikan fitur baru perusahaan harus merekrut 3 insinyur tambahan dan membayar biaya server cloud Rp 50 Juta per bulan, sementara kenaikan konversi 0.01% hanya menghasilkan tambahan pendapatan Rp 10 Juta per bulan, maka secara bisnis fitur tersebut adalah sebuah kegagalan ekonomi meskipun p-value bernilai nol koma sekian. Analis data harus memadukan Interval Kepercayaan 95% dengan Analisis Biaya-Manfaat (Cost-Benefit Analysis).`,
        code: `# 9.8: Evaluasi Signifikansi Statistik vs Kelayakan Finansial Bisnis
p_value = 0.002 # Sangat signifikan secara statistik (p < 0.05)
kenaikan_omzet_bulanan = 15000000  # Tambahan omzet Rp 15 Juta / bulan
biaya_pemeliharaan_bln = 22000000 # Biaya server + lisensi Rp 22 Juta / bulan

net_dampak_bulanan = kenaikan_omzet_bulanan - biaya_pemeliharaan_bln

print("=== EVALUASI SIGNIFIKANSI STATISTIK VS PRAKTIS ===")
print(f"p-value Statistik         : {p_value} (Signifikan secara Statistik: YA)")
print(f"Tambahan Omzet Bulanan    : Rp {kenaikan_omzet_bulanan:,.0f}")
print(f"Beban Biaya Bulanan       : Rp {biaya_pemeliharaan_bln:,.0f}")
print(f"Dampak Finansial Bersih   : Rp {net_dampak_bulanan:,.0f}")

if p_value < 0.05 and net_dampak_bulanan > 0:
    print("\\n[REKOMENDASI] LUNCURKAN FITUR: Layak secara statistik dan menguntungkan secara finansial.")
else:
    print("\\n[REKOMENDASI] BATALKAN FITUR: Signifikan secara statistik TETAPI merugikan secara finansial!")`,
        expectedOutput: "Evaluasi merekomendasikan pembatalan fitur karena menghasilkan defisit bersih Rp -7 Juta.",
        codeExp: "Skrip membandingkan output p-value statistik formal terhadap kalkulasi laba-rugi operasional riil, membuktikan bahwa signifikansi statistik tidak menjamin kelayakan bisnis.",
        pitfalls: [
          "Meluncurkan fitur baru hanya karena p < 0.05 tanpa memperhitungkan biaya pemeliharaan teknis jangka panjang (Technical Debt).",
          "Hanya melaporkan titik estimasi (Point Estimate) tunggal alih-alih menyajikan rentang Interval Kepercayaan (Confidence Interval) kepada manajemen."
        ],
        refTitle: "Ron Kohavi: The Pitfalls of A/B Testing in Enterprise Software",
        refUrl: "https://experimentguide.com/"
      },
      {
        num: "9.9",
        slug: "9-9-kesalahan-umum-eksperimen-p-hacking-peeking-bonferroni",
        title: "9.9. Kesalahan Umum Eksperimen: P-Hacking, Peeking Problem & Koreksi Bonferroni",
        desc: "Integritas metodologis pengujian: bahaya mengintip hasil sementara (Continuous Monitoring / Peeking), inflasi False Positive rate, dan koreksi multi-pengujian Bonferroni / FDR.",
        concept: `Integritas pengujian hipotesis rentan dirusak oleh praktik buruk yang disengaja maupun tidak disengaja. Kesalahan paling umum di industri teknologi adalah 'The Peeking Problem'—kebiasaan analis atau manajer produk membuka dasbor eksperimen setiap jam dan langsung menghentikan eksperimen begitu melihat p-value menyentuh angka 0.049.

Mengintip data berulang kali secara dramatis melipatgandakan tingkat kesalahan False Positive riil dari 5% menjadi lebih dari 30%! Hal ini terjadi karena fluktuasi acak alami pada sampel awal pasti akan sesekali menyentuh batas ambang signifikansi secara kebetulan semata.

Kesalahan fatal kedua adalah 'Multiple Testing Problem'—menguji 20 varian warna tombol sekaligus terhadap 1 varian kontrol. Berdasarkan hukum probabilitas, peluang mendapatkan minimal satu hasil positif palsu murni secara kebetulan adalah $1 - (1 - 0.05)^{20} = 64.1\\%$. Untuk mengatasi ini, analis harus menerapkan Koreksi Bonferroni ($\\alpha_{\\text{baru}} = \\alpha / k$) atau False Discovery Rate (FDR) Benjamini-Hochberg.`,
        formula: `\\alpha_{\\text{Bonferroni}} = \\frac{\\alpha}{k}, \\quad P(\\text{Minimal 1 False Positive}) = 1 - (1 - \\alpha)^k`,
        code: `# 9.9: Demonstrasi Inflasi False Positive Akibat Multi-Testing dan Koreksi Bonferroni
k_pengujian = 20 # Menguji 20 metrik atau 20 varian sekaligus
alpha_standar = 0.05

# Probabilitas terjadinya minimal 1 False Positive murni karena kebetulan
p_false_positive_kumulatif = 1 - (1 - alpha_standar) ** k_pengujian

# Koreksi Bonferroni untuk mengontrol Family-Wise Error Rate (FWER)
alpha_bonferroni = alpha_standar / k_pengujian

print("=== BAHAYA MULTIPLE TESTING & KOREKSI BONFERRONI ===")
print(f"Jumlah Hipotesis Diuji (k)          : {k_pengujian}")
print(f"Ambang Alpha Awal per Uji           : {alpha_standar}")
print(f"Risiko False Positive Kumulatif     : {p_false_positive_kumulatif*100:.1f}% (Sangat Rawan Ilusi Statistik!)")
print(f"Ambang Alpha Baru (Koreksi Bonferroni): {alpha_bonferroni:.4f}")`,
        expectedOutput: "Kalkulasi membuktikan risiko false positive melonjak ke 64.2% jika tidak dikoreksi ke alpha 0.0025.",
        codeExp: "Skrip mendemonstrasikan fenomena inflasi kesalahan Tipe I saat menguji banyak hipotesis simultan dan menghitung penyesuaian ambang signifikansi menggunakan metode konservatif Bonferroni.",
        pitfalls: [
          "Melakukan 'data dredging' atau memecah-mecah segmen data pasca-eksperimen hingga menemukan satu sub-segmen kecil yang menghasilkan p < 0.05 (P-Hacking).",
          "Menghentikan pengujian sebelum durasi siklus bisnis mingguan penuh (misal hanya menguji 3 hari) yang melewatkan pola perilaku akhir pekan."
        ],
        refTitle: "Nature Methods: Points of Significance - Multiple Testing",
        refUrl: "https://www.nature.com/articles/nmeth.2900"
      },
      {
        num: "9.10",
        slug: "9-10-kerangka-pengambilan-keputusan-peluncuran-fitur",
        title: "9.10. Kerangka Pengambilan Keputusan Peluncuran Fitur Pasca-Eksperimen",
        desc: "Matriks keputusan peluncuran (Ship / No-Ship Decisions): evaluasi metrik penjaga (Guardrail Metrics), trade-off antar departemen, strategi peluncuran bertahap (Canary Release).",
        concept: `Tahap akhir dari siklus hidup eksperimentasi A/B testing adalah pengambilan keputusan peluncuran fitur (Ship / No-Ship Decision Framework). Keputusan ini tidak boleh hanya bergantung pada satu metrik sukses utama (Primary Metric), melainkan harus mengevaluasi metrik perlindungan (Guardrail Metrics).

Guardrail Metrics adalah metrik keselamatan sistem dan stabilitas bisnis yang tidak boleh rusak selama eksperimen berjalan. Contohnya:
- Jika Primary Metric (Jumlah Checkout) naik 8%, namun Guardrail Metric (Waktu Muat Halaman / Page Latency) melambat 400 milidetik dan Tingkat Pembatalan Transaksi (Refund Rate) naik 15%, fitur tersebut TIDAK BOLEH langsung diluncurkan!

Protokol peluncuran profesional menerapkan 'Canary Release' atau 'Phased Rollout'—fitur baru tidak langsung dirilis ke 100% populasi pengguna, melainkan dibuka bertahap dari 10%, 25%, 50%, hingga 100% sambil terus memantau indikator stabilitas server dan kepuasan pelanggan secara real-time.`,
        code: `# 9.10: Matriks Evaluasi Keputusan Peluncuran (Ship / No-Ship Framework)
import pandas as pd

evaluasi_fitur = pd.DataFrame({
    'Tipe_Metrik': ['Primary Metric', 'Secondary Metric', 'Guardrail Metric', 'Guardrail Metric'],
    'Nama_Metrik': ['Checkout Conversion Rate', 'Average Order Value', 'Aplikasi Crash Rate (%)', 'Waktu Muat Halaman (detik)'],
    'Baseline': [4.5, 250000, 0.05, 1.2],
    'Treatment': [5.1, 260000, 0.06, 1.8],
    'Status_Uji': ['Signifikan Naik (+13%)', 'Signifikan Naik (+4%)', 'Stabil Aman', 'Memburuk (+50% Lambat!)'],
    'Ambang_Batas_Kritis': ['Harus Naik', 'Tidak Boleh Turun', 'Maksimal 0.10%', 'Maksimal 1.4 detik']
})

print("=== EVALUASI MATRIKS METRIK PELUNCURAN FITUR ===")
print(evaluasi_fitur.to_string(index=False))

# Diagnosa keputusan
print("\\n[KEPUTUSAN DEWAN PRODUK]: HOLD / JANGAN LUNCURKAN DULU")
print("Alasan: Meskipun metrik konversi naik signifikan, Guardrail Latency melanggar batas kritis (1.8s > 1.4s).")
print("Tindakan: Kembalikan ke tim Engineering untuk optimasi kode sebelum rilis penuh.")`,
        expectedOutput: "Matriks keputusan menginstruksikan penundaan rilis akibat pelanggaran guardrail latency.",
        codeExp: "Skrip menyusun kerangka kerja evaluasi multi-kriteria yang menyeimbangkan metrik pertumbuhan bisnis dengan metrik stabilitas sistem engineering untuk pengambilan keputusan peluncuran yang bertanggung jawab.",
        pitfalls: [
          "Hanya merayakan kenaikan metrik utama dan mengabaikan metrik guardrail yang memburuk, yang berujung pada penurunan kepuasan pengguna jangka panjang.",
          "Langsung meluncurkan fitur ke 100% pengguna dalam satu kali rilis tanpa pengujian bertahap canary release."
        ],
        refTitle: "Shopify Engineering: Building a Resilient A/B Testing Decision Framework",
        refUrl: "https://shopify.engineering/"
      }
    ]
  },

  // ==========================================
  // BAB 10: Proyek Capstone: Analisis Bisnis End-to-End & Rekomendasi Strategis
  // ==========================================
  {
    orderIndex: 10,
    id: "data-analyst-ch-10",
    slug: "bab-10-proyek-capstone-analisis-bisnis-end-to-end",
    title: "BAB 10: Proyek Capstone: Analisis Bisnis End-to-End & Rekomendasi Strategis",
    desc: "Integrasi seluruh kompetensi analitik dalam studi kasus skala industri nyata: penyusunan Project Charter, ekstraksi data multi-sumber, pipeline pembersihan, diagnosa metrik anomali, segmentasi pelanggan, validasi hipotesis statistik, pemodelan proyeksi finansial, dan presentasi rekomendasi tingkat C-Level.",
    coreConcepts: ["End-to-End Capstone", "Project Charter", "Multi-Source Pipeline", "Statistical Diagnostic", "Financial Projections", "Executive C-Level Pitch"],
    subchapters: [
      {
        num: "10.1",
        slug: "10-1-project-charter-pendefinisian-masalah-bisnis-industri",
        title: "10.1. Project Charter & Pendefinisian Masalah Bisnis Skala Industri",
        desc: "Dokumen inisiasi proyek capstone: latar belakang bisnis ritel omnichannel, perumusan target SMART, batasan ruang lingkup (in-scope vs out-of-scope), dan deliverables.",
        concept: `Proyek Capstone ini mensimulasikan penugasan nyata seorang Senior Data Analyst di sebuah perusahaan ritel omnichannel fiktif bernama 'PT Velqora Retail Nusantara' yang mengoperasikan 50 gerai fisik dan aplikasi e-commerce.

Langkah pertama yang membedakan analis profesional adalah tidak langsung melompat ke penulisan kueri, melainkan menyusun dokumen Project Charter resmi yang menyelaraskan ekspektasi tim data dengan dewan direksi.

Masalah Bisnis Kunci: Pada Q3 2026, manajemen mengamati penurunan laba bersih sebesar 18% Year-on-Year (YoY) meskipun nilai penjualan kotor (Gross Merchandise Value / GMV) tetap tumbuh 5%. Dewan direksi menuntut tim data untuk mendiagnosa akar penyebab penurunan profitabilitas ini, memetakan efisiensi kanal penjualan, dan merumuskan rencana aksi strategis untuk membalikkan tren penurunan pada Q4 2026.`,
        code: `# 10.1: Struktur Project Charter Inisiasi Analitik Bisnis Capstone
project_charter = {
    'Judul_Proyek': 'Diagnosa Penurunan Profitabilitas Q3 & Optimasi Margin PT Velqora Nusantara',
    'Business_Sponsor': 'Chief Executive Officer (CEO) & Chief Financial Officer (CFO)',
    'Lead_Analyst': 'Senior Data Analyst Velqora',
    'Tujuan_SMART': 'Mengidentifikasi akar penyebab erosi laba 18% dan merekomendasikan efisiensi biaya guna memulihkan margin kotor sebesar 3.5% dalam tempo 90 hari.',
    'Ruang_Lingkup_InScope': [
        'Audit 500.000 data transaksi omnichannel (online vs offline) 12 bulan terakhir',
        'Analisis marjin kotor per kategori produk dan kebijakan diskon promosi',
        'Segmentasi perilaku loyalitas pelanggan (RFM) dan biaya logistik pengiriman'
    ],
    'Ruang_Lingkup_OutOfScope': [
        'Renegosiasi kontrak sewa gedung gerai fisik',
        'Audit kepatuhan pajak korporasi internal'
    ],
    'Deliverables_Kunci': [
        'Pipeline pembersihan data terverifikasi (Python/SQL)',
        'Laporan diagnostik statistik akar masalah penurunan margin',
        'Dashboard eksekutif interaktif untuk dewan direksi',
        'Pitch deck rekomendasi strategis 10 halaman untuk C-Level'
    ]
}

print("=== PROJECT CHARTER INISIASI CAPSTONE DATA ANALYST ===")
for k, v in project_charter.items():
    if isinstance(v, list):
        print(f"\\n[{k}]:")
        for item in v:
            print(f"  - {item}")
    else:
        print(f"{k}: {v}")`,
        expectedOutput: "Dokumen charter proyek capstone terstruktur lengkap tercetak rapi.",
        codeExp: "Skrip memodelkan dokumen inisiasi formal proyek analitik enterprise, menetapkan tujuan terukur SMART dan batasan ruang lingkup yang jelas sebelum eksekusi teknis dimulai.",
        pitfalls: [
          "Memulai proyek tanpa batasan ruang lingkup tertulis, yang memicu 'Scope Creep' (permintaan tambahan tanpa akhir dari pemangku kepentingan).",
          "Menyusun tujuan proyek yang tidak terikat waktu dan tidak memiliki metrik keberhasilan kuantitatif."
        ],
        refTitle: "Project Management Institute (PMI): A Guide to the Project Management Body of Knowledge (PMBOK)",
        refUrl: "https://www.pmi.org/pmbok-guide-standards"
      },
      {
        num: "10.2",
        slug: "10-2-pengumpulan-data-multi-sumber-sql-warehouse-csv-api",
        title: "10.2. Pengumpulan Data Multi-Sumber (SQL Warehouse, CSV Log, API)",
        desc: "Integrasi data heterogen: ekstraksi data transaksi dari SQL Data Warehouse, penggabungan log kampanye pemasaran berformat CSV, dan penarikan kurs mata uang via REST API.",
        concept: `Data perusahaan skala enterprise hampir selalu terfragmentasi di berbagai sistem yang berbeda (Siloed Data). Untuk membedah masalah profitabilitas, analis capstone harus mengumpulkan data dari tiga sumber heterogen yang independen:

1. Basis Data SQL Transaksional: Menyimpan data master pesanan penjualan, kuantitas item, harga jual, dan identitas cabang.
2. Berkas CSV Log Pemasaran: Menyimpan catatan biaya belanja iklan digital (Ad Spend) per kampanye dari platform Google Ads dan Meta Ads.
3. REST API Finansial: Menyediakan data referensi kurs valuta asing dan suku bunga acuan ekonomi makro.

Keahlian menggabungkan dan menyelaraskan kunci relasional antar sumber data yang heterogen ini merupakan ujian utama kecakapan teknis analis data.`,
        code: `# 10.2: Integrasi Multi-Sumber Data (SQL Relasional + CSV Eksternal)
import sqlite3
import pandas as pd
import io

# 1. Sumber Data 1: SQL Database Transaksional
conn = sqlite3.connect(':memory:')
conn.execute('''
CREATE TABLE fact_transaksi (
    order_id TEXT PRIMARY KEY,
    tanggal DATE,
    channel TEXT,
    gmv INTEGER,
    hpp INTEGER
)''')
conn.executemany('INSERT INTO fact_transaksi VALUES (?, ?, ?, ?, ?)', [
    ('ORD-01', '2026-08-01', 'Online App', 500000, 300000),
    ('ORD-02', '2026-08-01', 'Offline Store', 800000, 450000),
    ('ORD-03', '2026-08-02', 'Online App', 350000, 200000)
])

df_sql = pd.read_sql_query("SELECT * FROM fact_transaksi", conn)
conn.close()

# 2. Sumber Data 2: File CSV Log Biaya Marketing Digital
csv_marketing = """tanggal,channel,ad_spend
2026-08-01,Online App,80000
2026-08-02,Online App,60000
"""
df_csv = pd.read_csv(io.StringIO(csv_marketing))

# Integrasi: Penggabungan data penjualan dan biaya pemasaran
df_gabung = df_sql.merge(df_csv, on=['tanggal', 'channel'], how='left').fillna({'ad_spend': 0})
df_gabung['Laba_Kotor'] = df_gabung['gmv'] - df_gabung['hpp'] - df_gabung['ad_spend']

print("=== HASIL INTEGRASI DATA MULTI-SUMBER (SQL + CSV) ===")
print(df_gabung[['order_id', 'channel', 'gmv', 'hpp', 'ad_spend', 'Laba_Kotor']])`,
        expectedOutput: "Data transaksi SQL berhasil digabungkan dengan biaya iklan CSV menghasilkan laba kotor bersih.",
        codeExp: "Skrip menyimulasikan integrasi data hibrida antara basis data relasional SQL dan berkas log pemasaran eksternal melalui operasi merge relasional multi-kunci di Pandas.",
        pitfalls: [
          "Mengabaikan perbedaan format zona waktu atau format penanggalan antar sumber data yang menyebabkan kegagalan penggabungan (join mismatch).",
          "Menyimpan API token rahasia secara hardcoded di dalam skrip alih-alih menggunakan file environment (.env)."
        ],
        refTitle: "Python Standard Library: urllib & sqlite3 integration",
        refUrl: "https://docs.python.org/3/library/"
      },
      {
        num: "10.3",
        slug: "10-3-pipeline-pembersihan-audit-kualitas-16-step-capstone",
        title: "10.3. Pipeline Pembersihan, Audit Kualitas, & Rekayasa Fitur Data Transaksional",
        desc: "Implementasi 16-langkah audit kualitas pada dataset capstone: eliminasi duplikasi transaksi, penanganan retur negatif, validasi tipe data, dan rekayasa fitur margin.",
        concept: `Sebelum analisis mendalam dapat dipercaya oleh jajaran direksi, data masukan harus melewati pipeline pembersihan dan audit kualitas data yang ketat. Pada proyek capstone ini, analis menerapkan protokol audit 16-langkah yang telah distandarisasi:

Pemeriksaan mencakup validasi keunikan ID pesanan, identifikasi nilai transaksi negatif (yang merupakan pencatatan retur barang yang salah tempat), pemisahan diskon promosi dari harga kotor, dan validasi integritas referensi kunci pelanggan.

Rekayasa Fitur (Feature Engineering) menambahkan kolom-kolom kalkulasi bisnis kritis:
1. Gross Margin Percentage: $\\frac{\\text{GMV} - \\text{HPP}}{\\text{GMV}} \\times 100\\%$
2. Discount Ratio: $\\frac{\\text{Diskon}}{\\text{Harga Asli}} \\times 100\\%$
3. Logistik Net Cost per Unit`,
        code: `# 10.3: Pipeline Pembersihan dan Rekayasa Fitur Capstone
import pandas as pd
import numpy as np

# Dataset kotor mentah capstone
raw_orders = pd.DataFrame({
    'order_id': ['TRX-01', 'TRX-02', 'TRX-02', 'TRX-03', 'TRX-04', 'TRX-05'],
    'customer_id': ['C1', 'C2', 'C2', None, 'C4', 'C5'],
    'gmv': [500000, 750000, 750000, -150000, 1200000, 0], # Ada duplikat, negatif, dan nol
    'hpp': [300000, 450000, 450000, 100000, 600000, 0],
    'diskon': [50000, 200000, 200000, 0, 100000, 0]
})

# Pipeline Pembersihan Terstruktur
# 1. Hapus duplikat fisik penuh
df_clean = raw_orders.drop_duplicates(subset=['order_id']).copy()

# 2. Filter nilai transaksi tidak valid (<= 0)
df_clean = df_clean[df_clean['gmv'] > 0]

# 3. Imputasi nilai customer_id yang hilang dengan label 'Guest'
df_clean['customer_id'] = df_clean['customer_id'].fillna('GUEST-USER')

# 4. Rekayasa Fitur Margin dan Rasio Diskon
df_clean['net_sales'] = df_clean['gmv'] - df_clean['diskon']
df_clean['gross_profit'] = df_clean['net_sales'] - df_clean['hpp']
df_clean['margin_pct'] = (df_clean['gross_profit'] / df_clean['net_sales'] * 100).round(2)
df_clean['discount_rate_pct'] = (df_clean['diskon'] / df_clean['gmv'] * 100).round(2)

print("=== DATA PASCA PIPELINE AUDIT KUALITAS & FEATURE ENGINEERING ===")
print(df_clean[['order_id', 'customer_id', 'net_sales', 'gross_profit', 'margin_pct', 'discount_rate_pct']])`,
        expectedOutput: "Data bersih bebas duplikat dan transaksi negatif dengan metrik margin terhitung.",
        codeExp: "Skrip mengeksekusi pipeline sanitasi data multi-tahap dan merekayasa fitur finansial margin kotor dan laju diskon untuk persiapan analisis diagnostik.",
        pitfalls: [
          "Menghapus baris retur negatif tanpa mencatatnya ke tabel terpisah untuk audit akuntansi.",
          "Membagi dengan kolom net_sales tanpa mengecek apakah nilainya nol, yang memicu ZeroDivisionError."
        ],
        refTitle: "pandas User Guide: Missing data & Data cleaning workflows",
        refUrl: "https://pandas.pydata.org/docs/user_guide/missing_data.html"
      },
      {
        num: "10.4",
        slug: "10-4-analisis-eksploratori-mendalam-diagnosa-penurunan-margin",
        title: "10.4. Analisis Eksploratori Mendalam & Diagnosa Penurunan Metrik Kunci",
        desc: "Investigasi dekomposisi profitabilitas: analisis bivariat margin terhadap diskon, komparasi kinerja online vs offline, dan penemuan faktor kanibalisasi margin.",
        concept: `Memasuki tahap investigasi diagnostik, analis menggunakan analisis bivariat dan dekomposisi kontribusi untuk menjawab pertanyaan direksi: 'Mengapa laba bersih turun padahal omzet GMV naik?'

Melalui dekomposisi data per kanal penjualan dan per kategori produk, muncul temuan mengejutkan (The Smoking Gun):
1. Saluran Online App mengalami lonjakan volume penjualan sebesar 45%, namun margin laba kotornya ambruk dari 32% menjadi hanya 8%.
2. Investigasi lebih lanjut mengungkap bahwa program promo 'Gratis Ongkir Tanpa Batas' dan voucher diskon 25% yang diluncurkan tim pemasaran pada Q3 telah dieksploitasi oleh pengguna untuk membeli barang-barang bernilai rendah dengan biaya logistik yang ditanggung sepenuhnya oleh perusahaan.
3. Penjualan gerai fisik offline yang menghasilkan marjin tinggi (35%) mengalami penurunan kunjungan karena pelanggan beralih membeli di aplikasi online yang terlalu banyak diskon (Kanibalisasi Internal).`,
        code: `# 10.4: Diagnosa Dekomposisi Marjin Laba per Saluran Penjualan
import pandas as pd

kinerja_q3 = pd.DataFrame({
    'Kanal_Penjualan': ['Offline Gerai Fisik', 'Online Mobile App'],
    'GMV_Miliar': [320, 180],
    'HPP_Miliar': [192, 117],
    'Biaya_Promo_Diskon_Miliar': [16, 45], # Promo online sangat masif
    'Biaya_Logistik_Ongkir_Miliar': [0, 22]  # Subsidi ongkir online
})

kinerja_q3['Laba_Kotor_Bersih'] = (
    kinerja_q3['GMV_Miliar'] - kinerja_q3['HPP_Miliar'] - 
    kinerja_q3['Biaya_Promo_Diskon_Miliar'] - kinerja_q3['Biaya_Logistik_Ongkir_Miliar']
)
kinerja_q3['Margin_Net_Pct'] = (kinerja_q3['Laba_Kotor_Bersih'] / kinerja_q3['GMV_Miliar'] * 100).round(1)

print("=== DEKOMPOSISI PROFITABILITAS SALURAN PENJUALAN Q3 ===")
print(kinerja_q3[['Kanal_Penjualan', 'GMV_Miliar', 'Laba_Kotor_Bersih', 'Margin_Net_Pct']])
print("\\nTemuan Investigasi:")
print("Saluran Online menyumbang GMV signifikan tetapi hanya menghasilkan marjin net sebesar -2.2% (Rugi Operasional)!")`,
        expectedOutput: "Diagnosa membuktikan kanal Online App merugi akibat subsidi promo dan ongkir berlebih.",
        codeExp: "Skrip mengisolasi struktur biaya per saluran penjualan dan membuktikan secara empiris bahwa subsidi logistik dan diskon online yang agresif telah mengikis profitabilitas perusahaan secara keseluruhan.",
        pitfalls: [
          "Hanya mengevaluasi angka GMV teratas tanpa memperhitungkan beban biaya subsidi logistik per pesanan.",
          "Menyalahkan tim penjualan fisik offline tanpa menyadari adanya kanibalisasi dari promo online internal."
        ],
        refTitle: "McKinsey & Company: The anatomy of profitability & omnichannel pricing",
        refUrl: "https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights"
      },
      {
        num: "10.5",
        slug: "10-5-segmentasi-pelanggan-pola-transaksi-berulang-capstone",
        title: "10.5. Segmentasi Pelanggan & Pemetaan Pola Transaksi Berulang",
        desc: "Penerapan segmentasi RFM pada 50.000 pelanggan capstone: identifikasi segmen pemburu diskon (Bargain Hunters) vs pelanggan loyal bernilai tinggi, serta kontribusi margin per segmen.",
        concept: `Setelah menemukan masalah di saluran online, analis capstone membedah basis pelanggan menggunakan segmentasi RFM untuk memahami siapa yang menikmati promo diskon besar-besaran tersebut.

Hasil segmentasi membagi pelanggan menjadi tiga klaster perilaku utama:
1. Klaster Pemburu Diskon (Bargain Hunters): Pengguna dengan Recency baru dan Frequency tinggi hanya saat periode promo, namun memiliki Monetary Margin bernilai negatif (selalu menggunakan voucher diskon maksimum dan gratis ongkir). Klaster ini menyerap 65% total anggaran promosi tetapi memiliki retensi 0% saat promo dihentikan.
2. Klaster Loyal Omnichannel (High-Value Loyalists): Berbelanja di toko fisik maupun aplikasi online, jarang menggunakan voucher diskon, menyumbang 70% laba bersih perusahaan, namun merasa terabaikan karena tidak ada program apresiasi loyalitas.
3. Klaster Hibernating: Pelanggan gerai offline yang sudah tidak berbelanja lebih dari 120 hari.`,
        code: `# 10.5: Analisis Kontribusi Margin Berdasarkan Segmen Pelanggan Capstone
import pandas as pd

segmen_capstone = pd.DataFrame({
    'Segmen_Pelanggan': ['Loyal Omnichannel', 'Reguler Offline', 'Bargain Hunters (Promo)', 'Hibernating'],
    'Jumlah_Pelanggan': [12000, 25000, 45000, 18000],
    'Total_GMV_Miliar': [220, 180, 95, 25],
    'Total_Laba_Bersih_Miliar': [77, 54, -12, 5], # Bargain hunters mencatat laba negatif!
    'Alokasi_Diskon_Pct': [10, 15, 65, 10]
})

segmen_capstone['Margin_Kontribusi_Pct'] = (
    segmen_capstone['Total_Laba_Bersih_Miliar'] / segmen_capstone['Total_GMV_Miliar'] * 100
).round(1)

print("=== PROFIL PROFITABILITAS SEGMEN PELANGGAN ===")
print(segmen_capstone[['Segmen_Pelanggan', 'Jumlah_Pelanggan', 'Total_Laba_Bersih_Miliar', 'Margin_Kontribusi_Pct', 'Alokasi_Diskon_Pct']])`,
        expectedOutput: "Segmen Bargain Hunters membakar anggaran diskon 65% dan menghasilkan laba bersih negatif Rp -12 Miliar.",
        codeExp: "Skrip mengkuantifikasi anomali segmentasi pelanggan: membuktikan bahwa mayoritas anggaran pemasaran terbuang sia-sia untuk menyubsidi segmen pemburu diskon yang tidak menghasilkan laba jangka panjang.",
        pitfalls: [
          "Menghitung profitabilitas segmen hanya dari nilai belanja kotor tanpa mengurangkan biaya voucher promo yang mereka gunakan.",
          "Memperlakukan segmen pemburu diskon sebagai pelanggan loyal hanya karena frekuensi belanjanya tinggi."
        ],
        refTitle: "Harvard Business Review: Stop Subsidizing Unprofitable Customers",
        refUrl: "https://hbr.org/"
      },
      {
        num: "10.6",
        slug: "10-6-validasi-temuan-uji-statistik-signifikansi-capstone",
        title: "10.6. Validasi Temuan dengan Uji Statistik Signifikansi",
        desc: "Pengujian empiris hipotesis akar masalah: Two-Sample t-Test untuk membandingkan margin pesanan bersubsidi vs non-subsidi, dan uji korelasi elastisitas harga.",
        concept: `Manajemen eksekutif tidak akan menyetujui perubahan strategi besar hanya berdasarkan grafik visual tanpa pembuktian statistik yang kokoh. Analis capstone melakukan pengujian hipotesis formal untuk memvalidasi temuan.

Uji Hipotesis Kunci:
- $H_0$: Rata-rata margin laba pesanan dengan voucher gratis ongkir tidak berbeda dengan pesanan tanpa voucher.
- $H_1$: Pesanan dengan voucher gratis ongkir menghasilkan rata-rata margin laba yang secara signifikan lebih rendah daripada pesanan tanpa voucher.

Menggunakan Two-Sample Welch's t-Test pada 10.000 sampel pesanan acak, diperoleh nilai $t = -28.4$ dan $p < 0.0001$. Bukti statistik ini menggugurkan keraguan manajemen dan memastikan bahwa erosi margin bukan sekadar fluktuasi acak, melainkan cacat struktural dari kebijakan promosi yang harus segera direvisi.`,
        code: `# 10.6: Validasi Hipotesis Statistik Formal Penurunan Margin
import scipy.stats as stats
import numpy as np

# Simulasi 5.000 sampel pesanan bertiket diskon vs reguler
np.random.seed(42)
margin_reguler = np.random.normal(loc=32.5, scale=6.0, size=5000) # Rata-rata margin 32.5%
margin_diskon = np.random.normal(loc=12.0, scale=8.5, size=5000)  # Rata-rata margin 12.0%

t_stat, p_val = stats.ttest_ind(margin_diskon, margin_reguler, equal_var=False)

print("=== VALIDASI STATISTIK HIPOTESIS EROSI MARGIN ===")
print(f"Rata-rata Margin Reguler : {np.mean(margin_reguler):.2f}%")
print(f"Rata-rata Margin Diskon  : {np.mean(margin_diskon):.2f}%")
print(f"Selisih Defisit Margin   : {np.mean(margin_diskon) - np.mean(margin_reguler):.2f}%")
print(f"Welch's t-Statistic      : {t_stat:.4f}")
print(f"p-value                  : {p_val:.4e}")

if p_val < 0.001:
    print("\\n[PEMBUKTIAN ILMIAH LOLOS] Hipotesis terbukti secara absolut: Kebijakan promo merusak margin secara signifikan!")`,
        expectedOutput: "Uji t membuktikan p-value < 0.0001 mengonfirmasi penurunan margin sebesar -20.5% akibat promo.",
        codeExp: "Skrip melakukan uji t inferensial formal untuk memberikan kepastian statistik 99.9% kepada dewan direksi sebelum implementasi perubahan kebijakan bisnis.",
        pitfalls: [
          "Menyajikan hasil uji statistik mentah tanpa menerjemahkan maknanya ke dalam dampak finansial rupiah yang dipahami jajaran direksi.",
          "Mengabaikan pengujian asumsi varians dan ukuran sampel."
        ],
        refTitle: "SciPy Reference Guide: Statistical Hypothesis Testing",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/stats.html"
      },
      {
        num: "10.7",
        slug: "10-7-sintesis-solusi-bisnis-pemodelan-proyeksi-finansial",
        title: "10.7. Sintesis Solusi Bisnis & Pemodelan Proyeksi Finansial",
        desc: "Penyusunan skenario simulasi: pemodelan What-If analysis, penentuan batas minimum transaksi untuk gratis ongkir (Threshold Optimization), dan proyeksi pemulihan laba Q4.",
        concept: `Seorang analis data kelas dunia tidak hanya berhenti pada mendiagnosa penyakit bisnis, melainkan menyajikan resep obat solusinya lengkap dengan proyeksi dampak finansial di masa depan (Prescriptive Analytics & What-If Financial Modeling).

Analis capstone merancang tiga skenario solusi kebijakan baru untuk Q4:
1. Optimasi Batas Gratis Ongkir (Free Shipping Threshold): Menghapus gratis ongkir tanpa syarat dan menetapkan batas belanja minimum Rp 250.000. Pengguna yang ingin gratis ongkir dipaksa menaikkan basket size mereka (AOV naik).
2. Realokasi Anggaran Promosi: Memangkas 60% diskon umum untuk pengguna baru pemburu promo dan mengalihkannya ke Program Loyalitas Eksklusif Pelanggan Omnichannel.
3. Strategi Click-and-Collect (BOPIS): Mendorong pengguna online mengambil barang di gerai fisik terdekat dengan insentif voucher belanja fisik kecil, mengeliminasi biaya logistik pihak ketiga dan meningkatkan kunjungan toko offline.`,
        code: `# 10.7: Simulasi Proyeksi Finansial Skenario Kebijakan Baru Q4
import pandas as pd

skenario_proyeksi = pd.DataFrame({
    'Skenario_Kebijakan': ['Status Quo (Tanpa Perubahan)', 'Skenario 1: Batas Minimum Ongkir Rp 250rb', 'Skenario 2: BOPIS + Loyalitas (Rekomendasi Utama)'],
    'Proyeksi_GMV_Miliar': [500, 480, 520], # Skenario 1 volume turun sedikit tetapi sehat
    'Biaya_Promo_Logistik_Miliar': [67, 32, 24], # Penghematan biaya masif
    'Estimasi_Laba_Kotor_Miliar': [65, 88, 105]
})

skenario_proyeksi['Margin_Laba_Pct'] = (
    skenario_proyeksi['Estimasi_Laba_Kotor_Miliar'] / skenario_proyeksi['Proyeksi_GMV_Miliar'] * 100
).round(1)
skenario_proyeksi['Peningkatan_Laba_YoY_Miliar'] = skenario_proyeksi['Estimasi_Laba_Kotor_Miliar'] - 65

print("=== PROYEKSI FINANSIAL MODEL SIMULASI Q4 ===")
print(skenario_proyeksi[['Skenario_Kebijakan', 'Proyeksi_GMV_Miliar', 'Estimasi_Laba_Kotor_Miliar', 'Margin_Laba_Pct', 'Peningkatan_Laba_YoY_Miliar']])`,
        expectedOutput: "Skenario rekomendasi utama memproyeksikan kenaikan laba kotor sebesar +Rp 40 Miliar (+61.5%).",
        codeExp: "Skrip menyimulasikan analisis What-If finansial multi-skenario, menunjukkan kuantifikasi keuntungan terukur jika rekomendasi analitik dieksekusi di lapangan.",
        pitfalls: [
          "Membuat proyeksi yang mengasumsikan volume penjualan tidak akan turun sama sekali saat diskon dicabut (mengabaikan elastisitas harga permintaan).",
          "Tidak menyertakan skenario konservatif / pesimis dalam pemodelan bisnis."
        ],
        refTitle: "Corporate Finance Institute (CFI): Scenario Analysis & Financial Modeling",
        refUrl: "https://corporatefinanceinstitute.com/"
      },
      {
        num: "10.8",
        slug: "10-8-perancangan-dashboard-eksekutif-manajemen-capstone",
        title: "10.8. Perancangan Dashboard Eksekutif Interaktif untuk Manajemen",
        desc: "Pengembangan dashboard operasional: visualisasi Star Schema, integrasi kartu KPI real-time (Net Margin, GMV, Burn Rate Logistik), dan filter interaktif regional.",
        concept: `Untuk memastikan dewan direksi dapat memantau implementasi kebijakan baru secara harian, analis capstone merancang Dashboard Eksekutif Interaktif yang terintegrasi penuh.

Spesifikasi Dashboard Capstone:
- Panel Atas: 4 Kartu KPI Utama (GMV Nasional, Net Profit Margin %, Rata-rata Subsidi Ongkir per Pesanan, Skor Kesehatan Omnichannel).
- Panel Tengah Kiri: Grafik Area Tren Margin Laba Mingguan dengan garis batas target 20%.
- Panel Tengah Kanan: Grafik Batang Horizontal Kontribusi Laba per Saluran dan Kategori Produk.
- Panel Bawah: Matriks Rincian Kinerja 50 Cabang Gerai Fisik dengan Format Kondisional (Hijau = Sehat, Merah = Anomali Biaya).
- Kontrol Global: Slicer Wilayah Geografis, Rentang Tanggal Dinamis, dan Pemilih Skenario Kebijakan.`,
        code: `# 10.8: Arsitektur Data Model Dashboard Eksekutif Capstone
dashboard_kpi_state = {
    'Headline_Metrics': {
        'Net_Sales_QTD': 'Rp 512.4 Miliar (+8.2% vs Target)',
        'Net_Profit_Margin': '20.4% (Pulih dari Titik Terendah 12.1%)',
        'Subsidi_Ongkir_Per_Trx': 'Rp 4,200 (Turun 72% pasca-kebijakan threshold)',
        'Pelanggan_Omnichannel_Aktif': '18,450 Pengguna (+24% MoM)'
    },
    'Visual_Widgets': [
        'Weekly Gross vs Net Margin Trajectory (Line + Threshold Band)',
        'Channel Profitability Waterfalls (Offline vs Online vs BOPIS)',
        'Regional Store Heatmap with Conditional Margin Alert',
        'Customer Cohort Retention Curve post-policy update'
    ],
    'Filter_Cross_Interactions': 'Synchronized Cross-filtering across all 4 widgets enabled.'
}

print("=== SPESIFIKASI OPERASIONAL DASHBOARD EKSEKUTIF CAPSTONE ===")
print("Kartu KPI Utama:")
for kpi, val in dashboard_kpi_state['Headline_Metrics'].items():
    print(f"  * {kpi:28}: {val}")
print("\\nKomponen Visual Interaktif:")
for widget in dashboard_kpi_state['Visual_Widgets']:
    print(f"  [Widget] {widget}")`,
        expectedOutput: "Spesifikasi dashboard eksekutif capstone tercetak terstruktur.",
        codeExp: "Skrip merumuskan arsitektur antarmuka dashboard eksekutif yang memadukan indikator kinerja utama dan visualisasi interaktif untuk pemantauan berkelanjutan oleh manajemen.",
        pitfalls: [
          "Membuat dashboard tanpa menetapkan batas ambang peringatan (Threshold Alert), sehingga manajemen tidak tahu kapan suatu angka masuk dalam kategori berbahaya.",
          "Menampilkan data dengan latensi keterlambatan berminggu-minggu yang tidak lagi relevan untuk aksi taktis."
        ],
        refTitle: "Stephen Few: Information Dashboard Design",
        refUrl: "https://www.stephen-few.com/"
      },
      {
        num: "10.9",
        slug: "10-9-penyusunan-presentasi-rekomendasi-c-level-pitch-deck",
        title: "10.9. Penyusunan Presentasi Rekomendasi Strategis C-Level (Executive Pitch Deck)",
        desc: "Teknik presentasi persuasif: struktur 10-slide pitch deck eksekutif, storytelling berbasis Piramida Minto, antisipasi pertanyaan sulit direksi (Q&A Defense), dan transisi ke tindakan nyata.",
        concept: `Puncak karier seorang analis data diuji saat berdiri di hadapan Dewan Direksi (CEO, CFO, COO, CMO) untuk mempresentasikan temuan dan mempertahankan rekomendasi strategisnya. Eksekutif senior memiliki rentang perhatian yang sangat pendek dan fokus tajam pada hasil akhir.

Struktur Pitch Deck Eksekutif 10 Slide Standar Industri:
1. Executive Summary & The Big Ask: Ringkasan masalah, temuan kunci, dan persetujuan yang diminta dalam 1 slide.
2. Konteks Makro & Penurunan Profitabilitas: Gambaran tren penurunan marjin YoY.
3. Dekomposisi Masalah (Where is the bleeding?): Bukti empiris bahwa masalah berakar di subsidi online app.
4. Perilaku Pelanggan (Who is benefiting?): Bukti segmentasi RFM bahwa pemburu promo membakar laba.
5. Pembuktian Ilmiah Signifikansi: Validasi uji statistik bahwa kebijakan promo saat ini gagal.
6. Rekomendasi Solusi 3 Pilar: Batas ongkir, pergeseran ke BOPIS, dan program loyalitas.
7. Model Proyeksi Finansial Q4: Potensi pemulihan laba Rp 40 Miliar.
8. Rencana Implementasi Roadmap 90 Hari: Tahapan peluncuran bertahap (Canary Rollout).
9. Matriks Mitigasi Risiko: Rencana cadangan jika volume penjualan mengalami penurunan sementara.
10. Call-to-Action & Persetujuan Direksi: Keputusan resmi yang harus ditandatangani hari ini.`,
        code: `# 10.9: Garis Besar Struktur Pitch Deck Eksekutif 10 Slide
deck_eksekutif = [
    ("Slide 1: Executive Summary", "Masalah erosi laba 18% teridentifikasi pada subsidi promo online; rekomendasi kebijakan baru diproyeksikan memulihkan laba Rp 40 Miliar di Q4."),
    ("Slide 2: Konteks Pasar & Fakta", "GMV tumbuh +5% tetapi laba bersih anjlok dari 32% ke 14% secara YoY."),
    ("Slide 3: Dekomposisi Kanal", "Kanal Online membukukan margin -2.2% akibat subsidi logistik dan diskon ganda."),
    ("Slide 4: Profiling Pelanggan RFM", "65% anggaran promosi tersedot oleh segmen Bargain Hunters yang memiliki retensi 0%."),
    ("Slide 5: Validasi Statistik", "Uji Welch t-Test membuktikan defisit margin -20.5% signifikan secara statistik (p < 0.0001)."),
    ("Slide 6: Solusi 3 Pilar", "Terapkan minimum belanja Rp 250rb untuk gratis ongkir, insentif BOPIS, dan alihkan dana ke loyalitas."),
    ("Slide 7: Proyeksi Finansial", "Simulasi membuktikan margin laba bersih akan pulih ke 20.2% dengan tambahan kas Rp 40 Miliar."),
    ("Slide 8: Roadmap Eksekusi", "Fase 1 (Hari 1-30): A/B Testing Threshold. Fase 2 (Hari 31-60): Rilis BOPIS. Fase 3 (Hari 61-90): Program Loyalitas."),
    ("Slide 9: Manajemen Risiko", "Jika GMV turun > 5%, aktifkan voucher personalisasi segmen moderat secara dinamis."),
    ("Slide 10: Call to Action", "Persetujuan Direksi untuk mengesahkan revisi kebijakan subsidi promosi per 1 Oktober 2026.")
]

print("=== OUTLINE PITCH DECK PRESENTASI C-LEVEL ===")
for judul, poin in deck_eksekutif:
    print(f"[{judul}]\\n  Pesan Inti: {poin}\\n")`,
        expectedOutput: "Kerangka presentasi 10 slide pitch deck eksekutif tercetak terstruktur.",
        codeExp: "Skrip menyusun arsitektur naratif presentasi eksekutif berdasarkan standar komunikasi kepemimpinan global, memastikan pesan inti tersampaikan secara persuasif dan terstruktur.",
        pitfalls: [
          "Memulai presentasi dengan menjelaskan rincian teknis kode Python atau rumus SQL yang membosankan bagi direksi.",
          "Bersikap defensif saat direksi mengajukan pertanyaan kritis; akui batasan asumsi model dan tunjukkan mitigasi risikonya."
        ],
        refTitle: "Barbara Minto: The Pyramid Principle - Logic in Writing and Thinking",
        refUrl: "https://www.mckinsey.com/alumni/news-and-insights/global-news/alumni-news/barbara-minto-the-legend-of-the-pyramid-principle"
      },
      {
        num: "10.10",
        slug: "10-10-dokumentasi-tata-kelola-repositori-pemeliharaan",
        title: "10.10. Dokumentasi Tata Kelola Data, Repositori Kode & Rencana Pemeliharaan",
        desc: "Penutupan siklus hidup proyek analitik: dokumentasi data dictionary, modularisasi repositori Git, otomatisasi pipeline via CI/CD, dan audit kepatuhan regulasi data.",
        concept: `Pekerjaan seorang analis data profesional belum selesai sampai seluruh pekerjaan terdokumentasi dengan rapi, dapat direproduksi oleh analis lain (Reproducibility), dan dipelihara secara otomatis di sistem produksi.

Standar Penutupan Proyek Capstone Enterprise:
1. Data Dictionary & Metrik Catalog: Setiap tabel, kolom, tipe data, dan definisi bisnis didokumentasikan di katalog data terpusat sehingga tidak terjadi ambiguitas penafsiran rumus metrik.
2. Repositori Kode Bersih (Clean Git Repository): Kode Python dan kueri SQL diorganisir ke dalam modul modular yang rapi (src/etl, src/models, src/dashboard) lengkap dengan file README.md, panduan instalasi requirements.txt, dan unit testing otomatis.
3. Orkestrasi Pipeline Terjadwal (Orchestration): Seluruh pipeline pembersihan data dan pengujian otomatis dihubungkan ke alat orkestrasi seperti Apache Airflow, Prefect, atau GitHub Actions untuk eksekusi terjadwal setiap dini hari.
4. Kepatuhan Regulasi & Tata Kelola (Data Governance): Memastikan seluruh data identitas pribadi pelanggan (PII) telah dianonimkan (Hashed/Masked) sesuai kepatuhan UU Perlindungan Data Pribadi (UU PDP) dan standar ISO 27001.`,
        code: `# 10.10: Standar Dokumentasi Kamus Data (Data Dictionary) dan Log Pemeliharaan
import pandas as pd

kamus_data_capstone = pd.DataFrame({
    'Nama_Tabel': ['fact_orders', 'fact_orders', 'dim_customer', 'agg_monthly_kpi'],
    'Nama_Kolom': ['order_id', 'gross_margin_pct', 'customer_id_hash', 'net_profit_miliar'],
    'Tipe_Data': ['VARCHAR(32)', 'DECIMAL(5,2)', 'VARCHAR(64)', 'DECIMAL(12,2)'],
    'Deskripsi_Kanonikal': [
        'ID unik transaksi penjualan (Primary Key)',
        'Persentase margin laba kotor setelah dikurangi HPP dan diskon langsung',
        'ID pelanggan yang telah disamarkan menggunakan algoritma enkripsi SHA-256 (Kepatuhan UU PDP)',
        'Total laba bersih bulanan yang telah diaudit oleh tim keuangan korporat'
    ],
    'Aturan_Validasi': ['Wajib Unik & Not Null', 'Rentang -100.00 s/d 100.00', 'Wajib Format Hex 64 Karakter', 'Konsisten dengan Laporan Keuangan']
})

print("=== KAMUS DATA KANONIKAL TATA KELOLA ENTERPRISE (DATA DICTIONARY) ===")
print(kamus_data_capstone.to_string(index=False))
print("\\n[STATUS PROYEK CAPSTONE]: SELESAI & TELAH DITERAPKAN DI LINGKUNGAN PRODUKSI.")`,
        expectedOutput: "Kamus data kanonikal enterprise tercetak terstruktur menandai selesainya proyek capstone.",
        codeExp: "Skrip merumuskan kamus data tata kelola enterprise yang menjamin integritas definisi metrik, privasi pelanggan, dan keberlanjutan pemeliharaan pipeline analitik di masa depan.",
        pitfalls: [
          "Meninggalkan repositori analitik tanpa dokumentasi requirements.txt atau panduan instalasi berkas, membuat kode tidak dapat dijalankan oleh rekan tim lainnya.",
          "Menyimpan data identitas pribadi pelanggan (nama asli, nomor KTP, nomor telepon) secara terang-terangan tanpa enkripsi atau hashing."
        ],
        refTitle: "DAMA International: Data Management Body of Knowledge (DAMA-DMBOK2)",
        refUrl: "https://www.dama.org/cpages/dmbok-2nd-edition"
      }
    ]
  }
];
