// screens/GameCompletion/screens/AutoNotesScreen/AutoNotesScreen.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import InkIcon from '@/assets/svg/ink.svg';

// Components
import ActionButtons from '../../shared/ActionButtons';

// Styles
import styles from './AutoNotesScreen.styles';

interface AutoNotesScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
}

/**
 * AutoNotes Info Screen
 *
 * Zeigt:
 * - Hero Header mit Glückwunsch (trotzdem Erfolgserlebnis!)
 * - Info Card dass AutoNotes verwendet wurden
 * - Hinweis dass kein Fortschritt gezählt wurde
 * - Action Buttons (Neues Spiel + Menü)
 */
const AutoNotesScreen: React.FC<AutoNotesScreenProps> = ({
  onNewGame,
  onContinue,
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const colors = theme.colors;

  // AutoNotes Ink-themed colors (based on ink.svg icon colors)
  // Icon colors: #3E3E7A, #51518E, #8888E8, #C5C5FF (Purple/Ink tones)
  const inkTheme = {
    primary: theme.isDark
      ? '#C5C5FF' // Light purple - excellent contrast on dark backgrounds
      : '#51518E', // Medium purple - strong contrast on light backgrounds

    accent: theme.isDark
      ? '#8888E8' // Medium purple for highlights
      : '#8888E8', // Same for light mode

    gradient: theme.isDark
      ? ['rgba(136, 136, 232, 0.15)', 'rgba(81, 81, 142, 0.08)', 'rgba(81, 81, 142, 0)']
      : ['rgba(81, 81, 142, 0.12)', 'rgba(136, 136, 232, 0.06)', 'rgba(136, 136, 232, 0)'],
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <Animated.View
          entering={FadeInUp.duration(400)}
          style={styles.heroHeader}
        >
          <LinearGradient
            colors={inkTheme.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Ink Icon - 48px, no glow circles */}
            <View style={styles.heroIconWrapper}>
              <InkIcon width={48} height={48} />
            </View>

            {/* Main Title */}
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
              {t('header.title')}
            </Text>

            {/* Subtitle */}
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              {t('header.subtitle')}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Info Card */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.cardsContainer}>
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: theme.isDark ? colors.surface : colors.card,
                borderColor: inkTheme.primary,
              },
            ]}
          >
            {/* Info Icon with Ink Theme */}
            <View
              style={[
                styles.warningIcon,
                { backgroundColor: `${inkTheme.primary}20` },
              ]}
            >
              <Feather name="info" size={24} color={inkTheme.primary} />
            </View>

            {/* Info Title */}
            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
              {t('autoNotes.title')}
            </Text>

            {/* Info Message */}
            <Text style={[styles.infoMessage, { color: colors.textSecondary }]}>
              {t('autoNotes.message')}
            </Text>

            {/* Bullet Points */}
            <View style={styles.bulletContainer}>
              <View style={styles.bulletPoint}>
                <Feather
                  name="x-circle"
                  size={18}
                  color={colors.textSecondary}
                  style={styles.bulletIcon}
                />
                <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                  {t('autoNotes.noXP')}
                </Text>
              </View>
              <View style={styles.bulletPoint}>
                <Feather
                  name="x-circle"
                  size={18}
                  color={colors.textSecondary}
                  style={styles.bulletIcon}
                />
                <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                  {t('autoNotes.noStreak')}
                </Text>
              </View>
              <View style={styles.bulletPoint}>
                <Feather
                  name="x-circle"
                  size={18}
                  color={colors.textSecondary}
                  style={styles.bulletIcon}
                />
                <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                  {t('autoNotes.noStats')}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Bottom Spacing for Buttons */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Action Buttons with Ink Theme */}
      <ActionButtons
        onNewGame={onNewGame}
        onContinue={onContinue}
        customColor={inkTheme.primary}
      />
    </View>
  );
};

export default AutoNotesScreen;
