import { z } from "zod";

const paddingSchema = z.object({
  top: z.number().min(0),
  right: z.number().min(0),
  bottom: z.number().min(0),
  left: z.number().min(0),
});

const gradientStopSchema = z.object({
  color: z.string(),
  position: z.number().min(0).max(100),
});

const gradientValueSchema = z.object({
  angle: z.number().min(0).max(360),
  stops: z.array(gradientStopSchema).min(2),
});

const backgroundSchema: z.ZodType = z.discriminatedUnion("type", [
  z.object({ type: z.literal("solid"), value: z.string() }),
  z.object({ type: z.literal("gradient"), value: gradientValueSchema }),
  z.object({
    type: z.literal("image"),
    value: z.object({
      src: z.string(),
      fit: z.enum(["cover", "contain", "fill"]),
      opacity: z.number().min(0).max(1).optional(),
      overlay: z.lazy(() => backgroundSchema).optional(),
    }),
  }),
]);

const canvasSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  scale: z.number().positive().default(2),
  background: backgroundSchema,
});

const gridSchema = z.object({
  columns: z.number().int().min(1).max(24),
  rows: z.number().int().min(1).max(16),
  gap: z.number().min(0),
  padding: paddingSchema,
});

const themeSchema = z.object({
  colors: z.record(z.string(), z.string()),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
    mono: z.string().optional(),
  }),
  defaults: z.object({
    borderRadius: z.number().min(0),
    backdropBlur: z.number().min(0).optional(),
  }),
});

const dataSourceSchema = z.object({
  type: z.string(),
  config: z.record(z.string(), z.unknown()),
  refreshInterval: z.number().int().positive(),
});

const titleStyleSchema = z.object({
  text: z.string(),
  fontSize: z.number().optional(),
  fontWeight: z.number().optional(),
  color: z.string().optional(),
  marginBottom: z.number().optional(),
});

const widgetStyleSchema = z.object({
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  fontWeight: z.number().optional(),
  color: z.string().optional(),
  opacity: z.number().min(0).max(1).optional(),
  textAlign: z.enum(["left", "center", "right"]).optional(),
  background: z.string().optional(),
  backdropBlur: z.number().optional(),
  padding: z.union([z.number(), paddingSchema]).optional(),
  borderRadius: z.number().optional(),
  title: titleStyleSchema.optional(),
});

const widgetSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    col: z.number().int().positive(),
    row: z.number().int().positive(),
  }),
  span: z.object({
    cols: z.number().int().positive(),
    rows: z.number().int().positive(),
  }),
  dataSource: z.string().optional(),
  config: z.record(z.string(), z.unknown()),
  style: widgetStyleSchema,
});

export const wallpaperTemplateSchema = z.object({
  version: z.string(),
  id: z.string(),
  name: z.string(),
  canvas: canvasSchema,
  grid: gridSchema,
  theme: themeSchema,
  dataSources: z.record(z.string(), dataSourceSchema),
  widgets: z.array(widgetSchema),
});

export type ValidatedTemplate = z.infer<typeof wallpaperTemplateSchema>;
