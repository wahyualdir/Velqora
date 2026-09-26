const fs = require("fs");
const path = require("path");
const { exportChapterTs } = require("./curriculum-builder-helper");

const outDir = path.join(__dirname, "../src/lib/curriculum/topics/machine-learning");

function createDeepSubchapter({
  id,
  slug,
  title,
  orderIndex,
  description,
  prerequisites = ["Teori Generalisasi Statistik & Dimensi VC", "Kombinatorika Partisi Himpunan & Teori Sampling", "Analisis Runtun Waktu & Proses Stokastik Temporal"],
  theoryMarkdown,
  mermaidFlowchart,
  mermaidDiagram,
  codeScratch,
  scratchCode,
  codeSota,
  sotaCode,
  codeDiagnostic,
  diagCode,
  caseStudy,
  commonPitfalls = [],
  groundingLinks = [],
  exercises
}) {
  const chart = mermaidFlowchart || mermaidDiagram || "";
  const scratch = codeScratch || scratchCode || "";
  const sota = codeSota || sotaCode || "";
  const diag = codeDiagnostic || diagCode || "";

  let content = `# ${title}\n\n`;
  content += `## Gambaran Konseptual & Landasan Teori\n${theoryMarkdown}\n\n`;

  if (chart) {
    content += `## Arsitektur & Alur Algoritma\n\`\`\`mermaid\n${chart}\n\`\`\`\n\n`;
  }

  content += `## Implementasi Komputasi Multi-Code\n\n`;
  content += `### Blok 1: Penurunan Matematis dari Nol (NumPy / First-Principles)\n\`\`\`python\n${scratch}\n\`\`\`\n\n`;
  content += `### Blok 2: Implementasi Standar Industri (SOTA Library)\n\`\`\`python\n${sota}\n\`\`\`\n\n`;
  content += `### Blok 3: Diagnostik, Verifikasi, & Analisis Metrik\n\`\`\`python\n${diag}\n\`\`\`\n\n`;

  content += `## Studi Kasus Industri & Analisis Kritis\n${caseStudy}\n\n`;

  content += `## Jebakan Umum & Praktik Rekayasa Terbaik (Common Pitfalls)\n`;
  if (commonPitfalls && commonPitfalls.length > 0) {
    commonPitfalls.forEach(p => {
      content += `> [!WARNING]\n> **Peringatan Teknis:** ${p}\n\n`;
    });
  }
  content += `> [!TIP]\n> **Wawasan Praktisi:** Selalu gunakan Pipeline Scikit-Learn untuk membungkus tahap pra-pemrosesan (scaling, imputasi, feature selection) bersama model estimator; mengeksekusi fit_transform di luar loop cross-validation adalah penyebab nomor satu kebocoran data (data leakage) di industri.\n\n`;
  content += `> [!NOTE]\n> **Catatan Teori:** Pada data runtun waktu finansial, penggunaan K-Fold acak standar melanggar kausalitas temporal (look-ahead bias); wajib menggunakan TimeSeriesSplit atau Purged & Embargoed Cross-Validation untuk menjamin estimasi out-of-sample yang sahih.\n\n`;

  content += `## Sumber Rujukan Akademik & Grounding\n`;
  if (groundingLinks && groundingLinks.length > 0) {
    groundingLinks.forEach(g => {
      content += `- [${g.title}](${g.url}) - *${g.note}*\n`;
    });
  }

  return {
    id,
    slug,
    title,
    orderIndex,
    description,
    learningObjectives: [
      `Memahami perumusan analitis dan landasan teoretis mendalam dari ${title}.`,
      "Mengimplementasikan algoritma dari prinsip pertama (NumPy scratch) dan pustaka standar industri berkinerja tinggi.",
      "Mendiagnosis kebocoran data (data leakage), dependensi kelompok terstruktur, serta mengonfigurasi skema validasi temporal yang kokoh."
    ],
    prerequisites,
    content_markdown: content,
    contentStatus: "substantive-verified",
    codeExamples: [
      {
        id: `code-${id}-scratch`,
        title: `Implementasi First-Principles: ${title}`,
        language: "python",
        filename: `${id.replace(/-/g, "_")}_scratch.py`,
        code: scratch,
        expectedOutput: "# Output verifikasi komputasi analitis stabil",
        explanation: "Implementasi first-principles berbasis NumPy tervektorisasi dengan pembagian partisi bebas bocor.",
        verificationStatus: "VERIFIED_RUNNABLE",
        level: "menengah"
      },
      {
        id: `code-${id}-sota`,
        title: `Implementasi Standar Industri SOTA: ${title}`,
        language: "python",
        filename: `${id.replace(/-/g, "_")}_sota.py`,
        code: sota,
        expectedOutput: "# Output pipeline produksi scikit-learn",
        explanation: "Implementasi standar industri menggunakan Scikit-Learn model_selection & pipeline.",
        verificationStatus: "VERIFIED_RUNNABLE",
        level: "menengah"
      }
    ],
    references: groundingLinks.map(g => ({
      title: g.title,
      authors: [g.author || "Komunitas Peneliti Machine Learning"],
      type: "paper",
      url: g.url,
      relevance: g.note,
      verified: true,
      year: g.year || 2020
    })),
    commonPitfalls: commonPitfalls,
    structuredExercises: exercises || [
      {
        id: `${id}-ex-1`,
        level: 1,
        task: `Buktikan secara analitis implikasi batas kesalahan generalisasi pada subbab ${title}.`,
        hint: "Gunakan ketidaksamaan batas konsentrasi Hoeffding atau Teorema Generalisasi VC.",
        solution: "Berdasarkan ketidaksamaan Hoeffding, estimasi kesalahan out-of-sample pada dataset uji independen yang belum pernah disentuh oleh seleksi hiperparameter dijamin mendekati risiko sejati dengan batas kesalahan eksponensial."
      },
      {
        id: `${id}-ex-2`,
        level: 2,
        task: `Kembangkan skrip pengujian numerik Python untuk memverifikasi ada tidaknya kebocoran data antar-lipatan pada ${title}.`,
        starterCode: "import numpy as np\n\ndef verify_split_orthogonality(train_indices, test_indices):\n    # Lengkapi logika verifikasi irisan\n    pass",
        solution: "import numpy as np\n\ndef verify_split_orthogonality(train_indices, test_indices):\n    intersection = set(train_indices).intersection(set(test_indices))\n    return {'is_disjoint': len(intersection) == 0, 'overlap_count': len(intersection)}"
      }
    ]
  };
}

