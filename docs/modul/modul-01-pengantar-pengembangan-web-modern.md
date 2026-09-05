# Modul 01: Pengantar Pengembangan Web Modern & Arsitektur Client-Server

---

## 1. Overview & Pengantar

Selamat datang di perkuliahan **Pengembangan Aplikasi Web Modern**.

Jika kalian membuka mata kuliah ini dengan ekspektasi bahwa kita akan langsung membuat tombol warna-warni atau menghafal tag HTML, tahan dulu. Di industri, banyak lulusan baru yang bisa mengetik sintaks React atau membuat tampilan rapi, tetapi langsung panik ketika aplikasinya lambat, data bocor, atau muncul pesan error CORS (*Cross-Origin Resource Sharing*) di *console*. 

Masalahnya bukan pada kemampuan menghafal sintaks, melainkan pada **mental model**. Mereka tidak memahami apa yang sebenarnya terjadi di balik layar saat sebuah URL ditekan di browser.

Modul pertama ini adalah kompas bagi sebelas modul berikutnya. Di sini, kita akan membedah bagaimana web berevolusi dari sekadar tumpukan dokumen teks statis menjadi aplikasi terdistribusi yang sangat dinamis, bagaimana siklus hidup *request-response* bekerja di jaringan, serta di mana garis tegas pemisah antara ranah *client* (perangkat pengguna) dan *server* (pusat kendali dan data).

Pahami fondasi ini dengan baik. Tanpa pemahaman arsitektur *client-server* yang kokoh, kalian akan tersesat ketika nanti kita membahas Server Component, *hydration*, dan Server Actions di Next.js.

---

## 2. Tujuan Pembelajaran

Setelah menyelesaikan modul ini dan mengerjakan seluruh latihannya, kalian diharapkan mampu:

1. **Menganalisis** evolusi arsitektur web dari Multi-Page Application (MPA) tradisional, Single Page Application (SPA), hingga arsitektur Hybrid modern (SSR/SSG/Server Components).
2. **Membedah** anatomi siklus hidup *request-response* HTTP/HTTPS, mencakup resolusi DNS, *handshake*, *headers*, status codes, dan *payload*.
3. **Mengidentifikasi** batas runtime (*runtime boundary*) antara ekosistem browser (Client) dan Node.js/Server runtime, termasuk implikasi keamanannya terhadap rahasia aplikasi (*secrets*).
4. **Mendiagnosis** masalah komunikasi data dasar seperti CORS, kegagalan *network timeout*, dan kesalahan pemilihan metode HTTP menggunakan browser DevTools dan cURL.

---

## 3. Prasyarat Pengetahuan & Perangkat

Sebelum memulai modul ini, pastikan kalian telah memenuhi prasyarat berikut:

- **Konsep**: Pemahaman dasar pemrograman prosedural (variabel, fungsi, struktur percabangan `if/else`, dan loop).
- **Perangkat Lunak Terpasang**:
  - Web Browser modern dengan Developer Tools aktif (Google Chrome, Firefox, atau Microsoft Edge versi terbaru).
  - Node.js versi LTS (minimal v20.x atau v22.x). Periksa di terminal dengan mengetik `node -v`.
  - Git dan Terminal/Command Prompt (PowerShell, Bash, atau Zsh).
  - cURL (sudah tersedia *built-in* di Windows 10/11 dan macOS/Linux).

---

## 4. Konten Pembelajaran Utama

### 4.1 Evolusi Arsitektur Web: Dari Dokumen Statis ke Arsitektur Hybrid

Banyak mahasiswa mengira bahwa "React" atau "Next.js" adalah titik awal pengembangan web. Padahal, teknologi yang kita gunakan hari ini lahir dari akumulasi rasa sakit para insinyur web di masa lalu.

Mari kita lihat tiga gelombang evolusinya:

