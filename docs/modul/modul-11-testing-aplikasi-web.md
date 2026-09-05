# MODUL 11: STRATEGI TESTING APLIKASI WEB MODERN

> **Mata Kuliah:** Pengembangan Aplikasi Web Modern  
> **Target Audiens:** Mahasiswa S1 Informatika / Sistem Informasi (Semester 3)  
> **Alokasi Waktu:** 3 SKS (150 Menit Tatap Muka + 180 Menit Praktikum Mandiri)  
> **Prasyarat:** Modul 03 (Asynchronous JavaScript), Modul 04 (Komponen & State React), Modul 06 (Server Actions)  
> **Penyusun:** Senior Full-stack Engineer & Dosen Praktisi  

---

## 1. RINGKASAN MODUL & RELEVANSI INDUSTRI

Bayangkan skenario berikut yang sering terjadi di tim pengembang pemula: Anda baru saja menambahkan sebuah fitur kecil di halaman profil pengguna. Anda mengujinya secara manual dengan membuka browser, mengklik tombol profil, mengisi form, dan berhasil. Merasa bangga, Anda melakukan `git push` dan men-deploy-nya ke server produksi. Tiga puluh menit kemudian, manajer produk Anda berteriak di grup chat: *"Kenapa halaman checkout pembelian macet? Pengguna tidak bisa membayar!"*

Setelah ditelusuri dengan panik selama dua jam, ternyata perubahan kecil pada helper fungsi yang Anda ubah di halaman profil secara tidak sengaja mematahkan format data yang digunakan oleh modul pembayaran. Skenario horor ini disebut **Regresi (Regression)**: penambahan fitur baru atau perbaikan bug yang secara tidak sadar merusak fungsionalitas sistem yang sebelumnya sudah berjalan dengan baik.

Di era rilis cepat (*continuous deployment*) di mana perusahaan teknologi memperbarui kode produksi belasan hingga puluhan kali sehari, mengandalkan **pengujian manual (manual clicking)** adalah resep menuju bunuh diri karir. Manusia mudah lelah, mudah terdistraksi, dan tidak memiliki kapasitas untuk menguji ulang 500 alur fitur aplikasi setiap kali ada satu baris kode yang berubah.

Modul ini akan membimbing Anda membangun **Jaring Pengaman Otomatis (Automated Safety Net)**. Kita akan mengadopsi filosofi **Testing Trophy**, meninggalkan kebiasaan menguji implementasi internal (*implementation details*), menguasai **Vitest** sebagai test runner berkecepatan tinggi, memanfaatkan **React Testing Library (RTL)** untuk pengujian integrasi berorientasi pengguna, mengisolasi jaringan dengan **Mock Service Worker (MSW)**, dan merancang pengujian **End-to-End (E2E)** berbasis browser nyata menggunakan **Playwright**.

---

## 2. CAPAIAN PEMBELAJARAN MODUL (CPM)

Setelah menyelesaikan modul dan praktikum ini, mahasiswa diharapkan mampu:

1. **Menganalisis Tingkatan Pengujian (The Testing Trophy)**: Memilih proporsi pengujian yang optimal antara Static Typing, Unit Tests, Integration Tests, dan End-to-End Tests berdasarkan trade-off antara kecepatan eksekusi, biaya perawatan, dan tingkat keyakinan (*confidence score*).
2. **Mengeksekusi Unit Test Berkecepatan Tinggi dengan Vitest**: Menulis pengujian logika bisnis terisolasi, fungsi transformasi data, dan validasi skema dengan waktu eksekusi sub-detik.
3. **Menguasai Filosofi React Testing Library**: Menguji komponen UI dari perspektif pengguna akhir menggunakan query berbasis aksesibilitas (WAI-ARIA roles, labels) dan pustaka `@testing-library/user-event`.
4. **Mencegat Lalu Lintas Jaringan via Mock Service Worker (MSW)**: Mengisolasi dependensi API eksternal di lapisan jaringan tanpa mengotori kode produksi dengan mock yang rapuh.
5. **Membangun Alur Pengujian Kritis E2E dengan Playwright**: Merancang skenario pengujian browser nyata yang menguji alur multi-halaman (login, pengisian form kompleks, verifikasi persistensi database) secara otomatis di berbagai mesin peramban (Chromium, Firefox, WebKit).

---