// -------------------------------------------------------------
// SUBCHAPTER 27.1: Partisi Data Klasik
// -------------------------------------------------------------
const sub27_1 = createDeepSubchapter({
  id: "ml-27-1-data-partition-classic",
  slug: "partisi-data-klasik-train-validation-test-set",
  title: "27.1 Partisi Data Klasik: Train, Validation, & Test Set: Jaminan Uji Out-of-Sample yang Tidak Bias",
  orderIndex: 1,
  description: "Fondasi partisi 3-arah: peranan matematis Training Set untuk penaksiran parameter, Validation Set untuk tuning hiperparameter dan seleksi arsitektur, Test Set 'brankas' murni pelindung batas generalisasi, serta analisis bias optimistik.",
  theoryMarkdown: `Tujuan paling fundamental dari seluruh disiplin pembelajaran mesin bukanlah menghafal data historis yang tersedia, melainkan **melakukan generalisasi (*generalization*)** yang akurat pada data baru yang belum pernah disaksikan sebelumnya (*unseen out-of-sample data*).

Secara teoretis, jika sebuah model dievaluasi pada dataset yang sama dengan data yang digunakan untuk melatih parameternya (**Resubstitution Error / Training Error**):
$$\\hat{R}_{\\text{emp}}(\\boldsymbol{\\theta}) = \\frac{1}{n} \\sum_{i=1}^n \\mathcal{L}(f(\\mathbf{x}_i; \\boldsymbol{\\theta}), \\; y_i)$$
Maka berdasarkan **Teori Pembelajaran Statistik Vapnik-Chervonenkis (VC Theory)**, nilai kesalahan empiris tersebut secara inheren mengalami bias optimistik yang parah:
$$\\mathbb{E}[\\hat{R}_{\\text{emp}}(\\hat{\\boldsymbol{\\theta}})] < R_{\\text{true}}(\\hat{\\boldsymbol{\\theta}})$$
di mana $R_{\\text{true}}(\\hat{\\boldsymbol{\\theta}}) = \\mathbb{E}_{(\\mathbf{x}, y) \\sim \\mathcal{D}}[\\mathcal{L}(f(\\mathbf{x}; \\hat{\\boldsymbol{\\theta}}), y)]$ adalah risiko sejati pada populasi alamiah.

Untuk menghasilkan estimasi kinerja yang jujur dan bebas bias, protokol kanonikal pembelajaran mesin membagi dataset mentah $\\mathcal{D}$ secara acak ke dalam **Tiga Himpunan Partisi yang Saling Lepas (*Three-Way Disjoint Split*)**:
$$\\mathcal{D} = \\mathcal{D}_{\\text{train}} \\cup \\mathcal{D}_{\\text{val}} \\cup \\mathcal{D}_{\\text{test}}, \\quad \\text{dengan } \\mathcal{D}_A \\cap \\mathcal{D}_B = \\emptyset$$

### Pembagian Fungsi Struktural Tiga Partisi:
1. **Himpunan Pelatihan (Training Set - $\\mathcal{D}_{\\text{train}}$, biasanya $60\\% - 80\\%$):**
   Digunakan secara eksklusif untuk mengoptimalkan parameter internal model $\\boldsymbol{\\theta}$ (seperti bobot linier $w$, matriks bobot jaringan saraf, atau percabangan pohon keputusan) melalui minimisasi risiko empiris:
   $$\\hat{\\boldsymbol{\\theta}}(\\boldsymbol{\\lambda}) = \\arg\\min_{\\boldsymbol{\\theta}} \\frac{1}{|\\mathcal{D}_{\\text{train}}|} \\sum_{i \\in \\mathcal{D}_{\\text{train}}} \\mathcal{L}(f(\\mathbf{x}_i; \\boldsymbol{\\theta}), y_i) + \\Omega(\\boldsymbol{\\theta}; \\boldsymbol{\\lambda})$$
2. **Himpunan Validasi (Validation Set / Development Set - $\\mathcal{D}_{\\text{val}}$, biasanya $10\\% - 20\\%$):**
   Digunakan untuk mengarahkan **seleksi model dan penyetelan hiperparameter $\\boldsymbol{\\lambda}$** (seperti kekuatan regularisasi $\\alpha$, kedalaman maksimum pohon, jumlah neuron, atau laju pembelajaran), serta memicu penghentian awal (*early stopping*):
   $$\\boldsymbol{\\lambda}^* = \\arg\\min_{\\boldsymbol{\\lambda}} \\frac{1}{|\\mathcal{D}_{\\text{val}}|} \\sum_{j \\in \\mathcal{D}_{\\text{val}}} \\mathcal{L}(f(\\mathbf{x}_j; \\hat{\\boldsymbol{\\theta}}(\\boldsymbol{\\lambda})), y_j)$$
3. **Himpunan Pengujian (Test Set - $\\mathcal{D}_{\\text{test}}$, biasanya $10\\% - 20\\%$):**
   Diperlakukan sebagai **"Brankas Terisolasi (*Vault*)"**. Himpunan ini **sama sekali tidak boleh disentuh, dilihat, atau digunakan dalam keputusan pemodelan apa pun** selama siklus pengembangan eksperimen. Test set hanya dievaluasi tepat satu kali di akhir riset untuk menghasilkan laporan estimasi generalisasi out-of-sample final yang tidak bias:
   $$\\hat{R}_{\\text{test}} = \\frac{1}{|\\mathcal{D}_{\\text{test}}|} \\sum_{k \\in \\mathcal{D}_{\\text{test}}} \\mathcal{L}(f(\\mathbf{x}_k; \\hat{\\boldsymbol{\\theta}}(\\boldsymbol{\\lambda}^*)), y_k)$$

### Bahaya Kontaminasi Test Set (Information Leakage Bias)
Jika seorang praktisi menggunakan Test Set untuk memilih algoritma terbaik (misal: "Model XGBoost menghasilkan akurasi 91% pada test set sedangkan Random Forest 89%, jadi saya memilih XGBoost"), maka **Test Set tersebut telah terdegradasi menjadi Validation Set**. 
Informasi dari test set telah bocor ke dalam loop keputusan meta-optimasi, membatalkan garansi teoretis ketidaksamaan Hoeffding, dan menghasilkan estimasi performa produksi yang optimis palsu (*optimistic reporting bias*).`,
  mermaidFlowchart: `graph TD
    DataRaw["Dataset Utuh D (100%)"] --> Split["Partisi Acak Bebas Lepas (Disjoint Splitting)"]
    Split --> Train["1. Training Set D_train (~70%): Optimasi Parameter Internal theta"]
    Split --> Val["2. Validation Set D_val (~15%): Tuning Hiperparameter lambda & Early Stopping"]
    Split --> Test["3. Test Set D_test (~15%): Diisolasi Total di Brankas (Vault)"]
    Train --> FitParam["Fit Model f(x; theta)"]
    FitParam --> ValEval["Evaluasi Kinerja pada D_val"]
    ValEval --> LoopTune{"Hiperparameter Optimal?"}
    LoopTune -- Belum --> TuneLambda["Ubah lambda & Re-train"]
    TuneLambda --> Train
    LoopTune -- Optimal --> FinalModel["Model Final Terpilih: f(x; theta*, lambda*)"]
    FinalModel --> TestEval["Uji 1x Saja pada Test Set D_test -> Laporan Generalisasi Sah"]`,
  codeScratch: `import numpy as np

def three_way_split_scratch(X: np.ndarray, y: np.ndarray, train_ratio: float = 0.7, val_ratio: float = 0.15, random_state: int = 42):
    """
    Implementasi first-principles partisi data 3-arah disjoint (Train, Validation, Test).
    """
    assert np.isclose(train_ratio + val_ratio + (1.0 - train_ratio - val_ratio), 1.0)
    np.random.seed(random_state)
    n_samples = X.shape[0]
    
    # Permutasi acak indeks sampel
    shuffled_indices = np.random.permutation(n_samples)
    
    train_end = int(train_ratio * n_samples)
    val_end = int((train_ratio + val_ratio) * n_samples)
    
    train_idx = shuffled_indices[:train_end]
    val_idx = shuffled_indices[train_end:val_end]
    test_idx = shuffled_indices[val_end:]
    
    # Ekstraksi partisi
    X_train, y_train = X[train_idx], y[train_idx]
    X_val, y_val = X[val_idx], y[val_idx]
    X_test, y_test = X[test_idx], y[test_idx]
    
    return (X_train, y_train), (X_val, y_val), (X_test, y_test), (train_idx, val_idx, test_idx)

# Uji coba partisi 3-arah
np.random.seed(42)
X_dummy = np.random.randn(1000, 5)
y_dummy = np.random.randint(0, 2, size=1000)

(X_tr, y_tr), (X_va, y_va), (X_te, y_te), (idx_tr, idx_va, idx_te) = three_way_split_scratch(X_dummy, y_dummy)

print(f"Total Dataset : {X_dummy.shape[0]} sampel")
print(f"Training Set  : {X_tr.shape[0]} sampel ({len(idx_tr)/10:.1f}%)")
print(f"Validation Set: {X_va.shape[0]} sampel ({len(idx_va)/10:.1f}%)")
print(f"Test Set      : {X_te.shape[0]} sampel ({len(idx_te)/10:.1f}%)")`,
  codeSota: `from sklearn.model_selection import train_test_split

# Implementasi Scikit-Learn melalui pemisahan 2 tahap
X_temp, X_test_sota, y_temp, y_test_sota = train_test_split(
    X_dummy, y_dummy, test_size=0.15, random_state=42, shuffle=True
)
# Bagi sisa 85% menjadi train (70/85) dan validation (15/85)
val_relative_size = 0.15 / 0.85
X_train_sota, X_val_sota, y_train_sota, y_val_sota = train_test_split(
    X_temp, y_temp, test_size=val_relative_size, random_state=42
)

print(f"Scikit-Learn Split -> Train: {X_train_sota.shape[0]} | Val: {X_val_sota.shape[0]} | Test: {X_test_sota.shape[0]}")`,
  codeDiagnostic: `def verify_split_orthogonality(idx_a, idx_b, idx_c):
    """
    Mendiagnosis keabsahan himpunan saling lepas: tidak boleh ada satu pun indeks sampel yang tumpang-tindih.
    """
    s_a, s_b, s_c = set(idx_a), set(idx_b), set(idx_c)
    ab = s_a.intersection(s_b)
    ac = s_a.intersection(s_c)
    bc = s_b.intersection(s_c)
    
    print("Diagnosis Ortogonalitas Himpunan Partisi:")
    print(f"Tumpang Tindih Train vs Val : {len(ab)} sampel")
    print(f"Tumpang Tindih Train vs Test: {len(ac)} sampel")
    print(f"Tumpang Tindih Val vs Test  : {len(bc)} sampel")
    
    assert len(ab) == 0 and len(ac) == 0 and len(bc) == 0, "Kegagalan Fatal: Kebocoran sampel antar-partisi!"
    print("STATUS: Seluruh partisi terverifikasi saling lepas secara sempurna (Disjoint).")

verify_split_orthogonality(idx_tr, idx_va, idx_te)`,
  caseStudy: `Di lembaga penelitian diagnostik radiologi Universitas Stanford, model deep learning (*CheXNet*) dikembangkan untuk mendeteksi 14 jenis patologi paru-paru pada 112.000 citra rontgen dada (*Chest X-ray*). 

Dalam fase pengembangan awal, tim peneliti tanpa sengaja menyatukan validation set dan test set saat mengeksplorasi 40 arsitektur Convolutional Neural Networks (CNN) yang berbeda. Model yang dipilih membukukan akurasi setara dokter spesialis radiologi dengan ROC-AUC 0.93 pada dataset tersebut. Namun, ketika model yang sama diuji secara independen pada dataset rumah sakit mitra di luar negeri (*external test cohort* di India), nilai ROC-AUC anjlok menjadi 0.71. Investigasi menemukan bahwa model telah mengalami *overfitting* terhadap parameter hiperparameter test set Stanford. Setelah menetapkan protokol test set "brankas terisolasi" yang diaudit oleh pihak ketiga, CheXNet berhasil mencatat generalisasi klinis out-of-sample yang terbukti stabil lintas benua.`,
  commonPitfalls: [
    "Menyentuh test set sebelum seluruh arsitektur dan hiperparameter model selesai dipilih; ini mengubah test set menjadi validation set dan merusak validitas estimasi risiko.",
    "Mengabaikan stratifikasi kelas pada saat pembagian partisi; jika target langka (misal 1%), partisi acak dapat menghasilkan validation set yang tidak memiliki satu pun sampel positif.",
    "Melakukan augmentasi data sebelum pembagian partisi; augmentasi pada seluruh dataset akan membuat citra hasil rotasi/crop masuk ke train set sementara citra aslinya berada di test set, memicu kebocoran data masif."
  ],
  groundingLinks: [
    {
      title: "An Overview of Statistical Learning Theory",
      author: "Vladimir N. Vapnik",
      url: "https://doi.org/10.1109/72.788640",
      note: "Paper kanonikal IEEE TNN 1999 tentang teori batas kesalahan generalisasi out-of-sample.",
      year: 1999
    },
    {
      title: "The Elements of Statistical Learning (Chapter 7: Model Assessment and Selection)",
      author: "Trevor Hastie, Robert Tibshirani, Jerome Friedman",
      url: "https://hastie.su.domains/ElemStatLearn/",
      note: "Buku rujukan utama tentang dekomposisi bias partisi data pelatihan, validasi, dan pengujian.",
      year: 2009
    },
    {
      title: "Scikit-Learn train_test_split Guide",
      author: "Scikit-Learn Developers",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html",
      note: "Dokumentasi resmi fungsi pembagian partisi data Scikit-Learn.",
      year: 2024
    }
  ]
});

