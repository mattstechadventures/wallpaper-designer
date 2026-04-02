"use client";

import { useDesignerStore } from "@/lib/store/designer-store";
import { calculateGridMetrics, resolveWidgetRect } from "@/lib/grid/calculator";
import { getWidget } from "@/lib/widgets/registry";

const PREVIEW_SCALE = 0.35; // Scale down for the designer viewport

export function Canvas() {
  const { template, selectedWidgetId, selectWidget } = useDesignerStore();
  const { canvas, grid, widgets } = template;
  const metrics = calculateGridMetrics(canvas, grid);

  const previewWidth = canvas.width * PREVIEW_SCALE;
  const previewHeight = canvas.height * PREVIEW_SCALE;

  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-2xl"
      style={{
        width: previewWidth,
        height: previewHeight,
        ...backgroundToPreviewStyle(canvas.background),
      }}
      onClick={(e) => {
        // Deselect when clicking empty space
        if (e.target === e.currentTarget) {
          selectWidget(null);
        }
      }}
    >
      {/* Grid overlay */}
      <GridOverlay
        grid={grid}
        metrics={metrics}
        scale={PREVIEW_SCALE}
      />

      {/* Widgets */}
      {widgets.map((widget) => {
        const rect = resolveWidgetRect(widget.position, widget.span, grid, metrics);
        const isSelected = widget.id === selectedWidgetId;
        const widgetDef = getWidget(widget.type);

        return (
          <div
            key={widget.id}
            className={`absolute cursor-pointer transition-all ${
              isSelected
                ? "ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent"
                : "hover:ring-1 hover:ring-white/20"
            }`}
            style={{
              left: rect.x * PREVIEW_SCALE,
              top: rect.y * PREVIEW_SCALE,
              width: rect.width * PREVIEW_SCALE,
              height: rect.height * PREVIEW_SCALE,
              borderRadius: (widget.style.borderRadius || 0) * PREVIEW_SCALE,
            }}
            onClick={(e) => {
              e.stopPropagation();
              selectWidget(widget.id);
            }}
          >
            {/* Scaled-down widget preview */}
            <div
              style={{
                width: rect.width,
                height: rect.height,
                transform: `scale(${PREVIEW_SCALE})`,
                transformOrigin: "top left",
              }}
            >
              {widgetDef ? (
                <widgetDef.renderComponent
                  config={widget.config}
                  data={null}
                  style={widget.style}
                  size={{ width: rect.width, height: rect.height }}
                />
              ) : (
                <div className="w-full h-full bg-red-500/20 flex items-center justify-center text-red-300 text-sm">
                  Unknown: {widget.type}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GridOverlay({
  grid,
  metrics,
  scale,
}: {
  grid: typeof useDesignerStore.getState extends () => infer S
    ? S extends { template: infer T }
      ? T extends { grid: infer G }
        ? G
        : never
      : never
    : never;
  metrics: ReturnType<typeof calculateGridMetrics>;
  scale: number;
}) {
  const cells = [];
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.columns; col++) {
      const x = (grid.padding.left + col * (metrics.cellWidth + grid.gap)) * scale;
      const y = (grid.padding.top + row * (metrics.cellHeight + grid.gap)) * scale;
      const w = metrics.cellWidth * scale;
      const h = metrics.cellHeight * scale;

      cells.push(
        <div
          key={`${row}-${col}`}
          className="absolute border border-white/5 rounded"
          style={{ left: x, top: y, width: w, height: h }}
        />,
      );
    }
  }

  return <>{cells}</>;
}

function backgroundToPreviewStyle(
  bg: typeof useDesignerStore.getState extends () => infer S
    ? S extends { template: infer T }
      ? T extends { canvas: infer C }
        ? C extends { background: infer B }
          ? B
          : never
        : never
      : never
    : never,
): React.CSSProperties {
  if (bg.type === "solid") {
    return { backgroundColor: bg.value as string };
  }
  if (bg.type === "gradient") {
    const g = bg.value as { angle: number; stops: { color: string; position: number }[] };
    const stops = g.stops.map((s) => `${s.color} ${s.position}%`).join(", ");
    return { background: `linear-gradient(${g.angle}deg, ${stops})` };
  }
  if (bg.type === "image") {
    const img = bg.value as { src: string; fit: string; opacity?: number };
    return {
      backgroundImage: `url(${img.src})`,
      backgroundSize: img.fit,
      backgroundPosition: "center",
      opacity: img.opacity ?? 1,
    };
  }
  return {};
}
