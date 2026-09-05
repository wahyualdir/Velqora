# Modul 03: JavaScript ES6+ & Fondasi Asinkron Wajib Framework Web

---

## 1. Overview & Pengantar

Berdasarkan pengalaman saya mengajar dan membimbing insinyur pemula selama sepuluh tahun, ada satu pola kegagalan klasik yang terus berulang: **mahasiswa terburu-buru belajar React tanpa menguasai JavaScript modern.**

Ketika mereka melihat baris kode seperti:
```javascript
const [data, setData] = useState([]);
const updateData = items.map(({ id, ...detail }) => id === targetId ? { ...detail, aktif: true } : detail);
```
Banyak mahasiswa mengira itu adalah "sintaks khusus React" yang harus dihafalkan. Padahal, 90% dari baris kode di atas adalah **JavaScript ES6+ murni** (destructuring, rest/spread operator, ternary operator, dan immutable array mapping).

Akibatnya fatal. Ketika aplikasi mereka mengalami bug aneh—komponen tidak mau me-render ulang (*re-render*), data di tabel tiba-tiba saling menimpa, atau aplikasi *crash* dengan pesan legendaris `TypeError: Cannot read properties of undefined`—mereka menyalahkan framework. Padahal masalahnya ada pada pemahaman referensi memori (*reference equality*) dan cara kerja asinkron di JavaScript.

Di modul ketiga ini, kita akan membongkar tuntas fondasi JavaScript modern yang mutlak kalian perlukan sebelum kita melangkah ke React dan Next.js di modul berikutnya:
1. Fitur-fitur sintaks ES6+ yang menjadi makanan sehari-hari pengembang web.
2. Paradigma **Immutability** (mengapa mutasi data langsung adalah dosa besar dalam framework reaktif).
3. Anatomi **Asynchronous JavaScript & Event Loop** (bagaimana browser menjalankan tugas berat tanpa membuat antarmuka membeku).

Kuasai materi ini, maka perjalanan kalian di React nanti akan terasa mulus dan intuitif.

---

## 2. Tujuan Pembelajaran

Setelah menyelesaikan modul ini dan mempraktikkan seluruh latihannya, kalian diharapkan mampu:

1. **Menerapkan** fitur modern ECMAScript (Destructuring, Rest & Spread Operator, Optional Chaining, Nullish Coalescing, dan Arrow Functions) untuk menghasilkan kode yang ringkas, aman, dan mudah dirawat.
2. **Membedakan** antara mutasi data langsung (*mutable update*) dan pembaruan tanpa mutasi (*immutable update*), serta memilih *array methods* yang aman untuk arsitektur berbasis state reaktif.
3. **Menganalisis** alur eksekusi asinkron pada mesin JavaScript dengan menelusuri interaksi antara Call Stack, Web APIs, Microtask Queue (Promise), dan Macrotask Queue (Timer).
4. **Membangun** alur penanganan data asinkron yang tangguh menggunakan `async/await`, `Promise.all()`, serta penanganan galat (*error handling*) defensif terhadap kegagalan jaringan.
5. **Mendeteksi dan memperbaiki** *shallow copy bugs*, *floating promises*, dan kebocoran memori akibat operasi asinkron yang tidak dibatalkan.

---

## 3. Prasyarat Pengetahuan & Perangkat

- **Prasyarat Pengetahuan**:
  - Telah menyelesaikan **Modul 01** dan **Modul 02**.
  - Menguasai dasar pemrograman JavaScript: tipe data primitif (`string`, `number`, `boolean`), struktur pengkondisian (`if/else`), perulangan (`for`), dan fungsi dasar.
- **Perangkat Lunak**:
  - Node.js versi LTS (v20.x atau v22.x) terpasang di terminal.
  - Browser modern dengan Developer Tools aktif.
  - Terminal untuk menjalankan eksekusi script Node.js secara langsung.

---

## 4. Konten Pembelajaran Utama

### 4.1 Sintaks ES6+ yang Menjadi Tulang Punggung Framework

Ketika kalian menulis kode di framework modern, kalian hampir tidak akan pernah lagi melihat kata kunci `var` atau pemanggilan fungsi prototipe kuno. Berikut fitur-fitur esensial yang wajib mendarah daging:

#### 1. Destructuring Assignment (Membongkar Struktur Data)
Destructuring memungkinkan kita mengekstrak nilai dari array atau properti dari objek ke dalam variabel tersendiri dengan sintaks yang bersih.

