"use client";

import type { WidgetConfigProps } from "../types";
import type { CountdownConfig } from "./index";

export const CountdownConfigPanel: React.FC<WidgetConfigProps<CountdownConfig>> = ({
  config,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Target Date
        </label>
        <input
          type="date"
          value={config.targetDate}
          onChange={(e) => onChange({ ...config, targetDate: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Label
        </label>
        <input
          type="text"
          value={config.label}
          onChange={(e) => onChange({ ...config, label: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showHours"
          checked={config.showHours}
          onChange={(e) => onChange({ ...config, showHours: e.target.checked })}
          className="rounded bg-gray-800 border-gray-700"
        />
        <label htmlFor="showHours" className="text-sm text-gray-300">
          Show hours
        </label>
      </div>
    </div>
  );
};
