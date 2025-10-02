// screens/DuoGameScreen/components/DuoGameCell.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SudokuCell } from "@/utils/sudoku";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { CELL_SIZE } from "@/screens/Game/components/SudokuBoard/SudokuBoard.styles";

// Player color themes (higher contrast)
const PLAYER_THEMES = {
  1: {
    cellBackground: "#4A7D78",
    textColor: "#F1F4FB",
    selectedBackground: "#406B6D",
    initial: { textColor: "#F1F4FB" },
    notes: { textColor: "rgba(241, 244, 251, 0.9)" },
    error: {
      background: "rgba(255, 100, 100, 0.4)",
      selectedBackground: "rgba(255, 120, 120, 0.6)",
      textColor: "#FFD5D5",
    },
  },
  2: {
    cellBackground: "#F3EFE3",
    textColor: "#5B5D6E",
    selectedBackground: "#E6E0C5",
    initial: { textColor: "#5B5D6E" },
    notes: { textColor: "rgba(91, 93, 110, 0.95)" },
    error: {
      background: "rgba(255, 100, 100, 0.3)",
      selectedBackground: "rgba(255, 120, 120, 0.5)",
      textColor: "#BB5555",
    },
  },
  0: {
    cellBackground: "#E0E8E7",
    textColor: "#2D3045",
    selectedBackground: "#C5D1CF",
    initial: { textColor: "#2D3045" },
    notes: { textColor: "rgba(45, 48, 69, 0.95)" },
    error: {
      background: "rgba(255, 100, 100, 0.3)",
      selectedBackground: "rgba(255, 120, 120, 0.5)",
      textColor: "#BB5555",
    },
  },
} as const;

interface DuoGameCellProps {
  cell: SudokuCell;
  row: number;
  col: number;
  player: 0 | 1 | 2; // 0 = neutral/middle, 1 = bottom, 2 = top
  isSelected: boolean;
  onPress: (row: number, col: number) => void; // stable, shared handler from parent
  rotateForPlayer2?: boolean;
  showErrors?: boolean;
}

const DuoGameCell: React.FC<DuoGameCellProps> = ({
  cell,
  row,
  col,
  player,
  isSelected,
  onPress,
  rotateForPlayer2 = true,
  showErrors = true,
}) => {
  const theme = PLAYER_THEMES[player];

  // Pulse animation only when *filled* by the player
  const scale = useSharedValue(1);
  React.useEffect(() => {
    if (cell.value !== 0 && !cell.isInitial) {
      scale.value = withSequence(
        withTiming(1.05, { duration: 120 }),
        withTiming(1, { duration: 150 })
      );
    }
  }, [cell.value, cell.isInitial, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Colors (computed via simple branching to keep render cheap)
  const getCellBackgroundColor = () => {
    if (isSelected && !cell.isValid && showErrors) {
      return theme.error.selectedBackground;
    }
    if (!cell.isValid && showErrors) {
      return theme.error.background;
    }
    if (isSelected) {
      return theme.selectedBackground;
    }
    return theme.cellBackground;
  };

  const getTextColor = () => {
    if (!cell.isValid && showErrors) return theme.error.textColor;
    if (cell.isInitial) return theme.initial.textColor;
    return theme.textColor;
  };

  const shouldUnderlineNumber = (num: number) => num === 6 || num === 9;

  const renderNotes = () => {
    if (cell.value !== 0 || !cell.notes || cell.notes.length === 0) return null;

    return (
      <View style={styles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={`note-${num}`}
            style={[
              styles.noteText,
              { color: theme.notes.textColor },
              cell.notes.includes(num) ? styles.activeNote : styles.inactiveNote,
              player === 2 && rotateForPlayer2 && styles.rotatedText,
              shouldUnderlineNumber(num) && styles.underlinedNumber,
            ]}
          >
            {cell.notes.includes(num) ? num : ""}
          </Text>
        ))}
      </View>
    );
  };

  const shouldRotateContent = player === 2 && rotateForPlayer2;
  const middleCellShadow =
    player === 0
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
          zIndex: 5,
        }
      : null;

  return (
    <TouchableOpacity
      style={[
        styles.cellContainer,
        { backgroundColor: getCellBackgroundColor() },
        middleCellShadow as any,
        {
          borderWidth: 0.5,
          borderColor: player === 0 ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.2)",
        },
      ]}
      onPress={() => onPress(row, col)}
      disabled={cell.isInitial}
      activeOpacity={cell.isInitial ? 1 : 0.7}
    >
      <Animated.View
        style={[
          styles.cellContent,
          animatedStyle,
          shouldRotateContent && styles.rotatedContent,
        ]}
      >
        {cell.value !== 0 ? (
          <Text
            style={[
              styles.cellText,
              { color: getTextColor() },
              cell.isInitial && styles.initialText,
              shouldRotateContent && styles.rotatedText,
              shouldUnderlineNumber(cell.value) && styles.underlinedNumber,
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
  cellContainer: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cellContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: Math.max(CELL_SIZE * 0.5, 18),
    fontWeight: "300",
  },
  initialText: {
    fontWeight: "700",
  },
  notesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
    padding: 2,
  },
  noteText: {
    fontSize: Math.max(CELL_SIZE * 0.2, 9),
    width: "33%",
    height: "33%",
    textAlign: "center",
    textAlignVertical: "center",
  },
  activeNote: { opacity: 1 },
  inactiveNote: { opacity: 0 },
  rotatedContent: { transform: [{ rotate: "180deg" }] },
  rotatedText: { transform: [{ rotate: "180deg" }] },
  underlinedNumber: { textDecorationLine: "underline" },
});

// ---------- High-precision memo comparator to avoid 81 re-renders ----------
function arraysEqualShallow(a?: number[], b?: number[]) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function cellsEqual(a: SudokuCell, b: SudokuCell) {
  if (a === b) return true;
  return (
    a.value === b.value &&
    a.isInitial === b.isInitial &&
    // if your model exposes validity/notes; guard if undefined
    (a as any).isValid === (b as any).isValid &&
    arraysEqualShallow(a.notes, b.notes)
  );
}

function propsEqual(prev: Readonly<DuoGameCellProps>, next: Readonly<DuoGameCellProps>) {
  // Intentionally ignore row/col and onPress identity to keep cell renders minimal.
  return (
    prev.player === next.player &&
    prev.isSelected === next.isSelected &&
    (prev.showErrors ?? true) === (next.showErrors ?? true) &&
    cellsEqual(prev.cell, next.cell)
  );
}

export default React.memo(DuoGameCell, propsEqual);
