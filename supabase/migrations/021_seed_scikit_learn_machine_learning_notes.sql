-- ============================================================
-- Migration 021: Seed Scikit-Learn Machine Learning Curriculum Notes
-- Materi Resmi Berbasis Scikit-Learn 1.9 User Guide & Documentation
-- Velqora Knowledge Base — 14 BAB Lengkap Machine Learning
-- ============================================================

DO $SEED_SCIKIT_LEARN_ML_NOTES$
DECLARE
  v_user_id UUID;
  v_parent_ai_id UUID;
  v_cat_ml UUID;
  v_has_icon BOOLEAN;
  v_has_parent BOOLEAN;
BEGIN
  -- 1. Dapatkan user id
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

  -- Kategori Machine Learning
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
  -- SEED 14 BAB MACHINE LEARNING BERBASIS SCIKIT-LEARN
  -- ============================================================

  -- BAB 1: Pengantar Scikit-Learn & Estimator API
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Pengantar Scikit-Learn & Estimator API',
    'bab-1-pengantar-scikit-learn-estimator-api',
    $NOTE_BAB_1$# BAB 1: Pengantar Scikit-Learn & Estimator API

## 1.1 Filosofi Desain Scikit-Learn
Scikit-learn dibangun dengan prinsip desain konsisten yang menjadi standar baku industri *machine learning*:
1. **Konsistensi**: Semua objek berbagi antarmuka yang seragam dan mudah dipelajari.
2. **Inspeksi**: Semua nilai parameter yang diberikan pengguna dan nilai parameter yang dipelajari model dapat diakses secara publik sebagai atribut.
3. **Non-proliferasi Kelas**: Hanya algoritma pembelajaran yang direpresentasikan sebagai kelas kustom. Data direpresentasikan menggunakan tipe bawaan Python, array NumPy, atau DataFrame Pandas.
4. **Komposisi**: Blok-blok pembangun ML dapat digabungkan menjadi alur kerja modular (*Pipelines* dan *ColumnTransformers*).

---

## 1.2 Tiga Antarmuka Utama (Core Interfaces)

### 1. Estimator
Objek apa pun yang mempelajari parameter dari data.
```python
estimator.fit(X, y)
```
- Parameter yang dipelajari selama proses `fit` disimpan dengan akhiran garis bawah (`_`), misalnya `estimator.coef_` atau `estimator.intercept_`.

### 2. Predictor
Estimator yang mampu membuat prediksi untuk sampel data baru.
```python
y_pred = estimator.predict(X_test)
y_prob = estimator.predict_proba(X_test)  # Probabilitas kelas
y_score = estimator.decision_function(X_test)  # Jarak terhadap batas keputusan
```

### 3. Transformer
Estimator yang memodifikasi data mentah menjadi representasi baru.
```python
transformer.fit(X_train)
X_train_trans = transformer.transform(X_train)
# Atau secara simultan:
X_train_trans = transformer.fit_transform(X_train)
```

---

## 1.3 Konvensi Struktur Data
- **Matriks Fitur $X$**: Array 2-dimensi dengan bentuk `(n_samples, n_features)`. Baris mewakili observasi sampel dan kolom mewakili variabel fitur numerik.
- **Vektor Target $y$**: Array 1-dimensi dengan panjang `(n_samples,)` yang berisi nilai kontinu (untuk regresi) atau label kategori (untuk klasifikasi).

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# 1. Muat dataset standar Scikit-learn
iris = load_iris()
X, y = iris.data, iris.target

# 2. Partisi data latih dan uji
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

# 3. Inisialisasi dan pelatihan model
clf = KNeighborsClassifier(n_neighbors=5)
clf.fit(X_train, y_train)

