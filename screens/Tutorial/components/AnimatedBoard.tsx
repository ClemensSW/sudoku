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
import { useProgressColor } from "@/hooks/useProgressColor";

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

// Berechnen der optimalen Board-Größe - exakt wie in SudokuBoardDemo
const BOARD_SIZE = 320;
const GRID_SIZE = BOARD_SIZE * 0.95;
const CELL_SIZE = GRID_SIZE / 9;

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
  const { colors } = theme;
  const progressColor = useProgressColor();

  // Standardfarben für Hervorhebungen, wenn nicht explizit angegeben
  // Die Farben sind so gewählt, dass sie im Light und Dark Mode gut aussehen
  // und deutlich unterscheidbar bleiben
  const defaultHighlightRowColor = theme.isDark 
    ? "rgba(138, 180, 248, 0.35)" // Blau im Dark Mode
    : "rgba(66, 133, 244, 0.35)"; // Blau im Light Mode
    
  const defaultHighlightColumnColor = theme.isDark 
    ? "rgba(242, 139, 130, 0.35)" // Rot im Dark Mode
    : "rgba(234, 67, 53, 0.35)"; // Rot im Light Mode
    
  const defaultHighlightBlockColor = theme.isDark 
    ? "rgba(129, 201, 149, 0.35)" // Grün im Dark Mode
    : "rgba(52, 168, 83, 0.35)"; // Grün im Light Mode

  // Die finalen, effektiven Highlight-Farben
  const effectiveRowColor = highlightRowColor || defaultHighlightRowColor;
  const effectiveColumnColor = highlightColumnColor || defaultHighlightColumnColor;
  const effectiveBlockColor = highlightBlockColor || defaultHighlightBlockColor;

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
        isSelected: true,
        color: progressColor, // Dynamische progressColor für ausgewählte Zelle
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
                // KORRIGIERT: Setze die Textfarbe basierend auf dem Auswahlstatus
                color: isSelected 
                  ? colors.cellSelectedTextColor // Weiß für ausgewählte Zellen
                  : colors.cellNotesTextColor    // Standardfarbe für nicht ausgewählte
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

  return (
    <Animated.View style={[styles.container, boardStyle]}>
      <View style={styles.boardWrapper}>
        <View style={[styles.board, { backgroundColor: colors.boardBackgroundColor }]}>
          <View style={[styles.gridContainer, { borderColor: colors.boardBorderColor }]}>
            {/* Gridlinien als absolute Elemente */}
            <View
              style={[
                styles.gridLine,
                styles.horizontalLine,
                { top: CELL_SIZE * 3, backgroundColor: colors.boardGridLineColor },
              ]}
            />
            <View
              style={[
                styles.gridLine,
                styles.horizontalLine,
                { top: CELL_SIZE * 6, backgroundColor: colors.boardGridLineColor },
              ]}
            />
            <View
              style={[
                styles.gridLine,
                styles.verticalLine,
                { left: CELL_SIZE * 3, backgroundColor: colors.boardGridLineColor },
              ]}
            />
            <View
              style={[
                styles.gridLine,
                styles.verticalLine,
                { left: CELL_SIZE * 6, backgroundColor: colors.boardGridLineColor },
              ]}
            />
            
            {grid.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {row.map((cell, colIndex) => {
                  const isInitial = cell !== 0;
                  const highlightInfo = getCellHighlightInfo(rowIndex, colIndex);
                  const isSelected = highlightInfo.isSelected;

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
                        { borderColor: colors.boardCellBorderColor },
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
                        <Text style={[
                          styles.cellText, 
                          { 
                            // KORRIGIERT: Textfarbe basierend auf Auswahlstatus
                            color: isSelected 
                              ? colors.cellSelectedTextColor  // Weiß für ausgewählte Zellen 
                              : colors.cellInitialTextColor   // Theme-Farbe für initiale Zahlen
                          },
                          styles.initialText
                        ]}>
                          {cell}
                        </Text>
                      ) : showNotes ? (
                        renderNotes(rowIndex, colIndex)
                      ) : (
                        <Text style={[styles.cellText, { color: colors.cellTextColor }]}></Text>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    flexDirection: "column",
    borderWidth: 1.5,
    overflow: "hidden",
    borderRadius: 8,
    position: "relative",
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
    position: "relative",
  },
  rightBorder: {
    borderRightWidth: 1.5,
  },
  bottomBorder: {
    borderBottomWidth: 1.5,
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
  gridLine: {
    position: "absolute",
    zIndex: 5,
  },
  horizontalLine: {
    width: GRID_SIZE,
    height: 1.5,
    left: 0,
  },
  verticalLine: {
    width: 1.5,
    height: GRID_SIZE,
    top: 0,
  },
});

export default AnimatedBoard;