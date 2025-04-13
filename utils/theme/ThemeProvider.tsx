// utils/theme/ThemeProvider.tsx
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
import { loadSettings } from "@/utils/storage";

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
  const [userThemePreference, setUserThemePreference] = useState<'system' | 'light' | 'dark'>('system');

  // Lade die Themeeinstellung beim ersten Rendern
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const settings = await loadSettings();
        if (settings) {
          const { darkMode } = settings;
          setUserThemePreference(darkMode);
          
          // Setze das Farbschema basierend auf der Benutzereinstellung
          if (darkMode === 'light') {
            setColorScheme('light');
          } else if (darkMode === 'dark') {
            setColorScheme('dark');
          } else {
            // Bei 'system' oder anderen Werten: System-Einstellung verwenden
            setColorScheme(systemColorScheme);
          }
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        setColorScheme(systemColorScheme);
      }
    };

    loadThemePreference();
  }, []);

  // Update color scheme when system preference changes
  useEffect(() => {
    // Überwache systemColorScheme-Änderungen und wende sie an, 
    // aber nur wenn userThemePreference auf 'system' gesetzt ist
    if (userThemePreference === 'system') {
      setColorScheme(systemColorScheme);
    }

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          // Hier aktualisieren wir das Thema nur wenn der Benutzer die Systemeinstellung verwendet
          if (userThemePreference === 'system') {
            setColorScheme(systemColorScheme);
          }
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [systemColorScheme, userThemePreference]);

  // Überwache Änderungen an den Einstellungen, um das Theme zu aktualisieren
  useEffect(() => {
    const checkThemeChanges = async () => {
      try {
        const settings = await loadSettings();
        if (settings && settings.darkMode !== userThemePreference) {
          setUserThemePreference(settings.darkMode);
          
          // Aktualisiere das Theme basierend auf der neuen Einstellung
          if (settings.darkMode === 'light') {
            setColorScheme('light');
          } else if (settings.darkMode === 'dark') {
            setColorScheme('dark');
          } else {
            // Bei 'system': System-Einstellung verwenden
            setColorScheme(systemColorScheme);
          }
        }
      } catch (error) {
        console.error('Error checking theme changes:', error);
      }
    };

    // Prüfe regelmäßig auf Änderungen (z.B. alle 2 Sekunden)
    const interval = setInterval(checkThemeChanges, 2000);
    
    return () => clearInterval(interval);
  }, [userThemePreference, systemColorScheme]);

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