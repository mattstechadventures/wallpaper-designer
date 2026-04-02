// Server-side font loader: downloads and caches Google Fonts TTF files for Satori.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { getFont, type FontEntry } from "./registry";

const CACHE_DIR = path.join(process.cwd(), "data", "font-cache");

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, "_");
}

function getCachePath(font: FontEntry): string {
  return path.join(CACHE_DIR, `${sanitizeFileName(font.name)}-${font.weight}.ttf`);
}

async function downloadFont(font: FontEntry): Promise<ArrayBuffer> {
  const cachePath = getCachePath(font);

  // Return from cache if available
  if (existsSync(cachePath)) {
    const buf = readFileSync(cachePath);
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }

  // Fetch the CSS to extract the actual TTF/woff2 URL
  const cssUrl = `https://fonts.googleapis.com/css2?family=${font.googleFamily}:wght@${font.weight}&display=swap`;
  const cssRes = await fetch(cssUrl, {
    headers: {
      // Request TTF format by pretending to be an older browser
      "User-Agent":
        "Mozilla/5.0 (Windows NT 6.1; rv:60.0) Gecko/20100101 Firefox/60.0",
    },
  });
  const css = await cssRes.text();

  // Extract the font URL from the CSS
  const urlMatch = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/);
  if (!urlMatch) {
    throw new Error(`Could not extract font URL for ${font.name} from Google Fonts CSS`);
  }

  const fontRes = await fetch(urlMatch[1]);
  const fontBuffer = await fontRes.arrayBuffer();

  // Cache to disk
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cachePath, Buffer.from(fontBuffer));

  return fontBuffer;
}

/** Load the Inter font from the local file system (bundled with the project) */
function loadLocalInter(): ArrayBuffer {
  const fontPaths = [
    path.join(process.cwd(), "public", "fonts", "Inter-Regular.ttf"),
    path.join(process.cwd(), "public", "fonts", "Inter-Light.ttf"),
  ];

  for (const fontPath of fontPaths) {
    try {
      const buf = readFileSync(fontPath);
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    } catch {
      // Try next path
    }
  }

  throw new Error("No local Inter font found. Place Inter-Regular.ttf in public/fonts/");
}

export interface LoadedFont {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: "normal";
}

/**
 * Load all fonts used by a template's widgets.
 * Always includes Inter as the default/fallback.
 */
export async function loadFontsForTemplate(
  widgets: { style: { fontFamily?: string } }[],
): Promise<LoadedFont[]> {
  const fontNames = new Set<string>();
  fontNames.add("Inter"); // always include default

  for (const widget of widgets) {
    if (widget.style.fontFamily) {
      fontNames.add(widget.style.fontFamily);
    }
  }

  const fonts: LoadedFont[] = [];

  for (const name of fontNames) {
    try {
      let data: ArrayBuffer;

      if (name === "Inter") {
        data = loadLocalInter();
      } else {
        const entry = getFont(name);
        if (!entry) continue;
        data = await downloadFont(entry);
      }

      const entry = getFont(name);
      fonts.push({
        name,
        data,
        weight: entry?.weight ?? 400,
        style: "normal",
      });
    } catch (err) {
      console.warn(`Failed to load font "${name}":`, err);
    }
  }

  return fonts;
}
