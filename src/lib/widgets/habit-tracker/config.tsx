"use client";

import type { WidgetConfigProps } from "../types";
import type { HabitTrackerConfig } from "./index";

export const HabitTrackerConfigPanel: React.FC<WidgetConfigProps<HabitTrackerConfig>> = ({
  config,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Habit Name
        </label>
        <input
          type="text"
          value={config.habitName}
          onChange={(e) => onChange({ ...config, habitName: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Weeks (1-12)
        </label>
        <input
          type="number"
          min={1}
          max={12}
          value={config.weeks}
          onChange={(e) =>
            onChange({
              ...config,
              weeks: Math.min(12, Math.max(1, Number(e.target.value))),
            })
          }
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Active Color
        </label>
        <input
          type="text"
          value={config.activeColor}
          onChange={(e) => onChange({ ...config, activeColor: e.target.value })}
          placeholder="#4ade80"
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>
    </div>
  );
};
