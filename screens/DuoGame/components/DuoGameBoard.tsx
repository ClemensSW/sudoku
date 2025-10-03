// screens/DuoGameScreen/components/DuoGameBoard.tsx
import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { SudokuBoard, CellPosition } from "@/utils/sudoku";
import DuoGameCell from "./DuoGameCell";
import {
  BOARD_SIZE as SHARED_BOARD_SIZE,
  CELL_SIZE as SHARED_CELL_SIZE,
} from "@/screens/Game/components/SudokuBoard/SudokuBoard.styles";

// Use the same board size as regular SudokuBoard
const BOARD_SIZE = SHARED_BOARD_SIZE;
const GRID_SIZE = BOARD_SIZE * 0.95;
// DuoGameBoard has borderWidth: 2 (instead of 1.5 like SudokuBoard)
// So we need to recalculate CELL_SIZE to account for the thicker border
const GRID_BORDER_WIDTH = 2;
const CELL_SIZE = (GRID_SIZE - 2 * GRID_BORDER_WIDTH) / 9;

// Player color themes
const PLAYER_COLORS = {
  1: "#4A7D78", // Teal - Player 1 (bottom)
  2: "#F3EFE3", // Light beige - Player 2 (top)
  0: "#E0E8E7", // Neutral - Middle cell
} as const;

interface DuoGameBoardProps {
  board: SudokuBoard;
  player1Cell: CellPosition | null;
  player2Cell: CellPosition | null;
  getCellOwner: (row: number, col: number) => 0 | 1 | 2;
  onCellPress: (player: 1 | 2, row: number, col: number) => void;
  isLoading?: boolean;
  showErrors?: boolean;
}

const DuoGameBoard: React.FC<DuoGameBoardProps> = ({
  board,
  player1Cell,
  player2Cell,
  getCellOwner,
  onCellPress,
  isLoading = false,
  showErrors = true,
}) => {
  // --- One-time board entrance animation & subtle loading scale ---
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (board.length > 0) {
      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board.length]);

  React.useEffect(() => {
    scale.value = withTiming(isLoading ? 0.97 : 1, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isLoading, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // --- Precompute static ownership grid to avoid calling getCellOwner 81x per render ---
  const ownerGrid: (0 | 1 | 2)[][] = React.useMemo(() => {
    if (!board || board.length === 0) return [];
    const rows = board.length;
    const cols = board[0].length;
    const og: (0 | 1 | 2)[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => getCellOwner(r, c))
    );
    return og;
  }, [board, getCellOwner]);

  // --- Stable cell press handler (no per-cell closures) ---
  const onCellPressStable = React.useCallback(
    (row: number, col: number) => {
      const playerNum = ownerGrid[row]?.[col] ?? getCellOwner(row, col);

      if (playerNum === 0) {
        // Middle cell: pick the player with an active selection; fallback to P1
        if (player1Cell) {
          onCellPress(1, row, col);
        } else if (player2Cell) {
          onCellPress(2, row, col);
        } else {
          onCellPress(1, row, col);
        }
      } else {
        onCellPress(playerNum as 1 | 2, row, col);
      }
    },
    [getCellOwner, onCellPress, ownerGrid, player1Cell, player2Cell]
  );

  // --- Render helpers kept pure & small so React.memo on cells can shine ---
  const isSelected = React.useCallback(
    (row: number, col: number) =>
      (player1Cell?.row === row && player1Cell?.col === col) ||
      (player2Cell?.row === row && player2Cell?.col === col),
    [player1Cell, player2Cell]
  );

  return (
    <View style={styles.boardContainer}>
      <Animated.View style={[styles.boardWrapper, animatedStyle]}>
        <View style={styles.board}>
          {/* Player areas + gradient (static) */}
          <View style={styles.playerAreasContainer} pointerEvents="none">
            <View
              style={[
                styles.playerAreaBackground,
                { top: 0, height: BOARD_SIZE * 0.47, backgroundColor: PLAYER_COLORS[2] },
              ]}
            />
            <LinearGradient
              colors={[PLAYER_COLORS[2], PLAYER_COLORS[1]]}
              style={[
                styles.gradientTransition,
                { top: BOARD_SIZE * 0.47, height: BOARD_SIZE * 0.15 },
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <View
              style={[
                styles.playerAreaBackground,
                { bottom: 0, height: BOARD_SIZE * 0.45, backgroundColor: PLAYER_COLORS[1] },
              ]}
            />
            {/* Middle cell highlight */}
            <View
              style={[
                styles.middleCellBackground,
                {
                  left: CELL_SIZE * 4,
                  top: BOARD_SIZE * 0.47 + BOARD_SIZE * 0.15 / 2 - CELL_SIZE / 2,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                },
              ]}
            />
          </View>

          {/* Grid + cells */}
          <View style={styles.gridContainer}>
            {/* 3x3 separators */}
            <View style={[styles.gridLine, styles.horizontalGridLine, { top: CELL_SIZE * 3 }]} />
            <View style={[styles.gridLine, styles.horizontalGridLine, { top: CELL_SIZE * 6 }]} />
            <View style={[styles.gridLine, styles.verticalGridLine, { left: CELL_SIZE * 3 }]} />
            <View style={[styles.gridLine, styles.verticalGridLine, { left: CELL_SIZE * 6 }]} />

            {/* Cells */}
            {board.map((rowData, r) => (
              <View key={`row-${r}`} style={styles.row}>
                {rowData.map((cellData, c) => (
                  <DuoGameCell
                    key={`cell-${r}-${c}`}
                    cell={cellData}
                    row={r}
                    col={c}
                    player={ownerGrid[r]?.[c] ?? 0}
                    isSelected={isSelected(r, c)}
                    onPress={onCellPressStable}
                    rotateForPlayer2={true}
                    showErrors={showErrors}
                  />
                ))}
              </View>
            ))}
          </View>

          {/* Loading overlay */}
          {isLoading && (
            <Animated.View style={styles.loadingOverlay} entering={FadeIn.duration(200)}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  boardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  playerAreasContainer: {
    position: "absolute",
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    overflow: "hidden",
    borderRadius: 8,
    zIndex: 0,
  },
  playerAreaBackground: {
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
  },
  gradientTransition: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
  },
  middleCellBackground: {
    position: "absolute",
    backgroundColor: PLAYER_COLORS[0],
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.4)",
    overflow: "hidden",
    position: "relative",
    borderRadius: 8,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    height: CELL_SIZE,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 2,
  },
  horizontalGridLine: {
    width: GRID_SIZE,
    height: 2,
    left: 0,
  },
  verticalGridLine: {
    width: 2,
    height: GRID_SIZE,
    top: 0,
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderRadius: 8,
  },
});

export default React.memo(DuoGameBoard);