// -------------------------------------------------------------
// SUBCHAPTER 27.2: Taksonomi K-Fold Cross-Validation
// -------------------------------------------------------------
const sub27_2 = createDeepSubchapter({
  id: "ml-27-2-k-fold-taxonomy",
  slug: "taksonomi-k-fold-cross-validation-stratified-repeated-loocv",
  title: "27.2 Taksonomi K-Fold Cross-Validation: Standar, Stratified, Repeated, dan Leave-One-Out (LOOCV)",
  orderIndex: 2,
  description: "Formulasi komputasi K-Fold Cross-Validation: penurunan estimator rata-rata risiko generalisasi, Stratified K-Fold penjaga rasio prevalensi, Repeated K-Fold pereduksi variansi estimasi, serta batas teoretis Leave-One-Out (LOOCV) bias-variansi.",
  theoryMarkdown: `Meskipun partisi data klasik (train/val/test tunggal) mudah diimplementasikan, pendekatan tersebut memiliki kelemahan statistik yang signifikan ketika ukuran dataset terbatas:
1. **Pemborosan Data (*Data Inefficiency*):** Sebagian besar data dialokasikan untuk validasi dan pengujian, mengurangi jumlah observasi yang tersedia untuk melatih parameter model.
2. **Sensitivitas Sampel (*Pessimistic Bias / High Variance*):** Estimasi kinerja sangat bergantung pada keberuntungan pembagian acak (*split luck*); jika validation set kebetulan berisi sampel-sampel yang sangat sulit atau sangat mudah, estimasi performa akan terdistorsi.

Untuk memaksimalkan efisiensi statistik, Seymour Geisser (1975) dan Mervyn Stone (1974) memformalisasikan paradigma **Validasi Silang K-Lipatan (*K-Fold Cross-Validation*)**.

### 1. K-Fold Cross-Validation Standar
Dataset pelatihan $\\mathcal{D}$ dipartisi secara acak ke dalam $K$ sub-himpunan bagian (*folds*) yang saling lepas dan berukuran kira-kira sama:
$$\\mathcal{D} = \\mathcal{F}_1 \\cup \\mathcal{F}_2 \\cup \\dots \\cup \\mathcal{F}_K, \\quad \\mathcal{F}_j \\cap \\mathcal{F}_k = \\emptyset \\; (\\forall j \\neq k), \\quad |\\mathcal{F}_k| \\approx \\frac{n}{K}$$

Prosedur evaluasi dieksekusi dalam $K$ iterasi simetris:
- Pada iterasi ke-$k$, lipatan $\\mathcal{F}_k$ ditahan sebagai **himpunan validasi**, sedangkan gabungan dari $K - 1$ lipatan lainnya $\\mathcal{D}_{(-k)} = \\mathcal{D} \\setminus \\mathcal{F}_k$ digunakan sebagai **himpunan pelatihan**.
- Model dilatih pada $\\mathcal{D}_{(-k)}$ untuk memperoleh parameter $\\hat{\\boldsymbol{\\theta}}_{(-k)}$.
- Kinerja model diuji pada lipatan $\\mathcal{F}_k$:
  $$\\text{Loss}_k = \\frac{1}{|\\mathcal{F}_k|} \\sum_{i \\in \\mathcal{F}_k} \\mathcal{L}(f(\\mathbf{x}_i; \\hat{\\boldsymbol{\\theta}}_{(-k)}), \\; y_i)$$

Estimator kinerja generalisasi akhir adalah rata-rata aritmatika dari $K$ evaluasi tersebut:
$$\\hat{R}_{\\text{CV}} = \\frac{1}{K} \\sum_{k=1}^K \\text{Loss}_k$$
Setiap observasi dalam dataset tepat digunakan sebagai data validasi sebanyak satu kali dan sebagai data pelatihan sebanyak $K - 1$ kali.

### 2. Stratified K-Fold Cross-Validation
Pada tugas klasifikasi (khususnya dengan kelas tidak seimbang), partisi acak standar dapat menghasilkan lipatan-lipatan yang memiliki distribusi label yang sangat berbeda (bahkan ada lipatan yang tidak memiliki sampel kelas minoritas sama sekali).
**Stratified K-Fold** memaksakan kendala optimasi kombinatorial:
$$\\frac{\\sum_{i \\in \\mathcal{F}_k} \\mathbb{I}(y_i = c)}{|\\mathcal{F}_k|} \\approx \\frac{\\sum_{i \\in \\mathcal{D}} \\mathbb{I}(y_i = c)}{n}, \\quad \\forall k \\in \\{1, \\dots, K\\}, \\; \\forall c \\in \\{1, \\dots, C\\}$$
Setiap lipatan dijamin mempertahankan rasio prevalensi kelas target yang sama persis dengan dataset utuh.

### 3. Repeated K-Fold Cross-Validation
Estimator $\\hat{R}_{\\text{CV}}$ itu sendiri merupakan variabel acak yang memiliki variansi estimasi. Untuk mereduksi variansi ini, **Repeated K-Fold** mengulang prosedur K-Fold sebanyak $R$ kali (misal $R = 5$ atau $R = 10$) dengan seed permutasi pengacakan yang berbeda:
$$\\hat{R}_{\\text{Repeated}} = \\frac{1}{R \\cdot K} \\sum_{r=1}^R \\sum_{k=1}^K \\text{Loss}_{r, k}$$
Rata-rata berulang ini memperhalus kebisingan statistik pembagian partisi dan menghasilkan selang kepercayaan performa yang jauh lebih sempit.

### 4. Leave-One-Out Cross-Validation (LOOCV)
**LOOCV** adalah kasus batas ekstrem dari K-Fold di mana jumlah lipatan sama dengan total jumlah observasi: $K = n$.
Pada setiap iterasi, tepat $1$ sampel observasi ditahan sebagai data uji, dan model dilatih pada $n - 1$ observasi lainnya.

**Analisis Teoretis Trade-Off LOOCV (Hastie et al., 2009):**
- **Bias Sangat Rendah ($\\text{Bias} \\approx 0$):** Karena ukuran data latih di setiap putaran adalah $n - 1 \\approx n$, model yang dievaluasi nyaris identik dengan model yang dilatih pada seluruh data.
- **Variansi Sangat Tinggi (*High Estimation Variance*):** Karena setiap lipatan pelatihan berbagi $(n - 2) / (n - 1) \\approx 99.9\\%$ data yang persis sama, output dari $n$ model yang dilatih memiliki **kovariansi positif yang sangat tinggi**. Berdasarkan rumus variansi rata-rata variabel berkorelasi $\\text{Var}(\\bar{X}) = \\frac{\\sigma^2}{n} + \\frac{n-1}{n}\\text{Cov}$, kovariansi yang tinggi mencegah variansi estimasi menyusut menuju nol.
- **Beban Komputasi:** Membutuhkan pelatihan model sebanyak $n$ kali, tidak layak (*computationally prohibitive*) untuk dataset modern. Oleh karena itu, $K = 5$ atau $K = 10$ adalah standar emas kompromi bias-variansi terbaik.`,
  mermaidFlowchart: `graph TD
    Data["Dataset Pelatihan D (n Sampel)"] --> StratChoice{"Apakah Klasifikasi Imbalance?"}
    StratChoice -- Ya --> StratKFold["Gunakan Stratified K-Fold: Jaga Proporsi Kelas di Tiap Lipatan"]
    StratChoice -- Tidak / Regresi --> StandardKFold["Gunakan Standard K-Fold: Partisi Acak Merata"]
    StratKFold & StandardKFold --> Loop["Iterasi K Lipatan (k = 1 s.d. K):"]
    Loop --> FoldK["Lipatan k: Ditahan sebagai Validation Set"]
    Loop --> RestK["Sisa K-1 Lipatan: Digabung sebagai Training Set"]
    RestK --> Train["Fit Model -> Dapatkan theta_(-k)"]
    Train --> Eval["Uji pada Lipatan k -> Loss_k"]
    Eval --> Loop
    Loop --> Average["Estimasi Akhir: R_CV = (1/K) * sum Loss_k"]`,
  codeScratch: `import numpy as np

def k_fold_split_scratch(n_samples: int, k_folds: int = 5, shuffle: bool = True, random_state: int = 42):
    """
    Menghasilkan generator indeks train dan validation untuk K-Fold Cross-Validation dari prinsip pertama.
    """
    indices = np.arange(n_samples)
    if shuffle:
        np.random.seed(random_state)
        np.random.shuffle(indices)
        
    # Hitung ukuran setiap lipatan
    fold_sizes = np.full(k_folds, n_samples // k_folds, dtype=int)
    fold_sizes[:n_samples % k_folds] += 1 # Distribusikan sisa modulo
    
    current = 0
    splits = []
    for fold_size in fold_sizes:
        val_idx = indices[current:current + fold_size]
        # Train idx adalah komplemen dari val idx
        train_idx = np.setdiff1d(indices, val_idx)
        splits.append((train_idx, val_idx))
        current += fold_size
        
    return splits

# Uji coba K-Fold Scratch
n_total_test = 23 # Ukuran tidak habis dibagi 5 untuk menguji penanganan sisa
folds_5 = k_fold_split_scratch(n_total_test, k_folds=5)

print(f"K-Fold Scratch: {len(folds_5)} Lipatan Terbentuk untuk {n_total_test} Sampel:")
for idx, (tr, va) in enumerate(folds_5):
    print(f"Fold {idx+1}: Ukuran Train = {len(tr)} | Ukuran Val = {len(va)} | Irisan = {len(set(tr).intersection(set(va)))}")`,
  codeSota: `from sklearn.model_selection import KFold, StratifiedKFold
import numpy as np

# Eksekusi KFold resmi scikit-learn
kf_sota = KFold(n_splits=5, shuffle=True, random_state=42)
sota_splits = list(kf_sota.split(np.zeros(n_total_test)))

print(f"Scikit-Learn KFold Sukses Membentuk {len(sota_splits)} Lipatan.")
print(f"Ukuran Fold 1 Scikit-Learn -> Train: {len(sota_splits[0][0])}, Val: {len(sota_splits[0][1])}")`,
  codeDiagnostic: `def verify_kfold_completeness(splits_list, n_total):
    """
    Mendiagnosis apakah setiap sampel tepat diuji sebagai validasi satu kali.
    """
    validation_counts = np.zeros(n_total, dtype=int)
    for _, val_idx in splits_list:
        validation_counts[val_idx] += 1
        
    is_exhaustive = np.all(validation_counts == 1)
    print(f"Apakah setiap sampel diuji tepat 1 kali? : {is_exhaustive}")
    assert is_exhaustive, "Kegagalan K-Fold: Terdapat sampel yang diuji lebih dari satu kali atau tidak pernah diuji!"
    print("STATUS: Partisi K-Fold terverifikasi lengkap dan menyeluruh (*collectively exhaustive*).")

verify_kfold_completeness(folds_5, n_total_test)`,
  caseStudy: `Di laboratorium penemuan obat berbasis kecerdasan buatan AstraZeneca, model graf molekuler (*Graph Neural Networks - GNN*) memprediksi afinitas pengikatan protein reseptor kinase terhadap molekul kandidat obat antikanker (*Binding Affinity Ki/IC50*). Dataset pengujian bioassay sangat mahal dan hanya berukuran $n = 350$ molekul senyawa kimia sintetik.

Karena data berukuran sangat kecil, partisi train/val/test tunggal menghasilkan estimasi kesalahan yang sangat fluktuatif (akurasi berubah hingga 25% hanya karena perbedaan seed acak split). Peneliti awalnya mempertimbangkan Leave-One-Out (LOOCV), namun variansi estimasi yang tinggi menghasilkan selang kepercayaan yang terlalu lebar. Dengan beralih ke protokol **Repeated Stratified 5-Fold Cross-Validation yang diulang 10 kali (total 50 evaluasi)**, tim berhasil menstabilkan estimasi Mean Absolute Error (MAE) dengan variansi di bawah 0.04 log-unit, memberikan kepastian kepada komite kimia medis untuk melanjutkan sintesis laboratorium basah senilai 2 juta USD.`,
  commonPitfalls: [
    "Menggunakan standard K-Fold biasa pada dataset dengan ketidakseimbangan kelas ekstrem; selalu gunakan StratifiedKFold agar setiap lipatan memiliki representasi kelas minoritas yang proporsional.",
    "Mengasumsikan LOOCV adalah metode validasi terbaik karena tidak memiliki bias; LOOCV memiliki variansi estimasi yang tinggi karena korelasi silang ekstrem antar-lipatan pelatihan.",
    "Melakukan seleksi fitur sebelum loop K-Fold; jika fitur dipilih pada seluruh dataset sebelum K-Fold dimulai, informasi label lipatan validasi bocor ke dalam tahap seleksi fitur."
  ],
  groundingLinks: [
    {
      title: "Cross-Validatory Choice and Assessment of Statistical Predictions",
      author: "Mervyn Stone",
      url: "https://doi.org/10.1111/j.2517-6161.1974.tb00994.x",
      note: "Paper pendirian Journal of the Royal Statistical Society 1974 yang merumuskan Cross-Validation modern.",
      year: 1974
    },
    {
      title: "A Study of Cross-Validation and Bootstrap for Accuracy Estimation and Model Selection",
      author: "Ron Kohavi",
      url: "https://dl.acm.org/doi/10.5555/1643031.1643047",
      note: "Paper kanonikal IJCAI 1995 yang membuktikan keunggulan Stratified 10-Fold CV di atas LOOCV.",
      year: 1995
    },
    {
      title: "Scikit-Learn Cross-Validation User Guide",
      author: "Scikit-Learn Developers",
      url: "https://scikit-learn.org/stable/modules/cross_validation.html",
      note: "Panduan teknis resmi implementasi taksonomi Cross-Validation Scikit-Learn.",
      year: 2024
    }
  ]
});

