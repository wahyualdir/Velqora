import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const apkPath = path.join(process.cwd(), "public", "velqora.apk");

  if (fs.existsSync(apkPath)) {
    const fileBuffer = fs.readFileSync(apkPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="Velqora-v1.1.0.apk"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Fallback direct redirection to GitHub releases
  return NextResponse.redirect(
    "https://github.com/wahyualdir/Velqora/releases",
    302
  );
}
