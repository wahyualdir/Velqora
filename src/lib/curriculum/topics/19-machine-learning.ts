import { AcademicCurriculum } from "../types";
import { chunk1Foundations } from "./machine-learning/chunk1-foundations";
import { chunk2LinearModels } from "./machine-learning/chunk2-linear-models";
import { chunk3TreeEnsembles } from "./machine-learning/chunk3-tree-ensembles";
import { chunk4Unsupervised } from "./machine-learning/chunk4-unsupervised";
import { chunk5ValidationProduction } from "./machine-learning/chunk5-validation-production";

/**
 * KURIKULUM AKADEMIK: MACHINE LEARNING
 * Standar: University-Grade / Advanced Engineering Curriculum
 * Single Source of Truth terintegrasi untuk platform Velqora.
 * 
 * Versi 3.1.0 (Regenerasi Substantif Berbasis 16 Dimensi Pedagogis & Latihan Terstruktur)
 * Memuat 22 Bab & 220 Subbab dengan 100% Latihan Terstruktur Level 1-2,
 * Intuisi & Analogi Dunia Nyata, Formulasi Matematis KaTeX, dan Pencegahan Overfitting.
 */
export const machineLearningCurriculum: AcademicCurriculum = {
  "id": "machine-learning",
  "slug": "machine-learning",
  "title": "Machine Learning",
  "category": "Kecerdasan Buatan",
  "level": "menengah",
  "description": "Kurikulum akademik komprehensif Machine Learning berstandar universitas internasional dan industri: 22 BAB lengkap dengan penurunan matematis formal KaTeX, pembuktian teorema Gauss-Markov, dekomposisi bias-varians, implementasi algoritma dari nol (NumPy) dan Scikit-Learn API, serta pencegahan kebocoran data mutlak.",
  "estimatedHours": 90,
  "version": "3.0.0",
  "primaryReferences": [
    {
      "title": "scikit-learn: Machine Learning in Python",
      "authors": [
        "Fabian Pedregosa",
        "Gaël Varoquaux",
        "Alexandre Gramfort",
        "Vincent Michel",
        "Bertrand Thirion",
        "Olivier Grisel"
      ],
      "type": "paper",
      "url": "https://arxiv.org/abs/1201.0490",
      "doi": "10.48550/arXiv.1201.0490",
      "sourceType": "paper",
      "provider": "Journal of Machine Learning Research (JMLR)",
      "relevance": "Paper akademik resmi pendirian pustaka scikit-learn dan prinsip desain API konsisten fit-transform-predict.",
      "verified": true,
      "lastChecked": "2026-09-17",
      "isPrimarySource": true
    },
    {
      "title": "scikit-learn User Guide: Supervised, Unsupervised & Model Selection",
      "authors": [
        "scikit-learn developers"
      ],
      "type": "documentation",
      "url": "https://scikit-learn.org/stable/user_guide.html",
      "sourceType": "official-documentation",
      "provider": "scikit-learn",
      "relevance": "Panduan ensiklopedis algoritma ML klasik, perumusan formulasi matematis, dan kompleksitas komputasi.",
      "verified": true,
      "lastChecked": "2026-09-17",
      "isPrimarySource": true
    },
    {
      "title": "The Elements of Statistical Learning: Data Mining, Inference, and Prediction",
      "authors": [
        "Trevor Hastie",
        "Robert Tibshirani",
        "Jerome Friedman"
      ],
      "type": "book",
      "url": "https://hastie.su.domains/ElemStatLearn/",
      "sourceType": "academic-book",
      "provider": "Springer",
      "relevance": "Buku teks kanonikal pemodelan statistik, dekomposisi bias-varians, regularisasi Ridge/Lasso, dan ensemble methods.",
      "verified": true,
      "lastChecked": "2026-09-17",
      "isPrimarySource": true
    },
    {
      "title": "Machine Learning (McGraw-Hill International Editions)",
      "authors": [
        "Tom M. Mitchell"
      ],
      "type": "book",
      "url": "https://www.cs.cmu.edu/~tom/mlbook.html",
      "sourceType": "academic-book",
      "provider": "McGraw-Hill",
      "relevance": "Karya fundamental definisi komputasi pembelajaran mesin, ruang hipotesis, dan bias induktif.",
      "verified": true,
      "lastChecked": "2026-09-17"
    },
    {
      "title": "Foundations of Machine Learning",
      "authors": [
        "Mehryar Mohri",
        "Afshin Rostamizadeh",
        "Ameet Talwalkar"
      ],
      "type": "book",
      "url": "https://cs.nyu.edu/~mohri/mlbook/",
      "sourceType": "academic-book",
      "provider": "MIT Press",
      "relevance": "Buku rujukan teori pembelajaran komputasi, jaminan generalisasi PAC learning, dan dimensi Vapnik-Chervonenkis.",
      "verified": true,
      "lastChecked": "2026-09-17"
    },
    {
      "title": "Pattern Recognition and Machine Learning",
      "authors": [
        "Christopher M. Bishop"
      ],
      "type": "book",
      "url": "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/",
      "sourceType": "academic-book",
      "provider": "Springer",
      "relevance": "Rujukan komprehensif formulasi probabilistik Bayesian, regresi logistik, kernel tricks, dan Mixture Models.",
      "verified": true,
      "lastChecked": "2026-09-17"
    },
    {
      "title": "Scikit-Learn Official User Guide: Common Pitfalls and Recommended Practices",
      "authors": [
        "scikit-learn developers"
      ],
      "type": "documentation",
      "url": "https://scikit-learn.org/stable/common_pitfalls.html",
      "sourceType": "official-documentation",
      "provider": "scikit-learn",
      "relevance": "Dokumentasi standar pencegahan kebocoran data, evaluasi cross-validation bebas bias, dan kalibrasi metrik.",
      "verified": true,
      "lastChecked": "2026-09-17"
    },
    {
      "title": "Regression Shrinkage and Selection via the Lasso",
      "authors": [
        "Robert Tibshirani"
      ],
      "type": "paper",
      "url": "https://www.jstor.org/stable/2346178",
      "sourceType": "paper",
      "provider": "Journal of the Royal Statistical Society",
      "relevance": "Paper pendirian metode regularisasi penalti L1 Lasso, soft-thresholding, dan seleksi fitur otomatis.",
      "verified": true,
      "lastChecked": "2026-09-17"
    }
  ],
  "datasets": [
    {
      "id": "california-housing",
      "name": "California Housing Dataset (Pace & Barry, 1997)",
      "purpose": "Tolok ukur pemodelan regresi multivariat untuk memprediksi harga median rumah berdasarkan fitur demografis dan geografis blok sensus.",
      "sourceUrl": "https://scikit-learn.org/stable/datasets/real_world.html#california-housing-dataset",
      "license": "Public Domain / CC0",
      "numSamples": 20640,
      "numFeatures": 8,
      "target": "MedHouseVal (Median house value dalam ratusan ribu USD)",
      "limitations": "Nilai target disensor pada batas atas $500,000 (terjadi capping buatan pada kuantil tertinggi); data berasal dari sensus California tahun 1990 sehingga tidak mencerminkan nilai pasar kontemporer.",
      "potentialBias": "Distribusi geografis terkonsentrasi di pesisir pantai; varians spasial tinggi antara distrik perkotaan padat dan wilayah pedesaan.",
      "downloadInstructions": "from sklearn.datasets import fetch_california_housing; data = fetch_california_housing(as_frame=True)",
      "inspectionSnippet": "import pandas as pd\nimport numpy as np\nfrom sklearn.datasets import fetch_california_housing\nfrom sklearn.model_selection import train_test_split\n\n# 1. Memuat dataset resmi\nhousing = fetch_california_housing(as_frame=True)\ndf = housing.frame\n\n# 2. Dimensi dataset\nprint(\"Ukuran Dataset (Baris, Kolom):\", df.shape)\n\n# 3. Nama Kolom\nprint(\"Daftar Fitur:\", df.columns.tolist())\n\n# 4. Tipe Data\nprint(\"\\nTipe Data Kolom:\\n\", df.dtypes)\n\n# 5. 5 Baris Pertama\nprint(\"\\nCuplikan Data:\\n\", df.head())\n\n# 6. Statistik Deskriptif\nprint(\"\\nStatistik Deskriptif:\\n\", df.describe().T[['mean', 'std', 'min', '50%', 'max']])\n\n# 7. Cek Missing Value\nprint(\"\\nJumlah Missing Values:\\n\", df.isnull().sum())\n\n# 8. Cek Duplikasi\nprint(\"\\nJumlah Baris Duplikat:\", df.duplicated().sum())\n\n# 9. Nilai Unik per Fitur\nprint(\"\\nNilai Unik per Kolom:\\n\", df.nunique())\n\n# 10. Distribusi Target\nprint(\"\\nDistribusi Nilai Target (Kuartil):\\n\", df['MedHouseVal'].quantile([0.1, 0.25, 0.5, 0.75, 0.9, 1.0]))\n\n# 11. Deteksi Outlier (Interquartile Range - IQR)\nQ1 = df['AveRooms'].quantile(0.25)\nQ3 = df['AveRooms'].quantile(0.75)\nIQR = Q3 - Q1\noutliers = ((df['AveRooms'] < (Q1 - 1.5 * IQR)) | (df['AveRooms'] > (Q3 + 1.5 * IQR))).sum()\nprint(\"\\nJumlah Outlier pada Fitur AveRooms:\", outliers)\n\n# 12. Matriks Korelasi dengan Target\ncorr = df.corr()['MedHouseVal'].sort_values(ascending=False)\nprint(\"\\nKorelasi Terhadap Target:\\n\", corr)\n\n# 13. Pembersihan Data (Filtering capping buatan)\ndf_clean = df[df['MedHouseVal'] < 5.0].copy()\n\n# 14. Pemisahan Fitur dan Target\nX = df_clean.drop(columns=['MedHouseVal'])\ny = df_clean['MedHouseVal']\n\n# 15. Train-Test Split (Reproducible)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# 16. Validasi Preprocessing\nprint(\"\\nDimensi X_train:\", X_train.shape, \"Dimensi X_test:\", X_test.shape)",
      "verified": true
    }
  ],
  "capstoneProject": {
    "title": "Proyek Akhir Komprehensif: Rekayasa Sistem Machine Learning Terintegrasi",
    "description": "Membangun, melatih, mengevaluasi, dan men-deploy arsitektur Machine Learning end-to-end menggunakan dataset nyata dengan standar produksi industri.",
    "requirements": [
      "Menggunakan data dunia nyata dengan pembagian train/val/test yang ketat tanpa kebocoran data",
      "Menyertakan analisis formulasi matematis dan fungsi objektif yang digunakan",
      "Mengimplementasikan pengujian otomatis unit testing dan evaluasi metrik objektif",
      "Menghasilkan dokumentasi teknis dan visualisasi performa model yang dapat direproduksi"
    ],
    "rubrics": [
      "Ketepatan metodologi ilmiah dan pembuktian matematis: 30%",
      "Kualitas arsitektur kode dan kepatuhan clean code: 25%",
      "Kekokohan evaluasi, validasi silang, dan pencegahan overfitting: 25%",
      "Dokumentasi laporan teknis dan reproduksibilitas eksperimen: 20%"
    ]
  },
  "chapters": [
    ...chunk1Foundations,
    ...chunk2LinearModels,
    ...chunk3TreeEnsembles,
    ...chunk4Unsupervised,
    ...chunk5ValidationProduction,
  ]
};
