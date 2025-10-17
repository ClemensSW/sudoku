# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sudoku Duo** is a React Native mobile app (iOS/Android) built with Expo that combines traditional single-player Sudoku with an innovative two-player "Duo Mode" where players compete on a split-screen rotating board. The app is 100% free with no ads, featuring a Zen-inspired progression system, unlockable backgrounds, customizable avatars, and multilingual support (German, English, Hindi).

## Essential Commands

### Development
```bash
# Start Expo development server
npx expo start

# Run on specific platform
npx expo start --android
npx expo start --ios

# Run locally (requires Android Studio/Xcode)
npx expo run:android
npx expo run:ios
```

### Building (EAS)
```bash
# Development builds
eas build --profile development --platform android
eas build --profile development --platform ios

# Production builds
eas build --platform android
eas build --platform ios
eas build --platform all
```

### Testing & Code Quality
```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Lint code
npm run lint
```

## Architecture & Key Patterns

### 1. File-Based Routing (Expo Router)
- Routes are defined by file structure in `/app` directory
- Main routes: `index.tsx` (start screen), `game.tsx`, `duo.tsx`, `duo-game.tsx`, `settings.tsx`, `leistung.tsx` (performance/stats), `gallery.tsx`
- `app/_layout.tsx` is the root layout that wraps all routes with providers
- Custom bottom navigation component (`BottomNavigation`) for tab navigation

### 2. Theme System (`utils/theme/`)
- Centralized theme management via `ThemeProvider` context
- Supports light/dark mode with automatic system theme detection
- Theme colors, typography, shadows, spacing, and timing defined separately
- Access theme via `useTheme()` hook in components
- Theme preference persists across app launches via AsyncStorage
- User can manually override system theme preference

### 3. State Management Strategy
- **React Context API** for global state (theme, navigation, alerts, colors, auth, background music)
- **AsyncStorage** for persistence (game state, stats, settings, paused games)
- **Local state** (useState) for component-specific data
- **Custom hooks** for reusable stateful logic (see `/hooks` and screen-specific `/hooks` subdirectories)

### 4. Storage Layer (`utils/storage.ts`)
**Critical file** - handles ALL data persistence:
- Game state (puzzle, solution, time, difficulty)
- Statistics (XP, win streaks, best times, daily streaks, completed games by difficulty)
- Settings (highlights, mistakes, auto-notes, theme, language, vibration, etc.)
- Paused game restoration
- Color unlocks (progression-based)
- Settings modification tracking (to preserve user preferences when difficulty changes)
- Daily Streak System with shield management

**Key concepts:**
- Difficulty progression unlocking: Medium unlocks after 1 Easy completion, Hard after 3 Medium, Expert after 9 Hard
- XP calculation with supporter bonuses via `calculateEpWithBonus()`
- Automatic landscape segment unlocking on game wins
- Settings auto-adjustment per difficulty (respects manual user overrides via tracking)
- Daily streak with shield/freeze mechanics (weekly resets)

### 5. Sudoku Engine (`utils/sudoku/`)
- `generator.ts`: Puzzle generation with difficulty-based cell removal, balanced distribution for Duo mode
- `solver.ts`: Solution validation (not in provided files but referenced)
- `types.ts`: TypeScript interfaces for Board, Cell, Difficulty
- `helpers.ts`: Utility functions for board operations
- `operations.ts`: Game logic operations

**Important:** Duo Mode ensures balanced cell distribution between player zones. The center cell (4,4) is always pre-filled.

### 6. Internationalization (`locales/`)
- Uses `react-i18next` with `expo-localization`
- Supported languages: German (de), English (en), Hindi (hi)
- Language detection: Saved preference → Device locale → Default (German)
- Access translations via `useTranslation()` hook from `react-i18next`
- Translation files organized by screen/component

### 7. Component Structure
Components are organized by feature:
- `/components`: Shared/reusable components (buttons, modals, navigation, alerts)
- `/screens`: Screen-specific components with nested `/components` and `/hooks` subdirectories
- Screens follow pattern: `<ScreenName>Screen/<ScreenName>Screen.tsx`
- Each screen manages its own sub-components and state logic

**Example:** `screens/GameScreen/` contains `GameScreen.tsx`, `components/` (GameBoard, GameControls, NumberPad, etc.), and `hooks/` (useGameState, useGameSettings)

### 8. Provider Hierarchy (app/_layout.tsx)
Order matters - providers are nested as follows:
1. GestureHandlerRootView
2. SafeAreaProvider
3. I18nProvider
4. ThemeProvider
5. ColorProvider
6. BackgroundMusicProvider
7. NavigationProvider
8. AuthProvider
9. BottomSheetModalProvider
10. AlertProvider
11. App content (Stack navigator + BottomNavigation)

