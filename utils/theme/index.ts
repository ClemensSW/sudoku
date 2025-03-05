// Re-export von colors, typography, spacing für direkten Import
import colors from "./colors";
import typography from "./typography";
import { spacing } from "./spacing";
import shadows from "./shadows";
import { Theme } from "./types";

// Export theme elements
export { colors, typography, spacing, shadows };

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
};

// Export from ThemeProvider
export * from "./ThemeProvider";

// Legacy function - verweist nun auf den neuen Hook in ThemeProvider
export { useTheme as default } from "./ThemeProvider";
