import type { NotebookKernel, VfsFileEntry } from "./types";

export interface SampleDatasetSpec {
  id: string;
  filename: string;
  title: string;
  description: string;
  category: "Akademik" | "Bisnis" | "Machine Learning" | "Sains";
  rows: number;
  columns: number;
  csvContent: string;
}

export interface NotebookSnippetSpec {
  id: string;
  category: "Dataset & Pandas" | "Visualisasi" | "SQLite" | "Statistik & ML";
  title: string;
  description: string;
  kernel: NotebookKernel;
  code: string;
}

export const SAMPLE_DATASETS: SampleDatasetSpec[] = [
  {
    id: "academic-scores",
    filename: "nilai_akademik_mahasiswa.csv",
    title: "Nilai Akademik Mahasiswa",
    description: "Data IPK, SKS, kehadiran, tugas, UTS, dan UAS 25 mahasiswa.",
    category: "Akademik",
    rows: 25,
    columns: 11,
    csvContent: [
      "nim,nama,jurusan,semester,sks,ipk,kehadiran_persen,nilai_tugas,nilai_uts,nilai_uas,status",
      "2401001,Alya Putri,Teknik Informatika,4,22,3.91,96,92,89,94,Lulus",
      "2401002,Bima Pratama,Data Science,4,22,3.84,94,88,86,90,Lulus",
      "2401003,Citra Lestari,Kecerdasan Artifisial,6,20,3.95,98,95,93,96,Lulus",
      "2401004,Dimas Wijaya,Sistem Informasi,4,20,3.42,84,78,74,80,Lulus",
      "2401005,Eka Saputra,Teknik Informatika,2,20,3.18,79,72,68,75,Lulus",
      "2401006,Fajar Nugroho,Data Science,6,18,3.67,90,85,82,88,Lulus",
      "2401007,Gita Rahma,Kecerdasan Artifisial,4,22,3.89,95,91,88,92,Lulus",
      "2401008,Hadi Kusuma,Teknik Informatika,2,18,2.76,68,64,58,62,Perbaikan",
      "2401009,Intan Permata,Sistem Informasi,6,20,3.74,92,87,84,89,Lulus",
      "2401010,Joko Santoso,Data Science,4,20,3.31,82,76,72,78,Lulus",
      "2401011,Kirana Dewi,Kecerdasan Artifisial,2,20,3.82,94,90,85,88,Lulus",
      "2401012,Lukman Hakim,Teknik Informatika,6,18,2.94,72,68,63,67,Perbaikan",
      "2401013,Maya Sari,Data Science,4,22,3.79,91,86,84,87,Lulus",
      "2401014,Nanda Rizky,Sistem Informasi,2,20,3.55,88,81,79,83,Lulus",
      "2401015,Omar Farhan,Kecerdasan Artifisial,6,20,3.88,96,90,87,93,Lulus",
      "2401016,Putri Amelia,Teknik Informatika,4,22,3.62,89,84,80,85,Lulus",
      "2401017,Qori Hidayat,Data Science,2,18,2.65,64,60,55,59,Perbaikan",
      "2401018,Rina Kartika,Sistem Informasi,6,20,3.71,91,85,82,86,Lulus",
      "2401019,Satria Putra,Teknik Informatika,4,22,3.86,95,89,87,91,Lulus",
      "2401020,Tari Wulandari,Kecerdasan Artifisial,4,20,3.77,93,88,83,86,Lulus",
      "2401021,Umar Abdullah,Data Science,6,20,3.49,86,80,76,81,Lulus",
      "2401022,Vina Melati,Sistem Informasi,4,20,3.68,90,84,81,85,Lulus",
      "2401023,Wahyu Ramadhan,Teknik Informatika,6,22,3.93,97,94,91,95,Lulus",
      "2401024,Xena Maharani,Data Science,2,20,3.58,87,83,78,84,Lulus",
      "2401025,Yusuf Mahendra,Kecerdasan Artifisial,4,20,3.24,80,75,71,76,Lulus",
    ].join("\n"),
  },
  {
    id: "ecommerce-sales",
    filename: "penjualan_ecommerce.csv",
    title: "Penjualan E-Commerce",
    description: "Transaksi retail multi-kategori, kota, diskon, dan rating pelanggan.",
    category: "Bisnis",
    rows: 24,
    columns: 10,
    csvContent: [
      "order_id,tanggal,kategori,produk,kota,qty,harga_satuan,diskon_persen,total_bayar,rating",
      "ORD-101,2026-01-03,Elektronik,Mechanical Keyboard,Jakarta,2,850000,10,1530000,4.9",
      "ORD-102,2026-01-04,Buku,Clean Code Handbook,Bandung,3,240000,0,720000,4.8",
      "ORD-103,2026-01-05,Aksesoris,USB-C Hub 8-in-1,Surabaya,4,320000,5,1216000,4.6",
      "ORD-104,2026-01-06,Elektronik,Monitor Stand Pro,Jakarta,1,690000,15,586500,4.7",
      "ORD-105,2026-01-08,Perabot,Lampu Meja LED,Yogyakarta,2,280000,0,560000,4.8",
      "ORD-106,2026-01-09,Buku,Statistika Terapan,Medan,5,195000,10,877500,4.9",
      "ORD-107,2026-01-10,Elektronik,Mouse Wireless Ergonomis,Bandung,3,450000,10,1215000,4.7",
      "ORD-108,2026-01-12,Aksesoris,Laptop Sleeve 14 Inch,Jakarta,4,175000,0,700000,4.5",
      "ORD-109,2026-01-14,Perabot,Kursi Belajar Mesh,Surabaya,1,1650000,10,1485000,4.8",
      "ORD-110,2026-01-15,Buku,Deep Learning Dasar,Jakarta,2,310000,5,589000,5.0",
      "ORD-111,2026-01-17,Elektronik,Webcam Full HD,Semarang,2,540000,0,1080000,4.6",
      "ORD-112,2026-01-18,Aksesoris,Desk Mat Felt XL,Bandung,5,145000,10,652500,4.7",
      "ORD-113,2026-01-20,Elektronik,Headphone ANC,Jakarta,1,1250000,15,1062500,4.9",
      "ORD-114,2026-01-21,Buku,SQL & Data Warehouse,Yogyakarta,3,225000,0,675000,4.8",
      "ORD-115,2026-01-23,Perabot,Rak Buku Minimalis,Bandung,2,490000,5,931000,4.5",
      "ORD-116,2026-01-25,Aksesoris,Cooling Pad Dual Fan,Surabaya,3,210000,0,630000,4.4",
      "ORD-117,2026-01-27,Elektronik,SSD Eksternal 1TB,Jakarta,2,1350000,10,2430000,4.9",
      "ORD-118,2026-01-28,Buku,Matematika Diskrit,Malang,4,180000,5,684000,4.7",
      "ORD-119,2026-01-30,Perabot,Meja Lipat Belajar,Medan,2,375000,0,750000,4.6",
      "ORD-120,2026-02-01,Elektronik,Microphone Condenser,Jakarta,1,780000,10,702000,4.8",
      "ORD-121,2026-02-03,Aksesoris,Kabel HDMI 2.1,Bandung,6,110000,0,660000,4.6",
      "ORD-122,2026-02-05,Buku,Python untuk Data Science,Jakarta,4,265000,10,954000,5.0",
      "ORD-123,2026-02-07,Elektronik,Stylus Pen Aktif,Surabaya,2,420000,5,798000,4.7",
      "ORD-124,2026-02-09,Perabot,Organizer Meja Kayu,Yogyakarta,3,165000,0,495000,4.8",
    ].join("\n"),
  },
  {
    id: "iris-classic",
    filename: "iris_dataset.csv",
    title: "Iris Dataset (Klasifikasi ML)",
    description: "Dataset klasik 3 spesies bunga Iris untuk klasifikasi & clustering.",
    category: "Machine Learning",
    rows: 30,
    columns: 5,
    csvContent: [
      "sepal_length,sepal_width,petal_length,petal_width,species",
      "5.1,3.5,1.4,0.2,Iris-setosa",
      "4.9,3.0,1.4,0.2,Iris-setosa",
      "4.7,3.2,1.3,0.2,Iris-setosa",
      "4.6,3.1,1.5,0.2,Iris-setosa",
      "5.0,3.6,1.4,0.2,Iris-setosa",
      "5.4,3.9,1.7,0.4,Iris-setosa",
      "4.6,3.4,1.4,0.3,Iris-setosa",
      "5.0,3.4,1.5,0.2,Iris-setosa",
      "4.4,2.9,1.4,0.2,Iris-setosa",
      "4.9,3.1,1.5,0.1,Iris-setosa",
      "7.0,3.2,4.7,1.4,Iris-versicolor",
      "6.4,3.2,4.5,1.5,Iris-versicolor",
      "6.9,3.1,4.9,1.5,Iris-versicolor",
      "5.5,2.3,4.0,1.3,Iris-versicolor",
      "6.5,2.8,4.6,1.5,Iris-versicolor",
      "5.7,2.8,4.5,1.3,Iris-versicolor",
      "6.3,3.3,4.7,1.6,Iris-versicolor",
      "4.9,2.4,3.3,1.0,Iris-versicolor",
      "6.6,2.9,4.6,1.3,Iris-versicolor",
      "5.2,2.7,3.9,1.4,Iris-versicolor",
      "6.3,3.3,6.0,2.5,Iris-virginica",
      "5.8,2.7,5.1,1.9,Iris-virginica",
      "7.1,3.0,5.9,2.1,Iris-virginica",
      "6.3,2.9,5.6,1.8,Iris-virginica",
      "6.5,3.0,5.8,2.2,Iris-virginica",
      "7.6,3.0,6.6,2.1,Iris-virginica",
      "4.9,2.5,4.5,1.7,Iris-virginica",
      "7.3,2.9,6.3,1.8,Iris-virginica",
      "6.7,2.5,5.8,1.8,Iris-virginica",
      "7.2,3.6,6.1,2.5,Iris-virginica",
    ].join("\n"),
  },
  {
    id: "daily-weather",
    filename: "cuaca_harian.csv",
    title: "Cuaca Harian (Time-Series)",
    description: "Catatan suhu, kelembaban, curah hujan, dan kecepatan angin 21 hari.",
    category: "Sains",
    rows: 21,
    columns: 7,
    csvContent: [
      "tanggal,kota,suhu_c,kelembaban_persen,curah_hujan_mm,kecepatan_angin_kmh,kondisi",
      "2026-03-01,Bandung,24.2,78,4.5,11.2,Berawan",
      "2026-03-02,Bandung,25.1,74,0.0,9.8,Cerah",
      "2026-03-03,Bandung,23.4,85,16.8,14.5,Hujan Ringan",
      "2026-03-04,Bandung,22.8,89,28.4,17.0,Hujan Sedang",
      "2026-03-05,Bandung,24.6,76,1.2,10.4,Berawan",
      "2026-03-06,Bandung,26.0,70,0.0,8.6,Cerah",
      "2026-03-07,Bandung,26.4,68,0.0,9.1,Cerah",
      "2026-03-08,Jakarta,31.2,72,0.0,13.4,Cerah",
      "2026-03-09,Jakarta,32.0,69,0.0,14.0,Cerah",
      "2026-03-10,Jakarta,29.5,82,22.1,19.2,Hujan Sedang",
      "2026-03-11,Jakarta,28.8,86,34.5,21.5,Hujan Lebat",
      "2026-03-12,Jakarta,30.4,77,3.0,12.8,Berawan",
      "2026-03-13,Jakarta,31.6,71,0.0,11.5,Cerah",
      "2026-03-14,Jakarta,32.3,68,0.0,10.9,Cerah",
      "2026-03-15,Surabaya,32.8,66,0.0,15.3,Cerah",
      "2026-03-16,Surabaya,33.1,64,0.0,16.1,Cerah",
      "2026-03-17,Surabaya,30.9,76,9.4,18.0,Berawan",
      "2026-03-18,Surabaya,29.7,83,19.6,20.4,Hujan Ringan",
      "2026-03-19,Surabaya,31.4,73,0.5,14.2,Berawan",
      "2026-03-20,Surabaya,32.5,67,0.0,13.8,Cerah",
      "2026-03-21,Surabaya,33.0,65,0.0,14.9,Cerah",
    ].join("\n"),
  },
];

