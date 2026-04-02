"use client";

import { useDesignerStore } from "@/lib/store/designer-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Toolbar() {
  const { isDirty, isRendering, save, render, lastRenderUrl, template } =
    useDesignerStore();

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold tracking-tight">
          Wallpaper Designer
        </h1>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm text-muted-foreground">{template.name}</span>
        {isDirty && (
          <Badge variant="outline" className="text-amber-400 border-amber-400/30 bg-amber-400/10">
            Unsaved
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={save}
          disabled={!isDirty}
        >
          Save
        </Button>
        <Button
          size="sm"
          onClick={render}
          disabled={isRendering}
        >
          {isRendering ? "Rendering..." : "Render Wallpaper"}
        </Button>
        {lastRenderUrl && (
          <a
            href={lastRenderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline underline-offset-4"
          >
            View Latest
          </a>
        )}
      </div>
    </header>
  );
}
