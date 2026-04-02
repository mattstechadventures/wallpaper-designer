import { z } from "zod";
import { TextRender } from "./render";
import { TextConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  content: z.string().default(""),
});

export type TextConfig = z.infer<typeof configSchema>;

export const textWidget: WidgetDefinition<TextConfig, unknown> = {
  type: "text",
  name: "Text",
  description: "Static text block with optional title",
  icon: "Type",
  defaultSpan: { cols: 3, rows: 2 },
  minSpan: { cols: 2, rows: 1 },
  configSchema,
  renderComponent: TextRender,
  configComponent: TextConfigPanel,
  defaultConfig: { content: "Your text here" },
  defaultStyle: {
    fontSize: 14,
    color: "#e0e0e0",
    background: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 16,
  },
};
