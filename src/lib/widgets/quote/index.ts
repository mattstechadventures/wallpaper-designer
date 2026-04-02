import { z } from "zod";
import { QuoteRender } from "./render";
import { QuoteConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  quotes: z.array(z.string()).default([
    "The only way to do great work is to love what you do.",
    "Stay hungry, stay foolish.",
    "Simplicity is the ultimate sophistication.",
    "Do what you can, with what you have, where you are.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
  ]),
  showAttribution: z.boolean().default(false),
});

export type QuoteConfig = z.infer<typeof configSchema>;

export const quoteWidget: WidgetDefinition<QuoteConfig, unknown> = {
  type: "quote",
  name: "Quote",
  description: "Daily rotating inspirational quote",
  icon: "Quote",
  defaultSpan: { cols: 4, rows: 2 },
  minSpan: { cols: 3, rows: 1 },
  configSchema,
  renderComponent: QuoteRender,
  configComponent: QuoteConfigPanel,
  defaultConfig: {
    quotes: [
      "The only way to do great work is to love what you do.",
      "Stay hungry, stay foolish.",
      "Simplicity is the ultimate sophistication.",
      "Do what you can, with what you have, where you are.",
      "The best time to plant a tree was 20 years ago. The second best time is now.",
    ],
    showAttribution: false,
  },
  defaultStyle: {
    fontSize: 18,
    fontWeight: 400,
    color: "#ffffff",
    background: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 24,
  },
};
