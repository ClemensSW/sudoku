// locales/languages.ts
export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  // Zukünftige Sprachen können hier einfach hinzugefügt werden:
  // { code: "es", name: "Español", flag: "🇪🇸" },
  // { code: "fr", name: "Français", flag: "🇫🇷" },
  // { code: "it", name: "Italiano", flag: "🇮🇹" },
  // { code: "pt", name: "Português", flag: "🇵🇹" },
  // { code: "ru", name: "Русский", flag: "🇷🇺" },
  // { code: "zh", name: "中文", flag: "🇨🇳" },
  // { code: "ja", name: "日本語", flag: "🇯🇵" },
  // { code: "ko", name: "한국어", flag: "🇰🇷" },
];

/**
 * Sortiert die verfügbaren Sprachen intelligent:
 * 1. Gerätesprache zuerst
 * 2. Englisch als zweites (außer wenn Gerätesprache = Englisch)
 * 3. Alle anderen Sprachen alphabetisch
 */
export const getSortedLanguages = (deviceLanguageCode?: string): Language[] => {
  const languages = [...AVAILABLE_LANGUAGES];

  // Sprachen nach Name alphabetisch sortieren
  const sortedAlphabetically = languages.sort((a, b) => a.name.localeCompare(b.name));

  const result: Language[] = [];
  const deviceLang = sortedAlphabetically.find(lang => lang.code === deviceLanguageCode);
  const englishLang = sortedAlphabetically.find(lang => lang.code === "en");

  // 1. Gerätesprache zuerst (falls vorhanden und unterstützt)
  if (deviceLang) {
    result.push(deviceLang);
  }

  // 2. Englisch als zweites (falls nicht bereits Gerätesprache)
  if (englishLang && deviceLanguageCode !== "en") {
    result.push(englishLang);
  }

  // 3. Alle anderen Sprachen alphabetisch
  const remainingLanguages = sortedAlphabetically.filter(
    lang => lang.code !== deviceLanguageCode && lang.code !== "en"
  );
  result.push(...remainingLanguages);

  return result;
};

/**
 * Gibt das Label für eine Sprache zurück (Name)
 */
export const getLanguageLabel = (languageCode: string): string => {
  const language = AVAILABLE_LANGUAGES.find(lang => lang.code === languageCode);
  return language?.name || languageCode;
};
