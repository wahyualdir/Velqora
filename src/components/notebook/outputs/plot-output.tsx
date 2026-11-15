"use client";

import React, { useState } from "react";
import { Download, Maximize2, X } from "lucide-react";

interface PlotOutputProps {
  mimeType: "image/png" | "image/svg+xml" | "image/jpeg";
  data: string;
  caption?: string;
}

export function PlotOutput({ mimeType, data, caption }: PlotOutputProps) {
  const [zoomed, setZoomed] = useState(false);

  const src =
    mimeType === "image/svg+xml"
      ? data.startsWith("<")
        ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}`
        : data.startsWith("data:")
        ? data
        : `data:image/svg+xml;base64,${data}`
      : data.startsWith("data:")
      ? data
      : `data:${mimeType};base64,${data}`;

  const handleDownload = () => {
    const ext = mimeType === "image/svg+xml" ? "svg" : mimeType === "image/jpeg" ? "jpg" : "png";
    const a = document.createElement("a");
    a.href = src;
    a.download = `velqora-plot-${Date.now()}.${ext}`;
    a.click();
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-white p-3 space-y-2 relative group">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[#E4DDD4] bg-[#FAF8F5] text-[10.5px] font-mono text-[#524B42] hover:text-[#1C1917] cursor-pointer"
            title="Perbesar grafik"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Zoom</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[#E4DDD4] bg-[#FAF8F5] text-[10.5px] font-mono text-[#524B42] hover:text-[#1C1917] cursor-pointer"
            title="Unduh gambar grafik"
          >
            <Download className="w-3 h-3" />
            <span>Unduh</span>
          </button>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption || "Visualisasi Matplotlib / Grafik Notebook"}
          className="max-w-full max-h-[460px] h-auto mx-auto rounded-lg object-contain"
        />

        {caption && (
          <p className="text-[11px] font-mono text-center text-[#524B42]">{caption}</p>
        )}
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div
            className="relative max-w-5xl max-h-[92dvh] bg-white rounded-2xl p-4 shadow-2xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomed(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-lg border border-[#E4DDD4] bg-[#FAF8F5] text-[#1C1917] flex items-center justify-center cursor-pointer"
              aria-label="Tutup zoom grafik"
            >
              <X className="w-4 h-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={caption || "Grafik Notebook Diperbesar"}
              className="max-w-full max-h-[82dvh] h-auto mx-auto object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
