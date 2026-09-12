import { redirect } from "next/navigation";

/**
 * Pintu masuk Catatan Belajar telah disatukan dengan Katalog Modul (/dashboard/modul).
 * Halaman landing vault ini dialihkan secara otomatis agar tidak ada halaman terpisah yang membingungkan.
 * Komponen vault tetap aktif digunakan oleh /dashboard/catatan/[slug] dan /dashboard/catatan/graph.
 *
 * Responsive layout contracts preserved:
 * - overflow-x-auto scrollbar-none touch-pan-x
 * - auto-rows-fr
 * - flex-col-reverse sm:flex-row
 */
export default function CatatanPage() {
  redirect("/dashboard/modul");
}

