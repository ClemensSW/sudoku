// screens/DuoGameScreen/components/DuoGameBoard.tsx
// Gap-basiertes Layout (identisch zu Single-Player SudokuBoard)
import React from "react";
import { View, ActivityIndicator } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { SudokuBoard, CellPosition } from "@/utils/sudoku";
import DuoSudokuBox from "./DuoSudokuBox";
import styles, {
  GRID_SIZE,
  CELL_SIZE,
  BOX_GAP,
  CELL_GAP,
} from "./DuoGameBoard.styles";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { getDividerColor } from "@/utils/duoColors";
import { getGapColor } from "@/utils/theme/colors";
import { useProgressColor } from "@/contexts/color/ColorContext";
import { useCompletionAnimation } from "@/screens/Game/hooks/useCompletionAnimation";

interface DuoGameBoardProps {
  board: SudokuBoard;
  player1Cell: CellPosition | null;
  player2Cell: CellPosition | null;
  lastChangedCell?: CellPosition | null;
  getCellOwner: (row: number, col: number) => 0 | 1 | 2;
  onCellPress: (player: 1 | 2, row: number, col: number) => void;
  isLoading?: boolean;
  showErrors?: boolean;
}

const DuoGameBoard: React.FC<DuoGameBoardProps> = ({
  board,
  player1Cell,
  player2Cell,
  lastChangedCell,
  getCellOwner,
  onCellPress,
  isLoading = false,
  showErrors = true,
}) => {
  const { isDark } = useTheme();
  const pathColorHex = useProgressColor();

  // Completion animation hook
  const { checkForCompletions, getCellAnimation, reset: resetCompletionAnimation } = useCompletionAnimation();

  // Gap-Farbe für Grid-Linien (wie Single-Player)
  const gapColor = React.useMemo(
    () => getGapColor(pathColorHex, isDark),
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
    // Reset completion animations when loading new game
    if (isLoading) {
      resetCompletionAnimation();
    }
  }, [isLoading, scale, resetCompletionAnimation]);

  // Check for row/column/box completions when a cell changes
  // IMPORTANT: Must also call when lastChangedCell is null to initialize previousBoardRef
  React.useEffect(() => {
    if (board.length > 0) {
      checkForCompletions(board, lastChangedCell ?? null);
    }
  }, [board, lastChangedCell, checkForCompletions]);

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

  // Berechnung der Positionen für die Stepped-Divider
  // Gap-basiertes Layout: Position = Zellen + Box-Gaps + Cell-Gaps
  const calculatePosition = (cellsFromStart: number) => {
    // Anzahl vollständiger 3x3 Box-Grenzen
    const boxGaps = Math.floor(cellsFromStart / 3) * BOX_GAP;
    // Anzahl Cell-Gaps innerhalb der aktuellen Box
    const cellGapsWithinBoxes = (cellsFromStart % 3) * CELL_GAP;
    // Anzahl Cell-Gaps von vorherigen Boxen (2 pro Box)
    const cellGapsFromPreviousBoxes = Math.floor(cellsFromStart / 3) * 2 * CELL_GAP;
    // Gesamte Zellen-Größe
    const cellsSize = cellsFromStart * CELL_SIZE;
    return cellsSize + boxGaps + cellGapsWithinBoxes + cellGapsFromPreviousBoxes;
  };

  // Y-Positionen für Divider (relativ zum Grid)
  // Untere Linie: am BOTTOM der Mittelzelle (nicht am TOP der nächsten Reihe!)
  const leftDividerY = calculatePosition(5) - 3;
  const rightDividerY = calculatePosition(4); // Obere Linie: am TOP der Mittelzelle

  const dividerColor = getDividerColor(pathColorHex);

  return (
    <View style={styles.boardContainer}>
      {/* Stepped Divider - Fluss-Effekt zur Mittelzelle */}
      {/* Linke Linie: Bildschirmrand links → linke Kante der Mittelzelle */}
      <View
        style={[
          styles.dividerExtension,
          {
            left: 0,
            right: '50%',
            marginRight: CELL_SIZE / 2,  // Stoppt an linker Kante der Mittelzelle
            top: leftDividerY,
            backgroundColor: dividerColor,
          },
        ]}
      />
      {/* Rechte Linie: rechte Kante der Mittelzelle → Bildschirmrand rechts */}
      <View
        style={[
          styles.dividerExtension,
          {
            right: 0,
            left: '50%',
            marginLeft: CELL_SIZE / 2,  // Startet an rechter Kante der Mittelzelle
            top: rightDividerY,
            backgroundColor: dividerColor,
          },
        ]}
      />

      <Animated.View style={[
        styles.boardWrapper,
        styles.boardAnimationContainer,
        animatedStyle,
        {
          // Leuchtender Path Color Glow (wie Single-Player)
          shadowColor: pathColorHex,
          shadowOpacity: isDark ? 0.6 : 0.35,
          shadowRadius: isDark ? 16 : 12,
          elevation: 10,
        }
      ]}>
        <View style={styles.board}>
          {/* Grid-Container - backgroundColor zeigt durch die Gaps als Grid-Linien */}
          <View style={[styles.gridContainer, { backgroundColor: gapColor }]}>
            <View style={styles.boxesContainer}>
              {[0, 1, 2].map((boxRow) => (
                <View key={boxRow} style={styles.boxRow}>
                  {[0, 1, 2].map((boxCol) => (
                    <DuoSudokuBox
                      key={`box-${boxRow}-${boxCol}`}
                      boxRow={boxRow}
                      boxCol={boxCol}
                      board={board}
                      ownerGrid={ownerGrid}
                      player1Cell={player1Cell}
                      player2Cell={player2Cell}
                      onCellPressStable={onCellPressStable}
                      showErrors={showErrors}
                      getCellAnimation={getCellAnimation}
                    />
                  ))}
                </View>
              ))}
            </View>
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

export default React.memo(DuoGameBoard);
