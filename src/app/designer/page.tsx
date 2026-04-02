"use client";

import { useEffect, useState } from "react";
import { useDesignerStore } from "@/lib/store/designer-store";
import { Canvas } from "./components/canvas";
import { WidgetPalette } from "./components/widget-palette";
import { WidgetInspector } from "./components/widget-inspector";
import { Toolbar } from "./components/toolbar";

export default function DesignerPage() {
  const selectedWidgetId = useDesignerStore((s) => s.selectedWidgetId);
  const setTemplate = useDesignerStore((s) => s.setTemplate);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/template")
      .then((res) => res.json())
      .then((templates) => {
        const active = templates.find((t: Record<string, unknown>) => t.isActive);
        if (active) {
          const { isActive, ...template } = active;
          setTemplate(template);
        }
      })
      .finally(() => setLoaded(true));
  }, [setTemplate]);

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar: Widget palette */}
        <WidgetPalette />

        {/* Center: Canvas */}
        <div className="flex-1 flex items-center justify-center overflow-auto p-8 bg-gray-900">
          <Canvas />
        </div>

        {/* Right sidebar: Inspector */}
        {selectedWidgetId && <WidgetInspector />}
      </div>
    </div>
  );
}
