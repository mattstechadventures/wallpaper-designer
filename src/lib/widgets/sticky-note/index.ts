import { z } from "zod";
import { StickyNoteRender } from "./render";
import { StickyNoteConfigPanel } from "./config";
import type { WidgetDefinition } from "../types";

const configSchema = z.object({
  content: z.string().default("Remember to..."),
  noteColor: z.enum(["yellow", "pink", "blue", "green", "purple"]).default("yellow"),
});

export type StickyNoteConfig = z.infer<typeof configSchema>;

export const stickyNoteWidget: WidgetDefinition<StickyNoteConfig, unknown> = {
  type: "sticky-note",
  name: "Sticky Note",
  description: "Freeform note with color themes",
  icon: "StickyNote",
  defaultSpan: { cols: 2, rows: 2 },
  minSpan: { cols: 2, rows: 2 },
  configSchema,
  renderComponent: StickyNoteRender,
  configComponent: StickyNoteConfigPanel,
  defaultConfig: { content: "Remember to...", noteColor: "yellow" },
  defaultStyle: {
    fontSize: 16,
    fontWeight: 400,
    fontFamily: "Dancing Script",
    color: "#1a1a1a",
    borderRadius: 4,
    padding: 20,
  },
};
