# Modul 07: Manajemen State Lanjutan: Compound Components, Context API vs Zustand

---

## 1. Overview & Pengantar

Kalian telah menguasai dua ranah data: state lokal komponen dengan `useState` (Modul 04) dan data server dengan Server Actions & RSC (Modul 06). Sekarang timbul pertanyaan arsitektur yang sering memecah belah tim pengembang: **bagaimana kita mengelola data di sisi klien yang harus dibagikan ke belasan komponen di lokasi yang berbeda?**

Contoh kasus nyata:
- Tombol di pojok kanan atas ingin mengetahui apakah sidebar di sisi kiri sedang ditutup atau dibuka.
- Komponen lencana (*badge*) keranjang belanja di navbar atas ingin menampilkan total jumlah barang yang dimasukkan oleh tombol di dalam kartu produk yang letaknya 6 level di bawah.
- Status tema tampilan (*Dark Mode* vs *Light Mode*) yang memengaruhi ratusan tombol dan teks di seluruh aplikasi.

Banyak mahasiswa yang langsung mengambil jalan pintas buruk: mengoper data secara berantai melewati lima lapis komponen yang sebenarnya tidak peduli pada data tersebut—sebuah penyakit arsitektur yang disebut **Props Drilling**.

Sebagian mahasiswa lain langsung menginstal Redux Toolkit dan menulis puluhan baris boilerplate rumit (*reducers*, *actions*, *dispatchers*, *selectors*) hanya untuk mengontrol status buka-tutup sebuah sidebar modal sederhana. Atau sebaliknya: memasukkan seluruh data aplikasi ke dalam satu **React Context** raksasa, yang berakibat fatal pada performa: setiap kali pengguna mengetik satu huruf di kolom input, seluruh halaman web ikut me-render ulang!

Di modul ketujuh ini, kita akan meluruskan paradigma manajemen state klien:
1. Membedah cara kerja **React Context API** yang benar beserta keterbatasan performanya.
2. Mempelajari pola arsitektur **Compound Components** untuk merancang komponen UI yang modular layaknya library profesional (Radix UI / Headless UI).
3. Menguasai **Zustand**—pustaka manajemen state global modern yang kini menjadi standar de facto di industri berkat keringanannya, ketiadaan boilerplate, dan selektor atomik yang super efisien.

---

## 2. Tujuan Pembelajaran

Setelah mempelajari modul ini dan menyelesaikan seluruh tugas praktiknya, kalian diharapkan mampu:

1. **Mendiagnosis dan mengeliminasi masalah *Props Drilling*** pada pohon hierarki komponen React.
2. **Merancang sistem Context API terisolasi** menggunakan pemisahan *State Context* dan *Dispatch Context* untuk mencegah *cascading re-renders*.
3. **Membangun komponen berbasis pola *Compound Components*** yang elegan dan fleksibel menggunakan React Context internal.
4. **Menerapkan pustaka Zustand** untuk membangun *global store* dengan selektor atomik (*atomic selectors*) dan middleware persistensi `localStorage`.
5. **Menentukan keputusan arsitektural yang tepat (*Decision Matrix*)** kapan harus menggunakan State Lokal, URL SearchParams, Context API, atau Zustand pada skenario dunia kerja riil.

---

## 3. Prasyarat Pengetahuan & Perangkat

- **Prasyarat Pengetahuan**:
  - Telah menyelesaikan **Modul 01 s.d. Modul 06**.
  - Menguasai dasar React Hooks (`useState`, `useCallback`, `useMemo`).
- **Perangkat Lunak**:
  - Proyek Next.js 15 berjalan lokal.
  - Package `zustand` terpasang di proyek: `npm install zustand`.

---

## 4. Konten Pembelajaran Utama

### 4.1 Petaka Props Drilling dan Anatomi React Context API

Mari kita lihat masalahnya secara visual:

```
[Komponen: HalamanDashboard] (Menyimpan state: theme = 'dark')
       |
       v
[Komponen: HeaderBar] (Tidak butuh theme, tapi dipaksa menerima props)
       |
       v
[Komponen: UserNav] (Tidak butuh theme, tapi dipaksa menerima props)
       |
       v
[Komponen: TombolModeGelap] (Akhirnya menerima props: theme)
```

Jika kalian harus mengoper props melewati 3 hingga 5 lapis komponen penengah yang tidak peduli pada data tersebut, itu adalah **Props Drilling**. Setiap kali bentuk data berubah, kalian harus mengubah antarmuka props di seluruh komponen perantara tersebut.

#### Solusi Bawaan: React Context API
React Context menyediakan mekanisme seperti "teleportasi data"—komponen induk menyediakan data (*Provider*), dan komponen anak di level kedalaman mana pun dapat langsung meminum data tersebut (*Consumer*) tanpa membebani komponen perantara.

```
       [ThemeContext.Provider value={theme, toggleTheme}]
                              |
       +----------------------+----------------------+
       |                      |                      |
       v                      v                      v
  [SidebarNav]           [ContentArea]        [TombolModeGelap]
(Langsung membaca)    (Tidak terbebani)      (Langsung membaca)
```

#### Pola Pembuatan Context Standar Industri yang Bersih
Jangan mengekspos `useContext` mentah ke komponen lain. Bungkus selalu dengan **Custom Hook** yang memiliki pengecekan keamanan:

```tsx
// src/context/ThemeContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// 1. Buat Context dengan nilai awal null
const ThemeContext = createContext<ThemeContextType | null>(null);

// 2. Buat Provider Komponen
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "dark bg-slate-900 text-white" : "bg-white text-slate-900"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// 3. Buat Custom Hook Akses Aman
export function useTheme() {
  const context = useContext(ThemeContext);
  
  // Guard Clause: Mencegah komponen memanggil hook di luar Provider-nya
  if (!context) {
    throw new Error("useTheme harus dipanggil di dalam <ThemeProvider>!");
  }
  
  return context;
}
```

Penggunaan di komponen anak menjadi sangat bersih dan elegan:
```tsx
// src/components/TombolTheme.tsx
"use client";
import { useTheme } from "@/context/ThemeContext";

export function TombolTheme() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      Ganti ke {theme === "light" ? "Mode Gelap 🌙" : "Mode Terang ☀️"}
    </button>
  );
}
```

---

### 4.2 Masalah Performa Tersembunyi pada Context API

Banyak mahasiswa menganggap Context API adalah pengganti Redux atau Zustand. **Ini kesalahpahaman fatal.**

Context API memiliki karakteristik mekanis bawaan React: **Setiap kali nilai `value` di dalam Provider berubah, SELURUH komponen yang mengonsumsi context tersebut (*consumer*) AKAN DI-RENDER ULANG, tanpa peduli apakah komponen tersebut menggunakan properti yang berubah atau tidak!**

```tsx
// ❌ CONTOH KESALAHAN BESAR (MEGA CONTEXT ANTI-PATTERN):
const AppContext = createContext({
  user: null,         // Jarang berubah
  theme: "light",     // Jarang berubah
  pesanBaruList: [],  // Berubah setiap 2 detik via WebSocket!
  inputPencarian: ""  // Berubah setiap kali pengguna mengetik satu huruf!
});
```
Jika pengguna mengetik 10 huruf di kolom pencarian:
- `inputPencarian` berubah 10 kali.
- `AppContext.Provider` mendapatkan objek `value` baru 10 kali.
- Komponen Header Profil, Sidebar Kuliah, dan Footer yang hanya butuh `user` dan `theme` **akan ikut di-render ulang 10 kali secara sia-sia!** Pada aplikasi kompleks, ini akan membuat animasi antarmuka patah-patah (*frame drop*).

**Aturan Emas Penggunaan Context API**:
Gunakan Context API HANYA untuk state yang:
1. Bersifat global berskala rendah (tema tampilan, preferensi bahasa, data pengguna login).
2. Memiliki **frekuensi perubahan sangat rendah** (tidak berubah setiap detik).

