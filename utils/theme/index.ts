// utils/theme/index.ts
import { useColorScheme } from "react-native";
import colors from "./colors";
import typography from "./typography";
import shadows from "./shadows";

// Define spacing values
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 80,
  massive: 96,
  giant: 128,

  // Board
  boardMargin: 16,
  cellPadding: 2,
  gridLineWidth: 1,
  gridBoldLineWidth: 2,

  // Layout
  screenPadding: 20,
  sectionGap: 24,
  itemGap: 12,

  // Buttons
  buttonHeight: 52,
  buttonPadding: 16,
  buttonBorderRadius: 12,

  // Number pad
  numberPadButtonSize: 60,
  numberPadButtonMargin: 8,
  numberPadButtonBorderRadius: 30,
};

// Radius presets for rounded corners
export const radius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

// Animation timing presets
export const timing = {
  quick: 150,
  normal: 300,
  slow: 500,
  entrance: 800,
};

// Export for direct imports
export { colors, typography, shadows };