# 4. Prediksi dan evaluasi
y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Akurasi K-NN pada Test Set: {acc * 100:.2f}%")
```
$NOTE_BAB_1$,
    'BookOpen', 1, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 2: Supervised Learning - Linear Models & Regularization
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Supervised Learning - Linear Models & Regularization',
    'bab-2-supervised-learning-linear-models-regularization',
    $NOTE_BAB_2$# BAB 2: Supervised Learning - Linear Models & Regularization

## 2.1 Ordinary Least Squares (OLS)
Model regresi linear memprediksi target $\hat{y}$ sebagai kombinasi linear dari fitur input:
$$\hat{y}(w, x) = w_0 + w_1 x_1 + \dots + w_p x_p$$

Ordinary Least Squares meminimalkan jumlah kuadrat sisa (*residual sum of squares*):
$$\min_{w} \|Xw - y\|_2^2$$

---

## 2.2 Ridge Regression (Regularisasi $\ell_2$)
Ridge regression mengatasi masalah multikolinearitas dan overfitting pada OLS dengan memberikan penalti terhadap besaran kuadrat koefisien:
$$\min_{w} \|Xw - y\|_2^2 + \alpha \|w\|_2^2$$

- Parameter kompleksitas $\alpha \ge 0$ mengontrol derajat penyusutan (*shrinkage*).
- Semakin besar nilai $\alpha$, semakin besar penalti penyusutan, sehingga koefisien menjadi lebih tahan terhadap varians tinggi dan multikolinearitas.
- Solusi analitis Ridge memiliki bentuk tertutup:
$$\hat{w} = (X^T X + \alpha I)^{-1} X^T y$$

```python
from sklearn.linear_model import Ridge, RidgeCV
import numpy as np

X = 1.0 / (np.arange(1, 11) + np.arange(0, 10)[:, np.newaxis])
y = np.ones(10)

# Ridge dengan cross-validation efisien untuk mencari alpha optimal
alphas = np.logspace(-6, 6, 13)
clf = RidgeCV(alphas=alphas, store_cv_values=True).fit(X, y)

print(f"Alpha Optimal Terpilih: {clf.alpha_}")
print(f"Koefisien Model Ridge:\n{clf.coef_}")
```

---

## 2.3 Lasso Regression (Regularisasi $\ell_1$)
Lasso (*Least Absolute Shrinkage and Selection Operator*) meminimalkan fungsi objektif dengan penalti norma $\ell_1$:
$$\min_{w} \frac{1}{2n_{\text{samples}}} \|Xw - y\|_2^2 + \alpha \|w\|_1$$

- Penalti $\ell_1$ mendorong koefisien bernilai tepat nol, sehingga Lasso berfungsi sebagai metode seleksi fitur otomatis (*sparse model*).

```python
from sklearn.linear_model import Lasso

