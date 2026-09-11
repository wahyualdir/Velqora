-- ============================================================
-- Migration 008: Obsidian-style Notes Vault Schema & Seed
-- Velqora Academic Knowledge Base
-- ============================================================

-- 1. Table: notes
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  parent_note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL DEFAULT '',
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_folder BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for notes
CREATE INDEX IF NOT EXISTS idx_notes_category_id ON notes(category_id);
CREATE INDEX IF NOT EXISTS idx_notes_parent_note_id ON notes(parent_note_id);
CREATE INDEX IF NOT EXISTS idx_notes_slug ON notes(slug);
CREATE INDEX IF NOT EXISTS idx_notes_order_index ON notes(order_index);

-- 2. Table: note_links (Precomputed graph edges for backlinks & graph visualization)
CREATE TABLE IF NOT EXISTS note_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  target_note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  target_title_raw TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_note_id, target_title_raw)
);

-- Indexes for note_links
CREATE INDEX IF NOT EXISTS idx_note_links_source ON note_links(source_note_id);
CREATE INDEX IF NOT EXISTS idx_note_links_target ON note_links(target_note_id);
CREATE INDEX IF NOT EXISTS idx_note_links_target_raw ON note_links(target_title_raw);

-- 3. Table: note_tags
CREATE TABLE IF NOT EXISTS note_tags (
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (note_id, tag)
);

