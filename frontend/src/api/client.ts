/**
 * API Client - Communicates with backend
 */

import { API_ENDPOINTS } from './endpoints';
import { ProcessImageResponse, HealthCheckResponse, ErrorResponse } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public detail: string,
    public errorCode?: string
  ) {
    super(detail);
    this.name = 'APIError';
  }
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));

      throw new APIError(
        response.status,
        errorData.detail,
        errorData.error_code
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      0,
      error instanceof Error ? error.message : 'Network request failed'
    );
  }
}

export const apiClient = {
  async healthCheck(): Promise<HealthCheckResponse> {
    return apiFetch<HealthCheckResponse>(API_ENDPOINTS.HEALTH);
  },

  async processImage(file: File): Promise<ProcessImageResponse> {
    const formData = new FormData();
    formData.append('image', file);

    return apiFetch<ProcessImageResponse>(API_ENDPOINTS.PROCESS_IMAGE, {
      method: 'POST',
      body: formData,
    });
  },
};