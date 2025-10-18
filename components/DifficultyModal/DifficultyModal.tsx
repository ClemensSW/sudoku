// components/DifficultyModal/DifficultyModal.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  ZoomIn,
  FadeIn,
  FadeInRight,
  SlideInRight
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import {
  loadStats,
  GameStats,
  getUnlockedDifficulties,
  getProgressValue
} from "@/utils/storage";
import { useProgressColor } from "@/hooks/useProgressColor";
import styles from "./DifficultyModal.styles";
import { getDuoBrandColor } from "@/utils/duoColors";
import { useStoredColorHex } from "@/contexts/color/ColorContext";

interface DifficultyModalProps {
  visible: boolean;
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  subtitle?: string;
  confirmText?: string;
  isTransition?: boolean; // Flag to indicate if this is a transition from another modal
  noBackdrop?: boolean; // Option to hide the backdrop
  isDuoMode?: boolean; // Neu: Flag für Duo-Modus
}

const DifficultyModal: React.FC<DifficultyModalProps> = ({
  visible,
  selectedDifficulty,
  onSelectDifficulty,
  onClose,
  onConfirm,
  title,
  subtitle,
  confirmText,
  isTransition = false,
  noBackdrop = false,
  isDuoMode = false,
}) => {
  const { t } = useTranslation('start');
  const theme = useTheme();
  const colors = theme.colors;
  const dynamicProgressColor = useProgressColor();
  const pathColorHex = useStoredColorHex();
  const [stats, setStats] = useState<GameStats | null>(null);
  const [unlockedDifficulties, setUnlockedDifficulties] = useState<Difficulty[]>(["easy"]);
  const [isLoading, setIsLoading] = useState(true);

  // Use translations as defaults if not provided
  const modalTitle = title || t('difficultyModal.title');
  const modalSubtitle = subtitle || t('difficultyModal.subtitle');
  const modalConfirmText = confirmText || t('difficultyModal.confirm');

  // Wähle die Primärfarbe basierend auf dem Modus
  const primaryColor = isDuoMode ? getDuoBrandColor(pathColorHex) : dynamicProgressColor;

  // Helper function to get progress message with i18next
  const getProgressMessage = (stats: GameStats): string => {
    if ((stats.completedHard || 0) >= 9) {
      return t('difficultyModal.progress.allUnlocked');
    } else if ((stats.completedMedium || 0) >= 3) {
      const remaining = 9 - (stats.completedHard || 0);
      return t('difficultyModal.progress.unlockExpert', { count: remaining });
    } else if ((stats.completedEasy || 0) >= 1) {
      const remaining = 3 - (stats.completedMedium || 0);
      return t('difficultyModal.progress.unlockHard', { count: remaining });
    } else {
      const remaining = 1 - (stats.completedEasy || 0);
      return t('difficultyModal.progress.unlockMedium', { count: remaining });
    }
  };

  // Lade die Statistiken, wenn das Modal sichtbar wird
  useEffect(() => {
    const loadUserStats = async () => {
      if (visible) {
        try {
          setIsLoading(true);
          const loadedStats = await loadStats();
          setStats(loadedStats);
          
          // Im Duo-Modus alle Schwierigkeitsgrade freischalten, sonst normal verfahren
          if (isDuoMode) {
            setUnlockedDifficulties(["easy", "medium", "hard", "expert"]);
          } else {
            const unlocked = getUnlockedDifficulties(loadedStats);
            setUnlockedDifficulties(unlocked);
          }
          
          // Stelle sicher, dass der ausgewählte Schwierigkeitsgrad verfügbar ist
          if (!isDuoMode && !unlockedDifficulties.includes(selectedDifficulty)) {
            onSelectDifficulty("easy"); // Fallback auf Leicht
          }
        } catch (error) {
          console.error("Error loading stats:", error);
          // Für den Duo-Modus alle Schwierigkeitsgrade freischalten
          if (isDuoMode) {
            setUnlockedDifficulties(["easy", "medium", "hard", "expert"]);
          }
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadUserStats();
  }, [visible, selectedDifficulty, onSelectDifficulty, isDuoMode]);

  if (!visible) return null;

  // Fortschrittsbalken und -nachricht - nur wenn nicht im Duo-Modus
  const progressPercentage = stats && !isDuoMode ? getProgressValue(stats) : 0;
  const progressMessage = stats && !isDuoMode ? getProgressMessage(stats) : "";
  const allUnlocked = isDuoMode || (stats && unlockedDifficulties.length === 4);

  // Animation basierend auf Transition-Flag wählen
  const contentAnimation = isTransition 
    ? FadeInRight.duration(300).springify()
    : ZoomIn.duration(300);

  return (
    <View style={styles.modalOverlay}>
      {/* Halbtransparenter Hintergrund - nur wenn nicht geteilt */}
      {!noBackdrop && (
        <Animated.View 
          style={[
            StyleSheet.absoluteFill, 
            styles.backdrop,
            { backgroundColor: colors.backdropColor } 
          ]}
          entering={isTransition ? FadeIn.duration(150) : FadeIn.duration(300)}
        />
      )}
      
      {/* Klickbarer Bereich zum Schließen beim Tippen außerhalb */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />

      <Animated.View
        style={[styles.modalContent, { backgroundColor: colors.card }]}
        entering={contentAnimation}
        // Verhindere Schließen beim Klicken auf den Inhalt
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
          {modalTitle}
        </Text>

        <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
          {modalSubtitle}
        </Text>

        <View style={styles.difficultyContainer}>
          {/* Zeige nur freigeschaltete Schwierigkeitsgrade an */}
          {(["easy", "medium", "hard", "expert"] as Difficulty[])
            .filter(diff => isDuoMode || unlockedDifficulties.includes(diff))
            .map((diff) => {
              const isSelected = selectedDifficulty === diff;

              return (
                <TouchableOpacity
                  key={diff}
                  style={[
                    styles.difficultyButton,
                    isSelected && {
                      backgroundColor: `${primaryColor}15`,
                      borderColor: primaryColor,
                    },
                    {
                      borderColor: isSelected
                        ? primaryColor
                        : theme.isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    },
                  ]}
                  onPress={() => onSelectDifficulty(diff)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      {
                        color: isSelected
                          ? primaryColor
                          : colors.textPrimary,
                      },
                    ]}
                  >
                    {t(`difficultyModal.difficulties.${diff}`)}
                  </Text>

                  {isSelected && (
                    <Feather name="check" size={18} color={primaryColor} />
                  )}
                </TouchableOpacity>
              );
            })}
            
          {/* Zeige gesperrte Schwierigkeitsgrade als deaktiviert an - nur wenn nicht im Duo-Modus */}
          {!isDuoMode && (["easy", "medium", "hard", "expert"] as Difficulty[])
            .filter(diff => !unlockedDifficulties.includes(diff))
            .map((diff) => (
              <View
                key={`locked-${diff}`}
                style={[
                  styles.difficultyButton,
                  styles.lockedDifficultyButton,
                  {
                    borderColor: theme.isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    backgroundColor: theme.isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.03)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    styles.lockedDifficultyText,
                    { color: colors.buttonDisabled },
                  ]}
                >
                  {t(`difficultyModal.difficulties.${diff}`)}
                </Text>
                <Feather name="lock" size={16} color={colors.buttonDisabled} />
              </View>
            ))}
        </View>
        
        {/* Fortschrittsnachricht und -balken - nur wenn nicht im Duo-Modus und nicht alle freigeschaltet */}
        {stats && !isDuoMode && !allUnlocked && (
          <View style={styles.progressContainer}>
            <Text style={[styles.progressMessage, { color: colors.textSecondary }]}>
              {progressMessage}
            </Text>
            
            {/* Fortschrittsbalken */}
            <View style={[
              styles.progressBarBackground, 
              { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
            ]}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: primaryColor
                  }
                ]} 
              />
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: primaryColor }]}
          onPress={onConfirm}
        >
          <Text style={styles.modalButtonText}>{modalConfirmText}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default DifficultyModal;