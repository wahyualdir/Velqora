---
kategori: "Kategori Fiktif 999"
title: "Catatan Sampel Pengujian Validasi Kategori"
tags: [test, skip-validation]
---

# Catatan Sampel Pengujian Validasi Kategori

Berkas ini sengaja disiapkan dengan field `kategori` fiktif yang tidak terdaftar di database Velqora.

Tujuannya adalah membuktikan mekanisme keamanan import:
1. Pratinjau sistem akan menandai berkas ini dengan status **Dilewati (Skip)**.
2. Alasan penolakan akan ditampilkan secara transparan: *"Kategori 'Kategori Fiktif 999' tidak ditemukan di database"*.
3. Sistem TIDAK AKAN membuat kategori baru secara diam-diam.
