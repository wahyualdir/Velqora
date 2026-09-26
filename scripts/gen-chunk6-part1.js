const fs = require('fs');
const path = require('path');
const { createSubchapter, exportChapterTs } = require('./curriculum-builder-helper');

const OUT_DIR = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');

// ==========================================
// CHAPTER 25: Metrologi Evaluasi & Metrik Klasifikasi Asimetris
// ==========================================
const ch25Subchapters = [
  createSubchapter({
    id: "ml-25-1-confusion-matrix",
    slug: "matriks-konfusi-formal-dan-distribusi-miring",
    title: "25.1 Matriks Konfusi Formal (TP, FP, TN, FN) & Batas Kelemahan Metrik Akurasi pada Distribusi Miring",
    orderIndex: 1,
    description: "Analisis teoretis matriks kontingensi biner, dekomposisi True/False Positives/Negatives, dan paradoks akurasi tinggi pada distribusi kelas miring (class imbalance).",
    theoryMarkdown: `Matriks konfusi merupakan matriks kontingensi berukuran $2 \\times 2$ yang memetakan label aktual $y \\in \\{0, 1\\}$ terhadap label prediksi $\\hat{y} \\in \\{0, 1\\}$. Keempat sel mendasar didefinisikan sebagai:
- **True Positive (TP)**: $y=1, \\hat{y}=1$
- **False Positive (FP)**: $y=0, \\hat{y}=1$ (Galat Tipe I / False Alarm)
- **False Negative (FN)**: $y=1, \\hat{y}=0$ (Galat Tipe II / Missed Detection)
- **True Negative (TN)**: $y=0, \\hat{y}=0$

Akurasi empiris didefinisikan sebagai:
$$\\text{Accuracy} = \\frac{TP + TN}{TP + FP + FN + TN}$$

Ketika prevalensi kelas positif sangat kecil ($\\pi = P(y=1) \\ll 0.5$, misalnya $\\pi = 0.001$ pada deteksi penipuan keuangan), model trivial yang memprediksi $\\hat{y} = 0$ secara konstan menghasilkan akurasi sebesar $1 - \\pi = 99.9\\%$. Namun, model ini sama sekali tidak memiliki daya diskriminatif ($TP = 0, FN = \\sum y_i$). Oleh karena itu, akurasi merupakan metrik yang menyesatkan (*accuracy paradox*) pada distribusi kelas yang miring.`,
    mermaidDiagram: `graph TD
    Actual["Kelas Aktual (Ground Truth)"] --> PosAct["Positif: y = 1"]
    Actual --> NegAct["Negatif: y = 0"]
    PosAct --> PredPos1["Prediksi Positif: TP (Sensitivitas)"]
    PosAct --> PredNeg1["Prediksi Negatif: FN (Galat Tipe II)"]
    NegAct --> PredPos2["Prediksi Positif: FP (Galat Tipe I)"]
    NegAct --> PredNeg2["Prediksi Negatif: TN (Spesifisitas)"]`,
    scratchCode: `import numpy as np

def compute_confusion_matrix(y_true, y_pred):
    """Kalkulasi matriks konfusi 2x2 dari nol tanpa pustaka pihak ketiga."""
    y_true = np.asarray(y_true, dtype=int)
    y_pred = np.asarray(y_pred, dtype=int)
    
    tp = np.sum((y_true == 1) & (y_pred == 1))
    fp = np.sum((y_true == 0) & (y_pred == 1))
    fn = np.sum((y_true == 1) & (y_pred == 0))
    tn = np.sum((y_true == 0) & (y_pred == 0))
    
    cm = np.array([[tn, fp],
                   [fn, tp]])
    accuracy = (tp + tn) / (tp + tn + fp + fn)
    return cm, {"TP": tp, "FP": fp, "FN": fn, "TN": tn, "Accuracy": accuracy}

# Evaluasi pada data ekstrem miring (990 negatif, 10 positif)
y_true = np.array([0]*990 + [1]*10)
y_pred_dummy = np.zeros_like(y_true) # Prediktor nol mutlak
cm, stats = compute_confusion_matrix(y_true, y_pred_dummy)
print("Matriks Konfusi:\\n", cm)
print(f"Akurasi Model Nol: {stats['Accuracy']:.4f} (Menyesatkan!)")`,
    sotaCode: `from sklearn.metrics import confusion_matrix, classification_report
import numpy as np

y_true = np.array([0]*990 + [1]*10)
y_pred = np.zeros_like(y_true)

cm = confusion_matrix(y_true, y_pred)
print("Scikit-Learn Confusion Matrix:\\n", cm)
print("\\nLaporan Klasifikasi:\\n", classification_report(y_true, y_pred, zero_division=0))`,
    diagCode: `import matplotlib.pyplot as plt
import seaborn as sns

def plot_confusion_matrix(cm, labels=['Negatif', 'Positif']):
    fig, ax = plt.subplots(figsize=(5, 4))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels, ax=ax)
    ax.set_xlabel('Prediksi Model')
    ax.set_ylabel('Ground Truth')
    ax.set_title('Diagnostik Matriks Kontingensi')
    plt.tight_layout()
    return fig`,
    caseStudy: "Pada sistem otorisasi kartu kredit dengan rasio transaksi penipuan 0.05%, penggunaan akurasi sebagai metrik optimasi model ensemble menyebabkan model meloloskan seluruh fraudulent charge dan mengakibatkan kerugian finansial jutaan dolar.",
    commonPitfalls: [
      "Menggunakan default accuracy_score pada dataset dengan rasio ketimpangan kelas lebih besar dari 1:10.",
      "Mengabaikan interpretasi biaya asimetris antara False Positive dan False Negative."
    ],
    groundingLinks: [
      { title: "Fawcett (2006) An Introduction to ROC Analysis", url: "https://doi.org/10.1016/j.patrec.2005.10.010", note: "Pondasi metrik evaluasi diskriminatif" },
      { title: "Scikit-Learn Classification Metrics", url: "https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics", note: "Dokumentasi resmi API" }
    ]
  }),

  createSubchapter({
    id: "ml-25-2-threshold-metrics",
    slug: "taksonomi-metrik-ambang-precision-recall-mcc",
    title: "25.2 Taksonomi Metrik Berbasis Ambang: Precision, Recall, Specificity, F-Beta Score, & Matthews Correlation Coefficient (MCC)",
    orderIndex: 2,
    description: "Formulasi matematis metrik berbasis nilai ambang probabilitas: Precision, Recall, Specificity, F-beta, serta superioritas matematis Matthews Correlation Coefficient.",
    theoryMarkdown: `Metrik berbasis ambang mengevaluasi partisi biner pada ambang batas keputusan $\\tau$ ($P(y=1|x) \\ge \\tau$):
1. **Precision (Positive Predictive Value)**:
   $$\\text{Precision} = \\frac{TP}{TP + FP}$$
2. **Recall (Sensitivitas / True Positive Rate)**:
   $$\\text{Recall} = \\frac{TP}{TP + FN}$$
3. **Specificity (True Negative Rate)**:
   $$\\text{Specificity} = \\frac{TN}{TN + FP}$$
4. **$F_\\beta$ Score (Harmonic Mean terbobot)**:
   $$F_\\beta = (1 + \\beta^2) \\frac{\\text{Precision} \\times \\text{Recall}}{\\beta^2 \\text{Precision} + \\text{Recall}}$$
   Bila $\\beta=1$, memberi bobot setara. Bila $\\beta=2$, memprioritaskan Recall dibanding Precision (kritis pada diagnosis medis).
5. **Matthews Correlation Coefficient (MCC)**:
   Koefisien korelasi Pearson antara variabel acak biner aktual dan prediksi:
   $$\\text{MCC} = \\frac{TP \\times TN - FP \\times FN}{\\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}} \\in [-1, +1]$$
   MCC bernilai $+1$ untuk prediksi sempurna, $0$ untuk prediksi setara tebakan acak, dan $-1$ untuk disinkronisasi total. Berbeda dengan $F_1$, MCC memperhitungkan keempat sel matriks konfusi secara proporsional.`,
    mermaidDiagram: `graph LR
    Prob["Skor Probabilitas P(y=1|x)"] --> Thresh{"Bandingkan dengan Ambang Tau"}
    Thresh -->|">= Tau"| Class1["Prediksi Kelas 1 (Positif)"]
    Thresh -->|"< Tau"| Class0["Prediksi Kelas 0 (Negatif)"]
    Class1 --> Calc["Hitung Precision, Recall, F-Beta, MCC"]
    Class0 --> Calc`,
    scratchCode: `import numpy as np

def compute_threshold_metrics(y_true, y_pred, beta=1.0):
    """Menghitung Precision, Recall, Specificity, F-beta, dan MCC dari scratch."""
    y_true = np.asarray(y_true, dtype=int)
    y_pred = np.asarray(y_pred, dtype=int)
    
    tp = np.sum((y_true == 1) & (y_pred == 1))
    fp = np.sum((y_true == 0) & (y_pred == 1))
    fn = np.sum((y_true == 1) & (y_pred == 0))
    tn = np.sum((y_true == 0) & (y_pred == 0))
    
    prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    spec = tn / (tn + fp) if (tn + fp) > 0 else 0.0
    
    beta_sq = beta ** 2
    f_beta = (1 + beta_sq) * (prec * rec) / (beta_sq * prec + rec) if (prec + rec) > 0 else 0.0
    
    denom = np.sqrt(float(tp + fp) * (tp + fn) * (tn + fp) * (tn + fn))
    mcc = (tp * tn - fp * fn) / denom if denom > 0 else 0.0
    
    return {"Precision": prec, "Recall": rec, "Specificity": spec, f"F_{beta}": f_beta, "MCC": mcc}

y_true = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
y_pred = [1, 1, 1, 0, 1, 0, 0, 0, 0, 0]
print(compute_threshold_metrics(y_true, y_pred, beta=2.0))`,
    sotaCode: `from sklearn.metrics import precision_score, recall_score, fbeta_score, matthews_corrcoef

y_true = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
y_pred = [1, 1, 1, 0, 1, 0, 0, 0, 0, 0]

metrics = {
    "Precision": precision_score(y_true, y_pred),
    "Recall": recall_score(y_true, y_pred),
    "F2-Score": fbeta_score(y_true, y_pred, beta=2.0),
    "MCC": matthews_corrcoef(y_true, y_pred)
}
for k, v in metrics.items():
    print(f"{k}: {v:.4f}")`,
    diagCode: `import numpy as np

def sweep_thresholds(y_true, y_probs, thresholds=np.linspace(0.01, 0.99, 50)):
    mcc_scores = []
    f1_scores = []
    for t in thresholds:
        preds = (y_probs >= t).astype(int)
        m = compute_threshold_metrics(y_true, preds)
        mcc_scores.append(m["MCC"])
        f1_scores.append(m["F_1.0"])
    return thresholds, mcc_scores, f1_scores`,
    caseStudy: "Chicco & Jurman (2020) membuktikan secara empiris bahwa pada ribuan eksperimen bioinformatika, F1-score dapat memberikan ilusi performa tinggi ketika TN diabaikan, sedangkan MCC secara konsisten menghukum prediksi bias.",
    commonPitfalls: [
      "Mengoptimalkan F1-score pada masalah di mana True Negatives memiliki implikasi operasional yang besar.",
      "Mengasumsikan ambang pemutus probabilitas selalu optimal pada default tau = 0.5."
    ],
    groundingLinks: [
      { title: "Chicco & Jurman (2020) The advantages of the Matthews correlation coefficient (MCC) over F1 score", url: "https://doi.org/10.1186/s12864-019-6413-7", note: "Analisis komparatif MCC vs F1" }
    ]
  }),

  createSubchapter({
    id: "ml-25-3-roc-curve",
    slug: "kurva-receiver-operating-characteristic-roc",
    title: "25.3 Kurva Receiver Operating Characteristic (ROC): Hubungan True Positive Rate vs False Positive Rate",
    orderIndex: 3,
    description: "Analisis geometris kurva ROC, pergeseran ambang diskriminasi, invarian terhadap prevalensi kelas, dan garis diagonal tebakan acak.",
    theoryMarkdown: `Kurva Receiver Operating Characteristic (ROC) memetakan pasangan metrik:
- Sumbu Y: $\\text{True Positive Rate (TPR)} = \\frac{TP}{TP + FN}$ (Sensitivitas)
- Sumbu X: $\\text{False Positive Rate (FPR)} = \\frac{FP}{FP + TN} = 1 - \\text{Spesifisitas}$

Setiap titik pada kurva ROC dibangkitkan dengan memvariasikan ambang keputusan $\\tau \\in [0, 1]$.
- Ketika $\\tau = 0$: Semua sampel diprediksi positif $\\implies TPR = 1, FPR = 1$ (titik kanan atas).
- Ketika $\\tau = 1$: Semua sampel diprediksi negatif $\\implies TPR = 0, FPR = 0$ (titik kiri bawah).
- Model sempurna melintasi titik $(0, 1)$ ($FPR=0, TPR=1$).
- Garis diagonal $y = x$ merepresentasikan performa pengklasifikasi acak (*chance line*).

**Sifat Kritis ROC**: Karena TPR dihitung hanya dari himpunan positif ($y=1$) dan FPR dihitung hanya dari himpunan negatif ($y=0$), kurva ROC bersifat **invarian terhadap perubahan prevalensi kelas** (distribusi marginal $P(y)$).`,
    mermaidDiagram: `graph LR
    Probs["Probabilitas Prediksi P(y=1|x)"] --> Sort["Urutkan Menurun Berdasarkan Skor"]
    Sort --> Sweep["Iterasi Ambang Batas Dari Max ke Min"]
    Sweep --> CalcPoints["Hitung Akumulasi (FPR, TPR)"]
    CalcPoints --> PlotROC["Plot Kurva Bidang 2D (FPR vs TPR)"]`,
    scratchCode: `import numpy as np

def compute_roc_curve_scratch(y_true, y_score):
    """Menghitung kurva ROC (FPR, TPR, Ambang) dari scratch."""
    y_true = np.asarray(y_true)
    y_score = np.asarray(y_score)
    
    # Urutkan berdasarkan skor prediksi menurun
    desc_idx = np.argsort(y_score)[::-1]
    y_true_sorted = y_true[desc_idx]
    y_score_sorted = y_score[desc_idx]
    
    distinct_value_indices = np.where(np.diff(y_score_sorted))[0]
    threshold_idxs = np.r_[distinct_value_indices, y_true.size - 1]
    
    tps = np.cumsum(y_true_sorted == 1)[threshold_idxs]
    fps = np.cumsum(y_true_sorted == 0)[threshold_idxs]
    
    total_pos = np.sum(y_true == 1)
    total_neg = np.sum(y_true == 0)
    
    tpr = np.r_[0, tps / total_pos]
    fpr = np.r_[0, fps / total_neg]
    thresholds = np.r_[y_score_sorted[0] + 1e-5, y_score_sorted[threshold_idxs]]
    
    return fpr, tpr, thresholds

y_true = np.array([1, 0, 1, 1, 0, 0, 1, 0])
y_score = np.array([0.9, 0.8, 0.7, 0.6, 0.4, 0.35, 0.2, 0.1])
fpr, tpr, thresh = compute_roc_curve_scratch(y_true, y_score)
print("FPR:", np.round(fpr, 3))
print("TPR:", np.round(tpr, 3))`,
    sotaCode: `from sklearn.metrics import roc_curve
import numpy as np

y_true = np.array([1, 0, 1, 1, 0, 0, 1, 0])
y_score = np.array([0.9, 0.8, 0.7, 0.6, 0.4, 0.35, 0.2, 0.1])

fpr, tpr, thresholds = roc_curve(y_true, y_score)
print("Scikit-Learn ROC FPR:", fpr)
print("Scikit-Learn ROC TPR:", tpr)`,
    diagCode: `import matplotlib.pyplot as plt

def plot_roc_curve(fpr, tpr):
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.plot(fpr, tpr, color='darkorange', lw=2, label='Model ROC')
    ax.plot([0, 1], [0, 1], color='navy', lw=1.5, linestyle='--', label='Garis Acak')
    ax.set_xlim([0.0, 1.0])
    ax.set_ylim([0.0, 1.05])
    ax.set_xlabel('False Positive Rate (1 - Spesifisitas)')
    ax.set_ylabel('True Positive Rate (Sensitivitas)')
    ax.set_title('Receiver Operating Characteristic')
    ax.legend(loc="lower right")
    ax.grid(alpha=0.3)
    return fig`,
    caseStudy: "Penerapan kurva ROC pada sistem radar militer dan deteksi sinyal medis awal membuktikan ketahanan metrik ini terhadap variasi populasi uji dari musim ke musim.",
    commonPitfalls: [
      "Mengira kurva ROC di bawah garis diagonal selalu gagal, padahal inversi keputusan $\\hat{y} = 1 - \\hat{y}$ menghasilkan kurva yang simetris di atas garis.",
      "Mengabaikan fakta bahwa kurva ROC dapat tampak optimis pada dataset dengan ketimpangan kelas yang sangat tinggi."
    ],
    groundingLinks: [
      { title: "Fawcett (2006) ROC Curve Analysis", url: "https://doi.org/10.1016/j.patrec.2005.10.010", note: "Paper acuan metode ROC" }
    ]
  }),

  createSubchapter({
    id: "ml-25-4-roc-auc",
    slug: "area-under-the-roc-curve-wilcoxon-mann-whitney",
    title: "25.4 Area Under the ROC Curve (ROC-AUC): Penafsiran Probabilitas Teorema Wilcoxon-Mann-Whitney",
    orderIndex: 4,
    description: "Formulasi integrasi luas kurva ROC (AUC), integrasi trapesium, dan pembuktian ekuivalensi matematis dengan statistik peringkat Wilcoxon-Mann-Whitney.",
    theoryMarkdown: `Luas area di bawah kurva ROC didefinisikan sebagai integral Riemann:
$$\\text{ROC-AUC} = \\int_0^1 \\text{TPR}(\\text{FPR}) \\, d\\text{FPR}$$

**Teorema Ekuivalensi Wilcoxon-Mann-Whitney**:
ROC-AUC ekuivalen secara eksak dengan probabilitas bahwa pengklasifikasi memberikan peringkat skor yang lebih tinggi pada sampel positif yang diambil secara acak ($X^+$) dibandingkan sampel negatif yang diambil secara acak ($X^-$):
$$\\text{ROC-AUC} = P(S(X^+) > S(X^-)) + \\frac{1}{2} P(S(X^+) = S(X^-))$$

Secara empiris dihitung sebagai:
$$\\text{AUC} = \\frac{1}{n^+ n^-} \\sum_{i=1}^{n^+} \\sum_{j=1}^{n^-} \\mathbb{I}(s_i^+ > s_j^-) + \\frac{1}{2} \\mathbb{I}(s_i^+ = s_j^-)$$
di mana $n^+$ dan $n^-$ masing-masing adalah jumlah sampel kelas positif dan negatif.
- $\\text{AUC} = 1.0$: Separasi deterministik sempurna.
- $\\text{AUC} = 0.5$: Daya diskriminatif setara dengan pelemparan koin seimbang.`,
    mermaidDiagram: `graph TD
    Data["Pasangan Sampel Positif & Negatif"] --> Comp["Bandingkan Skor: S(X+) vs S(X-)"]
    Comp -->|S(X+) > S(X-)| Score1["Beri Nilai 1.0"]
    Comp -->|S(X+) == S(X-)| ScoreHalf["Beri Nilai 0.5"]
    Comp -->|S(X+) < S(X-)| Score0["Beri Nilai 0.0"]
    Score1 --> Mean["Rata-rata Akumulatif = ROC-AUC (Wilcoxon)"]
    ScoreHalf --> Mean
    Score0 --> Mean`,
    scratchCode: `import numpy as np

def compute_roc_auc_trapezoidal(fpr, tpr):
    """Integrasi numerik aturan trapesium untuk menghitung ROC-AUC."""
    # Pastikan urutan FPR menaik
    order = np.argsort(fpr)
    fpr_sorted = fpr[order]
    tpr_sorted = tpr[order]
    return np.trapz(tpr_sorted, fpr_sorted)

def compute_roc_auc_wilcoxon(y_true, y_score):
    """Kalkulasi ROC-AUC via probabilitas peringkat pasangan Mann-Whitney U."""
    y_true = np.asarray(y_true)
    y_score = np.asarray(y_score)
    
    pos_scores = y_score[y_true == 1]
    neg_scores = y_score[y_true == 0]
    
    n_pos = len(pos_scores)
    n_neg = len(neg_scores)
    
    # Perbandingan pairwise matriks
    diff_matrix = pos_scores[:, None] - neg_scores[None, :]
    concordant = np.sum(diff_matrix > 0)
    ties = np.sum(diff_matrix == 0)
    
    auc = (concordant + 0.5 * ties) / (n_pos * n_neg)
    return auc

y_true = np.array([1, 0, 1, 1, 0, 0, 1, 0])
y_score = np.array([0.9, 0.8, 0.7, 0.6, 0.4, 0.35, 0.2, 0.1])
auc_wmw = compute_roc_auc_wilcoxon(y_true, y_score)
print(f"ROC-AUC via Wilcoxon-Mann-Whitney: {auc_wmw:.4f}")`,
    sotaCode: `from sklearn.metrics import roc_auc_score
import numpy as np

y_true = np.array([1, 0, 1, 1, 0, 0, 1, 0])
y_score = np.array([0.9, 0.8, 0.7, 0.6, 0.4, 0.35, 0.2, 0.1])

auc_sklearn = roc_auc_score(y_true, y_score)
print(f"Scikit-Learn ROC-AUC: {auc_sklearn:.4f}")`,
    diagCode: `def verify_auc_bounds(auc):
    assert 0.0 <= auc <= 1.0, "AUC harus berada dalam interval [0, 1]"
    return "Valid" if auc >= 0.5 else "Inverted Discriminator (AUC < 0.5)"`,
    caseStudy: "Dalam kompetisi Kaggle memprediksi risiko gagal bayar kredit (Home Credit Default Risk), skor ROC-AUC digunakan karena tidak sensitif terhadap rasio pelamar default yang berfluktuasi.",
    commonPitfalls: [
      "Menginputkan label biner diskrit [0, 1] ke roc_auc_score alih-alih skor probabilitas kontinu.",
      "Mengasumsikan ROC-AUC 0.90 menjamin model beroperasi dengan presisi tinggi pada skenario ketimpangan ekstrem."
    ],
    groundingLinks: [
      { title: "Hanley & McNeil (1982) The meaning and use of the area under a ROC curve", url: "https://doi.org/10.1148/radiology.143.1.7063747", note: "Makalah seminal pembuktian Wilcoxon-Mann-Whitney" }
    ]
  }),

  createSubchapter({
    id: "ml-25-5-pr-auc",
    slug: "kurva-precision-recall-dan-average-precision",
    title: "25.5 Kurva Precision-Recall (PR-AUC) & Average Precision: Standar Emas untuk Masalah Ketimpangan Kelas Ekstrem",
    orderIndex: 5,
    description: "Superioritas Precision-Recall pada dataset imbalanced, penurunan Average Precision (AP), dan perbandingan kritis dengan kurva ROC.",
    theoryMarkdown: `Pada dataset dengan rasio ketimpangan ekstrem ($n^- \\gg n^+$), penambahan True Negatives dalam jumlah besar menyebabkan nilai FPR tetap sangat kecil meskipun terdapat banyak False Positives:
$$\\text{FPR} = \\frac{FP}{FP + TN} \\approx 0 \\quad (\\text{karena } TN \\to \\infty)$$
Hal ini menyebabkan kurva ROC terlihat optimis semu (*falsely optimistic*).

Kurva Precision-Recall mengabaikan True Negatives murni dan hanya berfokus pada kelas minoritas:
- Sumbu Y: $\\text{Precision} = \\frac{TP}{TP + FP}$
- Sumbu X: $\\text{Recall} = \\frac{TP}{TP + FN}$

**Average Precision (AP)** dihitung sebagai luas kurva PR menggunakan interpolasi nilai ambang diskrit:
$$\\text{AP} = \\sum_k (R_k - R_{k-1}) P_k$$
Baseline dari kurva PR untuk model acak bukanlah $0.5$, melainkan prevalensi kelas positif:
$$\\text{Baseline PR} = \\frac{n^+}{n^+ + n^-}$$`,
    mermaidDiagram: `graph TD
    Imbalance["Ketimpangan Kelas Ekstrem (1:1000)"] --> EvaluasiROC["Kurva ROC: Terdistorsi Oleh TN yang Masif (FPR Sangat Rendah)"]
    Imbalance --> EvaluasiPR["Kurva PR: Mengisolasi TP, FP, FN Tanpa Dipengaruhi TN"]
    EvaluasiPR --> StandarEmas["Menjadi Standar Emas Evaluasi Fraud & Rare Diseases"]`,
    scratchCode: `import numpy as np

def compute_precision_recall_curve_scratch(y_true, y_score):
    """Menghitung kurva Precision-Recall dan Average Precision dari scratch."""
    y_true = np.asarray(y_true)
    y_score = np.asarray(y_score)
    
    desc_idx = np.argsort(y_score)[::-1]
    y_true_sorted = y_true[desc_idx]
    y_score_sorted = y_score[desc_idx]
    
    tps = np.cumsum(y_true_sorted == 1)
    fps = np.cumsum(y_true_sorted == 0)
    
    precision = tps / (tps + fps)
    recall = tps / np.sum(y_true == 1)
    
    # Tambahkan titik awal
    precision = np.r_[1.0, precision]
    recall = np.r_[0.0, recall]
    
    # Average Precision via Riemann step
    ap = np.sum((recall[1:] - recall[:-1]) * precision[1:])
    return precision, recall, ap

y_true = np.array([0]*90 + [1]*10)
y_score = np.random.RandomState(42).beta(0.5, 2.0, size=100)
y_score[y_true == 1] += 0.4
y_score = np.clip(y_score, 0, 1)

prec, rec, ap = compute_precision_recall_curve_scratch(y_true, y_score)
print(f"Average Precision (AP) Scratch: {ap:.4f}")`,
    sotaCode: `from sklearn.metrics import precision_recall_curve, average_precision_score
import numpy as np

y_true = np.array([0]*90 + [1]*10)
y_score = np.random.RandomState(42).beta(0.5, 2.0, size=100)
y_score[y_true == 1] += 0.4

prec, rec, _ = precision_recall_curve(y_true, y_score)
ap_sklearn = average_precision_score(y_true, y_score)
print(f"Scikit-Learn Average Precision: {ap_sklearn:.4f}")`,
    diagCode: `import matplotlib.pyplot as plt

def plot_pr_curve(rec, prec, baseline):
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.plot(rec, prec, color='teal', lw=2, label='Model PR Curve')
    ax.axhline(y=baseline, color='crimson', linestyle='--', label=f'Chance Baseline ({baseline:.3f})')
    ax.set_xlabel('Recall')
    ax.set_ylabel('Precision')
    ax.set_title('Precision-Recall Curve Under Extreme Imbalance')
    ax.legend()
    ax.grid(alpha=0.3)
    return fig`,
    caseStudy: "Davis & Goadrich (2006) membuktikan bahwa algoritma yang mendominasi ruang ROC belum tentu mendominasi ruang PR, menjadikannya metrik wajib pada deteksi intrusi jaringan (cybersecurity) dan diagnosis kanker stadium awal.",
    commonPitfalls: [
      "Menginterpolasi kurva PR secara linier di antara titik-titik diskrit, padahal kurva PR bergerak secara non-linier.",
      "Membandingkan PR-AUC dengan threshold 0.5 tanpa memeriksa prevalensi kelas positif aktual."
    ],
    groundingLinks: [
      { title: "Davis & Goadrich (2006) The Relationship Between Precision-Recall and ROC Curves", url: "https://doi.org/10.1145/1143844.1143874", note: "Analisis teoretis ruang PR vs ROC" }
    ]
  }),

  createSubchapter({
    id: "ml-25-6-probability-calibration",
    slug: "kalibrasi-probabilitas-reliability-diagram-brier-score",
    title: "25.6 Kalibrasi Probabilitas Model: Kurva Kalibrasi (Reliability Diagram), Brier Score, Platt Scaling, & Isotonic Regression",
    orderIndex: 6,
    description: "Evaluasi fidelitas probabilitas prediksi: Diagram Keandalan (Reliability Diagram), metrik Brier Score, dan kalibrasi pasca-pelatihan via Platt Scaling dan Isotonic Regression.",
    theoryMarkdown: `Model pengklasifikasi dikatakan terkalibrasi secara sempurna jika probabilitas prediksi $p = P(\\hat{y}=1|X)$ mencerminkan frekuensi empiris jangka panjang:
$$P(y = 1 \\mid P(\\hat{y}=1|X) = p) = p, \\quad \\forall p \\in [0, 1]$$

1. **Brier Score**:
   Rata-rata kuadrat deviasi antara probabilitas terprediksi $p_i$ dan label biner aktual $y_i$:
   $$\\text{BS} = \\frac{1}{N} \\sum_{i=1}^N (p_i - y_i)^2 \\in [0, 1]$$
   Brier Score dapat didekomposisi menjadi:
   $$\\text{BS} = \\text{Reliability} - \\text{Resolution} + \\text{Uncertainty}$$

2. **Metode Kalibrasi Pasca-Pelatihan**:
   - **Platt Scaling**: Memasang regresi logistik univariat terhadap logit model mentah $f(x)$:
     $$\\hat{P}(y=1|x) = \\frac{1}{1 + \\exp(A f(x) + B)}$$
   - **Isotonic Regression**: Pendekatan non-parametrik yang memasang fungsi tangga monotonik tidak menurun menggunakan algoritma *Pool Adjacent Violators* (PAV). Cocok untuk data besar dengan distorsi non-sigmoid.`,
    mermaidDiagram: `graph LR
    RawOutput["Output Mentah Model (SVM Distance / Tree Margin)"] --> CalibMethod{"Pilih Metode Kalibrasi"}
    CalibMethod -->|Data Kecil / Sigmoidal| Platt["Platt Scaling: Regresi Logistik Univariat"]
    CalibMethod -->|Data Besar / Arbitrer| Iso["Isotonic Regression: Fungsi Tangga Monoton (PAV)"]
    Platt --> Calibrated["Probabilitas Terkalibrasi P(y=1|x)"]
    Iso --> Calibrated
    Calibrated --> Eval["Evaluasi via Brier Score & Reliability Diagram"]`,
    scratchCode: `import numpy as np

def compute_brier_score(y_true, y_prob):
    """Menghitung Brier Score dari scratch."""
    y_true = np.asarray(y_true, dtype=float)
    y_prob = np.asarray(y_prob, dtype=float)
    return np.mean((y_prob - y_true) ** 2)

def compute_calibration_curve_scratch(y_true, y_prob, n_bins=5):
    """Menghitung reliability diagram data points (frekuensi empiris vs keyakinan rata-rata)."""
    bins = np.linspace(0.0, 1.0, n_bins + 1)
    binids = np.digitize(y_prob, bins) - 1
    binids = np.clip(binids, 0, n_bins - 1)
    
    bin_true = np.zeros(n_bins)
    bin_pred = np.zeros(n_bins)
    
    for i in range(n_bins):
        mask = binids == i
        if np.any(mask):
            bin_true[i] = np.mean(y_true[mask])
            bin_pred[i] = np.mean(y_prob[mask])
        else:
            bin_true[i] = np.nan
            bin_pred[i] = np.nan
            
    valid = ~np.isnan(bin_true)
    return bin_true[valid], bin_pred[valid]

y_true = np.array([0, 0, 0, 1, 1, 1, 0, 1])
y_prob = np.array([0.1, 0.2, 0.35, 0.65, 0.7, 0.85, 0.4, 0.9])
print("Brier Score Scratch:", compute_brier_score(y_true, y_prob))
f_true, f_pred = compute_calibration_curve_scratch(y_true, y_prob, n_bins=3)
print("Empirical Frequency:", f_true)
print("Mean Confidence:", f_pred)`,
    sotaCode: `from sklearn.calibration import calibration_curve, CalibratedClassifierCV
from sklearn.svm import LinearSVC
from sklearn.datasets import make_classification
from sklearn.metrics import brier_score_loss

X, y = make_classification(n_samples=1000, n_features=10, random_state=42)
base_clf = LinearSVC(random_state=42)
calibrated_clf = CalibratedClassifierCV(base_clf, method='sigmoid', cv=3)

calibrated_clf.fit(X, y)
probs = calibrated_clf.predict_proba(X)[:, 1]

prob_true, prob_pred = calibration_curve(y, probs, n_bins=10)
print(f"Brier Score Pasca-Kalibrasi: {brier_score_loss(y, probs):.4f}")`,
    diagCode: `import matplotlib.pyplot as plt

def plot_calibration_curve(prob_true, prob_pred):
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.plot(prob_pred, prob_true, marker='o', lw=2, label='Model Terkalibrasi')
    ax.plot([0, 1], [0, 1], linestyle='--', color='gray', label='Sempurna Terkalibrasi')
    ax.set_xlabel('Rata-rata Prediksi Probabilitas')
    ax.set_ylabel('Fraksi Positif Sebenarnya')
    ax.set_title('Reliability Diagram')
    ax.legend()
    ax.grid(alpha=0.3)
    return fig`,
    caseStudy: "Dalam penetapan harga asuransi otomatis dan pengambilan keputusan klinis medis, nilai keyakinan (confidence) harus menjadi probabilitas sejati agar estimasi ekspektasi kerugian moneter atau dosis obat valid.",
    commonPitfalls: [
      "Mengasumsikan output .predict_proba() dari Naive Bayes atau Random Forest selalu terkalibrasi secara alami.",
      "Melakukan kalibrasi Platt Scaling pada data training yang sama dengan pelatihan model (menyebabkan overfitting kalibrasi)."
    ],
    groundingLinks: [
      { title: "Niculescu-Mizil & Caruana (2005) Predicting Good Probabilities With Supervised Learning", url: "https://doi.org/10.1145/1102351.1102430", note: "Studi empiris kalibrasi berbagai algoritma ML" }
    ]
  })
];

