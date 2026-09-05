# MODUL 12: DEPLOYMENT PRODUKSI, DOCKER CONTAINERIZATION, & CI/CD PIPELINE

> **Mata Kuliah:** Pengembangan Aplikasi Web Modern  
> **Target Audiens:** Mahasiswa S1 Informatika / Sistem Informasi (Semester 3)  
> **Alokasi Waktu:** 3 SKS (150 Menit Tatap Muka + 180 Menit Praktikum Mandiri)  
> **Prasyarat:** Modul 01 s/d Modul 11 (Seluruh Siklus Pengembangan Aplikasi Web)  
> **Penyusun:** Senior Full-stack Engineer & Dosen Praktisi  

---

## 1. RINGKASAN MODUL & RELEVANSI INDUSTRI

Ada sebuah lelucon klasik di kalangan software engineer:  
Seorang developer junior melapor ke pimpinannya, *"Pak, kodenya berjalan lancar kok di laptop saya!"*  
Pimpinannya menjawab datar, *"Bagus kalau begitu. Sekarang kita kemas laptopmu dan kita kirimkan langsung ke meja klien kita!"*

Kalimat *"It works on my machine"* adalah simbol kegagalan rekayasa perangkat lunak. Di dunia industri, kode yang hanya bisa berjalan di laptop pembuatnya memiliki nilai **NOL**. Aplikasi web harus mampu berjalan secara konsisten, stabil, dan dapat diprediksi di lingkungan apa pun: baik di server pengujian (Staging), di cloud serverless, maupun di kluster server produksi yang melayani jutaan pengguna.

Perbedaan versi Node.js di server, perbedaan sistem operasi (laptop Anda macOS/Windows sementara server menggunakan Linux Alpine), dependensi sistem yang belum terpasang, hingga konfigurasi variabel lingkungan yang keliru adalah sumber frustrasi terbesar saat proses rilis manual.

Di modul pamungkas ini, kita akan melengkapi keahlian Anda menjadi seorang **Full-stack Engineer seutuhnya**. Kita akan mengemas aplikasi web modern kita menggunakan teknologi kontainerisasi standar industri: **Docker** dengan teknik **Multi-Stage Build** yang mampu memangkas ukuran image dari **1.5 GB menjadi hanya ~100 MB**. Kita akan memahami demarkasi ketat manajemen rahasia (*Secrets Management*), merancang pipeline otomatisasi **CI/CD (Continuous Integration / Continuous Deployment)** menggunakan **GitHub Actions**, serta menerapkan mekanisme **Health Check** untuk menjamin ketersediaan sistem tanpa *downtime* (*Zero-Downtime Deployment*).

---

## 2. CAPAIAN PEMBELAJARAN MODUL (CPM)

Setelah menyelesaikan modul dan praktikum ini, mahasiswa diharapkan mampu:

1. **Mengevaluasi Strategi Hosting**: Memilih antara platform PaaS terkelola (Vercel) dan infrastruktur kontainer mandiri (*Self-hosted Container*) berdasarkan skala biaya, kepatuhan data (*compliance*), dan fleksibilitas arsitektur.
2. **Mengonfigurasi Next.js Standalone Output**: Mengoptimalkan hasil build Next.js 15 agar hanya mengekstraksi dependensi minimal yang diperlukan untuk server produksi.
3. **Membangun Docker Image Multi-Stage yang Aman**: Menulis `Dockerfile` produksi yang menerapkan prinsip isolasi layer, *least privilege* (menjalankan kontainer sebagai non-root user `nextjs`), dan pemanfaatan cache dependency.
4. **Menerapkan Manajemen Variabel Lingkungan Tingkat Tinggi**: Memisahkan secara tegas antara konfigurasi *build-time*, rahasia runtime server-only, dan variabel publik client-side (`NEXT_PUBLIC_`).
5. **Membangun Pipeline Otomatisasi CI/CD dengan GitHub Actions**: Mengotomatiskan tahapan linting, type-checking, automated testing, dan verifikasi build pada setiap Pull Request untuk mencegah terjadinya *broken code* di branch utama.

---

## 3. PRASYARAT & PENGETAHUAN AWAL