```javascript
// A. Object Destructuring
const mahasiswa = {
  nama: "Rian Pratama",
  nim: "240101001",
  prodi: "Teknik Informatika",
  kontak: { email: "rian@kampus.ac.id" }
};

// Mengambil properti langsung, memberi nilai default, dan alias:
const { nama, prodi, semester = 1, nim: nomorInduk } = mahasiswa;
console.log(nama, prodi, semester, nomorInduk);
// Output: Rian Pratama Teknik Informatika 1 240101001

// B. Array Destructuring (Pola dasar useState di React!)
const koordinat = [106.8456, -6.2088];
const [bujur, lintang] = koordinat;
console.log(`Bujur: ${bujur}, Lintang: ${lintang}`);
```

#### 2. Spread Operator (`...`) vs Rest Parameter (`...`)
Meskipun simbolnya sama persis (tiga titik), fungsinya bergantung pada konteks penggunaannya:
- **Spread** mengekspansi/membongkar elemen array atau properti objek ke tempat baru.
- **Rest** mengumpulkan sisa elemen/argumen menjadi satu wadah array.

```javascript
// SPREAD: Menggabungkan objek dan array tanpa memutasi yang lama
const profilDasar = { nama: "Siti Aminah", angkatan: 2024 };
const profilLengkap = { 
  ...profilDasar, 
  status: "Aktif",
  angkatan: 2025 // Meng-override nilai lama dengan aman
};

// REST: Menangkap sisa parameter fungsi
function catatNilai(matkul, ...daftarNilai) {
  console.log(`Mata Kuliah: ${matkul}`);
  console.log(`Nilai yang terkumpul:`, daftarNilai); // Berupa array murni
}
catatNilai("Web Modern", 85, 90, 78, 92);
```

#### 3. Optional Chaining (`?.`) & Nullish Coalescing (`??`)
Dua operator penyelamat ini diperkenalkan untuk menghentikan bencana runtime error paling umum di dunia web: `Cannot read properties of null/undefined`.

```javascript
const responsServer = {
  data: {
    pengguna: {
      nama: "Budi",
      pengaturan: {
        tema: "gelap",
        kuotaUploadMb: 0 // Nilai nol adalah data valid!
      }
    }
  }
};

// ❌ CARA LAMA YANG RENTAN ERROR:
// const avatar = responsServer.data.pengguna.profil.avatar; // CRASH: TypeError!

// ✅ OPTIONAL CHAINING:
const avatar = responsServer.data?.pengguna?.profil?.avatar; 
console.log(avatar); // undefined (tidak crash, eksekusi kode berlanjut aman)

// PERBEDAAN KRUSIAL: OR (||) vs NULLISH COALESCING (??)
// Operator || menganggap 0, "", false, null, dan undefined sebagai "falsy"
const kuotaOR = responsServer.data.pengguna.pengaturan.kuotaUploadMb || 50;
console.log(kuotaOR); // 50 (SALAH! Nilai asli 0 tertimpa karena 0 dianggap falsy)

// Operator ?? HANYA menggantikan jika nilainya null atau undefined
const kuotaNullish = responsServer.data.pengguna.pengaturan.kuotaUploadMb ?? 50;
console.log(kuotaNullish); // 0 (BENAR! Angka nol tetap dipertahankan)
```

---

### 4.2 Paradigma Immutability: Mengapa Tidak Boleh Memutasi Data Langsung?

Di mata kuliah Pemrograman Dasar, kalian mungkin terbiasa mengubah isi array atau objek secara langsung:
```javascript
const daftarSiswa = ["Ali", "Budi"];
daftarSiswa.push("Cici"); // Mutasi langsung (In-place mutation)
```

Dalam pengembangan web modern dengan React atau Next.js, **kebiasaan ini harus dihentikan.**

#### Mengapa React Menuntut Immutability?
React bekerja berdasarkan deteksi perubahan state untuk menentukan apakah komponen perlu digambar ulang (*re-render*).
Untuk efisiensi komputasi, React **tidak memeriksa isi seluruh properti objek secara mendalam (*deep equality check*)**. React hanya memeriksa apakah **alamat memori (referensi objek)** berubah menggunakan perbandingan cepat `Object.is(stateLama, stateBaru)`.

