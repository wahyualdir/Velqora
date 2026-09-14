import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * Kurikulum dan Materi Komprehensif Resmi Scikit-Learn 1.9 User Guide
 * Berisi seluruh Bab Utama dan Subbab (Hierarkis) lengkap dengan formulasi matematis,
 * penjelasan konseptual mendalam, dan implementasi kode Python Scikit-Learn.
 */
export const SCIKIT_LEARN_USER_GUIDE_SECTIONS: DocSectionItem[] = [
  // =========================================================================
  // 1. SUPERVISED LEARNING
  // =========================================================================
  {
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
        description: "Metode regresi dan klasifikasi di mana nilai target diprediksi sebagai kombinasi linear dari fitur input dengan berbagai bentuk penalti regularisasi (L1, L2, Elastic-Net).",
        content_markdown: `# 1.1. Linear Models

The following are a set of methods intended for regression in which the target value is expected to be a linear combination of the features. In mathematical notation, the predicted value $\\hat{y}$ can be written as:

$$\\hat{y}(w, x) = w_0 + w_1 x_1 + \\dots + w_p x_p$$

Across the module, we designate the vector $w = (w_1, \\dots, w_p)$ as \`coef_\` and $w_0$ as \`intercept_\`.

To perform classification with generalized linear models, see [Logistic regression](#1-1-11-logistic-regression).

---

## 1.1.1. Ordinary Least Squares

\`LinearRegression\` fits a linear model with coefficients $w = (w_1, \\dots, w_p)$ to minimize the residual sum of squares between the observed targets in the dataset, and the targets predicted by the linear approximation. Mathematically it solves a problem of the form:

$$\\min_{w} \\| X w - y \\|_2^2$$

\`LinearRegression\` takes in its \`fit\` method arguments \`X\`, \`y\`, \`sample_weight\` and stores the coefficients $w$ of the linear model in its \`coef_\` and \`intercept_\` attributes:

\`\`\`python
from sklearn import linear_model
import numpy as np

# Inisialisasi estimator Linear Regression
reg = linear_model.LinearRegression()
reg.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])

print("Koefisien w (coef_):", reg.coef_)
print("Intersep w0 (intercept_):", reg.intercept_)
# Output:
# Koefisien w (coef_): [0.5 0.5]
# Intersep w0 (intercept_): 0.0
\`\`\`

### 1.1.1.1. Non-Negative Least Squares
It is possible to constrain all the coefficients to be non-negative, which may be useful when they represent physical or naturally non-negative quantities (e.g. frequency counts or prices of goods). \`LinearRegression\` accepts a boolean \`positive=True\` parameter:

\`\`\`python
reg_positive = linear_model.LinearRegression(positive=True)
reg_positive.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])
print("Non-negative coefficients:", reg_positive.coef_)
\`\`\`

### 1.1.1.2. Ordinary Least Squares Complexity
The least squares solution is computed using the singular value decomposition (SVD) of $X$. If $X$ is a matrix of shape \`(n_samples, n_features)\`, this method has a computational cost of $\\mathcal{O}(n_{\\text{samples}} n_{\\text{features}}^2)$, assuming that $n_{\\text{samples}} \\ge n_{\\text{features}}$.

---

## 1.1.2. Ridge regression and classification

### 1.1.2.1. Regression
\`Ridge\` regression addresses some of the problems of Ordinary Least Squares by imposing a penalty on the size of the coefficients (Tikhonov Regularization). The ridge coefficients minimize a penalized residual sum of squares:

$$\\min_{w} \\| X w - y \\|_2^2 + \\alpha \\|w\\|_2^2$$

The complexity parameter $\\alpha \\ge 0$ controls the amount of shrinkage: the larger the value of $\\alpha$, the greater the amount of shrinkage and thus the coefficients become more robust to multicollinearity.

\`\`\`python
from sklearn import linear_model
import numpy as np

# Ridge estimator dengan regularisasi L2 (alpha = 0.5)
reg = linear_model.Ridge(alpha=0.5)
reg.fit([[0, 0], [0, 0], [1, 1]], [0, 0.1, 1])

print("Ridge coef_:", reg.coef_)
print("Ridge intercept_:", reg.intercept_)
\`\`\`

### 1.1.2.2. Setting the Regularization Parameter: RidgeCV
\`RidgeCV\` implements ridge regression with built-in cross-validation of the $\\alpha$ parameter:

\`\`\`python
from sklearn.linear_model import RidgeCV

clf = RidgeCV(alphas=[1e-3, 1e-2, 1e-1, 1.0]).fit([[0, 0], [0, 0], [1, 1]], [0, 0.1, 1])
print("Best alpha terpilih:", clf.alpha_)
\`\`\`

---

## 1.1.3. Lasso

\`Lasso\` is a linear model that estimates sparse coefficients. It is useful in some contexts due to its tendency to prefer solutions with fewer non-zero coefficients, effectively reducing the number of features upon which the given solution is dependent. Mathematically, it consists of a linear model with an $\\ell_1$ prior as regularizer:

$$\\min_{w} \\frac{1}{2 n_{\\text{samples}}} \\| X w - y \\|_2^2 + \\alpha \\|w\\|_1$$

Where $\\|w\\|_1 = \\sum_{i=1}^p |w_i|$ is the $\\ell_1$-norm of the coefficient vector.

\`\`\`python
from sklearn import linear_model

clf = linear_model.Lasso(alpha=0.1)
clf.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])
print("Lasso coef_ (sparse):", clf.coef_)
print("Prediksi untuk sample baru:", clf.predict([[3, 3]]))
\`\`\`

---

## 1.1.4. Multi-task Lasso
The \`MultiTaskLasso\` is a linear model that estimates sparse coefficients for multiple regression problems jointly: $Y$ is a 2D array of shape \`(n_samples, n_tasks)\`. The constraint is that the selected features are the same for all the regression tasks (joint feature selection).

---

## 1.1.5. Elastic-Net

\`ElasticNet\` is a linear regression model trained with both $\\ell_1$ and $\\ell_2$-norm regularization of coefficients. This combination allows for learning a sparse model where few of the weights are non-zero like \`Lasso\`, while maintaining the regularization properties of \`Ridge\`.

$$\\min_{w} \\frac{1}{2 n_{\\text{samples}}} \\| X w - y \\|_2^2 + \\alpha \\rho \\|w\\|_1 + \\frac{\\alpha(1 - \\rho)}{2} \\|w\\|_2^2$$

The parameter \`l1_ratio\` corresponds to $\\rho$ in the equation above:
- When \`l1_ratio=1\`, the penalty is pure $\\ell_1$ (Lasso).
- When \`l1_ratio=0\`, the penalty is pure $\\ell_2$ (Ridge).

\`\`\`python
from sklearn.linear_model import ElasticNet

regr = ElasticNet(random_state=0, alpha=0.1, l1_ratio=0.5)
regr.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])
print("ElasticNet coef_:", regr.coef_)
\`\`\`

---

## 1.1.6. Multi-task Elastic-Net
\`MultiTaskElasticNet\` extends Elastic-Net to joint estimation across multiple targets with mixed $\\ell_{21}$ and $\\ell_2$ penalties.

---

## 1.1.7. Least Angle Regression (LARS)
Least-angle regression (LARS) is a model selection algorithm for high-dimensional data ($p \\gg n$). At each step, it finds the feature most correlated with the residual and moves the coefficients along the equiangular direction.

---

## 1.1.8. LARS Lasso
\`LassoLars\` is a lasso model implemented using the LARS algorithm, computing the entire path of coefficients as a function of the regularization parameter.

---

## 1.1.9. Orthogonal Matching Pursuit (OMP)
\`OrthogonalMatchingPursuit\` approximates the optimal solution under an $\\ell_0$ pseudo-norm constraint, greedily selecting at each step the atom most correlated with the current residual.

---

## 1.1.10. Bayesian Regression

Bayesian regression techniques can be used to include regularization parameters in the estimation procedure: the regularization parameter is not set in a hard sense but tuned to the data at hand.

### 1.1.10.1. Bayesian Ridge Regression
\`BayesianRidge\` estimates a probabilistic model of the regression problem:

$$p(y|X, w, \\alpha) = \\mathcal{N}(y | Xw, \\alpha^{-1} I_n)$$

The prior for the coefficient vector $w$ is given by a spherical Gaussian:

$$p(w|\\lambda) = \\mathcal{N}(w | 0, \\lambda^{-1} I_p)$$

\`\`\`python
from sklearn.linear_model import BayesianRidge

reg = BayesianRidge()
reg.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])
print("Estimated coefficients:", reg.coef_)
print("Estimated alpha (precision of noise):", reg.alpha_)
\`\`\`

---

## 1.1.11. Logistic regression

\`LogisticRegression\`, despite its name, is a linear model for classification rather than regression. It models the posterior probability of the positive class using the logistic function:

$$p(y = 1 | x) = \\sigma(w^T x + c) = \\frac{1}{1 + e^{-(w^T x + c)}}$$

The objective function with an $\\ell_2$ penalty is:

$$\\min_{w, c} \\frac{1}{2} w^T w + C \\sum_{i=1}^n \\log(\\exp(-y_i (X_i w + c)) + 1)$$

Where $C > 0$ is the inverse regularization strength: smaller values specify stronger regularization.

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(random_state=0, max_iter=200).fit(X, y)

print("Akurasi Model:", clf.score(X, y))
print("Probabilitas Sampel Pertama:", clf.predict_proba(X[:1, :]))
\`\`\`

---

## 1.1.12. Generalized Linear Models (GLM)

Generalized Linear Models extend linear models by allowing the target $y$ to follow probability distributions other than Gaussian (such as Poisson, Gamma, or Tweedie distributions) via an inverse link function $h$:

$$\\hat{y} = h(Xw)$$

Classes in Scikit-Learn include:
- \`PoissonRegressor\` for count data with log-link.
- \`GammaRegressor\` for strictly positive continuous targets.
- \`TweedieRegressor\` with power parameter $p$.

---

## 1.1.13. Stochastic Gradient Descent - SGD

\`SGDClassifier\` and \`SGDRegressor\` implement stochastic gradient descent routines supporting different loss functions (e.g. \`hinge\`, \`log_loss\`, \`squared_error\`) and penalties (\`l1\`, \`l2\`, \`elasticnet\`). It is exceptionally scalable for datasets with $n_{\\text{samples}} > 10^5$.

---

## 1.1.14. Perceptron
The \`Perceptron\` is a classification algorithm suitable for large scale learning with loss function \`loss="perceptron"\` and learning rate $\\eta = 1$.

---

## 1.1.15. Passive Aggressive Algorithms
Passive-aggressive algorithms are large-scale online learning algorithms that update weights only when an example is misclassified or margin is violated.

---

## 1.1.16. Robustness regression: outliers and modeling errors

Robust regression aims to fit a regression model in the presence of corrupt data (either outliers in target values or leverage points in features):
- **RANSAC** (\`RANSACRegressor\`): Fits a model from a random subset of inliers.
- **Theil-Sen** (\`TheilSenRegressor\`): Computes slopes between all pairs of points and takes the median.
- **Huber** (\`HuberRegressor\`): Uses a piecewise linear and quadratic loss function to be linear for outliers.

---

## 1.1.17. Quantile Regression
\`QuantileRegressor\` optimizes the pinball loss to estimate conditional quantiles (e.g. median with quantile 0.5 or 90th percentile).

---

## 1.1.18. Polynomial regression: extending linear models with basis functions

One common pattern within machine learning is to use linear models trained on nonlinear functions of the data. This approach maintains the fast performance of linear methods while allowing them to fit a much wider range of data.

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
`,
        codeSnippets: [
          {
            id: "snip-linear-models-1",
            language: "python",
            caption: "ordinary_least_squares_demo.py",
            code: `from sklearn.linear_model import LinearRegression\nimport numpy as np\n\nX = np.array([[1, 1], [1, 2], [2, 2], [2, 3]])\ny = np.dot(X, np.array([1, 2])) + 3\n\nreg = LinearRegression().fit(X, y)\nprint("Skor R2:", reg.score(X, y))\nprint("Koefisien:", reg.coef_)\nprint("Intersep:", reg.intercept_)`
          }
        ]
      },
      {
        id: "sec-1-2-lda-qda",
        slug: "lda-qda",
        title: "1.2. Linear and Quadratic Discriminant Analysis",
        orderIndex: 2,
        description: "Linear Discriminant Analysis (LDA) dan Quadratic Discriminant Analysis (QDA) adalah estimator batas keputusan linear dan kuadratik berbasis model probabilitas generatif Gaussian.",
        content_markdown: `# 1.2. Linear and Quadratic Discriminant Analysis

Linear Discriminant Analysis (\`LinearDiscriminantAnalysis\`) and Quadratic Discriminant Analysis (\`QuadraticDiscriminantAnalysis\`) are two classic classifiers with linear and quadratic decision surfaces, respectively.

These classifiers are attractive because they have closed-form solutions that can be easily computed, are inherently multiclass, have proven to work well in practice, and have no hyperparameters to tune.

---

## 1.2.1. Dimensionality reduction using Linear Discriminant Analysis

\`LinearDiscriminantAnalysis\` can be used to perform supervised dimensionality reduction by projecting the input data onto a linear subspace consisting of the directions that maximize the separation between our classes:

$$\\max_w \\frac{w^T S_B w}{w^T S_W w}$$

Where $S_B$ is the between-class scatter matrix and $S_W$ is the within-class scatter matrix.

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

iris = load_iris()
X = iris.data
y = iris.target

lda = LinearDiscriminantAnalysis(n_components=2)
X_r2 = lda.fit(X, y).transform(X)
print("Dimensi awal:", X.shape, "-> Dimensi tereduksi:", X_r2.shape)
\`\`\`

---

## 1.2.2. Mathematical formulation of the LDA and QDA classifiers

Both LDA and QDA can be derived from simple probabilistic models which assume that the class conditional distribution of data $P(X|y=k)$ is normally distributed:

$$P(X | y = k) = \\frac{1}{(2\\pi)^{d/2} |\\Sigma_k|^{1/2}} \\exp\\left(-\\frac{1}{2} (X - \\mu_k)^T \\Sigma_k^{-1} (X - \\mu_k)\\right)$$

- **LDA**: Assumes all classes share the identical covariance matrix $\\Sigma_k = \\Sigma$. The resulting log-ratio of probabilities is linear with respect to $x$.
- **QDA**: Allows each class $k$ to have its own covariance matrix $\\Sigma_k$. The resulting decision boundaries are quadric curves (ellipses, parabolas, hyperbolas).

---

## 1.2.3. Shrinkage and Covariance Estimators
Shrinkage is a tool to improve the estimation of covariance matrices in situations where the number of training samples is small compared to the number of features. In scikit-learn, shrinkage can be set via \`shrinkage='auto'\` (using the Ledoit-Wolf lemma).
`
      },
      {
        id: "sec-1-3-kernel-ridge",
        slug: "kernel-ridge",
        title: "1.3. Kernel ridge regression",
        orderIndex: 3,
        description: "Kernel ridge regression (KRR) menggabungkan Ridge Regression (regularisasi kuadrat L2) dengan trik kernel untuk pemodelan regresi non-linear.",
        content_markdown: `# 1.3. Kernel ridge regression

Kernel ridge regression (\`KernelRidge\`) combines Ridge regression (linear least squares with $\\ell_2$-norm regularization) with the kernel trick. It thus learns a linear function in the space induced by the respective kernel and the data. For non-linear kernels, this corresponds to a non-linear function in the original space.

The form of the model learned by \`KernelRidge\` is identical to support vector regression (\`SVR\`). However, different loss functions are used:
- \`KernelRidge\` uses squared error loss.
- \`SVR\` uses $\\epsilon$-insensitive loss, leading to a sparse model.

\`\`\`python
from sklearn.kernel_ridge import KernelRidge
import numpy as np

X = 5 * np.random.rand(100, 1)
y = np.sin(X).ravel()

krr = KernelRidge(alpha=1.0, kernel='rbf', gamma=0.1)
krr.fit(X, y)
print("Prediksi KRR pada titik x=2.5:", krr.predict([[2.5]]))
\`\`\`
`
      },
      {
        id: "sec-1-4-svm",
        slug: "svm",
        title: "1.4. Support Vector Machines",
        orderIndex: 4,
        description: "Support Vector Machines (SVM) adalah metode pembelajaran terawasi yang mencari bidang pemisah ber-margin optimal (maximum margin hyperplane) untuk klasifikasi dan regresi.",
        content_markdown: `# 1.4. Support Vector Machines

Support vector machines (SVMs) are a set of supervised learning methods used for classification, regression and outliers detection.

The advantages of support vector machines are:
- Effective in high dimensional spaces.
- Still effective in cases where number of dimensions is greater than the number of samples.
- Uses a subset of training points in the decision function (called support vectors), so it is also memory efficient.
- Versatile: different Kernel functions can be specified for the decision function.

---

## 1.4.1. Classification (SVC, NuSVC, LinearSVC)

\`SVC\`, \`NuSVC\` and \`LinearSVC\` are classes capable of performing multi-class classification on a dataset.

\`\`\`python
from sklearn import svm
X = [[0, 0], [1, 1]]
y = [0, 1]
clf = svm.SVC()
clf.fit(X, y)

print("Support vectors indices:", clf.support_)
print("Support vectors data:\\n", clf.support_vectors_)
print("Prediksi baru:", clf.predict([[2., 2.]]))
\`\`\`

---

## 1.4.2. Regression (SVR)
The method of Support Vector Classification can be extended to solve regression problems. This method is called Support Vector Regression (\`SVR\`). The model produced by support vector classification depends only on a subset of the training data because the cost function for building the model ignores any training points close to the model prediction (within an $\\epsilon$ tube).

---

## 1.4.3. Mathematical Formulation

Given training vectors $x_i \\in \\mathbb{R}^p$, $i = 1, \\dots, n$, and a label vector $y \\in \\{1, -1\\}^n$, the soft-margin C-SVC solves the primal problem:

$$\\min_{w, b, \\zeta} \\frac{1}{2} w^T w + C \\sum_{i=1}^n \\zeta_i$$

$$\\text{subject to } y_i (w^T \\phi(x_i) + b) \\ge 1 - \\zeta_i, \\quad \\zeta_i \\ge 0, \\quad i=1, \\dots, n$$

Its dual formulation is:

$$\\min_{\\alpha} \\frac{1}{2} \\alpha^T Q \\alpha - e^T \\alpha$$

$$\\text{subject to } y^T \\alpha = 0, \\quad 0 \\le \\alpha_i \\le C, \\quad i=1, \\dots, n$$

Where $Q_{ij} = y_i y_j K(x_i, x_j)$ is the Gram matrix computed using the kernel function $K(x_i, x_j) = \\phi(x_i)^T \\phi(x_j)$.
`
      },
      {
        id: "sec-1-5-sgd",
        slug: "sgd",
        title: "1.5. Stochastic Gradient Descent",
        orderIndex: 5,
        description: "Pendekatan optimasi efisien untuk fitting estimator linear di bawah berbagai fungsi rugi dan penalti, sangat ideal untuk data berukuran besar.",
        content_markdown: `# 1.5. Stochastic Gradient Descent

Stochastic Gradient Descent (SGD) is a simple yet very efficient approach to fitting linear sub-classifiers and regressors under convex loss functions such as (linear) Support Vector Machines and Logistic Regression.

Even though SGD has been around in the machine learning community for a long time, it has received a considerable amount of attention recently in the context of large-scale learning.

SGD has been successfully applied to large-scale and sparse machine learning problems often encountered in text classification and natural language processing.

\`\`\`python
from sklearn.linear_model import SGDClassifier
X = [[0., 0.], [1., 1.]]
y = [0, 1]
clf = SGDClassifier(loss="log_loss", penalty="l2", max_iter=1000)
clf.fit(X, y)
print("Prediksi probabilitas:", clf.predict_proba([[2., 2.]]))
\`\`\`
`
      },
      {
        id: "sec-1-6-neighbors",
        slug: "neighbors",
        title: "1.6. Nearest Neighbors",
        orderIndex: 6,
        description: "Metode berbasis tetangga terdekat (k-NN) untuk klasifikasi dan regresi non-parametrik berbasis metrik jarak (Euclidean, Manhattan, Minkowski).",
        content_markdown: `# 1.6. Nearest Neighbors

The principle behind nearest neighbor methods is to find a predefined number of training samples closest in distance to the new point, and predict the label from these. The number of samples can be a user-defined constant (k-nearest neighbor learning), or vary based on the local density of points (radius-based neighbor learning).

The distance can, in general, be any metric measure: standard Euclidean distance is the most common choice.

\`\`\`python
from sklearn.neighbors import NearestNeighbors
import numpy as np

samples = [[0, 0, 2], [1, 0, 0], [0, 0, 1]]
neigh = NearestNeighbors(n_neighbors=2)
neigh.fit(samples)

distances, indices = neigh.kneighbors([[0, 0, 1.3]])
print("Jarak terdekat:", distances)
print("Indeks tetangga:", indices)
\`\`\`
`
      },
      {
        id: "sec-1-7-gaussian-process",
        slug: "gaussian-process",
        title: "1.7. Gaussian Processes",
        orderIndex: 7,
        description: "Model probabilitas non-parametrik berbasis kernel yang menyediakan estimasi mean prediksi dan ketidakpastian (confidence intervals) secara terpadu.",
        content_markdown: `# 1.7. Gaussian Processes

Gaussian Processes (GP) are a generic supervised learning method designed to solve regression and probabilistic classification problems.

The advantages of Gaussian Processes are:
- The prediction interpolates the observations.
- The prediction is probabilistic (Gaussian) so that one can compute empirical confidence intervals.
- Versatile: different kernels can be specified.

\`\`\`python
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import DotProduct, WhiteKernel

X = [[0, 0], [1, 1]]
y = [0, 1]
kernel = DotProduct() + WhiteKernel()
gpr = GaussianProcessRegressor(kernel=kernel, random_state=0).fit(X, y)
y_mean, y_std = gpr.predict([[2, 2]], return_std=True)
print("Mean prediksi:", y_mean, "Std uncertainty:", y_std)
\`\`\`
`
      },
      {
        id: "sec-1-8-cross-decomposition",
        slug: "cross-decomposition",
        title: "1.8. Cross decomposition",
        orderIndex: 8,
        description: "Partial Least Squares (PLS) dan Canonical Correlation Analysis (CCA) untuk memodelkan hubungan kovarians maksimal antar dua set variabel multivariat.",
        content_markdown: `# 1.8. Cross decomposition

The cross-decomposition module finds relations between two multivariate datasets: the $X$ and $Y$ arrays. These families of algorithms include Partial Least Squares (PLS) and Canonical Correlation Analysis (CCA).

They are particularly useful when the matrix of predictors has more variables than observations, and when there is multicollinearity among $X$ values.
`
      },
      {
        id: "sec-1-9-naive-bayes",
        slug: "naive-bayes",
        title: "1.9. Naive Bayes",
        orderIndex: 9,
        description: "Metode klasifikasi terawasi berbasis Teorema Bayes dengan asumsi 'naif' bahwa setiap pasang fitur saling independen secara kondisional diberikan label kelas.",
        content_markdown: `# 1.9. Naive Bayes

Naive Bayes methods are a set of supervised learning algorithms based on applying Bayes' theorem with the 'naive' assumption of conditional independence between every pair of features given the value of the class variable:

$$P(y | x_1, \\dots, x_n) = \\frac{P(y) P(x_1, \\dots, x_n | y)}{P(x_1, \\dots, x_n)}$$

Using the naive conditional independence assumption:

$$P(y | x_1, \\dots, x_n) \\propto P(y) \\prod_{i=1}^n P(x_i | y)$$

Algoritma turunan di Scikit-Learn:
- \`GaussianNB\`: Mengasumsikan fitur berdistribusi kontinu Gaussian.
- \`MultinomialNB\`: Untuk data diskrit frekuensi kata (pemrosesan teks).
- \`BernoulliNB\`: Untuk data biner boolean.
`
      },
      {
        id: "sec-1-10-decision-trees",
        slug: "decision-trees",
        title: "1.10. Decision Trees",
        orderIndex: 10,
        description: "Pohon keputusan (CART) mempartisi ruang fitur secara hierarkis menjadi aturan keputusan if-then-else berbasis kemurnian Gini Impurity atau Entropy.",
        content_markdown: `# 1.10. Decision Trees

Decision Trees (DTs) are a non-parametric supervised learning method used for classification and regression. The goal is to create a model that predicts the value of a target variable by learning simple decision rules inferred from the data features.

A tree can be seen as a piecewise constant approximation.

\`\`\`python
from sklearn.datasets import load_iris
from sklearn import tree

iris = load_iris()
X, y = iris.data, iris.target
clf = tree.DecisionTreeClassifier(criterion="gini", max_depth=3)
clf = clf.fit(X, y)
\`\`\`
`
      },
      {
        id: "sec-1-11-ensemble",
        slug: "ensemble",
        title: "1.11. Ensembles: Gradient boosting, random forests, bagging, voting, stacking",
        orderIndex: 11,
        description: "Teknik penggabungan beberapa estimator dasar (ensemble) untuk meningkatkan kemampuan generalisasi dan kekokohan prediksi.",
        content_markdown: `# 1.11. Ensemble methods

The goal of ensemble methods is to combine the predictions of several base estimators built with a given learning algorithm in order to improve generalizability and robustness over a single estimator.

Two families of ensemble methods are usually distinguished:
1. **Averaging / Bagging methods**: In averaging methods, the driving principle is to build several estimators independently and then to average their predictions (e.g. \`RandomForestClassifier\`, \`ExtraTreesClassifier\`).
2. **Boosting methods**: Base estimators are built sequentially and one tries to reduce the bias of the combined estimator (e.g. \`GradientBoostingClassifier\`, \`HistGradientBoostingClassifier\`, \`AdaBoostClassifier\`).

\`\`\`python
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=1000, n_features=4, random_state=0)
clf = RandomForestClassifier(n_estimators=100, max_depth=2, random_state=0)
clf.fit(X, y)
print("Fitur penting (Feature Importances):", clf.feature_importances_)
\`\`\`
`
      },
      {
        id: "sec-1-12-multiclass",
        slug: "multiclass",
        title: "1.12. Multiclass and multioutput algorithms",
        orderIndex: 12,
        description: "Strategi adaptasi algoritma klasifikasi biner untuk multi-kelas dan multi-output: One-vs-Rest (OvR) dan One-vs-One (OvO).",
        content_markdown: `# 1.12. Multiclass and multioutput algorithms

This module implements meta-estimators to solve multiclass and multilabel classification problems by decomposing such problems into binary classification problems:
- \`OneVsRestClassifier\` (OvR): Melatih satu classifier per kelas.
- \`OneVsOneClassifier\` (OvO): Melatih satu classifier untuk setiap pasang kelas.
`
      },
      {
        id: "sec-1-13-feature-selection",
        slug: "feature-selection",
        title: "1.13. Feature selection",
        orderIndex: 13,
        description: "Metode pemilihan subset fitur paling relevan untuk mengurangi dimensi, meningkatkan akurasi, dan mencegah overfitting.",
        content_markdown: `# 1.13. Feature selection

The classes in the \`sklearn.feature_selection\` module can be used for feature selection/dimensionality reduction on sample sets:
- **Variance Threshold**: Menghapus semua fitur dengan varians rendah di bawah ambang batas.
- **Univariate Feature Selection**: Memilih fitur terbaik berdasarkan uji statistik univariat (\`SelectKBest\`, \`SelectPercentile\`).
- **Recursive Feature Elimination (RFE)**: Memangkas fitur paling tidak penting secara rekursif.
- **SelectFromModel**: Memilih fitur berdasarkan besaran bobot koefisien atau feature importances model estimator.
`
      },
      {
        id: "sec-1-14-semi-supervised",
        slug: "semi-supervised",
        title: "1.14. Semi-supervised learning",
        orderIndex: 14,
        description: "Algoritma yang memanfaatkan sejumlah kecil data berlabel bersama dengan sejumlah besar data tak berlabel (Label Propagation & Label Spreading).",
        content_markdown: `# 1.14. Semi-supervised learning

Semi-supervised learning is a situation in which in your dataset there are some points that have labels, but a significant amount of points that do not have labels.

Algorithms available in scikit-learn:
- \`LabelPropagation\`: Menggunakan matriks transisi probabilitas mentah.
- \`LabelSpreading\`: Menggunakan normalisasi Laplacian simetris untuk regulasi noise.
- \`SelfTrainingClassifier\`: Wrapper iteratif semi-terawasi.
`
      },
      {
        id: "sec-1-15-isotonic",
        slug: "isotonic",
        title: "1.15. Isotonic regression",
        orderIndex: 15,
        description: "Regresi monotonik non-parametrik yang mempertahankan urutan data tanpa mengasumsikan bentuk fungsional tertentu.",
        content_markdown: `# 1.15. Isotonic regression

The class \`IsotonicRegression\` fits a non-decreasing, or monotonic, free-form line to 1D data. It solves the problem of finding a weighted least-squares fit subject to monotonicity constraints.
`
      },
      {
        id: "sec-1-16-calibration",
        slug: "calibration",
        title: "1.16. Probability calibration",
        orderIndex: 16,
        description: "Kalibrasi probabilitas prediksi model menggunakan Sigmoid (Platt Scaling) atau Isotonic Regression agar probabilitas mencerminkan rasio keyakinan sebenarnya.",
        content_markdown: `# 1.16. Probability calibration

When performing classification, you often want not only to predict the class label, but also obtain a flag of the uncertainty in your prediction. Well-calibrated classifiers are probabilistic classifiers for which the output of the \`predict_proba\` method can be directly interpreted as a confidence level.

Scikit-Learn provides \`CalibratedClassifierCV\` supporting:
- \`method='sigmoid'\`: Platt scaling parametrik.
- \`method='isotonic'\`: Kalibrasi non-parametrik untuk dataset berukuran besar.
`
      },
      {
        id: "sec-1-17-neural-networks-supervised",
        slug: "neural-networks-supervised",
        title: "1.17. Neural network models (supervised)",
        orderIndex: 17,
        description: "Multi-layer Perceptron (MLP) untuk klasifikasi dan regresi dengan propagasi balik (Backpropagation) dan pengoptimal Adam / L-BFGS.",
        content_markdown: `# 1.17. Neural network models (supervised)

Multi-layer Perceptron (MLP) is a supervised learning algorithm that learns a non-linear function approximator for either classification or regression:
- \`MLPClassifier\` optimizes the Log-Loss function using L-BFGS, SGD, or Adam.
- \`MLPRegressor\` optimizes the squared error loss function.

\`\`\`python
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=100, random_state=1)
clf = MLPClassifier(random_state=1, max_iter=300, hidden_layer_sizes=(50, 25)).fit(X, y)
print("Akurasi MLP:", clf.score(X, y))
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // 2. UNSUPERVISED LEARNING
  // =========================================================================
  {
    id: "sec-2-unsupervised-learning",
    slug: "unsupervised-learning",
    title: "2. Unsupervised learning",
    orderIndex: 2,
    description: "Metode pembelajaran tanpa label target untuk pengelompokan data (clustering), estimasi densitas, reduksi dimensi, dan deteksi anomali.",
    subsections: [
      {
        id: "sec-2-1-gaussian-mixture",
        slug: "gaussian-mixture",
        title: "2.1. Gaussian mixture models",
        orderIndex: 1,
        description: "Model probabilitas yang mengasumsikan data dihasilkan dari campuran sejumlah terhingga distribusi Gaussian dengan parameter yang tidak diketahui.",
        content_markdown: `# 2.1. Gaussian mixture models

A Gaussian mixture model is a probabilistic model that assumes all the data points are generated from a mixture of a finite number of Gaussian distributions with unknown parameters.

Scikit-learn implements:
- \`GaussianMixture\`: Algoritma Expectation-Maximization (EM) untuk mencari parameter rata-rata, kovarians, dan bobot campuran.
- \`BayesianGaussianMixture\`: Inferensi variasional Bayesian yang otomatis memangkas komponen kluster yang tidak diperlukan.
`
      },
      {
        id: "sec-2-2-manifold",
        slug: "manifold",
        title: "2.2. Manifold learning",
        orderIndex: 2,
        description: "Pendekatan reduksi dimensi non-linear untuk memetakan manifold berdimensi tinggi ke ruang berdimensi rendah (t-SNE, Isomap, LLE).",
        content_markdown: `# 2.2. Manifold learning

Manifold learning is an approach to non-linear dimensionality reduction. Algorithms for this task are based on the idea that the dimensionality of many datasets is only artificially high.

Algorithms include:
- **t-SNE** (\`TSNE\`): Sangat efektif untuk visualisasi sebaran kluster data pada ruang 2D/3D.
- **Isomap** (\`Isomap\`): Mempertahankan jarak geodesik terpendek antar titik pada graf tetangga.
- **Locally Linear Embedding** (\`LocallyLinearEmbedding\`): Mempertahankan rekonstruksi linear lokal antar tetangga.
`
      },
      {
        id: "sec-2-3-clustering",
        slug: "clustering",
        title: "2.3. Clustering",
        orderIndex: 3,
        description: "Partisi data tak berlabel ke dalam kelompok-kelompok homogen (K-Means, DBSCAN, HDBSCAN, Agglomerative, Spectral).",
        content_markdown: `# 2.3. Clustering

Clustering of unlabeled data can be performed with the module \`sklearn.cluster\`.

Each clustering algorithm comes in two variants: a class, that implements the \`fit\` method to learn the clusters on train data, and a function, that, given train data, returns an array of integer labels.

### Ikhtisar Algoritma Clustering di Scikit-Learn:
1. **K-Means** (\`KMeans\`): Meminimalkan inersia (within-cluster sum of squares).
2. **Mini-Batch K-Means**: Varian cepat yang menggunakan komputasi batch bertahap.
3. **DBSCAN**: Pengelompokan berbasis densitas yang mampu menemukan bentuk kluster sembarang dan menandai outliers sebagai noise (-1).
4. **HDBSCAN**: Hierarchical DBSCAN dengan kestabilan kepadatan dinamis.
5. **Agglomerative Clustering**: Pengelompokan hierarkis bottom-up (Ward, Complete, Average, Single linkage).
`
      },
      {
        id: "sec-2-4-biclustering",
        slug: "biclustering",
        title: "2.4. Biclustering",
        orderIndex: 4,
        description: "Pengelompokan simultan pada baris dan kolom matriks data (Spectral Co-Clustering & Spectral Biclustering).",
        content_markdown: `# 2.4. Biclustering

Biclustering algorithms simultaneously cluster rows and columns of a data matrix. These clusters of rows and columns are known as biclusters.
`
      },
      {
        id: "sec-2-5-decomposition",
        slug: "decomposition",
        title: "2.5. Decomposing signals in components (matrix factorization problems)",
        orderIndex: 5,
        description: "Faktorisasi matriks untuk ekstraksi fitur dan reduksi dimensi linear (PCA, IncrementalPCA, KernelPCA, FastICA, NMF).",
        content_markdown: `# 2.5. Decomposing signals in components

Matrix decomposition problems consist of finding a representation of the data matrix $X$ as a product of two lower rank matrices:

$$X \\approx W H$$

- **PCA** (\`PCA\`): Mencari arah varians maksimal data menggunakan Singular Value Decomposition (SVD).
- **FastICA** (\`FastICA\`): Pemisahan sinyal independen non-Gaussian (Independent Component Analysis).
- **NMF** (\`NMF\`): Non-Negative Matrix Factorization untuk data yang non-negatif seperti frekuensi teks atau citra.
`
      },
      {
        id: "sec-2-6-covariance",
        slug: "covariance",
        title: "2.6. Covariance estimation",
        orderIndex: 6,
        description: "Estimasi matriks kovarians yang kokoh terhadap multikolinearitas dan outlier (Empirical, Ledoit-Wolf, OAS, MinCovDet).",
        content_markdown: `# 2.6. Covariance estimation

Many statistical models rely on an estimate of a covariance matrix. Scikit-learn provides empirical and shrinkage estimators such as \`LedoitWolf\` and robust estimators like \`MinCovDet\` (Minimum Covariance Determinant).
`
      },
      {
        id: "sec-2-7-outlier-detection",
        slug: "outlier-detection",
        title: "2.7. Novelty and Outlier Detection",
        orderIndex: 7,
        description: "Deteksi anomali data baru (Novelty) dan identifikasi observasi pencilan dalam data latihan (Outlier) menggunakan Isolation Forest dan One-Class SVM.",
        content_markdown: `# 2.7. Novelty and Outlier Detection

Many applications require being able to decide whether a new observation belongs to the same distribution as existing observations (it is an inlier), or should be considered as different (it is an outlier):
- \`IsolationForest\`: Mengisolasi anomali dengan partisi pohon acak (anomali membutuhkan lebih sedikit partisi untuk terisolasi).
- \`OneClassSVM\`: Memodelkan batas dukungan data normal pada ruang berdimensi tinggi.
- \`LocalOutlierFactor\` (LOF): Mengukur kepadatan lokal sampel terhadap tetangga terdekatnya.
`
      },
      {
        id: "sec-2-8-density",
        slug: "density",
        title: "2.8. Density Estimation",
        orderIndex: 8,
        description: "Estimasi fungsi kepadatan probabilitas kontinu menggunakan Kernel Density Estimation (KDE).",
        content_markdown: `# 2.8. Density Estimation

Density estimation walks the line between unsupervised learning, feature engineering, and data modeling. \`KernelDensity\` computes non-parametric probability density curves using kernel functions (Gaussian, Tophat, Epanechnikov).
`
      }
    ]
  },

  // =========================================================================
  // 3. MODEL SELECTION AND EVALUATION
  // =========================================================================
  {
    id: "sec-3-model-selection",
    slug: "model-selection",
    title: "3. Model selection and evaluation",
    orderIndex: 3,
    description: "Prosedur validasi silang (Cross-Validation), penyetelan hyperparameter (GridSearchCV), dan metrik evaluasi model prediksi.",
    subsections: [
      {
        id: "sec-3-1-cross-validation",
        slug: "cross-validation",
        title: "3.1. Cross-validation: evaluating estimator performance",
        orderIndex: 1,
        description: "Partisi data latih dan uji untuk mengestimasi performa generalisasi model tanpa mengalami data leakage.",
        content_markdown: `# 3.1. Cross-validation: evaluating estimator performance

Learning the parameters of a prediction function and testing it on the same data is a methodological mistake: a model that would just repeat the labels of the samples that it has just seen would have a perfect score but would fail to predict anything useful on yet-unseen data. This situation is called **overfitting**.

To avoid it, it is common practice when performing a supervised machine learning experiment to hold out part of the available data as a test set:

\`\`\`python
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn import datasets
from sklearn import svm

X, y = datasets.load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.4, random_state=0
)

clf = svm.SVC(kernel='linear', C=1).fit(X_train, y_train)
print("Akurasi pada Test Set:", clf.score(X_test, y_test))
\`\`\`

### Skema Cross-Validation:
- \`KFold\`: Membagi dataset menjadi $k$ lipatan berukuran sama.
- \`StratifiedKFold\`: Mempertahankan proporsi persentase kelas pada setiap lipatan.
- \`TimeSeriesSplit\`: Validasi bertahap untuk data runtun waktu tanpa membocorkan masa depan.
`
      },
      {
        id: "sec-3-2-grid-search",
        slug: "grid-search",
        title: "3.2. Tuning the hyper-parameters of an estimator",
        orderIndex: 2,
        description: "Pencarian konfigurasi hyperparameter terbaik menggunakan GridSearchCV, RandomizedSearchCV, atau HalvingGridSearchCV.",
        content_markdown: `# 3.2. Tuning the hyper-parameters of an estimator

Hyper-parameters are parameters that are not directly learnt within estimators. In scikit-learn they are passed as arguments to the constructor of the estimator classes.

Metode pencarian di Scikit-Learn:
1. **Grid Search** (\`GridSearchCV\`): Mengevaluasi seluruh kombinasi parameter secara mendalam.
2. **Randomized Search** (\`RandomizedSearchCV\`): Mengambil sampel acak dari distribusi parameter dengan alokasi komputasi yang fleksibel.
3. **Successive Halving** (\`HalvingGridSearchCV\`): Menyingkirkan kandidat parameter buruk secara bertahap pada subset data kecil.
`
      },
      {
        id: "sec-3-3-classification-threshold",
        slug: "classification-threshold",
        title: "3.3. Tuning the decision threshold for class prediction",
        orderIndex: 3,
        description: "Penyetelan ambang batas keputusan klasifikasi untuk mengoptimalkan metrik khusus di bawah biaya galat asimetris.",
        content_markdown: `# 3.3. Tuning the decision threshold for class prediction

In binary classification, the decision threshold defaults to 0.5. However, in applications such as fraud detection or medical diagnosis where false negatives have severe consequences, \`TunedThresholdClassifierCV\` automatically finds the threshold that optimizes custom cost functions.
`
      },
      {
        id: "sec-3-4-model-evaluation",
        slug: "model-evaluation",
        title: "3.4. Metrics and scoring: quantifying the quality of predictions",
        orderIndex: 4,
        description: "Metrik kuantitatif evaluasi model: Accuracy, Precision, Recall, F1-score, ROC-AUC, Mean Squared Error, dan R2-score.",
        content_markdown: `# 3.4. Metrics and scoring: quantifying the quality of predictions

There are 3 different APIs for evaluating the quality of a model's predictions:
1. **Estimator score method**: Estimators have a \`score\` method providing a default evaluation criterion for the problem they are designed to solve.
2. **Scoring parameter**: Model-evaluation tools using cross-validation (such as \`model_selection.cross_val_score\` and \`model_selection.GridSearchCV\`) rely on an internal scoring strategy.
3. **Metric functions**: The \`sklearn.metrics\` module implements functions assessing prediction error for specific purposes.

### Metrik Klasifikasi Utama:
- **Precision**: $\\frac{TP}{TP + FP}$
- **Recall**: $\\frac{TP}{TP + FN}$
- **F1-Score**: $2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$
- **ROC AUC**: Luas area di bawah kurva Receiver Operating Characteristic.
`
      },
      {
        id: "sec-3-5-learning-curve",
        slug: "learning-curve",
        title: "3.5. Validation curves: plotting scores to evaluate models",
        orderIndex: 5,
        description: "Visualisasi kurva validasi dan kurva pembelajaran untuk menganalisis trade-off bias-varians dan kecukupan data latihan.",
        content_markdown: `# 3.5. Validation curves: plotting scores to evaluate models

To evaluate the performance of an estimator it is useful to measure the influence of a single hyperparameter or the training set size:
- \`validation_curve\`: Memetakan skor data latih dan data validasi terhadap variasi satu hyperparameter.
- \`learning_curve\`: Memetakan skor terhadap pertambahan jumlah data latihan untuk mendeteksi underfitting atau overfitting.
`
      }
    ]
  },

  // =========================================================================
  // 4. DATASET TRANSFORMATIONS & PIPELINES
  // =========================================================================
  {
    id: "sec-4-data-transforms",
    slug: "data-transforms",
    title: "4. Dataset transformations",
    orderIndex: 4,
    description: "Transformasi fitur, pra-pemrosesan data numerik dan kategorikal, imputasi nilai hilang, dan perakitan Pipeline Scikit-Learn.",
    subsections: [
      {
        id: "sec-4-1-compose",
        slug: "compose",
        title: "4.1. Pipelines and composite estimators",
        orderIndex: 1,
        description: "Membangun alur kerja pemrosesan data end-to-end yang bersih dan bebas data leakage menggunakan Pipeline dan ColumnTransformer.",
        content_markdown: `# 4.1. Pipelines and composite estimators

\`Pipeline\` can be used to chain multiple estimators into one. This is useful as there is often a fixed sequence of steps in processing the data, for example feature selection, normalization and classification.

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.decomposition import PCA

# Rangkaian Pipeline terpadu
pipe = Pipeline([
    ('reduce_dim', PCA(n_components=2)),
    ('classify', SVC())
])
\`\`\`

### ColumnTransformer for Heterogeneous Data
\`ColumnTransformer\` allows different columns of input data to be transformed separately, such as applying one-hot encoding to categorical features and standard scaling to numeric features.
`
      },
      {
        id: "sec-4-2-preprocessing",
        slug: "preprocessing",
        title: "4.2. Preprocessing data",
        orderIndex: 2,
        description: "Penskalaan fitur (StandardScaler, RobustScaler, MinMaxScaler), normalisasi vektor, dan diskritisasi numerik.",
        content_markdown: `# 4.2. Preprocessing data

The \`sklearn.preprocessing\` package provides several common utility functions and transformer classes to change raw feature vectors into a representation that is more suitable for downstream estimators:
- \`StandardScaler\`: Standardisasi fitur dengan menghapus rata-rata dan menskalakan ke unit varians:
  $$z = \\frac{x - \\mu}{\\sigma}$$
- \`RobustScaler\`: Penskalaan berbasis kuartil (median dan IQR) yang kebal terhadap pencilan (outliers).
- \`MinMaxScaler\`: Menskalakan data ke rentang target tetap $[0, 1]$.
`
      },
      {
        id: "sec-4-3-impute",
        slug: "impute",
        title: "4.3. Imputation of missing values",
        orderIndex: 3,
        description: "Penanganan nilai yang hilang (missing values) menggunakan SimpleImputer, IterativeImputer (MICE), dan KNNImputer.",
        content_markdown: `# 4.3. Imputation of missing values

For various reasons, many real world datasets contain missing values, often encoded as blanks, NaNs or other placeholders.

Estimators in Scikit-Learn:
- \`SimpleImputer\`: Imputasi dengan nilai mean, median, modus, atau konstanta.
- \`KNNImputer\`: Imputasi menggunakan rata-rata terbobot dari k-tetangga terdekat.
- \`IterativeImputer\`: Imputasi multivariat bertahap memodelkan setiap fitur sebagai fungsi dari fitur lainnya.
`
      }
    ]
  },

  // =========================================================================
  // 5. INSPECTION & VISUALIZATIONS
  // =========================================================================
  {
    id: "sec-5-inspection-visualizations",
    slug: "inspection-visualizations",
    title: "5. Inspection and Visualizations",
    orderIndex: 5,
    description: "Alat inspeksi transparansi model ML (Partial Dependence, Permutation Importance) dan visualisasi terpadu (Display objects).",
    subsections: [
      {
        id: "sec-5-1-partial-dependence",
        slug: "partial-dependence",
        title: "5.1. Partial Dependence and ICE plots",
        orderIndex: 1,
        description: "Memvisualisasikan pengaruh marginal satu atau dua fitur terhadap hasil prediksi target model.",
        content_markdown: `# 5.1. Partial Dependence and Individual Conditional Expectation plots

Partial dependence plots (PDP) and individual conditional expectation (ICE) plots can be used to visualize and analyze the interaction between the target response and a set of input features of interest:
- PDP menunjukkan efek rata-rata marginal fitur.
- ICE menunjukkan garis individual untuk setiap observasi data.
`
      },
      {
        id: "sec-5-2-permutation-importance",
        slug: "permutation-importance",
        title: "5.2. Permutation feature importance",
        orderIndex: 2,
        description: "Pengukuran kepentingan fitur model-agnostik dengan mengocok nilai fitur secara acak dan mengamati penurunan skor performa.",
        content_markdown: `# 5.2. Permutation feature importance

Permutation feature importance is a model inspection technique that can be used for any fitted estimator when the data is tabular. This is especially useful for non-linear or opaque estimators.

The permutation feature importance is defined to be the decrease in a model score when a single feature value is randomly shuffled.
`
      },
      {
        id: "sec-5-3-visualizations",
        slug: "visualizations",
        title: "5.3. Visualizations API",
        orderIndex: 3,
        description: "Objek visualisasi terpadu untuk evaluasi grafis: ConfusionMatrixDisplay, RocCurveDisplay, PrecisionRecallDisplay.",
        content_markdown: `# 5.3. Visualizations API

Scikit-learn defines a simple API for creating visualizations for machine learning. The key features of this API is to allow for quick plotting and visual adjustments without recalculating metrics.

Classes:
- \`ConfusionMatrixDisplay.from_estimator\`
- \`RocCurveDisplay.from_estimator\`
- \`PrecisionRecallDisplay.from_estimator\`
- \`PredictionErrorDisplay.from_estimator\`
`
      }
    ]
  },

  // =========================================================================
  // 6. DATASET LOADING UTILITIES
  // =========================================================================
  {
    id: "sec-6-datasets",
    slug: "datasets",
    title: "6. Dataset loading utilities",
    orderIndex: 6,
    description: "Pemuatan dataset standar bawaan (toy datasets), dataset dunia nyata (OpenML), dan generator dataset sintetis.",
    subsections: [
      {
        id: "sec-6-1-toy-datasets",
        slug: "toy-datasets",
        title: "6.1. Toy datasets",
        orderIndex: 1,
        description: "Dataset kecil bawaan Scikit-Learn untuk eksperimen cepat tanpa memerlukan unduhan jaringan eksternal.",
        content_markdown: `# 6.1. Toy datasets

Scikit-learn comes with a few small standard datasets that do not require to download any file from external websites:
- \`load_iris()\`: Dataset bunga Iris untuk klasifikasi 3 kelas.
- \`load_diabetes()\`: Dataset regresi target perkembangan diabetes.
- \`load_digits()\`: Dataset klasifikasi citra angka tulisan tangan 8x8.
- \`load_breast_cancer()\`: Dataset diagnosis tumor ganas/jinak.
- \`load_wine()\`: Dataset analisis kimiawi anggur.
`
      },
      {
        id: "sec-6-2-sample-generators",
        slug: "sample-generators",
        title: "6.2. Generated synthetic datasets",
        orderIndex: 2,
        description: "Fungsi generator dataset sintetis dengan parameter terkontrol untuk menguji algoritma ML.",
        content_markdown: `# 6.2. Generated synthetic datasets

Scikit-learn includes various random sample generators that can be used to build artificial datasets of controlled size and complexity:
- \`make_classification\`: Membuat data klasifikasi multikelas dengan fitur informatif dan redundan.
- \`make_regression\`: Membuat data regresi linear dengan derau Gaussian.
- \`make_blobs\`: Membuat kluster Gaussian isotropik untuk pengujian clustering.
- \`make_moons\` & \`make_circles\`: Membuat bentuk data 2D non-linear untuk menguji kernel methods.
`
      }
    ]
  },

  // =========================================================================
  // 7. COMPUTING & PRACTICES
  // =========================================================================
  {
    id: "sec-7-computing",
    slug: "computing",
    title: "7. Computing with scikit-learn",
    orderIndex: 7,
    description: "Strategi komputasi untuk dataset besar (out-of-core learning), eksekusi paralel (Joblib), dan praktik terbaik produksi.",
    subsections: [
      {
        id: "sec-7-1-scaling-strategies",
        slug: "scaling-strategies",
        title: "7.1. Scaling strategies: bigger data",
        orderIndex: 1,
        description: "Pembelajaran bertahap (incremental learning) menggunakan partial_fit untuk data yang melebihi kapasitas RAM komputer.",
        content_markdown: `# 7.1. Scaling strategies: bigger data

For instances where the full dataset does not fit into RAM, scikit-learn provides the \`partial_fit\` API to learn incrementally from minibatches of data.

Estimator yang mendukung \`partial_fit\`:
- Klasifikasi: \`SGDClassifier\`, \`Perceptron\`, \`MultinomialNB\`, \`BernoulliNB\`.
- Regresi: \`SGDRegressor\`, \`PassiveAggressiveRegressor\`.
- Clustering: \`MiniBatchKMeans\`.
- Reduksi Dimensi: \`IncrementalPCA\`.
`
      },
      {
        id: "sec-7-2-parallelism",
        slug: "parallelism",
        title: "7.2. Parallelism and resource management",
        orderIndex: 2,
        description: "Optimalisasi multi-threading dan multi-processing menggunakan pustaka Joblib dan parameter n_jobs.",
        content_markdown: `# 7.2. Parallelism and resource management

Scikit-learn uses \`joblib\` to parallelize tasks across multiple CPU cores via the \`n_jobs\` parameter:
- \`n_jobs=-1\`: Menggunakan seluruh core prosesor yang tersedia.
- Mendukung backend \`loky\` (proses terisolasi) dan \`threading\` (berbagi memori).
`
      },
      {
        id: "sec-7-3-common-pitfalls",
        slug: "common-pitfalls",
        title: "7.3. Common pitfalls and recommended practices",
        orderIndex: 3,
        description: "Pedoman pencegahan data leakage, pemisahan data uji sebelum pra-pemrosesan, dan reproduktibilitas hasil model.",
        content_markdown: `# 7.3. Common pitfalls and recommended practices

### 1. Data Leakage (Kebocoran Data)
Data leakage terjadi saat informasi dari data uji digunakan secara tidak sengaja untuk melatih model:
- **Solusi**: Selalu masukkan tahap preprocessing (\`StandardScaler\`, dll) ke dalam \`Pipeline\` agar penskalaan hanya dihitung dari data latih pada setiap fold cross-validation.

### 2. Random State Reproducibility
Tentukan parameter \`random_state\` pada estimator probabilistik atau proses pembagian data agar hasil eksperimen dapat direplikasi dengan konsisten.
`
      }
    ]
  }
];

/**
 * Mendapatkan seluruh daftar materi linear (flat) untuk navigasi berurutan.
 */
export function getAllFlatScikitLearnSections(): DocSectionItem[] {
  const flatList: DocSectionItem[] = [];

  for (const chapter of SCIKIT_LEARN_USER_GUIDE_SECTIONS) {
    if (chapter.subsections && chapter.subsections.length > 0) {
      for (const sub of chapter.subsections) {
        flatList.push({
          ...sub,
          parentTitle: chapter.title,
          chapterNumber: chapter.orderIndex,
        });
      }
    } else {
      flatList.push(chapter);
    }
  }

  return flatList;
}
