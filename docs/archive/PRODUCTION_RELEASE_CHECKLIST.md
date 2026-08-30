# VELQORA — PRODUCTION RELEASE CHECKLIST & OPERATIONAL RUNBOOK

Dokumentasi ini adalah checklist standar operasional bagi tim engineering saat merilis dan memelihara Velqora di lingkungan produksi.

---

## 1. Environment Variables Configuration
- [x] `NEXT_PUBLIC_SUPABASE_URL`: Endpoint proyek Supabase Cloud (HTTPS).
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Kunci anon publik Supabase.
- [x] `GEMINI_API_KEY`: API key Google Gemini (Server-side only).
- [x] Pastikan **TIDAK ADA** variabel rahasia berprefix `NEXT_PUBLIC_` untuk private keys.
- [x] Pastikan `.env.local` dikecualikan oleh `.gitignore`.

---

## 2. Supabase Cloud Connection & Database
- [x] Proyek Supabase aktif dengan status *Healthy*.
- [x] Tabel terpasang lengkap: `profiles`, `categories`, `tags`, `materials`, `material_tags`, `tasks`, `modules`, `module_chapters`, `files`, `recent_views`, `user_subscriptions`, `ai_chat_history`, `user_roles`.
- [x] Trigger `handle_new_user()` aktif untuk inisialisasi profil otomatis saat registrasi.
- [x] Trigger `update_updated_at_column()` aktif pada seluruh tabel dengan kolom `updated_at`.

---

## 3. Row-Level Security (RLS) Verification
- [x] RLS aktif (`ENABLE ROW LEVEL SECURITY`) pada seluruh 13 tabel aplikasi.
- [x] Kebijakan SELECT, INSERT, UPDATE, DELETE terikat langsung ke `auth.uid() = user_id`.
- [x] Tabel `user_roles` dilindungi kebijakan owner-only untuk mutasi hak akses.

---

## 4. Storage Bucket Security (`studyvault-files`)
- [x] Bucket `studyvault-files` dibuat di Supabase Storage.
- [x] Struktur jalur berkas menggunakan prefix multi-tenant `${user.id}/${timestamp}-${filename}`.
- [x] Kebijakan storage memverifikasi `auth.uid()::text = (storage.foldername(name))[1]`.
- [x] Server Action `deleteFile` memverifikasi kepemilikan record DB sebelum menghapus objek storage.

---

## 5. AI Services Resilience & Cost Protection
- [x] Kuota harian pengguna gratis (15 chat/hari) diverifikasi pada `src/actions/subscription-actions.ts`.
- [x] Batas panjang prompt di-clamp maksimal 10.000 karakter (`slice(0, 10000)`).
- [x] Kuota kuis dikunci antara 1 hingga 50 butir soal.
- [x] Sinyal timeout 30 detik (`AbortSignal.timeout(30000)`) terpasang pada fetch Gemini & Claude.
- [x] Rate limiting aktif: 20 AI query/menit dan 15 Kuis/menit per pengguna.
- [x] Preset offline fallback siap saat API key kosong atau rate limit tercapai.

---

## 6. Authentication & Authorization Boundaries
- [x] Middleware SSR (`src/middleware.ts`) me-refresh sesi dan mengamankan seluruh rute `/dashboard/*`.
- [x] Akses anonim otomatis dialihkan ke `/login`.
- [x] Pengguna terotentikasi yang mengakses auth page dialihkan ke `/dashboard`.
- [x] Server Actions mengambil identitas `user.id` dari `supabase.auth.getUser()`.
- [x] Aksi administratif memvalidasi email sesi aktif terhadap konstanta `OWNER_EMAIL`.

---

## 7. Observability, Logging & Rate Limiting
- [x] Modul `src/lib/observability.ts` menyediakan structured logging (`INFO`, `WARN`, `ERROR`).
- [x] Sanitasi otomatis meredaksi kata kunci sensitif (`password`, `token`, `key`, `secret`).
- [x] Generator Correlation ID (`generateCorrelationId`) untuk pelacakan error antar-layer.
- [x] In-memory sliding-window rate limiter dengan pembersihan otomatis setiap 5 menit.
- [x] Endpoint pemantau kesehatan aktif di `/api/health`.

---

## 8. Backup & Disaster Recovery
- [x] Ekspor data JSON memuat versioning skema dan stempel waktu ISO.
- [x] Payload ekspor bersih dari kredensial otentikasi, kata sandi, dan API keys.
- [x] Impor data memvalidasi struktur skema sebelum menerapkan pemulihan data.

---

## 9. Security Headers & Network Transport
- [x] `Strict-Transport-Security` (HSTS): `max-age=31536000; includeSubDomains; preload`.
- [x] `X-Content-Type-Options`: `nosniff`.
- [x] `X-Frame-Options`: `SAMEORIGIN`.
- [x] `Referrer-Policy`: `strict-origin-when-cross-origin`.
- [x] `Permissions-Policy`: `camera=(self), microphone=(self), geolocation=(self)`.
- [x] `poweredByHeader`: `false`.

---

## 10. Quality Assurance & Build Verification
- [x] `npm run lint` $\to$ 0 Errors.
- [x] `npx tsc --noEmit` $\to$ 0 Errors.
- [x] `npm run build` $\to$ Sukses pada seluruh 34 rute aplikasi.
- [x] Responsive layout teruji pada breakpoint 320px hingga 1920px.
- [x] Aksesibilitas keyboard terverifikasi (bebas keyboard trap, visible focus ring).

---

## 11. Rollback Plan
Jika terjadi anomali kritis pada deployment baru:
1. **Penyedia Hosting (Vercel / Cloud Run / VPS):**
   - Lakukan *Instant Rollback* ke commit hash stabil sebelumnya melalui dashboard deployment.
2. **Database:**
   - Semua migrasi database (`001` - `006`) bersifat *additive* (*non-destructive*), sehingga versi aplikasi sebelumnya tetap kompatibel.
3. **Storage:**
   - Berkas pengguna tidak dipengaruhi oleh rollback kode aplikasi.