```
[OBJEK LAMA di Alamat 0x001] ---> { nama: "Andi", skor: 80 }
                                        |
(Jika dimutasi langsung: obj.skor = 90) v
[OBJEK SAMA di Alamat 0x001] ---> { nama: "Andi", skor: 90 }
React membandingkan: 0x001 === 0x001? TRUE!
Kesimpulan React: "Tidak ada data yang berubah. Tampilan TIDAK AKAN di-render ulang!"
```

Jika kalian memutasi data langsung di alamat memori yang sama, React menganggap tidak ada perubahan sama sekali. Akibatnya antarmuka di layar tidak akan berubah meskipun variabel kalian sudah berganti nilai!

#### Tabel Operasi Array: Mana yang Aman vs Berbahaya

| Operasi | ❌ Mutasi Langsung (Dilarang di State) | ✅ Pendekatan Imutable (Wajib Dipakai) |
| :--- | :--- | :--- |
| **Menambah Item** | `array.push(item)`, `array.unshift(item)` | `[...array, item]`, `[item, ...array]` |
| **Menghapus Item** | `array.splice(index, 1)`, `array.pop()` | `array.filter(item => item.id !== targetId)` |
| **Mengubah Item** | `array[index].status = "Selesai"` | `array.map(item => item.id === targetId ? { ...item, status: "Selesai" } : item)` |
| **Mengurutkan Data** | `array.sort()`, `array.reverse()` | `array.toSorted()`, `array.toReversed()`, atau `[...array].sort()` |

Perhatikan contoh penerapan pola mutasi aman yang paling sering dipakai di aplikasi nyata:

```javascript
// Kasus: Daftar Tugas Kuliah
const initialTodos = [
  { id: 1, judul: "Belajar HTML Semantik", selesai: true },
  { id: 2, judul: "Latihan Flexbox", selesai: false },
  { id: 3, judul: "Mengerjakan Kuis Modul 1", selesai: false },
];

// 1. Menambah Tugas Baru (Tanpa push)
const tugasBaru = { id: 4, judul: "Belajar JavaScript ES6", selesai: false };
const todosSetelahTambah = [...initialTodos, tugasBaru];

// 2. Menandai Tugas ID: 2 Menjadi Selesai (Tanpa mutasi properti langsung)
const todosSetelahEdit = todosSetelahTambah.map(todo => {
  if (todo.id === 2) {
    return { ...todo, selesai: true }; // Mengembalikan objek baru dengan referensi baru
  }
  return todo; // Objek yang tidak berubah tetap memakai referensi lama (hemat memori)
});

// 3. Menghapus Tugas ID: 1 (Tanpa splice)
const todosSetelahHapus = todosSetelahEdit.filter(todo => todo.id !== 1);

console.log("State Akhir:", todosSetelahHapus);
```

---

### 4.3 Asynchronous JavaScript & Anatomi Event Loop

JavaScript secara alami adalah bahasa pemrograman **single-threaded** (hanya memiliki satu jalur eksekusi / satu Call Stack). Artinya, JavaScript hanya bisa mengerjakan satu hal dalam satu waktu.

Lalu bagaimana sebuah aplikasi web bisa mengambil data dari server selama 2 detik sambil tetap merespons klik tombol animasi pengguna secara mulus tanpa membuat browser macet (*freeze*)?

Jawabannya adalah arsitektur **Event Loop** yang disediakan oleh runtime host (Browser Web API atau Node.js C++ core).

```
   [CALL STACK]                [WEB APIs / BACKGROUND]
 (Menjalankan baris kode)    (Timer, Network fetch, DOM Events)
         |                                |
         | (Selesai diproses)             v
         |                        [TASK QUEUES]
         |                   1. Microtask Queue (Promise.then, async/await)
         |<----------------- 2. Macrotask Queue (setTimeout, setInterval)
   [EVENT LOOP]
   (Memeriksa jika Call Stack KOSONG,
    masukkan antrean Microtask DULU, baru Macrotask)
```

#### Menelusuri Urutan Eksekusi Nyata
Coba amati teka-teki logika berikut. Jika kalian bisa menebak urutan outputnya dengan tepat, kalian sudah memahami Event Loop:

```javascript
console.log("1. Mulai");

setTimeout(() => {
  console.log("2. Timer Macrotask Selesai");
}, 0); // Waktu tunda 0 milidetik!

Promise.resolve().then(() => {
  console.log("3. Promise Microtask Selesai");
});

console.log("4. Selesai");
```

