import type { WidgetRenderProps } from "../types";
import type { CountdownConfig } from "./index";

export const CountdownRender: React.FC<WidgetRenderProps<CountdownConfig>> = ({
  config,
  style,
  size,
}) => {
  const now = new Date();
  const target = new Date(config.targetDate + "T00:00:00");
  const diffMs = target.getTime() - now.getTime();

  const totalHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  const padding = normalizePadding(style.padding);

  const mainText = config.showHours ? `${days}d ${hours}h` : `${days}`;

  return (
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
      <div
        style={{
          fontSize: style.fontSize || 48,
          fontWeight: style.fontWeight || 300,
          lineHeight: 1.1,
          display: "flex",
        }}
      >
        {mainText}
      </div>
      <div
        style={{
          fontSize: Math.max(14, (style.fontSize || 48) * 0.3),
          fontWeight: 400,
          opacity: 0.7,
          marginTop: 4,
          display: "flex",
        }}
      >
        {config.label}
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
