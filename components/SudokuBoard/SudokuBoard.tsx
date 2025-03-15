import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { SudokuBoard as SudokuBoardType, CellPosition } from "@/utils/sudoku";
import SudokuCell from "@/components/SudokuCell/SudokuCell";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import styles, { CELL_SIZE } from "./SudokuBoard.styles";

interface SudokuBoardProps {
  board: SudokuBoardType;
  selectedCell: CellPosition | null;
  onCellPress: (row: number, col: number) => void;
  isLoading?: boolean;
  highlightRelated?: boolean;
  highlightSameValues?: boolean;
  showErrors?: boolean;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  selectedCell,
  onCellPress,
  isLoading = false,
  highlightRelated = true,
  highlightSameValues = true,
  showErrors = true,
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
    if (!selectedCell || !highlightRelated) return false;

    const isInSameRow = selectedCell.row === row;
    const isInSameCol = selectedCell.col === col;
    const isInSameBox =
      Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
      Math.floor(selectedCell.col / 3) === Math.floor(col / 3);

    return isInSameRow || isInSameCol || isInSameBox;
  };

  // Neue Funktion, um zu prüfen, ob eine Zelle den gleichen Wert hat wie die ausgewählte Zelle
  const hasSameValue = (row: number, col: number): boolean => {
    if (!selectedCell || !highlightSameValues) return false;

    const selectedValue = board[selectedCell.row][selectedCell.col].value;
    return (
      selectedValue !== 0 &&
      board[row][col].value === selectedValue &&
      board[row][col].value !== 0 &&
      !(selectedCell.row === row && selectedCell.col === col)
    );
  };

  return (
    <View style={styles.boardContainer}>
      <Animated.View
        style={[styles.boardAnimationContainer, boardAnimatedStyle]}
      >
        <View style={styles.boardWrapper}>
          {/* Hauptbrett mit dunkelgrauem Hintergrund für Dark Mode */}
          <View style={styles.board}>
            {/* Grid-Inhalt */}
            <View style={styles.gridContainer}>
              {/* 3x3 Blockgrenzen als absolute Elemente */}
              {/* Horizontale Linien */}
              <View
                style={[
                  styles.gridLine,
                  styles.horizontalGridLine,
                  { top: CELL_SIZE * 3 },
                ]}
              />
              <View
                style={[
                  styles.gridLine,
                  styles.horizontalGridLine,
                  { top: CELL_SIZE * 6 },
                ]}
              />

              {/* Vertikale Linien */}
              <View
                style={[
                  styles.gridLine,
                  styles.verticalGridLine,
                  { left: CELL_SIZE * 3 },
                ]}
              />
              <View
                style={[
                  styles.gridLine,
                  styles.verticalGridLine,
                  { left: CELL_SIZE * 6 },
                ]}
              />

              {/* Zeilen und Zellen rendern */}
              {board.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.row}>
                  {row.map((cell, colIndex) => {
                    const isSelected = !!(
                      selectedCell &&
                      selectedCell.row === rowIndex &&
                      selectedCell.col === colIndex
                    );

                    // Gleiche Zahlen hervorheben
                    const sameValue = hasSameValue(rowIndex, colIndex);

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
                        showErrors={showErrors}
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
                <ActivityIndicator size="large" color="#FFFFFF" />
              </Animated.View>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default SudokuBoard;
