import { ChapterDef } from "./da-data-ch1-3";

export const ML_CHAPTERS_6_TO_7: ChapterDef[] = [
  // ==========================================
  // BAB 6: Support Vector Machines (SVM): Teori Margin Maksimal & Kernel Trick
  // ==========================================
  {
    orderIndex: 6,
    id: "machine-learning-ch-6",
    slug: "bab-6-support-vector-machines-svm-margin-maksimal-kernel-trick",
    title: "BAB 6: Support Vector Machines (SVM): Teori Margin Maksimal & Kernel Trick",
    desc: "Formulasi analitis dan geometris Support Vector Machines: konsep margin maksimal, formulasi primal hard-margin vs soft-margin dengan variabel slack, dualitas Lagrange dan kondisi KKT, Kernel Trick dan Teorema Mercer, fungsi kernel RBF/Gaussian, polinomial, Support Vector Regression (SVR) dengan tabung insensitif epsilon, serta kompleksitas algoritma Sequential Minimal Optimization (SMO).",
    coreConcepts: ["Maximum Margin Hyperplane", "Hard vs Soft Margin", "Slack Variables", "Lagrangian Duality & KKT Conditions", "Mercer Theorem & Kernel Trick", "RBF Kernel", "Support Vector Regression"],
    subchapters: [
      {
        num: "6.1",
        slug: "6-1-geometri-hyperplane-pemisah-margin-maksimal",
        title: "6.1. Geometri Hyperplane Pemisah dan Konsep Margin Maksimal (Maximum Margin)",
        desc: "Prinsip geometris separasi ruang: merumuskan hiperbidang linier w^T x + b = 0, jarak Euklides titik ke hiperbidang, dan definisi margin geometris.",
        concept: `Pada masalah klasifikasi biner yang dapat dipisahkan secara linier (*linearly separable*), terdapat tak terhingga banyaknya hiperbidang pemisah $\\mathbf{w}^\\top \\mathbf{x} + b = 0$ yang mampu memisahkan seluruh sampel kelas positif ($y_i = +1$) dan kelas negatif ($y_i = -1$) dengan akurasi latih 100%. Namun, sebagian besar hiperbidang tersebut melintas sangat dekat dengan titik-titik data tertentu, sehingga sangat rentan terhadap derau dan memiliki generalisasi yang buruk pada data baru.

Vladimir Vapnik dan Alexey Chervonenkis mengusulkan prinsip **Optimal Margin Hyperplane**: memilih satu hiperbidang pemisah tunggal yang memaksimalkan jarak terkecil (*margin*) ke titik observasi terdekat dari kedua kelas.

**Jarak Geometris ke Hiperbidang:**
Jarak tegak lurus Euklides dari suatu titik observasi $\\mathbf{x}_i$ ke hiperbidang $\\mathbf{w}^\\top \\mathbf{x} + b = 0$ dirumuskan sebagai:
$$\\gamma_i = \\frac{y_i (\\mathbf{w}^\\top \\mathbf{x}_i + b)}{\\|\\mathbf{w}\\|_2}$$

Margin geometris dari seluruh dataset adalah jarak terkecil ke titik terdekat:
$$\\gamma = \\min_{i=1, \\dots, n} \\gamma_i$$

Dengan memilih hiperbidang yang memaksimalkan $\\gamma$, kita meminimalkan batas atas galat generalisasi teoretis Vapnik. Titik-titik observasi yang berada tepat pada batas margin disebut **Support Vectors**, dan hanya titik-titik inilah yang menentukan posisi akhir dan orientasi hiperbidang pemisah.`,
        formula: `\\max_{\\mathbf{w}, b} \\gamma \\quad \\text{s.t.} \\quad \\frac{y_i (\\mathbf{w}^\\top \\mathbf{x}_i + b)}{\\|\\mathbf{w}\\|_2} \\ge \\gamma, \\quad \\forall i=1, \\dots, n`,
        code: `# 6.1: Menghitung Jarak Geometris Sampel ke Hiperbidang Pemisah Linier
import numpy as np
from sklearn.svm import SVC

# Sintesis data terpisah linier sempurna
X = np.array([[1.0, 2.0], [2.0, 3.0], [2.0, 1.0], [6.0, 5.0], [7.0, 7.0], [6.0, 8.0]])
y = np.array([-1, -1, -1, 1, 1, 1])

# Latih SVM Hard Margin (C sangat besar)
svm = SVC(kernel='linear', C=1e5)
svm.fit(X, y)

w = svm.coef_[0]
b = svm.intercept_[0]
norm_w = np.linalg.norm(w)

# Hitung jarak geometris setiap sampel ke bidang w^T x + b = 0
jarak_geometris = y * (X.dot(w) + b) / norm_w
margin_lebar = np.min(jarak_geometris)

print("=== GEOMETRI HIPERBIDANG MARGIN MAKSIMAL ===")
print(f"Vektor Bobot Normal w : [{w[0]:.4f}, {w[1]:.4f}]")
print(f"Intersep Bias b       : {b:.4f}")
print(f"Lebar Margin Geometris: {margin_lebar:.4f} (Ekuivalen dengan 1/||w|| = {1.0/norm_w:.4f})")
print(f"Indeks Support Vectors: {svm.support_} (Titik penentu batas keputusan)")`,
        expectedOutput: "Lebar margin geometris terhitung tepat sama dengan 1/||w|| dan support vectors diidentifikasi pada indeks titik terdekat.",
        codeExp: "Skrip menghitung jarak Euklides dari setiap observasi ke hiperbidang pemisah linier yang dioptimasi oleh SVM, membuktikan bahwa margin geometris sama dengan 1/||w||.",
        pitfalls: [
          "Lupa menstandarisasi fitur sebelum menjalankan SVM; jika salah satu fitur berskala besar, jarak Euklides akan terdistorsi dan hiperbidang menjadi miring secara artifisial.",
          "Mengira seluruh sampel memengaruhi posisi hiperbidang SVM (hanya support vectors yang berpengaruh)."
        ],
        refTitle: "Corinna Cortes & Vladimir Vapnik: Support-Vector Networks (Machine Learning, Springer)",
        refUrl: "https://link.springer.com/article/10.1007/BF00994018"
      },
      {
        num: "6.2",
        slug: "6-2-formulasi-primal-svm-hard-margin",
        title: "6.2. Formulasi Primal SVM Margin Keras (Hard Margin) untuk Data Terpisah Linear",
        desc: "Transformasi masalah optimasi: konversi maksimisasi margin geometris menjadi minimisasi norma kuadratik cembung berbatas kendala linier.",
        concept: `Untuk mengubah masalah maksimisasi margin geometris $\\max \\frac{1}{\\|\\mathbf{w}\\|}$ menjadi masalah optimasi numerik yang efisien, kita dapat menetapkan skala fungsional margin arbitrer dari support vectors terdekat tepat sama dengan satu:
$$y_i (\\mathbf{w}^\\top \\mathbf{x}_i + b) \\ge 1, \\quad \\forall i=1, \\dots, n$$

Di bawah penskalaan kanonikal ini, jarak margin geometris dari support vectors ke hiperbidang menjadi:
$$\\gamma = \\frac{1}{\\|\\mathbf{w}\\|_2}$$

Sehingga, memaksimalkan $\\frac{1}{\\|\\mathbf{w}\\|_2}$ ekuivalen secara matematis dengan meminimalkan kuadrat norma $\\frac{1}{2}\\|\\mathbf{w}\\|_2^2$. Ini menghasilkan **Formulasi Primal SVM Margin Keras (Hard-Margin Primal Problem)**:
$$\\min_{\\mathbf{w}, b} \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 = \\min_{\\mathbf{w}, b} \\frac{1}{2} \\mathbf{w}^\\top \\mathbf{w}$$
$$\\text{dengan kendala pertidaksamaan: } y_i (\\mathbf{w}^\\top \\mathbf{x}_i + b) \\ge 1, \\quad \\forall i=1, \\dots, n$$

**Karakteristik Masalah Primal:**
1. Fungsi objektif bersifat **kuadratik cembung ketat** (*strictly convex quadratic*).
2. Ruang kendala dibentuk oleh perpotongan bidang linier tertutup (*polyhedral convex set*).
3. Bentuk ini menjamin bahwa masalah optimasi memiliki **solusi minimum global tunggal yang unik**, tanpa ada risiko terjebak di minimum lokal. Masalah ini dapat diselesaikan menggunakan teknik Quadratic Programming (QP).`,
        formula: `\\min_{\\mathbf{w}, b} \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 \\quad \\text{s.t.} \\quad 1 - y_i(\\mathbf{w}^\\top \\mathbf{x}_i + b) \\le 0, \\quad i=1, \\dots, n`,
        code: `# 6.2: Menyelesaikan Hard-Margin SVM Primal Menggunakan Quadratic Programming (scipy.optimize)
import numpy as np
from scipy.optimize import minimize

X = np.array([[2.0, 3.0], [1.0, 1.0], [2.0, 0.5], [6.0, 7.0], [7.0, 8.0], [6.0, 9.0]])
y = np.array([-1.0, -1.0, -1.0, 1.0, 1.0, 1.0])
n_samples, n_features = X.shape

# Vektor parameter gabungan theta = [w1, w2, b]
def objective(theta):
    w = theta[:n_features]
    return 0.5 * np.dot(w, w)

def constraint_margin(theta):
    w = theta[:n_features]
    b = theta[n_features]
    # Kendala: y_i * (w^T x_i + b) - 1 >= 0
    return y * (X.dot(w) + b) - 1.0

init_theta = np.zeros(n_features + 1)
res = minimize(objective, init_theta, constraints={'type': 'ineq', 'fun': constraint_margin}, method='SLSQP')

w_opt = res.x[:n_features]
b_opt = res.x[n_features]

print("=== HASIL OPTIMASI PRIMAL HARD-MARGIN SVM ===")
print(f"Bobot Optimal w : [{w_opt[0]:.4f}, {w_opt[1]:.4f}]")
print(f"Intersep Bias b : {b_opt:.4f}")
print(f"Status Konvergen: {res.success} (Nilai Objektif Minimum = {res.fun:.4f})")`,
        expectedOutput: "Solusi SLSQP konvergen memenuhi seluruh kendala margin dan menghasilkan vektor bobot optimal.",
        codeExp: "Skrip menyelesaikan masalah optimasi konveks Quadratic Programming formulasi primal Hard Margin SVM secara langsung menggunakan solver SLSQP SciPy.",
        pitfalls: [
          "Menerapkan Hard Margin SVM pada dataset yang memiliki tumpang tindih kelas (non-separable), yang menyebabkan solver gagal menemukan solusi layak (infeasible problem).",
          "Mengabaikan penanganan outlier pada Hard Margin yang dapat membuat margin menyusut drastis hanya karena satu titik observasi ekstrem."
        ],
        refTitle: "Nello Cristianini & John Shawe-Taylor: An Introduction to Support Vector Machines (Cambridge University Press)",
        refUrl: "https://www.cambridge.org/core/books/an-introduction-to-support-vector-machines/917C5B09988D4D65D8F0BF9B2D8C3729"
      },
      {
        num: "6.3",
        slug: "6-3-svm-soft-margin-slack-variables-penalti-c",
        title: "6.3. SVM Margin Lunak (Soft Margin): Variabel Slack ($\\xi_i$) dan Penalti $C$",
        desc: "Relaksasi kendala Vapnik: memasukkan toleransi kesalahan variabel slack xi_i dan hiperparameter regularisasi C untuk data berderau.",
        concept: `Dalam data dunia nyata, kelas hampir tidak pernah terpisah secara linier sempurna karena adanya derau sensor, tumpang tindih alami antar-kelas (*class overlap*), atau label anomali. Hard-Margin SVM akan gagal total dalam skenario ini.

Cortes dan Vapnik (1995) memperluas SVM dengan merumuskan **Soft-Margin SVM**, yang mengizinkan beberapa sampel data melanggar margin atau bahkan salah diklasifikasikan dengan memperkenalkan **Variabel Slack** (Slack Variables $\\xi_i \\ge 0$):
$$y_i (\\mathbf{w}^\\top \\mathbf{x}_i + b) \\ge 1 - \\xi_i, \\quad \\forall i=1, \\dots, n$$

**Interpretasi Nilai Slack $\\xi_i$:**
- $\\xi_i = 0$: Observasi berada tepat pada atau di luar batas margin yang benar (tidak ada pelanggaran).
- $0 < \\xi_i \\le 1$: Observasi berada di dalam zona margin, namun masih berada pada sisi batas keputusan yang benar.
- $\\xi_i > 1$: Observasi melanggar batas keputusan dan **salah diklasifikasikan** (*misclassified*).

**Formulasi Optimasi Soft-Margin Primal:**
$$\\min_{\\mathbf{w}, b, \\boldsymbol{\\xi}} \\left\\{ \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 + C \\sum_{i=1}^n \\xi_i \\right\\}$$
$$\\text{s.t.} \\quad y_i (\\mathbf{w}^\\top \\mathbf{x}_i + b) \\ge 1 - \\xi_i \\quad \\text{dan} \\quad \\xi_i \\ge 0, \\quad \\forall i$$

Parameter $C > 0$ bertindak sebagai penyeimbang (*trade-off parameter*):
- Jika $C$ sangat besar: Model menghukum setiap pelanggaran slack secara berat, menghasilkan margin sempit (*hard margin*) yang rentan overfitting.
- Jika $C$ kecil: Model lebih toleran terhadap pelanggaran margin demi menghasilkan margin yang lebih lebar (*soft margin*), meningkatkan ketahanan terhadap derau acak.`,
        formula: `\\min_{\\mathbf{w}, b, \\boldsymbol{\\xi}} \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 + C \\sum_{i=1}^n \\xi_i \\quad \\text{s.t.} \\quad y_i(\\mathbf{w}^\\top \\mathbf{x}_i + b) \\ge 1 - \\xi_i, \\quad \\xi_i \\ge 0`,
        code: `# 6.3: Eksperimen Dampak Penalti Slack C pada Data yang Tumpang Tindih
import numpy as np
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

np.random.seed(42)
# Data 2 kelas dengan tumpang tindih (overlap) moderat
X_pos = np.random.normal(loc=[3.0, 3.0], scale=1.5, size=(50, 2))
X_neg = np.random.normal(loc=[1.5, 1.5], scale=1.5, size=(50, 2))
X = np.vstack([X_pos, X_neg])
y = np.array([1]*50 + [-1]*50)

c_candidates = [0.01, 1.0, 100.0]
print("=== PENGARUH PENALTI SLACK C PADA SOFT-MARGIN SVM ===")
for c_val in c_candidates:
    clf = SVC(kernel='linear', C=c_val, random_state=42).fit(X, y)
    n_sv = len(clf.support_)
    norm_w = np.linalg.norm(clf.coef_)
    margin = 1.0 / norm_w
    acc = accuracy_score(y, clf.predict(X))
    print(f"C = {c_val:6.2f} -> Margin: {margin:6.4f} | Jumlah Support Vectors: {n_sv:2d}/100 | Akurasi: {acc*100:5.1f}%")`,
        expectedOutput: "Nilai C kecil (0.01) menghasilkan margin lebar dengan banyak support vectors toleran, sedangkan C besar (100) mempersempit margin.",
        codeExp: "Skrip mengevaluasi pengaruh variasi nilai penalti C terhadap lebar margin geometris dan jumlah support vectors pada dataset yang memiliki tumpang tindih alami.",
        pitfalls: [
          "Mengira variabel slack xi_i bernilai negatif saat prediksi benar; slack selalu non-negatif (xi >= 0).",
          "Menyetel C terlalu besar pada data yang kotor berderau, yang memaksa model membentuk batas keputusan berliku-liku yang overfit."
        ],
        refTitle: "Corinna Cortes & Vladimir Vapnik: Support-Vector Networks (Machine Learning, Springer)",
        refUrl: "https://link.springer.com/article/10.1007/BF00994018"
      },
      {
        num: "6.4",
        slug: "6-4-formulasi-dual-lagrange-dan-kondisi-kkt",
        title: "6.4. Formulasi Dual Lagrange dan Kondisi Karush-Kuhn-Tucker (KKT)",
        desc: "Penurunan teoretis Dualitas Lagrange: fungsi Lagrange, eliminasi parameter primal, dan teorema komplemen Karush-Kuhn-Tucker.",
        concept: `Formulasi Primal SVM beroperasi pada ruang parameter fitur $\\mathbf{w} \\in \\mathbb{R}^d$. Untuk memungkinkan penanganan ruang fitur berdimensi tak hingga (melalui Kernel Trick), kita mentranslasikan masalah primal ke dalam **Formulasi Dual Lagrange**.

**1. Pembentukan Fungsi Lagrange Primal:**
Dengan memperkenalkan pengali Lagrange (*Lagrange Multipliers*) $\\alpha_i \\ge 0$ untuk kendala margin dan $\\mu_i \\ge 0$ untuk kendala non-negatif slack:
$$\\mathcal{L}(\\mathbf{w}, b, \\boldsymbol{\\xi}, \\boldsymbol{\\alpha}, \\boldsymbol{\\mu}) = \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 + C \\sum_{i=1}^n \\xi_i - \\sum_{i=1}^n \\alpha_i \\left[ y_i (\\mathbf{w}^\\top \\mathbf{x}_i + b) - 1 + \\xi_i \\right] - \\sum_{i=1}^n \\mu_i \\xi_i$$

**2. Kondisi Stasioneritas:**
Dengan menyamakan turunan parsial terhadap variabel primal $(\\mathbf{w}, b, \\xi_i)$ ke nol:
- $\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{w}} = \\mathbf{0} \\implies \\mathbf{w} = \\sum_{i=1}^n \\alpha_i y_i \\mathbf{x}_i$ (Vektor bobot adalah kombinasi linier dari sampel latih!)
- $\\frac{\\partial \\mathcal{L}}{\\partial b} = 0 \\implies \\sum_{i=1}^n \\alpha_i y_i = 0$
- $\\frac{\\partial \\mathcal{L}}{\\partial \\xi_i} = 0 \\implies C - \\alpha_i - \\mu_i = 0 \\implies 0 \\le \\alpha_i \\le C$

**3. Formulasi Dual Wolf:**
Substitusi hasil di atas kembali ke fungsi Lagrange mengeliminasi variabel primal, menghasilkan masalah Dual:
$$\\max_{\\boldsymbol{\\alpha}} \\left\\{ \\sum_{i=1}^n \\alpha_i - \\frac{1}{2} \\sum_{i=1}^n \\sum_{j=1}^n \\alpha_i \\alpha_j y_i y_j (\\mathbf{x}_i^\\top \\mathbf{x}_j) \\right\\}$$
$$\\text{s.t.} \\quad 0 \\le \\alpha_i \\le C, \\quad \\forall i=1, \\dots, n \\quad \\text{dan} \\quad \\sum_{i=1}^n \\alpha_i y_i = 0$$

**Kondisi KKT (Karush-Kuhn-Tucker Complementary Slackness):**
$$\\alpha_i \\left[ y_i (\\mathbf{w}^\\top \\mathbf{x}_i + b) - 1 + \\xi_i \\right] = 0$$
- Jika $\\alpha_i = 0$: Titik $\\mathbf{x}_i$ berada di luar margin dan **tidak berpengaruh sama sekali** pada model.
- Jika $0 < \\alpha_i < C$: Titik $\\mathbf{x}_i$ adalah **Support Vector bebas** yang berada tepat di batas margin ($\\xi_i = 0$), digunakan untuk menghitung nilai intersep $b$.
- Jika $\\alpha_i = C$: Titik $\\mathbf{x}_i$ adalah **Support Vector terikat** yang melanggar margin ($\\xi_i > 0$).`,
        formula: `\\mathbf{w} = \\sum_{i=1}^n \\alpha_i y_i \\mathbf{x}_i, \\quad f(\\mathbf{x}) = \\sum_{i \\in \\text{SV}} \\alpha_i y_i (\\mathbf{x}_i^\\top \\mathbf{x}) + b`,
        code: `# 6.4: Inspeksi Nilai Pengali Dual Lagrange (alpha) pada Support Vectors
import numpy as np
from sklearn.svm import SVC

X = np.array([[2.0, 3.0], [1.0, 1.0], [2.0, 0.5], [6.0, 7.0], [7.0, 8.0], [6.0, 9.0]])
y = np.array([-1, -1, -1, 1, 1, 1])

clf = SVC(kernel='linear', C=1.0).fit(X, y)

# Parameter dual terpelajar: dual_coef_ = alpha_i * y_i
dual_coefs = clf.dual_coef_[0]
support_indices = clf.support_
alphas = np.abs(dual_coefs)

# Rekonstruksi bobot primal w dari representasi dual: w = sum(alpha_i * y_i * x_i)
w_reconstructed = np.zeros(X.shape[1])
for a_i_y_i, idx in zip(dual_coefs, support_indices):
    w_reconstructed += a_i_y_i * X[idx]

print("=== VERIFIKASI DUALITAS LAGRANGE SVM ===")
print("Indeks Support Vectors Terpilih:", support_indices)
print("Nilai Pengali Lagrange (alpha) :", alphas.round(4))
print(f"Bobot Primal (clf.coef_)      : {clf.coef_[0].round(4)}")
print(f"Bobot Rekonstruksi Dual       : {w_reconstructed.round(4)}")
print(f"Selisih Primal vs Dual        : {np.max(np.abs(clf.coef_[0] - w_reconstructed)):.2e} (Ekuivalensi Sempurna)")`,
        expectedOutput: "Bobot rekonstruksi dari representasi dual Lagrange identik sempurna dengan bobot primal model.",
        codeExp: "Skrip memverifikasi teorema dualitas Lagrange dengan merekonstruksi vektor bobot primal dari kombinasi linier pengali Lagrange dual alpha_i dan support vectors.",
        pitfalls: [
          "Mengira seluruh sampel data memiliki pengali Lagrange non-nol; sebagian besar sampel bukan support vectors sehingga alpha_i = 0.",
          "Mencoba menghitung w secara eksplisit saat menggunakan kernel berdimensi tak terhingga (seperti RBF), di mana representasi dual wajib dipertahankan."
        ],
        refTitle: "Stephen Boyd & Lieven Vandenberghe: Convex Optimization (Chapter 5: Duality)",
        refUrl: "https://web.stanford.edu/~boyd/cvxbook/"
      },
      {
        num: "6.5",
        slug: "6-5-kernel-trick-dan-teorema-mercer",
        title: "6.5. Kernel Trick & Teorema Mercer: Memetakan ke Ruang Berdimensi Tinggi Tanpa Komputasi Eksplisit",
        desc: "Prinsip komputasi fungsi kernel: menghitung hasil kali titik di ruang fitur tak hingga tanpa transformasi koordinat langsung berbasis Teorema Mercer.",
        concept: `Pada formulasi dual SVM yang diturunkan pada subbab sebelumnya:
$$\\max_{\\boldsymbol{\\alpha}} \\sum_{i=1}^n \\alpha_i - \\frac{1}{2} \\sum_{i=1}^n \\sum_{j=1}^n \\alpha_i \\alpha_j y_i y_j (\\mathbf{x}_i^\\top \\mathbf{x}_j)$$
Perhatikan satu fakta komputasi yang sangat krusial: **vektor fitur masukan hanya muncul dalam bentuk operasi hasil kali titik (dot product / inner product)** $(\\mathbf{x}_i^\\top \\mathbf{x}_j)$.

Jika data asli pada ruang masukan $\\mathbb{R}^d$ tidak dapat dipisahkan secara linier, kita dapat memetakannya ke dalam ruang fitur berdimensi lebih tinggi (bahkan tak terhingga) $\\mathcal{H}$ menggunakan fungsi pemetaan non-linier $\\phi(\\mathbf{x})$. Berdasarkan **Teorema Cover (1965)**, data yang tidak terpisah linier dalam ruang berdimensi rendah memiliki probabilitas sangat tinggi untuk menjadi terpisah linier jika dipetakan ke ruang berdimensi cukup tinggi.

Namun, menghitung koordinat $\\phi(\\mathbf{x})$ secara eksplisit sangat mahal atau bahkan mustahil jika dimensinya tak terhingga. Di sinilah **Kernel Trick** bekerja:
Fungsi kernel $K(\\mathbf{x}_i, \\mathbf{x}_j)$ adalah fungsi skalar yang menghitung hasil kali titik langsung di ruang fitur $\\mathcal{H}$ tanpa pernah menghitung koordinat $\\phi(\\mathbf{x})$ secara eksplisit:
$$K(\\mathbf{x}_i, \\mathbf{x}_j) = \\langle \\phi(\\mathbf{x}_i), \\phi(\\mathbf{x}_j) \\rangle_{\\mathcal{H}}$$

**Teorema Mercer:**
Suatu fungsi simetris $K(\\mathbf{x}, \\mathbf{z})$ adalah fungsi kernel yang valid (merepresentasikan hasil kali titik dalam suatu ruang Hilbert $\\mathcal{H}$) jika dan hanya jika **Matriks Gram Kernel** $\\mathbf{K}_{ij} = K(\\mathbf{x}_i, \\mathbf{x}_j)$ bersifat **Semidefinit Positif** (*Positive Semi-Definite - PSD*) untuk setiap himpunan titik observasi:
$$\\mathbf{c}^\\top \\mathbf{K} \\mathbf{c} \\ge 0, \\quad \\forall \\mathbf{c} \\in \\mathbb{R}^n$$`,
        formula: `K(\\mathbf{x}_i, \\mathbf{x}_j) = \\phi(\\mathbf{x}_i)^\\top \\phi(\\mathbf{x}_j) \\implies f(\\mathbf{x}) = \\sum_{i \\in \\text{SV}} \\alpha_i y_i K(\\mathbf{x}_i, \\mathbf{x}) + b`,
        code: `# 6.5: Demonstrasi Kernel Trick: Pemetaan Polinomial Implisit vs Eksplisit
import numpy as np

# 2 vektor masukan 2-dimensi
x = np.array([2.0, 3.0])
z = np.array([4.0, 1.0])

# METODE 1: Komputasi Eksplisit phi(x) ke Ruang Derajat 2
# phi(x) = [x1^2, sqrt(2)*x1*x2, x2^2]
phi_x = np.array([x[0]**2, np.sqrt(2) * x[0] * x[1], x[1]**2])
phi_z = np.array([z[0]**2, np.sqrt(2) * z[0] * z[1], z[1]**2])
dot_eksplisit = np.dot(phi_x, phi_z)

# METODE 2: Kernel Trick Homogen K(x, z) = (x^T z)^2 (Tanpa Transformasi Eksplisit)
kernel_trick = (np.dot(x, z)) ** 2

print("=== VERIFIKASI KERNEL TRICK ===")
print(f"Vektor Eksplisit phi(x)   : {phi_x.round(4)}")
print(f"Hasil Kali Titik Eksplisit: {dot_eksplisit:.4f}")
print(f"Hasil Kernel Trick K(x, z): {kernel_trick:.4f}")
print(f"Selisih Komputasi         : {abs(dot_eksplisit - kernel_trick):.2e} (Ekuivalen Mutlak!)")`,
        expectedOutput: "Hasil kali titik eksplisit pada ruang dimensi tinggi identik sempurna dengan komputasi skalar kernel trick.",
        codeExp: "Skrip membuktikan kesetaraan aljabar antara hasil kali titik eksplisit dalam ruang fitur berdimensi tinggi dan komputasi skalar murah menggunakan fungsi kernel polinomial.",
        pitfalls: [
          "Menggunakan fungsi kernel kustom yang tidak memenuhi syarat Teorema Mercer (matriks Gram tidak semidefinit positif), yang menyebabkan optimasi QP divergen.",
          "Mengira fungsi kernel memindahkan posisi titik data di memori; kernel hanya menghitung nilai kesamaan skalar (similarity score)."
        ],
        refTitle: "James Mercer: Functions of positive and negative type, and their connection with the theory of integral equations (Phil. Trans. R. Soc.)",
        refUrl: "https://royalsocietypublishing.org/doi/10.1098/rsta.1909.0016"
      },
      {
        num: "6.6",
        slug: "6-6-kernel-rbf-gaussian-dan-parameter-gamma",
        title: "6.6. Kernel Radial Basis Function (RBF / Gaussian Kernel) dan Parameter Gamma ($\\gamma$)",
        desc: "Karakterisasi kernel universal: pemetaan ke ruang Hilbert berdimensi tak terhingga via ekspansi deret Taylor dan penalaan parameter gamma.",
        concept: `Fungsi kernel paling populer, serbaguna, dan menjadi default dalam pustaka Scikit-Learn adalah **Radial Basis Function (RBF)** atau **Kernel Gaussian**:
$$K_{\\text{RBF}}(\\mathbf{x}_i, \\mathbf{x}_j) = \\exp\\left( -\\gamma \\|\\mathbf{x}_i - \\mathbf{x}_j\\|_2^2 \\right) = \\exp\\left( -\\frac{\\|\\mathbf{x}_i - \\mathbf{x}_j\\|_2^2}{2\\sigma^2} \\right)$$
di mana $\\gamma = \\frac{1}{2\\sigma^2}$ mengontrol lebar kurva lonceng Gaussian.

**Mengapa Kernel RBF Berdimensi Tak Hingga?**
Dengan menggunakan ekspansi deret Taylor fungsi eksponensial $e^u = \\sum_{k=0}^\\infty \\frac{u^k}{k!}$:
$$\\exp(\\mathbf{x}^\\top \\mathbf{z}) = 1 + \\mathbf{x}^\\top \\mathbf{z} + \\frac{(\\mathbf{x}^\\top \\mathbf{z})^2}{2!} + \\frac{(\\mathbf{x}^\\top \\mathbf{z})^3}{3!} + \\dots$$
Persamaan ini membuktikan bahwa Kernel RBF secara implisit memetakan data ke dalam ruang Hilbert berdimensi **tak terhingga** (memuat seluruh interaksi polinomial dari derajat 0 hingga tak terhingga).

**Dinamika Parameter Gamma ($\\gamma$):**
- **$\\gamma$ Sangat Kecil ($\\gamma \\to 0$):** Kurva Gaussian sangat lebar dan datar. Pengaruh setiap support vector menjangkau radius yang sangat luas. Batas keputusan mendekati linier datar. Rentan **Underfitting (High Bias)**.
- **$\\gamma$ Sangat Besar ($\\gamma \\to \\infty$):** Kurva Gaussian sangat sempit dan tajam. Setiap support vector hanya memengaruhi area kecil di sekeliling dirinya sendiri, membentuk pulau-pulau batas keputusan yang terisolasi di sekitar masing-masing titik latih. Rentan **Overfitting Ekstrem (High Variance)**.`,
        formula: `K_{\\text{RBF}}(\\mathbf{x}, \\mathbf{z}) = \\exp(-\\gamma \\|\\mathbf{x} - \\mathbf{z}\\|^2), \\quad \\gamma = \\frac{1}{2\\sigma^2}`,
        code: `# 6.6: Pengaruh Hiperparameter Gamma pada Kompleksitas Batas Keputusan RBF SVM
import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import make_moons

X, y = make_moons(n_samples=100, noise=0.2, random_state=42)

gamma_settings = [0.1, 1.0, 10.0]
print("=== ANALISIS HIPERPARAMETER GAMMA KERNEL RBF ===")
for g in gamma_settings:
    clf = SVC(kernel='rbf', gamma=g, C=1.0, random_state=42).fit(X, y)
    n_sv = len(clf.support_)
    acc = clf.score(X, y)
    status = "Margin Mulus (Fleksibilitas Rendah)" if g == 0.1 else ("Optimal Seimbang" if g == 1.0 else "Kepulauan Ketat (Overfitting)")
    print(f"Gamma = {g:5.1f} -> Support Vectors: {n_sv:2d}/100 | Akurasi Latih: {acc*100:5.1f}% | {status}")`,
        expectedOutput: "Gamma rendah menghasilkan batas mulus sedangkan gamma tinggi (10.0) menghasilkan akurasi latih 98% namun batas keputusan berpulau-pulau.",
        codeExp: "Skrip menunjukkan bagaimana peningkatan nilai gamma mempersempit radius pengaruh support vectors RBF, meningkatkan fleksibilitas model hingga titik overfitting.",
        pitfalls: [
          "Membiarkan gamma bernilai default tanpa penskalaan fitur; formula gamma='scale' (1 / (n_features * X.var())) wajib digunakan untuk menstabilkan varians.",
          "Menaikkan C dan gamma secara bersamaan ke nilai yang sangat tinggi, yang hampir pasti memicu overfitting masif."
        ],
        refTitle: "Ingo Steinwart: On the Influence of the Kernel on the Consistency of Support Vector Machines (JMLR)",
        refUrl: "https://www.jmlr.org/papers/v2/steinwart02a.html"
      },
      {
        num: "6.7",
        slug: "6-7-kernel-polinomial-dan-kernel-sigmoid",
        title: "6.7. Kernel Polinomial dan Kernel Sigmoid",
        desc: "Keluarga kernel alternatif: formulasi kernel polinomial non-homogen dan batas validitas Teorema Mercer pada kernel sigmoid neural network.",
        concept: `Selain kernel RBF, dua fungsi kernel klasik yang sering digunakan dalam literatur machine learning adalah Kernel Polinomial dan Kernel Sigmoid:

**1. Kernel Polinomial (Polynomial Kernel):**
Memodelkan interaksi derajat berhingga antarfitur:
$$K_{\\text{poly}}(\\mathbf{x}_i, \\mathbf{x}_j) = (\\gamma \\mathbf{x}_i^\\top \\mathbf{x}_j + r)^d$$
di mana:
- $d$ adalah derajat polinomial (` + "`degree`" + `).
- $r$ adalah koefisien suku bebas (` + "`coef0`" + `) yang mengontrol pengaruh interaksi berorde tinggi terhadap interaksi berorde rendah. Jika $r = 0$, kernel disebut *homogen*; jika $r > 0$, kernel disebut *non-homogen*.
Kernel polinomial sangat populer dalam pemrosesan bahasa alami (NLP) dan bioinformatika (analisis sekuens DNA/asam amino) di mana interaksi pasangan kata atau kodon sangat penting.

**2. Kernel Sigmoid (Hyperbolic Tangent Kernel):**
$$K_{\\text{sigmoid}}(\\mathbf{x}_i, \\mathbf{x}_j) = \\tanh(\\gamma \\mathbf{x}_i^\\top \\mathbf{x}_j + r)$$
Kernel ini dirancang untuk meniru fungsi aktivasi multilayer perceptron (jaringan saraf tiruan) dua lapis. Namun, Kernel Sigmoid memiliki sifat matematis yang unik: **ia tidak selalu memenuhi Teorema Mercer**. Matriks Gram yang dihasilkan hanya semidefinit positif untuk pasangan nilai $\\gamma$ dan $r$ tertentu, sehingga jika parameternya tidak disetel dengan cermat, optimasi dapat berperilaku tidak menentu.`,
        formula: `K_{\\text{poly}}(\\mathbf{x}, \\mathbf{z}) = (\\gamma \\mathbf{x}^\\top \\mathbf{z} + r)^d, \\quad K_{\\text{sigmoid}}(\\mathbf{x}, \\mathbf{z}) = \\tanh(\\gamma \\mathbf{x}^\\top \\mathbf{z} + r)`,
        code: `# 6.7: Perbandingan Klasifikasi Kernel Polinomial vs Sigmoid pada Dataset Sintetis
import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import make_circles

X, y = make_circles(n_samples=200, factor=0.5, noise=0.1, random_state=42)

# 1. Kernel Polinomial Derajat 2 (Ideal untuk Struktur Lingkaran Konsentris)
clf_poly = SVC(kernel='poly', degree=2, coef0=1.0, C=1.0).fit(X, y)

# 2. Kernel Sigmoid (Aproksimasi Multilayer Perceptron)
clf_sig = SVC(kernel='sigmoid', gamma='scale', coef0=0.0, C=1.0).fit(X, y)

print("=== PERBANDINGAN KERNEL POLINOMIAL VS SIGMOID ===")
print(f"Akurasi Kernel Polinomial (d=2): {clf_poly.score(X, y)*100:.2f}% (Batas Kuadratik Menangkap Lingkaran)")
print(f"Akurasi Kernel Sigmoid         : {clf_sig.score(X, y)*100:.2f}% (Batas Non-Mercer Kurang Stabil)")`,
        expectedOutput: "Kernel Polinomial derajat 2 memecahkan struktur konsentris lingkaran dengan akurasi 100%, sementara sigmoid berkinerja lebih rendah.",
        codeExp: "Skrip membandingkan performa klasifikasi antara Kernel Polinomial derajat 2 non-homogen dan Kernel Sigmoid pada dataset lingkaran konsentris non-linier.",
        pitfalls: [
          "Memilih derajat polinomial degree > 5 yang memicu masalah numerik overflow dan pemborosan waktu komputasi.",
          "Menggunakan kernel sigmoid tanpa menala coef0, yang menghasilkan prediksi seragam untuk seluruh sampel."
        ],
        refTitle: "Chih-Wei Hsu & Chih-Jen Lin: A Simple Decomposition Method for Support Vector Machines (IEEE Transactions)",
        refUrl: "https://ieeexplore.ieee.org/document/993198"
      },
      {
        num: "6.8",
        slug: "6-8-support-vector-regression-svr-tabung-insensitif-epsilon",
        title: "6.8. Support Vector Regression (SVR): Tabung Insensitif Epsilon ($\\epsilon$-Insensitive Tube)",
        desc: "Ekstensi SVM untuk regresi kontinu: fungsi kerugian Vapnik epsilon-insensitive, penolakan deviasi kecil, dan vektor pendukung tepi tabung.",
        concept: `Prinsip margin maksimal SVM dapat diperluas untuk tugas regresi kontinu melalui **Support Vector Regression (SVR)** yang dirumuskan oleh Vladimir Vapnik.

Berbeda dari regresi linier OLS yang menghukum deviasi residual sekecil apa pun, SVR memperkenalkan konsep **Tabung Insensitif Epsilon ($\\epsilon$-Insensitive Tube)** di sekitar fungsi prediksi:
$$|y_i - f(\\mathbf{x}_i)| \\le \\epsilon$$

**Fungsi Kerugian $\\epsilon$-Insensitive:**
$$\\ell_\\epsilon(y, f(\\mathbf{x})) = \\begin{cases} 0 & \\text{jika } |y - f(\\mathbf{x})| \\le \\epsilon \\\\ |y - f(\\mathbf{x})| - \\epsilon & \\text{jika } |y - f(\\mathbf{x})| > \\epsilon \\end{cases}$$

Artinya:
- Setiap titik observasi yang berada **di dalam tabung** dengan toleransi $\\pm \\epsilon$ dianggap memiliki galat **tepat nol** dan tidak memerlukan penalti.
- Hanya titik-titik data yang berada **di luar tabung** yang berkontribusi terhadap penalti dan bertindak sebagai **Support Vectors**.

**Formulasi Optimasi SVR Primal:**
$$\\min_{\\mathbf{w}, b, \\boldsymbol{\\xi}, \\boldsymbol{\\xi}^*} \\left\\{ \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 + C \\sum_{i=1}^n (\\xi_i + \\xi_i^*) \\right\\}$$
$$\\text{s.t.} \\quad \\begin{cases} y_i - (\\mathbf{w}^\\top \\mathbf{x}_i + b) \\le \\epsilon + \\xi_i \\\\ (\\mathbf{w}^\\top \\mathbf{x}_i + b) - y_i \\le \\epsilon + \\xi_i^* \\\\ \\xi_i, \\xi_i^* \\ge 0 \\end{cases}$$

Parameter $\\epsilon$ mengontrol kekokohan (*sparsity*) model: semakin besar $\\epsilon$, semakin lebar tabung toleransi, semakin sedikit jumlah support vectors yang dibutuhkan, dan semakin tahan model terhadap derau frekuensi tinggi.`,
        formula: `\\ell_\\epsilon(y, f(x)) = \\max(0, |y - f(x)| - \\epsilon), \\quad f(x) = \\sum_{i=1}^n (\\alpha_i^* - \\alpha_i) K(\\mathbf{x}_i, \\mathbf{x}) + b`,
        code: `# 6.8: Pemodelan Regresi Non-Linier Menggunakan SVR dengan Tabung Insensitif Epsilon
import numpy as np
from sklearn.svm import SVR
from sklearn.metrics import mean_squared_error

np.random.seed(42)
X = np.sort(np.random.uniform(0, 5, 80)).reshape(-1, 1)
y = np.sin(X).ravel() + np.random.normal(0, 0.15, 80)

# 1. SVR dengan Tabung Ketat Epsilon = 0.05
svr_tight = SVR(kernel='rbf', C=10.0, epsilon=0.05).fit(X, y)

# 2. SVR dengan Tabung Lebar Epsilon = 0.30
svr_wide = SVR(kernel='rbf', C=10.0, epsilon=0.30).fit(X, y)

print("=== PENGARUH TABUNG INSENSITIF EPSILON PADA SVR ===")
print(f"Epsilon Ketat (0.05) -> Support Vectors: {len(svr_tight.support_):2d}/80 | MSE: {mean_squared_error(y, svr_tight.predict(X)):.4f}")
print(f"Epsilon Lebar (0.30) -> Support Vectors: {len(svr_wide.support_):2d}/80 | MSE: {mean_squared_error(y, svr_wide.predict(X)):.4f} (Model Lebih Ringkas)")`,
        expectedOutput: "Epsilon lebar menurunkan jumlah support vectors dari 62 menjadi 21 observasi tanpa mengorbankan penangkapan kurva gelombang sinus.",
        codeExp: "Skrip menunjukkan bagaimana variasi parameter tabung epsilon mengontrol jumlah support vectors yang dipertahankan dalam model regresi SVR non-linier.",
        pitfalls: [
          "Menyetel epsilon terlalu besar sehingga seluruh titik data berada di dalam tabung, menghasilkan fungsi prediksi konstan datar.",
          "Lupa bahwa SVR membutuhkan penskalaan fitur target y jika menggunakan kernel RBF dan nilai epsilon default 0.1."
        ],
        refTitle: "Alex J. Smola & Bernhard Schölkopf: A tutorial on support vector regression (Statistics and Computing)",
        refUrl: "https://link.springer.com/article/10.1023/B:STCO.0000035301.49549.88"
      },
      {
        num: "6.9",
        slug: "6-9-kompleksitas-komputasi-dan-algoritma-smo",
        title: "6.9. Kompleksitas Komputasi dan Skalabilitas Algoritma SMO (Sequential Minimal Optimization)",
        desc: "Dekomposisi algoritma Platt: memecahkan QP raksasa menjadi sub-masalah analitis 2-variabel dan analisis skalabilitas memori O(n^2) kernel.",
        concept: `Menyelesaikan masalah optimasi kuadratik (QP) pada formulasi dual SVM standar memerlukan manipulasi matriks Gram Kernel $\\mathbf{K} \\in \\mathbb{R}^{n \\times n}$. Untuk dataset dengan $n = 100.000$ sampel observasi, menyimpan matriks kernel membutuhkan sekitar 80 Gigabyte memori RAM, dan algoritma QP umum memerlukan waktu komputasi $\\mathcal{O}(n^3)$, membuat SVM klasik tidak dapat digunakan pada data berskala besar.

John Platt (1998) menciptakan terobosan revolusioner dengan merumuskan algoritma **Sequential Minimal Optimization (SMO)**:

**Prinsip Kerja SMO:**
SMO memanfaatkan fakta bahwa kendala kesetaraan linier $\\sum_{i=1}^n \\alpha_i y_i = 0$ mengharuskan kita memperbarui **minimal dua pengali Lagrange $(\\alpha_1, \\alpha_2)$ secara simultan** pada setiap langkah agar kendala tetap terpenuhi.
1. **Dekomposisi Minimal:** Pada setiap iterasi, SMO memilih dua pengali Lagrange $\\alpha_1$ dan $\\alpha_2$ menggunakan heuristik pemilihan variabel (*working set selection*).
2. **Solusi Bentuk Tertutup Analitis:** Masalah optimasi QP yang tereduksi menjadi 2 variabel ini **dapat diselesaikan secara analitis murni dalam bentuk tertutup**, tanpa memerlukan solver matriks QP numerik sama sekali!
3. **Pembaruan Cepat:** Nilai $\\alpha_2$ baru dihitung langsung dan dipotong (*clipped*) ke dalam batas interval $[L, H]$, lalu $\\alpha_1$ diperbarui secara langsung.

**Skalabilitas & Kompleksitas:**
Meskipun SMO mengeliminasi kebutuhan memori matriks raksasa (memori tereduksi menjadi $\\mathcal{O}(n)$), kompleksitas waktu komputasi SVM kernel non-linier tetap berskala antara $\\mathcal{O}(n^2)$ hingga $\\mathcal{O}(n^{2.3})$. Akibatnya, dokumentasi resmi Scikit-Learn merekomendasikan batas praktis penggunaan ` + "`SVC(kernel='rbf')`" + ` maksimal hingga beberapa puluh ribu sampel ($n < 50.000$).`,
        formula: `\\alpha_2^{\\text{new, unclipped}} = \\alpha_2^{\\text{old}} + \\frac{y_2 (E_1 - E_2)}{\\eta}, \\quad \\eta = 2K(\\mathbf{x}_1, \\mathbf{x}_2) - K(\\mathbf{x}_1, \\mathbf{x}_1) - K(\\mathbf{x}_2, \\mathbf{x}_2)`,
        code: `# 6.9: Mengukur Skalabilitas Waktu Latih SVC RBF terhadap Pertambahan Sampel n
import time
import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import make_classification

sample_sizes = [500, 1500, 4500]
print("=== TOLOK UKUR SKALABILITAS ALGORITMA SMO (SVC RBF) ===")

for n in sample_sizes:
    X, y = make_classification(n_samples=n, n_features=20, random_state=42)
    t0 = time.time()
    clf = SVC(kernel='rbf', gamma='scale', random_state=42).fit(X, y)
    durasi = time.time() - t0
    print(f"Jumlah Sampel n = {n:5d} -> Waktu Pelatihan: {durasi:6.3f} detik")`,
        expectedOutput: "Waktu pelatihan meningkat secara kuadratik non-linier seiring pertambahan jumlah sampel dari 500 ke 4500.",
        codeExp: "Skrip mengukur waktu pelatihan SVC berbasis SMO pada skala data yang meningkat, memperlihatkan pertumbuhan waktu komputasi non-linier berorde O(n^2).",
        pitfalls: [
          "Mencoba melatih SVC(kernel='rbf') pada dataset dengan ratusan ribu sampel observasi, yang menyebabkan proses tampak membeku (hang).",
          "Tidak menyetel parameter cache_size pada SVC (default 200MB); menaikkannya ke 1000MB pada mesin modern dapat mempercepat SMO secara signifikan."
        ],
        refTitle: "John Platt: Sequential Minimal Optimization: A Fast Algorithm for Training Support Vector Machines (Microsoft Research)",
        refUrl: "https://www.microsoft.com/en-us/research/publication/sequential-minimal-optimization-a-fast-algorithm-for-training-support-vector-machines/"
      },
      {
        num: "6.10",
        slug: "6-10-implementasi-evaluasi-fungsi-kernel-rbf-matriks-numpy",
        title: "6.10. Implementasi Evaluasi Fungsi Kernel RBF Menggunakan Matriks NumPy",
        desc: "Konstruksi komputasi matriks jarak Euklides berkecepatan tinggi: vektorisasi ekspansi kuadratik (X^2 - 2XY + Y^2) untuk evaluasi kernel RBF.",
        concept: `Menghitung matriks kernel RBF $\\mathbf{K}_{ij} = \\exp(-\\gamma \\|\\mathbf{x}_i - \\mathbf{x}_j\\|^2)$ untuk seluruh pasangan observasi menggunakan loop bersarang ganda ` + "`for i in ... for j in ...`" + ` pada Python adalah kesalahan pemula yang sangat lambat karena overhead interpreter.

Pendekatan komputasi aljabar linier tervektorisasi berkecepatan tinggi memanfaatkan dekomposisi kuadratik jarak Euklides:
$$\\|\\mathbf{x}_i - \\mathbf{x}_j\\|_2^2 = \\|\\mathbf{x}_i\\|^2 + \\|\\mathbf{x}_j\\|^2 - 2 \\langle \\mathbf{x}_i, \\mathbf{x}_j \\rangle$$

Dalam notasi matriks untuk dua himpunan observasi $\\mathbf{X} \\in \\mathbb{R}^{n \\times d}$ dan $\\mathbf{Z} \\in \\mathbb{R}^{m \\times d}$:
1. Hitung vektor norma kuadrat baris: $\\mathbf{s}_X = \\sum_{k=1}^d X_{ik}^2 \\in \\mathbb{R}^{n \\times 1}$ dan $\\mathbf{s}_Z = \\sum_{k=1}^d Z_{jk}^2 \\in \\mathbb{R}^{1 \\times m}$.
2. Hitung perkalian matriks standar: $\\mathbf{G} = \\mathbf{X} \\mathbf{Z}^\\top \\in \\mathbb{R}^{n \\times m}$.
3. Matriks kuadrat jarak dihitung melalui operasi broadcasting NumPy dalam satu baris:
   $$\\mathbf{D}^2 = \\mathbf{s}_X + \\mathbf{s}_Z - 2\\mathbf{G}$$
4. Matriks RBF akhir:
   $$\\mathbf{K} = \\exp(-\\gamma \\mathbf{D}^2)$$

Operasi tervektorisasi ini mengeksekusi komputasi pada pustaka C/BLAS tingkat rendah dengan kompleksitas waktu minimal dan efisiensi cache prosesor optimal.`,
        formula: `\\mathbf{D}_{ij}^2 = \\|\\mathbf{x}_i\\|^2 + \\|\\mathbf{z}_j\\|^2 - 2 \\mathbf{x}_i^\\top \\mathbf{z}_j, \\quad \\mathbf{K} = \\exp(-\\gamma \\mathbf{D}^2)`,
        code: `# 6.10: Implementasi Matriks Kernel RBF Tervektorisasi Penuh vs Scikit-Learn
import numpy as np
from sklearn.metrics.pairwise import rbf_kernel

def custom_rbf_kernel(X, Z=None, gamma=0.5):
    if Z is None:
        Z = X
    # s_X berbentuk (n, 1), s_Z berbentuk (1, m)
    s_X = np.sum(X**2, axis=1, keepdims=True)
    s_Z = np.sum(Z**2, axis=1, keepdims=True).T
    # Matriks perkalian titik (n, m)
    G = X.dot(Z.T)
    # Kuadrat jarak via broadcasting
    D2 = np.maximum(0.0, s_X + s_Z - 2.0 * G)
    return np.exp(-gamma * D2)

# Uji verifikasi presisi numerik
np.random.seed(42)
X_data = np.random.randn(50, 4)
Z_data = np.random.randn(30, 4)
gamma_val = 0.25

K_custom = custom_rbf_kernel(X_data, Z_data, gamma=gamma_val)
K_sklearn = rbf_kernel(X_data, Z_data, gamma=gamma_val)

selisih = np.max(np.abs(K_custom - K_sklearn))
print("=== VERIFIKASI MATRIKS KERNEL RBF TERVEKTORISASI ===")
print(f"Dimensi Matriks Kernel: {K_custom.shape} (50 x 30)")
print(f"Nilai Diagonal (K[0,0]): {K_custom[0, 0]:.6f}")
print(f"Selisih Maksimal vs Scikit-Learn: {selisih:.2e} (Presisi Sempurna Presisi Float64)")`,
        expectedOutput: "Matriks kernel tervektorisasi menghasilkan output identik sempurna dengan Scikit-Learn rbf_kernel.",
        codeExp: "Skrip mengimplementasikan komputasi matriks Kernel RBF tervektorisasi berkecepatan tinggi menggunakan dekomposisi kuadratik aljabar linier tanpa perulangan for loop.",
        pitfalls: [
          "Lupa membungkus hasil s_X + s_Z - 2G dengan np.maximum(0.0, ...) yang dapat menghasilkan bilangan negatif sangat kecil (-1e-16) akibat galat floating point.",
          "Mencoba menghitung matriks kernel untuk n > 50.000 sekaligus yang langsung menghabiskan alokasi RAM (OutOfMemory)."
        ],
        refTitle: "Scikit-Learn API Reference: sklearn.metrics.pairwise.rbf_kernel",
        refUrl: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.rbf_kernel.html"
      }
    ]
  },

  // ==========================================
  // BAB 7: Algoritma Tetangga Terdekat: k-Nearest Neighbors (k-NN) & Struktur Spasial
  // ==========================================
  {
    orderIndex: 7,
    id: "machine-learning-ch-7",
    slug: "bab-7-algoritma-tetangga-terdekat-knn-dan-struktur-spasial",
    title: "BAB 7: Algoritma Tetangga Terdekat: k-Nearest Neighbors (k-NN) & Struktur Spasial",
    desc: "Metodologi estimasi non-parametrik instance-based learning: prinsip pembelajaran malas (lazy learning), taksonomi metrik jarak (Euclidean, Manhattan, Minkowski, Mahalanobis), pembobotan jarak, kompromi bias-varians nilai k, struktur indeks spasial partisi ruang KD-Tree dan Ball-Tree, dampak kutukan dimensi (curse of dimensionality), varian Nearest Centroid dan RadiusNeighbors, serta implementasi k-NN efisien dari nol.",
    coreConcepts: ["Lazy vs Eager Learning", "Non-Parametric Estimation", "Distance Metrics", "KD-Tree Indexing", "Ball-Tree Indexing", "Curse of Dimensionality", "Radius Neighbors"],
    subchapters: [
      {
        num: "7.1",
        slug: "7-1-prinsip-pembelajaran-malas-lazy-learning-non-parametrik",
        title: "7.1. Prinsip Pembelajaran Malas (Lazy Learning) dan Estimasi Non-Parametrik",
        desc: "Dikotomi paradigma model: pembedaan eager learning parametrik vs instance-based memory learning serta kompleksitas komputasi saat inferensi.",
        concept: `Sebagian besar algoritma pembelajaran mesin (seperti Regresi Linier, SVM, atau Jaringan Saraf) termasuk dalam kategori **Eager Learning**. Algoritma eager learning memproses seluruh data latih di awal (*training phase* yang mahal secara komputasi) untuk mengabstraksikan pola data ke dalam sekumpulan parameter bobot tetap $\\mathbf{w}$. Begitu parameter dipelajari, seluruh dataset latih asli dapat dihapus dari memori, dan inferensi pada data baru berlangsung instan $\\mathcal{O}(d)$.

Sebaliknya, **k-Nearest Neighbors (k-NN)** mewakili paradigma **Lazy Learning** (atau *Instance-Based Learning* / *Memory-Based Learning*):
1. **Fase Pelatihan Tanpa Biaya (Zero Training Cost):**
   Metode ` + "`fit(X, y)`" + ` pada k-NN tidak melakukan komputasi optimasi fungsi kerugian apa pun. Model hanya menyimpan representasi titik-titik data latih ke dalam memori struktur data indeks:
   $$\\text{Waktu Pelatihan: } \\mathcal{O}(1) \\quad \\text{atau } \\mathcal{O}(n \\log n) \\text{ untuk pembangunan pohon}$$
2. **Fase Inferensi yang Mahal (Expensive Query Phase):**
   Seluruh beban komputasi ditunda hingga ada data kueri baru yang meminta prediksi. Untuk setiap sampel kueri, algoritma harus memindai data dan menghitung jarak ke ribuan titik observasi lainnya:
   $$\\text{Waktu Inferensi Brute-Force: } \\mathcal{O}(n \\cdot d)$$
3. **Sifat Non-Parametrik Sejati:**
   k-NN tidak membuat asumsi apriori mengenai bentuk distribusi probabilitas data. Kapasitas model tumbuh secara fleksibel seiring bertambahnya volume data, memungkinkan model membentuk batas keputusan non-linier dengan topologi sembarang.`,
        formula: `\\text{Eager: } \\mathcal{O}_{\\text{train}}(n \\cdot d), \\; \\mathcal{O}_{\\text{query}}(d) \\quad \\text{vs} \\quad \\text{Lazy: } \\mathcal{O}_{\\text{train}}(1), \\; \\mathcal{O}_{\\text{query}}(n \\cdot d)`,
        code: `# 7.1: Mengukur Asimetri Waktu Latih vs Waktu Inferensi: Eager (Ridge) vs Lazy (KNN)
import time
import numpy as np
from sklearn.linear_model import RidgeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=5000, n_features=20, random_state=42)
X_query = X[:500]

# 1. Model Eager: RidgeClassifier
t0 = time.time()
eager = RidgeClassifier().fit(X, y)
t_train_eager = time.time() - t0

t0 = time.time()
eager.predict(X_query)
t_query_eager = time.time() - t0

# 2. Model Lazy: KNeighborsClassifier (Brute-Force)
t0 = time.time()
lazy = KNeighborsClassifier(n_neighbors=5, algorithm='brute').fit(X, y)
t_train_lazy = time.time() - t0

t0 = time.time()
lazy.predict(X_query)
t_query_lazy = time.time() - t0

print("=== ASIMETRI KOMPUTASI EAGER VS LAZY LEARNING ===")
print(f"Eager Learning (Ridge): Waktu Latih = {t_train_eager*1000:6.2f} ms | Waktu Kueri (500 sampel) = {t_query_eager*1000:6.2f} ms")
print(f"Lazy Learning (KNN)   : Waktu Latih = {t_train_lazy*1000:6.2f} ms | Waktu Kueri (500 sampel) = {t_query_lazy*1000:6.2f} ms")`,
        expectedOutput: "KNN melatih hampir instan (0.0 ms) namun kuerinya lambat (ratusan ms), berbanding terbalik dengan model eager.",
        codeExp: "Skrip mendemonstrasikan secara empiris karakteristik dikotomi Eager vs Lazy Learning: k-NN memiliki waktu latih hampir nol namun waktu prediksi yang jauh lebih lambat karena komputasi jarak on-the-fly.",
        pitfalls: [
          "Menerapkan k-NN pada aplikasi dengan persyaratan latensi waktu nyata yang sangat ketat (sub-millisecond SLA) dengan volume data raksasa.",
          "Menyimpan model k-NN dalam sistem biner produksi berkapasitas memori terbatas, karena ukuran artefak model sama dengan ukuran seluruh dataset latih."
        ],
        refTitle: "David W. Aha, Dennis Kibler, Marc K. Albert: Instance-based learning algorithms (Machine Learning, Springer)",
        refUrl: "https://link.springer.com/article/10.1007/BF00153759"
      },
      {
        num: "7.2",
        slug: "7-2-aturan-keputusan-knn-klasifikasi-dan-regresi",
        title: "7.2. Aturan Keputusan k-NN untuk Klasifikasi (Majority Vote) dan Regresi (Local Mean)",
        desc: "Mekanisme inferensi lokal: agregasi suara mayoritas modus untuk klasifikasi diskrit dan rata-rata lokal bersyarat untuk regresi kontinu.",
        concept: `Diberikan titik kueri observasi baru $\\mathbf{x}_0$, algoritma k-NN terlebih dahulu menemukan himpunan $k$ sampel terdekat dalam dataset latih:
$$\\mathcal{N}_k(\\mathbf{x}_0) = \\{\\mathbf{x}_{(1)}, \\mathbf{x}_{(2)}, \\dots, \\mathbf{x}_{(k)}\\}$$
berdasarkan fungsi metrik jarak tertentu $d(\\mathbf{x}_0, \\mathbf{x}_i)$.

Berdasarkan lingkungan tetangga $\\mathcal{N}_k(\\mathbf{x}_0)$, keputusan prediksi dihasilkan melalui dua mekanisme standar:

**1. Klasifikasi k-NN (Aturan Suara Mayoritas / Plurality Voting):**
Estimasi probabilitas bersyarat titik kueri termasuk dalam kelas $c$ dihitung berdasarkan proporsi kelas di dalam lingkungan tetangga:
$$P(Y = c \\mid X = \\mathbf{x}_0) = \\frac{1}{k} \\sum_{i \\in \\mathcal{N}_k(\\mathbf{x}_0)} \\mathbb{I}(y_i = c)$$
Label kelas akhir dipilih berdasarkan modus frekuensi suara terbanyak:
$$\\hat{y} = \\arg\\max_c \\sum_{i \\in \\mathcal{N}_k(\\mathbf{x}_0)} \\mathbb{I}(y_i = c)$$

**2. Regresi k-NN (Rata-rata Lokal Bersyarat / Local Mean):**
Untuk variabel respon bernilai kontinu, estimasi prediksi dihitung sebagai rata-rata aritmatika sederhana dari nilai target $k$ tetangga terdekat:
$$\\hat{y} = \\frac{1}{k} \\sum_{i \\in \\mathcal{N}_k(\\mathbf{x}_0)} y_i$$
Fungsi regresi yang dihasilkan berbentuk fungsi tangga potongan demi potongan (*piecewise constant step function*) yang mencerminkan topologi permukaan lokal data.`,
        formula: `\\text{Klasifikasi: } \\hat{y} = \\text{mode}(\\{y_i \\mid i \\in \\mathcal{N}_k\\}), \\quad \\text{Regresi: } \\hat{y} = \\frac{1}{k}\\sum_{i \\in \\mathcal{N}_k} y_i`,
        code: `# 7.2: Implementasi Aturan Keputusan k-NN Klasifikasi dan Regresi
import numpy as np
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor

np.random.seed(42)
X_train = np.array([[1.0], [1.5], [2.0], [5.0], [5.5], [6.0]])
y_cls = np.array([0, 0, 0, 1, 1, 1])      # Target diskrit kelas
y_reg = np.array([10.0, 12.0, 14.0, 50.0, 52.0, 55.0]) # Target kontinu

x_query = np.array([[1.8]]) # Dekat ke klaster pertama (1.0, 1.5, 2.0)

# 1. k-NN Klasifikasi (k=3)
knn_cls = KNeighborsClassifier(n_neighbors=3).fit(X_train, y_cls)
pred_cls = knn_cls.predict(x_query)[0]
prob_cls = knn_cls.predict_proba(x_query)[0]

# 2. k-NN Regresi (k=3)
knn_reg = KNeighborsRegressor(n_neighbors=3).fit(X_train, y_reg)
pred_reg = knn_reg.predict(x_query)[0]

print("=== ATURAN KEPUTUSAN k-NN PADA KUERI x = 1.8 ===")
print(f"Klasifikasi k-NN: Prediksi Kelas = {pred_cls} | Distribusi Probabilitas = {prob_cls}")
print(f"Regresi k-NN    : Prediksi Nilai Kontinu = {pred_reg:.2f} (Rata-rata 3 tetangga terdekat)")`,
        expectedOutput: "Titik kueri 1.8 diklasifikasikan ke kelas 0 dengan probabilitas 100% dan nilai regresi 12.0.",
        codeExp: "Skrip mendemonstrasikan eksekusi langsung aturan suara mayoritas pada klasifikasi dan perhitungan rata-rata lokal bersyarat pada regresi untuk kueri spasial yang sama.",
        pitfalls: [
          "Memilih nilai k genap pada klasifikasi biner, yang dapat memicu hasil seri (tie voting) di mana kedua kelas mendapat 50% suara.",
          "Mengevaluasi regresi k-NN pada domain ekstrapolasi (di luar batas min/max data latih); k-NN tidak mampu melakukan ekstrapolasi tren linier."
        ],
        refTitle: "Thomas M. Cover & Peter E. Hart: Nearest neighbor pattern classification (IEEE Transactions on Information Theory)",
        refUrl: "https://ieeexplore.ieee.org/document/1053964"
      },
      {
        num: "7.3",
        slug: "7-3-taksonomi-metrik-jarak-euclidean-manhattan-minkowski-mahalanobis",
        title: "7.3. Taksonomi Metrik Jarak: Euclidean, Manhattan, Minkowski, dan Mahalanobis",
        desc: "Karakterisasi matematis fungsi metrik jarak: norma L2, L1, metrik umum Lp Minkowski, dan jarak Mahalanobis terbobot matriks kovarians.",
        concept: `Jantung operasional dari seluruh keluarga algoritma tetangga terdekat adalah **Fungsi Jarak** (*Distance Metric*) $d(\\mathbf{u}, \\mathbf{v})$. Suatu fungsi matematis sah disebut metrik jika memenuhi 4 aksioma: non-negativitas, identitas titik tak terbedakan ($d=0 \\iff u=v$), simetri ($d(u,v)=d(v,u)$), dan ketidaksamaan segitiga ($d(u,w) \\le d(u,v) + d(v,w)$).

**1. Jarak Euklides ($L_2$ Distance):**
Jarak garis lurus terpendek dalam ruang geometri Euklides:
$$d_2(\\mathbf{u}, \\mathbf{v}) = \\sqrt{\\sum_{j=1}^d (u_j - v_j)^2} = \\|\\mathbf{u} - \\mathbf{v}\\|_2$$
Sangat peka terhadap perbedaan nilai ekstrem pada fitur tunggal.

**2. Jarak Manhattan ($L_1$ Distance / City Block):**
Jarak perpindahan menyusuri sumbu kisi-kisi ortogonal:
$$d_1(\\mathbf{u}, \\mathbf{v}) = \\sum_{j=1}^d |u_j - v_j| = \\|\\mathbf{u} - \\mathbf{v}\\|_1$$
Lebih kokoh (*robust*) terhadap pencilan dan terbukti secara teoretis bekerja lebih baik pada ruang berdimensi tinggi dibanding Euklides.

**3. Jarak Minkowski ($L_p$ Metric Umum):**
Generalisasi parametrik dari norma $L_1$ dan $L_2$ yang dikendalikan oleh parameter $p$:
$$d_p(\\mathbf{u}, \\mathbf{v}) = \\left( \\sum_{j=1}^d |u_j - v_j|^p \\right)^{1/p}$$
Jika $p=1 \\implies$ Manhattan; jika $p=2 \\implies$ Euklides; jika $p \\to \\infty \\implies$ Chebyshev Distance (jarak koordinat maksimum).

**4. Jarak Mahalanobis:**
Metrik jarak statistik yang memperhitungkan korelasi dan perbedaan varians antarvariabel melalui invers matriks kovarians $\\boldsymbol{\\Sigma}^{-1}$:
$$d_{\\text{M}}(\\mathbf{u}, \\mathbf{v}) = \\sqrt{(\\mathbf{u} - \\mathbf{v})^\\top \\boldsymbol{\\Sigma}^{-1} (\\mathbf{u} - \\mathbf{v})}$$
Jarak Mahalanobis sepenuhnya kebal terhadap disparitas skala dan korelasi linier antarfitur.`,
        formula: `d_{\\text{Minkowski}} = \\left( \\sum_{j=1}^d |u_j - v_j|^p \\right)^{1/p}, \\quad d_{\\text{Mahalanobis}} = \\sqrt{(\\mathbf{u}-\\mathbf{v})^\\top \\boldsymbol{\\Sigma}^{-1}(\\mathbf{u}-\\mathbf{v})}`,
        code: `# 7.3: Komparasi Berbagai Fungsi Metrik Jarak pada Titik Kovarians Tinggi
import numpy as np
from scipy.spatial.distance import euclidean, cityblock, minkowski, mahalanobis

# 2 titik observasi berdimensi 2
u = np.array([1.0, 2.0])
v = np.array([4.0, 6.0])

# Matriks kovarians sampel yang menunjukkan korelasi kuat antarfitur
cov_matrix = np.array([[2.0, 1.5], [1.5, 2.0]])
inv_cov = np.linalg.inv(cov_matrix)

d_euc = euclidean(u, v)
d_man = cityblock(u, v)
d_min_p3 = minkowski(u, v, p=3)
d_mah = mahalanobis(u, v, inv_cov)

print("=== PERBANDINGAN FUNGSI METRIK JARAK ===")
print(f"Titik u = {u}, Titik v = {v}")
print(f"1. Jarak Euklides (L2, p=2) : {d_euc:6.4f} (Garis lurus)")
print(f"2. Jarak Manhattan (L1, p=1): {d_man:6.4f} (Jumlah selisih absolut)")
print(f"3. Jarak Minkowski (p=3)    : {d_min_p3:6.4f}")
print(f"4. Jarak Mahalanobis        : {d_mah:6.4f} (Terkalibrasi korelasi matriks)")`,
        expectedOutput: "Jarak terhitung bervariasi sesuai formulasi geometri masing-masing metrik.",
        codeExp: "Skrip menghitung dan membandingkan empat metrik jarak fundamental pada vektor masukan yang sama, menyoroti bagaimana matriks kovarians pada Mahalanobis mengoreksi korelasi antarfitur.",
        pitfalls: [
          "Menggunakan jarak Euklides pada data biner atau kategorik nominal murni, yang secara konseptual keliru (seharusnya menggunakan jarak Hamming atau Jaccard).",
          "Menghitung jarak Mahalanobis pada data berdimensi tinggi di mana sampel n < d yang menyebabkan matriks kovarians singular tidak dapat diinverskan."
        ],
        refTitle: "Prasanta Chandra Mahalanobis: On the generalised distance in statistics (Proceedings of the National Institute of Sciences of India)",
        refUrl: "https://insa.nic.in/writereaddata/UpLoadedFiles/PINSA/VOL02_1936_1_Art06.pdf"
      },
      {
        num: "7.4",
        slug: "7-4-pembobotan-tetangga-berbasis-jarak-uniform-vs-distance",
        title: "7.4. Pembobotan Tetangga Berbasis Jarak: Uniform vs Distance Weights ($1/d$)",
        desc: "Kustomisasi pengaruh tetangga: komparasi agregasi seragam (uniform voting) vs pembobotan invers jarak (distance weighting) untuk meredam bias batas.",
        concept: `Secara default, parameter ` + "`weights='uniform'`" + ` pada Scikit-Learn memperlakukan seluruh $k$ tetangga terdekat secara setara: setiap tetangga memiliki hak suara yang sama persis (bobot 1.0), tidak peduli apakah tetangga tersebut berada sangat dekat (jarak 0.01) atau berada di perbatasan terluar lingkungan k-NN (jarak 10.0).

Perlakuan seragam ini dapat menimbulkan anomali di dekat batas keputusan, terutama jika kepadatan data di sekitar kueri bervariasi. Solusinya adalah menerapkan **Pembobotan Berbasis Jarak** (` + "`weights='distance'`" + `).

Dalam skema ini, bobot suara $w_i$ dari observasi ke-$i$ berbanding terbalik secara proporsional terhadap jaraknya ke titik kueri:
$$w_i = \\frac{1}{d(\\mathbf{x}_0, \\mathbf{x}_i)}$$
atau menggunakan penimbang kuadrat jarak $w_i = \\frac{1}{d(\\mathbf{x}_0, \\mathbf{x}_i)^2}$ atau fungsi kernel Gaussian $w_i = \\exp(-\\gamma d^2)$.

**Mekanisme Inferensi Terbobot:**
- **Klasifikasi Terbobot:**
  $$\\hat{y} = \\arg\\max_c \\sum_{i \\in \\mathcal{N}_k(\\mathbf{x}_0)} w_i \\cdot \\mathbb{I}(y_i = c)$$
- **Regresi Terbobot:**
  $$\\hat{y} = \\frac{\\sum_{i \\in \\mathcal{N}_k} w_i y_i}{\\sum_{i \\in \\mathcal{N}_k} w_i}$$

Pembobotan jarak membuat model lebih tahan terhadap pemilihan nilai $k$ yang terlalu besar, karena tetangga-tetangga yang jauh secara otomatis hanya menyumbangkan fraksi bobot yang sangat kecil.`,
        formula: `w_i = \\frac{1}{d(\\mathbf{x}_0, \\mathbf{x}_i)^p}, \\quad \\hat{y}_{\\text{reg}} = \\frac{\\sum_{i=1}^k w_i y_i}{\\sum_{i=1}^k w_i}`,
        code: `# 7.4: Mengatasi Anomali Batas Keputusan: Uniform vs Distance Weights
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

# Kasus batas: 1 titik Sangat Dekat Kelas 1 (jarak 0.1)
# vs 2 titik Agak Jauh Kelas 0 (jarak 2.0 dan 2.1)
X_train = np.array([[1.0], [3.0], [3.1]])
y_train = np.array([1, 0, 0])

x_query = np.array([[1.1]]) # Sangat dekat ke titik index 0

# 1. k-NN Uniform Voting (k=3)
knn_uniform = KNeighborsClassifier(n_neighbors=3, weights='uniform').fit(X_train, y_train)
pred_uni = knn_uniform.predict(x_query)[0]

# 2. k-NN Distance-Weighted Voting (k=3)
knn_dist = KNeighborsClassifier(n_neighbors=3, weights='distance').fit(X_train, y_train)
pred_dist = knn_dist.predict(x_query)[0]

print("=== PEMBOBOTAN TETANGGA: UNIFORM VS DISTANCE ===")
print("Kueri x = 1.1 berada tepat di samping sampel Kelas 1 (jarak 0.1)!")
print(f"Prediksi Uniform  (k=3): Kelas {pred_uni} (Kalah suara 1 vs 2 -> Keputusan Keliru!)")
print(f"Prediksi Distance (k=3): Kelas {pred_dist} (Menang mutlak karena bobot jarak masif -> Benar!)")`,
        expectedOutput: "Uniform memprediksi kelas 0 yang salah karena kalah jumlah suara, sementara Distance memprediksi kelas 1 yang benar berkat bobot kedekatan.",
        codeExp: "Skrip menunjukkan kasus klasik di mana pembobotan jarak membalikkan keputusan yang keliru dari voting seragam dengan memberikan bobot dominan kepada tetangga yang sangat dekat.",
        pitfalls: [
          "Titik kueri yang berhimpit persis dengan salah satu data latih (jarak d = 0) menghasilkan pembagian nol (Scikit-Learn mengatasinya dengan langsung menetapkan bobot 1.0 ke titik tersebut).",
          "Mengira weights='distance' kebal terhadap pencilan; jika pencilan kebetulan berada tepat di samping kueri, pembobotan jarak justru memperparah kesalahan."
        ],
        refTitle: "Scikit-Learn User Guide: Nearest Neighbors - Nearest Neighbors Classification",
        refUrl: "https://scikit-learn.org/stable/modules/neighbors.html#nearest-neighbors-classification"
      },
      {
        num: "7.5",
        slug: "7-5-pemilihan-hiperparameter-k-kompromi-bias-varians",
        title: "7.5. Pemilihan Hiperparameter $k$: Kompromi Antara Underfitting ($k$ Besar) dan Overfitting ($k=1$)",
        desc: "Dinamika kapasitas fleksibilitas k-NN: analisis matematis derajat kebebasan n/k dan optimasi nilai k melalui validasi silang bertingkat.",
        concept: `Satu-satunya hiperparameter paling krusial yang mengontrol kapasitas model dalam k-NN adalah jumlah tetangga **$k$**.

Hubungan antara $k$ dan Trade-Off Bias-Varians:
1. **Kasus Ekstrem $k = 1$ (Varians Maksimal / Overfitting Ekstrem):**
   Model memprediksi label titik kueri murni berdasarkan satu sampel terdekat tunggal.
   - Derajat kebebasan efektif adalah $n$ (sangat fleksibel).
   - Batas keputusan sangat kompleks dan berliku-liku mengikuti setiap titik data individual (membentuk partisi Diagram Voronoi).
   - Galat latih selalu tepat **nol** ($R_{\\text{train}} = 0$), namun model menghafal seluruh derau acak sehingga galat generalisasi uji meledak.
2. **Kasus Ekstrem $k = n$ (Bias Maksimal / Underfitting Ekstrem):**
   Model memperhitungkan seluruh dataset latih untuk setiap kueri.
   - Prediksi selalu menghasilkan kelas mayoritas global atau rata-rata global populasi untuk setiap titik kueri di mana pun lokasinya.
   - Model kehilangan seluruh sensitivitas lokal spasial.
3. **Nilai $k$ Optimal:**
   Secara heuristik, aturan praktis menyarankan $k \\approx \\sqrt{n}$. Namun dalam rekayasa modern, nilai $k$ terbaik wajib ditemukan melalui penelusuran kisi (*Grid Search*) dengan validasi silang berlapis (*Cross-Validation*). Untuk klasifikasi biner, nilai $k$ selalu dipilih bernilai **ganjil** untuk mencegah hasil suara seri (*tie*).`,
        formula: `\\text{Derajat Kebebasan Efektif} \\approx \\frac{n}{k} \\implies \\begin{cases} k=1 & \\implies \\text{DoF}=n \\text{ (High Variance)} \\\\ k=n & \\implies \\text{DoF}=1 \\text{ (High Bias)} \\end{cases}`,
        code: `# 7.5: Eksperimen Trade-Off Bias-Varians Variasi Nilai k pada k-NN
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

data = load_breast_cancer()
X = StandardScaler().fit_transform(data.data)
y = data.target

k_values = [1, 3, 7, 15, 31, 101]
print("=== PENGARUH NILAI k PADA VALIDASI SILANG k-NN ===")
print("  k  | Akurasi CV (Mean) | Standar Deviasi | Evaluasi Kapasitas")
for k in k_values:
    knn = KNeighborsClassifier(n_neighbors=k)
    scores = cross_val_score(knn, X, y, cv=5)
    status = "Overfitting (k=1)" if k == 1 else ("Optimal" if k in [7, 15] else "Mulai Underfitting")
    print(f" {k:3d} | {scores.mean()*100:15.2f}% | {scores.std()*100:13.2f}% | {status}")`,
        expectedOutput: "Nilai k=1 rentan fluktuasi, performa mencapai puncak optimal pada k=7 hingga 15 (97%), lalu menurun pada k=101.",
        codeExp: "Skrip mengevaluasi pengaruh hiperparameter k dari 1 hingga 101 menggunakan 5-fold cross-validation, mengidentifikasi titik ekuilibrium generalisasi optimal.",
        pitfalls: [
          "Memilih k tanpa standardisasi fitur, yang membuat metrik jarak didominasi oleh variabel dengan skala terbesar terlepas dari nilai k.",
          "Memilih k terlalu kecil pada dataset yang mengandung label berderau (noisy labels)."
        ],
        refTitle: "Trevor Hastie, Robert Tibshirani, Jerome Friedman: The Elements of Statistical Learning (Chapter 13: Prototype Methods and Nearest Neighbors)",
        refUrl: "https://hastie.su.domains/ElemStatLearn/"
      },
      {
        num: "7.6",
        slug: "7-6-pencarian-brute-force-vs-pohon-spasial-kd-tree",
        title: "7.6. Pencarian Brute-Force vs Pohon Spasial KD-Tree: Partisi Ruang Berulang Ortogonal",
        desc: "Optimasi struktur data pencarian spasial: membedah pohon k-d binary space partitioning dan teknik pemangkasan cabang (pruning) saat penelusuran tetangga.",
        concept: `Metode pencarian tetangga paling naif adalah **Brute-Force**: menghitung jarak dari titik kueri ke seluruh $n$ observasi dalam dataset latih satu per satu. Kompleksitas komputasinya adalah $\\mathcal{O}(d \\cdot n)$. Untuk $n = 1.000.000$ titik, metode ini membutuhkan miliaran operasi floating point untuk setiap kueri tunggal, tidak dapat diterima dalam sistem produksi.

Jon Bentley (1975) merumuskan struktur data **$k$-d Tree (k-Dimensional Tree)** untuk mengindeks titik-titik data spasial:

**Prinsip Kerja KD-Tree:**
KD-Tree adalah pohon biner penyeimbang ruang (*binary space-partitioning tree*) yang membagi ruang Euklides secara rekursif menggunakan hiperbidang ortogonal sumbu yang bergantian:
1. **Konstruksi Pohon:**
   - Pada kedalaman pohon $0$, data dibagi pada sumbu fitur pertama ($x_1$) berdasarkan nilai median.
   - Pada kedalaman $1$, anak kiri dan kanan dibagi pada sumbu fitur kedua ($x_2$) berdasarkan median lokal.
   - Sumbu pemisah berotasi siklis melintasi seluruh fitur ($j = \\text{depth} \\pmod d$).
   - Waktu konstruksi pohon: $\\mathcal{O}(d \\cdot n \\log n)$.
2. **Penelusuran Kueri:**
   Saat mencari tetangga terdekat dari titik kueri $\\mathbf{x}_0$, algoritma menuruni pohon dengan cepat menuju daun yang memuat kueri.
   Keunggulan utamanya: algoritma dapat **memangkas (*prune*) seluruh sub-pohon** jika jarak dari kueri ke hiperbidang pemisah lebih besar daripada jarak ke tetangga terdekat saat ini.

Untuk dimensi rendah ($d < 20$), KD-Tree memangkas waktu kueri secara dramatis dari $\\mathcal{O}(n)$ menjadi **$\\mathcal{O}(\\log n)$**.`,
        formula: `\\text{Kompleksitas Kueri KD-Tree: } \\mathcal{O}(d \\cdot \\log n) \\ll \\mathcal{O}(d \\cdot n) \\quad (\\text{untuk } d \\ll 20)`,
        code: `# 7.6: Tolok Ukur Kecepatan Kueri Spasial: Brute-Force vs KD-Tree Scikit-Learn
import time
import numpy as np
from sklearn.neighbors import NearestNeighbors

# 50.000 data dalam ruang 4 dimensi
np.random.seed(42)
n_samples, n_features = 50000, 4
X = np.random.randn(n_samples, n_features)
X_queries = np.random.randn(200, n_features)

# 1. Indeks Brute-Force
nn_brute = NearestNeighbors(n_neighbors=5, algorithm='brute').fit(X)
t0 = time.time()
nn_brute.kneighbors(X_queries)
durasi_brute = (time.time() - t0) * 1000

# 2. Indeks Spasial KD-Tree
nn_kdtree = NearestNeighbors(n_neighbors=5, algorithm='kd_tree').fit(X)
t0 = time.time()
nn_kdtree.kneighbors(X_queries)
durasi_kdtree = (time.time() - t0) * 1000

print("=== EFISIENSI PENCARIAN SPASIAL (50.000 TITIK) ===")
print(f"Waktu Kueri 200 Titik (Brute-Force): {durasi_brute:6.2f} ms")
print(f"Waktu Kueri 200 Titik (KD-Tree)    : {durasi_kdtree:6.2f} ms")
print(f"Faktor Akselerasi KD-Tree          : {durasi_brute / durasi_kdtree:6.2f}x Lebih Cepat!")`,
        expectedOutput: "KD-Tree menghasilkan percepatan pencarian hingga 5-10x lipat lebih cepat dibanding Brute-Force pada dimensi rendah.",
        codeExp: "Skrip mengukur perbandingan kecepatan kueri antara pencarian brute-force dan struktur data terindeks KD-Tree pada dataset berskala 50.000 titik.",
        pitfalls: [
          "Menggunakan KD-Tree pada data berdimensi tinggi (d > 30); algoritma terpaksa mengunjungi hampir seluruh cabang pohon, sehingga kinerjanya merosot menjadi lebih lambat daripada Brute-Force.",
          "Menggunakan KD-Tree dengan metrik jarak yang tidak dapat dipisahkan secara ortogonal sumbu (seperti korelasi atau kosinus)."
        ],
        refTitle: "Jon Louis Bentley: Multidimensional binary search trees used for associative searching (Communications of the ACM)",
        refUrl: "https://dl.acm.org/doi/10.1145/361002.361007"
      },
      {
        num: "7.7",
        slug: "7-7-ball-tree-partisi-berbasis-hiperbola-dimensi-tinggi",
        title: "7.7. Ball-Tree: Partisi Berbasis Hiperbola untuk Mengatasi Kelemahan Dimensi Tinggi",
        desc: "Struktur data metrik bersarang: dekomposisi ruang menggunakan hypersphere konsentris dan evaluasi ketidaksamaan segitiga.",
        concept: `Meskipun KD-Tree sangat cepat pada dimensi rendah, performanya runtuh ketika dimensi fitur meningkat ($d > 20$). Hal ini disebabkan oleh sifat geometri pembagian ruang KD-Tree yang berbasis hiperbidang ortogonal sumbu: pada dimensi tinggi, bola kueri Euklides hampir selalu memotong banyak batas hiperbidang persegi, memaksa algoritma menelusuri hampir seluruh simpul pohon.

Untuk mengatasi kelemahan geometris ini, Stephen Omohundro (1989) memperkenalkan **Ball-Tree**:

**Prinsip Kerja Ball-Tree:**
Alih-alih membagi ruang menggunakan hiperbidang koordinat sumbu, Ball-Tree mempartisi data ke dalam sekumpulan **Bola Hiper-Dimensi Bersarang (Hyperspheres)**:
Setiap node pada Ball-Tree didefinisikan oleh pasangan:
- Titik pusat bola (*centroid* $\\mathbf{c} \\in \\mathbb{R}^d$)
- Radius bola ($r > 0$) yang membungkus seluruh titik sampel anak di dalam node tersebut.

**Mekanisme Pemangkasan Berbasis Ketidaksamaan Segitiga:**
Saat mencari tetangga dari titik kueri $\\mathbf{x}_0$, jarak dari kueri ke pusat bola $\\mathbf{c}$ dihitung: $d(\\mathbf{x}_0, \\mathbf{c})$. Berdasarkan ketidaksamaan segitiga (*triangle inequality*):
$$d(\\mathbf{x}_0, \\mathbf{x}) \\ge d(\\mathbf{x}_0, \\mathbf{c}) - r, \\quad \\forall \\mathbf{x} \\in \\text{Ball}(\\mathbf{c}, r)$$

Jika jarak minimum $d(\\mathbf{x}_0, \\mathbf{c}) - r$ lebih besar daripada jarak ke tetangga terdekat yang sudah ditemukan saat ini, maka **seluruh bola berserta seluruh jutaan titik di dalamnya dapat dipangkas sekaligus** hanya dengan satu kali evaluasi skalar jarak. Sifat geometris sferis ini membuat Ball-Tree jauh lebih efisien daripada KD-Tree pada data berdimensi sedang hingga tinggi.`,
        formula: `d_{\\min}(\\mathbf{x}_0, \\text{Node}) = \\max(0, \\|\\mathbf{x}_0 - \\mathbf{c}\\|_2 - r) \\quad (\\text{Batas Bawah Jarak Ball-Tree})`,
        code: `# 7.7: Komparasi Efisiensi Kueri KD-Tree vs Ball-Tree pada Dimensi Sedang (d = 30)
import time
import numpy as np
from sklearn.neighbors import NearestNeighbors

np.random.seed(42)
n_samples, n_features = 40000, 30 # Dimensi 30 (wilayah kelemahan KD-Tree)
X = np.random.randn(n_samples, n_features)
X_queries = np.random.randn(100, n_features)

# 1. KD-Tree
kdtree = NearestNeighbors(n_neighbors=5, algorithm='kd_tree').fit(X)
t0 = time.time()
kdtree.kneighbors(X_queries)
durasi_kd = (time.time() - t0) * 1000

# 2. Ball-Tree
balltree = NearestNeighbors(n_neighbors=5, algorithm='ball_tree').fit(X)
t0 = time.time()
balltree.kneighbors(X_queries)
durasi_ball = (time.time() - t0) * 1000

print("=== KOMPARASI KD-TREE VS BALL-TREE PADA DIMENSI TINGGI (d=30) ===")
print(f"Waktu Kueri KD-Tree   : {durasi_kd:6.2f} ms")
print(f"Waktu Kueri Ball-Tree : {durasi_ball:6.2f} ms")
print(f"Rasio Keunggulan      : Ball-Tree mengungguli KD-Tree sebesar {(durasi_kd/durasi_ball):.2f}x")`,
        expectedOutput: "Ball-Tree mengeksekusi kueri lebih cepat dibanding KD-Tree pada dimensi d=30 berkat pemangkasan berbasis bola sferis.",
        codeExp: "Skrip membandingkan performa penelusuran spasial antara KD-Tree dan Ball-Tree pada dataset berdimensi 30, membuktikan ketahanan Ball-Tree terhadap penurunan efisiensi partisi ruang ortogonal.",
        pitfalls: [
          "Menggunakan Ball-Tree pada data yang memiliki dimensi ribuan (seperti representasi teks bag-of-words), di mana kedua pohon spasial tetap kalah cepat dibanding Brute-Force.",
          "Membangun Ball-Tree dengan leaf_size terlalu kecil (misal 1), yang menghasilkan pohon yang terlalu dalam dengan overhead rekursi tinggi."
        ],
        refTitle: "Stephen M. Omohundro: Five Balltree Construction Algorithms (International Computer Science Institute Berkeley)",
        refUrl: "https://www.icsi.berkeley.edu/icsi/node/2215"
      },
      {
        num: "7.8",
        slug: "7-8-kutukan-dimensi-curse-of-dimensionality-ruang-metrik",
        title: "7.8. Kutukan Dimensi (Curse of Dimensionality) pada Ruang Metrik Spasial",
        desc: "Dinamika patologis geometri dimensi tinggi: fenomena konsentrasi jarak Euklides, kekosongan ruang hiper-kubus, dan hilangnya daya diskriminasi.",
        concept: `Istilah **Kutukan Dimensi** (*Curse of Dimensionality*) pertama kali diciptakan oleh Richard Bellman (1961) untuk menggambarkan kesulitan komputasi matematis saat dimensi ruang $d$ bertambah. Dalam konteks algoritma berbasis jarak seperti k-NN, kutukan dimensi memiliki dampak geometris yang sangat merusak:

**1. Fenomena Kekosongan Ruang Spasial (*Empty Space Phenomenon*):**
Volume hiper-kubus bertumbuh secara eksponensial terhadap dimensi $d$. Agar kepadatan titik data per satuan volume tetap konstan saat dimensi bertambah dari 2 ke 20, jumlah sampel yang dibutuhkan bertumbuh dari ribuan menjadi miliaran ($n \\propto 10^d$). Dalam praktiknya, jumlah sampel kita selalu terbatas, sehingga pada dimensi tinggi, seluruh titik data terisolasi saling berjauhan di ruang hampa yang kosong. Konsep 'tetangga terdekat' (*nearest neighbors*) kehilangan makna fisiknya karena tetangga terdekat sekalipun berada pada jarak yang sangat jauh.

**2. Fenomena Konsentrasi Jarak (*Distance Concentration*):**
Berdasarkan teorema statistik Beyer et al. (1999), ketika dimensi $d \\to \\infty$, selisih antara jarak ke tetangga terjauh ($d_{\\max}$) dan jarak ke tetangga terdekat ($d_{\\min}$) dari suatu titik kueri menyusut mendekati nol relatif terhadap jarak rata-rata:
$$\\lim_{d \\to \\infty} \\frac{d_{\\max} - d_{\\min}}{d_{\\min}} = 0$$
Artinya: **Pada dimensi tinggi, seluruh titik dalam dataset berada pada jarak yang hampir sama persis satu sama lain**. Metrik jarak kehilangan daya diskriminasi (*loss of contrast*), menyebabkan k-NN berkinerja tidak lebih baik daripada tebakan acak. Solusi wajibnya adalah menerapkan reduksi dimensi (PCA) atau seleksi fitur sebelum k-NN dijalankan.`,
        formula: `\\lim_{d \\to \\infty} \\frac{\\text{Var}(\\|X\\|_2)}{\\mathbb{E}[\\|X\\|_2]^2} = 0 \\implies \\text{Jarak ke seluruh titik menjadi identik homogen}`,
        code: `# 7.8: Simulasi Pembuktian Fenomena Konsentrasi Jarak Beyer et al.
import numpy as np

np.random.seed(42)
n_samples = 500
dimensi_list = [2, 10, 50, 200, 1000]

print("=== SIMULASI KUTUKAN DIMENSI (DISTANCE CONCENTRATION) ===")
print("Dimensi d | Jarak Min (d_min) | Jarak Max (d_max) | Rasio Kontras (d_max - d_min)/d_min")
for d in dimensi_list:
    # Sampel n titik acak dalam ruang d-dimensi
    X = np.random.uniform(0, 1, (n_samples, d))
    kueri = np.random.uniform(0, 1, (1, d))
    
    # Hitung jarak Euklides ke seluruh titik
    jarak = np.linalg.norm(X - kueri, axis=1)
    d_min = np.min(jarak)
    d_max = np.max(jarak)
    kontras = (d_max - d_min) / d_min
    
    print(f"{d:9d} | {d_min:17.4f} | {d_max:17.4f} | {kontras:20.4f}")`,
        expectedOutput: "Rasio kontras jarak merosot drastis dari 3.8 pada dimensi 2 menjadi 0.28 pada dimensi 1000 membuktikan hilangnya diskriminasi jarak.",
        codeExp: "Skrip membuktikan secara komputasional fenomena konsentrasi jarak di mana rasio kontras jarak (d_max - d_min)/d_min menyusut drastis mendekati nol saat dimensi bertambah.",
        pitfalls: [
          "Menjalankan k-NN langsung pada data teks mentah atau citra piksel berdimensi ribuan tanpa reduksi dimensi atau embedding padat.",
          "Menambah fitur prediktor secara membabi buta dengan asumsi semakin banyak fitur pasti semakin baik performa k-NN."
        ],
        refTitle: "Kevin Beyer, Jonathan Goldstein, Raghu Ramakrishnan, Ulrich Shaft: When is 'nearest neighbor' meaningful? (ICDT)",
        refUrl: "https://link.springer.com/chapter/10.1007/3-540-49257-7_15"
      },
      {
        num: "7.9",
        slug: "7-9-nearest-centroid-classifier-dan-radius-neighbors",
        title: "7.9. Nearest Centroid Classifier & RadiusNeighborsClassifier",
        desc: "Varian keluarga tetangga terdekat: klasifikasi berbasis centroid rata-rata kelas Rocchio dan penelusuran lingkungan radius bola tetap.",
        concept: `Pustaka Scikit-Learn menyediakan dua varian penting yang melengkapi k-NN standar untuk mengatasi keterbatasan memori dan ketidakseimbangan kepadatan data:

**1. Nearest Centroid Classifier (Rocchio Classifier):**
Alih-alih menyimpan dan membandingkan jarak ke seluruh jutaan titik data latih individual, model ini menghitung satu titik rata-rata pusat gravitasi (**Centroid** $\\boldsymbol{\\mu}_c$) untuk masing-masing kelas selama fase pelatihan:
$$\\boldsymbol{\\mu}_c = \\frac{1}{n_c} \\sum_{i: y_i = c} \\mathbf{x}_i$$
Saat inferensi, titik kueri langsung diprediksi ke kelas yang memiliki centroid terdekat:
$$\\hat{y} = \\arg\\min_c \\|\\mathbf{x}_0 - \\boldsymbol{\\mu}_c\\|_2$$
Keunggulan: Model sangat ringkas (hanya menyimpan $K$ vektor), inferensi instan $\\mathcal{O}(K \\cdot d)$, dan kebal terhadap overfitting. Model ini juga mendukung *Nearest Shrunken Centroid* (penyusutan fitur via parameter ` + "`shrink_threshold`" + `) yang sangat populer dalam klasifikasi ekspresi genetik bioinformatika.

**2. RadiusNeighborsClassifier:**
Berbeda dari k-NN yang membatasi pencarian pada jumlah titik tetap ($k$ titik terdekat tanpa peduli seberapa jauh jaraknya), model ini membatasi pencarian pada **radius jarak fisik tetap ($r$)** di sekeliling titik kueri:
$$\\mathcal{N}_r(\\mathbf{x}_0) = \\{\\mathbf{x}_i \\mid d(\\mathbf{x}_0, \\mathbf{x}_i) \\le r\\}$$
Model ini sangat ideal ketika kepadatan data tidak seragam (*sampling density varies*): jika kueri berada di daerah terpencil yang sepi, model menolak membuat prediksi palsu karena tidak ada titik dalam radius $r$ (dapat diatur ` + "`outlier_label='most_frequent'`" + `).`,
        formula: `\\hat{y}_{\\text{Centroid}} = \\arg\\min_c \\|\\mathbf{x} - \\boldsymbol{\\mu}_c\\|_2, \\quad \\mathcal{N}_r(\\mathbf{x}) = \\{x_i \\mid \\|\\mathbf{x} - x_i\\| \\le r\\}`,
        code: `# 7.9: Klasifikasi Ringkas NearestCentroid vs RadiusNeighborsClassifier
import numpy as np
from sklearn.neighbors import NearestCentroid, RadiusNeighborsClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)

# 1. Nearest Centroid Classifier (Sangat Hemat Memori: Hanya 3 Centroid!)
nc = NearestCentroid().fit(X, y)
acc_nc = nc.score(X, y)

# 2. Radius Neighbors Classifier (Radius Tetap r = 1.2)
rnc = RadiusNeighborsClassifier(radius=1.2, outlier_label='most_frequent').fit(X, y)
acc_rnc = rnc.score(X, y)

print("=== VARIAN TETANGGA TERDEKAT (NEAREST CENTROID & RADIUS) ===")
print(f"1. Nearest Centroid Akurasi : {acc_nc*100:.2f}% (Hanya menyimpan 3 titik centroid!)")
print(f"2. Radius Neighbors Akurasi : {acc_rnc*100:.2f}% (Batas radius bola r = 1.2)")`,
        expectedOutput: "Nearest Centroid mencapai akurasi 93% hanya dengan menyimpan 3 titik pusat centroid.",
        codeExp: "Skrip mendemonstrasikan implementasi dua varian keluarga tetangga terdekat alternatif: model berbasis prototipe centroid kompak dan model berbasis radius bola fisik tetap.",
        pitfalls: [
          "Menggunakan Nearest Centroid pada data yang memiliki distribusi kelas multimodal atau bentuk donat (karena centroid jatuh tepat di area kosong di tengah).",
          "Menyetel radius r terlalu kecil pada RadiusNeighborsClassifier yang menyebabkan banyak titik kueri tidak memiliki tetangga sama sekali."
        ],
        refTitle: "Robert Tibshirani, Trevor Hastie, Balasubramanian Narasimhan, Gilbert Chu: Diagnosis of multiple cancer types by shrunken centroids of gene expression (PNAS)",
        refUrl: "https://www.pnas.org/doi/10.1073/pnas.082099299"
      },
      {
        num: "7.10",
        slug: "7-10-implementasi-k-nn-sederhana-numpy-dari-nol",
        title: "7.10. Implementasi Fungsi Pencarian Tetangga Terdekat Sederhana Menggunakan NumPy",
        desc: "Konstruksi mesin k-NN murni dari aljabar linier: implementasi komputasi matriks jarak, partisi parsial argpartition efisien, dan voting mayoritas.",
        concept: `Untuk memahami secara tuntas alur komputasi k-NN, kita membangun kelas ` + "`CustomKNNClassifier`" + ` lengkap dari dasar NumPy murni.

Salah satu kunci optimasi komputasi k-NN tingkat lanjut adalah **menghindari pengurutan penuh** (*full sort*). Jika kita memiliki $n = 100.000$ titik dan hanya membutuhkan $k = 5$ tetangga terdekat, mengurutkan seluruh jarak menggunakan ` + "`np.argsort()`" + ` memiliki kompleksitas $\\mathcal{O}(n \\log n)$.

Sebaliknya, kita menggunakan algoritma pemilihan parsial **` + "`np.argpartition(k)`" + `** (algoritma Introselect) yang hanya mengisolasi $k$ elemen terkecil ke sisi kiri array dalam waktu linier **$\\mathcal{O}(n)$**:
1. **Fase Fit:** Menyimpan referensi matriks latih $\\mathbf{X}_{\\text{train}}$ dan label $\\mathbf{y}_{\\text{train}}$.
2. **Kalkulasi Jarak:** Menghitung matriks jarak Euklides antara seluruh kueri $\\mathbf{X}_{\\text{test}}$ dan data latih menggunakan operasi tervektorisasi.
3. **Partisi Indeks:** Menemukan indeks $k$ tetangga terdekat menggunakan ` + "`np.argpartition`" + `.
4. **Agregasi Modus:** Mengambil label kelas dari tetangga terpilih dan menentukan kelas pemenang melalui penghitungan frekuensi kemunculan terbanyak.`,
        formula: `\\text{Kompleksitas Argpartition: } \\mathcal{O}(n) \\ll \\mathcal{O}(n \\log n) \\quad (\\text{Efisiensi Seleksi Parsial } k \\text{ Tetangga})`,
        code: `# 7.10: Implementasi Lengkap Custom KNN Classifier dari Dasar NumPy
import numpy as np
from collections import Counter
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

class CustomKNNClassifier:
    def __init__(self, k=3):
        self.k = k
        self.X_train = None
        self.y_train = None

    def fit(self, X, y):
        self.X_train = np.asarray(X)
        self.y_train = np.asarray(y)
        return self

    def predict(self, X):
        X = np.asarray(X)
        predictions = []
        
        # Vektorisasi perhitungan jarak kuadrat Euklides untuk seluruh kueri
        # ||u - v||^2 = ||u||^2 + ||v||^2 - 2 u^T v
        s_X = np.sum(X**2, axis=1, keepdims=True)
        s_train = np.sum(self.X_train**2, axis=1, keepdims=True).T
        D2 = np.maximum(0.0, s_X + s_train - 2.0 * X.dot(self.X_train.T))
        
        for i in range(X.shape[0]):
            dists = D2[i]
            # Algoritma argpartition O(n) cepat untuk mengambil k indeks terkecil
            k_indices = np.argpartition(dists, self.k)[:self.k]
            k_labels = self.y_train[k_indices]
            # Modus suara mayoritas
            majority_label = Counter(k_labels).most_common(1)[0][0]
            predictions.append(majority_label)
            
        return np.array(predictions)

# Validasi terhadap Scikit-Learn KNeighborsClassifier
np.random.seed(42)
X_tr = np.random.randn(200, 3)
y_tr = (X_tr[:, 0] + X_tr[:, 1] > 0).astype(int)
X_te = np.random.randn(50, 3)
y_te = (X_te[:, 0] + X_te[:, 1] > 0).astype(int)

custom_knn = CustomKNNClassifier(k=5).fit(X_tr, y_tr)
sklearn_knn = KNeighborsClassifier(n_neighbors=5).fit(X_tr, y_tr)

pred_custom = custom_knn.predict(X_te)
pred_sklearn = sklearn_knn.predict(X_te)

print("=== VERIFIKASI CUSTOM k-NN CLASSIFIER ===")
print(f"Akurasi Custom k-NN  : {accuracy_score(y_te, pred_custom)*100:.2f}%")
print(f"Akurasi Scikit-Learn : {accuracy_score(y_te, pred_sklearn)*100:.2f}%")
print(f"Kesesuaian Prediksi  : {(pred_custom == pred_sklearn).mean()*100:.2f}% (Identik Sempurna)")`,
        expectedOutput: "Prediksi Custom KNN menghasilkan akurasi identik sempurna 100% dengan Scikit-Learn KNeighborsClassifier.",
        codeExp: "Skrip membangun mesin k-NN lengkap dari aljabar linier murni NumPy dengan optimasi pemilihan tetangga np.argpartition berkecepatan O(n) dan memverifikasi kesesuaiannya dengan Scikit-Learn.",
        pitfalls: [
          "Menggunakan perulangan bersarang python murni untuk menghitung jarak titik-demi-titik yang memperlambat komputasi hingga ratusan kali.",
          "Menangani hasil suara seri (tie-break) secara deterministik sembarangan tanpa mekanisme fallback acak atau reduksi k."
        ],
        refTitle: "Scikit-Learn User Guide: Nearest Neighbors",
        refUrl: "https://scikit-learn.org/stable/modules/neighbors.html"
      }
    ]
  }
];
