// contexts/color/ColorContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { loadColorUnlock, updateSelectedColor as updateStoredColor } from '@/utils/storage';
import { getColorFromHex } from '@/utils/pathColors';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { onVisualSettingsRefresh } from '@/utils/events/settingsEvents';

interface ColorContextType {
  /** The actual display color (theme-aware: light or dark variant) */
  progressColor: string;
  /** The stored color hex value (theme-agnostic) */
  storedColorHex: string;
  updateSelectedColor: (color: string) => Promise<void>;
  /** Refresh color from storage (e.g., after level unlock) */
  refreshColor: () => Promise<void>;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const [storedColorHex, setStoredColorHex] = useState<string>('#4285F4'); // Default: Blau

  // Shared function to load color from storage
  const loadColor = async () => {
    try {
      const colorData = await loadColorUnlock();
      setStoredColorHex(colorData.selectedColor);
    } catch (error) {
      console.error('Error loading progress color:', error);
    }
  };

  // Load initial color from storage
  useEffect(() => {
    loadColor();
  }, []);

  // Subscribe to visual settings refresh events (login/logout)
  useEffect(() => {
    const unsubscribe = onVisualSettingsRefresh(() => {
      console.log('[ColorProvider] Refreshing from storage...');
      loadColor();
    });
    return () => unsubscribe();
  }, []);

  // PERFORMANCE: Memoize display color computation
  const progressColor = useMemo(
    () => getColorFromHex(storedColorHex, theme.isDark),
    [storedColorHex, theme.isDark]
  );

  // PERFORMANCE: Memoize update function
  const updateSelectedColor = useCallback(async (color: string) => {
    try {
      await updateStoredColor(color);
      setStoredColorHex(color);
    } catch (error) {
      console.error('Error updating progress color:', error);
    }
  }, []);

  // PERFORMANCE: Memoize refresh function
  const refreshColor = useCallback(async () => {
    await loadColor();
  }, []);

  // PERFORMANCE: Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ progressColor, storedColorHex, updateSelectedColor, refreshColor }),
    [progressColor, storedColorHex, updateSelectedColor, refreshColor]
  );

  return (
    <ColorContext.Provider value={contextValue}>
      {children}
    </ColorContext.Provider>
  );
};

export const useProgressColor = (): string => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useProgressColor must be used within ColorProvider');
  }
  return context.progressColor;
};

export const useUpdateProgressColor = (): ((color: string) => Promise<void>) => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useUpdateProgressColor must be used within ColorProvider');
  }
  return context.updateSelectedColor;
};

export const useStoredColorHex = (): string => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useStoredColorHex must be used within ColorProvider');
  }
  return context.storedColorHex;
};

export const useRefreshProgressColor = (): (() => Promise<void>) => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useRefreshProgressColor must be used within ColorProvider');
  }
  return context.refreshColor;
};
