# Modul 06: Data Fetching & Rendering Paradigms: Server Component, Client Component, dan Server Actions

---

## 1. Overview & Pengantar

Jika kalian bertanya kepada insinyur senior tentang lompatan teknologi terbesar dalam ekosistem React selama sepuluh tahun terakhir, jawabannya adalah satu: **React Server Components (RSC) dan Server Actions**.

Di era React lama, alur pengambilan data (*data fetching*) adalah salah satu pengalaman paling melelahkan:
1. Browser mengunduh file bundle JavaScript kosong.
2. Komponen me-mount di browser pengguna.
3. Hook `useEffect` berjalan, lalu menembakkan `fetch('/api/data')`.
4. Pengguna melihat animasi *loading spinner* berputar-putar.
5. Jika ada tiga komponen bersarang yang sama-sama mengambil data, terjadi fenomena bencana performa yang disebut **Network Waterfall**—komponen kedua baru mulai mengambil data setelah komponen pertama selesai, membuat halaman terasa sangat lambat.
6. Belum lagi untuk setiap aksi tombol (misal menambah tugas), kalian harus membuat endpoint API controller terpisah, mendefinisikan rute API, dan mengatur serialisasi JSON bolak-balik.

Next.js App Router mengakhiri era kepedihan tersebut.

Secara default, **seluruh komponen di dalam folder `app/` adalah Server Component**. Kalian bisa memanggil database atau membaca file server langsung di dalam fungsi komponen menggunakan kata kunci `async/await` biasa! Tidak ada `useEffect`, tidak ada loading spinner yang berkedip di awal, dan ukuran bundle JavaScript yang dikirim ke browser pengguna adalah **0 kilobyte** untuk komponen tersebut.

Lalu bagaimana jika pengguna mengklik tombol atau mengisi formulir? Kita tidak perlu lagi membuat API endpoint terpisah. Kita menggunakan **Server Actions**—fungsi asinkron yang berjalan aman di server dan dapat dipanggil langsung dari antarmuka pengguna.

Di modul keenam ini, kita akan membedah tuntas bagaimana membagi arsitektur aplikasi antara Server Component dan Client Component, bagaimana mengendalikan caching data, serta bagaimana membangun alur mutasi data yang aman dan elegan menggunakan Server Actions.

---

## 2. Tujuan Pembelajaran

Setelah menyelesaikan modul ini dan menyelesaikan seluruh tugas praktiknya, kalian diharapkan mampu:

1. **Membedah batas arsitektur (*Network Boundary*)** antara React Server Components (RSC) dan Client Components, serta menerapkan pola komposisi *interleaving* yang benar.
2. **Mengimplementasikan pengambilan data (*data fetching*)** langsung di tingkat Server Component menggunakan `async/await` tanpa ketergantungan pada `useEffect`.
3. **Mengendalikan strategi caching Next.js** (Static Caching, Dynamic Rendering/No-Store, Time-based Revalidation, dan On-Demand Revalidation dengan `revalidatePath` / `revalidateTag`).
4. **Membangun sistem mutasi data berbasis Server Actions** (`'use server'`) yang terintegrasi dengan elemen formulir native dan Hook React 19 `useActionState`.
5. **Menerapkan validasi data sisi server (*Server-side Validation*)** menggunakan skema Zod sebelum data dieksekusi ke basis data.
6. **Mencegah bencana performa *Network Waterfall*** menggunakan teknik eksekusi paralel dan *Streaming with Suspense*.

---

## 3. Prasyarat Pengetahuan & Perangkat

- **Prasyarat Pengetahuan**:
  - Telah menyelesaikan **Modul 01 s.d. Modul 05** (khususnya konsep asynchronous Promise dan hierarki App Router).
  - Memahami sintaks dasar form handling HTML (`<form>`, `<input>`, atribut `name`).
- **Perangkat Lunak**:
  - Proyek Next.js 15 berjalan di lingkungan lokal.
  - Package `zod` terpasang untuk validasi skema: `npm install zod`.

---

## 4. Konten Pembelajaran Utama

### 4.1 Server Component vs Client Component: Memahami Garis Batas Runtime

Salah satu kesalahan paling mendasar pengembang pemula adalah menganggap Client Component lebih superior karena "bisa melakukan segalanya". Ini pemikiran yang keliru.