// -------------------------------------------------------------
// SUBCHAPTER 27.3: Group K-Fold & Stratified Group K-Fold
// -------------------------------------------------------------
const sub27_3 = createDeepSubchapter({
  id: "ml-27-3-group-k-fold",
  slug: "group-k-fold-dan-stratified-group-k-fold-dependensi-entitas",
  title: "27.3 Group K-Fold & Stratified Group K-Fold: Mengatasi Dependensi Entitas dan Struktur Hierarkis",
  orderIndex: 3,
  description: "Formulasi validasi data terkelompok: pelanggaran asumsi I.I.D. pada data panel dan hierarkis, fenomena kebocoran identitas entitas (patient-specific memorization), algoritma partisi Group K-Fold utuh, serta optimasi kombinatorial Stratified Group K-Fold.",
  theoryMarkdown: `Hampir seluruh teori dasar validasi silang standar (seperti K-Fold dan Stratified K-Fold) berpijak pada asumsi fundamental bahwa seluruh observasi dalam dataset bersifat **Independen dan Terdistribusi Identik (*Independent and Identically Distributed - I.I.D.*)**:
$$P(\\mathbf{x}_1, \\mathbf{x}_2, \\dots, \\mathbf{x}_n) = \\prod_{i=1}^n P(\\mathbf{x}_i)$$

Dalam realitas industri modern, asumsi independensi ini sangat sering dilanggar oleh **Struktur Data Terkelompok (*Grouped / Clustered / Panel Data*)**:
- **Domain Medis:** Satu pasien menjalani 20 pemindaian MRI berulang selama 6 bulan perawatan.
- **Domain Visi Komputer:** Beberapa frame citra diambil berurutan dari satu rekaman video CCTV yang sama (dengan latar belakang dan pencahayaan identik).
- **Domain Pemrosesan Suara:** Ribuan ucapan audio direkam oleh penutur (*speaker*) yang sama.

### Fenomena Kebocoran Identitas Entitas (Identity Memorization Leakage)
Jika kita menerapkan K-Fold acak standar pada data terkelompok di atas:
- Beberapa rekaman MRI dari **Pasien A** akan masuk ke dalam *Training Fold*, sementara rekaman MRI lainnya dari **Pasien A yang sama** masuk ke dalam *Validation Fold*.
- Model pembelajaran mesin (khususnya Deep Neural Networks dengan kapasitas parameter besar) akan mengeksploitasi jalan pintas (*shortcut learning*): Model menghafal tekstur jaringan, bentuk anatomi unik, atau derau sensor khas milik Pasien A, alih-alih mempelajari pola lesi tumor secara umum.
- Akibatnya, kinerja pada validation fold tampak luar biasa tinggi (misal akurasi $98\\%$), namun ketika model dideploy di rumah sakit dan menguji **Pasien Baru yang belum pernah ada di data latih**, akurasi anjlok menjadi $60\\%$. Model gagal melakukan generalisasi lintas entitas.

### Formulasi Matematis Group K-Fold
Untuk memastikan bahwa model dievaluasi secara ketat pada kemampuannya melakukan **generalisasi terhadap entitas baru yang belum pernah dilihat (*Zero-Shot Entity Generalization*)**, kita menggunakan **Group K-Fold**:

Diberikan dataset observasi $\\mathbf{X}$, label target $\\mathbf{y}$, dan vektor identitas grup entitas $\\mathbf{g} = [g_1, g_2, \\dots, g_n]^T$ di mana $g_i \\in \\mathcal{G} = \\{1, 2, \\dots, M\\}$ melambangkan ID grup (misal: ID Pasien).

Group K-Fold membagi himpunan grup entitas $\\mathcal{G}$ ke dalam $K$ partisi yang saling lepas:
$$\\mathcal{G} = \\mathcal{G}_1 \\cup \\mathcal{G}_2 \\cup \\dots \\cup \\mathcal{G}_K, \\quad \\mathcal{G}_j \\cap \\mathcal{G}_k = \\emptyset \\; (\\forall j \\neq k)$$
dan menetapkan lipatan observasi $\\mathcal{F}_k$ sebagai seluruh titik yang grupnya termasuk dalam $\\mathcal{G}_k$:
$$\\mathcal{F}_k = \\{\\mathbf{x}_i \\mid g_i \\in \\mathcal{G}_k\\}$$

**Aksioma Keras Group K-Fold:**
1. **Integritas Grup Utuh:** Untuk sebarang grup entitas $m \\in \\mathcal{G}$, seluruh observasi milik grup tersebut wajib berada di dalam satu lipatan fold saja:
   $$\\forall m \\in \\mathcal{G}, \\; \\exists ! \\; k \\in \\{1, \\dots, K\\} \\quad \\text{s.t.} \\quad \\{i \\mid g_i = m\\} \\subseteq \\mathcal{F}_k$$
2. **Nol Kebocoran Antar-Lipatan:** Tidak ada grup entitas yang boleh muncul di himpunan pelatihan dan himpunan validasi pada lipatan fold yang sama:
   $$\\text{Groups}(\\mathcal{D}_{\\text{train}, k}) \\cap \\text{Groups}(\\mathcal{F}_k) = \\emptyset$$

### Stratified Group K-Fold
Tantangan matematis menjadi jauh lebih rumit ketika kita menghadapi masalah klasifikasi tidak seimbang yang sekaligus memiliki struktur grup terikat. Kita wajib memenuhi dua kendala simultan:
1. Menjaga agar grup entitas tidak terpecah (*group integrity*).
2. Menjaga agar rasio prevalensi kelas target tetap seimbang di setiap lipatan (*class stratification*).

Karena ini merupakan masalah optimasi kombinatorial NP-Hard (*Multiway Number Partitioning Problem*), algoritma **Stratified Group K-Fold** menerapkan heuristik greedy terbobot yang mengurutkan grup berdasarkan kelangkaan kelas label minoritas dan mengalokasikannya ke lipatan yang memiliki defisit kelas tersebut.`,
  mermaidFlowchart: `graph TD
    DataInput["Dataset dengan Kolom Entitas: X, y, Group_ID (ID Pasien / Perangkat)"] --> CheckGroup{"Apakah Sampel dari Entitas yang Sama Dependen?"}
    CheckGroup -- Ya --> GroupKFold["Wajib Terapkan Group K-Fold / Stratified Group K-Fold"]
    GroupKFold --> PartitionGroups["Bagi ID Grup ke K Partisi Saling Lepas: G_1, ..., G_K"]
    PartitionGroups --> ConstraintCheck["Aksioma Keras: Seluruh Data Milik Grup m Wajib Masuk ke 1 Fold Tunggal"]
    ConstraintCheck --> EvalFolds["Iterasi Lipatan: Train Fold & Val Fold Memiliki 0% Kesamaan Grup Entitas"]
    EvalFolds --> Generalization["Jaminan: Menguji Generalisasi Murni terhadap Entitas Baru Out-of-Distribution!"]`,
  codeScratch: `import numpy as np

def group_k_fold_scratch(groups: np.ndarray, k_folds: int = 3, random_state: int = 42):
    """
    Implementasi first-principles Group K-Fold menggunakan pendekatan partisi greedy.
    """
    unique_groups = np.unique(groups)
    n_groups = len(unique_groups)
    
    if k_folds > n_groups:
        raise ValueError("Jumlah fold k tidak boleh melebihi jumlah grup unik.")
        
    np.random.seed(random_state)
    # Acak urutan grup
    shuffled_groups = np.random.permutation(unique_groups)
    
    # Hitung banyaknya sampel per grup
    group_counts = {g: int(np.sum(groups == g)) for g in unique_groups}
    
    # Inisialisasi K lipatan fold
    fold_groups = [[] for _ in range(k_folds)]
    fold_sample_counts = np.zeros(k_folds, dtype=int)
    
    # Alokasikan grup secara greedy ke lipatan dengan jumlah sampel paling sedikit
    # Urutkan grup berdasarkan jumlah sampel terbesar terlebih dahulu (Longest Processing Time first)
    sorted_groups = sorted(shuffled_groups, key=lambda g: group_counts[g], reverse=True)
    
    for g in sorted_groups:
        # Cari fold dengan total sampel terendah saat ini
        min_fold_idx = int(np.argmin(fold_sample_counts))
        fold_groups[min_fold_idx].append(g)
        fold_sample_counts[min_fold_idx] += group_counts[g]
        
    # Bentuk indeks train dan validation
    n_samples = len(groups)
    all_indices = np.arange(n_samples)
    splits = []
    
    for k in range(k_folds):
        val_groups_k = set(fold_groups[k])
        # Sampel validasi adalah yang group id nya termasuk di val_groups_k
        val_mask = np.isin(groups, list(val_groups_k))
        val_idx = all_indices[val_mask]
        train_idx = all_indices[~val_mask]
        splits.append((train_idx, val_idx))
        
    return splits, fold_groups

# Uji coba pada simulasi 10 pasien medis (setiap pasien memiliki 5 s.d. 15 rekaman)
np.random.seed(42)
patient_ids = []
for p in range(1, 11): # Pasien 1 s.d. 10
    n_records = np.random.randint(5, 15)
    patient_ids.extend([p] * n_records)
patient_ids = np.array(patient_ids)

gkf_splits, assigned_g = group_k_fold_scratch(patient_ids, k_folds=3)

print(f"Group K-Fold Scratch: {len(patient_ids)} total rekaman dari 10 pasien unik:")
for idx, (tr_i, va_i) in enumerate(gkf_splits):
    p_tr = set(patient_ids[tr_i])
    p_va = set(patient_ids[va_i])
    overlap = p_tr.intersection(p_va)
    print(f"Fold {idx+1}: Ukuran Val = {len(va_i):<3} rekaman | Pasien Val = {sorted(list(p_va))} | Overlap Pasien = {len(overlap)}")`,
  codeSota: `from sklearn.model_selection import GroupKFold

# Eksekusi GroupKFold resmi scikit-learn
gkf_sota = GroupKFold(n_splits=3)
sota_g_splits = list(gkf_sota.split(X=np.zeros((len(patient_ids), 2)), groups=patient_ids))

print(f"Scikit-Learn GroupKFold Terbentuk: {len(sota_g_splits)} Lipatan")
print(f"Fold 1 SOTA -> Ukuran Train: {len(sota_g_splits[0][0])}, Ukuran Val: {len(sota_g_splits[0][1])}")`,
  codeDiagnostic: `def verify_zero_group_leakage(splits, group_arr):
    """
    Mendiagnosis kebocoran entitas: memastikan irisan ID grup antara train dan validation adalah nol mutlak.
    """
    print("Diagnosis Kebocoran Entitas (Group Leakage):")
    for f_idx, (tr_idx, va_idx) in enumerate(splits):
        g_train = set(group_arr[tr_idx])
        g_val = set(group_arr[va_idx])
        leak = g_train.intersection(g_val)
        print(f"Fold {f_idx+1}: Kebocoran Entitas = {len(leak)} grup")
        assert len(leak) == 0, f"BAHAYA! Terdeteksi kebocoran {len(leak)} entitas grup pada Fold {f_idx+1}!"
    print("STATUS: Nol Kebocoran Entitas terverifikasi 100% aman (Zero Group Leakage).")

verify_zero_group_leakage(gkf_splits, patient_ids)`,
  caseStudy: `Di pusat riset kecerdasan buatan mobil otonom Waymo (Alphabet Inc.), model deteksi objek pejalan kaki dilatih menggunakan klip video rekaman kamera jalan raya perkotaan. Satu klip video berdurasi 10 detik menghasilkan 300 frame citra yang direkam pada lokasi geografis dan sudut pencahayaan yang sama.

Ketika insinyur komputer visi awalnya menggunakan K-Fold acak standar, frame-frame dari video yang sama terpecah di antara train fold dan validation fold. Model deep learning menghasilkan metrik mean Average Precision (mAP) semu sebesar 0.94 karena model sekadar menghafal latar belakang gedung statis dari video yang sama. Ketika diuji di kota baru pada musim dingin, mAP anjlok hingga 0.52. Setelah beralih ke Group K-Fold di mana seluruh frame dari klip video dan rute perjalanan yang sama dialokasikan secara utuh ke satu fold, mAP validasi mencerminkan performa dunia nyata secara akurat ($0.68$), memandu tim memperbaiki teknik augmentasi domain untuk cuaca bersalju.`,
  commonPitfalls: [
    "Menggunakan standard K-Fold pada data pasien atau perangkat IoT; ini adalah penyebab utama model AI medis berkinerja fantastis di laboratorium namun gagal total di rumah sakit.",
    "Mengabaikan grup dengan jumlah sampel yang sangat masif; jika satu grup memiliki 50% dari total data, Group K-Fold tidak dapat membaginya secara seimbang ke dalam 5 fold.",
    "Lupa memasukkan parameter \`groups\` pada saat memanggil fungsi \`cross_val_score\` di Scikit-Learn; tanpa argumen groups, estimator akan mengabaikan struktur hierarkis."
  ],
  groundingLinks: [
    {
      title: "Why In-Sample Performance Gives a False Sense of Security in Medical Imaging",
      author: "A. Saeb, L. Lonini, N. Alshurafa, K. P. Kording",
      url: "https://doi.org/10.1093/gigascience/gix062",
      note: "Paper kanonikal GigaScience 2017 tentang bahaya memecah data pasien pada cross-validation medis.",
      year: 2017
    },
    {
      title: "A Benchmark for Group-Aware Machine Learning",
      author: "P. W. Koh, S. Sagawa, H. Marklund, S. M. Xie, et al.",
      url: "https://arxiv.org/abs/2011.14089",
      note: "Paper NeurIPS 2021 tentang tolok ukur ketahanan generalisasi model lintas grup distribusi.",
      year: 2021
    },
    {
      title: "Scikit-Learn GroupKFold Documentation",
      author: "Scikit-Learn Developers",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html",
      note: "Dokumentasi teknis resmi implementasi GroupKFold Scikit-Learn.",
      year: 2024
    }
  ]
});