```
[Era 1: MPA Tradisional]       [Era 2: SPA Murni]           [Era 3: Hybrid Modern]
Client ---- Request Page ---> Client ---- Load Empty HTML -> Client --- Fast Initial HTML ->
       <--- Full HTML Server        <--- Big JS Bundle Server       <-- Hydration/RSC Server
(Setiap klik = Layar putih)   (Loading awal lambat/SEO jelek) (Cepat + Interaktif + Aman)
```

#### 1. Era Multi-Page Application (MPA) Tradisional (Era 1995–2012)
Pada era PHP, ASP klasik, atau JSP, setiap kali pengguna mengklik tautan atau mengirim formulir, browser mengirimkan *request* ke server. Server kemudian menjalankan skrip, mengambil data dari basis data, merakit seluruh dokumen HTML dari tag `<html>` pembuka hingga `</html>` penutup, lalu mengirimkannya kembali ke browser.
- **Kelebihan**: Konten langsung terbaca mesin pencari (SEO bagus) dan beban komputasi di laptop pengguna sangat rendah.
- **Kelemahan**: Pengalaman pengguna kaku. Setiap perpindahan halaman ditandai dengan layar putih (*white flash*) karena browser harus membuang seluruh halaman lama dan merender ulang semuanya dari nol, termasuk header dan navigasi yang sebenarnya tidak berubah.

#### 2. Era Single Page Application (SPA) (Era 2013–2020)
Kelahiran pustaka seperti React, Vue, dan Angular mengubah paradigma. Browser hanya meminta satu file HTML kosong (*shell*) yang biasanya hanya berisi `<div id="root"></div>`, disertai satu file bundle JavaScript berukuran masif (sering kali puluhan megabyte jika tidak dioptimalkan).
JavaScript inilah yang berjalan di browser pengguna, mengambil data via REST API dalam format JSON, lalu menggambar elemen antarmuka secara dinamis menggunakan Document Object Model (DOM).
- **Kelebihan**: Transisi antar halaman terasa instan seperti aplikasi desktop native, tanpa layar putih.
- **Kelemahan Fatal**:
  1. *First Contentful Paint* (FCP) sangat lambat, terutama bagi pengguna dengan koneksi internet seluler atau ponsel kelas menengah ke bawah. Pengguna harus menunggu file JavaScript selesai diunduh dan dieksekusi sebelum bisa melihat konten apa pun.
  2. *Search Engine Optimization* (SEO) buruk untuk konten publik karena *crawler* mesin pencari sering kali melihat halaman kosong sebelum JavaScript selesai berjalan.

#### 3. Era Hybrid & React Server Components (Era 2021–Sekarang)
Framework modern seperti **Next.js (App Router)** menggabungkan kekuatan terbaik dari dua era sebelumnya. Halaman awal dirakit di server sehingga pengguna langsung menerima HTML matang dalam hitungan milidetik. Setelah halaman tampil, JavaScript kecil diunduh di latar belakang untuk membuat halaman menjadi interaktif—sebuah proses yang disebut **hydration**.

Bahkan dengan fitur **React Server Components (RSC)** terkini, komponen yang hanya bertugas mengambil data (misalnya daftar produk) tetap tinggal di server dan tidak pernah dikirimkan sebagai JavaScript ke browser. Ukuran unduhan menjadi jauh lebih kecil, performa melesat, dan keamanan kode backend tetap terjaga.

---

### 4.2 Anatomi Komunikasi Client-Server: Protokol HTTP/HTTPS

Komunikasi antara browser kalian (Client) dan server aplikasi bekerja berdasarkan model **Request-Response**. Keduanya berkomunikasi menggunakan protokol HTTP (*Hypertext Transfer Protocol*).

Saat kalian mengetik alamat `https://velqora.ac.id/dashboard` di address bar dan menekan Enter, inilah rangkaian peristiwa yang terjadi dalam sepersekian detik:

