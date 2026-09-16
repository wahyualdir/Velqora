import * as fs from "fs";
import * as path from "path";
import { VERIFIED_SOURCES_CATALOG } from "./sources-registry";
import { VERIFIED_DATASETS } from "./dataset-registry";

const TOPICS_DIR = path.join(process.cwd(), "src/lib/curriculum/topics");

// Helper untuk format teks kode Python
function pythonCodeBlock(code: string): string {
  return "```python\n" + code.trim() + "\n```";
}

// Helper untuk format teks SQL
function sqlCodeBlock(code: string): string {
  return "```sql\n" + code.trim() + "\n```";
}

export interface ChapterSpec {
  num: number;
  title: string;
  desc: string;
  concepts: string[];
  subchapters: Array<{
    subNum: number;
    title: string;
    conceptEn: string;
    formula?: string;
    formulaExplanation?: string;
    code: {
      lang: "python" | "sql";
      filename: string;
      code: string;
      expectedOutput: string;
      explanation: string;
    };
    units: string[];
  }>;
  datasetKey?: string;
  miniProject: string;
  caseStudy?: string;
}

export interface TopicSpec {
  file?: string;
  exportVar?: string;
  id?: string;
  topicId?: string;
  slug?: string;
  title: string;
  category: string;
  level: "pemula" | "menengah" | "lanjutan";
  desc?: string;
  description?: string;
  hours?: number;
  estimatedHours?: number;
  version: string;
  sourceKeys?: string[];
  primarySourceIds?: string[];
  datasetKeys?: string[];
  datasetId?: string;
  chapters: ChapterSpec[];
}

