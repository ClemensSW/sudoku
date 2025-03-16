import React from "react";
import { View, Text } from "react-native";
import SudokuCell from "@/components/SudokuCell/SudokuCell"; // Verwende deine bestehende Zellkomponente
import styles from "./DuoBoard.styles";

interface DuoBoardProps {
  board: any[][];
  player1Area: { row: number, col: number }[];
  player2Area: { row: number, col: number }[];
  isLoading: boolean;
  onNumberInput: (player: 1 | 2, row: number, col: number, value: number) => void;
}

const DuoBoard: React.FC<DuoBoardProps> = ({
  board, 
  player1Area, 
  player2Area, 
  isLoading,
  onNumberInput
}) => {
  // Funktion zum Rendern einer Zelle mit korrekter Rotation
  const renderCell = (row: number, col: number) => {
    // Bestimme welchem Spieler die Zelle gehört
    const isPlayer1Cell = player1Area.some(cell => cell.row === row && cell.col === col);
    const isPlayer2Cell = player2Area.some(cell => cell.row === row && cell.col === col);
    const isMiddleCell = row === 4 && col === 4; // Die spezielle Zelle 5 in Zeile 5
    
    // Rotation für Spieler 1-Zellen
    const shouldRotate = isPlayer1Cell;
    
    // Zellen-Hintergrundfarbe basierend auf Spielerbereich
    const cellStyle = isPlayer1Cell 
      ? styles.player1Cell 
      : isPlayer2Cell 
        ? styles.player2Cell 
        : styles.fixedCell;
    
    // Wenn die Zelle die spezielle Mittenzelle ist
    if (isMiddleCell) {
      return (
        <View key={`cell-${row}-${col}`} style={[styles.cell, styles.fixedCell]}>
          <Text style={styles.fixedCellText}>
            {board[row][col].value}
          </Text>
        </View>
      );
    }
    
    // Reguläre Zelle mit potenzieller Rotation
    return (
      <View 
        key={`cell-${row}-${col}`} 
        style={[styles.cell, cellStyle]}
      >
        <View style={shouldRotate ? styles.rotatedCell : {}}>
          <SudokuCell
            cell={board[row][col]}
            row={row}
            col={col}
            isSelected={false}
            isRelated={false}
            onPress={() => {
              if (isPlayer1Cell) {
                onNumberInput(1, row, col, /* value to be determined */);
              } else if (isPlayer2Cell) {
                onNumberInput(2, row, col, /* value to be determined */);
              }
            }}
          />
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.boardContainer}>
      {/* Spielername für Spieler 1 (rotiert) */}
      <View style={[styles.playerLabel, styles.player1Label]}>
        <Text style={[styles.playerText, styles.rotatedText]}>Spieler 1</Text>
      </View>
      
      {/* Sudoku Board */}
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </View>
        ))}
      </View>
      
      {/* Spielername für Spieler 2 */}
      <View style={[styles.playerLabel, styles.player2Label]}>
        <Text style={styles.playerText}>Spieler 2</Text>
      </View>
    </View>
  );
};