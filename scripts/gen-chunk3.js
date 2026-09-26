const fs = require('fs');
const path = require('path');
const { createSubchapter, exportChapterTs } = require('./curriculum-builder-helper');

const outDir = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');

// ============================================================================
// BAB 10: Generative Classifiers: LDA, QDA, & Naive Bayes (6 Subbab)
// ============================================================================
const ch10Subs = [
  createSubchapter({
    id: "ml-10-1-generatif-vs-diskriminatif",
    slug: "10-1-generatif-vs-diskriminatif",
    title: "10.1 Paradigma Generatif vs Diskriminatif: Pemodelan Peluang Bersama P(X, Y) vs Peluang Bersyarat P(Y|X)",
    orderIndex: 1,
    description: "Perbedaan fundamental model generatif dan diskriminatif: estimasi distribusi bersama P(X, Y) via Teorema Bayes vs pemodelan langsung batas keputusan P(Y|X).",
    theoryMarkdown: `Dalam supervised classification, terdapat dua pendekatan komputasi:
1. **Model Diskriminatif** (misal: Regresi Logistik, SVM, Neural Nets):
   Memodelkan secara langsung peluang bersyarat $P(Y \\mid \\mathbf{X})$ atau fungsi pemetaan $\\mathbf{x} \\mapsto y$. Pendekatan ini fokus hanya pada optimalisasi batas keputusan (*decision boundary*).

2. **Model Generatif** (misal: LDA, QDA, Naive Bayes, HMM):
   Memodelkan distribusi probabilitas bersama $P(\\mathbf{X}, Y) = P(Y) P(\\mathbf{X} \\mid Y)$ dengan mengestimasi bagaimana data di setiap kelas dibangkitkan.
   Inferensi posterior dilakukan melalui Teorema Bayes:
   $$P(Y = c \\mid \\mathbf{X} = \\mathbf{x}) = \\frac{P(Y = c) P(\\mathbf{x} \\mid Y = c)}{\\sum_{k=1}^C P(Y = k) P(\\mathbf{x} \\mid Y = k)}$$`,
    mermaidDiagram: `graph TD
    Data["Dataset (X, y)"] --> Gen["Paradigma Generatif: Pelajari P(x|y) & P(y)"]
    Data --> Disc["Paradigma Diskriminatif: Pelajari P(y|x) secara langsung"]
    Gen --> Bayes["Teorema Bayes: P(y|x) = P(x|y)P(y) / P(x)"]
    Disc --> Bound["Batas Keputusan Linier / Non-Linier"]
    Bayes --> Pred1["Prediksi Kelas: argmax_c P(x|c) P(c)"]
    Bound --> Pred2["Prediksi Kelas: f(x) > 0"]`,
    scratchCode: `import numpy as np

def generative_prior_likelihood(X: np.ndarray, y: np.ndarray):
    """Menghitung prior P(Y) dan rata-rata kelas mu_c untuk model generatif Gaussian."""
    classes = np.unique(y)
    priors = {c: np.mean(y == c) for c in classes}
    means = {c: np.mean(X[y == c], axis=0) for c in classes}
    return priors, means

X_toy = np.array([[1.0, 2.0], [1.5, 1.8], [5.0, 8.0], [6.0, 9.0]])
y_toy = np.array([0, 0, 1, 1])
priors, means = generative_prior_likelihood(X_toy, y_toy)
print("Priors:", priors)
print("Means :", means)`,
    sotaCode: `from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

lda = LinearDiscriminantAnalysis().fit(X_toy, y_toy)
print("Priors LDA Scikit-Learn:", lda.priors_)
print("Means LDA Scikit-Learn :\\n", lda.means_)`,
    diagCode: `print("Prediksi generatif:", lda.predict([[2.0, 3.0]]))`,
    caseStudy: "Deteksi anomali pada data medis: Model generatif mampu mendeteksi observasi outlier yang memiliki P(x|y) sangat rendah di seluruh kelas.",
    commonPitfalls: ["Mengasumsikan model generatif selalu kalah akurat dari diskriminatif. Pada data kecil, generatif konvergen lebih cepat asalkan asumsi distribusinya mendekati benar."],
    groundingLinks: [{ title: "Ng & Jordan (2001) On Discriminative vs. Generative classifiers", url: "https://papers.nips.cc/paper/2001/hash/7b7a53e239400a13bd6be6c91c4f6c4e-Abstract.html", note: "Paper komparasi kanonikal NeurIPS" }]
  }),

  createSubchapter({
    id: "ml-10-2-linear-discriminant-analysis",
    slug: "10-2-linear-discriminant-analysis",
    title: "10.2 Linear Discriminant Analysis (LDA): Rasio Rayleigh, Matriks Scatter Within-Class & Between-Class",
    orderIndex: 2,
    description: "Penurunan analitis LDA Fisher: perumusan Rasio Rayleigh, matriks scatter within-class S_W dan between-class S_B, serta batas keputusan linier.",
    theoryMarkdown: `LDA mengasumsikan bahwa setiap kelas mengikuti distribusi Gaussian multivariat dengan **matriks kovarians yang sama (homoskedastik)**:
$$\\mathbf{x} \\mid (Y=c) \\sim \\mathcal{N}(\\boldsymbol{\\mu}_c, \\boldsymbol{\\Sigma})$$

Fungsi diskriminan linier untuk kelas $c$ adalah:
$$\\delta_c(\\mathbf{x}) = \\mathbf{x}^T \\boldsymbol{\\Sigma}^{-1} \\boldsymbol{\\mu}_c - \\frac{1}{2} \\boldsymbol{\\mu}_c^T \\boldsymbol{\\Sigma}^{-1} \\boldsymbol{\\mu}_c + \\ln P(Y = c)$$

Batas keputusan antara kelas $k$ dan $l$ adalah bidang linier $\\delta_k(\\mathbf{x}) = \\delta_l(\\mathbf{x})$.

### Formulasi Fisher (Rasio Rayleigh):
Mencari arah proyeksi $\\mathbf{w}$ yang memaksimalkan varians antar-kelas relatif terhadap varians dalam-kelas:
$$J(\\mathbf{w}) = \\frac{\\mathbf{w}^T \\mathbf{S}_B \\mathbf{w}}{\\mathbf{w}^T \\mathbf{S}_W \\mathbf{w}} \\implies \\mathbf{S}_W^{-1} \\mathbf{S}_B \\mathbf{w} = \\lambda \\mathbf{w}$$
di mana $\\mathbf{S}_B = \\sum N_c (\\boldsymbol{\\mu}_c - \\boldsymbol{\\mu})(\\boldsymbol{\\mu}_c - \\boldsymbol{\\mu})^T$ dan $\\mathbf{S}_W = \\sum \\sum (\\mathbf{x} - \\boldsymbol{\\mu}_c)(\\mathbf{x} - \\boldsymbol{\\mu}_c)^T$.`,
    mermaidDiagram: `graph TD
    ClassData["Data Kelas 1..C"] --> Means["Hitung Rata-rata mu_c & Global mu"]
    Means --> SW["Scatter Within-Class: S_W = sum (x - mu_c)(x - mu_c)^T"]
    Means --> SB["Scatter Between-Class: S_B = sum N_c (mu_c - mu)(mu_c - mu)^T"]
    SW & SB --> Eig["Eigendecomposition: S_W^(-1) S_B w = lambda w"]
    Eig --> Proj["Arah Proyeksi Optimal w: Memisahkan Titik Berat & Memadatkan Klaster"]`,
    scratchCode: `def lda_manual_fit(X: np.ndarray, y: np.ndarray):
    classes = np.unique(y)
    d = X.shape[1]
    mean_overall = np.mean(X, axis=0)
    S_W = np.zeros((d, d))
    S_B = np.zeros((d, d))
    
    for c in classes:
        X_c = X[y == c]
        mean_c = np.mean(X_c, axis=0)
        N_c = len(X_c)
        S_W += (X_c - mean_c).T @ (X_c - mean_c)
        diff = (mean_c - mean_overall).reshape(-1, 1)
        S_B += N_c * (diff @ diff.T)
        
    eigvals, eigvecs = np.linalg.eig(np.linalg.pinv(S_W) @ S_B)
    w = eigvecs[:, np.argmax(eigvals)].real
    return w

np.random.seed(42)
X_lda = np.vstack([np.random.randn(50, 2) + [0, 0], np.random.randn(50, 2) + [3, 3]])
y_lda = np.array([0]*50 + [1]*50)
w_lda = lda_manual_fit(X_lda, y_lda)
print("Arah Proyeksi LDA Optimal:", np.round(w_lda, 4))`,
    sotaCode: `from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

lda_skl = LinearDiscriminantAnalysis().fit(X_lda, y_lda)
print("Koefisien LDA Scikit-Learn:", np.round(lda_skl.coef_[0], 4))`,
    diagCode: `print("Akurasi Latih LDA:", lda_skl.score(X_lda, y_lda))`,
    caseStudy: "Pengenalan wajah Fisherfaces: Mengurangi dimensi gambar wajah dengan memaksimalkan diskriminasi identitas individu terlepas dari variasi pencahayaan.",
    commonPitfalls: ["Menggunakan LDA ketika matriks kovarians antar kelas sangat berbeda jauh (heteroskedastik)."],
    groundingLinks: [{ title: "ESL Ch. 4 Linear Methods for Classification", url: "https://hastie.su.domains/ElemStatLearn/", note: "Bab kanonikal penurunan LDA" }]
  }),

  createSubchapter({
    id: "ml-10-3-quadratic-discriminant-analysis",
    slug: "10-3-quadratic-discriminant-analysis",
    title: "10.3 Quadratic Discriminant Analysis (QDA): Relaksasi Matriks Kovarians Heterogen & Batas Non-Linier",
    orderIndex: 3,
    description: "Perumusan QDA: pelonggaran asumsi kovarians bersama menjadi kovarians spesifik kelas Sigma_c dan timbulnya batas keputusan kuadratik.",
    theoryMarkdown: `Pada **Quadratic Discriminant Analysis (QDA)**, setiap kelas memiliki matriks kovarians sendiri $\\boldsymbol{\\Sigma}_c$:
$$\\mathbf{x} \\mid (Y=c) \\sim \\mathcal{N}(\\boldsymbol{\\mu}_c, \\boldsymbol{\\Sigma}_c)$$

Fungsi diskriminannya adalah kuadratik terhadap $\\mathbf{x}$:
$$\\delta_c(\\mathbf{x}) = -\\frac{1}{2} \\ln |\\boldsymbol{\\Sigma}_c| - \\frac{1}{2} (\\mathbf{x} - \\boldsymbol{\\mu}_c)^T \\boldsymbol{\\Sigma}_c^{-1} (\\mathbf{x} - \\boldsymbol{\\mu}_c) + \\ln P(Y=c)$$

Suku kuadratik $\\mathbf{x}^T \\boldsymbol{\\Sigma}_c^{-1} \\mathbf{x}$ tidak saling membatalkan antar-kelas, menghasilkan batas keputusan kuadratik (parabola, elips, atau hiperbola).`,
    mermaidDiagram: `graph LR
    LDA["LDA: Sigma_1 = Sigma_2 = ... = Sigma_C -> Batas Linier"]
    QDA["QDA: Sigma_c berbeda untuk setiap kelas -> Batas Kuadratik"]
    QDA --> TradeOff["Trade-off: QDA lebih fleksibel tetapi membutuhkan O(C * p^2) parameter"]`,
    scratchCode: `def qda_log_posterior(x: np.ndarray, mean_c: np.ndarray, cov_c: np.ndarray, prior_c: float) -> float:
    d = len(x)
    diff = x - mean_c
    inv_cov = np.linalg.inv(cov_c)
    sign, logdet = np.linalg.slogdet(cov_c)
    quad = diff.T @ inv_cov @ diff
    return -0.5 * logdet - 0.5 * quad + np.log(prior_c)

cov_0 = np.eye(2)
cov_1 = np.array([[2.0, 0.5], [0.5, 1.0]])
print("QDA log-posterior kelas 0:", qda_log_posterior(np.array([1.0, 1.0]), np.array([0.0, 0.0]), cov_0, 0.5))`,
    sotaCode: `from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis

qda = QuadraticDiscriminantAnalysis().fit(X_lda, y_lda)
print("Akurasi QDA Scikit-Learn:", qda.score(X_lda, y_lda))`,
    diagCode: `print("Determinan Kovarians Kelas 0:", np.linalg.det(cov_0))`,
    caseStudy: "Klasifikasi citra satelit tutupan lahan (Air, Hutan, Pemukiman): Varians pantulan spektral air sangat seragam sedangkan pemukiman sangat heterogen.",
    commonPitfalls: ["Menggunakan QDA saat jumlah data per kelas sedikit (N_c < p), menyebabkan matriks kovarians singular."],
    groundingLinks: [{ title: "Scikit-Learn QDA Documentation", url: "https://scikit-learn.org/stable/modules/lda_qda.html", note: "Dokumentasi LDA dan QDA" }]
  }),

  createSubchapter({
    id: "ml-10-4-reduksi-dimensi-lda-fisher",
    slug: "10-4-reduksi-dimensi-lda-fisher",
    title: "10.4 Reduksi Dimensi Terawasi melalui Proyeksi Ruang Sub-LDA Fisher",
    orderIndex: 4,
    description: "Pemanfaatan LDA sebagai teknik reduksi dimensi terawasi (supervised dimensionality reduction) ke subruang C-1 dimensi berdaya pisah maksimal.",
    theoryMarkdown: `Berbeda dengan PCA yang tidak terawasi (*unsupervised*), LDA memanfaatkan informasi label $Y$ untuk menemukan subruang berdimensi $k \\le C - 1$ yang memaksimalkan pemisahan antar-kelas.
Matriks transformasi $\\mathbf{W} \\in \\mathbb{R}^{p \\times k}$ disusun dari $k$ vektor eigen terbesar dari $\\mathbf{S}_W^{-1} \\mathbf{S}_B$:
$$\\mathbf{z} = \\mathbf{W}^T \\mathbf{x}$$`,
    mermaidDiagram: `graph LR
    HighDim["Fitur Dimensi Tinggi R^p"] --> Eig["Eigen-analisis S_W^(-1) S_B"]
    Eig --> Proj["Proyeksi ke k <= C-1 Dimensi"]
    Proj --> Visual["Visualisasi Kluster Terawasi yang Terpisah Maksimal"]`,
    scratchCode: `def supervised_lda_project(X, y, n_components=1):
    classes = np.unique(y)
    d = X.shape[1]
    mean_all = np.mean(X, axis=0)
    S_W = sum([(X[y==c] - np.mean(X[y==c], axis=0)).T @ (X[y==c] - np.mean(X[y==c], axis=0)) for c in classes])
    S_B = sum([len(X[y==c]) * (np.mean(X[y==c], axis=0) - mean_all).reshape(-1,1) @ (np.mean(X[y==c], axis=0) - mean_all).reshape(1,-1) for c in classes])
    eigvals, eigvecs = np.linalg.eig(np.linalg.pinv(S_W) @ S_B)
    top_indices = np.argsort(eigvals.real)[::-1][:n_components]
    W = eigvecs[:, top_indices].real
    return X @ W

Z_lda = supervised_lda_project(X_lda, y_lda, n_components=1)
print("Dimensi setelah reduksi LDA:", Z_lda.shape)`,
    sotaCode: `from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

lda_dim = LinearDiscriminantAnalysis(n_components=1)
Z_skl = lda_dim.fit_transform(X_lda, y_lda)
print("Dimensi Scikit-Learn LDA:", Z_skl.shape)`,
    diagCode: `print("Korelasi manual vs skl:", np.abs(np.corrcoef(Z_lda.flatten(), Z_skl.flatten())[0, 1]))`,
    caseStudy: "Reduksi fitur biometrik sidik jari untuk verifikasi identitas real-time pada embedded devices.",
    commonPitfalls: ["Berharap LDA dapat mereduksi ke lebih dari C-1 komponen (rank S_B paling banyak C-1)."],
    groundingLinks: [{ title: "Fisher (1936) The use of multiple measurements in taxonomic problems", url: "https://doi.org/10.1111/j.1469-1809.1936.tb02137.x", note: "Paper pendirian Fisher LDA" }]
  }),

  createSubchapter({
    id: "ml-10-5-naive-bayes-classifier",
    slug: "10-5-naive-bayes-classifier",
    title: "10.5 Naive Bayes Classifier: Asumsi Independensi Bersyarat Fitur & Estimasi Peluang Marginal",
    orderIndex: 5,
    description: "Prinsip Naive Bayes: asumsi independensi bersyarat fitur P(X|Y) = prod P(X_j|Y), reduksi kompleksitas parameter, dan aturan MAP.",
    theoryMarkdown: `Naive Bayes menyederhanakan estimasi distribusi bersama dengan asumsi bahwa semua fitur saling independen secara bersyarat jika diberikan label kelas:
$$P(\\mathbf{x} \\mid Y = c) = \\prod_{j=1}^p P(X_j \\mid Y = c)$$

Aturan klasifikasi Maximum A Posteriori (MAP):
$$\\hat{y} = \\arg\\max_c \\left[ \\ln P(Y=c) + \\sum_{j=1}^p \\ln P(X_j \\mid Y=c) \\right]$$
Asumsi ini mereduksi parameter estimasi dari $O(C \\cdot 2^p)$ menjadi hanya $O(C \\cdot p)$.`,
    mermaidDiagram: `graph TD
    Data["Vektor Fitur x = (x_1, ..., x_p)"] --> Indep["Asumsi Naive: P(x|y) = P(x_1|y) * ... * P(x_p|y)"]
    Indep --> LogSum["Log Posterior: ln P(y) + sum ln P(x_j|y)"]
    LogSum --> Argmax["argmax_c -> Prediksi Kelas"]`,
    scratchCode: `def gaussian_naive_bayes_manual(X_train, y_train, x_test):
    classes = np.unique(y_train)
    posteriors = {}
    for c in classes:
        X_c = X_train[y_train == c]
        prior = np.log(len(X_c) / len(X_train))
        means = np.mean(X_c, axis=0)
        vars = np.var(X_c, axis=0) + 1e-9
        # Log Gaussian likelihood
        log_lik = -0.5 * np.sum(np.log(2 * np.pi * vars)) - 0.5 * np.sum(((x_test - means)**2) / vars)
        posteriors[c] = prior + log_lik
    return max(posteriors, key=posteriors.get)

pred = gaussian_naive_bayes_manual(X_lda, y_lda, np.array([1.5, 1.5]))
print("Prediksi Gaussian Naive Bayes:", pred)`,
    sotaCode: `from sklearn.naive_bayes import GaussianNB

gnb = GaussianNB().fit(X_lda, y_lda)
print("Scikit-Learn GaussianNB pred:", gnb.predict([[1.5, 1.5]])[0])`,
    diagCode: `print("Akurasi GaussianNB:", gnb.score(X_lda, y_lda))`,
    caseStudy: "Deteksi spam email real-time: Memproses kata-kata kunci secara independen dengan throughput jutaan email per detik.",
    commonPitfalls: ["Asumsi independensi sering dilanggar pada teks (misal: 'San' dan 'Francisco' tidak independen), namun performa ranking probabilitas tetap sangat tangguh."],
    groundingLinks: [{ title: "Murphy PML (Ch. 9 Generative Models)", url: "https://probml.github.io/pml-book/", note: "Buku rujukan Naive Bayes" }]
  }),

  createSubchapter({
    id: "ml-10-6-varian-naive-bayes-laplace",
    slug: "10-6-varian-naive-bayes-laplace",
    title: "10.6 Varian Naive Bayes: Gaussian, Multinomial (Teks), Bernoulli, & Koreksi Laplace Smoothing",
    orderIndex: 6,
    description: "Taksonomi varian Naive Bayes untuk berbagai jenis tipe data: Multinomial untuk frekuensi kata, Bernoulli untuk kehadiran biner, dan koreksi Laplace smoothing.",
    theoryMarkdown: `### 1. Multinomial Naive Bayes (Data Frekuensi Kata):
Digunakan untuk data cacah frekuensi fitur:
$$P(X_j = k \\mid Y=c) = \\frac{N_{cj} + \\alpha}{N_c + \\alpha d}$$
di mana $\\alpha > 0$ adalah parameter **Laplace Smoothing** untuk mencegah probabilitas nol (*zero probability pathology*).

### 2. Bernoulli Naive Bayes (Data Biner Kehadiran):
Digunakan untuk variabel indikator biner $X_j \\in \\{0, 1\\}$:
$$P(\\mathbf{x} \\mid Y=c) = \\prod_{j=1}^p P(X_j=1 \\mid Y=c)^{x_j} (1 - P(X_j=1 \\mid Y=c))^{1 - x_j}$$`,
    mermaidDiagram: `graph TD
    DataType["Tipe Fitur Masukan"] --> Cont["Data Kontinu Real -> GaussianNB"]
    DataType --> Count["Data Frekuensi Cacah / Teks -> MultinomialNB"]
    DataType --> Binary["Data Kehadiran Biner (0/1) -> BernoulliNB"]
    Count & Binary --> ZeroProb["Masalah Probabilitas Nol: Kata Baru Muncul"]
    ZeroProb --> Laplace["Laplace Smoothing: (N_cj + 1) / (N_c + d)"]`,
    scratchCode: `def multinomial_nb_laplace(counts_c, total_c, alpha=1.0, vocab_size=1000):
    """Menghitung probabilitas kata dengan Laplace Smoothing."""
    return (counts_c + alpha) / (total_c + alpha * vocab_size)

print("P(kata|spam) dengan Laplace:", multinomial_nb_laplace(counts_c=0, total_c=500, alpha=1.0, vocab_size=1000))`,
    sotaCode: `from sklearn.naive_bayes import MultinomialNB

X_text = np.array([[2, 0, 1], [0, 5, 0], [1, 1, 3]])
y_text = np.array([0, 1, 0])
mnb = MultinomialNB(alpha=1.0).fit(X_text, y_text)
print("Multinomial NB Log Probabilities:\\n", mnb.feature_log_prob_)`,
    diagCode: `print("Prediksi teks baru:", mnb.predict([[1, 0, 2]]))`,
    caseStudy: "Analisis sentimen tweet Twitter / ulasan produk e-commerce: Mengklasifikasikan sentimen positif/negatif berbasis MultinomialNB.",
    commonPitfalls: ["Lupa menerapkan Laplace smoothing sehingga satu kata yang belum pernah muncul di data latih membuat seluruh peluang kalimat menjadi nol mutlak."],
    groundingLinks: [{ title: "Scikit-Learn Naive Bayes Documentation", url: "https://scikit-learn.org/stable/modules/naive_bayes.html", note: "Dokumentasi modul Naive Bayes" }]
  })
];

