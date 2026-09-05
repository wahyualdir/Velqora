# Modul 04: Pengantar React Modern: Mental Model, Komponen, Props, dan State

---

## 1. Overview & Pengantar

Kalian telah menuntaskan tiga modul fondasi: protokol komunikasi client-server, struktur semantik dokumen web, dan paradigma immutability di JavaScript modern. Sekarang, kita resmi memasuki gerbang utama: **React**.

Banyak mahasiswa yang gagal memahami React bukan karena React itu rumit, melainkan karena mereka mencoba memperlakukan React seperti **jQuery** atau script manipulasi DOM jadul. Mereka masih berpikir: *"Saat tombol ini diklik, cari elemen `<p id="status">`, lalu ubah teksnya menjadi 'Selesai' dan ubah warnanya jadi hijau."*

Itu adalah cara berpikir **Imperatif** (memberi tahu browser langkah demi langkah cara mengubah layar).

Di React, kita membalik cara berpikir tersebut 180 derajat menjadi **Deklaratif**. Kalian tidak pernah lagi menyentuh dokumen HTML secara manual (`document.getElementById` atau `querySelector` adalah tanda bahaya di kode React). Tugas kalian sebagai perekayasa perangkat lunak adalah mendefinisikan **kondisi data (State)** pada waktu tertentu, dan mendeskripsikan **bagaimana tampilan seharusnya terlihat** berdasarkan state tersebut.

Rumus abadi React yang wajib kalian ingat seumur hidup adalah:
$$\text{UI} = f(\text{State})$$
*User Interface adalah fungsi matematika murni dari State.* Ubah datanya, maka React yang akan memeras keringat mencari cara paling efisien untuk memperbarui piksel di layar pengguna.

Di modul ini, kita akan membangun mental model tersebut dari nol, membedah apa sebenarnya JSX di balik layar, serta menguasai dua pilar reaktivitas data: **Props** dan **State**.

---

## 2. Tujuan Pembelajaran

Setelah mempelajari modul ini dan menyelesaikan seluruh tugas praktiknya, kalian diharapkan mampu:

1. **Mengubah pola pikir rekayasa** dari manipulasi DOM imperatif menjadi arsitektur deklaratif berbasis state reaktif ($\text{UI} = f(\text{State})$).
2. **Menganalisis proses kompilasi JSX** menjadi pemanggilan fungsi JavaScript murni oleh compiler modern (`jsx-runtime`).
3. **Merancang hierarki komponen** yang modular dan dapat digunakan kembali (*reusable*) menggunakan pemisahan tanggung jawab yang tegas, *Props*, dan *Children Composition*.
4. **Mengelola siklus hidup data lokal** menggunakan Hook `useState`, termasuk menerapkan fungsi *updater* (`prev => ...`) untuk menghindari galat *stale state*.
5. **Menerapkan pola aliran data satu arah (*Unidirectional Data Flow*)** dan teknik *Lifting State Up* untuk menyinkronkan data antar-komponen bersaudara.
6. **Mendiagnosis dan mencegah kesalahan fatal pemula**, seperti mutasi state langsung, *state mirroring anti-pattern*, dan penggunaan indeks array sebagai `key`.

---

## 3. Prasyarat Pengetahuan & Perangkat

- **Prasyarat Pengetahuan**:
  - Telah menyelesaikan **Modul 01, 02, dan 03**.
  - Menguasai *Array Destructuring*, *Object Spread*, *Arrow Functions*, dan metode `.map()` serta `.filter()`.
- **Perangkat Lunak**:
  - Node.js LTS (v20.x atau v22.x).
  - Browser modern dengan ekstensi **React Developer Tools** terpasang di Chrome/Firefox.

---

## 4. Konten Pembelajaran Utama

### 4.1 Mental Model: Dari Pemrograman Imperatif ke Deklaratif

Mari kita gunakan analogi sederhana: **Memesan Makanan di Restoran**.

```
[PENDEKATAN IMPERATIF] (Manipulasi DOM Manual)
Kalian masuk ke dapur restoran, mengambil wajan, menuang minyak goreng, 
menyalakan kompor dengan api sedang, memasukkan nasi putih, menuang kecap 2 sendok, 
mengaduk selama 3 menit, lalu memindahkan nasi ke piring pelanggan.
-> Rumit, rawan salah langkah, melelahkan jika menu berganti.

[PENDEKATAN DEKLARATIF] (React)
Kalian duduk santai di meja dan berkata kepada pelayan: 
"Tolong satu porsi Nasi Goreng Pedas dengan Telur Mata Sapi setengah matang."
-> Kalian hanya mendeskripsikan HASIL AKHIR yang diinginkan. 
Koki restoran (mesin React) yang tahu cara paling efisien memasak dan menyajikannya ke meja.
```

