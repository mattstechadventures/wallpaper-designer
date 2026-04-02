"use client";

import type { WidgetConfigProps } from "../types";
import type { WorldClockConfig } from "./index";

export const WorldClockConfigPanel: React.FC<WidgetConfigProps<WorldClockConfig>> = ({
  config,
  onChange,
}) => {
  const updateTimezone = (index: number, field: "label" | "offset", value: string | number) => {
    const updated = config.timezones.map((tz, i) =>
      i === index ? { ...tz, [field]: value } : tz,
    );
    onChange({ ...config, timezones: updated });
  };

  const removeTimezone = (index: number) => {
    onChange({ ...config, timezones: config.timezones.filter((_, i) => i !== index) });
  };

  const addTimezone = () => {
    onChange({
      ...config,
      timezones: [...config.timezones, { label: "UTC", offset: 0 }],
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Time Format
        </label>
        <select
          value={config.format}
          onChange={(e) => onChange({ ...config, format: e.target.value as WorldClockConfig["format"] })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        >
          <option value="HH:mm">24-hour (14:30)</option>
          <option value="h:mm a">12-hour (2:30 PM)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Timezones
        </label>
        <div className="space-y-2">
          {config.timezones.map((tz, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={tz.label}
                onChange={(e) => updateTimezone(i, "label", e.target.value)}
                placeholder="Label"
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              />
              <input
                type="number"
                value={tz.offset}
                onChange={(e) => updateTimezone(i, "offset", parseFloat(e.target.value) || 0)}
                step="0.5"
                className="w-20 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              />
              <button
                type="button"
                onClick={() => removeTimezone(i)}
                className="px-2 py-2 text-gray-400 hover:text-red-400 text-sm"
                title="Remove timezone"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={addTimezone}
        className="w-full bg-gray-800 border border-gray-700 border-dashed rounded px-3 py-2 text-gray-400 hover:text-white text-sm"
      >
        + Add Timezone
      </button>
    </div>
  );
};
