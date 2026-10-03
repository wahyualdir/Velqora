# Bab 1: Fondasi Basis Data Relasional & Arsitektur Mesin SQL

> [!NOTE]
> **Status draf:** `imported-unverified`. Semua kode di bab ini sudah dijalankan di **SQLite 3.45.1 (Python `sqlite3`)** dan output yang tertulis adalah output nyata. Kode **belum dijalankan di PostgreSQL**. Bagian yang perilakunya berbeda antar-mesin diberi tanda eksplisit.
> Rujukan di akhir bab belum diperiksa tautannya.

## Tujuan Pembelajaran

Setelah menyelesaikan bab ini, kamu mampu:

1. Menjelaskan apa itu relasi, tuple, atribut, primary key, dan foreign key.
2. Menjelaskan tiga operasi dasar model relasional (selection, projection, join) dan memetakannya ke sintaks SQL.
3. Menjelaskan urutan *logis* evaluasi sebuah kueri SQL dan kenapa urutan tulisnya berbeda.
4. Menjalankan database SQLite dari Python, membuat dua tabel berelasi, dan menulis kueri pertamamu.

---

## 1.1 Model Relasional

Pada tahun 1970, E. F. Codd menerbitkan makalah "A Relational Model of Data for Large Shared Data Banks" yang mengusulkan agar data disimpan sebagai **relasi**, yaitu himpunan baris yang punya kolom bernama, dan diakses lewat operasi deklaratif, bukan lewat petunjuk letak penyimpanan fisik. Hampir semua RDBMS yang kamu pakai hari ini (PostgreSQL, MySQL, SQLite, SQL Server) mewarisi gagasan itu.

### Istilah inti

| Istilah formal | Istilah sehari-hari | Contoh |
|---|---|---|
| Relasi | Tabel | `pelanggan` |
| Tuple | Baris | `(1, 'Sari', 'Pekanbaru')` |
| Atribut | Kolom | `nama`, `kota` |
| Domain | Tipe nilai yang sah | `TEXT`, `INTEGER` |
| Primary key | Pengenal unik tiap baris | `id_pelanggan` |
| Foreign key | Kolom yang merujuk primary key tabel lain | `pesanan.id_pelanggan` |

Secara formal, relasi $R$ dengan atribut $A_1, \dots, A_n$ adalah himpunan tuple:

$$R \subseteq D_1 \times D_2 \times \dots \times D_n$$

Karena relasi adalah *himpunan*, secara teori tidak ada urutan baris dan tidak ada baris ganda.

> [!WARNING]
> Tabel SQL **tidak persis** sama dengan relasi teoretis. Tabel SQL mengizinkan baris duplikat jika tidak ada primary key atau `UNIQUE`, dan mengenal nilai `NULL`. Karena itu, selalu definisikan primary key. Kamu akan mempelajari `NULL` secara khusus di Bab 3.

### Tiga operasi dasar

Hampir semua kueri analitik tersusun dari tiga ide ini:

| Operasi | Arti | Bentuk SQL |
|---|---|---|
| **Selection** ($\sigma$) | Memilih baris yang memenuhi syarat | `WHERE` |
| **Projection** ($\pi$) | Memilih kolom tertentu | daftar kolom di `SELECT` |
| **Join** ($\bowtie$) | Menggabungkan baris dari dua relasi yang cocok | `JOIN ... ON` |

Contoh notasi: ambil nama dan kota pelanggan dari Pekanbaru.

$$\pi_{\text{nama, kota}}\big(\sigma_{\text{kota = 'Pekanbaru'}}(\text{pelanggan})\big)$$

---

## 1.2 Arsitektur Mesin SQL dan Urutan Evaluasi Kueri

SQL itu **deklaratif**: kamu menulis *apa* yang kamu inginkan, dan mesin yang memutuskan *bagaimana* mengambilnya. Secara garis besar, mesin melakukan:

1. **Parsing**: memeriksa sintaks dan nama tabel/kolom.
2. **Perencanaan (planner/optimizer)**: memilih rencana eksekusi, misalnya memakai indeks atau memindai seluruh tabel.
3. **Eksekusi**: menjalankan rencana itu dan mengembalikan hasil.

Kamu akan melihat rencana ini langsung di Bab 10 lewat `EXPLAIN`.

### Urutan tulis tidak sama dengan urutan logis

Kamu menulis `SELECT` di awal, tetapi secara logis `SELECT` dievaluasi hampir di akhir:

```text
Urutan tulis:     SELECT  FROM  WHERE  GROUP BY  HAVING  ORDER BY
Urutan logis:     FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
```

Akibatnya, **alias kolom yang dibuat di `SELECT` seharusnya belum bisa dipakai di `WHERE`**, karena `WHERE` dievaluasi lebih dulu. PostgreSQL menolak hal ini. SQLite lebih longgar dan membolehkannya, seperti yang kamu lihat di kode bawah.

> [!IMPORTANT]
> Menulis kueri yang jalan di SQLite belum tentu jalan di PostgreSQL. Biasakan menulis SQL yang sesuai standar, dan jangan mengandalkan kelonggaran satu mesin.

---

## 1.3 Praktik: Database Pertamamu

Kita memakai SQLite lewat Python karena tidak perlu instalasi server. Data contoh sengaja kecil agar hasilnya mudah dicek dengan mata.

### Kode lengkap

```python
import sqlite3

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
    print(row[3])
```

### Output terverifikasi

> [!NOTE]
> Output ini diperoleh dengan menjalankan kode di atas pada SQLite 3.45.1 (status: `VERIFIED_RUNNABLE` untuk SQLite saja).

```text
== Selection + projection ==
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
SCAN pesanan
```

### Penjelasan kode

- **`sqlite3.connect(":memory:")`**: membuat database di memori. Semua data hilang saat program selesai, cocok untuk latihan.
- **`CREATE TABLE pelanggan`**: `PRIMARY KEY` menjamin tiap `id_pelanggan` unik; `NOT NULL` melarang nilai kosong.
- **`REFERENCES pelanggan(id_pelanggan)`**: mendeklarasikan foreign key. Pesanan hanya boleh merujuk pelanggan yang ada.
- **`INSERT INTO ... VALUES`**: mengisi data. Wulan (id 3) sengaja tidak punya pesanan, dipakai lagi di latihan.
- **Blok "Selection + projection"**: `WHERE` memilih baris (selection), daftar kolom `nama, kota` memilih kolom (projection). Hanya Sari dan Wulan yang tinggal di Pekanbaru.
- **Blok "Join"**: `JOIN ... ON` mencocokkan `pesanan.id_pelanggan` dengan `pelanggan.id_pelanggan`. Wulan tidak muncul karena `JOIN` biasa hanya mengembalikan baris yang punya pasangan.
- **Blok "Agregasi"**: `GROUP BY p.nama` mengelompokkan baris per pelanggan; `COUNT(*)` dan `SUM` dihitung per kelompok. Sari: 2 pesanan, total 150.000 + 275.000 = 425.000.
- **Blok "Urutan evaluasi"**: `ribu` adalah alias yang dibuat di `SELECT`, tetapi dipakai di `WHERE`. SQLite tidak mengeluh. Menurut standar dan perilaku PostgreSQL, kueri ini seharusnya ditolak (**belum diuji di PostgreSQL dalam bab ini**).
- **Blok "Integritas referensial"**: `PRAGMA foreign_keys = ON` mengaktifkan pemeriksaan foreign key. Percobaan menambah pesanan untuk pelanggan 999 (tidak ada) ditolak.
- **`EXPLAIN QUERY PLAN`**: menampilkan bahwa mesin memindai seluruh tabel `pesanan` (`SCAN`) karena belum ada indeks pada `id_pelanggan`. Ini bahan pembahasan Bab 10.