Perhatikan perbandingan kodenya secara nyata:

```javascript
// ❌ PENDEKATAN IMPERATIF (Vanilla JavaScript / DOM Manipulation):
const tombol = document.getElementById("btn-status");
const teks = document.getElementById("teks-status");

tombol.addEventListener("click", () => {
  if (teks.innerText === "Offline") {
    teks.innerText = "Online";
    teks.style.color = "green";
  } else {
    teks.innerText = "Offline";
    teks.style.color = "red";
  }
});
```
Jika aplikasi memiliki 50 tombol dengan 20 elemen yang saling memengaruhi, kode imperatif di atas akan menjadi benang kusut yang mustahil di-debug (*Spaghetti Code*).

Bandingkan dengan cara React:

```jsx
// ✅ PENDEKATAN DEKLARATIF (React):
import { useState } from "react";

export function IndikatorStatus() {
  // 1. Tentukan sumber kebenaran data (State)
  const [isOnline, setIsOnline] = useState(false);

  // 2. Deskripsikan tampilan berdasarkan kondisi state
  return (
    <div>
      <p style={{ color: isOnline ? "green" : "red" }}>
        Status: {isOnline ? "Online" : "Offline"}
      </p>
      <button onClick={() => setIsOnline(!isOnline)}>
        Ubah Status
      </button>
    </div>
  );
}
```
Kalian tidak pernah memerintahkan browser mencari elemen teks atau mengganti warnanya. Kalian hanya mengubah state `isOnline`, dan React otomatis menghitung elemen mana saja yang perlu diperbarui di layar.

#### Virtual DOM dan Algoritma Rekonsiliasi
Mengubah elemen DOM asli di browser adalah operasi komputasi yang sangat lambat (*expensive*) karena memicu proses *Reflow* (penghitungan geometri tata letak) dan *Repaint* (pewarnaan piksel layar).

Untuk mengatasinya, React menciptakan **Virtual DOM (VDOM)**—sebuah salinan ringan dari pohon DOM yang disimpan murni di dalam memori JavaScript.
1. Saat state berubah, React merender ulang Virtual DOM baru di memori.
2. React membandingkan Virtual DOM baru dengan Virtual DOM sebelumnya menggunakan algoritma cerdas bernama **Diffing Algorithm (Reconciliation)**.
3. React menemukan perbedaan spesifiknya (misal: hanya teks di dalam tag `<p>` yang berubah).
4. React hanya menyuntikkan perubahan kecil tersebut ke DOM asli browser (*Batch DOM Update*).

---

### 4.2 Anatomi JSX: Bukan HTML, Melainkan Gula Sintaksis

Banyak pemula mengira JSX adalah kode HTML yang dimasukkan ke dalam JavaScript. **Salah.**

Browser sama sekali tidak mengerti JSX. Sebelum sampai ke browser, compiler (seperti Babel, SWC, atau Turbopack) akan menerjemahkan (*transpile*) setiap tag JSX menjadi pemanggilan fungsi JavaScript biasa.

Perhatikan transformasi di balik layarnya:

```jsx
// Kode JSX yang kalian tulis:
const elemen = (
  <button className="btn-utama" onClick={handleClick}>
    <span>Kirim</span>
  </button>
);

// Kode JavaScript murni hasil kompilasi yang dijalankan browser:
import { jsx as _jsx } from "react/jsx-runtime";

const elemen = _jsx("button", {
  className: "btn-utama",
  onClick: handleClick,
  children: _jsx("span", { children: "Kirim" })
});
```

Karena JSX sejatinya adalah JavaScript, ada empat aturan mutlak yang wajib dipatuhi:

1. **Hanya Boleh Memiliki Satu Elemen Induk (*Single Root Element*)**:
   Fungsi JavaScript tidak bisa mengembalikan dua objek sekaligus tanpa pembungkus. Jika tidak ingin menambah tag `<div>` ekstra di DOM, gunakan **React Fragment**: `<> ... </>`.
   ```jsx
   // ✅ BENAR MENGGUNAKAN FRAGMENT:
   return (
     <>
       <h1>Judul Materi</h1>
       <p>Deskripsi isi modul...</p>
     </>
   );
   ```
2. **Tag Wajib Ditutup Mandiri (*Self-Closing Tag*)**:
   Tag seperti `<img>`, `<input>`, `<br>`, `<hr>` wajib ditutup: `<img src="..." alt="..." />`.
3. **Penamaan Atribut CamelCase**:
   Karena `class` dan `for` adalah kata kunci reserved di JavaScript:
   - Gunakan `className` (bukan `class`).
   - Gunakan `htmlFor` (bukan `for`).
   - Gunakan event handler camelCase: `onClick`, `onChange`, `onSubmit`.
