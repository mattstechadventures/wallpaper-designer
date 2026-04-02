import type { WidgetRenderProps } from "../types";
import type { SunriseSunsetConfig } from "./index";

/**
 * Simplified solar calculation using standard approximation:
 * day-of-year, solar declination, hour angle, sunrise/sunset equations.
 */
function calculateSunTimes(latitude: number, longitude: number, date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Solar declination (radians)
  const declination = -23.45 * Math.cos((360 / 365) * (dayOfYear + 10) * (Math.PI / 180));
  const declinationRad = declination * (Math.PI / 180);
  const latRad = latitude * (Math.PI / 180);

  // Hour angle (degrees)
  const cosHourAngle = Math.max(
    -1,
    Math.min(
      1,
      -Math.tan(latRad) * Math.tan(declinationRad),
    ),
  );
  const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI);

  // Solar noon in hours (UTC)
  const solarNoon = 12 - longitude / 15;

  const sunriseUTC = solarNoon - hourAngle / 15;
  const sunsetUTC = solarNoon + hourAngle / 15;

  // Convert to local time using the Date timezone offset
  const offsetHours = -date.getTimezoneOffset() / 60;

  const sunriseLocal = sunriseUTC + offsetHours;
  const sunsetLocal = sunsetUTC + offsetHours;

  const toDate = (hours: number): Date => {
    const h = Math.floor(((hours % 24) + 24) % 24);
    const m = Math.floor((((hours % 24) + 24) % 24 - h) * 60);
    const result = new Date(date);
    result.setHours(h, m, 0, 0);
    return result;
  };

  return {
    sunrise: toDate(sunriseLocal),
    sunset: toDate(sunsetLocal),
    sunriseHours: ((sunriseLocal % 24) + 24) % 24,
    sunsetHours: ((sunsetLocal % 24) + 24) % 24,
  };
}

function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function normalizePadding(
  p?: number | { top: number; right: number; bottom: number; left: number },
): { top: number; right: number; bottom: number; left: number } {
  if (typeof p === "number") return { top: p, right: p, bottom: p, left: p };
  if (p) return p;
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

export const SunriseSunsetRender: React.FC<WidgetRenderProps<SunriseSunsetConfig>> = ({
  config,
  style,
  size,
}) => {
  const now = new Date();
  const { sunrise, sunset, sunriseHours, sunsetHours } = calculateSunTimes(
    config.latitude,
    config.longitude,
    now,
  );

  const daylightMinutes = Math.round((sunsetHours - sunriseHours) * 60);
  const daylightH = Math.floor(daylightMinutes / 60);
  const daylightM = daylightMinutes % 60;

  // Current time progress between sunrise and sunset (0 to 1)
  const currentHours = now.getHours() + now.getMinutes() / 60;
  const progress = Math.max(0, Math.min(1, (currentHours - sunriseHours) / (sunsetHours - sunriseHours)));
  const isDaytime = currentHours >= sunriseHours && currentHours <= sunsetHours;

  const padding = normalizePadding(style.padding);
  const fontSize = style.fontSize || 14;

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
      {/* Location name */}
      <div
        style={{
          display: "flex",
          fontSize: fontSize + 2,
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        {config.locationName}
      </div>

      {/* Sunrise and Sunset times */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontSize,
          }}
        >
          <span
            style={{
              display: "flex",
              color: "#FFA500",
              marginRight: 4,
              fontSize: fontSize + 4,
            }}
          >
            {"↑"}
          </span>
          <span style={{ display: "flex" }}>{formatTime(sunrise)}</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontSize,
          }}
        >
          <span style={{ display: "flex" }}>{formatTime(sunset)}</span>
          <span
            style={{
              display: "flex",
              color: "#FF6347",
              marginLeft: 4,
              fontSize: fontSize + 4,
            }}
          >
            {"↓"}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Track background */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 8,
            borderRadius: 4,
            background: "rgba(255,255,255,0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Daylight gradient fill */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              borderRadius: 4,
              background: "linear-gradient(to right, #FF8C00, #FFD700, #FF8C00)",
              opacity: 0.8,
            }}
          />
        </div>
      </div>

      {/* Dot marker for current time */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginTop: -13,
          paddingLeft: `${progress * 100}%`,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 14,
            height: 14,
            borderRadius: 7,
            background: isDaytime ? "#FFD700" : "rgba(255,255,255,0.5)",
            border: "2px solid #ffffff",
            marginLeft: -7,
          }}
        />
      </div>

      {/* Daylight duration */}
      <div
        style={{
          display: "flex",
          fontSize: fontSize - 1,
          opacity: 0.7,
          marginTop: 6,
          justifyContent: "center",
        }}
      >
        {`Daylight: ${daylightH}h ${daylightM}m`}
      </div>
    </div>
  );
};