Sebelum mempelajari modul ini, Anda harus telah menguasai:
- Seluruh materi dari **Modul 01 hingga 11** (arsitektur web, database, autentikasi, dan testing).
- Perintah dasar Terminal / Shell Linux (`ls`, `cd`, `mkdir`, `cat`, `curl`, `chmod`).
- Sistem kendali versi Git: commit, branch, merge, dan pull request.
- Pengetahuan konseptual tentang virtualisasi dan arsitektur jaringan client-server.

---

## 4. MATERI INTI & CATATAN LAPANGAN DOSEN

### 4.1 Pilihan Arsitektur Hosting Modern: PaaS vs Docker Container

Ketika aplikasi Anda siap diluncurkan, tim engineering dihadapkan pada dua jalur arsitektur utama:

```
+--------------------------+-----------------------------------+-----------------------------------+
| Parameter Evaluasi       | PaaS Terkelola (Vercel / Netlify) | Container Mandiri (Docker / VPS)  |
+--------------------------+-----------------------------------+-----------------------------------+
| Kecepatan Setup          | ⚡ Instan (Tinggal hubungkan Git)  | 🛠️ Perlu setup Docker & Linux Server|
| Biaya Awal (Low Traffic) | 🟢 Gratis / Murah ($20/bulan)     | 🟡 Relatif stabil ($5 - $20 VPS)  |
| Biaya Skala Besar        | 🔴 Sangat Mahal (Bandwidth &      | 🟢 Sangat Efisien & Terprediksi   |
|                          |    Execution Time Mark-up tinggi) |    (Bisa hemat 70-80% biaya cloud)|
| Kontrol Infrastruktur    | ❌ Terbatas (Black-box serverless)| ✅ Penuh (Bebas pasang PgBouncer, |
|                          |                                   |    Redis, VPN, kustom firewall)   |
| Kepatuhan Data (UU PDP)  | ⚠️ Server di luar negeri sering   | ✅ Bebas memilih datacenter lokal |
|                          |    menabrak regulasi perbankan    |    (misal: Jakarta / ID Cloud)    |
+--------------------------+-----------------------------------+-----------------------------------+
```

> **Catatan Lapangan Dosen:** Jika Anda membangun MVP (Minimum Viable Product) untuk menguji pasar dalam 1 bulan, gunakan Vercel. Namun, jika Anda bekerja di korporasi, institusi pemerintah, startup dengan data sensitif, atau aplikasi yang memiliki trafik stabil dan tinggi, **menguasai Docker adalah kewajiban mutlak**. Docker membebaskan Anda dari belenggu *Vendor Lock-in*: image Docker Anda bisa berjalan di AWS ECS, Google Cloud Run, Azure, Kubernetes, atau VPS DigitalOcean seharga $10/bulan.

---

### 4.2 Mengaktifkan Next.js Standalone Build

Secara default, folder `node_modules` sebuah proyek Next.js modern bisa berukuran **800 MB hingga 1.5 GB**. Jika Anda menyalin seluruh folder ini ke dalam Docker image produksi, image Anda akan menjadi lambat diunduh (*slow image pulling*), memboroskan disk server, dan memperlambat proses deployment otomatis.

Next.js memiliki fitur bawaan revolusioner bernama **Output Standalone**:

```typescript
// next.config.ts
import type { NextConfig } from "nextConfig";

const nextConfig: NextConfig = {
  // Menginstruksikan Next.js untuk secara otomatis melacak seluruh import file
  // dan hanya mengemas dependensi yang BENAR-BENAR digunakan ke dalam folder mandiri!
  output: "standalone",
};

export default nextConfig;
```

Saat Anda menjalankan `npm run build`, Next.js akan memproduksi folder di `.next/standalone`. Folder ini berisi server Node.js minimalis lengkap dengan file-file yang dibutuhkannya. Ukuran file yang perlu dijalankan di produksi menyusut drastis menjadi hanya **~40 MB**!

---

### 4.3 Anatomi Dockerfile Multi-Stage Build Produksi

Mari kita bedah file `Dockerfile` standar produksi enterprise yang dirancang khusus untuk Next.js 15:

