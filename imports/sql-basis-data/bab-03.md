# Bab 3: Data Manipulation Language (DML) & Filtering Logis

> [!NOTE]
> **Status draf:** `imported-unverified`. Semua kode di bab ini dijalankan di **SQLite 3.45.1 (Python `sqlite3`)** dan output yang tertulis adalah output nyata. Kode **belum dijalankan di PostgreSQL**. Perbedaan perilaku antar-mesin diberi tanda eksplisit.
> Rujukan di akhir bab belum diperiksa tautannya.

## Tujuan Pembelajaran

Setelah menyelesaikan bab ini, kamu mampu:

1. Menambah, mengubah, dan menghapus baris dengan `INSERT`, `UPDATE`, dan `DELETE`.
2. Menyaring baris dengan `WHERE` memakai operator perbandingan, `AND`, `OR`, dan `NOT`, termasuk urutan prioritasnya.
3. Memakai `BETWEEN`, `IN`, dan `LIKE` dengan benar.
4. Menjelaskan logika tiga nilai (`TRUE`, `FALSE`, `UNKNOWN`) dan menangani `NULL` tanpa jebakan.

---

## 3.1 INSERT, UPDATE, dan DELETE

DML mengubah *isi* tabel (DDL di Bab 2 mengubah *struktur*).

```sql
INSERT INTO tabel (kolom1, kolom2) VALUES (nilai1, nilai2);
UPDATE tabel SET kolom = ekspresi WHERE kondisi;
DELETE FROM tabel WHERE kondisi;
```

> [!CAUTION]
> `UPDATE` dan `DELETE` **tanpa `WHERE`** mengubah atau menghapus *semua* baris. Kebiasaan aman: tulis dulu `SELECT ... WHERE kondisi` untuk melihat baris yang akan terkena, baru ganti menjadi `UPDATE`/`DELETE` dengan `WHERE` yang sama. Di lingkungan produksi, jalankan di dalam transaksi (dibahas di Bab 11).

---

## 3.2 SELECT, WHERE, dan Operator Logika

`SELECT` dengan `WHERE` adalah selection pada model relasional (Bab 1): hanya baris yang membuat kondisi bernilai `TRUE` yang dikembalikan.

Operator perbandingan: `=`, `<>` (atau `!=`), `<`, `<=`, `>`, `>=`.

### Prioritas AND dan OR

`AND` diproses **sebelum** `OR`, sama seperti perkalian sebelum penjumlahan. Karena itu:

```text
A OR B AND C   dibaca sebagai   A OR (B AND C)
```

> [!WARNING]
> Ini sumber bug yang sangat umum. Jika kamu mencampur `AND` dan `OR`, **selalu pakai kurung** agar maksudmu eksplisit dan terbaca orang lain.

---

## 3.3 BETWEEN, IN, dan LIKE

| Operator | Arti | Catatan |
|---|---|---|
| `x BETWEEN a AND b` | `x >= a AND x <= b` | Kedua batas **ikut masuk** |
| `x IN (a, b, c)` | `x = a OR x = b OR x = c` | Lebih ringkas untuk banyak nilai |
| `x LIKE pola` | Pencocokan pola teks | `%` = nol atau lebih karakter, `_` = tepat satu karakter |

> [!WARNING]
> **Perbedaan antar-mesin:** di SQLite, `LIKE` tidak peka huruf besar-kecil untuk karakter ASCII. Di PostgreSQL, `LIKE` **peka** huruf besar-kecil, dan untuk pencarian yang tidak peka huruf tersedia `ILIKE` (**belum diuji di bab ini**). Jangan menulis kueri yang bergantung pada salah satu perilaku tanpa mencatatnya.

---

## 3.4 NULL dan Logika Tiga Nilai

`NULL` berarti "nilai tidak diketahui atau tidak ada", **bukan** nol dan bukan string kosong. Setiap perbandingan dengan `NULL` menghasilkan `UNKNOWN`, bukan `TRUE` atau `FALSE`.

`WHERE` hanya meloloskan baris yang bernilai `TRUE`. Baris `FALSE` maupun `UNKNOWN` sama-sama dibuang.

| Ekspresi | Hasil |
|---|---|
| `NULL = NULL` | `UNKNOWN` |
| `NULL = 5` | `UNKNOWN` |
| `NULL > 5` | `UNKNOWN` |
| `NOT UNKNOWN` | `UNKNOWN` |
| `TRUE OR UNKNOWN` | `TRUE` |
| `FALSE AND UNKNOWN` | `FALSE` |
| `x IS NULL` | `TRUE` atau `FALSE` (tidak pernah `UNKNOWN`) |

