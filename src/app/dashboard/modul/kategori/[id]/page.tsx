"use client";

import React, { useEffect, useState, use, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Plus,
  Layers,
  Search,
  X,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { CodeBlock } from "@/components/ui/code-block";
import { getCategoryDetails, getModules, deleteModule } from "@/actions/study-actions";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { ModuleListItem } from "@/components/modul/module-list-item";
import { ModuleFilePreviewerModal } from "@/components/modul/module-file-previewer-modal";
import {
  ModuleDriveFile,
  ModuleSection,
  extractModuleDriveFromNotes,
} from "@/types/module-drive";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";
import { getCategoryIconComponent } from "@/components/modul/category-icon";
import { toast } from "sonner";

// Preset Topik Materi Silabus AI (Kurikulum Standar untuk Kategori AI berbasis ModuleSection)
function getDefaultAiSections(categoryName: string): ModuleSection[] {
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

  // Default AI Fundamentals
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

export default function DedicatedCategoryModulesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;
  const router = useRouter();

  // State
  const [category, setCategory] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Filter internal modul
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [contentMode, setContentMode] = useState<"all" | "module" | "project">("all");
  const [previewFile, setPreviewFile] = useState<ModuleDriveFile | null>(null);
  const [bookmarkMap, setBookmarkMap] = useState<{ [id: string]: boolean }>({});

  // Accordion state untuk topik silabus
  const [expandedTopics, setExpandedTopics] = useState<{ [id: string]: boolean }>({
    "ml-sec-1": true,
    "dl-sec-1": true,
    "nlp-sec-1": true,
    "cv-sec-1": true,
    "fund-sec-1": true,
  });

  const toggleTopicExpand = (id: string) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Auth Check
  useEffect(() => {
    async function checkAuth() {
      try {
        const localRole = typeof window !== "undefined" ? localStorage.getItem("user_role") : null;
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setCurrentUserId(user.id);
          const email = (user.email || "").toLowerCase().trim();
          if (localRole === "admin" || isAdminUser(email)) {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    }
    checkAuth();
  }, []);

  // Fetch Category & its Modules
  const loadData = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const decodedId = decodeURIComponent(categoryId).trim();

      const [catData, allModules] = await Promise.all([
        getCategoryDetails(decodedId),
        getModules(),
      ]);

      // Resolve category info
      let resolvedCat = catData?.category || catData;

      if (!resolvedCat) {
        // Fallback pencarian di preset SYSTEM_PRIMARY_CATEGORIES
        const aiPrimary = SYSTEM_PRIMARY_CATEGORIES.find((p) => p.name === "Kecerdasan Buatan");
        const foundSub = aiPrimary?.subcategories.find(
          (s) =>
            s.name.toLowerCase() === decodedId.toLowerCase() ||
            s.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === decodedId.toLowerCase()
        );

        if (foundSub) {
          resolvedCat = {
            id: foundSub.name,
            name: foundSub.name,
            color: foundSub.color || "#8B5CF6",
            icon: foundSub.icon || "machine_learning",
            description: `Kurikulum komprehensif materi ${foundSub.name} berbasis teori dan implementasi praktikum kode.`,
          };
        } else {
          resolvedCat = {
            id: decodedId,
            name: decodedId,
            color: "#8B5CF6",
            icon: "machine_learning",
            description: "Kumpulan modul kurikulum dan repositori proyek pembelajaran Kecerdasan Buatan.",
          };
        }
      }

      setCategory(resolvedCat);

      if (allModules) {
        const catNameLower = (resolvedCat.name || decodedId).toLowerCase().trim();
        const catIdLower = (resolvedCat.id || decodedId).toLowerCase().trim();

        const filtered = allModules.filter((m) => {
          const mCatId = (m.category_id || m.category?.id || "").toLowerCase().trim();
          const mCatName = (m.category?.name || "").toLowerCase().trim();
          return (
            mCatId === catIdLower ||
            mCatName === catNameLower ||
            (catNameLower.includes("fundamentals") && (!mCatName || mCatName === "kecerdasan buatan"))
          );
        });

        setModules(filtered);

        const bmState: { [id: string]: boolean } = {};
        filtered.forEach((m) => {
          bmState[m.id] = isBookmarked(m.id);
        });
        setBookmarkMap(bmState);
      }
    } catch (err) {
      console.error("Failed to load category modules:", err);
      setError("Data kategori dan modul belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Delete
  const handleDeleteModule = async (id: string) => {
    try {
      await deleteModule(id);
      setModules((prev) => prev.filter((m) => m.id !== id));
      toast.success("Modul berhasil dihapus.");
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus modul.");
    }
  };

  // Handle Bookmark
  const handleToggleBookmark = (mod: any) => {
    const nextState = toggleBookmark({
      id: mod.id,
      title: mod.title,
      type: mod.kind === "project" ? "project" : "module",
      url: `/dashboard/modul?module=${mod.id}`,
      category: mod.category?.name || category?.name || "Modul",
      subtitle: mod.author_name || "Velqora",
    });
    setBookmarkMap((prev) => ({ ...prev, [mod.id]: nextState }));
    toast.success(
      nextState ? "Disimpan ke Bookmark." : "Dihapus dari Bookmark."
    );
  };

  // Kumpulan Topik Materi (ModuleSection)
  const allTopicSections = useMemo(() => {
    const catName = category?.name || decodeURIComponent(categoryId);
    const defaults = getDefaultAiSections(catName);

    // Kumpulkan section tambahan dari modul yang tersimpan di DB
    const dbSections: ModuleSection[] = [];
    modules.forEach((mod) => {
      const drive = extractModuleDriveFromNotes(mod.notes || "");
      if (drive?.sections && drive.sections.length > 0) {
        drive.sections.forEach((sec) => {
          dbSections.push({
            ...sec,
            title: `${sec.title} (${mod.title})`,
          });
        });
      }
    });

    return [...defaults, ...dbSections];
  }, [category, categoryId, modules]);

  // Filtered module list
  const filteredModules = useMemo(() => {
    let list = [...modules];

    if (contentMode === "module") {
      list = list.filter((m) => m.kind !== "project");
    } else if (contentMode === "project") {
      list = list.filter((m) => m.kind === "project");
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q)
      );
    }

    if (levelFilter) {
      list = list.filter((m) => m.level === levelFilter);
    }

    return list;
  }, [modules, contentMode, search, levelFilter]);

  const themeColor = category?.color || "#8B5CF6";
  const CategoryIcon = getCategoryIconComponent(category?.icon);

  return (
    <PageContainer className="space-y-6 pb-14">
      {/* ─── 1. Breadcrumb Navigasi ─── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-text-tertiary">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/dashboard/modul" className="hover:text-text-primary transition-colors">
          Katalog Modul AI
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-text-primary font-bold truncate">
          {category?.name || decodeURIComponent(categoryId)}
        </span>
      </nav>

      {/* ─── 2. Header Kategori & Deskripsi ─── */}
      <header className="p-5 sm:p-6 vt-window bg-[#FFFFFF] dark:bg-[#18181B] border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border mt-0.5"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}35`,
                color: themeColor,
              }}
            >
              <CategoryIcon className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-secondary text-text-secondary uppercase border border-border">
                  Kurikulum AI
                </span>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: `${themeColor}10`,
                    borderColor: `${themeColor}30`,
                    color: themeColor,
                  }}
                >
                  {allTopicSections.length} Topik Silabus
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-secondary text-text-secondary border border-border">
                  {modules.length} Modul Terkait
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display">
                {category?.name || decodeURIComponent(categoryId)}
              </h1>

              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
                {category?.description ||
                  `Materi dan silabus kurikulum Kecerdasan Buatan untuk topik ${category?.name || decodeURIComponent(categoryId)}, mencakup dasar teori, pemodelan matematis, dan implementasi kode.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start">
            <Link href={`/dashboard/modul/baru?category=${encodeURIComponent(category?.id || categoryId)}`}>
              <Button size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Modul</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-between gap-3 text-xs sm:text-sm text-rose-600 dark:text-rose-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={loadData}
            className="text-xs gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {/* ─── 3. Daftar Topik Materi (Expandable Accordion) ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Daftar Topik Silabus Materi ({allTopicSections.length})</span>
            </h2>
            <p className="text-xs text-text-secondary font-mono">
              Klik topik untuk mempelajari penjelasan konsep dan melihat contoh implementasi kode
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {allTopicSections.map((section, idx) => {
            const isExpanded = Boolean(expandedTopics[section.id]);

            return (
              <div
                key={section.id || idx}
                className="vt-window bg-[#FFFFFF] dark:bg-[#18181B] border border-border overflow-hidden transition-all shadow-xs"
              >
                {/* Accordion Titlebar */}
                <button
                  type="button"
                  onClick={() => toggleTopicExpand(section.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-secondary/40 transition-colors cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 border"
                      style={{
                        backgroundColor: `${themeColor}15`,
                        borderColor: `${themeColor}35`,
                        color: themeColor,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-text-primary truncate">
                      {section.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-text-tertiary">
                    <span className="text-xs font-mono hidden sm:inline">
                      {isExpanded ? "Tutup" : "Buka Materi"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Expanded Content: Deskripsi & Blok Kode */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 space-y-4 border-t border-border/50 bg-[#FAF8F5] dark:bg-[#141416]">
                    {section.description && (
                      <div className="pt-3">
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                          {section.description}
                        </p>
                      </div>
                    )}

                    {/* Blok Kode Praktikum dengan Komponen CodeBlock Reusable */}
                    {section.codeSnippets && section.codeSnippets.length > 0 && (
                      <div className="space-y-3 pt-1">
                        {section.codeSnippets.map((snippet) => (
                          <CodeBlock
                            key={snippet.id}
                            code={snippet.code}
                            language={snippet.language}
                            title={snippet.caption}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 4. Modul & Proyek Terkait di Kategori Ini ─── */}
      <section className="space-y-3 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Modul & Proyek Belajar Terdaftar ({filteredModules.length})</span>
            </h3>
            <p className="text-xs text-text-secondary font-mono">
              Koleksi repositori modul silabus dan kode praktikum di kategori ini
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-secondary border border-border text-xs w-fit">
            {[
              { id: "all", label: "Semua" },
              { id: "module", label: "Modul" },
              { id: "project", label: "Proyek" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setContentMode(m.id as any)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  contentMode === m.id
                    ? "bg-brand-600 text-white font-bold shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Input Search & Level */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] flex items-center border border-border bg-surface">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari modul atau project dalam topik ini..."
              className="w-full pl-9 pr-9 py-2 min-h-[36px] bg-transparent text-xs text-text-primary placeholder:text-text-tertiary focus:outline-hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 p-1 text-text-tertiary hover:text-text-primary cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 min-h-[36px] border border-border bg-surface text-xs font-mono text-text-primary cursor-pointer focus:outline-hidden"
            aria-label="Filter tingkat"
          >
            <option value="">Semua Tingkat</option>
            <option value="pemula">Pemula</option>
            <option value="menengah">Menengah</option>
            <option value="lanjutan">Lanjutan</option>
          </select>
        </div>

        {/* Modules List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-2"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredModules.length === 0 ? (
          <EmptyState
            icon={<Layers className="w-8 h-8" />}
            title="Belum ada modul spesifik di topik ini"
            description="Tambahkan materi atau proyek belajar pertama untuk topik ini guna melengkapi kurikulum Anda."
            action={
              <Link href={`/dashboard/modul/baru?category=${encodeURIComponent(category?.id || categoryId)}`}>
                <Button size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Modul</span>
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredModules.map((mod) => (
              <ModuleListItem
                key={mod.id}
                module={mod}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                isBookmarked={Boolean(bookmarkMap[mod.id])}
                onToggleBookmark={handleToggleBookmark}
                onEdit={(item) => router.push(`/dashboard/modul/edit/${item.id}`)}
                onDelete={handleDeleteModule}
                onFilePreview={(file) => setPreviewFile(file)}
              />
            ))}
          </div>
        )}
      </section>

      {/* File Previewer Modal */}
      {previewFile && (
        <ModuleFilePreviewerModal
          isOpen={Boolean(previewFile)}
          onClose={() => setPreviewFile(null)}
          file={previewFile}
        />
      )}
    </PageContainer>
  );
}
