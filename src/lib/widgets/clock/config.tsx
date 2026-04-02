"use client";

import type { WidgetConfigProps } from "../types";
import type { ClockConfig } from "./index";

export const ClockConfigPanel: React.FC<WidgetConfigProps<ClockConfig>> = ({
  config,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Time Format
        </label>
        <select
          value={config.format}
          onChange={(e) => onChange({ ...config, format: e.target.value as ClockConfig["format"] })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        >
          <option value="HH:mm">24-hour (14:30)</option>
          <option value="h:mm a">12-hour (2:30 PM)</option>
          <option value="HH:mm:ss">24-hour with seconds</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showDate"
          checked={config.showDate}
          onChange={(e) => onChange({ ...config, showDate: e.target.checked })}
          className="rounded bg-gray-800 border-gray-700"
        />
        <label htmlFor="showDate" className="text-sm text-gray-300">
          Show date
        </label>
      </div>

      {config.showDate && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Date Format
          </label>
          <select
            value={config.dateFormat}
            onChange={(e) => onChange({ ...config, dateFormat: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
          >
            <option value="dddd, D MMMM">Wednesday, 2 April</option>
            <option value="D MMMM YYYY">2 April 2026</option>
          </select>
        </div>
      )}
    </div>
  );
};
