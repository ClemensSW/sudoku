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
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import { 
  loadStats, 
  GameStats, 
  getUnlockedDifficulties, 
  getProgressMessage, 
  getProgressValue 
} from "@/utils/storage";
import styles from "./DifficultyModal.styles";

// Konstante für die Teal-Farbe für den Duo-Modus
const DUO_PRIMARY_COLOR = "#4A7D78";

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
  title = "Schwierigkeit",
  subtitle = "Wie fordernd soll dein Sudoku sein?",
  confirmText = "Los geht's",
  isTransition = false, // Default to false
  noBackdrop = false, // Default to false
  isDuoMode = false, // Default zu false
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [stats, setStats] = useState<GameStats | null>(null);
  const [unlockedDifficulties, setUnlockedDifficulties] = useState<Difficulty[]>(["easy"]);
  const [isLoading, setIsLoading] = useState(true);

  // Wähle die Primärfarbe basierend auf dem Modus
  const primaryColor = isDuoMode ? DUO_PRIMARY_COLOR : colors.primary;

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

  // Schwierigkeitsgrade mit deutschen Namen
  const difficultyLabels: Record<Difficulty, string> = {
    easy: "Leicht",
    medium: "Mittel",
    hard: "Schwer",
    expert: "Experte",
  };

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
          {title}
        </Text>

        <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
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
                    {difficultyLabels[diff]}
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
                  {difficultyLabels[diff]}
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
          <Text style={styles.modalButtonText}>{confirmText}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default DifficultyModal;