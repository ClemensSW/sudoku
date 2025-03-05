import { useColorScheme } from "react-native";

import colors from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";

// Export theme elements
export { colors, typography, spacing };

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

// Shadow presets for elevation
export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};

// Animation timing presets
export const timing = {
  quick: 150,
  normal: 300,
  slow: 500,
};

// Create a hook for accessing theme colors based on system theme preference
export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return colors[colorScheme === "dark" ? "dark" : "light"];
};

// Create a complete theme object that includes all styling elements
export const useTheme = () => {
  const themeColors = useThemeColors();

  return {
    colors: themeColors,
    typography,
    spacing,
    radius,
    shadows,
    timing,
  };
};

export default useTheme;
