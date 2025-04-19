// screens/DuoGameScreen/components/DuoGameBoard.tsx
import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { SudokuBoard, CellPosition } from "@/utils/sudoku";
import DuoGameCell from "./DuoGameCell";
import { BOARD_SIZE as SHARED_BOARD_SIZE, CELL_SIZE as SHARED_CELL_SIZE } from "@/components/SudokuBoard/SudokuBoard.styles";

// Use the same constants as the regular SudokuBoard for consistency
const BOARD_SIZE = SHARED_BOARD_SIZE;
const GRID_SIZE = BOARD_SIZE * 0.95;
const CELL_SIZE = SHARED_CELL_SIZE;

// Player color themes - verbesserte Sichtbarkeit 
const PLAYER_COLORS = {
  1: "#4A7D78", // Teal - Player 1 (bottom)
  2: "#F3EFE3", // Light beige - Player 2 (top)
  0: "#E0E8E7", // Medium light neutral - Middle cell
};

interface DuoGameBoardProps {
  board: SudokuBoard;
  player1Cell: CellPosition | null;
  player2Cell: CellPosition | null;
  getCellOwner: (row: number, col: number) => 0 | 1 | 2;
  onCellPress: (player: 1 | 2, row: number, col: number) => void;
  isLoading?: boolean;
}

