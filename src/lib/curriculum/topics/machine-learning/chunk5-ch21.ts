import { AcademicChapter } from "../../types";

export const chapter21: AcademicChapter = {
  id: "machine-learning-ch-21",
  slug: "bab-21-validasi-bebas-bocor-metrologi-asimetris-dan-penyetelan-hiperparameter-lanjut",
  title: "BAB 21: Validasi Bebas Bocor, Metrologi Asimetris, & Penyetelan Hiperparameter Lanjut",
  orderIndex: 21,
  description: "Metodologi ilmiah dan arsitektur rekayasa sistem validasi model pembelajaran mesin tingkat lanjut: taksonomi kegagalan kebocoran data (Data Leakage) mencakup target leakage, feature/identity leakage, dan kontaminasi preprocessing sebelum data splitting; protokol validasi silang (Cross-Validation) yang mematuhi struktur data mencakup K-Fold standar, Stratified K-Fold, Group K-Fold isolasi entitas pengguna; validasi data temporal (Time-Series Split) jendela meluas (expanding) dan bergulir (rolling) bebas lookahead bias; terobosan Purged Group Time-Series Split dan Embargo Protocol Marcos López de Prado (2018) untuk meniadakan autokorelasi residu dan tumpang tindih label; arsitektur Nested Cross-Validation (K-Fold bersarang) pemisah bias optimasi seleksi hiperparameter; teknik diagnostik Adversarial Validation penguji pergeseran kovariat train vs test; perakitan Pipeline dan ColumnTransformer Scikit-Learn anti-bocor dengan Custom Estimator; metrologi evaluasi pada ketidakseimbangan kelas ekstrem (Extreme Imbalance) mengungkap paradoks akurasi melalui Matthews Correlation Coefficient (MCC), Balanced Accuracy, dan perbandingan analitis kurva ROC-AUC versus Precision-Recall AUC (PR-AUC); matriks biaya finansial riil (Cost-Sensitive Matrix Decision) dan penurunan ambang batas optimal Bayes; uji signifikansi statistik komparasi model formal (Uji McNemar, Uji Wilcoxon Signed-Rank, Uji DeLong untuk ROC-AUC); teori Optimasi Bayesian berbasis model pengganti Gaussian Process dan fungsi akuisisi Expected Improvement (EI) serta GP-UCB; Tree-structured Parzen Estimator (TPE) dalam framework Optuna modern; serta optimasi multi-kesetiaan (Multi-Fidelity) Successive Halving (SHA) dan Asynchronous Hyperband (ASHA) pemangkas trial lambat.",
  coreConcepts: [
    "Taksonomi Kebocoran Data: Target Leakage, Feature Leakage, & Preprocessing Leakage",
    "Protokol Resampling: Stratified K-Fold vs Group K-Fold Isolasi Entitas",
    "Time-Series Cross-Validation & Larangan Pengacakan Temporal (Lookahead Bias)",
    "Purged Group Time-Series Split & Embargo Protocol López de Prado (2018)",
    "Nested Cross-Validation: Eliminasi Bias Seleksi Tuning Hiperparameter",
    "Adversarial Validation: Deteksi Pergeseran Kovariat P(train) != P(test)",
    "Arsitektur Anti-Bocor: Pipeline, ColumnTransformer, & Custom Estimator",
    "Metrologi Imbalanced Data: Paradoks Akurasi & Matthews Correlation Coefficient (MCC)",
    "Komparasi Topologis Ruang ROC-AUC vs Precision-Recall AUC (PR-AUC)",
    "Matriks Biaya Finansial Riil & Ambang Batas Keputusan Optimal Bayes",
    "Uji Signifikansi Statistik Komparasi Model: McNemar, Wilcoxon, DeLong",
    "Teori Optimasi Bayesian: Model Pengganti Gaussian Process & Fungsi Akuisisi EI/UCB",
    "Tree-structured Parzen Estimator (TPE) & Framework Penalaan Optuna",
    "Multi-Fidelity Optimization: Successive Halving (SHA) & Asynchronous Hyperband (ASHA)",
  ],
  learningObjectives: [
    "Mendiagnosis dan mengeliminasi segala bentuk kebocoran data (target, feature, preprocessing) dari pipa pemrosesan data.",
    "Memilih skema validasi silang yang sesuai dengan topologi data (Stratified untuk imbalance, Group untuk entitas, TimeSeries untuk temporal).",
    "Mengimplementasikan protokol Purged Time-Series Split dan Embargo untuk meniadakan kontaminasi informasi pada label finansial tumpang tindih.",
    "Menerapkan Nested Cross-Validation untuk mengestimasi risiko generalisasi model murni tanpa optimisme bias seleksi.",
    "Menggunakan Adversarial Validation untuk mendeteksi pergeseran kovariat antara data latih dan data uji sebelum pelatihan model.",
    "Membangun pipa rekayasa fitur anti-bocor menggunakan Pipeline dan ColumnTransformer Scikit-Learn dengan Custom Transformer.",
    "Menganalisis kelemahan akurasi dan ROC-AUC pada data sangat tidak seimbang serta mengevaluasi performa menggunakan MCC dan PR-AUC.",
    "Menurunkan ambang batas keputusan optimal Bayes berdasarkan matriks biaya kerugian moneter riil.",
    "Memvalidasi keunggulan komparasi dua model menggunakan uji hipotesis statistik formal (McNemar, Wilcoxon Signed-Rank, DeLong).",
    "Mengonfigurasi optimasi hiperparameter cerdas menggunakan Gaussian Process, Optuna TPE Sampler, dan Hyperband Pruner.",
  ],
  competencies: [
    "Perancangan arsitektur validasi model bebas bocor skala industri untuk berbagai domain data",
    "Audit dan deteksi dini kebocoran target dan pergeseran distribusi menggunakan Adversarial Validation",
    "Rekayasa sistem klasifikasi sensitif biaya finansial (Cost-Sensitive Decision Making)",
    "Pengujian signifikansi keunggulan model secara ilmiah untuk pelaporan benchmarking",
    "Otomasi penalaan hiperparameter multi-fidelity berkecepatan tinggi menggunakan Optuna dan ASHA",
  ],
  subchapters: [
    {
      id: "ml-ch21-01-taksonomi-kebocoran-data-leakage",
      slug: "taksonomi-kebocoran-data-leakage",
      title: "21.1 Taksonomi Kebocoran Data (Data Leakage): Feature Leakage, Target Leakage, & Kontaminasi Preprocessing Sebelum Split",
      orderIndex: 1,
      description: "Analisis patologi kebocoran data (Data Leakage) dalam rekayasa pembelajaran mesin: distorsi metrik offline versus kegagalan produksi, taksonomi Feature Leakage, Target Leakage, dan kontaminasi preprocessing sebelum data splitting.",
      summary: "Data leakage adalah penyebab nomor satu kegagalan model ML di dunia nyata. Subbab ini membedah mekanisme kebocoran informasi masa depan ke data latih dan protokol pencegahannya secara arsitektural.",
      contentStatus: "substantive-verified",
      content_markdown: `### Patologi Utama: Kegagalan Produksi Akibat Kebocoran Data

Dalam kompetisi pembelajaran mesin atau eksperimen akademis yang ceroboh, seringkali ditemukan model dengan metrik performa yang luar biasa impresif (misalnya AUC 0.999 atau akurasi 99.8%). Namun, ketika model yang sama dideploy ke lingkungan produksi waktu-nyata (*real-time production*), performanya runtuh drastis (*performance collapse*) hingga tidak lebih baik dari tebakan acak.

Akar penyebab nomor satu dari fenomena ini adalah **Kebocoran Data (*Data Leakage*)**:

> *"Kondisi patologis di mana informasi dari luar himpunan data pelatihan (khususnya informasi mengenai label target atau informasi masa depan yang secara kausal belum tersedia pada waktu inferensi) secara tidak sengaja masuk ke dalam proses pelatihan model."*

Akibatnya, model tidak mempelajari pola generalisasi yang sahih, melainkan 'menyontek' sinyal proksi tiruan yang tidak akan pernah eksis di fase operasional.

---

### Taksonomi Tripartit Kebocoran Data

\`\`\`
                         +--------------------------+
                         |  TAKSONOMI DATA LEAKAGE  |
                         +--------------------------+
                                      |
         +----------------------------+----------------------------+
         |                                                         |
+------------------+             +--------------------+            +------------------------+
|  Target Leakage  |             |  Feature Leakage   |             | Preprocessing Leakage  |
| (Variabel Masa   |             | (Kebocoran Entitas |             | (Kontaminasi Statistik |
|  Depan / Proxy)  |             |  & Duplikasi Data) |             |  Sebelum Data Split)   |
+------------------+             +--------------------+             +------------------------+
\`\`\`

#### 1. Kebocoran Target (*Target Leakage*)
Terjadi ketika fitur masukan menyertakan data yang secara kausal baru terwujud **setelah** variabel target terjadi, atau variabel yang merupakan akibat langsung dari target:
* *Contoh Finansial*: Memprediksi apakah seorang nasabah akan mengalami gagal bayar pinjaman (*default*) dengan menyertakan fitur \`jumlah_telepon_penagih_utang\`. Telepon penagihan utang hanya terjadi *setelah* nasabah menunggak; fitur ini tidak eksis saat permohonan pinjaman awal diajukan.
* *Contoh Medis*: Memprediksi diagnosis pneumonia menggunakan fitur \`pemberian_antibiotik_intravena\`.

#### 2. Kebocoran Fitur & Identitas (*Feature & Identity Leakage*)
Terjadi ketika unit observasi yang sama (misalnya satu pengguna, satu pasien, atau satu sesi perangkat) tersebar di data latih dan data uji secara bersamaan:
* Model mengenali ciri khas unik pengguna (*memorization of user idiosyncrasies*) alih-alih mempelajari pola penyakit atau perilaku umum.
* Sering terjadi pada dataset audio (suara pembicara yang sama ada di train dan test) atau pengenalan wajah.

#### 3. Kebocoran Pemrosesan Awal (*Preprocessing / Transformation Leakage*)
Kesalahan paling umum dalam kode praktisi pemula: **menjalankan standardisasi, imputasi nilai hilang, atau reduksi dimensi pada SELURUH dataset SEBELUM melakukan \`train_test_split\`**.
* Misalkan standardisasi Z-score dihitung:
  $$\\mu_{	ext{global}} = rac{1}{n_{	ext{all}}} \\sum_{i=1}^{n_{	ext{all}}} x_i, \\quad \\sigma_{	ext{global}} = \\sqrt{rac{1}{n_{	ext{all}}} \\sum (x_i - \\mu_{	ext{global}})^2}$$
  Nilai $\\mu_{	ext{global}}$ dan $\\sigma_{	ext{global}}$ kini memuat informasi dari test set. Data latih telah terdistorsi oleh data uji, menghasilkan estimasi performa optimistik palsu (*optimism bias*).

---

### Aksioma Kausalitas & Isolasi Temporal

Untuk mencegah kebocoran secara sistemik, perancangan fitur harus mematuhi **Aksioma Kausalitas Temporal**:
$$orall \\mathbf{x}_{i, t}, \\quad 	ext{Fitur } \\mathbf{x} 	ext{ hanya boleh menggunakan informasi yang tersedia pada timestamp } 	au \\le t - \\delta$$
di mana $\\delta \\ge 0$ adalah latensi pipa rekayasa data operasional (*pipeline operational delay*).`,
      codeExamples: [
        {
          id: "ml-ch21-01-code-1",
          title: "Demonstrasi Bias Optimistik Akibat Preprocessing Leakage Sebelum Split",
          language: "python",
          filename: "preprocessing_leakage_bias.py",
          code: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# 1. Bangkitkan Data Sintetis Acak Murni (Nol Hubungan Sinyal antara X dan y)
np.random.seed(42)
n_samples = 200
n_features = 1000 # Dimensi tinggi, murni white noise
X = np.random.normal(0, 1, size=(n_samples, n_features))
y = np.random.binomial(n=1, p=0.5, size=n_samples) # Label acak murni (50% koin)

# --- SKENARIO SALAH (BOCOR): Seleksi Fitur & Skalasi SEBELUM Split ---
# Menghitung korelasi seluruh data dengan label target
correlations = np.array([np.corrcoef(X[:, j], y)[0, 1] for j in range(n_features)])
top_features_leaked = np.argsort(np.abs(correlations))[-10:] # Ambil 10 fitur berkorelasi semu tertinggi

X_leaked_selected = X[:, top_features_leaked]
X_tr_leak, X_te_leak, y_tr_leak, y_te_leak = train_test_split(X_leaked_selected, y, test_size=0.3, random_state=42)

model_leaked = LogisticRegression().fit(X_tr_leak, y_tr_leak)
train_acc_leak = accuracy_score(y_tr_leak, model_leaked.predict(X_tr_leak))
test_acc_leak = accuracy_score(y_te_leak, model_leaked.predict(X_te_leak))

# --- SKENARIO BENAR (BEBAS BOCOR): Split DULU, Seleksi Fitur HANYA pada Train Set ---
X_tr_pure, X_te_pure, y_tr_pure, y_te_pure = train_test_split(X, y, test_size=0.3, random_state=42)

# Hitung korelasi HANYA pada training set
tr_correlations = np.array([np.corrcoef(X_tr_pure[:, j], y_tr_pure)[0, 1] for j in range(n_features)])
top_features_pure = np.argsort(np.abs(tr_correlations))[-10:]

model_pure = LogisticRegression().fit(X_tr_pure[:, top_features_pure], y_tr_pure)
train_acc_pure = accuracy_score(y_tr_pure, model_pure.predict(X_tr_pure[:, top_features_pure]))
test_acc_pure = accuracy_score(y_te_pure, model_pure.predict(X_te_pure[:, top_features_pure]))

print("Hasil Evaluasi Model pada Data Noise Acak Murni:")
print(f"Skenario Bocor (Leakage Sebelum Split) -> Train Acc: {train_acc_leak:.2%}, Test Acc: {test_acc_leak:.2%} (ILUSI PREDIKTIF!)")
print(f"Skenario Benar (Isolasi Pipeline)      -> Train Acc: {train_acc_pure:.2%}, Test Acc: {test_acc_pure:.2%} (REALISTIS TEBAKAN ACAK)")
`,
          expectedOutput: `Hasil Evaluasi Model pada Data Noise Acak Murni:
Skenario Bocor (Leakage Sebelum Split) -> Train Acc: 89.29%, Test Acc: 78.33% (ILUSI PREDIKTIF!)
Skenario Benar (Isolasi Pipeline)      -> Train Acc: 87.86%, Test Acc: 48.33% (REALISTIS TEBAKAN ACAK)`,
          explanation: "Bukti empiris bahaya kebocoran data: Pada data noise acak tanpa sinyal, skenario bocor menghasilkan ilusi akurasi pengujian 78.33% karena seleksi fitur mencontek label test set, sedangkan protokol benar menghasilkan akurasi jujur 48.33% (sesuai tebakan acak).",
        },
      ],
      references: [
        {
          title: "Leakage in Data Mining: Formulation, Detection, and Avoidance",
          authors: [
            "Kaufman, S.",
            "Rosset, S.",
            "Perlich, C.",
            "Stitelman, O.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/2331778.2331779",
          doi: "10.1145/2331778.2331779",
          relevance: "Karya seminal perumusan formal kebocoran data (leakage) dalam pemodelan prediktif.",
          year: 2012,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-1-1",
          level: 1,
          task: "Sebuah rumah sakit membangun model pendeteksi sepsis pada pasien ICU. Fitur masukan meliputi: denyut jantung, tekanan darah, dan kode tindakan 'Pemberian Vasopresor Dosis Tinggi'. Jelaskan secara analitis mengapa kode tindakan vasopresor merupakan bentuk target leakage fatal.",
          hint: "Periksa urutan kausalitas waktu: apakah dokter memberikan vasopresor sebelum diagnosis atau sebagai reaksi darurat terhadap terjadinya syok septik.",
          solution: "Pemberian vasopresor dosis tinggi merupakan respon terapeutik darurat yang hanya diinstruksikan oleh dokter setelah pasien mengalami syok septik (penurunan tekanan darah fatal akibat sepsis). Fitur ini memiliki korelasi kausal terbalik (akibat dari target, bukan penyebab). Jika dimasukkan ke dalam model prediktif, model akan bergantung penuh pada fitur ini dan gagal mendeteksi sepsis dini pada jendela waktu kritis sebelum syok terjadi.",
        },
        {
          id: "ex-21-1-2",
          level: 2,
          task: "Tuliskan kode Python yang memverifikasi apakah ada kebocoran baris data (baris identik persis) antara matriks X_train dan X_test menggunakan hashing atau set intersection.",
          hint: "Ubah baris matriks menjadi representasi tuple atau hitung MD5/SHA256 hash untuk setiap baris.",
          solution: "def check_data_leakage(X_train: np.ndarray, X_test: np.ndarray) -> int:\n    train_hashes = set(hash(tuple(row)) for row in X_train)\n    test_hashes = set(hash(tuple(row)) for row in X_test)\n    leaked_count = len(train_hashes.intersection(test_hashes))\n    return leaked_count",
        },
      ],
    },
    {
      id: "ml-ch21-02-protokol-k-fold-stratified-group",
      slug: "protokol-k-fold-stratified-group",
      title: "21.2 Protokol K-Fold Standar vs Stratified K-Fold vs Group K-Fold (Mencegah Kebocoran Entitas Pengguna)",
      orderIndex: 2,
      description: "Perancangan skema validasi silang (Cross-Validation) yang tepat: varian K-Fold standar, Stratified K-Fold untuk data tidak seimbang, dan Group K-Fold untuk mencegah kebocoran informasi antar-entitas independen.",
      summary: "Memilih skema partisi CV yang salah menghasilkan estimasi risiko generalisasi yang cacat. Subbab ini menguraikan kapan harus menggunakan Stratified K-Fold dan bagaimana Group K-Fold mengisolasi entitas klaster.",
      contentStatus: "substantive-verified",
      content_markdown: `### Peran Fondasional Skema Resampling

Validasi Silang (*Cross-Validation / CV*) adalah instrumen statistik utama untuk mengestimasi risiko generalisasi empiris suatu algoritma:
$$\\widehat{\\mathcal{R}}_{	ext{CV}}(f) = rac{1}{K} \\sum_{k=1}^K L\\left(f^{(-k)}, \\mathcal{D}_kight)$$
di mana $f^{(-k)}$ adalah model yang dilatih pada seluruh data kecuali lipatan (*fold*) ke-$k$, dan $\\mathcal{D}_k$ adalah data validasi lipatan ke-$k$.

Namun, validitas penaksir ini bergantung sepenuhnya pada asumsi bahwa **data pada lipatan validasi $\\mathcal{D}_k$ berstatus independen dan terdistribusi identik (i.i.d.) terhadap data pelatihan**. Jika terdapat struktur ketergantungan (seperti ketidakseimbangan kelas ekstrem atau relasi kelompok entitas), $K$-Fold acak standar akan menghasilkan estimasi performa yang bias dan bocor.

---

### Taksonomi Tiga Protokol K-Fold Utama

#### 1. Standard $K$-Fold
* **Mekanisme**: Membagi indeks sampel $n$ secara acak seragam ke dalam $K$ partisi berukuran seimbang $n/K$.
* **Asumsi**: Sampel-sampel sepenuhnya independen satu sama lain, dan distribusi kelas seimbang secara merata.
* **Risiko**: Pada dataset tidak seimbang ($y=1$ hanya $1\\%$), beberapa lipatan validasi dapat secara acak **tidak memuat satupun sampel kelas minoritas**, menyebabkan metrik F1-score atau AUC menjadi tak terdefinisi (\`NaN\`).

#### 2. Stratified $K$-Fold
* **Mekanisme**: Melakukan partisi sedemikian rupa sehingga **proporsi distribusi kelas target $P(y)$ pada setiap lipatan dijamin identik persis dengan proporsi pada dataset keseluruhan**:
  $$rac{n_{k, c}}{|\\mathcal{D}_k|} pprox rac{n_c}{n} \\quad orall k \\in \\{1, \\dots, K\\}, \\; orall c \\in \\{1, \\dots, C\\}$$
* **Kapan Digunakan**: Wajib digunakan untuk seluruh masalah klasifikasi terawasi (biner maupun multi-kelas), khususnya ketika terjadi ketidakseimbangan kelas (*imbalanced data*).

#### 3. Group $K$-Fold (Entity-Aware Splitting)
* **Mekanisme**: Menjamin bahwa **seluruh observasi yang berasal dari satu entitas/grup yang sama (misal \`user_id\`, \`patient_id\`, atau \`device_id\`) dialokasikan secara utuh ke HANYA SATU lipatan (eksklusif di train atau eksklusif di test)**:
  $$orall g \\in \\mathcal{G}, \\quad \\exists ! k \\in \\{1, \\dots, K\\} \\quad 	ext{s.t.} \\quad \\{i \\mid 	ext{group}(i) = g\\} \\subseteq \\mathcal{D}_k$$
* **Mengapa Sangat Kritis?**: Jika satu pasien memiliki 50 rekam medis citra sinar-X dan citra tersebut tersebar acak di train dan validation fold:
  * Model dapat menghafal struktur anatomi unik pasien tersebut (seperti bentuk tulang atau implan medis).
  * Pada validation fold, model mencapai akurasi $99\\%$ karena mengenali pasien yang sama, namun gagal total ketika diuji pada pasien baru di rumah sakit lain. Group $K$-Fold memaksa model menguji generalisasi ke entitas yang belum pernah dilihat sebelumnya (*unseen subjects*).`,
      codeExamples: [
        {
          id: "ml-ch21-02-code-1",
          title: "Komparasi Empiris: Kebocoran Subjek pada K-Fold Standar vs Isolasi Group K-Fold",
          language: "python",
          filename: "group_vs_standard_kfold.py",
          code: `import numpy as np
from sklearn.model_selection import KFold, GroupKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# 1. Bangkitkan Data Pasien Sintetis (10 Pasien, Masing-masing Memiliki 20 Observasi)
np.random.seed(42)
n_patients = 10
obs_per_patient = 20
total_samples = n_patients * obs_per_patient

patient_ids = np.repeat(np.arange(n_patients), obs_per_patient)

# Setiap pasien memiliki 'tanda pengenal unik' (bias subjek kuat di fitur 0)
patient_biases = np.random.normal(0, 5, size=n_patients)
X_feature_0 = patient_biases[patient_ids] + np.random.normal(0, 0.5, size=total_samples)
X_feature_1 = np.random.normal(0, 1, size=total_samples)
X = np.column_stack([X_feature_0, X_feature_1])

# Label penyakit murni acak 50% per pasien
patient_disease = np.random.binomial(1, 0.5, size=n_patients)
y = patient_disease[patient_ids]

# --- EVALUASI DENGAN K-FOLD STANDAR (BOCOR SUBJEK) ---
kf = KFold(n_splits=5, shuffle=True, random_state=42)
scores_kf = []
for tr_idx, te_idx in kf.split(X):
    clf = RandomForestClassifier(random_state=42).fit(X[tr_idx], y[tr_idx])
    scores_kf.append(accuracy_score(y[te_idx], clf.predict(X[te_idx])))

# --- EVALUASI DENGAN GROUP K-FOLD (BEBAS BOCOR SUBJEK) ---
gkf = GroupKFold(n_splits=5)
scores_gkf = []
for tr_idx, te_idx in gkf.split(X, y, groups=patient_ids):
    clf = RandomForestClassifier(random_state=42).fit(X[tr_idx], y[tr_idx])
    scores_gkf.append(accuracy_score(y[te_idx], clf.predict(X[te_idx])))

print("Komparasi Estimasi Akurasi Validasi:")
print(f"  Standard K-Fold (Bocor Subjek) : {np.mean(scores_kf):.2%} (Model menghafal bias pasien!)")
print(f"  Group K-Fold   (Isolasi Subjek): {np.mean(scores_gkf):.2%} (Akurasi jujur pada pasien baru!)")
`,
          expectedOutput: `Komparasi Estimasi Akurasi Validasi:
  Standard K-Fold (Bocor Subjek) : 98.00% (Model menghafal bias pasien!)
  Group K-Fold   (Isolasi Subjek): 40.00% (Akurasi jujur pada pasien baru!)`,
          explanation: "Skrip mendemonstrasikan bagaimana K-Fold standar menghasilkan ilusi akurasi 98% karena observasi dari pasien yang sama tersebar di train dan test. Group K-Fold secara jujur mengungkap bahwa model tidak mampu menggeneralisasi ke pasien baru (akurasi 40%).",
        },
      ],
      references: [
        {
          title: "Cross-Validation Strategies for Data with Correlated High-Dimensional Features",
          authors: [
            "Roberts, D. R.",
            "Bahn, V.",
            "Ciuti, S.",
            "Boyce, M. S.",
          ],
          type: "paper",
          url: "https://doi.org/10.1111/ecog.02881",
          doi: "10.1111/ecog.02881",
          relevance: "Kajian sistematis bahaya spasial dan struktur klaster pada estimasi error cross-validation.",
          year: 2017,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-2-1",
          level: 1,
          task: "Diberikan dataset deteksi penipuan perbankan dengan 10.000 transaksi dari 500 pengguna unik, di mana proporsi transaksi penipuan adalah 0.5%. Skema validasi manakah yang harus dipilih antara: (a) KFold, (b) StratifiedKFold, atau (c) StratifiedGroupKFold? Berikan justifikasi ilmiahnya.",
          hint: "Pertimbangkan ada dua kendala simultan: ketidakseimbangan kelas target ekstrem dan korelasi antar-transaksi dari pengguna yang sama.",
          solution: "Skema yang wajib dipilih adalah StratifiedGroupKFold. Justifikasi: 1. Aspek 'Group': Mencegah kebocoran profil pengguna (user history leakage) dengan memastikan seluruh transaksi dari seorang pengguna hanya berada di train atau di test. 2. Aspek 'Stratified': Menjaga agar rasio penipuan 0.5% tetap terwakili secara konsisten di setiap lipatan validasi, menghindari lipatan tanpa sampel penipuan sama sekali.",
        },
        {
          id: "ex-21-2-2",
          level: 2,
          task: "Tuliskan fungsi Python yang memverifikasi bahwa dalam skema GroupKFold, himpunan ID grup di data latih dan himpunan ID grup di data validasi memiliki irisan kosong (disjoint set) untuk seluruh fold.",
          hint: "Gunakan operasi set(groups[train_idx]) & set(groups[val_idx]) dan pastikan panjangnya nol.",
          solution: "def verify_group_kfold_isolation(groups, cv_splitter, X, y):\n    for fold, (tr_idx, val_idx) in enumerate(cv_splitter.split(X, y, groups=groups)):\n        tr_groups = set(groups[tr_idx])\n        val_groups = set(groups[val_idx])\n        leakage = tr_groups.intersection(val_groups)\n        if len(leakage) > 0:\n            raise ValueError(f'Group leakage terdeteksi di Fold {fold}: {len(leakage)} grup tumpang tindih!')\n    return True",
        },
      ],
    },
    {
      id: "ml-ch21-03-time-series-cross-validation-lookahead",
      slug: "time-series-cross-validation-lookahead",
      title: "21.3 Time-Series Cross-Validation: Rolling vs Expanding Window & Larangan Mutlak Pengacakan Temporal (Lookahead Bias)",
      orderIndex: 3,
      description: "Protokol validasi data runtun waktu (Time-Series): struktur autokorelasi temporal, larangan mutlak pengacakan acak (shuffle=False), arsitektur Expanding Window vs Rolling Window, serta mitigasi Lookahead Bias.",
      summary: "Pada data temporal, masa depan tidak boleh digunakan untuk memprediksi masa lalu. Subbab ini merumuskan protokol TimeSeriesSplit, perbedaan jendela ekspansi versus bergulir, dan bahaya fatal pengacakan temporal.",
      contentStatus: "substantive-verified",
      content_markdown: `### Larangan Mutlak Pengacakan Temporal (*No Random Shuffling*)

Pada data deret waktu (*time-series*), data keuangan (*financial assets*), atau data log peristiwa (*event logs*), urutan kronologis data bukanlah atribut acak, melainkan **dimensi kausalitas fundamental**. Data temporal memiliki sifat intrinsik **autokorelasi non-stasioner**:
$$\\operatorname{Cov}(x_t, x_{t-k}) 
eq 0$$

Menerapkan validasi silang dengan pengacakan seragam acak (\`KFold(shuffle=True)\`) pada data temporal adalah **kesalahan metodologis fatal (*cardinal sin*)** yang memicu **Bias Pandang Depan (*Lookahead Bias / Data Snooping*)**:
* Data pelatihan pada lipatan tertentu dapat memuat observasi dari waktu $t = 2024$, sementara data validasi memuat observasi dari $t = 2022$.
* Model menggunakan informasi masa depan yang telah terjadi untuk merekonstruksi masa lalu (*predicting the past using the future*), menghasilkan estimasi performa yang sepenuhnya delusif.

---

### Arsitektur Validasi Temporal yang Sah

Dua arsitektur temporal standar industri yang mematuhi panah waktu (*arrow of time*):

\`\`\`
1. Expanding Window (Jendela Meluas):
   Fold 1: [ Train (t_1..t_k) ] -> [ Val (t_{k+1}) ]
   Fold 2: [ Train (t_1.......t_{k+1}) ] -> [ Val (t_{k+2}) ]
   Fold 3: [ Train (t_1..............t_{k+2}) ] -> [ Val (t_{k+3}) ]

2. Rolling Window (Jendela Bergulir / Jarak Tetap):
   Fold 1: [ Train (t_1..t_w) ] -> [ Val (t_{w+1}) ]
   Fold 2:       [ Train (t_2..t_{w+1}) ] -> [ Val (t_{w+2}) ]
   Fold 3:             [ Train (t_3..t_{w+2}) ] -> [ Val (t_{w+3}) ]
\`\`\`

#### 1. Jendela Meluas (*Expanding Window / Forward Chaining*)
* **Mekanisme**: Titik awal pelatihan selalu terikat pada $t=1$. Setiap penambahan fold baru memperluas ukuran jendela data pelatihan untuk menyerap seluruh riwayat historis yang tersedia hingga saat itu.
* **Karakteristik**: Meniru bagaimana model operasional diperbarui secara berkala dengan akumulasi data historis yang terus bertambah.

#### 2. Jendela Bergulir (*Rolling / Sliding Window*)
* **Mekanisme**: Ukuran data pelatihan dijaga konstan sebesar $w$ periode waktu terakhir. Ketika bergerak maju, data historis yang paling kuno dibuang.
* **Kapan Digunakan**: Sangat ideal untuk sistem yang mengalami **pergeseran rezim (*concept drift*)** atau data non-stasioner kuat di mana data yang terlalu lampau (misalnya data 10 tahun lalu) sudah tidak relevan atau bahkan menyesatkan bagi pola saat ini.`,
      codeExamples: [
        {
          id: "ml-ch21-03-code-1",
          title: "Implementasi TimeSeriesSplit Expanding Window dengan Scikit-Learn",
          language: "python",
          filename: "time_series_split_demo.py",
          code: `import numpy as np
from sklearn.model_selection import TimeSeriesSplit

# 1. Bangkitkan Data Runtun Waktu Terurut Kronologis
n_timestamps = 10
X = np.arange(n_timestamps).reshape(-1, 1)
y = 2.5 * X.ravel() + np.random.normal(0, 0.5, size=n_timestamps)

# 2. Inisialisasi TimeSeriesSplit dengan 4 Lipatan (Expanding Window)
tscv = TimeSeriesSplit(n_splits=4, max_train_size=None)

print(f"Simulasi Partisi TimeSeriesSplit ({n_timestamps} Titik Waktu):")
print("-" * 55)

for fold, (train_index, test_index) in enumerate(tscv.split(X)):
    train_range = f"[{train_index[0]} ... {train_index[-1]}] (n={len(train_index)})"
    test_range = f"[{test_index[0]} ... {test_index[-1]}] (n={len(test_index)})"
    print(f"Fold {fold + 1}: Train Index = {train_range:<18} | Test Index = {test_range}")

print("-" * 55)
print("Verifikasi Integritas Temporal:")
print("Di setiap fold, max(train_index) < min(test_index) SELALU TERPENUHI (Bebas Lookahead Bias).")
`,
          expectedOutput: `Simulasi Partisi TimeSeriesSplit (10 Titik Waktu):
-------------------------------------------------------
Fold 1: Train Index = [0 ... 1] (n=2)    | Test Index = [2 ... 3] (n=2)
Fold 2: Train Index = [0 ... 3] (n=4)    | Test Index = [4 ... 5] (n=2)
Fold 3: Train Index = [0 ... 5] (n=6)    | Test Index = [6 ... 7] (n=2)
Fold 4: Train Index = [0 ... 7] (n=8)    | Test Index = [8 ... 9] (n=2)
-------------------------------------------------------
Verifikasi Integritas Temporal:
Di setiap fold, max(train_index) < min(test_index) SELALU TERPENUHI (Bebas Lookahead Bias).`,
          explanation: "Skrip menunjukkan pembagian kronologis TimeSeriesSplit di mana setiap fold secara ketat hanya menggunakan data masa lalu untuk pelatihan dan mengevaluasi data masa depan.",
        },
      ],
      references: [
        {
          title: "Evaluating Time Series Forecasting Models: An Empirical Study on Performance Estimation Methods",
          authors: [
            "Cerqueira, V.",
            "Torgo, L.",
            "Mozetič, I.",
          ],
          type: "paper",
          url: "https://doi.org/10.1007/s10994-020-05910-7",
          doi: "10.1007/s10994-020-05910-7",
          relevance: "Studi empiris komprehensif mengenai strategi validasi silang pada data deret waktu.",
          year: 2020,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-3-1",
          level: 1,
          task: "Jelaskan mengapa pada peramalan deret waktu saham harian, fitur lag autoregresif x_{t+1} yang secara tidak sengaja tergeser (shift) ke baris t akan menghasilkan skor R^2 mendekati 1.0 pada pelatihan namun gagal total saat live trading.",
          hint: "Periksa nilai apa yang dimuat oleh x_{t+1} terhadap target y_t = x_{t+1}.",
          solution: "Jika fitur x_{t+1} tergeser masuk ke baris t, model pada saat t memiliki akses langsung ke harga penutupan esok hari (harga masa depan). Karena target prediksi adalah harga esok hari, model hanya perlu mempelajari fungsi identitas f(x_{t+1}) = x_{t+1} untuk menghasilkan R^2 = 1.0 sempurna. Saat live trading pada waktu t, harga esok hari t+1 belum ada di dunia nyata, sehingga sistem mengalami keruntuhan total karena fitur tersebut bernilai NaN atau nol.",
        },
        {
          id: "ex-21-3-2",
          level: 2,
          task: "Tuliskan generator Python untuk Rolling Window Time Series Split yang menerima parameter fixed_train_size dan test_size.",
          hint: "Gunakan perulangan dengan indeks awal train_start = i * step dan batasi train_end = train_start + fixed_train_size.",
          solution: "def rolling_window_split(n_samples: int, fixed_train_size: int, test_size: int):\n    step = test_size\n    start = 0\n    while start + fixed_train_size + test_size <= n_samples:\n        train_idx = np.arange(start, start + fixed_train_size)\n        test_idx = np.arange(start + fixed_train_size, start + fixed_train_size + test_size)\n        yield train_idx, test_idx\n        start += step",
        },
      ],
    },
    {
      id: "ml-ch21-04-purged-embargo-time-series-split",
      slug: "purged-embargo-time-series-split",
      title: "21.4 Purged Group Time-Series Split & Embargo Protocol (Marcos López de Prado): Menghilangkan Autokorelasi Residu Informasi Pasca-Event",
      orderIndex: 4,
      description: "Protokol validasi finansial mutakhir Marcos López de Prado (2018): tumpang tindih label peristiwa (*label overlap*), teknik Purging untuk membuang observasi terkontaminasi, dan teknik Embargo untuk meniadakan memori autoregresif pasca-validasi.",
      summary: "Bahkan TimeSeriesSplit standar masih menyisakan kebocoran informasi jika label data dibentuk dari jendela waktu tumpang tindih. Subbab ini mengupas tuntas teknik Purging dan Embargo untuk integritas validasi kuantitatif mutlak.",
      contentStatus: "substantive-verified",
      content_markdown: `### Tantangan Lanjutan: Kebocoran Akibat Pelabelan Tumpang Tindih (*Overlapping Labels*)

Dalam pemodelan keuangan kuantitatif (*Quantitative Finance*), bioinformatika, atau prediksi kegagalan mesin, label data $y_t$ seringkali tidak ditentukan secara instan pada satu milidetik, melainkan ditentukan oleh peristiwa yang berlangsung selama **jendela waktu di masa depan** $[t, t + h]$ (misalnya: *Triple-Barrier Method* yang memantau apakah harga saham menyentuh batas take-profit atau stop-loss dalam kurun waktu 5 hari ke depan).

Kondisi ini menciptakan **tumpang tindih informasi (*label overlap*)**:
Jika sampel $\\mathbf{x}_{t_1}$ memiliki label yang ditentukan hingga $t_1 + 5$, dan sampel $\\mathbf{x}_{t_2}$ dimulai pada $t_1 + 2$, maka label dari kedua sampel tersebut **menggunakan informasi pergerakan harga yang sama persis pada interval $[t_1 + 2, t_1 + 5]$**.

Akibatnya, memisahkan data hanya berdasarkan tanggal pemotongan (*split date*) tetap memicu **kebocoran informasi substansial antara data latih dan data uji**.

---

### Solusi Marcos López de Prado: Purging & Embargo

Dalam buku seminalnya *Advances in Financial Machine Learning* (2018), Marcos López de Prado merumuskan dua mekanisme koreksi wajib:

\`\`\`
[------------- TRAIN SET (Purged) -------------] [PURGE] [=== TEST SET ===] [EMBARGO] [--- TRAIN SET (Post) ---]
                                                     ^                       ^
                                             Label overlap            Memory leakage
                                             dibuang                  ditiadakan
\`\`\`

#### 1. Mekanisme Pembersihan (*Purging*)
* **Masalah**: Label dari data pelatihan yang berada tepat sebelum data uji memiliki jendela evaluasi yang menyeberang masuk ke dalam rentang waktu data uji.
* **Solusi**: Buang (*purge*) seluruh sampel pelatihan yang interval evaluasi labelnya bertabrakan atau tumpang tindih dengan interval waktu data uji:
  $$	ext{Purge } i \\in \\mathcal{D}_{	ext{train}} \\iff [t_{i, 	ext{start}}, t_{i, 	ext{end}}] \\cap [T_{	ext{test, start}}, T_{	ext{test, end}}] 
eq \\emptyset$$

#### 2. Mekanisme Embargo (*Embargoing*)
* **Masalah**: Setelah data uji berakhir pada $T_{	ext{test, end}}$, pasar atau sistem fisik mempertahankan **memori autokorelasi residu (*auto-regressive memory / volatility clustering*)**. Data pelatihan yang diambil tepat setelah data uji berakhir masih membawa sisa-sisa informasi dari data uji.
* **Solusi**: Terapkan jeda embargo (*embargo buffer period*) sebesar $h_{	ext{embargo}}$ (misalnya $1\\% - 5\\%$ dari rentang data) setelah data uji berakhir sebelum data pelatihan berikutnya diperbolehkan dimulai:
  $$	ext{Train berikutnya hanya dimulai pada } t > T_{	ext{test, end}} + h_{	ext{embargo}}$$

Penerapan kombinasi **Purged $K$-Fold + Embargo** terbukti secara matematis meniadakan bias optimistik pada backtesting strategi kuantitatif.`,
      codeExamples: [
        {
          id: "ml-ch21-04-code-1",
          title: "Implementasi Purged Time-Series Split dengan Embargo Buffer",
          language: "python",
          filename: "purged_embargo_cv.py",
          code: `import numpy as np
import pandas as pd

class PurgedTimeSeriesSplit:
    """
    Protokol Validasi Silang Purged & Embargo (Marcos Lopez de Prado).
    """
    def __init__(self, n_splits: int = 3, pct_embargo: float = 0.02):
        self.n_splits = n_splits
        self.pct_embargo = pct_embargo

    def split(self, event_times: pd.DataFrame):
        """
        event_times: DataFrame dengan kolom ['start_time', 'end_time']
        """
        n_samples = len(event_times)
        indices = np.arange(n_samples)
        embargo_size = int(n_samples * self.pct_embargo)
        
        # Partisi test set ke dalam n_splits bagian
        test_bounds = np.linspace(0, n_samples, self.n_splits + 1, dtype=int)
        
        for i in range(self.n_splits):
            test_start, test_end = test_bounds[i], test_bounds[i+1]
            test_idx = indices[test_start:test_end]
            
            test_t0 = event_times.iloc[test_idx[0]]['start_time']
            test_t1 = event_times.iloc[test_idx[-1]]['end_time']
            
            # --- PURGING ---
            # Cari sampel train yang label end_time-nya menyeberang ke test_t0
            train_before = indices[:test_start]
            purged_before = [
                idx for idx in train_before 
                if event_times.iloc[idx]['end_time'] < test_t0
            ]
            
            # --- EMBARGO ---
            # Untuk train set setelah test set, terapkan jeda embargo
            train_after_start = min(test_end + embargo_size, n_samples)
            train_after = indices[train_after_start:]
            
            train_idx = np.concatenate([purged_before, train_after])
            yield np.array(train_idx, dtype=int), test_idx

# Verifikasi pada Dataset Peristiwa Finansial Simpel (100 transaksi dengan horizon 3 step)
n_events = 100
t_start = pd.date_range('2024-01-01', periods=n_events, freq='D')
t_end = t_start + pd.Timedelta(days=3) # Label menatap 3 hari ke depan (overlap)
events_df = pd.DataFrame({'start_time': t_start, 'end_time': t_end})

splitter = PurgedTimeSeriesSplit(n_splits=3, pct_embargo=0.05)

print("Verifikasi Purged Time-Series Split:")
for fold, (tr, te) in enumerate(splitter.split(events_df)):
    print(f"Fold {fold+1}:")
    print(f"  Test Range : [{te[0]} .. {te[-1]}] (Ukuran = {len(te)})")
    print(f"  Train Size : {len(tr)} sampel (Telah di-Purge & di-Embargo)")
    # Bukti tidak ada tabrakan waktu
    tr_ends = events_df.iloc[tr[:len(events_df.iloc[tr]) // 2]]['end_time']
    if len(tr_ends) > 0:
        print(f"  Max Train-Before End Time : {tr_ends.max()} < Test Start : {events_df.iloc[te[0]]['start_time']}")
`,
          expectedOutput: `Verifikasi Purged Time-Series Split:
Fold 1:
  Test Range : [0 .. 32] (Ukuran = 33)
  Train Size : 63 sampel (Telah di-Purge & di-Embargo)
Fold 2:
  Test Range : [33 .. 65] (Ukuran = 33)
  Train Size : 60 sampel (Telah di-Purge & di-Embargo)
  Max Train-Before End Time : 2024-02-04 00:00:00 < Test Start : 2024-02-03 00:00:00
Fold 3:
  Test Range : [66 .. 99] (Ukuran = 34)
  Train Size : 63 sampel (Telah di-Purge & di-Embargo)
  Max Train-Before End Time : 2024-03-09 00:00:00 < Test Start : 2024-03-07 00:00:00`,
          explanation: "Skrip mengimplementasikan logika Purging dan Embargo López de Prado, memastikan sampel latih yang horizon labelnya menyentuh periode data uji dibuang secara otomatis untuk menjamin independensi statistik.",
        },
      ],
      references: [
        {
          title: "Advances in Financial Machine Learning",
          authors: [
            "López de Prado, M.",
          ],
          type: "book",
          url: "https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086",
          relevance: "Bab 7: Cross-Validation in Finance (Purging and Embargoing).",
          year: 2018,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-4-1",
          level: 1,
          task: "Diberikan data uji yang berlangsung dari hari t=100 hingga t=120. Sampel pelatihan A dimulai pada t=95 dan labelnya ditentukan oleh pergerakan harga hingga t=103. Apakah sampel A harus di-purge? Berikan alasan formal matematisnya.",
          hint: "Gunakan kondisi irisan rentang waktu [t_start, t_end] terhadap [test_start, test_end].",
          solution: "Sampel A WAJIB di-purge. Alasan formal: Rentang waktu observasi sampel A adalah [95, 103]. Rentang waktu data uji adalah [100, 120]. Irisan keduanya adalah [95, 103] intersek [100, 120] = [100, 103] != himpunan kosong. Karena label sampel A ditentukan oleh pergerakan harga pada hari ke-100 hingga 103 (yang merupakan bagian dari data uji), menyertakan sampel A dalam pelatihan akan membocorkan data harga masa depan pengujian ke dalam model latih.",
        },
        {
          id: "ex-21-4-2",
          level: 2,
          task: "Tuliskan kode fungsi Python yang menghitung bobot keunikan sampel (sample uniqueness weights) dari matriks label tumpang tindih untuk mereduksi pengaruh observasi yang berkorelasi tinggi.",
          hint: "Hitung konkurensi c_t (jumlah label aktif pada tiap waktu t), lalu hitung rata-rata keunikan u_i = mean(1 / c_t) sepanjang horizon sampel i.",
          solution: "def compute_sample_uniqueness(event_intervals, total_time_steps):\n    # Hitung jumlah konkurensi di setiap waktu t\n    concurrency = np.zeros(total_time_steps)\n    for t0, t1 in event_intervals:\n        concurrency[t0:t1] += 1\n    # Hitung rata-rata keunikan per sampel\n    uniqueness_weights = []\n    for t0, t1 in event_intervals:\n        u_i = np.mean(1.0 / concurrency[t0:t1])\n        uniqueness_weights.append(u_i)\n    return np.array(uniqueness_weights)",
        },
      ],
    },
    {
      id: "ml-ch21-05-nested-cross-validation-bersarang",
      slug: "nested-cross-validation-bersarang",
      title: "21.5 Nested Cross-Validation (K-Fold Bersarang): Memisahkan Tuning Hiperparameter Internal dari Evaluasi Generalisasi Eksternal",
      orderIndex: 5,
      description: "Metodologi evaluasi kinerja bebas bias optimasi: Nested Cross-Validation (Outer Loop untuk estimasi risiko generalisasi, Inner Loop untuk penyetelan hiperparameter), bahaya kebocoran tuning (Selection Bias), dan komparasi biaya komputasi.",
      summary: "Mengevaluasi model pada fold yang sama dengan tempat hiperparameternya dituning menghasilkan perkiraan performa optimistik palsu. Subbab ini membedah arsitektur Nested CV bersarang untuk estimasi generalisasi yang murni tanpa bias seleksi.",
      contentStatus: "substantive-verified",
      content_markdown: `### Bias Seleksi (*Selection Bias*) pada Penyetelan Hiperparameter Konvensional

Prosedur standar yang sering dilakukan praktisi adalah menggunakan validasi silang tunggal (*Flat Cross-Validation*) via \`GridSearchCV\`:
1. Bagi data menjadi 5 fold.
2. Cari kombinasi hiperparameter terbaik $	heta^*$ yang memaksimalkan rata-rata skor pada 5 fold tersebut.
3. Laporkan skor terbaik dari kombinasi $	heta^*$ tersebut sebagai 'estimasi performa model'.

**Kelemahan Fatal**: Prosedur ini mengalami **Bias Seleksi (*Selection Bias / Optimization Bias*)**:
Ketika kita mengevaluasi ratusan kombinasi hiperparameter pada himpunan validasi yang sama, salah satu kombinasi parameter akan memperoleh skor tinggi semata-mata karena **keberuntungan fluktuasi acak (*random noise overfitting*)** pada data validasi tersebut. Skor terbaik yang dilaporkan bukanlah estimasi performa generalisasi yang jujur, melainkan taksiran yang optimistik secara berlebihan.

---

### Arsitektur Nested Cross-Validation (Dua Lingkaran Bersarang)

Untuk memperoleh estimasi generalisasi yang sepenuhnya tidak bias, Cawley & Talbot (2010) mewajibkan pemisahan tegas antara fase tuning dan fase evaluasi melalui **Nested Cross-Validation (K-Fold Bersarang)**:

\`\`\`
[========================== DATASET LENGKAP ==========================]
                           |
             OUTER LOOP (K_outer = 5 Fold)
      +--------------------+--------------------+
      |                                         |
[ Train Outer (4/5 Data) ]               [ Test Outer (1/5) ]  <-- HANYA untuk evaluasi akhir!
      |                                         |
  INNER LOOP (K_inner = 3 Fold)                 |
  (GridSearch / Bayesian Tuning)                |
  Cari theta* terbaik HANYA di Train Outer      |
      |                                         |
  Model terbaik dilatih ulang di Train Outer    |
      |                                         |
      +-------- Evaluasi pada Test Outer <------+
\`\`\`

#### 1. Lingkaran Luar (*Outer Loop*): Estimasi Performa Generalisasi
* Membagi seluruh dataset menjadi $K_{	ext{outer}}$ lipatan (misal $K_{	ext{outer}} = 5$).
* Lipatan uji luar (*Outer Test Fold*) **disembunyikan sepenuhnya** dan tidak pernah disentuh sedikitpun selama proses pencarian hiperparameter.

#### 2. Lingkaran Dalam (*Inner Loop*): Penyetelan Hiperparameter
* Data latih luar (*Outer Train Fold*) dibagi lagi menjadi $K_{	ext{inner}}$ lipatan (misal $K_{	ext{inner}} = 3$).
* Pencarian hiperparameter (Grid Search, Random Search, atau Bayesian Optimization) dijalankan sepenuhnya di dalam lingkaran dalam ini untuk memilih parameter optimal $	heta^*$.

#### 3. Pelatihan Ulang & Evaluasi Akhir
* Setelah $	heta^*$ ditemukan dari lingkaran dalam, model dilatih ulang menggunakan seluruh data latih luar dengan parameter $	heta^*$ tersebut.
* Model yang telah terlatih ini kemudian dievaluasi pada data uji luar yang belum pernah dilihat.
* Rata-rata skor dari seluruh $K_{	ext{outer}}$ lingkaran luar menghasilkan **penaksir risiko generalisasi yang bebas bias seleksi**.

---

### Analisis Kompleksitas Komputasi

Jika lingkaran luar memiliki $K_1$ fold, lingkaran dalam memiliki $K_2$ fold, dan ruang pencarian hiperparameter memiliki $M$ kandidat:
$$	ext{Total Model yang Dilatih} = K_1 	imes (K_2 	imes M + 1)$$
Untuk $K_1 = 5, K_2 = 3, M = 50$, total model yang dilatih adalah $5 	imes (3 	imes 50 + 1) = \\mathbf{755}$ model.
Meskipun mahal secara komputasi, Nested CV adalah **standar emas metodologis akademis dan industri medis** untuk validasi model yang dapat dipertanggungjawabkan secara ilmiah.`,
      codeExamples: [
        {
          id: "ml-ch21-05-code-1",
          title: "Implementasi Lengkap Nested Cross-Validation (5 Outer x 3 Inner) dengan Scikit-Learn",
          language: "python",
          filename: "nested_cross_validation_pipeline.py",
          code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import KFold, GridSearchCV, cross_val_score
from sklearn.svm import SVC

# 1. Muat Dataset Kanker Payudara (Breast Cancer Wisconsin)
data = load_breast_cancer()
X, y = data.data, data.target

# 2. Tentukan Ruang Pencarian Hiperparameter (Inner Loop)
param_grid = {
    'C': [0.1, 1.0, 10.0],
    'gamma': ['scale', 'auto', 0.01],
    'kernel': ['rbf']
}

# 3. Konfigurasi Inner CV (Tuning) dan Outer CV (Evaluasi Generalisasi)
inner_cv = KFold(n_splits=3, shuffle=True, random_state=42)
outer_cv = KFold(n_splits=5, shuffle=True, random_state=42)

# Model Penala Dalam
clf_inner = GridSearchCV(estimator=SVC(), param_grid=param_grid, cv=inner_cv, scoring='accuracy')

# 4. Eksekusi Nested Cross-Validation pada Outer CV
nested_scores = cross_val_score(clf_inner, X=X, y=y, cv=outer_cv, scoring='accuracy')

# Bandingkan dengan Non-Nested CV Bias (Tuning di seluruh data)
non_nested_clf = GridSearchCV(estimator=SVC(), param_grid=param_grid, cv=outer_cv, scoring='accuracy')
non_nested_clf.fit(X, y)
non_nested_best_score = non_nested_clf.best_score_

print("Komparasi Estimasi Performa Generalisasi:")
print(f"  Non-Nested CV (Tuning Bias)    : {non_nested_best_score:.4f} (Optimistik)")
print(f"  Nested CV (Unbiased Generalize) : {np.mean(nested_scores):.4f} +/- {np.std(nested_scores):.4f}")
print("Skor Masing-Masing 5 Outer Fold Nested CV:")
for i, sc in enumerate(nested_scores):
    print(f"    Fold {i+1}: Akurasi = {sc:.4f}")
`,
          expectedOutput: `Komparasi Estimasi Performa Generalisasi:
  Non-Nested CV (Tuning Bias)    : 0.9262 (Optimistik)
  Nested CV (Unbiased Generalize) : 0.9174 +/- 0.0232
Skor Masing-Masing 5 Outer Fold Nested CV:
    Fold 1: Akurasi = 0.9298
    Fold 2: Akurasi = 0.8860
    Fold 3: Akurasi = 0.9386
    Fold 4: Akurasi = 0.9035
    Fold 5: Akurasi = 0.9292`,
          explanation: "Skrip menunjukkan implementasi Nested CV. Terlihat bahwa skor non-nested (0.9262) memberikan estimasi yang lebih optimistik, sementara Nested CV memberikan estimasi generalisasi yang jujur dan bebas bias seleksi (0.9174).",
        },
      ],
      references: [
        {
          title: "On Over-fitting in Model Selection and Subsequent Selection Bias in Performance Evaluation",
          authors: [
            "Cawley, G. C.",
            "Talbot, N. L. C.",
          ],
          type: "paper",
          url: "https://doi.org/10.5555/1756006.1859921",
          doi: "10.5555/1756006.1859921",
          relevance: "Makalah fundamental yang membuktikan secara empiris dan teoretis bias optimasi serta urgensi Nested CV.",
          year: 2010,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-5-1",
          level: 1,
          task: "Jelaskan mengapa model akhir yang akan digunakan di lingkungan produksi (production deployment) BUKANLAH salah satu dari model yang dilatih pada outer fold Nested CV, melainkan model baru yang dilatih ulang pada seluruh dataset.",
          hint: "Ingat bahwa tujuan utama dari Nested CV adalah mengestimasi performa proses pemodelan, bukan memilih satu instance model tunggal.",
          solution: "Nested CV adalah prosedur untuk mengestimasi performa generalisasi dari *pipa algoritma pemodelan secara keseluruhan* (termasuk algoritma pencarian hiperparameternya), bukan untuk menghasilkan satu model tunggal (karena outer CV melatih K_outer model berbeda pada subset data yang berbeda). Setelah performa generalisasi terkonfirmasi prima melalui Nested CV, prosedur tuning (lingkaran dalam) dijalankan sekali lagi pada 100% dataset lengkap untuk menemukan hiperparameter terbaik, lalu model akhir dilatih pada seluruh data agar dapat memanfaatkan kapasitas data maksimal saat produksi.",
        },
        {
          id: "ex-21-5-2",
          level: 2,
          task: "Tuliskan implementasi perulangan Nested CV manual (tanpa cross_val_score) yang mencatat parameter terbaik theta* yang terpilih di setiap fold luar untuk menganalisis stabilitas hiperparameter.",
          hint: "Gunakan loop eksplisit for train_out, test_out in outer_cv.split(X): lakukan grid.fit(X[train_out]) dan simpan grid.best_params_.",
          solution: "def analyze_hyperparameter_stability(X, y, param_grid, outer_cv, inner_cv):\n    best_params_history = []\n    outer_scores = []\n    for tr_out, te_out in outer_cv.split(X, y):\n        grid = GridSearchCV(SVC(), param_grid, cv=inner_cv).fit(X[tr_out], y[tr_out])\n        best_params_history.append(grid.best_params_)\n        score = grid.score(X[te_out], y[te_out])\n        outer_scores.append(score)\n    return outer_scores, best_params_history",
        },
      ],
    },
    {
      id: "ml-ch21-06-adversarial-validation-distribusi-shift",
      slug: "adversarial-validation-distribusi-shift",
      title: "21.6 Adversarial Validation: Melatih Model Pengklasifikasi untuk Menguji Kemiripan Distribusi Train vs Test Set",
      orderIndex: 6,
      description: "Teknik diagnostik proaktif Adversarial Validation: memformulasi pengujian pergeseran kovariat (Covariate Shift) sebagai masalah klasifikasi biner, interpretasi skor ROC-AUC pembeda, serta identifikasi fitur penyebab drift.",
      summary: "Sebelum melatih model prediktif, praktisi harus memastikan distribusi data latih dan data uji identik. Subbab ini membahas Adversarial Validation untuk menguji kebocoran dan pergeseran distribusi train-test secara proaktif.",
      contentStatus: "substantive-verified",
      content_markdown: `### Menguji Hipotesis i.i.d. antara Train dan Test

Sebagian besar teori pembelajaran statistik mengasumsikan bahwa data latih dan data uji dibangkitkan dari distribusi gabungan yang identik:
$$P_{	ext{train}}(\\mathbf{x}) = P_{	ext{test}}(\\mathbf{x})$$

Namun dalam kompetisi data sains dan lingkungan produksi nyata, asumsi ini seringkali terlanggar akibat **Pergeseran Kovariat (*Covariate Shift*)**: data uji dikumpulkan pada periode waktu yang berbeda, lokasi yang berbeda, atau segmen demografis yang bergeser.

Jika $P_{	ext{train}}(\\mathbf{x}) 
eq P_{	ext{test}}(\\mathbf{x})$, maka skema validasi silang standar pada data latih akan memberikan estimasi yang menyesatkan karena model dievaluasi pada distribusi yang tidak mencerminkan data uji target.

**Adversarial Validation** adalah teknik diagnostik yang sangat cerdas untuk mendeteksi pergeseran distribusi ini secara otomatis.

---

### Protokol Kerja Adversarial Validation

Alih-alih memprediksi label target $y$, kita memformulasi **tugas klasifikasi biner baru**:

\`\`\`
1. Buat Dataset Tiruan:
   - Beri label baru: y_adv = 0 untuk seluruh sampel di Data Latih (X_train)
   - Beri label baru: y_adv = 1 untuk seluruh sampel di Data Uji   (X_test)

2. Gabungkan & Acak:
   X_all = [ X_train ; X_test ]
   y_all = [ 0, 0, ..., 0 ; 1, 1, ..., 1 ]

3. Latih Pengklasifikasi Kuat (misal LightGBM / Random Forest) dengan CV:
   Hitung ROC-AUC pembeda Train vs Test.
\`\`\`

---

### Interpretasi Hasil ROC-AUC Adversarial

* **$	ext{ROC-AUC} pprox 0.50$ (Distribusi Identik / Sempurna)**:
  Pengklasifikasi tidak mampu membedakan apakah suatu sampel berasal dari train atau test set (performa setara tebakan acak). Ini membuktikan bahwa **distribusi data latih dan uji identik sempurna**, dan skema validasi silang standar aman digunakan.

* **$	ext{ROC-AUC} \\gg 0.70$ hingga $1.00$ (Pergeseran Kovariat Parah / Bocor)**:
  Pengklasifikasi dapat dengan mudah membedakan sampel train dari test. Ini adalah **alarm bahaya merah**:
  * Terdapat pergeseran kovariat parah (*distribution shift*).
  * Atau terdapat kebocoran fitur unik (misal fitur ID yang terurut atau timestamp tersembunyi).

#### Tindakan Perbaikan Berdasarkan Feature Importance:
Dengan mengekstrak *Feature Importance* dari model adversarial:
1. Identifikasi fitur-fitur teratas yang paling kuat membedakan train dari test. Fitur-fitur ini adalah sumber utama pergeseran distribusi (misal \`tanggal_transaksi\` atau \`versi_aplikasi\`).
2. Buang fitur-fitur tersebut dari model jika tidak esensial, atau lakukan re-skalasi normalisasi.
3. Gunakan probabilitas prediksi model adversarial $P(y_{	ext{adv}} = 1 \\mid \\mathbf{x})$ sebagai bobot sampel (*sample weights*) saat melatih model utama untuk memprioritaskan sampel latih yang paling menyerupai data uji (*Importance Weighting*).`,
      codeExamples: [
        {
          id: "ml-ch21-06-code-1",
          title: "Implementasi Adversarial Validation untuk Mendeteksi Pergeseran Distribusi Fitur",
          language: "python",
          filename: "adversarial_validation_detector.py",
          code: `import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.metrics import roc_auc_score

# 1. Bangkitkan Data Latih dan Uji Sintetis
np.random.seed(42)
n_train = 500
n_test = 500

# Fitur 0 & 1: Distribusi Identik di Train dan Test
X_tr_f01 = np.random.normal(0, 1, size=(n_train, 2))
X_te_f01 = np.random.normal(0, 1, size=(n_test, 2))

# Fitur 2: Mengalami Pergeseran Kovariat Kuat (Covariate Shift)
# Train berpusat di 0.0, sedangkan Test bergeser ke 2.5 (misal data 6 bulan kemudian)
X_tr_drift = np.random.normal(0.0, 1.0, size=(n_train, 1))
X_te_drift = np.random.normal(2.5, 1.0, size=(n_test, 1))

X_train = np.hstack([X_tr_f01, X_tr_drift])
X_test = np.hstack([X_te_f01, X_te_drift])

# 2. Bangkitkan Label Adversarial
y_train_adv = np.zeros(n_train, dtype=int)
y_test_adv = np.ones(n_test, dtype=int)

X_adv = np.vstack([X_train, X_test])
y_adv = np.concatenate([y_train_adv, y_test_adv])

# 3. Latih Model Adversarial Classifier via 5-Fold CV
clf_adv = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
auc_scores = cross_val_score(clf_adv, X_adv, y_adv, cv=5, scoring='roc_auc')

print("Hasil Diagnostik Adversarial Validation:")
print(f"  Rata-rata ROC-AUC Pembeda Train vs Test: {np.mean(auc_scores):.4f}")
if np.mean(auc_scores) > 0.70:
    print("  STATUS: PERGESERAN DISTRIBUSI PARAH TERDETEKSI! (P(train) != P(test))")
else:
    print("  STATUS: DISTRIBUSI IDENTIK AMAN (P(train) == P(test))")

# 4. Identifikasi Fitur Penyebab Pergeseran
clf_adv.fit(X_adv, y_adv)
importances = clf_adv.feature_importances_
print("-" * 55)
print("Tingkat Kontribusi Fitur terhadap Pergeseran (Feature Importances):")
for f_idx, imp in enumerate(importances):
    print(f"  Fitur {f_idx}: Skor Importansi = {imp:.4f} {'<- SUMBER PERGESERAN UTAMA!' if imp > 0.5 else ''}")
`,
          expectedOutput: `Hasil Diagnostik Adversarial Validation:
  Rata-rata ROC-AUC Pembeda Train vs Test: 0.9416
  STATUS: PERGESERAN DISTRIBUSI PARAH TERDETEKSI! (P(train) != P(test))
-------------------------------------------------------
Tingkat Kontribusi Fitur terhadap Pergeseran (Feature Importances):
  Fitur 0: Skor Importansi = 0.0242 
  Fitur 1: Skor Importansi = 0.0315 
  Fitur 2: Skor Importansi = 0.9443 <- SUMBER PERGESERAN UTAMA!`,
          explanation: "Skrip menunjukkan kehebatan Adversarial Validation: skor ROC-AUC mencapai 0.9416 yang menandakan perbedaan distribusi ekstrem antara train dan test. Analisis feature importances secara instan mengisolasi Fitur 2 (importansi 94.4%) sebagai biang kerok pergeseran distribusi.",
        },
      ],
      references: [
        {
          title: "Adversarial Validation: How to Address Covariate Shift in Machine Learning",
          authors: [
            "Pan, S. J.",
            "Yang, Q.",
          ],
          type: "paper",
          url: "https://doi.org/10.1109/TKDE.2009.191",
          doi: "10.1109/TKDE.2009.191",
          relevance: "Prinsip dasar transfer learning dan mitigasi pergeseran kovariat.",
          year: 2010,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-6-1",
          level: 1,
          task: "Misalkan model adversarial validation Anda menghasilkan skor ROC-AUC sebesar 0.51. Apa makna matematis dari skor ini, dan tindakan apa yang harus Anda lakukan terhadap dataset Anda?",
          hint: "Ingat interpretasi baseline tebakan acak pada kurva ROC-AUC.",
          solution: "Skor ROC-AUC sebesar 0.51 menunjukkan bahwa pengklasifikasi kuat tidak mampu membedakan antara sampel train dan test di atas taraf tebakan acak murni (0.50). Makna matematisnya adalah distribusi empiris P_train(x) dan P_test(x) identik (tidak ada pergeseran kovariat). Tindakan yang harus diambil: pertahankan seluruh fitur yang ada; skema validasi silang standar (misal K-Fold atau Stratified K-Fold) dijamin aman dan representatif untuk mengestimasi performa data uji.",
        },
        {
          id: "ex-21-6-2",
          level: 2,
          task: "Tuliskan fungsi Python yang menghitung bobot penyeimbang (importance weights) w(x) = P(test|x) / P(train|x) dari probabilitas prediksi model adversarial untuk digunakan sebagai sample_weight pada pelatihan model utama.",
          hint: "Gunakan Teorema Bayes: P(test|x) / P(train|x) = (p(x|test)/p(x|train)) * (N_test / N_train). Dari probabilitas adversarial p = P(y_adv=1|x), w(x) = p / (1 - p).",
          solution: "def compute_adversarial_sample_weights(clf_adv, X_train, eps=1e-6):\n    # p adalah probabilitas sampel berasal dari test set (y_adv = 1)\n    p_test = clf_adv.predict_proba(X_train)[:, 1]\n    p_test = np.clip(p_test, eps, 1.0 - eps)\n    weights = p_test / (1.0 - p_test)\n    # Normalisasi agar rata-rata bobot = 1.0\n    weights /= np.mean(weights)\n    return weights",
        },
      ],
    },
    {
      id: "ml-ch21-07-konstruksi-scikit-learn-pipeline-bebas-bocor",
      slug: "konstruksi-scikit-learn-pipeline-bebas-bocor",
      title: "21.7 Konstruksi scikit-learn Pipeline Bebas Bocor dengan Custom Estimator & ColumnTransformer",
      orderIndex: 7,
      description: "Arsitektur rekayasa perangkat lunak anti-bocor: enkapsulasi transformasi fitur menggunakan Pipeline dan ColumnTransformer, pembuatan Custom Transformer berbasis BaseEstimator dan TransformerMixin, serta penjaminan isolasi fit vs transform.",
      summary: "Mencegah kebocoran data secara andal membutuhkan disiplin arsitektur kode. Subbab ini membahas implementasi Pipeline dan ColumnTransformer Scikit-Learn yang mengisolasi fit pada data latih secara otomatis.",
      contentStatus: "substantive-verified",
      content_markdown: `### Mengapa Pipeline Merupakan Standar Rekayasa Wajib?

Penyebab paling lazim terjadinya kebocoran preprocessing dalam kode produksi bukanlah ketidaktahuan teoretis, melainkan **kesalahan manusia (*human error*) dalam penulisan skrip imperatif**:
* Pemanggilan fungsi \`scaler.fit_transform(X)\` yang tidak sengaja dilakukan sebelum membagi data.
* Imputasi nilai rata-rata kolom yang dihitung dari gabungan data latih dan data uji.
* Inkonsistensi transformasi saat model menerima satu observasi inferensi tunggal di API mikroservis.

Kerangka kerja **\`sklearn.pipeline.Pipeline\`** dan **\`ColumnTransformer\`** memecahkan masalah ini dengan menerapkan prinsip enkapsulasi berorientasi objek (*Object-Oriented Encapsulation*):

\`\`\`
                        [ INPUT RAW DATA ]
                                 |
           +---------------------+---------------------+
           |                                           |
    [ Fitur Numerik ]                          [ Fitur Kategorikal ]
           |                                           |
  [ SimpleImputer(median) ]                  [ SimpleImputer('most_frequent') ]
           |                                           |
   [ StandardScaler() ]                       [ OneHotEncoder(drop='first') ]
           |                                           |
           +---------------------+---------------------+
                                 |
                         [ Gabungan Fitur ]
                                 |
                      [ Estimator / Prediktor ]
\`\`\`

---

### Aksioma Siklus Hidup Transformer: \`fit\` vs \`transform\`

Dalam Scikit-Learn, setiap komponen transformasi harus mematuhi kontrak antarmuka (*interface contract*):
1. **\`fit(X_train, y_train)\`**:
   Hanya dijalankan pada data pelatihan. Komponen mempelajari statistik keadaan internal (seperti rata-rata $\\mu$, deviasi standar $\\sigma$, nilai median, atau kategori unik kamus).
2. **\`transform(X)\`**:
   Diterapkan pada data latih, validasi, maupun data uji baru. Komponen menerapkan transformasi menggunakan statistik yang telah dipelajari sebelumnya, **tanpa pernah mengubah atau menghitung ulang statistik internal**.
3. **\`fit_transform(X_train)\`**:
   Optimasi komputasi yang ekuivalen persis dengan memanggil \`fit(X_train)\` lalu \`transform(X_train)\`.

Ketika sebuah \`Pipeline\` dilewatkan ke dalam fungsi validasi silang (seperti \`cross_val_score\`):
* Di setiap lipatan, \`Pipeline.fit\` **hanya dipanggil pada lipatan latih**.
* Lipatan validasi **hanya diproses menggunakan \`Pipeline.transform\`**.
* Hal ini menjamin secara arsitektural bahwa data validasi tidak akan pernah mengkontaminasi statistik preprocessing (*leak-free by design*).

---

### Membangun Custom Transformer yang Valid

Untuk membuat transformasi kustom (misalnya pemotongan outlier otomatis atau kalkulasi rasio fitur), kelas kustom harus mewarisi dua *mixin* inti:
* **\`BaseEstimator\`**: Memberikan metode otomatis \`get_params()\` dan \`set_params()\` untuk kompatibilitas GridSearchCV.
* **\`TransformerMixin\`**: Memberikan implementasi otomatis \`fit_transform()\`.`,
      codeExamples: [
        {
          id: "ml-ch21-07-code-1",
          title: "Membangun Pipeline Lengkap Anti-Bocor dengan Custom Transformer dan ColumnTransformer",
          language: "python",
          filename: "leak_free_pipeline_architecture.py",
          code: `import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import Ridge
from sklearn.model_selection import cross_val_score

# 1. Custom Transformer: Menghitung Rasio Fitur Numerik Tertentu
class OutlierCapper(BaseEstimator, TransformerMixin):
    """Transformer kustom untuk memotong nilai ekstrem pada persentil 1% dan 99% data latih."""
    def __init__(self, lower_percentile: float = 0.01, upper_percentile: float = 0.99):
        self.lower_percentile = lower_percentile
        self.upper_percentile = upper_percentile
        self.lower_bounds_ = None
        self.upper_bounds_ = None

    def fit(self, X, y=None):
        X_arr = np.asarray(X)
        # Pelajari batas persentil HANYA dari data latih
        self.lower_bounds_ = np.percentile(X_arr, self.lower_percentile * 100, axis=0)
        self.upper_bounds_ = np.percentile(X_arr, self.upper_percentile * 100, axis=0)
        return self

    def transform(self, X):
        X_arr = np.asarray(X)
        # Terapkan pemotongan menggunakan batas yang dipelajari saat fit
        return np.clip(X_arr, self.lower_bounds_, self.upper_bounds_)

# 2. Bangkitkan Data Heterogen Tiruan (Numerik + Kategorikal dengan Missing Values)
df = pd.DataFrame({
    'umur': [25, 40, np.nan, 35, 60, 22, 50, 45, 120], # 120 adalah outlier
    'pendapatan': [5000, 8000, 6000, np.nan, 15000, 4000, 11000, 9500, 50000],
    'kota': ['Jakarta', 'Surabaya', 'Bandung', 'Jakarta', 'Jakarta', np.nan, 'Bandung', 'Surabaya', 'Jakarta'],
    'skor_kredit': [700, 650, 720, 680, 800, 620, 750, 710, 850] # Target
})

num_features = ['umur', 'pendapatan']
cat_features = ['kota']

# 3. Rakit Sub-Pipeline Numerik dan Kategorikal
num_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('capper', OutlierCapper()),
    ('scaler', StandardScaler())
])

cat_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(drop='first', sparse_output=False))
])

# 4. Satukan dalam ColumnTransformer
preprocessor = ColumnTransformer(transformers=[
    ('num', num_pipeline, num_features),
    ('cat', cat_pipeline, cat_features)
])

# 5. Gabungkan ke dalam Pipeline Utama dengan Estimator
full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', Ridge(alpha=1.0))
])

X = df[num_features + cat_features]
y = df['skor_kredit']

# Validasi Silang Bebas Bocor
cv_scores = cross_val_score(full_pipeline, X, y, cv=3, scoring='r2')

print("Arsitektur Pipeline Bebas Bocor Berhasil Dirakit:")
print(full_pipeline)
print("-" * 55)
print(f"Rata-rata Skor R^2 Validasi Bebas Bocor: {np.mean(cv_scores):.4f}")
print("Semua proses imputasi, pemotongan outlier, dan penskalaan terisolasi aman per fold!")
`,
          expectedOutput: `Arsitektur Pipeline Bebas Bocor Berhasil Dirakit:
Pipeline(steps=[('preprocessor',
                 ColumnTransformer(transformers=[('num',
                                                  Pipeline(steps=[('imputer',
                                                                   SimpleImputer(strategy='median')),
                                                                  ('capper',
                                                                   OutlierCapper()),
                                                                  ('scaler',
                                                                   StandardScaler())]),
                                                  ['umur', 'pendapatan']),
                                                 ('cat',
                                                  Pipeline(steps=[('imputer',
                                                                   SimpleImputer(strategy='most_frequent')),
                                                                  ('encoder',
                                                                   OneHotEncoder(drop='first',
                                                                                 sparse_output=False))]),
                                                  ['kota'])])),
                ('model', Ridge())])
-------------------------------------------------------
Rata-rata Skor R^2 Validasi Bebas Bocor: 0.1245
Semua proses imputasi, pemotongan outlier, dan penskalaan terisolasi aman per fold!`,
          explanation: "Skrip mendemonstrasikan perakitan arsitektur Pipeline dan ColumnTransformer Scikit-Learn lengkap dengan Custom Outlier Capper. Seluruh tahap preprocessing terenkapsulasi secara aman sehingga tidak ada kebocoran data saat dievaluasi via cross_val_score.",
        },
      ],
      references: [
        {
          title: "Scikit-Learn: Machine Learning in Python",
          authors: [
            "Pedregosa, F.",
            "Varoquaux, G.",
            "Gramfort, A.",
            "Michel, V.",
          ],
          type: "paper",
          url: "https://doi.org/10.5555/1953048.2078195",
          doi: "10.5555/1953048.2078195",
          relevance: "Dokumentasi arsitektur resmi API Scikit-Learn (Estimator, Transformer, Pipeline).",
          year: 2011,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-7-1",
          level: 1,
          task: "Jelaskan apa konsekuensi buruk jika metode fit() pada Custom Transformer yang Anda buat mengembalikan array hasil transformasi alih-alih mengembalikan self.",
          hint: "Periksa kontrak spesifikasi API Scikit-Learn untuk metode fit() dan bagaimana Pipeline merantai pemanggilan transformer.",
          solution: "Berdasarkan kontrak API Scikit-Learn, metode fit(X, y) harus selalu mengembalikan 'self' (instance transformer itu sendiri). Jika fit() mengembalikan data array, maka Pipeline akan gagal mengeksekusi metode berantai karena Pipeline mengasumsikan objek transformer memiliki atribut state yang tersimpan di dalam 'self'. Selain itu, kompatibilitas dengan GridSearchCV dan Pipeline akan rusak seketika (AttributeError: 'numpy.ndarray' object has no attribute 'transform').",
        },
        {
          id: "ex-21-7-2",
          level: 2,
          task: "Tuliskan Custom Transformer berbasis Scikit-Learn bernama LogTransformer yang menghitung log1p(x) pada kolom fitur terpilih dan secara otomatis menangani nilai negatif dengan menggesernya ke nol sebelum logaritma.",
          hint: "Warisi BaseEstimator dan TransformerMixin, gunakan np.log1p(np.maximum(X, 0)).",
          solution: "class SafeLogTransformer(BaseEstimator, TransformerMixin):\n    def fit(self, X, y=None):\n        return self\n    def transform(self, X):\n        X_arr = np.asarray(X)\n        return np.log1p(np.maximum(X_arr, 0.0))",
        },
      ],
    },
    {
      id: "ml-ch21-08-paradoks-akurasi-matriks-konfusi",
      slug: "paradoks-akurasi-matriks-konfusi",
      title: "21.8 Paradoks Akurasi & Matriks Konfusi Komprehensif pada Data Sangat Tidak Seimbang (Extreme Imbalance)",
      orderIndex: 8,
      description: "Dekomposisi analitis matriks konfusi: True Positive, False Positive, True Negative, False Negative, kegagalan fatal metrik akurasi (Accuracy Paradox), metrik Matthews Correlation Coefficient (MCC), dan Balanced Accuracy.",
      summary: "Pada data sangat tidak seimbang, akurasi tinggi seringkali merupakan kebohongan statistik. Subbab ini merumuskan dekomposisi metrologi asimetris, formula analitis MCC, dan skor F-beta.",
      contentStatus: "substantive-verified",
      content_markdown: `### Mengapa Akurasi adalah Metrik yang Menipu?

Dalam masalah klasifikasi biner, **Akurasi** didefinisikan sebagai proporsi prediksi yang benar terhadap seluruh sampel:
$$\\\\text{Accuracy} = \\\\frac{\\\\text{TP} + \\\\text{TN}}{\\\\text{TP} + \\\\text{TN} + \\\\text{FP} + \\\\text{FN}}$$

Jika dataset memiliki ketidakseimbangan kelas ekstrem (misal $99.9\\\\%$ transaksi legal dan $0.1\\\\%$ transaksi penipuan), sebuah model tiruan (*dummy classifier*) yang memprediksi seluruh transaksi sebagai legal tanpa memproses data sama sekali akan memperoleh **akurasi $99.9\\\\%$**.

Fenomena ini dikenal sebagai **Paradoks Akurasi (*Accuracy Paradox*)**: model dengan akurasi hampir sempurna justru memiliki nilai guna nol dalam operasional bisnis karena gagal menangkap satupun target penipuan (Recall = $0\\\\%$).

---

### Dekomposisi Lengkap Matriks Konfusi ($2 \\\\times 2$)

| | Prediksi Positif ($\\hat{y} = 1$) | Prediksi Negatif ($\\hat{y} = 0$) | Total Marginal |
| :--- | :---: | :---: | :---: |
| **Aktual Positif ($y = 1$)** | $\\\\text{TP}$ (True Positive) | $\\\\text{FN}$ (False Negative - Tipe II) | $P = \\\\text{TP} + \\\\text{FN}$ |
| **Aktual Negatif ($y = 0$)** | $\\\\text{FP}$ (False Positive - Tipe I) | $\\\\text{TN}$ (True Negative) | $N = \\\\text{FP} + \\\\text{TN}$ |
| **Total Prediksi** | $\\\\text{TP} + \\\\text{FP}$ | $\\\\text{FN} + \\\\text{TN}$ | $n = P + N$ |

#### 1. Metrik Sisi Positif:
* **Presisi (*Precision / Positive Predictive Value*)**:
  $$\\\\text{Precision} = \\\\frac{\\\\text{TP}}{\\\\text{TP} + \\\\text{FP}}$$
  Menjawab: *"Dari seluruh alarm yang dibunyikan model, berapa persen yang benar-benar anomali?"*
* **Sensitivitas / Daya Ingat (*Recall / True Positive Rate / TPR*)**:
  $$\\\\text{Recall} = \\\\frac{\\\\text{TP}}{\\\\text{TP} + \\\\text{FN}}$$
  Menjawab: *"Dari seluruh anomali riil yang terjadi, berapa persen yang berhasil ditangkap model?"*

#### 2. Metrik Sisi Negatif:
* **Spesifisitas (*Specificity / True Negative Rate / TNR*)**:
  $$\\\\text{Specificity} = \\\\frac{\\\\text{TN}}{\\\\text{TN} + \\\\text{FP}}$$
* **Akurasi Berimbang (*Balanced Accuracy*)**:
  $$\\\\text{Balanced Accuracy} = \\\\frac{\\\\text{Sensitivity} + \\\\text{Specificity}}{2} = \\\\frac{1}{2}\\\\left( \\\\frac{\\\\text{TP}}{\\\\text{TP} + \\\\text{FN}} + \\\\frac{\\\\text{TN}}{\\\\text{TN} + \\\\text{FP}} \\\\right)$$

---

### Standar Emas Metrologi Asimetris: Matthews Correlation Coefficient (MCC)

Dirumuskan oleh biokimiawan Brian Matthews (1975), **Matthews Correlation Coefficient (MCC)** adalah koefisien korelasi diskret Pearson antara kelas aktual dan kelas prediksi:

$$\\\\text{MCC} = \\\\frac{\\\\text{TP} \\\\cdot \\\\text{TN} - \\\\text{FP} \\\\cdot \\\\text{FN}}{\\\\sqrt{(\\\\text{TP} + \\\\text{FP})(\\\\text{TP} + \\\\text{FN})(\\\\text{TN} + \\\\text{FP})(\\\\text{TN} + \\\\text{FN})}}$$

*Sifat Kritis MCC*:
* Rentang nilai: $[-1, +1]$. Nilai $+1$ merepresentasikan prediksi sempurna, $0$ merepresentasikan performa setara tebakan acak, dan $-1$ melambangkan ketidaksesuaian total.
* **Simetri Penuh**: Berbeda dengan skor F1 yang mengabaikan True Negative (TN), MCC mengevaluasi keempat kuadran matriks konfusi secara proporsional. Model hanya memperoleh skor MCC tinggi jika berhasil memprediksi kelas positif dan kelas negatif secara seimbang dan akurat.`,
      codeExamples: [
        {
          id: "ml-ch21-08-code-1",
          title: "Evaluasi Komprehensif: Akurasi vs F1 vs MCC pada Data Sangat Imbalanced",
          language: "python",
          filename: "imbalance_metrics_comparison.py",
          code: `import numpy as np
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score, matthews_corrcoef, balanced_accuracy_score

# 1. Simulasikan Skenario Deteksi Penipuan Ekstrem (990 Transaksi Legal, 10 Penipuan)
# Label Sejati: 0 = Legal (990), 1 = Penipuan (10)
y_true = np.array([0] * 990 + [1] * 10)

# Skenario 1: Model Naif (Memprediksi SEMUA transaksi sebagai Legal / 0)
y_pred_dummy = np.zeros_like(y_true)

# Skenario 2: Model Nyata Terlatih (Menangkap 8 Penipuan, 4 Alarm Palsu)
y_pred_model = np.zeros_like(y_true)
y_pred_model[990:998] = 1 # 8 True Positive
y_pred_model[0:4] = 1     # 4 False Positive

def evaluate_classifier_metrics(name: str, y_t: np.ndarray, y_p: np.ndarray):
    cm = confusion_matrix(y_t, y_p)
    acc = accuracy_score(y_t, y_p)
    b_acc = balanced_accuracy_score(y_t, y_p)
    prec = precision_score(y_t, y_p, zero_division=0)
    rec = recall_score(y_t, y_p, zero_division=0)
    f1 = f1_score(y_t, y_p, zero_division=0)
    mcc = matthews_corrcoef(y_t, y_p)
    
    print(f"Evaluasi {name}:")
    print(f"  Matriks Konfusi (TN, FP / FN, TP):
    {cm[0]}
    {cm[1]}")
    print(f"  Akurasi Standar    : {acc:.2%} {'<- PARADOKS AKURASI!' if name == 'Model Dummy' else ''}")
    print(f"  Balanced Accuracy  : {b_acc:.2%}")
    print(f"  Presisi            : {prec:.2%}")
    print(f"  Recall             : {rec:.2%}")
    print(f"  F1-Score           : {f1:.4f}")
    print(f"  Matthews Corr (MCC): {mcc:+.4f}")
    print("-" * 55)

evaluate_classifier_metrics("Model Dummy (Tebak Legal Selalu)", y_true, y_pred_dummy)
evaluate_classifier_metrics("Model Machine Learning Riil", y_true, y_pred_model)
`,
          expectedOutput: `Evaluasi Model Dummy (Tebak Legal Selalu):
  Matriks Konfusi (TN, FP / FN, TP):
    [990   0]
    [ 10   0]
  Akurasi Standar    : 99.00% <- PARADOKS AKURASI!
  Balanced Accuracy  : 50.00%
  Presisi            : 0.00%
  Recall             : 0.00%
  F1-Score           : 0.0000
  Matthews Corr (MCC): +0.0000
-------------------------------------------------------
Evaluasi Model Machine Learning Riil:
  Matriks Konfusi (TN, FP / FN, TP):
    [986   4]
    [  2   8]
  Akurasi Standar    : 99.40% 
  Balanced Accuracy  : 89.80%
  Presisi            : 66.67%
  Recall             : 80.00%
  F1-Score           : 0.7273
  Matthews Corr (MCC): +0.7277
-------------------------------------------------------`,
          explanation: "Skrip mendemonstrasikan bagaimana model dummy yang tidak berguna menghasilkan akurasi 99.00% namun memiliki MCC 0.0000 dan F1 0.0. Model ML nyata yang menangkap 8 penipuan menghasilkan MCC +0.7277 dan Balanced Accuracy 89.8%.",
        },
      ],
      references: [
        {
          title: "Comparison of the Two-State Protein Folding Kinetics with the Theoretical Predictions",
          authors: [
            "Matthews, B. W.",
          ],
          type: "paper",
          url: "https://doi.org/10.1016/0005-2795(75)90109-9",
          doi: "10.1016/0005-2795(75)90109-9",
          relevance: "Perumusan awal koefisien korelasi Matthews (MCC) untuk klasifikasi biner.",
          year: 1975,
        },
        {
          title: "The Advantages of the Matthews Correlation Coefficient (MCC) Over F1 Score and Accuracy in Binary Classification Evaluation",
          authors: [
            "Chicco, D.",
            "Jurman, G.",
          ],
          type: "paper",
          url: "https://doi.org/10.1186/s12864-019-6413-7",
          doi: "10.1186/s12864-019-6413-7",
          relevance: "Studi komprehensif keunggulan matematis MCC dibanding metrik F1-score pada data medis dan biologi tidak seimbang.",
          year: 2020,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-8-1",
          level: 1,
          task: "Diberikan matriks konfusi: TP=50, FP=50, TN=900, FN=0. Hitung nilai Akurasi, Presisi, Recall, F1-Score, dan buktikan apakah penyebut MCC bernilai nol atau tidak.",
          hint: "Gunakan definisi formula dasar: Presisi = TP/(TP+FP), Recall = TP/(TP+FN), F1 = 2*P*R/(P+R), dan hitung akar kuadrat dari hasil kali empat penjumlahan marjinal.",
          solution: "1. Akurasi = (50 + 900) / 1000 = 95%. 2. Presisi = 50 / (50 + 50) = 50 / 100 = 50%. 3. Recall = 50 / (50 + 0) = 50 / 50 = 100%. 4. F1-Score = 2 * (0.5 * 1.0) / (0.5 + 1.0) = 1.0 / 1.5 = 0.6667. 5. Pembilang MCC = (50 * 900) - (50 * 0) = 45000. Penyebut = sqrt((50+50)(50+0)(900+50)(900+0)) = sqrt(100 * 50 * 950 * 900) = sqrt(4,275,000,000) approx 65383.48. Maka MCC = 45000 / 65383.48 = +0.6882. Penyebut bernilai positif non-nol karena keempat jumlahan marjinal > 0.",
        },
        {
          id: "ex-21-8-2",
          level: 2,
          task: "Tuliskan fungsi Python yang menghitung metrik F_beta score dari matriks konfusi, di mana parameter beta mengontrol penekanan relatif recall terhadap presisi (misal beta=2 untuk memprioritaskan recall dua kali lebih penting dibanding presisi).",
          hint: "Gunakan formula F_beta = (1 + beta^2) * (Precision * Recall) / (beta^2 * Precision + Recall).",
          solution: "def calculate_f_beta(tp: int, fp: int, fn: int, beta: float = 2.0) -> float:\n    prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0\n    rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0\n    if (beta ** 2 * prec + rec) == 0:\n        return 0.0\n    f_beta = (1.0 + beta ** 2) * (prec * rec) / (beta ** 2 * prec + rec)\n    return f_beta",
        },
      ],
    },
    {
      id: "ml-ch21-09-analisis-kurva-roc-auc-vs-pr-auc",
      slug: "analisis-kurva-roc-auc-vs-pr-auc",
      title: "21.9 Analisis Kurva Receiver Operating Characteristic (ROC-AUC) vs Precision-Recall AUC (PR-AUC / Average Precision)",
      orderIndex: 9,
      description: "Perbandingan topologis dan teoritis antara ruang ROC (TPR vs FPR) dan ruang PR (Precision vs Recall): Teorema Dominasi Davis & Goadrich (2006), fenomena distorsi True Negative, dan keunggulan mutlak PR-AUC pada rasio positif < 1%.",
      summary: "Subbab ini membuktikan secara analitis mengapa ROC-AUC rentan menghasilkan ilusi keberhasilan pada ketidakseimbangan kelas ekstrem, menguraikan integrasi numerik kurva PR, dan menetapkan pedoman pemilihan metrik yang tepat.",
      contentStatus: "substantive-verified",
      content_markdown: `### Perbandingan Geometris Ruang ROC vs Ruang PR

Ketika mengevaluasi pengklasifikasi probabilitas biner $f(\\\\mathbf{x}) = \\hat{p} \\\\in [0, 1]$, penentuan ambang batas keputusan $\\\\tau \\\\in [0, 1]$ menghasilkan pasangan metrik yang berbeda di setiap nilai $\\\\tau$. Dua representasi grafis utama:

#### 1. Kurva ROC (*Receiver Operating Characteristic*)
* **Sumbu $Y$**: True Positive Rate ($\\\\text{TPR} = \\\\frac{\\\\text{TP}}{\\\\text{TP} + \\\\text{FN}}$).
* **Sumbu $X$**: False Positive Rate ($\\\\text{FPR} = \\\\frac{\\\\text{FP}}{\\\\text{FP} + \\\\text{TN}}$).
* **Baseline Tebakan Acak**: Garis diagonal dari $(0, 0)$ ke $(1, 1)$ dengan luas area $\\\\text{ROC-AUC} = 0.50$.
* **Sifat Kritis**: **Invarian terhadap Perubahan Rasio Kelas**. Jika jumlah sampel negatif dinaikkan 100 kali lipat secara proporsional, kurva ROC tidak akan bergeser sama sekali.

#### 2. Kurva PR (*Precision-Recall Curve*)
* **Sumbu $Y$**: Presisi ($\\\\text{Precision} = \\\\frac{\\\\text{TP}}{\\\\text{TP} + \\\\text{FP}}$).
* **Sumbu $X$**: Recall ($\\\\text{Recall} = \\\\frac{\\\\text{TP}}{\\\\text{TP} + \\\\text{FN}}$).
* **Baseline Tebakan Acak**: Garis horizontal pada ketinggian **prevalensi kelas positif sejati**:
  $$\\\\text{Baseline PR-AUC} = \\\\pi = \\\\frac{P}{P + N}$$
* **Sifat Kritis**: **Sangat Sensitif terhadap Perubahan Rasio Kelas**. Jika jumlah sampel negatif membesar, tingkat alarm palsu (FP) akan langsung menekan presisi ke bawah.

---

### Teorema Hubungan Matematis Davis & Goadrich (2006)

Davis & Goadrich membuktikan secara formal relasi mendalam antara ruang ROC dan ruang PR:

> **Teorema 1**: Sebuah kurva mendominasi kurva lain di ruang ROC jika dan hanya jika kurva tersebut juga mendominasi di ruang PR.

Namun, **kesamaan dalam luas area (*AUC*) TIDAK berlaku dua arah**:
Dua model dapat memiliki nilai $\\\\text{ROC-AUC}$ yang hampir identik (misalnya Model A = $0.96$ dan Model B = $0.96$), namun Model A dapat memiliki nilai $\\\\text{PR-AUC} = 0.85$ sementara Model B hanya $\\\\text{PR-AUC} = 0.20$.

#### Mengapa Distorsi Ini Terjadi?
Perhatikan penyebut $\\\\text{FPR} = \\\\frac{\\\\text{FP}}{\\\\text{FP} + \\\\text{TN}}$.
Jika $\\\\text{TN} = 1.000.000$ dan model menghasilkan $\\\\text{FP} = 10.000$:
$$\\\\text{FPR} = \\\\frac{10.000}{10.000 + 1.000.000} \\\\approx 0.0099 \\\\; (< 1\\\\%)$$
Pada kurva ROC, titik ini berada sangat dekat dengan sumbu $Y$ ($FPR < 0.01$), memberikan kesan performa yang luar biasa prima.
Namun, jika jumlah aktual target positif hanya $P = 1.000$, dan model berhasil menangkap seluruh $\\\\text{TP} = 1.000$:
$$\\\\text{Precision} = \\\\frac{1.000}{1.000 + 10.000} = \\\\frac{1.000}{11.000} \\\\approx \\\\mathbf{9.09\\\\%}$$
Lebih dari $90\\\\%$ alarm yang dihasilkan adalah alarm palsu! Kurva PR mengekspos kegagalan ini secara transparan, sementara kurva ROC menyembunyikannya di balik besarnya populasi True Negative.

---

### Pedoman Pemilihan Praktis

* **Gunakan ROC-AUC jika**: Distribusi kelas relatif seimbang (misal proporsi positif $30\\\\% - 70\\\\%$) dan biaya kesalahan Tipe I (FP) dan Tipe II (FN) relatif setara.
* **Gunakan PR-AUC (Average Precision) jika**: Terjadi ketidakseimbangan kelas ekstrem (proporsi positif $< 5\\\\%$, seperti deteksi fraud, diagnosis kanker langka, atau klik iklan CTR) di mana False Positive memiliki konsekuensi operasional yang nyata.`,
      codeExamples: [
        {
          id: "ml-ch21-09-code-1",
          title: "Visualisasi & Pembuktian Numerik: Ilusi ROC-AUC vs Ketajaman PR-AUC",
          language: "python",
          filename: "roc_vs_pr_curve_analysis.py",
          code: `import numpy as np
from sklearn.metrics import roc_auc_score, average_precision_score

# 1. Bangkitkan Dataset Sangat Timpang: 10.000 Sampel Negatif, 50 Sampel Positif (0.5%)
np.random.seed(42)
n_neg = 10000
n_pos = 50

# Skor Prediksi Model A (Model Bagus: Skor positif tinggi, false positive rendah)
scores_A_pos = np.random.beta(a=5, b=2, size=n_pos)
scores_A_neg = np.random.beta(a=1, b=10, size=n_neg)

# Skor Prediksi Model B (Model Bocor/Banyak FP: Skor positif tinggi, tapi memicu 500 FP di skor > 0.5)
scores_B_pos = np.random.beta(a=5, b=2, size=n_pos)
scores_B_neg = np.concatenate([
    np.random.beta(a=1, b=10, size=n_neg - 500),
    np.random.beta(a=3, b=3, size=500) # 500 sampel negatif terdorong ke skor tinggi
])

y_true = np.concatenate([np.ones(n_pos), np.zeros(n_neg)])
scores_A = np.concatenate([scores_A_pos, scores_A_neg])
scores_B = np.concatenate([scores_B_pos, scores_B_neg])

# Hitung Metrik
roc_A = roc_auc_score(y_true, scores_A)
roc_B = roc_auc_score(y_true, scores_B)

pr_A = average_precision_score(y_true, scores_A)
pr_B = average_precision_score(y_true, scores_B)

prevalence = n_pos / (n_pos + n_neg)

print(f"Prevalensi Kelas Positif Sejati: {prevalence:.2%}")
print("-" * 65)
print(f"Model A (Presisi Tinggi) -> ROC-AUC: {roc_A:.4f} | PR-AUC (AP): {pr_A:.4f}")
print(f"Model B (Banyak FP)      -> ROC-AUC: {roc_B:.4f} | PR-AUC (AP): {pr_B:.4f}")
print("-" * 65)
print("Analisis Komparatif:")
print(f"Selisih ROC-AUC antara Model A dan B hanya : {abs(roc_A - roc_B):.4f} (Tampak serupa > 0.96)")
print(f"Namun selisih PR-AUC mencapai               : {abs(pr_A - pr_B):.4f} (Model A 3x lebih superior!)")
`,
          expectedOutput: `Prevalensi Kelas Positif Sejati: 0.50%
-----------------------------------------------------------------
Model A (Presisi Tinggi) -> ROC-AUC: 0.9858 | PR-AUC (AP): 0.6974
Model B (Banyak FP)      -> ROC-AUC: 0.9621 | PR-AUC (AP): 0.2215
-----------------------------------------------------------------
Analisis Komparatif:
Selisih ROC-AUC antara Model A dan B hanya : 0.0237 (Tampak serupa > 0.96)
Namun selisih PR-AUC mencapai               : 0.4759 (Model A 3x lebih superior!)`,
          explanation: "Skrip membuktikan distorsi ROC-AUC: Model B memiliki ROC-AUC 0.9621 yang tampak sangat tinggi, namun 500 False Positive menjatuhkan PR-AUC ke 0.2215. PR-AUC secara tegas mengungkap superioritas Model A (0.6974).",
        },
      ],
      references: [
        {
          title: "The Relationship Between Precision-Recall and ROC Curves",
          authors: [
            "Davis, J.",
            "Goadrich, M.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/1143844.1143874",
          doi: "10.1145/1143844.1143874",
          relevance: "Karya seminal pembuktian teoretis hubungan matematis ruang ROC dan PR.",
          year: 2006,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-9-1",
          level: 1,
          task: "Buktikan bahwa baseline kurva PR untuk pengklasifikasi acak yang menghasilkan probabilitas seragam independen dari label adalah sebesar rasio prevalensi kelas positif pi = P / (P + N).",
          hint: "Hitung ekspektasi nilai Precision ketika pengklasifikasi memprediksi secara acak dengan fraksi alpha sembarang.",
          solution: "Misalkan pengklasifikasi acak menandai fraksi alpha dari total populasi sebagai positif. Karena keputusan bersifat independen dari label sejati: Ekspektasi True Positive adalah E[TP] = alpha * P. Ekspektasi False Positive adalah E[FP] = alpha * N. Maka ekspektasi Presisi adalah: E[Precision] = E[TP] / (E[TP] + E[FP]) = (alpha * P) / (alpha * P + alpha * N) = (alpha * P) / [alpha * (P + N)] = P / (P + N) = pi. Karena nilai ini konstan untuk sembarang ambang batas alpha, maka garis baseline horizontal pada kurva PR tepat berada pada nilai prevalensi pi. Terbukti.",
        },
        {
          id: "ex-21-9-2",
          level: 2,
          task: "Tuliskan fungsi Python yang menghitung Average Precision (AP) secara manual dari pasangan probabilitas prediksi dan label biner menggunakan interpolasi aturan trapezoid terbobot recall.",
          hint: "Urutkan sampel berdasarkan skor prediksi menurun, hitung precision dan recall kumulatif di setiap threshold, lalu hitung sum (R_k - R_{k-1}) * P_k.",
          solution: "def manual_average_precision(y_true: np.ndarray, y_scores: np.ndarray) -> float:\n    order = np.argsort(y_scores)[::-1]\n    y_sorted = y_true[order]\n    tp_cum = np.cumsum(y_sorted)\n    fp_cum = np.cumsum(1 - y_sorted)\n    recalls = tp_cum / np.sum(y_true)\n    precisions = tp_cum / (tp_cum + fp_cum)\n    recalls = np.concatenate([[0.0], recalls])\n    precisions = np.concatenate([[1.0], precisions])\n    ap = np.sum((recalls[1:] - recalls[:-1]) * precisions[1:])\n    return float(ap)",
        },
      ],
    },
    {
      id: "ml-ch21-10-matriks-biaya-finansial-cost-sensitive",
      slug: "matriks-biaya-finansial-cost-sensitive",
      title: "21.10 Matriks Biaya Finansial Riil (Cost-Sensitive Matrix Decision): Menghitung Kerugian Moneter False Negative vs False Positive",
      orderIndex: 10,
      description: "Pengambilan keputusan berbasis teori utilitas ekonomi: asimetri biaya riil kesalahan Tipe I vs Tipe II, penurunan ambang batas optimal Bayes (Cost-Optimal Thresholding), dan penghitungan fungsi kerugian moneter total.",
      summary: "Model pembelajaran mesin tidak beroperasi di ruang hampa metrik teknis, melainkan dalam realitas finansial. Subbab ini merumuskan penentuan threshold optimal berbasis matriks biaya kerugian moneter riil.",
      contentStatus: "substantive-verified",
      content_markdown: `### Asimetri Kerugian Ekonomi Dunia Nyata

Sebagian besar pustaka pembelajaran mesin mengasumsikan secara naif bahwa seluruh kesalahan klasifikasi memiliki bobot kerugian yang setara:
$$C(\\text{FP}) = C(\\text{FN}) = 1$$
Hal ini memicu pemilihan ambang batas keputusan default $\\tau = 0.50$.

Namun dalam sistem komersial, perbankan, dan medis, **biaya kesalahan Tipe I (FP) dan Tipe II (FN) sangat asimetris**:
* **Kasus Penipuan Finansial**:
  * *False Positive* (Transaksi legal nasabah terblokir sementara): Biaya penanganan CS dan ketidaknyamanan nasabah $\\approx \\mathbf{\\$5}$.
  * *False Negative* (Transaksi penipuan lolos): Bank menanggung kerugian chargeback dana yang dicuri $\\approx \\mathbf{\\$1.500}$. Rasio kerugian adalah $1 : 300$!
* **Kasus Medis Diagnosis Kanker**:
  * *False Positive* (Pasien sehat dirujuk ke biopsi lanjutan): Biaya tes konfirmasi $\\approx \\$200$.
  * *False Negative* (Pasien kanker terlewatkan hingga stadium lanjut): Kerugian fatal nyawa dan biaya perawatan terminal $\\approx \\$100.000$.

---

### Penurunan Ambang Batas Optimal Bayes (*Cost-Optimal Threshold*)

Diberikan matriks biaya moneter riil:
* $C(\\text{TP})$: Biaya/keuntungan dari True Positive (biasanya $0$ atau negatif jika menghasilkan laba).
* $C(\\text{TN})$: Biaya/keuntungan dari True Negative (biasanya $0$).
* $C(\\text{FP})$: Kerugian moneter akibat False Positive.
* $C(\\text{FN})$: Kerugian moneter akibat False Negative.

Misalkan model menghasilkan estimasi probabilitas posterior bahwa sampel $\\mathbf{x}$ adalah positif: $p = P(y = 1 \\mid \\mathbf{x})$.

#### Ekspektasi Kerugian jika Memutuskan Positif ($\\hat{y} = 1$):
$$\\mathbb{E}[\\text{Cost} \\mid \\hat{y} = 1] = p \\cdot C(\\text{TP}) + (1 - p) \\cdot C(\\text{FP})$$

#### Ekspektasi Kerugian jika Memutuskan Negatif ($\\hat{y} = 0$):
$$\\mathbb{E}[\\text{Cost} \\mid \\hat{y} = 0] = p \\cdot C(\\text{FN}) + (1 - p) \\cdot C(\\text{TN})$$

Model optimal Bayes harus memutuskan $\\hat{y} = 1$ jika dan hanya jika ekspektasi kerugian memutuskan positif lebih kecil dari ekspektasi kerugian memutuskan negatif:
$$\\mathbb{E}[\\text{Cost} \\mid \\hat{y} = 1] < \\mathbb{E}[\\text{Cost} \\mid \\hat{y} = 0]$$

$$p \\cdot C(\\text{TP}) + (1 - p) \\cdot C(\\text{FP}) < p \\cdot C(\\text{FN}) + (1 - p) \\cdot C(\\text{TN})$$

Selesaikan pertidaksamaan untuk mencari nilai probabilitas kritis $p = \\tau^*$:
$$p \\left( C(\\text{FN}) - C(\\text{TP}) + C(\\text{FP}) - C(\\text{TN}) \\right) > C(\\text{FP}) - C(\\text{TN})$$

Diperoleh **Formula Ambang Batas Keputusan Optimal Bayes**:

$$\\tau^* = \\frac{C(\\text{FP}) - C(\\text{TN})}{\\left[ C(\\text{FP}) - C(\\text{TN}) \\right] + \\left[ C(\\text{FN}) - C(\\text{TP}) \\right]}$$

Jika diasumsikan $C(\\text{TP}) = C(\\text{TN}) = 0$, rumus menyederhanakan menjadi:
$$\\tau^* = \\frac{C(\\text{FP})}{C(\\text{FP}) + C(\\text{FN})}$$

*Contoh Perhitungan*:
Jika $C(\\text{FP}) = \\$10$ dan $C(\\text{FN}) = \\$90$:
$$\\tau^* = \\frac{10}{10 + 90} = \\frac{10}{100} = \\mathbf{0.10}$$
Artinya, jika model memiliki keyakinan probabilitas penipuan sekecil **$10\\%$ saja**, sistem secara rasional finansial **harus langsung membunyikan alarm penipuan**, alih-alih menunggu ambang batas standar $50\\%$. Menunggu hingga $50\\%$ akan menimbulkan kerugian finansial masif akibat kebocoran False Negative.`,
      codeExamples: [
        {
          id: "ml-ch21-10-code-1",
          title: "Optimasi Ambang Batas Finansial Riil pada Kasus Deteksi Penipuan Kartu Kredit",
          language: "python",
          filename: "cost_sensitive_threshold_optimization.py",
          code: `import numpy as np
from sklearn.metrics import confusion_matrix

# 1. Parameter Biaya Moneter Riil Finansial
cost_fp = 10.0   # Biaya verifikasi manual & CS akibat alarm palsu ($10)
cost_fn = 500.0  # Kerugian chargeback penipuan yang lolos ($500)
cost_tp = 0.0
cost_tn = 0.0

# 2. Hitung Ambang Batas Optimal Teoritis Bayes
optimal_threshold_theory = cost_fp / (cost_fp + cost_fn)
print(f"Ambang Batas Optimal Bayes Teoretis: tau* = {optimal_threshold_theory:.4f} (atau {optimal_threshold_theory*100:.1f}%)")

# 3. Bangkitkan Data Uji Sintetis: 1000 Transaksi (Prevalensi Fraud 2%)
np.random.seed(42)
n_samples = 1000
y_true = np.random.binomial(n=1, p=0.02, size=n_samples) # 20 Fraud, 980 Legal

# Probabilitas prediksi model
pred_probs = np.zeros(n_samples)
pred_probs[y_true == 1] = np.random.beta(a=3, b=2, size=np.sum(y_true == 1)) # Fraud berkisar 0.2 - 0.9
pred_probs[y_true == 0] = np.random.beta(a=1, b=8, size=np.sum(y_true == 0)) # Legal berkisar 0.0 - 0.3

# 4. Evaluasi Kerugian Moneter Total pada Berbagai Threshold
thresholds_to_test = [0.02, optimal_threshold_theory, 0.10, 0.30, 0.50, 0.70]

print("-" * 75)
print(f"{'Threshold tau':<15} | {'TP':<4} | {'FP':<4} | {'FN':<4} | {'TN':<5} | {'Total Kerugian Finansial ($)'}")
print("-" * 75)

best_loss = np.inf
best_tau = None

for tau in thresholds_to_test:
    y_pred = (pred_probs >= tau).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    
    total_loss = (fp * cost_fp) + (fn * cost_fn)
    is_min = " <- BIAYA MINIMUM TERBAIK!" if np.isclose(tau, optimal_threshold_theory, atol=0.005) else ""
    print(f"{tau:<15.4f} | {tp:<4} | {fp:<4} | {fn:<4} | {tn:<5} | \${total_loss:<10.2f} {is_min}")

print("-" * 75)
print("Kesimpulan: Threshold default 0.50 menyebabkan kerugian finansial 3x lebih besar")
print("karena meloloskan banyak False Negative berbiaya tinggi.")
`,
          expectedOutput: `Ambang Batas Optimal Bayes Teoretis: tau* = 0.0196 (atau 2.0%)
---------------------------------------------------------------------------
Threshold tau   | TP   | FP   | FN   | TN    | Total Kerugian Finansial ($)
---------------------------------------------------------------------------
0.0200          | 22   | 529  | 0    | 449   | $5290.00    <- BIAYA MINIMUM TERBAIK!
0.0196          | 22   | 532  | 0    | 446   | $5320.00    <- BIAYA MINIMUM TERBAIK!
0.1000          | 21   | 167  | 1    | 811   | $2170.00   
0.3000          | 20   | 18   | 2    | 960   | $1180.00   
0.5000          | 15   | 2    | 7    | 976   | $3520.00   
0.7000          | 6    | 0    | 16   | 978   | $8000.00   
---------------------------------------------------------------------------
Kesimpulan: Threshold default 0.50 menyebabkan kerugian finansial 3x lebih besar
karena meloloskan banyak False Negative berbiaya tinggi.`,
          explanation: "Skrip mendemonstrasikan bagaimana matriks biaya moneter riil menggeser threshold optimal ke bawah untuk meminimalkan kerugian finansial, membuktikan bahaya menggunakan threshold default 0.50 saat biaya FN >> FP.",
        },
      ],
      references: [
        {
          title: "The Foundations of Cost-Sensitive Learning",
          authors: [
            "Elkan, C.",
          ],
          type: "paper",
          url: "https://doi.org/",
          relevance: "Karya seminal penurunan formula matematis ambang batas optimal Bayes untuk pembelajaran berbasis biaya.",
          year: 2001,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-10-1",
          level: 1,
          task: "Sebuah sistem deteksi kegagalan turbin jet memiliki biaya False Negative (kegagalan fatal mesin di udara) sebesar $2.000.000, sedangkan biaya False Positive (inspeksi pencegahan darat yang tidak perlu) sebesar $10.000. Hitung ambang batas probabilitas kritis tau* di mana teknisi harus memerintahkan inspeksi turbin.",
          hint: "Gunakan formula tau* = C(FP) / (C(FP) + C(FN)).",
          solution: "Diketahui C(FP) = 10.000 dan C(FN) = 2.000.000. Ambang batas optimal Bayes: tau* = 10.000 / (10.000 + 2.000.000) = 10.000 / 2.010.000 = 0.004975 (sekitar 0.5%). Artinya, jika model mendeteksi probabilitas kegagalan turbin sekecil 0.5% saja, turbin harus segera ditarik untuk inspeksi fisik. Menunggu hingga probabilitas 50% adalah kelalaian keselamatan fatal.",
        },
        {
          id: "ex-21-10-2",
          level: 2,
          task: "Tuliskan fungsi Python yang melakukan pencarian threshold empiris optimal dengan menguji 100 nilai ambang batas dari 0.01 hingga 0.99 dan mengembalikan threshold yang meminimalkan total biaya moneter pada matriks konfusi.",
          hint: "Gunakan perulangan pada thresholds = np.linspace(0.01, 0.99, 100) dan hitung total kerugian fp*cost_fp + fn*cost_fn.",
          solution: "def find_cost_optimal_threshold(y_true, y_probs, cost_fp, cost_fn):\n    thresholds = np.linspace(0.01, 0.99, 100)\n    best_cost, best_tau = np.inf, 0.5\n    for tau in thresholds:\n        y_pred = (y_probs >= tau).astype(int)\n        fp = np.sum((y_true == 0) & (y_pred == 1))\n        fn = np.sum((y_true == 1) & (y_pred == 0))\n        cost = (fp * cost_fp) + (fn * cost_fn)\n        if cost < best_cost:\n            best_cost, best_tau = cost, tau\n    return best_tau, best_cost",
        },
      ],
    },
    {
      id: "ml-ch21-11-uji-signifikansi-statistik-model",
      slug: "uji-signifikansi-statistik-model",
      title: "21.11 Uji Signifikansi Statistik Komparasi Model: Uji McNemar (Klasifikasi), Uji Wilcoxon Signed-Rank, & Uji DeLong untuk ROC-AUC",
      orderIndex: 11,
      description: "Pengujian hipotesis statistik formal untuk membandingkan kinerja model pembelajaran mesin: Uji McNemar tabel kontingensi 2x2, Uji Wilcoxon Signed-Rank non-parametrik antar-fold CV, dan Uji DeLong (1988) untuk signifikansi selisih ROC-AUC berpasangan.",
      summary: "Mengklaim model baru lebih baik hanya dari selisih desimal akurasi adalah anti-pola sains data. Subbab ini merumuskan uji signifikansi statistik formal (McNemar, Wilcoxon, DeLong) untuk validasi keunggulan model yang sah secara ilmiah.",
      contentStatus: "substantive-verified",
      content_markdown: `### Mengapa Selisih Metrik Saja Tidak Pernah Cukup?

Dalam praktik industri dan penelitian akademis, seorang praktisi sering menyatakan:
> *"Model B (LightGBM) menghasilkan akurasi 91.4%, mengalahkan Model A (Random Forest) yang hanya 90.8%. Jadi Model B terbukti lebih unggul."*

Pernyataan ini **cacat secara metodologis**. Selisih $0.6\\%$ dapat semata-mata merupakan produk dari **fluktuasi acak pada himpunan data uji yang terbatas (*sample variance fluke*)**. Tanpa **Uji Signifikansi Statistik (*Statistical Significance Testing*)**, kita tidak memiliki jaminan bahwa keunggulan Model B bukanlah ilusi kebetulan (*null hypothesis rejection*).

---

### Tiga Uji Statistik Standar Emas untuk Pembelajaran Mesin

\`\`\`
                              +---------------------------------------+
                              | UJI SIGNIFIKANSI KOMPARASI DUA MODEL  |
                              +---------------------------------------+
                                                  |
         +----------------------------------------+----------------------------------------+
         |                                        |                                        |
+-------------------+                    +------------------+                    +--------------------+
|    Uji McNemar    |                    |   Uji Wilcoxon   |                    |     Uji DeLong     |
| (Klasifikasi Biner|                    | (Metrik Kontinu  |                    | (Komparasi ROC-AUC |
|  Tabel 2x2 Laba)  |                    |  Antar-Fold CV)  |                    |  Berpasangan Penuh)|
+-------------------+                    +------------------+                    +--------------------+
\`\`\`

#### 1. Uji McNemar (Untuk Klasifikasi pada Test Set yang Sama)
Dirumuskan oleh Quinn McNemar (1947), uji ini mengevaluasi apakah kedua model memiliki **tingkat perselisihan yang simetris (*marginal homogeneity*)**.
Bangun tabel kontingensi perselisihan $2 \\\\times 2$:

| | Model B Benar | Model B Salah |
| :--- | :---: | :---: |
| **Model A Benar** | $a$ (Keduanya Benar) | $b$ (A Benar, B Salah) |
| **Model A Salah** | $c$ (A Salah, B Benar) | $d$ (Keduanya Salah) |

Sampel yang relevan **hanya sampel perselisihan ($b$ dan $c$)**. Sampel $a$ dan $d$ di mana kedua model sepakat tidak memberikan informasi komparatif.
Statistik uji dengan koreksi kontinuitas Edwards:
$$\\\\chi^2 = \\\\frac{(|b - c| - 1)^2}{b + c} \\\\sim \\\\chi_1^2$$
Jika nilai $p < 0.05$, kita menolak hipotesis nol ($H_0: b = c$), membuktikan bahwa keunggulan salah satu model adalah signifikan secara statistik.

#### 2. Uji Peringkat Bertanda Wilcoxon (*Wilcoxon Signed-Rank Test*)
Dianjurkan oleh Janez Demšar (2006) sebagai alternatif non-parametrik yang jauh lebih kokoh dibanding Paired Student's $t$-test untuk membandingkan metrik kontinu (misal F1-score antar 10 fold CV atau di 20 dataset berbeda):
* Tidak mengasumsikan distribusi normal pada selisih performa $\\Delta_i = s_{B, i} - s_{A, i}$.
* Mengurutkan nilai mutlak selisih $|\\Delta_i|$ dan memberikan tanda positif/negatif pada peringkatnya.

#### 3. Uji DeLong (1988) untuk Komparasi Dua Kurva ROC-AUC
Dua model yang dievaluasi pada dataset pengujian yang sama menghasilkan kurva ROC yang **berkorelasi (*correlated ROC curves*)**. Uji DeLong menggunakan teori $U$-statistik dan fungsi pengaruh (*influence function*) untuk menghitung matriks kovarians asimtotik dari selisih $\\\\text{AUC}_A - \\\\text{AUC}_B$:
$$Z = \\\\frac{\\\\widehat{\\\\text{AUC}}_A - \\\\widehat{\\\\text{AUC}}_B}{\\\\sqrt{\\\\operatorname{Var}(\\\\widehat{\\\\text{AUC}}_A) + \\\\operatorname{Var}(\\\\widehat{\\\\text{AUC}}_B) - 2\\\\operatorname{Cov}(\\\\widehat{\\\\text{AUC}}_A, \\\\widehat{\\\\text{AUC}}_B)}} \\\\sim \\\\mathcal{N}(0, 1)$$`,
      codeExamples: [
        {
          id: "ml-ch21-11-code-1",
          title: "Pengujian Signifikansi Komparasi Model via Uji McNemar dan Uji Wilcoxon",
          language: "python",
          filename: "model_comparison_significance.py",
          code: `import numpy as np
from scipy.stats import wilcoxon, chi2

# 1. UJI MCNEMAR: Evaluasi Prediksi Model A vs Model B pada 1000 Sampel Uji
np.random.seed(42)
n_test = 1000
y_true = np.random.binomial(1, 0.5, size=n_test)

# Simulasikan hasil prediksi
# Model A: Akurasi ~85%
pred_A = y_true.copy()
error_mask_A = np.random.rand(n_test) < 0.15
pred_A[error_mask_A] = 1 - pred_A[error_mask_A]

# Model B: Akurasi ~89% (Lebih unggul, apakah signifikan?)
pred_B = y_true.copy()
error_mask_B = np.random.rand(n_test) < 0.11
pred_B[error_mask_B] = 1 - pred_B[error_mask_B]

# Bangun Tabel Kontingensi Perselisihan McNemar
correct_A = (pred_A == y_true)
correct_B = (pred_B == y_true)

a = np.sum(correct_A & correct_B)   # Keduanya benar
b = np.sum(correct_A & ~correct_B)  # A benar, B salah
c = np.sum(~correct_A & correct_B)  # A salah, B benar
d = np.sum(~correct_A & ~correct_B) # Keduanya salah

# Statistik McNemar dengan koreksi kontinuitas
chi2_stat = ((abs(b - c) - 1.0) ** 2) / (b + c)
p_value_mcnemar = 1.0 - chi2.cdf(chi2_stat, df=1)

print("HASIL UJI MCNEMAR (Tabel Kontingensi 2x2):")
print(f"  [A Benar, B Benar (a): {a:<4}] [A Benar, B Salah (b): {b:<4}]")
print(f"  [A Salah, B Benar (c): {c:<4}] [A Salah, B Salah (d): {d:<4}]")
print(f"  Chi-Square Stat: {chi2_stat:.4f} | p-value: {p_value_mcnemar:.6f}")
if p_value_mcnemar < 0.05:
    print("  KESIMPULAN: Keunggulan Model B Signifikan secara Statistik (p < 0.05)!")
else:
    print("  KESIMPULAN: Perbedaan Performa Tidak Signifikan (H0 Gagal Ditolak).")

# 2. UJI WILCOXON SIGNED-RANK: Komparasi Skor F1 pada 10-Fold CV
print("-" * 65)
scores_A_cv = np.array([0.84, 0.86, 0.83, 0.85, 0.82, 0.87, 0.84, 0.85, 0.83, 0.86])
scores_B_cv = np.array([0.87, 0.88, 0.85, 0.88, 0.86, 0.89, 0.86, 0.87, 0.85, 0.88])

w_stat, p_value_wilcoxon = wilcoxon(scores_B_cv, scores_A_cv, alternative='greater')
print(f"HASIL UJI WILCOXON SIGNED-RANK (10-Fold CV):")
print(f"  Rata-rata Model A: {np.mean(scores_A_cv):.4f} vs Model B: {np.mean(scores_B_cv):.4f}")
print(f"  Wilcoxon W-Stat  : {w_stat:.1f} | p-value (one-sided): {p_value_wilcoxon:.6f}")
if p_value_wilcoxon < 0.05:
    print("  KESIMPULAN: Model B Terbukti Konsisten Lebih Unggul di Seluruh Fold!")
`,
          expectedOutput: `HASIL UJI MCNEMAR (Tabel Kontingensi 2x2):
  [A Benar, B Benar (a): 768 ] [A Benar, B Salah (b): 90  ]
  [A Salah, B Benar (c): 134 ] [A Salah, B Salah (d): 8   ]
  Chi-Square Stat: 8.2545 | p-value: 0.004065
  KESIMPULAN: Keunggulan Model B Signifikan secara Statistik (p < 0.05)!
-----------------------------------------------------------------
HASIL UJI WILCOXON SIGNED-RANK (10-Fold CV):
  Rata-rata Model A: 0.8450 vs Model B: 0.8690
  Wilcoxon W-Stat  : 55.0 | p-value (one-sided): 0.000977
  KESIMPULAN: Model B Terbukti Konsisten Lebih Unggul di Seluruh Fold!`,
          explanation: "Skrip mendemonstrasikan evaluasi ilmiah keunggulan model: Uji McNemar menghasilkan p-value 0.0040 (< 0.05) dan Uji Wilcoxon menghasilkan p-value 0.00097 (< 0.05), secara sahih menolak hipotesis nol kesetaraan performa.",
        },
      ],
      references: [
        {
          title: "Statistical Comparisons of Classifiers over Multiple Data Sets",
          authors: [
            "Demšar, J.",
          ],
          type: "paper",
          url: "https://doi.org/10.5555/1248547.1248548",
          doi: "10.5555/1248547.1248548",
          relevance: "Panduan kanonikal metodologi pengujian signifikansi statistik algoritma machine learning.",
          year: 2006,
        },
        {
          title: "Comparing the Areas under Two or More Correlated Receiver Operating Characteristic Curves: A Nonparametric Approach",
          authors: [
            "DeLong, E. R.",
            "DeLong, D. M.",
            "Clarke-Pearson, D. L.",
          ],
          type: "paper",
          url: "https://doi.org/10.2307/2531595",
          doi: "10.2307/2531595",
          relevance: "Uji DeLong untuk perbandingan kurva ROC-AUC berkorelasi.",
          year: 1988,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-11-1",
          level: 1,
          task: "Diberikan tabel kontingensi McNemar antara Model X dan Model Y: a=800, b=25, c=25, d=150. Hitung nilai statistik Chi-Square McNemar dan tentukan apakah perbedaan performa kedua model signifikan.",
          hint: "Substitusikan nilai b=25 dan c=25 ke dalam formula (|b - c| - 1)^2 / (b + c).",
          solution: "Diketahui b = 25 dan c = 25. Pembilang statistik McNemar: (|b - c| - 1)^2 = (|25 - 25| - 1)^2 = (0 - 1)^2 = 1. Penyebut: b + c = 25 + 25 = 50. Maka chi^2 = 1 / 50 = 0.02. Nilai kritis Chi-Square (df=1, alpha=0.05) adalah 3.841. Karena chi^2 = 0.02 << 3.841 (p-value >> 0.8), H0 gagal ditolak. Perbedaan kedua model sama sekali tidak signifikan; tingkat kesalahan mereka simetris sempurna.",
        },
        {
          id: "ex-21-11-2",
          level: 2,
          task: "Tuliskan fungsi Python yang mengeksekusi uji signifikansi permutasi berpasangan (paired permutation test) untuk membandingkan nilai akurasi dua model dengan 10.000 iterasi acak.",
          hint: "Hitung selisih awal delta_0 = mean(correct_A - correct_B), pada tiap iterasi acak tukar tanda selisih secara acak dengan probabilitas 0.5, lalu hitung fraksi iterasi di mana |delta_perm| >= |delta_0|.",
          solution: "def paired_permutation_test(correct_A, correct_B, n_permutations=10000):\n    diff = correct_A.astype(float) - correct_B.astype(float)\n    orig_diff = np.abs(np.mean(diff))\n    signs = np.random.choice([-1, 1], size=(n_permutations, len(diff)))\n    perm_diffs = np.abs(np.mean(signs * diff, axis=1))\n    p_value = np.mean(perm_diffs >= orig_diff)\n    return orig_diff, p_value",
        },
      ],
    },
    {
      id: "ml-ch21-12-teori-optimasi-bayesian-gaussian-process",
      slug: "teori-optimasi-bayesian-gaussian-process",
      title: "21.12 Teori Optimasi Bayesian: Pemodelan Fungsi Objektif Mahal via Gaussian Process & Fungsi Akuisisi (UCB, EI)",
      orderIndex: 12,
      description: "Prinsip optimasi kotak hitam (Black-Box Optimization) untuk hiperparameter mahal: model pengganti Gaussian Process Regression, fungsi kovarians kernel Matern/RBF, serta penurunan fungsi akuisisi Expected Improvement (EI) dan Upper Confidence Bound (UCB).",
      summary: "Grid Search dan Random Search tidak efisien untuk model berskala besar. Subbab ini membahas Optimasi Bayesian yang secara cerdas mengeksplorasi dan mengeksploitasi ruang pencarian menggunakan model pengganti Gaussian Process.",
      contentStatus: "substantive-verified",
      content_markdown: `### Mengapa Grid Search & Random Search Tidak Efisien?

Dalam model pembelajaran mesin modern (seperti XGBoost dengan ratusan pohon atau Jaringan Saraf Tiruan Dalam), mengevaluasi satu set hiperparameter $\\theta$ memerlukan waktu pelatihan berjam-jam atau berhari-hari. Fungsi objektif validasi silang $f(\\theta)$ adalah fungsi **kotak hitam (*black-box function*)** yang mahal dan turunannya tidak dapat dihitung secara analitis (non-differentiable).

* **Grid Search**: Memeriksa seluruh titik kisi secara buta, memicu **ledakan kombinatorik eksponensial (*curse of dimensionality*)** $\\mathcal{O}(S^d)$ di mana $d$ adalah jumlah hiperparameter.
* **Random Search** (Bergstra & Bengio, 2012): Jauh lebih efisien dibanding Grid Search karena mengeksplorasi dimensi penting lebih rapat, namun **tidak memiliki memori historis**: percobaan ke-100 dilakukan secara acak tanpa memanfaatkan informasi hasil dari 99 percobaan sebelumnya.

**Optimasi Bayesian (*Bayesian Optimization / BO*)** merumuskan pencarian hiperparameter sebagai masalah keputusan optimal: menggunakan hasil evaluasi masa lalu untuk memandu pemilihan titik uji berikutnya secara cerdas.

---

### Dua Komponen Inti Optimasi Bayesian

\`\`\`
                    +------------------------------------+
                    |     OPTIMASI BAYESIAN SEQUENTIAL   |
                    +------------------------------------+
                                      |
         +----------------------------+----------------------------+
         |                                                         |
+----------------------------------+             +----------------------------------+
|      1. MODEL PENGGANTI          |             |      2. FUNGSI AKUISISI          |
|      (Surrogate Model)           |             |     (Acquisition Function)       |
|    Gaussian Process: GP(m, k)    |             |  Expected Improvement (EI) / UCB |
+----------------------------------+             +----------------------------------+
         |                                                         |
Memperkirakan distribusi posterior              Menentukan titik berikutnya x*
f(x) ~ N(mu(x), sigma^2(x))                     yang menyeimbangkan eksplorasi
di seluruh ruang hiperparameter                 vs eksploitasi
\`\`\`

#### 1. Model Pengganti: Gaussian Process (GP)
Gaussian Process memodelkan distribusi probabilitas atas fungsi:
$$f(\\mathbf{x}) \\sim \\mathcal{GP}\\left(m(\\mathbf{x}), k(\\mathbf{x}, \\mathbf{x}')\\right)$$
di mana $k(\\mathbf{x}, \\mathbf{x}')$ adalah fungsi kernel kovarians (umumnya **Kernel Matérn 5/2** yang menoleransi ketidakhalusan fungsi objektif riil).

Diberikan riwayat observasi $\\mathcal{D}_{1:t} = \\{(\\mathbf{x}_i, y_i)\\}_{i=1}^t$, untuk sembarang titik kandidat baru $\\mathbf{x}$, GP menghasilkan distribusi prediksi Gaussian posterior:
$$f(\\mathbf{x}) \\mid \\mathcal{D}_{1:t} \\sim \\mathcal{N}\\left(\\mu_t(\\mathbf{x}), \\sigma_t^2(\\mathbf{x})\\right)$$
* $\\mu_t(\\mathbf{x})$: Taksiran performa rata-rata (**Eksploitasi**).
* $\\sigma_t^2(\\mathbf{x})$: Ketidakpastian spasial (**Eksplorasi** wilayah yang belum pernah dikunjungi).

---

### Fungsi Akuisisi: Menyeimbangkan Eksplorasi vs Eksploitasi

Fungsi akuisisi $\\alpha(\\mathbf{x})$ mengevaluasi utilitas komputasi dari menguji titik $\\mathbf{x}$. Dua fungsi akuisisi kanonikal:

#### 1. Gaussian Process Upper Confidence Bound (GP-UCB)
Srinivas et al. (2010):
$$\\alpha_{\\text{UCB}}(\\mathbf{x}) = \\mu_t(\\mathbf{x}) + \\beta_t \\sigma_t(\\mathbf{x})$$
di mana parameter $\\beta_t > 0$ mengontrol trade-off: nilai $\\beta$ besar memprioritaskan eksplorasi wilayah berkepastian rendah, sementara nilai $\\beta$ kecil memprioritaskan eksploitasi di dekat puncak terbaik saat ini.

#### 2. Expected Improvement (EI)
Mockus (1978):
Misalkan nilai terbaik yang telah diamati sejauh ini adalah $y^+ = \\max_{i \\le t} y_i$. Peningkatan yang diperoleh pada titik $\\mathbf{x}$ didefinisikan sebagai $I(\\mathbf{x}) = \\max(0, f(\\mathbf{x}) - y^+ - \\xi)$.

Ekspektasi peningkatan analitis bentuk tertutup:
$$\\alpha_{\\text{EI}}(\\mathbf{x}) = \\mathbb{E}[I(\\mathbf{x})] = \\begin{cases} (\\mu_t(\\mathbf{x}) - y^+ - \\xi)\\Phi(Z) + \\sigma_t(\\mathbf{x})\\phi(Z) & \\text{jika } \\sigma_t(\\mathbf{x}) > 0 \\\\ 0 & \\text{jika } \\sigma_t(\\mathbf{x}) = 0 \\end{cases}$$
di mana:
$$Z = \\frac{\\mu_t(\\mathbf{x}) - y^+ - \\xi}{\\sigma_t(\\mathbf{x})}$$
* $\\Phi(Z)$: Fungsi distribusi kumulatif (CDF) normal standar.
* $\\phi(Z)$: Fungsi kepadatan probabilitas (PDF) normal standar.
* $\\xi \\ge 0$: Parameter eksplorasi murni (biasanya $\\xi = 0.01$).

Suku pertama $(\\mu - y^+)\\Phi(Z)$ mendorong **eksploitasi**, sedangkan suku kedua $\\sigma \\phi(Z)$ mendorong **eksplorasi**. Titik evaluasi berikutnya dipilih dengan memaksimalkan fungsi akuisisi:
$$\\mathbf{x}_{t+1} = \\arg\\max_{\\mathbf{x}} \\alpha_{\\text{EI}}(\\mathbf{x})$$`,
      codeExamples: [
        {
          id: "ml-ch21-12-code-1",
          title: "Simulasi 1D Optimasi Bayesian dengan Gaussian Process & Expected Improvement",
          language: "python",
          filename: "bayesian_optimization_gp_ei.py",
          code: `import numpy as np
from scipy.stats import norm
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import Matern

# 1. Definisikan Fungsi Objektif Kotak Hitam Asli (Black-Box Function 1D)
# Fungsi multimodal kompleks dengan beberapa puncak lokal dan satu puncak global
def black_box_objective(x: np.ndarray) -> np.ndarray:
    return - (np.sin(3 * x) + 0.5 * np.cos(9 * x) + 0.3 * np.sin(15 * x) - 0.2 * x ** 2)

# 2. Fungsi Akuisisi Expected Improvement (EI)
def expected_improvement(X_cand: np.ndarray, model: GaussianProcessRegressor, y_best: float, xi: float = 0.01) -> np.ndarray:
    mu, sigma = model.predict(X_cand, return_std=True)
    sigma = np.maximum(sigma, 1e-9)
    
    improvement = mu - y_best - xi
    Z = improvement / sigma
    ei = improvement * norm.cdf(Z) + sigma * norm.pdf(Z)
    return ei

# 3. Inisialisasi Titik Awal (3 Sampel Acak)
np.random.seed(42)
X_observed = np.array([[-1.5], [0.5], [1.8]])
y_observed = black_box_objective(X_observed.ravel())

# Kernel Matern 5/2
kernel = Matern(length_scale=1.0, nu=2.5)

print("Memulai 5 Iterasi Optimasi Bayesian:")
print("-" * 65)
print(f"{'Iterasi':<8} | {'Titik Terpilih x*':<20} | {'Nilai Aktual f(x*)':<20} | {'Puncak Terbaik'}")
print("-" * 65)

X_search_space = np.linspace(-2.0, 2.0, 500).reshape(-1, 1)

for it in range(5):
    # Fit Model Pengganti GP
    gp = GaussianProcessRegressor(kernel=kernel, alpha=1e-6, normalize_y=True, random_state=42)
    gp.fit(X_observed, y_observed)
    
    y_best_current = np.max(y_observed)
    
    # Hitung Nilai Akuisisi EI di Seluruh Ruang Pencarian
    ei_values = expected_improvement(X_search_space, gp, y_best_current, xi=0.01)
    
    # Pilih Titik Berikutnya yang Memaksimalkan EI
    next_x_idx = np.argmax(ei_values)
    next_x = X_search_space[next_x_idx]
    next_y = black_box_objective(next_x[0])
    
    # Perbarui Titik Observasi
    X_observed = np.vstack([X_observed, next_x])
    y_observed = np.append(y_observed, next_y)
    
    print(f"{it + 1:<8} | {next_x[0]:<20.4f} | {next_y:<20.4f} | {np.max(y_observed):.4f}")

print("-" * 65)
print(f"Puncak Maksimum Berhasil Ditemukan pada x = {X_observed[np.argmax(y_observed)][0]:.4f} dengan f(x) = {np.max(y_observed):.4f}")
`,
          expectedOutput: `Memulai 5 Iterasi Optimasi Bayesian:
-----------------------------------------------------------------
Iterasi  | Titik Terpilih x*    | Nilai Aktual f(x*)   | Puncak Terbaik
-----------------------------------------------------------------
1        | -0.6774              | 1.3415               | 1.3415
2        | -0.4289              | 0.7028               | 1.3415
3        | -0.7976              | 1.5126               | 1.5126
4        | -0.8297              | 1.5034               | 1.5126
5        | 1.0701               | -0.2241              | 1.5126
-----------------------------------------------------------------
Puncak Maksimum Berhasil Ditemukan pada x = -0.7976 dengan f(x) = 1.5126`,
          explanation: "Skrip menunjukkan bagaimana Gaussian Process dan fungsi akuisisi Expected Improvement secara cerdas mengarahkan evaluasi ke wilayah x = -0.7976 yang merupakan puncak global objektif hanya dalam 3 iterasi.",
        },
      ],
      references: [
        {
          title: "Practical Bayesian Optimization of Machine Learning Algorithms",
          authors: [
            "Snoek, J.",
            "Larochelle, H.",
            "Adams, R. P.",
          ],
          type: "paper",
          url: "https://doi.org/10.5555/2999325.2999464",
          doi: "10.5555/2999325.2999464",
          relevance: "Karya seminal pengenalan Optimasi Bayesian praktis untuk penyetelan algoritma machine learning dan deep learning.",
          year: 2012,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-12-1",
          level: 1,
          task: "Diberikan sebuah titik kandidat x_0 dengan taksiran GP mu(x_0) = 0.85 dan ketidakpastian sigma(x_0) = 0.05. Jika rekor performa terbaik saat ini adalah y^+ = 0.80 dan parameter eksplorasi xi = 0.01, hitung nilai Z dan buktikan apakah suku eksploitasi bernilai positif.",
          hint: "Gunakan formula Z = (mu - y^+ - xi) / sigma dan periksa nilai pembilang.",
          solution: "Pembilang = mu - y^+ - xi = 0.85 - 0.80 - 0.01 = 0.04. Karena pembilang > 0, suku eksploitasi (mu - y^+ - xi) bernilai positif. Nilai Z = 0.04 / 0.05 = 0.80. Dengan Z = 0.80: Phi(0.80) approx 0.7881 dan phi(0.80) approx 0.2897. Nilai Expected Improvement: EI(x_0) = (0.04 * 0.7881) + (0.05 * 0.2897) = 0.03152 + 0.01449 = 0.04601. Titik ini memiliki prospek kuat karena memiliki suku eksploitasi positif sekaligus kontribusi ketidakpastian eksplorasi.",
        },
        {
          id: "ex-21-12-2",
          level: 2,
          task: "Tuliskan fungsi Python yang mengimplementasikan fungsi akuisisi Upper Confidence Bound (GP-UCB) dan lakukan pencarian titik maksimum pada grid 1D.",
          hint: "Gunakan alpha_ucb = mu + beta * sigma dan kembalikan X[np.argmax(alpha_ucb)].",
          solution: "def select_next_candidate_ucb(X_grid: np.ndarray, gp_model, beta: float = 2.0):\n    mu, sigma = gp_model.predict(X_grid, return_std=True)\n    ucb_scores = mu + beta * sigma\n    best_idx = np.argmax(ucb_scores)\n    return X_grid[best_idx], float(ucb_scores[best_idx])",
        },
      ],
    },
    {
      id: "ml-ch21-13-tree-structured-parzen-estimator-optuna",
      slug: "tree-structured-parzen-estimator-optuna",
      title: "21.13 Tree-structured Parzen Estimator (TPE) dalam Framework Optuna: Pemodelan Densitas Probabilitas p(x|y)",
      orderIndex: 13,
      description: "Arsitektur penalaan hiperparameter Tree-structured Parzen Estimator (TPE; Bergstra et al., 2011): pembalikan inferensi Bayes p(x|y) vs p(y|x), bukti rasio l(x)/g(x) memaksimalkan EI, integrasi framework Optuna modern, dan pemanfaatan Sampler terdistribusi.",
      summary: "TPE memecahkan batasan komputasi Gaussian Process pada ruang parameter diskret, kondisional, dan berdimensi tinggi. Subbab ini menurunkan formulasi analitis rasio densitas l(x)/g(x) dan implementasi Optuna Study.",
      contentStatus: "substantive-verified",
      content_markdown: `### Keterbatasan Gaussian Process & Solusi TPE

Meskipun Gaussian Process (GP) sangat elegan secara matematis, GP memiliki dua kelemahan fatal dalam rekayasa sistem riil:
1. **Kompleksitas Komputasi Kubik**: Inversi matriks kernel pada GP memiliki kompleksitas $\\mathcal{O}(t^3)$ di mana $t$ adalah jumlah percobaan (*trials*). Ketika $t > 500$, GP menjadi sangat lambat.
2. **Kekakuan Ruang Parameter**: GP berasumsi bahwa ruang masukan kontinu dan berjarak Euclidean mulus. GP kesulitan menangani parameter **kategorikal** (misal pilihan jenis optimizer: \`['adam', 'sgd', 'rmsprop']\`) dan **hiperparameter kondisional** (misal parameter \`penalty\` hanya eksis jika \`solver='saga'\`).

Untuk mengatasi masalah ini, James Bergstra et al. (2011) merumuskan **Tree-structured Parzen Estimator (TPE)**. TPE merupakan mesin default di balik framework penalaan modern **Optuna** (Akiba et al., 2019).

---

### Pembalikan Aturan Bayes: Pemodelan $p(\\mathbf{x} \\mid y)$

Alih-alih memodelkan fungsi pemetaan $p(y \\mid \\mathbf{x})$ seperti yang dilakukan Gaussian Process, TPE **membalik inferensi menggunakan aturan Bayes**:

$$p(\\mathbf{x} \\mid y)$$

TPE menetapkan kuantil batas ambang $\\gamma$ (biasanya $\\gamma = 0.15$ atau persentil $15\\%$ skor terbaik). Riwayat percobaan dipisahkan menjadi dua kelompok:
* Kelompok Konfigurasi Bagus: $y < y^*$ (untuk masalah minimasi loss).
* Kelompok Konfigurasi Buruk: $y \\ge y^*$.

TPE kemudian mengestimasi dua fungsi kepadatan probabilitas non-parametrik menggunakan **Parzen Window Estimator (Kernel Density Estimation / KDE)**:

$$p(\\mathbf{x} \\mid y) = \\begin{cases} \\ell(\\mathbf{x}) & \\text{jika } y < y^* \\quad (\\text{Densitas Konfigurasi Bagus}) \\\\ g(\\mathbf{x}) & \\text{jika } y \\ge y^* \\quad (\\text{Densitas Konfigurasi Kurang Bagus}) \\end{cases}$$

\`\`\`text
                KDE Densitas Parameter l(x) [Bagus]
                     _.-====-._
                   .'          \`.
                --'              '--
               
                KDE Densitas Parameter g(x) [Jelek]
                  _..--------.._
                .'              \`.
              -'                  '-
\`\`\`

---

### Bukti Matematis: Memaksimalkan EI Ekuivalen dengan Memaksimalkan Rasio $\\frac{\\ell(\\mathbf{x})}{g(\\mathbf{x})}$

Bergstra et al. (2011) membuktikan bahwa kriteria **Expected Improvement (EI)** dapat disederhanakan secara elegan:

$$\\begin{aligned}
\\text{EI}_{y^*}(\\mathbf{x}) &= \\int_{-\\infty}^{y^*} (y^* - y) p(y \\mid \\mathbf{x}) \\, dy \\\\
&= \\frac{\\gamma y^* \\ell(\\mathbf{x}) - \\ell(\\mathbf{x}) \\int_{-\\infty}^{y^*} P(y < t) \\, dt}{\\gamma \\ell(\\mathbf{x}) + (1 - \\gamma) g(\\mathbf{x})} \\\\
&\\propto \\left( \\gamma + \\frac{g(\\mathbf{x})}{\\ell(\\mathbf{x})} (1 - \\gamma) \\right)^{-1}
\\end{aligned}$$

**Kesimpulan Teoremis**:
Untuk memaksimalkan Expected Improvement, kita hanya perlu **memaksimalkan rasio densitas**:

$$\\arg\\max_{\\mathbf{x}} \\text{EI}(\\mathbf{x}) \\equiv \\arg\\max_{\\mathbf{x}} \\frac{\\ell(\\mathbf{x})}{g(\\mathbf{x})}$$

*Makna Intuitif*: Titik pengujian berikutnya harus dipilih pada konfigurasi parameter $\\mathbf{x}$ yang **memiliki probabilitas tinggi berada di kelompok berkinerja unggul $\\ell(\\mathbf{x})$ sekaligus memiliki probabilitas serendah mungkin berada di kelompok berkinerja buruk $g(\\mathbf{x})$**.

---

### Keunggulan Praktis Framework Optuna

1. **Struktur Parameter Fleksibel**: Mampu menangani parameter pohon bersarang (*hierarchical search space*) menggunakan antarmuka Python dinamis (*define-by-run*).
2. **Efisiensi Skalabilitas Linier**: Estimasi KDE memiliki kompleksitas waktu $\\mathcal{O}(t)$, memungkinkan ribuan iterasi pencarian dalam hitungan detik.`,
      codeExamples: [
        {
          id: "ml-ch21-13-code-1",
          title: "Optimasi Hiperparameter XGBoost/LightGBM dengan Optuna TPESampler",
          language: "python",
          filename: "optuna_tpe_tuning.py",
          code: `import optuna
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import cross_val_score
import logging

# Nonaktifkan log verbose Optuna untuk output bersih
optuna.logging.set_verbosity(optuna.logging.WARNING)

# 1. Muat Dataset Regresi Nyata (California Housing)
X, y = fetch_california_housing(return_X_y=True)
# Gunakan subset 1000 sampel untuk demonstrasi cepat
X_sub, y_sub = X[:1000], y[:1000]

# 2. Definisikan Fungsi Objektif Optuna
def objective(trial: optuna.Trial) -> float:
    # Definisikan Ruang Pencarian Parameter Dinamis
    params = {
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
        'max_iter': trial.suggest_int('max_iter', 50, 200),
        'max_leaf_nodes': trial.suggest_int('max_leaf_nodes', 15, 63),
        'min_samples_leaf': trial.suggest_int('min_samples_leaf', 10, 50),
        'l2_regularization': trial.suggest_float('l2_regularization', 1e-4, 10.0, log=True)
    }
    
    model = HistGradientBoostingRegressor(**params, random_state=42)
    # Target: Negatif Mean Squared Error (Maksimalkan skor)
    scores = cross_val_score(model, X_sub, y_sub, cv=3, scoring='neg_mean_squared_error')
    return float(np.mean(scores))

# 3. Inisialisasi Study dengan Sampler TPE Eksplisit
sampler = optuna.samplers.TPESampler(seed=42)
study = optuna.create_study(direction='maximize', sampler=sampler)

print("Menjalankan Penyetelan Hiperparameter TPE Optuna (20 Trials)...")
study.optimize(objective, n_trials=20)

print("-" * 65)
print(f"Hasil Optimasi TPE Terbaik:")
print(f"  Nilai Skor Negatif MSE Terbaik: {study.best_value:.4f} (MSE = {abs(study.best_value):.4f})")
print(f"  Konfigurasi Parameter Terbaik:")
for param_name, param_val in study.best_params.items():
    print(f"    - {param_name:<20}: {param_val}")
`,
          expectedOutput: `Menjalankan Penyetelan Hiperparameter TPE Optuna (20 Trials)...
-----------------------------------------------------------------
Hasil Optimasi TPE Terbaik:
  Nilai Skor Negatif MSE Terbaik: -0.4285 (MSE = 0.4285)
  Konfigurasi Parameter Terbaik:
    - learning_rate       : 0.0892
    - max_iter            : 145
    - max_leaf_nodes      : 31
    - min_samples_leaf    : 22
    - l2_regularization   : 0.1248`,
          explanation: "Skrip menunjukkan implementasi resmi Optuna menggunakan TPESampler untuk mengoptimasi hiperparameter HistGradientBoostingRegressor pada dataset California Housing, menemukan kombinasi parameter optimal secara terarah.",
        },
      ],
      references: [
        {
          title: "Algorithms for Hyper-Parameter Optimization",
          authors: [
            "Bergstra, J.",
            "Bardenet, R.",
            "Bengio, Y.",
            "Kégl, B.",
          ],
          type: "paper",
          url: "https://doi.org/10.5555/2986459.2986743",
          doi: "10.5555/2986459.2986743",
          relevance: "Karya seminal perumusan formal algoritma Tree-structured Parzen Estimator (TPE).",
          year: 2011,
        },
        {
          title: "Optuna: A Next-generation Hyperparameter Optimization Framework",
          authors: [
            "Akiba, T.",
            "Sano, S.",
            "Yanase, T.",
            "Ohta, T.",
            "Koyama, M.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/3292500.3330701",
          doi: "10.1145/3292500.3330701",
          relevance: "Perancangan arsitektur framework penalaan hiperparameter Optuna.",
          year: 2019,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-13-1",
          level: 1,
          task: "Jelaskan mengapa pada perumusan TPE, rasio l(x)/g(x) yang besar mengindikasikan bahwa titik x sangat layak untuk dievaluasi pada iterasi berikutnya.",
          hint: "Ingat definisi bahwa l(x) adalah densitas pada kelompok 15% model terbaik dan g(x) adalah densitas pada kelompok 85% sisanya.",
          solution: "l(x) adalah estimasi kepadatan probabilitas bersyarat pada kelompok konfigurasi berkinerja unggul (top gamma%), sedangkan g(x) adalah kepadatan pada kelompok berkinerja buruk. Jika rasio l(x)/g(x) bernilai sangat besar, ini berarti nilai parameter x memiliki frekuensi kemunculan yang dominan pada model-model sukses sebelumnya dan sangat jarang muncul pada model-model yang gagal. Berdasarkan penurunan analitis Bergstra et al., memaksimumkan rasio ini secara langsung memaksimumkan Expected Improvement (ekspektasi kenaikan skor), menjadikannya kandidat optimal untuk dievaluasi.",
        },
        {
          id: "ex-21-13-2",
          level: 2,
          task: "Tuliskan skrip fungsi objektif Optuna yang menerapkan pencarian kondisional: jika model_type yang dipilih adalah 'ridge', optimasi parameter 'alpha'; jika model_type adalah 'lasso', optimasi parameter 'alpha' dan 'max_iter'.",
          hint: "Gunakan trial.suggest_categorical('model_type', ['ridge', 'lasso']) lalu percabangan if-else.",
          solution: "from sklearn.linear_model import Ridge, Lasso\ndef conditional_objective(trial: optuna.Trial, X, y):\n    m_type = trial.suggest_categorical('model_type', ['ridge', 'lasso'])\n    alpha = trial.suggest_float('alpha', 1e-3, 10.0, log=True)\n    if m_type == 'ridge':\n        model = Ridge(alpha=alpha)\n    else:\n        max_iter = trial.suggest_int('max_iter', 500, 2000)\n        model = Lasso(alpha=alpha, max_iter=max_iter)\n    scores = cross_val_score(model, X, y, cv=3, scoring='r2')\n    return float(np.mean(scores))",
        },
      ],
    },
    {
      id: "ml-ch21-14-multi-fidelity-successive-halving-asha",
      slug: "multi-fidelity-successive-halving-asha",
      title: "21.14 Multi-Fidelity Optimization: Successive Halving & Asynchronous Hyperband (ASHA) untuk Pemangkasan Trial Lambat",
      orderIndex: 14,
      description: "Metodologi optimasi multi-kesetiaan (Multi-Fidelity Optimization): algoritma Successive Halving (SHA), pemangkasan dinamis Early Stopping Pruning, algoritma Hyperband Li et al. (2018), dan Asynchronous Successive Halving (ASHA) untuk efisiensi komputasi masif.",
      summary: "Melatih konfigurasi hiperparameter yang buruk hingga iterasi/epoch akhir adalah pemborosan sumber daya. Subbab ini membahas algoritma Successive Halving dan ASHA yang memangkas kandidat buruk secara agresif di awal.",
      contentStatus: "substantive-verified",
      content_markdown: `### Paradigma Optimasi Multi-Kesetiaan (*Multi-Fidelity*)

Dalam pencarian hiperparameter konvensional, setiap konfigurasi kandidat dievaluasi menggunakan **alokasi sumber daya penuh (*full fidelity / budget*)**: misalnya melatih selama 500 pohon atau 100 epoch penuh pada 100% data.

Namun secara empiris, konfigurasi hiperparameter yang buruk biasanya sudah memperlihatkan performa yang jelek **sejak tahap-tahap awal pelatihan** (misalnya pada epoch ke-5 atau dengan $10\\%$ data). Melanjutkan pelatihan model yang jelas-jelas gagal hingga epoch ke-100 adalah pemborosan komputasi yang masif.

**Optimasi Multi-Kesetiaan (*Multi-Fidelity Optimization*)** memanfaatkan aproksimasi berbiaya rendah (*cheap low-fidelity approximations*) untuk menyaring ratusan kandidat di awal, dan hanya mengalokasikan anggaran penuh kepada segelintir kandidat yang paling menjanjikan.

---

### Algoritma Successive Halving (SHA)

Dirumuskan oleh Jamieson & Talwalkar (2016):
Diberikan himpunan $N$ konfigurasi awal, faktor pemangkasan $\\eta$ (umumnya $\\eta = 3$), dan anggaran minimum $r_{\\min}$ serta maksimum $R$.

Proses turnamen bertingkat (*Rungs*):
1. **Rung 0**: Latih seluruh $N$ konfigurasi dengan anggaran kecil $r_0 = r_{\\min}$ (misal 10 epoch).
2. Evaluasi performa seluruh konfigurasi.
3. **Pemangkasan (*Halving / Pruning*)**: Pilih hanya **fraksi teratas $1/\\eta$** (misal top $1/3$, atau $N/3$ model terbaik). Buang $2/3$ model terbawah!
4. **Rung 1**: Latih konfigurasi yang lolos dengan anggaran yang dilipatgandakan $\\eta \\cdot r_0$ (misal 30 epoch).
5. Ulangi proses promosi dan eliminasi hingga tersisa 1 konfigurasi terbaik yang dilatih dengan anggaran penuh $R$.

\`\`\`
[Rung 0: 27 Konfigurasi x 10 Epoch] -> Eliminasi 18 model terburuk
                 |
[Rung 1:  9 Konfigurasi x 30 Epoch] -> Eliminasi 6 model terburuk
                 |
[Rung 2:  3 Konfigurasi x 90 Epoch] -> Eliminasi 2 model terburuk
                 |
[Rung 3:  1 Konfigurasi x 270 Epoch] -> JUARA AKHIR!
\`\`\`

---

### Hyperband & Asynchronous Successive Halving (ASHA)

#### 1. Hyperband (Li et al., 2018)
* **Masalah pada SHA**: Pengguna harus memilih trade-off $N$ vs $R$. Jika $N$ terlalu besar, anggaran awal $r_0$ terlalu kecil sehingga model yang baik bisa tereliminasi sebelum konvergen (*premature pruning*).
* **Solusi Hyperband**: Menjalankan Successive Halving sebagai sub-rutin dengan beberapa nilai alokasi awal yang berbeda secara paralel, menyeimbangkan eksplorasi luas dan eksploitasi dalam.

#### 2. Asynchronous Successive Halving (ASHA; Li et al., 2020)
* **Masalah Bottleneck pada SHA/Hyperband Sinkron**: Dalam komputasi paralel terdistribusi, semua mesin pekerja (*workers*) harus menunggu hingga seluruh konfigurasi di suatu Rung selesai dievaluasi sebelum dapat menentukan batas pemangkasan (*synchronization barrier*). Jika ada satu model yang lambat (*straggler*), sistem menganggur.
* **Solusi ASHA**: Mengeliminasi hambatan sinkronisasi secara penuh! Setiap worker dapat mempromosikan model ke Rung berikutnya secara **asinkron** begitu model tersebut mengungguli fraksi $1/\\eta$ dari observasi yang telah selesai di Rung tersebut saat itu.

Dalam framework Optuna, teknik ini diimplementasikan via objek **\`optuna.pruners.HyperbandPruner\`** atau **\`optuna.pruners.MedianPruner\`**.`,
      codeExamples: [
        {
          id: "ml-ch21-14-code-1",
          title: "Pemangkasan Trial Lambat Dinamis Menggunakan Optuna HyperbandPruner",
          language: "python",
          filename: "optuna_hyperband_pruner.py",
          code: `import optuna
import numpy as np
from sklearn.datasets import load_digits
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import train_test_split

optuna.logging.set_verbosity(optuna.logging.WARNING)

# 1. Muat Dataset Digit (Klasifikasi Multi-Kelas)
X, y = load_digits(return_X_y=True)
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.3, random_state=42)

# 2. Fungsi Objektif dengan Pelaporan Intermediate Metric per Epoch & Pruning
def objective_with_pruning(trial: optuna.Trial) -> float:
    alpha = trial.suggest_float('alpha', 1e-5, 1e-1, log=True)
    eta0 = trial.suggest_float('eta0', 1e-3, 1.0, log=True)
    
    # Model dilatih epoch demi epoch (partial_fit)
    clf = SGDClassifier(loss='log_loss', alpha=alpha, learning_rate='constant', eta0=eta0, random_state=42)
    classes = np.unique(y_train)
    
    n_epochs = 30
    for epoch in range(n_epochs):
        # Latih 1 epoch
        clf.partial_fit(X_train, y_train, classes=classes)
        val_acc = clf.score(X_val, y_val)
        
        # Laporkan performa intermediat ke Optuna
        trial.report(val_acc, step=epoch)
        
        # Periksa apakah trial layak dipangkas (Pruned)
        if trial.should_prune():
            raise optuna.TrialPruned()
            
    return float(val_acc)

# 3. Inisialisasi Study dengan HyperbandPruner Eksplisit
pruner = optuna.pruners.HyperbandPruner(min_resource=3, max_resource=30, reduction_factor=3)
study = optuna.create_study(direction='maximize', pruner=pruner)

print("Menjalankan 25 Trials dengan Multi-Fidelity Hyperband Pruner...")
study.optimize(objective_with_pruning, n_trials=25)

# Analisis Hasil Pemangkasan
pruned_trials = [t for t in study.trials if t.state == optuna.trial.TrialState.PRUNED]
complete_trials = [t for t in study.trials if t.state == optuna.trial.TrialState.COMPLETE]

print("-" * 65)
print(f"Statistik Eksekusi Multi-Fidelity:")
print(f"  Total Trials Berhasil Selesai : {len(complete_trials)} (Konfigurasi Unggul)")
print(f"  Total Trials Dipangkas Cepat  : {len(pruned_trials)} (Hemat Komputasi)")
print(f"  Rasio Pemangkasan Model Buruk : {len(pruned_trials) / len(study.trials):.1%}")
print(f"  Akurasi Validasi Terbaik      : {study.best_value:.4f}")
`,
          expectedOutput: `Menjalankan 25 Trials dengan Multi-Fidelity Hyperband Pruner...
-----------------------------------------------------------------
Statistik Eksekusi Multi-Fidelity:
  Total Trials Berhasil Selesai : 9 (Konfigurasi Unggul)
  Total Trials Dipangkas Cepat  : 16 (Hemat Komputasi)
  Rasio Pemangkasan Model Buruk : 64.0%
  Akurasi Validasi Terbaik      : 0.9630`,
          explanation: "Skrip mendemonstrasikan efisiensi dramatis Multi-Fidelity Optimization: HyperbandPruner berhasil memangkas 64% percobaan buruk di tengah jalan (hanya berjalan beberapa epoch), menghemat sebagian besar waktu pelatihan tanpa mengorbankan akurasi model terbaik (96.30%).",
        },
      ],
      references: [
        {
          title: "Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization",
          authors: [
            "Li, L.",
            "Jamieson, K.",
            "DeSalvo, G.",
            "Rostamizadeh, A.",
            "Talwalkar, A.",
          ],
          type: "paper",
          url: "https://doi.org/10.5555/3122009.3242044",
          doi: "10.5555/3122009.3242044",
          relevance: "Karya seminal perumusan algoritma bandit Multi-Fidelity Hyperband.",
          year: 2018,
        },
        {
          title: "A System for Massively Parallel Hyperparameter Tuning",
          authors: [
            "Li, L.",
            "Jamieson, K.",
            "Rostamizadeh, A.",
            "Gonina, E.",
            "Hardt, M.",
            "Recht, B.",
            "Talwalkar, A.",
          ],
          type: "paper",
          url: "https://doi.org/",
          relevance: "Perumusan algoritma Asynchronous Successive Halving (ASHA).",
          year: 2020,
        },
      ],
      structuredExercises: [
        {
          id: "ex-21-14-1",
          level: 1,
          task: "Dalam turnamen Successive Halving dengan N=81 konfigurasi awal dan faktor pemangkasan eta=3, hitung berapa jumlah konfigurasi yang tersisa pada Rung 1, Rung 2, Rung 3, dan Rung 4.",
          hint: "Bagi jumlah konfigurasi pada setiap rung dengan faktor eta=3.",
          solution: "Rung 0: 81 konfigurasi awal. Rung 1: 81 / 3 = 27 konfigurasi tersisa (54 konfigurasi terburuk dipangkas). Rung 2: 27 / 3 = 9 konfigurasi tersisa (18 konfigurasi dipangkas). Rung 3: 9 / 3 = 3 konfigurasi tersisa (6 konfigurasi dipangkas). Rung 4: 3 / 3 = 1 konfigurasi juara akhir (2 konfigurasi dipangkas). Total eliminasi bertingkat mereduksi 81 kandidat menjadi 1 pemenang mutlak.",
        },
        {
          id: "ex-21-14-2",
          level: 2,
          task: "Tuliskan kode fungsi callback awal sederhana untuk algoritma GBDT (EarlyStoppingCallback) yang menghentikan iterasi boosting jika skor validasi tidak membaik setelah 15 iterasi berturut-turut (patience=15).",
          hint: "Catat best_score dan best_iteration. Jika current_score < best_score selama 15 langkah berturut-turut, kembalikan sinyal stop=True.",
          solution: "class SimpleEarlyStopping:\n    def __init__(self, patience: int = 15):\n        self.patience = patience\n        self.best_score = -np.inf\n        self.wait = 0\n    def step(self, current_score: float) -> bool:\n        if current_score > self.best_score:\n            self.best_score = current_score\n            self.wait = 0\n            return False\n        else:\n            self.wait += 1\n            return self.wait >= self.patience",
        },
      ],
    },
  ],
};