```
1. Browser mencari IP: DNS Lookup (velqora.ac.id -> 104.21.45.12)
2. Pembentukan Jalur: TCP 3-Way Handshake + TLS Encryption Negotiation
3. Client mengirimkan: HTTP Request (Method, Path, Headers, Body)
4. Server memproses: Routing -> Middleware -> Controller -> Database
5. Server mengirimkan: HTTP Response (Status Code, Headers, Payload HTML/JSON)
6. Browser merender: Parsing HTML -> Load CSS/JS -> Layout -> Paint
```

#### Anatomi HTTP Request
Sebuah request yang dikirimkan oleh browser terdiri dari tiga bagian utama:

```http
GET /api/v1/materi?kategori=frontend HTTP/1.1
Host: api.velqora.ac.id
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
Accept: application/json
```

1. **Request Line**: Berisi **Metode HTTP** (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), **Target URL/Path**, dan **Versi Protokol**.
   - `GET`: Mengambil data (tidak boleh mengubah state sistem di server, tidak boleh membawa request body).
   - `POST`: Mengirim data baru (misalnya pendaftaran akun atau pengiriman tugas).
   - `PUT` / `PATCH`: Memperbarui data yang sudah ada (`PUT` mengganti seluruh objek, `PATCH` memperbarui sebagian field).
   - `DELETE`: Menghapus data.
2. **Request Headers**: Informasi metadata tentang klien, format data yang diterima (`Accept`), kredensial autentikasi (`Authorization` / `Cookie`), dan bahasa yang diinginkan.
3. **Request Body (Payload)**: Data aktual yang dikirimkan ke server (biasanya berupa JSON atau FormData pada method `POST`/`PUT`/`PATCH`).

#### Anatomi HTTP Response
Server membalas dengan format yang serupa:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: public, max-age=3600
Set-Cookie: session_id=xyz789; HttpOnly; Secure; SameSite=Strict

{
  "status": "success",
  "data": [
    { "id": 1, "judul": "Pengantar Web Modern", "minggu": 1 }
  ]
}
```

1. **Status Line**: Berisi versi protokol dan **HTTP Status Code**.
   - `2xx (Success)`: Permintaan berhasil. Contoh paling umum: `200 OK`, `201 Created` (data baru berhasil disimpan).
   - `3xx (Redirection)`: Lokasi sumber daya berpindah. Contoh: `301 Moved Permanently`, `307 Temporary Redirect`.
   - `4xx (Client Error)`: Kesalahan dari sisi pemanggil. Contoh: `400 Bad Request` (payload salah format), `401 Unauthorized` (belum login), `403 Forbidden` (sudah login tapi bukan admin/tidak punya hak), `404 Not Found`.
   - `5xx (Server Error)`: Server mengalami kegagalan internal. Contoh: `500 Internal Server Error` (ada uncaught exception atau database crash), `502 Bad Gateway`, `504 Gateway Timeout`.
2. **Response Headers**: Metadata respons, seperti tipe konten (`Content-Type`), strategi caching (`Cache-Control`), dan instruksi penyimpanan cookie keamanan (`Set-Cookie`).
3. **Response Body**: Data dokumen yang diminta (HTML, CSS, JSON, atau file biner gambar/PDF).

---

### 4.3 Runtime Boundary: Dunia Browser vs Dunia Node.js

Salah satu kebingungan terbesar mahasiswa ketika pertama kali belajar full-stack JavaScript adalah: *"Kan bahasanya sama-sama JavaScript/TypeScript, kenapa fungsi ini bisa jalan di satu tempat tapi crash di tempat lain?"*

Kalian harus membedakan **bahasa** dengan **lingkungan eksekusi (*runtime environment*)**.

| Fitur / Objek | Runtime Browser (Client) | Runtime Node.js (Server) |
| :--- | :--- | :--- |
| **Akses DOM (`document`, `window`)** | **Bisa** (Digunakan untuk manipulasi tampilan) | **Tidak Ada** (`ReferenceError: window is not defined`) |
| **Akses File Lokal (`fs.readFile`)** | **Dilarang keras** (Demi keamanan sistem pengguna) | **Bisa** (Membaca file server, log, config) |
| **Akses Basis Data Langsung** | **Dilarang keras** (Kredensial database akan bocor!) | **Bisa** (Menggunakan koneksi pool PostgreSQL/Prisma) |
| **Penyimpanan Lokal** | `localStorage`, `sessionStorage`, `IndexedDB` | Memory cache (Redis), Database, Memory process |
| **Variabel Rahasia (`process.env.SECRET`)** | **Berbahaya jika terekspos** | **Aman** (Tinggal di lingkungan server) |

Perhatikan contoh kode nyata berikut di Next.js:

```typescript
// CONTOH KESALAHAN YANG SERING TERJADI:
// File: src/components/UserProfile.tsx ('use client')

