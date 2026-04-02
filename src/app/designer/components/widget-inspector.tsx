"use client";

import { useDesignerStore } from "@/lib/store/designer-store";
import { getWidget } from "@/lib/widgets/registry";

export function WidgetInspector() {
  const { template, selectedWidgetId, updateWidget, removeWidget, selectWidget } =
    useDesignerStore();

  const widget = template.widgets.find((w) => w.id === selectedWidgetId);
  if (!widget) return null;

  const widgetDef = getWidget(widget.type);
  if (!widgetDef) return null;

  const ConfigComponent = widgetDef.configComponent;

  return (
    <div className="w-72 border-l border-gray-800 bg-gray-950 p-4 shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">{widgetDef.name}</h2>
        <button
          onClick={() => selectWidget(null)}
          className="text-gray-500 hover:text-white text-sm"
        >
          Done
        </button>
      </div>

      {/* Position & Size */}
      <Section title="Position">
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="Column"
            value={widget.position.col}
            min={1}
            max={template.grid.columns}
            onChange={(col) =>
              updateWidget(widget.id, {
                position: { ...widget.position, col },
              })
            }
          />
          <NumberInput
            label="Row"
            value={widget.position.row}
            min={1}
            max={template.grid.rows}
            onChange={(row) =>
              updateWidget(widget.id, {
                position: { ...widget.position, row },
              })
            }
          />
          <NumberInput
            label="Width"
            value={widget.span.cols}
            min={widgetDef.minSpan.cols}
            max={template.grid.columns - widget.position.col + 1}
            onChange={(cols) =>
              updateWidget(widget.id, {
                span: { ...widget.span, cols },
              })
            }
          />
          <NumberInput
            label="Height"
            value={widget.span.rows}
            min={widgetDef.minSpan.rows}
            max={template.grid.rows - widget.position.row + 1}
            onChange={(rows) =>
              updateWidget(widget.id, {
                span: { ...widget.span, rows },
              })
            }
          />
        </div>
      </Section>

      {/* Widget-specific config */}
      <Section title="Configuration">
        <ConfigComponent
          config={widget.config as never}
          onChange={(config: Record<string, unknown>) =>
            updateWidget(widget.id, { config })
          }
        />
      </Section>

      {/* Style */}
      <Section title="Style">
        <div className="space-y-3">
          <ColorInput
            label="Text Color"
            value={widget.style.color || "#ffffff"}
            onChange={(color) =>
              updateWidget(widget.id, {
                style: { ...widget.style, color },
              })
            }
          />
          <ColorInput
            label="Background"
            value={widget.style.background || "transparent"}
            onChange={(background) =>
              updateWidget(widget.id, {
                style: { ...widget.style, background },
              })
            }
          />
          <NumberInput
            label="Font Size"
            value={widget.style.fontSize || 14}
            min={8}
            max={200}
            onChange={(fontSize) =>
              updateWidget(widget.id, {
                style: { ...widget.style, fontSize },
              })
            }
          />
          <NumberInput
            label="Border Radius"
            value={widget.style.borderRadius || 0}
            min={0}
            max={50}
            onChange={(borderRadius) =>
              updateWidget(widget.id, {
                style: { ...widget.style, borderRadius },
              })
            }
          />
          <NumberInput
            label="Opacity"
            value={Math.round((widget.style.opacity ?? 1) * 100)}
            min={0}
            max={100}
            onChange={(v) =>
              updateWidget(widget.id, {
                style: { ...widget.style, opacity: v / 100 },
              })
            }
          />
        </div>
      </Section>

      {/* Delete */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <button
          onClick={() => {
            removeWidget(widget.id);
          }}
          className="w-full px-3 py-2 text-sm text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded transition-colors"
        >
          Remove Widget
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function NumberInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-white"
      />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value.startsWith("#") ? value : "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-700 bg-gray-800 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-white"
        />
      </div>
    </div>
  );
}