4. **Ekspresi JavaScript di dalam Kurung Kurawal `{}`**:
   Kalian bisa menyisipkan variabel, operasi matematika, atau pemanggilan fungsi apa pun di dalam kurung kurawal `{}`.

---

### 4.3 Komponen & Props: Membangun Antarmuka Seperti Lego

Di React, antarmuka dipecah menjadi unit-unit kecil independen yang disebut **Komponen**. Komponen React modern pada dasarnya adalah fungsi JavaScript murni yang menerima masukan bernama **Props** (*Properties*) dan mengembalikan deskripsi UI berupa JSX.

```
                  [Parent: DaftarModul]
                            |
           +----------------+----------------+
           | (props: data)  | (props: data)  |
           v                v                v
     [KartuMateri]    [KartuMateri]    [KartuMateri]
```

#### Komponen sebagai Fungsi Murni (*Pure Function*)
Sebuah fungsi murni memiliki sifat: **diberikan input yang sama, akan selalu menghasilkan output yang sama, tanpa efek samping.**
Komponen kalian tidak boleh mengubah variabel di luar dirinya sendiri saat proses rendering berlangsung.

#### Mengirim dan Menerima Props
Props adalah mekanisme komunikasi data dari komponen induk (*Parent*) ke komponen anak (*Child*).

```tsx
// 1. Definisikan bentuk data props (Gunakan interface TypeScript)
interface KartuMateriProps {
  judul: string;
  mingguKe: number;
  selesai?: boolean; // Opsional
}

// 2. Komponen Anak: Menerima props dengan destructuring
export function KartuMateri({ judul, mingguKe, selesai = false }: KartuMateriProps) {
  return (
    <article className="border p-4 rounded-lg shadow-sm">
      <span className="text-xs text-slate-500">Minggu #{mingguKe}</span>
      <h3 className="text-lg font-bold">{judul}</h3>
      <p>Status: {selesai ? "✅ Tuntas" : "⏳ Belum Selesai"}</p>
    </article>
  );
}

// 3. Komponen Induk: Mengirimkan props
export function DaftarKuliah() {
  return (
    <section className="space-y-3">
      <KartuMateri judul="Arsitektur Client-Server" mingguKe={1} selesai={true} />
      <KartuMateri judul="HTML5 & Layout Modern" mingguKe={2} selesai={false} />
    </section>
  );
}
```

#### Aturan Sakral Props: **Props Bersifat Read-Only (Immutable)**
Komponen anak **DILARANG KERAS** mengubah nilai props yang diterimanya!
```javascript
function KomponenAnak(props) {
  // ❌ DOSA BESAR: Memutasi props secara langsung!
  // props.judul = "Judul Baru"; // Error runtime atau perilaku aneh!
  
  return <h1>{props.judul}</h1>;
}
```

#### Komposisi dengan Prop Spesial: `children`
Sering kali kalian ingin membuat komponen pembungkus umum (seperti Card, Modal, atau Shell Layout) yang tidak peduli apa isi dalamnya. Gunakan prop bawaan `children`:

```tsx
interface KontainerKartuProps {
  children: React.ReactNode;
  warnaTema?: string;
}

export function KontainerKartu({ children, warnaTema = "bg-white" }: KontainerKartuProps) {
  return (
    <div className={`rounded-xl border border-slate-200 p-6 ${warnaTema}`}>
      {children}
    </div>
  );
}

// Penggunaan komposisi:
<KontainerKartu warnaTema="bg-amber-50">
  <h2>Peringatan Penting!</h2>
  <p>Batas akhir pengumpulan tugas malam ini pukul 23.59 WIB.</p>
</KontainerKartu>
```

---

### 4.4 State: Memori Hidup Komponen dengan Hook `useState`

Jika Props adalah data yang dikirimkan dari luar (seperti instruksi atasan), maka **State** adalah memori pribadi internal komponen yang dapat berubah seiring interaksi pengguna.

Setiap kali nilai state berubah melalui fungsi pengubahnya, React secara otomatis memicu proses render ulang komponen tersebut.

```javascript
const [nilaiState, setNilaiState] = useState(nilaiAwal);
```

#### Tiga Fakta Krusial tentang `useState`

##### 1. Pembaruan State Bersifat Asinkron dan Di-batch (*Batched*)
Perhatikan kode jebakan klasik ini:
```javascript
const [skor, setSkor] = useState(0);

function tambahSkor() {
  setSkor(skor + 1);
  console.log(skor); // ❌ MENGAPA YANG DICETAK MASIH 0?
}
```
**Penjelasan Praktisi**: `setSkor` tidak langsung mengubah variabel `skor` di baris berikutnya. Pemanggilan `setSkor` hanyalah **permintaan penjadwalan pembaruan** kepada React. Nilai `skor` baru akan berubah pada siklus render berikutnya ketika fungsi komponen dieksekusi ulang dari awal.

