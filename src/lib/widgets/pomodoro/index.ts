import { z } from "zod";
import { PomodoroRender } from "./render";
import { PomodoroConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  focusMinutes: z.number().min(1).max(120).default(25),
  breakMinutes: z.number().min(1).max(60).default(5),
  sessions: z.number().min(1).max(12).default(4),
});

export type PomodoroConfig = z.infer<typeof configSchema>;

export const pomodoroWidget: WidgetDefinition<PomodoroConfig, unknown> = {
  type: "pomodoro",
  name: "Pomodoro",
  description: "Focus timer with work/break sessions",
  icon: "Hourglass",
  defaultSpan: { cols: 3, rows: 2 },
  minSpan: { cols: 2, rows: 1 },
  configSchema,
  renderComponent: PomodoroRender,
  configComponent: PomodoroConfigPanel,
  defaultConfig: { focusMinutes: 25, breakMinutes: 5, sessions: 4 },
  defaultStyle: {
    fontSize: 32,
    fontWeight: 300,
    color: "#ffffff",
    background: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 16,
  },
};