**Berapa urutan cetaknya?**
Banyak pemula menebak: `1 -> 2 -> 3 -> 4` atau `1 -> 4 -> 2 -> 3`.
**Urutan yang BENAR adalah:**
```
1. Mulai
4. Selesai
3. Promise Microtask Selesai
2. Timer Macrotask Selesai
```

**Kenapa bisa begitu?**
1. `console.log("1. Mulai")` masuk Call Stack, dieksekusi langsung.
2. `setTimeout(..., 0)` diserahkan ke Web API Timer. Meskipun delay 0ms, callback-nya masuk ke **Macrotask Queue**.
3. `Promise.resolve().then(...)` diserahkan ke **Microtask Queue**.
4. `console.log("4. Selesai")` masuk Call Stack, dieksekusi langsung.
5. Sekarang Call Stack kosong! Event Loop memeriksa antrean.
6. **Aturan Prioritas Mutlak**: Seluruh antrean di **Microtask Queue** WAJIB dikuras habis terlebih dahulu sebelum mengambil satu tugas dari **Macrotask Queue**.
7. Karena itu, output nomor `3` (Microtask) dicetak terlebih dahulu sebelum nomor `2` (Macrotask)!

---

### 4.4 Pola Modern: Promise, `async/await`, dan Penanganan Paralel

Pada masa lampau, operasi asinkron ditangani menggunakan callback berlapis yang menghasilkan kode mengerikan bernama *Callback Hell*. Di era modern, kita menggunakan `async/await` yang membuat kode asinkron terbaca bersih seperti kode sinkron linier.

#### Struktur `async/await` Defensif Standar Industri

```typescript
interface DataMateri {
  id: number;
  judul: string;
}

async function ambilDaftarMateri(kategori: string): Promise<DataMateri[]> {
  const url = `https://api.velqora.ac.id/materi?kategori=${encodeURIComponent(kategori)}`;
  
  try {
    const response = await fetch(url, {
      headers: { "Accept": "application/json" }
    });

    // PENTING: fetch() TIDAK otomatis melempar error pada status code 404 atau 500!
    // fetch() hanya melempar error jika ada kegagalan jaringan fisik (DNS failure, offline).
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status} (${response.statusText})`);
    }

    const data: DataMateri[] = await response.json();
    return data;
  } catch (error) {
    // Logging telemetri internal untuk tim engineer
    console.error(`[API ERROR] Gagal memuat materi kategori ${kategori}:`, error);
    
    // Lempar kembali error yang sudah diformat ramah atau kembalikan data fallback
    throw error;
  } finally {
    // Bagian ini selalu dieksekusi baik sukses maupun gagal
    // Sangat ideal untuk mematikan status loading spinner
    console.log(`[NETWORK] Selesai memproses request untuk kategori: ${kategori}`);
  }
}
```

#### Eksekusi Paralel vs Sekuensial: Menghemat Waktu Pengguna
Bayangkan halaman dashboard kalian membutuhkan data profil pengguna (butuh waktu 1 detik) dan data notifikasi (butuh waktu 1 detik).

```javascript
// ❌ POLA SEKUENSIAL LAMBAT (TOTAL WAKTU: 2 DETIK):
// Notifikasi baru mulai diambil SETELAH profil selesai
const profil = await fetchProfil();      // Tunggu 1s
const notifikasi = await fetchNotif();    // Tunggu 1s lagi
// Total waktu tunggu pengguna = 2 detik

// ✅ POLA PARALEL DENGAN PROMISE.ALL (TOTAL WAKTU: 1 DETIK):
// Keduanya ditembakkan secara serentak di jaringan
const [profil, notifikasi] = await Promise.all([
  fetchProfil(),
  fetchNotif()
]);
// Total waktu tunggu = hanya selama operasi yang paling lama (1 detik)!
```

Jika kalian memiliki beberapa request yang saling independen dan tidak ingin satu request yang gagal menggagalkan yang lain, gunakan `Promise.allSettled()`:

```javascript
const hasil = await Promise.allSettled([
  ambilNilaiTugas(),
  ambilJadwalKuliah(),
  ambilPengumumanDarurat()
]);

hasil.forEach((res, index) => {
  if (res.status === "fulfilled") {
    console.log(`Endpoint ${index} sukses:`, res.value);
  } else {
    console.warn(`Endpoint ${index} gagal:`, res.reason);
  }
});
```

