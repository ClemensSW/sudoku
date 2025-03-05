// Spacing system
// We use a 4-point grid system for consistent spacing throughout the app
// xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32

export const spacing = {
  // Base spacing units
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  giant: 64,

  // Component-specific spacing
  board: {
    margin: 16,
    cellPadding: 2,
    gridLineWidth: 1,
    gridBoldLineWidth: 2,
  },

  // Layout spacing
  layout: {
    screenPadding: 16,
    sectionGap: 24,
    itemGap: 12,
  },

  // Button sizing
  button: {
    padding: 12,
    borderRadius: 8,
    height: 48,
  },

  // Number pad
  numberPad: {
    buttonSize: 48,
    buttonMargin: 4,
    buttonBorderRadius: 24,
  },

  // Calculate padding based on direction and size
  getPadding: (
    size: keyof typeof spacing,
    direction?: "vertical" | "horizontal" | "all"
  ) => {
    const value = spacing[size];

    if (direction === "vertical") {
      return { paddingVertical: value };
    }

    if (direction === "horizontal") {
      return { paddingHorizontal: value };
    }

    return { padding: value };
  },

  // Calculate margin based on direction and size
  getMargin: (
    size: keyof typeof spacing,
    direction?: "vertical" | "horizontal" | "all"
  ) => {
    const value = spacing[size];

    if (direction === "vertical") {
      return { marginVertical: value };
    }

    if (direction === "horizontal") {
      return { marginHorizontal: value };
    }

    return { margin: value };
  },
};

export default spacing;
