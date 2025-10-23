import React, { memo } from "react";
import { Text, Pressable, View, StyleSheet, TextStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import baseStyles from "./OnlineSudokuCell.styles";

interface OnlineSudokuCellProps {
  value: number;
  initialValue: number;
  solution: number;
  notes: number[];
  row: number;
  col: number;
  isSelected: boolean;
  isRelated: boolean;
  sameValueHighlight?: boolean;
  onPress: (row: number, col: number) => void;
  showErrors?: boolean;
  highlight?: "hint" | "success" | "error" | null;
}

const OnlineSudokuCell: React.FC<OnlineSudokuCellProps> = ({
  value,
  initialValue,
  solution,
  notes,
  row,
  col,
  isSelected,
  isRelated,
  sameValueHighlight = false,
  onPress,
  showErrors = true,
  highlight = null,
}) => {
  // Theme für Farben nutzen
  const theme = useTheme();
  const { colors } = theme;

  // Animation values
  const scale = useSharedValue(1);

  // Berechne ob Zelle initial ist und ob Fehler vorliegt
  const isInitial = initialValue !== 0;
  const isError = value !== 0 && !isInitial && value !== solution;

  // Trigger animations when cell changes
  React.useEffect(() => {
    if (highlight === "hint" || highlight === "success") {
      // Pulse animation for hint or success
      scale.value = withSequence(
        withTiming(1.1, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    } else if (value !== 0 && !isInitial) {
      // Small scale animation when value is entered
      scale.value = withSequence(
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 150 })
      );
    }
  }, [value, highlight]);

  // Animated styles
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Berechne Hintergrund basierend auf Zustand - mit Theme-Farben
  const getBackgroundStyle = () => {
    // Priorität: Fehler > Hint > Success > Selected > Related > Schachbrett
    if (showErrors && (highlight === "error" || isError)) {
      return { backgroundColor: colors.cellErrorBackground };
    } else if (highlight === "hint") {
      return { backgroundColor: colors.cellHintBackground };
    } else if (highlight === "success") {
      return { backgroundColor: colors.cellSuccessBackground };
    } else if (isSelected) {
      return { backgroundColor: colors.cellSelectedBackground };
    } else if (isRelated) {
      return { backgroundColor: colors.cellRelatedBackground };
    } else {
      // Schachbrettmuster für 3×3-Boxen
      const boxRow = Math.floor(row / 3);
      const boxCol = Math.floor(col / 3);
      const isAlternateBox = (boxRow + boxCol) % 2 === 1;

      if (isAlternateBox) {
        // Unterschiedliche Farbe für Light und Dark Mode
        const checkerboardColor = theme.isDark
          ? 'rgba(255, 255, 255, 0.03)'
          : 'rgba(0, 0, 0, 0.03)';
        return { backgroundColor: checkerboardColor };
      }
    }
    return null;
  };

  // Text-Styles für verschiedene Zustände - mit Theme-Farben
  const getCellTextStyle = () => {
    // Kombiniere die Basis-TextStyle mit zusätzlichen Werten
    let style: TextStyle = {
      ...baseStyles.cellText,
      color: colors.cellTextColor,
      fontWeight: "300", // Standard für vom Spieler ausgefüllte Zellen
    };

    // WICHTIG: Initialer Zellenwert
    if (isInitial) {
      style.fontWeight = "700";

      // Wenn die Zelle ausgewählt ist, verwende die Selected-Farbe (weiß)
      if (isSelected) {
        style.color = colors.cellSelectedTextColor;
      }
      // Wenn gleiche Zahlen hervorgehoben werden
      else if (sameValueHighlight) {
        style.color = colors.cellSameValueTextColor;
      }
      // Sonst normale Initial-Farbe
      else {
        style.color = colors.cellInitialTextColor;
      }
    }
    // Gleiche Zahlen als zweithöchste Priorität
    else if (sameValueHighlight) {
      style.color = colors.cellSameValueTextColor;
      style.fontWeight = "700"; // Fetter machen für bessere Sichtbarkeit
    }
    // Danach fehlerhafte Zellen
    else if (showErrors && isError) {
      style.color = colors.cellErrorTextColor;
    }
    // Zuletzt ausgewählte Zellen
    else if (isSelected) {
      style.color = colors.cellSelectedTextColor;
    }

    return style;
  };

  // Render Notizen wenn Zelle leer ist
  const renderNotes = () => {
    if (value !== 0 || notes.length === 0) return null;

    // NEUE LOGIK: Dynamische Notizfarbe basierend auf dem Auswahlstatus
    const notesTextColor = isSelected ? "#FFFFFF" : colors.cellNotesTextColor;

    return (
      <View style={baseStyles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={`note-${num}`}
            style={[
              baseStyles.noteText,
              { color: notesTextColor },
              notes.includes(num)
                ? baseStyles.activeNote
                : baseStyles.inactiveNote,
            ]}
          >
            {notes.includes(num) ? num : ""}
          </Text>
        ))}
      </View>
    );
  };

  // Dynamischer Style für Zellenrahmen
  const cellBorderStyle = {
    borderColor: colors.boardCellBorderColor,
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
      <View style={[baseStyles.cellBorder, cellBorderStyle]} />

      {/* Inhalts-Layer mit Text oder Notizen */}
      <Animated.View style={[baseStyles.cellContent, animatedStyles]}>
        {value !== 0 ? (
          <Text style={getCellTextStyle()}>{value}</Text>
        ) : (
          renderNotes()
        )}
      </Animated.View>
    </Pressable>
  );
};

// Performance-Optimierung
export default memo(OnlineSudokuCell, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.initialValue === nextProps.initialValue &&
    prevProps.solution === nextProps.solution &&
    JSON.stringify(prevProps.notes) === JSON.stringify(nextProps.notes) &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isRelated === nextProps.isRelated &&
    prevProps.sameValueHighlight === nextProps.sameValueHighlight &&
    prevProps.showErrors === nextProps.showErrors &&
    prevProps.highlight === nextProps.highlight
  );
});
