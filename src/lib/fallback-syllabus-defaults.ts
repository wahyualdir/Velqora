import { ModuleSection } from "@/types/module-drive";
import {
  getAiAgentSections,
  getAiEthicsSections,
  getAiGovernanceSections,
  getAiSecuritySections,
  getAiFundamentalsSections,
} from "./curriculum-batch1-defaults";
import {
  getAutoMlSections,
  getComputationalIntelligenceSections,
  getComputerVisionSections,
  getDataAnalystSections,
  getDataEngineeringAiSections,
} from "./curriculum-batch2-defaults";
import {
  getDataScienceSections,
  getDeepLearningSections,
  getEdgeAiSections,
  getExpertSystemSections,
  getGenerativeAiSections,
} from "./curriculum-batch3-defaults";
import {
  getGraphNeuralNetworkSections,
  getKnowledgeRepresentationSections,
  getLargeLanguageModelSections,
  getMachineLearningSections,
  getMlopsSections,
} from "./curriculum-batch4-defaults";
import {
  getMultimodalAiSections,
  getRecommendationSystemSections,
  getNaturalLanguageProcessingSections,
  getReinforcementLearningSections,
  getRoboticsEmbodiedAiSections,
} from "./curriculum-batch5-defaults";
import {
  getSpeechAudioAiSections,
  getTimeSeriesForecastingSections,
  getVectorDatabaseRetrievalSections,
} from "./curriculum-batch6-defaults";

/**
 * Fallback Preset Silabus Materi AI (Kurikulum Standar untuk Kategori AI berbasis ModuleSection)
 * Digunakan sebagai cadangan darurat jika data catatan vault kategori di database belum tersedia.
 */
export function getDefaultAiSections(categoryName: string): ModuleSection[] {
  const norm = categoryName.toLowerCase().trim();

  if (norm.includes("machine learning") || norm.includes("pembelajaran mesin")) {
    return getMachineLearningSections();
  }

  // Natural Language Processing (14 Bab)
  if (norm.includes("natural language") || norm.includes("nlp") || norm.includes("pemrosesan bahasa")) {
    return getNaturalLanguageProcessingSections();
  }

  // Reinforcement Learning (13 Bab)
  if (norm.includes("reinforcement")) {
    return getReinforcementLearningSections();
  }

  // Recommendation System (12 Bab)
  if (norm.includes("recommendation") || norm.includes("rekomendasi")) {
    return getRecommendationSystemSections();
  }

  // Multimodal AI (10 Bab)
  if (norm.includes("multimodal")) {
    return getMultimodalAiSections();
  }

  // Robotics & Embodied AI (13 Bab)
  if (norm.includes("robotics") || norm.includes("robot") || norm.includes("embodied")) {
    return getRoboticsEmbodiedAiSections();
  }

  // Speech & Audio AI (12 Bab)
  if (norm.includes("speech") || norm.includes("audio") || norm.includes("suara")) {
    return getSpeechAudioAiSections();
  }

  // Time Series Forecasting & Anomaly Detection (12 Bab)
  if (norm.includes("time series") || norm.includes("forecasting") || norm.includes("deret waktu") || norm.includes("anomaly")) {
    return getTimeSeriesForecastingSections();
  }

  // Vector Database & Retrieval System (11 Bab)
  if (norm.includes("vector") || norm.includes("retrieval") || norm.includes("vektor")) {
    return getVectorDatabaseRetrievalSections();
  }

  // AI Agent (14 Bab)
  if (norm.includes("agent")) {
    return getAiAgentSections();
  }

  // AI Ethics & Responsible AI (12 Bab)
  if (norm.includes("ethics") || norm.includes("etika") || norm.includes("responsible")) {
    return getAiEthicsSections();
  }

  // AI Governance & Regulasi (12 Bab)
  if (norm.includes("governance") || norm.includes("regulasi") || norm.includes("tata kelola")) {
    return getAiGovernanceSections();
  }

  // AI Security & Adversarial Machine Learning (12 Bab)
  if (norm.includes("security") || norm.includes("keamanan") || norm.includes("adversarial")) {
    return getAiSecuritySections();
  }

  // AutoML & Neural Architecture Search (10 Bab)
  if (norm.includes("automl") || norm.includes("neural architecture search") || norm.includes("nas")) {
    return getAutoMlSections();
  }

  // Computational Intelligence (10 Bab)
  if (
    norm.includes("computational intelligence") ||
    norm.includes("fuzzy") ||
    norm.includes("genetic") ||
    norm.includes("genetika") ||
    norm.includes("swarm")
  ) {
    return getComputationalIntelligenceSections();
  }

  // Computer Vision (14 Bab)
  if (norm.includes("computer vision") || norm.includes("vision") || norm.includes("citra")) {
    return getComputerVisionSections();
  }

  // Data Analyst (14 Bab)
  if (norm.includes("data analyst") || norm.includes("analyst") || norm.includes("analisis data")) {
    return getDataAnalystSections();
  }

  // Data Engineering & Big Data untuk AI (12 Bab)
  if (norm.includes("data engineering") || norm.includes("big data") || norm.includes("lakehouse")) {
    return getDataEngineeringAiSections();
  }

  // Data Science (16 Bab)
  if (norm.includes("data science") || norm.includes("sains data")) {
    return getDataScienceSections();
  }

  // Deep Learning (15 Bab)
  if (norm.includes("deep learning") || norm.includes("pembelajaran mendalam")) {
    return getDeepLearningSections();
  }

  // Edge AI & TinyML (12 Bab)
  if (norm.includes("edge ai") || norm.includes("tinyml") || norm.includes("edge")) {
    return getEdgeAiSections();
  }

  // Expert System (9 Bab)
  if (norm.includes("expert system") || norm.includes("sistem pakar") || norm.includes("expert")) {
    return getExpertSystemSections();
  }

  // Generative AI (14 Bab)
  if (norm.includes("generative ai") || norm.includes("genai") || norm.includes("generatif")) {
    return getGenerativeAiSections();
  }

  // Graph Neural Network (GNN) (11 Bab)
  if (norm.includes("graph neural network") || norm.includes("gnn")) {
    return getGraphNeuralNetworkSections();
  }

  // Knowledge Representation (10 Bab)
  if (
    norm.includes("knowledge representation") ||
    norm.includes("representasi pengetahuan") ||
    norm.includes("knowledge rep")
  ) {
    return getKnowledgeRepresentationSections();
  }

  // Large Language Model (15 Bab)
  if (norm.includes("large language model") || norm.includes("llm")) {
    return getLargeLanguageModelSections();
  }

  // MLOps & AI Deployment (14 Bab)
  if (
    norm.includes("mlops") ||
    norm.includes("ai deployment") ||
    norm.includes("deployment")
  ) {
    return getMlopsSections();
  }

  // Default AI Fundamentals Fallback (12 Bab)
  return getAiFundamentalsSections();
}
