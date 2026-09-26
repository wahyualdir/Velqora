const fs = require('fs');
const path = require('path');

const promptTaxonomy = [
  // BAB 01 (6)
  { ch: 1, id: "machine-learning-ch-01", title: "BAB 01: Paradigma Komputasi & Perumusan Masalah Ilmiah", subs: [
    "01.1 Taksonomi Formal Komputasi: Supervised, Unsupervised, Semi-supervised, & Self-Supervised",
    "01.2 Definisi Pembelajaran Formal: Triplet Mitchell (T, E, P) & Pemetaan Ruang Vektor",
    "01.3 Representasi Matriks Desain, Skala Pengukuran Data, & Rank Matrix",
    "01.4 Taksonomi Fungsi Kerugian Analitis: Convex vs Non-Convex, Smooth vs Subgradient",
    "01.5 Jaminan Generalisasi Inferensial, Memorization vs Learning, & Occam's Razor",
    "01.6 Kompleksitas Komputasi Algoritmik: Notasi Big-O, Flops, & Batas Memori Hardware"
  ]},
  // BAB 02 (8)
  { ch: 2, id: "machine-learning-ch-02", title: "BAB 02: Aljabar Linier Komputasional & Kalkulus Matriks", subs: [
    "02.1 Ruang Vektor Euclidean, Geometri Inner Product, & Norma Matriks",
    "02.2 Proyeksi Ortogonal, Komplemen Ortogonal, & Gram-Schmidt Orthonormalization",
    "02.3 Nilai Eigen, Vektor Eigen, & Eigendecomposition Simetris",
    "02.4 Singular Value Decomposition (SVD): Penurunan Matematis & Aproksimasi Low-Rank",
    "02.5 Matriks Definit Positif, Dekomposisi Cholesky, & Quadratic Forms",
    "02.6 Kalkulus Vektor-Matriks: Turunan Terhadap Skalar, Vektor, & Matriks (Denominator vs Numerator)",
    "02.7 Matriks Jacobian, Hessian, Derivatif Arah, & Uji Konveksitas Kurvatur",
    "02.8 Kondisi Kondisi Matriks (Condition Number), Nilai Singular Ekstrem, & Kestabilan Numerik"
  ]},
  // BAB 03 (8)
  { ch: 3, id: "machine-learning-ch-03", title: "BAB 03: Teori Probabilitas, Estimasi Parameter, & Bayesian Inference", subs: [
    "03.1 Ruang Probabilitas Axiomatik Kolmogorov, Probabilitas Bersyarat, & Teorema Bayes",
    "03.2 Densitas Probabilitas Multivariat: Keluarga Gaussian Multivariat & Kovarians",
    "03.3 Maximum Likelihood Estimation (MLE): Formulasi Teori & Turunan Skor Fischer",
    "03.4 Informasi Fisher, Batas Bawah Cramér-Rao, & Efisiensi Asimtotik Estimator",
    "03.5 Maximum A Posteriori (MAP): Integrasi Prior, Teorema Bayes, & Regularisasi Alami",
    "03.6 Bayesian Inference Penuh: Distribusi Konjugat Prior & Integrasi Marginal Likelihood",
    "03.7 Teori Informasi: Entropi Shannon, Cross-Entropy, & Divergensi Kullback-Leibler (KL)",
    "03.8 Sampling Teoretis: Hukum Bilangan Besar, Central Limit Theorem, & Monte Carlo Numerik"
  ]},
  // BAB 04 (7)
  { ch: 4, id: "machine-learning-ch-04", title: "BAB 04: Teori Belajar Statistik & Dekomposisi Bias-Variance", subs: [
    "04.1 Model Belajar Formal: Probably Approximately Correct (PAC) Learning & Jaminan Batas Epsilon",
    "04.2 Dekomposisi Bias-Variance Terbobot: Penurunan Analitis Kuadrat Kerugian",
    "04.3 Dimensi Vapnik-Chervonenkis (VC Dimension): Teori Kapasitas Model & Batas Generalisasi",
    "04.4 Kompleksitas Rademacher & Pertumbuhan Shattering: Batas Generalisasi Data-Dependent",
    "04.5 Fenomena Overfitting, Underfitting, & Minimum Description Length (MDL)",
    "04.6 Fenomena Modern Double Descent: Paradigma Interpolasi Asimtotik",
    "04.7 Teorema No Free Lunch (NFL): Batas Fundamental Generalisasi Induktif"
  ]},
  // BAB 05 (9)
  { ch: 5, id: "machine-learning-ch-05", title: "BAB 05: Algoritma Optimasi Numerik: First-Order, Second-Order, & Proximal", subs: [
    "05.1 Fondasi Optimasi Konveks: Fungsi Konveksitas Kuat, Lipschitz Continuous Gradient, & Kondisi KKT",
    "05.2 Batch Gradient Descent: Laju Konvergensi Sub-linear vs Linear & Batas Langkah Armijo",
    "05.3 Stochastic Gradient Descent (SGD) & Mini-Batch SGD: Teori Martingale & Varians Stokastik",
    "05.4 Metode Momentum Klasik (Polyak) & Akselerasi Gradien Nesterov (NAG)",
    "05.5 Algoritma Laju Belajar Adaptif: AdaGrad, RMSprop, & Penurunan Matematika Adam / AdamW",
    "05.6 Metode Orde Kedua: Newton-Raphson, Perhitungan Invers Hessian, & Masalah Titik Pelana",
    "05.7 Metode Quasi-Newton: Pembaruan Rank-2 BFGS, Algoritma Memori Terbatas L-BFGS",
    "05.8 Optimasi Non-Smooth: Subgradient Calculus & Operator Proksimal (Proximal Gradient Method)",
    "05.9 Strategi Penjadwalan Laju Belajar: Cosine Annealing, Warm Restarts, & Siklus One-Cycle"
  ]},
  // BAB 06 (6)
  { ch: 6, id: "machine-learning-ch-06", title: "BAB 06: Regresi Linier OLS, Teorema Gauss-Markov, & Diagnostik Residual", subs: [
    "06.1 Formulasi Matematis Ordinary Least Squares (OLS) & Penurunan Normal Equations",
    "06.2 Geometri Kuadrat Terkecil: Matriks Proyeksi Kolom (Hat Matrix) & Matriks Annihilator",
    "06.3 Teorema Gauss-Markov: Pembuktian Sifat Best Linear Unbiased Estimator (BLUE)",
    "06.4 Distribusi Sampling Parameter, Standard Error, Uji t-Student, & Uji F Parsial",
    "06.5 Diagnostik Residual: Uji Normalitas (Jarque-Bera), Homoskedastisitas (Breusch-Pagan), & Autokorelasi",
    "06.6 Titik Pengungkit Tinggi (Leverage), Residual Terstandarisasi, & Jarak Cook (Cook's Distance)"
  ]},
  // BAB 07 (6)
  { ch: 7, id: "machine-learning-ch-07", title: "BAB 07: Regularisasi Linier Lanjut: Ridge, Lasso, ElasticNet, LARS, & SCAD", subs: [
    "07.1 Masalah Multikolinearitas Ekstrem, Il-Conditioning Matriks, & Inflasi Varians Parameter (VIF)",
    "07.2 Ridge Regression (Tikhonov L2): Penurunan Bias Terkendali & Reduksi Varians Analitis",
    "07.3 Lasso Regression (L1 Penalty): Geometri Subgradient, Sparsitas Parameter, & Soft-Thresholding",
    "07.4 Algoritma Siklik Coordinate Descent untuk Solusi Eksak Lasso & Waktu Konvergensi",
    "07.5 ElasticNet Regression: Menggabungkan L1 dan L2 untuk Mengatasi Pengelompokan Fitur Kolinier",
    "07.6 Least Angle Regression (LARS) & Regularisasi Non-Konveks Modern (SCAD & MCP)"
  ]},
  // BAB 08 (6)
  { ch: 8, id: "machine-learning-ch-08", title: "BAB 08: Model Klasifikasi Linier: Regresi Logistik, Softmax, & IRLS", subs: [
    "08.1 Model Peluang Klasifikasi Biner, Odds Ratio, Log-Odds, & Fungsi Sigmoid Terstabilkan",
    "08.2 Penurunan Fungsi Biaya Binary Cross-Entropy (Log-Loss) dari Prinsip Likelihood Bernoulli",
    "08.3 Algoritma Iteratively Reweighted Least Squares (IRLS) & Komputasi Hessian Berbobot",
    "08.4 Klasifikasi Multikelas: Multinomial Logistic Regression (Softmax Regression) & Fungsi Cross-Entropy",
    "08.5 Geometri Batas Keputusan Linier, Jarak Margin Terhadap Hyperplane, & Ketertelusuran Data",
    "08.6 Masalah Separasi Sempurna (Quasi-Complete Separation) & Koreksi Regularisasi Firth"
  ]},
  // BAB 09 (5)
  { ch: 9, id: "machine-learning-ch-09", title: "BAB 09: Generalized Linear Models (GLM) & Exponential Family", subs: [
    "09.1 Keluarga Eksponensial Terparameterisasi (Exponential Dispersion Family): Sifat Dasar & Momen",
    "09.2 Anatomi Tiga Komponen GLM: Komponen Acak, Komponen Sistematis, & Fungsi Penghubung (Link Function)",
    "09.3 Regresi Poisson untuk Data Cacah (Count Data), Masalah Overdispersi, & Regresi Binomial Negatif",
    "09.4 Regresi Gamma & Tweedie Compound Poisson untuk Klaim Asuransi dan Data Kontinu Positif",
    "09.5 Evaluasi Kecocokan Model: Deviance Statistik, Residual Pearson, & Skor AIC/BIC Asimtotik"
  ]},
  // BAB 10 (6)
  { ch: 10, id: "machine-learning-ch-10", title: "BAB 10: Generative Classifiers: LDA, QDA, & Naive Bayes", subs: [
    "10.1 Paradigma Generatif vs Diskriminatif: Pemodelan Peluang Bersama P(X, Y) vs Peluang Bersyarat P(Y|X)",
    "10.2 Linear Discriminant Analysis (LDA): Rasio Rayleigh, Matriks Scatter Within-Class & Between-Class",
    "10.3 Quadratic Discriminant Analysis (QDA): Relaksasi Matriks Kovarians Heterogen & Batas Non-Linier",
    "10.4 Reduksi Dimensi Terawasi melalui Proyeksi Ruang Sub-LDA Fisher",
    "10.5 Naive Bayes Classifier: Asumsi Independensi Bersyarat Fitur & Estimasi Peluang Marginal",
    "10.6 Varian Naive Bayes: Gaussian, Multinomial (Teks), Bernoulli, & Koreksi Laplace Smoothing"
  ]},
  // BAB 11 (5)
  { ch: 11, id: "machine-learning-ch-11", title: "BAB 11: Support Vector Machines: Hard/Soft Margin & Dualitas Wolfe", subs: [
    "11.1 Geometri Pemisah Hyperplane Maksimum Margin & Formulasi Primal Hard-Margin SVM",
    "11.2 Soft-Margin SVM: Relaksasi Slack Variables (Xi), Penalti Biaya C, & Trade-off Margin-Loss",
    "11.3 Formulasi Dualitas Lagrange, Dualitas Wolfe, & Persyaratan Karush-Kuhn-Tucker (KKT)",
    "11.4 Karakterisasi Vektor Pendukung (Support Vectors) & Sifat Komputasi Sparsitas Solusi Dual",
    "11.5 Algoritma Sequential Minimal Optimization (SMO) untuk Pelatihan SVM Tanpa QP Solver Eksternal"
  ]},
  // BAB 12 (6)
  { ch: 12, id: "machine-learning-ch-12", title: "BAB 12: Kernel Methods & Teorema Mercer (RKHS, RBF, & Kernel Ridge)", subs: [
    "12.1 Keterbatasan Model Linier & Ide Pemetaan Ruang Fitur Dimensi Tak Hingga (Hilbert Space)",
    "12.2 Kernel Trick: Menghitung Inner Product Tanpa Transformasi Eksplisit Phi(x)",
    "12.3 Teorema Mercer & Reproducing Kernel Hilbert Space (RKHS): Karakteristik Matriks Gram Definit Positif",
    "12.4 Taksonomi Kernel Standar: Polinomial, Radial Basis Function (Gaussian RBF), & Sigmoid",
    "12.5 Support Vector Regression (SVR): Tabung Kerugian Epsilon-Insensitive & Formulasi Dual",
    "12.6 Skalabilitas Kernel pada Dataset Besar: Aproksimasi Nyström & Random Fourier Features"
  ]},
  // BAB 13 (6)
  { ch: 13, id: "machine-learning-ch-13", title: "BAB 13: k-Nearest Neighbors, Metrik Jarak, & Indeks Spasial HNSW", subs: [
    "13.1 Prinsip Belajar Non-Parametrik Instance-Based: Topologi Ruang Metrik & Teorema Cover-Hart",
    "13.2 Taksonomi Metrik Jarak Spasial: Euclidean, Manhattan, Minkowski, Mahalanobis, & Cosine Distance",
    "13.3 Fenomena Kutukan Dimensi (Curse of Dimensionality) & Konsentrasi Jarak pada Ruang Hiperdimensi",
    "13.4 Partisi Spasial Pohon Hierarkis: Struktur Data KD-Tree, Ball-Tree, & Pengecekan Jarak Terpangkas",
    "13.5 Approximate Nearest Neighbors (ANN): Graf Hierarchical Navigable Small World (HNSW) & Vektor Search",
    "13.6 k-NN Regresi Terbobot Jarak & Pengaruh Skala Fitur Terhadap Batas Keputusan"
  ]},
  // BAB 14 (8)
  { ch: 14, id: "machine-learning-ch-14", title: "BAB 14: Pohon Keputusan (CART): Impuritas, Pruning, & Surrogate Splits", subs: [
    "14.1 Topologi Pohon Biner & Partisi Ruang Fitur Rekursif Sumbu Ortogonal (Orthogonal Hyperplanes)",
    "14.2 Kriteria Impuritas Klasifikasi: Penurunan Matematis Gini Impurity, Entropi Informasi, & Misclassification Error",
    "14.3 Kriteria Pembagian Regresi: Reduksi Varians (MSE), Mean Absolute Deviation (MAE), & Kriteria Poisson",
    "14.4 Algoritma Greedy Split-Finding pada Fitur Kontinu & Kategorial: Binning Histogram & Nilai Ambang Optimal",
    "14.5 Strategi Penghentian Awal (Pre-Pruning): Kedalaman Maksimum, Sampel Minimum Daun, & Toleransi Impuritas",
    "14.6 Pemangkasan Pasca-Pelatihan (Post-Pruning): Teori Cost-Complexity Pruning & Penelusuran Jalur Alfa Minimal",
    "14.7 Penanganan Data Hilang melalui Pembagian Pengganti (Surrogate Splits) & Pengaruh Ketidakseimbangan Fitur",
    "14.8 Ketidakstabilan Varians Tinggi CART, Pergeseran Aksis Rotasi Fitur, & Kebutuhan Paradigma Ensemble"
  ]},
  // BAB 15 (7)
  { ch: 15, id: "machine-learning-ch-15", title: "BAB 15: Ensemble Learning: Bagging, Pasting, & Random Forests OOB", subs: [
    "15.1 Prinsip Reduksi Varians Melalui Rata-Rata Acak (Law of Large Numbers pada Estimator Tak Berkorelasi)",
    "15.2 Bootstrap Aggregating (Bagging) vs Pasting: Teori Resampling Non-Parametrik dengan Pengembalian",
    "15.3 Evaluasi Out-Of-Bag (OOB): Pembuktian Batas Probabilitas 1/e (63.2% Data Terambil) & Validasi Bebas Uji",
    "15.4 Random Forests: Pengenalan Random Subspace Method (Subset Fitur Acak m = sqrt(d)) untuk Dekorelasi Pohon",
    "15.5 Extra-Trees (Extremely Randomized Trees): Pengacakan Ambang Pembagian Ekstrem untuk Reduksi Varians Maksimal",
    "15.6 Metrologi Kepentingan Fitur Berbasis Hutan: MDI (Gini Importance) vs Permutation Feature Importance (MDA)",
    "15.7 Analisis Kedekatan Sampel (Proximity Matrix) Random Forest untuk Klusterisasi & Imputasi Outlier"
  ]},
  // BAB 16 (7)
  { ch: 16, id: "machine-learning-ch-16", title: "BAB 16: Gradient Boosting Lanjut: Teori Friedman, Shrinkage, & Trees", subs: [
    "16.1 Paradigma Boosting Adaptif: Teori AdaBoost.M1, Pembobotan Ulang Sampel Eksponensial, & Alpha Weighted Voting",
    "16.2 Formulasi Gradient Boosting Friedman: Optimasi Numerik Gradient Descent pada Ruang Fungsi (Function Space)",
    "16.3 Residu Negatif sebagai Gradien Semu (Pseudo-Residuals) untuk Berbagai Fungsi Kerugian Diferensiabel",
    "16.4 Regularisasi Laju Belajar (Shrinkage / Learning Rate): Mencegah Overfitting Sekuensial",
    "16.5 Stochastic Gradient Boosting: Subsampling Baris Sampel dan Kolom Fitur untuk Pencegahan Ko-Adaptasi",
    "16.6 Gradient Tree Boosting untuk Klasifikasi Probabilistik: Penyesuaian Nilai Daun melalui Newton Raphson Step",
    "16.7 Fenomena Overfitting pada Boosting: Pengaruh Kedalaman Pohon Lemah (Weak Learners / Stumps)"
  ]},
  // BAB 17 (7)
  { ch: 17, id: "machine-learning-ch-17", title: "BAB 17: Ekosistem Boosting Modern: XGBoost, LightGBM, & CatBoost", subs: [
    "17.1 Arsitektur XGBoost: Ekspansi Deret Taylor Orde Kedua (Hessian dan Gradien) pada Fungsi Objektif",
    "17.2 Algoritma Penemuan Pembagian XGBoost: Weighted Quantile Sketch & Sparsity-Aware Split Finding",
    "17.3 Arsitektur LightGBM: Paradigma Leaf-Wise (Best-First) Tree Growth vs Level-Wise (Depth-Wise)",
    "17.4 Optimasi Kecepatan LightGBM: Gradient-Based One-Side Sampling (GOSS) & Exclusive Feature Bundling (EFB)",
    "17.5 Arsitektur CatBoost: Ordered Boosting untuk Mengatasi Pergeseran Target (Prediction Shift)",
    "17.6 Penanganan Fitur Kategorial pada CatBoost: Online Target Encoding & Kombinasi Fitur Otomatis",
    "17.7 Benchmark Komprehensif Ekosistem SOTA Boosting: Kecepatan, Memori, Akurasi, & Penyetelan Hiperparameter"
  ]},
  // BAB 18 (6)
  { ch: 18, id: "machine-learning-ch-18", title: "BAB 18: Meta-Learning & Ensemble Lanjut: Stacking, Blending, & Voting", subs: [
    "18.1 Voting Classifiers & Averaging Regressors: Teorema Juri Condorcet & Hard vs Soft Voting",
    "18.2 Stacked Generalization (Stacking): Arsitektur Multi-Tier (Base Learners Tier-1 & Meta-Learner Tier-2)",
    "18.3 Protokol Validasi Bebas Bocor Out-of-Fold (OOF) Prediction untuk Pembangkitan Fitur Meta",
    "18.4 Blending Ensemble: Alternatif Berbasis Hold-Out Validation Set & Trade-off Efisiensi Komputasi",
    "18.5 Teori Super Learner: Jaminan Asimtotik Efisiensi Oracle Inequality pada Kombinasi Model Heterogen",
    "18.6 Desain Ensembel Heterogen Industri: Menggabungkan Linear, Tree, Kernel, dan Deep Estimators"
  ]},
  // BAB 19 (7)
  { ch: 19, id: "machine-learning-ch-19", title: "BAB 19: Reduksi Dimensi Linier: PCA, SVD, & Factor Analysis", subs: [
    "19.1 Landasan Matematis Principal Component Analysis (PCA): Maksimisasi Varians Proyeksi vs Minimisasi Rekonstruksi",
    "19.2 Penurunan Analitis PCA melalui Pengali Lagrange pada Matriks Kovarians Empiris",
    "19.3 Hubungan Dualitas Eigendecomposition Kovarians dengan Singular Value Decomposition (SVD) Matriks Desain",
    "19.4 Evaluasi Komponen Utama: Rasio Varians Terjelaskan (Explained Variance Ratio) & Kriteria Scree Plot Elbow",
    "19.5 Rekonstruksi Kesalahan Proyeksi (Reconstruction Error) & Deteksi Sampel Anomali melalui Residual Ruang Sub",
    "19.6 Incremental PCA & Randomized PCA untuk Reduksi Dimensi pada Dataset Berskala Terabyte",
    "19.7 Factor Analysis: Pemodelan Variabel Laten dengan Varians Spesifik Unik vs Varians Bersama (Uniqueness vs Communality)"
  ]},
  // BAB 20 (7)
  { ch: 20, id: "machine-learning-ch-20", title: "BAB 20: Reduksi Dimensi Manifold Non-Linier: Kernel PCA, t-SNE, & UMAP", subs: [
    "20.1 Keterbatasan Proyeksi Linier pada Manifold Melengkung: Teorema Manifold Hypothesis (Swiss Roll Data)",
    "20.2 Kernel PCA: Formulasi Dual Matriks Gram Terpusat untuk Penyingkapan Struktur Non-Linier",
    "20.3 Multidimensional Scaling (MDS) & Isomap: Pendekatan Jarak Geodesik via Graf Tetangga Terdekat",
    "20.4 t-Distributed Stochastic Neighbor Embedding (t-SNE): Probabilitas Ketetanggaan Gaussian Ruang Asal",
    "20.5 Distribusi t-Student pada Ruang Proyeksi: Mengatasi Masalah Pemadatan Titik (Crowding Problem)",
    "20.6 Uniform Manifold Approximation and Projection (UMAP): Landasan Topologi Geometri Riemannian & Fuzzy Sets",
    "20.7 Parameter Kritis t-SNE & UMAP: Perplexity, Min-Dist, N-Neighbors, & Jebakan Interpretasi Kluster Palsu"
  ]},
  // BAB 21 (6)
  { ch: 21, id: "machine-learning-ch-21", title: "BAB 21: Klusterisasi Partisi & K-Means: Batas Lloyd, K-Means++, & Medoids", subs: [
    "21.1 Masalah Partisi Ruang Non-Terawasi: Formulasi Optimasi Minimisasi Within-Cluster Sum of Squares (WCSS)",
    "21.2 Algoritma Lloyd (Standard K-Means): Iterasi Penugasan Voronoi & Pembaruan Titik Berat (Centroid Update)",
    "21.3 Jaminan Konvergensi Monoton K-Means, Jebakan Optimum Lokal, & Ketergantungan pada Titik Awal",
    "21.4 Algoritma K-Means++: Inisialisasi Cerdas Berbasis Jarak Probabilitas D(x)^2 dengan Batas Ekspektasi O(log k)",
    "21.5 K-Medoids (PAM - Partitioning Around Medoids): Robustness Terhadap Outlier melalui Titik Medoid Nyata",
    "21.6 Mini-Batch K-Means: Solusi Klusterisasi Skala Masif Berbasis Online Stochastic Update"
  ]},
  // BAB 22 (7)
  { ch: 22, id: "machine-learning-ch-22", title: "BAB 22: Klusterisasi Hierarkis & Berbasis Densitas: Agglomerative & HDBSCAN", subs: [
    "22.1 Taksonomi Klusterisasi Hierarkis: Pendekatan Aglomeratif (Bottom-Up) vs Divisif (Top-Down)",
    "22.2 Kriteria Penggabungan Linkage: Single, Complete, Average, & Ward's Minimum Variance Criterion",
    "22.3 Analisis Visual Dendrogram: Penentuan Jumlah Kluster Optimal melalui Jarak Pemotongan Horisontal",
    "22.4 Fondasi Klusterisasi Berbasis Densitas: Keterbatasan Kluster Geometris Konveks pada Bentuk Arbitrer",
    "22.5 Algoritma DBSCAN: Definisi Titik Inti (Core), Titik Batas (Border), Titik Derau (Noise), & Jangkauan Epsilon",
    "22.6 Analisis Kelemahan DBSCAN pada Densitas Bervariasi & Pemilihan Parameter Epsilon / MinPts",
    "22.7 Algoritma HDBSCAN: Klusterisasi Densitas Hierarkis Menggunakan Minimum Spanning Tree & Stabilitas Kluster"
  ]},
  // BAB 23 (7)
  { ch: 23, id: "machine-learning-ch-23", title: "BAB 23: Model Campuran Probabilistik: GMM & Algoritma Expectation-Maximization", subs: [
    "23.1 Model Campuran Probabilistik (Mixture Models): Mengatasi Keterbatasan Partisi Keras (Hard Clustering)",
    "23.2 Gaussian Mixture Models (GMM): Formulasi Parameter Bobot Campuran, Vektor Rata-Rata, & Matriks Kovarians",
    "23.3 Masalah Ketertutupan Analitis Log-Likelihood Campuran & Kebutuhan Variabel Laten Z",
    "23.4 Penurunan Lengkap Algoritma Expectation-Maximization (EM): Bukti Konvergensi Monoton via Jensen's Inequality",
    "23.5 Tahap Ekspektasi (E-step): Komputasi Tanggung Jawab Posterior (Responsibilities / Soft Assignments)",
    "23.6 Tahap Maksimisasi (M-step): Pembaruan Tertutup Parameter Distribusi Komponen",
    "23.7 Kriteria Kovarians GMM (Full, Tied, Diagonal, Spherical) & Seleksi Model Menggunakan Skor BIC/AIC"
  ]},
  // BAB 24 (7)
  { ch: 24, id: "machine-learning-ch-24", title: "BAB 24: Deteksi Anomali & Estimasi Densitas: Isolation Forest, One-Class SVM, & KDE", subs: [
    "24.1 Taksonomi Formal Deteksi Anomali: Outlier Titik (Point), Outlier Kontekstual, & Outlier Kolektif",
    "24.2 Estimasi Densitas Non-Parametrik: Kernel Density Estimation (KDE) & Pemilihan Bandwidth Optimal",
    "24.3 Deteksi Berbasis Kerapatan Lokal: Local Outlier Factor (LOF) & Rasio Densitas Jangkauan K-Tetangga",
    "24.4 Algoritma Isolation Forest: Prinsip Pemisahan Acak Pohon Biner & Rata-Rata Panjang Lintasan (Path Length)",
    "24.5 Perumusan Skor Anomali Isolation Forest: Perbandingan Relatif Terhadap Kedalaman Ekspektasi Euler",
    "24.6 One-Class Support Vector Machines (OC-SVM): Pemetaan Hyperplane Margin Terhadap Titik Asal (Origin)",
    "24.7 Kalibrasi Ambang Kontaminasi Anomali & Evaluasi Tanpa Label Sejati (Unsupervised Metric)"
  ]},
  // BAB 25 (6)
  { ch: 25, id: "machine-learning-ch-25", title: "BAB 25: Metrologi Evaluasi & Metrik Klasifikasi Asimetris", subs: [
    "25.1 Matriks Konfusi Formal (TP, FP, TN, FN) & Batas Kelemahan Metrik Akurasi pada Distribusi Miring",
    "25.2 Taksonomi Metrik Berbasis Ambang: Precision, Recall, Specificity, F-Beta Score, & Matthews Correlation Coefficient (MCC)",
    "25.3 Kurva Receiver Operating Characteristic (ROC): Hubungan True Positive Rate vs False Positive Rate",
    "25.4 Area Under the ROC Curve (ROC-AUC): Penafsiran Probabilitas Teorema Wilcoxon-Mann-Whitney",
    "25.5 Kurva Precision-Recall (PR-AUC) & Average Precision: Standar Emas untuk Masalah Ketimpangan Kelas Ekstrem",
    "25.6 Kalibrasi Probabilitas Model: Kurva Kalibrasi (Reliability Diagram), Brier Score, Platt Scaling, & Isotonic Regression"
  ]},
  // BAB 26 (5)
  { ch: 26, id: "machine-learning-ch-26", title: "BAB 26: Metrologi Evaluasi Regresi & Klusterisasi", subs: [
    "26.1 Metrik Galat Regresi Skala Dependen: Mean Squared Error (MSE), Root MSE (RMSE), & Mean Absolute Error (MAE)",
    "26.2 Metrik Galat Robust & Relatif: Median Absolute Error (MedAE), MAPE, Huber Loss, & Koefisien Determinasi R^2 / Adjusted R^2",
    "26.3 Evaluasi Klusterisasi Internal: Silhouette Coefficient (Kohesi a(i) vs Separasi b(i)) & Visualisasi Silhouette Plot",
    "26.4 Indeks Dispersi Kluster: Rasio Calinski-Harabasz (Variance Ratio) & Indeks Davies-Bouldin (Similaritas Terburuk)",
    "26.5 Evaluasi Klusterisasi Eksternal (Ground Truth Valid): Adjusted Rand Index (ARI) & Normalized Mutual Information (NMI)"
  ]},
  // BAB 27 (5)
  { ch: 27, id: "machine-learning-ch-27", title: "BAB 27: Protokol Validasi Bebas Bocor (Cross-Validation Architecture)", subs: [
    "27.1 Partisi Data Klasik: Train, Validation, & Test Set: Jaminan Uji Out-of-Sample yang Tidak Bias",
    "27.2 Taksonomi K-Fold Cross-Validation: Standar K-Fold, Stratified K-Fold (Proporsi Kelas), & Repeated K-Fold",
    "27.3 Validasi Data Terkorelasi Kelompok: Group K-Fold & Leave-One-Group-Out untuk Mencegah Kebocoran Subjek",
    "27.4 Validasi Temporal Deret Waktu: TimeSeriesSplit, Expanding Window, & Rolling Window Cross-Validation",
    "27.5 Anatomi Kebocoran Data (Data Leakage): Pra-pemrosesan di Luar Lipatan (Fold), Kebocoran Target, & Enkapsulasi Pipeline"
  ]},
  // BAB 28 (6)
  { ch: 28, id: "machine-learning-ch-28", title: "BAB 28: Penyetelan Hiperparameter Lanjut: Bayesian Optimization & Hyperband", subs: [
    "28.1 Batas Komputasi Grid Search Exhaustif pada Ruang Pencarian Dimensi Tinggi (Kutukan Dimensi Pencarian)",
    "28.2 Random Search: Keunggulan Teoretis Bergstra-Bengio pada Dimensi Efektif Rendah",
    "28.3 Bayesian Optimization: Model Pengganti (Surrogate Model) Gaussian Process & Tree-structured Parzen Estimators (TPE)",
    "28.4 Fungsi Akuisisi Eksplorasi-Eksploitasi: Expected Improvement (EI), Probability of Improvement (PI), & Upper Confidence Bound (UCB)",
    "28.5 Alokasi Sumber Daya Multi-Fidelity: Teori Successive Halving & Algoritma Hyperband (Bandit-Based Search)",
    "28.6 Framework Optuna Kontemporer: Arsitektur Sampling TPE, Pruning Otomatis Asinkron, & Visualisasi Sensitivitas Hiperparameter"
  ]},
  // BAB 29 (6)
  { ch: 29, id: "machine-learning-ch-29", title: "BAB 29: Rekayasa Fitur Lanjut: Encoding Kategorial & Imputasi Statistik", subs: [
    "29.1 Skalabilitas Fitur Numerik: Standardisasi Z-Score, Min-Max Scaling, Robust Scaling (IQR), & Transformasi Daya (Yeo-Johnson)",
    "29.2 Encoding Kategorial Bernilai Rendah: One-Hot Encoding, Dummy Variable Trap, & Ordinal Mapping",
    "29.3 Encoding Kategorial Kardinalitas Tinggi: Target Encoding dengan Bayesian Smoothing (m-estimate) & Out-of-Fold Encoding",
    "29.4 Strategi Imputasi Nilai Hilang (Missing Values): Imputasi Univariat, KNN Imputation, & Iterative Imputer (MICE)",
    "29.5 Konstruksi Fitur Sintetis: Transformasi Polinomial, Rasio Non-Linier, & Interaksi Fitur Multi-Kolom",
    "29.6 Seleksi Fitur Otomatis: Variance Threshold, Uji Statistik Univariat (Chi2, ANOVA F-value), Mutual Information, & RFE"
  ]},
  // BAB 30 (6)
  { ch: 30, id: "machine-learning-ch-30", title: "BAB 30: Penanganan Ketimpangan Kelas Ekstrem: SMOTE, ADASYN, & Cost-Matrix", subs: [
    "30.1 Fenomena Imbalance Ekstrem pada Dunia Riil (Fraud, Medis, Anomali Siber) & Kegagalan Fungsi Loss Standar",
    "30.2 Strategi Undersampling Terarah: Random Undersampling, Edited Nearest Neighbors (ENN), & Tomek Links",
    "30.3 Strategi Oversampling Sintetis: Algoritma SMOTE (Interpolasi Vektor K-NN) & Borderline-SMOTE",
    "30.4 Adaptive Synthetic Sampling (ADASYN): Pembobotan Densitas Minoritas Berdasarkan Distribusi Kesulitan Sampel",
    "30.5 Cost-Sensitive Learning: Matriks Biaya Finansial Riil, Penyesuaian Bobot Sampel (Class Weighting), & Modifikasi Gradien",
    "30.6 Focal Loss: Modifikasi Faktor Modulasi (1 - p_t)^gamma untuk Menekan Gradien Sampel Negatif Mudah"
  ]},
  // BAB 31 (7)
  { ch: 31, id: "machine-learning-ch-31", title: "BAB 31: Interpretabilitas Model & XAI: SHAP, LIME, & PFI", subs: [
    "31.1 Krisis Model Kotak Hitam (Black-Box Problem): Trade-off Interpretabilitas Akurasi & Regulasi Transparansi AI",
    "31.2 Interpretabilitas Intrinsik: Model Linier Terstandarisasi, Koefisien Regresi, & Aturan Keputusan Pohon Dangkal",
    "31.3 Metodologi Post-Hoc Model-Agnostic: Permutation Feature Importance (PFI) & Kelemahan Korelasi Fitur",
    "31.4 Analisis Marginal Model: Partial Dependence Plots (PDP) & Individual Conditional Expectation (ICE) Curves",
    "31.5 Local Interpretable Model-agnostic Explanations (LIME): Aproksimasi Model Pengganti Linier Lokal Terbobot Jarak Eksponensial",
    "31.6 Teori Shapley Values dari Teori Permainan Koperasi: Karakteristik Aksioma Efisiensi, Simetri, Dummy, & Aditivitas",
    "31.7 Framework SHAP (SHapley Additive exPlanations): TreeSHAP Cepat, KernelSHAP, Beeswarm Summary Plots, & Analisis Interaksi"
  ]},
  // BAB 32 (6)
  { ch: 32, id: "machine-learning-ch-32", title: "BAB 32: MLOps Fondasi, Model Governance, & Deteksi Drift Data", subs: [
    "32.1 Siklus Hidup Pembelajaran Mesin Produksi: Dari Eksperimen Jupyter ke Sistem Otomatis Berkelanjutan (MLOps Lifecycle)",
    "32.2 Degradasi Performa Model Produksi: Perbedaan Data Drift (Covariate Shift), Concept Drift, & Prior Probability Shift",
    "32.3 Metrologi Deteksi Drift Statistik: Uji Dua Sampel Kolmogorov-Smirnov (KS-Test), Divergensi Wasserstein, & Population Stability Index (PSI)",
    "32.4 Serialisasi & Deployment Model: Formulasi Joblib, Safetensors, ONNX Runtime, & Risiko Eksekusi Kode Acak pada Pickle",
    "32.5 Arsitektur Pemantauan & Pemicu Pelatihan Ulang Otomatis (Continuous Training & Automated Retraining Triggers)",
    "32.6 Tata Kelola Model (Model Governance): Standar Dokumentasi Model Cards, Keterlacakan Asal-Usul (Data Lineage), & Audit Kepatuhan Regulasi"
  ]}
];

let totalSubs = 0;
promptTaxonomy.forEach(ch => {
  totalSubs += ch.subs.length;
  console.log(`Ch ${String(ch.ch).padStart(2, '0')}: ${ch.id} (${ch.subs.length} subs)`);
});
console.log(`Total Chapters: ${promptTaxonomy.length}`);
console.log(`Total Subchapters: ${totalSubs}`);
