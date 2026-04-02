import type { WidgetRenderProps } from "../types";
import type { AsciiArtConfig } from "./index";

const PRESETS: Record<string, string> = {
  mountains: [
    "        /\\        ",
    "       /  \\    /\\ ",
    "      /    \\  /  \\",
    "  /\\ /      \\/    \\",
    " /  \\            \\ ",
    "/    \\____________\\",
  ].join("\n"),
  wave: [
    "    _.._      _.._    ",
    "  .'    '.  .'    '.  ",
    " /   /\\   \\/   /\\   \\ ",
    "|   /  \\      /  \\   |",
    " \\ /    \\    /    \\ / ",
    "  '      \\  /      '  ",
    "          \\/          ",
  ].join("\n"),
  coffee: [
    "        ) ) )",
    "       ( ( ( ",
    "     ........",
    "     |      |]",
    "     \\      / ",
    "      `----'  ",
  ].join("\n"),
  rocket: [
    "       /\\     ",
    "      /  \\    ",
    "     | () |   ",
    "     | () |   ",
    "    /|    |\\  ",
    "   / |    | \\ ",
    "  /  |    |  \\",
    "     | \\/ |   ",
    "     |    |   ",
    "     '-..-'   ",
    "      |\\/|    ",
    "       \\/     ",
  ].join("\n"),
  cat: [
    "  /\\_/\\  ",
    " ( o.o ) ",
    "  > ^ <  ",
    " /|   |\\ ",
    "(_|   |_)",
  ].join("\n"),
  tree: [
    "       *       ",
    "      /|\\      ",
    "     / | \\     ",
    "    /  |  \\    ",
    "   /   |   \\   ",
    "  /____|____\\  ",
    "       |       ",
    "       |       ",
  ].join("\n"),
  heart: [
    "  .:::.   .:::.",
    " :::::::.::::::",
    " ::::::::::::::::",
    " ':::::::::::::::",
    "   ':::::::::::'",
    "     ':::::::' ",
    "       ':::'   ",
    "         '     ",
  ].join("\n"),
  star: [
    "        .        ",
    "       /|\\       ",
    "      / | \\      ",
    "  .__/  |  \\__.  ",
    "  '-.   |   .-'  ",
    "     \\  |  /     ",
    "    __\\ | /__    ",
    "   '---|.---'    ",
  ].join("\n"),
};

export const AsciiArtRender: React.FC<WidgetRenderProps<AsciiArtConfig>> = ({
  config,
  style,
  size,
}) => {
  const padding = normalizePadding(style.padding);
  const artText = config.art === "custom" ? config.customArt : (PRESETS[config.art] || PRESETS.mountains);

  return (
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: style.fontFamily || "JetBrains Mono",
        color: style.color || "#4ade80",
        background: style.background || "rgba(0,0,0,0.5)",
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
          fontSize: style.fontSize || 12,
          lineHeight: 1.2,
          whiteSpace: "pre",
          display: "flex",
        }}
      >
        {artText}
      </div>
    </div>
  );
};

function normalizePadding(
  p?: number | { top: number; right: number; bottom: number; left: number },
): { top: number; right: number; bottom: number; left: number } {
  if (typeof p === "number") return { top: p, right: p, bottom: p, left: p };
  if (p) return p;
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
