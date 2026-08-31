"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";
import type { CategoryFormData } from "@/lib/validations";

export async function sanitizeAndMigrateCategories() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id);

  if (!categories || categories.length === 0) return;

  const officialPrimaryNames = new Set(SYSTEM_PRIMARY_CATEGORIES.map((p) => p.name.toLowerCase()));
  const primaryIdMap = new Map<string, string>();

  // 1. Ensure all 17 primary categories exist
  for (const primary of SYSTEM_PRIMARY_CATEGORIES) {
    let parentCat = categories.find(
      (c) => c.name.toLowerCase() === primary.name.toLowerCase() && !c.parent_id
    );

    if (!parentCat) {
      const { data: createdParent } = await supabase
        .from("categories")
        .insert({
          user_id: user.id,
          name: primary.name,
          color: primary.color || "#3b82f6",
          icon: primary.icon || "code",
        })
        .select()
        .single();
      parentCat = createdParent;
    }

    if (parentCat?.id) {
      primaryIdMap.set(primary.name.toLowerCase(), parentCat.id);
    }
  }

  // 2. Fetch current categories state
  const { data: currentCats } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id);

  if (!currentCats) return;

  // 3. Intelligently inspect EVERY category and re-parent misclassified topics
  for (const cat of currentCats) {
    const catNameLower = cat.name.toLowerCase();

    // Skip root 17 primary categories
    if (officialPrimaryNames.has(catNameLower) && !cat.parent_id) {
      continue;
    }

    let targetParentName: string | null = null;

    // Check exact domain rules
    if (
      catNameLower.includes("machine learning") ||
      catNameLower.includes("deep learning") ||
      catNameLower.includes("expert system") ||
      catNameLower.includes("knowledge representation") ||
      catNameLower.includes("reinforcement learning") ||
      catNameLower.includes("robotics") ||
      catNameLower.includes("ai fundamentals") ||
      catNameLower.includes("ai planning") ||
      catNameLower.includes("explainable ai") ||
      catNameLower.includes("responsible ai")
    ) {
      targetParentName = "kecerdasan buatan";
    } else if (
      catNameLower.includes("computer vision") ||
      catNameLower.includes("image processing") ||
      catNameLower.includes("object detection") ||
      catNameLower.includes("ocr") ||
      catNameLower.includes("yolo")
    ) {
      targetParentName = "computer vision";
    } else if (
      catNameLower.includes("natural language") ||
      catNameLower.includes("nlp") ||
      catNameLower.includes("speech recognition") ||
      catNameLower.includes("tokenization") ||
      catNameLower.includes("word embedding")
    ) {
      targetParentName = "natural language processing";
    } else if (
      catNameLower.includes("generative ai") ||
      catNameLower.includes("large language model") ||
      catNameLower.includes("prompt engineering") ||
      catNameLower.includes("rag") ||
      catNameLower.includes("multimodal ai")
    ) {
      targetParentName = "generative ai";
    } else if (
      catNameLower.includes("data science") ||
      catNameLower.includes("exploratory data") ||
      catNameLower.includes("data wrangling")
    ) {
      targetParentName = "data science";
    } else if (
      catNameLower.includes("data analytics") ||
      catNameLower.includes("business intelligence") ||
      catNameLower.includes("kpi analysis")
    ) {
      targetParentName = "data analytics";
    } else if (
      catNameLower.includes("mysql") ||
      catNameLower.includes("postgresql") ||
      catNameLower.includes("sqlite") ||
      catNameLower.includes("nosql") ||
      catNameLower.includes("mongodb") ||
      catNameLower.includes("redis") ||
      catNameLower.includes("database design")
    ) {
      targetParentName = "database";
    } else if (
      catNameLower.includes("frontend") ||
      catNameLower.includes("backend") ||
      catNameLower.includes("react") ||
      catNameLower.includes("next.js") ||
      catNameLower.includes("vue") ||
      catNameLower.includes("angular") ||
      catNameLower.includes("express") ||
      catNameLower.includes("django") ||
      catNameLower.includes("laravel") ||
      catNameLower.includes("web security")
    ) {
      targetParentName = "web development";
    } else if (
      catNameLower.includes("android") ||
      catNameLower.includes("ios") ||
      catNameLower.includes("flutter") ||
      catNameLower.includes("react native")
    ) {
      targetParentName = "mobile development";
    } else if (
      catNameLower.includes("docker") ||
      catNameLower.includes("kubernetes") ||
      catNameLower.includes("ci/cd") ||
      catNameLower.includes("aws") ||
      catNameLower.includes("nginx")
    ) {
      targetParentName = "devops & cloud";
    } else if (
      catNameLower === "python" ||
      catNameLower === "javascript" ||
      catNameLower === "typescript" ||
      catNameLower === "c" ||
      catNameLower === "c++" ||
      catNameLower === "c#" ||
      catNameLower === "java" ||
      catNameLower === "kotlin" ||
      catNameLower === "swift" ||
      catNameLower === "go" ||
      catNameLower === "rust" ||
      catNameLower === "php" ||
      catNameLower === "ruby" ||
      catNameLower === "dart" ||
      catNameLower === "r" ||
      catNameLower === "matlab" ||
      catNameLower === "scala" ||
      catNameLower === "lua" ||
      catNameLower === "perl" ||
      catNameLower === "sql"
    ) {
      targetParentName = "bahasa pemrograman";
    } else {
      // Best match against primary subcategories
      let bestMatch: string | null = null;
      let maxScore = 0;
      for (const primary of SYSTEM_PRIMARY_CATEGORIES) {
        for (const sub of primary.subcategories) {
          if (catNameLower === sub.name.toLowerCase()) {
            bestMatch = primary.name.toLowerCase();
            maxScore = 100;
            break;
          }
        }
        if (maxScore === 100) break;
      }
      targetParentName = bestMatch || "software engineering";
    }

    if (targetParentName) {
      const correctParentId = primaryIdMap.get(targetParentName);
      if (correctParentId && cat.id !== correctParentId && cat.parent_id !== correctParentId) {
        await supabase
          .from("categories")
          .update({ parent_id: correctParentId })
          .eq("id", cat.id);
      }
    }
  }

  // 4. Deduplicate categories
  const { data: refreshed } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id);

  if (refreshed) {
    const seen = new Map<string, string>();
    for (const cat of refreshed) {
      const key = `${cat.name.toLowerCase()}_${cat.parent_id || "root"}`;
      if (seen.has(key)) {
        const primaryId = seen.get(key)!;
        await supabase.from("modules").update({ category_id: primaryId }).eq("category_id", cat.id);
        await supabase.from("categories").delete().eq("id", cat.id);
      } else {
        seen.set(key, cat.id);
      }
    }
  }
}

