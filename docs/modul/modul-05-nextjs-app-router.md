# Modul 05: Next.js 15 & App Router: Routing, Layout, dan Navigasi

---

## 1. Overview & Pengantar

Kalian sudah memahami bahwa React adalah pustaka (*library*) yang brilian untuk merender antarmuka berbasis state. Namun di dunia nyata, sebuah aplikasi web produksi membutuhkan jauh lebih banyak hal daripada sekadar komponen visual:
- Bagaimana cara pengguna berpindah dari `/dashboard` ke `/dashboard/materi`?
- Bagaimana cara memuat halaman super cepat tanpa mengirim Megabyte JavaScript kosong (*Server-Side Rendering*)?
- Bagaimana memastikan pengguna yang belum login ditendang keluar sebelum halaman sempat ditampilkan (*Middleware*)?
- Bagaimana menyusun layout halaman yang tidak berkedip ulang setiap kali pengguna mengklik menu samping?

Di era React lama, kalian harus merakit sendiri sepuluh pustaka berbeda: `react-router` untuk routing, Webpack untuk bundler, Babel untuk compiler, Express untuk server, dan library lain untuk SSR. Hasilnya sering kali rapuh dan rumit dirawat.

Inilah mengapa industri beralih ke **Next.js**. Dan per tahun 2026 ini, standar mutlak Next.js adalah **App Router** (arsitektur berbasis direktori `app/`). Lupakan tutorial lama berbasis *Pages Router* (`pages/`) yang sudah usang untuk proyek baru. 

Di modul ini, kita akan membedah arsitektur routing berbasis file (*file-system based routing*), hierarki layout bersarang (*nested layouts*), penanganan rute dinamis, serta file-file konvensi khusus Next.js 15 seperti `loading.tsx`, `error.tsx`, dan `not-found.tsx`.

---

## 2. Tujuan Pembelajaran

Setelah menyelesaikan modul ini dan mempraktikkan seluruh latihannya, kalian diharapkan mampu:

1. **Membangun struktur navigasi aplikasi** menggunakan konvensi *File-system Based Routing* di dalam direktori `app/` Next.js 15.
2. **Merancang hierarki antarmuka bertingkat** menggunakan `layout.tsx`, membedakan perilakunya dengan `template.tsx`, serta mengelompokkan rute menggunakan *Route Groups* `(folder)`.
3. **Mengimplementasikan rute dinamis (*Dynamic Routes*)** `[id]` dan *Catch-all routes*, serta menangani pembacaan parameter rute asinkron sesuai standar Next.js 15 (`await params`).
4. **Menerapkan berkas UI konvensi khusus** (`loading.tsx` dengan React Suspense, `error.tsx` dengan Error Boundary, dan `not-found.tsx`).
5. **Mengoptimalkan transisi halaman** menggunakan komponen `<Link>` bawaan Next.js dengan fitur *automatic prefetching* dan hook navigasi programatis (`useRouter`, `usePathname`).

---

## 3. Prasyarat Pengetahuan & Perangkat

- **Prasyarat Pengetahuan**:
  - Telah menyelesaikan **Modul 01 s.d. Modul 04**.
  - Memahami sintaks TypeScript dasar (interface, async/await, typing props).
- **Perangkat Lunak**:
  - Node.js versi LTS (v20.x atau v22.x).
  - Next.js 15 proyek aktif (atau kemampuan menginisialisasi proyek baru dengan `npx create-next-app@latest`).

---

## 4. Konten Pembelajaran Utama

### 4.1 Anatomi File-System Based Routing di App Router

Di Next.js App Router, struktur folder di dalam direktori `app/` secara otomatis memetakan URL publik aplikasi kalian. 

Namun ada aturan emas: **Sebuah folder HANYA menjadi rute publik jika di dalamnya terdapat file bernama `page.tsx` (atau `page.jsx`)!**

```
app/
├── layout.tsx             -> Root Layout (Membungkus seluruh aplikasi)
├── page.tsx               -> Halaman Beranda Utama ("/")
├── tentang/
│   └── page.tsx           -> Halaman Tentang Kami ("/tentang")
└── dashboard/
    ├── page.tsx           -> Halaman Dashboard ("/dashboard")
    └── materi/
        └── page.tsx       -> Halaman Daftar Materi ("/dashboard/materi")
```

