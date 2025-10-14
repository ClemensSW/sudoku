// utils/theme/ThemeProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { View, useColorScheme as useSystemColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import colors from "./colors";
import typography from "./typography";
import shadows from "./shadows";
import { spacing, radius, timing } from "./index";
import { Theme } from "./types";

// Re-export Theme type for convenience
export type { Theme } from "./types";
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from "@/utils/storage";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

// Erweiterte Theme Context Type mit Update-Funktion
interface ThemeContextType extends Theme {
  updateTheme: (mode: "light" | "dark") => Promise<void>;
  resetToSystemTheme: () => Promise<void>;
  isFollowingSystem: boolean;
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
  updateTheme: async () => {},
  resetToSystemTheme: async () => {},
  isFollowingSystem: false,
});

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useSystemColorScheme(); // Get device theme
  const [colorScheme, setColorScheme] = useState<"light" | "dark" | null>(null);
  const [userHasSetTheme, setUserHasSetTheme] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  // Load saved theme preference on first render
  useEffect(() => {
    const prepare = async () => {
      try {
        const settings = await loadSettings();

        if (settings === null) {
          // First app launch - no settings saved yet
          // Use system theme
          console.log('[ThemeProvider] First launch detected - using system theme:', systemColorScheme);
          setColorScheme(systemColorScheme === "dark" ? "dark" : "light");
          setUserHasSetTheme(false);

          // Save default settings with system theme
          await saveSettings({
            ...DEFAULT_SETTINGS,
            // Don't save darkMode - this indicates "follow system"
          });
        } else if (settings.darkMode === "light" || settings.darkMode === "dark") {
          // User has manually set a theme preference
          console.log('[ThemeProvider] User theme preference found:', settings.darkMode);
          setColorScheme(settings.darkMode);
          setUserHasSetTheme(true);
        } else {
          // Settings exist but no manual theme preference - use system theme
          console.log('[ThemeProvider] No theme preference - using system theme:', systemColorScheme);
          setColorScheme(systemColorScheme === "dark" ? "dark" : "light");
          setUserHasSetTheme(false);
        }

        // Small delay to ensure everything is applied
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Mark the app as ready to render
        setAppIsReady(true);
      } catch (error) {
        console.error("Error loading theme preference:", error);
        // Fallback to system theme on error
        setColorScheme(systemColorScheme === "dark" ? "dark" : "light");
        setAppIsReady(true);
      }
    };

    prepare();
  }, [systemColorScheme]);

  // Update theme when system theme changes (but only if user hasn't manually set a theme)
  useEffect(() => {
    if (!userHasSetTheme && systemColorScheme && appIsReady) {
      setColorScheme(systemColorScheme === "dark" ? "dark" : "light");
    }
  }, [systemColorScheme, userHasSetTheme, appIsReady]);

  // Update-Funktion für manuelles Theme-Setzen durch User
  const updateTheme = useCallback(async (mode: "light" | "dark") => {
    try {
      // Theme sofort ändern
      setColorScheme(mode);

      // Merken, dass User das Theme manuell gesetzt hat
      setUserHasSetTheme(true);

      // Settings speichern für nächsten App-Start
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

  // Reset zu System-Theme (Switch ON)
  const resetToSystemTheme = useCallback(async () => {
    try {
      // Zu System-Theme wechseln
      setColorScheme(systemColorScheme === "dark" ? "dark" : "light");

      // Flag zurücksetzen
      setUserHasSetTheme(false);

      // darkMode aus Settings löschen
      const currentSettings = await loadSettings();
      const updatedSettings = { ...currentSettings };
      delete updatedSettings.darkMode;
      await saveSettings(updatedSettings);
    } catch (error) {
      console.error("Error resetting to system theme:", error);
    }
  }, [systemColorScheme]);

  // Only calculate theme if colorScheme is set
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
    updateTheme,
    resetToSystemTheme,
    isFollowingSystem: !userHasSetTheme,
  };

  // Hide splash screen once app is ready
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().catch((error) => {
        console.warn("Error hiding splash screen:", error);
      });
    }
  }, [appIsReady]);

  // Only render children when app is ready and theme is determined
  if (!appIsReady || colorScheme === null) {
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