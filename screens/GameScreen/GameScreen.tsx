// screens/GameScreen/GameScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  BackHandler,
} from "react-native";
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
import {
  hintCellAlert,
  noErrorsAlert,
  initialCellAlert,
  noHintsAlert,
  autoNotesAlert,
  quitGameAlert,
  gameOverAlert,
} from "@/components/CustomAlert/AlertHelpers";
import { useNavigationControl } from "@/app/_layout"; // Import navigation control hook

import { Difficulty } from "@/utils/sudoku";
import Header from "@/components/Header/Header";
import GameCompletionModal from "@/components/GameCompletionModal";
import GameStatusBar from "@/components/GameStatusBar/GameStatusBar";

// Import custom hooks
import { useGameState } from "./hooks/useGameState";
import { useGameSettings } from "./hooks/useGameSettings";

// Import components
import GameBoard from "./components/GameBoard/GameBoard";
import GameControls from "./components/GameControls/GameControls";
import GameSettingsPanel from "./components/GameSettingsPanel/GameSettingsPanel";

import styles from "./GameScreen.styles";

interface GameScreenProps {
  initialDifficulty?: Difficulty;
}

const GameScreen: React.FC<GameScreenProps> = ({ initialDifficulty }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { setHideBottomNav } = useNavigationControl(); // Access navigation control

  // Get game state and actions from custom hook
  const [gameState, gameActions] = useGameState(initialDifficulty);

  // Get settings from custom hook
  const gameSettings = useGameSettings();

  // Local state
  const [showSettings, setShowSettings] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [gameInitialized, setGameInitialized] = useState(false); // New state to track initialization

  // Animation values
  const headerOpacity = useSharedValue(1);
  const controlsOpacity = useSharedValue(0);

  // Hide navigation when component mounts
  useEffect(() => {
    console.log("HIDING BOTTOM NAV in GameScreen");
    // Explicitly hide navigation bar with delay to ensure context is available
    setTimeout(() => {
      setHideBottomNav(true);
    }, 100);
    
    // Clean up when component unmounts
    return () => {
      console.log("SHOWING BOTTOM NAV in GameScreen cleanup");
      setHideBottomNav(false);
    };
  }, [setHideBottomNav]); // Added setHideBottomNav as dependency

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

  // Initialize game only once
  useEffect(() => {
    // Only initialize once
    if (!gameInitialized) {
      console.log("Starting new game...");
      setTimeout(() => {
        gameActions.startNewGame();
        setGameInitialized(true);
      }, 300);
    }
  }, [gameInitialized, gameActions]);

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      if (gameState.isGameRunning && !gameState.isGameComplete) {
        handleBackPress();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [gameState.isGameRunning, gameState.isGameComplete]);

  // Function to handle complete game restart - for both game over and game completion
  const handleCompleteGameRestart = () => {
    // Wait for animation/alert to close
    setTimeout(() => {
      // Navigate to game screen with difficulty parameter to completely restart the game
      router.replace({
        pathname: "/game",
        params: { difficulty: gameState.difficulty }
      });
    }, 200);
  };

  // Check for game completion and show modal
  useEffect(() => {
    if (gameState.isGameComplete && !showCompletionModal && !showGameOverModal) {
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

  // Handle number press
  const handleNumberPress = (number: number) => {
    // Pass the showMistakes setting to the handleNumberPress function
    gameActions.handleNumberPress(number, gameSettings.showMistakes);
  };

  // Handle hint press with alerts
  const handleHintPress = () => {
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
  };

  // Handle auto notes
  const handleAutoNotesPress = () => {
    if (gameActions.handleAutoNotesPress()) {
      showAlert(autoNotesAlert());
    }
  };

  // Handle back navigation with quit tracking
  const handleBackPress = () => {
    if (gameState.isGameRunning && !gameState.isGameComplete) {
      showAlert(
        quitGameAlert(
          async () => {
            // Mark as quit/loss in statistics before navigating
            await gameActions.handleQuitGame();
            router.navigate("../");
          },
          undefined
        )
      );
    } else {
      router.navigate("../");
    }
  };

  // Handle settings button
  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  // Handle settings close
  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  // Handle quit from settings with quit tracking
  const handleQuitFromSettings = async () => {
    // Mark as quit/loss in statistics before navigating
    await gameActions.handleQuitGame();
    setShowSettings(false);
    router.navigate("../");
  };

  // Handlers for completion modal
  const handleCompletionModalClose = () => {
    setShowCompletionModal(false);
  };

  const handleNavigateToHome = () => {
    setShowCompletionModal(false);
    setTimeout(() => {
      router.navigate("../");
    }, 100);
  };

  // If board is not yet loaded
  if (gameState.board.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />
        <View style={styles.loadingContainer}>
          <Animated.View
            entering={FadeIn.duration(500)}
            style={{ alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: colors.textPrimary,
                marginBottom: 16,
              }}
            >
              Sudoku generieren...
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Header
            title="Sudoku"
            onBackPress={handleBackPress}
            rightAction={{
              icon: "settings",
              onPress: handleSettingsPress,
            }}
            skipTopPadding={false}
          />
        </Animated.View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <View style={styles.gameContainer}>
            {/* Game Status Bar */}
            <GameStatusBar
              isRunning={gameState.isGameRunning && !gameState.isGameComplete}
              initialTime={gameState.gameTime}
              onTimeUpdate={gameActions.handleTimeUpdate}
              errorsRemaining={gameState.errorsRemaining}
              maxErrors={3}
              showErrors={gameSettings.showMistakes}
            />

            {/* Game Board */}
            <GameBoard
              board={gameState.board}
              selectedCell={gameState.selectedCell}
              onCellPress={gameActions.handleCellPress}
              isLoading={gameState.isLoading}
              highlightRelated={gameSettings.highlightRelatedCells}
              highlightSameValues={gameSettings.highlightSameValues}
              showErrors={gameSettings.showMistakes}
            />

            {/* Game Controls */}
            <Animated.View style={[styles.controlsContainer, controlsAnimatedStyle]}>
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
          </View>
        </ScrollView>
      </View>

      {/* Game Completion Modal */}
      <GameCompletionModal
        visible={showCompletionModal}
        onClose={handleCompletionModalClose}
        onNewGame={handleCompleteGameRestart} // Use the same restart function here
        onContinue={handleNavigateToHome}
        timeElapsed={gameState.gameTime}
        difficulty={gameState.difficulty}
        autoNotesUsed={gameState.autoNotesUsed}
        stats={gameState.gameStats}
      />

      {/* Settings Panel */}
      <GameSettingsPanel
        visible={showSettings}
        onClose={handleSettingsClose}
        onQuitGame={handleQuitFromSettings}
        onAutoNotes={handleAutoNotesPress}
        onSettingsChanged={gameSettings.updateSetting}
      />
    </View>
  );
};

export default GameScreen;