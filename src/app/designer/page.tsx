"use client";

import { useDesignerStore } from "@/lib/store/designer-store";
import { Canvas } from "./components/canvas";
import { WidgetPalette } from "./components/widget-palette";
import { WidgetInspector } from "./components/widget-inspector";
import { Toolbar } from "./components/toolbar";

export default function DesignerPage() {
  const selectedWidgetId = useDesignerStore((s) => s.selectedWidgetId);

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
