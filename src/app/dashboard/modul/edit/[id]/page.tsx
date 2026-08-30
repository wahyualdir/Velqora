"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UnifiedContentForm } from "@/components/modul/unified-content-form";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Module } from "@/types";

export default function EditModulDanProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      if (!id) return;
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("modules")
          .select("*, chapters:module_chapters(*)")
          .eq("id", id)
          .single();

        if (error || !data) {
          toast.error("Konten tidak ditemukan atau telah dihapus");
          router.push("/dashboard/modul");
          return;
        }

        setModuleData(data);
      } catch (err: any) {
        toast.error("Gagal memuat konten: " + err.message);
        router.push("/dashboard/modul");
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!moduleData) return null;

  return (
    <UnifiedContentForm
      initialKind={moduleData.kind || "module"}
      initialData={moduleData}
      isEditing={true}
      onSuccess={() => {
        router.push(`/dashboard/modul`);
      }}
    />
  );
}
