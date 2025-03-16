import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { SudokuBoard as SudokuBoardType } from "@/utils/sudoku";
import Animated, { FadeIn } from "react-native-reanimated";
import styles from "./DuoBoard.styles";

interface DuoBoardProps {
  board: SudokuBoardType;
  player1Area: { row: number; col: number }[];
  player2Area: { row: number; col: number }[];
  isLoading?: boolean;
  onCellPress: (player: 1 | 2, row: number, col: number, value: number) => void;
  player1Cell: { row: number; col: number } | null;
  player2Cell: { row: number; col: number } | null;
  currentPlayer: 1 | 2;
}

const DuoBoard: React.FC<DuoBoardProps> = ({
  board,
  player1Area,
  player2Area,
  isLoading = false,
  onCellPress,
  player1Cell,
  player2Cell,
  currentPlayer,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const isInPlayer1Area = (row: number, col: number): boolean => {
    return player1Area.some((cell) => cell.row === row && cell.col === col);
  };

  const isInPlayer2Area = (row: number, col: number): boolean => {
    return player2Area.some((cell) => cell.row === row && cell.col === col);
  };

  const isMiddleCell = (row: number, col: number): boolean => {
    return row === 4 && col === 4;
  };

  const isSelectedCell = (row: number, col: number): boolean => {
    return (
      (player1Cell !== null &&
        player1Cell.row === row &&
        player1Cell.col === col) ||
      (player2Cell !== null &&
        player2Cell.row === row &&
        player2Cell.col === col)
    );
  };

  const renderCell = (row: number, col: number) => {
    const cellValue = board[row][col].value;
    const isInitial = board[row][col].isInitial;
    const isValid = board[row][col].isValid;
    
    const belongsToPlayer1 = isInPlayer1Area(row, col);
    const belongsToPlayer2 = isInPlayer2Area(row, col);
    const isMiddle = isMiddleCell(row, col);
    const isSelected = isSelectedCell(row, col);
    
    // Determine cell background
    let cellBackground;
    if (isMiddle) {
      cellBackground = styles.sharedCell;
    } else if (belongsToPlayer1) {
      cellBackground = styles.player1Area;
    } else if (belongsToPlayer2) {
      cellBackground = styles.player2Area;
    } else if (isInitial) {
      cellBackground = styles.fixedCell;
    }
    
    // Determine if cell should be rotated (player 1 area)
    const shouldRotate = belongsToPlayer1;
    
    // Add border styles based on grid position
    const borderStyles = [];
    if ((col + 1) % 3 === 0 && col !== 8) {
      borderStyles.push(styles.borderRight);
    }
    if ((row + 1) % 3 === 0 && row !== 8) {
      borderStyles.push(styles.borderBottom);
    }
    
    // Handle cell press
    const handlePress = () => {
      if (isInitial || isLoading) return;
      
      // Wert ist 0 für Zellauswahl ohne direkten Zahleneintrag
      if (belongsToPlayer1 && currentPlayer === 1) {
        onCellPress(1, row, col, 0);
      } else if (belongsToPlayer2 && currentPlayer === 2) {
        onCellPress(2, row, col, 0);
      }
    };
    
    return (
      <TouchableOpacity
        key={`cell-${row}-${col}`}
        style={[
          styles.cell,
          cellBackground,
          ...borderStyles,
          isSelected && { backgroundColor: colors.primary + "40" },
          !isValid && cellValue !== 0 && { backgroundColor: colors.error + "40" },
        ]}
        onPress={handlePress}
        disabled={isInitial || isLoading || 
          (belongsToPlayer1 && currentPlayer !== 1) ||
          (belongsToPlayer2 && currentPlayer !== 2)
        }
      >
        {shouldRotate ? (
          <View style={styles.rotatedView}>
            <Text 
              style={[
                styles.cellText,
                isInitial && styles.fixedCellText,
                !isValid && { color: colors.error }
              ]}
            >
              {cellValue !== 0 ? cellValue.toString() : ""}
            </Text>
          </View>
        ) : (
          <Text 
            style={[
              styles.cellText,
              isInitial && styles.fixedCellText,
              !isValid && { color: colors.error }
            ]}
          >
            {cellValue !== 0 ? cellValue.toString() : ""}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={styles.boardContainer} entering={FadeIn.duration(500)}>
      {/* Player 1 Label (Rotated) */}
      <View style={[styles.playerLabel, styles.player1Label]}>
        <Text style={[styles.playerLabelText, styles.rotatedText]}>
          Spieler 1
        </Text>
      </View>
      
      <View style={styles.board}>
        {/* Horizontal grid lines */}
        <View style={[styles.gridLine, styles.horizontalGridLine, { top: styles.CELL_SIZE * 3 }]} />
        <View style={[styles.gridLine, styles.horizontalGridLine, { top: styles.CELL_SIZE * 6 }]} />
        
        {/* Vertical grid lines */}
        <View style={[styles.gridLine, styles.verticalGridLine, { left: styles.CELL_SIZE * 3 }]} />
        <View style={[styles.gridLine, styles.verticalGridLine, { left: styles.CELL_SIZE * 6 }]} />
        
        {/* Divider line between player 1 and player 2 */}
        <View style={styles.divider} />
        
        {/* Board cells */}
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </View>
        ))}
      </View>
      
      {/* Player 2 Label */}
      <View style={[styles.playerLabel, styles.player2Label]}>
        <Text style={styles.playerLabelText}>
          Spieler 2
        </Text>
      </View>
    </Animated.View>
  );
};

export default DuoBoard;