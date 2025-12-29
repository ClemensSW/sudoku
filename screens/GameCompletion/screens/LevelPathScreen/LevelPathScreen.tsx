// screens/GameCompletion/screens/LevelPathScreen/LevelPathScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/hooks/useProgressColor';
import { useSupporter } from '@/modules/subscriptions/hooks/useSupporter';
import { Difficulty } from '@/utils/sudoku';
import { GameStats } from '@/utils/storage';
import { loadUserProfile, updateUserTitle } from '@/utils/profileStorage';
import { calculateXpGain } from '../../components/PlayerProgressionCard/utils';

// Components
import LevelCard from '../../components/LevelCard';
import PathCard from '../../components/PathCard';
import ContinueButton from '../../shared/ContinueButton';

// Styles
import styles from './LevelPathScreen.styles';

interface LevelPathScreenProps {
  stats: GameStats | null;
  difficulty: Difficulty;
  timeElapsed: number;
  autoNotesUsed: boolean;
  onContinue: () => void;
  /** Hide the hero icon with glow effect (for Duo mode) */
  showHeroIcon?: boolean;
}

/**
 * Screen 1: Level Progress & Path Progress
 *
 * Zeigt:
 * - Hero Header mit Glückwunsch-Text
 * - Level Card (XP Gewinn, Level-Up, Titel-Auswahl)
 * - Path Card (Pfad-Fortschritt, Farben-Auswahl)
 * - Continue Button
 */
const LevelPathScreen: React.FC<LevelPathScreenProps> = ({
  stats,
  difficulty,
  timeElapsed,
  autoNotesUsed,
  onContinue,
  showHeroIcon = true,
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const colors = theme.colors;
  const pathColor = useProgressColor();
  const { epMultiplier } = useSupporter();

  // Titel-State für Level Card
  const [selectedTitleIndex, setSelectedTitleIndex] = useState<number | null>(null);

  // Load user profile for title on mount
  useEffect(() => {
    (async () => {
      try {
        const profile = await loadUserProfile();
        setSelectedTitleIndex(profile.titleLevelIndex ?? null);
      } catch (error) {
        console.error('[LevelPathScreen] Error loading user profile:', error);
      }
    })();
  }, []);

  // Titel speichern
  const handleTitleSelect = async (levelIndex: number | null) => {
    try {
      await updateUserTitle(levelIndex);
      setSelectedTitleIndex(levelIndex);
    } catch (error) {
      console.error('[LevelPathScreen] Error updating user title:', error);
    }
  };

  // XP-Gewinn für dieses Spiel
  const xpGain = calculateXpGain(difficulty, timeElapsed, autoNotesUsed);

  if (!stats) return null;

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
            {/* Animated Success Icon with Glow (hidden in Duo mode) */}
            {showHeroIcon && (
              <View style={styles.heroIconWrapper}>
                <View
                  style={[
                    styles.iconGlow,
                    { backgroundColor: `${pathColor}40` },
                  ]}
                />
                <View
                  style={[
                    styles.iconGlowOuter,
                    { backgroundColor: `${pathColor}20` },
                  ]}
                />
                <Feather name="check-circle" size={64} color={pathColor} />
              </View>
            )}

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

        {/* Cards Container */}
        <View style={styles.cardsContainer}>
          {/* Level Card */}
          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <LevelCard
              stats={stats}
              difficulty={difficulty}
              justCompleted={true}
              xpGain={xpGain}
              epMultiplier={epMultiplier}
              selectedTitleIndex={selectedTitleIndex}
              onTitleSelect={handleTitleSelect}
            />
          </Animated.View>

          <View style={styles.sectionSpacer} />

          {/* Path Card */}
          <Animated.View entering={FadeInUp.delay(300).duration(400)}>
            <PathCard
              stats={stats}
              justCompleted={true}
              xpGain={xpGain}
              showPathDescription={true}
            />
          </Animated.View>

          {/* Bottom Spacing for Button */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Continue Button */}
      <ContinueButton onPress={onContinue} />
    </View>
  );
};

export default LevelPathScreen;
