import { AcademicCurriculum } from "./types";
import { aiAgentCurriculum } from "./topics/01-ai-agent";
import { aiEthicsCurriculum } from "./topics/02-ai-ethics";
import { aiGovernanceCurriculum } from "./topics/03-ai-governance";
import { aiSecurityCurriculum } from "./topics/04-ai-security";
import { aiFundamentalsCurriculum } from "./topics/05-ai-fundamentals";
import { autoMlNasCurriculum } from "./topics/06-automl-nas";
import { computationalIntelligenceCurriculum } from "./topics/07-computational-intelligence";
import { computerVisionCurriculum } from "./topics/08-computer-vision";
import { dataAnalystCurriculum } from "./topics/09-data-analyst";
import { dataEngineeringAiCurriculum } from "./topics/10-data-engineering-ai";
import { dataScienceCurriculum } from "./topics/11-data-science";
import { deepLearningCurriculum } from "./topics/12-deep-learning";
import { edgeAiTinymlCurriculum } from "./topics/13-edge-ai-tinyml";
import { expertSystemCurriculum } from "./topics/14-expert-system";
import { generativeAiCurriculum } from "./topics/15-generative-ai";
import { graphNeuralNetworkCurriculum } from "./topics/16-graph-neural-network";
import { knowledgeRepresentationCurriculum } from "./topics/17-knowledge-representation";
import { largeLanguageModelCurriculum } from "./topics/18-large-language-model";
import { machineLearningCurriculum } from "./topics/19-machine-learning";
import { mlopsDeploymentCurriculum } from "./topics/20-mlops-deployment";
import { multimodalAiCurriculum } from "./topics/21-multimodal-ai";
import { naturalLanguageProcessingCurriculum } from "./topics/22-natural-language-processing";
import { recommendationSystemCurriculum } from "./topics/23-recommendation-system";
import { reinforcementLearningCurriculum } from "./topics/24-reinforcement-learning";
import { roboticsEmbodiedAiCurriculum } from "./topics/25-robotics-embodied-ai";
import { speechAudioAiCurriculum } from "./topics/26-speech-audio-ai";
import { timeSeriesForecastingCurriculum } from "./topics/27-time-series-forecasting";
import { vectorDatabaseRetrievalCurriculum } from "./topics/28-vector-database-retrieval";
import {
  substantiveMachineLearningChapter1,
  substantiveMachineLearningChapter6,
} from "./pilot-content";

// AI Fundamentals kini telah diremediasi penuh menjadi kurikulum substantif mandiri
export const enrichedAiFundamentalsCurriculum: AcademicCurriculum = aiFundamentalsCurriculum;

export const enrichedMachineLearningCurriculum: AcademicCurriculum = {
  ...machineLearningCurriculum,
  chapters: [
    substantiveMachineLearningChapter1,
    ...machineLearningCurriculum.chapters.slice(1, 5),
    substantiveMachineLearningChapter6,
    ...machineLearningCurriculum.chapters.slice(6),
  ],
};

/**
 * Registri Terpusat Seluruh 28 Kurikulum Akademik Kecerdasan Buatan Velqora.
 * Menyediakan Single Source of Truth (SSOT) untuk navigasi modul, breadcrumbs,
 * dan rendering materi hierarkis tanpa redundansi generator sintetis.
 */
export const ALL_ACADEMIC_CURRICULA: readonly AcademicCurriculum[] = [
  aiAgentCurriculum,
  aiEthicsCurriculum,
  aiGovernanceCurriculum,
  aiSecurityCurriculum,
  enrichedAiFundamentalsCurriculum,
  autoMlNasCurriculum,
  computationalIntelligenceCurriculum,
  computerVisionCurriculum,
  dataAnalystCurriculum,
  dataEngineeringAiCurriculum,
  dataScienceCurriculum,
  deepLearningCurriculum,
  edgeAiTinymlCurriculum,
  expertSystemCurriculum,
  generativeAiCurriculum,
  graphNeuralNetworkCurriculum,
  knowledgeRepresentationCurriculum,
  largeLanguageModelCurriculum,
  enrichedMachineLearningCurriculum,
  mlopsDeploymentCurriculum,
  multimodalAiCurriculum,
  naturalLanguageProcessingCurriculum,
  recommendationSystemCurriculum,
  reinforcementLearningCurriculum,
  roboticsEmbodiedAiCurriculum,
  speechAudioAiCurriculum,
  timeSeriesForecastingCurriculum,
  vectorDatabaseRetrievalCurriculum,
];

/**
 * Peta pencarian cepat berdasarkan ID, Slug, dan Nama Topik yang dinormalisasi.
 */
