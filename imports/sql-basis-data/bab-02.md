# Bab 2: Data Definition Language (DDL) & Integritas Data

> [!NOTE]
> **Status draf:** `imported-unverified`. Semua kode di bab ini dijalankan di **SQLite 3.45.1 (Python `sqlite3`)** dan output yang tertulis adalah output nyata. Kode **belum dijalankan di PostgreSQL**. Perbedaan perilaku antar-mesin diberi tanda eksplisit.
> Rujukan di akhir bab belum diperiksa tautannya.

## Tujuan Pembelajaran

Setelah menyelesaikan bab ini, kamu mampu:

1. Membuat tabel dengan `CREATE TABLE` dan memilih tipe data yang tepat.
2. Memakai constraint `PRIMARY KEY`, `UNIQUE`, `NOT NULL`, `CHECK`, dan `DEFAULT` untuk menjaga kualitas data di level database.
3. Mendefinisikan foreign key dan memilih aksi referensial (`RESTRICT`, `CASCADE`) yang sesuai.
4. Mengubah dan menghapus struktur dengan `ALTER TABLE` dan `DROP TABLE` secara aman.

---

## 2.1 CREATE TABLE dan Tipe Data

**DDL (Data Definition Language)** adalah bagian SQL yang mendefinisikan *struktur*: `CREATE`, `ALTER`, `DROP`. Bagian yang mengubah *isi* data (`INSERT`, `UPDATE`, `DELETE`) disebut DML dan dibahas mulai Bab 3.

Bentuk dasarnya:

```sql
CREATE TABLE nama_tabel (
    nama_kolom  TIPE  [constraint ...],
    ...
);
```

### Tipe data skalar yang umum

| Kebutuhan | Tipe di PostgreSQL | Tipe di SQLite |
|---|---|---|
| Bilangan bulat | `INTEGER`, `BIGINT` | `INTEGER` |
| Bilangan desimal presisi tetap | `NUMERIC(p, s)` | `NUMERIC` (lihat peringatan) |
| Teks | `TEXT`, `VARCHAR(n)` | `TEXT` |
| Tanggal dan waktu | `DATE`, `TIMESTAMP` | disimpan sebagai `TEXT`/`INTEGER`/`REAL` |
| Benar/salah | `BOOLEAN` | disimpan sebagai `INTEGER` 0/1 |

> [!WARNING]
> SQLite memakai **tipe dinamis**. Secara bawaan, kolom `INTEGER` tetap menerima teks seperti `'abc'` dan menyimpannya sebagai teks. Ini sangat berbeda dari PostgreSQL, yang menolaknya. SQLite 3.37 ke atas menyediakan **tabel `STRICT`** agar tipe ditegakkan. Dalam bab ini hampir semua tabel dibuat `STRICT` supaya perilakunya mendekati mesin lain.

---

## 2.2 Constraint: Menjaga Data di Pintu Masuk

Constraint adalah aturan yang ditegakkan oleh database sendiri. Keuntungannya: aturan berlaku untuk **semua** aplikasi dan skrip yang menulis ke tabel itu, bukan hanya satu program.

| Constraint | Fungsi |
|---|---|
| `PRIMARY KEY` | Pengenal unik tiap baris; tidak boleh kosong |
| `UNIQUE` | Nilai tidak boleh kembar |
| `NOT NULL` | Nilai tidak boleh kosong |
| `CHECK (kondisi)` | Nilai harus memenuhi kondisi |
| `DEFAULT nilai` | Nilai otomatis jika tidak diisi |

> [!IMPORTANT]
> Constraint adalah **lapisan terakhir** pertahanan data. Validasi di aplikasi tetap perlu (untuk pesan error yang ramah), tetapi jangan pernah menjadikannya satu-satunya penjaga.

---

## 2.3 Foreign Key dan Aksi Referensial

Foreign key menghubungkan tabel anak ke tabel induk. Pertanyaan pentingnya: *apa yang terjadi bila baris induk dihapus?* Kamu memilihnya lewat klausa `ON DELETE`:

| Aksi | Perilaku |
|---|---|
| `RESTRICT` | Menolak penghapusan induk selama masih ada anak |
| `CASCADE` | Ikut menghapus semua anak |

