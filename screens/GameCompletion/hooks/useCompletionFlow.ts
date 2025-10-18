// screens/GameCompletion/hooks/useCompletionFlow.ts
import { useState, useMemo, useCallback } from 'react';

export type ScreenType = 'level-path' | 'landscape' | 'streak' | 'auto-notes';

interface UseCompletionFlowProps {
  autoNotesUsed: boolean;
  streakInfo: {
    changed: boolean;
    newStreak: number;
    shieldUsed: boolean;
  } | null;
}

interface UseCompletionFlowReturn {
  screens: ScreenType[];
  currentStep: number;
  handleContinue: () => void;
  isLastScreen: boolean;
  totalScreens: number;
}

/**
 * Custom Hook für GameCompletion Flow-Management
 *
 * Bestimmt welche Screens angezeigt werden basierend auf:
 * - autoNotesUsed: Zeigt nur Info-Screen wenn true
 * - streakInfo.changed: Zeigt Streak-Screen nur wenn sich Streak geändert hat
 *
 * @example
 * const { screens, currentStep, handleContinue, isLastScreen } = useCompletionFlow({
 *   autoNotesUsed: false,
 *   streakInfo: { changed: true, newStreak: 5, shieldUsed: false }
 * });
 */
export const useCompletionFlow = ({
  autoNotesUsed,
  streakInfo,
}: UseCompletionFlowProps): UseCompletionFlowReturn => {
  const [currentStep, setCurrentStep] = useState(0);

  // Bestimme Screens basierend auf Kontext
  const screens = useMemo<ScreenType[]>(() => {
    // Fall 1: AutoNotes verwendet → Nur Info-Screen
    if (autoNotesUsed) {
      console.log('[GameCompletionFlow] AutoNotes used → Single info screen');
      return ['auto-notes'];
    }

    // Fall 2: Normaler Flow
    const flow: ScreenType[] = ['level-path', 'landscape'];

    // Streak Screen nur wenn sich Streak geändert hat
    if (streakInfo?.changed) {
      flow.push('streak');
      console.log('[GameCompletionFlow] Streak changed → Adding streak screen');
    } else {
      console.log('[GameCompletionFlow] Streak unchanged → Skipping streak screen');
    }

    console.log('[GameCompletionFlow] Flow screens:', flow);
    return flow;
  }, [autoNotesUsed, streakInfo]);

  // Navigation: Weiter zum nächsten Screen
  const handleContinue = useCallback(() => {
    if (currentStep < screens.length - 1) {
      const nextStep = currentStep + 1;
      console.log(`[GameCompletionFlow] Navigating to step ${nextStep}/${screens.length - 1} (${screens[nextStep]})`);
      setCurrentStep(nextStep);
    } else {
      console.log('[GameCompletionFlow] Already on last screen, cannot continue');
    }
  }, [currentStep, screens]);

  // Check ob wir auf dem letzten Screen sind
  const isLastScreen = useMemo(() => {
    return currentStep === screens.length - 1;
  }, [currentStep, screens.length]);

  return {
    screens,
    currentStep,
    handleContinue,
    isLastScreen,
    totalScreens: screens.length,
  };
};
