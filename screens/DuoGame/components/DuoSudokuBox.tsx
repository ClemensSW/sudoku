// screens/DuoGame/components/DuoSudokuBox.tsx
// Box-Komponente für 3x3 Zellen im Duo Mode (Gap-basiertes Layout)

import React, { useCallback } from "react";
import { View } from "react-native";
import { SudokuBoard, CellPosition } from "@/utils/sudoku";
import DuoGameCell, { CompletionAnimationProps } from "./DuoGameCell";
import styles from "./DuoGameBoard.styles";
import { AnimatingCell } from "@/screens/Game/hooks/useCompletionAnimation";

interface DuoSudokuBoxProps {
  boxRow: number;
  boxCol: number;
  board: SudokuBoard;
  ownerGrid: (0 | 1 | 2)[][];
  player1Cell: CellPosition | null;
  player2Cell: CellPosition | null;
  onCellPressStable: (row: number, col: number) => void;
  showErrors: boolean;
  getCellAnimation?: (row: number, col: number) => AnimatingCell | null;
}

const DuoSudokuBox: React.FC<DuoSudokuBoxProps> = ({
  boxRow,
  boxCol,
  board,
  ownerGrid,
  player1Cell,
  player2Cell,
  onCellPressStable,
  showErrors,
  getCellAnimation,
}) => {
  // Schachbrett-Pattern: (boxRow + boxCol) % 2 === 1
  const isCheckerboard = (boxRow + boxCol) % 2 === 1;

  // Hilfsfunktion um zu prüfen ob Zelle selektiert ist
  const isSelected = (row: number, col: number) =>
    (player1Cell?.row === row && player1Cell?.col === col) ||
    (player2Cell?.row === row && player2Cell?.col === col);

  // Helper to get completion animation props for a cell (memoized to avoid object recreation)
  const getCompletionAnimationProps = useCallback((row: number, col: number): CompletionAnimationProps | null => {
    if (!getCellAnimation) return null;
    const anim = getCellAnimation(row, col);
    if (!anim) return null;
    return { type: anim.type, active: true, delay: anim.delay };
  }, [getCellAnimation]);

  return (
    <View style={styles.box}>
      {[0, 1, 2].map((innerRow) => (
        <View key={innerRow} style={styles.cellRow}>
          {[0, 1, 2].map((innerCol) => {
            const row = boxRow * 3 + innerRow;
            const col = boxCol * 3 + innerCol;

            return (
              <DuoGameCell
                key={`${row}-${col}`}
                cell={board[row][col]}
                row={row}
                col={col}
                player={ownerGrid[row]?.[col] ?? 0}
                isSelected={isSelected(row, col)}
                isCheckerboard={isCheckerboard}
                onPress={onCellPressStable}
                rotateForPlayer2={true}
                showErrors={showErrors}
                completionAnimation={getCompletionAnimationProps(row, col)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

// Performance-Optimierung: Nur neu rendern wenn sich relevante Props ändern
export default React.memo(DuoSudokuBox, (prev, next) => {
  // Box muss neu rendern wenn:
  // - sich Zellen innerhalb der Box geändert haben
  // - sich die Selektion innerhalb der Box geändert haben könnte
  // - sich die Animation-Funktion geändert hat (für Completion-Animationen)

  // Wenn getCellAnimation sich geändert hat, muss die Box neu rendern
  if (prev.getCellAnimation !== next.getCellAnimation) return false;

  const boxRowStart = prev.boxRow * 3;
  const boxColStart = prev.boxCol * 3;

  // Prüfe ob Selektion innerhalb dieser Box liegt oder lag
  const prevP1InBox = prev.player1Cell &&
    prev.player1Cell.row >= boxRowStart && prev.player1Cell.row < boxRowStart + 3 &&
    prev.player1Cell.col >= boxColStart && prev.player1Cell.col < boxColStart + 3;
  const nextP1InBox = next.player1Cell &&
    next.player1Cell.row >= boxRowStart && next.player1Cell.row < boxRowStart + 3 &&
    next.player1Cell.col >= boxColStart && next.player1Cell.col < boxColStart + 3;
  const prevP2InBox = prev.player2Cell &&
    prev.player2Cell.row >= boxRowStart && prev.player2Cell.row < boxRowStart + 3 &&
    prev.player2Cell.col >= boxColStart && prev.player2Cell.col < boxColStart + 3;
  const nextP2InBox = next.player2Cell &&
    next.player2Cell.row >= boxRowStart && next.player2Cell.row < boxRowStart + 3 &&
    next.player2Cell.col >= boxColStart && next.player2Cell.col < boxColStart + 3;

  // Wenn Selektion sich innerhalb der Box geändert hat, neu rendern
  if (prevP1InBox || nextP1InBox || prevP2InBox || nextP2InBox) {
    // Prüfe ob sich die Selektions-Koordinaten geändert haben
    const p1Changed = (prev.player1Cell?.row !== next.player1Cell?.row) ||
                      (prev.player1Cell?.col !== next.player1Cell?.col);
    const p2Changed = (prev.player2Cell?.row !== next.player2Cell?.row) ||
                      (prev.player2Cell?.col !== next.player2Cell?.col);
    if (p1Changed || p2Changed) return false;
  }

  // Prüfe ob sich Zellen in dieser Box geändert haben
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const row = boxRowStart + r;
      const col = boxColStart + c;
      const prevCell = prev.board[row]?.[col];
      const nextCell = next.board[row]?.[col];
      if (prevCell !== nextCell) {
        // Tieferer Vergleich
        if (!prevCell || !nextCell) return false;
        if (prevCell.value !== nextCell.value) return false;
        if (prevCell.isValid !== nextCell.isValid) return false;
        if (prevCell.isInitial !== nextCell.isInitial) return false;
        // Notes vergleichen
        const prevNotes = prevCell.notes || [];
        const nextNotes = nextCell.notes || [];
        if (prevNotes.length !== nextNotes.length) return false;
        for (let i = 0; i < prevNotes.length; i++) {
          if (prevNotes[i] !== nextNotes[i]) return false;
        }
      }
    }
  }

  // showErrors check
  if (prev.showErrors !== next.showErrors) return false;

  return true;
});
