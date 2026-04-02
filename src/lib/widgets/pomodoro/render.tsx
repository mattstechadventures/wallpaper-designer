import type { WidgetRenderProps } from "../types";
import type { PomodoroConfig } from "./index";

export const PomodoroRender: React.FC<WidgetRenderProps<PomodoroConfig>> = ({
  config,
  style,
  size,
}) => {
  const now = new Date();
  const cycleLength = config.focusMinutes + config.breakMinutes;
  const totalCycleMinutes = cycleLength * config.sessions;

  // Use current hour of day modulo sessions to determine completed sessions
  const currentHour = now.getHours();
  const completedSessions = currentHour % config.sessions;

  // Determine current phase within the cycle based on minutes in the hour
  const minuteInHour = now.getMinutes();
  const minuteInCycle = minuteInHour % cycleLength;
  const isFocus = minuteInCycle < config.focusMinutes;

  const phaseColor = isFocus ? "#ef4444" : "#4ade80";
  const phaseLabel = isFocus
    ? `Focus ${config.focusMinutes}m`
    : `Break ${config.breakMinutes}m`;

  const padding = normalizePadding(style.padding);
  const circleSize = Math.max(12, Math.min(20, (style.fontSize || 32) * 0.5));

  return (
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
      {/* Phase label */}
      <div
        style={{
          fontSize: style.fontSize || 32,
          fontWeight: style.fontWeight || 300,
          color: phaseColor,
          display: "flex",
          alignItems: "center",
          lineHeight: 1.2,
        }}
      >
        {phaseLabel}
      </div>

      {/* Session circles */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
        }}
      >
        {Array.from({ length: config.sessions }).map((_, i) => (
          <div
            key={i}
            style={{
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              background:
                i < completedSessions ? phaseColor : "rgba(255,255,255,0.15)",
              border:
                i < completedSessions
                  ? `2px solid ${phaseColor}`
                  : "2px solid rgba(255,255,255,0.3)",
              display: "flex",
            }}
          />
        ))}
      </div>

      {/* Session count label */}
      <div
        style={{
          fontSize: Math.max(10, (style.fontSize || 32) * 0.35),
          fontWeight: 400,
          opacity: 0.6,
          marginTop: 6,
          display: "flex",
        }}
      >
        {completedSessions}/{config.sessions} sessions
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
