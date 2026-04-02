"use client";

import { useRef, useState, useCallback } from "react";
import { useDesignerStore } from "@/lib/store/designer-store";
import {
  calculateGridMetrics,
  resolveWidgetRect,
  snapToGrid,
  snapToSpan,
  widgetsOverlap,
  widgetFitsGrid,
} from "@/lib/grid/calculator";
import { getWidget } from "@/lib/widgets/registry";
import type { GridPosition, GridSpan } from "@/lib/schema/template";

const PREVIEW_SCALE = 0.35;

type DragMode = "move" | "resize";

interface DragState {
  widgetId: string;
  mode: DragMode;
  // Offset from pointer to widget top-left (in canvas pixels, unscaled)
  offsetX: number;
  offsetY: number;
  // Original widget state for resize baseline
  originalSpan: GridSpan;
  originalPosition: GridPosition;
  // Current preview (snapped to grid)
  previewPosition: GridPosition;
  previewSpan: GridSpan;
  isValid: boolean;
}

export function Canvas() {
  const { template, selectedWidgetId, selectWidget, moveWidget, resizeWidget } =
    useDesignerStore();
  const { canvas, grid, widgets } = template;
  const metrics = calculateGridMetrics(canvas, grid);

  const containerRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  const previewWidth = canvas.width * PREVIEW_SCALE;
  const previewHeight = canvas.height * PREVIEW_SCALE;

  const getCanvasCoords = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (e.clientX - rect.left) / PREVIEW_SCALE,
        y: (e.clientY - rect.top) / PREVIEW_SCALE,
      };
    },
    [],
  );

  const checkValidity = useCallback(
    (
      widgetId: string,
      position: GridPosition,
      span: GridSpan,
    ): boolean => {
      if (!widgetFitsGrid(position, span, grid)) return false;
      return !widgets.some(
        (w) =>
          w.id !== widgetId &&
          widgetsOverlap(
            { position, span },
            { position: w.position, span: w.span },
          ),
      );
    },
    [grid, widgets],
  );

  const handleWidgetPointerDown = useCallback(
    (e: React.PointerEvent, widgetId: string) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();

      const widget = widgets.find((w) => w.id === widgetId);
      if (!widget) return;

      const coords = getCanvasCoords(e);
      const widgetRect = resolveWidgetRect(widget.position, widget.span, grid, metrics);

      selectWidget(widgetId);

      const state: DragState = {
        widgetId,
        mode: "move",
        offsetX: coords.x - widgetRect.x,
        offsetY: coords.y - widgetRect.y,
        originalSpan: { ...widget.span },
        originalPosition: { ...widget.position },
        previewPosition: { ...widget.position },
        previewSpan: { ...widget.span },
        isValid: true,
      };
      setDrag(state);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [widgets, grid, metrics, getCanvasCoords, selectWidget],
  );

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent, widgetId: string) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();

      const widget = widgets.find((w) => w.id === widgetId);
      if (!widget) return;

      selectWidget(widgetId);

      const state: DragState = {
        widgetId,
        mode: "resize",
        offsetX: 0,
        offsetY: 0,
        originalSpan: { ...widget.span },
        originalPosition: { ...widget.position },
        previewPosition: { ...widget.position },
        previewSpan: { ...widget.span },
        isValid: true,
      };
      setDrag(state);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [widgets, selectWidget],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag) return;

      const coords = getCanvasCoords(e);
      const widget = widgets.find((w) => w.id === drag.widgetId);
      if (!widget) return;

      if (drag.mode === "move") {
        const newPos = snapToGrid(
          coords.x - drag.offsetX,
          coords.y - drag.offsetY,
          grid,
          metrics,
        );
        // Clamp so widget stays in bounds
        const clampedCol = Math.max(
          1,
          Math.min(newPos.col, grid.columns - drag.originalSpan.cols + 1),
        );
        const clampedRow = Math.max(
          1,
          Math.min(newPos.row, grid.rows - drag.originalSpan.rows + 1),
        );
        const position = { col: clampedCol, row: clampedRow };
        const isValid = checkValidity(drag.widgetId, position, drag.originalSpan);

        setDrag((prev) =>
          prev
            ? { ...prev, previewPosition: position, isValid }
            : null,
        );
      } else {
        // Resize: calculate new span from pointer position relative to widget origin
        const widgetRect = resolveWidgetRect(
          drag.originalPosition,
          drag.originalSpan,
          grid,
          metrics,
        );
        const newWidth = coords.x - widgetRect.x;
        const newHeight = coords.y - widgetRect.y;

        const widgetDef = getWidget(widget.type);
        const minCols = widgetDef?.minSpan.cols ?? 1;
        const minRows = widgetDef?.minSpan.rows ?? 1;

        const newSpan = snapToSpan(newWidth, newHeight, metrics, grid, minCols, minRows);
        // Clamp so widget stays in bounds
        const clampedCols = Math.min(
          newSpan.cols,
          grid.columns - drag.originalPosition.col + 1,
        );
        const clampedRows = Math.min(
          newSpan.rows,
          grid.rows - drag.originalPosition.row + 1,
        );
        const span = { cols: clampedCols, rows: clampedRows };
        const isValid = checkValidity(drag.widgetId, drag.originalPosition, span);

        setDrag((prev) =>
          prev
            ? { ...prev, previewSpan: span, isValid }
            : null,
        );
      }
    },
    [drag, widgets, grid, metrics, getCanvasCoords, checkValidity],
  );

  const handlePointerUp = useCallback(() => {
    if (!drag) return;

    if (drag.isValid) {
      if (drag.mode === "move") {
        moveWidget(drag.widgetId, drag.previewPosition);
      } else {
        resizeWidget(drag.widgetId, drag.previewSpan);
      }
    }

    setDrag(null);
  }, [drag, moveWidget, resizeWidget]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-lg overflow-hidden shadow-2xl select-none"
      style={{
        width: previewWidth,
        height: previewHeight,
        ...backgroundToPreviewStyle(canvas.background),
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => {
        if (e.target === e.currentTarget && !drag) {
          selectWidget(null);
        }
      }}
    >
      {/* Grid overlay */}
      <GridOverlay grid={grid} metrics={metrics} scale={PREVIEW_SCALE} />

      {/* Widgets */}
      {widgets.map((widget) => {
        const isDragging = drag?.widgetId === widget.id;

        // Use preview position/span during drag
        const position = isDragging && drag.mode === "move"
          ? drag.previewPosition
          : widget.position;
        const span = isDragging && drag.mode === "resize"
          ? drag.previewSpan
          : widget.span;

        const rect = resolveWidgetRect(position, span, grid, metrics);
        const isSelected = widget.id === selectedWidgetId;
        const widgetDef = getWidget(widget.type);
        const isInvalid = isDragging && !drag.isValid;

        return (
          <div
            key={widget.id}
            className={`absolute transition-shadow ${
              isDragging ? "z-50" : "z-10"
            } ${
              isSelected && !isDragging
                ? "ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent"
                : ""
            } ${
              isDragging
                ? isInvalid
                  ? "ring-2 ring-red-500 ring-offset-1 ring-offset-transparent"
                  : "ring-2 ring-indigo-400 ring-offset-1 ring-offset-transparent"
                : "hover:ring-1 hover:ring-white/20"
            }`}
            style={{
              left: rect.x * PREVIEW_SCALE,
              top: rect.y * PREVIEW_SCALE,
              width: rect.width * PREVIEW_SCALE,
              height: rect.height * PREVIEW_SCALE,
              borderRadius: (widget.style.borderRadius || 0) * PREVIEW_SCALE,
              opacity: isInvalid ? 0.5 : 1,
              cursor: isDragging ? "grabbing" : "grab",
              transition: isDragging ? "none" : undefined,
            }}
            onPointerDown={(e) => handleWidgetPointerDown(e, widget.id)}
            onClick={(e) => {
              e.stopPropagation();
              if (!drag) selectWidget(widget.id);
            }}
          >
            {/* Scaled-down widget preview */}
            <div
              className="pointer-events-none"
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

            {/* Resize handle */}
            {isSelected && !isDragging && (
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50"
                onPointerDown={(e) => handleResizePointerDown(e, widget.id)}
              >
                <svg
                  viewBox="0 0 16 16"
                  className="w-full h-full text-indigo-400"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="7" cy="12" r="1.5" />
                  <circle cx="12" cy="7" r="1.5" />
                </svg>
              </div>
            )}

            {/* Resize handle during resize drag */}
            {isDragging && drag.mode === "resize" && (
              <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50">
                <svg
                  viewBox="0 0 16 16"
                  className="w-full h-full text-indigo-400"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="7" cy="12" r="1.5" />
                  <circle cx="12" cy="7" r="1.5" />
                </svg>
              </div>
            )}
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
  grid: { columns: number; rows: number; gap: number; padding: { top: number; right: number; bottom: number; left: number } };
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
  bg: { type: string; value: unknown },
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
