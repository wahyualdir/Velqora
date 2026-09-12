import { describe, it } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import {
  convertIpynbToMarkdown,
  convertDocxToMarkdown,
  convertPptxToMarkdown,
  convertPdfToMarkdown,
  convertFileBufferToMarkdown,
} from "../file-to-markdown";
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";

describe("Deterministic Document Converters (Zero AI)", () => {
  describe("convertIpynbToMarkdown", () => {
    it("should extract markdown cells and code cells without outputs", () => {
      const sampleNotebook = {
        metadata: {
          kernelspec: { language: "python", name: "python3" },
        },
        cells: [
          {
            cell_type: "markdown",
            source: ["# Pengenalan Algoritma Perseptron\n", "Perseptron adalah model neuron buatan."],
          },
          {
            cell_type: "code",
            source: ["import numpy as np\n", "w = np.zeros(2)"],
            outputs: [
              {
                output_type: "stream",
                text: ["Epoch 1: Loss 0.05\n"],
              },
            ],
          },
          {
            cell_type: "markdown",
            source: ["## Fungsi Aktivasi\n", "Menggunakan fungsi step function."],
          },
        ],
      };

      const buffer = Buffer.from(JSON.stringify(sampleNotebook), "utf-8");
      const result = convertIpynbToMarkdown("perseptron.ipynb", buffer);

      assert.equal(result.suggestedTitle, "Pengenalan Algoritma Perseptron");
      assert.ok(result.markdownBody.includes("# Pengenalan Algoritma Perseptron"));
      assert.ok(result.markdownBody.includes("```python\nimport numpy as np\nw = np.zeros(2)\n```"));
      assert.ok(result.markdownBody.includes("## Fungsi Aktivasi"));
      // Outputs must NOT be present
      assert.ok(!result.markdownBody.includes("Epoch 1: Loss 0.05"));
      assert.equal(result.warning, undefined);
    });

    it("should fallback title to filename when no heading is present", () => {
      const sampleNotebook = {
        cells: [
          {
            cell_type: "code",
            source: ["print('hello world')"],
          },
        ],
      };

      const buffer = Buffer.from(JSON.stringify(sampleNotebook), "utf-8");
      const result = convertIpynbToMarkdown("latihan-dasar.ipynb", buffer);

      assert.equal(result.suggestedTitle, "latihan dasar");
      assert.ok(result.markdownBody.includes("```python\nprint('hello world')\n```"));
    });
  });

  describe("convertDocxToMarkdown", () => {
    it("should extract headings and paragraphs into ATX markdown", async () => {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: "Fundamental Machine Learning",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Machine Learning adalah cabang dari kecerdasan buatan.",
                  }),
                ],
              }),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      const result = await convertDocxToMarkdown("ml-fundamentals.docx", buffer);

      assert.equal(result.suggestedTitle, "Fundamental Machine Learning");
      assert.ok(result.markdownBody.includes("# Fundamental Machine Learning"));
      assert.ok(result.markdownBody.includes("Machine Learning adalah cabang dari kecerdasan buatan."));
      assert.equal(result.warning, undefined);
    });
  });

  describe("convertPptxToMarkdown", () => {
    it("should order slides numerically and extract text correctly", async () => {
      const zip = new JSZip();

      // Slide 1
      zip.file(
        "ppt/slides/slide1.xml",
        `<p:sld><a:t>Arsitektur Transformer</a:t><a:t>Subjudul Slide 1</a:t></p:sld>`
      );
      // Slide 2
      zip.file(
        "ppt/slides/slide2.xml",
        `<p:sld><a:t>Mekanisme Self-Attention &amp; Multi-Head</a:t></p:sld>`
      );
      // Slide 10 (must be ordered after slide 2, not alphabetically before)
      zip.file(
        "ppt/slides/slide10.xml",
        `<p:sld><a:t>Kesimpulan &amp; Evaluasi</a:t></p:sld>`
      );

      const buffer = await zip.generateAsync({ type: "nodebuffer" });
      const result = await convertPptxToMarkdown("transformer-lecture.pptx", buffer);

      assert.equal(result.suggestedTitle, "transformer lecture");
      assert.ok(result.markdownBody.includes("## Slide 1"));
      assert.ok(result.markdownBody.includes("Arsitektur Transformer"));
      assert.ok(result.markdownBody.includes("## Slide 2"));
      assert.ok(result.markdownBody.includes("Mekanisme Self-Attention & Multi-Head"));
      assert.ok(result.markdownBody.includes("## Slide 10"));
      assert.ok(result.markdownBody.includes("Kesimpulan & Evaluasi"));

      // Verify numerical ordering: Slide 1 appears before Slide 2, and Slide 2 appears before Slide 10
      const pos1 = result.markdownBody.indexOf("## Slide 1\n");
      const pos2 = result.markdownBody.indexOf("## Slide 2\n");
      const pos10 = result.markdownBody.indexOf("## Slide 10\n");

      assert.ok(pos1 < pos2);
      assert.ok(pos2 < pos10);
    });
  });

  describe("convertPdfToMarkdown", () => {
    it("should flag scanned/empty PDFs with warning when text length < 40", async () => {
      // Minimal dummy PDF structure
      const dummyPdfContent = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\nxref\n0 3\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \ntrailer<</Size 3/Root 1 0 R>>\nstartxref\n102\n%%EOF";
      const buffer = Buffer.from(dummyPdfContent, "binary");

      const result = await convertPdfToMarkdown("scanned-document.pdf", buffer);
      assert.ok(result.warning);
      assert.ok(result.warning.includes("Teks minim atau tidak terdeteksi"));
    });
  });

  describe("convertFileBufferToMarkdown dispatcher", () => {
    it("should throw error for unsupported file extension", async () => {
      const buffer = Buffer.from("dummy", "utf-8");
      await assert.rejects(
        async () => {
          await convertFileBufferToMarkdown("arsip.zip", buffer);
        },
        {
          name: "Error",
          message: "Format berkas '.zip' tidak didukung untuk konversi otomatis.",
        }
      );
    });
  });
});