export const NOTEBOOK_SNIPPETS: NotebookSnippetSpec[] = [
  {
    id: "pandas-eda",
    category: "Dataset & Pandas",
    title: "Eksplorasi Cepat Dataset CSV",
    description: "Muat CSV dari /workspace, cek dimensi, tipe kolom, nilai kosong, dan ringkasan statistik.",
    kernel: "python",
    code: `import pandas as pd

df = pd.read_csv("/workspace/nilai_akademik_mahasiswa.csv")
print(f"Dimensi: {df.shape[0]} baris x {df.shape[1]} kolom")
print("\\nNilai Kosong per Kolom:")
print(df.isna().sum())
df`,
  },
  {
    id: "pandas-groupby",
    category: "Dataset & Pandas",
    title: "Agregasi & GroupBy Tabel",
    description: "Kelompokkan data berdasarkan kategori dan hitung rata-rata serta jumlah data.",
    kernel: "python",
    code: `import pandas as pd

# Ganti nama file & kolom sesuai dataset Anda
ringkasan = df.groupby(df.select_dtypes(include="object").columns[0]).agg(
    jumlah=("ipk" if "ipk" in df.columns else df.columns[0], "count"),
).reset_index()
ringkasan`,
  },
  {
    id: "mpl-bar-line",
    category: "Visualisasi",
    title: "Grafik Matplotlib Bersih",
    description: "Buat visualisasi batang & garis dengan grid rapi dan label otomatis.",
    kernel: "python",
    code: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(7, 3.8))
x = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"]
y = [68, 74, 81, 79, 88, 94]

bars = ax.bar(x, y, color="#C2553A", alpha=0.88, width=0.55)
ax.plot(x, y, color="#1C1917", marker="o", linewidth=1.8)
ax.set_title("Tren Performa Bulanan", fontweight="bold")
ax.set_ylabel("Skor")
ax.grid(axis="y", linestyle="--", alpha=0.35)
plt.tight_layout()
plt.show()`,
  },
  {
    id: "sqlite-explore",
    category: "SQLite",
    title: "Lihat Semua Tabel & Query",
    description: "Daftar semua tabel dari file dataset yang ter-mount otomatis ke SQLite.",
    kernel: "sql",
    code: `SELECT name AS nama_tabel, type AS tipe
FROM sqlite_master
WHERE type IN ('table', 'view')
ORDER BY name;`,
  },
  {
    id: "sklearn-linear",
    category: "Statistik & ML",
    title: "Regresi Linear (Scikit-Learn)",
    description: "Latih model regresi linear sederhana dan evaluasi dengan R² & MSE.",
    kernel: "python",
    code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

X = np.array([[2], [4], [6], [8], [10], [12]])
y = np.array([58, 66, 74, 83, 91, 97])

model = LinearRegression().fit(X, y)
pred = model.predict(X)
print(f"Slope: {model.coef_[0]:.3f} | Intercept: {model.intercept_:.3f}")
print(f"R² Score: {r2_score(y, pred):.4f} | MSE: {mean_squared_error(y, pred):.4f}")`,
  },
];

