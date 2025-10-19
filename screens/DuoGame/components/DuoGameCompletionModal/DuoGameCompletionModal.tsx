// screens/DuoGame/components/DuoGameCompletionModal/DuoGameCompletionModal.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import { Difficulty } from "@/utils/sudoku";
import ConfettiEffect from "@/screens/GameCompletion/components/ConfettiEffect/ConfettiEffect";

// Sub-components
import CompletionHeader from "./components/CompletionHeader";
import PlayerCard from "./components/PlayerCard";
import VSDivider from "./components/VSDivider";
import ActionButtons from "./components/ActionButtons";

// Hook
import { useCompletionAnimations } from "./hooks/useCompletionAnimations";

interface DuoGameCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onRevanche: () => void;
  winner: 0 | 1 | 2; // 0 = Tie (both complete)
  gameTime: number;
  player1Complete: boolean;
  player2Complete: boolean;
  player1Errors: number;
  player2Errors: number;
  player1Hints: number;
  player2Hints: number;
  maxHints: number;
  maxErrors: number;
  winReason: "completion" | "errors";
  currentDifficulty: Difficulty;
  // Tatsächliche Daten für die Fortschrittsberechnung
  player1InitialEmptyCells: number;
  player1SolvedCells: number;
  player2InitialEmptyCells: number;
  player2SolvedCells: number;
}

const DuoGameCompletionModal: React.FC<DuoGameCompletionModalProps> = ({
  visible,
  onClose,
  onNewGame,
  onRevanche,
  winner,
  gameTime,
  player1Complete,
  player2Complete,
  player1Errors,
  player2Errors,
  player1Hints,
  player2Hints,
  maxHints,
  maxErrors,
  winReason,
  currentDifficulty,
  player1InitialEmptyCells,
  player1SolvedCells,
  player2InitialEmptyCells,
  player2SolvedCells,
}) => {
  const { colors, isDark } = useTheme();
  const progressColor = useProgressColor(); // Theme-aware path color

  // Animations
  const {
    containerStyle,
    vsScale,
    buttonOpacity,
    player1Scale,
    player2Scale,
    trophy1Scale,
    trophy2Scale,
  } = useCompletionAnimations(visible, winner);

  // Calculate cell completion percentage
  const getCellCompletionPercentage = (player: 1 | 2): number => {
    // Bei einem Unentschieden (beide haben fertig) oder wenn dieser Spieler
    // durch vollständiges Lösen seines Bereichs gewonnen hat
    if (winner === 0 || (winner === player && winReason === "completion")) {
      return 100;
    }

    // Für alle anderen Fälle berechnen wir den tatsächlichen Prozentsatz
    if (player === 1) {
      if (player1InitialEmptyCells === 0) return 0;
      return Math.round((player1SolvedCells / player1InitialEmptyCells) * 100);
    } else {
      if (player2InitialEmptyCells === 0) return 0;
      return Math.round((player2SolvedCells / player2InitialEmptyCells) * 100);
    }
  };

  // Don't render when not visible
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            // Leuchtender Path Color Glow (wie Board!)
            shadowColor: progressColor,
            shadowOpacity: isDark ? 0.6 : 0.35,
            shadowRadius: isDark ? 16 : 12,
            elevation: 10,
            shadowOffset: { width: 0, height: 6 },
          },
          containerStyle,
        ]}
      >
        {/* Confetti effect for visual excitement */}
        <ConfettiEffect isActive={visible} density={winner === 0 ? 3 : 2} />

        {/* Header */}
        <CompletionHeader
          gameTime={gameTime}
          winner={winner}
          winReason={winReason}
          progressColor={progressColor}
        />

        {/* Battle Container */}
        <View style={styles.battleContainer}>
          {/* Player 1 Card */}
          <PlayerCard
            player={1}
            isWinner={winner === 1}
            isTie={winner === 0}
            completionPercentage={getCellCompletionPercentage(1)}
            errorsRemaining={maxErrors - player1Errors}
            hintsRemaining={maxHints - player1Hints}
            maxErrors={maxErrors}
            maxHints={maxHints}
            progressColor={progressColor}
            playerScale={player1Scale}
            trophyScale={trophy1Scale}
          />

          {/* VS Divider */}
          <VSDivider vsScale={vsScale} />

          {/* Player 2 Card */}
          <PlayerCard
            player={2}
            isWinner={winner === 2}
            isTie={winner === 0}
            completionPercentage={getCellCompletionPercentage(2)}
            errorsRemaining={maxErrors - player2Errors}
            hintsRemaining={maxHints - player2Hints}
            maxErrors={maxErrors}
            maxHints={maxHints}
            progressColor={progressColor}
            playerScale={player2Scale}
            trophyScale={trophy2Scale}
          />
        </View>

        {/* Action Buttons */}
        <ActionButtons
          onRematch={onRevanche}
          onBackToMenu={onClose}
          progressColor={progressColor}
          buttonOpacity={buttonOpacity}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 9999,
  },
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
    borderRadius: 24, // Rounded corners für Modal
  },
  battleContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 220,
    position: "relative",
    marginTop: 0,
  },
});

export default DuoGameCompletionModal;
