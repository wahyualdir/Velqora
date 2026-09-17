import * as fs from "fs";
import * as path from "path";

console.log("Building comprehensive Data Analyst curriculum topic...");

// Helper untuk membersihkan string template
function escapeStr(s: string): string {
  return JSON.stringify(s);
}

// 10 Bab Kurikulum Data Analyst
const CHAPTERS_META = [
  {
    orderIndex: 1,
    id: "data-analyst-ch-1",
    slug: "bab-1-metodologi-analisis-data-modern-siklus-hidup-analitik",
    title: "BAB 1: Metodologi Analisis Data Modern & Siklus Hidup Analitik",
    desc: "Fondasi metodologis analisis data tingkat profesional: siklus hidup CRISP-DM dan OSEMN, dekomposisi masalah bisnis dengan Issue Tree, perumusan metrik SMART, taksonomi analitik, dan etika regulasi data.",
    coreConcepts: ["Analytics Lifecycle", "Business Problem Framing", "Analytics Taxonomy", "Data Governance"],
    subchapters: [
      {
        num: "1.1",
        title: "1.1. Siklus Hidup Analisis Data (CRISP-DM & OSEMN)",
        slug: "1-1-siklus-hidup-analisis-data-crisp-dm-osemn",
        concept: "Siklus hidup analisis data merupakan kerangka kerja terstruktur yang memandu praktisi data dari pemahaman masalah bisnis mentah hingga penerapan wawasan operasional. Tanpa panduan metodologis yang baku, proyek analitik rentan terjebak dalam eksplorasi ad-hoc tanpa arah yang menghabiskan sumber daya komputasi tanpa memberikan nilai bisnis terukur.\\n\\nDua kerangka kerja paling dominan dalam industri adalah CRISP-DM (Cross-Industry Standard Process for Data Mining) dan OSEMN (Obtain, Scrub, Explore, Model, iNterpret). CRISP-DM menekankan keterikatan siklus yang berulang (iterative loop) di mana evaluasi model dapat memaksa praktisi kembali meninjau pemahaman bisnis atau pembersihan data.\\n\\nDalam praktiknya di industri teknologi modern, integrasi CRISP-DM dan metodologi Agile memungkinkan rilis wawasan bertahap (sprint-based deliverables). Pemahaman mendalam terhadap siklus ini mencegah kesalahan umum seperti melompat langsung ke pemodelan algoritma sebelum memvalidasi asumsi kualitas data masukan.",
        code: `# 1.1: Pemetaan Fase CRISP-DM & Pelacakan Deliverable Proyek
import pandas as pd

# Mendefinisikan tahapan CRISP-DM, alokasi bobot waktu, dan deliverable utama
crisp_dm = pd.DataFrame({
    'Fase': ['1. Business Understanding', '2. Data Understanding', '3. Data Preparation', '4. Modeling', '5. Evaluation', '6. Deployment'],
    'Bobot_Waktu_Pct': [15, 20, 35, 15, 10, 5],
    'Status': ['Selesai', 'Selesai', 'Sedang Berjalan', 'Belum Dimulai', 'Belum Dimulai', 'Belum Dimulai'],
    'Deliverable_Kunci': ['Project Charter & KPIs', 'Data Audit Report & Dictionary', 'Cleaned Pipeline & Feature Store', 'Statistical / Analytical Model', 'Business Goal Alignment Report', 'Production Dashboard & Alerts']
})

# Menghitung progres kumulatif proyek analitik
progres_total = crisp_dm[crisp_dm['Status'] == 'Selesai']['Bobot_Waktu_Pct'].sum()
print("=== SIKLUS HIDUP PROYEK ANALITIK DATA (CRISP-DM) ===")
print(crisp_dm[['Fase', 'Bobot_Waktu_Pct', 'Status']].to_string(index=False))
print(f"\\nTotal Progres Selesai: {progres_total}%")`,
        output: "Total Progres Selesai: 35%",
        refUrl: "https://github.com/ossu/data-science",
        refTitle: "OSSU Data Science Curriculum: Lifecycle & Methodology"
      },
      {
        num: "1.2",
        title: "1.2. Perumusan Masalah Bisnis dengan Pendekatan Top-Down (Issue Tree & MECE)",
        slug: "1-2-perumusan-masalah-bisnis-dengan-pendekatan-top-down-issue-tree",
        concept: "Perumusan masalah bisnis merupakan pembeda utama antara analis data operasional dan mitra strategis manajemen. Seringkali pemangku kepentingan mengajukan keluhan yang ambigu seperti 'Pendapatan Q3 turun, tolong cari tahu penyebabnya'. Analis profesional tidak langsung memeriksa seluruh tabel data secara acak, melainkan menyusun struktur dekomposisi logis.\\n\\nPrinsip MECE (Mutually Exclusive, Collectively Exhaustive) yang dirintis oleh konsultan manajemen McKinsey menuntut bahwa pembagian elemen masalah tidak boleh saling tumpang tindih (mutually exclusive) dan jika digabungkan harus mencakup seluruh kemungkinan semesta masalah (collectively exhaustive).\\n\\nDengan Issue Tree berbasis MECE, pendapatan (Revenue) dapat dipecah menjadi perkalian antara Jumlah Transaksi (Order Count) dan Rata-rata Nilai Pesanan (Average Order Value - AOV). Masing-masing cabang kemudian dipecah lebih lanjut ke tingkat kohort pengguna atau kategori produk.",
        code: `# 1.2: Dekomposisi Pohon Masalah MECE untuk Analisis Pendapatan Bisnis
import pandas as pd

# Data kinerja baseline (Bulan Lalu) vs aktual (Bulan Ini)
metrics = {
    'Komponen': ['Pengguna Aktif', 'Rasio Konversi (%)', 'Rata-rata Belanja (AOV Rp)'],
    'Bulan_Lalu': [100000, 3.5, 250000],
    'Bulan_Ini':  [95000,  3.2, 270000]
}
df_tree = pd.DataFrame(metrics)

# Menghitung pendapatan total: Pengguna * (Konversi/100) * AOV
rev_lalu = df_tree.loc[0, 'Bulan_Lalu'] * (df_tree.loc[1, 'Bulan_Lalu']/100) * df_tree.loc[2, 'Bulan_Lalu']
rev_ini  = df_tree.loc[0, 'Bulan_Ini']  * (df_tree.loc[1, 'Bulan_Ini']/100)  * df_tree.loc[2, 'Bulan_Ini']
varians = rev_ini - rev_lalu

print("=== HASIL DEKOMPOSISI POHON MASALAH PENDAPATAN ===")
print(f"Pendapatan Bulan Lalu : Rp {rev_lalu:,.0f}")
print(f"Pendapatan Bulan Ini  : Rp {rev_ini:,.0f}")
print(f"Varians Finansial     : Rp {varians:,.0f} ({(varians/rev_lalu)*100:.2f}%)")`,
        output: "Varians Finansial teridentifikasi dengan presisi analitis.",
        refUrl: "https://jakevdp.github.io/PythonDataScienceHandbook/",
        refTitle: "Python Data Science Handbook: Problem Framing & Decomposition"
      },
      {
        num: "1.3",
        title: "1.3. Kerangka Metrik SMART untuk Menentukan Key Performance Indicators (KPI)",
        slug: "1-3-kerangka-metrik-smart-untuk-menentukan-key-performance-indicators-kpi",
        concept: "Key Performance Indicator (KPI) adalah kompas kuantitatif yang mengarahkan keputusan taktis dan strategis organisasi. Namun, banyak organisasi terjebak dalam memantau 'vanity metrics'—angka-angka yang tampak impresif di permukaan namun tidak memiliki korelasi langsung terhadap keberlanjutan bisnis.\\n\\nKerangka SMART memastikan setiap metrik dirumuskan secara terukur: Specific (jelas sasarannya), Measurable (dapat dihitung secara numerik), Achievable (realistis dicapai), Relevant (berdampak langsung pada tujuan utama), dan Time-bound (memiliki horizon waktu evaluasi yang tegas).\\n\\nDalam ranah e-commerce dan SaaS, metrik seperti Customer Acquisition Cost (CAC), Customer Lifetime Value (CLV), Monthly Recurring Revenue (MRR), dan Churn Rate merupakan contoh metrik SMART yang memberikan panduan aksi nyata bagi tim manajemen.",
        code: `# 1.3: Audit Metrik SMART Kesehatan Unit Ekonomi Bisnis (LTV : CAC)
import pandas as pd

cac = 1200000        # Customer Acquisition Cost (Rp)
arpu = 350000        # Rata-rata Pendapatan per Pengguna per Bulan (Rp)
gross_margin = 0.80  # Margin Kotor 80%
churn_rate = 0.05    # Tingkat Churn 5% per bulan

# Menghitung Customer Lifetime Value (LTV) = (ARPU * Margin) / Churn
ltv = (arpu * gross_margin) / churn_rate
rasio_ltv_cac = ltv / cac

print("=== EVALUASI METRIK KESEHATAN EKONOMI UNIT ===")
print(f"Customer Lifetime Value (LTV) : Rp {ltv:,.0f}")
print(f"Customer Acquisition Cost (CAC): Rp {cac:,.0f}")
print(f"Rasio Kelayakan (LTV : CAC)    : {rasio_ltv_cac:.2f}x (Ambang Sehat >= 3.0x)")`,
        output: "Rasio Kelayakan (LTV : CAC) : 4.67x (Ambang Sehat >= 3.0x)",
        refUrl: "https://www.kaggle.com/learn",
        refTitle: "Kaggle Learn: Business Analytics & SMART Metrics"
      },
      {
        num: "1.4",
        title: "1.4. Taksonomi Analitik: Deskriptif, Diagnostik, Prediktif, dan Preskriptif",
        slug: "1-4-taksonomi-analitik-deskriptif-diagnostik-prediktif-dan-preskriptif",
        concept: "Gartner membagi analitik data ke dalam empat kuadran kematangan kapabilitas: Analitik Deskriptif ('Apa yang telah terjadi?'), Analitik Diagnostik ('Mengapa hal itu terjadi?'), Analitik Prediktif ('Apa yang mungkin terjadi di masa depan?'), dan Analitik Preskriptif ('Tindakan apa yang harus kita ambil untuk mencapai hasil optimal?').\\n\\nAnalitik Deskriptif merangkum data historis melalui dashboard dan laporan agregat. Analitik Diagnostik melangkah lebih dalam menggunakan teknik drill-down, korelasi, dan isolasi anomali untuk membongkar akar penyebab peristiwa bisnis.\\n\\nTingkatan lanjutan melibatkan estimasi probabilitas masa depan menggunakan model statistika/machine learning (Prediktif), dan diakhiri dengan perumusan skenario keputusan teroptimasi menggunakan riset operasi atau simulasi skenario (Preskriptif).",
        code: `# 1.4: Demonstrasi 4 Tingkatan Taksonomi Analitik pada Data Penjualan
import numpy as np
import pandas as pd

# Data historis harga dan volume unit terjual
harga = np.array([100, 105, 110, 115, 120, 125])
unit = np.array([500, 470, 440, 410, 380, 340])

# 1. Deskriptif: Total pendapatan historis
total_omzet = np.sum(harga * unit)

# 2. Diagnostik: Elastisitas harga terhadap permintaan (Slope)
slope, intercept = np.polyfit(harga, unit, 1)

# 3. Prediktif: Proyeksi unit jika harga dinaikkan ke Rp 130
unit_pred_130 = slope * 130 + intercept

# 4. Preskriptif: Simulasi harga yang memaksimalkan total omzet
rentang_harga = np.linspace(80, 150, 71)
omzet_simulasi = rentang_harga * (slope * rentang_harga + intercept)
harga_opt = rentang_harga[np.argmax(omzet_simulasi)]

print(f"1. Deskriptif : Total Omzet = Rp {total_omzet:,.0f}")
print(f"2. Diagnostik  : Sensitivitas Permintaan = {slope:.2f} unit/Rp")
print(f"3. Prediktif   : Estimasi Volume pada Harga 130 = {unit_pred_130:.0f} unit")
print(f"4. Preskriptif : Rekomendasi Harga Optimal = Rp {harga_opt:.0f}")`,
        output: "4 tingkatan taksonomi analitik berhasil dikomputasi.",
        refUrl: "https://pandas.pydata.org/docs/user_guide/computation.html",
        refProvider: "PyData",
        refTitle: "Pandas User Guide: Computational Tools"
      },
      {
        num: "1.5",
        title: "1.5. Etika Data, Privasi Pengguna, dan Kepatuhan Regulasi (GDPR, UU PDP)",
        slug: "1-5-etika-data-privasi-pengguna-dan-kepatuhan-regulasi-gdpr-uu-pdp",
        concept: "Analis data memiliki tanggung jawab moral dan hukum terhadap informasi pribadi yang dikelolanya. Pemberlakuan regulasi ketat seperti General Data Protection Regulation (GDPR) di Uni Eropa dan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022) di Indonesia mengubah paradigma pemrosesan data: privasi bukan lagi fitur opsional, melainkan kewajiban mutlak (privacy by design).\\n\\nData pribadi mencakup Personally Identifiable Information (PII) langsung (nama, NIK, nomor telepon) dan quasi-identifiers (kombinasi kode pos, tanggal lahir, jenis kelamin) yang dapat digunakan untuk merekonstruksi identitas individu.\\n\\nPraktisi data wajib menerapkan teknik reduksi risiko seperti pseudonimisasi, agregasi tingkat tinggi, dan pembuangan atribut yang tidak relevan dengan tujuan analitik (prinsip data minimization).",
        code: `# 1.5: Pipeline Anonimisasi Data PII & Audit Kepatuhan Privasi
import hashlib
import pandas as pd

raw_data = pd.DataFrame({
    'Nama': ['Budi Santoso', 'Siti Aminah', 'Ahmad Fauzi'],
    'NIK': ['3171012304850001', '3273024508900002', '3171012304850003'],
    'Kota': ['Jakarta', 'Bandung', 'Jakarta'],
    'Nominal_Belanja': [1500000, 750000, 2100000]
})

# Pseudonimisasi NIK menggunakan Secure Hash Algorithm (SHA-256)
raw_data['User_Token'] = raw_data['NIK'].apply(lambda x: hashlib.sha256(x.encode()).hexdigest()[:12])
anonymized_df = raw_data.drop(columns=['Nama', 'NIK'])

print("=== DATASET SETELAH ANONIMISASI PII (COMPLIANT) ===")
print(anonymized_df.to_string(index=False))`,
        output: "Dataset PII berhasil dianonimisasi dengan aman.",
        refUrl: "https://docs.python.org/3/library/hashlib.html",
        refTitle: "Python Documentation: Cryptographic Hashing (hashlib)"
      },
      {
        num: "1.6",
        title: "1.6. Strategi Pengumpulan Data Primer vs Sekunder dalam Ekosistem Enterprise",
        slug: "1-6-strategi-pengumpulan-data-primer-vs-sekunder-dalam-ekosistem-enterprise",
        concept: "Data merupakan bahan bakar seluruh proses analitik. Berdasarkan sumber perolehannya, data diklasifikasikan menjadi data primer (dikumpulkan langsung oleh organisasi untuk tujuan tertentu) dan data sekunder (data yang telah dikumpulkan oleh entitas lain seperti sensus pemerintah, publikasi industri, atau agregator komersial).\\n\\nDalam ekosistem enterprise modern, pengumpulan data primer mencakup integrasi event logging pada aplikasi seluler, data transaksi basis data relasional (OLTP), dan telemetri perangkat IoT. Sementara data sekunder sering dimanfaatkan sebagai variabel pengaya (enrichment features) seperti data cuaca, indeks inflasi, atau benchmark kompetitor.\\n\\nPemilihan strategi akuisisi data harus mempertimbangkan trade-off antara biaya pengumpulan, kebaruan (latency), akurasi, dan hak kepemilikan data (data provenance).",
        code: `# 1.6: Ingestion dan Validasi Skema Data Telemetri Primer JSON
import json
import pandas as pd

raw_stream = [
    '{"event_id": "e1", "user_id": 101, "action": "checkout", "amount": 250000}',
    '{"event_id": "e2", "user_id": 102, "action": "add_cart", "amount": 0}',
    '{"event_id": "e3", "user_id": 103, "action": "checkout", "amount": 180000}'
]

records = [json.loads(s) for s in raw_stream if json.loads(s).get('amount', 0) >= 0]
df_stream = pd.DataFrame(records)
print("=== TABEL INGESTION DATA TELEMETRI PRIMER ===")
print(df_stream.to_string(index=False))`,
        output: "Tabel data telemetri primer tervalidasi.",
        refUrl: "https://docs.python.org/3/library/json.html",
        refTitle: "Python Documentation: JSON Data Interchange"
      },
      {
        num: "1.7",
        title: "1.7. Dokumentasi Kamus Data (Data Dictionary) dan Metadata Management",
        slug: "1-7-dokumentasi-kamus-data-data-dictionary-dan-metadata-management",
        concept: "Kamus data (Data Dictionary) adalah katalog terpusat yang mendokumentasikan definisi, tipe data, rentang nilai valid, dan aturan bisnis dari setiap kolom dalam gudang data. Tanpa dokumentasi yang ketat, tim analitik sering mengalami miskomunikasi—misalnya, apakah kolom 'active_user' dihitung berdasarkan login 7 hari terakhir atau 30 hari terakhir.\\n\\nMetadata management mencakup tiga pilar: metadata bisnis (definisi istilah, pemilik data), metadata teknis (tipe kolom, batasan relasi, indeks), dan metadata operasional (waktu refresh terakhir, jumlah baris, durasi eksekusi kueri).\\n\\nData lineage memungkinkan analis melacak asal-usul setiap metrik: dari mana angka pendapatan berasal, tabel perantara apa yang melakukan transformasi, dan dasbor mana saja yang mengonsumsi angka tersebut.",
        code: `# 1.7: Ekstraksi Otomatis Metadata Kamus Data Tabular
import pandas as pd

df = pd.DataFrame({
    'cust_id': [1, 2, 3],
    'order_val': [150000.0, 75000.0, 320000.0],
    'is_loyal': [True, False, True]
})

dict_rows = []
for col in df.columns:
    dict_rows.append({
        'Kolom': col,
        'Tipe_Data': str(df[col].dtype),
        'Total_Non_Null': df[col].count(),
        'Nilai_Unik': df[col].nunique()
    })

data_dict = pd.DataFrame(dict_rows)
print("=== METADATA KAMUS DATA OTOMATIS ===")
print(data_dict.to_string(index=False))`,
        output: "Metadata kamus data berhasil diekstraksi.",
        refUrl: "https://pandas.pydata.org/docs/user_guide/basics.html",
        refTitle: "Pandas Documentation: Essential Basic Functionality"
      },
      {
        num: "1.8",
        title: "1.8. Penilaian Kualitas Data: Dimensi Validitas, Akurasi, Kelengkapan, Konsistensi",
        slug: "1-8-penilaian-kualitas-data-dimensi-validitas-akurasi-kelengkapan-konsistensi",
        concept: "Kualitas data adalah tingkat kesesuaian data terhadap tujuan penggunaannya (fitness for use). Keputusan bisnis yang diambil dari data berkualitas buruk akan menghasilkan kerugian finansial yang signifikan—sebuah prinsip yang dikenal sebagai 'Garbage In, Garbage Out' (GIGO).\\n\\nDAMA International merumuskan enam dimensi utama kualitas data: (1) Kelengkapan (Completeness) - tidak ada nilai yang hilang secara tidak wajar; (2) Akurasi (Accuracy) - nilai mencerminkan fakta dunia nyata; (3) Validitas (Validity) - nilai mematuhi format dan aturan sintaks domain; (4) Konsistensi (Consistency) - tidak ada pertentangan informasi lintas tabel; (5) Keunikan (Uniqueness) - tidak ada entitas duplikat; dan (6) Ketepatan Waktu (Timeliness) - data mutakhir saat dianalisis.\\n\\nMelakukan audit kualitas secara berkala memungkinkan analis mendeteksi kerusakan pada pipeline data hulu sebelum laporan disampaikan kepada pemangku kepentingan.",
        code: `# 1.8: Audit Otomatis Kualitas Data (DAMA Framework)
import pandas as pd

df_audit = pd.DataFrame({
    'id': [1, 2, 2, 4],
    'email': ['a@mail.com', None, 'b@mail.com', 'c@mail.com'],
    'usia': [25, 150, 30, -5]
})

completeness = (df_audit['email'].notnull().sum() / len(df_audit)) * 100
uniqueness = (df_audit['id'].nunique() / len(df_audit)) * 100
validity = (df_audit['usia'].between(0, 100).sum() / len(df_audit)) * 100

print(f"Kelengkapan Email : {completeness:.1f}%")
print(f"Keunikan ID       : {uniqueness:.1f}%")
print(f"Validitas Usia    : {validity:.1f}%")
print(f"Indeks Komposit   : {((completeness + uniqueness + validity)/3):.1f}%")`,
        output: "Audit kualitas data berhasil dijalankan.",
        refUrl: "https://www.kaggle.com/learn/data-cleaning",
        refTitle: "Kaggle Learn: Data Cleaning Standards"
      },
      {
        num: "1.9",
        title: "1.9. Kolaborasi Antar-Fungsi: Menjembatani Tim Teknis dan Pemangku Kepentingan Bisnis",
        slug: "1-9-kolaborasi-antar-fungsi-menjembatani-tim-teknis-dan-pemangku-kepentingan-bisnis",
        concept: "Kegagalan proyek data analytics paling sering bukan disebabkan oleh kesalahan algoritma, melainkan oleh jurang komunikasi antara analis teknis dan pemangku kepentingan bisnis (business stakeholders). Analis cenderung memaparkan metrik statistik teknis seperti p-value, R-squared, atau arsitektur transformer, sementara eksekutif hanya peduli pada tiga hal: pendapatan, biaya, dan risiko.\\n\\nKomunikasi analitik yang efektif menuntut kemampuan 'translasi ganda': pertama, menerjemahkan kebutuhan bisnis yang samar menjadi kueri dan model data matematis yang presisi; kedua, menerjemahkan output angka numerik kembali menjadi narasi tindakan bisnis yang jelas.\\n\\nPenerapan matriks RACI (Responsible, Accountable, Consulted, Informed) memastikan setiap pemangku kepentingan mengetahui perannya, meminimalkan friksi politik organisasi, dan mempercepat adopsi wawasan data.",
        code: `# 1.9: Matriks RACI Tata Kelola Kolaborasi Tim Data Enterprise
import pandas as pd

raci = pd.DataFrame({
    'Tahap': ['Problem Framing', 'Data Cleaning', 'Modeling', 'Insight Presentation'],
    'Business_Lead': ['Accountable', 'Informed', 'Consulted', 'Accountable'],
    'Data_Analyst': ['Responsible', 'Responsible', 'Responsible', 'Responsible'],
    'Data_Engineer': ['Consulted', 'Accountable', 'Informed', 'Informed']
})
print("=== MATRIKS AKUNTABILITAS PROYEK ANALITIK ===")
print(raci.to_string(index=False))`,
        output: "Matriks RACI berhasil dimodelkan.",
        refUrl: "https://jakevdp.github.io/PythonDataScienceHandbook/",
        refTitle: "Python Data Science Handbook: Practical Workflows"
      },
      {
        num: "1.10",
        title: "1.10. Evaluasi Dampak Bisnis dan Penentuan Return on Investment (ROI) Proyek Data",
        slug: "1-10-evaluasi-dampak-bisnis-dan-penentuan-return-on-investment-roi-proyek-data",
        concept: "Setiap inisiatif data analytics dalam perusahaan harus dapat dibuktikan kelayakan finansialnya. Pemimpin bisnis menuntut justifikasi investasi terhadap biaya lisensi server, infrastruktur cloud data warehouse, dan gaji tim data. Oleh karena itu, analis data senior wajib menguasai kuantifikasi dampak bisnis (business value attribution).\\n\\nDampak analitik umumnya terbagi menjadi dua kategori: peningkatan pendapatan (incremental revenue generation)—misalnya melalui optimasi konversi kampanye atau strategi harga dinamis; dan efisiensi biaya (cost reduction)—seperti otomatisasi pelaporan manual atau pengurangan churn pelanggan.\\n\\nEvaluasi paska-implementasi (Post-Implementation Review) mengukur apakah proyeksi keuntungan yang dijanjikan pada tahap awal benar-benar terealisasi setelah sistem diterapkan selama 3 hingga 6 bulan di lingkungan produksi.",
        code: `# 1.10: Perhitungan Return on Investment (ROI) & Payback Period Proyek Analitik
biaya_investasi = 150000000   # Capex + Opex Tahun 1 (Rp)
penghematan_tahunan = 60000000 # Efisiensi waktu pelaporan
tambahan_revenue = 180000000   # Kenaikan omzet akibat wawasan analitik

total_manfaat = penghematan_tahunan + tambahan_revenue
net_benefit = total_manfaat - biaya_investasi
roi_pct = (net_benefit / biaya_investasi) * 100
payback_bulan = (biaya_investasi / (total_manfaat / 12))

print("=== EVALUASI FINANSIAL ROI INVESTASI ANALITIK ===")
print(f"Total Investasi : Rp {biaya_investasi:,.0f}")
print(f"Total Manfaat   : Rp {total_manfaat:,.0f}")
print(f"Laba Bersih     : Rp {net_benefit:,.0f}")
print(f"ROI             : {roi_pct:.1f}%")
print(f"Payback Period  : {payback_bulan:.1f} Bulan")`,
        output: "ROI dan Payback Period terhitung secara objektif.",
        refUrl: "https://github.com/ossu/data-science",
        refTitle: "OSSU Data Science: Financial Impact Evaluation"
      }
    ]
  }
];

console.log("Chapters metadata configured.");
