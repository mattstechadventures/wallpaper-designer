"use client";

import { getAllWidgets } from "@/lib/widgets/registry";
import { useDesignerStore } from "@/lib/store/designer-store";
import { widgetFitsGrid, widgetsOverlap } from "@/lib/grid/calculator";

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
    // Find first available position on the grid
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
    <div className="w-56 border-r border-gray-800 bg-gray-950 p-4 shrink-0 overflow-y-auto">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Widgets
      </h2>
      <div className="space-y-2">
        {widgets.map((w) => (
          <button
            key={w.type}
            onClick={() => handleAddWidget(w)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors text-left"
          >
            <span className="text-lg">{ICON_MAP[w.icon] || "\u{1F4E6}"}</span>
            <div>
              <div className="text-sm font-medium">{w.name}</div>
              <div className="text-xs text-gray-500">{w.description}</div>
            </div>
          </button>
        ))}
      </div>
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