Jika kalian membuat folder `app/components/Tombol.tsx`, file tersebut **tidak akan bisa diakses via browser** sebagai URL. Next.js secara aman membedakan antara *route segment* (folder yang berisi `page.tsx`) dan *colocated components* (folder komponen internal pendukung). Ini adalah peningkatan masif dibandingkan Pages Router lama.

---

### 4.2 Nested Layouts & Route Groups: Menghilangkan Kedipan Layar

Salah satu keunggulan terbesar Next.js App Router adalah **Nested Layouts (Tata Letak Bersarang)**.

Sebuah file `layout.tsx` membungkus seluruh halaman anak di bawah foldernya. Yang terpenting: **saat pengguna berpindah halaman di dalam segmen yang sama, `layout.tsx` TIDAK AKAN di-render ulang (*does not re-mount*) dan state internalnya tetap terjaga!**

```
                  +-----------------------------------+
                  |      app/layout.tsx (Root)        |
                  |  [Navbar Global & Footer Global]  |
                  |  +-----------------------------+  |
                  |  | app/dashboard/layout.tsx    |  |
                  |  | [Sidebar & Topbar Kampus]   |  |
                  |  | +-------------------------+ |  |
                  |  | | app/dashboard/page.tsx  | |  |
                  |  | | (Isi Ringkasan Matkul)  | |  |
                  |  | +-------------------------+ |  |
                  |  +-----------------------------+  |
                  +-----------------------------------+
```

#### Struktur Root Layout (`app/layout.tsx`)
Root Layout adalah satu-satunya layout yang wajib memiliki tag `<html>` dan `<body>`:

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velqora Learn — Platform Edukasi Modern",
  description: "Modul pembelajaran interaktif teknik informatika.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
```

#### Dashboard Layout Bersarang (`app/dashboard/layout.tsx`)
Layout ini hanya membungkus halaman-halaman di dalam `/dashboard/*`:

```tsx
// app/dashboard/layout.tsx
import { SidebarDashboard } from "@/components/SidebarDashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar tetap awet dan tidak re-mount saat pindah tab */}
      <SidebarDashboard />
      
      {/* Konten halaman spesifik yang berubah-ubah */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
```

#### Perbedaan `layout.tsx` vs `template.tsx`
- **`layout.tsx`**: State awet, DOM tidak dibuat ulang, animasi transisi halaman tidak terpicu ulang. (Gunakan untuk 95% kebutuhan aplikasi: sidebar, navbar).
- **`template.tsx`**: Membuat instance komponen baru di setiap navigasi halaman anak, state internal di-reset, dan efek `useEffect` dijalankan ulang. (Gunakan jika kalian butuh animasi pergantian halaman via Framer Motion atau perekaman analitik halaman masuk).

#### Route Groups: Mengatur Folder Tanpa Mengubah URL
Kalian dapat membungkus nama folder dengan tanda kurung: `(nama_grup)`. Folder ini akan diabaikan dari struktur path URL!

Contoh Kasus Nyata:
- `app/(auth)/login/page.tsx` -> URL publik: `/login` (tanpa kata auth!)
- `app/(auth)/register/page.tsx` -> URL publik: `/register`
- `app/(dashboard)/kelas/page.tsx` -> URL publik: `/kelas`

Ini memungkinkan kalian membuat layout khusus autentikasi (tampilan tengah tanpa sidebar) di dalam `app/(auth)/layout.tsx`, terpisah total dari `app/(dashboard)/layout.tsx`, tanpa mengotori URL pengguna.

---

### 4.3 Rute Dinamis (*Dynamic Routes*) di Next.js 15

Bagaimana jika kalian memiliki 1.000 modul kuliah? Kalian tentu tidak akan membuat 1.000 folder manual. Kita menggunakan **Dynamic Segment**: folder dengan kurung siku `[nama_param]`.

Contoh struktur:
`app/dashboard/materi/[id]/page.tsx` -> Merespons rute `/dashboard/materi/1`, `/dashboard/materi/algo-2`, dst.

#### ⚠️ PERUBAHAN KRUSIAL DI NEXT.JS 15 (Standard 2026)
Pada Next.js versi lama (Next 13/14), `params` dan `searchParams` diterima langsung sebagai objek sinkron. **Di Next.js 15, `params` dan `searchParams` adalah Promise asinkron yang WAJIB di-`await`!**

```tsx
// app/dashboard/materi/[id]/page.tsx

interface MateriPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; mode?: string }>;
}

