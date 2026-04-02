"use client";

import type { WidgetConfigProps } from "../types";
import type { StickyNoteConfig } from "./index";

export const StickyNoteConfigPanel: React.FC<WidgetConfigProps<StickyNoteConfig>> = ({
  config,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Content
        </label>
        <textarea
          value={config.content}
          onChange={(e) => onChange({ ...config, content: e.target.value })}
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Note Color
        </label>
        <select
          value={config.noteColor}
          onChange={(e) =>
            onChange({
              ...config,
              noteColor: e.target.value as StickyNoteConfig["noteColor"],
            })
          }
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        >
          <option value="yellow">Yellow</option>
          <option value="pink">Pink</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
        </select>
      </div>
    </div>
  );
};
