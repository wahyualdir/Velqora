"use server";

import { createClient } from "@/lib/supabase/server";
import { getCategories } from "./study-actions";
import {
  classifyViaLocalNLP,
  ClassificationResult,
} from "@/lib/module-classifier-engine";

export type { ClassificationResult };

/**
 * 1. AI & Local NLP Semantic Classifier for Module Content (Zero Latency Sat-Set Engine)
 */
export async function analyzeAndClassifyModuleContent(
  rawContent: string,
  hintTitle: string = ""
): Promise<ClassificationResult> {
  const combinedText = `${hintTitle}\n${rawContent}`.trim();
  if (!combinedText) {
    throw new Error("Konten atau materi modul tidak boleh kosong untuk dianalisis.");
  }

  // Load existing categories from user database
  const existingCategories = await getCategories();

  // Instant Deterministic Local NLP Engine (< 1ms execution time)
  return classifyViaLocalNLP(combinedText, hintTitle, existingCategories);
}

/**
 * 2. Batch Auto-Sort: Reorganizes all uncategorized or mixed modules in database (Parallelized)
 */
export async function batchAutoSortAllModules() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Anda harus masuk untuk menyortir modul.");

  const [categories, { data: modules, error }] = await Promise.all([
    getCategories(),
    supabase
      .from("modules")
      .select("id, title, description, notes, category_id, level")
      .eq("user_id", user.id),
  ]);

  if (error) throw new Error(error.message);
  if (!modules || modules.length === 0) {
    return { updatedCount: 0, details: [] };
  }

  // Fast concurrent classification and parallel updates
  const updatePromises = modules.map(async (mod) => {
    const fullText = `${mod.title}\n${mod.description || ""}\n${mod.notes || ""}`;
    const result = classifyViaLocalNLP(fullText, mod.title, categories);

    // If module has different or empty category, update it
    if (result.categoryId && result.categoryId !== mod.category_id) {
      const oldCat =
        categories.find((c: any) => c.id === mod.category_id)?.name ||
        "Tanpa Kategori";

      await supabase
        .from("modules")
        .update({
          category_id: result.categoryId,
          level: result.suggestedLevel,
        })
        .eq("id", mod.id);

      return {
        id: mod.id,
        title: mod.title,
        oldCategory: oldCat,
        newCategory: result.categoryName,
        score: result.confidenceScore,
      };
    }
    return null;
  });

  const results = await Promise.all(updatePromises);
  const updates = results.filter(Boolean) as Array<{
    id: string;
    title: string;
    oldCategory: string;
    newCategory: string;
    score: number;
  }>;

  return {
    updatedCount: updates.length,
    totalModules: modules.length,
    details: updates,
  };
}