---

### 4.5 Catatan dari Lapangan: Jebakan Asinkron & Memori

#### 1. Perangkap Salinan Dangkal (*Shallow Copy Trap*)
Banyak pengembang mengira bahwa menulis `{ ...objek }` membuat duplikat objek secara mandiri seutuhnya. Padahal operator spread hanya menyalin level pertama:

```javascript
const userAsli = {
  nama: "Dina",
  preferensi: { tema: "gelap" } // Properti nested
};

// Melakukan shallow copy:
const userKloning = { ...userAsli };

// Mengubah properti nested pada kloning:
userKloning.preferensi.tema = "terang";

// DAMPAKNYA: Objek asli ikut terubah!
console.log(userAsli.preferensi.tema); // "terang" (BOCOR!)
```
**Solusi Modern**: Gunakan fungsi standar browser modern `structuredClone()` untuk melakukan kloning mendalam (*deep clone*):
```javascript
const userKloningAman = structuredClone(userAsli);
userKloningAman.preferensi.tema = "kontras-tinggi";
console.log(userAsli.preferensi.tema); // Tetap "gelap"!
```

#### 2. Jebakan `async` di Dalam `Array.prototype.forEach`
Ini kesalahan yang paling sering saya temukan saat memeriksa tugas mahasiswa:
```javascript
// ❌ JANGAN PERNAH LAKUKAN INI:
async function simpanSemuaData(daftarId) {
  daftarId.forEach(async (id) => {
    await kirimKeServer(id);
  });
  console.log("Semua data berhasil disimpan!"); // DUSTA BESAR!
}
```
Metode `forEach` **tidak peduli** pada Promise yang dikembalikan oleh callback-nya. Baris cetak "Semua data berhasil disimpan" akan langsung dijalankan sebelum satu pun pemanggilan `kirimKeServer` selesai!  
**Gunakan `for...of` jika ingin sekuensial berurutan, atau `Promise.all` jika ingin paralel.**

---

## 5. Latihan & Tugas Praktik

### Latihan 1: Manipulator Data Nilai Mahasiswa Imutable (Tingkat Dasar)

Diberikan dataset nilai mahasiswa dalam bentuk array objek:

```javascript
const dataKelas = [
  { id: 101, nama: "Ahmad Fauzi", kuis: 75, tugas: 80, aktif: true },
  { id: 102, nama: "Bella Safitri", kuis: 90, tugas: 85, aktif: true },
  { id: 103, nama: "Candra Wijaya", kuis: 60, tugas: 70, aktif: false },
  { id: 104, nama: "Dita Lestari", kuis: 88, tugas: 92, aktif: true },
];
```

**Tugas Kalian**:  
Tulis modul fungsi menggunakan prinsip **immutability murni** (tanpa mengubah array asli `dataKelas`):
1. **Fungsi `hitungNilaiAkhir(data)`**: Gunakan metode `.map()` untuk mengembalikan array baru di mana setiap mahasiswa memiliki properti baru `nilaiAkhir` dengan rumus: $(0.4 \times \text{kuis}) + (0.6 \times \text{tugas})$.
2. **Fungsi `saringMahasiswaAktif(data)`**: Gunakan `.filter()` untuk mengambil hanya mahasiswa yang berstatus `aktif === true` dan memiliki `nilaiAkhir >= 80`.
3. **Fungsi `hitungRataRataKelas(data)`**: Gunakan `.reduce()` untuk menghitung nilai rata-rata kuis seluruh kelas menjadi satu nilai angka murni.

---

### Latihan 2: Resilient Fetcher dengan Exponential Backoff (Tingkat Lanjutan)

Di dunia nyata, koneksi internet pengguna sering kali mengalami gangguan singkat (*network glitch*). Menyerah begitu saja pada request pertama adalah tanda kode amatir.

**Tugas Kalian**:  
Buat fungsi JavaScript bernama `fetchDenganRetry(url, opsi, maxPercobaan = 3)` dengan kriteria:
1. Menjalankan `fetch()` ke URL yang ditentukan.
2. Jika request gagal karena error jaringan atau status code `5xx` (server error), fungsi otomatis mengulang kembali pemanggilan hingga maksimal `maxPercobaan` kali.
3. Terapkan jeda waktu *exponential backoff* sebelum mencoba lagi: Percobaan 1 gagal -> tunggu 500ms -> Percobaan 2 gagal -> tunggu 1000ms -> Percobaan 3 gagal -> lempar error permanen.
4. Uji fungsi kalian menggunakan URL dummy berikut:
   - URL Sukses: `https://jsonplaceholder.typicode.com/posts/1`
   - URL Gagal: `https://httpstat.us/503` (menghasilkan status Service Unavailable)

