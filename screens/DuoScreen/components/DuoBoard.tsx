// screens/DuoScreen/components/DuoBoard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { SudokuBoard as SudokuBoardType } from "@/utils/sudoku";
import Animated, { FadeIn } from "react-native-reanimated";

// Calculate optimal board size based on screen width
const { width } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width * 0.95, 350);
const CELL_SIZE = BOARD_SIZE / 9;

// Farbpalette - harmonischer und professioneller gestaltet
const COLORS = {
  // Spielerbereiche - subtiler und eleganter
  player1Base: "#B5C2BD",    // Abgewandelter Salbeiton
  player2Base: "#E6DFD1",    // Wärmerer Cremeton
  
  // Zellen und Boxen
  boardBg: "#1E2233",        // Hintergrund des Boards
  cellBorderLight: "rgba(0, 0, 0, 0.1)",   // Normale Zellgrenzen - dunkler für besseren Kontrast
  boxBorder: "rgba(0, 0, 0, 0.3)",         // 3x3 Box-Grenzen - deutlich dunkler
  
  // Zellentypen
  prefilledCell: "#718584",  // Vorausgefüllte Zellen (wie vorgegeben)
  centerCell: "#4A4A6A",     // Mittlere Zelle - neutraler Ton
  
  // Text und Highlights
  textDark: "#333333",       // Textfarbe für normale Zellen
  textLight: "#FFFFFF",      // Textfarbe für dunkle Zellen
  player1Highlight: "rgba(76, 175, 80, 0.5)",  // Hervorhebung für Spieler 1
  player2Highlight: "rgba(255, 193, 7, 0.5)"   // Hervorhebung für Spieler 2
};

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
  const isSelected = (row: number, col: number, player: 1 | 2): boolean => {
    if (player === 1) {
      return player1Cell !== null && player1Cell.row === row && player1Cell.col === col;
    } else {
      return player2Cell !== null && player2Cell.row === row && player2Cell.col === col;
    }
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
    const isSelectedByPlayer1 = isSelected(row, col, 1);
    const isSelectedByPlayer2 = isSelected(row, col, 2);
    
    // Get cell background color based on various factors
const getCellBackground = () => {
    // Vorausgefüllte Zellen haben Priorität
    if (isInitial) return COLORS.prefilledCell;
    
    // Die mittlere Zelle
    if (row === 4 && col === 4) return COLORS.centerCell;
    
    // Einheitliche Farben für Spielerbereiche
    if (owner === 1) {
      return COLORS.player1Base;
    }
    
    if (owner === 2) {
      return COLORS.player2Base;
    }
    
    return "transparent";
  };
    
    // Cell styling based on all factors
    const cellStyles = [
      styles.cell,
      { backgroundColor: getCellBackground() },
      // Selection styling
      isSelectedByPlayer1 && styles.player1Selected,
      isSelectedByPlayer2 && styles.player2Selected,
    ];

    // Is this cell at a box border?
    const rightBorderStyle = (col + 1) % 3 === 0 && col !== 8 ? styles.boxRightBorder : styles.cellRightBorder;
    const bottomBorderStyle = (row + 1) % 3 === 0 && row !== 8 ? styles.boxBottomBorder : styles.cellBottomBorder;
    
    // Text color and styling
    const textColor = isInitial ? COLORS.textLight : COLORS.textDark;
    const textStyles = [
      styles.cellText,
      { color: textColor },
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

    // Special rendering for the center cell - add Yin-Yang icon
    if (row === 4 && col === 4) {
      return (
        <TouchableOpacity
          key={`cell-${row}-${col}`}
          style={[
            cellStyles, 
            styles.centerCell,
            rightBorderStyle,
            bottomBorderStyle
          ]}
          onPress={handlePress}
          disabled={isInitial || isLoading}
          activeOpacity={isInitial ? 1 : 0.7}
        >
          {value !== 0 ? (
            <Text style={textStyles}>{value}</Text>
          ) : (
            <Image
              source={require("@/assets/images/icons/yin-yang.png")}
              style={styles.yinYangIcon}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={`cell-${row}-${col}`}
        style={[
          cellStyles,
          rightBorderStyle,
          bottomBorderStyle
        ]}
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
      <View style={[styles.board, { backgroundColor: COLORS.boardBg }]}>
        {/* Board content */}
        <View style={styles.gridContainer}>
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
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    position: "relative",
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    position: "relative",
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
    position: "relative",
  },
  centerCell: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  cellText: {
    fontSize: Math.max(CELL_SIZE / 2, 18),
    fontWeight: "600",
  },
  // Borders - klare Unterscheidung zwischen Zellen und 3x3-Boxen
  cellRightBorder: {
    borderRightWidth: 1,
    borderRightColor: COLORS.cellBorderLight,
  },
  cellBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cellBorderLight,
  },
  boxRightBorder: {
    borderRightWidth: 2.5,
    borderRightColor: COLORS.boxBorder,
  },
  boxBottomBorder: {
    borderBottomWidth: 2.5,
    borderBottomColor: COLORS.boxBorder,
  },
  // Selection styling
  player1Selected: {
    backgroundColor: COLORS.player1Highlight,
    borderWidth: 1.5,
    borderColor: "rgba(76, 175, 80, 0.8)",
  },
  player2Selected: {
    backgroundColor: COLORS.player2Highlight,
    borderWidth: 1.5,
    borderColor: "rgba(255, 193, 7, 0.8)",
  },
  rotatedText: {
    transform: [{ rotate: "180deg" }],
  },
  underlinedNumber: {
    textDecorationLine: 'underline',
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
    color: "rgba(45, 55, 72, 0.7)",
    lineHeight: CELL_SIZE / 3,
  },
  // Yin-Yang icon for center cell
  yinYangIcon: {
    width: CELL_SIZE * 0.7,
    height: CELL_SIZE * 0.7,
    opacity: 0.9,
  }
});

export default DuoBoard;