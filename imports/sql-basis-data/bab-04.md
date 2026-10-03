# Bab 4: Agregasi Data & Pengelompokan (GROUP BY & HAVING)

> [!NOTE]
> **Status draf:** `imported-unverified`. Semua kode di bab ini dijalankan di **SQLite 3.45.1 (Python `sqlite3`)** dan output yang tertulis adalah output nyata. Kode **belum dijalankan di PostgreSQL**. Perbedaan perilaku antar-mesin diberi tanda eksplisit.
> Rujukan di akhir bab belum diperiksa tautannya.

## Tujuan Pembelajaran

Setelah menyelesaikan bab ini, kamu mampu:

1. Memakai `COUNT`, `SUM`, `AVG`, `MIN`, dan `MAX`, serta menjelaskan bagaimana tiap fungsi memperlakukan `NULL`.
2. Mengelompokkan data dengan `GROUP BY` satu kolom maupun beberapa kolom.
3. Membedakan `WHERE` (menyaring baris sebelum dikelompokkan) dan `HAVING` (menyaring kelompok sesudahnya).
4. Menghindari tiga jebakan klasik: `COUNT(*)` vs `COUNT(kolom)`, pembagian bilangan bulat, dan kolom non-agregat di luar `GROUP BY`.

---

## 4.1 Fungsi Agregat

Fungsi agregat meringkas banyak baris menjadi satu nilai.

| Fungsi | Hasil |
|---|---|
| `COUNT(*)` | Jumlah baris |
| `COUNT(kolom)` | Jumlah baris yang `kolom`-nya **tidak `NULL`** |
| `COUNT(DISTINCT kolom)` | Jumlah nilai berbeda yang tidak `NULL` |
| `SUM(kolom)` | Jumlah nilai |
| `AVG(kolom)` | Rata-rata |
| `MIN(kolom)`, `MAX(kolom)` | Nilai terkecil dan terbesar |

### Aturan NULL pada agregat

- `COUNT(*)` menghitung semua baris, termasuk yang berisi `NULL`.
- `SUM`, `AVG`, `MIN`, `MAX`, dan `COUNT(kolom)` **mengabaikan** nilai `NULL`.
- Karena itu `AVG(kolom)` adalah rata-rata dari nilai yang **ada**, bukan dari semua baris. Jika `NULL` seharusnya dianggap nol, ubah dulu dengan `COALESCE(kolom, 0)`.
- Pada himpunan **kosong**, `COUNT(*)` menghasilkan `0`, sedangkan `SUM`, `AVG`, `MIN`, dan `MAX` menghasilkan `NULL`.

> [!WARNING]
> **Pembagian bilangan bulat:** pada SQLite, `integer / integer` menghasilkan bilangan bulat yang dipotong (1166, bukan 1166,67). Kalau kamu butuh desimal, kalikan salah satu operand dengan `1.0`. PostgreSQL juga memotong hasil bagi dua integer (**belum diuji di bab ini**).

---

## 4.2 GROUP BY

`GROUP BY` membagi baris ke dalam kelompok berdasarkan nilai kolom, lalu fungsi agregat dihitung **per kelompok**.

```sql
SELECT kolom_kelompok, AGREGAT(...)
FROM tabel
GROUP BY kolom_kelompok;
```

Dengan beberapa kolom (`GROUP BY wilayah, produk`), satu kelompok adalah satu kombinasi unik nilai kolom-kolom itu.

> [!IMPORTANT]
> Aturan standar: setiap kolom di `SELECT` harus berupa **kolom yang ada di `GROUP BY`** atau **dibungkus fungsi agregat**. PostgreSQL menegakkan aturan ini dan menolak kueri yang melanggarnya. SQLite melonggarkannya (lihat blok 4.4).

---

## 4.3 WHERE vs HAVING

Ingat urutan logis dari Bab 1: `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY`.

| | `WHERE` | `HAVING` |
|---|---|---|
| Dievaluasi | **Sebelum** pengelompokan | **Sesudah** pengelompokan |
| Menyaring | Baris | Kelompok |
| Boleh memakai fungsi agregat | Tidak | Ya |

