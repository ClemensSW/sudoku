import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  LayoutChangeEvent,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Difficulty } from "@/utils/sudoku";
import styles from "./DifficultySelector.styles";
import { useTheme } from "@/utils/theme/ThemeProvider";

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelectDifficulty,
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

  // Store button widths for animation
  const [buttonWidths, setButtonWidths] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  // Animation values
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  // Calculate left position based on selected difficulty
  useEffect(() => {
    if (buttonWidths.length === difficulties.length && containerWidth > 0) {
      const index = difficulties.indexOf(currentDifficulty);
      let position = 0;

      // Calculate position based on previous buttons
      for (let i = 0; i < index; i++) {
        position += buttonWidths[i];
      }

      // Set indicator position and width
      indicatorPosition.value = withTiming(position, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      indicatorWidth.value = withTiming(buttonWidths[index], {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [currentDifficulty, buttonWidths, containerWidth]);

  // Store container width when layout changes
  const onContainerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);

    // Reset button widths when container size changes
    if (width > 0 && buttonWidths.length === difficulties.length) {
      const buttonWidth = width / difficulties.length;
      const newButtonWidths = Array(difficulties.length).fill(buttonWidth);
      setButtonWidths(newButtonWidths);
    }
  };

  // Store button width for animation calculation
  const onButtonLayout = (index: number, event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;

    // Update button width at specified index
    if (width > 0) {
      setButtonWidths((prev) => {
        const newWidths = [...prev];
        newWidths[index] = width;
        return newWidths;
      });
    }
  };

  // Animated style for the indicator
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
      width: indicatorWidth.value,
      backgroundColor: colors.primary,
    };
  });

  // Handle difficulty selection with haptic feedback
  const handleSelectDifficulty = (difficulty: Difficulty) => {
    if (disabled || difficulty === currentDifficulty) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectDifficulty(difficulty);
  };

  return (
    <View style={styles.container}>
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
        onLayout={onContainerLayout}
      >
        {/* Animated Background Indicator */}
        <Animated.View style={[styles.animatedIndicator, indicatorStyle]} />

        {/* Difficulty Buttons */}
        <View style={styles.difficultyButtonsRow}>
          {difficulties.map((difficulty, index) => {
            const isSelected = currentDifficulty === difficulty;

            return (
              <Pressable
                key={difficulty}
                style={[styles.button]}
                onPress={() => handleSelectDifficulty(difficulty)}
                disabled={disabled || isSelected}
                onLayout={(e) => onButtonLayout(index, e)}
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
                    isSelected && styles.selectedButtonText,
                    {
                      color: isSelected
                        ? theme.isDark
                          ? colors.textOnPrimary
                          : colors.textOnPrimary
                        : colors.textPrimary,
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
    </View>
  );
};

export default DifficultySelector;
