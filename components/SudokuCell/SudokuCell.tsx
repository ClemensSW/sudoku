import React, { memo, useEffect } from "react";
import { Text, Pressable, View } from "react-native";
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
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  row,
  col,
  isSelected,
  isRelated,
  sameValueHighlight = false,
  onPress,
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
    const cellStyles = [styles.cell];
    
    // Grenzen für 3x3 Boxen
    if ((row + 1) % 3 === 0 && row !== 8) {
      cellStyles.push(styles.bottomBorder);
    }
    if ((col + 1) % 3 === 0 && col !== 8) {
      cellStyles.push(styles.rightBorder);
    }
    
    // Zellstatus-spezifische Styles
    if (isSelected) {
      cellStyles.push(styles.selectedCell);
    } else if (sameValueHighlight) {
      cellStyles.push(styles.sameValueCell);
    } else if (isRelated) {
      cellStyles.push(styles.relatedCell);
    }
    
    if (cell.highlight === "error") {
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
    const textStyles = [styles.cellText];
    
    if (!cell.isValid) {
      textStyles.push(styles.errorText);
    }
    
    if (cell.isInitial) {
      textStyles.push(styles.initialText); // Behalte fette Schrift für vorgegebene Zahlen
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
              cell.notes.includes(num) ? styles.activeNote : styles.inactiveNote
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
    prevProps.sameValueHighlight === nextProps.sameValueHighlight
  );
});