```dockerfile
# ==============================================================================
# TAHAP 1: Base Image & Pemasangan Dependensi
# ==============================================================================
FROM node:20-alpine AS deps
# Periksa https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# libc6-compat diperlukan oleh beberapa binary package di Alpine Linux
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Salin hanya package manifest untuk memanfaatkan caching Docker Layer
COPY package.json package-lock.json ./
RUN npm ci

# ==============================================================================
# TAHAP 2: Kompilasi & Build Kode Sumber
# ==============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Nonaktifkan telemetri Next.js saat build untuk privasi dan kecepatan
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Jalankan prisma generate sebelum build jika menggunakan ORM
# RUN npx prisma generate

RUN npm run build

# ==============================================================================
# TAHAP 3: Image Runner Produksi Ultra-Ramping
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# KEAMANAN: Jangan pernah menjalankan aplikasi sebagai user ROOT di kontainer!
# Buat user dan group khusus dengan hak akses terbatas (Least Privilege)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin aset statis publik
COPY --from=builder /app/public ./public

# Berikan izin yang tepat untuk cache Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Salin bundle standalone dan aset statis hasil kompilasi
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Gunakan user non-root
USER nextjs

# Port aplikasi
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Jalankan server Node.js mandiri hasil kompilasi Next.js
CMD ["node", "server.js"]
```

#### File `.dockerignore` (Wajib Ada!):
Sama seperti `.gitignore`, file ini mencegah Docker menyalin sampah lokal ke dalam image:
```
node_modules
.next
.git
.env*.local
npm-debug.log
Dockerfile
.dockerignore
```

---

### 4.4 Manajemen Variabel Lingkungan & Rahasia (*Secrets Management*)

Banyak developer pemula mengalami insiden kebocoran kredensial karena tidak memahami perbedaan mendasar dua jenis environment variables di Next.js:

```
+-------------------------------+-----------------------------------+-----------------------------------+
| Kategori                      | Build-Time / Public Variables     | Runtime / Secret Server Variables |
+-------------------------------+-----------------------------------+-----------------------------------+
| Prefix Penamaan               | NEXT_PUBLIC_...                   | Tanpa prefix (misal: DATABASE_URL)|
| Lokasi Ketersediaan           | Tersedia di Server & Browser      | HANYA TERSEDIA DI SERVER (Node.js)|
| Waktu Pembekuan (Baking)      | Dibekukan ke file JS saat BUILD!  | Dibaca secara dinamis saat SERVER |
|                               | (Jika diubah, wajib build ulang!) | RUNNING (Cukup restart container) |
| Tingkat Keamanan              | ⚠️ PUBLIK! Siapa pun bisa membaca | 🔒 RAHASIA TINGGI! Terlindungi di |
|                               | di DevTools -> Network/Sources    | memory server environment         |
| Contoh Kasus                  | NEXT_PUBLIC_APP_NAME,             | DATABASE_URL, SESSION_SECRET,     |
|                               | NEXT_PUBLIC_STRIPE_PUBLIC_KEY     | STRIPE_SECRET_KEY, AWS_SECRET_KEY |
+-------------------------------+-----------------------------------+-----------------------------------+
```

> **Hukum Besi Keamanan Dosen:**  
> Jangan pernah menambahkan prefix `NEXT_PUBLIC_` pada database password, secret token, atau private key kriptografi! Nilai tersebut akan disuntikkan secara mentah ke dalam file JavaScript publik yang dapat diunduh dan dibaca oleh siapa pun di muka bumi.

---

### 4.5 Otomatisasi CI/CD Pipeline dengan GitHub Actions

**Continuous Integration (CI)** adalah praktik otomatisasi di mana setiap kali ada developer yang membuat *Pull Request (PR)* ke branch `main`, server otomatis akan menyalakan mesin virtual, mengunduh kode tersebut, dan menjalankan serangkaian tes kelayakan:

```
Developer Buka PR ===> [ GitHub Actions Runner ]
                              |
                              |-- 1. Jalankan Linter (ESLint)
                              |-- 2. Jalankan Type-Check (tsc --noEmit)
                              |-- 3. Jalankan Automated Tests (Vitest)
                              |-- 4. Uji Kompilasi Build (next build)
                              |
                              v
                   Apakah Semua Lulus?
                    /               \
                  ✅                 ❌
               LULUS               GAGAL
        PR Boleh Di-Merge    PR Otomatis Diblokir!
                             (Mencegah server rusak)
```

Mari kita buat konfigurasi pipeline CI di proyek Anda:

