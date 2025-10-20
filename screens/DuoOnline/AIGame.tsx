/**
 * AIGame Screen
 *
 * Play against AI opponent with adaptive difficulty
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAIOpponent } from '@/hooks/online/useAIOpponent';
import { generateGame } from '@/utils/sudoku/generator';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type AIPersonality = 'methodical' | 'balanced' | 'speedster';

export default function AIGame() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    difficulty?: Difficulty;
    personality?: AIPersonality;
  }>();

  const difficulty = (params.difficulty || 'medium') as Difficulty;
  const personality = (params.personality || 'balanced') as AIPersonality;

  // Game state
  const [board, setBoard] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [player1Moves, setPlayer1Moves] = useState<number>(0);
  const [player1Errors, setPlayer1Errors] = useState<number>(0);
  const [player1Complete, setPlayer1Complete] = useState(false);
  const [player2Complete, setPlayer2Complete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game
  useEffect(() => {
    console.log('[AIGame] Generating puzzle with difficulty:', difficulty);
    const puzzle = generateGame(difficulty);

    // Convert board from SudokuCell[][] to number[][]
    const boardNumbers = puzzle.board.map(row => row.map(cell => cell.value));
    // solution is already number[][], no conversion needed

    setBoard(boardNumbers);
    setInitialBoard(boardNumbers.map(row => [...row]));
    setSolution(puzzle.solution);
    setGameStarted(true);

    console.log('[AIGame] Puzzle generated. Starting game...');
  }, [difficulty]);

  // AI opponent
  const handleAIMove = useCallback((row: number, col: number, value: number) => {
    console.log('[AIGame] AI move:', { row, col, value });

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => [...r]);
      newBoard[row][col] = value;
      return newBoard;
    });

    // Check if AI completed
    checkAICompletion(board, row, col, value);
  }, [board]);

  const { profile, isAIThinking, aiMoveCount, updateProfileAfterMatch } = useAIOpponent({
    board,
    solution,
    isActive: gameStarted && !player1Complete && !player2Complete,
    profileType: personality,
    onAIMove: handleAIMove,
  });

  // Check AI completion
  const checkAICompletion = (currentBoard: number[][], row: number, col: number, value: number) => {
    // Simple check: count AI moves
    // More accurate: validate all AI cells
    const filledCount = currentBoard.flat().filter(v => v !== 0).length;
    const initialCount = initialBoard.flat().filter(v => v !== 0).length;

    if (filledCount - initialCount >= 40) { // Rough estimate
      setPlayer2Complete(true);
    }
  };

  // Player move
  const handlePlayerMove = (row: number, col: number, value: number) => {
    if (initialBoard[row][col] !== 0) return; // Can't modify initial cells

    const isCorrect = solution[row][col] === value || value === 0;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => [...r]);
      newBoard[row][col] = value;
      return newBoard;
    });

    if (!isCorrect && value !== 0) {
      setPlayer1Errors(prev => prev + 1);
    }

    if (value !== 0) {
      setPlayer1Moves(prev => prev + 1);
    }

    setSelectedCell(null);

    // Check completion
    checkPlayerCompletion(board, row, col, value);
  };

  // Check player completion
  const checkPlayerCompletion = (currentBoard: number[][], row: number, col: number, value: number) => {
    // Check if all player cells are filled correctly
    let allCorrect = true;
    let allFilled = true;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (initialBoard[r][c] === 0) { // Player cell
          if (currentBoard[r][c] === 0) {
            allFilled = false;
          } else if (currentBoard[r][c] !== solution[r][c]) {
            allCorrect = false;
          }
        }
      }
    }

    if (allFilled && allCorrect) {
      setPlayer1Complete(true);
    }
  };

  // Navigate to results when game completes
  useEffect(() => {
    if (player1Complete || player2Complete) {
      const winner = player1Complete ? 1 : 2;
      console.log('[AIGame] Game complete! Winner:', winner);

      // Update AI profile
      updateProfileAfterMatch(winner === 1);

      // Navigate to results
      setTimeout(() => {
        router.replace({
          pathname: '/duo-online/private-results',
          params: {
            winner: winner.toString(),
            playerNumber: '1',
          },
        });
      }, 1000);
    }
  }, [player1Complete, player2Complete, router, updateProfileAfterMatch]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    backButton: {
      padding: theme.spacing.sm,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    aiIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    aiDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.warning,
    },
    aiText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    gameContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.md,
    },
    playerStats: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    statItem: {
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    board: {
      width: 324,
      height: 324,
      borderWidth: 2,
      backgroundColor: theme.colors.surface,
    },
    row: {
      flexDirection: 'row',
    },
    cell: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0.5,
    },
    cellText: {
      fontSize: 18,
      fontWeight: '400',
    },
    numberSelector: {
      marginTop: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      width: 324,
    },
    numberSelectorHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    numberSelectorTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    closeButton: {
      padding: 4,
    },
    numberGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    numberButton: {
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.divider,
    },
    numberButtonText: {
      fontSize: 24,
      fontWeight: '600',
    },
  });

  const handleBack = () => {
    router.back();
  };

  // Render Sudoku cell
  const renderCell = (row: number, col: number) => {
    const value = board[row][col];
    const initialValue = initialBoard[row][col];
    const solutionValue = solution[row][col];
    const isInitial = initialValue !== 0;
    const isError = value !== 0 && !isInitial && value !== solutionValue;
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;

    return (
      <TouchableOpacity
        key={`cell-${row}-${col}`}
        style={[
          styles.cell,
          {
            borderRightWidth: col % 3 === 2 && col !== 8 ? 2 : 0.5,
            borderBottomWidth: row % 3 === 2 && row !== 8 ? 2 : 0.5,
            borderColor: theme.colors.divider,
            backgroundColor: isError
              ? theme.colors.error + '20'
              : isSelected
              ? theme.colors.primary + '30'
              : isInitial
              ? theme.colors.surface
              : theme.colors.background,
          },
        ]}
        onPress={() => {
          if (!isInitial) {
            setSelectedCell({ row, col });
          }
        }}
      >
        {value !== 0 && (
          <Text
            style={[
              styles.cellText,
              {
                color: isError
                  ? theme.colors.error
                  : isInitial
                  ? theme.colors.primary
                  : theme.colors.textPrimary,
                fontWeight: isInitial ? '700' : '400',
              },
            ]}
          >
            {value}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (!gameStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.gameContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.statLabel, { marginTop: theme.spacing.md }]}>
            {t('duoOnline.ai.generating', 'Generating puzzle...')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          AI ({personality.charAt(0).toUpperCase() + personality.slice(1)})
        </Text>
        <View style={styles.aiIndicator}>
          {isAIThinking && (
            <>
              <View style={styles.aiDot} />
              <Text style={styles.aiText}>{t('duoOnline.ai.thinking', 'Thinking...')}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.gameContainer}>
        {/* Player stats */}
        <View style={styles.playerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{t('duoOnline.ai.errors', 'Errors')}</Text>
            <Text style={styles.statValue}>{player1Errors}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{t('duoOnline.ai.moves', 'Moves')}</Text>
            <Text style={styles.statValue}>{player1Moves}</Text>
          </View>
        </View>

        {/* Sudoku Board */}
        <View style={[styles.board, { borderColor: theme.colors.divider }]}>
          {board.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
            </View>
          ))}
        </View>

        {/* AI stats */}
        <View style={styles.playerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{t('duoOnline.ai.aiMoves', 'AI Moves')}</Text>
            <Text style={styles.statValue}>{aiMoveCount}</Text>
          </View>
        </View>

        {/* Number Selector */}
        {selectedCell && (
          <View style={styles.numberSelector}>
            <View style={styles.numberSelectorHeader}>
              <Text style={styles.numberSelectorTitle}>
                {t('duoOnline.ai.selectNumber', 'Select Number')}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedCell(null)}
                style={styles.closeButton}
              >
                <Feather name="x" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.numberGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numberButton,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  onPress={() => {
                    handlePlayerMove(selectedCell.row, selectedCell.col, num);
                  }}
                >
                  <Text
                    style={[
                      styles.numberButtonText,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    {num === 0 ? '✕' : num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