> [!TIP]
> Kalau sebuah kondisi bisa dipasang di `WHERE`, taruh di `WHERE`. Menyaring baris lebih awal membuat database mengelompokkan lebih sedikit data. Pakai `HAVING` hanya untuk kondisi yang butuh hasil agregat.

---

## 4.4 Jebakan Kolom Non-Agregat

Kueri seperti `SELECT wilayah, produk, SUM(qty) ... GROUP BY wilayah` memakai kolom `produk` yang tidak ada di `GROUP BY` dan tidak diagregasi. Satu kelompok `wilayah` bisa berisi beberapa `produk`, jadi mesin tidak punya jawaban yang pasti. PostgreSQL menolaknya. SQLite memilih satu nilai dari salah satu baris, dan pilihannya **tidak dijamin**. Praktik di bawah memperlihatkannya.

---

## Praktik: Ringkasan Penjualan

### Kode lengkap

```python
import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.executescript("""
CREATE TABLE penjualan (
    id      INTEGER PRIMARY KEY,
    wilayah TEXT    NOT NULL,
    produk  TEXT    NOT NULL,
    qty     INTEGER NOT NULL,
    harga   INTEGER NOT NULL,
    diskon  INTEGER
) STRICT;
INSERT INTO penjualan VALUES
 (1,'Riau',   'Kopi', 10, 25000, 0),
 (2,'Riau',   'Teh',   5, 20000, NULL),
 (3,'Riau',   'Kopi',  8, 25000, 5000),
 (4,'Sumbar', 'Kopi',  4, 25000, NULL),
 (5,'Sumbar', 'Teh',  12, 20000, 2000),
 (6,'Jambi',  'Teh',   3, 20000, NULL);
""")

def tampil(judul, sql):
    print(f"== {judul} ==")
    for row in cur.execute(sql):
        print(row)

tampil("4.1 Fungsi agregat dasar",
       "SELECT COUNT(*), SUM(qty), AVG(qty), MIN(qty), MAX(qty) FROM penjualan")

tampil("COUNT(*) vs COUNT(kolom) vs COUNT(DISTINCT)",
       "SELECT COUNT(*), COUNT(diskon), COUNT(DISTINCT wilayah) FROM penjualan")

tampil("AVG mengabaikan NULL",
       "SELECT AVG(diskon), SUM(diskon) * 1.0 / COUNT(*) FROM penjualan")

tampil("AVG dengan NULL dianggap 0",
       "SELECT AVG(COALESCE(diskon, 0)) FROM penjualan")

tampil("Agregat pada himpunan kosong",
       "SELECT COUNT(*), SUM(qty), AVG(qty) FROM penjualan WHERE wilayah = 'Aceh'")

tampil("Pembagian bilangan bulat",
       "SELECT SUM(diskon) / COUNT(*), SUM(diskon) * 1.0 / COUNT(*) FROM penjualan")

tampil("4.2 GROUP BY satu kolom",
       "SELECT wilayah, COUNT(*) AS transaksi, SUM(qty) AS total_qty FROM penjualan GROUP BY wilayah ORDER BY wilayah")

tampil("GROUP BY dua kolom",
       "SELECT wilayah, produk, SUM(qty * harga) AS omzet FROM penjualan GROUP BY wilayah, produk ORDER BY wilayah, produk")

tampil("4.3 WHERE (sebelum grup) vs HAVING (setelah grup)",
       "SELECT wilayah, SUM(qty) AS total_qty FROM penjualan WHERE produk = 'Kopi' GROUP BY wilayah ORDER BY wilayah")

tampil("HAVING menyaring kelompok",
       "SELECT wilayah, SUM(qty * harga) AS omzet FROM penjualan GROUP BY wilayah HAVING SUM(qty * harga) > 300000 ORDER BY omzet DESC")

tampil("WHERE + GROUP BY + HAVING + ORDER BY bersama",
       """SELECT produk, SUM(qty) AS total_qty
          FROM penjualan
          WHERE wilayah IN ('Riau','Sumbar')
          GROUP BY produk
          HAVING SUM(qty) >= 20
          ORDER BY total_qty DESC""")

tampil("4.4 Kolom non-agregat di luar GROUP BY (SQLite longgar)",
       "SELECT wilayah, produk, SUM(qty) FROM penjualan GROUP BY wilayah ORDER BY wilayah")
```

