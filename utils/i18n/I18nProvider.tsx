// utils/i18n/I18nProvider.tsx
import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locales/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

/**
 * I18n Provider - provides translation functionality to all child components
 * Initializes i18n and ensures it's ready before rendering children
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for i18n to initialize
    const initI18n = async () => {
      try {
        // i18n is already initialized in locales/i18n.ts
        // We just need to wait for it to be ready
        await i18n.init();
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing i18n:', error);
        setIsReady(true); // Render anyway with fallback
      }
    };

    if (!i18n.isInitialized) {
      initI18n();
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return null; // or a loading screen
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