lasso = Lasso(alpha=0.1)
lasso.fit(X, y)
fitur_terpilih = np.sum(lasso.coef_ != 0)
print(f"Jumlah Fitur Aktif (Non-Zero): {fitur_terpilih} dari {len(lasso.coef_)}")
```

---

## 2.4 ElasticNet
ElasticNet menggabungkan penalti $\ell_1$ dan $\ell_2$ secara konveks:
$$\min_{w} \frac{1}{2n_{\text{samples}}} \|Xw - y\|_2^2 + \alpha \rho \|w\|_1 + \frac{\alpha(1-\rho)}{2} \|w\|_2^2$$
Di mana parameter `l1_ratio` ($\rho$) menentukan proporsi antara penalti Lasso dan Ridge.

---

## 2.5 Logistic Regression
Untuk klasifikasi biner dan multikelas, fungsi logistik sigmoid digunakan untuk memetakan nilai kontinu ke probabilitas $[0, 1]$:
$$P(y=1|x) = \frac{1}{1 + e^{-(w^T x + b)}}$$

Dioptimalkan dengan regularisasi parameterized oleh $C = \frac{1}{\lambda}$ (nilai $C$ yang lebih kecil memberikan regularisasi yang lebih kuat).
$NOTE_BAB_2$,
    'BookOpen', 2, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 3: Supervised Learning - Support Vector Machines (SVM)
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Supervised Learning - Support Vector Machines',
    'bab-3-supervised-learning-support-vector-machines',
    $NOTE_BAB_3$# BAB 3: Supervised Learning - Support Vector Machines (SVM)

## 3.1 Konsep Maximum Margin Separator
Support Vector Machine (SVM) bekerja dengan mencari hiperbidang pemisah (*hyperplane*) yang memaksimalkan jarak (*margin*) antara batas keputusan dengan titik-titik data terdekat dari setiap kelas. Titik data terdekat inilah yang disebut sebagai **Support Vectors**.

Formulasi optimasi primal (Soft-Margin SVM):
$$\min_{w, b, \xi} \frac{1}{2} \|w\|^2 + C \sum_{i=1}^{n} \xi_i$$
$$\text{subject to } y_i (w^T \phi(x_i) + b) \ge 1 - \xi_i, \quad \xi_i \ge 0$$

- Parameter $C > 0$ mengontrol kompromi antara margin yang lebar dan toleransi kesalahan klasifikasi pada data training. Nilai $C$ besar menghasilkan margin sempit dengan sedikit pelanggaran (potensi overfitting).

---

## 3.2 The Kernel Trick
Ketika data tidak dapat dipisahkan secara linear di ruang fitur asli, *Kernel Trick* memetakan data ke ruang berdimensi lebih tinggi tanpa perlu menghitung koordinat eksplisit:
$$K(x, x') = \langle \phi(x), \phi(x') \rangle$$

### Fungsi Kernel Populer di Scikit-Learn:
1. **Linear**: $K(x, x') = \langle x, x' \rangle$
2. **Radial Basis Function (RBF / Gaussian)**:
   $$K(x, x') = \exp(-\gamma \|x - x'\|^2)$$
   - Parameter $\gamma$ (*gamma*) menentukan radius pengaruh dari masing-masing support vector.
3. **Polynomial**: $K(x, x') = (\gamma \langle x, x' \rangle + r)^d$
4. **Sigmoid**: $K(x, x') = \tanh(\gamma \langle x, x' \rangle + r)$

```python
from sklearn.svm import SVC
from sklearn.datasets import make_moons
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# Data sintetis non-linear
X, y = make_moons(n_samples=200, noise=0.2, random_state=42)

# Pipeline SVM dengan penskalaan fitur (wajib untuk SVM!)
svm_rbf = make_pipeline(
    StandardScaler(),
    SVC(kernel='rbf', C=1.0, gamma='scale')
)
svm_rbf.fit(X, y)
print(f"Jumlah Support Vectors: {svm_rbf.named_steps['svc'].n_support_}")
```
$NOTE_BAB_3$,
    'BookOpen', 3, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 4: Supervised Learning - Decision Trees & Tree Pruning
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Supervised Learning - Decision Trees & Tree Pruning',
    'bab-4-supervised-learning-decision-trees-pruning',
    $NOTE_BAB_4$# BAB 4: Supervised Learning - Decision Trees & Tree Pruning

## 4.1 Algoritma CART (Classification and Regression Trees)
Pohon keputusan mempartisi ruang fitur secara rekursif menjadi wilayah-wilayah hiper-rektangular ortogonal.

### Kriteria Pemisahan Node:
1. **Gini Impurity** (default klasifikasi):
   $$I_G(p) = 1 - \sum_{k=1}^{K} p_k^2$$
2. **Entropy / Log-Loss**:
   $$H(p) = -\sum_{k=1}^{K} p_k \log_2(p_k)$$
3. **Mean Squared Error (MSE)** untuk regresi:
   $$H(Q_m) = \frac{1}{N_m} \sum_{i \in Q_m} (y_i - \bar{y}_m)^2$$

---

## 4.2 Pengendalian Overfitting & Cost-Complexity Pruning
Pohon yang tumbuh tanpa batas cenderung menghafal data (*overfitting*).

### Parameter Pengendali Pertumbuhan:
- `max_depth`: Batas kedalaman maksimum pohon.
- `min_samples_split`: Jumlah minimum sampel yang diperlukan untuk memecah node internal.
- `min_samples_leaf`: Jumlah minimum sampel yang harus ada di setiap daun node akhir.

### Minimal Cost-Complexity Pruning:
Scikit-learn menyediakan parameter `ccp_alpha` yang meminimalkan fungsi biaya biaya:
$$R_\alpha(T) = R(T) + \alpha |T|$$
Di mana $|T|$ adalah jumlah daun terminal dan $\alpha$ adalah parameter penalti kompleksitas.

```python
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
clf = DecisionTreeClassifier(max_depth=3, criterion='gini', random_state=42)
clf.fit(data.data, data.target)

