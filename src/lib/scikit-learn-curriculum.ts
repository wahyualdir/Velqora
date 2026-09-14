import { DocSectionItem } from "@/components/modul/doc-reader-layout";
import { ML_CHAPTERS_1_TO_6 } from "./ml-curriculum/chapters-1-to-6";
import { ML_CHAPTERS_7_TO_11 } from "./ml-curriculum/chapters-7-to-11";
import { ML_CHAPTERS_12_TO_17 } from "./ml-curriculum/chapters-12-to-17";
import { ML_CHAPTERS_18_TO_22 } from "./ml-curriculum/chapters-18-to-22";

/**
 * Kurikulum dan Materi Komprehensif Machine Learning Velqora
 * Terdiri dari 22 BAB kurikulum asli dengan subbab terstruktur hierarkis,
 * diintegrasikan dengan materi mendalam, formulasi matematis (LaTeX),
 * dan kode Python Scikit-Learn 1.9 resmi.
 */
export const SCIKIT_LEARN_USER_GUIDE_SECTIONS: DocSectionItem[] = [
  ...ML_CHAPTERS_1_TO_6,
  ...ML_CHAPTERS_7_TO_11,
  ...ML_CHAPTERS_12_TO_17,
  ...ML_CHAPTERS_18_TO_22,
];

/**
 * Mendapatkan seluruh daftar materi linear (flat) untuk navigasi berurutan.
 */
export function getAllFlatScikitLearnSections(): DocSectionItem[] {
  const flatList: DocSectionItem[] = [];

  for (const chapter of SCIKIT_LEARN_USER_GUIDE_SECTIONS) {
    if (chapter.subsections && chapter.subsections.length > 0) {
      for (const sub of chapter.subsections) {
        flatList.push({
          ...sub,
          parentTitle: chapter.title,
          chapterNumber: chapter.orderIndex,
        });
      }
    } else {
      flatList.push(chapter);
    }
  }

  return flatList;
}
