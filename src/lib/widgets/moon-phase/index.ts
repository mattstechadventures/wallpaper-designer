import { z } from "zod";
import { MoonPhaseRender } from "./render";
import { MoonPhaseConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  showName: z.boolean().default(true),
  showIllumination: z.boolean().default(true),
});

export type MoonPhaseConfig = z.infer<typeof configSchema>;

export const moonPhaseWidget: WidgetDefinition<MoonPhaseConfig, unknown> = {
  type: "moon-phase",
  name: "Moon Phase",
  description: "Current lunar phase display",
  icon: "Moon",
  defaultSpan: { cols: 2, rows: 2 },
  minSpan: { cols: 2, rows: 2 },
  configSchema,
  renderComponent: MoonPhaseRender,
  configComponent: MoonPhaseConfigPanel,
  defaultConfig: { showName: true, showIllumination: true },
  defaultStyle: {
    fontSize: 14,
    color: "#ffffff",
    background: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 16,
  },
};
