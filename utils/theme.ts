// utils/theme.ts
import { useColorScheme } from "react-native";
import colors from "./theme/colors";
import typography from "./theme/typography";
import shadows from "./theme/shadows";

// Define spacing constants directly in this file to avoid circular dependencies
const spacing = {
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

// Define radius directly in this file
const radius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

// Custom hook for theme state
export const useTheme = () => {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme === "dark" ? "dark" : "light"];

  return {
    colors: themeColors,
    spacing,
    typography,
    radius,
    shadows,
    isDark: colorScheme === "dark",
  };
};

// Export spacing and other theme elements for direct imports
export { spacing, typography, radius, shadows };
