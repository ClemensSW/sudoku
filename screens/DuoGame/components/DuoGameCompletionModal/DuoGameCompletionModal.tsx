// screens/DuoGame/components/DuoGameCompletionModal/DuoGameCompletionModal.tsx
import React from "react";
import { View, StyleSheet, ImageSourcePropType } from "react-native";
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
  // Neue Props für Spieler-Daten
  ownerName: string;
  ownerAvatarSource: ImageSourcePropType;
  opponentName: string;
  opponentAvatarSource: ImageSourcePropType;
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
  ownerName,
  ownerAvatarSource,
  opponentName,
  opponentAvatarSource,
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

  // Bestimme den Namen des Gewinners für den Header
  const getWinnerName = (): string => {
    if (winner === 0) return ""; // Tie - kein Gewinner
    // Player 1 = Handybesitzer (unten), Player 2 = Gegner (oben)
    return winner === 1 ? ownerName : opponentName;
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

        {/* Header mit dynamischem Gewinner-Namen */}
        <CompletionHeader
          gameTime={gameTime}
          winner={winner}
          winReason={winReason}
          progressColor={progressColor}
          winnerName={getWinnerName()}
        />

        {/* Battle Container - Vertikales Layout */}
        <View style={styles.battleContainer}>
          {/* Gegner Card (Player 2 - oben, hat Top-Controls im Spiel) */}
          <PlayerCard
            player={2}
            isWinner={winner === 2}
            isTie={winner === 0}
            completionPercentage={getCellCompletionPercentage(2)}
            progressColor={progressColor}
            playerScale={player2Scale}
            trophyScale={trophy2Scale}
            playerName={opponentName}
            avatarSource={opponentAvatarSource}
            isBottomPlayer={false}
          />

          {/* VS Divider */}
          <VSDivider vsScale={vsScale} />

          {/* Handybesitzer Card (Player 1 - unten, hat Bottom-Controls im Spiel) */}
          <PlayerCard
            player={1}
            isWinner={winner === 1}
            isTie={winner === 0}
            completionPercentage={getCellCompletionPercentage(1)}
            progressColor={progressColor}
            playerScale={player1Scale}
            trophyScale={trophy1Scale}
            playerName={ownerName}
            avatarSource={ownerAvatarSource}
            isBottomPlayer={true}
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
    borderRadius: 24,
  },
  battleContainer: {
    width: "90%",
    flexDirection: "column", // Vertikales Layout
    justifyContent: "center",
    alignItems: "center",
    gap: 16, // Abstand zwischen den Elementen
    marginTop: 0,
  },
});

export default DuoGameCompletionModal;