Jika kalian memiliki state dengan frekuensi perubahan tinggi (keranjang belanja, notifikasi real-time, form multi-step kompleks), gunakan **Zustand**.

---

### 4.3 Pola Arsitektur Compound Components

Pernahkah kalian melihat komponen HTML native `<select>` dan `<option>`?
```html
<select name="prodi">
  <option value="ti">Teknik Informatika</option>
  <option value="si">Sistem Informasi</option>
</select>
```
Kalian tidak perlu mengoper puluhan props rumit ke `<select>`. Kedua tag tersebut bekerja sama secara harmonis berbagi state internal tanpa mengorbankan fleksibilitas tata letak. Pola ini disebut **Compound Components**.

Mari kita bangun komponen **Accordion** modern menggunakan pola Compound Components di React:

```tsx
// src/components/Accordion.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

// Context Internal Komponen
interface AccordionContextType {
  openId: string | null;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

// 1. Komponen Induk: Accordion
export function Accordion({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ openId, toggleItem }}>
      <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// 2. Komponen Anak: AccordionItem
export function AccordionItem({ id, children }: { id: string; children: React.ReactNode }) {
  return <div className="p-4 bg-white">{children}</div>;
}

// 3. Komponen Anak: AccordionHeader
export function AccordionHeader({ id, title }: { id: string; title: string }) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("AccordionHeader harus di dalam Accordion!");

  const isOpen = context.openId === id;

  return (
    <button
      type="button"
      onClick={() => context.toggleItem(id)}
      className="flex justify-between items-center w-full font-bold text-left text-slate-800"
    >
      <span>{title}</span>
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
  );
}

// 4. Komponen Anak: AccordionContent
export function AccordionContent({ id, children }: { id: string; children: React.ReactNode }) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("AccordionContent harus di dalam Accordion!");

  if (context.openId !== id) return null;

  return <div className="pt-3 text-sm text-slate-600 leading-relaxed">{children}</div>;
}
```

Lihat betapa bersih dan deklaratifnya cara pengembang menggunakan komponen di atas:

```tsx
<Accordion>
  <AccordionItem id="silabus">
    <AccordionHeader id="silabus" title="Berapa SKS Mata Kuliah Ini?" />
    <AccordionContent id="silabus">
      Mata kuliah Pengembangan Web Modern berbobot 3 SKS teori dan 1 SKS praktikum.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem id="tugas">
    <AccordionHeader id="tugas" title="Apakah Ada Ujian Praktik?" />
    <AccordionContent id="tugas">
      Ya, evaluasi berupa proyek akhir pembuatan sistem aplikasi web full-stack.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### 4.4 Zustand: Standar Industri Manajemen State Global Modern

Di industri modern, **Zustand** (kata Jerman yang berarti *"State/Keadaan"*) menjadi pilihan utama para engineer karena:
1. **Zero Boilerplate**: Tidak butuh reducer bertele-tele, tidak butuh action creator.
2. **Tidak Perlu Provider Wrapping**: Tidak perlu membungkus `app/layout.tsx` dengan ribuan Provider bertingkat (*Provider Hell*).
3. **Atomic Selector**: Komponen HANYA me-render ulang jika bagian data spesifik yang dipilihnya benar-benar berubah!

#### Membangun Store Keranjang Belanja Modul dengan Zustand

```typescript
// src/store/useCartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ItemModul {
  id: string;
  judul: string;
  harga: number;
}

interface CartState {
  items: ItemModul[];
  // Actions:
  tambahItem: (item: ItemModul) => void;
  hapusItem: (id: string) => void;
  kosongkanKeranjang: () => void;
  // Computed Getter:
  hitungTotalHarga: () => number;
}

