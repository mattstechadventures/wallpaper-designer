import type { WidgetRenderProps } from "../types";
import type { HabitTrackerConfig } from "./index";

export const HabitTrackerRender: React.FC<WidgetRenderProps<HabitTrackerConfig>> = ({
  config,
  style,
  size,
}) => {
  const padding = normalizePadding(style.padding);
  const totalCells = config.weeks * 7;

  // Deterministic pattern based on day-of-year seed
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
  );

  const isCellActive = (index: number): boolean => {
    // Simple deterministic hash using day-of-year and cell index
    const seed = (dayOfYear * 31 + index * 17) % 100;
    return seed < 45; // ~45% fill rate
  };

  const activeColor = config.activeColor || "#4ade80";
  const inactiveColor = "rgba(255,255,255,0.1)";
  const cellSize = 12;
  const cellGap = 3;

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
      {/* Title */}
      <div
        style={{
          display: "flex",
          fontSize: style.fontSize || 14,
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {config.habitName}
      </div>

      {/* Grid: columns = weeks, rows = 7 days */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: cellGap,
        }}
      >
        {Array.from({ length: config.weeks }).map((_, weekIdx) => (
          <div
            key={weekIdx}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: cellGap,
            }}
          >
            {Array.from({ length: 7 }).map((_, dayIdx) => {
              const cellIndex = weekIdx * 7 + dayIdx;
              const active =
                cellIndex < totalCells && isCellActive(cellIndex);
              return (
                <div
                  key={dayIdx}
                  style={{
                    display: "flex",
                    width: cellSize,
                    height: cellSize,
                    borderRadius: 2,
                    backgroundColor: active ? activeColor : inactiveColor,
                  }}
                />
              );
            })}
          </div>
        ))}
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
