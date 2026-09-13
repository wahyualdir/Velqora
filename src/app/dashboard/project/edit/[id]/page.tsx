"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/project/project-form";
import { getProjectById } from "@/actions/study/projects";
import { Project } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!projectId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectById(projectId);
        if (!data) {
          setError("Proyek tidak ditemukan.");
        } else {
          setProject(data);
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat data proyek.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-text-primary">
          {error || "Proyek Tidak Ditemukan"}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/project")}
        >
          Kembali ke Repositori Project
        </Button>
      </div>
    );
  }

  return <ProjectForm initialData={project} isEditing={true} />;
}