##### 2. Bentuk Updater Function (`prev => ...`)
Apa yang terjadi jika kalian memanggil setter tiga kali berturut-turut?
```javascript
function klikTigaKali() {
  setSkor(skor + 1); // skor masih 0 -> 0 + 1 = 1
  setSkor(skor + 1); // skor masih 0 -> 0 + 1 = 1
  setSkor(skor + 1); // skor masih 0 -> 0 + 1 = 1
}
```
Setelah tombol diklik, skor hanya bernilai **1**, bukan 3! Karena ketiga baris membaca nilai snapshot `skor` yang sama di render saat ini.

**Solusi Benar**: Gunakan **Updater Function** jika nilai state baru bergantung pada nilai state sebelumnya:
```javascript
function klikTigaKaliBenar() {
  setSkor(prev => prev + 1); // Antrean 1: 0 + 1 = 1
  setSkor(prev => prev + 1); // Antrean 2: 1 + 1 = 2
  setSkor(prev => prev + 1); // Antrean 3: 2 + 1 = 3
}
// Hasil akhir: Skor bertambah 3 dengan presisi!
```

##### 3. State Berupa Objek Wajib Disalin Imutable
Sesuai aturan Modul 03, jangan pernah mengubah properti objek state secara langsung:
```javascript
const [profil, setProfil] = useState({ nama: "Dani", kota: "Bandung" });

// ❌ SALAH BESAR (Tidak memicu render ulang!):
// profil.kota = "Jakarta";
// setProfil(profil);

// ✅ BENAR (Buat objek baru dengan spread operator):
setProfil(prev => ({
  ...prev,
  kota: "Jakarta"
}));
```

---

### 4.5 Aliran Data Satu Arah (*Unidirectional Data Flow*) & *Lifting State Up*

Di React, data selalu mengalir ke satu arah: **dari atas ke bawah (Parent -> Child)** melalui props.  
Lalu, bagaimana jika dua komponen bersaudara (misal: komponen Form Input dan komponen Ringkasan Belanja) perlu berbagi data yang sama?

**Jawabannya**: Angkat state tersebut ke induk terdekat mereka (*Lifting State Up*).

```
                 [PARENT: AplikasiKasir]
                 - State: [keranjang, setKeranjang]
                           /         \
   (props: keranjang)     /           \  (props: onTambahItem)
                         v             v
       [DaftarKeranjangBelanja]      [FormTambahBarang]
```

1. State `keranjang` disimpan di induk `AplikasiKasir`.
2. Data `keranjang` diturunkan ke `DaftarKeranjangBelanja` lewat props untuk ditampilkan.
3. Fungsi handler untuk menambah item diturunkan ke `FormTambahBarang` sebagai fungsi callback (`onTambahItem`).
4. Ketika pengguna mengirimkan formulir di anak, anak memanggil fungsi callback tersebut untuk mengubah state di induk!

---

### 4.6 Catatan dari Lapangan: Empat Dosa Besar Pemula di React

#### 1. Dosa `key={index}` pada List Rendering
Banyak mahasiswa merender daftar data seperti ini:
```jsx
{daftarTugas.map((tugas, index) => (
  <ItemTugas key={index} data={tugas} /> // ⚠️ SANGAT BERBAHAYA!
))}
```
Jika daftar tugas tersebut bisa dihapus atau diurutkan ulang, menggunakan `index` array sebagai `key` akan membuat algoritma rekonsiliasi React bingung mengenali elemen mana yang berpindah. Akibatnya: state internal komponen anak (seperti input teks atau checkbox) bisa **tertukar dan salah posisi**!  
**Aturan Emas**: Selalu gunakan ID unik yang stabil dari basis data: `key={tugas.id}`.

#### 2. Dosa State Berlebihan (*Derived State Trap*)
Jangan pernah menyimpan ke dalam state data yang bisa dihitung secara langsung saat render:
```jsx
// ❌ BURUK: Menyimpan redundansi ke dalam state
const [firstName, setFirstName] = useState("Ahmad");
const [lastName, setLastName] = useState("Dahlan");
const [fullName, setFullName] = useState("Ahmad Dahlan"); // TIDAK PERLU!

// ✅ BENAR: Hitung langsung di badan komponen (Derived State)
const fullName = `${firstName} ${lastName}`;
```
Setiap variabel state tambahan berisiko memicu bug inkonsistensi data ketika salah satu state lupa diperbarui.

