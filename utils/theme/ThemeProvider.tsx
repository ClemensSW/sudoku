// utils/theme/ThemeProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import colors from "./colors";
import typography from "./typography";
import shadows from "./shadows";
import { spacing, radius, timing } from "./index";
import { Theme } from "./types";
import { loadSettings, saveSettings } from "@/utils/storage";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

// Erweiterte Theme Context Type mit Update-Funktion
interface ThemeContextType extends Theme {
  updateTheme: (mode: "light" | "dark") => Promise<void>;
}

// Create a context with a default theme - now with dark as default
const ThemeContext = createContext<ThemeContextType>({
  colors: colors.dark,
  typography,
  spacing,
  radius,
  shadows,
  timing,
  isDark: true,
  updateTheme: async () => {}, // NEU: Update-Funktion
});

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  const [appIsReady, setAppIsReady] = useState(false);

  // Load saved theme preference on first render
  useEffect(() => {
    const prepare = async () => {
      try {
        const settings = await loadSettings();
        if (settings) {
          // If the darkMode setting exists and is either 'light' or 'dark'
          if (settings.darkMode === "light" || settings.darkMode === "dark") {
            setColorScheme(settings.darkMode);
          } else {
            // If it's 'system' or something else, convert it to 'dark' (default)
            const updatedSettings = {
              ...settings,
              darkMode: "dark" as "light" | "dark",
            };
            await saveSettings(updatedSettings);
            setColorScheme("dark");
          }
        } else {
          // No settings found, default to dark
          setColorScheme("dark");
        }

        // Small delay to ensure everything is applied
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Mark the app as ready to render
        setAppIsReady(true);
      } catch (error) {
        console.error("Error loading theme preference:", error);
        setColorScheme("dark"); // Default to dark
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  // NEU: Direkte Update-Funktion ohne Polling
  const updateTheme = useCallback(async (mode: "light" | "dark") => {
    try {
      // Sofort das Theme ändern
      setColorScheme(mode);
      
      // Settings aktualisieren
      const currentSettings = await loadSettings();
      const updatedSettings = {
        ...currentSettings,
        darkMode: mode,
      };
      await saveSettings(updatedSettings);
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  }, []);

  const themeColors = colors[colorScheme === "dark" ? "dark" : "light"];
  const isDark = colorScheme === "dark";

  // Construct the theme object with update function
  const theme: ThemeContextType = {
    colors: themeColors,
    typography,
    spacing,
    radius,
    shadows,
    timing,
    isDark,
    updateTheme, // NEU: Update-Funktion hinzufügen
  };

  // Hide splash screen once app is ready
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().catch((error) => {
        console.warn("Error hiding splash screen:", error);
      });
    }
  }, [appIsReady]);

  // Only render children when app is ready
  if (!appIsReady) {
    return null; // Return nothing while loading, splash screen is still visible
  }

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// Hook for components to use the theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};