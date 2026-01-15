import { useRef, useEffect, useCallback } from 'react';
import { DetectedObject } from '../api/types';
import { renderCanvas } from '../utils/canvas/renderer';

interface UseCanvasOptions {
  image: string | null;
  objects: DetectedObject[];
  selectedObjectId: string | null;
  hoveredObjectId: string | null;
  appliedColors: Map<string, string>;
}

export function useCanvas({
  image,
  objects,
  selectedObjectId,
  hoveredObjectId,
  appliedColors,
}: UseCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const render = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !image) return;

    renderCanvas(canvasRef.current, imageRef.current, {
      objects,
      selectedObjectId,
      hoveredObjectId,
      appliedColors,
    });
  }, [image, objects, selectedObjectId, hoveredObjectId, appliedColors]);

  useEffect(() => {
    render();
  }, [render]);

  useEffect(() => {
    if (image && imageRef.current) {
      imageRef.current.onload = render;
    }
  }, [image, render]);

  return { canvasRef, imageRef };
}