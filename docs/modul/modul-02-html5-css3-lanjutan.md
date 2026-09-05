# Modul 02: HTML5 Semantik & Arsitektur Layout Modern (Flexbox & CSS Grid)

---

## 1. Overview & Pengantar

Setelah di Modul 01 kita memahami bagaimana dokumen web dikirim dari server ke browser melalui pipa protokol HTTP, sekarang pertanyaan berikutnya: **apa yang sebenarnya browser lakukan begitu teks HTML itu tiba?**

Banyak mahasiswa yang terburu-buru ingin langsung belajar framework seperti React atau menginstal library CSS seperti Tailwind, tetapi ketika disuruh membuat antarmuka sederhana, kodenya mengidap penyakit kronis yang di industri kami sebut **"Div Soup"**—semua elemen dibungkus tag `<div>`, tombol dibuat dari `<div onClick={...}>`, dan teks judul dibuat dari `<div style={{ fontWeight: 'bold' }}>`.

Kelihatannya sepele dan tampilan di layar sekilas tampak sama saja. Namun di dunia nyata, kode seperti itu adalah mimpi buruk:
1. **Mesin pencari (Googlebot)** tidak mengerti mana konten inti dan mana sekadar navigasi, sehingga peringkat SEO anjlok.
2. **Pengguna tunanetra** yang mengandalkan *screen reader* tidak bisa menavigasi situs kalian sama sekali.
3. Struktur DOM (*Document Object Model*) menjadi terlalu dalam, memicu *performance lag* saat browser menghitung ulang posisi elemen (*reflow*).

Di modul kedua ini, kita akan meluruskan kembali fondasi tersebut. Kita akan membedah standar **HTML5 Semantik**, prinsip **Aksesibilitas Web (a11y)**, serta dua mesin tata letak modern terpenting di CSS: **Flexbox** (sistem aliran 1 dimensi) dan **CSS Grid** (sistem koordinat 2 dimensi).

Kuasai modul ini, dan kalian tidak akan pernah lagi merasa frustrasi hanya gara-gara ingin menaruh kotak tepat di tengah layar (*centering a div*).

---

## 2. Tujuan Pembelajaran

Setelah mempelajari modul ini dan menyelesaikan seluruh tugas praktiknya, kalian diharapkan mampu:

1. **Merancang** dokumen web berbasis **HTML5 Semantik** yang memenuhi standar aksesibilitas internasional (WCAG 2.2 AA) dan optimal untuk SEO.
2. **Mendiagnosis dan memperbaiki** struktur kode yang tidak aksesibel (seperti tombol non-semantik, form tanpa label, dan hierarki heading yang acak-acakan).
3. **Menerapkan** sistem koordinat **Flexbox** untuk mengatur alur komponen 1-dimensi (navigasi, toolbar, form inline) dengan presisi perhitungan `flex-grow`, `flex-shrink`, dan `flex-basis`.
4. **Membangun** tata letak halaman 2-dimensi kompleks menggunakan **CSS Grid** dan unit pecahan `fr`, serta teknik responsif mandiri (*media-query-less responsive grid*) menggunakan `minmax()` dan `auto-fit`.
5. **Menilai** kapan waktu yang tepat menggunakan Flexbox versus CSS Grid dalam skenario arsitektur antarmuka riil.

---

## 3. Prasyarat Pengetahuan & Perangkat

- **Prasyarat Pengetahuan**:
  - Telah menyelesaikan **Modul 01: Pengantar Pengembangan Web Modern**.
  - Mengerti sintaks dasar CSS (selector kelas `.nama-class`, selector elemen `p`, selector ID `#id`, dan model pewarisan properti dasar).
- **Perangkat Lunak**:
  - Web Browser modern dengan DevTools (Chrome / Edge / Firefox).
  - Text Editor (VS Code direkomendasikan, dilengkapi ekstensi *Live Server* atau terintegrasi dengan lingkungan lokal).

---

## 4. Konten Pembelajaran Utama

### 4.1 HTML5 Semantik: Makna di Atas Sekadar Tampilan

Dalam rekayasa web, tag HTML diciptakan untuk membawa **arti semantik (*semantic meaning*)**, bukan instruksi visual. Tampilan visual adalah ranah mutlak CSS.

