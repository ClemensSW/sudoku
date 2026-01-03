// components/Tutorial/pages/SudokuBoardDemo.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import { getGapColor, getCheckerboardColor } from "@/utils/theme/colors";

interface SudokuBoardDemoProps {
  puzzle: number[][];
  initialPuzzle: number[][];
  selectedCell: [number, number] | null;
  onCellPress: (row: number, col: number) => void;
}

// Gap-basierte Konstanten (wie im Single Player Game)
const BOARD_SIZE = 320;
const GRID_SIZE = BOARD_SIZE;

const BOX_GAP = 2.5;
const CELL_GAP = 1.0;

const TOTAL_GAP_SPACE = 2 * BOX_GAP + 6 * CELL_GAP;
const AVAILABLE_CELL_SPACE = GRID_SIZE - TOTAL_GAP_SPACE;
const CELL_SIZE = AVAILABLE_CELL_SPACE / 9;

const SudokuBoardDemo: React.FC<SudokuBoardDemoProps> = ({
  puzzle,
  initialPuzzle,
  selectedCell,
  onCellPress,
}) => {
  const theme = useTheme();
  const { colors, typography, isDark } = theme;
  const progressColor = useProgressColor();

  const renderCell = (row: number, col: number) => {
    const value = puzzle[row][col];
    const isInitial = initialPuzzle[row][col] !== 0;
    const isSelected =
      selectedCell && selectedCell[0] === row && selectedCell[1] === col;

    const isInSameRow = selectedCell && selectedCell[0] === row;
    const isInSameCol = selectedCell && selectedCell[1] === col;
    const isInSameBox =
      selectedCell &&
      Math.floor(selectedCell[0] / 3) === Math.floor(row / 3) &&
      Math.floor(selectedCell[1] / 3) === Math.floor(col / 3);

    // Schachbrettmuster für 3×3-Boxen (wie im Single Player Game)
    const boxRow = Math.floor(row / 3);
    const boxCol = Math.floor(col / 3);
    const isAlternateBox = (boxRow + boxCol) % 2 === 1;

    let backgroundColor = isAlternateBox
      ? getCheckerboardColor(progressColor, isDark)
      : colors.cellCheckerboardLightBackground;
    let textColor = colors.cellTextColor;

    if (isSelected) {
      backgroundColor = progressColor;
      textColor = colors.cellSelectedTextColor;
    } else if (isInSameRow || isInSameCol || isInSameBox) {
      // Verwandte Zellen: progressColor mit 35% Transparenz
      backgroundColor = progressColor + '59';
    }

    if (isInitial) {
      textColor = isSelected ? colors.cellSelectedTextColor : colors.cellInitialTextColor;
    }

    return (
      <View
        key={`cell-${row}-${col}`}
        style={[
          styles.cell,
          { backgroundColor },
        ]}
      >
        <View style={styles.cellContent}>
          <Text
            style={[
              styles.cellText,
              { color: textColor, fontSize: typography.size.lg },
              isInitial && styles.initialCellText
            ]}
          >
            {value !== 0 ? value.toString() : ""}
          </Text>
        </View>
      </View>
    );
  };

  // Render a 3x3 box
  const renderBox = (boxRow: number, boxCol: number) => {
    const startRow = boxRow * 3;
    const startCol = boxCol * 3;

    return (
      <View key={`box-${boxRow}-${boxCol}`} style={styles.box}>
        {[0, 1, 2].map((cellRowOffset) => (
          <View key={`cellRow-${boxRow}-${boxCol}-${cellRowOffset}`} style={styles.cellRow}>
            {[0, 1, 2].map((cellColOffset) =>
              renderCell(startRow + cellRowOffset, startCol + cellColOffset)
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[
      styles.boardWrapper,
      {
        // Farbiger Schatten-Effekt wie im Single Player Game
        shadowColor: progressColor,
        shadowOpacity: isDark ? 0.6 : 0.35,
        shadowRadius: isDark ? 16 : 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 10,
      },
    ]}>
      <View
        style={[
          styles.board,
          { backgroundColor: colors.boardBackgroundColor }
        ]}
      >
        <View
          style={[
            styles.gridContainer,
            { backgroundColor: getGapColor(progressColor, isDark) }
          ]}
        >
          {/* 9 Boxen (3x3) mit je 9 Zellen (3x3) */}
          <View style={styles.boxesContainer}>
            {[0, 1, 2].map((boxRow) => (
              <View key={`boxRow-${boxRow}`} style={styles.boxRow}>
                {[0, 1, 2].map((boxCol) => renderBox(boxRow, boxCol))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    flexDirection: "column",
    overflow: "hidden",
  },
  boxesContainer: {
    flex: 1,
    flexDirection: "column",
    gap: BOX_GAP,
  },
  boxRow: {
    flexDirection: "row",
    flex: 1,
    gap: BOX_GAP,
  },
  box: {
    flexDirection: "column",
    flex: 1,
    gap: CELL_GAP,
  },
  cellRow: {
    flexDirection: "row",
    flex: 1,
    gap: CELL_GAP,
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cellContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  cellText: {
    // fontSize set dynamically via theme.typography
  },
  initialCellText: {
    fontWeight: "bold",
  },
});

export default SudokuBoardDemo;