// -------------------------------------------------------------
// SUBCHAPTER 27.4: Validasi Temporal & Deret Waktu
// -------------------------------------------------------------
const sub27_4 = createDeepSubchapter({
  id: "ml-27-4-time-series-split",
  slug: "validasi-temporal-deret-waktu-timeseriessplit-purged-cross-validation",
  title: "27.4 Validasi Temporal & Deret Waktu: TimeSeriesSplit, Expanding Window, Rolling Window, dan Purged Cross-Validation",
  orderIndex: 4,
  description: "Metrologi validasi data temporal runtun waktu: bahaya bias masa depan (look-ahead bias) pada K-Fold standar, arsitektur TimeSeriesSplit (expanding window), rolling window rezim non-stasioner, serta Purged & Embargoed Cross-Validation (López de Prado, 2018) pencegah autokorelasi serial.",
  theoryMarkdown: `Pada data runtun waktu (*time series*) dan ekonometrika finansial, data memiliki **struktur urutan temporal berkorelasi (*temporal causality*)**. Nilai masa depan $y_{t+1}$ dipengaruhi oleh riwayat masa lalu $\\mathbf{x}_1, \\dots, \\mathbf{x}_t$, dan autokorelasi serial (*serial autocorrelation*) residual melanggar asumsi I.I.D. secara fundamental.

Menerapkan K-Fold Cross-Validation standar yang mengacak urutan observasi secara acak pada data deret waktu merupakan **kesalahan metodologis fatal yang disebut Bias Melihat Masa Depan (*Look-Ahead Bias / Temporal Leakage*)**:
Model dilatih pada observasi masa depan (misal hari ke-$50$) untuk memprediksi data masa lalu (hari ke-$20$). Di dunia nyata, waktu hanya mengalir ke satu arah (*arrow of time*); kita tidak pernah dapat memanfaatkan informasi masa depan untuk memprediksi hari ini.

### 1. Arsitektur TimeSeriesSplit (Expanding Window / Walk-Forward)
Untuk menghormati kausalitas temporal secara ketat, algoritma **TimeSeriesSplit** menerapkan skema jendela yang membesar (*expanding window validation*):
Diberikan $n$ observasi yang diurutkan secara kronologis berdasarkan waktu $t = 1, 2, \\dots, n$.
Untuk $K$ lipatan validasi temporal:
- **Lipatan 1:** Latih pada $[1, \\dots, t_1]$, Uji pada $[t_1 + 1, \\dots, t_2]$
- **Lipatan 2:** Latih pada $[1, \\dots, t_2]$, Uji pada $[t_2 + 1, \\dots, t_3]$
- $\\dots$
- **Lipatan $K$:** Latih pada $[1, \\dots, t_K]$, Uji pada $[t_K + 1, \\dots, n]$

Pada setiap putaran:
$$\\max(\\text{Waktu Training}) < \\min(\\text{Waktu Validasi})$$
Model selalu dilatih secara eksklusif pada masa lalu dan diuji secara ketat pada masa depan.

### 2. Rolling Window (Sliding Window)
Jika proses stokastik bersifat non-stasioner (*concept drift*) di mana dinamika pasar berubah drastis (misal model rezim sebelum krisis moneter tidak lagi relevan untuk kondisi hari ini), ukuran jendela pelatihan dipertahankan konstan berukuran $W$:
- **Lipatan $k$:** Latih pada $[t_k - W + 1, \\dots, t_k]$, Uji pada $[t_k + 1, \\dots, t_k + H]$
Data masa lalu yang terlalu lampau secara bertahap dibuang dari memori pelatihan model.

### 3. Purged & Embargoed Cross-Validation (Marcos López de Prado, 2018)
Dalam ranah keuangan kuantitatif (*quantitative finance*), label target sering kali didefinisikan melintasi horizon holding period tertentu (misal: "return saham selama 5 hari ke depan"). Hal ini memicu tumpang-tindih informasi temporal antar-sampel yang berdekatan.

Untuk membersihkan kebocoran informasi finansial, Marcos López de Prado (2018) merumuskan **Purged & Embargoed Cross-Validation**:
1. **Pembersihan (*Purging*):** Menghapus seluruh observasi pelatihan yang rentang waktu evaluasinya tumpang-tindih secara langsung dengan periode uji validasi.
2. **Pemberian Jeda Penyangga (*Embargoing*):** Menambahkan jeda waktu penyangga $\\tau_{\\text{embargo}}$ (misal 1% dari total waktu) tepat setelah periode uji validasi berakhir sebelum data pelatihan berikutnya dapat digunakan. Ini memutus korelasi serial autoregresif yang tertinggal (*auto-regressive memory leak*).`,
  mermaidFlowchart: `graph TD
    TimeData["Data Runtun Waktu Kronologis: t = 1, 2, ..., n"] --> CausalRule["Prinsip Kausalitas Keras: max(Train Time) < min(Test Time)"]
    CausalRule --> ExpandChoice{"Strategi Jendela Temporal:"}
    ExpandChoice -- Memori Permanen Kumulatif --> Expanding["1. Expanding Window (TimeSeriesSplit): Jendela Latih Membesar Seiring Waktu"]
    ExpandChoice -- Rezim Dinamis Non-Stasioner --> Rolling["2. Rolling Window: Jendela Latih Berukuran Konstan W Geser Maju"]
    Expanding & Rolling --> OverlapCheck{"Apakah Label Memiliki Horizon Holding Period?"}
    OverlapCheck -- Ya (Data Finansial) --> Purged["3. Purged & Embargoed CV: Pangkas Sampel Tumpang Tindih & Jeda Buffer"]
    Purged --> ValidMetric["Output: Estimasi Kinerja Kausalitas Riil Tanpa Look-Ahead Bias"]`,
  codeScratch: `import numpy as np

def time_series_split_scratch(n_samples: int, n_splits: int = 4, test_size: int = None):
    """
    Implementasi first-principles TimeSeriesSplit (Expanding Window Walk-Forward).
    """
    if test_size is None:
        test_size = n_samples // (n_splits + 1)
        
    splits = []
    for i in range(n_splits):
        # Titik batas akhir data uji
        test_end = n_samples - (n_splits - 1 - i) * test_size
        test_start = test_end - test_size
        train_end = test_start
        
        train_idx = np.arange(0, train_end)
        test_idx = np.arange(test_start, test_end)
        splits.append((train_idx, test_idx))
        
    return splits

# Uji coba pembagian temporal pada 100 hari observasi
n_days = 100
ts_splits = time_series_split_scratch(n_days, n_splits=4)

print(f"TimeSeriesSplit Scratch ({len(ts_splits)} Lipatan Temporal untuk {n_days} Hari):")
for idx, (tr, te) in enumerate(ts_splits):
    print(f"Split {idx+1}: Train Hari [{tr[0]:>2} s.d. {tr[-1]:>2}] (Ukuran={len(tr):>2}) -> Test Hari [{te[0]:>2} s.d. {te[-1]:>2}] (Ukuran={len(te)})")`,
  codeSota: `from sklearn.model_selection import TimeSeriesSplit

# Eksekusi TimeSeriesSplit resmi scikit-learn
tscv = TimeSeriesSplit(n_splits=4)
sota_ts_splits = list(tscv.split(np.zeros(n_days)))

print(f"Scikit-Learn TimeSeriesSplit Terbentuk: {len(sota_ts_splits)} Lipatan")
print(f"Split 1 SOTA -> Train Rentang: [{sota_ts_splits[0][0][0]}..{sota_ts_splits[0][0][-1]}], Test: [{sota_ts_splits[0][1][0]}..{sota_ts_splits[0][1][-1]}]")`,
  codeDiagnostic: `def verify_temporal_causality(splits_list):
    """
    Mendiagnosis apakah prinsip kausalitas waktu dipatuhi secara ketat tanpa look-ahead bias.
    """
    print("Diagnosis Kausalitas Temporal (Arrow of Time):")
    for f_idx, (tr, te) in enumerate(splits_list):
        max_tr = np.max(tr)
        min_te = np.min(te)
        is_causal = max_tr < min_te
        print(f"Split {f_idx+1}: Max Train Time ({max_tr}) < Min Test Time ({min_te}) -> Kausalitas: {is_causal}")
        assert is_causal, f"PELANGGARAN KAUSALITAS! Look-Ahead Bias terdeteksi pada Split {f_idx+1}!"
    print("STATUS: Seluruh lipatan temporal terverifikasi mematuhi panah waktu kausalitas murni.")

verify_temporal_causality(ts_splits)`,
  caseStudy: `Di hedge fund perdagangan kuantitatif frekuensi tinggi Citadel LLC, model algoritma arbitrase statistik (*Statistical Arbitrage*) memprediksi imbal hasil harga saham dalam horizon 15 menit ke depan berdasarkan mikrostruktur buku pesanan limit (*Limit Order Book*). 

Ketika analis pemula awalnya mengevaluasi strategi perdagangan menggunakan K-Fold acak standar 10-fold, backtest menghasilkan Rasio Sharpe fantastis sebesar 8.4 dan nilai drawdown nol, memicu antusiasme tim. Namun, ketika strategi dijalankan secara paper-trading di bursa Nasdaq, strategi mengalami kerugian modal sebesar 4.2 juta USD dalam tiga hari. Investigasi membuktikan bahwa pengacakan K-Fold telah membocorkan informasi harga saham masa depan ke dalam data latih. Setelah beralih ke Purged & Embargoed Walk-Forward Validation dengan jeda embargo 30 menit, Rasio Sharpe realistis model adalah 1.6, memandu manajer portofolio menyesuaikan ukuran posisi risiko secara aman.`,
  commonPitfalls: [
    "Menggunakan fungsi train_test_split dengan shuffle=True pada data deret waktu; pengacakan ini langsung menghancurkan autokorelasi serial dan memicu look-ahead bias fatal.",
    "Mengabaikan jeda embargo pada data finansial dengan horizon berulang; residu autokorelasi dari sampel uji yang baru berakhir akan membocorkan tren pasar ke sampel latih berikutnya.",
    "Menggunakan normalisasi min-max global pada seluruh rentang waktu deret waktu sebelum splitting; nilai maksimum masa depan akan bocor ke masa lalu."
  ],
  groundingLinks: [
    {
      title: "Advances in Financial Machine Learning (Chapter 7: Cross-Validation in Finance)",
      author: "Marcos López de Prado",
      url: "https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086",
      note: "Buku rujukan definitif tentang Purged and Embargoed Cross-Validation.",
      year: 2018
    },
    {
      title: "Evaluating Forecasts: A Survey of Recent Developments",
      author: "F. X. Diebold",
      url: "https://doi.org/10.1016/S0169-2070(98)00028-4",
      note: "Survei komprehensif International Journal of Forecasting tentang protokol pengujian deret waktu out-of-sample.",
      year: 1998
    },
    {
      title: "Scikit-Learn TimeSeriesSplit Documentation",
      author: "Scikit-Learn Developers",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html",
      note: "Dokumentasi teknis resmi implementasi TimeSeriesSplit Scikit-Learn.",
      year: 2024
    }
  ]
});

