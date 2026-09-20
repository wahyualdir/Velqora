import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseMarkdownToModuleStructure } from "@/lib/import/module-parser";

describe("Module File Import & Parsing Engine (Owner Specific)", () => {
  it("should extract title, description, and chapters from standard markdown document", () => {
    const markdown = `# Pengantar Convolutional Neural Networks

Convolutional Neural Networks (CNN) adalah arsitektur deep learning yang dirancang khusus untuk memproses data berstruktur grid dua dimensi seperti citra digital.

## Bab 1: Konvolusi 2D dan Filter Spatial
Operasi konvolusi dilakukan dengan menggeser kernel di atas citra input.

## Bab 2: Pooling Layers (Max Pooling dan Average Pooling)
Pooling berguna untuk mereduksi dimensi spasial representasi fitur.

## Bab 3: Arsitektur LeNet-5 dan VGG
Sejarah perkembangan jaringan konvolusi dari tahun 1998 hingga 2014.
`;

    const result = parseMarkdownToModuleStructure(markdown, "materi-cnn.pdf");

    assert.equal(result.suggestedTitle, "Pengantar Convolutional Neural Networks");
    assert.ok(result.suggestedDescription.includes("Convolutional Neural Networks"));
    assert.equal(result.detectedChapters.length, 3);
    assert.equal(result.detectedChapters[0], "Bab 1: Konvolusi 2D dan Filter Spatial");
    assert.equal(result.detectedChapters[1], "Bab 2: Pooling Layers (Max Pooling dan Average Pooling)");
    assert.equal(result.detectedChapters[2], "Bab 3: Arsitektur LeNet-5 dan VGG");
  });

  it("should fallback to filename title if no H1 is present", () => {
    const markdown = `Pengantar materi tanpa heading level satu.

## Pengenalan Variabel
Materi pengenalan tipe data dan variabel.

## Struktur Percabangan
If, else if, dan else.
`;

    const result = parseMarkdownToModuleStructure(markdown, "dasar_pemrograman_python.docx");

    assert.equal(result.suggestedTitle, "dasar pemrograman python");
    assert.equal(result.detectedChapters.length, 2);
    assert.equal(result.detectedChapters[0], "Pengenalan Variabel");
    assert.equal(result.detectedChapters[1], "Struktur Percabangan");
  });

  it("should extract H3 headings as chapters when H2 headings are absent", () => {
    const markdown = `# Silabus Machine Learning

Pengantar machine learning praktis.

### Teori Probabilitas
Konsep dasar peluang.

### Regresi Linear
Metode Ordinary Least Squares (OLS).
`;

    const result = parseMarkdownToModuleStructure(markdown, "ml-slides.pptx");

    assert.equal(result.suggestedTitle, "Silabus Machine Learning");
    assert.equal(result.detectedChapters.length, 2);
    assert.equal(result.detectedChapters[0], "Teori Probabilitas");
    assert.equal(result.detectedChapters[1], "Regresi Linear");
  });

  it("should provide default chapters if document lacks any subheadings", () => {
    const markdown = `# Catatan Ringkas Tanpa Subbab

Hanya teks biasa tanpa heading bab sama sekali dari awal hingga akhir.
`;

    const result = parseMarkdownToModuleStructure(markdown, "catatan_singkat.pdf");

    assert.equal(result.suggestedTitle, "Catatan Ringkas Tanpa Subbab");
    assert.ok(result.detectedChapters.length >= 3);
    assert.equal(result.detectedChapters[0], "Pendahuluan & Konsep Utama");
  });

  it("should suggest appropriate category using local NLP classifier when categories provided", () => {
    const markdown = `# Object Detection dengan YOLOv8

Mendeteksi bounding box objek pada citra digital menggunakan single shot detector.

## Arsitektur Backbone CSPDarknet
## Loss Function CIoU dan DFL
`;

    const mockCategories = [
      { id: "cat-1", name: "Computer Vision" },
      { id: "cat-2", name: "Natural Language Processing" },
      { id: "cat-3", name: "Web Development" },
    ];

    const result = parseMarkdownToModuleStructure(markdown, "yolo.pdf", mockCategories);

    assert.equal(result.suggestedCategoryId, "cat-1");
    assert.equal(result.suggestedCategoryName, "Computer Vision");
  });
});