```yaml
# .github/workflows/ci.yml
name: Continuous Integration (CI) Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  verify:
    name: Lint, TypeCheck, & Automated Test
    runs-on: ubuntu-latest

    steps:
      # 1. Unduh kode sumber dari repositori
      - name: Checkout Code
        uses: actions/checkout@v4

      # 2. Pasang Node.js dengan caching package manager
      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      # 3. Pasang dependensi secara bersih (clean install)
      - name: Install Dependencies
        run: npm ci

      # 4. Verifikasi Linter (Gaya Penulisan Kode)
      - name: Run ESLint
        run: npm run lint

      # 5. Verifikasi Type Safety (TypeScript)
      - name: Run Type Check
        run: npx tsc --noEmit

      # 6. Jalankan Unit & Integration Tests
      - name: Run Vitest Suite
        run: npm run test:run

      # 7. Verifikasi Bahwa Aplikasi Bisa Di-Build Tanpa Error
      - name: Verify Production Build
        run: npm run build
        env:
          # Berikan dummy secret saat proses build verifikasi
          SESSION_SECRET: "dummy_secret_key_minimum_32_characters_for_ci_build"
          DATABASE_URL: "postgresql://ci_dummy:ci_dummy@localhost:5432/ci_db"
```

---

### 4.6 Health Check & Zero-Downtime Deployment

Ketika Anda memperbarui kontainer aplikasi di server produksi, bagaimana *load balancer* atau orkestrator kontainer tahu bahwa kontainer baru sudah siap menerima trafik dan kontainer lama boleh dimatikan?

Jika trafik langsung dialihkan sebelum server Node.js selesai *booting*, pengguna Anda akan disambut pesan `502 Bad Gateway`.

Kita membutuhkan **Health Check Endpoint**:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic"; // Jangan pernah di-cache statis!

export async function GET() {
  try {
    // 1. Verifikasi koneksi ke database fisik via query ringan
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Database unreachable",
        timestamp: new Date().toISOString(),
      },
      { status: 503 } // Service Unavailable
    );
  }
}
```

Orkestrator Docker (seperti Docker Compose atau Kubernetes) akan mengecek endpoint `/api/health` ini setiap 10 detik. Jika endpoint merespon dengan `200 OK`, barulah trafik diarahkan ke kontainer baru secara mulus tanpa *downtime* sedetik pun.

---

### 4.7 Catatan Lapangan Dosen & Perangkap Kritis

#### Perangkap 1: Menjalankan Kontainer sebagai `root` User
Secara default, jika Anda tidak menambahkan perintah `USER nextjs` di Dockerfile, aplikasi Anda akan berjalan dengan hak akses **root (administrator tertinggi)**. Jika terjadi celah keamanan seperti *Remote Code Execution (RCE)* pada salah satu pustaka npm Anda, penyerang dapat mengambil alih kendali penuh atas sistem operasi host dan membobol server Anda (*Container Breakout*). **Selalu jalankan aplikasi produksi dengan user terbatas non-root.**

#### Perangkap 2: Menyimpan Rahasia di Docker Image Layer
Perhatikan kesalahan fatal ini:
```dockerfile
# ❌ SANGAT BERBAHAYA!
ENV DATABASE_URL="postgresql://admin:PasswordRahasiaBanget@db.prod.com/db"
```
Meskipun Anda menghapus baris tersebut di layer berikutnya, variabel tersebut **tetap tersimpan selamanya di dalam riwayat metadata image Docker**. Siapa pun yang memiliki akses ke image dapat menjalankan perintah `docker history <image-id>` dan membaca password database Anda dengan mudah! Masukkan rahasia selalu melalui **Runtime Environment Flags** (`docker run -e DATABASE_URL=...`) atau Docker Secrets.

---

## 5. LATIHAN TERBIMBING & TUGAS MANDIRI

### Latihan Terbimbing: Menjalankan Kontainer Next.js di Komputer Lokal

1. Pastikan Docker Desktop telah berjalan di komputer Anda.
2. Build image lokal:
   ```bash
   docker build -t velqora-web:latest .
   ```
3. Periksa ukuran image hasil build:
   ```bash
   docker images velqora-web:latest
   # Perhatikan: Ukurannya ramping (~100-140 MB), bukan 1.5 GB!
   ```
4. Jalankan kontainer dengan mengoper environment variable:
   ```bash
   docker run -p 3000:3000 \
     -e SESSION_SECRET="kunci_rahasia_lokal_pengujian_minimal_32_karakter" \
     -e DATABASE_URL="postgresql://user:pass@host.docker.internal:5432/velqora" \
     --name velqora-app velqora-web:latest
   ```
5. Buka peramban di `http://localhost:3000/api/health` untuk memverifikasi kontainer beroperasi sehat.

