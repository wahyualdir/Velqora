import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: DATA ENGINEERING & BIG DATA UNTUK AI (TOPIK 10) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Kleppmann, M. (2017). Designing Data-Intensive Applications. O'Reilly Media.
 * - Armbrust, M., et al. (2020). Lakehouse: A New Generation of Open Platforms. CIDR 2021.
 * - Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media.
 * - Reis, J., & Housley, M. (2022). Fundamentals of Data Engineering. O'Reilly Media.
 */
export const dataEngineeringAiCurriculum: AcademicCurriculum = {
  id: "data-engineering-ai",
  slug: "data-engineering-big-data-ai",
  title: "Data Engineering & Big Data untuk AI",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Arsitektur rekayasa data skala petabyte untuk sistem AI: format penyimpanan kolumnar terdistribusi (Parquet, Delta Lake), pemrosesan terdistribusi Apache Spark, orkestrasi DAG pipa data (Apache Airflow), kontrak data (Data Contracts), validasi integritas skema, dan ingestion streaming berlatensi rendah.",
  estimatedHours: 56,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Designing Data-Intensive Applications",
      authors: ["Martin Kleppmann"],
      type: "book",
      url: "https://dataintensive.net/",
      relevance: "Prinsip keandalan, skalabilitas, model konsistensi ACID, replikasi partisi, dan sistem pemrosesan batch/stream.",
      year: 2017,
      publisherOrVenue: "O'Reilly Media",
    },
    {
      title: "Spark: The Definitive Guide: Big Data Processing Made Simple",
      authors: ["Bill Chambers", "Matei Zaharia"],
      type: "book",
      url: "https://www.oreilly.com/library/view/spark-the-definitive/9781491912201/",
      relevance: "Arsitektur Catalyst Optimizer, Spark SQL, operasi shuffle, dan Directed Acyclic Graph (DAG) executor.",
      year: 2018,
      publisherOrVenue: "O'Reilly Media",
    },
    {
      title: "Lakehouse: A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics",
      authors: ["Michael Armbrust", "Ali Ghodsi", "Reynold Xin", "Matei Zaharia"],
      type: "paper",
      url: "https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf",
      relevance: "Pola arsitektur Medallion (Bronze, Silver, Gold), transaksi ACID pada object storage, dan zero-copy clone.",
      year: 2021,
      publisherOrVenue: "CIDR 2021",
    },
  ],
  chapters: [
    {
      id: "de-bab-1",
      slug: "format-kolumnar-dan-arsitektur-parquet",
      title: "BAB 1: Format Penyimpanan Kolumnar & Arsitektur Parquet",
      orderIndex: 1,
      description: "Perbandingan penyimpanan berorientasi baris vs kolom, skema biner Apache Parquet, teknik kompresi (Dictionary Encoding, Run-Length Encoding), dan optimasi Predicate Pushdown.",
      subchapters: [
        {
          id: "de-bab-1-1",
          slug: "anatomi-internal-parquet-dan-pushdown",
          title: "1.1. Anatomi Internal Apache Parquet & Predicate Pushdown",
          orderIndex: 1,
          description: "Struktur file Parquet (Header, Row Groups, Column Chunks, Pages, Footer Metadata) dan mekanisme skipping I/O berbasis min/max statistik.",
          content_markdown: `# 1.1. Anatomi Internal Apache Parquet & Predicate Pushdown

## 1. Perbandingan Baris vs Kolom
- **Row-Oriented (CSV, JSON, Postgres Heap Tables)**: Seluruh atribut dalam satu baris disimpan bersebelahan di memori/disk. Efisien untuk transaksi OLTP tunggal (\`INSERT/UPDATE by ID\`), namun sangat lambat untuk kueri agregasi analitik karena membaca 100% data yang tidak relevan.
- **Column-Oriented (Parquet, ORC)**: Nilai dari satu kolom disimpan dalam blok memori yang bersebelahan (*contiguous memory*). Rasio kompresi sangat tinggi karena homogenitas tipe data (misal: array integer yang berurutan).

## 2. Struktur Internal File Parquet
1. **Magic Bytes**: 4 byte header (\`PAR1\`) dan 4 byte footer (\`PAR1\`).
2. **Row Groups**: Partisi logis baris horizontal (umumnya 128 MB – 512 MB per group).
3. **Column Chunks**: Data satu kolom tertentu di dalam satu Row Group.
4. **Pages**: Unit kompresi dan encoding terkecil (umumnya 1 MB).
5. **Footer Metadata**: Menyimpan skema skalar dan statistik kolom ($min, max, null\\_count$) untuk setiap Row Group.

## 3. Predicate Pushdown & I/O Pruning
Ketika mesin kueri (seperti Spark, DuckDB, atau Trino) mengeksekusi filter:
$$\\mathbf{WHERE} \\quad \\text{age} > 60$$

Mesin membaca *Footer Metadata* terlebih dahulu. Jika untuk sebuah Row Group:
$$\\text{max}(\\text{age}) = 48 < 60$$
Mesin kueri langsung melompati (*skip*) seluruh blok 128 MB Row Group tersebut dari disk/jaringan tanpa melakukan dekompresi data.
`,
        },
      ],
    },
    {
      id: "de-bab-2",
      slug: "arsitektur-lakehouse-dan-delta-lake",
      title: "BAB 2: Arsitektur Lakehouse & Protokol Transaksi ACID",
      orderIndex: 2,
      description: "Pola arsitektur Medallion (Bronze, Silver, Gold), transaksi ACID pada cloud storage (S3/GCS) menggunakan Delta Lake / Apache Iceberg, Write-Ahead Log (WAL), dan Snapshot Isolation (Time Travel).",
      subchapters: [
        {
          id: "de-bab-2-1",
          slug: "arsitektur-medallion-dan-transaction-log",
          title: "2.1. Arsitektur Medallion & Delta Transaction Log",
          orderIndex: 1,
          description: "Transformasi data multi-hop (Bronze mentah, Silver bersih terstandarisasi, Gold siap bisnis/fitur AI) dan protokol komit atomik JSON/Parquet checkpoint.",
          content_markdown: `# 2.1. Arsitektur Medallion & Delta Transaction Log

## 1. Paradigma Arsitektur Medallion
Arsitektur Lakehouse mengorganisasi penyimpanan data ke dalam tiga lapisan logis:
1. **Bronze Layer (Raw Ingestion)**:
   Menyimpan data mentah persis seperti yang diterima dari produsen (IoT, webhooks, database CDC dump). Skema dipertahankan fleksibel (*append-only*), tanpa modifikasi bisnis.
2. **Silver Layer (Cleaned, Conformed, Enriched)**:
   Data telah divalidasi skema, dihapus duplikasinya, tipe data dinormalisasi, dan digabungkan (*joined*) dengan tabel referensi master. Berfungsi sebagai Single Source of Truth (SSOT).
3. **Gold Layer (Business Aggregates & AI Feature Store)**:
   Data diagregasikan untuk kebutuhan laporan eksekutif atau dipotong menjadi vektor fitur (*Feature Store*) yang dioptimalkan untuk inferensi model Machine Learning.

## 2. Protokol Transaksi ACID pada Object Storage
Cloud storage seperti AWS S3 bersifat *eventually consistent* dan tidak mendukung operasi mutasi atomik secara native. Delta Lake mengatasi ini dengan memelihara direktori \`_delta_log/\`:
- Setiap transaksi menulis file komit JSON bernomor urut (\`000000.json\`, \`000001.json\`).
- Setiap 10 transaksi, dibuat file checkpoint biner Parquet yang merangkum status seluruh file aktif.
- **Optimistic Concurrency Control (OCC)**: Mencegah tabrakan tulis (*write conflict*) antar pekerja terdistribusi.
- **Time Travel**: Kueri dapat dijalankan pada versi historis: \`SELECT * FROM table VERSION AS OF 14\`.
`,
        },
      ],
    },
    {
      id: "de-bab-3",
      slug: "pemrosesan-terdistribusi-apache-spark",
      title: "BAB 3: Pemrosesan Terdistribusi Skala Besar dengan Apache Spark",
      orderIndex: 3,
      description: "Arsitektur eksekusi Spark (Driver, Cluster Manager, Executors), optimasi rencana kueri Catalyst Optimizer, Project Tungsten, mekanisme Shuffle, dan penanganan Data Skew.",
      subchapters: [
        {
          id: "de-bab-3-1",
          slug: "catalyst-optimizer-dan-shuffle-skew",
          title: "3.1. Catalyst Optimizer, Mekanisme Shuffle & Mitigasi Data Skew",
          orderIndex: 1,
          description: "Transformasi dari Unresolved Logical Plan ke Optimized Physical Plan, perbandingan Wide vs Narrow Transformations, dan teknik salting untuk redistribusi kunci pincang.",
          content_markdown: `# 3.1. Catalyst Optimizer, Mekanisme Shuffle & Mitigasi Data Skew

## 1. Pipa Optimasi Catalyst Optimizer
Apache Spark SQL mengoptimalkan kueri deklaratif melalui empat tahap:
1. **Analysis**: Memvalidasi nama kolom dan tabel terhadap *Catalog*. Menghasilkan *Resolved Logical Plan*.
2. **Logical Optimization**: Menerapkan aturan aljabar relasional seperti *Constant Folding*, *Predicate Pushdown*, dan *Projection Pruning*.
3. **Physical Planning**: Memilih strategi eksekusi fisik (misal: memilih *Broadcast Hash Join* jika tabel kecil $< 10$ MB, atau *Sort-Merge Join* untuk tabel besar).
4. **Code Generation (Project Tungsten)**: Menghasilkan bytecode Java langsung (*Whole-Stage Code Generation*) yang berjalan di memori off-heap CPU cache.

## 2. Wide vs Narrow Transformation
- **Narrow Transformation** (\`map\`, \`filter\`): Setiap partisi input hanya berkontribusi pada tepat satu partisi output. Tidak memerlukan transfer data antar-node jaringan.
- **Wide Transformation** (\`groupByKey\`, \`join\`, \`distinct\`): Partisi input harus didistribusikan ulang ke seluruh pekerja jaringan. Proses ini disebut **Shuffle** dan merupakan bottleneck komputasi terbesar di Big Data.

## 3. Mitigasi Data Skew dengan Salting
Ketika distribusi kunci tidak merata (misal: 80% transaksi berasal dari \`seller_id = 9999\`), satu executor akan bekerja berjam-jam sementara executor lain menganggur (*straggler task*).
Solusi: Menambahkan angka acak $k \\in [0, K-1]$ pada kunci (*Salting*):
$$\\text{salted\\_key} = \\text{key} \\;\\Vert\\; \\text{random}(0, K-1)$$
Sehingga data terdistribusi rata ke $K$ partisi berbeda.
`,
        },
      ],
    },
    {
      id: "de-bab-4",
      slug: "orkestrasi-pipa-data-airflow",
      title: "BAB 4: Orkestrasi Pipa Data & Alur Kerja DAG (Apache Airflow)",
      orderIndex: 4,
      description: "Prinsip rekayasa alur kerja terorkestrasi: Directed Acyclic Graph (DAG), idempotensi eksekusi, backfilling deterministik, sensor data, dan pemantauan SLA.",
      subchapters: [
        {
          id: "de-bab-4-1",
          slug: "prinsip-dag-idempoten-dan-backfill",
          title: "4.1. Prinsip Idempotensi DAG, Data Intervals & Backfilling",
          orderIndex: 1,
          description: "Mengapa pipa data harus idempoten ($f(f(x)) = f(x)$), pemisahan Logical Date vs Actual Run Date, dan mitigasi kegagalan parsial.",
          content_markdown: `# 4.1. Prinsip Idempotensi DAG, Data Intervals & Backfilling

## 1. Prinsip Fundamental Idempotensi
Pipa data dikatakan **idempoten** jika dieksekusi berkali-kali dengan parameter masukan yang sama, kondisi akhir data di database/lakehouse tetap identik dan tidak menghasilkan duplikasi baris:

$$f(f(x)) = f(x)$$

Pola antipattern yang melanggar idempotensi: kueri \`INSERT INTO sales ...\` tanpa partisi tanggal unik. Pola yang benar: operasi atomik \`INSERT OVERWRITE\` atau \`MERGE INTO\` (*Upsert*).

## 2. Struktur Definisi DAG Airflow yang Benar
\`\`\`python
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator

default_args = {
    "owner": "velqora-data-platform",
    "depends_on_past": False,
    "email_on_failure": True,
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
}

def extract_raw_events(ds, **kwargs):
    # Menggunakan parameter logis 'ds' (YYYY-MM-DD) menjamin eksekusi idempoten
    print(f"Mengekstraksi data logis untuk partisi tanggal: {ds}")

with DAG(
    dag_id="curated_feature_pipeline_daily",
    default_args=default_args,
    description="Pipa harian transformasi data mentah menjadi feature store",
    schedule_interval="0 2 * * *", # Berjalan pukul 02:00 UTC
    start_date=datetime(2026, 1, 1),
    catchup=False,
    max_active_runs=1,
) as dag:
    
    t1 = PythonOperator(
        task_id="extract_raw",
        python_callable=extract_raw_events,
    )
\`\`\`
`,
        },
      ],
    },
    {
      id: "de-bab-5",
      slug: "kualitas-data-dan-data-contracts",
      title: "BAB 5: Kualitas Data, Kontrak Data & Validasi Skema",
      orderIndex: 5,
      description: "Menerapkan metodologi DataOps: Data Contracts antara produsen dan konsumen data, validasi otomatis menggunakan Great Expectations, dan deteksi anomali skema (schema drift).",
      subchapters: [
        {
          id: "de-bab-5-1",
          slug: "spesifikasi-data-contract-dan-validasi",
          title: "5.1. Spesifikasi Data Contract & Pengujian Integritas",
          orderIndex: 1,
          description: "Mendefinisikan SLA data, tipe kolom yang dijamin, rentang batas numerik, dan pencegahan *silent pipeline failure*.",
          content_markdown: `# 5.1. Spesifikasi Data Contract & Pengujian Integritas

## 1. Problem 'Silent Data Corruption'
Masalah paling merusak dalam sistem AI bukanlah kegagalan fatal (*crash*), melainkan perubahan semantik data secara diam-diam (*silent schema/value drift*). Misalnya: kolom \`price\` yang sebelumnya dalam Dollar tiba-tiba dikirim dalam Rupiah oleh tim backend.

## 2. Konsep Data Contract
Kontrak data formal menyepakati:
1. **Schema Definition**: Tipe data, nullability, dan pengkodean string.
2. **Quality Assertions**:
   - Kolom \`age\` harus berada dalam rentang $[18, 120]$.
   - Kolom \`email\` harus cocok dengan regex RFC 5322.
   - Kolom \`user_id\` harus 100% unik tanpa duplikasi.
3. **SLA & Freshness**: Data harus tersedia maksimal 30 menit setelah peristiwa terjadi.
`,
        },
      ],
    },
    {
      id: "de-bab-6",
      slug: "streaming-ingestion-dan-event-driven",
      title: "BAB 6: Streaming Ingestion Berlatensi Rendah & CDC",
      orderIndex: 6,
      description: "Arsitektur Event-Driven untuk AI real-time: Change Data Capture (CDC) dengan Debezium, perutean pesan Apache Kafka / Redpanda, consumer groups, dan jaminan Exactly-Once Semantics (EOS).",
      subchapters: [
        {
          id: "de-bab-6-1",
          slug: "kafka-cdc-dan-exactly-once-semantics",
          title: "6.1. Log-Centric Architecture, Kafka Partitions & CDC",
          orderIndex: 1,
          description: "Struktur append-only commit log terdistribusi, pengelompokan konsumen (*Consumer Groups*), dan semantik pengiriman pesan (At-least-once vs Exactly-once).",
          content_markdown: `# 6.1. Log-Centric Architecture, Kafka Partitions & CDC

## 1. Arsitektur Append-Only Log
Apache Kafka memodelkan aliran data sebagai log terdistribusi yang hanya dapat ditambahkan (*immutable append-only log*). Setiap peristiwa diberi offset sekuensial unik:
$$e_0, e_1, e_2, \\dots, e_N$$

Kunci partisi menentukan ke partisi mana peristiwa diarahkan:
$$\\text{partition\\_id} = \\text{hash}(\\text{event\\_key}) \\pmod{N_{\\text{partitions}}}$$

Menjamin bahwa seluruh peristiwa dengan kunci entitas yang sama (misal: \`user_id = 452\`) diproses secara urut secara mutlak (*strictly ordered*).

## 2. Change Data Capture (CDC)
Alih-alih melakukan polling berkala \`SELECT * FROM users WHERE updated_at > ...\` yang membebani database operasional, CDC membaca langsung berkas Write-Ahead Log mesin basis data (misal: WAL Postgres atau binlog MySQL) secara non-invasif tanpa membebani thread transaksi.
`,
        },
      ],
    },
    {
      id: "de-bab-7",
      slug: "proyek-pipa-fitur-skala-besar-ai",
      title: "BAB 7: Proyek Terapan: Pipa Ekstraksi Fitur Skala Besar untuk AI",
      orderIndex: 7,
      description: "Membangun sistem pengolahan data end-to-end: ingestion file Parquet mentah, pembersihan, pengujian kontrak kualitas data, transformasi Medallion Silver-to-Gold, dan pembentukan dataset siap latih.",
      subchapters: [
        {
          id: "de-bab-7-1",
          slug: "proyek-akhir-feature-pipeline-lakehouse",
          title: "7.1. Proyek Akhir: Pipa Fitur Terkurasi & Pengujian Kontrak Data",
          orderIndex: 1,
          description: "Implementasi kode Python menggunakan DuckDB/PySpark: transformasi bertingkat, verifikasi assertion kualitas, dan pengindeksan partisi kolumnar.",
          content_markdown: `# 7.1. Proyek Akhir: Pipa Fitur Terkurasi & Pengujian Kontrak Data

## 1. Deskripsi Proyek
Mahasiswa membangun pipa data skala produksi yang memproses data interaksi pengguna mentah (Bronze), membersihkan dan memvalidasi integritas nilai terhadap kontrak data (Silver), serta menghasilkan matriks fitur pengguna terstandarisasi untuk model rekomendasi (Gold).

## 2. Kode Implementasi Pipa Komputasi Terverifikasi
\`\`\`python
import duckdb
import pandas as pd
import numpy as np

# 1. Inisialisasi Database Embedded Analitik (DuckDB)
con = duckdb.connect(database=":memory:")

# 2. Simulasi Lapisan Bronze (Raw Events)
np.random.seed(42)
n_records = 50_000

raw_events = pd.DataFrame({
    "event_id": [f"EVT_{i:06d}" for i in range(1, n_records + 1)],
    "user_id": np.random.randint(1001, 1200, size=n_records),
    "event_type": np.random.choice(["VIEW", "CLICK", "PURCHASE", "REFUND"], size=n_records, p=[0.70, 0.20, 0.08, 0.02]),
    "amount": np.random.exponential(scale=50.0, size=n_records),
    "device_os": np.random.choice(["Android", "iOS", "Windows", "Unknown"], size=n_records, p=[0.45, 0.40, 0.12, 0.03]),
    "event_timestamp": pd.date_range(start="2026-09-01", periods=n_records, freq="10s")
})

# Daftarkan ke DuckDB sebagai tabel Bronze
con.register("bronze_events", raw_events)

# 3. Transformasi ke Lapisan Silver (Data Cleaning & Quality Gate)
con.execute("""
    CREATE TABLE silver_events AS
    SELECT 
        event_id,
        user_id,
        event_type,
        ROUND(amount, 2) AS amount_usd,
        CASE WHEN device_os = 'Unknown' THEN 'Other' ELSE device_os END AS device_os,
        event_timestamp
    FROM bronze_events
    WHERE event_id IS NOT NULL 
      AND amount >= 0
""")

# Verifikasi Kontrak Data (Quality Assertion)
null_check = con.execute("SELECT COUNT(*) FROM silver_events WHERE user_id IS NULL").fetchone()[0]
assert null_check == 0, "Kontrak Data Terlanggar: Ditemukan nilai user_id yang null!"

print("=== [SUKSES] Lapisan Silver Terbentuk & Kontrak Data Lolos Verifikasi ===")

# 4. Transformasi ke Lapisan Gold (AI Feature Store Agregat)
con.execute("""
    CREATE TABLE gold_user_features AS
    SELECT 
        user_id,
        COUNT(CASE WHEN event_type = 'VIEW' THEN 1 END) AS total_views,
        COUNT(CASE WHEN event_type = 'CLICK' THEN 1 END) AS total_clicks,
        COUNT(CASE WHEN event_type = 'PURCHASE' THEN 1 END) AS total_purchases,
        ROUND(SUM(CASE WHEN event_type = 'PURCHASE' THEN amount_usd ELSE 0 END), 2) AS total_lifetime_spend,
        ROUND(
            COUNT(CASE WHEN event_type = 'CLICK' THEN 1 END)::DOUBLE / 
            NULLIF(COUNT(CASE WHEN event_type = 'VIEW' THEN 1 END), 0), 
            4
        ) AS ctr_ratio,
        MAX(event_timestamp) AS last_active_time
    FROM silver_events
    GROUP BY user_id
    ORDER BY total_lifetime_spend DESC
""")

# Tampilkan 5 Profil Fitur Teratas
top_features = con.execute("SELECT * FROM gold_user_features LIMIT 5").df()
print("\\n=== LAPISAN GOLD: AI FEATURE STORE (TOP 5 USERS) ===")
print(top_features.to_string(index=False))
\`\`\`

## 3. Rubrik Penilaian Proyek
- **Arsitektur Pemisahan Medallion (30%)**: Kedisiplinan pemisahan tanggung jawab antara Bronze mentah, Silver bersih, dan Gold agregat.
- **Validasi Kontrak Data & Error Handling (30%)**: Ketahanan skrip terhadap data anomali atau missing values.
- **Optimasi Kueri Analitik (25%)**: Penggunaan fungsi agregat kolumnar tanpa melakukan operasi cartesian join yang lambat.
- **Kesiapan Integrasi AI (15%)**: Fitur yang dihasilkan memiliki format numerik terstandarisasi yang siap dijadikan input model pembelajaran mesin.
`,
        },
      ],
    },
  ],
};