# Cetak struktur pohon keputusan dalam bentuk teks
tree_rules = export_text(clf, feature_names=list(data.feature_names), max_depth=3)
print(tree_rules[:500])
```
$NOTE_BAB_4$,
    'BookOpen', 4, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 5: Ensemble Methods - Bagging & Random Forest
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Ensemble Methods - Bagging & Random Forest',
    'bab-5-ensemble-methods-bagging-random-forest',
    $NOTE_BAB_5$# BAB 5: Ensemble Methods - Bagging & Random Forest

## 5.1 Bootstrap Aggregating (Bagging)
Metode Bagging membangun banyak estimator secara paralel di atas sampel bootstrap acak (sampel dengan pengembalian / *sampling with replacement*). Prediksi akhir diagregasikan melalui rata-rata (regresi) atau mayoritas suara / voting (klasifikasi).

Efek matematis dari Bagging adalah **mereduksi variansi model tanpa meningkatkan bias**.

---

## 5.2 Random Forest Classifier & Regressor
Random Forest menyempurnakan bagging konvensional dengan menyuntikkan keacakan fitur: pada setiap pencabangan node, pohon hanya diizinkan memilih fitur terbaik dari subset acak fitur berukuran $\sqrt{n_{\text{features}}}$. Hal ini mendekorelasikan pohon-pohon individual sehingga ensemble menjadi jauh lebih akurat dan tangguh terhadap noise.

### Out-of-Bag (OOB) Score
Sekitar 36.8% sampel tidak terpilih dalam setiap sampel bootstrap. Sampel OOB ini digunakan untuk mengestimasi performa generalisasi tanpa memerlukan set validasi terpisah.

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=1000, n_features=20, n_informative=10, random_state=42)

rf = RandomForestClassifier(
    n_estimators=150,
    max_features='sqrt',
    oob_score=True,
    random_state=42,
    n_jobs=-1
)
rf.fit(X, y)

print(f"Out-of-Bag (OOB) Accuracy Score: {rf.oob_score_ * 100:.2f}%")
print(f"Top 3 Feature Importances: {rf.feature_importances_[:3]}")
```
$NOTE_BAB_5$,
    'BookOpen', 5, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 6: Ensemble Methods - Boosting & Stacking
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Ensemble Methods - Boosting & Stacking',
    'bab-6-ensemble-methods-boosting-stacking',
    $NOTE_BAB_6$# BAB 6: Ensemble Methods - Boosting & Stacking

## 6.1 Prinsip Dasar Boosting
Berbeda dengan bagging yang melatih model secara paralel, **Boosting** membangun estimator secara sekuensial. Setiap estimator baru dilatih khusus untuk memperbaiki kesalahan atau residual dari estimator sebelumnya.

---

## 6.2 Algoritma Boosting Utama di Scikit-Learn

### 1. AdaBoost (Adaptive Boosting)
Meningkatkan bobot sampel data yang salah diklasifikasikan pada iterasi sebelumnya.

### 2. Gradient Tree Boosting (`GradientBoostingClassifier`)
Mengoptimalkan fungsi loss sembarang yang dapat diturunkan menggunakan pendekatan *functional gradient descent*.