---

## 6. Studi Kasus Nyata

### Kasus: "Bug Keranjang Belanja yang Menggandakan Diskon Akibat Mutasi Referensi Objek"

#### Skenario Masalah
Pada gelombang diskon kilat (*Flash Sale*) akhir tahun 2025, sebuah aplikasi e-commerce toko buku digital mengalami kerugian finansial puluhan juta rupiah dalam waktu dua jam pertama.
Banyak pengguna melaporkan kejanggalan: ketika mereka menerapkan kupon diskon 20% pada satu buku pemrograman, seluruh buku lain di dalam keranjang belanja mereka secara misterius ikut terpotong diskon 20%, bahkan buku yang seharusnya tidak mendapatkan promo.

#### Investigasi Akar Masalah di Kode Frontend
Tim engineer menelusuri fungsi pembaruan keranjang belanja di file state management toko:

```javascript
// KODE BERBAHAYA YANG MENYEBABKAN KERUGIAN:
function terapkanPromoBuku(keranjang, targetId, diskonPersen) {
  // Pengembang mengambil item menggunakan find()
  const itemPromo = keranjang.items.find(item => item.id === targetId);
  
  if (itemPromo) {
    // ❌ KESALAHAN FATAL:
    // Pengembang menduplikasi objek promo dasar dari template katalog umum
    // Katalog template: const templateDiskon = { aktif: false, persentase: 0 };
    // Seluruh item di keranjang mereferensikan memori objek diskon yang SAMA!
    itemPromo.promo.aktif = true;
    itemPromo.promo.persentase = diskonPersen;
  }
  
  return { ...keranjang };
}
```

Ketika item buku dimasukkan ke keranjang saat inisialisasi, pengembang junior menugaskan objek diskon default dari satu variabel konstan global tunggal: `item.promo = DEFAULT_PROMO_CONFIG`.
Akibatnya, setiap buku di dalam keranjang belanja memiliki properti `.promo` yang menunjuk ke **alamat memori yang persis sama**.
Ketika kode di atas menulis `itemPromo.promo.persentase = diskonPersen`, mutasi tersebut seketika mengubah properti promo di seluruh buku di keranjang belanja pengguna!

#### Solusi Perbaikan Arsitektur
1. **Penerapan Deep Immutable Update**:
   ```javascript
   function terapkanPromoBukuAman(keranjang, targetId, diskonPersen) {
     return {
       ...keranjang,
       items: keranjang.items.map(item => {
         if (item.id !== targetId) return item;
         
         return {
           ...item,
           promo: {
             ...item.promo, // Memutus referensi objek nested lama
             aktif: true,
             persentase: diskonPersen
           }
         };
       })
     };
   }
   ```
2. **Pembekuan Objek Template (*Object Freezing*)**:
   Variabel konfigurasi global kini dibekukan secara permanen di tingkat bahasa: `const DEFAULT_PROMO_CONFIG = Object.freeze({ aktif: false, persentase: 0 });`. Jika ada baris kode yang mencoba memutasinya di masa depan, JavaScript di lingkungan development akan langsung melempar error keras (*hard error*).
3. **Pemberlakuan Linter Rule**:
   Mengaktifkan aturan ESLint `eslint-plugin-functional` yang melarang mutasi properti objek langsung pada basis kode tim.

---

## 7. Rangkuman Reflektif

Framework web seperti React, Vue, Next.js, atau Svelte akan terus berevolusi dan mungkin berganti tren setiap lima tahun sekali. Namun, logika komputasi di baliknya tidak pernah berubah: **mereka semua adalah JavaScript murni.**

Memahami bagaimana JavaScript mengelola alamat memori, bagaimana data ditransformasikan tanpa merusak kondisi aslinya, serta bagaimana Event Loop mengatur giliran eksekusi kode asinkron adalah pembeda utama antara seseorang yang sekadar *"bisa mengikuti tutorial"* dengan seorang **perekayasa perangkat lunak profesional**.

