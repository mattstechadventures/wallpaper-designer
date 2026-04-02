"use client";

import type { WidgetConfigProps } from "../types";
import type { PomodoroConfig } from "./index";

export const PomodoroConfigPanel: React.FC<WidgetConfigProps<PomodoroConfig>> = ({
  config,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Focus Minutes
        </label>
        <input
          type="number"
          min={1}
          max={120}
          value={config.focusMinutes}
          onChange={(e) =>
            onChange({ ...config, focusMinutes: Number(e.target.value) })
          }
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Break Minutes
        </label>
        <input
          type="number"
          min={1}
          max={60}
          value={config.breakMinutes}
          onChange={(e) =>
            onChange({ ...config, breakMinutes: Number(e.target.value) })
          }
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Sessions
        </label>
        <input
          type="number"
          min={1}
          max={12}
          value={config.sessions}
          onChange={(e) =>
            onChange({ ...config, sessions: Number(e.target.value) })
          }
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>
    </div>
  );
};
