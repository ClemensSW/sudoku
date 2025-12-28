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
import { useTheme } from "@/utils/theme/ThemeProvider";
import { getDuoBoardColors, getDividerColor } from "@/utils/duoColors";
import { useStoredColorHex } from "@/contexts/color/ColorContext";

// Use the same board size as regular SudokuBoard
const BOARD_SIZE = SHARED_BOARD_SIZE;
const GRID_SIZE = BOARD_SIZE * 0.95;
// DuoGameBoard has borderWidth: 2 (instead of 1.5 like SudokuBoard)
// So we need to recalculate CELL_SIZE to account for the thicker border
const GRID_BORDER_WIDTH = 2;
const CELL_SIZE = (GRID_SIZE - 2 * GRID_BORDER_WIDTH) / 9;

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
  const { isDark } = useTheme();
  const pathColorHex = useStoredColorHex();
  const boardColors = React.useMemo(
    () => getDuoBoardColors(pathColorHex, isDark),
    [pathColorHex, isDark]
  );

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

  // Berechnung der Positionen für die Trennlinien-Extensions
  // Die Zell-Borders sind INNERHALB der Zellen (2px hoch), daher -2 um mit dem Border zu überlappen
  const gridOffset = (BOARD_SIZE - GRID_SIZE) / 2 + GRID_BORDER_WIDTH;
  const leftExtensionY = gridOffset + CELL_SIZE * 5 - 2; // Oberkante des Bottom-Borders von Row 4
  const rightExtensionY = gridOffset + CELL_SIZE * 4 - 2; // Oberkante des Bottom-Borders von Row 3
  const dividerColor = getDividerColor(pathColorHex); // 70% Opacity für dezentere Linie

  return (
    <View style={styles.boardContainer}>
      {/* Linke Trennlinien-Extension (unter Row 4, von Bildschirmrand bis Grid-Rand) */}
      <View
        style={[
          styles.dividerExtension,
          {
            left: 0,
            right: '50%',
            // Endet am linken Grid-Rand (nicht in der Mitte, um Überlappung mit Cell-Borders zu vermeiden)
            marginRight: GRID_SIZE / 2,
            top: leftExtensionY,
            backgroundColor: dividerColor,
          },
        ]}
      />

      {/* Rechte Trennlinien-Extension (unter Row 3, von Grid-Rand bis Bildschirmrand) */}
      <View
        style={[
          styles.dividerExtension,
          {
            right: 0,
            left: '50%',
            // Beginnt am rechten Grid-Rand
            marginLeft: GRID_SIZE / 2,
            top: rightExtensionY,
            backgroundColor: dividerColor,
          },
        ]}
      />

      <Animated.View style={[
        styles.boardWrapper,
        animatedStyle,
        {
          // Leuchtender Path Color Glow (wie LevelCard - nur Shadow, kein Border!)
          shadowColor: pathColorHex,  // Farbiger Glow-Effekt!
          shadowOpacity: isDark ? 0.6 : 0.35,  // Stärker im Dark Mode
          shadowRadius: isDark ? 16 : 12,
          elevation: 10,
        }
      ]}>
        <View style={styles.board}>
          {/* Player areas + subtle lightness gradient (static) */}
          <View style={styles.playerAreasContainer} pointerEvents="none">
            {/* Player 2 Zone (oben) - 3% Lightness-Unterschied */}
            <View
              style={[
                styles.playerAreaBackground,
                { top: 0, height: BOARD_SIZE * 0.47, backgroundColor: boardColors.player2Background },
              ]}
            />
            {/* Lightness-basierter Gradient (kein farbiger Gradient!) */}
            <LinearGradient
              colors={[boardColors.player2Background, boardColors.player1Background]}
              style={[
                styles.gradientTransition,
                { top: BOARD_SIZE * 0.47, height: BOARD_SIZE * 0.15 },
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            {/* Player 1 Zone (unten) - Standard Background */}
            <View
              style={[
                styles.playerAreaBackground,
                { bottom: 0, height: BOARD_SIZE * 0.45, backgroundColor: boardColors.player1Background },
              ]}
            />
          </View>

          {/* Grid + cells */}
          <View style={[styles.gridContainer, { borderColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.4)' }]}>
            {/* 3x3 separators - deutlich sichtbar im Dark Mode */}
            <View style={[
              styles.gridLine,
              styles.horizontalGridLine,
              { top: CELL_SIZE * 3, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.4)' }
            ]} />
            <View style={[
              styles.gridLine,
              styles.horizontalGridLine,
              { top: CELL_SIZE * 6, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.4)' }
            ]} />
            <View style={[
              styles.gridLine,
              styles.verticalGridLine,
              { left: CELL_SIZE * 3, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.4)' }
            ]} />
            <View style={[
              styles.gridLine,
              styles.verticalGridLine,
              { left: CELL_SIZE * 6, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.4)' }
            ]} />

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
    overflow: "visible", // Damit die Trennlinien-Extensions nicht abgeschnitten werden
  },
  boardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    // Shadow wird dynamisch gesetzt (Path Color Glow)
    shadowOffset: { width: 0, height: 6 },
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
  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderWidth: 2,
    // borderColor dynamisch gesetzt (theme-aware)
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
    // backgroundColor dynamisch gesetzt (theme-aware)
    zIndex: 15, // Höher als Trennlinien-Zellen (z-Index 10), um nicht verdeckt zu werden
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
  dividerExtension: {
    position: "absolute",
    height: 2,
    zIndex: 20, // Über allen anderen Elementen
  },
});

export default React.memo(DuoGameBoard);
