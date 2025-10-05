// locales/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import de from './de';
import en from './en';
import hi from './hi';

const LANGUAGE_STORAGE_KEY = '@sudoku/language';

// Language detector plugin for AsyncStorage
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      // Try to get saved language preference
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }

      // Fall back to device language
      const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'de';

      // Support 'de', 'en', and 'hi', default to 'de'
      const supportedLanguages = ['de', 'en', 'hi'];
      const supportedLanguage = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'de';
      callback(supportedLanguage);
    } catch (error) {
      console.error('Error detecting language:', error);
      callback('de'); // Default to German
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error('Error caching language:', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', // Important for React Native
    resources: {
      de,
      en,
      hi,
    },
    fallbackLng: 'de',
    supportedLngs: ['de', 'en', 'hi'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Important for React Native
    },
  });

export default i18n;
