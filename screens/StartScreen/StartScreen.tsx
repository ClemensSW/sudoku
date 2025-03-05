import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
  BounceIn,
} from "react-native-reanimated";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import Button from "@/components/Button/Button";
import DifficultySelector from "@/components/DifficultySelector/DifficultySelector";
import styles from "./StartScreen.styles";

const StartScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStartGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to the game screen with the selected difficulty
    router.push({
      pathname: "game",
      params: { difficulty: selectedDifficulty },
    });
  };

  // The grid cells to show in the logo
  const gridCells = [
    { value: 5, show: true },
    { value: 3, show: true },
    { value: "", show: false },
    { value: 6, show: true },
    { value: "", show: false },
    { value: 9, show: true },
    { value: "", show: false },
    { value: 8, show: true },
    { value: 7, show: true },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      {/* Decorative background elements */}
      <Animated.View
        style={[styles.decorCircle1, { backgroundColor: colors.primary }]}
        entering={FadeIn.duration(800)}
      />

      <Animated.View
        style={[styles.decorCircle2, { backgroundColor: colors.primary }]}
        entering={FadeIn.duration(800)}
      />

      <View style={[styles.safeArea, { paddingBottom: insets.bottom }]}>
        <Animated.View style={styles.content} entering={FadeIn.duration(500)}>
          <Animated.View
            style={styles.titleContainer}
            entering={FadeInDown.delay(200).duration(800)}
          >
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Sudoku
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Trainiere dein Gehirn mit Logik-Rätseln
            </Text>
          </Animated.View>

          <Animated.View
            style={styles.logoContainer}
            entering={BounceIn.delay(400).duration(1000)}
          >
            <View
              style={[
                styles.logoBackground,
                { backgroundColor: colors.primary },
              ]}
            >
              <View
                style={[
                  styles.gridContainer,
                  { borderColor: colors.buttonText },
                ]}
              >
                {gridCells.map((cell, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.gridCell,
                      {
                        borderColor: `rgba(255,255,255,0.3)`,
                        backgroundColor: cell.show
                          ? `rgba(255,255,255,0.15)`
                          : "transparent",
                      },
                    ]}
                    entering={FadeIn.delay(500 + index * 100).duration(400)}
                  >
                    {cell.show && (
                      <Text
                        style={[
                          styles.gridNumber,
                          { color: colors.buttonText },
                        ]}
                      >
                        {cell.value}
                      </Text>
                    )}
                  </Animated.View>
                ))}
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={styles.difficultyContainer}
            entering={FadeInUp.delay(600).duration(800)}
          >
            <Text
              style={[styles.difficultyTitle, { color: colors.textPrimary }]}
            >
              Wähle eine Schwierigkeitsstufe:
            </Text>
            <DifficultySelector
              currentDifficulty={selectedDifficulty}
              onSelectDifficulty={handleDifficultyChange}
            />
          </Animated.View>

          <Animated.View
            style={styles.buttonContainer}
            entering={SlideInDown.delay(800).duration(800)}
          >
            <Button
              title="Spielen"
              onPress={handleStartGame}
              variant="primary"
              style={styles.startButton}
              icon={<Feather name="play" size={20} color={colors.buttonText} />}
              iconPosition="right"
              withHaptic={true}
              hapticType="medium"
            />
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default StartScreen;