Dua akibat penting:

1. Untuk menguji kosong, pakai `IS NULL` / `IS NOT NULL`, **bukan** `= NULL`.
2. `NOT (x > 5)` **tidak** sama dengan "semua baris yang bukan `x > 5`", karena baris dengan `x` bernilai `NULL` tetap `UNKNOWN` dan tetap terbuang.

> [!IMPORTANT]
> **Jebakan `NOT IN`:** jika daftar atau subquery di dalam `NOT IN` mengandung satu saja `NULL`, hasil seluruh kondisi tidak pernah `TRUE`, sehingga kueri mengembalikan **nol baris**. Praktik di bawah memperlihatkannya. Perbaikannya: buang `NULL` dari subquery, atau pakai `NOT EXISTS`.

---

## Praktik: Satu Tabel, Banyak Kondisi

### Kode lengkap

```python
import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.executescript("""
CREATE TABLE karyawan (
    id        INTEGER PRIMARY KEY,
    nama      TEXT    NOT NULL,
    divisi    TEXT,
    gaji      INTEGER,
    atasan_id INTEGER
) STRICT;
""")

def tampil(judul, sql):
    print(f"== {judul} ==")
    for row in cur.execute(sql):
        print(row)

print("== 3.1 INSERT / UPDATE / DELETE ==")
cur.executemany("INSERT INTO karyawan VALUES (?,?,?,?,?)", [
    (1, "Andi",  "Data",    9000000,  None),
    (2, "Bella", "Data",    7500000,  1),
    (3, "Citra", "Finance", 8000000,  1),
    (4, "Dedi",  "Finance", None,     3),
    (5, "Erika", None,      6500000,  1),
    (6, "Fajar", "Data",    7000000,  2),
])
print("setelah INSERT:", cur.execute("SELECT COUNT(*) FROM karyawan").fetchone()[0], "baris")
cur.execute("UPDATE karyawan SET gaji = gaji + 500000 WHERE divisi = 'Data'")
print("baris diubah oleh UPDATE:", cur.rowcount)
cur.execute("DELETE FROM karyawan WHERE id = 6")
print("baris dihapus oleh DELETE:", cur.rowcount)

tampil("3.2 WHERE + operator perbandingan", "SELECT nama, gaji FROM karyawan WHERE gaji >= 8000000 ORDER BY id")
tampil("AND/OR tanpa kurung (AND diproses lebih dulu)",
       "SELECT nama FROM karyawan WHERE divisi = 'Finance' OR divisi = 'Data' AND gaji > 9000000 ORDER BY id")
tampil("AND/OR dengan kurung",
       "SELECT nama FROM karyawan WHERE (divisi = 'Finance' OR divisi = 'Data') AND gaji > 9000000 ORDER BY id")

tampil("3.3 BETWEEN (batas ikut masuk)", "SELECT nama, gaji FROM karyawan WHERE gaji BETWEEN 8000000 AND 9000000 ORDER BY id")
tampil("IN", "SELECT nama FROM karyawan WHERE divisi IN ('Data','Finance') ORDER BY id")
tampil("LIKE '%a'", "SELECT nama FROM karyawan WHERE nama LIKE '%a' ORDER BY id")
tampil("LIKE 'b%' (SQLite: tidak peka huruf besar-kecil)", "SELECT nama FROM karyawan WHERE nama LIKE 'b%'")

tampil("3.4 divisi = NULL (selalu kosong)", "SELECT nama FROM karyawan WHERE divisi = NULL")
tampil("divisi IS NULL", "SELECT nama FROM karyawan WHERE divisi IS NULL")
tampil("gaji > 7500000 (baris gaji NULL tidak ikut)", "SELECT nama FROM karyawan WHERE gaji > 7500000 ORDER BY id")
tampil("NOT (gaji > 7500000) (NULL tetap tidak ikut)", "SELECT nama FROM karyawan WHERE NOT (gaji > 7500000) ORDER BY id")
tampil("gaji > 7500000 OR gaji IS NULL",
       "SELECT nama FROM karyawan WHERE gaji > 7500000 OR gaji IS NULL ORDER BY id")
tampil("COALESCE mengganti NULL", "SELECT nama, COALESCE(divisi, 'Belum ditempatkan') FROM karyawan ORDER BY id")
tampil("NOT IN dengan daftar tetap", "SELECT nama FROM karyawan WHERE id NOT IN (1, 3) ORDER BY id")
tampil("NOT IN dengan NULL di subquery (hasil kosong!)",
       "SELECT nama FROM karyawan WHERE id NOT IN (SELECT atasan_id FROM karyawan) ORDER BY id")
tampil("NOT IN diperbaiki: buang NULL",
       "SELECT nama FROM karyawan WHERE id NOT IN (SELECT atasan_id FROM karyawan WHERE atasan_id IS NOT NULL) ORDER BY id")
```

