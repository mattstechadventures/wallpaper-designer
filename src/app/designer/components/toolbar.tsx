"use client";

import { useDesignerStore } from "@/lib/store/designer-store";

export function Toolbar() {
  const { isDirty, isRendering, save, render, lastRenderUrl, template } =
    useDesignerStore();

  return (
    <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-950 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Wallpaper Designer</h1>
        <span className="text-sm text-gray-500">{template.name}</span>
        {isDirty && (
          <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
            Unsaved
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={!isDirty}
          className="px-4 py-1.5 text-sm rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
        <button
          onClick={render}
          disabled={isRendering}
          className="px-4 py-1.5 text-sm rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition-colors"
        >
          {isRendering ? "Rendering..." : "Render Wallpaper"}
        </button>
        {lastRenderUrl && (
          <a
            href={lastRenderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            View Latest
          </a>
        )}
      </div>
    </div>
  );
}
