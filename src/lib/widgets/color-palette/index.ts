import { z } from "zod";
import { ColorPaletteRender } from "./render";
import { ColorPaletteConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  colors: z.number().min(3).max(8).default(5),
  seed: z.string().default("auto"),
  showHex: z.boolean().default(true),
});

export type ColorPaletteConfig = z.infer<typeof configSchema>;

export const colorPaletteWidget: WidgetDefinition<ColorPaletteConfig, unknown> = {
  type: "color-palette",
  name: "Color Palette",
  description: "Daily generated color scheme",
  icon: "Palette",
  defaultSpan: { cols: 4, rows: 2 },
  minSpan: { cols: 3, rows: 1 },
  configSchema,
  renderComponent: ColorPaletteRender,
  configComponent: ColorPaletteConfigPanel,
  defaultConfig: { colors: 5, seed: "auto", showHex: true },
  defaultStyle: {
    fontSize: 11,
    color: "#ffffff",
    background: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 16,
  },
};
