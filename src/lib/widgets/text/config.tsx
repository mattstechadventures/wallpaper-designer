"use client";

import type { WidgetConfigProps } from "../types";
import type { TextConfig } from "./index";

export const TextConfigPanel: React.FC<WidgetConfigProps<TextConfig>> = ({
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
    </div>
  );
};
