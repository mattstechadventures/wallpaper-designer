"use client";

import type { WidgetConfigProps } from "../types";
import type { MoonPhaseConfig } from "./index";

export const MoonPhaseConfigPanel: React.FC<WidgetConfigProps<MoonPhaseConfig>> = ({
  config,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showName"
          checked={config.showName}
          onChange={(e) => onChange({ ...config, showName: e.target.checked })}
          className="rounded bg-gray-800 border-gray-700"
        />
        <label htmlFor="showName" className="text-sm text-gray-300">
          Show phase name
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showIllumination"
          checked={config.showIllumination}
          onChange={(e) => onChange({ ...config, showIllumination: e.target.checked })}
          className="rounded bg-gray-800 border-gray-700"
        />
        <label htmlFor="showIllumination" className="text-sm text-gray-300">
          Show illumination percentage
        </label>
      </div>
    </div>
  );
};
