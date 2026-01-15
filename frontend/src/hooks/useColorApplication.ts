import { useState, useCallback } from 'react';

export interface ColorEdit {
  objectId: string;
  color: string;
  timestamp: number;
}

export function useColorApplication() {
  const [appliedColors, setAppliedColors] = useState<Map<string, string>>(new Map());
  const [history, setHistory] = useState<ColorEdit[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const applyColor = useCallback((objectId: string, color: string) => {
    const newColors = new Map(appliedColors);
    newColors.set(objectId, color);
    setAppliedColors(newColors);

    const newHistory = history.slice(0, historyIndex + 1);
    const edit: ColorEdit = {
      objectId,
      color,
      timestamp: Date.now(),
    };
    newHistory.push(edit);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [appliedColors, history, historyIndex]);

  const rebuildFromHistory = useCallback((index: number) => {
    const newColors = new Map<string, string>();
    for (let i = 0; i <= index; i++) {
      const edit = history[i];
      newColors.set(edit.objectId, edit.color);
    }
    setAppliedColors(newColors);
  }, [history]);

  const undo = useCallback(() => {
    if (historyIndex < 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    rebuildFromHistory(newIndex);
  }, [historyIndex, rebuildFromHistory]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    rebuildFromHistory(newIndex);
  }, [historyIndex, history.length, rebuildFromHistory]);

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  const reset = useCallback(() => {
    setAppliedColors(new Map());
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  return {
    appliedColors,
    applyColor,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
}