### 3. Histogram-based Gradient Boosting (`HistGradientBoostingClassifier`)
Terinspirasi dari LightGBM, estimator ini mengelompokkan nilai fitur kontinu ke dalam 256 bin diskrit. Sangat cepat pada dataset besar ($n > 10.000$) dan memiliki dukungan bawaan untuk nilai yang hilang (*native missing values*).

```python
from sklearn.ensemble import HistGradientBoostingClassifier
import numpy as np

# Simulasi dataset besar dengan missing values
X = np.random.randn(5000, 15)
X[np.random.rand(*X.shape) < 0.05] = np.nan  # 5% missing
y = np.random.randint(0, 2, 5000)

hgb = HistGradientBoostingClassifier(max_iter=100, learning_rate=0.1, random_state=42)
hgb.fit(X, y)
print("HistGradientBoosting berhasil dilatih dengan native missing values!")
```

---

## 6.3 Stacking Classifier
Stacking menggabungkan beberapa model heterogen (misalnya SVM, Random Forest, dan KNN) dengan melatih model meta-learner (seperti Logistic Regression) di atas prediksi out-of-fold model dasar.
$NOTE_BAB_6$,
    'BookOpen', 6, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 7: Unsupervised Learning - Clustering
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Unsupervised Learning - Clustering',
    'bab-7-unsupervised-learning-clustering',
    $NOTE_BAB_7$# BAB 7: Unsupervised Learning - Clustering

## 7.1 K-Means & K-Means++
K-Means mempartisi $n$ observasi ke dalam $k$ kluster dengan meminimalkan inersia (*within-cluster sum-of-squares*):
$$\min \sum_{i=0}^{n} \min_{\mu_j \in C} (\|x_i - \mu_j\|^2)$$

Scikit-learn menggunakan inisialisasi **K-Means++** secara default, yang menyebarkan titik awal sentroid secara proporsional terhadap kuadrat jaraknya dari sentroid yang sudah ada, sehingga mencegah jebakan lokal minima yang buruk.

### Evaluasi Kluster:
- **Elbow Method**: Memplot inersia terhadap nilai $k$.
- **Silhouette Coefficient**: Mengukur seberapa dekat satu titik dengan klusternya sendiri dibanding kluster tetangga terdekat:
$$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$$

---

## 7.2 DBSCAN (Density-Based Spatial Clustering)
DBSCAN memandang kluster sebagai area dengan densitas tinggi yang dipisahkan oleh area dengan densitas rendah.
- **Kelebihan**: Tidak memerlukan spesifikasi jumlah kluster di awal, mampu mendeteksi kluster dengan bentuk arbitrary (tidak melingkar/spherical), dan secara otomatis mengidentifikasi outlier/noise (diberi label `-1`).
- Parameter kunci: `eps` (radius ketetanggaan) dan `min_samples` (jumlah titik minimum dalam radius `eps`).

```python
from sklearn.cluster import DBSCAN
from sklearn.datasets import make_moons
import numpy as np

X, _ = make_moons(n_samples=300, noise=0.08, random_state=42)
db = DBSCAN(eps=0.2, min_samples=5).fit(X)

labels = db.labels_
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = list(labels).count(-1)

print(f"Jumlah Kluster Terdeteksi: {n_clusters}")
print(f"Jumlah Titik Noise/Outlier: {n_noise}")
```
$NOTE_BAB_7$,
    'BookOpen', 7, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 8: Unsupervised Learning - Reduksi Dimensi & Dekomposisi
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Unsupervised Learning - Reduksi Dimensi & Dekomposisi',
    'bab-8-unsupervised-learning-reduksi-dimensi',
    $NOTE_BAB_8$# BAB 8: Unsupervised Learning - Reduksi Dimensi & Dekomposisi

## 8.1 Principal Component Analysis (PCA)
PCA memproyeksikan data ke arah ortogonal baru (*principal components*) yang memaksimalkan varians data secara berurutan. Di Scikit-learn, PCA dihitung secara numerik menggunakan *Singular Value Decomposition* (SVD) dari matriks data terpusat:
$$X = U \Sigma V^T$$

