import { UPLOAD_LIMITS } from '../../constants';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'Please upload a valid image file',
    };
  }

  // Check supported formats - use type assertion for the includes check
  const supportedFormats: string[] = [...UPLOAD_LIMITS.SUPPORTED_FORMATS];
  if (!supportedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported format. Please use: ${UPLOAD_LIMITS.SUPPORTED_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE) {
    const maxSizeMB = UPLOAD_LIMITS.MAX_FILE_SIZE / 1024 / 1024;
    return {
      valid: false,
      error: `Image must be smaller than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}