## 3. PRASYARAT & PENGETAHUAN AWAL

Sebelum mempelajari modul ini, Anda diasumsikan telah memahami:
- Asynchronous testing dengan `async/await` dan Promise dari **Modul 03**.
- Siklus hidup komponen React, interaksi form, dan event handler dari **Modul 04**.
- Struktur perutean Next.js App Router dan Server Actions dari **Modul 05 & 06**.
- Konsep dasar baris perintah (CLI) untuk menjalankan script pengujian (`npm test`).

---

## 4. MATERI INTI & CATATAN LAPANGAN DOSEN

### 4.1 Filosofi Testing Modern: Dari Piramida ke "Testing Trophy"

Selama bertahun-tahun, dunia akademik mengajarkan **Testing Pyramid** klasik: dasar piramida yang sangat lebar diisi oleh ribuan Unit Tests, sedikit Integration Tests di tengah, dan puncak yang sangat tipis untuk E2E Tests.

Namun, di era modern pengembangan aplikasi web berbasis komponen (React), arsitektur piramida klasik sering kali gagal. Mengapa? Karena ribuan unit test yang menguji fungsi-fungsi kecil secara terisolasi sering kali **gagal mendeteksi apakah komponen-komponen tersebut bekerja dengan benar saat dirangkai bersama!** Anda bisa memiliki 100 unit test yang semuanya berwarna hijau (lulus), namun ketika tombol diklik di browser, halaman tetap rusak karena interaksi event atau state context tidak sinkron.

Industri modern mengadopsi model **The Testing Trophy** yang dipopulerkan oleh Kent C. Dodds:

```
        /\
       /  \        End-to-End (Playwright)
      / E2E\       -> Sedikit, menguji alur bisnis paling kritis (Login -> Checkout)
     /------\
    /        \     INTEGRATION (React Testing Library + Vitest)
   /  INTEG   \    -> PORSI TERBESAR! Menguji gabungan beberapa komponen & state
  /------------\
 /     UNIT     \  Unit Tests (Vitest)
/----------------\ -> Fungsi kalkulasi murni, helper matematika, parser data
|     STATIC     | Static Analysis (TypeScript, ESLint)
+----------------+ -> Menangkap typo dan type error sebelum kode dijalankan
```

#### Prinsip Emas Testing Library:
> *"The more your tests resemble the way your software is used, the more confidence they can give you."*  
> (Semakin mirip cara pengujian Anda dengan cara pengguna nyata memakai software Anda, semakin besar keyakinan yang Anda dapatkan.)

---

### 4.2 Mengapa Vitest Menggantikan Jest?

Selama hampir satu dekade, **Jest** adalah standar de facto pengujian JavaScript. Namun di era modern, Jest menjadi sumber frustrasi besar bagi pengembang:
- Konfigurasi TypeScript dan ECMAScript Modules (ESM) yang sangat rumit via Babel atau `ts-jest`.
- Eksekusi yang lambat karena Jest tidak memanfaatkan arsitektur bundler modern.
- Duplikasi konfigurasi: Anda harus mengonfigurasi bundler build (Vite/Next) dan mengonfigurasi ulang transformasi compiler untuk Jest secara terpisah.

**Vitest** hadir sebagai standar baru:
- Dibangun di atas arsitektur **Vite** yang menggunakan *native ES modules* dan kompilator berkecepatan tinggi.
- Menggunakan konfigurasi yang sama persis dengan aplikasi Anda.
- Mendukung fitur modern seperti Instant Watch Mode, multithreading via worker threads, dan kompatibilitas API 1:1 dengan Jest (`expect`, `describe`, `it`, `vi.fn`).

---

### 4.3 Unit Testing Logika Bisnis dengan Vitest

Unit test paling efektif digunakan untuk menguji **Pure Functions** (fungsi tanpa side-effect yang selalu menghasilkan output yang sama untuk input yang sama). 

Contoh: Fungsi penghitung kelulusan mahasiswa pada modul Velqora:

```typescript
// src/lib/grading.ts
export interface GradeItem {
  score: number;
  weight: number; // Nilai desimal (misal 0.3 untuk bobot 30%)
}

export function calculateFinalScore(grades: GradeItem[]): number {
  if (grades.length === 0) return 0;

  const totalWeight = grades.reduce((acc, curr) => acc + curr.weight, 0);
  if (Math.abs(totalWeight - 1.0) > 0.001) {
    throw new Error("Total bobot nilai harus berjumlah tepat 100% (1.0).");
  }

  const weightedSum = grades.reduce((acc, curr) => {
    if (curr.score < 0 || curr.score > 100) {
      throw new Error(`Skor tidak valid: ${curr.score}. Harus di antara 0 dan 100.`);
    }
    return acc + curr.score * curr.weight;
  }, 0);

  return Math.round(weightedSum * 100) / 100;
}
```

Mari kita uji fungsi di atas secara menyeluruh dengan Vitest:

```typescript
// src/lib/grading.test.ts
import { describe, it, expect } from "vitest";
import { calculateFinalScore, type GradeItem } from "./grading";

describe("calculateFinalScore", () => {
  it("harus menghitung nilai akhir berbobot dengan benar", () => {
    const grades: GradeItem[] = [
      { score: 80, weight: 0.3 },  // Tugas: 24
      { score: 90, weight: 0.3 },  // UTS: 27
      { score: 85, weight: 0.4 },  // UAS: 34
    ];

    const finalScore = calculateFinalScore(grades);
    expect(finalScore).toBe(85);
  });

  it("harus melemparkan error jika total bobot tidak sama dengan 1.0", () => {
    const invalidGrades: GradeItem[] = [
      { score: 80, weight: 0.5 },
      { score: 70, weight: 0.3 }, // Total hanya 0.8 (80%)
    ];

    expect(() => calculateFinalScore(invalidGrades)).toThrowError(
      "Total bobot nilai harus berjumlah tepat 100% (1.0)."
    );
  });

  it("harus melemparkan error jika ada skor di luar rentang 0 - 100", () => {
    const outOfBoundsGrades: GradeItem[] = [
      { score: 105, weight: 0.5 }, // Skor di atas 100
      { score: 80, weight: 0.5 },
    ];

    expect(() => calculateFinalScore(outOfBoundsGrades)).toThrowError(
      "Skor tidak valid: 105. Harus di antara 0 dan 100."
    );
  });

  it("harus mengembalikan 0 jika array nilai kosong", () => {
    expect(calculateFinalScore([])).toBe(0);
  });
});
```

---

### 4.4 Integration Testing Komponen dengan React Testing Library

Kesalahan terbesar developer saat menguji komponen React adalah menguji **detail implementasi internal**:
- ❌ Mengecek nama state lokal komponen (`expect(wrapper.state('isOpen')).toBe(true)`).
- ❌ Mencari elemen berdasarkan class CSS internal (`container.querySelector('.btn-primary-blue-custom')`).

Mengapa dua hal di atas keliru? Karena pengguna aplikasi Anda tidak tahu apa nama state Anda dan tidak peduli apa class CSS Anda! Pengguna hanya melihat: *"Apakah ada tombol bertuliskan 'Daftar Kursus' di layar? Jika tombol itu saya klik, apakah muncul teks 'Pendaftaran Berhasil'?"*

Jika Anda menguji detail internal, saat Anda melakukan refactoring kode (misal mengganti nama variabel `isOpen` menjadi `isExpanded`), pengujian Anda akan langsung gagal (merah) meskipun tampilan dan perilaku aplikasi di mata pengguna sama sekali tidak rusak!

#### Hirarki Query React Testing Library (Wajib Dihafal!):

```
1. getByRole          ===> Standar Emas! (Cari berdasarkan elemen semantik W3C & Accessible Name)
                           Contoh: screen.getByRole("button", { name: /kirim/i })
2. getByLabelText     ===> Terbaik untuk input form
                           Contoh: screen.getByLabelText(/alamat email/i)
3. getByPlaceholderText=> Alternatif input form jika tidak ada tag label
4. getByText          ===> Bagus untuk elemen non-interaktif (paragraf, heading, div info)
5. getByTestId        ===> JALAN TERAKHIR! Gunakan HANYA jika tidak ada cara semantik lain
                           Contoh: screen.getByTestId("custom-svg-canvas")
```

#### Studi Kasus: Komponen Form Login

Mari kita bangun komponen form interaktif:

```tsx
// src/components/auth/login-form.tsx
"use client";

import * as React from "react";

interface LoginFormProps {
  onSubmit: (email: string) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Format alamat email tidak valid.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(email);
    } catch (err) {
      setError("Gagal melakukan login. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Formulir Masuk">
      <div>
        <label htmlFor="email-input">Alamat Email Mahasiswa</label>
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@kampus.ac.id"
          disabled={isSubmitting}
        />
      </div>

      {error && <p role="alert" className="text-red-500">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sedang Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
```

Sekarang tulis test suite pengujian integrasinya menggunakan `@testing-library/react` dan `@testing-library/user-event`:

```tsx
// src/components/auth/login-form.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { LoginForm } from "./login-form";

describe("<LoginForm /> Integration Test", () => {
  it("harus menampilkan pesan error jika format email tidak valid saat tombol submit ditekan", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    render(<LoginForm onSubmit={mockSubmit} />);

    // 1. Ketik email yang salah (tanpa karakter @)
    const emailInput = screen.getByLabelText(/alamat email mahasiswa/i);
    await user.type(emailInput, "email-tanpa-domain");

    // 2. Klik tombol Masuk
    const submitButton = screen.getByRole("button", { name: /masuk/i });
    await user.click(submitButton);

    // 3. Verifikasi: Pesan error muncul di layar & fungsi submit TIDAK dipanggil
    const alertMessage = await screen.findByRole("alert");
    expect(alertMessage).toHaveTextContent("Format alamat email tidak valid.");
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("harus memanggil onSubmit dengan email yang benar dan menampilkan status memuat", async () => {
    const user = userEvent.setup();
    // Buat mock promise yang tidak langsung selesai untuk menguji status loading
    let resolveLogin: () => void = () => {};
    const mockSubmit = vi.fn().mockImplementation(
      () => new Promise<void>((res) => { resolveLogin = res; })
    );

    render(<LoginForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/alamat email mahasiswa/i);
    await user.type(emailInput, "budi@kampus.ac.id");

    const submitButton = screen.getByRole("button", { name: /masuk/i });
    await user.click(submitButton);

    // Verifikasi fungsi dipanggil dengan parameter yang tepat
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith("budi@kampus.ac.id");

    // Tombol berubah teks dan ter-disable
    expect(screen.getByRole("button", { name: /sedang memproses/i })).toBeDisabled();
    expect(emailInput).toBeDisabled();

    // Selesaikan request
    resolveLogin();
  });
});
```

---

### 4.5 Mocking Jaringan dengan Mock Service Worker (MSW)

Ketika komponen Anda memanggil API eksternal via `fetch()`, banyak developer melakukan mock kotor:
```typescript
// ❌ MOCK KOTOR: Mengubah objek global fetch secara destruktif
global.fetch = vi.fn().mockResolvedValue({ json: () => ({ data: "ok" }) });
```
Mock seperti ini sangat rapuh: ia tidak menguji header HTTP, tidak menguji query params, dan sering bocor ke file pengujian lain (*test pollution*).

**Mock Service Worker (MSW)** adalah standar emas industri. MSW mencegat panggilan jaringan di tingkat soket Node.js (atau Service Worker di browser) tanpa mengubah satu baris pun kode aplikasi Anda!

