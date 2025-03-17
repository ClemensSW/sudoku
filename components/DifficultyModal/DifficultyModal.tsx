// components/DifficultyModal/DifficultyModal.tsx
import React from "react";
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
import styles from "./DifficultyModal.styles";

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
}

const DifficultyModal: React.FC<DifficultyModalProps> = ({
  visible,
  selectedDifficulty,
  onSelectDifficulty,
  onClose,
  onConfirm,
  title = "Schwierigkeit",
  subtitle = "Wähle die passende Herausforderung",
  confirmText = "Spiel starten",
  isTransition = false, // Default to false
  noBackdrop = false, // Default to false
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (!visible) return null;

  const difficultyLabels: Record<Difficulty, string> = {
    easy: "Leicht",
    medium: "Mittel",
    hard: "Schwer",
    expert: "Experte",
  };

  // Choose animation based on whether this is a transition
  const contentAnimation = isTransition 
    ? FadeInRight.duration(300).springify()
    : ZoomIn.duration(300);

  return (
    <View style={styles.modalOverlay}>
      {/* Dark semi-transparent backdrop - only if not using shared backdrop */}
      {!noBackdrop && (
        <Animated.View 
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          entering={isTransition ? FadeIn.duration(150) : FadeIn.duration(300)}
        />
      )}
      
      {/* Touchable area to close modal when tapping outside */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />

      <Animated.View
        style={[styles.modalContent, { backgroundColor: colors.card }]}
        entering={contentAnimation}
        // Stop event propagation to prevent closing when clicking on the content
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
          {title}
        </Text>

        <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>

        <View style={styles.difficultyContainer}>
          {(["easy", "medium", "hard", "expert"] as Difficulty[]).map((diff) => {
            const isSelected = selectedDifficulty === diff;

            return (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.difficultyButton,
                  isSelected && {
                    backgroundColor: `${colors.primary}15`,
                    borderColor: colors.primary,
                  },
                  {
                    borderColor: isSelected
                      ? colors.primary
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
                        ? colors.primary
                        : colors.textPrimary,
                    },
                  ]}
                >
                  {difficultyLabels[diff]}
                </Text>

                {isSelected && (
                  <Feather name="check" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: colors.primary }]}
          onPress={onConfirm}
        >
          <Text style={styles.modalButtonText}>{confirmText}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default DifficultyModal;