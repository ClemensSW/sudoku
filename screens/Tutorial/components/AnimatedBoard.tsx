// components/Tutorial/components/AnimatedBoard.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import { getGapColor, getCheckerboardColor } from "@/utils/theme/colors";

interface AnimatedBoardProps {
  grid: number[][];
  highlightRow?: number;
  highlightColumn?: number;
  highlightBlock?: [number, number]; // [row, col] of block center
  highlightCell?: [number, number]; // [row, col]
  highlightRowColor?: string;
  highlightColumnColor?: string;
  highlightBlockColor?: string;
  showNotes?: boolean;
  notes?: { [key: string]: number[] }; // Format: "row-col": [1, 2, 3]
  animationDelay?: number;
}

// Gap-basierte Konstanten (wie im Single Player Game)
const BOARD_SIZE = 320;
const GRID_SIZE = BOARD_SIZE;

const BOX_GAP = 2.5;
const CELL_GAP = 1.0;

const TOTAL_GAP_SPACE = 2 * BOX_GAP + 6 * CELL_GAP;
const AVAILABLE_CELL_SPACE = GRID_SIZE - TOTAL_GAP_SPACE;
const CELL_SIZE = AVAILABLE_CELL_SPACE / 9;

const AnimatedBoard: React.FC<AnimatedBoardProps> = ({
  grid,
  highlightRow,
  highlightColumn,
  highlightBlock,
  highlightCell,
  highlightRowColor,
  highlightColumnColor,
  highlightBlockColor,
  showNotes = false,
  notes = {},
  animationDelay = 0,
}) => {
  const theme = useTheme();
  const { colors, typography, isDark } = theme;
  const progressColor = useProgressColor();

  // Standardfarben für Hervorhebungen, wenn nicht explizit angegeben
  const defaultHighlightRowColor = isDark
    ? "rgba(138, 180, 248, 0.35)"
    : "rgba(66, 133, 244, 0.35)";

  const defaultHighlightColumnColor = isDark
    ? "rgba(242, 139, 130, 0.35)"
    : "rgba(234, 67, 53, 0.35)";

  const defaultHighlightBlockColor = isDark
    ? "rgba(129, 201, 149, 0.35)"
    : "rgba(52, 168, 83, 0.35)";

  const effectiveRowColor = highlightRowColor || defaultHighlightRowColor;
  const effectiveColumnColor = highlightColumnColor || defaultHighlightColumnColor;
  const effectiveBlockColor = highlightBlockColor || defaultHighlightBlockColor;

  // Animation values
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const highlightOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      animationDelay,
      withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    opacity.value = withDelay(animationDelay, withTiming(1, { duration: 500 }));

    highlightOpacity.value = withDelay(
      animationDelay + 300,
      withTiming(1, { duration: 400 })
    );
  }, []);

  // Cell highlighting logic
  const getCellHighlightInfo = (row: number, col: number) => {
    if (highlightCell && highlightCell[0] === row && highlightCell[1] === col) {
      return {
        highlighted: true,
        isSelected: true,
        color: progressColor,
      };
    }

    if (highlightRow !== undefined && row === highlightRow) {
      return {
        highlighted: true,
        isSelected: false,
        color: effectiveRowColor,
      };
    }

    if (highlightColumn !== undefined && col === highlightColumn) {
      return {
        highlighted: true,
        isSelected: false,
        color: effectiveColumnColor,
      };
    }

    if (highlightBlock) {
      const blockRow = Math.floor(highlightBlock[0] / 3) * 3;
      const blockCol = Math.floor(highlightBlock[1] / 3) * 3;

      if (
        row >= blockRow &&
        row < blockRow + 3 &&
        col >= blockCol &&
        col < blockCol + 3
      ) {
        return {
          highlighted: true,
          isSelected: false,
          color: effectiveBlockColor,
        };
      }
    }

    return { highlighted: false, isSelected: false, color: "transparent" };
  };

  // Get notes for a cell
  const getCellNotes = (row: number, col: number) => {
    const key = `${row}-${col}`;
    return notes[key] || [];
  };

  // Animation styles
  const boardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const highlightStyle = useAnimatedStyle(() => {
    return {
      opacity: highlightOpacity.value,
    };
  });

  // Render notes grid
  const renderNotes = (row: number, col: number) => {
    const cellNotes = getCellNotes(row, col);
    const highlightInfo = getCellHighlightInfo(row, col);
    const isSelected = highlightInfo.isSelected;

    return (
      <View style={styles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={`note-${row}-${col}-${num}`}
            style={[
              styles.noteText,
              {
                color: isSelected
                  ? colors.cellSelectedTextColor
                  : colors.cellNotesTextColor
              },
              cellNotes.includes(num) ? styles.activeNote : styles.hiddenNote,
            ]}
          >
            {num}
          </Text>
        ))}
      </View>
    );
  };

  // Render a single cell
  const renderCell = (row: number, col: number) => {
    const cell = grid[row][col];
    const isInitial = cell !== 0;
    const highlightInfo = getCellHighlightInfo(row, col);
    const isSelected = highlightInfo.isSelected;

    // Schachbrettmuster für 3×3-Boxen (wie im Single Player Game)
    const boxRow = Math.floor(row / 3);
    const boxCol = Math.floor(col / 3);
    const isAlternateBox = (boxRow + boxCol) % 2 === 1;

    const cellBackgroundColor = isAlternateBox
      ? getCheckerboardColor(progressColor, isDark)
      : colors.cellCheckerboardLightBackground;

    return (
      <View
        key={`cell-${row}-${col}`}
        style={[
          styles.cell,
          { backgroundColor: cellBackgroundColor },
        ]}
      >
        {/* Highlight background */}
        {highlightInfo.highlighted && (
          <Animated.View
            style={[
              styles.cellBackground,
              { backgroundColor: highlightInfo.color },
              highlightStyle,
            ]}
          />
        )}

        {/* Cell content */}
        <View style={styles.cellContent}>
          {isInitial ? (
            <Text style={[
              styles.cellText,
              {
                color: isSelected
                  ? colors.cellSelectedTextColor
                  : colors.cellInitialTextColor,
                fontSize: typography.size.lg,
              },
              styles.initialText
            ]}>
              {cell}
            </Text>
          ) : showNotes ? (
            renderNotes(row, col)
          ) : null}
        </View>
      </View>
    );
  };

  // Render a 3x3 box
  const renderBox = (boxRow: number, boxCol: number) => {
    const startRow = boxRow * 3;
    const startCol = boxCol * 3;

    return (
      <View key={`box-${boxRow}-${boxCol}`} style={styles.box}>
        {[0, 1, 2].map((cellRowOffset) => (
          <View key={`cellRow-${boxRow}-${boxCol}-${cellRowOffset}`} style={styles.cellRow}>
            {[0, 1, 2].map((cellColOffset) =>
              renderCell(startRow + cellRowOffset, startCol + cellColOffset)
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, boardStyle]}>
      <View style={[
        styles.boardWrapper,
        {
          // Farbiger Schatten-Effekt wie im Single Player Game
          shadowColor: progressColor,
          shadowOpacity: isDark ? 0.6 : 0.35,
          shadowRadius: isDark ? 16 : 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 10,
        },
      ]}>
        <View style={[styles.board, { backgroundColor: colors.boardBackgroundColor }]}>
          <View style={[
            styles.gridContainer,
            { backgroundColor: getGapColor(progressColor, isDark) }
          ]}>
            {/* 9 Boxen (3x3) mit je 9 Zellen (3x3) */}
            <View style={styles.boxesContainer}>
              {[0, 1, 2].map((boxRow) => (
                <View key={`boxRow-${boxRow}`} style={styles.boxRow}>
                  {[0, 1, 2].map((boxCol) => renderBox(boxRow, boxCol))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  boardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    flexDirection: "column",
    overflow: "hidden",
  },
  boxesContainer: {
    flex: 1,
    flexDirection: "column",
    gap: BOX_GAP,
  },
  boxRow: {
    flexDirection: "row",
    flex: 1,
    gap: BOX_GAP,
  },
  box: {
    flexDirection: "column",
    flex: 1,
    gap: CELL_GAP,
  },
  cellRow: {
    flexDirection: "row",
    flex: 1,
    gap: CELL_GAP,
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cellBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  cellContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  cellText: {
    fontWeight: "500",
  },
  initialText: {
    fontWeight: "700",
  },
  notesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
  },
  noteText: {
    fontSize: 8,
    width: "33.33%",
    height: "33.33%",
    textAlign: "center",
    textAlignVertical: "center",
    padding: 1,
  },
  activeNote: {
    opacity: 1,
  },
  hiddenNote: {
    opacity: 0,
  },
});

export default AnimatedBoard;
