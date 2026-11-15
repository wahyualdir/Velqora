import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import { getPublicNotebookBySlugAction } from "@/actions/notebook/notebooks";
import { NotebookWorkbench } from "@/components/notebook/notebook-workbench";
import { PageContainer } from "@/components/ui/section";

export default async function SharedPlaygroundNotebookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { notebook } = await getPublicNotebookBySlugAction(slug);

  if (!notebook) {
    return (
      <PageContainer className="py-12">
        <div className="max-w-lg mx-auto rounded-2xl border border-border bg-surface p-6 text-center space-y-3">
          <h1 className="text-base font-bold text-text-primary">
            Notebook Publik Tidak Ditemukan
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Tautan notebook ini mungkin telah dinonaktifkan oleh pemiliknya atau tidak tersedia.
          </p>
          <Link
            href="/dashboard/playground"
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl bg-[#C2553A] text-white text-xs font-mono font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Buka Velqora Lab Notebook</span>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2.5">
      <div className="px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/8 text-xs font-mono text-emerald-800 dark:text-emerald-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <span className="flex items-center gap-2">
          <Globe className="w-4 h-4 shrink-0" />
          <span>
            Mode Publik (Read-Only) — Jalankan sel langsung di browser atau klik{" "}
            <strong>Salin &amp; Edit</strong> untuk memodifikasi.
          </span>
        </span>
        <Link
          href="/dashboard/playground"
          className="underline font-semibold hover:opacity-80"
        >
          Buat Notebook Baru
        </Link>
      </div>

      <Suspense fallback={null}>
        <NotebookWorkbench
          initialDocument={notebook}
          readOnly
          shareSlug={slug}
        />
      </Suspense>
    </div>
  );
}
