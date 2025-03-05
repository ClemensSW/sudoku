import { useColorScheme } from "react-native";

// Definiere Farbthemen für Licht- und Dunkelmodus
const themes = {
  light: {
    primary: "#4361EE",
    secondary: "#3F37C9",
    accent: "#F72585",
    background: "#FFFFFF",
    surface: "#F8F9FA",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FF9800",
    cellBackground: "#FFFFFF",
    cellBackgroundInitial: "#F5F7FA",
    cellSelected: "#4361EE",
    cellRelated: "#E9EFFD",
    buttonText: "#FFFFFF",
    numberPadButton: "#F5F7FA",
    gridBorderLight: "#DDE1E7",
    gridBorderDark: "#212121",
    shadow: "rgba(0, 0, 0, 0.1)",
  },
  dark: {
    primary: "#4361EE",
    secondary: "#3F37C9",
    accent: "#F72585",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#FFFFFF",
    textSecondary: "#BBBBBB",
    border: "#333333",
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FF9800",
    cellBackground: "#1E1E1E",
    cellBackgroundInitial: "#2A2A2A",
    cellSelected: "#4361EE",
    cellRelated: "#2D3748",
    buttonText: "#FFFFFF",
    numberPadButton: "#2A2A2A",
    gridBorderLight: "#333333",
    gridBorderDark: "#FFFFFF",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
};

// Verbreitete Abstände und Größen
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typografie
const typography = {
  fontFamily: {
    regular: "System",
    medium: "System",
    bold: "System",
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

// Radius
const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Schatten-Stile
const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Custom hook für den aktuellen Theme-Zustand
export const useTheme = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? themes.dark : themes.light;

  return {
    colors: theme,
    spacing,
    typography,
    radius,
    shadows,
    isDark: colorScheme === "dark",
  };
};