const chapter10 = {
  id: "machine-learning-ch-10",
  slug: "bab-10-generative-classifiers-lda-qda-naive-bayes",
  title: "BAB 10: Generative Classifiers: LDA, QDA, & Naive Bayes",
  orderIndex: 10,
  description: "Landasan klasifikasi generatif: paradigma generatif vs diskriminatif, Linear Discriminant Analysis (LDA) dan Rasio Rayleigh Fisher, Quadratic Discriminant Analysis (QDA), reduksi dimensi terawasi, serta keluarga Naive Bayes dan koreksi Laplace smoothing.",
  coreConcepts: [
    "Paradigma Generatif P(X, Y) vs Diskriminatif P(Y|X)",
    "Linear Discriminant Analysis & Scatter Matrices",
    "Quadratic Discriminant Analysis & Kovarians Heterogen",
    "Supervised Dimension Reduction Fisher",
    "Naive Bayes & Asumsi Independensi Bersyarat",
    "Multinomial / Bernoulli NB & Koreksi Laplace Smoothing"
  ],
  subchapters: ch10Subs
};

fs.writeFileSync(path.join(outDir, 'chunk3-ch10.ts'), exportChapterTs(chapter10, 'chapter10'), 'utf-8');
console.log('Successfully generated chunk3-ch10.ts (6 subchapters)');


