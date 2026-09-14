-- ============================================================
-- Migration 022: Seed Comprehensive Data Analytics & Cross-Curriculum
-- Materi Bersumber Lengkap & Terperinci Tanpa Peringkasan dari:
-- "Modul Komprehensif Data Analytics dengan Python (148 Halaman)"
-- Mencakup: Python, Pandas, NumPy, Matplotlib, Seaborn, SQL,
--           Statistika Bisnis, Telco Churn ML, Time Series Forecasting,
--           dan Analisis Sentimen NLP 453.390 Tweet.
-- Didistribusikan ke 4 Kategori Kurikulum Velqora:
-- 1. Data Analyst (Bab 0, 1, 2, 3, 4, 5, 8, 9, Appendix A-D)
-- 2. Machine Learning (Bab 6.1 & 6.3: Telco Churn & ML Fundamentals)
-- 3. Time Series Forecasting & Anomaly Detection (Bab 6.2 & 6.4: Time Series & Stationarity)
-- 4. Natural Language Processing (Bab 7: Analisis Sentimen & Deteksi Emosi Tweet)
-- Velqora Academic Knowledge Base & Interactive Curriculum
-- ============================================================

-- ============================================================
-- PREREQUISITES & COMPATIBILITY LAYER
-- Memastikan kolom dan tabel yang dibutuhkan migration ini sudah
-- terdefinisi secara aman (idempotent) tanpa asumsi urutan migrasi.
-- ============================================================

-- 1. Dukungan hirarki & icon kategori (Migration 002)
ALTER TABLE IF EXISTS public.categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE IF EXISTS public.categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 2. Dukungan atribut modul pembelajaran (Migration 005)
ALTER TABLE IF EXISTS public.modules ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'module';
ALTER TABLE IF EXISTS public.modules ADD COLUMN IF NOT EXISTS tech_stack TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS public.modules ADD COLUMN IF NOT EXISTS repository_url TEXT;
ALTER TABLE IF EXISTS public.modules ADD COLUMN IF NOT EXISTS demo_url TEXT;
ALTER TABLE IF EXISTS public.modules ADD COLUMN IF NOT EXISTS author_name TEXT;

-- 3. Dukungan icon pada tabel notes
ALTER TABLE IF EXISTS public.notes ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'BookOpen';

-- 4. Dukungan tabel projects mandiri (Migration 019)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  level TEXT NOT NULL DEFAULT 'pemula',
  repository_url TEXT,
  demo_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  author_name TEXT,
  cover_url TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pastikan RLS aktif jika tabel baru dibuat
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Projects viewable by everyone'
  ) THEN
    CREATE POLICY "Projects viewable by everyone" ON public.projects FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Projects insertable by authenticated users'
  ) THEN
    CREATE POLICY "Projects insertable by authenticated users" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================
-- SEED DATA & NOTES VAULT
-- ============================================================

DO $SEED_COMPREHENSIVE_DATA_ANALYTICS$
DECLARE
  v_user_id UUID;
  v_parent_ai_id UUID;
  v_cat_da UUID;
  v_cat_nlp UUID;
  v_cat_ts UUID;
  v_cat_ml UUID;
  v_has_icon BOOLEAN;
  v_has_parent BOOLEAN;
  v_mod_da UUID;
  v_mod_ml UUID;
  v_mod_ts UUID;
  v_mod_nlp UUID;