export default function UserProfile() {
  // ❌ SALAH BESAR: Memanggil database driver langsung di client component
  // Kode ini akan mencoba mengunduh konektor database ke browser pengguna.
  // Hasilnya: Error build kompilasi atau bocornya username/password database!
  
  // const user = await db.query("SELECT * FROM users WHERE id = 1");

  // ✅ PENDEKATAN BENAR:
  // Client hanya memanggil endpoint / Server Action yang aman:
  // const res = await fetch("/api/user/profile");
  // const user = await res.json();

  return <div>Halo, Mahasiswa!</div>;
}
```

---

### 4.4 Catatan dari Lapangan: Tiga Miskonsepsi Fatal Pemula

Di dunia industri, saya telah melihat puluhan *pull request* ditolak dan beberapa insiden keamanan terjadi hanya karena pengembang junior tidak memahami batasan dasar ini. Berikut tiga hal yang wajib kalian catat:

#### 1. Miskonsepsi CORS: "CORS itu error di server saya!"
Banyak mahasiswa mengeluh: *"Pak, API saya rusak, muncul error CORS di konsol browser."*
Kalian harus tahu: **CORS adalah fitur keamanan di browser, bukan bug di server.**
Jika kalian memanggil API dari cURL atau Postman, panggilannya akan selalu berhasil 100%. Tetapi ketika kalian memanggilnya dari JavaScript di browser pada domain yang berbeda (misalnya frontend berjalan di `localhost:3000` dan backend di `localhost:8000`), browser akan mencegat respons tersebut kecuali backend secara eksplisit mengirimkan header:
`Access-Control-Allow-Origin: http://localhost:3000`.
Memperbaiki CORS bukan dengan menonaktifkan keamanan browser, melainkan dengan mengonfigurasi header whitelist yang benar di backend, atau menggunakan *reverse proxy* / Route Handler internal Next.js.

#### 2. Kebocoran API Key di Git dan Client Bundle
Mahasiswa sering meletakkan Google Maps API Key, Supabase Service Role Key, atau JWT Secret langsung di dalam kode JavaScript frontend, lalu melakukan `git push` ke GitHub publik. Dalam waktu kurang dari 5 menit, bot otomatis di internet akan memindai repositori kalian, mencuri key tersebut, dan menggunakannya untuk menambang kripto atau menguras kuota cloud kalian hingga jutaan rupiah.
**Aturan Emas**: Variabel lingkungan yang mengandung akses tulis/database rahasia **TIDAK BOLEH** memiliki awalan `NEXT_PUBLIC_`.

#### 3. Asal Menggunakan Method GET untuk Aksi Menghapus/Mengubah Data
Pernah ada kasus di mana seorang pengembang membuat endpoint penghapusan data dengan link biasa: `<a href="/api/delete-user?id=12">Hapus Akun</a>`.
Ketika bot *web crawler* mesin pencari mengunjungi situs tersebut dan menjelajahi semua tautan `<a>`, seluruh data pengguna terhapus otomatis!
**Aturan Emas**: Method `GET` harus *idempotent* dan *safe* (tidak boleh mengubah data). Setiap mutasi data wajib menggunakan `POST`, `PUT`, `PATCH`, atau `DELETE` dengan validasi CSRF (*Cross-Site Request Forgery*).