export const CANONICAL_TOPIC_MAP: Record<string, { file: string; exportVar: string; id: string; slug: string }> = {
  "01-ai-agent": { file: "01-ai-agent.ts", exportVar: "aiAgentCurriculum", id: "ai-agent", slug: "ai-agent" },
  "ai-agent": { file: "01-ai-agent.ts", exportVar: "aiAgentCurriculum", id: "ai-agent", slug: "ai-agent" },
  "02-ai-ethics": { file: "02-ai-ethics.ts", exportVar: "aiEthicsCurriculum", id: "ai-ethics", slug: "ai-ethics" },
  "ai-ethics": { file: "02-ai-ethics.ts", exportVar: "aiEthicsCurriculum", id: "ai-ethics", slug: "ai-ethics" },
  "03-ai-governance": { file: "03-ai-governance.ts", exportVar: "aiGovernanceCurriculum", id: "ai-governance", slug: "ai-governance" },
  "ai-governance": { file: "03-ai-governance.ts", exportVar: "aiGovernanceCurriculum", id: "ai-governance", slug: "ai-governance" },
  "04-ai-security": { file: "04-ai-security.ts", exportVar: "aiSecurityCurriculum", id: "ai-security", slug: "ai-security" },
  "ai-security": { file: "04-ai-security.ts", exportVar: "aiSecurityCurriculum", id: "ai-security", slug: "ai-security" },
  "05-ai-fundamentals": { file: "05-ai-fundamentals.ts", exportVar: "aiFundamentalsCurriculum", id: "ai-fundamentals", slug: "ai-fundamentals" },
  "ai-fundamentals": { file: "05-ai-fundamentals.ts", exportVar: "aiFundamentalsCurriculum", id: "ai-fundamentals", slug: "ai-fundamentals" },
  "06-automl-nas": { file: "06-automl-nas.ts", exportVar: "autoMlNasCurriculum", id: "automl-nas", slug: "automl-nas" },
  "automl-nas": { file: "06-automl-nas.ts", exportVar: "autoMlNasCurriculum", id: "automl-nas", slug: "automl-nas" },
  "07-computational-intelligence": { file: "07-computational-intelligence.ts", exportVar: "computationalIntelligenceCurriculum", id: "computational-intelligence", slug: "computational-intelligence" },
  "computational-intelligence": { file: "07-computational-intelligence.ts", exportVar: "computationalIntelligenceCurriculum", id: "computational-intelligence", slug: "computational-intelligence" },
  "08-computer-vision": { file: "08-computer-vision.ts", exportVar: "computerVisionCurriculum", id: "computer-vision", slug: "computer-vision" },
  "computer-vision": { file: "08-computer-vision.ts", exportVar: "computerVisionCurriculum", id: "computer-vision", slug: "computer-vision" },
  "09-data-analyst": { file: "09-data-analyst.ts", exportVar: "dataAnalystCurriculum", id: "data-analyst", slug: "data-analyst" },
  "data-analyst": { file: "09-data-analyst.ts", exportVar: "dataAnalystCurriculum", id: "data-analyst", slug: "data-analyst" },
  "10-data-engineering-ai": { file: "10-data-engineering-ai.ts", exportVar: "dataEngineeringAiCurriculum", id: "data-engineering-ai", slug: "data-engineering-ai" },
  "data-engineering-ai": { file: "10-data-engineering-ai.ts", exportVar: "dataEngineeringAiCurriculum", id: "data-engineering-ai", slug: "data-engineering-ai" },
  "11-data-science": { file: "11-data-science.ts", exportVar: "dataScienceCurriculum", id: "data-science", slug: "data-science" },
  "data-science": { file: "11-data-science.ts", exportVar: "dataScienceCurriculum", id: "data-science", slug: "data-science" },
  "12-deep-learning": { file: "12-deep-learning.ts", exportVar: "deepLearningCurriculum", id: "deep-learning", slug: "deep-learning" },
  "deep-learning": { file: "12-deep-learning.ts", exportVar: "deepLearningCurriculum", id: "deep-learning", slug: "deep-learning" },
  "13-edge-ai-tinyml": { file: "13-edge-ai-tinyml.ts", exportVar: "edgeAiTinymlCurriculum", id: "edge-ai-tinyml", slug: "edge-ai-tinyml" },
  "edge-ai-tinyml": { file: "13-edge-ai-tinyml.ts", exportVar: "edgeAiTinymlCurriculum", id: "edge-ai-tinyml", slug: "edge-ai-tinyml" },
  "14-expert-system": { file: "14-expert-system.ts", exportVar: "expertSystemCurriculum", id: "expert-system", slug: "expert-system" },
  "expert-system": { file: "14-expert-system.ts", exportVar: "expertSystemCurriculum", id: "expert-system", slug: "expert-system" },
  "15-generative-ai": { file: "15-generative-ai.ts", exportVar: "generativeAiCurriculum", id: "generative-ai", slug: "generative-ai" },
  "generative-ai": { file: "15-generative-ai.ts", exportVar: "generativeAiCurriculum", id: "generative-ai", slug: "generative-ai" },
  "16-graph-neural-network": { file: "16-graph-neural-network.ts", exportVar: "graphNeuralNetworkCurriculum", id: "graph-neural-network", slug: "graph-neural-network" },
  "16-graph-neural-networks": { file: "16-graph-neural-network.ts", exportVar: "graphNeuralNetworkCurriculum", id: "graph-neural-network", slug: "graph-neural-network" },
  "graph-neural-network": { file: "16-graph-neural-network.ts", exportVar: "graphNeuralNetworkCurriculum", id: "graph-neural-network", slug: "graph-neural-network" },
  "17-knowledge-representation": { file: "17-knowledge-representation.ts", exportVar: "knowledgeRepresentationCurriculum", id: "knowledge-representation", slug: "knowledge-representation" },
  "knowledge-representation": { file: "17-knowledge-representation.ts", exportVar: "knowledgeRepresentationCurriculum", id: "knowledge-representation", slug: "knowledge-representation" },
  "18-large-language-model": { file: "18-large-language-model.ts", exportVar: "largeLanguageModelCurriculum", id: "large-language-model", slug: "large-language-model" },
  "18-large-language-models": { file: "18-large-language-model.ts", exportVar: "largeLanguageModelCurriculum", id: "large-language-model", slug: "large-language-model" },
  "large-language-model": { file: "18-large-language-model.ts", exportVar: "largeLanguageModelCurriculum", id: "large-language-model", slug: "large-language-model" },
  "19-machine-learning": { file: "19-machine-learning.ts", exportVar: "machineLearningCurriculum", id: "machine-learning", slug: "machine-learning" },
  "machine-learning": { file: "19-machine-learning.ts", exportVar: "machineLearningCurriculum", id: "machine-learning", slug: "machine-learning" },
  "20-mlops": { file: "20-mlops-deployment.ts", exportVar: "mlopsDeploymentCurriculum", id: "mlops-deployment", slug: "mlops-deployment" },
  "20-mlops-deployment": { file: "20-mlops-deployment.ts", exportVar: "mlopsDeploymentCurriculum", id: "mlops-deployment", slug: "mlops-deployment" },
  "mlops-deployment": { file: "20-mlops-deployment.ts", exportVar: "mlopsDeploymentCurriculum", id: "mlops-deployment", slug: "mlops-deployment" },
  "21-multimodal": { file: "21-multimodal-ai.ts", exportVar: "multimodalAiCurriculum", id: "multimodal-ai", slug: "multimodal-ai" },
  "21-multimodal-ai": { file: "21-multimodal-ai.ts", exportVar: "multimodalAiCurriculum", id: "multimodal-ai", slug: "multimodal-ai" },
  "multimodal-ai": { file: "21-multimodal-ai.ts", exportVar: "multimodalAiCurriculum", id: "multimodal-ai", slug: "multimodal-ai" },
  "22-natural-language-processing": { file: "22-natural-language-processing.ts", exportVar: "naturalLanguageProcessingCurriculum", id: "natural-language-processing", slug: "natural-language-processing" },
  "natural-language-processing": { file: "22-natural-language-processing.ts", exportVar: "naturalLanguageProcessingCurriculum", id: "natural-language-processing", slug: "natural-language-processing" },
  "23-recommendation-system": { file: "23-recommendation-system.ts", exportVar: "recommendationSystemCurriculum", id: "recommendation-system", slug: "recommendation-system" },
  "recommendation-system": { file: "23-recommendation-system.ts", exportVar: "recommendationSystemCurriculum", id: "recommendation-system", slug: "recommendation-system" },
  "24-reinforcement-learning": { file: "24-reinforcement-learning.ts", exportVar: "reinforcementLearningCurriculum", id: "reinforcement-learning", slug: "reinforcement-learning" },
  "reinforcement-learning": { file: "24-reinforcement-learning.ts", exportVar: "reinforcementLearningCurriculum", id: "reinforcement-learning", slug: "reinforcement-learning" },
  "25-robotics-embodied-ai": { file: "25-robotics-embodied-ai.ts", exportVar: "roboticsEmbodiedAiCurriculum", id: "robotics-embodied-ai", slug: "robotics-embodied-ai" },
  "robotics-embodied-ai": { file: "25-robotics-embodied-ai.ts", exportVar: "roboticsEmbodiedAiCurriculum", id: "robotics-embodied-ai", slug: "robotics-embodied-ai" },
  "26-speech-audio-ai": { file: "26-speech-audio-ai.ts", exportVar: "speechAudioAiCurriculum", id: "speech-audio-ai", slug: "speech-audio-ai" },
  "speech-audio-ai": { file: "26-speech-audio-ai.ts", exportVar: "speechAudioAiCurriculum", id: "speech-audio-ai", slug: "speech-audio-ai" },
  "27-time-series-forecasting": { file: "27-time-series-forecasting.ts", exportVar: "timeSeriesForecastingCurriculum", id: "time-series-forecasting", slug: "time-series-forecasting" },
  "time-series-forecasting": { file: "27-time-series-forecasting.ts", exportVar: "timeSeriesForecastingCurriculum", id: "time-series-forecasting", slug: "time-series-forecasting" },
  "28-vector-database-retrieval": { file: "28-vector-database-retrieval.ts", exportVar: "vectorDatabaseRetrievalCurriculum", id: "vector-database-retrieval", slug: "vector-database-retrieval" },
  "vector-database-retrieval": { file: "28-vector-database-retrieval.ts", exportVar: "vectorDatabaseRetrievalCurriculum", id: "vector-database-retrieval", slug: "vector-database-retrieval" },
};

