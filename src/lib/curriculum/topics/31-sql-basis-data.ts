import { AcademicCurriculum, AcademicChapter, AcademicCitation } from "../types";

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

export const bab1References: AcademicCitation[] = [
  {
    title: "A Relational Model of Data for Large Shared Data Banks",
    authors: ["Codd, E. F."],
    verified: false,
  },
  {
    title: "Dokumentasi resmi PostgreSQL: bagian SQL Language dan Concepts",
    authors: ["PostgreSQL"],
    verified: false,
  },
  {
    title: "Dokumentasi resmi SQLite: Foreign Key Support dan EXPLAIN QUERY PLAN",
    authors: ["SQLite"],
    verified: false,
  },
];

export const chapter01Sql: AcademicChapter = {
  id: "sql-ch-01",
  slug: "bab-1-fondasi-basis-data-relasional-arsitektur-mesin-sql",
  title: "BAB 1: Fondasi Basis Data Relasional & Arsitektur Mesin SQL",
  orderIndex: 1,
  description: "Model relasional Codd, RDBMS kontemporer (PostgreSQL, MySQL, SQLite), urutan logis evaluasi kueri, dan eksekusi kueri praktikum pertama menggunakan SQLite in-memory.",
  references: bab1References,
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
      references: bab1References,
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

const rawCodeBab2 = `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("PRAGMA foreign_keys = ON")
cur = conn.cursor()

def coba(label, sql, params=()):
    try:
        conn.execute(sql, params)
        print(f"{label}: BERHASIL")
    except sqlite3.Error as e:
        print(f"{label}: DITOLAK -> {e}")

print("== 2.1 Tipe data: tabel biasa vs STRICT ==")
conn.execute("CREATE TABLE longgar (n INTEGER)")
coba("longgar, isi teks 'abc'", "INSERT INTO longgar VALUES ('abc')")
print("tipe tersimpan:", conn.execute("SELECT typeof(n) FROM longgar").fetchone()[0])
conn.execute("CREATE TABLE ketat (n INTEGER) STRICT")
coba("ketat, isi teks 'abc'", "INSERT INTO ketat VALUES ('abc')")

print("== 2.2 Constraint ==")
conn.executescript("""
CREATE TABLE produk (
    id_produk INTEGER PRIMARY KEY,
    sku       TEXT    NOT NULL UNIQUE,
    nama      TEXT    NOT NULL,
    harga     INTEGER NOT NULL CHECK (harga >= 0),
    stok      INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0)
) STRICT;
""")
coba("produk valid", "INSERT INTO produk (sku, nama, harga) VALUES ('KP-01','Kopi',25000)")
print("stok default:", conn.execute("SELECT stok FROM produk").fetchone()[0])
coba("sku duplikat", "INSERT INTO produk (sku, nama, harga) VALUES ('KP-01','Kopi 2',20000)")
coba("harga negatif", "INSERT INTO produk (sku, nama, harga) VALUES ('TH-01','Teh',-1)")
coba("nama kosong (NULL)", "INSERT INTO produk (sku, nama, harga) VALUES ('GL-01',NULL,5000)")

print("== 2.3 Foreign key dan aksi referensial ==")
conn.executescript("""
CREATE TABLE kategori (id_kategori INTEGER PRIMARY KEY, nama TEXT NOT NULL) STRICT;
CREATE TABLE barang (
    id_barang   INTEGER PRIMARY KEY,
    nama        TEXT NOT NULL,
    id_kategori INTEGER NOT NULL
        REFERENCES kategori(id_kategori) ON DELETE RESTRICT
) STRICT;
CREATE TABLE ulasan (
    id_ulasan INTEGER PRIMARY KEY,
    id_barang INTEGER NOT NULL
        REFERENCES barang(id_barang) ON DELETE CASCADE,
    isi       TEXT NOT NULL
) STRICT;
INSERT INTO kategori VALUES (1,'Minuman');
INSERT INTO barang VALUES (10,'Kopi Susu',1);
INSERT INTO ulasan VALUES (100,10,'Enak'),(101,10,'Manis');
""")
coba("hapus kategori yang masih dipakai (RESTRICT)", "DELETE FROM kategori WHERE id_kategori = 1")
coba("hapus barang (CASCADE ke ulasan)", "DELETE FROM barang WHERE id_barang = 10")
print("sisa ulasan:", conn.execute("SELECT COUNT(*) FROM ulasan").fetchone()[0])

print("== 2.4 ALTER dan DROP ==")
conn.execute("ALTER TABLE produk ADD COLUMN kategori TEXT")
conn.execute("ALTER TABLE produk RENAME COLUMN kategori TO jenis")
print("kolom produk:", [r[1] for r in conn.execute("PRAGMA table_info(produk)")])
conn.execute("ALTER TABLE produk DROP COLUMN jenis")
print("kolom setelah DROP:", [r[1] for r in conn.execute("PRAGMA table_info(produk)")])
coba("tambah kolom NOT NULL tanpa DEFAULT", "ALTER TABLE produk ADD COLUMN berat INTEGER NOT NULL")
conn.execute("DROP TABLE IF EXISTS ulasan")
print("tabel ada:", sorted(r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")))`;

const rawOutputBab2 = `== 2.1 Tipe data: tabel biasa vs STRICT ==
longgar, isi teks 'abc': BERHASIL
tipe tersimpan: text
ketat, isi teks 'abc': DITOLAK -> cannot store TEXT value in INTEGER column ketat.n
== 2.2 Constraint ==
produk valid: BERHASIL
stok default: 0
sku duplikat: DITOLAK -> UNIQUE constraint failed: produk.sku
harga negatif: DITOLAK -> CHECK constraint failed: harga >= 0
nama kosong (NULL): DITOLAK -> NOT NULL constraint failed: produk.nama
== 2.3 Foreign key dan aksi referensial ==
hapus kategori yang masih dipakai (RESTRICT): DITOLAK -> FOREIGN KEY constraint failed
hapus barang (CASCADE ke ulasan): BERHASIL
sisa ulasan: 0
== 2.4 ALTER dan DROP ==
kolom produk: ['id_produk', 'sku', 'nama', 'harga', 'stok', 'jenis']
kolom setelah DROP: ['id_produk', 'sku', 'nama', 'harga', 'stok']
tambah kolom NOT NULL tanpa DEFAULT: DITOLAK -> Cannot add a NOT NULL column with default value NULL
tabel ada: ['barang', 'kategori', 'ketat', 'longgar', 'produk']`;

export const bab2References: AcademicCitation[] = [
  {
    title: "Dokumentasi resmi SQLite: STRICT Tables, Datatypes In SQLite, dan ALTER TABLE",
    authors: ["SQLite"],
    verified: false,
  },
  {
    title: "Dokumentasi resmi PostgreSQL: bagian Data Definition (Constraints dan Altering Tables)",
    authors: ["PostgreSQL"],
    verified: false,
  },
];

export const chapter02Sql: AcademicChapter = {
  id: "sql-ch-02",
  slug: "bab-2-data-definition-language-ddl-integritas-data",
  title: "BAB 2: Data Definition Language (DDL) & Integritas Data",
  orderIndex: 2,
  description: "Membuat tabel dengan CREATE TABLE, memilih tipe data, menerapkan constraint (PRIMARY KEY, UNIQUE, NOT NULL, CHECK, DEFAULT), foreign key aksi referensial (RESTRICT, CASCADE), dan operasi ALTER/DROP TABLE.",
  references: bab2References,
  learningObjectives: [
    "Membuat tabel dengan CREATE TABLE dan memilih tipe data yang tepat.",
    "Memakai constraint PRIMARY KEY, UNIQUE, NOT NULL, CHECK, dan DEFAULT untuk menjaga kualitas data di level database.",
    "Mendefinisikan foreign key dan memilih aksi referensial (RESTRICT, CASCADE) yang sesuai.",
    "Mengubah dan menghapus struktur dengan ALTER TABLE dan DROP TABLE secara aman."
  ],
  subchapters: [
    {
      id: "sql-sub-02-01",
      slug: "create-table-dan-tipe-data",
      title: "2.1 CREATE TABLE dan Tipe Data",
      orderIndex: 1,
      description: "DDL pendefinisian struktur tabel, pemetaan tipe data skalar (PostgreSQL vs SQLite), serta penegakan tipe dinamis menggunakan tabel STRICT.",
      contentStatus: "imported-unverified",
      reviewStatus: "verified_with_limitations",
      learningObjectives: [
        "Memahami sintaks dasar DDL CREATE TABLE untuk pendefinisian struktur relasional",
        "Membandingkan tipe data skalar antara PostgreSQL dan SQLite",
        "Mengidentifikasi perilaku tipe dinamis SQLite dan mengaktifkan tabel STRICT"
      ],
      content_markdown: `**DDL (Data Definition Language)** adalah bagian SQL yang mendefinisikan *struktur*: \`CREATE\`, \`ALTER\`, \`DROP\`. Bagian yang mengubah *isi* data (\`INSERT\`, \`UPDATE\`, \`DELETE\`) disebut DML dan dibahas mulai Bab 3.

Bentuk dasarnya:

\`\`\`sql
CREATE TABLE nama_tabel (
    nama_kolom  TIPE  [constraint ...],
    ...
);
\`\`\`

### Tipe data skalar yang umum

| Kebutuhan | Tipe di PostgreSQL | Tipe di SQLite |
|---|---|---|
| Bilangan bulat | \`INTEGER\`, \`BIGINT\` | \`INTEGER\` |
| Bilangan desimal presisi tetap | \`NUMERIC(p, s)\` | \`NUMERIC\` (lihat peringatan) |
| Teks | \`TEXT\`, \`VARCHAR(n)\` | \`TEXT\` |
| Tanggal dan waktu | \`DATE\`, \`TIMESTAMP\` | disimpan sebagai \`TEXT\`/\`INTEGER\`/\`REAL\` |
| Benar/salah | \`BOOLEAN\` | disimpan sebagai \`INTEGER\` 0/1 |

> [!WARNING]
> SQLite memakai **tipe dinamis**. Secara bawaan, kolom \`INTEGER\` tetap menerima teks seperti \`'abc'\` dan menyimpannya sebagai teks. Ini sangat berbeda dari PostgreSQL, yang menolaknya. SQLite 3.37 ke atas menyediakan **tabel \`STRICT\`** agar tipe ditegakkan. Dalam bab ini hampir semua tabel dibuat \`STRICT\` supaya perilakunya mendekati mesin lain.`
    },
    {
      id: "sql-sub-02-02",
      slug: "constraint-menjaga-data-di-pintu-masuk",
      title: "2.2 Constraint: Menjaga Data di Pintu Masuk",
      orderIndex: 2,
      description: "Mekanisme penegakan integritas data level database melalui constraint PRIMARY KEY, UNIQUE, NOT NULL, CHECK, dan DEFAULT.",
      contentStatus: "imported-unverified",
      reviewStatus: "verified_with_limitations",
      learningObjectives: [
        "Menjelaskan fungsi constraint database sebagai lapisan pertahanan data terdepan",
        "Menerapkan PRIMARY KEY, UNIQUE, dan NOT NULL untuk mencegah duplikasi dan data kosong",
        "Mengonfigurasi CHECK dan DEFAULT untuk validasi domain nilai"
      ],
      content_markdown: `Constraint adalah aturan yang ditegakkan oleh database sendiri. Keuntungannya: aturan berlaku untuk **semua** aplikasi dan skrip yang menulis ke tabel itu, bukan hanya satu program.

| Constraint | Fungsi |
|---|---|
| \`PRIMARY KEY\` | Pengenal unik tiap baris; tidak boleh kosong |
| \`UNIQUE\` | Nilai tidak boleh kembar |
| \`NOT NULL\` | Nilai tidak boleh kosong |
| \`CHECK (kondisi)\` | Nilai harus memenuhi kondisi |
| \`DEFAULT nilai\` | Nilai otomatis jika tidak diisi |

> [!IMPORTANT]
> Constraint adalah **lapisan terakhir** pertahanan data. Validasi di aplikasi tetap perlu (untuk pesan error yang ramah), tetapi jangan pernah menjadikannya satu-satunya penjaga.`
    },
    {
      id: "sql-sub-02-03",
      slug: "foreign-key-dan-aksi-referensial",
      title: "2.3 Foreign Key dan Aksi Referensial",
      orderIndex: 3,
      description: "Penerapan integritas referensial antar-tabel menggunakan FOREIGN KEY serta pemilihan aksi referensial ON DELETE (RESTRICT vs CASCADE).",
      contentStatus: "imported-unverified",
      reviewStatus: "verified_with_limitations",
      learningObjectives: [
        "Mendefinisikan foreign key relasional antara tabel induk dan anak",
        "Membedakan perilaku aksi referensial ON DELETE RESTRICT dan ON DELETE CASCADE",
        "Mengevaluasi risiko keamanan integritas data saat menggunakan CASCADE"
      ],
      content_markdown: `Foreign key menghubungkan tabel anak ke tabel induk. Pertanyaan pentingnya: *apa yang terjadi bila baris induk dihapus?* Kamu memilihnya lewat klausa \`ON DELETE\`:

| Aksi | Perilaku |
|---|---|
| \`RESTRICT\` | Menolak penghapusan induk selama masih ada anak |
| \`CASCADE\` | Ikut menghapus semua anak |

> [!WARNING]
> \`CASCADE\` praktis tetapi berbahaya: satu \`DELETE\` bisa menghapus ratusan baris turunan tanpa peringatan. Pakai hanya untuk data yang memang tidak bermakna tanpa induknya (misalnya ulasan terhadap sebuah barang). Untuk data penting seperti transaksi keuangan, pilih \`RESTRICT\`.`
    },
    {
      id: "sql-sub-02-04",
      slug: "alter-table-dan-drop-table",
      title: "2.4 ALTER TABLE dan DROP TABLE",
      orderIndex: 4,
      description: "Modifikasi skema tabel yang berjalan menggunakan ALTER TABLE (ADD, RENAME, DROP COLUMN) serta penghapusan aman menggunakan DROP TABLE.",
      contentStatus: "imported-unverified",
      reviewStatus: "verified_with_limitations",
      learningObjectives: [
        "Memodifikasi kolom tabel yang ada dengan ALTER TABLE ADD, RENAME, dan DROP",
        "Menangani kendala penambahan kolom NOT NULL pada tabel yang sudah terisi data",
        "Menerapkan praktik terbaik penghapusan struktur tabel secara aman menggunakan DROP TABLE"
      ],
      content_markdown: `\`ALTER TABLE\` mengubah struktur tabel yang sudah ada, \`DROP TABLE\` menghapus tabel beserta seluruh isinya.

> [!CAUTION]
> \`DROP TABLE\` tidak bisa dibatalkan di luar transaksi atau cadangan. Di lingkungan produksi, jangan jalankan \`DROP\` tanpa cadangan, dan biasakan menulis \`DROP TABLE IF EXISTS\` hanya pada skrip yang memang sengaja dibuat ulang (misalnya data latihan).`
    },
    {
      id: "sql-sub-02-05",
      slug: "praktik-menguji-setiap-constraint",
      title: "2.5 Praktik: Menguji Setiap Constraint",
      orderIndex: 5,
      description: "Praktikum eksekusi nyata SQLite via modul Python sqlite3: pengujian tabel biasa vs STRICT, penegakan constraint produk, foreign key RESTRICT/CASCADE, dan manipulasi skema ALTER/DROP.",
      contentStatus: "imported-unverified",
      reviewStatus: "verified_with_limitations",
      references: bab2References,
      learningObjectives: [
        "Menulis skrip pengujian constraint dengan penanganan eksepsi sqlite3.Error",
        "Membuktikan penegakan tabel STRICT vs tabel dinamis konvensional",
        "Memvalidasi penolakan pelanggaran constraint dan aksi CASCADE/RESTRICT",
        "Menyelesaikan latihan kode dan konsep integritas data relasional"
      ],
      codeExamples: [
        {
          id: "sql-code-02-01",
          title: "Uji Integritas Data DDL, Penegakan STRICT, & Aksi Referensial SQLite",
          language: "python",
          filename: "uji_constraint_ddl.py",
          code: rawCodeBab2,
          expectedOutput: rawOutputBab2,
          actualOutput: rawOutputBab2,
          isVerifiedOutput: true,
          verificationStatus: "VERIFIED_RUNNABLE",
          explanation: "Pengujian komprehensif seluruh constraint DDL: perbandingan tabel longgar vs STRICT, penegakan PRIMARY KEY, UNIQUE, CHECK, NOT NULL, DEFAULT, foreign key RESTRICT dan CASCADE, serta operasi ALTER TABLE ADD/RENAME/DROP COLUMN dan DROP TABLE IF EXISTS."
        }
      ],
      exercises: [
        {
          id: "sql-ex-02-01",
          level: 1,
          task: "Apa beda tabel biasa dan tabel STRICT di SQLite? Mengapa perbedaan ini penting bila nanti datamu dipindah ke PostgreSQL?",
          solution: "Tabel biasa SQLite menerima nilai dengan tipe apa pun di kolom apa pun (tipe hanya 'afinitas'), sedangkan tabel STRICT menolak nilai yang tipenya tidak cocok. Kalau datamu dibuat di tabel biasa lalu dipindah ke PostgreSQL, nilai yang salah tipe (misalnya teks di kolom bilangan) yang selama ini lolos akan membuat proses impor gagal."
        },
        {
          id: "sql-ex-02-02",
          level: 2,
          task: "Buat tabel STRICT bernama anggota dengan kolom: id_anggota (primary key), email (wajib dan unik), umur (wajib, antara 17 dan 100), status (wajib, bawaan 'aktif'). Lalu coba masukkan anggota berumur 16 dan 20.",
          solution: "CREATE TABLE anggota (\n    id_anggota INTEGER PRIMARY KEY,\n    email      TEXT    NOT NULL UNIQUE,\n    umur       INTEGER NOT NULL CHECK (umur BETWEEN 17 AND 100),\n    status     TEXT    NOT NULL DEFAULT 'aktif'\n) STRICT;\n\n-- Pengujian:\nINSERT INTO anggota (email, umur) VALUES ('andi@x.id', 16); -- DITOLAK (CHECK constraint failed)\nINSERT INTO anggota (email, umur) VALUES ('budi@x.id', 20); -- BERHASIL, status='aktif'\nINSERT INTO anggota (email, umur) VALUES ('budi@x.id', 25); -- DITOLAK (UNIQUE constraint failed)"
        },
        {
          id: "sql-ex-02-03",
          level: 3,
          task: "Buat tabel pinjaman yang merujuk anggota dengan ON DELETE RESTRICT, isi satu pinjaman untuk anggota 1, lalu coba hapus anggota itu. Apa yang terjadi?",
          solution: "CREATE TABLE pinjaman (\n    id_pinjaman INTEGER PRIMARY KEY,\n    id_anggota  INTEGER NOT NULL REFERENCES anggota(id_anggota) ON DELETE RESTRICT\n) STRICT;\nINSERT INTO pinjaman VALUES (1, 1);\nDELETE FROM anggota WHERE id_anggota = 1;\n\n-- Hasil: Penghapusan ditolak dengan 'FOREIGN KEY constraint failed', karena anggota 1 masih punya pinjaman aktif dan dilindungi oleh aturan RESTRICT."
        },
        {
          id: "sql-ex-02-04",
          level: 4,
          task: "Tabel anggota sudah berisi data. Tambahkan kolom wajib kota tanpa membuat perubahan ditolak.",
          hint: "Kolom NOT NULL yang ditambahkan pada tabel berisi data harus menyertakan klausa DEFAULT.",
          solution: "ALTER TABLE anggota ADD COLUMN kota TEXT NOT NULL DEFAULT 'belum diisi';\n\n-- Penjelasan: Perintah berhasil karena seluruh baris yang sudah ada sebelumnya otomatis diisi dengan nilai default 'belum diisi', sehingga constraint NOT NULL tidak dilanggar."
        }
      ],
      content_markdown: `### Kode lengkap

\`\`\`python
${rawCodeBab2}
\`\`\`

### Output terverifikasi

> [!NOTE]
> Output ini diperoleh dengan menjalankan kode di atas pada SQLite 3.45.1 (\`VERIFIED_RUNNABLE\` untuk SQLite saja).

\`\`\`text
${rawOutputBab2}
\`\`\`

### Penjelasan kode

- **Fungsi \`coba(label, sql)\`**: membungkus satu perintah dalam \`try/except\`. Jika berhasil, mencetak \`BERHASIL\`; jika database menolak, mencetak pesan error asli. Dengan begitu kita bisa *melihat* constraint bekerja.
- **\`PRAGMA foreign_keys = ON\`**: wajib di SQLite agar foreign key ditegakkan (lihat peringatan di Bab 1).
- **Blok 2.1**: tabel \`longgar\` menerima teks \`'abc'\` di kolom \`INTEGER\`, dan \`typeof\` membuktikan nilainya tersimpan sebagai \`text\`. Tabel \`ketat\` (dengan \`STRICT\`) menolaknya.
- **Blok 2.2**: tabel \`produk\` memuat semua constraint. Insert pertama berhasil, dan \`stok\` otomatis \`0\` berkat \`DEFAULT\`. Tiga percobaan berikutnya masing-masing melanggar \`UNIQUE\` (sku kembar), \`CHECK\` (harga negatif), dan \`NOT NULL\` (nama kosong), dan database menyebut constraint mana yang dilanggar.
- **Blok 2.3**: \`kategori\` → \`barang\` memakai \`RESTRICT\`, sedangkan \`barang\` → \`ulasan\` memakai \`CASCADE\`. Menghapus kategori yang masih dipakai ditolak. Menghapus barang berhasil dan kedua ulasannya ikut terhapus (\`sisa ulasan: 0\`).
- **Blok 2.4**: \`ADD COLUMN\` menambah kolom, \`RENAME COLUMN\` mengganti namanya, \`DROP COLUMN\` membuangnya. Menambah kolom \`NOT NULL\` tanpa \`DEFAULT\` ditolak, karena baris yang sudah ada tidak punya nilai untuk kolom baru itu. Terakhir \`DROP TABLE IF EXISTS ulasan\` menghapus tabel (yang tersisa: \`barang\`, \`kategori\`, \`ketat\`, \`longgar\`, \`produk\`).

> [!TIP]
> Saat menambah kolom wajib ke tabel yang sudah berisi data, sertakan \`DEFAULT\`. Atau lakukan tiga langkah: tambah kolom boleh kosong, isi nilai untuk semua baris, lalu tambahkan constraint \`NOT NULL\`.

> [!WARNING]
> **Perbedaan PostgreSQL (belum diuji di bab ini):** PostgreSQL selalu menegakkan tipe, jadi tidak ada padanan \`STRICT\`. Untuk kunci otomatis ia memakai \`GENERATED ... AS IDENTITY\` (atau \`SERIAL\`), sedangkan \`INTEGER PRIMARY KEY\` di SQLite otomatis menaikkan nilai. Untuk mengubah tipe kolom, PostgreSQL memakai \`ALTER COLUMN ... TYPE\`, yang tidak dibahas di bab ini.

---

## Jebakan Umum

1. **Mengandalkan validasi aplikasi saja.** Skrip impor atau pengguna lain bisa menembus aplikasi; constraint tidak.
2. **Memakai \`CASCADE\` secara refleks.** Penghapusan beruntun bisa menghapus data yang masih dibutuhkan.
3. **Kolom \`NOT NULL\` tanpa \`DEFAULT\` pada tabel berisi.** Perubahan ditolak atau, di mesin tertentu, gagal di tengah migrasi.
4. **Mengira SQLite sama ketatnya dengan PostgreSQL.** Tanpa \`STRICT\`, tipe tidak ditegakkan.
5. **Menjalankan \`DROP TABLE\` tanpa cadangan.**

---

## Latihan

**Latihan 1 (konsep).** Apa beda tabel biasa dan tabel \`STRICT\` di SQLite? Mengapa perbedaan ini penting bila nanti datamu dipindah ke PostgreSQL?

**Latihan 2 (kode).** Buat tabel \`STRICT\` bernama \`anggota\` dengan kolom: \`id_anggota\` (primary key), \`email\` (wajib dan unik), \`umur\` (wajib, antara 17 dan 100), \`status\` (wajib, bawaan \`'aktif'\`). Lalu coba masukkan anggota berumur 16 dan 20.

**Latihan 3 (kode).** Buat tabel \`pinjaman\` yang merujuk \`anggota\` dengan \`ON DELETE RESTRICT\`, isi satu pinjaman untuk anggota 1, lalu coba hapus anggota itu. Apa yang terjadi?

**Latihan 4 (tantangan).** Tabel \`anggota\` sudah berisi data. Tambahkan kolom wajib \`kota\` tanpa membuat perubahan ditolak.

### Kunci jawaban

**Jawaban 1.** Tabel biasa SQLite menerima nilai dengan tipe apa pun di kolom apa pun (tipe hanya "afinitas"), sedangkan tabel \`STRICT\` menolak nilai yang tipenya tidak cocok. Kalau datamu dibuat di tabel biasa lalu dipindah ke PostgreSQL, nilai yang salah tipe (misalnya teks di kolom bilangan) yang selama ini lolos akan membuat proses impor gagal.

**Jawaban 2.**

\`\`\`sql
CREATE TABLE anggota (
    id_anggota INTEGER PRIMARY KEY,
    email      TEXT    NOT NULL UNIQUE,
    umur       INTEGER NOT NULL CHECK (umur BETWEEN 17 AND 100),
    status     TEXT    NOT NULL DEFAULT 'aktif'
) STRICT;
\`\`\`

Hasil (SQLite): umur 16 ditolak (\`CHECK constraint failed: umur BETWEEN 17 AND 100\`); umur 20 berhasil dan \`status\` terisi \`aktif\`; email yang sama untuk kedua kalinya ditolak (\`UNIQUE constraint failed: anggota.email\`).

**Jawaban 3.**

\`\`\`sql
CREATE TABLE pinjaman (
    id_pinjaman INTEGER PRIMARY KEY,
    id_anggota  INTEGER NOT NULL REFERENCES anggota(id_anggota) ON DELETE RESTRICT
) STRICT;
INSERT INTO pinjaman VALUES (1, 1);
DELETE FROM anggota WHERE id_anggota = 1;
\`\`\`

Hasil (SQLite): penghapusan ditolak dengan \`FOREIGN KEY constraint failed\`, karena anggota 1 masih punya pinjaman.

**Jawaban 4.**

\`\`\`sql
ALTER TABLE anggota ADD COLUMN kota TEXT NOT NULL DEFAULT 'belum diisi';
\`\`\`

Hasil (SQLite): berhasil, dan baris yang sudah ada mendapat nilai \`belum diisi\` (\`[('a@x.id', 'belum diisi')]\`).`
    }
  ]
};

// Outline chapters 3 - 12 untuk mendukung roadmap lengkap katalog
const syllabusChapters: Array<{ num: number; slug: string; title: string; desc: string }> = [
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
  verifiedSourcesCount: 0,
  auditStatus: "VERIFIED_WITH_LIMITATIONS",
  primaryReferences: [
    ...bab1References,
    ...bab2References
  ],
  chapters: [
    chapter01Sql,
    chapter02Sql,
    ...outlineChaptersSql
  ]
};