> [!WARNING]
> `CASCADE` praktis tetapi berbahaya: satu `DELETE` bisa menghapus ratusan baris turunan tanpa peringatan. Pakai hanya untuk data yang memang tidak bermakna tanpa induknya (misalnya ulasan terhadap sebuah barang). Untuk data penting seperti transaksi keuangan, pilih `RESTRICT`.

---

## 2.4 ALTER TABLE dan DROP TABLE

`ALTER TABLE` mengubah struktur tabel yang sudah ada, `DROP TABLE` menghapus tabel beserta seluruh isinya.

> [!CAUTION]
> `DROP TABLE` tidak bisa dibatalkan di luar transaksi atau cadangan. Di lingkungan produksi, jangan jalankan `DROP` tanpa cadangan, dan biasakan menulis `DROP TABLE IF EXISTS` hanya pada skrip yang memang sengaja dibuat ulang (misalnya data latihan).

---

## Praktik: Menguji Setiap Constraint

### Kode lengkap

```python
import sqlite3

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
print("tabel ada:", sorted(r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")))
```

### Output terverifikasi

> [!NOTE]
> Output ini diperoleh dengan menjalankan kode di atas pada SQLite 3.45.1 (`VERIFIED_RUNNABLE` untuk SQLite saja).

```text
== 2.1 Tipe data: tabel biasa vs STRICT ==
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
tabel ada: ['barang', 'kategori', 'ketat', 'longgar', 'produk']
```

### Penjelasan kode

- **Fungsi `coba(label, sql)`**: membungkus satu perintah dalam `try/except`. Jika berhasil, mencetak `BERHASIL`; jika database menolak, mencetak pesan error asli. Dengan begitu kita bisa *melihat* constraint bekerja.
- **`PRAGMA foreign_keys = ON`**: wajib di SQLite agar foreign key ditegakkan (lihat peringatan di Bab 1).
- **Blok 2.1**: tabel `longgar` menerima teks `'abc'` di kolom `INTEGER`, dan `typeof` membuktikan nilainya tersimpan sebagai `text`. Tabel `ketat` (dengan `STRICT`) menolaknya.
- **Blok 2.2**: tabel `produk` memuat semua constraint. Insert pertama berhasil, dan `stok` otomatis `0` berkat `DEFAULT`. Tiga percobaan berikutnya masing-masing melanggar `UNIQUE` (sku kembar), `CHECK` (harga negatif), dan `NOT NULL` (nama kosong), dan database menyebut constraint mana yang dilanggar.
- **Blok 2.3**: `kategori` → `barang` memakai `RESTRICT`, sedangkan `barang` → `ulasan` memakai `CASCADE`. Menghapus kategori yang masih dipakai ditolak. Menghapus barang berhasil dan kedua ulasannya ikut terhapus (`sisa ulasan: 0`).
- **Blok 2.4**: `ADD COLUMN` menambah kolom, `RENAME COLUMN` mengganti namanya, `DROP COLUMN` membuangnya. Menambah kolom `NOT NULL` tanpa `DEFAULT` ditolak, karena baris yang sudah ada tidak punya nilai untuk kolom baru itu. Terakhir `DROP TABLE IF EXISTS ulasan` menghapus tabel (yang tersisa: `barang`, `kategori`, `ketat`, `longgar`, `produk`).

> [!TIP]
> Saat menambah kolom wajib ke tabel yang sudah berisi data, sertakan `DEFAULT`. Atau lakukan tiga langkah: tambah kolom boleh kosong, isi nilai untuk semua baris, lalu tambahkan constraint `NOT NULL`.

> [!WARNING]
> **Perbedaan PostgreSQL (belum diuji di bab ini):** PostgreSQL selalu menegakkan tipe, jadi tidak ada padanan `STRICT`. Untuk kunci otomatis ia memakai `GENERATED ... AS IDENTITY` (atau `SERIAL`), sedangkan `INTEGER PRIMARY KEY` di SQLite otomatis menaikkan nilai. Untuk mengubah tipe kolom, PostgreSQL memakai `ALTER COLUMN ... TYPE`, yang tidak dibahas di bab ini.

