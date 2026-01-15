import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  const [states, setStates] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);

  const setState = useCallback((newState: T) => {
    const newStates = states.slice(0, index + 1);
    newStates.push(newState);
    setStates(newStates);
    setIndex(newStates.length - 1);
  }, [states, index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
    }
  }, [index]);

  const redo = useCallback(() => {
    if (index < states.length - 1) {
      setIndex(index + 1);
    }
  }, [index, states.length]);

  const canUndo = index > 0;
  const canRedo = index < states.length - 1;
  const currentState = states[index];

  return {
    state: currentState,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}