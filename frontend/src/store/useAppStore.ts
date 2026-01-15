import { create } from 'zustand';
import { ProcessImageResponse } from '../api/types';

interface AppState {
  image: string | null;
  setImage: (image: string | null) => void;
  detectionData: ProcessImageResponse | null;
  setDetectionData: (data: ProcessImageResponse | null) => void;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
  hoveredObjectId: string | null;
  setHoveredObjectId: (id: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  appliedColors: Map<string, string>;
  applyColor: (objectId: string, color: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  image: null,
  detectionData: null,
  selectedObjectId: null,
  hoveredObjectId: null,
  loading: false,
  error: null,
  appliedColors: new Map(),
  setImage: (image) => set({ image }),
  setDetectionData: (data) => set({ detectionData: data }),
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
  setHoveredObjectId: (id) => set({ hoveredObjectId: id }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  applyColor: (objectId, color) =>
    set((state) => {
      const newColors = new Map(state.appliedColors);
      newColors.set(objectId, color);
      return { appliedColors: newColors };
    }),
  reset: () =>
    set({
      image: null,
      detectionData: null,
      selectedObjectId: null,
      hoveredObjectId: null,
      loading: false,
      error: null,
      appliedColors: new Map(),
    }),
}));