---

## Jebakan Umum

1. **Mengandalkan validasi aplikasi saja.** Skrip impor atau pengguna lain bisa menembus aplikasi; constraint tidak.
2. **Memakai `CASCADE` secara refleks.** Penghapusan beruntun bisa menghapus data yang masih dibutuhkan.
3. **Kolom `NOT NULL` tanpa `DEFAULT` pada tabel berisi.** Perubahan ditolak atau, di mesin tertentu, gagal di tengah migrasi.
4. **Mengira SQLite sama ketatnya dengan PostgreSQL.** Tanpa `STRICT`, tipe tidak ditegakkan.
5. **Menjalankan `DROP TABLE` tanpa cadangan.**

---

## Latihan

**Latihan 1 (konsep).** Apa beda tabel biasa dan tabel `STRICT` di SQLite? Mengapa perbedaan ini penting bila nanti datamu dipindah ke PostgreSQL?

**Latihan 2 (kode).** Buat tabel `STRICT` bernama `anggota` dengan kolom: `id_anggota` (primary key), `email` (wajib dan unik), `umur` (wajib, antara 17 dan 100), `status` (wajib, bawaan `'aktif'`). Lalu coba masukkan anggota berumur 16 dan 20.

**Latihan 3 (kode).** Buat tabel `pinjaman` yang merujuk `anggota` dengan `ON DELETE RESTRICT`, isi satu pinjaman untuk anggota 1, lalu coba hapus anggota itu. Apa yang terjadi?

**Latihan 4 (tantangan).** Tabel `anggota` sudah berisi data. Tambahkan kolom wajib `kota` tanpa membuat perubahan ditolak.

### Kunci jawaban

**Jawaban 1.** Tabel biasa SQLite menerima nilai dengan tipe apa pun di kolom apa pun (tipe hanya "afinitas"), sedangkan tabel `STRICT` menolak nilai yang tipenya tidak cocok. Kalau datamu dibuat di tabel biasa lalu dipindah ke PostgreSQL, nilai yang salah tipe (misalnya teks di kolom bilangan) yang selama ini lolos akan membuat proses impor gagal.

**Jawaban 2.**

```sql
CREATE TABLE anggota (
    id_anggota INTEGER PRIMARY KEY,
    email      TEXT    NOT NULL UNIQUE,
    umur       INTEGER NOT NULL CHECK (umur BETWEEN 17 AND 100),
    status     TEXT    NOT NULL DEFAULT 'aktif'
) STRICT;
```

Hasil (SQLite): umur 16 ditolak (`CHECK constraint failed: umur BETWEEN 17 AND 100`); umur 20 berhasil dan `status` terisi `aktif`; email yang sama untuk kedua kalinya ditolak (`UNIQUE constraint failed: anggota.email`).

**Jawaban 3.**

```sql
CREATE TABLE pinjaman (
    id_pinjaman INTEGER PRIMARY KEY,
    id_anggota  INTEGER NOT NULL REFERENCES anggota(id_anggota) ON DELETE RESTRICT
) STRICT;
INSERT INTO pinjaman VALUES (1, 1);
DELETE FROM anggota WHERE id_anggota = 1;
```

Hasil (SQLite): penghapusan ditolak dengan `FOREIGN KEY constraint failed`, karena anggota 1 masih punya pinjaman.

**Jawaban 4.**

```sql
ALTER TABLE anggota ADD COLUMN kota TEXT NOT NULL DEFAULT 'belum diisi';
```

Hasil (SQLite): berhasil, dan baris yang sudah ada mendapat nilai `belum diisi` (`[('a@x.id', 'belum diisi')]`).

---

## Rujukan

- Dokumentasi resmi SQLite: *STRICT Tables*, *Datatypes In SQLite*, dan *ALTER TABLE*.
- Dokumentasi resmi PostgreSQL: bagian *Data Definition* (Constraints dan Altering Tables).

> [!NOTE]
> Daftar rujukan di atas ditulis dari pengetahuan umum penulis dan belum diperiksa tautan atau halamannya satu per satu.
