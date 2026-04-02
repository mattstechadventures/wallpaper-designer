"use client";

import { useDesignerStore } from "@/lib/store/designer-store";
import type React from "react";
import type { CanvasTool } from "@/lib/store/designer-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tools: { id: CanvasTool; label: string; shortcut: string; icon: React.ReactNode }[] = [
  {
    id: "select",
    label: "Select",
    shortcut: "V",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2l4 12 2-5 5-2L3 2z" />
      </svg>
    ),
  },
  {
    id: "marquee",
    label: "Marquee Select",
    shortcut: "M",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="12" height="12" strokeDasharray="3 2" />
      </svg>
    ),
  },
];

export function CanvasToolkit() {
  const { activeTool, setActiveTool, zoom, zoomIn, zoomOut, zoomToFit } =
    useDesignerStore();

  return (
    <TooltipProvider>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-lg border border-border bg-background/90 backdrop-blur-sm p-1 shadow-lg">
        {/* Tool buttons */}
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                activeTool === tool.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => setActiveTool(tool.id)}
            >
              {tool.icon}
            </TooltipTrigger>
            <TooltipContent>
              {tool.label} ({tool.shortcut})
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Separator */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* Zoom controls */}
        <Tooltip>
          <TooltipTrigger
            className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={zoomOut}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="7" cy="7" r="5" />
              <path d="M5 7h4" />
              <path d="M11 11l3 3" />
            </svg>
          </TooltipTrigger>
          <TooltipContent>Zoom Out (-)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            className="flex items-center justify-center min-w-10 h-8 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors tabular-nums"
            onClick={zoomToFit}
          >
            {Math.round(zoom * 100)}%
          </TooltipTrigger>
          <TooltipContent>Reset Zoom (0)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={zoomIn}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="7" cy="7" r="5" />
              <path d="M5 7h4" />
              <path d="M7 5v4" />
              <path d="M11 11l3 3" />
            </svg>
          </TooltipTrigger>
          <TooltipContent>Zoom In (+)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
