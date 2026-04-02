import type { WidgetRenderProps } from "../types";
import type { ColorPaletteConfig } from "./index";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function seedFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}

function generatePalette(count: number, seed: string): string[] {
  let seedNum: number;
  if (seed === "auto") {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    seedNum = dayOfYear * 1000 + now.getFullYear();
  } else {
    seedNum = seedFromString(seed);
  }

  const rand = seededRandom(seedNum);
  const baseHue = Math.floor(rand() * 360);
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const hue = (baseHue + Math.floor((360 / count) * i)) % 360;
    const saturation = 55 + Math.floor(rand() * 30);
    const lightness = 45 + Math.floor(rand() * 20);
    colors.push(hslToHex(hue, saturation, lightness));
  }

  return colors;
}

function normalizePadding(
  p?: number | { top: number; right: number; bottom: number; left: number },
): { top: number; right: number; bottom: number; left: number } {
  if (typeof p === "number") return { top: p, right: p, bottom: p, left: p };
  if (p) return p;
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

export const ColorPaletteRender: React.FC<WidgetRenderProps<ColorPaletteConfig>> = ({
  config,
  style,
  size,
}) => {
  const padding = normalizePadding(style.padding);
  const colors = generatePalette(config.colors, config.seed);

  const innerWidth =
    size.width - padding.left - padding.right;
  const innerHeight =
    size.height - padding.top - padding.bottom;

  const gap = 6;
  const swatchWidth = Math.floor(
    (innerWidth - gap * (config.colors - 1)) / config.colors,
  );
  const hexLabelHeight = config.showHex ? (style.fontSize || 11) + 8 : 0;
  const swatchHeight = innerHeight - hexLabelHeight;

  return (
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        flexDirection: "column",
        fontFamily: style.fontFamily || "inherit",
        color: style.color || "#ffffff",
        background: style.background || "transparent",
        borderRadius: style.borderRadius || 0,
        opacity: style.opacity ?? 1,
        paddingTop: padding.top,
        paddingRight: padding.right,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: gap,
          flex: 1,
        }}
      >
        {colors.map((hex, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: swatchWidth,
            }}
          >
            <div
              style={{
                display: "flex",
                width: swatchWidth,
                height: Math.max(swatchHeight, 20),
                backgroundColor: hex,
                borderRadius: 6,
              }}
            />
            {config.showHex && (
              <div
                style={{
                  display: "flex",
                  fontSize: style.fontSize || 11,
                  fontWeight: 500,
                  marginTop: 4,
                  color: isLightColor(hex) ? "#1a1a1a" : "#ffffff",
                }}
              >
                {hex.toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
