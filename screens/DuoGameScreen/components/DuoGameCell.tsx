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
import { CELL_SIZE } from "@/components/SudokuBoard/SudokuBoard.styles";

// Player color themes based on the provided color palette
const PLAYER_THEMES = {
  // Player 1 (bottom)
  1: {
    cellBackground: "#4A7D78", // Teal
    textColor: "#F1F4FB",      // Light blue/white
    selectedBackground: "#406B6D", // Darker teal
    initial: {
      background: "#3D6B67", // Slightly darker teal for initial cells
      textColor: "#F1F4FB"   // Same text color
    },
    notes: {
      textColor: "rgba(241, 244, 251, 0.8)", // Light text with transparency
    },
    error: {
      background: "rgba(255, 100, 100, 0.3)", // Red with transparency
      textColor: "#FFD5D5"  // Light red
    }
  },
  // Player 2 (top)
  2: {
    cellBackground: "#F3EFE3", // Light beige
    textColor: "#5B5D6E",      // Dark blue-gray
    selectedBackground: "#E6E0C5", // Lighter beige
    initial: {
      background: "#E8E4D8", // Slightly darker beige for initial cells
      textColor: "#5B5D6E"   // Same text color
    },
    notes: {
      textColor: "rgba(91, 93, 110, 0.8)", // Dark text with transparency
    },
    error: {
      background: "rgba(255, 100, 100, 0.2)", // Red with transparency
      textColor: "#BB5555"  // Darker red
    }
  },
  // Neutral cell (middle)
  0: {
    cellBackground: "#E0E8E7", // Medium light neutral color
    textColor: "#2D3045",      // Very dark blue-gray
    selectedBackground: "#C5D1CF", // Slightly darker neutral
    initial: {
      background: "#D5DDDC", // Slightly darker neutral for initial cells
      textColor: "#2D3045"   // Same text color
    },
    notes: {
      textColor: "rgba(45, 48, 69, 0.8)", // Dark text with transparency
    },
    error: {
      background: "rgba(255, 100, 100, 0.2)", // Red with transparency
      textColor: "#BB5555"  // Darker red
    }
  }
};

interface DuoGameCellProps {
  cell: SudokuCell;
  row: number;
  col: number;
  player: 0 | 1 | 2; // 0 = neutral/middle cell, 1 = player 1, 2 = player 2
  isSelected: boolean;
  onPress: (row: number, col: number) => void;
  rotateForPlayer2?: boolean;
}

const DuoGameCell: React.FC<DuoGameCellProps> = ({
  cell,
  row,
  col,
  player,
  isSelected,
  onPress,
  rotateForPlayer2 = true,
}) => {
  const theme = PLAYER_THEMES[player];
  
  // Animation value for scale
  const scale = useSharedValue(1);

  // Animate when value changes
  React.useEffect(() => {
    if (cell.value !== 0 && !cell.isInitial) {
      // Small pulse animation when cell value changes
      scale.value = withSequence(
        withTiming(1.05, { duration: 120 }),
        withTiming(1, { duration: 150 })
      );
    }
  }, [cell.value]);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Determine cell background color
  const getCellBackgroundColor = () => {
    if (!cell.isValid) {
      return theme.error.background;
    }
    if (isSelected) {
      return theme.selectedBackground;
    }
    if (cell.isInitial) {
      return theme.initial.background;
    }
    return theme.cellBackground;
  };

  // Determine text color
  const getTextColor = () => {
    if (!cell.isValid) {
      return theme.error.textColor;
    }
    if (cell.isInitial) {
      return theme.initial.textColor;
    }
    return theme.textColor;
  };

  // Render notes for empty cells
  const renderNotes = () => {
    if (cell.value !== 0 || cell.notes.length === 0) return null;

    return (
      <View style={styles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={`note-${num}`}
            style={[
              styles.noteText,
              { color: theme.notes.textColor },
              cell.notes.includes(num)
                ? styles.activeNote
                : styles.inactiveNote,
              // For player 2 (top), rotate text if needed
              player === 2 && rotateForPlayer2 && styles.rotatedText,
              // For 6 and 9, add underline to distinguish when rotated
              (num === 6 || num === 9) && styles.underlinedNumber
            ]}
          >
            {cell.notes.includes(num) ? num : ""}
          </Text>
        ))}
      </View>
    );
  };

  // Determine if the content needs to be rotated (for player 2)
  const shouldRotateContent = player === 2 && rotateForPlayer2;

  return (
    <TouchableOpacity
      style={[
        styles.cellContainer,
        { backgroundColor: getCellBackgroundColor() }
      ]}
      onPress={() => onPress(row, col)}
      disabled={cell.isInitial}
      activeOpacity={cell.isInitial ? 1 : 0.7}
    >
      <Animated.View 
        style={[
          styles.cellContent,
          animatedStyle,
          shouldRotateContent && styles.rotatedContent
        ]}
      >
        {cell.value !== 0 ? (
          <Text 
            style={[
              styles.cellText,
              { color: getTextColor() },
              cell.isInitial && styles.initialText,
              shouldRotateContent && styles.rotatedText,
              // For 6 and 9, add underline to distinguish when rotated
              shouldRotateContent && (cell.value === 6 || cell.value === 9) && 
                styles.underlinedNumber
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
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  cellContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: Math.max(CELL_SIZE * 0.5, 18),
    fontWeight: "600",
  },
  initialText: {
    fontWeight: "700",
  },
  // Note styles
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
  activeNote: {
    opacity: 1,
  },
  inactiveNote: {
    opacity: 0,
  },
  // Rotation styles for player 2
  rotatedContent: {
    transform: [{ rotate: "180deg" }],
  },
  rotatedText: {
    transform: [{ rotate: "180deg" }],
  },
  // Helper for 6 and 9 when rotated
  underlinedNumber: {
    textDecorationLine: "underline",
  }
});

export default React.memo(DuoGameCell);