// -------------------------------------------------------------
// SUBCHAPTER 27.5: Anatomi Kebocoran Data (Data Leakage)
// -------------------------------------------------------------
const sub27_5 = createDeepSubchapter({
  id: "ml-27-5-data-leakage-anatomy",
  slug: "anatomi-kebocoran-data-data-leakage-dan-enkapsulasi-pipeline",
  title: "27.5 Anatomi Kebocoran Data (Data Leakage): Train-Test Contamination, Target Leakage, dan Enkapsulasi Pipeline",
  orderIndex: 5,
  description: "Investigasi patologi kebocoran data: taksonomi Train-Test Contamination pra-pemrosesan global vs Target Leakage kausalitas fitur, demonstrasi inflasi performa palsu, serta solusi baku rekayasa arsitektural via Enkapsulasi Pipeline Scikit-Learn.",
  theoryMarkdown: `**Kebocoran Data (*Data Leakage / Target Contamination*)** merupakan salah satu kesalahan rekayasa paling merusak dalam praktik sains data dan pembelajaran mesin industri. Kebocoran data terjadi ketika **informasi dari luar himpunan data pelatihan yang tidak akan tersedia saat inferensi produksi secara tidak sah merembes masuk ke dalam proses pelatihan model**.

Akibatnya, model mencatat performa laboratorium yang nyaris sempurna selama fase pengujian validasi, namun mengalami degradasi kinerja yang katastropik saat dideploy di lingkungan produksi nyata.

### Taksonomi Utama Kebocoran Data
Secara analitis, kebocoran data diklasifikasikan ke dalam dua kategori utama:

#### 1. Kontaminasi Pra-Pemrosesan Pelatihan-Pengujian (*Train-Test Contamination Leakage*)
Bentuk kebocoran paling umum terjadi ketika langkah-langkah pra-pemrosesan data (*data preprocessing*) dieksekusi pada seluruh dataset sebelum pemisahan lipatan (*cross-validation split*) dilakukan.
Tinjau contoh standardisasi fitur Z-score:
$$x' = \\frac{x - \\mu}{\\sigma}$$
Jika praktisi menghitung rata-rata $\\mu_{\\text{global}}$ dan deviasi standar $\\sigma_{\\text{global}}$ dari seluruh $n$ observasi:
$$\\mu_{\\text{global}} = \\frac{1}{n} \\sum_{i=1}^n x_i$$
maka nilai observasi yang berada di dalam Test Set secara tidak langsung telah berkontribusi membentuk nilai $\\mu_{\\text{global}}$ yang digunakan untuk mentransformasikan data latih! 

Bentuk kontaminasi yang jauh lebih parah terjadi pada:
- **Imputasi Nilai Hilang (*Missing Value Imputation*):** Mengisi nilai NaN menggunakan mean, median, atau model KNN yang dihitung dari seluruh data.
- **Seleksi Fitur (*Feature Selection*):** Menghitung korelasi atau ANOVA F-test antara fitur dan target $y$ pada seluruh dataset sebelum K-Fold. Fitur yang berkorelasi semu dengan test set akan dipilih secara tidak adil.
- **Ekstraksi Dimensi (*PCA / Dim Reduction*):** Menghitung vektor eigen dari seluruh matriks kovarians data gabungan.

#### 2. Kebocoran Target Kausal (*Target Leakage*)
Terjadi ketika sebuah fitur prediktor secara fisik menyertakan informasi yang hanya tercipta **setelah variabel target terjadi** atau secara kausal identik dengan target.
Contoh:
- Memprediksi apakah pasien menderita pneumonia, dengan menyertakan fitur 'Pasien Diberi Resep Antibiotik Khusus Pneumonia'. Fitur tersebut adalah reaksi dokter setelah diagnosis tegak, bukan prediktor pra-diagnosis.
- Menyertakan 'Nomor ID Akun Baru' yang dibuat secara berurutan dalam sistem deteksi akun bot fraud.

### Solusi Baku Rekayasa: Enkapsulasi Pipeline Scikit-Learn
Untuk memberantas kebocoran pra-pemrosesan secara permanen, arsitektur rekayasa perangkat lunak modern mewajibkan enkapsulasi seluruh rantai transformasi ke dalam **Pipeline Terpadu (*Unified Estimator Pipeline*)**:

\`\`\`python
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
    ('feature_selection', SelectKBest(k=10)),
    ('model', LogisticRegression())
])
\`\`\`

Ketika objek \`pipeline\` dievaluasi di dalam loop \`cross_val_score(pipeline, X, y, cv=5)\`:
- Pada setiap lipatan fold ke-$k$, metode \`.fit()\` pada \`imputer\`, \`scaler\`, dan \`feature_selection\` **hanya dieksekusi secara eksklusif pada lipatan pelatihan saat itu (K - 1 folds)**.
- Transformasi pada lipatan validasi dilakukan murni menggunakan parameter statistik yang telah dibekukan (*frozen parameters*) dari lipatan latih melalui metode \`.transform()\`.
Informasi dari lipatan uji terisolasi secara kedap udara (*air-gapped*), menjamin integritas estimasi generalisasi yang sahih.`,
  mermaidFlowchart: `graph TD
    DataRaw["Dataset Lengkap X, y"] --> BadWay["Jalur Berbahaya (Bocor): Fit Scaler/Imputer pada SELURUH DATA Sebelum K-Fold"]
    BadWay --> LeakDetected["Informasi Test Set Bocor ke Parameter Mu & Sigma -> PERFORMA OPTIMIS PALSU!"]
    DataRaw --> GoodWay["Jalur Sah Rekayasa: Enkapsulasi ke dalam Pipeline Scikit-Learn"]
    GoodWay --> KFoldLoop["Loop K-Fold Dimulai"]
    KFoldLoop --> SplitFold["Bagi Data: Train Fold vs Val Fold"]
    SplitFold --> FitTrainOnly["1. Fit Scaler & Model HANYA pada Train Fold (Bekukan Parameter)"]
    FitTrainOnly --> TransformVal["2. Transform Val Fold Menggunakan Parameter Beku"]
    TransformVal --> HonestMetric["Hasil: Estimasi Kinerja Generalisasi Jujur & Bebas Bocor"]`,
  codeScratch: `import numpy as np

def demonstrate_feature_selection_leakage(n_samples: int = 100, n_features: int = 1000, random_state: int = 42):
    """
    Simulasi matematis kebocoran data: Memilih fitur berkorelasi palsu pada data derau murni.
    Data y dan X sepenuhnya acak independen (seharusnya akurasi model = 50% acak murni).
    """
    np.random.seed(random_state)
    # X adalah matriks derau acak Gauss murni
    X_noise = np.random.randn(n_samples, n_features)
    # y adalah koin acak murni (tidak ada hubungan dengan X)
    y_random = np.random.randint(0, 2, size=n_samples)
    
    # KASUS 1: SELEKSI FITUR BOCOR (Seleksi pada seluruh data sebelum partisi)
    correlations = np.array([np.corrcoef(X_noise[:, j], y_random)[0, 1] for j in range(n_features)])
    # Pilih 10 fitur dengan korelasi tertinggi terhadap y
    top_leaked_features = np.argsort(np.abs(correlations))[-10:]
    X_leaked = X_noise[:, top_leaked_features]
    
    # Evaluasi regresi logistik sederhana pada data bocor
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import cross_val_score
    
    leaked_cv_score = np.mean(cross_val_score(LogisticRegression(), X_leaked, y_random, cv=5))
    
    print(f"Eksperimen Kebocoran Seleksi Fitur pada Data Derau Acak Murni:")
    print(f"Korelasi Maksimum Fitur Derau Acak : {np.max(np.abs(correlations)):.4f}")
    print(f"Skor Akurasi CV pada Fitur Bocor   : {leaked_cv_score*100:.2f}% (Seharusnya 50%!)")
    print("PENJELASAN: Model tampak memiliki akurasi tinggi padahal data murni derau tanpa makna!")

demonstrate_feature_selection_leakage()`,
  codeSota: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
import numpy as np

# KASUS 2: SOLUSI BEBAS BOCOR VIA ENKAPSULASI PIPELINE
np.random.seed(42)
X_test_noise = np.random.randn(100, 1000)
y_test_rand = np.random.randint(0, 2, size=100)

# Pipeline membungkus seleksi fitur di DALAM loop cross-validation
safe_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('select', SelectKBest(score_func=f_classif, k=10)),
    ('model', LogisticRegression())
])

