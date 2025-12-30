// screens/GameScreen/GameScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { useNavigation } from "@/contexts/navigation";
import { useTranslation } from "react-i18next";
import {
  hintCellAlert,
  noErrorsAlert,
  initialCellAlert,
  noHintsAlert,
  autoNotesAlert,
  quitGameAlert,
  gameOverAlert,
} from "@/components/CustomAlert/AlertHelpers";
import { clearPausedGame } from "@/utils/storage";

import { Difficulty } from "@/utils/sudoku";
import GameCompletionFlow from "@/screens/GameCompletion/GameCompletionFlow";
import GameHeader from "./components/GameHeader";

// Import custom hooks
import { useGameState } from "./hooks/useGameState";
import { useGameSettings } from "./hooks/useGameSettings";

// Import components
import GameBoard from "./components/GameBoard/GameBoard";
import GameControls from "./components/GameControls/GameControls";
import GameSettingsPanel from "./components/GameSettingsPanel/GameSettingsPanel";
import PauseModal from "./components/PauseModal/PauseModal";

import styles from "./Game.styles";

interface GameScreenProps {
  initialDifficulty?: Difficulty;
  shouldResume?: boolean;
}

const Game: React.FC<GameScreenProps> = ({ initialDifficulty, shouldResume = false }) => {
  const theme = useTheme();
  const { colors, typography } = theme;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { hideBottomNav, resetBottomNav } = useNavigation();
  const { t } = useTranslation('game');

  // Get game state and actions from custom hook
  const [gameState, gameActions] = useGameState(initialDifficulty);

  // Get settings from custom hook
  const gameSettings = useGameSettings();

  // Local state
  const [showSettings, setShowSettings] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [gameInitialized, setGameInitialized] = useState(false); // New state to track initialization
  const [showPauseModal, setShowPauseModal] = useState(false);

  // Animation values
  const headerOpacity = useSharedValue(1);
  const controlsOpacity = useSharedValue(0);

  // Hide bottom navigation when game mounts
  useEffect(() => {
    hideBottomNav();
    return () => {
      resetBottomNav();
    };
  }, [hideBottomNav, resetBottomNav]);

  // Initialize animations when the component mounts
  useEffect(() => {
    // Start with header fully visible
    headerOpacity.value = 1;

    // Fade in controls after a delay
    setTimeout(() => {
      controlsOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }, 800);
  }, []);

  // Initialize game only once - check for resume parameter
  useEffect(() => {
    if (!gameInitialized) {
      // WICHTIG: Settings-Anpassung SOFORT durchführen, BEVOR useGameSettings das erste Mal lädt (150ms)
      // Dadurch hat useGameSettings beim Initial-Load bereits die korrekten Settings
      (async () => {
        try {
          // Wenn wir ein Spiel fortsetzen, keine Settings anpassen
          if (!shouldResume) {
            const { loadSettings, applyDifficultyBasedSettings, saveSettings } = await import("@/utils/storage");
            const currentSettings = await loadSettings();
            if (currentSettings) {
              const adjustedSettings = await applyDifficultyBasedSettings(
                initialDifficulty || "medium",
                currentSettings
              );
              await saveSettings(adjustedSettings, true); // isAutomatic = true
              console.log(`[Game.tsx] Settings adjusted for ${initialDifficulty || "medium"} BEFORE game init`);
            }
          }
        } catch (error) {
          console.error('[Game.tsx] Error adjusting settings before game init:', error);
        }

        // Settings sind jetzt angepasst, starte Game-Initialisierung nach 300ms
        setTimeout(async () => {
          if (shouldResume) {
            const resumed = await gameActions.resumeGame();
            if (!resumed) {
              // If resume failed, start new game
              gameActions.startNewGame();
            }
          } else {
            gameActions.startNewGame();
          }

          setGameInitialized(true);
        }, 300);
      })();
    }
  }, [gameInitialized, gameActions, shouldResume, initialDifficulty]);

  // Handle back button
  useEffect(() => {
    const backAction = async () => {
      // If pause modal is open, close it
      if (showPauseModal) {
        handlePauseModalResume();
        return true;
      }

      if (gameState.isGameRunning && !gameState.isGameComplete) {
        // Directly call pauseGame and navigate
        await gameActions.pauseGame();
        router.navigate("../");
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [gameState.isGameRunning, gameState.isGameComplete, gameActions, router, showPauseModal]);

  // PERFORMANCE: Memoize handler to prevent re-creation on every render
  const handleCompleteGameRestart = useCallback(() => {
    // Wait for animation/alert to close
    setTimeout(() => {
      // Navigate to game screen with difficulty parameter to completely restart the game
      router.replace({
        pathname: "/game",
        params: { difficulty: gameState.difficulty },
      });
    }, 200);
  }, [router, gameState.difficulty]);

  // Check for game completion and show modal
  useEffect(() => {
    if (
      gameState.isGameComplete &&
      !showCompletionModal &&
      !showGameOverModal
    ) {
      if (gameState.isGameLost && !gameState.isUserQuit) {
        // Only show game over modal if game was lost due to errors (not a manual quit)
        setTimeout(() => {
          showAlert(
            gameOverAlert(
              gameState.autoNotesUsed,
              handleCompleteGameRestart // Use the new complete restart function here
            )
          );
        }, 800);
      } else if (!gameState.isGameLost) {
        // Show completion modal for win
        setTimeout(() => {
          setShowCompletionModal(true);
        }, 800);
      }
      // If it was a user quit, don't show any additional dialogs
    }
  }, [gameState.isGameComplete, gameState.isGameLost, gameState.isUserQuit]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  const controlsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: controlsOpacity.value,
    };
  });

  // PERFORMANCE: Memoize handlers
  const handleNumberPress = useCallback((number: number) => {
    // Pass the showMistakes setting to the handleNumberPress function
    gameActions.handleNumberPress(number, gameSettings.showMistakes);
  }, [gameActions, gameSettings.showMistakes]);

  const handleHintPress = useCallback(() => {
    const result = gameActions.handleHintPress();

    if (result) {
      switch (result.type) {
        case "cell-hint":
          showAlert(hintCellAlert());
          break;
        case "no-errors":
          showAlert(noErrorsAlert());
          break;
        case "initial-cell":
          showAlert(initialCellAlert());
          break;
        case "no-hints":
          showAlert(noHintsAlert());
          break;
      }
    } else {
      showAlert(noHintsAlert());
    }
  }, [gameActions, showAlert]);

  const handleAutoNotesPress = useCallback(() => {
    if (gameActions.handleAutoNotesPress()) {
      showAlert(autoNotesAlert());
    }
  }, [gameActions, showAlert]);

  const handleBackPress = useCallback(async () => {
    if (gameState.isGameRunning && !gameState.isGameComplete) {
      // Pause the game automatically
      await gameActions.pauseGame();
      router.navigate("../");
    } else {
      router.navigate("../");
    }
  }, [gameState.isGameRunning, gameState.isGameComplete, gameActions, router]);

  const handleSettingsPress = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setShowSettings(false);
  }, []);

  const handleQuitFromSettings = useCallback(() => {
    showAlert(
      quitGameAlert(async () => {
        // Mark as quit/loss in statistics before navigating
        await gameActions.handleQuitGame();
        // Clear any paused game state
        await clearPausedGame();
        setShowSettings(false);
        router.navigate("../");
      })
    );
  }, [showAlert, gameActions, router]);

  const handlePauseFromSettings = useCallback(async () => {
    // Pause the game and navigate back
    await gameActions.pauseGame();
    setShowSettings(false);
    router.navigate("../");
  }, [gameActions, router]);

  const handlePausePress = useCallback(() => {
    setShowPauseModal(true);
  }, []);

  const handlePauseModalResume = useCallback(() => {
    setShowPauseModal(false);
  }, []);

  // Handlers for completion modal
  const handleCompletionModalClose = useCallback(() => {
    setShowCompletionModal(false);
  }, []);

  const handleNavigateToHome = useCallback(() => {
    setShowCompletionModal(false);
    setTimeout(() => {
      router.navigate("../");
    }, 100);
  }, [router]);

  // If board is not yet loaded
  // If board is not yet loaded
  if (gameState.board.length === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom, // NEU HINZUFÜGEN
          },
        ]}
      >
        <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />
        <View style={styles.loadingContainer}>
          <Animated.View
            entering={FadeIn.duration(500)}
            style={{ alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: typography.size.xl,
                fontWeight: "600",
                color: colors.textPrimary,
                marginBottom: 16,
              }}
            >
              {shouldResume ? t('loading.resume') : t('loading.generate')}
            </Text>
            <Animated.View entering={FadeIn.delay(300).duration(500)}>
              <Feather name="loader" size={32} color={colors.primary} />
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: insets.bottom, // NEU HINZUFÜGEN
        },
      ]}
    >
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />
      {/* Background decoration */}
      <Animated.View
        style={[
          styles.topDecoration,
          { backgroundColor: colors.primary, opacity: 0.04 },
        ]}
        entering={FadeIn.duration(800)}
      />

      <View style={{ flex: 1 }}>
        <Animated.View style={headerAnimatedStyle}>
          <GameHeader
            onBackPress={handleBackPress}
            onSettingsPress={handleSettingsPress}
            errorsRemaining={gameState.errorsRemaining}
            maxErrors={3}
            showErrors={gameSettings.showMistakes}
            isTimerRunning={gameState.isGameRunning && !gameState.isGameComplete && !showSettings && !showPauseModal}
            initialTime={gameState.gameTime}
            onTimeUpdate={gameActions.handleTimeUpdate}
            onPausePress={handlePausePress}
            pauseDisabled={gameState.isGameComplete}
          />
        </Animated.View>

        <View style={styles.gameContent}>
          {/* Spacer 1 - Header zu Board */}
          <View style={styles.spacer} />

          {/* Game Board */}
          <GameBoard
            board={gameState.board}
            selectedCell={gameState.selectedCell}
            onCellPress={showPauseModal ? undefined : gameActions.handleCellPress}
            isLoading={gameState.isLoading}
            highlightRelated={gameSettings.highlightRelatedCells}
            highlightSameValues={gameSettings.highlightSameValues}
            showErrors={gameSettings.showMistakes}
          />

          {/* Spacer 2 - Board zu Controls */}
          <View style={styles.spacer} />

          {/* Game Controls */}
          <Animated.View
            style={[styles.controlsContainer, controlsAnimatedStyle]}
          >
            <GameControls
              onNumberPress={handleNumberPress}
              onErasePress={gameActions.handleErasePress}
              onNoteToggle={gameActions.toggleNoteMode}
              onHintPress={handleHintPress}
              noteModeActive={gameState.noteModeActive}
              disabledNumbers={gameState.usedNumbers}
              hintsRemaining={gameState.hintsRemaining}
              isGameComplete={gameState.isGameComplete}
            />
          </Animated.View>

          {/* Spacer 3 - Controls zu Bottom */}
          <View style={styles.spacer} />
        </View>
      </View>

      {/* Game Completion Flow */}
      <GameCompletionFlow
        visible={showCompletionModal}
        onClose={handleCompletionModalClose}
        onNewGame={handleCompleteGameRestart}
        onContinue={handleNavigateToHome}
        timeElapsed={gameState.gameTime}
        difficulty={gameState.difficulty}
        autoNotesUsed={gameState.autoNotesUsed}
        stats={gameState.gameStats}
        streakInfo={gameState.streakInfo}
      />

      {/* Settings Panel */}
      <GameSettingsPanel
        visible={showSettings}
        onClose={handleSettingsClose}
        onQuitGame={handleQuitFromSettings}
        onPauseGame={handlePauseFromSettings}
        onAutoNotes={handleAutoNotesPress}
        onSettingsChanged={gameSettings.updateSetting}
      />

      {/* Pause Modal */}
      <PauseModal
        visible={showPauseModal}
        onResume={handlePauseModalResume}
        gameTime={gameState.gameTime}
        errorsRemaining={gameState.errorsRemaining}
        maxErrors={3}
        difficulty={gameState.difficulty}
      />
    </View>
  );
};

export default Game;
