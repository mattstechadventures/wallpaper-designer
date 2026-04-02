import { z } from "zod";
import { HabitTrackerRender } from "./render";
import { HabitTrackerConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  habitName: z.string().default("Habit"),
  streakDays: z.number().default(7),
  completedDays: z.array(z.number()).default([]),
  weeks: z.number().min(1).max(12).default(4),
  activeColor: z.string().default("#4ade80"),
});

export type HabitTrackerConfig = z.infer<typeof configSchema>;

export const habitTrackerWidget: WidgetDefinition<HabitTrackerConfig, unknown> = {
  type: "habit-tracker",
  name: "Habit Tracker",
  description: "Streak grid like GitHub contributions",
  icon: "Grid",
  defaultSpan: { cols: 3, rows: 2 },
  minSpan: { cols: 2, rows: 2 },
  configSchema,
  renderComponent: HabitTrackerRender,
  configComponent: HabitTrackerConfigPanel,
  defaultConfig: { habitName: "Habit", streakDays: 7, completedDays: [], weeks: 4, activeColor: "#4ade80" },
  defaultStyle: {
    fontSize: 14,
    color: "#ffffff",
    background: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 16,
  },
};
