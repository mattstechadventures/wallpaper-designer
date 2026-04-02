"use client";

import { create } from "zustand";
import type { WallpaperTemplate, Widget } from "@/lib/schema/template";
import { createDefaultTemplate } from "@/lib/schema/defaults";
import { v4 as uuid } from "uuid";

export type CanvasTool = "select" | "marquee";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.15;

interface DesignerState {
  template: WallpaperTemplate;
  selectedWidgetId: string | null;
  selectedWidgetIds: string[];
  activeTool: CanvasTool;
  zoom: number;
  isDirty: boolean;
  inspectorLocked: boolean;
  isRendering: boolean;
  lastRenderUrl: string | null;

  // Actions
  setInspectorLocked: (locked: boolean) => void;
  setTemplate: (template: WallpaperTemplate) => void;
  selectWidget: (id: string | null) => void;
  toggleWidgetSelection: (id: string) => void;
  selectWidgets: (ids: string[]) => void;
  clearSelection: () => void;
  setActiveTool: (tool: CanvasTool) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomTo: (level: number) => void;
  zoomToFit: () => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  addWidget: (type: string, position: { col: number; row: number }, span: { cols: number; rows: number }, config: Record<string, unknown>, style: Widget["style"]) => void;
  removeWidget: (id: string) => void;
  moveWidget: (id: string, position: { col: number; row: number }) => void;
  resizeWidget: (id: string, span: { cols: number; rows: number }) => void;
  updateCanvas: (updates: Partial<WallpaperTemplate["canvas"]>) => void;
  updateGrid: (updates: Partial<WallpaperTemplate["grid"]>) => void;
  setRendering: (rendering: boolean) => void;
  setLastRenderUrl: (url: string | null) => void;
  save: () => Promise<void>;
  render: () => Promise<void>;
}

export const useDesignerStore = create<DesignerState>((set, get) => ({
  template: createDefaultTemplate(),
  selectedWidgetId: null,
  selectedWidgetIds: [],
  activeTool: "select",
  zoom: 1,
  isDirty: false,
  inspectorLocked: false,
  isRendering: false,
  lastRenderUrl: null,

  setInspectorLocked: (locked) => set({ inspectorLocked: locked }),

  setTemplate: (template) => set({ template, isDirty: false }),

  selectWidget: (id) =>
    set({
      selectedWidgetId: id,
      selectedWidgetIds: id ? [id] : [],
    }),

  toggleWidgetSelection: (id) =>
    set((state) => {
      const ids = state.selectedWidgetIds.includes(id)
        ? state.selectedWidgetIds.filter((i) => i !== id)
        : [...state.selectedWidgetIds, id];
      return {
        selectedWidgetIds: ids,
        selectedWidgetId: ids.length === 1 ? ids[0] : null,
      };
    }),

  selectWidgets: (ids) =>
    set({
      selectedWidgetIds: ids,
      selectedWidgetId: ids.length === 1 ? ids[0] : null,
    }),

  clearSelection: () =>
    set({ selectedWidgetId: null, selectedWidgetIds: [] }),

  setActiveTool: (tool) => set({ activeTool: tool }),

  zoomIn: () =>
    set((state) => ({ zoom: Math.min(MAX_ZOOM, state.zoom + ZOOM_STEP) })),

  zoomOut: () =>
    set((state) => ({ zoom: Math.max(MIN_ZOOM, state.zoom - ZOOM_STEP) })),

  zoomTo: (level) =>
    set({ zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level)) }),

  zoomToFit: () => set({ zoom: 1 }),

  updateWidget: (id, updates) =>
    set((state) => ({
      template: {
        ...state.template,
        widgets: state.template.widgets.map((w) =>
          w.id === id ? { ...w, ...updates } : w,
        ),
      },
      isDirty: true,
    })),

  addWidget: (type, position, span, config, style) =>
    set((state) => ({
      template: {
        ...state.template,
        widgets: [
          ...state.template.widgets,
          {
            id: uuid(),
            type,
            position,
            span,
            config,
            style,
          },
        ],
      },
      isDirty: true,
    })),

  removeWidget: (id) =>
    set((state) => ({
      template: {
        ...state.template,
        widgets: state.template.widgets.filter((w) => w.id !== id),
      },
      selectedWidgetId:
        state.selectedWidgetId === id ? null : state.selectedWidgetId,
      isDirty: true,
    })),

  moveWidget: (id, position) =>
    set((state) => ({
      template: {
        ...state.template,
        widgets: state.template.widgets.map((w) =>
          w.id === id ? { ...w, position } : w,
        ),
      },
      isDirty: true,
    })),

  resizeWidget: (id, span) =>
    set((state) => ({
      template: {
        ...state.template,
        widgets: state.template.widgets.map((w) =>
          w.id === id ? { ...w, span } : w,
        ),
      },
      isDirty: true,
    })),

  updateCanvas: (updates) =>
    set((state) => ({
      template: {
        ...state.template,
        canvas: { ...state.template.canvas, ...updates },
      },
      isDirty: true,
    })),

  updateGrid: (updates) =>
    set((state) => ({
      template: {
        ...state.template,
        grid: { ...state.template.grid, ...updates },
      },
      isDirty: true,
    })),

  setRendering: (isRendering) => set({ isRendering }),

  setLastRenderUrl: (url) => set({ lastRenderUrl: url }),

  save: async () => {
    const { template } = get();
    const response = await fetch("/api/template", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(template),
    });
    if (response.ok) {
      set({ isDirty: false });
    }
  },

  render: async () => {
    const state = get();
    if (state.isDirty) {
      await state.save();
    }
    set({ isRendering: true });
    try {
      const response = await fetch("/api/render", { method: "POST" });
      if (response.ok) {
        set({ lastRenderUrl: `/api/wallpaper/latest?t=${Date.now()}` });
      }
    } finally {
      set({ isRendering: false });
    }
  },
}));