const curriculumLookupMap = new Map<string, AcademicCurriculum>();

function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// Inisialisasi peta pencarian
for (const curr of ALL_ACADEMIC_CURRICULA) {
  curriculumLookupMap.set(curr.id.toLowerCase(), curr);
  curriculumLookupMap.set(curr.slug.toLowerCase(), curr);
  curriculumLookupMap.set(normalizeKey(curr.id), curr);
  curriculumLookupMap.set(normalizeKey(curr.slug), curr);
  curriculumLookupMap.set(normalizeKey(curr.title), curr);
}

// Tambahkan alias resmi bahasa Indonesia dan variasi penamaan dari SYSTEM_PRIMARY_CATEGORIES
const topicAliases: Record<string, AcademicCurriculum> = {
  // 1. AI Agent
  "ai agent": aiAgentCurriculum,
  "agen cerdas": aiAgentCurriculum,
  "autonomous agent": aiAgentCurriculum,
  
  // 2. AI Ethics & Responsible AI
  "ai ethics & responsible ai": aiEthicsCurriculum,
  "ai ethics": aiEthicsCurriculum,
  "etika ai": aiEthicsCurriculum,
  "responsible ai": aiEthicsCurriculum,
  
  // 3. AI Governance & Regulasi
  "ai governance & regulasi": aiGovernanceCurriculum,
  "ai governance": aiGovernanceCurriculum,
  "tata kelola ai": aiGovernanceCurriculum,
  "regulasi ai": aiGovernanceCurriculum,
  
  // 4. AI Security & Adversarial Machine Learning
  "ai security & adversarial machine learning": aiSecurityCurriculum,
  "ai security": aiSecurityCurriculum,
  "adversarial machine learning": aiSecurityCurriculum,
  "keamanan ai": aiSecurityCurriculum,
  
  // 5. Artificial Intelligence Fundamentals
  "artificial intelligence fundamentals": enrichedAiFundamentalsCurriculum,
  "ai fundamentals": enrichedAiFundamentalsCurriculum,
  "dasar kecerdasan buatan": enrichedAiFundamentalsCurriculum,
  "fondasi kecerdasan buatan": enrichedAiFundamentalsCurriculum,
  
  // 6. AutoML & Neural Architecture Search
  "automl & neural architecture search": autoMlNasCurriculum,
  "automl": autoMlNasCurriculum,
  "nas": autoMlNasCurriculum,
  
  // 7. Computational Intelligence
  "computational intelligence (fuzzy logic, genetic algorithm, swarm intelligence)": computationalIntelligenceCurriculum,
  "computational intelligence": computationalIntelligenceCurriculum,
  "kecerdasan komputasional": computationalIntelligenceCurriculum,
  "fuzzy logic": computationalIntelligenceCurriculum,
  
  // 8. Computer Vision
  "computer vision": computerVisionCurriculum,
  "penglihatan komputer": computerVisionCurriculum,
  "visi komputer": computerVisionCurriculum,
  
  // 9. Data Analyst
  "data analyst": dataAnalystCurriculum,
  "analisis data": dataAnalystCurriculum,
  "analis data": dataAnalystCurriculum,
  
  // 10. Data Engineering & Big Data untuk AI
  "data engineering & big data untuk ai": dataEngineeringAiCurriculum,
  "data engineering": dataEngineeringAiCurriculum,
  "rekayasa data": dataEngineeringAiCurriculum,
  "big data": dataEngineeringAiCurriculum,
  
  // 11. Data Science
  "data science": dataScienceCurriculum,
  "sains data": dataScienceCurriculum,
  "ilmu data": dataScienceCurriculum,
  
  // 12. Deep Learning
  "deep learning": deepLearningCurriculum,
  "pembelajaran mendalam": deepLearningCurriculum,
  
  // 13. Edge AI & TinyML
  "edge ai & tinyml": edgeAiTinymlCurriculum,
  "edge ai": edgeAiTinymlCurriculum,
  "tinyml": edgeAiTinymlCurriculum,
  
  // 14. Expert System
  "expert system": expertSystemCurriculum,
  "sistem pakar": expertSystemCurriculum,
  
  // 15. Generative AI
  "generative ai": generativeAiCurriculum,
  "genai": generativeAiCurriculum,
  "ai generatif": generativeAiCurriculum,
  
  // 16. Graph Neural Network (GNN)
  "graph neural network (gnn)": graphNeuralNetworkCurriculum,
  "graph neural network": graphNeuralNetworkCurriculum,
  "gnn": graphNeuralNetworkCurriculum,
  
  // 17. Knowledge Representation
  "knowledge representation": knowledgeRepresentationCurriculum,
  "representasi pengetahuan": knowledgeRepresentationCurriculum,
  
  // 18. Large Language Model
  "large language model": largeLanguageModelCurriculum,
  "llm": largeLanguageModelCurriculum,
  "model bahasa besar": largeLanguageModelCurriculum,
  
  // 19. Machine Learning
  "machine learning": enrichedMachineLearningCurriculum,
  "pembelajaran mesin": enrichedMachineLearningCurriculum,
  "scikit learn": enrichedMachineLearningCurriculum,
  
  // 20. MLOps & AI Deployment
  "mlops & ai deployment": mlopsDeploymentCurriculum,
  "mlops": mlopsDeploymentCurriculum,
  "ai deployment": mlopsDeploymentCurriculum,
  
  // 21. Multimodal AI
  "multimodal ai": multimodalAiCurriculum,
  "ai multimodal": multimodalAiCurriculum,
  
  // 22. Natural Language Processing
  "natural language processing": naturalLanguageProcessingCurriculum,
  "nlp": naturalLanguageProcessingCurriculum,
  "pemrosesan bahasa alami": naturalLanguageProcessingCurriculum,
  
  // 23. Recommendation System
  "recommendation system": recommendationSystemCurriculum,
  "sistem rekomendasi": recommendationSystemCurriculum,
  
  // 24. Reinforcement Learning
  "reinforcement learning": reinforcementLearningCurriculum,
  "pembelajaran penguatan": reinforcementLearningCurriculum,
  
  // 25. Robotics & Embodied AI
  "robotics & embodied ai": roboticsEmbodiedAiCurriculum,
  "robotics": roboticsEmbodiedAiCurriculum,
  "robotika": roboticsEmbodiedAiCurriculum,
  
  // 26. Speech & Audio AI
  "speech & audio ai": speechAudioAiCurriculum,
  "speech audio ai": speechAudioAiCurriculum,
  "wicara & audio": speechAudioAiCurriculum,
  
  // 27. Time Series Forecasting & Anomaly Detection
  "time series forecasting & anomaly detection": timeSeriesForecastingCurriculum,
  "time series forecasting": timeSeriesForecastingCurriculum,
  "time series": timeSeriesForecastingCurriculum,
  "deret waktu": timeSeriesForecastingCurriculum,
  
  // 28. Vector Database & Retrieval System
  "vector database & retrieval system": vectorDatabaseRetrievalCurriculum,
  "vector database": vectorDatabaseRetrievalCurriculum,
  "basis data vektor": vectorDatabaseRetrievalCurriculum,
};

