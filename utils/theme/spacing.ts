// Spacing system - Alle konstanten werte definieren

// Base spacing units
const BASE = {
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
};

// Vereinfachte Spacing-Struktur ohne verschachtelte Objekte
export const spacing = {
  ...BASE,

  // Flattened values for backwards compatibility
  // Board
  boardMargin: 16,
  cellPadding: 2,
  gridLineWidth: 1,
  gridBoldLineWidth: 2,

  // Layout
  screenPadding: 16,
  sectionGap: 24,
  itemGap: 12,

  // Buttons
  buttonHeight: 48,
  buttonPadding: 12,
  buttonBorderRadius: 8,

  // Number pad
  numberPadButtonSize: 48,
  numberPadButtonMargin: 4,
  numberPadButtonBorderRadius: 24,
};
