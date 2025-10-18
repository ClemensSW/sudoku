// screens/GameCompletion/GameCompletionFlow.tsx
import React, { useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import Animated, {
  SlideInRight,
  SlideOutLeft,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useNavigation } from '@/contexts/navigation';
import { Difficulty } from '@/utils/sudoku';
import { GameStats } from '@/utils/storage';

// Hooks
import { useCompletionFlow } from './hooks/useCompletionFlow';

// Screen Components
import LevelPathScreen from './screens/LevelPathScreen';
import LandscapeScreen from './screens/LandscapeScreen';
import StreakScreen from './screens/StreakScreen';
import AutoNotesScreen from './screens/AutoNotesScreen';

// Confetti
import ConfettiEffect from './components/ConfettiEffect/ConfettiEffect';

// Styles
import styles from './GameCompletionFlow.styles';

interface GameCompletionFlowProps {
  visible: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onContinue: () => void;
  timeElapsed: number;
  difficulty: Difficulty;
  autoNotesUsed: boolean;
  stats?: GameStats | null;
  streakInfo?: {
    changed: boolean;
    newStreak: number;
    shieldUsed: boolean;
  } | null;
}

/**
 * GameCompletionFlow - Multi-Screen Achievement Flow
 *
 * Zeigt 1-3 Screens nacheinander basierend auf Kontext:
 * - AutoNotes: Nur Info-Screen
 * - Normal: Level+Path → Landscape → [optional] Streak
 *
 * Performance-Optimiert: Nur 1 Screen gleichzeitig gerendert
 */
const GameCompletionFlow: React.FC<GameCompletionFlowProps> = ({
  visible,
  onClose,
  onNewGame,
  onContinue,
  timeElapsed,
  difficulty,
  autoNotesUsed,
  stats,
  streakInfo,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { hideBottomNav, resetBottomNav } = useNavigation();

  // Flow Management
  const { screens, currentStep, handleContinue, isLastScreen } = useCompletionFlow({
    autoNotesUsed,
    streakInfo: streakInfo || null,
    visible,
  });

  // Hide bottom nav when visible
  useEffect(() => {
    if (visible) {
      hideBottomNav();
    }
  }, [visible, hideBottomNav]);

  // Android Back-Button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        if (isLastScreen) {
          onContinue();
        } else {
          // Auf mittleren Screens: Skip zum letzten Screen
          handleContinue();
        }
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [visible, isLastScreen, onContinue, handleContinue]);

  // Navigation Handler
  const handleViewGallery = () => {
    onClose();
    setTimeout(() => {
      router.push('/gallery');
    }, 300);
  };

  const handleNewGame = () => {
    onClose();
    setTimeout(() => {
      router.replace({ pathname: '/game', params: { difficulty } });
    }, 200);
  };

  // Render aktuellen Screen
  const renderCurrentScreen = () => {
    const screenType = screens[currentStep];

    console.log('[GameCompletionFlow] Rendering screen:', screenType, 'step:', currentStep, '/', screens.length - 1);

    switch (screenType) {
      case 'level-path':
        return (
          <LevelPathScreen
            stats={stats || null}
            difficulty={difficulty}
            timeElapsed={timeElapsed}
            autoNotesUsed={autoNotesUsed}
            onContinue={handleContinue}
          />
        );

      case 'landscape':
        return (
          <LandscapeScreen
            stats={stats || null}
            onContinue={handleContinue}
            onViewGallery={handleViewGallery}
            isLastScreen={isLastScreen}
            onNewGame={handleNewGame}
            onFinalContinue={onContinue}
          />
        );

      case 'streak':
        return (
          <StreakScreen
            stats={stats || null}
            streakInfo={streakInfo || null}
            onNewGame={handleNewGame}
            onContinue={onContinue}
          />
        );

      case 'auto-notes':
        return (
          <AutoNotesScreen
            onNewGame={handleNewGame}
            onContinue={onContinue}
          />
        );

      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={[
          styles.modalContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        {/* Screen Content mit Slide-Animation */}
        <Animated.View
          key={`screen-${currentStep}`}
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          style={styles.screenContainer}
        >
          {renderCurrentScreen()}
        </Animated.View>
      </Animated.View>

      {/* Confetti nur auf erstem Screen */}
      {currentStep === 0 && <ConfettiEffect isActive={visible} />}
    </View>
  );
};

export default GameCompletionFlow;