BEGIN
  -- 1. Dapatkan user_id valid untuk pemilik data
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

  -- Kategori Induk: Kecerdasan Buatan
  SELECT id INTO v_parent_ai_id FROM categories WHERE name = 'Kecerdasan Buatan' LIMIT 1;
  IF v_parent_ai_id IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (''Kecerdasan Buatan'', ''#8B5CF6'', ''machine_learning'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_parent_ai_id;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Kecerdasan Buatan', '#8B5CF6', v_user_id) RETURNING id INTO v_parent_ai_id;
    END IF;
  END IF;

  -- Kategori 1: Data Analyst
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

  -- Kategori 2: Natural Language Processing
  SELECT id INTO v_cat_nlp FROM categories WHERE name = 'Natural Language Processing' LIMIT 1;
  IF v_cat_nlp IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (''Natural Language Processing'', ''#3B82F6'', ''nlp'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_nlp;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (''Natural Language Processing'', ''#3B82F6'', ''nlp'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_nlp;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Natural Language Processing', '#3B82F6', v_user_id) RETURNING id INTO v_cat_nlp;
    END IF;
  END IF;

  -- Kategori 3: Time Series Forecasting & Anomaly Detection
  SELECT id INTO v_cat_ts FROM categories WHERE name = 'Time Series Forecasting & Anomaly Detection' LIMIT 1;
  IF v_cat_ts IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (''Time Series Forecasting & Anomaly Detection'', ''#F59E0B'', ''time_series'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_ts;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (''Time Series Forecasting & Anomaly Detection'', ''#F59E0B'', ''time_series'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_ts;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Time Series Forecasting & Anomaly Detection', '#F59E0B', v_user_id) RETURNING id INTO v_cat_ts;
    END IF;
  END IF;

  -- Kategori 4: Machine Learning
  SELECT id INTO v_cat_ml FROM categories WHERE name = 'Machine Learning' LIMIT 1;
  IF v_cat_ml IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (''Machine Learning'', ''#10B981'', ''machine_learning'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_ml;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (''Machine Learning'', ''#10B981'', ''machine_learning'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_ml;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Machine Learning', '#10B981', v_user_id) RETURNING id INTO v_cat_ml;
    END IF;
  END IF;

  -- ============================================================
  -- BAGIAN 1: SEED CATATAN DATA ANALYST (CORE CURRICULUM)
  -- ============================================================

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 0: Persiapan & Instalasi Lingkungan',
    'da-bab-0-persiapan-instalasi-lingkungan',
    $NOTE_DA_BAB_0_PERSIAPAN_INSTALASI_LINGKUNGAN$# BAB 0 — PERSIAPAN & INSTALASI LINGKUNGAN

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 3–9 dari 148 | Pandas · NumPy · Matplotlib · Seaborn · NLP · Sentiment Analysis

---

## 0.1 Mengapa Python untuk Data Analytics?

Python adalah bahasa pemrograman nomor 1 di dunia untuk Data Science, Machine Learning, dan Analytics. Kemudahan sintaks, ekosistem library yang sangat kaya, dan komunitas global yang aktif menjadikan Python pilihan utama baik di industri maupun akademik.

| Keunggulan | Penjelasan | Manfaat |
| :--- | :--- | :--- |
| **Mudah Dipelajari** | Sintaks mirip bahasa Inggris, kurva belajar rendah | Cocok untuk pemula non-CS |
| **Ekosistem Luar Biasa** | Pandas, NumPy, Sklearn, TensorFlow, dll | Satu bahasa untuk semua kebutuhan |
| **Komunitas Global** | Jutaan pengguna, ribuan tutorial gratis | Solusi selalu tersedia |
| **Open Source** | Gratis, tidak ada biaya lisensi | Cocok untuk semua skala proyek |
| **Versatile** | Analytics → ML → Web → Automation | ROI pembelajaran tinggi |
| **Industry Standard** | Google, Netflix, Airbnb, Tokopedia pakai Python | Relevan di pasar kerja |

---

## 0.2 Instalasi — Pilih Sesuai Kebutuhan

### Opsi 1: Google Colab (Paling Cepat, Gratis)
> [!TIP]
> **Rekomendasi untuk pemula:** Gunakan Google Colab di [colab.research.google.com](https://colab.research.google.com) — tidak perlu instalasi, langsung bisa coding dari browser, gratis GPU!

```python
# Google Colab — Zero Installation
# Tidak perlu instalasi! Cukup buka browser dan kunjungi:
# https://colab.research.google.com
# Di Colab, semua library sudah terinstall. Langsung import:
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

print('Siap digunakan!')
```

### Opsi 2: Anaconda Distribution (Direkomendasikan untuk Lokal)
```bash
# Anaconda Installation
# 1. Download dari: https://www.anaconda.com/download
# Pilih versi sesuai OS: Windows / macOS / Linux
# 2. Setelah install, buka 'Anaconda Prompt' (Windows) atau Terminal (macOS/Linux)
# 3. Update conda ke versi terbaru
conda update conda

# 4. Install library data science
conda install pandas numpy matplotlib seaborn jupyter scipy

# 5. Atau buat environment baru (lebih rapi)
conda create -n dataenv python=3.11
conda activate dataenv
conda install pandas numpy matplotlib seaborn jupyter scipy scikit-learn

# 6. Verifikasi instalasi
python -c "import pandas; print(pandas.__version__)"
```

### Opsi 3: pip + venv (untuk yang sudah berpengalaman)
```bash
# pip + venv Installation
# 1. Download Python dari: https://www.python.org/downloads/
# Centang 'Add Python to PATH' saat instalasi
# 2. Buat virtual environment
python -m venv venv_analytics
source venv_analytics/bin/activate # macOS/Linux
venv_analytics\\Scripts\\activate    # Windows

# 3. Install library
pip install pandas numpy matplotlib seaborn jupyter scipy scikit-learn openpyxl

# 4. Simpan dependencies ke file
pip freeze > requirements.txt

# 5. Reinstall di komputer lain
pip install -r requirements.txt
```

---

## 0.3 Jupyter Notebook — Lingkungan Kerja Utama

Jupyter Notebook adalah aplikasi web interaktif yang memungkinkan Anda menulis kode, menjalankannya secara langsung, dan melihat output (teks, grafik, tabel) tepat di bawah kode. Sangat ideal untuk eksplorasi dan presentasi analisis data.

```bash
# Jupyter Notebook Usage
# Jalankan Jupyter Notebook
jupyter notebook

# Atau JupyterLab (versi lebih modern dengan IDE feel)
jupyter lab

# Buka di browser: http://localhost:8888
```

### Magic Commands (Khusus Jupyter)
```python
%matplotlib inline   # tampilkan plot di dalam notebook
%time kode_anda()    # ukur waktu eksekusi
%timeit kode_anda()  # ukur waktu rata-rata (multiple runs)
%who                 # tampilkan semua variabel aktif
%whos                # tampilkan detail semua variabel
%%time               # ukur waktu seluruh cell
```

### Shortcut Keyboard Penting
1. `Shift + Enter` : Jalankan cell, pindah ke cell berikutnya
2. `Ctrl + Enter` : Jalankan cell, tetap di cell
3. `Alt + Enter` : Jalankan cell, buat cell baru di bawah
4. `A` : Insert cell di atas (command mode)
5. `B` : Insert cell di bawah (command mode)
6. `DD` : Hapus cell (tekan D dua kali)
7. `M` : Ubah cell ke Markdown
8. `Y` : Ubah cell ke Code
9. `Ctrl + Z` : Undo
10. `Tab` : Auto-complete
11. `Shift + Tab` : Tampilkan docstring/help

---

## 0.4 Python Dasar yang Wajib Dikuasai

### Tipe Data & Struktur Data Python
```python
# Tipe Data Python
# Tipe data dasar 
x = 42              # int
y = 3.14            # float
s = 'Hello Python'  # str
b = True            # bool
n = None            # NoneType

# List — urut, bisa duplikat, mutable 
angka = [1, 2, 3, 4, 5]
angka.append(6)       # tambah ke belakang
angka.insert(0, 0)     # tambah ke posisi 0
angka.pop()           # hapus elemen terakhir
angka[0]              # akses elemen pertama
angka[1:4]            # slicing
len(angka)            # panjang list
[x**2 for x in angka] # list comprehension

# Dictionary — pasangan key-value 
mahasiswa = {'nama': 'Budi', 'nim': '12345', 'nilai': 85}
mahasiswa['nama']               # akses value
mahasiswa['kota'] = 'Jakarta'   # tambah key baru
mahasiswa.get('email', 'N/A')   # akses aman dengan default
mahasiswa.keys()                # semua key
mahasiswa.values()              # semua value
mahasiswa.items()               # pasangan key-value

# Set — unik, tidak urut 
buah = {'apel', 'jeruk', 'mangga', 'apel'}  # {'apel', 'jeruk', 'mangga'}
buah.add('pisang')
buah.discard('apel')

# Tuple — urut, immutable 
koordinat = (10.5, -7.3)  # tidak bisa diubah
```

### Kontrol Alur & Fungsi
```python
# Kontrol Alur & Fungsi
# Kondisi 
nilai = 85
if nilai >= 90:
    print('A')
elif nilai >= 80:
    print('B')
elif nilai >= 70:
    print('C')
else:
    print('D')

# Ternary (satu baris)
grade = 'Lulus' if nilai >= 70 else 'Gagal'

# Loop 
for i in range(5):  # 0, 1, 2, 3, 4
    print(i)

for nama in ['Budi', 'Ani', 'Citra']:
    print(f'Halo, {nama}!')

for i, nama in enumerate(['A', 'B', 'C']):
    print(f'{i}: {nama}')  # 0: A, 1: B, 2: C

# While loop
total = 0
while total < 100:
    total += 10

# Fungsi 
def hitung_statistik(data, ddof=1):
    \"\"\"
    Hitung statistik deskriptif dari list angka.
    Args:
        data: list atau iterable berisi angka
        ddof: degrees of freedom untuk std (default=1 untuk sampel)
    Returns:
        dict berisi mean, median, std, min, max
    \"\"\"
    n = len(data)
    mean = sum(data) / n
    sorted_data = sorted(data)
    median = sorted_data[n//2] if n%2==1 else (sorted_data[n//2-1] + sorted_data[n//2])/2
    variance = sum((x - mean)**2 for x in data) / (n - ddof)
    std = variance ** 0.5
    return {
        'n': n, 'mean': mean, 'median': median,
        'std': std, 'min': min(data), 'max': max(data)
    }

hasil = hitung_statistik([75, 85, 90, 78, 92, 88])
print(hasil)

# Lambda & Higher-order functions 
kuadrat = lambda x: x ** 2
ganda = lambda x: x * 2

angka = [1, 2, 3, 4, 5, 6]
genap = list(filter(lambda x: x%2==0, angka))  # [2, 4, 6]
kuadrat_semua = list(map(lambda x: x**2, angka))  # [1, 4, 9, 16, 25, 36]

from functools import reduce
total = reduce(lambda a, b: a + b, angka)  # 21
```

---

## 0.5 Template Standar Data Analytics

```python
# Template Standar Project
# # TEMPLATE STANDAR DATA ANALYTICS PROJECT
# # 1. Import Library 
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
from scipy import stats
import warnings

warnings.filterwarnings('ignore')

# 2. Konfigurasi Tampilan 
pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', 100)
pd.set_option('display.float_format', '{:,.2f}'.format)
pd.set_option('display.width', 120)

plt.rcParams.update({
    'figure.figsize'   : (12, 6),
    'figure.dpi'       : 100,
    'axes.titlesize'   : 14,
    'axes.labelsize'   : 12,
    'xtick.labelsize'  : 10,
    'ytick.labelsize'  : 10,
    'axes.spines.top'  : False,
    'axes.spines.right': False,
    'axes.grid'        : True,
    'grid.alpha'       : 0.3,
    'font.family'      : 'sans-serif',
})

sns.set_theme(style='whitegrid', palette='deep', font_scale=1.1)

# 3. Konstanta Proyek 
DATA_PATH = 'data/'
OUTPUT_PATH = 'output/'
RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

print(' Setup selesai — siap analisis!')
```

---

## LATIHAN SOAL & TANTANGAN

1. Apa perbedaan antara Anaconda dan pip? Kapan sebaiknya menggunakan masing-masing?
2. Jelaskan perbedaan antara list, tuple, set, dan dictionary di Python!
3. Apa yang dimaksud dengan 'virtual environment' dan mengapa penting untuk digunakan?
4. Tulis fungsi Python untuk menghitung faktorial menggunakan rekursi DAN iterasi!
5. Apa kegunaan magic command `%timeit` di Jupyter? Berikan contoh penggunaannya!
6. Jelaskan perbedaan antara list comprehension dan fungsi `map()`. Mana yang lebih efisien?

---

## KUNCI JAWABAN / PETUNJUK

1. **Anaconda vs pip**:
   * **Anaconda** = distribusi Python lengkap dengan GUI (Navigator) & conda package manager yang mengelola dependensi non-Python (C/C++ binaries). Sangat cocok untuk pemula dan data science environment.
   * **pip** = package manager bawaan resmi Python (lebih ringan, cepat, cocok untuk developer berpengalaman dan container Docker).
2. **Koleksi Python**:
1. **List**: urut, mutable (dapat diubah), mengizinkan duplikat `[1, 2, 2]`.
2. **Tuple**: urut, immutable (tidak dapat diubah setelah dibuat) `(10, 20)`.
3. **Set**: tidak berurutan, unik (tanpa duplikat), mutable `{1, 2, 3}`.
4. **Dict**: pasangan key-value, key bersifat unik, mutable `{'a': 1}`.
3. **Virtual Environment**: Isolasi dependensi per proyek sehingga proyek A yang membutuhkan Pandas 1.5 tidak bentrok dengan proyek B yang membutuhkan Pandas 2.2.
4. **Fungsi Faktorial**:
   ```python
   # Rekursi
   def faktorial_rekursi(n):
       return 1 if n <= 1 else n * faktorial_rekursi(n - 1)

   # Iterasi
   def faktorial_iterasi(n):
       h = 1
       for i in range(2, n + 1):
           h *= i
       return h
   ```
5. **`%timeit`**: Mengukur waktu rata-rata eksekusi baris kode secara akurat dengan menjalankan iterasi berkali-kali secara otomatis untuk meminimalkan fluktuasi OS. Contoh: `%timeit [x**2 for x in range(1000)]`.
6. **List Comprehension vs `map()`**: List comprehension umumnya lebih cepat dan lebih *Pythonic* karena dioptimalkan pada bytecode Python. Fungsi `map()` mengembalikan iterator (*lazy evaluation*) sehingga sedikit lebih hemat memori jika hanya perlu diiterasi sekali pada dataset besar tanpa diubah ke `list()`.
$NOTE_DA_BAB_0_PERSIAPAN_INSTALASI_LINGKUNGAN$,
    'BookOpen',
    0,
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

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Data Analytics — Konsep & Alur Kerja',
    'da-bab-1-konsep-dasar-alur-kerja',
    $NOTE_DA_BAB_1_KONSEP_DASAR_ALUR_KERJA$# BAB 1 — DATA ANALYTICS: KONSEP & ALUR KERJA

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 10–24 dari 148 | Pandas · NumPy · Matplotlib · Seaborn · NLP · Sentiment Analysis

---

## 1.1 Apa itu Data Analytics?

**Data Analytics** adalah proses sistematis untuk mengolah data mentah menjadi informasi yang bernilai dan dapat mendukung keputusan bisnis. Prosesnya mencakup inspeksi, pembersihan, transformasi, pemodelan, dan interpretasi data.

> [!NOTE]
> **Data Analytics ≠ Data Science.** Data Analytics fokus pada analisis data historis untuk menjawab pertanyaan bisnis spesifik. Data Science lebih luas, mencakup Machine Learning, AI, dan pembuatan model prediktif baru.

### 4 Jenis Data Analytics
| Jenis | Pertanyaan Kunci | Contoh Nyata |
| :--- | :--- | :--- |
| **Descriptive** | *Apa yang terjadi?* | Dashboard penjualan bulanan, laporan KPI monitoring |
| **Diagnostic** | *Mengapa terjadi?* | Investigasi penurunan revenue, analisis churn pelanggan |
| **Predictive** | *Apa yang akan terjadi?* | Forecast permintaan stok produk, prediksi risiko kredit nasabah |
| **Prescriptive** | *Apa yang harus dilakukan?* | Optimasi harga dinamis, rekomendasi alokasi anggaran iklan |

---

## 1.2 Siklus Hidup Data Analytics (CRISP-DM)

1. **Business Understanding**: Definisikan masalah bisnis. Apa KPI-nya? Siapa stakeholder-nya? Apa definisi sukses?
2. **Data Understanding**: Kumpulkan & eksplorasi data awal. Cek kualitas, identifikasi potensi masalah.
3. **Data Preparation**: Bersihkan, transformasi, dan siapkan data untuk analisis (**80% waktu analis berada di tahap ini!**).
4. **Modeling**: Terapkan statistik, agregasi, atau model ML sesuai tujuan bisnis.
5. **Evaluation**: Validasi hasil. Apakah menjawab pertanyaan bisnis? Apakah insight dapat ditindaklanjuti?
6. **Deployment**: Implementasikan insight: dashboard interaktif, laporan eksekutif, sistem rekomendasi, atau otomatisasi.

---

## 1.3 Eksplorasi Data Awal (EDA)

```python
# EDA Komprehensif
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('data.csv')

# STEP 1: Gambaran Umum 
print(f'Shape: {df.shape}')  # (baris, kolom)
print(f'Columns: {df.columns.tolist()}')
print(f'Memory: {df.memory_usage(deep=True).sum()/1024:.1f} KB')
df.head(10)                    # 10 baris pertama
df.sample(5, random_state=42)  # 5 baris acak

# STEP 2: Info & Tipe Data 
df.info(verbose=True, show_counts=True)
print(df.dtypes)

# STEP 3: Statistik Deskriptif 
df.describe(include='all').T  # transpose agar mudah dibaca

# STEP 4: Nilai Unik & Frekuensi 
for col in df.select_dtypes('object').columns:
    print(f'\\n{col} ({df[col].nunique()} unique):')
    print(df[col].value_counts().head(10))

# STEP 5: Missing Values 
missing = pd.DataFrame({
    'Jumlah_NaN': df.isnull().sum(),
    'Persen_NaN': (df.isnull().sum() / len(df) * 100).round(2),
    'Tipe_Data' : df.dtypes
}).sort_values('Persen_NaN', ascending=False)
print(missing[missing['Jumlah_NaN'] > 0])

# STEP 6: Korelasi Numerik 
corr = df.select_dtypes('number').corr()
plt.figure(figsize=(10, 8))
sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm',
            center=0, square=True, linewidths=0.5)
plt.title('Matriks Korelasi')
plt.tight_layout()
plt.show()

# STEP 7: Distribusi Kolom Numerik 
num_cols = df.select_dtypes('number').columns
n = len(num_cols)
fig, axes = plt.subplots(nrows=(n+2)//3, ncols=3, figsize=(15, 4*((n+2)//3)))
axes = axes.flatten()
for i, col in enumerate(num_cols):
    sns.histplot(df[col].dropna(), kde=True, ax=axes[i])
    axes[i].set_title(f'{col}\\nSkew: {df[col].skew():.2f}')
for j in range(i+1, len(axes)):
    axes[j].set_visible(False)
plt.suptitle('Distribusi Kolom Numerik', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()
```

---

## 1.4 Data Cleaning Sistematis

```python
# Data Cleaning Pipeline
# Fungsi Audit Data 
def audit_dataframe(df):
    \"\"\"Audit komprehensif DataFrame.\"\"\"
    print('='*60)
    print('DATA AUDIT REPORT')
    print('='*60)
    print(f'Shape          : {df.shape}')
    print(f'Total Cells    : {df.size:,}')
    print(f'Memory Usage   : {df.memory_usage(deep=True).sum()/1024**2:.2f} MB')
    print(f'Duplicate Rows : {df.duplicated().sum():,}')
    print(f'Columns w/ NaN : {df.isnull().any().sum()}')
    print(f'Total NaN Cells: {df.isnull().sum().sum():,}')
    print()
    print('PER COLUMN:')
    for col in df.columns:
        nan_pct = df[col].isnull().mean() * 100
        unique = df[col].nunique()
        dtype = df[col].dtype
        print(f'  {col:25} | dtype={str(dtype):10} | unique={unique:6,} | NaN={nan_pct:.1f}%')
    print('='*60)

audit_dataframe(df)

# Pipeline Cleaning 
def clean_dataframe(df, copy=True):
    \"\"\"Pipeline pembersihan data standar.\"\"\"
    if copy: 
        df = df.copy()
    
    # 1. Hapus duplikat
    n_before = len(df)
    df.drop_duplicates(inplace=True)
    print(f'Duplikat dihapus: {n_before - len(df):,} baris')
    
    # 2. Standardisasi nama kolom
    df.columns = (df.columns
                  .str.strip()                     # hapus spasi di ujung
                  .str.lower()                     # lowercase
                  .str.replace(' ', '_')           # spasi → underscore
                  .str.replace(r'[^a-z0-9_]', '', regex=True) # hapus karakter aneh
                 )
    
    # 3. Hapus kolom yang hampir semuanya kosong (>80%)
    threshold = 0.8
    cols_to_drop = [c for c in df.columns if df[c].isnull().mean() > threshold]
    if cols_to_drop:
        print(f'Kolom dihapus (>80% NaN): {cols_to_drop}')
        df.drop(columns=cols_to_drop, inplace=True)
        
    # 4. Trim whitespace pada kolom string
    for col in df.select_dtypes('object').columns:
        df[col] = df[col].str.strip()
        df[col] = df[col].replace('', np.nan)  # string kosong → NaN
        
    return df

df = clean_dataframe(df)
```

---

## 1.5 Penanganan Outlier

```python
# Deteksi & Penanganan Outlier
# Deteksi Outlier dengan IQR 
def detect_outliers_iqr(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    outliers = df[(df[column] < lower) | (df[column] > upper)]
    print(f'{column}: {len(outliers)} outlier | batas [{lower:.2f}, {upper:.2f}]')
    return lower, upper, outliers

# Deteksi Outlier dengan Z-Score 
from scipy import stats

def detect_outliers_zscore(df, column, threshold=3):
    z_scores = np.abs(stats.zscore(df[column].dropna()))
    outlier_mask = z_scores > threshold
    print(f'{column}: {outlier_mask.sum()} outlier (|z| > {threshold})')
    return outlier_mask

# Visualisasi Outlier 
def visualize_outliers(df, columns):
    fig, axes = plt.subplots(2, len(columns), figsize=(5*len(columns), 8))
    for i, col in enumerate(columns):
        # Boxplot
        axes[0, i].boxplot(df[col].dropna(), notch=True, patch_artist=True,
                          boxprops=dict(facecolor='lightblue'))
        axes[0, i].set_title(f'{col} — Boxplot')
        # Histogram
        axes[1, i].hist(df[col].dropna(), bins=30, edgecolor='white', color='steelblue')
        axes[1, i].set_title(f'{col} — Histogram')
    plt.tight_layout()
    plt.show()

# Strategi Penanganan Outlier 
# Opsi 1: Hapus outlier
lower, upper, _ = detect_outliers_iqr(df, 'harga')
df_clean = df[(df['harga'] >= lower) & (df['harga'] <= upper)]

# Opsi 2: Winsorize (clip ke batas)
df['harga_clipped'] = df['harga'].clip(lower=lower, upper=upper)

# Opsi 3: Log transform (untuk distribusi sangat skewed)
df['harga_log'] = np.log1p(df['harga'])  # log(1+x) aman untuk nilai nol
```

---

## 1.6 Feature Engineering

```python
# Feature Engineering
# Buat fitur baru dari kolom yang ada 
# 1. Fitur dari operasi matematika
df['profit_margin'] = (df['profit'] / df['revenue'] * 100).round(2)
df['revenue_per_unit'] = df['revenue'] / df['qty'].replace(0, np.nan)

# 2. Fitur dari datetime
df['tanggal'] = pd.to_datetime(df['tanggal'])
df['tahun'] = df['tanggal'].dt.year
df['bulan'] = df['tanggal'].dt.month
df['hari'] = df['tanggal'].dt.day
df['hari_minggu'] = df['tanggal'].dt.dayofweek  # 0=Senin, 6=Minggu
df['nama_hari'] = df['tanggal'].dt.day_name()
df['kuartal'] = df['tanggal'].dt.quarter
df['is_weekend'] = df['hari_minggu'].isin([5, 6]).astype(int)
df['minggu_ke'] = df['tanggal'].dt.isocalendar().week

# 3. Fitur kategorikal dari numerik (binning)
df['kategori_usia'] = pd.cut(df['usia'],
                             bins=[0, 18, 25, 35, 50, 100],
                             labels=['Remaja', 'Dewasa Muda', 'Dewasa', 'Paruh Baya', 'Senior'])

df['kuartil_pendapatan'] = pd.qcut(df['pendapatan'], q=4,
                                    labels=['Q1 Rendah', 'Q2 Menengah', 'Q3 Atas', 'Q4 Tinggi'])

# 4. Fitur aggregasi (group statistics)
df['avg_rev_per_kota'] = df.groupby('kota')['revenue'].transform('mean')
df['rank_dalam_kota'] = df.groupby('kota')['revenue'].rank(ascending=False)
df['pct_revenue_kota'] = df['revenue'] / df.groupby('kota')['revenue'].transform('sum')

# 5. One-Hot Encoding untuk ML
df_encoded = pd.get_dummies(df, columns=['kategori', 'kota'], prefix=['kat', 'kot'])

# 6. Label Encoding
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
df['status_encoded'] = le.fit_transform(df['status'])
```

---

## 1.7 Studi Kasus: Analisis Penjualan E-Commerce

 **Skenario:** Anda adalah Data Analyst di startup e-commerce. CEO meminta analisis kinerja penjualan Q1-Q4 2024, identifikasi tren, dan rekomendasi strategi tahun depan.

```python
# STUDI KASUS: E-Commerce Analytics Dashboard
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import seaborn as sns
from datetime import datetime, timedelta
import warnings

warnings.filterwarnings('ignore')

# Simulasi Data 
np.random.seed(42)
n = 5000
tanggal = pd.date_range('2024-01-01', '2024-12-31', periods=n)
kategori_list = ['Elektronik', 'Fashion', 'Makanan', 'Olahraga', 'Kecantikan']
kota_list = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar']

df = pd.DataFrame({
    'tanggal'   : tanggal,
    'order_id'  : [f'ORD-{i:05d}' for i in range(n)],
    'kategori'  : np.random.choice(kategori_list, n, p=[0.3, 0.25, 0.2, 0.15, 0.1]),
    'kota'      : np.random.choice(kota_list, n, p=[0.35, 0.2, 0.15, 0.1, 0.1, 0.1]),
    'qty'       : np.random.randint(1, 10, n),
    'harga'     : np.random.lognormal(mean=13, sigma=1.2, size=n).round(-3),
    'diskon_pct': np.random.choice([0, 5, 10, 15, 20, 25, 30], n,
                                    p=[0.4, 0.1, 0.15, 0.15, 0.1, 0.05, 0.05]),
})

# Feature Engineering 
df['revenue'] = df['qty'] * df['harga']
df['diskon_rp'] = df['revenue'] * df['diskon_pct'] / 100
df['net_revenue'] = df['revenue'] - df['diskon_rp']
df['profit'] = df['net_revenue'] * np.random.uniform(0.1, 0.35, n)
df['bulan'] = df['tanggal'].dt.month
df['nama_bulan'] = df['tanggal'].dt.strftime('%b')
df['kuartal'] = df['tanggal'].dt.quarter
df['hari_minggu'] = df['tanggal'].dt.day_name()
df['is_weekend'] = df['tanggal'].dt.dayofweek.isin([5, 6])

# Summary KPI 
total_rev = df['net_revenue'].sum()
total_order = df['order_id'].nunique()
aov = total_rev / total_order  # Average Order Value
total_profit = df['profit'].sum()
profit_margin = total_profit / total_rev * 100

print('='*50)
print('          KPI RINGKASAN 2024')
print('='*50)
print(f'Total Revenue    : Rp {total_rev:>15,.0f}')
print(f'Total Orders     : {total_order:>15,}')
print(f'Avg Order Value  : Rp {aov:>15,.0f}')
print(f'Total Profit     : Rp {total_profit:>15,.0f}')
print(f'Profit Margin    : {profit_margin:>14.1f}%')
print('='*50)

# Dashboard Visualisasi 
fig = plt.figure(figsize=(18, 14))
fig.suptitle('DASHBOARD KINERJA E-COMMERCE 2024', fontsize=18, fontweight='bold', y=0.98)
gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.45, wspace=0.35)

# -- Plot 1: Trend Revenue Bulanan (full width) ---
ax1 = fig.add_subplot(gs[0, :])
monthly = df.groupby('bulan').agg(
    revenue=('net_revenue', 'sum'),
    profit=('profit', 'sum'),
    orders=('order_id', 'nunique')).reset_index()
monthly['bulan_nama'] = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
ax1b = ax1.twinx()
ax1.bar(monthly['bulan_nama'], monthly['revenue']/1e9,
        color='steelblue', alpha=0.7, label='Revenue (Miliar)')
ax1b.plot(monthly['bulan_nama'], monthly['orders'],
         'ro-', linewidth=2, markersize=6, label='Jumlah Order')
ax1.set_ylabel('Revenue (Miliar Rp)', color='steelblue')
ax1b.set_ylabel('Jumlah Order', color='red')
ax1.set_title('Trend Revenue & Order Bulanan 2024', fontsize=13)
ax1.legend(loc='upper left')
ax1b.legend(loc='upper right')

# -- Plot 2: Revenue per Kategori -----------------
ax2 = fig.add_subplot(gs[1, 0])
kat_rev = df.groupby('kategori')['net_revenue'].sum().sort_values()
bars = ax2.barh(kat_rev.index, kat_rev.values/1e9, color='coral')
for bar in bars:
    ax2.text(bar.get_width()+0.1, bar.get_y()+bar.get_height()/2,
             f'{bar.get_width():.1f}B', va='center', fontsize=9)
ax2.set_title('Revenue per Kategori')
ax2.set_xlabel('Miliar Rp')

# -- Plot 3: Revenue per Kota (Pie) ---------------
ax3 = fig.add_subplot(gs[1, 1])
kota_rev = df.groupby('kota')['net_revenue'].sum()
ax3.pie(kota_rev.values, labels=kota_rev.index, autopct='%1.1f%%',
        startangle=90, colors=sns.color_palette('husl', len(kota_rev)))
ax3.set_title('Distribusi Revenue per Kota')

# -- Plot 4: Kuartil Performance ------------------
ax4 = fig.add_subplot(gs[1, 2])
q_data = df.groupby('kuartal')['net_revenue'].sum()
colors_q = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3']
ax4.bar([f'Q{i}' for i in q_data.index], q_data.values/1e9,
        color=colors_q, edgecolor='white')
ax4.set_title('Revenue per Kuartal')
ax4.set_ylabel('Miliar Rp')

# -- Plot 5: Distribusi Diskon ---------------------
ax5 = fig.add_subplot(gs[2, 0])
diskon_rev = df.groupby('diskon_pct')['net_revenue'].sum()
ax5.bar(diskon_rev.index, diskon_rev.values/1e9, color='mediumpurple')
ax5.set_xlabel('Diskon (%)')
ax5.set_ylabel('Revenue (Miliar Rp)')
ax5.set_title('Revenue per Tingkat Diskon')

# -- Plot 6: Weekend vs Weekday -------------------
ax6 = fig.add_subplot(gs[2, 1])
wd_data = df.groupby('is_weekend')['net_revenue'].sum()
ax6.bar(['Weekday', 'Weekend'], wd_data.values/1e9,
        color=['steelblue', 'salmon'], edgecolor='white')
ax6.set_title('Weekday vs Weekend Revenue')
ax6.set_ylabel('Miliar Rp')

# -- Plot 7: Heatmap Kota x Kategori --------------
ax7 = fig.add_subplot(gs[2, 2])
pivot = df.pivot_table(values='net_revenue', index='kota',
                       columns='kategori', aggfunc='sum') / 1e9
sns.heatmap(pivot, annot=True, fmt='.0f', cmap='YlOrRd',
            ax=ax7, cbar_kws={'shrink': 0.8})
ax7.set_title('Heatmap Revenue (Miliar)\\nKota × Kategori')
plt.savefig('dashboard_ecommerce.png', dpi=150, bbox_inches='tight')
plt.show()

# Rekomendasi Otomatis 
best_bulan = monthly.loc[monthly['revenue'].idxmax(), 'bulan_nama']
best_kategori = kat_rev.idxmax()
best_kota = kota_rev.idxmax()

print('\\n=== REKOMENDASI STRATEGI 2025 ===')
print(f' Fokus promosi di bulan {best_bulan} (peak season)')
print(f' Perbesar investasi kategori {best_kategori} (revenue tertinggi)')
print(f' Ekspansi operasional di {best_kota} (kota terkuat)')
print(f' Tingkatkan diskon 10-15% (sweet spot berdasarkan data)')
print(f' Aktifkan kampanye Weekend khusus untuk meningkatkan conversion')
```

---

## 1.8 Analytical Thinking dan Data Thinking

Sebelum menyentuh baris kode apa pun, seorang Data Analyst yang baik terlebih dahulu berpikir secara analitis. **Analytical thinking** adalah kemampuan memecah masalah besar menjadi bagian-bagian kecil yang dapat diukur, sementara **data thinking** adalah kebiasaan menerjemahkan pertanyaan bisnis menjadi pertanyaan yang bisa dijawab dengan data.

Pola pikir ini biasanya mengikuti empat tahap berulang:
1. **Klarifikasi masalah**: Pastikan pertanyaan bisnis benar-benar jelas sebelum membuka Jupyter Notebook. Pertanyaan *"kenapa penjualan turun?"* masih terlalu luas; versi yang bisa dianalisis adalah *"kategori dan wilayah mana yang menyumbang penurunan revenue terbesar pada Q3 dibanding Q2?"*
2. **Dekomposisi**: Pecah masalah menjadi sub-pertanyaan yang lebih kecil (per kategori, per wilayah, per channel, per segmen pelanggan).
3. **Validasi asumsi dengan data**: Setiap dugaan (hipotesis) diuji dengan angka, bukan opini.
4. **Sintesis menjadi rekomendasi**: Hasil akhirnya bukan sekadar angka, tetapi tindakan yang bisa diambil oleh pengambil keputusan.

> [!WARNING]
> Kesalahan yang paling sering dilakukan pemula adalah langsung membuka dataset dan melakukan `.describe()` tanpa tahu pertanyaan bisnis apa yang sedang dijawab. Analisis tanpa pertanyaan yang jelas hanya menghasilkan angka, bukan insight.

---

## 1.9 Business Analytics, Problem Solving, dan Decision Making

Business Analytics adalah penerapan *analytical thinking* dalam konteks organisasi — menghubungkan data dengan keputusan operasional maupun strategis. Empat level analisis saling melengkapi:
1. **Descriptive Analytics** — *Apa yang terjadi?* Contoh output: dashboard penjualan bulanan.
2. **Diagnostic Analytics** — *Mengapa itu terjadi?* Contoh output: root cause analysis churn pelanggan.
3. **Predictive Analytics** — *Apa yang mungkin terjadi?* Contoh output: forecast demand 3 bulan ke depan.
4. **Prescriptive Analytics** — *Apa yang sebaiknya dilakukan?* Contoh output: rekomendasi alokasi budget marketing.

Alur pengambilan keputusan berbasis data (*data-driven decision making*):
$$\\text{Data} \\longrightarrow \\text{Informasi} \\longrightarrow \\text{Insight} \\longrightarrow \\text{Keputusan} \\longrightarrow \\text{Aksi} \\longrightarrow \\text{Dampak}$$

---

## 1.10 Business Metrics, KPI, OKR, dan North Star Metric

1. **Metric**: Angka pengukuran mentah, contoh: jumlah transaksi harian.
2. **KPI (Key Performance Indicator)**: Metric yang dipilih secara sadar karena berkaitan langsung dengan tujuan bisnis, memiliki target dan periode evaluasi. Contoh: *"Conversion rate ≥ 3% per bulan"*.
3. **OKR (Objective and Key Results)**: Kerangka penetapan tujuan yang terdiri dari satu Objective kualitatif dan beberapa Key Result kuantitatif. Contoh: Objective *"Meningkatkan loyalitas pelanggan e-commerce"*, dengan Key Result *"Repeat purchase rate naik dari 22% ke 30%"*.
4. **North Star Metric**: Satu metric tunggal yang paling merepresentasikan nilai inti yang diberikan produk ke pelanggan sekaligus memprediksi kesuksesan bisnis jangka panjang. Contoh: Spotify menggunakan *time spent listening*, Airbnb menggunakan *nights booked*.

---

## 1.11 Data Maturity dan Analytics Maturity Model

Lima tingkat kematangan analitik organisasi:
1. **Ad-hoc**: Data tersebar di spreadsheet individu, tidak ada standar.
2. **Reporting**: Laporan rutin sudah ada, tetapi masih manual dan reaktif.
3. **Analytics**: Organisasi mulai melakukan analisis diagnostik dan menjawab "mengapa", didukung tim analyst dedicated.
4. **Predictive**: Mulai menggunakan model prediktif untuk forecasting dan segmentasi.
5. **Prescriptive / AI-Driven**: Keputusan sebagian besar sudah dibantu sistem otomatis dan model machine learning yang terintegrasi ke proses bisnis.

---

## 1.12 OSEMN Framework sebagai Pelengkap CRISP-DM

1. **O — Obtain**: Mengumpulkan data dari database, API, file, atau web scraping.
2. **S — Scrub**: Membersihkan data (setara "Data Preparation" pada CRISP-DM).
3. **E — Explore**: EDA, visualisasi awal, mencari pola dan korelasi.
4. **M — Model**: Membangun model statistik atau machine learning bila diperlukan.
5. **N — iNterpret**: Menerjemahkan hasil model menjadi insight dan narasi bisnis.

---

## 1.13 Data Governance, Privacy, Ethics, dan Security

1. **Data Governance**: Kebijakan yang mengatur siapa yang boleh mengakses data apa, data dictionary, master data, dan data ownership.
2. **Data Privacy**: Perlindungan data pribadi (PII — *Personally Identifiable Information*). Di Indonesia diatur dalam **UU Perlindungan Data Pribadi (UU PDP)**.
3. **Data Ethics**: Penggunaan data secara bertanggung jawab dan menghindari bias diskriminatif.
4. **Data Security**: Enkripsi, Role-Based Access Control (RBAC), dan anonimisasi/masking data sensitif.

---

## 1.14 Data Quality Framework

Enam dimensi evaluasi kualitas data:
1. **Accuracy**: Apakah nilai datanya benar dan sesuai kenyataan?
2. **Completeness**: Apakah ada data yang hilang (*missing values*)?
3. **Consistency**: Apakah format dan nilai konsisten antar tabel/sistem?
4. **Timeliness**: Apakah data cukup mutakhir untuk keputusan yang diambil?
5. **Uniqueness**: Apakah ada duplikasi baris atau entitas?
6. **Validity**: Apakah data mengikuti format aturan domain (format tanggal, batas nilai)?

---

## 1.15 Storytelling with Data

Struktur narasi klasik:
1. **Situation**: Konteks bisnis saat ini.
2. **Complication**: Masalah atau perubahan yang terdeteksi lewat analisis data.
3. **Resolution**: Insight dan rekomendasi tindakan berbasis data.

*Prinsip praktis:* Satu visual hanya menyampaikan satu pesan utama, judul grafik berupa kalimat *insight* (bukan hanya label), dan warna digunakan secara sengaja untuk menonjolkan fokus pesan.

---

## 1.16 Root Cause Analysis, Fishbone Diagram, dan Pareto Analysis

* **Root Cause Analysis (RCA) 5 Whys**: Bertanya "mengapa" berulang kali hingga menemukan akar masalah terdalam.
* **Fishbone Diagram (Ishikawa)**: Mengelompokkan kemungkinan penyebab masalah ke dalam kategori *Man, Machine, Method, Material, Measurement, Environment*.
* **Pareto Analysis (Prinsip 80/20)**: Kurang lebih 80% dampak berasal dari 20% penyebab (misalnya 20% pelanggan menyumbang 80% revenue).

```python
# Pareto Analysis — Kontribusi Customer terhadap Revenue
import pandas as pd
import matplotlib.pyplot as plt

# Hitung revenue per customer, urutkan dari terbesar
revenue_per_customer = df.groupby('customer_id')['revenue'].sum().sort_values(ascending=False)
cumulative_pct = revenue_per_customer.cumsum() / revenue_per_customer.sum() * 100

fig, ax1 = plt.subplots(figsize=(10, 5))
ax1.bar(range(len(revenue_per_customer)), revenue_per_customer.values, color='steelblue')
ax2 = ax1.twinx()
ax2.plot(range(len(cumulative_pct)), cumulative_pct.values, color='red', marker='o', markersize=2)
ax2.axhline(80, color='green', linestyle='--', label='Garis 80%')
ax1.set_ylabel('Revenue per Customer')
ax2.set_ylabel('Kumulatif (%)')
ax1.set_title('Pareto Analysis: Kontribusi Customer terhadap Revenue')
plt.show()

# Berapa persen customer yang menyumbang 80% revenue?
n_customer_80pct = (cumulative_pct <= 80).sum()
print(f'{n_customer_80pct} dari {len(revenue_per_customer)} customer '
      f'({n_customer_80pct/len(revenue_per_customer)*100:.1f}%) menyumbang 80% revenue')
```

---

## 1.17 SWOT dan SMART Goal dalam Konteks Data

Target analisis harus mengikuti kriteria **SMART**:
1. **Specific**: Target jelas, tidak ambigu.
2. **Measurable**: Ada angka/metrik yang bisa diukur.
3. **Achievable**: Realistis berdasarkan tren historis data.
4. **Relevant**: Selaras dengan sasaran strategis bisnis.
5. **Time-bound**: Memiliki tenggat waktu evaluasi yang pasti.

---

## 1.18 Business Value dan ROI Analytics

Rumus ROI inisiatif analytics:
$$\\text{ROI (\\%)} = \\frac{\\text{Manfaat Finansial} - \\text{Biaya Inisiatif}}{\\text{Biaya Inisiatif}} \\times 100\\%$$

> [!TIP]
> **Best Practice:** Setiap laporan analisis wajib ditutup dengan 3 komponen:
> 1. **Insight**: Apa yang ditemukan dalam data.
> 2. **Rekomendasi**: Tindakan konkrit yang disarankan.
> 3. **Estimasi Dampak (ROI)**: Perkiraan nilai bisnis jika rekomendasi dijalankan.

---

## 1.19 Kesalahan Umum dalam Berpikir Analitis

1. **Correlation vs Causation**: Menganggap korelasi sebagai sebab-akibat padahal dipengaruhi variabel pengganggu (*confounding variable*).
2. **Survivorship Bias**: Hanya meneliti data yang bertahan dan mengabaikan data yang gugur.
3. **Cherry Picking**: Memilih periode atau subset data tertentu yang hanya mengonfirmasi bias pribadi.
4. **Simpson's Paradox**: Pola tren pada agregat total bisa berbalik arah saat dipecah per segmen kelompok.
5. **Analysis Paralysis**: Terlalu asyik mengeksplorasi data tanpa pernah menghasilkan keputusan atau rekomendasi aksi.

---

## QUIZ TAMBAHAN — FUNDAMENTAL DATA ANALYTICS

1. Jelaskan perbedaan antara Metric, KPI, dan OKR, lalu berikan satu contoh masing-masing dari industri e-commerce!
   * **Jawaban:** Metric = angka mentah (contoh: jumlah kunjungan harian). KPI = metric terpilih dengan target jelas (contoh: Conversion Rate ≥ 3%). OKR = kerangka tujuan kualitatif + hasil kuantitatif (contoh Objective "Meningkatkan pengalaman checkout", Key Result "Cart abandonment turun ke 55%").
2. Sebuah perusahaan retail memiliki data lengkap tetapi masih membuat laporan secara manual setiap minggu tanpa forecasting. Berada di tingkat berapa perusahaan ini dalam Analytics Maturity Model? Apa langkah selanjutnya yang disarankan?
   * **Jawaban:** Berada di tingkat 2 (Reporting) — laporan rutin sudah ada namun masih manual dan reaktif. Langkah selanjutnya: membangun otomasi laporan (dashboard live) dan mulai membangun kapabilitas analisis diagnostik sebelum melangkah ke forecasting.
3. Bandingkan CRISP-DM dan OSEMN. Dalam situasi apa Anda akan lebih memilih menggunakan salah satunya?
   * **Jawaban:** CRISP-DM lebih cocok untuk proyek besar berskala organisasi yang butuh tahapan deployment dan monitoring formal; OSEMN lebih cocok sebagai checklist kerja teknis harian seorang analyst/data scientist individu.
4. Terapkan teknik 5 Whys pada kasus: *"Tingkat komplain pelanggan pada layanan pengiriman meningkat 40% bulan ini."* Tulis minimal 4 tingkat pertanyaan "mengapa".
   * **Jawaban:** Komplain naik → Mengapa? Barang sering rusak saat sampai → Mengapa? Packaging tidak sesuai standar → Mengapa? Vendor packaging baru belum dilatih → Mengapa? Proses onboarding vendor terlalu singkat (akar masalah).
5. Sebuah dataset menunjukkan korelasi tinggi antara jumlah es krim yang terjual dan jumlah kasus tenggelam. Jelaskan mengapa ini bukan hubungan sebab-akibat, dan variabel apa yang mungkin menjadi penyebab sebenarnya!
   * **Jawaban:** Korelasi ini disebabkan oleh variabel ketiga yaitu cuaca panas/musim panas — saat cuaca panas, orang lebih banyak membeli es krim sekaligus lebih banyak berenang, sehingga risiko tenggelam ikut naik. Tidak ada hubungan sebab-akibat langsung.
6. Hitung ROI sebuah inisiatif data quality yang menghabiskan biaya Rp30 juta, dan berhasil mencegah kerugian akibat kesalahan pengiriman senilai Rp95 juta dalam 6 bulan!
   * **Jawaban:** $\\text{ROI} = \\frac{95\\text{jt} - 30\\text{jt}}{30\\text{jt}} \\times 100\\% = 216{,}7\\%$.

---

## LATIHAN SOAL & TANTANGAN
1. Jelaskan 4 jenis Data Analytics dengan contoh nyata dari industri yang berbeda!
2. Apa yang dimaksud dengan CRISP-DM? Mengapa tahap 'Data Preparation' membutuhkan 80% waktu?
3. Tulis fungsi Python untuk mendeteksi outlier menggunakan metode IQR dan Z-Score sekaligus!
4. Apa itu Feature Engineering? Berikan 5 contoh fitur baru yang bisa dibuat dari kolom tanggal!
5. Bagaimana cara membuat pivot table yang menampilkan rata-rata, total, dan count sekaligus?
6. Tulis kode EDA lengkap untuk dataset baru yang belum pernah dilihat sebelumnya!
$NOTE_DA_BAB_1_KONSEP_DASAR_ALUR_KERJA$,
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

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Pandas — Manipulasi & Analisis Data Profesional',
    'da-bab-2-pandas-manipulasi-analisis-data',
    $NOTE_DA_BAB_2_PANDAS_MANIPULASI_ANALISIS_DATA$# BAB 2 — PANDAS: MANIPULASI & ANALISIS DATA PROFESIONAL

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 25–43 dari 148 | Pandas · NumPy · Matplotlib · Seaborn · NLP · Sentiment Analysis

---

## 2.1 Series — Data Satu Dimensi

```python
# Series Lengkap
import pandas as pd
import numpy as np

# Membuat Series 
s1 = pd.Series([10, 20, 30, 40, 50])  # index default 0-4
s2 = pd.Series([85, 90, 78, 92], index=['Mat', 'IPA', 'IPS', 'Ing'])  # custom index
s3 = pd.Series({'Jakarta': 4500, 'Surabaya': 2800, 'Bandung': 2400})  # dari dict
s4 = pd.Series(np.random.randn(5), name='nilai_acak')  # dari numpy

# Akses Data Series 
s2['Mat']            # 85 — by label
s2[0]                # 85 — by posisi
s2[['Mat', 'IPA']]   # Series subset
s2[:3]               # slicing
s2[s2 > 80]          # boolean filter

# Operasi Series 
s2 + 10                                       # tambah semua elemen
s2 * 1.1                                      # kali semua elemen
s2.apply(lambda x: 'A' if x >= 90 else 'B')  # apply fungsi

# Statistik Series 
s2.mean()        # rata-rata: 86.25
s2.std()         # standar deviasi
s2.median()      # median: 87.5
s2.min()         # nilai min: 78
s2.max()         # nilai max: 92
s2.sum()         # total: 345
s2.idxmax()      # index nilai max: 'Ing'
s2.idxmin()      # index nilai min: 'IPS'
s2.rank()        # ranking
s2.cumsum()      # kumulatif
s2.pct_change()  # persentase perubahan

# Info Series 
s2.dtype         # float64
s2.index         # Index(['Mat', 'IPA', 'IPS', 'Ing'])
s2.values        # array([85, 90, 78, 92])
s2.shape         # (4,)
s2.size          # 4
s2.name          # None (bisa di-set)
```

---

## 2.2 DataFrame — Data Dua Dimensi

```python
# DataFrame Dasar
# Membuat DataFrame 
data = {
    'nama' : ['Budi', 'Ani', 'Citra', 'Dodi', 'Eka'],
    'umur' : [25, 30, 22, 35, 28],
    'kota' : ['Jakarta', 'Surabaya', 'Bandung', 'Jakarta', 'Medan'],
    'gaji' : [8e6, 12e6, 6.5e6, 15e6, 9e6],
    'dept' : ['IT', 'HR', 'IT', 'Finance', 'IT'],
    'aktif': [True, True, False, True, True]
}
df = pd.DataFrame(data)

# Info DataFrame 
df.shape                    # (5, 6)
df.ndim                     # 2
df.size                     # 30
df.dtypes                   # tipe tiap kolom
df.columns.tolist()         # nama kolom
df.index.tolist()           # [0, 1, 2, 3, 4]
df.memory_usage(deep=True)  # memory per kolom

# Tampilkan Data 
df.head(3)                  # 3 baris pertama
df.tail(2)                  # 2 baris terakhir
df.sample(3)                # 3 baris acak
df.describe()               # statistik numerik
df.describe(include='object') # statistik string

# Set Custom Index 
df2 = df.set_index('nama')  # nama jadi index
df2.loc['Budi']             # akses by nama
df.reset_index(inplace=True) # kembali ke numerik
```

---

## 2.3 Seleksi Data — .loc, .iloc, .at

```python
# Seleksi & Indexing Lengkap
# Pilih Kolom 
df['gaji']                  # satu kolom → Series
df[['nama', 'gaji', 'kota']] # beberapa kolom → DataFrame
df.filter(like='a')         # kolom yang mengandung 'a'
df.select_dtypes('number')  # hanya kolom numerik
df.select_dtypes('object')  # hanya kolom string

# .loc[ ] — Label Based 
df.loc[0]                                   # baris index 0
df.loc[0:3]                                 # baris 0 s.d 3 (INKLUSIF)
df.loc[0, 'nama']                           # sel tunggal
df.loc[[0, 2, 4]]                           # baris tertentu
df.loc[0:2, 'nama':'kota']                  # baris & kolom range
df.loc[df['gaji'] > 10e6]                   # filter kondisi
df.loc[df['gaji'] > 10e6, ['nama', 'gaji']] # filter + pilih kolom

# .iloc[ ] — Integer Position Based 
df.iloc[0]                                  # baris pertama
df.iloc[-1]                                 # baris terakhir
df.iloc[0:3]                                # baris 0,1,2 (EKSKLUSIF end)
df.iloc[:, 0:3]                             # semua baris, kolom 0-2
df.iloc[[0, 2, 4], [1, 3]]                  # baris dan kolom spesifik

# .at dan .iat — Akses Sel Tunggal (Cepat) 
df.at[0, 'nama']                            # label-based
df.iat[0, 0]                                # position-based
df.at[0, 'gaji'] = 9e6                      # update satu nilai

# .query() — Filter Ekspresif 
df.query('gaji > 10_000_000 and kota == "Jakarta"')
df.query('umur.between(25, 35) and aktif == True')
batas = 10e6
df.query('gaji > @batas')                   # gunakan variabel Python dengan @
```

---

## 2.4 Filtering & Kondisi Kompleks

```python
# Filtering Kompleks
# Filter Dasar 
df[df['umur'] > 25]
df[df['kota'] == 'Jakarta']
df[df['nama'].str.startswith('B')]

# AND, OR, NOT 
df[(df['umur'] > 25) & (df['gaji'] > 10e6)]          # AND
df[(df['kota'] == 'Jakarta') | (df['kota'] == 'Bandung')] # OR
df[~df['aktif']]                                    # NOT

# isin, between, isna 
kota_target = ['Jakarta', 'Surabaya']
df[df['kota'].isin(kota_target)]
df[~df['kota'].isin(kota_target)]
df[df['umur'].between(25, 32, inclusive='both')]
df[df['gaji'].isna()]
df[df['gaji'].notna()]

# Filter String 
df[df['nama'].str.contains('i', case=False)]
df[df['nama'].str.len() > 4]
df[df['nama'].str.match(r'^[A-C]')]                 # regex

# np.where — Kondisi dengan Nilai Pengganti 
df['kategori_gaji'] = np.where(df['gaji'] > 10e6, 'Tinggi', 'Standar')

# np.select — Multiple Conditions 
conditions = [
    df['gaji'] >= 15e6,
    (df['gaji'] >= 10e6) & (df['gaji'] < 15e6),
    (df['gaji'] >= 7e6) & (df['gaji'] < 10e6),
]
choices = ['Premium', 'Senior', 'Junior']
df['level'] = np.select(conditions, choices, default='Magang')
```

---

## 2.5 GroupBy & Agregasi Mendalam

```python
# GroupBy & Agregasi Lengkap
# GroupBy Dasar 
df.groupby('dept')['gaji'].sum()
df.groupby('dept')['gaji'].mean()
df.groupby('dept')['gaji'].agg(['sum', 'mean', 'count', 'min', 'max'])

# GroupBy Multi-Key 
df.groupby(['kota', 'dept'])['gaji'].sum().unstack(fill_value=0)

# .agg() dengan Fungsi Berbeda per Kolom 
result = df.groupby('dept').agg(
    total_gaji = ('gaji', 'sum'),
    rata_gaji = ('gaji', 'mean'),
    gaji_max = ('gaji', 'max'),
    jumlah_karyawan = ('nama', 'count'),
    rata_umur = ('umur', 'mean'),
    pct_aktif = ('aktif', 'mean'),
).round(2).reset_index()
print(result)

# .transform() — Kembalikan Ukuran Sama 
df['gaji_mean_dept'] = df.groupby('dept')['gaji'].transform('mean')
df['gaji_rank_dept'] = df.groupby('dept')['gaji'].rank(ascending=False)
df['gaji_pct_dept'] = df['gaji'] / df.groupby('dept')['gaji'].transform('sum')
df['gaji_zscore_dept'] = df.groupby('dept')['gaji'].transform(
    lambda x: (x - x.mean()) / x.std()
)

# .filter() — Filter Grup 
# Dept dengan rata-rata gaji > 10 juta
df.groupby('dept').filter(lambda x: x['gaji'].mean() > 10e6)

# apply() pada GroupBy 
def top2_by_gaji(group):
    return group.nlargest(2, 'gaji')

top2_per_dept = df.groupby('dept').apply(top2_by_gaji).reset_index(drop=True)

# Resample (untuk time series) 
df_ts = df.set_index('tanggal')                     # asumsi ada kolom tanggal
df_ts.resample('M')['revenue'].sum()                 # bulanan
df_ts.resample('Q')['revenue'].sum()                 # kuartilan
df_ts.resample('W')['revenue'].mean()                # mingguan
df_ts.resample('D').agg({'revenue': 'sum', 'qty': 'sum'})  # harian, multi kolom
```

---

## 2.6 Merge, Join & Concat

```python
# Merge, Join & Concat Lengkap
# Contoh Data 
orders = pd.DataFrame({
    'order_id': [1, 2, 3, 4, 5],
    'cust_id' : [101, 102, 101, 103, 104],
    'produk'  : ['A', 'B', 'A', 'C', 'B'],
    'jumlah'  : [500, 300, 700, 200, 450]
})
customers = pd.DataFrame({
    'cust_id': [101, 102, 103, 105],
    'nama'   : ['Budi', 'Ani', 'Citra', 'Dodi'],
    'kota'   : ['Jakarta', 'Surabaya', 'Bandung', 'Medan']
})

# pd.merge 
# INNER JOIN (hanya yang cocok di kedua sisi)
inner = pd.merge(orders, customers, on='cust_id', how='inner')

# LEFT JOIN (semua dari orders, match dari customers)
left = pd.merge(orders, customers, on='cust_id', how='left')

# RIGHT JOIN (semua dari customers)
right = pd.merge(orders, customers, on='cust_id', how='right')

# OUTER JOIN (semua dari kedua sisi)
outer = pd.merge(orders, customers, on='cust_id', how='outer', indicator=True)

# Merge dengan nama kolom berbeda
pd.merge(orders, customers, left_on='cust_id', right_on='cust_id')

# Merge dengan multi-key
pd.merge(df1, df2, on=['tahun', 'bulan', 'kota'])

# Validasi relasi (m:1)
pd.merge(orders, customers, on='cust_id', how='left', validate='m:1')

# pd.concat 
# Vertikal (tambah baris)
df_all = pd.concat([df_jan, df_feb, df_mar], ignore_index=True)
df_all = pd.concat([df_jan, df_feb], keys=['Jan', 'Feb'])  # dengan label

# Horizontal (tambah kolom)
df_wide = pd.concat([df_info, df_scores], axis=1)

# Cross Join (semua kombinasi) 
produk = pd.DataFrame({'produk': ['A', 'B', 'C']})
toko = pd.DataFrame({'toko': ['X', 'Y']})
cross = produk.merge(toko, how='cross')
# → 6 baris: (A,X),(A,Y),(B,X),(B,Y),(C,X),(C,Y)
```

---

## 2.7 String Operations

```python
# String Operations
df = pd.DataFrame({
    'nama' : [' Budi Santoso ', 'ani WIJAYA', 'CITRA sari'],
    'email': ['budi@gmail.com', 'ani@yahoo.co.id', 'citra@company.com'],
    'kode' : ['PRD-001', 'SVC-002', 'PRD-003']
})

# Transformasi 
df['nama'].str.strip()        # hapus spasi di ujung
df['nama'].str.lower()        # lowercase
df['nama'].str.upper()        # UPPERCASE
df['nama'].str.title()        # Title Case
df['nama'].str.capitalize()   # Capitalize first only

# Pencarian & Penggantian 
df['nama'].str.contains('Budi', case=False)  # boolean
df['nama'].str.startswith('B')               # awalan
df['nama'].str.endswith('o')                 # akhiran
df['nama'].str.replace('Budi', 'Ahmad')      # ganti teks
df['nama'].str.replace(r'\\s+', ' ', regex=True) # normalize spasi

# Ekstraksi 
df['domain'] = df['email'].str.split('@').str[1]
df['tld'] = df['email'].str.extract(r'\\.(\\w+)$')
df['jenis_kode'] = df['kode'].str[:3]   # 3 karakter pertama
df['nomor_kode'] = df['kode'].str[-3:]  # 3 karakter terakhir
df['nama_depan'] = df['nama'].str.split().str[0]

# Informasi String 
df['nama'].str.len()          # panjang string
df['nama'].str.count('a')     # hitung karakter 'a'

# Padding & Alignment 
df['nama'].str.ljust(20, '.') # rata kiri
df['nama'].str.rjust(20, '.') # rata kanan
df['nama'].str.center(20, '-')# tengah
df['kode'].str.zfill(8)       # padding nol di kiri
```

---

## 2.8 DateTime Operations

```python
# DateTime Operations
# Parse & Buat DateTime 
df['tanggal'] = pd.to_datetime(df['tanggal'])
df['tanggal'] = pd.to_datetime(df['tanggal'], format='%d/%m/%Y')
df['tanggal'] = pd.to_datetime(df['tanggal'], errors='coerce')  # NaT jika gagal

today = pd.Timestamp.today()
specific = pd.Timestamp('2024-08-17 08:00:00')

# .dt Accessor 
df['tahun'] = df['tanggal'].dt.year
df['bulan'] = df['tanggal'].dt.month
df['hari'] = df['tanggal'].dt.day
df['jam'] = df['tanggal'].dt.hour
df['menit'] = df['tanggal'].dt.minute
df['detik'] = df['tanggal'].dt.second
df['day_of_week'] = df['tanggal'].dt.dayofweek          # 0=Senin
df['nama_hari'] = df['tanggal'].dt.day_name()           # 'Monday'
df['nama_bulan'] = df['tanggal'].dt.month_name()        # 'January'
df['kuartal'] = df['tanggal'].dt.quarter
df['hari_dalam_tahun'] = df['tanggal'].dt.dayofyear
df['minggu_dalam_tahun'] = df['tanggal'].dt.isocalendar().week
df['is_leap_year'] = df['tanggal'].dt.is_leap_year

# Selisih Waktu (Timedelta) 
df['umur_hari'] = (today - df['tgl_lahir']).dt.days
df['umur_tahun'] = df['umur_hari'] // 365
df['bulan_aktif'] = ((today - df['tgl_daftar']) / pd.Timedelta(days=30)).astype(int)

# Period & Offset 
df['tanggal'] + pd.DateOffset(months=1)  # tambah 1 bulan
df['tanggal'] + pd.Timedelta(days=7)     # tambah 7 hari
df['tanggal'].dt.to_period('M')          # konversi ke period bulan

# Resample Time Series 
ts = df.set_index('tanggal').sort_index()
ts['revenue'].resample('D').sum()         # agregasi harian
ts['revenue'].resample('W').mean()        # mingguan
ts['revenue'].resample('M').agg({'revenue': ['sum', 'mean', 'count']})
ts.resample('Q').ffill()                  # forward fill per kuartal
```

---

## 2.9 Pivot Table & Reshaping

```python
# Pivot & Reshaping
# Pivot Table 
pivot = pd.pivot_table(
    df,
    values=['revenue', 'profit'],
    index='kota',
    columns='kategori',
    aggfunc={'revenue': 'sum', 'profit': 'mean'},
    fill_value=0,
    margins=True,       # tambah row/col 'All'
    margins_name='TOTAL'
)
print(pivot.round(0))

# pd.crosstab 
ct = pd.crosstab(
    index=df['kota'],
    columns=df['kategori'],
    values=df['revenue'],
    aggfunc='sum',
    margins=True,
    normalize='index'   # proporsi per baris
)

# Wide to Long: pd.melt 
df_wide = pd.DataFrame({
    'nama': ['Budi', 'Ani'],
    'Jan' : [100, 200],
    'Feb' : [150, 250],
    'Mar' : [120, 180]
})

df_long = pd.melt(
    df_wide,
    id_vars=['nama'],
    value_vars=['Jan', 'Feb', 'Mar'],
    var_name='bulan',
    value_name='penjualan'
)

# Long to Wide: pivot / unstack 
df_wide2 = df_long.pivot(index='nama', columns='bulan', values='penjualan')
df_wide3 = df_long.set_index(['nama', 'bulan']).unstack('bulan')

# stack & unstack 
df_stacked = pivot.stack()      # wide → long (multi-level index)
df_unstacked = df_stacked.unstack() # long → wide
```

---

## 2.10 Membaca & Menulis Data — Format Lengkap

```python
# I/O Data — Format Lengkap
# Membaca CSV 
df = pd.read_csv('file.csv',
    sep=',',                   # pemisah (bisa ';' atau '\\t')
    encoding='utf-8',          # encoding file
    header=0,                  # baris ke-0 jadi header
    index_col=None,            # kolom sebagai index
    usecols=['A', 'B'],        # hanya kolom tertentu
    dtype={'ID': str},         # paksa tipe data
    parse_dates=['tanggal'],   # auto-parse datetime
    nrows=10000,               # baca hanya N baris
    skiprows=[1, 2],           # skip baris tertentu
    na_values=['N/A', '-', '?'], # nilai = NaN
    thousands=',',             # pemisah ribuan
    decimal='.',               # pemisah desimal
    low_memory=False           # lebih akurat type inference
)

# Baca file besar dengan chunking
chunk_iter = pd.read_csv('bigfile.csv', chunksize=10000)
df = pd.concat([chunk for chunk in chunk_iter], ignore_index=True)

# Membaca Excel 
df = pd.read_excel('file.xlsx', sheet_name='Sheet1')
all_sheets = pd.read_excel('file.xlsx', sheet_name=None)  # dict semua sheet

# Membaca dari Database 
import sqlite3
conn = sqlite3.connect('database.db')
df = pd.read_sql('SELECT * FROM penjualan WHERE tahun = 2024', conn)
df = pd.read_sql_query('SELECT k.nama, SUM(p.revenue) FROM ...', conn)

# Membaca dari URL 
url = 'https://raw.githubusercontent.com/datasets/...'
df = pd.read_csv(url)

# Menulis Data 
df.to_csv('output.csv', index=False, encoding='utf-8-sig') # utf-8-sig untuk Excel
df.to_excel('output.xlsx', sheet_name='Data', index=False)
df.to_json('output.json', orient='records', force_ascii=False)
df.to_parquet('output.parquet') # format binary efisien
df.to_pickle('output.pkl')       # Python pickle (cepat)
df.to_sql('tabel', conn, if_exists='replace', index=False)

# Menulis multi-sheet Excel
with pd.ExcelWriter('multi_sheet.xlsx', engine='openpyxl') as writer:
    df_jan.to_excel(writer, sheet_name='Januari', index=False)
    df_feb.to_excel(writer, sheet_name='Februari', index=False)
    pivot.to_excel(writer, sheet_name='Summary')
```

---

## 2.11 Studi Kasus: Analisis RFM Pelanggan

 **RFM Analysis:** Segmentasi pelanggan berdasarkan Recency (kapan terakhir beli), Frequency (seberapa sering), dan Monetary (seberapa besar nilai transaksi).

```python
# STUDI KASUS: RFM Customer Segmentation
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Simulasi Data Transaksi 
np.random.seed(42)
n = 3000
today = pd.Timestamp('2024-12-31')
transactions = pd.DataFrame({
    'cust_id'   : np.random.choice([f'C{i:04d}' for i in range(1, 301)], n),
    'order_date': pd.to_datetime(np.random.choice(pd.date_range('2024-01-01', '2024-12-31'), n)),
    'order_id'  : [f'ORD{i:05d}' for i in range(n)],
    'revenue'   : np.random.lognormal(13.5, 1.2, n).round(-3)
})

# Hitung Metrik RFM 
rfm = transactions.groupby('cust_id').agg(
    recency=('order_date', lambda x: (today - x.max()).days),
    frequency=('order_id', 'nunique'),
    monetary=('revenue', 'sum')
).reset_index()

print('Statistik RFM:')
print(rfm[['recency', 'frequency', 'monetary']].describe().round(0))

# Scoring RFM (1-5) 
# Recency: semakin kecil semakin baik (score 5 = paling baru)
rfm['R'] = pd.qcut(rfm['recency'], 5, labels=[5, 4, 3, 2, 1]).astype(int)

# Frequency: semakin besar semakin baik
rfm['F'] = pd.qcut(rfm['frequency'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5]).astype(int)

# Monetary: semakin besar semakin baik
rfm['M'] = pd.qcut(rfm['monetary'], 5, labels=[1, 2, 3, 4, 5]).astype(int)

rfm['RFM_Score'] = rfm['R'] + rfm['F'] + rfm['M']
rfm['RFM_String'] = rfm['R'].astype(str) + rfm['F'].astype(str) + rfm['M'].astype(str)

# Segmentasi Pelanggan 
def segment_customer(row):
    r, f, m = row['R'], row['F'], row['M']
    if r >= 4 and f >= 4 and m >= 4: return 'Champions'
    if r >= 3 and f >= 3 and m >= 3: return 'Loyal Customers'
    if r >= 4 and f <= 2: return 'New Customers'
    if r <= 2 and f >= 3: return 'At Risk'
    if r == 1 and f == 1: return 'Lost'
    return 'Regular'

rfm['Segment'] = rfm.apply(segment_customer, axis=1)

# Summary per Segmen 
summary = rfm.groupby('Segment').agg(
    jumlah_pelanggan=('cust_id', 'count'),
    avg_recency=('recency', 'mean'),
    avg_frequency=('frequency', 'mean'),
    total_revenue=('monetary', 'sum'),
    avg_revenue=('monetary', 'mean'),
).round(0).sort_values('total_revenue', ascending=False)

print('\\nSummary per Segmen:')
print(summary)

# Visualisasi RFM 
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.suptitle('Analisis RFM Pelanggan', fontsize=15, fontweight='bold')
for ax, col, color in zip(axes, ['recency', 'frequency', 'monetary'],
                          ['coral', 'steelblue', 'mediumpurple']):
    ax.hist(rfm[col], bins=30, color=color, edgecolor='white')
    ax.axvline(rfm[col].median(), color='black', linestyle='--', label='Median')
    ax.set_title(col.title())
    ax.legend()
plt.tight_layout()
plt.show()

# Treemap Segmen (bar chart simulasi treemap)
seg_count = rfm['Segment'].value_counts()
plt.figure(figsize=(10, 5))
bars = plt.bar(seg_count.index, seg_count.values,
               color=sns.color_palette('Set2', len(seg_count)))
for bar in bars:
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             str(int(bar.get_height())), ha='center', fontweight='bold')
plt.title('Distribusi Segmen Pelanggan RFM')
plt.ylabel('Jumlah Pelanggan')
plt.xticks(rotation=15)
plt.tight_layout()
plt.show()
```

---

## 2.12 Method Chaining dan .pipe()

Salah satu gaya penulisan Pandas yang dianggap paling profesional di industri adalah **method chaining** --- merangkai beberapa operasi transformasi data dalam satu alur tanpa membuat variabel perantara yang berlebihan. Gaya ini membuat kode lebih mudah dibaca sebagai sebuah "resep" berurutan.

```python
# Method Chaining vs Gaya Prosedural
# Gaya prosedural (banyak variabel perantara)
df1 = df.dropna(subset=['revenue'])
df2 = df1[df1['revenue'] > 0]
df3 = df2.groupby('kategori')['revenue'].sum()
hasil = df3.sort_values(ascending=False)

# Gaya method chaining (lebih ringkas dan mudah ditelusuri)
hasil = (
    df.dropna(subset=['revenue'])
    .query('revenue > 0')
    .groupby('kategori')['revenue']
    .sum()
    .sort_values(ascending=False)
)
```

Method `.pipe()` memungkinkan kita menyisipkan fungsi kustom ke dalam rantai method:
```python
# Menggunakan .pipe() untuk Fungsi Kustom
def hapus_outlier_iqr(data, kolom):
    q1, q3 = data[kolom].quantile([0.25, 0.75])
    iqr = q3 - q1
    batas_bawah, batas_atas = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    return data[data[kolom].between(batas_bawah, batas_atas)]

def tambah_kolom_margin(data):
    return data.assign(margin=data['revenue'] - data['cost'])

hasil = (
    df.pipe(hapus_outlier_iqr, kolom='revenue')
    .pipe(tambah_kolom_margin)
    .groupby('kategori')['margin']
    .mean()
)
```

---

## 2.13 .assign(), .query(), dan .eval() untuk Kode yang Lebih Bersih

```python
# assign, query, dan eval
# .assign() -- membuat kolom baru secara chainable
df_baru = df.assign(
    margin=lambda d: d['revenue'] - d['cost'],
    margin_pct=lambda d: (d['revenue'] - d['cost']) / d['revenue'] * 100
)

# .query() -- filter bergaya SQL, mendukung variabel eksternal dengan '@'
batas_margin = 20
hasil = df_baru.query('margin_pct > @batas_margin and kategori == "Elektronik"')

# .eval() -- ekspresi matematis yang lebih cepat pada DataFrame besar
df_baru.eval('margin_per_unit = margin / kuantitas', inplace=True)
```

---

## 2.14 .explode() untuk Data Bertipe List

```python
# Contoh .explode()
df_produk = pd.DataFrame({
    'produk': ['Sepatu A', 'Tas B'],
    'tags'  : [['diskon', 'flash-sale'], ['baru', 'diskon', 'limited']]
})

df_exploded = df_produk.explode('tags')
print(df_exploded)
# produk        tags
# 0    Sepatu A      diskon
# 0    Sepatu A  flash-sale
# 1       Tas B        baru
# 1       Tas B      diskon
# 1       Tas B     limited

# Menghitung tag yang paling sering dipakai
print(df_exploded['tags'].value_counts())
```

---

## 2.15 Categorical Data Type untuk Efisiensi Memori

```python
# Konversi ke Categorical
print(df['kategori'].memory_usage(deep=True))  # sebelum, misal: 8_000_000 bytes
df['kategori'] = df['kategori'].astype('category')
print(df['kategori'].memory_usage(deep=True))  # sesudah, bisa turun > 90%

# Categorical juga mendukung urutan (ordinal)
df['tingkat_kepuasan'] = pd.Categorical(
    df['tingkat_kepuasan'],
    categories=['Buruk', 'Cukup', 'Baik', 'Sangat Baik'],
    ordered=True
)
df[df['tingkat_kepuasan'] >= 'Baik']  # perbandingan langsung berdasarkan urutan
```

---

## 2.16 Nullable Data Type dan Sparse Data

```python
# Nullable Integer Type
# Tanpa nullable type -- terpaksa jadi float karena ada NaN
s = pd.Series([1, 2, None, 4])
print(s.dtype)  # float64

# Dengan nullable Int64 (huruf I kapital)
s_nullable = pd.Series([1, 2, None, 4], dtype='Int64')
print(s_nullable)
# 0       1
# 1       2
# 2    <NA>
# 3       4
# dtype: Int64

# Sparse Data untuk Kolom Dominan Nol 
from pandas.arrays import SparseArray
kolom_onehot = [0]*9995 + [1]*5  # 10.000 baris, hanya 5 yang bernilai 1
s_normal = pd.Series(kolom_onehot)
s_sparse = pd.Series(SparseArray(kolom_onehot, fill_value=0))
print(s_normal.memory_usage(deep=True))  # sekitar 80.000 bytes
print(s_sparse.memory_usage(deep=True))  # jauh lebih kecil, hanya simpan nilai non-default
```

---

## 2.17 Optimasi Memori DataFrame Secara Menyeluruh

```python
# Fungsi Reduksi Memori Otomatis
import numpy as np

def reduce_memory_usage(df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
    \"\"\"Downcast tipe numerik dan konversi object ke category bila layak.\"\"\"
    memori_awal = df.memory_usage(deep=True).sum() / 1024**2
    for kolom in df.columns:
        tipe = df[kolom].dtype
        if pd.api.types.is_integer_dtype(tipe):
            df[kolom] = pd.to_numeric(df[kolom], downcast='integer')
        elif pd.api.types.is_float_dtype(tipe):
            df[kolom] = pd.to_numeric(df[kolom], downcast='float')
        elif tipe == object:
            rasio_unik = df[kolom].nunique() / len(df[kolom])
            if rasio_unik < 0.5:
                df[kolom] = df[kolom].astype('category')
    memori_akhir = df.memory_usage(deep=True).sum() / 1024**2
    if verbose:
        penurunan = 100 * (memori_awal - memori_akhir) / memori_awal
        print(f'Memori: {memori_awal:.2f} MB -> {memori_akhir:.2f} MB (turun {penurunan:.1f}%)')
    return df

df = reduce_memory_usage(df)
```

---

## 2.18 Vectorization vs .apply() vs Perulangan --- Perbandingan Performa

```python
# Benchmark: Vectorization vs apply vs Loop
import time

n = 1_000_000
df = pd.DataFrame({
    'harga' : np.random.randint(1000, 100000, n),
    'diskon': np.random.uniform(0, 0.3, n)
})

# 1. Perulangan murni Python (paling lambat)
start = time.time()
hasil_loop = [df['harga'][i] * (1 - df['diskon'][i]) for i in range(len(df))]
print(f'Loop: {time.time() - start:.3f} detik')

# 2. .apply() dengan lambda (lebih cepat dari loop, tapi masih lambat)
start = time.time()
hasil_apply = df.apply(lambda row: row['harga'] * (1 - row['diskon']), axis=1)
print(f'Apply: {time.time() - start:.3f} detik')

# 3. Vectorization (tercepat, memanfaatkan operasi array NumPy)
start = time.time()
hasil_vector = df['harga'] * (1 - df['diskon'])
print(f'Vectorization: {time.time() - start:.3f} detik')

# Hasil tipikal pada 1 juta baris:
# Loop          : ~9-12 detik
# Apply (axis=1): ~1-2 detik
# Vectorization : ~0.01-0.02 detik (bisa 100-500x lebih cepat dari loop)
```

---

## 2.19 Chunk Processing dan Parallel Processing

```python
# Chunk Processing untuk Dataset Besar
ukuran_chunk = 100_000
total_per_kategori = pd.Series(dtype='float64')

for chunk in pd.read_csv('transaksi_besar.csv', chunksize=ukuran_chunk):
    chunk_bersih = chunk.dropna(subset=['revenue'])
    subtotal = chunk_bersih.groupby('kategori')['revenue'].sum()
    total_per_kategori = total_per_kategori.add(subtotal, fill_value=0)

print(total_per_kategori.sort_values(ascending=False))

# Parallel Processing dengan pandarallel 
# pip install pandarallel
from pandarallel import pandarallel
pandarallel.initialize(progress_bar=True)

# Operasi berat yang sebelumnya lambat dengan .apply() biasa
df['skor_kompleks'] = df.parallel_apply(hitung_skor_kompleks, axis=1)
```

---

## QUIZ TAMBAHAN — PANDAS ADVANCED

1. Ubah kode prosedural berikut menjadi satu rangkaian method chaining: filter revenue > 0, lalu groupby kategori, lalu hitung rata-rata, lalu urutkan dari terbesar.
   * **Jawaban:**
     ```python
     hasil = (
         df.query('revenue > 0')
         .groupby('kategori')['revenue']
         .mean()
         .sort_values(ascending=False)
     )
     ```
2. Kapan sebaiknya kolom object diubah menjadi category, dan kenapa tidak semua kolom teks sebaiknya diubah ke category?
   * **Jawaban:** Sebaiknya diubah bila rasio nilai unik terhadap total baris rendah (< 50%), seperti kolom kategori atau provinsi. Kolom dengan hampir semua nilai unik (misalnya nama pelanggan) tidak akan menghemat memori karena setiap kategori tetap harus disimpan satu per satu.
3. Mengapa `.apply(axis=1)` masih jauh lebih lambat dibanding operasi vectorized, padahal sama-sama memproses seluruh baris?
   * **Jawaban:** `.apply(axis=1)` tetap memanggil fungsi Python secara berulang untuk setiap baris (overhead interpreter), sedangkan operasi vectorized dijalankan sebagai operasi array tingkat-C oleh NumPy tanpa overhead pemanggilan fungsi per baris.
4. Sebuah file CSV berukuran 20 GB harus diproses pada laptop dengan RAM 8 GB. Strategi apa yang tepat digunakan, dan bagaimana pola umum kodenya?
   * **Jawaban:** Gunakan chunk processing dengan `pd.read_csv(..., chunksize=N)`, memproses tiap potongan secara bertahap dan mengakumulasikan hasil agregasi (misalnya dengan `.add(fill_value=0)`), tanpa pernah memuat seluruh file ke memori sekaligus.
5. Jelaskan perbedaan Sparse Data Type dengan Nullable Data Type, beserta kapan masing-masing digunakan!
   * **Jawaban:** Nullable type (mis. `Int64`) memungkinkan kolom bertipe integer tetap menyimpan nilai kosong (`<NA>`) tanpa terpaksa berubah ke float. Sparse type menghemat memori untuk kolom yang didominasi satu nilai berulang (mis. hasil one-hot encoding) dengan hanya menyimpan posisi nilai yang berbeda dari default.

---

## LATIHAN SOAL & TANTANGAN
1. Jelaskan perbedaan `.loc[]`, `.iloc[]`, `.at[]`, dan `.iat[]` dengan contoh kode!
2. Apa perbedaan `groupby().agg()` vs `groupby().transform()`? Berikan contoh nyata!
3. Jelaskan 4 jenis JOIN (inner, left, right, outer) dengan contoh kasus bisnis!
4. Tulis kode untuk membaca file CSV besar (>1GB) dengan chunking dan filter baris tertentu!
5. Apa itu RFM Analysis? Tulis kode lengkap untuk mengklasifikasikan pelanggan menjadi 5 segmen!
6. Bagaimana cara mengubah data dari format wide ke long dan sebaliknya? Kapan masing-masing diperlukan?
7. Tulis fungsi yang menerima DataFrame dan mengembalikan laporan missing values yang terformat rapi!

---

## KUNCI JAWABAN / PETUNJUK
1. `.loc[label]` untuk akses by label/kondisi; `.iloc[pos]` untuk akses by integer position; `.at[row, col]` & `.iat[r, c]` untuk akses satu sel tunggal (jauh lebih cepat).
2. `agg()` mengembalikan satu baris per grup (meringkas). `transform()` mengembalikan ukuran sama dengan input (berguna untuk menambahkan kolom agregat ke DataFrame asli).
3. `INNER` = irisan, `LEFT` = semua kiri + match kanan, `RIGHT` = semua kanan + match kiri, `OUTER` = union keduanya.
4. Gunakan `pd.read_csv(file, chunksize=N)` lalu `pd.concat([chunk[kondisi] for chunk in iterator])`.
5. R = hari sejak transaksi terakhir, F = jumlah transaksi unik, M = total nilai. Score 1-5 per dimensi lalu segmentasi berdasarkan kombinasi skor.
6. Wide → Long: `pd.melt(df, id_vars=[...], value_vars=[...])`. Long → Wide: `df.pivot(index, columns, values)` atau `df.pivot_table(...)`.
7. Fungsi idealnya mengembalikan DataFrame dengan kolom: `nama_kolom`, `tipe_data`, `jumlah_null`, `persen_null`, `nilai_unik`, `contoh_nilai`.
$NOTE_DA_BAB_2_PANDAS_MANIPULASI_ANALISIS_DATA$,
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

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: NumPy — Komputasi Numerik & Scientific Computing',
    'da-bab-3-numpy-komputasi-numerik',
    $NOTE_DA_BAB_3_NUMPY_KOMPUTASI_NUMERIK$# BAB 3 — NUMPY: KOMPUTASI NUMERIK & SCIENTIFIC COMPUTING

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 44–56 dari 148 | Pandas · NumPy · Matplotlib · Seaborn · NLP · Sentiment Analysis

---

## 3.1 Array — Fondasi NumPy

```python
# Membuat Array Lengkap
import numpy as np

# Membuat Array 
a1 = np.array([1, 2, 3, 4, 5])                          # 1D, dtype auto
a2 = np.array([[1, 2, 3], [4, 5, 6]], dtype=float)     # 2D, dtype float
a3 = np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])    # 3D

# Array Generator 
np.zeros((3, 4))               # 3×4 semua nol
np.ones((2, 3), dtype=int)     # 2×3 semua satu
np.full((3, 3), 7.5)           # 3×3 semua 7.5
np.eye(4)                      # 4×4 identity matrix
np.diag([1, 2, 3, 4])          # diagonal matrix
np.empty((3, 3))               # 3×3 uninitialized (cepat)
np.empty_like(a2)              # kosong, ukuran seperti a2
np.zeros_like(a2)              # nol, ukuran seperti a2

# Sequence Array 
np.arange(0, 20, 2)            # [0, 2, 4, ..., 18] step=2
np.arange(10)                  # [0, 1, ..., 9]
np.linspace(0, 1, 11)          # 11 titik merata 0→1
np.linspace(0, 2*np.pi, 100)   # 100 titik 0→2π
np.logspace(0, 4, 5)           # [1, 10, 100, 1000, 10000]
np.geomspace(1, 256, 9)        # geometric spacing

# Random 
rng = np.random.default_rng(seed=42)  # modern API (reproducible)
rng.random((3, 4))                    # uniform [0, 1)
rng.standard_normal((3, 4))           # standard normal N(0, 1)
rng.integers(1, 100, (3, 3))          # random int [1, 100)
rng.choice([10, 20, 30, 40, 50], size=8, replace=False) # tanpa penggantian
arr = np.arange(10)
rng.shuffle(arr)                      # acak in-place
perm = rng.permutation(arr)           # acak copy

# Legacy (masih banyak dipakai)
np.random.seed(42)
np.random.rand(3, 4)                  # uniform
np.random.randn(3, 4)                 # normal
np.random.randint(1, 10, (3, 3))
np.random.normal(70, 15, 1000)        # N(mean=70, std=15)
np.random.uniform(0, 100, 500)        # uniform [0, 100]
np.random.binomial(n=10, p=0.5, size=1000)
np.random.poisson(lam=5, size=1000)
```

---

## 3.2 Indexing, Slicing & Boolean Masking

```python
# Indexing & Slicing Lengkap
arr = np.array([[10, 20, 30, 40],
                [50, 60, 70, 80],
                [90, 100, 110, 120]])

# Basic Indexing 
arr[0]          # [10, 20, 30, 40] — baris pertama
arr[0, 2]       # 30 — baris 0, kolom 2
arr[-1, -1]     # 120 — kanan bawah

# Slicing 
arr[0:2]        # baris 0 dan 1
arr[:, 1:3]     # semua baris, kolom 1 dan 2
arr[0:2, 1:3]   # sub-matrix 2×2
arr[::2]        # setiap 2 baris
arr[:, ::-1]    # balik urutan kolom
arr[::-1, ::-1] # balik rows dan columns

# Fancy Indexing 
arr[[0, 2]]              # baris 0 dan 2
arr[:, [1, 3]]           # kolom 1 dan 3
arr[[0, 2], [1, 3]]      # elemen (0,1) dan (2,3)

# Boolean Masking 
mask = arr > 50
arr[mask]                # elemen > 50
arr[arr % 20 == 0]       # habis dibagi 20
np.where(arr > 60, arr, 0)          # ganti <60 dengan 0
np.where(arr > 60, 'tinggi', 'rendah')

# np.ix_ — Outer Indexing 
rows = np.array([0, 2])
cols = np.array([1, 3])
arr[np.ix_(rows, cols)]  # sub-matrix dari rows×cols

# View vs Copy 
view = arr[0:2]          # ini adalah VIEW (perubahan memengaruhi asli)
copy = arr[0:2].copy()   # ini adalah COPY (aman dari modifikasi)
view[0, 0] = 999         # arr[0,0] ikut berubah!
```

---

## 3.3 Shape Manipulation

```python
# Shape Manipulation
arr = np.arange(24)

# reshape 
arr.reshape(4, 6)        # 4×6
arr.reshape(2, 3, 4)     # 3D: 2×3×4
arr.reshape(4, -1)       # 4 baris, kolom auto-hitung = 6
arr.reshape(-1, 4)       # baris auto, 4 kolom

# flatten vs ravel 
mat = arr.reshape(4, 6)
mat.flatten()            # COPY 1D array
mat.ravel()              # VIEW 1D (lebih cepat)
mat.ravel(order='F')     # Fortran order (column-major)

# Transpose 
mat.T                    # (4,6) → (6,4)
np.transpose(mat)        # sama
mat3d = arr.reshape(2, 3, 4)
mat3d.transpose(2, 0, 1) # custom axes permutation → (4,2,3)

# expand_dims & squeeze 
v = np.array([1, 2, 3])
v.shape                  # (3,)
np.expand_dims(v, axis=0) # (1,3) — row vector
np.expand_dims(v, axis=1) # (3,1) — column vector
v[np.newaxis, :]         # (1,3) — alternatif
v[:, np.newaxis]         # (3,1) — alternatif

a = np.zeros((1, 3, 1, 4))
np.squeeze(a)            # (3,4) — hapus dims=1
np.squeeze(a, axis=0)    # (3,1,4) — hapus dim 0 saja

# resize (bisa ubah total elemen) 
arr2 = np.resize(arr, (5, 5))  # 25 elemen, ulangi jika perlu
```

---

## 3.4 Mathematical & Statistical Operations

```python
# Mathematical Operations
a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]], dtype=float)

# Operasi Element-wise 
a + 10; a - 5; a * 2; a / 3; a ** 2; a % 3
np.sqrt(a); np.cbrt(a)   # akar kuadrat, kubik
np.abs(a); np.sign(a)    # absolut, tanda (+/-/0)
np.floor(a); np.ceil(a); np.round(a, 1)
np.exp(a); np.log(a); np.log2(a); np.log10(a); np.log1p(a)
np.sin(a); np.cos(a); np.tan(a)
np.degrees(a); np.radians(a)

# Operasi Dua Array 
b = np.full_like(a, 2.0)
np.add(a, b); np.subtract(a, b); np.multiply(a, b); np.divide(a, b)
np.power(a, b); np.mod(a, b); np.floor_divide(a, b)
np.maximum(a, b); np.minimum(a, b)  # element-wise max/min

# Agregasi Global 
np.sum(a)                # 45.0
np.mean(a)               # 5.0
np.median(a)             # 5.0
np.std(a)                # 2.582
np.var(a)                # 6.667
np.min(a)                # 1.0
np.max(a)                # 9.0
np.ptp(a)                # range = max - min = 8.0
np.percentile(a, [25, 50, 75])  # Q1, Q2, Q3
np.quantile(a, 0.9)      # P90

# Agregasi per Axis 
np.sum(a, axis=0)        # [12, 15, 18] per kolom
np.sum(a, axis=1)        # [6, 15, 24] per baris
np.cumsum(a, axis=1)     # kumulatif per baris
np.cumprod(a, axis=0)    # kumulatif produk per kolom
np.diff(a, axis=1)       # selisih berurutan per baris

# Index Nilai Extremal 
np.argmin(a)             # 0 (global index)
np.argmax(a)             # 8
np.argmin(a, axis=1)     # [0, 0, 0] (index per baris)
np.unravel_index(np.argmax(a), a.shape)  # (2, 2) = row, col

# Sorting 
np.sort(a, axis=1)       # sort per baris (ascending)
np.sort(a, axis=0)       # sort per kolom
np.sort(a)[:, ::-1]      # sort descending
np.argsort(a, axis=1)    # index hasil sort
a[np.argsort(a[:, 0])]   # sort baris berdasarkan kolom 0

# Unique & Set Operations 
arr = np.array([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5])
np.unique(arr)                       # [1, 2, 3, 4, 5, 6, 9]
np.unique(arr, return_counts=True)   # dengan frekuensi
np.intersect1d(arr, [3, 5, 7])       # irisan
np.union1d(arr, [10, 11])            # gabungan
np.setdiff1d(arr, [1, 3, 5])         # selisih
```

---

## 3.5 Broadcasting

```python
# Broadcasting
# Broadcasting Rule: dimensi kompatibel jika sama atau salah satunya = 1
# NumPy auto-expand dimensi yang = 1

# Contoh 1: Array + Scalar 
a = np.array([[1, 2, 3], [4, 5, 6]])  # shape (2,3)
a + 100                                # scalar di-broadcast → (2,3)

# Contoh 2: 2D + 1D 
row_vec = np.array([1, 2, 3])          # shape (3,) → di-broadcast ke (2,3)
a + row_vec                            # [[2, 4, 6], [5, 7, 9]]

# Contoh 3: Column + Row Vector 
col = np.array([[1], [2], [3]])        # shape (3, 1)
row = np.array([10, 20, 30, 40])       # shape (4,)
col + row
# → [[11, 21, 31, 41],
# [12, 22, 32, 42],
# [13, 23, 33, 43]] shape (3,4)

# Aplikasi Nyata: Normalisasi Z-Score 
data = np.random.randn(100, 5)         # 100 sampel, 5 fitur
mean = data.mean(axis=0)               # shape (5,)
std = data.std(axis=0)                 # shape (5,)
normalized = (data - mean) / std       # broadcasting (100,5) - (5,) / (5,)

# Aplikasi: Jarak Euclidean semua pasangan 
points = np.random.rand(5, 2)          # 5 titik 2D
diff = points[:, np.newaxis, :] - points[np.newaxis, :, :]  # (5, 5, 2)
dist_matrix = np.sqrt((diff**2).sum(axis=-1))               # (5, 5)

# Aplikasi: Outer Product 
prices = np.array([100, 200, 300])     # shape (3,)
qty = np.array([1, 2, 3, 4])           # shape (4,)
revenue_table = prices[:, np.newaxis] * qty[np.newaxis, :]  # (3, 4)
```

---

## 3.6 Linear Algebra

```python
# Linear Algebra
A = np.array([[2, 1, -1],
              [1, 3, 2],
              [3, 2, 4]], dtype=float)

# Operasi Matriks Dasar 
A @ A                   # perkalian matriks
np.dot(A, A)            # sama dengan @
np.matmul(A, A)         # sama, tapi tidak mendukung scalar
A.T                     # transpose
np.trace(A)             # jumlah diagonal = 9.0
np.linalg.matrix_rank(A)# rank matriks

# Determinan & Inverse 
np.linalg.det(A)        # determinan
np.linalg.inv(A)        # inverse
A_inv = np.linalg.inv(A)
np.allclose(A @ A_inv, np.eye(3))  # True (verifikasi A × A⁻¹ = I)

# Sistem Persamaan Linear: Ax = b 
b = np.array([1, 8, 10], dtype=float)
x = np.linalg.solve(A, b)
print('Solusi x:', x)
print('Verifikasi:', np.allclose(A @ x, b))  # True

# Least Squares (sistem overdetermined)
A_rect = np.random.randn(10, 3)
b_rect = np.random.randn(10)
x_ls, residuals, rank, sv = np.linalg.lstsq(A_rect, b_rect, rcond=None)

# Eigenvalue & Eigenvector 
eigenvalues, eigenvectors = np.linalg.eig(A)
print('Eigenvalues:', eigenvalues)
# Verifikasi: A @ v = λ × v
for i in range(len(eigenvalues)):
    lhs = A @ eigenvectors[:, i]
    rhs = eigenvalues[i] * eigenvectors[:, i]
    assert np.allclose(lhs, rhs)

# SVD (Singular Value Decomposition) 
U, sigma, Vt = np.linalg.svd(A)
A_reconstructed = U @ np.diag(sigma) @ Vt
np.allclose(A, A_reconstructed)  # True

# Norm 
np.linalg.norm(A)             # Frobenius norm
np.linalg.norm(A, ord=1)      # L1 norm
np.linalg.norm(A, ord=np.inf) # L∞ norm
v = np.array([3., 4.])
np.linalg.norm(v)             # 5.0 (L2 = Euclidean)
```

---

## 3.7 Studi Kasus: Image Processing dengan NumPy

 **Studi kasus:** Mendemonstrasikan bagaimana NumPy digunakan dalam pemrosesan gambar — merepresentasikan gambar sebagai array 3D $(H \\times W \\times C)$.

```python
# STUDI KASUS: Image Processing
import numpy as np
import matplotlib.pyplot as plt

# Gambar = Array 3D (H × W × C) 
# C = 3 channel: Red, Green, Blue, nilai 0-255
np.random.seed(42)
H, W = 100, 100

# Gambar gradient warna
x = np.linspace(0, 255, W).astype(np.uint8)
y = np.linspace(0, 255, H).astype(np.uint8)
R = np.outer(y, np.ones(W)).astype(np.uint8)
G = np.outer(np.ones(H), x).astype(np.uint8)
B = np.full((H, W), 128, dtype=np.uint8)
img = np.stack([R, G, B], axis=2)  # (100, 100, 3)

print(f'Shape gambar: {img.shape}')       # (100, 100, 3)
print(f'Dtype       : {img.dtype}')       # uint8
print(f'Min/Max     : {img.min()}/{img.max()}') # 0/255

# Operasi Gambar 
# 1. Grayscale: rata-rata 3 channel
gray = img.mean(axis=2).astype(np.uint8)

# 2. Crop gambar
cropped = img[20:80, 20:80, :]  # 60×60 tengah

# 3. Flip horizontal
flipped_h = img[:, ::-1, :]

# 4. Flip vertikal
flipped_v = img[::-1, :, :]

# 5. Rotate 90°
rotated = np.rot90(img)

# 6. Brightness adjustment
brighter = np.clip(img.astype(int) + 50, 0, 255).astype(np.uint8)
darker = np.clip(img.astype(int) - 50, 0, 255).astype(np.uint8)

# 7. Kontras dengan normalisasi
normalized = ((img - img.min()) / (img.max() - img.min()) * 255).astype(np.uint8)

# 8. Add noise
rng = np.random.default_rng(42)
noise = rng.integers(-30, 30, img.shape)
noisy = np.clip(img.astype(int) + noise, 0, 255).astype(np.uint8)

# Visualisasi 
fig, axes = plt.subplots(2, 4, figsize=(16, 8))
titles = ['Original', 'Grayscale', 'Cropped', 'Flipped H',
          'Flipped V', 'Brighter', 'Darker', 'Noisy']
images = [img, gray, cropped, flipped_h,
          flipped_v, brighter, darker, noisy]

for ax, title, image in zip(axes.flatten(), titles, images):
    if image.ndim == 2:
        ax.imshow(image, cmap='gray')
    else:
        ax.imshow(image)
    ax.set_title(title)
    ax.axis('off')
plt.suptitle('Image Processing dengan NumPy', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

# Statistik Gambar 
print('Statistik per Channel:')
for i, ch in enumerate(['Red', 'Green', 'Blue']):
    ch_data = img[:, :, i]
    print(f'{ch}: mean={ch_data.mean():.1f}, std={ch_data.std():.1f}, median={np.median(ch_data):.1f}')
```

---

## 3.8 Advanced Indexing: Fancy Indexing, np.where, dan np.select

```python
# Fancy Indexing
harga = np.array([15000, 25000, 8000, 42000, 12000])

# Fancy indexing -- ambil beberapa indeks sekaligus dalam urutan bebas
idx_pilihan = [3, 0, 4]
print(harga[idx_pilihan])  # [42000 15000 12000]

# Fancy indexing 2 dimensi -- ambil elemen diagonal tertentu
matriks = np.arange(16).reshape(4, 4)
baris = [0, 1, 2, 3]
kolom = [0, 1, 2, 3]
print(matriks[baris, kolom])  # elemen diagonal utama

# np.where dan np.select untuk Kondisional Vectorized
revenue = np.array([120000, 45000, 300000, 8000, 75000])

# np.where -- setara if-else vectorized
label = np.where(revenue >= 100000, 'Tinggi', 'Rendah')
print(label)  # ['Tinggi' 'Rendah' 'Tinggi' 'Rendah' 'Rendah']

# np.select -- setara if-elif-elif-else vectorized untuk banyak kondisi
kondisi = [
    revenue >= 200000,
    revenue >= 100000,
    revenue >= 50000,
]
pilihan = ['Sangat Tinggi', 'Tinggi', 'Sedang']
label_bertingkat = np.select(kondisi, pilihan, default='Rendah')
print(label_bertingkat)
# ['Tinggi' 'Rendah' 'Sangat Tinggi' 'Rendah' 'Sedang']
```

> [!TIP]
> `np.select` jauh lebih terbaca dan lebih cepat dibanding merangkai banyak `np.where` secara bersarang (*nested*). Gunakan `np.select` setiap kali logika kondisional memiliki lebih dari dua cabang.

---

## 3.9 Random Number Generation Modern: Generator API

```python
# Legacy API vs Generator API
# Cara lama (legacy, tidak direkomendasikan untuk kode baru)
np.random.seed(42)
data_lama = np.random.rand(5)

# Cara modern yang direkomendasikan (Generator API)
rng = np.random.default_rng(seed=42)
data_baru = rng.random(5)

# Method umum pada Generator
rng.integers(low=1, high=100, size=10)       # bilangan bulat acak
rng.normal(loc=50, scale=10, size=1000)      # distribusi normal
rng.choice(['A', 'B', 'C'], size=5, p=[0.6, 0.3, 0.1])  # sampling berbobot
rng.shuffle(data_baru)                       # acak in-place
```

---

## 3.10 Views vs Copies dan Optimasi Memory Layout

```python
# View vs Copy
arr_asli = np.array([1, 2, 3, 4, 5])

# Slicing menghasilkan VIEW, bukan copy -- berbagi memori dengan arr_asli
potongan = arr_asli[1:4]
potongan[0] = 99
print(arr_asli)  # [ 1 99  3  4  5 ] <- ikut berubah!

# Fancy indexing menghasilkan COPY -- independen dari arr_asli
potongan_aman = arr_asli[[1, 2, 3]]
potongan_aman[0] = -1
print(arr_asli)  # tidak berubah

# Memastikan copy secara eksplisit bila diperlukan
potongan_eksplisit = arr_asli[1:4].copy()

# Mengecek apakah sebuah array adalah view dari array lain
print(potongan.base is arr_asli)  # True jika view

# Dampak Memory Layout terhadap Performa
import time

matriks_besar = np.random.rand(5000, 5000)

start = time.time()
total_per_baris = matriks_besar.sum(axis=1)  # searah C-order (row-major)
print(f'Sum per baris: {time.time() - start:.4f} detik')

start = time.time()
total_per_kolom = matriks_besar.sum(axis=0)  # melawan C-order
print(f'Sum per kolom: {time.time() - start:.4f} detik')
```

---

## 3.11 Universal Functions (ufunc) dan Vectorization Mendalam

```python
# ufunc Bawaan vs np.vectorize
arr = np.array([1, 4, 9, 16, 25])

# ufunc bawaan -- cepat, dijalankan penuh dalam kode C
print(np.sqrt(arr))

# np.vectorize -- TERLIHAT vectorized, tapi secara internal tetap loop Python (lambat!)
fungsi_kustom = np.vectorize(lambda x: x ** 0.5)
print(fungsi_kustom(arr))  # hasil sama, tapi jauh lebih lambat untuk array besar

# Method tambahan ufunc:
print(np.add.reduce(arr))              # setara arr.sum()
print(np.multiply.accumulate(arr))      # kumulatif perkalian, setara np.cumprod(arr)
print(np.greater.outer(arr, arr))       # perbandingan setiap pasangan elemen
```

---

## 3.12 Benchmark Performa: NumPy vs Python Murni vs Numba

```python
# Benchmark Perhitungan Jarak Euclidean (1 Juta Titik)
import time
import numpy as np

n = 1_000_000
x1 = np.random.rand(n); y1 = np.random.rand(n)
x2 = np.random.rand(n); y2 = np.random.rand(n)

# 1. Python murni dengan perulangan (paling lambat)
start = time.time()
hasil_loop = [((x1[i]-x2[i])**2 + (y1[i]-y2[i])**2) ** 0.5 for i in range(n)]
print(f'Python loop : {time.time() - start:.3f} detik')

# 2. NumPy vectorized (jauh lebih cepat)
start = time.time()
hasil_numpy = np.sqrt((x1 - x2)**2 + (y1 - y2)**2)
print(f'NumPy       : {time.time() - start:.3f} detik')

# 3. Numba JIT-compiled (mendekati atau melampaui NumPy untuk operasi kompleks)
from numba import njit

@njit
def jarak_numba(x1, y1, x2, y2):
    hasil = np.empty(len(x1))
    for i in range(len(x1)):
        hasil[i] = ((x1[i]-x2[i])**2 + (y1[i]-y2[i])**2) ** 0.5
    return hasil

_ = jarak_numba(x1[:10], y1[:10], x2[:10], y2[:10])  # kompilasi pertama
start = time.time()
hasil_numba = jarak_numba(x1, y1, x2, y2)
print(f'Numba (JIT) : {time.time() - start:.3f} detik')

# Hasil tipikal pada 1 juta titik:
# Python loop : ~0.35-0.60 detik
# NumPy       : ~0.01-0.02 detik (20-40x lebih cepat dari loop)
# Numba (JIT) : ~0.003-0.01 detik (sebanding atau lebih cepat dari NumPy murni)
```

---

## QUIZ TAMBAHAN — NUMPY ADVANCED

1. Jelaskan perbedaan antara `np.where` dan `np.select`, lalu berikan contoh kasus di mana `np.select` lebih tepat digunakan!
   * **Jawaban:** `np.where` setara if-else vectorized (hanya 2 cabang hasil). `np.select` setara if-elif-elif-else untuk banyak kondisi sekaligus. `np.select` lebih tepat ketika ada 3 kategori atau lebih, misalnya melabeli revenue menjadi Sangat Tinggi/Tinggi/Sedang/Rendah.
2. Mengapa Generator API (`np.random.default_rng()`) lebih direkomendasikan dibanding `np.random.seed()` untuk kode baru?
   * **Jawaban:** Generator API menghasilkan kualitas keacakan statistik yang lebih baik dan lebih aman digunakan pada komputasi paralel karena setiap objek Generator dapat diberi seed independen tanpa saling memengaruhi, berbeda dengan legacy RandomState global yang bersifat shared state.
3. Sebuah fungsi menerima array sebagai parameter, melakukan `arr_slice = arr[2:5]`, lalu mengubah `arr_slice[0] = 100`. Apakah array asli ikut berubah? Jelaskan alasannya!
   * **Jawaban:** Ya, ikut berubah, karena slicing pada NumPy menghasilkan view (berbagi memori dengan array asli), bukan copy. Untuk menghindari efek samping ini, gunakan `arr[2:5].copy()` secara eksplisit.
4. Mengapa `np.vectorize()` tidak benar-benar memberikan percepatan performa dibanding perulangan Python biasa?
   * **Jawaban:** Karena `np.vectorize()` hanyalah pembungkus kenyamanan (*convenience wrapper*) yang tetap menjalankan fungsi Python asli secara berulang di belakang layar untuk tiap elemen -- bukan ufunc asli yang dijalankan dalam kode C terkompilasi.
5. Kapan sebaiknya Numba dipertimbangkan dibanding NumPy vectorized biasa?
   * **Jawaban:** Ketika logika komputasi memiliki banyak percabangan kondisional per elemen yang sulit dinyatakan secara bersih sebagai kombinasi ufunc, sehingga menuliskannya sebagai fungsi Python biasa lalu mengompilasinya dengan `@numba.njit` memberi performa mendekati C tanpa mengorbankan keterbacaan kode.

---

## LATIHAN SOAL & TANTANGAN
1. Apa perbedaan antara `arr.flatten()` dan `arr.ravel()`? Kapan view vs copy penting?
2. Jelaskan aturan broadcasting dengan contoh array shape `(3, 1, 4) + (2, 1) = ?`
3. Bagaimana menyelesaikan sistem persamaan linear 3 variabel menggunakan `np.linalg.solve()`?
4. Tulis kode untuk menghitung matriks jarak Euclidean antara N titik menggunakan broadcasting!
5. Apa itu SVD? Jelaskan aplikasinya dalam data analytics (dimensionality reduction, image compression)!
6. Tulis kode untuk menormalisasi setiap kolom matrix ke range [0, 1] menggunakan broadcasting!
7. Bagaimana cara membuat array gambar RGB dan mengubahnya menjadi grayscale hanya dengan NumPy?
$NOTE_DA_BAB_3_NUMPY_KOMPUTASI_NUMERIK$,
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

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Matplotlib — Visualisasi Data yang Memukau',
    'da-bab-4-matplotlib-visualisasi-data',
    $NOTE_DA_BAB_4_MATPLOTLIB_VISUALISASI_DATA$# BAB 4 — MATPLOTLIB: VISUALISASI DATA YANG MEMUKAU

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 57–68 dari 148 | Pandas · NumPy · Matplotlib · Seaborn · NLP · Sentiment Analysis

---

## 4.1 Arsitektur Matplotlib

 **Hierarki Matplotlib:** Figure (kanvas) → Axes (area plot) → Artists (Line, Bar, Text, Patch, dll). Memahami ini kunci untuk kustomisasi penuh.

```python
# Setup Matplotlib
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import numpy as np

# Dua Gaya Penggunaan 
# 1. PYPLOT style (cepat, cocok untuk eksplorasi)
plt.plot([1, 2, 3], [4, 5, 6])
plt.title('Quick Plot')
plt.show()

# 2. OOP style (rekomendasi untuk produksi)
fig, ax = plt.subplots(figsize=(8, 5))
ax.plot([1, 2, 3], [4, 5, 6], 'b-o')
ax.set_title('OOP Plot')
ax.set_xlabel('X')
ax.set_ylabel('Y')
plt.show()

# Konfigurasi Global 
plt.rcParams.update({
    'figure.figsize'   : (12, 6),
    'figure.dpi'       : 100,
    'figure.facecolor' : 'white',
    'axes.titlesize'   : 14,
    'axes.titleweight' : 'bold',
    'axes.labelsize'   : 12,
    'axes.spines.top'  : False,
    'axes.spines.right': False,
    'axes.grid'        : True,
    'grid.alpha'       : 0.3,
    'lines.linewidth'  : 2,
    'font.family'      : 'sans-serif',
    'legend.framealpha': 0.8,
    'savefig.dpi'      : 300,
    'savefig.bbox'     : 'tight',
})
```

---

## 4.2 Line Plot — Tren & Time Series

```python
# Line Plot & Time Series
x = np.linspace(0, 4*np.pi, 300)

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Plot 1: Multiple Lines 
ax = axes[0]
ax.plot(x, np.sin(x), color='#2196F3', lw=2, label='sin(x)')
ax.plot(x, np.cos(x), color='#F44336', lw=2, ls='--', label='cos(x)')
ax.plot(x, np.sin(2*x), color='#4CAF50', lw=1.5, ls=':', label='sin(2x)')
ax.axhline(y=0, color='black', lw=0.8, alpha=0.5)      # garis horizontal y=0
ax.axvline(x=np.pi, color='gray', lw=1, ls='--')        # garis vertikal
ax.fill_between(x, np.sin(x), 0, where=(np.sin(x) > 0),
                alpha=0.15, color='blue', label='Positif')
ax.set_title('Fungsi Trigonometri')
ax.legend(loc='upper right')
ax.set_xlabel('x')

# Plot 2: Time Series dengan Anotasi 
import pandas as pd
dates = pd.date_range('2024-01-01', periods=52, freq='W')
sales = 100 + np.cumsum(np.random.randn(52)*5)

ax2 = axes[1]
ax2.plot(dates, sales, color='steelblue', lw=2, alpha=0.9)
ax2.fill_between(dates, sales, sales.min(), alpha=0.1, color='steelblue')

# Moving average
ma = pd.Series(sales).rolling(4).mean()
ax2.plot(dates, ma, 'r--', lw=1.5, label='MA-4')

# Anotasi peak
peak_idx = np.argmax(sales)
ax2.annotate(f'Peak: {sales[peak_idx]:.0f}',
             xy=(dates[peak_idx], sales[peak_idx]),
             xytext=(dates[peak_idx+5], sales[peak_idx]+10),
             arrowprops=dict(arrowstyle='->', color='red', lw=1.5),
             color='red', fontsize=10)
ax2.set_title('Time Series Penjualan 2024')
ax2.legend()
ax2.tick_params(axis='x', rotation=30)
plt.tight_layout()
plt.show()
```

---

## 4.3 Bar Plot — Perbandingan Kategori

```python
# Bar Plot Lengkap
kategori = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']
nilai_23 = [120, 135, 110, 158, 145, 170]
nilai_24 = [145, 162, 138, 185, 172, 210]
target = [150, 155, 140, 170, 165, 190]

fig, axes = plt.subplots(1, 3, figsize=(18, 5))

# 1. Simple Bar dengan label 
ax1 = axes[0]
bars = ax1.bar(kategori, nilai_24, color='steelblue',
               width=0.6, edgecolor='white', linewidth=1.5)
ax1.plot(kategori, target, 'r--o', lw=1.5, label='Target')
for bar in bars:
    h = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2, h + 2, f'{h}',
             ha='center', va='bottom', fontsize=9, fontweight='bold')
ax1.set_title('Penjualan Bulanan 2024')
ax1.legend()

# 2. Grouped Bar 
ax2 = axes[1]
x = np.arange(len(kategori))
w = 0.35
b1 = ax2.bar(x - w/2, nilai_23, w, label='2023', color='#78909C')
b2 = ax2.bar(x + w/2, nilai_24, w, label='2024', color='#26A69A')
ax2.set_xticks(x)
ax2.set_xticklabels(kategori)
ax2.legend()
ax2.set_title('Perbandingan 2023 vs 2024')

# 3. Horizontal Stacked Bar 
ax3 = axes[2]
produk = ['Laptop', 'HP', 'TV', 'Kulkas', 'AC']
online = [45, 60, 30, 25, 35]
offline = [35, 20, 45, 50, 40]
p1 = ax3.barh(produk, online, color='#42A5F5', label='Online')
p2 = ax3.barh(produk, offline, left=online, color='#FFA726', label='Offline')
ax3.set_title('Penjualan Online vs Offline')
ax3.set_xlabel('Penjualan (unit)')
ax3.legend(loc='lower right')
plt.tight_layout()
plt.show()
```

---

## 4.4 Scatter Plot & Bubble Chart

```python
# Scatter & Bubble Chart
np.random.seed(42)
n = 200
x = np.random.randn(n)
y = 1.5 * x + np.random.randn(n) * 0.8
size = np.abs(np.random.randn(n)) * 100 + 20
color = np.random.rand(n)

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Bubble Chart 
sc = axes[0].scatter(x, y, s=size, c=color, cmap='plasma', alpha=0.7,
                     edgecolors='gray', linewidths=0.5)
plt.colorbar(sc, ax=axes[0], label='Nilai')

# Regression line
m, b = np.polyfit(x, y, 1)
x_line = np.linspace(x.min(), x.max(), 100)
axes[0].plot(x_line, m*x_line + b, 'r-', lw=2,
             label=f'y={m:.2f}x+{b:.2f} r={np.corrcoef(x, y)[0, 1]:.2f}')
axes[0].legend()
axes[0].set_title('Scatter + Regression')

# Scatter per Grup 
grupA = np.random.multivariate_normal([2, 2], [[1, 0.5], [0.5, 1]], 80)
grupB = np.random.multivariate_normal([5, 5], [[1, -0.3], [-0.3, 1]], 80)
grupC = np.random.multivariate_normal([2, 6], [[0.5, 0], [0.5, 0.5]], 80)

for grup, nama, c in zip([grupA, grupB, grupC], ['A', 'B', 'C'],
                         ['#E53935', '#1E88E5', '#43A047']):
    axes[1].scatter(grup[:, 0], grup[:, 1], c=c, alpha=0.6,
                    s=60, label=f'Grup {nama}', edgecolors='white')
    # Centroid
    cx, cy = grup.mean(axis=0)
    axes[1].scatter(cx, cy, c=c, s=300, marker='*',
                    edgecolors='black', linewidths=1.5, zorder=5)
axes[1].set_title('Scatter per Kluster')
axes[1].legend()
plt.tight_layout()
plt.show()
```

---

## 4.5 Histogram, KDE & Distribusi

```python
# Histogram & Distribusi
from scipy import stats
np.random.seed(42)

data_normal = np.random.normal(70, 15, 1000)
data_bimodal = np.concatenate([np.random.normal(50, 8, 500), np.random.normal(80, 8, 500)])
data_skewed = np.random.lognormal(4, 0.5, 1000)

fig, axes = plt.subplots(1, 3, figsize=(18, 5))

# 1. Normal + KDE + Statistik 
ax = axes[0]
ax.hist(data_normal, bins=30, density=True, color='steelblue',
        alpha=0.7, edgecolor='white', label='Data')
xmin, xmax = ax.get_xlim()
x_pdf = np.linspace(xmin, xmax, 200)
ax.plot(x_pdf, stats.norm.pdf(x_pdf, data_normal.mean(), data_normal.std()),
        'r-', lw=2, label='Normal PDF')
ax.axvline(data_normal.mean(), color='red', ls='--', label=f'Mean={data_normal.mean():.1f}')
ax.axvline(np.median(data_normal), color='green', ls='--', label=f'Median={np.median(data_normal):.1f}')

# Shaded ±1σ
m, s = data_normal.mean(), data_normal.std()
ax.axvspan(m-s, m+s, alpha=0.1, color='orange', label='±1σ (68%)')
ax.legend(fontsize=8)
ax.set_title('Distribusi Normal')

# 2. Bimodal 
ax2 = axes[1]
ax2.hist(data_bimodal, bins=40, density=True, color='mediumpurple',
         alpha=0.7, edgecolor='white')
kde = stats.gaussian_kde(data_bimodal)
x_kde = np.linspace(data_bimodal.min(), data_bimodal.max(), 200)
ax2.plot(x_kde, kde(x_kde), 'r-', lw=2.5, label='KDE')
ax2.set_title(f'Distribusi Bimodal\\nSkewness={stats.skew(data_bimodal):.2f}')
ax2.legend()

# 3. Skewed + Log Transform 
ax3 = axes[2]
ax3.hist(data_skewed, bins=50, density=True, color='coral',
         alpha=0.7, edgecolor='white', label='Original')
log_data = np.log(data_skewed)
ax3b = ax3.twinx()
ax3b.hist(log_data, bins=30, density=True, color='green',
          alpha=0.4, label='Log Transform')
ax3.set_title(f'Skewed (skew={stats.skew(data_skewed):.2f})\\nvs Log Transform')
ax3.set_xlabel('Nilai')
plt.tight_layout()
plt.show()
```

---

## 4.6 Pie, Donut & Waterfall Chart

```python
# Pie, Donut & Waterfall
# Waterfall Chart 
items = ['Revenue', 'COGS', 'Gross Profit', 'Opex', 'Marketing', 'Net Profit']
values = [1000, -400, 600, -150, -80, 370]
cumulative = [0] + list(np.cumsum(values[:-1]))

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Waterfall
ax1 = axes[0]
colors = ['#4CAF50' if v > 0 else '#F44336' for v in values]
colors[-1] = '#2196F3'  # final bar selalu biru
bars = ax1.bar(items, [abs(v) for v in values], bottom=cumulative,
               color=colors, edgecolor='white', width=0.6)

# Connector lines
for i in range(len(items) - 1):
    y = cumulative[i + 1]
    ax1.plot([i + 0.3, i + 0.7], [y, y], 'k-', lw=0.8, alpha=0.5)

# Label
for bar, val in zip(bars, values):
    y_pos = bar.get_y() + bar.get_height() + (5 if val > 0 else -25)
    ax1.text(bar.get_x() + bar.get_width()/2, y_pos,
             f'{val:+,.0f}', ha='center', fontsize=9, fontweight='bold')
ax1.set_title('Waterfall Chart — P&L')
ax1.set_ylabel('Nilai (Juta Rp)')
ax1.tick_params(axis='x', rotation=30)

# Donut dengan statistik tengah 
ax2 = axes[1]
labels = ['Elektronik', 'Fashion', 'Makanan', 'Olahraga', 'Lainnya']
sizes = [35, 25, 20, 12, 8]
colors_d = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#607D8B']
wedges, texts, autotexts = ax2.pie(
    sizes, labels=labels, colors=colors_d,
    autopct=lambda p: f'{p:.1f}%\\n({p*sum(sizes)/100:.0f})',
    startangle=90,
    wedgeprops=dict(width=0.6, edgecolor='white', linewidth=2),
    pctdistance=0.75
)

# Teks di tengah donut
ax2.text(0, 0, f'Total\\n{sum(sizes)}%', ha='center', va='center',
         fontsize=14, fontweight='bold', color='#333333')
ax2.set_title('Donut Chart — Kategori Penjualan')
plt.tight_layout()
plt.show()
```

---

## 4.7 Subplots Lanjutan & GridSpec

```python
# GridSpec Layout Kompleks
import matplotlib.gridspec as gridspec
np.random.seed(42)

fig = plt.figure(figsize=(16, 10))
fig.suptitle('Layout Kompleks dengan GridSpec', fontsize=15, fontweight='bold')
gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.4, wspace=0.35)

# Baris 1: satu plot full-width
ax1 = fig.add_subplot(gs[0, :])  # semua 3 kolom
x = np.linspace(0, 10, 200)
ax1.plot(x, np.sin(x)*np.exp(-0.1*x), 'steelblue', lw=2)
ax1.fill_between(x, np.sin(x)*np.exp(-0.1*x), 0, alpha=0.2)
ax1.set_title('Full-Width Plot — Gelombang Teredam')

# Baris 2: dua plot (2/3 + 1/3)
ax2 = fig.add_subplot(gs[1, :2])  # 2 kolom pertama
ax3 = fig.add_subplot(gs[1, 2])   # 1 kolom terakhir
data2d = np.random.randn(8, 8)
im = ax2.imshow(data2d, cmap='RdYlBu', aspect='auto')
plt.colorbar(im, ax=ax2)
ax2.set_title('Heatmap')
ax3.hist(np.random.randn(200), bins=15, color='coral', edgecolor='white')
ax3.set_title('Histogram')

# Baris 3: tiga plot 1/3 masing-masing
ax4 = fig.add_subplot(gs[2, 0])
ax5 = fig.add_subplot(gs[2, 1])
ax6 = fig.add_subplot(gs[2, 2])

ax4.scatter(np.random.randn(100), np.random.randn(100), alpha=0.5, s=30)
ax4.set_title('Scatter')
labels = ['A', 'B', 'C', 'D']
ax5.bar(labels, np.random.randint(20, 100, 4), color='mediumpurple')
ax5.set_title('Bar')
ax6.pie([25, 35, 20, 20], labels=labels, autopct='%1.0f%%', startangle=90)
ax6.set_title('Pie')

plt.savefig('complex_layout.png', dpi=150, bbox_inches='tight')
plt.show()
```

---

## 4.8 Kustomisasi & Anotasi Lanjutan

```python
# Kustomisasi & Anotasi Lanjutan
import matplotlib.patches as mpatches
import matplotlib.lines as mlines
import matplotlib.ticker as mticker

fig, ax = plt.subplots(figsize=(12, 6))
x = np.linspace(0, 2*np.pi, 300)
y1 = np.sin(x)
y2 = np.cos(x)
ax.plot(x, y1, 'b-', lw=2.5, label='sin(x)')
ax.plot(x, y2, 'r--', lw=2.5, label='cos(x)')

# Anotasi dengan Panah 
ax.annotate('Maximum\\nsin(x) = 1',
            xy=(np.pi/2, 1.0),
            xytext=(np.pi/2 + 0.8, 1.3),
            arrowprops=dict(arrowstyle='fancy', color='navy', connectionstyle='arc3,rad=0.2'),
            fontsize=11, color='navy',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', edgecolor='navy'))

# Shaded Region 
ax.fill_between(x, y1, y2, where=(y1 > y2), alpha=0.2, color='blue', label='sin > cos')
ax.fill_between(x, y1, y2, where=(y1 < y2), alpha=0.2, color='red', label='cos > sin')

# Garis Referensi 
ax.axhline(y=0, color='black', lw=1, alpha=0.5, ls='-')
ax.axvline(x=np.pi, color='gray', lw=1, ls=':', alpha=0.7)
ax.text(np.pi+0.05, -1.4, 'x = π', color='gray', fontsize=10)

# Patch (Rectangle, Circle, dll) 
rect = mpatches.Rectangle((np.pi, -0.3), 0.5, 0.6,
                          linewidth=1.5, edgecolor='green',
                          facecolor='lightgreen', alpha=0.4)
ax.add_patch(rect)
ax.text(np.pi+0.25, 0.1, 'Region\\nInterest', ha='center', fontsize=8, color='green')

# Custom Legend 
custom_handles = [
    mlines.Line2D([], [], color='blue', lw=2, label='sin(x)'),
    mlines.Line2D([], [], color='red', lw=2, ls='--', label='cos(x)'),
    mpatches.Patch(color='blue', alpha=0.2, label='sin > cos'),
    mpatches.Patch(color='red', alpha=0.2, label='cos > sin'),
]
ax.legend(handles=custom_handles, loc='upper right', fontsize=10, framealpha=0.9)

# Axis Formatting 
ax.xaxis.set_major_locator(mticker.MultipleLocator(np.pi/2))
ax.xaxis.set_major_formatter(mticker.FuncFormatter(
    lambda val, _: {0: '0', np.pi/2: 'π/2', np.pi: 'π',
                    3*np.pi/2: '3π/2', 2*np.pi: '2π'}.get(round(val, 5), f'{val:.2f}')
))
ax.set_xlim(0, 2*np.pi)
ax.set_ylim(-1.6, 1.8)
ax.set_title('Kustomisasi Matplotlib Lanjutan', fontsize=14, fontweight='bold')
ax.set_xlabel('x (radian)')
ax.set_ylabel('y')
plt.tight_layout()
plt.show()
```

---

## 4.9 Color Theory untuk Visualisasi Data

1. **Sequential**: Untuk data berjenjang dari rendah ke tinggi (misalnya pendapatan, kepadatan). Contoh: `viridis`, `Blues`, `YlOrRd`.
2. **Diverging**: Untuk data dengan titik tengah bernilai netral (misalnya nol pada profit/rugi). Contoh: `RdBu`, `coolwarm`.
3. **Qualitative**: Untuk data kategorikal tanpa urutan (misalnya kategori produk). Contoh: `Set2`, `tab10`.

```python
# Menerapkan Colormap yang Tepat Sesuai Jenis Data
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 1. Sequential
revenue_wilayah = np.random.randint(10, 100, size=10)
axes[0].bar(range(10), revenue_wilayah, color=plt.cm.Blues(revenue_wilayah / revenue_wilayah.max()))
axes[0].set_title('Sequential: Revenue per Wilayah')

# 2. Diverging
profit_rugi = np.random.randint(-50, 50, size=10)
norm = mcolors.TwoSlopeNorm(vmin=profit_rugi.min(), vcenter=0, vmax=profit_rugi.max())
axes[1].bar(range(10), profit_rugi, color=plt.cm.RdBu(norm(profit_rugi)))
axes[1].axhline(0, color='black', linewidth=0.8)
axes[1].set_title('Diverging: Profit vs Rugi')

# 3. Qualitative
kategori = ['Elektronik', 'Fashion', 'Makanan', 'Kesehatan']
nilai = [30, 25, 20, 25]
axes[2].pie(nilai, labels=kategori, colors=plt.cm.Set2.colors)
axes[2].set_title('Qualitative: Kategori Produk')
plt.tight_layout()
plt.show()
```

---

## 4.10 Prinsip Dashboard Design

1. **Visual Hierarchy (Z-Pattern/F-Pattern)**: Tempatkan KPI Card utama di kiri atas.
2. **Aturan 5 Detik**: Dashboard harus dapat dipahami dalam 5 detik pertama.
3. **KPI Card**: Angka tebal dengan label singkat dan indikator naik/turun perbandingan.
4. **Grid Alignment**: Gunakan grid terstruktur konsisten (misalnya `GridSpec`).
5. **Progressive Disclosure**: Sajikan ringkasan di atas dan rincian drill-down di bawah.

---

## 4.11 Membangun Dashboard dengan GridSpec: Contoh Praktis

```python
# Kerangka Dashboard dengan GridSpec
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import pandas as pd

fig = plt.figure(figsize=(14, 8))
gs = gridspec.GridSpec(3, 4, figure=fig, hspace=0.5, wspace=0.4)

# Baris 1: tiga KPI card + satu indikator
kpi_data = [('Total Revenue', 'Rp 1.2 M', '+8.2%'),
            ('Total Order', '4,582', '+3.1%'),
            ('Conversion Rate', '3.4%', '-0.5%')]

for i, (label, nilai, delta) in enumerate(kpi_data):
    ax = fig.add_subplot(gs[0, i])
    warna_delta = 'green' if delta.startswith('+') else 'red'
    ax.text(0.5, 0.6, nilai, ha='center', va='center', fontsize=22, fontweight='bold')
    ax.text(0.5, 0.3, label, ha='center', va='center', fontsize=11, color='gray')
    ax.text(0.5, 0.05, delta, ha='center', va='center', fontsize=10, color=warna_delta)
    ax.axis('off')
    ax.set_facecolor('#F5F7FA')

# Baris 2-3: chart tren revenue (lebar) dan breakdown kategori (sempit)
ax_tren = fig.add_subplot(gs[1:, :3])
ax_tren.plot(range(30), pd.Series(range(30)).apply(lambda x: 1000 + x*20 + (x%7)*50))
ax_tren.set_title('Tren Revenue 30 Hari Terakhir', loc='left', fontweight='bold')

ax_kategori = fig.add_subplot(gs[1:, 3])
ax_kategori.barh(['Elektronik', 'Fashion', 'Makanan'], [45, 30, 25], color='steelblue')
ax_kategori.set_title('Kontribusi Kategori', loc='left', fontweight='bold')

fig.suptitle('Executive Summary Dashboard', fontsize=16, fontweight='bold')
plt.show()
```

---

## QUIZ TAMBAHAN — COLOR THEORY & DASHBOARD DESIGN

1. Sebuah dashboard menampilkan data profit dan rugi per divisi menggunakan colormap "jet" (rainbow). Apa masalah dari pilihan ini dan colormap jenis apa yang seharusnya digunakan?
   * **Jawaban:** Colormap jet/rainbow tidak dipersepsikan linear oleh mata manusia dan tidak memiliki titik tengah bermakna, padahal data profit/rugi memiliki titik nol yang penting. Seharusnya menggunakan diverging colormap seperti `RdBu` dengan titik tengah (`vcenter`) di nol.
2. Jelaskan mengapa KPI card sebaiknya diletakkan di bagian kiri atas dashboard!
   * **Jawaban:** Karena pola baca mata manusia pada layar umumnya mengikuti pola Z atau F, dimulai dari kiri atas. Menempatkan metrik terpenting di area tersebut memastikan informasi paling krusial terlihat pertama kali tanpa perlu scroll.
3. Apa itu "Aturan 5 Detik" dalam dashboard design, dan apa yang sebaiknya dilakukan jika sebuah dashboard memiliki lebih dari 9 elemen visual?
   * **Jawaban:** Aturan 5 Detik menyatakan dashboard idealnya bisa dipahami dalam 5 detik pertama tanpa membaca detail. Jika elemen visual terlalu banyak (>7-9), sebaiknya dipecah menjadi beberapa halaman/tab dengan pendekatan progressive disclosure.
4. Mengapa kombinasi warna merah-hijau sebaiknya dihindari sebagai satu-satunya indikator "buruk vs baik" pada dashboard?
   * **Jawaban:** Karena sekitar 8% pria mengalami buta warna merah-hijau (deuteranopia/protanopia) sehingga tidak dapat membedakan kedua warna tersebut. Sebaiknya dilengkapi indikator tambahan seperti ikon panah, pola, atau label angka.

---

## LATIHAN SOAL & TANTANGAN
1. Jelaskan perbedaan pyplot style dan OOP style di Matplotlib! Kapan sebaiknya menggunakan OOP?
2. Tulis kode untuk membuat dual-axis plot (twinx) yang menampilkan bar chart revenue dan line plot growth rate!
3. Apa itu GridSpec? Bagaimana cara membuat layout dengan plot yang berbeda ukuran?
4. Tulis kode untuk membuat Waterfall Chart dari data P&L sederhana!
5. Bagaimana cara menyimpan plot sebagai PNG (untuk web) dan PDF (untuk print) sekaligus?
6. Tulis kode untuk membuat animated plot (plt.FuncAnimation) yang menampilkan tren waktu!
$NOTE_DA_BAB_4_MATPLOTLIB_VISUALISASI_DATA$,
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

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Seaborn — Visualisasi Statistik Lanjutan',
    'da-bab-5-seaborn-visualisasi-statistik',
    $NOTE_DA_BAB_5_SEABORN_VISUALISASI_STATISTIK$# BAB 5 — SEABORN: VISUALISASI STATISTIK LANJUTAN

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 69–81 dari 148 | Pandas · NumPy · Matplotlib · Seaborn · NLP · Sentiment Analysis

---

## 5.1 Filosofi & Setup Seaborn

```python
# Setup Seaborn
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Setup Global 
sns.set_theme(
    style='whitegrid',       # whitegrid, darkgrid, white, dark, ticks
    palette='deep',          # deep, muted, pastel, bright, dark, colorblind
    font='Arial',
    font_scale=1.1,
    rc={
        'figure.figsize'   : (12, 6),
        'axes.spines.top'  : False,
        'axes.spines.right': False,
    }
)

# Palet Warna 
sns.color_palette('deep')      # 10 warna tegas
sns.color_palette('pastel')    # soft/pastel
sns.color_palette('husl', 8)   # 8 warna berbeda hue
sns.color_palette('Blues', 8)  # gradient biru
sns.color_palette('RdYlGn', 10)# diverging merah-kuning-hijau
sns.color_palette('Set1')      # 9 warna cerah

# Dataset Built-in untuk Latihan 
tips = sns.load_dataset('tips')        # restoran tips (244 rows)
iris = sns.load_dataset('iris')        # bunga iris (150 rows)
titanic = sns.load_dataset('titanic')  # titanic (891 rows)
penguins = sns.load_dataset('penguins')# penguin (344 rows)
flights = sns.load_dataset('flights')  # penerbangan (144 rows)
diamonds = sns.load_dataset('diamonds')# berlian (53940 rows)
```

---

## 5.2 Distribution Plots — Lengkap

```python
# Distribution Plots
tips = sns.load_dataset('tips')
fig, axes = plt.subplots(2, 3, figsize=(18, 10))

# 1. histplot 
sns.histplot(data=tips, x='total_bill', hue='time',
             kde=True, bins=25, ax=axes[0, 0],
             palette='Set2', alpha=0.6)
axes[0, 0].set_title('Histplot dengan KDE per Waktu')

# 2. kdeplot 
for day in tips['day'].unique():
    subset = tips[tips['day'] == day]
    sns.kdeplot(data=subset, x='total_bill', fill=True,
                alpha=0.3, label=day, ax=axes[0, 1])
axes[0, 1].set_title('KDE per Hari')
axes[0, 1].legend()

# 3. 2D KDE (bivariate) 
sns.kdeplot(data=tips, x='total_bill', y='tip',
            fill=True, cmap='Blues', ax=axes[0, 2])
sns.scatterplot(data=tips, x='total_bill', y='tip',
                s=15, alpha=0.5, color='red', ax=axes[0, 2])
axes[0, 2].set_title('2D KDE + Scatter')

# 4. ecdfplot 
sns.ecdfplot(data=tips, x='total_bill', hue='sex',
             ax=axes[1, 0], palette=['steelblue', 'coral'])
axes[1, 0].set_title('ECDF per Jenis Kelamin')
axes[1, 0].axvline(tips['total_bill'].median(), color='gray', ls='--')

# 5. rugplot overlay 
sns.histplot(data=tips, x='tip', bins=20, ax=axes[1, 1],
             color='mediumpurple', alpha=0.7, kde=True)
sns.rugplot(data=tips, x='tip', ax=axes[1, 1], color='red', height=0.06)
axes[1, 1].set_title('Histogram + Rug Plot')

# 6. Histogram + Statistik 
m, s = tips['total_bill'].mean(), tips['total_bill'].std()
axes[1, 2].text(0.05, 0.95, f'Mean: {m:.1f}\\nStd: {s:.1f}\\nN: {len(tips)}',
                transform=axes[1, 2].transAxes, va='top',
                bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
sns.histplot(data=tips, x='total_bill', ax=axes[1, 2], kde=True)
axes[1, 2].set_title('Histogram + Statistik')

plt.suptitle('Distribution Plots — Seaborn', fontsize=15, fontweight='bold')
plt.tight_layout()
plt.show()
```

---

## 5.3 Categorical Plots

```python
# Categorical Plots
tips = sns.load_dataset('tips')
fig, axes = plt.subplots(2, 3, figsize=(18, 10))

# 1. barplot (mean + CI) 
sns.barplot(data=tips, x='day', y='tip', hue='sex',
            errorbar='sd', capsize=0.08,
            palette='Set2', ax=axes[0, 0])
axes[0, 0].set_title('Bar Plot — Rata-rata Tip per Hari')

# 2. boxplot 
sns.boxplot(data=tips, x='day', y='total_bill', hue='time',
            notch=True, palette='pastel', ax=axes[0, 1])
sns.stripplot(data=tips, x='day', y='total_bill', hue='time',
              size=3, alpha=0.4, dodge=True, ax=axes[0, 1],
              palette='dark:gray', legend=False)
axes[0, 1].set_title('Box + Strip Plot')

# 3. violinplot 
sns.violinplot(data=tips, x='day', y='tip', hue='sex',
               split=True, inner='quartile',
               palette=['steelblue', 'salmon'], ax=axes[0, 2])
axes[0, 2].set_title('Violin Plot — Split by Sex')

# 4. countplot 
order = tips['day'].value_counts().index
sns.countplot(data=tips, x='day', hue='sex',
              order=order, palette='husl', ax=axes[1, 0])
axes[1, 0].set_title('Count Plot — Jumlah per Hari')

# 5. pointplot 
sns.pointplot(data=tips, x='day', y='tip', hue='sex',
              markers=['^', 'o'], linestyles=['--', '-'],
              errorbar='ci', dodge=0.2, ax=axes[1, 1])
axes[1, 1].set_title('Point Plot dengan CI')

# 6. boxenplot (Letter-Value Plot) 
sns.boxenplot(data=tips, x='day', y='total_bill',
              hue='time', palette='muted', ax=axes[1, 2])
axes[1, 2].set_title('Boxen Plot — Letter-Value')

plt.suptitle('Categorical Plots — Seaborn', fontsize=15, fontweight='bold')
plt.tight_layout()
plt.show()
```

---

## 5.4 Relational Plots

```python
# Relational Plots
tips = sns.load_dataset('tips')
penguins = sns.load_dataset('penguins').dropna()
flights = sns.load_dataset('flights')

fig, axes = plt.subplots(1, 3, figsize=(18, 5))

# 1. scatterplot dengan hue+size+style 
sns.scatterplot(data=penguins,
                x='bill_length_mm', y='body_mass_g',
                hue='species',
                size='flipper_length_mm',
                style='island',
                sizes=(50, 300),
                alpha=0.8, ax=axes[0])
axes[0].set_title('Scatter — Penguin Species')

# 2. lineplot dengan confidence band 
flights_pivot = flights.pivot(index='year', columns='month', values='passengers')
for month in ['January', 'July']:
    data = flights[flights['month'] == month]
    axes[1].plot(data['year'], data['passengers'],
                 marker='o', linewidth=2, label=month)
axes[1].set_title('Penumpang Pesawat — Jan vs Jul')
axes[1].legend()

# 3. regplot 
from scipy import stats
sns.regplot(data=tips, x='total_bill', y='tip',
            scatter_kws={'alpha': 0.5, 's': 40},
            line_kws={'color': 'red', 'lw': 2},
            ax=axes[2])
r, p = stats.pearsonr(tips['total_bill'], tips['tip'])
axes[2].text(0.05, 0.95, f'r = {r:.3f}\\np = {p:.4f}',
             transform=axes[2].transAxes, va='top',
             bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.7))
axes[2].set_title('Regression Plot + Statistik')
plt.tight_layout()
plt.show()

# relplot (figure-level, multi-panel) 
g = sns.relplot(
    data=tips, x='total_bill', y='tip',
    col='time', row='sex', hue='smoker',
    style='smoker', size='size', sizes=(30, 200),
    kind='scatter', height=3.5, aspect=1
)
g.set_axis_labels('Total Bill ($)', 'Tip ($)')
g.set_titles(col_template='{col_name}', row_template='{row_name}')
g.tight_layout()
plt.show()
```

---

## 5.5 Matrix Plots & Pairplot

```python
# Matrix Plots & Pairplot
penguins = sns.load_dataset('penguins').dropna()
numeric_cols = ['bill_length_mm', 'bill_depth_mm', 'flipper_length_mm', 'body_mass_g']

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# 1. Heatmap Korelasi 
corr = penguins[numeric_cols].corr()
mask = np.triu(np.ones_like(corr), k=1)  # sembunyikan segitiga atas
sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm',
            center=0, vmin=-1, vmax=1, square=True,
            mask=mask, linewidths=0.5, cbar_kws={'shrink': 0.8},
            ax=axes[0])
axes[0].set_title('Heatmap Korelasi Penguin\\n(Lower Triangle Only)')

# 2. Heatmap Pivot 
flights = sns.load_dataset('flights')
flights_pivot = flights.pivot(index='month', columns='year', values='passengers')
sns.heatmap(flights_pivot, annot=True, fmt='d', cmap='YlOrRd',
            linewidths=0.3, ax=axes[1])
axes[1].set_title('Heatmap: Penumpang Pesawat per Bulan & Tahun')
plt.tight_layout()
plt.show()

# 3. Pairplot 
g = sns.pairplot(
    penguins[numeric_cols + ['species']],
    hue='species',
    diag_kind='kde',
    plot_kws={'alpha': 0.6, 's': 40},
    diag_kws={'fill': True, 'alpha': 0.5},
    corner=True
)
g.map_lower(sns.kdeplot, levels=3, color='.2', alpha=0.4)
g.figure.suptitle('Pairplot Penguin per Species', y=1.01, fontsize=14)
plt.show()
```

---

## 5.6 FacetGrid — Multi-panel Plots

```python
# FacetGrid Lanjutan
tips = sns.load_dataset('tips')

g = sns.FacetGrid(
    tips,
    col='time',
    row='sex',
    hue='smoker',
    height=3.5,
    aspect=1.2,
    palette=['steelblue', 'coral'],
    margin_titles=True
)
g.map(sns.scatterplot, 'total_bill', 'tip', alpha=0.6, s=50)
g.map(sns.regplot, 'total_bill', 'tip',
      scatter=False, color='red', ci=None, line_kws={'lw': 1.5})
g.add_legend()
g.set_axis_labels('Total Bill ($)', 'Tip ($)')
g.set_titles(col_template='{col_name}', row_template='{row_name}')
g.figure.suptitle('FacetGrid: Tips per Waktu, Sex, & Smoker', fontsize=13, y=1.02)
plt.show()

# catplot (figure-level categorical) 
g2 = sns.catplot(
    data=tips,
    x='day',
    y='tip',
    col='time',
    hue='sex',
    kind='violin',
    split=True,
    inner='quartile',
    palette='muted',
    height=5,
    aspect=0.9
)
g2.set_titles('{col_name}')
g2.figure.suptitle('catplot: Violin per Waktu & Hari', y=1.02)
plt.show()
```

---

## 5.7 Studi Kasus: Dashboard Analitik HR

 **Skenario:** Analisis komprehensif data karyawan untuk memahami distribusi gaji, performa, dan faktor-faktor yang mempengaruhi *attrition* (turnover) karyawan.

```python
# STUDI KASUS: HR Analytics Dashboard
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import stats

# Simulasi Dataset HR 
np.random.seed(42)
n = 500
dept_list = ['Engineering', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations']

hr = pd.DataFrame({
    'emp_id'      : [f'E{i:04d}' for i in range(n)],
    'dept'        : np.random.choice(dept_list, n, p=[0.3, 0.15, 0.2, 0.15, 0.1, 0.1]),
    'gender'      : np.random.choice(['Male', 'Female'], n, p=[0.55, 0.45]),
    'age'         : np.random.normal(35, 8, n).clip(22, 60).astype(int),
    'experience'  : np.random.randint(0, 25, n),
    'education'   : np.random.choice(['S1', 'S2', 'S3', 'D3'], n, p=[0.5, 0.3, 0.1, 0.1]),
    'performance' : np.random.choice([1, 2, 3, 4, 5], n, p=[0.05, 0.15, 0.35, 0.3, 0.15]),
    'satisfaction': np.random.randint(1, 11, n),
    'salary'      : np.random.lognormal(16, 0.4, n).round(-5),
    'attrition'   : np.random.choice([0, 1], n, p=[0.83, 0.17]),
})

hr['salary'] = hr['salary'] * (1 + hr['performance']*0.1) * (1 + hr['experience']*0.02)

# Dashboard 6-Panel 
fig, axes = plt.subplots(2, 3, figsize=(18, 12))
fig.suptitle('DASHBOARD ANALITIK HR — 2024', fontsize=18, fontweight='bold', y=0.98)
sns.set_theme(style='whitegrid', palette='deep')

# Panel 1: Distribusi Gaji per Dept
dept_order = hr.groupby('dept')['salary'].median().sort_values(ascending=False).index
sns.boxplot(data=hr, x='salary', y='dept', order=dept_order,
            hue='gender', palette='pastel', ax=axes[0, 0])
axes[0, 0].set_title('Distribusi Gaji per Departemen & Gender')
axes[0, 0].set_xlabel('Gaji (Rp)')
axes[0, 0].xaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'{x/1e6:.0f}M'))

# Panel 2: Attrition Rate per Dept
attrition_rate = hr.groupby('dept')['attrition'].mean().reset_index()
attrition_rate.columns = ['dept', 'rate']
attrition_rate = attrition_rate.sort_values('rate', ascending=False)
bars = axes[0, 1].barh(attrition_rate['dept'], attrition_rate['rate']*100,
                      color=['#E53935' if r > 0.2 else '#43A047' for r in attrition_rate['rate']])
for bar in bars:
    w = bar.get_width()
    axes[0, 1].text(w+0.3, bar.get_y()+bar.get_height()/2, f'{w:.1f}%', va='center', fontsize=9, fontweight='bold')
axes[0, 1].axvline(hr['attrition'].mean()*100, color='gray', ls='--', label='Avg')
axes[0, 1].set_title('Attrition Rate per Departemen')
axes[0, 1].legend()

# Panel 3: Performance vs Satisfaction
sns.scatterplot(data=hr, x='satisfaction', y='performance',
                hue='attrition', style='gender',
                palette={0: 'steelblue', 1: 'red'},
                alpha=0.6, s=60, ax=axes[0, 2])
axes[0, 2].set_title('Performance vs Kepuasan Kerja\\n(Merah = Resign)')

# Panel 4: Heatmap Korelasi
num_cols = ['age', 'experience', 'salary', 'performance', 'satisfaction', 'attrition']
corr = hr[num_cols].corr()
sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm',
            center=0, square=True, ax=axes[1, 0], cbar_kws={'shrink': 0.8})
axes[1, 0].set_title('Matriks Korelasi')

# Panel 5: Distribusi Usia & Pendidikan
sns.histplot(data=hr, x='age', hue='education', kde=True, bins=20, ax=axes[1, 1],
             palette='Set2', alpha=0.6)
axes[1, 1].axvline(hr['age'].mean(), color='red', ls='--', label=f'Mean: {hr["age"].mean():.0f}')
axes[1, 1].set_title('Distribusi Usia per Pendidikan')
axes[1, 1].legend()

# Panel 6: Salary vs Experience dengan Regression
sns.regplot(data=hr, x='experience', y='salary',
            scatter_kws={'alpha': 0.3, 's': 30},
            line_kws={'color': 'red', 'lw': 2},
            ax=axes[1, 2])
r, p = stats.pearsonr(hr['experience'], hr['salary'])
axes[1, 2].text(0.05, 0.95, f'r = {r:.3f}\\np = {p:.4f}',
                transform=axes[1, 2].transAxes, va='top',
                bbox=dict(boxstyle='round', fc='wheat', alpha=0.8))
axes[1, 2].set_title('Gaji vs Pengalaman Kerja')
axes[1, 2].yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'{x/1e6:.0f}M'))

plt.tight_layout(rect=[0, 0, 1, 0.97])
plt.savefig('hr_dashboard.png', dpi=150, bbox_inches='tight')
plt.show()

# Insight Otomatis 
print('=== INSIGHT HR ANALYTICS ===')
print(f'Total Karyawan           : {len(hr):,}')
print(f'Attrition Rate           : {hr["attrition"].mean()*100:.1f}%')
print(f'Dept Attrition Tertinggi : {attrition_rate.iloc[0]["dept"]} ({attrition_rate.iloc[0]["rate"]*100:.1f}%)')
print(f'Korelasi Salary-Exp      : r = {r:.3f}')
print(f'Rata-rata Gaji           : Rp {hr["salary"].mean():,.0f}')
print(f'Rata-rata Kepuasan       : {hr["satisfaction"].mean():.1f}/10')
print(f'Karyawan Resign (satisfaction<5): {(hr[hr["satisfaction"]<5]["attrition"].mean()*100):.1f}%')
```

---

## 5.8 Executive Dashboard --- Ringkasan untuk Level Manajemen

```python
# Studi Kasus: Executive Dashboard Ringkasan Bulanan
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

rng = pd.date_range('2024-01-01', periods=12, freq='MS')
df_exec = pd.DataFrame({
    'bulan'     : rng,
    'revenue'   : [820, 850, 910, 890, 940, 980, 1020, 990, 1050, 1080, 1120, 1180],
    'target'    : [800]*12,
    'margin_pct': [22, 23, 21, 24, 25, 24, 26, 25, 27, 26, 28, 29],
})

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Chart 1: Revenue vs Target
sns.lineplot(data=df_exec, x='bulan', y='revenue', marker='o', ax=axes[0], label='Revenue Aktual')
sns.lineplot(data=df_exec, x='bulan', y='target', linestyle='--', color='gray', ax=axes[0], label='Target')
axes[0].set_title('Revenue vs Target Bulanan (Rp Juta)', loc='left', fontweight='bold')
axes[0].set_xlabel('')
axes[0].set_ylabel('')

# Chart 2: Tren margin
sns.barplot(data=df_exec, x='bulan', y='margin_pct', color='seagreen', ax=axes[1])
axes[1].set_title('Tren Margin Keuntungan (%)', loc='left', fontweight='bold')
axes[1].set_xlabel('')
axes[1].set_ylabel('')

for ax in axes:
    ax.tick_params(axis='x', rotation=45)
    sns.despine(ax=ax)

plt.suptitle('Executive Summary --- Performa Bisnis 2024', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print(f"Insight: Revenue Desember {df_exec['revenue'].iloc[-1]}jt, "
      f"{(df_exec['revenue'].iloc[-1]/df_exec['target'].iloc[-1]-1)*100:.1f}% di atas target, "
      f"margin naik dari {df_exec['margin_pct'].iloc[0]}% ke {df_exec['margin_pct'].iloc[-1]}%")
```

---

## 5.9 Financial Dashboard --- Revenue, Cost, dan Margin

```python
# Studi Kasus: Waterfall Chart Laporan Laba Rugi
kategori = ['Revenue', 'COGS', 'Opex', 'Marketing', 'Pajak', 'Net Profit']
nilai = [1000, -400, -200, -150, -60, 190]  # dalam Rp juta

kumulatif = pd.Series(nilai).cumsum()
mulai = kumulatif.shift(1).fillna(0)
mulai.iloc[-1] = 0  # net profit dimulai dari 0 sebagai total akhir

warna = ['steelblue'] + ['indianred' if v < 0 else 'seagreen' for v in nilai[1:-1]] + ['steelblue']

fig, ax = plt.subplots(figsize=(10, 5))
for i, (kat, v, m, w) in enumerate(zip(kategori, nilai, mulai, warna)):
    ax.bar(kat, v, bottom=m, color=w)
    ax.text(i, m + v/2, f'{v:+,}', ha='center', va='center', color='white', fontweight='bold')

ax.set_title('Waterfall: Dari Revenue ke Net Profit (Rp Juta)', loc='left', fontweight='bold')
ax.axhline(0, color='black', linewidth=0.8)
sns.despine()
plt.tight_layout()
plt.show()
```

---

## 5.10 Sales & Marketing Dashboard --- Funnel dan Performa Campaign

```python
# Studi Kasus: Funnel Konversi dan Perbandingan Campaign
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Chart 1: Funnel konversi
tahap = ['Visitor', 'Add to Cart', 'Checkout', 'Payment', 'Selesai']
jumlah = [10000, 3200, 1800, 1400, 1250]
persen_dari_awal = [f'{j/jumlah[0]*100:.0f}%' for j in jumlah]

sns.barplot(x=jumlah, y=tahap, hue=tahap, palette='Blues_r', legend=False, ax=axes[0])
for i, (j, p) in enumerate(zip(jumlah, persen_dari_awal)):
    axes[0].text(j + 150, i, f'{j:,} ({p})', va='center', fontweight='bold')
axes[0].set_title('Funnel Konversi E-Commerce', loc='left', fontweight='bold')
axes[0].set_xlabel('Jumlah User')
sns.despine(ax=axes[0])

# Chart 2: Perbandingan ROI campaign marketing
df_campaign = pd.DataFrame({
    'campaign': ['Instagram Ads', 'Google Ads', 'Email Blast', 'TikTok Ads', 'Affiliate'],
    'biaya_jt': [50, 80, 10, 40, 25],
    'revenue_jt': [180, 220, 45, 95, 110],
})
df_campaign['roi_pct'] = (df_campaign['revenue_jt'] - df_campaign['biaya_jt']) / df_campaign['biaya_jt'] * 100
df_campaign = df_campaign.sort_values('roi_pct', ascending=False)

sns.barplot(data=df_campaign, x='roi_pct', y='campaign', hue='campaign',
            palette='RdYlGn', legend=False, ax=axes[1])
axes[1].set_title('ROI per Channel Marketing (%)', loc='left', fontweight='bold')
axes[1].set_xlabel('ROI (%)')
sns.despine(ax=axes[1])

plt.tight_layout()
plt.show()

print(f"Insight Funnel: Drop-off terbesar terjadi dari Visitor ke Add to Cart "
      f"({(1 - jumlah[1]/jumlah[0])*100:.0f}% hilang) -- prioritaskan optimasi halaman produk.")
print(f"Insight Campaign: {df_campaign.iloc[0]['campaign']} memiliki ROI tertinggi "
      f"({df_campaign.iloc[0]['roi_pct']:.0f}%), pertimbangkan menambah budget di channel ini.")
```

---

## QUIZ TAMBAHAN — BUSINESS DASHBOARDS

1. Mengapa Executive Dashboard sebaiknya dibatasi maksimal 5-7 metrik dan disertai kalimat insight tertulis, bukan hanya chart?
   * **Jawaban:** Karena audiens level eksekutif memiliki waktu terbatas dan sering hanya membaca ringkasan tertulis, bukan menginterpretasi grafik secara mendalam. Terlalu banyak metrik justru mengaburkan pesan utama yang ingin disampaikan.
2. Jelaskan mengapa waterfall chart lebih efektif dibanding tabel angka biasa untuk menampilkan laporan laba rugi!
   * **Jawaban:** Waterfall chart secara visual langsung menunjukkan kontribusi setiap komponen (COGS, Opex, dsb.) terhadap perubahan dari Revenue ke Net Profit, sehingga komponen yang paling menggerus profit langsung terlihat tanpa perlu membandingkan angka satu per satu di tabel.
3. Pada funnel konversi e-commerce, tahap mana yang paling penting dianalisis dan mengapa?
   * **Jawaban:** Tahap dengan drop-off (penurunan jumlah user) terbesar antar tahap berurutan, karena itu menunjukkan titik kebocoran terbesar dalam perjalanan pelanggan yang paling berpotensi diperbaiki untuk meningkatkan konversi akhir secara signifikan.

---

## LATIHAN SOAL & TANTANGAN
1. Jelaskan perbedaan antara axes-level functions (`sns.barplot`) dan figure-level functions (`sns.catplot`)!
2. Kapan menggunakan violinplot vs boxplot vs boxenplot? Apa kelebihan masing-masing?
3. Tulis kode untuk membuat FacetGrid dengan 3 baris (low/mid/high income) dan 2 kolom (male/female)!
4. Bagaimana cara menambahkan nilai korelasi Pearson ke dalam scatter plot secara otomatis?
5. Apa itu `split=True` pada violinplot? Kapan parameter ini berguna?
6. Tulis kode untuk membuat heatmap yang hanya menampilkan segitiga bawah (lower triangle)!
7. Bagaimana cara mengkombinasikan boxplot + stripplot secara bersamaan dalam satu axes?

---

## KUNCI JAWABAN / PETUNJUK
1. **Axes-level**: menggambar pada Axes yang sudah ada (bisa dikombinasikan), memiliki parameter `ax=`. **Figure-level**: membuat Figure baru secara mandiri, mendukung faceting baris/kolom otomatis, tidak menerima parameter `ax=`.
2. **Boxplot**: ringkas & cepat, efektif menampilkan outlier. **Violin**: menampilkan estimasi densitas distribusi secara penuh. **Boxenplot**: lebih detail untuk dataset besar karena menampilkan lebih banyak kuantil.
3. `g = sns.FacetGrid(data, row='income_group', col='gender'); g.map(sns.histplot, 'kolom_target')`.
4. Hitung `r, p = stats.pearsonr(x, y)` lalu tampilkan teks dengan `ax.text()` atau `ax.annotate()`.
5. `split=True` membagi dua sisi violin (kiri/kanan) untuk dua level `hue`, sangat hemat ruang untuk membandingkan 2 kelompok di satu sumbu X.
6. Buat `mask = np.triu(np.ones_like(corr), k=1)` lalu pass ke `sns.heatmap(corr, mask=mask)`.
7. Panggil `sns.boxplot()` terlebih dahulu, kemudian panggil `sns.stripplot()` pada objek axes yang sama dengan `dodge=True` jika menggunakan `hue`.
$NOTE_DA_BAB_5_SEABORN_VISUALISASI_STATISTIK$,
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

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: SQL for Data Analyst',
    'da-bab-8-sql-for-data-analyst',
    $NOTE_DA_BAB_8_SQL_FOR_DATA_ANALYST$# BAB 8 — SQL FOR DATA ANALYST

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 122–128 dari 148 | SQL · PostgreSQL · CTE · Window Functions · Cohort Analysis

---

## 8.1 Pengantar SQL: RDBMS dan Kapan Menggunakan SQL vs Pandas

SQL (*Structured Query Language*) adalah bahasa standar industri untuk mengakses dan menganalisis data yang tersimpan di database relasional. Hampir setiap perusahaan menyimpan data transaksinya di database SQL (PostgreSQL, MySQL, BigQuery, Snowflake, dsb.) — menguasai SQL adalah keterampilan wajib bagi Data Analyst di perusahaan mana pun.

* **Kapan menggunakan SQL:** Ketika data tersimpan langsung di database perusahaan dan berukuran sangat besar (jutaan hingga miliaran baris) yang tidak realistis diunduh sepenuhnya ke memori lokal. Database melakukan komputasi di sisi server (*pushdown computation*) yang jauh lebih kuat.
* **Kapan menggunakan Pandas:** Ketika data sudah berhasil diringkas/diambil (biasanya lewat query SQL) dan perlu diolah lebih lanjut dengan logika kompleks, digabung dengan visualisasi interaktif, atau dipakai untuk pemodelan Machine Learning.

Alur ideal:
$$\\text{Database SQL} \\xrightarrow{\\text{Query & Agregasi}} \\text{Data Terfilter} \\xrightarrow{\\text{Pandas}} \\text{Visualisasi & Insight}$$

---

## 8.2 SELECT, WHERE, ORDER BY, LIMIT, dan DISTINCT

```sql
--  Query Dasar: SELECT, WHERE, ORDER BY, LIMIT
-- Mengambil 10 transaksi dengan revenue tertinggi dari kategori Elektronik
SELECT
    transaction_id,
    customer_id,
    kategori,
    revenue,
    tanggal_transaksi
FROM transaksi
WHERE kategori = 'Elektronik'
  AND revenue > 0
  AND tanggal_transaksi >= '2024-01-01'
ORDER BY revenue DESC
LIMIT 10;

-- DISTINCT -- menampilkan nilai unik dari sebuah kolom
SELECT DISTINCT kategori
FROM transaksi
ORDER BY kategori;
```

> [!IMPORTANT]
> **Urutan Eksekusi SQL secara Konseptual:**
> $$\text{FROM} \longrightarrow \text{WHERE} \longrightarrow \text{GROUP BY} \longrightarrow \text{HAVING} \longrightarrow \text{SELECT} \longrightarrow \text{ORDER BY} \longrightarrow \text{LIMIT}$$
> Memahami urutan ini membantu memahami mengapa alias kolom yang didefinisikan di `SELECT` tidak bisa langsung digunakan di klausa `WHERE`.

---

## 8.3 GROUP BY, HAVING, dan Fungsi Agregasi

```sql
--  GROUP BY dan HAVING untuk Analisis KPI Penjualan
-- Kategori dengan total revenue di atas 100 juta, diurutkan dari terbesar
SELECT
    kategori,
    COUNT(*) AS jumlah_transaksi,
    SUM(revenue) AS total_revenue,
    AVG(revenue) AS rata_rata_revenue,
    MAX(revenue) AS revenue_tertinggi
FROM transaksi
GROUP BY kategori
HAVING SUM(revenue) > 100000000
ORDER BY total_revenue DESC;
```

> [!WARNING]
> Menggunakan `WHERE` alih-alih `HAVING` untuk memfilter hasil agregasi (contoh: `WHERE SUM(revenue) > 100000000`) akan menghasilkan error, karena `WHERE` dieksekusi sebelum agregasi `GROUP BY` selesai dijalankan.

---

## 8.4 CASE WHEN: Logika Kondisional dalam SQL

```sql
--  CASE WHEN untuk Segmentasi Pelanggan
SELECT
    customer_id,
    SUM(revenue) AS total_belanja,
    CASE
        WHEN SUM(revenue) >= 10000000 THEN 'Platinum'
        WHEN SUM(revenue) >= 5000000  THEN 'Gold'
        WHEN SUM(revenue) >= 1000000  THEN 'Silver'
        ELSE 'Regular'
    END AS tingkat_pelanggan
FROM transaksi
GROUP BY customer_id
ORDER BY total_belanja DESC;
```

---

## 8.5 JOIN: Menggabungkan Data dari Beberapa Tabel

1. **INNER JOIN**: Hanya menghasilkan baris yang memiliki kecocokan di KEDUA tabel.
2. **LEFT JOIN**: Menghasilkan SEMUA baris dari tabel kiri, dilengkapi data dari tabel kanan jika ada kecocokan (NULL jika tidak ada).
3. **RIGHT JOIN**: Semua baris dari tabel kanan dipertahankan.
4. **FULL OUTER JOIN**: Menghasilkan semua baris dari kedua tabel.
5. **SELF JOIN**: Menggabungkan tabel dengan dirinya sendiri (misalnya hierarki karyawan-atasan).

```sql
--  Contoh LEFT JOIN: Transaksi dengan Data Pelanggan
SELECT
    t.transaction_id,
    t.revenue,
    c.nama_pelanggan,
    c.kota
FROM transaksi t
LEFT JOIN pelanggan c
    ON t.customer_id = c.customer_id
WHERE t.tanggal_transaksi >= '2024-01-01';
```

---

## 8.6 Subquery dan CTE (Common Table Expression)

CTE (menggunakan klausa `WITH`) adalah cara modern dan jauh lebih terbaca untuk mendefinisikan hasil query sementara:

```sql
--  CTE untuk Analisis Pelanggan Bernilai Tinggi
WITH revenue_per_pelanggan AS (
    SELECT
        customer_id,
        SUM(revenue) AS total_revenue,
        COUNT(*) AS jumlah_transaksi
    FROM transaksi
    GROUP BY customer_id
),
rata_rata_keseluruhan AS (
    SELECT AVG(total_revenue) AS rata_rata
    FROM revenue_per_pelanggan
)
SELECT
    r.customer_id,
    r.total_revenue,
    r.jumlah_transaksi
FROM revenue_per_pelanggan r, rata_rata_keseluruhan a
WHERE r.total_revenue > a.rata_rata
ORDER BY r.total_revenue DESC;
```

---

## 8.7 Window Functions: RANK, ROW_NUMBER, LAG/LEAD, dan Rolling Average

```sql
--  RANK dan ROW_NUMBER: Peringkat Produk Terlaris per Kategori
SELECT
    kategori,
    nama_produk,
    total_terjual,
    RANK() OVER (
        PARTITION BY kategori ORDER BY total_terjual DESC
    ) AS peringkat_dalam_kategori,
    ROW_NUMBER() OVER (
        PARTITION BY kategori ORDER BY total_terjual DESC
    ) AS urutan_unik
FROM ringkasan_produk;

--  LAG/LEAD dan Rolling Average: Analisis Tren Bulanan
SELECT
    bulan,
    revenue,
    LAG(revenue, 1) OVER (ORDER BY bulan) AS revenue_bulan_lalu,
    revenue - LAG(revenue, 1) OVER (ORDER BY bulan) AS perubahan_mom,
    AVG(revenue) OVER (
        ORDER BY bulan
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS rolling_avg_3_bulan
FROM revenue_bulanan
ORDER BY bulan;
```

---

## 8.8 Index dan Dasar Query Optimization

```sql
--  Membuat Index dan Memeriksa Query Plan
CREATE INDEX idx_transaksi_customer ON transaksi (customer_id);
CREATE INDEX idx_transaksi_tanggal ON transaksi (tanggal_transaksi);

EXPLAIN ANALYZE
SELECT * FROM transaksi
WHERE customer_id = 12345
  AND tanggal_transaksi >= '2024-01-01';
```

> [!TIP]
> **Best Practice:** Hindari `SELECT *` pada tabel besar, hindari membungkus kolom dalam fungsi di klausa `WHERE` (contoh: `WHERE YEAR(tanggal) = 2024` merusak penggunaan indeks; gunakan `WHERE tanggal >= '2024-01-01' AND tanggal < '2025-01-01'`), dan gunakan `LIMIT` saat eksplorasi data.

---

## 8.9 Studi Kasus Bisnis: Cohort Analysis dan Customer Retention dengan SQL

```sql
--  Cohort Analysis: Retensi Pelanggan per Bulan Akuisisi
WITH cohort_pelanggan AS (
    -- Tentukan cohort setiap pelanggan berdasarkan bulan transaksi pertama
    SELECT
        customer_id,
        DATE_TRUNC('month', MIN(tanggal_transaksi)) AS bulan_cohort
    FROM transaksi
    GROUP BY customer_id
),
aktivitas_bulanan AS (
    -- Setiap transaksi dikaitkan dengan cohort asal pelanggannya
    SELECT
        c.bulan_cohort,
        DATE_TRUNC('month', t.tanggal_transaksi) AS bulan_aktivitas,
        COUNT(DISTINCT t.customer_id) AS jumlah_pelanggan_aktif
    FROM transaksi t
    JOIN cohort_pelanggan c ON t.customer_id = c.customer_id
    GROUP BY c.bulan_cohort, DATE_TRUNC('month', t.tanggal_transaksi)
)
SELECT
    bulan_cohort,
    bulan_aktivitas,
    jumlah_pelanggan_aktif,
    EXTRACT(MONTH FROM AGE(bulan_aktivitas, bulan_cohort)) AS bulan_ke
FROM aktivitas_bulanan
ORDER BY bulan_cohort, bulan_aktivitas;
```

---

## LATIHAN SOAL & TANTANGAN
1. Jelaskan perbedaan `WHERE` dan `HAVING`, lalu berikan contoh kasus yang mengharuskan penggunaan `HAVING`!
2. Tulis query dengan `LEFT JOIN` untuk menampilkan semua pelanggan beserta total transaksinya, termasuk pelanggan yang belum pernah bertransaksi sama sekali!
3. Apa perbedaan `RANK()` dan `ROW_NUMBER()`? Berikan contoh kasus nyata di mana hasil keduanya berbeda!
4. Tulis query menggunakan CTE untuk menemukan 3 kategori produk dengan pertumbuhan revenue tercepat dibanding bulan sebelumnya!
5. Mengapa index tidak selalu mempercepat query, dan kapan sebaiknya index TIDAK dibuat pada suatu kolom?
6. Jelaskan konsep cohort analysis dan mengapa metrik ini penting untuk mengukur kesehatan bisnis subscription/e-commerce!

---

## KUNCI JAWABAN / PETUNJUK
1. `WHERE` memfilter baris SEBELUM agregasi (`GROUP BY`), `HAVING` memfilter SETELAH agregasi. Contoh: `HAVING SUM(revenue) > 100000000`.
2. `SELECT c.customer_id, c.nama_pelanggan, COALESCE(SUM(t.revenue), 0) AS total_revenue FROM pelanggan c LEFT JOIN transaksi t ON c.customer_id = t.customer_id GROUP BY c.customer_id, c.nama_pelanggan;`
3. `RANK()` memberi peringkat sama jika nilainya kembar lalu melompati urutan berikutnya (1, 1, 3); `ROW_NUMBER()` selalu menghasilkan nomor urut unik berurutan (1, 2, 3).
4. Gunakan CTE pertama untuk `SUM(revenue)` per kategori per bulan, CTE kedua menghitung `LAG(revenue)` dan rasio pertumbuhan, lalu `ORDER BY growth DESC LIMIT 3`.
5. Index menambah *overhead* saat operasi penulisan (`INSERT/UPDATE/DELETE`) dan tidak efektif untuk kolom berkardinalitas sangat rendah (seperti boolean `is_active`).
6. Cohort analysis melacak retensi kelompok pelanggan berdasarkan periode pendaftaran/akuisisi yang sama, memisahkan kinerja produk riil dari efek pertumbuhan volume pengguna baru semata.
$NOTE_DA_BAB_8_SQL_FOR_DATA_ANALYST$,
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

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Statistik untuk Data Analyst',
    'da-bab-9-statistik-untuk-data-analyst',
    $NOTE_DA_BAB_9_STATISTIK_UNTUK_DATA_ANALYST$# BAB 9 — STATISTIK UNTUK DATA ANALYST

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 129–137 dari 148 | Scipy · Statsmodels · Hipotesis · ANOVA · Regresi

---

## 9.1 Ukuran Pemusatan: Mean, Median, dan Mode

```python
# Mean vs Median: Dampak Outlier terhadap Interpretasi Gaji
import numpy as np

gaji_karyawan = [5, 5.5, 6, 6, 6.5, 7, 7.5, 8, 45]  # dalam juta rupiah, 1 outlier (direktur)

print(f'Mean   : Rp {np.mean(gaji_karyawan):.2f} juta')    # ~10.72 juta -- menyesatkan!
print(f'Median : Rp {np.median(gaji_karyawan):.2f} juta')  # 6.5 juta -- lebih representatif
```

> [!TIP]
> **Best Practice:** Jika data miring (*skewed*) atau memiliki outlier ekstrem, laporkan **median**, atau laporkan keduanya (mean dan median) sekaligus agar pembaca menyadari adanya skewness.

---

## 9.2 Ukuran Sebaran: Variance, Standard Deviation, Percentile, Quartile, dan IQR

```python
# Menghitung dan Menginterpretasikan Ukuran Sebaran
import numpy as np

revenue_toko_a = np.array([95, 98, 102, 100, 97, 103, 99])   # stabil
revenue_toko_b = np.array([60, 140, 90, 130, 70, 120, 90])   # fluktuatif

for nama, data in [('Toko A', revenue_toko_a), ('Toko B', revenue_toko_b)]:
    print(f'{nama}: mean={data.mean():.1f}, std={data.std():.1f}, '
          f'Q1={np.percentile(data, 25):.1f}, Q3={np.percentile(data, 75):.1f}')
```

---

## 9.3 Distribusi Data: Normal Distribution, Skewness, dan Kurtosis

```python
# Menguji Normalitas dan Mengukur Skewness/Kurtosis
from scipy import stats

# Uji Shapiro-Wilk untuk memeriksa apakah data mengikuti distribusi normal
statistik, p_value = stats.shapiro(df['revenue'])
print(f'Shapiro-Wilk p-value: {p_value:.4f}')

if p_value > 0.05:
    print('Data mengikuti distribusi normal (gagal tolak H0)')
else:
    print('Data TIDAK mengikuti distribusi normal -- pertimbangkan transformasi log')

print(f"Skewness: {df['revenue'].skew():.2f}")
print(f"Kurtosis: {df['revenue'].kurt():.2f}")
```

---

## 9.4 Sampling dan Probability Dasar

```python
# Stratified Sampling dengan Pandas
# Mengambil sampel 20% dari setiap kategori produk secara proporsional
sampel_stratified = df.groupby('kategori', group_keys=False).apply(
    lambda x: x.sample(frac=0.2, random_state=42)
)

print('Proporsi asli   :', (df['kategori'].value_counts(normalize=True) * 100).round(1).to_dict())
print('Proporsi sampel :', (sampel_stratified['kategori'].value_counts(normalize=True) * 100).round(1).to_dict())
```

> [!NOTE]
> **Central Limit Theorem (CLT):** Distribusi rata-rata dari banyak sampel acak (ukuran $n \ge 30$) akan mendekati distribusi normal, terlepas dari bentuk distribusi populasi aslinya.

---

## 9.5 Confidence Interval (Interval Kepercayaan)

```python
# Menghitung 95% Confidence Interval untuk Rata-Rata Revenue
from scipy import stats
import numpy as np

sampel_revenue = df['revenue'].sample(200, random_state=42)
mean_sampel = sampel_revenue.mean()
sem = stats.sem(sampel_revenue)  # standard error of the mean

ci_bawah, ci_atas = stats.t.interval(
    confidence=0.95,
    df=len(sampel_revenue) - 1,
    loc=mean_sampel,
    scale=sem
)

print(f'Rata-rata revenue sampel: Rp {mean_sampel:,.0f}')
print(f'95% Confidence Interval : Rp {ci_bawah:,.0f} -- Rp {ci_atas:,.0f}')
```

---

## 9.6 Hypothesis Testing: H0, H1, dan p-value

* **H0 (Null Hypothesis)**: Status quo / tidak ada efek / tidak ada perbedaan.
* **H1 (Alternative Hypothesis)**: Terdapat perbedaan / efek nyata.
* **p-value**: Probabilitas mendapatkan hasil seekstrem yang diamati jika H0 benar. Jika $p < 0.05$, tolak H0.

---

## 9.7 T-Test: Membandingkan Rata-Rata Dua Kelompok

```python
# Independent T-Test: A/B Testing Desain Halaman Checkout
from scipy import stats

waktu_checkout_desain_a = df[df['desain'] == 'A']['waktu_checkout_detik']
waktu_checkout_desain_b = df[df['desain'] == 'B']['waktu_checkout_detik']

t_statistik, p_value = stats.ttest_ind(
    waktu_checkout_desain_a, waktu_checkout_desain_b, equal_var=False  # Welch's T-Test
)

print(f'Rata-rata Desain A: {waktu_checkout_desain_a.mean():.1f} detik')
print(f'Rata-rata Desain B: {waktu_checkout_desain_b.mean():.1f} detik')
print(f'p-value           : {p_value:.4f}')

alpha = 0.05
if p_value < alpha:
    print('Perbedaan signifikan secara statistik -- rekomendasikan desain lebih cepat')
else:
    print('Perbedaan TIDAK signifikan -- belum cukup bukti')
```

---

## 9.8 Chi-Square Test: Hubungan Antar Variabel Kategorikal

```python
# Chi-Square Test: Hubungan Channel Marketing dan Konversi
from scipy import stats
import pandas as pd

tabel_kontingensi = pd.crosstab(df['channel_marketing'], df['status_konversi'])
print(tabel_kontingensi)

chi2_statistik, p_value, dof, nilai_ekspektasi = stats.chi2_contingency(tabel_kontingensi)
print(f'Chi-Square Statistic: {chi2_statistik:.2f}')
print(f'p-value             : {p_value:.4f}')

if p_value < 0.05:
    print('Ada hubungan signifikan antara channel marketing dan konversi!')
```

---

## 9.9 ANOVA: Membandingkan Rata-Rata Lebih dari Dua Kelompok

```python
# One-Way ANOVA: Revenue di Empat Wilayah Penjualan
from scipy import stats

revenue_jakarta = df[df['wilayah'] == 'Jakarta']['revenue']
revenue_surabaya = df[df['wilayah'] == 'Surabaya']['revenue']
revenue_bandung = df[df['wilayah'] == 'Bandung']['revenue']
revenue_medan = df[df['wilayah'] == 'Medan']['revenue']

f_statistik, p_value = stats.f_oneway(
    revenue_jakarta, revenue_surabaya, revenue_bandung, revenue_medan
)
print(f'F-Statistic: {f_statistik:.2f}, p-value: {p_value:.4f}')
```

---

## 9.10 Correlation & Linear Regression: Interpretasi Bisnis

```python
# Pearson vs Spearman Correlation & Simple Linear Regression
from scipy import stats
import statsmodels.api as sm

# Correlation
korelasi_pearson, p_value_p = stats.pearsonr(df['biaya_iklan'], df['revenue'])
korelasi_spearman, p_value_s = stats.spearmanr(df['biaya_iklan'], df['revenue'])

print(f'Pearson  : r={korelasi_pearson:.2f}, p-value={p_value_p:.4f}')
print(f'Spearman : r={korelasi_spearman:.2f}, p-value={p_value_s:.4f}')

# Simple Linear Regression (OLS)
X = sm.add_constant(df['biaya_iklan'])
y = df['revenue']
model = sm.OLS(y, X).fit()
print(model.summary())

koefisien = model.params['biaya_iklan']
r_squared = model.rsquared
print(f'\\nInterpretasi Bisnis:')
print(f'Setiap tambahan Rp1 juta biaya iklan diasosiasikan dengan kenaikan revenue sebesar Rp{koefisien:,.0f}')
print(f'Model ini menjelaskan {r_squared*100:.1f}% variasi revenue (R-squared)')
```

---

## LATIHAN SOAL & TANTANGAN
1. Sebuah perusahaan melaporkan 'rata-rata gaji karyawan Rp15 juta'. Pertanyaan apa yang harus diajukan sebelum mempercayai angka ini sepenuhnya, dan ukuran statistik apa yang sebaiknya diminta sebagai pembanding?
2. Jelaskan perbedaan Type I Error dan mengapa menjalankan banyak T-Test berpasangan lebih berisiko dibanding ANOVA!
3. Sebuah A/B test menghasilkan p-value = 0.03 dengan perbedaan conversion rate hanya 0.05%. Apakah layak dijadikan dasar keputusan bisnis?
4. Kapan sebaiknya menggunakan Spearman correlation dibanding Pearson?
5. Sebuah model regresi menghasilkan R-squared = 0.85. Apakah ini berarti model selalu akurat memprediksi setiap data baru?
6. Tulis kode Python untuk menguji apakah rata-rata waktu respons customer service berbeda signifikan antara sebelum dan sesudah pelatihan tim (data karyawan yang sama diukur 2 kali)!

---

## KUNCI JAWABAN / PETUNJUK
1. Tanyakan apakah distribusi gaji simetris atau miring (*skewed*). Minta **median** sebagai pembanding karena kebal terhadap outlier gaji eksekutif.
2. Type I Error adalah menolak H0 padahal benar (*false positive*). Menjalankan banyak T-Test meningkatkan risiko kumulatif (*family-wise error rate*). ANOVA menguji seluruh kelompok sekaligus dalam satu uji dengan $\\alpha$ terkendali.
3. Signifikan secara statistik belum tentu signifikan secara praktis/bisnis (*practical significance*). Kenaikan 0.05% mungkin tidak menutup biaya pengembangan sistem baru.
4. Gunakan Spearman ketika data tidak normal, terdapat outlier, atau hubungan bersifat monotonik non-linear / berskala ordinal.
5. Tidak. $R^2 = 0.85$ berarti model menjelaskan 85% variasi secara agregat, bukan jaminan akurasi untuk tiap titik prediksi individual.
6. Gunakan Paired T-Test: `stats.ttest_rel(waktu_respons_sebelum, waktu_respons_sesudah)`.
$NOTE_DA_BAB_9_STATISTIK_UNTUK_DATA_ANALYST$,
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

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'APPENDIX A–D: Cheat Sheet, Troubleshooting, Tips Optimasi & Karir',
    'da-appendix-cheat-sheet-troubleshooting-optimasi-karir',
    $NOTE_DA_APPENDIX_CHEAT_SHEET_TROUBLESHOOTING_OPTIMASI_KARIR$# APPENDIX A–D: CHEAT SHEET, TROUBLESHOOTING, TIPS OPTIMASI & PANDUAN KARIR

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 138–148 dari 148 | Pandas · NumPy · Matplotlib · Seaborn · Performance · Career

---

## APPENDIX A — CHEAT SHEET LENGKAP SEMUA LIBRARY

### A.1 Pandas Quick Reference
| Kode | Fungsi | Parameter Penting |
| :--- | :--- | :--- |
| `pd.read_csv('f.csv')` | Baca CSV | `usecols`, `dtype`, `nrows`, `parse_dates` |
| `df.info()` | Info tipe & non-null | `verbose=True` |
| `df.describe()` | Statistik deskriptif | `include='all'` |
| `df.isnull().sum()` | Hitung NaN | `/ len(df) * 100` untuk persen |
| `df.dropna()` | Hapus NaN | `subset=`, `thresh=`, `axis=` |
| `df.fillna(val)` | Isi NaN | `method='ffill'/'bfill'` |
| `df.drop_duplicates()` | Hapus duplikat | `subset=`, `keep='last'` |
| `df.astype(type)` | Konversi tipe | `int`, `float`, `str`, `'category'` |
| `df['col'].str.xxx` | Operasi string | `.lower`, `.strip`, `.contains` |
| `df['col'].dt.xxx` | Operasi datetime | `.year`, `.month`, `.day_name` |
| `df.loc[mask, cols]` | Seleksi label | Boolean mask, kondisi |
| `df.iloc[rows, cols]` | Seleksi posisi | Integer index |
| `df.query('expr')` | Filter ekspresi | `@var` untuk variabel |
| `df.groupby('k').agg()`| Agregasi per grup | Named aggregation |
| `pd.merge(a, b, on, how)`| SQL JOIN | `inner/left/right/outer` |
| `pd.concat([a, b])` | Gabung DataFrame | `axis=0/1`, `ignore_index` |
| `df.pivot_table()` | Tabel pivot | `values`, `index`, `columns`, `aggfunc` |
| `pd.melt(df, ...)` | Wide → Long | `id_vars`, `value_vars` |
| `df.sort_values('c')` | Urutkan | `ascending=False`, `na_position` |
| `df['c'].apply(f)` | Apply fungsi | lambda, nama fungsi |
| `df.resample('M')` | Time series resample | `'D'`, `'W'`, `'M'`, `'Q'`, `'Y'` |
| `df.to_csv('f.csv')` | Simpan CSV | `index=False`, `encoding` |

### A.2 NumPy Quick Reference
| Kode | Fungsi | Catatan |
| :--- | :--- | :--- |
| `np.array([...])` | Buat array | `dtype=float/int/str` |
| `np.zeros((r, c))` | Array nol | `dtype=int` |
| `np.ones((r, c))` | Array satu | |
| `np.eye(n)` | Identity matrix | |
| `np.arange(start, stop, step)` | Array berurutan | |
| `np.linspace(a, b, n)` | n titik merata | |
| `np.random.randn(r, c)` | Normal random | `seed=42` dulu |
| `arr.shape / ndim / size` | Dimensi / rank / total | |
| `arr.reshape(r, c)` | Ubah bentuk | `-1` = auto-hitung |
| `arr.T` | Transpose | `np.transpose(arr)` |
| `arr.flatten()` | 1D copy | `ravel()` = view |
| `arr[mask]` | Boolean indexing | `arr[arr > 5]` |
| `np.sum(a, axis=0)` | Sum per kolom | `axis=1` = per baris |
| `np.mean / std / var` | Statistik | `axis=` untuk arah |
| `np.sort(a, axis=1)` | Sort per baris | `argsort` = index hasil |
| `np.where(cond, x, y)` | Pilih berdasar kondisi | if-else vectorized |
| `A @ B` | Perkalian matriks | `np.dot(A, B)` |
| `np.linalg.inv(A)` | Inverse matrix | |
| `np.linalg.solve(A, b)` | Solusi $Ax=b$ | |
| `np.linalg.eig(A)` | Eigenvalue/vector | |

### A.3 Matplotlib Quick Reference
| Kode | Fungsi | Parameter Penting |
| :--- | :--- | :--- |
| `plt.plot(x, y)` | Line plot | `color`, `lw`, `ls`, `marker`, `label` |
| `plt.bar(x, y)` | Bar chart | `width`, `color`, `edgecolor` |
| `plt.barh(y, x)` | Horizontal bar | |
| `plt.scatter(x, y)` | Scatter plot | `s=size`, `c=color`, `cmap=` |
| `plt.hist(data)` | Histogram | `bins`, `density`, `cumulative` |
| `plt.boxplot(data)` | Box plot | `notch`, `patch_artist` |
| `plt.pie(sizes)` | Pie chart | `autopct`, `explode`, `labels` |
| `plt.imshow(mat)` | Heatmap/Image | `cmap`, `vmin`, `vmax` |
| `fig, ax = plt.subplots(r, c)` | Grid subplots | `figsize`, `sharex/y` |
| `gridspec.GridSpec(r, c)` | Custom layout | `hspace`, `wspace` |
| `ax.twinx()` | Dual axis | |
| `ax.annotate()` | Anotasi panah | `xy`, `xytext`, `arrowprops` |
| `ax.fill_between()` | Area shading | `where`, `alpha` |
| `ax.axhline/axvline()` | Garis referensi | `color`, `ls`, `lw` |
| `plt.colorbar()` | Color bar | `shrink`, `label` |
| `plt.legend()` | Legenda | `loc`, `fontsize`, `framealpha` |
| `ax.set_title()` | Judul | `fontsize`, `fontweight` |
| `plt.tight_layout()` | Rapikan layout | `rect=`, `pad=` |
| `plt.savefig('f.png')` | Simpan plot | `dpi=300`, `bbox_inches='tight'` |

### A.4 Seaborn Quick Reference
| Kode | Fungsi | Parameter Penting |
| :--- | :--- | :--- |
| `sns.histplot(data, x, hue)` | Histogram | `kde=True`, `bins=` |
| `sns.kdeplot(data, x)` | KDE plot | `fill=True`, `hue=` |
| `sns.ecdfplot(data, x)` | ECDF | `hue=`, `complementary=` |
| `sns.rugplot(data, x)` | Rug (tick marks) | `height=`, `color=` |
| `sns.barplot(data, x, y)` | Bar (mean+CI) | `hue=`, `errorbar=`, `capsize=` |
| `sns.countplot(data, x)` | Count per kategori | `hue=`, `order=` |
| `sns.boxplot(data, x, y)` | Box plot | `hue=`, `notch=`, `order=` |
| `sns.violinplot(data, x, y)`| Violin plot | `hue=`, `split=`, `inner=` |
| `sns.boxenplot(data, x, y)` | Boxen plot | `hue=`, `order=` |
| `sns.stripplot(data, x, y)` | Strip plot | `jitter=`, `dodge=`, `alpha=` |
| `sns.pointplot(data, x, y)` | Point plot | `hue=`, `markers=`, `errorbar=` |
| `sns.scatterplot(data, x, y)`| Scatter | `hue=`, `size=`, `style=`, `alpha=` |
| `sns.lineplot(data, x, y)` | Line | `hue=`, `estimator=`, `errorbar=` |
| `sns.regplot(data, x, y)` | Scatter + regression | `scatter_kws=`, `line_kws=` |
| `sns.heatmap(corr)` | Heatmap matrix | `annot=`, `fmt=`, `cmap=`, `mask=` |
| `sns.clustermap(data)` | Clustered heatmap | `cmap=`, `figsize=` |
| `sns.pairplot(df)` | Semua pasangan kolom | `hue=`, `diag_kind=`, `corner=` |
| `sns.FacetGrid(data, ...)` | Multi-panel grid | `col=`, `row=`, `hue=` |
| `sns.catplot(data, ...)` | Categorical figure-level| `kind=`, `col=`, `row=`, `hue=` |
| `sns.relplot(data, ...)` | Relational figure-level | `kind=`, `col=`, `row=`, `hue=` |
| `sns.set_theme()` | Global theme | `style=`, `palette=`, `font_scale=` |

---

## APPENDIX B — TROUBLESHOOTING & ERROR UMUM

```python
# Pandas Troubleshooting
# KeyError: 'nama_kolom' 
print(df.columns.tolist())
df.columns = df.columns.str.strip().str.lower()

# SettingWithCopyWarning 
# SALAH: df_sub = df[df['nilai'] > 80]; df_sub['grade'] = 'A'
# BENAR:
df_sub = df[df['nilai'] > 80].copy()
df_sub['grade'] = 'A'
# ATAU: df.loc[df['nilai'] > 80, 'grade'] = 'A'

# ValueError: Cannot merge a Series 
result = df.groupby('kota')['rev'].sum().reset_index()

# TypeError: cannot convert float NaN to int 
df['col'] = df['col'].astype('Int64') # kapital I, mendukung NaN

# ParserError: Error tokenizing data 
df = pd.read_csv('file.csv', on_bad_lines='skip')

# Matplotlib & Seaborn Troubleshooting 
# Plot tidak muncul:
%matplotlib inline
plt.show()

# Font kotak kosong:
import matplotlib
matplotlib.font_manager._rebuild()
```

---

## APPENDIX C — TIPS PERFORMA & OPTIMASI KODE

```python
# Pandas Performance Tips
# TIP 1: Vectorized vs Loop 
# CEPAT (hindari iterrows!):
df['margin'] = df['profit'] / df['revenue']

# TIP 2: ufunc vs apply 
# Cepat: langsung pakai NumPy ufunc
df['log_rev'] = np.log1p(df['revenue'])

# TIP 3: Gunakan .eval() untuk formula kompleks
df['result'] = df.eval('a + b * c')

# TIP 4: Simpan dengan format efisien 
df.to_parquet('data.parquet', compression='snappy')  # 5-10x lebih hemat dari CSV!
```

---

## APPENDIX D — REFERENSI & PANDUAN KARIR DATA ANALYTICS

### D.1 Dokumentasi Resmi
1. Pandas: [pandas.pydata.org/docs](https://pandas.pydata.org/docs)
2. NumPy: [numpy.org/doc](https://numpy.org/doc)
3. Matplotlib: [matplotlib.org/stable/contents](https://matplotlib.org/stable/contents)
4. Seaborn: [seaborn.pydata.org](https://seaborn.pydata.org)
5. Scikit-Learn: [scikit-learn.org/stable](https://scikit-learn.org/stable)

### D.5 Panduan Karir Data Analytics
| Posisi | Keterampilan Kunci | Pengalaman |
| :--- | :--- | :--- |
| **Junior Data Analyst** | Python dasar, SQL, Excel, visualisasi dasar | 0–2 tahun |
| **Data Analyst** | Pandas lanjutan, statistik inferensial, dashboard, storytelling | 2–5 tahun |
| **Senior Data Analyst** | ML dasar, A/B testing, pipeline otomasi, mentoring | 5+ tahun |
| **Data Scientist** | ML lanjutan, NLP/CV, experiment design, deployment | Variatif |
| **Analytics Engineer** | SQL lanjutan, dbt, data modeling, cloud warehouse | Variatif |

> [!NOTE]
> *"Data turns information into insight, and insight into action."*  
> — Modul Lengkap Data Analytics dengan Python
$NOTE_DA_APPENDIX_CHEAT_SHEET_TROUBLESHOOTING_OPTIMASI_KARIR$,
    'BookOpen',
    15,
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
  -- BAGIAN 2: SEED CROSS-CURRICULUM TOPICS (ML, TIME SERIES, NLP)
  -- ============================================================

  -- Topik Machine Learning: Bab 6.1 & 6.3
  IF v_cat_ml IS NOT NULL THEN
    INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
    VALUES (
      'Studi Kasus & Fondasi ML: Analisis Prediktif Churn Pelanggan Telco',
      'ml-studi-kasus-churn-telekomunikasi-dan-ml-fundamentals',
      $NOTE_ML_CHURN$# STUDI KASUS & FONDASI MACHINE LEARNING: ANALISIS PREDIKTIF CHURN PELANGGAN TELEKOMUNIKASI

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 82–90 & 94–95, 97–98 dari 148 | Scikit-Learn · Pandas · NumPy · Seaborn

---

## 6.1 Proyek: Analisis Prediktif Churn Pelanggan Telekomunikasi

 **Skenario Bisnis:** Perusahaan telekomunikasi mengalami churn (kehilangan pelanggan) sebesar 26%. CEO meminta tim Data Analytics untuk:
1. Memahami profil pelanggan yang churn.
2. Mengidentifikasi faktor utama penyebab churn.
3. Membuat model prediksi machine learning.
4. Memberikan rekomendasi strategi retensi terukur dan mengekstrak daftar pelanggan berisiko tinggi.

### STEP 1: Setup & Data Generation
```python
# STEP 1: Setup & Data Generation
# # PROYEK: TELCO CUSTOMER CHURN ANALYSIS
# Tools: Pandas, NumPy, Matplotlib, Seaborn, Scikit-Learn
# import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import seaborn as sns
from scipy import stats
import warnings

warnings.filterwarnings('ignore')

# Konfigurasi visualisasi
sns.set_theme(style='whitegrid', palette='deep')
plt.rcParams['figure.dpi'] = 100
np.random.seed(42)

# STEP 1: GENERATE DATA 
n = 7043
df = pd.DataFrame({
    'customer_id'       : [f'CUST-{i:05d}' for i in range(n)],
    'gender'            : np.random.choice(['Male', 'Female'], n),
    'senior_citizen'    : np.random.choice([0, 1], n, p=[0.84, 0.16]),
    'partner'           : np.random.choice(['Yes', 'No'], n, p=[0.48, 0.52]),
    'dependents'        : np.random.choice(['Yes', 'No'], n, p=[0.30, 0.70]),
    'tenure'            : np.random.randint(0, 72, n),
    'phone_service'     : np.random.choice(['Yes', 'No'], n, p=[0.90, 0.10]),
    'multiple_lines'    : np.random.choice(['Yes', 'No', 'No phone service'], n, p=[0.42, 0.48, 0.10]),
    'internet_service'  : np.random.choice(['DSL', 'Fiber optic', 'No'], n, p=[0.34, 0.44, 0.22]),
    'online_security'   : np.random.choice(['Yes', 'No', 'No internet service'], n, p=[0.29, 0.50, 0.21]),
    'tech_support'      : np.random.choice(['Yes', 'No', 'No internet service'], n, p=[0.29, 0.50, 0.21]),
    'streaming_tv'      : np.random.choice(['Yes', 'No', 'No internet service'], n, p=[0.38, 0.41, 0.21]),
    'contract'          : np.random.choice(['Month-to-month', 'One year', 'Two year'], n, p=[0.55, 0.21, 0.24]),
    'paperless_billing' : np.random.choice(['Yes', 'No'], n, p=[0.59, 0.41]),
    'payment_method'    : np.random.choice(['Electronic check', 'Mailed check', 'Bank transfer', 'Credit card'], n, p=[0.34, 0.23, 0.22, 0.21]),
    'monthly_charges'   : np.round(np.random.uniform(18, 118, n), 2),
    'total_charges'     : np.nan,  # akan dihitung
    'churn'             : np.random.choice(['Yes', 'No'], n, p=[0.265, 0.735]),
})

# Buat data lebih realistis
df['total_charges'] = (df['tenure'] * df['monthly_charges'] * np.random.uniform(0.9, 1.1, n)).round(2)

# Churn lebih tinggi untuk: tenure rendah, monthly_charges tinggi, Month-to-month
churn_prob = (0.1 + 0.3 * (df['tenure'] < 12) +
              0.2 * (df['monthly_charges'] > 80) +
              0.25 * (df['contract'] == 'Month-to-month'))
churn_prob = np.clip(churn_prob / churn_prob.max() * 0.55, 0.05, 0.75)
df['churn'] = np.where(np.random.rand(n) < churn_prob, 'Yes', 'No')

# Tambah sedikit missing values realistis
missing_idx = np.random.choice(df.index, 11, replace=False)
df.loc[missing_idx, 'total_charges'] = np.nan

print('Shape:', df.shape)
print('Churn Rate:\\n', df['churn'].value_counts(normalize=True).round(3))
```

### STEP 2: Data Cleaning & Feature Engineering
```python
# STEP 2: Data Cleaning & Feature Engineering
# STEP 2: DATA AUDIT & CLEANING 
print('=== DATA AUDIT ===')
print(f'Total rows     : {len(df):,}')
print(f'Total columns  : {df.shape[1]}')
print(f'Missing values:\\n{df.isnull().sum()[df.isnull().sum() > 0]}')
print(f'Duplicate rows : {df.duplicated().sum()}')

# Cleaning
df_clean = df.copy()
df_clean['total_charges'].fillna(df_clean['tenure'] * df_clean['monthly_charges'], inplace=True)
df_clean['churn_binary'] = (df_clean['churn'] == 'Yes').astype(int)

# Feature Engineering
df_clean['tenure_group'] = pd.cut(df_clean['tenure'],
                                  bins=[0, 12, 24, 48, 72],
                                  labels=['0-12 bln', '13-24 bln', '25-48 bln', '49-72 bln'],
                                  include_lowest=True)

df_clean['charge_tier'] = pd.qcut(df_clean['monthly_charges'], q=3, labels=['Low', 'Mid', 'High'])
df_clean['avg_monthly_spend'] = df_clean['total_charges'] / (df_clean['tenure'] + 1)
df_clean['has_multiple_services'] = (
    (df_clean['phone_service'] == 'Yes').astype(int) +
    (df_clean['internet_service'] != 'No').astype(int) +
    (df_clean['streaming_tv'] == 'Yes').astype(int)
)

print('\\nData setelah cleaning & feature engineering:')
print(df_clean[['tenure', 'monthly_charges', 'total_charges', 'tenure_group', 'charge_tier', 'churn']].head(8))
```

### STEP 3: EDA Dashboard (9 Panel Komprehensif)
```python
# STEP 3: EDA Dashboard
fig = plt.figure(figsize=(20, 14))
fig.suptitle('EXPLORATORY DATA ANALYSIS — TELCO CHURN', fontsize=17, fontweight='bold', y=0.99)
gs = gridspec.GridSpec(3, 4, figure=fig, hspace=0.45, wspace=0.38)

# Panel 1: Churn Distribution (Pie) 
ax1 = fig.add_subplot(gs[0, 0])
churn_cnt = df_clean['churn'].value_counts()
colors_pie = ['#E53935', '#43A047']
wedges, texts, autotexts = ax1.pie(
    churn_cnt.values, labels=churn_cnt.index,
    autopct='%1.1f%%', colors=colors_pie,
    wedgeprops=dict(width=0.55, edgecolor='white', linewidth=2),
    startangle=90)
ax1.text(0, 0, f'N={len(df_clean):,}', ha='center', va='center', fontsize=11, fontweight='bold')
ax1.set_title('Distribusi Churn')

# Panel 2: Tenure vs Churn 
ax2 = fig.add_subplot(gs[0, 1])
sns.histplot(data=df_clean, x='tenure', hue='churn',
             bins=24, ax=ax2, palette={'Yes': '#E53935', 'No': '#43A047'},
             alpha=0.7, kde=True)
ax2.set_title('Distribusi Tenure per Churn')
ax2.set_xlabel('Tenure (Bulan)')

# Panel 3: Monthly Charges Box 
ax3 = fig.add_subplot(gs[0, 2])
sns.boxplot(data=df_clean, x='churn', y='monthly_charges',
            palette={'Yes': '#E53935', 'No': '#43A047'},
            notch=True, ax=ax3)
t, p = stats.ttest_ind(
    df_clean[df_clean['churn'] == 'Yes']['monthly_charges'],
    df_clean[df_clean['churn'] == 'No']['monthly_charges'])
ax3.set_title(f'Monthly Charges vs Churn\\nt={t:.2f}, p={p:.4f}')

# Panel 4: Contract vs Churn Rate 
ax4 = fig.add_subplot(gs[0, 3])
contract_churn = df_clean.groupby('contract')['churn_binary'].agg(['mean', 'count']).reset_index()
contract_churn.columns = ['contract', 'churn_rate', 'count']
contract_churn = contract_churn.sort_values('churn_rate', ascending=False)
bars = ax4.bar(contract_churn['contract'], contract_churn['churn_rate'] * 100,
               color=['#E53935', '#FF7043', '#43A047'], edgecolor='white')
for bar in bars:
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
             f'{bar.get_height():.1f}%', ha='center', fontsize=9, fontweight='bold')
ax4.set_title('Churn Rate per Tipe Kontrak')
ax4.set_ylabel('Churn Rate (%)')
ax4.tick_params(axis='x', rotation=15)

# Panel 5: Heatmap Churn rate per Tenure × Contract
ax5 = fig.add_subplot(gs[1, :2])
pivot_heat = df_clean.pivot_table(values='churn_binary', index='tenure_group',
                                  columns='contract', aggfunc='mean') * 100
sns.heatmap(pivot_heat, annot=True, fmt='.1f', cmap='RdYlGn_r',
            ax=ax5, linewidths=0.5, vmin=0, vmax=100,
            cbar_kws={'label': 'Churn Rate (%)', 'shrink': 0.8})
ax5.set_title('Heatmap Churn Rate: Tenure × Kontrak')

# Panel 6: Internet Service vs Churn 
ax6 = fig.add_subplot(gs[1, 2])
inet_churn = df_clean.groupby('internet_service')['churn_binary'].mean() * 100
colors_bar = ['#2196F3', '#E53935', '#9E9E9E']
bars6 = ax6.bar(inet_churn.index, inet_churn.values, color=colors_bar, edgecolor='white')
for bar in bars6:
    ax6.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
             f'{bar.get_height():.1f}%', ha='center', fontsize=9, fontweight='bold')
ax6.set_title('Churn Rate per Layanan Internet')
ax6.set_ylabel('Churn Rate (%)')

# Panel 7: Senior vs Non-Senior 
ax7 = fig.add_subplot(gs[1, 3])
senior_churn = df_clean.groupby('senior_citizen')['churn_binary'].mean() * 100
ax7.bar(['Non-Senior', 'Senior'], senior_churn.values,
        color=['#4CAF50', '#F44336'], edgecolor='white', width=0.5)
for i, v in enumerate(senior_churn.values):
    ax7.text(i, v + 0.5, f'{v:.1f}%', ha='center', fontsize=10, fontweight='bold')
ax7.set_title('Churn Rate: Senior vs Non-Senior')
ax7.set_ylabel('Churn Rate (%)')

# Panel 8: Korelasi Numerik 
ax8 = fig.add_subplot(gs[2, :2])
num_corr = df_clean[['tenure', 'monthly_charges', 'total_charges',
                     'has_multiple_services', 'senior_citizen', 'churn_binary']].corr()
mask_upper = np.triu(np.ones_like(num_corr, dtype=bool), k=1)
sns.heatmap(num_corr, annot=True, fmt='.2f', cmap='coolwarm',
            center=0, ax=ax8, mask=mask_upper,
            linewidths=0.5, square=True, cbar_kws={'shrink': 0.7})
ax8.set_title('Matriks Korelasi (Lower Triangle)')

# Panel 9: Monthly Charges × Tenure scatter 
ax9 = fig.add_subplot(gs[2, 2:])
scatter_data = df_clean.sample(1000, random_state=42)
sc = ax9.scatter(scatter_data['tenure'], scatter_data['monthly_charges'],
                c=scatter_data['churn_binary'], cmap='RdYlGn_r',
                alpha=0.5, s=25, edgecolors='none')
plt.colorbar(sc, ax=ax9, label='Churn (1=Ya)')
ax9.set_xlabel('Tenure (Bulan)')
ax9.set_ylabel('Monthly Charges ($)')
ax9.set_title('Scatter: Tenure × Monthly Charges\\n(Warna = Churn)')

plt.savefig('eda_churn.png', dpi=150, bbox_inches='tight')
plt.show()
```

### STEP 4: Statistical Analysis
```python
# STEP 4: STATISTICAL ANALYSIS
print('=== ANALISIS STATISTIK ===')
# 1. Churn Rate per Segmen Utama
print('\\n1. Churn Rate per Faktor:')
for col in ['gender', 'senior_citizen', 'partner', 'contract', 'internet_service']:
    churn_by = df_clean.groupby(col)['churn_binary'].agg(['mean', 'count'])
    churn_by.columns = ['churn_rate', 'n']
    churn_by['churn_pct'] = (churn_by['churn_rate'] * 100).round(1)
    print(f'\\n  {col.upper()}:')
    print(churn_by[['n', 'churn_pct']].to_string())

# 2. T-test: Apakah monthly_charges signifikan berbeda?
print('\\n2. T-Test Monthly Charges (Churn vs Tidak):')
churned = df_clean[df_clean['churn'] == 'Yes']['monthly_charges']
not_churned = df_clean[df_clean['churn'] == 'No']['monthly_charges']
t, p = stats.ttest_ind(churned, not_churned)
print(f'  Churn mean     : ${churned.mean():.2f}')
print(f'  No-Churn mean  : ${not_churned.mean():.2f}')
print(f'  t-statistic    : {t:.4f}')
print(f'  p-value        : {p:.6f} → {"SIGNIFIKAN" if p < 0.05 else "tidak signifikan"}')

# 3. Chi-square test: Contract vs Churn
print('\\n3. Chi-Square Test: Contract vs Churn:')
ct = pd.crosstab(df_clean['contract'], df_clean['churn'])
chi2, p_chi, dof, expected = stats.chi2_contingency(ct)
print(f'  chi2 = {chi2:.2f}, p = {p_chi:.6f}, df = {dof}')
print(f'  Kesimpulan: Kontrak {"sangat" if p_chi < 0.001 else ""} berhubungan dengan churn!')

# 4. Cramér\'s V (effect size untuk chi-square)
n_val = ct.sum().sum()
min_dim = min(ct.shape) - 1
cramers_v = np.sqrt(chi2 / (n_val * min_dim))
print(f"  Cramér's V = {cramers_v:.3f} (effect size: {'weak' if cramers_v < 0.1 else 'moderate' if cramers_v < 0.3 else 'strong'})")

# 5. Pearson correlation: tenure vs churn
r, p = stats.pearsonr(df_clean['tenure'], df_clean['churn_binary'])
print(f'\\n4. Korelasi Pearson (tenure vs churn_binary): r={r:.3f}, p={p:.6f}')
```

### STEP 5: Predictive Model (Logistic Regression vs Random Forest)
```python
# STEP 5: SIMPLE PREDICTIVE MODEL (Logistic Regression)
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (classification_report, confusion_matrix,
                             roc_auc_score, roc_curve, ConfusionMatrixDisplay)

# Prepare Features 
features = ['tenure', 'monthly_charges', 'total_charges',
            'senior_citizen', 'has_multiple_services']

# Encode categorical features
df_model = df_clean.copy()
for col in ['gender', 'partner', 'dependents', 'phone_service',
            'internet_service', 'contract', 'paperless_billing', 'payment_method']:
    le = LabelEncoder()
    df_model[col + '_enc'] = le.fit_transform(df_model[col])
    features.append(col + '_enc')

X = df_model[features]
y = df_model['churn_binary']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train_sc = scaler.fit_transform(X_train)
X_test_sc = scaler.transform(X_test)

# Model 1: Logistic Regression 
lr = LogisticRegression(max_iter=500, class_weight='balanced', random_state=42)
lr.fit(X_train_sc, y_train)
y_pred_lr = lr.predict(X_test_sc)
y_prob_lr = lr.predict_proba(X_test_sc)[:, 1]
auc_lr = roc_auc_score(y_test, y_prob_lr)

# Model 2: Random Forest 
rf = RandomForestClassifier(n_estimators=100, class_weight='balanced',
                            random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)
y_pred_rf = rf.predict(X_test)
y_prob_rf = rf.predict_proba(X_test)[:, 1]
auc_rf = roc_auc_score(y_test, y_prob_rf)

print('=== MODEL PERFORMANCE ===')
print(f'Logistic Regression AUC : {auc_lr:.4f}')
print(f'Random Forest AUC       : {auc_rf:.4f}')
print('\\nClassification Report (Random Forest):')
print(classification_report(y_test, y_pred_rf, target_names=['No Churn', 'Churn']))

# Visualisasi Model 
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
fig.suptitle('Model Evaluation — Churn Prediction', fontsize=14, fontweight='bold')

# Confusion Matrix
ConfusionMatrixDisplay.from_predictions(
    y_test, y_pred_rf, display_labels=['No Churn', 'Churn'],
    cmap='Blues', ax=axes[0], colorbar=False)
axes[0].set_title('Confusion Matrix\\n(Random Forest)')

# ROC Curve
for model_name, y_prob, auc in [('Logistic Reg', y_prob_lr, auc_lr),
                                ('Random Forest', y_prob_rf, auc_rf)]:
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    axes[1].plot(fpr, tpr, lw=2, label=f'{model_name} (AUC={auc:.3f})')
axes[1].plot([0, 1], [0, 1], 'k--', lw=1, label='Random Classifier')
axes[1].set_xlabel('False Positive Rate')
axes[1].set_ylabel('True Positive Rate')
axes[1].set_title('ROC Curve')
axes[1].legend()

# Feature Importance
feat_imp = pd.Series(rf.feature_importances_, index=features)
feat_imp = feat_imp.sort_values(ascending=True).tail(12)
axes[2].barh(feat_imp.index, feat_imp.values, color='steelblue')
axes[2].set_title('Feature Importance\\n(Random Forest)')
axes[2].set_xlabel('Importance Score')
plt.tight_layout()
plt.show()
```

### STEP 6: Insight & Rekomendasi Bisnis
```python
# STEP 6: REKOMENDASI BISNIS
print('='*60)
print('          LAPORAN AKHIR & REKOMENDASI BISNIS')
print('='*60)
overall_churn = df_clean['churn_binary'].mean()
print(f'\\n RINGKASAN EKSEKUTIF:')
print(f'  Total Pelanggan        : {len(df_clean):,}')
print(f'  Churn Rate Overall     : {overall_churn*100:.1f}%')
print(f'  Estimated Revenue Lost : Rp {df_clean[df_clean["churn"]=="Yes"]["monthly_charges"].sum()*12:,.0f}/tahun')

print('\\n TEMUAN UTAMA:')
mtm_churn = df_clean[df_clean['contract'] == 'Month-to-month']['churn_binary'].mean() * 100
fiber_churn = df_clean[df_clean['internet_service'] == 'Fiber optic']['churn_binary'].mean() * 100
new_cust_churn = df_clean[df_clean['tenure'] <= 12]['churn_binary'].mean() * 100

print(f'  1. Pelanggan Month-to-month : churn {mtm_churn:.1f}% (vs avg {overall_churn*100:.1f}%)')
print(f'  2. Pelanggan Fiber Optic    : churn {fiber_churn:.1f}%')
print(f'  3. Pelanggan baru (<12 bln) : churn {new_cust_churn:.1f}% (kritis!)')
print(f'  4. Monthly charges tinggi   : korelasi positif dengan churn')
print(f'  5. Senior citizen           : churn rate lebih tinggi')

print('\\n REKOMENDASI STRATEGI RETENSI:')
print(f'  R1. Tawarkan insentif upgrade ke kontrak 1-2 tahun')
print(f'      → Target: {len(df_clean[df_clean["contract"]=="Month-to-month"]):,} pelanggan MTM')
print(f'  R2. Program onboarding 90 hari untuk pelanggan baru')
print(f'      → Target: {len(df_clean[df_clean["tenure"]<=3]):,} pelanggan tenure <3 bulan')
print(f'  R3. Audit kualitas layanan Fiber Optic & berikan SLA guarantee')
print(f'  R4. Loyalty program untuk senior citizen')
print(f'  R5. Proactive outreach untuk pelanggan dengan churn probability >70%')

# Identifikasi pelanggan at-risk menggunakan model
df_clean['churn_probability'] = rf.predict_proba(scaler.transform(X[features]))[:, 1]
at_risk = df_clean[
    (df_clean['churn_probability'] > 0.7) &
    (df_clean['churn'] == 'No')  # belum churn tapi berisiko tinggi
].copy()

print(f'\\n Pelanggan at-risk (prob>70%, belum churn): {len(at_risk):,}')
print('  → Prioritaskan program retensi untuk segmen ini!')

# Export daftar at-risk
at_risk_export = at_risk[['customer_id', 'contract', 'tenure',
                          'monthly_charges', 'churn_probability']].sort_values(
    'churn_probability', ascending=False).head(50)
print('\\nTop 10 At-Risk Pelanggan:')
print(at_risk_export.head(10).to_string(index=False))
print('='*60)
print('Model AUC:', f'{auc_rf:.4f}', '— Siap untuk deployment!')
print('='*60)
```

---

## 6.3 Machine Learning Fundamentals untuk Data Analyst

Seorang praktisi data perlu memahami fondasi konseptual Machine Learning secara menyeluruh:
1. **Classification**: Memprediksi label kategori (churn/tidak churn, fraud/bukan fraud). Algoritma umum: Logistic Regression, Decision Tree, Random Forest, XGBoost.
2. **Regression**: Memprediksi nilai numerik kontinu (harga rumah, revenue masa depan). Algoritma: Linear Regression, Random Forest Regressor, Gradient Boosting.
3. **Clustering**: Mengelompokkan data tanpa label (segmentasi pelanggan). Algoritma: K-Means, Hierarchical Clustering, DBSCAN.

### Alur Kerja ML: Train-Test Split, Cross-Validation, dan Overfitting
```python
# Train-Test Split dan Cross-Validation yang Benar
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier

X = df.drop(columns=['churn'])
y = df['churn']

# Split data: 80% untuk training, 20% untuk testing (tidak pernah dilihat model saat training)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# Evaluasi HANYA pada data test yang belum pernah dilihat model
akurasi_test = model.score(X_test, y_test)
print(f'Akurasi pada data test: {akurasi_test:.2%}')

# Cross-validation: melatih & menguji model 5 kali dengan pembagian data berbeda-beda
skor_cv = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f'Akurasi cross-validation: {skor_cv.mean():.2%} (+/- {skor_cv.std():.2%})')
```

* **Overfitting**: Model berkinerja sangat baik pada data training tetapi buruk pada data test (model "menghafal" data).
* **Underfitting**: Model berkinerja buruk baik pada data training maupun test (model terlalu sederhana).
* **`stratify=y`**: Memastikan proporsi kelas positif tetap seimbang antara data training dan test, sangat krusial pada kasus *imbalanced* seperti churn dan fraud detection.

### Metrik Evaluasi: Kapan Menggunakan Apa
1. **Accuracy**: Proporsi prediksi benar dari keseluruhan data. Hanya layak jika proporsi kelas seimbang.
2. **Precision**: Dari semua yang diprediksi positif, berapa persen yang benar-benar positif. Diprioritaskan jika biaya *False Positive* tinggi.
3. **Recall**: Dari semua yang sebenarnya positif, berapa persen yang berhasil terdeteksi model. Diprioritaskan jika biaya *False Negative* tinggi (misalnya pasien sakit atau nasabah churn yang lolos).
4. **F1-Score**: Rata-rata harmonik dari Precision dan Recall.
5. **MAE (Mean Absolute Error)**: Untuk regresi, rata-rata selisih absolut antara prediksi dan nilai aktual dalam satuan asli target.

---

## QUIZ TAMBAHAN — MACHINE LEARNING

1. Sebuah model fraud detection mendapat akurasi 98% pada dataset dengan hanya 2% kasus fraud. Mengapa angka ini bisa menyesatkan, dan metrik apa yang lebih tepat digunakan?
   * **Jawaban:** Karena model yang selalu memprediksi "bukan fraud" otomatis mendapat akurasi 98% tanpa benar-benar mendeteksi fraud apa pun (kelas tidak seimbang). Metrik yang lebih tepat adalah Precision, Recall, dan F1-Score yang secara spesifik mengukur kemampuan mendeteksi kelas minoritas (fraud).
2. Jelaskan perbedaan antara overfitting dan underfitting, beserta ciri masing-masing pada skor training vs test!
   * **Jawaban:** Overfitting: skor training tinggi namun skor test rendah (model menghafal, bukan belajar pola umum). Underfitting: skor training dan test sama-sama rendah (model terlalu sederhana untuk menangkap pola yang ada).
3. Apa itu ROC Curve dan AUC? Mengapa AUC lebih baik dari accuracy sebagai metrik evaluasi model churn?
   * **Jawaban:** ROC Curve memetakan True Positive Rate vs False Positive Rate pada semua kemungkinan ambang batas (*threshold*). AUC (Area Under Curve) mengukur kemampuan model membedakan kelas secara agregat tanpa bergantung pada satu nilai threshold acak 0.5, sehingga kebal terhadap distorsi ketidakseimbangan kelas (*class imbalance*).
$NOTE_ML_CHURN$,
      'Brain',
      25,
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

  -- Topik Time Series: Bab 6.2 & 6.4
  IF v_cat_ts IS NOT NULL THEN
    INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
    VALUES (
      'Proyek & Teori Time Series: Peramalan Penjualan, Dekomposisi & Uji Stasioneritas',
      'ts-studi-kasus-forecasting-penjualan-dan-time-series-lanjutan',
      $NOTE_TS_FORECAST$# PROYEK & TEORI TIME SERIES: PERAMALAN PENJUALAN, DEKOMPOSISI & UJI STASIONERITAS

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 90–93 & 95–98 dari 148 | Statsmodels · Scipy · Pandas · Matplotlib

---

## 6.2 Proyek: Time Series — Forecasting Penjualan

```python
# PROYEK 2: Time Series Analysis & Forecasting
# # PROYEK 2: TIME SERIES ANALYSIS & FORECASTING
# import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

np.random.seed(42)

# Generate Time Series Data 
# Data 3 tahun harian
dates = pd.date_range('2022-01-01', '2024-12-31', freq='D')
n = len(dates)  # 1096 hari

# Komponen time series
trend = np.linspace(100, 180, n)                         # trend naik
seasonal = 20 * np.sin(2*np.pi*np.arange(n)/365.25)       # seasonality tahunan
weekly = 8 * np.sin(2*np.pi*np.arange(n)/7)              # pola mingguan
noise = np.random.normal(0, 8, n)

# Event khusus: Lebaran & Desember = spike
lebaran_idx = [90, 455, 820]  # simulasi hari Lebaran
for idx in lebaran_idx:
    if idx < n:
        seasonal[idx:idx+7] += 50  # spike 7 hari

sales = trend + seasonal + weekly + noise
sales = np.maximum(sales, 10)     # tidak boleh negatif

ts = pd.DataFrame({'tanggal': dates, 'penjualan': sales.round(1)})
ts = ts.set_index('tanggal')

# Resample & Agregasi 
daily = ts['penjualan']
weekly_s = ts['penjualan'].resample('W').mean().rename('weekly_avg')
monthly = ts['penjualan'].resample('M').agg(
    total=('sum'), average=('mean'), std=('std')
).round(2)
monthly.columns = ['total', 'average', 'std']

# Analisis Tren & Komponen 
print('=== STATISTIK TIME SERIES ===')
print(f'Periode     : {ts.index[0].date()} s.d. {ts.index[-1].date()}')
print(f'Total Hari  : {len(ts):,}')
print(f'Mean Harian : {daily.mean():.1f}')
print(f'Std Harian  : {daily.std():.1f}')
print(f'Min / Max   : {daily.min():.1f} / {daily.max():.1f}')

# Linear trend
x_trend = np.arange(len(ts))
slope, intercept, r, p, se = stats.linregress(x_trend, daily.values)
print(f'\\nTrend: slope={slope:.3f} unit/hari, R²={r**2:.3f}')

# Moving Average & Forecasting Sederhana 
ma7 = daily.rolling(window=7, center=True).mean()
ma30 = daily.rolling(window=30, center=True).mean()
ma90 = daily.rolling(window=90, center=True).mean()
ema30 = daily.ewm(span=30, adjust=False).mean()

# Forecast 90 hari ke depan menggunakan trend + seasonal + weekly
last_date = ts.index[-1]
future_dates = pd.date_range(last_date + pd.Timedelta(days=1), periods=90, freq='D')
future_n = np.arange(n, n+90)
future_trend = slope * future_n + intercept
future_seasonal = 20 * np.sin(2*np.pi*future_n/365.25)
future_weekly = 8 * np.sin(2*np.pi*future_n/7)
forecast = future_trend + future_seasonal + future_weekly

# Confidence Interval ±1.96*std (95% CI)
ci = 1.96 * daily.std()
forecast_upper = forecast + ci
forecast_lower = forecast - ci

# Visualisasi Time Series 6-Panel 
fig, axes = plt.subplots(3, 2, figsize=(18, 14))
fig.suptitle('TIME SERIES ANALYSIS — PENJUALAN HARIAN 2022-2024',
             fontsize=15, fontweight='bold', y=0.99)

# Panel 1: Data mentah + MA
ax1 = axes[0, 0]
ax1.plot(daily.index, daily.values, color='lightgray', lw=0.8, alpha=0.9, label='Harian')
ax1.plot(ma7.index, ma7.values, 'b-', lw=1.2, label='MA-7')
ax1.plot(ma30.index, ma30.values, 'r-', lw=2, label='MA-30')
ax1.plot(ma90.index, ma90.values, 'g-', lw=2.5, label='MA-90', alpha=0.8)
ax1.set_title('Data Harian + Moving Average')
ax1.legend(loc='upper left', fontsize=9)
ax1.set_ylabel('Penjualan')

# Panel 2: Trend + Forecast
ax2 = axes[0, 1]
ax2.plot(daily.index[-365:], daily.values[-365:], color='lightgray', lw=0.8)
ax2.plot(ma30.index[-365:], ma30.values[-365:], 'b-', lw=2, label='MA-30 (Aktual)')
ax2.plot(future_dates, forecast, 'r--', lw=2.5, label='Forecast 90 hari')
ax2.fill_between(future_dates, forecast_lower, forecast_upper, alpha=0.2, color='red', label='95% CI')
ax2.axvline(last_date, color='black', ls='--', lw=1, alpha=0.5)
ax2.set_title('Forecast 90 Hari ke Depan')
ax2.legend(fontsize=9)

# Panel 3: Rata-rata per Hari Minggu
ax3 = axes[1, 0]
ts['day_of_week'] = ts.index.day_name()
day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
day_avg = ts.groupby('day_of_week')['penjualan'].mean().reindex(day_order)
bars = ax3.bar(day_avg.index, day_avg.values,
               color=['#FF9800' if d in ['Saturday', 'Sunday'] else '#2196F3' for d in day_order])
ax3.axhline(daily.mean(), color='red', ls='--', lw=1.5, label=f'Mean={daily.mean():.1f}')
ax3.set_title('Rata-rata per Hari Minggu')
ax3.tick_params(axis='x', rotation=30)
ax3.legend()

# Panel 4: Heatmap Penjualan Bulanan
ax4 = axes[1, 1]
ts['year'] = ts.index.year
ts['month'] = ts.index.month_name().str[:3]
month_order = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
pivot_heat = ts.pivot_table(values='penjualan', index='year', columns='month',
                            aggfunc='mean')[month_order]
sns.heatmap(pivot_heat, annot=True, fmt='.0f', cmap='YlOrRd',
            ax=ax4, linewidths=0.5, cbar_kws={'shrink': 0.8})
ax4.set_title('Heatmap Rata-rata Penjualan\\nper Bulan × Tahun')

# Panel 5: Revenue Bulanan (Bar)
ax5 = axes[2, 0]
monthly_total = ts.groupby([ts.index.year, ts.index.month])['penjualan'].sum()
monthly_total.index = [f'{y}/{m:02d}' for y, m in monthly_total.index]
colors_bar = ['#1565C0' if '2022' in i else '#2E7D32' if '2023' in i else '#C62828' for i in monthly_total.index]
ax5.bar(range(len(monthly_total)), monthly_total.values, color=colors_bar, alpha=0.85)
ax5.set_title('Total Penjualan Bulanan 2022-2024')
ax5.set_ylabel('Total Penjualan')
ax5.set_xticks(range(len(monthly_total)))
ax5.set_xticklabels(monthly_total.index, rotation=60, fontsize=7)
ax5.axvline(11.5, color='gray', ls='--', lw=1.5)
ax5.axvline(23.5, color='gray', ls='--', lw=1.5)

# Panel 6: Distribusi Residual
ax6 = axes[2, 1]
trend_line = slope * x_trend + intercept
residuals = daily.values - trend_line
ax6.hist(residuals, bins=50, color='mediumpurple', edgecolor='white',
         density=True, alpha=0.8, label='Residuals')
mu, sigma = stats.norm.fit(residuals)
x_pdf = np.linspace(residuals.min(), residuals.max(), 200)
ax6.plot(x_pdf, stats.norm.pdf(x_pdf, mu, sigma), 'r-', lw=2.5, label='Normal Fit')
_, p_norm = stats.normaltest(residuals)
ax6.set_title(f'Distribusi Residual\\n(normtest p={p_norm:.4f})')
ax6.legend()

plt.tight_layout(rect=[0, 0, 1, 0.97])
plt.savefig('timeseries_analysis.png', dpi=150, bbox_inches='tight')
plt.show()

print('\\n=== INSIGHT TIME SERIES ===')
print(f'Growth Rate 2022→2024 : {(daily[-365:].mean()/daily[:365].mean()-1)*100:.1f}%')
print(f'Bulan terbaik (avg)   : {pivot_heat.mean().idxmax()}')
print(f'Hari terbaik (avg)    : {day_avg.idxmax()}')
print(f'Forecast 30 hari (mean): {forecast[:30].mean():.1f}')
```

---

## 6.4 Time Series Lanjutan: Decomposition, Stationarity, dan Evaluasi Forecast

```python
# Seasonal Decomposition: Memisahkan Trend, Seasonality, dan Residual
from statsmodels.tsa.seasonal import seasonal_decompose

# Dekomposisi memisahkan data time series menjadi 3 komponen:
# Trend (arah jangka panjang), Seasonality (pola berulang), Residual (sisa/noise)
hasil_dekomposisi = seasonal_decompose(
    daily, model='additive', period=7  # period=7 untuk pola mingguan
)

fig, axes = plt.subplots(4, 1, figsize=(12, 8), sharex=True)
hasil_dekomposisi.observed.plot(ax=axes[0], title='Data Asli')
hasil_dekomposisi.trend.plot(ax=axes[1], title='Trend')
hasil_dekomposisi.seasonal.plot(ax=axes[2], title='Seasonality')
hasil_dekomposisi.resid.plot(ax=axes[3], title='Residual (Noise)')
plt.tight_layout()
plt.show()
```

### Uji Stasioneritas dengan Augmented Dickey-Fuller (ADF)
```python
# Uji Stasioneritas dengan Augmented Dickey-Fuller (ADF)
from statsmodels.tsa.stattools import adfuller

hasil_adf = adfuller(daily)
print(f'ADF Statistic: {hasil_adf[0]:.3f}')
print(f'p-value      : {hasil_adf[1]:.4f}')

if hasil_adf[1] < 0.05:
    print('Data stasioner (p-value < 0.05) -- siap dimodelkan langsung')
else:
    print('Data TIDAK stasioner -- perlu differencing terlebih dahulu')
    data_differenced = daily.diff().dropna()
    hasil_adf_2 = adfuller(data_differenced)
    print(f'Setelah differencing, p-value: {hasil_adf_2[1]:.4f}')
```

### Walk-Forward Validation: Evaluasi Forecast yang Jujur
> [!CAUTION]
> **Kesalahan Fatal:** Menggunakan `train_test_split(shuffle=True)` pada data time series akan menyebabkan *data leakage* (model melihat masa depan untuk memprediksi masa lalu). Gunakan **Walk-Forward Validation**.

```python
# Walk-Forward Validation untuk Time Series
from sklearn.metrics import mean_absolute_error

ukuran_awal_training = int(len(daily) * 0.8)
prediksi_semua, aktual_semua = [], []

# Setiap iterasi: latih dengan semua data historis, prediksi 1 langkah ke depan,
# lalu geser jendela training maju satu langkah (mensimulasikan penggunaan nyata di produksi)
for i in range(ukuran_awal_training, len(daily)):
    data_training = daily.iloc[:i]
    nilai_aktual = daily.iloc[i]
    
    # Model sederhana: rata-rata 7 hari terakhir sebagai baseline
    prediksi = data_training.tail(7).mean()
    prediksi_semua.append(prediksi)
    aktual_semua.append(nilai_aktual)

mae_walk_forward = mean_absolute_error(aktual_semua, prediksi_semua)
print(f'MAE Walk-Forward Validation: {mae_walk_forward:.2f}')
print('Metrik ini mencerminkan performa forecast senyatanya di produksi, '
      'karena tidak pernah menggunakan data masa depan saat training.')
```

---

## QUIZ TAMBAHAN — TIME SERIES LANJUTAN

1. Mengapa `train_test_split(shuffle=True)` tidak boleh digunakan untuk data time series?
   * **Jawaban:** Karena akan mengacak urutan waktu sehingga model bisa "melihat" data dari masa depan saat training untuk memprediksi data di masa lalu (data leakage), menghasilkan evaluasi yang sangat bias dan tidak realistis dibanding penggunaan nyata di produksi.
2. Apa fungsi uji Augmented Dickey-Fuller (ADF) dalam analisis time series, dan apa yang dilakukan jika data terbukti tidak stasioner?
   * **Jawaban:** ADF menguji apakah data time series bersifat stasioner (rata-rata dan varians konstan terhadap waktu) secara statistik. Jika tidak stasioner ($p\\text{-value} \\ge 0.05$), teknik differencing (menghitung selisih antar periode berurutan) umumnya diterapkan untuk menghilangkan komponen trend.
3. Jelaskan 3 komponen dalam dekomposisi time series klasik!
   * **Jawaban:** Trend (pergerakan arah data jangka panjang yang naik atau turun), Seasonality (fluktuasi periodik yang berulang dalam interval waktu tertentu seperti mingguan atau tahunan), dan Residual (komponen acak/noise yang tersisa setelah tren dan musiman dikeluarkan).
$NOTE_TS_FORECAST$,
      'TrendingUp',
      15,
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

  -- Topik NLP: Bab 7
  IF v_cat_nlp IS NOT NULL THEN
    INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
    VALUES (
      'Studi Kasus Nyata NLP: Analisis Sentimen & Emosi 453.390 Tweet Indonesia',
      'nlp-studi-kasus-analisis-sentimen-tweet-indonesia-450k',
      $NOTE_NLP_SENTIMENT$# STUDI KASUS NYATA NLP: ANALISIS SENTIMEN & DETEKSI EMOSI 453.390 TWEET INDONESIA & MELAYU

Modul Komprehensif Data Analytics dengan Python — Termasuk NLP & Sentiment Analysis  
Halaman 99–121 dari 148 | N-gram · Lexicon · TF-IDF · Word2Vec · FastText · LDA Topic Modeling

---

## 7.1 Gambaran Dataset & Business Context

 **Dataset:** `Indonesian_Sentiment_Tweet_Dataset_Unlabeled.csv` (453.390 tweet berbahasa Indonesia & Melayu — **Unlabeled**).

| Karakteristik | Nilai / Keterangan |
| :--- | :--- |
| **Jumlah Tweet** | 453.390 baris |
| **Kolom** | 1 kolom (`tweet` — teks mentah) |
| **Bahasa** | Bahasa Indonesia & Melayu (Malaysia/Brunei) |
| **Label** | Tidak ada (Unlabeled) — dibuat menggunakan sistem NLP |
| **Duplikat** | 8.530 baris (1.9%) |
| **Panjang rata-rata** | 74.7 karakter per tweet |
| **Jumlah kata rata-rata**| 12.7 kata per tweet |

### Aplikasi Bisnis Analisis Sentimen:
1. **Brand Monitoring**: Memantau persepsi publik terhadap merek/produk secara realtime.
2. **Customer Feedback**: Memahami keluhan dan apresiasi pelanggan dalam skala jutaan percakapan.
3. **Competitor Analysis**: Membandingkan sentimen pasar terhadap kompetitor.
4. **Crisis Detection**: Mendeteksi krisis reputasi sedini mungkin sebelum viral.
5. **Product Development**: Menemukan *pain points* dan kebutuhan fitur dari percakapan organik.

---

## 7.2 Import Library & Konfigurasi

```python
# STEP 0: Setup & Import
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import matplotlib.patches as mpatches
import seaborn as sns
import re
import string
import warnings
from collections import Counter
from itertools import islice

warnings.filterwarnings('ignore')
np.random.seed(42)

# Konfigurasi visualisasi
sns.set_theme(style='whitegrid', palette='deep')
plt.rcParams.update({
    'figure.dpi'       : 120,
    'axes.titlesize'   : 13,
    'axes.titleweight' : 'bold',
    'axes.labelsize'   : 11,
    'axes.spines.top'  : False,
    'axes.spines.right': False,
    'figure.facecolor' : 'white',
})

print(' Library berhasil diimport!')
```

---

## 7.3 Load & Inspeksi Data Awal

```python
# STEP 1: Load & Inspeksi Awal
df = pd.read_csv('Indonesian_Sentiment_Tweet_Dataset_Unlabeled.csv',
                 header=None,
                 names=['tweet'],
                 encoding='utf-8')

print('='*55)
print('          INSPEKSI AWAL DATASET')
print('='*55)
print(f'Total tweet : {len(df):,}')
print(f'Kolom       : {df.columns.tolist()}')
print(f'Tipe data   : {df.dtypes["tweet"]}')
print(f'Null values : {df["tweet"].isnull().sum()}')

print('\\n--- 5 TWEET PERTAMA ---')
for i, tweet in enumerate(df['tweet'].head(5), 1):
    print(f'{i}. {tweet[:90]}...' if len(str(tweet)) > 90 else f'{i}. {tweet}')

# Statistik Panjang Tweet 
df['tweet'] = df['tweet'].astype(str)
df['panjang_char'] = df['tweet'].str.len()
df['jumlah_kata'] = df['tweet'].str.split().str.len()

print('\\n--- STATISTIK PANJANG ---')
stats_df = pd.DataFrame({
    'Karakter': df['panjang_char'].describe(),
    'Kata'    : df['jumlah_kata'].describe()
}).round(1)
print(stats_df)
```

---

## 7.4 Data Cleaning & Preprocessing (Termasuk Slang Normalization)

```python
# STEP 2: Preprocessing & Cleaning
# Definisi Fungsi Preprocessing 
def clean_tweet(text):
    \"\"\"Membersihkan satu tweet dari noise.\"\"\"
    text = str(text).lower()
    text = re.sub(r'http\S+|www\.\S+', '', text)   # hapus URL
    text = re.sub(r'@\w+', '', text)               # hapus mention
    text = re.sub(r'#\w+', '', text)               # hapus hashtag
    text = re.sub(r'\d+', '', text)                # hapus angka
    text = re.sub(r'[^\w\s]', ' ', text)           # hapus tanda baca
    text = re.sub(r'(.)\1{3,}', r'\1\1', text)     # 'huhuhuhu' → 'huhu'
    text = re.sub(r'\s+', ' ', text).strip()       # normalisasi spasi
    return text

def normalize_slang(text):
    \"\"\"Normalisasi kata gaul/tidak baku ke kata baku Indonesia & Melayu.\"\"\"
    slang_dict = {
        # Bahasa Indonesia
        r'\bgak\b'    : 'tidak', r'\bga\b'     : 'tidak', r'\bnggak\b'  : 'tidak',
        r'\bngga\b'   : 'tidak', r'\benggak\b' : 'tidak', r'\budah\b'   : 'sudah',
        r'\budeh\b'   : 'sudah', r'\bbanget\b' : 'sekali', r'\bbngt\b'  : 'sekali',
        r'\bkyk\b'    : 'seperti', r'\bkayak\b' : 'seperti', r'\bkmrn\b'  : 'kemarin',
        r'\bskrg\b'   : 'sekarang', r'\bskrang\b': 'sekarang', r'\byg\b'   : 'yang',
        r'\bdgn\b'    : 'dengan', r'\bbgt\b'   : 'sekali', r'\bgt\b'    : 'itu',
        r'\bsih\b'    : '', r'\bdeh\b'    : '', r'\bnih\b'   : 'ini',
        r'\bsama aja\b': 'sama saja', r'\bgimana\b': 'bagaimana', r'\bkenapa\b': 'mengapa',
        r'\bkapan\b'  : 'kapan', r'\bjgn\b'    : 'jangan', r'\bbtw\b'   : 'ngomong-ngomong',
        r'\bwkwk\b'   : '', r'\bhehe\b'   : '', r'\bhaha\b'  : '', r'\bhihi\b'  : '',
        # Bahasa Melayu
        r'\btak\b'    : 'tidak', r'\btakde\b'  : 'tidak ada', r'\bje\b'    : 'saja',
        r'\bla\b'     : '', r'\bpun\b'    : 'juga', r'\bdah\b'   : 'sudah',
        r'\bnak\b'    : 'mau', r'\bboleh\b'  : 'bisa', r'\bmacam\b' : 'seperti',
    }
    for pattern, replacement in slang_dict.items():
        text = re.sub(pattern, replacement, text)
    return re.sub(r'\s+', ' ', text).strip()

# Terapkan Preprocessing 
print('Membersihkan 453.390 tweet...')
df['tweet_clean'] = df['tweet'].apply(clean_tweet)
df['tweet_norm'] = df['tweet_clean'].apply(normalize_slang)

# Hapus tweet terlalu pendek & duplikat 
n_before = len(df)
df = df[df['tweet_clean'].str.len() >= 5]       # min 5 karakter
df = df.drop_duplicates(subset='tweet_clean')    # hapus duplikat
n_after = len(df)
df = df.reset_index(drop=True)

print(f'Sebelum cleaning : {n_before:,}')
print(f'Setelah cleaning : {n_after:,}')
print(f'Dihapus          : {n_before - n_after:,} baris')
```

---

## 7.5 Lexicon-Based Sentiment Analysis

```python
# STEP 3: Lexicon-Based Sentiment Labeling
KATA_POSITIF = {
    # Perasaan positif
    'senang','bahagia','gembira','suka','cinta','sayang','bangga',
    'semangat','bersyukur','syukur','alhamdulillah','beruntung',
    'sukacita','rindu','kangen','kagum','indah','cantik','tampan',
    # Evaluasi positif
    'bagus','baik','hebat','keren','mantap','luar biasa','terbaik',
    'sukses','berhasil','menang','pintar','pandai','bijak','mulia',
    'benar','tepat','setia','tulus','jujur','rajin','sabar','rendah hati',
    # Ekspresi positif
    'terima kasih','makasih','selamat','good','nice','cool','amazing',
    'wonderful','love','happy','great','best','perfect','awesome',
    # Harapan & doa
    'harapan','impian','doa','semoga','insha allah','bismillah',
    'percaya','yakin','kuat','berani','optimis','bisa','mampu',
    # Tawa & kesenangan
    'haha','hihi','lucu','menggemaskan','imut','manis',
}

KATA_NEGATIF = {
    # Perasaan negatif
    'sedih','marah','kesal','benci','frustrasi','kecewa','menyesal',
    'galau','resah','khawatir','cemas','takut','gelisah','stress',
    'lelah','capek','penat','bosan','jenuh','muak','jijik',
    'sakit','nyeri','perih','derita','sengsara','menderita','susah',
    # Evaluasi negatif
    'buruk','jelek','jahat','bodoh','tolol','payah','lemah',
    'salah','keliru','gagal','kalah','hancur','rusak','terbuang',
    'bohong','menipu','palsu','munafik','pengecut','egois',
    # Ekspresi negatif
    'bad','awful','terrible','hate','disgusting','horrible',
    'nangis','menangis','mengeluh','putus asa','menyedihkan',
    # Kata negatif kontekstual
    'mati','bunuh','siksaan','penderitaan','nestapa','duka',
    'tragis','malang','sial','apes','celaka','naas',
}

KATA_NEGASI = {'tidak','tak','bukan','jangan','belum','tanpa',
               'ga','gak','nggak','ngga','enggak','tiada','non'}

def hitung_skor_sentimen(text):
    \"\"\"
    Menghitung skor sentimen berbasis lexicon dengan negasi kontekstual.
    'tidak baik' = negatif; 'tidak buruk' = sedikit positif (+0.5).
    \"\"\"
    words = text.lower().split()
    skor_pos = 0
    skor_neg = 0
    negasi_aktif = False
    
    for i, word in enumerate(words):
        if word in KATA_NEGASI:
            negasi_aktif = True
            continue
        if negasi_aktif and i > 0 and words[i-1] not in KATA_NEGASI:
            negasi_aktif = False
        if word in KATA_POSITIF:
            if negasi_aktif:
                skor_neg += 1
                negasi_aktif = False
            else:
                skor_pos += 1
        elif word in KATA_NEGATIF:
            if negasi_aktif:
                skor_pos += 0.5
                negasi_aktif = False
            else:
                skor_neg += 1
                
    skor_bersih = skor_pos - skor_neg
    return skor_bersih, skor_pos, skor_neg

def label_sentimen(skor_bersih, skor_pos, skor_neg):
    if skor_bersih > 0: return 'Positif'
    elif skor_bersih < 0: return 'Negatif'
    elif skor_pos > 0 and skor_neg > 0: return 'Campuran'
    else: return 'Netral'

# Terapkan
hasil = df['tweet_norm'].apply(hitung_skor_sentimen)
df['skor_bersih'] = hasil.apply(lambda x: x[0])
df['skor_pos'] = hasil.apply(lambda x: x[1])
df['skor_neg'] = hasil.apply(lambda x: x[2])
df['sentimen'] = df.apply(lambda r: label_sentimen(r['skor_bersih'], r['skor_pos'], r['skor_neg']), axis=1)

dist = df['sentimen'].value_counts()
print('\\n=== DISTRIBUSI SENTIMEN HASIL LABELING ===')
for sent, cnt in dist.items():
    bar = '' * int(cnt/dist.max()*30)
    print(f'  {sent:10}: {cnt:6,} ({cnt/len(df)*100:5.1f}%) {bar}')
```

---

## 7.6 Analisis Emosi 8 Kategori (Plutchik's Wheel)

```python
# STEP 4: Emotion Detection
EMOSI_DICT = {
    'Kebahagiaan': ['bahagia','senang','gembira','happy','syukur','sukacita',
                    'alhamdulillah','beruntung','suka','gembira','riang'],
    'Kesedihan'  : ['sedih','nangis','menangis','duka','nestapa','galau',
                    'pilu','sendu','merana','hampa','sepi','kesepian'],
    'Kemarahan'  : ['marah','kesal','benci','frustrasi','jengkel','dongkol',
                    'murka','geram','berang','emosi','naik pitam'],
    'Ketakutan'  : ['takut','cemas','khawatir','resah','gelisah','was-was',
                    'ngeri','paranoid','panik','gemetar'],
    'Cinta'      : ['cinta','sayang','rindu','kangen','asmara','kasih',
                    'romantis','mesra','tresna','love','beloved'],
    'Semangat'   : ['semangat','bangga','berhasil','sukses','menang','hebat',
                    'juara','berprestasi','optimis','percaya diri','berani'],
    'Harapan'    : ['harapan','impian','doa','mimpi','berharap','ingin',
                    'semoga','kelak','nanti','masa depan','cita-cita'],
    'Kelelahan'  : ['capek','lelah','penat','exhausted','muak','bosan',
                    'jenuh','payah','loyo','lunglai','drain'],
}

def deteksi_emosi(text):
    text_lower = text.lower()
    skor_emosi = {}
    for emosi, keywords in EMOSI_DICT.items():
        skor = sum(1 for kw in keywords if re.search(r'\\b'+re.escape(kw)+r'\\b', text_lower))
        if skor > 0:
            skor_emosi[emosi] = skor
    if not skor_emosi:
        return 'Tidak Terdeteksi'
    return max(skor_emosi, key=skor_emosi.get)

df['emosi'] = df['tweet_norm'].apply(deteksi_emosi)
print('\\n=== DISTRIBUSI EMOSI ===')
for emosi, cnt in df['emosi'].value_counts().items():
    print(f'  {emosi:22}: {cnt:6,} ({cnt/len(df)*100:4.1f}%)')
```

---

## 7.7 Analisis Frekuensi Kata, Stopwords & N-gram

```python
# STEP 5: Word & N-gram Frequency Analysis
STOPWORDS = {
    'yang','dengan','aku','kamu','dia','ini','itu','ada','tapi','tak',
    'tidak','untuk','dari','kita','dan','juga','jadi','saya','aja',
    'bisa','mau','sama','lagi','kalau','sudah','buat','orang','udah',
    'nggak','gak','ya','yg','lah','deh','sih','nih','pun','banget',
    'kan','kok','dong','lho','nah','wah','ah','oh','iya','iyah',
    'saja','lebih','sangat','sekali','paling','agak','cukup',
    'ke','di','dari','pada','oleh','karena','sebab','agar','supaya',
    'akan','telah','sudah','sedang','masih','belum','pernah',
    # Melayu
    'boleh','nak','dah','je','pun','kot','lagi','tapi','masa',
    'bila','mana','macam','satu','sini','sana','situ','baru',
}

def get_clean_words(text):
    words = re.findall(r'\\b[a-zA-Z]{3,}\\b', text.lower())
    return [w for w in words if w not in STOPWORDS]

def get_bigrams(words):
    return [f'{words[i]} {words[i+1]}' for i in range(len(words)-1)]

def get_trigrams(words):
    return [f'{words[i]} {words[i+1]} {words[i+2]}' for i in range(len(words)-2)]

word_freq, bigram_freq, trigram_freq = {}, {}, {}
for sent in ['Positif', 'Negatif', 'Netral', 'Campuran']:
    subset = df[df['sentimen'] == sent]['tweet_norm']
    all_words, all_bigrams, all_trigrams = [], [], []
    for tweet in subset:
        w = get_clean_words(tweet)
        all_words.extend(w)
        all_bigrams.extend(get_bigrams(w))
        all_trigrams.extend(get_trigrams(w))
    word_freq[sent] = Counter(all_words).most_common(20)
    bigram_freq[sent] = Counter(all_bigrams).most_common(15)
    trigram_freq[sent] = Counter(all_trigrams).most_common(10)
```

---

## 7.8 Dashboard Visualisasi Komprehensif (9 Panel)

```python
# STEP 6: Dashboard Visualisasi Utama (9 Panel)
fig = plt.figure(figsize=(20, 15))
fig.suptitle('DASHBOARD ANALISIS SENTIMEN TWEET INDONESIA\\n453.390 Tweets',
             fontsize=18, fontweight='bold', y=0.99)
gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.45, wspace=0.38)

# Panel 1: Donut Chart Sentimen
ax1 = fig.add_subplot(gs[0, 0])
sent_dist = df['sentimen'].value_counts()
colors_sent = {'Positif': '#4CAF50', 'Negatif': '#F44336', 'Netral': '#9E9E9E', 'Campuran': '#FF9800'}
ax1.pie(sent_dist.values, labels=sent_dist.index, autopct='%1.1f%%',
        colors=[colors_sent.get(s, '#BBBBBB') for s in sent_dist.index],
        wedgeprops=dict(width=0.55, edgecolor='white', linewidth=2),
        startangle=90, pctdistance=0.75)
ax1.text(0, 0, f'{len(df):,}\\ntweet', ha='center', va='center', fontsize=10, fontweight='bold')
ax1.set_title('Distribusi Sentimen')

# Panel 2: Bar Chart Emosi
ax2 = fig.add_subplot(gs[0, 1])
emosi_data = df['emosi'].value_counts()
emosi_filter = emosi_data[emosi_data.index != 'Tidak Terdeteksi']
colors_emosi = ['#E91E63','#2196F3','#FF5722','#9C27B0','#4CAF50','#FF9800','#00BCD4','#795548']
bars = ax2.barh(emosi_filter.index[:8], emosi_filter.values[:8],
                color=colors_emosi[:len(emosi_filter[:8])], edgecolor='white')
for bar in bars:
    w = bar.get_width()
    ax2.text(w + 200, bar.get_y() + bar.get_height()/2, f'{w:,}', va='center', fontsize=9)
ax2.set_title('Distribusi Emosi Terdeteksi')
ax2.set_xlabel('Jumlah Tweet')

# Panel 3: Distribusi Panjang per Sentimen
ax3 = fig.add_subplot(gs[0, 2])
for sent, color in [('Positif', '#4CAF50'), ('Negatif', '#F44336'), ('Netral', '#9E9E9E')]:
    subset_len = df[df['sentimen'] == sent]['panjang_char']
    ax3.hist(subset_len, bins=30, alpha=0.6, color=color,
             label=f'{sent} (n={len(subset_len):,})', density=True, edgecolor='white')
ax3.set_title('Distribusi Panjang Tweet\\nper Sentimen')
ax3.set_xlabel('Panjang (karakter)')
ax3.legend(fontsize=8)

# Panel 4: Top 15 Kata Positif
ax4 = fig.add_subplot(gs[1, 0])
top_pos = word_freq['Positif'][:15]
words_p, counts_p = zip(*top_pos)
ax4.barh(list(words_p)[::-1], list(counts_p)[::-1], color='#66BB6A', edgecolor='white')
ax4.set_title('Top 15 Kata — Sentimen POSITIF')

# Panel 5: Top 15 Kata Negatif
ax5 = fig.add_subplot(gs[1, 1])
top_neg = word_freq['Negatif'][:15]
words_n, counts_n = zip(*top_neg)
ax5.barh(list(words_n)[::-1], list(counts_n)[::-1], color='#EF5350', edgecolor='white')
ax5.set_title('Top 15 Kata — Sentimen NEGATIF')

# Panel 6: Heatmap Emosi × Sentimen
ax6 = fig.add_subplot(gs[1, 2])
emosi_sent_ct = pd.crosstab(df['emosi'], df['sentimen'])
emosi_sent_ct = emosi_sent_ct[emosi_sent_ct.index != 'Tidak Terdeteksi']
emosi_sent_pct = emosi_sent_ct.div(emosi_sent_ct.sum(axis=1), axis=0) * 100
sns.heatmap(emosi_sent_pct.round(1), annot=True, fmt='.0f', cmap='RdYlGn', ax=ax6,
            linewidths=0.4, cbar_kws={'label': '% per Emosi', 'shrink': 0.8})
ax6.set_title('Heatmap: Emosi × Sentimen (%)')

# Panel 7: Top 12 Bigram Positif
ax7 = fig.add_subplot(gs[2, 0])
top_bg_pos = bigram_freq['Positif'][:12]
bg_words, bg_counts = zip(*top_bg_pos)
ax7.barh(list(bg_words)[::-1], list(bg_counts)[::-1], color='#A5D6A7', edgecolor='white')
ax7.set_title('Top 12 Bigram — POSITIF')

# Panel 8: Top 12 Bigram Negatif
ax8 = fig.add_subplot(gs[2, 1])
top_bg_neg = bigram_freq['Negatif'][:12]
bg_words_n, bg_counts_n = zip(*top_bg_neg)
ax8.barh(list(bg_words_n)[::-1], list(bg_counts_n)[::-1], color='#FFCDD2', edgecolor='white')
ax8.set_title('Top 12 Bigram — NEGATIF')

# Panel 9: Statistik Ringkasan
ax9 = fig.add_subplot(gs[2, 2])
ax9.axis('off')
stats_text = [
    ('Total Tweet Dianalisis', f'{len(df):,}'),
    ('Tweet Positif', f"{sent_dist.get('Positif', 0):,}"),
    ('Tweet Negatif', f"{sent_dist.get('Negatif', 0):,}"),
    ('Tweet Netral', f"{sent_dist.get('Netral', 0):,}"),
    ('Rata-rata Panjang', f"{df['panjang_char'].mean():.1f} karakter"),
    ('Rata-rata Kata', f"{df['jumlah_kata'].mean():.1f} kata"),
    ('Emosi Paling Umum', df['emosi'].value_counts().index[0]),
    ('Kata Positif #1', word_freq['Positif'][0][0]),
    ('Kata Negatif #1', word_freq['Negatif'][0][0]),
]
y_pos = 0.95
ax9.text(0.5, 1.0, ' RINGKASAN STATISTIK', ha='center', va='top',
         fontsize=12, fontweight='bold', transform=ax9.transAxes, color='#1F4E79')
for label, value in stats_text:
    ax9.text(0.05, y_pos, f' {label}', ha='left', va='top', fontsize=9, color='#444444', transform=ax9.transAxes)
    ax9.text(0.95, y_pos, value, ha='right', va='top', fontsize=9, fontweight='bold', color='#1F4E79', transform=ax9.transAxes)
    y_pos -= 0.09

plt.savefig('sentiment_dashboard.png', dpi=150, bbox_inches='tight')
plt.show()
```

---

## 7.10 Analisis Statistik Lanjutan

```python
# STEP 8: Statistical Testing
from scipy import stats as scipy_stats

# 1. Uji Kruskal-Wallis (perbedaan panjang tweet antar sentimen)
positif_len = df[df['sentimen'] == 'Positif']['panjang_char']
negatif_len = df[df['sentimen'] == 'Negatif']['panjang_char']
netral_len  = df[df['sentimen'] == 'Netral']['panjang_char']

stat, p = scipy_stats.kruskal(positif_len, negatif_len, netral_len)
print('=== UJI KRUSKAL-WALLIS (Panjang tweet per Sentimen) ===')
print(f'  H-statistic : {stat:.4f}')
print(f'  p-value     : {p:.6e}')
print(f'  Kesimpulan  : {"Panjang tweet BERBEDA signifikan" if p < 0.05 else "Tidak berbeda"}')

# 2. Mann-Whitney U: Positif vs Negatif
u, p_mw = scipy_stats.mannwhitneyu(positif_len, negatif_len, alternative='two-sided')
print(f'\\nMann-Whitney (Positif vs Negatif): U={u:.0f}, p={p_mw:.6e}')
print(f'  → Tweet Negatif rata-rata lebih panjang: {negatif_len.mean():.1f} vs {positif_len.mean():.1f} karakter')
```

---

## 7.14 Bag of Words dan TF-IDF: Mengubah Teks Menjadi Angka

```python
# Bag of Words & TF-IDF
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

# Bag of Words
tweets_contoh = [
    'pelayanan sangat baik dan memuaskan',
    'pelayanan buruk sekali mengecewakan',
    'produk baik tapi pengiriman lambat',
]
vectorizer = CountVectorizer()
bow_matrix = vectorizer.fit_transform(tweets_contoh)
df_bow = pd.DataFrame(bow_matrix.toarray(), columns=vectorizer.get_feature_names_out())
print('Bag of Words Matrix:\\n', df_bow)

# TF-IDF dan Kata Paling Representatif per Sentimen
tfidf_vectorizer = TfidfVectorizer(max_features=1000, min_df=2)
tfidf_matrix = tfidf_vectorizer.fit_transform(df['tweet_clean'])

tweet_negatif = df[df['sentimen'] == 'Negatif']['tweet_clean']
tfidf_negatif = tfidf_vectorizer.transform(tweet_negatif)
skor_rata_rata = tfidf_negatif.mean(axis=0).A1
kata_teratas = pd.Series(
    skor_rata_rata, index=tfidf_vectorizer.get_feature_names_out()
).sort_values(ascending=False).head(10)

print('\\nKata paling representatif untuk sentimen Negatif:')
print(kata_teratas)
```

---

## 7.15 Word Embedding: Word2Vec dan FastText

```python
# Melatih Word2Vec Sederhana dengan Gensim
# pip install gensim
from gensim.models import Word2Vec

korpus_token = df['tweet_clean'].apply(lambda x: x.split()).tolist()
model_w2v = Word2Vec(
    sentences=korpus_token,
    vector_size=100,  # dimensi vektor tiap kata
    window=5,         # jumlah kata konteks kiri/kanan
    min_count=3,      # abaikan kata frekuensi < 3
    workers=4,
)

print('Kata paling mirip dengan \"bagus\":')
print(model_w2v.wv.most_similar('bagus', topn=5))

# FastText memecah kata menjadi character n-gram, sehingga kebal terhadap Out-of-Vocabulary (OOV)
# dan sangat cocok untuk kata berimbuhan dalam Bahasa Indonesia (makan, memakan, dimakan).
```

---

## 7.16 Topic Modeling dengan LDA (Latent Dirichlet Allocation)

```python
# Topic Modeling dengan LDA pada Tweet Negatif
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer

tweet_negatif = df[df['sentimen'] == 'Negatif']['tweet_clean']
count_vec = CountVectorizer(max_features=1000, min_df=3, max_df=0.8)
count_matrix = count_vec.fit_transform(tweet_negatif)

n_topik = 5
lda_model = LatentDirichletAllocation(n_components=n_topik, random_state=42, max_iter=20)
lda_model.fit(count_matrix)

nama_fitur = count_vec.get_feature_names_out()
print('Topik Diskusi Utama pada Tweet Negatif:')
for idx_topik, bobot in enumerate(lda_model.components_):
    kata_teratas = [nama_fitur[i] for i in bobot.argsort()[-8:][::-1]]
    print(f'Topik {idx_topik + 1}: {", ".join(kata_teratas)}')
```

---

## QUIZ TAMBAHAN — NLP & TOPIC MODELING

1. Jelaskan kelemahan utama Bag of Words dibanding TF-IDF, dan bagaimana TF-IDF mengatasinya!
   * **Jawaban:** Bag of Words memberi bobot sama untuk semua kata berdasarkan frekuensi mentah, sehingga kata umum yang kurang informatif (seperti "yang", "di") bisa mendominasi. TF-IDF mengatasinya dengan menurunkan bobot kata yang muncul di banyak dokumen (IDF rendah) dan menaikkan bobot kata yang distingtif untuk dokumen tertentu.
2. Mengapa FastText lebih unggul dibanding Word2Vec untuk Bahasa Indonesia yang memiliki banyak variasi imbuhan?
   * **Jawaban:** FastText memecah kata menjadi sub-unit karakter (*character n-gram*) sehingga tetap bisa menghasilkan representasi vektor yang wajar untuk kata berimbuhan yang tidak pernah muncul saat training (*out-of-vocabulary*).
3. Apa perbedaan mendasar antara Topic Modeling (LDA) dengan Sentiment Analysis?
   * **Jawaban:** Sentiment Analysis adalah pendekatan klasifikasi teks ke label yang sudah ditentukan (*supervised/lexicon*), sedangkan Topic Modeling (LDA) adalah *unsupervised learning* yang menemukan kluster tema/topik tersembunyi tanpa label sebelumnya.
$NOTE_NLP_SENTIMENT$,
      'MessageSquare',
      20,
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
  -- BAGIAN 3: DAFTARKAN MODUL PRAKTIKUM & CAPSTONE PROJECTS
  -- ============================================================

  -- 1. Modul Utama Data Analyst di Tabel modules
  IF v_user_id IS NOT NULL AND v_cat_da IS NOT NULL THEN
    SELECT id INTO v_mod_da FROM modules WHERE title = 'Modul Komprehensif Data Analytics dengan Python' LIMIT 1;
    IF v_mod_da IS NULL THEN
      INSERT INTO modules (user_id, title, description, category_id, level, progress)
      VALUES (
        v_user_id,
        'Modul Komprehensif Data Analytics dengan Python',
        'Kurikulum 148 halaman end-to-end: Python dasar, Pandas, NumPy, Matplotlib, Seaborn, SQL, dan Statistika Bisnis dengan 300+ contoh kode siap pakai.',
        v_cat_da,
        'pemula',
        0
      ) RETURNING id INTO v_mod_da;

      -- Update atribut tambahan jika kolom content_type dan tech_stack tersedia
      BEGIN
        EXECUTE 'UPDATE modules SET content_type = ''module'', tech_stack = ARRAY[''Python'', ''Pandas'', ''NumPy'', ''Matplotlib'', ''Seaborn'', ''SQL'', ''Scipy''] WHERE id = ' || quote_literal(v_mod_da);
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END IF;

    -- Sub-bab Modul (hanya jika belum ada chapter untuk modul ini)
    IF v_mod_da IS NOT NULL AND NOT EXISTS (SELECT 1 FROM module_chapters WHERE module_id = v_mod_da) THEN
      INSERT INTO module_chapters (module_id, title, order_index, is_completed)
      VALUES
        (v_mod_da, 'Bab 0: Persiapan & Instalasi Lingkungan', 0, false),
        (v_mod_da, 'Bab 1: Data Analytics — Konsep & Alur Kerja Lengkap', 1, false),
        (v_mod_da, 'Bab 2: Pandas — Manipulasi & Analisis Data Profesional', 2, false),
        (v_mod_da, 'Bab 3: NumPy — Komputasi Numerik & Scientific Computing', 3, false),
        (v_mod_da, 'Bab 4: Matplotlib — Visualisasi Data yang Memukau', 4, false),
        (v_mod_da, 'Bab 5: Seaborn — Visualisasi Statistik Lanjutan', 5, false),
        (v_mod_da, 'Bab 8: SQL for Data Analyst', 8, false),
        (v_mod_da, 'Bab 9: Statistik untuk Data Analyst', 9, false),
        (v_mod_da, 'Appendix A–D: Cheat Sheet, Troubleshooting, Tips Optimasi & Karir', 10, false);
    END IF;
  END IF;

  -- 2. Daftarkan 4 Capstone Projects di Tabel projects (eksekusi dinamis agar tahan terhadap perbedaan skema)
  IF v_user_id IS NOT NULL THEN
    BEGIN
      -- Project 1: Telco Churn Analysis (Machine Learning)
      IF v_cat_ml IS NOT NULL THEN
        EXECUTE '
          INSERT INTO projects (user_id, title, description, category_id, level, tech_stack, notes)
          SELECT ' || quote_literal(v_user_id) || ',
                 ''Telco Customer Churn Predictive Analysis'',
                 ''Analisis prediktif kehilangan pelanggan pada dataset 7.043 baris, evaluasi ROC-AUC Logistic Regression vs Random Forest, dan identifikasi pelanggan at-risk.'',
                 ' || quote_literal(v_cat_ml) || ',
                 ''menengah'',
                 ARRAY[''Scikit-Learn'', ''Pandas'', ''Seaborn'', ''Random Forest''],
                 ''Berdasarkan Bab 6.1 Modul Komprehensif Data Analytics.''
          WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = ''Telco Customer Churn Predictive Analysis'')
        ';
      END IF;

      -- Project 2: Sales Forecasting & Time Series (Time Series Forecasting)
      IF v_cat_ts IS NOT NULL THEN
        EXECUTE '
          INSERT INTO projects (user_id, title, description, category_id, level, tech_stack, notes)
          SELECT ' || quote_literal(v_user_id) || ',
                 ''Time Series Sales Forecasting & Stationarity Analysis'',
                 ''Peramalan penjualan 3 tahun dengan dekomposisi tren, musiman, uji Augmented Dickey-Fuller (ADF), dan evaluasi walk-forward validation.'',
                 ' || quote_literal(v_cat_ts) || ',
                 ''menengah'',
                 ARRAY[''Statsmodels'', ''Scipy'', ''Pandas'', ''Matplotlib''],
                 ''Berdasarkan Bab 6.2 & 6.4 Modul Komprehensif Data Analytics.''
          WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = ''Time Series Sales Forecasting & Stationarity Analysis'')
        ';
      END IF;

      -- Project 3: Indonesian Tweet Sentiment & Emotion (NLP)
      IF v_cat_nlp IS NOT NULL THEN
        EXECUTE '
          INSERT INTO projects (user_id, title, description, category_id, level, tech_stack, notes)
          SELECT ' || quote_literal(v_user_id) || ',
                 ''Indonesian Tweet Sentiment & Emotion Analysis (450k Dataset)'',
                 ''Analisis sentimen dan deteksi emosi 8 kategori Plutchik pada 453.390 tweet Indonesia & Melayu dengan leksikon negasi, TF-IDF, Word2Vec, dan LDA.'',
                 ' || quote_literal(v_cat_nlp) || ',
                 ''lanjutan'',
                 ARRAY[''NLP'', ''Regex'', ''Gensim'', ''Scikit-Learn'', ''LDA''],
                 ''Berdasarkan Bab 7 Modul Komprehensif Data Analytics.''
          WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = ''Indonesian Tweet Sentiment & Emotion Analysis (450k Dataset)'')
        ';
      END IF;

      -- Project 4: Cohort Retention Analysis (SQL)
      IF v_cat_da IS NOT NULL THEN
        EXECUTE '
          INSERT INTO projects (user_id, title, description, category_id, level, tech_stack, notes)
          SELECT ' || quote_literal(v_user_id) || ',
                 ''Customer Retention Cohort Analysis with SQL & Heatmap'',
                 ''Analisis retensi pelanggan berbasis cohort bulan akuisisi menggunakan SQL CTE, window functions, serta visualisasi cohort retention triangle heatmap.'',
                 ' || quote_literal(v_cat_da) || ',
                 ''menengah'',
                 ARRAY[''SQL'', ''PostgreSQL'', ''CTE'', ''Pandas'', ''Seaborn''],
                 ''Berdasarkan Bab 8.9 Modul Komprehensif Data Analytics.''
          WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = ''Customer Retention Cohort Analysis with SQL & Heatmap'')
        ';
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Catatan: Seed tabel projects dilewati: %', SQLERRM;
    END;
  END IF;

END $SEED_COMPREHENSIVE_DATA_ANALYTICS$;
