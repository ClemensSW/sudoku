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
  Easing,
} from "react-native-reanimated";
import styles from "./SudokuBoard.styles";
import { useTheme } from "@/utils/theme/ThemeProvider";

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
  const theme = useTheme();
  const colors = theme.colors;
  const [isReady, setIsReady] = useState(false);

  // Animation values
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  // Animate board entry
  useEffect(() => {
    if (board.length > 0 && !isReady) {
      // Initial load animation
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

  // Render the board
  return (
    <View
      style={[
        styles.boardContainer,
        { backgroundColor: colors.boardBackground },
      ]}
    >
      <Animated.View
        style={[styles.boardAnimationContainer, boardAnimatedStyle]}
      >
        <View style={styles.boardWrapper}>
          <View
            style={[
              styles.board,
              {
                borderColor: colors.gridBold,
                backgroundColor: theme.isDark
                  ? colors.surface
                  : colors.background,
              },
            ]}
          >
            {board.map((row, rowIndex) => (
              <Animated.View
                key={`row-${rowIndex}`}
                style={styles.row}
                layout={Layout}
                entering={FadeIn.delay(50 * rowIndex).duration(200)}
              >
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
                          cell.value &&
                        !isSelected // Don't highlight the selected cell itself
                      }
                      onPress={onCellPress}
                    />
                  );
                })}
              </Animated.View>
            ))}

            {/* Loading overlay */}
            {isLoading && (
              <Animated.View
                style={styles.loadingOverlay}
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
              >
                <ActivityIndicator size="large" color={colors.primary} />
              </Animated.View>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default SudokuBoard;
