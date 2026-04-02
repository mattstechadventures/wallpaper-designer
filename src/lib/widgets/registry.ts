import type { WidgetDefinition } from "./types";
import { clockWidget } from "./clock";
import { textWidget } from "./text";
import { countdownWidget } from "./countdown";
import { habitTrackerWidget } from "./habit-tracker";
import { pomodoroWidget } from "./pomodoro";
import { quoteWidget } from "./quote";
import { stickyNoteWidget } from "./sticky-note";
import { worldClockWidget } from "./world-clock";
import { sunriseSunsetWidget } from "./sunrise-sunset";
import { moonPhaseWidget } from "./moon-phase";
import { dayProgressWidget } from "./day-progress";
import { colorPaletteWidget } from "./color-palette";
import { asciiArtWidget } from "./ascii-art";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const widgetRegistry = new Map<string, WidgetDefinition<any, any>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function registerWidget(def: WidgetDefinition<any, any>) {
  widgetRegistry.set(def.type, def);
}

// Register built-in widgets
registerWidget(clockWidget);
registerWidget(textWidget);
registerWidget(countdownWidget);
registerWidget(habitTrackerWidget);
registerWidget(pomodoroWidget);
registerWidget(quoteWidget);
registerWidget(stickyNoteWidget);
registerWidget(worldClockWidget);
registerWidget(sunriseSunsetWidget);
registerWidget(moonPhaseWidget);
registerWidget(dayProgressWidget);
registerWidget(colorPaletteWidget);
registerWidget(asciiArtWidget);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getWidget(type: string): WidgetDefinition<any, any> | undefined {
  return widgetRegistry.get(type);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAllWidgets(): WidgetDefinition<any, any>[] {
  return Array.from(widgetRegistry.values());
}

export { widgetRegistry };