export interface NormalizedTopicSpec {
  file: string;
  exportVar: string;
  id: string;
  slug: string;
  title: string;
  category: string;
  level: "pemula" | "menengah" | "lanjutan";
  desc: string;
  hours: number;
  version: string;
  sourceKeys: string[];
  datasetKeys: string[];
  chapters: ChapterSpec[];
}

export function normalizeTopicSpec(raw: any): NormalizedTopicSpec {
  const rawId = raw.id || raw.topicId;
  const canonical = CANONICAL_TOPIC_MAP[rawId] || {};
  const file = raw.file || canonical.file || `${rawId}.ts`;
  const exportVar = raw.exportVar || canonical.exportVar || "curriculum";
  const id = canonical.id || (rawId ? rawId.replace(/^\d+-/, "") : "topic");
  const slug = canonical.slug || raw.slug || id;
  const desc = raw.desc || raw.description || "";
  const hours = raw.hours || raw.estimatedHours || 60;
  const sourceKeys: string[] = raw.sourceKeys || raw.primarySourceIds || [];
  const datasetKeys: string[] = raw.datasetKeys || (raw.datasetId ? [raw.datasetId] : []);

  raw.file = file;
  raw.exportVar = exportVar;
  raw.id = id;
  raw.slug = slug;
  raw.desc = desc;
  raw.hours = hours;
  raw.sourceKeys = sourceKeys;
  raw.datasetKeys = datasetKeys;

  return {
    file,
    exportVar,
    id,
    slug,
    title: raw.title,
    category: raw.category,
    level: raw.level,
    desc,
    hours,
    version: raw.version || "2.2.0",
    sourceKeys,
    datasetKeys,
    chapters: raw.chapters,
  };
}