Di Next.js, aturan praktisnya adalah: **Mulailah selalu dengan Server Component secara default. Hanya beralih ke Client Component jika kalian benar-benar membutuhkan interaktivitas browser.**

```
+-------------------------------------------------------------------+
|                     SERVER RUNTIME (Next.js Node)                 |
|                                                                   |
|  [Server Component: DaftarModulPage]                              |
|  - Mengambil data langsung dari Database: await db.materi.find()  |
|  - Menyimpan API Secret / Private Keys dengan aman                |
|  - Ukuran bundle JavaScript yang dikirim ke browser: 0 KB         |
|                                                                   |
|                 || (Hanya mengirim HTML & RSC Payload)            |
|                 \/                                                |
+-------------------------------------------------------------------+
|                     CLIENT RUNTIME (Web Browser)                  |
|                                                                   |
|  [Client Component: TombolSukaInteraktif ('use client')]          |
|  - Menangani onClick, onChange, event listener                     |
|  - Menggunakan Hook: useState, useEffect, useOptimistic           |
|  - Mengakses Web APIs: localStorage, navigator, window            |
+-------------------------------------------------------------------+
```

#### Tabel Perbandingan Karakteristik

| Kebutuhan Fitur | Server Component (Default) | Client Component (`'use client'`) |
| :--- | :--- | :--- |
| Mengambil data langsung dari Database / File Server | **Bisa (Sangat Cepat)** | **Dilarang Keras** (Kredensial bocor) |
| Menggunakan variabel rahasia (`process.env.API_KEY`) | **Aman** | **Berbahaya** |
| Menangani interaksi event (`onClick`, `onChange`) | **Tidak Bisa** | **Bisa** |
| Menggunakan Hook State (`useState`, `useReducer`) | **Tidak Bisa** | **Bisa** |
| Menggunakan Browser APIs (`window`, `localStorage`) | **Tidak Bisa** | **Bisa** |
| Dampak ke Ukuran Bundle JavaScript Klien | **0 Kilobyte (Nol)** | Menambah ukuran unduhan browser |

#### Pola Komposisi Sakral: Interleaving
Bagaimana jika kalian memiliki Client Component (misalnya komponen modal dialog) yang membutuhkan data dari Server Component di dalamnya?

**Aturan Emas**: Kalian **TIDAK BISA** mengimpor Server Component langsung di dalam file Client Component. Tetapi kalian **BISA** mengirimkan Server Component sebagai prop `children` ke dalam Client Component!

```tsx
// 1. Client Component: Pembungkus Interaktif (src/components/ModalDialog.tsx)
"use client";
import { useState } from "react";

export function ModalDialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Buka Modal</button>
      {isOpen && <div className="modal-box">{children}</div>}
    </div>
  );
}

// 2. Server Component: Halaman Induk (app/dashboard/page.tsx)
import { ModalDialog } from "@/components/ModalDialog";
import { DataBeratServer } from "@/components/DataBeratServer"; // Server Component murni

export default function DashboardPage() {
  return (
    <ModalDialog>
      {/* Server Component disuntikkan lewat prop children! */}
      {/* DataBeratServer tetap di-render di server tanpa menambah bundle client */}
      <DataBeratServer />
    </ModalDialog>
  );
}
```

---

### 4.2 Data Fetching di Server Component: Cepat, Bersih, Tanpa Boilerplate

Lupakan `useEffect` dan `useState` hanya untuk menampilkan daftar data dari server. Di Server Component, fungsi kalian cukup dideklarasikan sebagai `async`:

```tsx
// app/dashboard/materi/page.tsx

interface MateriItem {
  id: string;
  judul: string;
  tingkat: "Dasar" | "Menengah" | "Mahir";
}

// Fungsi pembantu data fetching (bisa langsung query DB atau fetch HTTP)
async function ambilSemuaMateri(): Promise<MateriItem[]> {
  // Simulasi fetch data dari microservice internal
  const res = await fetch("https://api.velqora.ac.id/v1/materi", {
    // Strategi Caching: Revalidasi otomatis setiap 1 jam (3600 detik)
    next: { revalidate: 3600, tags: ["koleksi-materi"] }
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data materi dari server pusat.");
  }

  return res.json();
}

export default async function MateriPage() {
  // Ambil data langsung di badan komponen!
  const daftarMateri = await ambilSemuaMateri();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Katalog Materi Pembelajaran</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {daftarMateri.map((item) => (
          <article key={item.id} className="p-4 rounded-xl border bg-white shadow-xs">
            <span className="text-xs font-semibold text-brand-600">{item.tingkat}</span>
            <h2 className="text-lg font-bold mt-1">{item.judul}</h2>
          </article>
        ))}
      </div>
    </div>
  );
}
```

