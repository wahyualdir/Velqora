# -*- coding: utf-8 -*-
"""
Generator untuk Bab 6: Klasifikasi Teks & Analisis Sentimen (Text Classification) (10 Subbab)
Topik: Natural Language Processing (22-natural-language-processing.ts)
"""

import os
import sys
import json
import io
import contextlib
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

def run_code_capture_output(code_str: str) -> str:
    f = io.StringIO()
    with contextlib.redirect_stdout(f):
        scope = {}
        exec(code_str, scope)
    return f.getvalue()

subchapters = []

# ==============================================================================
# Subbab 6.1: Formulasi Masalah Klasifikasi Teks
# ==============================================================================
code_6_1 = r'''import numpy as np

# Formulasi Matematis Klasifikasi Teks: Fungsi Pemetaan f: X -> Y
# Softmax Cross-Entropy Loss: L = - \sum_{k=1}^K y_k \log \hat{y}_k
# Di mana \hat{y}_k = \frac{\exp(z_k)}{\sum_{j=1}^K \exp(z_j)}

# Simulasi logit keluaran untuk dokumen teks ulasan 3 kelas: [Negatif, Netral, Positif]
logits = np.array([1.2, 0.5, 3.8])  # Logit model
y_true = np.array([0, 0, 1])        # Label one-hot sejati: Positif (kelas 2)

def softmax(z):
    exp_z = np.exp(z - np.max(z)) # Stabilisasi numerik
    return exp_z / np.sum(exp_z)

def cross_entropy_loss(y_true, y_pred):
    return -np.sum(y_true * np.log(np.maximum(y_pred, 1e-15)))

y_probs = softmax(logits)
loss = cross_entropy_loss(y_true, y_probs)
pred_class = np.argmax(y_probs)

classes = ["Negatif", "Netral", "Positif"]
print("Formulasi Inferensi & Loss Klasifikasi Teks:")
print("-" * 65)
print(f"Logit Mentah (z)         : {logits}")
print(f"Distribusi Probabilitas : {y_probs}")
for cls_name, p in zip(classes, y_probs):
    print(f"  - P({cls_name:<7}) = {p * 100:.2f}%")
print("-" * 65)
print(f"Kelas Prediksi           : '{classes[pred_class]}' (Confidence: {y_probs[pred_class]*100:.2f}%)")
print(f"Cross-Entropy Loss       : {loss:.4f}")
'''