---

## 5. Latihan & Tugas Praktik

Kerjakan dua latihan berikut langsung di terminal dan browser kalian untuk membuktikan teori di atas.

### Latihan 1: Investigasi Protokol HTTP dengan cURL (Tingkat Dasar)

Buka terminal (PowerShell, Command Prompt, atau Terminal Linux/macOS) dan jalankan perintah cURL berikut dengan flag `-v` (*verbose*) untuk melihat proses jabat tangan (*handshake*) dan header HTTP:

```bash
curl -v https://api.github.com/zen
```

**Tugas Kalian**:
1. Temukan baris yang diawali tanda `>` (ini adalah HTTP Request yang dikirim terminal kalian). Catat **Metode HTTP**, **Path**, dan minimal dua **Request Header**.
2. Temukan baris yang diawali tanda `<` (ini adalah HTTP Response dari server GitHub). Catat **HTTP Status Code** dan header `content-type`.
3. Jalankan perintah cURL kedua ke alamat yang sengaja salah:
   ```bash
   curl -v https://api.github.com/halaman-ini-pasti-tidak-ada-404
   ```
   Berapa status code yang dikembalikan? Jelaskan mengapa server mengembalikan angka tersebut!

---

### Latihan 2: Membedah Runtime Boundary (Tingkat Lanjutan)

Buat sebuah file JavaScript sederhana bernama `runtime-check.js` di komputer kalian:

```javascript
// runtime-check.js
console.log("=== MEMERIKSA LINGKUNGAN RUNTIME ===");

// Uji ketersediaan objek Process (Khas Node.js)
if (typeof process !== "undefined" && process.versions && process.versions.node) {
  console.log("1. Berjalan di Lingkungan: SERVER / NODE.JS (Versi:", process.version, ")");
} else {
  console.log("1. Bukan Node.js murni");
}

// Uji ketersediaan objek Window (Khas Browser)
if (typeof window !== "undefined") {
  console.log("2. Objek 'window' TERSEDIA. Resolusi layar:", window.innerWidth, "x", window.innerHeight);
} else {
  console.log("2. Objek 'window' TIDAK TERSEDIA (ReferenceError dicegah)");
}
```

**Tugas Kalian**:
1. Jalankan file tersebut di terminal menggunakan Node.js:
   ```bash
   node runtime-check.js
   ```
   Amati outputnya. Mengapa poin nomor 2 menyatakan objek `window` tidak tersedia?
2. Sekarang, buka sembarang halaman di browser, buka **DevTools (F12) -> Console Tab**, lalu salin dan tempel seluruh isi skrip di atas ke konsol browser, lalu tekan Enter.
3. Bandingkan perbedaannya. Buat kesimpulan 2–3 kalimat tentang bagaimana kode yang sama berperilaku berbeda di dua runtime tersebut!

---

## 6. Studi Kasus Nyata

### Kasus: "Insiden Layar Putih 12 Detik pada Sistem Informasi Akademik"

#### Latar Belakang Masalah
Sebuah perguruan tinggi membangun portal pengisian Kartu Rencana Studi (KRS) daring menggunakan arsitektur Single Page Application (SPA) murni dengan Create React App. Saat masa uji coba internal di jaringan WiFi kampus yang kencang, aplikasi berjalan sangat lancar.
Namun, pada hari pertama pengisian KRS serentak pukul 08.00 pagi, ratusan mahasiswa mengeluh di media sosial bahwa situs kampus rusak:
- Mahasiswa yang mengakses dari smartphone menggunakan kuota seluler mengeluhkan layar putih kosong (*blank white screen*) selama 10 hingga 15 detik sebelum tombol login muncul.
- Banyak mahasiswa mengklik tombol "Kirim KRS" berulang-ulang hingga 10 kali karena tidak ada umpan balik visual, menyebabkan server database kampus tumbang (*crash*) akibat ribuan query duplikat.