```
       [STRUKTUR SEMANTIK MODERN]
+---------------------------------------+
|              <header>                 |  <- Identitas situs & navigasi global
|  <nav> [Beranda] [Materi] [Tugas] </nav> |
+---------------------------------------+
|              <main>                   |  <- Konten unik utama halaman
|  <article>                            |
|    <h1>Judul Artikel Utama</h1>       |
|    <section> ... </section>           |  <- Bagian logis bertopik
|    <section> ... </section>           |
|  </article>                           |
|                                       |
|  <aside> ... </aside>                 |  <- Konten pelengkap / sidebar
+---------------------------------------+
|              <footer>                 |  <- Hak cipta, kontak, legalitas
+---------------------------------------+
```

Mari kita teliti elemen-elemen kunci ini:

1. `<header>`: Mewakili pengantar atau kelompok navigasi untuk dokumen atau sebuah artikel.
2. `<nav>`: Dikhususkan hanya untuk blok tautan navigasi utama. Jangan bungkus setiap tautan dengan `<nav>`.
3. `<main>`: Berisi konten unik halaman tersebut. Di satu dokumen HTML, **hanya boleh ada satu elemen `<main>`**. Elemen yang berulang di semua halaman (seperti header global atau footer) tidak boleh diletakkan di dalam `<main>`.
4. `<article>`: Komposisi mandiri yang dapat didistribusikan atau digunakan kembali secara independen (misalnya sebuah postingan blog, thread forum, atau modul kuliah).
5. `<section>`: Bagian tematik generik dari dokumen. Biasanya memiliki heading sendiri (`<h2>`–`<h6>`).
6. `<aside>`: Konten yang berkaitan secara tidak langsung dengan konten utama di sekitarnya (misalnya sidebar glosarium, daftar artikel terkait, atau panel profil pengajar).
7. `<footer>`: Catatan kaki penutup yang memuat informasi hak cipta, tautan kebijakan privasi, atau informasi kontak.

#### Dosa Terbesar: Mengganti `<button>` dengan `<div onClick>`

Perhatikan perbandingan krusial berikut:

```html
<!-- ❌ KODE RUSAK (BURUK UNTUK INDUSTRI): -->
<div class="tombol-kirim" onclick="submitTugas()">
  Kirim Tugas
</div>

<!-- ✅ KODE STANDAR PROFESIONAL: -->
<button type="button" class="tombol-kirim" onclick="submitTugas()">
  Kirim Tugas
</button>
```

Mengapa kode pertama sangat berbahaya?
- **Fokus Keyboard**: Elemen `<button>` secara bawaan (*native*) bisa difokuskan menggunakan tombol `Tab` di keyboard, dan bisa diaktifkan menggunakan tombol `Enter` atau `Spasi`. Elemen `<div>` tidak bisa difokuskan kecuali kalian secara manual menambahkan `tabindex="0"`, `role="button"`, dan *event listener* `keydown` untuk tombol Enter dan Spasi. Kenapa harus menulis 20 baris kode JavaScript tambahan hanya untuk meniru perilaku yang sudah disediakan gratis oleh `<button>`?
- **Screen Reader**: Pengguna tunanetra yang memakai pembaca layar akan mendengar elemen kedua sebagai: *"Kirim Tugas, tombol"*. Sedangkan elemen pertama hanya akan dibacakan sebagai teks bisu, membuat mereka tidak tahu bahwa teks itu bisa diklik!

---

### 4.2 Fondasi CSS Box Model yang Benar

Sebelum mengatur posisi elemen, pahami bahwa setiap elemen di web diperlakukan oleh browser sebagai kotak (*box*). Kotak ini terdiri dari empat lapisan:

```
+-----------------------------------------------+
|                    MARGIN                     | (Ruang luar antar elemen)
|   +---------------------------------------+   |
|   |                BORDER                 |   | (Garis tepi kotak)
|   |   +-------------------------------+   |   |
|   |   |            PADDING            |   |   | (Ruang dalam antara border & konten)
|   |   |   +-----------------------+   |   |   |
|   |   |   |        CONTENT        |   |   |   | (Teks, gambar, elemen anak)
|   |   |   +-----------------------+   |   |   |
|   |   +-------------------------------+   |   |
|   +---------------------------------------+   |
+-----------------------------------------------+
```

