# VELQORA — PHASE 2.3-B: REMEDIASI SISTEM GENERATOR KONTEN

> **Dokumen Deliverable**: `docs/curriculum-rework/PHASE_2_3_B_GENERATOR_REMEDIATION.md`  
> **Status**: COMPLETED & VERIFIED BY UNIT TESTS  
> **Berkas Terkait**: `scripts/curriculum-generator/adaptive-schema.ts`, `scripts/curriculum-generator/__tests__/substantive-generator.test.ts`  
> **Hasil Pengujian Guardrail**: 3/3 Tests PASS (`substantive-generator.test.ts`)  
> **Tanggal Pelaksanaan**: 2026-09-16  

---

## 1. Forensik Generator Sintetis Lama (`generate.ts`)

Investigasi terhadap berkas generator sebelumnya (`scripts/curriculum-generator/generate.ts`) mengungkap akar masalah kegagalan Phase 2.2:

1. **Injeksi Template Skeleton Kaku**:
   Pada baris 238–258, generator menggunakan *string interpolation* statis:
   ```typescript
   let markdown = `# ${ch.num}.${sub.subNum}. ${sub.title}\n\n`;
   markdown += `> **Konsep Kunci (${sub.conceptEn})**: Materi ini menyajikan eksplorasi mendalam... dalam ekosistem ${spec.title}.\n\n`;
   markdown += `## 1. Definisi & Signifikansi Konseptual\nDalam pemodelan ${spec.title}, pemahaman terhadap **${sub.title}** (${sub.conceptEn}) merupakan fondasi krusial untuk menjamin keandalan sistem...`;
   ```
   Generator hanya menukar variabel nama topik dan konsep ke dalam kalimat yang sama persis untuk seluruh 4.050 subbab.

2. **Otomatisasi 40.500 Unit Sub-subbab Hampa**:
   Pada baris 260–273, generator memaksakan pembuatan 10 unit per subbab dengan rumus:
   ```typescript
   content_markdown: `### ${ch.num}.${sub.subNum}.${uNum}. ${unitTitle}\n\nPembahasan fokus mengenai **${unitTitle}** dalam konteks ${sub.title}. Memastikan penguasaan mendalam terhadap aspek teoritis, batasan komputasi, dan teknik integrasi tingkat lanjut.`
   ```
   Teks ini hanya berbobot ~25 kata per unit dan tidak mengandung penurunan rumus, studi empiris, maupun materi substantif.

3. **Penyematan Output Kode Palsu**:
   Pada baris 253 dan 297:
   ```typescript
   expectedOutput: "Status eksekusi: Komputasi berhasil dan output metrik valid."
   ```
   Generator menetapkan string ini secara default tanpa menjalankan kode di runtime Python.

4. **Loop Sitasi Berulang**:
   Pada baris 303–305:
   ```typescript
   references: [
     VERIFIED_SOURCES_CATALOG[spec.sourceKeys[0]] || VERIFIED_SOURCES_CATALOG["python-docs"]
   ]
   ```
   Setiap subbab selalu mengulang satu sumber pertama (yang sebagian besar adalah root docs seperti `python-docs`), menghasilkan 4.151 objek sitasi dari hanya 47 URL.

---

## 2. Arsitektur Generator Substantif Baru (`adaptive-schema.ts`)

Sistem generator lama telah digantikan oleh **Arsitektur Kurikulum Adaptif & Substantif** (`scripts/curriculum-generator/adaptive-schema.ts`) yang memberlakukan aturan:

1. **Struktur Adaptif (Bebas dari Jebakan Kuota 10x10)**:
   - Jumlah bab dan subbab ditentukan oleh kedalaman materi ilmiah sesungguhnya, bukan angka kaku 10.
   - Suatu bab fundamental dapat memiliki 3–6 subbab yang masing-masing mendalam (1.000–2.000 kata).
2. **Entitas Pembelajaran Lengkap (Substantive Unit Schema)**:
   Setiap unit pembelajaran wajib memiliki struktur analitis:
   - `purpose`: Alasan teknis keberadaan konsep dalam rekayasa sistem.
   - `conceptualExplanation`: Pemaparan teoritis orisinal.
   - `intuitionAnalogy`: Jembatan analogi intuitif dunia nyata.
   - `technicalDepth`: Detail komputasi, struktur data, dan arsitektur algoritma.
   - `mathematicalFormulation`: LaTeX KaTeX lengkap dengan kamus definisi variabel per simbol.
   - `workedExample`: Contoh soal numerik langkah-demi-langkah.
   - `codeExample`: Kode terverifikasi dengan dependensi eksplisit dan output aktual.
   - `commonPitfalls`: Kesalahan fatal praktisi (*anti-patterns*).
   - `theoreticalLimitations`: Asumsi batas dan kondisi di mana metode gagal.
   - `exercise`: Latihan mandiri dengan petunjuk (*hint*) dan kunci solusi/rubrik.
   - `references`: Rujukan primer spesifik (paper/API docs).
3. **Penutupan Bab Pedagogis Wajib**:
   - `summary`: Rangkuman intisari konsep bab penutup.
   - `transitionToNextChapter`: Narasi jembatan kognitif menuju bab selanjutnya.

---

## 3. Hasil Pengujian Guardrail Kualitas (`substantive-generator.test.ts`)

Suite pengujian otomatis (`node --import tsx --test scripts/curriculum-generator/__tests__/substantive-generator.test.ts`) memastikan bahwa generator tidak dapat lagi memproduksi konten sintetis:

```text
▶ Phase 2.3-B: Substantive Content Quality Guardrails
  ✔ Harus menolak template skeleton sintetis Phase 2.2 (4.28ms)
  ✔ Harus menolak expectedOutput placeholder sintetis (0.83ms)
  ✔ Harus menolak bab tanpa rangkuman dan tanpa jembatan transisi (0.78ms)
✔ Phase 2.3-B: Substantive Content Quality Guardrails (10.75ms)
ℹ tests 3, pass 3, fail 0
```

Dengan guardrails ini, setiap konten baru yang diproduksi wajib lolos validasi substantif sebelum dapat masuk ke dalam registri kurikulum.