#### Analisis Akar Masalah Arsitektur
1. **Bundle Size Raksasa**: Aplikasi SPA tersebut menggabungkan seluruh modul (admin, dosen, mahasiswa, cetak PDF) ke dalam satu file `bundle.js` sebesar 14.8 MB. Sebelum file 14.8 MB ini selesai diunduh dan diparsing oleh mesin JavaScript ponsel mahasiswa, halaman tidak menampilkan apa pun.
2. **Ketiadaan Server Rendering**: HTML awal yang dikirimkan server hanya berukuran 200 byte berisi:
   ```html
   <!DOCTYPE html><html><body><div id="root"></div></body></html>
   ```
   Browser tidak bisa menampilkan teks atau indikator loading awal sebelum JavaScript selesai bekerja.
3. **Pemberian Aksi Non-Idempotent Tanpa Proteksi Status**: Tombol submit mengirimkan request `POST` berulang tanpa mekanisme *debouncing*, *optimistic disable*, atau idempotency key di backend.

#### Solusi Transformasi Arsitektur
Tim teknis memutuskan melakukan migrasi ke arsitektur **Hybrid Server-Rendered (Next.js)**:
1. **Pemisahan Bundle & SSR**: Halaman formulir KRS di-render di server. Begitu mahasiswa membuka URL, server langsung mengirimkan HTML berukuran 45 KB yang sudah berisi antarmuka formulir lengkap. *First Contentful Paint* turun drastis dari 12 detik menjadi **1.1 detik**.
2. **Code Splitting Otomatis**: Mahasiswa hanya mengunduh kode JavaScript khusus halaman KRS mahasiswa (sekitar 80 KB), tanpa perlu mengunduh kode modul dosen atau panel admin kampus.
3. **Handling Mutasi Aman**: Menggunakan Server Actions dengan status pending otomatis (`useActionState`) yang menonaktifkan tombol dan menampilkan animasi pemrosesan seketika setelah klik pertama.

---

## 7. Rangkuman Reflektif

Jika ada satu pelajaran penting yang harus kalian bawa pulang dari modul pertama ini, ini dia: **jangan pernah memperlakukan web browser sebagai lingkungan yang sepenuhnya kalian kendalikan.**

Browser adalah lingkungan asing di perangkat milik orang lain. Koneksi internetnya bisa tiba-tiba putus di tengah jalan, perangkatnya mungkin ponsel murah dengan memori pas-pasan, dan penggunanya bisa saja dengan sengaja membuka DevTools untuk mengutak-atik kode JavaScript kalian.

Karena itu, bagilah selalu tanggung jawab sistem secara disiplin:
- Gunakan **Client** untuk menyajikan antarmuka yang responsif, menangkap interaksi pengguna, dan memberikan umpan balik visual yang cepat.
- Percayakan **Server** sebagai benteng pertahanan terakhir untuk menjaga integritas data bisnis, mengeksekusi logika rahasia, serta membatasi hak akses.

Di modul berikutnya, kita akan menyelami bagaimana menstrukturkan dokumen web dengan standar **HTML5 Semantik** dan menyusun tata letak modern yang tangguh di berbagai ukuran layar menggunakan **Flexbox dan CSS Grid**.

---

## 8. Evaluasi & Kuis Pemahaman

Pilihlah satu jawaban yang paling tepat untuk soal nomor 1–5, dan jawablah pertanyaan nomor 6–7 dengan analisis singkat.

### Pilihan Ganda