const DuoGameBoard: React.FC<DuoGameBoardProps> = ({
  board,
  player1Cell,
  player2Cell,
  getCellOwner,
  onCellPress,
  isLoading = false,
}) => {
  // Animation values
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  // Initialize animations when board is ready
  React.useEffect(() => {
    if (board.length > 0) {
      // Animate board entry
      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [board]);

  // Update animation based on loading state
  React.useEffect(() => {
    // Scale slightly down when loading
    scale.value = withTiming(
      isLoading ? 0.97 : 1,
      {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }
    );
  }, [isLoading]);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  // Handle cell press and determine which player's area it belongs to
  const handleCellPress = (row: number, col: number) => {
    const playerNum = getCellOwner(row, col);
    
    if (playerNum === 0) {
      // For the middle cell, let both players press it
      // Determine which player based on which one has an active selection
      if (player1Cell) {
        onCellPress(1, row, col);
      } else if (player2Cell) {
        onCellPress(2, row, col);
      } else {
        // Default to player 1 if no one has an active selection
        onCellPress(1, row, col);
      }
    } else {
      onCellPress(playerNum, row, col);
    }
  };

  // Render a cell based on its coordinates
  const renderCell = (row: number, col: number) => {
    const cellData = board[row][col];
    const playerNum = getCellOwner(row, col);
    
    const isSelectedByPlayer1 = 
      player1Cell?.row === row && player1Cell?.col === col;
    const isSelectedByPlayer2 = 
      player2Cell?.row === row && player2Cell?.col === col;
    
    return (
      <DuoGameCell
        key={`cell-${row}-${col}`}
        cell={cellData}
        row={row}
        col={col}
        player={playerNum}
        isSelected={isSelectedByPlayer1 || isSelectedByPlayer2}
        onPress={() => handleCellPress(row, col)}
        rotateForPlayer2={true}
      />
    );
  };

  // Calculate area heights based on percentages of the board
  const topAreaHeight = BOARD_SIZE * 0.47; // Player 2 (top) area - 45%
  const gradientHeight = BOARD_SIZE * 0.15; // Gradient area - 10%
  const bottomAreaHeight = BOARD_SIZE * 0.45; // Player 1 (bottom) area - 45%

  return (
    <View style={styles.boardContainer}>
      <Animated.View style={[styles.boardWrapper, animatedStyle]}>
        <View style={styles.board}>
          {/* Player Areas Background with Gradient Transition */}
          <View style={styles.playerAreasContainer}>
            {/* Player 2 (Top) Area Background */}
            <View 
              style={[
                styles.playerAreaBackground, 
                { 
                  top: 0,
                  height: topAreaHeight,
                  backgroundColor: PLAYER_COLORS[2] 
                }
              ]} 
            />
            
            {/* Gradient Transition in the middle */}
            <LinearGradient
              colors={[PLAYER_COLORS[2], PLAYER_COLORS[1]]}
              style={[
                styles.gradientTransition,
                {
                  top: topAreaHeight,
                  height: gradientHeight
                }
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            
            {/* Player 1 (Bottom) Area Background */}
            <View 
              style={[
                styles.playerAreaBackground, 
                { 
                  bottom: 0,
                  height: bottomAreaHeight,
                  backgroundColor: PLAYER_COLORS[1] 
                }
              ]} 
            />
            
            {/* Middle Cell Background - mit verbessertem Schatten */}
            <View 
              style={[
                styles.middleCellBackground,
                {
                  left: CELL_SIZE * 4,
                  top: topAreaHeight + (gradientHeight/2) - (CELL_SIZE/2), // Center in the gradient area
                  width: CELL_SIZE,
                  height: CELL_SIZE
                }
              ]} 
            />
          </View>

          <View style={styles.gridContainer}>
            {/* Horizontal grid lines - verbesserte Sichtbarkeit */}
            <View
              style={[
                styles.gridLine,
                styles.horizontalGridLine,
                { top: CELL_SIZE * 3 },
              ]}
            />
            <View
              style={[
                styles.gridLine,
                styles.horizontalGridLine,
                { top: CELL_SIZE * 6 },
              ]}
            />
            
            {/* Vertical grid lines - verbesserte Sichtbarkeit */}
            <View
              style={[
                styles.gridLine,
                styles.verticalGridLine,
                { left: CELL_SIZE * 3 },
              ]}
            />
            <View
              style={[
                styles.gridLine,
                styles.verticalGridLine,
                { left: CELL_SIZE * 6 },
              ]}
            />

            {/* Render all cells */}
            {board.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
              </View>
            ))}
          </View>

          {/* Loading overlay */}
          {isLoading && (
            <Animated.View
              style={styles.loadingOverlay}
              entering={FadeIn.duration(200)}
            >
              <ActivityIndicator size="large" color="#FFFFFF" />
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  boardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    // Verbesserter Schatten für beide Modi
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: "transparent", // Hintergrund transparent, damit Spielerbereiche sichtbar sind
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  
  // Container für die Spielerbereiche
  playerAreasContainer: {
    position: "absolute",
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    overflow: "hidden",
    borderRadius: 8,
    zIndex: 0, // Unter dem Grid
  },
  
  // Gemeinsame Eigenschaften für beide Spielerbereiche
  playerAreaBackground: {
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
  },
  
  // Gradient für die Mittelreihe (Zeile 4)
  gradientTransition: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
  },
  
  // Separater Hintergrund für die mittlere Zelle - verbessert mit Schatten
  middleCellBackground: {
    position: "absolute",
    backgroundColor: PLAYER_COLORS[0], // Neutrale Farbe für die mittlere Zelle
    zIndex: 2, // Über den Spielerhintergründen und dem Gradient
    // Schatten für bessere Sichtbarkeit
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  
  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderWidth: 2, // Dickerer Rahmen für bessere Sichtbarkeit
    borderColor: "rgba(0, 0, 0, 0.4)", // Dunklerer Rahmen für besseren Kontrast
    overflow: "hidden",
    position: "relative",
    borderRadius: 8,
    backgroundColor: "transparent", // Wichtig: damit die Spielerbereiche durchscheinen
    zIndex: 1, // Über den Spielerbereichen
  },
  row: {
    flexDirection: "row",
    height: CELL_SIZE,
  },
  // Grid lines - verbesserte Sichtbarkeit
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dunklere Linien für bessere Sichtbarkeit
    zIndex: 2,
  },
  horizontalGridLine: {
    width: GRID_SIZE,
    height: 2, // Dickere Linie
    left: 0,
  },
  verticalGridLine: {
    width: 2, // Dickere Linie
    height: GRID_SIZE,
    top: 0,
  },
  // Loading overlay
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderRadius: 8,
  },
});

export default DuoGameBoard;