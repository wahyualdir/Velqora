-- ============================================================
-- Migration 014: Seed AI Curriculum Notes (Batch 2 - 5 Topik)
-- Topik:
-- 1. AutoML & Neural Architecture Search (10 Bab)
-- 2. Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence) (10 Bab)
-- 3. Computer Vision (14 Bab)
-- 4. Data Analyst (14 Bab)
-- 5. Data Engineering & Big Data untuk AI (12 Bab)
-- Total: 60 Bab Catatan Lengkap Kurikulum & Praktikum AI
-- ============================================================

ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;

DO $$
DECLARE
  v_user_id UUID;
  v_parent_ai_id UUID;
  v_cat_automl UUID;
  v_cat_ci UUID;
  v_cat_cv UUID;
  v_cat_da UUID;
  v_cat_de UUID;
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

  -- Kategori: AutoML & Neural Architecture Search
  SELECT id INTO v_cat_automl FROM categories WHERE name = 'AutoML & Neural Architecture Search' LIMIT 1;
  IF v_cat_automl IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('AutoML & Neural Architecture Search') || ', ''#EC4899'', ''automl'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_automl;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('AutoML & Neural Architecture Search') || ', ''#EC4899'', ''automl'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_automl;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('AutoML & Neural Architecture Search', '#EC4899', v_user_id) RETURNING id INTO v_cat_automl;
    END IF;
  END IF;

  -- Kategori: Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence)
  SELECT id INTO v_cat_ci FROM categories WHERE name = 'Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence)' LIMIT 1;
  IF v_cat_ci IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence)') || ', ''#10B981'', ''computational_intelligence'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_ci;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence)') || ', ''#10B981'', ''computational_intelligence'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_ci;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence)', '#10B981', v_user_id) RETURNING id INTO v_cat_ci;
    END IF;
  END IF;

  -- Kategori: Computer Vision
  SELECT id INTO v_cat_cv FROM categories WHERE name = 'Computer Vision' LIMIT 1;
  IF v_cat_cv IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Computer Vision') || ', ''#3B82F6'', ''computer_vision'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_cv;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Computer Vision') || ', ''#3B82F6'', ''computer_vision'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_cv;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Computer Vision', '#3B82F6', v_user_id) RETURNING id INTO v_cat_cv;
    END IF;
  END IF;

  -- Kategori: Data Analyst
  SELECT id INTO v_cat_da FROM categories WHERE name = 'Data Analyst' LIMIT 1;
  IF v_cat_da IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Data Analyst') || ', ''#06B6D4'', ''data_analyst'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_da;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Data Analyst') || ', ''#06B6D4'', ''data_analyst'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_da;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Data Analyst', '#06B6D4', v_user_id) RETURNING id INTO v_cat_da;
    END IF;
  END IF;

  -- Kategori: Data Engineering & Big Data untuk AI
  SELECT id INTO v_cat_de FROM categories WHERE name = 'Data Engineering & Big Data untuk AI' LIMIT 1;
  IF v_cat_de IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Data Engineering & Big Data untuk AI') || ', ''#F59E0B'', ''data_engineering'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_de;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Data Engineering & Big Data untuk AI') || ', ''#F59E0B'', ''data_engineering'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_de;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Data Engineering & Big Data untuk AI', '#F59E0B', v_user_id) RETURNING id INTO v_cat_de;
    END IF;
  END IF;

  -- ------------------------------------------------------------
  -- BAGIAN 1: AUTOML & NEURAL ARCHITECTURE SEARCH (10 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar AutoML',
    'bab-1-konsep-dasar-automl',
    '# BAB 1: Konsep Dasar AutoML

Definisi, tujuan otomasi machine learning, siklus kerja end-to-end, dan komponen inti AutoML pipeline.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar AutoML dalam domain AutoML & Neural Architecture Search.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# automl_pipeline_concept.py
class SimpleAutoMLPipeline:
    def __init__(self, models):
        self.models = models
        self.best_model = None
        self.best_score = -float(''inf'')

    def fit(self, X_train, y_train, X_val, y_val, metric_fn):
        for name, model in self.models.items():
            model.fit(X_train, y_train)
            score = metric_fn(y_val, model.predict(X_val))
            print(f"[AutoML] Evaluasi model {name}: Score = {score:.4f}")
            if score > self.best_score:
                self.best_score = score
                self.best_model = model
        print(f"--> Pemenang Model Terbaik: {type(self.best_model).__name__} ({self.best_score:.4f})")
        return self.best_model
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar AutoML** merupakan pilar fundamental dalam spesialisasi AutoML & Neural Architecture Search.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    1,
    v_cat_automl,
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
    'BAB 2: Automated Data Preparation',
    'bab-2-automated-data-preparation',
    '# BAB 2: Automated Data Preparation

Automated data cleaning, imputasi cerdas, deteksi anomali otomatis, dan automated data labeling.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Automated Data Preparation dalam domain AutoML & Neural Architecture Search.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# automated_data_prep.py
import pandas as pd
import numpy as np

def automated_data_cleaner(df):
    df_clean = df.copy()
    # 1. Otomasi imputasi nilai hilang berdasarkan tipe data
    for col in df_clean.columns:
        if df_clean[col].isnull().sum() > 0:
            if np.issubdtype(df_clean[col].dtype, np.number):
                df_clean[col] = df_clean[col].fillna(df_clean[col].median())
            else:
                df_clean[col] = df_clean[col].fillna(df_clean[col].mode()[0])
    # 2. Otomasi deteksi duplikasi baris
    df_clean = df_clean.drop_duplicates()
    return df_clean

data = pd.DataFrame({''umur'': [25, np.nan, 30, 25], ''status'': [''aktif'', ''aktif'', np.nan, ''aktif'']})
print("Data Bersih:\n", automated_data_cleaner(data))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Automated Data Preparation** merupakan pilar fundamental dalam spesialisasi AutoML & Neural Architecture Search.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    2,
    v_cat_automl,
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
    'BAB 3: Automated Feature Engineering',
    'bab-3-automated-feature-engineering',
    '# BAB 3: Automated Feature Engineering

Feature selection otomatis, ranking dependensi mutual information, dan automated feature generation via transformasi polinomial.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Automated Feature Engineering dalam domain AutoML & Neural Architecture Search.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# auto_feature_engineering.py
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.preprocessing import PolynomialFeatures
import numpy as np

X = np.array([[1, 2], [3, 4], [5, 6], [7, 8]])
y = np.array([0, 0, 1, 1])

# 1. Feature Generation Otomatis
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)