#### Soal 1
Sebuah aplikasi web SPA murni dibangun menggunakan React. Ketika pengguna pertama kali mengakses halaman melalui jaringan 3G yang lambat, apa yang menyebabkan pengguna melihat layar putih kosong selama beberapa detik?
- A. Server web menolak koneksi karena kuota bandwidth habis.
- B. Browser belum menerima dan mengeksekusi file bundle JavaScript yang bertugas menggambar elemen DOM ke dalam container HTML.
- C. Basis data server sedang terkunci (*database lock*) sehingga tidak bisa merespons query.
- D. Browser secara otomatis memblokir rendering karena mendeteksi pelanggaran CORS.

> **Kunci Jawaban: B**  
> **Pembahasan**: Pada SPA murni, file HTML awal pada dasarnya kosong. Tampilan hanya akan muncul setelah browser selesai mengunduh, mengurai (*parse*), dan mengeksekusi file bundle JavaScript yang berisi logika rendering komponen.

---

#### Soal 2
Manakah dari baris kode berikut yang **pasti menghasilkan error fatal runtime** jika dieksekusi di dalam lingkungan server Node.js murni?
- A. `const port = process.env.PORT || 3000;`
- B. `const data = JSON.parse('{"status": "ok"}');`
- C. `const width = window.innerWidth;`
- D. `console.log("Server berjalan di port:", port);`

> **Kunci Jawaban: C**  
> **Pembahasan**: Objek `window` dan `document` adalah bagian dari Web APIs yang hanya disediakan oleh lingkungan browser. Di Node.js, pemanggilan `window.innerWidth` akan melempar *exception* `ReferenceError: window is not defined`.

---

#### Soal 3
Seorang pengembang melihat error berikut pada tab Console di browsernya:
`Access to fetch at 'https://api.kampus.ac.id/nilai' from origin 'http://localhost:3000' has been blocked by CORS policy.`
Pernyataan manakah yang paling akurat menggambarkan apa yang terjadi?
- A. Server `api.kampus.ac.id` dalam keadaan mati (*down*) dan mengembalikan status code 500.
- B. Komputer pengembang tidak memiliki koneksi internet yang stabil ke server kampus.
- C. Browser memblokir kode JavaScript klien untuk membaca respons karena server tujuan tidak menyertakan header izin `Access-Control-Allow-Origin` yang mencakup domain pemanggil.
- D. Port 3000 pada komputer pengembang telah diretas oleh pihak luar.

> **Kunci Jawaban: C**  
> **Pembahasan**: CORS adalah mekanisme keamanan berbasis browser (*Same-Origin Policy*). Server sebenarnya menerima request dan mungkin telah membalas, tetapi browser menolak menyerahkan data respons ke script JavaScript karena domain pemanggil (`localhost:3000`) tidak terdaftar di header izin server.

---

#### Soal 4
Ketika pengguna berhasil mengirimkan formulir pendaftaran mahasiswa baru dan data berhasil disimpan ke basis data, status code HTTP manakah yang paling tepat dan baku untuk dikembalikan oleh server?
- A. `200 OK`
- B. `201 Created`
- C. `204 No Content`
- D. `304 Not Modified`

> **Kunci Jawaban: B**  
> **Pembahasan**: Walaupun `200 OK` sering digunakan, standar HTTP yang paling presisi untuk operasi penambahan sumber daya baru yang berhasil dibuat adalah `201 Created`.

---

#### Soal 5
Manakah praktik berikut yang merupakan **kesalahan fatal arsitektur keamanan** dalam pengembangan web modern?
- A. Menyimpan token JWT jangka pendek di dalam *memory state* aplikasi klien.
- B. Menggunakan metode HTTP `POST` untuk proses autentikasi masuk (*login*).
- C. Menempatkan kunci rahasia koneksi basis data (*database connection string*) di dalam variabel lingkungan berawalan `NEXT_PUBLIC_`.
- D. Mengirimkan cookie sesi dengan flag `HttpOnly` dan `Secure`.