export function getSafeSqlTableName(fileName: string): string {
  return (
    fileName
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_]/g, "_")
      .replace(/^(\d)/, "t_$1")
      .toLowerCase() || "dataset"
  );
}

export function buildDatasetSnippets(file: VfsFileEntry): {
  pandasRead: string;
  pandasPlot: string;
  pandasStats: string;
  sqlQuery: string;
} {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const tableName = getSafeSqlTableName(file.name);

  let pandasRead = `with open("${file.path}", "r", encoding="utf-8") as f:\n    isi = f.read()\nprint(isi[:600])`;

  if (ext === "csv" || ext === "tsv") {
    const sepArg = ext === "tsv" ? ', sep="\\t"' : "";
    pandasRead = `import pandas as pd\n\ndf = pd.read_csv("${file.path}"${sepArg})\nprint(f"Shape: {df.shape}")\ndf`;
  } else if (ext === "xlsx" || ext === "xls") {
    pandasRead = `import pandas as pd\n\ndf = pd.read_excel("${file.path}")\nprint(f"Shape: {df.shape}")\ndf`;
  } else if (ext === "json") {
    pandasRead = `import pandas as pd\n\ntry:\n    df = pd.read_json("${file.path}")\nexcept ValueError:\n    import json\n    with open("${file.path}", "r", encoding="utf-8") as f:\n        df = pd.json_normalize(json.load(f))\ndf`;
  }

  const pandasPlot = `${pandasRead.split("\n").slice(0, -1).join("\n")}
import matplotlib.pyplot as plt

num_cols = df.select_dtypes(include="number").columns.tolist()
if num_cols:
    fig, ax = plt.subplots(figsize=(7, 3.8))
    df[num_cols[:3]].head(20).plot(kind="bar", ax=ax)
    ax.set_title("Ringkasan Visual: ${file.name}")
    ax.grid(axis="y", linestyle="--", alpha=0.35)
    plt.tight_layout()
    plt.show()
else:
    print("Tidak ada kolom numerik untuk digambar otomatis.")`;

  const pandasStats = `${pandasRead.split("\n").slice(0, -1).join("\n")}
print("=== Missing Values (Null) ===")
print(df.isna().sum())
print("\\n=== Statistik Deskriptif ===")
df.describe(include="all")`;

  const sqlQuery = `SELECT * FROM ${tableName} LIMIT 25;`;

  return { pandasRead, pandasPlot, pandasStats, sqlQuery };
}

