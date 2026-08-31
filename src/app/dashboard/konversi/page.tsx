"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CONVERSION_OPTIONS,
  ConversionOption,
  processPhotoAdvanced,
  enhanceImageToHD,
  convertTextToDocx,
  convertTextToPdf,
  convertImageToPdf,
  formatCodeOrJson,
  convertJsonToCsv,
  convertCsvToJson,
  applyCamScannerFilter,
  generateScannedPdfBatch,
  CamScannerFilterMode,
} from "@/lib/file-converter";
import { formatFileSize } from "@/lib/utils";
import { toast } from "sonner";
import { PageContainer } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { ConverterHeader } from "@/components/converter/converter-header";
import { ConverterCategoryNav } from "@/components/converter/converter-category-nav";
import { ConverterToolSelector } from "@/components/converter/converter-tool-selector";
import { ConverterWorkbench } from "@/components/converter/converter-workbench";
import { X, Camera, SwitchCamera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FileConverterPage() {
  const [activeCategory, setActiveCategory] = useState<
    "image" | "compress" | "document" | "data" | "code"
  >("image");

  const [selectedOption, setSelectedOption] = useState<ConversionOption>(
    CONVERSION_OPTIONS.find((o) => o.id === "doc-scanner") || CONVERSION_OPTIONS[0]
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTextContent, setFileTextContent] = useState<string>("");
  const [inputMode, setInputMode] = useState<"file" | "text">("file");

  // CamScanner State
  const [camFilterMode, setCamFilterMode] = useState<CamScannerFilterMode>("magic_color");
  const [scannedPages, setScannedPages] = useState<
    { id: string; blob: Blob; url: string; preview: string; name: string }[]
  >([]);
  const [scannerWatermark] = useState<string>("");
  // Advanced Photo Controls State
  const [photoBgColor, setPhotoBgColor] = useState<string>("none");
  const [pasfotoRatio, setPasfotoRatio] = useState<"3x4" | "4x6" | "2x3">("3x4");
  const [hdScale, setHdScale] = useState<2 | 4>(2);

  // Camera Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const [convertedResult, setConvertedResult] = useState<{
    blob?: Blob;
    text?: string;
    fileName: string;
    downloadUrl: string;
    fileSize: string;
    originalSize?: string;
    savingsPercent?: number;
    isHdEnhanced?: boolean;
  } | null>(null);

  const [isCopied, setIsCopied] = useState(false);

  // Category counts
  const categoryCounts: Record<string, number> = {
    image: CONVERSION_OPTIONS.filter((o) => o.category === "image").length,
    compress: CONVERSION_OPTIONS.filter((o) => o.category === "compress").length,
    document: CONVERSION_OPTIONS.filter((o) => o.category === "document").length,
    data: CONVERSION_OPTIONS.filter((o) => o.category === "data").length,
    code: CONVERSION_OPTIONS.filter((o) => o.category === "code").length,
  };

  const optionsInCurrentCategory = CONVERSION_OPTIONS.filter(
    (opt) => opt.category === activeCategory
  );

  // Handle Switch Category
  const handleSelectCategory = (
    catId: "image" | "compress" | "document" | "data" | "code"
  ) => {
    setActiveCategory(catId);
    const optionsInCat = CONVERSION_OPTIONS.filter((o) => o.category === catId);
    if (optionsInCat.length > 0) {
      handleSelectOption(optionsInCat[0]);
    }
  };

  // Handle Select Specific Tool
  const handleSelectOption = (option: ConversionOption) => {
    setSelectedOption(option);
    setSelectedFile(null);
    setConvertedResult(null);

    if (option.category === "code" || option.category === "data") {
      setInputMode("text");
      if (option.id === "code-beautifier" && !fileTextContent) {
        setFileTextContent(
          '{\n  "status": "success",\n  "data": {\n    "name": "Velqora",\n    "tools": ["Converter", "Dev", "Notes"]\n  }\n}'
        );
      } else if (option.id === "json-to-csv" && !fileTextContent) {
        setFileTextContent(
          '[\n  { "id": 1, "materi": "Next.js 15", "status": "Selesai" },\n  { "id": 2, "materi": "Machine Learning", "status": "Berjalan" }\n]'
        );
      } else if (option.id === "csv-to-json" && !fileTextContent) {
        setFileTextContent("id,materi,status\n1,Next.js 15,Selesai\n2,Machine Learning,Berjalan");
      } else if (option.id === "jwt-decoder" && !fileTextContent) {
        setFileTextContent(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IldhaHl1U3R1ZHkiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        );
      } else if (option.id === "hash-generator" && !fileTextContent) {
        setFileTextContent("Velqora Academic Tools");
      }
    } else {
      setInputMode("file");
      setFileTextContent("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setConvertedResult(null);

    if (selectedOption.id === "doc-scanner" && file.type.startsWith("image/")) {
      try {
        const filteredBlob = await applyCamScannerFilter(
          file,
          camFilterMode,
          0,
          scannerWatermark
        );
        const url = URL.createObjectURL(filteredBlob);
        const newPage = {
          id: Date.now().toString(),
          blob: filteredBlob,
          url,
          preview: url,
          name: file.name,
        };
        setScannedPages((prev) => [...prev, newPage]);
        toast.success(`Halaman "${file.name}" berhasil dipindai.`);
      } catch (err) {
        console.error(err);
      }
    }

    const isText =
      file.type.includes("text") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".json") ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".html") ||
      file.name.endsWith(".sql") ||
      file.name.endsWith(".js") ||
      file.name.endsWith(".ts");

    if (isText) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileTextContent(event.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setFileTextContent("");
    }

    toast.success(`Berkas "${file.name}" siap diproses.`);
  };

  // Camera Handlers
  const startCamera = async (facing: "user" | "environment" = "environment") => {
    setIsCameraOpen(true);
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      toast.error("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const handleSwitchCamera = () => {
    const nextFacing = cameraFacing === "user" ? "environment" : "user";
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const handleCaptureSnapshot = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (cameraFacing === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const pageNum = scannedPages.length + 1;
        const capturedFile = new File(
          [blob],
          `Scan_Halaman_${pageNum}.jpg`,
          { type: "image/jpeg" }
        );
        setSelectedFile(capturedFile);
        setConvertedResult(null);

        if (selectedOption.id === "doc-scanner") {
          const filteredBlob = await applyCamScannerFilter(
            capturedFile,
            camFilterMode,
            0,
            scannerWatermark
          );
          const url = URL.createObjectURL(filteredBlob);
          const newPage = {
            id: Date.now().toString(),
            blob: filteredBlob,
            url,
            preview: url,
            name: `Halaman ${pageNum}`,
          };
          setScannedPages((prev) => [...prev, newPage]);
          toast.success(`Halaman ${pageNum} berhasil dipindai`);
        } else {
          stopCamera();
          toast.success("Foto berhasil diambil");
        }
      },
      "image/jpeg",
      0.95
    );
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Main Conversion Dispatcher
  const handleConvert = async () => {
    if (selectedOption.id === "doc-scanner" && scannedPages.length > 0) {
      setIsConverting(true);
      setProgress(30);
      try {
        const batchPdfBlob = await generateScannedPdfBatch(
          scannedPages,
          "Dokumen CamScanner Velqora",
          scannerWatermark
        );
        const finalFileName = `CamScanner_Dokumen_${new Date().toISOString().slice(0, 10)}.pdf`;
        const downloadUrl = URL.createObjectURL(batchPdfBlob);
        setProgress(100);

        setConvertedResult({
          blob: batchPdfBlob,
          fileName: finalFileName,
          downloadUrl,
          fileSize: formatFileSize(batchPdfBlob.size),
        });
        toast.success(`${scannedPages.length} halaman siap diunduh dalam 1 PDF`);
      } catch {
        toast.error("Gagal menyatukan dokumen ke PDF.");
      } finally {
        setIsConverting(false);
      }
      return;
    }

    if (inputMode === "file" && !selectedFile) {
      toast.error("Silakan pilih berkas terlebih dahulu.");
      return;
    }

    if (inputMode === "text" && !fileTextContent.trim()) {
      toast.error("Silakan isi teks atau kode terlebih dahulu.");
      return;
    }

    setIsConverting(true);
    setProgress(20);

    try {
      const optId = selectedOption.id;

      // 1. HD Upscaler
      if (optId === "photo-hd" && selectedFile) {
        setProgress(50);
        const resultBlob = await enhanceImageToHD(selectedFile, hdScale, 1.3);
        const baseName = selectedFile.name.replace(/\.[^/.]+$/, "");
        const finalName = `${baseName}_UltraHD_${hdScale}X.png`;
        const url = URL.createObjectURL(resultBlob);
        setProgress(100);
        setConvertedResult({
          blob: resultBlob,
          fileName: finalName,
          downloadUrl: url,
          fileSize: formatFileSize(resultBlob.size),
          originalSize: formatFileSize(selectedFile.size),
          isHdEnhanced: true,
        });
        toast.success("Foto berhasil ditingkatkan ke Ultra HD.");
      }
      // 2. Pasfoto
      else if (optId === "photo-pasfoto" && selectedFile) {
        setProgress(50);
        const resultBlob = await processPhotoAdvanced(selectedFile, {
          cropRatio: "3:4",
          bgColor: photoBgColor !== "none" ? photoBgColor : undefined,
        });
        const baseName = selectedFile.name.replace(/\.[^/.]+$/, "");
        const finalName = `Pasfoto_${pasfotoRatio}_${baseName}.jpg`;
        const url = URL.createObjectURL(resultBlob);
        setProgress(100);
        setConvertedResult({
          blob: resultBlob,
          fileName: finalName,
          downloadUrl: url,
          fileSize: formatFileSize(resultBlob.size),
        });
        toast.success(`Pasfoto ${pasfotoRatio} siap diunduh.`);
      }
      // 3. Document / Text to PDF
      else if ((optId === "text-to-pdf" || optId === "md-to-pdf") && (fileTextContent || selectedFile)) {
        setProgress(50);
        const text = fileTextContent || (selectedFile ? await selectedFile.text() : "");
        const pdfBlob = await convertTextToPdf(text, selectedFile?.name || "Dokumen");
        const url = URL.createObjectURL(pdfBlob);
        setProgress(100);
        setConvertedResult({
          blob: pdfBlob,
          fileName: `Dokumen_${new Date().toISOString().slice(0, 10)}.pdf`,
          downloadUrl: url,
          fileSize: formatFileSize(pdfBlob.size),
        });
        toast.success("Dokumen berhasil dikonversi ke PDF.");
      }
      // 4. Text to DOCX
      else if (optId === "text-to-docx" && (fileTextContent || selectedFile)) {
        setProgress(50);
        const text = fileTextContent || (selectedFile ? await selectedFile.text() : "");
        const docxBlob = await convertTextToDocx(text, selectedFile?.name || "Dokumen");
        const url = URL.createObjectURL(docxBlob);
        setProgress(100);
        setConvertedResult({
          blob: docxBlob,
          fileName: `Dokumen_${new Date().toISOString().slice(0, 10)}.docx`,
          downloadUrl: url,
          fileSize: formatFileSize(docxBlob.size),
        });
        toast.success("Dokumen berhasil dikonversi ke Word (DOCX).");
      }
      // 5. Image to PDF
      else if (optId === "img-to-pdf" && selectedFile) {
        setProgress(50);
        const pdfBlob = await convertImageToPdf(selectedFile, "Lampiran Foto");
        const url = URL.createObjectURL(pdfBlob);
        setProgress(100);
        setConvertedResult({
          blob: pdfBlob,
          fileName: `Foto_${new Date().toISOString().slice(0, 10)}.pdf`,
          downloadUrl: url,
          fileSize: formatFileSize(pdfBlob.size),
        });
        toast.success("Foto berhasil dikonversi ke PDF.");
      }
      // 6. JSON to CSV
      else if (optId === "json-to-csv" && fileTextContent) {
        setProgress(70);
        const csvText = convertJsonToCsv(fileTextContent);
        const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        setProgress(100);
        setConvertedResult({
          text: csvText,
          blob,
          fileName: `Tabel_${Date.now()}.csv`,
          downloadUrl: url,
          fileSize: formatFileSize(blob.size),
        });
        toast.success("JSON berhasil diubah ke format CSV.");
      }
      // 7. CSV to JSON
      else if (optId === "csv-to-json" && fileTextContent) {
        setProgress(70);
        const jsonText = convertCsvToJson(fileTextContent);
        const blob = new Blob([jsonText], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        setProgress(100);
        setConvertedResult({
          text: jsonText,
          blob,
          fileName: `Data_${Date.now()}.json`,
          downloadUrl: url,
          fileSize: formatFileSize(blob.size),
        });
        toast.success("CSV berhasil diubah ke format JSON.");
      }
      // 8. Code Beautifier / Formatter
      else if (optId === "code-beautifier" && fileTextContent) {
        setProgress(70);
        const formatted = formatCodeOrJson(fileTextContent);
        const blob = new Blob([formatted], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        setProgress(100);
        setConvertedResult({
          text: formatted,
          blob,
          fileName: `Formatted_${Date.now()}.txt`,
          downloadUrl: url,
          fileSize: formatFileSize(blob.size),
        });
        toast.success("Format kode berhasil dirapikan.");
      }
      // 9. Generic Fallback
      else {
        setProgress(60);
        const blob = selectedFile ? selectedFile : new Blob([fileTextContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        setProgress(100);
        setConvertedResult({
          text: fileTextContent || undefined,
          blob,
          fileName: selectedFile ? `Konversi_${selectedFile.name}` : `Hasil_${Date.now()}.txt`,
          downloadUrl: url,
          fileSize: formatFileSize(blob.size),
        });
        toast.success("Pemrosesan berkas selesai.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Terjadi kendala saat memproses berkas.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyResultText = () => {
    if (convertedResult?.text) {
      navigator.clipboard.writeText(convertedResult.text);
      setIsCopied(true);
      toast.success("Teks berhasil disalin.");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <SubNavTabs category="tools" />

        {/* Workspace Header */}
        <ConverterHeader />

        {/* Category Navigation */}
        <ConverterCategoryNav
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          counts={categoryCounts}
        />

        {/* Tool Selector */}
        <ConverterToolSelector
          options={optionsInCurrentCategory}
          selectedOption={selectedOption}
          onSelectOption={handleSelectOption}
        />

        {/* Main Conversion Workbench */}
        <ConverterWorkbench
          selectedOption={selectedOption}
          selectedFile={selectedFile}
          fileTextContent={fileTextContent}
          onChangeFileTextContent={setFileTextContent}
          inputMode={inputMode}
          onChangeInputMode={setInputMode}
          onFileSelect={handleFileChange}
          onClearFile={() => setSelectedFile(null)}
          isConverting={isConverting}
          progress={progress}
          onConvert={handleConvert}
          convertedResult={convertedResult}
          isCopied={isCopied}
          onCopyText={handleCopyResultText}
          hdScale={hdScale}
          onChangeHdScale={setHdScale}
          pasfotoRatio={pasfotoRatio}
          onChangePasfotoRatio={setPasfotoRatio}
          photoBgColor={photoBgColor}
          onChangePhotoBgColor={setPhotoBgColor}
          camFilterMode={camFilterMode}
          onChangeCamFilterMode={setCamFilterMode}
          onOpenCamScannerCamera={() => startCamera("environment")}
        />

        {/* Camera Modal for CamScanner */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-surface rounded-2xl border border-border w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-text-primary uppercase">
                  Kamera Scanner
                </span>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="p-1 rounded-lg text-text-tertiary hover:text-text-primary cursor-pointer"
                  aria-label="Tutup kamera"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSwitchCamera}
                  className="gap-1 text-xs text-text-secondary cursor-pointer"
                  aria-label="Ganti kamera depan/belakang"
                >
                  <SwitchCamera className="w-4 h-4" />
                  <span>Balik Kamera</span>
                </Button>

                <Button
                  size="sm"
                  onClick={handleCaptureSnapshot}
                  className="gap-1.5 text-xs font-semibold px-5 cursor-pointer shadow-2xs"
                  aria-label="Ambil foto catatan"
                >
                  <Camera className="w-4 h-4" />
                  <span>Jepret Foto</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