Pegang erat prinsip-prinsip ini. Di **Modul 04**, kita akan melihat bagaimana seluruh konsep immutability dan dekonstruksi data ini menjadi fondasi utama saat kita membangun komponen reaktif pertama kita di **React Modern**.

---

## 8. Evaluasi & Kuis Pemahaman

### Pilihan Ganda

#### Soal 1
Perhatikan potongan kode JavaScript berikut:
```javascript
const konfigurasi = {
  namaSitus: "Velqora",
  versi: 1.0,
  fitur: { komentar: true, analitik: false }
};

const kloning = { ...konfigurasi };
kloning.namaSitus = "Portal Kuliah";
kloning.fitur.analitik = true;

console.log(konfigurasi.namaSitus, konfigurasi.fitur.analitik);
```
Apa output yang dicetak pada baris konsol terakhir?
- A. `Velqora false`
- B. `Velqora true`
- C. `Portal Kuliah true`
- D. `Portal Kuliah false`

> **Kunci Jawaban: B**  
> **Pembahasan**: Operator spread `{ ...konfigurasi }` melakukan *shallow copy*. Properti tingkat pertama (`namaSitus`) disalin nilainya secara terpisah sehingga `konfigurasi.namaSitus` tetap `"Velqora"`. Namun properti bertingkat (`fitur`) adalah objek referensi, sehingga `kloning.fitur` dan `konfigurasi.fitur` merujuk ke alamat memori yang sama. Mengubah `kloning.fitur.analitik = true` ikut mengubah objek asli menjadi `true`.

---

#### Soal 2
Diberikan array state berikut di React:
```javascript
const [skorList, setSkorList] = useState([70, 85, 90]);
```
Manakah cara yang **tepat dan aman (immutable)** untuk menambahkan angka `95` ke dalam state tersebut?
- A. `skorList.push(95); setSkorList(skorList);`
- B. `setSkorList([...skorList, 95]);`
- C. `setSkorList(skorList.unshift(95));`
- D. `skorList[3] = 95; setSkorList(skorList);`

> **Kunci Jawaban: B**  
> **Pembahasan**: Metode `push`, `unshift`, dan assignment indeks langsung memutasi array lama di alamat memori yang sama, sehingga React tidak mendeteksi perubahan referensi dan tidak me-render ulang komponen. Sintaks `[...skorList, 95]` menciptakan array baru dengan referensi memori baru yang berisi elemen lama ditambah 95.

---

#### Soal 3
Perhatikan urutan kode eksekusi asinkron berikut:
```javascript
console.log("Alpha");

setTimeout(() => {
  console.log("Bravo");
}, 0);

Promise.resolve().then(() => {
  console.log("Charlie");
});

console.log("Delta");
```
Urutan kemunculan teks yang benar di konsol adalah:
- A. `Alpha -> Bravo -> Charlie -> Delta`
- B. `Alpha -> Delta -> Bravo -> Charlie`
- C. `Alpha -> Delta -> Charlie -> Bravo`
- D. `Alpha -> Charlie -> Delta -> Bravo`

> **Kunci Jawaban: C**  
> **Pembahasan**: Kode sinkron dijalankan lebih dulu: `Alpha`, lalu `Delta`. Setelah Call Stack kosong, Event Loop memprioritaskan antrean Microtask (`Promise.then`) sebelum antrean Macrotask (`setTimeout`). Oleh karena itu, `Charlie` dieksekusi sebelum `Bravo`.

---

#### Soal 4
Dua operasi asinkron `ambilProfil()` (memakan waktu 3 detik) dan `ambilNotifikasi()` (memakan waktu 2 detik) dijalankan secara independen dengan kode:
```javascript
const [profil, notifikasi] = await Promise.all([
  ambilProfil(),
  ambilNotifikasi()
]);
```
Berapa total waktu yang dibutuhkan hingga baris kode tersebut selesai dieksekusi?
- A. Sekitar 5 detik.
- B. Sekitar 3 detik.
- C. Sekitar 2 detik.
- D. Sekitar 1 detik.

> **Kunci Jawaban: B**  
> **Pembahasan**: `Promise.all()` mengeksekusi kedua Promise secara bersamaan (*concurrently* di level IO). Total waktu yang dibutuhkan sama dengan durasi Promise yang paling lama selesai, yaitu 3 detik (bukan dijumlahkan).

---

