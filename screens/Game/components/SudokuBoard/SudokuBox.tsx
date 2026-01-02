import React, { memo } from "react";
import { View } from "react-native";
import { SudokuBoard as BoardType, CellPosition } from "@/utils/sudoku";
import SudokuCell from "@/screens/Game/components/SudokuCell/SudokuCell";
import styles from "./SudokuBoard.styles";

interface SudokuBoxProps {
  boxRow: number;
  boxCol: number;
  board: BoardType;
  selectedCell: CellPosition | null;
  onCellPress: (row: number, col: number) => void;
  isRelatedCell: (row: number, col: number) => boolean;
  hasSameValue: (row: number, col: number) => boolean;
  showErrors: boolean;
}

const SudokuBox: React.FC<SudokuBoxProps> = ({
  boxRow,
  boxCol,
  board,
  selectedCell,
  onCellPress,
  showErrors,
  isRelatedCell,
  hasSameValue,
}) => {
  // Keine Border-Logik mehr nötig - Gaps übernehmen die Trennung

  // Rendere 3x3 Zellen innerhalb dieser Box
  return (
    <View style={styles.box}>
      {[0, 1, 2].map((innerRow) => {
        const globalRow = boxRow * 3 + innerRow;

        return (
          <View key={`innerRow-${innerRow}`} style={styles.cellRow}>
            {[0, 1, 2].map((innerCol) => {
              const globalCol = boxCol * 3 + innerCol;
              const cell = board[globalRow][globalCol];

              const isSelected = !!(
                selectedCell &&
                selectedCell.row === globalRow &&
                selectedCell.col === globalCol
              );

              return (
                <SudokuCell
                  key={`cell-${globalRow}-${globalCol}`}
                  cell={cell}
                  row={globalRow}
                  col={globalCol}
                  isSelected={isSelected}
                  isRelated={isRelatedCell(globalRow, globalCol)}
                  sameValueHighlight={hasSameValue(globalRow, globalCol)}
                  onPress={onCellPress}
                  showErrors={showErrors}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default memo(SudokuBox);