Secara default historis di CSS, `box-sizing` bernilai `content-box`. Artinya jika kalian menyetel `width: 300px; padding: 20px; border: 5px solid black;`, maka lebar total elemen di layar menjadi:
$$300 + 20 + 20 + 5 + 5 = 350\text{px}$$
Ini sangat tidak intuitif dan sering memicu *horizontal scrollbar overflow* yang tidak diinginkan.

**Aturan Standar Reset Modern**: Selalu letakkan aturan ini di baris paling atas stylesheet CSS kalian:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

Dengan `border-box`, jika kalian meminta `width: 300px`, maka total lebar kotak akan **tetap 300px**. Padding dan border akan dihitung ke dalam, bukan menambah ukuran ke luar.

---

### 4.3 Menguasai Flexbox: Sistem Aliran Satu Dimensi

Flexbox (*Flexible Box Layout*) dirancang untuk mendistribusikan ruang di sepanjang **satu dimensi pada satu waktu** (bisa secara horizontal berupa baris, atau secara vertikal berupa kolom).

Ketika kalian menulis `display: flex;` pada sebuah container, container tersebut menjadi **Flex Container**, dan elemen anak langsung di dalamnya menjadi **Flex Items**.

```
              MAIN AXIS (flex-direction: row)
           ------------------------------------->
      +-----------------------------------------------+
      |  [ Item 1 ]    [ Item 2 ]       [ Item 3 ]    |
CROSS |                                               |
 AXIS |                                               |
  |   +-----------------------------------------------+
  v
```

#### Sumbu Koordinat Flexbox
- **Main Axis (Sumbu Utama)**: Arah aliran utama item. Dikendalikan oleh `flex-direction`:
  - `row` (default): Kiri ke kanan (horizontal).
  - `column`: Atas ke bawah (vertikal).
- **Cross Axis (Sumbu Silang)**: Sumbu yang tegak lurus dengan sumbu utama.

#### Properti Pengatur pada Container:
1. `justify-content`: Mengatur perataan item di sepanjang **Main Axis**.
   - `flex-start` (awal), `flex-end` (akhir), `center` (tengah).
   - `space-between`: Item pertama menempel di awal, item terakhir menempel di akhir, sisa ruang dibagi rata di antaranya (sangat ideal untuk Navbar!).
   - `space-around` & `space-evenly`: Memberikan jarak seimbang di sekitar item.
2. `align-items`: Mengatur perataan item di sepanjang **Cross Axis**.
   - `stretch` (default): Item ditarik memenuhi tinggi/lebar container.
   - `center`: Item berada persis di tengah secara vertikal (jika direction row).
   - `flex-start` / `flex-end`.
3. `gap`: Memberi jarak antar-item tanpa perlu trik `margin-right` yang merepotkan. Contoh: `gap: 1rem;`.

#### Solusi Masalah Abadi Web: Menaruh Elemen di Tengah Layar
Di era CSS jadul, menaruh kotak persis di tengah layar membutuhkan 10 baris kode hacky. Di Flexbox, cukup 3 baris:

```css
.layar-penuh-tengah {
  display: flex;
  justify-content: center; /* Tengah horizontal */
  align-items: center;     /* Tengah vertikal */
  min-height: 100vh;
}
```

#### Rumus Ajaib Flex Item: `flex: grow shrink basis`
Perhatikan properti `flex` pada elemen anak:

```css
.kartu-konten {
  flex: 1 1 300px;
}
```
Artinya:
- **`flex-grow: 1`**: Item boleh membesar (*grow*) menyerap sisa ruang kosong jika layar lebar.
- **`flex-shrink: 1`**: Item boleh menyusut (*shrink*) jika ruang layar menyempit agar tidak jebol.
- **`flex-basis: 300px`**: Ukuran ideal awal item sebelum ruang sisa dibagi.

---

### 4.4 Menguasai CSS Grid: Sistem Koordinat Dua Dimensi

Jika Flexbox adalah penguasa alur satu dimensi, maka **CSS Grid** adalah raja tata letak **dua dimensi**. Grid memungkinkan kita mengatur baris (*rows*) dan kolom (*columns*) secara bersamaan.

