// utils/theme/ThemeProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
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

// Create a context with a default theme - now with dark as default
const ThemeContext = createContext<Theme>({
  colors: colors.dark, // Changed to dark as default
  typography,
  spacing,
  radius,
  shadows,
  timing,
  isDark: true, // Changed to true as default
});

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Set initial colorScheme to 'dark' as default
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark'); // Default to dark
  const [userThemePreference, setUserThemePreference] = useState<'light' | 'dark'>('dark'); // Default to dark
  const [initialSettingsLoaded, setInitialSettingsLoaded] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  // Load saved theme preference on first render
  useEffect(() => {
    const prepare = async () => {
      try {
        const settings = await loadSettings();
        if (settings) {
          // If the darkMode setting exists and is either 'light' or 'dark'
          if (settings.darkMode === 'light' || settings.darkMode === 'dark') {
            setUserThemePreference(settings.darkMode);
            setColorScheme(settings.darkMode);
          } else {
            // If it's 'system' or something else, convert it to 'dark' (default)
            // Also update the settings to reflect this change
            const updatedSettings = { 
              ...settings, 
              darkMode: 'dark' as 'light' | 'dark' 
            };
            await saveSettings(updatedSettings);
            setUserThemePreference('dark');
            setColorScheme('dark');
          }
        } else {
          // No settings found, default to dark
          setUserThemePreference('dark');
          setColorScheme('dark');
        }
        
        // Mark settings as loaded
        setInitialSettingsLoaded(true);
        
        // Small delay to ensure everything is applied
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Mark the app as ready to render
        setAppIsReady(true);
      } catch (error) {
        console.error('Error loading theme preference:', error);
        setColorScheme('dark'); // Default to dark
        setInitialSettingsLoaded(true);
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  // Monitor settings changes to update the theme
  useEffect(() => {
    if (!initialSettingsLoaded) return;

    const checkThemeChanges = async () => {
      try {
        const settings = await loadSettings();
        if (settings && settings.darkMode !== userThemePreference) {
          if (settings.darkMode === 'light' || settings.darkMode === 'dark') {
            setUserThemePreference(settings.darkMode);
            setColorScheme(settings.darkMode);
          } else {
            // If it's 'system' or something else, update it to the current preference
            const updatedSettings = { 
              ...settings, 
              darkMode: userThemePreference as 'light' | 'dark' 
            };
            await saveSettings(updatedSettings);
          }
        }
      } catch (error) {
        console.error('Error checking theme changes:', error);
      }
    };

    // Check for changes regularly
    const interval = setInterval(checkThemeChanges, 2000);
    
    return () => clearInterval(interval);
  }, [userThemePreference, initialSettingsLoaded]);

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

  // Hide splash screen once app is ready
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().catch(error => {
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
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};