> **Kunci Jawaban: C**  
> **Pembahasan**: Di Next.js, setiap variabel lingkungan yang diawali dengan `NEXT_PUBLIC_` akan dikompilasi langsung ke dalam file JavaScript publik yang dikirim ke browser. Menaruh kredensial basis data di sana sama saja dengan membagikan password database ke seluruh dunia.

---

### Soal Analisis & Praktik

#### Soal 6
Jelaskan mengapa metode HTTP `GET` tidak boleh digunakan untuk aksi mutasi data seperti mengubah password atau menghapus artikel blog, ditinjau dari karakteristik protokol HTTP dan perilaku browser!

> **Pembahasan Soal 6**:  
> Menurut spesifikasi RFC HTTP, metode `GET` bersifat *safe* dan *idempotent*. Artinya, pemanggilan `GET` hanya bertujuan untuk mengambil data tanpa menimbulkan efek samping (*side effects*) pada kondisi data di server.  
> Jika `GET` dipakai untuk mengubah/menghapus data:
> 1. Browser, CDN, dan proxy jaringan secara agresif melakukan *caching* dan *prefetching* pada request `GET`. Browser modern sering kali memuat tautan di latar belakang sebelum diklik, yang dapat memicu penghapusan data secara tidak sengaja.
> 2. Riwayat penelusuran (*browser history*) dan log server mencatat URL lengkap dari request `GET` beserta parameter query-nya, sehingga data sensitif (seperti password baru) bisa terekspos secara terang-terangan di file log atau riwayat browser.

---

#### Soal 7
Dalam arsitektur React Server Components (RSC) modern di Next.js, jelaskan apa yang dimaksud dengan proses *hydration* dan masalah apa yang terjadi jika ada ketidaksesuaian (*mismatch*) antara HTML yang dihasilkan server dan render awal di browser!

> **Pembahasan Soal 7**:  
> *Hydration* adalah proses di mana browser mengambil file JavaScript yang telah diunduh, menginisialisasi state aplikasi React, dan menempelkan *event listener* (seperti `onClick`, `onChange`) ke elemen HTML statis yang sebelumnya sudah dikirimkan oleh server.  
> Jika terjadi ketidaksesuaian (*hydration mismatch*)—misalnya server merender teks menggunakan jam server UTC sedangkan browser merender jam lokal pengguna—React akan mendeteksi perbedaan pohon DOM. Akibatnya, React terpaksa membuang elemen HTML dari server dan merender ulang dari awal (*de-opt*), yang memicu kedipan tampilan (*flicker*), penurunan skor performa *Cumulative Layout Shift* (CLS), dan berpotensi menyebabkan bug event handler yang tidak merespons klik pengguna.

---

## 9. Referensi & Sumber Belajar Lanjutan

Untuk memperdalam konsep arsitektur yang dibahas pada modul ini, sangat disarankan untuk membaca sumber-sumber resmi berikut:

1. **MDN Web Docs — An overview of HTTP**:  
   [https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)  
   *Panduan definitif mengenai struktur protokol HTTP, status code, dan mekanisme request-response.*
2. **Next.js Official Documentation — Rendering & Server Components**:  
   [https://nextjs.org/docs/app/building-your-application/rendering](https://nextjs.org/docs/app/building-your-application/rendering)  
   *Dokumentasi resmi arsitektur App Router Next.js 15 dan pemisahan Server vs Client Component.*
3. **Web.dev by Google — Understanding the Critical Rendering Path**:  
   [https://web.dev/learn/performance/welcome](https://web.dev/learn/performance/welcome)  
   *Panduan komprehensif tentang bagaimana browser mengurai HTML/CSS/JS hingga menjadi piksel di layar.*
4. **IETF RFC 9110 — HTTP Semantics (Spesifikasi Standar Global)**:  
   [https://www.rfc-editor.org/rfc/rfc9110.html](https://www.rfc-editor.org/rfc/rfc9110.html)  
   *Dokumen standar resmi internet tentang definisi method, idempotency, dan status code.*
