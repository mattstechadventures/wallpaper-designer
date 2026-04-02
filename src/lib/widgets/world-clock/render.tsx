import type { WidgetRenderProps } from "../types";
import type { WorldClockConfig } from "./index";

export const WorldClockRender: React.FC<WidgetRenderProps<WorldClockConfig>> = ({
  config,
  style,
  size,
}) => {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();

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
      {config.timezones.map((tz, i) => {
        const timeStr = formatTimeWithOffset(
          utcHours,
          utcMinutes,
          tz.offset,
          config.format,
        );

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: i === 0 ? 0 : 6,
              paddingBottom: i === config.timezones.length - 1 ? 0 : 6,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: Math.max(12, (style.fontSize || 24) * 0.6),
                fontWeight: 400,
                opacity: 0.7,
              }}
            >
              {tz.label}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: style.fontSize || 24,
                fontWeight: style.fontWeight || 300,
              }}
            >
              {timeStr}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function formatTimeWithOffset(
  utcHours: number,
  utcMinutes: number,
  offset: number,
  format: string,
): string {
  const totalMinutes = utcHours * 60 + utcMinutes + offset * 60;
  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;

  const minutesStr = minutes.toString().padStart(2, "0");

  if (format === "h:mm a") {
    const hours12 = hours24 % 12 || 12;
    const ampm = hours24 >= 12 ? "PM" : "AM";
    return `${hours12}:${minutesStr} ${ampm}`;
  }

  return `${hours24.toString().padStart(2, "0")}:${minutesStr}`;
}

function normalizePadding(
  p?: number | { top: number; right: number; bottom: number; left: number },
): { top: number; right: number; bottom: number; left: number } {
  if (typeof p === "number") return { top: p, right: p, bottom: p, left: p };
  if (p) return p;
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
