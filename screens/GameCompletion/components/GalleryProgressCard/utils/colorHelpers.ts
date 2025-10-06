/**
 * Color utility functions for GalleryProgressCard
 */

/**
 * Darkens a hex color by a specified amount
 * @param color - Hex color string (e.g., "#FF5733")
 * @param amount - Amount to darken (0-255)
 * @returns Darkened hex color string
 */
export const darkenColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Converts hex color to RGBA with alpha
 * @param hex - Hex color string (e.g., "#FF5733")
 * @param alpha - Alpha value (0-1)
 * @returns RGBA color string
 */
export const hexToRGBA = (hex: string, alpha: number): string => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