for (const [alias, curr] of Object.entries(topicAliases)) {
  curriculumLookupMap.set(alias.toLowerCase(), curr);
  curriculumLookupMap.set(normalizeKey(alias), curr);
}

/**
 * Mengambil kurikulum akademik berdasarkan ID, slug, atau nama kategori.
 * Dilengkapi pencocokan ketat untuk mencegah tabrakan nama (cross-domain collision)
 * antara "AI Security & Adversarial Machine Learning" dengan "Machine Learning".
 */
export function getAcademicCurriculum(query: string): AcademicCurriculum | undefined {
  if (!query) return undefined;
  
  const trimmed = query.trim().toLowerCase();
  
  // 1. Cek langsung via map
  if (curriculumLookupMap.has(trimmed)) {
    return curriculumLookupMap.get(trimmed);
  }
  
  const normalized = normalizeKey(query);
  if (curriculumLookupMap.has(normalized)) {
    return curriculumLookupMap.get(normalized);
  }
  
  // 2. Aturan pencegahan tabrakan spesifik AI Security vs Machine Learning
  if (
    normalized.includes("security") ||
    normalized.includes("adversarial") ||
    normalized.includes("keamanan")
  ) {
    return aiSecurityCurriculum;
  }
  
  // 3. Pencarian substring deterministik jika belum cocok
  for (const curr of ALL_ACADEMIC_CURRICULA) {
    const currNorm = normalizeKey(curr.title);
    if (currNorm.length > 5 && (normalized.includes(currNorm) || currNorm.includes(normalized))) {
      return curr;
    }
  }
  
  return undefined;
}

/**
 * Ringkasan statistik 28 topik kurikulum untuk katalog dan pengujian.
 */
export function getAllCurriculumOverview() {
  return ALL_ACADEMIC_CURRICULA.map((c) => {
    let subchaptersCount = 0;
    for (const ch of c.chapters) {
      subchaptersCount += ch.subchapters.length;
    }
    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      category: c.category,
      level: c.level,
      estimatedHours: c.estimatedHours,
      chaptersCount: c.chapters.length,
      subchaptersCount,
    };
  });
}
