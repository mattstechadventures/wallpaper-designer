"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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

const BASE_SCALE = 0.35;

type DragMode = "move" | "resize";

interface DragState {
  widgetId: string;
  mode: DragMode;
  offsetX: number;
  offsetY: number;
  originalSpan: GridSpan;
  originalPosition: GridPosition;
  previewPosition: GridPosition;
  previewSpan: GridSpan;
  isValid: boolean;
}

interface MarqueeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export function Canvas() {
  const {
    template,
    selectedWidgetId,
    selectedWidgetIds,
    activeTool,
    zoom,
    selectWidget,
    toggleWidgetSelection,
    selectWidgets,
    clearSelection,
    moveWidget,
    resizeWidget,
    zoomIn,
    zoomOut,
  } = useDesignerStore();
  const { canvas, grid, widgets } = template;
  const metrics = calculateGridMetrics(canvas, grid);

  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [marquee, setMarquee] = useState<MarqueeState | null>(null);

  const scale = BASE_SCALE * zoom;
  const previewWidth = canvas.width * scale;
  const previewHeight = canvas.height * scale;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") return;
      const { setActiveTool, zoomToFit } = useDesignerStore.getState();

      switch (e.key.toLowerCase()) {
        case "v":
          setActiveTool("select");
          break;
        case "m":
          setActiveTool("marquee");
          break;
        case "=":
        case "+":
          e.preventDefault();
          zoomIn();
          break;
        case "-":
          e.preventDefault();
          zoomOut();
          break;
        case "0":
          e.preventDefault();
          zoomToFit();
          break;
        case "escape":
          clearSelection();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [clearSelection, zoomIn, zoomOut]);