#### Soal 5
Perhatikan penggunaan operator nullish dan OR berikut:
```javascript
const nilaiUjian = 0;
const statusA = nilaiUjian || 100;
const statusB = nilaiUjian ?? 100;

console.log(statusA, statusB);
```
Nilai yang dicetak adalah:
- A. `100 100`
- B. `0 0`
- C. `100 0`
- D. `0 100`

> **Kunci Jawaban: C**  
> **Pembahasan**: Operator `||` memperlakukan angka `0` sebagai nilai falsy sehingga beralih ke nilai cadangan `100`. Sedangkan operator `??` hanya beralih ke cadangan jika nilainya `null` atau `undefined`; karena `0` adalah angka terdefinisi, `statusB` mempertahankan nilai `0`.

---

### Soal Analisis & Kasus

#### Soal 6
Jelaskan mengapa pemanggilan fungsi `fetch()` bawaan di browser tidak otomatis melempar galat (*throw error*) masuk ke blok `catch` ketika server merespons dengan status code `404 Not Found` atau `500 Internal Server Error`! Bagaimana cara penanganan yang benar?

> **Pembahasan Soal 6**:  
> Menurut spesifikasi standar Fetch API, sebuah Promise dari `fetch()` hanya akan ditolak (*rejected*) jika terjadi kegagalan jaringan fisik total (seperti perangkat offline, DNS lookup gagal, atau server tidak merespons sama sekali).  
> Respons dengan status code 404 atau 500 tetap dianggap sebagai **komunikasi HTTP yang sah dan berhasil tiba** di browser.  
> Oleh karena itu, developer wajib memeriksa properti boolean `response.ok` (yang bernilai true untuk status 200–299) secara manual:
> ```javascript
> const res = await fetch(url);
> if (!res.ok) {
>   throw new Error(`Gagal memuat data: ${res.status}`);
> }
> const data = await res.json();
> ```

---

#### Soal 7
Analisis potongan kode loop berikut dan jelaskan di mana letak kesalahan logikanya:
```javascript
async function sinkronkanData(daftarPengguna) {
  console.log("Mulai sinkronisasi...");
  daftarPengguna.forEach(async (pengguna) => {
    await kirimKeCloud(pengguna);
  });
  console.log("Sinkronisasi tuntas!");
}
```

> **Pembahasan Soal 7**:  
> Metode `Array.prototype.forEach` tidak dirancang untuk menangani fungsi callback asinkron. `forEach` mengeksekusi callback untuk setiap elemen secara sinkron berturut-turut tanpa menunggu (*await*) Promise dari callback tersebut selesai.  
> Akibatnya, baris `console.log("Sinkronisasi tuntas!")` akan langsung dieksekusi beberapa milidetik setelahnya, sementara request `kirimKeCloud` sebenarnya masih berjalan di latar belakang (atau bahkan gagal tanpa tertangkap).  
> Solusi yang benar:
> ```javascript
> // Pilihan A: Jika ingin dieksekusi satu per satu berurutan:
> for (const pengguna of daftarPengguna) {
>   await kirimKeCloud(pengguna);
> }
> // Pilihan B: Jika ingin dieksekusi serentak secara paralel:
> await Promise.all(daftarPengguna.map(p => kirimKeCloud(p)));
> ```

---

## 9. Referensi & Sumber Belajar Lanjutan

Perdalam pemahaman arsitektur JavaScript kalian melalui sumber-sumber standar berikut:

1. **JavaScript.info — The Modern JavaScript Tutorial**:  
   [https://javascript.info/](https://javascript.info/)  
   *Panduan terlengkap dan paling mendalam di dunia mengenai fitur ES6+, closures, prototypal inheritance, dan microtasks.*
2. **Philip Roberts — What the heck is the event loop anyway? (JSConf EU)**:  
   [https://www.youtube.com/watch?v=8aGhZQkoFbQ](https://www.youtube.com/watch?v=8aGhZQkoFbQ)  
   *Video presentasi legendaris visualisasi interaktif Call Stack, Web APIs, dan Event Loop.*
3. **MDN Web Docs — Asynchronous JavaScript**:  
   [https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)  
   *Dokumentasi resmi Mozilla mengenai konsep Promises, async/await, dan worker threads.*
4. **Jake Archibald — Tasks, microtasks, queues and schedules**:  
   [https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)  
   *Artikel teknis legendaris dari mantan engineer Google Chrome tentang seluk-beluk urutan prioritas eksekusi browser.*
