export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
} as const;

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png'] as const,
  SUPPORTED_EXTENSIONS: ['.jpg', '.jpeg', '.png'] as const,
};

export const DESIGN_COLORS = [
  { name: 'White', value: '#FFFFFF', category: 'neutral' },
  { name: 'Beige', value: '#F5F5DC', category: 'neutral' },
  { name: 'Light Gray', value: '#D3D3D3', category: 'neutral' },
  { name: 'Sage Green', value: '#9DC183', category: 'accent' },
  { name: 'Sky Blue', value: '#87CEEB', category: 'accent' },
  { name: 'Coral', value: '#FF7F50', category: 'accent' },
  { name: 'Navy', value: '#2C3E50', category: 'bold' },
  { name: 'Charcoal', value: '#36454F', category: 'bold' },
] as const;

export const CANVAS_CONFIG = {
  MIN_CONFIDENCE: 0.3,
  AMBIGUITY_THRESHOLD: 0.7,
  COLOR_OPACITY: 0.5,
  STROKE_WIDTH: {
    DEFAULT: 1,
    HOVERED: 2,
    SELECTED: 3,
  },
} as const;

export const MESSAGES = {
  UPLOAD_PROMPT: 'Upload a room photo to get started',
  PROCESSING: 'Analyzing your room with AI...',
  SELECT_OBJECT: 'Select an object to apply colors',
  AMBIGUITY_WARNING: 'This object has uncertain detection. Proceed with caution.',
  EXPORT_SUCCESS: 'Design exported successfully!',
  ERRORS: {
    INVALID_FILE: 'Please upload a valid image file (JPG or PNG)',
    FILE_TOO_LARGE: 'Image must be smaller than 10MB',
    BACKEND_ERROR: 'Failed to process image. Please try again.',
    NETWORK_ERROR: 'Cannot connect to server. Please check your connection.',
  },
} as const;