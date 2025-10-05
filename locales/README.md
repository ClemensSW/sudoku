# Internationalization (i18n)

This directory contains all translations for the Sudoku Duo app.

## 🌍 Supported Languages
- **Deutsch (DE)** 🇩🇪 - German
- **English (EN)** 🇬🇧 - English

## 📁 Structure

```
locales/
├── de/               # German translations
│   ├── common.json
│   ├── settings.json
│   ├── leistung.json
│   └── index.ts      # Export all DE translations
├── en/               # English translations
│   ├── common.json
│   ├── settings.json
│   ├── leistung.json
│   └── index.ts      # Export all EN translations
├── i18n.ts           # i18next configuration
├── README.md         # This file
├── PROGRESS.md       # Quick progress tracker
└── TRANSLATION_PLAN.md  # Detailed translation plan
```

## 🚀 Usage

### In Components

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('settings'); // Specify namespace

  return (
    <Text>{t('title')}</Text>  // "Einstellungen" or "Settings"
  );
}
```

### With Variables

```typescript
t('game.status.timeElapsed', { time: '05:23' })
// JSON: "timeElapsed": "Time: {{time}}"
```

### With Plurals

```typescript
t('errors', { count: 3 })
// JSON:
// "errors_one": "{{count}} error"
// "errors_other": "{{count}} errors"
```

## ➕ Adding a New Language

1. Create new folder: `locales/fr/`
2. Copy all JSON files from `de/` or `en/`
3. Translate all values
4. Create `locales/fr/index.ts`:
   ```typescript
   import common from './common.json';
   import settings from './settings.json';
   // ... import all files

   export default {
     common,
     settings,
     // ... export all
   };
   ```
5. Update `locales/i18n.ts`:
   ```typescript
   import fr from './fr';

   resources: {
     de,
     en,
     fr,  // Add here
   },
   supportedLngs: ['de', 'en', 'fr'],  // Add here
   ```
6. Update `LanguageSelector.tsx` to add UI option

## 📝 Translation Guidelines

### Key Naming
- Use descriptive, hierarchical keys
- Format: `section.subsection.element`
- Example: `game.controls.button.hint`

### Values
- Keep text concise and natural
- Maintain formatting (newlines with `\n`)
- Use proper punctuation
- Don't translate variable placeholders: `{{time}}`

### File Organization
- Group related translations together
- One namespace per major screen/feature
- `common.json` for shared UI elements

## 🔍 Finding Translations

To find where a translation is used:

```bash
# Search for translation key usage
grep -r "t('game.controls" screens/
```

## 📊 Progress Tracking

See [PROGRESS.md](./PROGRESS.md) for current translation status.

See [TRANSLATION_PLAN.md](./TRANSLATION_PLAN.md) for detailed implementation plan.

## 🛠️ Tools

- **i18next** - Core i18n library
- **react-i18next** - React integration
- **expo-localization** - Device language detection
- **AsyncStorage** - Language preference persistence

## 🐛 Troubleshooting

### Translation not showing
1. Check if key exists in JSON file
2. Verify namespace matches in `useTranslation('namespace')`
3. Check browser/app console for i18next errors

### Wrong language displayed
1. Check language preference in Settings
2. Clear AsyncStorage: `AsyncStorage.removeItem('@sudoku/language')`
3. Restart app

### Adding new translation file not working
1. Ensure exported in `locales/de/index.ts`
2. Ensure exported in `locales/en/index.ts`
3. Check imports in `locales/i18n.ts`

---

**Last Updated:** 2025-10-05
