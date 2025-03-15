// screens/StartScreen/StartScreen.tsx
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import Button from "@/components/Button/Button";
import DifficultySelector from "@/components/DifficultySelector/DifficultySelector";
import HowToPlayModal from "@/components/HowToPlayModal/HowToPlayModal";
import styles from "./StartScreen.styles";

const { width } = Dimensions.get("window");

const StartScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStartGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDifficultyModal(true);
  };

  const handleStartWithDifficulty = () => {
    setShowDifficultyModal(false);
    // Navigate to the game screen with the selected difficulty
    router.push({
      pathname: "/game",
      params: { difficulty: selectedDifficulty },
    });
  };

  const handleOpenHowToPlay = () => {
    setShowHowToPlay(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleShowHighScores = () => {
    router.push("/settings");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      {/* Background Image */}
      <Image
        source={require("@/assets/images/background/mountains_blue.png")}
        style={styles.backgroundImage}
      />

      {/* Top buttons */}
      <SafeAreaView style={{ width: "100%" }}>
        <View style={[styles.topButtonsContainer, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShowHighScores}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="award" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={styles.content} entering={FadeIn.duration(500)}>
          {/* SUDOKU Title */}
          <Animated.View
            style={styles.titleContainer}
            entering={FadeInDown.delay(200).duration(800)}
          >
            <Text style={[styles.title, { color: colors.primary }]}>
              SUDOKU
            </Text>
          </Animated.View>

          {/* New Game Button */}
          <Animated.View
            style={styles.buttonContainer}
            entering={FadeInDown.delay(600).duration(800)}
          >
            <Button
              title="Neues Spiel"
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
      </SafeAreaView>

      {/* Difficulty Selection Modal */}
      {showDifficultyModal && (
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
            entering={FadeIn.duration(300)}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Neues Spiel
            </Text>
            <Text
              style={[styles.modalSubtitle, { color: colors.textSecondary }]}
            >
              Wie fordernd soll dein Sudoku sein?
            </Text>

            <View style={styles.difficultyButtonsContainer}>
              {/* Difficulty Buttons */}
              {["easy", "medium", "hard", "expert"].map((diff, index) => {
                const difficultyOption = diff as Difficulty;
                const isSelected = selectedDifficulty === difficultyOption;

                // Map the difficulty to German
                const difficultyLabels: Record<Difficulty, string> = {
                  easy: "Leicht",
                  medium: "Mittel",
                  hard: "Schwer",
                  expert: "Experte",
                };

                return (
                  <TouchableOpacity
                    key={diff}
                    style={[
                      styles.difficultyButton,
                      index < 3 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                      isSelected && {
                        backgroundColor: `${colors.primary}15`,
                      },
                    ]}
                    onPress={() => handleDifficultyChange(difficultyOption)}
                  >
                    <Text
                      style={[
                        styles.difficultyButtonText,
                        { color: colors.textPrimary },
                        isSelected && {
                          color: colors.primary,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {difficultyLabels[difficultyOption]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Large, prominent CTA button */}
            <TouchableOpacity
              style={[
                styles.modalCTAButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleStartWithDifficulty}
            >
              <Text style={[styles.modalCTAText, { color: colors.buttonText }]}>
                Los geht's!
              </Text>
            </TouchableOpacity>

            {/* Cancel button */}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowDifficultyModal(false)}
            >
              <Text
                style={[
                  styles.modalCancelText,
                  { color: colors.textSecondary },
                ]}
              >
                Abbrechen
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* How To Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal
          visible={showHowToPlay}
          onClose={() => setShowHowToPlay(false)}
        />
      )}
    </View>
  );
};

export default StartScreen;
