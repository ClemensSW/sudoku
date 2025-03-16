// screens/DuoScreen/components/DuoBoard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { SudokuBoard as SudokuBoardType } from "@/utils/sudoku";
import Animated, { FadeIn } from "react-native-reanimated";

// Calculate optimal board size based on screen width
const { width } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width * 0.95, 350);
const CELL_SIZE = BOARD_SIZE / 9;

interface DuoBoardProps {
  board: SudokuBoardType;
  player1Cell: {row: number, col: number} | null;
  player2Cell: {row: number, col: number} | null;
  onCellPress: (player: 1 | 2, row: number, col: number) => void;
  isLoading?: boolean;
}

const DuoBoard: React.FC<DuoBoardProps> = ({
  board,
  player1Cell,
  player2Cell,
  onCellPress,
  isLoading = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Determine which player's area a cell belongs to
  const getCellOwner = (row: number, col: number): 1 | 2 | 0 => {
    if (row === 4 && col === 4) return 0; // Neutral middle cell
    if (row < 4 || (row === 4 && col < 4)) return 2; // Player 2's area (top)
    return 1; // Player 1's area (bottom)
  };

  // Check if a cell is selected by a player
  const isSelected = (row: number, col: number): boolean => {
    return (player1Cell !== null && player1Cell.row === row && player1Cell.col === col) ||
           (player2Cell !== null && player2Cell.row === row && player2Cell.col === col);
  };

  // Render notes for a cell
  const renderNotes = (row: number, col: number, owner: 1 | 2 | 0) => {
    const notes = board[row][col].notes;
    if (!notes || notes.length === 0) return null;

    const needsRotation = owner === 2; // Rotate for player 2 (top)

    return (
      <View style={styles.notesGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={`note-${row}-${col}-${num}`}
            style={[
              styles.noteText,
              needsRotation && styles.rotatedText,
              !notes.includes(num) && { opacity: 0 },
              (num === 6 || num === 9) && styles.underlinedNumber
            ]}
          >
            {num}
          </Text>
        ))}
      </View>
    );
  };

  // Render a single cell
  const renderCell = (row: number, col: number) => {
    const value = board[row][col].value;
    const isInitial = board[row][col].isInitial;
    const owner = getCellOwner(row, col);
    const isSelectedByPlayer1 = player1Cell?.row === row && player1Cell?.col === col;
    const isSelectedByPlayer2 = player2Cell?.row === row && player2Cell?.col === col;
    
    // Cell styling based on owner and state
    const cellStyles = [
      styles.cell,
      // Add border styles for 3x3 boxes
      (col + 1) % 3 === 0 && col !== 8 && styles.rightBorder,
      (row + 1) % 3 === 0 && row !== 8 && styles.bottomBorder,
      // Add player area styling with different color intensities
      owner === 1 && styles.player1Area,
      owner === 2 && styles.player2Area,
      owner === 0 && styles.neutralArea,
      // Selection styling
      isSelectedByPlayer1 && styles.player1Selected,
      isSelectedByPlayer2 && styles.player2Selected,
      // Initial cell styling
      isInitial && styles.initialCell
    ];

    // Text styling with rotation for Player 2 area
    const textStyles = [
      styles.cellText,
      isInitial && styles.initialCellText,
      // Rotate text 180 degrees in Player 2's area
      owner === 2 && styles.rotatedText,
      // Add underline for 6 and 9 to make them more distinguishable when rotated
      (value === 6 || value === 9) && styles.underlinedNumber
    ];

    // Handle cell press
    const handlePress = () => {
      if (!isInitial && !isLoading) {
        onCellPress(owner === 2 ? 2 : 1, row, col);
      }
    };

    return (
      <TouchableOpacity
        key={`cell-${row}-${col}`}
        style={cellStyles}
        onPress={handlePress}
        disabled={isInitial || isLoading}
        activeOpacity={isInitial ? 1 : 0.7}
      >
        {value !== 0 ? (
          <Text style={textStyles}>
            {value}
          </Text>
        ) : (
          renderNotes(row, col, owner)
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={styles.boardContainer} entering={FadeIn.duration(500)}>
      <View style={[styles.board, { backgroundColor: theme.isDark ? "#1E2233" : colors.primary + '15' }]}>
        {/* Board content */}
        <View style={styles.gridContainer}>
          {/* Grid lines for 3x3 blocks - no divider between player areas */}
          <View style={[styles.gridLine, styles.horizontalLine, { top: CELL_SIZE * 3 }]} />
          <View style={[styles.gridLine, styles.horizontalLine, { top: CELL_SIZE * 6 }]} />
          <View style={[styles.gridLine, styles.verticalLine, { left: CELL_SIZE * 3 }]} />
          <View style={[styles.gridLine, styles.verticalLine, { left: CELL_SIZE * 6 }]} />
          
          {/* Render all cells */}
          {board.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((_, colIndex) => (
                renderCell(rowIndex, colIndex)
              ))}
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  gridContainer: {
    flex: 1,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    height: CELL_SIZE,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  cellText: {
    fontSize: Math.max(CELL_SIZE / 2, 18),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  initialCell: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  initialCellText: {
    fontWeight: "700",
  },
  player1Selected: {
    backgroundColor: "rgba(76, 175, 80, 0.3)", // Green for Player 1
  },
  player2Selected: {
    backgroundColor: "rgba(255, 193, 7, 0.3)", // Yellow for Player 2
  },
  rightBorder: {
    borderRightWidth: 1.5,
    borderRightColor: "rgba(255, 255, 255, 0.35)",
  },
  bottomBorder: {
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(255, 255, 255, 0.35)",
  },
  player1Area: {
    backgroundColor: "rgba(76, 175, 80, 0.12)", // Green for Player 1 - more subtle
  },
  player2Area: {
    backgroundColor: "rgba(255, 193, 7, 0.12)", // Yellow for Player 2 - more subtle
  },
  neutralArea: {
    backgroundColor: "rgba(66, 133, 244, 0.15)", // Blue for neutral cell
  },
  rotatedText: {
    transform: [{ rotate: "180deg" }],
  },
  underlinedNumber: {
    textDecorationLine: 'underline',
  },
  // Grid lines
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    zIndex: 5,
  },
  horizontalLine: {
    width: BOARD_SIZE,
    height: 1.5,
    left: 0,
  },
  verticalLine: {
    width: 1.5,
    height: BOARD_SIZE,
    top: 0,
  },
  // Styles for notes
  notesGrid: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  noteText: {
    width: "33%",
    height: "33%",
    fontSize: Math.max(CELL_SIZE / 6, 9),
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: CELL_SIZE / 3,
  }
});

export default DuoBoard;