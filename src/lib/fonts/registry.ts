// Curated list of fonts available for widgets.
// Each font must be available from Google Fonts for both browser preview
// and server-side Satori rendering (downloaded as TTF).

export interface FontEntry {
  name: string;
  /** Google Fonts family name (used in CSS and download URL) */
  googleFamily: string;
  /** Font weight to load (default 400) */
  weight: number;
  /** Category for grouping in the selector */
  category: "sans-serif" | "serif" | "monospace" | "display" | "handwriting";
}

export const AVAILABLE_FONTS: FontEntry[] = [
  { name: "Inter", googleFamily: "Inter", weight: 400, category: "sans-serif" },
  { name: "Roboto", googleFamily: "Roboto", weight: 400, category: "sans-serif" },
  { name: "Open Sans", googleFamily: "Open+Sans", weight: 400, category: "sans-serif" },
  { name: "Montserrat", googleFamily: "Montserrat", weight: 400, category: "sans-serif" },
  { name: "Poppins", googleFamily: "Poppins", weight: 400, category: "sans-serif" },
  { name: "Lato", googleFamily: "Lato", weight: 400, category: "sans-serif" },
  { name: "Nunito", googleFamily: "Nunito", weight: 400, category: "sans-serif" },
  { name: "Raleway", googleFamily: "Raleway", weight: 400, category: "sans-serif" },
  { name: "Playfair Display", googleFamily: "Playfair+Display", weight: 400, category: "serif" },
  { name: "Merriweather", googleFamily: "Merriweather", weight: 400, category: "serif" },
  { name: "Lora", googleFamily: "Lora", weight: 400, category: "serif" },
  { name: "Source Serif 4", googleFamily: "Source+Serif+4", weight: 400, category: "serif" },
  { name: "JetBrains Mono", googleFamily: "JetBrains+Mono", weight: 400, category: "monospace" },
  { name: "Fira Code", googleFamily: "Fira+Code", weight: 400, category: "monospace" },
  { name: "Space Mono", googleFamily: "Space+Mono", weight: 400, category: "monospace" },
  { name: "Bebas Neue", googleFamily: "Bebas+Neue", weight: 400, category: "display" },
  { name: "Righteous", googleFamily: "Righteous", weight: 400, category: "display" },
  { name: "Pacifico", googleFamily: "Pacifico", weight: 400, category: "handwriting" },
  { name: "Dancing Script", googleFamily: "Dancing+Script", weight: 400, category: "handwriting" },
];

/** Get a font entry by name */
export function getFont(name: string): FontEntry | undefined {
  return AVAILABLE_FONTS.find((f) => f.name === name);
}

/** Build a Google Fonts CSS URL for a set of font names */
export function buildGoogleFontsUrl(fontNames: string[]): string | null {
  const unique = [...new Set(fontNames)];
  const entries = unique
    .map((name) => getFont(name))
    .filter((f): f is FontEntry => f !== undefined);

  if (entries.length === 0) return null;

  const families = entries
    .map((f) => `family=${f.googleFamily}:wght@${f.weight}`)
    .join("&");

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/** Build a Google Fonts TTF download URL for Satori */
export function buildFontDownloadUrl(font: FontEntry): string {
  return `https://fonts.googleapis.com/css2?family=${font.googleFamily}:wght@${font.weight}&display=swap`;
}