### Output terverifikasi

> [!NOTE]
> Output ini diperoleh dengan menjalankan kode di atas pada SQLite 3.45.1 (`VERIFIED_RUNNABLE` untuk SQLite saja).

```text
== 3.1 INSERT / UPDATE / DELETE ==
setelah INSERT: 6 baris
baris diubah oleh UPDATE: 3
baris dihapus oleh DELETE: 1
== 3.2 WHERE + operator perbandingan ==
('Andi', 9500000)
('Bella', 8000000)
('Citra', 8000000)
== AND/OR tanpa kurung (AND diproses lebih dulu) ==
('Andi',)
('Citra',)
('Dedi',)
== AND/OR dengan kurung ==
('Andi',)
== 3.3 BETWEEN (batas ikut masuk) ==
('Bella', 8000000)
('Citra', 8000000)
== IN ==
('Andi',)
('Bella',)
('Citra',)
('Dedi',)
== LIKE '%a' ==
('Bella',)
('Citra',)
('Erika',)
== LIKE 'b%' (SQLite: tidak peka huruf besar-kecil) ==
('Bella',)
== 3.4 divisi = NULL (selalu kosong) ==
== divisi IS NULL ==
('Erika',)
== gaji > 7500000 (baris gaji NULL tidak ikut) ==
('Andi',)
('Bella',)
('Citra',)
== NOT (gaji > 7500000) (NULL tetap tidak ikut) ==
('Erika',)
== gaji > 7500000 OR gaji IS NULL ==
('Andi',)
('Bella',)
('Citra',)
('Dedi',)
== COALESCE mengganti NULL ==
('Andi', 'Data')
('Bella', 'Data')
('Citra', 'Finance')
('Dedi', 'Finance')
('Erika', 'Belum ditempatkan')
== NOT IN dengan daftar tetap ==
('Bella',)
('Dedi',)
('Erika',)
== NOT IN dengan NULL di subquery (hasil kosong!) ==
== NOT IN diperbaiki: buang NULL ==
('Bella',)
('Dedi',)
('Erika',)
```

### Penjelasan kode

- **Tabel `karyawan`**: sengaja memuat `NULL` di tiga tempat: Dedi tanpa `gaji`, Erika tanpa `divisi`, dan Andi tanpa `atasan_id`. `atasan_id` merujuk `id` karyawan lain (relasi ke tabel sendiri).
- **Fungsi `tampil(judul, sql)`**: mencetak judul lalu setiap baris hasil. Judul tanpa baris di bawahnya berarti hasil kueri kosong.
- **Blok 3.1**: `executemany` memasukkan enam baris. `UPDATE ... WHERE divisi = 'Data'` menambah gaji tiga karyawan divisi Data, dan `cur.rowcount` melaporkan `3`. `DELETE` menghapus Fajar (`rowcount` = `1`). Gaji Andi sekarang 9.500.000 dan gaji Bella 8.000.000.
- **Prioritas `AND`/`OR`**: tanpa kurung, kondisinya dibaca `Finance OR (Data AND gaji > 9jt)`, jadi Citra dan Dedi (Finance) lolos bersama Andi. Dengan kurung, kondisinya `(Finance OR Data) AND gaji > 9jt`, sehingga hanya Andi. Dedi gugur karena `gaji > 9jt` bernilai `UNKNOWN` (gajinya `NULL`).
- **`BETWEEN 8000000 AND 9000000`**: Bella dan Citra (tepat 8.000.000) ikut masuk, membuktikan batas bawah inklusif. Andi (9.500.000) di luar rentang.
- **`IN`, `LIKE`**: `LIKE '%a'` mengambil nama yang berakhiran "a" (Bella, Citra, Erika). `LIKE 'b%'` (huruf kecil) tetap mengembalikan Bella di SQLite.
- **Blok 3.4**: `divisi = NULL` tidak mengembalikan baris apa pun, sedangkan `divisi IS NULL` menemukan Erika. `gaji > 7500000` tidak memuat Dedi (gaji `NULL`), dan `NOT (gaji > 7500000)` hanya memuat Erika, bukan Dedi. Menambah `OR gaji IS NULL` memasukkan Dedi kembali.
- **`COALESCE(divisi, 'Belum ditempatkan')`**: mengganti `NULL` dengan nilai pengganti untuk tampilan. Isi tabelnya tidak berubah.
- **`NOT IN` dengan subquery**: `atasan_id` berisi `NULL` (milik Andi), sehingga hasilnya **kosong**. Setelah `WHERE atasan_id IS NOT NULL`, hasilnya benar: Bella, Dedi, Erika (bukan atasan siapa pun).