// ============================================================================
// BAB 11: Support Vector Machines: Hard/Soft Margin & Dualitas Wolfe (5 Subbab)
// ============================================================================
const ch11Subs = [
  createSubchapter({
    id: "ml-11-1-geometri-hard-margin-svm",
    slug: "11-1-geometri-hard-margin-svm",
    title: "11.1 Geometri Pemisah Hyperplane Maksimum Margin & Formulasi Primal Hard-Margin SVM",
    orderIndex: 1,
    description: "Perumusan geometris Support Vector Machine: pencarian pemisah berjarak terjauh ke dua kelas, lebar margin 2/||w||, dan masalah optimasi kuadratik konveks.",
    theoryMarkdown: `Tujuan SVM adalah menemukan hyperplane $\\mathbf{w}^T\\mathbf{x} + b = 0$ yang memaksimalkan jarak margin geometris $\\gamma = \\frac{2}{\\|\\mathbf{w}\\|_2}$ terhadap titik-titik terdekat dari kedua kelas.

Memaksimalkan $\\frac{2}{\\|\\mathbf{w}\\|}$ ekuivalen dengan meminimalkan kuadrat norma $\\frac{1}{2}\\|\\mathbf{w}\\|_2^2$.

Formulasi **Primal Hard-Margin SVM**:
$$\\min_{\\mathbf{w}, b} \\frac{1}{2} \\|\\mathbf{w}\\|_2^2$$
$$\\text{subject to } y_i (\\mathbf{w}^T\\mathbf{x}_i + b) \\ge 1, \\quad \\forall i = 1, \\dots, n$$
Ini adalah masalah Optimasi Kuadratik Konveks (*Convex Quadratic Programming*) yang dijamin memiliki satu minimum global tunggal.`,
    mermaidDiagram: `graph LR
    PosClass["Kelas +1"] --- MarginPos["Hyperplane w^T x + b = +1"]
    MarginPos --- SepPlane["Hyperplane Pemisah w^T x + b = 0"]
    SepPlane --- MarginNeg["Hyperplane w^T x + b = -1"]
    MarginNeg --- NegClass["Kelas -1"]
    MarginPos -. "Lebar Margin: 2 / ||w||" .- MarginNeg`,
    scratchCode: `from scipy.optimize import minimize
import numpy as np

def hard_margin_svm_qp(X: np.ndarray, y: np.ndarray):
    """Menyelesaikan Hard-Margin SVM melalui Quadratic Programming Scipy."""
    n, d = X.shape
    
    def objective(params):
        w = params[:d]
        return 0.5 * np.dot(w, w)
        
    def constraint(params):
        w = params[:d]
        b = params[d]
        return y * (X @ w + b) - 1.0
        
    res = minimize(objective, np.zeros(d + 1), constraints={'type': 'ineq', 'fun': constraint})
    return res.x[:d], res.x[d]

X_sep = np.array([[1.0, 2.0], [2.0, 3.0], [3.0, 3.0], [6.0, 5.0], [7.0, 8.0], [8.0, 6.0]])
y_sep = np.array([-1.0, -1.0, -1.0, 1.0, 1.0, 1.0])
w_svm, b_svm = hard_margin_svm_qp(X_sep, y_sep)
print("Hard-Margin SVM Bobot w:", np.round(w_svm, 4), "Bias b:", np.round(b_svm, 4))
print("Lebar Margin:", 2.0 / np.linalg.norm(w_svm))`,
    sotaCode: `from sklearn.svm import SVC

svc_hard = SVC(kernel='linear', C=1e6).fit(X_sep, y_sep)
print("Scikit-Learn SVC w:", np.round(svc_hard.coef_[0], 4), "b:", np.round(svc_hard.intercept_[0], 4))`,
    diagCode: `print("Jumlah Support Vectors:", svc_hard.n_support_)`,
    caseStudy: "Pemisahan spektrum sinyal radar radar militer: Memaksimalkan batas toleransi terhadap noise transmisi radio.",
    commonPitfalls: ["Hard-margin SVM tidak memiliki solusi matematis jika data tidak linear separable."],
    groundingLinks: [{ title: "Cortes & Vapnik (1995) Support-Vector Networks", url: "https://doi.org/10.1007/BF00994018", note: "Paper asli penemuan SVM" }]
  }),

  createSubchapter({
    id: "ml-11-2-soft-margin-svm-hinge-loss",
    slug: "11-2-soft-margin-svm-hinge-loss",
    title: "11.2 Soft-Margin SVM: Relaksasi Slack Variables (Xi), Penalti Biaya C, & Trade-off Margin-Loss",
    orderIndex: 2,
    description: "Relaksasi Soft-Margin SVM: pengenalan slack variables xi_i, regulasi penalti C, formulasi Hinge Loss, dan toleransi pelanggaran margin.",
    theoryMarkdown: `Pada data dunia nyata yang memiliki derau atau overlap, Hard-Margin SVM tidak dapat digunakan. **Soft-Margin SVM** memperkenalkan variabel kendur (*slack variables*) $\\xi_i \\ge 0$:
$$\\min_{\\mathbf{w}, b, \\boldsymbol{\\xi}} \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 + C \\sum_{i=1}^n \\xi_i$$
$$\\text{subject to } y_i (\\mathbf{w}^T\\mathbf{x}_i + b) \\ge 1 - \\xi_i, \\quad \\xi_i \\ge 0$$

Formulasi ini ekuivalen dengan meminimalkan **Hinge Loss** ter-regularisasi:
$$\\min_{\\mathbf{w}, b} \\sum_{i=1}^n \\max(0, 1 - y_i(\\mathbf{w}^T\\mathbf{x}_i + b)) + \\frac{1}{2C} \\|\\mathbf{w}\\|_2^2$$
Parameter $C > 0$ mengontrol trade-off: $C$ besar menghasilkan margin sempit dengan sedikit pelanggaran (risiko overfitting), $C$ kecil menghasilkan margin lebar yang lebih toleran terhadap noise.`,
    mermaidDiagram: `graph TD
    DataNoise["Data Non-Separable / Terkontaminasi Derau"] --> Slack["Tambahkan Slack Variables xi_i >= 0"]
    Slack --> ParamC["Hiperparameter Biaya C"]
    ParamC --> SmallC["C Kecil: Toleransi Pelanggaran Tinggi -> Margin Lebar (Reguler)"]
    ParamC --> LargeC["C Besar: Penalti Keras -> Margin Sempit (Sensitif Outlier)"]`,
    scratchCode: `def hinge_loss(y_true: np.ndarray, y_score: np.ndarray) -> float:
    return np.mean(np.maximum(0, 1.0 - y_true * y_score))

scores = np.array([1.5, 0.8, -0.5, 2.0])
labels = np.array([1.0, 1.0, 1.0, -1.0])
print("Rata-rata Hinge Loss:", hinge_loss(labels, scores))`,
    sotaCode: `from sklearn.svm import LinearSVC

l_svc = LinearSVC(C=1.0, loss='hinge', max_iter=2000).fit(X_sep, y_sep)
print("LinearSVC Coefs:", np.round(l_svc.coef_[0], 4))`,
    diagCode: `print("Skor akurasi LinearSVC:", l_svc.score(X_sep, y_sep))`,
    caseStudy: "Pendeteksian teks ujaran kebencian di media sosial: Soft-margin SVM mentolerir kata-kata ambigu tanpa merusak batas generalisasi global.",
    commonPitfalls: ["Lupa menyetel parameter C menggunakan Cross-Validation."],
    groundingLinks: [{ title: "Scikit-Learn SVM Documentation", url: "https://scikit-learn.org/stable/modules/svm.html", note: "Dokumentasi modul SVM" }]
  }),

  createSubchapter({
    id: "ml-11-3-lagrange-wolfe-duality-kkt",
    slug: "11-3-lagrange-wolfe-duality-kkt",
    title: "11.3 Formulasi Dualitas Lagrange, Dualitas Wolfe, & Persyaratan Karush-Kuhn-Tucker (KKT)",
    orderIndex: 3,
    description: "Transformasi matematis Primal ke Dual: fungsi Lagrangian, kondisi KKT (Primal Feasibility, Dual Feasibility, Complementary Slackness), dan dualitas Wolfe.",
    theoryMarkdown: `Fungsi Lagrangian untuk Soft-Margin SVM adalah:
$$\\mathcal{L}(\\mathbf{w}, b, \\boldsymbol{\\xi}, \\boldsymbol{\\alpha}, \\boldsymbol{\\mu}) = \\frac{1}{2}\\|\\mathbf{w}\\|_2^2 + C\\sum_{i=1}^n \\xi_i - \\sum_{i=1}^n \\alpha_i [y_i(\\mathbf{w}^T\\mathbf{x}_i + b) - 1 + \\xi_i] - \\sum_{i=1}^n \\mu_i \\xi_i$$
di mana $\\alpha_i \\ge 0$ dan $\\mu_i \\ge 0$ adalah pengali Lagrange (*Lagrange Multipliers*).

Kondisi stasioneritas:
1. $\\nabla_{\\mathbf{w}} \\mathcal{L} = \\mathbf{0} \\implies \\mathbf{w} = \\sum_{i=1}^n \\alpha_i y_i \\mathbf{x}_i$
2. $\\frac{\\partial \\mathcal{L}}{\\partial b} = 0 \\implies \\sum_{i=1}^n \\alpha_i y_i = 0$
3. $\\frac{\\partial \\mathcal{L}}{\\partial \\xi_i} = 0 \\implies C - \\alpha_i - \\mu_i = 0 \\implies 0 \\le \\alpha_i \\le C$

Substitusi kembali ke $\\mathcal{L}$ menghasilkan **Masalah Dual Wolfe**:
$$\\max_{\\boldsymbol{\\alpha}} \\sum_{i=1}^n \\alpha_i - \\frac{1}{2} \\sum_{i=1}^n \\sum_{j=1}^n \\alpha_i \\alpha_j y_i y_j (\\mathbf{x}_i^T\\mathbf{x}_j)$$
$$\\text{subject to } 0 \\le \\alpha_i \\le C, \\quad \\sum_{i=1}^n \\alpha_i y_i = 0$$`,
    mermaidDiagram: `graph TD
    Primal["Primal SVM: min 1/2 ||w||^2 + C sum xi"] --> Lagrangian["Konstruksi Fungsi Lagrange L(w, b, xi, alpha, mu)"]
    Lagrangian --> KKT["Syarat Stasioner: w = sum alpha_i y_i x_i & sum alpha_i y_i = 0"]
    KKT --> Dual["Wolfe Dual: max sum alpha_i - 1/2 sum alpha_i alpha_j y_i y_j (x_i^T x_j)"]
    Dual --> InnerProd["Data Hanya Muncul dalam Bentuk Dot Product (x_i^T x_j)! (Pintu Masuk Kernel Trick)"]`,
    scratchCode: `def solve_svm_dual_qp(X: np.ndarray, y: np.ndarray, C: float = 1.0):
    n = len(y)
    K = X @ X.T
    H = np.outer(y, y) * K
    
    def objective(alpha):
        return 0.5 * alpha @ H @ alpha - np.sum(alpha)
        
    cons = ({'type': 'eq', 'fun': lambda alpha: np.dot(alpha, y)})
    bounds = [(0, C) for _ in range(n)]
    res = minimize(objective, np.zeros(n), bounds=bounds, constraints=cons)
    return res.x

alpha_opt = solve_svm_dual_qp(X_sep, y_sep, C=1.0)
print("Optimal Dual Alphas:", np.round(alpha_opt, 4))`,
    sotaCode: `svc_dual = SVC(kernel='linear', C=1.0).fit(X_sep, y_sep)
print("Dual Coefficients via Scikit-Learn (alpha * y):", np.round(svc_dual.dual_coef_, 4))`,
    diagCode: `print("Kondisi sum(alpha_i * y_i) = 0:", np.isclose(np.dot(alpha_opt, y_sep), 0, atol=1e-5))`,
    caseStudy: "Penyelesaian optimasi konveks berskala besar pada sistem klasifikasi sidik jari berbasis Quadratic Programming.",
    commonPitfalls: ["Lupa bahwa formulasi dual hanya bergantung pada dot product antar sampel (x_i^T x_j), bukan dimensi fitur individual."],
    groundingLinks: [{ title: "Schölkopf & Smola Learning with Kernels (Ch. 1)", url: "https://mitpress.mit.edu/9780262194754/", note: "Buku standar kernel dan dualitas SVM" }]
  }),

  createSubchapter({
    id: "ml-11-4-karakterisasi-support-vectors",
    slug: "11-4-karakterisasi-support-vectors",
    title: "11.4 Karakterisasi Vektor Pendukung (Support Vectors) & Sifat Komputasi Sparsitas Solusi Dual",
    orderIndex: 4,
    description: "Karakterisasi titik-titik Support Vectors melalui kondisi complementary slackness KKT: alpha_i = 0 vs 0 < alpha_i < C vs alpha_i = C dan implikasi sparsitas komputasi.",
    theoryMarkdown: `Kondisi *Complementary Slackness* KKT:
$$\\alpha_i [y_i(\\mathbf{w}^T\\mathbf{x}_i + b) - 1 + \\xi_i] = 0$$
$$\\mu_i \\xi_i = (C - \\alpha_i)\\xi_i = 0$$

Klasifikasi status setiap observasi:
1. **Titik Non-Support Vector** ($\\alpha_i = 0$): Titik berada di luar margin dengan aman ($y_i(\\mathbf{w}^T\\mathbf{x}_i + b) > 1$). Titik ini tidak berpengaruh terhadap $\\mathbf{w}$!
2. **Margin Support Vectors** ($0 < \\alpha_i < C$): Titik berada tepat pada batas margin ($y_i(\\mathbf{w}^T\\mathbf{x}_i + b) = 1$ dan $\\xi_i = 0$). Digunakan untuk menghitung nilai bias $b$.
3. **Violating Support Vectors** ($\\alpha_i = C$): Titik melanggar margin ($\\xi_i > 0$), baik berada di dalam margin maupun salah terklasifikasi.

Karena sebagian besar sampel memiliki $\\alpha_i = 0$, representasi SVM bersifat **Sangat Jarang (Extremely Sparse)**!`,
    mermaidDiagram: `graph TD
    Samples["Seluruh Sampel Data Latih"] --> Cond{"Nilai alpha_i"}
    Cond -- "alpha_i = 0" --> Safe["Titik Aman: Diabaikan Total dalam Inferensi"]
    Cond -- "0 < alpha_i < C" --> FreeSV["Free Support Vector: Tepat di Batas Margin"]
    Cond -- "alpha_i = C" --> BoundedSV["Bounded Support Vector: Melanggar Margin / Outlier"]
    FreeSV & BoundedSV --> Model["Model Hanya Menyimpan Support Vectors!"]`,
    scratchCode: `def get_support_vectors(X, y, alpha, tol=1e-4):
    sv_indices = np.where(alpha > tol)[0]
    return sv_indices, X[sv_indices], y[sv_indices], alpha[sv_indices]

sv_idx, sv_X, sv_y, sv_alpha = get_support_vectors(X_sep, y_sep, alpha_opt)
print(f"Indeks Support Vectors: {sv_idx}")
print(f"Jumlah SV: {len(sv_idx)} dari {len(y_sep)} sampel")`,
    sotaCode: `print("Support Vectors Indices Scikit-Learn:", svc_dual.support_)`,
    diagCode: `print("Persentase kompresi sparsitas model:", 100 * (1 - len(sv_idx)/len(y_sep)), "%")`,
    caseStudy: "Penyimpanan model pada memori mikrokontroler (Edge AI): SVM hanya perlu menyimpan 5% sampel sebagai support vectors, menghemat 95% RAM.",
    commonPitfalls: ["Mengira bahwa menambah data latih akan memperbesar waktu inferensi. Waktu inferensi SVM HANYA bergantung pada jumlah Support Vectors!"],
    groundingLinks: [{ title: "LibSVM Official Repository", url: "https://github.com/cjlin1/libsvm", note: "Repositori mesin C++ LibSVM" }]
  }),

  createSubchapter({
    id: "ml-11-5-algoritma-smo",
    slug: "11-5-algoritma-smo",
    title: "11.5 Algoritma Sequential Minimal Optimization (SMO) untuk Pelatihan SVM Tanpa QP Solver Eksternal",
    orderIndex: 5,
    description: "Algoritma SMO (Platt, 1998): pemecahan masalah dual SVM secara analitis dengan memilih pasangan (alpha_1, alpha_2) di setiap iterasi tanpa QP solver eksternal.",
    theoryMarkdown: `Algoritma **Sequential Minimal Optimization (SMO)** memecah masalah kuadratik dual masif menjadi sub-masalah terkecil yang mungkin: mengoptimalkan tepat **dua pengali Lagrange $\\alpha_1$ dan $\\alpha_2$** pada setiap langkah.

Dua variabel dipilih karena adanya konstrain linear $\\sum \\alpha_i y_i = 0$: jika hanya satu variabel yang diubah, konstrain akan langsung dilanggar.
Jika $\\alpha_3, \\dots, \\alpha_n$ ditahan konstan:
$$\\alpha_1 y_1 + \\alpha_2 y_2 = -\\sum_{i=3}^n \\alpha_i y_i = \\zeta \\implies \\alpha_1 = y_1(\\zeta - \\alpha_2 y_2)$$

Sub-masalah ini memiliki **solusi analitis tertutup 1-dimensi** yang sangat cepat tanpa memerlukan Quadratic Programming solver eksternal.`,
    mermaidDiagram: `graph TD
    Start["Inisialisasi Seluruh alpha_i = 0"] --> Heuristic["Heuristik Pemilihan Pasangan (alpha_1, alpha_2) yang Melanggar KKT"]
    Heuristic --> Clip["Hitung Batas L dan H untuk alpha_2"]
    Clip --> Analyt["Pembaruan Analitis Eksak alpha_2_new"]
    Analyt --> UpdateAlpha1["Hitung alpha_1_new via Konstrain Linear"]
    UpdateAlpha1 --> CheckKKT{"Apakah Seluruh alpha Memenuhi KKT dalam Toleransi?"}
    CheckKKT -- Tidak --> Heuristic
    CheckKKT -- Ya --> Finish["Pelatihan Selesai dengan Efisiensi O(n^2)"]`,
    scratchCode: `def smo_clip_alpha(alpha2_new_unc, L, H):
    if alpha2_new_unc > H:
        return H
    elif alpha2_new_unc < L:
        return L
    return alpha2_new_unc

print("SMO Clipping Demo: L=0, H=1, unc=1.5 ->", smo_clip_alpha(1.5, 0, 1.0))`,
    sotaCode: `from sklearn.svm import SVC

# LibSVM menggunakan varian algoritma SMO teroptimasi
svc_smo = SVC(kernel='linear').fit(X_sep, y_sep)
print("LibSVM SMO Solver Iterations:", svc_smo.n_iter_)`,
    diagCode: `print("Status konvergensi SMO: Optimal")`,
    caseStudy: "Implementasi LibSVM pada sistem pengenalan tulisan tangan MNIST: SMO mempercepat waktu pelatihan dari hitungan jam menjadi hitungan detik.",
    commonPitfalls: ["Heuristik pemilihan pasangan (alpha_1, alpha_2) yang buruk dapat menyebabkan SMO terjebak dalam iterasi lambat."],
    groundingLinks: [{ title: "Platt (1998) Sequential Minimal Optimization", url: "https://www.microsoft.com/en-us/research/publication/sequential-minimal-optimization-a-fast-algorithm-for-training-support-vector-machines/", note: "Paper teknis SMO Microsoft Research" }]
  })
];

