import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "fs";
import path from "path";
import type { WallpaperTemplate } from "@/lib/schema/template";
import { TemplateRenderer } from "./template-renderer";
import React from "react";

let fontData: ArrayBuffer | null = null;

function loadFont(): ArrayBuffer {
  // Always reload to avoid stale cache during development
  if (fontData && process.env.NODE_ENV === "production") return fontData;

  // Try to load Inter from node_modules or use a system font
  const fontPaths = [
    path.join(process.cwd(), "public", "fonts", "Inter-Regular.ttf"),
    path.join(process.cwd(), "public", "fonts", "Inter-Light.ttf"),
  ];

  for (const fontPath of fontPaths) {
    try {
      const buf = readFileSync(fontPath);
      // Create a proper ArrayBuffer copy (Node Buffer may share underlying memory)
      fontData = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      return fontData;
    } catch {
      // Try next path
    }
  }

  throw new Error(
    "No font file found. Place Inter-Regular.ttf in public/fonts/",
  );
}

export async function renderTemplate(
  template: WallpaperTemplate,
  data: Record<string, unknown> = {},
): Promise<Buffer> {
  const font = loadFont();

  const element = React.createElement(TemplateRenderer, { template, data });

  const svg = await satori(element, {
    width: template.canvas.width,
    height: template.canvas.height,
    fonts: [
      {
        name: "Inter",
        data: font,
        weight: 400,
        style: "normal" as const,
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width" as const,
      value: template.canvas.width * template.canvas.scale,
    },
  });

  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}

export async function renderAndSave(
  template: WallpaperTemplate,
  data: Record<string, unknown> = {},
  outputPath?: string,
): Promise<string> {
  const { writeFileSync, mkdirSync } = await import("fs");

  const png = await renderTemplate(template, data);

  const outPath =
    outputPath ||
    path.join(process.cwd(), "data", "rendered", `wallpaper-${template.id}.png`);

  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, png);

  return outPath;
}
