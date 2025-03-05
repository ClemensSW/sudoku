// Typography configuration
export const typography = {
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

export default typography;