#### 3. State Mirroring Anti-Pattern
Menyalin props ke dalam state lokal saat inisialisasi:
```jsx
function ProfilCard({ namaDariServer }) {
  // ❌ ANTI-PATTERN:
  const [nama, setNama] = useState(namaDariServer);
  // Jika namaDariServer di parent berubah karena fetch ulang, 
  // state lokal 'nama' TIDAK AKAN diperbarui otomatis!
}
```
Gunakan props langsung, kecuali kalian memang sengaja ingin membuat draft yang bisa diedit mandiri secara terisolasi.

#### 4. Memanggil Setter State Langsung di Tubuh Render (Infinite Loop!)
```jsx
function KomponenRusak() {
  const [hitung, setHitung] = useState(0);

  // ❌ CRASH FATAL: Error: Too many re-renders.
  setHitung(hitung + 1); 

  return <div>{hitung}</div>;
}
```
Memanggil pembaruan state langsung di tubuh komponen tanpa dibungkus event handler atau hook efek akan memicu loop tak terbatas: Render -> Set State -> Render Ulang -> Set State -> Crash!

---

## 5. Latihan & Tugas Praktik

### Latihan 1: Komponen Counter Interaktif Presisi (Tingkat Dasar)

Buat sebuah komponen React mandiri bernama `CounterPintar` dengan spesifikasi fungsional:

1. Memiliki state angka dengan nilai awal 0.
2. Memiliki tombol **Tambah (+1)**, **Kurang (-1)**, dan **Reset (kembali ke 0)**.
3. Batasan Nilai: Angka tidak boleh kurang dari 0 (*min: 0*) dan tidak boleh lebih dari 20 (*max: 20*).
4. Jika nilai mencapai 20, tombol Tambah harus otomatis berstatus `disabled` dan teks counter berubah warna menjadi merah.
5. Jika nilai mencapai 0, tombol Kurang dan tombol Reset harus berstatus `disabled`.
6. Terapkan pembaruan state berbasis **updater function** (`prev => ...`).

---

### Latihan 2: Mini Task Tracker dengan Lifting State Up (Tingkat Lanjutan)

Bangun aplikasi pelacak tugas kuliah sederhana yang terdiri dari tiga komponen terpisah:

1. **`TaskApp` (Komponen Induk / Parent)**:
   - Menyimpan array state `tasks`:
     ```typescript
     interface Task {
       id: string;
       judul: string;
       selesai: boolean;
     }
     ```
   - Menyediakan fungsi untuk menambah tugas baru, menghapus tugas berdasarkan ID, dan mengubah status checklist selesai.
2. **`TaskForm` (Komponen Anak Input)**:
   - Menggunakan *controlled component* untuk input teks judul tugas.
   - Ketika tombol "Tambah Tugas" diklik, validasi agar input tidak boleh kosong/hanya spasi.
   - Panggil callback dari parent untuk menambahkan tugas baru dengan ID unik (gunakan `crypto.randomUUID()` atau `Date.now().toString()`), lalu bersihkan kolom input teks.
3. **`TaskList` & `TaskItem` (Komponen Anak Penampil)**:
   - Menampilkan daftar seluruh tugas menggunakan `.map()` dengan `key` berbasis `task.id`.
   - Tiap item memiliki checkbox untuk menandai selesai (tugas yang selesai diberi efek teks coret `line-through`), dan tombol hapus di ujung kanan.
   - Di bagian bawah, tampilkan ringkasan cerdas: *"3 dari 5 tugas selesai (60%)"*.

---

## 6. Studi Kasus Nyata

### Kasus: "Kekacauan Keranjang Kasir POS Akibat Kunci Indeks Array"

#### Skenario Kejadian
Sebuah startup penyedia aplikasi kasir digital (*Point of Sales*) meluncurkan pembaruan antarmuka menggunakan React. Pada hari peluncuran, kasir di puluhan cabang minimarket mengalami kekacauan transaksi:
Seorang kasir memindai 3 barang belanjaan:
1. *Barang A (Kopi Susu)* - Input Qty: 2
2. *Barang B (Roti Cokelat)* - Input Qty: 5
3. *Barang C (Air Mineral)* - Input Qty: 1

Pelanggan membatalkan pembelian Barang B (Roti Cokelat). Kasir menekan tombol ikon tong sampah pada baris kedua (Barang B) untuk menghapusnya.
**Bencana Terjadi**:
Di layar kasir, teks nama Barang B memang terhapus, tetapi input form kuantitas angka `5` yang tadinya milik Barang B **malah turun dan menempel ke Barang C (Air Mineral)!** Akibatnya pelanggan ditagih 5 botol air mineral senilai puluhan ribu rupiah.

#### Audit Forensik Kode Komponen
Tim pengembang memeriksa file `DaftarKeranjang.jsx`:

