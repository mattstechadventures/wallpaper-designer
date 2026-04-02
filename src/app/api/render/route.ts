import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { templates, renderedWallpapers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { renderAndSave } from "@/lib/render/engine";
import { v4 as uuid } from "uuid";
import type { WallpaperTemplate } from "@/lib/schema/template";

export async function POST() {
  // Find the active template
  const active = db
    .select()
    .from(templates)
    .where(eq(templates.isActive, true))
    .get();

  if (!active) {
    return NextResponse.json(
      { error: "No active template" },
      { status: 404 },
    );
  }

  const template: WallpaperTemplate = JSON.parse(active.data);

  try {
    // TODO: Fetch data from data sources here
    const data: Record<string, unknown> = {};

    const outputPath = await renderAndSave(template, data);

    // Record the render
    db.insert(renderedWallpapers)
      .values({
        id: uuid(),
        templateId: active.id,
        filePath: outputPath,
      })
      .run();

    return NextResponse.json({
      status: "rendered",
      path: outputPath,
      templateId: active.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Render failed", details: message },
      { status: 500 },
    );
  }
}
