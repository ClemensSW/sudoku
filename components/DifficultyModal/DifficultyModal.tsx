// components/DifficultyModal/DifficultyModal.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import Animated, { ZoomIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
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

  return (
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <BlurView
        intensity={20}
        tint={theme.isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[styles.modalContent, { backgroundColor: colors.card }]}
        entering={ZoomIn.duration(300)}
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
    </TouchableOpacity>
  );
};

export default DifficultyModal;