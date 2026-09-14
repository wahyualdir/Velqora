import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * 1. SUPERVISED LEARNING (1.1 to 1.17)
 * Seluruh subbab resmi Scikit-Learn 1.9 dengan penjelasan lengkap,
 * formulasi matematis LaTeX, parameter kunci, dan kode Python.
 */
export const SUPERVISED_LEARNING_CHAPTER: DocSectionItem = {
  id: "sec-1-supervised-learning",
  slug: "supervised-learning",
  title: "1. Supervised learning",
  orderIndex: 1,
  description: "Metode pembelajaran terawasi di mana model memetakan input fitur X ke target prediksi y, mencakup regresi linear, klasifikasi, pohon keputusan, kernel methods, dan ensemble learning.",
  subsections: [
    {
      id: "sec-1-1-linear-models",
      slug: "linear-models",
      title: "1.1. Linear Models",
      orderIndex: 1,
      description: "Metode regresi dan klasifikasi linear dengan berbagai bentuk penalti regularisasi (L1, L2, Elastic-Net).",
      content_markdown: `# 1.1. Linear Models

The following are a set of methods intended for regression in which the target value is expected to be a linear combination of the features. In mathematical notation, if $\\hat{y}$ is the predicted value:

$$\\hat{y}(w, x) = w_0 + w_1 x_1 + \\dots + w_p x_p$$

Across the module, we designate the vector $w = (w_1, \\dots, w_p)$ as \`coef_\` and $w_0$ as \`intercept_\`.

---

## 1.1.1. Ordinary Least Squares

\`LinearRegression\` fits a linear model with coefficients $w = (w_1, \\dots, w_p)$ to minimize the residual sum of squares between the observed targets in the dataset, and the targets predicted by the linear approximation:

$$\\min_{w} \\| X w - y \\|_2^2 = \\sum_{i=1}^n (y_i - x_i^T w)^2$$

\`LinearRegression\` takes arguments \`X\`, \`y\` and stores coefficients in \`coef_\` and \`intercept_\`:

\`\`\`python
from sklearn import linear_model
import numpy as np

reg = linear_model.LinearRegression()
reg.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])

print("Koefisien w (coef_):", reg.coef_)
print("Intersep w0 (intercept_):", reg.intercept_)
# Output:
# Koefisien w (coef_): [0.5 0.5]
# Intersep w0 (intercept_): 0.0
\`\`\`

### 1.1.1.1. Non-Negative Least Squares
It is possible to constrain all coefficients to be non-negative using \`positive=True\`:

\`\`\`python
reg_positive = linear_model.LinearRegression(positive=True)
reg_positive.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])
print("Non-negative coefficients:", reg_positive.coef_)
\`\`\`

### 1.1.1.2. Ordinary Least Squares Complexity
The least squares solution is computed using the Singular Value Decomposition (SVD) of $X$. If $X$ is of shape \`(n_samples, n_features)\`, the computational cost is $\\mathcal{O}(n_{\\text{samples}} n_{\\text{features}}^2)$ assuming $n_{\\text{samples}} \\ge n_{\\text{features}}$.

---

## 1.1.2. Ridge regression and classification

\`Ridge\` regression addresses problems of Ordinary Least Squares by imposing an $\\ell_2$ penalty on the size of coefficients (Tikhonov Regularization):

$$\\min_{w} \\| X w - y \\|_2^2 + \\alpha \\|w\\|_2^2$$

The complexity parameter $\\alpha \\ge 0$ controls the amount of shrinkage: the larger $\\alpha$, the greater the shrinkage and the coefficients become more robust to multicollinearity.

\`\`\`python
from sklearn import linear_model

reg = linear_model.Ridge(alpha=0.5)
reg.fit([[0, 0], [0, 0], [1, 1]], [0, 0.1, 1])
print("Ridge coef_:", reg.coef_)
print("Ridge intercept_:", reg.intercept_)
\`\`\`

### 1.1.2.1. RidgeCV: Built-in Cross-Validation
\`RidgeCV\` implements ridge regression with built-in cross-validation of parameter $\\alpha$:

\`\`\`python
from sklearn.linear_model import RidgeCV

clf = RidgeCV(alphas=[1e-3, 1e-2, 1e-1, 1.0]).fit([[0, 0], [0, 0], [1, 1]], [0, 0.1, 1])
print("Best alpha:", clf.alpha_)
\`\`\`

---

## 1.1.3. Lasso

\`Lasso\` is a linear model that estimates sparse coefficients using an $\\ell_1$ penalty:

$$\\min_{w} \\frac{1}{2 n_{\\text{samples}}} \\| X w - y \\|_2^2 + \\alpha \\|w\\|_1$$

Where $\\|w\\|_1 = \\sum_{j=1}^p |w_j|$. The $\\ell_1$ penalty forces many coefficient estimates to be exactly zero, acting as automatic feature selection.

\`\`\`python
from sklearn import linear_model

clf = linear_model.Lasso(alpha=0.1)
clf.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])
print("Lasso coef_ (sparse):", clf.coef_)
print("Prediksi sample baru:", clf.predict([[3, 3]]))
\`\`\`

---

## 1.1.4. Multi-task Lasso
The \`MultiTaskLasso\` estimates sparse coefficients for multiple regression problems jointly: $Y$ is a 2D array of shape \`(n_samples, n_tasks)\`. The selected features are shared across all tasks.

---

## 1.1.5. Elastic-Net

\`ElasticNet\` combines both $\\ell_1$ and $\\ell_2$ penalties:

$$\\min_{w} \\frac{1}{2 n_{\\text{samples}}} \\| X w - y \\|_2^2 + \\alpha \\rho \\|w\\|_1 + \\frac{\\alpha(1 - \\rho)}{2} \\|w\\|_2^2$$

Parameter \`l1_ratio\` represents $\\rho \\in [0, 1]$:
- \`l1_ratio=1\`: murni Lasso ($\\|w\\|_1$).
- \`l1_ratio=0\`: murni Ridge ($\\|w\\|_2^2$).

\`\`\`python
from sklearn.linear_model import ElasticNet

regr = ElasticNet(random_state=0, alpha=0.1, l1_ratio=0.5)
regr.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])
print("ElasticNet coef_:", regr.coef_)
\`\`\`

---

## 1.1.6. Multi-task Elastic-Net
\`MultiTaskElasticNet\` menggabungkan regularisasi $\\ell_{21}$ dan $\\ell_2$ untuk multi-output regression.

---

## 1.1.7. Least Angle Regression (LARS)
LARS adalah algoritma seleksi model efisien untuk data berdimensi tinggi ($p \\gg n$). Algoritma bergerak di sepanjang arah equiangular terhadap fitur yang memiliki korelasi tertinggi dengan residual.

---

## 1.1.8. LARS Lasso
\`LassoLars\` mengimplementasikan model Lasso menggunakan algoritma LARS untuk menghitung seluruh jalur koefisien (*regularization path*).

---

## 1.1.9. Orthogonal Matching Pursuit (OMP)
\`OrthogonalMatchingPursuit\` mengaproksimasi solusi optimal di bawah batasan $\\ell_0$ secara *greedy*.

---

## 1.1.10. Bayesian Regression

### 1.1.10.1. Bayesian Ridge Regression
\`BayesianRidge\` memodelkan regresi secara probabilistik dengan prior Gaussian pada koefisien $w$:

$$p(y|X, w, \\alpha) = \\mathcal{N}(y | Xw, \\alpha^{-1} I_n), \\quad p(w|\\lambda) = \\mathcal{N}(w | 0, \\lambda^{-1} I_p)$$

Hyperparameter $\\alpha$ dan $\\lambda$ diestimasi secara simultan dari data selama proses fitting.

\`\`\`python
from sklearn.linear_model import BayesianRidge

reg = BayesianRidge()
reg.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])
print("Estimated coef_:", reg.coef_)
print("Noise precision alpha_:", reg.alpha_)
\`\`\`

---

## 1.1.11. Logistic regression

\`LogisticRegression\` memodelkan probabilitas posterior kelas biner menggunakan fungsi logistik sigmoid:

$$p(y = 1 | x) = \\sigma(w^T x + c) = \\frac{1}{1 + e^{-(w^T x + c)}}$$

Fungsi objektif dengan penalti $\\ell_2$ dan parameter invers regularisasi $C > 0$:

$$\\min_{w, c} \\frac{1}{2} w^T w + C \\sum_{i=1}^n \\log(1 + \\exp(-y_i (w^T x_i + c)))$$

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(random_state=0, max_iter=200).fit(X, y)
print("Akurasi:", clf.score(X, y))
print("Probabilitas sampel pertama:", clf.predict_proba(X[:1, :]))
\`\`\`

---

## 1.1.12. Generalized Linear Models (GLM)
Memperluas model linear dengan distribusi target selain Gaussian via fungsi tautan (*link function*):
- \`PoissonRegressor\`: Untuk data diskrit frekuensi kejadian (*count data*).
- \`GammaRegressor\`: Untuk nilai kontinu strictly positive dengan skewness tinggi.
- \`TweedieRegressor\`: Distribusi gabungan Poisson-Gamma dengan parameter $p$.

---

## 1.1.13. Stochastic Gradient Descent - SGD
\`SGDClassifier\` dan \`SGDRegressor\` mengoptimalkan fungsi rugi secara bertahap pada setiap sampel:
- Sangat efisien untuk dataset berskala besar ($n > 100{,}000$).
- Mendukung \`partial_fit\` untuk *out-of-core learning*.

---

## 1.1.14. Perceptron
Algoritma pembelajaran klasifikasi linear biner klasik dengan fungsi rugi \`loss="perceptron"\`.

---

## 1.1.15. Passive Aggressive Algorithms
Keluarga algoritma pembelajaran daring (*online learning*) skala besar yang memperbarui bobot model hanya jika sampel disalahklasifikasikan.

---

## 1.1.16. Robustness regression: outliers and modeling errors
- **RANSAC** (\`RANSACRegressor\`): Mengestimasi model dari subset acak data yang diklasifikasikan sebagai inliers.
- **Theil-Sen** (\`TheilSenRegressor\`): Menghitung median kemiringan antar seluruh pasangan titik sampel.
- **Huber** (\`HuberRegressor\`): Menggunakan fungsi rugi piecewise linear dan kuadratik untuk membatasi pengaruh outliers.

---

## 1.1.17. Quantile Regression
\`QuantileRegressor\` mengoptimalkan *pinball loss* untuk mengestimasi kuantil kondisional median (50%) atau persentil ekstrem (90%, 95%).

---

## 1.1.18. Polynomial regression: extending linear models with basis functions
Menggunakan transformasi polinomial pada fitur sebelum fitting linear model:

\`\`\`python
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
import numpy as np

model = Pipeline([
    ('poly', PolynomialFeatures(degree=3)),
    ('linear', LinearRegression(fit_intercept=False))
])

x = np.arange(5)
y = 3 - 2 * x + x ** 2 - x ** 3
model = model.fit(x[:, np.newaxis], y)
print("Koefisien Polinomial:", model.named_steps['linear'].coef_)
\`\`\`
`
    },
    {
      id: "sec-1-2-lda-qda",
      slug: "lda-qda",
      title: "1.2. Linear and Quadratic Discriminant Analysis",
      orderIndex: 2,
      description: "Linear Discriminant Analysis (LDA) dan Quadratic Discriminant Analysis (QDA) berbasis model generatif Gaussian.",
      content_markdown: `# 1.2. Linear and Quadratic Discriminant Analysis

Linear Discriminant Analysis (\`LinearDiscriminantAnalysis\`) and Quadratic Discriminant Analysis (\`QuadraticDiscriminantAnalysis\`) are classic classifiers with linear and quadratic decision surfaces.

---

## 1.2.1. Dimensionality reduction using LDA
\`LinearDiscriminantAnalysis\` memproyeksikan fitur ke subruang yang memaksimalkan rasio antara *between-class scatter* ($S_B$) dan *within-class scatter* ($S_W$):

$$\\max_w \\frac{w^T S_B w}{w^T S_W w}$$

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

X, y = load_iris(return_X_y=True)
lda = LinearDiscriminantAnalysis(n_components=2)
X_r = lda.fit(X, y).transform(X)
print("Bentuk awal:", X.shape, "-> Tereduksi:", X_r.shape)
\`\`\`

---

## 1.2.2. Mathematical formulation
Kedua algoritma mengasumsikan distribusi kondisional $P(X|y=k)$ mengikuti distribusi Gaussian multivariat:

$$P(X | y = k) = \\frac{1}{(2\\pi)^{d/2} |\\Sigma_k|^{1/2}} \\exp\\left(-\\frac{1}{2} (X - \\mu_k)^T \\Sigma_k^{-1} (X - \\mu_k)\\right)$$

- **LDA**: Mengasumsikan seluruh kelas memiliki matriks kovarians yang sama ($\\Sigma_k = \\Sigma$). Batas keputusan berupa hiperbidang linear.
- **QDA**: Mengizinkan setiap kelas memiliki matriks kovarians $\\Sigma_k$ masing-masing. Batas keputusan berupa permukaan kuadratik.

---

## 1.2.3. Shrinkage and Covariance Estimators
Ketika jumlah sampel kecil dibanding jumlah fitur ($n < p$), estimasi kovarians rentan tidak stabil. Parameter \`shrinkage='auto'\` menerapkan lemma Ledoit-Wolf untuk menstabilkan estimasi kovarians.
`
    },
    {
      id: "sec-1-3-kernel-ridge",
      slug: "kernel-ridge",
      title: "1.3. Kernel ridge regression",
      orderIndex: 3,
      description: "Kernel ridge regression (KRR) menggabungkan Ridge Regression dengan trik kernel untuk regresi non-linear.",
      content_markdown: `# 1.3. Kernel ridge regression

Kernel ridge regression (\`KernelRidge\`) combines Ridge regression (linear least squares with $\\ell_2$-norm regularization) with the kernel trick:

$$\\min_c (K c - y)^T (K c - y) + \\alpha c^T K c$$

Perbandingan dengan Support Vector Regression (\`SVR\`):
- **KernelRidge**: Menggunakan squared error loss, menghasilkan solusi padat (*dense solution*). Sangat cepat untuk data berukuran kecil hingga sedang.
- **SVR**: Menggunakan $\\epsilon$-insensitive loss, menghasilkan solusi renggang (*sparse solution* dengan support vectors).

\`\`\`python
from sklearn.kernel_ridge import KernelRidge
import numpy as np

X = 5 * np.random.rand(100, 1)
y = np.sin(X).ravel()

krr = KernelRidge(alpha=1.0, kernel='rbf', gamma=0.1)
krr.fit(X, y)
print("Prediksi titik x=2.5:", krr.predict([[2.5]]))
\`\`\`
`
    },
    {
      id: "sec-1-4-svm",
      slug: "svm",
      title: "1.4. Support Vector Machines",
      orderIndex: 4,
      description: "Support Vector Machines (SVM) untuk klasifikasi, regresi, dan deteksi anomali berbasis margin optimal.",
      content_markdown: `# 1.4. Support Vector Machines

Support vector machines (SVMs) are a set of supervised learning methods used for classification, regression, and outliers detection.

---

## 1.4.1. Classification (SVC, NuSVC, LinearSVC)
Scikit-Learn menyediakan tiga implementasi klasifikasi SVM:
1. \`SVC\`: Implementasi berbasis libsvm dengan kompleksitas waktu $\\mathcal{O}(n_{\\text{samples}}^2)$ hingga $\\mathcal{O}(n_{\\text{samples}}^3)$.
2. \`NuSVC\`: Serupa dengan SVC tetapi mengontrol fraksi support vectors melalui parameter $\\nu \\in (0, 1]$.
3. \`LinearSVC\`: Implementasi berbasis liblinear yang dioptimalkan khusus untuk kernel linear dengan skala $\\mathcal{O}(n_{\\text{samples}})$.

\`\`\`python
from sklearn import svm

X = [[0, 0], [1, 1], [1, 0], [0, 1]]
y = [0, 1, 1, 0]

clf = svm.SVC(kernel='rbf', C=1.0)
clf.fit(X, y)

print("Support vectors indices:", clf.support_)
print("Support vectors:\\n", clf.support_vectors_)
print("Prediksi baru:", clf.predict([[0.8, 0.8]]))
\`\`\`

---

## 1.4.2. Regression (SVR)
Support Vector Regression memetakan data dengan batas toleransi galat $\\epsilon$ (*epsilon-tube*): observasi di dalam tabung $\\epsilon$ tidak dikenakan penalti.

\`\`\`python
from sklearn.svm import SVR
import numpy as np

X = np.sort(5 * np.random.rand(40, 1), axis=0)
y = np.sin(X).ravel()

svr_rbf = SVR(kernel='rbf', C=100, gamma=0.1, epsilon=0.1)
svr_rbf.fit(X, y)
\`\`\`

---

## 1.4.3. Kernel Functions
Fungsi kernel menghitung *inner product* pada ruang berdimensi tinggi $\\phi(x)^T \\phi(x')$ tanpa menghitung transformasi secara eksplisit:
- **Linear**: $K(x, x') = x^T x'$
- **Polynomial**: $K(x, x') = (\\gamma x^T x' + r)^d$
- **RBF (Radial Basis Function)**: $K(x, x') = \\exp(-\\gamma \\|x - x'\\|^2)$
- **Sigmoid**: $K(x, x') = \\tanh(\\gamma x^T x' + r)$

---

## 1.4.4. Mathematical Formulation
Masalah optimasi primal C-SVC soft-margin:

$$\\min_{w, b, \\zeta} \\frac{1}{2} w^T w + C \\sum_{i=1}^n \\zeta_i$$

$$\\text{subject to } y_i (w^T \\phi(x_i) + b) \\ge 1 - \\zeta_i, \\quad \\zeta_i \\ge 0$$

Formulasi dual yang diselesaikan menggunakan algoritma Sequential Minimal Optimization (SMO):

$$\\min_{\\alpha} \\frac{1}{2} \\alpha^T Q \\alpha - e^T \\alpha, \\quad \\text{subject to } y^T \\alpha = 0, \\quad 0 \\le \\alpha_i \\le C$$
`
    },
    {
      id: "sec-1-5-sgd",
      slug: "sgd",
      title: "1.5. Stochastic Gradient Descent",
      orderIndex: 5,
      description: "Pendekatan optimasi gradien stokastik untuk estimator linear skala besar.",
      content_markdown: `# 1.5. Stochastic Gradient Descent

Stochastic Gradient Descent (SGD) is a simple yet very efficient approach to fitting linear models under convex loss functions.

---

## 1.5.1. Classification (SGDClassifier)
Mendukung berbagai fungsi rugi melalui argumen \`loss\`:
- \`loss="hinge"\`: Soft-margin linear Support Vector Machine.
- \`loss="log_loss"\`: Logistic Regression probabilistik.
- \`loss="modified_huber"\`: Loss halus yang kebal terhadap outliers.

\`\`\`python
from sklearn.linear_model import SGDClassifier

clf = SGDClassifier(loss="log_loss", penalty="l2", max_iter=1000, tol=1e-3)
clf.fit([[0., 0.], [1., 1.]], [0, 1])
print("Probabilitas:", clf.predict_proba([[2., 2.]]))
\`\`\`

---

## 1.5.2. Regresi (SGDRegressor)
Fungsi rugi untuk regresi:
- \`loss="squared_error"\`: Ordinary least squares dengan penalti L2/L1.
- \`loss="huber"\`: Huber loss dengan batas epsilon untuk kekebalan outlier.
- \`loss="epsilon_insensitive"\`: Linear SVR.

---

## 1.5.3. Learning Rate Schedules
Laju pembelajaran $\\eta$ pada setiap iterasi $t$:
- \`learning_rate="constant"\`: $\\eta^{(t)} = \\eta_0$.
- \`learning_rate="optimal"\`: $\\eta^{(t)} = 1 / (\\alpha (t + t_0))$.
- \`learning_rate="invscaling"\`: $\\eta^{(t)} = \\eta_0 / t^{\\text{power\\_t}}$.
- \`learning_rate="adaptive"\`: Membagi dua $\\eta$ saat loss validasi tidak menurun.
`
    },
    {
      id: "sec-1-6-neighbors",
      slug: "neighbors",
      title: "1.6. Nearest Neighbors",
      orderIndex: 6,
      description: "Metode berbasis tetangga terdekat (k-NN) untuk klasifikasi, regresi, dan pencarian kemiripan.",
      content_markdown: `# 1.6. Nearest Neighbors

Nearest Neighbors methods predict outputs based on a predefined number of training samples closest in distance to the new query point.

---

## 1.6.1. Nearest Neighbors Classification
- \`KNeighborsClassifier\`: Mengambil suara mayoritas (*majority vote*) dari $k$-tetangga terdekat. Parameter \`weights='distance'\` memberi bobot lebih tinggi pada sampel yang lebih dekat ($w = 1/d$).
- \`RadiusNeighborsClassifier\`: Memprediksi berdasarkan seluruh sampel dalam radius tetap $r$.

\`\`\`python
from sklearn.neighbors import KNeighborsClassifier

X = [[0], [1], [2], [3]]
y = [0, 0, 1, 1]

neigh = KNeighborsClassifier(n_neighbors=3, weights='distance')
neigh.fit(X, y)
print("Prediksi:", neigh.predict([[1.5]]))
\`\`\`

---

## 1.6.2. Nearest Neighbors Algorithms
1. **Brute Force**: Menghitung jarak terhadap seluruh titik dalam dataset (kompleksitas $\\mathcal{O}(D N)$).
2. **K-D Tree**: Struktur data pohon biner mempartisi ruang secara ortogonal (efisien untuk dimensi $D < 20$).
3. **Ball Tree**: Struktur pohon berbasis hiper-bola (sangat efisien untuk dimensi tinggi $D > 20$).
`
    },
    {
      id: "sec-1-7-gaussian-process",
      slug: "gaussian-process",
      title: "1.7. Gaussian Processes",
      orderIndex: 7,
      description: "Model regresi dan klasifikasi non-parametrik probabilistik dengan estimasi ketidakpastian.",
      content_markdown: `# 1.7. Gaussian Processes

Gaussian Processes (GP) adalah metode pembelajaran probabilistik terpadu yang memprediksi nilai mean dan deviasi standar (interval ketidakpastian).

---

## 1.7.1. Gaussian Process Regression (GPR)
\`GaussianProcessRegressor\` mengasumsikan distribusi prior Gaussian dengan fungsi kovarians kernel $k(x, x')$:

$$y \\sim \\mathcal{GP}(m(x), k(x, x'))$$

\`\`\`python
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, ConstantKernel as C

kernel = C(1.0, (1e-3, 1e3)) * RBF(10, (1e-2, 1e2))
gp = GaussianProcessRegressor(kernel=kernel, n_restarts_optimizer=9)
gp.fit([[1], [3], [5], [6], [7], [8]], [3, 2, 4, 1, 5, 4])

y_pred, sigma = gp.predict([[4]], return_std=True)
print("Prediksi Mean:", y_pred, "Ketidakpastian Sigma:", sigma)
\`\`\`
`
    },
    {
      id: "sec-1-8-cross-decomposition",
      slug: "cross-decomposition",
      title: "1.8. Cross decomposition",
      orderIndex: 8,
      description: "Partial Least Squares (PLS) dan Canonical Correlation Analysis (CCA) untuk dua set data multivariat.",
      content_markdown: `# 1.8. Cross decomposition

Cross-decomposition mencari relasi linear antar dua matriks multivariat $X$ dan $Y$ dengan memproyeksikannya ke subruang laten yang memaksimalkan kovarians antar proyeksi:

- \`PLSRegression\`: Partial Least Squares Regression, sangat berguna saat prediktor $X$ memiliki multikolinearitas tinggi atau jumlah fitur melebihi sampel ($p > n$).
- \`PLSCanonical\`: Menghubungkan variabel laten secara simetris antara $X$ dan $Y$.
- \`CCA\`: Canonical Correlation Analysis memaksimalkan korelasi (bukan kovarians) antar variabel laten.
`
    },
    {
      id: "sec-1-9-naive-bayes",
      slug: "naive-bayes",
      title: "1.9. Naive Bayes",
      orderIndex: 9,
      description: "Pengklasifikasi probabilistik berbasis Teorema Bayes dengan asumsi independensi fitur bersyarat.",
      content_markdown: `# 1.9. Naive Bayes

Naive Bayes methods are based on Bayes' theorem with the assumption of conditional independence:

$$P(y | x_1, \\dots, x_n) = \\frac{P(y) \\prod_{i=1}^n P(x_i | y)}{P(x_1, \\dots, x_n)}$$

---

## 1.9.1. Varian Naive Bayes di Scikit-Learn:
1. **GaussianNB**: Mengasumsikan fitur berdistribusi kontinu normal Gaussian:
   $$P(x_i | y) = \\frac{1}{\\sqrt{2\\pi \\sigma_y^2}} \\exp\\left(-\\frac{(x_i - \\mu_y)^2}{2\\sigma_y^2}\\right)$$
2. **MultinomialNB**: Untuk data diskrit frekuensi kejadian (klasifikasi teks dan analisis sentimen).
3. **BernoulliNB**: Untuk data dengan fitur biner boolean (ada/tidaknya kata tertentu).
4. **CategoricalNB**: Untuk fitur-fitur yang memiliki kategori diskrit terhingga.
5. **ComplementNB**: Varian MultinomialNB yang disesuaikan khusus untuk dataset yang tidak seimbang (*imbalanced datasets*).
`
    },
    {
      id: "sec-1-10-decision-trees",
      slug: "decision-trees",
      title: "1.10. Decision Trees",
      orderIndex: 10,
      description: "Pohon keputusan (CART) mempartisi ruang fitur secara hierarkis menjadi aturan if-else.",
      content_markdown: `# 1.10. Decision Trees

Decision Trees (DTs) are a non-parametric supervised learning method used for classification and regression.

---

## 1.10.1. Classification (DecisionTreeClassifier)
Kriteria pemilihan split:
- **Gini Impurity**:
  $$H(Q_m) = \\sum_k p_{mk} (1 - p_{mk})$$
- **Entropy (Information Gain)**:
  $$H(Q_m) = -\\sum_k p_{mk} \\log_2(p_{mk})$$

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier

X, y = load_iris(return_X_y=True)
clf = DecisionTreeClassifier(criterion="gini", max_depth=3, random_state=42)
clf.fit(X, y)
print("Fitur penting:", clf.feature_importances_)
\`\`\`

---

## 1.10.2. Minimal Cost-Complexity Pruning
Untuk mencegah overfitting, parameter \`ccp_alpha\` mengontrol pemangkasan pohon:

$$R_\\alpha(T) = R(T) + \\alpha |T|$$

Di mana $R(T)$ adalah total galat misklasifikasi dan $|T|$ adalah jumlah daun terminal pohon.
`
    },
    {
      id: "sec-1-11-ensemble",
      slug: "ensemble",
      title: "1.11. Ensembles: Gradient boosting, random forests, bagging, voting, stacking",
      orderIndex: 11,
      description: "Teknik penggabungan model ensemble untuk generalisasi dan stabilitas prediksi optimal.",
      content_markdown: `# 1.11. Ensemble methods

Ensemble methods combine predictions of several base estimators to improve generalization and robustness.

---

## 1.11.1. Random Forests & Extra Trees
- \`RandomForestClassifier\`: Membangun kumpulan pohon keputusan di mana setiap pohon dilatih pada sampel bootstrap (*bagging*) dan setiap split hanya mempertimbangkan subset acak fitur (\`max_features\`).
- \`ExtraTreesClassifier\` (Extremely Randomized Trees): Memilih ambang batas split secara acak penuh untuk menurunkan varians model secara drastis.

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

clf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0)
clf.fit([[0, 0], [1, 1], [0, 1], [1, 0]], [0, 1, 1, 0])
print("Prediksi:", clf.predict([[0.5, 0.5]]))
\`\`\`

---

## 1.11.2. Gradient Tree Boosting
- \`GradientBoostingClassifier\`: Melatih pohon secara sekuensial di mana setiap pohon baru memprediksi pseudo-residual (negatif gradien dari fungsi rugi) dari kombinasi model sebelumnya.
- \`HistGradientBoostingClassifier\`: Implementasi mutakhir terinspirasi LightGBM yang mendiskritisasi fitur kontinu ke dalam 256 bin integer. Mendukung penanganan nilai hilang (\`NaN\`) dan fitur kategorikal secara bawaan dengan kecepatan komputasi puluhan kali lebih cepat.

---

## 1.11.3. Voting & Stacking
- \`VotingClassifier\`: Menggabungkan prediksi berbagai algoritma berbeda (misal SVM + RF + Logistic) via mayoritas (*hard voting*) atau probabilitas rata-rata (*soft voting*).
- \`StackingClassifier\`: Menggunakan prediksi dari beberapa base model sebagai fitur input untuk model meta-estimator di level berikutnya.
`
    },
    {
      id: "sec-1-12-multiclass",
      slug: "multiclass",
      title: "1.12. Multiclass and multioutput algorithms",
      orderIndex: 12,
      description: "Strategi dekomposisi klasifikasi biner untuk multi-kelas dan multi-output.",
      content_markdown: `# 1.12. Multiclass and multioutput algorithms

- **One-vs-Rest (OvR)** (\`OneVsRestClassifier\`): Melatih $N$ model biner untuk $N$ kelas, di mana setiap model membedakan satu kelas tertentu melawan seluruh kelas lainnya.
- **One-vs-One (OvO)** (\`OneVsOneClassifier\`): Melatih $N(N-1)/2$ model biner untuk setiap pasang kelas.
- **ClassifierChain**: Memprediksi multilabel secara berurutan dengan menyertakan prediksi label sebelumnya sebagai fitur tambahan.
`
    },
    {
      id: "sec-1-13-feature-selection",
      slug: "feature-selection",
      title: "1.13. Feature selection",
      orderIndex: 13,
      description: "Seleksi fitur untuk mereduksi dimensi, mempercepat komputasi, dan meningkatkan akurasi.",
      content_markdown: `# 1.13. Feature selection

Metode seleksi fitur di Scikit-Learn:
1. **VarianceThreshold**: Membuang fitur konstan atau dengan varians lebih kecil dari threshold tertentu.
2. **SelectKBest & SelectPercentile**: Seleksi univariat berdasarkan uji statistik (ANOVA F-value \`f_classif\`, Chi-squared \`chi2\`, Mutual Information \`mutual_info_classif\`).
3. **RFE (Recursive Feature Elimination)**: Membuang fitur paling tidak penting secara rekursif berdasarkan koefisien model.
4. **SelectFromModel**: Memilih fitur yang memiliki bobot koefisien absolut atau nilai *importance* lebih tinggi dari ambang batas tertentu.
5. **SequentialFeatureSelector (SFS)**: Seleksi fitur maju (*forward*) atau mundur (*backward*) berbasis skor cross-validation.
`
    },
    {
      id: "sec-1-14-semi-supervised",
      slug: "semi-supervised",
      title: "1.14. Semi-supervised learning",
      orderIndex: 14,
      description: "Pembelajaran semi-terawasi saat hanya sebagian kecil data yang memiliki label.",
      content_markdown: `# 1.14. Semi-supervised learning

- \`LabelPropagation\`: Menyebarkan label data melalui graf kedekatan berbasis matriks transisi probabilitas.
- \`LabelSpreading\`: Menggunakan normalisasi simetris Laplacian graf untuk regulasi terhadap derau data.
- \`SelfTrainingClassifier\`: Memprediksi data tak berlabel secara iteratif dan memasukkan prediksi dengan probabilitas keyakinan tertinggi ke data latihan.
`
    },
    {
      id: "sec-1-15-isotonic",
      slug: "isotonic",
      title: "1.15. Isotonic regression",
      orderIndex: 15,
      description: "Regresi monotonik non-parametrik bebas bentuk fungsi.",
      content_markdown: `# 1.15. Isotonic regression

\`IsotonicRegression\` menghasilkan estimasi kurva 1D non-decreasing bebas bentuk yang meminimalkan galat kuadrat terbobot:

$$\\min \\sum_i w_i (y_i - \\hat{y}_i)^2 \\quad \\text{subject to } \\hat{y}_i \\le \\hat{y}_j \\text{ untuk setiap } x_i \\le x_j$$
`
    },
    {
      id: "sec-1-16-calibration",
      slug: "calibration",
      title: "1.16. Probability calibration",
      orderIndex: 16,
      description: "Kalibrasi probabilitas prediksi model menggunakan Sigmoid atau Isotonic.",
      content_markdown: `# 1.16. Probability calibration

\`CalibratedClassifierCV\` mengkalibrasi probabilitas prediksi model sehingga nilai $p=0.8$ benar-benar berarti 80% sampel memiliki label positif.
- \`method='sigmoid'\`: Platt scaling parametrik logistik.
- \`method='isotonic'\`: Kalibrasi non-parametrik monotonik untuk dataset besar ($n > 1000$).
`
    },
    {
      id: "sec-1-17-neural-networks-supervised",
      slug: "neural-networks-supervised",
      title: "1.17. Neural network models (supervised)",
      orderIndex: 17,
      description: "Multi-layer Perceptron (MLP) untuk klasifikasi dan regresi terawasi.",
      content_markdown: `# 1.17. Neural network models (supervised)

Multi-layer Perceptron (MLP) adalah arsitektur jaringan syaraf tiruan feedforward dengan propagasi balik (*backpropagation*).

\`\`\`python
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=200, random_state=1)
clf = MLPClassifier(
    hidden_layer_sizes=(64, 32),
    activation='relu',
    solver='adam',
    alpha=1e-4,
    max_iter=300,
    random_state=1
)
clf.fit(X, y)
print("Skor Akurasi MLP:", clf.score(X, y))
\`\`\`

### Parameter Kunci MLP:
- \`activation\`: \`'identity'\`, \`'logistic'\`, \`'tanh'\`, \`'relu'\`.
- \`solver\`: \`'adam'\` (optimal untuk dataset besar), \`'lbfgs'\` (sangat presisi untuk dataset kecil).
- \`alpha\`: Parameter regularisasi L2 penalti bobot untuk mencegah overfitting.
`
    }
  ]
};