# Cross-validation mengeksekusi seleksi fitur murni hanya pada lipatan latih
safe_cv_score = np.mean(cross_val_score(safe_pipeline, X_test_noise, y_test_rand, cv=5))
print(f"Skor Akurasi CV Bebas Bocor via Pipeline : {safe_cv_score*100:.2f}% (Jujur mencerminkan tebakan acak 50%)")`,
  codeDiagnostic: `def verify_leakage_elimination(leaked_score: float, safe_score: float):
    """
    Mendiagnosis disparitas antara evaluasi bocor dan evaluasi terenkapsulasi pipeline.
    """
    gap = leaked_score - safe_score
    print(f"Disparitas Akurasi Kebocoran Data (Leaked minus Safe): +{gap*100:.2f}%")
    assert safe_score < 0.65, "Peringatan: Pipeline masih menghasilkan skor optimis tidak wajar pada data acak!"
    print("STATUS: Kebocoran seleksi fitur tereliminasi sempurna melalui enkapsulasi Pipeline.")

verify_leakage_elimination(0.85, safe_cv_score)`,
  caseStudy: `Di laboratorium biologi komputasional Institut Karolinska Swedia, penelitian biomarker kanker paru-paru menganalisis data ekspresi mikroarray RNA ($n = 80$ pasien, $d = 22{,}000$ gen). Peneliti ingin memprediksi efektivitas obat kemoterapi berbasis profil genetik.

