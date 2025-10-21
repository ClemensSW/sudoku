/**
 * PrivateJoin Screen
 *
 * Handles joining private matches via invite code (deep link entry)
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
import { useRealtimeMatch } from '@/hooks/online/useRealtimeMatch';

interface JoinPrivateMatchResult {
  matchId: string;
  success: boolean;
}

export default function PrivateJoin() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ inviteCode?: string }>();

  const inviteCode = params.inviteCode?.toUpperCase();

  const [isJoining, setIsJoining] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Listen for match updates (auto-start detection)
  const { matchState } = useRealtimeMatch(matchId ?? null);

  useEffect(() => {
    console.log('[PrivateJoin] Opened with invite code:', inviteCode);
  }, [inviteCode]);

  // Navigate to game when match starts (status changes to "active")
  useEffect(() => {
    if (matchState && matchState.status === 'active' && matchId) {
      console.log('[PrivateJoin] Match started! Navigating to game...');
      router.replace({
        pathname: '/duo-online/game',
        params: { matchId },
      });
    }
  }, [matchState?.status, matchId, router]);

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
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    card: {
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
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    inviteCodeContainer: {
      backgroundColor: theme.colors.background,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: 12,
      marginBottom: theme.spacing.xl,
    },
    inviteCodeLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
      textAlign: 'center',
    },
    inviteCode: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
      letterSpacing: 4,
      textAlign: 'center',
    },
    button: {
      width: '100%',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
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
    comingSoonBadge: {
      backgroundColor: theme.colors.warning + '20',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginTop: theme.spacing.md,
    },
    comingSoonText: {
      fontSize: 12,
      color: theme.colors.warning,
      fontWeight: '600',
    },
  });

  const handleBack = () => {
    router.back();
  };

  const handleJoinMatch = async () => {
    if (!inviteCode) return;

    setIsJoining(true);
    setError(null);

    try {
      console.log('[PrivateJoin] Joining match with code:', inviteCode);

      const result = await functions().httpsCallable<
        { inviteCode: string; displayName: string },
        JoinPrivateMatchResult
      >('joinPrivateMatch')({
        inviteCode,
        displayName: 'Guest Player', // TODO: Get from auth context
      });

      console.log('[PrivateJoin] Successfully joined match:', result.data.matchId);

      // Set matchId to start listening for match updates
      setMatchId(result.data.matchId);
      setIsJoining(false);
    } catch (err: any) {
      console.error('[PrivateJoin] Failed to join match:', err);
      setError(err.message || 'Failed to join match');
      setIsJoining(false);
    }
  };

  // No invite code provided
  if (!inviteCode) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join Private Match</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.error + '20' },
              ]}
            >
              <Feather name="alert-circle" size={40} color={theme.colors.error} />
            </View>
            <Text style={styles.title}>Invalid Invite</Text>
            <Text style={styles.subtitle}>
              No invite code provided. Please use a valid invite link.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleBack}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                {t('common.back', 'Back')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Valid invite code - show join screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Private Match</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Feather name="users" size={40} color={theme.colors.primary} />
          </View>

          <Text style={styles.title}>Private Match Invite</Text>
          <Text style={styles.subtitle}>
            You've been invited to join a private Sudoku match!
          </Text>

          <View style={styles.inviteCodeContainer}>
            <Text style={styles.inviteCodeLabel}>Invite Code</Text>
            <Text style={styles.inviteCode}>{inviteCode}</Text>
          </View>

          {isJoining ? (
            // Loading state
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.subtitle, { marginTop: theme.spacing.md }]}>
                Joining match...
              </Text>
            </View>
          ) : matchId ? (
            // Waiting for match to start
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.subtitle, { marginTop: theme.spacing.md }]}>
                Waiting for match to start...
              </Text>
            </View>
          ) : (
            // Join button
            <>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleJoinMatch}
                disabled={!!error}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  Join Match
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleBack}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  {t('common.cancel', 'Cancel')}
                </Text>
              </TouchableOpacity>

              {error && (
                <View style={[styles.comingSoonBadge, { backgroundColor: theme.colors.error + '20' }]}>
                  <Text style={[styles.comingSoonText, { color: theme.colors.error }]}>
                    {error}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
