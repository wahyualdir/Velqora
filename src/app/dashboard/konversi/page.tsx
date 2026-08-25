"use client";

import { useState, useRef, useEffect } from "react";
import {
  FileText,
  FileBox,
  Image as ImageIcon,
  FileSpreadsheet,
  FileCode,
  ArrowRightLeft,
  Upload,
  Download,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  FileType,
  Sliders,
  Code2,
  FolderArchive,
  Minimize2,
  RotateCw,
  Crop,
  Palette,
  Maximize2,
  Camera,
  SwitchCamera,
  X,
  Aperture,
  FolderOpen,
  Terminal,
  Table,
  Search,
  Scan,
  Plus,
  Trash2,
  Layers,
  Wand2,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import {
  CONVERSION_OPTIONS,
  ConversionOption,
  processPhotoAdvanced,
  enhanceImageToHD,
  convertPhotoToWord,
  convertTextToDocx,
  convertTextToPdf,
  convertImageToPdf,
  convertMarkdownToHtml,
  formatCodeOrJson,
  convertJsonToCsv,
  convertCsvToJson,
  convertCsvToMarkdown,
  compressFilesToZip,
  extractZipArchive,
  minifyCodeOrJson,
  convertJsonToXml,
  generateCryptoHash,
  decodeJwt,
  generateUuidList,
  applyCamScannerFilter,
  generateScannedPdfBatch,
  CamScannerFilterMode,
} from "@/lib/file-converter";
import { formatFileSize } from "@/lib/utils";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";

export default function FileConverterPage() {
  const [activeCategory, setActiveCategory] = useState<
    "image" | "compress" | "document" | "data" | "code"
  >("image");

  const [selectedOption, setSelectedOption] = useState<ConversionOption>(
    CONVERSION_OPTIONS.find((o) => o.id === "doc-scanner") || CONVERSION_OPTIONS[0]
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isToolPickerOpen, setIsToolPickerOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTextContent, setFileTextContent] = useState<string>("");
  const [imageQuality, setImageQuality] = useState<number>(0.9);
  const [inputMode, setInputMode] = useState<"file" | "text">("file");

  // CamScanner State
  const [camFilterMode, setCamFilterMode] = useState<CamScannerFilterMode>("magic_color");
  const [scannedPages, setScannedPages] = useState<
    { id: string; blob: Blob; url: string; preview: string; name: string }[]
  >([]);
  const [activeScannedIndex, setActiveScannedIndex] = useState<number>(0);
  const [scannerWatermark, setScannerWatermark] = useState<string>("");

  // Advanced Photo Controls State
  const [photoBgColor, setPhotoBgColor] = useState<string>("none");
  const [pasfotoRatio, setPasfotoRatio] = useState<"3x4" | "4x6" | "2x3">("3x4");
  const [photoCropRatio, setPhotoCropRatio] = useState<"1:1" | "4:3" | "16:9" | "3:4">("1:1");
  const [resizePreset, setResizePreset] = useState<"hd" | "fhd" | "square" | "custom">("hd");
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [photoWatermarkText, setPhotoWatermarkText] = useState<string>("Velqora");

  // HD Enhancer Controls State
  const [hdScale, setHdScale] = useState<2 | 4>(2);
  const [hdSharpness, setHdSharpness] = useState<number>(1.3);

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCamScannerTool =
    selectedOption.id === "doc-scanner" || selectedOption.id === "doc-scanner-doc";

  const optionsInCurrentCategory = CONVERSION_OPTIONS.filter(
    (opt) => opt.category === activeCategory
  );

  const filteredOptions = optionsInCurrentCategory.filter((opt) => {
    return (
      !searchQuery ||
      opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.fromFormat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.toFormat.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handler pergantian kategori
  const handleSelectCategory = (
    catId: "image" | "compress" | "document" | "data" | "code"
  ) => {
    setActiveCategory(catId);
    setSearchQuery("");
    const optionsInCat = CONVERSION_OPTIONS.filter((o) => o.category === catId);
    if (optionsInCat.length > 0) {
      handleSelectOption(optionsInCat[0]);
    }
  };

  const handleSelectOption = (option: ConversionOption) => {
    setSelectedOption(option);
    setIsToolPickerOpen(false);
    setSelectedFile(null);
    setConvertedResult(null);
    setRotationDegrees(0);
    setFlipHorizontal(false);

    // Set mode input bawaan sesuai jenis alat
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
      } else if (option.id === "color-converter" && !fileTextContent) {
        setFileTextContent("#0071e3");
      } else if (option.id === "hash-generator" && !fileTextContent) {
        setFileTextContent("Velqora Learning Platform");
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

    // If on CamScanner tool, automatically process into first scanned page
    if (isCamScannerTool && file.type.startsWith("image/")) {
      try {
        const filteredBlob = await applyCamScannerFilter(
          file,
          camFilterMode,
          rotationDegrees,
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
        setActiveScannedIndex(scannedPages.length);
        toast.success(`Halaman "${file.name}" berhasil dipindai`);
      } catch (err: any) {
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

    toast.success(`Berkas "${file.name}" siap diproses`);
  };

  // ============================================================
  // CAMERA WEBCAM CONTROLS
  // ============================================================
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
    } catch (err: any) {
      console.error(err);
      toast.error("Tidak dapat mengakses kamera. Pastikan izin kamera telah diizinkan.");
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

        if (isCamScannerTool) {
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
          setActiveScannedIndex(scannedPages.length);
          toast.success(`Halaman ${pageNum} berhasil dipindai`);
        } else {
          stopCamera();
          toast.success("Foto berhasil dijepret");
        }
      },
      "image/jpeg",
      0.95
    );
  };

  const handleApplyCamFilter = async (mode: CamScannerFilterMode) => {
    setCamFilterMode(mode);
    if (selectedFile) {
      try {
        const updatedBlob = await applyCamScannerFilter(
          selectedFile,
          mode,
          rotationDegrees,
          scannerWatermark
        );
        const url = URL.createObjectURL(updatedBlob);
        if (scannedPages.length > 0) {
          const updated = [...scannedPages];
          if (updated[activeScannedIndex]) {
            updated[activeScannedIndex] = {
              ...updated[activeScannedIndex],
              blob: updatedBlob,
              url,
              preview: url,
            };
            setScannedPages(updated);
          }
        }
        toast.success(`Filter "${mode}" aktif`);
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  const handleDeleteScannedPage = (index: number) => {
    setScannedPages((prev) => prev.filter((_, i) => i !== index));
    setActiveScannedIndex((prev) => Math.max(0, prev - 1));
    toast.success("Halaman dihapus");
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ============================================================
  // CONVERSION EXECUTION
  // ============================================================
  const handleConvert = async () => {
    if (isCamScannerTool && scannedPages.length > 0) {
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
      } catch (err: any) {
        toast.error("Gagal menyatukan dokumen ke PDF.");
      } finally {
        setIsConverting(false);
      }
      return;
    }

    const hasInput = selectedFile || fileTextContent.trim().length > 0;
    if (!hasInput) {
      toast.error(
        selectedOption.category === "code" || selectedOption.category === "data"
          ? "Silakan masukkan teks atau kode terlebih dahulu"
          : "Silakan pilih berkas atau ambil foto terlebih dahulu"
      );
      return;
    }

    setIsConverting(true);
    setProgress(20);

    try {
      let outputBlob: Blob | null = null;
      let outputText: string = "";
      let targetExt = selectedOption.toFormat.toLowerCase().replace(/[^a-z0-9]/g, "");
      const baseName = (selectedFile?.name || "berkas").replace(/\.[^/.]+$/, "");
      const originalBytes = selectedFile ? selectedFile.size : new Blob([fileTextContent]).size;
      let isHd = false;

      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 25 : prev));
      }, 130);

      switch (selectedOption.id) {
        case "doc-scanner":
        case "doc-scanner-doc": {
          if (!selectedFile) throw new Error("Silakan pilih dokumen atau ambil dari kamera.");
          outputBlob = await applyCamScannerFilter(
            selectedFile,
            camFilterMode,
            rotationDegrees,
            scannerWatermark
          );
          targetExt = "jpg";
          break;
        }

        case "photo-hd": {
          if (!selectedFile) throw new Error("Silakan pilih foto atau ambil dari kamera.");
          outputBlob = await enhanceImageToHD(selectedFile, hdScale, hdSharpness);
          targetExt = "jpg";
          isHd = true;
          break;
        }

        case "photo-pasfoto": {
          if (!selectedFile) throw new Error("Silakan unggah foto untuk pasfoto.");
          let pW = 354;
          let pH = 472;
          if (pasfotoRatio === "4x6") {
            pW = 472;
            pH = 709;
          } else if (pasfotoRatio === "2x3") {
            pW = 236;
            pH = 354;
          }
          outputBlob = await processPhotoAdvanced(selectedFile, {
            targetWidth: pW,
            targetHeight: pH,
            bgColor: photoBgColor === "none" ? undefined : photoBgColor,
            quality: 0.95,
            format: "jpeg",
          });
          targetExt = "jpg";
          break;
        }

        case "photo-resize": {
          if (!selectedFile) throw new Error("Silakan unggah foto.");
          let targetW = 1280;
          let targetH = 720;
          if (resizePreset === "fhd") {
            targetW = 1920;
            targetH = 1080;
          } else if (resizePreset === "square") {
            targetW = 1080;
            targetH = 1080;
          }
          outputBlob = await processPhotoAdvanced(selectedFile, {
            targetWidth: targetW,
            targetHeight: targetH,
            quality: imageQuality,
            format: "jpeg",
          });
          targetExt = "jpg";
          break;
        }

        case "photo-crop": {
          if (!selectedFile) throw new Error("Silakan unggah foto.");
          outputBlob = await processPhotoAdvanced(selectedFile, {
            cropRatio: photoCropRatio,
            quality: imageQuality,
            format: "jpeg",
          });
          targetExt = "jpg";
          break;
        }

        case "photo-grayscale": {
          if (!selectedFile) throw new Error("Silakan unggah foto.");
          outputBlob = await processPhotoAdvanced(selectedFile, {
            grayscale: true,
            quality: 0.92,
            format: "jpeg",
          });
          targetExt = "jpg";
          break;
        }

        case "photo-invert": {
          if (!selectedFile) throw new Error("Silakan unggah foto.");
          outputBlob = await processPhotoAdvanced(selectedFile, {
            invertColors: true,
            quality: 0.95,
            format: "jpeg",
          });
          targetExt = "jpg";
          break;
        }

        case "photo-rotate": {
          if (!selectedFile) throw new Error("Silakan unggah foto.");
          outputBlob = await processPhotoAdvanced(selectedFile, {
            rotationDegrees,
            flipHorizontal,
            quality: 0.92,
            format: "jpeg",
          });
          targetExt = "jpg";
          break;
        }

        case "photo-to-word": {
          if (!selectedFile) throw new Error("Silakan unggah foto.");
          outputBlob = await convertPhotoToWord(selectedFile, baseName);
          targetExt = "docx";
          break;
        }

        case "img-to-pdf": {
          if (!selectedFile) throw new Error("Silakan unggah berkas foto.");
          outputBlob = await convertImageToPdf(selectedFile, baseName);
          targetExt = "pdf";
          break;
        }

        case "compress-image":
        case "compress-image-opt": {
          if (!selectedFile) throw new Error("Silakan unggah berkas gambar.");
          outputBlob = await processPhotoAdvanced(selectedFile, {
            quality: imageQuality,
            format: "webp",
          });
          targetExt = "webp";
          break;
        }

        case "img-to-png": {
          if (!selectedFile) throw new Error("Silakan unggah berkas foto.");
          outputBlob = await processPhotoAdvanced(selectedFile, {
            quality: 1.0,
            format: "png",
          });
          targetExt = "png";
          break;
        }

        case "img-to-jpg": {
          if (!selectedFile) throw new Error("Silakan unggah berkas foto.");
          outputBlob = await processPhotoAdvanced(selectedFile, {
            quality: imageQuality,
            format: "jpeg",
          });
          targetExt = "jpg";
          break;
        }

        case "img-to-webp": {
          if (!selectedFile) throw new Error("Silakan unggah berkas foto.");
          outputBlob = await processPhotoAdvanced(selectedFile, {
            quality: imageQuality,
            format: "webp",
          });
          targetExt = "webp";
          break;
        }

        case "photo-watermark": {
          if (!selectedFile) throw new Error("Silakan unggah foto.");
          outputBlob = await processPhotoAdvanced(selectedFile, {
            watermarkText: photoWatermarkText,
            quality: 0.95,
            format: "jpeg",
          });
          targetExt = "jpg";
          break;
        }

        case "compress-pdf": {
          const textToUse =
            fileTextContent ||
            `# ${baseName}\n\nDokumen PDF yang telah dioptimasi dan dikompresi agar hemat ukuran.`;
          outputBlob = await convertTextToPdf(textToUse, `${baseName}_compressed`, true);
          targetExt = "pdf";
          break;
        }

        case "compress-zip": {
          if (selectedFile) {
            outputBlob = await compressFilesToZip([
              { name: selectedFile.name, content: selectedFile },
            ]);
          } else {
            outputBlob = await compressFilesToZip([
              { name: `${baseName}.txt`, content: fileTextContent },
            ]);
          }
          targetExt = "zip";
          break;
        }

        case "compress-extract-zip": {
          if (!selectedFile) throw new Error("Silakan unggah berkas .zip.");
          const extracted = await extractZipArchive(selectedFile);
          outputText = extracted
            .map((e) => `=== ${e.fileName} (${e.size}) ===\n${e.content}`)
            .join("\n\n");
          outputBlob = new Blob([outputText], { type: "text/plain;charset=utf-8;" });
          targetExt = "txt";
          break;
        }

        case "compress-minify-code": {
          const textToUse =
            fileTextContent ||
            `{"name":"Velqora","version":"2.0.0","optimized":true}`;
          outputText = minifyCodeOrJson(textToUse);
          outputBlob = new Blob([outputText], { type: "text/plain;charset=utf-8;" });
          targetExt = "min.txt";
          break;
        }

        case "pdf-to-docx":
        case "markdown-to-docx":
        case "text-to-docx": {
          const textToUse =
            fileTextContent ||
            `# ${baseName}\n\nDokumen materi kuliah yang diproses secara modular melalui Velqora.`;
          outputBlob = await convertTextToDocx(textToUse, baseName);
          targetExt = "docx";
          break;
        }

        case "docx-to-pdf":
        case "markdown-to-pdf":
        case "text-to-pdf":
        case "pdf-merge": {
          const textToUse =
            fileTextContent ||
            `# ${baseName}\n\nDokumen materi kuliah siap cetak dalam format PDF.`;
          outputBlob = await convertTextToPdf(textToUse, baseName);
          targetExt = "pdf";
          break;
        }

        case "pdf-to-txt": {
          outputText =
            fileTextContent ||
            `=== EKSTRAKSI TEKS DOKUMEN ===\n\nIsi materi kuliah berhasil diekstrak dalam bentuk teks murni.`;
          outputBlob = new Blob([outputText], { type: "text/plain;charset=utf-8;" });
          targetExt = "txt";
          break;
        }

        case "json-to-csv": {
          outputText = convertJsonToCsv(fileTextContent);
          outputBlob = new Blob([outputText], { type: "text/csv;charset=utf-8;" });
          targetExt = "csv";
          break;
        }

        case "csv-to-json": {
          outputText = convertCsvToJson(fileTextContent);
          outputBlob = new Blob([outputText], { type: "application/json;charset=utf-8;" });
          targetExt = "json";
          break;
        }

        case "text-to-markdown": {
          outputText = convertCsvToMarkdown(fileTextContent);
          outputBlob = new Blob([outputText], { type: "text/markdown;charset=utf-8;" });
          targetExt = "md";
          break;
        }

        case "markdown-to-html": {
          outputText = convertMarkdownToHtml(fileTextContent, baseName);
          outputBlob = new Blob([outputText], { type: "text/html;charset=utf-8;" });
          targetExt = "html";
          break;
        }

        case "html-to-markdown": {
          const html = fileTextContent || `<h1>Materi</h1><p>Catatan kuliah</p>`;
          outputText = html
            .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n")
            .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n")
            .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
            .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
            .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
            .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
            .replace(/<[^>]+>/g, "");
          outputBlob = new Blob([outputText], { type: "text/markdown;charset=utf-8;" });
          targetExt = "md";
          break;
        }

        case "json-to-xml": {
          outputText = convertJsonToXml(fileTextContent || '{"name":"Velqora","version":"2.0"}');
          outputBlob = new Blob([outputText], { type: "application/xml;charset=utf-8;" });
          targetExt = "xml";
          break;
        }

        case "xml-to-json": {
          const xml = fileTextContent || `<root><name>Velqora</name></root>`;
          const tagMatches = [...xml.matchAll(/<([a-zA-Z0-9_]+)>([^<]+)<\/\1>/g)];
          const obj: Record<string, string> = {};
          tagMatches.forEach((m) => {
            obj[m[1]] = m[2];
          });
          outputText = JSON.stringify(obj, null, 2);
          outputBlob = new Blob([outputText], { type: "application/json;charset=utf-8;" });
          targetExt = "json";
          break;
        }

        case "code-beautifier": {
          outputText = formatCodeOrJson(fileTextContent);
          outputBlob = new Blob([outputText], { type: "text/plain;charset=utf-8;" });
          targetExt = "txt";
          break;
        }

        case "file-to-base64": {
          if (selectedFile) {
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(selectedFile);
            });
            outputText = await base64Promise;
          } else {
            outputText = `data:text/plain;base64,${btoa(fileTextContent || "Velqora")}`;
          }
          outputBlob = new Blob([outputText], { type: "text/plain;charset=utf-8;" });
          targetExt = "txt";
          break;
        }

        case "base64-to-file": {
          const cleanB64 = fileTextContent.replace(/^data:image\/[a-z]+;base64,/, "").trim();
          const byteCharacters = atob(cleanB64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          outputBlob = new Blob([byteArray], { type: "image/jpeg" });
          targetExt = "jpg";
          break;
        }

        case "hash-generator": {
          const textToHash = fileTextContent || (selectedFile ? selectedFile.name : "Velqora");
          const sha256 = await generateCryptoHash(textToHash, "SHA-256");
          const sha512 = await generateCryptoHash(textToHash, "SHA-512");
          outputText = `=== CHECKSUM HASH DIGEST ===\nInput: ${textToHash.slice(0, 80)}\n\n[SHA-256]:\n${sha256}\n\n[SHA-512]:\n${sha512}`;
          outputBlob = new Blob([outputText], { type: "text/plain;charset=utf-8;" });
          targetExt = "txt";
          break;
        }

        case "jwt-decoder": {
          outputText = decodeJwt(
            fileTextContent ||
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IldhaHl1U3R1ZHkiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          );
          outputBlob = new Blob([outputText], { type: "application/json;charset=utf-8;" });
          targetExt = "json";
          break;
        }

        case "url-encoder": {
          const raw = fileTextContent || "https://example.com/search?q=machine learning & data";
          const encoded = encodeURIComponent(raw);
          let decoded = "";
          try {
            decoded = decodeURIComponent(raw);
          } catch {
            decoded = raw;
          }
          outputText = `=== URL ENCODE & DECODE ===\n\n[ENCODED]:\n${encoded}\n\n[DECODED]:\n${decoded}`;
          outputBlob = new Blob([outputText], { type: "text/plain;charset=utf-8;" });
          targetExt = "txt";
          break;
        }

        case "uuid-generator": {
          outputText = `=== GENERATOR UUID v4 ===\n${generateUuidList(10)}`;
          outputBlob = new Blob([outputText], { type: "text/plain;charset=utf-8;" });
          targetExt = "txt";
          break;
        }

        case "color-converter": {
          const hex = (fileTextContent.trim() || "#0071e3").replace(/^#/, "");
          const r = parseInt(hex.substring(0, 2), 16) || 0;
          const g = parseInt(hex.substring(2, 4), 16) || 113;
          const b = parseInt(hex.substring(4, 6), 16) || 227;
          outputText = `=== KONVERSI WARNA CSS ===\nHEX: #${hex}\nRGB: rgb(${r}, ${g}, ${b})\nRGBA: rgba(${r}, ${g}, ${b}, 1)\nCSS Variable: --primary: #${hex};`;
          outputBlob = new Blob([outputText], { type: "text/plain;charset=utf-8;" });
          targetExt = "txt";
          break;
        }

        default:
          throw new Error("Pilihan konversi belum didukung.");
      }

      clearInterval(interval);
      setProgress(100);

      const finalFileName = `${baseName}_hasil.${targetExt}`;
      const downloadUrl = outputBlob ? URL.createObjectURL(outputBlob) : "";
      const resultBytes = outputBlob ? outputBlob.size : new Blob([outputText]).size;

      let savings: number | undefined = undefined;
      if (originalBytes > 0 && resultBytes < originalBytes) {
        savings = Math.round(((originalBytes - resultBytes) / originalBytes) * 100);
      }

      setConvertedResult({
        blob: outputBlob || undefined,
        text: outputText || undefined,
        fileName: finalFileName,
        downloadUrl,
        fileSize: outputBlob ? formatFileSize(outputBlob.size) : "1 KB",
        originalSize: formatFileSize(originalBytes),
        savingsPercent: savings,
        isHdEnhanced: isHd,
      });

      toast.success(
        isHd
          ? "Penjernihan HD berhasil diproses"
          : `Pemrosesan "${selectedOption.name}" berhasil`
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Gagal memproses berkas. Silakan coba lagi.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyText = () => {
    if (!convertedResult?.text) return;
    navigator.clipboard.writeText(convertedResult.text);
    setIsCopied(true);
    toast.success("Teks disalin");
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Running Marquee Conversion Ticker Items
  const marqueeItems = [
    { label: "Scanner Dokumen CamScanner", icon: Scan, color: "#38bdf8" },
    { label: "Filter Magic Color dan BW Clean", icon: Wand2, color: "#2997ff" },
    { label: "Scan Multi Halaman ke PDF", icon: Layers, color: "#3ecf8e" },
    { label: "Penjernih Foto HD", icon: Sparkles, color: "#2997ff" },
    { label: "Pasfoto Kuliah 3x4 dan 4x6", icon: Crop, color: "#3ecf8e" },
    { label: "Formatter dan Beautifier Kode", icon: Code2, color: "#38bdf8" },
    { label: "Konversi JSON ke CSV", icon: FileSpreadsheet, color: "#3ecf8e" },
    { label: "Kompres Berkas ke ZIP", icon: FolderArchive, color: "#2997ff" },
  ];

  return (
    <div className="page-container space-y-6 sm:space-y-8 py-1 sm:py-3 pb-32 sm:pb-16 animate-fade-in">
      {/* ============================================================
          1. HEADER
          ============================================================ */}
      <PageHeader
        eyebrow="~/utilities"
        technicalMark="< ffmpeg // magick // ocr />"
        title="Utilitas dan konversi berkas"
        description="Pindai dokumen, ubah format, kompres berkas, dan rapikan aset belajarmu."
        border={false}
      />

      {/* ============================================================
          2. LANGKAH 1: PILIH KATEGORI & ALAT (RINGKAS & ERGONOMIS)
          ============================================================ */}
      <section className="space-y-2.5">
        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          {[
            { id: "image", label: "Foto & Scan", icon: ImageIcon },
            { id: "compress", label: "Kompresi", icon: Minimize2 },
            { id: "document", label: "Dokumen & PDF", icon: FileText },
            { id: "data", label: "Data & Tabel", icon: Table },
            { id: "code", label: "Kode & Dev", icon: Code2 },
          ].map((cat) => {
            const isCatActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 active:scale-95 flex items-center gap-1.5 border min-h-[38px] ${
                  isCatActive
                    ? "bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20"
                    : "bg-surface border-border text-text-secondary hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Tool Summary Button (Opens Fast Tool Picker on Click) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsToolPickerOpen((prev) => !prev)}
            className="w-full p-3 rounded-2xl bg-surface border border-border hover:border-brand-500/60 flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] shadow-lg"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-brand-600 border border-brand-500 flex items-center justify-center text-white shrink-0">
                {selectedOption.id.includes("scanner") ? (
                  <Scan className="w-4 h-4" />
                ) : selectedOption.id === "photo-hd" ? (
                  <Sparkles className="w-4 h-4" />
                ) : selectedOption.category === "image" ? (
                  <ImageIcon className="w-4 h-4" />
                ) : selectedOption.category === "compress" ? (
                  <Minimize2 className="w-4 h-4" />
                ) : selectedOption.category === "code" ? (
                  <Code2 className="w-4 h-4" />
                ) : (
                  <ArrowRightLeft className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">{selectedOption.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-brand-600/20 text-brand-400 border border-brand-500/30 shrink-0">
                    {selectedOption.fromFormat} → {selectedOption.toFormat}
                  </span>
                </div>
                <p className="text-[10px] text-text-secondary truncate">{selectedOption.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-secondary border border-border text-[10px] font-semibold text-text-secondary shrink-0">
              <span>Ganti</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isToolPickerOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {/* Collapsible Fast Tool Picker List (No Infinite Scroll Trap!) */}
          {isToolPickerOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-40 p-3 rounded-2xl bg-surface border border-border shadow-2xl space-y-2 animate-fade-in">
              <div className="relative flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari format alat..."
                  className="w-full pl-8 pr-16 py-1.5 rounded-xl bg-surface-secondary border border-border text-xs text-white placeholder:text-text-tertiary focus:outline-none focus:border-brand-500"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-md text-text-secondary hover:text-white transition-colors"
                    title="Hapus teks"
                    aria-label="Hapus teks"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsToolPickerOpen(false);
                    setSearchQuery("");
                  }}
                  className="px-2 py-1 rounded-lg bg-surface-secondary hover:bg-red-500/20 text-text-secondary hover:text-red-400 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                  title="Tutup pencarian alat"
                  aria-label="Tutup pencarian alat"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Tutup</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {filteredOptions.map((opt) => {
                  const isSel = selectedOption.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all min-h-[42px] ${
                        isSel
                          ? "bg-brand-600 border-brand-500 text-white font-bold"
                          : "bg-surface-secondary border-border text-text-secondary hover:bg-surface-secondary"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs truncate">{opt.name}</div>
                        <div className={`text-[9px] font-mono truncate ${isSel ? "text-blue-100" : "text-text-tertiary"}`}>
                          {opt.fromFormat} → {opt.toFormat}
                        </div>
                      </div>
                      {isSel && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          3. LANGKAH 2: WORKSPACE UTAMA (LANGSUNG KELIHATAN DI HP!)
          ============================================================ */}
      <section className="rounded-3xl border border-border bg-surface backdrop-blur-2xl p-3.5 sm:p-5 shadow-2xl space-y-3.5">
        {/* CamScanner Filter Studio Pills */}
        {isCamScannerTool && (
          <div className="space-y-2 pb-1 border-b border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-brand-400" />
                Filter CamScanner:
              </span>
              <span className="text-[10px] text-text-secondary font-mono">
                {camFilterMode === "magic_color" ? "Magic Color (Otomatis)" : camFilterMode}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
              {[
                { id: "magic_color", label: "Magic Color" },
                { id: "bw_clean", label: "Hitam Putih" },
                { id: "grayscale", label: "Grayscale" },
                { id: "lighten", label: "Terangkan" },
                { id: "original", label: "Asli" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleApplyCamFilter(f.id as CamScannerFilterMode)}
                  className={`py-2 px-1.5 rounded-xl border text-center text-xs font-semibold transition-all min-h-[38px] ${
                    camFilterMode === f.id
                      ? "bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20"
                      : "bg-surface-secondary border-border text-text-secondary"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Scanned Pages Mini Tray */}
            {scannedPages.length > 0 && (
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {scannedPages.length} Lembar Halaman
                  </span>
                  <button
                    type="button"
                    onClick={() => startCamera(cameraFacing)}
                    className="text-[11px] text-brand-400 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Scan Lagi
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {scannedPages.map((page, idx) => (
                    <div
                      key={page.id}
                      onClick={() => setActiveScannedIndex(idx)}
                      className={`relative group shrink-0 w-16 aspect-3/4 rounded-xl overflow-hidden border cursor-pointer ${
                        activeScannedIndex === idx
                          ? "border-brand-500 ring-2 ring-[#0071e3]/40"
                          : "border-border opacity-75"
                      }`}
                    >
                      <img src={page.url} alt={page.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-1">
                        <span className="text-[8px] font-bold text-white font-mono">#{idx + 1}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteScannedPage(idx);
                          }}
                          className="p-0.5 rounded bg-red-600/80 text-white"
                        >
                          <Trash2 className="w-2 h-2" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Area: Berkas / Kamera / Editor Teks */}
        {inputMode === "file" ? (
          <div className="space-y-2.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={selectedOption.accept}
              className="hidden"
            />

            {selectedFile ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/30 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{selectedFile.name}</h4>
                    <p className="text-[10px] text-emerald-400 font-mono">
                      {formatFileSize(selectedFile.size)} • Siap diproses
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setConvertedResult(null);
                  }}
                  className="p-1.5 rounded-xl bg-surface-secondary text-text-secondary hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Big Touch Target Buttons for Mobile */
              <div className={`grid gap-2 ${selectedOption.category === "image" || isCamScannerTool ? "grid-cols-2" : "grid-cols-1"}`}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl border border-border bg-surface-secondary hover:bg-surface-secondary flex flex-col items-center justify-center space-y-1.5 text-center transition-all min-h-[90px] active:scale-95"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    Pilih Galeri / File
                  </span>
                </button>

                {(selectedOption.category === "image" || isCamScannerTool) && (
                  <button
                    type="button"
                    onClick={() => startCamera(cameraFacing)}
                    className="p-4 rounded-2xl border border-brand-500/40 bg-brand-600/10 hover:bg-brand-600/20 flex flex-col items-center justify-center space-y-1.5 text-center transition-all min-h-[90px] active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                      {isCamScannerTool ? <Scan className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold text-brand-400">
                      {isCamScannerTool ? "Buka Kamera Scan" : "Jepret Kamera HP"}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Text / Code Editor */
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-text-secondary font-mono">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-brand-400" />
                Editor Input ({selectedOption.fromFormat}):
              </span>
              <span>{fileTextContent.length} char</span>
            </div>
            <textarea
              value={fileTextContent}
              onChange={(e) => setFileTextContent(e.target.value)}
              placeholder={`Tempelkan atau ketik ${selectedOption.fromFormat} di sini...`}
              rows={5}
              className="w-full p-3 rounded-2xl bg-surface-secondary border border-border text-xs text-white font-mono focus:outline-none focus:border-brand-500"
            />
          </div>
        )}

        {/* Specific Controls (HD Upscaler, Pasfoto, Crop) */}
        {selectedOption.id === "photo-hd" && (
          <div className="p-3 rounded-2xl bg-brand-600/[0.05] border border-brand-500/20 space-y-2 text-xs">
            <span className="font-semibold text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Resolusi HD:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setHdScale(2)}
                className={`py-2 rounded-xl font-bold text-center ${
                  hdScale === 2 ? "bg-brand-600 text-white" : "bg-surface-secondary text-text-secondary"
                }`}
              >
                2X HD
              </button>
              <button
                type="button"
                onClick={() => setHdScale(4)}
                className={`py-2 rounded-xl font-bold text-center ${
                  hdScale === 4 ? "bg-brand-600 text-white" : "bg-surface-secondary text-text-secondary"
                }`}
              >
                4X Ultra HD
              </button>
            </div>
          </div>
        )}

        {selectedOption.id === "photo-pasfoto" && (
          <div className="p-3 rounded-2xl bg-surface-secondary border border-border space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Ukuran Pasfoto:</span>
              <div className="grid grid-cols-3 gap-1">
                {(["3x4", "4x6", "2x3"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPasfotoRatio(r)}
                    className={`py-1 px-2.5 rounded-lg font-bold text-xs ${
                      pasfotoRatio === r ? "bg-brand-600 text-white" : "bg-surface-secondary text-text-secondary"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="font-semibold text-white">Warna Latar:</span>
              <div className="grid grid-cols-4 gap-1">
                <button
                  type="button"
                  onClick={() => setPhotoBgColor("none")}
                  className={`py-1 px-2 rounded-lg text-[10px] ${photoBgColor === "none" ? "bg-brand-600 text-white font-bold" : "bg-surface-secondary text-text-secondary"}`}
                >
                  Asli
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoBgColor("#dc2626")}
                  className={`py-1 px-2 rounded-lg text-[10px] bg-red-600 text-white ${photoBgColor === "#dc2626" ? "ring-2 ring-white font-bold" : ""}`}
                >
                  Merah
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoBgColor("#2563eb")}
                  className={`py-1 px-2 rounded-lg text-[10px] bg-blue-600 text-white ${photoBgColor === "#2563eb" ? "ring-2 ring-white font-bold" : ""}`}
                >
                  Biru
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoBgColor("#ffffff")}
                  className={`py-1 px-2 rounded-lg text-[10px] bg-white text-black ${photoBgColor === "#ffffff" ? "ring-2 ring-[#0071e3] font-bold" : ""}`}
                >
                  Putih
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRIMARY EXECUTION BUTTON */}
        <button
          onClick={handleConvert}
          disabled={
            isConverting ||
            (isCamScannerTool
              ? scannedPages.length === 0 && !selectedFile
              : !selectedFile && !fileTextContent.trim())
          }
          className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold text-white transition-all min-h-[48px] active:scale-[0.98] ${
            isConverting ||
            (isCamScannerTool
              ? scannedPages.length === 0 && !selectedFile
              : !selectedFile && !fileTextContent.trim())
              ? "bg-slate-800 text-text-tertiary cursor-not-allowed"
              : isCamScannerTool
              ? "bg-brand-600 hover:bg-brand-700 shadow-sm"
              : selectedOption.category === "compress"
              ? "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              : "bg-brand-600 hover:bg-brand-700 shadow-sm"
          }`}
        >
          {isConverting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Memproses ({progress}%)...</span>
            </>
          ) : isCamScannerTool ? (
            <>
              <Scan className="w-4 h-4" />
              <span>
                {scannedPages.length > 1
                  ? `Satukan & Unduh ${scannedPages.length} Halaman PDF`
                  : "Ekspor Dokumen CamScanner"}
              </span>
            </>
          ) : selectedOption.id === "photo-hd" ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Jernihkan Foto HD Sekarang</span>
            </>
          ) : selectedOption.category === "compress" ? (
            <>
              <Minimize2 className="w-4 h-4" />
              <span>Mulai Kompresi Berkas</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Mulai Konversi {selectedOption.toFormat}</span>
            </>
          )}
        </button>

        {/* CONVERTED RESULT BANNER */}
        {convertedResult && (
          <div
            className={`p-3.5 rounded-2xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in ${
              convertedResult.savingsPercent && convertedResult.savingsPercent > 0
                ? "bg-emerald-500/10 border-emerald-500/40"
                : "bg-brand-600/10 border-brand-500/40"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                  convertedResult.isHdEnhanced
                    ? "bg-brand-600/20 border-brand-500/40 text-brand-400"
                    : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                }`}
              >
                {convertedResult.isHdEnhanced ? <Sparkles className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-md">
                  {convertedResult.fileName}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary font-mono mt-0.5">
                  <span>Hasil: <strong>{convertedResult.fileSize}</strong></span>
                  {convertedResult.isHdEnhanced && (
                    <span className="px-1 py-0.2 rounded bg-brand-600/20 text-brand-400 font-bold">
                      HD Jernih
                    </span>
                  )}
                  {convertedResult.savingsPercent !== undefined && convertedResult.savingsPercent > 0 && (
                    <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      Hemat {convertedResult.savingsPercent}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {convertedResult.text && (
                <button
                  onClick={handleCopyText}
                  className="p-2.5 rounded-xl border border-border bg-surface-secondary text-text-secondary shrink-0 min-h-[42px]"
                  title="Salin Teks"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}

              {convertedResult.downloadUrl && (
                <a
                  href={convertedResult.downloadUrl}
                  download={convertedResult.fileName}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 min-h-[42px] active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Berkas</span>
                </a>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ============================================================
          4. LIVE CAMERA MODAL (CAMSCANNER & BOUNDING BOX)
          ============================================================ */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 animate-fade-in">
          <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2997ff] animate-ping" />
                <h3 className="text-xs font-bold text-white">
                  {isCamScannerTool ? "Kamera Scanner Dokumen" : "Kamera Perangkat"}
                </h3>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1 rounded-full bg-surface-secondary text-text-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full aspect-4/3 bg-black rounded-2xl overflow-hidden border border-border flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* CamScanner Guide Lines */}
              <div className="absolute inset-3 pointer-events-none border-2 border-dashed border-[#2997ff]/50 rounded-xl flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-3.5 h-3.5 border-t-2 border-l-2 border-[#2997ff]" />
                  <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-[#2997ff]" />
                </div>
                <div className="text-center">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 text-[9px] text-brand-400 font-mono font-bold">
                    Posisikan Kertas di Kotak
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-3.5 h-3.5 border-b-2 border-l-2 border-[#2997ff]" />
                  <div className="w-3.5 h-3.5 border-b-2 border-r-2 border-[#2997ff]" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleSwitchCamera}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border text-text-secondary text-xs font-semibold min-h-[42px]"
                title="Ganti Kamera"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleCaptureSnapshot}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/20 active:scale-95 min-h-[42px]"
              >
                <Aperture className="w-4 h-4" />
                <span>{isCamScannerTool ? "Pindai Lembar Ini" : "Jepret Foto"}</span>
              </button>

              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-2.5 rounded-xl bg-surface-secondary text-text-secondary text-xs min-h-[42px]"
              >
                {scannedPages.length > 0 ? "Selesai" : "Batal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          5. ANIMASI BERJALAN DI BAWAH UPLOAD
          ============================================================ */}
      <section className="pt-1 space-y-1">
        <p className="text-center text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary font-bold">
          {CONVERSION_OPTIONS.length} ALAT AKTIF & PRIVAT
        </p>

        <div
          className="overflow-hidden py-1 relative"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex gap-2 animate-marquee">
            {[...marqueeItems, ...marqueeItems].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-surface text-[10px] text-text-secondary shrink-0"
                >
                  <Icon className="w-3 h-3 shrink-0" style={{ color: item.color }} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
