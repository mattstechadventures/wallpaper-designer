import type { WidgetRenderProps } from "../types";
import type { DayProgressConfig } from "./index";

export const DayProgressRender: React.FC<WidgetRenderProps<DayProgressConfig>> = ({
  config,
  style,
  size,
}) => {
  const now = new Date();
  const padding = normalizePadding(style.padding);

  const bars: { label: string; pct: number }[] = [];

  if (config.showDay) {
    const hours = now.getHours() + now.getMinutes() / 60;
    bars.push({ label: "Day", pct: hours / 24 });
  }

  if (config.showWeek) {
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const hours = now.getHours() + now.getMinutes() / 60;
    bars.push({ label: "Week", pct: (dayOfWeek * 24 + hours) / (7 * 24) });
  }

  if (config.showMonth) {
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    bars.push({ label: "Month", pct: dayOfMonth / daysInMonth });
  }

  if (config.showYear) {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysInYear = isLeapYear(now.getFullYear()) ? 366 : 365;
    bars.push({ label: "Year", pct: dayOfYear / daysInYear });
  }

  const barColor = config.barColor || "#818cf8";

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
        gap: 10,
      }}
    >
      {bars.map((bar) => (
        <div
          key={bar.label}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: style.fontSize || 12,
              fontWeight: style.fontWeight || 500,
            }}
          >
            <div style={{ display: "flex" }}>{bar.label}</div>
            <div style={{ display: "flex", opacity: 0.7 }}>
              {Math.round(bar.pct * 100)}%
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 6,
              borderRadius: 3,
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: `${Math.min(100, Math.round(bar.pct * 100))}%`,
                height: 6,
                borderRadius: 3,
                background: barColor,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function normalizePadding(
  p?: number | { top: number; right: number; bottom: number; left: number },
): { top: number; right: number; bottom: number; left: number } {
  if (typeof p === "number") return { top: p, right: p, bottom: p, left: p };
  if (p) return p;
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
