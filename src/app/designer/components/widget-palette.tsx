"use client";

import { getAllWidgets } from "@/lib/widgets/registry";
import { useDesignerStore } from "@/lib/store/designer-store";
import { widgetFitsGrid, widgetsOverlap } from "@/lib/grid/calculator";
import { ScrollArea } from "@/components/ui/scroll-area";

const ICON_MAP: Record<string, string> = {
  Clock: "\u{1F551}",
  Type: "\u{1F4DD}",
  Image: "\u{1F5BC}",
  ListTodo: "\u{2611}",
  Calendar: "\u{1F4C5}",
  Cloud: "\u{2601}",
};

export function WidgetPalette() {
  const { template, addWidget } = useDesignerStore();
  const widgets = getAllWidgets();

  const handleAddWidget = (widgetDef: ReturnType<typeof getAllWidgets>[number]) => {
    const position = findOpenPosition(
      template.grid,
      template.widgets,
      widgetDef.defaultSpan,
    );

    if (!position) {
      alert("No space available on the grid for this widget");
      return;
    }

    addWidget(
      widgetDef.type,
      position,
      widgetDef.defaultSpan,
      widgetDef.defaultConfig as Record<string, unknown>,
      widgetDef.defaultStyle as Record<string, unknown>,
    );
  };

  return (
    <div className="w-56 border-r border-border bg-background shrink-0 flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Widgets
        </h2>
      </div>
      <ScrollArea className="flex-1 px-3 pb-3">
        <div className="space-y-1.5">
          {widgets.map((w) => (
            <button
              key={w.type}
              onClick={() => handleAddWidget(w)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md border border-transparent hover:bg-accent hover:border-border transition-colors text-left group"
            >
              <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">
                {ICON_MAP[w.icon] || "\u{1F4E6}"}
              </span>
              <div>
                <div className="text-sm font-medium">{w.name}</div>
                <div className="text-xs text-muted-foreground">{w.description}</div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function findOpenPosition(
  grid: { columns: number; rows: number },
  existingWidgets: { position: { col: number; row: number }; span: { cols: number; rows: number } }[],
  span: { cols: number; rows: number },
): { col: number; row: number } | null {
  for (let row = 1; row <= grid.rows; row++) {
    for (let col = 1; col <= grid.columns; col++) {
      const candidate = { position: { col, row }, span };

      if (!widgetFitsGrid({ col, row }, span, grid as { columns: number; rows: number; gap: number; padding: { top: number; right: number; bottom: number; left: number } })) {
        continue;
      }

      const overlaps = existingWidgets.some((w) =>
        widgetsOverlap(candidate, { position: w.position, span: w.span }),
      );

      if (!overlaps) {
        return { col, row };
      }
    }
  }
  return null;
}
