import { DetectedObject } from '../../api/types';
import { CANVAS_CONFIG } from '../../constants';

interface RenderOptions {
  objects: DetectedObject[];
  selectedObjectId: string | null;
  hoveredObjectId: string | null;
  appliedColors: Map<string, string>;
}

export function renderCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  options: RenderOptions
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { objects, selectedObjectId, hoveredObjectId, appliedColors } = options;

  // Set canvas size
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  // Clear and draw base image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  // Render each object
  objects.forEach((obj) => {
    const isSelected = selectedObjectId === obj.id;
    const isHovered = hoveredObjectId === obj.id;
    const appliedColor = appliedColors.get(obj.id);

    // Apply color mask if present
    if (appliedColor) {
      renderColorMask(ctx, obj, appliedColor);
    }

    // Draw bounding box
    renderBoundingBox(ctx, obj, isSelected, isHovered);

    // Draw label
    renderLabel(ctx, obj);

    // Draw ambiguity warning if hovered
    if (obj.ambiguity && isHovered) {
      renderAmbiguityWarning(ctx, obj);
    }
  });
}

function renderColorMask(
  ctx: CanvasRenderingContext2D,
  obj: DetectedObject,
  color: string
): void {
  const [x, y, w, h] = obj.bbox;
  ctx.globalAlpha = CANVAS_CONFIG.COLOR_OPACITY;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w - x, h - y);
  ctx.globalAlpha = 1.0;
}

function renderBoundingBox(
  ctx: CanvasRenderingContext2D,
  obj: DetectedObject,
  isSelected: boolean,
  isHovered: boolean
): void {
  const [x, y, w, h] = obj.bbox;

  ctx.strokeStyle = obj.ambiguity ? '#FF6B6B' : '#4ECDC4';
  ctx.lineWidth = isSelected
    ? CANVAS_CONFIG.STROKE_WIDTH.SELECTED
    : isHovered
    ? CANVAS_CONFIG.STROKE_WIDTH.HOVERED
    : CANVAS_CONFIG.STROKE_WIDTH.DEFAULT;
  ctx.setLineDash(obj.ambiguity ? [5, 5] : []);

  ctx.strokeRect(x, y, w - x, h - y);
  ctx.setLineDash([]);
}

function renderLabel(
  ctx: CanvasRenderingContext2D,
  obj: DetectedObject
): void {
  const [x, y] = obj.bbox;
  const opacity = Math.max(0.3, obj.confidence);

  // Background
  ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.7})`;
  ctx.fillRect(x, y - 25, 120, 25);

  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '12px Inter, sans-serif';
  ctx.fillText(
    `${obj.label} (${Math.round(obj.confidence * 100)}%)`,
    x + 5,
    y - 8
  );
}

function renderAmbiguityWarning(
  ctx: CanvasRenderingContext2D,
  obj: DetectedObject
): void {
  const [x, , , h] = obj.bbox;

  ctx.fillStyle = 'rgba(255, 107, 107, 0.9)';
  ctx.fillRect(x, h + 5, 150, 30);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('⚠️ Uncertain detection', x + 5, h + 22);
}