export const useCartStore = create<CartState>()(
  // Middleware persist: Menyimpan state secara otomatis ke localStorage!
  persist(
    (set, get) => ({
      items: [],

      tambahItem: (itemBaru) => {
        set((state) => {
          // Cegah duplikasi item
          const sudahAda = state.items.some((i) => i.id === itemBaru.id);
          if (sudahAda) return state;
          return { items: [...state.items, itemBaru] };
        });
      },

      hapusItem: (idTarget) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== idTarget),
        }));
      },

      kosongkanKeranjang: () => {
        set({ items: [] });
      },

      hitungTotalHarga: () => {
        return get().items.reduce((total, item) => total + item.harga, 0);
      },
    }),
    {
      name: "velqora-cart-storage", // Kunci penyimpanan di localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

#### Keajaiban Atomic Selector di Komponen Konsumen
Perhatikan bagaimana komponen di bawah **HANYA me-render ulang jika jumlah item berubah**, dan tidak peduli pada perubahan properti lainnya:

```tsx
// src/components/BadgeKeranjangNavbar.tsx
"use client";

import { useCartStore } from "@/store/useCartStore";

export function BadgeKeranjangNavbar() {
  // ✅ ATOMIC SELECTOR: Hanya subscribe pada panjang array items!
  // Jika isi judul item di dalam keranjang diubah, komponen ini TIDAK AKAN re-render!
  const totalItem = useCartStore((state) => state.items.length);

  return (
    <div className="relative flex items-center">
      <span>🛒 Keranjang</span>
      {totalItem > 0 && (
        <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
          {totalItem}
        </span>
      )}
    </div>
  );
}
```

---

### 4.5 Matriks Keputusan Praktisi: Di Mana Data Harus Disimpan?

Sebagai engineer senior, gunakan tabel hierarki ini saat memutuskan di mana sebuah data harus tinggal:

```
                                [DATA MASUK]
                                     |
                       Apakah data berasal dari DB?
                                /         \
                           (Ya)            (Tidak)
                           /                 \
             [Server Components / RSC]        Apakah data memengaruhi URL/Filter?
                                                     /         \
                                                (Ya)            (Tidak)
                                                /                 \
                                   [URL SearchParams]        Apakah hanya butuh 1 komponen?
                                                                    /         \
                                                               (Ya)            (Tidak)
                                                               /                 \
                                                       [useState lokal]    Apakah data frekuensi tinggi?
                                                                                   /         \
                                                                              (Ya)            (Tidak)
                                                                              /                 \
                                                                        [Zustand Store]     [React Context]
```

| Tingkat State | Alat Terbaik | Skenario Penggunaan Nyata |
| :--- | :--- | :--- |
| **Server State** | **Next.js Server Component** | Daftar modul dari database, detail nilai mahasiswa, data profil. |
| **URL State** | **`searchParams` (`?kategori=frontend&halaman=2`)** | Filter pencarian, nomor paginasi, tab aktif. Wajib bisa di-bookmark dan dibagikan lewat link! |
| **Local State** | **`useState` / `useReducer`** | Nilai input form yang sedang diketik, status modal terbuka/tutup lokal, toggle accordion. |
| **Global Rendah** | **React Context API** | Tema aplikasi (*Light/Dark*), preferensi bahasa terjemahan (*ID/EN*). |
| **Global Tinggi** | **Zustand** | Keranjang belanja, draf formulir multi-langkah (*multi-step wizard*), status notifikasi interaktif. |

---

### 4.6 Catatan dari Lapangan: Tiga Kesalahan Fatal Manajemen State

#### 1. Menyimpan State Server ke Dalam Global Store Klien
Dahulu saat memakai Redux, developer sering mengambil data materi dari backend lalu memasukkannya ke dalam `reduxStore.dispatch(setMateri(data))`.  
Di era Next.js 15, ini adalah **dosa arsitektur besar**. Data database harus tetap berada di Server Components! Memasukkan data server ke dalam store klien membuat kalian harus mengurus sinkronisasi cache, mutasi kadaluwarsa, dan pembengkakan bundle JavaScript klien tanpa alasan jelas.

#### 2. Lupa Selector di Zustand (Re-render Seluruh Komponen)
Banyak pemula menulis kode memanggil Zustand seperti ini:
```tsx
// ❌ SALAH BESAR: Memanggil seluruh store tanpa selektor!
const store = useCartStore(); 
```
Jika kalian menulis `const store = useCartStore()`, komponen kalian akan berlangganan (*subscribe*) ke **SELURUH** perubahan properti di dalam store tersebut, menghancurkan keunggulan performa selektor atomik Zustand.  
**Selalu gunakan selektor**: `const items = useCartStore(state => state.items);`.

#### 3. Masalah Hydration Mismatch pada `persist` Middleware
Ketika menggunakan `persist` Zustand yang membaca `localStorage`, nilai di server adalah nilai awal kosong (`items: []`), sedangkan di browser pengguna sudah ada data tersimpan di localStorage (`items: [A, B]`).  
Hal ini memicu peringatan klasik: `Hydration failed because the initial UI does not match what was rendered on the server`.  
**Solusi**: Pastikan komponen sudah me-mount di browser sebelum merender bagian yang membaca persistensi:
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return <Skeleton />;
```

---

## 5. Latihan & Tugas Praktik

### Latihan 1: Sistem Pengaturan Pengguna dengan Context API (Tingkat Dasar)

Bangun modul preferensi pengguna untuk portal Velqora:
1. Buat `SettingsContext.tsx` yang menyimpan:
   - `fontSize`: `"small"` | `"medium"` | `"large"`
   - `sidebarCollapsed`: `boolean`
2. Sediakan fungsi mutasi: `setFontSize(size)` dan `toggleSidebar()`.
3. Buat komponen `PanelPengaturan` yang memiliki tombol radio untuk memilih ukuran font dan tombol toggle sidebar.
4. Pastikan hook `useSettings()` melempar galat yang jelas jika dipanggil di luar Provider.

---

### Latihan 2: Toko Modul Belajar dengan Zustand & Persistensi (Tingkat Lanjutan)

Bangun store global `useBookmarkStore` untuk menandai modul favorit mahasiswa:
1. **Spesifikasi Store**:
   - `bookmarkedIds`: array of string (ID modul yang dibookmark).
   - `toggleBookmark(id: string)`: Jika ID sudah ada, hapus dari array; jika belum ada, tambahkan ke array.
   - `isBookmarked(id: string)`: Mengembalikan boolean status.
   - Aktifkan middleware `persist` agar bookmark tidak hilang saat tab browser ditutup.
2. **Komponen Antarmuka**:
   - `TombolBookmark`: Menerima prop `materiId`. Menampilkan ikon bintang kuning jika sudah dibookmark, dan bintang abu-abu jika belum.
   - `TotalBookmarkCounter`: Terletak di header, hanya membaca panjang array `bookmarkedIds` dengan atomic selector.

---

## 6. Studi Kasus Nyata

### Kasus: "Insiden Frame Rate Drop 12 FPS pada Formulir Registrasi Skripsi Akibat Mega Context"

#### Latar Belakang Masalah
Sebuah portal akademik perguruan tinggi meluncurkan fitur pendaftaran proposal skripsi daring yang berisi formulir panjang (50 kolom input teks, unggah berkas PDF, data dosen pembimbing, dan riwayat akademik).
Saat mahasiswa mengetik judul proposal skripsi di kolom input teks, terjadi keluhan massal: **ketikan terasa sangat lambat (*input lag*) dan pergerakan kursor melambat hingga kecepatan 12 frame per detik (FPS).**

#### Analisis Forensik Tim Engineering
Tim menemukan bahwa pengembang junior membungkus seluruh halaman formulir dengan satu Context tunggal:

```tsx
// ❌ KODE SUMBER PENYEBAB LAG KETIKAN:
export function FormSkripsiProvider({ children }) {
  const [formData, setFormData] = useState({
    judul: "",
    abstrak: "",
    dosenId: "",
    // ... 40 field lainnya
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormSkripsiContext.Provider value={{ formData, updateField }}>
      {children}
    </FormSkripsiContext.Provider>
  );
}
```

Ketika mahasiswa mengetik satu huruf di kolom `judul`:
1. `updateField("judul", "A")` dipanggil.
2. Objek `formData` baru dibuat di memori.
3. Seluruh 50 komponen input anak (termasuk komponen pemilih dosen yang memuat 300 data dosen) ikut me-render ulang seketika, meskipun 49 komponen lainnya sama sekali tidak berkepentingan dengan perubahan kolom judul!
4. React menghabiskan waktu 80 milidetik untuk setiap ketukan tombol keyboard untuk memvalidasi pohon Virtual DOM dari 50 komponen tersebut.

#### Solusi Transformasi Arsitektur
1. **Migrasi Form State ke Local Uncontrolled Form atau Form Library Terisolasi**:
   Menghentikan penarikan setiap ketukan tombol ke Context global. Kolom input judul dijadikan state lokal atau diisolasi menggunakan pustaka form berbasis ref (`React Hook Form`).
2. **Memindahkan Data Global yang Benar-Benar Butuh Akses Lintas-Komponen ke Zustand**:
   Data yang benar-benar dibagi (seperti daftar referensi dosen dan progress bar persentase kelengkapan formulir) dipindahkan ke Zustand store dengan selektor atomik. Komponen input judul tidak lagi memicu render ulang pada komponen pemilih dosen.
3. **Hasil Terukur**:
   - Waktu respons input keyboard anjlok dari 80ms ke **kurang dari 4ms (60 FPS stabil)**.
   - Beban render komponen terpangkas sebesar 92%.

---

## 7. Rangkuman Reflektif

Manajemen state di frontend adalah seni mengendalikan **kompleksitas dan performa**.

Jangan terjebak dalam dua kubu ekstrem:
- Jangan takut memakai state lokal. Jika sebuah data hanya relevan di dalam satu tombol atau satu kartu, biarkan data itu tinggal di `useState` lokal. Memaksa data lokal masuk ke store global adalah bentuk *over-engineering* yang sia-sia.
- Sebaliknya, jangan memaksakan Context API untuk data dinamis yang sering berubah. Pilihlah alat yang tepat untuk pekerjaan yang tepat: **Context API untuk nilai statis berfrekuensi rendah**, dan **Zustand untuk data dinamis terdistribusi tinggi**.

Di modul berikutnya (**Modul 08**), kita akan menyempurnakan keahlian antarmuka ini dengan masuk ke sistem styling standar industri: **Styling Modern dengan Tailwind CSS & Component Library (Radix UI / Shadcn UI)**.

---

## 8. Evaluasi & Kuis Pemahaman

### Pilihan Ganda

#### Soal 1
Perhatikan skenario berikut: Pada aplikasi dashboard Velqora, status *Dark Mode* diatur oleh sebuah tombol di navbar dan dibutuhkan oleh seluruh halaman aplikasi. Nilai tema hanya berubah sekali sehari saat pengguna mengganti setelan. Alat manajemen state manakah yang paling ideal dan proporsional untuk kebutuhan ini?
- A. Redux Toolkit dengan sepuluh boilerplate slice.
- B. React Context API yang dibungkus dengan Custom Hook aman.
- C. Menyimpan nilai di atribut HTML `data-theme` lalu membacanya via `document.querySelector` di setiap komponen.
- D. Mengoper nilai tema secara manual melalui props di 40 komponen (*Props Drilling*).

> **Kunci Jawaban: B**  
> **Pembahasan**: Context API dirancang khusus untuk data global dengan frekuensi perubahan sangat rendah seperti tema antarmuka dan bahasa lokal. Menggunakan Redux terlalu berlebihan (*overkill*), sedangkan Props Drilling merusak arsitektur kode.

---

#### Soal 2
Mengapa meletakkan state formulir yang berubah di setiap ketukan keyboard pengguna (seperti kolom pencarian waktu nyata) ke dalam satu Context API global bersama data pengguna dianggap sebagai anti-pattern performa?
- A. Karena Context API otomatis mematikan fungsi keyboard di browser.
- B. Karena setiap kali satu huruf diketik dan nilai context berubah, seluruh komponen yang mengonsumsi context tersebut akan dipaksa me-render ulang (*re-render cascade*), meskipun komponen tersebut tidak menggunakan nilai input pencarian tersebut.
- C. Karena Context API tidak kompatibel dengan event `onChange`.
- D. Karena Next.js akan melempar error kompilasi build.

> **Kunci Jawaban: B**  
> **Pembahasan**: Keterbatasan mekanis Context API adalah ketidakmampuannya melakukan re-render selektif pada level properti individual objek value. Jika objek value baru dibuat, semua subscriber akan me-render ulang.

---

#### Soal 3
Perhatikan penggunaan store Zustand berikut:
```tsx
function HeaderCounter() {
  const total = useTugasStore((state) => state.tugasList.length);
  return <div>Total Tugas: {total}</div>;
}
```
Apa keuntungan teknik penulisan `(state) => state.tugasList.length` di atas dibandingkan menulis `const { tugasList } = useTugasStore()`?
- A. Menghemat memori RAM server sebanyak 50%.
- B. Komponen `HeaderCounter` hanya akan me-render ulang jika nilai panjang array (*length*) berubah, dan TIDAK AKAN me-render ulang jika hanya isi teks salah satu tugas yang diedit.
- C. Kode tersebut otomatis mengonversi angka menjadi string.
- D. Agar data otomatis tersimpan di database PostgreSQL.

> **Kunci Jawaban: B**  
> **Pembahasan**: Ini adalah mekanisme *Atomic Selector* Zustand. Zustand membandingkan nilai kembalian dari fungsi selector menggunakan `Object.is()`. Jika nilai panjang array tetap sama (misal tetap 5), perubahan isi properti di dalam item array tidak akan memicu re-render pada komponen ini.

---

#### Soal 4
Pada pola arsitektur **Compound Components** (seperti komponen `<Tabs>`, `<Tabs.List>`, dan `<Tabs.Panel>`), bagaimana komponen-komponen anak yang terpisah tersebut saling mengetahui status tab mana yang sedang aktif tanpa pengembang harus mengoper props secara manual ke setiap elemen?
- A. Mereka menggunakan cookie browser untuk berkomunikasi.
- B. Komponen induk menyediakan state tab aktif melalui React Context internal yang dikonsumsi secara implisit oleh seluruh komponen anak di dalamnya.
- C. Mereka menggunakan event listener window global `window.addEventListener("tabChange")`.
- D. Next.js App Router secara otomatis menghubungkannya lewat URL.

> **Kunci Jawaban: B**  
> **Pembahasan**: Inti dari pola Compound Components adalah enkapsulasi state bersama di dalam Context internal komponen induk, sehingga komponen anak dapat mengakses dan memperbarui state aktif secara harmonis dan implisit.

---

#### Soal 5
Manakah dari jenis data berikut yang **seharusnya TIDAK disimpan** ke dalam global store klien (seperti Zustand atau Redux) di arsitektur Next.js 15 modern?
- A. Array daftar produk e-commerce mentah yang diambil langsung dari database server.
- B. Status keranjang belanja sementara pengguna yang belum disimpan ke database.
- C. Status apakah menu sidebar di layar ponsel sedang terbuka atau tertutup.
- D. Preferensi ukuran font yang dipilih pengguna di peramban.

> **Kunci Jawaban: A**  
> **Pembahasan**: Di Next.js App Router, data basis data mentah harus tetap berada di tingkat Server Components (*Server State*). Memasukkan data server ke dalam store klien adalah pola usang era SPA lama yang menyebabkan duplikasi state dan kerumitan sinkronisasi cache.

---

### Soal Analisis & Kasus

#### Soal 6
Jelaskan perbedaan mendasar antara **Server State**, **Client State**, dan **URL State**, serta berikan satu contoh konkret untuk masing-masing kategori dalam konteks portal perkuliahan Velqora!

> **Pembahasan Soal 6**:  
> 1. **Server State**: Data yang bersumber dan memiliki otoritas kebenaran di basis data server backend. Karakteristik: bersifat asinkron, perlu strategi caching/revalidasi, dan diakses via Server Components.  
>    *Contoh*: Daftar riwayat transkrip nilai mahasiswa, daftar jadwal kuliah resmi dari BAAK.  
> 2. **Client State**: Data sementara yang hanya hidup di memori browser pengguna selama sesi interaksi berlangsung. Tidak tersimpan di server secara permanen.  
>    *Contoh*: Status apakah modal dialog bantuan sedang terbuka, draf ketikan catatan yang belum ditekan tombol simpannya, state toggle accordion.  
> 3. **URL State**: Data navigasi dan filter antarmuka yang direfleksikan langsung ke dalam query string URL (`?kategori=backend&page=2`).  
>    *Contoh*: Kata kunci pencarian judul materi di katalog, nomor halaman paginasi tugas. *Keunggulan mutlak*: URL ini dapat disalin (*copy-paste*) dan dibagikan ke mahasiswa lain, dan mahasiswa lain akan melihat kondisi tampilan filter yang persis sama.

---

#### Soal 7
Diberikan sebuah hook Zustand untuk mengelola data draf tugas kuliah:
```typescript
import { create } from "zustand";

interface TaskDraftState {
  title: string;
  content: string;
  setTitle: (t: string) => void;
  setContent: (c: string) => void;
  resetDraft: () => void;
}

export const useTaskDraftStore = create<TaskDraftState>((set) => ({
  title: "",
  content: "",
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  resetDraft: () => set({ title: "", content: "" }),
}));
```
Tuliskan komponen React klien bernama `TaskTitleInput` yang hanya mengonsumsi dan mengubah properti `title` menggunakan atomic selector presisi sehingga terhindar dari re-render saat properti `content` berubah!

> **Pembahasan Soal 7**:
> ```tsx
> "use client";
> 
> import React from "react";
> import { useTaskDraftStore } from "@/store/useTaskDraftStore";
> 
> export function TaskTitleInput() {
>   // 1. Selector Presisi untuk Nilai State:
>   // Komponen ini HANYA subscribe ke properti 'title'
>   const title = useTaskDraftStore((state) => state.title);
> 
>   // 2. Selector Presisi untuk Aksi Pengubah:
>   // Fungsi aksi di Zustand stabil secara referensi dan tidak pernah memicu re-render
>   const setTitle = useTaskDraftStore((state) => state.setTitle);
> 
>   return (
>     <div className="space-y-1.5">
>       <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
>         Judul Draf Tugas
>       </label>
>       <input
>         type="text"
>         value={title}
>         onChange={(e) => setTitle(e.target.value)}
>         placeholder="Masukkan judul tugas..."
>         className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
>       />
>     </div>
>   );
> }
> ```

---

## 9. Referensi & Sumber Belajar Lanjutan

Perdalam konsep arsitektur manajemen state modern melalui rujukan resmi berikut:

1. **Zustand Official Documentation & GitHub**:  
   [https://zustand.docs.pmnd.rs/](https://zustand.docs.pmnd.rs/)  
   *Panduan resmi terlengkap arsitektur Zustand, selectors, async actions, dan slice pattern.*
2. **React Official Documentation — Passing Data Deeply with Context**:  
   [https://react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context)  
   *Panduan definitif dari tim inti React mengenai cara kerja dan kasus penggunaan ideal Context API.*
3. **Kent C. Dodds — Compound Components with React Hooks**:  
   [https://kentcdodds.com/blog/compound-components-with-react-hooks](https://kentcdodds.com/blog/compound-components-with-react-hooks)  
   *Tutorial arsitektur legendaris mengenai pola desain Compound Components di React modern.*
4. **TkDodo — Practical React Query & State Separation**:  
   [https://tkdodo.eu/blog/practical-react-query](https://tkdodo.eu/blog/practical-react-query)  
   *Esai terkemuka mengenai batas tegas pemisahan antara Server State dan Client State.*