> [!WARNING]
> Di SQLite, pemeriksaan foreign key **tidak aktif secara bawaan** per koneksi. Tanpa `PRAGMA foreign_keys = ON`, data yatim (pesanan tanpa pelanggan) bisa masuk tanpa error. PostgreSQL selalu memeriksanya.

> [!TIP]
> Biasakan memberi alias tabel yang pendek (`p`, `o`) saat menulis join, dan selalu awali kolom dengan alias itu (`p.nama`). Kueri jadi lebih mudah dibaca dan tidak ambigu.

---

## Jebakan Umum

1. **Mengira urutan baris itu tetap.** Tanpa `ORDER BY`, urutan hasil tidak dijamin. Selalu tulis `ORDER BY` jika urutan penting.
2. **Menulis alias di `WHERE`.** Jalan di SQLite, gagal di PostgreSQL.
3. **Lupa mengaktifkan foreign key di SQLite.**
4. **Tabel tanpa primary key.** Baris ganda masuk tanpa terdeteksi.

---

## Latihan

**Latihan 1 (konsep).** Jelaskan perbedaan antara relasi dalam teori Codd dan tabel dalam SQL. Sebutkan minimal dua perbedaan.

**Latihan 2 (kode).** Tulis kueri untuk menampilkan nama pelanggan yang tinggal di Padang.

**Latihan 3 (kode).** Tampilkan total belanja per **kota**, urutkan dari yang terbesar.

**Latihan 4 (tantangan).** Tampilkan setiap pelanggan beserta jumlah pesanannya, **termasuk pelanggan yang belum pernah memesan** (jumlahnya 0). Petunjuk: `JOIN` biasa tidak cukup, pakai `LEFT JOIN` (dibahas di Bab 5).

### Kunci jawaban

**Jawaban 1.** (a) Relasi adalah himpunan, jadi tidak ada baris ganda dan tidak ada urutan; tabel SQL boleh punya baris ganda jika tidak dibatasi key, dan hasil kueri tidak berurutan kecuali memakai `ORDER BY`. (b) Teori relasional tidak mengenal `NULL`; SQL mengenal `NULL` dengan logika tiga nilai (benar, salah, tidak diketahui).

**Jawaban 2.**

```sql
SELECT nama FROM pelanggan WHERE kota = 'Padang';
```

Hasil (SQLite): `[('Budi',)]`

**Jawaban 3.**

```sql
SELECT p.kota, SUM(o.total) AS total_belanja
FROM pelanggan AS p
JOIN pesanan AS o ON o.id_pelanggan = p.id_pelanggan
GROUP BY p.kota
ORDER BY total_belanja DESC;
```

Hasil (SQLite): `[('Pekanbaru', 425000), ('Padang', 90000)]`

**Jawaban 4.**

```sql
SELECT p.nama, COUNT(o.id_pesanan) AS jumlah_pesanan
FROM pelanggan AS p
LEFT JOIN pesanan AS o ON o.id_pelanggan = p.id_pelanggan
GROUP BY p.nama
ORDER BY p.nama;
```

Hasil (SQLite): `[('Budi', 1), ('Sari', 2), ('Wulan', 0)]`. `COUNT(o.id_pesanan)` menghitung hanya nilai yang tidak `NULL`, jadi Wulan mendapat 0. Jika kamu memakai `COUNT(*)`, Wulan akan terhitung 1 (baris hasil join-nya tetap ada), dan itu salah.

---

## Rujukan

- Codd, E. F. (1970). *A Relational Model of Data for Large Shared Data Banks.* Communications of the ACM, 13(6), 377–387.
- Dokumentasi resmi PostgreSQL: bagian SQL Language dan Concepts.
- Dokumentasi resmi SQLite: *Foreign Key Support* dan *EXPLAIN QUERY PLAN*.

> [!NOTE]
> Daftar rujukan di atas ditulis dari pengetahuan umum penulis dan belum diperiksa tautan atau nomor halamannya satu per satu.
