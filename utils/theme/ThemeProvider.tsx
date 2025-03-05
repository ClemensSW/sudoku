import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";
import colors from "./colors";
import typography from "./typography";
import { spacing } from "./spacing";
import shadows from "./shadows";
import { radius, timing } from "./index";
import { Theme } from "./types";

// Create a context with a default empty theme
const ThemeContext = createContext<Theme | undefined>(undefined);

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme === "dark" ? "dark" : "light"];

  // Construct the theme object
  const theme: Theme = {
    colors: themeColors,
    typography,
    spacing,
    radius,
    shadows,
    timing,
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// Hook for components to use the theme
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    // Fallback theme if used outside of provider
    const fallbackColors = colors["light"];
    return {
      colors: fallbackColors,
      typography,
      spacing,
      radius,
      shadows,
      timing,
    };
  }

  return context;
};
