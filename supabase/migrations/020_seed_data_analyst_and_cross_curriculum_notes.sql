-- ============================================================
-- Migration 020: Seed Data Analyst & Cross-Curriculum Notes
-- Materi Bersumber Lengkap dari Modul Pelatihan Data Analyst (Bagian I & II)
-- dan Modul Komprehensif Data Analytics dengan Python (148 Halaman)
-- Velqora Knowledge Base
-- ============================================================

ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE IF EXISTS notes ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'BookOpen';

DO $$
DECLARE
  v_user_id UUID;
  v_parent_ai_id UUID;
  v_cat_da UUID;
  v_cat_nlp UUID;
  v_cat_ts UUID;
  v_cat_ml UUID;
  v_has_icon BOOLEAN;
  v_has_parent BOOLEAN;
BEGIN
  -- Dapatkan user id
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'wahyualdiriyanto80@gmail.com' LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'icon'
  ) INTO v_has_icon;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'parent_id'
  ) INTO v_has_parent;

  -- Kategori Induk Kecerdasan Buatan
  SELECT id INTO v_parent_ai_id FROM categories WHERE name = 'Kecerdasan Buatan' LIMIT 1;
  IF v_parent_ai_id IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (''Kecerdasan Buatan'', ''#8B5CF6'', ''machine_learning'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_parent_ai_id;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Kecerdasan Buatan', '#8B5CF6', v_user_id) RETURNING id INTO v_parent_ai_id;
    END IF;
  END IF;

  -- 1. Kategori Data Analyst
  SELECT id INTO v_cat_da FROM categories WHERE name = 'Data Analyst' LIMIT 1;
  IF v_cat_da IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (''Data Analyst'', ''#06B6D4'', ''data_analyst'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_da;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (''Data Analyst'', ''#06B6D4'', ''data_analyst'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_da;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Data Analyst', '#06B6D4', v_user_id) RETURNING id INTO v_cat_da;
    END IF;
  END IF;

  -- 2. Kategori Natural Language Processing
  SELECT id INTO v_cat_nlp FROM categories WHERE name = 'Natural Language Processing' LIMIT 1;

  -- 3. Kategori Time Series Forecasting & Anomaly Detection
  SELECT id INTO v_cat_ts FROM categories WHERE name = 'Time Series Forecasting & Anomaly Detection' LIMIT 1;

  -- 4. Kategori Machine Learning
  SELECT id INTO v_cat_ml FROM categories WHERE name = 'Machine Learning' LIMIT 1;

  -- ============================================================
  -- SEED CATATAN DATA ANALYST (14 BAB LENGKAP)
  -- ============================================================

  -- BAB 1: Dasar Peran Data Analyst
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Dasar Peran Data Analyst',
    'bab-1-dasar-peran-data-analyst',
    $NOTE_CONTENT$# BAB 1: Dasar Peran Data Analyst

## Tujuan Pembelajaran
Setelah menyelesaikan bab ini, Anda mampu:
- Menjelaskan definisi dan cakupan tanggung jawab seorang Data Analyst secara komprehensif.
- Membedakan peran Data Analyst, Data Scientist, dan Data Engineer, termasuk bagaimana ketiganya berkolaborasi dalam satu tim data terpadu.
- Memahami dan mempraktikkan siklus kerja analisis data end-to-end pada studi kasus nyata.

---

## 1.1 Definisi & Tanggung Jawab Data Analyst

### Apa Itu Data Analyst?
**Data Analyst** adalah profesional yang bertugas mengumpulkan, membersihkan, mengolah, dan menginterpretasikan data untuk menjawab pertanyaan bisnis spesifik dan mendukung pengambilan keputusan.
> **Inti Peran:** Data Analyst mengubah data mentah menjadi *actionable insight* (wawasan yang dapat langsung ditindaklanjuti).

Peran ini lahir dari kebutuhan nyata organisasi yang memiliki timbunan data mentah (transaksi, log aplikasi, survei pelanggan, data operasional) tetapi membutuhkan kejelasan atas pertanyaan strategis seperti *"Mengapa penjualan bulan ini turun?"* atau *"Channel marketing mana yang menghasilkan ROI tertinggi?"*.

### 8 Tanggung Jawab Utama Data Analyst:
1. **Mengumpulkan data dari berbagai sumber**: database transaksional, API pihak ketiga, file Excel/CSV, data log, hingga event tracking aplikasi.
2. **Membersihkan & memvalidasi data**: menangani missing values, duplikasi, format tidak konsisten, dan anomali outlier.
3. **Melakukan Exploratory Data Analysis (EDA)**: mencari pola, tren, korelasi, dan anomali sebelum melangkah ke pemodelan.
4. **Menjawab pertanyaan bisnis dengan data**: menerapkan analisis statistik deskriptif maupun inferensial.
5. **Membuat visualisasi & dashboard**: menyajikan temuan kompleks dalam bentuk visual intuitif yang mudah dicerna audiens non-teknis.
6. **Menulis laporan & storytelling**: bukan sekadar menampilkan angka, melainkan merangkai narasi bisnis yang menjawab pertanyaan *"So What?"*.
7. **Memantau metrik & KPI**: memastikan dashboard operasional tetap akurat, konsisten, dan relevan seiring waktu.
8. **Berkolaborasi lintas tim**: bekerja sama dengan tim produk, pemasaran, keuangan, hingga rekayasa perangkat lunak untuk memahami konteks bisnis di balik data.

### Hard Skill vs Soft Skill
| Kategori | Keterampilan Utama |
| :--- | :--- |
| **Hard Skill** | SQL, Excel/Google Sheets, Python (Pandas, NumPy) atau R, statistik dasar, tools BI (Tableau, Power BI, Metabase). |
| **Soft Skill** | Rasa ingin tahu (*curiosity*), berpikir kritis (*critical thinking*), komunikasi non-teknis, *business acumen*, ketelitian tinggi. |

> **Catatan Praktisi:** Kemampuan teknis hanyalah separuh dari pekerjaan. Separuh lainnya adalah kemampuan mengajukan *pertanyaan yang tepat* sebelum menulis query SQL, serta menyampaikan hasil temuan kepada pemangku kepentingan yang tidak memahami statistik.

### Ekosistem Tools Data Analyst
- **Data Warehouse / Storage**: BigQuery, Snowflake, Redshift, PostgreSQL.
- **Query & Transformasi**: SQL, dbt.
- **Spreadsheet**: Excel, Google Sheets.
- **Pemrograman**: Python (pandas, numpy), R.
- **Visualisasi & BI**: Tableau, Power BI, Looker, Metabase.
- **AI-Augmented**: GitHub Copilot, ChatGPT/Claude untuk drafting query dan eksplorasi data.

---

## 1.2 Perbedaan Data Analyst, Data Scientist, dan Data Engineer

| Dimensi | Data Analyst | Data Scientist | Data Engineer |
| :--- | :--- | :--- | :--- |
| **Pertanyaan Inti** | *"Apa yang terjadi & mengapa?"* | *"Apa yang akan terjadi & rekomendasi terbaik apa?"* | *"Bagaimana data bisa tersedia, bersih, dan reliable?"* |
| **Fokus Utama** | Analisis deskriptif & diagnostik | Prediktif & preskriptif (Machine Learning) | Infrastruktur data, data pipeline, ETL/ELT |
| **Output Utama** | Dashboard, laporan, actionable insight | Model prediksi, eksperimen A/B testing | Pipeline data warehouse, data lakehouse |
| **Tools Utama** | SQL, Excel, Python/Pandas, Power BI | Python/R, Scikit-Learn, PyTorch, XGBoost | Python/Scala, Spark, Apache Airflow, dbt, Kafka |
| **Statistika** | Deskriptif & inferensial dasar | Statistik lanjutan, kalkulus, deep learning | Sistem terdistribusi, rekayasa software |
| **Horizon Waktu** | Jawaban cepat (harian – mingguan) | Proyek riset (mingguan – bulanan) | Infrastruktur jangka panjang (bulanan – tahunan) |

### Contoh Kasus: *"Kenapa Revenue Bulan Maret Turun?"*
Ketiga peran mendekati masalah ini secara sinergis:
1. **Data Analyst**: Menarik query SQL agregasi revenue per wilayah penjualan untuk melihat wilayah mana yang drop paling tajam.
2. **Data Scientist**: Menguji signifikansi statistik penurunan tersebut menggunakan uji hipotesis (Welch's t-test) untuk memastikan apakah ini anomali atau fluktuasi normal.
3. **Data Engineer**: Memastikan pipeline data tidak mengalami keterlambatan sinkronisasi data transaksi harian.

---

## 1.3 Siklus Kerja Analisis Data End-to-End
Alur analisis data yang baik bersifat iteratif dan terdiri dari 8 tahapan:
```text
Pertanyaan Bisnis ──> Kumpulkan Data ──> Bersihkan Data ──> EDA
        ▲                                                     │
        │                                                     ▼
    Monitoring  <──  Keputusan & Aksi  <──  Storytelling  <── Analisis & Visualisasi
```

---

## Implementasi Kode Praktikum

### 1. Health-Check Penjualan Harian (SQL & Python)
```sql
-- Query pemeriksaan kesehatan penjualan bulanan
SELECT
    DATE_TRUNC('month', order_date) AS bulan,
    COUNT(DISTINCT order_id) AS jumlah_order,
    SUM(total_amount) AS total_revenue
FROM sales.orders
WHERE order_status = 'completed'
GROUP BY 1
ORDER BY 1;
```

```python
import pandas as pd

# Load dataset penjualan dari data warehouse
df = pd.read_csv('sales_data.csv', parse_dates=['order_date'])

# Audit struktur data awal
print('Struktur Dataset:')
print(df.info())
print('\nMissing Values per Kolom:')
print(df.isna().sum())

# Agregasi tren bulanan
monthly_revenue = (
    df.groupby(df['order_date'].dt.to_period('M'))['total_amount']
    .sum()
    .reset_index(name='total_revenue')
)
print('\nTren Penjualan Bulanan:\n', monthly_revenue)
```

### 2. Siklus Kerja Analisis Data Mini End-to-End
```python
import pandas as pd
import matplotlib.pyplot as plt

# 1. Pertanyaan Bisnis: Kategori produk apa yang mengalami penurunan penjualan >10%?
# 2. Pengumpulan Data
df = pd.read_csv('sales_data.csv', parse_dates=['order_date'])

# 3. Pembersihan Data
df = df.drop_duplicates()
df = df.dropna(subset=['category', 'total_amount'])
df = df[df['total_amount'] > 0] # Filter data anomali nol/negatif

# 4. EDA - Agregasi tren penjualan per kategori
category_trend = (
    df.groupby([df['order_date'].dt.to_period('M'), 'category'])['total_amount']
    .sum()
    .unstack(fill_value=0)
)

# 5. Analisis Perubahan Persentase (3 Bulan Terakhir)
pct_change_3m = category_trend.pct_change(periods=3).iloc[-1]
kategori_menurun = pct_change_3m[pct_change_3m < -0.1].sort_values()

# 6. Storytelling & Rekomendasi
print('Kategori dengan penurunan penjualan >10% dalam 3 bulan terakhir:')
print(kategori_menurun)
```

---

## Latihan Mandiri
1. Ambil satu produk/layanan yang Anda kenal (e-commerce atau startup lokal). Tuliskan 3 pertanyaan bisnis spesifik yang dapat dijawab oleh seorang Data Analyst.
2. Petakan salah satu pertanyaan di atas ke dalam 8 tahap siklus kerja analisis data.
3. Jalankan kode health-check di atas pada data dummy dan jelaskan hasilnya dalam 2-3 kalimat ringkas untuk atasan non-teknis.$NOTE_CONTENT$,
    'BookOpen',
    1,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 2: Fondasi Statistika untuk Analisis Data
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Fondasi Statistika untuk Analisis Data',
    'bab-2-fondasi-statistika-untuk-analisis-data',
    $NOTE_CONTENT$# BAB 2: Fondasi Statistika untuk Analisis Data

## Tujuan Pembelajaran
- Menghitung dan menginterpretasikan ukuran pemusatan dan penyebaran statistik deskriptif.
- Memahami konsep dasar statistik inferensial: populasi, sampel, sampling error, dan confidence interval.
- Mengenali karakteristik distribusi data (Normal, Binomial, Poisson) serta menguji normalitas data.
- Menjalankan uji hipotesis formal (T-Test, Chi-Square, ANOVA) dan menginterpretasikan p-value secara objektif tanpa bias.

---

## 2.1 Statistik Deskriptif

### Ukuran Pemusatan (Central Tendency)
- **Mean (Rata-rata)**: Jumlah semua nilai dibagi total observasi. Sangat sensitif terhadap outlier.
- **Median**: Nilai tengah data yang telah diurutkan. Sangat robust terhadap outlier, ideal untuk data miring (*skewed*) seperti pendapatan atau harga properti.
- **Modus**: Nilai yang paling sering muncul, berguna untuk data kategorikal.

### Ukuran Penyebaran (Dispersion)
- **Range**: Selisih nilai maksimum dan minimum.
- **Variance & Standard Deviation**: Mengukur seberapa jauh data tersebar dari rata-rata.
- **Interquartile Range (IQR)**: Selisih antara kuartil atas (Q3, persentil 75) dan kuartil bawah (Q1, persentil 25). Merupakan fondasi deteksi outlier.

> **Aturan Praktis:** Jika data right-skewed (misalnya gaji atau nilai transaksi), nilai Mean akan tertarik ke atas oleh nilai ekstrem. Dalam situasi ini, gunakan **Median** sebagai representasi nilai tipikal.

---

## 2.2 Statistik Inferensial & Confidence Interval

- **Populasi vs Sampel**: Populasi adalah seluruh subjek yang ingin dipelajari; sampel adalah subset representatif yang diamati.
- **Standard Error (SE)**: Mengukur presisi rata-rata sampel dalam mengestimasi rata-rata populasi.
- **Confidence Interval (CI 95%)**: Rentang estimasi di mana jika pengujian diulang 100 kali, 95 di antaranya memuat parameter populasi sebenarnya.
- **Central Limit Theorem (CLT)**: Distribusi rata-rata sampel akan mendekati distribusi normal seiring bertambahnya ukuran sampel ($n > 30$), terlepas dari bentuk distribusi asal populasinya.

---

## 2.3 Uji Normalitas & Uji Hipotesis

### Kerangka Pengujian Hipotesis
1. **$H_0$ (Hipotesis Nol)**: Asumsi awal status quo, misalnya *"Tidak ada perbedaan revenue antara Region A dan Region B"*.
2. **$H_1$ (Hipotesis Alternatif)**: Pernyataan yang ingin dibuktikan, misalnya *"Ada perbedaan signifikan"*.
3. **p-value**: Probabilitas mendapatkan hasil seekstrem data yang diobservasi jika $H_0$ benar. Jika $p < 0.05$, tolak $H_0$.

### Panduan Memilih Uji Statistik yang Tepat
| Kondisi Analisis | Uji Statistik yang Digunakan |
| :--- | :--- |
| Bandingkan mean 1 sampel dengan nilai acuan | One-sample t-test |
| Bandingkan mean 2 grup independen | Independent t-test (Welch's t-test) |
| Bandingkan mean data berpasangan (sebelum vs sesudah) | Paired t-test |
| Hubungan / asosiasi antar 2 variabel kategorikal | Chi-Square Test of Independence |
| Bandingkan mean lebih dari 2 grup sekaligus | One-Way ANOVA (diikuti Tukey HSD post-hoc) |

---

## Implementasi Kode Praktikum

### 1. Menghitung Statistik Deskriptif & Deteksi Skewness
```python
import pandas as pd
import numpy as np

df = pd.read_csv('sales_data.csv')

# Statistik deskriptif lengkap
print(df['total_amount'].describe())

mean_val = df['total_amount'].mean()
median_val = df['total_amount'].median()
std_val = df['total_amount'].std()
q1, q3 = df['total_amount'].quantile([0.25, 0.75])
iqr = q3 - q1

print(f'Mean: Rp {mean_val:,.0f} | Median: Rp {median_val:,.0f}')
print(f'Std Dev: Rp {std_val:,.0f} | IQR: Rp {iqr:,.0f}')

if mean_val > median_val * 1.2:
    print('Peringatan: Distribusi data right-skewed. Laporkan median untuk angka tipikal!')
```

### 2. Menghitung 95% Confidence Interval
```python
from scipy import stats
import pandas as pd

df = pd.read_csv('sales_data.csv')
sample = df['total_amount'].sample(200, random_state=42)

mean = sample.mean()
sem = stats.sem(sample) # Standard error of the mean
ci_low, ci_high = stats.t.interval(confidence=0.95, df=len(sample)-1, loc=mean, scale=sem)

print(f'Mean Sampel: Rp {mean:,.0f}')
print(f'95% Confidence Interval: (Rp {ci_low:,.0f}, Rp {ci_high:,.0f})')
```

### 3. Uji Normalitas Shapiro-Wilk & Independent Welch's T-Test
```python
from scipy import stats
import pandas as pd

df = pd.read_csv('sales_data.csv')

# 1. Uji Normalitas
stat, p_norm = stats.shapiro(df['total_amount'].dropna().sample(min(len(df), 500), random_state=42))
print(f'Shapiro-Wilk p-value: {p_norm:.4f}')

# 2. Welch''s T-Test: Perbandingan Revenue Region A vs Region B
reg_a = df[df['region'] == 'A']['total_amount']
reg_b = df[df['region'] == 'B']['total_amount']
t_stat, p_val = stats.ttest_ind(reg_a, reg_b, equal_var=False)
print(f'Welch t-stat: {t_stat:.3f}, p-value: {p_val:.4f}')

# 3. Chi-Square Test: Hubungan Channel Marketing dan Konversi
ct = pd.crosstab(df['marketing_channel'], df['converted'])
chi2, p_chi, dof, _ = stats.chi2_contingency(ct)
print(f'Chi-Square: {chi2:.3f}, p-value: {p_chi:.4f}')
```$NOTE_CONTENT$,
    'BookOpen',
    2,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 3: Pengumpulan & Pembersihan Data
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Pengumpulan & Pembersihan Data',
    'bab-3-pengumpulan-pembersihan-data',
    $NOTE_CONTENT$# BAB 3: Pengumpulan & Pembersihan Data

## Tujuan Pembelajaran
- Mengakses dan mengekstrak data dari berbagai sumber: database relasional, API publik/internal, dan format file modern.
- Mengidentifikasi anomali data serta menerapkan strategi penanganan missing values yang tepat.
- Melakukan transformasi data wrangling: penggabungan (*merge/join*), pembentukan tabel pivot (*pivot table*), dan restrukturisasi *melt*.

---

## 3.1 Sumber Data
1. **Database Relasional**: Transaksi tersimpan di PostgreSQL, MySQL, atau Cloud Data Warehouse (BigQuery, Snowflake).
2. **API (Application Programming Interface)**: Data pihak ketiga (iklan, cuaca, kurs) berformat JSON. Wajib menggunakan `timeout` dan pemeriksaan `raise_for_status()`.
3. **Format File**: CSV, Excel multi-sheet, dan Parquet (penyimpanan berbasis kolom berkecepatan tinggi).

---

## 3.2 Strategi Penanganan Missing Value
1. **Hapus (Deletion)**: Jika proporsi missing kecil (<3%) dan hilang secara acak (*Missing Completely at Random*).
2. **Imputasi Sederhana**: Nilai tengah (*Median*) untuk data numerik miring, atau *Modus* untuk data kategorikal.
3. **Imputasi Berbasis Waktu**: *Forward fill (ffill)* atau *backward fill (bfill)* untuk data deret waktu.
4. **Interpolasi**: Mengisi nilai berdasarkan tren observasi di sekitarnya.
5. **Model-Based Imputation**: Menggunakan algoritma prediktif berbasis fitur lain yang lengkap.

---

## Implementasi Kode Praktikum

### 1. Ekstraksi Data dari Multi-Sumber
```python
import pandas as pd
from sqlalchemy import create_engine
import requests

# 1. Ekstraksi Database Relasional
engine = create_engine('postgresql://user:password@host:5432/dbname')
df_db = pd.read_sql("SELECT * FROM sales.orders WHERE order_date >= '2026-01-01'", engine)

# 2. Ekstraksi REST API dengan Safety Timeout
resp = requests.get('https://api.exchangerate.host/latest', params={'base': 'USD'}, timeout=10)
resp.raise_for_status()
data_api = resp.json()
df_api = pd.DataFrame(list(data_api['rates'].items()), columns=['currency', 'rate'])

# 3. Membaca Format File
df_csv = pd.read_csv('customer_data.csv')
df_parquet = pd.read_parquet('events.parquet')
```

### 2. Pipeline Pembersihan Data Sistematis
```python
import pandas as pd
import numpy as np

df = pd.read_csv('customer_data.csv')

# Hapus baris tanpa identitas transaksi
df_clean = df.dropna(subset=['customer_id', 'order_date']).copy()

# Imputasi median pada kolom numerik pendapatan yang skewed
df_clean['income'] = df_clean['income'].fillna(df_clean['income'].median())

# Imputasi modus pada kolom wilayah kota
df_clean['city'] = df_clean['city'].fillna(df_clean['city'].mode()[0])

# Normalisasi penulisan string (hilangkan spasi berlebih & kapitalisasi)
df_clean['city'] = df_clean['city'].str.strip().str.title()

# Hapus data duplikat transaksi
df_clean = df_clean.drop_duplicates(subset=['customer_id', 'order_date'])
```

### 3. Data Wrangling (Merge, Pivot, Melt, Binning)
```python
import pandas as pd

orders = pd.read_csv('orders.csv')
customers = pd.read_csv('customers.csv')

# Merge dataset (selalu verifikasi panjang baris)
df_merged = orders.merge(customers, on='customer_id', how='left')

# Pivot: Format Long -> Wide untuk agregasi bulanan per pelanggan
df_merged['month'] = pd.to_datetime(df_merged['order_date']).dt.to_period('M')
pivot = df_merged.pivot_table(
    index='customer_id', columns='month', values='total_amount', aggfunc='sum', fill_value=0
)

# Melt: Kembalikan Wide -> Long sebelum visualisasi
df_long = pivot.reset_index().melt(
    id_vars='customer_id', var_name='month', value_name='total_amount'
)

# Feature Engineering: Binning ukuran pesanan
df_merged['order_scale'] = pd.cut(
    df_merged['total_amount'],
    bins=[0, 100_000, 500_000, float('inf')],
    labels=['Kecil', 'Menengah', 'Besar']
)
```$NOTE_CONTENT$,
    'BookOpen',
    3,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 4: SQL untuk Analisis Data
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: SQL untuk Analisis Data',
    'bab-4-sql-untuk-analisis-data',
    $NOTE_CONTENT$# BAB 4: SQL untuk Analisis Data

## Tujuan Pembelajaran
- Menulis query terstruktur: SELECT, WHERE, ORDER BY, LIMIT, dan DISTINCT.
- Menguasai 4 jenis JOIN dan menghindari kesalahan logika filter pada LEFT JOIN.
- Menerapkan agregasi GROUP BY dan pemfilteran hasil dengan HAVING.
- Menggunakan Window Functions (RANK, DENSE_RANK, ROW_NUMBER, LAG, LEAD) untuk analitik bisnis lanjutan.
- Memahami prinsip optimasi query dan evaluasi EXPLAIN ANALYZE.

---

## 4.1 Query Dasar & 4 Jenis JOIN
1. **INNER JOIN**: Hanya mengembalikan baris yang cocok di kedua tabel.
2. **LEFT JOIN**: Mengembalikan semua baris dari tabel kiri, dilengkapi data tabel kanan jika cocok (NULL jika tidak ada).
3. **RIGHT JOIN**: Kebalikan dari LEFT JOIN.
4. **FULL OUTER JOIN**: Mengembalikan seluruh baris dari kedua tabel.

> **Jebakan Umum:** Menaruh kondisi WHERE pada kolom tabel kanan saat melakukan LEFT JOIN akan secara diam-diam mengubah operasinya menjadi INNER JOIN, karena baris NULL akan tereliminasi.

---

## 4.2 Agregasi GROUP BY vs HAVING
- **WHERE**: Memfilter baris data *sebelum* agregasi dilakukan.
- **HAVING**: Memfilter hasil *setelah* perhitungan agregasi (SUM, COUNT, AVG) dieksekusi.

---

## Implementasi Kode Praktikum

### 1. Query Agregasi dengan HAVING
```sql
SELECT
    category,
    COUNT(*) AS jumlah_order,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS rata_rata_order,
    MAX(total_amount) AS order_terbesar
FROM sales.orders
GROUP BY category
HAVING SUM(total_amount) > 10000000 -- filter pasca-agregasi
ORDER BY total_revenue DESC;
```

### 2. Window Functions: Peringkat & Analisis MoM
```sql
-- Ranking transaksi dan perubahan transaksi sebelumnya (LAG)
SELECT
    customer_id,
    order_date,
    total_amount,
    RANK() OVER (ORDER BY total_amount DESC) AS ranking_transaksi,
    SUM(total_amount) OVER (
        PARTITION BY customer_id ORDER BY order_date
    ) AS running_total_customer,
    LAG(total_amount) OVER (
        PARTITION BY customer_id ORDER BY order_date
    ) AS transaksi_sebelumnya
FROM sales.orders;
```

### 3. Dasar Optimasi Query & EXPLAIN ANALYZE
```sql
-- Evaluasi rencana eksekusi dan biaya komputasi query
EXPLAIN ANALYZE
SELECT customer_id, SUM(total_amount)
FROM sales.orders
WHERE order_date >= '2026-01-01'
GROUP BY customer_id;
```$NOTE_CONTENT$,
    'BookOpen',
    4,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 5: Spreadsheet & Tools Analisis
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Spreadsheet & Tools Analisis',
    'bab-5-spreadsheet-tools-analisis',
    $NOTE_CONTENT$# BAB 5: Spreadsheet & Tools Analisis

## Tujuan Pembelajaran
- Menguasai formula analitis esensial di Excel & Google Sheets (XLOOKUP, INDEX+MATCH, SUMIFS, IFS).
- Membangun Pivot Table interaktif untuk meringkas ribuan baris data secara instan.
- Menerapkan fungsi modern Dynamic Array (FILTER, UNIQUE, SORT) dan formula QUERY Google Sheets.

---

## 5.1 Kapan Memilih Spreadsheet vs SQL/Python?
- **Gunakan Spreadsheet**: Ukuran data < 1 juta baris, butuh kolaborasi cepat dengan tim non-teknis, eksplorasi ad-hoc satu kali.
- **Gunakan SQL/Python**: Ukuran data besar, proses berulang membutuhkan reproducibility, otomasi pipeline harian.

---

## Implementasi Formula Kunci

### Formula Praktis Spreadsheet Modern
```text
' 1. Pencarian nilai dengan XLOOKUP (Excel 365 & Google Sheets)
=XLOOKUP(A2, ProdukID_Range, Harga_Range, "Tidak ditemukan")

' 2. Alternatif Universal INDEX + MATCH (bisa mencari ke arah kiri)
=INDEX(Harga_Range, MATCH(A2, ProdukID_Range, 0))

' 3. Penjumlahan Multi-Kriteria
=SUMIFS(TotalPenjualan_Range, Kategori_Range, "Elektronik", Region_Range, "Jawa")

' 4. Logika Kondisional Bertingkat
=IFS(B2>=5000000, "VIP", B2>=1000000, "Reguler", TRUE, "Baru")

' 5. Dynamic Array Formula (Filter & Sort Otomatis)
=SORT(UNIQUE(FILTER(NamaPelanggan_Range, TotalBelanja_Range > 1000000)), 1, FALSE)

' 6. Google Sheets QUERY bergaya SQL
=QUERY(DataPenjualan, "SELECT Region, SUM(TotalAmount) WHERE Kategori = 'Elektronik' GROUP BY Region ORDER BY SUM(TotalAmount) DESC", 1)
```$NOTE_CONTENT$,
    'BookOpen',
    5,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 6: Pemrograman untuk Data Analyst
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Pemrograman untuk Data Analyst',
    'bab-6-pemrograman-untuk-data-analyst',
    $NOTE_CONTENT$# BAB 6: Pemrograman untuk Data Analyst

## Tujuan Pembelajaran
- Memahami keunggulan komputasi numerik tervektorisasi (*vectorized operations*) pada NumPy.
- Menguasai manipulasi DataFrame di Pandas dengan gaya *method chaining* modern.
- Menghindari perulangan lambat seperti `df.iterrows()` dan menggantinya dengan `np.where()`.
- Mengenali sintaksis manipulasi data berbasis Tidyverse di bahasa pemrograman R.

---

## 6.1 Python: NumPy & Pandas Vectorization
Operasi vectorized memproses seluruh elemen array secara simultan di level pustaka C terkompilasi, menghasilkan percepatan 100x hingga 500x lipat dibanding loop for konvensional di Python.

---

## Implementasi Kode Praktikum

### 1. Vectorization NumPy & Method Chaining Pandas
```python
import numpy as np
import pandas as pd

# Operasi Vektor NumPy
harga = np.array([15000, 25000, 120000, 45000])
diskon = np.array([0.10, 0.05, 0.20, 0.00])
harga_bersih = harga * (1 - diskon)
print('Harga Setelah Diskon:', harga_bersih)

# Pandas Method Chaining yang Bersih & Terstruktur
df = pd.read_csv('sales_data.csv')
laporan_kategori = (
    df.query("order_status == 'completed'")
    .groupby('category', as_index=False)
    .agg(
        total_omzet=('total_amount', 'sum'),
        total_transaksi=('order_id', 'count')
    )
    .sort_values('total_omzet', ascending=False)
)
print(laporan_kategori)

# Transformasi Kondisional Vektor Cepat
df['status_nilai'] = np.where(df['total_amount'] > 500000, 'Tinggi', 'Standar')
```

### 2. Pemrosesan Data di R (Tidyverse & dplyr)
```r
library(dplyr)
library(readr)

# Alur Kerja Pipa dplyr (%>%)
df <- read_csv("sales_data.csv")
ringkasan <- df %>%
  filter(order_status == "completed") %>%
  group_by(category) %>%
  summarise(
    total_omzet = sum(total_amount, na.rm = TRUE),
    total_order = n()
  ) %>%
  arrange(desc(total_omzet))
print(ringkasan)
```$NOTE_CONTENT$,
    'BookOpen',
    6,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 7: Exploratory Data Analysis (EDA)
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Exploratory Data Analysis (EDA)',
    'bab-7-exploratory-data-analysis-eda',
    $NOTE_CONTENT$# BAB 7: Exploratory Data Analysis (EDA)

## Tujuan Pembelajaran
- Melakukan analisis univariate dan multivariate untuk memetakan karakteristik dataset.
- Mendeteksi outlier menggunakan metode statistik IQR dan Z-Score.
- Mengukur korelasi numerik (Pearson vs Spearman) dan memvisualisasikannya dalam bentuk heatmap.

---

## 7.1 Analisis Univariate & Multivariate
- **Univariate**: Menganalisis distribusi satu variabel secara mandiri (mean, median, varians, frekuensi kategori).
- **Multivariate**: Memeriksa relasi antara dua atau lebih variabel sekaligus untuk menemukan pola tersembunyi.

---

## 7.2 Deteksi Outlier: IQR vs Z-Score
- **Metode IQR**: Batas bawah $= Q_1 - 1.5 \times IQR$, Batas atas $= Q_3 + 1.5 \times IQR$. Metode ini tidak bergantung pada asumsi distribusi normal.
- **Metode Z-Score**: Nilai $|z| > 3$ dikategorikan outlier, namun mengasumsikan data terdistribusi normal.

---

## Implementasi Kode Praktikum

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from scipy import stats

df = pd.read_csv('sales_data.csv')

# 1. Analisis Univariate & Multivariate
print('Statistik Numerik:\n', df['total_amount'].describe())
print('\nFrekuensi Kategori:\n', df['category'].value_counts(normalize=True) * 100)

pivot = df.pivot_table(index='category', columns='region', values='total_amount', aggfunc='mean')
print('\nRata-rata per Kategori x Region:\n', pivot)

# 2. Deteksi Outlier Metode IQR
q1 = df['total_amount'].quantile(0.25)
q3 = df['total_amount'].quantile(0.75)
iqr = q3 - q1
lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr

outliers = df[(df['total_amount'] < lower_bound) | (df['total_amount'] > upper_bound)]
print(f'Outlier terdeteksi: {len(outliers)} baris dari {len(df)} baris ({len(outliers)/len(df)*100:.1f}%)')

# 3. Matriks Korelasi & Heatmap
numeric_cols = df.select_dtypes(include='number')
corr = numeric_cols.corr(method='pearson')
sns.heatmap(corr, annot=True, cmap='coolwarm', center=0)
```$NOTE_CONTENT$,
    'BookOpen',
    7,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 8: Visualisasi Data
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Visualisasi Data',
    'bab-8-visualisasi-data',
    $NOTE_CONTENT$# BAB 8: Visualisasi Data

## Tujuan Pembelajaran
- Menerapkan prinsip desain visualisasi data yang efektif dan komunikatif.
- Memilih jenis chart yang tepat sesuai tujuan analisis.
- Menyusun alur presentasi data (*Storytelling with Data*) yang menjawab pertanyaan *"So What?"*.

---

## 8.1 Panduan Memilih Chart yang Tepat
| Tujuan Analisis | Rekomendasi Chart |
| :--- | :--- |
| Membandingkan kategori | Bar chart (vertikal / horizontal) |
| Melihat tren deret waktu | Line chart |
| Melihat distribusi sebaran data | Histogram, Box plot |
| Melihat relasi dua variabel numerik | Scatter plot |
| Melihat komposisi proporsi bagian terhadap keseluruhan | Stacked bar chart (hindari pie chart > 5 kategori) |

---

## 8.2 Struktur Narasi Storytelling with Data
1. **Situation (Konteks)**: Latar belakang dan masalah bisnis yang sedang dihadapi.
2. **Complication (Temuan)**: Fakta anomali atau peluang yang diungkap oleh data.
3. **Implication (Dampak Bisnis)**: Mengapa temuan ini penting dan apa risikonya jika diabaikan.
4. **Resolution (Rekomendasi)**: Tindakan spesifik yang disarankan untuk dieksekusi.

---

## Implementasi Kode Praktikum

```python
import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_csv('sales_data.csv')
monthly_rev = df.groupby(pd.to_datetime(df['order_date']).dt.to_period('M'))['total_amount'].sum()

fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(monthly_rev.index.astype(str), monthly_rev.values, marker='o', color='#d62728', lw=2)

# Judul Berbasis Insight (Bukan sekadar deskriptif netral)
ax.set_title('Revenue Turun 18% dalam 3 Bulan Terakhir — Didorong Kategori Elektronik',
             fontsize=12, fontweight='bold')

# Anotasi Titik Kritis
ax.annotate('Mulai fase penurunan di sini',
            xy=(3, monthly_rev.values[3]),
            xytext=(1.5, monthly_rev.values[3] * 1.15),
            arrowprops=dict(arrowstyle='->', color='gray', lw=1.5))

plt.xticks(rotation=45)
plt.ylabel('Revenue (Rp)')
plt.tight_layout()
```$NOTE_CONTENT$,
    'BookOpen',
    8,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 9: Dashboard & Reporting
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Dashboard & Reporting',
    'bab-9-dashboard-reporting',
    $NOTE_CONTENT$# BAB 9: Dashboard & Reporting

## Tujuan Pembelajaran
- Menguasai prinsip desain dashboard modern: Visual Hierarchy (Z-Pattern dan F-Pattern), Aturan 5 Detik, dan Progressive Disclosure.
- Menerapkan Color Theory yang ramah aksesibilitas (Sequential, Diverging, Qualitative).
- Membangun layout dashboard eksekutif multi-panel menggunakan Matplotlib GridSpec.
- Memahami studi kasus dashboard operasional nyata: Executive Dashboard, Financial Waterfall P&L, dan Funnel Konversi Pemasaran.

---

## 9.1 Teori Warna & Prinsip Dashboard
- **Sequential**: Berjenjang dari rendah ke tinggi (viridis, Blues, YlOrRd).
- **Diverging**: Memiliki titik tengah nol bermakna (RdBu, coolwarm).
- **Qualitative**: Kategori nominal tanpa urutan (Set2, tab10).
- **Aksesibilitas**: Hindari kombinasi merah-hijau sebagai satu-satunya indikator tanpa dilengkapi label angka, karena 8% pria mengalami defisiensi persepsi warna merah-hijau.

---

## Implementasi Kode Praktikum

### 1. Kerangka Dashboard GridSpec 3x4
```python
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import pandas as pd

fig = plt.figure(figsize=(14, 8))
gs = gridspec.GridSpec(3, 4, figure=fig, hspace=0.5, wspace=0.4)

# Baris 1: Tiga KPI Card Utama di Kiri Atas
kpi_data = [('Total Revenue', 'Rp 1.2 M', '+8.2%'),
            ('Total Orders', '4,582', '+3.1%'),
            ('Conversion Rate', '3.4%', '-0.5%')]

for i, (label, val, delta) in enumerate(kpi_data):
    ax = fig.add_subplot(gs[0, i])
    c_delta = 'green' if delta.startswith('+') else 'red'
    ax.text(0.5, 0.6, val, ha='center', va='center', fontsize=20, fontweight='bold')
    ax.text(0.5, 0.3, label, ha='center', va='center', fontsize=11, color='gray')
    ax.text(0.5, 0.1, delta, ha='center', va='center', fontsize=10, color=c_delta)
    ax.axis('off'); ax.set_facecolor('#F5F7FA')

# Baris 2-3: Tren Penjualan & Kontribusi Kategori
ax_tren = fig.add_subplot(gs[1:, :3])
ax_tren.plot(range(30), [1000 + x*20 for x in range(30)], color='steelblue', lw=2)
ax_tren.set_title('Tren Revenue 30 Hari Terakhir', loc='left', fontweight='bold')

ax_kat = fig.add_subplot(gs[1:, 3])
ax_kat.barh(['Elektronik', 'Fashion', 'Makanan'], [45, 30, 25], color='coral')
ax_kat.set_title('Kontribusi Kategori', loc='left', fontweight='bold')
plt.suptitle('Executive Summary Dashboard', fontsize=16, fontweight='bold')
```

### 2. Waterfall Chart Laporan Laba Rugi (P&L)
```python
import pandas as pd
import matplotlib.pyplot as plt

kategori = ['Revenue', 'COGS', 'Opex', 'Marketing', 'Pajak', 'Net Profit']
nilai = [1000, -400, -200, -150, -60, 190] # Juta Rupiah

kumulatif = pd.Series(nilai).cumsum()
mulai = kumulatif.shift(1).fillna(0)
mulai.iloc[-1] = 0 # Net profit dimulai dari titik nol

warna = ['steelblue'] + ['indianred' if v < 0 else 'seagreen' for v in nilai[1:-1]] + ['steelblue']

fig, ax = plt.subplots(figsize=(9, 4))
for i, (kat, v, m, w) in enumerate(zip(kategori, nilai, mulai, warna)):
    ax.bar(kat, v, bottom=m, color=w, edgecolor='white')
    ax.text(i, m + v/2, f'{v:+,}', ha='center', va='center', color='white', fontweight='bold')
ax.set_title('Waterfall: Perubahan Revenue Menjadi Net Profit (Rp Juta)', loc='left', fontweight='bold')
ax.axhline(0, color='black', linewidth=0.8); plt.tight_layout()
```$NOTE_CONTENT$,
    'BookOpen',
    9,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 10: AI-Augmented Analytics & Advanced Pandas
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: AI-Augmented Analytics & Advanced Pandas',
    'bab-10-ai-augmented-analytics-advanced-pandas',
    $NOTE_CONTENT$# BAB 10: AI-Augmented Analytics & Advanced Pandas

## Tujuan Pembelajaran
- Mengoptimalkan produktivitas menggunakan Text-to-SQL dan AI Copilot.
- Menguasai teknik method chaining tingkat lanjut dengan fungsi kustom `.pipe()`.
- Menerapkan transformasi `.assign()`, `.query()`, dan `.eval()` untuk komputasi cepat.
- Mengoptimalkan memori DataFrame skala produksi (tipe data Categorical, Nullable Int64, dan fungsi reduksi otomatis).
- Menerapkan strategi pemrosesan dataset raksasa dengan Chunk Processing dan multiprocessing.

---

## Implementasi Kode Praktikum

### 1. Method Chaining dengan .pipe() dan .explode()
```python
import pandas as pd

def hapus_outlier_iqr(data, kolom):
    q1, q3 = data[kolom].quantile([0.25, 0.75])
    iqr = q3 - q1
    return data[data[kolom].between(q1 - 1.5*iqr, q3 + 1.5*iqr)]

def tambah_margin(data):
    return data.assign(margin=data['revenue'] - data['cost'])

# Memecah kolom bertipe list menggunakan .explode()
df_tags = pd.DataFrame({'produk': ['Sepatu A', 'Tas B'], 'tags': [['diskon', 'promo'], ['baru', 'diskon']]})
print('Hasil Explode Kolom List:\n', df_tags.explode('tags'))
```

### 2. Fungsi Otomatisasi Optimasi Memori DataFrame
```python
import pandas as pd
import numpy as np

def reduce_memory_usage(df: pd.DataFrame) -> pd.DataFrame:
    """Downcast numerik dan konversi teks berulang ke categorical untuk menghemat memori."""
    mem_awal = df.memory_usage(deep=True).sum() / 1024**2
    for col in df.columns:
        col_type = df[col].dtype
        if pd.api.types.is_integer_dtype(col_type):
            df[col] = pd.to_numeric(df[col], downcast='integer')
        elif pd.api.types.is_float_dtype(col_type):
            df[col] = pd.to_numeric(df[col], downcast='float')
        elif col_type == object:
            if df[col].nunique() / len(df[col]) < 0.5:
                df[col] = df[col].astype('category')
    mem_akhir = df.memory_usage(deep=True).sum() / 1024**2
    print(f'Memori: {mem_awal:.2f} MB -> {mem_akhir:.2f} MB (Turun {(1 - mem_akhir/mem_awal)*100:.1f}%)')
    return df
```$NOTE_CONTENT$,
    'BookOpen',
    10,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 11: Analisis Lanjutan & Komputasi Numerik
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Analisis Lanjutan & Komputasi Numerik',
    'bab-11-analisis-lanjutan-komputasi-numerik',
    $NOTE_CONTENT$# BAB 11: Analisis Lanjutan & Komputasi Numerik

## Tujuan Pembelajaran
- Menguasai teknik Fancy Indexing dan kondisional multi-cabang dengan `np.select`.
- Menggunakan arsitektur Generator API modern (`np.random.default_rng`).
- Memahami konsep krusial View vs Copy serta dampak urutan memori (C-order vs Fortran-order).
- Memahami akselerasi komputasi menggunakan Universal Functions (ufunc) dan kompilasi Numba JIT (`@njit`).
- Menerapkan operasi Aljabar Linear (Sistem Persamaan Linear, Invers, dan Least Squares).

---

## Implementasi Kode Praktikum

### 1. Logika Kondisional Multi-Cabang & Generator API
```python
import numpy as np

# 1. np.select untuk kondisional bertingkat
revenue = np.array([120000, 45000, 300000, 8000, 75000])
kondisi = [revenue >= 200000, revenue >= 100000, revenue >= 50000]
pilihan = ['Sangat Tinggi', 'Tinggi', 'Sedang']
label_tier = np.select(kondisi, pilihan, default='Rendah')
print('Tier Revenue:', label_tier)

# 2. Generator API Modern
rng = np.random.default_rng(seed=42)
sampel_normal = rng.normal(loc=100, scale=15, size=5)
print('Sampel Generator API:', sampel_normal)
```

### 2. Aljabar Linear: Menyelesaikan Sistem Persamaan Linear
```python
import numpy as np

# Menyelesaikan persamaan:
# 2x + y - z = 1
# x + 3y + 2z = 8
# 3x + 2y + 4z = 10
A = np.array([[2, 1, -1], [1, 3, 2], [3, 2, 4]], dtype=float)
b = np.array([1, 8, 10], dtype=float)

x = np.linalg.solve(A, b)
print('Solusi Persamaan (x, y, z):', x)
print('Verifikasi Solusi:', np.allclose(A @ x, b))
```$NOTE_CONTENT$,
    'BookOpen',
    11,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 12: Business Acumen, Problem Solving & Decision Making
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Business Acumen, Problem Solving & Decision Making',
    'bab-12-business-acumen-problem-solving-decision-making',
    $NOTE_CONTENT$# BAB 12: Business Acumen, Problem Solving & Decision Making

## Tujuan Pembelajaran
- Menguasai pola pikir Analytical Thinking dan Data Thinking dalam pemecahan masalah bisnis.
- Membedakan Metric mentah, Key Performance Indicator (KPI), OKR, dan North Star Metric.
- Memahami 5 level Analytics Maturity Model dan siklus proyek CRISP-DM vs OSEMN.
- Menerapkan teknik Root Cause Analysis (5 Whys, Fishbone Diagram, dan Analisis Pareto 80/20).
- Menghitung Return on Investment (ROI) dari sebuah inisiatif analytics.
- Mengenali bias berpikir kognitif dalam analisis data (Survivorship Bias, Cherry Picking, Simpson's Paradox).

---

## 12.1 Hirarki Metrik Bisnis
- **Metric**: Angka pengukuran kuantitatif mentah (contoh: *Jumlah pengunjung harian*).
- **KPI (Key Performance Indicator)**: Metrik terpilih yang terkait langsung dengan target keberhasilan bisnis (contoh: *Conversion Rate ≥ 3.5%*).
- **OKR (Objectives & Key Results)**: Kerangka tujuan strategis kualitatif beserta tolok ukur kuantitatif (contoh Objective: *"Meningkatkan loyalitas pengguna e-commerce"*, Key Result: *"Repeat order rate naik ke 35%"*).
- **North Star Metric**: Satu metrik kunci tunggal yang mencerminkan inti nilai produk bagi pelanggan (contoh: *Spotify = Time Spent Listening*, *Airbnb = Nights Booked*).

---

## Implementasi Kode Praktikum: Analisis Pareto 80/20 & ROI
```python
import pandas as pd
import numpy as np

# 1. Menghitung ROI Inisiatif Analytics
# ROI (%) = (Manfaat Finansial - Biaya Proyek) / Biaya Proyek * 100%
biaya_proyek = 50_000_000   # Biaya implementasi sistem analytics
manfaat_hemat = 185_000_000 # Efisiensi & pendapatan terselamatkan
roi = ((manfaat_hemat - biaya_proyek) / biaya_proyek) * 100
print(f'ROI Inisiatif Data: {roi:.1f}%')

# 2. Pareto Analysis: Menemukan 20% Pelanggan Kontributor 80% Revenue
# revenue_per_cust = df.groupby('customer_id')['revenue'].sum().sort_values(ascending=False)
# cumulative_pct = revenue_per_cust.cumsum() / revenue_per_cust.sum() * 100
# n_top_80 = (cumulative_pct <= 80).sum()
# print(f'{n_top_80} pelanggan menyumbang 80% total revenue perusahaan!')
```$NOTE_CONTENT$,
    'BookOpen',
    12,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 13: SQL Lanjutan, CTE & Cohort Analysis
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: SQL Lanjutan, CTE & Cohort Analysis',
    'bab-13-sql-lanjutan-cte-cohort-analysis',
    $NOTE_CONTENT$# BAB 13: SQL Lanjutan, CTE & Cohort Analysis

## Tujuan Pembelajaran
- Menggunakan logika kondisional CASE WHEN langsung di dalam query SQL.
- Menyusun query kompleks dan mudah dibaca menggunakan Common Table Expression (CTE klausa WITH).
- Menerapkan Window Functions lanjutan untuk menghitung peringkat, perbandingan MoM/YoY, dan rolling average.
- Membangun analisis kohort retensi pelanggan (*Cohort Retention Analysis*) dari data transaksi riil.

---

## Implementasi Kode Praktikum

### 1. Segmentasi Pelanggan dengan CASE WHEN dan CTE
```sql
WITH ringkasan_pelanggan AS (
    SELECT
        customer_id,
        SUM(revenue) AS total_belanja,
        COUNT(*) AS frekuensi_order
    FROM sales.transaksi
    GROUP BY customer_id
)
SELECT
    customer_id,
    total_belanja,
    frekuensi_order,
    CASE
        WHEN total_belanja >= 10000000 THEN 'Platinum'
        WHEN total_belanja >= 5000000  THEN 'Gold'
        WHEN total_belanja >= 1000000  THEN 'Silver'
        ELSE 'Regular'
    END AS segmentasi_loyalitas
FROM ringkasan_pelanggan
ORDER BY total_belanja DESC;
```

### 2. Cohort Retention Analysis dengan SQL
```sql
-- Melacak retensi bulanan pelanggan berdasarkan kohort bulan pertama belanja
WITH cohort_pelanggan AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', MIN(tanggal_transaksi)) AS bulan_cohort
    FROM sales.transaksi
    GROUP BY customer_id
),
aktivitas_bulanan AS (
    SELECT
        c.bulan_cohort,
        DATE_TRUNC('month', t.tanggal_transaksi) AS bulan_aktivitas,
        COUNT(DISTINCT t.customer_id) AS jumlah_aktif
    FROM sales.transaksi t
    JOIN cohort_pelanggan c ON t.customer_id = c.customer_id
    GROUP BY c.bulan_cohort, DATE_TRUNC('month', t.tanggal_transaksi)
)
SELECT
    bulan_cohort,
    bulan_aktivitas,
    jumlah_aktif,
    EXTRACT(MONTH FROM AGE(bulan_aktivitas, bulan_cohort)) AS bulan_ke
FROM aktivitas_bulanan
ORDER BY bulan_cohort, bulan_aktivitas;
```$NOTE_CONTENT$,
    'BookOpen',
    13,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- BAB 14: Studi Kasus End-to-End E-Commerce & Pelanggan
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 14: Studi Kasus End-to-End E-Commerce & Pelanggan',
    'bab-14-studi-kasus-end-to-end-e-commerce-pelanggan',
    $NOTE_CONTENT$# BAB 14: Studi Kasus End-to-End E-Commerce & Pelanggan

## Tujuan Pembelajaran
- Mengintegrasikan seluruh kompetensi Data Analyst dalam proyek nyata end-to-end.
- Menganalisis kinerja penjualan e-commerce (KPI: Revenue, Orders, AOV, Profit Margin).
- Membangun segmentasi pelanggan berbasis metode RFM (Recency, Frequency, Monetary).
- Menguasai cheat sheet sintaksis dan panduan pemecahan error umum (Troubleshooting) dalam pekerjaan sehari-hari.

---

## 14.1 Studi Kasus 1: E-Commerce Analytics Dashboard
Studi kasus mensimulasikan dataset transaksi 5.000 pesanan dengan kalkulasi KPI esensial bisnis:
- **Total Net Revenue**: Total omzet bersih setelah potongan diskon.
- **Average Order Value (AOV)**: Nilai rata-rata per transaksi ($AOV = \frac{Total\,Revenue}{Total\,Order}$).
- **Profit Margin**: Persentase keuntungan bersih terhadap revenue.

---

## 14.2 Studi Kasus 2: Segmentasi Pelanggan RFM
- **Recency (R)**: Berapa hari sejak pelanggan terakhir kali bertransaksi (semakin kecil, skor semakin tinggi).
- **Frequency (F)**: Berapa kali pelanggan berbelanja dalam rentang waktu evaluasi.
- **Monetary (M)**: Berapa total uang yang dibelanjakan pelanggan.

Klasifikasi Segmen:
- **Champions**: $R \ge 4, F \ge 4, M \ge 4$ (Pelanggan terbaik, loyalitas & belanja tinggi).
- **Loyal Customers**: $R \ge 3, F \ge 3, M \ge 3$ (Pelanggan setia berulang).
- **At Risk**: $R \le 2, F \ge 3$ (Pelanggan sering belanja tetapi sudah lama tidak kembali).
- **Lost**: $R = 1, F = 1$ (Pelanggan sekali beli dan tidak aktif).

---

## Implementasi Kode Praktikum

### 1. Dashboard Kinerja E-Commerce
```python
import pandas as pd
import numpy as np

# Simulasi Dataset E-Commerce
np.random.seed(42)
n = 5000
df = pd.DataFrame({
    'order_id': [f'ORD-{i:05d}' for i in range(n)],
    'tanggal': pd.date_range('2024-01-01', '2024-12-31', periods=n),
    'kategori': np.random.choice(['Elektronik', 'Fashion', 'Makanan', 'Olahraga'], n),
    'kota': np.random.choice(['Jakarta', 'Surabaya', 'Bandung', 'Medan'], n),
    'qty': np.random.randint(1, 10, n),
    'harga': np.random.lognormal(mean=13, sigma=1.2, size=n).round(-3),
    'diskon_pct': np.random.choice([0, 5, 10, 15, 20], n)
})

# Feature Engineering
df['revenue'] = df['qty'] * df['harga']
df['net_revenue'] = df['revenue'] * (1 - df['diskon_pct']/100)
df['profit'] = df['net_revenue'] * np.random.uniform(0.15, 0.30, n)

# Ringkasan KPI
total_rev = df['net_revenue'].sum()
total_order = df['order_id'].nunique()
aov = total_rev / total_order
margin = (df['profit'].sum() / total_rev) * 100

print('=== RINGKASAN KPI E-COMMERCE 2024 ===')
print(f'Total Net Revenue : Rp {total_rev:,.0f}')
print(f'Total Orders      : {total_order:,}')
print(f'Avg Order Value   : Rp {aov:,.0f}')
print(f'Profit Margin (%) : {margin:.1f}%')
```

### 2. Segmentasi Pelanggan RFM
```python
import pandas as pd
import numpy as np

# Simulasi Perhitungan Skor RFM (1 s/d 5)
def segment_customer(r, f, m):
    if r >= 4 and f >= 4 and m >= 4: return 'Champions'
    if r >= 3 and f >= 3 and m >= 3: return 'Loyal Customers'
    if r >= 4 and f <= 2: return 'New Customers'
    if r <= 2 and f >= 3: return 'At Risk'
    if r == 1 and f == 1: return 'Lost'
    return 'Regular'

print('Aturan Segmentasi RFM Siap Diterapkan untuk Personalisasi Penawaran Kampanye Retensi!')
```$NOTE_CONTENT$,
    'BookOpen',
    14,
    v_cat_da,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- ============================================================
  -- SEED CROSS-CURRICULUM: NLP (Sentimen & Emotion Detection)
  -- ============================================================
  IF v_cat_nlp IS NOT NULL THEN
    INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
    VALUES (
      'BAB 8: Analisis Sentimen & Emotion Detection',
      'bab-8-analisis-sentimen-emotion-detection',
      $NOTE_CONTENT$# BAB 8: Analisis Sentimen & Emotion Detection

## Studi Kasus Nyata: Analisis Sentimen 453.390 Tweet Indonesia & Melayu
Dalam dunia bisnis nyata, analisis sentimen media sosial digunakan untuk brand monitoring, analisis keluhan pelanggan, evaluasi kompetitor, dan deteksi krisis reputasi sedini mungkin.

### Alur Kerja Analisis Sentimen:
1. **Pembersihan Teks**: Normalisasi karakter URL, mention, hashtag, dan angka.
2. **Kamus Slang**: Mengubah kata tidak baku bahasa Indonesia dan Melayu menjadi kata baku (*gak/nggak -> tidak*, *udah/dah -> sudah*, *banget -> sekali*, *btk -> tidak*).
3. **Lexicon-Based Scoring dengan Negasi**: Menangani pembalikan polaritas (*"tidak baik"* bernilai negatif, *"tidak buruk"* bernilai sedikit positif).
4. **Deteksi Emosi 8 Kategori (Plutchik''s Wheel)**: Mengklasifikasikan emosi menjadi Kebahagiaan, Kesedihan, Kemarahan, Ketakutan, Cinta, Semangat, Harapan, dan Kelelahan.
5. **Analisis Statistik**: Uji Kruskal-Wallis dan Mann-Whitney U untuk membandingkan panjang karakter antar kelompok sentimen.

```python
import re

SLANG_DICT = {
    r'\bgak\b': 'tidak', r'\bnggak\b': 'tidak', r'\btak\b': 'tidak',
    r'\budah\b': 'sudah', r'\bdah\b': 'sudah', r'\bbanget\b': 'sekali',
    r'\bkyk\b': 'seperti', r'\byg\b': 'yang', r'\bdgn\b': 'dengan'
}

def clean_and_normalize(text):
    text = str(text).lower()
    text = re.sub(r'http\S+|@\w+|#\w+|\d+', '', text)
    text = re.sub(r'[^\w\s]', ' ', text)
    for pat, rep in SLANG_DICT.items():
        text = re.sub(pat, rep, text)
    return re.sub(r'\s+', ' ', text).strip()

KATA_POSITIF = {'senang', 'bagus', 'hebat', 'terima kasih', 'mantap', 'puas', 'juara'}
KATA_NEGATIF = {'kecewa', 'buruk', 'rusak', 'lambat', 'marah', 'susah', 'rugi'}
KATA_NEGASI = {'tidak', 'tak', 'bukan', 'jangan', 'belum'}

def score_sentiment(text):
    words = text.split()
    score = 0; negasi = False
    for w in words:
        if w in KATA_NEGASI: negasi = True; continue
        if w in KATA_POSITIF:
            score += -1 if negasi else 1; negasi = False
        elif w in KATA_NEGATIF:
            score += 0.5 if negasi else -1; negasi = False
    return 'Positif' if score > 0 else ('Negatif' if score < 0 else 'Netral')

contoh = 'pelayanan customer service kemarin tidak buruk dan sangat ramah'
print('Input     :', contoh)
print('Hasil NLP :', score_sentiment(clean_and_normalize(contoh)))
```$NOTE_CONTENT$,
      'BookOpen',
      8,
      v_cat_nlp,
      false,
      v_user_id
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      content_markdown = EXCLUDED.content_markdown,
      icon = EXCLUDED.icon,
      order_index = EXCLUDED.order_index,
      category_id = EXCLUDED.category_id;
  END IF;

  -- ============================================================
  -- SEED CROSS-CURRICULUM: Time Series Forecasting (ADF & Validation)
  -- ============================================================
  IF v_cat_ts IS NOT NULL THEN
    INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
    VALUES (
      'BAB 2: Preprocessing & Uji Stasioneritas Time Series',
      'bab-2-preprocessing-uji-stasioneritas-time-series',
      $NOTE_CONTENT$# BAB 2: Preprocessing & Uji Stasioneritas Time Series

## Dekomposisi & Uji Stasioneritas ADF
Sebagian besar model peramalan klasik (seperti ARIMA) mengasumsikan data bersifat stasioner (rata-rata dan variansnya tidak berubah seiring waktu).

### 1. Komponen Deret Waktu:
- **Trend**: Arah pergerakan jangka panjang data.
- **Seasonality**: Pola fluktuasi berulang (harian, mingguan, atau tahunan).
- **Residual**: Sisa noise acak setelah tren dan musiman dipisahkan.

### 2. Uji Augmented Dickey-Fuller (ADF) & Differencing:
```python
from statsmodels.tsa.stattools import adfuller
import numpy as np

# Simulasi data tren penjualan
revenue_trend = np.linspace(100, 200, 100) + np.random.normal(0, 5, 100)

hasil_adf = adfuller(revenue_trend)
print(f'ADF Statistic: {hasil_adf[0]:.3f}')
print(f'p-value      : {hasil_adf[1]:.4f}')

if hasil_adf[1] < 0.05:
    print('Data stasioner (p < 0.05) -> siap dimodelkan langsung.')
else:
    print('Data TIDAK stasioner -> lakukan differencing untuk menghilangkan tren!')
    diff_data = np.diff(revenue_trend)
    print(f'Differencing Orde-1 selesai ({len(diff_data)} observasi).')
```$NOTE_CONTENT$,
      'BookOpen',
      2,
      v_cat_ts,
      false,
      v_user_id
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      content_markdown = EXCLUDED.content_markdown,
      icon = EXCLUDED.icon,
      order_index = EXCLUDED.order_index,
      category_id = EXCLUDED.category_id;
  END IF;

  -- ============================================================
  -- SEED CROSS-CURRICULUM: Machine Learning (Churn Prediction)
  -- ============================================================
  IF v_cat_ml IS NOT NULL THEN
    INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
    VALUES (
      'BAB 6: Supervised Learning - Klasifikasi & Churn Prediction',
      'bab-6-supervised-learning-klasifikasi-churn-prediction',
      $NOTE_CONTENT$# BAB 6: Supervised Learning - Klasifikasi & Churn Prediction

## Studi Kasus Klasifikasi Churn Pelanggan Telekomunikasi
Model klasifikasi memprediksi kemungkinan seorang pelanggan beralih ke kompetitor (*churn*), memungkinkan tim retensi melakukan intervensi proaktif.

### Evaluasi Klasifikasi pada Data Tidak Seimbang (Imbalanced):
- **Accuracy Trap**: Pada dataset dengan churn 2%, model yang selalu menebak "Tidak Churn" mendapat akurasi 98% namun tidak berguna bagi bisnis.
- **Precision vs Recall**: Untuk retensi, Recall tinggi diprioritaskan agar meminimalkan False Negative (pelanggan churn yang lolos tidak terdeteksi).
- **ROC-AUC**: Menilai kemampuan pemisahan kelas dari ambang batas probabilitas 0 hingga 1.

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score
import numpy as np

np.random.seed(42)
X = np.random.randn(500, 5)
y = np.random.choice([0, 1], 500, p=[0.75, 0.25])

# Split dengan stratify=y agar proporsi kelas tetap konsisten
X_tr, X_ts, y_tr, y_ts = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

lr = LogisticRegression(class_weight='balanced')
lr.fit(X_tr, y_tr)
y_prob = lr.predict_proba(X_ts)[:, 1]

print(f'Logistic Regression ROC-AUC: {roc_auc_score(y_ts, y_prob):.4f}')
print('\nClassification Report:\n', classification_report(y_ts, lr.predict(X_ts), target_names=['Tetap', 'Churn']))
```$NOTE_CONTENT$,
      'BookOpen',
      6,
      v_cat_ml,
      false,
      v_user_id
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      content_markdown = EXCLUDED.content_markdown,
      icon = EXCLUDED.icon,
      order_index = EXCLUDED.order_index,
      category_id = EXCLUDED.category_id;
  END IF;

END $$;
