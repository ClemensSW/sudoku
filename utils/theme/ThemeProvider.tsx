import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme, AppState, AppStateStatus } from "react-native";
import colors from "./colors";
import typography from "./typography";
import shadows from "./shadows";
import { spacing, radius, timing } from "./index";
import { Theme } from "./types";

// Create a context with a default theme
const ThemeContext = createContext<Theme>({
  colors: colors.light,
  typography,
  spacing,
  radius,
  shadows,
  timing,
  isDark: false,
});

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(systemColorScheme);

  // Update color scheme when system preference changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          setColorScheme(systemColorScheme);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [systemColorScheme]);

  const themeColors = colors[colorScheme === "dark" ? "dark" : "light"];
  const isDark = colorScheme === "dark";

  // Construct the theme object
  const theme: Theme = {
    colors: themeColors,
    typography,
    spacing,
    radius,
    shadows,
    timing,
    isDark,
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// Hook for components to use the theme
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
