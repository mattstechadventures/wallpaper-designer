import type { WidgetRenderProps } from "../types";
import type { QuoteConfig } from "./index";

export const QuoteRender: React.FC<WidgetRenderProps<QuoteConfig>> = ({
  config,
  style,
  size,
}) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const quotes = config.quotes?.length ? config.quotes : ["No quotes configured."];
  const index = dayOfYear % quotes.length;
  const quote = quotes[index];

  const padding = normalizePadding(style.padding);

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
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontSize: (style.fontSize || 18) * 3,
            fontWeight: 700,
            lineHeight: 0.8,
            opacity: 0.25,
            marginRight: 4,
            display: "flex",
          }}
        >
          {"\u201C"}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: style.fontSize || 18,
              fontWeight: style.fontWeight || 400,
              fontStyle: "italic",
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            {quote}
          </div>
          {config.showAttribution && (
            <div
              style={{
                fontSize: Math.max(12, (style.fontSize || 18) * 0.65),
                fontWeight: 400,
                opacity: 0.6,
                marginTop: 8,
                display: "flex",
              }}
            >
              {"— Quote of the Day"}
            </div>
          )}
        </div>
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
