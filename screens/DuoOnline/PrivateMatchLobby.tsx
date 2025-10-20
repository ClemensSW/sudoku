/**
 * PrivateMatchLobby Screen
 *
 * Creates a private match and displays invite code for sharing
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
import { useRouter } from 'expo-router';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import functions from '@react-native-firebase/functions';
import Share from 'react-native-share';
import * as Clipboard from 'expo-clipboard';
import { useAlert } from '@/components/CustomAlert/AlertProvider';
import { useRealtimeMatch } from '@/hooks/online/useRealtimeMatch';

interface CreatePrivateMatchResult {
  matchId: string;
  inviteCode: string;
  hostPlayer: {
    uid: string;
    displayName: string;
  };
}

export default function PrivateMatchLobby() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const alert = useAlert();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [isCreating, setIsCreating] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Listen for match updates (opponent joins)
  const { matchState, isConnected } = useRealtimeMatch(matchId ?? null);

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
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: theme.spacing.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    difficultyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    difficultyButton: {
      flex: 1,
      minWidth: '45%',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
    },
    difficultyButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    createButton: {
      width: '100%',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    createButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.buttonText,
    },
    lobbyCard: {
      alignItems: 'center',
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    lobbyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    lobbySubtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    inviteCodeContainer: {
      backgroundColor: theme.colors.background,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: 16,
      marginBottom: theme.spacing.lg,
      width: '100%',
    },
    inviteCodeLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      textAlign: 'center',
    },
    inviteCode: {
      fontSize: 36,
      fontWeight: 'bold',
      color: theme.colors.primary,
      letterSpacing: 6,
      textAlign: 'center',
    },
    actionButtons: {
      width: '100%',
      gap: theme.spacing.md,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: 12,
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
    errorText: {
      fontSize: 14,
      color: theme.colors.error,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    loadingContainer: {
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
  });

  // Navigate to game when opponent joins (status changes to "active")
  useEffect(() => {
    if (matchState && matchState.status === 'active') {
      console.log('[PrivateMatchLobby] Opponent joined! Navigating to game...');
      router.replace({
        pathname: '/duo-online/game',
        params: { matchId: matchId! },
      });
    }
  }, [matchState?.status, matchId, router]);

  const handleBack = () => {
    router.back();
  };

  const createMatch = async () => {
    setIsCreating(true);
    setError(null);

    try {
      console.log('[PrivateLobby] Creating private match with difficulty:', difficulty);

      const result = await functions('europe-west3').httpsCallable<
        { difficulty: string; displayName: string },
        CreatePrivateMatchResult
      >('createPrivateMatch')({
        difficulty,
        displayName: 'Host Player', // TODO: Get from auth context
      });

      console.log('[PrivateLobby] Match created:', result.data);

      setMatchId(result.data.matchId);
      setInviteCode(result.data.inviteCode);
      setIsCreating(false);
    } catch (err: any) {
      console.error('[PrivateLobby] Failed to create match:', err);
      setError(err.message || 'Failed to create match');
      setIsCreating(false);
    }
  };

  const handleCopyCode = async () => {
    if (inviteCode) {
      await Clipboard.setStringAsync(inviteCode);
      alert.showAlert({
        title: t('duoOnline.private.codeCopied', 'Copied!'),
        message: t('duoOnline.private.codeCopiedMsg', 'Invite code copied to clipboard'),
        buttons: [{ text: t('common.ok', 'OK') }],
      });
    }
  };

  const handleShare = async () => {
    if (!inviteCode) return;

    try {
      const deepLink = `sudokuduo://join/${inviteCode}`;
      const httpsLink = `https://sudokuduo.com/join/${inviteCode}`;

      await Share.open({
        title: 'Join my Sudoku match!',
        message: `Join my private Sudoku match with code: ${inviteCode}\n\nOpen the app and use this code, or click this link:\n${httpsLink}`,
        url: deepLink,
      });
    } catch (err: any) {
      if (err.message !== 'User did not share') {
        console.error('[PrivateLobby] Share failed:', err);
      }
    }
  };

  const handleCancel = () => {
    // TODO: Delete the match from Firestore
    router.back();
  };

  // Render creation view
  if (!matchId) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t('duoOnline.private.createTitle', 'Create Private Match')}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              {t('duoOnline.private.selectDifficulty', 'Select Difficulty')}
            </Text>

            <View style={styles.difficultyGrid}>
              {(['easy', 'medium', 'hard', 'expert'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    {
                      borderColor: difficulty === level
                        ? theme.colors.primary
                        : theme.colors.divider,
                      backgroundColor: difficulty === level
                        ? theme.colors.primary + '10'
                        : 'transparent',
                    },
                  ]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text
                    style={[
                      styles.difficultyButtonText,
                      {
                        color: difficulty === level
                          ? theme.colors.primary
                          : theme.colors.textPrimary,
                      },
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {isCreating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>
                  {t('duoOnline.private.creating', 'Creating match...')}
                </Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={createMatch}
                >
                  <Text style={styles.createButtonText}>
                    {t('duoOnline.private.createButton', 'Create Match')}
                  </Text>
                </TouchableOpacity>

                {error && <Text style={styles.errorText}>{error}</Text>}
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Render lobby view (waiting for opponent)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>
          {t('duoOnline.private.lobbyTitle', 'Private Lobby')}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Feather name="x" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.card, styles.lobbyCard]}>
          <View style={styles.iconContainer}>
            <Feather name="users" size={40} color={theme.colors.primary} />
          </View>

          <Text style={styles.lobbyTitle}>
            {t('duoOnline.private.waitingOpponent', 'Waiting for Opponent')}
          </Text>
          <Text style={styles.lobbySubtitle}>
            {t('duoOnline.private.shareCode', 'Share your invite code with a friend to start playing')}
          </Text>

          <View style={styles.inviteCodeContainer}>
            <Text style={styles.inviteCodeLabel}>
              {t('duoOnline.private.inviteCode', 'INVITE CODE')}
            </Text>
            <Text style={styles.inviteCode}>{inviteCode}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleShare}
            >
              <Feather name="share-2" size={20} color={theme.colors.buttonText} />
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                {t('duoOnline.private.shareInvite', 'Share Invite')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleCopyCode}
            >
              <Feather name="copy" size={20} color={theme.colors.textPrimary} />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                {t('duoOnline.private.copyCode', 'Copy Code')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleCancel}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={{ marginTop: theme.spacing.xl }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