export default async function DetailMateriPage({
  params,
  searchParams,
}: MateriPageProps) {
  // ✅ WAJIB DI-AWAIT DI NEXT.JS 15:
  const { id } = await params;
  const { tab = "overview" } = await searchParams;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Materi Kuliah ID: {id}</h1>
      <p className="text-slate-600">Tab Aktif Saat Ini: {tab}</p>
    </div>
  );
}
```

---

### 4.4 File Konvensi Khusus: `loading.tsx`, `error.tsx`, dan `not-found.tsx`

Next.js App Router menyediakan arsitektur penanganan status aplikasi berbasis file konvensi. Kalian tidak perlu lagi menulis logika `if (loading) return <Spinner />` manual di setiap komponen!

```
app/dashboard/
├── layout.tsx
├── page.tsx
├── loading.tsx    -> Ditampilkan instan saat page.tsx sedang mengambil data
├── error.tsx      -> Ditampilkan otomatis jika page.tsx melempar exception
└── not-found.tsx  -> Ditampilkan jika fungsi notFound() dipanggil
```

#### 1. `loading.tsx`: Streaming Instan Berbasis React Suspense
Begitu pengguna mengklik link, Next.js langsung menyajikan file `loading.tsx` dari server dalam hitungan milidetik, sementara data halaman utama sedang di-fetch di latar belakang:

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-md" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-slate-200 rounded-xl" />
        <div className="h-32 bg-slate-200 rounded-xl" />
        <div className="h-32 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}
```

#### 2. `error.tsx`: Tanggap Darurat Crash Halaman (*Error Boundary*)
File ini menangkap galat runtime tanpa merusak bagian aplikasi lainnya (misal: jika data tabel error, sidebar tetap utuh dan bisa diklik!).  
**Aturan Mutlak**: File `error.tsx` **WAJIB** merupakan **Client Component** (`'use client'`).

```tsx
// app/dashboard/error.tsx
"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error ke sistem analitik seperti Sentry
    console.error("[CRITICAL UI ERROR]:", error);
  }, [error]);

  return (
    <div className="p-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-900 space-y-3">
      <h2 className="text-lg font-bold">Terjadi Kesalahan Saat Memuat Dashboard!</h2>
      <p className="text-sm font-mono text-rose-700">{error.message}</p>
      <button
        onClick={() => reset()} // Mencoba render ulang segmen yang rusak
        className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition"
      >
        Coba Muat Ulang
      </button>
    </div>
  );
}
```

#### 3. `not-found.tsx`: Halaman 404 Spesifik Konteks
Kalian bisa memicu halaman ini secara terprogram menggunakan fungsi `notFound()`:

```tsx
// app/dashboard/materi/[id]/page.tsx
import { notFound } from "next/navigation";

export default async function MateriDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const materi = await cariMateriDiDatabase(id);

  if (!materi) {
    notFound(); // Menghentikan eksekusi dan merender not-found.tsx terdekat
  }

  return <h1>{materi.judul}</h1>;
}
```

---

### 4.5 Navigasi Cerdas: `<Link>` vs `useRouter`

Di aplikasi React murni atau web statis, kalian menggunakan tag `<a href="/dashboard">`. **Di Next.js, jangan gunakan tag `<a>` polos untuk navigasi internal!**

#### Mengapa Wajib Menggunakan `next/link`?
Tag `<a>` biasa akan memaksa browser melakukan *Hard Navigation*: membuang seluruh memori JavaScript, mengunduh ulang CSS, memicu layar putih, dan menghancurkan state aplikasi.

Komponen `<Link href="...">` melakukan **Soft Navigation**:
1. Mengubah URL tanpa me-refresh browser.
2. **Automatic Prefetching**: Saat link muncul di layar pandang pengguna (*viewport*), Next.js secara cerdas mengunduh data rute tersebut di latar belakang. Ketika pengguna akhirnya mengklik link, halaman terbuka **instan (0 detik)**!

