import type { WallpaperTemplate } from "./template";
import { v4 as uuid } from "uuid";

export function createDefaultTemplate(): WallpaperTemplate {
  return {
    version: "1.0.0",
    id: uuid(),
    name: "Untitled Wallpaper",
    canvas: {
      width: 3024,
      height: 1964,
      scale: 2,
      background: {
        type: "gradient",
        value: {
          angle: 135,
          stops: [
            { color: "#0f0c29", position: 0 },
            { color: "#302b63", position: 50 },
            { color: "#24243e", position: 100 },
          ],
        },
      },
    },
    grid: {
      columns: 12,
      rows: 8,
      gap: 16,
      padding: { top: 48, right: 48, bottom: 48, left: 48 },
    },
    theme: {
      colors: {
        primary: "#6c63ff",
        text: "#ffffff",
        textSecondary: "#a0a0b0",
        surface: "rgba(0,0,0,0.3)",
        accent: "#ff6584",
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
        mono: "monospace",
      },
      defaults: {
        borderRadius: 12,
        backdropBlur: 10,
      },
    },
    dataSources: {},
    widgets: [
      {
        id: uuid(),
        type: "clock",
        position: { col: 1, row: 1 },
        span: { cols: 4, rows: 2 },
        config: {
          format: "HH:mm",
          showDate: true,
          dateFormat: "dddd, D MMMM",
        },
        style: {
          fontFamily: "Inter",
          fontSize: 72,
          fontWeight: 200,
          color: "#ffffff",
          background: "transparent",
          textAlign: "left",
          padding: { top: 16, right: 24, bottom: 16, left: 24 },
        },
      },
      {
        id: uuid(),
        type: "text",
        position: { col: 1, row: 3 },
        span: { cols: 4, rows: 3 },
        config: {
          content: "Welcome to your dynamic wallpaper. Add widgets from the palette to get started.",
        },
        style: {
          fontFamily: "Inter",
          fontSize: 16,
          color: "#a0a0b0",
          background: "rgba(0,0,0,0.3)",
          borderRadius: 12,
          padding: 20,
          title: {
            text: "Getting Started",
            fontSize: 20,
            fontWeight: 600,
            color: "#ffffff",
            marginBottom: 12,
          },
        },
      },
    ],
  };
}
