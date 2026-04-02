import { z } from "zod";
import { WorldClockRender } from "./render";
import { WorldClockConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  timezones: z.array(z.object({
    label: z.string(),
    offset: z.number(),
  })).default([
    { label: "New York", offset: -5 },
    { label: "London", offset: 0 },
    { label: "Tokyo", offset: 9 },
  ]),
  format: z.enum(["HH:mm", "h:mm a"]).default("HH:mm"),
});

export type WorldClockConfig = z.infer<typeof configSchema>;

export const worldClockWidget: WidgetDefinition<WorldClockConfig, unknown> = {
  type: "world-clock",
  name: "World Clock",
  description: "Multiple timezone clocks",
  icon: "Globe",
  defaultSpan: { cols: 3, rows: 2 },
  minSpan: { cols: 2, rows: 2 },
  configSchema,
  renderComponent: WorldClockRender,
  configComponent: WorldClockConfigPanel,
  defaultConfig: {
    timezones: [
      { label: "New York", offset: -5 },
      { label: "London", offset: 0 },
      { label: "Tokyo", offset: 9 },
    ],
    format: "HH:mm",
  },
  defaultStyle: {
    fontSize: 24,
    fontWeight: 300,
    color: "#ffffff",
    background: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 16,
  },
};
