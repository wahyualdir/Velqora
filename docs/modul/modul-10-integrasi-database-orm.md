# MODUL 10: INTEGRASI DATABASE RELASIONAL & ORM MODERN

> **Mata Kuliah:** Pengembangan Aplikasi Web Modern  
> **Target Audiens:** Mahasiswa S1 Informatika / Sistem Informasi (Semester 3)  
> **Alokasi Waktu:** 3 SKS (150 Menit Tatap Muka + 180 Menit Praktikum Mandiri)  
> **Prasyarat:** Modul 03 (Asynchronous JavaScript & Promises), Modul 06 (Server Actions & Mutasi Data)  
> **Penyusun:** Senior Full-stack Engineer & Dosen Praktisi  

---

## 1. RINGKASAN MODUL & RELEVANSI INDUSTRI

Sebuah aplikasi web yang cantik tanpa sistem penyimpanan data yang handal hanyalah sebuah brosur digital interaktif. Ketika kita berbicara tentang sistem inti perusahaan — mulai dari pencatatan nilai akademik mahasiswa, transaksi finansial perbankan, hingga manajemen persediaan barang e-commerce — integritas data adalah harga mati yang tidak bisa ditawar. Standar industri untuk kasus-kasus tersebut hingga hari ini tetap dipegang kokoh oleh **Relational Database Management System (RDBMS)** seperti **PostgreSQL**, berkat jaminan **ACID (Atomicity, Consistency, Isolation, Durability)** yang telah teruji selama puluhan tahun.

Namun, cara developer berinteraksi dengan database telah berevolusi secara drastis. Di masa lalu, developer menulis string query SQL mentah di dalam kode aplikasi:
```typescript
// Masa lalu: Rentan typo, tanpa type-safety, dan rawan SQL Injection
const result = await db.query("SELECT * FROM users WHERE emial = '" + input + "'");
```
Jika Anda salah mengetik nama kolom (`emial` alih-alih `email`), Anda baru mengetahuinya saat aplikasi meledak di tangan pengguna akhir (*runtime error*).

Di era modern, industri menggunakan **Object-Relational Mapping (ORM)** generasi baru yang mengedepankan **End-to-End Type Safety**, seperti **Prisma** dan **Drizzle**. ORM ini membaca skema data deklaratif, menghasilkan migrasi database yang terkontrol, dan meng-generate tipe data TypeScript secara otomatis. 

Namun, menggunakan ORM tanpa memahami cara kerja database di baliknya ibarat mengendarai mobil sport tanpa tahu cara mengerem. Banyak aplikasi web hancur di produksi karena dua penyakit klasik: **N+1 Query Problem** (yang membuat database menerima ribuan query lambat untuk satu halaman saja) dan **Connection Pool Exhaustion** (ketika arsitektur serverless Next.js membuka ribuan koneksi langsung ke PostgreSQL hingga server database kehabisan memori dan tumbang).

Modul ini akan memandu Anda merancang skema database yang tangguh, menguasai operasi CRUD type-safe, memahami transaksi atomik, mengatasi masalah performa N+1, dan mengonfigurasi *Connection Pooling* untuk lingkungan serverless modern.

---

## 2. CAPAIAN PEMBELAJARAN MODUL (CPM)

Setelah menyelesaikan modul dan praktikum ini, mahasiswa diharapkan mampu:

1. **Merancang Skema Relasional Deklaratif**: Mendesain model entitas, relasi antar-tabel (1:1, 1:N, M:N), indeks database, dan aturan integritas referensial (*Cascade Delete*) menggunakan Prisma Schema.
2. **Mengeksekusi Operasi CRUD Type-Safe**: Mengimplementasikan manipulasi data yang sepenuhnya diverifikasi oleh TypeScript compiler tanpa risiko SQL Injection.
3. **Menganalisis & Mengeliminasi Bencana Performa N+1**: Mengidentifikasi query yang tidak efisien menggunakan query logging dan menyelesaikannya melalui teknik *Eager Loading / Batching* (`include` / `select`).
4. **Menjamin Integritas Data via Transaksi Atomik**: Membungkus operasi bisnis multi-tabel yang kompleks ke dalam transaksi database (`$transaction`) untuk mencegah inkonsistensi data parsial.
5. **Mengelola Koneksi Database di Lingkungan Serverless**: Mengonfigurasi pola Singleton Prisma Client dan arsitektur *Connection Pooling* (seperti PgBouncer / Neon Serverless) untuk mencegah kehabisan batas koneksi database (*Connection Exhaustion*).

