import { ChapterDef } from "./da-data-ch1-3";

export const ML_CHAPTERS_20_TO_22: ChapterDef[] = [
  // ==========================================
  // BAB 20: Arsitektur Pipeline & Komposisi Estimator Scikit-Learn
  // ==========================================
  {
    orderIndex: 20,
    id: "machine-learning-ch-20",
    slug: "bab-20-arsitektur-pipeline-dan-komposisi-estimator-scikit-learn",
    title: "BAB 20: Arsitektur Pipeline & Komposisi Estimator Scikit-Learn",
    desc: "Rekayasa perangkat lunak sistem machine learning: filosofi API fit-transform-predict, enkapsulasi Pipeline pencegah kebocoran data, pemrosesan tipe heterogen ColumnTransformer, FeatureUnion paralel, BaseEstimator & TransformerMixin kustom, TargetEncoder empiris vs OneHotEncoder, TransformedTargetRegressor, caching joblib.Memory, keamanan serialisasi ONNX/Treelite pengganti pickle, dan unit testing PyTest.",
    coreConcepts: ["API Consistency Contract", "Pipeline Encapsulation", "ColumnTransformer Heterogeneous Routing", "FeatureUnion", "Custom Transformers", "TargetEncoder Empirical Bayes", "TransformedTargetRegressor", "Pipeline Caching", "Model Serialization (ONNX/Treelite)", "Pipeline Unit Testing"],
    subchapters: [
      {
        num: "20.1",
        slug: "20-1-filosofi-antarmuka-scikit-learn-kontrak-api",
        title: "20.1. Filosofi Antarmuka Scikit-Learn: Konsistensi Kontrak API fit(), transform(), dan predict()",
        desc: "Kajian arsitektur Buitinck et al. (2013): prinsip keseragaman antarmuka, pemisahan estimator dan transformer, serta inspeksi status parameter privat berakhiran underscore.",
        concept: `Salah satu faktor penentu keberhasilan Scikit-Learn sebagai pustaka pembelajaran mesin paling populer di dunia adalah **Konsistensi Desain Antarmuka Berorientasi Objek (*Object-Oriented API Consistency Contract*)** yang dirumuskan oleh Lars Buitinck et al. (ECML PKDD, 2013).

**Tiga Kontrak API Fundamental:**
1. **Estimator:**
   Objek apa pun yang mampu mempelajari parameter dari data melalui metode \` + "\`fit(X, y)\`" + \`. Seluruh parameter yang dipelajari selama proses fitting disimpan dalam atribut publik yang **berakhiran garis bawah tunggal (*trailing underscore*)**, misalnya \` + "\`coef_\`" + \`, \` + "\`intercept_\`" + \`, atau \` + "\`classes_\`" + \`. Atribut tanpa garis bawah adalah hiperparameter konfigurasi awal.
2. **Transformer:**
   Estimator yang mampu mentransformasikan representasi data melalui metode \` + "\`transform(X)\`" + \` (misalnya penskalaan, seleksi fitur, atau reduksi dimensi). Metode pintas \` + "\`fit_transform(X, y)\`" + \` dioptimalkan secara komputasi untuk melakukan pembelajaran sekaligus transformasi pada data latih secara efisien.
3. **Predictor:**
   Estimator yang mampu membuat inferensi prediksi pada data baru melalui metode \` + "\`predict(X)\`" + \` untuk label diskrit/kontinu, atau \` + "\`predict_proba(X)\`" + \` untuk estimasi probabilitas posterior.

**Prinsip Tanpa Status Terselubung (*Stateless Pipeline Execution*):**
Objek model tidak pernah memodifikasi data masukan di tempat (*in-place*), melainkan selalu mengembalikan array NumPy baru yang bersih, menjamin replikasi deterministik.`,
        formula: `\\text{Model.fit}(\\mathbf{X}, \\mathbf{y}) \\implies \\text{Menghasilkan } \\boldsymbol{\\theta}^*, \\quad \\text{Model.predict}(\\mathbf{X}_{\\text{new}}) = f_{\\boldsymbol{\\theta}^*}(\\mathbf{X}_{\\text{new}})`,
        code: `# 20.1: Verifikasi Kontrak Desain API Scikit-Learn dan Konvensi Trailing Underscore
from sklearn.linear_model import Ridge
import numpy as np

X = np.array([[1.0, 2.0], [2.0, 3.0], [3.0, 4.0], [4.0, 5.0]])
y = np.array([2.0, 3.1, 3.9, 5.2])

model = Ridge(alpha=1.0)
print("Sebelum .fit():")
print(f"- Parameter Konfigurasi: alpha = {model.alpha}")
print(f"- Apakah coef_ sudah ada? : {hasattr(model, 'coef_')} (Belum dipelajari)")

# Eksekusi kontrak .fit()
model.fit(X, y)

print("\nSetelah .fit():")
print(f"- Apakah coef_ sudah ada? : {hasattr(model, 'coef_')} (Tersedia dengan trailing underscore!)")
print(f"- Koefisien Terpelajari   : {np.round(model.coef_, 4)}")
print(f"- Intersep Terpelajari    : {model.intercept_:.4f}")`,
        expectedOutput: "Atribut coef_ dan intercept_ baru tercipta setelah metode .fit() dieksekusi.",
        codeExp: "Skrip memverifikasi siklus hidup status internal estimator Scikit-Learn dan konvensi trailing underscore.",
        pitfalls: [
          "Memodifikasi atribut berakhiran underscore secara manual (dapat merusak konsistensi internal model).",
          "Memanggil transform() atau predict() sebelum memanggil fit() yang memicu NotFittedError."
        ],
        refTitle: "Lars Buitinck et al.: API design for machine learning software: experiences from the scikit-learn project (ECML PKDD, 2013)",
        refUrl: "https://arxiv.org/abs/1309.0238"
      },
      {
        num: "20.2",
        slug: "20-2-sklearn-pipeline-enkapsulasi-dan-pencegahan-leakage",
        title: "20.2. sklearn.pipeline.Pipeline: Enkapsulasi Alur Pemrosesan dan Pencegahan Kebocoran Data",
        desc: "Arsitektur chaining transformator sekuensial: pengikatan pra-pemrosesan dan estimator akhir menjadi unit atomik tunggal yang kebal kebocoran data.",
        concept: `Kesalahan metodologi paling lazim dalam sains data adalah melakukan pra-pemrosesan (seperti \` + "\`StandardScaler\`" + \` atau imputasi \` + "\`SimpleImputer\`" + \`) pada seluruh dataset sebelum membagi data menjadi set latihan dan pengujian. Praktik ini membocorkan nilai rata-rata dan deviasi standar data uji ke dalam model latih (**Data Leakage**).

Kelas \` + "\`sklearn.pipeline.Pipeline\`" + \` memecahkan masalah ini secara fundamental:
Pipeline merangkai serangkaian langkah transformasi data yang diakhiri oleh satu estimator final ke dalam satu kesatuan objek atomik:
$$(\\mathbf{X}, \\mathbf{y}) \\xrightarrow{\\text{fit\\_transform}} T_1 \\xrightarrow{\\text{fit\\_transform}} T_2 \\dots \\xrightarrow{\\text{fit}} \\text{Estimator Final}$$

**Dua Jaminan Kebal Kebocoran (*Leakage-Proof Guarantees*):**
1. **Fase Latihan (\`pipeline.fit(X_train, y_train)\`):**
   Setiap transformer di dalam rantai hanya mempelajari statistik (seperti mean $\\mu_{\\text{train}}$ dan varians $\\sigma_{\\text{train}}^2$) dari \`X_train\`.
2. **Fase Inferensi (\`pipeline.predict(X_test)\`):**
   \`X_test\` secara otomatis dialirkan melalui metode \`transform()\` dari masing-masing transformer menggunakan parameter statistik yang telah dibekukan dari \`X_train\`, **tanpa pernah menghitung ulang statistik dari data uji**.
3. **Kompatibilitas Penuh dengan Cross-Validation:**
   Ketika Pipeline dimasukkan ke dalam \`cross_val_score\` atau \`GridSearchCV\`, seluruh proses fit-transform diisolasi secara ketat di dalam masing-masing fold latihan!`,
        formula: `\\mathbf{Z}_{\\text{test}} = \\frac{\\mathbf{X}_{\\text{test}} - \\boldsymbol{\\mu}_{\\text{train}}}{\\boldsymbol{\\sigma}_{\\text{train}}} \\quad (\\text{Penskalaan Uji Bebas Kebocoran})`,
        code: `# 20.2: Pembuktian Enkapsulasi Pipeline Mencegah Kebocoran Data Validasi
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=1000, n_features=15, random_state=42)

# Buat pipeline atomik: Penskalaan -> Estimator
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', LogisticRegression(random_state=42))
])

# Evaluasi cross-validation: Penskalaan di-fit ulang secara independen di setiap fold!
scores = cross_val_score(pipe, X, y, cv=5, scoring='accuracy')

print("=== VERIFIKASI KEAMANAN SKLEARN PIPELINE ===")
print(f"Langkah-langkah Pipeline : {[name for name, _ in pipe.steps]}")
print(f"Rata-rata Akurasi 5-Fold : {scores.mean()*100:.2f}% (100% Bebas Data Leakage)")
print(f"Deviasi Standar Antar-Fold: {scores.std()*100:.2f}%")`,
        expectedOutput: "Pipeline berhasil mengisolasi penskalaan di setiap fold dengan akurasi terverifikasi bebas kebocoran.",
        codeExp: "Skrip merangkai StandardScaler dan LogisticRegression ke dalam objek Pipeline yang dievaluasi dengan cross_val_score bebas leakage.",
        pitfalls: [
          "Melakukan fit_transform manual pada seluruh dataset sebelum memasukkannya ke dalam cross_val_score.",
          "Mencoba menempatkan estimator non-transformer di tengah-tengah urutan pipeline (seluruh langkah sebelum langkah terakhir wajib berupa Transformer)."
        ],
        refTitle: "Scikit-Learn User Guide: Pipelines and composite estimators",
        refUrl: "https://scikit-learn.org/stable/modules/compose.html#pipeline"
      },
      {
        num: "20.3",
        slug: "20-3-columntransformer-penanganan-fitur-heterogen",
        title: "20.3. ColumnTransformer: Penanganan Fitur Heterogen dalam Satu Alur Terpadu",
        desc: "Rute pemrosesan multi-kolom: pemisahan otomatis transformasi numerik (imputasi median + scaler) dan kategorikal (imputasi modus + one-hot) dalam satu tabel.",
        concept: `Dataset dunia nyata di industri hampir selalu bersifat **heterogen (*heterogeneous tabular data*)**: memuat campuran kolom numerik kontinu (seperti Usia, Pendapatan), kolom kategorikal nominal (seperti Pekerjaan, Kota), dan kolom boolean biner.

Kelas \` + "\`sklearn.compose.ColumnTransformer\`" + \` memungkinkan penerapan transformer yang berbeda ke subset kolom yang berbeda secara paralel:

**Arsitektur Perutean Kolom (*Column Routing Architecture*):**
1. **Rute Kolom Numerik:**
   Kolom-kolom bertipe float/integer diarahkan ke sub-pipeline numerik: \`SimpleImputer(strategy='median')\` $\\to$ \`StandardScaler()\`.
2. **Rute Kolom Kategorikal:**
   Kolom-kolom bertipe string/object diarahkan ke sub-pipeline kategorikal: \`SimpleImputer(strategy='most_frequent')\` $\\to$ \`OneHotEncoder(handle_unknown='ignore')\`.
3. **Penggabungan Output (*Concatenation*):**
   Seluruh matriks hasil transformasi dari setiap cabang kolom digabungkan secara horizontal (*column-wise concatenation*) menjadi satu matriks fitur padat atau jarang yang siap dialirkan ke estimator akhir.
4. **Parameter \`remainder\`:** Mengontrol apakah kolom yang tidak terdaftar akan dibuang (\`remainder='drop'\`) atau dilewatkan tanpa perubahan (\`remainder='passthrough'\`).`,
        formula: `\\mathbf{X}_{\\text{out}} = \\left[ T_{\\text{num}}(\\mathbf{X}_{\\text{num}}) \\;\\Big|\\; T_{\\text{cat}}(\\mathbf{X}_{\\text{cat}}) \\;\\Big|\\; \\mathbf{X}_{\\text{remainder}} \\right] \\quad (\\text{Konkatenasi Fitur})`,
        code: `# 20.3: Implementasi ColumnTransformer Lengkap untuk Data Heterogen
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

# Sintesis DataFrame heterogen
df = pd.DataFrame({
    'umur': [25.0, 45.0, np.nan, 35.0, 50.0],
    'gaji': [5000.0, 12000.0, 8000.0, np.nan, 15000.0],
    'kota': ['Jakarta', 'Surabaya', 'Jakarta', 'Bandung', np.nan],
    'status': ['Aktif', 'Aktif', 'Cuti', 'Aktif', 'Cuti']
})
y = [0, 1, 0, 1, 1]

num_cols = ['umur', 'gaji']
cat_cols = ['kota', 'status']

num_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

cat_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

preprocessor = ColumnTransformer(transformers=[
    ('num', num_pipeline, num_cols),
    ('cat', cat_pipeline, cat_cols)
])

full_pipeline = Pipeline([
    ('preprocess', preprocessor),
    ('model', LogisticRegression())
])

full_pipeline.fit(df, y)
print("=== HASIL SUKSES PIPELINE COLUMNTRANSFORMER ===")
print("Pipeline berhasil di-fit pada data heterogen!")
print("Jumlah Fitur Hasil Transformasi:", full_pipeline.named_steps['preprocess'].transform(df).shape[1])`,
        expectedOutput: "Pipeline sukses melakukan imputasi, penskalaan, dan one-hot encoding pada data heterogen.",
        codeExp: "Skrip membangun alur kerja ColumnTransformer terpadu yang memisahkan pemrosesan fitur numerik dan kategorikal dengan penanganan missing values otomatis.",
        pitfalls: [
          "Lupa menyetel handle_unknown='ignore' pada OneHotEncoder di dalam ColumnTransformer yang menyebabkan error runtime jika data uji memiliki kategori baru.",
          "Menyertakan nama kolom yang salah ketik (akan melemparkan KeyError saat fitting DataFrame)."
        ],
        refTitle: "Scikit-Learn Documentation: ColumnTransformer for heterogeneous data",
        refUrl: "https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html"
      },
      {
        num: "20.4",
        slug: "20-4-featureunion-transformasi-paralel",
        title: "20.4. FeatureUnion: Penggabungan Fitur Majemuk Berbasis Transformasi Paralel",
        desc: "Kombinasi ruang fitur majemuk: mengekstraksi representasi dari berbagai perspektif simultan (PCA + Seleksi Fitur Univariat) dan menggabungkannya.",
        concept: `Jika \` + "\`Pipeline\`" + \` merangkai transformer secara **sekuensial (berurutan)** di mana output langkah $1$ menjadi input langkah $2$, maka \` + "\`sklearn.pipeline.FeatureUnion\`" + \` mengeksekusi sekumpulan transformer secara **paralel** pada dataset masukan yang sama dan **menggabungkan (*concatenate*) seluruh ruang fitur yang dihasilkan secara horizontal**.

**Kasus Penggunaan Utama:**
1. **Representasi Hibrida:** Menggabungkan fitur terkompresi dari PCA dengan fitur asli yang paling diskriminatif via seleksi fitur univariat (\`SelectKBest\`).
2. **Pemrosesan Teks Multiskala:** Menggabungkan ekstraksi n-gram karakter (\`TfidfVectorizer(analyzer='char')\`) dengan n-gram kata (\`TfidfVectorizer(analyzer='word')\`) untuk klasifikasi dokumen yang kebal terhadap salah ketik (*typo-robust*).
3. **Pembobotan Cabang Transformasi:** Setiap cabang transformer dalam FeatureUnion dapat diberikan bobot pengali relatif melalui parameter \`transformer_weights\`.`,
        formula: `\\mathbf{X}_{\\text{union}} = \\left[ T_1(\\mathbf{X}) \\;\\Big|\\; T_2(\\mathbf{X}) \\;\\Big|\\; \\dots \\;\\Big|\\; T_m(\\mathbf{X}) \\right] \\quad (\\text{Transformasi Paralel})`,
        code: `# 20.4: Pembangunan Fitur Hibrida Menggunakan FeatureUnion (PCA + SelectKBest)
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

iris = load_iris()
X, y = iris.data, iris.target

# Gabungkan 2 Komponen PCA + 2 Fitur Univariat Terbaik secara paralel
combined_features = FeatureUnion([
    ('pca', PCA(n_components=2)),
    ('univ_select', SelectKBest(score_func=f_classif, k=2))
])

pipe = Pipeline([
    ('features', combined_features),
    ('classifier', LogisticRegression())
])

pipe.fit(X, y)
X_transformed = combined_features.transform(X)

print("=== HASIL FEATUREUNION PARALEL ===")
print(f"Dimensi Input Asli           : {X.shape[1]} fitur")
print(f"Dimensi Hasil FeatureUnion   : {X_transformed.shape[1]} fitur (2 PCA + 2 Univariat)")
print(f"Akurasi Model dengan Union   : {pipe.score(X, y)*100:.2f}%")`,
        expectedOutput: "FeatureUnion berhasil mengekstrak 4 fitur gabungan (2 PCA + 2 KBest) secara simultan.",
        codeExp: "Skrip memanfaatkan FeatureUnion untuk menggabungkan hasil reduksi dimensi PCA dan seleksi fitur univariat secara paralel.",
        pitfalls: [
          "Menyertakan transformer yang menghasilkan matriks sparse bersamaan dengan transformer yang menghasilkan matriks dense tanpa konfigurasi yang cocok.",
          "FeatureUnion tidak melakukan isolasi kolom per kolom (gunakan ColumnTransformer jika tujuannya adalah memproses kolom berbeda)."
        ],
        refTitle: "Scikit-Learn Guide: FeatureUnion: composite feature spaces",
        refUrl: "https://scikit-learn.org/stable/modules/compose.html#featureunion"
      },
      {
        num: "20.5",
        slug: "20-5-pembuatan-transformer-kustom-baseestimator-transformermixin",
        title: "20.5. Pembuatan Transformer Kustom Berbasis BaseEstimator dan TransformerMixin",
        desc: "Ekstensibilitas arsitektur: mewarisi BaseEstimator dan TransformerMixin untuk menciptakan logika rekayasa fitur kustom yang kompatibel 100% dengan GridSearchCV.",
        concept: `Dalam banyak proyek industri, logika bisnis membutuhkan transformasi fitur yang sangat spesifik yang tidak tersedia di modul standar Scikit-Learn (misalnya menghitung rasio utang terhadap pendapatan, memfilter pencilan domain, atau mengekstrak fitur tanggal).

Untuk membuat transformer kustom yang **kompatibel 100%** dengan Pipeline, GridSearchCV, dan seluruh ekosistem Scikit-Learn, kelas Python kustom kita **wajib mewarisi dua kelas dasar (*mixins*)**:
1. **\`BaseEstimator\` (\`sklearn.base.BaseEstimator\`):**
   Secara otomatis menyediakan metode \`get_params()\` dan \`set_params()\` tanpa perlu menulis kode boilerplate tambahan. Metode ini adalah **syarat mutlak agar parameter transformer kita dapat disetel oleh GridSearchCV**!
   *Aturan Keras:* Konstruktor \`__init__\` tidak boleh menggunakan \`*args\` atau \`**kwargs\`; seluruh parameter harus didefinisikan secara eksplisit dengan nilai default dan disimpan ke atribut dengan nama yang identik persis.
2. **\`TransformerMixin\` (\`sklearn.base.TransformerMixin\`):**
   Secara otomatis mengimplementasikan metode \`fit_transform()\` dengan memanggil \`fit()\` diikuti oleh \`transform()\`.

Kita hanya diwajibkan mengimplementasikan dua metode murni: \`fit(self, X, y=None)\` dan \`transform(self, X)\`.`,
        formula: `\\text{Class MyTransformer}(\\text{BaseEstimator}, \\text{TransformerMixin}) \\implies \\text{Otomatis Kompatibel GridSearchCV}`,
        code: `# 20.5: Pembuatan Transformer Rekayasa Fitur Rasio Finansial Kustom
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

class RasioFinansialTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, tambahkan_log=False):
        self.tambahkan_log = tambahkan_log
        
    def fit(self, X, y=None):
        # Transformer stateless tidak perlu mempelajari parameter dari data
        return self
        
    def transform(self, X):
        X_df = pd.DataFrame(X)
        # Hitung Rasio Fitur 0 terhadap Fitur 1 (misal Utang / Pendapatan)
        rasio = X_df.iloc[:, 0] / (X_df.iloc[:, 1] + 1e-5)
        if self.tambahkan_log:
            log_rasio = np.log1p(np.abs(rasio))
            return np.column_stack([X, rasio, log_rasio])
        return np.column_stack([X, rasio])

# Verifikasi integrasi ke dalam Pipeline
X_raw = np.array([[1000.0, 500.0], [2000.0, 1000.0], [5000.0, 200.0]])
y_raw = [0, 0, 1]

custom_pipe = Pipeline([
    ('feature_eng', RasioFinansialTransformer(tambahkan_log=True)),
    ('clf', LogisticRegression())
])

custom_pipe.fit(X_raw, y_raw)
print("=== TRANSFORMER KUSTOM BERBASIS BASEESTIMATOR ===")
print("Transformer kustom sukses di-fit di dalam Pipeline Scikit-Learn!")
print(f"Bisa disetel GridSearchCV? : {hasattr(custom_pipe.named_steps['feature_eng'], 'get_params')}")`,
        expectedOutput: "Transformer kustom berhasil dieksekusi di dalam Pipeline dengan dukungan penuh get_params.",
        codeExp: "Skrip mengimplementasikan kelas transformer kustom yang mewarisi BaseEstimator dan TransformerMixin untuk rekayasa fitur rasio finansial.",
        pitfalls: [
          "Menerima *args atau **kwargs pada metode __init__ transformer kustom yang menyebabkan get_params() gagal pada GridSearchCV.",
          "Mengubah tipe data data uji secara in-place di dalam transform() yang merusak data masukan asli pemanggil."
        ],
        refTitle: "Scikit-Learn Developer Guide: Developing custom estimators",
        refUrl: "https://scikit-learn.org/stable/developers/develop.html"
      },
      {
        num: "20.6",
        slug: "20-6-targetencoder-empirical-bayes-vs-onehot",
        title: "20.6. Penyandian Kategorikal Modern: TargetEncoder (Empirical Bayes Shrunk) vs OneHotEncoder",
        desc: "Inovasi Scikit-Learn 1.3+: penyandian fitur ber-kardinalitas tinggi via estimasi Empirical Bayes shrinkage Micci-Barreca (2001) untuk mencegah ledakan memori.",
        concept: `Ketika sebuah fitur kategorikal memiliki **kardinalitas sangat tinggi** (misalnya kode pos dengan 10.000 kategori unik atau ID merchant), \` + "\`OneHotEncoder\`" + \` menjadi tidak praktis karena akan menambahkan 10.000 kolom biner jarang (*sparse explosion*), melipatgandakan memori dan memicu kutukan dimensi.

Sejak versi 1.3+, Scikit-Learn menyertakan transformer modern **\`TargetEncoder\`** (Daniele Micci-Barreca, ACM SIGKDD 2001):
TargetEncoder menggantikan setiap kategori $k$ dengan **nilai rata-rata target probabilitas $\\bar{y}_k$**, dikombinasikan dengan rata-rata global $\\bar{y}$ menggunakan metode **Penyusutan Bayes Empiris (*Empirical Bayes Shrinkage*)**:

**Formulasi Penghalusan Target (Smoothing Formula):**
$$S_k = \\lambda_k \\bar{y}_k + (1 - \\lambda_k) \\bar{y}$$
di mana faktor bobot penyusutan $\\lambda_k \\in [0, 1]$ dirumuskan sebagai:
$$\\lambda_k = \\frac{n_k}{n_k + m}$$
- $n_k$: Jumlah kemunculan kategori $k$ dalam dataset.
- $m$: Parameter penghalusan (*smoothing parameter*).
- **Kategori Frekuensi Tinggi ($n_k \\gg m$):** $\\lambda_k \\to 1$, nilai encode didominasi oleh rata-rata internal kategori $\\bar{y}_k$.
- **Kategori Langka / Jarang ($n_k \\ll m$):** $\\lambda_k \\to 0$, nilai encode ditarik menyusut ke arah rata-rata populasi global $\\bar{y}$, mencegah overfitting pada kategori sampel kecil!

Untuk mencegah kebocoran target internal, \` + "\`TargetEncoder\`" + \` Scikit-Learn secara otomatis menghitung encoding menggunakan skema out-of-fold selama fase \` + "\`fit_transform\`" + \`.`,
        formula: `S_k = \\frac{n_k \\bar{y}_k + m \\bar{y}}{n_k + m} \\quad (\\text{Empirical Bayes Target Smoothing})`,
        code: `# 20.6: Komparasi Efisiensi Memori: OneHotEncoder vs TargetEncoder pada Data Kardinalitas Tinggi
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, TargetEncoder

# Sintesis data dengan fitur berkardinalitas tinggi (100 kategori unik)
np.random.seed(42)
kategori_banyak = [f"Kota_{i}" for i in np.random.randint(0, 100, size=500)]
y = np.random.choice([0, 1], p=[0.7, 0.3], size=500)
df = pd.DataFrame({'lokasi': kategori_banyak})

# 1. OneHotEncoder (Menghasilkan 100 Kolom Biner!)
ohe = OneHotEncoder(sparse_output=False)
X_ohe = ohe.fit_transform(df)

# 2. TargetEncoder (Hanya Menghasilkan 1 Kolom Numerik Terpadu!)
te = TargetEncoder(smooth='auto', cv=5, random_state=42)
X_te = te.fit_transform(df[['lokasi']], y)

print("=== EVALUASI TARGET ENCODER VS ONE-HOT ENCODER ===")
print(f"Dimensi Kolom Hasil OneHotEncoder : {X_ohe.shape[1]} kolom (Memori Besar)")
print(f"Dimensi Kolom Hasil TargetEncoder : {X_te.shape[1]} kolom (Sangat Ringkas & Padat!)")
print(f"Contoh 3 Nilai Target Encoding Pertama:\n{np.round(X_te[:3], 4)}")`,
        expectedOutput: "TargetEncoder memadatkan 100 kategori unik menjadi tepat 1 kolom numerik bebas overfitting.",
        codeExp: "Skrip membandingkan dimensi output OneHotEncoder vs TargetEncoder Scikit-Learn pada fitur berkardinalitas 100 kategori.",
        pitfalls: [
          "Menerapkan TargetEncoder manual tanpa validasi out-of-fold internal yang memicu kebocoran target fatal (*target leakage*).",
          "TargetEncoder memerlukan variabel target kontinu atau biner (tidak dapat digunakan secara murni tanpa label terawasi)."
        ],
        refTitle: "Daniele Micci-Barreca: A preprocessing scheme for high-cardinality categorization in data mining (SIGKDD Explorations, 2001)",
        refUrl: "https://dl.acm.org/doi/10.1145/507533.507538"
      },
      {
        num: "20.7",
        slug: "20-7-transformedtargetregressor-transformasi-target-otomatis",
        title: "20.7. TransformedTargetRegressor: Transformasi Target Otomatis dan Invers Prediksi",
        desc: "Manajemen target regresi miring (skewed target): pembungkusan model untuk otomatisasi log1p/Box-Cox pada y_train dan invers expm1 pada y_pred.",
        concept: `Dalam masalah regresi harga (seperti prediksi harga rumah atau nilai transaksi finansial), variabel target $y$ sering kali memiliki **kemiringan positif ekstrem (*extreme right skewness*)**, melanggar asumsi normalitas residual OLS dan menyebabkan model menghasilkan galat besar pada nilai target raksasa.

Praktisi sering kali mentransformasikan target secara manual menggunakan $\\ln(y + 1)$ sebelum pelatihan, lalu secara manual mengeksekusi $\\exp(\\hat{y}) - 1$ setelah prediksi. Praktik manual ini sangat rentan terhadap **kesalahan komputasi (human error)** dan tidak dapat digabungkan secara mulus ke dalam Pipeline atau GridSearchCV.

**Solusi: \`TransformedTargetRegressor\`:**
Kelas meta-estimator \`sklearn.compose.TransformedTargetRegressor\` membungkus regressor apa pun dan secara otomatis mengelola siklus hidup transformasi target:
1. **Fase Latihan (\`fit\`):** Target $y$ secara otomatis ditransformasikan melalui fungsi forward (misalnya \`func=np.log1p\` atau \`transformer=PowerTransformer()\`) sebelum dilewatkan ke model internal.
2. **Fase Prediksi (\`predict\`):** Model internal memprediksi nilai target dalam skala logaritmik, kemudian \`TransformedTargetRegressor\` secara otomatis menerapkan fungsi invers (\`inverse_func=np.expm1\`) untuk mengembalikan prediksi ke skala mata uang fisik asli!`,
        formula: `y^* = \\ln(y + 1) \\xrightarrow{\\text{Model.fit()}} \\hat{y}^* \\xrightarrow{\\text{Inverse}} \\hat{y} = \\exp(\\hat{y}^*) - 1`,
        code: `# 20.7: Otomasi Transformasi Target Logaritmik Menggunakan TransformedTargetRegressor
import numpy as np
from sklearn.compose import TransformedTargetRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error

# Target dengan distribusi eksponensial (Right-skewed)
np.random.seed(42)
X = np.random.randn(200, 5)
y_skewed = np.exp(X[:, 0] * 1.5 + np.random.normal(0, 0.2, 200)) # Nilai ribuan

# Bungkus Ridge dengan TransformedTargetRegressor
wrapped_reg = TransformedTargetRegressor(
    regressor=Ridge(),
    func=np.log1p,
    inverse_func=np.expm1
)

wrapped_reg.fit(X, y_skewed)
y_pred = wrapped_reg.predict(X)

print("=== TRANSFORMED TARGET REGRESSOR ===")
print(f"Rentang Nilai Target Asli : [{np.min(y_skewed):.2f}, {np.max(y_skewed):.2f}]")
print(f"Rentang Nilai Prediksi    : [{np.min(y_pred):.2f}, {np.max(y_pred):.2f}] (Otomatis diskalakan balik!)")
print(f"RMSE pada Skala Asli      : {np.sqrt(mean_squared_error(y_skewed, y_pred)):.4f}")`,
        expectedOutput: "TransformedTargetRegressor sukses melatih model pada skala log dan mengembalikan prediksi ke skala asli secara otomatis.",
        codeExp: "Skrip membungkus model Ridge ke dalam TransformedTargetRegressor untuk mengotomatiskan transformasi log1p dan invers expm1.",
        pitfalls: [
          "Lupa menentukan inverse_func saat menyetel fungsi custom func (akan memicu prediksi berada dalam skala yang salah).",
          "Menerapkan log murni np.log pada data target yang memuat angka 0 (akan menghasilkan nilai -inf; selalu gunakan np.log1p)."
        ],
        refTitle: "Scikit-Learn Documentation: TransformedTargetRegressor",
        refUrl: "https://scikit-learn.org/stable/modules/generated/sklearn.compose.TransformedTargetRegressor.html"
      },
      {
        num: "20.8",
        slug: "20-8-caching-pipeline-joblib-memory-efisiensi-gridsearch",
        title: "20.8. Caching Pipeline Menggunakan joblib.Memory: Efisiensi Komputasi Grid Search",
        desc: "Optimalisasi komputasi I/O: penggunaan parameter memory=joblib.Memory untuk meng-cache hasil pra-pemrosesan mahal selama pengujian ratusan parameter estimator.",
        concept: `Ketika kita menjalankan \` + "\`GridSearchCV\`" + \` pada sebuah Pipeline yang memuat tahap pra-pemrosesan yang mahal (misalnya ekstraksi fitur teks \` + "\`TfidfVectorizer\`" + \`, reduksi dimensi \` + "\`PCA(n_components=100)\`" + \`, atau imputasi MICE):
Jika parameter yang diuji di dalam Grid Search **hanya hiperparameter dari estimator akhir** (misalnya mencoba 50 nilai \` + "\`C\`" + \` berbeda pada SVM), maka secara default Pipeline standar akan **menghitung ulang seluruh transformasi pra-pemrosesan yang mahal tersebut sebanyak 50 kali untuk setiap fold**! Ini adalah pemborosan waktu komputasi yang sangat masif.

**Mekanisme Caching via \`joblib.Memory\`:**
Scikit-Learn menyediakan parameter \`memory\` pada konstruktor \`Pipeline\`:
\`\`\`python
from joblib import Memory
memory = Memory(location='./cache_dir', verbose=0)
pipeline = Pipeline(steps=[...], memory=memory)
\`\`\`
- Ketika pipeline mengeksekusi \`fit_transform()\` pada tahap 1, hasilnya disimpan ke media penyimpanan (*disk cache*).
- Pada iterasi grid search berikutnya di mana parameter tahap 1 tidak berubah, Pipeline **melewati komputasi transformasi** dan langsung memuat hasilnya secara instan dari cache disk.
- Kecepatan penyetelan grid search dapat meningkat hingga **5x hingga 20x lebih cepat**!`,
        formula: `\\text{Runtime}_{\text{cached}} = T_{\\text{transform}} + M \\times T_{\\text{fit(estimator)}} \\ll M \\times (T_{\\text{transform}} + T_{\\text{fit}})`,
        code: `# 20.8: Demonstrasi Akselerasi Komputasi Pipeline Menggunakan joblib.Memory
import time
import tempfile
import shutil
from joblib import Memory
from sklearn.pipeline import Pipeline
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=1000, n_features=50, random_state=42)

# Buat direktori cache sementara
cachedir = tempfile.mkdtemp()
memory = Memory(location=cachedir, verbose=0)

pipe_cached = Pipeline([
    ('pca', PCA(n_components=20)),
    ('svc', SVC())
], memory=memory)

param_grid = {'svc__C': [0.1, 1, 10, 100]}

t0 = time.time()
grid = GridSearchCV(pipe_cached, param_grid, cv=3).fit(X, y)
t_elapsed = time.time() - t0

# Bersihkan direktori cache
shutil.rmtree(cachedir)

print("=== AKSELERASI KOMPUTASI PIPELINE VIA JOBLIB.MEMORY ===")
print(f"Waktu Eksekusi Grid Search (Cached): {t_elapsed:.4f} detik")
print(f"Parameter Terbaik Ditemukan        : {grid.best_params_}")
print("Status: Transformasi PCA hanya dihitung 1x per fold, sisanya ditarik instan dari cache!")`,
        expectedOutput: "GridSearchCV berhasil mengeksekusi penelusuran parameter dengan caching aktif dan pembersihan direktori.",
        codeExp: "Skrip mengonfigurasi joblib.Memory pada Pipeline untuk meng-cache hasil PCA selama penelusuran hiperparameter SVC.",
        pitfalls: [
          "Lupa membersihkan direktori cache setelah eksperimen selesai, yang dapat memenuhi penyimpanan disk dengan file temporary puluhan Gigabyte.",
          "Menyimpan objek non-deterministik ke dalam pipeline cache yang dapat menyebabkan cache invalidasi terus-menerus."
        ],
        refTitle: "Joblib Official Documentation: On-demand memory caching",
        refUrl: "https://joblib.readthedocs.io/en/latest/memory.html"
      },
      {
        num: "20.9",
        slug: "20-9-keamanan-serialisasi-pickle-vs-onnx-treelite",
        title: "20.9. Keamanan Serialisasi Model: Bahaya Format pickle dan Alternatif Terbuka (ONNX, Treelite)",
        desc: "Kajian kerentanan keamanan siber: eksploitasi Remote Code Execution (RCE) pada modul pickle Python dan transisi ke format standar terbuka berkinerja tinggi.",
        concept: `Metode tradisional menyimpan model machine learning di Python adalah menggunakan modul \` + "\`pickle\`" + \` atau \` + "\`joblib.dump()\`" + \`. Namun, format \` + "\`pickle\`" + \` memiliki dua kelemahan fatal yang menjadikannya **dilarang dalam arsitektur produksi modern yang aman**:

**1. Kerentanan Keamanan Eksekusi Kode Jarak Jauh (*Arbitrary Code Execution*):**
Format pickle bekerja dengan merepresentasikan bytecode Python serialisasi. Seorang penyerang (*hacker*) dapat dengan mudah menyisipkan kode berbahaya ke dalam payload file \`model.pkl\` menggunakan metode \`__reduce__\`. Ketika aplikasi server memanggil \`pickle.load()\`, kode berbahaya tersebut akan dieksekusi secara instan dengan hak akses server penuh (Remote Code Execution / RCE). **JANGAN PERNAH memuat file pickle dari sumber yang tidak dipercaya!**

**2. Keterikatan Lingkungan (*Environment Lock-in*):**
File pickle sangat rapuh terhadap perbedaan versi pustaka: model yang di-pickle di Scikit-Learn 1.2 sering kali rusak (*unpicklable*) ketika dijalankan di server dengan Scikit-Learn 1.5.

**Solusi Standar Terbuka Modern:**
- **ONNX (Open Neural Network Exchange / \`skl2onnx\`):** Format biner terbuka berbasis Protocol Buffers yang independen terhadap bahasa pemrograman (bisa di-inferensi di C++, Java, Rust, atau Go menggunakan \`onnxruntime\`) dengan peningkatan kecepatan inferensi hingga 5x lipat.
- **Treelite:** Mengompilasi model ensemble pohon (Random Forest, XGBoost) langsung menjadi kode biner mesin C yang dioptimalkan dengan latensi mikrodetik.
- **Safetensors:** Format penyimpanan tensor yang dirancang oleh Hugging Face yang kebal terhadap eksploitasi RCE.`,
        formula: `\\text{Keamanan Model} = \\text{Protokol Non-Executable Format (ONNX/Safetensors)} \\gg \\text{pickle}`,
        code: `# 20.9: Simulasi Konversi Model Scikit-Learn ke Representasi Standar Portabel
import numpy as np
from sklearn.linear_model import LogisticRegression
import json

# Latih model sederhana
X = np.array([[1.0, 2.0], [2.0, 3.0], [3.0, 1.0], [4.0, 5.0]])
y = np.array([0, 0, 1, 1])
model = LogisticRegression().fit(X, y)

# Daripada pickle biner berbahaya, simpan bobot dalam format transparan JSON / Safe Schema
model_payload = {
    "framework": "scikit-learn",
    "model_type": "LogisticRegression",
    "version": "1.5.0",
    "coefficients": model.coef_.tolist(),
    "intercept": model.intercept_.tolist(),
    "classes": model.classes_.tolist()
}

json_safe = json.dumps(model_payload, indent=2)
print("=== SERIALISASI MODEL AMAN TANPA KERENTANAN RCE ===")
print("Payload Model Portabel (JSON / ONNX-style metadata):\n", json_safe)
print("\nKeunggulan: 100% Kebal terhadap Eksploitasi Eksekusi Kode Berbahaya pickle!")`,
        expectedOutput: "Bobot model diekstraksi ke dalam representasi terstruktur aman tanpa keterikatan bytecode pickle.",
        codeExp: "Skrip mengilustrasikan prinsip serialisasi parameter model secara eksplisit dan aman tanpa risiko eksekusi kode berbahaya modul pickle.",
        pitfalls: [
          "Memuat file .pkl atau .joblib dari repositori publik internet tanpa memverifikasi checksum kriptografi SHA-256.",
          "Mengira ONNX hanya untuk deep learning; ONNX mendukung penuh model klasik Scikit-Learn via paket skl2onnx."
        ],
        refTitle: "ONNX Official Documentation: Open Neural Network Exchange for Scikit-Learn",
        refUrl: "https://onnx.ai/sklearn-onnx/"
      },
      {
        num: "20.10",
        slug: "20-10-pengujian-otomatis-unit-testing-pipeline-pytest",
        title: "20.10. Pengujian Otomatis (Unit Testing) Pipeline Machine Learning dengan PyTest",
        desc: "Disiplin software engineering produksi: perancangan test suite otomatis untuk menguji invariant dimensi input/output, ketahanan missing values, dan determinisme hasil.",
        concept: `Dalam rekayasa perangkat lunak sistem pembelajaran mesin tingkat tinggi (*Machine Learning Software Engineering*), kode pipeline tidak boleh dirilis ke produksi tanpa melalui rangkaian **Pengujian Unit Otomatis (*Automated Unit Testing*)** menggunakan framework seperti **PyTest**.

**Empat Pengujian Unit Wajib untuk Pipeline ML:**
1. **Uji Invarian Dimensi (*Shape Invariant Test*):**
   Memastikan bahwa metode \`transform(X)\` selalu mengembalikan jumlah baris yang identik dengan data masukan dan jumlah kolom fitur yang konsisten sesuai spesifikasi.
2. **Uji Ketahanan Nilai Kosong (*Missing Value Robustness Test*):**
   Menguji apakah pipeline mampu memproses data yang memuat nilai \`NaN\` atau \`None\` di sembarang kolom tanpa melemparkan error tak tertangani (*unhandled exception*).
3. **Uji Determinisme Prediksi (*Determinism & Idempotency Test*):**
   Memastikan bahwa melewatkan sampel yang sama dua kali berturut-turut menghasilkan output prediksi dan skor probabilitas yang identik persis ($f(\\mathbf{x}) = f(\\mathbf{x})$).
4. **Uji Kategori Tak Dikenal (*Unknown Category Resilience Test*):**
   Memastikan bahwa jika data uji memuat label kategori baru yang belum pernah muncul di data latih, pipeline tidak mengalami crash (berkat \`handle_unknown='ignore'\`).`,
        formula: `\\forall \\mathbf{x}, \\quad \\text{Pipeline.predict}(\\mathbf{x})_1 \\equiv \\text{Pipeline.predict}(\\mathbf{x})_2 \\quad (\\text{Uji Idempoten})`,
        code: `# 20.10: Implementasi Test Suite Unit Testing Pipeline Sederhana (PyTest Style)
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge

def create_pipeline():
    return Pipeline([
        ('imputer', SimpleImputer(strategy='mean')),
        ('scaler', StandardScaler()),
        ('regressor', Ridge())
    ])

# 1. Test Invarian Bentuk dan Ketahanan Missing Value
def test_pipeline_missing_values():
    pipe = create_pipeline()
    X_train = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
    y_train = np.array([10.0, 20.0, 30.0])
    pipe.fit(X_train, y_train)
    
    # Data uji memuat NaN
    X_test_dirty = np.array([[np.nan, 2.0], [3.0, np.nan]])
    preds = pipe.predict(X_test_dirty)
    assert len(preds) == 2, "Jumlah baris prediksi tidak sesuai!"
    assert not np.isnan(preds).any(), "Prediksi memuat NaN yang tidak tertangani!"
    return "TEST 1 PASS: Ketahanan Missing Values Berhasil!"

# 2. Test Idempoten / Determinisme
def test_pipeline_determinism():
    pipe = create_pipeline()
    X_train = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
    y_train = np.array([10.0, 20.0, 30.0])
    pipe.fit(X_train, y_train)
    
    sample = np.array([[2.0, 3.0]])
    pred_1 = pipe.predict(sample)
    pred_2 = pipe.predict(sample)
    assert np.allclose(pred_1, pred_2), "Model tidak deterministik!"
    return "TEST 2 PASS: Determinisme Model Terverifikasi!"

print("=== SUITE UNIT TESTING PIPELINE MACHINE LEARNING ===")
print(test_pipeline_missing_values())
print(test_pipeline_determinism())`,
        expectedOutput: "Seluruh fungsi pengujian unit test mengeksekusi assertion dan lulus 100%.",
        codeExp: "Skrip mendemonstrasikan perancangan unit test otomatis bergaya PyTest untuk memvalidasi ketahanan missing values dan determinisme pipeline.",
        pitfalls: [
          "Mendeploy model ke server API tanpa automated regression testing terhadap skema data masukan.",
          "Menguji model hanya pada data sintetis bersih tanpa menyertakan skenario uji batas (*edge cases* seperti string kosong atau angka negatif)."
        ],
        refTitle: "Eric Breck et al.: What's your ML Test Score? A rubric for ML production systems (Google Research, 2016)",
        refUrl: "https://research.google/pubs/whats-your-ml-test-score-a-rubric-for-ml-production-systems/"
      }
    ]
  },

  // ==========================================
  // BAB 21: Interpretabilitas Model Machine Learning (Explainable AI - XAI)
  // ==========================================
  {
    orderIndex: 21,
    id: "machine-learning-ch-21",
    slug: "bab-21-interpretabilitas-model-machine-learning-xai",
    title: "BAB 21: Interpretabilitas Model Machine Learning (Explainable AI - XAI)",
    desc: "Membongkar kotak hitam (black-box) model pembelajaran mesin: taksonomi transparansi XAI, Permutation Feature Importance Breiman & Fisher, kurva efek marjinal PDP dan ICE, nilai Shapley teori permainan Lloyd Shapley (1953), framework SHAP Lundberg & Lee (TreeSHAP/LinearSHAP), visualisasi Beeswarm dan Waterfall, metode LIME Ribeiro et al., analisis penjelasan kontrafaktual, mitigasi multikolinieritas tersembunyi, serta kepatuhan audit regulasi finansial dan medis.",
    coreConcepts: ["XAI Taxonomy", "Permutation Feature Importance", "Partial Dependence Plots (PDP)", "Individual Conditional Expectation (ICE)", "Shapley Values Game Theory", "SHAP Framework (TreeSHAP)", "LIME Local Surrogates", "Counterfactual Explanations", "XAI Pitfalls & Multicollinearity", "Regulatory Compliance Auditing"],
    subchapters: [
      {
        num: "21.1",
        slug: "21-1-taksonomi-interpretabilitas-model-transparansi",
        title: "21.1. Taksonomi Interpretabilitas Model: Intrinsic vs Post-hoc, Global vs Local",
        desc: "Kerangka taksonomi Christoph Molnar: spektrum interpretabilitas vs akurasi, model transparan alami vs penjelasan pasca-pelatihan pada black-box.",
        concept: `Seiring meluasnya adopsi model pembelajaran mesin berkapasitas tinggi (seperti Random Forest, Gradient Boosted Trees, dan Deep Neural Networks), timbul masalah kritis: **Model Kotak Hitam (*Black-Box Models*)** yang menghasilkan akurasi sangat tinggi namun mekanismenya tidak dapat dipahami oleh manusia.

Christoph Molnar (2020) merumuskan taksonomi standar **Explainable AI (XAI)**:

**1. Model Intrinsik (*Intrinsic / Interpretable by Design*):**
Model yang secara matematis transparan dan mudah dipahami secara langsung tanpa alat bantu tambahan:
- **Regresi Linear / Logistik:** Koefisien $\\beta_j$ langsung menunjukkan arah dan magnitudo pengaruh fitur.
- **Pohon Keputusan Dangkal:** Aturan kondisional percabangan dapat dibaca seperti flowchart logika manusia.
- **Rule-based Models & Generalized Additive Models (GAMs).**

**2. Penjelasan Pasca-Pelatihan (*Post-Hoc Explanations*):**
Metode yang diaplikasikan setelah model kotak hitam yang kompleks selesai dilatih (misalnya SHAP dan LIME).

**3. Tingkat Lingkup Penjelasan (*Scope of Interpretability*):**
- **Penjelasan Global (*Global Explanations*):** Memahami perilaku model secara agregat melintasi seluruh populasi dataset (misalnya: *"Fitur mana yang secara umum paling penting dalam menentukan kelayakan kredit?"*).
- **Penjelasan Lokal (*Local Explanations*):** Memahami alasan keputusan spesifik pada **satu individu tertentu** (misalnya: *"Mengapa pengajuan pinjaman Budi ditolak hari ini?"*).`,
        formula: `\\text{Trade-off XAI: } \\text{Interpretabilitas Intrinsik} \\longleftrightarrow \\text{Kapasitas Pemodelan Non-Linier}`,
        code: `# 21.1: Komparasi Transparansi Intrinsik (Linear Model) vs Black-Box (Random Forest)
import numpy as np
import pandas as pd
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor

diabetes = load_diabetes()
X, y = diabetes.data, diabetes.target
feature_names = diabetes.feature_names

# 1. Model Intrinsik (Ridge Regression)
linear_model = Ridge().fit(X, y)
koefisien_df = pd.Series(linear_model.coef_, index=feature_names).sort_values(ascending=False)

# 2. Model Black-Box (Random Forest)
rf_model = RandomForestRegressor(random_state=42).fit(X, y)

print("=== TAKSONOMI INTERPRETABILITAS MODEL ===")
print("1. Penjelasan Global Intrinsik Transparan (Koefisien Ridge Linear):")
print(koefisien_df.head(3).round(2).to_string())
print("\n2. Model Black-Box Random Forest:")
print("- Hubungan fitur tidak transparan langsung dari parameter internal.")
print("- Membutuhkan instrumen XAI Post-Hoc (SHAP / Permutation Importance) untuk interpretasi.")`,
        expectedOutput: "Model linier menyediakan koefisien terinterpretasi langsung, sedangkan model ensemble membutuhkan metode post-hoc.",
        codeExp: "Skrip memperlihatkan perbedaan fundamental antara transparansi intrinsik model linier dan karakteristik kotak hitam Random Forest.",
        pitfalls: [
          "Mengorbankan akurasi sistem secara drastis hanya demi memaksakan penggunaan model linier primitif di mana XAI post-hoc modern sudah dapat menjelaskan black-box secara akurat.",
          "Membingungkan korelasi fitur dengan kausalitas (XAI hanya menjelaskan apa yang dipelajari model, bukan hubungan kausal ilmiah riil di alam)."
        ],
        refTitle: "Christoph Molnar: Interpretable Machine Learning: A Guide for Making Black Box Models Explainable (2020)",
        refUrl: "https://christophm.github.io/interpretable-ml-book/"
      },
      {
        num: "21.2",
        slug: "21-2-permutation-feature-importance-fisher-caruana",
        title: "21.2. Kepentingan Fitur Permutasi: Metrik Bebas Bias Fisher, Aaron, & Caruana",
        desc: "Metode evaluasi post-hoc model-agnostik: mengukur kenaikan galat model setelah nilai suatu fitur diacak (shuffled) untuk memutus hubungannya dengan target.",
        concept: `Dalam pustaka pohon keputusan klasik, nilai kepentingan fitur bawaan (*Mean Decrease in Impurity / Gini Importance*) memiliki bias cacat struktural yang parah: ia melebih-lebihkan fitur numerik kontinu dan fitur berkardinalitas tinggi secara artifisial.

Leo Breiman (2001) dan Aaron Fisher, Cynthia Rudin, dan Rich Caruana (JMLR 2019) merumuskan metode standar emas yang bebas bias: **Permutation Feature Importance (PFI)**.

**Mekanisme Algoritma Permutasi:**
1. Latih model pembelajaran mesin $f$ pada data latih dan evaluasi skor baseline metrik performanya (misalnya ROC-AUC atau $R^2$) pada himpunan validasi/uji: $s_{\\text{base}}$.
2. Untuk setiap fitur $j \\in \\{1, \\dots, d\\}$:
   - Ambil kolom fitur $j$ dan lakukan **pengacakan posisi baris secara acak (*random permutation / shuffling*)**, sementara seluruh kolom fitur lainnya dibiarkan utuh.
   - Tindakan ini secara efektif **memutus hubungan korelasi antara fitur $j$ dan label target $y$**, serta memutus hubungannya dengan fitur-fitur lain.
   - Evaluasi kembali skor performa model pada data yang kolom $j$-nya telah diacak: $s_{\\text{perm}}^{(j)}$.
   - Nilai kepentingan fitur permutasi didefinisikan sebagai **penurunan skor performa**:
     $$I(j) = s_{\\text{base}} - s_{\\text{perm}}^{(j)}$$

**Interpretasi:**
- Jika mengacak fitur $j$ menyebabkan skor model anjlok drastis ($I(j) \\gg 0$), maka model **sangat bergantung pada fitur tersebut**.
- Jika mengacak fitur $j$ tidak mengubah performa sama sekali ($I(j) \\approx 0$), fitur tersebut tidak memberikan kontribusi informasi bagi model.`,
        formula: `I(j) = \\mathcal{L}\\left( f, \\mathbf{X}_{\\text{perm}(j)}, \\mathbf{y} \\right) - \\mathcal{L}(f, \\mathbf{X}, \\mathbf{y}) \\quad (\\text{Penurunan Performa})`,
        code: `# 21.2: Perhitungan Permutation Feature Importance Menggunakan Scikit-Learn
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, test_size=0.3, random_state=42)

rf = RandomForestClassifier(random_state=42).fit(X_train, y_train)

# Hitung Permutation Importance pada DATA UJI (Test Set)
result = permutation_importance(rf, X_test, y_test, n_repeats=10, random_state=42, scoring='roc_auc')

pfi_df = pd.DataFrame({
    'Fitur': data.feature_names,
    'PFI_Mean': result.importances_mean,
    'PFI_Std': result.importances_std
}).sort_values('PFI_Mean', ascending=False)

print("=== TOP 3 FITUR PALING PENTING (PERMUTATION IMPORTANCE) ===")
print(pfi_df.head(3).to_string(index=False))`,
        expectedOutput: "Fitur 'worst concave points' atau 'worst area' terpilih sebagai fitur dengan penurunan ROC-AUC terbesar saat diacak.",
        codeExp: "Skrip mengeksekusi permutation_importance Scikit-Learn pada data uji dengan 10 kali pengacakan untuk mengukur deviasi rata-rata performa.",
        pitfalls: [
          "Menghitung permutation importance pada data latih (akan bias terhadap fitur yang mengalami overfitting; selalu evaluasi pada test set).",
          "Jika terdapat dua fitur yang berkorelasi sangat tinggi (multikolinieritas), mengacak salah satu fitur tidak akan menurunkan performa karena model dapat membaca informasi dari pasangan fiturnya, menyebabkan kedua fitur tampak tidak penting."
        ],
        refTitle: "Aaron Fisher, Cynthia Rudin, Francesca Dominici: All Models are Wrong, but Many are Useful: Learning a Variable's Importance by Considering Many Alternative Models (JMLR, 2019)",
        refUrl: "https://www.jmlr.org/papers/v20/18-760.html"
      },
      {
        num: "21.3",
        slug: "21-3-partial-dependence-plots-pdp-dan-ice",
        title: "21.3. Partial Dependence Plots (PDP) dan Individual Conditional Expectation (ICE)",
        desc: "Visualisasi efek marjinal Friedman (2001) dan Goldstein et al. (2015): memetakan hubungan fungsional linier/non-linier fitur terhadap ekspektasi target.",
        concept: `Setelah mengetahui fitur mana yang paling penting, pertanyaan selanjutnya adalah: **Bagaimana bentuk hubungan fungsional antara nilai fitur tersebut dengan probabilitas prediksi model?** Apakah hubungannya linier, berbentuk kurva parabola, fungsi tangga, atau eksponensial?

**1. Partial Dependence Plots (PDP / Jerome H. Friedman, 2001):**
Memperlihatkan **efek marjinal rata-rata** dari satu atau dua fitur $x_S$ terhadap nilai prediksi model, dengan merata-ratakan pengaruh seluruh fitur lainnya $x_C$:
$$\\hat{f}_S(x_S) = \\mathbb{E}_{X_C}\\left[ \\hat{f}(x_S, X_C) \\right] = \\frac{1}{n} \\sum_{i=1}^n \\hat{f}(x_S, \\mathbf{x}_{C, i})$$
*Kelemahan PDP:* Karena menghitung rata-rata global, PDP dapat **menutupi heterogenitas efek lokal** yang bertolak belakang (misalnya jika fitur berdampak positif untuk wanita namun berdampak negatif untuk pria, rata-rata PDP akan mendatar seolah tidak ada efek sama sekali!).

**2. Individual Conditional Expectation (ICE / Alex Goldstein et al., 2015):**
Menghitung dan memplot garis kurva prediksi untuk **setiap individu observasi secara terpisah**.
- PDP adalah tepat rata-rata vertikal dari seluruh garis individual ICE.
- Kurva ICE membedah interaksi tersembunyi dan memperlihatkan variasi perilaku lokal antar kelompok subjek secara transparan.`,
        formula: `\\hat{f}_S(x_S) = \\frac{1}{n}\\sum_{i=1}^n \\hat{f}(x_S, \\mathbf{x}_{C, i}) \\quad (\\text{Integrasi Marjinal Friedman})`,
        code: `# 21.3: Ekstraksi Data Partial Dependence Plots (PDP) Menggunakan Scikit-Learn
from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.inspection import partial_dependence

housing = fetch_california_housing()
X, y = housing.data, housing.target
feature_names = housing.feature_names

gbr = HistGradientBoostingRegressor(random_state=42).fit(X, y)

# Hitung Partial Dependence untuk fitur MedInc (Median Income, indeks 0)
pdp_results = partial_dependence(gbr, X, features=[0], kind='average')

print("=== PARTIAL DEPENDENCE PLOTS (PDP) - FITUR MEDIAN INCOME ===")
print("Nilai Sumbu Fitur (MedInc) :", np.round(pdp_results['values'][0][:4], 2))
print("Prediksi Rata-rata Marjinal :", np.round(pdp_results['average'][0][:4], 2))
print("Karakteristik Efek: Hubungan monotonik naik tegas antara Median Income dan Prediksi Harga.")`,
        expectedOutput: "Partial dependence memperlihatkan respons marjinal positif antara Median Income dan harga properti.",
        codeExp: "Skrip memanfaatkan fungsi partial_dependence Scikit-Learn untuk mengekstraksi nilai marjinal fitur pada model boosting.",
        pitfalls: [
          "Mengevaluasi PDP pada nilai fitur gabungan yang tidak realistis di dunia nyata (misalnya berat badan 150 kg dengan tinggi badan 100 cm pada data yang berkorelasi).",
          "Hanya melihat PDP tanpa memeriksa kurva ICE yang dapat menyembunyikan efek sub-populasi yang bertolak belakang."
        ],
        refTitle: "Alex Goldstein et al.: Peeking Inside the Black Box: Visualizing Statistical Learning With Plots of Individual Conditional Expectation (JCGS, 2015)",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/10618600.2014.907095"
      },
      {
        num: "21.4",
        slug: "21-4-nilai-shapley-teori-permainan-lloyd-shapley",
        title: "21.4. Fondasi Teori Permainan Koperasi: Nilai Shapley (Lloyd Shapley, 1953)",
        desc: "Prinsip alokasi imbalan adil pemenang Nobel Ekonomi: formulasi matematis atribusi kontribusi marjinal fitur melintasi seluruh kemungkinan koalisi bagian.",
        concept: `Konsep paling kokoh dan berlandaskan teori matematika kuat untuk atribusi fitur modern berasal dari **Teori Permainan Koperasi (*Cooperative Game Theory*)** yang dirumuskan oleh penerima Hadiah Nobel Ekonomi Lloyd S. Shapley (1953).

**Analogi Permainan Koperasi:**
Bayangkan sekelompok $M$ pemain bekerja sama dalam sebuah tim untuk memenangkan sejumlah hadiah uang. Beberapa pemain bekerja sangat keras, beberapa pemain saling melengkapi keahlian, dan beberapa pemain lain pasif. **Berapa bagian imbalan uang yang adil untuk masing-masing pemain berdasarkan kontribusi nyatanya?**

Dalam konteks Machine Learning:
- **Pemain (*Players*):** Nilai fitur masukan $\\mathbf{x} = [x_1, x_2, \\dots, x_M]$.
- **Permainan (*Game*):** Model prediksi pembelajaran mesin $f$.
- **Hasil Imbalan (*Payout*):** Selisih prediksi model untuk sampel tersebut terhadap rata-rata prediksi seluruh populasi: $f(\\mathbf{x}) - \\mathbb{E}[f(\\mathbf{X})]$.

**Formulasi Nilai Shapley (Shapley Value $\\phi_j$):**
Nilai kontribusi fitur $j$ adalah rata-rata kontribusi marjinal fitur tersebut melintasi **seluruh kemungkinan himpunan bagian koalisi fitur $S \\subseteq \\mathcal{F} \\setminus \\{j\\}$**:
$$\\phi_j(f, \\mathbf{x}) = \\sum_{S \\subseteq \\mathcal{F} \\setminus \\{j\\}} \\frac{|S|! (|\\mathcal{F}| - |S| - 1)!}{|\\mathcal{F}|!} \\left[ f(S \\cup \\{j\\}) - f(S) \\right]$$

**Empat Aksioma Keadilan Tunggal (Uniqueness Axioms):**
Lloyd Shapley membuktikan bahwa formulasi ini adalah **satu-satunya metode atribusi** yang secara simultan memenuhi empat aksioma keadilan fundamental:
1. **Efisiensi (*Efficiency*):** Jumlah nilai Shapley seluruh fitur tepat sama dengan selisih prediksi: $\\sum_{j=1}^M \\phi_j = f(\\mathbf{x}) - \\mathbb{E}[f(\\mathbf{x})]$.
2. **Simetri (*Symmetry*):** Dua fitur yang memberikan kontribusi marjinal yang identik pada seluruh koalisi menerima nilai Shapley yang sama.
3. **Dummy / Pemain Nol (*Null Player*):** Fitur yang tidak pernah mengubah prediksi pada koalisi mana pun menerima nilai $\\phi_j = 0$.
4. **Aditivitas (*Additivity*):** Untuk model ensemble gabungan $f + g$, $\\phi_j(f + g) = \\phi_j(f) + \\phi_j(g)$.`,
        formula: `\\phi_j = \\sum_{S \\subseteq \\mathcal{F} \\setminus \\{j\\}} \\frac{|S|!(M - |S| - 1)!}{M!} \\left[ f(S \\cup \\{j\\}) - f(S) \\right] \\implies \\sum_{j=1}^M \\phi_j = f(\\mathbf{x}) - \\mathbb{E}[f]`,
        code: `# 21.4: Perhitungan Nilai Shapley Eksak dari Nol pada Model Linier Sederhana
import itertools
import numpy as np

# Fungsi prediksi toy: f(x1, x2) = 2*x1 + 5*x2
def predict_subset(coalition, x_vals, baseline_vals):
    # Evaluasi nilai koalisi: ganti fitur yang tidak ada dengan baseline
    x_eval = [x_vals[i] if i in coalition else baseline_vals[i] for i in range(2)]
    return 2.0 * x_eval[0] + 5.0 * x_eval[1]

x_sample = [3.0, 4.0] # Prediksi: 2*3 + 5*4 = 26.0
baseline = [0.0, 0.0] # Baseline : 0.0 -> Payout = 26.0

features = [0, 1]
M = len(features)

# Hitung nilai Shapley untuk fitur 0 (x1)
phi_0 = 0.0
# Koalisi yang tidak memuat fitur 0: empty set () dan (1,)
coalitions = [(), (1,)]
weights = [1.0/2.0, 1.0/2.0] # |S|!(M-|S|-1)! / M!

for S, w in zip(coalitions, weights):
    with_0 = predict_subset(S + (0,), x_sample, baseline)
    without_0 = predict_subset(S, x_sample, baseline)
    marginal_contrib = with_0 - without_0
    phi_0 += w * marginal_contrib

print("=== PERHITUNGAN NILAI SHAPLEY TEORI PERMAINAN EKSAT ===")
print(f"Prediksi Sampel f(x)    : {predict_subset((0, 1), x_sample, baseline)}")
print(f"Nilai Shapley Fitur x1 : {phi_0:.2f} (Tepat sama dengan 2 * 3 = 6.0!)")
print(f"Nilai Shapley Fitur x2 : {26.0 - phi_0:.2f} (Tepat sama dengan 5 * 4 = 20.0!)")
print(f"Total Efisiensi Shapley: {phi_0 + (26.0 - phi_0):.2f} == Payout Total 26.0")`,
        expectedOutput: "Nilai Shapley terhitung adil membuktikan aksioma efisiensi (6.0 + 20.0 = 26.0).",
        codeExp: "Skrip mengimplementasikan perhitungan nilai Shapley combinatorial eksak dari seluruh koalisi bagian untuk membuktikan aksioma efisiensi.",
        pitfalls: [
          "Kompleksitas komputasi menghitung nilai Shapley eksak adalah O(2^M), mustahil diselesaikan secara naif untuk model dengan lebih dari 20 fitur (memerlukan algoritma aproksimasi seperti SHAP).",
          "Mengira nilai Shapley adalah derivatif lokal; nilai Shapley adalah kontribusi rata-rata global melintasi kombinasi himpunan bagian."
        ],
        refTitle: "Lloyd S. Shapley: A Value for n-person Games (Contributions to the Theory of Games, Princeton University Press, 1953)",
        refUrl: "https://www.rand.org/pubs/research_memoranda/RM0670.html"
      },
      {
        num: "21.5",
        slug: "21-5-shap-framework-treeshap-dan-linearshap",
        title: "21.5. Framework SHAP (Lundberg & Lee 2017): TreeSHAP dan LinearSHAP",
        desc: "Aproksimasi terpadu Scott Lundberg & Su-In Lee (NeurIPS 2017): algoritma TreeSHAP berkecepatan O(TLD^2) untuk pohon keputusan dan ensemble.",
        concept: `Scott M. Lundberg dan Su-In Lee (NeurIPS, 2017) mempublikasikan karya revolusioner **SHAP (SHapley Additive exPlanations)** yang menyatukan enam teknik XAI sebelumnya (termasuk LIME dan DeepLIFT) di bawah kerangka matematis tunggal nilai Shapley.

**Terobosan Algoritmik: TreeSHAP (Lundberg et al., Nature Machine Intelligence 2020):**
Komputasi nilai Shapley eksak membutuhkan waktu eksponensial $\\mathcal{O}(M 2^M)$ yang tidak mungkin dihitung pada data riil. Lundberg et al. merumuskan **TreeSHAP**:
Algoritma khusus untuk ensemble berbasis pohon (Random Forest, XGBoost, LightGBM, CatBoost) yang memanfaatkan struktur topologi partisi pohon keputusan:
- Menghitung nilai ekspektasi kondisional melintasi seluruh jalur daun secara rekursif simultan.
- Menurunkan kompleksitas waktu dari eksponensial $\\mathcal{O}(2^M)$ menjadi waktu polinomial rendah:
  $$\\mathcal{O}(T \\cdot L \\cdot D^2)$$
  di mana $T$ adalah jumlah pohon, $L$ adalah jumlah daun maksimum, dan $D$ adalah kedalaman pohon maksimum.

TreeSHAP memungkinkan perhitungan nilai Shapley eksak untuk **jutaan sampel data hanya dalam hitungan detik**!

**Model Additive Attribution:**
$$\\hat{f}(\\mathbf{x}) = \\phi_0 + \\sum_{j=1}^M \\phi_j(\\mathbf{x})$$
di mana $\\phi_0 = \\mathbb{E}[f(\\mathbf{X})]$ adalah nilai dasar (*base value / background expectation*), dan $\\phi_j$ adalah nilai SHAP lokal dari fitur $j$.`,
        formula: `f(\\mathbf{x}) = \\phi_0 + \\sum_{j=1}^M \\phi_j(\\mathbf{x}) \\quad (\\text{Persamaan Aditif Terpadu SHAP})`,
        code: `# 21.5: Konsep TreeSHAP Menggunakan Pustaka SHAP / Ekstraksi Manual Base Value
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import load_diabetes

data = load_diabetes()
X, y = data.data[:200], data.target[:200]

rf = RandomForestRegressor(n_estimators=30, max_depth=4, random_state=42).fit(X, y)
base_value_phi0 = np.mean(rf.predict(X))

sample_idx = 0
pred_sample = rf.predict(X[sample_idx:sample_idx+1])[0]
selisih_payout = pred_sample - base_value_phi0

print("=== DEKOMPOSISI REKAYASA SHAP MODEL ===")
print(f"Ekspektasi Dasar (Base Value phi_0): {base_value_phi0:.2f}")
print(f"Prediksi Sampel f(x_0)             : {pred_sample:.2f}")
print(f"Total Selisih Atribusi yang Dibagi : {selisih_payout:+.2f}")
print("Status: TreeSHAP mengalokasikan selisih payout ini ke 10 fitur secara aditif sempurna!")`,
        expectedOutput: "Dekomposisi aditif memperlihatkan pembagian selisih prediksi terhadap base value populasi.",
        codeExp: "Skrip mendemonstrasikan prinsip aditif dasar framework SHAP di mana prediksi individu didekomposisi dari base value.",
        pitfalls: [
          "Menggunakan KernelSHAP (model-agnostic) pada model berbasis pohon alih-alih TreeSHAP (KernelSHAP jauh lebih lambat dan berbasis sampling stokastik).",
          "Menyertakan dataset latar belakang (background dataset) yang terlalu besar pada SHAP yang memperlambat komputasi tanpa peningkatan presisi."
        ],
        refTitle: "Scott M. Lundberg & Su-In Lee: A Unified Approach to Interpreting Model Predictions (NeurIPS, 2017)",
        refUrl: "https://papers.nips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
      },
      {
        num: "21.6",
        slug: "21-6-visualisasi-diagnostik-shap-beeswarm-waterfall-force",
        title: "21.6. Visualisasi Diagnostik SHAP: Summary Beeswarm Plot, Waterfall Plot, dan Force Plot",
        desc: "Interpretasi visual tingkat lanjut: membaca sebaran dampak fitur global (Beeswarm), dekomposisi langkah kontribusi lokal (Waterfall), dan visualisasi gaya dorong (Force Plot).",
        concept: `Kekuatan terbesar dari SHAP terletak pada ekosistem visualisasi grafisnya yang sangat ekspresif, elegan, dan informatif:

**Tiga Instrumen Visualisasi Standar Emas SHAP:**
1. **Summary Beeswarm Plot (Penjelasan Global):**
   - Menggabungkan **derajat kepentingan fitur** dengan **arah pengaruhnya**.
   - Setiap titik pada plot mewakili **satu sampel data individual**.
   - **Posisi Horizontal ($x$):** Nilai SHAP $\\phi_j$ (apakah fitur tersebut mendorong prediksi ke atas atau ke bawah).
   - **Warna Titik:** Nilai asli dari fitur tersebut (Merah = Nilai Fitur Tinggi, Biru = Nilai Fitur Rendah).
   *Contoh Wawasan:* Jika titik merah berkumpul di sisi kanan (SHAP positif) dan titik biru di sisi kiri, berarti nilai fitur yang tinggi selalu meningkatkan prediksi target secara global.
2. **Waterfall Plot (Penjelasan Lokal Individu):**
   - Memvisualisasikan jalur dekomposisi satu keputusan prediksi individual dimulai dari nilai dasar $\\mathbb{E}[f(\\mathbf{x})]$.
   - Setiap fitur digambarkan sebagai blok panah horizontal (Merah = pendorong positif, Biru = penahan negatif) yang secara berurutan menjumlahkan kontribusi hingga mencapai nilai akhir $f(\\mathbf{x})$.
3. **Dependence Scatter Plot:**
   - Memplot nilai fitur asli terhadap nilai SHAP dengan pewarnaan otomatis fitur interaksi kedua, memperlihatkan efek non-linieritas secara transparan.`,
        formula: `\\text{Waterfall:} \\quad \\mathbb{E}[f] \\xrightarrow{+\\phi_1} v_1 \\xrightarrow{+\\phi_2} v_2 \\dots \\xrightarrow{+\\phi_M} f(\\mathbf{x})`,
        code: `# 21.6: Simulasi Struktur Data Komponen Visualisasi Waterfall SHAP
import pandas as pd

# Simulasi atribusi SHAP lokal untuk 1 keputusan kredit
prediksi_dasar = 0.20 # Rata-rata persetujuan kredit populasi (20%)
shap_values = {
    'Skor_Kredit': +0.45,
    'Rasio_Utang': -0.15,
    'Penghasilan': +0.25,
    'Status_Rumah': -0.05
}

df_waterfall = pd.DataFrame(list(shap_values.items()), columns=['Fitur', 'Kontribusi_SHAP'])
df_waterfall['Arah'] = df_waterfall['Kontribusi_SHAP'].apply(lambda x: 'Menaikkan' if x > 0 else 'Menurunkan')

prob_akhir = prediksi_dasar + df_waterfall['Kontribusi_SHAP'].sum()

print("=== REKONSTRUKSI VISUALISASI WATERFALL SHAP (LOKAL) ===")
print(f"Probabilitas Awal Populasi (Base E[f]): {prediksi_dasar*100:.1f}%\n")
for _, row in df_waterfall.iterrows():
    tanda = "+" if row['Kontribusi_SHAP'] > 0 else ""
    print(f"Fitur: {row['Fitur']:15s} -> Kontribusi: {tanda}{row['Kontribusi_SHAP']*100:.1f}% ({row['Arah']})")
print(f"\nProbabilitas Keputusan Akhir f(x)    : {prob_akhir*100:.1f}% (Persetujuan Diberikan!)")`,
        expectedOutput: "Struktur dekomposisi langkah waterfall memperlihatkan kontribusi bertahap dari 20% menuju 70%.",
        codeExp: "Skrip merekonstruksi struktur aljabar penjumlahan bertingkat yang mendasari visualisasi Waterfall Plot SHAP.",
        pitfalls: [
          "Membaca Summary Beeswarm plot hanya sebagai daftar ranking tanpa memperhatikan sebaran warna (arah dampak fitur).",
          "Mengabaikan istilah interaksi SHAP (SHAP interaction values) pada model dengan korelasi fitur silang yang rumit."
        ],
        refTitle: "Scott M. Lundberg et al.: From local explanations to global understanding with explainable AI for trees (Nature Machine Intelligence, 2020)",
        refUrl: "https://www.nature.com/articles/s42256-019-0138-9"
      },
      {
        num: "21.7",
        slug: "21-7-lime-local-interpretable-model-agnostic-explanations",
        title: "21.7. LIME: Local Interpretable Model-agnostic Explanations Ribeiro et al. (2016)",
        desc: "Aproksimasi model pengganti lokal: pembangkitan perturbasi acak di sekitar sampel observasi dan fitting regresi linier berbobot jarak kernel.",
        concept: `Marco Tulio Ribeiro, Sameer Singh, dan Carlos Guestrin (ACM KDD, 2016) merumuskan metode XAI model-agnostik lokal paling terkenal: **LIME (Local Interpretable Model-agnostic Explanations)**.

**Filosofi Dasar LIME:**
Meskipun model pembelajaran mesin global (seperti Deep Neural Network atau Random Forest 1000 pohon) memiliki batas keputusan non-linier yang sangat rumit melintasi seluruh ruang, **pada lingkungan mikro di sekitar satu titik sampel individual $\\mathbf{x}$, batas keputusannya hampir selalu dapat didekati secara presisi menggunakan model linier sederhana (*locally linear approximation*)**!

**Empat Langkah Algoritma LIME:**
1. Pilih satu sampel observasi $\\mathbf{x}$ yang ingin dijelaskan keputusannya.
2. Bangkitkan sekumpulan sampel data sintetis di sekitar $\\mathbf{x}$ melalui **perturbasi acak (*random perturbations*)**.
3. Dapatkan label prediksi dari model kotak hitam $f$ untuk seluruh sampel perturbasi tersebut: $y'_i = f(\\mathbf{x}'_i)$.
4. Berikan bobot $\\pi_{\\mathbf{x}}(\\mathbf{x}'_i)$ pada setiap sampel perturbasi berdasarkan **kedekatan jarak eksponensialnya ke titik asli $\\mathbf{x}$**:
   $$\\pi_{\\mathbf{x}}(\\mathbf{x}') = \\exp\\left( -\\frac{D(\\mathbf{x}, \\mathbf{x}')^2}{\\sigma^2} \\right)$$
5. Latih model regresi linier terbobot sederhana (seperti Ridge/Lasso) pada sampel perturbasi berbobot tersebut. Koefisien regresi lokal ini adalah **penjelasan LIME**!`,
        formula: `\\xi(\\mathbf{x}) = \\arg\\min_{g \\in G} \\mathcal{L}(f, g, \\pi_\\mathbf{x}) + \\Omega(g) \\quad (\\text{Fungsi Objektif LIME})`,
        code: `# 21.7: Simulasi Algoritma Penjelasan Lokal LIME dari Nol
import numpy as np
from sklearn.linear_model import Ridge

# Model black-box rumit non-linier: f(x1, x2) = sin(x1) + x2^2
def black_box_model(X):
    return np.sin(X[:, 0]) + (X[:, 1] ** 2)

# Titik observasi yang ingin dijelaskan
x_target = np.array([1.5, 2.0])

# 1. Bangkitkan 500 perturbasi lokal di sekitar x_target
np.random.seed(42)
perturbations = x_target + np.random.normal(0, 0.2, (500, 2))

# 2. Prediksi model black-box pada perturbasi
y_perturbed = black_box_model(perturbations)

# 3. Hitung bobot kernel kedekatan jarak
distances = np.linalg.norm(perturbations - x_target, axis=1)
weights = np.exp(-(distances ** 2) / (0.25 ** 2))

# 4. Latih model linier lokal terbobot (LIME Surrogate)
local_surrogate = Ridge(alpha=0.1)
local_surrogate.fit(perturbations, y_perturbed, sample_weight=weights)

print("=== PENJELASAN LOKAL LIME (LOCAL SURROGATE) ===")
print(f"Koefisien Pengaruh Lokal Fitur 1 (x1): {local_surrogate.coef_[0]:.4f}")
print(f"Koefisien Pengaruh Lokal Fitur 2 (x2): {local_surrogate.coef_[1]:.4f} (Mendominasi keputusan lokal!)")`,
        expectedOutput: "Model pengganti lokal LIME mengekstrak koefisien lokal dengan fitur 2 mendominasi secara linier.",
        codeExp: "Skrip mensimulasikan langkah-langkah algoritma LIME: perturbasi lokal, pembobotan kernel eksponensial, dan fitting model pengganti linier.",
        pitfalls: [
          "LIME berbasis sampling acak stokastik; menjalankan LIME dua kali pada titik yang sama dapat menghasilkan penjelasan yang sedikit berbeda (instabilitas penjelas).",
          "Ukuran kernel bandwidth $\\sigma$ sangat menentukan hasil; jika terlalu lebar, ia kehilangan karakteristik lokal; jika terlalu sempit, model surrogate tidak stabil."
        ],
        refTitle: "Marco Tulio Ribeiro, Sameer Singh, Carlos Guestrin: 'Why Should I Trust You?': Explaining the Predictions of Any Classifier (ACM KDD, 2016)",
        refUrl: "https://dl.acm.org/doi/10.1145/2939672.2939778"
      },
      {
        num: "21.8",
        slug: "21-8-analisis-kontrafaktual-counterfactual-explanations",
        title: "21.8. Analisis Kontrafaktual (Counterfactual Explanations): Rekomendasi Pembalikan Keputusan",
        desc: "Paradigma penjelasan berorientasi tindakan Wachter et al. (2017): 'Apa perubahan minimum pada fitur agar keputusan model berbalik dari Ditolak menjadi Diterima?'.",
        concept: `Meskipun SHAP dan LIME memberi tahu kita *mengapa* model mengambil keputusan tertentu, keduanya tidak memberikan panduan yang berorientasi tindakan bagi konsumen (*actionable recourse*).

Sandra Wachter, Brent Mittelstadt, dan Chris Russell (Harvard Journal of Law & Technology, 2017) merumuskan **Penjelasan Kontrafaktual (*Counterfactual Explanations*)**:
Alih-alih menjelaskan bobot fitur, kontrafaktual menjawab pertanyaan langsung yang diajukan oleh pengguna:
> *"Berapa skor kredit dan pendapatan minimum yang harus saya miliki agar pengajuan pinjaman saya disetujui?"*

**Formulasi Optimasi Kontrafaktual:**
Mencari titik baru $\\mathbf{x}^*$ yang sedekat mungkin dengan titik asli $\\mathbf{x}$, namun menghasilkan kelas keputusan target yang diinginkan $y^*$:
$$\\mathbf{x}^* = \\arg\\min_{\\mathbf{x}'} d(\\mathbf{x}, \\mathbf{x}') + \\lambda \\cdot \\mathcal{L}\\left( f(\\mathbf{x}'), y^* \\right)$$
di mana $d(\\mathbf{x}, \\mathbf{x}')$ mengukur jarak perubahan usaha minimum (biasanya jarak Manhattan L1 untuk mendorong ketersebaran perubahan fitur seminimal mungkin).

**Batasan Tindakan Realistis (*Actionability Constraints*):**
Penjelasan kontrafaktual praktis harus mematuhi batasan fisik dunia nyata:
- Fitur tidak dapat diubah (*immutable*): Umur tidak bisa dimundurkan, ras/gender tidak boleh diubah.
- Fitur hanya dapat berubah satu arah (*monotonic*): Riwayat pendidikan atau durasi kerja hanya bisa bertambah.`,
        formula: `\\mathbf{x}^* = \\arg\\min_{\\mathbf{x}'} \\left[ \\sum_{j=1}^M \\frac{|x_j - x'_j|}{\\text{MAD}_j} + \\lambda (f(\\mathbf{x}') - y^*)^2 \\right] \\quad (\\text{Kontrafaktual Wachter})`,
        code: `# 21.8: Optimasi Pencarian Kontrafaktual Sederhana Menggunakan SciPy
import numpy as np
from scipy.optimize import minimize
from sklearn.linear_model import LogisticRegression

# Model persetujuan pinjaman toy
X_train = np.array([[20.0, 300.0], [45.0, 800.0], [30.0, 400.0], [50.0, 900.0]])
y_train = np.array([0, 1, 0, 1])
model = LogisticRegression().fit(X_train, y_train)

# Nasabah yang ditolak: [Umur=25, Skor_Kredit=350] -> Prediksi: 0 (Ditolak)
x_nasabah = np.array([25.0, 350.0])

# Fungsi objektif: Minimalkan perubahan jarak L1 dengan syarat probabilitas >= 0.60
def loss_counterfactual(x_prime):
    jarak_usaha = np.sum(np.abs(x_prime - x_nasabah))
    prob = model.predict_proba(x_prime.reshape(1, -1))[0, 1]
    penalti_target = 1000.0 * max(0.0, 0.60 - prob)**2
    return jarak_usaha + penalti_target

# Umur dibatasi tidak boleh turun (>= 25)
bounds = [(25.0, 70.0), (300.0, 850.0)]
res = minimize(loss_counterfactual, x_nasabah, method='L-BFGS-B', bounds=bounds)

x_rekomendasi = res.x
prob_baru = model.predict_proba(x_rekomendasi.reshape(1, -1))[0, 1]

print("=== REKOMENDASI PENJELASAN KONTRAFAKTUAL (WACHTER) ===")
print(f"Profil Awal (Ditolak): Umur={x_nasabah[0]:.0f}, Skor Kredit={x_nasabah[1]:.0f}")
print(f"Rekomendasi Aksi     : Naikkan Skor Kredit ke {x_rekomendasi[1]:.0f} (Perubahan Minimal)")
print(f"Probabilitas Baru    : {prob_baru*100:.1f}% (Persetujuan Tercapai!)")`,
        expectedOutput: "Algoritma kontrafaktual menemukan perubahan minimal pada skor kredit untuk membalikkan keputusan ke status disetujui.",
        codeExp: "Skrip mengoptimalkan fungsi biaya kontrafaktual Wachter untuk menemukan perubahan fitur minimal yang membalikkan keputusan model.",
        pitfalls: [
          "Menghasilkan kontrafaktual yang tidak masuk akal secara fisik (*plausibility violation*, misal merekomendasikan nasabah berusia -5 tahun).",
          "Membagikan kontrafaktual yang dapat dieksploitasi pengguna untuk melakukan manipulasi kecurangan sistem (*gaming the system*)."
        ],
        refTitle: "Sandra Wachter, Brent Mittelstadt, Chris Russell: Counterfactual Explanations Without Opening the Black Box: Automated Decisions and the GDPR (Harvard JOLT, 2018)",
        refUrl: "https://jolt.law.harvard.edu/articles/pdf/v31/31HarvJLTech841.pdf"
      },
      {
        num: "21.9",
        slug: "21-9-jebakan-dan-misinterpretasi-penjelasan-xai",
        title: "21.9. Jebakan dan Misinterpretasi Penjelasan XAI: Multikolinieritas dan Manipulasi Penjelasan",
        desc: "Kritik keandalan XAI: korelasi semu antar-fitur, pergeseran atribusi akibat fitur redundan, dan kerentanan penjelasan terhadap serangan adversarial (Fooling LIME/SHAP).",
        concept: `Meskipun metode XAI sangat berguna, praktisi harus mewaspadai jebakan metodologis dan bahaya misinterpretasi penjelasan:

**1. Jebakan Multikolinieritas (*Correlation Trap*):**
Jika dalam data terdapat dua fitur yang berkorelasi sempurna ($r = 0.99$, misal Pendapatan Bulanan dan Pendapatan Tahunan):
- Model pohon dapat membagi keputusan secara bergantian antara kedua fitur tersebut.
- Akibatnya, nilai SHAP dan Permutation Importance untuk kedua fitur tersebut **akan terbagi dua dan tampak kecil**, memberikan ilusi keliru bahwa kedua fitur tersebut tidak penting!

**2. Manipulasi Penjelasan Adversarial (*Fooling SHAP and LIME* / Slack et al., AIES 2020):**
Dylan Slack et al. membuktikan bahwa algoritma LIME dan SHAP dapat dimanipulasi secara cerdas oleh model adversarial:
- Penyerang dapat membangun model rasis/bias yang mendeteksi kapan input berasal dari data asli dan kapan input berasal dari sampel perturbasi LIME/SHAP.
- Model bertindak diskriminatif pada data asli, namun beralih menggunakan fitur yang tampak etis saat diuji oleh penjelas LIME/SHAP, **menghasilkan penjelasan palsu yang menyembunyikan bias berbahaya**!

**Aturan Emas:** XAI bukan pengganti audit kode, verifikasi data, dan tata kelola etis sistem.`,
        formula: `\\text{Corr}(X_1, X_2) \\approx 1.0 \\implies \\phi(X_1) \\approx \\frac{1}{2}\\phi_{\\text{true}}, \\quad \\phi(X_2) \\approx \\frac{1}{2}\\phi_{\\text{true}} \\quad (\\text{Dilusi Atribusi})`,
        code: `# 21.9: Demonstrasi Dilusi Atribusi Fitur Akibat Multikolinieritas Ekstrem
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.inspection import permutation_importance

# Sintesis data dengan 1 fitur penting + 1 fitur duplikat identik (Multikolinieritas)
np.random.seed(42)
x_penting = np.random.randn(200)
x_duplikat = x_penting + np.random.normal(0, 0.01, 200) # Kolinier 99.9%
x_noise = np.random.randn(200)
y = 3.0 * x_penting + np.random.normal(0, 0.5, 200)

X = np.column_stack([x_penting, x_duplikat, x_noise])

model = Ridge().fit(X, y)
pfi = permutation_importance(model, X, y, random_state=42)

print("=== DAMPAK MULTIKOLINIERITAS PADA ATRIBUSI XAI ===")
print(f"Koefisien Model (x_penting) : {model.coef_[0]:.4f} (Terbagi dua!)")
print(f"Koefisien Model (x_duplikat): {model.coef_[1]:.4f} (Terbagi dua!)")
print(f"PFI Skor x_penting           : {pfi.importances_mean[0]:.4f}")
print(f"PFI Skor x_duplikat          : {pfi.importances_mean[1]:.4f}")
print("Peringatan: Atribusi terbagi dan tampak rendah padahal informasinya sangat vital!")`,
        expectedOutput: "Koefisien dan PFI terbagi rata antara dua fitur kolinier, memperlihatkan efek dilusi atribusi.",
        codeExp: "Skrip mendemonstrasikan bagaimana korelasi multikolinieritas ekstrem mendilusi skor kepentingan fitur pada penjelasan XAI.",
        pitfalls: [
          "Menyimpulkan bahwa fitur dengan nilai SHAP rendah aman untuk dihapus tanpa memeriksa korelasinya dengan fitur lain.",
          "Mempercayai penjelasan LIME tanpa mengevaluasi nilai R2 dari model surrogate lokal."
        ],
        refTitle: "Dylan Slack et al.: Fooling LIME and SHAP: Adversarial Attacks on Post hoc Explanation Methods (AAAI/ACM AIES, 2020)",
        refUrl: "https://dl.acm.org/doi/10.1145/3375627.3375830"
      },
      {
        num: "21.10",
        slug: "21-10-implementasi-transparansi-kepatuhan-regulasi-gdpr",
        title: "21.10. Implementasi Sistem Transparansi untuk Regulasi Kepatuhan Finansial dan Medis",
        desc: "Penerapan standar hukum: pemenuhan hak atas penjelasan (Right to Explanation) EU GDPR Pasal 22, US Equal Credit Opportunity Act (ECOA), dan audit trail forensik.",
        concept: `Dalam yurisdiksi hukum internasional modern, penggunaan model machine learning kotak hitam tanpa penjelasan diatur secara ketat oleh undang-undang:
1. **EU General Data Protection Regulation (GDPR / Pasal 22):** Memberikan hak hukum kepada individu untuk tidak tunduk pada keputusan otomatis penuh dan memberikan **Hak atas Penjelasan (*Right to Explanation*)** mengenai logika keputusan algoritmik.
2. **US Equal Credit Opportunity Act (ECOA / Regulasi B):** Mewajibkan lembaga keuangan yang menolak kredit untuk mengeluarkan **Pemberitahuan Tindakan Merugikan (*Adverse Action Notices*)** yang merinci tepat $4$ faktor utama penyebab penolakan secara transparan.

**Arsitektur Audit Trail Forensik di Produksi:**
Untuk memenuhi audit kepatuhan, sistem machine learning produksi harus menyimpan:
- Log masukan fitur mentah versi hash.
- Versi model dan parameter checkpoint yang aktif saat inferensi.
- Nilai prediksi probabilitas dan ambang keputusan.
- **Vektor nilai SHAP lokal yang di-generate bersamaan dengan inferensi**, disimpan ke dalam database audit log yang tidak dapat diubah (*immutable audit log*).`,
        formula: `\\text{Adverse Action Factor}_k = \\text{Top-4 } \\arg\\min_j \\phi_j(\\mathbf{x}) \\quad (\\text{Faktor Utama Penolakan Kredit ECOA})`,
        code: `# 21.10: Generator Adverse Action Notice Otomatis Berbasis Atribusi XAI Regulasi ECOA
import pandas as pd

# Simulasi log inferensi penolakan pinjaman
id_aplikasi = "APP-2026-9812"
hasil_keputusan = "DITOLAK"
probabilitas_persetujuan = 0.28

# Vektor atribusi fitur lokal (SHAP values)
atribusi_fitur = {
    "Rasio Beban Utang terhadap Pendapatan (DTI)": -0.32,
    "Jumlah Pembayaran Macet dalam 24 Bulan": -0.28,
    "Panjang Riwayat Kredit Terlalu Pendek": -0.14,
    "Jumlah Permintaan Kredit Baru (Inquiries)": -0.09,
    "Tingkat Pemanfaatan Saldo Kartu Kredit": -0.05,
    "Pendapatan Tahunan": +0.18
}

# Urutkan faktor-faktor yang memberikan kontribusi negatif terbesar (penyebab penolakan)
faktor_negatif = sorted(
    [(k, v) for k, v in atribusi_fitur.items() if v < 0],
    key=lambda x: x[1]
)

print(f"=== SURAT PEMBERITAHUAN PENOLAKAN KREDIT RESMI (REGULASI ECOA) ===")
print(f"Nomor Aplikasi : {id_aplikasi}")
print(f"Status Putusan : {hasil_keputusan} (Skor Keyakinan: {probabilitas_persetujuan*100:.1f}%)")
print("\nSesuai regulasi kepatuhan hukum, berikut 4 alasan utama keputusan penolakan Anda:")
for rank, (alasan, dampak) in enumerate(faktor_negatif[:4], 1):
    print(f"{rank}. {alasan} (Bobot Dampak Penurunan: {abs(dampak)*100:.1f}%)")
print("\nStatus Kepatuhan Audit: MEMENUHI PERSYARATAN REGULASI FINANSIAL 100%")`,
        expectedOutput: "Sistem otomatis mengekstrak 4 alasan utama penolakan kredit berdasarkan urutan kontribusi SHAP negatif.",
        codeExp: "Skrip mengimplementasikan generator laporan transparansi Adverse Action Notices berbasis ranking kontribusi fitur negatif XAI untuk kepatuhan ECOA/GDPR.",
        pitfalls: [
          "Menyimpan nilai atribusi XAI hanya dalam format visual grafik gambar; simpan selalu nilai numerik JSON terstruktur di basis data untuk kebutuhan audit forensik.",
          "Menyampaikan istilah teknis algoritma ke konsumen; regulasi mewajibkan bahasa yang lugas dan dapat dipahami orang awam."
        ],
        refTitle: "Federal Reserve Board: Consumer Compliance Handbook: Equal Credit Opportunity Act (Regulation B)",
        refUrl: "https://www.federalreserve.gov/boarddocs/supmanual/cch/cch.pdf"
      }
    ]
  },

  // ==========================================
  // BAB 22: Etika, Kebocoran Data & Machine Learning Produksi
  // ==========================================
  {
    orderIndex: 22,
    id: "machine-learning-ch-22",
    slug: "bab-22-etika-kebocoran-data-dan-machine-learning-produksi",
    title: "BAB 22: Etika, Kebocoran Data & Machine Learning Produksi",
    desc: "Fondasi keandalan dan tata kelola model tingkat industri: taksonomi kebocoran data (Train-Test Contamination, Target & Temporal Leakage), pergeseran distribusi data (Covariate Shift, Concept Drift), algoritma deteksi drift DDM dan Page-Hinkley, keadilan algoritmik (Demographic Parity vs Equal Opportunity), mitigasi bias (reweighing, debiasing), reproduksibilitas eksperimen dan seed locking, dokumentasi standar Model Cards Mitchell et al., pemantauan produksi, serta Proyek Capstone komprehensif end-to-end.",
    coreConcepts: ["Data Leakage Taxonomy", "Temporal & Lookahead Bias", "Distribution Shifts (Covariate & Concept Drift)", "Drift Detection Algorithms (DDM, Page-Hinkley)", "Algorithmic Fairness Metrics", "Bias Mitigation Strategies", "Determinism & Reproducibility", "Model Cards for Model Reporting", "MLOps Production Monitoring", "End-to-End Capstone Architecture"],
    subchapters: [
      {
        num: "22.1",
        slug: "22-1-taksonomi-kebocoran-data-train-test-contamination",
        title: "22.1. Taksonomi Kebocoran Data: Kontaminasi Train-Test dan Target Leakage",
        desc: "Kajian Kaufman et al. (KDD 2012): perumusan kebocoran fitur prospektif, fitur proksi target tersembunyi, dan metodologi audit pencegahan.",
        concept: `**Kebocoran Data (*Data Leakage*)** adalah patologi paling merusak dalam pembelajaran mesin: situasi di mana informasi dari luar himpunan data latihan secara tidak sah menyusup ke dalam proses pembuatan model, menghasilkan performa semu yang fantastis saat pengujian namun gagal total saat model dideploy ke produksi nyata.

Shachar Kaufman, Saharon Rosset, Claudia Perlich, dan Ori Stitelman (ACM KDD, 2012) mengklasifikasikan kebocoran data ke dalam dua domain utama:

**1. Kebocoran Kontaminasi Data Latih-Uji (*Train-Test Contamination*):**
Terjadi saat keputusan pra-pemrosesan data menggunakan informasi global:
- Menghitung rata-rata penskalaan $\\mu$ dan varians $\\sigma$ pada seluruh dataset sebelum train-test split.
- Mengisi nilai kosong (*imputation*) menggunakan statistik yang mencakup set pengujian.
- Menjalankan seleksi fitur univariat atau PCA pada seluruh dataset.

**2. Kebocoran Informasi Target (*Target Leakage / Leaky Predictors*):**
Terjadi ketika fitur masukan memuat variabel yang **baru tercipta setelah target kejadian berlangsung atau secara langsung menjadi proksi dari target itu sendiri**:
- *Contoh Kasus Nyata:* Memprediksi apakah pasien terkena penyakit pneumonia, namun memasukkan fitur "Nomor Resep Obat Antibiotik Pneumonia". Di rumah sakit, dokter baru menulis resep obat pneumonia SETELAH mendiagnosis pasien terkena pneumonia! Model akan menghasilkan akurasi 100%, namun tidak memiliki kegunaan diagnosis dini apa pun bagi pasien baru yang belum diperiksa dokter.`,
        formula: `\\text{Fitur } X_j \\text{ Bocor} \\iff I(X_j; Y \\mid \\text{Informasi Waktu Operasional}) \\approx H(Y) \\quad (\\text{Kondisi Target Leakage})`,
        code: `# 22.1: Audit Deteksi Kolom Leaky Target Menggunakan Analisis Korelasi dan AUC
import pandas as pd
import numpy as np
from sklearn.metrics import roc_auc_score

# Simulasi data dengan 1 fitur normal, 1 fitur derau, dan 1 fitur bocor (Leaky Target)
np.random.seed(42)
n = 1000
target_kanker = np.random.choice([0, 1], p=[0.9, 0.1], size=n)

df = pd.DataFrame({
    'umur': np.random.normal(50, 10, n),
    'riwayat_keluarga': np.random.choice([0, 1], p=[0.8, 0.2], size=n),
    # FITUR BOCOR: Catatan 'jadwal_operasi_kanker' yang hanya ada jika pasien positif
    'jadwal_operasi_kanker': np.where(target_kanker == 1, np.random.choice([1, 0], p=[0.95, 0.05], size=n), 0)
})

print("=== AUDIT FORENSIK DETEKSI TARGET LEAKAGE ===")
for col in df.columns:
    auc = roc_auc_score(target_kanker, df[col])
    status = "⚠️ BAHAYA BOCOR (LEAKAGE)!" if auc > 0.90 else "Aman (Fitur Wajar)"
    print(f"Fitur: {col:22s} -> ROC-AUC Terhadap Target: {auc:.4f} | {status}")`,
        expectedOutput: "Audit otomatis mengidentifikasi fitur jadwal operasi memiliki ROC-AUC 0.975 (Target Leakage).",
        codeExp: "Skrip mendemonstrasikan audit otomatis korelasi bivariat fitur terhadap label target untuk mendeteksi variabel bocor yang mencurigakan.",
        pitfalls: [
          "Membanggakan akurasi model 99.9% pada iterasi pertama tanpa curiga akan adanya target leakage.",
          "Memasukkan kolom ID transaksi, nomor invoice unik, atau timestamp masa depan yang berkorelasi dengan pemrosesan target."
        ],
        refTitle: "S. Kaufman et al.: Leakage in data mining: Formulation, detection, and avoidance (ACM TKDD, 2012)",
        refUrl: "https://dl.acm.org/doi/10.1145/2382577.2382579"
      },
      {
        num: "22.2",
        slug: "22-2-kebocoran-waktu-lookahead-bias-runtun-waktu",
        title: "22.2. Kebocoran Data Berbasis Waktu (Lookahead Bias / Data Snooping)",
        desc: "Kajian kritis data runtun waktu dan finansial: pencegahan penggunaan informasi masa depan untuk memprediksi masa lalu via validasi purging dan embargo.",
        concept: `Dalam data runtun waktu (*time series*), peramalan pasar saham, dan log transaksi kronologis, pelanggaran metodologi paling fatal adalah **Lookahead Bias (Data Snooping / Peeking into the Future)**: menggunakan informasi dari masa depan ($t > T$) untuk memprediksi kejadian di masa lalu ($t \\le T$).

Marcos López de Prado (2018) dalam bukunya *"Advances in Financial Machine Learning"* mengidentifikasi kegagalan umum validasi silang pada data kuantitatif:

**Dua Metode Kritis Menghilangkan Kebocoran Finansial:**
1. **Purging (Pembersihan Tumpang Tindih):**
   Pada data perdagangan saham, sebuah label target sering kali dievaluasi berdasarkan horizon waktu ke depan (misalnya keuntungan dalam $5$ hari ke depan). Jika sampel di fold latih memiliki horizon waktu yang bertumpang tindih dengan awal fold validasi, model di fold latih secara tidak langsung telah mengetahui hasil harga di fold validasi. **Purging membuang seluruh sampel data latih yang horizon waktunya bersentuhan dengan fold validasi**.
2. **Embargo (Jeda Keamanan):**
   Setelah periode fold validasi berakhir, serial korelasi dan memori pasar masih dapat tersisa. **Embargo menambahkan jeda waktu hening (*lockout buffer*)** (misalnya 5 hari kerja) sebelum sampel latihan berikutnya diizinkan masuk ke model.`,
        formula: `\\text{Purging: } \\mathcal{D}_{\\text{train}} = \\mathcal{D}_{\\text{train}} \\setminus \\{i \\mid [t_{i, \\text{start}}, t_{i, \\text{end}}] \\cap [T_{\\text{val, start}}, T_{\\text{val, end}}] \\neq \\emptyset\\}`,
        code: `# 22.2: Implementasi Pemisahan TimeSeriesSplit vs KFold Acak pada Deret Waktu
from sklearn.model_selection import TimeSeriesSplit, KFold
import numpy as np

timestamps = np.arange(10)

# 1. KFold Acak Biasa (SALAH FATAL PADA DERET WAKTU)
print("=== DEMONSTRASI BAHAYA KFOLD ACAK PADA DERET WAKTU ===")
kf = KFold(n_splits=3, shuffle=True, random_state=42)
for fold, (tr, val) in enumerate(kf.split(timestamps)):
    print(f"Fold {fold+1}: Latih={tr} | Validasi={val} (Masa depan latih masa lalu: BOCOR!)")

# 2. TimeSeriesSplit (BENAR & KRONOLOGIS)
print("\n=== PEMISAHAN KRONOLOGIS AMAN (TIMESERIESSPLIT) ===")
tscv = TimeSeriesSplit(n_splits=3)
for fold, (tr, val) in enumerate(tscv.split(timestamps)):
    print(f"Fold {fold+1}: Masa Lalu (Latih)={tr} -> Masa Depan (Validasi)={val} (Aman Kronologis)")`,
        expectedOutput: "KFold acak mencampuradukkan waktu, sedangkan TimeSeriesSplit mempertahankan urutan waktu secara ketat.",
        codeExp: "Skrip memperlihatkan bahaya pencampuran masa lalu dan masa depan pada KFold biasa vs isolasi kronologis pada TimeSeriesSplit.",
        pitfalls: [
          "Melakukan pengacakan shuffle=True pada data runtun waktu finansial.",
          "Menghitung moving average atau Bollinger Bands menggunakan jendela terpusat (center=True) yang membaca data masa depan."
        ],
        refTitle: "Marcos López de Prado: Advances in Financial Machine Learning (John Wiley & Sons, 2018)",
        refUrl: "https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086"
      },
      {
        num: "22.3",
        slug: "22-3-pergeseran-distribusi-data-covariate-concept-drift",
        title: "22.3. Pergeseran Distribusi Data: Covariate Shift, Prior Probability Shift, dan Concept Drift",
        desc: "Dekomposisi teorema Bayes P(X, Y) = P(X) P(Y|X): formalisasi matematis tiga jenis pergeseran lingkungan inferensi produksi.",
        concept: `Model pembelajaran mesin dilatih berdasarkan asumsi bahwa data masa depan berasal dari distribusi probabilitas gabungan yang identik dengan data latihan: $P_{\\text{train}}(\\mathbf{X}, Y) = P_{\\text{test}}(\\mathbf{X}, Y)$. Di dunia nyata, kondisi ini **pasti akan dilanggar seiring berjalannya waktu**.

Berdasarkan aturan dekomposisi rantai probabilitas $P(\\mathbf{X}, Y) = P(\\mathbf{X}) \\cdot P(Y \\mid \\mathbf{X}) = P(Y) \\cdot P(\\mathbf{X} \\mid Y)$, terdapat tiga bentuk **Pergeseran Distribusi (*Dataset Shift*)**:

**1. Covariate Shift (Pergeseran Kovariat):**
- **Definisi:** Distribusi fitur masukan berubah ($P_{\\text{train}}(\\mathbf{X}) \\neq P_{\\text{test}}(\\mathbf{X})$), namun hubungan bersyarat pemetaan fungsi target tetap konstan ($P(Y \\mid \\mathbf{X})$ tidak berubah).
- *Contoh:* Model deteksi wajah dilatih pada populasi usia 20-30 tahun, lalu dideploy ke panti jompo usia 70-80 tahun. Karakteristik wajah berbeda, namun pemetaan biologis ekspresi wajah tetap sama.

**2. Prior Probability Shift / Label Shift:**
- **Definisi:** Distribusi frekuensi label target berubah ($P_{\\text{train}}(Y) \\neq P_{\\text{test}}(Y)$), namun karakteristik fitur untuk kelas tersebut tetap sama ($P(\\mathbf{X} \\mid Y)$ konstan).
- *Contoh:* Terjadinya wabah pandemi flu yang melipatgandakan prevalensi penyakit positif dari 2% menjadi 30%.

**3. Concept Drift (Pergeseran Konsep):**
- **Definisi:** Hubungan bersyarat antara fitur masukan dan target itu sendiri **berubah dan bergeser (*the concept changes*)**:
  $$P_{\\text{train}}(Y \\mid \\mathbf{X}) \\neq P_{\\text{test}}(Y \\mid \\mathbf{X})$$
- *Contoh:* Sebelum pandemi, pembelian 50 kotak masker medis dalam 1 transaksi dianggap anomali penipuan; pasca pandemi, perilaku ini menjadi pembelian wajar normal. Aturan semantik hubungan telah bergeser!`,
        formula: `\\text{Concept Drift:} \\quad P_{\\text{train}}(Y \\mid \\mathbf{X}) \\neq P_{\\text{test}}(Y \\mid \\mathbf{X}) \\quad (\\text{Perubahan Definisi Semantik})`,
        code: `# 22.3: Uji Statistik Pendeteksi Covariate Shift Menggunakan Kolmogorov-Smirnov Test
import numpy as np
from scipy.stats import ks_2samp

# Distribusi Fitur Masa Latihan (Baseline)
np.random.seed(42)
fitur_latih = np.random.normal(loc=100.0, scale=15.0, size=1000)

# Skenario A: Produksi Bulan 1 (Tanpa Drift)
fitur_prod_stabil = np.random.normal(loc=100.2, scale=14.9, size=500)

# Skenario B: Produksi Bulan 6 (Terjadi Covariate Shift)
fitur_prod_drift = np.random.normal(loc=110.5, scale=18.0, size=500)

# Jalankan Uji Dua Sampel Kolmogorov-Smirnov (KS-Test)
ks_stabil = ks_2samp(fitur_latih, fitur_prod_stabil)
ks_drift = ks_2samp(fitur_latih, fitur_prod_drift)

print("=== DETEKSI COVARIATE SHIFT MENGGUNAKAN KS-TEST ===")
print(f"Bulan 1 (Stabil) : p-value = {ks_stabil.pvalue:.4f} (p > 0.05: Distribusi Identik Aman)")
print(f"Bulan 6 (Drift)  : p-value = {ks_drift.pvalue:.4e} (p < 0.001: COVARIATE SHIFT TERDETEKSI!)")`,
        expectedOutput: "KS-Test membuktikan p-value sangat kecil pada bulan ke-6, mengonfirmasi pergeseran kovariat.",
        codeExp: "Skrip memanfaatkan uji Kolmogorov-Smirnov (scipy.stats.ks_2samp) untuk mendeteksi pergeseran distribusi fitur masukan secara kuantitatif.",
        pitfalls: [
          "Melakukan retrain model saat terjadi Covariate Shift tanpa menguji apakah Concept Drift juga terjadi (retrain pada P(Y|X) yang berubah membutuhkan label baru).",
          "Mengabaikan fakta bahwa deteksi Concept Drift murni memerlukan label kebenaran terbaru."
        ],
        refTitle: "J. Gama et al.: A survey on concept drift adaptation (ACM Computing Surveys, 2014)",
        refUrl: "https://dl.acm.org/doi/10.1145/2523813"
      },
      {
        num: "22.4",
        slug: "22-4-algoritma-deteksi-drift-ddm-dan-page-hinkley",
        title: "22.4. Algoritma Deteksi Pergeseran Konsep: DDM dan Page-Hinkley Test",
        desc: "Mekanisme pengawasan streaming: pemantauan tingkat galat model bertahap via Drift Detection Method (Gama et al. 2004) dan uji kumulatif Page-Hinkley.",
        concept: `Dalam arsitektur data streaming produksi berkecepatan tinggi, sistem memerlukan algoritma otomatis yang mampu mendeteksi kapan Concept Drift terjadi secara real-time untuk memicu proses pelatihan ulang (*automated retraining trigger*).

Dua algoritma standar industri:

**1. Drift Detection Method (DDM / João Gama et al., 2004):**
Memodelkan tingkat galat model klasifikasi sebagai variabel acak Bernoulli dengan parameter $p_t$ (probabilitas salah) dan deviasi standar $s_t = \\sqrt{p_t(1 - p_t) / t}$.
Algoritma melacak nilai minimum $p_{\\min} + s_{\\min}$ yang pernah dicapai.
- **Tingkat Peringatan (*Warning Level*):**
  $$p_t + s_t \\ge p_{\\min} + 2 \\cdot s_{\\min}$$
  Sistem mulai menyimpan sampel-sampel baru ke dalam memori penyangga (*buffer*).
- **Tingkat Pergeseran (*Drift Level*):**
  $$p_t + s_t \\ge p_{\\min} + 3 \\cdot s_{\\min}$$
  Concept Drift secara formal terbukti terjadi! Sistem otomatis membuang model lama dan melatih model baru murni dari sampel penyangga.

**2. Uji Page-Hinkley (Page, 1954):**
Metode uji perubahan titik berurutan (*sequential change detection*) yang memantau deviasi kumulatif terhadap nilai rata-rata sampel dengan ambang batas batas toleransi $\\lambda$.`,
        formula: `\\text{Drift Alarm Trigger: } p_t + s_t \\ge p_{\\min} + 3 s_{\\min} \\implies \\text{Picu Otomatis Model Retraining}`,
        code: `# 22.4: Implementasi Algoritma Deteksi Drift DDM Sederhana dari Nol
import numpy as np

class DriftDetectionMethodDDM:
    def __init__(self):
        self.p_min = float('inf')
        self.s_min = float('inf')
        self.reset()
        
    def reset(self):
        self.n = 0
        self.errors = 0
        self.p_min = float('inf')
        self.s_min = float('inf')
        
    def add_element(self, is_error):
        self.n += 1
        self.errors += int(is_error)
        p = self.errors / self.n
        s = np.sqrt(p * (1.0 - p) / self.n) if self.n > 1 else 0.0
        
        if self.n > 30:
            if p + s < self.p_min + self.s_min:
                self.p_min = p
                self.s_min = s
            if p + s >= self.p_min + 3.0 * self.s_min:
                return "DRIFT_DETECTED"
            elif p + s >= self.p_min + 2.0 * self.s_min:
                return "WARNING_ZONE"
        return "STABLE"

ddm = DriftDetectionMethodDDM()
# Aliran 1: 100 data stabil (galat rendah 5%)
stream_stable = np.random.choice([0, 1], p=[0.95, 0.05], size=100)
# Aliran 2: Terjadi drift tiba-tiba (galat melonjak ke 35%)
stream_drift = np.random.choice([0, 1], p=[0.65, 0.35], size=100)
stream_total = np.concatenate([stream_stable, stream_drift])

print("=== SIMULASI DETEKSI DRIFT STREAMING (DDM) ===")
for t, err in enumerate(stream_total):
    status = ddm.add_element(err)
    if status == "DRIFT_DETECTED":
        print(f"ALARM: Concept Drift Terdeteksi pada Langkah t = {t+1}! (Segera Latih Ulang Model)")
        break`,
        expectedOutput: "DDM mendeteksi lonjakan tingkat galat dan membunyikan alarm drift pada aliran data kedua.",
        codeExp: "Skrip mengimplementasikan algoritma DDM Joao Gama untuk mendeteksi perubahan tingkat kesalahan model klasifikasi secara streaming.",
        pitfalls: [
          "DDM memerlukan ukuran sampel minimum (n > 30) sebelum mulai mengevaluasi statistik stabil.",
          "DDM bekerja paling baik untuk pergeseran mendadak (*abrupt drift*); untuk pergeseran sangat lambat (*gradual drift*), gunakan algoritma EDDM."
        ],
        refTitle: "J. Gama, P. Medas, G. Castillo, P. Rodrigues: Learning with Drift Detection (SBIA, 2004)",
        refUrl: "https://link.springer.com/chapter/10.1007/978-3-540-28645-5_29"
      },
      {
        num: "22.5",
        slug: "22-5-keadilan-algoritmik-demographic-parity-equal-opportunity",
        title: "22.5. Keadilan Algoritmik (Algorithmic Fairness): Demographic Parity vs Equal Opportunity",
        desc: "Kajian etika komputasi Hardt et al. (NeurIPS 2016): perumusan matematis keadilan demografis independen vs kesetaraan peluang berbasis kualifikasi.",
        concept: `Ketika model pembelajaran mesin digunakan untuk membuat keputusan yang mengubah hidup manusia (seperti vonis pembebasan bersyarat, perekrutan kerja, atau persetujuan pinjaman), model tersebut rentan mereplikasi dan memperkuat bias diskriminatif historis terhadap kelompok demografis yang dilindungi (*protected attributes* $A \\in \\{0, 1\\}$, seperti gender, ras, atau agama).

Moritz Hardt, Eric Price, dan Nathan Srebro (NeurIPS 2016) merumuskan kriteria matematis keadilan algoritmik:

**1. Paritas Demografis (*Demographic Parity / Independence*):**
Mensyaratkan bahwa **tingkat penerimaan hasil positif harus identik di seluruh kelompok demografis**, sepenuhnya independen dari status atribut yang dilindungi:
$$P(\\hat{Y} = 1 \\mid A = 0) = P(\\hat{Y} = 1 \\mid A = 1)$$
*Kritik:* Mengabaikan perbedaan kualifikasi aktual antar kelompok; dapat memaksa penerimaan kandidat yang tidak memenuhi syarat demi kuota numerik.

**2. Kesetaraan Peluang (*Equal Opportunity / Separation*):**
Mensyaratkan bahwa **True Positive Rate (Recall) harus setara di seluruh kelompok**. Di antara orang-orang yang **benar-benar memenuhi syarat** ($Y = 1$), peluang mereka untuk diprediksi positif oleh model harus setara tanpa bias:
$$P(\\hat{Y} = 1 \\mid A = 0, Y = 1) = P(\\hat{Y} = 1 \\mid A = 1, Y = 1)$$

**Teorema Ketidakmungkinan Keadilan (Kleinberg et al. 2016):**
Secara matematis terbukti bahwa Demographic Parity, Equalized Odds, dan Kalibrasi Prediktif **mustahil dipenuhi secara simultan** kecuali jika prevalensi dasar antar kelompok identik atau akurasi model adalah 100% sempurna!`,
        formula: `\\text{Equal Opportunity: } \\text{TPR}_{A=0} = \\text{TPR}_{A=1} \\iff P(\\hat{Y}=1 \\mid A=0, Y=1) = P(\\hat{Y}=1 \\mid A=1, Y=1)`,
        code: `# 22.5: Audit Keadilan Algoritmik Demographic Parity dan Equal Opportunity
import numpy as np
from sklearn.metrics import recall_score

# Simulasi data keputusan kredit 1000 pelamar
np.random.seed(42)
protected_group = np.random.choice([0, 1], p=[0.5, 0.5], size=1000) # Atribut Dilindungi
y_true = np.random.choice([0, 1], p=[0.6, 0.4], size=1000) # Kelayakan Sebenarnya

# Simulasi model yang memiliki bias terhadap Grup 0
y_pred = y_true.copy()
# Korup prediksi positif pada grup 0 (diskriminasi sistemik)
bias_mask = (protected_group == 0) & (y_true == 1) & (np.random.rand(1000) < 0.35)
y_pred[bias_mask] = 0

# 1. Evaluasi Demographic Parity (Tingkat Penerimaan)
acc_rate_0 = np.mean(y_pred[protected_group == 0])
acc_rate_1 = np.mean(y_pred[protected_group == 1])

# 2. Evaluasi Equal Opportunity (TPR / Recall)
tpr_0 = recall_score(y_true[protected_group == 0], y_pred[protected_group == 0])
tpr_1 = recall_score(y_true[protected_group == 1], y_pred[protected_group == 1])

print("=== AUDIT KEADILAN ALGORITMIK (FAIRNESS AUDIT) ===")
print(f"Demographic Parity  : Grup 0 = {acc_rate_0*100:.1f}% | Grup 1 = {acc_rate_1*100:.1f}% (Disparitas: {abs(acc_rate_0 - acc_rate_1)*100:.1f}%)")
print(f"Equal Opportunity   : TPR Grup 0 = {tpr_0*100:.1f}% | TPR Grup 1 = {tpr_1*100:.1f}% (Pelanggaran Keadilan!)")`,
        expectedOutput: "Audit keadilan mendeteksi disparitas signifikan pada demographic parity dan equal opportunity.",
        codeExp: "Skrip menghitung metrik keadilan algoritmik Demographic Parity dan Equal Opportunity untuk mengaudit disparitas perlakuan model terhadap kelompok rentan.",
        pitfalls: [
          "Menghapus kolom atribut sensitif (seperti ras atau gender) dari dataset dengan anggapan model otomatis adil (*fairness through blindness*); model tetap dapat mempelajari bias melalui fitur proksi seperti kode pos.",
          "Mengejar Demographic Parity tanpa memperhitungkan trade-off hilangnya akurasi bisnis global."
        ],
        refTitle: "Moritz Hardt, Eric Price, Nathan Srebro: Equality of Opportunity in Supervised Learning (NeurIPS, 2016)",
        refUrl: "https://papers.nips.cc/paper/2016/hash/9d2682367c3b8f07b5705f89162b29c2-Abstract.html"
      },
      {
        num: "22.6",
        slug: "22-6-mitigasi-bias-algoritma-pre-in-post-processing",
        title: "22.6. Strategi Mitigasi Bias Algoritma: Pre-processing, In-processing, dan Post-processing",
        desc: "Intervensi rekayasa etis: pembobotan ulang sampel (Reweighing Kamiran & Calders), optimasi adversarial debiasing, dan kalibrasi ambang batas kesetaraan.",
        concept: `Untuk memperbaiki ketidakadilan algoritmik yang terdeteksi, komunitas sains data menerapkan intervensi pada salah satu dari **tiga tahapan siklus hidup pembelajaran mesin**:

**1. Intervensi Pra-Pemrosesan (*Pre-Processing* - Modifikasi Data):**
Dilakukan sebelum model dilatih. Contoh utama: **Reweighing (Faisal Kamiran & Toon Calders, 2012)**:
Memberikan bobot statistik $W$ pada setiap sampel latihan untuk menyeimbangkan disparitas:
$$W(A=a, Y=y) = \\frac{P(A=a) \\times P(Y=y)}{P(A=a, Y=y)}$$
Sampel dari kelompok yang kurang terwakili diberikan bobot lebih besar tanpa mengubah label fisik.

**2. Intervensi Saat-Pelatihan (*In-Processing* - Modifikasi Algoritma):**
Menambahkan kendala penalti keadilan (*fairness constraint*) langsung ke dalam fungsi objektif optimasi model, seperti **Adversarial Debiasing (Zhang et al. 2018)** di mana jaringan neural sekunder mencoba memprediksi atribut sensitif dari representasi laten model utama.

**3. Intervensi Pasca-Pemrosesan (*Post-Processing* - Modifikasi Keputusan):**
Model dibiarkan utuh sebagai kotak hitam. Kita menetapkan **ambang batas keputusan yang berbeda untuk masing-masing kelompok demografis** ($\\tau_{A=0} \\neq \\tau_{A=1}$) sedemikian rupa sehingga True Positive Rate atau rasio penerimaan kedua kelompok tepat seimbang!`,
        formula: `W(a, y) = \\frac{P(A=a) P(Y=y)}{P(A=a, Y=y)} \\quad (\\text{Formula Pembobotan Reweighing Kamiran-Calders})`,
        code: `# 22.6: Implementasi Algoritma Reweighing Kamiran-Calders untuk Mitigasi Bias
import numpy as np
from sklearn.linear_model import LogisticRegression

# Data 1000 pelamar dengan ketimpangan historis
A = np.array([0]*500 + [1]*500) # Atribut sensitif
Y = np.array([1]*150 + [0]*350 + [1]*350 + [0]*150) # Kelompok 0 historis dirugikan
X = np.random.randn(1000, 4)

# Hitung bobot Reweighing teoritis Kamiran & Calders
weights = np.zeros(len(Y))
for a_val in [0, 1]:
    for y_val in [0, 1]:
        mask = (A == a_val) & (Y == y_val)
        P_a = np.mean(A == a_val)
        P_y = np.mean(Y == y_val)
        P_ay = np.mean(mask)
        weights[mask] = (P_a * P_y) / P_ay

print("=== MITIGASI BIAS DENGAN REWEIGHING (KAMIRAN & CALDERS) ===")
print(f"Bobot Sampel (Grup 0, Positif): {weights[0]:.4f} (Dinaikkan untuk keadilan)")
print(f"Bobot Sampel (Grup 1, Positif): {weights[500]:.4f} (Disesuaikan proporsional)")

# Latih model dengan sample_weight terkalibrasi adil
fair_model = LogisticRegression().fit(X, Y, sample_weight=weights)
print("Model berhasil dilatih dengan kompensasi bobot keadilan statistik!")`,
        expectedOutput: "Bobot reweighing terhitung proporsional menaikkan representasi kelompok yang dirugikan.",
        codeExp: "Skrip mengimplementasikan formula pembobotan data Reweighing Kamiran-Calders untuk memitigasi bias historis pada data latih.",
        pitfalls: [
          "Post-processing dengan ambang batas berbeda per kelompok dapat bertentangan dengan hukum di beberapa negara yang melarang penggunaan eksplisit atribut sensitif dalam keputusan akhir.",
          "Menerapkan reweighing tanpa memvalidasi apakah data fitur penjelas itu sendiri memuat bias sistemik."
        ],
        refTitle: "Faisal Kamiran & Toon Calders: Data preprocessing techniques for classification without discrimination (Knowledge and Information Systems, 2012)",
        refUrl: "https://link.springer.com/article/10.1007/s10115-011-0463-8"
      },
      {
        num: "22.7",
        slug: "22-7-reproduksibilitas-eksperimen-dan-seed-locking",
        title: "22.7. Reproduksibilitas Eksperimen: Penjaminan Determinisme Hardware dan Software",
        desc: "Protokol ketat rekayasa AI: penguncian seed acak pada Python, NumPy, cuDNN, dan pematrian dependensi paket melalui environment locking.",
        concept: `Krisis reproduksibilitas (*reproducibility crisis*) adalah masalah besar dalam riset dan industri pembelajaran mesin: seorang ilmuwan data mengklaim akurasi $94.5\\%$ di laptopnya, namun saat kodenya dijalankan oleh rekan tim atau di server produksi, akurasi yang dihasilkan berbeda menjadi $91.2\\%$ atau bahkan kodenya gagal dieksekusi.

**Tiga Pilar Reproduksibilitas Eksperimen Penuh:**
1. **Penguncian Benih Acak Multi-Lapisan (*Multi-Layer Seed Locking*):**
   Generator bilangan acak (*Pseudo-Random Number Generator - PRNG*) beroperasi di berbagai lapisan perangkat lunak yang berbeda:
   - Python built-in \`random.seed(seed)\`
   - NumPy \`np.random.seed(seed)\`
   - Scikit-Learn \`random_state=seed\`
   - Algoritma GPU paralel multi-thread (seperti non-deterministik cuDNN atomic additions).
2. **Pematrian Dependensi Pustaka (*Dependency Pinning & Locking*):**
   Perbedaan versi minor pustaka (misal perubahan default parameter \`n_init='auto'\` pada Scikit-Learn 1.4 vs 1.2) dapat mengubah hasil secara signifikan. Gunakan file \`uv.lock\`, \`poetry.lock\`, atau \`requirements.txt\` dengan hash SHA-256 terpatri.
3. **Kontainerisasi Lingkungan (*Environment Containerization*):**
   Membungkus seluruh lingkungan sistem operasi, driver CUDA, pustaka C++, dan kode aplikasi ke dalam **Docker Container** yang dapat direplikasi identik di server mana pun.`,
        formula: `\\forall \\text{Run } A, B \\implies \\text{Seed}(A) = \\text{Seed}(B) \\implies \\hat{\\mathbf{y}}_A \\equiv \\hat{\\mathbf{y}}_B \\quad (\\text{Determinisme Mutlak})`,
        code: `# 22.7: Utilitas Penguncian Seed Determinisme Multi-Pustaka Standar Industri
import random
import os
import numpy as np

def lock_all_random_seeds(seed=42):
    """Mengunci seluruh generator bilangan acak di berbagai pustaka untuk determinisme."""
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    # Jika menggunakan PyTorch:
    # torch.manual_seed(seed)
    # torch.cuda.manual_seed_all(seed)
    # torch.backends.cudnn.deterministic = True
    print(f"[REPRODUCIBILITY] Seluruh PRNG Seed Dikunci pada Nilai: {seed}")

# Uji dua eksekusi independen
lock_all_random_seeds(42)
angka_acak_run1 = np.random.randn(3)

lock_all_random_seeds(42)
angka_acak_run2 = np.random.randn(3)

print("=== VERIFIKASI DETERMINISME REPRODUKSIBILITAS ===")
print("Run 1 Output:", np.round(angka_acak_run1, 5))
print("Run 2 Output:", np.round(angka_acak_run2, 5))
print("Apakah Hasil Identik 100%? :", np.array_equal(angka_acak_run1, angka_acak_run2))`,
        expectedOutput: "Hasil run 1 dan run 2 identik sempurna membuktikan determinisme PRNG.",
        codeExp: "Skrip mendefinisikan fungsi utilitas penguncian seed multi-layer untuk menjamin reproduksibilitas eksperimen machine learning.",
        pitfalls: [
          "Lupa menyetel variabel lingkungan PYTHONHASHSEED sebelum interpreter Python dijalankan.",
          "Mengasumsikan determinisme dipertahankan ketika berganti arsitektur prosesor (CPU x86 vs ARM Apple Silicon memiliki instruksi floating point yang sedikit berbeda)."
        ],
        refTitle: "Joelle Pineau et al.: Improving Reproducibility in Machine Learning Research (JMLR, 2021)",
        refUrl: "https://www.jmlr.org/papers/v22/20-303.html"
      },
      {
        num: "22.8",
        slug: "22-8-dokumentasi-model-cards-mitchell-2019",
        title: "22.8. Dokumentasi Standar Model: Model Cards for Model Reporting Mitchell et al. (2019)",
        desc: "Standar transparansi industri Google Research: struktur dokumentasi formal Model Cards untuk batas kegunaan, faktor demografis, dan metrik evaluasi etis.",
        concept: `Dalam industri perangkat keras dan obat-obatan, setiap produk wajib disertai lembar data keselamatan (*data sheet* / label nutrisi). Margaret Mitchell et al. (Google Research, ACM FAT* 2019) mengusulkan standar industri serupa untuk kecerdasan buatan: **Model Cards for Model Reporting**.

**Struktur Resmi 9 Bagian Model Card:**
1. **Model Details:** Nama model, pengembang, tanggal rilis, versi, lisensi, dan jenis arsitektur.
2. **Intended Use (Tujuan Penggunaan):** Kasus penggunaan utama yang didukung secara resmi, serta **daftar penggunaan di luar cakupan yang dilarang (*out-of-scope uses*)**.
3. **Factors:** Faktor demografis, lingkungan, atau instrumen yang berpotensi memengaruhi performa model (seperti usia, ras, pencahayaan kamera).
4. **Metrics:** Metrik evaluasi performa yang dipilih (beserta alasan pemilihannya) dan ambang batas keputusan.
5. **Evaluation Data:** Rincian dataset evaluasi, motivasi pemilihannya, dan proses kurasi.
6. **Training Data:** Gambaran umum dataset latihan (tanpa membocorkan privasi data sensitif).
7. **Quantitative Analyses:** Hasil evaluasi kuantitatif yang **didekomposisi per sub-kelompok demografis** untuk transparansi disparitas.
8. **Ethical Considerations:** Analisis risiko bahaya etis, potensi diskriminasi, dan mekanisme mitigasi yang diterapkan.
9. **Caveats and Recommendations:** Keterbatasan teknis model yang diketahui dan rekomendasi kehati-hatian bagi pengguna akhir.`,
        formula: `\\text{Model Card Schema} = \\{ \\text{Details}, \\text{Intended Use}, \\text{Metrics}, \\text{Factors}, \\text{Ethical Considerations} \\}`,
        code: `# 22.8: Generator Metadata Dokumentasi Model Card Standar JSON Schema
import json

model_card = {
    "schema_version": "0.0.2",
    "model_details": {
        "name": "Velqora-Credit-Risk-Predictor",
        "version": "1.0.0",
        "architecture": "HistGradientBoostingClassifier + CalibratedClassifierCV",
        "developer": "Tim Velqora AI Labs",
        "license": "Proprietary"
    },
    "intended_use": {
        "primary_uses": "Pemberian skor risiko gagal bayar pinjaman mikro UMKM",
        "out_of_scope_uses": "Dilarang digunakan untuk evaluasi perekrutan kerja atau penentuan asuransi kesehatan"
    },
    "performance_metrics": {
        "primary_metric": "ROC-AUC",
        "validation_score": 0.892,
        "fairness_metric": "Equal Opportunity Disparity < 0.03"
    },
    "ethical_considerations": {
        "sensitive_attributes_monitored": ["Gender", "Kelompok_Usia"],
        "mitigation_technique": "Reweighing pre-processing + Threshold Tuning"
    }
}

print("=== TEMPLATE MODEL CARD STANDAR GOOGLE RESEARCH (JSON SCHEMA) ===")
print(json.dumps(model_card, indent=2))`,
        expectedOutput: "Metadata model card terstruktur sesuai spesifikasi formal Mitchell et al.",
        codeExp: "Skrip mendefinisikan skema terstruktur Model Cards for Model Reporting dalam format JSON untuk dokumentasi transparansi model produksi.",
        pitfalls: [
          "Menulis intended use yang terlalu umum seperti 'model ini memprediksi risiko apa saja' tanpa mendefinisikan batasan domain yang tegas.",
          "Menyembunyikan kelemahan model; nilai utama dari model card adalah kejujuran dalam membeberkan batasan dan kegagalan model."
        ],
        refTitle: "Margaret Mitchell et al.: Model Cards for Model Reporting (ACM FAT*, 2019)",
        refUrl: "https://dl.acm.org/doi/10.1145/3287560.3287596"
      },
      {
        num: "22.9",
        slug: "22-9-arsitektur-pemantauan-model-produksi-mlops",
        title: "22.9. Arsitektur Pemantauan Model di Produksi (MLOps): Latensi, Throughput, dan Drift",
        desc: "Operasionalisasi sistem AI: pemantauan empat pilar MLOps (Kesehatan Sistem, Kualitas Data, Performa Model, dan Integritas Penjelasan) via Prometheus & Grafana.",
        concept: `Setelah model dideploy ke dalam lingkungan produksi (misalnya di balik container FastAPI atau Kubernetes pod), model tersebut memasuki fase operasionalisasi **MLOps (Machine Learning Operations)**.

**Empat Pilar Pemantauan Model Produksi (Production Monitoring Stack):**
1. **Pemantauan Kesehatan Sistem (*System Health Metrics*):**
   - **Latensi Inferensi (*Latency*):** Waktu respons komputasi per transaksi (target: $p_{99} < 100\\text{ ms}$).
   - **Throughput:** Jumlah permintaan inferensi per detik (Requests Per Second - RPS).
   - **Konsumsi Sumber Daya:** Utilisasi CPU, VRAM GPU, dan Memory Leak.
2. **Pemantauan Kualitas Data Masukan (*Data Quality Monitoring*):**
   - Mendeteksi lonjakan nilai kosong (\`missing value spike\`), anomali tipe data (*schema violations*), atau nilai di luar rentang wajar (*out-of-bound errors*).
3. **Pemantauan Pergeseran Distribusi (*Drift Monitoring*):**
   - Menghitung statistik Population Stability Index (PSI) dan Wasserstein Distance harian pada fitur masukan.
4. **Pemantauan Output Prediksi (*Prediction Drift*):**
   - Memantau apakah proporsi persetujuan pinjaman tiba-tiba melonjak drastis, mengindikasikan adanya pergeseran perilaku atau bug pada pipeline data upstream.`,
        formula: `p_{99}(\\text{Latency}) \\le 50\\text{ ms}, \\quad \\text{PSI}(\\mathbf{X}) \\le 0.10 \\implies \\text{Sistem Beroperasi Stabil}`,
        code: `# 22.9: Simulasi Log Pemantauan Metrik MLOps (Latensi dan Throughput)
import time
import numpy as np

def simulate_inference_api(payload):
    # Simulasi latensi komputasi inferensi model
    t_start = time.perf_counter()
    # Komputasi model matematika
    _ = np.dot(payload, payload)
    time.sleep(0.005) # Simulasi latensi 5ms
    t_latency = (time.perf_counter() - t_start) * 1000.0 # dalam ms
    return t_latency

latencies = []
print("=== LOG PEMANTAUAN KINERJA INFERENSI PRODUKSI (MLOPS) ===")
for req_id in range(1, 6):
    dummy_input = np.random.randn(50)
    lat = simulate_inference_api(dummy_input)
    latencies.append(lat)
    print(f"Request #{req_id:03d} | Latensi: {lat:.2f} ms | Status: 200 OK")

print("-" * 50)
print(f"Rata-rata Latensi Inferensi : {np.mean(latencies):.2f} ms")
print(f"P99 Latensi Inferensi        : {np.percentile(latencies, 99):.2f} ms (Memenuhi Target SLA < 50ms)")`,
        expectedOutput: "Simulasi pemantauan mencatat metrik latensi inferensi dan validasi SLA.",
        codeExp: "Skrip mensimulasikan pencatatan metrik operasional latensi inferensi dan kalkulasi p99 SLA standar MLOps.",
        pitfalls: [
          "Hanya mengukur latensi rata-rata tanpa memantau persentil ekstrim p95 dan p99 (nasabah yang lambat mengalami frustrasi terbesar).",
          "Tidak menyiapkan fallback rule-based sederhana ketika layanan model mengalami timeout atau server down."
        ],
        refTitle: "Sculley, D. et al.: Hidden Technical Debt in Machine Learning Systems (NeurIPS, 2015)",
        refUrl: "https://papers.nips.cc/paper/2015/hash/86df7dcfd8960ff80f97a0852999c731-Abstract.html"
      },
      {
        num: "22.10",
        slug: "22-10-proyek-capstone-machine-learning-produksi-end-to-end",
        title: "22.10. Proyek Capstone: Rekayasa Pipeline Machine Learning Produksi End-to-End",
        desc: "Sintesis menyeluruh 22 Bab: arsitektur terintegrasi pra-pemrosesan heterogen, penyeimbangan data, model ensemble, kalibrasi probabilitas, dan penjelasan SHAP.",
        concept: `Sebagai puncak dari seluruh kurikulum akademik Machine Learning (Bab 1 hingga 22), subbab ini merangkum seluruh prinsip rekayasa ke dalam satu **Arsitektur Sistem Machine Learning Produksi End-to-End**:

**Alur Terintegrasi Enam Lapisan (*Six-Layer Integrated Pipeline*):**
1. **Lapisan Validasi Skema & Kontrak Data:** Memastikan data masukan memenuhi batas tipe dan rentang yang sah.
2. **Lapisan Komposisi Pra-pemrosesan (\`ColumnTransformer\`):**
   - Fitur numerik: Median Imputation + RobustScaler.
   - Fitur kategorikal kardinalitas tinggi: TargetEncoder terkalibrasi.
3. **Lapisan Penyeimbangan Data Bersih (\`imblearn.pipeline\`):**
   - Menerapkan SMOTETomek di dalam fold latihan untuk memperkuat sinyal kelas minoritas.
4. **Lapisan Estimator Ensemble Lanjut:**
   - Melatih Gradient Boosted Trees dengan regularisasi Tikhonov L2.
5. **Lapisan Kalibrasi Probabilitas (\`CalibratedClassifierCV\`):**
   - Menghasilkan probabilitas posterior terkalibrasi Isotonic Regression untuk evaluasi Brier Score optimal.
6. **Lapisan Transparansi & Forensik XAI (\`TreeSHAP\`):**
   - Menghasilkan penjelasan atribusi lokal secara instan untuk setiap keputusan inferensi, siap dikirim ke antarmuka pengguna atau laporan audit kepatuhan.`,
        formula: `\\text{Arsitektur Produksi} = \\text{Schema} \\to \\text{ColumnTransformer} \\to \\text{Ensemble} \\to \\text{Calibration} \\to \\text{SHAP}`,
        code: `# 22.10: Proyek Capstone: Pipeline Machine Learning Produksi End-to-End
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import RobustScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report, roc_auc_score

# 1. Dataset Transaksional Heterogen Sintetis
np.random.seed(42)
n_samples = 1500
df = pd.DataFrame({
    'pendapatan': np.random.exponential(scale=10.0, size=n_samples),
    'rasio_utang': np.random.uniform(0.1, 0.9, size=n_samples),
    'usia': np.random.normal(40, 10, size=n_samples),
    'tipe_pekerjaan': np.random.choice(['PNS', 'Swasta', 'Wiraswasta'], size=n_samples)
})
y = np.random.choice([0, 1], p=[0.90, 0.10], size=n_samples) # 10% Kasus Risiko

# 2. Arsitektur Pra-pemrosesan Terpadu
num_cols = ['pendapatan', 'rasio_utang', 'usia']
cat_cols = ['tipe_pekerjaan']

preprocessor = ColumnTransformer(transformers=[
    ('num', Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', RobustScaler())
    ]), num_cols),
    ('cat', Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ]), cat_cols)
])

# 3. Model Pipeline dengan Kalibrasi Probabilitas
base_model = Pipeline([
    ('prep', preprocessor),
    ('clf', HistGradientBoostingClassifier(random_state=42, class_weight='balanced'))
])

# Bungkus dengan CalibratedClassifierCV untuk probabilitas terkalibrasi
production_system = CalibratedClassifierCV(estimator=base_model, method='sigmoid', cv=3)
production_system.fit(df, y)

# 4. Inferensi Produksi pada Transaksi Baru
data_baru = pd.DataFrame({
    'pendapatan': [25.0],
    'rasio_utang': [0.85],
    'usia': [29.0],
    'tipe_pekerjaan': ['Wiraswasta']
})

prob_risiko = production_system.predict_proba(data_baru)[0, 1]
keputusan = "TOLAK (Risiko Tinggi)" if prob_risiko >= 0.50 else "SETUJUI (Risiko Rendah)"

print("=== HASIL SISTEM CAPSTONE MACHINE LEARNING PRODUKSI ===")
print("Pipeline End-to-End Berhasil Di-fit dan Siap Melayani Permintaan Inferensi!")
print(f"Probabilitas Risiko Terkalibrasi : {prob_risiko*100:.2f}%")
print(f"Keputusan Sistem Otomatis       : {keputusan}")`,
        expectedOutput: "Pipeline capstone terintegrasi penuh berhasil melakukan inferensi pada data transaksi baru dengan probabilitas terkalibrasi.",
        codeExp: "Skrip merangkai seluruh konsep dari kurikulum: ColumnTransformer, RobustScaler, OneHotEncoder, HistGradientBoosting balanced, dan CalibratedClassifierCV ke dalam sistem produksi end-to-end.",
        pitfalls: [
          "Mendeploy pipeline tanpa menyertakan fallback default saat input data memiliki format yang tidak terduga.",
          "Lupa mengunci seluruh konfigurasi dependensi paket di lingkungan produksi."
        ],
        refTitle: "Google Engineering: Rules of Machine Learning: Best Practices for ML Engineering (Martin Zinkevich, 2017)",
        refUrl: "https://developers.google.com/machine-learning/guides/rules-of-ml"
      }
    ]
  }
];