- Kolom dari $V$ adalah arah komponen utama.
- Varians yang dijelaskan oleh setiap komponen dapat diakses melalui atribut `explained_variance_ratio_`.

```python
from sklearn.decomposition import PCA
from sklearn.datasets import load_digits
import numpy as np

digits = load_digits()
pca = PCA(n_components=0.95)  # Pertahankan 95% varians data
X_pca = pca.fit_transform(digits.data)

print(f"Dimensi Awal: {digits.data.shape[1]} fitur")
print(f"Dimensi Terkompresi: {X_pca.shape[1]} komponen utama")
```

---

## 8.2 TruncatedSVD & Manifold Learning
- **TruncatedSVD**: Bekerja langsung pada matriks jarang (*sparse matrices*) tanpa memusatkan data, sangat ideal untuk dekomposisi data teks (TF-IDF) dalam *Latent Semantic Analysis* (LSA).
- **t-SNE (`TSNE`)**: Algoritma non-linear manifold learning yang sangat efektif untuk visualisasi sebaran kluster data berdimensi tinggi ke bidang 2D atau 3D.
$NOTE_BAB_8$,
    'BookOpen', 8, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 9: Data Preprocessing & Feature Engineering
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Data Preprocessing & Feature Engineering',
    'bab-9-data-preprocessing-feature-engineering',
    $NOTE_BAB_9$# BAB 9: Data Preprocessing & Feature Engineering

## 9.1 Penskalaan Fitur (Feature Scaling)
Banyak estimator (SVM, Regresi Ter-regularisasi, K-Means, Neural Networks) mengasumsikan semua fitur berpusat di sekitar nol dan memiliki varians dalam skala yang sama.

| Scaler | Formula Matematis | Karakteristik Utama |
| :--- | :--- | :--- |
| `StandardScaler` | $z = \frac{x - \mu}{\sigma}$ | Menjadikan mean = 0, std = 1. Sensitif terhadap outlier ekstrem. |
| `MinMaxScaler` | $z = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$ | Menormalisasi ke rentang $[0, 1]$. Mempertahankan nilai nol pada data jarang. |
| `RobustScaler` | $z = \frac{x - Q_2}{Q_3 - Q_1}$ | Menggunakan median dan IQR. Sangat tangguh terhadap outlier. |

---

## 9.2 Imputasi Nilai yang Hilang (Missing Values)
- `SimpleImputer`: Mengisi nilai kosong dengan statistik univariat (`mean`, `median`, `most_frequent`, atau `constant`).
- `KNNImputer`: Mengisi nilai kosong menggunakan rata-rata terdekat dari tetangga $k$ terdekat berbasis jarak Euclidean.

---

## 9.3 Encoding Data Kategorikal
- `OneHotEncoder`: Mengubah kategori menjadi biner dummy. Gunakan `handle_unknown='ignore'` untuk menangani kategori baru di fase testing/produksi.
- `OrdinalEncoder`: Memetakan kategori ke bilangan bulat terurut.
$NOTE_BAB_9$,
    'BookOpen', 9, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 10: Composing Estimators - Pipelines & ColumnTransformer
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Composing Estimators - Pipelines & ColumnTransformer',
    'bab-10-composing-estimators-pipelines-columntransformer',
    $NOTE_BAB_10$# BAB 10: Composing Estimators - Pipelines & ColumnTransformer

## 10.1 Mengapa Pipeline adalah Keharusan Mutlak?
Kesalahan umum yang paling berbahaya dalam machine learning adalah **Data Leakage** — ketika statistik dari set uji bocor ke dalam data pelatihan saat penskalaan atau imputasi.

Dengan `Pipeline`, seluruh proses dari penskalaan, transformasi, hingga prediksi dibungkus dalam satu objek atomic:
- Saat `pipeline.fit(X_train, y_train)`: parameter transformator dipelajari **hanya** dari `X_train`.
- Saat `pipeline.predict(X_test)`: `X_test` hanya ditransformasikan menggunakan parameter yang sudah dipelajari.

