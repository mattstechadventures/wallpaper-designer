import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import path from "path";
import type { WallpaperTemplate } from "@/lib/schema/template";
import { TemplateRenderer } from "./template-renderer";
import { loadFontsForTemplate } from "@/lib/fonts/loader";
import React from "react";

export async function renderTemplate(
  template: WallpaperTemplate,
  data: Record<string, unknown> = {},
): Promise<Buffer> {
  const fonts = await loadFontsForTemplate(template.widgets);

  const element = React.createElement(TemplateRenderer, { template, data });

  const svg = await satori(element, {
    width: template.canvas.width,
    height: template.canvas.height,
    fonts: fonts.map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
      style: f.style,
    })),
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
