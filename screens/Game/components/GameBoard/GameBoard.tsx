// screens/GameScreen/components/GameBoard/GameBoard.tsx
import React from "react";
import { View } from "react-native";
import SudokuBoard from "@/screens/Game/components/SudokuBoard/SudokuBoard";
import { SudokuBoard as SudokuBoardType, CellPosition } from "@/utils/sudoku";
import styles from "./GameBoard.styles";

interface GameBoardProps {
  board: SudokuBoardType;
  selectedCell: CellPosition | null;
  onCellPress: (row: number, col: number) => void;
  isLoading?: boolean;
  highlightRelated?: boolean;
  highlightSameValues?: boolean;
  showErrors?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  selectedCell,
  onCellPress,
  isLoading = false,
  highlightRelated = true,
  highlightSameValues = true,
  showErrors = true,
}) => {
  return (
    <View style={styles.boardContainer}>
      <SudokuBoard
        board={board}
        selectedCell={selectedCell}
        onCellPress={onCellPress}
        isLoading={isLoading}
        highlightRelated={highlightRelated}
        highlightSameValues={highlightSameValues}
        showErrors={showErrors}
      />
    </View>
  );
};

export default GameBoard;