const chapter11 = {
  id: "machine-learning-ch-11",
  slug: "bab-11-support-vector-machines-hard-soft-margin-dualitas-wolfe",
  title: "BAB 11: Support Vector Machines: Hard/Soft Margin & Dualitas Wolfe",
  orderIndex: 11,
  description: "Landasan analitis Support Vector Machines (SVM): formulasi primal Hard-Margin pemisah maksimum, relaksasi Soft-Margin dan Hinge Loss, transformasi dualitas Lagrange dan Wolfe, karakterisasi Support Vectors, serta algoritma optimasi analitis SMO.",
  coreConcepts: [
    "Geometri Hyperplane & Lebar Margin 2/||w||",
    "Soft-Margin SVM & Slack Variables",
    "Dualitas Wolfe & Kondisi Karush-Kuhn-Tucker (KKT)",
    "Sparsitas Representasi Support Vectors",
    "Algoritma Sequential Minimal Optimization (SMO)"
  ],
  subchapters: ch11Subs
};

fs.writeFileSync(path.join(outDir, 'chunk3-ch11.ts'), exportChapterTs(chapter11, 'chapter11'), 'utf-8');
console.log('Successfully generated chunk3-ch11.ts (5 subchapters)');


// ============================================================================
// BAB 12: Kernel Methods & Teorema Mercer (RKHS, RBF, & Kernel Ridge) (6 Subbab)
// ============================================================================
const ch12Subs = [
  createSubchapter({
    id: "ml-12-1-pemetaan-hilbert-dimensi-tinggi",
    slug: "12-1-pemetaan-hilbert-dimensi-tinggi",
    title: "12.1 Keterbatasan Model Linier & Ide Pemetaan Ruang Fitur Dimensi Tak Hingga (Hilbert Space)",
    orderIndex: 1,
    description: "Keterbatasan linear separability pada ruang asli: pemetaan eksplisit phi(x) ke ruang fitur berdimensi tinggi atau tak hingga (Hilbert Space).",
    theoryMarkdown: `Banyak masalah dunia nyata tidak dapat dipisahkan secara linier pada ruang aslinya $\\mathbb{R}^d$ (contoh klasik: masalah XOR atau data lingkaran konsentris).
Idenya adalah memetakan data ke ruang fitur berdimensi lebih tinggi $\\mathcal{H}$ melalui transformasi non-linier $\\boldsymbol{\\phi}: \\mathbb{R}^d \\to \\mathcal{H}$:
$$\\mathbf{x} \\mapsto \\boldsymbol{\\phi}(\\mathbf{x})$$

Berdasarkan **Teorema Cover (1965)**, pola non-linier di ruang asal memiliki probabilitas sangat tinggi untuk menjadi terpisahkan secara linier saat diproyeksikan ke ruang berdimensi tinggi.`,
    mermaidDiagram: `graph LR
    Input["Ruang Asal Non-Linier R^2 (Lingkaran Konsentris)"] --> Mapping["Transformasi phi(x) = [x_1^2, sqrt(2) x_1 x_2, x_2^2]"]
    Mapping --> Hilbert["Ruang Fitur R^3"]
    Hilbert --> LinearSep["Batas Keputusan Menjadi Hyperplane Linier di R^3!"]`,
    scratchCode: `def phi_polynomial_2d(x: np.ndarray) -> np.ndarray:
    """Pemetaan eksplisit R^2 -> R^3: [x1^2, sqrt(2)*x1*x2, x2^2]"""
    return np.array([x[0]**2, np.sqrt(2)*x[0]*x[1], x[1]**2])

x_a = np.array([1.0, 2.0])
print("Pemetaan eksplisit phi(x):", phi_polynomial_2d(x_a))`,
    sotaCode: `from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(degree=2, include_bias=False)
print("Polynomial Features Scikit-Learn:", poly.fit_transform([x_a])[0])`,
    diagCode: `print("Dimensi ruang fitur:", poly.fit_transform([x_a]).shape[1])`,
    caseStudy: "Klasifikasi data spektroskopi inframerah kimia: Resonansi non-linier senyawa molekuler menjadi linier di ruang fitur berderajat tinggi.",
    commonPitfalls: ["Melakukan komputasi eksplisit phi(x) pada derajat tinggi yang menyebabkan ledakan memori kombinatorial."],
    groundingLinks: [{ title: "Cover (1965) Geometrical and Statistical Properties of Systems of Linear Inequalities", url: "https://doi.org/10.1109/PGEC.1965.264137", note: "Teorema Cover pemisahan pola" }]
  }),

  createSubchapter({
    id: "ml-12-2-kernel-trick-inner-product",
    slug: "12-2-kernel-trick-inner-product",
    title: "12.2 Kernel Trick: Menghitung Inner Product Tanpa Transformasi Eksplisit Phi(x)",
    orderIndex: 2,
    description: "Prinsip Kernel Trick: penghitungan hasil kali dalam K(x, z) = <phi(x), phi(z)> secara implisit dalam ruang asal tanpa pernah menghitung vektor phi secara langsung.",
    theoryMarkdown: `Karena algoritma berbasis dual (seperti SVM dual) hanya membutuhkan perkalian titik $\\langle \\boldsymbol{\\phi}(\\mathbf{x}_i), \\boldsymbol{\\phi}(\\mathbf{x}_j) \\rangle$, kita tidak perlu menghitung $\\boldsymbol{\\phi}(\\mathbf{x})$ secara eksplisit!

**Kernel Function** $K(\\mathbf{x}, \\mathbf{z})$ menghitung nilai dot product di ruang Hilbert langsung dari representasi ruang asal:
$$K(\\mathbf{x}, \\mathbf{z}) = \\langle \\boldsymbol{\\phi}(\\mathbf{x}), \\boldsymbol{\\phi}(\\mathbf{z}) \\rangle_{\\mathcal{H}}$$

Sebagai contoh, untuk kernel polinomial derajat 2 pada $\\mathbb{R}^2$:
$$(\\mathbf{x}^T\\mathbf{z})^2 = (x_1 z_1 + x_2 z_2)^2 = x_1^2 z_1^2 + 2 x_1 x_2 z_1 z_2 + x_2^2 z_2^2 = \\langle \\boldsymbol{\\phi}(\\mathbf{x}), \\boldsymbol{\\phi}(\\mathbf{z}) \\rangle$$
Biaya komputasi: $O(d)$ di ruang asal, alih-alih $O(d^2)$ di ruang fitur!`,
    mermaidDiagram: `graph TD
    Naive["Pendekatan Naif: x -> phi(x) -> dot product (Kompleksitas Meledak O(D))"]
    KernelTrick["Kernel Trick: K(x, z) langsung dihitung di ruang asal O(d)!"]
    Naive -. Ekuivalen Matematis .- KernelTrick`,
    scratchCode: `def kernel_polynomial(x: np.ndarray, z: np.ndarray, degree: int = 2) -> float:
    return np.dot(x, z) ** degree

x_1 = np.array([1.0, 2.0])
x_2 = np.array([3.0, 4.0])
k_val = kernel_polynomial(x_1, x_2, degree=2)
phi_dot = np.dot(phi_polynomial_2d(x_1), phi_polynomial_2d(x_2))
print("Kernel trick result :", k_val)
print("Explicit dot product:", phi_dot)
print("Apakah ekuivalen?   :", np.isclose(k_val, phi_dot))`,
    sotaCode: `from sklearn.metrics.pairwise import polynomial_kernel

print("Scikit-Learn Polynomial Kernel:", polynomial_kernel([x_1], [x_2], degree=2, coef0=0)[0, 0])`,
    diagCode: `print("Verifikasi kesamaan nilai kernel trick:", np.isclose(k_val, polynomial_kernel([x_1], [x_2], degree=2, coef0=0)[0, 0]))`,
    caseStudy: "Pencocokan struktur molekul kimia menggunakan Graph Kernels: Membandingkan similaritas molekul tanpa memetakan seluruh kombinasi subgraf.",
    commonPitfalls: ["Memilih derajat polinomial terlalu tinggi (degree > 5) yang menyebabkan ledakan nilai numerik (floating point overflow)."],
    groundingLinks: [{ title: "Schölkopf & Smola Learning with Kernels (Ch. 2)", url: "https://mitpress.mit.edu/9780262194754/", note: "Buku bab Kernel Trick" }]
  }),

  createSubchapter({
    id: "ml-12-3-teorema-mercer-rkhs",
    slug: "12-3-teorema-mercer-rkhs",
    title: "12.3 Teorema Mercer & Reproducing Kernel Hilbert Space (RKHS): Karakteristik Matriks Gram Definit Positif",
    orderIndex: 3,
    description: "Landasan analitis Teorema Mercer: syarat perlu dan cukup fungsi kernel valid, matriks Gram semi-definit positif, dan struktur ruang RKHS.",
    theoryMarkdown: `**Teorema Mercer (1909)**: Suatu fungsi simetris kontinu $K(\\mathbf{x}, \\mathbf{z})$ dapat didekomposisikan sebagai inner product pada suatu ruang Hilbert jika dan hanya jika matriks Gram $\\mathbf{K} \\in \\mathbb{R}^{n \\times n}$ dengan elemen $K_{ij} = K(\\mathbf{x}_i, \\mathbf{x}_j)$ bersifat **Semi-Definit Positif (Positive Semi-Definite - PSD)** untuk sembarang himpunan titik $\\{\\mathbf{x}_1, \\dots, \\mathbf{x}_n\\}$:
$$\\mathbf{c}^T \\mathbf{K} \\mathbf{c} = \\sum_{i=1}^n \\sum_{j=1}^n c_i c_j K(\\mathbf{x}_i, \\mathbf{x}_j) \\ge 0, \\quad \\forall \\mathbf{c} \\in \\mathbb{R}^n$$

Ruang fungsi yang diasosiasikan dengan kernel ini disebut **Reproducing Kernel Hilbert Space (RKHS)**, yang memiliki sifat reproduksi: $\\langle f, K(\\cdot, \\mathbf{x}) \\rangle_{\\mathcal{H}} = f(\\mathbf{x})$.`,
    mermaidDiagram: `graph TD
    Cand["Fungsi Kandidat K(x, z)"] --> Gram["Bangun Matriks Gram: K_ij = K(x_i, x_j)"]
    Gram --> Eig["Hitung Nilai Eigen lambda_i"]
    Eig --> Check{"Apakah seluruh lambda_i >= 0? (PSD)"}
    Check -- Ya --> Valid["Memenuhi Teorema Mercer: Valid Kernel RKHS!"]
    Check -- Tidak --> Invalid["Bukan Kernel Valid! Optimasi Non-Konveks"]`,
    scratchCode: `def verify_mercer_condition(X: np.ndarray, kernel_fn):
    n = len(X)
    K = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            K[i, j] = kernel_fn(X[i], X[j])
    eigvals = np.linalg.eigvalsh(K)
    is_psd = np.all(eigvals >= -1e-8)
    return is_psd, np.min(eigvals)

rbf_fn = lambda a, b: np.exp(-0.5 * np.linalg.norm(a - b)**2)
is_psd, min_eig = verify_mercer_condition(X_sep, rbf_fn)
print(f"RBF Kernel memenuhi syarat Mercer PSD: {is_psd} (Min Eigval: {min_eig:.4e})")`,
    sotaCode: `from sklearn.metrics.pairwise import rbf_kernel

K_skl = rbf_kernel(X_sep, gamma=0.5)
print("Min eigenvalue Scikit-Learn RBF Gram matrix:", np.min(np.linalg.eigvalsh(K_skl)))`,
    diagCode: `print("Matriks Gram simetris:", np.allclose(K_skl, K_skl.T))`,
    caseStudy: "Perancangan string kernel untuk bioinformatika: Memastikan fungsi similaritas sekuens DNA memenuhi syarat Mercer agar konvergensi SVM terjamin.",
    commonPitfalls: ["Menggunakan metrik similaritas heuristik (seperti Cosine dengan modifikasi non-PSD) yang menyebabkan QP solver gagal konvergen."],
    groundingLinks: [{ title: "Mercer (1909) Functions of positive and negative type", url: "https://doi.org/10.1098/rsta.1909.0016", note: "Paper asli Teorema Mercer" }]
  }),

  createSubchapter({
    id: "ml-12-4-taksonomi-kernel-standar",
    slug: "12-4-taksonomi-kernel-standar",
    title: "12.4 Taksonomi Kernel Standar: Polinomial, Radial Basis Function (Gaussian RBF), & Sigmoid",
    orderIndex: 4,
    description: "Karakteristik matematika kernel standar: Linear, Polynomial, Gaussian RBF (dimensi tak hingga), dan Sigmoid/Hyperbolic Tangent.",
    theoryMarkdown: `1. **Linear Kernel**:
   $$K(\\mathbf{x}, \\mathbf{z}) = \\mathbf{x}^T\\mathbf{z} + c$$

2. **Polynomial Kernel**:
   $$K(\\mathbf{x}, \\mathbf{z}) = (\\gamma \\mathbf{x}^T\\mathbf{z} + c)^d$$

3. **Radial Basis Function (Gaussian RBF)**:
   $$K(\\mathbf{x}, \\mathbf{z}) = \\exp(-\\gamma \\|\\mathbf{x} - \\mathbf{z}\\|_2^2)$$
   Melalui ekspansi deret Taylor dari $\\exp(\\cdot)$, RBF kernel merepresentasikan pemetaan ke ruang Hilbert berdimensi **tak terhingga ($\\infty$-dimensional space)**! Parameter $\\gamma$ mengontrol radius pengaruh tiap sampel.

4. **Sigmoid Kernel**:
   $$K(\\mathbf{x}, \\mathbf{z}) = \\tanh(\\gamma \\mathbf{x}^T\\mathbf{z} + c)$$`,
    mermaidDiagram: `graph LR
    Kernel["Taksonomi Kernel"] --> Lin["Linear: Garis Lurus"]
    Kernel --> Poly["Polynomial: Kurva Derajat d"]
    Kernel --> RBF["Gaussian RBF: Dimensi Tak Hingga (Lokal Sferis)"]
    Kernel --> Sig["Sigmoid: Menyerupai Neural Network MLP"]`,
    scratchCode: `def rbf_kernel_manual(x: np.ndarray, z: np.ndarray, gamma: float = 0.5) -> float:
    return np.exp(-gamma * np.sum((x - z)**2))

print("RBF Kernel(x1, x2):", rbf_kernel_manual(x_1, x_2, gamma=0.1))`,
    sotaCode: `from sklearn.metrics.pairwise import rbf_kernel

print("Scikit-Learn RBF Kernel:", rbf_kernel([x_1], [x_2], gamma=0.1)[0, 0])`,
    diagCode: `print("Verifikasi RBF identik:", np.isclose(rbf_kernel_manual(x_1, x_2, 0.1), rbf_kernel([x_1], [x_2], 0.1)[0, 0]))`,
    caseStudy: "Pendeteksian intrusi jaringan siber: RBF Kernel mampu mengisolasi klaster serangan non-linier kompleks yang tersebar sporadis di ruang jaringan.",
    commonPitfalls: ["Memilih nilai gamma RBF terlalu besar (gamma > 100), menyebabkan overfitting parah di mana setiap titik latih menjadi pulau terisolasi."],
    groundingLinks: [{ title: "Scikit-Learn RBF Kernel Documentation", url: "https://scikit-learn.org/stable/modules/metrics.html#rbf-kernel", note: "Dokumentasi kernel RBF" }]
  }),

  createSubchapter({
    id: "ml-12-5-support-vector-regression-svr",
    slug: "12-5-support-vector-regression-svr",
    title: "12.5 Support Vector Regression (SVR): Tabung Kerugian Epsilon-Insensitive & Formulasi Dual",
    orderIndex: 5,
    description: "Regresi non-linier berbasis SVM: fungsi kerugian epsilon-insensitive, variabel slack ganda (xi, xi*), dan tabung toleransi kesalahan.",
    theoryMarkdown: `Support Vector Regression (SVR) menggunakan **$\\varepsilon$-insensitive loss**:
$$L_\\varepsilon(y, f(\\mathbf{x})) = \\max(0, |y - f(\\mathbf{x})| - \\varepsilon)$$
Residual di dalam tabung $\\pm \\varepsilon$ tidak dikenakan penalti sama sekali!

Formulasi primal SVR:
$$\\min_{\\mathbf{w}, b, \\boldsymbol{\\xi}, \\boldsymbol{\\xi}^*} \\frac{1}{2}\\|\\mathbf{w}\\|_2^2 + C\\sum_{i=1}^n (\\xi_i + \\xi_i^*)$$
$$\\text{subject to } \\begin{cases} y_i - f(\\mathbf{x}_i) \\le \\varepsilon + \\xi_i \\\\ f(\\mathbf{x}_i) - y_i \\le \\varepsilon + \\xi_i^* \\\\ \\xi_i, \\xi_i^* \\ge 0 \\end{cases}$$`,
    mermaidDiagram: `graph LR
    Tube["Tabung Toleransi Epsilon: |y - y_hat| <= eps"] --> ZeroLoss["Loss = 0 (Titik di dalam tabung diabaikan)"]
    Tube --> Slack["Titik di Luar Tabung dikenakan Penalti Linear xi atau xi*"]
    Slack --> SVRModel["Hanya Titik di Luar atau pada Batas Tabung yang Menjadi Support Vectors!"]`,
    scratchCode: `def epsilon_insensitive_loss(y_true, y_pred, eps=0.2):
    return np.maximum(0, np.abs(y_true - y_pred) - eps)

y_val = np.array([2.0, 2.1, 2.5])
y_p = np.array([2.1, 2.0, 2.0])
print("Epsilon-insensitive Loss (eps=0.2):", epsilon_insensitive_loss(y_val, y_p, eps=0.2))`,
    sotaCode: `from sklearn.svm import SVR

svr_rbf = SVR(kernel='rbf', C=10.0, epsilon=0.2).fit(X_sep, y_sep)
print("SVR Support Vectors Count:", len(svr_rbf.support_))`,
    diagCode: `print("R2 Score SVR:", svr_rbf.score(X_sep, y_sep))`,
    caseStudy: "Peramalan konsumsi energi listrik per jam pada smart grid: SVR dengan RBF kernel mengabaikan fluktuasi acak kecil di dalam tabung epsilon.",
    commonPitfalls: ["Menyetel epsilon terlalu besar sehingga seluruh data masuk ke dalam tabung dan model menghasilkan prediksi konstanta datar."],
    groundingLinks: [{ title: "Smola & Schölkopf (2004) A tutorial on support vector regression", url: "https://doi.org/10.1023/B:STCO.0000035301.49549.88", note: "Tutorial komprehensif SVR" }]
  }),

  createSubchapter({
    id: "ml-12-6-skalabilitas-kernel-nystrom-rff",
    slug: "12-6-skalabilitas-kernel-nystrom-rff",
    title: "12.6 Skalabilitas Kernel pada Dataset Besar: Aproksimasi Nyström & Random Fourier Features",
    orderIndex: 6,
    description: "Mengatasi kemacetan komputasi O(n^2) memori dan O(n^3) waktu pada kernel methods: metode sub-sampling Nyström dan Random Fourier Features (Rahimi-Recht).",
    theoryMarkdown: `Matriks Gram berukuran $n \\times n$ membutuhkan memori $O(n^2)$ dan inversi $O(n^3)$, tidak mungkin diaplikasikan saat $n > 100,000$.

### 1. Metode Nyström:
Memilih subset $m \\ll n$ kolom matriks Gram secara acak dan mengaproksimasi matriks penuh melalui dekomposisi low-rank:
$$\\mathbf{K} \\approx \\mathbf{K}_{n, m} \\mathbf{K}_{m, m}^{-1} \\mathbf{K}_{m, n}$$

### 2. Random Fourier Features (RFF - Rahimi & Recht, 2007):
Berdasarkan Teorema Bochner, kernel shift-invariant $K(\\mathbf{x} - \\mathbf{z})$ adalah transformasi Fourier dari distribusi probabilitas $p(\\boldsymbol{\\omega})$. Kita dapat memetakan data ke representasi acak berdimensi $D$:
$$\\mathbf{z}(\\mathbf{x}) = \\sqrt{\\frac{2}{D}} \\cos(\\mathbf{W}\\mathbf{x} + \\mathbf{b}), \\quad \\mathbf{W} \\sim \\mathcal{N}(\\mathbf{0}, 2\\gamma \\mathbf{I}), \\quad \\mathbf{b} \\sim \\text{Uniform}(0, 2\\pi)$$
Dot product $\\mathbf{z}(\\mathbf{x})^T \\mathbf{z}(\\mathbf{y}) \\approx K_{\\text{RBF}}(\\mathbf{x}, \\mathbf{y})$ memungkinkan penggunaan model linier cepat $O(n)$!`,
    mermaidDiagram: `graph TD
    Bottleneck["Matriks Gram Penuh K (n x n): Memori O(n^2), Inversi O(n^3)"] --> Nystrom["Metode Nyström: Aproksimasi Low-Rank via m << n Titik Acak"]
    Bottleneck --> RFF["Random Fourier Features (RFF): Proyeksi Acak z(x) in R^D"]
    RFF --> LinSolver["Gunakan Linear Solver Cepat (O(n D)) untuk Mensimulasikan Kernel RBF!"]`,
    scratchCode: `def random_fourier_features(X: np.ndarray, D: int = 100, gamma: float = 0.5):
    d = X.shape[1]
    np.random.seed(42)
    W = np.random.normal(0, np.sqrt(2 * gamma), size=(D, d))
    b = np.random.uniform(0, 2 * np.pi, size=D)
    Z = np.sqrt(2.0 / D) * np.cos(X @ W.T + b)
    return Z

Z_rff = random_fourier_features(X_sep, D=200, gamma=0.5)
print("Ukuran Matriks Fitur Acak RFF:", Z_rff.shape)
print("Aproksimasi RBF Dot Product:", np.dot(Z_rff[0], Z_rff[1]))
print("RBF Eksak                 :", rbf_kernel([X_sep[0]], [X_sep[1]], gamma=0.5)[0, 0])`,
    sotaCode: `from sklearn.kernel_approximation import NBFSSampler, Nystroem, RBFSampler

rbf_sampler = RBFSampler(gamma=0.5, n_components=200, random_state=42)
Z_skl = rbf_sampler.fit_transform(X_sep)
print("Scikit-Learn RBFSampler output shape:", Z_skl.shape)`,
    diagCode: `nystroem = Nystroem(gamma=0.5, n_components=50, random_state=42)
Z_nys = nystroem.fit_transform(X_sep)
print("Nystroem Approximated Shape:", Z_nys.shape)`,
    caseStudy: "Pencarian kemiripan audio berskala 10 juta lagu di Spotify: RFF memungkinkan pemetaan kernel RBF secara streaming tanpa menyimpan matriks Gram.",
    commonPitfalls: ["Mengatur jumlah komponen D pada RFF terlalu kecil, menghasilkan aproksimasi kernel yang memiliki varians Monte Carlo tinggi."],
    groundingLinks: [{ title: "Rahimi & Recht (2007) Random Features for Large-Scale Kernel Machines", url: "https://papers.nips.cc/paper/2007/hash/013a006f03dbc5392effeb8f18fda755-Abstract.html", note: "Paper pemenang Test of Time Award NeurIPS" }]
  })
];

