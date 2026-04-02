"use client";

import { useDesignerStore } from "@/lib/store/designer-store";
import { getWidget } from "@/lib/widgets/registry";
import { AVAILABLE_FONTS } from "@/lib/fonts/registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WidgetInspector() {
  const { template, selectedWidgetId, updateWidget, removeWidget, selectWidget } =
    useDesignerStore();

  const widget = template.widgets.find((w) => w.id === selectedWidgetId);
  if (!widget) return null;

  const widgetDef = getWidget(widget.type);
  if (!widgetDef) return null;

  const ConfigComponent = widgetDef.configComponent;

  return (
    <div className="w-72 border-l border-border bg-background shrink-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold">{widgetDef.name}</h2>
        <Button variant="ghost" size="xs" onClick={() => selectWidget(null)}>
          Done
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Position & Size */}
          <Section title="Position">
            <div className="grid grid-cols-2 gap-3">
              <NumberField
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
              <NumberField
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
              <NumberField
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
              <NumberField
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
              <ColorField
                label="Text Color"
                value={widget.style.color || "#ffffff"}
                onChange={(color) =>
                  updateWidget(widget.id, {
                    style: { ...widget.style, color },
                  })
                }
              />
              <ColorField
                label="Background"
                value={widget.style.background || "transparent"}
                onChange={(background) =>
                  updateWidget(widget.id, {
                    style: { ...widget.style, background },
                  })
                }
              />
              <FontField
                label="Font"
                value={widget.style.fontFamily || "Inter"}
                onChange={(fontFamily) =>
                  updateWidget(widget.id, {
                    style: { ...widget.style, fontFamily },
                  })
                }
              />
              <NumberField
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
              <NumberField
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
              <NumberField
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
          <Separator />
          <Button
            variant="destructive"
            className="w-full"
            size="sm"
            onClick={() => removeWidget(widget.id)}
          >
            Remove Widget
          </Button>
        </div>
      </ScrollArea>
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
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
        {title}
      </h3>
      {children}
    </div>
  );
}

function NumberField({
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
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isHex = value.startsWith("#");

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={isHex ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="w-8 h-8 rounded-md border border-border"
            style={{
              backgroundColor: value === "transparent" ? "transparent" : value,
              backgroundImage:
                value === "transparent"
                  ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                  : undefined,
              backgroundSize: value === "transparent" ? "8px 8px" : undefined,
              backgroundPosition:
                value === "transparent" ? "0 0, 0 4px, 4px -4px, -4px 0px" : undefined,
            }}
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          placeholder="transparent, rgba(), or #hex"
        />
      </div>
    </div>
  );
}

const fontsByCategory = AVAILABLE_FONTS.reduce(
  (acc, font) => {
    if (!acc[font.category]) acc[font.category] = [];
    acc[font.category].push(font);
    return acc;
  },
  {} as Record<string, typeof AVAILABLE_FONTS>,
);

const categoryLabels: Record<string, string> = {
  "sans-serif": "Sans Serif",
  serif: "Serif",
  monospace: "Monospace",
  display: "Display",
  handwriting: "Handwriting",
};

function FontField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={(v) => { if (v) onChange(v); }}>
        <SelectTrigger className="w-full">
          <SelectValue>{value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(fontsByCategory).map(([category, fonts]) => (
            <SelectGroup key={category}>
              <SelectLabel>{categoryLabels[category] || category}</SelectLabel>
              {fonts.map((font) => (
                <SelectItem key={font.name} value={font.name}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
