import { useState, useCallback } from 'react';
import { apiClient, APIError } from '../api/client';
import { ProcessImageResponse } from '../api/types';
import { UPLOAD_LIMITS } from '../constants';

interface UseObjectDetectionReturn {
  data: ProcessImageResponse | null;
  loading: boolean;
  error: string | null;
  processImage: (file: File) => Promise<void>;
  reset: () => void;
}

export function useObjectDetection(): UseObjectDetectionReturn {
  const [data, setData] = useState<ProcessImageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE) {
      setError(`Image size must be less than ${UPLOAD_LIMITS.MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await apiClient.processImage(file);

      if (!response.scene_context || !Array.isArray(response.objects)) {
        throw new Error('Invalid response structure from backend');
      }

      setData(response);
    } catch (err) {
      if (err instanceof APIError) {
        setError(`Backend error: ${err.detail}`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Detection error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, processImage, reset };
}