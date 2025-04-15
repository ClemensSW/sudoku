// screens/DuoGameScreen/DuoGameScreen.tsx
import React, { useEffect } from "react";
import { View, BackHandler, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { quitGameAlert } from "@/components/CustomAlert/AlertHelpers";

// Duo Game Components
import Header from "@/components/Header/Header";
import DuoGameBoard from "./components/DuoGameBoard";
import DuoGameControls from "./components/DuoGameControls";

// Game Logic
import { useDuoGameState } from "./hooks/useDuoGameState";
import { Difficulty } from "@/utils/sudoku";

interface DuoGameScreenProps {
  initialDifficulty?: Difficulty;
}

const DuoGameScreen: React.FC<DuoGameScreenProps> = ({
  initialDifficulty = "medium",
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const { showAlert } = useAlert();

  // Use the duo game state hook
  const [gameState, gameActions] = useDuoGameState(initialDifficulty, () => {
    router.replace("/duo");
  });

  // Start a new game on mount
  useEffect(() => {
    gameActions.startNewGame();
  }, []);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (gameState.isGameRunning && !gameState.isGameComplete) {
          showAlert(
            quitGameAlert(() => {
              router.replace("/duo");
            })
          );
          return true; // Prevents default back action
        }
        return false; // Allow default back action
      }
    );

    return () => backHandler.remove();
  }, [gameState.isGameRunning, gameState.isGameComplete]);

  // Handle back navigation
  const handleBackPress = () => {
    if (gameState.isGameRunning && !gameState.isGameComplete) {
      showAlert(
        quitGameAlert(() => {
          router.replace("/duo");
        })
      );
    } else {
      router.replace("/duo");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Header - with skipTopPadding to avoid double padding */}
        <Header
          title="Sudoku Duo"
          onBackPress={handleBackPress}
          skipTopPadding={true}
        />

        {/* Main content */}
        <Animated.View
          style={styles.content}
          entering={FadeIn.delay(200).duration(500)}
        >
          {/* Player 2 Controls (Top) */}
          <DuoGameControls
            position="top"
            onNumberPress={gameActions.handleNumberPress}
            onClear={gameActions.handleClear}
            onNoteToggle={gameActions.handleNoteToggle}
            onHint={gameActions.handleHint}
            noteMode={gameState.player2NoteMode}
            disabled={gameState.player2Complete}
            hintsRemaining={gameState.player2Hints}
          />

          {/* Game Board */}
          <DuoGameBoard
            board={gameState.board}
            player1Cell={gameState.player1Cell}
            player2Cell={gameState.player2Cell}
            getCellOwner={gameActions.getCellOwner}
            onCellPress={gameActions.handleCellPress}
            isLoading={gameState.isLoading}
          />

          {/* Player 1 Controls (Bottom) */}
          <DuoGameControls
            position="bottom"
            onNumberPress={gameActions.handleNumberPress}
            onClear={gameActions.handleClear}
            onNoteToggle={gameActions.handleNoteToggle}
            onHint={gameActions.handleHint}
            noteMode={gameState.player1NoteMode}
            disabled={gameState.player1Complete}
            hintsRemaining={gameState.player1Hints}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between", // Distribute components evenly
  },
});

export default DuoGameScreen;