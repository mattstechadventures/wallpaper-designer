// Template JSON Schema — the contract between designer and renderer

export interface WallpaperTemplate {
  version: string;
  id: string;
  name: string;
  canvas: Canvas;
  grid: Grid;
  theme: Theme;
  dataSources: Record<string, DataSource>;
  widgets: Widget[];
}

// --- Canvas ---

export interface Canvas {
  width: number;
  height: number;
  scale: number;
  background: Background;
}

export type Background =
  | { type: "solid"; value: string }
  | { type: "gradient"; value: GradientValue }
  | { type: "image"; value: ImageBackgroundValue };

export interface GradientValue {
  angle: number;
  stops: GradientStop[];
}

export interface GradientStop {
  color: string;
  position: number;
}

export interface ImageBackgroundValue {
  src: string;
  fit: "cover" | "contain" | "fill";
  opacity?: number;
  overlay?: Background;
}

// --- Grid ---

export interface Grid {
  columns: number;
  rows: number;
  gap: number;
  padding: Padding;
}

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// --- Theme ---

export interface Theme {
  colors: Record<string, string>;
  fonts: {
    heading: string;
    body: string;
    mono?: string;
  };
  defaults: {
    borderRadius: number;
    backdropBlur?: number;
  };
}

// --- Data Sources ---

export interface DataSource {
  type: string;
  config: Record<string, unknown>;
  refreshInterval: number; // seconds
}

// --- Widgets ---

export interface Widget {
  id: string;
  type: string;
  position: GridPosition;
  span: GridSpan;
  dataSource?: string;
  config: Record<string, unknown>;
  style: WidgetStyle;
}

export interface GridPosition {
  col: number; // 1-based
  row: number; // 1-based
}

export interface GridSpan {
  cols: number;
  rows: number;
}

export interface WidgetStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  opacity?: number;
  textAlign?: "left" | "center" | "right";
  background?: string;
  backdropBlur?: number;
  padding?: number | Padding;
  borderRadius?: number;
  title?: TitleStyle;
}

export interface TitleStyle {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  marginBottom?: number;
}

// --- Resolved types (used by renderer) ---

export interface ResolvedWidgetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
