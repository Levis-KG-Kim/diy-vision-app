/**
 * API Types - Must match backend/app/models.py exactly
 */

export interface SceneContext {
  environment: string;
  room_type: string;
  lighting: string;
  confidence: number;
}

export interface SAMPrompts {
  points: number[][];
  box: number[];
}

export interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  bbox: number[];
  ambiguity: boolean;
  sam_prompts: SAMPrompts;
  mask?: string;
}

export interface ProcessImageResponse {
  scene_context: SceneContext;
  objects: DetectedObject[];
  warnings: string[];
}

export interface HealthCheckResponse {
  status: string;
  service: string;
}

export interface ErrorResponse {
  detail: string;
  error_code?: string;
}