---

### Tugas Mandiri: Merancang Docker Compose untuk Arsitektur Full-Stack Lokal

**Deskripsi Tugas:**  
Buat file `docker-compose.yml` di root proyek Velqora yang mampu menyalakan seluruh ekosistem aplikasi secara simultan hanya dengan satu perintah `docker compose up`:
1. **Layanan 1 (`web`):** Kontainer Next.js yang dibangun dari `Dockerfile` Anda.
2. **Layanan 2 (`db`):** Kontainer PostgreSQL versi 16 berbasis Alpine Linux dengan persistensi volume (`postgres_data`).
3. **Layanan 3 (`pgadmin` atau `adminer`):** Alat visualisasi database berbasis web.
4. Hubungkan seluruh layanan tersebut di dalam satu Docker internal network (`velqora-network`).
5. Buat instruksi dokumentasi ringkas di file `README-DEPLOYMENT.md` mengenai cara me-reset database dan menyalakan kontainer dari awal.

---

## 6. STUDI KASUS NYATA: KEBOCORAN $40,000 KREDENSIAL AWS DARI PUBLIC DOCKER IMAGE

### Latar Belakang Insiden
Sebuah startup platform teknologi edukasi di Jakarta mengalami tagihan tak wajar dari Amazon Web Services (AWS) pada akhir bulan: biaya komputasi yang biasanya hanya $200 melonjak menjadi **$41,250** dalam 48 jam! Ratusan instans komputasi GPU berukuran raksasa menyala di region Frankfurt dan Virginia untuk menambang mata uang kripto ilegal.

### Hasil Investigasi Keamanan Forensik
1. Seorang developer pemula diminta untuk mengunggah image Docker aplikasi ke repositori publik di Docker Hub agar rekan timnya di remote-office bisa mengunduh dan mencobanya dengan mudah.
2. Developer tersebut membuat file `.env` di komputernya yang berisi `AWS_ACCESS_KEY_ID` dan `AWS_SECRET_ACCESS_KEY` dengan hak akses Administrator tertinggi (*Full IAM Access*).
3. Saat menulis `Dockerfile`, ia menyalin seluruh file menggunakan `COPY . .` **tanpa membuat file `.dockerignore`**.
4. File `.env` lokal ikut tersalin ke dalam image Docker. Bot peretas otomatis yang memindai Docker Hub publik setiap detik mendeteksi file kredensial tersebut hanya dalam waktu 7 menit setelah image di-push ke publik!
5. Bot tersebut langsung menggunakan API AWS untuk memicu ratusan server spot-instances berbiaya tinggi sebelum tim menyadari apa yang terjadi.

### Pelajaran Sangat Berharga
- **`.dockerignore` bukanlah opsional:** Ia adalah baris pertahanan pertama agar file rahasia lokal tidak pernah menembus batas kontainer.
- **Prinsip Least Privilege pada IAM:** Jangan pernah memberikan hak akses root/administrator pada key yang digunakan oleh aplikasi; berikan hanya hak akses minimal yang dibutuhkan.
- **Kredensial tidak boleh ada di file:** Gunakan layanan rahasia cloud seperti AWS Secrets Manager, HashiCorp Vault, atau GitHub Encrypted Secrets.

---

## 7. REFLEKSI & JEBAKAN MENTAL

> **Jebakan Mental:** *"Tugas saya sebagai pengembang web hanyalah menulis kode JavaScript dan CSS. Urusan server, kontainer, dan deployment adalah tugas orang DevOps / SysAdmin."*

Garis pemisah kaku antara "Developer" dan "Operations" sudah runtuh sejak satu dekade lalu. Konsep **DevOps (Developer Operations)** lahir karena developer yang tidak memahami lingkungan produksi akan selalu menulis kode yang rapuh:
- Mereka tidak peduli dengan konsumsi RAM di server.
- Mereka tidak paham mengapa koneksi database bisa bocor (*leak*).
- Mereka tidak tahu bagaimana aplikasi mereka menangani sinyal terminasi sistem (`SIGTERM`).

