import React, { memo } from "react";
import { View } from "react-native";
import { SudokuBoard as BoardType, CellPosition } from "@/utils/sudoku";
import SudokuCell, { CompletionAnimationProps } from "@/screens/Game/components/SudokuCell/SudokuCell";
import styles from "./SudokuBoard.styles";
import { AnimatingCell } from "@/screens/Game/hooks/useCompletionAnimation";

interface SudokuBoxProps {
  boxRow: number;
  boxCol: number;
  board: BoardType;
  selectedCell: CellPosition | null;
  onCellPress: (row: number, col: number) => void;
  isRelatedCell: (row: number, col: number) => boolean;
  hasSameValue: (row: number, col: number) => boolean;
  showErrors: boolean;
  getCellAnimation?: (row: number, col: number) => AnimatingCell | null;
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
  getCellAnimation,
}) => {
  // Keine Border-Logik mehr nötig - Gaps übernehmen die Trennung

  // Helper to get completion animation props for a cell
  const getCompletionAnimationProps = (row: number, col: number): CompletionAnimationProps | null => {
    if (!getCellAnimation) return null;
    const anim = getCellAnimation(row, col);
    if (!anim) return null;
    return { type: anim.type, active: true, delay: anim.delay };
  };

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
                  completionAnimation={getCompletionAnimationProps(globalRow, globalCol)}
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
