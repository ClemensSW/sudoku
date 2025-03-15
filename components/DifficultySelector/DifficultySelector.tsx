// components/DifficultySelector/DifficultySelector.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Difficulty } from "@/utils/sudoku";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./DifficultySelector.styles";
import { triggerHaptic } from "@/utils/haptics";

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  style?: any;
  disabled?: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  style,
  disabled = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Translations for difficulty levels
  const difficultyLabels: Record<Difficulty, string> = {
    easy: "Leicht",
    medium: "Mittel",
    hard: "Schwer",
    expert: "Experte",
  };

  // Difficulties in order
  const difficulties: Difficulty[] = ["easy", "medium", "hard", "expert"];

  // Handle difficulty selection with haptic feedback
  const handleSelectDifficulty = (difficulty: Difficulty) => {
    if (disabled || difficulty === currentDifficulty) return;

    triggerHaptic("light");
    onSelectDifficulty(difficulty);
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.segmentedControlContainer,
          {
            backgroundColor: theme.isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
            borderColor: theme.isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
          },
        ]}
      >
        {/* Difficulty Buttons */}
        {difficulties.map((difficulty) => {
          const isSelected = currentDifficulty === difficulty;

          return (
            <Pressable
              key={difficulty}
              style={[
                styles.button,
                isSelected && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => handleSelectDifficulty(difficulty)}
              disabled={disabled || isSelected}
              android_ripple={{
                color: theme.isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
                borderless: true,
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: isSelected
                      ? colors.textOnPrimary
                      : colors.textPrimary,
                    fontWeight: isSelected ? "700" : "400",
                  },
                ]}
              >
                {difficultyLabels[difficulty]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default DifficultySelector;
