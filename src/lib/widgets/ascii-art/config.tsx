"use client";

import type { WidgetConfigProps } from "../types";
import type { AsciiArtConfig } from "./index";

const PRESET_OPTIONS = [
  { value: "mountains", label: "Mountains" },
  { value: "wave", label: "Wave" },
  { value: "coffee", label: "Coffee" },
  { value: "rocket", label: "Rocket" },
  { value: "cat", label: "Cat" },
  { value: "tree", label: "Tree" },
  { value: "heart", label: "Heart" },
  { value: "star", label: "Star" },
  { value: "custom", label: "Custom" },
];

export const AsciiArtConfigPanel: React.FC<WidgetConfigProps<AsciiArtConfig>> = ({
  config,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Art Preset
        </label>
        <select
          value={config.art}
          onChange={(e) => onChange({ ...config, art: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        >
          {PRESET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {config.art === "custom" && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Custom ASCII Art
          </label>
          <textarea
            value={config.customArt}
            onChange={(e) => onChange({ ...config, customArt: e.target.value })}
            rows={8}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm font-mono resize-none"
            placeholder="Enter your ASCII art here..."
          />
        </div>
      )}
    </div>
  );
};
