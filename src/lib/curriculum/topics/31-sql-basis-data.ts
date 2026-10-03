import { AcademicCurriculum, AcademicChapter } from "../types";

/**
 * KURIKULUM AKADEMIK RESMI: SQL & BASIS DATA
 * Standar: University-Grade / Advanced Relational Database & SQL Analytics Curriculum
 * Rujukan Kanonikal: E. F. Codd (ACM 1970), PostgreSQL Official Documentation, SQLite Official Documentation
 */

const rawCodeBab1 = `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.executescript("""
CREATE TABLE pelanggan (
    id_pelanggan INTEGER PRIMARY KEY,
    nama         TEXT NOT NULL,
    kota         TEXT NOT NULL
);
CREATE TABLE pesanan (
    id_pesanan   INTEGER PRIMARY KEY,
    id_pelanggan INTEGER NOT NULL REFERENCES pelanggan(id_pelanggan),
    tanggal      TEXT NOT NULL,
    total        INTEGER NOT NULL
);
INSERT INTO pelanggan VALUES (1,'Sari','Pekanbaru'),(2,'Budi','Padang'),(3,'Wulan','Pekanbaru');
INSERT INTO pesanan VALUES
 (101,1,'2026-09-01',150000),
 (102,1,'2026-09-05',275000),
 (103,2,'2026-09-07',90000);
""")

print("== Selection + projection ==")
for row in cur.execute("SELECT nama, kota FROM pelanggan WHERE kota = 'Pekanbaru'"):
    print(row)

print("== Join ==")
for row in cur.execute("""
    SELECT p.nama, o.id_pesanan, o.total
    FROM pelanggan AS p
    JOIN pesanan AS o ON o.id_pelanggan = p.id_pelanggan
    ORDER BY o.id_pesanan
"""):
    print(row)

print("== Agregasi ==")
for row in cur.execute("""
    SELECT p.nama, COUNT(*) AS jumlah_pesanan, SUM(o.total) AS total_belanja
    FROM pelanggan AS p JOIN pesanan AS o ON o.id_pelanggan = p.id_pelanggan
    GROUP BY p.nama ORDER BY total_belanja DESC
"""):
    print(row)

print("== Urutan evaluasi: kolom alias tidak bisa dipakai di WHERE ==")
try:
    cur.execute("SELECT total/1000 AS ribu FROM pesanan WHERE ribu > 100").fetchall()
    print("tidak error (SQLite longgar)")
except sqlite3.OperationalError as e:
    print("error:", e)

print("== Menjaga integritas referensial ==")
conn.execute("PRAGMA foreign_keys = ON")
try:
    conn.execute("INSERT INTO pesanan VALUES (104, 999, '2026-09-10', 50000)")
except sqlite3.IntegrityError as e:
    print("ditolak:", e)

print("== Rencana eksekusi ==")
for row in cur.execute("EXPLAIN QUERY PLAN SELECT * FROM pesanan WHERE id_pelanggan = 1"):
    print(row[3])`;

const rawOutputBab1 = `== Selection + projection ==
('Sari', 'Pekanbaru')
('Wulan', 'Pekanbaru')
== Join ==
('Sari', 101, 150000)
('Sari', 102, 275000)
('Budi', 103, 90000)
== Agregasi ==
('Sari', 2, 425000)
('Budi', 1, 90000)
== Urutan evaluasi: kolom alias tidak bisa dipakai di WHERE ==
tidak error (SQLite longgar)
== Menjaga integritas referensial ==
ditolak: FOREIGN KEY constraint failed
== Rencana eksekusi ==
SCAN pesanan`;