/**
 * Mengonversi URL GitHub blob atau Google Sheets menjadi URL unduhan langsung (raw/CSV).
 */
export function normalizeDatasetUrl(rawUrl: string): {
  fetchUrl: string;
  suggestedFileName: string;
} {
  const trimmed = rawUrl.trim();
  const parsed = new URL(trimmed);

  // GitHub file page -> raw.githubusercontent.com
  if (parsed.hostname === "github.com") {
    const parts = parsed.pathname.split("/").filter(Boolean);
    const blobIdx = parts.indexOf("blob");
    if (blobIdx >= 2 && parts.length > blobIdx + 1) {
      const owner = parts[0];
      const repo = parts[1];
      const rest = parts.slice(blobIdx + 1).join("/");
      const fetchUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${rest}`;
      const name = parts[parts.length - 1] || "dataset.csv";
      return { fetchUrl, suggestedFileName: name };
    }
  }

  // Google Sheets link -> CSV export
  if (
    parsed.hostname === "docs.google.com" &&
    parsed.pathname.includes("/spreadsheets/d/")
  ) {
    const match = parsed.pathname.match(/\/spreadsheets\/d\/([^/]+)/);
    if (match?.[1]) {
      const gid = parsed.searchParams.get("gid") || parsed.hash.match(/gid=(\d+)/)?.[1];
      const fetchUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv${
        gid ? `&gid=${gid}` : ""
      }`;
      return { fetchUrl, suggestedFileName: `gsheet_${match[1].slice(0, 8)}.csv` };
    }
  }

  const lastSegment = parsed.pathname.split("/").filter(Boolean).pop() || "";
  const suggestedFileName = lastSegment.includes(".")
    ? decodeURIComponent(lastSegment)
    : "imported_dataset.csv";

  return { fetchUrl: trimmed, suggestedFileName };
}
