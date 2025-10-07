// contexts/color/ColorContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadColorUnlock, updateSelectedColor as updateStoredColor } from '@/utils/storage';
import { getColorFromHex } from '@/utils/pathColors';
import { useTheme } from '@/utils/theme/ThemeProvider';

interface ColorContextType {
  /** The actual display color (theme-aware: light or dark variant) */
  progressColor: string;
  /** The stored color hex value (theme-agnostic) */
  storedColorHex: string;
  updateSelectedColor: (color: string) => Promise<void>;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const [storedColorHex, setStoredColorHex] = useState<string>('#4285F4'); // Default: Blau

  // Load initial color from storage
  useEffect(() => {
    const loadColor = async () => {
      try {
        const colorData = await loadColorUnlock();
        setStoredColorHex(colorData.selectedColor);
      } catch (error) {
        console.error('Error loading progress color:', error);
      }
    };

    loadColor();
  }, []);

  // Compute display color based on theme (light/dark) and stored hex
  const progressColor = getColorFromHex(storedColorHex, theme.isDark);

  // Function to update color and notify all consumers
  const updateSelectedColor = async (color: string) => {
    try {
      await updateStoredColor(color);
      setStoredColorHex(color); // This triggers re-computation of progressColor
    } catch (error) {
      console.error('Error updating progress color:', error);
    }
  };

  return (
    <ColorContext.Provider value={{ progressColor, storedColorHex, updateSelectedColor }}>
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
