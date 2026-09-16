/**
 * SCHEMA DEFINITION: SUBSTANTIVE & ADAPTIVE CURRICULUM ARCHITECTURE
 * Velqora Phase 2.3 — Standar Mutu Akademik & Rekayasa Konten
 *
 * Menggantikan struktur kaku (10 subbab x 10 unit template) dengan struktur
 * adaptif yang disesuaikan dengan kebutuhan pedagogis materi riil.
 */

export interface SubstantiveCodeExample {
  id: string;
  title: string;
  language: "python" | "sql" | "bash";
  filename: string;
  code: string;
  dependencies: string[];
  inputDescription?: string;
  expectedOutput: string;
  isVerifiedOutput: boolean;
  actualRuntimeMs?: number;
  explanation: string;
  troubleshooting?: string[];
  hardwareRequirement?: "cpu" | "gpu-optional" | "gpu-recommended";
}

export interface SubstantiveSourceRef {
  sourceId: string;
  title: string;
  url: string;
  authors: string[];
  year?: number;
  type: "official-documentation" | "paper" | "book" | "standard" | "dataset";
  publisher: string;
  relevanceExplanation: string;
  supportedConcepts: string[];
  isPrimarySource: boolean;
  accessStatus: "open-access" | "official-docs" | "paywalled" | "login-required";
}

export interface SubstantiveLearningUnit {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  purpose: string;
  conceptualExplanation: string;
  intuitionAnalogy?: string;
  technicalDepth: string;
  mathematicalFormulation?: {
    latexFormula: string;
    variableDefinitions: Record<string, string>;
    derivationOrProofNotes?: string;
  };
  workedExample?: {
    problemStatement: string;
    stepByStepSolution: string[];
    finalResult: string;
  };
  codeExample?: SubstantiveCodeExample;
  commonPitfalls?: string[];
  theoreticalLimitations?: string[];
  exercise?: {
    question: string;
    level: "pemahaman" | "implementasi" | "debugging" | "analisis";
    hint?: string;
    solutionOrRubric: string;
  };
  references?: SubstantiveSourceRef[];
}

export interface SubstantiveSubchapter {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  learningObjectives: string[];
  prerequisites: string[];
  keyTerms: Array<{ term: string; definition: string; enTerm?: string }>;
  overview: string;
  units: SubstantiveLearningUnit[];
  subchapterCode?: SubstantiveCodeExample;
  exercise?: {
    task: string;
    datasetNeeded?: string;
    expectedDeliverable: string;
    solutionWalkthrough: string;
  };
  references: SubstantiveSourceRef[];
}

export interface SubstantiveChapter {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  description: string;
  learningObjectives: string[];
  prerequisites: string[];
  coreConcepts: string[];
  subchapters: SubstantiveSubchapter[];
  summary: string;
  transitionToNextChapter?: string;
  chapterProject?: {
    title: string;
    objective: string;
    datasetId?: string;
    milestones: string[];
    evaluationRubric: string[];
  };
  references: SubstantiveSourceRef[];
}

export interface SubstantiveCurriculumSpec {
  id: string;
  slug: string;
  title: string;
  category: string;
  level: "pemula" | "menengah" | "lanjutan";
  description: string;
  version: string;
  estimatedHours: number;
  primaryReferences: SubstantiveSourceRef[];
  chapters: SubstantiveChapter[];
  capstoneProject?: {
    title: string;
    description: string;
    datasetId?: string;
    requirements: string[];
    evaluationCriteria: string[];
  };
}