```tsx
import Link from "next/link";

export function Navigasi() {
  return (
    <nav className="flex gap-4">
      <Link 
        href="/dashboard/materi" 
        className="text-slate-600 hover:text-brand-600 font-medium transition"
      >
        Daftar Materi Kuliah
      </Link>
    </nav>
  );
}
```

#### Navigasi Programatis dengan `useRouter`
Jika kalian perlu berpindah halaman setelah sebuah aksi selesai (misal: setelah berhasil menyimpan data formulir):

```tsx
"use client";

import { useRouter } from "next/navigation"; // ⚠️ Ingat: import dari next/navigation, BUKAN next/router!

export function TombolSelesai() {
  const router = useRouter();

  const handleSelesai = async () => {
    await simpanNilaiMahasiswa();
    router.push("/dashboard/tugas"); // Pindah rute secara programatis
    router.refresh(); // Memvalidasi ulang data server components
  };

  return <button onClick={handleSelesai}>Simpan & Kembali</button>;
}
```

---

### 4.6 Catatan dari Lapangan: Tiga Jebakan Arsitektur Next.js

#### 1. Mengimpor dari `next/router` (Penyakit Migrasi Lama)
Banyak mahasiswa menyalin solusi lama dari Stack Overflow yang mengimpor:
`import { useRouter } from "next/router";`  
Ini akan melempar error fatal: `NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted`.  
**Aturan Baku**: Di App Router, seluruh hook navigasi (`useRouter`, `usePathname`, `useSearchParams`) **WAJIB** diimpor dari **`next/navigation`**.

#### 2. Menjadikan Seluruh Halaman Sebagai Client Component Demi Satu Hook
Banyak pengembang pemula ingin tahu apakah link sedang aktif menggunakan hook `usePathname()`. Karena hook hanya bisa jalan di Client Component, mereka langsung menaruh `'use client'` di baris paling atas `app/dashboard/layout.tsx`.  
**Dampak Buruk**: Seluruh komponen anak di bawahnya kehilangan keuntungan rendering server! Ukuran file JavaScript yang dikirim ke browser membengkak drastis.  
**Solusi Elegan**: Pisahkan hanya tombol navigasinya saja ke file kecil terpisah (misal `NavLink.tsx` dengan `'use client'`), lalu panggil di dalam layout server yang tetap murni.

#### 3. Lupa Bahwa Link Eksternal Tetap Memerlukan `<a>` Biasa
Gunakan `<Link>` hanya untuk rute internal domain kalian sendiri. Jika ingin mengarahkan pengguna ke situs luar (seperti dokumentasi resmi atau GitHub kampus), gunakan tag `<a>` native:
`<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>`.

---

## 5. Latihan & Tugas Praktik

### Latihan 1: Arsitektur Rute Kampus dengan Route Groups (Tingkat Dasar)

Rancang struktur direktori di dalam folder `app/` untuk sebuah sistem kampus dengan hierarki:
1. Rute Publik:
   - `/` (Landing page)
   - `/login` (Tampilan layar penuh terpusat, tanpa sidebar, gunakan route group `(auth)`)
2. Rute Terproteksi Mahasiswa:
   - `/dashboard` (Ringkasan kuliah)
   - `/dashboard/jadwal` (Jadwal kuliah)
3. Ketentuan:
   - Buat `app/(dashboard)/layout.tsx` yang memuat Sidebar navigasi di sebelah kiri.
   - Buat file `app/(dashboard)/loading.tsx` yang menampilkan kerangka skeleton saat data berpindah.
   - Pastikan link navigasi menggunakan komponen `<Link>` dari `next/navigation`.

---

### Latihan 2: Dynamic Breadcrumb & Detail Renderer (Tingkat Lanjutan)

Buat sistem tampilan detail materi dinamis pada path:
`app/dashboard/modul/[kategori]/[slug]/page.tsx`

**Spesifikasi Fungsional**:
1. Tangani `params` asinkron sesuai standar Next.js 15: baca `kategori` dan `slug`.
2. Jika `kategori` bukan salah satu dari `["frontend", "backend", "devops"]`, panggil fungsi `notFound()` untuk menampilkan UI 404 khusus.
3. Di bagian paling atas halaman, buat komponen breadcrumb dinamis:
   `Beranda > Dashboard > Modul > [Kategori Kapital] > [Slug Judul]`
