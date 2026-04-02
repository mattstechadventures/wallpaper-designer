import type { WidgetRenderProps } from "../types";
import type { ClockConfig } from "./index";

export const ClockRender: React.FC<WidgetRenderProps<ClockConfig>> = ({
  config,
  style,
  size,
}) => {
  const now = new Date();

  const timeStr = formatTime(now, config.format);
  const dateStr = config.showDate ? formatDate(now, config.dateFormat) : null;

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
        textAlign: (style.textAlign as "left" | "center" | "right") || "left",
      }}
    >
      <div
        style={{
          fontSize: style.fontSize || 72,
          fontWeight: style.fontWeight || 200,
          lineHeight: 1.1,
          display: "flex",
        }}
      >
        {timeStr}
      </div>
      {dateStr && (
        <div
          style={{
            fontSize: Math.max(16, (style.fontSize || 72) * 0.25),
            fontWeight: 400,
            opacity: 0.7,
            marginTop: 4,
            display: "flex",
          }}
        >
          {dateStr}
        </div>
      )}
    </div>
  );
};

function formatTime(date: Date, format: string): string {
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = hours24 >= 12 ? "PM" : "AM";

  switch (format) {
    case "h:mm a":
      return `${hours12}:${minutes} ${ampm}`;
    case "HH:mm:ss":
      return `${hours24.toString().padStart(2, "0")}:${minutes}:${seconds}`;
    case "HH:mm":
    default:
      return `${hours24.toString().padStart(2, "0")}:${minutes}`;
  }
}

function formatDate(date: Date, format?: string): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();

  if (format === "D MMMM YYYY") {
    return `${dayNum} ${monthName} ${date.getFullYear()}`;
  }
  // Default: "dddd, D MMMM"
  return `${dayName}, ${dayNum} ${monthName}`;
}

function normalizePadding(
  p?: number | { top: number; right: number; bottom: number; left: number },
): { top: number; right: number; bottom: number; left: number } {
  if (typeof p === "number") return { top: p, right: p, bottom: p, left: p };
  if (p) return p;
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