const ch25 = {
  id: "machine-learning-ch-25",
  title: "Bab 25: Metrologi Evaluasi & Metrik Klasifikasi Asimetris",
  slug: "metrologi-evaluasi-klasifikasi-asimetris",
  orderIndex: 25,
  description: "Matriks konfusi formal, batas metrik akurasi pada data miring, Precision, Recall, Specificity, F-beta, Matthews Correlation Coefficient (MCC), kurva ROC, pembuktian Wilcoxon-Mann-Whitney ROC-AUC, kurva Precision-Recall (PR-AUC), dan kalibrasi probabilitas Brier Score / Reliability Diagram.",
  subchapters: ch25Subchapters
};

fs.writeFileSync(path.join(OUT_DIR, 'chunk6-ch25.ts'), exportChapterTs(ch25, 'chapter25'));
console.log('Successfully generated chunk6-ch25.ts (6 subchapters)');

// ==========================================
// CHAPTER 26: Metrologi Evaluasi Regresi & Klusterisasi
// ==========================================
const ch26Subchapters = [
  createSubchapter({
    id: "ml-26-1-regression-scale-dependent",
    slug: "metrik-galat-regresi-skala-dependen-mse-rmse-mae",
    title: "26.1 Metrik Galat Regresi Skala Dependen: Mean Squared Error (MSE), Root MSE (RMSE), & Mean Absolute Error (MAE)",
    orderIndex: 1,
    description: "Analisis matematis metrik regresi dependen skala: Mean Squared Error, Root MSE, Mean Absolute Error, fungsi loss L1 vs L2, dan sensitivitas terhadap outlier.",
    theoryMarkdown: `Diberikan vektor target aktual $\\mathbf{y} \\in \\mathbb{R}^N$ dan vektor prediksi model $\\mathbf{\\hat{y}} \\in \\mathbb{R}^N$, vektor residual galat didefinisikan sebagai $e_i = y_i - \\hat{y}_i$.
1. **Mean Squared Error (MSE)**:
   $$\\text{MSE} = \\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2$$
   MSE mendiferensiasi penalti secara kuadratik, memberikan hukuman eksponensial terhadap residual besar.
2. **Root Mean Squared Error (RMSE)**:
   $$\\text{RMSE} = \\sqrt{\\text{MSE}} = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2}$$
   Memiliki satuan fisik yang sama dengan variabel target, memudahkan interpretasi domain teknis.
3. **Mean Absolute Error (MAE)**:
   $$\\text{MAE} = \\frac{1}{N} \\sum_{i=1}^N |y_i - \\hat{y}_i|$$
   MAE merepresentasikan penalti norma $L_1$, menghasilkan estimasi rata-rata yang lebih tahan (*robust*) terhadap outlier pencilan ekstrem.`,
    mermaidDiagram: `graph TD
    Residual["Residual Galat e_i = y_i - y_hat_i"] --> L2Loss["Penalti L2: e_i^2 (Sensitif Terhadap Outlier)"]
    Residual --> L1Loss["Penalti L1: |e_i| (Robust Terhadap Outlier)"]
    L2Loss --> MSE["MSE & RMSE (Satuan Asli Data)"]
    L1Loss --> MAE["MAE (Deviasi Median Absolut)"]`,
    scratchCode: `import numpy as np

def compute_regression_scale_metrics(y_true, y_pred):
    """Kalkulasi MSE, RMSE, dan MAE dari scratch."""
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    
    residuals = y_true - y_pred
    mse = np.mean(residuals ** 2)
    rmse = np.sqrt(mse)
    mae = np.mean(np.abs(residuals))
    
    return {"MSE": mse, "RMSE": rmse, "MAE": mae}

y_true = np.array([10.0, 15.0, 12.0, 18.0, 100.0]) # Outlier 100
y_pred = np.array([11.0, 14.0, 13.0, 17.0, 20.0])
print(compute_regression_scale_metrics(y_true, y_pred))`,
    sotaCode: `from sklearn.metrics import mean_squared_error, mean_absolute_error
import numpy as np

y_true = np.array([10.0, 15.0, 12.0, 18.0, 100.0])
y_pred = np.array([11.0, 14.0, 13.0, 17.0, 20.0])

mse = mean_squared_error(y_true, y_pred)
rmse = mean_squared_error(y_true, y_pred, squared=False)
mae = mean_absolute_error(y_true, y_pred)
print(f"Scikit-Learn MSE: {mse:.4f}, RMSE: {rmse:.4f}, MAE: {mae:.4f}")`,
    diagCode: `def evaluate_outlier_impact(residuals):
    l2_weight = residuals ** 2
    l1_weight = np.abs(residuals)
    ratio = np.max(l2_weight) / np.sum(l2_weight)
    return {"Max_L2_Influence_Ratio": ratio, "Dominant_Outlier": ratio > 0.5}`,
    caseStudy: "Dalam estimasi valuasi real estate, penggunaan RMSE sering kali mendistorsi evaluasi model akibat beberapa transaksi mansion mewah yang langka, sehingga industri beralih ke MAE atau Huber loss.",
    commonPitfalls: [
      "Mengasumsikan model dengan RMSE lebih rendah selalu lebih baik secara operasional dibanding model dengan MAE lebih rendah.",
      "Membandingkan nilai RMSE antar dataset dengan skala unit yang berbeda tanpa normalisasi."
    ],
    groundingLinks: [
      { title: "Scikit-Learn Regression Metrics", url: "https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics", note: "Dokumentasi metrik regresi resmi" }
    ]
  }),

  createSubchapter({
    id: "ml-26-2-robust-relative-metrics",
    slug: "metrik-galat-robust-relatif-medae-mape-r2",
    title: "26.2 Metrik Galat Robust & Relatif: Median Absolute Error (MedAE), MAPE, Huber Loss, & Koefisien Determinasi R^2 / Adjusted R^2",
    orderIndex: 2,
    description: "Analisis metrik regresi relatif dan robust: Median Absolute Error, Mean Absolute Percentage Error, Huber Loss, serta dekomposisi koefisien determinasi R^2 dan Adjusted R^2.",
    theoryMarkdown: `1. **Median Absolute Error (MedAE)**:
   $$\\text{MedAE} = \\text{median}(|y_1 - \\hat{y}_1|, \\dots, |y_N - \\hat{y}_N|)$$
   Metrik paling robust karena titik singular ekstrem tidak mempengaruhi median hingga persentil 50% data tercemar.
2. **Mean Absolute Percentage Error (MAPE)**:
   $$\\text{MAPE} = \\frac{100\\%}{N} \\sum_{i=1}^N \\left| \\frac{y_i - \\hat{y}_i}{y_i} \\right|$$
   Sensitif terhadap $y_i \\to 0$ (pembagian dengan nol atau nilai mendekati nol).
3. **Koefisien Determinasi ($R^2$)**:
   Proporsi varians target yang berhasil dijelaskan oleh fitur model:
   $$R^2 = 1 - \\frac{SS_{\\text{res}}}{SS_{\\text{tot}}} = 1 - \\frac{\\sum_{i=1}^N (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^N (y_i - \\bar{y})^2}$$
   Jika model berkinerja lebih buruk daripada rata-rata horizontal $\\bar{y}$, $R^2 < 0$.
4. **Adjusted $R^2$**:
   Koreksi terhadap penambahan fitur non-informatif:
   $$R^2_{\\text{adj}} = 1 - (1 - R^2) \\frac{N - 1}{N - p - 1}$$
   di mana $p$ adalah jumlah parameter/fitur. Menghukum *overfitting* dimensional.`,
    mermaidDiagram: `graph LR
    SST["Varians Total SS_tot = sum (y_i - y_mean)^2"] --> Comp["Bandingkan dengan"]
    SSR["Varians Residual SS_res = sum (y_i - y_hat_i)^2"] --> Comp
    Comp --> R2["R^2 = 1 - (SS_res / SS_tot)"]
    R2 --> Adj["Penalti Derajat Kebebasan -> Adjusted R^2"]`,
    scratchCode: `import numpy as np

def compute_relative_robust_metrics(y_true, y_pred, p_features=1):
    """Menghitung MedAE, MAPE, R2, dan Adjusted R2 dari scratch."""
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    n = len(y_true)
    
    medae = np.median(np.abs(y_true - y_pred))
    
    non_zero = y_true != 0
    mape = np.mean(np.abs((y_true[non_zero] - y_pred[non_zero]) / y_true[non_zero])) * 100.0
    
    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
    r2 = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 0.0
    
    r2_adj = 1.0 - (1.0 - r2) * (n - 1) / (n - p_features - 1) if (n - p_features - 1) > 0 else r2
    return {"MedAE": medae, "MAPE(%)": mape, "R2": r2, "Adjusted_R2": r2_adj}

y_true = np.array([10.0, 20.0, 30.0, 40.0, 50.0])
y_pred = np.array([9.5, 21.0, 29.0, 41.5, 48.0])
print(compute_relative_robust_metrics(y_true, y_pred, p_features=2))`,
    sotaCode: `from sklearn.metrics import median_absolute_error, mean_absolute_percentage_error, r2_score
import numpy as np

y_true = np.array([10.0, 20.0, 30.0, 40.0, 50.0])
y_pred = np.array([9.5, 21.0, 29.0, 41.5, 48.0])

print("Scikit-Learn MedAE:", median_absolute_error(y_true, y_pred))
print("Scikit-Learn MAPE:", mean_absolute_percentage_error(y_true, y_pred) * 100)
print("Scikit-Learn R2:", r2_score(y_true, y_pred))`,
    diagCode: `def diagnose_r2(r2):
    if r2 < 0:
        return "Model lebih buruk daripada baseline rata-rata sederhana!"
    elif r2 > 0.99:
        return "Peringatan kemungkinan data leakage atau overfitting ekstrem."
    return "Rentang R2 normal."`,
    caseStudy: "Dalam peramalan beban konsumsi listrik (smart grid load forecasting), MAPE digunakan secara luas oleh manajer energi karena memberikan persentase galat langsung yang dapat dikonversikan ke kapasitas cadangan pembangkit.",
    commonPitfalls: [
      "Menggunakan MAPE pada data yang mengandung nilai nol, menghasilkan pembagian tak terhingga (ZeroDivisionError).",
      "Mengasumsikan R2 tinggi selalu berarti model linier cocok secara struktural tanpa memeriksa grafik plot residual."
    ],
    groundingLinks: [
      { title: "Greene Econometric Analysis", url: "https://www.statlearning.com/", note: "Analisis statistik R2 dan uji signifikansi" }
    ]
  }),

  createSubchapter({
    id: "ml-26-3-silhouette-coefficient",
    slug: "evaluasi-klusterisasi-internal-silhouette-coefficient",
    title: "26.3 Evaluasi Klusterisasi Internal: Silhouette Coefficient (Kohesi a(i) vs Separasi b(i)) & Visualisasi Silhouette Plot",
    orderIndex: 3,
    description: "Evaluasi kualitas kluster tanpa label eksternal: Penurunan matematis Kohesi a(i), Separasi b(i), Silhouette Score sampel individual, dan interpretasi visual grafik siluet.",
    theoryMarkdown: `Koefisien Siluet (*Silhouette Coefficient*) mengevaluasi seberapa rapat titik terhadap klusternya sendiri (*kohesi*) dibandingkan jaraknya terhadap kluster tetangga terdekat (*separasi*).

Untuk setiap sampel $i$:
1. **Kohesi $a(i)$**: Jarak rata-rata sampel $i$ ke seluruh titik lain di dalam kluster yang sama $C_I$:
   $$a(i) = \\frac{1}{|C_I| - 1} \\sum_{j \\in C_I, j \\neq i} d(i, j)$$
2. **Separasi $b(i)$**: Jarak rata-rata terkecil dari sampel $i$ ke kluster lain selain $C_I$:
   $$b(i) = \\min_{J \\neq I} \\frac{1}{|C_J|} \\sum_{j \\in C_J} d(i, j)$$
3. **Koefisien Siluet Sampel $s(i)$**:
   $$s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))} \\in [-1, +1]$$
   - $s(i) \\approx +1$: Sampel terklusterisasi dengan sangat baik ($a(i) \\ll b(i)$).
   - $s(i) \\approx 0$: Sampel berada tepat di perbatasan dua kluster.
   - $s(i) < 0$: Sampel lebih dekat ke kluster tetangga daripada klusternya sendiri (salah penugasan).`,
    mermaidDiagram: `graph TD
    Point["Titik Sampel i"] --> Intra["Hitung Jarak Rata-rata Intra-Kluster: a(i)"]
    Point --> Inter["Hitung Jarak Rata-rata Inter-Kluster Terdekat: b(i)"]
    Intra --> Formula["s(i) = (b(i) - a(i)) / max(a(i), b(i))"]
    Inter --> Formula
    Formula --> Global["Silhouette Score Rata-rata Keseluruhan Dataset"]`,
    scratchCode: `import numpy as np
from scipy.spatial.distance import cdist

def compute_silhouette_scratch(X, labels):
    """Menghitung Silhouette Score rata-rata dan per-sampel dari scratch."""
    n_samples = len(X)
    unique_labels = np.unique(labels)
    if len(unique_labels) <= 1:
        return 0.0, np.zeros(n_samples)
        
    dist_matrix = cdist(X, X, metric='euclidean')
    s_scores = np.zeros(n_samples)
    
    for i in range(n_samples):
        own_cluster = labels[i]
        own_mask = (labels == own_cluster)
        
        # Kohesi a(i)
        if np.sum(own_mask) > 1:
            a_i = np.sum(dist_matrix[i, own_mask]) / (np.sum(own_mask) - 1)
        else:
            a_i = 0.0
            
        # Separasi b(i)
        b_i = np.inf
        for other_cluster in unique_labels:
            if other_cluster == own_cluster:
                continue
            other_mask = (labels == other_cluster)
            mean_dist_other = np.mean(dist_matrix[i, other_mask])
            if mean_dist_other < b_i:
                b_i = mean_dist_other
                
        s_scores[i] = (b_i - a_i) / max(a_i, b_i) if max(a_i, b_i) > 0 else 0.0
        
    return np.mean(s_scores), s_scores

X = np.array([[1.0, 1.0], [1.2, 1.1], [10.0, 10.0], [10.2, 9.8]])
labels = np.array([0, 0, 1, 1])
mean_s, individual_s = compute_silhouette_scratch(X, labels)
print(f"Mean Silhouette Score Scratch: {mean_s:.4f}")`,
    sotaCode: `from sklearn.metrics import silhouette_score, silhouette_samples
import numpy as np

X = np.array([[1.0, 1.0], [1.2, 1.1], [10.0, 10.0], [10.2, 9.8]])
labels = np.array([0, 0, 1, 1])

score = silhouette_score(X, labels)
samples_score = silhouette_samples(X, labels)
print("Scikit-Learn Silhouette Score:", score)
print("Per-Sample Silhouette Scores:", samples_score)`,
    diagCode: `def check_cluster_balance(individual_s, labels):
    summary = {}
    for cl in np.unique(labels):
        summary[int(cl)] = float(np.mean(individual_s[labels == cl]))
    return summary`,
    caseStudy: "Rousseeuw (1987) memperkenalkan Silhouette plots untuk mendeteksi kluster artifisial; pada segmentasi pelanggan e-commerce, nilai siluet negatif segera mengungkap segmen palsu yang dipaksakan oleh K-Means.",
    commonPitfalls: [
      "Menggunakan Silhouette Coefficient pada kluster berbentuk non-konveks atau manifold melengkung (seperti DBSCAN/HDBSCAN), karena metrik ini mengasumsikan geometri Euclidean cembung.",
      "Kompleksitas memori $O(N^2)$ pada dataset berukuran jutaan baris."
    ],
    groundingLinks: [
      { title: "Rousseeuw (1987) Silhouettes Graphical Aid", url: "https://doi.org/10.1016/0377-0427(87)90125-7", note: "Paper asli pengenalan silhouette coefficient" }
    ]
  }),

  createSubchapter({
    id: "ml-26-4-cluster-dispersion-indices",
    slug: "indeks-dispersi-kluster-calinski-harabasz-davies-bouldin",
    title: "26.4 Indeks Dispersi Kluster: Rasio Calinski-Harabasz (Variance Ratio) & Indeks Davies-Bouldin (Similaritas Terburuk)",
    orderIndex: 4,
    description: "Formulasi analitis indeks dispersi kluster: Calinski-Harabasz Variance Ratio Criterion dan Davies-Bouldin Index berbasis kemiripan terburuk.",
    theoryMarkdown: `Dua metrik internal utama selain Siluet untuk evaluasi partisi kluster:

1. **Indeks Calinski-Harabasz (Variance Ratio Criterion)**:
   Rasio antara dispersi antar-kluster (*between-cluster variance*) dan dispersi dalam-kluster (*within-cluster variance*):
   $$\\text{CH} = \\frac{\\text{Tr}(B_k)}{\\text{Tr}(W_k)} \\times \\frac{N - k}{k - 1}$$
   di mana $B_k = \\sum_{q=1}^k n_q (c_q - c)(c_q - c)^T$ adalah matriks scatter antar kluster, dan $W_k = \\sum_{q=1}^k \\sum_{x \\in C_q} (x - c_q)(x - c_q)^T$ adalah matriks scatter dalam kluster.
   - **Kriteria**: Nilai $\\text{CH}$ yang **lebih tinggi** mengindikasikan kluster yang lebih padat dan terpisah secara tegas.

2. **Indeks Davies-Bouldin (DB)**:
   Rata-rata similaritas maksimum antara setiap kluster dengan kluster lain yang paling mirip dengannya:
   $$R_{ij} = \\frac{s_i + s_j}{d(c_i, c_j)}, \\quad \\text{DB} = \\frac{1}{k} \\sum_{i=1}^k \\max_{j \\neq i} R_{ij}$$
   di mana $s_i$ adalah diameter rata-rata kluster $i$ dan $d(c_i, c_j)$ adalah jarak Euclidean antar centroid.
   - **Kriteria**: Nilai $\\text{DB}$ yang **lebih rendah** (mendekati 0) mengindikasikan partisi kluster yang lebih optimal.`,
    mermaidDiagram: `graph LR
    Scatter["Matriks Scatter"] --> Wk["Within-Cluster W_k (Kepadatan)"]
    Scatter --> Bk["Between-Cluster B_k (Separasi)"]
    Wk --> CH["Calinski-Harabasz: Tr(B_k)/Tr(W_k) -> Semakin Besar Semakin Baik"]
    Bk --> CH
    Wk --> DB["Davies-Bouldin: (s_i + s_j)/d(c_i, c_j) -> Semakin Kecil Semakin Baik"]`,
    scratchCode: `import numpy as np

def compute_ch_db_scratch(X, labels):
    """Menghitung Calinski-Harabasz dan Davies-Bouldin dari scratch."""
    n_samples, n_features = X.shape
    unique_labels = np.unique(labels)
    k = len(unique_labels)
    
    if k <= 1 or k >= n_samples:
        return {"CH": 0.0, "DB": 0.0}
        
    global_centroid = np.mean(X, axis=0)
    centroids = np.array([np.mean(X[labels == cl], axis=0) for cl in unique_labels])
    cluster_sizes = np.array([np.sum(labels == cl) for cl in unique_labels])
    
    # 1. Calinski-Harabasz
    ssb = np.sum([cluster_sizes[i] * np.sum((centroids[i] - global_centroid)**2) for i in range(k)])
    ssw = np.sum([np.sum((X[labels == unique_labels[i]] - centroids[i])**2) for i in range(k)])
    ch_score = (ssb / ssw) * ((n_samples - k) / (k - 1)) if ssw > 0 else 0.0
    
    # 2. Davies-Bouldin
    s = np.array([np.mean(np.linalg.norm(X[labels == unique_labels[i]] - centroids[i], axis=1)) for i in range(k)])
    r_matrix = np.zeros((k, k))
    for i in range(k):
        for j in range(k):
            if i != j:
                dist_centers = np.linalg.norm(centroids[i] - centroids[j])
                r_matrix[i, j] = (s[i] + s[j]) / dist_centers if dist_centers > 0 else 0.0
                
    db_score = np.mean(np.max(r_matrix, axis=1))
    return {"Calinski_Harabasz": ch_score, "Davies_Bouldin": db_score}

X = np.array([[1.0, 1.0], [1.2, 1.1], [10.0, 10.0], [10.2, 9.8]])
labels = np.array([0, 0, 1, 1])
print(compute_ch_db_scratch(X, labels))`,
    sotaCode: `from sklearn.metrics import calinski_harabasz_score, davies_bouldin_score
import numpy as np

X = np.array([[1.0, 1.0], [1.2, 1.1], [10.0, 10.0], [10.2, 9.8]])
labels = np.array([0, 0, 1, 1])

ch = calinski_harabasz_score(X, labels)
db = davies_bouldin_score(X, labels)
print(f"Scikit-Learn CH Score: {ch:.4f}")
print(f"Scikit-Learn DB Score: {db:.4f}")`,
    diagCode: `def verify_cluster_indices(ch, db):
    return {"Status": "Valid", "Interpretation": "Evaluasi relatif terhadap k lain"}`,
    caseStudy: "Pada penentuan nilai k optimal untuk segmentasi data genomik skala besar, Calinski-Harabasz dihitung jauh lebih cepat ($O(N)$) dibandingkan Silhouette ($O(N^2)$).",
    commonPitfalls: [
      "Mengandalkan hanya satu metrik (misal hanya DB) tanpa memvalidasi secara visual atau menggunakan kriteria konsensus.",
      "Mengasumsikan skor CH bernilai mutlak yang dapat dibandingkan antar dataset yang berbeda."
    ],
    groundingLinks: [
      { title: "Davies & Bouldin (1979) A Cluster Separation Measure", url: "https://doi.org/10.1109/TPAMI.1979.4766909", note: "Makalah seminal indeks Davies-Bouldin" }
    ]
  }),

  createSubchapter({
    id: "ml-26-5-external-clustering-metrics",
    slug: "evaluasi-klusterisasi-eksternal-ari-dan-nmi",
    title: "26.5 Evaluasi Klusterisasi Eksternal (Ground Truth Valid): Adjusted Rand Index (ARI) & Normalized Mutual Information (NMI)",
    orderIndex: 5,
    description: "Evaluasi klusterisasi terhadap label acuan sejati: Penurunan teoretis Adjusted Rand Index (ARI), koreksi peluang acak, dan Normalized Mutual Information (NMI).",
    theoryMarkdown: `Ketika label kebenaran dasar (*ground truth*) tersedia untuk validasi benchmark, evaluasi tidak bergantung pada metrik jarak geometris, melainkan pada teori kombinatorial kesepakatan pasangan partisi.

1. **Adjusted Rand Index (ARI)**:
   Diberikan partisi ground truth $U = \\{u_1, \\dots, u_R\\}$ dan partisi hasil kluster $V = \\{v_1, \\dots, v_C\\}$. Rand Index (RI) menghitung proporsi pasangan titik yang berada pada status kesepakatan yang sama (sama-sama satu kluster atau sama-sama beda kluster).
   ARI mengoreksi RI terhadap ekspektasi peluang acak:
   $$\\text{ARI} = \\frac{\\text{RI} - E[\\text{RI}]}{\\max(\\text{RI}) - E[\\text{RI}]} \\in [-1, +1]$$
   - $\\text{ARI} = 1$: Partisi identik sempurna (hingga permutasi label).
   - $\\text{ARI} \\approx 0$: Penugasan acak independen.

2. **Normalized Mutual Information (NMI)**:
   Mengukur reduksi ketidakpastian informasi antara dua partisi berdasarkan entropi Shannon:
   $$\\text{NMI}(U, V) = \\frac{2 \\cdot I(U; V)}{H(U) + H(V)} \\in [0, 1]$$
   di mana $I(U; V)$ adalah Mutual Information dan $H(U)$ adalah entropi marginal partisi.`,
    mermaidDiagram: `graph LR
    PartisiU["Partisi Ground Truth U"] --> TabelKontingensi["Matriks Kontingensi Pasangan (n_ij)"]
    PartisiV["Partisi Hasil Kluster V"] --> TabelKontingensi
    TabelKontingensi --> ARI["Adjusted Rand Index: Koreksi Peluang Ekspektasi"]
    TabelKontingensi --> NMI["Normalized Mutual Information: Berbasis Entropi Shannon"]`,
    scratchCode: `import numpy as np
from scipy.special import comb

def compute_ari_scratch(labels_true, labels_pred):
    """Menghitung Adjusted Rand Index dari scratch."""
    labels_true = np.asarray(labels_true)
    labels_pred = np.asarray(labels_pred)
    n = len(labels_true)
    
    classes = np.unique(labels_true)
    clusters = np.unique(labels_pred)
    
    # Matriks kontingensi n_ij
    contingency = np.zeros((len(classes), len(clusters)), dtype=int)
    for i, c in enumerate(classes):
        for j, k in enumerate(clusters):
            contingency[i, j] = np.sum((labels_true == c) & (labels_pred == k))
            
    sum_comb_c = np.sum([comb(n_ij, 2) for n_ij in contingency.flatten()])
    sum_comb_a = np.sum([comb(np.sum(contingency[i, :]), 2) for i in range(len(classes))])
    sum_comb_b = np.sum([comb(np.sum(contingency[:, j]), 2) for j in range(len(clusters))])
    total_comb = comb(n, 2)
    
    expected_index = (sum_comb_a * sum_comb_b) / total_comb
    max_index = 0.5 * (sum_comb_a + sum_comb_b)
    
    ari = (sum_comb_c - expected_index) / (max_index - expected_index) if (max_index - expected_index) > 0 else 0.0
    return ari

labels_true = [0, 0, 1, 1, 2, 2]
labels_pred = [1, 1, 0, 0, 2, 2] # Permutasi label identik
print(f"ARI Scratch: {compute_ari_scratch(labels_true, labels_pred):.4f}")`,
    sotaCode: `from sklearn.metrics import adjusted_rand_score, normalized_mutual_info_score

labels_true = [0, 0, 1, 1, 2, 2]
labels_pred = [1, 1, 0, 0, 2, 2]

ari = adjusted_rand_score(labels_true, labels_pred)
nmi = normalized_mutual_info_score(labels_true, labels_pred)
print(f"Scikit-Learn ARI: {ari:.4f}, NMI: {nmi:.4f}")`,
    diagCode: `def verify_permutation_invariance(labels_true, labels_pred):
    ari = compute_ari_scratch(labels_true, labels_pred)
    assert np.isclose(ari, 1.0), "Permutasi label identik harus menghasilkan ARI = 1.0"
    return "Lolos Uji Invarian Permutasi"`,
    caseStudy: "Dalam benchmark sintesis citra MNIST atau kluster sel tunggal RNA-seq (single-cell genomics), ARI dan NMI digunakan untuk memvalidasi apakah pengelompokan tanpa supervisi menemukan kembali tipe sel biologis sejati.",
    commonPitfalls: [
      "Menggunakan akurasi klasifikasi biasa pada evaluasi kluster (label 0 pada kluster bisa berarti label 1 pada ground truth, yang sah dalam unsupervised learning).",
      "Mengabaikan fakta bahwa ARI dapat bernilai negatif jika pengelompokan secara sistematis lebih buruk dari tebakan acak."
    ],
    groundingLinks: [
      { title: "Hubert & Arabie (1985) Comparing Partitions", url: "https://doi.org/10.1007/BF01908075", note: "Paper pendiri formulasi Adjusted Rand Index" }
    ]
  })
];