---

## 3. PRASYARAT & PENGETAHUAN AWAL

Sebelum mempelajari modul ini, Anda diasumsikan telah memahami:
- Konsep dasar Relational Database: Tabel, Primary Key, Foreign Key, dan relasi dasar SQL (JOIN).
- Penanganan Asynchronous JavaScript (`async/await`) dan Promise dari **Modul 03**.
- Server Actions Next.js sebagai tempat eksekusi mutasi data di sisi server dari **Modul 06**.
- Konsep variabel lingkungan (`.env`) untuk penyimpanan kredensial sensitif.

---

## 4. MATERI INTI & CATATAN LAPANGAN DOSEN

### 4.1 Anatomi Skema Prisma (`schema.prisma`)

Prisma menggunakan file skema deklaratif (`prisma/schema.prisma`) sebagai *single source of truth* untuk tiga hal sekaligus:
1. Struktur fisik tabel di database PostgreSQL.
2. Riwayat migrasi perubahan skema (`prisma migrate`).
3. Tipe data TypeScript yang di-generate otomatis untuk kode aplikasi Anda.

Mari kita pelajari contoh skema platform pembelajaran **Velqora**:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  LECTURER
  STUDENT
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model User {
  id            String       @id @default(cuid())
  email         String       @unique
  name          String
  passwordHash  String
  role          Role         @default(STUDENT)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  // Relasi: Satu Dosen mengajar banyak Kursus (1:N)
  coursesTaught Course[]     @relation("LecturerCourses")

  // Relasi: Satu Siswa dapat mendaftar di banyak Kursus via tabel pivot Enrollment (M:N)
  enrollments   Enrollment[]

  @@index([role]) // Database index untuk query filter berdasarkan peran
  @@map("users")  // Mapping nama tabel fisik di PostgreSQL menjadi huruf kecil jamak
}

model Course {
  id          String       @id @default(cuid())
  title       String
  slug        String       @unique
  description String?      @db.Text
  status      CourseStatus @default(DRAFT)
  lecturerId  String
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // Foreign Key ke tabel User
  lecturer    User         @relation("LecturerCourses", fields: [lecturerId], references: [id], onDelete: Restrict)
  modules     Module[]
  enrollments Enrollment[]

  @@index([lecturerId])
  @@map("courses")
}

model Module {
  id          String   @id @default(cuid())
  courseId    String
  title       String
  content     String   @db.Text
  orderIndex  Int      @default(0)
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())

  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@index([courseId, orderIndex]) // Composite index untuk sorting cepat modul dalam kursus
  @@map("modules")
}

