import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";

export async function GET() {
  const renderedDir = path.join(process.cwd(), "data", "rendered");

  // Find the most recently rendered wallpaper
  if (!existsSync(renderedDir)) {
    return NextResponse.json(
      { error: "No wallpapers rendered yet" },
      { status: 404 },
    );
  }

  const { readdirSync, statSync } = await import("fs");
  const files = readdirSync(renderedDir)
    .filter((f) => f.endsWith(".png"))
    .map((f) => ({
      name: f,
      path: path.join(renderedDir, f),
      mtime: statSync(path.join(renderedDir, f)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "No wallpapers rendered yet" },
      { status: 404 },
    );
  }

  const latest = files[0];
  const imageBuffer = readFileSync(latest.path);

  return new NextResponse(imageBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="${latest.name}"`,
      "Last-Modified": new Date(latest.mtime).toUTCString(),
      "Cache-Control": "no-cache",
    },
  });
}
