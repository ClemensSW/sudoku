// utils/colorHelpers.ts
// Helper-Funktionen für Farbmanipulation
// Für dynamische Farbanpassungen basierend auf Path Colors

/**
 * Konvertiert Hex-Farbe zu RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Parsed eine rgba-Farbe zu RGBA-Komponenten
 * @param rgba - rgba String (z.B. "rgba(66, 133, 244, 0.04)")
 * @returns RGBA-Objekt oder null bei Fehler
 */
export function parseRgba(rgba: string): { r: number; g: number; b: number; a: number } | null {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;

  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] ? parseFloat(match[4]) : 1.0,
  };
}

/**
 * Konvertiert RGB zu Hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Hellt eine Farbe auf (0-100)
 * 0 = keine Änderung, 100 = weiß
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const amount = percent / 100;
  const r = rgb.r + (255 - rgb.r) * amount;
  const g = rgb.g + (255 - rgb.g) * amount;
  const b = rgb.b + (255 - rgb.b) * amount;

  return rgbToHex(r, g, b);
}

/**
 * Dunkelt eine Farbe ab (0-100)
 * 0 = keine Änderung, 100 = schwarz
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const amount = 1 - percent / 100;
  const r = rgb.r * amount;
  const g = rgb.g * amount;
  const b = rgb.b * amount;

  return rgbToHex(r, g, b);
}

/**
 * Ändert die Sättigung einer Farbe (0-200)
 * 0 = graustufen, 100 = keine Änderung, 200 = maximale Sättigung
 */
export function adjustSaturation(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  // RGB zu HSL konvertieren
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  // Sättigung anpassen
  s = Math.max(0, Math.min(1, s * (percent / 100)));

  // HSL zurück zu RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let rOut, gOut, bOut;

  if (s === 0) {
    rOut = gOut = bOut = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    rOut = hue2rgb(p, q, h + 1 / 3);
    gOut = hue2rgb(p, q, h);
    bOut = hue2rgb(p, q, h - 1 / 3);
  }

  return rgbToHex(rOut * 255, gOut * 255, bOut * 255);
}

/**
 * Gibt eine Farbe mit Opacity zurück (rgba)
 * @param hex - Hex-Farbe
 * @param opacity - Opacity 0-1
 */
export function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampedOpacity})`;
}

/**
 * Mischt zwei Farben (0-100)
 * 0 = 100% color1, 100 = 100% color2
 */
export function mixColors(color1: string, color2: string, percent: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const amount = percent / 100;
  const r = rgb1.r + (rgb2.r - rgb1.r) * amount;
  const g = rgb1.g + (rgb2.g - rgb1.g) * amount;
  const b = rgb1.b + (rgb2.b - rgb1.b) * amount;

  return rgbToHex(r, g, b);
}

/**
 * Berechnet die relative Luminanz nach WCAG-Standard
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  // Konvertiere RGB-Werte zu sRGB
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  // Linearisiere die Werte
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Berechne relative Luminanz
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Berechnet die WCAG Kontrast-Ratio zwischen zwei Farben
 * @returns Kontrast-Ratio (1:1 bis 21:1)
 */
export function getWCAGContrast(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Prüft ob eine Farbe "hell" ist (für Text-Kontrast)
 */
export function isLightColor(hex: string): boolean {
  return getRelativeLuminance(hex) > 0.5;
}

/**
 * Gibt eine kontrastreiche Textfarbe zurück (schwarz oder weiß)
 * Erfüllt WCAG AAA Standard (mindestens 7:1 Kontrast)
 */
export function getContrastText(hex: string): string {
  const blackContrast = getWCAGContrast(hex, '#000000');
  const whiteContrast = getWCAGContrast(hex, '#FFFFFF');

  // Wähle die Farbe mit höherem Kontrast
  return blackContrast > whiteContrast ? '#000000' : '#FFFFFF';
}

/**
 * Passt eine Vordergrundfarbe an, um einen Mindest-Kontrast zu erreichen
 * @param foreground - Die anzupassende Farbe
 * @param background - Die Hintergrundfarbe
 * @param minRatio - Mindest-Kontrast-Ratio (Standard: 7.0 für AAA)
 * @returns Angepasste Farbe mit ausreichendem Kontrast
 */
export function ensureContrast(
  foreground: string,
  background: string,
  minRatio: number = 7.0
): string {
  let currentColor = foreground;
  let currentRatio = getWCAGContrast(currentColor, background);

  // Wenn Kontrast bereits ausreichend, gib original zurück
  if (currentRatio >= minRatio) {
    return currentColor;
  }

  // Bestimme ob wir aufhellen oder abdunkeln müssen
  const bgLuminance = getRelativeLuminance(background);
  const shouldDarken = bgLuminance > 0.5;

  // Iterativ anpassen bis Mindest-Kontrast erreicht
  let adjustment = 0;
  const maxAdjustment = 100;
  const step = 5;

  while (currentRatio < minRatio && adjustment < maxAdjustment) {
    adjustment += step;
    currentColor = shouldDarken
      ? darkenColor(foreground, adjustment)
      : lightenColor(foreground, adjustment);
    currentRatio = getWCAGContrast(currentColor, background);
  }

  return currentColor;
}

/**
 * Mischt eine rgba-Farbe mit einem soliden Hintergrund zu einer soliden Hex-Farbe
 * Verwendet Alpha Blending: finalColor = overlay * alpha + background * (1 - alpha)
 *
 * @param overlay - rgba Overlay-Farbe (z.B. "rgba(66, 133, 244, 0.04)")
 * @param background - Solider Hintergrund als Hex (z.B. "#FAFAFA")
 * @returns Gemischte solide Hex-Farbe (z.B. "#F9FAFB")
 *
 * @example
 * // Blue overlay (4% opacity) auf weißem Hintergrund
 * blendWithBackground("rgba(66, 133, 244, 0.04)", "#FAFAFA")
 * // Returns: "#F9FAFB"
 */
export function blendWithBackground(overlay: string, background: string): string {
  // Parse rgba overlay
  const overlayRgba = parseRgba(overlay);
  if (!overlayRgba) {
    console.warn(`Invalid rgba overlay: ${overlay}`);
    return background; // Fallback zu Hintergrund
  }

  // Parse hex background
  const bgRgb = hexToRgb(background);
  if (!bgRgb) {
    console.warn(`Invalid hex background: ${background}`);
    return background; // Fallback zu Hintergrund
  }

  // Alpha Blending
  const alpha = overlayRgba.a;
  const r = Math.round(overlayRgba.r * alpha + bgRgb.r * (1 - alpha));
  const g = Math.round(overlayRgba.g * alpha + bgRgb.g * (1 - alpha));
  const b = Math.round(overlayRgba.b * alpha + bgRgb.b * (1 - alpha));

  return rgbToHex(r, g, b);
}