```jsx
// ❌ KODE SUMBER PENYEBAB BENCANA:
export function DaftarKeranjang({ items, onHapusItem }) {
  return (
    <div className="keranjang-list">
      {items.map((item, index) => (
        // PENGEMBANG MENGGUNAKAN INDEX SEBAGAI KEY!
        <ItemBarisBarang 
          key={index} 
          dataBarang={item} 
          onHapus={() => onHapusItem(item.id)} 
        />
      ))}
    </div>
  );
}

function ItemBarisBarang({ dataBarang, onHapus }) {
  // Komponen anak menyimpan nilai kuantitas di state lokalnya sendiri:
  const [qty, setQty] = useState(dataBarang.qtyAwal || 1);

  return (
    <div className="baris-item">
      <span>{dataBarang.nama}</span>
      <input 
        type="number" 
        value={qty} 
        onChange={(e) => setQty(Number(e.target.value))} 
      />
      <button onClick={onHapus}>Hapus</button>
    </div>
  );
}
```

#### Mengapa Bug Ini Terjadi?
1. Saat awal render, ada 3 elemen dengan key: `key=0` (Barang A), `key=1` (Barang B, qty state=5), `key=2` (Barang C, qty state=1).
2. Ketika Barang B dihapus dari array parent, sisa array hanya 2 item.
3. React melakukan rekonsiliasi:
   - Elemen pertama: `key=0` cocok -> Pertahankan instance dan state lama (Barang A, qty=2).
   - Elemen kedua: Sekarang diisi Barang C, tetapi di map dengan `key=1`!
   - Karena `key=1` sudah pernah ada di memori Virtual DOM sebelumnya dengan state internal `qty = 5`, React **menggunakan kembali instance komponen lama** beserta state-nya!
   - React hanya memperbarui props `dataBarang.nama` menjadi Barang C, namun state lokal `qty` tetap tertahan di angka 5!

#### Solusi Perbaikan Baku
1. **Gunakan ID Unik Stabil Sebagai Key**:
   ```jsx
   // ✅ GANTI KEY DENGAN ID ENTITAS PERMANEN:
   {items.map((item) => (
     <ItemBarisBarang 
       key={item.id} 
       dataBarang={item} 
       onHapus={() => onHapusItem(item.id)} 
     />
   ))}
   ```
2. **Pindahkan State Kuantitas ke Sumber Kebenaran Tunggal (Single Source of Truth)**:
   Jangan simpan nilai kuantitas di state lokal komponen anak. Simpan kuantitas langsung di array objek parent dan kendalikan sebagai *Controlled Component*.

---

## 7. Rangkuman Reflektif

Mempelajari React bukanlah tentang menghafal sintaks baru, melainkan tentang **menggeser cara otak kalian memandang arsitektur perangkat lunak**.

Kalian bukan lagi tukang batu yang memindahkan bata elemen HTML satu per satu secara manual. Kalian adalah perancang sistem yang mendefinisikan hubungan matematis antara **Data (State)** dan **Wujud Visual (UI)**.

Ingat tiga dalil utama modul ini:
1. **UI adalah cerminan dari State**: Jangan paksa DOM berubah; ubahlah datanya secara imutable, biarkan React bekerja.
2. **Props mengalir ke bawah, Event mengalir ke atas**: Jaga aliran data tetap satu arah agar alur aplikasi mudah dilacak saat terjadi kegagalan sistem.
3. **Key adalah identitas identitas unik sejati elemen**: Jangan pernah kompromi menggunakan index array jika daftar data kalian bersifat dinamis.

Di **Modul 05**, kita akan membawa fondasi komponen dan state ini ke level produksi industri menggunakan framework full-stack nomor satu di dunia: **Next.js 15 & App Router**. Kita akan membedah bagaimana halaman web dirutekan, bagaimana menyusun layout bertingkat, dan bagaimana web modern di-render secara optimal di server.

---

## 8. Evaluasi & Kuis Pemahaman

### Pilihan Ganda

#### Soal 1
Perhatikan potongan kode React berikut:
```jsx
function TombolSuka() {
  const [likes, setLikes] = useState(10);

  function handleKlik() {
    setLikes(likes + 1);
    setLikes(likes + 1);
    setLikes(likes + 1);
  }

  return <button onClick={handleKlik}>Suka ({likes})</button>;
}
```
Jika tombol diklik satu kali dari kondisi awal `likes = 10`, berapa angka likes yang akan tampil di layar setelah render selesai?
- A. 13
- B. 12
- C. 11
- D. Tetap 10

> **Kunci Jawaban: C**  
> **Pembahasan**: Karena dalam satu siklus event handler, nilai `likes` masih terkunci pada nilai snapshot render saat itu (yaitu 10). Ketiga pemanggilan setter mengeksekusi `setLikes(10 + 1)`. Hasil akhir batching adalah 11. Jika ingin bertambah menjadi 13, wajib menggunakan updater function: `setLikes(prev => prev + 1)`.

---

