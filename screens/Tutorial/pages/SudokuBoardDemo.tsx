// components/Tutorial/pages/SudokuBoardDemo.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";

interface SudokuBoardDemoProps {
  puzzle: number[][];
  initialPuzzle: number[][];
  selectedCell: [number, number] | null;
  onCellPress: (row: number, col: number) => void;
}

// Berechnen der optimalen Board-Größe
const BOARD_SIZE = 320;
const GRID_SIZE = BOARD_SIZE * 0.95;
const CELL_SIZE = GRID_SIZE / 9;

const SudokuBoardDemo: React.FC<SudokuBoardDemoProps> = ({
  puzzle,
  initialPuzzle,
  selectedCell,
  onCellPress,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  const renderCell = (row: number, col: number) => {
    const value = puzzle[row][col];
    const isInitial = initialPuzzle[row][col] !== 0;
    const isSelected =
      selectedCell && selectedCell[0] === row && selectedCell[1] === col;

    // Diese Logik entspricht exakt der in SudokuBoard.tsx
    const isInSameRow = selectedCell && selectedCell[0] === row;
    const isInSameCol = selectedCell && selectedCell[1] === col;
    const isInSameBox =
      selectedCell &&
      Math.floor(selectedCell[0] / 3) === Math.floor(row / 3) &&
      Math.floor(selectedCell[1] / 3) === Math.floor(col / 3);

    // Generiere die Theme-konformen Hintergrundfarben
    let backgroundColor = "transparent";
    let textColor = colors.cellTextColor; // Standard-Textfarbe
    
    if (isSelected) {
      backgroundColor = colors.cellSelectedBackground;
      textColor = colors.cellSelectedTextColor;
    } else if (isInSameRow || isInSameCol || isInSameBox) {
      backgroundColor = colors.cellRelatedBackground;
    }
    
    // Anfängliche (vorgegebene) Werte haben eine andere Textfarbe/Stil
    if (isInitial) {
      textColor = colors.cellInitialTextColor;
    }

    return (
      <View
        key={`cell-${row}-${col}`}
        style={[
          styles.cell,
          (row + 1) % 3 === 0 && row !== 8 && styles.bottomBorder,
          (col + 1) % 3 === 0 && col !== 8 && styles.rightBorder,
          { borderColor: colors.boardCellBorderColor },
        ]}
      >
        {/* Hintergrund für Hervorhebungen */}
        {backgroundColor !== "transparent" && (
          <View style={[styles.cellBackground, { backgroundColor }]} />
        )}

        {/* Zelleninhalt */}
        <Text 
          style={[
            styles.cellText, 
            { color: textColor },
            isInitial && styles.initialCellText
          ]}
        >
          {value !== 0 ? value.toString() : ""}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.boardWrapper}>
      <View 
        style={[
          styles.board, 
          { backgroundColor: colors.boardBackgroundColor }
        ]}
      >
        <View 
          style={[
            styles.gridContainer,
            { borderColor: colors.boardBorderColor }
          ]}
        >
          {/* Gridlinien als absolute Elemente */}
          <View
            style={[
              styles.gridLine,
              styles.horizontalLine,
              { top: CELL_SIZE * 3, backgroundColor: colors.boardGridLineColor },
            ]}
          />
          <View
            style={[
              styles.gridLine,
              styles.horizontalLine,
              { top: CELL_SIZE * 6, backgroundColor: colors.boardGridLineColor },
            ]}
          />
          <View
            style={[
              styles.gridLine,
              styles.verticalLine,
              { left: CELL_SIZE * 3, backgroundColor: colors.boardGridLineColor },
            ]}
          />
          <View
            style={[
              styles.gridLine,
              styles.verticalLine,
              { left: CELL_SIZE * 6, backgroundColor: colors.boardGridLineColor },
            ]}
          />

          {/* Zeilen und Zellen */}
          {Array.from({ length: 9 }, (_, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {Array.from({ length: 9 }, (_, colIndex) =>
                renderCell(rowIndex, colIndex)
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    flexDirection: "column",
    borderWidth: 1.5,
    overflow: "hidden",
    borderRadius: 8,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    height: CELL_SIZE,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    position: "relative",
  },
  bottomBorder: {
    borderBottomWidth: 2,
  },
  rightBorder: {
    borderRightWidth: 2,
  },
  cellBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  cellText: {
    fontSize: 18,
    zIndex: 2,
  },
  initialCellText: {
    fontWeight: "bold",
  },
  gridLine: {
    position: "absolute",
    zIndex: 5,
  },
  horizontalLine: {
    width: GRID_SIZE,
    height: 1.5,
    left: 0,
  },
  verticalLine: {
    width: 1.5,
    height: GRID_SIZE,
    top: 0,
  },
});

export default SudokuBoardDemo;