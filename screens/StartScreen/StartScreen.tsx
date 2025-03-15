// screens/StartScreen/StartScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
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
import { triggerHaptic } from "@/utils/haptics";

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
    triggerHaptic("light");
  };

  const handleStartGame = () => {
    triggerHaptic("medium");
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
    triggerHaptic("light");
  };

  const handleShowHighScores = () => {
    triggerHaptic("light");

    // Using setTimeout to ensure the UI has time to update first
    setTimeout(() => {
      try {
        router.push("/settings");
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }, 50);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      {/* Background Image */}
      <Image
        source={require("@/assets/images/background/mountains_blue.png")}
        style={styles.backgroundImage}
      />

      {/* Standalone Button with absolute positioning */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 16,
          right: 16,
          zIndex: 9999,
        }}
      >
        <TouchableOpacity
          onPress={handleShowHighScores}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderWidth: 1,
            borderColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={0.7}
        >
          <Feather name="award" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

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
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDifficultyModal(false)}
        >
          <Animated.View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
            entering={FadeIn.duration(300)}
            // This prevents touches on the modal content from closing the modal
            onTouchEnd={(e) => e.stopPropagation()}
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
                // Add more bottom margin since we removed the cancel button
                { marginBottom: 8 },
              ]}
              onPress={handleStartWithDifficulty}
            >
              <Text style={[styles.modalCTAText, { color: colors.buttonText }]}>
                Los geht's!
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
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