---

## 10.2 ColumnTransformer untuk Data Campuran
Sebagian besar dataset tabular bisnis memiliki kolom numerik dan kategorikal sekaligus:

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier

numeric_features = ['age', 'income', 'monthly_spend']
categorical_features = ['gender', 'city', 'device_type']

numeric_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer([
    ('num', numeric_transformer, numeric_features),
    ('cat', categorical_transformer, categorical_features)
])

# Pipeline Lengkap Siap Latih & Deploy
full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])
```
$NOTE_BAB_10$,
    'BookOpen', 10, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 11: Model Selection & Cross-Validation
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Model Selection & Cross-Validation',
    'bab-11-model-selection-cross-validation',
    $NOTE_BAB_11$# BAB 11: Model Selection & Cross-Validation

## 11.1 Strategi Cross-Validation (Validasi Silang)
Mengevaluasi model pada set pengujian tunggal rentan terhadap fluktuasi statistik acak. K-Fold Cross-Validation membagi data menjadi $K$ bagian sama besar, di mana setiap bagian bergantian menjadi set uji dan sisanya menjadi set latih.

### Jenis CV Populer:
1. `KFold`: Pembagian acak standar untuk data seimbang.
2. `StratifiedKFold`: Mempertahankan persentase tiap kelas target pada setiap lipatan (*wajib untuk klasifikasi imbalanced!*).
3. `TimeSeriesSplit`: Partisi bertahap maju ke depan tanpa mengacak urutan waktu, mencegah kebocoran informasi masa depan.
4. `GroupKFold`: Memastikan data dari kelompok/pasien/pengguna yang sama tidak pernah tersebar di train dan test set secara bersamaan.

```python
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_breast_cancer

X, y = load_breast_cancer(return_X_y=True)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
clf = LogisticRegression(max_iter=1000)

scores = cross_val_score(clf, X, y, cv=cv, scoring='roc_auc')
print(f"ROC-AUC CV Rata-rata: {scores.mean():.4f} (±{scores.std():.4f})")
```
$NOTE_BAB_11$,
    'BookOpen', 11, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 12: Hyperparameter Tuning & Validation Curves
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Hyperparameter Tuning & Validation Curves',
    'bab-12-hyperparameter-tuning-validation-curves',
    $NOTE_BAB_12$# BAB 12: Hyperparameter Tuning & Validation Curves

## 12.1 GridSearchCV vs RandomizedSearchCV

### 1. GridSearchCV (Exhaustive Search)
Mencoba semua kemungkinan kombinasi parameter dari kisi yang ditentukan. Sangat teliti namun boros komputasi jika kombinasi parameter sangat banyak.

### 2. RandomizedSearchCV (Randomized Parameter Optimization)
Mengambil sampel kombinasi hyperparameter dari distribusi probabilitas dengan jumlah iterasi `n_iter` yang telah ditetapkan. Jauh lebih cepat dan seringkali menghasilkan performa yang setara atau lebih baik dibanding Grid Search dalam waktu yang jauh lebih singkat.

```python
from sklearn.model_selection import RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from scipy.stats import randint

param_dist = {
    'n_estimators': randint(50, 300),
    'max_depth': [None, 5, 10, 15, 20],
    'min_samples_split': randint(2, 11),
    'max_features': ['sqrt', 'log2', None]
}

search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_distributions=param_dist,
    n_iter=20,
    cv=5,
    scoring='f1',
    random_state=42,
    n_jobs=-1
)
search.fit(X, y)