### Output terverifikasi

> [!NOTE]
> Output ini diperoleh dengan menjalankan kode di atas pada SQLite 3.45.1 (`VERIFIED_RUNNABLE` untuk SQLite saja). Hasil blok 4.4 bergantung pada cara SQLite memilih baris dan **tidak boleh dijadikan acuan**.

```text
== 4.1 Fungsi agregat dasar ==
(6, 42, 7.0, 3, 12)
== COUNT(*) vs COUNT(kolom) vs COUNT(DISTINCT) ==
(6, 3, 3)
== AVG mengabaikan NULL ==
(2333.3333333333335, 1166.6666666666667)
== AVG dengan NULL dianggap 0 ==
(1166.6666666666667,)
== Agregat pada himpunan kosong ==
(0, None, None)
== Pembagian bilangan bulat ==
(1166, 1166.6666666666667)
== 4.2 GROUP BY satu kolom ==
('Jambi', 1, 3)
('Riau', 3, 23)
('Sumbar', 2, 16)
== GROUP BY dua kolom ==
('Jambi', 'Teh', 60000)
('Riau', 'Kopi', 450000)
('Riau', 'Teh', 100000)
('Sumbar', 'Kopi', 100000)
('Sumbar', 'Teh', 240000)
== 4.3 WHERE (sebelum grup) vs HAVING (setelah grup) ==
('Riau', 18)
('Sumbar', 4)
== HAVING menyaring kelompok ==
('Riau', 550000)
('Sumbar', 340000)
== WHERE + GROUP BY + HAVING + ORDER BY bersama ==
('Kopi', 22)
== 4.4 Kolom non-agregat di luar GROUP BY (SQLite longgar) ==
('Jambi', 'Teh', 3)
('Riau', 'Kopi', 23)
('Sumbar', 'Kopi', 16)
```

### Penjelasan kode

- **Tabel `penjualan`**: enam transaksi. Kolom `diskon` boleh `NULL` (tiga baris kosong), dipakai untuk menunjukkan perilaku agregat terhadap `NULL`.
- **Fungsi `tampil(judul, sql)`**: mencetak judul lalu setiap baris hasil.
- **Agregat dasar**: ada 6 transaksi, total `qty` 42, rata-rata 7, minimum 3, maksimum 12.
- **`COUNT(*)` vs `COUNT(diskon)`**: `COUNT(*)` = 6, tetapi `COUNT(diskon)` = 3 karena tiga baris `diskon`-nya `NULL`. `COUNT(DISTINCT wilayah)` = 3 (Riau, Sumbar, Jambi).
- **`AVG(diskon)` = 2333,33** adalah rata-rata dari tiga nilai yang ada (0, 5000, 2000). Sedangkan `SUM(diskon) * 1.0 / COUNT(*)` = 1166,67 membagi dengan seluruh enam baris. `AVG(COALESCE(diskon, 0))` memberi 1166,67 yang sama, karena `NULL` dianggap 0. Dua angka yang berbeda untuk "rata-rata diskon" itu semuanya benar, hanya definisinya yang berbeda, jadi tentukan dulu mana yang kamu maksud.
- **Himpunan kosong** (`wilayah = 'Aceh'`): `COUNT(*)` = 0, sedangkan `SUM` dan `AVG` = `None` (yaitu `NULL`).
- **Pembagian bilangan bulat**: `SUM(diskon) / COUNT(*)` = 7000 / 6 menghasilkan **1166** (dipotong), sedangkan versi `* 1.0` menghasilkan 1166,67.
- **`GROUP BY wilayah`**: Riau 3 transaksi dengan total `qty` 23, Sumbar 2 transaksi (16), Jambi 1 transaksi (3).
- **`GROUP BY wilayah, produk`**: omzet dihitung dengan `qty * harga` per kombinasi. Riau-Kopi = 10×25.000 + 8×25.000 = 450.000.
- **`WHERE produk = 'Kopi'` sebelum `GROUP BY`**: hanya baris Kopi yang dikelompokkan, jadi Jambi (yang tidak menjual Kopi) tidak muncul.
- **`HAVING SUM(qty * harga) > 300000`**: menyaring *kelompok*. Riau (550.000) dan Sumbar (340.000) lolos, Jambi (60.000) gugur.
- **Kombinasi lengkap**: `WHERE` membatasi wilayah, `GROUP BY produk` mengelompokkan, `HAVING SUM(qty) >= 20` hanya meloloskan Kopi (22), sedangkan Teh (17) gugur, dan `ORDER BY` mengurutkan hasil.
- **Blok 4.4**: `produk` tidak ada di `GROUP BY` dan tidak diagregasi. SQLite tidak mengeluh dan mengisi salah satu nilai `produk` dari kelompok itu.