const ch26 = {
  id: "machine-learning-ch-26",
  title: "Bab 26: Metrologi Evaluasi Regresi & Klusterisasi",
  slug: "metrologi-evaluasi-regresi-klusterisasi",
  orderIndex: 26,
  description: "Metrik galat regresi skala dependen (MSE, RMSE, MAE), metrik robust dan relatif (MedAE, MAPE, Huber, R2, Adjusted R2), evaluasi klusterisasi internal (Silhouette Coefficient), indeks dispersi Calinski-Harabasz dan Davies-Bouldin, serta evaluasi eksternal Adjusted Rand Index (ARI) dan NMI.",
  subchapters: ch26Subchapters
};

fs.writeFileSync(path.join(OUT_DIR, 'chunk6-ch26.ts'), exportChapterTs(ch26, 'chapter26'));
console.log('Successfully generated chunk6-ch26.ts (5 subchapters)');

// ==========================================
// CHAPTER 27: Protokol Validasi Bebas Bocor (CV Architecture)
// ==========================================
const ch27Subchapters = [
  createSubchapter({
    id: "ml-27-1-data-partition-classic",
    slug: "partisi-data-klasik-train-validation-test-set",
    title: "27.1 Partisi Data Klasik: Train, Validation, & Test Set: Jaminan Uji Out-of-Sample yang Tidak Bias",
    orderIndex: 1,
    description: "Fondasi partisi 3-arah: Training Set untuk fitting parameter, Validation Set untuk seleksi model/hiperparameter, dan Test Set murni untuk estimasi generalisasi out-of-sample.",
    theoryMarkdown: `Proses pembelajaran mesin memerlukan pemisahan ketat terhadap ruang data sampel $\\mathcal{D} = \\{(x_i, y_i)\\}_{i=1}^N$ menjadi tiga subset disjoin:
$$\\mathcal{D} = \\mathcal{D}_{\\text{train}} \\cup \\mathcal{D}_{\\text{val}} \\cup \\mathcal{D}_{\\text{test}}, \\quad \\mathcal{D}_a \\cap \\mathcal{D}_b = \\emptyset \\quad \\forall a \\neq b$$

1. **Training Set ($\\approx 60-80\\%$)**: Digunakan secara eksklusif untuk mengoptimalkan parameter internal model $\\mathbf{w}^* = \\arg\\min_{\\mathbf{w}} \\mathcal{L}(\\mathbf{w}; \\mathcal{D}_{\\text{train}})$.
2. **Validation Set ($\\approx 10-20\\%$)**: Digunakan untuk menyetel hiperparameter $\\lambda$ (misal: penalti regularisasi, kedalaman pohon) dan memilih arsitektur model terbaik.
3. **Test Set ($\\approx 10-20\\%$)**: Himpunan data steril yang **tidak boleh dilihat** oleh model maupun proses rekayasa fitur selama tahap pengembangan. Hanya dievaluasi tepat satu kali di akhir untuk melaporkan estimasi risiko generalisasi empiris yang tidak bias.`,
    mermaidDiagram: `graph TD
    Dataset["Dataset Lengkap D"] --> Split1["Partisi Awal (Bebas Kontaminasi)"]
    Split1 --> TrainVal["Himpunan Pengembangan (Train + Val)"]
    Split1 --> TestSet["Test Set Murni (Terkunci Hingga Akhir)"]
    TrainVal --> TrainSet["Training Set: Optimasi Bobot Model"]
    TrainVal --> ValSet["Validation Set: Tuning Hiperparameter & Early Stopping"]`,
    scratchCode: `import numpy as np

def train_val_test_split_scratch(X, y, train_ratio=0.7, val_ratio=0.15, random_seed=42):
    """Partisi data 3-arah dari scratch dengan pengacakan terkontrol."""
    np.random.seed(random_seed)
    n = len(X)
    indices = np.random.permutation(n)
    
    train_end = int(n * train_ratio)
    val_end = train_end + int(n * val_ratio)
    
    train_idx = indices[:train_end]
    val_idx = indices[train_end:val_end]
    test_idx = indices[val_end:]
    
    return (X[train_idx], y[train_idx]), (X[val_idx], y[val_idx]), (X[test_idx], y[test_idx])

X = np.arange(100).reshape(-1, 1)
y = np.arange(100)
(X_tr, y_tr), (X_v, y_v), (X_te, y_te) = train_val_test_split_scratch(X, y)
print(f"Train: {len(X_tr)}, Val: {len(X_v)}, Test: {len(X_te)}")`,
    sotaCode: `from sklearn.model_selection import train_test_split
import numpy as np

X = np.arange(100).reshape(-1, 1)
y = np.arange(100)

# Dua langkah partisi untuk mendapatkan 70/15/15 split
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.30, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.50, random_state=42)
print(f"Scikit-Learn Split: Train={len(X_train)}, Val={len(X_val)}, Test={len(X_test)}")`,
    diagCode: `def verify_no_overlap(train_idx, val_idx, test_idx):
    s1 = set(train_idx).intersection(set(val_idx))
    s2 = set(train_idx).intersection(set(test_idx))
    s3 = set(val_idx).intersection(set(test_idx))
    assert len(s1) == 0 and len(s2) == 0 and len(s3) == 0, "Ditemukan kebocoran tumpang tindih indeks!"
    return "Integritas Partisi Terverifikasi Bebas Tumpang Tindih"`,
    caseStudy: "Banyak insiden publikasi medis retrospektif gagal direplikasi dalam uji klinis prospektif karena peneliti menyetel fitur dan hiperparameter berulang kali pada Test Set, merusak jaminan inferensi statistik out-of-sample.",
    commonPitfalls: [
      "Menggunakan data Test Set berulang kali untuk memilih checkpoint model terbaik (menyebabkan data snooping bias).",
      "Melakukan imputasi nilai hilang atau scaling min-max sebelum partisi data dilakukan."
    ],
    groundingLinks: [
      { title: "Hastie et al. ESL Ch. 7 Model Assessment and Selection", url: "https://hastie.su.domains/ElemStatLearn/", note: "Analisis teoretis estimasi risiko empiris" }
    ]
  }),

  createSubchapter({
    id: "ml-27-2-k-fold-taxonomy",
    slug: "taksonomi-k-fold-cross-validation-stratified-repeated",
    title: "27.2 Taksonomi K-Fold Cross-Validation: Standar K-Fold, Stratified K-Fold (Proporsi Kelas), & Repeated K-Fold",
    orderIndex: 2,
    description: "Metodologi K-Fold Cross-Validation: Pembuktian reduksi varians estimator, Stratified K-Fold untuk mempertahankan proporsi kelas target, dan Repeated K-Fold.",
    theoryMarkdown: `K-Fold Cross-Validation membagi dataset menjadi $K$ blok sama besar yang saling lepas $\\{F_1, F_2, \\dots, F_K\\}$. Pada iterasi ke-$k$, blok $F_k$ dijadikan validation set sementara $K-1$ blok lainnya digunakan untuk melatih model.

Estimator risiko validasi silang adalah rata-rata tidak bias dari kesalahan pada $K$ lipatan:
$$\\text{CV}_{(K)} = \\frac{1}{K} \\sum_{k=1}^K \\mathcal{L}(\\hat{f}^{(-k)}; F_k)$$

1. **Trade-off Bias-Variance Pemilihan $K$**:
   - $K=5$ atau $K=10$: Kompromi empiris optimal. Bias estimasi galat sedikit lebih tinggi dibanding $K=N$, tetapi varians estimator antar sampel jauh lebih rendah karena overlap lipatan pelatihan terkendali.
   - $K=N$ (Leave-One-Out / LOOCV): Estimator memiliki bias terendah namun memiliki varians komputasi tinggi karena $N$ model pelatihan hampir identik (korelasi tinggi antar lipatan).
2. **Stratified K-Fold**:
   Menjamin bahwa proporsi setiap kelas $y$ pada setiap lipatan $F_k$ identik dengan proporsi pada populasi dataset penuh: $P(y=c \\mid F_k) = P(y=c \\mid \\mathcal{D})$. Wajib digunakan untuk klasifikasi kelas tidak seimbang.`,
    mermaidDiagram: `graph TD
    Data["Dataset D (K=5)"] --> F1["Fold 1: Test | Folds 2,3,4,5: Train"]
    Data --> F2["Fold 2: Test | Folds 1,3,4,5: Train"]
    Data --> F3["Fold 3: Test | Folds 1,2,4,5: Train"]
    Data --> F4["Fold 4: Test | Folds 1,2,3,5: Train"]
    Data --> F5["Fold 5: Test | Folds 1,2,3,4: Train"]
    F1 --> Agg["Agregasi Rata-rata Skor Metrik CV"]
    F2 --> Agg
    F3 --> Agg
    F4 --> Agg
    F5 --> Agg`,
    scratchCode: `import numpy as np

def stratified_k_fold_scratch(y, n_splits=5, shuffle=True, random_seed=42):
    """Generator Stratified K-Fold dari scratch tanpa scikit-learn."""
    if shuffle:
        np.random.seed(random_seed)
        
    y = np.asarray(y)
    unique_classes, class_counts = np.unique(y, return_counts=True)
    
    # Kumpulkan indeks per kelas
    class_indices = {}
    for c in unique_classes:
        idxs = np.where(y == c)[0]
        if shuffle:
            np.random.shuffle(idxs)
        class_indices[c] = idxs
        
    folds = [[] for _ in range(n_splits)]
    for c in unique_classes:
        splits = np.array_split(class_indices[c], n_splits)
        for fold_idx in range(n_splits):
            folds[fold_idx].extend(splits[fold_idx])
            
    for fold_idx in range(n_splits):
        test_indices = np.array(folds[fold_idx])
        train_indices = np.setdiff1d(np.arange(len(y)), test_indices)
        yield train_indices, test_indices

y = np.array([0]*80 + [1]*20) # Imbalance 80:20
for fold, (tr, te) in enumerate(stratified_k_fold_scratch(y, n_splits=3)):
    pos_ratio = np.mean(y[te] == 1)
    print(f"Fold {fold+1} Positives Ratio: {pos_ratio:.3f} (Proporsi Terjaga)")`,
    sotaCode: `from sklearn.model_selection import StratifiedKFold
import numpy as np

y = np.array([0]*80 + [1]*20)
skf = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

for fold, (train_idx, test_idx) in enumerate(skf.split(np.zeros(len(y)), y)):
    print(f"Scikit-Learn Fold {fold+1} Test Positives: {np.sum(y[test_idx] == 1)}")`,
    diagCode: `def verify_stratification(y, folds):
    full_prop = np.mean(y == 1)
    for i, (_, te) in enumerate(folds):
        fold_prop = np.mean(y[te] == 1)
        assert abs(fold_prop - full_prop) < 0.05, f"Fold {i} tidak terstratifikasi sempurna!"
    return "Valid Stratified Folds"`,
    caseStudy: "Dalam analisis biomarker kanker darah dengan hanya 15 pasien positif dari 300 subjek, K-Fold acak biasa sering menghasilkan lipatan dengan 0 sampel positif, menyebabkan pembagian terhenti dan model gagal dievaluasi.",
    commonPitfalls: [
      "Menggunakan K-Fold biasa (non-stratified) pada dataset klasifikasi miring.",
      "Mengabaikan komputasi standar deviasi antar lipatan, hanya melaporkan nilai rata-rata."
    ],
    groundingLinks: [
      { title: "Kohavi (1995) A Study of Cross-Validation and Bootstrap for Accuracy Estimation and Model Selection", url: "https://dl.acm.org/doi/10.5555/1643031.1643047", note: "Studi seminal pemilihan K optimal" }
    ]
  }),

  createSubchapter({
    id: "ml-27-3-group-k-fold",
    slug: "validasi-data-terkorelasi-kelompok-group-k-fold",
    title: "27.3 Validasi Data Terkorelasi Kelompok: Group K-Fold & Leave-One-Group-Out untuk Mencegah Kebocoran Subjek",
    orderIndex: 3,
    description: "Protokol validasi data berstruktur hierarkis / terkelompok: Group K-Fold, Leave-One-Group-Out, dan pencegahan kontaminasi subjek berulang.",
    theoryMarkdown: `Pada banyak aplikasi dunia nyata, baris data tidak terdistribusi secara independen dan identik ($i.i.d.$). Sebaliknya, data memiliki korelasi kelompok (*grouped data*), misalnya:
- Rekaman EKG berulang dari pasien yang sama pada rumah sakit.
- Beberapa rekaman suara dari pembicara yang sama dalam sistem ASR.
- Ulasan produk jamak dari satu pengguna e-commerce.

Jika sampel dari kelompok yang sama terdistribusi di Training Set dan Validation Set secara simultan, model dapat 'menghafal' karakteristik unik subjek (misal: aksen suara pasien atau bentuk kurva EKG spesifik), bukan mempelajari pola penyakit yang dapat digeneralisasi. Fenomena ini disebut **kebocoran identitas subjek (*subject leakage*)**.

**Group K-Fold**:
Menjamin bahwa seluruh baris milik suatu kelompok $g \\in \\mathcal{G}$ dialokasikan secara eksklusif ke dalam satu lipatan tertentu:
$$\\mathcal{G}_{\\text{train}} \\cap \\mathcal{G}_{\\text{val}} = \\emptyset$$`,
    mermaidDiagram: `graph TD
    Subjek1["Pasien A: 5 Sampel"] --> Lipat1["Fold 1 (Hanya Pasien A, C)"]
    Subjek2["Pasien B: 4 Sampel"] --> Lipat2["Fold 2 (Hanya Pasien B, D)"]
    Subjek3["Pasien C: 6 Sampel"] --> Lipat1
    Subjek4["Pasien D: 5 Sampel"] --> Lipat2
    Lipat1 --> NoLeak["Bebas Kebocoran: Tidak Ada Pasien yang Terpecah Antar Train & Val"]
    Lipat2 --> NoLeak`,
    scratchCode: `import numpy as np

def group_k_fold_scratch(groups, n_splits=3):
    """Generator Group K-Fold dari scratch."""
    groups = np.asarray(groups)
    unique_groups, group_counts = np.unique(groups, return_counts=True)
    
    # Sort groups descending by sample size for greedy partition
    order = np.argsort(group_counts)[::-1]
    sorted_groups = unique_groups[order]
    sorted_counts = group_counts[order]
    
    fold_samples = [0] * n_splits
    fold_groups = [[] for _ in range(n_splits)]
    
    # Greedy bin packing
    for g, cnt in zip(sorted_groups, sorted_counts):
        min_fold = np.argmin(fold_samples)
        fold_groups[min_fold].append(g)
        fold_samples[min_fold] += cnt
        
    for fold_idx in range(n_splits):
        test_groups = fold_groups[fold_idx]
        test_indices = np.where(np.isin(groups, test_groups))[0]
        train_indices = np.setdiff1d(np.arange(len(groups)), test_indices)
        yield train_indices, test_indices

# 10 data points dari 4 pasien (P1, P2, P3, P4)
patient_ids = np.array(['P1', 'P1', 'P1', 'P2', 'P2', 'P3', 'P3', 'P4', 'P4', 'P4'])
for fold, (tr, te) in enumerate(group_k_fold_scratch(patient_ids, n_splits=2)):
    print(f"Fold {fold+1} Test Patients: {np.unique(patient_ids[te])}")`,
    sotaCode: `from sklearn.model_selection import GroupKFold
import numpy as np

patient_ids = np.array(['P1', 'P1', 'P1', 'P2', 'P2', 'P3', 'P3', 'P4', 'P4', 'P4'])
X = np.zeros((10, 2))
y = np.zeros(10)

gkf = GroupKFold(n_splits=2)
for fold, (train_idx, test_idx) in enumerate(gkf.split(X, y, groups=patient_ids)):
    print(f"Scikit-Learn Fold {fold+1} Groups in Test: {np.unique(patient_ids[test_idx])}")`,
    diagCode: `def verify_no_group_leakage(train_groups, test_groups):
    overlap = set(train_groups).intersection(set(test_groups))
    assert len(overlap) == 0, f"Ditemukan kebocoran grup: {overlap}"
    return "Valid Group Separation"`,
    caseStudy: "Model deteksi pneumonia dari citra X-Ray dada sempat dilaporkan memiliki akurasi 98%, namun saat dievaluasi dengan Group K-Fold pada rumah sakit baru, akurasinya anjlok ke 62% karena model mempelajari label nomor mesin X-Ray alih-alih paru-paru pasien.",
    commonPitfalls: [
      "Menggunakan train_test_split acak biasa pada data multi-record pasien atau sensor IoT yang berulang.",
      "Mengasumsikan Group K-Fold dapat membagi jumlah baris secara seimbang sempurna (karena keterbatasan variasi ukuran kelompok)."
    ],
    groundingLinks: [
      { title: "Scikit-Learn Grouped Cross-Validation", url: "https://scikit-learn.org/stable/modules/cross_validation.html#cross-validation-iterators-for-grouped-data", note: "Dokumentasi GroupKFold" }
    ]
  }),

  createSubchapter({
    id: "ml-27-4-time-series-split",
    slug: "validasi-temporal-deret-waktu-timeseriessplit-expanding-window",
    title: "27.4 Validasi Temporal Deret Waktu: TimeSeriesSplit, Expanding Window, & Rolling Window Cross-Validation",
    orderIndex: 4,
    description: "Protokol validasi data deret waktu temporal: Larangan lookahead bias, arsitektur Expanding Window, dan Rolling Window Cross-Validation.",
    theoryMarkdown: `Pada data deret waktu (*time series*) dan keuangan, urutan observasi memiliki korelasi serial (*autocorrelation*). Melakukan pengacakan acak (*random shuffling*) melanggar kausalitas fisik waktu:
$$\\text{Lookahead Bias: Model masa lalu dilatih menggunakan fitur masa depan!}$$

**Protokol Validasi Temporal**:
1. **Expanding Window (TimeSeriesSplit)**:
   Ukuran himpunan data pelatihan bertambah secara bertahap seiring berjalannya waktu, sementara validation set selalu berada di masa depan langsung setelah titik waktu pelatihan terakhir:
   - Lipatan 1: Train $[t_1 \\dots t_k]$, Test $[t_{k+1} \\dots t_{k+h}]$
   - Lipatan 2: Train $[t_1 \\dots t_{k+h}]$, Test $[t_{k+h+1} \\dots t_{k+2h}]$
2. **Rolling Window (Sliding Window)**:
   Ukuran jendela pelatihan dipertahankan konstan sebesar $W$ baris, mengabaikan data masa lalu yang sangat jauh untuk mengantisipasi *concept drift*:
   - Lipatan 1: Train $[t_1 \\dots t_W]$, Test $[t_{W+1} \\dots t_{W+h}]$
   - Lipatan 2: Train $[t_{1+s} \\dots t_{W+s}]$, Test $[t_{W+s+1} \\dots t_{W+s+h}]$`,
    mermaidDiagram: `graph TD
    T1["Lipatan 1: [=== Train ===] [ Test ]"] --> Time["Aliran Waktu Masa Depan ->"]
    T2["Lipatan 2: [====== Train ======] [ Test ]"] --> Time
    T3["Lipatan 3: [========= Train =========] [ Test ]"] --> Time
    Time --> NoLookahead["Menjamin Kausalitas: Masa Depan Tidak Pernah Bocor ke Masa Lalu"]`,
    scratchCode: `import numpy as np

def time_series_split_scratch(n_samples, n_splits=4, test_size=10):
    """Generator TimeSeriesSplit (Expanding Window) dari scratch."""
    min_train_size = n_samples - n_splits * test_size
    if min_train_size <= 0:
        raise ValueError("Jumlah sampel terlalu sedikit untuk jumlah splits dan test_size yang diminta.")
        
    for i in range(n_splits):
        train_end = min_train_size + i * test_size
        test_end = train_end + test_size
        yield np.arange(0, train_end), np.arange(train_end, test_end)

data = np.arange(50)
for fold, (tr, te) in enumerate(time_series_split_scratch(len(data), n_splits=3, test_size=10)):
    print(f"Fold {fold+1}: Train [{tr[0]}..{tr[-1]}] -> Test [{te[0]}..{te[-1]}]")`,
    sotaCode: `from sklearn.model_selection import TimeSeriesSplit
import numpy as np

data = np.arange(50)
tscv = TimeSeriesSplit(n_splits=3, max_train_size=None)

for fold, (train_idx, test_idx) in enumerate(tscv.split(data)):
    print(f"Scikit-Learn TS Fold {fold+1}: Train Max={train_idx[-1]} < Test Min={test_idx[0]}")`,
    diagCode: `def verify_temporal_order(train_indices, test_indices):
    assert np.max(train_indices) < np.min(test_indices), "Terdeteksi Lookahead Bias!"
    return "Valid Strict Temporal Sequence"`,
    caseStudy: "Model perdagangan kuantitatif algoritmik (algorithmic trading) yang divalidasi dengan K-Fold acak menunjukkan Sharpe Ratio 4.5 di backtest, namun langsung bangkrut saat dijalankan secara live akibat kebocoran harga penutupan esok hari.",
    commonPitfalls: [
      "Mengaktifkan shuffle=True pada TimeSeriesSplit.",
      "Menghitung rata-rata moving average atau lag features sebelum melakukan partisi temporal."
    ],
    groundingLinks: [
      { title: "Aronson (2006) Evidence-Based Technical Analysis: Applying the Scientific Method and Statistical Inference", url: "https://www.wiley.com/en-us/Evidence+Based+Technical+Analysis-p-9780470008744", note: "Buku acuan bahaya data mining bias pada data keuangan" }
    ]
  }),

  createSubchapter({
    id: "ml-27-5-data-leakage-anatomy",
    slug: "anatomi-kebocoran-data-data-leakage-dan-pipeline-enkapsulasi",
    title: "27.5 Anatomi Kebocoran Data (Data Leakage): Pra-pemrosesan di Luar Lipatan (Fold), Kebocoran Target, & Enkapsulasi Pipeline",
    orderIndex: 5,
    description: "Analisis mendalam sumber kebocoran data (*data leakage*): Scaling sebelum partisi, kebocoran target terbalik, dan enkapsulasi anti-bocor menggunakan Pipeline Scikit-Learn.",
    theoryMarkdown: `Kebocoran data (*Data Leakage*) terjadi ketika informasi dari luar himpunan data pelatihan mencemari proses pembentukan model, menghasilkan estimasi performa validasi yang optimis semu yang gagal total pada data produksi baru.

**Tiga Vektor Kebocoran Utama**:
1. **Pra-pemrosesan Global di Luar Lipatan**:
   Menghitung parameter transformasi seperti rata-rata $\\mu$, deviasi standar $\\sigma$, atau nilai imputasi median pada seluruh dataset $\\mathcal{D}$ sebelum partisi CV:
   $$z_i = \\frac{x_i - \\mu_{\\text{global}}}{\\sigma_{\\text{global}}} \\quad (\\text{SALAH: } \\mu_{\\text{global}} \\text{ mengandung informasi } \\mathcal{D}_{\\text{val}}!)$$
2. **Kebocoran Target (Target Leakage)**:
   Menyertakan fitur yang secara fisik baru tersedia setelah peristiwa target terjadi (misalnya: kolom 'Nomor Rekening Pembayaran Klaim' untuk memprediksi 'Persetujuan Klaim Asuransi').
3. **Seleksi Fitur Sebelum Cross-Validation**:
   Memilih 100 fitur dengan korelasi tertinggi terhadap $y$ menggunakan seluruh dataset sebelum menjalankan K-Fold CV.

**Solusi Arsitektural**: Enkapsulasi seluruh langkah transformasi ke dalam objek \`Pipeline\`, di mana \`.fit()\` hanya dipanggil pada fold pelatihan.`,
    mermaidDiagram: `graph TD
    Bad["Praktik Buruk: Fit Scaling Global -> Split CV -> Pelatihan (BOCOR)"] --> Fail["Overfitting Validasi Semu"]
    Good["Praktik Benar: Split CV -> Fit Scaling di Train Fold -> Transform Val Fold"] --> Safe["Pipeline Terenkapsulasi (Bebas Bocor)"]`,
    scratchCode: `import numpy as np

def demonstrate_fatal_leakage():
    """Simulasi eksperimental: Membuktikan seleksi fitur bocor menghasilkan akurasi palsu."""
    np.random.seed(42)
    # 100 sampel murni acak (noise putih), 10000 fitur tanpa hubungan dengan y
    X = np.random.randn(100, 10000)
    y = np.random.randint(0, 2, size=100)
    
    # KEBOCORAN FATAL: Seleksi 5 fitur berkorelasi tertinggi PADA SELURUH DATASET
    correlations = np.array([np.abs(np.corrcoef(X[:, j], y)[0, 1]) for j in range(10000)])
    best_features = np.argsort(correlations)[-5:]
    X_selected = X[:, best_features]
    
    # Evaluasi dummy CV pada fitur yang bocor
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import cross_val_score
    clf = LogisticRegression()
    leaked_score = np.mean(cross_val_score(clf, X_selected, y, cv=5))
    print(f"Akurasi Pada Fitur Acak Bocor: {leaked_score:.3f} (Palsu! Seharusnya ~0.50)")

demonstrate_fatal_leakage()`,
    sotaCode: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
import numpy as np

X = np.random.randn(100, 1000)
y = np.random.randint(0, 2, size=100)

# Pipeline resmi yang aman dari kebocoran: Transformasi diisolasi di setiap fold
safe_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('selector', SelectKBest(score_func=f_classif, k=5)),
    ('classifier', LogisticRegression())
])

safe_score = np.mean(cross_val_score(safe_pipeline, X, y, cv=5))
print(f"Akurasi Pada Pipeline Terisolasi: {safe_score:.3f} (Sesuai Ekspektasi Kebisingan Acak)")`,
    diagCode: `def audit_pipeline_leakage(pipeline_steps):
    for name, step in pipeline_steps:
        assert hasattr(step, "fit_transform") or hasattr(step, "fit"), f"Step {name} bukan transformer valid"
    return "Audit Arsitektur Pipeline Lolos"`,
    caseStudy: "Kaufman et al. (2012) mendokumentasikan puluhan kompetisi data mining di mana pemenang teratas didiskualifikasi karena tanpa sengaja menggunakan ID transaksi yang berkorelasi temporal dengan target label.",
    commonPitfalls: [
      "Melakukan SMOTE oversampling pada seluruh dataset sebelum membagi lipatan K-Fold CV.",
      "Menghitung target encoding frekuensi pada seluruh data tanpa skema Out-Of-Fold (OOF)."
    ],
    groundingLinks: [
      { title: "Kaufman et al. (2012) Leakage in Data Mining: Formulating it, Detecting it and Avoiding it", url: "https://doi.org/10.1145/2339530.2339614", note: "Taksonomi lengkap kebocoran data industri" }
    ]
  })
];

const ch27 = {
  id: "machine-learning-ch-27",
  title: "Bab 27: Protokol Validasi Bebas Bocor (Cross-Validation Architecture)",
  slug: "protokol-validasi-bebas-bocor-cv-architecture",
  orderIndex: 27,
  description: "Partisi data klasik 3-arah, taksonomi K-Fold & Stratified K-Fold, penanganan data terkorelasi via Group K-Fold, validasi deret waktu temporal TimeSeriesSplit, serta anatomi pencegahan kebocoran data (Data Leakage) via enkapsulasi Pipeline.",
  subchapters: ch27Subchapters
};

fs.writeFileSync(path.join(OUT_DIR, 'chunk6-ch27.ts'), exportChapterTs(ch27, 'chapter27'));
console.log('Successfully generated chunk6-ch27.ts (5 subchapters)');