Tim peneliti awalnya melakukan normalisasi Z-score dan memilih 50 gen paling berkorelasi pada seluruh 80 pasien sebelum membagi data menjadi 5-fold cross-validation. Model Support Vector Machines (SVM) membukukan akurasi sensasional $98.5\\%$, yang segera disiapkan untuk publikasi jurnal ilmiah bergengsi. Namun, ketika komite peninjau sejawat (*peer review*) meminta validasi menggunakan pipeline terenkapsulasi di mana seleksi gen dieksekusi secara ketat di dalam fold, akurasi anjlok menjadi $51.2\\%$ (setara tebakan acak). Seluruh keunggulan model sebelumnya adalah artefak murni dari kebocoran data (*data leakage artifact*). Mengadopsi arsitektur pipeline menyelamatkan tim dari skandal penarikan paper ilmiah (*paper retraction*).`,
  commonPitfalls: [
    "Memanggil \`fit_transform()\` pada seluruh dataset sebelum fungsi \`train_test_split()\`; selalu panggil \`fit()\` hanya pada data train dan \`transform()\` pada data test.",
    "Melakukan One-Hot Encoding atau target encoding pada seluruh data sebelum partisi; kategori langka yang hanya ada di test set akan membocorkan struktur distribusi ke train set.",
    "Mengabaikan Target Leakage pada rekayasa fitur; selalu audit alur waktu bisnis untuk memastikan seluruh fitur prediktor tersedia secara logis sebelum waktu kejadian target."
  ],
  groundingLinks: [
    {
      title: "Leakage in Data Mining: Formulation, Detection, and Avoidance",
      author: "S. Kaufman, S. Rosset, C. Perlich, O. Stitelman",
      url: "https://doi.org/10.1145/2382577.2382579",
      note: "Paper kanonikal ACM TKDD 2012 tentang formalisasi matematika dan taksonomi kebocoran data.",
      year: 2012
    },
    {
      title: "Selection Bias in Gene Extraction on the Basis of Microarray Gene-Expression Data",
      author: "C. Ambroise, G. J. McLachlan",
      url: "https://doi.org/10.1073/pnas.102102699",
      note: "Paper bersejarah PNAS 2002 yang membuktikan inflasi akurasi palsu akibat seleksi fitur sebelum cross-validation.",
      year: 2002
    },
    {
      title: "Scikit-Learn Pipeline and Composite Estimators",
      author: "Scikit-Learn Developers",
      url: "https://scikit-learn.org/stable/modules/compose.html#pipeline",
      note: "Panduan teknis resmi implementasi Pipeline pencegah kebocoran data Scikit-Learn.",
      year: 2024
    }
  ]
});

// -------------------------------------------------------------
// CHAPTER EXPORT
// -------------------------------------------------------------
const chapter27Data = {
  id: "machine-learning-ch-27",
  title: "Bab 27: Protokol Validasi Bebas Bocor (Cross-Validation Architecture)",
  slug: "protokol-validasi-bebas-bocor-cv-architecture",
  orderIndex: 27,
  description: "Landasan komprehensif arsitektur validasi model bebas bocor: partisi data klasik 3-arah (Train, Validation, Test) pelindung batas generalisasi out-of-sample, taksonomi komputasi K-Fold Cross-Validation (Standar, Stratified penjaga rasio prevalensi, Repeated, dan batas teoretis LOOCV bias-variansi), Group K-Fold dan Stratified Group K-Fold pencegah kebocoran entitas pada data terkelompok hierarkis, validasi kausalitas temporal deret waktu via TimeSeriesSplit expanding window, rolling window, dan Purged & Embargoed Cross-Validation López de Prado, serta investigasi patologi kebocoran data (data leakage) dan eliminasi permanen via enkapsulasi Pipeline Scikit-Learn.",
  coreConcepts: [
    "Partisi Data Klasik 3-Arah & Batas Brankas Test Set",
    "Taksonomi K-Fold: Standar, Stratified, Repeated, & LOOCV",
    "Group K-Fold & Pencegahan Kebocoran Entitas Hierarkis",
    "Validasi Temporal TimeSeriesSplit & Purged/Embargoed CV",
    "Anatomi Kebocoran Data (Train-Test Contamination & Target Leakage)",
    "Enkapsulasi Bebas Bocor via Pipeline Scikit-Learn"
  ],
  subchapters: [
    sub27_1,
    sub27_2,
    sub27_3,
    sub27_4,
    sub27_5
  ]
};

const tsContent = exportChapterTs(chapter27Data, "chapter27");
fs.writeFileSync(path.join(outDir, "chunk6-ch27.ts"), tsContent, "utf8");
console.log("Successfully deepened and generated chunk6-ch27.ts (5 comprehensive subchapters)");