### 9. Progression & Rewards System
- **Zen Level System**: XP-based progression with 25 unlockable titles
- **Color Unlocks**: New path colors unlock at levels 5, 10, 15, 20
- **Landscape Gallery**: Segments unlock with each game win (see `screens/Gallery/utils/landscapes/`)
- **Daily Streak**: Encourages daily play with shield/freeze mechanics
- **Difficulty Progression**: Controlled unlocking ensures gradual challenge increase

### 10. Modules (`/modules`)
Feature-specific logic grouped by domain:
- `subscriptions/`: RevenueCat integration for optional supporter features (EP bonuses, extra shields)
- `game/`: EP calculator with supporter bonuses
- `gallery/`: Landscape management

### 11. Custom Alert System
- Custom alert implementation via `components/CustomAlert/`
- Replace native `Alert.alert()` with custom modal dialogs
- Provides consistent styling across platforms
- Access via `useAlert()` hook from AlertProvider

## Development Guidelines

### When Working with Game Logic
1. **Always check if auto-notes were used** - games with auto-notes don't count toward statistics
2. **Validate time > 0** before updating statistics
3. **Use storage.ts functions** - never access AsyncStorage directly
4. **Update both game stats AND landscape progress** when a game is won

### When Adding New Settings
1. Add to `GameSettings` type in `utils/storage.ts`
2. Update `DEFAULT_SETTINGS` constant
3. Add migration logic in `loadSettings()` for backward compatibility
4. If setting should vary by difficulty, add to `applyDifficultyBasedSettings()` and tracking system

### When Creating New Screens
1. Create folder under `/screens` with pattern `<Name>Screen/`
2. Include `<Name>Screen.tsx`, `/components`, `/hooks` as needed
3. Add route in `/app`
4. Update NavigationProvider if bottom nav should hide/show on this screen
5. Follow i18n pattern - add translations to all language files

### When Modifying Theme
- Colors defined in `utils/theme/colors.ts` (light/dark variants)
- Always use theme colors via `theme.colors.*` - never hardcode colors
- Test both light and dark modes
- Consider accessibility (contrast ratios)

### When Working with TypeScript
- Strict mode is enabled (`tsconfig.json`)
- Use path alias `@/` to reference root directory
- Always type props, state, and function returns
- Avoid `any` - use proper types or `unknown`

## Common Patterns

### Theme-aware Styling
```typescript
import { useTheme } from '@/utils/theme/ThemeProvider';

const MyComponent = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
    },
  });

  return <View style={styles.container}>...</View>;
};
```

### Accessing Game Statistics
```typescript
import { loadStats, saveStats, updateStatsAfterGame } from '@/utils/storage';

// Load stats
const stats = await loadStats();

// Update after game
await updateStatsAfterGame(won, difficulty, timeElapsed, autoNotesUsed);
```

### Using Translations
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return <Text>{t('common.start')}</Text>;
};
```

## Critical Files to Understand

1. **utils/storage.ts** - All persistence logic, statistics, settings, progression
2. **utils/theme/ThemeProvider.tsx** - Theme management and system theme integration
3. **utils/sudoku/generator.ts** - Puzzle generation algorithm with Duo Mode balancing
4. **app/_layout.tsx** - Provider setup and app structure
5. **locales/i18n.ts** - Internationalization configuration
6. **screens/GameCompletion/components/PlayerProgressionCard/utils/levelData.ts** - XP/level calculations (referenced but not shown)

## Platform-Specific Notes

### Android
- Navigation bar is hidden and transparent (`expo-navigation-bar`)
- Status bar is hidden
- Supports in-app purchases via RevenueCat

### iOS
- Supports in-app purchases via RevenueCat
- Status bar is hidden

## Data Flow Example: Completing a Game

1. User completes Sudoku puzzle in GameScreen
2. `updateStatsAfterGame()` called with game details
3. Storage layer:
   - Validates game (no auto-notes, time > 0)
   - Calculates XP with supporter bonus
   - Increments completed count for difficulty
   - Updates win streak and best time
   - Unlocks next landscape segment
   - Persists to AsyncStorage
4. GameCompletionModal shows:
   - XP gained and level progress
   - New unlocks (titles, colors, landscapes)
   - Performance stats
   - Streak information
5. Navigation returns to start screen
6. Stats reflected in LeistungScreen (performance tab)

## Important Notes

- App uses Hermes JS engine for better performance
- New Architecture enabled in app.json
- Firebase integration for cloud sync (optional feature)
  - **Important:** Google Analytics is **intentionally disabled** for privacy reasons
  - Only Firebase Authentication and Firestore are used
  - No user tracking or analytics data is collected
  - Configuration files (`google-services.json`, `GoogleService-Info.plist`) must not contain Analytics IDs
- Google Sign-In available in development builds (not Expo Go)
- RevenueCat for in-app purchases (supporter features)
- Lottie animations for confetti and visual effects
- SVG support via react-native-svg-transformer
