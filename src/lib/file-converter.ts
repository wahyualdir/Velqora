export type ConversionCategory = "all" | "image" | "compress" | "document" | "data" | "code";

export interface ConversionOption {
  id: string;
  name: string;
  category: "image" | "compress" | "document" | "data" | "code";
  fromFormat: string;
  toFormat: string;
  accept: string;
  description: string;
  icon: string;
  isCompressor?: boolean;
}

export const CONVERSION_OPTIONS: ConversionOption[] = [
  // ============================================================
  // 1. KATEGORI FOTO & SCANNER (15 ALAT LENGKAP DENGAN CAMSCANNER)
  // ============================================================
  {
    id: "doc-scanner",
    name: "Scanner Dokumen (CamScanner)",
    category: "image",
    fromFormat: "KAMERA / SCAN",
    toFormat: "PDF / JPEG BERSIH",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Scan dokumen atau catatan dengan filter Magic Color, Hitam Putih Tajam, dan ekspor multi halaman ke PDF.",
    icon: "Scan",
  },
  {
    id: "photo-hd",
    name: "Penjernih Foto HD (HD Upscaler)",
    category: "image",
    fromFormat: "FOTO BURAM",
    toFormat: "ULTRA HD (2X / 4X)",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Tingkatkan ketajaman, kontras, dan resolusi foto catatan atau tugas yang buram menjadi jernih HD.",
    icon: "Sparkles",
  },
  {
    id: "photo-pasfoto",
    name: "Pasfoto Kuliah & Ijazah",
    category: "image",
    fromFormat: "FOTO APAPUN",
    toFormat: "PASFOTO 3x4 / 4x6",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Format foto formal 3x4, 4x6, atau 2x3 dengan opsi ganti warna latar belakang (Merah, Biru, Putih).",
    icon: "Crop",
  },
  {
    id: "photo-resize",
    name: "Ubah Ukuran Foto (Resize)",
    category: "image",
    fromFormat: "JPG / PNG",
    toFormat: "RESIZED",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Ubah dimensi foto ke ukuran standar (720p), besar (1080p), persegi 1:1, atau ukuran kustom.",
    icon: "Maximize2",
  },
  {
    id: "photo-crop",
    name: "Pangkas Foto (Crop Rasio)",
    category: "image",
    fromFormat: "JPG / PNG",
    toFormat: "CROPPED",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Pangkas foto otomatis ke rasio 1:1 persegi, 4:3 presentasi, 16:9 banner, atau 3:4 portrait.",
    icon: "Crop",
  },
  {
    id: "photo-grayscale",
    name: "Foto ke Hitam Putih (B&W)",
    category: "image",
    fromFormat: "FOTO BERWARNA",
    toFormat: "HITAM PUTIH",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Ubah foto diagram, scan tugas, atau catatan menjadi monokrom hitam putih siap cetak/fotokopi.",
    icon: "ImageIcon",
  },
  {
    id: "photo-invert",
    name: "Invert Warna Foto (Negatif)",
    category: "image",
    fromFormat: "FOTO / SCAN",
    toFormat: "INVERTED",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Balik warna foto untuk mempermudah membaca scan catatan gelap atau sketsa diagram hitam putih.",
    icon: "Palette",
  },
  {
    id: "photo-rotate",
    name: "Putar & Balik Foto (Rotate)",
    category: "image",
    fromFormat: "FOTO MIRING",
    toFormat: "FOTO TEGAK",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Perbaiki orientasi foto scan catatan yang miring dengan putar 90°, 180°, atau cermin (flip).",
    icon: "RotateCw",
  },
  {
    id: "img-to-pdf",
    name: "Foto / Gambar ke PDF",
    category: "image",
    fromFormat: "JPG / PNG",
    toFormat: "PDF",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Satukan foto dokumen, diagram tugas, atau scan materi menjadi satu berkas PDF siap cetak.",
    icon: "FileBox",
  },
  {
    id: "photo-to-word",
    name: "Foto ke Dokumen Word (.docx)",
    category: "image",
    fromFormat: "JPG / PNG",
    toFormat: "DOCX",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Sisipkan foto catatan atau diagram langsung ke lembar kerja Microsoft Word resmi.",
    icon: "FileText",
  },
  {
    id: "compress-image",
    name: "Kompresi Foto & Gambar",
    category: "image",
    fromFormat: "JPG / PNG / WEBP",
    toFormat: "WEBP / JPG",
    accept: ".png,.jpg,.jpeg,.webp",
    description: "Kompresi pintar gambar hingga 80% lebih kecil tanpa membuat foto buram atau pecah.",
    icon: "Minimize2",
    isCompressor: true,
  },
  {
    id: "img-to-png",
    name: "Foto ke Format PNG",
    category: "image",
    fromFormat: "JPG / WEBP",
    toFormat: "PNG",
    accept: ".jpg,.jpeg,.webp,.png",
    description: "Konversi foto atau diagram materi ke format PNG berkualitas tinggi.",
    icon: "ImageIcon",
  },
  {
    id: "img-to-jpg",
    name: "Foto ke Format JPG / JPEG",
    category: "image",
    fromFormat: "PNG / WEBP",
    toFormat: "JPG",
    accept: ".png,.webp,.jpg,.jpeg",
    description: "Ubah foto menjadi format JPG hemat ruang penyimpanan.",
    icon: "ImageIcon",
  },
  {
    id: "img-to-webp",
    name: "Foto ke Format WebP",
    category: "image",
    fromFormat: "PNG / JPG",
    toFormat: "WEBP",
    accept: ".png,.jpg,.jpeg,.webp",
    description: "Format foto modern web dengan kompresi maksimal generasi terbaru.",
    icon: "ImageIcon",
  },
  {
    id: "photo-watermark",
    name: "Beri Watermark / Tanda Air",
    category: "image",
    fromFormat: "JPG / PNG",
    toFormat: "WATERMARKED",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Tambahkan nama, NIM, atau teks tanda air pada foto catatan tugas agar aman.",
    icon: "ShieldCheck",
  },

  // ============================================================
  // 2. KATEGORI KOMPRESI (5 ALAT)
  // ============================================================
  {
    id: "compress-pdf",
    name: "Kompresi Dokumen PDF",
    category: "compress",
    fromFormat: "PDF",
    toFormat: "PDF KECIL",
    accept: ".pdf,.docx,.txt,.md",
    description: "Perkecil ukuran dokumen PDF agar hemat kuota dan mudah diunggah ke portal kuliah.",
    icon: "FileBox",
    isCompressor: true,
  },
  {
    id: "compress-image-opt",
    name: "Kompresi Gambar Maksimal",
    category: "compress",
    fromFormat: "JPG / PNG",
    toFormat: "WEBP HEMAT",
    accept: ".jpg,.jpeg,.png,.webp",
    description: "Optimasi ukuran file gambar hingga 90% lebih ringan dengan format WebP adaptif.",
    icon: "Minimize2",
    isCompressor: true,
  },
  {
    id: "compress-zip",
    name: "Kompres Berkas ke ZIP",
    category: "compress",
    fromFormat: "ANY FILE",
    toFormat: "ZIP ARSIP",
    accept: "*",
    description: "Bungkus dan kompres berkas materi, tugas, atau foto menjadi arsip .zip hemat ruang.",
    icon: "FolderArchive",
    isCompressor: true,
  },
  {
    id: "compress-extract-zip",
    name: "Buka / Ekstrak Berkas ZIP",
    category: "compress",
    fromFormat: "ZIP ARSIP",
    toFormat: "UNZIPPED",
    accept: ".zip",
    description: "Buka dan ekstrak isi file dari dalam arsip .zip langsung di browser tanpa aplikasi luar.",
    icon: "FolderArchive",
  },
  {
    id: "compress-minify-code",
    name: "Minifikasi Kode & JSON",
    category: "compress",
    fromFormat: "JSON / CSS / JS",
    toFormat: "MINIFIED",
    accept: ".json,.css,.js,.html,.txt",
    description: "Hapus spasi dan baris kosong untuk memperkecil ukuran payload data pemrograman.",
    icon: "FileCode",
    isCompressor: true,
  },

  // ============================================================
  // 3. KATEGORI DOKUMEN & PDF (8 ALAT)
  // ============================================================
  {
    id: "doc-scanner-doc",
    name: "Scanner Dokumen (CamScanner PDF)",
    category: "document",
    fromFormat: "SCAN / FOTO",
    toFormat: "PDF MULTI PAGE",
    accept: ".jpg,.jpeg,.png,.webp,.pdf",
    description: "Pindai banyak lembar kertas catatan atau tugas menjadi satu dokumen PDF bersih dengan filter CamScanner.",
    icon: "Scan",
  },
  {
    id: "pdf-to-docx",
    name: "PDF ke Word (.docx)",
    category: "document",
    fromFormat: "PDF",
    toFormat: "DOCX",
    accept: ".pdf,.txt,.md",
    description: "Ubah dokumen PDF atau teks kuliah menjadi berkas Microsoft Word yang dapat diedit.",
    icon: "FileText",
  },
  {
    id: "docx-to-pdf",
    name: "Word / Teks ke PDF",
    category: "document",
    fromFormat: "DOCX / TXT",
    toFormat: "PDF",
    accept: ".txt,.md,.docx,.json,.html",
    description: "Konversi catatan kuliah, kode, atau draf dokumen menjadi berkas PDF siap cetak.",
    icon: "FileBox",
  },
  {
    id: "markdown-to-docx",
    name: "Markdown ke Word (.docx)",
    category: "document",
    fromFormat: "MD",
    toFormat: "DOCX",
    accept: ".md,.txt",
    description: "Ubah catatan Markdown berformat rapi menjadi berkas Microsoft Word resmi.",
    icon: "FileText",
  },
  {
    id: "markdown-to-pdf",
    name: "Markdown ke PDF",
    category: "document",
    fromFormat: "MD",
    toFormat: "PDF",
    accept: ".md,.txt",
    description: "Ekspor dokumen Markdown catatan studi menjadi PDF akademik berformat rapi.",
    icon: "FileBox",
  },
  {
    id: "pdf-to-txt",
    name: "PDF ke Teks Murni (.txt)",
    category: "document",
    fromFormat: "PDF",
    toFormat: "TXT",
    accept: ".pdf,.docx,.md,.txt",
    description: "Ekstrak seluruh teks dan paragraf dari dokumen tanpa format rumit.",
    icon: "FileText",
  },
  {
    id: "text-to-docx",
    name: "Teks Murni ke Word (.docx)",
    category: "document",
    fromFormat: "TXT",
    toFormat: "DOCX",
    accept: ".txt,.md",
    description: "Ubah teks catatan murni menjadi dokumen Microsoft Word formal bergaris tepi.",
    icon: "FileText",
  },
  {
    id: "pdf-merge",
    name: "Gabung Catatan ke Satu PDF",
    category: "document",
    fromFormat: "TEKS / DOKUMEN",
    toFormat: "MERGED PDF",
    accept: ".txt,.md,.pdf",
    description: "Satukan beberapa bab materi catatan studi menjadi satu berkas PDF terpadu.",
    icon: "FileBox",
  },

  // ============================================================
  // 4. KATEGORI DATA & TABEL (7 ALAT)
  // ============================================================
  {
    id: "json-to-csv",
    name: "JSON ke CSV / Excel",
    category: "data",
    fromFormat: "JSON",
    toFormat: "CSV",
    accept: ".json,.txt",
    description: "Ubah data array JSON menjadi berkas spreadsheet tabel CSV kompatibel Excel.",
    icon: "FileSpreadsheet",
  },
  {
    id: "csv-to-json",
    name: "CSV ke JSON",
    category: "data",
    fromFormat: "CSV",
    toFormat: "JSON",
    accept: ".csv,.txt",
    description: "Ubah baris data CSV / Excel menjadi struktur array JSON untuk pemrograman.",
    icon: "FileCode",
  },
  {
    id: "text-to-markdown",
    name: "CSV / Data ke Tabel Markdown",
    category: "data",
    fromFormat: "CSV / TXT",
    toFormat: "MD",
    accept: ".csv,.txt,.json",
    description: "Konversi data tabular menjadi format tabel Markdown (| Header |).",
    icon: "FileCode",
  },
  {
    id: "markdown-to-html",
    name: "Markdown ke HTML",
    category: "data",
    fromFormat: "MD",
    toFormat: "HTML",
    accept: ".md,.txt",
    description: "Ubah sintaks Markdown menjadi halaman web HTML dengan styling modern.",
    icon: "FileCode",
  },
  {
    id: "html-to-markdown",
    name: "HTML ke Markdown",
    category: "data",
    fromFormat: "HTML",
    toFormat: "MD",
    accept: ".html,.htm,.txt",
    description: "Ekstrak teks dari tag web HTML menjadi Markdown bersih.",
    icon: "FileCode",
  },
  {
    id: "json-to-xml",
    name: "JSON ke XML",
    category: "data",
    fromFormat: "JSON",
    toFormat: "XML",
    accept: ".json,.txt",
    description: "Konversi data objek/array JSON menjadi dokumen struktur XML.",
    icon: "FileCode",
  },
  {
    id: "xml-to-json",
    name: "XML ke JSON",
    category: "data",
    fromFormat: "XML",
    toFormat: "JSON",
    accept: ".xml,.txt",
    description: "Parsing markup XML menjadi objek data JSON modern.",
    icon: "FileCode",
  },

  // ============================================================
  // 5. KATEGORI KODE & DEV TOOLS (8 ALAT)
  // ============================================================
  {
    id: "code-beautifier",
    name: "Formatter & Beautifier Kode",
    category: "code",
    fromFormat: "JSON / SQL / JS",
    toFormat: "FORMATTED",
    accept: ".json,.sql,.js,.ts,.html,.css,.txt",
    description: "Ratakan indentasi dan rapikan struktur kode JSON, SQL, atau JavaScript otomatis.",
    icon: "FileCode",
  },
  {
    id: "file-to-base64",
    name: "Berkas / Foto ke Base64",
    category: "code",
    fromFormat: "ANY FILE",
    toFormat: "BASE64 URI",
    accept: "*",
    description: "Ubah berkas gambar atau dokumen menjadi string Base64 Data URI siap pakai.",
    icon: "FileCode",
  },
  {
    id: "base64-to-file",
    name: "Base64 ke Berkas / Foto",
    category: "code",
    fromFormat: "BASE64 TEXT",
    toFormat: "FILE / JPG",
    accept: ".txt",
    description: "Decode teks string Base64 kembali menjadi file biner atau gambar.",
    icon: "FileCode",
  },
  {
    id: "hash-generator",
    name: "Generator Hash (SHA 256 / MD5)",
    category: "code",
    fromFormat: "TEXT / FILE",
    toFormat: "HASH DIGEST",
    accept: "*",
    description: "Hitung checksum kriptografi SHA 256 dan SHA 512 dari teks materi atau berkas.",
    icon: "ShieldCheck",
  },
  {
    id: "jwt-decoder",
    name: "JWT Token Inspector & Decoder",
    category: "code",
    fromFormat: "JWT TOKEN",
    toFormat: "JSON PAYLOAD",
    accept: ".txt",
    description: "Decode header dan payload token JWT tanpa perlu memasukkan secret key.",
    icon: "FileCode",
  },
  {
    id: "url-encoder",
    name: "URL Encoder & Decoder",
    category: "code",
    fromFormat: "RAW URL / ENCODED",
    toFormat: "PROCESSED URL",
    accept: ".txt",
    description: "Encode query parameter karakter khusus URL atau decode kembali ke teks asli.",
    icon: "FileCode",
  },
  {
    id: "uuid-generator",
    name: "Generator UUID / GUID (v4)",
    category: "code",
    fromFormat: "REQUEST",
    toFormat: "UUID LIST",
    accept: ".txt",
    description: "Buat ID unik UUID v4 acak untuk kebutuhan skema database dan pemrograman.",
    icon: "Code2",
  },
  {
    id: "color-converter",
    name: "Konverter Warna (HEX / RGB / HSL)",
    category: "code",
    fromFormat: "HEX / RGB",
    toFormat: "HSL / CSS",
    accept: ".txt",
    description: "Konversi nilai warna CSS antar format HEX (#0071e3), RGB, dan HSL secara instan.",
    icon: "Palette",
  },
];

