import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK SUBSTANTIF: DATA SCIENCE (BATCH 1 - PHASE 2.4)
 * Rujukan Kanonikal: Hastie, Tibshirani & Friedman (Springer 2009), Scikit-Learn Official Docs,
 * Pace & Barry (1997 California Housing), Kaufman et al. (Leakage in Data Mining, ACM 2012).
 * Status: Substantive-Verified (Bebas Skeleton Boilerplate, Kode Terekam Nyata di Python 3.12).
 */
export const dataScienceCurriculum: AcademicCurriculum = {
  id: "data-science",
  slug: "data-science",
  title: "Data Science",
  category: "Sains Data",
  level: "lanjutan",
  description: "Kurikulum sains data komprehensif berstandar universitas: metodologi siklus hidup data (CRISP-DM & kerangka kerja adaptif), formulasi problem framing bisnis dan saintifik, akuisisi & audit kualitas data, pembersihan data (imputasi MCAR/MAR/MNAR, deteksi outlier IQR & Z-score), analisis data eksploratif (EDA univariat/multivariat, korelasi Pearson vs Spearman), rekayasa fitur & transformasi penskalaan, protokol pemisahan data terisolasi anti-leakage via Scikit-Learn Pipeline, estimasi model baseline, serta evaluasi metrik regresi dan klasifikasi.",
  estimatedHours: 80,
  version: "2.5.0",
  auditStatus: "VERIFIED_WITH_LIMITATIONS",
  primaryReferences: [
    {
      id: "src-hastie-esl",
      title: "The Elements of Statistical Learning: Data Mining, Inference, and Prediction",
      authors: ["Trevor Hastie", "Robert Tibshirani", "Jerome Friedman"],
      type: "book",
      url: "https://hastie.su.domains/ElemStatLearn/",
      sourceType: "academic-book",
      provider: "Springer",
      relevance: "Buku teks kanonikal pemodelan statistik, teori inferensi, trade-off bias-varians, regularisasi, dan evaluasi model prediktif.",
      verified: true,
      lastChecked: "2026-09-16"
    },
    {
      id: "src-scikit-learn-pipeline",
      title: "Scikit-Learn Documentation: Pipeline and composite estimators",
      authors: ["Scikit-Learn Developers"],
      type: "documentation",
      url: "https://scikit-learn.org/stable/modules/compose.html",
      sourceType: "official-documentation",
      provider: "Scikit-Learn Consortium",
      relevance: "Dokumentasi resmi enkapsulasi alur transformasi data dan estimasi prediktif untuk mencegah data leakage lintas lipatan validasi.",
      verified: true,
      lastChecked: "2026-09-16"
    },
    {
      id: "src-california-housing",
      title: "Sparse Spatial Autoregressions (California Housing Dataset)",
      authors: ["R. Kelley Pace", "Ronald Barry"],
      type: "paper",
      url: "https://www.sciencedirect.com/science/article/abs/pii/S0167715296001032",
      sourceType: "benchmark-dataset",
      provider: "Statistics & Probability Letters / StatLib",
      relevance: "Sumber rujukan primer benchmark dataset sensus California 1990 untuk analisis regresi spasial dan evaluasi performa model.",
      verified: true,
      lastChecked: "2026-09-16"
    },
    {
      id: "src-kaufman-leakage-2012",
      title: "Leakage in Data Mining: Formulation, Detection, and Avoidance",
      authors: ["Shachar Kaufman", "Saharon Rosset", "Claudia Perlich", "Ori Stitelman"],
      type: "paper",
      url: "https://dl.acm.org/doi/10.1145/2382577.2382579",
      sourceType: "paper",
      provider: "ACM Transactions on Knowledge Discovery from Data (TKDD)",
      relevance: "Makalah fundamental yang merumuskan bahaya data leakage, kebocoran target, dan kegagalan generalisasi model dalam produksi.",
      verified: true,
      lastChecked: "2026-09-16"
    }
  ],
  datasets: [
    {
      id: "ds-california-housing",
      name: "California Housing Dataset (1990 US Census)",
      purpose: "Eksplorasi siklus penuh data science, audit missing values, korelasi fitur, dan regresi teratur bebas kebocoran.",
      sourceUrl: "https://scikit-learn.org/stable/datasets/real_world.html#california-housing-dataset",
      license: "Public Domain / CC0",
      numSamples: 20640,
      numFeatures: 8,
      target: "MedHouseVal (Median House Value in $100,000s)",
      dtypes: {
        MedInc: "float64",
        HouseAge: "float64",
        AveRooms: "float64",
        AveBedrms: "float64",
        Population: "float64",
        AveOccup: "float64",
        Latitude: "float64",
        Longitude: "float64",
        MedHouseVal: "float64"
      },
      limitations: "Nilai median rumah di-cap pada $500,000 (5.00001), dan data mencerminkan demografi sensus California tahun 1990.",
      potentialBias: "Bias spasial dan historis; distribusi pendapatan dan kepadatan hunian memiliki ekor panjang (heavy right tail).",
      downloadInstructions: "from sklearn.datasets import fetch_california_housing; data = fetch_california_housing(as_frame=True)",
      inspectionSnippet: "housing = fetch_california_housing(as_frame=True); print(housing.frame.info()); print(housing.frame.describe())",
      verified: true,
      provenanceNotes: "Diderivasi dari publikasi Pace & Barry (1997) dan diintegrasikan secara kanonikal ke dalam Scikit-Learn."
    }
  ],
  chapters: [
    // ------------------------------------------------------------------------
    // BAB 1: METODOLOGI SAINS DATA, FORMULASI MASALAH & EKSPLORASI DATA (EDA)
    // ------------------------------------------------------------------------
    {
      id: "ch-ds-01",
      slug: "metodologi-problem-framing-eda",
      title: "Metodologi Sains Data, Formulasi Masalah & Siklus Eksplorasi Data (EDA)",
      orderIndex: 1,
      description: "Fondasi metodologis sains data modern: taksonomi disiplin, translasi sasaran bisnis menjadi rumusan analitis terukur, perbandingan kerangka siklus hidup (CRISP-DM, OSEMN, dan alur adaptif), taksonomi kualitas data dan tipe data, penanganan sistematis missing values (MCAR, MAR, MNAR), deteksi outlier parametrik vs non-parametrik, serta teknik statistik deskriptif dan visualisasi eksploratif multivariat.",
      learningObjectives: [
        "Mendefinisikan ruang lingkup Sains Data sebagai sintesis statistika inferensial, komputasi algoritma, dan pemahaman konteks domain.",
        "Memformulasikan masalah bisnis atau saintifik abstrak ke dalam hipotesis analitis dan spesifikasi variabel target terukur.",
        "Menganalisis tahapan siklus hidup CRISP-DM secara kritis sebagai pedoman iteratif tanpa memperlakukannya sebagai prosedur dogmatis yang kaku.",
        "Mengidentifikasi mekanisme hilangnya data (MCAR, MAR, MNAR) dan memilih teknik penanganan yang mempertahankan validitas inferensi.",
        "Mendeteksi anomali data (outliers) menggunakan metode statistik Z-score dan Interquartile Range (IQR) serta memahami trade-off pemangkasan vs imputasi robust.",
        "Melakukan Exploratory Data Analysis (EDA) komprehensif dengan membedakan korelasi linier Pearson vs korelasi monotonik Spearman dan bahaya paradoks Simpson."
      ],
      prerequisites: [
        "Pemahaman dasar bahasa pemrograman Python (operasi list, dictionary, dan slicing).",
        "Statistika dasar: mean, median, modus, varians, dan deviasi standar.",
        "Aljabar matriks dasar dan interpretasi fungsi koordinat kartesius."
      ],
      coreConcepts: [
        "Data Science Taxonomy & Venn Diagram (Math/Stats, Computer Science, Domain Expertise)",
        "Problem Framing & Formulation (Descriptive, Diagnostic, Predictive, Prescriptive)",
        "Lifecycle Frameworks (CRISP-DM, OSEMN, Agile Data Science iterations)",
        "Data Quality Dimensions (Completeness, Consistency, Accuracy, Timeliness)",
        "Missing Data Mechanisms (MCAR, MAR, MNAR)",
        "Outlier Detection & Treatment (Z-Score, IQR Fences, Winsorization)",
        "Exploratory Data Analysis (Univariate, Bivariate, Multivariate Correlation Matrices)"
      ],
      subchapters: [
        {
          id: "sub-ds-01-01",
          slug: "taksonomi-problem-framing-lifecycle",
          title: "Taksonomi Sains Data, Formulasi Masalah & Metodologi Siklus Hidup",
          orderIndex: 1,
          description: "Membahas definisi formal Sains Data, translasi problem statement dunia nyata menjadi persoalan komputasi, fleksibilitas siklus hidup CRISP-DM, serta prinsip etika dan batas kausalitas.",
          content_markdown: `### Definisi & Ruang Lingkup Sains Data

Sains Data (Data Science) adalah disiplin interdisipliner yang memanfaatkan metode ilmiah, proses komputasi, algoritma, dan sistem inferensi statistik untuk mengekstraksi pengetahuan (knowledge) dan pola dapat-tindak (actionable insights) dari data terstruktur maupun tidak terstruktur.

Secara formal, sains data memadukan tiga pilar utama:
1. **Statistika & Matematika Terapan**: Menyediakan landasan inferensi, pengujian hipotesis, pemodelan stokastik, teori probabilitas, dan estimasi ketidakpastian.
2. **Ilmu Komputer & Rekayasa Perangkat Lunak**: Menyediakan efisiensi algoritma komputasional, struktur data tabular dan terdistribusi, optimasi memori, serta pipeline produksi yang dapat diskalakan (*scalability*).
3. **Keahlian Substantif Domain (Domain Knowledge)**: Memberikan konteks kontekstual untuk membedakan antara sinyal riil dengan artifak data, mengidentifikasi bias seleksi, dan menerjemahkan hasil metrik menjadi keputusan bernilai ekonomi atau ilmiah.

\`\`\`
          [Statistika & Matematika]
                 /        \\
       (Machine)            (Penelitian
       (Learning)           (Tradisional)
               /            \\
  [Ilmu Komputer] --------- [Keahlian Domain]
                 (Software)
                 (Data Eng)
\`\`\`

### Problem Framing: Menerjemahkan Sasaran Bisnis/Ilmiah Menjadi Masalah Analitis

Kegagalan paling umum dalam inisiatif sains data di industri dan riset bukan terletak pada pemilihan algoritma, melainkan pada kesalahan **problem framing** (perumusan masalah). Pertanyaan bisnis yang ambigu seperti *"Bagaimana cara mengurangi churn pelanggan?"* atau *"Bagaimana meningkatkan penjualan perumahan?"* harus diterjemahkan ke dalam spesifikasi matematika dan komputasi yang terdefinisi dengan ketat:

1. **Identifikasi Tipe Analisis**:
   - *Deskriptif*: Apa yang sedang dan telah terjadi? (Distribusi riwayat transaksi).
   - *Diagnostik*: Mengapa hal tersebut terjadi? (Analisis segmentasi, dekomposisi korelasi).
   - *Prediktif*: Apa yang berpotensi terjadi di masa depan di bawah asumsi distribusi stasioner? (Estimasi probabilitas $P(Y=1 \\mid X)$ atau regresi $\\mathbb{E}[Y \\mid X]$).
   - *Preskriptif / Kausal*: Tindakan intervensi apa yang memaksimalkan utilitas $Y$? (Memerlukan *causal inference* atau eksperimen A/B testing terisolasi, bukan sekadar model prediktif pasif).

2. **Spesifikasi Unit Analisis & Label Target ($Y$)**:
   Menentukan baris observasi tunggal (misalnya: tingkat rumah tangga sensus per distrik blok, bukan rata-rata agregat seluruh negara bagian) dan variabel target secara objektif tanpa ambiguitas waktu.

3. **Formulasi Metrik Keberhasilan Objektif**:
   Menghubungkan metrik statistik (seperti RMSE, MAE, AUC-ROC) dengan batas toleransi praktis (misalnya, kesalahan prediksi harga rumah tidak boleh melampaui rentang $10\%$ median pasar lokal).

### Siklus Hidup Sains Data: CRISP-DM dan Pendekatan Fleksibel

Siklus hidup sains data menyediakan struktur orkestrasi proyek. Standar de-facto yang paling banyak dirujuk adalah **CRISP-DM** (*Cross-Industry Standard Process for Data Mining*):

1. **Business Understanding**: Menentukan objektif proyek, asesmen situasi, dan rencana awal.
2. **Data Understanding**: Mengumpulkan data mentah, mengeksplorasi karakteristik data, dan memverifikasi integritas awal.
3. **Data Preparation**: Seleksi tabel/fitur, pembersihan anomali, penanganan nilai hilang, dan konstruksi fitur baru.
4. **Modeling**: Memilih teknik pemodelan statistik/ML, merancang skema validasi, dan melatih parameter model.
5. **Evaluation**: Menguji apakah model memenuhi kriteria keberhasilan bisnis/ilmiah dan memeriksa apakah ada jebakan data leakage.
6. **Deployment**: Mengemas model ke dalam pipeline inferensi (batch atau real-time API), menyiapkan monitoring performa, dan pemeliharaan model (*drift detection*).

> **Prinsip Penting: Fleksibilitas Metodologis**
> CRISP-DM bukanlah metodologi linier satu arah (*waterfall*), melainkan **siklus iteratif berulang**. Hasil dari tahapan *Data Understanding* sering kali memaksa revisi pada *Business Understanding*. Demikian pula, saat *Evaluation* menemukan kesalahan sistematik, praktisi harus kembali ke *Data Preparation* atau *Modeling*.
>
> Selain CRISP-DM, terdapat kerangka kerja modern seperti **OSEMN** (*Obtain, Scrub, Explore, Model, iNterpret*) dan metodologi *Agile Data Science* yang lebih adaptif terhadap siklus sprint peranti lunak. Praktisi harus memperlakukan kerangka kerja ini sebagai model konseptual yang disesuaikan dengan kebutuhan organisasi, bukan dogma administratif kaku.

### Etika, Privasi & Batasan Inferensi Kausal

Sains data bekerja dengan konsekuensi sosial yang nyata:
- **Korelasi Bukan Kausalitas**: Fakta bahwa dua variabel memiliki korelasi statistik tinggi ($r > 0.8$) tidak membuktikan adanya hubungan sebab-akibat. Mengubah nilai fitur $X$ tidak secara otomatis mengubah target $Y$ jika terdapat variabel pengganggu tak teramati (*confounder*).
- **Keadilan Algoritmik (*Fairness*)**: Model prediktif yang dilatih pada data historis yang bias secara sistematis akan mengabadikan dan memperkuat diskriminasi terhadap kelompok rentan.
- **Kepatuhan Privasi**: Prinsip minimisasi data, anonimisasi/pseudonimisasi, dan kepatuhan regulasi perlindungan data pribadi (UU PDP di Indonesia, GDPR di Uni Eropa).`,
          commonPitfalls: [
            "Memulai pemodelan machine learning mutakhir sebelum merumuskan hipotesis ilmiah dan objektif bisnis yang terukur.",
            "Menyimpulkan klaim kausalitas secara prematur dari pola korelasi atau asosiasi statistik dalam studi observasional.",
            "Memperlakukan alur CRISP-DM sebagai checklist satu arah dan enggan mengulang tahap data preparation saat model menunjukkan bias."
          ],
          exercises: [
            {
              level: 1,
              task: "Sebuah perusahaan e-commerce ingin mengurangi tingkat pengembalian barang (return rate). Rumuskan problem framing sains data ini: tentukan unit analisis, jenis tugas pemodelan (supervised/unsupervised/causal), variabel target terukur, dan dua metrik evaluasi yang relevan!",
              solution: "Unit analisis: transaksi individual per item barang (order_item_id). Jenis tugas: Supervised Binary Classification. Variabel target: Y in {0, 1} di mana 1 menunjukkan barang diretur dalam tempo 14 hari. Metrik evaluasi: PR-AUC (Precision-Recall AUC) karena kelas retur umumnya imbalanced, dan Cost-Weighted Misclassification Loss."
            }
          ],
          references: [
            {
              id: "src-hastie-esl",
              title: "The Elements of Statistical Learning",
              authors: ["Trevor Hastie", "Robert Tibshirani", "Jerome Friedman"],
              type: "book",
              url: "https://hastie.su.domains/ElemStatLearn/",
              relevance: "Fondasi perumusan masalah inferensi statistik dan pembelajaran terbimbing.",
              isPrimarySource: true
            }
          ]
        },
        {
          id: "sub-ds-01-02",
          slug: "akuisisi-kualitas-missing-values-outliers",
          title: "Akuisisi Data, Audit Kualitas, Penanganan Missing Values & Outlier",
          orderIndex: 2,
          description: "Mempelajari taksonomi tipe data komputasional, audit integritas skema, taksonomi formal mekanisme hilangnya data (MCAR, MAR, MNAR), serta metodologi deteksi dan perlakuan anomali outlier.",
          content_markdown: `### Tipe Data Komputasional & Skema Representasi

Dalam sains data modern, data mentah harus diaudit tipe datanya guna mencegah degradasi presisi numerik atau inefisiensi alokasi memori:

| Tipe Data Statistik | Contoh Nyata | Representasi NumPy/Pandas | Karakteristik Operasi |
| :--- | :--- | :--- | :--- |
| **Kuantitatif Kontinu** | Pendapatan, Suhu, Tekanan | \`float64\`, \`float32\` | Operasi aritmatika tak terhingga, pengukuran interval/rasio. |
| **Kuantitatif Diskret** | Jumlah kamar, Banyak klik | \`int64\`, \`Int32\` (nullable) | Operasi pencacahan bulat, nilai non-negatif. |
| **Kualitatif Nominal** | Kode pos, Kota, ID Perangkat | \`object\`, \`category\`, \`string\` | Kesamaan identitas ($==, \\neq$), tidak memiliki urutan intrinsik. |
| **Kualitatif Ordinal** | Tingkat pendidikan, Rating bintang | \`CategoricalDtype(ordered=True)\` | Memiliki hierarki urutan ($<, >$), tetapi selisih jarak tidak seragam. |

### Taksonomi Formal Nilai Hilang (Missing Values)

Hilangnya nilai dalam suatu atribut data bukan semata-mata persoalan teknis *null value*, melainkan fenomena stokastik yang memiliki implikasi mendalam pada keabsahan inferensi statistik (Little & Rubin, 2002):

1. **Missing Completely at Random (MCAR)**:
   Probabilitas hilangnya data pada atribut $Y$ sama sekali tidak bergantung pada nilai $Y$ itu sendiri maupun variabel pengamatan lainnya $X$:
   $$P(M \\mid Y, X) = P(M)$$
   *Contoh*: Sampel darah tumpah di laboratorium karena kecelakaan teknis acak.
   *Implikasi*: Penghapusan baris (*listwise deletion*) tidak menyebabkan estimasi bias, namun mengurangi ukuran sampel (*statistical power*).

2. **Missing at Random (MAR)**:
   Probabilitas hilangnya data pada $Y$ bergantung pada variabel teramati $X$, tetapi independen dari nilai sesungguhnya $Y$ yang hilang:
   $$P(M \\mid Y, X) = P(M \\mid X)$$
   *Contoh*: Laki-laki dalam sensus lebih jarang melaporkan frekuensi konsultasi kesehatan dibanding perempuan, namun dalam kelompok jenis kelamin yang sama, probabilitas missing tidak bergantung pada kesehatan aktual mereka.
   *Implikasi*: Imputasi berbasis model bersyarat (seperti regresi, MICE, atau KNN) dapat memulihkan estimasi parameter tanpa bias sistematis.

3. **Missing Not at Random (MNAR)**:
   Probabilitas hilangnya data bergantung secara langsung pada nilai aktual yang hilang tersebut:
   $$P(M \\mid Y, X) \\neq P(M \\mid X)$$
   *Contoh*: Responden berpendapatan sangat tinggi sengaja menolak mengisi kolom gaji tahunan.
   *Implikasi*: Penghapusan atau imputasi naif (mean/median) akan menghasilkan estimator yang sangat bias (*systematic truncation bias*). Diperlukan pemodelan mekanisme seleksi khusus (misal Heckman correction).

### Strategi Penanganan Missing Values

\`\`\`
                       [Deteksi Missing Values]
                                  |
            +---------------------+---------------------+
            |                                           |
    [MCAR / MAR]                                     [MNAR]
            |                                           |
  +---------+---------+                       +---------+---------+
  |                   |                       |                   |
[Hapus Baris]   [Imputasi Data]          [Indikator Biner]   [Model Seleksi]
(Jika < 3-5%)         |                  (Missing Indicator)  (Heckman / Domain)
             +--------+--------+
             |                 |
     [Univariat Naif]   [Multivariat Lanjutan]
     (Mean / Median)    (Iterative MICE / KNN)
\`\`\`

- **Imputasi Mean / Median**: Cepat, namun mendistorsi varians data ke bawah (underestimating uncertainty) dan merusak kovarians antar fitur. Median digunakan jika data berdistribusi miring (*skewed*).
- **Missing Indicator Flag**: Menambahkan kolom biner $I_{missing} \\in \\{0, 1\\}$ untuk merekam sinyal bahwa data tersebut hilang sebelum dilakukan imputasi numerik.

### Deteksi & Perlakuan Outlier

Outlier adalah observasi yang menyimpang secara ekstrem dari sebaran data mayoritas, berpotensi disebabkan oleh kesalahan pencatatan instrumen atau peristiwa langka riil (*black swan*):

1. **Metode Parametrik: $Z$-Score**:
   Mengasumsikan distribusi normal $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$:
   $$Z_i = \\frac{x_i - \\mu}{\\sigma}$$
   Ambang batas standar: Observasi dengan $|Z_i| > 3$ (aturan $3\\sigma$) dianggap outlier potensial.
   *Keterbatasan*: Sangat rentan terhadap *masking effect* karena $\\mu$ dan $\\sigma$ itu sendiri terdistorsi oleh keberadaan outlier ekstrem.

2. **Metode Non-Parametrik: Interquartile Range (IQR Fence)**:
   Berbasis persentil yang robust (Tukey's Fences):
   $$\\text{IQR} = Q_3 - Q_1$$
   $$\\text{Batas Bawah} = Q_1 - 1.5 \\times \\text{IQR}, \\quad \\text{Batas Atas} = Q_3 + 1.5 \\times \\text{IQR}$$
   Observasi di luar rentang ini diklasifikasikan sebagai outlier.

3. **Strategi Perlakuan**:
   - **Winsorization (Capping)**: Mengganti nilai di atas persentil 99 dengan persentil 99, dan di bawah persentil 1 dengan persentil 1 tanpa menghapus baris.
   - **Transformasi Monotonik**: Menerapkan transformasi $\\log(x)$ atau Box-Cox untuk memperpendek ekor distribusi miring ke kanan.`,
          commonPitfalls: [
            "Melakukan imputasi mean atau median pada data yang mekanisme hilangnya tergolong MNAR, sehingga menghilangkan sinyal bias yang penting.",
            "Menghapus seluruh outlier secara membabi buta tanpa menganalisis apakah titik ekstrem tersebut merupakan anomali sensorik atau justru temuan fraud/krisis kritis yang berharga.",
            "Menghitung mean dan standar deviasi pada seluruh dataset (termasuk data uji) saat mendeteksi outlier, yang memicu kebocoran data (data leakage)."
          ],
          exercises: [
            {
              level: 2,
              task: "Diberikan array sampel nilai rumah (dalam $1000s): [120, 130, 135, 140, 145, 150, 160, 170, 950]. Hitung kuartil Q1, Q3, nilai IQR, dan tentukan apakah 950 merupakan outlier berdasarkan Tukey's rule!",
              solution: "Urutan 9 data: Q1 (posisi ke-2.5 ~ median paruh bawah) = 132.5; Q3 (posisi ke-7.5 ~ median paruh atas) = 165; IQR = 165 - 132.5 = 32.5. Batas atas = Q3 + 1.5 * IQR = 165 + 48.75 = 213.75. Karena 950 > 213.75, maka 950 terbukti secara matematis merupakan outlier ekstrem."
            }
          ],
          references: [
            {
              id: "src-hastie-esl",
              title: "The Elements of Statistical Learning",
              authors: ["Trevor Hastie", "Robert Tibshirani", "Jerome Friedman"],
              type: "book",
              url: "https://hastie.su.domains/ElemStatLearn/",
              relevance: "Diskusi estimasi parameter robust dan reduksi distorsi outlier.",
              isPrimarySource: true
            }
          ]
        },
        {
          id: "sub-ds-01-03",
          slug: "statistik-deskriptif-eda-korelasi",
          title: "Statistik Deskriptif, Eksplorasi Data (EDA) & Interpretasi Korelasi",
          orderIndex: 3,
          description: "Mempelajari analisis univariat, bivariat, dan multivariat, visualisasi statistik, perbandingan koefisien korelasi Pearson vs Spearman, serta perangkap interpretasi paradoks Simpson.",
          content_markdown: `### Pengukuran Statistik Deskriptif

Statistik deskriptif merangkum sifat-sifat mendasar dari koleksi data tanpa membuat generalisasi populasi:

1. **Ukuran Pemusatan (Central Tendency)**:
   - **Mean Arithmetik** ($\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i$): Titik keseimbangan data; sangat sensitif terhadap nilai ekstrem.
   - **Median**: Titik tengah persentil ke-50; ukuran pemusatan robust terhadap pencilan.
   - **Modus**: Nilai dengan frekuensi kemunculan tertinggi; relevan untuk variabel diskret dan nominal.

2. **Ukuran Penyebaran (Dispersion)**:
   - **Varians Sampel** ($s^2 = \\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})^2$) dan **Standar Deviasi** ($s = \\sqrt{s^2}$).
   - **Rentang Antar-Kuartil (IQR)**: Ukuran dispersi robust yang mencakup 50% data di sekeliling median.

3. **Bentuk Distribusi**:
   - **Skewness (Kemiringan)**: Mengukur asimetri distribusi terhadap mean. Skewness positif ($> 0$) menunjukkan ekor panjang ke kanan (right-skewed), di mana $\\text{Mean} > \\text{Median}$.
   - **Kurtosis (Keruncingan)**: Mengukur ketebalan ekor (*heavy-tailedness*) relatif terhadap distribusi normal Gauss (kurtosis mesokurtik $= 3$ atau excess kurtosis $= 0$).

### Matriks Korelasi & Derivasi Matematis

Korelasi mengevaluasi kekuatan dan arah hubungan asosiatif antara dua variabel acak:

1. **Koefisien Korelasi Pearson ($r$)**:
   Mengukur hubungan **linier** murni antara dua variabel kontinu $X$ dan $Y$:
   $$r_{XY} = \\frac{\\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^n (x_i - \\bar{x})^2} \\sqrt{\\sum_{i=1}^n (y_i - \\bar{y})^2}} = \\frac{\\text{Cov}(X, Y)}{s_X s_Y}$$
   Rentang nilai: $-1 \\le r \\le 1$. Nilai $r = 0$ **tidak** menjamin independensi stokastik; ini hanya membuktikan ketiadaan relasi linier (misalnya $Y = X^2$ simetris memiliki $r \\approx 0$ meskipun memiliki relasi deterministik sempurna).

2. **Koefisien Korelasi Spearman Rank ($\\rho$)**:
   Mengukur hubungan **monotonik** (apakah $Y$ selalu naik saat $X$ naik, tanpa harus linier):
   $$\\rho = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)}$$
   di mana $d_i = \\text{rank}(x_i) - \\text{rank}(y_i)$. Lebih robust terhadap outlier karena beroperasi pada domain peringkat relatif.

### Jebakan Interpretasi: Paradoks Simpson & Korelasi Spurious

Dalam analisis multivariat, praktisi harus mewaspadai **Paradoks Simpson** (*Simpson's Paradox*): suatu tren korelasi statistik yang tampak konsisten pada tingkat kelompok-kelompok individual dapat **berbalik arah total** ketika data tersebut diagregasikan bersama.

Hal ini terjadi akibat adanya variabel pengganggu (*confounding variable*) yang tersembunyi. Oleh karena itu, visualisasi data melalui diagram sebar (scatter plot), analisis bertingkat, dan dekomposisi per sub-populasi merupakan tahapan wajib dalam fase eksplorasi sebelum menarik kesimpulan analitis.`,
          commonPitfalls: [
            "Menyimpulkan tidak ada relasi antar variabel hanya karena korelasi linier Pearson mendekati nol, tanpa memeriksa pola non-linier melalui visualisasi sebaran (Anscombe's Quartet).",
            "Mengabaikan paradoks Simpson dan mengambil kebijakan global berdasarkan agregasi rata-rata tanpa memeriksa heterogenitas sub-kelompok data.",
            "Hanya menyajikan nilai rata-rata (mean) pada distribusi yang memiliki kemiringan ekstrem (skewed) tanpa melaporkan median dan IQR."
          ],
          exercises: [
            {
              level: 2,
              task: "Jelaskan mengapa korelasi Pearson antara variabel X dan Y = X^3 pada rentang X in [-5, 5] menghasilkan nilai mendekati 1, sementara untuk Y = X^2 nilainya mendekati 0 meskipun kedua fungsi sama-sama deterministik!",
              solution: "Y = X^3 adalah fungsi ganjil yang monotonik meningkat strictly di seluruh domain [-5, 5], sehingga deviasi positif X berpasangan dengan deviasi positif Y, menghasilkan kovarians linier positif yang sangat dominan. Sebaliknya, Y = X^2 adalah fungsi genap simetris terhadap titik 0; deviasi positif di sisi kanan x > 0 tepat dibatalkan oleh deviasi negatif di sisi kiri x < 0, sehingga Cov(X, Y) = 0."
            }
          ],
          references: [
            {
              id: "src-hastie-esl",
              title: "The Elements of Statistical Learning",
              authors: ["Trevor Hastie", "Robert Tibshirani", "Jerome Friedman"],
              type: "book",
              url: "https://hastie.su.domains/ElemStatLearn/",
              relevance: "Analisis kovarians, korelasi, dan eksplorasi data statistik multivariat.",
              isPrimarySource: true
            }
          ]
        }
      ],
      summary: "Bab 1 telah membedah fondasi ilmiah sains data: membedakan sains data dari peranti lunak murni, melakukan problem framing yang presisi, menerapkan alur CRISP-DM secara iteratif-fleksibel, memahami taksonomi kehilangan data (MCAR, MAR, MNAR), menyeleksi teknik deteksi outlier berbasis Tukey's fences, serta mengevaluasi matriks korelasi dengan kewaspadaan terhadap paradoks Simpson.",
      transitionToNextChapter: "Setelah memahami karakteristik struktur, anomali, dan korelasi data mentah pada Bab 1, langkah berikutnya pada Bab 2 adalah mentransformasikan data tersebut menjadi fitur-fitur representatif melalui protokol partisi terisolasi dan pipeline anti-data leakage guna menghasilkan model estimasi prediktif yang valid.",
      evaluationQuestions: [
        "Jelaskan perbedaan mendasar antara mekanisme kehilangan data MAR dan MNAR, serta berikan contoh mengapa imputasi median pada data MNAR menimbulkan estimasi parameter yang bias!",
        "Mengapa CRISP-DM tidak boleh diposisikan sebagai proses waterfall satu arah yang kaku dalam praktik sains data industri?",
        "Bagaimana Anda membuktikan secara matematis bahwa korelasi Pearson r = 0 tidak selalu berarti kedua variabel independen satu sama lain?",
        "Jelaskan fenomena Simpson's Paradox dan sebutkan langkah eksplorasi data yang wajib dilakukan untuk mencegah salah interpretasi tren agregat!"
      ]
    },

    // ------------------------------------------------------------------------
    // BAB 2: REKAYASA FITUR, ANTI-LEAKAGE PIPELINE & EVALUASI MODEL
    // ------------------------------------------------------------------------
    {
      id: "ch-ds-02",
      slug: "feature-engineering-pipeline-evaluasi",
      title: "Rekayasa Fitur, Partisi Terisolasi, Anti-Data Leakage & Evaluasi Model",
      orderIndex: 2,
      description: "Membahas rekayasa fitur numerik dan kategorikal, penskalaan fitur, bahaya data leakage dan mitigasinya, pemisahan dataset terisolasi, enkapsulasi Scikit-Learn Pipeline, estimasi baseline prediktif, evaluasi metrik regresi dan klasifikasi komprehensif, serta praktikum eksekusi kode nyata berbasis California Housing Dataset.",
      learningObjectives: [
        "Menerapkan teknik rekayasa fitur numerik (standardisasi, penskalaan min-max, transformasi log) dan kategorikal (One-Hot Encoding, Ordinal Encoding).",
        "Menjelaskan mekanisme kontaminasi data leakage secara teoritis dan memetakan konsekuensi fatalnya terhadap estimasi performa generalisasi.",
        "Merancang protokol partisi data train-validation-test terisolasi sebelum melakukan transformasi pembersihan atau penskalaan apapun.",
        "Mengimplementasikan orkestrasi Scikit-Learn Pipeline untuk menjamin pembelajaran parameter transformasi (fit) terkurung eksklusif pada data latih.",
        "Membangun model baseline naif sebagai standar pembanding minimal yang harus dikalahkan oleh model prediktif kompleks.",
        "Mengevaluasi performa model regresi menggunakan metrik MAE, MSE, RMSE, dan R^2, serta menginterpretasikan hasil eksekusi nyata pada California Housing dataset."
      ],
      prerequisites: [
        "Penguasaan konsep Bab 1 (tipe data, audit kualitas, dan statistik deskriptif).",
        "Pemahaman dasar aljabar linier (vektor fitur, pembobotan regresi linier).",
        "Pengetahuan eksekusi modul Python Scikit-Learn, Pandas, dan NumPy."
      ],
      coreConcepts: [
        "Feature Engineering & Transformations (StandardScaler, MinMaxScaler, Log1p)",
        "Categorical Encodings (One-Hot, Ordinal, Target Encoding with Smoothing)",
        "Data Leakage Taxonomy (Train-Test Contamination, Lookahead Bias, Target Leakage)",
        "Scikit-Learn Pipeline & ColumnTransformer Architecture",
        "Baseline Models (DummyRegressor, Heuristic Baselines)",
        "Regression Evaluation Metrics (MAE, MSE, RMSE, R-Squared)",
        "Real Case Study: California Housing Ridge Regression Pipeline Execution"
      ],
      subchapters: [
        {
          id: "sub-ds-02-01",
          slug: "rekayasa-fitur-transformasi-penskalaan",
          title: "Rekayasa Fitur, Penskalaan & Transformasi Representasi",
          orderIndex: 1,
          description: "Membahas teknik transformasi fitur numerik, penyesuaian skala variabel, encoding variabel kategorikal, dan rekayasa rasio fitur domain-spesifik.",
          content_markdown: `### Transformasi & Penskalaan Fitur Numerik

Sebagian besar algoritma pembelajaran mesin berbasis gradien (seperti regresi linier teratur, neural networks, dan SVM) atau berbasis metrik jarak Euclidean (KNN, K-Means) sangat sensitif terhadap perbedaan skala absolut antar fitur:

1. **Standardisasi ($Z$-Score Standardization)**:
   Mentransformasikan fitur agar memiliki rata-rata nol ($\\mu = 0$) dan varians satuan ($\\sigma^2 = 1$):
   $$z = \\frac{x - \\mu}{\\sigma}$$
   *Keunggulan*: Mempertahankan bentuk distribusi aslinya dan tidak mengompresi keberadaan outlier ke batas kaku tertentu.

2. **Penskalaan Min-Max (Normalisasi)**:
   Mengompresi seluruh rentang nilai fitur ke dalam interval tertutup $[0, 1]$:
   $$x_{\\text{norm}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}$$
   *Keterbatasan*: Sangat rentan terhadap outlier ekstrem. Keberadaan satu nilai pencilan raksasa akan membuat 99% data mayoritas termampatkan ke rentang sempit mendekati 0.

3. **Transformasi Logaritmik & Power Transforms**:
   Untuk fitur dengan distribusi miring ke kanan (*heavy right tail*, seperti pendapatan atau harga rumah), transformasi $\\log(1 + x)$ atau transformasi Yeo-Johnson/Box-Cox digunakan untuk menstabilkan varians dan mendekatkan distribusi ke bentuk simetris Gauss, yang memenuhi asumsi linieritas regresi klasik.

### Encoding Fitur Kategorikal

Variabel non-numerik harus dikonversi menjadi representasi kuantitatif:

- **One-Hot Encoding (OHE)**: Membuat kolom biner independen untuk setiap kategori unik. Wajib membuang satu kategori kolom redundan ($\\text{drop}='\\text{first}'$) jika menggunakan regresi linier biasa guna menghindari kolinearitas sempurna (*dummy variable trap*).
- **Ordinal Encoding**: Mengalokasikan nilai integer berurutan ($\\{1, 2, 3\\}$) hanya jika ada hierarki alami (misalnya: *Rendah, Sedang, Tinggi*). Menerapkan ordinal encoding pada data nominal murni akan menyuntikkan relasi urutan artifisial yang merusak model.
- **Target Encoding (Mean Encoding)**: Mengganti kategori dengan rata-rata nilai target variabel pada kategori tersebut. Harus dipadukan dengan teknik regularisasi/smoothing dan k-fold out-of-fold cross-fitting untuk mencegah overfitting parah.`,
          commonPitfalls: [
            "Menerapkan One-Hot Encoding pada variabel kategorikal dengan kardinalitas sangat tinggi (ribuan kategori unik), yang memicu ledakan dimensi matriks (curse of dimensionality).",
            "Menerapkan ordinal encoding pada variabel nominal murni tanpa urutan alami (seperti warna atau nama kota), yang memaksakan hierarki numerik palsu.",
            "Menghitung nilai minimum dan maksimum dari seluruh dataset sebelum melakukan train-test split."
          ],
          exercises: [
            {
              level: 1,
              task: "Diberikan fitur pendapatan X = [10, 20, 30, 40, 50]. Hitung nilai hasil transformasi Min-Max scaling untuk nilai X = 30!",
              solution: "x_min = 10, x_max = 50. x_norm = (30 - 10) / (50 - 10) = 20 / 40 = 0.5."
            }
          ],
          references: [
            {
              id: "src-hastie-esl",
              title: "The Elements of Statistical Learning",
              authors: ["Trevor Hastie", "Robert Tibshirani", "Jerome Friedman"],
              type: "book",
              url: "https://hastie.su.domains/ElemStatLearn/",
              relevance: "Prinsip penskalaan fitur dan regularisasi dalam model statistik.",
              isPrimarySource: true
            }
          ]
        },
        {
          id: "sub-ds-02-02",
          slug: "data-leakage-dan-scikit-learn-pipeline",
          title: "Partisi Data, Protokol Anti-Data Leakage & Orkestrasi Scikit-Learn Pipeline",
          orderIndex: 2,
          description: "Mempelajari taksonomi kebocoran data, pemisahan dataset terisolasi, bahaya fit global, dan arsitektur Scikit-Learn Pipeline sebagai benteng reproduksibilitas.",
          content_markdown: `### Taksonomi Data Leakage (Kebocoran Data)

**Data Leakage** adalah masuknya informasi dari luar domain pelatihan (*training set*) ke dalam proses pembuatan model, yang menghasilkan estimasi performa validasi yang terlampau optimis (*artificially inflated accuracy*) tetapi berujung pada keruntuhan performa saat model diuji pada data produksi baru (Kaufman et al., 2012):

1. **Train-Test Contamination (Preprocessing Leakage)**:
   Terjadi ketika transformasi statistik (seperti mean, standard deviation, nilai minimum/maksimum, atau imputasi nilai hilang) dihitung dari **seluruh dataset** sebelum partisi *train-test split* dilakukan. Akibatnya, informasi distribusi data uji telah bocor ke dalam data latih.
2. **Target Leakage (Kebocoran Target)**:
   Terjadi ketika fitur prediktor yang dimasukkan ke dalam model memuat informasi yang hanya tersedia **setelah** peristiwa target terjadi di dunia nyata (misalnya: menyertakan kolom *Nomor ID Surat Pembatalan* sebagai prediktor untuk memprediksi apakah pelanggan akan membatalkan layanan).
3. **Lookahead Bias (Temporal Leakage)**:
   Terjadi pada data deret waktu (*time-series*) ketika data masa depan digunakan untuk memprediksi data masa lalu karena pemisahan data dilakukan secara acak alih-alih kronologis temporal.

\`\`\`
  [KASUS KEBOCORAN FATAL]                 [PROTOKOL KANONIKAL VALID]
      Dataset Mentah                            Dataset Mentah
            |                                         |
     [Fitur Scaler]                           [Train-Test Split]
     (Fit seluruh data!)                             /         \\
            |                           [Train Set]       [Test Set]
    [Train-Test Split]                       |                 |
     /              \\                  [Fit & Transform]      |
[Train Set]     [Test Set]              (Hanya train!)         |
(Terkontaminasi!)                            |            [Transform Saja]
                                        [Model Train]     (Uji independen)
\`\`\`

### Benteng Solusi: Enkapsulasi Scikit-Learn Pipeline

Untuk menjamin secara matematis dan prosedural bahwa tidak ada kebocoran data yang terjadi antar lipatan (*folds*) selama validasi silang (cross-validation) maupun antara set latih dan set uji, seluruh tahapan preprocessing dan estimasi model harus dirangkai ke dalam objek **\`Pipeline\`**:

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge

# Pipeline memastikan scaler.fit() HANYA dipanggil pada data train!
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', Ridge(alpha=1.0))
])
\`\`\`

Ketika \`pipeline.fit(X_train, y_train)\` dieksekusi:
1. \`StandardScaler\` menghitung mean $\\mu_{\\text{train}}$ dan deviasi standar $\\sigma_{\\text{train}}$ **hanya** dari \`X_train\`.
2. Data \`X_train\` ditransformasikan menjadi $Z_{\\text{train}}$.
3. Objek \`Ridge\` mengestimasi bobot regresi berdasarkan $Z_{\\text{train}}$ dan \`y_train\`.

Ketika \`pipeline.predict(X_test)\` dieksekusi kemudian:
1. \`StandardScaler\` menerapkan $\\mu_{\\text{train}}$ dan $\\sigma_{\\text{train}}$ yang telah tersimpan untuk mentransformasikan \`X_test\` secara netral tanpa menghitung ulang statistik dari data uji.
2. Model \`Ridge\` melakukan inferensi murni tanpa pernah melihat label atau distribusi intrinsik \`X_test\`.`,
          commonPitfalls: [
            "Menjalankan `scaler.fit_transform(X)` pada seluruh matriks fitur sebelum memanggil `train_test_split()`, yang merupakan bentuk kontaminasi data leakage paling klasik.",
            "Melakukan seleksi fitur (seperti korelasi Pearson terhadap target atau algoritma recursive feature elimination) sebelum partisi data latih dan uji.",
            "Memanggil `fit_transform()` pada data uji saat proses evaluasi inferensi alih-alih `transform()`."
          ],
          exercises: [
            {
              level: 2,
              task: "Jelaskan secara prosedural mengapa penggunaan 5-fold cross-validation tanpa Pipeline di mana standardisasi dilakukan di awal pada seluruh data menghasilkan estimasi skor validasi yang bias secara sistematik!",
              solution: "Dalam setiap iterasi lipatan (fold), fold validasi ke-k seharusnya bertindak sebagai data uji yang tidak pernah dilihat. Jika standardisasi dilakukan di awal pada seluruh data, maka mean dan deviasi standar yang digunakan untuk mentransformasikan data latih (4 folds lainnya) telah menginkorporasikan titik data dari fold validasi tersebut. Informasi fold validasi telah bocor ke dalam data latih, menyebabkan skor evaluasi menjadi artifisial lebih tinggi dari performa produksi sesungguhnya."
            }
          ],
          references: [
            {
              id: "src-scikit-learn-pipeline",
              title: "Scikit-Learn Documentation: Pipeline and composite estimators",
              authors: ["Scikit-Learn Developers"],
              type: "documentation",
              url: "https://scikit-learn.org/stable/modules/compose.html",
              relevance: "Dokumentasi kanonikal arsitektur Pipeline anti-leakage.",
              isPrimarySource: true
            },
            {
              id: "src-kaufman-leakage-2012",
              title: "Leakage in Data Mining: Formulation, Detection, and Avoidance",
              authors: ["Shachar Kaufman", "Saharon Rosset", "Claudia Perlich", "Ori Stitelman"],
              type: "paper",
              url: "https://dl.acm.org/doi/10.1145/2382577.2382579",
              relevance: "Perumusan formal bahaya kebocoran data dalam penambangan data.",
              isPrimarySource: true
            }
          ]
        },
        {
          id: "sub-ds-02-03",
          slug: "evaluasi-model-studi-kasus-california-housing",
          title: "Evaluasi Model, Baseline & Studi Kasus California Housing",
          orderIndex: 3,
          description: "Menghitung metrik performa regresi, menetapkan model baseline, dan mengeksekusi pipeline nyata pada California Housing Dataset dengan pencatatan telemetri presisi.",
          content_markdown: `### Metrik Evaluasi Regresi

Dalam pemodelan regresi terawasi, performa estimasi diukur melalui selisih antara nilai aktual $y_i$ dan nilai prediksi $\\hat{y}_i$:

1. **Mean Absolute Error (MAE)**:
   $$\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^n |y_i - \\hat{y}_i|$$
   Mengukur rata-rata magnitudo kesalahan dalam unit asli target. Linear dan robust terhadap outlier.

2. **Mean Squared Error (MSE)** & **Root Mean Squared Error (RMSE)**:
   $$\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2, \\quad \\text{RMSE} = \\sqrt{\\text{MSE}}$$
   Menghukum kesalahan berskala besar secara kuadratis. RMSE memiliki satuan yang sama dengan variabel target dan sangat populer dalam optimasi statistik.

3. **Koefisien Determinasi ($R^2$)**:
   $$R^2 = 1 - \\frac{\\sum_{i=1}^n (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^n (y_i - \\bar{y})^2} = 1 - \\frac{\\text{SS}_{\\text{res}}}{\\text{SS}_{\\text{tot}}}$$
   Mengukur proporsi varians variabel target yang berhasil dijelaskan oleh model prediktor relatif terhadap model baseline naif (rata-rata konstan $\\bar{y}$). Nilai $R^2 = 1$ menunjukkan prediksi sempurna, $R^2 = 0$ setara dengan menebak rata-rata target, dan $R^2 < 0$ menunjukkan performa yang lebih buruk daripada sekadar menebak rata-rata.

### Studi Kasus: Siklus Penuh Bebas Kebocoran California Housing

Implementasi kode di bawah ini merefleksikan alur kerja sains data yang diaudit secara ketat:
1. Mengunduh dataset sensus California Housing 1990 (20.640 sampel, 8 fitur prediktor, 1 target nilai rumah).
2. Memverifikasi ketiadaan nilai hilang (*missing values* $= 0$).
3. Menghitung korelasi Pearson antara *Median Income* (\`MedInc\`) dengan target (\`MedHouseVal\`) yang terbukti menjadi prediktor paling signifikan ($r = 0.6881$).
4. Melakukan partisi terisolasi 80/20 train-test split dengan seed terkontrol (\`random_state=42\`).
5. Merangkai \`StandardScaler\` dan \`Ridge(alpha=1.0)\` ke dalam Scikit-Learn \`Pipeline\`.
6. Melatih model secara eksklusif pada data latih dan mengevaluasi generalisasi pada data uji yang belum pernah dilihat.`,
          codeExamples: [
            {
              id: "code-ds-california-pipeline",
              title: "Siklus Lengkap Data Science: California Housing Anti-Leakage Pipeline",
              language: "python",
              filename: "data_science_lifecycle_pipeline.py",
              code: `import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score

# 1. Akuisisi Data Benchmark
housing = fetch_california_housing(as_frame=True)
df = housing.frame

n_samples, n_features = df.shape
missing_count = int(df.isnull().sum().sum())

# 2. Pemisahan Fitur & Target
X = df.drop(columns=["MedHouseVal"])
y = df["MedHouseVal"]

# 3. Train-Test Split Terisolasi (80/20) SEBELUM Transformasi Penskalaan (Anti-Leakage)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Pipeline Estimator Terpadu Bebas Kebocoran
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("ridge", Ridge(alpha=1.0, random_state=42))
])

# Fit HANYA pada X_train
pipeline.fit(X_train, y_train)

# Evaluasi Independen pada X_test
y_train_pred = pipeline.predict(X_train)
y_test_pred = pipeline.predict(X_test)

train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
train_r2 = r2_score(y_train, y_train_pred)
test_r2 = r2_score(y_test, y_test_pred)

# Korelasi Pearson terhadap Target
medinc_corr = df["MedInc"].corr(df["MedHouseVal"])

print(f"Dataset Samples: {n_samples} | Features: {n_features}")
print(f"Total Missing Values: {missing_count}")
print(f"Train Samples: {len(X_train)} | Test Samples: {len(X_test)}")
print(f"MedInc-Target Correlation: {medinc_corr:.4f}")
print(f"Train RMSE: {train_rmse:.4f} | Train R2: {train_r2:.4f}")
print(f"Test RMSE: {test_rmse:.4f} | Test R2: {test_r2:.4f}")`,
              expectedOutput: `Dataset Samples: 20640 | Features: 9
Total Missing Values: 0
Train Samples: 16512 | Test Samples: 4128
MedInc-Target Correlation: 0.6881
Train RMSE: 0.7197 | Train R2: 0.6126
Test RMSE: 0.7456 | Test R2: 0.5758`,
              explanation: "Hasil eksekusi nyata pada runtime Python 3.12 menunjukkan model Ridge Regression teratur mencapai Train RMSE 0.7197 (R2 0.6126) dan Test RMSE 0.7456 (R2 0.5758). Gap generalisasi yang sempit (< 0.03 RMSE) memverifikasi bahwa model tidak mengalami overfitting dan terlindungi dari data leakage.",
              verificationStatus: "VERIFIED_RUNNABLE",
              isVerifiedOutput: true,
              dependencies: ["numpy>=1.26.0", "pandas>=2.2.0", "scikit-learn>=1.4.0"]
            }
          ],
          references: [
            {
              id: "src-california-housing",
              title: "Sparse Spatial Autoregressions",
              authors: ["R. Kelley Pace", "Ronald Barry"],
              type: "paper",
              url: "https://www.sciencedirect.com/science/article/abs/pii/S0167715296001032",
              relevance: "Rujukan kanonikal asal mula California Housing Dataset.",
              isPrimarySource: true
            },
            {
              id: "src-scikit-learn-pipeline",
              title: "Scikit-Learn Documentation: Pipeline",
              authors: ["Scikit-Learn Developers"],
              type: "documentation",
              url: "https://scikit-learn.org/stable/modules/compose.html",
              relevance: "Rujukan implementasi resmi perancangan Pipeline dan StandardScaler.",
              isPrimarySource: true
            }
          ],
          commonPitfalls: [
            "Menyimpulkan model akurat hanya berdasarkan skor R2 latih tanpa memeriksa nilai metrik uji dan visualisasi residual error.",
            "Mengabaikan batas nilai sensorik dataset (pada California Housing, nilai rumah di atas $500,000 di-cap menjadi 5.00001) yang menghasilkan anomali residual horizontal pada grafik scatter plot.",
            "Menghapus baris dari set uji selama evaluasi atau membiarkan set uji digunakan berulang-ulang untuk menyetel hyperparameter."
          ],
          exercises: [
            {
              level: 3,
              task: "Modifikasi skrip di atas untuk menghitung model baseline naif (DummyRegressor dengan strategi mean) dan bandingkan nilai Test RMSE baseline tersebut dengan Test RMSE model Ridge (0.7456)!",
              solution: "from sklearn.dummy import DummyRegressor; dummy = DummyRegressor(strategy='mean'); dummy.fit(X_train, y_train); dummy_rmse = np.sqrt(mean_squared_error(y_test, dummy.predict(X_test))). Nilai RMSE baseline sekitar 1.145, membuktikan bahwa model Ridge berhasil memangkas error secara signifikan sebesar ~35% dibanding tebakan naif."
            }
          ]
        }
      ],
      summary: "Bab 2 telah menyelesaikan rantai metodologi sains data: merumuskan rekayasa fitur numerik dan kategorikal, mendiagnosis tiga varian kebocoran data (preprocessing leakage, target leakage, dan lookahead bias), menerapkan enkapsulasi Scikit-Learn Pipeline untuk isolasi absolut, serta memvalidasi performa model melalui eksekusi nyata pada California Housing dataset.",
      transitionToNextChapter: "Dengan dikuasainya metodologi sains data tabular dan protokol anti-kebocoran pada topik ini, pembelajaran dapat ditingkatkan ke pemodelan jaringan saraf berdimensi tinggi pada kurikulum Deep Learning dan spesialisasi machine learning tingkat lanjut.",
      evaluationQuestions: [
        "Jelaskan bagaimana Scikit-Learn Pipeline mencegah terjadinya train-test contamination selama proses transformasi penskalaan data!",
        "Apa implikasi matematis dari nilai R^2 yang bernilai negatif pada evaluasi data uji?",
        "Mengapa fitur Median Income (MedInc) memiliki korelasi tertinggi terhadap harga rumah, dan bagaimana Anda memvalidasi apakah hubungan ini murni linier atau memiliki batas kejenuhan?",
        "Sebutkan tiga tanda peringatan (red flags) yang mengindikasikan adanya target leakage dalam suatu proyek sains data!"
      ]
    }
  ]
};
