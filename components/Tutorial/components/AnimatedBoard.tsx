// components/Tutorial/components/AnimatedBoard.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";

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

const AnimatedBoard: React.FC<AnimatedBoardProps> = ({
  grid,
  highlightRow,
  highlightColumn,
  highlightBlock,
  highlightCell,
  highlightRowColor = "rgba(255, 152, 0, 0.3)", // Orange default
  highlightColumnColor = "rgba(233, 30, 99, 0.3)", // Pink default
  highlightBlockColor = "rgba(76, 175, 80, 0.3)", // Green default
  showNotes = false,
  notes = {},
  animationDelay = 0,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  // Animation values
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const highlightOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate board entry
    scale.value = withDelay(
      animationDelay,
      withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    opacity.value = withDelay(animationDelay, withTiming(1, { duration: 500 }));

    // Animate highlights
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
        color: colors.cellBackgroundSelected,
      };
    }

    if (highlightRow !== undefined && row === highlightRow) {
      return {
        highlighted: true,
        color: highlightRowColor,
      };
    }

    if (highlightColumn !== undefined && col === highlightColumn) {
      return {
        highlighted: true,
        color: highlightColumnColor,
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
          color: highlightBlockColor,
        };
      }
    }

    return { highlighted: false, color: "transparent" };
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

    return (
      <View style={styles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={`note-${row}-${col}-${num}`}
            style={[
              styles.noteText,
              { color: colors.textCellNotes },
              !cellNotes.includes(num) && styles.hiddenNote,
            ]}
          >
            {num}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, boardStyle]}>
      <View style={[styles.board, { backgroundColor: "#1E2233" }]}>
        {grid.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => {
              const isInitial = cell !== 0;
              const highlightInfo = getCellHighlightInfo(rowIndex, colIndex);

              return (
                <View
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    (colIndex + 1) % 3 === 0 &&
                      colIndex !== 8 &&
                      styles.rightBorder,
                    (rowIndex + 1) % 3 === 0 &&
                      rowIndex !== 8 &&
                      styles.bottomBorder,
                  ]}
                >
                  {/* Highlight background */}
                  {highlightInfo.highlighted && (
                    <Animated.View
                      style={[
                        styles.cellBackground,
                        {
                          backgroundColor: highlightInfo.color,
                        },
                        highlightStyle,
                      ]}
                    />
                  )}

                  {/* Cell content */}
                  {isInitial ? (
                    <Text
                      style={[
                        styles.cellText,
                        {
                          color: "#FFFFFF",
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {cell}
                    </Text>
                  ) : showNotes ? (
                    renderNotes(rowIndex, colIndex)
                  ) : (
                    <Text style={styles.cellText}></Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
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
  board: {
    width: 300,
    height: 300,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
    padding: 3,
    overflow: "hidden",
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    position: "relative",
  },
  rightBorder: {
    borderRightWidth: 1.5,
    borderRightColor: "rgba(255, 255, 255, 0.2)",
  },
  bottomBorder: {
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  cellBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cellText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#FFFFFF",
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
  hiddenNote: {
    opacity: 0,
  },
});

export default AnimatedBoard;
