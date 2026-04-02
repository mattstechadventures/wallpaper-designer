import { z } from "zod";
import { CountdownRender } from "./render";
import { CountdownConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  targetDate: z.string().default("2026-12-31"),
  label: z.string().default("Countdown"),
  showHours: z.boolean().default(true),
});

export type CountdownConfig = z.infer<typeof configSchema>;

export const countdownWidget: WidgetDefinition<CountdownConfig, unknown> = {
  type: "countdown",
  name: "Countdown",
  description: "Days until a target date",
  icon: "Timer",
  defaultSpan: { cols: 3, rows: 2 },
  minSpan: { cols: 2, rows: 1 },
  configSchema,
  renderComponent: CountdownRender,
  configComponent: CountdownConfigPanel,
  defaultConfig: { targetDate: "2026-12-31", label: "Countdown", showHours: true },
  defaultStyle: {
    fontSize: 48,
    fontWeight: 300,
    color: "#ffffff",
    background: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 16,
  },
};
