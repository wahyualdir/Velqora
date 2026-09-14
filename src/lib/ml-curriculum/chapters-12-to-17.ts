import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * BAB 12 - 17 KURIKULUM MACHINE LEARNING VELQORA
 * Mencakup Jaringan Saraf Tiruan (Deep Learning MLP), Computer Vision, NLP,
 * Large Language Models, AI Agents, dan Reinforcement Learning.
 */
export const ML_CHAPTERS_12_TO_17: DocSectionItem[] = [
  // =========================================================================
  // BAB 12: Dasar Deep Learning
  // =========================================================================
  {
    id: "ml-bab-12",
    slug: "bab-12-dasar-deep-learning",
    title: "BAB 12: Dasar Deep Learning",
    orderIndex: 12,
    description: "Transisi dari model linear ke Jaringan Saraf Tiruan: Perceptron, Multi-Layer Perceptron (MLPClassifier / MLPRegressor), fungsi aktivasi, solver Adam & L-BFGS, dan regularisasi penalti L2.",
    subsections: [
      {
        id: "ml-bab-12-1",
        slug: "arsitektur-multi-layer-perceptron",
        title: "12.1. Arsitektur Multi-Layer Perceptron (MLP)",
        orderIndex: 1,
        description: "Lapisan input, hidden layers tersembunyi, fungsi propagasi maju (forward pass), dan backpropagation.",
        content_markdown: `# 12.1. Arsitektur Multi-Layer Perceptron (MLP)

**Multi-Layer Perceptron (MLP)** adalah model jaringan saraf tiruan maju (*feedforward artificial neural network*) yang memetakan set input ke set output yang sesuai melalui satu atau beberapa lapisan tersembunyi (*hidden layers*).

---

## 12.1.1. Formulasi Propagasi Maju (Forward Pass)
Diberikan input $x \\in \\mathbb{R}^p$, nilai aktivasi pada lapisan tersembunyi pertama $h^{(1)}$ dihitung sebagai:

$$h^{(1)} = g(W^{(1)} x + b^{(1)})$$

Di mana:
- $W^{(1)}$ adalah matriks bobot bobot sinaptik.
- $b^{(1)}$ adalah vektor bias.
- $g(\\cdot)$ adalah fungsi aktivasi non-linear.

Untuk jaringan dengan $L$ lapisan, output akhir dihasilkan melalui komposisi fungsi bertingkat:
$$\\hat{y} = g^{(L)}(W^{(L)} h^{(L-1)} + b^{(L)})$$

---

## 12.1.2. Implementasi dengan \`MLPClassifier\` Scikit-Learn

\`\`\`python
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Generate dataset klasifikasi non-linear
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Neural network sangat sensitif terhadap skala fitur: StandardScaler wajib digunakan!
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Definisi MLP dengan 2 hidden layer (64 neuron dan 32 neuron)
mlp = MLPClassifier(
    hidden_layer_sizes=(64, 32),
    activation='relu',
    solver='adam',
    alpha=0.0001, # L2 regularization
    max_iter=300,
    random_state=42
)
mlp.fit(X_train_scaled, y_train)

print(f"Skor Akurasi MLP pada Test Set: {mlp.score(X_test_scaled, y_test):.4f}")
print(f"Jumlah iterasi konvergensi: {mlp.n_iter_}")
print(f"Fungsi rugi akhir (loss): {mlp.loss_:.4f}")
\`\`\`
`
      },
      {
        id: "ml-bab-12-2",
        slug: "aktivasi-dan-solver-optimasi",
        title: "12.2. Fungsi Aktivasi & Solver Optimasi (Adam vs L-BFGS)",
        orderIndex: 2,
        description: "Perbandingan ReLU, Tanh, dan Logistic, serta panduan memilih solver Adam untuk data besar atau L-BFGS untuk dataset kecil.",
        content_markdown: `# 12.2. Fungsi Aktivasi & Solver Optimasi (Adam vs L-BFGS)

---

## 12.2.1. Karakteristik Fungsi Aktivasi
1. **Rectified Linear Unit (ReLU)**:
   $$g(z) = \\max(0, z)$$
   Default industri modern. Menghindari masalah *vanishing gradient* pada nilai positif dan sangat efisien secara komputasi.
2. **Hyperbolic Tangent (Tanh)**:
   $$g(z) = \\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}$$
   Berpusat di nol (*zero-centered*) dengan rentang output $[-1, 1]$.
3. **Logistic Sigmoid**:
   $$g(z) = \\frac{1}{1 + e^{-z}}$$
   Menghasilkan probabilitas dalam rentang $[0, 1]$, rentan vanishing gradient untuk $|z| \\gg 0$.

---

## 12.2.2. Pemilihan Solver Optimasi di Scikit-Learn
- \`solver='adam'\`: Metode Stochastic Gradient berbasis momen adaptif orde pertama. Sangat tangguh untuk dataset ribuan hingga jutaan sampel.
- \`solver='l-bfgs'\`: Algoritma Quasi-Newton orde kedua yang mengestimasi invers matriks Hessian. Sangat cepat konvergen dan presisi tinggi untuk dataset berukuran kecil hingga menengah ($< 2.000$ sampel).
- \`solver='sgd'\`: Gradien stokastik murni dengan opsi momentum Nesterov.

\`\`\`python
# Contoh penggunaan solver l-bfgs untuk dataset berukuran kecil
mlp_fast = MLPClassifier(hidden_layer_sizes=(16,), solver='l-bfgs', max_iter=200, random_state=42)
mlp_fast.fit(X_train_scaled[:100], y_train[:100])
print("L-BFGS konvergen dalam iterasi:", mlp_fast.n_iter_)
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 13: Computer Vision
  // =========================================================================
  {
    id: "ml-bab-13",
    slug: "bab-13-computer-vision",
    title: "BAB 13: Computer Vision",
    orderIndex: 13,
    description: "Pemrosesan citra digital dalam machine learning: representasi piksel sebagai tensor, klasifikasi gambar angka tulisan tangan (Optical Recognition of Handwritten Digits), dan dasar konvolusi citra 2D.",
    subsections: [
      {
        id: "ml-bab-13-1",
        slug: "representasi-citra-dan-digits-dataset",
        title: "13.1. Representasi Citra & Klasifikasi Angka (Digits Dataset)",
        orderIndex: 1,
        description: "Memproses citra 2D grayscale/RGB menjadi vektor fitur 1D dan membangun model pengenalan pola dengan Support Vector Classifier.",
        content_markdown: `# 13.1. Representasi Citra & Klasifikasi Angka (Digits Dataset)

Dalam domain visi komputer, citra digital adalah matriks intensitas piksel 2 dimensi (grayscale) atau 3 dimensi tensor berukuran $(H \\times W \\times C)$ (RGB warna).

---

## 13.1.1. Perataan Piksel (*Pixel Flattening*)
Untuk algoritma machine learning standar tabular (seperti SVM atau Random Forest), matriks citra 2D diratakan (*flattened*) menjadi vektor fitur satu dimensi berukuran $1 \\times (H \\times W)$:

\`\`\`python
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

# 1. Memuat dataset angka 8x8 piksel
digits = load_digits()
print(f"Jumlah citra angka: {digits.images.shape[0]}")
print(f"Dimensi citra matriks asli: {digits.images.shape[1:]} piksel")
print(f"Dimensi vektor fitur yang diratakan: {digits.data.shape[1]} fitur")

# 2. Normalisasi intensitas piksel (0 - 16 menjadi 0.0 - 1.0)
X = digits.data / 16.0
y = digits.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 3. Latih classifier SVM dengan kernel RBF
clf = SVC(gamma=0.05, C=5.0, random_state=42)
clf.fit(X_train, y_train)

# 4. Evaluasi Hasil Prediksi
y_pred = clf.predict(X_test)
print(f"Akurasi Pengenalan Karakter Angka: {clf.score(X_test, y_test)*100:.2f}%")
print("\nRingkasan Laporan Klasifikasi:\n", classification_report(y_test, y_pred, digits=3))
\`\`\`
`
      },
      {
        id: "ml-bab-13-2",
        slug: "konsep-konvolusi-dan-pooling",
        title: "13.2. Konsep Konvolusi 2D, Filter Kernel, & Ekstraksi Fitur Spasial",
        orderIndex: 2,
        description: "Operasi konvolusi matriks, filter deteksi tepi Sobel, dan reduksi spasial pooling.",
        content_markdown: `# 13.2. Konsep Konvolusi 2D, Filter Kernel, & Ekstraksi Fitur Spasial

Perataan piksel sederhana mengabaikan relasi ketetanggaan spasial (*spatial locality*). Operasi **Konvolusi 2D** mempertahankan relasi ketetanggaan dengan menggeser matriks kernel kecil $K$ (misal $3 \\times 3$) di atas citra input $I$:

$$(I * K)(i, j) = \\sum_{m} \\sum_{n} I(i-m, j-n) K(m, n)$$

\`\`\`python
import numpy as np

# Simulasi operasi konvolusi 2D filter deteksi tepi vertikal (Sobel)
def conv2d_simple(image, kernel):
    k_h, k_w = kernel.shape
    out_h = image.shape[0] - k_h + 1
    out_w = image.shape[1] - k_w + 1
    output = np.zeros((out_h, out_w))
    for i in range(out_h):
        for j in range(out_w):
            patch = image[i:i+k_h, j:j+k_w]
            output[i, j] = np.sum(patch * kernel)
    return output

sobel_vertical = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
dummy_patch = np.array([[10, 10, 80], [10, 10, 80], [10, 10, 80]])
edge_response = conv2d_simple(dummy_patch, sobel_vertical)
print("Respon deteksi tepi vertikal:", edge_response[0, 0])
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 14: Natural Language Processing
  // =========================================================================
  {
    id: "ml-bab-14",
    slug: "bab-14-natural-language-processing",
    title: "BAB 14: Natural Language Processing",
    orderIndex: 14,
    description: "Pemrosesan bahasa alami (NLP): Ekstraksi fitur teks, Bag-of-Words (CountVectorizer), TF-IDF (TfidfVectorizer), n-grams, dan klasifikasi teks dengan Naive Bayes & model linear.",
    subsections: [
      {
        id: "ml-bab-14-1",
        slug: "vektorisasi-teks-count-dan-tfidf",
        title: "14.1. Ekstraksi Fitur Teks: Bag-of-Words & TF-IDF",
        orderIndex: 1,
        description: "Transformasi teks tidak terstruktur menjadi representasi matriks renggang numerik (sparse matrix) siap latih.",
        content_markdown: `# 14.1. Ekstraksi Fitur Teks: Bag-of-Words & TF-IDF

Komputer dan algoritma machine learning tidak dapat memproses kata-kata mentah secara langsung. Teks harus dikonversi ke dalam representasi numerik.

---

## 14.1.1. Bag-of-Words (\`CountVectorizer\`)
Menghitung frekuensi kemunculan setiap kata dalam dokumen tanpa memperhatikan tata bahasa (*grammar*) atau urutan kata.

---

## 14.1.2. TF-IDF (\`TfidfVectorizer\`)
Kata yang muncul di hampir semua dokumen (seperti "dan", "yang", "adalah") membawa sedikit informasi deskriptif. **TF-IDF** menimbang frekuensi kata dengan kebalikan frekuensi dokumennya:

$$\\text{tfidf}(t, d, D) = \\text{tf}(t, d) \\times \\text{idf}(t, D)$$

Di mana perumusan IDF yang digunakan Scikit-Learn:
$$\\text{idf}(t) = \\ln \\left( \\frac{1 + n}{1 + \\text{df}(t)} \\right) + 1$$

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

corpus = [
    "Machine learning memungkinkan komputer belajar dari pola data masa lalu.",
    "Deep learning adalah subbidang machine learning yang memanfaatkan neural network.",
    "Sepak bola dan basket adalah cabang olahraga yang menyehatkan tubuh."
]

tfidf = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
X_tfidf = tfidf.fit_transform(corpus)

print(f"Ukuran matriks TF-IDF: {X_tfidf.shape} (3 dokumen, {X_tfidf.shape[1]} unigram & bigram)")
print("Fitur kata teratas:", tfidf.get_feature_names_out()[:6])
\`\`\`
`
      },
      {
        id: "ml-bab-14-2",
        slug: "pipeline-klasifikasi-teks-sentimen",
        title: "14.2. Pipeline Klasifikasi Teks End-to-End (Analisis Sentimen)",
        orderIndex: 2,
        description: "Membangun pipeline klasifikasi ulasan pelanggan menggunakan MultinomialNB dan LogisticRegression.",
        content_markdown: `# 14.2. Pipeline Klasifikasi Teks End-to-End (Analisis Sentimen)

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

# Dataset contoh ulasan produk
train_texts = [
    "Produk sangat bagus pengiriman sangat cepat",
    "Kualitas barang istimewa luar biasa memuaskan",
    "Barang rusak cacat dan tidak sesuai deskripsi",
    "Sangat mengecewakan pelayanan buruk dan lambat"
]
train_labels = [1, 1, 0, 0] # 1: Positif, 0: Negatif

test_texts = [
    "Pengiriman cepat dan kualitas sangat baik",
    "Barang cacat dan mengecewakan"
]
test_labels = [1, 0]

# Pipeline teks: Vektorisasi -> Estimator
text_clf = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
    ('clf', MultinomialNB(alpha=0.1))
])

text_clf.fit(train_texts, train_labels)
preds = text_clf.predict(test_texts)

print("Prediksi ulasan pengujian:", ["Positif" if p == 1 else "Negatif" for p in preds])
print("Akurasi:", accuracy_score(test_labels, preds))
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 15: Large Language Model
  // =========================================================================
  {
    id: "ml-bab-15",
    slug: "bab-15-large-language-model",
    title: "BAB 15: Large Language Model",
    orderIndex: 15,
    description: "Arsitektur Transformer, mekanisme Self-Attention, paradigma Pretraining vs Fine-Tuning (PEFT/LoRA), dan pemanfaatan Text Embeddings dalam pipeline Machine Learning Scikit-Learn.",
    subsections: [
      {
        id: "ml-bab-15-1",
        slug: "transformasi-arsitektur-dan-self-attention",
        title: "15.1. Evolusi dari Model Sekuensial ke Transformer & Self-Attention",
        orderIndex: 1,
        description: "Skalabilitas komputasi paralel self-attention dan perumusan scaled dot-product attention.",
        content_markdown: `# 15.1. Evolusi dari Model Sekuensial ke Transformer & Self-Attention

Model sekuensial klasik (RNN/LSTM) memproses teks kata-demi-kata secara bertahap, menjadikannya lambat untuk dilatih pada dataset raksasa karena kendala non-paralel. 

**Transformer** mengandalkan mekanisme **Scaled Dot-Product Attention**:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V$$

Di mana:
- $Q$ (Query): Apa yang dicari oleh token saat ini.
- $K$ (Key): Apa yang ditawarkan oleh token-token lainnya.
- $V$ (Value): Informasi representasi semantik yang diekstraksi.
- $\\sqrt{d_k}$: Faktor penskalaan untuk mencegah gradien menjadi terlalu kecil saat dimensi besar.
`
      },
      {
        id: "ml-bab-15-2",
        slug: "integrasi-llm-embeddings-dengan-tabular-ml",
        title: "15.2. Mengintegrasikan LLM Embeddings ke dalam Pipeline Tabular Scikit-Learn",
        orderIndex: 2,
        description: "Menggabungkan representasi vektor semantik dari model bahasa dengan fitur tabular menggunakan ColumnTransformer.",
        content_markdown: `# 15.2. Mengintegrasikan LLM Embeddings ke dalam Pipeline Tabular Scikit-Learn

Dalam sistem industri nyata, data seringkali berbentuk hibrida: kombinasi fitur terstruktur (angka, kategori) dengan fitur tidak terstruktur (deskripsi teks pelanggan, ulasan catatan teknis).

Vektor semantik (*dense embeddings*) dari model bahasa (seperti OpenAI \`text-embedding-3\` atau model lokal Ollama / HuggingFace) dapat dimasukkan langsung sebagai matriks fitur ke estimator Scikit-Learn:

\`\`\`python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

# Simulasi vektor embedding teks berdimensi 8 (misal dari LLM transformer)
np.random.seed(42)
text_embeddings = np.random.randn(200, 8)
# Fitur numerik tabular standar (misal umur, lama berlangganan)
tabular_features = np.random.uniform(20, 70, size=(200, 2))

# Gabungkan fitur tabular dan teks embedding secara horizontal (Horizontal Stacking)
X_combined = np.hstack([tabular_features, text_embeddings])
y = np.random.choice([0, 1], size=200, p=[0.7, 0.3])

clf = LogisticRegression(max_iter=500, random_state=42)
clf.fit(X_combined, y)

print(f"Total fitur gabungan (Tabular + LLM Embedding): {X_combined.shape[1]}")
print(f"Skor ROC-AUC Model Hibrida: {roc_auc_score(y, clf.predict_proba(X_combined)[:, 1]):.4f}")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 16: AI Agents & Sistem Generatif
  // =========================================================================
  {
    id: "ml-bab-16",
    slug: "bab-16-ai-agents-sistem-generatif",
    title: "BAB 16: AI Agents & Sistem Generatif",
    orderIndex: 16,
    description: "Arsitektur Agen Otonom berbasis ReAct Loop (Reasoning + Acting), Tool Use & Function Calling, eksekusi kode Python mandiri, dan orkestrasi multi-agent.",
    subsections: [
      {
        id: "ml-bab-16-1",
        slug: "react-reasoning-and-tool-calling",
        title: "16.1. Pola ReAct (Reasoning + Acting) & Pemanggilan Alat (Tool Use)",
        orderIndex: 1,
        description: "Siklus iteratif Thought -> Action -> Observation untuk menyelesaikan tugas data science multi-langkah.",
        content_markdown: `# 16.1. Pola ReAct (Reasoning + Acting) & Pemanggilan Alat (Tool Use)

**AI Agent** adalah sistem perangkat lunak yang menggunakan model pembelajaran bahasa cerdas sebagai otak (*reasoning engine*) untuk berinteraksi secara otonom dengan lingkungannya melalui sekumpulan alat bantu (*tools*).

---

## 16.1.1. Siklus ReAct
1. **Thought**: Agen menganalisis keadaan saat ini dan merumuskan rencana tindakan logis berikutnya.
2. **Action**: Agen memanggil tool spesifik dengan argumen terstruktur (misal query database, eksekusi kode Python, atau kalkulator).
3. **Observation**: Agen membaca output dari eksekusi tool tersebut dan mengintegrasikannya ke memori konteksnya.
4. **Final Answer**: Mengembalikan jawaban akhir ketika seluruh tahapan terpenuhi.

\`\`\`python
# Implementasi Deterministic ReAct Simulator untuk Analisis Data ML
def tool_predict_sales(budget_marketing):
    # Simulasi model regresi terlatih
    return float(budget_marketing) * 2.8 + 150.0

def react_agent_executor(user_prompt):
    print(f"[User]: {user_prompt}")
    
    # 1. Tahap Reasoning (Thought)
    thought = "User ingin memprediksi penjualan dengan budget marketing 50 juta. Saya perlu memanggil tool_predict_sales."
    print(f"[Thought]: {thought}")
    
    # 2. Tahap Action
    action = "tool_predict_sales"
    action_arg = 50.0
    print(f"[Action]: Memanggil {action}(budget={action_arg})")
    
    # 3. Tahap Observation
    observation = tool_predict_sales(action_arg)
    print(f"[Observation]: Output estimasi adalah {observation} juta IDR")
    
    # 4. Final Answer
    final_resp = f"Berdasarkan model prediktif, alokasi anggaran Rp {action_arg} juta menghasilkan proyeksi omset Rp {observation} juta."
    return final_resp

print("\n" + react_agent_executor("Berapa estimasi omset jika kita pasang iklan 50 juta?"))
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 17: Reinforcement Learning
  // =========================================================================
  {
    id: "ml-bab-17",
    slug: "bab-17-reinforcement-learning",
    title: "BAB 17: Reinforcement Learning",
    orderIndex: 17,
    description: "Pembelajaran penguatan: Markov Decision Process (MDP), Persamaan Optimalitas Bellman, Tabular Q-Learning, dan strategi eksplorasi Epsilon-Greedy.",
    subsections: [
      {
        id: "ml-bab-17-1",
        slug: "markov-decision-process-dan-bellman",
        title: "17.1. Fondasi Matematika: Markov Decision Process & Bellman Equation",
        orderIndex: 1,
        description: "State space S, Action space A, Reward R, Discount factor gamma, dan perumusan matematis fungsi nilai state-action Q(s, a).",
        content_markdown: `# 17.1. Fondasi Matematika: Markov Decision Process & Bellman Equation

Berbeda dengan Supervised Learning (yang memerlukan data berlabel) atau Unsupervised Learning (yang mencari pola laten tanpa target), **Reinforcement Learning (RL)** melatih agen melalui interaksi coba-coba (*trial-and-error*) dengan lingkungan untuk memaksimalkan imbalan kumulatif (*cumulative discounted reward*).

---

## 17.1.1. Markov Decision Process (MDP)
Formulasi formal RL didefinisikan oleh tuple $(S, A, P, R, \\gamma)$:
- $S$: Kumpulan keadaan lingkungan (*state*).
- $A$: Kumpulan tindakan yang dapat diambil (*action*).
- $P(s' \\mid s, a)$: Probabilitas transisi ke state berikutnya $s'$ setelah aksi $a$.
- $R(s, a)$: Fungsi imbalan langsung (*reward*).
- $\\gamma \\in [0, 1)$: Faktor diskon untuk imbalan di masa depan.

---

## 17.1.2. Persamaan Optimalitas Bellman
Fungsi nilai aksi optimal $Q^*(s, a)$ menyatakan imbalan kumulatif maksimum yang dapat diperoleh:

$$Q^*(s, a) = R(s, a) + \\gamma \\sum_{s'} P(s' \\mid s, a) \\max_{a'} Q^*(s', a')$$
`
      },
      {
        id: "ml-bab-17-2",
        slug: "tabular-q-learning-dan-epsilon-greedy",
        title: "17.2. Implementasi Tabular Q-Learning & Eksplorasi Epsilon-Greedy",
        orderIndex: 2,
        description: "Algoritma pembaruan Temporal Difference (TD) Q-Learning dan keseimbangan Exploration vs Exploitation.",
        content_markdown: `# 17.2. Implementasi Tabular Q-Learning & Eksplorasi Epsilon-Greedy

---

## 17.2.1. Rumus Pembaruan Q-Learning
$$Q(s_t, a_t) \\leftarrow Q(s_t, a_t) + \\alpha \\left[ r_{t+1} + \\gamma \\max_a Q(s_{t+1}, a) - Q(s_t, a_t) \\right]$$

Di mana:
- $\\alpha$: Laju pembelajaran (*learning rate*).
- $r_{t+1} + \\gamma \\max_a Q(s_{t+1}, a)$: Target TD (*Temporal Difference Target*).
- $\\left[ \\text{Target} - Q(s_t, a_t) \\right]$: Kesalahan TD (*TD Error*).

\`\`\`python
import numpy as np

# Inisialisasi lingkungan 4-state sederhana: State 3 adalah Goal (+10 reward)
n_states = 4
n_actions = 2 # 0: Mundur, 1: Maju
Q = np.zeros((n_states, n_actions))

alpha = 0.2
gamma = 0.9
epsilon = 0.3 # 30% peluang memilih aksi acak (Eksplorasi)

# Simulasi 100 episode pelatihan
for episode in range(100):
    s = 0
    while s != 3: # Sampai mencapai goal state
        # Kebijakan Epsilon-Greedy
        if np.random.rand() < epsilon:
            a = np.random.choice(n_actions) # Eksplorasi
        else:
            a = np.argmax(Q[s]) # Eksploitasi
        
        # Transisi lingkungan deterministik
        next_s = min(n_states - 1, s + 1) if a == 1 else max(0, s - 1)
        reward = 10.0 if next_s == 3 else -0.1 # Penalti langkah kecil
        
        # Pembaruan Bellman TD
        best_future_q = np.max(Q[next_s])
        Q[s, a] += alpha * (reward + gamma * best_future_q - Q[s, a])
        s = next_s

print("Tabel Q Konvergen (State x Action):\n", np.round(Q, 2))
print("Kebijakan Optimal di setiap State:", np.argmax(Q, axis=1))
\`\`\`
`
      }
    ]
  }
];
