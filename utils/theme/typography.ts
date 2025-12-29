// Typography configuration
const typography = {
  // Font families
  fontFamily: {
    primary: "System", // Uses system default font
    numbers: "System",
  },

  // Font sizes
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  weight: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },

  // Preset styles for common text elements
  variant: {
    heading1: {
      fontSize: 32,
      fontWeight: "700",
      lineHeight: 1.2,
    },
    heading2: {
      fontSize: 24,
      fontWeight: "700",
      lineHeight: 1.2,
    },
    heading3: {
      fontSize: 20,
      fontWeight: "600",
      lineHeight: 1.3,
    },
    subtitle1: {
      fontSize: 18,
      fontWeight: "600",
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: 16,
      fontWeight: "500",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 1.5,
    },
    button: {
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 1.2,
      letterSpacing: 0.5,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 1.3,
    },
    overline: {
      fontSize: 12,
      fontWeight: "500",
      lineHeight: 1.2,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    cellValue: {
      fontSize: 20,
      fontWeight: "500",
      lineHeight: 1.2,
    },
    cellNotes: {
      fontSize: 9,
      fontWeight: "400",
      lineHeight: 1.1,
    },
  },
};

// Font Scale Options
export const FONT_SCALE_OPTIONS = [
  { label: 'Klein', value: 0.85 },
  { label: 'Normal', value: 1.0 },
  { label: 'Groß', value: 1.1 },
  { label: 'Größer', value: 1.2 },
  { label: 'Sehr groß', value: 1.25 },
] as const;

export type FontScaleValue = typeof FONT_SCALE_OPTIONS[number]['value'];

/**
 * Erstellt eine skalierte Version der Typography-Konfiguration
 * @param scale - Skalierungsfaktor (0.85 - 1.25)
 */
export function getScaledTypography(scale: number) {
  const clampedScale = Math.max(0.85, Math.min(1.25, scale));

  return {
    ...typography,
    // Skalierte Font Sizes
    size: {
      xs: Math.round(12 * clampedScale),
      sm: Math.round(14 * clampedScale),
      md: Math.round(16 * clampedScale),
      lg: Math.round(18 * clampedScale),
      xl: Math.round(20 * clampedScale),
      xxl: Math.round(24 * clampedScale),
      xxxl: Math.round(32 * clampedScale),
      huge: Math.round(40 * clampedScale),
    },
    // Skalierte Variants
    variant: {
      heading1: { ...typography.variant.heading1, fontSize: Math.round(32 * clampedScale) },
      heading2: { ...typography.variant.heading2, fontSize: Math.round(24 * clampedScale) },
      heading3: { ...typography.variant.heading3, fontSize: Math.round(20 * clampedScale) },
      subtitle1: { ...typography.variant.subtitle1, fontSize: Math.round(18 * clampedScale) },
      subtitle2: { ...typography.variant.subtitle2, fontSize: Math.round(16 * clampedScale) },
      body1: { ...typography.variant.body1, fontSize: Math.round(16 * clampedScale) },
      body2: { ...typography.variant.body2, fontSize: Math.round(14 * clampedScale) },
      button: { ...typography.variant.button, fontSize: Math.round(16 * clampedScale) },
      caption: { ...typography.variant.caption, fontSize: Math.round(12 * clampedScale) },
      overline: { ...typography.variant.overline, fontSize: Math.round(12 * clampedScale) },
      cellValue: { ...typography.variant.cellValue, fontSize: Math.round(20 * clampedScale) },
      cellNotes: { ...typography.variant.cellNotes, fontSize: Math.round(9 * clampedScale) },
    },
  };
}

// Export als Standard und benannt, um Import-Flexibilität zu bieten
export default typography;
export { typography };