4. Buat file `not-found.tsx` di dalam folder `app/dashboard/modul/` yang menampilkan tombol bantuan: *"Kategori tidak ditemukan. Kembali ke katalog modul"*.

---

## 6. Studi Kasus Nyata

### Kasus: "Kepanikan Migrasi Besar Platform Kursus ke App Router"

#### Latar Belakang Masalah
Pada awal tahun 2025, sebuah platform edukasi teknologi dengan 150.000 pengguna aktif memutuskan memigrasikan basis kodenya dari Next.js 12 (Pages Router) ke Next.js 15 (App Router) untuk mengejar performa skor Web Vitals.
Namun tim pengembang terburu-buru melakukan migrasi tanpa memahami mental model App Router:
- Mereka menaruh directive `'use client'` di setiap file halaman `page.tsx` karena menganggap itu cara termudah agar kode lama langsung berjalan tanpa error.
- Di halaman katalog kursus `app/kursus/[id]/page.tsx`, mereka membaca `params.id` secara sinkron tanpa `await`.
- Seluruh navigasi internal masih menggunakan event `window.location.href = ...` di dalam fungsi klik tombol.

#### Dampak Negatif
1. **Kegagalan Total di Lingkungan Produksi**:
   Begitu di-build dengan compiler Next.js 15, build pipeline gagal total (*Build Failed*) karena pelanggaran kontrak: `Route "/kursus/[id]" used params.id. In Next.js 15, params must be unwrapped with React.use() or await params`.
2. **Ukuran Bundle Meledak**:
   Karena setiap halaman diberi `'use client'`, ukuran First Load JS membengkak dari 180 KB menjadi **940 KB per halaman**! Pengguna di ponsel mengeluh aplikasi menjadi sangat berat saat membuka materi pertama kali.
3. **Kehilangan Fitur Soft Navigation**:
   Penggunaan `window.location.href` menyebabkan seluruh tab browser melakukan hard refresh setiap kali mahasiswa berpindah antar bab materi, membuang cache browser dan memicu lonjakan beban server sebesar 300%.

#### Solusi Transformasi Teknis
Tim arsitektur melakukan perbaikan fundamental:
1. **Audit dan Eliminasi `'use client'`**:
   Mengembalikan 85% halaman `page.tsx` dan `layout.tsx` menjadi Server Components murni. Komponen interaktif (seperti tombol pemutar video dan kolom komentar) diisolasi ke modul terpisah. Hasilnya: First Load JS anjlok dari 940 KB ke **88 KB**!
2. **Standardisasi Asynchronous Params**:
   Semua handler halaman dinamis diperbarui dengan interface `params: Promise<{ id: string }>` dan diekstrak menggunakan `const { id } = await params;`.
3. **Standarisasi Link Prefetching**:
   Mengganti seluruh navigasi window manual dengan `<Link prefetch={true} href="...">`. Waktu transisi antar halaman materi kini terasa instan (< 100 milidetik).

---

## 7. Rangkuman Reflektif

Next.js App Router bukan sekadar router baru; ia adalah **perubahan paradigma fundamental** dalam cara kita membangun sistem web.

Kalian tidak lagi membagi aplikasi menjadi "Frontend murni di browser" dan "Backend terpisah di server lain". Dengan App Router, batasan tersebut menyatu secara harmonis:
- Gunakan struktur folder sebagai peta navigasi intuitif.
- Manfaatkan `layout.tsx` untuk menjaga konsistensi UI tanpa membebani browser dengan re-render yang tidak perlu.
- Letakkan pertahanan sistem pada file konvensi `loading.tsx` dan `error.tsx` agar pengguna tidak pernah melihat aplikasi kalian dalam keadaan rusak total.

Di **Modul 06**, kita akan melangkah lebih dalam ke jantung kekuatan Next.js: **Data Fetching & Rendering Paradigms**. Kita akan membedah perbedaan Server Component vs Client Component secara visual, serta bagaimana memutasi data basis data secara aman tanpa API endpoint tradisional menggunakan **Server Actions**.

---

## 8. Evaluasi & Kuis Pemahaman

### Pilihan Ganda

