import * as fs from "fs";
import * as path from "path";

interface SubchapterData {
  num: string; // e.g. "1.1"
  slug: string;
  title: string;
  desc: string;
  objectives: string[];
  prereqs: string[];
  conceptDefinition: string;
  mechanics: string;
  formulaLatex?: string;
  formulaDesc?: string;
  code: string;
  expectedOutput: string;
  codeExplanation: string;
  pitfalls: string[];
  refTitle: string;
  refUrl: string;
  refProvider: string;
}

interface ChapterData {
  orderIndex: number;
  title: string;
  slug: string;
  description: string;
  learningObjectives: string[];
  competencies: string[];
  coreConcepts: string[];
  subchapters: SubchapterData[];
}

// Data definitif untuk 10 Bab Kurikulum Data Analyst
export const DATA_ANALYST_CHAPTERS_DATA: ChapterData[] = [
  // ==========================================
  // BAB 1: Metodologi Analisis Data Modern & Siklus Hidup Analitik
  // ==========================================
  {
    orderIndex: 1,
    title: "BAB 1: Metodologi Analisis Data Modern & Siklus Hidup Analitik",
    slug: "bab-1-metodologi-analisis-data-modern-siklus-hidup-analitik",
    description: "Fondasi metodologis analisis data tingkat profesional: siklus hidup CRISP-DM dan OSEMN, dekomposisi masalah bisnis dengan Issue Tree, perumusan metrik SMART, taksonomi analitik, dan etika regulasi data.",
    learningObjectives: [
      "Menguasai alur kerja analitik data end-to-end dari perumusan masalah bisnis hingga deployment insight",
      "Mampu mendekomposisi masalah bisnis kompleks menggunakan kerangka Issue Tree dan prinsip MECE",
      "Merumuskan metrik kinerja (KPI) yang terukur dan selaras dengan tujuan strategis organisasi",
      "Menerapkan prinsip etika data, privasi pengguna, dan kepatuhan regulasi (GDPR dan UU PDP)"
    ],
    competencies: [
      "Pemahaman mendalam siklus hidup analitik enterprise",
      "Keterampilan problem framing bisnis berbasis data",
      "Audit kepatuhan tata kelola dan etika data"
    ],
    coreConcepts: ["CRISP-DM", "OSEMN", "Issue Tree MECE", "SMART KPI", "Analytics Taxonomy", "Data Governance"],
    subchapters: [
      {
        num: "1.1",
        slug: "1-1-siklus-hidup-analisis-data-crisp-dm-osemn",
        title: "1.1. Siklus Hidup Analisis Data (CRISP-DM & OSEMN)",
        desc: "Struktur metodologis alur kerja analitik data: perbandingan fase CRISP-DM dan OSEMN, integrasi iteratif, dan pemetaan deliverable tiap tahap.",
        objectives: [
          "Membedakan 6 fase CRISP-DM dan 5 fase OSEMN dalam konteks proyek analitik enterprise",
          "Mengidentifikasi umpan balik iteratif antar-fase untuk mitigasi risiko kegagalan proyek",
          "Menyusun matriks deliverable terstandarisasi untuk setiap tahapan siklus hidup data"
        ],
        prereqs: ["Pengantar ilmu komputer dan pemikiran komputasi dasar"],
        conceptDefinition: 
          "Siklus hidup analisis data merupakan kerangka kerja terstruktur yang memandu praktisi data dari pemahaman masalah bisnis mentah hingga penerapan wawasan operasional. Tanpa panduan metodologis yang baku, proyek analitik rentan terjebak dalam eksplorasi ad-hoc tanpa arah yang menghabiskan sumber daya komputasi tanpa memberikan nilai bisnis terukur.\n\n" +
          "Dua kerangka kerja paling dominan dalam industri adalah CRISP-DM (Cross-Industry Standard Process for Data Mining) dan OSEMN (Obtain, Scrub, Explore, Model, iNterpret). CRISP-DM menekankan keterikatan siklus yang berulang (iterative loop) di mana evaluasi model dapat memaksa praktisi kembali meninjau pemahaman bisnis atau pembersihan data.\n\n" +
          "Dalam praktiknya di industri teknologi modern, integrasi CRISP-DM dan metodologi Agile memungkinkan rilis wawasan bertahap (sprint-based deliverables). Pemahaman mendalam terhadap siklus ini mencegah kesalahan umum seperti melompat langsung ke pemodelan algoritma sebelum memvalidasi asumsi kualitas data masukan.",
        mechanics: 
          "Alur eksekusi CRISP-DM terdiri atas 6 fase berurutan yang bersifat dua arah: (1) Business Understanding, (2) Data Understanding, (3) Data Preparation, (4) Modeling, (5) Evaluation, dan (6) Deployment. Pada fase Data Preparation, waktu pengerjaan umumnya memakan 60-80% dari total durasi proyek untuk menjamin integritas data sebelum masuk ke tahap estimasi kuantitatif.",
        formulaLatex: "\\text{Efisiensi Proyek} = \\frac{\\text{Validasi Nilai Bisnis Terpenuhi}}{\\sum_{i=1}^6 \\text{Durasi Fase}_i} \\times 100\\%",
        formulaDesc: "Rasio pemenuhan objektif bisnis terhadap total waktu eksekusi 6 fase CRISP-DM.",
        code: 
`# =====================================================================
# Program: Pelacak Progres Fase Siklus Hidup CRISP-DM & OSEMN
# Deskripsi: Mengelola status, durasi, dan verifikasi deliverable proyek
# =====================================================================
import pandas as pd
import datetime

# 1. Definisikan struktur fase CRISP-DM dengan alokasi bobot waktu standar
crisp_dm_stages = [
    {"Fase": "1. Business Understanding", "Bobot_Pct": 15, "Status": "Selesai", "Deliverable": "Project Charter & SMART KPIs"},
    {"Fase": "2. Data Understanding", "Bobot_Pct": 20, "Status": "Selesai", "Deliverable": "Exploratory Data Audit & Data Dictionary"},
    {"Fase": "3. Data Preparation", "Bobot_Pct": 35, "Status": "Sedang Berjalan", "Deliverable": "Cleaned Dataset & Pipeline Transformation"},
    {"Fase": "4. Modeling / Analysis", "Bobot_Pct": 15, "Status": "Belum Dimulai", "Deliverable": "Statistical / Predictive Models"},
    {"Fase": "5. Evaluation", "Bobot_Pct": 10, "Status": "Belum Dimulai", "Deliverable": "Business Goal Verification Report"},
    {"Fase": "6. Deployment", "Bobot_Pct": 5, "Status": "Belum Dimulai", "Deliverable": "Interactive Dashboard & Monitoring API"}
]

# 2. Konversi ke DataFrame Pandas untuk visualisasi analitik
df_lifecycle = pd.DataFrame(crisp_dm_stages)

# 3. Hitung metrik agregat proyek
total_bobot = df_lifecycle["Bobot_Pct"].sum()
selesai_bobot = df_lifecycle[df_lifecycle["Status"] == "Selesai"]["Bobot_Pct"].sum()
progress_pct = (selesai_bobot / total_bobot) * 100

print("=== RINGKASAN SIKLUS HIDUP PROYEK ANALITIK DATA ===")
print(df_lifecycle.to_string(index=False))
print(f"\\nTotal Progres Keseluruhan: {progress_pct:.1f}%")
`,
        expectedOutput: "Status eksekusi: Total Progres Keseluruhan: 35.0%",
        codeExplanation: "Skrip di atas memodelkan alur manajemen siklus hidup analitik CRISP-DM menggunakan DataFrame Pandas, memetakan bobot alokasi kerja, dan menghitung progres komputasi proyek secara terukur.",
        pitfalls: [
          "Melompati fase Business Understanding dan langsung menulis kueri/kode tanpa metrik keberhasilan yang jelas.",
          "Memperlakukan siklus hidup sebagai garis lurus (waterfall) tanpa melakukan iterasi ulang ketika data baru ditemukan."
        ],
        refTitle: "OSSU Data Science Curriculum Guide",
        refUrl: "https://github.com/ossu/data-science",
        refProvider: "Open Source Society University"
      },
      {
        num: "1.2",
        slug: "1-2-perumusan-masalah-bisnis-dengan-pendekatan-top-down-issue-tree",
        title: "1.2. Perumusan Masalah Bisnis dengan Pendekatan Top-Down (Issue Tree & MECE)",
        desc: "Dekomposisi analitis permasalahan bisnis strategis menggunakan pohon isu berprinsip Mutually Exclusive, Collectively Exhaustive (MECE).",
        objectives: [
          "Menerapkan prinsip MECE dalam memecah masalah bisnis yang ambigu menjadi hipotesis yang dapat diuji",
          "Membangun struktur Issue Tree matematis untuk menganalisis penurunan profitabilitas atau pendapatan",
          "Mengidentifikasi tuas kunci (key levers) operasional yang dapat diintervensi melalui analisis data"
        ],
        prereqs: ["Siklus Hidup Analisis Data (1.1)"],
        conceptDefinition: 
          "Perumusan masalah bisnis merupakan pembeda utama antara analis data operasional dan mitra strategis manajemen. Seringkali pemangku kepentingan mengajukan keluhan yang ambigu seperti 'Pendapatan Q3 turun, tolong cari tahu penyebabnya'. Analis profesional tidak langsung memeriksa seluruh tabel data secara acak, melainkan menyusun struktur dekomposisi logis.\n\n" +
          "Prinsip MECE (Mutually Exclusive, Collectively Exhaustive) yang dirintis oleh konsultan manajemen McKinsey menuntut bahwa pembagian elemen masalah tidak boleh saling tumpang tindih (mutually exclusive) dan jika digabungkan harus mencakup seluruh kemungkinan semesta masalah (collectively exhaustive).\n\n" +
          "Dengan Issue Tree berbasis MECE, pendapatan (Revenue) dapat dipecah menjadi perkalian antara Jumlah Transaksi (Order Count) dan Rata-rata Nilai Pesanan (Average Order Value - AOV). Masing-masing cabang kemudian dipecah lebih lanjut ke tingkat kohort pengguna atau kategori produk.",
        mechanics: 
          "Pohon isu diturunkan dari simpul akar (masalah utama) menuju simpul daun (faktor pemicu operasional). Setiap tingkat percabangan diuji secara kuantitatif menggunakan data riil untuk mengisolasi cabang mana yang mengalami anomali penyimpangan terbesar dari baseline historis.",
        formulaLatex: "\\text{Revenue} = \\text{Active Users} \\times \\text{Conversion Rate} \\times \\text{Frequency} \\times \\text{AOV}",
        formulaDesc: "Dekomposisi persamaan pendapatan bisnis digital menjadi komponen-komponen MECE.",
        code: 
`# =====================================================================
# Program: Dekomposisi Pohon Isu Pendapatan (MECE Revenue Tree)
# Deskripsi: Menghitung kontribusi perubahan variabel terhadap varians revenue
# =====================================================================
import pandas as pd

# 1. Metrik historis baseline (Bulan Lalu) vs Aktual (Bulan Ini)
metrics_data = {
    "Metrik": ["Pengguna Aktif (Users)", "Conversion Rate (%)", "Rata-rata Belanja (AOV Rp)"],
    "Bulan_Lalu": [100000, 3.5, 250000],
    "Bulan_Ini":  [95000,  3.2, 270000]
}

df_tree = pd.DataFrame(metrics_data)

# 2. Hitung Pendapatan Total pada kedua periode
rev_lalu = df_tree.loc[0, "Bulan_Lalu"] * (df_tree.loc[1, "Bulan_Lalu"] / 100) * df_tree.loc[2, "Bulan_Lalu"]
rev_ini  = df_tree.loc[0, "Bulan_Ini"]  * (df_tree.loc[1, "Bulan_Ini"] / 100)  * df_tree.loc[2, "Bulan_Ini"]

selisih_rev = rev_ini - rev_lalu
pct_change = (selisih_rev / rev_lalu) * 100

print(f"Pendapatan Bulan Lalu : Rp {rev_lalu:,.0f}")
print(f"Pendapatan Bulan Ini  : Rp {rev_ini:,.0f}")
print(f"Penyimpangan Absolut  : Rp {selisih_rev:,.0f} ({pct_change:.2f}%)")
print("\\nKesimpulan Analitis: Penurunan dipicu oleh penurunan Conversion Rate sebesar 0.3% poin meskipun AOV naik.")
`,
        expectedOutput: "Status eksekusi: Penyimpangan Absolut teridentifikasi dengan deterministik.",
        codeExplanation: "Kode di atas mendemonstrasikan kalkulasi analitis dari cabang-cabang MECE pendapatan, memungkinkan analis menunjukkan faktor mana yang menyebabkan penurunan performa keuangan.",
        pitfalls: [
          "Menyusun cabang masalah yang saling tumpang tindih sehingga terjadi penghitungan ganda (double-counting).",
          "Mengabaikan variabel pendorong tersembunyi yang berada di luar dataset internal perusahaan."
        ],
        refTitle: "Python Data Science Handbook: Data Analysis Foundations",
        refUrl: "https://jakevdp.github.io/PythonDataScienceHandbook/",
        refProvider: "O'Reilly Media"
      },
      {
        num: "1.3",
        slug: "1-3-kerangka-metrik-smart-untuk-menentukan-key-performance-indicators-kpi",
        title: "1.3. Kerangka Metrik SMART untuk Menentukan Key Performance Indicators (KPI)",
        desc: "Perancangan indikator kinerja kunci (KPI) berbasis kriteria Specific, Measurable, Achievable, Relevant, dan Time-bound.",
        objectives: [
          "Mengevaluasi kualitas KPI organisasi berdasarkan lima pilar kerangka SMART",
          "Membedakan metrik vanity (vanity metrics) dengan metrik yang dapat ditindaklanjuti (actionable metrics)",
          "Menghitung metrik retensi dan rasio konversi dalam formula matematis formal"
        ],
        prereqs: ["Perumusan Masalah Bisnis (1.2)"],
        conceptDefinition: 
          "Key Performance Indicator (KPI) adalah kompas kuantitatif yang mengarahkan keputusan taktis dan strategis organisasi. Namun, banyak organisasi terjebak dalam memantau 'vanity metrics'—angka-angka yang tampak impresif di permukaan (misalnya total unduhan aplikasi atau jumlah kunjungan halaman) namun tidak memiliki korelasi langsung terhadap keberlanjutan bisnis.\n\n" +
          "Kerangka SMART memastikan setiap metrik dirumuskan secara terukur: Specific (jelas sasarannya), Measurable (dapat dihitung secara numerik), Achievable (realistis dicapai), Relevant (berdampak langsung pada tujuan utama), dan Time-bound (memiliki horizon waktu evaluasi yang tegas).\n\n" +
          "Dalam ranah e-commerce dan SaaS, metrik seperti Customer Acquisition Cost (CAC), Customer Lifetime Value (CLV), Monthly Recurring Revenue (MRR), dan Churn Rate merupakan contoh metrik SMART yang memberikan panduan aksi nyata bagi tim manajemen.",
        mechanics: 
          "Formulasi KPI memerlukan pendefinisian pembilang (numerator), penyebut (denominator), filter populasi, dan jendela waktu pelaporan. Setiap metrik harus memiliki pemilik data (data owner) dan ambang batas peringatan (threshold alerting).",
        formulaLatex: "\\text{Net Churn Rate} = \\frac{\\text{MRR Lost} - \\text{MRR Expansion}}{\\text{Starting MRR}} \\times 100\\%",
        formulaDesc: "Formula perhitungan Net Churn Rate bulanan untuk model bisnis berlangganan.",
        code: 
`# =====================================================================
# Program: Perhitungan Metrik SMART - Evaluasi Kesehatan Finansial SaaS
# Deskripsi: Menghitung Rasio LTV / CAC dan Net Churn Rate Bulanan
# =====================================================================
import pandas as pd

# 1. Parameter metrik bisnis SaaS bulanan
cac = 1200000           # Customer Acquisition Cost (Rp)
arpu = 350000           # Average Revenue Per User per Bulan (Rp)
gross_margin = 0.80     # 80% Gross Margin
churn_rate = 0.05       # 5% Churn per bulan

# 2. Kalkulasi Customer Lifetime Value (LTV)
# Formula: LTV = (ARPU * Gross Margin) / Churn Rate
ltv = (arpu * gross_margin) / churn_rate

# 3. Hitung rasio kesehatan unit ekonomi (LTV : CAC)
ltv_cac_ratio = ltv / cac

# Standar industri: Rasio >= 3.0 menandakan model bisnis sehat dan scalable
status_kesehatan = "Sangat Sehat (Ideal >= 3.0)" if ltv_cac_ratio >= 3.0 else "Perlu Optimasi Efisiensi"

print("=== AUDIT METRIK SMART KESEHATAN BISNIS ===")
print(f"Customer Lifetime Value (LTV) : Rp {ltv:,.0f}")
print(f"Customer Acquisition Cost (CAC): Rp {cac:,.0f}")
print(f"Rasio LTV / CAC                : {ltv_cac_ratio:.2f}x -> {status_kesehatan}")
`,
        expectedOutput: "Status eksekusi: Rasio LTV / CAC berhasil dikomputasi dan dievaluasi.",
        codeExplanation: "Skrip menghitung metrik LTV dan rasio LTV:CAC berdasarkan data keuangan unit ekonomi, mengevaluasi keberlanjutan model bisnis secara objektif.",
        pitfalls: [
          "Memilih metrik akumulatif yang selalu naik (seperti total pengguna terdaftar sepanjang masa) daripada metrik tingkat keaktifan berjalan.",
          "Menghitung rata-rata tanpa mempertimbangkan skewness atau keberadaan pencilan nilai ekstrem."
        ],
        refTitle: "Kaggle Learn: Introduction to Business Analytics Metrics",
        refUrl: "https://www.kaggle.com/learn",
        refProvider: "Kaggle / Google"
      },
      {
        num: "1.4",
        slug: "1-4-taksonomi-analitik-deskriptif-diagnostik-prediktif-dan-preskriptif",
        title: "1.4. Taksonomi Analitik: Deskriptif, Diagnostik, Prediktif, dan Preskriptif",
        desc: "Empat tingkatan kematangan kapabilitas analitik: dari pelaporan historis hingga optimasi keputusan otomatis berbasis data.",
        objectives: [
          "Membedakan pertanyaan inti dan nilai tambah dari 4 tingkat analitik Gartner",
          "Mengidentifikasi kompleksitas teknis dan algoritma yang diperlukan di setiap tingkat",
          "Memetakan kasus penggunaan bisnis nyata ke dalam taksonomi analitik yang tepat"
        ],
        prereqs: ["Kerangka Metrik SMART (1.3)"],
        conceptDefinition: 
          "Gartner membagi analitik data ke dalam empat kuadran kematangan kapabilitas: Analitik Deskriptif ('Apa yang telah terjadi?'), Analitik Diagnostik ('Mengapa hal itu terjadi?'), Analitik Prediktif ('Apa yang mungkin terjadi di masa depan?'), dan Analitik Preskriptif ('Tindakan apa yang harus kita ambil untuk mencapai hasil optimal?').\n\n" +
          "Analitik Deskriptif merangkum data historis melalui dashboard dan laporan agregat. Analitik Diagnostik melangkah lebih dalam menggunakan teknik drill-down, korelasi, dan isolasi anomali untuk membongkar akar penyebab peristiwa bisnis.\n\n" +
          "Tingkatan lanjutan melibatkan estimasi probabilitas masa depan menggunakan model statistika/machine learning (Prediktif), dan diakhiri dengan perumusan skenario keputusan teroptimasi menggunakan riset operasi atau simulasi skenario (Preskriptif).",
        mechanics: 
          "Semakin tinggi tingkat taksonomi, semakin tinggi kompleksitas matematis dan nilai tambah kompetitif bagi organisasi. Analis data modern harus mampu menjembatani deskripsi data historis menuju rekomendasi tindakan nyata yang dapat dieksekusi.",
        formulaLatex: "\\max_{x \\in X} \\mathbb{E}[f(x, \\xi)] \\quad \\text{subject to } g_i(x) \\le 0",
        formulaDesc: "Formulasi analitik preskriptif sebagai optimasi matematis dalam kondisi ketidakpastian.",
        code: 
`# =====================================================================
# Program: Demonstrasi 4 Tingkat Taksonomi Analitik pada Data Penjualan
# Deskripsi: Dari kalkulasi deskriptif hingga simulasi preskriptif optimasi harga
# =====================================================================
import numpy as np
import pandas as pd

# 1. Data historis transaksi retail
np.random.seed(42)
sales_data = pd.DataFrame({
    "Bulan": range(1, 13),
    "Harga": [100, 100, 105, 105, 110, 110, 115, 115, 120, 120, 125, 125],
    "Unit_Terjual": [500, 490, 470, 460, 440, 430, 410, 395, 380, 370, 340, 330]
})

# 1. Deskriptif: Apa yang terjadi?
total_omzet = (sales_data["Harga"] * sales_data["Unit_Terjual"]).sum()

# 2. Diagnostik: Mengapa penjualan unit turun?
elastisitas = (sales_data["Unit_Terjual"].pct_change() / sales_data["Harga"].pct_change()).dropna().mean()

# 3. Prediktif: Berapa estimasi unit jika harga Rp 130?
model_slope = np.polyfit(sales_data["Harga"], sales_data["Unit_Terjual"], 1)
pred_unit_130 = model_slope[0] * 130 + model_slope[1]

# 4. Preskriptif: Berapa harga optimal untuk memaksimalkan Pendapatan Total?
harga_range = np.linspace(80, 150, 71)
pred_units = model_slope[0] * harga_range + model_slope[1]
pendapatan_simulasi = harga_range * pred_units
harga_optimal = harga_range[np.argmax(pendapatan_simulasi)]

print("=== HASIL EKSEKUSI TAKSONOMI ANALITIK 4-TINGKAT ===")
print(f"1. Deskriptif : Total Omzet Tahunan = Rp {total_omzet:,.0f}")
print(f"2. Diagnostik  : Elastisitas Harga Rata-rata = {elastisitas:.2f} (Sensitif terhadap harga)")
print(f"3. Prediktif   : Estimasi Unit pada Harga Rp 130 = {pred_unit_130:.0f} unit")
print(f"4. Preskriptif : Rekomendasi Harga Optimal = Rp {harga_optimal:.0f} (Maksimalkan Revenue)")
`,
        expectedOutput: "Status eksekusi: Seluruh 4 tingkat taksonomi analitik berhasil dihitung secara empiris.",
        codeExplanation: "Kode mengimplementasikan empat tingkat analitik secara konkret: perhitungan agregat historis, estimasi elastisitas diagnostik, regresi prediktif, dan optimasi pendapatan preskriptif.",
        pitfalls: [
          "Terjebak hanya pada analitik deskriptif berulang tanpa memberikan wawasan diagnostik atau preskriptif.",
          "Menerapkan analitik prediktif kompleks ketika masalah dapat diselesaikan dengan agregasi diagnostik sederhana."
        ],
        refTitle: "Pandas Documentation: Computational Tools & Grouping",
        refUrl: "https://pandas.pydata.org/docs/user_guide/computation.html",
        refProvider: "PyData"
      },
      {
        num: "1.5",
        slug: "1-5-etika-data-privasi-pengguna-dan-kepatuhan-regulasi-gdpr-uu-pdp",
        title: "1.5. Etika Data, Privasi Pengguna, dan Kepatuhan Regulasi (GDPR & UU PDP)",
        desc: "Prinsip perlindungan data pribadi, anonimisasi (k-Anonymity, l-Diversity), hak subjek data, dan implementasi kepatuhan hukum.",
        objectives: [
          "Memahami kewajiban hukum pengolahan data pribadi berdasarkan regulasi GDPR dan UU PDP No. 27/2022",
          "Menerapkan teknik de-identifikasi data: masking, hashing, enkripsi tokenisasi, dan pseudonimisasi",
          "Mengevaluasi risiko kebocoran identitas menggunakan metrik k-anonymity"
        ],
        prereqs: ["Siklus Hidup Analisis Data (1.1)"],
        conceptDefinition: 
          "Analis data memiliki tanggung jawab moral dan hukum terhadap informasi pribadi yang dikelolanya. Pemberlakuan regulasi ketat seperti General Data Protection Regulation (GDPR) di Uni Eropa dan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022) di Indonesia mengubah paradigma pemrosesan data: privasi bukan lagi fitur opsional, melainkan kewajiban mutlak (privacy by design).\n\n" +
          "Data pribadi mencakup Personally Identifiable Information (PII) langsung (nama, NIK, nomor telepon) dan quasi-identifiers (kombinasi kode pos, tanggal lahir, jenis kelamin) yang dapat digunakan untuk merekonstruksi identitas individu.\n\n" +
          "Praktisi data wajib menerapkan teknik reduksi risiko seperti pseudonimisasi, agregasi tingkat tinggi, dan pembuangan atribut yang tidak relevan dengan tujuan analitik (prinsip data minimization).",
        mechanics: 
          "Pipeline pembersihan data harus menyaring dan mengenkripsi data PII sebelum disimpan dalam repositori analitik. Dalam k-Anonymity, setiap kombinasi quasi-identifier dalam dataset harus identik untuk setidaknya k individu yang berbeda.",
        formulaLatex: "\\forall Q \\in \\mathcal{D}, \\quad |\\{i : Q_i = Q\\}| \\ge k",
        formulaDesc: "Definisi matematis k-Anonymity: setiap kelompok kuasi-identifikator Q memiliki frekuensi minimal k baris.",
        code: 
`# =====================================================================
# Program: Pipeline Anonimisasi Data PII & Pengujian k-Anonymity
# Deskripsi: Masking nomor telepon, hashing identitas, dan audit k-anonymity
# =====================================================================
import hashlib
import pandas as pd

# 1. Dataset mentah dengan data PII sensitif
raw_users = pd.DataFrame({
    "Nama": ["Budi Santoso", "Siti Aminah", "Ahmad Fauzi", "Dewi Lestari"],
    "NIK": ["3171012304850001", "3273024508900002", "3171012304850003", "3273024508900004"],
    "Kota": ["Jakarta", "Bandung", "Jakarta", "Bandung"],
    "Tahun_Lahir": [1985, 1990, 1985, 1990],
    "Diagnosa": ["Hipertensi", "Diabetes", "Normal", "Hipertensi"]
})

# 2. Fungsi Hashing satu arah untuk NIK (Pseudonimisasi)
def hash_pii(val: str) -> str:
    return hashlib.sha256(val.encode('utf-8')).hexdigest()[:12]

# 3. Transformasi kepatuhan privasi (Privacy-Preserving Pipeline)
anonymized_df = raw_users.copy()
anonymized_df["User_Hash"] = anonymized_df["NIK"].apply(hash_pii)
anonymized_df = anonymized_df.drop(columns=["Nama", "NIK"])

# 4. Audit k-Anonymity pada kuasi-identifikator (Kota + Tahun_Lahir)
quasi_identifiers = ["Kota", "Tahun_Lahir"]
group_counts = anonymized_df.groupby(quasi_identifiers).size().reset_index(name="k_frekuensi")
k_minimum = group_counts["k_frekuensi"].min()

print("=== DATASET SETELAH ANONIMISASI PII ===")
print(anonymized_df.to_string(index=False))
print(f"\\nNilai k-Anonymity Terpenuhi: k = {k_minimum} (Setiap kelompok memiliki minimal {k_minimum} observasi)")
`,
        expectedOutput: "Status eksekusi: Pipeline anonimisasi PII dan audit k-anonymity selesai tanpa galat.",
        codeExplanation: "Skrip menghapus nama dan NIK asli, menggantinya dengan hash satu arah deterministik, serta menghitung nilai k-anonymity pada kombinasi atribut kuasi.",
        pitfalls: [
          "Menganggap menghapus nama sudah cukup, padahal kombinasi tanggal lahir + kode pos + jenis kelamin dapat mengidentifikasi 87% populasi (Sweeney, 2000).",
          "Menyimpan kunci dekripsi atau salt hashing di dalam repositori kode publik."
        ],
        refTitle: "Python Standard Library Documentation: hashlib module",
        refUrl: "https://docs.python.org/3/library/hashlib.html",
        refProvider: "Python Software Foundation"
      },
      {
        num: "1.6",
        slug: "1-6-strategi-pengumpulan-data-primer-vs-sekunder-dalam-ekosistem-enterprise",
        title: "1.6. Strategi Pengumpulan Data Primer vs Sekunder dalam Ekosistem Enterprise",
        desc: "Metodologi penarikan data transaksi internal, log klik streaming, API pihak ketiga, scraping etis, dan survei konsumen.",
        objectives: [
          "Membedakan karakteristik reliabilitas dan biaya data primer vs sekunder",
          "Merancang skema penangkapan data klik (clickstream telemetry) yang efisien",
          "Menerapkan mekanisme etis pengambilan data melalui REST API berotentikasi"
        ],
        prereqs: ["Etika Data dan Privasi (1.5)"],
        conceptDefinition: 
          "Data merupakan bahan bakar seluruh proses analitik. Berdasarkan sumber perolehannya, data diklasifikasikan menjadi data primer (dikumpulkan langsung oleh organisasi untuk tujuan tertentu) dan data sekunder (data yang telah dikumpulkan oleh entitas lain seperti sensus pemerintah, publikasi industri, atau agregator komersial).\n\n" +
          "Dalam ekosistem enterprise modern, pengumpulan data primer mencakup integrasi event logging pada aplikasi seluler, data transaksi basis data relasional (OLTP), dan telemetri perangkat IoT. Sementara data sekunder sering dimanfaatkan sebagai variabel pengaya (enrichment features) seperti data cuaca, indeks inflasi, atau benchmark kompetitor.\n\n" +
          "Pemilihan strategi akuisisi data harus mempertimbangkan trade-off antara biaya pengumpulan, kebaruan (latency), akurasi, dan hak kepemilikan data (data provenance).",
        mechanics: 
          "Pengumpulan data primer modern menggunakan antrean pesan asinkron (seperti Apache Kafka) untuk menangani jutaan event per detik, memvalidasi skema data masukan, dan mendistribusikannya ke data lake.",
        formulaLatex: "\\text{Data Value Score} = \\frac{\\text{Akurasi} \\times \\text{Relevansi}}{\\text{Biaya Akuisisi} + \\text{Latensi Akses}}",
        formulaDesc: "Rasio heuristik penentuan nilai ekonomis pengumpulan dataset baru.",
        code: 
`# =====================================================================
# Program: Simulator Akuisisi Data Telemetri Transaksi Real-Time
# Deskripsi: Mengolah stream event transaksi primer dan validasi integritas
# =====================================================================
import json
import time
import pandas as pd

# 1. Simulator event stream mentah (masukan format JSON)
raw_events = [
    '{"event_id": "evt_001", "user_id": 101, "action": "add_to_cart", "item": "Laptop", "amount": 12500000}',
    '{"event_id": "evt_002", "user_id": 102, "action": "view_page",   "item": "Mouse",  "amount": 0}',
    '{"event_id": "evt_003", "user_id": 101, "action": "checkout",    "item": "Laptop", "amount": 12500000}'
]

# 2. Parsing dan validasi skema data primer
parsed_records = []
for evt_str in raw_events:
    evt = json.loads(evt_str)
    # Validasi integritas: pastikan nominal tidak bernilai negatif
    if evt.get("amount", 0) >= 0:
        evt["timestamp"] = "2026-09-16T12:00:00Z"
        parsed_records.append(evt)

# 3. Transformasi menjadi DataFrame analitik terstruktur
df_telemetry = pd.DataFrame(parsed_records)
print("=== TABEL HASIL INGESTION DATA PRIMER TELEMETRI ===")
print(df_telemetry[["event_id", "user_id", "action", "amount", "timestamp"]].to_string(index=False))
`,
        expectedOutput: "Status eksekusi: Ingestion data telemetri berhasil terstruktur.",
        codeExplanation: "Kode memvalidasi dan memproses data event streaming mentah dalam format JSON menjadi bentuk tabular yang siap untuk dieksplorasi lebih lanjut.",
        pitfalls: [
          "Mengumpulkan seluruh data mentah tanpa strategi filtering sehingga membebani media penyimpanan tanpa nilai guna nyata (data hoarding).",
          "Mengandalkan data sekunder pihak ketiga tanpa memeriksa reliabilitas dan tanggal pembaharuan terakhir."
        ],
        refTitle: "Python Standard Library Documentation: json module",
        refUrl: "https://docs.python.org/3/library/json.html",
        refProvider: "Python Software Foundation"
      },
      {
        num: "1.7",
        slug: "1-7-dokumentasi-kamus-data-data-dictionary-dan-metadata-management",
        title: "1.7. Dokumentasi Kamus Data (Data Dictionary) dan Metadata Management",
        desc: "Standarisasi kamus data, lineage data end-to-end, dan pemeliharaan katalog data enterprise.",
        objectives: [
          "Menyusun kamus data teknis dan bisnis yang komprehensif untuk dataset enterprise",
          "Memahami arsitektur metadata (business, technical, and operational metadata)",
          "Melacak silsilah data (data lineage) dari tabel sumber hingga laporan visual"
        ],
        prereqs: ["Siklus Hidup Analisis Data (1.1)"],
        conceptDefinition: 
          "Kamus data (Data Dictionary) adalah katalog terpusat yang mendokumentasikan definisi, tipe data, rentang nilai valid, dan aturan bisnis dari setiap kolom dalam gudang data. Tanpa dokumentasi yang ketat, tim analitik sering mengalami miskomunikasi—misalnya, apakah kolom 'active_user' dihitung berdasarkan login 7 hari terakhir atau 30 hari terakhir.\n\n" +
          "Metadata management mencakup tiga pilar: metadata bisnis (definisi istilah, pemilik data), metadata teknis (tipe kolom, batasan relasi, indeks), dan metadata operasional (waktu refresh terakhir, jumlah baris, durasi eksekusi kueri).\n\n" +
          "Data lineage memungkinkan analis melacak asal-usul setiap metrik: dari mana angka pendapatan berasal, tabel perantara apa yang melakukan transformasi, dan dasbor mana saja yang mengonsumsi angka tersebut.",
        mechanics: 
          "Kamus data modern dikelola dalam bentuk format tabular atau terintegrasi dengan alat data catalog seperti dbt, Alation, atau Amundsen. Setiap perubahan skema tabel wajib memperbarui kamus data melalui pipeline CI/CD.",
        formulaLatex: "\\text{Completeness Score} = \\frac{\\sum_{j=1}^m \\mathbb{I}(\\text{Col}_j \\text{ terdokumentasi lengkap})}{m} \\times 100\\%",
        formulaDesc: "Persentase kelengkapan dokumentasi metadata terhadap total m kolom dalam sistem database.",
        code: 
`# =====================================================================
# Program: Pembuatan Kamus Data Otomatis (Automated Data Dictionary)
# Deskripsi: Menginspeksi metadata teknis DataFrame dan melampirkan definisi bisnis
# =====================================================================
import pandas as pd

# 1. Sampel dataset transaksi
df_sample = pd.DataFrame({
    "transaksi_id": [1001, 1002, 1003],
    "user_id": [501, 502, 503],
    "nominal_belanja": [150000.0, 75000.5, 320000.0],
    "metode_bayar": ["QRIS", "Transfer", "Kartu Kredit"],
    "is_success": [True, True, False]
})

# 2. Definisi bisnis resmi dari data governance team
business_definitions = {
    "transaksi_id": "Kunci primer unik setiap transaksi checkout.",
    "user_id": "Kunci asing merujuk ke tabel dim_user.",
    "nominal_belanja": "Nilai kotor transaksi dalam mata uang Rupiah.",
    "metode_bayar": "Instrumen pembayaran (QRIS, Transfer, Kartu Kredit).",
    "is_success": "Indikator boolean keberhasilan settlement pembayaran."
}

# 3. Bentuk Kamus Data Otomatis
dictionary_rows = []
for col in df_sample.columns:
    dictionary_rows.append({
        "Nama_Kolom": col,
        "Tipe_Data": str(df_sample[col].dtype),
        "Non_Null_Count": df_sample[col].count(),
        "Contoh_Nilai": str(df_sample[col].iloc[0]),
        "Definisi_Bisnis": business_definitions.get(col, "Belum terdokumentasi")
    })

df_dictionary = pd.DataFrame(dictionary_rows)
print("=== KAMUS DATA RESMI ENTERPRISE ===")
print(df_dictionary.to_string(index=False))
`,
        expectedOutput: "Status eksekusi: Kamus data berhasil diekstraksi dan dicetak.",
        codeExplanation: "Skrip secara dinamis mengekstrak metadata teknis dari objek DataFrame dan menggabungkannya dengan kamus istilah bisnis resmi.",
        pitfalls: [
          "Membiarkan dokumentasi kamus data kedaluwarsa setelah terjadi perubahan struktur tabel produksi.",
          "Menulis definisi kolom yang hanya mengulang nama kolom (misal: mendefinisikan 'user_id' hanya sebagai 'id user')."
        ],
        refTitle: "Pandas Documentation: Essential Basic Functionality (dtypes & info)",
        refUrl: "https://pandas.pydata.org/docs/user_guide/basics.html",
        refProvider: "PyData"
      },
      {
        num: "1.8",
        slug: "1-8-penilaian-kualitas-data-dimensi-validitas-akurasi-kelengkapan-konsistensi",
        title: "1.8. Penilaian Kualitas Data: Dimensi Validitas, Akurasi, Kelengkapan, dan Konsistensi",
        desc: "Framework audit kualitas data formal: 6 dimensi DAMA (Completeness, Accuracy, Validity, Consistency, Uniqueness, Timeliness).",
        objectives: [
          "Menerapkan 6 dimensi kualitas data standar DAMA International pada dataset bisnis",
          "Membangun aturan validasi otomatis (validation assertions) dengan ambang batas toleransi",
          "Menghitung skor indeks kualitas data komprehensif (Data Quality Score)"
        ],
        prereqs: ["Dokumentasi Kamus Data (1.7)"],
        conceptDefinition: 
          "Kualitas data adalah tingkat kesesuaian data terhadap tujuan penggunaannya (fitness for use). Keputusan bisnis yang diambil dari data berkualitas buruk akan menghasilkan kerugian finansial yang signifikan—sebuah prinsip yang dikenal sebagai 'Garbage In, Garbage Out' (GIGO).\n\n" +
          "DAMA International merumuskan enam dimensi utama kualitas data: (1) Kelengkapan (Completeness) - tidak ada nilai yang hilang secara tidak wajar; (2) Akurasi (Accuracy) - nilai mencerminkan fakta dunia nyata; (3) Validitas (Validity) - nilai mematuhi format dan aturan sintaks domain; (4) Konsistensi (Consistency) - tidak ada pertentangan informasi lintas tabel; (5) Keunikan (Uniqueness) - tidak ada entitas duplikat; dan (6) Ketepatan Waktu (Timeliness) - data mutakhir saat dianalisis.\n\n" +
          "Melakukan audit kualitas secara berkala memungkinkan analis mendeteksi kerusakan pada pipeline data hulu sebelum laporan disampaikan kepada pemangku kepentingan.",
        mechanics: 
          "Audit kualitas data dijalankan melalui pengujian assertion otomatis: memvalidasi persentase null, memeriksa nilai berada di dalam rentang yang diizinkan (misalnya umur antara 0-120), dan memastikan foreign key constraints terpenuhi.",
        formulaLatex: "\\text{DQI} = \\frac{1}{6} \\left( S_{\\text{comp}} + S_{\\text{acc}} + S_{\\text{val}} + S_{\\text{cons}} + S_{\\text{uniq}} + S_{\\text{time}} \\right)",
        formulaDesc: "Indeks Kualitas Data (DQI) komposit dari rata-rata normalisasi 6 dimensi DAMA.",
        code: 
`# =====================================================================
# Program: Audit 6 Dimensi Kualitas Data (DAMA Framework)
# Deskripsi: Mengukur skor kelengkapan, keunikan, dan validitas rentang nilai
# =====================================================================
import pandas as pd
import numpy as np

# 1. Dataset transaksi dengan anomali kualitas
df_audit = pd.DataFrame({
    "transaksi_id": [1, 2, 3, 3, 5],                 # Duplikat id=3
    "email": ["user1@mail.com", None, "user3@mail.com", "user3@mail.com", "invalid_email"],
    "usia": [25, 34, 150, 34, -5],                    # Anomali usia 150 dan -5
    "skor_transaksi": [100, 200, 150, 150, 300]
})

# 2. Pengukuran Dimensi
# a. Kelengkapan (Completeness) pada kolom email
completeness_score = (df_audit["email"].notnull().sum() / len(df_audit)) * 100

# b. Keunikan (Uniqueness) pada transaksi_id
uniqueness_score = (df_audit["transaksi_id"].nunique() / len(df_audit)) * 100

# c. Validitas (Validity) pada rentang usia (0 <= usia <= 100)
valid_usia_count = df_audit["usia"].between(0, 100).sum()
validity_score = (valid_usia_count / len(df_audit)) * 100

print("=== SKOR AUDIT KUALITAS DATA ENTERPRISE ===")
print(f"1. Kelengkapan Email : {completeness_score:.1f}%")
print(f"2. Keunikan ID       : {uniqueness_score:.1f}%")
print(f"3. Validitas Usia    : {validity_score:.1f}%")
print(f"Indeks Rata-rata     : {((completeness_score + uniqueness_score + validity_score) / 3):.1f}%")
`,
        expectedOutput: "Status eksekusi: Audit skor kualitas data berhasil dihitung.",
        codeExplanation: "Skrip mengevaluasi dataset secara kuantitatif berdasarkan tiga dimensi kualitas data utama DAMA: completeness, uniqueness, dan validity.",
        pitfalls: [
          "Hanya memeriksa kelengkapan (missing values) namun mengabaikan validitas semantik (seperti angka nominal negatif atau email tanpa simbol @).",
          "Menghapus baris bermasalah secara langsung tanpa menginvestigasi sumber kerusakan sistem di hulu."
        ],
        refTitle: "Kaggle Learn: Data Cleaning - Handling Missing Values & Inconsistent Data",
        refUrl: "https://www.kaggle.com/learn/data-cleaning",
        refProvider: "Kaggle / Google"
      },
      {
        num: "1.9",
        slug: "1-9-kolaborasi-antar-fungsi-menjembatani-tim-teknis-dan-pemangku-kepentingan-bisnis",
        title: "1.9. Kolaborasi Antar-Fungsi: Menjembatani Tim Teknis dan Pemangku Kepentingan Bisnis",
        desc: "Komunikasi data efektif, manajemen ekspektasi stakeholder, penerjemahan jargon teknis, dan perancangan feedback loop.",
        objectives: [
          "Menerjemahkan hasil statistik teknis menjadi narasi bisnis yang dapat dipahami eksekutif",
          "Mengelola ekspektasi pemangku kepentingan melalui komunikasi berkala berbasis deliverable",
          "Merancang matriks RACI untuk kejelasan peran dalam proyek analitik kolaboratif"
        ],
        prereqs: ["Siklus Hidup Analisis Data (1.1)"],
        conceptDefinition: 
          "Kegagalan proyek data analytics paling sering bukan disebabkan oleh kesalahan algoritma, melainkan oleh jurang komunikasi antara analis teknis dan pemangku kepentingan bisnis (business stakeholders). Analis cenderung memaparkan metrik statistik teknis seperti p-value, R-squared, atau arsitektur transformer, sementara eksekutif hanya peduli pada tiga hal: pendapatan, biaya, dan risiko.\n\n" +
          "Komunikasi analitik yang efektif menuntut kemampuan 'translasi ganda': pertama, menerjemahkan kebutuhan bisnis yang samar menjadi kueri dan model data matematis yang presisi; kedua, menerjemahkan output angka numerik kembali menjadi narasi tindakan bisnis yang jelas.\n\n" +
          "Penerapan matriks RACI (Responsible, Accountable, Consulted, Informed) memastikan setiap pemangku kepentingan mengetahui perannya, meminimalkan friksi politik organisasi, dan mempercepat adopsi wawasan data.",
        mechanics: 
          "Presentasi hasil analisis harus mengikuti piramida Minto (The Minto Pyramid Principle): mulai dengan kesimpulan utama (rekomendasi aksi), diikuti oleh argumen pendukung logis, dan diakhiri dengan data rincian teknis sebagai lampiran pembuktian.",
        formulaLatex: "\\text{Adoption Rate} = \\frac{\\text{Keputusan yang Menerapkan Insight}}{\\text{Total Rekomendasi Analitik}} \\times 100\\%",
        formulaDesc: "Metrik keberhasilan kolaborasi data: persentase rekomendasi analitik yang dieksekusi tim bisnis.",
        code: 
`# =====================================================================
# Program: Matriks RACI Kolaborasi Proyek Data Analytics
# Deskripsi: Mengatur akuntabilitas peran lintas tim teknis dan bisnis
# =====================================================================
import pandas as pd

raci_matrix = pd.DataFrame({
    "Tahap_Proyek": [
        "Definisi Masalah Bisnis",
        "Pembersihan & Ekstraksi Data",
        "Analisis Statistik & Eksplorasi",
        "Penyusunan Rekomendasi Bisnis",
        "Penerapan Aksi Operasional"
    ],
    "Business_Lead":    ["Accountable", "Informed",    "Consulted",   "Accountable", "Responsible"],
    "Data_Analyst":     ["Responsible", "Responsible", "Responsible", "Responsible", "Consulted"],
    "Data_Engineer":    ["Informed",    "Accountable", "Informed",    "Informed",    "Informed"],
    "Product_Manager":  ["Consulted",   "Informed",    "Consulted",   "Consulted",   "Accountable"]
})

print("=== MATRIKS RACI TATA KELOLA PROYEK DATA ===")
print(raci_matrix.to_string(index=False))
`,
        expectedOutput: "Status eksekusi: Matriks RACI berhasil dimodelkan.",
        codeExplanation: "Skrip mendefinisikan pembagian tanggung jawab peran RACI lintas fungsi untuk memastikan transparansi dan koordinasi kerja tim data yang efektif.",
        pitfalls: [
          "Mempresentasikan dashboard dengan puluhan grafik tanpa menyertakan kesimpulan atau rekomendasi tindakan konkret.",
          "Menggunakan istilah teknis statistika yang membingungkan audiens bisnis non-teknis."
        ],
        refTitle: "Python Data Science Handbook: Practical Machine Learning & Communication",
        refUrl: "https://jakevdp.github.io/PythonDataScienceHandbook/",
        refProvider: "O'Reilly Media"
      },
      {
        num: "1.10",
        slug: "1-10-evaluasi-dampak-bisnis-dan-penentuan-return-on-investment-roi-proyek-data",
        title: "1.10. Evaluasi Dampak Bisnis dan Penentuan Return on Investment (ROI) Proyek Data",
        desc: "Kuantifikasi nilai finansial proyek data: perhitungan incremental revenue, cost savings, payback period, dan post-implementation review.",
        objectives: [
          "Menghitung Return on Investment (ROI) dan Net Present Value (NPV) dari implementasi inisiatif data",
          "Mengisolasi dampak inkremental proyek analitik dari faktor eksternal musiman",
          "Menyusun dokumen Post-Implementation Review (PIR) untuk pembelajaran siklus proyek berikutnya"
        ],
        prereqs: ["Kolaborasi Antar-Fungsi (1.9)"],
        conceptDefinition: 
          "Setiap inisiatif data analytics dalam perusahaan harus dapat dibuktikan kelayakan finansialnya. Pemimpin bisnis menuntut justifikasi investasi terhadap biaya lisensi server, infrastruktur cloud data warehouse, dan gaji tim data. Oleh karena itu, analis data senior wajib menguasai kuantifikasi dampak bisnis (business value attribution).\n\n" +
          "Dampak analitik umumnya terbagi menjadi dua kategori: peningkatan pendapatan (incremental revenue generation)—misalnya melalui optimasi konversi kampanye atau strategi harga dinamis; dan efisiensi biaya (cost reduction)—seperti otomatisasi pelaporan manual atau pengurangan churn pelanggan.\n\n" +
          "Evaluasi paska-implementasi (Post-Implementation Review) mengukur apakah proyeksi keuntungan yang dijanjikan pada tahap awal benar-benar terealisasi setelah sistem diterapkan selama 3 hingga 6 bulan di lingkungan produksi.",
        mechanics: 
          "ROI dihitung dengan membagi keuntungan bersih tambahan (Net Financial Benefit) dengan total biaya investasi proyek data (Total Cost of Ownership - TCO).",
        formulaLatex: "\\text{ROI} = \\frac{\\text{Keuntungan Bersih Inkremental} - \\text{Biaya Proyek}}{\\text{Biaya Proyek}} \\times 100\\%",
        formulaDesc: "Rumus baku persentase Return on Investment proyek data analytics.",
        code: 
`# =====================================================================
# Program: Kalkulator Evaluasi Finansial & ROI Proyek Data Analytics
# Deskripsi: Menghitung Net Benefit, ROI (%), dan Payback Period (Bulan)
# =====================================================================
import pandas as pd

# 1. Komponen biaya investasi proyek data (Capex + Opex Tahun Pertama)
biaya_cloud_infra = 45000000     # Server Data Warehouse (Rp)
biaya_lisensi_bi  = 25000000     # Lisensi BI Tool (Rp)
biaya_alokasi_tim = 80000000     # Alokasi SDM Data Analyst (Rp)
total_biaya = biaya_cloud_infra + biaya_lisensi_bi + biaya_alokasi_tim

# 2. Dampak finansial terverifikasi pasca-implementasi (Tahun Pertama)
penghematan_biaya_operasional = 60000000    # Otomasi reporting manual
tambahan_omzet_dari_insight  = 150000000   # Rekomendasi kenaikan konversi
total_manfaat = penghematan_biaya_operasional + tambahan_omzet_dari_insight

# 3. Kalkulasi ROI dan Payback Period
keuntungan_bersih = total_manfaat - total_biaya
roi_persen = (keuntungan_bersih / total_biaya) * 100
manfaat_bulanan = total_manfaat / 12
payback_period_bulan = total_biaya / manfaat_bulanan

print("=== EVALUASI LABA INVESTASI (ROI) PROYEK DATA ===")
print(f"Total Biaya Investasi (TCO) : Rp {total_biaya:,.0f}")
print(f"Total Manfaat Finansial     : Rp {total_manfaat:,.0f}")
print(f"Keuntungan Bersih (Net Gain): Rp {keuntungan_bersih:,.0f}")
print(f"Return on Investment (ROI)  : {roi_persen:.1f}%")
print(f"Payback Period              : {payback_period_bulan:.1f} Bulan")
`,
        expectedOutput: "Status eksekusi: Evaluasi ROI dan Payback Period berhasil dihitung.",
        codeExplanation: "Skrip menghitung analisis kelayakan investasi proyek data dengan membandingkan total biaya kepemilikan terhadap keuntungan inkremental.",
        pitfalls: [
          "Mengklaim seluruh kenaikan pendapatan sebagai hasil model analitik tanpa mengontrol variabel eksternal pasar atau promosi marketing.",
          "Hanya menghitung biaya lisensi perangkat lunak namun melupakan biaya pemeliharaan dan alokasi jam kerja tim."
        ],
        refTitle: "OSSU Data Science: Final Project Assessment Criteria",
        refUrl: "https://github.com/ossu/data-science",
        refProvider: "Open Source Society University"
      }
    ]
  }
];

console.log("Chapter 1 data structure ready.");
