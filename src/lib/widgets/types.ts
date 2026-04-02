import type { ZodSchema } from "zod";
import type { WidgetStyle } from "@/lib/schema/template";
import type { FC } from "react";

export interface WidgetRenderProps<TConfig = Record<string, unknown>, TData = unknown> {
  config: TConfig;
  data: TData | null;
  style: WidgetStyle;
  size: { width: number; height: number };
}

export interface WidgetConfigProps<TConfig = Record<string, unknown>> {
  config: TConfig;
  onChange: (config: TConfig) => void;
}

export interface WidgetDefinition<
  TConfig = Record<string, unknown>,
  TData = unknown,
> {
  type: string;
  name: string;
  description: string;
  icon: string;
  defaultSpan: { cols: number; rows: number };
  minSpan: { cols: number; rows: number };
  configSchema: ZodSchema<TConfig>;
  dataSourceTypes?: string[];
  renderComponent: FC<WidgetRenderProps<TConfig, TData>>;
  configComponent: FC<WidgetConfigProps<TConfig>>;
  defaultConfig: TConfig;
  defaultStyle: Partial<WidgetStyle>;
}