```
       KOLOM 1 (1fr)       KOLOM 2 (2fr)       KOLOM 3 (1fr)
     +-------------------+-------------------+-------------------+
BARIS|                   |                   |                   |
 1   |      Header       |      Header       |      Header       |
     +-------------------+-------------------+-------------------+
BARIS|                   |                   |                   |
 2   |      Sidebar      |   Main Content    |   Widget Panel    |
     +-------------------+-------------------+-------------------+
```

#### Unit Sakti CSS Grid: `fr` (Fractional Unit)
Unit `fr` mewakili pecahan dari sisa ruang yang tersedia di dalam container.
```css
.layout-tiga-kolom {
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  gap: 1.5rem;
}
```
Kode di atas berarti: Kolom pertama lebarnya paten 200px (sidebar kiri), kolom ketiga paten 300px (panel kanan), dan kolom tengah (`1fr`) akan secara fleksibel mengambil **seluruh sisa ruang yang ada**.

#### Tata Letak Kartu Responsif Tanpa Media Query
Di industri, trik ini sering menyelamatkan puluhan baris kode media query:

```css
.grid-kartu-materi {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

**Bagaimana cara kerjanya?**
1. `repeat(...)`: Mengulang pembuatan kolom.
2. `auto-fit`: Hitung otomatis berapa banyak kolom yang muat di lebar layar saat ini. Jika layar selebar 1200px, buat 4 kolom. Jika layar mengecil ke ponsel 360px, otomatis turun menjadi 1 kolom saja!
3. `minmax(280px, 1fr)`: Setiap kolom minimal berukuran **280px**, tetapi jika ada sisa ruang, boleh membesar hingga **1fr**.

#### Tata Letak Halaman Penuh dengan `grid-template-areas`
CSS Grid memungkinkan kalian "menggambar" denah antarmuka secara visual menggunakan string:

```css
.dashboard-shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 64px 1fr 48px;
  grid-template-areas:
    "nav   topbar"
    "nav   main"
    "nav   footer";
  min-height: 100vh;
}

.sidebar { grid-area: nav; }
.top-bar { grid-area: topbar; }
.konten  { grid-area: main; }
.footer  { grid-area: footer; }
```
Bandingkan dengan metode lama yang membutuhkan pembungkus `<div>` bertingkat-tingkat. Dengan `grid-template-areas`, struktur kode CSS kalian terbaca seperti denah arsitektur rumah yang rapi.

---

### 4.5 Kapan Memilih Flexbox vs CSS Grid?

Sebagai praktisi senior, ini panduan keputusan (*decision matrix*) yang selalu saya terapkan di proyek produksi:

| Karakteristik Skenario | Pilihan Terbaik | Alasan Teknis |
| :--- | :--- | :--- |
| **Bilah Navigasi / Header** (Logo di kiri, link di kanan) | **Flexbox** | Alur 1 dimensi, mengandalkan `justify-content: space-between`. |
| **Grid Galeri Kartu / Daftar Modul** | **CSS Grid** | Menuntut keteraturan 2 dimensi yang simetris antar baris dan kolom. |
| **Formulir Input Sejajar** (Input teks + Tombol Submit) | **Flexbox** | Alur linear 1 baris di mana tombol berukuran tetap dan input menyerap sisa ruang (`flex: 1`). |
| **Struktur Rangka Dashboard Lengkap** (Sidebar, Header, Main, Footer) | **CSS Grid** | Tata letak makro 2 dimensi yang membutuhkan koordinasi baris dan kolom secara menyeluruh. |
| **Item di dalam Kartu** (Icon + Teks judul sejajar) | **Flexbox** | Komposisi mikro berskala kecil dengan penjajaran vertikal (`align-items: center`). |

---

### 4.6 Catatan dari Lapangan: Jebakan Desain Web Nyata

#### 1. Perangkap Ukuran Font `px` vs `rem`
Masih banyak pengembang yang menulis ukuran font dengan satuan piksel kaku: `font-size: 16px;`.
Di browser pengguna, terdapat setelan aksesibilitas font size default (misalnya lansia yang menyetel font bawaan OS-nya ke *Large/Very Large*).
Jika kalian menggunakan `px`, browser akan **mengabaikan setelan pengguna tersebut** secara paksa.
**Aturan Emas**: Gunakan selalu satuan `rem` untuk tipografi dan *spacing* umum (`1rem = 16px` pada setelan default). Dengan begitu, ukuran teks di website kalian akan menghargai preferensi pembesaran sistem operasi pengguna.

#### 2. Ketinggian Kaku `height: 100vh` di Browser Ponsel
Saat kalian menulis `height: 100vh;`, browser Chrome dan Safari di Android/iOS memiliki bilah alamat (*address bar*) dinamis yang muncul dan tenggelam saat di-scroll. Akibatnya, `100vh` akan terpotong oleh bilah alamat browser ponsel, dan tombol di bagian paling bawah halaman tidak bisa diklik!
**Solusi Modern**: Gunakan unit viewport terbaru:
`min-height: 100dvh;` (*Dynamic Viewport Height*), atau sediakan fallback `min-height: 100vh;`.

#### 3. Over-Engineering Media Queries
Junior developer sering menulis lusinan media query: `@media (max-width: 1200px)`, `@media (max-width: 992px)`, `@media (max-width: 768px)`, `@media (max-width: 480px)`... hanya untuk mengubah ukuran kartu.
Gunakan kekuatan fluid typography (`clamp()`) dan CSS Grid `auto-fit/minmax()`. Sembilan puluh persen perubahan tata letak kartu kartu bisa diselesaikan secara otomatis tanpa satu baris pun media query!

---

## 5. Latihan & Tugas Praktik

### Latihan 1: Refactoring "Div Soup" Menjadi HTML5 Semantik (Tingkat Dasar)

Diberikan potongan kode HTML peninggalan pengembang lama yang berantakan berikut:

```html
<!-- index-rusak.html -->
<div id="top-bar">
  <div class="logo">Velqora Learn</div>
  <div class="menu">
    <div class="item" onclick="location.href='/materi'">Materi</div>
    <div class="item" onclick="location.href='/tugas'">Tugas</div>
  </div>