export const chapter01Sql: AcademicChapter = {
  id: "sql-ch-01",
  slug: "bab-1-fondasi-basis-data-relasional-arsitektur-mesin-sql",
  title: "BAB 1: Fondasi Basis Data Relasional & Arsitektur Mesin SQL",
  orderIndex: 1,
  description: "Model relasional Codd, RDBMS kontemporer (PostgreSQL, MySQL, SQLite), urutan logis evaluasi kueri, dan eksekusi kueri praktikum pertama menggunakan SQLite in-memory.",
  learningObjectives: [
    "Menjelaskan apa itu relasi, tuple, atribut, primary key, dan foreign key.",
    "Menjelaskan tiga operasi dasar model relasional (selection, projection, join) dan memetakannya ke sintaks SQL.",
    "Menjelaskan urutan logis evaluasi sebuah kueri SQL dan kenapa urutan tulisnya berbeda.",
    "Menjalankan database SQLite dari Python, membuat dua tabel berelasi, dan menulis kueri pertamamu."
  ],
  subchapters: [
    {
      id: "sql-sub-01-01",
      slug: "model-relasional",
      title: "1.1 Model Relasional",
      orderIndex: 1,
      description: "Landasan teoretis Codd: relasi sebagai himpunan tuple, pemetaan istilah formal ke tabel SQL, batasan primary key, dan 3 operasi aljabar relasional dasar.",
      contentStatus: "imported-unverified",
      reviewStatus: "verified_with_limitations",
      learningObjectives: [
        "Memahami definisi formal relasi matematis Codd dan perbedaannya dengan tabel SQL",
        "Menghubungkan istilah formal (tuple, atribut, domain) dengan padanan praktisnya",
        "Menguasai tiga operasi dasar aljabar relasional: selection, projection, dan join"
      ],
      content_markdown: `Pada tahun 1970, E. F. Codd menerbitkan makalah *"A Relational Model of Data for Large Shared Data Banks"* yang mengusulkan agar data disimpan sebagai **relasi**, yaitu himpunan baris yang punya kolom bernama, dan diakses lewat operasi deklaratif, bukan lewat petunjuk letak penyimpanan fisik. Hampir semua RDBMS yang kamu pakai hari ini (PostgreSQL, MySQL, SQLite, SQL Server) mewarisi gagasan itu.

### Istilah Inti

| Istilah formal | Istilah sehari-hari | Contoh |
|---|---|---|
| Relasi | Tabel | \`pelanggan\` |
| Tuple | Baris | \`(1, 'Sari', 'Pekanbaru')\` |
| Atribut | Kolom | \`nama\`, \`kota\` |
| Domain | Tipe nilai yang sah | \`TEXT\`, \`INTEGER\` |
| Primary key | Pengenal unik tiap baris | \`id_pelanggan\` |
| Foreign key | Kolom yang merujuk primary key tabel lain | \`pesanan.id_pelanggan\` |

Secara formal, relasi $R$ dengan atribut $A_1, \\dots, A_n$ adalah himpunan tuple:

$$R \\subseteq D_1 \\times D_2 \\times \\dots \\times D_n$$

Karena relasi adalah *himpunan*, secara teori tidak ada urutan baris dan tidak ada baris ganda.

> [!WARNING]
> Tabel SQL **tidak persis** sama dengan relasi teoretis. Tabel SQL mengizinkan baris duplikat jika tidak ada primary key atau \`UNIQUE\`, dan mengenal nilai \`NULL\`. Karena itu, selalu definisikan primary key. Kamu akan mempelajari \`NULL\` secara khusus di Bab 3.

### Tiga Operasi Dasar

Hampir semua kueri analitik tersusun dari tiga ide ini:

| Operasi | Arti | Bentuk SQL |
|---|---|---|
| **Selection** ($\\sigma$) | Memilih baris yang memenuhi syarat | \`WHERE\` |
| **Projection** ($\\pi$) | Memilih kolom tertentu | daftar kolom di \`SELECT\` |
| **Join** ($\\bowtie$) | Menggabungkan baris dari dua relasi yang cocok | \`JOIN ... ON\` |

Contoh notasi aljabar relasional: ambil nama dan kota pelanggan dari Pekanbaru.

$$\\pi_{\\text{nama, kota}}\\big(\\sigma_{\\text{kota = 'Pekanbaru'}}(\\text{pelanggan})\\big)$$`
    },
    {
      id: "sql-sub-01-02",
      slug: "arsitektur-mesin-sql-dan-urutan-evaluasi-kueri",
      title: "1.2 Arsitektur Mesin SQL dan Urutan Evaluasi Kueri",
      orderIndex: 2,
      description: "Prinsip bahasa deklaratif, tiga fase eksekusi mesin SQL (Parsing, Planning, Execution), serta perbedaan urutan sintaksis penulisan vs urutan evaluasi semantik logis.",
      contentStatus: "imported-unverified",
      reviewStatus: "verified_with_limitations",
      learningObjectives: [
        "Menjelaskan 3 tahapan pemrosesan kueri oleh mesin RDBMS (parser, optimizer, execution engine)",
        "Membedakan urutan penulisan sintaksis dengan urutan evaluasi logis RDBMS",
        "Menjelaskan mengapa alias kolom di SELECT tidak valid digunakan di klausa WHERE pada standar ANSI SQL"
      ],
      content_markdown: `SQL itu **deklaratif**: kamu menulis *apa* yang kamu inginkan, dan mesin yang memutuskan *bagaimana* mengambilnya. Secara garis besar, mesin melakukan:

1. **Parsing**: memeriksa sintaks dan nama tabel/kolom.
2. **Perencanaan (planner/optimizer)**: memilih rencana eksekusi, misalnya memakai indeks atau memindai seluruh tabel.
3. **Eksekusi**: menjalankan rencana itu dan mengembalikan hasil.

Kamu akan melihat rencana ini langsung di Bab 10 lewat \`EXPLAIN\`.

### Urutan Tulis Tidak Sama dengan Urutan Logis

Kamu menulis \`SELECT\` di awal, tetapi secara logis \`SELECT\` dievaluasi hampir di akhir:

\`\`\`text
Urutan tulis:     SELECT  FROM  WHERE  GROUP BY  HAVING  ORDER BY
Urutan logis:     FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
\`\`\`

Akibatnya, **alias kolom yang dibuat di \`SELECT\` seharusnya belum bisa dipakai di \`WHERE\`**, karena \`WHERE\` dievaluasi lebih dulu. PostgreSQL menolak hal ini. SQLite lebih longgar dan membolehkannya, seperti yang kamu lihat di kode bawah.

> [!IMPORTANT]
> Menulis kueri yang jalan di SQLite belum tentu jalan di PostgreSQL. Biasakan menulis SQL yang sesuai standar, dan jangan mengandalkan kelonggaran satu mesin.`
    },
    {
      id: "sql-sub-01-03",
      slug: "praktik-database-pertamamu",
      title: "1.3 Praktik: Database Pertamamu",
      orderIndex: 3,
      description: "Praktikum eksekusi nyata SQLite in-memory via modul Python sqlite3: pembuatan skema DDL berelasi, DML insersi, kueri filter, join, agregasi, pembuktian urutan evaluasi, dan analisis query plan.",
      contentStatus: "imported-unverified",
      reviewStatus: "verified_with_limitations",
      learningObjectives: [
        "Menginisialisasi basis data SQLite in-memory dari skrip Python",
        "Mendefinisikan skema tabel dengan PRIMARY KEY dan FOREIGN KEY constraints",
        "Mengeksekusi kueri SELECT, JOIN, GROUP BY, dan memverifikasi integritas referensial",
        "Membaca output EXPLAIN QUERY PLAN untuk melihat strategi pemindaian tabel"
      ],
      codeExamples: [
        {
          id: "sql-code-01-01",
          title: "Inisialisasi Database Relasional SQLite & Uji Kueri Analitik",
          language: "python",
          filename: "database_pertamamu.py",
          code: rawCodeBab1,
          expectedOutput: rawOutputBab1,
          actualOutput: rawOutputBab1,
          isVerifiedOutput: true,
          verificationStatus: "VERIFIED_RUNNABLE",
          explanation: "Skrip Python interaktif untuk menguji seluruh operasi dasar SQL: DDL tabel relasional, insersi data, selection+projection, inner join, agregasi GROUP BY, uji batasan alias WHERE di SQLite vs PostgreSQL, penegakan foreign key PRAGMA, dan inspeksi rencana eksekusi EXPLAIN."
        }
      ],
      exercises: [
        {
          id: "sql-ex-01-01",
          level: 1,
          task: "Jelaskan perbedaan antara relasi dalam teori Codd dan tabel dalam SQL. Sebutkan minimal dua perbedaan.",
          solution: "(a) Relasi adalah himpunan matematika, sehingga secara teori tidak memiliki baris ganda dan tidak memiliki urutan fisik; tabel SQL mengizinkan baris duplikat jika tidak ada constraint UNIQUE/PK, dan urutan baris tidak terdefinisi kecuali memakai ORDER BY. (b) Teori relasional murni tidak mengenal nilai NULL; SQL mengimplementasikan NULL dengan logika 3-nilai (Three-Valued Logic: TRUE, FALSE, UNKNOWN)."
        },
        {
          id: "sql-ex-01-02",
          level: 2,
          task: "Tulis kueri SQL untuk menampilkan nama pelanggan yang tinggal di Padang.",
          solution: "SELECT nama FROM pelanggan WHERE kota = 'Padang';"
        },
        {
          id: "sql-ex-01-03",
          level: 3,
          task: "Tampilkan total belanja per kota, urutkan dari yang terbesar ke terkecil.",
          solution: "SELECT p.kota, SUM(o.total) AS total_belanja\nFROM pelanggan AS p\nJOIN pesanan AS o ON o.id_pelanggan = p.id_pelanggan\nGROUP BY p.kota\nORDER BY total_belanja DESC;"
        },
        {
          id: "sql-ex-01-04",
          level: 4,
          task: "Tampilkan setiap pelanggan beserta jumlah pesanannya, termasuk pelanggan yang belum pernah memesan sama sekali (jumlah pesanan = 0).",
          hint: "Gunakan LEFT JOIN dan perhatikan fungsi agregasi COUNT(kolom) vs COUNT(*).",
          solution: "SELECT p.nama, COUNT(o.id_pesanan) AS jumlah_pesanan\nFROM pelanggan AS p\nLEFT JOIN pesanan AS o ON o.id_pelanggan = p.id_pelanggan\nGROUP BY p.nama\nORDER BY p.nama;\n\n-- Penjelasan: COUNT(o.id_pesanan) hanya menghitung nilai non-NULL sehingga pelanggan tanpa pesanan bernilai 0. Jika memakai COUNT(*), baris hasil join tetap terhitung 1."
        }
      ],
      content_markdown: `Kita memakai SQLite lewat Python karena tidak perlu instalasi server. Data contoh sengaja kecil agar hasilnya mudah dicek dengan mata.

### Kode Lengkap

\`\`\`python
${rawCodeBab1}
\`\`\`

### Output Terverifikasi

> [!NOTE]
> Output ini diperoleh dengan menjalankan kode di atas pada SQLite 3.45.1 (status: \`VERIFIED_RUNNABLE\` untuk SQLite saja).

\`\`\`text
${rawOutputBab1}
\`\`\`

### Penjelasan Kode

- **\`sqlite3.connect(":memory:")\`**: membuat database di memori. Semua data hilang saat program selesai, cocok untuk latihan.
- **\`CREATE TABLE pelanggan\`**: \`PRIMARY KEY\` menjamin tiap \`id_pelanggan\` unik; \`NOT NULL\` melarang nilai kosong.
- **\`REFERENCES pelanggan(id_pelanggan)\`**: mendeklarasikan foreign key. Pesanan hanya boleh merujuk pelanggan yang ada.
- **\`INSERT INTO ... VALUES\`**: mengisi data. Wulan (id 3) sengaja tidak punya pesanan, dipakai lagi di latihan.
- **Blok "Selection + projection"**: \`WHERE\` memilih baris (selection), daftar kolom \`nama, kota\` memilih kolom (projection). Hanya Sari dan Wulan yang tinggal di Pekanbaru.
- **Blok "Join"**: \`JOIN ... ON\` mencocokkan \`pesanan.id_pelanggan\` dengan \`pelanggan.id_pelanggan\`. Wulan tidak muncul karena \`JOIN\` biasa hanya mengembalikan baris yang punya pasangan.
- **Blok "Agregasi"**: \`GROUP BY p.nama\` mengelompokkan baris per pelanggan; \`COUNT(*)\` dan \`SUM\` dihitung per kelompok. Sari: 2 pesanan, total 150.000 + 275.000 = 425.000.
- **Blok "Urutan evaluasi"**: \`ribu\` adalah alias yang dibuat di \`SELECT\`, tetapi dipakai di \`WHERE\`. SQLite tidak mengeluh. Menurut standar dan perilaku PostgreSQL, kueri ini seharusnya ditolak (**belum diuji di PostgreSQL dalam bab ini**).
- **Blok "Integritas referensial"**: \`PRAGMA foreign_keys = ON\` mengaktifkan pemeriksaan foreign key. Percobaan menambah pesanan untuk pelanggan 999 (tidak ada) ditolak.
- **\`EXPLAIN QUERY PLAN\`**: menampilkan bahwa mesin memindai seluruh tabel \`pesanan\` (\`SCAN\`) karena belum ada indeks pada \`id_pelanggan\`. Ini bahan pembahasan Bab 10.

> [!WARNING]
> Di SQLite, pemeriksaan foreign key **tidak aktif secara bawaan** per koneksi. Tanpa \`PRAGMA foreign_keys = ON\`, data yatim (pesanan tanpa pelanggan) bisa masuk tanpa error. PostgreSQL selalu memeriksanya.

> [!TIP]
> Biasakan memberi alias tabel yang pendek (\`p\`, \`o\`) saat menulis join, dan selalu awali kolom dengan alias itu (\`p.nama\`). Kueri jadi lebih mudah dibaca dan tidak ambigu.

---

### Jebakan Umum

1. **Mengira urutan baris itu tetap.** Tanpa \`ORDER BY\`, urutan hasil tidak dijamin. Selalu tulis \`ORDER BY\` jika urutan penting.
2. **Menulis alias di \`WHERE\`.** Jalan di SQLite, gagal di PostgreSQL.
3. **Lupa mengaktifkan foreign key di SQLite.**
4. **Tabel tanpa primary key.** Baris ganda masuk tanpa terdeteksi.

---

### Latihan & Kuis Terpadu

**Latihan 1 (konsep).** Jelaskan perbedaan antara relasi dalam teori Codd dan tabel dalam SQL. Sebutkan minimal dua perbedaan.

**Latihan 2 (kode).** Tulis kueri untuk menampilkan nama pelanggan yang tinggal di Padang.

**Latihan 3 (kode).** Tampilkan total belanja per **kota**, urutkan dari yang terbesar.

**Latihan 4 (tantangan).** Tampilkan setiap pelanggan beserta jumlah pesanannya, **termasuk pelanggan yang belum pernah memesan** (jumlahnya 0). Petunjuk: \`JOIN\` biasa tidak cukup, pakai \`LEFT JOIN\` (dibahas di Bab 5).

#### Kunci Jawaban & Pembahasan

**Jawaban 1.**
(a) Relasi adalah himpunan matematika, sehingga tidak ada baris ganda dan tidak ada urutan; tabel SQL boleh punya baris ganda jika tidak dibatasi key, dan hasil kueri tidak berurutan kecuali memakai \`ORDER BY\`.
(b) Teori relasional murni tidak mengenal \`NULL\`; SQL mengenal \`NULL\` dengan logika tiga nilai (Three-Valued Logic: benar, salah, tidak diketahui).

**Jawaban 2.**
\`\`\`sql
SELECT nama FROM pelanggan WHERE kota = 'Padang';
\`\`\`
*Hasil (SQLite):* \`[('Budi',)]\`

**Jawaban 3.**
\`\`\`sql
SELECT p.kota, SUM(o.total) AS total_belanja
FROM pelanggan AS p
JOIN pesanan AS o ON o.id_pelanggan = p.id_pelanggan
GROUP BY p.kota
ORDER BY total_belanja DESC;
\`\`\`
*Hasil (SQLite):* \`[('Pekanbaru', 425000), ('Padang', 90000)]\`

**Jawaban 4.**
\`\`\`sql
SELECT p.nama, COUNT(o.id_pesanan) AS jumlah_pesanan
FROM pelanggan AS p
LEFT JOIN pesanan AS o ON o.id_pelanggan = p.id_pelanggan
GROUP BY p.nama
ORDER BY p.nama;
\`\`\`
*Hasil (SQLite):* \`[('Budi', 1), ('Sari', 2), ('Wulan', 0)]\`.
\`COUNT(o.id_pesanan)\` menghitung hanya nilai yang tidak \`NULL\`, jadi Wulan mendapat 0. Jika kamu memakai \`COUNT(*)\`, Wulan akan terhitung 1 (baris hasil join-nya tetap ada), dan itu salah.`
    }
  ]
};

