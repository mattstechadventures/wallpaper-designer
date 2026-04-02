import { z } from "zod";
import { DayProgressRender } from "./render";
import { DayProgressConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  showDay: z.boolean().default(true),
  showWeek: z.boolean().default(true),
  showMonth: z.boolean().default(true),
  showYear: z.boolean().default(true),
  barColor: z.string().default("#818cf8"),
});

export type DayProgressConfig = z.infer<typeof configSchema>;

export const dayProgressWidget: WidgetDefinition<DayProgressConfig, unknown> = {
  type: "day-progress",
  name: "Day Progress",
  description: "Progress through day, week, month, year",
  icon: "BarChart",
  defaultSpan: { cols: 3, rows: 2 },
  minSpan: { cols: 2, rows: 2 },
  configSchema,
  renderComponent: DayProgressRender,
  configComponent: DayProgressConfigPanel,
  defaultConfig: { showDay: true, showWeek: true, showMonth: true, showYear: true, barColor: "#818cf8" },
  defaultStyle: {
    fontSize: 12,
    color: "#ffffff",
    background: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 16,
  },
};