</div>
<div id="wrapper">
  <div class="post">
    <div class="heading">Mengenal Flexbox di CSS</div>
    <div class="date">Dipublikasikan: 5 September 2026</div>
    <div class="body">Flexbox sangat mudah digunakan jika paham sumbunya...</div>
  </div>
</div>
<div id="bawah">
  <div class="copy">&copy; 2026 Velqora Group</div>
</div>
```

**Tugas Kalian**:
1. Tulis ulang kode di atas menjadi dokumen HTML5 yang valid dan semantik menggunakan elemen: `<header>`, `<nav>`, `<main>`, `<article>`, `<time>`, `<footer>`, dan `<button>` atau `<a>` yang tepat.
2. Tambahkan atribut `datetime` yang valid pada elemen tanggal.
3. Buka file hasil refactoring di browser, lalu buka **Chrome DevTools -> Accessibility Tab (di panel Elements)**. Amati bagaimana pohon aksesibilitas (*Accessibility Tree*) sekarang mengenali landmark halaman dengan benar.

---

### Latihan 2: Membangun Responsive Dashboard Shell Modern (Tingkat Lanjutan)

Kalian diminta membangun kerangka (*layout shell*) untuk dashboard portal kuliah Velqora dengan spesifikasi:

**Spesifikasi Tata Letak**:
1. **Layar Desktop (> 1024px)**:
   - Sidebar navigasi tetap di kiri dengan lebar tetap `240px`.
   - Header atas di kanan dengan tinggi `60px`, berisi judul halaman di kiri dan tombol profil di kanan (gunakan Flexbox `justify-content: space-between`).
   - Konten utama berupa grid kartu tugas yang otomatis menyesuaikan kolomnya (minimal lebar kartu `260px`, gunakan CSS Grid `auto-fit`).
2. **Layar Mobile (< 768px)**:
   - Sidebar navigasi otomatis bergeser atau bersembunyi (atau berpindah ke bawah/drawer).
   - Header tetap berada di bagian paling atas.
   - Grid kartu tugas otomatis tersusun menjadi satu kolom vertikal yang rapi.
3. **Ketentuan Kode**:
   - Terapkan `box-sizing: border-box` reset.
   - Gunakan kombinasi **CSS Grid** untuk rangka luar halaman dan **Flexbox** untuk komponen internal header dan isi kartu.
   - Dilarang menggunakan framework CSS (hanya HTML murni dan CSS murni).

---

## 6. Studi Kasus Nyata

### Kasus: "Gugatan Aksesibilitas dan Jebloknya Skor SEO Platform Kursus Online"

#### Latar Belakang Masalah
Pada tahun 2024, sebuah platform edukasi daring ternama di kawasan Asia Tenggara menghadapi gugatan perdata dari asosiasi penyandang disabilitas karena situs web mereka sepenuhnya tidak dapat diakses oleh tunanetra yang menggunakan pembaca layar (*screen reader*).
Pada saat yang bersamaan, skor Core Web Vitals mereka jeblok ke zona merah:
- Skor **Lighthouse Accessibility** hanya mencapai **38/100**.
- Skor SEO anjlok drastis setelah pembaruan algoritma Google Helpful Content, menyebabkan trafik organik turun sebesar 42% dalam satu kuartal.

#### Temuan Audit Teknis Tim Ahli
Setelah kode sumber diaudit oleh tim spesialis arsitektur web:
1. **Peniadaan Heading Hierarchy**: Seluruh teks judul halaman menggunakan tag `<p style="font-size: 24px; font-weight: bold;">` demi mempermudah styling visual, tanpa satu pun tag `<h1>`, `<h2>`, atau `<h3>`. Robot perayap mesin pencari tidak dapat menentukan topik utama dari materi yang disajikan.
2. **Tombol dan Formulir Semu**:
   Formulir pembayaran langganan dibuat menggunakan tag `<div>` berkostum CSS. Elemen input tidak memiliki label terkait (`<label for="...">`). Ketika pengguna tunanetra menggunakan tombol `Tab`, fokus keyboard melompati formulir tersebut begitu saja, sehingga mereka tidak bisa mendaftar.
3. **Perang Tanding Z-Index dan Layout Pecah**:
   Developer menggunakan puluhan trik `position: absolute` dan kalkulasi margin manual negatif untuk memosisikan kartu materi, yang langsung bertumpuk (*overlapping*) dan berantakan ketika dibuka di layar iPad atau monitor ultrawide.

#### Solusi Transformasi & Hasil
Tim melakukan perombakan arsitektur front-end selama 6 minggu:
1. **Migrasi Penuh ke HTML5 Semantik**:
   - Seluruh halaman diatur ulang dengan struktur tunggal `<h1>` untuk judul materi, diikuti hierarki `<h2>` dan `<h3>` yang disiplin.
   - Setiap formulir dilengkapi `<label>` berpasangan eksplisit dengan atribut `for="id-input"`.
   - Seluruh elemen interaktif dikembalikan ke elemen `<button>` native dan tautan `<a>`.
2. **Refactoring Layout Menggunakan CSS Grid & Flexbox Modern**:
   - Menghapus 800 baris kode styling manual usang berbasis `float` dan `position: absolute`.
   - Menerapkan CSS Grid `minmax` fluid untuk katalog modul kursus.
3. **Hasil Terukur**:
   - Skor Aksesibilitas Lighthouse melesat ke angka **98/100**.
   - Beban rendering browser turun 35% karena kedalaman pohon DOM berkurang dari 28 level menjadi rata-rata 8 level.
   - Gugatan hukum diselesaikan secara damai, dan trafik organik Google pulih kembali dalam 60 hari berkat penandaan semantik yang terbaca jelas oleh mesin pencari.

---

## 7. Rangkuman Reflektif

Di awal perjalanan belajar web, menulis kode semantik terasa lambat dan merepotkan dibandingkan sekadar mengetik tag `<div>` untuk segalanya. Tapi ingat perkataan ini: **rekayasa perangkat lunak adalah tentang membangun sistem yang tangguh (*resilient*), inklusif, dan mudah dirawat.**

Tag semantik adalah cara kalian berbicara kepada mesin pencari, perangkat aksesibilitas, dan rekan satu tim kalian di masa depan. Sedangkan Flexbox dan CSS Grid adalah alat matematika yang kalian gunakan untuk menjinakkan keberagaman ukuran layar perangkat di seluruh dunia.

Di modul berikutnya (**Modul 03**), kita akan meninggalkan sejenak berkas markup dan beralih ke otak penggerak aplikasi web modern: **JavaScript Modern (ES6+) dan Fondasi Asinkron**. Kita akan membedah fitur-fitur bahasa yang mutlak harus kalian kuasai sebelum menyentuh framework React apa pun.

---

## 8. Evaluasi & Kuis Pemahaman

### Pilihan Ganda

#### Soal 1
Perhatikan potongan kode HTML berikut:
```html
<nav>
  <div class="nav-item" onclick="goToHome()">Beranda</div>