// Outline chapters 2 - 12 untuk mendukung roadmap lengkap katalog
const syllabusChapters: Array<{ num: number; slug: string; title: string; desc: string }> = [
  { num: 2, slug: "ddl-integritas-data", title: "Bab 2: Data Definition Language (DDL) & Integritas Data", desc: "CREATE TABLE, ALTER, DROP, tipe data skalar, primary key, foreign key, dan check constraints." },
  { num: 3, slug: "dml-filtering-logis", title: "Bab 3: Data Manipulation Language (DML) & Filtering Logis", desc: "Kueri SELECT, WHERE, operators AND/OR/NOT, LIKE, BETWEEN, IN, dan penanganan nilai NULL." },
  { num: 4, slug: "agregasi-data-group-by-having", title: "Bab 4: Agregasi Data & Pengelompokan Tingkat Lanjut (GROUP BY & HAVING)", desc: "COUNT, SUM, AVG, MIN, MAX, GROUP BY multi-kolom, dan evaluasi kondisi agregat HAVING." },
  { num: 5, slug: "penggabungan-relasional-join", title: "Bab 5: Penggabungan Relasional: INNER, LEFT, RIGHT, & FULL OUTER JOIN", desc: "Kardinalitas relasi, penanganan data hilang pada outer join, self-join, dan cross join." },
  { num: 6, slug: "subquery-terkorelasi-cte", title: "Bab 6: Subquery Terkorelasi & Common Table Expressions (CTEs / WITH)", desc: "Subquery bersarang, skalar subquery, kueri rekursif WITH RECURSIVE, dan modularitas kueri." },
  { num: 7, slug: "window-functions-analitik", title: "Bab 7: Window Functions Analitik: ROW_NUMBER, RANK, LEAD, & LAG", desc: "Partisi OVER(PARTITION BY ... ORDER BY), sliding window frames, dan running totals." },
  { num: 8, slug: "manipulasi-string-fungsi-waktu", title: "Bab 8: Manipulasi String, Fungsi Waktu, & Logika Kondisional CASE WHEN", desc: "Ekstraksi string, parsing timestamp, zonasi waktu, dan percabangan logika ekspresi." },
  { num: 9, slug: "desain-skema-normalisasi", title: "Bab 9: Desain Skema Basis Data & Normalisasi (1NF, 2NF, 3NF, BCNF)", desc: "Menghindari anomali insersi/update, pemodelan data OLTP vs OLAP Star/Snowflake Schema." },
  { num: 10, slug: "indexing-b-tree-explain", title: "Bab 10: Indexing B-Tree & Analisis Kinerja Kueri (EXPLAIN ANALYZE)", desc: "Struktur indeks B-Tree, indeks komposit, index scan vs sequential scan, dan optimasi kueri." },
  { num: 11, slug: "transaksi-acid-concurrency", title: "Bab 11: Transaksi ACID, Concurrency Control, & Locking", desc: "Sifat Atomicity, Consistency, Isolation, Durability, tingkat isolasi transaksi, dan deadlock." },
  { num: 12, slug: "capstone-analytics-warehouse", title: "Bab 12: Capstone Project: End-to-End Analytics Warehouse & Complex Query Optimization", desc: "Proyek komprehensif gudang data analitik e-commerce: pemodelan skema bintang, integrasi data, dan dashboard reporting SQL." }
];

