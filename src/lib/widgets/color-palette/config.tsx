"use client";

import type { WidgetConfigProps } from "../types";
import type { ColorPaletteConfig } from "./index";

export const ColorPaletteConfigPanel: React.FC<WidgetConfigProps<ColorPaletteConfig>> = ({
  config,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Number of Colors
        </label>
        <input
          type="number"
          min={3}
          max={8}
          value={config.colors}
          onChange={(e) =>
            onChange({
              ...config,
              colors: Math.min(8, Math.max(3, parseInt(e.target.value) || 5)),
            })
          }
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Seed
        </label>
        <input
          type="text"
          value={config.seed}
          onChange={(e) => onChange({ ...config, seed: e.target.value || "auto" })}
          placeholder="auto"
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use &quot;auto&quot; for daily rotation or enter a custom seed.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showHex"
          checked={config.showHex}
          onChange={(e) => onChange({ ...config, showHex: e.target.checked })}
          className="rounded bg-gray-800 border-gray-700"
        />
        <label htmlFor="showHex" className="text-sm text-gray-300">
          Show hex codes
        </label>
      </div>
    </div>
  );
};
