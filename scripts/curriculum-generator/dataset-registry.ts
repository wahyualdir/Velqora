import { AcademicDatasetMetadata } from "../../src/lib/curriculum/types";

export const VERIFIED_DATASETS: Record<string, AcademicDatasetMetadata> = {
  "california-housing": {
    id: "california-housing",
    name: "California Housing Dataset (Pace & Barry, 1997)",
    purpose: "Tolok ukur pemodelan regresi multivariat untuk memprediksi harga median rumah berdasarkan fitur demografis dan geografis blok sensus.",
    sourceUrl: "https://scikit-learn.org/stable/datasets/real_world.html#california-housing-dataset",
    license: "Public Domain / CC0",
    numSamples: 20640,
    numFeatures: 8,
    target: "MedHouseVal (Median house value dalam ratusan ribu USD)",
    dtypes: {
      MedInc: "float64",
      HouseAge: "float64",
      AveRooms: "float64",
      AveBedrms: "float64",
      Population: "float64",
      AveOccup: "float64",
      Latitude: "float64",
      Longitude: "float64",
      MedHouseVal: "float64",
    },
    limitations: "Nilai target disensor pada batas atas $500,000 (terjadi capping buatan pada kuantil tertinggi); data berasal dari sensus California tahun 1990 sehingga tidak mencerminkan nilai pasar kontemporer.",
    potentialBias: "Distribusi geografis terkonsentrasi di pesisir pantai; varians spasial tinggi antara distrik perkotaan padat dan wilayah pedesaan.",
    downloadInstructions: "from sklearn.datasets import fetch_california_housing; data = fetch_california_housing(as_frame=True)",
    inspectionSnippet: `import pandas as pd
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split

# 1. Memuat dataset resmi
housing = fetch_california_housing(as_frame=True)
df = housing.frame

# 2. Dimensi dataset
print("Ukuran Dataset (Baris, Kolom):", df.shape)

# 3. Nama Kolom
print("Daftar Fitur:", df.columns.tolist())

# 4. Tipe Data
print("\\nTipe Data Kolom:\\n", df.dtypes)

# 5. 5 Baris Pertama
print("\\nCuplikan Data:\\n", df.head())

# 6. Statistik Deskriptif
print("\\nStatistik Deskriptif:\\n", df.describe().T[['mean', 'std', 'min', '50%', 'max']])

# 7. Cek Missing Value
print("\\nJumlah Missing Values:\\n", df.isnull().sum())

# 8. Cek Duplikasi
print("\\nJumlah Baris Duplikat:", df.duplicated().sum())

# 9. Nilai Unik per Fitur
print("\\nNilai Unik per Kolom:\\n", df.nunique())

# 10. Distribusi Target
print("\\nDistribusi Nilai Target (Kuartil):\\n", df['MedHouseVal'].quantile([0.1, 0.25, 0.5, 0.75, 0.9, 1.0]))

# 11. Deteksi Outlier (Interquartile Range - IQR)
Q1 = df['AveRooms'].quantile(0.25)
Q3 = df['AveRooms'].quantile(0.75)
IQR = Q3 - Q1
outliers = ((df['AveRooms'] < (Q1 - 1.5 * IQR)) | (df['AveRooms'] > (Q3 + 1.5 * IQR))).sum()
print("\\nJumlah Outlier pada Fitur AveRooms:", outliers)

# 12. Matriks Korelasi dengan Target
corr = df.corr()['MedHouseVal'].sort_values(ascending=False)
print("\\nKorelasi Terhadap Target:\\n", corr)

# 13. Pembersihan Data (Filtering capping buatan)
df_clean = df[df['MedHouseVal'] < 5.0].copy()

# 14. Pemisahan Fitur dan Target
X = df_clean.drop(columns=['MedHouseVal'])
y = df_clean['MedHouseVal']

# 15. Train-Test Split (Reproducible)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 16. Validasi Preprocessing
print("\\nDimensi X_train:", X_train.shape, "Dimensi X_test:", X_test.shape)`,
    verified: true,
  },

  "iris-flowers": {
    id: "iris-flowers",
    name: "Fisher's Iris Flower Dataset (Fisher, 1936)",
    purpose: "Dataset tolok ukur fundamental klasifikasi multikelas untuk pengenalan pola morfologi botani.",
    sourceUrl: "https://scikit-learn.org/stable/datasets/toy_dataset.html#iris-plants-dataset",
    license: "CC0: Public Domain",
    numSamples: 150,
    numFeatures: 4,
    target: "Species (0: Setosa, 1: Versicolour, 2: Virginica)",
    dtypes: {
      sepal_length: "float64",
      sepal_width: "float64",
      petal_length: "float64",
      petal_width: "float64",
      target: "int64",
    },
    limitations: "Jumlah observasi kecil (50 sampel per kelas); fitur Setosa terpisah secara linear sempurna sehingga tidak menguji kapabilitas non-linear secara ekstrem.",
    potentialBias: "Data dikumpulkan dari satu lokasi geografis (Gaspé Peninsula) dalam waktu yang bersamaan.",
    downloadInstructions: "from sklearn.datasets import load_iris; iris = load_iris(as_frame=True)",
    inspectionSnippet: `import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

iris = load_iris(as_frame=True)
df = iris.frame

print("Bentuk Data:", df.shape)
print("Distribusi Target:", df['target'].value_counts())
print("Missing Values Total:", df.isnull().sum().sum())
print("Korelasi Fitur Petal:", df[['petal length (cm)', 'petal width (cm)']].corr().iloc[0, 1])

X_train, X_test, y_train, y_test = train_test_split(
    df.drop(columns=['target']), df['target'], test_size=0.2, stratify=df['target'], random_state=42
)
print("Stratifikasi Valid: Train Kelas Dist =", np.bincount(y_train))`,
    verified: true,
  },

  "breast-cancer-wisconsin": {
    id: "breast-cancer-wisconsin",
    name: "Breast Cancer Wisconsin (Diagnostic) Dataset (Wolberg et al., 1995)",
    purpose: "Benchmark klasifikasi biner medis untuk mendiagnosis keganasan lesi payudara berdasarkan fitur mikroskopi seluler.",
    sourceUrl: "https://scikit-learn.org/stable/datasets/toy_dataset.html#breast-cancer-wisconsin-diagnostic-dataset",
    license: "CC BY 4.0",
    numSamples: 569,
    numFeatures: 30,
    target: "Diagnosis (0: Malignant / Ganas, 1: Benign / Jinak)",
    dtypes: {
      "mean radius": "float64",
      "mean texture": "float64",
      "mean perimeter": "float64",
      "mean area": "float64",
      "target": "int64",
    },
    limitations: "Korelasi multikolinieritas sangat tinggi antara mean perimeter, radius, dan area ($r > 0.98$) yang menuntut penanganan regularisasi.",
    potentialBias: "Ketidakseimbangan kelas moderat (357 jinak vs 212 ganas); galat False Negative memiliki konsekuensi klinis kritis dibanding False Positive.",
    downloadInstructions: "from sklearn.datasets import load_breast_cancer; cancer = load_breast_cancer(as_frame=True)",
    inspectionSnippet: `from sklearn.datasets import load_breast_cancer
import pandas as pd

cancer = load_breast_cancer(as_frame=True)
df = cancer.frame
print("Shape:", df.shape)
print("Target Breakdown:\\n", df['target'].value_counts(normalize=True))
print("Mean Radius per Target:\\n", df.groupby('target')['mean radius'].mean())`,
    verified: true,
  },

  "wine-quality": {
    id: "wine-quality",
    name: "Cortez Wine Quality Benchmark (Cortez et al., 2009)",
    purpose: "Analisis sensorik dan klasifikasi kualitas anggur berdasarkan parameter fisikokimia laboratorium.",
    sourceUrl: "https://archive.ics.uci.edu/dataset/186/wine+quality",
    license: "CC BY 4.0",
    numSamples: 6497,
    numFeatures: 11,
    target: "quality (Skor sensorik terurut 0 s.d. 10)",
    dtypes: {
      fixed_acidity: "float64",
      volatile_acidity: "float64",
      citric_acid: "float64",
      residual_sugar: "float64",
      chlorides: "float64",
      free_sulfur_dioxide: "float64",
      density: "float64",
      pH: "float64",
      sulphates: "float64",
      alcohol: "float64",
      quality: "int64",
    },
    limitations: "Skor sangat tidak seimbang; nilai kualitas ekstrem (skor 3 dan skor 9) memiliki jumlah observasi sangat sedikit dibanding skor 5 dan 6.",
    potentialBias: "Penilaian kualitas subjektif berdasarkan preferensi sommelier Eropa Barat.",
    downloadInstructions: "pd.read_csv('https://archive.ics.uci.edu/static/public/186/data.csv')",
    inspectionSnippet: `import pandas as pd
import numpy as np

# Load dari UCI resmi
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv"
df = pd.read_csv(url, sep=';')
print("Wine Dataset Red Shape:", df.shape)
print("Distribusi Skor Kualitas:\\n", df['quality'].value_counts().sort_index())
print("Missing values:", df.isnull().sum().sum())`,
    verified: true,
  },
};
