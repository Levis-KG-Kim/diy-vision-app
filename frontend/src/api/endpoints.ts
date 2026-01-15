/**
 * API Endpoints - Maps to backend/app/api/endpoints.py
 */

export const API_ENDPOINTS = {
  HEALTH: '/health',
  PROCESS_IMAGE: '/api/process',
  // Future endpoints:
  // SAVE_DESIGN: '/api/designs',
  // GET_HISTORY: '/api/history',
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];