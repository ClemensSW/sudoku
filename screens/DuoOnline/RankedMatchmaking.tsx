/**
 * RankedMatchmaking Screen
 *
 * Shows matchmaking progress with 5-second countdown and AI fallback
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useMatchmaking } from './hooks/useMatchmaking';

export default function RankedMatchmaking() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();

  const [difficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [elo] = useState(1000); // TODO: Get from user profile

  const {
    isSearching,
    matchId,
    opponent,
    error,
    searchForMatch,
    cancelSearch,
  } = useMatchmaking();

  // Start search on mount
  useEffect(() => {
    searchForMatch(difficulty, elo, 'Player'); // TODO: Get display name from auth
  }, []);

  // Navigate to game when match found
  useEffect(() => {
    if (matchId) {
      router.replace(`/duo-online/game?matchId=${matchId}`);
    }
  }, [matchId]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    content: {
      alignItems: 'center',
      gap: theme.spacing.xl,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.size.xxl,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.typography.size.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      maxWidth: 300,
    },
    cancelButton: {
      marginTop: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.error,
    },
    cancelButtonText: {
      fontSize: theme.typography.size.md,
      fontWeight: '600',
      color: theme.colors.error,
    },
    errorContainer: {
      backgroundColor: theme.colors.error + '20',
      padding: theme.spacing.md,
      borderRadius: 12,
      maxWidth: 300,
    },
    errorText: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.error,
      textAlign: 'center',
    },
  });

  const handleCancel = () => {
    cancelSearch();
    router.back();
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Feather name="alert-circle" size={60} color={theme.colors.error} />
          </View>
          <Text style={styles.title}>
            {t('duoOnline.matchmaking.error', 'Matchmaking Error')}
          </Text>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>
              {t('common.back', 'Back')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {isSearching ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <Feather name="search" size={60} color={theme.colors.primary} />
          )}
        </View>

        <Text style={styles.title}>
          {t('duoOnline.matchmaking.searching', 'Finding Opponent...')}
        </Text>

        <Text style={styles.subtitle}>
          {opponent
            ? t('duoOnline.matchmaking.found', `Match found: ${opponent.displayName}`)
            : t(
                'duoOnline.matchmaking.wait',
                'Searching for players with similar skill...'
              )}
        </Text>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>
            {t('common.cancel', 'Cancel')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
