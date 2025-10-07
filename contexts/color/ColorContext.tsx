// contexts/color/ColorContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadColorUnlock, updateSelectedColor as updateStoredColor } from '@/utils/storage';

interface ColorContextType {
  progressColor: string;
  updateSelectedColor: (color: string) => Promise<void>;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progressColor, setProgressColor] = useState<string>('#4285F4'); // Default: Blau

  // Load initial color
  useEffect(() => {
    const loadColor = async () => {
      try {
        // Load selected color from storage
        const colorData = await loadColorUnlock();
        setProgressColor(colorData.selectedColor);
      } catch (error) {
        console.error('Error loading progress color:', error);
      }
    };

    loadColor();
  }, []);

  // Function to update color and notify all consumers
  const updateSelectedColor = async (color: string) => {
    try {
      await updateStoredColor(color);
      setProgressColor(color);
    } catch (error) {
      console.error('Error updating progress color:', error);
    }
  };

  return (
    <ColorContext.Provider value={{ progressColor, updateSelectedColor }}>
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
