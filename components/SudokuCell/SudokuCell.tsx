import React, { memo, useEffect } from "react";
import {
  Text,
  Pressable,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SudokuCell as SudokuCellType } from "@/utils/sudoku";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import styles from "./SudokuCell.styles";

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
  useEffect(() => {
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

  // Berechne Zellstile basierend auf Zustand
  const getCellStyles = () => {
    const cellStyles: Array<ViewStyle | any> = [styles.cell];

    // Die 3x3 Boxgrenzen werden jetzt durch absolute Elemente im Board umgesetzt
    // Wir behalten hier nur die Blockfärbung

    // Subtile Blockfärbung - für bessere visuelle Trennung der 3x3 Blöcke
    const blockRow = Math.floor(row / 3);
    const blockCol = Math.floor(col / 3);
    if ((blockRow + blockCol) % 2 === 1) {
      // Alternierend leicht dunklere Blöcke für bessere visuelle Unterscheidung - sehr subtil
      cellStyles.push({ backgroundColor: "rgba(0, 0, 0, 0.03)" });
    }

    // Zellstatus-spezifische Styles
    if (isSelected) {
      cellStyles.push(styles.selectedCell);
    } else if (sameValueHighlight) {
      cellStyles.push(styles.sameValueCell);
    } else if (isRelated) {
      cellStyles.push(styles.relatedCell);
    }

    if (showErrors && cell.highlight === "error") {
      cellStyles.push(styles.errorCell);
    } else if (cell.highlight === "hint") {
      cellStyles.push(styles.hintCell);
    } else if (cell.highlight === "success") {
      cellStyles.push(styles.successCell);
    }

    // Keine spezielle Hervorhebung mehr für vorgegebene Zellen (isInitial)

    return cellStyles;
  };

  // Textstil basierend auf Zellstatus
  const getTextStyles = () => {
    const textStyles: Array<TextStyle | any> = [styles.cellText];

    if (showErrors && !cell.isValid) {
      textStyles.push(styles.errorText);
    }

    if (cell.isInitial) {
      textStyles.push(styles.initialText); // Behalte fette Schrift für vorgegebene Zahlen
    }

    // Hervorhebung der gleichen Zahlen mit einer anderen Textfarbe statt Hintergrund
    if (sameValueHighlight) {
      textStyles.push(styles.sameValueText);
    }

    return textStyles;
  };

  // Render Notizen wenn Zelle leer ist
  const renderNotes = () => {
    if (cell.value !== 0 || cell.notes.length === 0) return null;

    return (
      <View style={styles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={`note-${num}`}
            style={[
              styles.noteText,
              cell.notes.includes(num)
                ? styles.activeNote
                : styles.inactiveNote,
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
      style={getCellStyles()}
      onPress={() => onPress(row, col)}
      android_ripple={{ color: "rgba(255, 255, 255, 0.2)", borderless: true }}
    >
      <Animated.View style={[styles.cellContent, animatedStyles]}>
        {cell.value !== 0 ? (
          <Animated.Text
            style={getTextStyles()}
            entering={FadeIn.duration(200)}
          >
            {cell.value}
          </Animated.Text>
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
