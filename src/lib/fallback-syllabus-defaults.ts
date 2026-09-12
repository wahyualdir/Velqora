import { ModuleSection } from "@/types/module-drive";

/**
 * Fallback Preset Silabus Materi AI (Kurikulum Standar untuk Kategori AI berbasis ModuleSection)
 * Digunakan sebagai cadangan darurat jika data catatan vault kategori di database belum tersedia.
 */
export function getDefaultAiSections(categoryName: string): ModuleSection[] {
  const norm = categoryName.toLowerCase().trim();

  if (norm.includes("machine learning")) {
    return [
      {
        id: "ml-sec-1",
        title: "Regresi Linear & Prediksi Kontinu",
        orderIndex: 1,
        isCompleted: false,
        description:
          "Dasar Supervised Learning untuk memodelkan hubungan linear antara variabel independen (fitur) dan target kontinu. Menggunakan Ordinary Least Squares (OLS) dan fungsi loss Mean Squared Error (MSE).",
        codeSnippets: [
          {
            id: "ml-snip-1",
            language: "python",
            caption: "linear_regression.py",
            code: `import numpy as np
from sklearn.linear_model import LinearRegression

# Data fitur (jam belajar) vs target (skor ujian)
X = np.array([[1], [2], [3], [4], [5], [6]])
y = np.array([55, 63, 72, 80, 89, 95])

model = LinearRegression()
model.fit(X, y)

prediksi = model.predict([[7]])
print(f"Prediksi skor untuk 7 jam belajar: {prediksi[0]:.2f}")
print(f"Koefisien (Bobot): {model.coef_[0]:.2f}, Intersep: {model.intercept_:.2f}")`,
          },
        ],
      },
      {
        id: "ml-sec-2",
        title: "K-Means Clustering & Pengelompokan Data",
        orderIndex: 2,
        isCompleted: false,
        description:
          "Algoritma Unsupervised Learning untuk mempartisi n observasi ke dalam k klaster berdasarkan jarak centroid terdekat (Euclidean Distance). Cocok untuk segmentasi data dan customer profiling.",
        codeSnippets: [
          {
            id: "ml-snip-2",
            language: "python",
            caption: "kmeans_clustering.py",
            code: `import numpy as np
from sklearn.cluster import KMeans

# Titik data 2 dimensi tanpa label
X = np.array([
    [1.0, 2.0], [1.5, 1.8], [1.2, 2.2],
    [8.0, 8.0], [8.5, 8.2], [9.0, 7.8]
])

kmeans = KMeans(n_clusters=2, random_state=42, n_init="auto")
kmeans.fit(X)

print("Label Klaster Tiap Data:", kmeans.labels_)
print("Titik Koordinat Centroid:\\n", kmeans.cluster_centers_)`,
          },
        ],
      },
      {
        id: "ml-sec-3",
        title: "Decision Tree & Random Forest Classifier",
        orderIndex: 3,
        isCompleted: false,
        description:
          "Model pembelajaran berbasis pohon keputusan dengan kriteria splitting Gini Impurity atau Information Gain (Entropy). Ensemble Random Forest menggabungkan banyak pohon untuk mencegah overfitting.",
        codeSnippets: [
          {
            id: "ml-snip-3",
            language: "python",
            caption: "decision_tree.py",
            code: `from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# Fitur: [Umur, Pendapatan_K], Label: [0: Tidak Beli, 1: Beli]
X_train = [[22, 25], [28, 45], [45, 85], [52, 90], [35, 60]]
y_train = [0, 0, 1, 1, 1]

clf = DecisionTreeClassifier(max_depth=3, random_state=42)
clf.fit(X_train, y_train)

uji = [[30, 50], [50, 75]]
print("Hasil Klasifikasi Data Uji:", clf.predict(uji))`,
          },
        ],
      },
    ];
  }

  if (norm.includes("deep learning")) {
    return [
      {
        id: "dl-sec-1",
        title: "Multilayer Perceptron (MLP) & Backpropagation",
        orderIndex: 1,
        isCompleted: false,
        description:
          "Arsitektur Feedforward Neural Network dengan lapisan tersembunyi (dense layers), fungsi aktivasi non-linear (ReLU, Sigmoid), serta optimasi bobot menggunakan algoritma Gradient Descent.",
        codeSnippets: [
          {
            id: "dl-snip-1",
            language: "python",
            caption: "mlp_pytorch.py",
            code: `import torch
import torch.nn as nn

class FeedForwardNN(nn.Module):
    def __init__(self, in_features, hidden_dim, num_classes):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dim, num_classes)
        )

    def forward(self, x):
        return self.network(x)

model = FeedForwardNN(in_features=16, hidden_dim=64, num_classes=2)
dummy_input = torch.randn(4, 16)
print("Output logits shape:", model(dummy_input).shape)`,
          },
        ],
      },
      {
        id: "dl-sec-2",
        title: "Convolutional Neural Network (CNN) untuk Visi Komputer",
        orderIndex: 2,
        isCompleted: false,
        description:
          "Jaringan saraf konvolusional yang menggunakan kernel filter spasial untuk mengekstraksi fitur visual seperti tepi, tekstur, dan bentuk hierarkis dari tensor gambar.",
        codeSnippets: [
          {
            id: "dl-snip-2",
            language: "python",
            caption: "cnn_block.py",
            code: `import torch
import torch.nn as nn

conv_block = nn.Sequential(
    nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1),
    nn.BatchNorm2d(32),
    nn.ReLU(),
    nn.MaxPool2d(kernel_size=2, stride=2)
)

img_batch = torch.randn(2, 3, 64, 64)
output_map = conv_block(img_batch)
print("Ukuran Feature Map setelah konvolusi:", output_map.shape)`,
          },
        ],
      },
    ];
  }

  if (norm.includes("natural language") || norm.includes("nlp")) {
    return [
      {
        id: "nlp-sec-1",
        title: "Tokenisasi & Word Embeddings (Word2Vec / BERT)",
        orderIndex: 1,
        isCompleted: false,
        description:
          "Representasi teks mentah ke dalam token diskrit dan vektor berdimensi padat yang merepresentasikan hubungan semantik antar kata dalam ruang geometris.",
        codeSnippets: [
          {
            id: "nlp-snip-1",
            language: "python",
            caption: "tokenization_example.py",
            code: `import re

def simple_tokenize(text):
    text = text.lower()
    tokens = re.findall(r'\\b[\\w-]+\\b', text)
    return tokens

kalimat = "Velqora menyediakan kurikulum Kecerdasan Buatan terstruktur!"
tokens = simple_tokenize(kalimat)
print("Token yang dihasilkan:", tokens)
print("Jumlah vocabulary unik:", len(set(tokens)))`,
          },
        ],
      },
      {
        id: "nlp-sec-2",
        title: "Analisis Sentimen & Klasifikasi Teks",
        orderIndex: 2,
        isCompleted: false,
        description:
          "Pembangunan pipeline inferensi NLP untuk mendeteksi polaritas emosi (positif, netral, negatif) pada opini teks menggunakan model Transformer.",
        codeSnippets: [
          {
            id: "nlp-snip-2",
            language: "python",
            caption: "sentiment_pipeline.py",
            code: `# Contoh pipeline representasi menggunakan scikit-learn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

korpus = [
    "Model AI ini sangat akurat dan cepat",
    "Hasil inferensi lambat dan sering salah",
    "Dokumentasi lengkap dan mudah dipahami",
    "Sangat buruk dan tidak dapat digunakan"
]
labels = [1, 0, 1, 0] # 1: Positif, 0: Negatif

vec = TfidfVectorizer()
X = vec.fit_transform(korpus)
clf = MultinomialNB().fit(X, labels)

tes = vec.transform(["Platform belajar ini sangat membantu dan cepat"])
print("Prediksi sentimen:", "Positif" if clf.predict(tes)[0] == 1 else "Negatif")`,
          },
        ],
      },
    ];
  }

  if (norm.includes("computer vision")) {
    return [
      {
        id: "cv-sec-1",
        title: "Operasi Spasial & Transformasi Citra Digital",
        orderIndex: 1,
        isCompleted: false,
        description:
          "Manipulasi array matriks piksel: konversi color space (RGB ke Grayscale), deteksi tepi Sobel/Canny, serta augmentasi citra untuk training model visi.",
        codeSnippets: [
          {
            id: "cv-snip-1",
            language: "python",
            caption: "image_processing.py",
            code: `import numpy as np

# Simulasi gambar grayscale 4x4 piksel
dummy_img = np.array([
    [10, 15, 20, 25],
    [30, 40, 50, 60],
    [70, 80, 90, 100],
    [110, 120, 130, 140]
], dtype=np.uint8)

# Normalisasi intensitas piksel ke skala [0.0, 1.0]
normalized = dummy_img / 255.0
print("Piksel ternormalisasi:\\n", np.round(normalized, 3))`,
          },
        ],
      },
      {
        id: "cv-sec-2",
        title: "Object Detection & Bounding Box Prediction",
        orderIndex: 2,
        isCompleted: false,
        description:
          "Metode lokalisasi objek dalam gambar dengan memprediksi koordinat bounding box (x, y, w, h) dan probabilitas kelas menggunakan algoritma Single Shot Detection / YOLO.",
        codeSnippets: [
          {
            id: "cv-snip-2",
            language: "python",
            caption: "iou_metric.py",
            code: `def hitung_iou(boxA, boxB):
    # Format: [x1, y1, x2, y2]
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    inter_area = max(0, xB - xA) * max(0, yB - yA)
    boxA_area = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxB_area = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

    iou = inter_area / float(boxA_area + boxB_area - inter_area)
    return iou

b1 = [50, 50, 150, 150]
b2 = [60, 60, 160, 160]
print("Intersection over Union (IoU):", round(hitung_iou(b1, b2), 4))`,
          },
        ],
      },
    ];
  }

  // Reinforcement Learning
  if (norm.includes("reinforcement")) {
    return [
      {
        id: "rl-sec-1",
        title: "Konsep Dasar: Reward, State, Action, Policy (MDP)",
        orderIndex: 1,
        isCompleted: false,
        description:
          "Kerangka matematis Markov Decision Process (MDP) yang memodelkan interaksi Agen dengan Lingkungan melalui State (S), Action (A), Reward (R), Transition Probability (P), dan Discount Factor (gamma).",
        codeSnippets: [
          {
            id: "rl-snip-1",
            language: "python",
            caption: "mdp_environment.py",
            code: `class EnvironmentGrid:
    def __init__(self):
        self.states = [0, 1, 2, 3]  # Posisi 1D
        self.goal = 3
    def step(self, state, action):
        next_state = min(self.goal, max(0, state + action))
        reward = 10 if next_state == self.goal else -1
        return next_state, reward

env = EnvironmentGrid()
s1, r1 = env.step(state=1, action=1)
print(f"State baru: {s1}, Reward: {r1}")`,
          },
        ],
      },
      {
        id: "rl-sec-2",
        title: "Q-Learning — Tabel Q & Update Rule",
        orderIndex: 2,
        isCompleted: false,
        description:
          "Metode Model-Free Reinforcement Learning berbasis Bellman Equation untuk memperbarui nilai Q(s, a) melalui Temporal Difference update.",
        codeSnippets: [
          {
            id: "rl-snip-2",
            language: "python",
            caption: "q_learning.py",
            code: `import numpy as np

# Inisialisasi Q-Table: 4 state, 2 aksi (0: Kiri, 1: Kanan)
Q = np.zeros((4, 2))
lr, gamma = 0.1, 0.95
state, action, reward, next_state = 1, 1, 0.0, 2
best_next = np.max(Q[next_state])
Q[state, action] += lr * (reward + gamma * best_next - Q[state, action])
print("Q-Table setelah update:\\n", Q)`,
          },
        ],
      },
      {
        id: "rl-sec-3",
        title: "Policy Gradient & Proximal Policy Optimization (PPO)",
        orderIndex: 3,
        isCompleted: false,
        description:
          "Optimasi kebijakan stokastik secara langsung menggunakan gradient ascent dengan clipped surrogate objective untuk mencegah perubahan kebijakan yang destruktif.",
        codeSnippets: [
          {
            id: "rl-snip-3",
            language: "python",
            caption: "ppo_clip.py",
            code: `import numpy as np

def ppo_clip_loss(ratio, adv, epsilon=0.2):
    surr1 = ratio * adv
    surr2 = np.clip(ratio, 1.0 - epsilon, 1.0 + epsilon) * adv
    return -np.minimum(surr1, surr2).mean()

ratios = np.array([0.9, 1.1, 1.3])
advantages = np.array([0.5, 0.2, -0.4])
print("PPO Clipped Loss:", round(ppo_clip_loss(ratios, advantages), 4))`,
          },
        ],
      },
    ];
  }

  // Speech & Audio AI
  if (norm.includes("speech") || norm.includes("audio")) {
    return [
      {
        id: "speech-sec-1",
        title: "Speech Recognition Dasar — Audio ke Teks (MFCC)",
        orderIndex: 1,
        isCompleted: false,
        description:
          "Ekstraksi representasi fitur frekuensi suara Mel-Frequency Cepstral Coefficients (MFCC) dari sinyal audio kontinu untuk pemodelan akustik.",
        codeSnippets: [
          {
            id: "speech-snip-1",
            language: "python",
            caption: "audio_signal.py",
            code: `import numpy as np

sr = 16000
t = np.linspace(0, 1, sr, endpoint=False)
signal = 0.5 * np.sin(2 * np.pi * 440 * t)  # Nada 440 Hz
print(f"Bentuk Sinyal Audio: {signal.shape}, Durasi: {len(signal)/sr} detik")`,
          },
        ],
      },
      {
        id: "speech-sec-2",
        title: "Text-to-Speech (TTS) — Sintesis Suara",
        orderIndex: 2,
        isCompleted: false,
        description:
          "Konversi teks tulisan menjadi gelombang suara manusia melalui pipeline Acoustic Model dan Neural Vocoder.",
        codeSnippets: [
          {
            id: "speech-snip-2",
            language: "python",
            caption: "tts_concept.py",
            code: `def text_to_phonemes(text):
    mapping = {"halo": "H-AH-L-OW", "ai": "EY-AY"}
    return [mapping.get(w.lower(), w) for w in text.split()]

print("Sintesis Fonem:", text_to_phonemes("Halo AI"))`,
          },
        ],
      },
      {
        id: "speech-sec-3",
        title: "Audio Classification — Deteksi Suara & Emosi",
        orderIndex: 3,
        isCompleted: false,
        description:
          "Klasifikasi jenis audio dan ekspresi emosi berdasarkan spectrogram visual yang diproses menggunakan Convolutional Neural Network.",
        codeSnippets: [
          {
            id: "speech-snip-3",
            language: "python",
            caption: "audio_classification.py",
            code: `classes = ["suara_manusia", "musik", "noise_lingkungan"]
dummy_probs = [0.88, 0.08, 0.04]
predicted = classes[dummy_probs.index(max(dummy_probs))]
print(f"Klasifikasi Audio: {predicted} (Confidence: {max(dummy_probs)*100:.1f}%)")`,
          },
        ],
      },
    ];
  }

  // Recommendation System
  if (norm.includes("recommendation") || norm.includes("rekomendasi")) {
    return [
      {
        id: "rec-sec-1",
        title: "Collaborative Filtering — User-Based & Item-Based",
        orderIndex: 1,
        isCompleted: false,
        description:
          "Penyaringan kolaboratif untuk memprediksi ketertarikan item berdasarkan matriks kesamaan perilaku pengguna atau karakteristik konsumsi item.",
        codeSnippets: [
          {
            id: "rec-snip-1",
            language: "python",
            caption: "collaborative_filtering.py",
            code: `import numpy as np

# Matrix Rating: 3 User x 3 Item
R = np.array([[5, 3, 0], [4, 0, 0], [1, 1, 5]])
u0, u1 = R[0, :2], R[1, :2]
sim = np.dot(u0, u1) / (np.linalg.norm(u0) * np.linalg.norm(u1))
print(f"Cosine Similarity User 0 & User 1: {sim:.4f}")`,
          },
        ],
      },
      {
        id: "rec-sec-2",
        title: "Content-Based Filtering & Cosine Similarity",
        orderIndex: 2,
        isCompleted: false,
        description:
          "Rekomendasi item berdasarkan kedekatan vektor atribut deskriptif item terhadap profil kesukaan historis pengguna.",
        codeSnippets: [
          {
            id: "rec-snip-2",
            language: "python",
            caption: "content_based.py",
            code: `from sklearn.metrics.pairwise import cosine_similarity

# Vektor Fitur Item: [Action, SciFi, Drama]
item_features = [[1, 1, 0], [1, 0, 0], [0, 0, 1]]
user_profile = [[1, 0.8, 0]]
skor = cosine_similarity(user_profile, item_features)
print("Skor Kesesuaian Item:", skor[0])`,
          },
        ],
      },
      {
        id: "rec-sec-3",
        title: "Hybrid Recommendation System",
        orderIndex: 3,
        isCompleted: false,
        description:
          "Penggabungan strategi Collaborative Filtering dan Content-Based Filtering untuk mengatasi Cold-Start Problem pada pengguna dan item baru.",
        codeSnippets: [
          {
            id: "rec-snip-3",
            language: "python",
            caption: "hybrid_recsys.py",
            code: `def hybrid_score(collab_score, content_score, alpha=0.6):
    return alpha * collab_score + (1 - alpha) * content_score

print("Skor Rekomendasi Hybrid:", round(hybrid_score(0.85, 0.70), 4))`,
          },
        ],
      },
    ];
  }

  // Expert System
  if (norm.includes("expert system") || norm.includes("sistem pakar")) {
    return [
      {
        id: "exp-sec-1",
        title: "Expert System & Inference Engine (Symbolic AI)",
        orderIndex: 1,
        isCompleted: false,
        description:
          "Sistem kecerdasan berbasis aturan eksplisit yang memisahkan basis pengetahuan pakar (Knowledge Base) dengan mesin penalaran (Inference Engine).",
        codeSnippets: [
          {
            id: "exp-snip-1",
            language: "python",
            caption: "inference_engine.py",
            code: `facts = {"demam": True, "batuk": True}

def diagnosa(f):
    if f.get("demam") and f.get("batuk"):
        return "Kemungkinan: Infeksi Saluran Pernapasan / Flu"
    return "Kondisi stabil"

print("Hasil Inferensi Pakar:", diagnosa(facts))`,
          },
        ],
      },
      {
        id: "exp-sec-2",
        title: "Rule-Based Reasoning — Forward vs Backward Chaining",
        orderIndex: 2,
        isCompleted: false,
        description:
          "Metode penalaran berbasis data fakta menuju hipotesis akhir (Forward Chaining) atau pembuktian dari target kesimpulan mundur mencari premis pendukung (Backward Chaining).",
        codeSnippets: [
          {
            id: "exp-snip-2",
            language: "python",
            caption: "forward_chaining.py",
            code: `rules = [
    (["gejala_A", "gejala_B"], "kondisi_X"),
    (["kondisi_X"], "rekomendasi_istirahat")
]
fakta = set(["gejala_A", "gejala_B"])
for syarat, akibat in rules:
    if all(s in fakta for s in syarat):
        fakta.add(akibat)
print("Fakta yang berhasil disimpulkan:", fakta)`,
          },
        ],
      },
      {
        id: "exp-sec-3",
        title: "Constraint Satisfaction Problem (CSP)",
        orderIndex: 3,
        isCompleted: false,
        description:
          "Formulasi pemecahan masalah dengan mendefinisikan himpunan variabel, domain nilai, dan aturan batasan yang harus dipenuhi secara simultan.",
        codeSnippets: [
          {
            id: "exp-snip-3",
            language: "python",
            caption: "csp_solver.py",
            code: `# Pewarnaan graf sederhana (wilayah berdampingan tidak boleh sewarna)
domain = ["merah", "biru"]
solusi = [(w1, w2) for w1 in domain for w2 in domain if w1 != w2]
print("Konfigurasi CSP Valid:", solusi)`,
          },
        ],
      },
    ];
  }

  // Knowledge Representation
  if (norm.includes("knowledge") || norm.includes("pengetahuan")) {
    return [
      {
        id: "kr-sec-1",
        title: "Knowledge Graph — Node, Edge & RDF Triples",
        orderIndex: 1,
        isCompleted: false,
        description:
          "Representasi terstruktur hubungan semantik dunia nyata dalam bentuk graf berarah dengan format pernyataan triple (Subjek, Predikat, Objek).",
        codeSnippets: [
          {
            id: "kr-snip-1",
            language: "python",
            caption: "rdf_triples.py",
            code: `triples = [
    ("Alan_Turing", "profesi", "Ilmuwan_Komputer"),
    ("Alan_Turing", "merancang", "Turing_Machine")
]
for s, p, o in triples:
    print(f"[{s}] ---({p})---> [{o}]")`,
          },
        ],
      },
      {
        id: "kr-sec-2",
        title: "Logika Proposisional & Predikat Representasi Pengetahuan",
        orderIndex: 2,
        isCompleted: false,
        description:
          "Formalisasi pernyataan deduktif berbasis logika simbolik dan kalkulus predikat orde pertama untuk penalaran mesin tanpa ambiguitas.",
        codeSnippets: [
          {
            id: "kr-snip-2",
            language: "python",
            caption: "predicate_logic.py",
            code: `def implikasi(p, q):
    return (not p) or q

# P: Hujan, Q: Jalan Basah
print("Implikasi P => Q (P=True, Q=False):", implikasi(True, False))`,
          },
        ],
      },
      {
        id: "kr-sec-3",
        title: "Ontologi & Semantic Web (OWL / RDF)",
        orderIndex: 3,
        isCompleted: false,
        description:
          "Spesifikasi eksplisit konseptualisasi domain pengetahuan menggunakan Web Ontology Language (OWL) dan Resource Description Framework (RDF).",
        codeSnippets: [
          {
            id: "kr-snip-3",
            language: "python",
            caption: "ontology_concept.py",
            code: `class Entitas:
    pass
class Peneliti(Entitas):
    def __init__(self, nama):
        self.nama = nama

peneliti = Peneliti("Geoffrey Hinton")
print(f"Kelas Ontologi: {type(peneliti).__name__}, Nama: {peneliti.nama}")`,
          },
        ],
      },
    ];
  }

  // Multimodal AI
  if (norm.includes("multimodal")) {
    return [
      {
        id: "multi-sec-1",
        title: "Multimodal AI & Arsitektur CLIP (Teks-Gambar)",
        orderIndex: 1,
        isCompleted: false,
        description:
          "Integrasi modalitas visual dan tekstual ke dalam ruang embedding bersama menggunakan pembelajaran kontrasif (Contrastive Language-Image Pretraining).",
        codeSnippets: [
          {
            id: "multi-snip-1",
            language: "python",
            caption: "clip_embedding.py",
            code: `import numpy as np

# Simulasi representasi embedding bersama berdimensi 4
img_emb = np.array([0.5, 0.8, -0.2, 0.1])
txt_emb = np.array([0.48, 0.82, -0.18, 0.12])
sim = np.dot(img_emb, txt_emb) / (np.linalg.norm(img_emb) * np.linalg.norm(txt_emb))
print(f"Cosine Similarity CLIP Gambar vs Teks: {sim:.4f}")`,
          },
        ],
      },
      {
        id: "multi-sec-2",
        title: "Image Captioning — Pengenalan Gambar ke Narasi Teks",
        orderIndex: 2,
        isCompleted: false,
        description:
          "Arsitektur encoder-decoder multimodal yang mengekstrak fitur visual citra dan membangkitkan kalimat deskriptif natural secara autoregresif.",
        codeSnippets: [
          {
            id: "multi-snip-2",
            language: "python",
            caption: "captioning_concept.py",
            code: `vocab = {0: "<start>", 1: "seekor", 2: "kucing", 3: "tidur", 4: "<end>"}
tokens = [0, 1, 2, 3, 4]
caption = " ".join([vocab[t] for t in tokens if t not in (0, 4)])
print("Narasi Caption Gambar:", caption)`,
          },
        ],
      },
    ];
  }

  // Default AI Fundamentals Fallback
  return [
    {
      id: "fund-sec-1",
      title: "Prinsip Dasar Kecerdasan Buatan & Agen Cerdas",
      orderIndex: 1,
      isCompleted: false,
      description:
        "Memahami paradigma AI: Rational Agents, lingkungan PEAS (Performance measure, Environment, Actuators, Sensors), serta perbedaan Machine Learning vs Deep Learning.",
      codeSnippets: [
        {
          id: "fund-snip-1",
          language: "python",
          caption: "reflex_agent.py",
          code: `class SimpleReflexAgent:
    def __init__(self):
        self.rules = {
            "kotor": "membersihkan",
            "bersih": "berpindah_ruangan"
        }

    def act(self, percept):
        return self.rules.get(percept, "diam")

agent = SimpleReflexAgent()
print("Aksi saat ruangan kotor:", agent.act("kotor"))
print("Aksi saat ruangan bersih:", agent.act("bersih"))`,
        },
      ],
    },
    {
      id: "fund-sec-2",
      title: "Evaluasi Model & Metrik Performa AI",
      orderIndex: 2,
      isCompleted: false,
      description:
        "Pengukuran kualitas prediksi model klasifikasi menggunakan Confusion Matrix, Precision, Recall, F1-Score, serta Trade-off Bias vs Variance.",
      codeSnippets: [
        {
          id: "fund-snip-2",
          language: "python",
          caption: "metrics_calculator.py",
          code: `def evaluasi_model(tp, fp, fn, tn):
    accuracy = (tp + tn) / (tp + fp + fn + tn)
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    return {"accuracy": accuracy, "precision": precision, "recall": recall, "f1": f1}

hasil = evaluasi_model(tp=85, fp=15, fn=10, tn=90)
for k, v in hasil.items():
    print(f"{k.capitalize()}: {v:.4f}")`,
        },
      ],
    },
  ];
}
