/**
 * OnlinePlayMenu Screen
 *
 * Choose online game mode: Ranked, Private Match, or Play vs AI
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme/ThemeProvider';

export default function OnlinePlayMenu() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.xl,
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
    },
    optionsContainer: {
      gap: theme.spacing.md,
    },
    optionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    optionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
    },
    optionDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    backButton: {
      marginTop: theme.spacing.xl,
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    backButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('duoOnline.play.title', 'Online Play')}
        </Text>
        <Text style={styles.subtitle}>
          {t('duoOnline.play.subtitle', 'Choose how you want to play')}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* Ranked Match */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/duo-online/ranked')}
        >
          <View style={styles.optionHeader}>
            <View style={styles.iconContainer}>
              <Feather name="award" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.optionTitle}>
              {t('duoOnline.play.ranked', 'Ranked Match')}
            </Text>
          </View>
          <Text style={styles.optionDescription}>
            {t(
              'duoOnline.play.rankedDesc',
              'Compete for ELO rating and climb the leaderboard'
            )}
          </Text>
        </TouchableOpacity>

        {/* Private Match */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/duo-online/private')}
        >
          <View style={styles.optionHeader}>
            <View style={styles.iconContainer}>
              <Feather name="users" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.optionTitle}>
              {t('duoOnline.play.private', 'Private Match')}
            </Text>
          </View>
          <Text style={styles.optionDescription}>
            {t(
              'duoOnline.play.privateDesc',
              'Invite a friend to play via link (no ELO changes)'
            )}
          </Text>
        </TouchableOpacity>

        {/* Play vs AI */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/duo-online/ai')}
        >
          <View style={styles.optionHeader}>
            <View style={styles.iconContainer}>
              <Feather name="cpu" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.optionTitle}>
              {t('duoOnline.play.ai', 'Play vs AI')}
            </Text>
          </View>
          <Text style={styles.optionDescription}>
            {t(
              'duoOnline.play.aiDesc',
              'Practice against adaptive AI opponent'
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>
          {t('common.back', 'Back')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
