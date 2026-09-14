import { DocSectionItem } from "@/components/modul/doc-reader-layout";
import { SUPERVISED_LEARNING_CHAPTER } from "./scikit-learn/supervised";
import { UNSUPERVISED_LEARNING_CHAPTER } from "./scikit-learn/unsupervised";
import { MODEL_SELECTION_CHAPTER } from "./scikit-learn/model-selection";
import {
  DATA_TRANSFORMS_CHAPTER,
  INSPECTION_CHAPTER,
  DATASETS_CHAPTER,
  COMPUTING_CHAPTER,
} from "./scikit-learn/transforms-and-utilities";

/**
 * Kurikulum dan Materi Komprehensif Resmi Scikit-Learn 1.9 User Guide
 * Berisi seluruh Bab Utama dan Subbab (Hierarkis) lengkap dengan formulasi matematis,
 * penjelasan konseptual mendalam, dan implementasi kode Python Scikit-Learn.
 */
export const SCIKIT_LEARN_USER_GUIDE_SECTIONS: DocSectionItem[] = [
  SUPERVISED_LEARNING_CHAPTER,
  UNSUPERVISED_LEARNING_CHAPTER,
  MODEL_SELECTION_CHAPTER,
  DATA_TRANSFORMS_CHAPTER,
  INSPECTION_CHAPTER,
  DATASETS_CHAPTER,
  COMPUTING_CHAPTER,
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
