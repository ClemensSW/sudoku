/**
 * PrivateResults Screen
 *
 * Shows private match completion results (no ELO)
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function PrivateResults() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    winner: string; // "1" or "2"
    playerNumber: string; // "1" or "2" - current user
  }>();

  const winner = parseInt(params.winner) as 1 | 2;
  const playerNumber = parseInt(params.playerNumber) as 1 | 2;
  const didWin = winner === playerNumber;

  // Animations
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Entrance animation
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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
  });

  const handleNewMatch = () => {
    router.replace('/duo-online/private');
  };

  const handleBackToMenu = () => {
    router.replace('/duo-online/play');
  };

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
