# 🎯 Sudoku Duo

<div align="center">
  <img src="./assets/images/icon.png" alt="Sudoku Duo Logo" width="128" height="128">
  
  **A revolutionary Sudoku experience combining classic gameplay with innovative two-player mode**
  
  [![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-blue.svg)](https://github.com/yourusername/sudoku-duo)
  [![React Native](https://img.shields.io/badge/React%20Native-0.79.2-61DAFB.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-53.0.7-000020.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

<br>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building](#building)
- [Architecture](#architecture)
- [License](#license)
- [Project Structure](#project-structure)

<br>

## 🎮 Overview

Sudoku Duo is a lovingly crafted, completely free Sudoku game without ads that reinvents the classic puzzle experience. It combines traditional single-player Sudoku with an innovative two-player mode unique to the mobile gaming landscape.

### What makes Sudoku Duo special?

- **100% Free, 0% Ads**: A hobby project built with passion and attention to detail
- **Innovative Duo Mode**: Two players, one board – compete or cooperate on the same device
- **Zen Progression System**: Level up through mindful gameplay with motivational messages
- **Personalization**: Unlock stunning backgrounds and customize your avatar
- **Professional Polish**: Smooth animations, haptic feedback, and intuitive UI

<br>

## ✨ Features

### 🧠 Single Player Mode
- Four difficulty levels (Easy, Medium, Hard, Expert)
- Intelligent hints and auto-notes system
- Error highlighting and validation
- Undo/redo functionality
- Progress tracking and statistics

### 👥 Duo Mode (Unique Feature)
- Split-screen competitive gameplay
- Rotating perspectives for fair play
- Real-time score tracking
- Cooperative and competitive variants

### 🎨 Customization & Rewards
- Zen-inspired level system with XP progression
- Unlockable landscape backgrounds
- Custom avatar support (gallery or camera)
- Multiple theme options (Light/Dark mode)

### 📊 Statistics & Progress
- Win streaks and best times
- Difficulty-based progression unlocking
- Detailed performance metrics
- Achievement milestones

### ⚙️ Smart Features
- Automatic game state saving
- Configurable haptic feedback
- Multiple highlighting options
- Accessibility-focused design

<br>

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: React Native 0.79.2 with Expo 53.0.7
- **Language**: TypeScript 5.8.3
- **Navigation**: Expo Router (File-based routing)
- **State Management**: React Context API
- **Storage**: AsyncStorage

### Key Libraries
- **Animations**: React Native Reanimated 3.17.4
- **UI Components**: 
  - React Native Gesture Handler
  - React Native Safe Area Context
  - Expo Vector Icons
- **Monetization**: React Native Purchases (RevenueCat) for optional support
- **Visual Effects**: 
  - Expo Blur
  - Expo Linear Gradient
  - React Native Confetti Cannon
- **Utilities**:
  - Expo Haptics
  - Expo Image Picker
  - Expo File System

<br>

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- EAS CLI (for building)
- Android Studio / Xcode (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/clemenssw/sudoku-duo.git
   cd sudoku-duo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app

<br>

## 💻 Development

### Development Workflow

1. **Theme System**
   The app uses a custom theme provider with automatic dark mode support:
   ```typescript
   import { useTheme } from '@/utils/theme/ThemeProvider';
   const theme = useTheme();
   ```

2. **Sudoku Engine**
   Core game logic is in `utils/sudoku/`:
   - `generator.ts` - Puzzle generation
   - `solver.ts` - Solution validation
   - `types.ts` - TypeScript interfaces

3. **State Management**
   - Game state: React Context (`GameContext`)
   - Settings: AsyncStorage with hooks
   - Navigation: Expo Router with file-based routing

### Code Style
- TypeScript strict mode enabled
- ESLint configuration included
- Prettier for code formatting

### Testing
```bash
npm test                 # Run all tests
npm test -- --watch     # Watch mode
```

<br>

## 🏗️ Building

### Development Build
```bash
# Android
eas build --profile development --platform android

# iOS
eas build --profile development --platform ios
```

### Production Build
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# Both platforms
eas build --platform all
```

### Local Build (Android)
```bash
npx expo run:android
```

### Configuration
- EAS configuration: `eas.json`
- App configuration: `app.json`
- Environment variables: Create `.env` file (see `.env.example`)

<br>

## 🏛️ Architecture

### Component Architecture
- **Atomic Design**: Small, reusable components
- **Composition**: Complex features built from simple parts
- **Separation of Concerns**: Logic separated from presentation

### Data Flow
1. **Game State**: Centralized in GameContext
2. **User Settings**: Persisted in AsyncStorage
3. **Statistics**: Updated after each game
4. **Achievements**: Calculated based on statistics

### Performance Optimizations
- Memoized components with React.memo
- Optimized re-renders with useCallback/useMemo
- Lazy loading for heavy components
- Efficient animation with Reanimated

<br>

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br>

## 🙏 Acknowledgments

- Built with ❤️ as a hobby project
- Special thanks for all tester to the React Native and Expo communities

<br>

## 📞 Contact

- **Developer**: [Clemens Walther]
- **Email**: [info@playfusion-gate.de]
- **Project Link**: [https://github.com/clemenssw/sudoku-duo](https://github.com/clemenssw/sudoku-duo)

---



<br>

## 📁 Project Structure

```
sudoku
├─ android.view.Choreographer$FrameDisplayEventReceiver
├─ app
│  ├─ (game)
│  │  ├─ index.tsx
│  │  └─ _layout.tsx
│  ├─ duo-game.tsx
│  ├─ duo.tsx
│  ├─ gallery.tsx
│  ├─ game.tsx
│  ├─ index.tsx
│  ├─ leistung.tsx
│  ├─ settings.tsx
│  └─ _layout.tsx
├─ app.json
├─ assets
│  ├─ fonts
│  │  └─ SpaceMono-Regular.ttf
│  ├─ imageCollection
│  │  ├─ beaches
│  │  │  ├─ beach-1_1920.jpg
│  │  │  └─ beach-1_640.jpg
│  │  ├─ birds
│  │  │  ├─ costa-rica-9301364_1920.jpg
│  │  │  └─ costa-rica-9301364_640.jpg
│  │  ├─ forests
│  │  │  ├─ bamboo-1_1920.jpg
│  │  │  └─ bamboo-1_640.jpg
│  │  ├─ gardens
│  │  │  ├─ gardens-japanese_1920.jpg
│  │  │  └─ gardens-japanese_640.jpg
│  │  ├─ lakes
│  │  │  ├─ lake-1_1920.jpg
│  │  │  └─ lake-1_640.jpg
│  │  ├─ mountains
│  │  │  ├─ mountains-fuji_1920.jpg
│  │  │  └─ mountains-fuji_640.jpg
│  │  ├─ sky
│  │  │  ├─ milky-way_1920.jpg
│  │  │  └─ milky-way_640.jpg
│  │  ├─ valleys
│  │  │  ├─ fog-7440132_1920.jpg
│  │  │  └─ fog-7440132_640.jpg
│  │  └─ waterfalls
│  │     ├─ waterfall-1_1920.jpg
│  │     └─ waterfall-1_640.jpg
│  ├─ images
│  │  ├─ adaptive-icon.png
│  │  ├─ app-logo.png
│  │  ├─ avatars
│  │  │  ├─ anime
│  │  │  │  ├─ avatar1.webp
│  │  │  │  ├─ avatar10.webp
│  │  │  │  ├─ avatar11.webp
│  │  │  │  ├─ avatar12.webp
│  │  │  │  ├─ avatar13.webp
│  │  │  │  ├─ avatar14.webp
│  │  │  │  ├─ avatar15.webp
│  │  │  │  ├─ avatar16.webp
│  │  │  │  ├─ avatar2.webp
│  │  │  │  ├─ avatar3.webp
│  │  │  │  ├─ avatar4.webp
│  │  │  │  ├─ avatar5.webp
│  │  │  │  ├─ avatar6.webp
│  │  │  │  ├─ avatar7.webp
│  │  │  │  ├─ avatar8.webp
│  │  │  │  └─ avatar9.webp
│  │  │  ├─ cartoon
│  │  │  │  ├─ avatar100.webp
│  │  │  │  ├─ avatar101.webp
│  │  │  │  ├─ avatar102.webp
│  │  │  │  ├─ avatar103.webp
│  │  │  │  ├─ avatar104.webp
│  │  │  │  ├─ avatar105.webp
│  │  │  │  ├─ avatar106.webp
│  │  │  │  ├─ avatar107.webp
│  │  │  │  ├─ avatar108.webp
│  │  │  │  ├─ avatar109.webp
│  │  │  │  ├─ avatar110.webp
│  │  │  │  ├─ avatar111.webp
│  │  │  │  ├─ avatar112.webp
│  │  │  │  ├─ avatar113.webp
│  │  │  │  ├─ avatar114.webp
│  │  │  │  ├─ avatar115.webp
│  │  │  │  ├─ avatar116.webp
│  │  │  │  ├─ avatar117.webp
│  │  │  │  ├─ avatar118.webp
│  │  │  │  ├─ avatar119.webp
│  │  │  │  ├─ avatar120.webp
│  │  │  │  ├─ avatar121.webp
│  │  │  │  ├─ avatar122.webp
│  │  │  │  ├─ avatar123.webp
│  │  │  │  ├─ avatar124.webp
│  │  │  │  ├─ avatar125.webp
│  │  │  │  ├─ avatar126.webp
│  │  │  │  ├─ avatar127.webp
│  │  │  │  ├─ avatar128.webp
│  │  │  │  ├─ avatar129.webp
│  │  │  │  ├─ avatar130.webp
│  │  │  │  ├─ avatar131.webp
│  │  │  │  ├─ avatar132.webp
│  │  │  │  ├─ avatar133.webp
│  │  │  │  ├─ avatar134.webp
│  │  │  │  ├─ avatar135.webp
│  │  │  │  ├─ avatar136.webp
│  │  │  │  ├─ avatar137.webp
│  │  │  │  ├─ avatar138.webp
│  │  │  │  ├─ avatar139.webp
│  │  │  │  ├─ avatar140.webp
│  │  │  │  ├─ avatar141.webp
│  │  │  │  ├─ avatar142.webp
│  │  │  │  ├─ avatar143.webp
│  │  │  │  ├─ avatar144.webp
│  │  │  │  ├─ avatar145.webp
│  │  │  │  ├─ avatar146.webp
│  │  │  │  ├─ avatar147.webp
│  │  │  │  ├─ avatar148.webp
│  │  │  │  ├─ avatar149.webp
│  │  │  │  ├─ avatar150.webp
│  │  │  │  ├─ avatar151.webp
│  │  │  │  ├─ avatar152.webp
│  │  │  │  ├─ avatar153.webp
│  │  │  │  ├─ avatar154.webp
│  │  │  │  ├─ avatar155.webp
│  │  │  │  ├─ avatar156.webp
│  │  │  │  ├─ avatar157.webp
│  │  │  │  ├─ avatar158.webp
│  │  │  │  ├─ avatar159.webp
│  │  │  │  ├─ avatar160.webp
│  │  │  │  ├─ avatar161.webp
│  │  │  │  ├─ avatar17.webp
│  │  │  │  ├─ avatar18.webp
│  │  │  │  ├─ avatar19.webp
│  │  │  │  ├─ avatar20.webp
│  │  │  │  ├─ avatar21.webp
│  │  │  │  ├─ avatar22.webp
│  │  │  │  ├─ avatar23.webp
│  │  │  │  ├─ avatar24.webp
│  │  │  │  ├─ avatar25.webp
│  │  │  │  ├─ avatar26.webp
│  │  │  │  ├─ avatar27.webp
│  │  │  │  ├─ avatar28.webp
│  │  │  │  ├─ avatar29.webp
│  │  │  │  ├─ avatar30.webp
│  │  │  │  ├─ avatar31.webp
│  │  │  │  ├─ avatar32.webp
│  │  │  │  ├─ avatar33.webp
│  │  │  │  ├─ avatar34.webp
│  │  │  │  ├─ avatar35.webp
│  │  │  │  ├─ avatar36.webp
│  │  │  │  ├─ avatar37.webp
│  │  │  │  ├─ avatar38.webp
│  │  │  │  ├─ avatar39.webp
│  │  │  │  ├─ avatar40.webp
│  │  │  │  ├─ avatar41.webp
│  │  │  │  ├─ avatar42.webp
│  │  │  │  ├─ avatar43.webp
│  │  │  │  ├─ avatar44.webp
│  │  │  │  ├─ avatar45.webp
│  │  │  │  ├─ avatar46.webp
│  │  │  │  ├─ avatar47.webp
│  │  │  │  ├─ avatar48.webp
│  │  │  │  ├─ avatar49.webp
│  │  │  │  ├─ avatar50.webp
│  │  │  │  ├─ avatar51.webp
│  │  │  │  ├─ avatar52.webp
│  │  │  │  ├─ avatar53.webp
│  │  │  │  ├─ avatar54.webp
│  │  │  │  ├─ avatar55.webp
│  │  │  │  ├─ avatar56.webp
│  │  │  │  ├─ avatar57.webp
│  │  │  │  ├─ avatar58.webp
│  │  │  │  ├─ avatar59.webp
│  │  │  │  ├─ avatar60.webp
│  │  │  │  ├─ avatar61.webp
│  │  │  │  ├─ avatar62.webp
│  │  │  │  ├─ avatar63.webp
│  │  │  │  ├─ avatar64.webp
│  │  │  │  ├─ avatar65.webp
│  │  │  │  ├─ avatar66.webp
│  │  │  │  ├─ avatar67.webp
│  │  │  │  ├─ avatar68.webp
│  │  │  │  ├─ avatar69.webp
│  │  │  │  ├─ avatar70.webp
│  │  │  │  ├─ avatar71.webp
│  │  │  │  ├─ avatar72.webp
│  │  │  │  ├─ avatar73.webp
│  │  │  │  ├─ avatar74.webp
│  │  │  │  ├─ avatar75.webp
│  │  │  │  ├─ avatar76.webp
│  │  │  │  ├─ avatar77.webp
│  │  │  │  ├─ avatar78.webp
│  │  │  │  ├─ avatar79.webp
│  │  │  │  ├─ avatar80.webp
│  │  │  │  ├─ avatar81.webp
│  │  │  │  ├─ avatar82.webp
│  │  │  │  ├─ avatar83.webp
│  │  │  │  ├─ avatar84.webp
│  │  │  │  ├─ avatar85.webp
│  │  │  │  ├─ avatar86.webp
│  │  │  │  ├─ avatar87.webp
│  │  │  │  ├─ avatar88.webp
│  │  │  │  ├─ avatar89.webp
│  │  │  │  ├─ avatar90.webp
│  │  │  │  ├─ avatar91.webp
│  │  │  │  ├─ avatar92.webp
│  │  │  │  ├─ avatar93.webp
│  │  │  │  ├─ avatar94.webp
│  │  │  │  ├─ avatar95.webp
│  │  │  │  ├─ avatar96.webp
│  │  │  │  ├─ avatar97.webp
│  │  │  │  ├─ avatar98.webp
│  │  │  │  └─ avatar99.webp
│  │  │  └─ default.webp
│  │  ├─ background
│  │  │  ├─ kenrokuen-garden-9511300_1920.jpg
│  │  │  ├─ mountains_blue.png
│  │  │  └─ mountains_purple.png
│  │  ├─ favicon.png
│  │  ├─ icon.png
│  │  └─ splash-icon.png
│  └─ landscapes
│     ├─ kenrokuen-garden-9511300_1920.jpg
│     ├─ landscape-4484408_1920.jpg
│     └─ travel-4959716_1280.jpg
├─ components
│  ├─ AvatarPicker
│  │  ├─ AvatarOption.tsx
│  │  ├─ AvatarPicker.tsx
│  │  ├─ DefaultAvatars.tsx
│  │  ├─ index.ts
│  │  └─ styles.ts
│  ├─ BottomNavigation
│  │  ├─ BottomNavigation.tsx
│  │  └─ index.ts
│  ├─ Button
│  │  ├─ Button.styles.ts
│  │  └─ Button.tsx
│  ├─ CircularProgress
│  │  └─ CircularProgress.tsx
│  ├─ CustomAlert
│  │  ├─ AlertHelpers.ts
│  │  ├─ AlertProvider.tsx
│  │  ├─ CustomAlert.styles.ts
│  │  ├─ CustomAlert.tsx
│  │  └─ index.ts
│  ├─ DifficultyModal
│  │  ├─ DifficultyModal.styles.ts
│  │  ├─ DifficultyModal.tsx
│  │  └─ index.ts
│  ├─ ErrorIndicator
│  │  ├─ ErrorIndicator.styles.ts
│  │  └─ ErrorIndicator.tsx
│  ├─ GameCompletionModal
│  │  ├─ components
│  │  │  ├─ ConfettiEffect
│  │  │  │  ├─ ConfettiEffect.styles.ts
│  │  │  │  └─ ConfettiEffect.tsx
│  │  │  ├─ FeedbackMessage
│  │  │  │  ├─ FeedbackMessage.styles.ts
│  │  │  │  └─ FeedbackMessage.tsx
│  │  │  ├─ LevelProgress
│  │  │  │  ├─ components
│  │  │  │  │  ├─ LevelBadge.tsx
│  │  │  │  │  └─ PathInfo.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ LevelProgress.styles.ts
│  │  │  │  ├─ LevelProgress.tsx
│  │  │  │  └─ utils
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ levelData.ts
│  │  │  │     ├─ types.ts
│  │  │  │     └─ useLevelInfo.ts
│  │  │  ├─ PerformanceCard
│  │  │  │  ├─ PerformanceCard.styles.ts
│  │  │  │  └─ PerformanceCard.tsx
│  │  │  └─ StreakDisplay
│  │  │     ├─ StreakDisplay.styles.ts
│  │  │     └─ StreakDisplay.tsx
│  │  ├─ GameCompletionModal.styles.ts
│  │  ├─ GameCompletionModal.tsx
│  │  └─ index.ts
│  ├─ GameModeModal
│  │  ├─ GameModeModal.styles.ts
│  │  ├─ GameModeModal.tsx
│  │  └─ index.ts
│  ├─ GameStatusBar
│  │  ├─ GameStatusBar.styles.ts
│  │  └─ GameStatusBar.tsx
│  ├─ Header
│  │  ├─ Header.styles.ts
│  │  └─ Header.tsx
│  ├─ HowToPlayModal
│  │  ├─ HowToPlayModal.styles.ts
│  │  └─ HowToPlayModal.tsx
│  ├─ index.ts
│  ├─ SudokuBoard.tsx
│  ├─ SupportShop
│  │  ├─ components
│  │  │  ├─ Banner.styles.ts
│  │  │  ├─ Banner.tsx
│  │  │  ├─ GradientFallback.tsx
│  │  │  ├─ ProductCard.styles.ts
│  │  │  ├─ ProductCard.tsx
│  │  │  ├─ PurchaseOverlay.styles.ts
│  │  │  ├─ PurchaseOverlay.tsx
│  │  │  ├─ SubscriptionCard.styles.ts
│  │  │  └─ SubscriptionCard.tsx
│  │  ├─ index.ts
│  │  ├─ SupportShop.styles.ts
│  │  ├─ SupportShop.tsx
│  │  └─ utils
│  │     ├─ confetti.ts
│  │     └─ supportMessages.ts
│  ├─ Timer
│  │  ├─ Timer.styles.ts
│  │  └─ Timer.tsx
│  └─ Tutorial
│     ├─ components
│     │  ├─ AnimatedBoard.tsx
│     │  └─ TutorialProgress.tsx
│     ├─ index.ts
│     ├─ pages
│     │  ├─ BasicRulesPage.tsx
│     │  ├─ GameplayPage.tsx
│     │  ├─ NotesPage.tsx
│     │  └─ SudokuBoardDemo.tsx
│     ├─ TutorialContainer.tsx
│     └─ TutorialPage.tsx
├─ eas.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ screens
│  ├─ DuoGameScreen
│  │  ├─ components
│  │  │  ├─ CircularProgress.tsx
│  │  │  ├─ DuoErrorIndicator.tsx
│  │  │  ├─ DuoGameBoard.tsx
│  │  │  ├─ DuoGameCell.tsx
│  │  │  ├─ DuoGameCompletionModal.tsx
│  │  │  ├─ DuoGameControls.tsx
│  │  │  ├─ DuoGameSettingsPanel.tsx
│  │  │  └─ index.ts
│  │  ├─ DuoGameScreen.tsx
│  │  ├─ hooks
│  │  │  └─ useDuoGameState.ts
│  │  └─ index.ts
│  ├─ DuoScreen
│  │  ├─ components
│  │  │  ├─ DuoBoard.styles.ts
│  │  │  ├─ DuoBoard.tsx
│  │  │  ├─ DuoBoardVisualizer
│  │  │  │  ├─ DuoBoardVisualizer.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ DuoControls.styles.ts
│  │  │  ├─ DuoControls.tsx
│  │  │  ├─ DuoFeatures
│  │  │  │  ├─ DuoFeatures.styles.ts
│  │  │  │  ├─ DuoFeatures.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ DuoHeader
│  │  │  │  ├─ DuoHeader.styles.ts
│  │  │  │  ├─ DuoHeader.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ GameCompletionModal.tsx
│  │  │  ├─ index.ts
│  │  │  └─ ScrollIndicator
│  │  │     ├─ index.ts
│  │  │     ├─ ScrollIndicator.styles.ts
│  │  │     └─ ScrollIndicator.tsx
│  │  ├─ DuoScreen.styles.ts
│  │  ├─ DuoScreen.tsx
│  │  └─ index.ts
│  ├─ GalleryScreen
│  │  ├─ components
│  │  │  └─ LandscapeCollection
│  │  │     ├─ ImageDetailModal.styles.ts
│  │  │     ├─ ImageDetailModal.tsx
│  │  │     ├─ ImageGrid.styles.ts
│  │  │     ├─ ImageGrid.tsx
│  │  │     ├─ index.ts
│  │  │     ├─ PuzzleProgress.styles.ts
│  │  │     └─ PuzzleProgress.tsx
│  │  ├─ GalleryScreen.styles.ts
│  │  ├─ GalleryScreen.tsx
│  │  ├─ hooks
│  │  │  ├─ useDailyBackground.ts
│  │  │  └─ useLandscapes.ts
│  │  └─ utils
│  │     └─ landscapes
│  │        ├─ data.ts
│  │        ├─ storage.ts
│  │        └─ types.ts
│  ├─ GameScreen
│  │  ├─ components
│  │  │  ├─ GameBoard
│  │  │  │  ├─ GameBoard.styles.ts
│  │  │  │  └─ GameBoard.tsx
│  │  │  ├─ GameControls
│  │  │  │  ├─ GameControls.css
│  │  │  │  └─ GameControls.tsx
│  │  │  ├─ GameSettingsPanel
│  │  │  │  ├─ GameSettingsPanel.styles.ts
│  │  │  │  └─ GameSettingsPanel.tsx
│  │  │  ├─ NumberPad
│  │  │  │  ├─ NumberPad.styles.ts
│  │  │  │  └─ NumberPad.tsx
│  │  │  ├─ SudokuBoard
│  │  │  │  ├─ SudokuBoard.styles.ts
│  │  │  │  └─ SudokuBoard.tsx
│  │  │  └─ SudokuCell
│  │  │     ├─ SudokuCell.styles.ts
│  │  │     └─ SudokuCell.tsx
│  │  ├─ GameScreen.styles.ts
│  │  ├─ GameScreen.tsx
│  │  └─ hooks
│  │     ├─ useGameSettings.ts
│  │     └─ useGameState.ts
│  ├─ index.ts
│  ├─ LeistungScreen
│  │  ├─ components
│  │  │  ├─ BestTimesChart
│  │  │  │  ├─ BestTimesChart.styles.ts
│  │  │  │  ├─ BestTimesChart.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ EmptyState.tsx
│  │  │  ├─ GalleryTab
│  │  │  │  ├─ GalleryTab.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ LevelTab
│  │  │  │  ├─ index.ts
│  │  │  │  └─ LevelTab.tsx
│  │  │  ├─ LoadingState.tsx
│  │  │  ├─ ProfileHeader
│  │  │  │  ├─ index.ts
│  │  │  │  └─ ProfileHeader.tsx
│  │  │  ├─ StreakTab
│  │  │  │  ├─ index.ts
│  │  │  │  └─ StreakTab.tsx
│  │  │  ├─ TabNavigator
│  │  │  │  ├─ index.ts
│  │  │  │  └─ TabNavigator.tsx
│  │  │  └─ TimeTab
│  │  │     ├─ index.ts
│  │  │     └─ TimeTab.tsx
│  │  ├─ index.ts
│  │  └─ LeistungScreen.tsx
│  ├─ SettingsScreen
│  │  ├─ components
│  │  │  ├─ ActionsSection
│  │  │  │  ├─ ActionsSection.styles.ts
│  │  │  │  └─ ActionsSection.tsx
│  │  │  ├─ AppearanceSettings
│  │  │  │  ├─ AppearanceSettings.styles.ts
│  │  │  │  ├─ AppearanceSettings.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ CommunitySection
│  │  │  │  ├─ CommunitySection.styles.ts
│  │  │  │  └─ CommunitySection.tsx
│  │  │  ├─ GameSettings
│  │  │  │  ├─ GameSettings.styles.ts
│  │  │  │  └─ GameSettings.tsx
│  │  │  ├─ HelpSection
│  │  │  │  ├─ HelpSection.styles.ts
│  │  │  │  └─ HelpSection.tsx
│  │  │  ├─ index.ts
│  │  │  └─ ReviewSystem
│  │  │     ├─ constants.ts
│  │  │     ├─ feather-icons.ts
│  │  │     ├─ FeedbackCategoryModal.tsx
│  │  │     ├─ FeedbackDetailModal.tsx
│  │  │     ├─ index.ts
│  │  │     ├─ RatingModal.tsx
│  │  │     ├─ ReviewManager.tsx
│  │  │     ├─ styles.ts
│  │  │     ├─ types.ts
│  │  │     ├─ useReviewManager.ts
│  │  │     └─ utils.ts
│  │  ├─ SettingsScreen.styles.ts
│  │  └─ SettingsScreen.tsx
│  └─ StartScreen
│     └─ StartScreen.tsx
├─ tsconfig.json
└─ utils
   ├─ avatarStorage.ts
   ├─ billing
   │  ├─ BillingManager.ts
   │  └─ config.ts
   ├─ constants.ts
   ├─ defaultAvatars.ts
   ├─ haptics.ts
   ├─ NavigationContext.tsx
   ├─ profileStorage.ts
   ├─ storage.ts
   ├─ sudoku
   │  ├─ generator.ts
   │  ├─ helpers.ts
   │  ├─ index.ts
   │  ├─ operations.ts
   │  └─ types.ts
   └─ theme
      ├─ colors.ts
      ├─ index.ts
      ├─ shadows.ts
      ├─ spacing.ts
      ├─ ThemeProvider.tsx
      ├─ types.ts
      └─ typography.ts

```

<div align="center">
  Made with ☕ and ❤️ for puzzle lovers everywhere
</div>