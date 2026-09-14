import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * 3. MODEL SELECTION AND EVALUATION (3.1 to 3.5)
 * Materi lengkap Scikit-Learn 1.9 mengenai validasi silang, penyetelan hyperparameter,
 * metrik evaluasi model prediksi, dan analisis kurva validasi.
 */
export const MODEL_SELECTION_CHAPTER: DocSectionItem = {
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

Learning the parameters of a prediction function and testing it on the same data is a methodological mistake: a model that repeats training labels would have a 100% score but fail on unseen data (**overfitting**).

---

## 3.1.1. Train/Test Split & cross_val_score
Scikit-Learn menyediakan fungsi \`cross_val_score\` untuk menghitung skor pada setiap lipatan secara otomatis:

\`\`\`python
from sklearn.model_selection import cross_val_score
from sklearn import datasets, svm

X, y = datasets.load_iris(return_X_y=True)
clf = svm.SVC(kernel='linear', C=1, random_state=42)

scores = cross_val_score(clf, X, y, cv=5)
print("Skor per Fold:", scores)
print("Rata-rata Akurasi: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))
\`\`\`

---

## 3.1.2. Cross-Validation Iterators
1. **KFold**: Membagi data ke dalam $k$ lipatan berukuran seragam.
2. **StratifiedKFold**: Mempertahankan persentase distribusi setiap label kelas di setiap lipatan (sangat penting untuk dataset klasifikasi yang tidak seimbang).
3. **GroupKFold**: Memastikan observasi dengan kelompok yang sama (misal pasien yang sama) tidak muncul bersamaan di data latih dan data uji.
4. **TimeSeriesSplit**: Validasi berurutan ke depan (*rolling-origin*) tanpa membocorkan data masa depan ke masa lalu.
5. **ShuffleSplit & StratifiedShuffleSplit**: Permutasi acak independen untuk setiap iterasi.
`
    },
    {
      id: "sec-3-2-grid-search",
      slug: "grid-search",
      title: "3.2. Tuning the hyper-parameters of an estimator",
      orderIndex: 2,
      description: "Pencarian konfigurasi parameter terbaik menggunakan GridSearchCV, RandomizedSearchCV, dan HalvingGridSearchCV.",
      content_markdown: `# 3.2. Tuning the hyper-parameters of an estimator

Hyper-parameters adalah parameter yang dikonfigurasi sebelum pelatihan model dimulai (tidak dipelajari dari proses optimasi langsung).

---

## 3.2.1. GridSearchCV
Mengevaluasi seluruh kombinasi parameter secara komprehensif:

\`\`\`python
from sklearn import svm, datasets
from sklearn.model_selection import GridSearchCV

iris = datasets.load_iris()
parameters = {'kernel': ('linear', 'rbf'), 'C': [1, 10]}
svc = svm.SVC()
clf = GridSearchCV(svc, parameters, cv=5)
clf.fit(iris.data, iris.target)

print("Kombinasi parameter terbaik:", clf.best_params_)
print("Skor cross-validation terbaik:", clf.best_score_)
\`\`\`

---

## 3.2.2. RandomizedSearchCV & HalvingGridSearchCV
- **RandomizedSearchCV**: Mengambil sampel secara acak dari distribusi parameter yang ditentukan, sangat efisien untuk ruang pencarian kontinu berdimensi besar.
- **HalvingGridSearchCV**: Menggunakan metode *Successive Halving* untuk mengevaluasi parameter pada subset data kecil terlebih dahulu, lalu secara bertahap menyingkirkan kandidat buruk dan menambah data untuk kandidat terbaik.
`
    },
    {
      id: "sec-3-3-classification-threshold",
      slug: "classification-threshold",
      title: "3.3. Tuning the decision threshold for class prediction",
      orderIndex: 3,
      description: "Penyetelan ambang batas probabilitas keputusan klasifikasi untuk mengoptimalkan biaya galat asimetris.",
      content_markdown: `# 3.3. Tuning the decision threshold for class prediction

Pada klasifikasi biner, threshold default adalah 0.5. Namun, pada kasus seperti deteksi penipuan (*fraud*) atau diagnosis medis, konsekuensi dari *False Negative* jauh lebih mahal dibanding *False Positive*.

\`TunedThresholdClassifierCV\` secara otomatis mengoptimalkan ambang batas keputusan berdasarkan metrik kustom atau matriks biaya (*cost matrix*).
`
    },
    {
      id: "sec-3-4-model-evaluation",
      slug: "model-evaluation",
      title: "3.4. Metrics and scoring: quantifying the quality of predictions",
      orderIndex: 4,
      description: "Metrik kuantitatif evaluasi model: Accuracy, Precision, Recall, F1, ROC-AUC, PR-AUC, MSE, RMSE, R2.",
      content_markdown: `# 3.4. Metrics and scoring: quantifying the quality of predictions

Modul \`sklearn.metrics\` menyediakan fungsi penilaian performa untuk klasifikasi, regresi, dan klastering.

---

## 3.4.1. Metrik Klasifikasi
- **Akurasi** (\`accuracy_score\`): Rasio prediksi yang benar.
- **Presisi** (\`precision_score\`): $\\frac{TP}{TP + FP}$ (seberapa andal saat memprediksi positif).
- **Recall** (\`recall_score\`): $\\frac{TP}{TP + FN}$ (seberapa banyak kasus positif asli yang berhasil ditangkap).
- **F1-Score** (\`f1_score\`): Rata-rata harmonik antara Presisi dan Recall:
  $$F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$
- **ROC AUC** (\`roc_auc_score\`): Luas area di bawah kurva Receiver Operating Characteristic.
- **Log Loss** (\`log_loss\`): Cross-entropy loss probabilistik.

\`\`\`python
from sklearn.metrics import classification_report, confusion_matrix

y_true = [0, 1, 2, 2, 2]
y_pred = [0, 0, 2, 2, 1]
print("Confusion Matrix:\\n", confusion_matrix(y_true, y_pred))
print("\\nClassification Report:\\n", classification_report(y_true, y_pred))
\`\`\`

---

## 3.4.2. Metrik Regresi
- **Mean Absolute Error (MAE)** (\`mean_absolute_error\`): $\\frac{1}{n} \\sum |y_i - \\hat{y}_i|$.
- **Mean Squared Error (MSE)** (\`mean_squared_error\`): $\\frac{1}{n} \\sum (y_i - \\hat{y}_i)^2$.
- **Root Mean Squared Error (RMSE)**: $\\sqrt{\\text{MSE}}$.
- **R-squared ($R^2$) Score** (\`r2_score\`): Proporsi varians target yang berhasil dijelaskan oleh model:
  $$R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}$$
`
    },
    {
      id: "sec-3-5-learning-curve",
      slug: "learning-curve",
      title: "3.5. Validation curves: plotting scores to evaluate models",
      orderIndex: 5,
      description: "Visualisasi kurva validasi dan kurva pembelajaran untuk analisis trade-off bias-varians.",
      content_markdown: `# 3.5. Validation curves: plotting scores to evaluate models

- **Validation Curve** (\`validation_curve\`): Memplot skor data latih dan skor validasi terhadap variasi nilai suatu hyperparameter tunggal (misal nilai $C$ atau $\\gamma$ pada SVM) untuk mendiagnosis wilayah underfitting vs overfitting.
- **Learning Curve** (\`learning_curve\`): Memplot skor model terhadap pertambahan jumlah sampel latihan untuk menentukan apakah menambah data baru akan meningkatkan performa model.
`
    }
  ]
};
