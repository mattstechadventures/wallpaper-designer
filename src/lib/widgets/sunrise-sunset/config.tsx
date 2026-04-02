"use client";

import type { WidgetConfigProps } from "../types";
import type { SunriseSunsetConfig } from "./index";

export const SunriseSunsetConfigPanel: React.FC<WidgetConfigProps<SunriseSunsetConfig>> = ({
  config,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Location Name
        </label>
        <input
          type="text"
          value={config.locationName}
          onChange={(e) => onChange({ ...config, locationName: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Latitude
        </label>
        <input
          type="number"
          min={-90}
          max={90}
          step={0.0001}
          value={config.latitude}
          onChange={(e) => onChange({ ...config, latitude: parseFloat(e.target.value) || 0 })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Longitude
        </label>
        <input
          type="number"
          min={-180}
          max={180}
          step={0.0001}
          value={config.longitude}
          onChange={(e) => onChange({ ...config, longitude: parseFloat(e.target.value) || 0 })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>
    </div>
  );
};
