import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { SudokuBoard as SudokuBoardType, CellPosition } from "@/utils/sudoku";
import SudokuCell from "@/components/SudokuCell/SudokuCell";
import styles from "./SudokuBoard.styles";
import { useTheme } from "@/utils/theme";

interface SudokuBoardProps {
  board: SudokuBoardType;
  selectedCell: CellPosition | null;
  onCellPress: (row: number, col: number) => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  selectedCell,
  onCellPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Check if the cell is related to the selected cell
  const isRelatedCell = (row: number, col: number): boolean => {
    if (!selectedCell) return false;

    const isInSameRow = selectedCell.row === row;
    const isInSameCol = selectedCell.col === col;
    const isInSameBox =
      Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
      Math.floor(selectedCell.col / 3) === Math.floor(col / 3);

    return isInSameRow || isInSameCol || isInSameBox;
  };

  // Render the board
  return (
    <View
      style={[
        styles.boardContainer,
        { backgroundColor: colors.boardBackground },
      ]}
    >
      <View style={[styles.board, { borderColor: colors.gridBold }]}>
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => {
              const isSelected =
                selectedCell &&
                selectedCell.row === rowIndex &&
                selectedCell.col === colIndex;

              return (
                <SudokuCell
                  key={`cell-${rowIndex}-${colIndex}`}
                  cell={cell}
                  row={rowIndex}
                  col={colIndex}
                  isSelected={isSelected}
                  isRelated={isRelatedCell(rowIndex, colIndex)}
                  sameValueHighlight={
                    selectedCell &&
                    cell.value !== 0 &&
                    board[selectedCell.row][selectedCell.col].value ===
                      cell.value
                  }
                  onPress={onCellPress}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

export default SudokuBoard;
