import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { SudokuBoard as SudokuBoardType, CellPosition } from "@/utils/sudoku";
import SudokuCell from "@/components/SudokuCell/SudokuCell";
import Animated, { 
  FadeIn, 
  FadeOut, 
  Layout, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  Easing
} from "react-native-reanimated";
import styles from "./SudokuBoard.styles";
import { SUDOKU_COLORS, BOARD_STYLES } from "@/utils/theme/sudokuTheme";

interface SudokuBoardProps {
  board: SudokuBoardType;
  selectedCell: CellPosition | null;
  onCellPress: (row: number, col: number) => void;
  isLoading?: boolean;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  selectedCell,
  onCellPress,
  isLoading = false,
}) => {
  const [isReady, setIsReady] = useState(false);
  
  // Animation values
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);
  
  // Animate board entry
  useEffect(() => {
    if (board.length > 0 && !isReady) {
      setTimeout(() => {
        scale.value = withTiming(1, {
          duration: 400,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        opacity.value = withTiming(1, {
          duration: 400,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        setIsReady(true);
      }, 100);
    }
  }, [board, isReady]);
  
  // Animate board when loading state changes
  useEffect(() => {
    if (isLoading) {
      scale.value = withTiming(0.98, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      scale.value = withTiming(1, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [isLoading]);
  
  // Animated styles
  const boardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

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

  return (
    <View style={styles.boardContainer}>
      <Animated.View style={[styles.boardAnimationContainer, boardAnimatedStyle]}>
        <View style={styles.boardWrapper}>
          {/* Hauptbrett mit blauem Hintergrund aus Theme */}
          <View style={[styles.board, {backgroundColor: SUDOKU_COLORS.primary}]}>
            {/* Grid-Inhalt */}
            <View style={[styles.gridContainer, {borderColor: BOARD_STYLES.borderColor}]}>
              {board.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.row}>
                  {row.map((cell, colIndex) => {
                    const isSelected = selectedCell && 
                      selectedCell.row === rowIndex && 
                      selectedCell.col === colIndex;
                    
                    // Gleiche Zahlen nur hervorheben, wenn nicht in gleicher Spalte/Zeile/Box und wenn ausgewählt
                    const sameValue = selectedCell && 
                      cell.value !== 0 && 
                      !isRelatedCell(rowIndex, colIndex) &&
                      board[selectedCell.row][selectedCell.col].value === cell.value;

                    return (
                      <SudokuCell
                        key={`cell-${rowIndex}-${colIndex}`}
                        cell={cell}
                        row={rowIndex}
                        col={colIndex}
                        isSelected={isSelected}
                        isRelated={isRelatedCell(rowIndex, colIndex)}
                        sameValueHighlight={sameValue}
                        onPress={onCellPress}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
            
            {/* Loading Overlay */}
            {isLoading && (
              <Animated.View 
                style={styles.loadingOverlay}
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
              >
                <ActivityIndicator size="large" color={SUDOKU_COLORS.white} />
              </Animated.View>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default SudokuBoard;