subchapters.append({
    "id": "nlp-6-1-text-classification-formulation",
    "chapterId": "natural-language-processing-ch-6",
    "title": "Formulasi Masalah Klasifikasi Teks: Taksonomi Masalah, Ruang Hipotesis, dan Loss Cross-Entropy",
    "description": "Kerangka kerja formal klasifikasi teks: perbedaan biner, multikelas, dan multilabel, pemetaan ruang teks ke ruang label diskret, serta perumusan fungsi objektif.",
    "estimatedMinutes": 35,
    "order": 1,
    "content": {
        "theory": (
            "Secara formal, **Klasifikasi Teks (*Text Classification*)** adalah tugas menugaskan satu atau lebih label kategori diskret $y \\in \\mathcal{Y}$ terhadap sebuah dokumen teks terstruktur maupun tidak terstruktur $x \\in \\mathcal{X}$.\n\n"
            "Berdasarkan kardinalitas dan struktur ruang label $\\mathcal{Y}$, klasifikasi teks terbagi menjadi tiga paradigma mendasar:\n"
            "1. **Klasifikasi Biner (*Binary Classification*)**: Ruang label hanya memiliki dua kemungkinan mutlak $|\\mathcal{Y}| = 2$, misal $\\mathcal{Y} = \\{0, 1\\}$ pada deteksi spam (Spam vs Ham) atau analisis polaritas sentimen (Positif vs Negatif).\n"
            "2. **Klasifikasi Multikelas Eksklusif (*Multi-class Classification*)**: Dokumen ditugaskan ke tepat satu kategori dari $K$ kelas yang saling eksklusif $|\\mathcal{Y}| = K > 2$, misal klasifikasi rubrik berita $\\mathcal{Y} = \\{\\text{Politik}, \\text{Ekonomi}, \\text{Olahraga}, \\text{Teknologi}\\}$. Fungsi pemetaan menggunakan aktivasi **Softmax**:\n"
            "   $$P(y = k \\mid \\mathbf{x}) = \\frac{\\exp(\\mathbf{w}_k^T \\mathbf{x} + b_k)}{\\sum_{j=1}^K \\exp(\\mathbf{w}_j^T \\mathbf{x} + b_j)}$$\n"
            "3. **Klasifikasi Multilabel (*Multi-label Classification*)**: Satu dokumen dapat memiliki nol, satu, atau beberapa label sekaligus $\\mathbf{y} \\in \\{0, 1\\}^K$, misal artikel jurnal ilmiah yang dapat masuk ke topik *'Kecerdasan Buatan'*, *'Bioinformatika'*, dan *'Statistika'* secara bersamaan. Di sini fungsi aktivasi menggunakan **Sigmoid** independen per-kelas.\n\n"
            "Fungsi kerugian standar untuk mengoptimalkan parameter model klasifikasi adalah **Categorical Cross-Entropy Loss**:\n"
            "$$\\mathcal{L}(\\boldsymbol{\\theta}) = -\\frac{1}{N} \\sum_{i=1}^N \\sum_{k=1}^K y_{i, k} \\log \\hat{y}_{i, k}$$\n"
            "di mana $y_{i, k} \\in \\{0, 1\\}$ adalah indikator kebenaran dasar (*ground truth*) dan $\\hat{y}_{i, k} = P(y = k \\mid \\mathbf{x}_i)$ adalah probabilitas prediksi model."
        ),
        "codeSnippet": code_6_1,
        "codeSnippetOutput": run_code_capture_output(code_6_1),
        "realWorldApplication": (
            "Sistem perutean tiket keluhan pelanggan otomatis (CS ticket routing), penyaringan konten berbahaya (*toxic content moderation*), dan kurasi topik agregator berita."
        ),
        "commonPitfalls": [
            r"Menerapkan fungsi aktivasi Softmax pada masalah klasifikasi multilabel (Softmax memaksa total probabilitas bernilai 1.0, menekan kelas sah lainnya; wajib menggunakan Sigmoid biner per-output).",
            r"Mengabaikan ketidakseimbangan kelas (class imbalance) di mana kelas mayoritas 95% mendominasi loss sehingga akurasi tinggi menipu performa riil.",
            r"Lupa melakukan stabilisasi numerik log-sum-exp pada implementasi Softmax sehingga rentan terhadap floating-point overflow."
        ],
        "caseStudy": (
            "Sebuah portal hukum ingin mengkategorikan 500.000 dokumen putusan perdata. Satu berkas perkara dapat memuat perkara 'Wanprestasi', 'Sengketa Tanah', dan 'Ganti Rugi' sekaligus. Mengapa formulasi klasifikasi multikelas biasa akan gagal dan bagaimana perancangan arsitektur multilabel biner menyelesaikan masalah ini?"
        ),
        "academicReferences": [
            r"Manning, C. D., Raghavan, P., & Schütze, H. (2008). Introduction to Information Retrieval. Chapter 13: Text classification and Naive Bayes. Cambridge University Press.",
            r"Sebastiani, F. (2002). Machine learning in automated text categorization. ACM Computing Surveys (CSUR), 34(1), 1-47.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Chapter 4: Naive Bayes and Sentiment Classification. Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 6.2: Klasifikasi Naive Bayes untuk Teks
# ==============================================================================
code_6_2 = r'''from collections import Counter
import numpy as np

# Implementasi Multinomial Naive Bayes untuk Klasifikasi Teks Berbasis NumPy
# P(c | d) \propto P(c) \prod_{w \in d} P(w | c)
# P(w | c) = \frac{count(w, c) + \alpha}{\sum_{w'} count(w', c) + \alpha |V|}

train_data = [
    ("diskon promo pulsa gratis belanja murah", "SPAM"),
    ("klaim hadiah uang tunai tanpa diundi", "SPAM"),
    ("jadwal rapat koordinasi proyek kecerdasan buatan", "HAM"),
    ("laporan keuangan kuartal ketiga telah selesai", "HAM")
]

# Bangun kosakata
vocab = sorted(list(set(" ".join([d[0] for d in train_data]).split())))
V = len(vocab)
classes = ["SPAM", "HAM"]

# Hitung Prior P(c) dan Likelihood P(w|c)
doc_counts = Counter([d[1] for d in train_data])
total_docs = len(train_data)
priors = {c: doc_counts[c] / total_docs for c in classes}

word_counts = {c: Counter() for c in classes}
total_words_in_class = {c: 0 for c in classes}

for text, label in train_data:
    words = text.split()
    word_counts[label].update(words)
    total_words_in_class[label] += len(words)

alpha = 1.0 # Laplace Add-1 smoothing

def predict_nb(text):
    words = text.split()
    log_posteriors = {}
    for c in classes:
        log_prob = np.log(priors[c])
        denom = total_words_in_class[c] + alpha * V
        for w in words:
            nom = word_counts[c][w] + alpha
            log_prob += np.log(nom / denom)
        log_posteriors[c] = log_prob
    return log_posteriors

test_doc = "rapat laporan proyek selesai"
log_scores = predict_nb(test_doc)

print("Inferensi Multinomial Naive Bayes:")
print("-" * 65)
print(f"Dokumen Uji: '{test_doc}'\n")
for c in classes:
    print(f"Log-Posterior P({c:<4} | Dokumen) = {log_scores[c]:.4f}")
pred_label = max(log_scores, key=log_scores.get)
print("-" * 65)
print(f"Keputusan Klasifikasi: '{pred_label}'")
'''

subchapters.append({
    "id": "nlp-6-2-naive-bayes-text-variants",
    "chapterId": "natural-language-processing-ch-6",
    "title": "Klasifikasi Naive Bayes untuk Teks: Multinomial, Bernoulli, dan Complement Naive Bayes",
    "description": "Pemodelan probabilistik generatif: teorema Bayes, asumsi independensi bersyarat atribut leksikal, formulasi Multinomial vs Bernoulli, dan varian Complement.",
    "estimatedMinutes": 35,
    "order": 2,
    "content": {
        "theory": (
            "Pengklasifikasi **Naive Bayes** adalah salah satu algoritma paling legendaris dan tahan banting dalam sejarah pemrosesan bahasa alami. Algoritma ini didasarkan pada penerapan **Teorema Bayes** yang dikombinasikan dengan asumsi penyederhanaan yang sangat berani (*naive*): bahwa kemunculan setiap fitur kata sepenuhnya independen satu sama lain dengan syarat kelas dokumen diketahui.\n\n"
            "Diberikan sebuah dokumen $d = (w_1, w_2, \\dots, w_n)$, probabilitas posterior kelas $c$ dirumuskan sebagai:\n"
            "$$P(c \\mid d) = \\frac{P(c) P(d \\mid c)}{P(d)} \\propto P(c) \\prod_{i=1}^n P(w_i \\mid c)$$\n"
            "$$\\hat{c} = \\arg\\max_{c \\in \\mathcal{C}} \\left[ \\log P(c) + \\sum_{i=1}^n \\log P(w_i \\mid c) \\right]$$\n\n"
            "**Tiga Varian Naive Bayes Utama dalam NLP**:\n"
            "1. **Multinomial Naive Bayes (MNB)**: Memodelkan frekuensi kemunculan kata (*integer word counts*). Parameter kemungkinan (*likelihood*) dihitung menggunakan estimasi frekuensi relatif dengan penghalusan Laplace:\n"
            "   $$P(w \\mid c) = \\frac{C(w, c) + \\alpha}{\\sum_{w' \\in \\mathcal{V}} C(w', c) + \\alpha |\\mathcal{V}|}$$\n"
            "   Menjadi standar utama untuk klasifikasi teks panjang karena memperhitungkan bobot frekuensi pengulangan kata.\n"
            "2. **Bernoulli Naive Bayes (BNB)**: Memodelkan kehadiran biner kata (ada vs tidak ada, $x_i \\in \\{0, 1\\}$). Sangat efektif untuk dokumen pendek seperti cuitan media sosial atau analisis sentimen biner.\n"
            "3. **Complement Naive Bayes (CNB - Rennie et al., 2003)**: Mengestimasi parameter kata berdasarkan dokumen di *luar* kelas target $c$ (komplemen kelas). Dirancang khusus untuk menstabilkan performa klasifikasi pada korpus yang mengalami ketidakseimbangan kelas ekstrem (*imbalanced dataset*)."
        ),
        "codeSnippet": code_6_2,
        "codeSnippetOutput": run_code_capture_output(code_6_2),
        "realWorldApplication": (
            "Mesin deteksi email spam (SpamAssassin), filter konten kata terlarang otomatis, dan baseline klasifikasi teks cepat berdaya komputasi minimal pada CPU."
        ),
        "commonPitfalls": [
            r"Mengalikan probabilitas mentah tanpa transformasi logaritma yang menyebabkan floating-point underflow ke nol mutlak pada dokumen panjang.",
            r"Lupa menerapkan Laplace smoothing (alpha = 1.0) sehingga kata baru langsung membatalkan probabilitas posterior kelas menjadi nol.",
            r"Mengasumsikan fitur kata saling bebas di dunia nyata (padahal kata 'New' dan 'York' sangat berkorelasi kuat; namun secara empiris Naive Bayes tetap menghasilkan batas keputusan optimal)."
        ],
        "caseStudy": (
            "Bandingkan bagaimana Multinomial Naive Bayes vs Bernoulli Naive Bayes mengevaluasi dokumen yang mengulang kata 'diskon' sebanyak 10 kali. Jelaskan mengapa Bernoulli mengabaikan repetisi tersebut dan kapan sifat tersebut menguntungkan atau merugikan klasifikasi."
        ),
        "academicReferences": [
            r"McCallum, A., & Nigam, K. (1998). A comparison of event models for naive bayes text classification. In AAAI-98 workshop on learning for text categorization (Vol. 752, pp. 41-48).",
            r"Rennie, J. D., Shih, L., Teevan, J., & Karger, D. R. (2003). Tackling the poor assumptions of naive bayes text classifiers. In ICML (Vol. 3, pp. 616-623).",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Chapter 4. Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 6.3: Maximum Entropy (MaxEnt) & Regresi Logistik Multikelas
# ==============================================================================
code_6_3 = r'''import numpy as np

# Model Maximum Entropy (MaxEnt) / Multinomial Logistic Regression untuk Teks
# P(c | d) = \frac{\exp(w_c^T x)}{\sum_{c'} \exp(w_{c'}^T x)}
# Mengukur kontribusi bobot leksikal langsung terhadap probabilitas kelas

vocab = ["hadiah", "rapat", "diskon", "proyek", "laporan"]
classes = ["SPAM", "HAM"]
V = len(vocab)
K = len(classes)

# Bobot model terlatih W berdimensi (K x V)
W = np.array([
    [ 2.5, -1.8,  3.0, -2.1, -1.5],  # Bobot kelas SPAM
    [-2.2,  2.1, -2.8,  2.4,  1.9]   # Bobot kelas HAM
])
b = np.array([0.1, -0.1])

# Dokumen uji: "rapat proyek laporan selesai" -> Vektor BoW pada vocab di atas
x_doc = np.array([0, 1, 0, 1, 1])

# Kalkulasi logit: z = W @ x + b
logits = np.dot(W, x_doc) + b
exp_z = np.exp(logits - np.max(logits))
probs = exp_z / np.sum(exp_z)

print("Klasifikasi Maximum Entropy (MaxEnt) / Multinomial Logistic Regression:")
print("-" * 75)
print(f"Dokumen Fitur x : {x_doc} (Fitur: {vocab})")
print(f"Logit SPAM      : {logits[0]:.4f} -> Probabilitas SPAM : {probs[0]*100:.2f}%")
print(f"Logit HAM       : {logits[1]:.4f} -> Probabilitas HAM  : {probs[1]*100:.2f}%")
print("-" * 75)
print("MaxEnt mengalokasikan probabilitas paling seragam yang konsisten dengan batasan data.")
'''

subchapters.append({
    "id": "nlp-6-3-maxent-logistic-regression-text",
    "chapterId": "natural-language-processing-ch-6",
    "title": "Maximum Entropy (MaxEnt) & Regresi Logistik Multikelas: Pemodelan Berbasis Batasan Informasi",
    "description": "Prinsip entropi maksimum E.T. Jaynes: perumusan regresi logistik multikelas (MaxEnt) untuk teks, batasan ekspektasi fitur empiris, dan regularisasi penalti L1/L2.",
    "estimatedMinutes": 35,
    "order": 3,
    "content": {
        "theory": (
            "Berbeda dari Naive Bayes yang merupakan model generatif (memodelkan distribusi gabungan $P(x, y)$), **Model Maximum Entropy (MaxEnt)**—yang dalam statistik dikenal sebagai **Multinomial Logistic Regression**—merupakan model diskriminatif yang memodelkan distribusi bersyarat $P(y \\mid x)$ secara langsung.\n\n"
            "Prinsip filosofis di balik Maximum Entropy (Jaynes, 1957; Berger et al., 1996) berbunyi: *'Ketika mengestimasi distribusi probabilitas dari data yang tidak lengkap, pilihlah distribusi yang memiliki entropi informasi paling maksimal di antara seluruh distribusi yang memenuhi batasan bukti empiris kita.'* Dengan kata lain, model tidak boleh membuat asumsi apriori yang tidak didukung oleh data pelatihan.\n\n"
            "Untuk klasifikasi teks multikelas, probabilitas dokumen $x$ masuk ke kelas $c$ diformulasikan menggunakan fungsi Softmax:\n"
            "$$P(c \\mid x) = \\frac{\\exp\\left( \\sum_{j=1}^M w_{c, j} f_j(x, c) + b_c \\right)}{\\sum_{c' \\in \\mathcal{C}} \\exp\\left( \\sum_{j=1}^M w_{c', j} f_j(x, c') + b_{c'} \\right)}$$\n"
            "di mana $f_j(x, c)$ adalah fungsi fitur (misal keberadaan kata tertentu, fitur kapitalisasi, atau n-gram leksikal).\n\n"
            "**Keunggulan MaxEnt atas Naive Bayes**:\n"
            "MaxEnt **tidak memerlukan asumsi independensi fitur**. Fitur-fitur yang saling tumpang tindih dan berkorelasi tinggi (seperti unigram *\"New\"*, *\"York\"* dan bigram *\"New York\"*) dapat dimasukkan ke dalam model secara bersamaan tanpa menyebabkan estimasi probabilitas bias yang overconfident.\n\n"
            "**Regularisasi $L_1$ dan $L_2$**:\n"
            "Karena teks memiliki dimensi fitur leksikal yang sangat besar, optimasi MaxEnt rentan mengalami overfitting. Fungsi objektif ditambahkan suku penalti regularisasi:\n"
            "$$\\mathcal{J}(\\mathbf{w}) = -\\sum_{i=1}^N \\log P(y_i \\mid x_i) + \\lambda_2 \\|\\mathbf{w}\\|_2^2 + \\lambda_1 \\|\\mathbf{w}\\|_1$$\n"
            "Regularisasi $L_2$ (Ridge) memperkecil magnitudo bobot secara merata, sementara regularisasi $L_1$ (Lasso) mendorong bobot fitur yang tidak penting menjadi tepat nol, menghasilkan seleksi fitur otomatis yang sangat ringkas."
        ),
        "codeSnippet": code_6_3,
        "codeSnippetOutput": run_code_capture_output(code_6_3),
        "realWorldApplication": (
            "Standar de facto klasifikasi sentimen industri, penentuan niat pengguna (*intent classification*) pada asisten virtual, dan deteksi dialek regional bahasa."
        ),
        "commonPitfalls": [
            r"Melatih MaxEnt tanpa penalti regularisasi pada data berdimensi sangat besar yang menyebabkan bobot kata langka meledak menjadi nilai ekstrim (+inf/-inf).",
            r"Mengabaikan kalibrasi koefisien regularisasi lambda (C = 1/lambda) yang dapat menyebabkan model mengalami underfitting atau overfitting parah.",
            r"Menyertakan fitur teks yang 100% redundan tanpa regularisasi yang menyebabkan ketidakstabilan numerik Hessian."
        ],
        "caseStudy": (
            "Sebuah model analisis sentimen Twitter menerima fitur unigram 'tidak', 'senang', dan bigram 'tidak senang'. Jelaskan bagaimana Naive Bayes secara keliru menduplikasi bobot negatif dan positif secara independen, sementara MaxEnt menyesuaikan bobot gabungan secara optimal melalui optimasi gradien."
        ),
        "academicReferences": [
            r"Berger, A. L., Pietra, V. J. D., & Pietra, S. A. D. (1996). A maximum entropy approach to natural language processing. Computational Linguistics, 22(1), 39-71.",
            r"Jaynes, E. T. (1957). Information theory and statistical mechanics. Physical Review, 106(4), 620.",
            r"Hastie, T., Tibshirani, R., & Friedman, J. (2009). The Elements of Statistical Learning. Chapter 4: Linear Methods for Classification. Springer."
        ]
    }
})

# ==============================================================================
# Subbab 6.4: SVM untuk Ruang Fitur Teks Berdimensi Tinggi
# ==============================================================================
code_6_4 = r'''import numpy as np

# Konsep Linear Support Vector Machines (SVM) untuk Klasifikasi Teks (Joachims, 1998)
# Memaksimalkan Margin Separasi Geometris: \min \frac{1}{2} ||w||^2 s.t. y_i (w^T x_i + b) >= 1
# Vektor Teks Alami Bersifat Sparse dan Terpisah Secara Linear di Ruang Dimensi Tinggi

# Simulasi 4 dokumen teks dalam ruang 2D tereduksi
# Label: -1 (Keluhan), +1 (Pujian)
X = np.array([
    [1.0, 2.0],  # Doc 1 (Keluhan)
    [2.0, 3.0],  # Doc 2 (Keluhan)
    [5.0, 6.0],  # Doc 3 (Pujian)
    [6.0, 7.0]   # Doc 4 (Pujian)
])
y = np.array([-1, -1, 1, 1])

# Vektor bobot hyperplane pemisah optimal hasil optimasi Quadratic Programming
w = np.array([0.5, 0.5])
b = -4.0

def decision_function(x):
    return np.dot(x, w) + b

margins = y * np.array([decision_function(x) for x in X])
w_norm = np.linalg.norm(w)
geometric_margin = np.min(margins) / w_norm

print("Linear Support Vector Machines (Linear SVM):")
print("-" * 65)
print(f"Hyperplane Normal w = {w}, bias b = {b}")
print(f"Norma Vektor ||w||   = {w_norm:.4f}")
print(f"Geometric Margin    = 2 / ||w|| = {2.0 / w_norm:.4f}")
print("-" * 65)
for i, x in enumerate(X):
    score = decision_function(x)
    pred = 1 if score >= 0 else -1
    status = "VALID" if pred == y[i] else "MISCLASSIFIED"
    print(f"Dokumen {i+1} x={x} -> Skor Margin: {score:>5.2f} | Pred: {pred:>2} ({status})")
print("-" * 65)
print("Temuan Joachims (1998): Teks memiliki sedikit fitur tak relevan dan")
print("terpisah secara linear di ruang dimensi tinggi, menjadikan Linear SVM tak tertandingi.")
'''

subchapters.append({
    "id": "nlp-6-4-svm-high-dimensional-text",
    "chapterId": "natural-language-processing-ch-6",
    "title": "Support Vector Machines (SVM) untuk Ruang Fitur Teks: Linear Hyperplane dan Maximum Margin",
    "description": "Karya seminal Thorsten Joachims (1998): keunggulan Support Vector Machines pada teks, sifat keterpisahan linier ruang berdimensi tinggi, margin maksimal, dan kernel linier.",
    "estimatedMinutes": 35,
    "order": 4,
    "content": {
        "theory": (
            "Pada tahun 1998, ilmuwan komputer **Thorsten Joachims** mempublikasikan makalah penting berjudul *'Text Categorization with Support Vector Machines: Learning with Many Relevant Features'*. Makalah ini membuktikan secara teoritis dan empiris mengapa **Support Vector Machines (SVM)** berbasis kernel linier menjadi algoritma klasifikasi teks terbaik di era pra-deep learning.\n\n"
            "Joachims mengidentifikasi karakteristik intrinsik data teks yang menjadikannya sangat cocok untuk SVM:\n"
            "1. **Ruang Fitur Berdimensi Sangat Tinggi (*High Dimensional Feature Space*)**: Teks memiliki puluhan ribu fitur kata unik $|\\mathcal{V}| \\ge 50.000$. Teori Vapnik membuktikan bahwa kapasitas generalisasi SVM tidak bergantung pada dimensi ruang fitur, melainkan pada **lebar margin pemisah (*margin of separation*)**.\n"
            "2. **Kelangkaan Vektor Dokumen (*Sparse Document Vectors*)**: Setiap dokumen individu hanya memuat sebagian kecil kata dari seluruh kosakata. SVM secara alami menangani sparsity ini secara efisien.\n"
            "3. **Sebagian Besar Fitur Relevan**: Berbeda dari masalah visi komputer di mana banyak piksel adalah derau latar belakang acak, dalam pemrosesan teks hampir setiap kata membawa sinyal semantik diskriminatif. SVM mampu memanfaatkan seluruh fitur leksikal tanpa mereduksi dimensi secara agresif.\n\n"
            "Secara matematis, Linear SVM mencari hyperplane pemisah optimal $\\mathbf{w}^T \\mathbf{x} + b = 0$ yang memaksimalkan jarak geometris $2 / \\|\\mathbf{w}\\|_2$ terhadap contoh latih terdekat (*Support Vectors*):\n"
            "$$\\min_{\\mathbf{w}, b, \\boldsymbol{\\xi}} \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 + C \\sum_{i=1}^N \\xi_i$$\n"
            "$$\\text{s.t.} \\quad y_i (\\mathbf{w}^T \\mathbf{x}_i + b) \\ge 1 - \\xi_i, \\quad \\xi_i \\ge 0$$\n"
            "di mana $\\xi_i$ adalah variabel slack untuk data yang tidak terpisah secara sempurna, dan $C$ adalah hyperparameter trade-off penalti kesalahan."
        ),
        "codeSnippet": code_6_4,
        "codeSnippetOutput": run_code_capture_output(code_6_4),
        "realWorldApplication": (
            "Klasifikasi dokumen legal berskala besar, deteksi plagiarisme akademik, penyaringan spam industri, dan indexing dokumen paten internasional."
        ),
        "commonPitfalls": [
            r"Menggunakan kernel RBF / Gaussian pada teks berdimensi tinggi yang justru memperlambat pelatihan secara drastis tanpa peningkatan akurasi (kernel linier hampir selalu optimal untuk data teks berdimensi tinggi).",
            r"Lupa menormalkan vektor fitur teks ke panjang L2 sebelum melatih SVM yang membuat dokumen panjang mendominasi margin keputusan.",
            r"Menyetel parameter penalti C terlalu besar yang memicu overfitting ekstrem pada data teks yang bising."
        ],
        "caseStudy": (
            "Sebuah mesin penelusuran hukum memproses berkas pengadilan dengan kosakata 120.000 term unik. Bandingkan performa waktu inferensi dan akurasi antara Linear SVM vs RBF Kernel SVM, dan jelaskan mengapa Joachims (1998) menyarankan penggunaan kernel linier murni untuk teks berdimensi tinggi."
        ),
        "academicReferences": [
            r"Joachims, T. (1998). Text categorization with support vector machines: Learning with many relevant features. In European Conference on Machine Learning (pp. 137-142). Springer.",
            r"Cortes, C., & Vapnik, V. (1995). Support-vector networks. Machine Learning, 20(3), 273-297.",
            r"Fan, R. E., Chang, K. W., Hsieh, C. J., Wang, X. R., & Lin, C. J. (2008). LIBLINEAR: A library for large linear classification. Journal of Machine Learning Research, 9, 1871-1874."
        ]
    }
})

# ==============================================================================
# Subbab 6.5: Pembelajaran Sekuensial: RNN & Bi-LSTM untuk Teks
# ==============================================================================
code_6_5 = r'''import numpy as np

# Propagasi Konteks Dua Arah: Bidirectional LSTM (Bi-LSTM) untuk Klasifikasi Teks
# h_t = [ \vec{h}_t ; \overleftarrow{h}_t ]
# Menangkap konteks kata sebelumnya dan kata sesudahnya secara simultan

seq_len = 4
d_in = 3
d_hidden = 2

# Inisialisasi bobot simulasi Forward dan Backward RNN sederhana
np.random.seed(42)
W_fwd = np.random.randn(d_hidden, d_in)
U_fwd = np.random.randn(d_hidden, d_hidden)
W_bwd = np.random.randn(d_hidden, d_in)
U_bwd = np.random.randn(d_hidden, d_hidden)

# Sekuens masukan kata (seq_len x d_in)
X = np.random.randn(seq_len, d_in)

# Forward pass
h_fwd = np.zeros((seq_len, d_hidden))
h_prev = np.zeros(d_hidden)
for t in range(seq_len):
    h_prev = np.tanh(W_fwd @ X[t] + U_fwd @ h_prev)
    h_fwd[t] = h_prev

# Backward pass
h_bwd = np.zeros((seq_len, d_hidden))
h_next = np.zeros(d_hidden)
for t in reversed(range(seq_len)):
    h_next = np.tanh(W_bwd @ X[t] + U_bwd @ h_next)
    h_bwd[t] = h_next

# Konkatenasi vektor representasi dua arah
h_bilstm = np.hstack((h_fwd, h_bwd))

print("Representasi Sekuensial Bi-LSTM untuk Teks:")
print("-" * 75)
print(f"Panjang Sekuens Teks : {seq_len} token | Dimensi Tersembunyi: {d_hidden}")
print(f"Dimensi Output Akhir  : {h_bilstm.shape} (seq_len x 2*d_hidden)\n")
for t in range(seq_len):
    print(f"Token {t+1}: Forward = {h_fwd[t]} | Backward = {h_bwd[t]} -> Konkatenasi: {h_bilstm[t]}")
print("-" * 75)
print("Bi-LSTM mengagregasi masa lalu dan masa depan untuk memahami peran kata dalam kalimat.")
'''

subchapters.append({
    "id": "nlp-6-5-rnn-bilstm-sequence-classification",
    "chapterId": "natural-language-processing-ch-6",
    "title": "Pembelajaran Sekuensial: Recurrent Neural Networks (RNN) dan Bi-LSTM untuk Teks",
    "description": "Pemodelan dependensi temporal bahasa: propagasi state tersembunyi, masalah vanishing/exploding gradient, gerbang LSTM (Hochreiter & Schmidhuber), dan representasi Bi-LSTM.",
    "estimatedMinutes": 40,
    "order": 5,
    "content": {
        "theory": (
            "Meskipun model linear seperti SVM dan Naive Bayes sangat cepat, keduanya mengabaikan urutan temporal sintaksis kalimat (*loss of word order*). Untuk menangkap struktur sekuensial bahasa alami, arsitektur **Recurrent Neural Networks (RNN)** dan **Long Short-Term Memory (LSTM)** memperkenalkan mekanisme state tersembunyi yang diperbarui secara berulang pada setiap langkah waktu.\n\n"
            "Dalam Elman RNN standar, representasi tersembunyi $\\mathbf{h}_t$ dihitung sebagai fungsi dari kata saat ini $\\mathbf{x}_t$ dan memori masa lalu $\\mathbf{h}_{t-1}$:\n"
            "$$\\mathbf{h}_t = \\tanh(\\mathbf{W} \\mathbf{x}_t + \\mathbf{U} \\mathbf{h}_{t-1} + \\mathbf{b})$$\n\n"
            "**Masalah Lenyapnya Gradien & Solusi LSTM**:\n"
            "Saat melatih RNN standar menggunakan *Backpropagation Through Time (BPTT)* pada kalimat panjang, perkalian matriks bobot berulang $\\prod \\mathbf{U}$ menyebabkan gradien menyusut secara eksponensial mendekati nol (*Vanishing Gradient Problem*). Model kehilangan kemampuan mengingat kata-kata awal kalimat.\n\n"
            "Sepp Hochreiter & Jürgen Schmidhuber (1997) memecahkan masalah ini dengan merancang sel **LSTM** yang dilengkapi dengan *constant error carousel* dan tiga gerbang pengontrol aliran informasi:\n"
            "$$\\mathbf{f}_t = \\sigma(\\mathbf{W}_f \\mathbf{x}_t + \\mathbf{U}_f \\mathbf{h}_{t-1} + \\mathbf{b}_f) \\quad (\\text{Forget Gate})$$\n"
            "$$\\mathbf{i}_t = \\sigma(\\mathbf{W}_i \\mathbf{x}_t + \\mathbf{U}_i \\mathbf{h}_{t-1} + \\mathbf{b}_i) \\quad (\\text{Input Gate})$$\n"
            "$$\\tilde{\\mathbf{c}}_t = \\tanh(\\mathbf{W}_c \\mathbf{x}_t + \\mathbf{U}_c \\mathbf{h}_{t-1} + \\mathbf{b}_c) \\quad (\\text{Candidate Memory})$$\n"
            "$$\\mathbf{c}_t = \\mathbf{f}_t \\odot \\mathbf{c}_{t-1} + \\mathbf{i}_t \\odot \\tilde{\\mathbf{c}}_t \\quad (\\text{Cell State Update})$$\n"
            "$$\\mathbf{o}_t = \\sigma(\\mathbf{W}_o \\mathbf{x}_t + \\mathbf{U}_o \\mathbf{h}_{t-1} + \\mathbf{b}_o) \\quad (\\text{Output Gate})$$\n"
            "$$\\mathbf{h}_t = \\mathbf{o}_t \\odot \\tanh(\\mathbf{c}_t)$$\n\n"
            "**Arsitektur Bidirectional LSTM (Bi-LSTM)** (Graves & Schmidhuber, 2005) menggabungkan lintasan maju (membaca dari kiri ke kanan $\\overrightarrow{\\mathbf{h}}_t$) dan lintasan mundur (membaca dari kanan ke kiri $\\overleftarrow{\\mathbf{h}}_t$) untuk membentuk representasi konteks menyeluruh $\\mathbf{h}_t = [\\overrightarrow{\\mathbf{h}}_t ; \\overleftarrow{\\mathbf{h}}_t]$ sebelum diproyeksikan ke lapisan klasifikasi akhir."
        ),
        "codeSnippet": code_6_5,
        "codeSnippetOutput": run_code_capture_output(code_6_5),
        "realWorldApplication": (
            "Klasifikasi sentimen ulasan film IMDb, deteksi ujaran kebencian di media sosial, dan penandaan kategori email percakapan pelanggan."
        ),
        "commonPitfalls": [
            r"Lupa menerapkan gradient clipping (misal max_norm = 5.0) yang menyebabkan ledakan angka floating point (exploding gradients) pada pelatihan RNN.",
            r"Hanya menggunakan hidden state terakhir h_T pada kalimat panjang (menerapkan pooling rata-rata atau mekanisme atensi pada seluruh h_t menghasilkan akurasi yang jauh lebih konsisten).",
            r"Memproses padding token tanpa mask masking sehingga hidden state tercemar oleh nilai nol dari token <PAD>."
        ],
        "caseStudy": (
            "Dalam analisis sentimen kalimat: 'Meskipun awalnya saya sangat ragu dengan kualitasnya, pada akhirnya perangkat ini bekerja dengan luar biasa sempurna'. Analisis bagaimana RNN satu arah kiri-ke-kanan dapat tertipu oleh kata-kata awal, sedangkan Bi-LSTM mampu menangkap konklusi positif di akhir kalimat secara seimbang."
        ),
        "academicReferences": [
            r"Hochreiter, S., & Schmidhuber, J. (1997). Long short-term memory. Neural Computation, 9(8), 1735-1780.",
            r"Graves, A., & Schmidhuber, J. (2005). Framewise phoneme classification with bidirectional LSTM and other neural network architectures. Neural Networks, 18(5-6), 602-610.",
            r"Cho, K., et al. (2014). Learning phrase representations using RNN encoder-decoder for statistical machine translation. In EMNLP (pp. 1724-1734)."
        ]
    }
})

# ==============================================================================
# Subbab 6.6: TextCNN (Yoon Kim, 2014) (Spot-Check 6)
# ==============================================================================
code_6_6 = r'''import numpy as np

# TextCNN: Convolutional Neural Networks for Sentence Classification (Yoon Kim, EMNLP 2014)
# Formulasi Konvolusi 1D Temporal (Kim 2014, Eq. 1 & 2):
# c_i = f(w \cdot x_{i:i+h-1} + b)
# Max-over-time pooling: \hat{c} = \max\{c\} (Kim 2014, Section 2)

# Kalimat uji berpanjang n = 5 kata dengan dimensi embedding k = 4
# x_{1:n} \in R^{n x k}
np.random.seed(42)
n_words = 5
k_dim = 4
sentence_matrix = np.random.randn(n_words, k_dim)

# Definisikan 3 filter konvolusi dengan ukuran window berbeda: h = 2 (bigram), h = 3 (trigram)
filters = [
    {"h": 2, "w": np.random.randn(2 * k_dim), "b": 0.1},
    {"h": 3, "w": np.random.randn(3 * k_dim), "b": -0.2}
]

pooled_features = []

print("Simulasi Operasi 1D Temporal Convolution TextCNN (Yoon Kim, 2014):")
print("-" * 75)
print(f"Dimensi Matriks Kalimat x_{{1:n}} : {sentence_matrix.shape} (n={n_words} kata, k={k_dim} dimensi)\n")

for idx, flt in enumerate(filters, start=1):
    h = flt["h"]
    w = flt["w"]
    b = flt["b"]
    
    # Hitung feature map c_i untuk setiap window kata yang mungkin
    feature_map = []
    for i in range(n_words - h + 1):
        window = sentence_matrix[i:i+h].flatten() # x_{i:i+h-1}
        c_i = np.tanh(np.dot(w, window) + b)      # Eq. 1: f(w * x + b)
        feature_map.append(c_i)
    
    feature_map = np.array(feature_map)
    # Max-over-time pooling: \hat{c} = \max{c}
    c_hat = np.max(feature_map)
    pooled_features.append(c_hat)
    
    print(f"Filter {idx} (Ukuran Window h = {h} kata):")
    print(f"  - Feature Map c         : {[round(x, 4) for x in feature_map]} (Panjang: {len(feature_map)})")
    print(f"  - Max-over-time Pool \\hat{{c}}: {c_hat:.4f}")

z = np.array(pooled_features)
print("-" * 75)
print(f"Vektor Fitur Penyatuan Akhir z = [{', '.join([f'{val:.4f}' for val in z])}]")
print("TextCNN mengekstrak n-gram lokal paling informatif terlepas dari posisinya dalam kalimat.")
'''

subchapters.append({
    "id": "nlp-6-6-textcnn-1d-convolution-sentence",
    "chapterId": "natural-language-processing-ch-6",
    "title": "Convolutional Neural Networks untuk Teks (TextCNN - Yoon Kim, 2014): 1D Convolution & Max-Over-Time",
    "description": "Karya monumental Yoon Kim (EMNLP 2014): formulasi konvolusi 1D temporal melintasi lebar embedding, variasi ukuran kernel n-gram, max-over-time pooling, dan model CNN-static vs non-static (Spot-Check Literatur Primer).",
    "estimatedMinutes": 40,
    "order": 6,
    "content": {
        "theory": (
            "Pada tahun 2014, **Yoon Kim** dari Universitas New York mempublikasikan karya seminal berjudul *'Convolutional Neural Networks for Sentence Classification'* pada konferensi EMNLP. Penelitian ini membuktikan bahwa Convolutional Neural Networks (CNN)—yang sebelumnya hampir secara eksklusif diasosiasikan dengan pemrosesan citra 2D—mampu meraih akurasi *state-of-the-art* pada berbagai tolok ukur klasifikasi kalimat dan analisis sentimen (SST, Movie Reviews, TREC) dengan arsitektur yang sangat sederhana dan efisien.\n\n"
            "**Formulasi Konvolusi 1D Temporal (Section 2, Kim 2014)**:\n"
            "Sebuah kalimat yang terdiri dari $n$ kata direpresentasikan sebagai matriks dua dimensi $\\mathbf{x}_{1:n} \\in \\mathbb{R}^{n \\times k}$, di mana baris ke-$i$ adalah vektor word embedding berdimensi $k$:\n"
            "$$\\mathbf{x}_{1:n} = \\mathbf{x}_1 \\oplus \\mathbf{x}_2 \\oplus \\dots \\oplus \\mathbf{x}_n$$\n"
            "di mana $\\oplus$ adalah operator konkatenasi.\n\n"
            "Berbeda dengan penglihatan komputer di mana kernel konvolusi bergeser secara 2D (horizontal dan vertikal), pada teks filter konvolusi **memiliki lebar yang sama persis dengan dimensi embedding $k$** dan hanya bergeser sepanjang sumbu temporal kata (konvolusi 1D). Sebuah filter $\\mathbf{w} \\in \\mathbb{R}^{h \\cdot k}$ diterapkan pada jendela $h$ kata untuk menghasilkan fitur skalar baru $c_i$ (Persamaan 1, Kim 2014):\n"
            "$$c_i = f(\\mathbf{w} \\cdot \\mathbf{x}_{i:i+h-1} + b)$$\n"
            "di mana $b \\in \\mathbb{R}$ adalah bias dan $f$ adalah fungsi non-linear (seperti $\\tanh$ atau ReLU).\n\n"
            "Menerapkan filter ini ke seluruh jendela kata yang memungkinkan $\\{\\mathbf{x}_{1:h}, \\mathbf{x}_{2:h+1}, \\dots, \\mathbf{x}_{n-h+1:n}\\}$ menghasilkan peta fitur (*feature map*):\n"
            "$$\\mathbf{c} = [c_1, c_2, \\dots, c_{n-h+1}] \\in \\mathbb{R}^{n-h+1}$$\n\n"
            "**Max-Over-Time Pooling**:\n"
            "Untuk menangani panjang kalimat yang bervariasi dan mengekstrak fitur n-gram paling penting terlepas dari posisinya, Kim menerapkan operasi **Max-Over-Time Pooling**:\n"
            "$$\\hat{c} = \\max\\{\\mathbf{c}\\} = \\max\\{c_1, c_2, \\dots, c_{n-h+1}\\}$$\n"
            "Dengan menggabungkan puluhan filter dengan ukuran jendela berbeda ($h \\in \\{3, 4, 5\\}$ untuk menangkap frasa trigram, 4-gram, dan 5-gram), model menghasilkan representasi fitur tetap yang ringkas dan sangat diskriminatif.\n\n"
            "**Kanal Statis vs Non-Statis (*Static vs Non-static Channels*)**:\n"
            "Kim mengevaluasi 4 varian model:\n"
            "1. **CNN-rand**: Vektor kata diinisialisasi secara acak.\n"
            "2. **CNN-static**: Menggunakan vektor Word2Vec pra-terlatih yang dibekukan (*frozen*).\n"
            "3. **CNN-non-static**: Vektor Word2Vec disesuaikan secara dinamis (*fine-tuned*) selama pelatihan.\n"
            "4. **CNN-multichannel**: Menggunakan dua kanal embedding secara simultan (satu dibekukan, satu di-fine-tune)."
        ),
        "codeSnippet": code_6_6,
        "codeSnippetOutput": run_code_capture_output(code_6_6),
        "realWorldApplication": (
            "Klasifikasi sentimen skala besar latensi sangat rendah pada sistem streaming media sosial, deteksi topik pertanyaan FAQ chatbot, dan filter spam email instan."
        ),
        "commonPitfalls": [
            r"Menerapkan padding 2D yang memecah dimensi embedding word vectors (lebar filter konvolusi teks wajib bernilai tepat sama dengan dimensi embedding k).",
            r"Menggunakan ukuran window h yang lebih besar daripada panjang kalimat masukan tanpa zero-padding yang cukup.",
            r"Lupa menerapkan regularisasi Dropout (Kim merekomendasikan p = 0.5) pada lapisan penultimate sebelum Softmax yang menyebabkan overfitting."
        ],
        "caseStudy": (
            "Dalam ulasan film IMDb berpanjang 200 kata, sebuah frasa positif penentu 'must-see masterpiece' muncul di paragraf kedua. Jelaskan bagaimana mekanisme filter konvolusi h = 3 dan Max-Over-Time Pooling pada TextCNN mengekstrak fitur frasa tersebut secara invarian terhadap posisi tanpa teredam oleh kalimat-kalimat deskriptif di sekitarnya."
        ),
        "academicReferences": [
            r"Kim, Y. (2014). Convolutional neural networks for sentence classification. In Proceedings of the 2014 Conference on Empirical Methods in Natural Language Processing (EMNLP) (pp. 1746-1751).",
            r"Collobert, R., Weston, J., Bottou, L., Karlen, M., Kavukcuoglu, K., & Kuksa, P. (2011). Natural language processing (almost) from scratch. Journal of Machine Learning Research, 12, 2493-2537.",
            r"Zhang, Y., & Wallace, B. (2017). A sensitivity analysis of (and practitioners' guide to) convolutional neural networks for sentence classification. In IJCNLP (pp. 253-263)."
        ]
    }
})

# ==============================================================================
# Subbab 6.7: Analisis Sentimen & Aspek Tingkat Lanjut (ABSA)
# ==============================================================================
code_6_7 = r'''import numpy as np

# Analisis Sentimen Berbasis Aspek (Aspect-Based Sentiment Analysis / ABSA)
# Menentukan polaritas opini terarah pada aspek spesifik dalam satu kalimat yang sama
# Kalimat: "Makanannya sangat lezat, tetapi pelayanannya sangat mengecewakan."
# Aspek 1: 'Makanan'    -> Polaritas: Positif (+1)
# Aspek 2: 'Pelayanan'  -> Polaritas: Negatif (-1)

sentence = "makanannya sangat lezat tetapi pelayanannya sangat mengecewakan"

aspect_lexicon = {
    "makanan": ["makanan", "hidangan", "rasa", "menu"],
    "pelayanan": ["pelayanan", "staf", "pelayan", "service"]
}

sentiment_lexicon = {
    "lezat": +1.0, "nikmat": +1.0, "bagus": +0.8,
    "mengecewakan": -1.0, "buruk": -0.8, "lambat": -0.6
}

def rule_based_absa(text):
    tokens = text.lower().split()
    aspect_scores = {"makanan": 0.0, "pelayanan": 0.0}
    
    # Cari aspek dan kata sentimen terdekat (window = 3 kata)
    for i, tok in enumerate(tokens):
        for asp, terms in aspect_lexicon.items():
            if any(term in tok for term in terms):
                # Scan sentimen dalam radius 3 token
                start = max(0, i - 3)
                end = min(len(tokens), i + 4)
                for j in range(start, end):
                    word = tokens[j]
                    if word in sentiment_lexicon:
                        aspect_scores[asp] += sentiment_lexicon[word]
    return aspect_scores

scores = rule_based_absa(sentence)

print("Analisis Sentimen Berbasis Aspek (ABSA):")
print("-" * 75)
print(f"Kalimat Input : \"{sentence}\"\n")
for asp, sc in scores.items():
    pol = "POSITIF" if sc > 0 else ("NEGATIF" if sc < 0 else "NETRAL")
    print(f"Aspek: {asp.capitalize():<10} | Skor Sentimen: {sc:>5.2f} -> Polaritas: {pol}")
print("-" * 75)
print("ABSA membedakan evaluasi multi-sentimen yang saling bertentangan dalam satu kalimat.")
'''

subchapters.append({
    "id": "nlp-6-7-aspect-based-sentiment-analysis",
    "chapterId": "natural-language-processing-ch-6",
    "title": "Analisis Sentimen & Aspek Tingkat Lanjut (ABSA): Ekstraksi Target, Opini, dan Polaritas",
    "description": "Dekomposisi opini granular: batas analisis sentimen tingkat dokumen, kalimat, dan aspek (ABSA), ekstraksi istilah aspek (ATE), dan pemodelan relasi aspek-polaritas terarah.",
    "estimatedMinutes": 35,
    "order": 7,
    "content": {
        "theory": (
            "Klasifikasi sentimen konvensional pada tingkat dokumen atau kalimat sering kali terlalu kasar untuk kebutuhan analisis bisnis dunia nyata. Sebuah ulasan restoran berbunyi: *'Makanannya luar biasa lezat, namun pelayanannya sangat lambat dan harganya terlalu mahal'* memuat tiga opini yang saling bertentangan.\n\n"
            "Jika model hanya memprediksi satu label tunggal (misal 'Netral'), seluruh nilai bisnis dari ulasan tersebut hilang. **Analisis Sentimen Berbasis Aspek (*Aspect-Based Sentiment Analysis / ABSA*)** (Liu, 2012; Pontiki et al., SemEval) menyelesaikan tantangan ini dengan mendekomposisi opini ke dalam tupel analitis formal:\n"
            "$$\\mathcal{O} = (g, a, s, h, t)$$\n"
            "di mana:\n"
            "- $g$: Entitas target (*target entity*, misal *Restoran X*).\n"
            "- $a$: Kategori aspek (*aspect category*, misal *Makanan*, *Pelayanan*, *Harga*).\n"
            "- $s$: Polaritas sentimen (*sentiment polarity*, misal *Positif*, *Negatif*, *Netral*).\n"
            "- $h$: Pemegang opini (*opinion holder*).\n"
            "- $t$: Waktu opini diutarakan (*time of opinion*).\n\n"
            "**Dua Sub-Tugas Utama dalam ABSA**:\n"
            "1. **Ekstraksi Istilah Aspek (*Aspect Term Extraction / ATE*)**: Tugas pelabelan sekuensial (mirip NER) untuk mengidentifikasi rentang kata yang merujuk ke aspek tertentu dalam teks (misal menandai *'makanannya'* dan *'pelayanannya'*).\n"
            "2. **Klasifikasi Sentimen Aspek (*Aspect-Level Sentiment Classification / ALSC*)**: Memprediksi polaritas sentimen terhadap aspek sasaran yang telah teridentifikasi, sering dimodelkan menggunakan arsitektur jaringan saraf berbasis atensi target (*Target-Dependent Attention Network*) atau Graph Convolutional Networks (GCN) di atas pohon ketergantungan sintaksis."
        ),
        "codeSnippet": code_6_7,
        "codeSnippetOutput": run_code_capture_output(code_6_7),
        "realWorldApplication": (
            "Sistem analisis kepuasan pelanggan e-commerce (Shopee, Tokopedia), pemantau reputasi hotel TripAdvisor, dan riset intelijen pasar produk otomotif."
        ),
        "commonPitfalls": [
            r"Mengabaikan aspek implisit (implicit aspects) di mana kata aspek tidak disebutkan secara eksplisit, misal: 'Kamera ini muat di saku baju' (merujuk ke aspek ukuran/portabilitas).",
            r"Gagal menangani konstruksi negasi berbalik arah (misal: 'tidak pernah mengecewakan' yang sebenarnya berkonotasi positif).",
            r"Mengabaikan sarkasme dan ironi di mana kata-kata leksikal positif digunakan untuk menyatakan kritik pedas."
        ],
        "caseStudy": (
            "Diberikan ulasan smartphone: 'Baterainya tahan seharian penuh, tetapi layarnya mudah tergores dan kameranya sangat buram di kondisi minim cahaya'. Rancang pemetaan tupel ABSA untuk ketiga aspek tersebut dan evaluasi bagaimana sistem rekomendasi produk memanfaatkannya."
        ),
        "academicReferences": [
            r"Liu, B. (2012). Sentiment analysis and opinion mining. Synthesis Lectures on Human Language Technologies, 5(1), 1-167.",
            r"Pontiki, M., et al. (2016). Semeval-2016 task 5: Aspect based sentiment analysis. In SemEval-2016 (pp. 19-30).",
            r"Wang, Y., Huang, M., Zhu, X., & Zhao, L. (2016). Attention-based LSTM for aspect-level sentiment classification. In EMNLP (pp. 606-615)."
        ]
    }
})

# ==============================================================================
# Subbab 6.8: Metrik Evaluasi Klasifikasi Teks & Ketidakseimbangan Kelas
# ==============================================================================
code_6_8 = r'''import numpy as np

# Metrik Evaluasi Klasifikasi Teks: Precision, Recall, Macro-F1 vs Micro-F1 pada Data Imbalanced
# Matriks Kebingungan (Confusion Matrix) 3 Kelas: [Olahraga, Politik, Kuliner]
# Baris = Aktual, Kolom = Prediksi

confusion_matrix = np.array([
    [90,  5,  5],   # Olahraga: 100 sampel (Mayoritas)
    [ 2, 45,  3],   # Politik : 50 sampel
    [ 1,  4,  5]    # Kuliner : 10 sampel (Minoritas ekstrem!)
])

total_samples = confusion_matrix.sum()
accuracy = np.trace(confusion_matrix) / total_samples

# Hitung Precision, Recall, F1 per kelas
precisions = []
recalls = []
f1_scores = []

K = confusion_matrix.shape[0]
for k in range(K):
    tp = confusion_matrix[k, k]
    fp = confusion_matrix[:, k].sum() - tp
    fn = confusion_matrix[k, :].sum() - tp
    
    prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0
    
    precisions.append(prec)
    recalls.append(rec)
    f1_scores.append(f1)

macro_f1 = np.mean(f1_scores)
micro_f1 = accuracy # Secara matematis micro-F1 sama dengan accuracy pada multikelas eksklusif

print("Evaluasi Klasifikasi Teks pada Dataset Tak Seimbang:")
print("-" * 70)
print(f"Akurasi Keseluruhan (Accuracy) : {accuracy * 100:.2f}%\n")
classes = ["Olahraga", "Politik", "Kuliner"]
for k in range(K):
    print(f"Kelas '{classes[k]:<8}': Precision = {precisions[k]:.4f} | Recall = {recalls[k]:.4f} | F1 = {f1_scores[k]:.4f}")

print("-" * 70)
print(f"Macro-Averaged F1 : {macro_f1:.4f} (Memberikan bobot setara pada kelas minoritas)")
print(f"Micro-Averaged F1 : {micro_f1:.4f} (Didominasi oleh kelas mayoritas)")
print("-" * 70)
print("Peringatan: Akurasi tinggi (87.5%) menipu karena F1 kelas minoritas 'Kuliner' hanya 0.45!")
'''

subchapters.append({
    "id": "nlp-6-8-evaluation-metrics-class-imbalance",
    "chapterId": "natural-language-processing-ch-6",
    "title": "Metrik Evaluasi Klasifikasi Teks & Ketidakseimbangan Kelas: Macro vs Micro F1 dan Cost-Sensitive",
    "description": "Pengukuran kinerja objektif sistem klasifikasi teks: Matriks Kontingensi, presisi, perolehan, perdebatan Macro-F1 vs Micro-F1, serta mitigasi ketidakseimbangan kelas.",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "Dalam pemrosesan teks dunia nyata, distribusi korpus hampir selalu mengalami **ketidakseimbangan kelas (*Class Imbalance*)** yang parah. Sebagai contoh, dalam sistem deteksi penipuan transaksi atau penyaringan spam medis, kelas positif yang dicari sering kali hanya mencakup kurang dari $1\\%$ dari total korpus.\n\n"
            "Dalam kondisi ini, metrik **Akurasi (*Accuracy*)** menjadi sepenuhnya tidak berguna dan menipu: model naif yang selalu memprediksi kelas mayoritas akan meraih akurasi $99\\%$, namun gagal total mendeteksi satu pun kasus penipuan.\n\n"
            "**Metrik Evaluasi Standar Emas Klasifikasi Teks**:\n"
            "1. **Precision ($P$) & Recall ($R$)**:\n"
            "   $$P = \\frac{TP}{TP + FP}, \\quad R = \\frac{TP}{TP + FN}$$\n"
            "   Precision mengukur ketepatan prediksi positif model (menghindari alarm palsu), sedangkan Recall mengukur kelengkapan pencarian (menghindari kasus yang terlewat).\n"
            "2. **$F_1$-Score**:\n"
            "   Rata-rata harmonik antara presisi dan perolehan:\n"
            "   $$F_1 = 2 \\cdot \\frac{P \\cdot R}{P + R} = \\frac{2 TP}{2 TP + FP + FN}$$\n\n"
            "**Perbedaan Fundamental Macro-Averaging vs Micro-Averaging**:\n"
            "- **Macro-Averaged $F_1$**: Menghitung skor $F_1$ secara mandiri untuk setiap kelas, lalu merata-ratakannya secara seragam:\n"
            "  $$\\text{Macro-}F_1 = \\frac{1}{K} \\sum_{k=1}^K F_1^{(k)}$$\n"
            "  Macro-F1 memberikan bobot yang setara kepada setiap kategori tanpa mempedulikan frekuensinya. Metrik ini sangat sensitif terhadap kegagalan pada kelas minoritas.\n"
            "- **Micro-Averaged $F_1$**: Mengagregasikan seluruh nilai $TP, FP, FN$ global dari semua kelas terlebih dahulu sebelum menghitung $F_1$ komposit. Metrik ini didominasi oleh performa kelas mayoritas.\n\n"
            "**Strategi Mitigasi Ketidakseimbangan Kelas**:\n"
            "- **Focal Loss (Lin et al., 2017)**: Menambahkan faktor modulasi $(1 - p_t)^\\gamma$ untuk menekan gradien dari contoh-contoh mudah dan memfokuskan model pada contoh sulit.\n"
            "- **Cost-Sensitive Weighting**: Memberikan bobot penalti invers frekuensi kelas pada fungsi kerugian cross-entropy."
        ),
        "codeSnippet": code_6_8,
        "codeSnippetOutput": run_code_capture_output(code_6_8),
        "realWorldApplication": (
            "Evaluasi sistem deteksi ancaman siber (phishing / malware text), audit kepatuhan regulasi finansial AML (*Anti-Money Laundering*), dan diagnosa penyakit langka rekam medis."
        ),
        "commonPitfalls": [
            r"Melaporkan akurasi murni pada dataset teks yang tidak seimbang tanpa menyertakan Macro-F1 dan Confusion Matrix.",
            r"Melakukan oversampling (seperti SMOTE) sebelum text tokenization yang menghasilkan vektor teks sintetis yang tidak memiliki representasi kata riil.",
            r"Menyetel ambang batas klasifikasi biner selalu pada 0.5 secara kaku tanpa kalibrasi kurva Precision-Recall (PR-AUC)."
        ],
        "caseStudy": (
            "Sebuah sistem moderasi konten ujaran kebencian di media sosial memiliki korpus 1.000.000 komentar di mana hanya 1.000 komentar yang berstatus hate speech. Model meraih akurasi 99.8% namun Recall kelas hate speech hanya 20%. Analisis kegagalan operasional sistem ini dan rekomendasikan metrik evaluasi yang tepat."
        ),
        "academicReferences": [
            r"Sokolova, M., & Lapalme, G. (2009). A systematic analysis of performance measures for classification tasks. Information Processing & Management, 45(4), 427-437.",
            r"Lin, T. Y., Goyal, P., Girshick, R., He, K., & Dollár, P. (2017). Focal loss for dense object detection. In ICCV (pp. 2980-2988).",
            r"Manning, C. D., Raghavan, P., & Schütze, H. (2008). Introduction to Information Retrieval. Chapter 8: Evaluation in information retrieval. Cambridge University Press."
        ]
    }
})

# ==============================================================================
# Subbab 6.9: Model Ensemble & Kalibrasi Probabilitas Teks
# ==============================================================================
code_6_9 = r'''import numpy as np

# Model Ensemble & Kalibrasi Probabilitas untuk Klasifikasi Teks
# Menggabungkan prediksi 3 model heterogen (Naive Bayes, SVM, BiLSTM) menggunakan Soft-Voting
# Brier Score: B = \frac{1}{N} \sum_{i=1}^N \sum_{k=1}^K (p_{ik} - y_{ik})^2

# Probabilitas prediksi kelas positif dari 3 model untuk 4 dokumen uji
preds_nb    = np.array([0.85, 0.40, 0.65, 0.20])
preds_svm   = np.array([0.75, 0.35, 0.80, 0.15])
preds_bilstm = np.array([0.90, 0.25, 0.70, 0.10])

# Bobot model ensemble (bisa dioptimalkan via validasi silang)
weights = [0.2, 0.3, 0.5]

ensemble_probs = (weights[0] * preds_nb + 
                  weights[1] * preds_svm + 
                  weights[2] * preds_bilstm)

y_true = np.array([1, 0, 1, 0]) # Label biner sejati

# Hitung Brier Score (mengukur akurasi kalibrasi probabilitas: semakin rendah semakin baik)
brier_score = np.mean((ensemble_probs - y_true) ** 2)

print("Ensemble Soft-Voting & Kalibrasi Probabilitas Teks:")
print("-" * 70)
print(f"{'Dokumen':<10} | {'P_NB':<8} | {'P_SVM':<8} | {'P_BiLSTM':<10} | {'Ensemble':<10} | {'Label Asli':<10}")
print("-" * 70)
for i in range(len(y_true)):
    print(f"Doc {i+1:<6} | {preds_nb[i]:<8.2f} | {preds_svm[i]:<8.2f} | {preds_bilstm[i]:<10.2f} | {ensemble_probs[i]:<10.4f} | {y_true[i]:<10}")
print("-" * 70)
print(f"Brier Score Kalibrasi Ensemble: {brier_score:.4f} (Mendekati 0 = Terkalibrasi sangat baik!)")
'''

subchapters.append({
    "id": "nlp-6-9-ensemble-probability-calibration",
    "chapterId": "natural-language-processing-ch-6",
    "title": "Model Ensemble & Kalibrasi Probabilitas Teks: Stacking, Brier Score, dan Platt Scaling",
    "description": "Penggabungan model jamak: hard voting vs soft voting, meta-learning stacking, evaluasi kepercayaan model via Brier Score, dan kalibrasi pasca-pemrosesan Platt Scaling.",
    "estimatedMinutes": 35,
    "order": 9,
    "content": {
        "theory": (
            "Dalam kompetisi machine learning tingkat dunia (seperti Kaggle NLP) dan sistem produksi kritis, model tunggal jarang digunakan sendirian. Menggabungkan beberapa model yang memiliki bias induktif berbeda melalui teknik **Ensemble Learning** secara konsisten menghasilkan performa yang lebih stabil dan tahan banting daripada model terbaiknya secara individual.\n\n"
            "**Metode Penggabungan Model Teks**:\n"
            "1. **Voting (Hard vs Soft Voting)**:\n"
            "   - *Hard Voting*: Memilih label mayoritas terbanyak berdasarkan prediksi diskret setiap model.\n"
            "   - *Soft Voting*: Merata-ratakan distribusi probabilitas kontinu dari seluruh model $\\bar{P}(c \\mid x) = \\sum_{m=1}^M w_m P_m(c \\mid x)$. Soft voting umumnya jauh lebih superior karena memperhitungkan tingkat kepastian (*confidence*) model.\n"
            "2. **Stacking (Stacked Generalization - Wolpert, 1992)**:\n"
            "   Keluaran probabilitas dari beberapa model dasar (*Base Learners*, misal TF-IDF SVM, Naive Bayes, dan Bi-LSTM) dijadikan vektor fitur input baru untuk melatih model meta-klasifikasi tingkat dua (*Meta-Learner*, misal Logistic Regression).\n\n"
            "**Kalibrasi Probabilitas (*Probability Calibration*)**:\n"
            "Banyak model klasifikasi teks (terutama Naive Bayes dan jaringan neural modern dengan dropout tinggi) menghasilkan probabilitas yang **sangat tidak terkalibrasi** (*overconfident* atau *underconfident*). Jika sebuah model mengatakan probabilitas spam adalah $90\\%$, maka dari 100 dokumen dengan skor tersebut, seharusnya tepat 90 dokumen adalah spam sejati.\n\n"
            "Tingkat kalibrasi diukur menggunakan **Brier Score**:\n"
            "$$\\text{BS} = \\frac{1}{N} \\sum_{i=1}^N \\sum_{k=1}^K (P(y = k \\mid x_i) - y_{i, k})^2$$\n"
            "Teknik kalibrasi pasca-pemrosesan standar mencakup **Platt Scaling** (regresi logistik univariat di atas skor keputusan) dan **Isotonic Regression** (regresi monotonik non-parametrik)."
        ),
        "codeSnippet": code_6_9,
        "codeSnippetOutput": run_code_capture_output(code_6_9),
        "realWorldApplication": (
            "Penilaian risiko kredit berbasis analisis teks laporan audit keuangan, diagnosa bantuan klinis rumah sakit, dan pipeline pemenang kompetisi analisis sentimen teks."
        ),
        "commonPitfalls": [
            r"Melakukan stacking pada data latih yang sama tanpa out-of-fold cross-validation yang menyebabkan meta-learner mengalami overfitting parah pada data bocor.",
            r"Menggabungkan model-model yang memiliki arsitektur dan representasi identik (ensemble membutuhkan keberagaman/diversity model agar efektif).",
            r"Mengabaikan biaya latensi komputasi inferensi ensemble di lingkungan produksi real-time."
        ],
        "caseStudy": (
            "Sebuah sistem diagnostik medis menggunakan ensemble dari Linear SVM, Naive Bayes, dan BiLSTM untuk memprediksi keparahan gejala pasien dari catatan dokter. Jelaskan mengapa kalibrasi probabilitas menggunakan Platt Scaling sangat krusial bagi dokter sebelum mengambil keputusan klinis berisiko tinggi."
        ),
        "academicReferences": [
            r"Wolpert, D. H. (1992). Stacked generalization. Neural Networks, 5(2), 241-259.",
            r"Platt, J. (1999). Probabilistic outputs for support vector machines and comparisons to regularized likelihood methods. Advances in Large Margin Classifiers, 10(3), 61-74.",
            r"Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). On calibration of modern neural networks. In ICML (pp. 1321-1330)."
        ]
    }
})

# ==============================================================================
# Subbab 6.10: Implementasi TextCNN Lengkap Berbasis NumPy
# ==============================================================================
code_6_10 = r'''import numpy as np

# Implementasi Lengkap Model TextCNN 1D Forward Pass & Pooling Berbasis NumPy
class SimpleTextCNN:
    def __init__(self, vocab_size, embed_dim=8, num_classes=2, filter_sizes=(2, 3), num_filters=4):
        np.random.seed(42)
        self.V = vocab_size
        self.k = embed_dim
        self.num_classes = num_classes
        self.filter_sizes = filter_sizes
        self.num_filters = num_filters
        
        # 1. Embedding Matrix (V x k)
        self.embeddings = np.random.uniform(-0.2, 0.2, (self.V, self.k))
        
        # 2. Convolutional Filters
        self.filters = {}
        for h in filter_sizes:
            # Bobot filter: (num_filters, h * k), bias: (num_filters,)
            self.filters[h] = {
                "W": np.random.randn(num_filters, h * self.k) * np.sqrt(2.0 / (h * self.k)),
                "b": np.zeros(num_filters)
            }
            
        # 3. Dense Classification Layer
        total_pooled_dim = len(filter_sizes) * num_filters
        self.W_dense = np.random.randn(num_classes, total_pooled_dim) * np.sqrt(2.0 / total_pooled_dim)
        self.b_dense = np.zeros(num_classes)
        
    def forward(self, token_indices):
        n = len(token_indices)
        # Lookup word vectors: (n, k)
        sentence_emb = self.embeddings[token_indices]
        
        pooled_outputs = []
        
        for h in self.filter_sizes:
            W_h = self.filters[h]["W"]  # (num_filters, h*k)
            b_h = self.filters[h]["b"]  # (num_filters,)
            
            if n < h:
                # Jika kalimat lebih pendek dari filter, pad dengan nol
                pad_rows = np.zeros((h - n, self.k))
                padded_emb = np.vstack((sentence_emb, pad_rows))
                n_eff = h
            else:
                padded_emb = sentence_emb
                n_eff = n
                
            # Konvolusi 1D Temporal
            feature_map = []
            for i in range(n_eff - h + 1):
                window = padded_emb[i:i+h].flatten() # (h*k,)
                conv_out = np.tanh(np.dot(W_h, window) + b_h) # (num_filters,)
                feature_map.append(conv_out)
                
            feature_map = np.array(feature_map) # (n_eff - h + 1, num_filters)
            # Max-over-time pooling
            pooled = np.max(feature_map, axis=0) # (num_filters,)
            pooled_outputs.append(pooled)
            
        # Gabungkan seluruh fitur yang di-pool: (len(filter_sizes) * num_filters,)
        z = np.concatenate(pooled_outputs)
        
        # Lapisan Linier Terakhir & Softmax
        logits = np.dot(self.W_dense, z) + self.b_dense
        exp_logits = np.exp(logits - np.max(logits))
        probs = exp_logits / np.sum(exp_logits)
        
        return probs, z

model = SimpleTextCNN(vocab_size=20, embed_dim=6, num_classes=2, filter_sizes=(2, 3), num_filters=3)

# Kalimat uji tokenized indices: misal [3, 7, 12, 5]
sample_sentence = np.array([3, 7, 12, 5])
probs, feature_vector = model.forward(sample_sentence)

print("Eksekusi Model Lengkap SimpleTextCNN Berbasis NumPy:")
print("-" * 75)
print(f"Token Input Kalimat        : {sample_sentence.tolist()} (Panjang: {len(sample_sentence)} kata)")
print(f"Dimensi Vektor Fitur Pooled: {feature_vector.shape} (filter_sizes=(2,3) x 3 filters = 6 fitur)")
print(f"Probabilitas Prediksi Kelas: [Negatif: {probs[0]*100:.2f}%, Positif: {probs[1]*100:.2f}%]")
print(f"Keputusan Klasifikasi Model: {'POSITIF' if np.argmax(probs) == 1 else 'NEGATIF'}")
print("-" * 75)
print("Model berhasil mengeksekusi pipeline TextCNN lengkap murni berbasis aljabar array NumPy.")
'''

subchapters.append({
    "id": "nlp-6-10-textcnn-numpy-implementation",
    "chapterId": "natural-language-processing-ch-6",
    "title": "Implementasi Model TextCNN 1D Forward Pass & Max-Over-Time Pooling Mandiri Berbasis NumPy",
    "description": "Konstruksi komprehensif class SimpleTextCNN dari nol: lookup embedding, konvolusi 1D multi-kernel, max-over-time pooling, proyeksi dense, dan normalisasi probabilitas Softmax.",
    "estimatedMinutes": 45,
    "order": 10,
    "content": {
        "theory": (
            "Sebagai puncak dari Bab 6, kita menyatukan seluruh derivasi teoretis Convolutional Neural Networks untuk klasifikasi teks ke dalam satu implementasi menyeluruh class `SimpleTextCNN` yang dibangun murni dari nol menggunakan aljabar matriks NumPy tanpa dependensi pada kerangka kerja PyTorch atau TensorFlow.\n\n"
            "Arsitektur engine TextCNN mandiri ini dirancang dengan alur forward pass yang sepenuhnya modular:\n"
            "1. **Lapisan Embedding Lookup (`sentence_emb`)**:\n"
            "   Mengindeks baris matriks bobot $\\mathbf{E} \\in \\mathbb{R}^{|\\mathcal{V}| \\times k}$ berdasarkan ID token masukan untuk membentuk matriks sekuens kalimat $\\mathbf{X} \\in \\mathbb{R}^{n \\times k}$.\n"
            "2. **Bank Filter Konvolusi 1D Multi-Kernel (`self.filters[h]`)**:\n"
            "   Mendukung penggunaan beberapa ukuran jendela filter secara simultan (misal $h = 2$ untuk bigram dan $h = 3$ untuk trigram). Setiap filter memiliki bobot $\\mathbf{W}_h \\in \\mathbb{R}^{m \\times (h \\cdot k)}$ di mana $m$ adalah jumlah filter (*number of feature maps*).\n"
            "3. **Mekanisme Jendela Geser & Non-Linearitas**:\n"
            "   Menggeser jendela teks satu per satu dengan melipat (*flattening*) potongan matriks $\\mathbf{X}_{i:i+h-1}$ menjadi vektor berdimensi $h \\cdot k$, lalu menerapkan fungsi aktivasi non-linear hiperbolik tangen $\\tanh(\\mathbf{W}_h \\mathbf{x} + \\mathbf{b}_h)$.\n"
            "4. **Max-Over-Time Pooling Ter-Vektorirasi**:\n"
            "   Mengekstrak nilai maksimum absolut sepanjang dimensi temporal baris untuk setiap filter $\\hat{\\mathbf{c}} = \\max_{t} \\mathbf{c}_t$, mengompresi sekuens kata berpanjang arbitrer menjadi vektor fitur tetap berdimensi $\\sum m_h$.\n"
            "5. **Lapisan Klasifikasi Linier & Softmax**:\n"
            "   Memproyeksikan gabungan seluruh fitur pooled ke ruang logit kelas $\\mathbf{z} = \\mathbf{W}_{\\text{dense}} \\mathbf{c}_{\\text{pooled}} + \\mathbf{b}$ dan menghasilkan distribusi probabilitas akhir menggunakan Softmax yang distabilkan terhadap underflow.\n\n"
            "Implementasi ini mendemonstrasikan secara transparan bagaimana struktur konvolusi mampu merekayasa representasi teks tingkat tinggi secara mandiri dalam kecepatan komputasi linear $\\mathcal{O}(n \\cdot k)$."
        ),
        "codeSnippet": code_6_10,
        "codeSnippetOutput": run_code_capture_output(code_6_10),
        "realWorldApplication": (
            "Dapat digunakan sebagai mesin klasifikasi teks ringan pada micro-controller edge AI, inferensi serverless tanpa ketergantungan runtime PyTorch berukuran ratusan megabyte, dan unit pengujian unit test deterministik."
        ),
        "commonPitfalls": [
            r"Lupa menangani kalimat yang panjangnya lebih pendek daripada ukuran filter maksimum (h > n); wajib menambahkan baris nol (zero padding) agar operasi konvolusi tidak menghasilkan indeks kosong.",
            r"Melakukan pooling sebelum non-linearitas (urutan standar adalah konvolusi -> aktivasi non-linear -> max pooling).",
            r"Tidak melakukan inisialisasi bobot terkalibrasi He/Xavier yang menyebabkan vanishing gradients pada aktivasi tanh."
        ],
        "caseStudy": (
            "Ujilah class SimpleTextCNN di atas dengan mengubah ukuran filter_sizes=(1, 2, 3) versus filter_sizes=(3, 4, 5). Jelaskan bagaimana perubahan ukuran kernel mempengaruhi kemampuan model dalam mendeteksi fitur unigram kata kunci versus frasa idiomatis panjang."
        ),
        "academicReferences": [
            r"Kim, Y. (2014). Convolutional neural networks for sentence classification. In Proceedings of EMNLP (pp. 1746-1751).",
            r"Zhang, Y., & Wallace, B. (2017). A sensitivity analysis of (and practitioners' guide to) convolutional neural networks for sentence classification. In IJCNLP (pp. 253-263).",
            r"He, K., Zhang, X., Ren, S., & Sun, J. (2015). Delving deep into rectifiers: Surpassing human-level performance on imagenet classification. In ICCV (pp. 1026-1034)."
        ]
    }
})

output_path = os.path.join(os.path.dirname(__file__), "nlp_ch6_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 6 NLP -> {output_path}")
