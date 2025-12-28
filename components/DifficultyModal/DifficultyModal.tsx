// components/DifficultyModal/DifficultyModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import Animated, {
  ZoomIn,
  FadeIn,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
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
import Button from "@/components/Button/Button";
import styles from "./DifficultyModal.styles";

// Duo Color - Darkened Silver (matches current league in navigation)
const DUO_COLOR = "#989898";

// Helper to darken a hex color
const darkenColor = (hex: string, amount: number): string => {
  const color = hex.replace("#", "");
  const r = Math.max(0, parseInt(color.substring(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(color.substring(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(color.substring(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

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
  const progressColor = useProgressColor();
  // Use fixed DUO_COLOR for Duo mode, otherwise use user's path color
  const accentColor = isDuoMode ? DUO_COLOR : progressColor;
  const [stats, setStats] = useState<GameStats | null>(null);
  const [unlockedDifficulties, setUnlockedDifficulties] = useState<Difficulty[]>(["easy"]);
  const [isLoading, setIsLoading] = useState(true);

  // Shine animation for Duo button
  const shinePosition = useSharedValue(-80);
  const shineTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible && isDuoMode) {
      const animateShine = () => {
        shinePosition.value = -80;
        shinePosition.value = withDelay(
          500,
          withTiming(400, { duration: 800, easing: Easing.inOut(Easing.ease) })
        );
        shineTimeoutRef.current = setTimeout(animateShine, 3500);
      };
      shineTimeoutRef.current = setTimeout(animateShine, 800);
      return () => {
        if (shineTimeoutRef.current) {
          clearTimeout(shineTimeoutRef.current);
        }
      };
    }
  }, [visible, isDuoMode]);

  const shineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shinePosition.value }, { skewX: "-20deg" }],
  }));

  // Use translations as defaults if not provided
  const modalTitle = title || t('difficultyModal.title');
  const modalSubtitle = subtitle || t('difficultyModal.subtitle');
  const modalConfirmText = confirmText || t('difficultyModal.confirm');

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
                      backgroundColor: `${accentColor}15`,
                      borderColor: accentColor,
                    },
                    {
                      borderColor: isSelected
                        ? accentColor
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
                          ? accentColor
                          : colors.textPrimary,
                      },
                    ]}
                  >
                    {t(`difficultyModal.difficulties.${diff}`)}
                  </Text>

                  {isSelected && (
                    <Feather name="check" size={18} color={accentColor} />
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
                    backgroundColor: accentColor
                  }
                ]}
              />
            </View>
          </View>
        )}

        {isDuoMode ? (
          <Pressable
            onPress={onConfirm}
            style={({ pressed }) => [
              styles.duoButton,
              {
                shadowColor: accentColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <LinearGradient
              colors={[accentColor, darkenColor(accentColor, 30)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.duoButtonGradient}
            >
              {/* Shine Effect */}
              <Animated.View style={[styles.duoButtonShine, shineStyle]}>
                <LinearGradient
                  colors={[
                    "transparent",
                    "rgba(255,255,255,0.25)",
                    "rgba(255,255,255,0.4)",
                    "rgba(255,255,255,0.25)",
                    "transparent",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>

              {/* Button Content */}
              <Text style={styles.duoButtonText}>{modalConfirmText}</Text>
              <Feather name="play" size={20} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        ) : (
          <Button
            title={modalConfirmText}
            onPress={onConfirm}
            variant="primary"
            customColor={accentColor}
            style={styles.modalButton}
          />
        )}
      </Animated.View>
    </View>
  );
};

export default DifficultyModal;