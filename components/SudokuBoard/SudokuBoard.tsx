import React, { useCallback } from "react";
import { View } from "react-native";
import {
  SudokuBoard as SudokuBoardType,
  CellPosition,
  getRelatedCells,
} from "@/utils/sudoku";
import SudokuCell from "../SudokuCell/SudokuCell";
import styles from "./SudokuBoard.styles";

interface SudokuBoardProps {
  board: SudokuBoardType;
  selectedCell: CellPosition | null;
  highlightSameValue?: boolean;
  onCellPress: (row: number, col: number) => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  selectedCell,
  highlightSameValue = true,
  onCellPress,
}) => {
  // Prüft, ob eine Zelle ausgewählt ist
  const isSelected = useCallback(
    (row: number, col: number) => {
      return (
        selectedCell !== null &&
        selectedCell.row === row &&
        selectedCell.col === col
      );
    },
    [selectedCell]
  );

  // Prüft, ob eine Zelle mit der ausgewählten Zelle verwandt ist (gleiche Zeile/Spalte/Box)
  const isRelated = useCallback(
    (row: number, col: number) => {
      if (!selectedCell) return false;
      if (isSelected(row, col)) return false;

      const relatedCells = getRelatedCells(selectedCell.row, selectedCell.col);
      return relatedCells.some((cell) => cell.row === row && cell.col === col);
    },
    [selectedCell, isSelected]
  );

  // Prüft, ob eine Zelle den gleichen Wert wie die ausgewählte Zelle hat
  const hasSameValue = useCallback(
    (row: number, col: number) => {
      if (!selectedCell) return false;
      if (isSelected(row, col)) return false;

      const selectedValue = board[selectedCell.row][selectedCell.col].value;
      const currentValue = board[row][col].value;

      return selectedValue !== 0 && selectedValue === currentValue;
    },
    [selectedCell, board]
  );

  // Rendere das Board
  return (
    <View style={styles.boardContainer}>
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => (
              <SudokuCell
                key={`cell-${rowIndex}-${colIndex}`}
                cell={cell}
                row={rowIndex}
                col={colIndex}
                isSelected={isSelected(rowIndex, colIndex)}
                isRelated={isRelated(rowIndex, colIndex)}
                sameValueHighlight={
                  highlightSameValue && hasSameValue(rowIndex, colIndex)
                }
                onPress={onCellPress}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default SudokuBoard;
