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

  // Game view (simplified for now)
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
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.headerTitle}>Match Loaded</Text>
        <Text style={styles.loadingText}>Status: {matchState.status}</Text>

        {/* Debug info */}
        <View style={styles.debugInfo}>
          <Text style={[styles.debugText, { fontWeight: '600' }]}>Debug Info:</Text>
          <Text style={styles.debugText}>Match ID: {matchState.id}</Text>
          <Text style={styles.debugText}>Status: {matchState.status}</Text>
          <Text style={styles.debugText}>Type: {matchState.type}</Text>
          <Text style={styles.debugText}>
            Player 1: {matchState.players.player1.displayName}
          </Text>
          <Text style={styles.debugText}>
            Player 2: {matchState.players.player2.displayName}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