print(f"Skor Terbaik: {search.best_score_:.4f}")
print("Parameter Terbaik:", search.best_params_)
```
$NOTE_BAB_12$,
    'BookOpen', 12, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 13: Evaluasi Model & Visualisasi Prediksi
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: Evaluasi Model & Visualisasi Prediksi',
    'bab-13-evaluasi-model-visualisasi-prediksi',
    $NOTE_BAB_13$# BAB 13: Evaluasi Model & Visualisasi Prediksi

## 13.1 Metrik Klasifikasi Komprehensif
- **Accuracy**: $\frac{TP + TN}{TP + TN + FP + FN}$ (Hanya informatif jika kelas seimbang).
- **Precision**: $\frac{TP}{TP + FP}$ (Kritikal saat biaya false positive tinggi).
- **Recall / Sensitivity**: $\frac{TP}{TP + FN}$ (Kritikal saat biaya false negative tinggi).
- **F1-Score**: Rata-rata harmonik Precision dan Recall.
- **ROC-AUC**: Luas area di bawah kurva True Positive Rate vs False Positive Rate pada berbagai ambang threshold.

---

## 13.2 Visualisasi Bawaan Scikit-Learn (Display API)
Scikit-learn menyediakan modul visualisasi modern yang bekerja langsung dengan estimator:

```python
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    RocCurveDisplay,
    classification_report
)
import matplotlib.pyplot as plt

# 1. Confusion Matrix
fig, ax = plt.subplots(figsize=(6, 5))
ConfusionMatrixDisplay.from_estimator(
    clf, X_test, y_test,
    display_labels=['Negatif', 'Positif'],
    cmap='Blues',
    ax=ax
)
ax.set_title("Confusion Matrix Evaluasi Model")
plt.tight_layout()

# 2. ROC Curve
RocCurveDisplay.from_estimator(clf, X_test, y_test)
plt.title("Kurva Karakteristik Operasi Penerima (ROC)")
```
$NOTE_BAB_13$,
    'BookOpen', 13, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- BAB 14: Model Inspection, Pitfalls & Deployment
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 14: Model Inspection, Pitfalls & Deployment',
    'bab-14-model-inspection-pitfalls-deployment',
    $NOTE_BAB_14$# BAB 14: Model Inspection, Pitfalls & Deployment

## 14.1 Permutation Feature Importance
Berbeda dengan feature importance bawaan pohon (MDI) yang bias terhadap fitur berkardinalitas tinggi, **Permutation Importance** mengukur penurunan performa model ketika nilai suatu fitur diacak secara acak pada set validasi:

```python
from sklearn.inspection import permutation_importance

result = permutation_importance(clf, X_test, y_test, n_repeats=10, random_state=42)
for i in result.importances_mean.argsort()[::-1]:
    if result.importances_mean[i] - 2 * result.importances_std[i] > 0:
        print(f"Fitur {i:2d}: {result.importances_mean[i]:.4f} +/- {result.importances_std[i]:.4f}")
```

---

## 14.2 Model Persistence (Serialisasi & Deployment)
Untuk menerapkan model machine learning terlatih ke lingkungan produksi (misalnya REST API microservice menggunakan FastAPI), gunakan pustaka `joblib`:

```python
import joblib

# 1. Simpan model terlatih (termasuk pipeline preprocessor-nya)
joblib.dump(full_pipeline, 'model_terlatih_v1.joblib')

# 2. Muat kembali model saat server dinyalakan
model_deploy = joblib.load('model_terlatih_v1.joblib')

# 3. Inferensi langsung pada data masukan baru
prediksi = model_deploy.predict(data_baru)
```

---

## 14.3 Pitfalls Terbesar Machine Learning yang Wajib Dihindari
1. **Data Leakage**: Melakukan penskalaan (*fit_transform*) sebelum split data train-test.
2. **Target Leakage**: Memasukkan fitur input yang baru tersedia setelah peristiwa target terjadi.
3. **Improper Metric Selection**: Menggunakan Akurasi pada kasus penipuan (*fraud*) atau penyakit langka (99% data bernilai negatif).
4. **Data Drift**: Mengabaikan perubahan distribusi data statistik dunia nyata seiring berjalannya waktu.
$NOTE_BAB_14$,
    'BookOpen', 14, v_cat_ml, false, v_user_id
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

END $SEED_SCIKIT_LEARN_ML_NOTES$;
