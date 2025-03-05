// Fix for utils/theme/index.ts
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
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  giant: 64,

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

// Basic theme hook for direct use
export const useTheme = () => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? colors.dark : colors.light;

  return {
    colors: themeColors,
    spacing,
    typography,
    radius,
    shadows,
    timing,
    isDark: colorScheme === "dark",
  };
};

export default useTheme;