model Enrollment {
  id         String   @id @default(cuid())
  userId     String
  courseId   String
  enrolledAt DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course     Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  // Mencegah siswa mendaftar di kursus yang sama lebih dari satu kali
  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
  @@map("enrollments")
}
```

#### Detail Arsitektural Penting:
- **`@id @default(cuid())`**: Lebih disukai daripada Auto-Increment Integer (`1, 2, 3...`) karena mencegah penyerang menebak jumlah total data atau melakukan enumerasi data (*scraping*) secara berurutan. CUID juga ramah lingkungan terdistribusi.
- **`onDelete: Cascade` vs `Restrict`**: 
  - Pada `Module`, jika `Course` dihapus, seluruh `Module` di dalamnya otomatis ikut terhapus (`Cascade`).
  - Pada `Course`, kita melarang penghapusan akun Dosen jika ia masih memiliki kursus aktif (`Restrict`), untuk mencegah hilangnya data kepemilikan kursus secara tidak sengaja.
- **`@@index`**: Sangat krusial! Kolom *Foreign Key* di PostgreSQL **tidak otomatis di-index**. Selalu tambahkan indeks pada kolom yang sering digunakan di klausa `WHERE`, `JOIN`, atau `ORDER BY`.

---

### 4.2 Inisialisasi Singleton Prisma Client di Next.js

Di Next.js (terutama saat development dengan Fast Refresh), setiap kali Anda mengubah file kode, Node.js me-reload modul. Jika Anda menginisialisasi Prisma Client secara naif (`const prisma = new PrismaClient()`), setiap reload akan membuat koneksi baru ke database. Dalam 10 menit coding, Anda akan melihat pesan error menakutkan:  
`Error: Can't reach database server... too many connections.`

#### Solusi Arsitektur: Singleton Global Pattern

