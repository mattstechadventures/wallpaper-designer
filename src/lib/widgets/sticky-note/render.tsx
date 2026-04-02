import type { WidgetRenderProps } from "../types";
import type { StickyNoteConfig } from "./index";

const NOTE_COLORS: Record<string, string> = {
  yellow: "#fef08a",
  pink: "#fda4af",
  blue: "#93c5fd",
  green: "#86efac",
  purple: "#c4b5fd",
};

const NOTE_BORDER_COLORS: Record<string, string> = {
  yellow: "#eab308",
  pink: "#e11d48",
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#8b5cf6",
};

export const StickyNoteRender: React.FC<WidgetRenderProps<StickyNoteConfig>> = ({
  config,
  style,
  size,
}) => {
  const padding = normalizePadding(style.padding);
  const bg = NOTE_COLORS[config.noteColor] || NOTE_COLORS.yellow;
  const borderColor = NOTE_BORDER_COLORS[config.noteColor] || NOTE_BORDER_COLORS.yellow;

  return (
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        flexDirection: "column",
        fontFamily: style.fontFamily || "Dancing Script",
        color: style.color || "#1a1a1a",
        background: bg,
        borderRadius: style.borderRadius || 4,
        opacity: style.opacity ?? 1,
        paddingTop: padding.top,
        paddingRight: padding.right,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left,
        borderBottom: `3px solid ${borderColor}`,
      }}
    >
      <div
        style={{
          fontSize: style.fontSize || 16,
          fontWeight: style.fontWeight || 400,
          lineHeight: 1.6,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {config.content}
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
