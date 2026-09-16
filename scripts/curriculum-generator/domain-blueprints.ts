export interface SubchapterBlueprint {
  subNumber: number;
  title: string;
  conceptEn: string;
  mathFormula?: string;
  mathExplanation?: string;
  codeSnippet: {
    filename: string;
    code: string;
    expectedOutput: string;
    explanation: string;
  };
  pitfalls: string[];
  subUnits: string[];
}

export interface ChapterBlueprint {
  chapterNumber: number;
  title: string;
  desc: string;
  coreConcepts: string[];
  datasetKey?: string;
  subchapters: SubchapterBlueprint[];
  caseStudy: string;
  miniProject: string;
}

export interface TopicBlueprint {
  id: string;
  slug: string;
  title: string;
  exportVar: string;
  category: string;
  level: "pemula" | "menengah" | "lanjutan";
  desc: string;
  estimatedHours: number;
  version: string;
  referenceKeys: string[];
  datasetKeys?: string[];
  chapters: ChapterBlueprint[];
}