export const outlineChaptersSql: AcademicChapter[] = syllabusChapters.map((ch) => ({
  id: "sql-ch-" + (ch.num < 10 ? "0" + ch.num : ch.num),
  slug: "bab-" + ch.num + "-" + ch.slug,
  title: ch.title,
  orderIndex: ch.num,
  description: ch.desc,
  learningObjectives: [
    "Menguasai prinsip dan implementasi pada " + ch.title,
    "Menjalankan kueri SQL standar industri dengan validasi integritas data",
    "Menerapkan optimasi kueri dan pemecahan masalah analitik bisnis"
  ],
  subchapters: [
    {
      id: "sql-sub-" + (ch.num < 10 ? "0" + ch.num : ch.num) + "-01",
      slug: ch.slug + "-konsep-dasar",
      title: ch.num + ".1 Konsep & Formulasi " + ch.title.split(": ")[1],
      orderIndex: 1,
      description: ch.desc,
      contentStatus: "imported-unverified",
      reviewStatus: "legacy_synthetic",
      content_markdown: "> ⏳ **Kerangka Silabus (Segera Hadir)**\n>\n> Materi bab ini telah terdaftar dalam kurikulum resmi dan silabus pembelajaran platform Velqora. Materi substantif terverifikasi bebas data sintetis sedang disiapkan sesuai standar SOP [PANDUAN_IMPORT_MODUL_DAN_STANDAR_KURIKULUM.md]."
    }
  ]
}));