# 2. Feature Selection Otomatis (Pilih K fitur terbaik)
selector = SelectKBest(score_func=f_classif, k=3)
X_selected = selector.fit_transform(X_poly, y)
print(f"Dimensi Awal: {X.shape[1]} -> Polinomial: {X_poly.shape[1]} -> Terpilih: {X_selected.shape[1]}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Automated Feature Engineering** merupakan pilar fundamental dalam spesialisasi AutoML & Neural Architecture Search.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    3,
    v_cat_automl,
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
    'BAB 4: Hyperparameter Optimization',
    'bab-4-hyperparameter-optimization',
    '# BAB 4: Hyperparameter Optimization

Metode pencarian hyperparameter: Grid Search, Random Search, Bayesian Optimization (TPE), dan Hyperband bandit-based pruning.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Hyperparameter Optimization dalam domain AutoML & Neural Architecture Search.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# bayesian_opt_optuna.py
def objective_dummy(trial):
    # Simulasi Bayesian Optimization ruang parameter
    lr = trial.suggest_float("learning_rate", 1e-4, 1e-1, log=True)
    depth = trial.suggest_int("max_depth", 3, 10)
    # Fungsi penalti simulasi (ingin meminimalkan loss)
    simulated_loss = (lr - 0.01)**2 + (depth - 5)**2
    return simulated_loss

print("Konsep Bayesian Optimization: Membangun model probabilistik (Gaussian Process/TPE)")
print("untuk memilih kombinasi hyperparameter berikutnya yang paling menjanjikan.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Hyperparameter Optimization** merupakan pilar fundamental dalam spesialisasi AutoML & Neural Architecture Search.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sliders',
    4,
    v_cat_automl,
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
    'BAB 5: Neural Architecture Search (NAS)',
    'bab-5-neural-architecture-search-nas',
    '# BAB 5: Neural Architecture Search (NAS)

Konsep dasar NAS, Search Space sel vs makro, strategi pencarian Reinforcement Learning, dan Differentiable NAS (DARTS).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Neural Architecture Search (NAS) dalam domain AutoML & Neural Architecture Search.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# darts_cell_concept.py
import torch
import torch.nn as nn
import torch.nn.functional as F

class DartsMixedOp(nn.Module):
    """Konsep Differentiable Architecture Search: Relaksasi continuous operasi"""
    def __init__(self, in_features, out_features):
        super().__init__()
        self.ops = nn.ModuleList([
            nn.Linear(in_features, out_features),
            nn.Sequential(nn.Linear(in_features, out_features), nn.ReLU()),
            nn.Identity() if in_features == out_features else nn.Linear(in_features, out_features)
        ])
        self.alpha_arch = nn.Parameter(torch.zeros(len(self.ops)))

    def forward(self, x):
        weights = F.softmax(self.alpha_arch, dim=0)
        return sum(w * op(x) for w, op in zip(weights, self.ops))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Neural Architecture Search (NAS)** merupakan pilar fundamental dalam spesialisasi AutoML & Neural Architecture Search.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sliders',
    5,
    v_cat_automl,
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
    'BAB 6: Meta-Learning untuk AutoML',
    'bab-6-meta-learning-untuk-automl',
    '# BAB 6: Meta-Learning untuk AutoML

Paradigma Learning to Learn, Transfer Learning antar-dataset (Warm Starting), dan Model-Agnostic Meta-Learning (MAML).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Meta-Learning untuk AutoML dalam domain AutoML & Neural Architecture Search.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# meta_learning_maml.py
# Konsep MAML (Model-Agnostic Meta-Learning)
def maml_inner_outer_loop(model, tasks, inner_lr=0.01, outer_lr=0.001):
    meta_gradients = []
    for task in tasks:
        # 1. Inner Loop: Adaptasi cepat pada support set beberapa sampel (k-shot)
        fast_weights = model.adapt(task.support_set, lr=inner_lr)
        # 2. Outer Loop: Evaluasi performa adaptasi pada query set
        task_loss = model.evaluate(fast_weights, task.query_set)
        meta_gradients.append(task_loss.grad)
    # 3. Meta-Update bobot inisialisasi dasar
    model.update_meta_weights(meta_gradients, lr=outer_lr)
    return "Bobot inisialisasi meta berhasil diperbarui."
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Meta-Learning untuk AutoML** merupakan pilar fundamental dalam spesialisasi AutoML & Neural Architecture Search.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    6,
    v_cat_automl,
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
    'BAB 7: AutoML untuk Deep Learning & LLM',
    'bab-7-automl-untuk-deep-learning-llm',
    '# BAB 7: AutoML untuk Deep Learning & LLM

Automated Deep Learning (AutoDL), Automated Model Selection untuk LLM, dan Automated Prompt Optimization (DSPy & OPRO).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: AutoML untuk Deep Learning & LLM dalam domain AutoML & Neural Architecture Search.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# auto_prompt_optimization.py
class PromptOptimizer:
    def __init__(self, eval_metric):
        self.metric = eval_metric
        self.best_prompt = None

    def optimize(self, candidates, validation_data):
        best_acc = 0.0
        for p in candidates:
            score = self.metric(p, validation_data)
            print(f"Prompt: ''{p}'' -> Akurasi: {score:.2%}")
            if score > best_acc:
                best_acc = score
                self.best_prompt = p
        return self.best_prompt, best_acc

candidates = ["Jawab singkat:", "Berikan analisis komprehensif:", "Pikirkan langkah demi langkah:"]
print("Prompt Terpilih:", candidates[2])
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: AutoML untuk Deep Learning & LLM** merupakan pilar fundamental dalam spesialisasi AutoML & Neural Architecture Search.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    7,
    v_cat_automl,
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
    'BAB 8: Tools & Platform AutoML',
    'bab-8-tools-platform-automl',
    '# BAB 8: Tools & Platform AutoML

Eksplorasi ekosistem tools AutoML modern: Auto-sklearn, FLAML, TPOT, Google Vertex AI AutoML, dan H2O AutoML.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Tools & Platform AutoML dalam domain AutoML & Neural Architecture Search.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# auto_sklearn_demo.py
# Contoh integrasi pipeline AutoML berbasis FLAML / Auto-sklearn
# from flaml import AutoML
# automl = AutoML()
# automl.fit(X_train, y_train, task="classification", time_budget=60)
# print("Model Pilihan:", automl.best_estimator)

class H2OAutoMLSimulator:
    def train(self, data, time_budget=30):
        leaderboard = [
            {"model_id": "StackedEnsemble_AllModels", "auc": 0.942},
            {"model_id": "XGBoost_1", "auc": 0.938},
            {"model_id": "GBM_grid_1", "auc": 0.925}
        ]
        return leaderboard

leader = H2OAutoMLSimulator().train(None)
print("Top Leaderboard Model AutoML:", leader[0])
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Tools & Platform AutoML** merupakan pilar fundamental dalam spesialisasi AutoML & Neural Architecture Search.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Wrench',
    8,
    v_cat_automl,
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
    'BAB 9: Evaluasi & Efisiensi AutoML',
    'bab-9-evaluasi-efisiensi-automl',
    '# BAB 9: Evaluasi & Efisiensi AutoML

Trade-off waktu komputasi vs performa akurasi, early stopping, dan Multi-Objective Optimization (Pareto Frontier untuk Akurasi vs Latensi).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Evaluasi & Efisiensi AutoML dalam domain AutoML & Neural Architecture Search.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# pareto_frontier_eval.py
import numpy as np

def calculate_pareto_frontier(latency_ms, accuracy):
    """Menemukan model yang berada di kurva Pareto (efisiensi optimal)"""
    pareto_indices = []
    for i in range(len(latency_ms)):
        is_pareto = True
        for j in range(len(latency_ms)):
            if latency_ms[j] <= latency_ms[i] and accuracy[j] >= accuracy[i] and (latency_ms[j] < latency_ms[i] or accuracy[j] > accuracy[i]):
                is_pareto = False
                break
        if is_pareto:
            pareto_indices.append(i)
    return pareto_indices

models = ["Model A", "Model B", "Model C", "Model D"]
lat = [15, 30, 8, 45]
acc = [0.89, 0.93, 0.82, 0.94]
p_idx = calculate_pareto_frontier(lat, acc)
print("Model Terbaik di Garis Pareto:", [models[i] for i in p_idx])
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Evaluasi & Efisiensi AutoML** merupakan pilar fundamental dalam spesialisasi AutoML & Neural Architecture Search.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    9,
    v_cat_automl,
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
    'BAB 10: Aplikasi AutoML',
    'bab-10-aplikasi-automl',
    '# BAB 10: Aplikasi AutoML

Automasi pipeline data science di industri perbankan, e-commerce, dan pemberdayaan Citizen Data Scientist.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Aplikasi AutoML dalam domain AutoML & Neural Architecture Search.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# automl_business_app.py
def business_automl_pipeline(churn_dataset):
    print("1. [Ingestion] Mengambil data transaksi dan log interaksi pelanggan")
    print("2. [Feature Eng] Otomasi agregasi RFM dan windowing time-series")
    print("3. [AutoML Search] Menemukan konfigurasi ensemble LightGBM + CatBoost")
    print("4. [Explainability] Otomasi pembuatan SHAP summary plot untuk tim bisnis")
    print("5. [Export] Serialisasi model ke format ONNX untuk inferensi real-time")
    return {"status": "deployed", "business_impact": "Deteksi churn 24% lebih awal"}

result = business_automl_pipeline(None)
print("Status Pipeline Bisnis:", result)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Aplikasi AutoML** merupakan pilar fundamental dalam spesialisasi AutoML & Neural Architecture Search.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Rocket',
    10,
    v_cat_automl,
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
  -- BAGIAN 2: COMPUTATIONAL INTELLIGENCE (10 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar Computational Intelligence',
    'bab-1-konsep-dasar-computational-intelligence',
    '# BAB 1: Konsep Dasar Computational Intelligence

Definisi Soft Computing vs Hard Computing, toleransi ketidakpastian, dan cabang-cabang utama Computational Intelligence.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar Computational Intelligence dalam domain Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# ci_vs_symbolic_ai.py
# Perbedaan Paradigma: Hard AI (Exact Logic) vs Soft Computing (Toleran Ketidakpastian)
def hard_boolean_logic(suhu):
    return "PANAS" if suhu > 30.0 else "DINGIN"

def soft_fuzzy_membership(suhu):
    # Derajat keanggotaan kontinu antara 0.0 sampai 1.0
    if suhu <= 20: return {"dingin": 1.0, "panas": 0.0}
    elif suhu >= 35: return {"dingin": 0.0, "panas": 1.0}
    else:
        u_panas = (suhu - 20) / (35 - 20)
        return {"dingin": round(1.0 - u_panas, 2), "panas": round(u_panas, 2)}

print("Logika Kaku:", hard_boolean_logic(29.9))
print("Soft Computing (Fuzzy):", soft_fuzzy_membership(29.9))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar Computational Intelligence** merupakan pilar fundamental dalam spesialisasi Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    1,
    v_cat_ci,
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
    'BAB 2: Fuzzy Logic',
    'bab-2-fuzzy-logic',
    '# BAB 2: Fuzzy Logic

Himpunan fuzzy, fungsi keanggotaan (segitiga, trapesium), dan sistem inferensi fuzzy (Mamdani & Sugeno).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Fuzzy Logic dalam domain Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# mamdani_fuzzy_inference.py
def triangular_mf(x, a, b, c):
    if x <= a or x >= c: return 0.0
    elif a < x <= b: return (x - a) / (b - a)
    else: return (c - x) / (c - b)

# Contoh inferensi sederhana: Kontrol Kecepatan Kipas berdasarkan Suhu
suhu_input = 28.0
u_hangat = triangular_mf(suhu_input, 20, 27, 34)
u_panas = triangular_mf(suhu_input, 26, 35, 45)

# Defuzzifikasi sederhana rata-rata berbobot
kecepatan_kipas = (u_hangat * 50 + u_panas * 100) / (u_hangat + u_panas + 1e-6)
print(f"Suhu {suhu_input}°C -> Kecepatan Kipas Target: {kecepatan_kipas:.1f}%")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Fuzzy Logic** merupakan pilar fundamental dalam spesialisasi Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    2,
    v_cat_ci,
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
    'BAB 3: Algoritma Genetika (Genetic Algorithm)',
    'bab-3-algoritma-genetika-genetic-algorithm',
    '# BAB 3: Algoritma Genetika (Genetic Algorithm)

Konsep populasi, kromosom biner/real, fitness function, seleksi (Roulette Wheel, Tournament), crossover, dan mutasi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Algoritma Genetika (Genetic Algorithm) dalam domain Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# genetic_algorithm_basic.py
import random

def fitness(chromosome):
    # Masalah OneMax: Memaksimalkan jumlah angka 1
    return sum(chromosome)

def crossover(parent1, parent2):
    point = random.randint(1, len(parent1) - 1)
    return parent1[:point] + parent2[point:]

def mutate(chromosome, rate=0.05):
    return [1 - bit if random.random() < rate else bit for bit in chromosome]

# Populasi awal
population = [[random.randint(0, 1) for _ in range(10)] for _ in range(6)]
best = max(population, key=fitness)
print(f"Kromosom Terbaik Awal: {best} (Fitness: {fitness(best)})")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Algoritma Genetika (Genetic Algorithm)** merupakan pilar fundamental dalam spesialisasi Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    3,
    v_cat_ci,
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
    'BAB 4: Evolutionary Computation Lanjutan',
    'bab-4-evolutionary-computation-lanjutan',
    '# BAB 4: Evolutionary Computation Lanjutan

Evolution Strategy (ES), Genetic Programming (GP sintesis pohon sintaks), dan Differential Evolution (DE) untuk optimasi kontinu.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Evolutionary Computation Lanjutan dalam domain Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# differential_evolution_step.py
import numpy as np

def de_mutation(population, F=0.8):
    # Vektor donor: v = x_r1 + F * (x_r2 - x_r3)
    idx = np.random.choice(len(population), 3, replace=False)
    x1, x2, x3 = population[idx[0]], population[idx[1]], population[idx[2]]
    mutant = x1 + F * (x2 - x3)
    return mutant

pop = np.array([[1.0, 2.0], [3.0, 1.5], [2.0, 4.0], [0.5, 3.0]])
print("Vektor Mutan DE:", de_mutation(pop))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Evolutionary Computation Lanjutan** merupakan pilar fundamental dalam spesialisasi Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    4,
    v_cat_ci,
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
    'BAB 5: Swarm Intelligence',
    'bab-5-swarm-intelligence',
    '# BAB 5: Swarm Intelligence

Perilaku kolektif organisme sosial: Particle Swarm Optimization (PSO), Ant Colony Optimization (ACO), dan Artificial Bee Colony (ABC).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Swarm Intelligence dalam domain Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# particle_swarm_optimization.py
import numpy as np

class Particle:
    def __init__(self, dim):
        self.pos = np.random.uniform(-5, 5, dim)
        self.vel = np.random.uniform(-1, 1, dim)
        self.best_pos = self.pos.copy()
        self.best_score = float(''inf'')

def sphere_loss(x): return np.sum(x**2)

p = Particle(2)
score = sphere_loss(p.pos)
p.best_score = score
print(f"Partikel Posisi: {p.pos}, Nilai Fungsi: {score:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Swarm Intelligence** merupakan pilar fundamental dalam spesialisasi Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    5,
    v_cat_ci,
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
    'BAB 6: Artificial Immune System',
    'bab-6-artificial-immune-system',
    '# BAB 6: Artificial Immune System

Prinsip sistem imun biologis (antibodi, antigen), seleksi klonal (Clonal Selection), dan Algoritma Negative Selection untuk deteksi anomali.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Artificial Immune System dalam domain Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# negative_selection_anomaly.py
class NegativeSelectionDetector:
    def __init__(self, normal_samples, threshold=1.0):
        self.normal = normal_samples
        self.threshold = threshold

    def is_anomaly(self, sample):
        # Jika sampel berbeda dari semua data normal di atas threshold
        min_dist = min([abs(sample - n) for n in self.normal])
        return min_dist > self.threshold

detector = NegativeSelectionDetector([10.0, 10.5, 9.8, 10.2])
print("Uji 10.1 (Normal):", "Anomali" if detector.is_anomaly(10.1) else "Normal")
print("Uji 14.5 (Outlier):", "Anomali" if detector.is_anomaly(14.5) else "Normal")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Artificial Immune System** merupakan pilar fundamental dalam spesialisasi Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    6,
    v_cat_ci,
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
    'BAB 7: Hybrid Computational Intelligence',
    'bab-7-hybrid-computational-intelligence',
    '# BAB 7: Hybrid Computational Intelligence

Integrasi arsitektur hibrida: Adaptive Neuro-Fuzzy Inference System (ANFIS) dan Neuro-Evolution (NEAT) untuk optimasi topologi neural.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Hybrid Computational Intelligence dalam domain Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# anfis_hybrid_architecture.py
print("Arsitektur ANFIS (Adaptive Neuro-Fuzzy Inference System):")
print("Layer 1: Fuzzifikasi input ke derajat keanggotaan")
print("Layer 2: Evaluasi bobot firing rule (T-Norm Product)")
print("Layer 3: Normalisasi firing strength")
print("Layer 4: Konsekuen polinomial orde-satu (Takagi-Sugeno)")
print("Layer 5: Output agregasi defuzzifikasi keseluruhan")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Hybrid Computational Intelligence** merupakan pilar fundamental dalam spesialisasi Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    7,
    v_cat_ci,
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
    'BAB 8: Optimasi Metaheuristik Lainnya',
    'bab-8-optimasi-metaheuristik-lainnya',
    '# BAB 8: Optimasi Metaheuristik Lainnya

Algoritma Simulated Annealing berbasis pendinginan termodinamika dan Tabu Search dengan memori jangka pendek untuk keluar dari lokal optimum.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Optimasi Metaheuristik Lainnya dalam domain Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# simulated_annealing.py
import math, random

def simulated_annealing(cost_fn, init_state, temp=100.0, cooling=0.95):
    current = init_state
    best = current
    while temp > 1.0:
        neighbor = current + random.uniform(-1, 1)
        delta = cost_fn(neighbor) - cost_fn(current)
        # Terima jika lebih baik, atau terima dengan probabilitas Boltzmann jika lebih buruk
        if delta < 0 or random.random() < math.exp(-delta / temp):
            current = neighbor
            if cost_fn(current) < cost_fn(best):
                best = current
        temp *= cooling
    return best

f = lambda x: (x - 3)**2 + 2
print("Solusi Minimum Terpilih:", round(simulated_annealing(f, 10.0), 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Optimasi Metaheuristik Lainnya** merupakan pilar fundamental dalam spesialisasi Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sliders',
    8,
    v_cat_ci,
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
    'BAB 9: Computational Intelligence untuk Optimasi Modern',
    'bab-9-computational-intelligence-untuk-optimasi-modern',
    '# BAB 9: Computational Intelligence untuk Optimasi Modern

Penerapan algoritma metaheuristik untuk hyperparameter tuning model Machine Learning, penyeimbangan beban, dan arsitektur pruning.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Computational Intelligence untuk Optimasi Modern dalam domain Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# ga_hyperparameter_tuning.py
# Contoh integrasi GA untuk pemilihan subset fitur data tabular
def evaluate_feature_subset(mask, X, y):
    selected_cols = [i for i, bit in enumerate(mask) if bit == 1]
    if not selected_cols: return 0.0
    # Simulasi evaluasi akurasi cross-validation
    return len(selected_cols) * 0.15 # Skor penalti kompleksitas

mask_contoh = [1, 0, 1, 1, 0, 1]
print("Fitness Subset Fitur:", evaluate_feature_subset(mask_contoh, None, None))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Computational Intelligence untuk Optimasi Modern** merupakan pilar fundamental dalam spesialisasi Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sliders',
    9,
    v_cat_ci,
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
    'BAB 10: Aplikasi Computational Intelligence',
    'bab-10-aplikasi-computational-intelligence',
    '# BAB 10: Aplikasi Computational Intelligence

Studi kasus industri: optimasi sistem kontrol robotik, penjadwalan otomatis (Job Shop), dan optimasi rute logistik multi-kendaraan (VRP).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Aplikasi Computational Intelligence dalam domain Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# vrp_tsp_routing.py
def tsp_nearest_neighbor(distance_matrix):
    n = len(distance_matrix)
    visited = [0]
    while len(visited) < n:
        curr = visited[-1]
        next_city = min([c for c in range(n) if c not in visited], key=lambda c: distance_matrix[curr][c])
        visited.append(next_city)
    visited.append(0) # Kembali ke depo
    return visited

dist = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
]
print("Rute Logistik Terpilih:", tsp_nearest_neighbor(dist))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Aplikasi Computational Intelligence** merupakan pilar fundamental dalam spesialisasi Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Rocket',
    10,
    v_cat_ci,
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
  -- BAGIAN 3: COMPUTER VISION (14 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Dasar Computer Vision',
    'bab-1-dasar-computer-vision',
    '# BAB 1: Dasar Computer Vision

Representasi citra digital sebagai matriks piksel, ruang warna (RGB, HSV, Grayscale), dan operasi morfologi dasar.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Dasar Computer Vision dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# image_representation.py
import numpy as np

# Citra grayscale resolusi 4x4 sebagai array 2D integer 0-255
citra_gray = np.array([
    [50,  120, 200, 255],
    [40,  110, 190, 240],
    [20,   80, 160, 220],
    [10,   50, 120, 180]
], dtype=np.uint8)

# Operasi Binarization (Thresholding sederhana)
threshold = 128
citra_biner = (citra_gray > threshold).astype(np.uint8) * 255
print("Citra Biner:\n", citra_biner)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Dasar Computer Vision** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    1,
    v_cat_cv,
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
    'BAB 2: Ekstraksi Fitur Citra Klasik',
    'bab-2-ekstraksi-fitur-citra-klasik',
    '# BAB 2: Ekstraksi Fitur Citra Klasik

Edge Detection (Sobel, Canny), Corner Detection (Harris), Scale-Invariant Feature Transform (SIFT), dan Histogram of Oriented Gradients (HOG).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Ekstraksi Fitur Citra Klasik dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# canny_sobel_edges.py
import numpy as np

def sobel_horizontal_kernel():
    return np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])

def sobel_vertical_kernel():
    return np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])

print("Sobel Horizontal (Deteksi Tepi Horizontal):\n", sobel_horizontal_kernel())
print("Sobel Vertical (Deteksi Tepi Vertikal):\n", sobel_vertical_kernel())
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Ekstraksi Fitur Citra Klasik** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    2,
    v_cat_cv,
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
    'BAB 3: CNN untuk Vision',
    'bab-3-cnn-untuk-vision',
    '# BAB 3: CNN untuk Vision

Konsep konvolusi, pooling, feature maps, serta evolusi arsitektur CNN klasik (LeNet, AlexNet, VGG) hingga modern (ResNet, ConvNeXt).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: CNN untuk Vision dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# resnet_residual_block.py
import torch
import torch.nn as nn

class ResidualBlock(nn.Module):
    """Blok ResNet dengan Skip Connection untuk mengatasi Vanishing Gradient"""
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(channels)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(channels)

    def forward(self, x):
        identity = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += identity  # Skip Connection!
        return self.relu(out)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: CNN untuk Vision** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Layers',
    3,
    v_cat_cv,
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
    'BAB 4: Klasifikasi & Deteksi Objek',
    'bab-4-klasifikasi-deteksi-objek',
    '# BAB 4: Klasifikasi & Deteksi Objek

Image classification multi-kelas, paradigma Object Detection (Two-Stage: Faster R-CNN vs One-Stage: YOLO, SSD), dan Anchor-Free DETR.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Klasifikasi & Deteksi Objek dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# iou_nms_detector.py
def calculate_iou(boxA, boxB):
    # [x1, y1, x2, y2]
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    interArea = max(0, xB - xA) * max(0, yB - yA)
    boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
    return interArea / float(boxAArea + boxBArea - interArea)

b1 = [50, 50, 150, 150]
b2 = [70, 70, 160, 160]
print(f"Intersection over Union (IoU): {calculate_iou(b1, b2):.3f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Klasifikasi & Deteksi Objek** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    4,
    v_cat_cv,
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
    'BAB 5: Segmentasi Citra',
    'bab-5-segmentasi-citra',
    '# BAB 5: Segmentasi Citra

Semantic segmentation (per-piksel label), Instance segmentation (identifikasi objek unik), Panoptic segmentation, dan arsitektur U-Net.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Segmentasi Citra dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# unet_architecture_concept.py
import torch
import torch.nn as nn

class UNetContractingBlock(nn.Module):
    def __init__(self, in_c, out_c):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(in_c, out_c, 3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_c, out_c, 3, padding=1),
            nn.ReLU(inplace=True)
        )
        self.pool = nn.MaxPool2d(2)

    def forward(self, x):
        skip = self.conv(x)
        down = self.pool(skip)
        return down, skip

print("U-Net: Menyimpan representasi spasial resolusi tinggi melalui Skip Connections.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Segmentasi Citra** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    5,
    v_cat_cv,
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
    'BAB 6: Vision Transformer & Model Modern',
    'bab-6-vision-transformer-model-modern',
    '# BAB 6: Vision Transformer & Model Modern

Penerapan arsitektur Transformer pada citra (ViT), Patch Embedding, Positional Encoding 2D, Swin Transformer, dan Self-Supervised DINO.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Vision Transformer & Model Modern dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# vision_transformer_patching.py
import torch
import torch.nn as nn

def extract_image_patches(image_tensor, patch_size=16):
    # image_tensor: (B, C, H, W)
    B, C, H, W = image_tensor.shape
    patches = image_tensor.unfold(2, patch_size, patch_size).unfold(3, patch_size, patch_size)
    # Ubah format ke (B, Num_Patches, Patch_Dim)
    patches = patches.contiguous().view(B, C, -1, patch_size, patch_size)
    patches = patches.permute(0, 2, 1, 3, 4).contiguous().view(B, -1, C * patch_size * patch_size)
    return patches

dummy_img = torch.randn(1, 3, 224, 224)
p = extract_image_patches(dummy_img, 16)
print(f"Gambar 224x224 -> {p.shape[1]} Patches dengan dimensi {p.shape[2]}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Vision Transformer & Model Modern** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Layers',
    6,
    v_cat_cv,
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
    'BAB 7: Foundation Model untuk Vision',
    'bab-7-foundation-model-untuk-vision',
    '# BAB 7: Foundation Model untuk Vision

Segment Anything Model (SAM) berbasis promptable segmentation, zero-shot image-text alignment (CLIP), dan Vision Encoder untuk Multimodal LLM.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Foundation Model untuk Vision dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# clip_zero_shot_concept.py
# Konsep Zero-Shot Classification menggunakan CLIP
def zero_shot_classification_concept(image_features, text_embeddings):
    # Cosine similarity antara visual representation dan textual prompt
    logits = image_features @ text_embeddings.T
    probabilities = logits.softmax(dim=-1)
    return probabilities

print("Foundation Model: Model dilatih pada miliaran pasangan (gambar, teks)")
print("sehingga mampu mengenali konsep baru tanpa finetuning spesifik.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Foundation Model untuk Vision** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    7,
    v_cat_cv,
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
    'BAB 8: Video & Pengenalan Aksi',
    'bab-8-video-pengenalan-aksi',
    '# BAB 8: Video & Pengenalan Aksi

Dimensi temporal citra, Video Classification, Action Recognition (3D-CNN, TimeSformer), dan algoritma pelacakan objek (DeepSORT/ByteTrack).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Video & Pengenalan Aksi dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# video_optical_flow.py
print("Pemrosesan Video:")
print("1. Ekstraksi frame beruntun (T frame, BxCxTxHxW)")
print("2. Analisis pergerakan temporal menggunakan Optical Flow")
print("3. Multi-Object Tracking (MOT): Asosiasi bounding box via Kalman Filter & Hungarian Algorithm")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Video & Pengenalan Aksi** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Video',
    8,
    v_cat_cv,
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
    'BAB 9: 3D Computer Vision & Neural Rendering',
    'bab-9-3d-computer-vision-neural-rendering',
    '# BAB 9: 3D Computer Vision & Neural Rendering

Estimasi kedalaman (Depth Estimation), Point Cloud, Neural Radiance Fields (NeRF) sintesis novel view, dan 3D Gaussian Splatting.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: 3D Computer Vision & Neural Rendering dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# nerf_ray_casting.py
def compute_ray_direction(pixel_x, pixel_y, focal_length, camera_pose):
    # Arah sinar cahaya dari kamera ke ruang 3D dunia
    x = (pixel_x - 320) / focal_length
    y = -(pixel_y - 240) / focal_length
    ray_dir = [x, y, -1.0]
    return f"Sinar dari kamera: {ray_dir}"

print(compute_ray_direction(100, 150, 500, None))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: 3D Computer Vision & Neural Rendering** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    9,
    v_cat_cv,
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
    'BAB 10: Generative Vision',
    'bab-10-generative-vision',
    '# BAB 10: Generative Vision

Sintesis citra dengan GAN (Generator vs Discriminator), Denoising Diffusion Probabilistic Models (DDPM), dan Image Inpainting.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Generative Vision dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# diffusion_denoising_loop.py
def reverse_diffusion_step(noisy_latents, predicted_noise, alpha_t, beta_t):
    """Langkah tunggal denoise pada model difusi laten"""
    denoised = (noisy_latents - (beta_t / (1.0 - alpha_t)**0.5) * predicted_noise) / (alpha_t**0.5)
    return denoised

print("Generative Vision: Merekonstruksi citra bersih dari gaussian noise secara iteratif.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Generative Vision** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    10,
    v_cat_cv,
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
    'BAB 11: Evaluasi & Optimasi Computer Vision',
    'bab-11-evaluasi-optimasi-computer-vision',
    '# BAB 11: Evaluasi & Optimasi Computer Vision

Metrik evaluasi deteksi objek (Precision, Recall, mAP50, mAP50-95), optimasi model real-time (TensorRT), dan kompresi model (Pruning, INT8).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Evaluasi & Optimasi Computer Vision dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# evaluate_map_iou.py
def calculate_ap(precisions, recalls):
    # Menghitung Area Under Precision-Recall Curve (AUC-PR)
    precisions = [1.0] + precisions + [0.0]
    recalls = [0.0] + recalls + [1.0]
    ap = sum((recalls[i] - recalls[i-1]) * precisions[i] for i in range(1, len(recalls)))
    return round(ap, 4)

print("Average Precision (AP) Sampel:", calculate_ap([0.9, 0.85, 0.7], [0.3, 0.6, 0.9]))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Evaluasi & Optimasi Computer Vision** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sliders',
    11,
    v_cat_cv,
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
    'BAB 12: Deployment Computer Vision',
    'bab-12-deployment-computer-vision',
    '# BAB 12: Deployment Computer Vision

Deployment model visi di Edge Devices (Raspberry Pi, Jetson) vs Cloud Server, video streaming pipeline (RTSP/WebRTC), dan ONNX runtime.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Deployment Computer Vision dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# edge_inference_pipeline.py
class VisionEdgeRunner:
    def __init__(self, model_path):
        self.model_path = model_path
        print(f"[Edge Device] Inisialisasi model engine: {model_path}")

    def process_frame(self, frame_raw):
        # Preprocessing -> Inference -> Postprocessing NMS
        return {"detected_objects": ["person", "car"], "latency_ms": 12.4}

runner = VisionEdgeRunner("yolov8n_int8.onnx")
print("Hasil Stream Frame:", runner.process_frame(None))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Deployment Computer Vision** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    12,
    v_cat_cv,
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
    'BAB 13: Aplikasi Computer Vision',
    'bab-13-aplikasi-computer-vision',
    '# BAB 13: Aplikasi Computer Vision

Implementasi industri: Face Recognition, Optical Character Recognition (OCR), persepsi mobil otonom (Autonomous Vehicles), dan analisis citra medis.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 13: Aplikasi Computer Vision dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# medical_ocr_application.py
def autonomous_driving_perception(camera_feed, lidar_depth):
    lanes = "Garis marka jalan terdeteksi (Tengah)"
    obstacles = ["Pejalan Kaki (Jarak 14 meter)", "Kendaraan Depan (Jarak 28 meter)"]
    return {"status": "AMBIL_KENDALI", "lanes": lanes, "obstacles": obstacles}

print("Status Sistem Persepsi Otomasi:", autonomous_driving_perception(None, None))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 13: Aplikasi Computer Vision** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    13,
    v_cat_cv,
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
    'BAB 14: Etika & Privasi dalam Computer Vision',
    'bab-14-etika-privasi-dalam-computer-vision',
    '# BAB 14: Etika & Privasi dalam Computer Vision

Tantangan privasi biometric, bias rasial/gender dalam sistem pengenalan wajah, deepfake detection, dan regulasi etika pengawasan massal.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 14: Etika & Privasi dalam Computer Vision dalam domain Computer Vision.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# face_blur_privacy.py
import numpy as np

def anonymize_face(image_matrix, bbox):
    # bbox: [ymin, xmin, ymax, xmax]
    anonymized = image_matrix.copy()
    y1, x1, y2, x2 = bbox
    # Mengaburkan area wajah (Pixelation / Gaussian Blur)
    anonymized[y1:y2, x1:x2] = np.mean(anonymized[y1:y2, x1:x2])
    return anonymized

print("Kebijakan Privasi: Wajib melakukan redaksi identitas visual pada rekaman publik.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 14: Etika & Privasi dalam Computer Vision** merupakan pilar fundamental dalam spesialisasi Computer Vision.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    14,
    v_cat_cv,
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
  -- BAGIAN 4: DATA ANALYST (14 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Dasar Peran Data Analyst',
    'bab-1-dasar-peran-data-analyst',
    '# BAB 1: Dasar Peran Data Analyst

Definisi dan tanggung jawab Data Analyst, komparasi peran (Analyst vs Data Scientist vs Data Engineer), dan siklus kerja analisis data.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Dasar Peran Data Analyst dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# data_analytics_lifecycle.py
DATA_ANALYTICS_LIFECYCLE = [
    "1. Business Understanding (Definisi Masalah & KPI)",
    "2. Data Acquisition (Pengumpulan dari DB, API, File)",
    "3. Data Cleaning & Wrangling (Pembersihan anomali)",
    "4. Exploratory Data Analysis (Eksplorasi pola & korelasi)",
    "5. Visualization & Dashboarding (Pelaporan interaktif)",
    "6. Business Recommendations (Keputusan strategis)"
]
for step in DATA_ANALYTICS_LIFECYCLE: print(step)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Dasar Peran Data Analyst** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Fondasi Statistika untuk Analisis Data',
    'bab-2-fondasi-statistika-untuk-analisis-data',
    '# BAB 2: Fondasi Statistika untuk Analisis Data

Statistik deskriptif (Mean, Median, Modus, IQR, Standar Deviasi), statistik inferensial, distribusi normal, dan uji hipotesis (p-value, t-test).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Fondasi Statistika untuk Analisis Data dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# statistical_testing.py
import numpy as np
from scipy import stats

grup_A = [120, 135, 110, 140, 125, 130] # Penjualan strategi lama
grup_B = [145, 150, 138, 160, 142, 155] # Penjualan strategi baru

t_stat, p_val = stats.ttest_ind(grup_A, grup_B)
print(f"Rata-rata Grup A: {np.mean(grup_A):.1f} | Grup B: {np.mean(grup_B):.1f}")
print(f"T-Statistic: {t_stat:.3f}, P-Value: {p_val:.4f}")
print("Signifikan secara statistik (p < 0.05)?" , "YA" if p_val < 0.05 else "TIDAK")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Fondasi Statistika untuk Analisis Data** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Pengumpulan & Pembersihan Data',
    'bab-3-pengumpulan-pembersihan-data',
    '# BAB 3: Pengumpulan & Pembersihan Data

Strategi penanganan missing values (imputasi vs drop), parsing format tanggal, handling string kotor, dan validasi tipe data.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Pengumpulan & Pembersihan Data dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# pandas_cleaning_pipeline.py
import pandas as pd

raw_data = {
    ''transaksi_id'': [''TX01'', ''TX02'', ''TX03'', ''TX04''],
    ''nilai'': [''Rp 150.000'', ''Rp 250.000'', None, ''Rp 100.000''],
    ''tanggal'': [''2024-01-15'', ''2024-01-16'', ''2024-01-16'', ''invalid_date'']
}
df = pd.DataFrame(raw_data)

# Pembersihan format mata uang menjadi numerik murni
df[''nilai_bersih''] = df[''nilai''].str.replace(''Rp '', '''').str.replace(''.'', '''').astype(float)
df[''nilai_bersih''] = df[''nilai_bersih''].fillna(df[''nilai_bersih''].median())
print(df[[''transaksi_id'', ''nilai_bersih'']])
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Pengumpulan & Pembersihan Data** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Filter',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: SQL untuk Analisis Data',
    'bab-4-sql-untuk-analisis-data',
    '# BAB 4: SQL untuk Analisis Data

Sintaks SQL analitik lanjutan: Common Table Expressions (CTE), Window Functions (ROW_NUMBER, DENSE_RANK, LAG, LEAD), dan optimasi agregasi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: SQL untuk Analisis Data dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# advanced_sql_analytics.sql
-- Query Analitik Window Function: Menghitung Running Total & Ranking Penjualan
WITH PenjualanBulanan AS (
    SELECT 
        customer_id,
        DATE_TRUNC(''month'', order_date) AS bulan,
        SUM(total_amount) AS total_belanja
    FROM orders
    GROUP BY customer_id, DATE_TRUNC(''month'', order_date)
)
SELECT 
    customer_id,
    bulan,
    total_belanja,
    DENSE_RANK() OVER (PARTITION BY bulan ORDER BY total_belanja DESC) AS ranking_pelanggan,
    SUM(total_belanja) OVER (PARTITION BY customer_id ORDER BY bulan) AS running_total
FROM PenjualanBulanan;
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: SQL untuk Analisis Data** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Spreadsheet & Tools Analisis',
    'bab-5-spreadsheet-tools-analisis',
    '# BAB 5: Spreadsheet & Tools Analisis

Formula penting Excel & Google Sheets untuk analisis bisnis: XLOOKUP, INDEX-MATCH, SUMIFS, Pivot Table, dan visualisasi cepat.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Spreadsheet & Tools Analisis dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# excel_pivot_simulation.py
import pandas as pd

# Simulasi operasi Pivot Table spreadsheet menggunakan Pandas
df = pd.DataFrame({
    ''Regional'': [''Jakarta'', ''Jakarta'', ''Surabaya'', ''Surabaya'', ''Bandung''],
    ''Produk'': [''Laptop'', ''Mouse'', ''Laptop'', ''Keyboard'', ''Laptop''],
    ''Revenue'': [15000, 250, 15000, 450, 15000]
})

pivot = df.pivot_table(index=''Regional'', columns=''Produk'', values=''Revenue'', aggfunc=''sum'', fill_value=0)
print("Tabel Pivot Revenue Regional x Produk:\n", pivot)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Spreadsheet & Tools Analisis** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Pemrograman untuk Data Analyst',
    'bab-6-pemrograman-untuk-data-analyst',
    '# BAB 6: Pemrograman untuk Data Analyst

Fondasi Python analitis dengan Pandas dan NumPy, operasi vektorisasi cepat, manipulasi time-series, dan pengenalan sintaks R.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Pemrograman untuk Data Analyst dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# vectorized_analytics.py
import numpy as np

# Perhitungan komparatif vektorisasi cepat tanpa looping
harga_produk = np.array([50000, 120000, 35000, 80000, 200000])
diskon_persen = np.array([0.10, 0.15, 0.05, 0.20, 0.25])

harga_akhir = harga_produk * (1.0 - diskon_persen)
print("Harga Akhir Setelah Diskon:", harga_akhir)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Pemrograman untuk Data Analyst** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Exploratory Data Analysis (EDA)',
    'bab-7-exploratory-data-analysis-eda',
    '# BAB 7: Exploratory Data Analysis (EDA)

Univariate & multivariate analysis, deteksi outlier menggunakan Z-Score dan IQR, matriks korelasi Pearson/Spearman, serta interpretasi sebaran.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Exploratory Data Analysis (EDA) dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# iqr_outlier_detection.py
import numpy as np

def detect_outliers_iqr(data):
    q25, q75 = np.percentile(data, [25, 75])
    iqr = q75 - q25
    lower_bound = q25 - (1.5 * iqr)
    upper_bound = q75 + (1.5 * iqr)
    outliers = [x for x in data if x < lower_bound or x > upper_bound]
    return outliers, (lower_bound, upper_bound)

penjualan = [10, 12, 11, 14, 13, 15, 12, 100, 11] # 100 adalah outlier
outliers, bounds = detect_outliers_iqr(penjualan)
print(f"Batas Normal: {bounds[0]} s/d {bounds[1]}")
print(f"Outlier Ditemukan: {outliers}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Exploratory Data Analysis (EDA)** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Visualisasi Data',
    'bab-8-visualisasi-data',
    '# BAB 8: Visualisasi Data

Prinsip desain visualisasi data (Gestalt Principles, rasio data-ink), pemilihan chart yang tepat (Bar, Line, Scatter, Heatmap), dan data storytelling.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Visualisasi Data dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# data_visualization_principles.py
print("Pedoman Pemilihan Chart:")
print("- Tren Waktu: Line Chart / Area Chart")
print("- Perbandingan Kategori: Horizontal / Vertical Bar Chart")
print("- Komposisi Proporsi: Stacked Bar Chart (Hindari Pie Chart > 5 slice)")
print("- Hubungan Dua Variabel: Scatter Plot / Bubble Plot")
print("- Distribusi Sebaran: Histogram / Box Plot")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Visualisasi Data** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'PieChart',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Dashboard & Reporting',
    'bab-9-dashboard-reporting',
    '# BAB 9: Dashboard & Reporting

Perancangan dashboard eksekutif interaktif, pemilihan Key Performance Indicators (KPI), dan otomasi pembuatan laporan terjadwal.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Dashboard & Reporting dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# kpi_reporting_engine.py
def generate_executive_kpis(revenue, cost, active_users, churned_users):
    profit_margin = ((revenue - cost) / revenue) * 100
    churn_rate = (churned_users / active_users) * 100
    arpu = revenue / active_users
    return {
        "MRR": f"Rp {revenue:,.0f}",
        "Profit Margin": f"{profit_margin:.1f}%",
        "Churn Rate": f"{churn_rate:.2f}%",
        "ARPU": f"Rp {arpu:,.0f}"
    }

kpi = generate_executive_kpis(500000000, 320000000, 12500, 180)
for k, v in kpi.items(): print(f"{k}: {v}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Dashboard & Reporting** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: AI-Augmented Analytics',
    'bab-10-ai-augmented-analytics',
    '# BAB 10: AI-Augmented Analytics

Meningkatkan produktivitas analisis menggunakan AI Copilot, Text-to-SQL dengan LLM, dan otomasi sintesis narasi insight berbasis GenAI.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: AI-Augmented Analytics dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# text_to_sql_pipeline.py
def simulate_text_to_sql(user_question):
    schema_context = "Tabel: sales(id, customer_id, product_name, amount, date)"
    # Logika LLM menerjemahkan bahasa manusia menjadi query SQL
    if "produk terlaris" in user_question.lower():
        sql = "SELECT product_name, SUM(amount) FROM sales GROUP BY product_name ORDER BY 2 DESC LIMIT 5;"
    else:
        sql = "SELECT COUNT(*) FROM sales;"
    return f"-- Pertanyaan: {user_question}\n{sql}"

print(simulate_text_to_sql("Tampilkan 5 produk terlaris bulan ini"))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: AI-Augmented Analytics** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Analisis Lanjutan',
    'bab-11-analisis-lanjutan',
    '# BAB 11: Analisis Lanjutan

Metodologi eksperimen A/B testing (ukuran sampel, signifikansi), cohort analysis retensi pelanggan, dan dasar peramalan tren bisnis.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Analisis Lanjutan dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# cohort_retention_matrix.py
import pandas as pd

# Matriks retensi kohort pengguna
cohort_data = {
    ''Bulan_Daftar'': [''Jan 2024'', ''Feb 2024'', ''Mar 2024''],
    ''M0'': [100.0, 100.0, 100.0],
    ''M1'': [45.2, 48.0, None],
    ''M2'': [32.1, None, None]
}
df_cohort = pd.DataFrame(cohort_data).set_index(''Bulan_Daftar'')
print("Tabel Retensi Pengguna (%):\n", df_cohort)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Analisis Lanjutan** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Business Acumen & Komunikasi Stakeholder',
    'bab-12-business-acumen-komunikasi-stakeholder',
    '# BAB 12: Business Acumen & Komunikasi Stakeholder

Menerjemahkan temuan data teknis menjadi keputusan bisnis yang dapat ditindaklanjuti (actionable insights), dan teknik presentasi eksekutif.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Business Acumen & Komunikasi Stakeholder dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# executive_insight_summary.py
def craft_business_insight(drop_rate, root_cause, recommendation):
    return f"""=== EXECUTIVE BRIEF ===
Temuan Utama : Terjadi penurunan konversi sebesar {drop_rate}% pada halaman pembayaran.
Akar Masalah : {root_cause}
Rekomendasi  : {recommendation}
Estimasi Dampak: Pemulihan potensi omzet Rp 85.000.000 per bulan."""

print(craft_business_insight(18.5, "Gateway pembayaran e-wallet sering mengalami timeout", "Integrasikan redundant gateway alternatif"))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Business Acumen & Komunikasi Stakeholder** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: Cloud Analytics Platform',
    'bab-13-cloud-analytics-platform',
    '# BAB 13: Cloud Analytics Platform

Eksplorasi platform analitik cloud modern: Google BigQuery, Snowflake, arsitektur data warehouse berbasis cloud, dan query skala petabyte.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 13: Cloud Analytics Platform dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# bigquery_partition_query.sql
-- Query Teroptimasi di Cloud Data Warehouse (Partitioned & Clustered Table)
SELECT 
    country_code,
    device_category,
    COUNT(DISTINCT session_id) AS total_sessions,
    ROUND(SUM(transaction_revenue), 2) AS total_revenue
FROM `velqora-analytics.prod_dw.analytics_events_partitioned`
WHERE _PARTITIONDATE >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY 1, 2
ORDER BY total_revenue DESC;
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 13: Cloud Analytics Platform** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cloud',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 14: Studi Kasus & Proyek',
    'bab-14-studi-kasus-proyek',
    '# BAB 14: Studi Kasus & Proyek

Proyek analitik end-to-end: Analisis Data Penjualan Ritel, Analisis Segmentasi Pelanggan RFM (Recency, Frequency, Monetary), dan Dashboard Eksekutif.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 14: Studi Kasus & Proyek dalam domain Data Analyst.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# rfm_segmentation_project.py
import pandas as pd

def calculate_rfm(df_orders):
    # R: Recency (hari sejak order terakhir), F: Frequency (jumlah order), M: Monetary (total belanja)
    rfm = pd.DataFrame({
        ''customer'': [''Cust_A'', ''Cust_B'', ''Cust_C''],
        ''recency_days'': [5, 45, 120],
        ''frequency'': [12, 4, 1],
        ''monetary'': [5400000, 1200000, 250000]
    })
    # Kategori pelanggan sederhana
    rfm[''segment''] = rfm[''recency_days''].apply(lambda r: ''Juara/Aktif'' if r <= 10 else (''Perlu Perhatian'' if r <= 60 else ''Dormant''))
    return rfm

print(calculate_rfm(None))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 14: Studi Kasus & Proyek** merupakan pilar fundamental dalam spesialisasi Data Analyst.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Rocket',
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
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 5: DATA ENGINEERING & BIG DATA UNTUK AI (12 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar Data Engineering',
    'bab-1-konsep-dasar-data-engineering',
    '# BAB 1: Konsep Dasar Data Engineering

Peran Data Engineer dalam ekosistem AI modern, arsitektur data lifecycle, dan fondasi infrastruktur data terdistribusi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar Data Engineering dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# data_lifecycle_flow.py
DATA_ENGINEERING_LIFECYCLE = {
    "Generation": "IoT Sensors, Web Logs, Microservices DB",
    "Ingestion": "Kafka, Kinesis, Debezium (CDC)",
    "Storage": "Data Lake (S3/GCS), Parquet columnar storage",
    "Processing": "Apache Spark, Flink, dbt transformasi",
    "Serving": "Feature Store (Feast), Vector DB, Data Warehouse"
}
for stage, tech in DATA_ENGINEERING_LIFECYCLE.items():
    print(f"[{stage}] -> {tech}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar Data Engineering** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    1,
    v_cat_de,
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
    'BAB 2: Arsitektur Data',
    'bab-2-arsitektur-data',
    '# BAB 2: Arsitektur Data

Evolusi arsitektur data: Data Warehouse (OLAP), Data Lake (Unstructured Storage), hingga Data Lakehouse (Delta Lake, Apache Iceberg).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Arsitektur Data dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# lakehouse_delta_format.py
print("Kelebihan Arsitektur Data Lakehouse (misal: Apache Iceberg / Delta Lake):")
print("- Transaksi ACID pada penyimpanan objek cloud (S3/GCS)")
print("- Time Travel (melihat snapshot data historis)")
print("- Skema enforcement dan evolusi skema tanpa migrasi tabel berat")
print("- Format penyimpanan terbuka berbasis Apache Parquet")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Arsitektur Data** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Layers',
    2,
    v_cat_de,
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
    'BAB 3: ETL & ELT',
    'bab-3-etl-elt',
    '# BAB 3: ETL & ELT

Perbedaan paradigma Extract-Transform-Load (ETL) vs Extract-Load-Transform (ELT), serta orkestrasi pipeline data menggunakan Apache Airflow dan dbt.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: ETL & ELT dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# airflow_dag_sample.py
from datetime import datetime

# Definisi konseptual DAG Apache Airflow
def extract_task(): return "Ekstraksi data dari PostgreSQL produksi"
def transform_task(): return "Pembersihan dan kalkulasi agregasi fitur AI"
def load_task(): return "Pemuatan data mart ke Snowflake / BigQuery"

print("Alur Eksekusi DAG: extract_task >> transform_task >> load_task")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: ETL & ELT** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Workflow',
    3,
    v_cat_de,
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
    'BAB 4: Big Data Processing',
    'bab-4-big-data-processing',
    '# BAB 4: Big Data Processing

Pemrosesan data skala besar: ekosistem Apache Hadoop (HDFS), Apache Spark (RDD, DataFrame API, Catalyst Optimizer), dan komputasi memori terdistribusi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Big Data Processing dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# pyspark_wordcount_df.py
# Contoh sintaks PySpark DataFrame API untuk pengolahan terdistribusi
# df = spark.read.parquet("s3://velqora-lake/raw-events/")
# agg_df = df.groupBy("event_type").count().filter("count > 1000")
# agg_df.write.mode("overwrite").parquet("s3://velqora-lake/curated/")

print("Apache Spark: Memproses data skala Terabyte secara terdistribusi di memori RAM klaster.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Big Data Processing** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cloud',
    4,
    v_cat_de,
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
    'BAB 5: Data Pipeline untuk Machine Learning',
    'bab-5-data-pipeline-untuk-machine-learning',
    '# BAB 5: Data Pipeline untuk Machine Learning

Rancang bangun pipeline data: Batch Processing Pipeline vs Real-Time Streaming Pipeline (Apache Kafka & Apache Flink) untuk model AI.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Data Pipeline untuk Machine Learning dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# kafka_streaming_pipeline.py
class KafkaStreamEventSimulator:
    def __init__(self):
        self.queue = []

    def produce(self, event):
        self.queue.append(event)
        print(f"[Kafka Producer] Mengirim event: {event[''type'']} untuk ID: {event[''user_id'']}")

    def consume(self):
        while self.queue:
            e = self.queue.pop(0)
            print(f"[Flink Consumer] Memproses streaming event real-time: {e[''user_id'']}")

stream = KafkaStreamEventSimulator()
stream.produce({"type": "KLIK_PRODUK", "user_id": "usr_9981"})
stream.consume()
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Data Pipeline untuk Machine Learning** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Workflow',
    5,
    v_cat_de,
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
    'BAB 6: Data Quality & Governance',
    'bab-6-data-quality-governance',
    '# BAB 6: Data Quality & Governance

Otomasi data validation (Great Expectations, Soda), pelacakan silsilah data (Data Lineage / OpenLineage), dan kepatuhan regulasi data (GDPR/UU PDP).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Data Quality & Governance dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# data_quality_contract.py
def validate_dataset_schema(records):
    errors = []
    for idx, r in enumerate(records):
        if r.get(''id'') is None:
            errors.append(f"Baris {idx}: Field ''id'' wajib ada!")
        if r.get(''email'') and ''@'' not in r.get(''email''):
            errors.append(f"Baris {idx}: Format email tidak valid!")
    return errors

sample = [{''id'': 1, ''email'': ''user@velqora.app''}, {''id'': 2, ''email'': ''bad_email''}]
print("Validasi Kualitas Data:", validate_dataset_schema(sample))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Data Quality & Governance** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'ShieldCheck',
    6,
    v_cat_de,
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
    'BAB 7: Database untuk AI',
    'bab-7-database-untuk-ai',
    '# BAB 7: Database untuk AI

Perbandingan basis data: Relational SQL, NoSQL Document (MongoDB), Vector Database (pgvector, Milvus, Qdrant) untuk RAG, dan Graph Database (Neo4j).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Database untuk AI dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# vector_db_similarity.py
import numpy as np

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

embedding_query = np.array([0.15, 0.82, -0.45, 0.33])
embedding_doc1  = np.array([0.14, 0.80, -0.41, 0.35]) # Sangat relevan
embedding_doc2  = np.array([-0.80, 0.10, 0.50, -0.20]) # Tidak relevan

print(f"Kemiripan Dokumen 1: {cosine_similarity(embedding_query, embedding_doc1):.4f}")
print(f"Kemiripan Dokumen 2: {cosine_similarity(embedding_query, embedding_doc2):.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Database untuk AI** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    7,
    v_cat_de,
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
    'BAB 8: Data Mesh & Data Contract',
    'bab-8-data-mesh-data-contract',
    '# BAB 8: Data Mesh & Data Contract

Paradigma desentralisasi Data Mesh (Domain-oriented data ownership, Data as a Product), dan implementasi Data Contract antar-tim.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Data Mesh & Data Contract dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# data_contract_schema.json
DATA_CONTRACT = {
    "version": "1.0.0",
    "dataset": "orders_checkout",
    "owner": "tim-pembayaran",
    "schema": {
        "order_id": {"type": "string", "nullable": False},
        "amount": {"type": "number", "minimum": 0},
        "currency": {"type": "string", "enum": ["IDR", "USD"]}
    },
    "sla": {"freshness_minutes": 5, "availability_pct": 99.9}
}
print("Data Contract Standar:", DATA_CONTRACT["dataset"], "SLA:", DATA_CONTRACT["sla"])
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Data Mesh & Data Contract** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    8,
    v_cat_de,
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
    'BAB 9: Real-Time & Streaming Feature Engineering',
    'bab-9-real-time-streaming-feature-engineering',
    '# BAB 9: Real-Time & Streaming Feature Engineering

Fitur waktu-nyata untuk model ML: Feature Store (Feast/Hopsworks), windowing agregasi streaming, dan low-latency feature serving.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Real-Time & Streaming Feature Engineering dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# feature_store_concept.py
class SimpleFeatureStore:
    def __init__(self):
        self.online_store = {}

    def push_features(self, entity_id, features_dict):
        self.online_store[entity_id] = features_dict

    def get_online_features(self, entity_id):
        # Latensi sangat rendah (< 10 ms) dari Redis/Memory
        return self.online_store.get(entity_id, {})

fs = SimpleFeatureStore()
fs.push_features("user_102", {"transaksi_1_jam_terakhir": 4, "total_nilai_1_jam": 850000})
print("Fitur Online Siap Inferensi:", fs.get_online_features("user_102"))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Real-Time & Streaming Feature Engineering** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    9,
    v_cat_de,
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
    'BAB 10: Data Curation untuk Training Model Besar',
    'bab-10-data-curation-untuk-training-model-besar',
    '# BAB 10: Data Curation untuk Training Model Besar

Kurasi dataset pre-training LLM: Web scraping etis, text extraction, deduplikasi skala besar (MinHash LSH), filtering toksisitas, dan data synthetic.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Data Curation untuk Training Model Besar dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# minhash_lsh_dedup.py
def get_jaccard_similarity(text1, text2):
    # Set of shingles (n-gram kata)
    set1 = set(text1.lower().split())
    set2 = set(text2.lower().split())
    inter = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return inter / union if union > 0 else 0.0

t1 = "Belajar kecerdasan buatan dan data engineering di Velqora"
t2 = "Belajar kecerdasan buatan serta data engineering di platform Velqora"
print(f"Tingkat Kemiripan Dokumen: {get_jaccard_similarity(t1, t2):.2%}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Data Curation untuk Training Model Besar** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    10,
    v_cat_de,
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
    'BAB 11: Skalabilitas & Cloud Data Infrastructure',
    'bab-11-skalabilitas-cloud-data-infrastructure',
    '# BAB 11: Skalabilitas & Cloud Data Infrastructure

Infrastruktur cloud data modern (AWS EMR/Athena, GCP Dataproc/BigQuery, Azure Synapse), object storage skala petabyte, dan multi-node checkpointing.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Skalabilitas & Cloud Data Infrastructure dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# cloud_data_architecture.py
print("Infrastruktur Data Cloud untuk AI:")
print("- Storage Layer  : AWS S3 / Google Cloud Storage (Data Lake)")
print("- Compute Layer  : Kubernetes (EKS/GKE) + Ray Clusters / Spark")
print("- Orchestration  : Managed Airflow (MWAA / Cloud Composer)")
print("- Observability  : Datadog / Prometheus monitoring pipeline health")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Skalabilitas & Cloud Data Infrastructure** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cloud',
    11,
    v_cat_de,
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
    'BAB 12: Keamanan & Privasi Data dalam Pipeline',
    'bab-12-keamanan-privasi-data-dalam-pipeline',
    '# BAB 12: Keamanan & Privasi Data dalam Pipeline

Enkripsi data at rest & in transit (AES-256, TLS 1.3), masking/anonymization data sensitif PII (Personally Identifiable Information), dan role-based access control (RBAC).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Keamanan & Privasi Data dalam Pipeline dalam domain Data Engineering & Big Data untuk AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# pii_masking_pipeline.py
def mask_pii_data(user_record):
    masked = user_record.copy()
    if ''nomor_telepon'' in masked:
        phone = str(masked[''nomor_telepon''])
        masked[''nomor_telepon''] = phone[:3] + ''****'' + phone[-3:]
    if ''email'' in masked:
        email = masked[''email'']
        parts = email.split(''@'')
        masked[''email''] = parts[0][:2] + ''***@'' + parts[1]
    return masked

sample_user = {''id'': 101, ''nama'': ''Budi Santoso'', ''nomor_telepon'': ''081234567890'', ''email'': ''budi.santoso@gmail.com''}
print("Data Sebelum Masking:", sample_user)
print("Data Setelah Masking (Aman untuk Training/Analytics):", mask_pii_data(sample_user))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Keamanan & Privasi Data dalam Pipeline** merupakan pilar fundamental dalam spesialisasi Data Engineering & Big Data untuk AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Workflow',
    12,
    v_cat_de,
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