```typescript
// src/lib/db.ts
import "server-only";
import { PrismaClient } from "@prisma/client";

// Mencegah multiple instance PrismaClient di mode development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

Dengan pola di atas, instance Prisma Client yang sama akan digunakan kembali (*reused*) di seluruh siklus hidup development server.

---

### 4.3 Bencana Performa N+1 Query & Solusinya

**N+1 Query Problem** adalah salah satu penyebab utama aplikasi web melambat secara drastis saat jumlah data mulai bertambah.

#### Skenario Bencana:
Bayangkan Anda ingin menampilkan daftar 20 Kursus, lengkap dengan nama Dosen pengajarnya:

```typescript
// ❌ CONTOH SANGAT BURUK (Memicu N+1 Query)
export async function getCoursesWithBadPerformance() {
  // 1 Query pertama: Mengambil 20 kursus
  const courses = await db.course.findMany({ take: 20 });

  // N Query berikutnya: Looping 20 kali untuk mengambil nama dosen satu per satu!
  const coursesWithLecturer = await Promise.all(
    courses.map(async (course) => {
      const lecturer = await db.user.findUnique({
        where: { id: course.lecturerId },
      });
      return { ...course, lecturerName: lecturer?.name };
    })
  );

  return coursesWithLecturer;
}
```

**Berapa query database yang dieksekusi?**
- 1 Query untuk mengambil daftar kursus.
- 20 Query terpisah untuk mencari dosen masing-masing.
- **Total: 21 Query! (1 + N)**. Jika ada 1.000 data kursus, aplikasi Anda akan menembak **1.001 query SQL** ke PostgreSQL, menghabiskan *connection pool*, dan membuat halaman butuh 5 detik untuk loading!

#### Solusi Benar: Eager Loading via `include` atau `select`

ORM modern mampu melakukan optimasi join secara otomatis:

```typescript
// ✅ SOLUSI ARSITEKTUR BERSIH: Cukup 1 atau 2 Query Efisien via Single Join
export async function getCoursesEfficiently() {
  return await db.course.findMany({
    take: 20,
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      // Prisma menggabungkan relasi secara efisien (JOIN di level database)
      lecturer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      // Menghitung jumlah modul tanpa perlu mengambil seluruh isi konten teksnya!
      _count: {
        select: { modules: true },
      },
    },
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
```

> **Catatan Lapangan Dosen:** Perhatikan penggunaan `select` di atas. Jangan biasakan menggunakan `include: { lecturer: true }` tanpa filter kolom. Jika model `User` memiliki kolom `passwordHash` atau data sensitif lainnya, `include` ceroboh akan menarik hash password tersebut ke memori aplikasi! Selalu gunakan `select` eksplisit untuk hanya mengambil kolom yang dibutuhkan.

---

### 4.4 Menjaga Integritas dengan Transaksi Database Atomik (`$transaction`)

Di dunia nyata, satu aksi bisnis pengguna sering kali melibatkan manipulasi pada lebih dari satu tabel. 

**Contoh Kasus:** Pendaftaran Kursus Siswa (*Enrollment*):
1. Periksa apakah kapasitas kelas masih mencukupi.
2. Buat data baru di tabel `enrollments`.
3. Tambahkan saldo poin reward pengguna di tabel `user_rewards`.

Apa yang terjadi jika server mati mendadak atau terjadi error jaringan tepat setelah langkah nomor 2 berhasil dieksekusi, tetapi langkah nomor 3 gagal? **Data Anda rusak (inconsistent state)!** Siswa terdaftar di kelas, tetapi sistem reward gagal memproses datanya.

Untuk menjamin prinsip **All-or-Nothing (Atomicity)**, gunakan transaksi:

```typescript
// src/app/actions/enrollment.ts
"use server";

import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
  const session = await verifySession();

  try {
    // Jalankan seluruh mutasi di dalam satu transaksi terisolasi
    const result = await db.$transaction(async (tx) => {
      // 1. Cek apakah kursus valid dan masih berstatus PUBLISHED
      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: { _count: { select: { enrollments: true } } },
      });

      if (!course || course.status !== "PUBLISHED") {
        throw new Error("Kursus tidak ditemukan atau belum dibuka untuk umum.");
      }

      // 2. Cek apakah pengguna sudah pernah mendaftar sebelumnya
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.userId,
            courseId: courseId,
          },
        },
      });

      if (existingEnrollment) {
        throw new Error("Anda sudah terdaftar di kursus ini.");
      }

      // 3. Batasi kuota maksimal kelas (misal maksimal 50 siswa)
      const MAX_STUDENTS = 50;
      if (course._count.enrollments >= MAX_STUDENTS) {
        throw new Error("Mohon maaf, kuota kursi kelas ini sudah penuh.");
      }

      // 4. Eksekusi Pendaftaran
      const newEnrollment = await tx.enrollment.create({
        data: {
          userId: session.userId,
          courseId: courseId,
        },
      });

      return newEnrollment;
    });

    revalidatePath(`/courses/${courseId}`);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal memproses pendaftaran.",
    };
  }
}
```

Jika terjadi exception atau error di mana pun di dalam blok callback `$transaction`, **seluruh perubahan yang sempat terjadi akan di-rollback (dibatalkan total)** oleh PostgreSQL. Database Anda tetap bersih dan konsisten.

---

### 4.5 Arsitektur Serverless & Connection Pooling

Di lingkungan komputasi tradisional (misal Express.js yang berjalan di satu server VPS Ubuntu), satu proses aplikasi berjalan terus-menerus dan mempertahankan pool 10 hingga 20 koneksi TCP ke PostgreSQL.

Namun, Next.js yang di-deploy ke platform cloud modern (seperti Vercel, AWS Lambda, atau Google Cloud Run) berjalan di atas model **Serverless / Auto-scaling Containers**:

```
SERVER TRADISIONAL (STATEFUL)
[ Node.js Monolith Process ] === (Pool: 10 TCP Connections) ===> [ PostgreSQL Server ]
                                                                 (Max Connections: 100)

