/**
 * OnlineGameBoard Screen
 *
 * Online multiplayer game screen with real-time synchronization
 */

import React, { useState, useEffect } from 'react';
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
import { useRealtimeMatch } from '@/hooks/online/useRealtimeMatch';

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

  // Navigate to results when match completes
  useEffect(() => {
    if (matchState?.status === 'completed' && matchState.result) {
      // Navigate to results screen
      router.replace({
        pathname: '/duo-online/results',
        params: {
          matchId: matchId!,
          winner: matchState.result.winner.toString(),
          playerNumber: '1', // TODO: Get from auth context
        },
      });
    }
  }, [matchState?.status, matchState?.result, matchId, router]);

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
    connectionIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    connectionDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    connectionText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    loadingText: {
      fontSize: 16,
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
      fontSize: 14,
      color: theme.colors.error,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
    debugInfo: {
      marginTop: theme.spacing.xl,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      maxWidth: 300,
    },
    debugText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
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
      width: 324, // 9 cells * 36px
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
          <TouchableOpacity
            style={{
              marginTop: theme.spacing.xl,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.xl,
              borderRadius: 12,
              backgroundColor: theme.colors.primary,
            }}
            onPress={handleBack}
          >
            <Text style={{ color: theme.colors.buttonText, fontWeight: '600' }}>
              {t('common.back', 'Back')}
            </Text>
          </TouchableOpacity>
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
          <View style={styles.connectionIndicator}>
            <View
              style={[
                styles.connectionDot,
                {
                  backgroundColor: isConnected
                    ? theme.colors.success
                    : theme.colors.error,
                },
              ]}
            />
            <Text style={styles.connectionText}>
              {isConnected ? 'Connected' : 'Connecting...'}
            </Text>
          </View>
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

  // Render Sudoku cell
  const renderCell = (row: number, col: number) => {
    const value = matchState.gameState.board[row][col];
    const initialValue = matchState.gameState.initialBoard[row][col];
    const solution = matchState.gameState.solution[row][col];
    const isInitial = initialValue !== 0;
    const isError = value !== 0 && !isInitial && value !== solution;
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
              ? theme.colors.error + '20' // Red background for errors
              : isSelected
              ? theme.colors.primary + '30' // Blue for selected
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

  // Game view
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {matchState.players[1].displayName}
        </Text>
        <View style={styles.connectionIndicator}>
          <View
            style={[
              styles.connectionDot,
              {
                backgroundColor: isConnected
                  ? theme.colors.success
                  : theme.colors.error,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.gameContainer}>
        {/* Player stats */}
        <View style={styles.playerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Errors</Text>
            <Text style={styles.statValue}>
              {matchState.gameState.player1Errors}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Progress</Text>
            <Text style={styles.statValue}>
              {matchState.gameState.player1Moves.length}/
              {81 - matchState.gameState.initialBoard.flat().filter((v) => v !== 0).length}
            </Text>
          </View>
        </View>

        {/* Sudoku Board */}
        <View
          style={[
            styles.board,
            {
              borderColor: theme.colors.divider,
            },
          ]}
        >
          {matchState.gameState.board.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
            </View>
          ))}
        </View>

        {/* Opponent stats */}
        <View style={styles.playerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Errors</Text>
            <Text style={styles.statValue}>
              {matchState.gameState.player2Errors}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Progress</Text>
            <Text style={styles.statValue}>
              {matchState.gameState.player2Moves.length}/
              {81 - matchState.gameState.initialBoard.flat().filter((v) => v !== 0).length}
            </Text>
          </View>
        </View>

        {/* Number Selector */}
        {selectedCell && (
          <View style={styles.numberSelector}>
            <View style={styles.numberSelectorHeader}>
              <Text style={styles.numberSelectorTitle}>Select Number</Text>
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
                  onPress={async () => {
                    if (matchState) {
                      try {
                        await makeMove(
                          1, // Player number (TODO: get from auth)
                          selectedCell.row,
                          selectedCell.col,
                          num
                        );
                        setSelectedCell(null);
                      } catch (err) {
                        console.error('Failed to make move:', err);
                      }
                    }
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

        {/* Debug info */}
        <View style={styles.debugInfo}>
          <Text style={[styles.debugText, { fontWeight: '600' }]}>Debug:</Text>
          <Text style={styles.debugText}>Status: {matchState.status}</Text>
          <Text style={styles.debugText}>
            P1: {matchState.gameState.player1Complete ? '✓' : '○'}
          </Text>
          <Text style={styles.debugText}>
            P2: {matchState.gameState.player2Complete ? '✓' : '○'}
          </Text>
          {selectedCell && (
            <Text style={styles.debugText}>
              Selected: [{selectedCell.row}, {selectedCell.col}]
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