  // Scroll wheel zoom
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const { zoomTo, zoom: currentZoom } = useDesignerStore.getState();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        zoomTo(currentZoom + delta);
      }
    };
    viewport.addEventListener("wheel", handler, { passive: false });
    return () => viewport.removeEventListener("wheel", handler);
  }, []);

  const getCanvasCoords = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale,
      };
    },
    [scale],
  );

  // Get viewport-relative coords for marquee drawing
  const getViewportCoords = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [],
  );

  const checkValidity = useCallback(
    (widgetId: string, position: GridPosition, span: GridSpan): boolean => {
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
      if (activeTool === "marquee") return; // Don't start widget drag in marquee mode
      e.stopPropagation();
      e.preventDefault();

      const widget = widgets.find((w) => w.id === widgetId);
      if (!widget) return;

      // Shift-click toggles multi-select
      if (e.shiftKey) {
        toggleWidgetSelection(widgetId);
        return;
      }

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
    [activeTool, widgets, grid, metrics, getCanvasCoords, selectWidget, toggleWidgetSelection],
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

  // Marquee start
  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      if (e.target !== e.currentTarget && activeTool !== "marquee") return;

      if (activeTool === "marquee") {
        e.preventDefault();
        const coords = getViewportCoords(e);
        setMarquee({
          startX: coords.x,
          startY: coords.y,
          currentX: coords.x,
          currentY: coords.y,
        });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } else if (e.target === e.currentTarget) {
        clearSelection();
      }
    },
    [activeTool, getViewportCoords, clearSelection],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Marquee drag
      if (marquee) {
        const coords = getViewportCoords(e);
        setMarquee((prev) =>
          prev ? { ...prev, currentX: coords.x, currentY: coords.y } : null,
        );
        return;
      }

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
          prev ? { ...prev, previewPosition: position, isValid } : null,
        );
      } else {
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
          prev ? { ...prev, previewSpan: span, isValid } : null,
        );
      }
    },
    [drag, marquee, widgets, grid, metrics, getCanvasCoords, getViewportCoords, checkValidity],
  );

  const handlePointerUp = useCallback(() => {
    // Marquee end — compute which widgets fall within the rectangle
    if (marquee) {
      const canvasEl = containerRef.current;
      if (canvasEl) {
        const canvasRect = canvasEl.getBoundingClientRect();
        const viewportEl = viewportRef.current;
        const viewportRect = viewportEl?.getBoundingClientRect();
        if (viewportRect) {
          // Convert marquee viewport coords to canvas-relative pixel coords
          const mLeft = Math.min(marquee.startX, marquee.currentX);
          const mTop = Math.min(marquee.startY, marquee.currentY);
          const mRight = Math.max(marquee.startX, marquee.currentX);
          const mBottom = Math.max(marquee.startY, marquee.currentY);

          // Marquee coords are relative to viewport; canvas position within viewport
          const canvasOffsetX = canvasRect.left - viewportRect.left;
          const canvasOffsetY = canvasRect.top - viewportRect.top;

          const selected = widgets.filter((widget) => {
            const rect = resolveWidgetRect(widget.position, widget.span, grid, metrics);
            const wx = rect.x * scale + canvasOffsetX;
            const wy = rect.y * scale + canvasOffsetY;
            const wRight = wx + rect.width * scale;
            const wBottom = wy + rect.height * scale;

            // Check intersection
            return wx < mRight && wRight > mLeft && wy < mBottom && wBottom > mTop;
          });

          if (selected.length > 0) {
            selectWidgets(selected.map((w) => w.id));
          } else {
            clearSelection();
          }
        }
      }
      setMarquee(null);
      return;
    }

    if (!drag) return;

    if (drag.isValid) {
      if (drag.mode === "move") {
        moveWidget(drag.widgetId, drag.previewPosition);
      } else {
        resizeWidget(drag.widgetId, drag.previewSpan);
      }
    }

    setDrag(null);
  }, [drag, marquee, widgets, grid, metrics, scale, moveWidget, resizeWidget, selectWidgets, clearSelection]);

  // Compute marquee rect for rendering
  const marqueeRect = marquee
    ? {
        left: Math.min(marquee.startX, marquee.currentX),
        top: Math.min(marquee.startY, marquee.currentY),
        width: Math.abs(marquee.currentX - marquee.startX),
        height: Math.abs(marquee.currentY - marquee.startY),
      }
    : null;

  return (
    <div
      ref={viewportRef}
      className="relative w-full h-full overflow-auto"
      style={{
        cursor: activeTool === "marquee" ? "crosshair" : undefined,
      }}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => {
        if (e.target === e.currentTarget && !drag && activeTool === "select") {
          clearSelection();
        }
      }}
    >
      <div
        className="min-w-full min-h-full flex items-center justify-center p-8"
        onClick={(e) => {
          if (e.target === e.currentTarget && !drag && activeTool === "select") {
            clearSelection();
          }
        }}
      >
        <div
          ref={containerRef}
          className="relative rounded-lg overflow-hidden shadow-2xl select-none font-sans shrink-0"
          style={{
            width: previewWidth,
            height: previewHeight,
            ...backgroundToPreviewStyle(canvas.background),
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !drag && activeTool === "select") {
              clearSelection();
            }
          }}
        >
          {/* Grid overlay */}
          <GridOverlay grid={grid} metrics={metrics} scale={scale} />

          {/* Widgets */}
          {widgets.map((widget) => {
            const isDragging = drag?.widgetId === widget.id;

            const position = isDragging && drag.mode === "move"
              ? drag.previewPosition
              : widget.position;
            const span = isDragging && drag.mode === "resize"
              ? drag.previewSpan
              : widget.span;

            const rect = resolveWidgetRect(position, span, grid, metrics);
            const isSelected = widget.id === selectedWidgetId;
            const isMultiSelected = selectedWidgetIds.includes(widget.id);
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
                    : isMultiSelected && !isSelected && !isDragging
                    ? "ring-2 ring-indigo-400/60 ring-offset-1 ring-offset-transparent"
                    : ""
                } ${
                  isDragging
                    ? isInvalid
                      ? "ring-2 ring-red-500 ring-offset-1 ring-offset-transparent"
                      : "ring-2 ring-indigo-400 ring-offset-1 ring-offset-transparent"
                    : !isSelected && !isMultiSelected
                    ? "hover:ring-1 hover:ring-white/20"
                    : ""
                }`}
                style={{
                  left: rect.x * scale,
                  top: rect.y * scale,
                  width: rect.width * scale,
                  height: rect.height * scale,
                  borderRadius: (widget.style.borderRadius || 0) * scale,
                  opacity: isInvalid ? 0.5 : 1,
                  cursor: activeTool === "marquee"
                    ? "crosshair"
                    : isDragging
                    ? "grabbing"
                    : "grab",
                  transition: isDragging ? "none" : undefined,
                }}
                onPointerDown={(e) => handleWidgetPointerDown(e, widget.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!drag && activeTool === "select") {
                    if (e.shiftKey) {
                      toggleWidgetSelection(widget.id);
                    } else {
                      selectWidget(widget.id);
                    }
                  }
                }}
              >
                {/* Scaled-down widget preview */}
                <div
                  className="pointer-events-none"
                  style={{
                    width: rect.width,
                    height: rect.height,
                    transform: `scale(${scale})`,
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
      </div>

      {/* Marquee selection rectangle */}
      {marqueeRect && (
        <div
          className="absolute border border-indigo-400 bg-indigo-400/10 pointer-events-none z-[100]"
          style={{
            left: marqueeRect.left,
            top: marqueeRect.top,
            width: marqueeRect.width,
            height: marqueeRect.height,
          }}
        />
      )}
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
