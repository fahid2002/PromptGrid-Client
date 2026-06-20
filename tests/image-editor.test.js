import { describe, expect, it } from 'vitest';
import { canvasFilter, clampCropOffset, coverScale, editedFilename } from '../src/libs/image-editor.js';

describe('profile image editor helpers', () => {
  it('scales an image to cover the square crop', () => {
    expect(coverScale(800, 400, 320, 1)).toBe(0.8);
    expect(coverScale(400, 800, 320, 1.5)).toBeCloseTo(1.2);
  });

  it('builds deterministic canvas filters', () => {
    expect(canvasFilter({ brightness: 110, contrast: 90, saturation: 120, grayscale: 25 })).toBe('brightness(110%) contrast(90%) saturate(120%) grayscale(25%)');
  });

  it('clamps crop movement and creates a WebP filename', () => {
    expect(clampCropOffset(150)).toBe(100);
    expect(clampCropOffset(-140)).toBe(-100);
    expect(editedFilename('profile.photo.png')).toBe('profile.photo-edited.webp');
  });
});
