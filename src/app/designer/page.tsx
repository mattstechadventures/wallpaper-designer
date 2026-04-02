"use client";

import { useEffect, useState } from "react";
import { useDesignerStore } from "@/lib/store/designer-store";
import { Canvas } from "./components/canvas";
import { CanvasToolkit } from "./components/canvas-toolkit";
import { WidgetPalette } from "./components/widget-palette";
import { WidgetInspector } from "./components/widget-inspector";
import { Toolbar } from "./components/toolbar";
import { FontLoader } from "./components/font-loader";

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
      <div className="h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <FontLoader />
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <WidgetPalette />
        <div className="flex-1 relative bg-muted/30">
          <Canvas />
          <CanvasToolkit />
        </div>
        {selectedWidgetId && <WidgetInspector />}
      </div>
    </div>
  );
}
