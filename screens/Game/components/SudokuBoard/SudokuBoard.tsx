import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { SudokuBoard as SudokuBoardType, CellPosition } from "@/utils/sudoku";
import SudokuBox from "./SudokuBox";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/contexts/color/ColorContext";
import { getGapColor } from "@/utils/theme/colors";
import styles from "./SudokuBoard.styles";

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
  const theme = useTheme();
  const { colors, isDark } = theme;
  const pathColorHex = useProgressColor();

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

  // PERFORMANCE: Memoize cell relation check (called 81 times per render)
  const isRelatedCell = useCallback((row: number, col: number): boolean => {
    if (!selectedCell || !highlightRelated) return false;

    const isInSameRow = selectedCell.row === row;
    const isInSameCol = selectedCell.col === col;
    const isInSameBox =
      Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
      Math.floor(selectedCell.col / 3) === Math.floor(col / 3);

    return isInSameRow || isInSameCol || isInSameBox;
  }, [selectedCell, highlightRelated]);

  // PERFORMANCE: Memoize same value check (called 81 times per render)
  const hasSameValue = useCallback((row: number, col: number): boolean => {
    if (!selectedCell || !highlightSameValues) return false;

    const selectedValue = board[selectedCell.row][selectedCell.col].value;
    return (
      selectedValue !== 0 &&
      board[row][col].value === selectedValue &&
      board[row][col].value !== 0 &&
      !(selectedCell.row === row && selectedCell.col === col)
    );
  }, [selectedCell, highlightSameValues, board]);

  // PERFORMANCE: Memoize dynamic inline styles
  const boardStyle = useMemo(
    () => ({
      backgroundColor: colors.boardBackgroundColor,
    }),
    [colors.boardBackgroundColor]
  );

  const gridContainerStyle = useMemo(
    () => ({
      borderColor: colors.boardBorderColor,
      // Hintergrund zeigt durch die Gaps als Grid-Linien (Path-Color-getönt)
      backgroundColor: getGapColor(pathColorHex, isDark),
    }),
    [colors.boardBorderColor, pathColorHex, isDark]
  );

  return (
    <View style={styles.boardContainer}>
      <Animated.View
        style={[styles.boardAnimationContainer, boardAnimatedStyle]}
      >
        <View style={[
            styles.boardWrapper,
            {
              // Farbiger Schatten-Effekt wie im DuoGame
              shadowColor: pathColorHex,
              shadowOpacity: isDark ? 0.6 : 0.35,
              shadowRadius: isDark ? 16 : 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 10,
            },
          ]}>
          {/* Hauptbrett mit Theme-Farben */}
          <View style={[styles.board, boardStyle]}>
            {/* Grid-Inhalt mit Box-Architektur */}
            <View style={[styles.gridContainer, gridContainerStyle]}>
              {/* 9 Boxen (3x3) mit je 9 Zellen (3x3) */}
              <View style={styles.boxesContainer}>
                {[0, 1, 2].map((boxRow) => (
                  <View key={`boxRow-${boxRow}`} style={styles.boxRow}>
                    {[0, 1, 2].map((boxCol) => (
                      <SudokuBox
                        key={`box-${boxRow}-${boxCol}`}
                        boxRow={boxRow}
                        boxCol={boxCol}
                        board={board}
                        selectedCell={selectedCell}
                        onCellPress={onCellPress}
                        isRelatedCell={isRelatedCell}
                        hasSameValue={hasSameValue}
                        showErrors={showErrors}
                      />
                    ))}
                  </View>
                ))}
              </View>
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
