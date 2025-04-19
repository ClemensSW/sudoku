// screens/DuoGameScreen/DuoGameScreen.tsx - aktualisierte Version
import React, { useEffect } from "react";
import { View, BackHandler, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { quitGameAlert } from "@/components/CustomAlert/AlertHelpers";
import { useNavigationControl } from "@/app/_layout";

// Duo Game Components
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
  const { setHideBottomNav } = useNavigationControl();

  // Use the duo game state hook
  const [gameState, gameActions] = useDuoGameState(initialDifficulty, () => {
    router.replace("/duo");
  });

  // Start a new game on mount
  useEffect(() => {
    gameActions.startNewGame();
  }, []);

  // Hide navigation when component mounts
  useEffect(() => {
    setHideBottomNav(true);
    
    // Clean up when component unmounts
    return () => {
      setHideBottomNav(false);
    };
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
        {/* Minimal floating back button instead of header */}
        <TouchableOpacity 
          style={[
            styles.backButton, 
            { backgroundColor: theme.isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)" }
          ]}
          onPress={handleBackPress}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Increased hit area
        >
          <Feather name="chevron-left" size={24} color={theme.isDark ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>

        {/* Main content - now with full height */}
        <Animated.View
          style={styles.content}
          entering={FadeIn.delay(200).duration(500)}
        >
          {/* Player 2 Controls (Top) */}
          <DuoGameControls
            position="top"
            onNumberPress={gameActions.handleNumberPress}
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
    paddingTop: 16, // Added top padding to create safe space below back button
    justifyContent: "space-between", // Distribute components evenly
  },
  backButton: {
    position: "absolute",
    top: 8, // Increased from 12 to create more separation
    left: 16,
    width: 36, // Increased from 36 for a larger tap target
    height: 36, // Increased from 36 for a larger tap target
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5, // Increased shadow for better visibility
  }
});

export default DuoGameScreen;