#### Taksonomi Strategi Caching di Next.js
Next.js memiliki sistem caching berlapis yang sangat canggih. Pahami 3 opsi utamanya:

1. **Static Data (Default Caching)**:
   `fetch(url, { cache: 'force-cache' })`  
   Data di-fetch saat waktu build (*build-time*) dan disimpan selamanya sampai ada deployment baru. Sangat cocok untuk artikel statis, syarat & ketentuan, atau FAQ.
2. **Revalidasi Berkala (Time-Based ISR)**:
   `fetch(url, { next: { revalidate: 60 } })`  
   Data di-cache, namun setelah 60 detik, request berikutnya akan memicu pembaruan data segar di latar belakang (*Incremental Static Regeneration*).
3. **Dynamic Data (No Store)**:
   `fetch(url, { cache: 'no-store' })`  
   Data tidak pernah disimpan di cache. Setiap kali pengguna merefresh halaman, server selalu melakukan query langsung. Cocok untuk saldo dompet, notifikasi waktu nyata, atau keranjang belanja.

---

### 4.3 Menghentikan Network Waterfall dengan Streaming Suspense

Apa yang terjadi jika halaman kalian memuat dua komponen: Komponen Ringkasan (butuh waktu 100ms) dan Komponen Analitik Kompleks (butuh waktu 3 detik)?

Jika kalian menulis:
```tsx
export default async function Halaman() {
  const cepat = await ambilRingkasan(); // 100ms
  const lambat = await ambilAnalitik(); // 3000ms
  // Pengguna harus menatap layar kosong selama 3.1 detik!
}
```

**Solusi Modern**: Gunakan **React Suspense & Streaming**!  
Bungkus komponen yang lambat dengan `<Suspense fallback={<Skeleton />}>`. Bagian yang cepat akan langsung dikirim ke layar pengguna seketika, sementara bagian yang lambat akan di-stream (disusulkan) begitu datanya siap:

```tsx
import { Suspense } from "react";
import { RingkasanCepat } from "@/components/RingkasanCepat";
import { AnalitikLambat } from "@/components/AnalitikLambat";
import { SkeletonAnalitik } from "@/components/SkeletonAnalitik";

export default function DashboardHalaman() {
  return (
    <div className="space-y-6">
      {/* Komponen ini langsung muncul dalam 100 milidetik */}
      <RingkasanCepat />

      {/* Komponen ini di-stream di latar belakang tanpa menahan seluruh halaman */}
      <Suspense fallback={<SkeletonAnalitik />}>
        <AnalitikLambat />
      </Suspense>
    </div>
  );
}
```

---

### 4.4 Mutasi Data Modern: Mengenal Server Actions

Sebelum adanya Server Actions, jika kalian ingin membuat fitur "Tambah Catatan", langkahnya sangat panjang:
1. Buat file `app/api/catatan/route.ts`.
2. Tulis method handler `POST(req)`.
3. Di client component, buat form dengan state manual untuk setiap input.
4. Tulis event `e.preventDefault()`, lalu panggil `fetch('/api/catatan', { method: 'POST', body: ... })`.
5. Tangani loading state dan revalidasi manual.

Dengan **Server Actions**, kalian cukup menulis sebuah fungsi asinkron dengan direktif `'use server'` di baris pertamanya!

