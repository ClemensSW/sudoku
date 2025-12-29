/**
 * OnlineGameBoard Screen
 *
 * Online multiplayer game screen with real-time synchronization
 * Includes local notes support (not synced with opponent)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRealtimeMatch } from '@/hooks/online/useRealtimeMatch';
import { useAIOpponent } from '@/hooks/online/useAIOpponent';
import OnlineGameHeader from './components/OnlineGameHeader';
import OnlineGameTopBar from './components/OnlineGameTopBar';
import OnlineSudokuCell from './components/OnlineSudokuCell';
import OnlineNumberPad from './components/OnlineNumberPad';

// Type for local notes storage
type LocalNotesMap = { [key: string]: number[] };

export default function OnlineGameBoard() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ matchId: string }>();

  const matchId = params.matchId;

  const {
    matchState,
    isLoading,
    isConnected,
    error,
    makeMove,
    updateMatchStatus,
  } = useRealtimeMatch(matchId);

  // Selected cell state
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Local notes state (player-specific, NOT synchronized)
  const [localNotes, setLocalNotes] = useState<LocalNotesMap>({});

  // Note mode state
  const [noteModeActive, setNoteModeActive] = useState(false);

  // AI opponent integration
  const isAIMatch = matchState?.players[1]?.isAI || false;
  const isMatchActive = matchState?.status === 'active';

  const { isAIThinking } = useAIOpponent({
    board: matchState?.gameState.board || [],
    solution: matchState?.gameState.solution || [],
    isActive: isAIMatch && isMatchActive,
    profileType: 'balanced',
    onAIMove: async (row: number, col: number, value: number) => {
      console.log(`[OnlineGameBoard] AI making move: [${row}, ${col}] = ${value}`);
      try {
        await makeMove(2, row, col, value); // Player 2 (AI)
      } catch (err) {
        console.error('[OnlineGameBoard] AI move failed:', err);
      }
    },
  });

  // Load notes from AsyncStorage on mount
  useEffect(() => {
    const loadNotes = async () => {
      if (!matchId) return;
      try {
        const saved = await AsyncStorage.getItem(`online-notes-${matchId}`);
        if (saved) {
          setLocalNotes(JSON.parse(saved));
          console.log('[OnlineGameBoard] Notes loaded from storage');
        }
      } catch (err) {
        console.error('[OnlineGameBoard] Failed to load notes:', err);
      }
    };
    loadNotes();
  }, [matchId]);

  // Auto-save notes to AsyncStorage
  useEffect(() => {
    const saveNotes = async () => {
      if (!matchId) return;
      try {
        await AsyncStorage.setItem(
          `online-notes-${matchId}`,
          JSON.stringify(localNotes)
        );
      } catch (err) {
        console.error('[OnlineGameBoard] Failed to save notes:', err);
      }
    };
    saveNotes();
  }, [localNotes, matchId]);

  // Clear notes when match completes
  useEffect(() => {
    if (matchState?.status === 'completed' && matchId) {
      AsyncStorage.removeItem(`online-notes-${matchId}`);
      console.log('[OnlineGameBoard] Notes cleared for completed match');
    }
  }, [matchState?.status, matchId]);

  // Navigate to results when match completes
  useEffect(() => {
    if (matchState?.status === 'completed' && matchState.result) {
      // Check if this is a private match or ranked match
      const isPrivateMatch = matchState.privateMatch;

      if (isPrivateMatch) {
        // Navigate to private results (no ELO)
        router.replace({
          pathname: '/duo-online/private-results',
          params: {
            winner: matchState.result.winner.toString(),
            playerNumber: '1', // TODO: Get from auth context
          },
        });
      } else {
        // Navigate to ranked results screen with ELO info
        const player1OldElo = matchState.players[0].elo;
        const player2OldElo = matchState.players[1].elo;

        router.replace({
          pathname: '/duo-online/results',
          params: {
            matchId: matchId!,
            winner: matchState.result.winner.toString(),
            playerNumber: '1', // TODO: Get from auth context
            player1Elo: player1OldElo.toString(),
            player2Elo: player2OldElo.toString(),
          },
        });
      }
    }
  }, [matchState?.status, matchState?.result, matchId, router]);

  // Helper: Toggle note for a cell
  const toggleNote = useCallback((row: number, col: number, number: number) => {
    const key = `${row}-${col}`;
    setLocalNotes((prev) => {
      const currentNotes = prev[key] || [];
      if (currentNotes.includes(number)) {
        // Remove note
        const newNotes = currentNotes.filter((n) => n !== number);
        if (newNotes.length === 0) {
          const { [key]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [key]: newNotes };
      } else {
        // Add note
        return { ...prev, [key]: [...currentNotes, number].sort() };
      }
    });
  }, []);

  // Helper: Clear notes for a cell
  const clearNotes = useCallback((row: number, col: number) => {
    const key = `${row}-${col}`;
    setLocalNotes((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Helper: Check if cell is related (same row, col, or 3x3 box)
  const isRelatedCell = useCallback(
    (targetRow: number, targetCol: number): boolean => {
      if (!selectedCell) return false;

      const sameRow = targetRow === selectedCell.row;
      const sameCol = targetCol === selectedCell.col;
      const sameBox =
        Math.floor(targetRow / 3) === Math.floor(selectedCell.row / 3) &&
        Math.floor(targetCol / 3) === Math.floor(selectedCell.col / 3);

      return sameRow || sameCol || sameBox;
    },
    [selectedCell]
  );

  // Helper: Check if cell has same value as selected
  const hasSameValue = useCallback(
    (row: number, col: number): boolean => {
      if (!selectedCell || !matchState) return false;
      const selectedValue =
        matchState.gameState.board[selectedCell.row][selectedCell.col];
      const currentValue = matchState.gameState.board[row][col];
      return selectedValue !== 0 && selectedValue === currentValue;
    },
    [selectedCell, matchState]
  );

  // Helper: Get used numbers (all 9 complete)
  const getUsedNumbers = useCallback((): number[] => {
    if (!matchState) return [];
    const counts: { [key: number]: number } = {};
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const val = matchState.gameState.board[row][col];
        if (val !== 0) {
          counts[val] = (counts[val] || 0) + 1;
        }
      }
    }
    return Object.keys(counts)
      .filter((key) => counts[parseInt(key)] >= 9)
      .map((key) => parseInt(key));
  }, [matchState]);

  // Handler: Cell press
  const handleCellPress = useCallback(
    (row: number, col: number) => {
      if (!matchState) return;
      const isInitial = matchState.gameState.initialBoard[row][col] !== 0;
      if (isInitial) return; // Can't select initial cells

      setSelectedCell({ row, col });
    },
    [matchState]
  );

  // Handler: Number press
  const handleNumberPress = useCallback(
    async (number: number) => {
      if (!selectedCell || !matchState) return;

      const { row, col } = selectedCell;
      const isInitial = matchState.gameState.initialBoard[row][col] !== 0;

      if (isInitial) return;

      if (noteModeActive) {
        // Toggle note
        toggleNote(row, col, number);
      } else {
        // Clear notes for this cell
        clearNotes(row, col);

        // Make move
        try {
          await makeMove(1, row, col, number); // Player 1 (TODO: get from auth)
        } catch (err) {
          console.error('[OnlineGameBoard] Failed to make move:', err);
        }
      }
    },
    [selectedCell, noteModeActive, matchState, toggleNote, clearNotes, makeMove]
  );

  // Handler: Erase press
  const handleErase = useCallback(() => {
    if (!selectedCell || !matchState) return;

    const { row, col } = selectedCell;
    const isInitial = matchState.gameState.initialBoard[row][col] !== 0;

    if (isInitial) return;

    if (noteModeActive) {
      // Clear all notes for this cell
      clearNotes(row, col);
    } else {
      // Clear value (set to 0)
      try {
        makeMove(1, row, col, 0); // Player 1
      } catch (err) {
        console.error('[OnlineGameBoard] Failed to erase:', err);
      }
    }
  }, [selectedCell, noteModeActive, matchState, clearNotes, makeMove]);

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
      fontSize: theme.typography.size.lg,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    loadingText: {
      fontSize: theme.typography.size.md,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    errorContainer: {
      backgroundColor: theme.colors.error + '20',
      padding: theme.spacing.lg,
      borderRadius: 12,
      maxWidth: 300,
    },
    errorText: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.error,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    gameContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    boardWrapper: {
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      marginBottom: theme.spacing.lg,
    },
    board: {
      backgroundColor: '#1E2233',
      borderWidth: 2,
      borderColor: theme.colors.divider,
      borderRadius: 8,
    },
    row: {
      flexDirection: 'row',
    },
  });

  const handleBack = () => {
    router.back();
  };

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Online Match</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Feather name="alert-circle" size={60} color={theme.colors.error} />
          <View style={styles.errorContainer}>
            <Text style={[styles.headerTitle, { textAlign: 'center' }]}>
              {t('duoOnline.game.error', 'Connection Error')}
            </Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.xl }}>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: theme.spacing.md,
                paddingHorizontal: theme.spacing.lg,
                borderRadius: 12,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.divider,
              }}
              onPress={handleBack}
            >
              <Text style={{ color: theme.colors.textPrimary, fontWeight: '600', textAlign: 'center' }}>
                {t('common.back', 'Back')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: theme.spacing.md,
                paddingHorizontal: theme.spacing.lg,
                borderRadius: 12,
                backgroundColor: theme.colors.primary,
              }}
              onPress={() => {
                router.replace({ pathname: '/duo-online/game', params: { matchId: matchId! } });
              }}
            >
              <Text style={{ color: theme.colors.buttonText, fontWeight: '600', textAlign: 'center' }}>
                {t('common.retry', 'Retry')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Loading state
  if (isLoading || !matchState) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Online Match</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>
            {t('duoOnline.game.loading', 'Loading match...')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Game view
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />

      {/* Top Navigation Bar */}
      <OnlineGameTopBar
        onSettingsPress={() => {
          // TODO: Open settings modal
          console.log('Settings pressed');
        }}
      />

      {/* Player Header */}
      <OnlineGameHeader
        player1={matchState.players[0]}
        player2={matchState.players[1]}
        player1Moves={matchState.gameState.player1Moves}
        player2Moves={matchState.gameState.player2Moves}
        player1Errors={matchState.gameState.player1Errors}
        player2Errors={matchState.gameState.player2Errors}
      />

      {/* Connection Warning Banner */}
      {!isConnected && (
        <View
          style={{
            backgroundColor: theme.colors.warning + '20',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.warning,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          <Feather name="wifi-off" size={16} color={theme.colors.warning} />
          <Text style={{ color: theme.colors.warning, fontSize: theme.typography.size.xs, flex: 1 }}>
            {t('duoOnline.game.reconnecting', 'Reconnecting...')}
          </Text>
        </View>
      )}

      {/* Scrollable Game Area */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gameContainer}>
          {/* Sudoku Board */}
          <View style={styles.boardWrapper}>
            <View style={styles.board}>
              {matchState.gameState.board.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.row}>
                  {row.map((_, colIndex) => (
                    <OnlineSudokuCell
                      key={`cell-${rowIndex}-${colIndex}`}
                      value={matchState.gameState.board[rowIndex][colIndex]}
                      initialValue={matchState.gameState.initialBoard[rowIndex][colIndex]}
                      solution={matchState.gameState.solution[rowIndex][colIndex]}
                      notes={localNotes[`${rowIndex}-${colIndex}`] || []}
                      row={rowIndex}
                      col={colIndex}
                      isSelected={
                        selectedCell?.row === rowIndex &&
                        selectedCell?.col === colIndex
                      }
                      isRelated={isRelatedCell(rowIndex, colIndex)}
                      sameValueHighlight={hasSameValue(rowIndex, colIndex)}
                      onPress={handleCellPress}
                      showErrors={true}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* AI Thinking Indicator */}
          {isAIMatch && isAIThinking && (
            <View
              style={{
                marginTop: theme.spacing.md,
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.primary + '20',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: theme.typography.size.sm,
                  fontWeight: '600',
                }}
              >
                AI Thinking...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Number Pad at Bottom */}
      <OnlineNumberPad
        onNumberPress={handleNumberPress}
        onErasePress={handleErase}
        onNoteToggle={() => setNoteModeActive(!noteModeActive)}
        noteModeActive={noteModeActive}
        disabledNumbers={getUsedNumbers()}
        isGameComplete={matchState.status === 'completed'}
      />
    </SafeAreaView>
  );
}
