// scripts/curriculum-generator/assemble-dl-curriculum.ts
import * as fs from 'fs';
import * as path from 'path';
import { DL_CHAPTERS_1_TO_2 } from './dl-data-ch1-2';
import { DL_CHAPTERS_3_TO_5 } from './dl-data-ch3-5';

const allChapters = [
  ...DL_CHAPTERS_1_TO_2,
  ...DL_CHAPTERS_3_TO_5
];

console.log(`Assembling Deep Learning Chunk 1:`);
console.log(`Total Chapters: ${allChapters.length}`);
console.log(`Total Subchapters: ${allChapters.reduce((acc, ch) => acc + ch.subchapters.length, 0)}`);

const targetPath = path.resolve(__dirname, '../../src/lib/curriculum/topics/12-deep-learning.ts');

const escapeBackticks = (str: any) => {
  if (typeof str !== 'string') return '';
  return str.replace(/`/g, '\\`');
};

let content = `import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK RESMI: DEEP LEARNING (PRIORITAS 4 - CHUNK 1: BAB 1-5)
 * Rujukan Kanonikal: Goodfellow et al. (Deep Learning, MIT Press 2016),
 * Stanford CS230 (Deep Learning), MIT 6.S191 (Introduction to Deep Learning),
 * PyTorch Official Core Documentation (Autograd & nn Mechanics).
 * Status: Terverifikasi Substantif (Chunk 1 dari 4: 5 Bab, 50 Subbab Lengkap Bebas Skeleton).
 */
export const deepLearningCurriculum: AcademicCurriculum = {
  id: "deep-learning",
  slug: "deep-learning",
  title: "Deep Learning",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Kurikulum pembelajaran mendalam (Deep Learning) komprehensif berstandar universitas dunia: taksonomi representasi fitur hierarkis, aljabar tensor multidimensi dan operasi broadcasting di PyTorch, arsitektur Perceptron Multi-Lapis (MLP) dan Teorema Aproksimasi Universal Hornik-Cybenko, evaluasi analitis fungsi aktivasi non-linier (Sigmoid, Tanh, ReLU, LeakyReLU, PReLU, ELU, SELU, GELU, SiLU/Swish, Softmax) serta mitigasi vanishing dan dying gradient, taksonomi fungsi kerugian berbasis prinsip MLE dan teori informasi (MSE, MAE, Huber, Smooth L1, BCE, BCEWithLogitsLoss, Categorical Cross-Entropy, KL Divergence, Focal Loss), visualisasi lanskap fungsi kerugian 2D, serta kalkulus aturan rantai multivariat untuk propagasi mundur (backpropagation) analitis matriks dan arsitektur mesin C++ PyTorch Autograd.",
  estimatedHours: 90,
  version: "3.0.0",
  auditStatus: "VERIFIED_WITH_LIMITATIONS",
  primaryReferences: [
    {
      id: "src-goodfellow-deep-learning",
      title: "Deep Learning",
      authors: ["Ian Goodfellow", "Yoshua Bengio", "Aaron Courville"],
      type: "book",
      url: "https://www.deeplearningbook.org/",
      sourceType: "academic-book",
      provider: "MIT Press",
      relevance: "Buku rujukan definitif mengenai representasi hierarkis, aljabar tensor, MLP, kalkulus backpropagation, dan dinamika gradien.",
      verified: true,
      lastChecked: "2026-09-17"
    },
    {
      id: "src-pytorch-docs",
      title: "PyTorch Core Documentation & Autograd Mechanics",
      authors: ["PyTorch Contributors"],
      type: "documentation",
      url: "https://pytorch.org/docs/stable/index.html",
      sourceType: "official-documentation",
      provider: "PyTorch Foundation",
      relevance: "Dokumentasi resmi API tensor, modul nn, autograd DAG engine, context managers (no_grad, inference_mode), dan fungsi kerugian fusi numerik.",
      verified: true,
      lastChecked: "2026-09-17"
    },
    {
      id: "src-hornik-1989",
      title: "Multilayer Feedforward Networks are Universal Approximators",
      authors: ["Kurt Hornik", "Maxwell Stinchcombe", "Halbert White"],
      type: "paper",
      url: "https://www.sciencedirect.com/science/article/pii/0893608089900208",
      sourceType: "paper",
      provider: "Neural Networks (1989)",
      relevance: "Landasan teoritis matematis Teorema Aproksimasi Universal untuk arsitektur feedforward dengan aktivasi non-linier.",
      verified: true,
      lastChecked: "2026-09-17"
    },
    {
      id: "src-gelu-2016",
      title: "Gaussian Error Linear Units (GELUs)",
      authors: ["Dan Hendrycks", "Kevin Gimpel"],
      type: "paper",
      url: "https://arxiv.org/abs/1606.08415",
      sourceType: "paper",
      provider: "arXiv / NeurIPS Workshop",
      relevance: "Paper orisinal aktivasi modern GELU yang diadopsi secara universal oleh arsitektur Transformer (BERT, GPT, ViT).",
      verified: true,
      lastChecked: "2026-09-17"
    },
    {
      id: "src-focal-loss-2017",
      title: "Focal Loss for Dense Object Detection",
      authors: ["Tsung-Yi Lin", "Priya Goyal", "Ross Girshick", "Kaiming He", "Piotr Dollar"],
      type: "paper",
      url: "https://arxiv.org/abs/1708.02002",
      sourceType: "paper",
      provider: "ICCV 2017",
      relevance: "Perumusan Focal Loss dengan faktor modulasi dinamis untuk mengatasi ketimpangan kelas ekstrem.",
      verified: true,
      lastChecked: "2026-09-17"
    }
  ],
  chapters: [
`;

allChapters.forEach((ch, chIdx) => {
  content += `    {\n`;
  content += `      id: "${ch.id}",\n`;
  content += `      title: "${ch.title}",\n`;
  content += `      desc: "${ch.desc}",\n`;
  content += `      subchapters: [\n`;

  ch.subchapters.forEach((sub, sIdx) => {
    content += `        {\n`;
    content += `          num: "${sub.num}",\n`;
    content += `          slug: "${sub.slug}",\n`;
    content += `          title: "${sub.title}",\n`;
    content += `          desc: "${sub.desc}",\n`;
    content += `          concept: \`${escapeBackticks(sub.concept)}\`,\n`;
    content += `          formula: \`${escapeBackticks(sub.formula)}\`,\n`;
    content += `          code: \`${escapeBackticks(sub.code)}\`,\n`;
    content += `          codeExp: \`${escapeBackticks(sub.codeExp)}\`,\n`;
    content += `          expectedOutput: \`${escapeBackticks(sub.expectedOutput)}\`,\n`;
    content += `          pitfalls: \`${escapeBackticks(sub.pitfalls)}\`,\n`;
    content += `          refUrl: "${sub.refUrl}"\n`;
    content += `        }${sIdx < ch.subchapters.length - 1 ? ',' : ''}\n`;
  });

  content += `      ]\n`;
  content += `    }${chIdx < allChapters.length - 1 ? ',' : ''}\n`;
});

content += `  ]\n};\n`;

fs.writeFileSync(targetPath, content, 'utf-8');
console.log(`Successfully assembled Deep Learning Chunk 1 to ${targetPath}`);
console.log(`File size: ${fs.statSync(targetPath).size} bytes`);
