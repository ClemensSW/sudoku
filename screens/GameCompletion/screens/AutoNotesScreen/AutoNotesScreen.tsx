// screens/GameCompletion/screens/AutoNotesScreen/AutoNotesScreen.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/hooks/useProgressColor';

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
  const pathColor = useProgressColor();

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
            colors={
              theme.isDark
                ? [colors.card, colors.background]
                : [colors.surface, colors.background]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Success Icon */}
            <View style={styles.heroIconWrapper}>
              <View
                style={[
                  styles.iconGlow,
                  { backgroundColor: `${pathColor}40` },
                ]}
              />
              <Feather name="check-circle" size={64} color={pathColor} />
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
                borderColor: colors.warning,
              },
            ]}
          >
            {/* Warning Icon */}
            <View
              style={[
                styles.warningIcon,
                { backgroundColor: `${colors.warning}20` },
              ]}
            >
              <Feather name="info" size={24} color={colors.warning} />
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

      {/* Action Buttons */}
      <ActionButtons onNewGame={onNewGame} onContinue={onContinue} />
    </View>
  );
};

export default AutoNotesScreen;
