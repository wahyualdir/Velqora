import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  clearAllUserMemories,
  deleteUserMemoryItem,
  getUserMemoryProfile,
  saveUserMemoryItem,
  toggleUserMemoryEnabled,
} from "@/lib/ai/memory-manager";
import { checkRateLimit, logger } from "@/lib/observability";

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limit: 60 requests per minute
    const limit = checkRateLimit(`api_mem_get_${user.id}`, 60, 60000);
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: "Terlalu banyak permintaan. Silakan coba beberapa saat lagi." }, { status: 429 });
    }

    const profile = await getUserMemoryProfile(user.id);
    return NextResponse.json({ success: true, data: profile });
  } catch (err: any) {
    logger.error("API_MEMORY_GET", "Gagal memuat memori AI", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limit: 30 mutations per minute
    const limit = checkRateLimit(`api_mem_post_${user.id}`, 30, 60000);
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: "Terlalu banyak permintaan. Silakan coba beberapa saat lagi." }, { status: 429 });
    }

    const body = await req.json();
    const { category, key, value, isEnabled } = body;

    if (typeof isEnabled === "boolean") {
      await toggleUserMemoryEnabled(user.id, isEnabled);
      return NextResponse.json({ success: true, message: `Memory ${isEnabled ? "enabled" : "disabled"}` });
    }

    if (!category || !key || !value) {
      return NextResponse.json({ success: false, error: "Missing required fields: category, key, value" }, { status: 400 });
    }

    const item = await saveUserMemoryItem(user.id, category, key, value, 1.0, "api_direct");
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    logger.error("API_MEMORY_POST", "Gagal menyimpan item memori AI", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limit: 30 deletes per minute
    const limit = checkRateLimit(`api_mem_del_${user.id}`, 30, 60000);
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: "Terlalu banyak permintaan. Silakan coba beberapa saat lagi." }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const memoryId = searchParams.get("id");
    const clearAll = searchParams.get("clear_all") === "true";

    if (clearAll) {
      await clearAllUserMemories(user.id);
      return NextResponse.json({ success: true, message: "All memories cleared" });
    }

    if (!memoryId) {
      return NextResponse.json({ success: false, error: "Missing memory ID" }, { status: 400 });
    }

    const deleted = await deleteUserMemoryItem(user.id, memoryId);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    logger.error("API_MEMORY_DELETE", "Gagal menghapus item memori AI", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