// ============================================================
// CAMSCANNER DOCUMENT SCANNING ALGORITHMS & FILTERS
// ============================================================

export type CamScannerFilterMode = "magic_color" | "bw_clean" | "grayscale" | "lighten" | "original";

/**
 * Applies CamScanner Professional Document Filters on any Image/Document
 */
export async function applyCamScannerFilter(
  source: File | Blob | string,
  filterMode: CamScannerFilterMode = "magic_color",
  rotationDegrees: number = 0,
  watermarkText: string = ""
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const processImage = (img: HTMLImageElement) => {
      const canvas = document.createElement("canvas");
      const isRotated90or270 = Math.abs(rotationDegrees % 180) === 90;
      canvas.width = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
      canvas.height = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context tidak tersedia"));
        return;
      }

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (rotationDegrees !== 0) {
        ctx.rotate((rotationDegrees * Math.PI) / 180);
      }
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // 1. Calculate Average Luminance for Adaptive Thresholding
      let totalLuma = 0;
      for (let i = 0; i < data.length; i += 4) {
        totalLuma += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      }
      const avgLuma = totalLuma / (data.length / 4);

      // 2. Apply CamScanner Specific Filter
      if (filterMode === "magic_color") {
        // MAGIC COLOR: Adaptive background whitening + high contrast ink enhancement + color retention
        const bgThreshold = Math.max(160, avgLuma * 1.15);
        for (let i = 0; i < data.length; i += 4) {
          const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          if (luma > bgThreshold) {
            // Push grayish/yellowish paper to clean white
            const ratio = (luma - bgThreshold) / (255 - bgThreshold);
            data[i] = Math.min(255, data[i] + (255 - data[i]) * Math.pow(ratio, 0.5));
            data[i + 1] = Math.min(255, data[i + 1] + (255 - data[i + 1]) * Math.pow(ratio, 0.5));
            data[i + 2] = Math.min(255, data[i + 2] + (255 - data[i + 2]) * Math.pow(ratio, 0.5));
          } else {
            // Darken ink, amplify saturation
            data[i] = Math.max(0, data[i] * 0.78);
            data[i + 1] = Math.max(0, data[i + 1] * 0.78);
            data[i + 2] = Math.max(0, data[i + 2] * 0.78);
          }
        }
      } else if (filterMode === "bw_clean") {
        // B&W CLEAN (Adaptive Binarization): Crisp 2-tone scan without shadow gradients
        const threshold = Math.max(128, avgLuma * 0.95);
        for (let i = 0; i < data.length; i += 4) {
          const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const val = luma > threshold ? 255 : 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }
      } else if (filterMode === "grayscale") {
        // GRAYSCALE: Smooth grayscale with subtle S-curve contrast
        for (let i = 0; i < data.length; i += 4) {
          const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const contrasted = Math.min(255, Math.max(0, (luma - 128) * 1.35 + 128));
          data[i] = contrasted;
          data[i + 1] = contrasted;
          data[i + 2] = contrasted;
        }
      } else if (filterMode === "lighten") {
        // LIGHTEN: Softens shadows, brightens background by +25%
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.25 + 15);
          data[i + 1] = Math.min(255, data[i + 1] * 1.25 + 15);
          data[i + 2] = Math.min(255, data[i + 2] * 1.25 + 15);
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Watermark Text if specified
      if (watermarkText && watermarkText.trim().length > 0) {
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
        ctx.font = `bold ${Math.max(14, Math.round(canvas.width / 24))}px sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(watermarkText, canvas.width - 15, canvas.height - 15);
        ctx.restore();
      }

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Gagal memproses filter dokumen"));
        },
        "image/jpeg",
        0.95
      );
    };

    if (typeof source === "string") {
      const img = new Image();
      img.onload = () => processImage(img);
      img.onerror = () => reject(new Error("Gambar tidak valid"));
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => processImage(img);
        img.onerror = () => reject(new Error("Berkas gambar tidak valid"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Gagal membaca berkas"));
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Multi-Page CamScanner Batch to Single Formatted PDF
 */
export async function generateScannedPdfBatch(
  pages: { blob: Blob; title?: string }[],
  docTitle: string = "Dokumen Scan CamScanner",
  watermarkText: string = ""
): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const maxW = pageWidth - margin * 2;
  const maxH = pageHeight - margin * 2 - 20;

  for (let index = 0; index < pages.length; index++) {
    if (index > 0) {
      pdf.addPage();
    }

    const pageItem = pages[index];
    const dataUrl: string = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(pageItem.blob);
    });

    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = dataUrl;
    });

    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
    const renderW = img.naturalWidth * scale;
    const renderH = img.naturalHeight * scale;
    const renderX = (pageWidth - renderW) / 2;
    const renderY = margin;

    pdf.addImage(dataUrl, "JPEG", renderX, renderY, renderW, renderH, undefined, "FAST");

    // Header & Footer
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`${docTitle} • Halaman ${index + 1} dari ${pages.length}`, margin, pageHeight - 12);

    if (watermarkText) {
      pdf.text(watermarkText, pageWidth - margin - 80, pageHeight - 12);
    }
  }

  return pdf.output("blob");
}

// ============================================================
// FOTO & GAMBAR PROCESSING UTILITIES
// ============================================================

/**
 * HD Image Enhancer & Super-Resolution Sharpening Engine
 */
export async function enhanceImageToHD(
  file: File,
  scaleFactor: 2 | 4 = 2,
  sharpnessLevel: number = 1.25
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const targetW = img.naturalWidth * scaleFactor;
        const targetH = img.naturalHeight * scaleFactor;

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context tidak tersedia"));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        // Adaptive Contrast Normalization
        const contrast = 1.12;
        const intercept = 128 * (1 - contrast);
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, data[i] * contrast + intercept));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * contrast + intercept));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * contrast + intercept));
        }

        // Unsharp Mask Sharpening
        if (sharpnessLevel > 0) {
          const weights = [0, -sharpnessLevel, 0, -sharpnessLevel, 1 + 4 * sharpnessLevel, -sharpnessLevel, 0, -sharpnessLevel, 0];
          const side = 3;
          const halfSide = 1;
          const src = new Uint8ClampedArray(data);
          const w = targetW;
          const h = targetH;

          for (let y = 1; y < h - 1; y += 2) {
            for (let x = 1; x < w - 1; x += 2) {
              const dstOff = (y * w + x) * 4;
              let r = 0, g = 0, b = 0;
              for (let cy = 0; cy < side; cy++) {
                for (let cx = 0; cx < side; cx++) {
                  const scy = y + cy - halfSide;
                  const scx = x + cx - halfSide;
                  const srcOff = (scy * w + scx) * 4;
                  const wt = weights[cy * side + cx];
                  r += src[srcOff] * wt;
                  g += src[srcOff + 1] * wt;
                  b += src[srcOff + 2] * wt;
                }
              }
              data[dstOff] = Math.min(255, Math.max(0, r));
              data[dstOff + 1] = Math.min(255, Math.max(0, g));
              data[dstOff + 2] = Math.min(255, Math.max(0, b));
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Gagal mengekspor foto HD"));
          },
          "image/jpeg",
          0.96
        );
      };
      img.onerror = () => reject(new Error("Format foto tidak dapat dibaca"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca berkas"));
    reader.readAsDataURL(file);
  });
}

/**
 * Advanced Photo Processor (Pasfoto, Resize, Crop, Invert, Rotate, Watermark)
 */
export async function processPhotoAdvanced(
  file: File,
  options: {
    targetWidth?: number;
    targetHeight?: number;
    cropRatio?: "1:1" | "4:3" | "16:9" | "3:4";
    bgColor?: string;
    grayscale?: boolean;
    invertColors?: boolean;
    rotationDegrees?: number;
    flipHorizontal?: boolean;
    watermarkText?: string;
    quality?: number;
    format?: "jpeg" | "png" | "webp";
  } = {}
): Promise<Blob> {
  const {
    targetWidth,
    targetHeight,
    cropRatio,
    bgColor,
    grayscale = false,
    invertColors = false,
    rotationDegrees = 0,
    flipHorizontal = false,
    watermarkText,
    quality = 0.92,
    format = "jpeg",
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let srcX = 0;
        let srcY = 0;
        let srcW = img.naturalWidth;
        let srcH = img.naturalHeight;

        // Apply Crop Ratio if specified
        if (cropRatio) {
          let ratioVal = 1;
          if (cropRatio === "1:1") ratioVal = 1;
          else if (cropRatio === "4:3") ratioVal = 4 / 3;
          else if (cropRatio === "16:9") ratioVal = 16 / 9;
          else if (cropRatio === "3:4") ratioVal = 3 / 4;

          const currentRatio = srcW / srcH;
          if (currentRatio > ratioVal) {
            const newW = srcH * ratioVal;
            srcX = (srcW - newW) / 2;
            srcW = newW;
          } else {
            const newH = srcW / ratioVal;
            srcY = (srcH - newH) / 2;
            srcH = newH;
          }
        }

        const outW = targetWidth || srcW;
        const outH = targetHeight || srcH;

        const canvas = document.createElement("canvas");
        const isRotated90or270 = Math.abs(rotationDegrees % 180) === 90;
        canvas.width = isRotated90or270 ? outH : outW;
        canvas.height = isRotated90or270 ? outW : outH;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context tidak tersedia"));
          return;
        }

        // Background Color Fill
        if (bgColor && bgColor !== "transparent") {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        if (rotationDegrees !== 0) {
          ctx.rotate((rotationDegrees * Math.PI) / 180);
        }
        if (flipHorizontal) {
          ctx.scale(-1, 1);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, srcX, srcY, srcW, srcH, -outW / 2, -outH / 2, outW, outH);
        ctx.restore();

        // Filters: Grayscale or Invert
        if (grayscale || invertColors) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            if (grayscale) {
              const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
              data[i] = avg;
              data[i + 1] = avg;
              data[i + 2] = avg;
            }
            if (invertColors) {
              data[i] = 255 - data[i];
              data[i + 1] = 255 - data[i + 1];
              data[i + 2] = 255 - data[i + 2];
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }

        // Watermark Text
        if (watermarkText && watermarkText.trim().length > 0) {
          ctx.save();
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.font = `bold ${Math.max(16, Math.round(canvas.width / 22))}px sans-serif`;
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
          ctx.shadowBlur = 4;
          ctx.fillText(watermarkText, canvas.width - 15, canvas.height - 15);
          ctx.restore();
        }

        const mimeType = format === "png" ? "image/png" : format === "webp" ? "image/webp" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Gagal memproses gambar"));
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => reject(new Error("Berkas gambar tidak valid"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca berkas"));
    reader.readAsDataURL(file);
  });
}

/**
 * Embed Photo into Microsoft Word (.docx) Document
 */
export async function convertPhotoToWord(file: File, title: string): Promise<Blob> {
  const { Document, Packer, Paragraph, HeadingLevel, AlignmentType, ImageRun } = await import("docx");
  const arrayBuffer = await file.arrayBuffer();
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title || "Dokumen Foto Velqora",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new ImageRun({
                data: arrayBuffer,
                type: "jpg",
                transformation: {
                  width: 500,
                  height: 380,
                },
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `Lampiran foto diproses secara modular melalui Velqora pada ${new Date().toLocaleDateString("id-ID")}`,
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
    ],
  });
  return await Packer.toBlob(doc);
}

/**
 * Convert Image to PDF
 */
export async function convertImageToPdf(file: File, title: string): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const isLandscape = img.naturalWidth > img.naturalHeight;
        const pdf = new jsPDF({
          orientation: isLandscape ? "landscape" : "portrait",
          unit: "pt",
          format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 36;
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2 - 30;

        let w = img.naturalWidth;
        let h = img.naturalHeight;
        const scale = Math.min(maxW / w, maxH / h);
        w = w * scale;
        h = h * scale;

        const x = (pageWidth - w) / 2;
        const y = margin + 20;

        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139);
        pdf.text(title || "Lampiran Berkas", margin, margin);

        pdf.addImage(img, "JPEG", x, y, w, h, undefined, "FAST");
        const blob = pdf.output("blob");
        resolve(blob);
      };
      img.onerror = () => reject(new Error("Format foto tidak valid"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca berkas foto"));
    reader.readAsDataURL(file);
  });
}

// ============================================================
// DOKUMEN & PDF PROCESSING UTILITIES
// ============================================================

export async function convertTextToDocx(textContent: string, title: string): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");
  const lines = textContent.split("\n");
  const paragraphs: any[] = [
    new Paragraph({
      text: title || "Dokumen Materi Velqora",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }
    if (trimmed.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.replace(/^#\s+/, ""),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (trimmed.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.replace(/^##\s+/, ""),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 90 },
        })
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      paragraphs.push(
        new Paragraph({
          text: `• ${trimmed.replace(/^[-*]\s+/, "")}`,
          spacing: { after: 60 },
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: line })],
          spacing: { after: 80 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });
  return await Packer.toBlob(doc);
}

export async function convertTextToPdf(
  textContent: string,
  title: string,
  compact: boolean = false
): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = compact ? 30 : 40;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(compact ? 13 : 16);
  pdf.setTextColor(15, 23, 42);
  pdf.text(title || "Dokumen Velqora", margin, y);
  y += compact ? 18 : 26;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(compact ? 8 : 10);
  pdf.setTextColor(51, 65, 85);

  const lines = textContent.split("\n");
  for (const rawLine of lines) {
    const wrapped = pdf.splitTextToSize(rawLine || " ", maxWidth);
    for (const line of wrapped) {
      if (y > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += compact ? 11 : 14;
    }
  }

  return pdf.output("blob");
}

// ============================================================
// KOMPRESI & ZIP UTILITIES
// ============================================================

export async function compressFilesToZip(
  files: { name: string; content: string | Blob | File }[]
): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.content);
  }
  return await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });
}

export async function extractZipArchive(
  file: File
): Promise<{ fileName: string; size: string; content: string }[]> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const loaded = await zip.loadAsync(file);
  const results: { fileName: string; size: string; content: string }[] = [];

  for (const [filename, fileObj] of Object.entries(loaded.files)) {
    if (!fileObj.dir) {
      const text = await fileObj.async("text");
      results.push({
        fileName: filename,
        size: `${Math.round(text.length / 1024)} KB`,
        content: text.slice(0, 1000),
      });
    }
  }
  return results;
}

export function minifyCodeOrJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch {
    return input
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}();,:>+=<])\s*/g, "$1")
      .trim();
  }
}

// ============================================================
// DATA & TABEL UTILITIES
// ============================================================

export function convertJsonToCsv(jsonStr: string): string {
  try {
    const data = JSON.parse(jsonStr);
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0) return "";
    const headers = Object.keys(arr[0]);
    const csvRows = [headers.join(",")];
    for (const row of arr) {
      const values = headers.map((header) => {
        const val = row[header] !== undefined ? String(row[header]) : "";
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
  } catch (err: any) {
    throw new Error("JSON tidak valid untuk diubah ke CSV.");
  }
}

export function convertCsvToJson(csvStr: string): string {
  const lines = csvStr.trim().split("\n");
  if (lines.length < 2) throw new Error("CSV minimal harus memiliki baris header dan data.");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const result: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const obj: Record<string, string> = {};
    const currentLine = lines[i].split(",");
    if (currentLine.length === headers.length) {
      headers.forEach((header, index) => {
        obj[header] = currentLine[index].trim().replace(/^"|"$/g, "");
      });
      result.push(obj);
    }
  }
  return JSON.stringify(result, null, 2);
}

export function convertCsvToMarkdown(csvStr: string): string {
  const lines = csvStr.trim().split("\n");
  if (lines.length === 0) return "";
  const headers = lines[0].split(",").map((h) => h.trim());
  let md = `| ${headers.join(" | ")} |\n`;
  md += `| ${headers.map(() => "---").join(" | ")} |\n`;
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((v) => v.trim());
    if (row.length === headers.length) {
      md += `| ${row.join(" | ")} |\n`;
    }
  }
  return md;
}

export function convertMarkdownToHtml(mdStr: string, title: string): string {
  const htmlBody = mdStr
    .replace(/^# (.*$)/gim, '<h1 style="color:#2997ff;font-size:24px;margin-bottom:12px;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="color:#ffffff;font-size:18px;margin-top:18px;margin-bottom:8px;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="color:#94a3b8;font-size:15px;">$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(/^- (.*$)/gim, '<li style="margin-left:20px;color:#cbd5e1;">$1</li>')
    .replace(/\n/gim, "<br />");

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title || "Dokumen Materi"}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f8fafc; padding: 32px; line-height: 1.6; }
    h1, h2, h3 { font-family: inherit; font-weight: 700; }
  </style>
</head>
<body>
  ${htmlBody}
</body>
</html>`;
}

export function convertJsonToXml(jsonStr: string): string {
  try {
    const obj = JSON.parse(jsonStr);
    const toXml = (o: any, tag: string = "root"): string => {
      let xml = `<${tag}>`;
      if (typeof o === "object" && o !== null) {
        for (const [k, v] of Object.entries(o)) {
          const cleanKey = k.replace(/[^a-zA-Z0-9_]/g, "_");
          if (Array.isArray(v)) {
            v.forEach((item) => {
              xml += toXml(item, "item");
            });
          } else if (typeof v === "object") {
            xml += toXml(v, cleanKey);
          } else {
            xml += `<${cleanKey}>${v}</${cleanKey}>`;
          }
        }
      } else {
        xml += String(o);
      }
      xml += `</${tag}>`;
      return xml;
    };
    return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(obj, "data")}`;
  } catch {
    throw new Error("JSON tidak valid untuk diubah ke XML.");
  }
}

// ============================================================
// KODE & DEV UTILITIES
// ============================================================

export function formatCodeOrJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return input
      .split(";")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(";\n");
  }
}

export async function generateCryptoHash(text: string, algorithm: "SHA-256" | "SHA-512" = "SHA-256"): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function decodeJwt(jwtStr: string): string {
  const parts = jwtStr.trim().split(".");
  if (parts.length < 2) throw new Error("Format JWT tidak valid. Minimal harus memiliki header dan payload.");
  const decodePart = (str: string) => {
    try {
      return JSON.parse(atob(str.replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
      return atob(str);
    }
  };
  return JSON.stringify(
    {
      header: decodePart(parts[0]),
      payload: decodePart(parts[1]),
      signature: parts[2] || "none",
    },
    null,
    2
  );
}

export function generateUuidList(count: number = 5): string {
  const list: string[] = [];
  for (let i = 0; i < count; i++) {
    list.push(crypto.randomUUID());
  }
  return list.join("\n");
}
