import { z } from "zod";
import { AsciiArtRender } from "./render";
import { AsciiArtConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  art: z.string().default("mountains"),
  customArt: z.string().default(""),
});

export type AsciiArtConfig = z.infer<typeof configSchema>;

export const asciiArtWidget: WidgetDefinition<AsciiArtConfig, unknown> = {
  type: "ascii-art",
  name: "ASCII Art",
  description: "Decorative text art blocks",
  icon: "Terminal",
  defaultSpan: { cols: 3, rows: 2 },
  minSpan: { cols: 2, rows: 2 },
  configSchema,
  renderComponent: AsciiArtRender,
  configComponent: AsciiArtConfigPanel,
  defaultConfig: { art: "mountains", customArt: "" },
  defaultStyle: {
    fontSize: 12,
    fontFamily: "JetBrains Mono",
    color: "#4ade80",
    background: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 16,
  },
};