</nav>
```
Masalah aksesibilitas paling mendasar dari kode di atas adalah:
- A. Elemen `<nav>` tidak boleh berisi elemen dengan atribut `class`.
- B. Fungsi JavaScript `goToHome()` tidak akan bisa dijalankan di browser mobile.
- C. Elemen `div` tidak memiliki status semantik interaktif secara native sehingga tidak dapat difokuskan atau diaktifkan melalui navigasi keyboard (tombol Tab dan Enter).
- D. Elemen `div` secara otomatis memblokir perayapan Googlebot.

> **Kunci Jawaban: C**  
> **Pembahasan**: Elemen `<div>` secara default tidak memiliki semantik interaktif, tidak masuk dalam urutan fokus tombol Tab (*tab sequence*), dan tidak merespons event keyboard `Enter`/`Space`. Seharusnya digunakan elemen tautan `<a href="...">` atau `<button type="button">`.

---

#### Soal 2
Di dalam aturan CSS berikut:
```css
.kontainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
```
Properti manakah yang bertanggung jawab mengatur perataan elemen di sepanjang **sumbu vertikal** (Cross Axis)?
- A. `display: flex`
- B. `flex-direction: row`
- C. `justify-content: space-between`
- D. `align-items: center`

> **Kunci Jawaban: D**  
> **Pembahasan**: Ketika `flex-direction` bernilai `row`, sumbu utama (Main Axis) adalah horizontal (kiri-kanan), dan sumbu silang (Cross Axis) adalah vertikal (atas-bawah). Properti `align-items` mengatur posisi item pada Cross Axis, sehingga `align-items: center` meratakan elemen di tengah secara vertikal.

---

#### Soal 3
Kalian memiliki container CSS Grid dengan deklarasi berikut:
```css
.katalog {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```
Jika container tersebut saat ini dirender di layar dengan lebar bersih **600px**, berapa banyak kolom yang akan dibuat oleh browser dan berapa perkiraan lebar masing-masing kolom?
- A. 1 kolom selebar 600px.
- B. 2 kolom, masing-masing selebar sekitar 290px (setelah dikurangi gap 20px).
- C. 3 kolom, masing-masing selebar 200px.
- D. Kolom akan error dan layout tidak ditampilkan.

> **Kunci Jawaban: B**  
> **Pembahasan**: Minimal lebar 1 kolom adalah 250px. Jika ada 2 kolom, kebutuhan minimumnya adalah $(250 \times 2) + 20\text{px (gap)} = 520\text{px}$. Karena 520px muat di dalam 600px, tetapi 3 kolom membutuhkan minimal $(250 \times 3) + 40\text{px} = 790\text{px}$ (tidak muat), maka browser membuat **2 kolom**. Sisa ruang $(600 - 20) / 2 = 290\text{px}$ per kolom (diwakili oleh unit `1fr`).

---

#### Soal 4
Mengapa para insinyur web modern sangat menyarankan untuk menyetel `box-sizing: border-box;` secara global pada stylesheet?
- A. Agar border elemen berubah warna menjadi transparan secara otomatis.
- B. Agar perhitungan nilai `padding` dan `border` disertakan ke dalam lebar (`width`) total elemen, sehingga tidak menyebabkan elemen meluap (*overflow*) di luar ukuran yang ditentukan.
- C. Untuk meningkatkan kecepatan kompilasi server Node.js.
- D. Agar semua elemen HTML otomatis menjadi Flexbox container.

> **Kunci Jawaban: B**  
> **Pembahasan**: Pada model bawaan `content-box`, padding dan border ditambahkan di luar width elemen, sehingga mudah memicu overflow. Pada `border-box`, padding dan border diperhitungkan di dalam width total.

---

#### Soal 5
Manakah dari elemen HTML5 berikut yang merupakan elemen penampung konten independen yang secara semantik bermakna dan layak didistribusikan ulang secara mandiri (misalnya artikel berita atau postingan blog)?
- A. `<section>`
- B. `<div>`
- C. `<article>`
- D. `<aside>`

> **Kunci Jawaban: C**  
> **Pembahasan**: Elemen `<article>` dirancang khusus oleh spesifikasi W3C untuk merepresentasikan bagian mandiri dalam sebuah dokumen yang masuk akal jika dibagikan atau dibaca secara independen (misalnya posting blog, kartu produk mandiri, atau thread forum).

---

### Soal Analisis & Kasus

#### Soal 6
Seorang junior developer membuat tampilan kartu artikel dengan Flexbox:
```css
.kartu-container {
  display: flex;
  flex-direction: row;
  width: 1000px;
}
.sidebar-kiri {
  flex-basis: 300px;
  flex-grow: 0;
  flex-shrink: 0;
}
.konten-kanan {
  flex-basis: 500px;
  flex-grow: 2;
  flex-shrink: 1;
}
```
Hitung berapa lebar akhir dari `.sidebar-kiri` dan `.konten-kanan` pada layar selebar 1000px tersebut, dan jelaskan mekanismenya!

> **Pembahasan Soal 6**:  
> 1. Lebar dasar total: $\text{basis} = 300\text{px} + 500\text{px} = 800\text{px}$.  
> 2. Total lebar container adalah $1000\text{px}$, sehingga terdapat **sisa ruang kosong** sebesar $1000 - 800 = 200\text{px}$.  
> 3. Periksa nilai `flex-grow`:  
>    - `.sidebar-kiri` memiliki `flex-grow: 0`, artinya elemen ini **tidak berhak** menyerap sisa ruang kosong. Lebarnya tetap persis **300px**.  
>    - `.konten-kanan` memiliki `flex-grow: 2`, dan merupakan satu-satunya elemen yang mau membesar. Seluruh sisa ruang 200px diberikan kepadanya.  
> 4. Lebar akhir:  
>    - `.sidebar-kiri` = **300px**  
>    - `.konten-kanan` = $500\text{px} + 200\text{px} =$ **700px**.

---

#### Soal 7
Jelaskan mengapa penggunaan unit `rem` sangat dianjurkan untuk tipografi antarmuka dibandingkan `px`, dan sebutkan satu skenario di mana penggunaan `px` secara eksplisit melanggar standar aksesibilitas web!

> **Pembahasan Soal 7**:  
> Unit `rem` (*root em*) bersifat relatif terhadap ukuran font root dokumen (`<html>`), yang secara default adalah 16px di hampir semua browser. Jika pengguna mengubah ukuran teks dasar pada setelan browser atau sistem operasi mereka (misalnya pengguna low-vision yang menaikkan ukuran teks dasar ke 24px), seluruh elemen yang memakai `rem` akan **berskala membesar secara proporsional dan harmonis**.  
> Sebaliknya, nilai `px` (*pixel*) adalah unit absolut statis yang memaksa browser merender teks dalam ukuran tetap. Skenario pelanggaran: Ketika pengguna lansia dengan gangguan penglihatan memperbesar font size di setelan OS-nya, website yang ditulis dengan `font-size: 14px;` kaku tidak akan membesar sama sekali. Pengguna terpaksa melakukan pinch-zoom yang merusak tata letak horizontal, dan ini melanggar kriteria sukses WCAG 2.2 Kriteria 1.4.4 (*Resize Text*).

---

## 9. Referensi & Sumber Belajar Lanjutan

Perdalam penguasaan layout dan semantik kalian dengan mempelajari rujukan resmi berikut:

1. **W3C Web Accessibility Initiative (WAI) — ARIA Authoring Practices Guide**:  
   [https://www.w3.org/WAI/ARIA/apg/](https://www.w3.org/WAI/ARIA/apg/)  
   *Panduan standar internasional untuk merancang pola komponen UI yang sepenuhnya aksesibel untuk keyboard dan screen reader.*
2. **MDN Web Docs — CSS Flexible Box Layout**:  
   [https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)  
   *Dokumentasi resmi Mozilla mengenai konsep mekanika alur Flexbox dan perhitungannya.*
3. **MDN Web Docs — CSS Grid Layout**:  
   [https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)  
   *Panduan menyeluruh tentang koordinat grid, unit fr, dan penataan grid-template-areas.*
4. **CSS-Tricks — A Complete Guide to Flexbox & Grid**:  
   [https://css-tricks.com/snippets/css/a-guide-to-flexbox/](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)  
   *Poster visual visualisasi interaktif properti container vs item yang paling populer di kalangan developer profesional.*
