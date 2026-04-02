"use client";

import { useEffect, useState } from "react";
import { useDesignerStore } from "@/lib/store/designer-store";
import { buildGoogleFontsUrl } from "@/lib/fonts/registry";

/**
 * Dynamically loads Google Fonts CSS for all fonts used by widgets on the canvas.
 * Renders a <link> tag that updates when fonts change.
 */
export function FontLoader() {
  const widgets = useDesignerStore((s) => s.template.widgets);
  const [fontsUrl, setFontsUrl] = useState<string | null>(null);

  useEffect(() => {
    const fontNames = widgets
      .map((w) => w.style.fontFamily)
      .filter((f): f is string => !!f);

    setFontsUrl(buildGoogleFontsUrl(fontNames));
  }, [widgets]);

  if (!fontsUrl) return null;

  // eslint-disable-next-line @next/next/no-page-custom-font
  return <link rel="stylesheet" href={fontsUrl} />;
}
