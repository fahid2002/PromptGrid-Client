export const EDITOR_SIZE = 360;

export function coverScale(width, height, size, zoom = 1) {
  return Math.max(size / width, size / height) * zoom;
}

export const clampCropOffset = (value) => Math.max(-100, Math.min(100, Number(value)));

export function canvasFilter({ brightness, contrast, saturation, grayscale }) {
  return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%)`;
}

export function editedFilename(filename = 'profile-image') {
  const base = filename.replace(/\.[^.]+$/, '');
  return `${base}-edited.webp`;
}
