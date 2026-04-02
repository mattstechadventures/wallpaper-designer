import { z } from "zod";
import { SunriseSunsetRender } from "./render";
import { SunriseSunsetConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  latitude: z.number().default(40.7128),
  longitude: z.number().default(-74.006),
  locationName: z.string().default("New York"),
});

export type SunriseSunsetConfig = z.infer<typeof configSchema>;

export const sunriseSunsetWidget: WidgetDefinition<SunriseSunsetConfig, unknown> = {
  type: "sunrise-sunset",
  name: "Sunrise/Sunset",
  description: "Sun times with visual arc",
  icon: "Sun",
  defaultSpan: { cols: 3, rows: 2 },
  minSpan: { cols: 2, rows: 2 },
  configSchema,
  renderComponent: SunriseSunsetRender,
  configComponent: SunriseSunsetConfigPanel,
  defaultConfig: { latitude: 40.7128, longitude: -74.006, locationName: "New York" },
  defaultStyle: {
    fontSize: 14,
    color: "#ffffff",
    background: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 16,
  },
};
