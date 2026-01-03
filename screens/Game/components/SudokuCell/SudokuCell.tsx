import React, { memo } from "react";
import { Text, Pressable, View, TextStyle } from "react-native";
import { SudokuCell as SudokuCellType } from "@/utils/sudoku";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/contexts/color/ColorContext";
import { getRelatedBackgroundColor, getCheckerboardColor } from "@/utils/theme/colors";
import baseStyles from "./SudokuCell.styles";

// Completion animation type
export interface CompletionAnimationProps {
  type: 'row' | 'column' | 'box';
  active: boolean;
  delay: number; // milliseconds - for withDelay on UI thread
}

interface SudokuCellProps {
  cell: SudokuCellType;
  row: number;
  col: number;
  isSelected: boolean;
  isRelated: boolean;
  sameValueHighlight?: boolean;
  onPress: (row: number, col: number) => void;
  showErrors?: boolean;
  completionAnimation?: CompletionAnimationProps | null;
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
  completionAnimation = null,
}) => {
  // Theme für Farben nutzen
  const theme = useTheme();
  const { colors } = theme;
  const pathColorHex = useProgressColor();

  // Animation values
  const scale = useSharedValue(1);

  // Completion animation values
  const completionScale = useSharedValue(1);
  const completionBgOpacity = useSharedValue(0);
  const completionTextScale = useSharedValue(1);

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

  // Trigger completion animation when row/column/box is completed
  // Uses withDelay for UI-thread staggering (smoother than JS setTimeout)
  React.useEffect(() => {
    if (completionAnimation?.active) {
      const delay = completionAnimation.delay ?? 0;

      // Background flash - path color glow
      completionBgOpacity.value = withDelay(delay,
        withSequence(
          withTiming(0.35, { duration: 150, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 450, easing: Easing.inOut(Easing.quad) })
        )
      );

      // Cell scale pulse - smoother easing without overshoot
      completionScale.value = withDelay(delay,
        withSequence(
          withTiming(1.08, { duration: 150, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 450, easing: Easing.inOut(Easing.quad) })
        )
      );

      // Text scale pulse (slightly larger for emphasis)
      completionTextScale.value = withDelay(delay,
        withSequence(
          withTiming(1.12, { duration: 150, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 450, easing: Easing.inOut(Easing.quad) })
        )
      );
    }

    // Cleanup: Reset values when animation ends or component unmounts
    return () => {
      completionBgOpacity.value = 0;
      completionScale.value = 1;
      completionTextScale.value = 1;
    };
  }, [completionAnimation?.active, completionAnimation?.delay]);

  // Animated styles
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Completion animation styles
  const completionContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: completionScale.value }],
  }));

  const completionOverlayStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: pathColorHex,
    opacity: completionBgOpacity.value,
    borderRadius: 4,
    zIndex: 5,
  }));

  const completionTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: completionTextScale.value }],
  }));

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
      return { backgroundColor: pathColorHex };
    } else if (isRelated) {
      // Vordefinierte opake Farbe für Gap-Layout-Kompatibilität
      return { backgroundColor: getRelatedBackgroundColor(pathColorHex, theme.isDark) };
    } else {
      // Schachbrettmuster für 3×3-Boxen
      const boxRow = Math.floor(row / 3);
      const boxCol = Math.floor(col / 3);
      const isAlternateBox = (boxRow + boxCol) % 2 === 1;

      if (isAlternateBox) {
        // Path-Color-getönte Schachbrett-Farbe für dunkle Boxen
        return { backgroundColor: getCheckerboardColor(pathColorHex, theme.isDark) };
      }
    }
    // Helle Schachbrett-Boxen (Gap-Layout erfordert opake Zellen)
    return { backgroundColor: colors.cellCheckerboardLightBackground };
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
        style.color = pathColorHex;
      }
      // Sonst normale Initial-Farbe
      else {
        style.color = colors.cellInitialTextColor;
      }
    }
    // Gleiche Zahlen als zweithöchste Priorität
    else if (sameValueHighlight) {
      style.color = pathColorHex;
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

  return (
    <Pressable
      style={baseStyles.cellContainer}
      onPress={() => onPress(row, col)}
    >
      <Animated.View style={[{ flex: 1, width: '100%', height: '100%' }, completionContainerStyle]}>
        {/* Hintergrund-Layer - immer sichtbar für Gap-Layout */}
        <View style={[baseStyles.cellBackground, getBackgroundStyle()]} />

        {/* Completion animation overlay */}
        <Animated.View style={completionOverlayStyle} pointerEvents="none" />

        {/* Inhalts-Layer mit Text oder Notizen */}
        <Animated.View style={[baseStyles.cellContent, animatedStyles]}>
          {cell.value !== 0 ? (
            <Animated.Text style={[getCellTextStyle(), completionTextStyle]}>
              {cell.value}
            </Animated.Text>
          ) : (
            renderNotes()
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

// Performance-Optimierung: Property-by-property statt JSON.stringify
export default memo(SudokuCell, (prevProps, nextProps) => {
  // Cell-Vergleich ohne teure Serialisierung
  const prevCell = prevProps.cell;
  const nextCell = nextProps.cell;
  const cellEqual =
    prevCell.value === nextCell.value &&
    prevCell.isInitial === nextCell.isInitial &&
    prevCell.isValid === nextCell.isValid &&
    prevCell.highlight === nextCell.highlight &&
    prevCell.notes.length === nextCell.notes.length &&
    prevCell.notes.every((n, i) => n === nextCell.notes[i]);

  return (
    cellEqual &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isRelated === nextProps.isRelated &&
    prevProps.sameValueHighlight === nextProps.sameValueHighlight &&
    prevProps.showErrors === nextProps.showErrors &&
    prevProps.completionAnimation?.active === nextProps.completionAnimation?.active &&
    prevProps.completionAnimation?.type === nextProps.completionAnimation?.type &&
    prevProps.completionAnimation?.delay === nextProps.completionAnimation?.delay
  );
});
