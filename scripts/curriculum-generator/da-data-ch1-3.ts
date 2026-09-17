export interface SubchapterDef {
  num: string;
  slug: string;
  title: string;
  desc: string;
  concept: string;
  formula?: string;
  code: string;
  expectedOutput: string;
  codeExp: string;
  pitfalls: string[];
  refTitle: string;
  refUrl: string;
}

export interface ChapterDef {
  orderIndex: number;
  id: string;
  slug: string;
  title: string;
  desc: string;
  coreConcepts: string[];
  subchapters: SubchapterDef[];
}

export const CHAPTERS_1_TO_3: ChapterDef[] = [
  // ==========================================
  // BAB 1: Metodologi Analisis Data Modern & Siklus Hidup Analitik
  // ==========================================
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
        slug: "1-1-siklus-hidup-analisis-data-crisp-dm-osemn",
        title: "1.1. Siklus Hidup Analisis Data (CRISP-DM & OSEMN)",
        desc: "Struktur metodologis alur kerja analitik data: perbandingan fase CRISP-DM dan OSEMN, integrasi iteratif, dan pemetaan deliverable tiap tahap.",
        concept: `Siklus hidup analisis data merupakan kerangka kerja terstruktur yang memandu praktisi data dari pemahaman masalah bisnis mentah hingga penerapan wawasan operasional. Tanpa panduan metodologis yang baku, proyek analitik rentan terjebak dalam eksplorasi ad-hoc tanpa arah yang menghabiskan sumber daya komputasi tanpa memberikan nilai bisnis terukur.

Dua kerangka kerja paling dominan dalam industri adalah CRISP-DM (Cross-Industry Standard Process for Data Mining) dan OSEMN (Obtain, Scrub, Explore, Model, iNterpret). CRISP-DM menekankan keterikatan siklus yang berulang (iterative loop) di mana evaluasi model dapat memaksa praktisi kembali meninjau pemahaman bisnis atau pembersihan data.

Dalam praktiknya di industri teknologi modern, integrasi CRISP-DM dan metodologi Agile memungkinkan rilis wawasan bertahap (sprint-based deliverables). Pemahaman mendalam terhadap siklus ini mencegah kesalahan umum seperti melompat langsung ke pemodelan algoritma sebelum memvalidasi asumsi kualitas data masukan.`,
        code: `# 1.1: Pemetaan Fase CRISP-DM & Pelacakan Deliverable Proyek
import pandas as pd

crisp_dm = pd.DataFrame({
    'Fase': ['1. Business Understanding', '2. Data Understanding', '3. Data Preparation', '4. Modeling', '5. Evaluation', '6. Deployment'],
    'Bobot_Waktu_Pct': [15, 20, 35, 15, 10, 5],
    'Status': ['Selesai', 'Selesai', 'Sedang Berjalan', 'Belum Dimulai', 'Belum Dimulai', 'Belum Dimulai'],
    'Deliverable_Kunci': ['Project Charter & KPIs', 'Data Audit Report & Dictionary', 'Cleaned Pipeline & Feature Store', 'Statistical / Analytical Model', 'Business Goal Alignment Report', 'Production Dashboard & Alerts']
})

progres_total = crisp_dm[crisp_dm['Status'] == 'Selesai']['Bobot_Waktu_Pct'].sum()
print("=== SIKLUS HIDUP PROYEK ANALITIK DATA (CRISP-DM) ===")
print(crisp_dm[['Fase', 'Bobot_Waktu_Pct', 'Status']].to_string(index=False))
print(f"\\nTotal Progres Selesai: {progres_total}%")`,
        expectedOutput: "Total Progres Selesai: 35%",
        codeExp: "Skrip di atas memodelkan alur manajemen siklus hidup analitik CRISP-DM menggunakan DataFrame Pandas, memetakan bobot alokasi kerja, dan menghitung progres komputasi proyek secara terukur.",
        pitfalls: [
          "Melompati fase Business Understanding dan langsung menulis kueri/kode tanpa metrik keberhasilan yang jelas.",
          "Memperlakukan siklus hidup sebagai garis lurus (waterfall) tanpa melakukan iterasi ulang ketika data baru ditemukan."
        ],
        refTitle: "OSSU Data Science: Course Curriculum Guide",
        refUrl: "https://github.com/ossu/data-science"
      },
      {
        num: "1.2",
        slug: "1-2-perumusan-masalah-bisnis-dengan-pendekatan-top-down-issue-tree",
        title: "1.2. Perumusan Masalah Bisnis dengan Pendekatan Top-Down (Issue Tree & MECE)",
        desc: "Dekomposisi analitis permasalahan bisnis strategis menggunakan pohon isu berprinsip Mutually Exclusive, Collectively Exhaustive (MECE).",
        concept: `Perumusan masalah bisnis merupakan pembeda utama antara analis data operasional dan mitra strategis manajemen. Seringkali pemangku kepentingan mengajukan keluhan yang ambigu seperti 'Pendapatan Q3 turun, tolong cari tahu penyebabnya'. Analis profesional tidak langsung memeriksa seluruh tabel data secara acak, melainkan menyusun struktur dekomposisi logis.

Prinsip MECE (Mutually Exclusive, Collectively Exhaustive) yang dirintis oleh konsultan manajemen McKinsey menuntut bahwa pembagian elemen masalah tidak boleh saling tumpang tindih (mutually exclusive) dan jika digabungkan harus mencakup seluruh kemungkinan semesta masalah (collectively exhaustive).

Dengan Issue Tree berbasis MECE, pendapatan (Revenue) dapat dipecah menjadi perkalian antara Jumlah Transaksi (Order Count) dan Rata-rata Nilai Pesanan (Average Order Value - AOV). Masing-masing cabang kemudian dipecah lebih lanjut ke tingkat kohort pengguna atau kategori produk.`,
        formula: "$$\\text{Revenue} = \\text{Users} \\times \\text{Conversion Rate} \\times \\text{AOV}$$",
        code: `# 1.2: Dekomposisi Pohon Masalah MECE untuk Analisis Pendapatan Bisnis
import pandas as pd

metrics = {
    'Komponen': ['Pengguna Aktif', 'Rasio Konversi (%)', 'Rata-rata Belanja (AOV Rp)'],
    'Bulan_Lalu': [100000, 3.5, 250000],
    'Bulan_Ini':  [95000,  3.2, 270000]
}
df_tree = pd.DataFrame(metrics)

rev_lalu = df_tree.loc[0, 'Bulan_Lalu'] * (df_tree.loc[1, 'Bulan_Lalu']/100) * df_tree.loc[2, 'Bulan_Lalu']
rev_ini  = df_tree.loc[0, 'Bulan_Ini']  * (df_tree.loc[1, 'Bulan_Ini']/100)  * df_tree.loc[2, 'Bulan_Ini']
varians = rev_ini - rev_lalu

print("=== HASIL DEKOMPOSISI POHON MASALAH PENDAPATAN ===")
print(f"Pendapatan Bulan Lalu : Rp {rev_lalu:,.0f}")
print(f"Pendapatan Bulan Ini  : Rp {rev_ini:,.0f}")
print(f"Varians Finansial     : Rp {varians:,.0f} ({(varians/rev_lalu)*100:.2f}%)")`,
        expectedOutput: "Varians Finansial teridentifikasi dengan presisi analitis.",
        codeExp: "Kode mendemonstrasikan kalkulasi analitis dari cabang-cabang MECE pendapatan, memungkinkan analis menunjukkan faktor mana yang menyebabkan penurunan performa keuangan.",
        pitfalls: [
          "Menyusun cabang masalah yang saling tumpang tindih sehingga terjadi penghitungan ganda (double-counting).",
          "Mengabaikan variabel pendorong tersembunyi yang berada di luar dataset internal perusahaan."
        ],
        refTitle: "Python Data Science Handbook: Problem Framing & Decomposition",
        refUrl: "https://jakevdp.github.io/PythonDataScienceHandbook/"
      },
      {
        num: "1.3",
        slug: "1-3-kerangka-metrik-smart-untuk-menentukan-key-performance-indicators-kpi",
        title: "1.3. Kerangka Metrik SMART untuk Menentukan Key Performance Indicators (KPI)",
        desc: "Perancangan indikator kinerja kunci (KPI) berbasis kriteria Specific, Measurable, Achievable, Relevant, dan Time-bound.",
        concept: `Key Performance Indicator (KPI) adalah kompas kuantitatif yang mengarahkan keputusan taktis dan strategis organisasi. Namun, banyak organisasi terjebak dalam memantau 'vanity metrics'—angka-angka yang tampak impresif di permukaan namun tidak memiliki korelasi langsung terhadap keberlanjutan bisnis.

Kerangka SMART memastikan setiap metrik dirumuskan secara terukur: Specific (jelas sasarannya), Measurable (dapat dihitung secara numerik), Achievable (realistis dicapai), Relevant (berdampak langsung pada tujuan utama), dan Time-bound (memiliki horizon waktu evaluasi yang tegas).

Dalam ranah e-commerce dan SaaS, metrik seperti Customer Acquisition Cost (CAC), Customer Lifetime Value (CLV), Monthly Recurring Revenue (MRR), dan Churn Rate merupakan contoh metrik SMART yang memberikan panduan aksi nyata bagi tim manajemen.`,
        formula: "$$\\text{LTV} = \\frac{\\text{ARPU} \\times \\text{Gross Margin}}{\\text{Churn Rate}}$$",
        code: `# 1.3: Audit Metrik SMART Kesehatan Unit Ekonomi Bisnis (LTV : CAC)
cac = 1200000        # Customer Acquisition Cost (Rp)
arpu = 350000        # Rata-rata Pendapatan per Pengguna per Bulan (Rp)
gross_margin = 0.80  # Margin Kotor 80%
churn_rate = 0.05    # Tingkat Churn 5% per bulan

ltv = (arpu * gross_margin) / churn_rate
rasio_ltv_cac = ltv / cac

print("=== EVALUASI METRIK KESEHATAN EKONOMI UNIT ===")
print(f"Customer Lifetime Value (LTV) : Rp {ltv:,.0f}")
print(f"Customer Acquisition Cost (CAC): Rp {cac:,.0f}")
print(f"Rasio Kelayakan (LTV : CAC)    : {rasio_ltv_cac:.2f}x (Ambang Sehat >= 3.0x)")`,
        expectedOutput: "Rasio Kelayakan (LTV : CAC) : 4.67x (Ambang Sehat >= 3.0x)",
        codeExp: "Skrip menghitung metrik LTV dan rasio LTV:CAC berdasarkan data keuangan unit ekonomi, mengevaluasi keberlanjutan model bisnis secara objektif.",
        pitfalls: [
          "Memilih metrik akumulatif yang selalu naik daripada metrik tingkat keaktifan berjalan.",
          "Menghitung rata-rata tanpa mempertimbangkan skewness atau keberadaan pencilan nilai ekstrem."
        ],
        refTitle: "Kaggle Learn: Business Analytics & SMART Metrics",
        refUrl: "https://www.kaggle.com/learn"
      },
      {
        num: "1.4",
        slug: "1-4-taksonomi-analitik-deskriptif-diagnostik-prediktif-dan-preskriptif",
        title: "1.4. Taksonomi Analitik: Deskriptif, Diagnostik, Prediktif, dan Preskriptif",
        desc: "Empat tingkatan kematangan kapabilitas analitik: dari pelaporan historis hingga optimasi keputusan otomatis berbasis data.",
        concept: `Gartner membagi analitik data ke dalam empat kuadran kematangan kapabilitas: Analitik Deskriptif ('Apa yang telah terjadi?'), Analitik Diagnostik ('Mengapa hal itu terjadi?'), Analitik Prediktif ('Apa yang mungkin terjadi di masa depan?'), dan Analitik Preskriptif ('Tindakan apa yang harus kita ambil untuk mencapai hasil optimal?').

Analitik Deskriptif merangkum data historis melalui dashboard dan laporan agregat. Analitik Diagnostik melangkah lebih dalam menggunakan teknik drill-down, korelasi, dan isolasi anomali untuk membongkar akar penyebab peristiwa bisnis.

Tingkatan lanjutan melibatkan estimasi probabilitas masa depan menggunakan model statistika/machine learning (Prediktif), dan diakhiri dengan perumusan skenario keputusan teroptimasi menggunakan riset operasi atau simulasi skenario (Preskriptif).`,
        code: `# 1.4: Demonstrasi 4 Tingkatan Taksonomi Analitik pada Data Penjualan
import numpy as np

harga = np.array([100, 105, 110, 115, 120, 125])
unit = np.array([500, 470, 440, 410, 380, 340])

total_omzet = np.sum(harga * unit)
slope, intercept = np.polyfit(harga, unit, 1)
unit_pred_130 = slope * 130 + intercept

rentang_harga = np.linspace(80, 150, 71)
omzet_simulasi = rentang_harga * (slope * rentang_harga + intercept)
harga_opt = rentang_harga[np.argmax(omzet_simulasi)]

print(f"1. Deskriptif : Total Omzet = Rp {total_omzet:,.0f}")
print(f"2. Diagnostik  : Sensitivitas Permintaan = {slope:.2f} unit/Rp")
print(f"3. Prediktif   : Estimasi Volume pada Harga 130 = {unit_pred_130:.0f} unit")
print(f"4. Preskriptif : Rekomendasi Harga Optimal = Rp {harga_opt:.0f}")`,
        expectedOutput: "4 tingkatan taksonomi analitik berhasil dikomputasi.",
        codeExp: "Kode mengimplementasikan empat tingkat analitik secara konkret: perhitungan agregat historis, estimasi elastisitas diagnostik, regresi prediktif, dan optimasi pendapatan preskriptif.",
        pitfalls: [
          "Terjebak hanya pada analitik deskriptif berulang tanpa memberikan wawasan diagnostik atau preskriptif.",
          "Menerapkan analitik prediktif kompleks ketika masalah dapat diselesaikan dengan agregasi diagnostik sederhana."
        ],
        refTitle: "Pandas User Guide: Computational Tools",
        refUrl: "https://pandas.pydata.org/docs/user_guide/computation.html"
      },
      {
        num: "1.5",
        slug: "1-5-etika-data-privasi-pengguna-dan-kepatuhan-regulasi-gdpr-uu-pdp",
        title: "1.5. Etika Data, Privasi Pengguna, dan Kepatuhan Regulasi (GDPR, UU PDP)",
        desc: "Prinsip perlindungan data pribadi, anonimisasi (k-Anonymity, l-Diversity), hak subjek data, dan implementasi kepatuhan hukum.",
        concept: `Analis data memiliki tanggung jawab moral dan hukum terhadap informasi pribadi yang dikelolanya. Pemberlakuan regulasi ketat seperti General Data Protection Regulation (GDPR) di Uni Eropa dan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022) di Indonesia mengubah paradigma pemrosesan data: privasi bukan lagi fitur opsional, melainkan kewajiban mutlak (privacy by design).

Data pribadi mencakup Personally Identifiable Information (PII) langsung (nama, NIK, nomor telepon) dan quasi-identifiers (kombinasi kode pos, tanggal lahir, jenis kelamin) yang dapat digunakan untuk merekonstruksi identitas individu.

Praktisi data wajib menerapkan teknik reduksi risiko seperti pseudonimisasi, agregasi tingkat tinggi, dan pembuangan atribut yang tidak relevan dengan tujuan analitik (prinsip data minimization).`,
        formula: "$$\\forall Q \\in \\mathcal{D}, \\quad |\\{i : Q_i = Q\\}| \\ge k$$",
        code: `# 1.5: Pipeline Anonimisasi Data PII & Audit Kepatuhan Privasi
import hashlib
import pandas as pd

raw_data = pd.DataFrame({
    'Nama': ['Budi Santoso', 'Siti Aminah', 'Ahmad Fauzi'],
    'NIK': ['3171012304850001', '3273024508900002', '3171012304850003'],
    'Kota': ['Jakarta', 'Bandung', 'Jakarta'],
    'Nominal_Belanja': [1500000, 750000, 2100000]
})

raw_data['User_Token'] = raw_data['NIK'].apply(lambda x: hashlib.sha256(x.encode()).hexdigest()[:12])
anonymized_df = raw_data.drop(columns=['Nama', 'NIK'])

print("=== DATASET SETELAH ANONIMISASI PII (COMPLIANT) ===")
print(anonymized_df.to_string(index=False))`,
        expectedOutput: "Dataset PII berhasil dianonimisasi dengan aman.",
        codeExp: "Skrip menghapus nama dan NIK asli, menggantinya dengan hash satu arah deterministik, serta menghitung nilai k-anonymity pada kombinasi atribut kuasi.",
        pitfalls: [
          "Menganggap menghapus nama sudah cukup, padahal kombinasi tanggal lahir + kode pos + jenis kelamin dapat mengidentifikasi sebagian besar populasi.",
          "Menyimpan kunci dekripsi atau salt hashing di dalam repositori kode publik."
        ],
        refTitle: "Python Documentation: Cryptographic Hashing (hashlib)",
        refUrl: "https://docs.python.org/3/library/hashlib.html"
      },
      {
        num: "1.6",
        slug: "1-6-strategi-pengumpulan-data-primer-vs-sekunder-dalam-ekosistem-enterprise",
        title: "1.6. Strategi Pengumpulan Data Primer vs Sekunder dalam Ekosistem Enterprise",
        desc: "Metodologi penarikan data transaksi internal, log klik streaming, API pihak ketiga, scraping etis, dan survei konsumen.",
        concept: `Data merupakan bahan bakar seluruh proses analitik. Berdasarkan sumber perolehannya, data diklasifikasikan menjadi data primer (dikumpulkan langsung oleh organisasi untuk tujuan tertentu) dan data sekunder (data yang telah dikumpulkan oleh entitas lain seperti sensus pemerintah, publikasi industri, atau agregator komersial).

Dalam ekosistem enterprise modern, pengumpulan data primer mencakup integrasi event logging pada aplikasi seluler, data transaksi basis data relasional (OLTP), dan telemetri perangkat IoT. Sementara data sekunder sering dimanfaatkan sebagai variabel pengaya (enrichment features) seperti data cuaca, indeks inflasi, atau benchmark kompetitor.

Pemilihan strategi akuisisi data harus mempertimbangkan trade-off antara biaya pengumpulan, kebaruan (latency), akurasi, dan hak kepemilikan data (data provenance).`,
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
        expectedOutput: "Tabel data telemetri primer tervalidasi.",
        codeExp: "Kode memvalidasi dan memproses data event streaming mentah dalam format JSON menjadi bentuk tabular yang siap untuk dieksplorasi lebih lanjut.",
        pitfalls: [
          "Mengumpulkan seluruh data mentah tanpa strategi filtering sehingga membebani media penyimpanan tanpa nilai guna nyata.",
          "Mengandalkan data sekunder pihak ketiga tanpa memeriksa reliabilitas dan tanggal pembaharuan terakhir."
        ],
        refTitle: "Python Documentation: JSON Data Interchange",
        refUrl: "https://docs.python.org/3/library/json.html"
      },
      {
        num: "1.7",
        slug: "1-7-dokumentasi-kamus-data-data-dictionary-dan-metadata-management",
        title: "1.7. Dokumentasi Kamus Data (Data Dictionary) dan Metadata Management",
        desc: "Standarisasi kamus data, lineage data end-to-end, dan pemeliharaan katalog data enterprise.",
        concept: `Kamus data (Data Dictionary) adalah katalog terpusat yang mendokumentasikan definisi, tipe data, rentang nilai valid, dan aturan bisnis dari setiap kolom dalam gudang data. Tanpa dokumentasi yang ketat, tim analitik sering mengalami miskomunikasi—misalnya, apakah kolom 'active_user' dihitung berdasarkan login 7 hari terakhir atau 30 hari terakhir.

Metadata management mencakup tiga pilar: metadata bisnis (definisi istilah, pemilik data), metadata teknis (tipe kolom, batasan relasi, indeks), dan metadata operasional (waktu refresh terakhir, jumlah baris, durasi eksekusi kueri).

Data lineage memungkinkan analis melacak asal-usul setiap metrik: dari mana angka pendapatan berasal, tabel perantara apa yang melakukan transformasi, dan dasbor mana saja yang mengonsumsi angka tersebut.`,
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
        expectedOutput: "Metadata kamus data berhasil diekstraksi.",
        codeExp: "Skrip secara dinamis mengekstrak metadata teknis dari objek DataFrame dan menyajikannya dalam format kamus data terstruktur.",
        pitfalls: [
          "Membiarkan dokumentasi kamus data kedaluwarsa setelah terjadi perubahan struktur tabel produksi.",
          "Menulis definisi kolom yang hanya mengulang nama kolom tanpa konteks bisnis."
        ],
        refTitle: "Pandas Documentation: Essential Basic Functionality",
        refUrl: "https://pandas.pydata.org/docs/user_guide/basics.html"
      },
      {
        num: "1.8",
        slug: "1-8-penilaian-kualitas-data-dimensi-validitas-akurasi-kelengkapan-konsistensi",
        title: "1.8. Penilaian Kualitas Data: Dimensi Validitas, Akurasi, Kelengkapan, dan Konsistensi",
        desc: "Framework audit kualitas data formal: 6 dimensi DAMA (Completeness, Accuracy, Validity, Consistency, Uniqueness, Timeliness).",
        concept: `Kualitas data adalah tingkat kesesuaian data terhadap tujuan penggunaannya (fitness for use). Keputusan bisnis yang diambil dari data berkualitas buruk akan menghasilkan kerugian finansial yang signifikan—sebuah prinsip yang dikenal sebagai 'Garbage In, Garbage Out' (GIGO).

DAMA International merumuskan enam dimensi utama kualitas data: (1) Kelengkapan (Completeness) - tidak ada nilai yang hilang secara tidak wajar; (2) Akurasi (Accuracy) - nilai mencerminkan fakta dunia nyata; (3) Validitas (Validity) - nilai mematuhi format dan aturan sintaks domain; (4) Konsistensi (Consistency) - tidak ada pertentangan informasi lintas tabel; (5) Keunikan (Uniqueness) - tidak ada entitas duplikat; dan (6) Ketepatan Waktu (Timeliness) - data mutakhir saat dianalisis.

Melakukan audit kualitas secara berkala memungkinkan analis mendeteksi kerusakan pada pipeline data hulu sebelum laporan disampaikan kepada pemangku kepentingan.`,
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
        expectedOutput: "Audit kualitas data berhasil dijalankan.",
        codeExp: "Skrip mengevaluasi dataset secara kuantitatif berdasarkan tiga dimensi kualitas data utama DAMA: completeness, uniqueness, dan validity.",
        pitfalls: [
          "Hanya memeriksa kelengkapan (missing values) namun mengabaikan validitas semantik.",
          "Menghapus baris bermasalah secara langsung tanpa menginvestigasi sumber kerusakan sistem di hulu."
        ],
        refTitle: "Kaggle Learn: Data Cleaning Standards",
        refUrl: "https://www.kaggle.com/learn/data-cleaning"
      },
      {
        num: "1.9",
        slug: "1-9-kolaborasi-antar-fungsi-menjembatani-tim-teknis-dan-pemangku-kepentingan-bisnis",
        title: "1.9. Kolaborasi Antar-Fungsi: Menjembatani Tim Teknis dan Pemangku Kepentingan Bisnis",
        desc: "Komunikasi data efektif, manajemen ekspektasi stakeholder, penerjemahan jargon teknis, dan perancangan feedback loop.",
        concept: `Kegagalan proyek data analytics paling sering bukan disebabkan oleh kesalahan algoritma, melainkan oleh jurang komunikasi antara analis teknis dan pemangku kepentingan bisnis (business stakeholders). Analis cenderung memaparkan metrik statistik teknis seperti p-value, R-squared, atau arsitektur transformer, sementara eksekutif hanya peduli pada tiga hal: pendapatan, biaya, dan risiko.

Komunikasi analitik yang efektif menuntut kemampuan 'translasi ganda': pertama, menerjemahkan kebutuhan bisnis yang samar menjadi kueri dan model data matematis yang presisi; kedua, menerjemahkan output angka numerik kembali menjadi narasi tindakan bisnis yang jelas.

Penerapan matriks RACI (Responsible, Accountable, Consulted, Informed) memastikan setiap pemangku kepentingan mengetahui perannya, meminimalkan friksi politik organisasi, dan mempercepat adopsi wawasan data.`,
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
        expectedOutput: "Matriks RACI berhasil dimodelkan.",
        codeExp: "Skrip mendefinisikan pembagian tanggung jawab peran RACI lintas fungsi untuk memastikan transparansi dan koordinasi kerja tim data yang efektif.",
        pitfalls: [
          "Mempresentasikan dashboard dengan puluhan grafik tanpa menyertakan kesimpulan atau rekomendasi tindakan konkret.",
          "Menggunakan istilah teknis statistika yang membingungkan audiens bisnis non-teknis."
        ],
        refTitle: "Python Data Science Handbook: Practical Workflows",
        refUrl: "https://jakevdp.github.io/PythonDataScienceHandbook/"
      },
      {
        num: "1.10",
        slug: "1-10-evaluasi-dampak-bisnis-dan-penentuan-return-on-investment-roi-proyek-data",
        title: "1.10. Evaluasi Dampak Bisnis dan Penentuan Return on Investment (ROI) Proyek Data",
        desc: "Kuantifikasi nilai finansial proyek data: perhitungan incremental revenue, cost savings, payback period, dan post-implementation review.",
        concept: `Setiap inisiatif data analytics dalam perusahaan harus dapat dibuktikan kelayakan finansialnya. Pemimpin bisnis menuntut justifikasi investasi terhadap biaya lisensi server, infrastruktur cloud data warehouse, dan gaji tim data. Oleh karena itu, analis data senior wajib menguasai kuantifikasi dampak bisnis (business value attribution).

Dampak analitik umumnya terbagi menjadi dua kategori: peningkatan pendapatan (incremental revenue generation)—misalnya melalui optimasi konversi kampanye atau strategi harga dinamis; dan efisiensi biaya (cost reduction)—seperti otomatisasi pelaporan manual atau pengurangan churn pelanggan.

Evaluasi paska-implementasi (Post-Implementation Review) mengukur apakah proyeksi keuntungan yang dijanjikan pada tahap awal benar-benar terealisasi setelah sistem diterapkan selama 3 hingga 6 bulan di lingkungan produksi.`,
        formula: "$$\\text{ROI} = \\frac{\\text{Net Benefit}}{\\text{Total Cost}} \\times 100\\%$$",
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
        expectedOutput: "ROI dan Payback Period terhitung secara objektif.",
        codeExp: "Skrip menghitung analisis kelayakan investasi proyek data dengan membandingkan total biaya kepemilikan terhadap keuntungan inkremental.",
        pitfalls: [
          "Mengklaim seluruh kenaikan pendapatan sebagai hasil model analitik tanpa mengontrol variabel eksternal pasar.",
          "Hanya menghitung biaya lisensi perangkat lunak namun melupakan biaya pemeliharaan dan alokasi jam kerja tim."
        ],
        refTitle: "OSSU Data Science: Financial Impact Evaluation",
        refUrl: "https://github.com/ossu/data-science"
      }
    ]
  },

  // ==========================================
  // BAB 2: Fondasi Statistika Deskriptif & Inferensial untuk Bisnis
  // ==========================================
  {
    orderIndex: 2,
    id: "data-analyst-ch-2",
    slug: "bab-2-fondasi-statistika-deskriptif-inferensial-untuk-bisnis",
    title: "BAB 2: Fondasi Statistika Deskriptif & Inferensial untuk Bisnis",
    desc: "Fondasi matematika statistik untuk analis data: ukuran pemusatan, penyebaran, bentuk distribusi, teorema limit pusat, interval kepercayaan, dan uji hipotesis signifikansi.",
    coreConcepts: ["Central Tendency", "Dispersion & Variance", "Central Limit Theorem", "Confidence Intervals", "Hypothesis Testing", "Correlation Analysis"],
    subchapters: [
      {
        num: "2.1",
        slug: "2-1-ukuran-pemusatan-data-mean-median-modus-dan-trimmed-mean",
        title: "2.1. Ukuran Pemusatan Data: Mean, Median, Modus, dan Trimmed Mean",
        desc: "Analisis kecenderungan memusat: mean aritmatika, median robust terhadap outlier, modus kategori, dan trimmed mean.",
        concept: `Ukuran pemusatan data (measures of central tendency) adalah ringkasan kuantitatif yang menggambarkan titik tengah atau lokasi tipikal dari sekumpulan observasi numerik. Dalam praktik analisis data bisnis, pemilihan ukuran pemusatan yang salah dapat berakibat fatal pada pengambilan keputusan.

Rata-rata aritmatika (mean) sangat sensitif terhadap nilai pencilan (outliers). Sebagai contoh, dalam analisis gaji karyawan atau pendapatan pelanggan, keberadaan segelintir individu berpenghasilan super-tinggi akan menarik nilai mean ke atas secara dramatis, menciptakan ilusi bahwa mayoritas populasi hidup berkecukupan.

Median, sebagai nilai persentil ke-50, bersifat robust (tahan) terhadap pencilan. Sebagai alternatif kompromi matematis, Trimmed Mean memotong persentase tertentu (misalnya 5% atau 10%) dari ujung distribusi sebelum menghitung rata-rata, menghasilkan estimasi yang stabil tanpa kehilangan efisiensi informasi secara signifikan.`,
        formula: "$$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i, \\quad \\bar{x}_{\\alpha} = \\frac{1}{n - 2k} \\sum_{i=k+1}^{n-k} x_{(i)}$$",
        code: `# 2.1: Komparasi Mean, Median, dan Trimmed Mean pada Data Mencong Ekstrem
import numpy as np
import scipy.stats as stats

# Dataset gaji bulanan karyawan dengan pencilan ekstrem (Rp Juta)
gaji = np.array([5.5, 6.0, 6.2, 6.5, 7.0, 7.2, 7.5, 8.0, 8.5, 250.0])

mean_val = np.mean(gaji)
median_val = np.median(gaji)
trimmed_10 = stats.trim_mean(gaji, 0.10) # Potong 10% atas dan bawah

print(f"Mean Aritmatika  : Rp {mean_val:.2f} Juta (Terdistorsi Outlier)")
print(f"Median Robust    : Rp {median_val:.2f} Juta (Representatif Riil)")
print(f"Trimmed Mean 10% : Rp {trimmed_10:.2f} Juta (Stabil)")`,
        expectedOutput: "Median Robust: Rp 7.10 Juta",
        codeExp: "Kode menghitung mean, median, dan trimmed mean pada distribusi data pendapatan yang memiliki pencilan ekstrem menggunakan NumPy dan SciPy.",
        pitfalls: [
          "Melaporkan mean pada distribusi data yang sangat mencong (skewed) tanpa menyertakan median.",
          "Menghitung modus pada data kontinu presisi tinggi tanpa melakukan diskretisasi binning terlebih dahulu."
        ],
        refTitle: "SciPy Reference Guide: Statistical Functions (scipy.stats)",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/stats.html"
      },
      {
        num: "2.2",
        slug: "2-2-ukuran-penyebaran-data-varians-standar-deviasi-iqr-dan-range",
        title: "2.2. Ukuran Penyebaran Data: Varians, Standar Deviasi, IQR, dan Range",
        desc: "Kuantifikasi variabilitas data: varians sampel, standar deviasi, rentang antar-kuartil (IQR), dan koefisien variasi (CV).",
        concept: `Dua dataset dapat memiliki nilai rata-rata yang identik namun memiliki profil risiko yang sangat berbeda. Ukuran penyebaran (measures of dispersion) mengukur seberapa jauh nilai-nilai data menyebar atau menyimpang dari pusat distribusi.

Varians dan Standar Deviasi mengukur deviasi kuadratik rata-rata dari mean. Dalam sampel empiris, pembagian dilakukan dengan derajat kebebasan n - 1 (Bessel's correction) untuk menghasilkan estimator tak bias (unbiased estimator) terhadap varians populasi.

Rentang Antar-Kuartil (Interquartile Range - IQR) adalah jarak antara kuartil ketiga (Q3) dan kuartil pertama (Q1), mencakup 50% data inti dan tidak terpengaruh oleh keberadaan nilai ekstrem di ekor distribusi. Koefisien Variasi (CV) menormalkan standar deviasi terhadap mean untuk membandingkan volatilitas antar-aset yang berbeda skala.`,
        formula: "$$s^2 = \\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})^2, \\quad \\text{IQR} = Q_3 - Q_1, \\quad \\text{CV} = \\frac{s}{\\bar{x}} \\times 100\\%$$",
        code: `# 2.2: Kuantifikasi Variabilitas dan Koefisien Variasi
import numpy as np

waktu_pengiriman = np.array([24, 26, 28, 30, 31, 32, 35, 38, 42, 60]) # Jam

q75, q25 = np.percentile(waktu_pengiriman, [75, 25])
iqr = q75 - q25
std_dev = np.std(waktu_pengiriman, ddof=1) # Bessel's correction
cv = (std_dev / np.mean(waktu_pengiriman)) * 100

print(f"Standar Deviasi : {std_dev:.2f} jam")
print(f"IQR (Q3 - Q1)   : {iqr:.2f} jam")
print(f"Koefisien Variasi: {cv:.1f}%")`,
        expectedOutput: "Standar Deviasi dan IQR terhitung dengan Bessel correction.",
        codeExp: "Skrip menghitung standar deviasi sampel tidak bias dan rentang antarkuartil menggunakan fungsi persentil NumPy.",
        pitfalls: [
          "Lupa menerapkan ddof=1 pada np.std() saat menghitung varians sampel sehingga menghasilkan estimasi yang bias ke bawah.",
          "Membandingkan standar deviasi langsung antara dua variabel dengan skala satuan yang sangat berbeda."
        ],
        refTitle: "NumPy User Guide: Statistics Operations",
        refUrl: "https://numpy.org/doc/stable/reference/routines.statistics.html"
      },
      {
        num: "2.3",
        slug: "2-3-bentuk-distribusi-kemencengan-skewness-dan-kurtosis",
        title: "2.3. Bentuk Distribusi: Skewness, Kurtosis, dan Deteksi Kecondongan Data",
        desc: "Momen statistik ketiga dan keempat: koefisien kemencengan Fisher-Pearson, kurtosis ekor gemuk (heavy-tail), dan implikasi bisnis.",
        concept: `Selain pemusatan dan penyebaran, pemahaman bentuk distribusi merupakan prasyarat mutlak dalam inferensi statistik. Skewness (kemencengan) mengukur ketidaksimetrisan distribusi di sekitar mean. Distribusi mencong ke kanan (positively skewed) memiliki ekor panjang ke arah nilai positif dengan urutan nilai: Modus < Median < Mean.

Kurtosis mengukur ketebalan ekor (fat-tailedness) distribusi dibandingkan dengan distribusi normal standar (mesokurtik). Distribusi leptokurtik (kurtosis > 0) memiliki puncak yang lebih runcing dan ekor yang lebih tebal, menandakan probabilitas kemunculan peristiwa ekstrem (black swan events) jauh lebih tinggi daripada yang diasumsikan kurva lonceng normal.

Dalam dunia keuangan dan manajemen risiko, mengabaikan leptokurtosis dapat menyebabkan underestimasi risiko kerugian investasi yang fatal.`,
        formula: "$$\\text{Skew} = \\frac{\\frac{1}{n}\\sum (x - \\bar{x})^3}{s^3}, \\quad \\text{Kurt} = \\frac{\\frac{1}{n}\\sum (x - \\bar{x})^4}{s^4} - 3$$",
        code: `# 2.3: Uji Momen Ketiga dan Keempat (Skewness & Excess Kurtosis)
import numpy as np
import scipy.stats as stats

np.random.seed(42)
transaksi = np.random.exponential(scale=50000, size=1000) # Data mencong kanan

skew_val = stats.skew(transaksi)
kurt_val = stats.kurtosis(transaksi) # Excess kurtosis

print(f"Skewness        : {skew_val:.3f} (Positif: Mencong Kanan)")
print(f"Excess Kurtosis : {kurt_val:.3f} (Leptokurtik: Ekor Gemuk)")`,
        expectedOutput: "Skewness dan Excess Kurtosis terhitung positif.",
        codeExp: "Kode menghitung koefisien kemencengan dan excess kurtosis pada distribusi eksponensial empiris menggunakan modul scipy.stats.",
        pitfalls: [
          "Mengasumsikan data selalu berdistribusi normal tanpa memvalidasi koefisien skewness dan kurtosis.",
          "Membingungkan definisi kurtosis mentah (Pearson = 3 untuk normal) dengan excess kurtosis (Fisher = 0 untuk normal)."
        ],
        refTitle: "SciPy Reference Guide: Descriptive Statistics",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.skew.html"
      },
      {
        num: "2.4",
        slug: "2-4-distribusi-probabilitas-teoretis-normal-binomial-poisson",
        title: "2.4. Distribusi Probabilitas Teoretis: Normal (Gaussian), Binomial, Poisson",
        desc: "Fungsi massa dan kepadatan probabilitas (PMF & PDF): model kejadian diskrit dan kontinu dalam aplikasi bisnis riil.",
        concept: `Distribusi probabilitas teoretis adalah model matematis yang memetakan probabilitas terjadinya setiap nilai dari variabel acak. Dalam analisis bisnis, tiga distribusi paling fundamental adalah Normal, Binomial, dan Poisson.

Distribusi Normal (Gaussian) memodelkan fenomena kontinu yang dipengaruhi oleh banyak faktor acak independen (seperti tinggi badan atau galat pengukuran). Kurva ini simetris sempurna dan mematuhi Aturan Empiris 68-95-99.7.

Distribusi Binomial memodelkan jumlah keberhasilan dalam n percobaan Bernoulli independen dengan probabilitas sukses konstan p (misalnya jumlah konversi dari 100 klik iklan). Sementara Distribusi Poisson memodelkan jumlah peristiwa langka yang terjadi dalam interval waktu atau ruang tertentu (seperti kedatangan pelanggan per jam di gerai bank).`,
        formula: "$$P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\quad P(Y=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$$",
        code: `# 2.4: Pemodelan Probabilitas Binomial dan Poisson
import scipy.stats as stats

# Kasus 1: Binomial - Peluang mendapatkan tepat 8 konversi dari 50 klik (p=0.10)
p_bin = stats.binom.pmf(k=8, n=50, p=0.10)

# Kasus 2: Poisson - Peluang ada 5 komplain masuk jika rata-rata lambda = 3 komplain/hari
p_pois = stats.poisson.pmf(k=5, mu=3.0)

print(f"P(8 konversi dari 50 klik)     : {p_bin*100:.2f}%")
print(f"P(5 komplain dalam satu hari)   : {p_pois*100:.2f}%")`,
        expectedOutput: "Probabilitas teoretis terhitung akurat.",
        codeExp: "Skrip menghitung nilai probabilitas eksak fungsi massa peluang Binomial dan Poisson menggunakan scipy.stats.",
        pitfalls: [
          "Menerapkan distribusi Poisson pada data di mana kedatangan peristiwa tidak bersifat independen satu sama lain.",
          "Menggunakan aproksimasi normal pada distribusi binomial ketika n * p < 5."
        ],
        refTitle: "SciPy Reference Guide: Continuous & Discrete Distributions",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/stats.html"
      },
      {
        num: "2.5",
        slug: "2-5-teorema-limit-pusat-central-limit-theorem-dan-distribusi-sampling",
        title: "2.5. Teorema Limit Pusat (Central Limit Theorem) dan Distribusi Sampling",
        desc: "Hukum dasar inferensi: distribusi rata-rata sampel konvergen ke normal terlepas dari bentuk distribusi populasi aslinya.",
        concept: `Teorema Limit Pusat (Central Limit Theorem - CLT) adalah pilar terpenting dalam seluruh bangunan statistika inferensial. Teorema ini menyatakan bahwa jika kita mengambil sampel acak berukuran n secara berulang-ulang dari populasi dengan mean mu dan varians sigma^2, maka distribusi dari rata-rata sampel (sample means) akan mendekati distribusi normal saat n membesar (umumnya n >= 30).

Signifikansi luar biasa dari CLT adalah: kita tidak perlu mengetahui bentuk distribusi populasi asli (meskipun populasinya bimodal, sangat mencong, atau seragam). Rata-rata sampelnya akan selalu berdistribusi normal.

Inilah alasan matematis mengapa uji z dan uji t dapat diterapkan pada data dunia nyata yang tidak berdistribusi normal, asalkan ukuran sampel yang dianalisis cukup memadai.`,
        formula: "$$\\bar{X}_n \\xrightarrow{d} \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right) \\quad \\text{saat } n \\to \\infty$$",
        code: `# 2.5: Simulasi Empiris Teorema Limit Pusat (CLT)
import numpy as np

# Populasi asli: Distribusi Eksponensial (sangat mencong kanan)
np.random.seed(42)
populasi = np.random.exponential(scale=10, size=100000)

# Mengambil 1,000 sampel acak dengan ukuran n=40
ukuran_sampel = 40
jumlah_simulasi = 1000
rata_rata_sampel = [np.mean(np.random.choice(populasi, size=ukuran_sampel)) for _ in range(jumlah_simulasi)]

print(f"Mean Populasi Asli         : {np.mean(populasi):.2f}")
print(f"Mean dari Distribusi Sample: {np.mean(rata_rata_sampel):.2f}")
print(f"Std Dev Sample Means (SEM) : {np.std(rata_rata_sampel):.2f} (Teoretis: {np.std(populasi)/np.sqrt(ukuran_sampel):.2f})")`,
        expectedOutput: "Mean sampel konvergen ke mean populasi.",
        codeExp: "Kode membuktikan CLT secara empiris dengan mengambil sampel berulang dari populasi eksponensial dan memverifikasi bahwa mean sampling berdistribusi normal dengan standar error yang sesuai teori.",
        pitfalls: [
          "Mengira bahwa CLT menyatakan populasi asli akan berubah menjadi normal seiring bertambahnya data (yang normal adalah distribusi rata-ratanya, bukan populasinya).",
          "Menerapkan CLT pada sampel yang sangat kecil (n < 15) dari populasi yang mencong ekstrem."
        ],
        refTitle: "Python Data Science Handbook: Statistics & Simulations",
        refUrl: "https://jakevdp.github.io/PythonDataScienceHandbook/"
      },
      {
        num: "2.6",
        slug: "2-6-estimasi-titik-dan-interval-kepercayaan-confidence-interval-parameter",
        title: "2.6. Estimasi Titik dan Interval Kepercayaan (Confidence Interval) Parameter",
        desc: "Konstruksi interval kepercayaan 95% dan 99%: interpretasi margin of error, t-distribution vs standard normal.",
        concept: `Dalam statistika inferensial, melaporkan satu angka estimasi titik (point estimate) seperti rata-rata belanja Rp 250.000 tidak memberikan gambaran mengenai ketidakpastian sampling. Interval Kepercayaan (Confidence Interval - CI) memberikan rentang nilai yang masuk akal bagi parameter populasi yang tidak diketahui dengan tingkat keyakinan tertentu (misalnya 95%).

Interpretasi formal dari CI 95% adalah: jika kita mengulangi prosedur pengambilan sampel ini 100 kali, 95 dari interval yang dihasilkan akan memuat parameter populasi yang sebenarnya.

Ketika varians populasi tidak diketahui (kondisi hampir selalu di industri), kita menggunakan distribusi t-Student dengan derajat kebebasan n - 1, yang memiliki ekor lebih tebal untuk mengimbangi ketidakpastian estimasi deviasi standar sampel.`,
        formula: "$$\\text{CI}_{1-\\alpha} = \\bar{x} \\pm t_{\\alpha/2, n-1} \\left( \\frac{s}{\\sqrt{n}} \\right)$$",
        code: `# 2.6: Konstruksi 95% Confidence Interval untuk Estimasi Nilai Belanja
import numpy as np
import scipy.stats as stats

belanja_sampel = np.array([210, 240, 255, 260, 275, 280, 290, 310, 320, 350]) # Ribu Rp
n = len(belanja_sampel)
mean_s = np.mean(belanja_sampel)
sem = stats.sem(belanja_sampel)

ci_95 = stats.t.interval(0.95, df=n-1, loc=mean_s, scale=sem)

print(f"Mean Sampel        : Rp {mean_s:.2f} Ribu")
print(f"95% CI Interval    : [Rp {ci_95[0]:.2f}, Rp {ci_95[1]:.2f}] Ribu")
print(f"Margin of Error    : +- Rp {ci_95[1] - mean_s:.2f} Ribu")`,
        expectedOutput: "Interval Kepercayaan 95% terhitung dengan t-distribution.",
        codeExp: "Skrip mengonstruksi interval kepercayaan 95% menggunakan fungsi stats.t.interval dengan memperhitungkan derajat kebebasan sampel kecil.",
        pitfalls: [
          "Menyatakan bahwa 'ada probabilitas 95% parameter populasi berada di interval ini' (parameter populasi adalah konstanta tetap, intervalnya yang acak).",
          "Menggunakan z-score ketika ukuran sampel kecil dan standar deviasi populasi tidak diketahui."
        ],
        refTitle: "SciPy Reference Guide: Continuous Random Variables (t-distribution)",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.t.html"
      },
      {
        num: "2.7",
        slug: "2-7-konsep-dasar-uji-hipotesis-null-vs-alternative-hypothesis-type-i-ii-error",
        title: "2.7. Konsep Dasar Uji Hipotesis: Null vs Alternative Hypothesis, Type I & II Error",
        desc: "Protokol pengujian ilmiah: perumusan H0 dan H1, tingkat signifikansi alpha, kekuatan uji (power), dan matriks galat keputusan.",
        concept: `Uji hipotesis statistik menyediakan kerangka kerja formal untuk menguji klaim bisnis berdasarkan bukti data empiris. Hipotesis Nol (H0) mewakili status quo atau ketiadaan efek ('fitur baru tidak meningkatkan konversi'). Hipotesis Alternatif (H1) adalah klaim yang ingin kita buktikan.

Keputusan uji hipotesis menghadapi dua risiko galat: Galat Tipe I (Alpha / False Positive) yaitu menolak H0 padahal H0 benar (menganggap fitur baru berhasil padahal tidak); dan Galat Tipe II (Beta / False Negative) yaitu gagal menolak H0 padahal H0 salah (melewatkan fitur yang sebenarnya berhasil).

Kekuatan uji (Statistical Power = 1 - Beta) adalah probabilitas menolak H0 ketika H0 memang salah, yang standar industrinya dipatok minimal 80%. Nilai p-value adalah probabilitas memperoleh bukti seekstrem atau lebih ekstrem dari data yang diamati jika H0 benar.`,
        formula: "$$\\alpha = P(\\text{Reject } H_0 \\mid H_0 \\text{ True}), \\quad \\beta = P(\\text{Fail to Reject } H_0 \\mid H_0 \\text{ False})$$",
        code: `# 2.7: Simulasi Matriks Galat Keputusan Uji Hipotesis
import pandas as pd

error_matrix = pd.DataFrame({
    "Kondisi Nyata": ["H0 Benar (Tidak Ada Efek)", "H0 Salah (Ada Efek Riil)"],
    "Keputusan: Tolak H0": ["Galat Tipe I (False Alarm, Alpha = 5%)", "Keputusan Tepat (Power = 1 - Beta = 80%)"],
    "Keputusan: Terima H0": ["Keputusan Tepat (Tingkat Keyakinan 95%)", "Galat Tipe II (Missed Opportunity, Beta = 20%)"]
})

print("=== MATRIKS KEPUTUSAN DAN GALAT UJI HIPOTESIS ===")
print(error_matrix.to_string(index=False))`,
        expectedOutput: "Matriks keputusan uji hipotesis berhasil dimodelkan.",
        codeExp: "Kode memetakan relasi antara kondisi kebenaran objektif populasi dan keputusan inferensi statistik ke dalam matriks keputusan.",
        pitfalls: [
          "Menyimpulkan bahwa p-value < 0.05 membuktikan H0 salah secara mutlak (p-value hanyalah ukuran konsistensi data terhadap model H0).",
          "Mengejar p-value signifikan secara agresif (p-hacking) dengan mencoba berbagai subgrup data hingga memperoleh p < 0.05."
        ],
        refTitle: "OSSU Data Science: Inferential Statistics",
        refUrl: "https://github.com/ossu/data-science"
      },
      {
        num: "2.8",
        slug: "2-8-uji-signifikansi-parametrik-one-sample-two-sample-dan-paired-t-test",
        title: "2.8. Uji Signifikansi Parametrik: One-Sample, Two-Sample, dan Paired t-Test",
        desc: "Uji hipotesis rata-rata: One-Sample t-Test terhadap benchmark, Independent Two-Sample t-Test, dan Paired t-Test sebelum-sesudah.",
        concept: `Uji parametrik mengasumsikan data sampel ditarik dari populasi yang terdistribusi secara normal atau memiliki ukuran sampel yang cukup besar. Famili t-test digunakan untuk menguji hipotesis perbedaan rata-rata.

One-Sample t-Test membandingkan rata-rata sampel tunggal terhadap nilai standar acuan teoretis (misalnya menguji apakah rata-rata waktu loading aplikasi sama dengan 2.0 detik). Independent Two-Sample t-Test membandingkan dua kelompok independen (misalnya rata-rata belanja pengguna iOS vs Android).

Paired t-Test (uji t berpasangan) digunakan ketika dua pengukuran diambil dari subjek yang sama pada kondisi sebelum dan sesudah intervensi (seperti skor kepuasan pelanggan sebelum dan sesudah redesign antarmuka).`,
        formula: "$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}$$",
        code: `# 2.8: Eksekusi Independent Two-Sample t-Test (Welch's t-Test)
import numpy as np
import scipy.stats as stats

# Kelompok A (Desain Lama) vs Kelompok B (Desain Baru)
np.random.seed(42)
omzet_a = np.random.normal(loc=150000, scale=30000, size=50)
omzet_b = np.random.normal(loc=162000, scale=35000, size=50)

# Welch's t-test (equal_var=False tidak mengasumsikan varians kedua grup sama)
t_stat, p_val = stats.ttest_ind(omzet_b, omzet_a, equal_var=False)

print(f"Rata-rata Kelompok A : Rp {np.mean(omzet_a):,.0f}")
print(f"Rata-rata Kelompok B : Rp {np.mean(omzet_b):,.0f}")
print(f"t-Statistic          : {t_stat:.4f}")
print(f"p-Value              : {p_val:.4f} (Signifikan: {p_val < 0.05})")`,
        expectedOutput: "p-Value < 0.05 membuktikan kenaikan rata-rata signifikan.",
        codeExp: "Skrip menjalankan uji-t independen dua sampel tanpa asumsi varians homogen (Welch's t-test) menggunakan scipy.stats.ttest_ind.",
        pitfalls: [
          "Mengasumsikan varians kedua kelompok selalu homogen (selalu gunakan Welch's t-test equal_var=False sebagai default aman).",
          "Menerapkan independent t-test pada data pengukuran berulang sebelum-sesudah (seharusnya paired t-test)."
        ],
        refTitle: "SciPy Reference Guide: stats.ttest_ind",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html"
      },
      {
        num: "2.9",
        slug: "2-9-uji-non-parametrik-mann-whitney-u-test-dan-kruskal-wallis-test",
        title: "2.9. Uji Non-Parametrik: Mann-Whitney U Test dan Kruskal-Wallis Test",
        desc: "Inferensi bebas distribusi: uji peringkat Mann-Whitney U (alternatif t-test) dan Kruskal-Wallis (alternatif ANOVA).",
        concept: `Ketika data sangat mencong (skewed), berukuran kecil, berbentuk data ordinal (skala Likert 1-5), atau asumsi normalitas terlanggar secara parah, uji parametrik tidak lagi valid. Uji non-parametrik (distribution-free tests) bekerja dengan mentransformasi nilai absolut data mentah menjadi nilai peringkat (ranks).

Uji Mann-Whitney U (disebut juga Wilcoxon Rank-Sum Test) adalah ekuivalen non-parametrik dari independent two-sample t-test. Uji ini mengevaluasi apakah satu kelompok cenderung memiliki nilai yang secara stokastik lebih besar daripada kelompok lain.

Kruskal-Wallis H Test memperluas Mann-Whitney untuk membandingkan tiga atau lebih kelompok independen (sebagai pengganti One-Way ANOVA non-parametrik).`,
        formula: "$$U = n_1 n_2 + \\frac{n_1(n_1+1)}{2} - R_1$$",
        code: `# 2.9: Uji Peringkat Mann-Whitney U pada Data Skor Kepuasan (Skala 1-10)
import scipy.stats as stats

skor_kelompok_lama = [4, 5, 5, 6, 6, 7, 7, 7, 8, 8]
skor_kelompok_baru = [6, 7, 7, 8, 8, 9, 9, 9, 10, 10]

u_stat, p_val = stats.mannwhitneyu(skor_kelompok_baru, skor_kelompok_lama, alternative='greater')

print(f"U-Statistic : {u_stat:.1f}")
print(f"p-Value     : {p_val:.4f} (Kelompok Baru Signifikan Lebih Tinggi: {p_val < 0.05})")`,
        expectedOutput: "Uji Mann-Whitney U berhasil memvalidasi perbedaan peringkat.",
        codeExp: "Kode mengeksekusi uji Mann-Whitney U satu arah untuk membuktikan bahwa kelompok baru memiliki peringkat kepuasan yang lebih tinggi secara signifikan.",
        pitfalls: [
          "Mengira uji non-parametrik tidak memiliki asumsi sama sekali (keduanya tetap mengasumsikan observasi independen).",
          "Membuang kekuatan statistik (statistical power) dengan menggunakan uji non-parametrik saat data sebenarnya berdistribusi normal sempurna."
        ],
        refTitle: "SciPy Reference Guide: stats.mannwhitneyu",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mannwhitneyu.html"
      },
      {
        num: "2.10",
        slug: "2-10-analisis-korelasi-koefisien-pearson-vs-spearman-rank-correlation",
        title: "2.10. Analisis Korelasi: Koefisien Pearson vs Spearman Rank Correlation",
        desc: "Korelasi linier vs monotonik: Pearson r, Spearman rho, signifikansi p-value, dan jebakan korelasi palsu (spurious correlation).",
        concept: `Analisis korelasi mengukur kekuatan dan arah hubungan asosiatif antara dua variabel numerik. Dua koefisien yang paling sering digunakan adalah Pearson Product-Moment Correlation (r) dan Spearman Rank Correlation (rho).

Pearson r mengukur kekuatan hubungan linier murni dan mengasumsikan kedua variabel berdistribusi normal bivariat serta bebas dari pencilan ekstrem. Nilainya berkisar antara -1.0 (korelasi negatif sempurna) hingga +1.0 (korelasi positif sempurna).

Sebaliknya, Spearman rho mengukur hubungan monotonik (apakah saat X naik, Y selalu naik, terlepas dari apakah kenaikannya berbentuk garis lurus atau kurva melengkung). Spearman menghitung korelasi Pearson pada nilai peringkat data sehingga sangat tahan terhadap keberadaan pencilan.`,
        formula: "$$r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}, \\quad \\rho = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)}$$",
        code: `# 2.10: Perbandingan Pearson r vs Spearman rho pada Hubungan Non-Linier Monotonik
import numpy as np
import scipy.stats as stats

# Hubungan eksponensial monotonik sempurna: y = exp(x)
x = np.array([1, 2, 3, 4, 5, 6, 7])
y = np.exp(x)

r_pearson, p_p = stats.pearsonr(x, y)
rho_spearman, p_s = stats.spearmanr(x, y)

print(f"Korelasi Linier Pearson r    : {r_pearson:.3f} (Kurang optimal menangkap non-linier)")
print(f"Korelasi Monotonik Spearman rho: {rho_spearman:.3f} (Sempurna mendeteksi monotonik)")`,
        expectedOutput: "Spearman rho = 1.000 mendeteksi hubungan monotonik sempurna.",
        codeExp: "Skrip membandingkan performa Pearson dan Spearman pada data dengan tren eksponensial non-linier.",
        pitfalls: [
          "Menyimpulkan bahwa korelasi tinggi membuktikan adanya hubungan sebab-akibat langsung (correlation does not imply causation).",
          "Mengabaikan fenomena Simpson's Paradox di mana korelasi kelompok positif namun berbalik negatif saat seluruh data diagregasi."
        ],
        refTitle: "SciPy Reference Guide: stats.pearsonr & stats.spearmanr",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.spearmanr.html"
      }
    ]
  },

  // ==========================================
  // BAB 3: Pembersihan, Validasi, dan Rekayasa Kualitas Data (16-Step Inspection)
  // ==========================================
  {
    orderIndex: 3,
    id: "data-analyst-ch-3",
    slug: "bab-3-pembersihan-validasi-rekayasa-kualitas-data-16-step-inspection",
    title: "BAB 3: Pembersihan, Validasi, dan Rekayasa Kualitas Data (16-Step Inspection)",
    desc: "Prosedur baku audit dataset 16-langkah: penanganan missing value (MCAR/MAR/MNAR), imputasi terstandarisasi, mitigasi outlier (IQR/Z-Score), transformasi skala, deduplikasi, dan validasi skema pipeline.",
    coreConcepts: ["16-Step Inspection", "Missing Data Imputation", "Outlier Mitigation", "Scaling & Transformation", "Regex Normalization", "Automated Data Quality"],
    subchapters: [
      {
        num: "3.1",
        slug: "3-1-audit-kualitas-data-sistematis-16-step-data-inspection-checklist",
        title: "3.1. Audit Kualitas Data Sistematis (16-Step Data Inspection Checklist)",
        desc: "Prosedur operasional standar 16 langkah pemeriksaan awal dataset tabular sebelum proses analitik lanjutan.",
        concept: `Sebelum memanipulasi atau memodelkan data apa pun, analis profesional wajib menjalankan prosedur audit diagnostik awal yang komprehensif. Mengasumsikan data mentah dalam kondisi bersih adalah penyebab utama bias dalam laporan eksekutif.

Checklist inspeksi 16-langkah mencakup: verifikasi dimensi tabel (shape), inventarisasi nama kolom, audit tipe data sistem (dtypes), peninjauan sampel data teratas dan terbawah, kalkulasi statistik lima serangkai (describe), kuantifikasi persentase nilai hilang, deteksi baris duplikat penuh dan parsial, evaluasi kardinalitas nilai unik, serta pemindaian pencilan ekstrem.

Eksekusi checklist ini secara konsisten memastikan seluruh anomali struktural teridentifikasi pada jam pertama proyek, bukan setelah berhari-hari bekerja dengan hasil yang salah.`,
        code: `# 3.1: Eksekusi Checklist 16-Langkah Inspeksi Dataset Awal
import pandas as pd
import numpy as np

# Membuat sampel dataset inspeksi
df = pd.DataFrame({
    'trans_id': [101, 102, 103, 103, 105],
    'amount': [150000, 220000, np.nan, 310000, 9500000],
    'category': ['Retail', 'F&B', 'Retail', 'Retail', 'Luxury'],
    'is_fraud': [0, 0, 0, 0, 1]
})

print("=== CHECKLIST AUDIT DATA 16-LANGKAH (CUPLIKAN KUNCI) ===")
print("1. Dimensi Baris & Kolom :", df.shape)
print("2. Tipe Data Kolom       :\\n", df.dtypes)
print("3. Missing Values Total  :\\n", df.isnull().sum())
print("4. Baris Duplikat        :", df.duplicated(subset=['trans_id']).sum())
print("5. Nilai Unik per Fitur  :\\n", df.nunique())`,
        expectedOutput: "Audit 16-langkah berhasil memetakan profil dataset.",
        codeExp: "Skrip menjalankan serangkaian fungsi diagnostik dasar Pandas untuk mengaudit kualitas dan integritas dataset secara instan.",
        pitfalls: [
          "Hanya melihat df.head() tanpa memeriksa distribusi ekor nilai minimum dan maksimum melalui df.describe().",
          "Mengabaikan tipe data numerik yang keliru tersimpan sebagai tipe data string 'object'."
        ],
        refTitle: "Pandas Documentation: General functions (info, describe, isnull)",
        refUrl: "https://pandas.pydata.org/docs/user_guide/basics.html"
      },
      {
        num: "3.2",
        slug: "3-2-penanganan-missing-values-analisis-mekanisme-mcar-mar-dan-mnar",
        title: "3.2. Penanganan Missing Values: Analisis Mekanisme MCAR, MAR, dan MNAR",
        desc: "Taksonomi Little & Rubin: Missing Completely at Random, Missing at Random, dan Missing Not at Random serta implikasi biasnya.",
        concept: `Nilai hilang (missing values) tidak boleh dihapus atau diimputasi secara membabi-buta tanpa memahami mekanisme di balik ketiadaannya. Donald Rubin (1976) mengklasifikasikan missing values ke dalam tiga mekanisme fundamental:

1. MCAR (Missing Completely at Random): Probabilitas nilai hilang sama sekali tidak bergantung pada variabel apa pun, baik yang teramati maupun yang hilang (misalnya kuesioner tertiup angin secara acak). Menghapus baris MCAR mengurangi ukuran sampel namun tidak menimbulkan bias sistemik.

2. MAR (Missing at Random): Probabilitas nilai hilang bergantung pada variabel teramati lain dalam dataset, namun tidak bergantung pada nilai yang hilang itu sendiri (misalnya pria lebih jarang mengisi survei depresi, namun setelah mengontrol jenis kelamin, ketiadaannya acak).

3. MNAR (Missing Not at Random): Probabilitas nilai hilang berkaitan langsung dengan nilai yang hilang itu sendiri (misalnya individu berpendapatan sangat tinggi sengaja menolak menyebutkan nominal gajinya). Menghapus baris MNAR akan mendistorsi distribusi secara permanen.`,
        code: `# 3.2: Analisis Korelasi Pola Nilai Hilang (Missingness Indicator)
import pandas as pd
import numpy as np

df_survei = pd.DataFrame({
    'usia': [25, 45, 60, 22, 58, 30],
    'pendapatan': [5000000, np.nan, np.nan, 4500000, np.nan, 7000000]
})

# Membuat indikator biner apakah pendapatan hilang
df_survei['pendapatan_is_null'] = df_survei['pendapatan'].isnull().astype(int)

# Hitung rata-rata usia antara grup yang mengisi vs yang tidak mengisi pendapatan
audit_mar = df_survei.groupby('pendapatan_is_null')['usia'].mean()
print("=== AUDIT POLA NILAI HILANG (MAR TEST) ===")
print("Rata-rata Usia (0: Terisi, 1: Hilang):\\n", audit_mar)`,
        expectedOutput: "Pola dependensi missing value terdeteksi.",
        codeExp: "Skrip menguji apakah hilangnya nilai pendapatan berkorelasi dengan variabel usia untuk mendeteksi mekanisme Missing at Random (MAR).",
        pitfalls: [
          "Menghapus seluruh baris missing value menggunakan df.dropna() tanpa menyadari bahwa data bersifat MNAR yang membiaskan sampel.",
          "Mengisi nilai hilang dengan angka nol (0) padahal nol memiliki makna semantik yang berbeda dengan ketiadaan data."
        ],
        refTitle: "Kaggle Learn: Handling Missing Values Guide",
        refUrl: "https://www.kaggle.com/learn/data-cleaning"
      },
      {
        num: "3.3",
        slug: "3-3-teknik-imputasi-data-mean-median-modus-k-nn-imputation-dan-interpolasi",
        title: "3.3. Teknik Imputasi Data: Mean, Median, Modus, K-NN Imputation, dan Interpolasi",
        desc: "Strategi imputasi statistik univariat vs multivariat: SimpleImputer, KNNImputer, dan interpolasi deret waktu.",
        concept: `Imputasi adalah proses mengganti nilai yang hilang dengan estimasi nilai pengganti yang masuk akal berdasarkan informasi data yang tersedia. Pemilihan strategi imputasi harus disesuaikan dengan tipe data dan mekanisme missingness.

Imputasi univariat sederhana mengganti nilai numerik dengan mean (jika distribusi simetris) atau median (jika distribusi mencong). Untuk variabel kategorikal, nilai modus (nilai yang paling sering muncul) digunakan sebagai pengganti.

Untuk analisis tingkat lanjut, K-Nearest Neighbors (KNN) Imputation mencari K observasi terlengkap yang paling mirip secara geometris menggunakan metrik jarak Euclidean untuk memperkirakan nilai yang hilang. Untuk data deret waktu, interpolasi linier atau polynomial mempertahankan kesinambungan temporal tanpa memutus tren.`,
        formula: "$$\\hat{x}_i = \\frac{1}{K} \\sum_{j \\in \\mathcal{N}_K(i)} x_j, \\quad d(u, v) = \\sqrt{\\sum_{k} (u_k - v_k)^2}$$",
        code: `# 3.3: Komparasi Imputasi Median vs K-NN Imputer Multivariat
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer, KNNImputer

X = np.array([
    [1.0, 20.0],
    [2.0, 22.0],
    [np.nan, 21.0],
    [5.0, 50.0],
    [6.0, 52.0]
])

# 1. Simple Median Imputer
imp_median = SimpleImputer(strategy='median')
X_median = imp_median.fit_transform(X)

# 2. KNN Imputer (K=2)
imp_knn = KNNImputer(n_neighbors=2)
X_knn = imp_knn.fit_transform(X)

print(f"Hasil Imputasi Median Kolom 1 : {X_median[2, 0]:.2f}")
print(f"Hasil Imputasi K-NN Kolom 1   : {X_knn[2, 0]:.2f} (Memperhitungkan kedekatan fitur 2)")`,
        expectedOutput: "K-NN Imputer berhasil mengestimasi nilai hilang secara kontekstual.",
        codeExp: "Skrip mendemonstrasikan imputasi median standar dibandingkan dengan imputasi K-Nearest Neighbors multivariat menggunakan Scikit-Learn.",
        pitfalls: [
          "Melakukan fit imputasi pada seluruh dataset (train + test) yang menyebabkan kebocoran data (data leakage).",
          "Menggunakan mean imputation pada data yang memiliki pencilan ekstrem sehingga nilai pengganti menjadi terdistorsi."
        ],
        refTitle: "Scikit-Learn Documentation: Imputation of missing values",
        refUrl: "https://scikit-learn.org/stable/modules/impute.html"
      },
      {
        num: "3.4",
        slug: "3-4-deteksi-dan-mitigasi-pencilan-outliers-z-score-modified-z-score-dan-iqr",
        title: "3.4. Deteksi dan Mitigasi Pencilan (Outliers): Z-Score, Modified Z-Score, dan IQR",
        desc: "Metode deteksi batas statistik: Interquartile Range (1.5x IQR Rule), Z-Score standar, Modified Z-Score (MAD), dan strategi capping/winsorization.",
        concept: `Pencilan (outlier) adalah observasi yang menyimpang begitu jauh dari kumpulan data lainnya sehingga menimbulkan kecurigaan bahwa data tersebut dihasilkan oleh mekanisme yang berbeda (Hawkins, 1980). Pencilan dapat berupa kesalahan entri manusia, kegagalan sensor, atau anomali riil yang bernilai tinggi (seperti transaksi penipuan).

Metode deteksi paling populer adalah Aturan 1.5x IQR dari John Tukey: nilai di bawah Q1 - 1.5*IQR atau di atas Q3 + 1.5*IQR ditandai sebagai pencilan. Metode ini bebas dari asumsi distribusi normal.

Z-Score mengukur berapa standar deviasi suatu nilai berjarak dari mean (ambang batas umum |Z| > 3.0). Namun, karena mean dan standar deviasi itu sendiri dipengaruhi oleh pencilan, Modified Z-Score menggunakan Median dan Median Absolute Deviation (MAD) sebagai alternatif yang jauh lebih robust.`,
        formula: "$$\\text{Batas IQR} = [Q_1 - 1.5 \\times \\text{IQR}, \\; Q_3 + 1.5 \\times \\text{IQR}], \\quad M_i = \\frac{0.6745(x_i - \\tilde{x})}{\\text{MAD}}$$",
        code: `# 3.4: Deteksi dan Winsorization (Capping) Pencilan Berbasis Aturan IQR
import numpy as np
import pandas as pd

transaksi = pd.Series([12, 14, 15, 15, 16, 18, 19, 20, 22, 150]) # Outlier 150

q1 = transaksi.quantile(0.25)
q3 = transaksi.quantile(0.75)
iqr = q3 - q1
lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr

# Strategi Winsorization: Batasi nilai di batas atas dan bawah tanpa membuang baris
transaksi_capped = transaksi.clip(lower=lower_bound, upper=upper_bound)

print(f"Batas Bawah IQR : {lower_bound:.2f}")
print(f"Batas Atas IQR  : {upper_bound:.2f}")
print(f"Nilai Sebelum Capping: {transaksi.iloc[-1]}")
print(f"Nilai Sesudah Capping: {transaksi_capped.iloc[-1]:.2f}")`,
        expectedOutput: "Pencilan berhasil di-cap pada batas atas IQR.",
        codeExp: "Skrip mendeteksi pencilan menggunakan batas IQR Tukey dan menerapkan teknik Winsorization (capping) menggunakan fungsi .clip() Pandas.",
        pitfalls: [
          "Menghapus seluruh pencilan tanpa memeriksa apakah pencilan tersebut merupakan wawasan bisnis penting (seperti pelanggan VIP).",
          "Menerapkan aturan Z-score |Z| > 3 pada data yang sangat mencong (skewed)."
        ],
        refTitle: "Pandas Documentation: Computational Tools & Percentiles",
        refUrl: "https://pandas.pydata.org/docs/user_guide/computation.html"
      },
      {
        num: "3.5",
        slug: "3-5-standarisasi-dan-normalisasi-fitur-min-max-scaling-vs-standard-z-score",
        title: "3.5. Standarisasi dan Normalisasi Fitur: Min-Max Scaling vs Standard Z-Score",
        desc: "Transformasi skala data: StandardScaler, MinMaxScaler, RobustScaler, dan kapan harus menggunakannya.",
        concept: `Fitur-fitur dalam dataset seringkali memiliki satuan dan skala magnitudo yang berbeda drastis—misalnya usia (rentang 20-70 tahun) versus pendapatan tahunan (rentang Rp 50.000.000 - 5.000.000.000). Algoritma analitik yang mengandalkan pengukuran jarak (seperti K-Means, K-NN, PCA) akan didominasi secara mutlak oleh fitur dengan magnitudo terbesar.

Min-Max Scaling mentransformasi seluruh nilai ke dalam rentang tertutup [0, 1]. Namun, teknik ini sangat rentan terdistorsi oleh pencilan ekstrem karena nilai minimum dan maksimum terikat pada titik data ekstrem.

StandardScaler (Z-Score Standardization) mengubah fitur sehingga memiliki rata-rata 0 dan varians 1. Jika dataset memuat banyak pencilan ekstrem, RobustScaler (menggunakan median dan IQR) adalah standar industri terbaik.`,
        formula: "$$x_{\\text{norm}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}, \\quad z = \\frac{x - \\mu}{\\sigma}, \\quad x_{\\text{robust}} = \\frac{x - \\text{median}}{\\text{IQR}}$$",
        code: `# 3.5: Komparasi MinMax vs Standard vs Robust Scaling
import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler, RobustScaler

data = np.array([[10], [20], [30], [40], [500]]) # Outlier 500

mms = MinMaxScaler().fit_transform(data)
ss = StandardScaler().fit_transform(data)
rs = RobustScaler().fit_transform(data)

print("MinMax Scaled  :\\n", mms.ravel().round(2))
print("Standard Scaled:\\n", ss.ravel().round(2))
print("Robust Scaled  :\\n", rs.ravel().round(2))`,
        expectedOutput: "RobustScaler mempertahankan skala wajar meski ada outlier.",
        codeExp: "Skrip membandingkan tiga metode penskalaan Scikit-Learn dan membuktikan ketahanan RobustScaler terhadap pencilan.",
        pitfalls: [
          "Menerapkan fit_transform pada data uji, alih-alih menggunakan parameter yang dipelajari dari data latih.",
          "Menerapkan StandardScaler pada variabel kategori biner (0/1)."
        ],
        refTitle: "Scikit-Learn Documentation: Preprocessing Data (Scaling)",
        refUrl: "https://scikit-learn.org/stable/modules/preprocessing.html"
      },
      {
        num: "3.6",
        slug: "3-6-transformasi-variabel-log-transformation-box-cox-dan-power-transformation",
        title: "3.6. Transformasi Variabel: Log Transformation, Box-Cox, dan Power Transformation",
        desc: "Menstabilkan varians dan mendekatkan distribusi ke normalitas: Log1p, Box-Cox, dan Yeo-Johnson transformation.",
        concept: `Banyak model statistik dan teknik inferensi mengasumsikan varians galat yang konstan (homoskedastisitas) dan distribusi simetris normal. Namun, data ekonomi dan bisnis (seperti omzet, waktu tunggu, dan ukuran transaksi) hampir selalu mencong ke kanan dengan ekor panjang.

Transformasi logaritmik (Log Transformation atau np.log1p untuk menangani nilai nol) mengompresi nilai-nilai besar dan merentangkan nilai-nilai kecil, menstabilkan varians dan membuat distribusi mendekati normal.

Transformasi Box-Cox adalah famili transformasi pangkat parametrik yang secara otomatis mengestimasi nilai parameter lambda optimal untuk memaksimalkan normalitas, namun mensyaratkan seluruh nilai bernilai positif (> 0). Transformasi Yeo-Johnson memperluas Box-Cox untuk mendukung nilai nol dan negatif.`,
        formula: "$$y^{(\\lambda)} = \\begin{cases} \\frac{y^\\lambda - 1}{\\lambda} & \\text{jika } \\lambda \\ne 0 \\\\ \\ln(y) & \\text{jika } \\lambda = 0 \\end{cases}$$",
        code: `# 3.6: Menormalkan Distribusi Mencong dengan Log Transformation & Box-Cox
import numpy as np
import scipy.stats as stats

np.random.seed(42)
omzet_mencong = np.random.exponential(scale=1000, size=500) + 10 # Positif

skew_awal = stats.skew(omzet_mencong)
omzet_log = np.log1p(omzet_mencong)
skew_log = stats.skew(omzet_log)

omzet_boxcox, lambda_opt = stats.boxcox(omzet_mencong)
skew_boxcox = stats.skew(omzet_boxcox)

print(f"Skewness Awal     : {skew_awal:.3f} (Mencong Kanan)")
print(f"Skewness Log(1+x) : {skew_log:.3f} (Mendekati Simetris)")
print(f"Skewness Box-Cox  : {skew_boxcox:.3f} (Lambda Optimal = {lambda_opt:.3f})")`,
        expectedOutput: "Skewness berhasil diturunkan mendekati nol.",
        codeExp: "Skrip menerapkan np.log1p dan stats.boxcox untuk mentransformasi data yang mencong ekstrem menjadi simetris.",
        pitfalls: [
          "Menerapkan np.log() langsung pada data yang memuat nilai nol atau negatif sehingga menghasilkan -inf atau NaN.",
          "Lupa melakukan inverse-transformasi pada saat mengomunikasikan hasil estimasi akhir kembali ke pengguna bisnis."
        ],
        refTitle: "SciPy Reference Guide: stats.boxcox",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.boxcox.html"
      },
      {
        num: "3.7",
        slug: "3-7-penanganan-data-duplikat-inkonsistensi-string-dan-normalisasi-regex",
        title: "3.7. Penanganan Data Duplikat, Inkonsistensi String, dan Normalisasi Regex",
        desc: "Pembersihan teks tabular: penanganan duplikasi baris, penghapusan whitespace tersembunyi, fuzzy matching, dan ekstraksi regex.",
        concept: `Data teks yang dimasukkan oleh manusia secara manual adalah sarang inkonsistensi terbesar dalam gudang data. Perbedaan kapitalisasi (misalnya 'Jakarta', 'jakarta', 'JAKARTA'), spasi berlebih (' Bandung '), salah eja (typo), atau variasi penulisan ('PT. Maju Mundur' vs 'PT Maju Mundur Tbk') menyebabkan agregasi GroupBy menghasilkan kelompok-kelompok yang terpecah secara artifisial.

Penanganan duplikasi memerlukan pembedaan antara duplikasi baris penuh (exact duplicates) dan duplikasi parsial berbasis kunci bisnis (business key duplicates, misalnya dua transaksi berhasil dengan transaction_id yang sama).

Ekspresi Reguler (Regex) menyediakan mekanisme standar industri untuk mengekstrak pola string seperti nomor telepon terstandarisasi, kode pos, alamat email, atau kode kupon diskon.`,
        code: `# 3.7: Normalisasi Inkonsistensi String dan Deduplikasi Parsial
import pandas as pd
import re

df_cust = pd.DataFrame({
    'cust_id': [1, 2, 2, 3],
    'kota': [' JAKARTA ', 'jakarta', 'Jakarta', 'Surabaya'],
    'telepon': ['+62 812-3456-7890', '081234567890', '0812-3456-7890', '0819-9999-8888']
})

# 1. Bersihkan inkonsistensi string kota
df_cust['kota_clean'] = df_cust['kota'].str.strip().str.title()

# 2. Normalisasi nomor telepon menggunakan Regex ke format standar 628xxx
def clean_phone(phone: str) -> str:
    digits = re.sub(r'\\D', '', phone)
    if digits.startswith('0'):
        digits = '62' + digits[1:]
    return digits

df_cust['phone_clean'] = df_cust['telepon'].apply(clean_phone)

# 3. Deduplikasi berbasis kunci unik cust_id
df_dedup = df_cust.drop_duplicates(subset=['cust_id'], keep='last')

print("=== TABEL DATA HASIL NORMALISASI DAN DEDUPLIKASI ===")
print(df_dedup[['cust_id', 'kota_clean', 'phone_clean']].to_string(index=False))`,
        expectedOutput: "String ternormalisasi dan duplikat terhapus.",
        codeExp: "Skrip membersihkan inkonsistensi string kapitalisasi/spasi, menstandarkan nomor telepon dengan regex, dan menghapus baris duplikat.",
        pitfalls: [
          "Menggunakan df.drop_duplicates() tanpa parameter subset sehingga duplikasi logika bisnis tetap lolos.",
          "Menghapus spasi di tengah nama orang saat mencoba membersihkan trailing/leading whitespace."
        ],
        refTitle: "Python Documentation: Regular expression operations (re)",
        refUrl: "https://docs.python.org/3/library/re.html"
      },
      {
        num: "3.8",
        slug: "3-8-parsing-dan-validasi-data-tanggal-waktu-datetime-wrangling-timezone",
        title: "3.8. Parsing dan Validasi Data Tanggal/Waktu (Datetime Wrangling & Timezone)",
        desc: "Manipulasi waktu profesional: parsing string tanggal ambiguous, konversi timezone (UTC ke WIB), ekstraksi komponen kalender, dan durasi.",
        concept: `Data tanggal dan waktu (datetime) menyimpan dimensi analitis yang sangat kaya untuk membedah pola musiman, retensi kohort, dan laju pertumbuhan bisnis. Namun, datetime juga merupakan salah satu tipe data yang paling sering mengalami kegagalan parsing akibat format penulisan yang beragam (misalnya 'DD/MM/YYYY' vs 'MM/DD/YYYY').

Manajemen zona waktu (timezone awareness) sangat vital bagi perusahaan multinasional atau platform e-commerce yang melayani wilayah luas. Menyimpan timestamp dalam format UTC (Coordinated Universal Time) di gudang data adalah standar industri terbaik untuk menghindari ambiguitas Daylight Saving Time atau perbedaan waktu lokal (seperti WIB, WITA, WIT).

Pandas menyediakan struktur DatetimeIndex teroptimasi C yang memungkinkan slicing rentang tanggal, ekstraksi hari dalam seminggu (day of week), dan kalkulasi selisih waktu (Timedelta).`,
        code: `# 3.8: Datetime Wrangling dan Konversi Zona Waktu (UTC ke WIB)
import pandas as pd

raw_dates = pd.Series(['2026-09-15 08:30:00', '2026-09-15 14:00:00', '2026-09-16 01:15:00'])

# 1. Konversi ke Datetime dan tetapkan Timezone UTC
dt_utc = pd.to_datetime(raw_dates).dt.tz_localize('UTC')

# 2. Konversi ke Waktu Indonesia Barat (WIB / Asia/Jakarta: UTC+7)
dt_wib = dt_utc.dt.tz_convert('Asia/Jakarta')

df_time = pd.DataFrame({
    'UTC': dt_utc,
    'WIB': dt_wib,
    'Jam_WIB': dt_wib.dt.hour,
    'Nama_Hari': dt_wib.dt.day_name()
})

print("=== MANIPULASI WAKTU DAN ZONA WAKTU PANDAS ===")
print(df_time.to_string(index=False))`,
        expectedOutput: "Konversi timezone UTC ke Asia/Jakarta berhasil.",
        codeExp: "Skrip mengonversi string waktu ke objek datetime timezone-aware UTC dan mengonversinya ke zona waktu lokal Asia/Jakarta (WIB).",
        pitfalls: [
          "Melakukan agregasi harian pada timestamp UTC yang menyebabkan transaksi malam hari di Indonesia terhitung masuk ke hari sebelumnya.",
          "Membiarkan format tanggal ambigu (03/04/2026) diparsing otomatis tanpa mendefinisikan parameter format='%d/%m/%Y'."
        ],
        refTitle: "Pandas Documentation: Time series / date functionality",
        refUrl: "https://pandas.pydata.org/docs/user_guide/timeseries.html"
      },
      {
        num: "3.9",
        slug: "3-9-encoding-variabel-kategorikal-one-hot-ordinal-frequency-encoding",
        title: "3.9. Encoding Variabel Kategorikal: One-Hot Encoding, Ordinal Encoding, Frequency Encoding",
        desc: "Transformasi variabel non-numerik: One-Hot Encoding (pd.get_dummies), Ordinal Encoding, dan penanganan kategori berdimensi tinggi.",
        concept: `Variabel kategorikal merepresentasikan informasi kualitatif (seperti nama kota, metode pengiriman, atau tingkat pendidikan). Karena algoritma analitik kuantitatif dan machine learning bekerja pada aljabar matriks numerik, data kategorikal wajib dienkode menjadi representasi angka.

Ordinal Encoding digunakan ketika kategori memiliki urutan hierarkis yang inheren (misalnya Pendidikan: SD=1, SMP=2, SMA=3, S1=4).

One-Hot Encoding (OHE) membuat kolom biner (0/1) untuk setiap kategori unik. OHE cocok untuk variabel nominal tanpa urutan (seperti warna atau kota). Namun, jika variabel memiliki kardinalitas tinggi (ribuan kategori unik seperti kode pos), OHE akan memicu 'kutukan dimensi' (curse of dimensionality). Sebagai solusinya, Frequency Encoding mengganti kategori dengan frekuensi kemunculannya.`,
        code: `# 3.9: Komparasi One-Hot Encoding vs Frequency Encoding
import pandas as pd

df_kategori = pd.DataFrame({
    'kota': ['Jakarta', 'Surabaya', 'Jakarta', 'Bandung', 'Jakarta'],
    'tingkat_layanan': ['Gold', 'Bronze', 'Silver', 'Gold', 'Silver']
})

# 1. One-Hot Encoding pada fitur kota
ohe_kota = pd.get_dummies(df_kategori['kota'], prefix='kota', drop_first=True, dtype=int)

# 2. Ordinal Encoding pada tingkat layanan
layanan_map = {'Bronze': 1, 'Silver': 2, 'Gold': 3}
df_kategori['layanan_skor'] = df_kategori['tingkat_layanan'].map(layanan_map)

# 3. Frequency Encoding pada kota
freq_map = df_kategori['kota'].value_counts(normalize=True).to_dict()
df_kategori['kota_freq'] = df_kategori['kota'].map(freq_map)

print("=== REKAYASA FITUR KATEGORIKAL ===")
print(pd.concat([df_kategori, ohe_kota], axis=1).to_string(index=False))`,
        expectedOutput: "Encoding kategorikal One-Hot dan Ordinal berhasil.",
        codeExp: "Skrip mendemonstrasikan teknik One-Hot Encoding (pd.get_dummies), Ordinal Mapping, dan Frequency Encoding pada DataFrame.",
        pitfalls: [
          "Menerapkan Ordinal Encoding pada variabel nominal tanpa urutan (seperti warna: Merah=1, Biru=2) yang menyebabkan model mengasumsikan relasi jarak numerik palsu.",
          "Lupa menyertakan drop_first=True pada regresi linier sehingga menimbulkan multikolinearitas sempurna (dummy variable trap)."
        ],
        refTitle: "Pandas Documentation: Reshaping and pivot tables (get_dummies)",
        refUrl: "https://pandas.pydata.org/docs/user_guide/reshaping.html"
      },
      {
        num: "3.10",
        slug: "3-10-validasi-integritas-relasional-dan-pembuatan-pipeline-pembersihan-otomatis",
        title: "3.10. Validasi Integritas Relasional dan Pembuatan Pipeline Pembersihan Otomatis",
        desc: "Enkapsulasi seluruh langkah pembersihan ke dalam pipeline modular reproducible menggunakan Scikit-Learn Pipeline dan ColumnTransformer.",
        concept: `Setelah seluruh teknik audit, imputasi, penskalaan, dan encoding dikuasai secara individual, tantangan rekayasa terpenting adalah mengintegrasikannya ke dalam alur pipa otomatis (automated data cleaning pipeline). Menjalankan skrip pembersihan ad-hoc manual dari notebook ke notebook rentan terhadap inkonsistensi manusia dan kegagalan reproduksibilitas.

Scikit-Learn menyediakan objek Pipeline dan ColumnTransformer yang mengenkapsulasi seluruh tahapan transformasi secara deklaratif.

Keuntungan utama dari arsitektur pipeline adalah imunitas terhadap kebocoran data (anti-data-leakage): seluruh parameter (seperti median imputasi dan min/max penskalaan) dipelajari secara eksklusif dari data latih melalui metode .fit(), dan diterapkan secara deterministik ke data produksi/uji melalui .transform().`,
        code: `# 3.10: Pembuatan Pipeline Pembersihan Data Modular Otomatis
import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# Data mentah heterogen
df_raw = pd.DataFrame({
    'usia': [25.0, 30.0, np.nan, 45.0],
    'pendapatan': [5000000.0, 7500000.0, 6000000.0, np.nan],
    'kategori': ['Silver', 'Gold', 'Silver', 'Bronze']
})

num_features = ['usia', 'pendapatan']
cat_features = ['kategori']

# Pipeline Numerik: Imputasi Median -> StandardScaler
num_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# Pipeline Kategorikal: Imputasi Modus -> OneHotEncoder
cat_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('ohe', OneHotEncoder(drop='first', sparse_output=False))
])

# Gabungkan dengan ColumnTransformer
full_pipeline = ColumnTransformer([
    ('num', num_pipeline, num_features),
    ('cat', cat_pipeline, cat_features)
])

processed_array = full_pipeline.fit_transform(df_raw)
print("=== HASIL TRANSFORMASI PIPELINE MODULAR (CLEAN ARRAY) ===")
print(np.round(processed_array, 2))`,
        expectedOutput: "Pipeline pembersihan modular selesai tanpa kebocoran data.",
        codeExp: "Skrip membangun alur pembersihan end-to-end terisolasi menggunakan ColumnTransformer dan Pipeline Scikit-Learn standar industri.",
        pitfalls: [
          "Menerapkan fungsi lambda transformasi manual secara terpisah di luar objek Pipeline terstandarisasi.",
          "Menyimpan data hasil pembersihan tanpa menyimpan objek transformer fitted untuk inferensi data baru di masa depan."
        ],
        refTitle: "Scikit-Learn Documentation: Pipeline and composite estimators",
        refUrl: "https://scikit-learn.org/stable/modules/compose.html"
      }
    ]
  }
];

console.log("CHAPTERS_1_TO_3 loaded (30 subchapters).");