```bash
npm install -D msw
```

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  // Intersepsi GET request ke endpoint kursus
  http.get("https://api.velqora.id/v1/courses", () => {
    return HttpResponse.json([
      { id: "c1", title: "Dasar Pemrograman Web", status: "PUBLISHED" },
      { id: "c2", title: "Arsitektur Next.js 15", status: "PUBLISHED" },
    ]);
  }),
];
```

---

### 4.6 End-to-End (E2E) Testing dengan Playwright

Unit test dan integration test berjalan di lingkungan peramban simulasi (JSDOM). JSDOM tidak memiliki layout engine nyata: ia tidak merender piksel di layar, tidak tahu apakah sebuah tombol tertutup oleh elemen modal transparan, dan tidak bisa menguji navigasi perutean multi-halaman di server nyata.

Di sinilah **Playwright** masuk. Playwright menyalakan browser Chromium, Firefox, dan WebKit (Safari) sungguhan secara otomatis dan mengendalikan kursor mouse, ketikan keyboard, serta tab navigasi persis seperti manusia!

```bash
npm init playwright@latest
```

Contoh Test Suite E2E untuk Alur Pendaftaran Kursus:

```typescript
// tests/e2e/course-enrollment.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Alur Kritis: Siswa Mendaftar Kursus", () => {
  test("Siswa dapat login, memilih kursus di katalog, dan berhasil mendaftar", async ({ page }) => {
    // 1. Kunjungi halaman login
    await page.goto("/login");

    // 2. Isi form kredensial
    await page.getByLabel("Email Mahasiswa").fill("mahasiswa.teladan@kampus.ac.id");
    await page.getByLabel("Kata Sandi").fill("RahasiaSuper123!");
    await page.getByRole("button", { name: "Masuk ke Akun" }).click();

    // 3. Verifikasi pengguna dialihkan ke halaman dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByRole("heading", { name: "Katalog Kursus Tersedia" })).toBeVisible();

    // 4. Pilih salah satu kursus
    const targetCard = page.locator("article").filter({ hasText: "Arsitektur Next.js 15" });
    await targetCard.getByRole("link", { name: "Lihat Detail" }).click();

    // 5. Pastikan berada di halaman detail kursus
    await expect(page).toHaveURL(/\/courses\/.+/);

    // 6. Klik tombol pendaftaran kursus
    const enrollButton = page.getByRole("button", { name: "Daftar Kursus Ini" });
    await enrollButton.click();

    // 7. Verifikasi muncul Toast notifikasi sukses dan status tombol berubah
    await expect(page.getByText("Selamat, Anda telah terdaftar!")).toBeVisible();
    await expect(page.getByRole("button", { name: "Lanjutkan Belajar" })).toBeVisible();
  });
});
```

---

### 4.7 Catatan Lapangan Dosen & Perangkap Umum

#### Perangkap 1: Ilusi "100% Code Coverage"
Banyak pimpinan proyek yang minim pengalaman teknis menetapkan aturan kaku: *"Semua pull request harus memiliki 100% test coverage!"* 

Developer akhirnya menulis ribuan test yang tidak bermutu demi mengejar metrik hijau:
- Menguji file konfigurasi `tailwind.config.js`.
- Menguji getter/setter sederhana.
- Menguji tipe data yang sudah dijamin oleh TypeScript.

**Fakta Lapangan:** Kode dengan coverage 100% tetap bisa mengalami crash fatal di produksi jika skenario pengujiannya tidak mencakup kasus batas (*edge cases*): bagaimana jika koneksi internet terputus di tengah proses pembayaran? Bagaimana jika pengguna mengklik tombol submit tiga kali dalam rentang 100 milidetik? **Kualitas skenario jauh lebih bernilai daripada persentase coverage**.

#### Perangkap 2: "Flaky Tests" (Test yang Kadang Lulus Kadang Gagal)
*Flaky test* adalah musuh nomor satu dari otomatisasi CI/CD. Biasanya disebabkan oleh jeda waktu sembarangan (`await new Promise(r => setTimeout(r, 2000))`). 

Di komputer lokal developer yang kencang, jeda 2 detik mungkin cukup; namun di server CI/CD (GitHub Actions) yang menggunakan mesin virtual bersama dengan beban CPU tinggi, proses membutuhkan waktu 2.5 detik dan test langsung gagal secara misterius!

**Solusi Wajib:** Jangan pernah menggunakan `setTimeout` di dalam test. Gunakan polling asinkron deklaratif:
- Di React Testing Library: `await screen.findByRole(...)` atau `await waitFor(...)`.
- Di Playwright: Web-first assertions seperti `await expect(locator).toBeVisible()` yang secara otomatis melakukan retry cerdas hingga elemen muncul.

---

## 5. LATIHAN TERBIMBING & TUGAS MANDIRI

### Latihan Terbimbing: Menulis Test Snapshot vs Semantic Assertion

1. Hindari membuat *Snapshot Test* raksasa (`expect(tree).toMatchSnapshot()`) untuk seluruh halaman karena setiap perubahan class CSS kecil akan membuat snapshot gagal dan developer cenderung me-refresh snapshot secara buta tanpa membaca perubahannya (`git commit -a`).
2. Buat assertion semantik yang spesifik:
   ```typescript
   // ✅ BAIK: Memeriksa state visual yang memiliki makna fungsional
   expect(screen.getByRole("button", { name: /hapus/i })).toHaveClass("bg-destructive");
   expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
   ```

---

### Tugas Mandiri: Membangun Test Suite Lengkap untuk Modul Kuis Velqora

**Deskripsi Tugas:**  
Bangun rangkaian pengujian otomatis untuk komponen kuis interaktif dengan ketentuan:
1. **Unit Test (Vitest):**
   - Buat fungsi validator jawaban kuis: `evaluateQuizSubmission(answers, answerKey)`.
   - Uji skenario: semua jawaban benar (skor 100), sebagian salah, dan kasus di mana siswa melewatkan beberapa pertanyaan tanpa menjawab.
2. **Integration Test (React Testing Library):**
   - Uji komponen `<QuizRunner />`.
   - Simulasikan pengguna memilih opsi radio button pada pertanyaan 1, mengklik tombol "Berikutnya", memilih opsi pada pertanyaan 2, dan menekan "Kirim Jawaban".
   - Pastikan skor akhir dan daftar rangkuman pembahasan tampil di layar setelah submit.
3. **E2E Test (Playwright):**
   - Jalankan alur kuis lengkap pada browser headless dan pastikan nilai tersimpan di database lokal.

---

## 6. STUDI KASUS NYATA: KEGAGALAN CHECKOUT 4 JAM PADA PLATFORM E-COMMERCE HARI GAJIAN

### Latar Belakang Masalah
Sebuah platform e-commerce fesyen bersiap menyambut festival diskon akhir bulan (*Payday Sale*) pada tanggal 25. Tim engineering memiliki metrik kebanggaan: **Test Coverage 92%** yang didominasi oleh ribuan unit test Jest.

### Hari Terjadinya Bencana
Pukul 00.01 tengah malam festival dimulai. Puluhan ribu pembeli memasukkan barang ke keranjang belanja dan menuju halaman pembayaran. Namun, angka penjualan tercatat **NOL RUPIAH** selama 4 jam pertama! Ratusan komplain membanjiri media sosial: tombol *"Bayar Sekarang"* di aplikasi web tidak bereaksi sama sekali saat diklik.

### Hasil Investigasi Forensik
1. Dua hari sebelum festival, seorang developer junior merapikan struktur komponen tombol dan menambahkan lapisan komponen tooltip pembungkus (`<TooltipWrapper>`).
2. Komponen tooltip tersebut ternyata secara tidak sengaja menambahkan gaya CSS `pointer-events: none` pada elemen tombol ketika atribut status tertentu tidak terpenuhi, sehingga tombol secara fisik **tidak bisa menerima klik kursor mouse**.
3. **Mengapa Unit Test Tidak Menangkap Bug Ini?**  
   Unit test pengembang tersebut hanya menguji:
   ```typescript
   // Test yang salah arah: Hanya menguji pemanggilan fungsi secara terisolasi!
   fireEvent.click(button);
   expect(onPayMock).toHaveBeenCalled();
   ```
   `fireEvent.click()` dari pustaka lama mengeksekusi event handler JavaScript langsung di memori tanpa mempedulikan apakah elemen tersebut tertutup elemen lain atau dinonaktifkan oleh CSS pointer-events!
4. **Apa yang Seharusnya Dilakukan?**  
   Jika tim menggunakan `@testing-library/user-event` atau **Playwright**, pustaka ini mensimulasikan peramban nyata: ia memeriksa apakah tombol dapat dijangkau kursor (*hit-testing*). Jika ada elemen penutup atau `pointer-events: none`, pengujian akan langsung melempar error: *"Element is not clickable at point (x, y)"* dan deployment otomatis akan dibatalkan seketika di pipeline CI!

---

## 7. REFLEKSI & JEBAKAN MENTAL

> **Jebakan Mental:** *"Menulis test membuat waktu pengerjaan proyek menjadi dua kali lebih lama. Saya tidak punya waktu untuk menulis test!"*

Ini adalah ilusi jangka pendek yang fatal. Mari kita hitung secara matematis:
- Menulis kode fitur: **3 jam**.
- Menulis pengujian otomatis yang andal: **2 jam**.
- **Total:** **5 jam**.

Sekarang bandingkan dengan skenario tanpa pengujian:
- Menulis kode fitur: **3 jam**.
- Menguji manual dengan klik-klik berulang setiap kali ada bug kecil: **2 jam**.
- Menangani bug regresi di produksi saat tengah malam: **6 jam**.
- Memperbaiki data pengguna yang rusak di database: **8 jam**.
- Kehilangan kepercayaan klien atau pengguna: **Tak ternilai harganya**.

Pengujian otomatis bukan memperlambat Anda; pengujian otomatis adalah satu-satunya cara bagi Anda untuk **bergerak cepat dengan aman (move fast with confidence)** seiring bertambahnya kompleksitas sistem.

---

## 8. EVALUASI & KUIS PEMAHAMAN

### Soal 1
Berdasarkan filosofi *The Testing Trophy*, mengapa porsi pengujian terbesar dianjurkan dialokasikan pada tingkat *Integration Tests* daripada ribuan *Unit Tests* yang sangat terisolasi?
- A. Karena Integration Tests lebih murah biaya servernya dibandingkan Unit Tests.
- B. Karena Integration Tests menguji bagaimana beberapa unit komponen dan state bekerja sama secara harmonis persis seperti yang dialami pengguna, memberikan tingkat keyakinan (*confidence*) yang jauh lebih tinggi terhadap keandalan fungsional aplikasi.
- C. Karena TypeScript melarang penulisan Unit Tests di file `.tsx`.
- D. Karena Unit Tests tidak bisa dijalankan di sistem operasi Linux.

### Soal 2
Perhatikan potongan pengujian React Testing Library berikut:
```typescript
// Opsi A:
const btn = container.querySelector(".btn-submit-blue");
// Opsi B:
const btn = screen.getByRole("button", { name: /kirim pendaftaran/i });
```
Mengapa Opsi B jauh lebih unggul dan direkomendasikan oleh standar industri dibandingkan Opsi A?
- A. Karena Opsi B mengeksekusi query lebih cepat 100 kali lipat di memori browser.
- B. Karena Opsi B menguji komponen dari perspektif pengguna dan standar aksesibilitas (WAI-ARIA), sehingga tidak rentan rusak jika terjadi perubahan nama class CSS internal selama refactoring.
- C. Karena Opsi A membutuhkan lisensi berbayar dari W3C.
- D. Karena Opsi B secara otomatis menghapus database setiap kali dijalankan.

### Soal 3
Apa perbedaan mendasar antara metode simulasi klik `fireEvent.click(button)` dan `await userEvent.click(button)` pada pengujian antarmuka React?
- A. `fireEvent` hanya bekerja untuk perangkat sentuh seluler.
- B. `fireEvent` memicu event JavaScript DOM secara langsung tanpa memeriksa apakah elemen tersebut terlihat, difokuskan, atau dapat diklik di layar nyata; sedangkan `userEvent` mensimulasikan interaksi peramban nyata secara lengkap (hover, focus, hit-testing kursor).
- C. `userEvent` adalah pustaka yang sudah ditinggalkan dan digantikan oleh jQuery.
- D. Tidak ada perbedaan teknis sama sekali.

### Soal 4
Apa keunggulan utama menggunakan pustaka *Mock Service Worker (MSW)* dibandingkan melakukan monkey-patching pada `global.fetch` saat menguji komponen yang memerlukan data jaringan?
- A. MSW mencegat permintaan HTTP di level jaringan (Service Worker / Node socket), sehingga kode produksi tidak perlu diubah atau disusupi logika testing buatan, dan format request/response diuji secara realistis.
- B. MSW secara otomatis membayar tagihan domain server pengembang.
- C. MSW hanya bisa digunakan untuk database MySQL.
- D. MSW mengubah seluruh file JSON menjadi file teks biasa.

### Soal 5
Apa yang dimaksud dengan fenomena *Flaky Tests* dalam eksekusi otomatisasi pengujian di pipeline CI/CD?
- A. Test yang gagal dikompilasi karena lisensi software habis.
- B. Test yang menunjukkan hasil tidak konsisten (terkadang berhasil hijau, terkadang gagal merah) pada basis kode yang sama persis tanpa adanya perubahan, biasanya dipicu oleh race condition, timeout arbitrer, atau urutan eksekusi asinkron yang rapuh.
- C. Test yang dijalankan pada komputer tablet.
- D. Test yang berhasil menemukan celah keamanan virus komputer.

### Soal 6
Dalam pengujian End-to-End menggunakan Playwright, locator manakah yang paling disarankan untuk memilih elemen input teks form yang memiliki label terkait?
- A. `page.locator('input[name="user_email_v2_final"]')`
- B. `page.getByLabel("Alamat Email")`
- C. `page.locator('div > div:nth-child(3) > input')`
- D. `page.locator('.form-control-input')`

### Soal 7
Mengapa strategi mengejar "100% Code Coverage" sering kali menjadi jebakan kontraproduktif bagi tim rekayasa perangkat lunak?
- A. Karena komputer server tidak memiliki hard disk yang cukup untuk menyimpan laporan coverage.
- B. Karena persentase coverage yang tinggi hanya mengukur apakah baris kode tertentu sempat dieksekusi oleh interpreter, bukan apakah pengujian tersebut memverifikasi perilaku benar sistem pada skenario ekstrem (*edge cases*) dan kegagalan jaringan nyata.
- C. Karena aturan GitHub melarang angka coverage di atas 80%.
- D. Karena 100% coverage akan memperlambat loading halaman di browser pengguna akhir secara permanen.

---

### Kunci Jawaban & Pembahasan Mendalam

- **Soal 1: B**  
  *Pembahasan:* Unit test menguji bagian terkecil secara terisolasi dengan banyak mocking. Jika bagian-bagian tersebut salah dihubungkan, unit test tetap lulus tetapi aplikasi nyata rusak. Integration testing menguji sinergi antar-komponen, memberikan nilai balik keyakinan (*confidence*) paling tinggi untuk biaya investasi penulisan test.
- **Soal 2: B**  
  *Pembahasan:* Mencari elemen via class name (`.btn-submit-blue`) mengikat pengujian pada detail presentasi visual. Saat styling diubah ke Tailwind utility, test akan rontok. Menggunakan `getByRole` menguji fungsi semantik tombol yang tidak akan terpengaruh oleh pergantian styling visual.
- **Soal 3: B**  
  *Pembahasan:* `fireEvent` bersifat sintetik dan kasar. `userEvent` meniru seluruh rentetan event mikro yang dipancarkan browser nyata saat pengguna mengarahkan mouse, menekan tombol mouse, menggeser fokus, hingga melepaskan klik.
- **Soal 4: A**  
  *Pembahasan:* Mengutak-atik `global.fetch` adalah anti-pattern yang berbahaya karena mengubah lingkungan runtime secara global. MSW bekerja di lapisan bawah jaringan, memperlakukan aplikasi seperti kotak hitam (*black-box*) yang berkomunikasi via protokol HTTP nyata.
- **Soal 5: B**  
  *Pembahasan:* Flaky test merusak kepercayaan tim pengembang terhadap pipeline otomatisasi. Ketika test gagal, developer cenderung menganggap "ah itu paling cuma flaky, re-run saja!" daripada menyelidiki bug regresi yang sebenarnya.
- **Soal 6: B**  
  *Pembahasan:* `getByLabel` mencerminkan bagaimana pengguna dan teknologi bantu (screen reader) mengidentifikasi kolom input. Menghindari selector CSS rapuh seperti `div:nth-child(3)` menjaga test tetap tahan banting terhadap perubahan layout.
- **Soal 7: B**  
  *Pembahasan:* Code coverage hanyalah indikator kuantitas baris yang tersentuh, bukan indikator kualitas pengujian. Sebuah baris kode bisa tercakup 100% tanpa adanya `expect()` assertion sama sekali di dalam test file.

---

## 9. REFERENSI & BACAAN LANJUTAN

1. **Testing Library Guiding Principles**: [https://testing-library.com/docs/guiding-principles](https://testing-library.com/docs/guiding-principles) — Filosofi dasar pengujian berpusat pada pengguna dan aksesibilitas.
2. **Vitest Official Documentation**: [https://vitest.dev/](https://vitest.dev/) — Panduan konfigurasi, mocking API, dan benchmark performa test runner modern.
3. **Playwright Best Practices**: [https://playwright.dev/docs/best-practices](https://playwright.dev/docs/best-practices) — Panduan resmi menulis End-to-End tests yang stabil, cepat, dan bebas flaky.
4. **Mock Service Worker (MSW) Docs**: [https://mswjs.io/docs/](https://mswjs.io/docs/) — Arsitektur intersepsi jaringan modern berbasis standar Service Worker dan Node.js.
5. **Martin Fowler - The Practical Test Pyramid**: Esai arsitektural klasik mengenai evolusi strategi pengujian perangkat lunak di industri enterprise.