#### Soal 2
Manakah pernyataan berikut yang **salah** mengenai karakteristik Props di React?
- A. Props dapat digunakan untuk mengirimkan data berupa string, angka, array, objek, maupun fungsi callback.
- B. Komponen anak berhak mengubah (*mutasi*) nilai props yang diterimanya jika ada interaksi tombol di dalam dirinya sendiri.
- C. Props `children` mewakili elemen atau teks apa pun yang diletakkan di antara tag pembuka dan penutup sebuah komponen.
- D. Perubahan nilai props dari parent akan otomatis memicu render ulang pada komponen anak yang menerimanya.

> **Kunci Jawaban: B**  
> **Pembahasan**: Props bersifat *read-only* (imutable murni). Komponen anak tidak boleh memodifikasi props-nya sendiri. Jika anak ingin mengubah data, ia harus memanggil fungsi callback yang diberikan oleh parent agar parent yang memperbarui state-nya.

---

#### Soal 3
Apa peran utama dari algoritma Rekonsiliasi (*Diffing Algorithm*) pada Virtual DOM React?
- A. Mengompresi ukuran file gambar di halaman secara otomatis.
- B. Membandingkan struktur pohon Virtual DOM baru dengan pohon Virtual DOM lama untuk menemukan perbedaan terkecil yang perlu disinkronkan ke DOM asli browser.
- C. Menerjemahkan kode TypeScript menjadi kode biner mesin.
- D. Menghubungkan database PostgreSQL langsung ke antarmuka klien.

> **Kunci Jawaban: B**  
> **Pembahasan**: Rekonsiliasi adalah proses pembandingan cerdas antara representasi pohon Virtual DOM lama dan baru untuk memperbarui DOM fisik browser secara selektif pada bagian yang berubah saja, demi menjaga performa tinggi.

---

#### Soal 4
Mengapa menggunakan indeks array sebagai nilai `key` (misalnya `key={index}`) saat melakukan rendering list dinamis dengan `.map()` sangat **tidak disarankan** di aplikasi produksi?
- A. Karena React akan langsung melempar error kompilasi dan menolak menjalankan aplikasi.
- B. Karena indeks array menyebabkan konsumsi memori server meningkat 100%.
- C. Karena jika urutan item berubah, disaring, atau ada item yang disisipkan/dihapus di tengah daftar, React akan salah mengasosiasikan state internal komponen anak dengan data yang salah.
- D. Karena indeks array tidak kompatibel dengan CSS Flexbox.

> **Kunci Jawaban: C**  
> **Pembahasan**: Key berfungsi sebagai penanda identitas unik permanen bagi React untuk melacak elemen antar-render. Menggunakan index angka yang berubah-ubah posisinya saat item dihapus atau diurutkan akan merusak keterikatan state internal komponen anak (seperti input teks atau animasi).

---

#### Soal 5
Perhatikan deklarasi komponen berikut:
```jsx
function KotakPesan({ pesan }) {
  return (
    <h1>Halo!</h1>
    <p>{pesan}</p>
  );
}
```
Mengapa kode di atas akan menghasilkan galat kompilasi JSX (*SyntaxError*)?
- A. Karena tag `h1` dan `p` tidak boleh berada di dalam fungsi komponen.
- B. Karena fungsi komponen hanya boleh mengembalikan satu elemen root tunggal (harus dibungkus container atau React Fragment `<>...</>`).
- C. Karena atribut `pesan` tidak boleh ditulis di dalam kurung kurawal.
- D. Karena nama fungsi komponen diawali huruf kapital.

> **Kunci Jawaban: B**  
> **Pembahasan**: Setiap ekspresi JSX ditranspilasi menjadi pemanggilan fungsi JavaScript murni. Sebuah fungsi JavaScript tidak dapat me-return dua entitas terpisah sekaligus tanpa dibungkus satu objek/elemen induk. Solusinya adalah membungkusnya dengan `<> <h1>...</h1> <p>...</p> </>`.

---

### Soal Analisis & Kasus

#### Soal 6
Jelaskan konsep **"Lifting State Up"** dalam arsitektur React! Berikan contoh situasi konkret di mana pola ini **wajib** digunakan dan jelaskan mekanisme aliran datanya!

