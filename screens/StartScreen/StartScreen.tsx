// screens/StartScreen/StartScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import Button from "@/components/Button/Button";
import HowToPlayModal from "@/components/HowToPlayModal/HowToPlayModal";
import styles from "./StartScreen.styles";
import { triggerHaptic } from "@/utils/haptics";

const { width, height } = Dimensions.get("window");

// Create a static, non-animated Button wrapper
const StaticButton: React.FC<any> = (props) => {
  const {
    title,
    onPress,
    variant = "primary",
    style,
    icon,
    iconPosition = "left",
  } = props;
  const theme = useTheme();
  const colors = theme.colors;

  // Get button styles without animations
  const getButtonStyle = () => {
    const baseStyle = {
      height: 52,
      minWidth: 120,
      paddingHorizontal: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row" as const,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {icon && iconPosition === "left" && (
        <View style={{ marginRight: 8 }}>{icon}</View>
      )}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.buttonText,
        }}
      >
        {title}
      </Text>
      {icon && iconPosition === "right" && (
        <View style={{ marginLeft: 8 }}>{icon}</View>
      )}
    </TouchableOpacity>
  );
};

const StartScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Berechnung für Layout
  const bottomNavHeight = 56;
  const contentBottomMargin =
    Platform.OS === "ios"
      ? bottomNavHeight + insets.bottom + 10 // iOS braucht mehr Abstand
      : bottomNavHeight + 10; // Android braucht weniger

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

  // Handler für Settings
  const handleShowSettings = () => {
    triggerHaptic("light");
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

      {/* Custom background image that starts above the bottom nav */}
      <View style={customStyles.backgroundContainer}>
        <Image
          source={require("@/assets/images/background/mountains_blue.png")}
          style={customStyles.backgroundImage}
          resizeMode="cover"
        />
      </View>

      {/* Settings-Button in der oberen rechten Ecke */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 16,
          right: 16,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={handleShowSettings}
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
          <Feather name="settings" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* SafeArea und Content */}
      <SafeAreaView style={[styles.safeArea]} edges={["top"]}>
        <View
          style={[
            styles.content,
            {
              marginBottom: contentBottomMargin, // Platz für BottomNav
              flex: 1,
              justifyContent: "center",
            },
          ]}
        >
          {/* SUDOKU Title */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.primary }]}>
              SUDOKU
            </Text>
          </View>

          {/* New Game Button - using static button instead of animated */}
          <View style={styles.buttonContainer}>
            <StaticButton
              title="Neues Spiel"
              onPress={handleStartGame}
              variant="primary"
              style={styles.startButton}
              icon={<Feather name="play" size={20} color={colors.buttonText} />}
              iconPosition="right"
            />
          </View>
        </View>
      </SafeAreaView>

      {/* Difficulty Selection Modal with BlurView */}
      {showDifficultyModal && (
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: "transparent" }]}
          activeOpacity={1}
          onPress={() => setShowDifficultyModal(false)}
        >
          <BlurView
            intensity={15}
            tint={theme.isDark ? "dark" : "light"}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(0, 0, 0, 0.3)" },
            ]}
          />
          <View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
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
                { marginBottom: 8 },
              ]}
              onPress={handleStartWithDifficulty}
            >
              <Text style={[styles.modalCTAText, { color: colors.buttonText }]}>
                Los geht's!
              </Text>
            </TouchableOpacity>
          </View>
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

// Custom styles for better background positioning
const customStyles = StyleSheet.create({
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 56, // Leave space for bottom navigation
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
});

export default StartScreen;