-- Indexes for note_tags
CREATE INDEX IF NOT EXISTS idx_note_tags_tag ON note_tags(tag);
CREATE INDEX IF NOT EXISTS idx_note_tags_note_id ON note_tags(note_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Authenticated users can view notes" ON notes;
DROP POLICY IF EXISTS "Admin users can insert notes" ON notes;
DROP POLICY IF EXISTS "Admin users can update notes" ON notes;
DROP POLICY IF EXISTS "Admin users can delete notes" ON notes;

DROP POLICY IF EXISTS "Authenticated users can view note links" ON note_links;
DROP POLICY IF EXISTS "Admin users can manage note links" ON note_links;

DROP POLICY IF EXISTS "Authenticated users can view note tags" ON note_tags;
DROP POLICY IF EXISTS "Admin users can manage note tags" ON note_tags;

-- RLS: Read access for all authenticated users (Shared/Global Knowledge Base)
CREATE POLICY "Authenticated users can view notes"
  ON notes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view note links"
  ON note_links FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view note tags"
  ON note_tags FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS: Write access restricted to Admin / Owner
CREATE POLICY "Admin users can insert notes"
  ON notes FOR INSERT
  WITH CHECK (
    LOWER(auth.jwt()->>'email') IN ('wahyualdiriyanto80@gmail.com', 'admin@velqora.app')
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE LOWER(email) = LOWER(auth.jwt()->>'email') 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admin users can update notes"
  ON notes FOR UPDATE
  USING (
    LOWER(auth.jwt()->>'email') IN ('wahyualdiriyanto80@gmail.com', 'admin@velqora.app')
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE LOWER(email) = LOWER(auth.jwt()->>'email') 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admin users can delete notes"
  ON notes FOR DELETE
  USING (
    LOWER(auth.jwt()->>'email') IN ('wahyualdiriyanto80@gmail.com', 'admin@velqora.app')
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE LOWER(email) = LOWER(auth.jwt()->>'email') 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admin users can manage note links"
  ON note_links FOR ALL
  USING (
    LOWER(auth.jwt()->>'email') IN ('wahyualdiriyanto80@gmail.com', 'admin@velqora.app')
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE LOWER(email) = LOWER(auth.jwt()->>'email') 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admin users can manage note tags"
  ON note_tags FOR ALL
  USING (
    LOWER(auth.jwt()->>'email') IN ('wahyualdiriyanto80@gmail.com', 'admin@velqora.app')
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE LOWER(email) = LOWER(auth.jwt()->>'email') 
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================
-- 5. Seed Initial Curriculum Notes & Demo Wiki-Links
-- ============================================================

DO $MIGRATION_VAULT$
DECLARE
  v_cat_ml UUID;
  v_cat_dl UUID;
  v_cat_nlp UUID;
  v_cat_cv UUID;
  v_cat_fund UUID;

  v_id_regresi UUID := '00000000-0000-0000-0001-000000000001';
  v_id_kmeans UUID := '00000000-0000-0000-0001-000000000002';
  v_id_dtree UUID := '00000000-0000-0000-0001-000000000003';
  v_id_mlp UUID := '00000000-0000-0000-0001-000000000004';
  v_id_cnn UUID := '00000000-0000-0000-0001-000000000005';
  v_id_tokenisasi UUID := '00000000-0000-0000-0001-000000000006';
  v_id_sentimen UUID := '00000000-0000-0000-0001-000000000007';
  v_id_spasial UUID := '00000000-0000-0000-0001-000000000008';
  v_id_objdet UUID := '00000000-0000-0000-0001-000000000009';
  v_id_agent UUID := '00000000-0000-0000-0001-000000000010';
  v_id_eval UUID := '00000000-0000-0000-0001-000000000011';

  v_id_nb UUID := '00000000-0000-0000-0002-000000000001';
  v_id_bayes UUID := '00000000-0000-0000-0002-000000000002';
  v_id_klas_teks UUID := '00000000-0000-0000-0002-000000000003';
BEGIN
  -- Resolve Category IDs if present in DB
  SELECT id INTO v_cat_ml FROM categories WHERE LOWER(name) LIKE '%machine learning%' LIMIT 1;
  SELECT id INTO v_cat_dl FROM categories WHERE LOWER(name) LIKE '%deep learning%' LIMIT 1;
  SELECT id INTO v_cat_nlp FROM categories WHERE LOWER(name) LIKE '%natural language%' OR LOWER(name) LIKE '%nlp%' LIMIT 1;
  SELECT id INTO v_cat_cv FROM categories WHERE LOWER(name) LIKE '%computer vision%' LIMIT 1;
  SELECT id INTO v_cat_fund FROM categories WHERE LOWER(name) LIKE '%kecerdasan buatan%' OR LOWER(name) LIKE '%ai%' LIMIT 1;

  -- 1. Regresi Linear
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_regresi,
    v_cat_ml,
    'regresi-linear-prediksi-kontinu',
    'Regresi Linear & Prediksi Kontinu',
    '# Regresi Linear & Prediksi Kontinu\n\nDasar **Supervised Learning** untuk memodelkan hubungan linear antara variabel independen (fitur $X$) dan target kontinu ($y$). Menggunakan metode Ordinary Least Squares (OLS) dan fungsi loss Mean Squared Error (MSE).\n\nPelajari juga keterkaitannya dengan [[Evaluasi Model & Metrik Performa AI]] untuk menghitung metrik seperti MSE dan $R^2$.\n\n```python\nimport numpy as np\nfrom sklearn.linear_model import LinearRegression\n\n# Data fitur (jam belajar) vs target (skor ujian)\nX = np.array([[1], [2], [3], [4], [5], [6]])\ny = np.array([55, 63, 72, 80, 89, 95])\n\nmodel = LinearRegression()\nmodel.fit(X, y)\n\nprediksi = model.predict([[7]])\nprint(f"Prediksi skor untuk 7 jam belajar: {prediksi[0]:.2f}")\nprint(f"Koefisien (Bobot): {model.coef_[0]:.2f}, Intersep: {model.intercept_:.2f}")\n```\n\n#machine-learning #supervised-learning #regresi',
    1,
    'TrendingUp'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 2. K-Means
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_kmeans,
    v_cat_ml,
    'k-means-clustering-pengelompokan-data',
    'K-Means Clustering & Pengelompokan Data',
    '# K-Means Clustering & Pengelompokan Data\n\nAlgoritma **Unsupervised Learning** untuk mempartisi $n$ observasi ke dalam $k$ klaster berdasarkan jarak centroid terdekat (Euclidean Distance). Cocok untuk segmentasi data, analisis klaster pelanggan, dan kompresi fitur visual.\n\n```python\nimport numpy as np\nfrom sklearn.cluster import KMeans\n\n# Titik data 2 dimensi tanpa label\nX = np.array([\n    [1.0, 2.0], [1.5, 1.8], [1.2, 2.2],\n    [8.0, 8.0], [8.5, 8.2], [9.0, 7.8]\n])\n\nkmeans = KMeans(n_clusters=2, random_state=42, n_init="auto")\nkmeans.fit(X)\n\nprint("Label Klaster Tiap Data:", kmeans.labels_)\nprint("Titik Koordinat Centroid:\\n", kmeans.cluster_centers_)\n```\n\n#machine-learning #unsupervised-learning #clustering',
    2,
    'Grid'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 3. Decision Tree
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_dtree,
    v_cat_ml,
    'decision-tree-random-forest-classifier',
    'Decision Tree & Random Forest Classifier',
    '# Decision Tree & Random Forest Classifier\n\nModel pembelajaran berbasis pohon keputusan dengan kriteria splitting Gini Impurity atau Information Gain (Entropy). Ensemble Random Forest menggabungkan banyak pohon keputusan (*bagging*) untuk mencegah overfitting dan meningkatkan generalisasi.\n\nBandingkan performanya dengan [[Naive Bayes Classifier]] pada tugas klasifikasi tabular.\n\n```python\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import accuracy_score\n\n# Fitur: [Umur, Pendapatan_K], Label: [0: Tidak Beli, 1: Beli]\nX_train = [[22, 25], [28, 45], [45, 85], [52, 90], [35, 60]]\ny_train = [0, 0, 1, 1, 1]\n\nclf = DecisionTreeClassifier(max_depth=3, random_state=42)\nclf.fit(X_train, y_train)\n\nuji = [[30, 50], [50, 75]]\nprint("Hasil Klasifikasi Data Uji:", clf.predict(uji))\n```\n\n#machine-learning #classification #decision-tree',
    3,
    'GitFork'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 4. MLP & Backpropagation
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_mlp,
    v_cat_dl,
    'multilayer-perceptron-mlp-backpropagation',
    'Multilayer Perceptron (MLP) & Backpropagation',
    '# Multilayer Perceptron (MLP) & Backpropagation\n\nArsitektur dasar **Feedforward Neural Network** dengan lapisan tersembunyi (*dense layers*), fungsi aktivasi non-linear (ReLU, GELU, Sigmoid), serta algoritma optimasi bobot berbasis gradient descent dan aturan rantai kalkulus (*backpropagation*).\n\n```python\nimport torch\nimport torch.nn as nn\n\nclass FeedForwardNN(nn.Module):\n    def __init__(self, in_features, hidden_dim, num_classes):\n        super().__init__()\n        self.network = nn.Sequential(\n            nn.Linear(in_features, hidden_dim),\n            nn.ReLU(),\n            nn.Dropout(0.2),\n            nn.Linear(hidden_dim, num_classes)\n        )\n\n    def forward(self, x):\n        return self.network(x)\n\nmodel = FeedForwardNN(in_features=16, hidden_dim=64, num_classes=2)\ndummy_input = torch.randn(4, 16)\nprint("Output logits shape:", model(dummy_input).shape)\n```\n\n#deep-learning #neural-network #pytorch',
    1,
    'Cpu'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 5. CNN
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_cnn,
    v_cat_dl,
    'convolutional-neural-network-cnn-untuk-visi-komputer',
    'Convolutional Neural Network (CNN) untuk Visi Komputer',
    '# Convolutional Neural Network (CNN) untuk Visi Komputer\n\nJaringan saraf konvolusional yang menggunakan kernel filter spasial untuk mengekstraksi representasi hierarkis dari citra, mulai dari tepi, tekstur, hingga objek kompleks. Konsep dasar konvolusi dapat dipelajari di [[Operasi Spasial & Transformasi Citra Digital]].\n\n```python\nimport torch\nimport torch.nn as nn\n\nconv_block = nn.Sequential(\n    nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1),\n    nn.BatchNorm2d(32),\n    nn.ReLU(),\n    nn.MaxPool2d(kernel_size=2, stride=2)\n)\n\nimg_batch = torch.randn(2, 3, 64, 64)\noutput_map = conv_block(img_batch)\nprint("Ukuran Feature Map setelah konvolusi:", output_map.shape)\n```\n\n#deep-learning #computer-vision #cnn',
    2,
    'Eye'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 6. Tokenisasi & Word Embeddings
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_tokenisasi,
    v_cat_nlp,
    'tokenisasi-word-embeddings-word2vec-bert',
    'Tokenisasi & Word Embeddings (Word2Vec / BERT)',
    '# Tokenisasi & Word Embeddings (Word2Vec / BERT)\n\nProses pemecahan teks mentah ke dalam token diskrit dan pemetaan token tersebut ke dalam ruang vektor berdimensi padat (*dense vector space*). Vektor kata mempertahankan relasi semantik dan sintaksis antar kata, yang kemudian digunakan oleh [[Klasifikasi Teks]] dan model bahasa modern.\n\n```python\nimport re\n\ndef simple_tokenize(text):\n    text = text.lower()\n    tokens = re.findall(r''\b[\w-]+\b'', text)\n    return tokens\n\nkalimat = "Velqora menyediakan kurikulum Kecerdasan Buatan terstruktur!"\ntokens = simple_tokenize(kalimat)\nprint("Token yang dihasilkan:", tokens)\nprint("Jumlah vocabulary unik:", len(set(tokens)))\n```\n\n#nlp #tokenisasi #embeddings',
    1,
    'Hash'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 7. Analisis Sentimen & Klasifikasi Teks
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_sentimen,
    v_cat_nlp,
    'analisis-sentimen-klasifikasi-teks',
    'Analisis Sentimen & Klasifikasi Teks',
    '# Analisis Sentimen & Klasifikasi Teks\n\nPembangunan pipeline inferensi NLP untuk mendeteksi polaritas emosi teks (positif, netral, negatif). Teknik ini bertumpu pada representasi vektor teks dan model probabilistik seperti [[Naive Bayes Classifier]] atau arsitektur Transformer.\n\n```python\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.naive_bayes import MultinomialNB\n\nkorpus = [\n    "Model AI ini sangat akurat dan cepat",\n    "Hasil inferensi lambat dan sering salah",\n    "Dokumentasi lengkap dan mudah dipahami",\n    "Sangat buruk dan tidak dapat digunakan"\n]\nlabels = [1, 0, 1, 0] # 1: Positif, 0: Negatif\n\nvec = TfidfVectorizer()\nX = vec.fit_transform(korpus)\nclf = MultinomialNB().fit(X, labels)\n\ntes = vec.transform(["Platform belajar ini sangat membantu dan cepat"])\nprint("Prediksi sentimen:", "Positif" if clf.predict(tes)[0] == 1 else "Negatif")\n```\n\n#nlp #sentiment-analysis #klasifikasi',
    2,
    'MessageSquare'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 8. Operasi Spasial Citra
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_spasial,
    v_cat_cv,
    'operasi-spasial-transformasi-citra-digital',
    'Operasi Spasial & Transformasi Citra Digital',
    '# Operasi Spasial & Transformasi Citra Digital\n\nManipulasi matriks piksel: konversi color space (RGB ke Grayscale), deteksi tepi Sobel/Canny, filter Gaussian, serta augmentasi citra. Merupakan fondasi pra-pemrosesan sebelum masuk ke jaringan saraf seperti [[Convolutional Neural Network (CNN) untuk Visi Komputer]].\n\n```python\nimport numpy as np\n\n# Simulasi gambar grayscale 4x4 piksel\ndummy_img = np.array([\n    [10, 15, 20, 25],\n    [30, 40, 50, 60],\n    [70, 80, 90, 100],\n    [110, 120, 130, 140]\n], dtype=np.uint8)\n\n# Normalisasi intensitas piksel ke skala [0.0, 1.0]\nnormalized = dummy_img / 255.0\nprint("Piksel ternormalisasi:\\n", np.round(normalized, 3))\n```\n\n#computer-vision #image-processing',
    1,
    'Image'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 9. Object Detection & Bounding Box
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_objdet,
    v_cat_cv,
    'object-detection-bounding-box-prediction',
    'Object Detection & Bounding Box Prediction',
    '# Object Detection & Bounding Box Prediction\n\nMetode lokalisasi dan klasifikasi objek dalam gambar dengan memprediksi koordinat bounding box $(x, y, w, h)$ serta probabilitas kelas objek. Evaluasi lokalisasi menggunakan metrik Intersection over Union (IoU).\n\n```python\ndef hitung_iou(boxA, boxB):\n    # Format: [x1, y1, x2, y2]\n    xA = max(boxA[0], boxB[0])\n    yA = max(boxA[1], boxB[1])\n    xB = min(boxA[2], boxB[2])\n    yB = min(boxA[3], boxB[3])\n\n    inter_area = max(0, xB - xA) * max(0, yB - yA)\n    boxA_area = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])\n    boxB_area = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])\n\n    iou = inter_area / float(boxA_area + boxB_area - inter_area)\n    return iou\n\nb1 = [50, 50, 150, 150]\nb2 = [60, 60, 160, 160]\nprint("Intersection over Union (IoU):", round(hitung_iou(b1, b2), 4))\n```\n\n#computer-vision #object-detection #yolo',
    2,
    'Scan'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 10. AI Fundamentals: Agen Cerdas
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_agent,
    v_cat_fund,
    'prinsip-dasar-kecerdasan-buatan-agen-cerdas',
    'Prinsip Dasar Kecerdasan Buatan & Agen Cerdas',
    '# Prinsip Dasar Kecerdasan Buatan & Agen Cerdas\n\nMemahami paradigma agen rasional (*Rational Agents*) dan lingkungan PEAS (Performance measure, Environment, Actuators, Sensors). Menjadi pondasi untuk memahami bagaimana model AI mengambil keputusan berdasarkan observasi lingkungan.\n\n```python\nclass SimpleReflexAgent:\n    def __init__(self):\n        self.rules = {\n            "kotor": "membersihkan",\n            "bersih": "berpindah_ruangan"\n        }\n\n    def act(self, percept):\n        return self.rules.get(percept, "diam")\n\nagent = SimpleReflexAgent()\nprint("Aksi saat ruangan kotor:", agent.act("kotor"))\nprint("Aksi saat ruangan bersih:", agent.act("bersih"))\n```\n\n#ai-fundamentals #agents #konsep',
    1,
    'Compass'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 11. AI Fundamentals: Evaluasi Metrik
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_eval,
    v_cat_fund,
    'evaluasi-model-metrik-performa-ai',
    'Evaluasi Model & Metrik Performa AI',
    '# Evaluasi Model & Metrik Performa AI\n\nPengukuran kualitas prediksi model klasifikasi menggunakan Confusion Matrix: Accuracy, Precision, Recall, F1-Score, serta fenomena Bias vs Variance Tradeoff. Metrik ini digunakan untuk mengevaluasi model klasifikasi seperti [[Naive Bayes Classifier]] dan [[Decision Tree & Random Forest Classifier]].\n\n```python\ndef evaluasi_model(tp, fp, fn, tn):\n    accuracy = (tp + tn) / (tp + fp + fn + tn)\n    precision = tp / (tp + fp) if (tp + fp) > 0 else 0\n    recall = tp / (tp + fn) if (tp + fn) > 0 else 0\n    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0\n    return {"accuracy": accuracy, "precision": precision, "recall": recall, "f1": f1}\n\nhasil = evaluasi_model(tp=85, fp=15, fn=10, tn=90)\nfor k, v in hasil.items():\n    print(f"{k.capitalize()}: {v:.4f}")\n```\n\n#ai-fundamentals #evaluation #metrics',
    2,
    'Award'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 12. DEMO 1: Naive Bayes Classifier (Interlinked)
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_nb,
    v_cat_ml,
    'naive-bayes-classifier',
    'Naive Bayes Classifier',
    '# Naive Bayes Classifier\n\nNaive Bayes adalah keluarga algoritma klasifikasi probabilistik berbasis [[Bayes'' Theorem]] dengan asumsi kemandirian bersyarat (*conditional independence*) yang kuat antara setiap pasang fitur.\n\nDalam aplikasi praktis, Naive Bayes sangat populer untuk [[Klasifikasi Teks]], pemfilteran spam email, dan analisis sentimen karena kecepatan pelatihannya yang tinggi.\n\n### Implementasi Kode Python\n\n```python\nimport numpy as np\nfrom sklearn.naive_bayes import GaussianNB\n\n# Contoh fitur 2D: [Fitur_A, Fitur_B]\nX = np.array([\n    [-1, -1], [-2, -1], [-3, -2],\n    [1, 1], [2, 1], [3, 2]\n])\ny = np.array([0, 0, 0, 1, 1, 1])\n\nclf = GaussianNB()\nclf.fit(X, y)\n\ntest_data = np.array([[-0.8, -1], [1.5, 2]])\nprint("Prediksi kelas:", clf.predict(test_data))\nprint("Probabilitas tiap kelas:\\n", np.round(clf.predict_proba(test_data), 4))\n```\n\nUntuk mengukur kualitas prediksi, gunakan metode di [[Evaluasi Model & Metrik Performa AI]].\n\n#machine-learning #bayes #klasifikasi #nlp',
    4,
    'GitPullRequest'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 13. DEMO 2: Bayes'' Theorem (Interlinked)
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_bayes,
    v_cat_fund,
    'bayes-theorem',
    'Bayes'' Theorem',
    '# Bayes'' Theorem (Teorema Bayes)\n\nTeorema Bayes adalah hukum fundamental dalam teori probabilitas yang menyatakan cara memperbarui keyakinan probabilitas (*posterior*) berdasarkan bukti baru (*evidence*):\n\n\\[P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}\\]\n\n- **$P(A)$**: Probabilitas prior (keyakinan sebelum ada bukti)\n- **$P(B|A)$**: Likelihood (kemungkinan bukti jika hipotesis $A$ benar)\n- **$P(B)$**: Probabilitas marginal dari bukti\n- **$P(A|B)$**: Probabilitas posterior setelah melihat bukti\n\n### Hubungan dengan Machine Learning\nTeorema ini adalah dasar matematika langsung dari algoritma [[Naive Bayes Classifier]], yang mengasumsikan bahwa fitur-fitur independen secara kondisional.\n\n#matematika #probabilitas #ai-fundamentals #teori',
    3,
    'BookOpen'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- 14. DEMO 3: Klasifikasi Teks (Interlinked)
  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_klas_teks,
    v_cat_nlp,
    'klasifikasi-teks',
    'Klasifikasi Teks',
    '# Klasifikasi Teks (Text Categorization)\n\nKlasifikasi Teks adalah tugas menetapkan dokumen atau kalimat ke dalam satu atau beberapa kategori yang telah ditentukan sebelumnya. Merupakan pilar penting dalam Natural Language Processing.\n\n### Algoritma yang Biasa Digunakan\n1. **[[Naive Bayes Classifier]]**: Sangat cepat dan cocok untuk baseline dokumen teks.\n2. **Support Vector Machine (SVM)**: Akurat untuk representasi vektor dimensi tinggi.\n3. **Transformer & Deep Learning**: Seperti [[Multilayer Perceptron (MLP) & Backpropagation]] atau BERT.\n\nLihat juga contoh implementasi nyata di [[Analisis Sentimen & Klasifikasi Teks]].\n\n#nlp #klasifikasi #text-processing',
    3,
    'FileText'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- ============================================================
  -- 6. Insert Precomputed Links into note_links
  -- ============================================================
  DELETE FROM note_links WHERE source_note_id IN (
    v_id_regresi, v_id_kmeans, v_id_dtree, v_id_mlp, v_id_cnn,
    v_id_tokenisasi, v_id_sentimen, v_id_spasial, v_id_objdet,
    v_id_agent, v_id_eval, v_id_nb, v_id_bayes, v_id_klas_teks
  );

  -- Regresi -> Evaluasi
  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw)
  VALUES (v_id_regresi, v_id_eval, 'Evaluasi Model & Metrik Performa AI')
  ON CONFLICT DO NOTHING;

  -- Decision Tree -> Naive Bayes
  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw)
  VALUES (v_id_dtree, v_id_nb, 'Naive Bayes Classifier')
  ON CONFLICT DO NOTHING;

  -- CNN -> Operasi Spasial
  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw)
  VALUES (v_id_cnn, v_id_spasial, 'Operasi Spasial & Transformasi Citra Digital')
  ON CONFLICT DO NOTHING;

  -- Tokenisasi -> Klasifikasi Teks
  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw)
  VALUES (v_id_tokenisasi, v_id_klas_teks, 'Klasifikasi Teks')
  ON CONFLICT DO NOTHING;

  -- Sentimen -> Naive Bayes
  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw)
  VALUES (v_id_sentimen, v_id_nb, 'Naive Bayes Classifier')
  ON CONFLICT DO NOTHING;

  -- Operasi Spasial -> CNN
  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw)
  VALUES (v_id_spasial, v_id_cnn, 'Convolutional Neural Network (CNN) untuk Visi Komputer')
  ON CONFLICT DO NOTHING;

  -- Evaluasi -> Naive Bayes & Decision Tree
  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw)
  VALUES 
    (v_id_eval, v_id_nb, 'Naive Bayes Classifier'),
    (v_id_eval, v_id_dtree, 'Decision Tree & Random Forest Classifier')
  ON CONFLICT DO NOTHING;

  -- Naive Bayes -> Bayes' Theorem, Klasifikasi Teks, Evaluasi
  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw)
  VALUES 
    (v_id_nb, v_id_bayes, 'Bayes'' Theorem'),
    (v_id_nb, v_id_klas_teks, 'Klasifikasi Teks'),
    (v_id_nb, v_id_eval, 'Evaluasi Model & Metrik Performa AI')
  ON CONFLICT DO NOTHING;

  -- Bayes' Theorem -> Naive Bayes
  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw)
  VALUES (v_id_bayes, v_id_nb, 'Naive Bayes Classifier')
  ON CONFLICT DO NOTHING;

  -- Klasifikasi Teks -> Naive Bayes, MLP, Sentimen
  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw)
  VALUES 
    (v_id_klas_teks, v_id_nb, 'Naive Bayes Classifier'),
    (v_id_klas_teks, v_id_mlp, 'Multilayer Perceptron (MLP) & Backpropagation'),
    (v_id_klas_teks, v_id_sentimen, 'Analisis Sentimen & Klasifikasi Teks')
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- 7. Insert Initial Tags into note_tags
  -- ============================================================
  DELETE FROM note_tags WHERE note_id IN (
    v_id_regresi, v_id_kmeans, v_id_dtree, v_id_mlp, v_id_cnn,
    v_id_tokenisasi, v_id_sentimen, v_id_spasial, v_id_objdet,
    v_id_agent, v_id_eval, v_id_nb, v_id_bayes, v_id_klas_teks
  );

  INSERT INTO note_tags (note_id, tag) VALUES
    (v_id_regresi, 'machine-learning'), (v_id_regresi, 'supervised-learning'), (v_id_regresi, 'regresi'),
    (v_id_kmeans, 'machine-learning'), (v_id_kmeans, 'unsupervised-learning'), (v_id_kmeans, 'clustering'),
    (v_id_dtree, 'machine-learning'), (v_id_dtree, 'classification'), (v_id_dtree, 'decision-tree'),
    (v_id_mlp, 'deep-learning'), (v_id_mlp, 'neural-network'), (v_id_mlp, 'pytorch'),
    (v_id_cnn, 'deep-learning'), (v_id_cnn, 'computer-vision'), (v_id_cnn, 'cnn'),
    (v_id_tokenisasi, 'nlp'), (v_id_tokenisasi, 'tokenisasi'), (v_id_tokenisasi, 'embeddings'),
    (v_id_sentimen, 'nlp'), (v_id_sentimen, 'sentiment-analysis'), (v_id_sentimen, 'klasifikasi'),
    (v_id_spasial, 'computer-vision'), (v_id_spasial, 'image-processing'),
    (v_id_objdet, 'computer-vision'), (v_id_objdet, 'object-detection'), (v_id_objdet, 'yolo'),
    (v_id_agent, 'ai-fundamentals'), (v_id_agent, 'agents'), (v_id_agent, 'konsep'),
    (v_id_eval, 'ai-fundamentals'), (v_id_eval, 'evaluation'), (v_id_eval, 'metrics'),
    (v_id_nb, 'machine-learning'), (v_id_nb, 'bayes'), (v_id_nb, 'klasifikasi'), (v_id_nb, 'nlp'),
    (v_id_bayes, 'matematika'), (v_id_bayes, 'probabilitas'), (v_id_bayes, 'ai-fundamentals'), (v_id_bayes, 'teori'),
    (v_id_klas_teks, 'nlp'), (v_id_klas_teks, 'klasifikasi'), (v_id_klas_teks, 'text-processing')
  ON CONFLICT DO NOTHING;

END $MIGRATION_VAULT$;