#### Soal 1
Perhatikan struktur direktori Next.js App Router berikut:
```
app/
├── (kampus)/
│   ├── layout.tsx
│   └── jadwal/
│       └── page.tsx
```
URL path publik manakah yang benar untuk mengakses halaman jadwal tersebut di browser?
- A. `/kampus/jadwal`
- B. `/(kampus)/jadwal`
- C. `/jadwal`
- D. `/app/kampus/jadwal`

> **Kunci Jawaban: C**  
> **Pembahasan**: Folder yang dibungkus tanda kurung `(nama_folder)` adalah **Route Group**. Folder ini murni untuk pengelompokan organisasi kode dan layout internal, dan secara otomatis dihilangkan dari struktur path URL publik.

---

#### Soal 2
Di Next.js 15, bagaimana cara yang benar dan baku untuk membaca parameter dinamis `id` pada komponen halaman `app/materi/[id]/page.tsx`?
- A. `const { id } = props.params;` (dibaca secara sinkron langsung)
- B. `const { id } = await props.params;` (karena params adalah Promise asinkron)
- C. `const id = window.location.pathname.split("/")[3];`
- D. `const { id } = useId();`

> **Kunci Jawaban: B**  
> **Pembahasan**: Di Next.js 15, `params` dan `searchParams` yang diterima oleh Server Component diubah menjadi tipe `Promise`. Oleh karena itu, pengembang wajib menggunakan kata kunci `await` (atau fungsi `React.use()`) untuk meng-unwrap nilainya sebelum digunakan.

---

#### Soal 3
Manakah dari berkas konvensi App Router berikut yang **wajib** dideklarasikan dengan directive `'use client'` di baris pertamanya?
- A. `layout.tsx`
- B. `page.tsx`
- C. `loading.tsx`
- D. `error.tsx`

> **Kunci Jawaban: D**  
> **Pembahasan**: File `error.tsx` bertindak sebagai React Error Boundary yang membutuhkan penanganan siklus hidup event client-side dan fungsi pemulihan `reset()`. Oleh karena itu, spesifikasi Next.js mewajibkan `error.tsx` sebagai Client Component.

---

#### Soal 4
Apa perbedaan perilaku mendasar antara `layout.tsx` dan `template.tsx` ketika pengguna berpindah-pindah halaman anak di dalam segmen yang sama?
- A. `layout.tsx` tidak bisa memiliki file CSS sendiri, sedangkan `template.tsx` bisa.
- B. `layout.tsx` mempertahankan state dan tidak me-mount ulang DOM elemennya, sedangkan `template.tsx` selalu membuat instance baru dan me-reset seluruh state internalnya di setiap navigasi.
- C. `layout.tsx` hanya boleh diletakkan di root folder `app/`, sedangkan `template.tsx` bebas di mana saja.
- D. `template.tsx` otomatis menghapus cache database.

> **Kunci Jawaban: B**  
> **Pembahasan**: `layout.tsx` dirancang untuk stabilitas performa tinggi (persisting state & no re-renders on route change). Sebaliknya, `template.tsx` sengaja di-mount ulang setiap kali rute anak berganti, sangat ideal jika kita butuh trigger animasi enter/exit atau reset form otomatis.

---

#### Soal 5
Mengapa pengembang sangat dilarang menggunakan tag HTML biasa `<a href="/dashboard">` untuk navigasi internal antar halaman di dalam aplikasi Next.js?
- A. Karena tag `<a>` otomatis diblokir oleh browser saat menggunakan HTTPS.
- B. Karena tag `<a>` memicu navigasi keras (*hard refresh*) yang memuat ulang seluruh dokumen, membuang state aplikasi, dan menghilangkan keuntungan transisi cepat soft-navigation serta automatic prefetching dari `<Link>`.
- C. Karena tag `<a>` tidak kompatibel dengan CSS Tailwind.
- D. Karena tag `<a>` hanya berfungsi untuk file gambar.

> **Kunci Jawaban: B**  
> **Pembahasan**: Tag `<a>` native memaksa browser me-reload halaman dari nol. Komponen `<Link>` dari Next.js mencegat klik tersebut dan melakukan *soft client-side navigation* serta *prefetching* otomatis yang membuat transisi terasa instan.

---

### Soal Analisis & Kasus

#### Soal 6
Jelaskan mengapa praktik meletakkan directive `'use client'` di level file `app/dashboard/layout.tsx` dianggap sebagai *bad practice* (kebiasaan buruk) dalam arsitektur Next.js modern, dan berikan solusi restrukturisasi komponen yang benar!

