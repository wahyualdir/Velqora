import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  clearAllUserMemories,
  deleteUserMemoryItem,
  getUserMemoryProfile,
  saveUserMemoryItem,
  toggleUserMemoryEnabled,
} from "@/lib/ai/memory-manager";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "guest_user";
    const profile = await getUserMemoryProfile(userId);

    return NextResponse.json({ success: true, data: profile });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "guest_user";
    const body = await req.json();

    const { category, key, value, isEnabled } = body;

    if (typeof isEnabled === "boolean") {
      await toggleUserMemoryEnabled(userId, isEnabled);
      return NextResponse.json({ success: true, message: `Memory ${isEnabled ? "enabled" : "disabled"}` });
    }

    if (!category || !key || !value) {
      return NextResponse.json({ success: false, error: "Missing required fields: category, key, value" }, { status: 400 });
    }

    const item = await saveUserMemoryItem(userId, category, key, value, 1.0, "api_direct");
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "guest_user";
    const { searchParams } = new URL(req.url);
    const memoryId = searchParams.get("id");
    const clearAll = searchParams.get("clear_all") === "true";

    if (clearAll) {
      await clearAllUserMemories(userId);
      return NextResponse.json({ success: true, message: "All memories cleared" });
    }

    if (!memoryId) {
      return NextResponse.json({ success: false, error: "Missing memory ID" }, { status: 400 });
    }

    const deleted = await deleteUserMemoryItem(userId, memoryId);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Internal server error" }, { status: 500 });
  }
}