> [!TIP]
> Sebelum menjalankan kueri `GROUP BY`, tuliskan dulu dalam satu kalimat: "satu baris hasil mewakili satu ___". Kalau jawabanmu "satu wilayah", maka `SELECT` hanya boleh berisi `wilayah` dan agregat.

---

## Jebakan Umum

1. **Mengira `COUNT(kolom)` sama dengan `COUNT(*)`.** Selisihnya adalah jumlah `NULL`.
2. **Rata-rata yang diam-diam mengabaikan `NULL`.** Putuskan secara sadar apakah `NULL` dihitung 0 atau dibuang.
3. **Pembagian dua integer.** Hasil dipotong; kalikan dengan `1.0` jika butuh desimal.
4. **Kolom non-agregat di luar `GROUP BY`.** Jalan di SQLite, gagal di PostgreSQL, dan hasilnya tidak dapat diandalkan.
5. **Memakai `HAVING` untuk kondisi yang seharusnya di `WHERE`.** Hasilnya sama tetapi lebih boros.
6. **Memakai fungsi agregat di `WHERE`.** Tidak boleh; pindahkan ke `HAVING`.

---

## Latihan

**Latihan 1 (konsep).** Jelaskan perbedaan `WHERE` dan `HAVING`, dan beri satu contoh kondisi yang hanya bisa ditulis di `HAVING`.

**Latihan 2 (kode).** Hitung total omzet (`qty * harga`) per produk, urutkan dari yang terbesar.

**Latihan 3 (kode).** Hitung rata-rata diskon per wilayah dengan nilai `NULL` dianggap 0.

**Latihan 4 (tantangan).** Tampilkan wilayah yang punya **minimal 2 transaksi** dan **omzet minimal 300.000**, lengkap dengan jumlah transaksi dan omzetnya.

### Kunci jawaban

**Jawaban 1.** `WHERE` menyaring baris sebelum dikelompokkan, sedangkan `HAVING` menyaring kelompok sesudah agregat dihitung. Kondisi yang hanya bisa di `HAVING` adalah yang memakai hasil agregat, misalnya `HAVING SUM(qty) >= 20` atau `HAVING COUNT(*) >= 2`.

**Jawaban 2.**

```sql
SELECT produk, SUM(qty * harga) AS omzet
FROM penjualan
GROUP BY produk
ORDER BY omzet DESC;
```

Hasil (SQLite): `[('Kopi', 550000), ('Teh', 400000)]`

**Jawaban 3.**

```sql
SELECT wilayah, AVG(COALESCE(diskon, 0)) AS rata_diskon
FROM penjualan
GROUP BY wilayah
ORDER BY wilayah;
```

Hasil (SQLite): `[('Jambi', 0.0), ('Riau', 1666.6666666666667), ('Sumbar', 1000.0)]`

**Jawaban 4.**

```sql
SELECT wilayah, COUNT(*) AS transaksi, SUM(qty * harga) AS omzet
FROM penjualan
GROUP BY wilayah
HAVING COUNT(*) >= 2 AND SUM(qty * harga) >= 300000
ORDER BY wilayah;
```

Hasil (SQLite): `[('Riau', 3, 550000), ('Sumbar', 2, 340000)]`

---

## Rujukan

- Dokumentasi resmi SQLite: *Aggregate Functions* dan *SELECT* (bagian GROUP BY dan HAVING).
- Dokumentasi resmi PostgreSQL: bagian *Aggregate Functions* dan *Queries* (GROUP BY and HAVING Clauses).

> [!NOTE]
> Daftar rujukan di atas ditulis dari pengetahuan umum penulis dan belum diperiksa tautan atau halamannya satu per satu.
