import type { WidgetRenderProps } from "../types";
import type { MoonPhaseConfig } from "./index";

const SYNODIC_MONTH = 29.53058770576;
const KNOWN_NEW_MOON = new Date(2000, 0, 6, 18, 14).getTime();

const PHASE_NAMES = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
] as const;

const PHASE_EMOJIS = [
  "\u{1F311}",
  "\u{1F312}",
  "\u{1F313}",
  "\u{1F314}",
  "\u{1F315}",
  "\u{1F316}",
  "\u{1F317}",
  "\u{1F318}",
];

function getMoonPhase(date: Date) {
  const diffMs = date.getTime() - KNOWN_NEW_MOON;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const cycles = diffDays / SYNODIC_MONTH;
  const phase = cycles - Math.floor(cycles);

  const phaseIndex = Math.floor(phase * 8) % 8;

  const illumination =
    phase <= 0.5 ? phase * 2 : (1 - phase) * 2;

  return {
    phase,
    phaseIndex,
    name: PHASE_NAMES[phaseIndex],
    emoji: PHASE_EMOJIS[phaseIndex],
    illumination: Math.round(illumination * 100),
  };
}

export const MoonPhaseRender: React.FC<WidgetRenderProps<MoonPhaseConfig>> = ({
  config,
  style,
  size,
}) => {
  const now = new Date();
  const moon = getMoonPhase(now);
  const padding = normalizePadding(style.padding);
  const emojiSize = Math.min(size.width, size.height) * 0.4;

  return (
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
          fontSize: emojiSize,
          lineHeight: 1.1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {moon.emoji}
      </div>

      {config.showName && (
        <div
          style={{
            fontSize: style.fontSize || 14,
            fontWeight: 600,
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {moon.name}
        </div>
      )}

      {config.showIllumination && (
        <div
          style={{
            fontSize: Math.max(12, (style.fontSize || 14) * 0.85),
            opacity: 0.7,
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {moon.illumination}% illuminated
        </div>
      )}
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