Seorang engineer yang memahami siklus hidup aplikasinya dari baris kode pertama di editor teks hingga bagaimana paket data TCP mengalir di dalam kontainer Linux produksi adalah sosok profesional yang sangat langka, sangat disegani di tim, dan memiliki nilai pasar yang luar biasa tinggi di industri teknologi global.

---

## 8. EVALUASI & KUIS PEMAHAMAN

### Soal 1
Apa fungsi teknis utama dari opsi konfigurasi `output: "standalone"` pada file `next.config.ts` saat mempersiapkan deployment berbasis Docker?
- A. Mengubah seluruh aplikasi Next.js menjadi format file desktop `.exe`.
- B. Mengharuskan aplikasi berjalan tanpa membutuhkan koneksi internet sama sekali.
- C. Menginstruksikan kompilator Next.js untuk menganalisis pohon ketergantungan kode secara statis dan hanya menyalin modul `node_modules` minimal yang benar-benar digunakan ke dalam folder mandiri, memangkas ukuran image Docker produksi secara drastis.
- D. Menghapus database PostgreSQL secara otomatis saat build selesai.

### Soal 2
Dalam teknik *Docker Multi-Stage Build*, apa tujuan memisahkan tahap `deps`, `builder`, dan `runner` ke dalam blok image yang berbeda?
- A. Agar developer bisa memainkan game saat proses kompilasi berlangsung.
- B. Memaksimalkan efisiensi Docker layer caching dan memastikan bahwa dependensi build yang berat (seperti devDependencies, kompilator TypeScript, dan source code mentah) tidak ikut terbawa ke dalam image kontainer final yang dikirim ke server produksi.
- C. Karena Docker membatasi satu file hanya boleh memiliki maksimal 10 baris kode.
- D. Mengubah format sistem operasi Linux menjadi Windows Server.

### Soal 3
Mengapa sangat berbahaya meletakkan environment variable sensitif seperti `DATABASE_PASSWORD` dengan prefix `NEXT_PUBLIC_DATABASE_PASSWORD`?
- A. Karena prefix `NEXT_PUBLIC_` membuat database menolak koneksi dari Next.js.
- B. Karena Next.js secara otomatis menyuntikkan semua variabel ber-prefix `NEXT_PUBLIC_` ke dalam bundle JavaScript publik di sisi client, sehingga password database dapat dibaca dengan mudah oleh siapa saja melalui DevTools browser.
- C. Karena huruf kapital pada prefix melanggar konvensi penamaan Linux.
- D. Karena Next.js akan membatalkan proses build.

### Soal 4
Mengapa pada tahap `runner` di `Dockerfile` produksi kita menambahkan perintah `USER nextjs` dan tidak menggunakan user default `root`?
- A. Karena sistem operasi Linux melarang user root menjalankan Node.js.
- B. Sebagai penerapan prinsip keamanan *Least Privilege*, membatasi kerusakan sistem host jika terjadi eksploitasi celah keamanan (seperti Container Breakout atau Remote Code Execution) pada aplikasi.
- C. Agar font tulisan di peramban menjadi lebih halus.
- D. User `nextjs` mempercepat kecepatan internet server sebanyak dua kali lipat.

### Soal 5
Apa tujuan utama dari tahapan pengujian otomatis di pipeline CI GitHub Actions sebelum mengizinkan sebuah *Pull Request* di-merge ke branch `main`?
- A. Menghitung jumlah jam kerja developer secara otomatis untuk penggajian.
- B. Mencegah regresi dan memastikan bahwa perubahan kode baru tidak merusak sistem yang sudah ada dengan memverifikasi linting, type-safety, unit tests, dan kesuksesan proses build secara terisolasi.
- C. Menghapus branch milik developer lain secara acak.
- D. Mengunggah foto profil developer ke repositori publik.

### Soal 6
Bagaimana cara kerja endpoint `/api/health` dalam mendukung arsitektur *Zero-Downtime Deployment* pada kluster kontainer?
- A. Endpoint ini mengirimkan email ucapan selamat kepada seluruh pengguna setiap kali ada update baru.
- B. Endpoint ini menyediakan probe kesehatan (health probe) bagi load balancer untuk memverifikasi bahwa kontainer baru sudah siap sepenuhnya (termasuk koneksi database aktif) sebelum load balancer mengalihkan trafik pengguna dari kontainer lama ke kontainer baru.
- C. Endpoint ini menghapus cache peramban pengguna secara paksa.
- D. Endpoint ini mengukur suhu fisik CPU di datacenter penyedia hosting.