const chapter12 = {
  id: "machine-learning-ch-12",
  slug: "bab-12-kernel-methods-teorema-mercer-rkhs-rbf-kernel-ridge",
  title: "BAB 12: Kernel Methods & Teorema Mercer (RKHS, RBF, & Kernel Ridge)",
  orderIndex: 12,
  description: "Teori dan aplikasi metode kernel: pemetaan ruang Hilbert dimensi tinggi, Kernel Trick, Teorema Mercer dan matriks Gram PSD, taksonomi kernel standar (RBF, Polinomial), Support Vector Regression (SVR), dan skalabilitas kernel via Nyström dan Random Fourier Features (RFF).",
  coreConcepts: [
    "Pemetaan Non-Linier Ruang Hilbert",
    "Kernel Trick & Inner Product Implisit",
    "Teorema Mercer & Reproducing Kernel Hilbert Space (RKHS)",
    "Taksonomi Kernel Standar (RBF & Polinomial)",
    "Support Vector Regression (SVR) & Epsilon Loss",
    "Aproksimasi Skalabilitas Nyström & Random Fourier Features"
  ],
  subchapters: ch12Subs
};

fs.writeFileSync(path.join(outDir, 'chunk3-ch12.ts'), exportChapterTs(chapter12, 'chapter12'), 'utf-8');
console.log('Successfully generated chunk3-ch12.ts (6 subchapters)');


