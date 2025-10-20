/**
 * DuoOnlineMenu Screen
 *
 * Entry point for Duo Mode - Choose between Local or Online play
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

export default function DuoOnlineMenu() {
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },
    optionDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
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
        <Text style={styles.title}>Duo Mode</Text>
        <Text style={styles.subtitle}>
          {t('duoOnline.menu.subtitle', 'Choose your game mode')}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* Local Play */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/duo')}
        >
          <View style={styles.iconContainer}>
            <Feather
              name="smartphone"
              size={32}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>
              {t('duoOnline.menu.local', 'Local Play')}
            </Text>
            <Text style={styles.optionDescription}>
              {t(
                'duoOnline.menu.localDesc',
                'Play with a friend on the same device'
              )}
            </Text>
          </View>
          <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        {/* Online Play */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/duo-online/play')}
        >
          <View style={styles.iconContainer}>
            <Feather name="wifi" size={32} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>
              {t('duoOnline.menu.online', 'Online Play')}
            </Text>
            <Text style={styles.optionDescription}>
              {t(
                'duoOnline.menu.onlineDesc',
                'Play against players worldwide'
              )}
            </Text>
          </View>
          <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
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