> [!TIP]
> Saat menyaring kolom yang boleh `NULL`, tanyakan pada diri sendiri: "Apa yang seharusnya terjadi pada baris yang nilainya `NULL`?" Lalu tulis `IS NULL` atau `IS NOT NULL` secara eksplisit.

---

## Jebakan Umum

1. **`= NULL` atau `<> NULL`.** Selalu menghasilkan `UNKNOWN`; pakai `IS NULL`/`IS NOT NULL`.
2. **`NOT IN` dengan subquery yang mungkin berisi `NULL`.** Hasil kosong tanpa peringatan.
3. **Mencampur `AND` dan `OR` tanpa kurung.**
4. **`UPDATE`/`DELETE` tanpa `WHERE`.**
5. **Mengira `NOT (x > 5)` sama dengan `x <= 5` pada data yang punya `NULL`.**
6. **Mengandalkan sensitivitas huruf pada `LIKE`** yang berbeda antar-mesin.

---

## Latihan

**Latihan 1 (konsep).** Mengapa `WHERE divisi = NULL` tidak mengembalikan baris apa pun, sekalipun ada baris dengan `divisi` kosong? Tulis cara yang benar.

**Latihan 2 (kode).** Dengan data setelah `UPDATE` dan `DELETE` pada praktik, tampilkan nama karyawan yang gajinya antara 8.000.000 dan 9.500.000 (termasuk batas).

**Latihan 3 (kode).** Tampilkan nama karyawan yang `gaji` **atau** `divisi`-nya belum terisi.

**Latihan 4 (tantangan).** Tampilkan karyawan yang **bukan** atasan siapa pun (id-nya tidak muncul di `atasan_id`), dengan cara yang tidak terjebak `NULL`.

### Kunci jawaban

**Jawaban 1.** `NULL` berarti "tidak diketahui", jadi `divisi = NULL` menghasilkan `UNKNOWN` untuk setiap baris, dan `WHERE` hanya meloloskan baris bernilai `TRUE`. Cara yang benar: `WHERE divisi IS NULL`.

**Jawaban 2.**

```sql
SELECT nama FROM karyawan WHERE gaji BETWEEN 8000000 AND 9500000 ORDER BY id;
```

Hasil (SQLite, dengan data akhir praktik): `[('Andi',), ('Bella',), ('Citra',)]`

**Jawaban 3.**

```sql
SELECT nama FROM karyawan WHERE gaji IS NULL OR divisi IS NULL ORDER BY id;
```

Hasil (SQLite): `[('Dedi',), ('Erika',)]`

**Jawaban 4.**

```sql
SELECT nama FROM karyawan AS k
WHERE NOT EXISTS (SELECT 1 FROM karyawan AS b WHERE b.atasan_id = k.id)
ORDER BY id;
```

Hasil (SQLite): `[('Bella',), ('Dedi',), ('Erika',)]`. `NOT EXISTS` tidak terpengaruh `NULL` di `atasan_id`. Alternatifnya: `NOT IN (SELECT atasan_id ... WHERE atasan_id IS NOT NULL)`.

---

## Rujukan

- Dokumentasi resmi SQLite: *Datatypes In SQLite*, *Expression Syntax* (operator `LIKE`, `BETWEEN`, `IN`), dan *NULL Handling*.
- Dokumentasi resmi PostgreSQL: bagian *Functions and Operators* (Comparison Functions and Operators, Pattern Matching).

> [!NOTE]
> Daftar rujukan di atas ditulis dari pengetahuan umum penulis dan belum diperiksa tautan atau halamannya satu per satu.
