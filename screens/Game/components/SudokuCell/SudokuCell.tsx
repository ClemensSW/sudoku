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
import { useTheme } from "@/utils/theme/ThemeProvider";
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
  // Theme für Farben nutzen
  const theme = useTheme();
  const { colors } = theme;

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

  // Berechne Hintergrund basierend auf Zustand - mit Theme-Farben
  const getBackgroundStyle = () => {
    // Priorität: Fehler > Hint > Success > Selected > Related > Schachbrett
    if (showErrors && cell.highlight === "error") {
      return { backgroundColor: colors.cellErrorBackground };
    } else if (cell.highlight === "hint") {
      return { backgroundColor: colors.cellHintBackground };
    } else if (cell.highlight === "success") {
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
    color: colors.cellTextColor, // Default Textfarbe
    fontWeight: "300", // Hier setzen wir den Standard auf 300 für vom Spieler ausgefüllte Zellen
  };

  // WICHTIG: Initialer Zellenwert
  if (cell.isInitial) {
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
  else if (showErrors && !cell.isValid) {
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
    if (cell.value !== 0 || cell.notes.length === 0) return null;

    // NEUE LOGIK: Dynamische Notizfarbe basierend auf dem Auswahlstatus
    const notesTextColor = isSelected ? "#FFFFFF" : colors.cellNotesTextColor;

    return (
      <View style={baseStyles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={`note-${num}`}
            style={[
              baseStyles.noteText,
              { color: notesTextColor }, // Dynamische Farbe je nach Auswahlstatus
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