/**
 * RankedResults Screen
 *
 * Shows match completion results with ELO changes
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
import functions from '@react-native-firebase/functions';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEloCalculation } from '@/hooks/online/useEloCalculation';
import { getRankTier, getRankTierName, getRankTierColor } from '@/utils/elo/eloCalculator';

interface EloUpdateResult {
  player1EloChange: number;
  player2EloChange: number;
  player1NewElo: number;
  player2NewElo: number;
}

export default function RankedResults() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    matchId: string;
    winner: string; // "1" or "2"
    playerNumber: string; // "1" or "2" - current user
    player1Elo?: string;
    player2Elo?: string;
  }>();

  const matchId = params.matchId;
  const winner = parseInt(params.winner) as 1 | 2;
  const playerNumber = parseInt(params.playerNumber) as 1 | 2;
  const didWin = winner === playerNumber;

  const player1Elo = params.player1Elo ? parseInt(params.player1Elo) : 1000;
  const player2Elo = params.player2Elo ? parseInt(params.player2Elo) : 1000;

  const [eloResult, setEloResult] = useState<EloUpdateResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side ELO preview calculation
  const eloPreview = useEloCalculation(player1Elo, player2Elo, winner);

  // Animations
  const scale = useSharedValue(0.8);
  const eloScale = useSharedValue(0);

  useEffect(() => {
    // Entrance animation
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
  }, []);

  useEffect(() => {
    if (eloResult) {
      // ELO change animation
      eloScale.value = withSequence(
        withTiming(1.2, { duration: 300 }),
        withSpring(1, { damping: 10 })
      );
    }
  }, [eloResult]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const eloAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: eloScale.value }],
  }));

  // Call updateElo Cloud Function
  useEffect(() => {
    const updateElo = async () => {
      if (!matchId) {
        setError('No match ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('[RankedResults] Calling updateElo for match:', matchId);

        const result = await functions().httpsCallable<
          { matchId: string },
          EloUpdateResult
        >('updateElo')({ matchId });

        console.log('[RankedResults] ELO updated:', result.data);
        setEloResult(result.data);
        setIsLoading(false);
      } catch (err: any) {
        console.error('[RankedResults] Failed to update ELO:', err);
        setError(err.message || 'Failed to update ELO');
        setIsLoading(false);
      }
    };

    updateElo();
  }, [matchId]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    resultCard: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: theme.spacing.xl,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    eloContainer: {
      width: '100%',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
      borderRadius: 16,
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    eloLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    eloChange: {
      fontSize: 48,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    eloNewValue: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    rankBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginTop: theme.spacing.md,
    },
    rankText: {
      fontSize: 16,
      fontWeight: '600',
    },
    buttonsContainer: {
      width: '100%',
      gap: theme.spacing.md,
    },
    button: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: 12,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.divider,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    primaryButtonText: {
      color: theme.colors.buttonText,
    },
    secondaryButtonText: {
      color: theme.colors.textPrimary,
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    errorText: {
      fontSize: 14,
      color: theme.colors.error,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
  });

  const handleNewMatch = () => {
    router.replace('/duo-online/ranked');
  };

  const handleBackToMenu = () => {
    router.replace('/duo-online/play');
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.content}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>
            {t('duoOnline.results.calculating', 'Calculating ELO...')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.content}>
          <Animated.View style={[styles.resultCard, animatedStyle]}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.error + '20' },
              ]}
            >
              <Feather name="alert-circle" size={50} color={theme.colors.error} />
            </View>
            <Text style={styles.title}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleBackToMenu}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  {t('common.back', 'Back')}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  // Results view
  const eloChange =
    playerNumber === 1
      ? eloResult!.player1EloChange
      : eloResult!.player2EloChange;
  const newElo =
    playerNumber === 1 ? eloResult!.player1NewElo : eloResult!.player2NewElo;

  // Rank tier info
  const newTier = getRankTier(newElo);
  const tierName = getRankTierName(newTier);
  const tierColor = getRankTierColor(newTier);

  // Verify client calculation matches server (dev only)
  useEffect(() => {
    if (eloResult) {
      const serverChange = playerNumber === 1
        ? eloResult.player1EloChange
        : eloResult.player2EloChange;
      const clientChange = playerNumber === 1
        ? eloPreview.player1Change
        : eloPreview.player2Change;

      if (serverChange !== clientChange) {
        console.warn(
          `[RankedResults] ELO Mismatch! Server: ${serverChange}, Client: ${clientChange}`
        );
      } else {
        console.log('[RankedResults] ELO calculation verified ✓');
      }
    }
  }, [eloResult, eloPreview, playerNumber]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.content}>
        <Animated.View style={[styles.resultCard, animatedStyle]}>
          {/* Result Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: didWin
                  ? theme.colors.success + '20'
                  : theme.colors.error + '20',
              },
            ]}
          >
            <Feather
              name={didWin ? 'award' : 'x-circle'}
              size={50}
              color={didWin ? theme.colors.success : theme.colors.error}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {didWin
              ? t('duoOnline.results.victory', 'Victory!')
              : t('duoOnline.results.defeat', 'Defeat')}
          </Text>
          <Text style={styles.subtitle}>
            {didWin
              ? t('duoOnline.results.victoryMsg', 'You won the match!')
              : t('duoOnline.results.defeatMsg', 'Better luck next time!')}
          </Text>

          {/* ELO Change */}
          <Animated.View style={[styles.eloContainer, eloAnimatedStyle]}>
            <Text style={styles.eloLabel}>ELO Rating</Text>
            <Text
              style={[
                styles.eloChange,
                {
                  color:
                    eloChange > 0
                      ? theme.colors.success
                      : eloChange < 0
                      ? theme.colors.error
                      : theme.colors.textSecondary,
                },
              ]}
            >
              {eloChange > 0 ? '+' : ''}
              {eloChange}
            </Text>
            <Text style={styles.eloNewValue}>New Rating: {newElo}</Text>

            {/* Rank Tier Badge */}
            <View style={[styles.rankBadge, { backgroundColor: tierColor + '20' }]}>
              <Feather name="award" size={20} color={tierColor} />
              <Text style={[styles.rankText, { color: tierColor }]}>{tierName}</Text>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleNewMatch}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                {t('duoOnline.results.newMatch', 'New Match')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleBackToMenu}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                {t('common.back', 'Back to Menu')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
