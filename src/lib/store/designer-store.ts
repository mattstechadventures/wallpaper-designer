"use client";

import { create } from "zustand";
import type { WallpaperTemplate, Widget } from "@/lib/schema/template";
import { createDefaultTemplate } from "@/lib/schema/defaults";
import { v4 as uuid } from "uuid";

interface DesignerState {
  template: WallpaperTemplate;
  selectedWidgetId: string | null;
  isDirty: boolean;
  isRendering: boolean;
  lastRenderUrl: string | null;

  // Actions
  setTemplate: (template: WallpaperTemplate) => void;
  selectWidget: (id: string | null) => void;
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
  isDirty: false,
  isRendering: false,
  lastRenderUrl: null,

  setTemplate: (template) => set({ template, isDirty: false }),

  selectWidget: (id) => set({ selectedWidgetId: id }),

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