### Soal 7
Apa fungsi dari file `.dockerignore` dalam proyek pengembangan aplikasi web?
- A. Memberitahu Docker agar tidak memeriksa lisensi sistem operasi.
- B. Mencegah file lokal yang sensitif (`.env`), file temporer, atau direktori berukuran masif (`node_modules`, `.next`) ikut tersalin ke dalam konteks build Docker, menjaga image tetap bersih, ramping, dan aman dari kebocoran data.
- C. Menghentikan Docker agar tidak menggunakan kartu grafis komputer.
- D. Mematikan fitur auto-complete pada editor teks.

---

### Kunci Jawaban & Pembahasan Mendalam

- **Soal 1: C**  
  *Pembahasan:* Output standalone memanfaatkan tracing dependensi bawaan Next.js. Alih-alih menyalin folder `node_modules` utuh yang berukuran ratusan megabyte, ia hanya mengekstraksi file-file JavaScript yang secara riil diimpor oleh halaman dan API Anda, menghasilkan server minimal siap pakai.
- **Soal 2: B**  
  *Pembahasan:* Multi-stage build mengisolasi siklus hidup pembuatan software. Lapisan build yang membutuhkan tool kompilasi dibuang di akhir proses, sehingga image produksi akhir hanya berisi artefak biner murni yang sangat kecil dan aman.
- **Soal 3: B**  
  *Pembahasan:* Variabel `NEXT_PUBLIC_` di-inline (*hardcoded*) ke dalam file JavaScript statis browser saat perintah `next build` dijalankan. Variabel ini menjadi teks biasa yang bisa diinspeksi oleh siapa pun yang membuka tab Network browser.
- **Soal 4: B**  
  *Pembahasan:* Menjalankan proses kontainer sebagai `root` adalah anti-pattern keamanan terbesar. Jika hacker menemukan celah eksekusi kode di server, hak akses yang ia dapatkan adalah hak akses root yang berpotensi membahayakan seluruh server induk.
- **Soal 5: B**  
  *Pembahasan:* CI pipeline bertindak sebagai pos penjagaan otomatis (*quality gate*). Kode yang menyebabkan error kompilasi TypeScript atau gagal pada salah satu unit test tidak akan pernah bisa lolos masuk ke basis kode utama.
- **Soal 6: B**  
  *Pembahasan:* Health check memungkinkan transisi mulus (*rolling update*). Kontainer versi lama tidak akan dimatikan sampai kontainer versi baru merespons status `healthy` pada endpoint `/api/health`.
- **Soal 7: B**  
  *Pembahasan:* Tanpa `.dockerignore`, perintah `COPY . .` akan mengirim seluruh isi direktori lokal ke daemon Docker, termasuk file `.env.local` yang berisi password asli dan folder `.next` lokal yang dapat merusak kompilasi di dalam kontainer.

---

## 9. REFERENSI & BACAAN LANJUTAN

1. **Next.js Official Deployment Guide (Docker Standalone)**: [https://nextjs.org/docs/app/building-your-application/deploying#docker-image](https://nextjs.org/docs/app/building-your-application/deploying#docker-image) — Dokumentasi dan contoh resmi Dockerfile multi-stage Next.js.
2. **Docker Best Practices for Node.js Applications**: [https://github.com/goldbergyoni/nodebestpractices#1-code-style-practices](https://github.com/goldbergyoni/nodebestpractices) — Panduan komprehensif penanganan process signals, non-root user, dan optimasi kontainer Node.js.
3. **GitHub Actions Workflow Documentation**: [https://docs.github.com/en/actions](https://docs.github.com/en/actions) — Panduan resmi pembuatan alur otomatisasi CI/CD, caching, dan branch protection.
4. **The Twelve-Factor App Methodology**: [https://12factor.net/](https://12factor.net/) — Prinsip emas arsitektur aplikasi cloud-native modern (konfigurasi via environment, stateless processes, port binding).
5. **OWASP Docker Security Cheat Sheet**: [https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html) — Panduan mitigasi kerentanan keamanan pada kontainer Docker produksi.