```tsx
// app/actions/catatan-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. Definisikan Skema Validasi Menggunakan Zod (Keamanan Mutlak)
const SkemaCatatan = z.object({
  judul: z.string().min(3, "Judul catatan minimal 3 karakter").max(100),
  isi: z.string().min(10, "Isi catatan minimal 10 karakter"),
});

export interface ActionState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// 2. Server Action Handler
export async function tambahCatatanAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Ambil data langsung dari objek FormData native
  const rawData = {
    judul: formData.get("judul"),
    isi: formData.get("isi"),
  };

  // Validasi data secara defensif di server
  const hasilValidasi = SkemaCatatan.safeParse(rawData);

  if (!hasilValidasi.success) {
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali input Anda.",
      errors: hasilValidasi.error.flatten().fieldErrors,
    };
  }

  try {
    const { judul, isi } = hasilValidasi.data;

    // Simpan ke database (simulasi query DB aman di lingkungan server)
    // await db.catatan.create({ data: { judul, isi } });
    console.log(`[DATABASE] Catatan baru tersimpan: "${judul}"`);

    // Hancurkan cache halaman agar data terbaru langsung tampil seketika!
    revalidatePath("/dashboard/catatan");

    return {
      success: true,
      message: "Catatan berhasil ditambahkan ke akun Anda!",
    };
  } catch (error) {
    console.error("[SERVER ERROR]:", error);
    return {
      success: false,
      message: "Terjadi kesalahan internal server saat menyimpan data.",
    };
  }
}
```

#### Mengintegrasikan Server Action ke Antarmuka Form dengan React 19 `useActionState`
Di sisi komponen antarmuka klien, kita menggunakan Hook bawaan React 19 **`useActionState`** untuk menangani status loading dan feedback error secara otomatis:

