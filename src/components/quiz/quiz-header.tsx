"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

interface QuizHeaderProps {
  quizState: "setup" | "playing" | "finished";
  onReset: () => void;
}

export function QuizHeader({ quizState, onReset }: QuizHeaderProps) {
  return (
    <PageHeader
      eyebrow="Evaluasi Pemahaman"
      title="Kuis AI"
      description="Uji pemahaman akademik dan retensi materi melalui kuis interaktif yang dihasilkan secara terstruktur oleh AI."
      actions={
        quizState !== "setup" ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            className="gap-1.5 text-xs text-text-secondary hover:text-text-primary shrink-0 cursor-pointer"
            aria-label="Kembali ke pengaturan kuis"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pengaturan Kuis</span>
          </Button>
        ) : undefined
      }
    />
  );
}