> **Pembahasan Soal 6**:  
> **Mengapa Bad Practice**:  
> Menaruh `'use client'` pada layout induk akan menjadikan komponen tersebut beserta **seluruh komponen anak yang diimpor di dalamnya** ikut dikompilasi ke dalam bundle JavaScript client. Akibatnya:
> 1. Ukuran bundle JavaScript yang harus diunduh browser melonjak pesat.
> 2. Komponen anak kehilangan akses langsung ke resource backend (seperti query database aman dan env variables server-only).
> 3. Menghilangkan optimasi Server Component zero-bundle-size.
> 
> **Solusi Restrukturisasi yang Benar**:  
> Pertahankan `layout.tsx` sebagai Server Component murni. Identifikasi bagian spesifik mana yang membutuhkan interaktivitas klien (misalnya hanya tombol toggle tema atau penanda menu aktif berbasis `usePathname()`). Ekstrak hanya elemen interaktif tersebut ke komponen kecil (misal: `NavLinks.tsx`), beri `'use client'` hanya pada file kecil tersebut, lalu impor dan panggil komponen tersebut di dalam `layout.tsx`.

---

#### Soal 7
Sebuah rute dinamis dibuat di `app/mahasiswa/[nim]/page.tsx`. Tuliskan implementasi kode lengkap yang mengambil data mahasiswa dari database konseptual, dan jika mahasiswa dengan NIM tersebut tidak ditemukan di database, sistem secara otomatis melempar tampilan `not-found.tsx`!

> **Pembahasan Soal 7**:
> ```tsx
> // app/mahasiswa/[nim]/page.tsx
> import { notFound } from "next/navigation";
> 
> interface MahasiswaPageProps {
>   params: Promise<{ nim: string }>;
> }
> 
> // Fungsi dummy simulasi database server
> async function cariMahasiswa(nim: string) {
>   if (nim === "240101") {
>     return { nim: "240101", nama: "Fajar Pratama", ipk: 3.85 };
>   }
>   return null; // Simulasi tidak ditemukan
> }
> 
> export default async function DetailMahasiswaPage({ params }: MahasiswaPageProps) {
>   // 1. Un-wrap asynchronous params (Standar Next.js 15)
>   const { nim } = await params;
> 
>   // 2. Ambil data di server
>   const mahasiswa = await cariMahasiswa(nim);
> 
>   // 3. Picu halaman 404 jika data nihil
>   if (!mahasiswa) {
>     notFound();
>   }
> 
>   // 4. Render tampilan jika data valid
>   return (
>     <div className="p-6 bg-white rounded-xl border border-slate-200">
>       <h1 className="text-xl font-bold">{mahasiswa.nama}</h1>
>       <p className="text-sm text-slate-500">NIM: {mahasiswa.nim}</p>
>       <div className="mt-4 font-mono font-semibold">IPK: {mahasiswa.ipk}</div>
>     </div>
>   );
> }
> ```

---

## 9. Referensi & Sumber Belajar Lanjutan

Untuk mendalami seluruh fitur App Router Next.js 15, sangat dianjurkan membaca dokumentasi resmi berikut:

1. **Next.js Official Documentation — Routing Fundamentals**:  
   [https://nextjs.org/docs/app/building-your-application/routing](https://nextjs.org/docs/app/building-your-application/routing)  
   *Panduan resmi terlengkap tentang hierarki file convention, route groups, dan parallel routes.*
2. **Next.js 15 Upgrade Guide — Asynchronous Request APIs**:  
   [https://nextjs.org/docs/app/building-your-application/upgrading/version-15](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)  
   *Panduan resmi mengenai perubahan arsitektur params dan searchParams menjadi Promise asinkron.*
3. **Lee Robinson — How to Think About App Router**:  
   [https://leerob.io/blog/using-nextjs](https://leerob.io/blog/using-nextjs)  
   *Catatan teknis dari VP of Product Vercel mengenai cara merancang aplikasi berskala besar dengan Next.js.*
4. **Next.js Official Documentation — Linking and Navigating**:  
   [https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating)  
   *Penjelasan teknis mekanisme automatic prefetching, route cache, dan soft navigation.*
