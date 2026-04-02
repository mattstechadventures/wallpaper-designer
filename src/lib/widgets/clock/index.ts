import { z } from "zod";
import { ClockRender } from "./render";
import { ClockConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  format: z.enum(["HH:mm", "h:mm a", "HH:mm:ss"]).default("HH:mm"),
  showDate: z.boolean().default(true),
  dateFormat: z.string().default("dddd, D MMMM"),
});

export type ClockConfig = z.infer<typeof configSchema>;

export const clockWidget: WidgetDefinition<ClockConfig, unknown> = {
  type: "clock",
  name: "Clock",
  description: "Displays current time and date",
  icon: "Clock",
  defaultSpan: { cols: 4, rows: 2 },
  minSpan: { cols: 2, rows: 1 },
  configSchema,
  renderComponent: ClockRender,
  configComponent: ClockConfigPanel,
  defaultConfig: { format: "HH:mm", showDate: true, dateFormat: "dddd, D MMMM" },
  defaultStyle: {
    fontSize: 72,
    fontWeight: 200,
    color: "#ffffff",
    background: "transparent",
  },
};