export async function getCategories() {
  const supabase = await createClient();

  // 1. Fetch existing categories from Supabase
  let dbCategories: any[] = [];
  const { data, error } = await supabase
    .from("categories")
    .select("*, parent:categories!parent_id(*)")
    .order("name");

  if (!error && data) {
    dbCategories = data;
  } else {
    const { data: fallbackData } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    dbCategories = fallbackData || [];
  }

  // 2. Build map and array of categories
  const allCategories: any[] = [...dbCategories];
  const dbParentMap = new Map<string, any>();
  const dbSubMap = new Map<string, any>();

  for (const cat of dbCategories) {
    if (!cat.parent_id) {
      dbParentMap.set(cat.name.toLowerCase().trim(), cat);
    } else {
      dbSubMap.set(`${cat.name.toLowerCase().trim()}__${cat.parent_id}`, cat);
    }
  }

  // 3. Merge preset subcategories from SYSTEM_PRIMARY_CATEGORIES
  for (const primary of SYSTEM_PRIMARY_CATEGORIES) {
    let parentObj = dbParentMap.get(primary.name.toLowerCase().trim());
    if (!parentObj) {
      parentObj = {
        id: primary.name,
        name: primary.name,
        color: primary.color,
        icon: primary.icon,
        parent_id: null,
        parent: null,
        is_system: true,
      };
      allCategories.push(parentObj);
    }

    if (primary.subcategories) {
      for (const sub of primary.subcategories) {
        const subKey = `${sub.name.toLowerCase().trim()}__${parentObj.id}`;
        const subExists =
          dbSubMap.has(subKey) ||
          allCategories.some(
            (c) =>
              c.parent_id === parentObj.id &&
              c.name.toLowerCase().trim() === sub.name.toLowerCase().trim()
          );

        if (!subExists) {
          allCategories.push({
            id: sub.name,
            name: sub.name,
            color: sub.color || primary.color,
            icon: sub.icon || primary.icon,
            parent_id: parentObj.id,
            parent: parentObj,
            is_system: true,
          });
        }
      }
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  return allCategories.filter((c: any) => {
    const key = `${c.name.toLowerCase().trim()}__${c.parent_id || "root"}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function createCategory(data: CategoryFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const insertPayload: any = {
    user_id: user.id,
    name: data.name,
    color: data.color || "#3b82f6",
    parent_id: data.parent_id || null,
    icon: data.icon || "code",
  };

  let { data: created, error } = await supabase
    .from("categories")
    .insert(insertPayload)
    .select()
    .single();

  if (error && (error.message.includes("column") || error.message.includes("schema cache"))) {
    // Fallback insertion without parent_id and icon if migration hasn't been run yet
    delete insertPayload.parent_id;
    delete insertPayload.icon;
    const fallbackRes = await supabase
      .from("categories")
      .insert(insertPayload)
      .select()
      .single();
    created = fallbackRes.data;
    error = fallbackRes.error;
  }

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/kategori");
  revalidatePath("/dashboard/modul");
  return created;
}

export async function getCategoryDetails(idOrSlug: string) {
  const decoded = decodeURIComponent(idOrSlug).trim();

  // 1. Try finding in full cached category list
  const allCats = await getCategories();
  const matched = allCats.find(
    (c: any) =>
      c.id === decoded ||
      c.name.toLowerCase() === decoded.toLowerCase() ||
      c.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === decoded.toLowerCase()
  );

  if (matched) {
    if (!matched.parent && matched.parent_id) {
      matched.parent = allCats.find((p: any) => p.id === matched.parent_id) || null;
    }
    return matched;
  }

  // 2. Direct database query fallback
  const supabase = await createClient();
  const { data: catById } = await supabase
    .from("categories")
    .select("*")
    .eq("id", decoded)
    .maybeSingle();

  if (catById) {
    if (catById.parent_id) {
      const { data: parentCat } = await supabase
        .from("categories")
        .select("*")
        .eq("id", catById.parent_id)
        .maybeSingle();
      catById.parent = parentCat || null;
    }
    return catById;
  }

  const { data: catByName } = await supabase
    .from("categories")
    .select("*")
    .ilike("name", decoded)
    .maybeSingle();

  if (catByName) {
    if (catByName.parent_id) {
      const { data: parentCat } = await supabase
        .from("categories")
        .select("*")
        .eq("id", catByName.parent_id)
        .maybeSingle();
      catByName.parent = parentCat || null;
    }
    return catByName;
  }

  // 3. Search in SYSTEM_PRIMARY_CATEGORIES
  for (const primary of SYSTEM_PRIMARY_CATEGORIES) {
    if (
      primary.name.toLowerCase() === decoded.toLowerCase() ||
      primary.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === decoded.toLowerCase()
    ) {
      return {
        id: primary.name,
        name: primary.name,
        color: primary.color,
        icon: primary.icon,
        parent_id: null,
        parent: null,
      };
    }
    for (const sub of primary.subcategories) {
      if (
        sub.name.toLowerCase() === decoded.toLowerCase() ||
        sub.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === decoded.toLowerCase() ||
        (sub as any).id === decoded
      ) {
        return {
          id: sub.name,
          name: sub.name,
          color: sub.color || primary.color,
          icon: sub.icon || primary.icon,
          parent_id: primary.name,
          parent: {
            id: primary.name,
            name: primary.name,
            color: primary.color,
            icon: primary.icon,
          },
        };
      }
    }
  }

  return null;
}

export async function updateCategory(id: string, data: Partial<CategoryFormData>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.parent_id !== undefined) updateData.parent_id = data.parent_id || null;
  if (data.icon !== undefined) updateData.icon = data.icon;

  const { error } = await supabase
    .from("categories")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/kategori");
  revalidatePath("/dashboard/modul");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Silakan masuk ke akun Anda terlebih dahulu.");

  // Check if any modules reference this category
  const { count: moduleCount } = await supabase
    .from("modules")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (moduleCount && moduleCount > 0) {
    throw new Error(`Kategori ini masih memiliki ${moduleCount} modul terkait. Pindahkan atau hapus modul terlebih dahulu.`);
  }

  // Check if any child categories reference this category as parent
  const { count: childCount } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", id);

  if (childCount && childCount > 0) {
    throw new Error(`Kategori ini masih memiliki ${childCount} subkategori terkait. Hapus subkategori terlebih dahulu.`);
  }

  const { error } = await supabase.from("categories").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/kategori");
  revalidatePath("/dashboard/modul");
}
