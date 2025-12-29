// screens/DuoGame/hooks/useDuoCompletionFlow.ts
/**
 * Hook für den Multi-Screen Completion Flow im Duo-Modus
 *
 * Steuert die Screen-Sequenz nach Spielende:
 * - Gegner gewinnt: nur Modal mit "Revanche" + "Zum Menü"
 * - Owner gewinnt: Modal → LevelPath → Landscape → (optional) Streak
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { StreakInfo } from './useDuoGameState';

export type DuoCompletionScreen = 'modal' | 'level-path' | 'landscape' | 'streak';

interface UseDuoCompletionFlowProps {
  isOwnerWin: boolean; // true wenn Player 1 (Owner) oder Tie gewinnt
  streakInfo: StreakInfo | null;
  visible: boolean;
  hasLandscape: boolean;
}

interface UseDuoCompletionFlowReturn {
  screens: DuoCompletionScreen[];
  currentStep: number;
  currentScreen: DuoCompletionScreen;
  handleContinue: () => void;
  isLastScreen: boolean;
  showProgressionScreens: boolean;
  /** true wenn wir auf einem Screen sind, der "Revanche + Zum Menü" zeigen soll */
  isOnFinalButtons: boolean;
}

export const useDuoCompletionFlow = ({
  isOwnerWin,
  streakInfo,
  visible,
  hasLandscape,
}: UseDuoCompletionFlowProps): UseDuoCompletionFlowReturn => {
  const [currentStep, setCurrentStep] = useState(0);

  // Bestimme die Screen-Sequenz basierend auf Spielergebnis
  const screens = useMemo<DuoCompletionScreen[]>(() => {
    // Immer mit Modal starten
    const flow: DuoCompletionScreen[] = ['modal'];

    // Nur Progression-Screens hinzufügen wenn Owner gewonnen hat
    if (isOwnerWin) {
      // LevelPathScreen kommt immer
      flow.push('level-path');

      // LandscapeScreen kommt immer (laut User gibt es immer eine Landschaft)
      if (hasLandscape) {
        flow.push('landscape');
      }

      // StreakScreen nur wenn Streak sich geändert hat
      if (streakInfo?.changed) {
        flow.push('streak');
      }
    }

    return flow;
  }, [isOwnerWin, streakInfo, hasLandscape]);

  // Aktueller Screen
  const currentScreen = screens[currentStep];

  // Weiter zum nächsten Screen
  const handleContinue = useCallback(() => {
    if (currentStep < screens.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, screens.length]);

  // Ist das der letzte Screen?
  const isLastScreen = currentStep === screens.length - 1;

  // Zeige Progression-Screens?
  const showProgressionScreens = isOwnerWin;

  // Bestimme ob wir "Revanche + Zum Menü" anzeigen sollen
  // - Bei Gegner-Sieg: sofort im Modal
  // - Bei Owner-Sieg: auf dem letzten Progression-Screen
  const isOnFinalButtons = useMemo(() => {
    if (!isOwnerWin) {
      // Gegner hat gewonnen - Modal zeigt finale Buttons
      return currentScreen === 'modal';
    }
    // Owner hat gewonnen - finale Buttons auf letztem Screen
    return isLastScreen && currentScreen !== 'modal';
  }, [isOwnerWin, currentScreen, isLastScreen]);

  // Reset wenn Modal sichtbar wird
  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
    }
  }, [visible]);

  return {
    screens,
    currentStep,
    currentScreen,
    handleContinue,
    isLastScreen,
    showProgressionScreens,
    isOnFinalButtons,
  };
};
