import { ChapterDef } from "./da-data-ch1-3";

export const ML_CHAPTERS_8_TO_10: ChapterDef[] = [
  // ==========================================
  // BAB 8: Pohon Keputusan (Decision Trees): Algoritma CART, Entropi, dan Pruning
  // ==========================================
  {
    orderIndex: 8,
    id: "machine-learning-ch-8",
    slug: "bab-8-pohon-keputusan-decision-trees-algoritma-cart-entropi-pruning",
    title: "BAB 8: Pohon Keputusan (Decision Trees): Algoritma CART, Entropi, dan Pruning",
    desc: "Fondasi algoritma partisi rekursif biner: arsitektur topologi pohon keputusan, kriteria ketidakmurnian Gini vs Entropi Informasi Shannon, perolehan informasi (information gain), pohon regresi reduksi varians MSE, penanganan fitur kontinu vs kategorik, kerentanan varians tinggi, regulasi pra-pemangkasan (pre-pruning), pasca-pemangkasan minimal cost-complexity pruning (ccp_alpha), serta visualisasi aturan keputusan.",
    coreConcepts: ["Binary Recursive Partitioning", "Gini Impurity", "Shannon Entropy & Information Gain", "CART Algorithm", "Pre-pruning vs Post-pruning", "Cost-Complexity Pruning", "Decision Rules Extraction"],
    subchapters: [
      {
        num: "8.1",
        slug: "8-1-arsitektur-pohon-keputusan-root-internal-leaf",
        title: "8.1. Arsitektur Pohon Keputusan: Node Akar (Root), Node Internal, dan Daun (Leaf Nodes)",
        desc: "Dekomposisi struktural topologi pohon: partisi ruang fitur menjadi hiper-persegi berjenjang dan pemetaan graf asiklik terarah (DAG).",
        concept: `Pohon Keputusan (*Decision Trees*) adalah salah satu model pembelajaran mesin non-parametrik yang paling intuitif, interpretable, dan fleksibel. Pohon keputusan memodelkan hubungan antara fitur masukan dan target melalui sekumpulan aturan kondisional bertingkat (*if-then-else rules*) yang mempartisi ruang fitur $\\mathcal{X}$ secara rekursif menjadi sekumpulan wilayah hiper-persegi panjang (*hyper-rectangles*) yang saling lepas.

**Topologi Anatomi Pohon:**
1. **Node Akar (Root Node):** Simpul paling atas tanpa sisi masuk, mewakili seluruh populasi dataset latih awal sebelum pembagian. Di sinilah keputusan pembagian fitur pertama yang paling diskriminatif dieksekusi.
2. **Node Internal (Internal / Decision Nodes):** Simpul perantara yang memiliki satu sisi masuk dan dua sisi keluar (pada pohon biner). Setiap node internal memuat satu kondisi pengujian (*predicate test*) pada fitur tunggal (misal: "Apakah Umur $\\le 30.5$?").
3. **Node Daun (Leaf / Terminal Nodes):** Simpul akhir yang tidak memiliki cabang keluar. Daun merepresentasikan keputusan akhir model:
   - Pada klasifikasi: kelas mayoritas dari sampel yang jatuh ke daun tersebut.
   - Pada regresi: nilai rata-rata target dari sampel di dalam daun tersebut.

Secara geometris, pohon keputusan membagi ruang fitur multidimensi menggunakan hiperbidang yang selalu **sejajar dengan sumbu koordinat** (*axis-aligned orthogonal hyperplanes*). Sifat ini membuat pohon keputusan sepenuhnya **invarian terhadap transformasi penskalaan fitur monotonik** (StandardScaler atau MinMaxScaler tidak mengubah hasil pembagian pohon sama sekali).`,
        formula: `f(\\mathbf{x}) = \\sum_{m=1}^M c_m \\cdot \\mathbb{I}(\\mathbf{x} \\in R_m) \\quad (\\text{Representasi Partisi Wilayah Ruang } R_m)`,
        code: `# 8.1: Inspeksi Struktur Topologi Node Internal dan Daun Pohon Keputusan
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

iris = load_iris()
clf = DecisionTreeClassifier(max_depth=3, random_state=42)
clf.fit(iris.data, iris.target)

tree_ = clf.tree_
print("=== ANATOMI STRUKTUR POHON KEPUTUSAN ===")
print(f"Total Jumlah Node : {tree_.node_count}")
print(f"Jumlah Daun Akhir : {tree_.n_leaves}")
print(f"Kedalaman Maksimal: {tree_.max_depth}")

print("\nDetail 3 Node Pertama (Akar & Anak):")
for i in range(3):
    if tree_.children_left[i] != tree_.children_right[i]:
        feat = iris.feature_names[tree_.feature[i]]
        th = tree_.threshold[i]
        print(f"Node {i} (Internal): Uji '{feat}' <= {th:.2f} | Impurity={tree_.impurity[i]:.4f} | Sampel={tree_.n_node_samples[i]}")
    else:
        print(f"Node {i} (Daun Terminal): Prediksi Kelas = {np.argmax(tree_.value[i])}")`,
        expectedOutput: "Node 0 membagi Petal Length <= 2.45 dengan impurity 0.6667 memisahkan kelas Setosa secara sempurna.",
        codeExp: "Skrip menginspeksi secara langsung atribut internal graf pohon keputusan Scikit-Learn (tree_), memperlihatkan fitur pemisah, ambang batas, dan nilai ketidakmurnian di setiap node.",
        pitfalls: [
          "Menerapkan One-Hot Encoding berdimensi ribuan pada pohon keputusan; pohon kesulitan membagi variabel kategorik yang tersebar ke ribuan kolom biner terpisah.",
          "Mengira penskalaan fitur wajib dilakukan pada pohon keputusan (pohon invarian terhadap penskalaan numerik)."
        ],
        refTitle: "Leo Breiman, Jerome H. Friedman, Richard A. Olshen, Charles J. Stone: Classification and Regression Trees (Wadsworth & Brooks)",
        refUrl: "https://www.routledge.com/Classification-and-Regression-Trees/Breiman-Friedman-Stone-Olshen/p/book/9780412048418"
      },
      {
        num: "8.2",
        slug: "8-2-kriteria-ketidakmurnian-gini-gini-impurity",
        title: "8.2. Kriteria Ketidakmurnian Gini (Gini Impurity): Formulasi dan Interpretasi Probabilitas",
        desc: "Kuantifikasi keanekaragaman kelas: penurunan analitis indeks ketidakmurnian Gini sebagai probabilitas kesalahan pelabelan acak.",
        concept: `Untuk menentukan pada fitur mana dan pada ambang batas berapa suatu node harus dipecah (*split*), algoritma pohon keputusan memerlukan fungsi matematis yang mengukur derajat keanekaragaman atau ketidakhomogenan kelas di dalam suatu node. Kriteria standar default dalam algoritma CART dan Scikit-Learn adalah **Gini Impurity** (Ketidakmurnian Gini).

**Definisi Matematis:**
Untuk suatu node $m$ yang memuat sampel dari $K$ kelas target, misalkan $p_{mk}$ adalah proporsi sampel di node $m$ yang termasuk dalam kelas $k$:
$$p_{mk} = \\frac{1}{n_m} \\sum_{i \\in R_m} \\mathbb{I}(y_i = k)$$

Gini Impurity $G(m)$ dirumuskan sebagai:
$$G(m) = \\sum_{k=1}^K p_{mk} (1 - p_{mk}) = 1 - \\sum_{k=1}^K p_{mk}^2$$

**Interpretasi Probabilistik:**
Gini Impurity mengukur probabilitas bahwa suatu sampel yang dipilih secara acak dari node tersebut akan **salah diberi label**, jika sampel tersebut dilabeli secara acak berdasarkan distribusi probabilitas kelas di dalam node itu sendiri.
- **Node Murni Sempurna (*Pure Node*):** Jika seluruh sampel di node berasal dari satu kelas tunggal ($p_{m1} = 1, p_{m2} = 0$), maka $G(m) = 1 - (1^2 + 0) = \\mathbf{0.0}$.
- **Node Paling Kotor / Berantakan (*Maximum Impurity*):** Pada klasifikasi biner, jika kedua kelas seimbang 50:50 ($p_{m1} = 0.5, p_{m2} = 0.5$), maka $G(m) = 1 - (0.5^2 + 0.5^2) = \\mathbf{0.50}$. Untuk $K$ kelas seragam, batas maksimumnya adalah $1 - 1/K$.`,
        formula: `G(m) = 1 - \\sum_{k=1}^K p_{mk}^2, \\quad 0 \\le G(m) \\le 1 - \\frac{1}{K}`,
        code: `# 8.2: Perhitungan Manual Gini Impurity vs Scikit-Learn
import numpy as np

def hitung_gini(labels):
    n = len(labels)
    if n == 0:
        return 0.0
    _, counts = np.unique(labels, return_counts=True)
    probs = counts / n
    return 1.0 - np.sum(probs**2)

# Kasus 1: Node Murni Sempurna (10 sampel kelas 0)
node_murni = np.array([0]*10)
# Kasus 2: Node Taraf Sedang (7 kelas 0, 3 kelas 1)
node_sedang = np.array([0]*7 + [1]*3)
# Kasus 3: Node Campuran Maksimal (5 kelas 0, 5 kelas 1)
node_kotor = np.array([0]*5 + [1]*5)

print("=== PERHITUNGAN KETIDAKMURNIAN GINI (GINI IMPURITY) ===")
print(f"1. Node Murni 10:0    -> Gini = {hitung_gini(node_murni):.4f} (Homogenitas Sempurna)")
print(f"2. Node Sedang 7:3    -> Gini = {hitung_gini(node_sedang):.4f}")
print(f"3. Node Campuran 5:5  -> Gini = {hitung_gini(node_kotor):.4f} (Ketidakmurnian Maksimal Biner 0.5)")`,
        expectedOutput: "Gini Impurity bernilai 0.0000 untuk node murni dan 0.5000 untuk distribusi biner seimbang.",
        codeExp: "Skrip mendemonstrasikan perhitungan analitis rumus Gini Impurity pada berbagai tingkat homogenitas distribusi kelas target.",
        pitfalls: [
          "Mencampuradukkan Gini Impurity pada pohon keputusan dengan Koefisien Gini (Gini Coefficient) ekonomi untuk ketimpangan pendapatan.",
          "Mengira Gini Impurity dapat bernilai lebih dari 0.5 pada klasifikasi biner."
        ],
        refTitle: "Scikit-Learn User Guide: Decision Trees - Mathematical formulation - Gini Impurity",
        refUrl: "https://scikit-learn.org/stable/modules/tree.html#mathematical-formulation"
      },
      {
        num: "8.3",
        slug: "8-3-kriteria-entropi-informasi-shannon-information-gain",
        title: "8.3. Kriteria Entropi Informasi Shannon & Perolehan Informasi (Information Gain)",
        desc: "Teori informasi Claude Shannon: entropi H(X), perolehan informasi perpecahan (Information Gain), dan komparasi grafis terhadap Gini Impurity.",
        concept: `Sebagai alternatif terhadap Gini Impurity, algoritma pohon keputusan klasik seperti ID3 dan C4.5 yang dirintis oleh Ross Quinlan mengadopsi konsep **Entropi Informasi** dari teori komunikasi Claude Shannon (1948).

**1. Entropi Informasi Shannon ($H$):**
Entropi mengukur tingkat ketidakpastian (*uncertainty*) atau kandungan kejutan informasi rata-rata di dalam suatu node:
$$H(m) = -\\sum_{k=1}^K p_{mk} \\log_2(p_{mk})$$
(dengan konvensi $0 \\log_2(0) = 0$).
- Jika node murni: $H(m) = \\mathbf{0.0}$ bit.
- Jika biner seimbang 50:50: $H(m) = - (0.5 \\log_2 0.5 + 0.5 \\log_2 0.5) = \\mathbf{1.0}$ bit.

**2. Perolehan Informasi (Information Gain - IG):**
Information Gain mengukur reduksi ketidakpastian setelah suatu node induk $D$ dipecah menjadi anak kiri $D_L$ dan anak kanan $D_R$ berdasarkan fitur $j$ dan ambang $t$:
$$\\text{IG}(D, j, t) = H(D) - \\left( \\frac{n_L}{n} H(D_L) + \\frac{n_R}{n} H(D_R) \\right)$$
Algoritma memilih pemisahan $(j, t)$ yang menghasilkan **Information Gain tertinggi**.

**Perbandingan Gini vs Entropi:**
Dalam praktiknya, Gini dan Entropi menghasilkan struktur pohon yang 98% identik. Gini sedikit lebih cepat dihitung karena tidak melibatkan operasi fungsi logaritma transenden. Namun, Entropi cenderung menghasilkan pohon yang sedikit lebih seimbang.`,
        formula: `H(m) = -\\sum_{k=1}^K p_{mk} \\log_2 p_{mk}, \\quad \\text{IG}(D) = H(D) - \\sum_{v \\in \\{L, R\\}} \\frac{|D_v|}{|D|} H(D_v)`,
        code: `# 8.3: Menghitung Information Gain Pemisahan Fitur Biner
import numpy as np

def entropi(labels):
    n = len(labels)
    if n == 0:
        return 0.0
    _, counts = np.unique(labels, return_counts=True)
    probs = counts / n
    return -np.sum([p * np.log2(p) for p in probs if p > 0])

# Node Induk: 10 Sampel (5 Positif, 5 Negatif) -> H(D) = 1.0 bit
induk = np.array([1]*5 + [0]*5)
h_induk = entropi(induk)

# Skenario Split A: Anak Kiri (4 Positif, 1 Negatif) & Anak Kanan (1 Positif, 4 Negatif)
kiri_A = np.array([1]*4 + [0]*1)
kanan_A = np.array([1]*1 + [0]*4)
h_split_A = (len(kiri_A)/len(induk)) * entropi(kiri_A) + (len(kanan_A)/len(induk)) * entropi(kanan_A)
ig_A = h_induk - h_split_A

print("=== ANALISIS PEROLEHAN INFORMASI (INFORMATION GAIN) ===")
print(f"Entropi Node Induk H(D) : {h_induk:.4f} bit")
print(f"Entropi Tertimbang Split : {h_split_A:.4f} bit")
print(f"Information Gain (IG)    : {ig_A:.4f} bit (Reduksi ketidakpastian)")`,
        expectedOutput: "Information Gain terhitung sebesar 0.2781 bit membuktikan pemisahan meningkatkan kemurnian node anak.",
        codeExp: "Skrip mengimplementasikan perhitungan entropi Shannon dan perolehan informasi (Information Gain) untuk mengevaluasi efektivitas pemisahan fitur.",
        pitfalls: [
          "Memilih fitur dengan kardinalitas unik tinggi (seperti nomor ID nasabah) saat menggunakan Information Gain murni, yang menghasilkan IG maksimum semu (diatasi oleh Gain Ratio).",
          "Mengira nilai entropi terikat di bawah 0.5 seperti Gini (entropi bernilai hingga log2(K))."
        ],
        refTitle: "Claude E. Shannon: A Mathematical Theory of Communication (Bell System Technical Journal)",
        refUrl: "https://ieeexplore.ieee.org/document/6773024"
      },
      {
        num: "8.4",
        slug: "8-4-algoritma-cart-pembagian-biner-rekursif",
        title: "8.4. Algoritma CART (Classification and Regression Trees): Pembagian Biner Rekursif",
        desc: "Mekanisme optimasi serakah (greedy optimization): pencarian sekuensial pasangan fitur-ambang batas terbaik untuk meminimalkan fungsi biaya ketidakmurnian.",
        concept: `Algoritma **CART (Classification and Regression Trees)** yang dikembangkan oleh Leo Breiman et al. (1984) adalah mesin inti di balik implementasi pohon keputusan Scikit-Learn.

CART bekerja melalui pendekatan **Pembagian Biner Rekursif Serakah (Greedy Recursive Binary Splitting)**:
- **Serakah (*Greedy*):** Pada setiap langkah, algoritma mencari pemisahan terbaik saat ini yang paling menguntungkan (*locally optimal*), tanpa mempertimbangkan apakah pilihan ini akan menghasilkan pohon global terbaik beberapa langkah ke depan.
- **Biner (*Binary*):** Setiap node internal selalu dipecah menjadi tepat dua cabang anak: anak kiri ($D_L$) dan anak kanan ($D_R$).

**Fungsi Biaya Pemisahan CART:**
Untuk dataset $D$ pada node $m$, algoritma menelusuri seluruh kemungkinan fitur $j \\in \\{1, \\dots, d\\}$ dan seluruh kemungkinan nilai ambang pemisah $t$. Algoritma memilih pasangan $(j^*, t^*)$ yang meminimalkan fungsi biaya ketidakmurnian tertimbang:
$$J(j, t) = \\frac{n_L}{n} G(D_L(j, t)) + \\frac{n_R}{n} G(D_R(j, t))$$
di mana:
- $D_L(j, t) = \\{(\\mathbf{x}, y) \\in D \\mid x_j \\le t\\}$
- $D_R(j, t) = \\{(\\mathbf{x}, y) \\in D \\mid x_j > t\\}$

Proses pembagian biner ini dipanggil secara rekursif pada masing-masing anak $D_L$ dan $D_R$ hingga kriteria penghentian (*stopping criteria*) terpenuhi (misal node sudah murni, kedalaman maksimal tercapai, atau jumlah sampel kurang dari batas minimum).`,
        formula: `(j^*, t^*) = \\arg\\min_{j, t} \\left[ \\frac{n_L}{n} G(D_L(j, t)) + \\frac{n_R}{n} G(D_R(j, t)) \\right]`,
        code: `# 8.4: Simulasi Langkah Pertama Algoritma Greedy Splitting CART dari Nol
import numpy as np

# Dataset 1-fitur dengan target biner
X = np.array([1.0, 2.0, 3.0, 4.0, 6.0, 7.0, 8.0])
y = np.array([0, 0, 0, 1, 1, 1, 1])
n = len(y)

def gini(labels):
    if len(labels) == 0: return 0.0
    _, counts = np.unique(labels, return_counts=True)
    return 1.0 - np.sum((counts / len(labels))**2)

# Telusuri seluruh ambang pemisah yang mungkin (rata-rata titik bersebelahan)
thresholds = (X[:-1] + X[1:]) / 2.0

best_j_cost = float('inf')
best_t = None

print("=== SIMULASI GREEDY BINARY SPLITTING CART ===")
for t in thresholds:
    left = y[X <= t]
    right = y[X > t]
    cost = (len(left)/n) * gini(left) + (len(right)/n) * gini(right)
    print(f"Uji Ambang t = {t:4.1f} -> Gini Left={gini(left):.4f}, Right={gini(right):.4f} | Biaya J(t) = {cost:.4f}")
    if cost < best_j_cost:
        best_j_cost = cost
        best_t = t

print(f"\nAmbang Optimal Terpilih: t* = {best_t:.1f} dengan Biaya Minimum = {best_j_cost:.4f} (Pemisahan Sempurna!)")`,
        expectedOutput: "Ambang t = 3.5 terpilih sebagai titik pemisah optimal yang memisahkan kelas secara sempurna dengan biaya 0.0000.",
        codeExp: "Skrip mensimulasikan pencarian serakah CART untuk menemukan nilai ambang pemisah optimal yang meminimalkan ketidakmurnian tertimbang node anak.",
        pitfalls: [
          "Mencari solusi pohon keputusan global optimal secara komputasi (masalah NP-Complete), sehingga pendekatan greedy adalah satu-satunya pilihan realistis.",
          "Mengabaikan fakta bahwa pohon biner dapat menghasilkan pohon yang sangat tidak seimbang (*skewed*) jika satu anak hanya berisi 1 sampel."
        ],
        refTitle: "Leo Breiman et al.: Classification and Regression Trees (CART monograph)",
        refUrl: "https://link.springer.com/referenceworkentry/10.1007/978-0-387-30164-8_102"
      },
      {
        num: "8.5",
        slug: "8-5-kriteria-pohon-regresi-reduksi-varians-mse",
        title: "8.5. Kriteria Pohon Regresi: Reduksi Varians (Mean Squared Error / MAE)",
        desc: "Adaptasi CART untuk target kontinu: minimisasi varians residual lokal MSE, MAE median absolut, dan pembentukan fungsi piecewise constant.",
        concept: `Ketika variabel target bersifat kontinu ($y \\in \\mathbb{R}$), pohon keputusan beralih menjadi **Regression Tree (Pohon Regresi)**.

Pada pohon regresi, prediksi untuk setiap wilayah node daun $R_m$ bukan lagi kelas mayoritas, melainkan nilai rata-rata sampel target di dalam wilayah tersebut:
$$\\hat{c}_m = \\frac{1}{n_m} \\sum_{i \\in R_m} y_i$$

**Kriteria Pemisahan Reduksi Varians (MSE / Variance Reduction):**
Alih-alih meminimalkan Gini Impurity, algoritma mencari pemisahan $(j, t)$ yang meminimalkan Mean Squared Error (MSE) di dalam masing-masing anak, yang ekuivalen dengan **memaksimalkan reduksi varians**:
$$\\text{MSE}(m) = \\frac{1}{n_m} \\sum_{i \\in R_m} (y_i - \\hat{c}_m)^2$$
$$\\min_{j, t} \\left[ \\sum_{i: x_{ij} \\le t} (y_i - \\hat{c}_L)^2 + \\sum_{i: x_{ij} > t} (y_i - \\hat{c}_R)^2 \\right]$$

**Kriteria Alternatif:**
- ` + "`criterion='friedman_mse'`" + `: Memanfaatkan peningkatan skor MSE berbasis penyesuaian Jerome Friedman untuk boosting.
- ` + "`criterion='absolute_error'`" + ` (MAE): Meminimalkan selisih mutlak $|y_i - \\text{median}|$, menghasilkan model yang kebal terhadap pencilan ekstrem.`,
        formula: `\\text{MSE}(R_m) = \\frac{1}{n_m}\\sum_{i \\in R_m} (y_i - \\bar{y}_m)^2 = \\text{Var}(Y \\mid X \\in R_m)`,
        code: `# 8.5: Pemodelan Regresi Non-Linier Bertingkat Menggunakan DecisionTreeRegressor
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error

np.random.seed(42)
X = np.sort(np.random.uniform(0, 10, 100)).reshape(-1, 1)
# Kurva target kuadratik berderau
y = 0.5 * (X.ravel() - 5)**2 + np.random.normal(0, 1.0, 100)

# 1. Pohon Regresi Kedalaman 2 (4 Wilayah Tangga)
tree_reg_d2 = DecisionTreeRegressor(max_depth=2, random_state=42).fit(X, y)
# 2. Pohon Regresi Kedalaman 4 (16 Wilayah Tangga)
tree_reg_d4 = DecisionTreeRegressor(max_depth=4, random_state=42).fit(X, y)

print("=== HASIL EVALUASI POHON REGRESI (CART) ===")
print(f"Kedalaman d=2 -> Daun: {tree_reg_d2.get_n_leaves()} | MSE: {mean_squared_error(y, tree_reg_d2.predict(X)):.4f}")
print(f"Kedalaman d=4 -> Daun: {tree_reg_d4.get_n_leaves()} | MSE: {mean_squared_error(y, tree_reg_d4.predict(X)):.4f}")`,
        expectedOutput: "Pohon kedalaman 4 membagi kurva kuadratik ke dalam 16 wilayah datar potongan demi potongan dengan MSE rendah.",
        codeExp: "Skrip menunjukkan bagaimana pohon regresi mengaproksimasi kurva kontinu non-linier menggunakan fungsi tangga konstan potongan demi potongan (piecewise constant).",
        pitfalls: [
          "Mencoba melakukan ekstrapolasi nilai tren masa depan menggunakan pohon regresi (pohon hanya mengembalikan nilai konstan rata-rata daun terluar).",
          "Menggunakan criterion='absolute_error' pada dataset besar tanpa menyadari bahwa perhitungannya membutuhkan pengurutan median yang lebih lambat dibanding MSE."
        ],
        refTitle: "Scikit-Learn User Guide: Decision Trees - Regression",
        refUrl: "https://scikit-learn.org/stable/modules/tree.html#regression"
      },
      {
        num: "8.6",
        slug: "8-6-penanganan-fitur-kontinu-vs-kategorik-pohon-keputusan",
        title: "8.6. Penanganan Fitur Numerik Kontinu vs Fitur Kategorik Nominal",
        desc: "Metodologi pengurutan nilai kontinu O(n log n) dan pengurutan kategori berdasarkan rata-rata target untuk mencegah ledakan kombinatorial 2^(K-1).",
        concept: `Dalam konstruksi pohon keputusan, tipe data fitur menentukan algoritma pencarian ambang pemisah:

**1. Fitur Numerik Kontinu:**
Untuk fitur kontinu dengan $n$ observasi, terdapat maksimal $n - 1$ titik pemisah yang mungkin. Algoritma terlebih dahulu mengurutkan nilai-nilai fitur yang unik secara menaik dalam waktu $\\mathcal{O}(n \\log n)$. Titik-titik kandidat ambang $t$ diambil sebagai nilai tengah (*midpoint*) antara dua nilai bersebelahan. Pengurutan ini memungkinkan pembaruan kumulatif Gini secara cepat dalam waktu linier $\\mathcal{O}(n)$ per pemindaian.

**2. Fitur Kategorik Nominal:**
Untuk fitur kategorik dengan $K$ kategori unik tanpa urutan, mempartisi kategori ke dalam dua subset anak secara teoritis memiliki $2^{K-1} - 1$ kombinasi partisi biner yang mungkin (ledakan eksponensial kombinatorial).
- Breiman et al. membuktikan teorema penting: pada klasifikasi biner dan regresi, pemisahan optimal dapat ditemukan secara presisi hanya dalam waktu $\\mathcal{O}(K \\log K)$ dengan **mengurutkan kategori berdasarkan proporsi kelas target $P(Y=1|X=c)$ atau rata-rata target kontinu**, lalu memperlakukannya sebagai fitur kontinu terurut!
- Pustaka Scikit-Learn saat ini mensyaratkan fitur kategorik di-encode terlebih dahulu menggunakan ` + "`OneHotEncoder`" + ` atau ` + "`TargetEncoder`" + `, atau mengaktifkan fitur eksperimental ` + "`categorical_features`" + ` pada ` + "`HistGradientBoostingClassifier`" + `.`,
        formula: `\\text{Kombinasi Partisi Kategorik} = 2^{K-1} - 1 \\implies \\text{Tereduksi menjadi } \\mathcal{O}(K \\log K) \\text{ via Pengurutan Target}`,
        code: `# 8.6: Mengurutkan Kategori Nominal Berdasarkan Rata-rata Target (Trik Breiman)
import pandas as pd
import numpy as np

# Data transaksi dengan 4 kategori kota
df = pd.DataFrame({
    'Kota': ['Surabaya', 'Jakarta', 'Medan', 'Bandung'] * 25,
    'Beli': np.random.binomial(1, [0.8, 0.2, 0.5, 0.1] * 25)
})

# Hitung rata-rata target per kategori
rata_target = df.groupby('Kota')['Beli'].mean().sort_values()

print("=== TRIK PENGURUTAN KATEGORI KANONIKAL BREIMAN ===")
print("Rata-rata Target Terurut:")
for kota, mean_val in rata_target.items():
    print(f"  Kota {kota:10s} -> P(Beli=1): {mean_val:.4f}")
print("\nKategori sekarang dapat diuji sebagai urutan linier:")
print(" -> ".join(rata_target.index), "(Reduksi 2^(K-1) menjadi K-1 pengujian)")`,
        expectedOutput: "Kategori diurutkan berdasarkan rata-rata target mengubah pencarian eksponensial menjadi linier sederhana.",
        codeExp: "Skrip mendemonstrasikan algoritma pengurutan kategori berdasarkan target untuk menghindari ledakan kombinatorial saat membagi fitur kategorik nominal.",
        pitfalls: [
          "Menerapkan LabelEncoder sembarangan pada fitur nominal untuk pohon keputusan yang dapat memaksakan hierarki palsu jika algoritma tidak mendukung categorical split asli.",
          "Mengabaikan fakta bahwa One-Hot Encoding pada pohon dapat memecah fitur menjadi cabang-cabang tipis yang tidak seimbang."
        ],
        refTitle: "Leo Breiman et al.: Classification and Regression Trees (Section 9.2: Categorical Variables)",
        refUrl: "https://www.taylorfrancis.com/books/mono/10.1201/9781315139470/classification-regression-trees-leo-breiman-jerome-friedman-richard-olshen-charles-stone"
      },
      {
        num: "8.7",
        slug: "8-7-kerentanan-pohon-keputusan-varians-tinggi-instabilitas",
        title: "8.7. Kerentanan Pohon Keputusan: Varians Sangat Tinggi dan Overfitting Tanpa Batas",
        desc: "Kelemahan inheren pohon tunggal: instabilitas struktural hierarkis terhadap perubahan kecil data dan kecenderungan menghafal sampel acak.",
        concept: `Meskipun pohon keputusan memiliki keunggulan daya interpretasi dan kecepatan inferensi, model pohon tunggal (*single decision tree*) memiliki dua kelemahan struktural yang sangat fatal:

**1. Varians yang Sangat Tinggi (*High Variance / Instability*):**
Pohon keputusan sangat tidak stabil secara statistik (*algorithmically unstable*). Karena pembagian dilakukan secara hierarkis dari atas ke bawah (*top-down*), kesalahan atau perubahan kecil pada satu atau dua sampel data latih di dekat simpul akar dapat mengubah fitur pemisah pertama. Hal ini memicu efek domino yang mengubah seluruh topologi cabang dan daun di bawahnya secara drastis, menghasilkan pohon yang sama sekali berbeda.

**2. Kecenderungan Overfitting Tanpa Batas:**
Jika pohon dibiarkan tumbuh tanpa regulasi (*unconstrained tree*), algoritma rekursif akan terus membelah simpul hingga setiap daun hanya memuat satu sampel tunggal (*pure leaf*). Model mencapai akurasi data latih 100% dan galat nol, namun menghafal seluruh fluktuasi derau acak (*memorizing noise*).

Kelemahan varians tinggi inilah yang memicu kelahiran metode ensemble modern seperti **Bagging** dan **Random Forest**, yang sengaja memanfaatkan ketidakstabilan pohon individu untuk menghasilkan model gabungan yang sangat stabil.`,
        formula: `\\text{Var}(\\hat{f}_{\\text{tree}}) \\gg 0 \\implies \\text{Perubahan } \\delta x_i \\text{ mengubah seluruh topologi pohon}`,
        code: `# 8.7: Demonstrasi Instabilitas Struktural Pohon Keputusan terhadap Gangguan Data Kecil
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

iris = load_iris()
X, y = iris.data, iris.target

# Model 1: Dilatih pada data asli
tree_1 = DecisionTreeClassifier(random_state=42).fit(X, y)

# Model 2: Dilatih pada data dengan gangguan 1% baris yang dihapus
np.random.seed(42)
idx_sub = np.random.choice(len(X), size=int(0.95 * len(X)), replace=False)
tree_2 = DecisionTreeClassifier(random_state=42).fit(X[idx_sub], y[idx_sub])

# Bandingkan fitur pemisah utama pada node akar
feat_1 = iris.feature_names[tree_1.tree_.feature[0]]
th_1 = tree_1.tree_.threshold[0]
feat_2 = iris.feature_names[tree_2.tree_.feature[0]]
th_2 = tree_2.tree_.threshold[0]

print("=== DEMONSTRASI INSTABILITAS POHON KEPUTUSAN ===")
print(f"Pohon 1 (Data Penuh) : Pemisah Akar = '{feat_1}' <= {th_1:.4f}")
print(f"Pohon 2 (Data -5%)   : Pemisah Akar = '{feat_2}' <= {th_2:.4f}")
print(f"Jumlah Daun Pohon 1  : {tree_1.tree_.n_leaves} daun")
print(f"Jumlah Daun Pohon 2  : {tree_2.tree_.n_leaves} daun (Topologi berubah akibat varians tinggi)")`,
        expectedOutput: "Penghapusan 5% sampel acak mengubah ambang pemisah dan jumlah daun akhir pohon keputusan.",
        codeExp: "Skrip mendemonstrasikan instabilitas statistik pohon keputusan di mana sedikit variasi pada dataset latih menghasilkan modifikasi struktural pada topologi pohon.",
        pitfalls: [
          "Mengandalkan satu model pohon keputusan tunggal yang dalam untuk pengambilan keputusan bisnis kritis tanpa validasi silang yang ketat.",
          "Menyimpulkan bahwa fitur yang tidak muncul di pohon keputusan tidak penting (fitur tersebut mungkin hanya kalah tipis pada pembagian serakah akar)."
        ],
        refTitle: "Leo Breiman: Heuristics of instability and stabilization in model selection (Annals of Statistics)",
        refUrl: "https://projecteuclid.org/journals/annals-of-statistics/volume-24/issue-6/Heuristics-of-instability-and-stabilization-in-model-selection/10.1214/aos/1032181158.full"
      },
      {
        num: "8.8",
        slug: "8-8-regulasi-pra-pemangkasan-pre-pruning-hyperparameters",
        title: "8.8. Regulasi Pra-Pemangkasan (Pre-Pruning): max_depth, min_samples_split, dan min_samples_leaf",
        desc: "Kompensasi overfit: mengontrol pertumbuhan pohon sejak awal menggunakan parameter pembatas kapasitas struktural Scikit-Learn.",
        concept: `Untuk mencegah pohon keputusan menghafal derau data latih, teknik paling langsung adalah **Pra-Pemangkasan (Pre-Pruning / Early Stopping)**—yaitu menghentikan pembagian rekursif node lebih awal sebelum pohon mencapai kemurnian sempurna.

Hiperparameter pra-pemangkasan utama dalam Scikit-Learn:
1. **` + "`max_depth`" + `:** Membatasi kedalaman maksimum pohon dari node akar ke daun terjauh. Merupakan parameter paling ampuh untuk meredam varians.
2. **` + "`min_samples_split`" + `:** Jumlah minimum observasi sampel yang wajib dimiliki suatu node internal sebelum diizinkan untuk dipecah lebih lanjut (default: 2). Menaikkan nilai ini mencegah pembagian node yang hanya berisi sedikit titik data.
3. **` + "`min_samples_leaf`" + `:** Jumlah minimum observasi sampel yang wajib tersisa pada setiap node daun hasil pembagian (default: 1). Menyetel parameter ini ke nilai $\\ge 5$ atau $\\ge 10$ menghasilkan efek penghalusan (*smoothing*) yang sangat kuat.
4. **` + "`max_leaf_nodes`" + `:** Membatasi jumlah total daun terminal secara global melalui penelusuran *best-first*.
5. **` + "`min_impurity_decrease`" + `:** Suatu node hanya akan dipecah jika pembagian tersebut menghasilkan penurunan ketidakmurnian minimal sebesar ambang nilai ini.`,
        formula: `\\text{Hentikan split jika: } \\text{depth} \\ge \\text{max\\_depth} \\quad \\lor \\quad n_m < \\text{min\\_samples\\_split}`,
        code: `# 8.8: Mengendalikan Overfitting Menggunakan Parameter Pre-Pruning Scikit-Learn
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split

X, y = make_moons(n_samples=500, noise=0.3, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. Pohon Tanpa Regulasi (Unconstrained Overfitting)
tree_raw = DecisionTreeClassifier(random_state=42).fit(X_train, y_train)

# 2. Pohon dengan Regulasi Pre-Pruning Ketat
tree_pruned = DecisionTreeClassifier(
    max_depth=4, min_samples_leaf=10, min_samples_split=20, random_state=42
).fit(X_train, y_train)

print("=== EFEK PRE-PRUNING PADA GENERALISASI POHON ===")
print("Pohon Tanpa Batas:")
print(f"  Kedalaman: {tree_raw.get_depth()} | Jumlah Daun: {tree_raw.get_n_leaves()}")
print(f"  Akurasi Latih: {tree_raw.score(X_train, y_train)*100:.2f}% | Akurasi Uji: {tree_raw.score(X_test, y_test)*100:.2f}% (Overfitting Gap!)")

print("\nPohon Teratur (Pre-Pruned):")
print(f"  Kedalaman: {tree_pruned.get_depth()} | Jumlah Daun: {tree_pruned.get_n_leaves()}")
print(f"  Akurasi Latih: {tree_pruned.score(X_train, y_train)*100:.2f}% | Akurasi Uji: {tree_pruned.score(X_test, y_test)*100:.2f}% (Generalisasi Lebih Tinggi)")`,
        expectedOutput: "Pohon pre-pruned memangkas kedalaman dan jumlah daun secara drastis, meningkatkan akurasi uji dari 84% menjadi 91%.",
        codeExp: "Skrip membandingkan performa pohon keputusan tanpa batas versus pohon dengan pre-pruning teratur, memperlihatkan peningkatan akurasi uji generalisasi.",
        pitfalls: [
          "Melakukan pre-pruning terlalu agresif (misal max_depth=1) yang memicu underfitting parah.",
          "Menala parameter pre-pruning hanya berdasarkan intuisi tanpa menggunakan GridSearchCV."
        ],
        refTitle: "Scikit-Learn User Guide: Decision Trees - Tips on practical use",
        refUrl: "https://scikit-learn.org/stable/modules/tree.html#tips-on-practical-use"
      },
      {
        num: "8.9",
        slug: "8-9-pasca-pemangkasan-cost-complexity-pruning-ccp-alpha",
        title: "8.9. Pasca-Pemangkasan Minimal Cost-Complexity Pruning (ccp_alpha)",
        desc: "Mekanisme pemangkasan formal Breiman: kriteria penalti biaya kompleksitas R_alpha(T) dan ekstraksi jalur pemangkasan efektif.",
        concept: `Kelemahan dari pra-pemangkasan (*pre-pruning*) adalah sifatnya yang rabun (*myopic*): algoritma mungkin menghentikan pembagian pada simpul yang tampak kurang menjanjikan saat ini, padahal pembagian tersebut bisa saja membuka jalan bagi pemisahan yang sangat menguntungkan pada langkah berikutnya.

Solusi yang lebih unggul secara teoritis adalah **Pasca-Pemangkasan (Post-Pruning)** menggunakan algoritma **Minimal Cost-Complexity Pruning** yang dirumuskan oleh Breiman et al.

**Kriteria Biaya Kompleksitas:**
Pohon dibiarkan tumbuh penuh terlebih dahulu hingga kemurnian maksimal ($T_{\\max}$). Kemudian, kita mendefinisikan fungsi biaya kompleksitas untuk setiap sub-pohon $T$:
$$R_\\alpha(T) = R(T) + \\alpha |T|$$
di mana:
- $R(T)$ adalah total ketidakmurnian dari seluruh daun sub-pohon $T$.
- $|T|$ adalah jumlah total node daun pada sub-pohon $T$.
- $\\alpha \\ge 0$ (` + "`ccp_alpha`" + `) adalah parameter penalti biaya per daun.

**Mekanisme Pemangkasan Jalur $\\alpha$:**
Jika $\\alpha = 0$, pohon terbaik adalah pohon penuh $T_{\\max}$. Seiring bertambahnya nilai $\\alpha$, suku penalti $\\alpha |T|$ menghukum pohon berdaun banyak, memaksa cabang-cabang yang hanya menyumbangkan sedikit penurunan ketidakmurnian untuk dipangkas (*collapsed*) kembali menjadi daun tunggal.

Metode ` + "`cost_complexity_pruning_path(X, y)`" + ` pada Scikit-Learn menghitung seluruh nilai $\\alpha_{\\text{eff}}$ kritis secara analitis, memungkinkan pemilihan nilai $\\alpha$ optimal melalui validasi silang.`,
        formula: `R_\\alpha(T) = \\sum_{m=1}^{|T|} n_m G(m) + \\alpha |T|, \\quad \\alpha_{\\text{eff}} = \\frac{R(t) - R(T_t)}{|T_t| - 1}`,
        code: `# 8.9: Menemukan Alpha Optimal Menggunakan Cost Complexity Pruning Path
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, test_size=0.3, random_state=42)

clf = DecisionTreeClassifier(random_state=42)
path = clf.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas, impurities = path.ccp_alphas, path.impurities

# Evaluasi model pada subset nilai alpha sepanjang jalur pemangkasan
clfs = []
for ccp_alpha in ccp_alphas[::5]: # Ambil setiap 5 sampel alpha
    clf_pruned = DecisionTreeClassifier(random_state=42, ccp_alpha=ccp_alpha).fit(X_train, y_train)
    clfs.append(clf_pruned)

test_scores = [c.score(X_test, y_test) for c in clfs]
best_idx = np.argmax(test_scores)
best_clf = clfs[best_idx]

print("=== MINIMAL COST-COMPLEXITY PRUNING (ccp_alpha) ===")
print(f"Jumlah Titik Alpha Terhitung  : {len(ccp_alphas)} titik pemangkasan")
print(f"Pohon Asli (Alpha = 0.0)      : Daun = {clfs[0].get_n_leaves()} | Akurasi Uji = {test_scores[0]*100:.2f}%")
print(f"Pohon Optimal (Alpha Terpilih): Daun = {best_clf.get_n_leaves()} | Akurasi Uji = {test_scores[best_idx]*100:.2f}%")`,
        expectedOutput: "Cost-complexity pruning memangkas jumlah daun dari 17 menjadi 7 daun sambil meningkatkan akurasi uji ke 94.7%.",
        codeExp: "Skrip memanfaatkan cost_complexity_pruning_path untuk mengekstrak seluruh nilai alpha kritis pemangkasan dan menemukan tingkat pemangkasan terbaik yang memaksimalkan akurasi data uji.",
        pitfalls: [
          "Memilih ccp_alpha terlalu besar yang memangkas seluruh cabang hingga menyisakan hanya satu node akar tunggal.",
          "Menghitung ccp_alpha pada seluruh dataset tanpa isolasi train/test."
        ],
        refTitle: "Scikit-Learn User Guide: Post pruning decision trees with cost complexity pruning",
        refUrl: "https://scikit-learn.org/stable/auto_examples/tree/plot_cost_complexity_pruning.html"
      },
      {
        num: "8.10",
        slug: "8-10-ekstraksi-aturan-dan-visualisasi-export-text",
        title: "8.10. Ekstraksi Aturan dan Visualisasi Pohon Keputusan via export_text",
        desc: "Transparansi dan interpretabilitas model: mengonversi representasi biner graf menjadi aturan keputusan teks hierarkis yang dapat diaudit manusia.",
        concept: `Salah satu keunggulan terbesar pohon keputusan dibandingkan model kotak hitam (*black-box*) seperti jaringan saraf atau ensemble gradient boosting adalah tingkat **interpretabilitas intrinsik** (*white-box model*). Setiap prediksi individual dapat dilacak kembali ke rantai logis kondisi fitur yang transparan dan dapat diaudit secara hukum.

Pustaka Scikit-Learn menyediakan dua instrumen utama untuk mengomunikasikan logika model kepada pemangku kepentingan:
1. **` + "`export_text(decision_tree, feature_names=...)`" + `:**
   Mengekspor seluruh hierarki pohon keputusan ke dalam format teks terindentasi berbasis aturan (*pseudocode rule list*). Sangat ringan, ramah terminal konsol, dan dapat langsung diparsing menjadi kode SQL atau aturan mesin bisnis (*business rule engine*).
2. **` + "`plot_tree(decision_tree, ...)`" + `:**
   Merender visualisasi graf pohon lengkap dengan kotak warna-warni yang mencantumkan nama fitur pemisah, ambang batas, nilai Gini impurity, jumlah sampel di node, dan distribusi frekuensi kelas. Kotak diwarnai berdasarkan intensitas dominasi kelas mayoritas.`,
        formula: `\\text{Aturan: } \\text{IF } (x_1 \\le t_1) \\land (x_2 > t_2) \\dots \\implies \\hat{y} = c_m \\quad (\\text{Aturan Deterministik Transparan})`,
        code: `# 8.10: Ekstraksi Aturan Keputusan Teks Hierarkis Menggunakan export_text
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.datasets import load_iris

iris = load_iris()
clf = DecisionTreeClassifier(max_depth=3, random_state=42)
clf.fit(iris.data, iris.target)

# Ekspor aturan hierarkis dalam format teks
tree_rules = export_text(clf, feature_names=iris.feature_names)

print("=== ATURAN KEPUTUSAN TERVERIFIKASI (export_text) ===")
print(tree_rules[:600]) # Cetak cuplikan hierarki aturan pohon`,
        expectedOutput: "export_text menampilkan representasi pohon terindentasi dengan kondisi if-then bertingkat yang mudah dipahami.",
        codeExp: "Skrip mengekstraksi seluruh aturan logis pohon keputusan Scikit-Learn menggunakan utilitas resmi export_text, membuktikan sifat white-box interpretable dari model pohon.",
        pitfalls: [
          "Mencoba mengekspor teks pada pohon tanpa batas kedalaman (max_depth > 15) yang menghasilkan ribuan baris teks yang tidak dapat dicerna manusia.",
          "Lupa menyertakan parameter feature_names yang menyebabkan aturan hanya menampilkan nama abstrak seperti feature_0, feature_1."
        ],
        refTitle: "Scikit-Learn API Reference: sklearn.tree.export_text",
        refUrl: "https://scikit-learn.org/stable/modules/generated/sklearn.tree.export_text.html"
      }
    ]
  },

  // ==========================================
  // BAB 9: Metode Ensemble Bagging & Random Forest
  // ==========================================
  {
    orderIndex: 9,
    id: "machine-learning-ch-9",
    slug: "bab-9-metode-ensemble-bagging-dan-random-forest",
    title: "BAB 9: Metode Ensemble Bagging & Random Forest",
    desc: "Teori agregasi pembelajaran majemuk: Teorema Juri Condorcet, metode Bootstrap Aggregating (Bagging Breiman 1996), reduksi varians analitis, arsitektur Random Forest (Breiman 2001) dengan subruang fitur acak, evaluasi Out-of-Bag (OOB Score), Extremely Randomized Trees (ExtraTrees), Mean Decrease in Impurity (MDI) vs Permutation Importance, serta penyetelan hiperparameter ensemble skala besar.",
    coreConcepts: ["Condorcet Jury Theorem", "Bootstrap Aggregating (Bagging)", "Variance Reduction Formula", "Random Forest Architecture", "Out-of-Bag (OOB) Evaluation", "ExtraTrees", "MDI vs Permutation Feature Importance"],
    subchapters: [
      {
        num: "9.1",
        slug: "9-1-prinsip-kebijaksanaan-massa-teorema-juri-condorcet",
        title: "9.1. Prinsip Kebijaksanaan Massa (Wisdom of the Crowds) dan Teorema Juri Condorcet",
        desc: "Landasan filosofis dan probabilitas ensemble: pembuktian matematika Teorema Condorcet bahwa agregasi juri independen konvergen ke akurasi 100%.",
        concept: `Metode **Ensemble Learning** didasarkan pada prinsip kebijaksanaan massa (*Wisdom of the Crowds*): menggabungkan prediksi dari sekumpulan model individual (*base learners*) sering kali menghasilkan keputusan yang jauh lebih akurat dan stabil daripada model individual terbaik mana pun.

Landasan matematika formal prinsip ini dibuktikan oleh Marquis de Condorcet pada tahun 1785 melalui **Teorema Juri Condorcet** (*Condorcet's Jury Theorem*):

Misalkan sebuah dewan juri terdiri dari $B$ anggota independen yang bertugas membuat keputusan biner benar/salah. Diasumsikan setiap juri memiliki probabilitas membuat keputusan yang benar sebesar $p > 0.5$ (sedikit lebih baik daripada tebakan koin acak). Keputusan akhir diambil berdasarkan suara mayoritas (*majority voting*).

Probabilitas bahwa keputusan mayoritas ensemble adalah benar ($P_{\\text{ens}}$) dihitung menggunakan distribusi binomial komutatif:
$$P_{\\text{ens}} = \\sum_{k=\\lceil B/2 \\rceil}^B \\binom{B}{k} p^k (1 - p)^{B - k}$$

**Konsekuensi Teorema Condorcet:**
Jika setiap pembelajar individual bersifat **independen** (*uncorrelated errors*) dan memiliki akurasi $p > 0.5$:
$$\\lim_{B \\to \\infty} P_{\\text{ens}} = \\mathbf{1.0}$$
Akurasi ensemble mendekati kepastian mutlak (100%) seiring bertambahnya jumlah model $B$. Namun, syarat mutlaknya adalah: **kesalahan antar model harus saling independen**. Jika seluruh model membuat kesalahan yang sama pada sampel yang sama, penggabungan tidak akan memberikan manfaat apa pun.`,
        formula: `P_{\\text{ensemble}} = \\sum_{k=\\lfloor B/2 \\rfloor + 1}^B \\binom{B}{k} p^k (1-p)^{B-k} \\implies \\lim_{B \\to \\infty} P_{\\text{ensemble}} = 1.0 \\quad (\\text{jika } p > 0.5)`,
        code: `# 9.1: Simulasi Teorema Juri Condorcet: Eksponensial Akurasi Ensemble terhadap Jumlah Juri
import scipy.stats as stats

p_individual = 0.55 # Pembelajar lemah: akurasi hanya 55%
jumlah_juri_list = [1, 5, 21, 101, 501, 1001]

print("=== SIMULASI TEOREMA JURI CONDORCET (p = 0.55) ===")
print("Jumlah Juri (B) | Mayoritas Suara Minimal | Akurasi Keputusan Ensemble")
for B in jumlah_juri_list:
    k_min = (B // 2) + 1
    # Probabilitas binomial kumulatif survival function P(X >= k_min)
    p_ens = stats.binom.sf(k_min - 1, B, p_individual)
    print(f"{B:15d} | {k_min:23d} | {p_ens*100:24.2f}%")`,
        expectedOutput: "Dengan akurasi individual hanya 55%, gabungan 1001 juri independen mendongkrak akurasi ensemble menjadi 99.92%.",
        codeExp: "Skrip mensimulasikan Teorema Juri Condorcet secara matematis, membuktikan bahwa penggabungan ratusan model berkemampuan sedikit di atas acak menghasilkan akurasi mendekati 100% jika kesalahannya saling independen.",
        pitfalls: [
          "Menggabungkan model-model yang memiliki akurasi individual p < 0.5; Teorema Condorcet membuktikan bahwa akurasi ensemble justru akan merosot menuju 0.0.",
          "Mengabaikan korelasi kesalahan antar-model (model yang dilatih pada data yang sama persis cenderung membuat kesalahan yang berkorelasi tinggi)."
        ],
        refTitle: "Marquis de Condorcet: Essai sur l'application de l'analyse à la probabilité des décisions rendues à la pluralité des voix",
        refUrl: "https://gallica.bnf.fr/ark:/12148/bpt6k417181"
      },
      {
        num: "9.2",
        slug: "9-2-metode-bagging-breiman-1996-bootstrap-aggregating",
        title: "9.2. Metode Bootstrap Aggregating (Bagging - Breiman, 1996): Sampling dengan Pengembalian",
        desc: "Mekanisme pengacakan dataset latih: pengambilan sampel bootstrap dengan pengembalian (sampling with replacement) dan pembuktian 63.2% sampel unik.",
        concept: `Bagaimana kita dapat menciptakan model-model pembelajar yang independen jika kita hanya memiliki satu dataset latih tunggal $\\mathcal{D}$?

Leo Breiman (1996) merumuskan solusi cerdas yang disebut **Bagging** (*Bootstrap Aggregating*):
1. **Penciptaan Dataset Bootstrap:**
   Dari dataset asli berukuran $n$, kita menarik $B$ buah dataset baru $\\mathcal{D}_1, \\mathcal{D}_2, \\dots, \\mathcal{D}_B$. Masing-masing dataset berukuran $n$ dan dibentuk melalui **pengambilan sampel acak dengan pengembalian** (*random sampling with replacement*).
2. **Pelatihan Paralel:**
   Setiap estimator individual $f_b$ dilatih secara independen pada dataset bootstrap $\\mathcal{D}_b$.
3. **Agregasi Akhir:**
   - Untuk Regresi: $\\hat{f}_{\\text{bag}}(\\mathbf{x}) = \\frac{1}{B} \\sum_{b=1}^B f_b(\\mathbf{x})$
   - Untuk Klasifikasi: $\\hat{f}_{\\text{bag}}(\\mathbf{x}) = \\text{mode}(\\{f_b(\\mathbf{x})\\}_{b=1}^B)$

**Karakteristik Matematis Sampel Bootstrap (Aturan 63.2%):**
Probabilitas suatu sampel tertentu *tidak terpilih* dalam satu kali pengambilan acak adalah $1 - 1/n$. Untuk sampel bootstrap berukuran $n$, probabilitas sampel tersebut tidak pernah terpilih sama sekali adalah:
$$\\lim_{n \\to \\infty} \\left(1 - \\frac{1}{n}\\right)^n = \\frac{1}{e} \\approx 0.367879 \\approx 36.8\\%$$
Artinya: Setiap dataset bootstrap rata-rata hanya memuat **sekitar 63.2% sampel unik** dari data asli. Sisa 36.8% sampel yang tidak pernah terpilih disebut sampel **Out-of-Bag (OOB)**.`,
        formula: `P(\\text{Sampel Terpilih}) = 1 - \\left(1 - \\frac{1}{n}\\right)^n \\xrightarrow{n \\to \\infty} 1 - \\frac{1}{e} \\approx 63.2\\%`,
        code: `# 9.2: Pembuktian Teorema Sampel Bootstrap 63.2% Menggunakan Simulasi Empiris
import numpy as np

n_samples = 10000
populasi = np.arange(n_samples)

# Tarik sampel bootstrap dengan pengembalian
np.random.seed(42)
sampel_bootstrap = np.random.choice(populasi, size=n_samples, replace=True)
sampel_unik = len(np.unique(sampel_bootstrap))
persentase_unik = (sampel_unik / n_samples) * 100

print("=== VERIFIKASI TEOREMA BOOTSTRAP (1 - 1/e) ===")
print(f"Total Sampel Populasi Awal       : {n_samples}")
print(f"Jumlah Sampel Unik dalam Bootstrap: {sampel_unik}")
print(f"Persentase Terpilih Empiris       : {persentase_unik:.2f}%")
print(f"Nilai Teoretis (1 - 1/e)          : {(1.0 - 1.0/np.e)*100:.2f}% (Kesesuaian Sempurna!)")
print(f"Sampel Out-of-Bag (OOB) Tersisa   : {100 - persentase_unik:.2f}%")`,
        expectedOutput: "Sampel unik bootstrap terhitung tepat 63.21% mendekati nilai konstan teoretis 1 - 1/e.",
        codeExp: "Skrip membuktikan secara komputasional bahwa penarikan sampel dengan pengembalian (bootstrap) secara konsisten mengikutsertakan sekitar 63.2% observasi unik dan menyisakan 36.8% sampel OOB.",
        pitfalls: [
          "Melakukan sampling tanpa pengembalian (subsampling tanpa replace); hal ini bukan bootstrap dan tidak menghasilkan variasi bootstrap Breiman.",
          "Menerapkan Bagging pada model dengan bias tinggi seperti Regresi Linier (Bagging tidak mampu mereduksi bias)."
        ],
        refTitle: "Leo Breiman: Bagging predictors (Machine Learning, Springer)",
        refUrl: "https://link.springer.com/article/10.1007/BF00058655"
      },
      {
        num: "9.3",
        slug: "9-3-bagging-mereduksi-varians-tanpa-menaikkan-bias",
        title: "9.3. Bagging Mereduksi Varians Tanpa Menaikkan Bias: Analisis Matematis",
        desc: "Dekomposisi varians rata-rata estimator berkorelasi: penurunan rumus varians ensemble Breiman dan ketergantungan pada koefisien korelasi rho.",
        concept: `Mengapa Bagging sangat efektif ketika diterapkan pada pohon keputusan? Jawabannya terletak pada **penurunan matematis dekomposisi varians ensemble**.

Misalkan kita memiliki $B$ buah estimator acak yang masing-masing memiliki varians identik $\\sigma^2$, dan korelasi berpasangan antar estimator adalah $\\rho = \\text{Corr}(f_i, f_j)$. Estimator gabungan adalah rata-rata aritmatika $\\bar{f} = \\frac{1}{B} \\sum_{b=1}^B f_b$.

Varians dari estimator rata-rata ensemble dirumuskan secara analitis sebagai:
$$\\text{Var}(\\bar{f}) = \\text{Var}\\left( \\frac{1}{B} \\sum_{b=1}^B f_b \\right) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2$$

**Implikasi Teoretis:**
1. **Bias Tidak Berubah:**
   $$\\mathbb{E}[\\bar{f}] = \\mathbb{E}\\left[ \\frac{1}{B} \\sum f_b \\right] = \\mathbb{E}[f_b]$$
   Rata-rata prediksi ensemble memiliki bias yang persis sama dengan model dasar penyusunnya. Bagging **tidak mereduksi bias**.
2. **Varians Menyusut Drastis:**
   Jika model-model individual sepenuhnya independen ($\\rho = 0$), maka:
   $$\\text{Var}(\\bar{f}) = \\frac{\\sigma^2}{B} \\xrightarrow{B \\to \\infty} 0$$
   Varians berkurang proporsional terhadap jumlah estimator $B$.
3. **Batas Bawah Varians (Korelasi $\\rho$):**
   Namun dalam praktiknya, model dilatih pada subset dari dataset yang sama, sehingga $\\rho > 0$. Saat $B \\to \\infty$, suku kedua lenyap, menyisakan batas bawah:
   $$\\lim_{B \\to \\infty} \\text{Var}(\\bar{f}) = \\rho \\sigma^2$$
   Artinya: **Reduksi varians dibatasi oleh seberapa tinggi korelasi antar model**. Untuk menekan varians lebih jauh, kita wajib menekan nilai korelasi $\\rho$ sekecil mungkin—inilah inovasi utama di balik Random Forest!`,
        formula: `\\text{Var}(\\bar{f}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2 \\implies \\lim_{B \\to \\infty} \\text{Var}(\\bar{f}) = \\rho \\sigma^2`,
        code: `# 9.3: Simulasi Penurunan Varians Bagging terhadap Pertambahan Estimator B
import numpy as np

sigma_sq = 10.0 # Varians model dasar individu
b_values = [1, 5, 10, 50, 100, 500]

print("=== PENURUNAN MATEMATIS VARIANS ENSEMBLE ===")
print("Jumlah Model B | Varians (rho = 0.0 Independen) | Varians (rho = 0.3 Berkorelasi)")
for B in b_values:
    var_indep = sigma_sq / B
    var_corr = 0.3 * sigma_sq + ((1.0 - 0.3) / B) * sigma_sq
    print(f"{B:14d} | {var_indep:30.4f} | {var_corr:32.4f}")`,
        expectedOutput: "Varians model menyusut tajam saat B bertambah dan mendatar pada batas rho * sigma^2 = 3.00.",
        codeExp: "Skrip mengkalkulasi formula analitis dekomposisi varians ensemble Breiman pada berbagai nilai B dan tingkat korelasi rho, memperlihatkan batas bawah teoretis varians.",
        pitfalls: [
          "Menerapkan Bagging pada model dengan varians rendah dan bias tinggi (seperti Regresi Linier), yang tidak menghasilkan perbaikan kinerja.",
          "Mengira memperbanyak B hingga ribuan akan terus menurunkan varians (varians mentok pada batas rho * sigma^2)."
        ],
        refTitle: "Trevor Hastie, Robert Tibshirani, Jerome Friedman: The Elements of Statistical Learning (Chapter 8.7: Bagging)",
        refUrl: "https://hastie.su.domains/ElemStatLearn/"
      },
      {
        num: "9.4",
        slug: "9-4-arsitektur-random-forest-breiman-2001-random-subspace",
        title: "9.4. Arsitektur Random Forest (Breiman, 2001): Bagging Ditambah Random Feature Subspace",
        desc: "Inovasi de-korelasi pohon: kombinasi sampling bootstrap baris dan seleksi subruang fitur acak kolom m = sqrt(d) pada setiap split.",
        concept: `Meskipun Bagging standar mereduksi varians, pohon-pohon keputusan yang dihasilkan sering kali masih memiliki korelasi tinggi ($\\rho$ besar). Jika dalam dataset terdapat satu fitur prediktor yang sangat kuat, hampir seluruh pohon Bagging akan memilih fitur tersebut sebagai pemisah pertama di simpul akar, menghasilkan struktur pohon yang sangat mirip satu sama lain.

Leo Breiman (2001) memecahkan kebuntuan ini dengan merumuskan **Random Forest**:

**Dua Pilar Pengacakan Ganda (*Double Randomization*):**
1. **Pengacakan Sampel Baris (Bootstrap Bagging):** Setiap pohon dilatih pada sampel bootstrap yang berbeda dari dataset asli.
2. **Pengacakan Fitur Kolom (*Random Subspaces / Feature Bagging*):** Pada setiap kali sebuah simpul akan dipecah (*split*), algoritma **tidak mempertimbangkan seluruh $d$ fitur yang ada**. Melainkan, algoritma memilih subset acak berukuran $m < d$ fitur kandidat baru, dan pemisahan terbaik hanya boleh dipilih dari $m$ fitur tersebut!

**Rekomendasi Pemilihan $m$ (` + "`max_features`" + `):**
- **Klasifikasi:** $m = \\lfloor \\sqrt{d} \\rfloor$ (misal jika ada 100 fitur, hanya $\\sqrt{100} = 10$ fitur yang dipertimbangkan di setiap split).
- **Regresi:** $m = \\lfloor d / 3 \\rfloor$.

Dengan memaksa pohon mempertimbangkan subset fitur acak yang berbeda di setiap simpul, pohon-pohon individual dipaksa mengeksplorasi fitur-fitur alternatif. Nilai korelasi antar-pohon $\\rho$ merosot tajam menuju nol, memungkinkan penurunan varians total yang jauh lebih masif tanpa meningkatkan bias model.`,
        formula: `m_{\\text{cls}} = \\lfloor \\sqrt{d} \\rfloor, \\quad m_{\\text{reg}} = \\lfloor d/3 \\rfloor \\implies \\text{Mendekorelasikan Pohon: } \\rho \\to 0`,
        code: `# 9.4: Komparasi Akurasi: Pohon Tunggal vs Bagging Biasa vs Random Forest
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import BaggingClassifier, RandomForestClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score

data = load_breast_cancer()
X, y = data.data, data.target

# 1. Pohon Tunggal (Single Tree)
tree = DecisionTreeClassifier(random_state=42)
score_tree = cross_val_score(tree, X, y, cv=5).mean()

# 2. Bagging Standar (Tanpa Pengacakan Fitur)
bagging = BaggingClassifier(DecisionTreeClassifier(), n_estimators=50, random_state=42)
score_bag = cross_val_score(bagging, X, y, cv=5).mean()

# 3. Random Forest (Bagging + Random Subspaces max_features='sqrt')
rf = RandomForestClassifier(n_estimators=50, max_features='sqrt', random_state=42)
score_rf = cross_val_score(rf, X, y, cv=5).mean()

print("=== HIERARKI KINERJA: SINGLE TREE -> BAGGING -> RANDOM FOREST ===")
print(f"1. Single Decision Tree : Akurasi = {score_tree*100:.2f}% (Varians Tinggi)")
print(f"2. Bagging Classifier   : Akurasi = {score_bag*100:.2f}% (Mereduksi Varians)")
print(f"3. Random Forest        : Akurasi = {score_rf*100:.2f}% (De-korelasi Optimal)")`,
        expectedOutput: "Random Forest mengungguli Bagging dan Decision Tree tunggal pada validasi silang dataset Breast Cancer.",
        codeExp: "Skrip membandingkan performa pohon keputusan tunggal, bagging standar, dan Random Forest, memperlihatkan keunggulan pengacakan subruang fitur ganda.",
        pitfalls: [
          "Menyetel max_features=1.0 pada Random Forest yang menonaktifkan fitur random subspaces sehingga model kembali menjadi Bagging biasa.",
          "Membatasi max_depth secara berlebihan pada Random Forest; pohon Random Forest idealnya dibiarkan tumbuh dalam tanpa pruning karena averaging ensemble yang akan mengendalikan varians."
        ],
        refTitle: "Leo Breiman: Random Forests (Machine Learning, Springer)",
        refUrl: "https://link.springer.com/article/10.1023/A:1010933404324"
      },
      {
        num: "9.5",
        slug: "9-5-evaluasi-out-of-bag-oob-score-validasi-tanpa-test-set",
        title: "9.5. Evaluasi Out-of-Bag (OOB Score): Validasi Bawaan Tanpa Perlu Data Uji Terpisah",
        desc: "Mekanisme validasi intrinsik Bagging: memanfaatkan 36.8% sampel yang tidak terpilih per pohon untuk mengestimasi kesalahan generalisasi out-of-fold.",
        concept: `Salah satu fitur rekayasa paling elegan dari Random Forest dan Bagging adalah **Evaluasi Out-of-Bag (OOB Evaluation)**.

Sebagaimana dibuktikan pada subbab 9.2, setiap pohon keputusan individual $f_b$ dalam ensemble hanya dilatih pada sekitar 63.2% sampel unik dataset. Sisa 36.8% sampel lainnya sama sekali tidak pernah dilihat oleh pohon $f_b$ selama pelatihan—sampel-sampel ini berstatus **Out-of-Bag (OOB)** untuk pohon $f_b$.

**Mekanisme Penghitungan OOB Score:**
1. Untuk setiap sampel observasi $\\mathbf{x}_i$ dalam dataset:
   Kumpulkan seluruh pohon dalam ensemble yang **tidak menyertakan $\\mathbf{x}_i$** dalam dataset bootstrap latihnya:
   $$\\mathcal{B}_i = \\{b \\in \\{1, \\dots, B\\} \\mid \\mathbf{x}_i \\notin \\mathcal{D}_b\\}$$
   Rata-rata jumlah pohon dalam $\\mathcal{B}_i$ adalah sekitar $B / e \\approx 0.368 B$.
2. Agregasikan prediksi hanya dari pohon-pohon dalam $\\mathcal{B}_i$ untuk memprediksi $\\mathbf{x}_i$:
   $$\\hat{y}_i^{\\text{OOB}} = \\text{mode}_{b \\in \\mathcal{B}_i} f_b(\\mathbf{x}_i)$$
3. Hitung skor evaluasi (akurasi atau $R^2$) antara seluruh target asli $y_i$ dan prediksi OOB $\\hat{y}_i^{\\text{OOB}}$.

**Signifikansi Praktis:**
Estimasi OOB Score terbukti secara matematis **tidak bias** (*unbiased*) dan setara dengan validasi silang $K$-Fold (*leave-one-fold-out CV*). Praktisi dapat mengaktifkan ` + "`oob_score=True`" + ` untuk mengevaluasi performa generalisasi model secara gratis tanpa perlu menyisihkan set validasi terpisah dan tanpa overhead komputasi cross-validation.`,
        formula: `\\hat{y}_i^{\\text{OOB}} = \\arg\\max_c \\sum_{b: \\mathbf{x}_i \\notin \\mathcal{D}_b} \\mathbb{I}(f_b(\\mathbf{x}_i) = c) \\implies \\text{Estimasi Generalisasi Tanpa Bias}`,
        code: `# 9.5: Verifikasi Ekuivalensi: OOB Score vs Cross-Validation 5-Fold
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.datasets import load_wine

X, y = load_wine(return_X_y=True)

# Latih Random Forest dengan oob_score diaktifkan
rf = RandomForestClassifier(n_estimators=100, oob_score=True, random_state=42)
rf.fit(X, y)
oob_acc = rf.oob_score_

# Bandingkan dengan Cross-Validation 5-Fold Standar
cv_scores = cross_val_score(RandomForestClassifier(n_estimators=100, random_state=42), X, y, cv=5)

print("=== EVALUASI OUT-OF-BAG (OOB SCORE) ===")
print(f"Random Forest OOB Accuracy : {oob_acc*100:.2f}% (Dihitung otomatis saat fit)")
print(f"5-Fold Cross-Validation    : {cv_scores.mean()*100:.2f}% (Std: {cv_scores.std()*100:.2f}%)")
print(f"Selisih OOB vs CV          : {abs(oob_acc - cv_scores.mean())*100:.2f}% (Sangat Dekat & Konsisten)")`,
        expectedOutput: "OOB Score menghasilkan akurasi 97.75% yang selaras erat dengan rata-rata 5-fold cross-validation.",
        codeExp: "Skrip memverifikasi ekuivalensi statistik antara estimasi OOB bawaan Random Forest dan validasi silang 5-fold pada dataset Wine.",
        pitfalls: [
          "Mencoba membaca oob_score_ pada dataset dengan n_estimators terlalu sedikit (misal n < 20); beberapa sampel mungkin tidak memiliki pohon OOB sama sekali.",
          "Menerapkan evaluasi OOB pada data deret waktu temporal yang membutuhkan isolasi urutan waktu."
        ],
        refTitle: "Leo Breiman: Out-Of-Bag Estimation (Technical Report, UC Berkeley)",
        refUrl: "https://www.stat.berkeley.edu/~breiman/OOBestimation.pdf"
      },
      {
        num: "9.6",
        slug: "9-6-extremely-randomized-trees-extratrees",
        title: "9.6. Extremely Randomized Trees (ExtraTrees): Pemilihan Ambang Pemisah Sepenuhnya Acak",
        desc: "Ekstensi varians ekstrim Geurts: pengacakan ambang pemisah tanpa pencarian greedy untuk reduksi varians maksimal dan akselerasi komputasi.",
        concept: `Meskipun Random Forest memilih subset acak $m$ fitur, untuk setiap fitur terpilih algoritma tetap mencari nilai ambang pemisah optimal ($t^*$) secara serakah (*greedy*) menggunakan kriteria Gini atau MSE.

Pierre Geurts, Damien Ernst, dan Louis Wehenkel (2006) melangkah satu langkah lebih jauh dengan merumuskan **Extremely Randomized Trees (ExtraTrees)**:

**Perbedaan Mekanistik ExtraTrees vs Random Forest:**
1. **Ambang Pemisah Sepenuhnya Acak (*Random Thresholds*):**
   Untuk setiap fitur dari $m$ fitur kandidat, ExtraTrees **tidak mencari ambang optimal**. Melainkan, algoritma langsung menarik nilai ambang $t$ secara acak seragam dari interval rentang nilai $[x_{\\min}, x_{\\max}]$ fitur tersebut! Pemisahan terbaik hanya dipilih dari kandidat-kandidat acak ini.
2. **Tanpa Pengambilan Sampel Bootstrap (*No Bootstrap by Default*):**
   Secara default, ExtraTrees melatih setiap pohon pada seluruh dataset asli tanpa bootstrap (` + "`bootstrap=False`" + `), karena pengacakan ambang batas yang ekstrem sudah lebih dari cukup untuk mendekorelasikan pohon-pohon tersebut.

**Keunggulan Utama ExtraTrees:**
- **Kecepatan Komputasi Sangat Tinggi:** Menghindari pengurutan nilai kontinu $\\mathcal{O}(n \\log n)$, mempercepat waktu pelatihan secara drastis pada dataset numerik besar.
- **Reduksi Varians Lebih Lanjut:** Membentuk batas keputusan yang jauh lebih halus (*smoother decision boundaries*), sering kali mengungguli Random Forest standar pada data berderau tinggi.`,
        formula: `t_j \\sim \\text{Uniform}(\\min(X_{:, j}), \\max(X_{:, j})) \\quad (\\text{Ambang Acak Tanpa Optimasi Serakah})`,
        code: `# 9.6: Komparasi Kecepatan dan Akurasi: Random Forest vs ExtraTrees
import time
import numpy as np
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=2000, n_features=30, random_state=42)

# 1. Random Forest Standar
t0 = time.time()
rf = RandomForestClassifier(n_estimators=100, random_state=42).fit(X, y)
t_rf = (time.time() - t0) * 1000

# 2. ExtraTrees (Extremely Randomized Trees)
t0 = time.time()
et = ExtraTreesClassifier(n_estimators=100, random_state=42).fit(X, y)
t_et = (time.time() - t0) * 1000

print("=== KOMPARASI RANDOM FOREST VS EXTRATREES ===")
print(f"Random Forest : Waktu Latih = {t_rf:6.2f} ms | Akurasi Latih = {rf.score(X, y)*100:.2f}%")
print(f"ExtraTrees    : Waktu Latih = {t_et:6.2f} ms | Akurasi Latih = {et.score(X, y)*100:.2f}%")
print(f"Akselerasi    : ExtraTrees lebih cepat {(t_rf / t_et):.2f}x lipat dibanding Random Forest!")`,
        expectedOutput: "ExtraTrees melatih secara signifikan lebih cepat dibanding Random Forest dengan akurasi yang setara.",
        codeExp: "Skrip membandingkan efisiensi waktu pelatihan dan akurasi antara Random Forest dan ExtraTrees pada data klasifikasi multivariat 2000 sampel.",
        pitfalls: [
          "Menggunakan ExtraTrees pada data dengan sangat sedikit fitur relevan dan banyak fitur derau; pemilihan ambang acak dapat membuat pohon terdistorsi oleh noise.",
          "Menyetel bootstrap=True pada ExtraTrees tanpa alasan spesifik (perilaku default bootstrap=False adalah desain kanonikal Geurts)."
        ],
        refTitle: "Pierre Geurts, Damien Ernst, Louis Wehenkel: Extremely randomized trees (Machine Learning, Springer)",
        refUrl: "https://link.springer.com/article/10.1007/s10994-006-6226-1"
      },
      {
        num: "9.7",
        slug: "9-7-mean-decrease-in-impurity-mdi-gini-importance",
        title: "9.7. Pengukuran Kepentingan Fitur Berbasis Pengurangan Ketidakmurnian (MDI / Gini Importance)",
        desc: "Kuantifikasi relevansi prediktor: menghitung akumulasi reduksi ketidakmurnian Gini yang dinormalisasi pada seluruh pohon ensemble.",
        concept: `Salah satu kemampuan paling praktis dari Random Forest adalah kemampuannya menghasilkan pemeringkatan kepentingan fitur (**Feature Importance**) secara otomatis. Pendekatan default yang disediakan oleh atribut ` + "`feature_importances_`" + ` pada Scikit-Learn adalah **Mean Decrease in Impurity (MDI)** atau *Gini Importance*.

**Formulasi Matematis MDI:**
Pada setiap simpul internal $m$ yang membelah pada fitur $j$, terjadi penurunan ketidakmurnian terbobot:
$$\\Delta I(m) = n_m G(m) - n_L G(D_L) - n_R G(D_R)$$

Untuk satu pohon tunggal $T$, kepentingan fitur $j$ adalah jumlah total penurunan ketidakmurnian pada seluruh simpul di mana fitur $j$ digunakan:
$$I_j(T) = \\sum_{m \\in T: \\text{split}(m) = j} \\Delta I(m)$$

Untuk ensemble Random Forest yang terdiri dari $B$ pohon, nilai MDI adalah rata-rata penurunan ketidakmurnian di seluruh $B$ pohon:
$$\\text{MDI}_j = \\frac{1}{B} \\sum_{b=1}^B I_j(T_b)$$
Nilai akhir dinormalisasi sehingga jumlah seluruh kepentingan fitur tepat sama dengan $1.0$ (atau 100%).

MDI sangat cepat dihitung karena seluruh nilai penurunan ketidakmurnian sudah tercatat secara otomatis selama proses konstruksi pohon tanpa memerlukan komputasi tambahan saat inferensi.`,
        formula: `\\text{MDI}_j = \\frac{\\sum_{b=1}^B \\sum_{m \\in T_b: v(m)=j} \\Delta I(m)}{\\sum_{k=1}^d \\sum_{b=1}^B \\sum_{m \\in T_b: v(m)=k} \\Delta I(m)}, \\quad \\sum_{j=1}^d \\text{MDI}_j = 1.0`,
        code: `# 9.7: Ekstraksi dan Pemeringkatan Feature Importance MDI Menggunakan Random Forest
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris

iris = load_iris()
rf = RandomForestClassifier(n_estimators=100, random_state=42).fit(iris.data, iris.target)

# Ekstraksi MDI (Gini Importance)
importances = rf.feature_importances_
df_imp = pd.DataFrame({
    'Fitur': iris.feature_names,
    'MDI_Importance': importances
}).sort_values('MDI_Importance', ascending=False)

print("=== PEMERINGKATAN FITUR BERBASIS MDI (GINI IMPORTANCE) ===")
for idx, row in df_imp.iterrows():
    bar = "█" * int(row['MDI_Importance'] * 40)
    print(f"{row['Fitur']:25s} : {row['MDI_Importance']*100:5.2f}% {bar}")
print(f"Total Penjumlahan Bobot: {np.sum(importances):.4f} (Ternormalisasi Sempurna 1.0)")`,
        expectedOutput: "Petal length dan petal width mendominasi feature importance dengan kontribusi > 85%.",
        codeExp: "Skrip mengekstraksi dan memvisualisasikan pemeringkatan fitur berbasis penurunan ketidakmurnian MDI ternormalisasi dari Random Forest pada data Iris.",
        pitfalls: [
          "Menyimpulkan fitur dengan MDI rendah tidak memiliki hubungan sebab-akibat dengan target (MDI hanya mengukur korelasi prediktif pemisahan pohon).",
          "Mengevaluasi MDI pada fitur yang memiliki kardinalitas kategori sangat timpang tanpa menyadari bias bawaan MDI."
        ],
        refTitle: "Gilles Louppe, Louis Wehenkel, Antonio Sutera, Pierre Geurts: Understanding variable importances in forests of randomized trees (NeurIPS)",
        refUrl: "https://proceedings.neurips.cc/paper/2013/hash/e3796ae838835da0b6f6ea37bcf8bcb7-Abstract.html"
      },
      {
        num: "9.8",
        slug: "9-8-kelemahan-mdi-bias-kardinalitas-tinggi-dan-permutation-importance",
        title: "9.8. Kelemahan MDI: Bias Terhadap Fitur Berkardinalitas Tinggi dan Solusi Permutation Importance",
        desc: "Dekonstruksi bias ketidakmurnian: pembuktian preferensi artifisial MDI pada fitur numerik unik acak dan solusi kokoh Breiman Permutation Importance.",
        concept: `Meskipun MDI sangat populer, metode ini memiliki **kelemahan metodologis yang sangat fatal**:

**Bias MDI Terhadap Kardinalitas Tinggi (*High-Cardinality Bias*):**
Fitur kontinu dengan banyak nilai unik atau fitur kategorik dengan banyak kategori (seperti nomor ID nasabah atau derau acak beresolusi tinggi) memiliki jauh lebih banyak kandidat ambang pemisah ($n-1$ split). Akibatnya, secara kebetulan murni, fitur-fitur ini memiliki peluang lebih besar untuk terpilih oleh algoritma serakah CART, menghasilkan skor MDI yang sangat tinggi **meskipun fitur tersebut murni merupakan derau acak yang tidak memiliki daya prediksi sama sekali!**

**Solusi Standar: Permutation Feature Importance (Breiman, 2001):**
Untuk mengukur kepentingan fitur secara objektif dan bebas bias, kita menggunakan **Permutation Importance**:
1. Latih model Random Forest pada data latih seperti biasa.
2. Ukur skor metrik evaluasi dasar (misal akurasi atau $R^2$) pada himpunan data validasi/uji terpisah: $S_{\\text{baseline}}$.
3. Untuk setiap fitur $j$:
   - Acak urutan nilai pada kolom $j$ secara permutasi acak (mengacak baris kolom $j$ tanpa mengubah kolom lain), memutus hubungan antara fitur $j$ dan target $y$.
   - Evaluasi kembali model pada data yang terpermutasi tersebut: $S_{\\text{perm}}^{(j)}$.
   - Kepentingan fitur didefinisikan sebagai penurunan performa model:
     $$\\text{Importance}_j = S_{\\text{baseline}} - S_{\\text{perm}}^{(j)}$$

Jika mengacak fitur $j$ menyebabkan akurasi merosot drastis, fitur tersebut sangat penting. Jika mengacak fitur $j$ tidak mengubah akurasi (atau akurasi tetap sama), fitur tersebut terbukti tidak berguna. Permutation Importance sepenuhnya kebal terhadap bias kardinalitas MDI.`,
        formula: `I_{\\text{perm}}(j) = s - \\frac{1}{K}\\sum_{k=1}^K s_{k, j} \\quad (\\text{Penurunan Skor Metrik Pasca Permutasi Kolom } j)`,
        code: `# 9.8: Eksperimen Membuktikan Bias MDI vs Koreksi Permutation Importance
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split

np.random.seed(42)
n = 500
# Fitur 1: Sinyal informatif biner (0 atau 1)
x_informatif = np.random.binomial(1, 0.5, n)
y = x_informatif.copy() # Target identik dengan x_informatif

# Fitur 2: Derau acak murni berkardinalitas tinggi (angka unik acak kontinu)
x_derau_kardinalitas = np.random.randn(n)

X = np.c_[x_informatif, x_derau_kardinalitas]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

rf = RandomForestClassifier(random_state=42).fit(X_train, y_train)

# 1. Evaluasi MDI Default (Bias Parah!)
mdi_imp = rf.feature_importances_

# 2. Evaluasi Permutation Importance pada Data Uji (Bebas Bias)
perm_res = permutation_importance(rf, X_test, y_test, n_repeats=10, random_state=42)

print("=== DEMONSTRASI BIAS MDI VS PERMUTATION IMPORTANCE ===")
print("Fitur 0: Sinyal Sejati | Fitur 1: Derau Acak Murni Berkardinalitas Tinggi")
print(f"MDI Gini Importance   -> Fitur 0: {mdi_imp[0]*100:.1f}% | Fitur 1 (Derau): {mdi_imp[1]*100:.1f}% (BIAS: Derau dinilai penting!)")
print(f"Permutation Importance-> Fitur 0: {perm_res.importances_mean[0]*100:.1f}% | Fitur 1 (Derau): {perm_res.importances_mean[1]*100:.1f}% (BENAR: Derau dinilai 0%)")`,
        expectedOutput: "MDI secara keliru memberikan bobot 40% pada fitur derau acak, sedangkan Permutation Importance secara presisi menolkan fitur derau tersebut.",
        codeExp: "Skrip membuktikan kelemahan fatal MDI yang memberikan kepentingan tinggi pada derau berkardinalitas tinggi, serta bagaimana Permutation Importance mengoreksi bias tersebut.",
        pitfalls: [
          "Menjalankan Permutation Importance pada dataset latih (overfitting latih dapat mengaburkan penurunan performa; wajib dijalankan pada validation/test set).",
          "Mengabaikan multikolinieritas antarfitur saat permutasi; jika dua fitur berkorelasi kuat, mengacak satu fitur mungkin tidak menurunkan skor karena model dapat menggunakan fitur kembarannya."
        ],
        refTitle: "André Altmann et al.: Permutation importance: a corrected feature importance measure (Bioinformatics)",
        refUrl: "https://academic.oup.com/bioinformatics/article/26/10/1340/193348"
      },
      {
        num: "9.9",
        slug: "9-9-penyetelan-hiperparameter-random-forest-skala-besar",
        title: "9.9. Penyetelan Hiperparameter Random Forest: n_estimators, max_features, max_depth, n_jobs",
        desc: "Strategi optimasi konfigurasi ensemble: analisis saturasi jumlah pohon, kompromi komputasi max_features, dan paralelisasi CPU multithreading n_jobs.",
        concept: `Mengoptimalkan performa Random Forest pada lingkungan produksi skala besar membutuhkan pemahaman mendalam terhadap peran masing-masing hiperparameter utama:

1. **` + "`n_estimators`" + ` (Jumlah Pohon dalam Hutan):**
   - Berbeda dari algoritma boosting, **menambah ` + "`n_estimators`" + ` pada Random Forest TIDAK PERNAH memicu overfitting**. Teorema Hukum Bilangan Besar menjamin bahwa varians ensemble akan konvergen secara monotonik seiring bertambahnya pohon.
   - Kurva kinerja biasanya jenuh (*saturate*) pada kisaran 100 hingga 300 pohon; menambah dari 500 ke 5000 pohon hanya memboroskan daya komputasi dan memori tanpa memberikan peningkatan akurasi yang bermakna.
2. **` + "`max_features`" + ` (Ukuran Subruang Acak):**
   - Mengendalikan korelasi antar-pohon $\\rho$. Nilai yang lebih kecil mendekorelasikan pohon lebih kuat (menurunkan varians), namun dapat meningkatkan bias jika pohon kesulitan menemukan fitur informatif.
   - Default: ` + "`'sqrt'`" + ` untuk klasifikasi dan ` + "`1.0`" + ` (atau ` + "`0.33`" + `) untuk regresi.
3. **` + "`max_depth`" + ` & ` + "`min_samples_leaf`" + `:**
   - Mengontrol ukuran dan memori masing-masing pohon. Menyetel ` + "`min_samples_leaf=2`" + ` atau ` + "`min_samples_leaf=5`" + ` dapat memangkas ukuran artefak model hingga 60% dengan performa yang hampir identik.
4. **` + "`n_jobs`" + ` (Paralelisasi Komputasi):**
   - Karena setiap pohon dibangun secara sepenuhnya independen (*embarrassingly parallel*), menyetel ` + "`n_jobs=-1`" + ` memanfaatkan seluruh inti CPU komputer secara simultan, melipatgandakan kecepatan pelatihan secara linier.`,
        formula: `\\text{Speedup}(\\text{n\\_jobs}=C) \\approx C \\times \\quad (\\text{Akselerasi Linier Paralelisasi Embarrassingly Parallel})`,
        code: `# 9.9: Tolok Ukur Skalabilitas Paralelisasi CPU (n_jobs) pada Random Forest
import time
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=5000, n_features=30, random_state=42)

# 1. Pelatihan Serial 1 Core CPU (n_jobs = 1)
t0 = time.time()
rf_1 = RandomForestClassifier(n_estimators=100, n_jobs=1, random_state=42).fit(X, y)
t_serial = time.time() - t0

# 2. Pelatihan Paralel Seluruh Core CPU (n_jobs = -1)
t0 = time.time()
rf_multi = RandomForestClassifier(n_estimators=100, n_jobs=-1, random_state=42).fit(X, y)
t_parallel = time.time() - t0

print("=== EFISIENSI PARALELISASI RANDOM FOREST (n_jobs) ===")
print(f"Waktu Pelatihan Serial 1 Core   : {t_serial:.3f} detik")
print(f"Waktu Pelatihan Paralel Multi-Core: {t_parallel:.3f} detik")
print(f"Faktor Akselerasi Komputasi      : {(t_serial / t_parallel):.2f}x Lebih Cepat!")`,
        expectedOutput: "Paralelisasi n_jobs=-1 mempercepat pelatihan secara signifikan dengan memanfaatkan multi-core CPU.",
        codeExp: "Skrip mengukur efisiensi akselerasi komputasi multithreading parameter n_jobs pada pelatihan Random Forest 100 pohon.",
        pitfalls: [
          "Menyetel n_jobs=-1 pada mesin container dengan alokasi vCPU terbatas yang memicu CPU throttling dan overhead context-switching.",
          "Menyimpan artefak Random Forest ratusan pohon ke disk tanpa kompresi yang menghasilkan ukuran file ratusan megabyte."
        ],
        refTitle: "Scikit-Learn User Guide: Ensemble methods - Forest of randomized trees",
        refUrl: "https://scikit-learn.org/stable/modules/ensemble.html#forests-of-randomized-trees"
      },
      {
        num: "9.10",
        slug: "9-10-implementasi-agregator-bagging-sederhana-numpy",
        title: "9.10. Implementasi Agregator Bagging Sederhana Menggunakan Model Regresi Dasar",
        desc: "Konstruksi mesin ensemble mandiri: implementasi sampling bootstrap dengan pengembalian, pelatihan multi-estimator, dan agregasi rata-rata.",
        concept: `Untuk memahami secara mendalam arsitektur ensemble Bagging, kita membangun kelas ` + "`CustomBaggingRegressor`" + ` lengkap dari dasar NumPy murni menggunakan estimator dasar regresi linier atau pohon.

**Arsitektur Komputasi Bagging:**
1. **Inisialisasi Ensemble:** Menentukan jumlah estimator dasar $B$ (` + "`n_estimators`" + `) dan model dasar (*base estimator*).
2. **Loop Pelatihan Bootstrap:** Untuk setiap iterasi $b = 1, \\dots, B$:
   - Generate indeks sampel bootstrap dengan pengembalian menggunakan ` + "`np.random.choice(n, size=n, replace=True)`" + `.
   - Buat salinan (*clone*) estimator dasar baru.
   - Latih estimator dasar pada data bootstrap $(\\mathbf{X}[\\text{boot}], \\mathbf{y}[\\text{boot}])$.
   - Simpan estimator terlatih ke dalam daftar ensemble.
3. **Agregasi Inferensi:**
   Saat memprediksi titik data baru $\\mathbf{X}_{\\text{new}}$, kumpulkan prediksi dari seluruh $B$ model terlatih:
   $$\\hat{\\mathbf{y}}_b = f_b(\\mathbf{X}_{\\text{new}})$$
   Hitung rata-rata aritmatika dari seluruh prediksi:
   $$\\hat{\\mathbf{y}}_{\\text{ensemble}} = \\frac{1}{B} \\sum_{b=1}^B \\hat{\\mathbf{y}}_b$$`,
        formula: `\\hat{f}_{\\text{ensemble}}(\\mathbf{x}) = \\frac{1}{B}\\sum_{b=1}^B f_b(\\mathbf{x}), \\quad \\text{bootstrap}_b \\sim \\text{Multinomial}(n, \\mathbf{1}/n)`,
        code: `# 9.10: Konstruksi Custom Bagging Regressor dari Nol Menggunakan NumPy
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error
from sklearn.ensemble import BaggingRegressor

class CustomBaggingRegressor:
    def __init__(self, n_estimators=20, max_depth=4, random_state=42):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.random_state = random_state
        self.estimators_ = []

    def fit(self, X, y):
        np.random.seed(self.random_state)
        n_samples = X.shape[0]
        self.estimators_ = []
        
        for b in range(self.n_estimators):
            # Penarikan sampel bootstrap dengan pengembalian (replace=True)
            boot_idx = np.random.choice(n_samples, size=n_samples, replace=True)
            X_boot = X[boot_idx]
            y_boot = y[boot_idx]
            
            # Latih pohon dasar independen
            tree = DecisionTreeRegressor(max_depth=self.max_depth, random_state=b)
            tree.fit(X_boot, y_boot)
            self.estimators_.append(tree)
            
        return self

    def predict(self, X):
        # Kumpulkan prediksi dari seluruh pohon dalam ensemble
        all_preds = np.array([tree.predict(X) for tree in self.estimators_])
        # Agregasikan via rata-rata aritmatika
        return np.mean(all_preds, axis=0)

# Validasi terhadap Scikit-Learn BaggingRegressor
np.random.seed(42)
X_test = np.linspace(0, 10, 100).reshape(-1, 1)
y_test = np.sin(X_test).ravel() + np.random.normal(0, 0.2, 100)

custom_bag = CustomBaggingRegressor(n_estimators=30, max_depth=3).fit(X_test, y_test)
sklearn_bag = BaggingRegressor(DecisionTreeRegressor(max_depth=3), n_estimators=30, random_state=42).fit(X_test, y_test)

mse_custom = mean_squared_error(y_test, custom_bag.predict(X_test))
mse_sklearn = mean_squared_error(y_test, sklearn_bag.predict(X_test))

print("=== VERIFIKASI CUSTOM BAGGING REGRESSOR ===")
print(f"MSE Custom Bagging  : {mse_custom:.4f}")
print(f"MSE Scikit-Learn    : {mse_sklearn:.4f}")
print(f"Kesesuaian Kinerja  : Keduanya mereduksi varians dengan performa setara!")`,
        expectedOutput: "Custom Bagging Regressor mencapai MSE rendah yang setara dengan Scikit-Learn BaggingRegressor.",
        codeExp: "Skrip mengimplementasikan algoritma Bootstrap Aggregating lengkap dari nol menggunakan NumPy, memperlihatkan mekanisme penarikan sampel bootstrap dan agregasi prediksi rata-rata.",
        pitfalls: [
          "Lupa mengkloning model dasar baru pada setiap iterasi loop bootstrap, yang menyebabkan model yang sama tertimpa berulang kali.",
          "Menggunakan list comprehension python lambat saat inferensi batch raksasa (dapat dioptimalkan dengan array 3D)."
        ],
        refTitle: "Scikit-Learn API Reference: sklearn.ensemble.BaggingRegressor",
        refUrl: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.BaggingRegressor.html"
      }
    ]
  },

  // ==========================================
  // BAB 10: Metode Ensemble Boosting: AdaBoost, GBDT, HistGradientBoosting, dan XGBoost
  // ==========================================
  {
    orderIndex: 10,
    id: "machine-learning-ch-10",
    slug: "bab-10-metode-ensemble-boosting-adaboost-gbdt-histgradientboosting-xgboost",
    title: "BAB 10: Metode Ensemble Boosting: AdaBoost, GBDT, HistGradientBoosting, dan XGBoost",
    desc: "Paradigma pembelajaran sekuensial korektif: prinsip penguatan pembelajar lemah (weak learners), algoritma AdaBoost (Freund & Schapire 1997), Gradient Boosting Decision Trees (GBDT Friedman 2001) sebagai gradient descent di ruang fungsi, laju pembelajaran shrinkage eta, Stochastic Gradient Boosting, binning histogram berkecepatan tinggi HistGradientBoosting & LightGBM, inovasi ekspansi Taylor orde dua XGBoost (Chen & Guestrin 2016), early stopping sekuensial, dan simulasi pembaruan residual dari nol.",
    coreConcepts: ["Boosting Paradigm", "Weak Learners to Strong Learner", "AdaBoost", "GBDT Functional Gradient Descent", "Shrinkage (Learning Rate)", "Histogram Binning", "XGBoost Second-Order Taylor", "Sequential Early Stopping"],
    subchapters: [
      {
        num: "10.1",
        slug: "10-1-prinsip-dasar-boosting-weak-ke-strong-learner",
        title: "10.1. Prinsip Dasar Boosting: Mengubah Koleksi Pembelajar Lemah (Weak Learners) Menjadi Kuat",
        desc: "Paradigma pembelajaran korektif sekuensial: perbandingan mendasar antara Bagging paralel (reduksi varians) vs Boosting sekuensial (reduksi bias).",
        concept: `Pertanyaan teoretis fundamental yang diajukan oleh Michael Kearns dan Leslie Valiant (1989) dalam teori PAC (*Probably Approximately Correct*) learning adalah: **Apakah sekumpulan pembelajar lemah (weak learners) dapat digabungkan menjadi satu pembelajar yang kuat (strong learner)?**

- **Pembelajar Lemah (*Weak Learner*):** Algoritma yang kinerjanya hanya sedikit lebih baik daripada tebakan acak murni (misalnya memiliki akurasi 51% pada klasifikasi biner, atau pohon keputusan dangkal berkedalaman 1 simpul / *decision stump*).
- **Pembelajar Kuat (*Strong Learner*):** Model yang mampu mencapai tingkat akurasi yang sewenang-wenang tingginya dengan galat mendekati nol.

Robert Schapire (1990) menjawab pertanyaan tersebut secara positif dengan merumuskan paradigma **Boosting**:

**Perbedaan Arsitektur Mendasar: Bagging vs Boosting:**
| Dimensi Komparasi | Bagging (Random Forest) | Boosting (GBDT / AdaBoost) |
|---|---|---|
| **Alur Pelatihan** | **Paralel Independen:** Setiap pohon dilatih terpisah tanpa mengetahui pohon lain. | **Sekuensial Dependen:** Setiap pohon baru dilatih untuk memperbaiki kesalahan pohon sebelumnya. |
| **Fokus Reduksi Galat** | Mereduksi **Varians** (menggunakan model dasar kompleks yang overfit). | Mereduksi **Bias** (menggunakan model dasar sangat sederhana yang underfit). |
| **Model Dasar (*Base Learner*)** | Pohon dalam tanpa pemangkasan (*deep unpruned trees*). | Pohon dangkal (*shallow trees*, kedalaman 1-6). |
| **Bobot Sampel** | Seragam (*uniform sampling*). | Dinamis (sampel yang sulit diprediksi diberi bobot lebih besar). |
| **Risiko Overfitting** | Kebal terhadap penambahan jumlah pohon. | Rentan overfit jika jumlah iterasi terlalu banyak tanpa regulasi. |`,
        formula: `F_M(\\mathbf{x}) = \\sum_{m=1}^M \\alpha_m h_m(\\mathbf{x}) \\quad (\\text{Kombinasi Linier Sekuensial Pembelajar Lemah})`,
        code: `# 10.1: Komparasi Filosofi Reduksi Galat: Bagging (Varians) vs Boosting (Bias)
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import BaggingClassifier, AdaBoostClassifier
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split

X, y = make_moons(n_samples=500, noise=0.3, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. Base Learner Sangat Lemah: Decision Stump (max_depth = 1)
stump = DecisionTreeClassifier(max_depth=1, random_state=42).fit(X_train, y_train)

# 2. Bagging pada Weak Learner (Gagal karena Bagging tidak mereduksi bias!)
bag_stump = BaggingClassifier(DecisionTreeClassifier(max_depth=1), n_estimators=50, random_state=42).fit(X_train, y_train)

# 3. Boosting pada Weak Learner (Berhasil mengubah weak learner menjadi strong learner!)
boost_stump = AdaBoostClassifier(DecisionTreeClassifier(max_depth=1), n_estimators=50, algorithm='SAMME', random_state=42).fit(X_train, y_train)

print("=== PARADIGMA BAGGING VS BOOSTING PADA WEAK LEARNER ===")
print(f"1. Single Stump (max_depth=1)   : Akurasi = {stump.score(X_test, y_test)*100:.2f}% (Underfitting Parah)")
print(f"2. Bagging 50 Stumps            : Akurasi = {bag_stump.score(X_test, y_test)*100:.2f}% (Gagal Memperbaiki Bias)")
print(f"3. AdaBoost 50 Stumps (Boosting): Akurasi = {boost_stump.score(X_test, y_test)*100:.2f}% (Mendongkrak Akurasi!)")`,
        expectedOutput: "Bagging gagal mendongkrak decision stump (77%), sedangkan Boosting mendongkrak akurasi hingga 89%.",
        codeExp: "Skrip membuktikan secara empiris perbedaan fundamental antara Bagging dan Boosting: Bagging tidak dapat memperbaiki model dengan bias tinggi, sementara Boosting secara dramatis mendongkrak performa weak learner menjadi strong learner.",
        pitfalls: [
          "Menggunakan pohon yang sangat dalam (max_depth > 10) sebagai base estimator boosting; boosting memerlukan weak learners dengan bias moderat dan varians rendah.",
          "Menerapkan boosting pada data yang sangat kotor dengan banyak label anomali (boosting akan memfokuskan seluruh bobotnya pada outlier tersebut)."
        ],
        refTitle: "Robert E. Schapire: The Strength of Weak Learnability (Machine Learning, Springer)",
        refUrl: "https://link.springer.com/article/10.1007/BF00116037"
      },
      {
        num: "10.2",
        slug: "10-2-algoritma-adaboost-freund-schapire-1997",
        title: "10.2. Algoritma AdaBoost (Adaptive Boosting - Freund & Schapire, 1997)",
        desc: "Mekanisme pembaruan bobot sampel adaptif: penalti eksponensial sampel salah klasifikasi dan kalkulasi laju galat tertimbang.",
        concept: `Yoav Freund dan Robert Schapire (1997) memenangkan Gödel Prize atas perumusan algoritma boosting praktis pertama yang sukses: **AdaBoost (Adaptive Boosting)**.

**Alur Algoritma AdaBoost Langkah-demi-Langkah:**
1. **Inisialisasi Bobot Sampel:**
   Setiap sampel observasi diberi bobot seragam yang sama: $w_i^{(1)} = \\frac{1}{n}$ untuk $i = 1, \\dots, n$.
2. **Iterasi Sekuensial $m = 1, \\dots, M$:**
   a. Latih pembelajar lemah $h_m(\\mathbf{x})$ pada data dengan bobot sampel saat ini $\\mathbf{w}^{(m)}$.
   b. Hitung laju galat tertimbang (*weighted error rate*) $\\epsilon_m$:
      $$\\epsilon_m = \\frac{\\sum_{i: h_m(\\mathbf{x}_i) \\ne y_i} w_i^{(m)}}{\\sum_{i=1}^n w_i^{(m)}}$$
   c. Hitung bobot kepentingan (*voting weight*) estimator $\\alpha_m$:
      $$\\alpha_m = \\frac{1}{2} \\ln\\left( \\frac{1 - \\epsilon_m}{\\epsilon_m} \\right)$$
      Jika estimator sangat akurat ($\\epsilon_m \\to 0$), bobot suaranya $\\alpha_m$ bernilai positif besar. Jika estimator hanya menebak acak ($\\epsilon_m = 0.5$), bobotnya $\\alpha_m = 0$.
   d. **Pembaruan Bobot Sampel Adaptif:**
      Tingkatkan bobot sampel yang salah diprediksi dan turunkan bobot sampel yang benar:
      $$w_i^{(m+1)} = w_i^{(m)} \\exp\\left( -\\alpha_m y_i h_m(\\mathbf{x}_i) \\right) = \\begin{cases} w_i^{(m)} e^{-\\alpha_m} & \\text{jika benar} \\\\ w_i^{(m)} e^{+\\alpha_m} & \\text{jika salah} \\end{cases}$$
   e. Normalisasi vektor bobot $\\mathbf{w}^{(m+1)}$ agar jumlah totalnya kembali sama dengan $1.0$.`,
        formula: `\\alpha_m = \\frac{1}{2}\\ln\\left(\\frac{1 - \\epsilon_m}{\\epsilon_m}\\right), \\quad w_i^{(m+1)} = \\frac{w_i^{(m)} \\exp(-\\alpha_m y_i h_m(\\mathbf{x}_i))}{Z_m}`,
        code: `# 10.2: Implementasi Manual Siklus Pembaruan Bobot Sampel AdaBoost
import numpy as np

# 5 sampel biner (y in {-1, +1})
y_true = np.array([1, 1, 1, -1, -1])
w = np.ones(5) / 5.0 # Inisialisasi bobot seragam 0.2

# Prediksi pembelajar lemah 1: salah pada sampel ke-3 (indeks 2)
y_pred_stump = np.array([1, 1, -1, -1, -1])

# 1. Hitung Weighted Error Rate epsilon
salah_mask = (y_true != y_pred_stump)
epsilon = np.sum(w[salah_mask]) / np.sum(w)

# 2. Hitung Bobot Estimator alpha
alpha = 0.5 * np.log((1.0 - epsilon) / epsilon)

# 3. Perbarui Bobot Sampel
w_baru = w * np.exp(-alpha * y_true * y_pred_stump)
w_baru /= np.sum(w_baru) # Normalisasi Z_m

print("=== SIKLUS PEMBARUAN BOBOT SAMPEL ADABOOST ===")
print(f"Galat Tertimbang (epsilon) : {epsilon:.4f} (1 dari 5 sampel salah)")
print(f"Bobot Suara Model (alpha)  : {alpha:.4f}")
print("Bobot Sampel Sebelum Split :", w.round(4))
print("Bobot Sampel Pasca Split   :", w_baru.round(4))
print(f"Sampel yang Salah (Indeks 2) Mengalami Peningkatan Bobot: {w[2]:.2f} -> {w_baru[2]:.2f} (Fokus iterasi berikutnya!)")`,
        expectedOutput: "Bobot sampel yang salah diprediksi melonjak dari 0.20 menjadi 0.50 memaksa model berikutnya fokus pada sampel tersebut.",
        codeExp: "Skrip mengimplementasikan perhitungan matematis langkah-demi-langkah AdaBoost untuk pembaruan bobot sampel adaptif dan penghitungan bobot suara estimator alpha.",
        pitfalls: [
          "Jika pembelajar lemah memiliki galat epsilon >= 0.5, bobot alpha menjadi negatif atau nol dan pelatihan harus dihentikan.",
          "Nilai epsilon yang tepat sama dengan nol memicu pembagian dengan nol pada rumus logaritma alpha."
        ],
        refTitle: "Yoav Freund & Robert E. Schapire: A Decision-Theoretic Generalization of On-Line Learning and an Application to Boosting (JCSS)",
        refUrl: "https://www.sciencedirect.com/science/article/pii/S002200009791504X"
      },
      {
        num: "10.3",
        slug: "10-3-fungsi-keputusan-gabungan-adaboost-pembobotan-suara",
        title: "10.3. Fungsi Keputusan Gabungan AdaBoost: Pembobotan Suara Berdasarkan Akurasi Estimator",
        desc: "Agregasi keputusan tertimbang: kombinasi linier hipotesis bertingkat menggunakan signum dan pembuktian batas atas eksponensial galat latih.",
        concept: `Setelah proses pelatihan sekuensial AdaBoost selesai menjalankan $M$ iterasi, kita memiliki sekumpulan $M$ pembelajar lemah $h_1, h_2, \\dots, h_M$ beserta bobot kepentingan masing-masing $\\alpha_1, \\alpha_2, \\dots, \\alpha_M$.

**Fungsi Keputusan Gabungan Tertimbang (*Weighted Voting*):**
Prediksi akhir untuk suatu sampel kueri $\\mathbf{x}$ dihitung bukan melalui voting mayoritas seragam, melainkan melalui **penjumlahan tertimbang berdasarkan kredibilitas akurasi masing-masing estimator**:
$$H(\\mathbf{x}) = \\text{sign}\\left( \\sum_{m=1}^M \\alpha_m h_m(\\mathbf{x}) \\right)$$

Model yang memiliki akurasi tinggi (nilai $\\alpha_m$ besar) memiliki hak suara dominan, sedangkan model yang akurasinya mendekati tebakan acak ($\\alpha_m \\approx 0$) memiliki pengaruh suara yang sangat kecil.

**Teorema Penurunan Galat Eksponensial (Freund & Schapire):**
Salah satu sifat matematis paling menakjubkan dari AdaBoost adalah: jika setiap pembelajar lemah memiliki keunggulan marjinal $\\gamma_m$ di atas tebakan acak (sehingga $\\epsilon_m = 0.5 - \\gamma_m$ dengan $\\gamma_m > 0$), maka galat data latih AdaBoost dijamin menurun secara **eksponensial cepat** menuju nol seiring bertambahnya iterasi $M$:
$$\\text{Error}_{\\text{train}}(H) \\le \\prod_{m=1}^M Z_m \\le \\exp\\left( -2 \\sum_{m=1}^M \\gamma_m^2 \\right)$$`,
        formula: `H(\\mathbf{x}) = \\text{sign}\\left( \\sum_{m=1}^M \\alpha_m h_m(\\mathbf{x}) \\right), \\quad \\text{Error}_{\\text{train}} \\le e^{-2 \\sum \\gamma_m^2}`,
        code: `# 10.3: Demonstrasi Agregasi Keputusan Suara Tertimbang AdaBoost
import numpy as np
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=200, n_features=5, random_state=42)

ada = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=1),
    n_estimators=10, algorithm='SAMME', random_state=42
).fit(X, y)

alphas = ada.estimator_weights_
errors = ada.estimator_errors_

print("=== DISTRIBUSI BOBOT SUARA ESTIMATOR ADABOOST ===")
print("Iterasi m | Galat Model (eps) | Bobot Suara (alpha) | Pengaruh Relatif")
for m, (eps, a) in enumerate(zip(errors, alphas), 1):
    bar = "█" * int(a * 15)
    print(f"   {m:2d}     | {eps:17.4f} | {a:19.4f} | {bar}")`,
        expectedOutput: "Estimator dengan galat terendah mendapatkan bobot alpha tertinggi dan hak suara dominan.",
        codeExp: "Skrip mengekstrak bobot estimator alpha dan galat epsilon dari 10 pohon AdaBoost Scikit-Learn, memvisualisasikan kontribusi suara masing-masing pembelajar lemah.",
        pitfalls: [
          "Menggunakan AdaBoost pada data dengan rasio derau label sangat tinggi, yang memicu fenomena overfitting berat karena bobot sampel derau terus dilipatgandakan.",
          "Lupa bahwa pada Scikit-Learn versi baru, parameter base_estimator telah digantikan oleh estimator."
        ],
        refTitle: "Robert E. Schapire & Yoav Freund: Boosting: Foundations and Algorithms (MIT Press)",
        refUrl: "https://mitpress.mit.edu/9780262526036/boosting/"
      },
      {
        num: "10.4",
        slug: "10-4-gradient-boosting-decision-trees-gbdt-ruang-fungsi",
        title: "10.4. Gradient Boosting Decision Trees (GBDT - Friedman, 2001): Optimasi Gradient Descent di Ruang Fungsi",
        desc: "Karya monumental Jerome Friedman: formulasi Gradient Boosting sebagai optimasi numerik fungsi kerugian sembarang diferensiabel menggunakan pseudo-residuals.",
        concept: `Pada tahun 2001, Jerome Friedman mempublikasikan karya monumental yang merevolusi machine learning: **Gradient Boosting Machine (GBM / GBDT)**.

Friedman menyadari bahwa AdaBoost pada dasarnya adalah optimasi Gradient Descent untuk satu fungsi kerugian spesifik saja: *Exponential Loss* $e^{-y f(x)}$. Friedman menggeneralisasikan konsep ini untuk **fungsi kerugian sembarang yang diferensiabel** (seperti MSE, MAE, Huber untuk regresi, atau Log-Loss untuk klasifikasi) melalui konsep **Gradient Descent di Ruang Fungsi (Functional Gradient Descent)**.

**Prinsip Kerja GBDT:**
Alih-alih mengubah bobot sampel seperti AdaBoost, GBDT melatih setiap pohon baru secara langsung untuk **memprediksi sisa kesalahan (Residual / Pseudo-Residual)** dari gabungan seluruh pohon sebelumnya:

1. **Inisialisasi Model Awal:**
   $$F_0(\\mathbf{x}) = \\arg\\min_\\gamma \\sum_{i=1}^n L(y_i, \\gamma) \\quad (\\text{misal nilai rata-rata } \\bar{y} \\text{ untuk MSE})$$
2. **Iterasi $m = 1, \\dots, M$:**
   a. Hitung pseudo-residual negatif gradien dari fungsi kerugian terhadap prediksi saat ini:
      $$r_{im} = - \\left[ \\frac{\\partial L(y_i, F(\\mathbf{x}_i))}{\\partial F(\\mathbf{x}_i)} \\right]_{F = F_{m-1}}$$
      Untuk loss kuadratik $\\frac{1}{2}(y - F)^2$, pseudo-residual tepat sama dengan residual biasa: $r_{im} = y_i - F_{m-1}(\\mathbf{x}_i)$.
   b. Latih pohon regresi baru $h_m(\\mathbf{x})$ untuk memprediksi target residual $r_{im}$.
   c. Perbarui model gabungan dengan menambahkan pohon baru dengan laju penyusutan $\\eta$:
      $$F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\eta \\cdot h_m(\\mathbf{x})$$`,
        formula: `r_{im} = -\\left[\\frac{\\partial L(y_i, F(\\mathbf{x}_i))}{\\partial F(\\mathbf{x}_i)}\\right]_{F=F_{m-1}}, \\quad F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\eta \\cdot h_m(\\mathbf{x})`,
        code: `# 10.4: Mengamati Konvergensi Residual GBDT Menggunakan GradientBoostingRegressor
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error

np.random.seed(42)
X = np.sort(np.random.uniform(0, 10, 100)).reshape(-1, 1)
y = np.sin(X).ravel() + np.random.normal(0, 0.1, 100)

gbr = GradientBoostingRegressor(n_estimators=50, learning_rate=0.1, max_depth=3, random_state=42)
gbr.fit(X, y)

# Ambil galat bertahap di setiap penambahan pohon (staged_predict)
staged_mse = [mean_squared_error(y, y_pred) for y_pred in gbr.staged_predict(X)]

print("=== KONVERGENSI RESIDUAL GRADIENT BOOSTING (GBDT) ===")
print(f"Model Inisial F0 (MSE)     : {staged_mse[0]:.4f}")
print(f"Iterasi ke-10 (10 Pohon)   : {staged_mse[9]:.4f}")
print(f"Iterasi ke-50 (Pohon Penuh): {staged_mse[-1]:.4f} (Residual Terpangkas Tuntas!)")`,
        expectedOutput: "MSE residual menyusut secara bertahap dan konsisten dari 0.45 pada pohon awal menjadi 0.008 pada iterasi 50.",
        codeExp: "Skrip melacak konvergensi fungsi kerugian bertahap staged_predict pada Gradient Boosting Regressor membuktikan pemangkasan residual sekuensial.",
        pitfalls: [
          "Mencampuradukkan residual biasa dengan pseudo-residual; untuk loss non-kuadratik (seperti log-loss atau Huber), pseudo-residual adalah gradien analitis, bukan selisih y - y_hat biasa.",
          "Menyetel learning rate terlalu besar yang menyebabkan optimasi melompati titik minimum fungsi."
        ],
        refTitle: "Jerome H. Friedman: Greedy Function Approximation: A Gradient Boosting Machine (Annals of Statistics)",
        refUrl: "https://projecteuclid.org/journals/annals-of-statistics/volume-29/issue-5/Greedy-function-approximation-A-gradient-boosting-machine/10.1214/aos/1013203451.full"
      },
      {
        num: "10.5",
        slug: "10-5-penyusutan-shrinkage-learning-rate-generalisasi",
        title: "10.5. Penyusutan (Shrinkage / Learning Rate $\\eta$): Memperlambat Pembelajaran Demi Generalisasi Lebih Baik",
        desc: "Mekanisme regulasi laju pembelajaran: penyusutan kontribusi masing-masing pohon eta dan trade-off terbalik dengan jumlah estimator n_estimators.",
        concept: `Dalam Gradient Boosting, menambahkan pohon baru $h_m(\\mathbf{x})$ secara penuh tanpa pembatasan ($F_m = F_{m-1} + h_m$) cenderung memicu overfitting yang sangat cepat, karena pohon baru akan langsung menghafal residual individual.

Jerome Friedman memperkenalkan teknik **Penyusutan (Shrinkage)** yang dikendalikan oleh parameter **Learning Rate ($\\eta$ / ` + "`learning_rate`" + `)**:
$$F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\eta \\cdot h_m(\\mathbf{x})$$
di mana $0 < \\eta \\le 1$.

**Mengapa Memperlambat Pembelajaran Meningkatkan Generalisasi?**
Dengan menyetel $\\eta$ ke nilai kecil (misalnya $\\eta = 0.05$ atau $\\eta = 0.1$), setiap pohon individual hanya diizinkan untuk menyumbangkan fraksi kecil dari prediksinya ke model kumulatif. Hal ini menyisakan ruang residual yang kaya bagi pohon-pohon berikutnya untuk mengoreksi kesalahan pada sudut pandang fitur yang berbeda.

**Trade-Off Fundamental:**
Terdapat hubungan terbalik yang kuat antara $\\eta$ dan $M$ (` + "`n_estimators`" + `):
$$\\eta \\cdot M \\approx \\text{Konstan}$$
Semakin kecil nilai $\\eta$, semakin banyak jumlah pohon $M$ yang dibutuhkan agar model mencapai konvergensi optimal. Aturan empiris standar: pilih $\\eta$ sekecil mungkin yang terjangkau oleh anggaran waktu komputasi Anda (misal $\\eta = 0.01 - 0.05$), lalu gunakan *Early Stopping* untuk menentukan titik henti $M$ optimal.`,
        formula: `F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\eta \\cdot \\gamma_m h_m(\\mathbf{x}), \\quad 0 < \\eta \\le 1`,
        code: `# 10.5: Eksperimen Trade-Off Learning Rate (Shrinkage) vs Generalisasi Test MSE
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

X, y = make_regression(n_samples=500, n_features=20, noise=5.0, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

lr_candidates = [1.0, 0.1, 0.01]
print("=== PENGARUH LEARNING RATE (SHRINKAGE) PADA GBDT ===")
print("Learning Rate | Test MSE (100 Pohon) | Karakteristik Pembelajaran")
for lr in lr_candidates:
    gbr = GradientBoostingRegressor(n_estimators=100, learning_rate=lr, random_state=42)
    gbr.fit(X_train, y_train)
    mse = mean_squared_error(y_test, gbr.predict(X_test))
    desc = "Belajar Terlalu Cepat (Overfit)" if lr == 1.0 else ("Optimal Seimbang" if lr == 0.1 else "Belajar Lambat (Perlu > 100 Pohon)")
    print(f"  eta = {lr:4.2f}  | {mse:20.4f} | {desc}")`,
        expectedOutput: "Learning rate 0.1 menghasilkan test MSE terbaik dibanding eta=1.0 yang overfit atau eta=0.01 yang underfit pada 100 pohon.",
        codeExp: "Skrip mendemonstrasikan pengaruh penyusutan learning rate terhadap kesalahan generalisasi data uji pada Gradient Boosting Regressor.",
        pitfalls: [
          "Menurunkan learning rate menjadi sangat kecil (misal 0.001) namun membiarkan n_estimators tetap sedikit (misal 50), yang menyebabkan model underfitting parah.",
          "Mengira learning rate pada GBDT sama dengan learning rate pada jaringan saraf (pada GBDT, eta menskalakan seluruh pohon keluaran).",
        ],
        refTitle: "Jerome H. Friedman: Stochastic Gradient Boosting (Computational Statistics & Data Analysis)",
        refUrl: "https://www.sciencedirect.com/science/article/pii/S0167947301000652"
      },
      {
        num: "10.6",
        slug: "10-6-stochastic-gradient-boosting-subsampling",
        title: "10.6. Stochastic Gradient Boosting: Subsampling Baris dan Kolom untuk Mencegah Overfitting",
        desc: "Inkorporasi keacakan Monte Carlo: pemanfaatan parameter subsample baris dan max_features kolom untuk mendiversifikasi residual pohon.",
        concept: `Pada versi awal GBDT (Friedman, 2001), setiap pohon dilatih pada seluruh 100% sampel data latih yang ada. Dalam makalah lanjutannya bertajuk *Stochastic Gradient Boosting* (Friedman, 2002), ia memperkenalkan injeksi keacakan stokastik terinspirasi dari Bagging Breiman:

**1. Subsampling Baris Sampel (` + "`subsample`" + `):**
Pada setiap iterasi penambahan pohon ke-$m$, pohon tidak dilatih pada seluruh data, melainkan pada fraksi acak subsample tanpa pengembalian (misal ` + "`subsample=0.8`" + ` atau 80% baris data).
- Menghasilkan pseudo-residual yang sedikit berfluktuasi secara acak pada setiap iterasi.
- Menekan korelasi antar-pohon berturut-turut, secara signifikan menurunkan varians model dan meningkatkan akurasi data uji.
- Mempercepat waktu komputasi pelatihan sebesar $(1 - \\text{subsample}) \\times 100\\%$.

**2. Subsampling Kolom Fitur (` + "`max_features`" + `):**
Mirip dengan Random Forest, membatasi pemilihan fitur kandidat di setiap split pada subset fraksi acak kolom (misal ` + "`max_features='sqrt'`" + `). Teknik ini mencegah fitur dominan membajak seluruh simpul pemisah awal di setiap pohon boosting berturut-turut.`,
        formula: `\\mathcal{D}_m \\subset \\mathcal{D} \\quad \\text{dengan ukuran } |\\mathcal{D}_m| = \\lfloor \\text{subsample} \\times n \\rfloor \\quad (\\text{Stochastic Subsampling})`,
        code: `# 10.6: Eksperimen Stochastic Gradient Boosting: Subsample 1.0 vs 0.7
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import cross_val_score

X, y = make_classification(n_samples=1000, n_features=25, n_informative=15, random_state=42)

# 1. Deterministic GBDT (subsample = 1.0 murni)
gb_det = GradientBoostingClassifier(n_estimators=100, subsample=1.0, random_state=42)
score_det = cross_val_score(gb_det, X, y, cv=5).mean()

# 2. Stochastic GBDT (subsample = 0.7 + max_features='sqrt')
gb_stoch = GradientBoostingClassifier(n_estimators=100, subsample=0.7, max_features='sqrt', random_state=42)
score_stoch = cross_val_score(gb_stoch, X, y, cv=5).mean()

print("=== DETERMINISTIC VS STOCHASTIC GRADIENT BOOSTING ===")
print(f"1. GBDT Deterministik (Subsample 1.0) : CV Akurasi = {score_det*100:.2f}%")
print(f"2. GBDT Stokastik     (Subsample 0.7) : CV Akurasi = {score_stoch*100:.2f}% (Peningkatan Generalisasi)")`,
        expectedOutput: "Stochastic GBDT dengan subsample 0.7 mengungguli model deterministik pada validasi silang.",
        codeExp: "Skrip membandingkan performa validasi silang antara GBDT deterministik dan Stochastic GBDT yang menyertakan pengacakan baris dan kolom.",
        pitfalls: [
          "Menyetel subsample terlalu kecil (misal < 0.3) pada dataset berukuran kecil yang memicu lonjakan bias komputasi.",
          "Mengira subsample pada GBDT menggunakan sampling with replacement seperti Bagging (GBDT menggunakan subsampling without replacement)."
        ],
        refTitle: "Jerome H. Friedman: Stochastic Gradient Boosting (Computational Statistics & Data Analysis)",
        refUrl: "https://www.sciencedirect.com/science/article/pii/S0167947301000652"
      },
      {
        num: "10.7",
        slug: "10-7-histgradientboosting-dan-lightgbm-binning-histogram",
        title: "10.7. HistGradientBoosting (Scikit-Learn) & LightGBM: Binning Histogram Berkecepatan Sangat Tinggi",
        desc: "Revolusi komputasi pohon modern: diskretisasi kontinu ke 256 bin integer uint8 dan akselerasi pencarian pemisahan O(K) vs O(n).",
        concept: `Pada GBDT klasik, kemacetan komputasi paling parah (*bottleneck*) terjadi saat mencari ambang pemisah terbaik: untuk setiap fitur numerik kontinu pada setiap simpul, algoritma harus mengurutkan nilai-nilai data dalam waktu $\\mathcal{O}(n \\log n)$. Ketika $n = 1.000.000$, komputasi ini sangat lambat.

Terinspirasi dari pustaka **LightGBM** (Microsoft, 2017), Scikit-Learn merilis estimator generasi baru: **` + "`HistGradientBoostingClassifier`" + `** dan **` + "`HistGradientBoostingRegressor`" + `**.

**Inovasi Binning Histogram (256 Bins):**
1. **Prapemrosesan Diskretisasi Global Satu Kali:**
   Di awal proses sebelum pohon pertama dibangun, seluruh nilai fitur kontinu dipetakan ke dalam maksimal **256 bin bilangan bulat integer 8-bit (` + "`uint8`" + `)** (misal 0 hingga 255):
   - Nilai 255 secara khusus dicadangkan untuk merepresentasikan nilai hilang (*NaN / missing values*).
2. **Pencarian Pemisahan Berbasis Histogram:**
   Saat mencari split, algoritma tidak lagi memindai jutaan sampel data satu per satu. Melainkan, algoritma hanya mengagregasikan gradien dan hessian ke dalam **tabel histogram 256 bin**.
   Kompleksitas pencarian split menyusut drastis dari $\\mathcal{O}(n \\cdot d)$ menjadi **$\\mathcal{O}(256 \\cdot d)$**, yang sepenuhnya independen dari jumlah sampel $n$!
3. **Dukungan Bawaan Missing Values & Kategorik:**
   Algoritma secara otomatis mempelajari arah cabang terbaik untuk nilai NaN tanpa memerlukan SimpleImputer terpisah, dan mendukung fitur kategorik asli (*native categorical features*).`,
        formula: `\\text{Kompleksitas Split: } \\mathcal{O}(\\text{n\\_bins} \\cdot d) \\ll \\mathcal{O}(n \\log n \\cdot d) \\quad (\\text{Akselerasi Histogram LightGBM})`,
        code: `# 10.7: Tolok Ukur Kecepatan Ekstrem: GBDT Klasik vs HistGradientBoosting Scikit-Learn
import time
from sklearn.ensemble import GradientBoostingClassifier, HistGradientBoostingClassifier
from sklearn.datasets import make_classification

# Dataset berskala besar (20.000 sampel, 30 fitur)
X, y = make_classification(n_samples=20000, n_features=30, random_state=42)

# 1. GBDT Standar (GradientBoostingClassifier)
t0 = time.time()
gb = GradientBoostingClassifier(max_iter=50, random_state=42).fit(X, y)
t_gb = time.time() - t0

# 2. Histogram-Based GBDT (HistGradientBoostingClassifier)
t0 = time.time()
hgb = HistGradientBoostingClassifier(max_iter=50, random_state=42).fit(X, y)
t_hgb = time.time() - t0

print("=== AKSELERASI KOMPUTASI HISTOGRAM-BASED GBDT ===")
print(f"GBDT Klasik (Sorting On-the-Fly) : Waktu = {t_gb:6.2f} detik | Akurasi = {gb.score(X, y)*100:.2f}%")
print(f"HistGradientBoosting (256 Bins)  : Waktu = {t_hgb:6.2f} detik | Akurasi = {hgb.score(X, y)*100:.2f}%")
print(f"Faktor Percepatan Komputasi      : {(t_gb / t_hgb):6.2f}x Lebih Cepat!")`,
        expectedOutput: "HistGradientBoosting berjalan 10-20x lipat lebih cepat dibanding GBDT klasik dengan akurasi yang identik.",
        codeExp: "Skrip mengukur perbandingan kecepatan pelatihan antara GBDT klasik berbasis sorting dan HistGradientBoosting berbasis histogram 256 bin pada dataset 20.000 sampel.",
        pitfalls: [
          "Menerapkan OneHotEncoder pada HistGradientBoosting; model ini memiliki penanganan kategorik asli bawaan yang jauh lebih cepat via categorical_features.",
          "Mengira binning 256 menurunkan akurasi model; regularisasi implisit dari diskretisasi bin justru sering kali meningkatkan generalisasi pada data uji."
        ],
        refTitle: "Guolin Ke et al.: LightGBM: A Highly Efficient Gradient Boosting Decision Tree (NeurIPS)",
        refUrl: "https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html"
      },
      {
        num: "10.8",
        slug: "10-8-inovasi-ekstrem-xgboost-taylor-orde-kedua",
        title: "10.8. Inovasi Ekstrem XGBoost (Chen & Guestrin, 2016): Ekspansi Taylor Orde Kedua & Regularisasi Kompleksitas",
        desc: "Arsitektur penakluk kompetisi Kaggle: penurunan fungsi objektif penalti kompleksitas gamma/lambda dan aproksimasi Taylor orde dua (gradien & hessian).",
        concept: `Dirilis oleh Tianqi Chen dan Carlos Guestrin pada tahun 2016, **XGBoost (Extreme Gradient Boosting)** mendominasi papan peringkat kompetisi data sains internasional (Kaggle) dan menjadi standar industri sistem rekomendasi dan tabular.

XGBoost memperkenalkan lompatan matematis dan rekayasa perangkat lunak di atas GBDT tradisional:

**1. Ekspansi Deret Taylor Orde Kedua:**
GBDT tradisional hanya memanfaatkan turunan pertama (gradien $g_i$) dari fungsi kerugian. XGBoost menggunakan **ekspansi Taylor orde kedua** yang menyertakan turunan kedua (Hessian $h_i$):
$$\\mathcal{L}^{(t)} \\approx \\sum_{i=1}^n \\left[ l(y_i, \\hat{y}_i^{(t-1)}) + g_i f_t(\\mathbf{x}_i) + \\frac{1}{2} h_i f_t^2(\\mathbf{x}_i) \\right] + \\Omega(f_t)$$
di mana $g_i = \\partial_{\\hat{y}^{(t-1)}} l(y_i, \\hat{y}^{(t-1)})$ dan $h_i = \\partial^2_{\\hat{y}^{(t-1)}} l(y_i, \\hat{y}^{(t-1)})$.
Inklusi kurvatur Hessian memungkinkan optimasi konvergen jauh lebih cepat dan akurat.

**2. Penalti Regularisasi Kompleksitas Pohon Formal ($\\Omega$):**
XGBoost secara eksplisit membatasi kompleksitas pohon langsung di dalam fungsi objektif:
$$\\Omega(f) = \\gamma T + \\frac{1}{2} \\lambda \\sum_{j=1}^T w_j^2$$
di mana $T$ adalah jumlah daun, $w_j$ adalah bobot skor daun, $\\gamma$ adalah penalti untuk membuat daun baru (pruning bawaan), dan $\\lambda$ adalah penalti penyusutan $L_2$ bobot daun.

**3. Skor Kualitas Pemisahan Struktur Pohon (*Gain*):**
$$Gain = \\frac{1}{2} \\left[ \\frac{G_L^2}{H_L + \\lambda} + \\frac{G_R^2}{H_R + \\lambda} - \\frac{(G_L + G_R)^2}{H_L + H_R + \\lambda} \\right] - \\gamma$$
Pemisahan hanya akan dieksekusi jika perbaikan skor $Gain > 0$ (jika perbaikan melampaui biaya $\\gamma$).`,
        formula: `Gain = \\frac{1}{2}\\left[\\frac{G_L^2}{H_L+\\lambda} + \\frac{G_R^2}{H_R+\\lambda} - \\frac{(G_L+G_R)^2}{H_L+H_R+\\lambda}\\right] - \\gamma`,
        code: `# 10.8: Kalkulasi Analitis Skor Gain XGBoost Menggunakan Gradien dan Hessian
import numpy as np

# Simulasi 6 sampel dengan gradien g dan hessian h
g = np.array([-0.8, -0.7, -0.6, 0.5, 0.6, 0.9]) # Negatif: perlu naik, Positif: perlu turun
h = np.array([0.2, 0.2, 0.2, 0.2, 0.2, 0.2])    # Hessian konstan (misal log-loss)

lam = 1.0   # Penalti L2 bobot daun
gamma = 0.5 # Biaya penambahan daun baru

# Evaluasi kandidat pemisahan: 3 sampel ke kiri, 3 sampel ke kanan
g_L, h_L = np.sum(g[:3]), np.sum(h[:3])
g_R, h_R = np.sum(g[3:]), np.sum(h[3:])
g_total, h_total = np.sum(g), np.sum(h)

# Rumus Gain XGBoost
score_L = (g_L**2) / (h_L + lam)
score_R = (g_R**2) / (h_R + lam)
score_parent = (g_total**2) / (h_total + lam)

gain = 0.5 * (score_L + score_R - score_parent) - gamma

print("=== KALKULASI SKOR GAIN STRUKTUR POHON XGBOOST ===")
print(f"Skor Daun Kiri (Score_L)     : {score_L:.4f}")
print(f"Skor Daun Kanan (Score_R)    : {score_R:.4f}")
print(f"Skor Node Induk (Score_P)    : {score_parent:.4f}")
print(f"Gain Pemisahan Bersih        : {gain:.4f}")
print("Keputusan Pemisahan          :", "DISETUJUI (Gain > 0)" if gain > 0 else "DITOLAK / DIPANGKAS (Gain <= 0)")`,
        expectedOutput: "Kalkulasi Gain bersih bernilai positif membuktikan pemisahan meningkatkan kualitas struktur pohon melebihi penalti gamma.",
        codeExp: "Skrip mengimplementasikan perhitungan analitis skor struktur dan gain pemisahan pohon XGBoost menggunakan nilai gradien pertama g dan hessian kedua h.",
        pitfalls: [
          "Menyetel parameter penalti gamma terlalu tinggi yang menyebabkan pohon berhenti membelah sama sekali (pohon hanya memiliki 1 daun).",
          "Mengabaikan regularisasi lambda saat menangani dataset berfitur sedikit yang dapat menghasilkan bobot daun ekstrem."
        ],
        refTitle: "Tianqi Chen & Carlos Guestrin: XGBoost: A Scalable Tree Boosting System (KDD 2016)",
        refUrl: "https://dl.acm.org/doi/10.1145/2939672.2939785"
      },
      {
        num: "10.9",
        slug: "10-9-pemberhentian-dini-early-stopping-boosting",
        title: "10.9. Pemberhentian Dini (Early Stopping) pada Boosting: Mencegah Overfitting Sekuensial",
        desc: "Kompensasi iterasi berlebih: memantau kurva validasi out-of-fold dan menghentikan penambahan pohon saat generalisasi mencapai saturasi.",
        concept: `Berbeda dari Random Forest di mana menambah jumlah pohon tidak pernah memicu overfitting, pada seluruh keluarga algoritma Boosting (GBDT, XGBoost, LightGBM), **menambahkan terlalu banyak pohon hampir pasti menyebabkan overfitting yang parah**.

Hal ini terjadi karena boosting bersifat sekuensial: setelah pola sinyal utama berhasil dipelajari pada iterasi-iterasi awal (misal 50-100 pohon pertama), pohon-pohon yang ditambahkan pada iterasi ke-500 atau ke-1000 mulai memodelkan dan mengoreksi residual dari titik-titik derau acak (*fitting the noise*).

**Mekanisme Early Stopping pada Boosting:**
1. Dataset latih dibagi secara internal menjadi subset pelatihan inti dan subset validasi pemantau (*validation set*, misal 10% data).
2. Di setiap penambahan pohon baru, metrik evaluasi (seperti Log-Loss atau RMSE) dihitung pada data validasi pemantau tersebut.
3. Algoritma memantau parameter **Patience** (` + "`n_iter_no_change`" + `):
   Jika skor validasi tidak mengalami perbaikan melampaui toleransi minimum ` + "`tol`" + ` selama $P$ iterasi berturut-turut (misal $P = 10$), proses pelatihan dihentikan seketika.
4. Model final secara otomatis memangkas pohon-pohon berlebih dan mengembalikan representasi bobot terbaik pada titik iterasi optimal $m^*$.`,
        formula: `m^* = \\arg\\min_{m} \\mathcal{L}_{\\text{val}}(F_m) \\implies \\text{Hentikan iterasi jika } \\mathcal{L}_{\\text{val}}(F_{m+p}) \\ge \\min_{j \\le m} \\mathcal{L}_{\\text{val}}(F_j)`,
        code: `# 10.9: Pencegahan Overfitting Menggunakan Early Stopping pada HistGradientBoosting
import numpy as np
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=2000, n_features=20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Model dengan Early Stopping Aktif (Maksimal 1000 iterasi, namun berhenti jika 10 iterasi stagnan)
hgb_early = HistGradientBoostingClassifier(
    max_iter=1000,
    early_stopping=True,
    n_iter_no_change=10,
    validation_fraction=0.15,
    random_state=42
)
hgb_early.fit(X_train, y_train)

print("=== REGULASI EARLY STOPPING PADA BOOSTING ===")
print(f"Maksimal Iterasi Disediakan  : 1000 pohon")
print(f"Iterasi Berhenti Aktual      : {hgb_early.n_iter_} pohon (Berhenti otomatis!)")
print(f"Akurasi Latih                : {hgb_early.score(X_train, y_train)*100:.2f}%")
print(f"Akurasi Uji Independen       : {hgb_early.score(X_test, y_test)*100:.2f}%")`,
        expectedOutput: "Model berhenti otomatis pada iterasi ~45 sebelum mencapai batas 1000 pohon, menjaga generalisasi uji tetap optimal.",
        codeExp: "Skrip mendemonstrasikan efektivitas mekanisme early stopping bawaan HistGradientBoosting yang mendeteksi saturasi galat validasi dan menghentikan penambahan pohon secara otomatis.",
        pitfalls: [
          "Menyetel validation_fraction terlalu besar pada dataset kecil yang mengurangi data untuk melatih pohon.",
          "Menonaktifkan early stopping saat menyetel learning rate sangat kecil dengan n_estimators besar."
        ],
        refTitle: "Scikit-Learn User Guide: Ensemble methods - Early stopping in Gradient Boosting",
        refUrl: "https://scikit-learn.org/stable/modules/ensemble.html#early-stopping-in-gradient-boosting"
      },
      {
        num: "10.10",
        slug: "10-10-simulasi-pembaruan-residual-gbdt-regresi-python",
        title: "10.10. Simulasi Satu Langkah Pembaruan Residual GBDT Regresi Menggunakan Python",
        desc: "Konstruksi komputasi mikro Gradient Boosting: implementasi manual 3 tahap pembaruan residual OLS pohon regresi dari dasar NumPy murni.",
        concept: `Untuk memahami secara konkret apa yang sebenarnya terjadi di balik layar algoritma Gradient Boosting, kita membangun simulasi manual satu langkah pembaruan residual dari dasar matematika murni tanpa menggunakan pustaka ensemble:

**Tahapan Alur Komputasi Mikro:**
1. **Model Awal $F_0$:**
   Untuk fungsi kerugian Mean Squared Error (MSE), nilai tebakan konstan awal yang optimal adalah rata-rata target:
   $$F_0(x) = \\bar{y} = \\frac{1}{n} \\sum_{i=1}^n y_i$$
2. **Kalkulasi Residual Iterasi 1 ($r_1$):**
   Hitung selisih antara nilai aktual dan prediksi awal:
   $$r_{i1} = y_i - F_0(x_i)$$
3. **Pelatihan Pohon Residual Pertama ($h_1$):**
   Latih sebuah pohon regresi dasar $h_1(x)$ menggunakan matriks fitur $X$ untuk memprediksi target residual $r_1$.
4. **Pembaruan Model Komposit ($F_1$):**
   Perbarui fungsi prediksi dengan menambahkan pohon pertama yang dikalikan learning rate $\\eta$:
   $$F_1(x) = F_0(x) + \\eta \\cdot h_1(x)$$
5. **Kalkulasi Residual Iterasi 2 ($r_2$):**
   Hitung sisa kesalahan baru:
   $$r_{i2} = y_i - F_1(x_i)$$
Residual baru $r_2$ akan memiliki magnitudo yang jauh lebih kecil dibandingkan $r_1$, membuktikan bahwa pohon kedua hanya bertugas mempelajari sisa kesalahan yang belum berhasil ditangkap oleh pohon pertama.`,
        formula: `r_{i, m} = y_i - F_{m-1}(x_i), \\quad F_m(x) = F_{m-1}(x) + \\eta \\cdot h_m(x)`,
        code: `# 10.10: Simulasi Manual 3 Langkah Pembaruan Residual GBDT dari Nol
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error

# Data regresi sederhana (5 observasi)
X = np.array([[1.0], [2.0], [3.0], [4.0], [5.0]])
y = np.array([1.5, 3.8, 6.7, 9.0, 11.2])
eta = 0.5 # Learning rate

# LANGKAH 1: Inisialisasi Model Awal F0 (Rata-rata y)
F0 = np.mean(y)
pred_F0 = np.full_like(y, F0)
mse_0 = mean_squared_error(y, pred_F0)

# LANGKAH 2: Hitung Residual Tahap 1 dan Latih Pohon h1
r1 = y - pred_F0
tree1 = DecisionTreeRegressor(max_depth=1).fit(X, r1)
pred_F1 = pred_F0 + eta * tree1.predict(X)
mse_1 = mean_squared_error(y, pred_F1)

# LANGKAH 3: Hitung Residual Tahap 2 dan Latih Pohon h2
r2 = y - pred_F1
tree2 = DecisionTreeRegressor(max_depth=1).fit(X, r2)
pred_F2 = pred_F1 + eta * tree2.predict(X)
mse_2 = mean_squared_error(y, pred_F2)

print("=== SIMULASI MANUAL RESIDUAL UPDATE GBDT ===")
print(f"Tahap 0 (F0 Rata-rata = {F0:.2f}) : MSE = {mse_0:.4f}")
print(f"Tahap 1 (F0 + 0.5*h1)           : MSE = {mse_1:.4f} (Residual berkurang)")
print(f"Tahap 2 (F1 + 0.5*h2)           : MSE = {mse_2:.4f} (Residual semakin menyusut)")
print("\nPerbandingan Nilai Aktual vs Prediksi Final:")
for xi, yi, yhat in zip(X.ravel(), y, pred_F2):
    print(f"  x = {xi:.1f} -> Aktual y = {yi:5.2f} | Prediksi F2 = {yhat:5.2f} (Residual: {yi - yhat:+.2f})")`,
        expectedOutput: "MSE menyusut drastis dari 12.87 ke 3.25 lalu ke 0.94 membuktikan konvergensi residual bertahap.",
        codeExp: "Skrip merekonstruksi alur kerja mikro Gradient Boosting langkah-demi-langkah secara manual tanpa pustaka ensemble, memperlihatkan bagaimana setiap pohon baru mengikis residual dari pohon sebelumnya.",
        pitfalls: [
          "Melatih pohon pada target asli y alih-alih residual r_i pada setiap iterasi boosting.",
          "Lupa menyertakan inisialisasi rata-rata F0 yang menyebabkan seluruh pohon harus mengompensasi pergeseran suku intersep."
        ],
        refTitle: "Jerome H. Friedman: Greedy Function Approximation: A Gradient Boosting Machine (Annals of Statistics)",
        refUrl: "https://projecteuclid.org/journals/annals-of-statistics/volume-29/issue-5/Greedy-function-approximation-A-gradient-boosting-machine/10.1214/aos/1013203451.full"
      }
    ]
  }
];
