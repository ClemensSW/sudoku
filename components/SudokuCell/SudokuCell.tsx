import React, { memo } from "react";
import { Text, Pressable, View, StyleSheet, TextStyle } from "react-native";
import { SudokuCell as SudokuCellType } from "@/utils/sudoku";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  FadeIn,
} from "react-native-reanimated";
import baseStyles from "./SudokuCell.styles";

interface SudokuCellProps {
  cell: SudokuCellType;
  row: number;
  col: number;
  isSelected: boolean;
  isRelated: boolean;
  sameValueHighlight?: boolean;
  onPress: (row: number, col: number) => void;
  showErrors?: boolean;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  row,
  col,
  isSelected,
  isRelated,
  sameValueHighlight = false,
  onPress,
  showErrors = true,
}) => {
  // Animation values
  const scale = useSharedValue(1);

  // Trigger animations when cell changes
  React.useEffect(() => {
    if (cell.highlight === "hint" || cell.highlight === "success") {
      // Pulse animation for hint or success
      scale.value = withSequence(
        withTiming(1.1, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    } else if (cell.value !== 0 && !cell.isInitial) {
      // Small scale animation when value is entered
      scale.value = withSequence(
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 150 })
      );
    }
  }, [cell.value, cell.highlight]);

  // Animated styles
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Berechne Hintergrund basierend auf Zustand
  const getBackgroundStyle = () => {
    if (showErrors && cell.highlight === "error") {
      return baseStyles.errorBackground;
    } else if (cell.highlight === "hint") {
      return baseStyles.hintBackground;
    } else if (cell.highlight === "success") {
      return baseStyles.successBackground;
    } else if (isSelected) {
      return baseStyles.selectedBackground;
    } else if (isRelated) {
      return baseStyles.relatedBackground;
    }
    return null;
  };

  // Text-Styles für verschiedene Zustände
  const getCellTextStyle = () => {
    // Kombiniere die Basis-TextStyle mit zusätzlichen Werten
    let style: TextStyle = {
      ...baseStyles.cellText,
    };

    // Farbe basierend auf Zustand
    if (showErrors && !cell.isValid) {
      style.color = "#FF9A9A"; // Fehler-Farbe
    } else if (sameValueHighlight) {
      // NUR hier ändern wir die Textfarbe für gleiche Werte
      style.color = "#6CACA6"; // Teal-Farbe für gleiche Werte
      style.fontWeight = "700"; // Fetter machen für bessere Sichtbarkeit
    }

    // Schriftgewicht basierend auf Zustand
    if (cell.isInitial) {
      style.fontWeight = "700";
    }

    return style;
  };

  // Render Notizen wenn Zelle leer ist
  const renderNotes = () => {
    if (cell.value !== 0 || cell.notes.length === 0) return null;

    return (
      <View style={baseStyles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={`note-${num}`}
            style={[
              baseStyles.noteText,
              cell.notes.includes(num)
                ? baseStyles.activeNote
                : baseStyles.inactiveNote,
            ]}
          >
            {cell.notes.includes(num) ? num : ""}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <Pressable
      style={baseStyles.cellContainer}
      onPress={() => onPress(row, col)}
    >
      {/* Hintergrund-Layer für Hervorhebungen */}
      {getBackgroundStyle() && (
        <View style={[baseStyles.cellBackground, getBackgroundStyle()]} />
      )}

      {/* Grenzen-Layer - immer konsistent */}
      <View style={baseStyles.cellBorder} />

      {/* Inhalts-Layer mit Text oder Notizen */}
      <Animated.View style={[baseStyles.cellContent, animatedStyles]}>
        {cell.value !== 0 ? (
          <Text style={getCellTextStyle()}>{cell.value}</Text>
        ) : (
          renderNotes()
        )}
      </Animated.View>
    </Pressable>
  );
};

// Performance-Optimierung
export default memo(SudokuCell, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.cell) === JSON.stringify(nextProps.cell) &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isRelated === nextProps.isRelated &&
    prevProps.sameValueHighlight === nextProps.sameValueHighlight &&
    prevProps.showErrors === nextProps.showErrors
  );
});