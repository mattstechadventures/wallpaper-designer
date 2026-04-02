import type { WidgetDefinition } from "./types";
import { clockWidget } from "./clock";
import { textWidget } from "./text";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const widgetRegistry = new Map<string, WidgetDefinition<any, any>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function registerWidget(def: WidgetDefinition<any, any>) {
  widgetRegistry.set(def.type, def);
}

// Register built-in widgets
registerWidget(clockWidget);
registerWidget(textWidget);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getWidget(type: string): WidgetDefinition<any, any> | undefined {
  return widgetRegistry.get(type);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAllWidgets(): WidgetDefinition<any, any>[] {
  return Array.from(widgetRegistry.values());
}

export { widgetRegistry };
