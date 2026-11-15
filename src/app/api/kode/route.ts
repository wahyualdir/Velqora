import { NextRequest, NextResponse } from "next/server";
import {
  findCodeEntryById,
  queryCodeCatalogPayload,
  type CodeCatalogLanguage,
  type CodeCatalogLevel,
  type CodeCatalogSourceType,
} from "@/lib/curriculum/code-catalog";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const codeId = searchParams.get("codeId") || "";
  const topicId = searchParams.get("topic") || "all";

  if (codeId) {
    const entry = findCodeEntryById(codeId, topicId !== "all" ? topicId : undefined);
    if (!entry) {
      return NextResponse.json({ error: "Entri kode tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ entry });
  }

  const chapterId = searchParams.get("chapter") || "all";
  const subchapterId = searchParams.get("sub") || "all";
  const language = (searchParams.get("lang") || "all") as CodeCatalogLanguage | "all";
  const level = (searchParams.get("level") || "all") as CodeCatalogLevel | "all";
  const sourceType = (searchParams.get("sourceType") || "all") as CodeCatalogSourceType | "all";
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1") || 1;
  const limit = Number(searchParams.get("limit") || "12") || 12;

  const payload = queryCodeCatalogPayload(
    {
      topicId,
      chapterId,
      subchapterId,
      language,
      level,
      sourceType,
      query,
    },
    page,
    limit
  );

  return NextResponse.json(payload);
}
