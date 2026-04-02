"use client";

import type { WidgetConfigProps } from "../types";
import type { QuoteConfig } from "./index";

export const QuoteConfigPanel: React.FC<WidgetConfigProps<QuoteConfig>> = ({
  config,
  onChange,
}) => {
  const quotesText = (config.quotes || []).join("\n");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Quotes (one per line)
        </label>
        <textarea
          value={quotesText}
          onChange={(e) => {
            const quotes = e.target.value
              .split("\n")
              .filter((line) => line.trim().length > 0);
            onChange({ ...config, quotes });
          }}
          rows={6}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showAttribution"
          checked={config.showAttribution}
          onChange={(e) =>
            onChange({ ...config, showAttribution: e.target.checked })
          }
          className="rounded bg-gray-800 border-gray-700"
        />
        <label htmlFor="showAttribution" className="text-sm text-gray-300">
          Show attribution
        </label>
      </div>
    </div>
  );
};
