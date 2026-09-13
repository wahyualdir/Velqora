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

  // Speech & Audio AI (3 Bab Fallback)
  if (norm.includes("speech") || norm.includes("audio")) {
    return [
      {
        id: "speech-sec-1",
        title: "Speech Recognition Dasar — Audio ke Teks (MFCC)",
        orderIndex: 1,
        isCompleted: false,
        description:
          "Ekstraksi representasi fitur frekuensi suara Mel-Frequency Cepstral Coefficients (MFCC) dari sinyal audio kontinu untuk pemodelan akustik.",
        codeSnippets: [
          {
            id: "speech-snip-1",
            language: "python",
            caption: "audio_signal.py",
            code: `import numpy as np

sr = 16000
t = np.linspace(0, 1, sr, endpoint=False)
signal = 0.5 * np.sin(2 * np.pi * 440 * t)  # Nada 440 Hz
print(f"Bentuk Sinyal Audio: {signal.shape}, Durasi: {len(signal)/sr} detik")`,
          },
        ],
      },
      {
        id: "speech-sec-2",
        title: "Text-to-Speech (TTS) — Sintesis Suara",
        orderIndex: 2,
        isCompleted: false,
        description:
          "Konversi teks tulisan menjadi gelombang suara manusia melalui pipeline Acoustic Model dan Neural Vocoder.",
        codeSnippets: [
          {
            id: "speech-snip-2",
            language: "python",
            caption: "tts_concept.py",
            code: `def text_to_phonemes(text):
    mapping = {"halo": "H-AH-L-OW", "ai": "EY-AY"}
    return [mapping.get(w.lower(), w) for w in text.split()]

print("Sintesis Fonem:", text_to_phonemes("Halo AI"))`,
          },
        ],
      },
      {
        id: "speech-sec-3",
        title: "Audio Classification — Deteksi Suara & Emosi",
        orderIndex: 3,
        isCompleted: false,
        description:
          "Klasifikasi jenis audio dan ekspresi emosi berdasarkan spectrogram visual yang diproses menggunakan Convolutional Neural Network.",
        codeSnippets: [
          {
            id: "speech-snip-3",
            language: "python",
            caption: "audio_classification.py",
            code: `classes = ["suara_manusia", "musik", "noise_lingkungan"]
dummy_probs = [0.88, 0.08, 0.04]
predicted = classes[dummy_probs.index(max(dummy_probs))]
print(f"Klasifikasi Audio: {predicted} (Confidence: {max(dummy_probs)*100:.1f}%)")`,
          },
        ],
      },
    ];
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
