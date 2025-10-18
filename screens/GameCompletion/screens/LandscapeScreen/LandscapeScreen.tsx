// screens/GameCompletion/screens/LandscapeScreen/LandscapeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useLandscapes } from '@/screens/Gallery/hooks/useLandscapes';
import { GameStats } from '@/utils/storage';

// Components
import GalleryProgressCard from '../../components/GalleryProgressCard';
import ContinueButton from '../../shared/ContinueButton';
import ActionButtons from '../../shared/ActionButtons';

// Styles
import styles from './LandscapeScreen.styles';

interface LandscapeScreenProps {
  stats: GameStats | null;
  onContinue: () => void; // For continue button & auto-skip (always handleContinue)
  onViewGallery: () => void;
  isLastScreen?: boolean;
  onNewGame?: () => void;
  onFinalContinue?: () => void; // For final action buttons (back to menu)
}

/**
 * Screen 2: Landscape Gallery Progress
 *
 * Zeigt:
 * - Header Text
 * - Gallery Progress Card (neu freigeschaltetes Segment)
 * - Continue Button
 */
const LandscapeScreen: React.FC<LandscapeScreenProps> = ({
  stats,
  onContinue,
  onViewGallery,
  isLastScreen = false,
  onNewGame,
  onFinalContinue,
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const colors = theme.colors;

  // Landscape Integration
  const { currentLandscape, getLastUnlockEvent } = useLandscapes();

  // State für Unlock-UI
  const [newlyUnlockedSegmentId, setNewlyUnlockedSegmentId] = useState<number | undefined>(undefined);
  const [landscapeCompleted, setLandscapeCompleted] = useState(false);

  // Load last unlock event on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const event = await getLastUnlockEvent();
        if (event && typeof event === 'object' && mounted) {
          if ('segmentIndex' in event && typeof (event as any).segmentIndex === 'number') {
            setNewlyUnlockedSegmentId((event as any).segmentIndex);
          } else {
            setLandscapeCompleted(true);
          }
        }
      } catch (error) {
        console.error('[LandscapeScreen] Error loading unlock event:', error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [getLastUnlockEvent]);

  // Defensive check: This screen should only be rendered when currentLandscape exists
  if (!currentLandscape) {
    console.warn('[LandscapeScreen] Rendered without currentLandscape - this should not happen');
    return null;
  }

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
            {t('gallery.newSegment')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {t('gallery.unlocked')}
          </Text>
        </Animated.View>

        {/* Gallery Progress Card */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <GalleryProgressCard
            landscape={currentLandscape}
            newlyUnlockedSegmentId={newlyUnlockedSegmentId}
            isComplete={landscapeCompleted}
            onViewGallery={onViewGallery}
            stats={stats}
          />
        </Animated.View>

        {/* Bottom Spacing for Buttons */}
        <View style={isLastScreen ? styles.bottomSpacerLarge : styles.bottomSpacer} />
      </ScrollView>

      {/* Buttons - conditional based on last screen */}
      {isLastScreen && onNewGame && onFinalContinue ? (
        <ActionButtons onNewGame={onNewGame} onContinue={onFinalContinue} />
      ) : (
        <ContinueButton onPress={onContinue} />
      )}
    </View>
  );
};

export default LandscapeScreen;
