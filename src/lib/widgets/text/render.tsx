import type { WidgetRenderProps } from "../types";
import type { TextConfig } from "./index";

export const TextRender: React.FC<WidgetRenderProps<TextConfig>> = ({
  config,
  style,
  size,
}) => {
  const padding = normalizePadding(style.padding);

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
        textAlign: (style.textAlign as "left" | "center" | "right") || "left",
      }}
    >
      {style.title && (
        <div
          style={{
            fontSize: style.title.fontSize || 20,
            fontWeight: style.title.fontWeight || 600,
            color: style.title.color || style.color || "#ffffff",
            marginBottom: style.title.marginBottom || 8,
            display: "flex",
          }}
        >
          {style.title.text}
        </div>
      )}
      <div
        style={{
          fontSize: style.fontSize || 14,
          fontWeight: style.fontWeight || 400,
          lineHeight: 1.5,
          display: "flex",
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
