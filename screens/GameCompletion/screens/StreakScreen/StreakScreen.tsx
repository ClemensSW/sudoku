// screens/GameCompletion/screens/StreakScreen/StreakScreen.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { GameStats } from '@/utils/storage';

// Components
import { CurrentStreakCard } from '../../components/StreakCard/components';
import ActionButtons from '../../shared/ActionButtons';

// Styles
import styles from './StreakScreen.styles';

interface StreakScreenProps {
  stats: GameStats | null;
  streakInfo: {
    changed: boolean;
    newStreak: number;
    shieldUsed: boolean;
  } | null;
  onNewGame: () => void;
  onContinue: () => void;
}

/**
 * Screen 3: Daily Streak (Conditional - nur wenn Streak sich geändert hat)
 *
 * Zeigt:
 * - Header Text (variiert je nach Shield-Usage)
 * - Current Streak Card (mit Kalender)
 * - Action Buttons (Neues Spiel + Menü)
 */
const StreakScreen: React.FC<StreakScreenProps> = ({
  stats,
  streakInfo,
  onNewGame,
  onContinue,
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const colors = theme.colors;

  if (!stats?.dailyStreak) return null;

  // Header Text variiert je nach Shield-Usage
  const headerText = streakInfo?.shieldUsed
    ? t('streak.shieldUsedTitle')
    : t('streak.title');

  const subtitleText = streakInfo?.shieldUsed
    ? t('streak.shieldUsedSubtitle')
    : t('streak.subtitle');

  // Streak-themed button colors (matches StreakCard header gradient)
  // Professional orange/gold tones with excellent readability
  const streakButtonColor = theme.isDark
    ? '#FFB74D' // Material Orange 300 - warmer, lighter for dark backgrounds
    : '#FF9800'; // Material Orange 500 - vibrant, high contrast for light backgrounds

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {headerText}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {subtitleText}
          </Text>
        </Animated.View>

        {/* Streak Card */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <CurrentStreakCard
            currentStreak={stats.dailyStreak.currentStreak}
            longestStreak={stats.dailyStreak.longestDailyStreak}
            playHistory={stats.dailyStreak.playHistory}
            firstLaunchDate={stats.dailyStreak.firstLaunchDate}
          />
        </Animated.View>

        {/* Bottom Spacing for Buttons */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Action Buttons with Streak-themed colors */}
      <ActionButtons
        onNewGame={onNewGame}
        onContinue={onContinue}
        customColor={streakButtonColor}
      />
    </View>
  );
};

export default StreakScreen;
