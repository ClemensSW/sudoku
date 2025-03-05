import React, { memo } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Cell } from "../utils/sudokuLogic";
import { useTheme } from "../utils/theme";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface SudokuCellProps {
  cell: Cell;
  row: number;
  col: number;
  isSelected: boolean;
  isRelated: boolean;
  onPress: () => void;
  showMistakes: boolean;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  row,
  col,
  isSelected,
  isRelated,
  onPress,
  showMistakes,
}) => {
  const theme = useTheme();

  // Berechne Border-Stile für die Grid-Linien
  const borderStyles = {
    borderRightWidth: (col + 1) % 3 === 0 && col !== 8 ? 2 : 0.5,
    borderBottomWidth: (row + 1) % 3 === 0 && row !== 8 ? 2 : 0.5,
    borderRightColor:
      (col + 1) % 3 === 0 && col !== 8
        ? theme.colors.gridBorderDark
        : theme.colors.gridBorderLight,
    borderBottomColor:
      (row + 1) % 3 === 0 && row !== 8
        ? theme.colors.gridBorderDark
        : theme.colors.gridBorderLight,
  };

  // Berechne Hintergrundfarbe basierend auf Zellstatus
  const getCellBackground = () => {
    if (isSelected) return theme.colors.cellSelected;
    if (isRelated) return theme.colors.cellRelated;
    if (cell.isInitial) return theme.colors.cellBackgroundInitial;
    return theme.colors.cellBackground;
  };

  // Berechne Textfarbe basierend auf Zellstatus
  const getTextColor = () => {
    if (isSelected) return "white";
    if (cell.isInitial) return theme.colors.text;
    if (showMistakes && cell.isValid === false) return theme.colors.error;
    return theme.colors.primary;
  };

  // Animierte Styles für Übergänge
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(getCellBackground(), { duration: 150 }),
      transform: [
        {
          scale: withTiming(isSelected ? 1.05 : 1, { duration: 100 }),
        },
      ],
    };
  }, [isSelected, isRelated, cell.isInitial]);

  // Rendere Notizen, wenn die Zelle keinen Wert hat
  const renderNotes = () => {
    if (cell.value !== 0 || !cell.notes.some((note) => note)) return null;

    return (
      <View style={styles.notesContainer}>
        {cell.notes.map((isActive, index) =>
          isActive ? (
            <Text key={index} style={styles.noteText}>
              {index + 1}
            </Text>
          ) : null
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={cell.isInitial}
    >
      <Animated.View
        style={[styles.cell, borderStyles, animatedStyle, theme.shadows.small]}
      >
        {cell.value !== 0 ? (
          <Text
            style={[
              styles.cellText,
              {
                color: getTextColor(),
                fontWeight: cell.isInitial ? "bold" : "normal",
              },
            ]}
          >
            {cell.value}
          </Text>
        ) : (
          renderNotes()
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
  },
  cellText: {
    fontSize: 18,
  },
  notesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 1,
  },
  noteText: {
    fontSize: 9,
    width: "33%",
    height: "33%",
    textAlign: "center",
    color: "#888",
  },
});

// Verwende memo für Optimierung
export default memo(SudokuCell);