SERVERLESS / AUTO-SCALING (STATELESS)
[ Serverless Function #1  ] === 1 TCP Connection ===\
[ Serverless Function #2  ] === 1 TCP Connection =====\
[ Serverless Function #3  ] === 1 TCP Connection =======> [ PostgreSQL Server ]
...                                                    /  (CRASH! Kehabisan Koneksi:
[ Serverless Function #500] === 1 TCP Connection =====/    "Max Clients Reached")
```

Ketika ada lonjakan trafik (misal 500 pengguna membuka aplikasi bersamaan), platform cloud akan menyalakan 500 serverless functions secara instan. Jika masing-masing function mencoba membuka koneksi database langsung, PostgreSQL akan langsung kehabisan RAM dan menolak koneksi baru (*Connection Exhaustion*).

#### Solusi Industri: Connection Pooler (PgBouncer / Prisma Accelerate / Neon)

Di arsitektur modern, kita menyisipkan **Connection Pooler** di tengah-tengah:

```
[ 500 Serverless Functions ]
            |
      (HTTP / Pooled TCP)
            v
+-------------------------------+
| Connection Pooler (PgBouncer) |  ===> Mengelola antrean koneksi cerdas
+-------------------------------+
            |
   (Stabil: Hanya 15 Koneksi Terjaga)
            v
[ Database PostgreSQL ]
```

Pada file `.env` produksi, Anda biasanya memiliki dua URL koneksi:
```env
# 1. DATABASE_URL: Mengarah ke PgBouncer (Port 6543) dengan Transaction Mode untuk query aplikasi
DATABASE_URL="postgres://user:password@aws-pooler.pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. DIRECT_URL: Mengarah langsung ke PostgreSQL (Port 5432) khusus untuk menjalankan skrip migrasi schema
DIRECT_URL="postgres://user:password@aws-db.supabase.com:5432/postgres"
```

---

### 4.6 Siklus Hidup Migrasi: `db push` vs `migrate dev` vs `migrate deploy`

Mahasiswa sering bingung memilih perintah Prisma CLI:

1. **`prisma db push`**:
   - **Kapan digunakan?** Hanya di tahap prototyping awal / eksplorasi cepat di komputer lokal.
   - **Cara kerja:** Langsung mengubah struktur database lokal tanpa mencatat riwayat file migrasi SQL.
   - ⚠️ **BAHAYA:** Jangan pernah gunakan `db push` di database staging atau produksi, karena berisiko menghapus kolom dan memusnahkan data produksi!
2. **`prisma migrate dev --name init_schema`**:
   - **Kapan digunakan?** Saat development di komputer lokal.
   - **Cara kerja:** Membandingkan `schema.prisma` dengan database lokal, membuat file migrasi `.sql` baru di folder `prisma/migrations/`, lalu menjalankannya secara lokal.
3. **`prisma migrate deploy`**:
   - **Kapan digunakan?** Di pipeline CI/CD produksi (misal saat proses build deployment Vercel/Docker).
   - **Cara kerja:** Hanya mengeksekusi file-file migrasi `.sql` yang belum pernah dijalankan di database produksi, tanpa pernah menyentuh atau me-reset data yang sudah ada.

---

## 5. LATIHAN TERBIMBING & TUGAS MANDIRI

### Latihan Terbimbing: Membuat Query Data Agregasi Berkecepatan Tinggi

Mari kita buat Server Component untuk menampilkan profil ringkas pengajar beserta statistik total modul yang sudah dibuatnya:

```tsx
// src/app/lecturers/[id]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LecturerProfilePage({ params }: PageProps) {
  const { id } = await params;

  const lecturer = await db.user.findUnique({
    where: { id, role: "LECTURER" },
    select: {
      name: true,
      email: true,
      coursesTaught: {
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              modules: true,
              enrollments: true,
            },
          },
        },
      },
    },
  });

  if (!lecturer) {
    notFound();
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">{lecturer.name}</h1>
      <p className="text-muted-foreground">{lecturer.email}</p>

      <h2 className="text-xl font-semibold mt-6">Daftar Kursus yang Diampu:</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {lecturer.coursesTaught.map((course) => (
          <div key={course.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-bold">{course.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {course._count.modules} Modul • {course._count.enrollments} Siswa Terdaftar
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Tugas Mandiri: Membangun Sistem Publikasi Modul dengan Validasi Kepemilikan (Ownership Check)

**Deskripsi Tugas:**  
Bangun fungsi Server Action `publishModule(moduleId: string)` untuk platform Velqora dengan spesifikasi:
1. Pastikan pengguna yang sedang login memiliki sesi yang valid dan berstatus sebagai `LECTURER` atau `ADMIN`.
2. Lakukan pengecekan kepemilikan (*Ownership Verification*): Pastikan bahwa kursus yang menaungi modul tersebut benar-benar dibuat oleh Dosen yang bersangkutan (kecuali jika role-nya adalah `ADMIN`). Dosen dilarang mempublikasikan modul milik dosen lain!
3. Jika lolos validasi, ubah kolom `isPublished` pada modul tersebut menjadi `true`.
4. Jika modul tersebut adalah modul pertama yang dipublikasikan pada kursus yang bersangkutan, secara otomatis ubah status `Course` dari `DRAFT` menjadi `PUBLISHED` di dalam transaksi yang sama (`$transaction`).
5. Lakukan `revalidatePath` agar halaman katalog kursus menampilkan status terbaru secara instan.

---

## 6. STUDI KASUS NYATA: CRASH BLACK FRIDAY PADA PLATFORM TIKET AKIBAT CONNECTION EXHAUSTION

### Latar Belakang Insiden
Sebuah platform penjualan tiket konser musik ternama di Asia Tenggara bersiap menghadapi penjualan tiket puncak pada pukul 12.00 siang. Server front-end dibangun menggunakan Next.js yang di-deploy ke kluster kontainer auto-scaling di Google Cloud Run, terhubung ke database PostgreSQL (spesifikasi 16 vCPU, 64 GB RAM) di Google Cloud SQL.

### Kronologi Kegagalan
- **Pukul 11.59:** Trafik normal, database menerima sekitar 80 koneksi aktif.
- **Pukul 12.00:** Tiket dibuka. Dalam 60 detik, trafik melonjak dari 1.000 menjadi 85.000 pengguna bersamaan (*concurrent users*).
- **Pukul 12.01:** Auto-scaler Cloud Run merespons lonjakan trafik dengan menaikkan jumlah kontainer dari 5 instance menjadi 320 instance secara simultan.
- **Pukul 12.02 (Bencana Terjadi):** Masing-masing kontainer Next.js menginisialisasi koneksi langsung ke PostgreSQL. Batas maksimal koneksi database (`max_connections = 400`) terlampaui seketika.
- **Dampak:** Database mengalami *System Out of Memory (OOM)* karena setiap koneksi di PostgreSQL mengonsumsi alokasi RAM proses tersendiri (`work_mem`). Seluruh endpoint aplikasi mengalami error `500 Internal Server Error`, dan platform mati total selama 45 menit di saat potensi omzet penjualan mencapai miliaran rupiah.

### Evaluasi & Solusi Pasca-Insiden
1. **Penerapan PgBouncer:** Tim arsitektur memasang PgBouncer di depan Cloud SQL dengan mode transaksi (*Transaction Pooling*).
2. **Efisiensi Hasil:** Sebanyak 400 kontainer Next.js kini berbagi (*multiplex*) hanya 25 koneksi TCP nyata ke PostgreSQL. Query diproses secara antrean mikro-detik tanpa membebani memori database.
3. **Hasil Uji Beban:** Saat penjualan tiket gelombang kedua, sistem berhasil melayani 120.000 concurrent users dengan utilisasi CPU database hanya berada di kisaran 35%.

---

## 7. REFLEKSI & JEBAKAN MENTAL

> **Jebakan Mental:** *"Karena saya sudah pakai ORM canggih, saya tidak perlu lagi belajar SQL atau cara kerja indeks database."*

Ini adalah ilusi berbahaya yang sering menjerumuskan developer muda. ORM bukanlah pengganti pemahaman database; ORM hanyalah **penerjemah sintaksis**. 

Jika Anda tidak mengerti konsep indeks database:
- Anda akan membiarkan tabel berisi 1 juta baris melakukan *Full Table Scan* setiap kali ada pencarian nama pengguna.
- Anda tidak akan paham mengapa query yang tampak sederhana di kode TypeScript ternyata menghasilkan query SQL `JOIN` mengerikan yang lambat di database.
- Saat terjadi kebuntuan (*Deadlock*) pada transaksi concurrent tingkat tinggi, ORM tidak bisa menyelamatkan Anda jika Anda tidak paham level isolasi transaksi SQL.

Pelajarilah perintah `EXPLAIN ANALYZE` di PostgreSQL. Pahami bagaimana database membaca data di piringan disk (*disk page reading*). Developer yang menguasai database di tingkat fundamental akan selalu dihargai jauh lebih tinggi di industri daripada mereka yang hanya tahu memanggil fungsi pustaka.

---

## 8. EVALUASI & KUIS PEMAHAMAN

### Soal 1
Mengapa dalam arsitektur Next.js App Router yang berjalan di serverless environment, inisialisasi Prisma Client harus dibungkus menggunakan pattern global singleton (`globalThis.prisma`)?
- A. Agar data di database terenkripsi otomatis dengan standar militer.
- B. Untuk mencegah pembuatan instance Prisma Client baru secara berulang pada setiap siklus Fast Refresh development, yang dapat menyebabkan batas koneksi database terlampaui (*connection leak*).
- C. Karena TypeScript melarang pembuatan variabel di dalam file `db.ts`.
- D. Agar query database bisa dijalankan di peramban pengguna tanpa internet.

### Soal 2
Perhatikan potongan kode berikut:
```typescript
const students = await db.user.findMany({ take: 50 });
for (const student of students) {
  const profile = await db.profile.findUnique({ where: { userId: student.id } });
}
```
Masalah performa arsitektural apa yang sedang terjadi pada kode di atas?
- A. Memory Leak akibat array mutability.
- B. N+1 Query Problem, di mana aplikasi mengeksekusi 1 query untuk mengambil daftar siswa, diikuti oleh 50 query tambahan secara berulang ke database.
- C. Deadlock transaksi akibat race condition.
- D. SQL Injection melalui variable interpolation.

### Soal 3
Bagaimana cara yang paling tepat dan efisien untuk mengatasi masalah pada Soal 2 menggunakan fitur bawaan Prisma?
- A. Menambah memori RAM server database menjadi 128 GB.
- B. Menggunakan operator `include` atau `select` langsung pada query awal (`db.user.findMany({ take: 50, include: { profile: true } })`).
- C. Membagi loop for menjadi dua thread menggunakan Web Workers.
- D. Mengubah tipe data primary key menjadi integer auto-increment.

### Soal 4
Kapan kita wajib menggunakan transaksi database atomik (`db.$transaction`) dalam pengembangan aplikasi web?
- A. Setiap kali kita menampilkan data statis di halaman utama.
- B. Hanya saat pengguna menekan tombol logout.
- C. Ketika sebuah alur bisnis melibatkan serangkaian operasi mutasi (Create, Update, Delete) pada beberapa tabel yang saling bergantung dan harus berhasil secara keseluruhan atau dibatalkan sama sekali jika salah satu operasi gagal.
- D. Saat kita ingin mengubah nama file komponen React.

### Soal 5
Pada file `schema.prisma`, apa dampak arsitektural dari menambahkan anotasi `@@index([userId])` pada model `Enrollment`?
- A. Membuat kolom userId tidak boleh memiliki nilai duplikat.
- B. Menginstruksikan PostgreSQL untuk membuat struktur data pohon pencarian (B-Tree index) pada kolom userId, mempercepat query pencarian dan join secara drastis pada tabel bervolume besar.
- C. Menghapus data pendaftaran secara otomatis setelah 30 hari.
- D. Mengubah tipe data userId menjadi format Base64.

### Soal 6
Dalam pipeline deployment aplikasi ke lingkungan produksi (seperti Vercel atau Docker container), perintah Prisma CLI manakah yang seharusnya dieksekusi untuk menerapkan perubahan skema database?
- A. `prisma db push`
- B. `prisma migrate dev`
- C. `prisma migrate deploy`
- D. `prisma studio`

### Soal 7
Apa fungsi utama dari arsitektur *Connection Pooling* (seperti PgBouncer) ketika aplikasi Next.js di-deploy pada infrastruktur serverless?
- A. Mengompresi ukuran gambar sebelum disimpan ke tabel database.
- B. Bertindak sebagai perantara cerdas yang mengantre dan membagikan (*multiplexing*) sejumlah kecil koneksi persisten ke database fisik di antara ratusan fungsi serverless sementara, mencegah database kehabisan batas koneksi (*Connection Exhaustion*).
- C. Menggantikan seluruh tabel relasional menjadi format NoSQL JSON document.
- D. Menyembunyikan password database dari administrator server.

---

### Kunci Jawaban & Pembahasan Mendalam

- **Soal 1: B**  
  *Pembahasan:* Di mode development, Fast Refresh me-reload file modul berulang kali. Tanpa menyimpannya di `globalThis`, setiap reload menginstansiasi koneksi Prisma baru yang tidak ditutup, menghabiskan alokasi socket koneksi database lokal dengan cepat.
- **Soal 2: B**  
  *Pembahasan:* Pola query di dalam perulangan (`for/map`) adalah manifestasi klasik dari N+1 Query. Satu query pertama mengambil daftar induk, lalu N query berikutnya ditembakkan secara beruntun untuk masing-masing anak, menimbulkan network latency round-trip yang masif.
- **Soal 3: B**  
  *Pembahasan:* Prisma menyediakan eager loading via `include` atau `select`. Di balik layar, Prisma mengoptimalkannya menjadi satu query SQL dengan klausa `LEFT JOIN` atau batch query dengan klausa `IN (...)`, memangkas puluhan network call menjadi seminimal mungkin.
- **Soal 4: C**  
  *Pembahasan:* Transaksi menjamin prinsip *Atomicity* (A dalam ACID). Jika proses transfer poin, perubahan status kelas, atau pembuatan invoice gagal di tengah jalan, seluruh mutasi sebelumnya dibatalkan (*rollback*), mencegah kondisi data anomali atau data "setengah matang".
- **Soal 5: B**  
  *Pembahasan:* Indeks membuat penunjuk pencarian terurut (biasanya B-Tree). Tanpa indeks, database harus memindai setiap baris dari atas sampai bawah (*Sequential / Full Table Scan*), yang kecepatannya anjlok drastis dari O(log N) menjadi O(N) saat data mencapai ratusan ribu baris.
- **Soal 6: C**  
  *Pembahasan:* `prisma migrate deploy` dirancang murni untuk lingkungan CI/CD dan produksi. Perintah ini hanya mengeksekusi file migrasi yang pending tanpa mencoba membuat migrasi baru atau men-trigger prompt interaktif yang dapat mematikan build process.
- **Soal 7: B**  
  *Pembahasan:* Serverless function bersifat efemeral dan berskala masif secara tiba-tiba. Setiap instance membuka koneksi TCP. PostgreSQL memiliki alokasi memori proses per-koneksi yang terbatas. PgBouncer mengantre permintaan tersebut dan meneruskannya melalui koneksi yang telah ada secara teratur.

---

## 9. REFERENSI & BACAAN LANJUTAN

1. **Prisma Official Documentation**: [https://www.prisma.io/docs](https://www.prisma.io/docs) — Panduan komprehensif mengenai schema modeling, relations, filtering, dan migrasi.
2. **PostgreSQL Documentation - Indexing Strategies**: [https://www.postgresql.org/docs/current/indexes.html](https://www.postgresql.org/docs/current/indexes.html) — Panduan resmi cara kerja B-Tree, Hash, GIN, dan GiST index di PostgreSQL.
3. **Use The Index, Luke!**: [https://use-the-index-luke.com/](https://use-the-index-luke.com/) — Sumber edukasi legendaris tentang optimasi performa query SQL untuk developer aplikasi.
4. **Prisma Serverless Connection Management**: [https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections) — Panduan konfigurasi connection pooling dan penanganan timeout pada arsitektur edge/serverless.
5. **Martin Fowler - Patterns of Enterprise Application Architecture (ORM & Unit of Work)**: Analisis teoretis mengenai abstraksi Object-Relational dan pola transaksi.
