"use client";

import type { WidgetConfigProps } from "../types";
import type { DayProgressConfig } from "./index";

export const DayProgressConfigPanel: React.FC<WidgetConfigProps<DayProgressConfig>> = ({
  config,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showDay"
          checked={config.showDay}
          onChange={(e) => onChange({ ...config, showDay: e.target.checked })}
          className="rounded bg-gray-800 border-gray-700"
        />
        <label htmlFor="showDay" className="text-sm text-gray-300">
          Show day progress
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showWeek"
          checked={config.showWeek}
          onChange={(e) => onChange({ ...config, showWeek: e.target.checked })}
          className="rounded bg-gray-800 border-gray-700"
        />
        <label htmlFor="showWeek" className="text-sm text-gray-300">
          Show week progress
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showMonth"
          checked={config.showMonth}
          onChange={(e) => onChange({ ...config, showMonth: e.target.checked })}
          className="rounded bg-gray-800 border-gray-700"
        />
        <label htmlFor="showMonth" className="text-sm text-gray-300">
          Show month progress
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showYear"
          checked={config.showYear}
          onChange={(e) => onChange({ ...config, showYear: e.target.checked })}
          className="rounded bg-gray-800 border-gray-700"
        />
        <label htmlFor="showYear" className="text-sm text-gray-300">
          Show year progress
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Bar Color
        </label>
        <input
          type="text"
          value={config.barColor}
          onChange={(e) => onChange({ ...config, barColor: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
          placeholder="#818cf8"
        />
      </div>
    </div>
  );
};