> **Pembahasan Soal 6**:  
> **Lifting State Up** adalah teknik arsitektur di mana state yang dibutuhkan oleh beberapa komponen bersaudara dipindahkan ke komponen induk (*parent*) terdekat mereka. Karena data di React hanya mengalir satu arah dari atas ke bawah (unidirectional), dua komponen anak yang sejajar tidak bisa saling berbicara secara langsung.  
> **Contoh Konkret**:  
> Sebuah sistem konverter mata uang yang memiliki dua komponen input anak sejajar: `InputRupiah` dan `InputDollar`. Ketika pengguna mengetik angka di `InputRupiah`, nilai di `InputDollar` harus langsung terhitung otomatis, dan sebaliknya.  
> **Mekanisme**:  
> 1. State tunggal `jumlahUang` dan `mataUangAktif` diletakkan di komponen induk `KonverterParent`.  
> 2. `KonverterParent` mengirimkan nilai hasil konversi ke masing-masing anak melalui props.  
> 3. Setiap kali salah satu anak menerima input ketikan, anak memanggil fungsi callback props (misal `onPerubahanNilai`) untuk memberi tahu parent agar memperbarui state utama. Parent me-render ulang dan kedua anak mendapatkan nilai terbaru secara serentak dan sinkron.

---

#### Soal 7
Analisis potongan kode form berikut. Temukan **dua kesalahan arsitektur state** dan tuliskan perbaikan kodenya yang benar!
```jsx
function FormPendaftaran() {
  const [nama, setNama] = useState("");
  const [daftarMahasiswa, setDaftarMahasiswa] = useState([]);

  function handleSimpan() {
    daftarMahasiswa.push(nama);
    setDaftarMahasiswa(daftarMahasiswa);
    setNama("");
  }

  return (
    <div>
      <input value={nama} onChange={(e) => setNama(e.target.value)} />
      <button onClick={handleSimpan}>Simpan</button>
      <ul>
        {daftarMahasiswa.map((mhs, idx) => (
          <li key={idx}>{mhs}</li>
        ))}
      </ul>
    </div>
  );
}
```

> **Pembahasan Soal 7**:  
> **Dua Kesalahan Arsitektur**:
> 1. **Mutasi State Langsung**: Baris `daftarMahasiswa.push(nama)` memutasi array lama di alamat memori yang sama, lalu memanggil `setDaftarMahasiswa(daftarMahasiswa)`. React memeriksa perbandingan referensi `Object.is(oldState, newState)` dan melihat alamat memori tidak berubah, sehingga React **bisa mengabaikan proses render ulang** dan daftar di layar tidak bertambah.
> 2. **Penggunaan Index Sebagai Key**: List item menggunakan `key={idx}`, yang melanggar prinsip stabilitas identitas rendering.
> 
> **Perbaikan Kode yang Benar**:
> ```jsx
> function FormPendaftaran() {
>   const [nama, setNama] = useState("");
>   // Simpan sebagai array objek ber-ID unik:
>   const [daftarMahasiswa, setDaftarMahasiswa] = useState([]);
> 
>   function handleSimpan() {
>     if (!nama.trim()) return; // Validasi input kosong
> 
>     const mahasiswaBaru = {
>       id: crypto.randomUUID(),
>       namaLengkap: nama.trim()
>     };
> 
>     // Update immutable menggunakan updater function dan spread operator:
>     setDaftarMahasiswa(prev => [...prev, mahasiswaBaru]);
>     setNama(""); // Reset input
>   }
> 
>   return (
>     <div>
>       <input 
>         value={nama} 
>         onChange={(e) => setNama(e.target.value)} 
>         placeholder="Masukkan nama mahasiswa"
>       />
>       <button onClick={handleSimpan}>Simpan</button>
>       <ul>
>         {daftarMahasiswa.map((mhs) => (
>           <li key={mhs.id}>{mhs.namaLengkap}</li>
>         ))}
>       </ul>
>     </div>
>   );
> }
> ```

---

## 9. Referensi & Sumber Belajar Lanjutan

Perdalam penguasaan komponen dan state React modern kalian melalui rujukan resmi berikut:

1. **React Official Documentation — Describing the UI & Adding Interactivity**:  
   [https://react.dev/learn/describing-the-ui](https://react.dev/learn/describing-the-ui) dan [https://react.dev/learn/adding-interactivity](https://react.dev/learn/adding-interactivity)  
   *Dokumentasi baru React resmi yang dibangun dengan filosofi modern berbasis Function Components & Hooks murni.*
2. **React Official Documentation — Thinking in React**:  
   [https://react.dev/learn/thinking-in-react](https://react.dev/learn/thinking-in-react)  
   *Panduan langkah demi langkah membedah desain UI statis menjadi hierarki komponen dan state minimal.*
3. **Dan Abramov — Overreacted: A Complete Guide to useEffect & Component Lifecycles**:  
   [https://overreacted.io/](https://overreacted.io/)  
   *Esai mendalam dari salah satu kreator inti React mengenai mental model sinkronisasi state dan hooks.*
4. **Kent C. Dodds — Application State Management with React**:  
   [https://kentcdodds.com/blog/application-state-management-with-react](https://kentcdodds.com/blog/application-state-management-with-react)  
   *Panduan praktisi industri tentang kapan harus mengangkat state dan bagaimana menghindari over-engineering state global.*