```tsx
// app/dashboard/catatan/FormTambahCatatan.tsx
"use client";

import { useActionState } from "react";
import { tambahCatatanAction, type ActionState } from "@/app/actions/catatan-actions";

const initialState: ActionState = {
  success: false,
  message: "",
};

export function FormTambahCatatan() {
  // useActionState mengembalikan [state, formAction, isPending]
  const [state, formAction, isPending] = useActionState(
    tambahCatatanAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4 max-w-lg p-6 border rounded-xl bg-white shadow-xs">
      <h3 className="text-lg font-bold">Buat Catatan Baru</h3>

      {/* Umpan balik status pesan */}
      {state.message && (
        <div className={`p-3 rounded-lg text-sm ${state.success ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
          {state.message}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Judul Catatan</label>
        <input 
          name="judul" 
          type="text" 
          disabled={isPending}
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-brand-600 disabled:opacity-50"
          placeholder="Misal: Rangkuman Modul 06" 
        />
        {state.errors?.judul && (
          <p className="text-xs text-rose-600 mt-1">{state.errors.judul[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Isi Catatan</label>
        <textarea 
          name="isi" 
          rows={4}
          disabled={isPending}
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-brand-600 disabled:opacity-50"
          placeholder="Tuliskan poin-poin penting kuliah di sini..." 
        />
        {state.errors?.isi && (
          <p className="text-xs text-rose-600 mt-1">{state.errors.isi[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
      >
        {isPending ? "Menyimpan ke Server..." : "Simpan Catatan"}
      </button>
    </form>
  );
}
```

---

### 4.5 Catatan dari Lapangan: Tiga Kesalahan Fatal Integrasi Data

#### 1. Membocorkan Secret Backend ke Komponen `'use client'`
Pernah terjadi kasus di mana seorang pengembang mengimpor library database (seperti Prisma atau Supabase Admin SDK dengan Service Role Key) ke dalam komponen yang diberi tanda `'use client'`.  
**Hasilnya**: Compiler Next.js akan langsung menolak proses build (*Build Error: Private environment variables or server modules cannot be imported in client code*). Jika pengembang memaksa membungkusnya, kredensial penuh basis data akan terkirim ke tab Network browser, membuka pintu bagi peretas untuk menghapus seluruh database!  
**Aturan Baku**: Akses database dan private key **HANYA BOLEH** berada di Server Components atau file Server Actions (`'use server'`).

#### 2. Ketiadaan Validasi Server Karena Mengandalkan Validasi HTML
Banyak mahasiswa berpikir: *"Kan inputnya sudah saya beri atribut `required` dan `type='email'`, jadi data yang sampai ke server pasti aman dan benar."*  
**Salah Besar!** Siapa pun bisa membuka DevTools, menghapus atribut `required` dari elemen HTML dalam 2 detik, atau mengirimkan request kustom berbahaya via cURL langsung ke Server Action kalian.  
**Aturan Emas**: Validasi di sisi klien hanyalah untuk kenyamanan visual pengguna (*User Experience*). Validasi di sisi server (menggunakan Zod) adalah **garis pertahanan wajib mutlak (*Security Requirement*)**.

#### 3. Lupa Memanggil `revalidatePath` Setelah Mutasi Data
Mahasiswa sering bertanya: *"Pak, formulir saya berhasil menyimpan data ke database, tapi kok waktu kembali ke halaman daftar, datanya tidak muncul sampai saya me-restart server?"*  
Itu karena Next.js secara default meng-cache halaman Server Component demi performa. Setelah mutasi data berhasil di Server Action, kalian **wajib memanggil `revalidatePath('/path-halaman')`** untuk memberi tahu Next.js agar membersihkan cache lama dan mengambil data terbaru dari database.

---

## 5. Latihan & Tugas Praktik

### Latihan 1: Reader-Writer Dashboard Mini (Tingkat Dasar)

Bangun alur data lengkap untuk fitur pengumuman kampus:
1. **Komponen Pembaca (Server Component)**:
   - Buat file `app/dashboard/pengumuman/page.tsx`.
   - Ambil data daftar pengumuman langsung di server (gunakan array dummy di memori server atau file JSON lokal).
   - Tampilkan daftar pengumuman dengan judul, tanggal rilis, dan isi ringkas.
2. **Komponen Pembuat (Server Action + Form)**:
   - Buat Server Action `buatPengumumanAction(formData)`.
   - Tambahkan form input sederhana di bagian atas halaman dengan kolom: `judul` dan `isi`.
   - Terapkan pemanggilan `revalidatePath('/dashboard/pengumuman')` agar pengumuman yang baru dikirim langsung muncul di daftar tanpa me-refresh browser.

---

### Latihan 2: Formulir Registrasi Seminar dengan Zod & Pending State (Tingkat Lanjutan)

Buat sistem pendaftaran seminar mahasiswa dengan spesifikasi keamanan industri:
1. **Skema Zod di Server**:
   - `namaLengkap`: Minimal 3 karakter, wajib huruf.
   - `email`: Format email universitas valid (wajib berakhiran `@kampus.ac.id` atau validasi email standar).
   - `peminatan`: Wajib memilih antara `"Frontend"`, `"Backend"`, atau `"Mobile"`.
2. **Server Action**:
   - Berikan simulasi jeda waktu jaringan 1.5 detik (`await new Promise(r => setTimeout(r, 1500))`).
   - Kembalikan error per-field secara rapi jika validasi Zod gagal.
3. **Komponen Antarmuka (`'use client'`)**:
   - Gunakan `useActionState`.
   - Saat `isPending` aktif, ubah teks tombol menjadi spinner animasi dan nonaktifkan seluruh kolom input form.
   - Jika berhasil, tampilkan banner hijau sukses dan reset input form.

---

## 6. Studi Kasus Nyata

### Kasus: "Insiden Kebocoran Service Role Key dan Bencana Waterfall Data di Portal Beasiswa"

#### Skenario Masalah
Sebuah yayasan pendidikan swasta meluncurkan portal pendaftaran beasiswa berbasis web. Dua hari setelah pendaftaran dibuka:
1. Pengguna mengeluhkan bahwa halaman dashboard beasiswa membutuhkan waktu **8 detik** untuk selesai memuat data.
2. Tim keamanan informasi menemukan bahwa seorang peserta beasiswa berhasil mengubah status penerimaan dirinya sendiri menjadi "Lolos Verifikasi Tahap Akhir" melalui konsol browser!

#### Audit Forensik & Temuan Teknis
1. **Akar Masalah Kebocoran Kredensial**:
   Pengembang membuat komponen tombol verifikasi di file `TombolVerifikasi.tsx` dan menyematkan direktif `'use client'`. Di dalam file tersebut, pengembang menulis:
   ```typescript
   import { createClient } from "@supabase/supabase-js";
   // ❌ BENCANA BESAR: Memasukkan Service Role Key rahasia ke Client Component!
   const supabaseAdmin = createClient(URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!);
   ```
   Variabel lingkungan tersebut memiliki hak akses setara *Super Admin* yang mengabaikan seluruh aturan keamanan database (*Row Level Security*). Pengguna yang memahami DevTools cukup membuka tab Sources, membaca key tersebut, dan mengirimkan query mutasi langsung ke database.
2. **Akar Masalah Waterfall 8 Detik**:
   Di halaman profil pelamar, pengembang menggunakan 4 buah Client Component terpisah yang masing-masing memiliki `useEffect` dengan fetch internal:
   - Komponen Biodata mengambil data (2 detik)
   - SETELAH biodata selesai, Komponen Riwayat Nilai baru mulai memuat (2.5 detik)
   - SETELAH nilai selesai, Komponen Berkas PDF baru mulai memuat (2 detik)
   - SETELAH berkas selesai, Komponen Status Bank baru memuat (1.5 detik)
   Total waktu tunggu berantai: $2 + 2.5 + 2 + 1.5 =$ **8 detik penuh penderitaan**.

#### Transformasi Arsitektur Menyeluruh
1. **Mengunci Mutasi ke Server Actions**:
   Seluruh operasi database dipindahkan ke Server Action tertutup `verifikasiBerkasAction` di lingkungan Node.js server. Service Role Key dihapus dari awalan `NEXT_PUBLIC_` dan hanya bisa dibaca oleh server. Klien hanya memiliki tombol biasa yang memanggil server action tersebut.
2. **Eliminasi Waterfall dengan Parallel RSC & Streaming Suspense**:
   - Halaman diubah menjadi Server Component tunggal.
   - Keempat operasi query database dieksekusi serentak menggunakan `Promise.all()` di sisi server berkecepatan tinggi dengan latensi database lokal (< 50 milidetik).
   - Bagian berkas PDF yang membutuhkan komputasi pihak ketiga dibungkus dengan `<Suspense fallback={<SkeletonBerkas />}>`.
3. **Hasil Terukur**:
   - Waktu muat halaman anjlok dari 8 detik menjadi **450 milidetik**!
   - Celah keamanan tertutup rapat karena tidak ada satu pun kunci rahasia yang bocor ke browser.

---

## 7. Rangkuman Reflektif

Dahulu, para insinyur web terbiasa dengan dikotomi kaku: *"Frontend adalah urusan visual di browser, Backend adalah urusan data di server."*

Dengan **React Server Components** dan **Server Actions**, batas artifisial tersebut dilebur menjadi satu kesatuan arsitektur yang harmonis. Kalian kini memiliki kekuatan penuh untuk menentukan di mana sebuah baris kode harus berjalan:
- Jalankan di **Server** untuk mengakses database berkecepatan tinggi, menjaga keamanan rahasia sistem, dan menghemat kuota internet pengguna.
- Jalankan di **Client** hanya untuk menangani sentuhan interaksi manusia di layar.

Pahami pemisahan ini secara naluriah. Di **Modul 07**, kita akan melengkapi arsitektur ini dengan membahas **Manajemen State Lanjutan**: bagaimana mengelola data global yang kompleks di sisi klien menggunakan kombinasi **Compound Components, Context API, dan Zustand**.

---

## 8. Evaluasi & Kuis Pemahaman

### Pilihan Ganda

#### Soal 1
Perhatikan baris kode Server Component berikut:
```tsx
export default async function HalamanMateri() {
  const data = await db.materi.findMany();
  return <DaftarMateri data={data} />;
}
```
Berapa ukuran file kode JavaScript dari komponen `HalamanMateri` ini yang akan dimasukkan ke dalam bundle unduhan browser pengguna?
- A. Seukuran file sumbernya (sekitar 2–5 KB).
- B. Seukuran data database yang dikembalikan.
- C. 0 Kilobyte (Nol KB), karena Server Component di-render murni di server dan hanya mengirimkan hasil HTML serta JSON representasi virtual ke browser.
- D. Seukuran library database driver (misal Prisma runtime sekitar 2 MB).

> **Kunci Jawaban: C**  
> **Pembahasan**: Ini adalah salah satu revolusi terbesar React Server Components (RSC). Seluruh dependensi, logika query, dan kode internal Server Component dieksekusi di server dan dibuang dari bundle klien (*Zero-Bundle-Size Components*). Klien hanya menerima hasil render akhir.

---

#### Soal 2
Manakah dari baris kode berikut yang **pasti gagal dikompilasi atau melempar error** jika diletakkan di dalam sebuah Server Component default di Next.js App Router?
- A. `const cookieStore = await cookies();`
- B. `const [cari, setCari] = useState("");`
- C. `const data = await fetch("https://api.kampus.ac.id");`
- D. `const secret = process.env.DATABASE_URL;`

> **Kunci Jawaban: B**  
> **Pembahasan**: Hook reaktif sisi klien seperti `useState`, `useReducer`, dan `useEffect` hanya diizinkan berjalan di dalam Client Component yang dideklarasikan dengan direktif `'use client'`. Server Component tidak memiliki memori siklus hidup interaktif browser.

---

#### Soal 3
Apa fungsi utama dari pemanggilan `revalidatePath('/dashboard/tugas')` di dalam sebuah Server Action setelah operasi penyimpanan data tugas berhasil dilakukan?
- A. Mengunduh ulang seluruh database ke hard disk komputer pengembang.
- B. Membersihkan cache internal Next.js untuk rute `/dashboard/tugas` sehingga kunjungan berikutnya menampilkan data yang paling mutakhir dari database.
- C. Menghapus cookie sesi pengguna yang sedang aktif.
- D. Mengubah rute halaman browser secara paksa menggunakan hard refresh.

> **Kunci Jawaban: B**  
> **Pembahasan**: Karena Next.js menerapkan caching agresif pada level rute untuk kecepatan tinggi, `revalidatePath` bertindak sebagai instruksi *cache invalidation* terarah yang memaksa Next.js mengambil data segar pada segmen rute yang ditentukan.

---

#### Soal 4
Perhatikan strategi data fetching berikut:
```tsx
const res = await fetch("https://api.velqora.ac.id/kursus", {
  cache: "no-store"
});
```
Bagaimana perilaku caching dari pemanggilan fetch di atas?
- A. Data disimpan permanen di memori browser pengguna selamanya.
- B. Data tidak pernah disimpan di cache; setiap request yang masuk ke halaman akan selalu memicu pengambilan data baru dari server asal secara dinamis.
- C. Data di-refresh setiap 60 detik secara otomatis di latar belakang.
- D. Fetch otomatis dibatalkan jika pengguna menutup tab browser.

> **Kunci Jawaban: B**  
> **Pembahasan**: Opsi `cache: "no-store"` (atau `export const dynamic = 'force-dynamic'`) menginstruksikan Next.js untuk melewati Data Cache sepenuhnya dan selalu melakukan fetch langsung di setiap request yang masuk (*Dynamic Rendering*).

---

#### Soal 5
Mengapa kita **wajib** melakukan validasi data (misalnya dengan library Zod) di dalam fungsi Server Action, meskipun formulir di antarmuka klien sudah memiliki validasi HTML seperti `required`, `type="number"`, dan `min="1"`?
- A. Karena Zod otomatis mengubah warna tombol submit menjadi hijau jika data valid.
- B. Karena validasi HTML di browser dapat dengan mudah dilewati atau dimatikan oleh siapa pun melalui DevTools atau request cURL langsung, sehingga server tidak boleh mempercayai data dari klien begitu saja.
- C. Karena server Node.js tidak bisa membaca teks HTML.
- D. Agar ukuran bundle JavaScript klien berkurang 50%.

> **Kunci Jawaban: B**  
> **Pembahasan**: Di arsitektur web terdistribusi, browser klien dianggap sebagai lingkungan yang sepenuhnya tidak aman (*untrusted environment*). Validasi klien hanyalah untuk kenyamanan visual antarmuka pengguna, sedangkan validasi server adalah benteng pertahanan keamanan mutlak untuk integritas basis data.

---

### Soal Analisis & Kasus

#### Soal 6
Jelaskan apa yang dimaksud dengan masalah **"Network Waterfall"** pada pengambilan data di aplikasi React lama, dan bagaimana arsitektur Next.js 15 (Server Component & React Suspense) menyelesaikannya secara elegan!

> **Pembahasan Soal 6**:  
> **Definisi Network Waterfall**:  
> Situasi di mana beberapa komponen antarmuka yang saling bersarang mengambil data secara berurutan (*sequential chain*) melalui jaringan internet. Komponen anak tidak bisa mulai mengambil datanya sebelum komponen induk selesai mengambil data, merender dirinya, dan mengeksekusi hook `useEffect` milik anak. Akibatnya, waktu loading membengkak secara kumulatif ($T_{\text{total}} = T_1 + T_2 + T_3$).  
> **Solusi Next.js 15**:  
> 1. **Server Components Co-location**: Seluruh proses data fetching dilakukan di server pusat (yang berada di satu jaringan lokal atau data center yang sama dengan database), memangkas latensi jaringan antar-fetch dari hitungan ratusan milidetik menjadi sub-milidetik.  
> 2. **Streaming with Suspense**: Bagian halaman yang cepat dapat langsung di-render dan dikirim ke browser pengguna seketika, sementara bagian komponen yang lambat dibungkus dengan `<Suspense fallback={<Skeleton />}>` dan disusulkan (*streamed*) melalui satu koneksi HTTP yang sama tanpa menahan keseluruhan halaman.

---

#### Soal 7
Tuliskan implementasi kode Server Action lengkap bernama `ubahStatusTugasAction` yang menerima `tugasId` (string UUID) dan `statusSelesai` (boolean). Tindakan ini harus memvalidasi data menggunakan Zod, melakukan simulasi pembaruan data di server, dan me-revalidasi rute `/dashboard/tugas`!

> **Pembahasan Soal 7**:
> ```tsx
> // app/actions/tugas-actions.ts
> "use server";
> 
> import { revalidatePath } from "next/cache";
> import { z } from "zod";
> 
> // 1. Skema Validasi
> const SkemaUbahStatus = z.object({
>   tugasId: z.string().uuid({ message: "Format ID tugas tidak valid." }),
>   statusSelesai: z.boolean({ required_error: "Status tugas wajib disertakan." }),
> });
> 
> export async function ubahStatusTugasAction(tugasId: string, statusSelesai: boolean) {
>   // 2. Validasi input
>   const hasil = SkemaUbahStatus.safeParse({ tugasId, statusSelesai });
> 
>   if (!hasil.success) {
>     return {
>       success: false,
>       error: hasil.error.flatten().fieldErrors,
>     };
>   }
> 
>   try {
>     const { tugasId: id, statusSelesai: status } = hasil.data;
> 
>     // 3. Eksekusi ke database (simulasi)
>     // await db.tugas.update({ where: { id }, data: { selesai: status } });
>     console.log(`[DB] Tugas ${id} status diperbarui menjadi: ${status}`);
> 
>     // 4. Invalidate cache rute terkait
>     revalidatePath("/dashboard/tugas");
> 
>     return {
>       success: true,
>       message: "Status tugas berhasil diperbarui.",
>     };
>   } catch (err) {
>     console.error("[ACTION ERROR]:", err);
>     return {
>       success: false,
>       error: "Gagal memperbarui status tugas di server.",
>     };
>   }
> }
> ```

---

## 9. Referensi & Sumber Belajar Lanjutan

Untuk memperdalam arsitektur RSC dan mutasi data modern, pelajari dokumentasi rujukan resmi berikut:

1. **Next.js Official Documentation — Data Fetching and Caching**:  
   [https://nextjs.org/docs/app/building-your-application/data-fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)  
   *Panduan resmi mengenai siklus hidup caching, revalidasi, dan optimasi fetch.*
2. **Next.js Official Documentation — Server Actions and Mutations**:  
   [https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)  
   *Dokumentasi teknis pembuatan dan pemanggilan Server Actions terintegrasi form.*
3. **React Official Documentation — Server Components Architecture**:  
   [https://react.dev/reference/rsc/server-components](https://react.dev/reference/rsc/server-components)  
   *Spesifikasi arsitektural resmi dari tim inti React mengenai cara kerja Server Component.*
4. **Zod Official Documentation — TypeScript-first Schema Validation**:  
   [https://zod.dev/](https://zod.dev/)  
   *Dokumentasi lengkap library validasi skema runtime paling populer di ekosistem TypeScript modern.*
