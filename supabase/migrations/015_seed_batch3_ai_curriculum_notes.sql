-- ============================================================
-- Migration 015: Seed AI Curriculum Notes (Batch 3 - 5 Topik)
-- Topik:
-- 1. Data Science (16 Bab)
-- 2. Deep Learning (15 Bab)
-- 3. Edge AI & TinyML (12 Bab)
-- 4. Expert System (9 Bab)
-- 5. Generative AI (14 Bab)
-- Total: 66 Bab Catatan Lengkap Kurikulum & Praktikum AI
-- ============================================================

ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;

DO $$
DECLARE
  v_user_id UUID;
  v_parent_ai_id UUID;
  v_cat_ds UUID;
  v_cat_dl UUID;
  v_cat_edge UUID;
  v_cat_es UUID;
  v_cat_genai UUID;
  v_has_icon BOOLEAN;
  v_has_parent BOOLEAN;
BEGIN
  -- 1. Dapatkan user admin/owner atau user pertama yang ada di sistem
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

  -- Dapatkan ID Kategori Induk Kecerdasan Buatan
  SELECT id INTO v_parent_ai_id FROM categories WHERE name = 'Kecerdasan Buatan' LIMIT 1;
  IF v_parent_ai_id IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (''Kecerdasan Buatan'', ''#8B5CF6'', ''machine_learning'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_parent_ai_id;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Kecerdasan Buatan', '#8B5CF6', v_user_id) RETURNING id INTO v_parent_ai_id;
    END IF;
  END IF;

  -- Kategori: Data Science
  SELECT id INTO v_cat_ds FROM categories WHERE name = 'Data Science' LIMIT 1;
  IF v_cat_ds IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Data Science') || ', ''#06B6D4'', ''data_science'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_ds;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Data Science') || ', ''#06B6D4'', ''data_science'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_ds;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Data Science', '#06B6D4', v_user_id) RETURNING id INTO v_cat_ds;
    END IF;
  END IF;

  -- Kategori: Deep Learning
  SELECT id INTO v_cat_dl FROM categories WHERE name = 'Deep Learning' LIMIT 1;
  IF v_cat_dl IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Deep Learning') || ', ''#EC4899'', ''deep_learning'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_dl;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Deep Learning') || ', ''#EC4899'', ''deep_learning'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_dl;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Deep Learning', '#EC4899', v_user_id) RETURNING id INTO v_cat_dl;
    END IF;
  END IF;

  -- Kategori: Edge AI & TinyML
  SELECT id INTO v_cat_edge FROM categories WHERE name = 'Edge AI & TinyML' LIMIT 1;
  IF v_cat_edge IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Edge AI & TinyML') || ', ''#10B981'', ''edge_ai'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_edge;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Edge AI & TinyML') || ', ''#10B981'', ''edge_ai'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_edge;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Edge AI & TinyML', '#10B981', v_user_id) RETURNING id INTO v_cat_edge;
    END IF;
  END IF;

  -- Kategori: Expert System
  SELECT id INTO v_cat_es FROM categories WHERE name = 'Expert System' LIMIT 1;
  IF v_cat_es IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Expert System') || ', ''#14B8A6'', ''expert_systems'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_es;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Expert System') || ', ''#14B8A6'', ''expert_systems'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_es;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Expert System', '#14B8A6', v_user_id) RETURNING id INTO v_cat_es;
    END IF;
  END IF;

  -- Kategori: Generative AI
  SELECT id INTO v_cat_genai FROM categories WHERE name = 'Generative AI' LIMIT 1;
  IF v_cat_genai IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Generative AI') || ', ''#F59E0B'', ''generative_ai'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_genai;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Generative AI') || ', ''#F59E0B'', ''generative_ai'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_genai;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Generative AI', '#F59E0B', v_user_id) RETURNING id INTO v_cat_genai;
    END IF;
  END IF;

  -- ------------------------------------------------------------
  -- BAGIAN 1: DATA SCIENCE (16 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Pengantar Data Science',
    'bab-1-pengantar-data-science',
    '# BAB 1: Pengantar Data Science

Definisi & ruang lingkup Data Science, peran Data Scientist dalam organisasi, dan Data Science Life Cycle (CRISP-DM).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Pengantar Data Science dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# crisp_dm_cycle.py
CRISP_DM_PHASES = [
    "1. Business Understanding (Memahami objektif & KPI bisnis)",
    "2. Data Understanding (Eksplorasi data mentah & verifikasi kualitas)",
    "3. Data Preparation (Pembersihan, transformasi, & rekayasa fitur)",
    "4. Modeling (Pemilihan & pelatihan algoritma prediktif)",
    "5. Evaluation (Validasi model terhadap metrik keberhasilan bisnis)",
    "6. Deployment (Integrasi model ke lingkungan produksi)"
]
for phase in CRISP_DM_PHASES:
    print(f"[CRISP-DM] {phase}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Pengantar Data Science** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    1,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Fondasi Matematika & Statistika',
    'bab-2-fondasi-matematika-statistika',
    '# BAB 2: Fondasi Matematika & Statistika

Aljabar linear (vektor, matriks, eigenvalue), kalkulus diferensial untuk gradien, serta probabilitas & statistik inferensial.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Fondasi Matematika & Statistika dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# linear_algebra_stats.py
import numpy as np

# Perkalian matriks kovariansi dan dekomposisi nilai eigen (PCA dasar)
X = np.array([[2.5, 2.4], [0.5, 0.7], [2.2, 2.9], [1.9, 2.2], [3.1, 3.0]])
X_centered = X - np.mean(X, axis=0)
cov_matrix = np.cov(X_centered, rowvar=False)
eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)

print("Matriks Kovariansi:\n", cov_matrix)
print("Eigenvalues (Varian Terjelaskan):", eigenvalues)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Fondasi Matematika & Statistika** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
    2,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Pemrograman untuk Data Science',
    'bab-3-pemrograman-untuk-data-science',
    '# BAB 3: Pemrograman untuk Data Science

Python analitis (Pandas, NumPy, SciPy), komputasi statistik dengan R, dan version control data science menggunakan Git.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Pemrograman untuk Data Science dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# scientific_stack_demo.py
import pandas as pd
import numpy as np
from scipy import optimize

# Menemukan minimum fungsi loss numerik
def loss_func(w):
    return (w - 3.5)**2 + 10

res = optimize.minimize(loss_func, x0=[0.0])
print(f"Bobot Optimal w: {res.x[0]:.4f} dengan Minimum Loss: {res.fun:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Pemrograman untuk Data Science** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    3,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Pengumpulan & Pengolahan Data',
    'bab-4-pengumpulan-pengolahan-data',
    '# BAB 4: Pengumpulan & Pengolahan Data

Data wrangling, web scraping etis (BeautifulSoup/Playwright), dan integrasi data heterogen dari API serta database relasional.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Pengumpulan & Pengolahan Data dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# web_scraping_wrangling.py
import pandas as pd

raw_records = [
    {"source": "API_Sales", "user": "U101", "val": "150.50", "region": "ID"},
    {"source": "DB_Legacy", "user": "U102", "val": "230.00", "region": "SG"},
    {"source": "Web_Scrape", "user": "U103", "val": "95.20", "region": "MY"}
]

df = pd.DataFrame(raw_records)
df[''val''] = pd.to_numeric(df[''val''])
print("Dataset Gabungan Terpadu:\n", df.groupby(''region'')[''val''].sum())
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Pengumpulan & Pengolahan Data** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    4,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Exploratory Data Analysis (EDA)',
    'bab-5-exploratory-data-analysis-eda',
    '# BAB 5: Exploratory Data Analysis (EDA)

Analisis univariat & multivariat, visualisasi data untuk eksplorasi pola tersembunyi, dan deteksi anomali/outlier statistik.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Exploratory Data Analysis (EDA) dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# automated_eda_summary.py
import pandas as pd
import numpy as np

def generate_eda_profile(df):
    summary = {}
    for col in df.columns:
        summary[col] = {
            "dtype": str(df[col].dtype),
            "missing_pct": round(df[col].isnull().mean() * 100, 2),
            "unique_count": df[col].nunique()
        }
    return pd.DataFrame(summary).T

sample_df = pd.DataFrame({''age'': [25, 30, np.nan, 45], ''salary'': [5000, 7000, 8000, 150000]})
print("Profil EDA Dataset:\n", generate_eda_profile(sample_df))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Exploratory Data Analysis (EDA)** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    5,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Feature Engineering & Preprocessing',
    'bab-6-feature-engineering-preprocessing',
    '# BAB 6: Feature Engineering & Preprocessing

Feature selection & extraction, encoding data kategorikal (One-Hot, Target, Binary), serta scaling & normalisasi data.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Feature Engineering & Preprocessing dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# feature_preprocessing_pipeline.py
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import pandas as pd

data = pd.DataFrame({
    ''umur'': [22, 45, 33],
    ''gaji'': [6000000, 15000000, 9500000],
    ''kota'': [''Jakarta'', ''Bandung'', ''Surabaya'']
})

preprocessor = ColumnTransformer(transformers=[
    (''num'', StandardScaler(), [''umur'', ''gaji'']),
    (''cat'', OneHotEncoder(sparse_output=False), [''kota''])
])

transformed = preprocessor.fit_transform(data)
print("Bentuk Matriks Fitur Siap Model:", transformed.shape)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Feature Engineering & Preprocessing** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    6,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Statistical Modeling',
    'bab-7-statistical-modeling',
    '# BAB 7: Statistical Modeling

Regresi linear & logistik, uji hipotesis dalam pemodelan prediktif, dan analisis data runtun waktu (Time Series ARIMA).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Statistical Modeling dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# logistic_regression_stats.py
import numpy as np
from sklearn.linear_model import LogisticRegression

# Fitur: [Skor_Kredit, Rasio_Hutang], Label: [0: Ditolak, 1: Disetujui]
X = np.array([[700, 0.2], [580, 0.6], [750, 0.15], [520, 0.8]])
y = np.array([1, 0, 1, 0])

model = LogisticRegression().fit(X, y)
pemohon_baru = np.array([[680, 0.25]])
prob = model.predict_proba(pemohon_baru)[0][1]
print(f"Probabilitas Kelayakan Kredit: {prob:.2%}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Statistical Modeling** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    7,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Machine Learning untuk Data Science',
    'bab-8-machine-learning-untuk-data-science',
    '# BAB 8: Machine Learning untuk Data Science

Supervised & unsupervised learning, model evaluation & validation (ROC-AUC, F1-Score), serta teknik Ensemble Learning (Bagging, Boosting).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Machine Learning untuk Data Science dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# ensemble_xgboost_lightgbm.py
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import numpy as np

X = np.random.randn(100, 4)
y = np.random.randint(0, 2, 100)

rf = RandomForestClassifier(n_estimators=50, random_state=42).fit(X, y)
gb = GradientBoostingClassifier(n_estimators=50, random_state=42).fit(X, y)

print("Akurasi Random Forest:", round(rf.score(X, y), 3))
print("Akurasi Gradient Boosting:", round(gb.score(X, y), 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Machine Learning untuk Data Science** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    8,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Deep Learning Dasar untuk Data Science',
    'bab-9-deep-learning-dasar-untuk-data-science',
    '# BAB 9: Deep Learning Dasar untuk Data Science

Arsitektur Neural Network dasar (MLP), fungsi aktivasi, dan kapan harus menggunakan Deep Learning vs Machine Learning klasik.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Deep Learning Dasar untuk Data Science dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# dl_vs_classical_ml.py
def model_selection_heuristic(num_samples, num_features, data_type):
    if data_type in [''image'', ''audio'', ''raw_text'']:
        return "Gunakan Deep Learning (CNN / Transformer) - efektif untuk ekstraksi hierarki fitur non-linear kompleks."
    elif num_samples < 50000 and data_type == ''tabular'':
        return "Gunakan ML Klasik (XGBoost / LightGBM) - lebih cepat, interpretable, dan hemat sumber daya."
    else:
        return "Bandingkan Gradient Boosted Trees dengan TabNet / Deep MLP."

print(model_selection_heuristic(15000, 30, ''tabular''))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Deep Learning Dasar untuk Data Science** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    9,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Big Data & Data Engineering Dasar',
    'bab-10-big-data-data-engineering-dasar',
    '# BAB 10: Big Data & Data Engineering Dasar

Pengantar ekosistem Big Data, perbandingan SQL vs NoSQL untuk data science, dan komputasi terdistribusi dengan Apache Spark.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Big Data & Data Engineering Dasar dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# pyspark_ds_pipeline.py
print("Pipeline Big Data untuk Data Science:")
print("1. Data Lake Ingestion (Parquet terkompresi Snappy)")
print("2. Pemrosesan Paralel dengan Apache Spark (PySpark DataFrame API)")
print("3. Feature Store Ingestion untuk Training & Serving")
print("4. Penulisan Output Bersih ke Cloud Data Warehouse (BigQuery/Snowflake)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Big Data & Data Engineering Dasar** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    10,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Generative AI & LLM untuk Data Science',
    'bab-11-generative-ai-llm-untuk-data-science',
    '# BAB 11: Generative AI & LLM untuk Data Science

Pemanfaatan LLM untuk augmentasi analisis data, text-to-code, automated insight generation, dan integrasi GenAI pada alur kerja data.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Generative AI & LLM untuk Data Science dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# llm_insight_generation.py
def generate_ai_insight(metric_name, change_pct):
    trend = "peningkatan" if change_pct > 0 else "penurunan"
    prompt = f"Metrik {metric_name} mengalami {trend} sebesar {abs(change_pct):.1f}% minggu ini."
    ai_summary = f"[AI Analisis Insight] {prompt} Perlu investigasi faktor kampanye pemasaran dan retensi pengguna."
    return ai_summary

print(generate_ai_insight("Churn Pelanggan", -12.4))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Generative AI & LLM untuk Data Science** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    11,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Visualisasi & Komunikasi Data',
    'bab-12-visualisasi-komunikasi-data',
    '# BAB 12: Visualisasi & Komunikasi Data

Data storytelling, perancangan dashboard analitik interaktif, dan teknik komunikasi hasil temuan data kepada stakeholder non-teknis.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Visualisasi & Komunikasi Data dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# data_storytelling_report.py
def executive_data_story(kpi_data):
    return f"""=== EXECUTIVE DATA STORYTELLING ===
1. Konteks: Pertumbuhan kuartal ini didorong oleh ekspansi segmen enterprise.
2. Temuan Kritis: Nilai rata-rata pesanan (AOV) naik 28%, namun waktu konversi melambat 4 hari.
3. Tindakan Terarah: Optimalkan alur onboarding mandiri untuk memangkas siklus penjualan."""

print(executive_data_story(None))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Visualisasi & Komunikasi Data** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    12,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: Deployment & MLOps Dasar',
    'bab-13-deployment-mlops-dasar',
    '# BAB 13: Deployment & MLOps Dasar

Dasar deployment model machine learning (FastAPI / Docker), monitoring performa model di produksi, dan deteksi model drift.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 13: Deployment & MLOps Dasar dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# fastapi_ml_serving.py
# Contoh Endpoint REST API untuk Prediksi Model
# from fastapi import FastAPI
# app = FastAPI()
# @app.post("/predict")
# def predict(features: list):
#     prediction = model.predict([features])[0]
#     return {"prediction": int(prediction), "status": "success"}

print("[MLOps] Model dikemas ke dalam kontainer Docker dan di-deploy via REST/gRPC endpoint.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 13: Deployment & MLOps Dasar** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Rocket',
    13,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 14: Ethical Considerations dalam Data Science',
    'bab-14-ethical-considerations-dalam-data-science',
    '# BAB 14: Ethical Considerations dalam Data Science

Etika penggunaan data, kepatuhan privasi pengguna (GDPR / UU PDP), mitigasi bias algoritma, dan prinsip AI fairness.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 14: Ethical Considerations dalam Data Science dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# fairness_audit_metric.py
def check_demographic_parity(acceptance_rate_A, acceptance_rate_B):
    disparate_impact = acceptance_rate_A / acceptance_rate_B
    is_fair = 0.8 <= disparate_impact <= 1.25 # Kaidah 80% Four-Fifths Rule
    return f"Rasio Dampak Disparate: {disparate_impact:.3f} | Kepatuhan Fairness: {''LULUS'' if is_fair else ''TERDETEKSI BIAS''}"

print(check_demographic_parity(0.42, 0.48))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 14: Ethical Considerations dalam Data Science** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    14,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 15: Topik Lanjutan Data Science',
    'bab-15-topik-lanjutan-data-science',
    '# BAB 15: Topik Lanjutan Data Science

Causal Inference (menentukan sebab-akibat vs korelasi), desain eksperimen tingkat lanjut (Quasi-Experiments), dan NLP analitik dasar.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 15: Topik Lanjutan Data Science dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# causal_inference_intro.py
print("Causal Inference vs Korelasi:")
print("- Korelasi: ''Pengguna yang membuka fitur X memiliki retensi lebih tinggi.''")
print("- Sebab-Akibat (Kausal): ''Apakah fitur X yang menyebabkan kenaikan retensi, ataukah pengguna setia memang lebih aktif mencoba fitur baru?''")
print("- Metode: Difference-in-Differences (DiD), Propensity Score Matching (PSM).")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 15: Topik Lanjutan Data Science** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    15,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 16: Studi Kasus & Proyek',
    'bab-16-studi-kasus-proyek',
    '# BAB 16: Studi Kasus & Proyek

Proyek end-to-end: Prediksi churn bisnis, segmentasi perilaku pelanggan bernilai tinggi, dan strategi memenangkan kompetisi Kaggle.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 16: Studi Kasus & Proyek dalam domain Data Science.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# kaggle_pipeline_template.py
def kaggle_workflow_strategy():
    steps = [
        "1. K-Fold Cross Validation Stratified yang kokoh",
        "2. Rekayasa Fitur Agresif (Domain-specific aggregations)",
        "3. Training Model Beragam (LightGBM, CatBoost, XGBoost, Neural Net)",
        "4. Ensembling & Blending Berbobot (Out-of-Fold Stacking)",
        "5. Post-Processing & Threshold Tuning"
    ]
    return "\n".join(steps)

print(kaggle_workflow_strategy())
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 16: Studi Kasus & Proyek** merupakan pilar fundamental dalam spesialisasi Data Science.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Rocket',
    16,
    v_cat_ds,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 2: DEEP LEARNING (15 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Fondasi Deep Learning',
    'bab-1-fondasi-deep-learning',
    '# BAB 1: Fondasi Deep Learning

Perbedaan Deep Learning dengan Machine Learning klasik, sejarah perkembangan arsitektur, dan Hierarchical Feature Learning.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Fondasi Deep Learning dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# deep_vs_shallow_learning.py
print("Hierarchical Feature Learning:")
print("Layer 1 (Rendah) : Piksel tepi, sudut, tekstur lokal")
print("Layer 2 (Menengah): Motif bentuk, komponen objek (mata, roda)")
print("Layer 3 (Tinggi)  : Representasi semantik utuh (wajah, mobil, pemandangan)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Fondasi Deep Learning** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    1,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Neural Network Dasar',
    'bab-2-neural-network-dasar',
    '# BAB 2: Neural Network Dasar

Perceptron & Multi-Layer Perceptron (MLP), propagasi maju & mundur (Backpropagation), fungsi aktivasi (ReLU, GELU, Sigmoid), dan Computational Graph.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Neural Network Dasar dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# mlp_backprop_numpy.py
import numpy as np

# Perceptron Forward Step dengan Aktivasi ReLU
X = np.array([[1.0, 2.0]])
W = np.array([[0.5, -0.6], [0.8, 0.4]])
b = np.array([0.1, -0.2])

z = np.dot(X, W) + b
a = np.maximum(0, z) # Aktivasi ReLU
print("Logit (z):", z)
print("Aktivasi ReLU (a):", a)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Neural Network Dasar** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    2,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Optimisasi Deep Learning',
    'bab-3-optimisasi-deep-learning',
    '# BAB 3: Optimisasi Deep Learning

Algoritma Gradient Descent (SGD dengan Momentum, AdamW, RMSprop), penyesuaian laju belajar (Learning Rate Scheduling), dan Batch/Layer Normalization.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Optimisasi Deep Learning dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# adamw_optimizer_step.py
import torch
import torch.nn as nn
import torch.optim as optim

model = nn.Linear(10, 2)
optimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=0.01)
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)

print(f"Optimizer: {type(optimizer).__name__}, Lr Awal: {optimizer.param_groups[0][''lr'']}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Optimisasi Deep Learning** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    3,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Regularisasi & Generalisasi',
    'bab-4-regularisasi-generalisasi',
    '# BAB 4: Regularisasi & Generalisasi

Mencegah overfitting: Dropout, Weight Decay (L2 Regularization), Early Stopping, Data Augmentation, dan Label Smoothing.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Regularisasi & Generalisasi dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# regularization_techniques.py
import torch
import torch.nn as nn

class RegularizedNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(128, 64)
        self.bn = nn.BatchNorm1d(64)
        self.dropout = nn.Dropout(p=0.3)
        self.fc2 = nn.Linear(64, 10)

    def forward(self, x):
        x = torch.relu(self.bn(self.fc1(x)))
        x = self.dropout(x)
        return self.fc2(x)

print("Arsitektur Jaringan dengan Dropout & Batch Normalization:", RegularizedNet())
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Regularisasi & Generalisasi** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sliders',
    4,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Convolutional Neural Network (CNN)',
    'bab-5-convolutional-neural-network-cnn',
    '# BAB 5: Convolutional Neural Network (CNN)

Operasi konvolusi, pooling, receptive field, arsitektur CNN klasik hingga modern (VGG, ResNet, EfficientNet), dan Depthwise Separable Convolution.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Convolutional Neural Network (CNN) dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# depthwise_separable_conv.py
import torch
import torch.nn as nn

class DepthwiseSeparableConv(nn.Module):
    """Blok efisien MobileNet: Memisahkan filtering spasial dan kombinasi kanal"""
    def __init__(self, in_c, out_c):
        super().__init__()
        self.depthwise = nn.Conv2d(in_c, in_c, kernel_size=3, padding=1, groups=in_c)
        self.pointwise = nn.Conv2d(in_c, out_c, kernel_size=1)

    def forward(self, x):
        return self.pointwise(self.depthwise(x))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Convolutional Neural Network (CNN)** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Layers',
    5,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Recurrent Neural Network (RNN)',
    'bab-6-recurrent-neural-network-rnn',
    '# BAB 6: Recurrent Neural Network (RNN)

Pemodelan data sekuensial: Vanilla RNN, gating mechanism LSTM (Long Short-Term Memory), GRU, dan pemrosesan dua arah (Bidirectional RNN).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Recurrent Neural Network (RNN) dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# lstm_cell_mechanics.py
import torch
import torch.nn as nn

lstm = nn.LSTM(input_size=64, hidden_size=128, num_layers=2, batch_first=True, bidirectional=True)
dummy_input = torch.randn(32, 20, 64) # (batch, seq_len, feature_dim)
output, (h_n, c_n) = lstm(dummy_input)

print(f"Output Bi-LSTM Shape: {output.shape} (Dimensi fitur x2 arah)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Recurrent Neural Network (RNN)** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    6,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Transformer & Attention',
    'bab-7-transformer-attention',
    '# BAB 7: Transformer & Attention

Mekanisme Scaled Dot-Product Self-Attention, Multi-Head Attention, arsitektur Transformer Encoder-Decoder, Positional Encoding, dan FlashAttention.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Transformer & Attention dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# self_attention_calculation.py
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    weights = F.softmax(scores, dim=-1)
    output = torch.matmul(weights, V)
    return output, weights

q = torch.randn(1, 4, 16)
output, w = scaled_dot_product_attention(q, q, q)
print("Output Attention Shape:", output.shape)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Transformer & Attention** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Layers',
    7,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Generative Deep Learning',
    'bab-8-generative-deep-learning',
    '# BAB 8: Generative Deep Learning

Pemodelan generatif probabilistik: Variational Autoencoder (VAE), Generative Adversarial Network (GAN), Diffusion Model (DDPM), dan Normalizing Flow.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Generative Deep Learning dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# vae_reparameterization.py
import torch

def reparameterize(mu, logvar):
    """Trik Reparameterisasi VAE agar gradient dapat mengalir mundur"""
    std = torch.exp(0.5 * logvar)
    eps = torch.randn_like(std)
    return mu + eps * std

mu = torch.zeros(1, 10)
logvar = torch.zeros(1, 10)
z = reparameterize(mu, logvar)
print("Sampel Vektor Laten z Shape:", z.shape)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Generative Deep Learning** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    8,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Self-Supervised & Contrastive Learning',
    'bab-9-self-supervised-contrastive-learning',
    '# BAB 9: Self-Supervised & Contrastive Learning

Pembelajaran tanpa label: Pretext Tasks, Contrastive Learning (SimCLR, MoCo), Masked Autoencoders (MAE), dan fondasi representasi BERT-style.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Self-Supervised & Contrastive Learning dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# contrastive_loss_simclr.py
import torch
import torch.nn.functional as F

def simclr_nt_xent_loss(z_i, z_j, temperature=0.5):
    # z_i dan z_j adalah representasi dari 2 augmentasi gambar yang sama
    z_i_norm = F.normalize(z_i, dim=-1)
    z_j_norm = F.normalize(z_j, dim=-1)
    sim = torch.sum(z_i_norm * z_j_norm, dim=-1) / temperature
    loss = -torch.log(torch.exp(sim) / (torch.exp(sim) + 1e-6))
    return loss.mean()

print("SimCLR Loss Formula siap dieksekusi.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Self-Supervised & Contrastive Learning** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    9,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Graph & Geometric Deep Learning',
    'bab-10-graph-geometric-deep-learning',
    '# BAB 10: Graph & Geometric Deep Learning

Pembelajaran representasi non-Euclidean: Graph Neural Network (GCN, GAT, GraphSAGE), Message Passing Neural Networks, dan Geometric Deep Learning.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Graph & Geometric Deep Learning dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# gcn_message_passing.py
import numpy as np

# Perkalian Normalized Adjacency Matrix pada GCN
A = np.array([[1, 1, 0], [1, 1, 1], [0, 1, 1]]) # Matriks ketetanggaan dengan self-loop
H = np.array([[0.5, 0.2], [0.8, 0.1], [0.3, 0.9]]) # Fitur node
W = np.array([[0.4, 0.6], [0.7, 0.3]]) # Bobot

H_next = np.maximum(0, np.dot(np.dot(A, H), W))
print("Fitur Node Layer Berikutnya (GCN):\n", H_next)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Graph & Geometric Deep Learning** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    10,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Efisiensi Model Deep Learning',
    'bab-11-efisiensi-model-deep-learning',
    '# BAB 11: Efisiensi Model Deep Learning

Kompresi dan optimasi model: Weight Pruning (Struktural vs Tidak Terstruktur), Post-Training Quantization (INT8), dan Knowledge Distillation (Teacher-Student).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Efisiensi Model Deep Learning dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# knowledge_distillation_loss.py
import torch
import torch.nn as nn
import torch.nn.functional as F

def distillation_loss(student_logits, teacher_logits, labels, T=3.0, alpha=0.7):
    soft_loss = nn.KLDivLoss(reduction="batchmean")(
        F.log_softmax(student_logits / T, dim=-1),
        F.softmax(teacher_logits / T, dim=-1)
    ) * (T * T)
    hard_loss = F.cross_entropy(student_logits, labels)
    return alpha * soft_loss + (1.0 - alpha) * hard_loss

print("Fungsi Loss Distilasi Pengetahuan (Teacher -> Student) siap.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Efisiensi Model Deep Learning** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    11,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Interpretability Deep Learning',
    'bab-12-interpretability-deep-learning',
    '# BAB 12: Interpretability Deep Learning

Transparansi model kotak hitam (Black Box): Saliency Maps, Gradient-weighted Class Activation Mapping (Grad-CAM), dan visualisasi aktivasi fitur.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Interpretability Deep Learning dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# gradcam_concept.py
def grad_cam_weights(gradients):
    # Global average pooling atas gradien terhadap feature map
    weights = gradients.mean(dim=(2, 3), keepdim=True)
    return weights

print("Grad-CAM: Mengukur kontribusi spasial konvolusi terhadap prediksi kelas tertentu.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Interpretability Deep Learning** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    12,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: Multimodal Deep Learning',
    'bab-13-multimodal-deep-learning',
    '# BAB 13: Multimodal Deep Learning

Penggabungan lintas modalitas (Gambar, Teks, Suara): Early Fusion, Late Fusion, Cross-Attention Fusion, dan arsitektur model visi-bahasa (VLM).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 13: Multimodal Deep Learning dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# cross_attention_fusion.py
import torch
import torch.nn as nn

class CrossAttentionFusion(nn.Module):
    def __init__(self, dim):
        super().__init__()
        self.mha = nn.MultiheadAttention(embed_dim=dim, num_heads=4, batch_first=True)

    def forward(self, visual_features, text_features):
        # Teks menjadi Query, Visual menjadi Key & Value
        fused, _ = self.mha(query=text_features, key=visual_features, value=visual_features)
        return fused
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 13: Multimodal Deep Learning** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    13,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 14: Infrastruktur & Framework',
    'bab-14-infrastruktur-framework',
    '# BAB 14: Infrastruktur & Framework

Ekosistem framework (PyTorch vs TensorFlow), pelatihan terdistribusi (DistributedDataParallel - DDP, FSDP), dan akselerator komputasi GPU/TPU.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 14: Infrastruktur & Framework dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# pytorch_ddp_setup.py
# Contoh Inisialisasi PyTorch Distributed Data Parallel (DDP)
# import torch.distributed as dist
# dist.init_process_group(backend="nccl")
# model = nn.parallel.DistributedDataParallel(model.to(local_rank), device_ids=[local_rank])

print("Infrastruktur Pelatihan Paralel Skala Multi-GPU (DDP & FSDP) terkonfigurasi.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 14: Infrastruktur & Framework** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    14,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 15: Proyek & Studi Kasus Deep Learning',
    'bab-15-proyek-studi-kasus-deep-learning',
    '# BAB 15: Proyek & Studi Kasus Deep Learning

Implementasi proyek komprehensif: Klasifikasi citra medis, pemodelan sekuens deret waktu, deteksi anomali multi-dimensi, dan model generatif.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 15: Proyek & Studi Kasus Deep Learning dalam domain Deep Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# end_to_end_dl_project.py
def end_to_end_dl_pipeline():
    print("1. Data Ingestion & Torch Dataset DataLoader dengan augmentasi Albumentations")
    print("2. Pemilihan Backbone Pretrained (ResNet50 / ConvNeXt) via timm")
    print("3. Pelatihan Mixed-Precision (FP16/BF16) menggunakan PyTorch AMP")
    print("4. Early stopping & Checkpoint model dengan bobot loss validasi terbaik")
    print("5. Ekspor format TorchScript / TensorRT untuk inferensi latensi ultra-rendah")

end_to_end_dl_pipeline()
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 15: Proyek & Studi Kasus Deep Learning** merupakan pilar fundamental dalam spesialisasi Deep Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    15,
    v_cat_dl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 3: EDGE AI & TINYML (12 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar Edge AI',
    'bab-1-konsep-dasar-edge-ai',
    '# BAB 1: Konsep Dasar Edge AI

Definisi Edge AI vs Cloud AI, keunggulan privasi data, latensi nol (Zero Latency), ketergantungan konektivitas, dan tantangan sumber daya.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar Edge AI dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# edge_vs_cloud_latency.py
def compare_architecture(edge_proc_ms=8.5, network_rtt_ms=120.0, cloud_proc_ms=5.0):
    total_cloud = network_rtt_ms + cloud_proc_ms
    print(f"Latensi Cloud AI : {total_cloud:.1f} ms (Tergantung koneksi internet)")
    print(f"Latensi Edge AI  : {edge_proc_ms:.1f} ms (Inferensi lokal instan & privat)")

compare_architecture()
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar Edge AI** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    1,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Perangkat Keras untuk Edge AI',
    'bab-2-perangkat-keras-untuk-edge-ai',
    '# BAB 2: Perangkat Keras untuk Edge AI

Arsitektur perangkat keras: Mikrokontroler (ARM Cortex-M, ESP32), Single Board Computers (Raspberry Pi), Neural Processing Units (NPU), dan ASIC khusus AI.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Perangkat Keras untuk Edge AI dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# hardware_spec_check.py
EDGE_HARDWARE_SPECS = {
    "Microcontroller (Cortex-M4)": {"RAM": "256 KB", "Flash": "1 MB", "Power": "mW"},
    "Edge SoC (Raspberry Pi 5)": {"RAM": "8 GB", "Storage": "MicroSD/NVMe", "Power": "15W"},
    "Dedicated NPU (Google Coral)": {"Performance": "4 TOPS", "Power": "2W", "Interface": "USB/M.2"}
}
for hw, spec in EDGE_HARDWARE_SPECS.items():
    print(f"[{hw}] -> {spec}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Perangkat Keras untuk Edge AI** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    2,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Optimisasi Model untuk Edge',
    'bab-3-optimisasi-model-untuk-edge',
    '# BAB 3: Optimisasi Model untuk Edge

Teknik kompresi model untuk perangkat terbatas: Post-Training Quantization (PTQ vs QAT), structured pruning, dan Knowledge Distillation.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Optimisasi Model untuk Edge dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# int8_quantization_concept.py
import numpy as np

def quantize_float_to_int8(weights_float32):
    # Mapping float32 [-max, max] ke int8 [-128, 127]
    scale = np.max(np.abs(weights_float32)) / 127.0
    weights_int8 = np.round(weights_float32 / scale).astype(np.int8)
    return weights_int8, scale

weights = np.array([-0.85, 0.12, 0.45, -0.10, 0.99], dtype=np.float32)
q_weights, s = quantize_float_to_int8(weights)
print("Bobot Asli (Float32):", weights)
print("Bobot Kuantisasi (Int8):", q_weights, f"Scale: {s:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Optimisasi Model untuk Edge** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    3,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Framework TinyML',
    'bab-4-framework-tinyml',
    '# BAB 4: Framework TinyML

Framework inferensi perangkat mikro: TensorFlow Lite (TFLite), TensorFlow Lite for Microcontrollers (TFLM), Edge Impulse, dan ONNX Runtime Mobile.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Framework TinyML dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# tflite_converter_flow.py
# Contoh konversi model Keras ke format TFLite terkuantisasi
# converter = tf.lite.TFLiteConverter.from_keras_model(model)
# converter.optimizations = [tf.lite.Optimize.DEFAULT]
# tflite_quant_model = converter.convert()

print("[TinyML] Model berhasil dikonversi ke format flatbuffer .tflite untuk mikroprosesor.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Framework TinyML** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    4,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Deployment Model di Edge Device',
    'bab-5-deployment-model-di-edge-device',
    '# BAB 5: Deployment Model di Edge Device

Konversi model ke format biner edge, pengelolaan memori SRAM yang ketat, dan manajemen konsumsi daya komputasi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Deployment Model di Edge Device dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# tflm_tensor_arena.c
/* Contoh C++ Tensor Arena untuk TensorFlow Lite Micro */
// constexpr int kTensorArenaSize = 30 * 1024; // 30 KB SRAM
// uint8_t tensor_arena[kTensorArenaSize];
// tflite::MicroInterpreter interpreter(model, resolver, tensor_arena, kTensorArenaSize);
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Deployment Model di Edge Device** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    5,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: TinyML untuk IoT',
    'bab-6-tinyml-untuk-iot',
    '# BAB 6: TinyML untuk IoT

Integrasi TinyML dengan sensor IoT: Akselerometer untuk deteksi getaran mesin, mikrofon untuk keyword spotting (wake-word), dan inferensi real-time.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: TinyML untuk IoT dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# sensor_sampling_inference.py
def process_accelerometer_stream(sensor_buffer):
    # Buffer 3-axis accelerometer (x, y, z) 50 Hz
    rms_vibration = sum([x**2 for x in sensor_buffer]) / len(sensor_buffer)
    if rms_vibration > 15.0:
        return "ANOMALI: Kerusakan bearing mekanik terdeteksi!"
    return "STATUS: Normal"

print(process_accelerometer_stream([2.1, 1.9, 2.0, 2.4, 18.2, 19.5]))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: TinyML untuk IoT** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    6,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Federated Learning di Edge',
    'bab-7-federated-learning-di-edge',
    '# BAB 7: Federated Learning di Edge

Pembelajaran mesin terdesentralisasi: Pelatihan model lokal pada perangkat pengguna, pertukaran bobot terenkripsi, dan FedAvg (Federated Averaging).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Federated Learning di Edge dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# fedavg_aggregation.py
import numpy as np

def federated_averaging(client_weights, sample_sizes):
    total_samples = sum(sample_sizes)
    global_weights = np.zeros_like(client_weights[0])
    for w, n in zip(client_weights, sample_sizes):
        global_weights += w * (n / total_samples)
    return global_weights

c1 = np.array([1.2, 0.8])
c2 = np.array([1.4, 0.9])
print("Bobot Agregasi Global Federated Learning:", federated_averaging([c1, c2], [100, 200]))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Federated Learning di Edge** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    7,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: On-Device LLM & Small Language Model',
    'bab-8-on-device-llm-small-language-model',
    '# BAB 8: On-Device LLM & Small Language Model

Penerapan Small Language Model (SLM: Phi-3, Gemma-2B, Llama-3-1B), teknik 4-bit quantization (GGUF/AWQ), dan inferensi lokal pada smartphone/PC.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: On-Device LLM & Small Language Model dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# llm_edge_quant_gguf.py
print("Arsitektur On-Device SLM:")
print("- Model Base     : Phi-3 Mini (3.8B) / Llama-3.2 (1B/3B)")
print("- Format Runtime : GGUF via llama.cpp / MLC-LLM")
print("- Kuantisasi     : Q4_K_M (Bobot 4-bit, memori RAM < 2.5 GB)")
print("- Akselerator    : Apple Metal / Qualcomm NPU / Vulkan GPU")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: On-Device LLM & Small Language Model** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    8,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Evaluasi Model Edge AI',
    'bab-9-evaluasi-model-edge-ai',
    '# BAB 9: Evaluasi Model Edge AI

Trade-off multidimensi: Akurasi vs Latensi Inferensi (ms) vs Konsumsi Daya Baterai (milliwatt) vs Ukuran Memori Flash/SRAM.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Evaluasi Model Edge AI dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# edge_benchmark_metrics.py
def calculate_edge_efficiency(accuracy, latency_ms, power_mw, memory_kb):
    score = (accuracy * 1000) / (latency_ms * (power_mw / 100) * (memory_kb / 1024))
    return round(score, 3)

print("Skor Efisiensi Edge Model:", calculate_edge_efficiency(0.92, 15.0, 350.0, 250))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Evaluasi Model Edge AI** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
    9,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Keamanan Edge AI',
    'bab-10-keamanan-edge-ai',
    '# BAB 10: Keamanan Edge AI

Proteksi model di perangkat fisik: Anti-tampering, enkripsi bobot model, pencegahan reverse engineering, dan pengamanan antarmuka JTAG/UART.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Keamanan Edge AI dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# model_integrity_hash.py
import hashlib

def verify_model_firmware(model_binary, expected_sha256):
    actual_hash = hashlib.sha256(model_binary).hexdigest()
    if actual_hash == expected_sha256:
        return "VALID: Integritas model terverifikasi aman dieksekusi di NPU."
    return "PERINGATAN: Integritas model rusak atau telah dimodifikasi (Tampered)!"

print(verify_model_firmware(b"model_weights_dummy", "3f..."))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Keamanan Edge AI** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    10,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Manajemen Daya & Efisiensi Energi',
    'bab-11-manajemen-daya-efisiensi-energi',
    '# BAB 11: Manajemen Daya & Efisiensi Energi

Teknik hemat daya komputasi: Duty Cycling (Deep Sleep), Event-driven Wakeup (Interupsi sensor), dan Dynamic Voltage and Frequency Scaling (DVFS).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Manajemen Daya & Efisiensi Energi dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# duty_cycling_strategy.py
def calculate_battery_life_days(sleep_current_ua=5.0, active_current_ma=25.0, active_time_sec_per_hour=10.0, batt_capacity_mah=1200):
    avg_current_ma = ((active_current_ma * active_time_sec_per_hour) + (sleep_current_ua / 1000 * (3600 - active_time_sec_per_hour))) / 3600
    hours = batt_capacity_mah / avg_current_ma
    return round(hours / 24, 1)

print(f"Estimasi Masa Hidup Baterai Sensor IoT: {calculate_battery_life_days()} hari")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Manajemen Daya & Efisiensi Energi** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    11,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Aplikasi Edge AI & TinyML',
    'bab-12-aplikasi-edge-ai-tinyml',
    '# BAB 12: Aplikasi Edge AI & TinyML

Studi kasus industri: Wearable health monitor (deteksi aritmia ECG), Smart City kamera pengawas cerdas, dan Predictive Maintenance pabrik.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Aplikasi Edge AI & TinyML dalam domain Edge AI & TinyML.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# predictive_maintenance_edge.py
def edge_motor_health_monitor(temp_celsius, vibration_g):
    if temp_celsius > 85.0 and vibration_g > 3.5:
        return "KRITIS: Segera matikan motor induksi untuk mencegah breakdown!"
    elif vibration_g > 2.0:
        return "WASPADAI: Jadwalkan pelumasan bearing rutin."
    return "NORMAL: Motor beroperasi dalam batas aman."

print("Status Mesin Pabrik:", edge_motor_health_monitor(88.0, 4.1))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Aplikasi Edge AI & TinyML** merupakan pilar fundamental dalam spesialisasi Edge AI & TinyML.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    12,
    v_cat_edge,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 4: EXPERT SYSTEM (9 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar Expert System',
    'bab-1-konsep-dasar-expert-system',
    '# BAB 1: Konsep Dasar Expert System

Definisi & karakteristik Expert System, perbandingan dengan sistem konvensional prosedural, dan arsitektur komponen utama.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar Expert System dalam domain Expert System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# expert_system_architecture.py
EXPERT_SYSTEM_COMPONENTS = {
    "Knowledge Base": "Repositori fakta dan aturan (IF-THEN rules) dari pakar domain",
    "Inference Engine": "Mekanisme penalaran deduktif (Forward/Backward Chaining)",
    "Working Memory": "Basis data dinamis menyimpan fakta kondisi saat ini",
    "Explanation Facility": "Modul transparansi yang menjelaskan ''Mengapa'' dan ''Bagaimana'' keputusan diambil",
    "User Interface": "Antarmuka konsultasi interaktif dengan pengguna"
}
for comp, desc in EXPERT_SYSTEM_COMPONENTS.items():
    print(f"[{comp}] : {desc}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar Expert System** merupakan pilar fundamental dalam spesialisasi Expert System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    1,
    v_cat_es,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Knowledge Base',
    'bab-2-knowledge-base',
    '# BAB 2: Knowledge Base

Akuisisi pengetahuan dari pakar (Knowledge Acquisition), representasi pengetahuan (Semantic Network, Frame, Rule Base), dan ontologi (OWL).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Knowledge Base dalam domain Expert System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# rule_base_representation.py
rules = [
    {"id": "R1", "if": ["demam", "batuk"], "then": "infeksi_saluran_napas"},
    {"id": "R2", "if": ["infeksi_saluran_napas", "sesak_napas"], "then": "rujuk_ke_rumah_sakit"},
    {"id": "R3", "if": ["infeksi_saluran_napas", "tanpa_sesak"], "then": "istirahat_dan_obat_gejala"}
]
print(f"Jumlah Aturan dalam Knowledge Base: {len(rules)}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Knowledge Base** merupakan pilar fundamental dalam spesialisasi Expert System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    2,
    v_cat_es,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Inference Engine',
    'bab-3-inference-engine',
    '# BAB 3: Inference Engine

Mekanisme inferensi: Forward Chaining (Data-Driven), Backward Chaining (Goal-Driven), Hybrid Chaining, dan Conflict Resolution Strategy.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Inference Engine dalam domain Expert System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# forward_chaining_engine.py
def forward_chaining(known_facts, rules):
    facts = set(known_facts)
    added_new = True
    while added_new:
        added_new = False
        for r in rules:
            if r["then"] not in facts:
                if all(cond in facts for cond in r["if"]):
                    facts.add(r["then"])
                    print(f"Aturan {r[''id'']} FIRED! Fakta baru ditambahkan: {r[''then'']}")
                    added_new = True
    return facts

initial_facts = ["demam", "batuk", "sesak_napas"]
final_facts = forward_chaining(initial_facts, [
    {"id": "R1", "if": ["demam", "batuk"], "then": "infeksi_saluran_napas"},
    {"id": "R2", "if": ["infeksi_saluran_napas", "sesak_napas"], "then": "rujuk_ke_rumah_sakit"}
])
print("Fakta Akhir Terbukti:", final_facts)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Inference Engine** merupakan pilar fundamental dalam spesialisasi Expert System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    3,
    v_cat_es,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Ketidakpastian dalam Expert System',
    'bab-4-ketidakpastian-dalam-expert-system',
    '# BAB 4: Ketidakpastian dalam Expert System

Menangani ketidakpastian: Teori Certainty Factor (CF = MB - MD), Teori Dempster-Shafer, Fuzzy Expert System, dan Bayesian Belief Networks.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Ketidakpastian dalam Expert System dalam domain Expert System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# certainty_factor_calc.py
def combine_cf(cf1, cf2):
    """Kombinasi 2 bukti independen untuk hipotesis yang sama"""
    if cf1 >= 0 and cf2 >= 0:
        return cf1 + cf2 * (1.0 - cf1)
    elif cf1 <= 0 and cf2 <= 0:
        return cf1 + cf2 * (1.0 + cf1)
    else:
        return (cf1 + cf2) / (1.0 - min(abs(cf1), abs(cf2)))

cf_pakar1 = 0.60
cf_pakar2 = 0.50
cf_kombinasi = combine_cf(cf_pakar1, cf_pakar2)
print(f"Certainty Factor Gabungan: {cf_kombinasi:.2f} ({cf_kombinasi*100:.0f}% keyakinan)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Ketidakpastian dalam Expert System** merupakan pilar fundamental dalam spesialisasi Expert System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    4,
    v_cat_es,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Metode Penalaran',
    'bab-5-metode-penalaran',
    '# BAB 5: Metode Penalaran

Metode penalaran: Rule-Based Reasoning (RBR), Case-Based Reasoning (CBR: Retrieve, Reuse, Revise, Retain), dan Model-Based Reasoning.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Metode Penalaran dalam domain Expert System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# case_based_reasoning.py
cases_db = [
    {"id": 1, "symptoms": ["baterai_cepat_habis", "panas"], "solution": "ganti_baterai"},
    {"id": 2, "symptoms": ["layar_gelap", "suara_ada"], "solution": "ganti_lcd_backlight"}
]

def cbr_retrieve(current_symptoms):
    best_case = max(cases_db, key=lambda c: len(set(current_symptoms).intersection(set(c["symptoms"]))))
    return best_case

print("Solusi Kasus Paling Mirip:", cbr_retrieve(["baterai_cepat_habis", "panas"]))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Metode Penalaran** merupakan pilar fundamental dalam spesialisasi Expert System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    5,
    v_cat_es,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Perancangan Expert System',
    'bab-6-perancangan-expert-system',
    '# BAB 6: Perancangan Expert System

Tahapan rekayasa pengetahuan (Knowledge Engineering), perancangan fasilitas penjelasan (Explanation Facility), serta validasi & verifikasi sistem.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Perancangan Expert System dalam domain Expert System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# explanation_facility.py
class ExplanationFacility:
    def __init__(self):
        self.reasoning_trace = []

    def log_rule(self, rule_id, rationale):
        self.reasoning_trace.append(f"Aturan {rule_id}: {rationale}")

    def explain(self):
        return "\n".join(self.reasoning_trace)

exp = ExplanationFacility()
exp.log_rule("R12", "Karena tekanan oli < 10 psi, pompa oli dimatikan.")
print("Fasilitas Penjelasan (Mengapa Sistem Mengambil Keputusan):\n", exp.explain())
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Perancangan Expert System** merupakan pilar fundamental dalam spesialisasi Expert System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    6,
    v_cat_es,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Tools & Shell Expert System',
    'bab-7-tools-shell-expert-system',
    '# BAB 7: Tools & Shell Expert System

Ekosistem pengembangan: Expert System Shell (CLIPS, Drools), bahasa pemrograman deklaratif Prolog, dan rule engine Python (Experta/pyknow).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Tools & Shell Expert System dalam domain Expert System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# clips_prolog_syntax.pl
% Contoh Sintaks Deklaratif Bahasa Prolog
% Fakta:
gejala(pasien1, pusing).
gejala(pasien1, mual).

% Aturan Inferensi:
terdiagnosis(Pasien, migrain) :- 
    gejala(Pasien, pusing), 
    gejala(Pasien, mual).
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Tools & Shell Expert System** merupakan pilar fundamental dalam spesialisasi Expert System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    7,
    v_cat_es,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Integrasi dengan AI Modern',
    'bab-8-integrasi-dengan-ai-modern',
    '# BAB 8: Integrasi dengan AI Modern

Sistem pakar hibrida: Menggabungkan Rule-Based Expert System dengan model Machine Learning dan LLM sebagai Knowledge Extractor otomatis.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Integrasi dengan AI Modern dalam domain Expert System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# neuro_symbolic_expert.py
def neuro_symbolic_decision(sensor_raw, ml_model, rule_engine):
    # 1. Neural Net: Deteksi pola data persepsi mentah
    detected_class = ml_model.predict(sensor_raw)
    # 2. Symbolic Rules: Verifikasi batas regulasi dan logika bisnis mutlak
    decision = rule_engine.enforce_policy(detected_class)
    return decision

print("Arsitektur Neuro-Symbolic: Keakuratan representasi persepsi + kepatuhan aturan hukum.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Integrasi dengan AI Modern** merupakan pilar fundamental dalam spesialisasi Expert System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    8,
    v_cat_es,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Studi Kasus & Aplikasi',
    'bab-9-studi-kasus-aplikasi',
    '# BAB 9: Studi Kasus & Aplikasi

Aplikasi nyata: Diagnosis medis klinis (MYCIN style), troubleshooting kerusakan perangkat keras, analisis kepatuhan pajak, dan sistem rekomendasi bisnis.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Studi Kasus & Aplikasi dalam domain Expert System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# fault_diagnosis_system.py
def troubleshoot_network(ping_gateway, dns_resolved):
    if not ping_gateway:
        return "Diagnosa: Kabel fisik LAN terputus atau Router gateway down."
    elif not dns_resolved:
        return "Diagnosa: Koneksi lokal normal, namun Server DNS mengalami kendala."
    return "Diagnosa: Jaringan internet beroperasi optimal."

print(troubleshoot_network(True, False))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Studi Kasus & Aplikasi** merupakan pilar fundamental dalam spesialisasi Expert System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Rocket',
    9,
    v_cat_es,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 5: GENERATIVE AI (14 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar Generative AI',
    'bab-1-konsep-dasar-generative-ai',
    '# BAB 1: Konsep Dasar Generative AI

Generative vs Discriminative Model, pemodelan distribusi probabilitas data p(x) vs p(y|x), dan evolusi Generative AI.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar Generative AI dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# generative_vs_discriminative.py
print("Perbedaan Model Generatif vs Diskriminatif:")
print("- Model Diskriminatif (Klasifikasi): Mempelajari p(Y|X) - ''Apakah gambar ini anjing atau kucing?''")
print("- Model Generatif (Sintesis)      : Mempelajari p(X) atau p(X|Y) - ''Buatkan gambar anjing baru yang belum pernah ada!''")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar Generative AI** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    1,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Variational Autoencoder (VAE)',
    'bab-2-variational-autoencoder-vae',
    '# BAB 2: Variational Autoencoder (VAE)

Arsitektur Encoder-Decoder probabilistik, manifold ruang laten kontinu (Latent Space), dan fungsi loss kombinasi Rekonstruksi + KL Divergence.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Variational Autoencoder (VAE) dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# vae_loss_formulation.py
import torch
import torch.nn.functional as F

def vae_loss(recon_x, x, mu, logvar):
    # Reconstruction loss (BCE atau MSE)
    recon_loss = F.binary_cross_entropy(recon_x, x, reduction="sum")
    # KL Divergence: Mengatur ruang laten agar mengikuti distribusi Gaussian N(0, 1)
    kld_loss = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
    return recon_loss + kld_loss
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Variational Autoencoder (VAE)** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    2,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Generative Adversarial Network (GAN)',
    'bab-3-generative-adversarial-network-gan',
    '# BAB 3: Generative Adversarial Network (GAN)

Paradigma Zero-Sum Game Generator vs Discriminator, variasi arsitektur (DCGAN, StyleGAN, CycleGAN), dan tantangan training (Mode Collapse).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Generative Adversarial Network (GAN) dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# dcgan_generator_pytorch.py
import torch
import torch.nn as nn

class DCGANGenerator(nn.Module):
    def __init__(self, nz=100, ngf=64, nc=3):
        super().__init__()
        self.main = nn.Sequential(
            nn.ConvTranspose2d(nz, ngf * 8, 4, 1, 0, bias=False),
            nn.BatchNorm2d(ngf * 8),
            nn.ReLU(True),
            nn.ConvTranspose2d(ngf * 8, nc, 4, 2, 1, bias=False),
            nn.Tanh()
        )
    def forward(self, x):
        return self.main(x)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Generative Adversarial Network (GAN)** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    3,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Diffusion Model',
    'bab-4-diffusion-model',
    '# BAB 4: Diffusion Model

Proses difusi maju (Forward Markov Chain) & mundur (Reverse Denoising), Denoising Diffusion Probabilistic Model (DDPM), dan Latent Diffusion (Stable Diffusion).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Diffusion Model dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# forward_diffusion_noise.py
import torch

def add_noise_forward_diffusion(x_0, t, alpha_cumprod):
    # Menambahkan noise gaussian pada citra x_0 pada timestep t
    noise = torch.randn_like(x_0)
    sqrt_alpha = torch.sqrt(alpha_cumprod[t])
    sqrt_one_minus_alpha = torch.sqrt(1.0 - alpha_cumprod[t])
    return sqrt_alpha * x_0 + sqrt_one_minus_alpha * noise, noise
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Diffusion Model** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    4,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Consistency Model & Percepatan Sampling',
    'bab-5-consistency-model-percepatan-sampling',
    '# BAB 5: Consistency Model & Percepatan Sampling

Akselerasi inferensi model difusi: Consistency Models, Distilled Diffusion (LCM - Latent Consistency Models), dan sampling 1-4 step.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Consistency Model & Percepatan Sampling dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# consistency_sampling_steps.py
print("Evolusi Waktu Sampling Difusi:")
print("- DDPM Standar      : 1000 sampling steps")
print("- DDIM / DPM-Solver : 25 - 50 sampling steps")
print("- Latent Consistency: 2 - 4 sampling steps (Real-time generation!)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Consistency Model & Percepatan Sampling** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    5,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Text-to-Image Generation',
    'bab-6-text-to-image-generation',
    '# BAB 6: Text-to-Image Generation

Sintesis gambar dari teks (DALL-E, Midjourney, Stable Diffusion XL), teknik Prompt Engineering visual, dan kontrol spasial dengan ControlNet.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Text-to-Image Generation dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# prompt_controlnet_pipeline.py
print("Pipeline Text-to-Image Modern:")
print("1. Text Conditioning: Text Encoder (CLIP/T5) mengubah prompt ke vektor embedding")
print("2. Spatial Conditioning: ControlNet menginjeksi panduan pose/canny edge")
print("3. Latent Denoising: UNet / Diffusion Transformer (DiT) membersihkan laten")
print("4. VAE Decoder: Merekonstruksi matriks piksel RGB resolusi tinggi")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Text-to-Image Generation** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    6,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Text-to-Video Generation & World Model',
    'bab-7-text-to-video-generation-world-model',
    '# BAB 7: Text-to-Video Generation & World Model

Generasi video (Sora, Runway Gen-3, Pika), konsistensi koherensi temporal, 3D Spatio-Temporal Patches, dan konsep World Model simulasi fisika.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Text-to-Video Generation & World Model dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# temporal_coherence_check.py
def evaluate_temporal_consistency(frame_t, frame_t_next):
    # Evaluasi perbedaan flow optik antar frame agar video tidak flicker
    return "Konsistensi Temporal: Stabil (Motion Flow terhubung mulus)"

print(evaluate_temporal_consistency(None, None))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Text-to-Video Generation & World Model** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Video',
    7,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Text-to-3D & Avatar Generation',
    'bab-8-text-to-3d-avatar-generation',
    '# BAB 8: Text-to-3D & Avatar Generation

Sintesis aset 3D (Point-E, Shap-E, Gaussian Splatting), representasi Neural Avatar, dan pembuatan aset digital untuk game serta metaverse.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Text-to-3D & Avatar Generation dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# text_to_3d_nerf_guidance.py
print("Score Distillation Sampling (SDS) untuk Text-to-3D:")
print("Menggunakan model difusi 2D sebagai ''pemandu'' gradien loss")
print("untuk mengoptimalkan representasi 3D NeRF atau Gaussian Splatting.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Text-to-3D & Avatar Generation** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Video',
    8,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Generative Model untuk Teks',
    'bab-9-generative-model-untuk-teks',
    '# BAB 9: Generative Model untuk Teks

Model bahasa generatif Autoregressive (GPT), strategi sampling decoding: Greedy, Temperature, Top-K, Top-P (Nucleus Sampling), dan Repetition Penalty.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Generative Model untuk Teks dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# text_sampling_strategies.py
import torch
import torch.nn.functional as F

def sample_with_temperature_and_top_p(logits, temperature=0.7, top_p=0.9):
    logits = logits / temperature
    probs = F.softmax(logits, dim=-1)
    sorted_probs, indices = torch.sort(probs, descending=True)
    cumulative_probs = torch.cumsum(sorted_probs, dim=-1)
    # Masking token di luar ambang batas top_p
    mask = cumulative_probs > top_p
    mask[..., 1:] = mask[..., :-1].clone()
    mask[..., 0] = False
    sorted_probs[mask] = 0.0
    return torch.multinomial(sorted_probs / sorted_probs.sum(), num_samples=1)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Generative Model untuk Teks** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    9,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Generative Model untuk Audio & Musik',
    'bab-10-generative-model-untuk-audio-musik',
    '# BAB 10: Generative Model untuk Audio & Musik

Sintesis suara dan audio: Text-to-Speech berbasis neural (VITS, ElevenLabs), voice cloning, dan text-to-music generation (MusicLM, Suno).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Generative Model untuk Audio & Musik dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# neural_tts_audio_synthesis.py
print("Pipeline Neural Audio Synthesis:")
print("Teks Prompt -> Phonemizer -> Acoustic Model (Spectrogram Laten) -> Neural Vocoder (HiFi-GAN) -> Gelombang Audio (.wav)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Generative Model untuk Audio & Musik** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Mic',
    10,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Editing Kreatif dengan Generative AI',
    'bab-11-editing-kreatif-dengan-generative-ai',
    '# BAB 11: Editing Kreatif dengan Generative AI

Teknik manipulasi gambar: Inpainting (mengisi area hilang), Outpainting (memperluas kanvas gambar), Style Transfer, dan Object Removal cerdas.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Editing Kreatif dengan Generative AI dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# image_inpainting_mask.py
def apply_inpainting_mask(image, mask, generated_fill):
    # Gabungkan area luar mask asli dengan konten baru hasil generasi
    result = image * (1 - mask) + generated_fill * mask
    return result

print("Operasi inpainting menggantikan objek target secara mulus.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Editing Kreatif dengan Generative AI** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    11,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Evaluasi Generative AI',
    'bab-12-evaluasi-generative-ai',
    '# BAB 12: Evaluasi Generative AI

Metrik evaluasi kuantitatif & kualitatif: Fréchet Inception Distance (FID), Inception Score (IS), CLIP Score untuk keselarasan prompt, dan uji preferensi manusia.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Evaluasi Generative AI dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# frechet_inception_distance.py
import numpy as np

def calculate_fid_simple(mu1, sigma1, mu2, sigma2):
    # Jarak Fréchet antar dua distribusi Gaussian multivariate
    diff = mu1 - mu2
    covmean = np.sqrt(sigma1 * sigma2)
    fid = np.sum(diff**2) + (sigma1 + sigma2 - 2 * covmean)
    return fid

print("Skor FID Sampel:", round(calculate_fid_simple(0.5, 1.2, 0.4, 1.1), 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Evaluasi Generative AI** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
    12,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: Etika & Tantangan Generative AI',
    'bab-13-etika-tantangan-generative-ai',
    '# BAB 13: Etika & Tantangan Generative AI

Bahaya deepfake & disinformasi massal, hak cipta konten AI (Copyright/Fair Use), watermark tak terlihat (SynthID), dan mitigasi halusinasi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 13: Etika & Tantangan Generative AI dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# digital_watermark_check.py
def detect_invisible_watermark(content_payload):
    has_watermark = True # Simulasi verifikasi metadata kriptografis
    return "Status Konten: Terverifikasi Sintetik AI (Watermarked by SynthID)" if has_watermark else "Konten Tidak Terverifikasi"
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 13: Etika & Tantangan Generative AI** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    13,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 14: Aplikasi Generative AI di Industri',
    'bab-14-aplikasi-generative-ai-di-industri',
    '# BAB 14: Aplikasi Generative AI di Industri

Implementasi bisnis: Personalisasi desain periklanan, otomatisasi pembuatan konten game, sintesis kode perangkat lunak, dan riset desain molekuler obat.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 14: Aplikasi Generative AI di Industri dalam domain Generative AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# enterprise_genai_solutions.py
def genai_enterprise_ecosystem():
    use_cases = [
        "E-Commerce: Pembuatan katalog produk fotorealistik 3D tanpa sesi foto fisik",
        "Farmasi: Generasi struktur molekul baru untuk uji kandidat obat",
        "Software: AI Copilot auto-completion kode dan perbaikan bug otomatis",
        "Media: Personalisasi narasi konten interaktif waktu nyata"
    ]
    for uc in use_cases: print("->", uc)

genai_enterprise_ecosystem()
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 14: Aplikasi Generative AI di Industri** merupakan pilar fundamental dalam spesialisasi Generative AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    14,
    v_cat_genai,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

END $$;