export const sqlBasisDataCurriculum: AcademicCurriculum = {
  id: "sql-basis-data",
  slug: "sql-basis-data",
  title: "SQL & Basis Data",
  category: "Fondasi",
  level: "pemula",
  description: "Kurikulum akademik terstandarisasi untuk manipulasi, pemodelan, dan analisis data relasional: mencakup teori relasional Codd, eksekusi deklaratif SQLite & PostgreSQL, DDL/DML, Window Functions, CTEs, normalisasi skema, hingga optimasi indeks performa tinggi.",
  estimatedHours: 45,
  version: "1.0.0",
  verifiedSourcesCount: 3,
  auditStatus: "VERIFIED_WITH_LIMITATIONS",
  primaryReferences: [
    {
      title: "A Relational Model of Data for Large Shared Data Banks",
      authors: ["E. F. Codd"],
      type: "paper",
      url: "https://dl.acm.org/doi/10.1145/362384.362685",
      sourceType: "paper",
      provider: "Communications of the ACM",
      relevance: "Makalah kanonikal peletak fondasi model relasional, aljabar relasional, tuple, dan independensi data fisik.",
      verified: true
    },
    {
      title: "PostgreSQL Documentation: The SQL Language & Architecture",
      authors: ["PostgreSQL Global Development Group"],
      type: "documentation",
      url: "https://www.postgresql.org/docs/current/tutorial-sql.html",
      sourceType: "official-documentation",
      provider: "PostgreSQL Community",
      relevance: "Dokumentasi standar acuan arsitektur mesin RDBMS, standar ANSI SQL, tipe data terstruktur, dan isolasi transaksi.",
      verified: true
    },
    {
      title: "SQLite Documentation: Query Planner, Foreign Keys, & In-Memory Databases",
      authors: ["D. Richard Hipp", "SQLite Development Team"],
      type: "documentation",
      url: "https://www.sqlite.org/docs.html",
      sourceType: "official-documentation",
      provider: "SQLite Consortium",
      relevance: "Dokumentasi resmi mesin serverless SQL, arsitektur VDBE, penegakan foreign key pragmas, dan analisis EXPLAIN QUERY PLAN.",
      verified: true
    }
  ],
  chapters: [
    chapter01Sql,
    ...outlineChaptersSql
  ]
};