export function generateTopicFile(rawSpec: any): string {
  const spec = normalizeTopicSpec(rawSpec);
  const primaryRefs = spec.sourceKeys
    .map((k) => VERIFIED_SOURCES_CATALOG[k])
    .filter(Boolean)
    .map((ref) => {
      return `    {
      title: ${JSON.stringify(ref.title)},
      authors: ${JSON.stringify(ref.authors)},
      type: ${JSON.stringify(ref.type)},
      url: ${JSON.stringify(ref.url)},
      ${ref.doi ? `doi: ${JSON.stringify(ref.doi)},` : ""}
      relevance: ${JSON.stringify(ref.relevance)},
      ${ref.year ? `year: ${ref.year},` : ""}
      ${ref.publisherOrVenue ? `publisherOrVenue: ${JSON.stringify(ref.publisherOrVenue)},` : ""}
      sourceType: ${JSON.stringify(ref.sourceType)},
      provider: ${JSON.stringify(ref.provider)},
      relatedTopics: ${JSON.stringify(ref.relatedTopics || [])},
      relatedConcepts: ${JSON.stringify(ref.relatedConcepts || [])},
      verified: true,
      lastChecked: "2026-09-15",
    }`;
    })
    .join(",\n");

  const topicDatasets = (spec.datasetKeys || [])
    .map((k) => VERIFIED_DATASETS[k])
    .filter(Boolean)
    .map((ds) => {
      return `    {
      id: ${JSON.stringify(ds.id)},
      name: ${JSON.stringify(ds.name)},
      purpose: ${JSON.stringify(ds.purpose)},
      sourceUrl: ${JSON.stringify(ds.sourceUrl)},
      license: ${JSON.stringify(ds.license)},
      numSamples: ${JSON.stringify(ds.numSamples)},
      numFeatures: ${JSON.stringify(ds.numFeatures)},
      target: ${JSON.stringify(ds.target)},
      limitations: ${JSON.stringify(ds.limitations)},
      potentialBias: ${JSON.stringify(ds.potentialBias)},
      downloadInstructions: ${JSON.stringify(ds.downloadInstructions)},
      inspectionSnippet: ${JSON.stringify(ds.inspectionSnippet)},
      verified: true,
    }`;
    })
    .join(",\n");

  const chaptersCode = spec.chapters
    .map((ch) => {
      const chDataset = ch.datasetKey && VERIFIED_DATASETS[ch.datasetKey] ? VERIFIED_DATASETS[ch.datasetKey] : null;

      const subchaptersCode = ch.subchapters
        .map((sub) => {
          const subId = `${spec.id}-ch${ch.num}-sub${sub.subNum}`;
          const subSlug = `${ch.num}-${sub.subNum}-${sub.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;

          // Susun Markdown komprehensif
          let markdown = `# ${ch.num}.${sub.subNum}. ${sub.title}\n\n`;
          markdown += `> **Konsep Kunci (${sub.conceptEn})**: Materi ini menyajikan eksplorasi mendalam mengenai mekanisme komputasi, prinsip kerja, formulasi matematis, dan praktik terbaik implementasi dalam ekosistem ${spec.title}.\n\n`;
          markdown += `## 1. Definisi & Signifikansi Konseptual\nDalam pemodelan ${spec.title}, pemahaman terhadap **${sub.title}** (${sub.conceptEn}) merupakan fondasi krusial untuk menjamin keandalan sistem. Konsep ini menyelesaikan tantangan teknis dalam abstraksi sistem cerdas, mitigasi galat, dan efisiensi algoritma.\n\n`;
          markdown += `## 2. Mekanisme Kerja & Arsitektur Teknis\nAlur eksekusi melibatkan tahapan sistematis: validasi input, transformasi representasi, kalkulasi fungsi objektif, dan verifikasi status akhir. Perhatikan asumsi dasar, batasan domain, serta kasus batas (*edge cases*) saat menerapkan algoritma ini dalam sistem produksi.\n\n`;

          if (sub.formula) {
            markdown += `## 3. Formulasi Matematis Formal\nHubungan analitis dirumuskan secara formal sebagai berikut:\n\n${sub.formula}\n\n${sub.formulaExplanation || "Di mana setiap variabel didefinisikan sesuai notasi aljabar linier dan teori probabilitas standar."}\n\n`;
          }

          markdown += `## 4. Implementasi Kode & Praktikum\nBerikut adalah kode implementasi runnable yang memvalidasi konsep ${sub.title}:\n\n`;
          if (sub.code.lang === "sql") {
            markdown += sqlCodeBlock(sub.code.code);
          } else {
            markdown += pythonCodeBlock(sub.code.code);
          }
          markdown += `\n\n### Penjelasan Alur Kode:\n1. **Inisialisasi Data**: Menyiapkan sampel representatif yang merefleksikan kondisi data dunia nyata.\n2. **Eksekusi Komputasi**: Menjalankan fungsi algoritma inti dengan parameter terstandardisasi.\n3. **Verifikasi Output**: Memastikan hasil sesuai estimasi teoritis: \`${sub.code.expectedOutput}\`.\n\n`;

          markdown += `## 5. Kesalahan Umum & Praktik Rekayasa Terbaik\n- Menghindari manipulasi data tanpa validasi tipe dan batas nilai (*boundary checks*).\n- Memisahkan secara ketat data eksperimen dari evaluasi akhir untuk menghindari kebocoran data (*leakage*).\n- Mendokumentasikan kompleksitas waktu $\\mathcal{O}$ dan memori pada setiap fungsi komputasi.\n\n`;

          markdown += `## 6. Latihan Mandiri Berjenjang\n- **Level 1 (Pemahaman)**: Jelaskan arti simbol-simbol matematis dan parameter pada fungsi di atas.\n- **Level 2 (Implementasi)**: Jalankan kembali kode dengan memodifikasi ukuran input dua kali lipat.\n- **Level 3 (Debugging)**: Simulasikan kondisi data masukan bernilai kosong/ekstrem dan amati perilakunya.\n- **Level 4 (Mini-Project)**: Integrasikan modul ini ke dalam pipeline evaluasi menyeluruh.`;

          // Buat 10 sub-subbab terstruktur
          const subUnitsCode = sub.units
            .map((unitTitle, uIdx) => {
              const uNum = uIdx + 1;
              const unitId = `${subId}-unit${uNum}`;
              const unitSlug = `${ch.num}-${sub.subNum}-${uNum}-${unitTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
              return `        {
          id: ${JSON.stringify(unitId)},
          slug: ${JSON.stringify(unitSlug)},
          title: ${JSON.stringify(`${ch.num}.${sub.subNum}.${uNum}. ${unitTitle}`)},
          orderIndex: ${uNum},
          content_markdown: ${JSON.stringify(`### ${ch.num}.${sub.subNum}.${uNum}. ${unitTitle}\n\nPembahasan fokus mengenai **${unitTitle}** dalam konteks ${sub.title}. Memastikan penguasaan mendalam terhadap aspek teoritis, batasan komputasi, dan teknik integrasi tingkat lanjut.`)},
        }`;
            })
            .join(",\n");

          return `      {
        id: ${JSON.stringify(subId)},
        slug: ${JSON.stringify(subSlug)},
        title: ${JSON.stringify(`${ch.num}.${sub.subNum}. ${sub.title}`)},
        orderIndex: ${sub.subNum},
        description: ${JSON.stringify(`Eksplorasi mendalam ${sub.title} (${sub.conceptEn}): formulasi matematis, kode runnable, kesalahan umum, dan latihan bertingkat.`)},
        learningObjectives: [
          ${JSON.stringify(`Memahami prinsip fundamental ${sub.title}`)},
          ${JSON.stringify(`Menguasai perumusan matematis dan komputasi ${sub.conceptEn}`)},
          ${JSON.stringify(`Mampu mengimplementasikan dan mengevaluasi kode praktikum ${sub.code.filename}`)}
        ],
        prerequisites: [
          "Pemahaman dasar sintaks Python dan manipulasi array NumPy"
        ],
        content_markdown: ${JSON.stringify(markdown)},
        codeExamples: [
          {
            id: ${JSON.stringify(`${subId}-code`)},
            title: ${JSON.stringify(sub.code.filename)},
            language: ${JSON.stringify(sub.code.lang)},
            filename: ${JSON.stringify(sub.code.filename)},
            code: ${JSON.stringify(sub.code.code)},
            expectedOutput: ${JSON.stringify(sub.code.expectedOutput)},
            explanation: ${JSON.stringify(sub.code.explanation)},
            level: "menengah",
            hardwareRequirement: "cpu"
          }
        ],
        references: [
          ${JSON.stringify(VERIFIED_SOURCES_CATALOG[spec.sourceKeys[0]] || VERIFIED_SOURCES_CATALOG["python-docs"])}
        ],
        subSubchapters: [
${subUnitsCode}
        ]
      }`;
        })
        .join(",\n");

      return `    {
      id: ${JSON.stringify(`${spec.id}-ch-${ch.num}`)},
      slug: ${JSON.stringify(`bab-${ch.num}-${ch.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`)},
      title: ${JSON.stringify(`BAB ${ch.num}: ${ch.title}`)},
      orderIndex: ${ch.num},
      description: ${JSON.stringify(ch.desc)},
      learningObjectives: [
        ${JSON.stringify(`Menguasai taksonomi dan prinsip ${ch.title}`)},
        ${JSON.stringify(`Mampu menyelesaikan permasalahan pemodelan dengan ${ch.concepts.join(", ")}`)},
        ${JSON.stringify(`Mampu mengimplementasikan pengujian dan evaluasi performa model secara objektif`)}
      ],
      competencies: [
        ${JSON.stringify(`Analisis komputasi domain ${spec.title}`)},
        "Implementasi kode Python/SQL standar industri",
        "Penalaran matematis dan evaluasi empiris"
      ],
      coreConcepts: ${JSON.stringify(ch.concepts)},
      subchapters: [
${subchaptersCode}
      ],
      caseStudy: ${JSON.stringify(ch.caseStudy)},
      miniProject: ${JSON.stringify(ch.miniProject)},
      ${
        chDataset
          ? `dataset: {
        id: ${JSON.stringify(chDataset.id)},
        name: ${JSON.stringify(chDataset.name)},
        purpose: ${JSON.stringify(chDataset.purpose)},
        sourceUrl: ${JSON.stringify(chDataset.sourceUrl)},
        license: ${JSON.stringify(chDataset.license)},
        numSamples: ${JSON.stringify(chDataset.numSamples)},
        numFeatures: ${JSON.stringify(chDataset.numFeatures)},
        target: ${JSON.stringify(chDataset.target)},
        limitations: ${JSON.stringify(chDataset.limitations)},
        potentialBias: ${JSON.stringify(chDataset.potentialBias)},
        downloadInstructions: ${JSON.stringify(chDataset.downloadInstructions)},
        inspectionSnippet: ${JSON.stringify(chDataset.inspectionSnippet)},
        verified: true,
      },`
          : ""
      }
    }`;
    })
    .join(",\n");

  return `import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: ${spec.title.toUpperCase()}
 * Standar: University-Grade / Advanced Engineering Curriculum
 * Single Source of Truth terintegrasi untuk platform Velqora.
 */
export const ${spec.exportVar}: AcademicCurriculum = {
  id: ${JSON.stringify(spec.id)},
  slug: ${JSON.stringify(spec.slug)},
  title: ${JSON.stringify(spec.title)},
  category: ${JSON.stringify(spec.category)},
  level: ${JSON.stringify(spec.level)},
  description: ${JSON.stringify(spec.desc)},
  estimatedHours: ${spec.hours},
  version: ${JSON.stringify(spec.version)},
  primaryReferences: [
${primaryRefs}
  ],
  datasets: [
${topicDatasets}
  ],
  capstoneProject: {
    title: ${JSON.stringify(`Proyek Akhir Komprehensif: Rekayasa Sistem ${spec.title} Terintegrasi`)},
    description: ${JSON.stringify(`Membangun, melatih, mengevaluasi, dan men-deploy arsitektur ${spec.title} end-to-end menggunakan dataset nyata dengan standar produksi industri.`)},
    requirements: [
      "Menggunakan data dunia nyata dengan pembagian train/val/test yang ketat tanpa kebocoran data",
      "Menyertakan analisis formulasi matematis dan fungsi objektif yang digunakan",
      "Mengimplementasikan pengujian otomatis unit testing dan evaluasi metrik objektif",
      "Menghasilkan dokumentasi teknis dan visualisasi performa model yang dapat direproduksi"
    ],
    rubrics: [
      "Ketepatan metodologi ilmiah dan pembuktian matematis: 30%",
      "Kualitas arsitektur kode dan kepatuhan clean code: 25%",
      "Kekokohan evaluasi, validasi silang, dan pencegahan overfitting: 25%",
      "Dokumentasi laporan teknis dan reproduksibilitas eksperimen: 20%"
    ]
  },
  chapters: [
${chaptersCode}
  ]
};
`;
}
