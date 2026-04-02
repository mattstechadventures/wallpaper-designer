import type { WallpaperTemplate, Background, GradientValue } from "@/lib/schema/template";
import { calculateGridMetrics, resolveWidgetRect } from "@/lib/grid/calculator";
import { getWidget } from "@/lib/widgets/registry";

interface TemplateRendererProps {
  template: WallpaperTemplate;
  data?: Record<string, unknown>;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  data = {},
}) => {
  const { canvas, grid, widgets } = template;
  const metrics = calculateGridMetrics(canvas, grid);

  return (
    <div
      style={{
        width: canvas.width,
        height: canvas.height,
        display: "flex",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Inter",
        ...backgroundToStyle(canvas.background),
      }}
    >
      {widgets.map((widget) => {
        const widgetDef = getWidget(widget.type);
        if (!widgetDef) return null;

        const rect = resolveWidgetRect(widget.position, widget.span, grid, metrics);
        const RenderComponent = widgetDef.renderComponent;
        const widgetData = widget.dataSource ? data[widget.dataSource] ?? null : null;

        return (
          <div
            key={widget.id}
            style={{
              display: "flex",
              position: "absolute",
              left: rect.x,
              top: rect.y,
              width: rect.width,
              height: rect.height,
            }}
          >
            <RenderComponent
              config={widget.config}
              data={widgetData}
              style={widget.style}
              size={{ width: rect.width, height: rect.height }}
            />
          </div>
        );
      })}
    </div>
  );
};

function backgroundToStyle(bg: Background): React.CSSProperties {
  switch (bg.type) {
    case "solid":
      return { backgroundColor: bg.value };
    case "gradient":
      return { background: gradientToCss(bg.value) };
    case "image":
      return {
        backgroundImage: `url(${bg.value.src})`,
        backgroundSize: bg.value.fit,
        backgroundPosition: "center",
        opacity: bg.value.opacity ?? 1,
      };
  }
}

function gradientToCss(g: GradientValue): string {
  const stops = g.stops
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");
  return `linear-gradient(${g.angle}deg, ${stops})`;
}
