import type { Grid, Canvas, GridPosition, GridSpan, ResolvedWidgetRect } from "@/lib/schema/template";

export interface GridMetrics {
  cellWidth: number;
  cellHeight: number;
  totalWidth: number;
  totalHeight: number;
}

/**
 * Calculate the pixel dimensions of each grid cell.
 */
export function calculateGridMetrics(canvas: Canvas, grid: Grid): GridMetrics {
  const totalWidth = canvas.width;
  const totalHeight = canvas.height;

  const availableWidth =
    totalWidth - grid.padding.left - grid.padding.right - (grid.columns - 1) * grid.gap;
  const availableHeight =
    totalHeight - grid.padding.top - grid.padding.bottom - (grid.rows - 1) * grid.gap;

  return {
    cellWidth: availableWidth / grid.columns,
    cellHeight: availableHeight / grid.rows,
    totalWidth,
    totalHeight,
  };
}

/**
 * Resolve a widget's grid position + span to pixel coordinates.
 * Position is 1-based (col 1, row 1 = top-left cell).
 */
export function resolveWidgetRect(
  position: GridPosition,
  span: GridSpan,
  grid: Grid,
  metrics: GridMetrics,
): ResolvedWidgetRect {
  const x = grid.padding.left + (position.col - 1) * (metrics.cellWidth + grid.gap);
  const y = grid.padding.top + (position.row - 1) * (metrics.cellHeight + grid.gap);
  const width = span.cols * metrics.cellWidth + (span.cols - 1) * grid.gap;
  const height = span.rows * metrics.cellHeight + (span.rows - 1) * grid.gap;

  return { x, y, width, height };
}

/**
 * Convert pixel coordinates back to the nearest grid position.
 * Useful for snap-to-grid in the designer.
 */
export function snapToGrid(
  pixelX: number,
  pixelY: number,
  grid: Grid,
  metrics: GridMetrics,
): GridPosition {
  const col = Math.round((pixelX - grid.padding.left) / (metrics.cellWidth + grid.gap)) + 1;
  const row = Math.round((pixelY - grid.padding.top) / (metrics.cellHeight + grid.gap)) + 1;

  return {
    col: Math.max(1, Math.min(col, grid.columns)),
    row: Math.max(1, Math.min(row, grid.rows)),
  };
}

/**
 * Check if two widget rects overlap on the grid.
 */
export function widgetsOverlap(
  a: { position: GridPosition; span: GridSpan },
  b: { position: GridPosition; span: GridSpan },
): boolean {
  const aRight = a.position.col + a.span.cols;
  const aBottom = a.position.row + a.span.rows;
  const bRight = b.position.col + b.span.cols;
  const bBottom = b.position.row + b.span.rows;

  return (
    a.position.col < bRight &&
    aRight > b.position.col &&
    a.position.row < bBottom &&
    aBottom > b.position.row
  );
}

/**
 * Convert pixel dimensions to the nearest grid span.
 * Useful for snap-to-grid resize in the designer.
 */
export function snapToSpan(
  pixelWidth: number,
  pixelHeight: number,
  metrics: GridMetrics,
  grid: Grid,
  minCols = 1,
  minRows = 1,
): GridSpan {
  const cols = Math.round((pixelWidth + grid.gap) / (metrics.cellWidth + grid.gap));
  const rows = Math.round((pixelHeight + grid.gap) / (metrics.cellHeight + grid.gap));

  return {
    cols: Math.max(minCols, cols),
    rows: Math.max(minRows, rows),
  };
}

/**
 * Check if a widget fits within the grid bounds.
 */
export function widgetFitsGrid(
  position: GridPosition,
  span: GridSpan,
  grid: Grid,
): boolean {
  return (
    position.col >= 1 &&
    position.row >= 1 &&
    position.col + span.cols - 1 <= grid.columns &&
    position.row + span.rows - 1 <= grid.rows
  );
}
