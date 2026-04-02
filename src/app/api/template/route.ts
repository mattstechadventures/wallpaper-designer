import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { templates } from "@/lib/db/schema";
import { wallpaperTemplateSchema } from "@/lib/schema/validation";
import { createDefaultTemplate } from "@/lib/schema/defaults";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export async function GET() {
  const allTemplates = db.select().from(templates).all();

  // If no templates exist, create the default one
  if (allTemplates.length === 0) {
    const defaultTemplate = createDefaultTemplate();
    db.insert(templates)
      .values({
        id: defaultTemplate.id,
        name: defaultTemplate.name,
        data: JSON.stringify(defaultTemplate),
        isActive: true,
      })
      .run();

    return NextResponse.json([
      { ...defaultTemplate, isActive: true },
    ]);
  }

  return NextResponse.json(
    allTemplates.map((t) => ({
      ...JSON.parse(t.data),
      isActive: t.isActive,
    })),
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = wallpaperTemplateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid template", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const template = parsed.data;
  const id = template.id || uuid();

  // Upsert: update if exists, insert if not
  const existing = db
    .select()
    .from(templates)
    .where(eq(templates.id, id))
    .get();

  if (existing) {
    db.update(templates)
      .set({
        name: template.name,
        data: JSON.stringify({ ...template, id }),
        updatedAt: new Date(),
      })
      .where(eq(templates.id, id))
      .run();
  } else {
    db.insert(templates)
      .values({
        id,
        name: template.name,
        data: JSON.stringify({ ...template, id }),
        isActive: true,
      })
      .run();
  }

  return NextResponse.json({ id, status: "saved" });
}