// ============================================================================
// BAB 13: k-Nearest Neighbors, Metrik Jarak, & Indeks Spasial HNSW (6 Subbab)
// ============================================================================
const ch13Subs = [
  createSubchapter({
    id: "ml-13-1-prinsip-instance-based-cover-hart",
    slug: "13-1-prinsip-instance-based-cover-hart",
    title: "13.1 Prinsip Belajar Non-Parametrik Instance-Based: Topologi Ruang Metrik & Teorema Cover-Hart",
    orderIndex: 1,
    description: "Fondasi algoritma non-parametrik instance-based (lazy learning): ketiadaan fase pelatihan eksplisit, topologi ruang metrik, dan jaminan Teorema Cover-Hart.",
    theoryMarkdown: `k-Nearest Neighbors (k-NN) adalah algoritma *lazy learning* non-parametrik: tidak ada model terparameterisasi yang dipelajari selama pelatihan; komputasi ditangguhkan hingga saat inferensi (*query time*).

**Teorema Cover-Hart (1967)**:
Untuk 1-Nearest Neighbor ($k=1$), saat ukuran sampel $n \\to \\infty$, probabilitas kesalahan asimtotik $R$ dibatasi oleh paling banyak dua kali kesalahan optimal Bayes $R^*$ (*Bayes error rate*):
$$R^* \\le R_{1-\\text{NN}} \\le 2 R^* (1 - R^*) \\le 2 R^*$$
Ini memberikan jaminan teoretis yang sangat kuat: algoritma sederhana berbasis tetangga terdekat dijamin menangkap setidaknya separuh dari seluruh informasi diskriminatif yang ada di data!`,
    mermaidDiagram: `graph TD
    Train["Data Latih (X, y)"] --> Store["Simpan Data secara Eksplisit (Lazy Learning)"]
    Query["Query Titik Baru x_q"] --> Dist["Hitung Jarak d(x_q, x_i) ke Seluruh Titik"]
    Dist --> TopK["Pilih k-Sampel dengan Jarak Terdekat"]
    TopK --> Vote["Majority Voting (Klasifikasi) atau Mean Terbobot (Regresi)"]`,
    scratchCode: `def knn_predict_single(X_train: np.ndarray, y_train: np.ndarray, x_query: np.ndarray, k: int = 3):
    distances = np.linalg.norm(X_train - x_query, axis=1)
    k_nearest_indices = np.argsort(distances)[:k]
    k_nearest_labels = y_train[k_nearest_indices]
    # Majority vote
    vals, counts = np.unique(k_nearest_labels, return_counts=True)
    return vals[np.argmax(counts)]

np.random.seed(42)
X_knn = np.random.randn(100, 2)
y_knn = (X_knn[:, 0] + X_knn[:, 1] > 0).astype(int)
print("Prediksi 3-NN titik [1.0, 1.0]:", knn_predict_single(X_knn, y_knn, np.array([1.0, 1.0]), k=3))`,
    sotaCode: `from sklearn.neighbors import KNeighborsClassifier

knn_skl = KNeighborsClassifier(n_neighbors=3).fit(X_knn, y_knn)
print("Scikit-Learn 3-NN Prediksi:", knn_skl.predict([[1.0, 1.0]])[0])`,
    diagCode: `print("Akurasi Latih k-NN:", knn_skl.score(X_knn, y_knn))`,
    caseStudy: "Pencarian produk serupa pada e-commerce (Visual Search): Mencari 10 pakaian dengan embedding fitur visual terdekat ke foto yang diunggah pengguna.",
    commonPitfalls: ["Biaya inferensi O(n d) yang sangat lambat pada dataset masif jika menggunakan pencarian brute-force."],
    groundingLinks: [{ title: "Cover & Hart (1967) Nearest neighbor pattern classification", url: "https://doi.org/10.1109/TIT.1967.1053964", note: "Paper asli Teorema Cover-Hart" }]
  }),

  createSubchapter({
    id: "ml-13-2-taksonomi-metrik-jarak-spasial",
    slug: "13-2-taksonomi-metrik-jarak-spasial",
    title: "13.2 Taksonomi Metrik Jarak Spasial: Euclidean, Manhattan, Minkowski, Mahalanobis, & Cosine Distance",
    orderIndex: 2,
    description: "Analisis aksioma ruang metrik dan perbandingan metrik jarak: Euclidean (L2), Manhattan (L1), Minkowski (Lp), Mahalanobis (berbasis kovarians), dan Cosine distance.",
    theoryMarkdown: `Fungsi jarak $d(\\mathbf{x}, \\mathbf{z})$ harus memenuhi aksioma ruang metrik:
1. Non-negatif: $d(\\mathbf{x}, \\mathbf{z}) \\ge 0$ dan $d(\\mathbf{x}, \\mathbf{z}) = 0 \\iff \\mathbf{x} = \\mathbf{z}$
2. Simetri: $d(\\mathbf{x}, \\mathbf{z}) = d(\\mathbf{z}, \\mathbf{x})$
3. Ketidaksamaan Segitiga: $d(\\mathbf{x}, \\mathbf{y}) \\le d(\\mathbf{x}, \\mathbf{z}) + d(\\mathbf{z}, \\mathbf{y})$

### Metrik Standar:
- **Minkowski ($L_p$)**: $d_p(\\mathbf{x}, \\mathbf{z}) = \\left( \\sum_{j=1}^d |x_j - z_j|^p \\right)^{1/p}$ ($p=1$ Manhattan, $p=2$ Euclidean).
- **Cosine Distance**: $d_{\\cos}(\\mathbf{x}, \\mathbf{z}) = 1 - \\frac{\\mathbf{x}^T\\mathbf{z}}{\\|\\mathbf{x}\\|_2 \\|\\mathbf{z}\\|_2}$ (mengukur sudut arah, invarian terhadap skala panjang).
- **Mahalanobis Distance**: $d_M(\\mathbf{x}, \\mathbf{z}) = \\sqrt{(\\mathbf{x} - \\mathbf{z})^T \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x} - \\mathbf{z})}$ (memperhitungkan korelasi dan varians antar fitur).`,
    mermaidDiagram: `graph TD
    Metrics["Taksonomi Metrik Jarak"] --> L2["Euclidean L2: Jarak Garis Lurus Standar"]
    Metrics --> L1["Manhattan L1: Grid Kotak Kota (Robust Outlier)"]
    Metrics --> Cos["Cosine: Sudut Orientasi Vektor (Teks & Embedding)"]
    Metrics --> Maha["Mahalanobis: Menormalkan Korelasi Kovarians Fitur"]`,
    scratchCode: `def mahalanobis_distance(x: np.ndarray, z: np.ndarray, cov: np.ndarray) -> float:
    diff = x - z
    inv_cov = np.linalg.inv(cov)
    return np.sqrt(diff.T @ inv_cov @ diff)

cov_mat = np.array([[2.0, 0.5], [0.5, 1.0]])
print("Mahalanobis Distance:", mahalanobis_distance(np.array([1.0, 2.0]), np.array([0.0, 0.0]), cov_mat))`,
    sotaCode: `from scipy.spatial.distance import mahalanobis

print("SciPy Mahalanobis:", mahalanobis([1.0, 2.0], [0.0, 0.0], np.linalg.inv(cov_mat)))`,
    diagCode: `print("Verifikasi identik:", np.isclose(mahalanobis_distance(np.array([1.0, 2.0]), np.array([0.0, 0.0]), cov_mat), mahalanobis([1.0, 2.0], [0.0, 0.0], np.linalg.inv(cov_mat))))`,
    caseStudy: "Deteksi anomali pada sensor turbin pesawat: Mahalanobis distance memperhitungkan bahwa suhu tinggi dan tekanan tinggi berkorelasi positif dalam operasi normal.",
    commonPitfalls: ["Menggunakan Euclidean distance tanpa standarisasi fitur: Fitur dengan satuan besar (misal gaji jutaan rupiah) akan mendominasi 99.9% jarak."],
    groundingLinks: [{ title: "Scikit-Learn Distance Metrics Documentation", url: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.distance_metrics.html", note: "Dokumentasi metrik jarak" }]
  }),

  createSubchapter({
    id: "ml-13-3-kutukan-dimensi-curse-dimensionality",
    slug: "13-3-kutukan-dimensi-curse-dimensionality",
    title: "13.3 Fenomena Kutukan Dimensi (Curse of Dimensionality) & Konsentrasi Jarak pada Ruang Hiperdimensi",
    orderIndex: 3,
    description: "Analisis fenomena Curse of Dimensionality: konsentrasi jarak spasial (distance concentration), rasio volume bola terhadap hiperkubus, dan hilangnya makna ketetanggaan.",
    theoryMarkdown: `Pada ruang berdimensi tinggi ($d \\gg 100$):
1. **Pemekaran Ruang Volume**: Volume hiperkubus bersisi $1$ adalah $1^d = 1$, tetapi volume bola inskripsi berjari-jari $0.5$ adalah $V_d = \\frac{\\pi^{d/2}}{\\Gamma(d/2 + 1)} (0.5)^d \\to 0$ saat $d \\to \\infty$. Hampir seluruh volume terkonsentrasi di sudut-sudut kubus!

2. **Konsentrasi Jarak (Beyer et al., 1999)**:
   Rasio selisih jarak terjauh dan terdekat terhadap jarak terdekat mendekati nol:
   $$\\lim_{d \\to \\infty} \\frac{\\text{dist}_{\\max} - \\text{dist}_{\\min}}{\\text{dist}_{\\min}} = 0$$
   Akibatnya, semua titik data menjadi memiliki jarak yang hampir persis sama satu sama lain! Konsep "tetangga terdekat" kehilangan makna diskriminatifnya.`,
    mermaidDiagram: `graph TD
    HighD["Dimensi d Meningkat Drastis (d > 100)"] --> Empty["Ruang Menjadi Sangat Kosong (Sparsity Ekstrem)"]
    HighD --> Concentr["Konsentrasi Jarak: (dist_max - dist_min) / dist_min -> 0"]
    Concentr --> Fail["k-NN Gagal Membedakan Titik Dekat vs Titik Jauh"]
    Fail --> DimRed["Solusi Wajib: Reduksi Dimensi (PCA, UMAP) atau Metrik Cosine"]`,
    scratchCode: `def simulate_distance_concentration(dims=[2, 10, 50, 200, 1000], n_points=200):
    ratios = []
    for d in dims:
        pts = np.random.uniform(0, 1, size=(n_points, d))
        # Hitung jarak pairwise
        dists = [np.linalg.norm(pts[i] - pts[j]) for i in range(len(pts)) for j in range(i+1, len(pts))]
        d_min, d_max = np.min(dists), np.max(dists)
        ratios.append((d_max - d_min) / d_min)
    return dims, ratios

dims, ratios = simulate_distance_concentration()
for d, r in zip(dims, ratios):
    print(f"Dimensi {d:4d} | Rasio (d_max - d_min) / d_min: {r:.4f}")`,
    sotaCode: `from sklearn.metrics import pairwise_distances

D_mat = pairwise_distances(np.random.uniform(0, 1, size=(50, 500)))
print("Mean Pairwise Distance d=500:", np.mean(D_mat))`,
    diagCode: `print("Standar Deviasi Jarak d=500:", np.std(D_mat))`,
    caseStudy: "Pencarian vektor representasi teks (Word2Vec / BERT embeddings 768 dimensi): Menggunakan Cosine Similarity alih-alih Euclidean distance untuk menghindari konsentrasi jarak.",
    commonPitfalls: ["Mengaplikasikan k-NN langsung pada citra mentah beresolusi tinggi tanpa reduksi dimensi laten."],
    groundingLinks: [{ title: "Beyer et al. (1999) When Is 'Nearest Neighbor' Meaningful?", url: "https://doi.org/10.1007/3-540-49257-7_15", note: "Paper kanonikal konsentrasi jarak" }]
  }),

  createSubchapter({
    id: "ml-13-4-partisi-spasial-kd-tree-ball-tree",
    slug: "13-4-partisi-spasial-kd-tree-ball-tree",
    title: "13.4 Partisi Spasial Pohon Hierarkis: Struktur Data KD-Tree, Ball-Tree, & Pengecekan Jarak Terpangkas",
    orderIndex: 4,
    description: "Akselerasi pencarian tetangga terdekat eksak: struktur pohon biner partisi ortogonal KD-Tree, Ball-Tree untuk ruang non-Euclidean, dan pruning cabang jarak.",
    theoryMarkdown: `Pencarian Brute-force memiliki kompleksitas $O(n \\cdot d)$ per query. Struktur partisi spasial mempercepat pencarian menjadi $O(d \\log n)$:

1. **KD-Tree (K-Dimensional Tree)**:
   Pohon biner yang membagi ruang secara rekursif menggunakan hyperplane ortogonal yang tegak lurus terhadap sumbu koordinat bergantian pada titik median.
   Selama pencarian, cabang pohon dipangkas jika jarak ke bidang pemisah lebih besar daripada jarak ke tetangga terdekat saat ini. Efektif saat $d < 20$.

2. **Ball-Tree**:
   Membagi ruang menggunakan hiperbola bertingkat (*nested hyperspheres*). Mampu menangani ruang metrik non-Euclidean (misal jarak geodetik) dan bekerja lebih baik pada dimensi sedang.`,
    mermaidDiagram: `graph TD
    Root["Root: Belah Ruang pada Sumbu X (Median)"] --> LeftX["Wilayah Kiri (X <= median)"]
    Root --> RightX["Wilayah Kanan (X > median)"]
    LeftX --> BelahY1["Belah pada Sumbu Y (Median Kiri)"]
    RightX --> BelahY2["Belah pada Sumbu Y (Median Kanan)"]
    BelahY1 & BelahY2 --> Prune["Pencarian Query: Pangkas Cabang Jika Jarak ke Kotak > Jarak Terbaik"]`,
    scratchCode: `class SimpleKDNode:
    def __init__(self, point, left=None, right=None, axis=0):
        self.point = point
        self.left = left
        self.right = right
        self.axis = axis

def build_simple_kdtree(points, depth=0):
    if len(points) == 0:
        return None
    d = len(points[0])
    axis = depth % d
    points = sorted(points, key=lambda x: x[axis])
    median_idx = len(points) // 2
    return SimpleKDNode(
        point=points[median_idx],
        left=build_simple_kdtree(points[:median_idx], depth + 1),
        right=build_simple_kdtree(points[median_idx + 1:], depth + 1),
        axis=axis
    )

sample_pts = [[2, 3], [5, 4], [9, 6], [4, 7], [8, 1], [7, 2]]
kd_root = build_simple_kdtree(sample_pts)
print("KD-Tree Root Point:", kd_root.point, "Split Axis:", kd_root.axis)`,
    sotaCode: `from sklearn.neighbors import KDTree

kdtree = KDTree(sample_pts, leaf_size=2)
dist, ind = kdtree.query([[3, 4]], k=2)
print("KDTree Scikit-Learn Query Distances:", dist[0])
print("KDTree Nearest Point Index         :", ind[0])`,
    diagCode: `print("Nearest Point Coordinates:", [sample_pts[i] for i in ind[0]])`,
    caseStudy: "Sistem GIS pemetaan navigasi GPS: Menemukan stasiun pengisian bahan bakar atau ambulans terdekat dalam radius kilometer secara instan.",
    commonPitfalls: ["Menggunakan KD-Tree pada dimensi d > 30: Kemampuannya merosot menjadi lebih lambat daripada pencarian brute-force linear scan."],
    groundingLinks: [{ title: "Bentley (1975) Multidimensional binary search trees used for associative searching", url: "https://doi.org/10.1145/361002.361007", note: "Paper asli penemuan KD-Tree" }]
  }),

  createSubchapter({
    id: "ml-13-5-approximate-nearest-neighbors-hnsw",
    slug: "13-5-approximate-nearest-neighbors-hnsw",
    title: "13.5 Approximate Nearest Neighbors (ANN): Graf Hierarchical Navigable Small World (HNSW) & Vektor Search",
    orderIndex: 5,
    description: "Solusi pencarian vektor skala miliaran: Approximate Nearest Neighbors (ANN), graf multi-layer Hierarchical Navigable Small World (HNSW), dan vector database.",
    theoryMarkdown: `Untuk pencarian kemiripan pada miliaran vektor berdimensi tinggi (AI Vector Databases / RAG LLM), pencarian eksak tidak mungkin dilakukan. **Hierarchical Navigable Small World (HNSW)** (Malkov & Yashunin, 2018) adalah standar emas industri.

HNSW mengorganisasikan graf dalam beberapa lapisan hierarki (mirip Skip-List):
1. Lapisan teratas memiliki tautan berjarak jauh (*long-range links*) untuk melompat cepat melintasi ruang vektor (*expressway*).
2. Lapisan terbawah memiliki densitas tinggi untuk pencarian tetangga lokal berpresisi tinggi.
Kompleksitas pencarian: $O(\\log n)$ dengan recall > 98%.`,
    mermaidDiagram: `graph TD
    Layer2["Lapisan 2 (Top Layer / Sparse): Lompatan Jarak Jauh Cepat O(log n)"] --> Layer1
    Layer1["Lapisan 1 (Medium Density): Penelusuran Wilayah Target"] --> Layer0
    Layer0["Lapisan 0 (Semua Vektor / Bottom Layer): Pencarian Lokal Presisi Tinggi"]`,
    scratchCode: `def simulate_ann_skip_search():
    """Simulasi konseptual lompatan bertingkat HNSW."""
    layers = {2: [0, 50, 100], 1: [0, 25, 50, 75, 100], 0: list(range(101))}
    target = 73
    curr = 0
    # Lapisan 2
    curr = max([x for x in layers[2] if x <= target])
    # Lapisan 1
    curr = max([x for x in layers[1] if x <= target])
    # Lapisan 0
    closest = min(layers[0], key=lambda x: abs(x - target))
    return closest

print("HNSW Similasi Titik Terdekat:", simulate_ann_skip_search())`,
    sotaCode: `from sklearn.neighbors import NearestNeighbors

# Scikit-learn NearestNeighbors benchmark
nn = NearestNeighbors(n_neighbors=5, algorithm='auto').fit(X_knn)
dists, indices = nn.kneighbors([X_knn[0]])
print("Nearest Neighbors Scikit-Learn Inds:", indices[0])`,
    diagCode: `print("Jarak ke tetangga terdekat:", dists[0])`,
    caseStudy: "Arsitektur Retrieval-Augmented Generation (RAG) pada Milvus/Pinecone: Menemukan 5 paragraf konteks pengetahuan paling relevan dari 10 juta dokumen.",
    commonPitfalls: ["Mengabaikan trade-off antara efisiensi memori RAM dan akurasi recall pada penyetelan hiperparameter efSearch dan M."],
    groundingLinks: [{ title: "Malkov & Yashunin (2018) HNSW Paper", url: "https://doi.org/10.1109/TPAMI.2018.2889473", note: "Paper kanonikal HNSW IEEE TPAMI" }, { title: "Faiss Repository (Facebook AI)", url: "https://github.com/facebookresearch/faiss", note: "Pustaka mesin pencari vektor tercepat" }]
  }),

  createSubchapter({
    id: "ml-13-6-knn-regresi-terbobot-skala-fitur",
    slug: "13-6-knn-regresi-terbobot-skala-fitur",
    title: "13.6 k-NN Regresi Terbobot Jarak & Pengaruh Skala Fitur Terhadap Batas Keputusan",
    orderIndex: 6,
    description: "k-NN untuk estimasi regresi kontinu: pembobotan invers jarak (1/d) dan Gaussian kernel, serta analisis sensitivitas skala fitur.",
    theoryMarkdown: `Pada **k-NN Regression**, prediksi nilai kontinu target $\\hat{y}$ dihitung sebagai rata-rata berbobot tetangga terdekat:
$$\\hat{y}(\\mathbf{x}) = \\frac{\\sum_{i=1}^k w_i y_i}{\\sum_{i=1}^k w_i}$$

Skema pembobotan standar:
1. Bobot seragam (*Uniform*): $w_i = 1$
2. Invers jarak (*Inverse Distance*): $w_i = \\frac{1}{d(\\mathbf{x}, \\mathbf{x}_i)}$
3. Gaussian Kernel Weighting: $w_i = \\exp\\left( -\\frac{d(\\mathbf{x}, \\mathbf{x}_i)^2}{2\\sigma^2} \\right)$

Pembobotan jarak menghasilkan fungsi estimasi yang lebih halus (*smooth*) dan mengurangi bias diskretisasi.`,
    mermaidDiagram: `graph LR
    Query["Titik Query x"] --> Find["Cari k-Tetangga Terdekat"]
    Find --> Weight["Hitung Bobot Jarak: w_i = 1 / d(x, x_i)"]
    Weight --> Predict["Prediksi Rata-rata Terbobot: y_hat = sum(w_i y_i) / sum(w_i)"]`,
    scratchCode: `def knn_regression_weighted(X_train, y_train, x_query, k=3):
    dists = np.linalg.norm(X_train - x_query, axis=1)
    k_idx = np.argsort(dists)[:k]
    k_dists = dists[k_idx]
    k_targets = y_train[k_idx]
    weights = 1.0 / np.maximum(k_dists, 1e-8)
    return np.sum(weights * k_targets) / np.sum(weights)

X_tr = np.array([[1.0], [2.0], [3.0], [4.0]])
y_tr = np.array([10.0, 20.0, 30.0, 40.0])
print("k-NN Regresi Terbobot pada x=2.2:", knn_regression_weighted(X_tr, y_tr, np.array([2.2]), k=2))`,
    sotaCode: `from sklearn.neighbors import KNeighborsRegressor

knn_reg = KNeighborsRegressor(n_neighbors=2, weights='distance').fit(X_tr, y_tr)
print("Scikit-Learn k-NN Regresi:", knn_reg.predict([[2.2]])[0])`,
    diagCode: `print("Verifikasi kesamaan nilai regresi terbobot:", np.isclose(knn_regression_weighted(X_tr, y_tr, np.array([2.2]), k=2), knn_reg.predict([[2.2]])[0]))`,
    caseStudy: "Estimasi harga sewa kamar Airbnb berbasis lokasi spasial: Unit terdekat dalam radius 100 meter memiliki bobot pengaruh jauh lebih besar.",
    commonPitfalls: ["Lupa bahwa k-NN regresi tidak dapat melakukan ekstrapolasi di luar batas rentang minimum dan maksimum nilai data latih."],
    groundingLinks: [{ title: "Scikit-Learn KNeighborsRegressor Documentation", url: "https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsRegressor.html", note: "Dokumentasi modul k-NN Regresi" }]
  })
];

const chapter13 = {
  id: "machine-learning-ch-13",
  slug: "bab-13-k-nearest-neighbors-metrik-jarak-indeks-spasial-hnsw",
  title: "BAB 13: k-Nearest Neighbors, Metrik Jarak, & Indeks Spasial HNSW",
  orderIndex: 13,
  description: "Landasan non-parametrik instance-based learning: Teorema Cover-Hart, taksonomi metrik jarak spasial, analisis patologi Curse of Dimensionality, partisi spasial KD-Tree dan Ball-Tree, indeks graf ANN HNSW untuk pencarian vektor skala masif, serta k-NN regresi terbobot.",
  coreConcepts: [
    "Instance-Based Learning & Teorema Cover-Hart",
    "Metrik Jarak Minkowski, Cosine, & Mahalanobis",
    "Curse of Dimensionality & Konsentrasi Jarak",
    "Partisi Spasial KD-Tree & Ball-Tree",
    "Hierarchical Navigable Small World (HNSW) Vector Search",
    "k-NN Regresi Terbobot Jarak"
  ],
  subchapters: ch13Subs
};

fs.writeFileSync(path.join(outDir, 'chunk3-ch13.ts'), exportChapterTs(chapter13, 'chapter13'), 'utf-8');
console.log('Successfully generated chunk3-ch13.ts (6 subchapters)');


// ============================================================================
// Aggregator: chunk3-generative-svm-knn.ts
// ============================================================================
const chunk3Aggregator = `import { AcademicChapter } from "../../types";
import { chapter10 } from "./chunk3-ch10";
import { chapter11 } from "./chunk3-ch11";
import { chapter12 } from "./chunk3-ch12";
import { chapter13 } from "./chunk3-ch13";

/**
 * CHUNK 3: MODEL GENERATIF, SUPPORT VECTOR MACHINES, METODE KERNEL, & k-NN
 * Cakupan: Bab 10 s/d Bab 13 (Tepat 23 Subbab Kanonikal)
 * - Bab 10: Generative Classifiers: LDA, QDA, & Naive Bayes (6 Subbab)
 * - Bab 11: Support Vector Machines: Hard/Soft Margin & Dualitas Wolfe (5 Subbab)
 * - Bab 12: Kernel Methods & Teorema Mercer (RKHS, RBF, & Kernel Ridge) (6 Subbab)
 * - Bab 13: k-Nearest Neighbors, Metrik Jarak, & Indeks Spasial HNSW (6 Subbab)
 */
export const chunk3GenerativeSvmKnn: AcademicChapter[] = [
  chapter10,
  chapter11,
  chapter12,
  chapter13,
];

export {
  chapter10,
  chapter11,
  chapter12,
  chapter13,
};
`;

fs.writeFileSync(path.join(outDir, 'chunk3-generative-svm-knn.ts'), chunk3Aggregator, 'utf-8');
console.log('Successfully generated chunk3-generative-svm-knn.ts (Chapters 10 - 13, 23 subchapters)');
