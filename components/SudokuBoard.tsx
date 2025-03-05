import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SudokuBoardProps {
  puzzle: number[][];
  initialPuzzle: number[][];
  selectedCell: [number, number] | null;
  onCellPress: (row: number, col: number) => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  puzzle,
  initialPuzzle,
  selectedCell,
  onCellPress,
}) => {
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

    return (
      <TouchableOpacity
        key={`cell-${row}-${col}`}
        style={[
          styles.cell,
          (row + 1) % 3 === 0 && row !== 8 && styles.bottomBorder,
          (col + 1) % 3 === 0 && col !== 8 && styles.rightBorder,
          isSelected && styles.selectedCell,
          (isInSameRow || isInSameCol || isInSameBox) && styles.relatedCell,
          isInitial && styles.initialCell,
        ]}
        onPress={() => onCellPress(row, col)}
      >
        <Text
          style={[
            styles.cellText,
            isInitial && styles.initialCellText,
            isSelected && styles.selectedCellText,
          ]}
        >
          {value !== 0 ? value.toString() : ""}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.board}>
      {Array.from({ length: 9 }, (_, row) => (
        <View key={`row-${row}`} style={styles.row}>
          {Array.from({ length: 9 }, (_, col) => renderCell(row, col))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: 320,
    height: 320,
    borderWidth: 2,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 35.5,
    height: 35.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  bottomBorder: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  rightBorder: {
    borderRightWidth: 2,
    borderRightColor: "#000",
  },
  cellText: {
    fontSize: 18,
  },
  initialCell: {
    backgroundColor: "#f0f0f0",
  },
  initialCellText: {
    fontWeight: "bold",
  },
  selectedCell: {
    backgroundColor: "#4285F4",
  },
  selectedCellText: {
    color: "white",
  },
  relatedCell: {
    backgroundColor: "#E8F0FE",
  },
});

export default SudokuBoard;
