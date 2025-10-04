// screens/DuoGameScreen/DuoGameScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { duoQuitGameAlert } from "@/components/CustomAlert/AlertHelpers";
import { Difficulty } from "@/utils/sudoku";
import { GameSettings } from "@/utils/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Import existing components
import DuoGameBoard from "./components/DuoGameBoard";
import DuoGameControls from "./components/DuoGameControls";
import DuoGameCompletionModal from "./components/DuoGameCompletionModal";
import Timer from "@/components/Timer/Timer";

// Add this import for settings panel
import DuoGameSettingsPanel from "./components/DuoGameSettingsPanel";

// Game Logic
import { useDuoGameState } from "./hooks/useDuoGameState";
// Import settings hook
import { useGameSettings } from "../Game/hooks/useGameSettings";

// Constants
const MAX_HINTS = 3;

interface DuoGameScreenProps {
  initialDifficulty?: Difficulty;
}

const DuoGame: React.FC<DuoGameScreenProps> = ({
  initialDifficulty = "medium",
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  // States for game initialization
  const [isLoading, setIsLoading] = useState(true);
  const [gameInitialized, setGameInitialized] = useState(false);

  // States for the Completion Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState({
    winner: 0 as 0 | 1 | 2,
    reason: "completion" as "completion" | "errors",
  });

  // Add this state for settings panel
  const [showSettings, setShowSettings] = useState(false);

  // Add game settings hook
  const gameSettings = useGameSettings();

  // Initialize game state with simplified game complete callback
  const [gameState, gameActions] = useDuoGameState(
    initialDifficulty,
    () => router.replace("/duo"),
    (winner, reason) => {
      setWinnerInfo({ winner, reason });
      setShowCompletionModal(true);
    },
    gameSettings.showMistakes // Pass the showMistakes setting to useDuoGameState
  );

  // In DuoGameScreen.tsx, update this useEffect
  useEffect(() => {
    if (!gameInitialized) {
      console.log("Starting game initialization (once)");
      // Delay game initialization
      const timer = setTimeout(() => {
        try {
          gameActions.startNewGame();
          setGameInitialized(true);
          // Add extra delay before showing content
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        } catch (error) {
          console.error("Error starting new game:", error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameInitialized]); // Only depend on gameInitialized

  // Simple back button handler with confirmation
  const handleBack = () => {
    if (gameState.isGameRunning && !gameState.isGameComplete) {
      showAlert(
        duoQuitGameAlert(() => {
          router.replace("/duo");
        })
      );
    } else {
      router.replace("/duo");
    }
  };

  // Add settings button handler
  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  // Add settings close handler
  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  // Add quit from settings handler
  const handleQuitFromSettings = () => {
    showAlert(
      duoQuitGameAlert(() => {
        setShowSettings(false);
        router.replace("/duo");
      })
    );
  };

  // Handle settings changes
  const handleSettingsChanged = (
    key: keyof GameSettings,
    value: boolean | string
  ) => {
    gameSettings.updateSetting(key, value);
  };

  // Simple handlers for modal
  const handleCloseModal = () => {
    setShowCompletionModal(false);
    router.replace("/duo");
  };

  const handleNewGame = () => {
    setShowCompletionModal(false);
    setIsLoading(true);
    setTimeout(() => {
      gameActions.startNewGame();
      setIsLoading(false);
    }, 500);
  };

  const handleRematch = () => {
    setShowCompletionModal(false);
    router.replace({
      pathname: "/duo-game",
      params: { difficulty: initialDifficulty },
    });
  };

  // Loading screen
  if (isLoading || gameState.board.length === 0) {
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
        <StatusBar hidden={true} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            Spiel wird geladen...
          </Text>
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
      <StatusBar hidden={true} />

      {/* Back button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={handleBack}
        >
          <Feather name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Settings button */}
      <View style={styles.settingsButtonContainer}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={handleSettingsPress}
        >
          <Feather name="settings" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Hidden timer */}
      <View style={styles.hiddenTimer}>
        <Timer
          isRunning={gameState.isGameRunning && !showSettings}
          initialTime={gameState.gameTime}
          onTimeUpdate={gameActions.handleTimeUpdate}
        />
      </View>

      {/* Main game content */}
      <View style={styles.content}>
        {/* Player 2 Controls (Top) */}
        <DuoGameControls
          position="top"
          onNumberPress={gameActions.handleNumberPress}
          onNoteToggle={gameActions.handleNoteToggle}
          onHint={gameActions.handleHint}
          onClear={gameActions.handleClear} // Löschen-Funktion hinzugefügt
          noteMode={gameState.player2NoteMode}
          disabled={
            gameState.player2Complete ||
            gameState.player2Errors >= gameState.maxErrors
          }
          hintsRemaining={gameState.player2Hints}
          errorsCount={gameState.player2Errors}
          maxErrors={gameState.maxErrors}
          showErrors={gameSettings.showMistakes}
        />

        {/* Game Board */}
        <DuoGameBoard
          board={gameState.board}
          player1Cell={gameState.player1Cell}
          player2Cell={gameState.player2Cell}
          getCellOwner={gameActions.getCellOwner}
          onCellPress={gameActions.handleCellPress}
          isLoading={false}
          showErrors={gameSettings.showMistakes}
        />

        {/* Player 1 Controls (Bottom) */}
        <DuoGameControls
          position="bottom"
          onNumberPress={gameActions.handleNumberPress}
          onNoteToggle={gameActions.handleNoteToggle}
          onHint={gameActions.handleHint}
          onClear={gameActions.handleClear} // Löschen-Funktion hinzugefügt
          noteMode={gameState.player1NoteMode}
          disabled={
            gameState.player1Complete ||
            gameState.player1Errors >= gameState.maxErrors
          }
          hintsRemaining={gameState.player1Hints}
          errorsCount={gameState.player1Errors}
          maxErrors={gameState.maxErrors}
          showErrors={gameSettings.showMistakes}
        />
      </View>

      {/* Game Completion Modal */}
      <DuoGameCompletionModal
        visible={showCompletionModal}
        onClose={handleCloseModal}
        onNewGame={handleNewGame}
        onRevanche={handleRematch}
        winner={winnerInfo.winner}
        winReason={winnerInfo.reason}
        gameTime={gameState.gameTime}
        player1Complete={gameState.player1Complete}
        player2Complete={gameState.player2Complete}
        player1Errors={gameState.player1Errors}
        player2Errors={gameState.player2Errors}
        player1Hints={MAX_HINTS - gameState.player1Hints}
        player2Hints={MAX_HINTS - gameState.player2Hints}
        maxHints={MAX_HINTS}
        maxErrors={gameState.maxErrors}
        currentDifficulty={initialDifficulty}
        player1InitialEmptyCells={gameState.player1InitialEmptyCells}
        player1SolvedCells={gameState.player1SolvedCells}
        player2InitialEmptyCells={gameState.player2InitialEmptyCells}
        player2SolvedCells={gameState.player2SolvedCells}
      />

      {/* Settings Panel */}
      <DuoGameSettingsPanel
        visible={showSettings}
        onClose={handleSettingsClose}
        onQuitGame={handleQuitFromSettings}
        onSettingsChanged={handleSettingsChanged}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  // Fixed back button positioning
  backButtonContainer: {
    position: "absolute",
    top: 20,
    left: 16,
    zIndex: 10,
  },
  // Settings button positioning
  settingsButtonContainer: {
    position: "absolute",
    top: 20,
    right: 16,
    zIndex: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  hiddenTimer: {
    position: "absolute",
    top: -1000,
    opacity: 0,
    height: 1,
    width: 1,
  },
});

export default DuoGame;
