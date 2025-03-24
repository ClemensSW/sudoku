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
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, { FadeIn } from "react-native-reanimated";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import DifficultyModal from "@/components/DifficultyModal/DifficultyModal";
import HowToPlayModal from "@/components/HowToPlayModal/HowToPlayModal";
import { triggerHaptic } from "@/utils/haptics";
import styles from "./StartScreen.styles";

const { width, height } = Dimensions.get("window");

const StartScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  // State for modals and game options
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Berechnung für Layout
  const bottomNavHeight = 56;
  const contentBottomMargin =
    Platform.OS === "ios"
      ? bottomNavHeight + insets.bottom + 10 // iOS braucht mehr Abstand
      : bottomNavHeight + 10; // Android braucht weniger

  // Handle initial game button press - directly show difficulty modal
  const handleStartGame = () => {
    triggerHaptic("medium");
    setShowDifficultyModal(true);
  };

  // Handle difficulty selection
  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    triggerHaptic("light");
  };

  // Start the game with selected difficulty
  const handleStartWithDifficulty = () => {
    setShowDifficultyModal(false);
    
    // Navigate to game screen with selected difficulty
    router.push({
      pathname: "/game",
      params: { difficulty: selectedDifficulty },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      {/* Background decoration */}
      <View style={customStyles.backgroundContainer}>
        <Image
          source={require("@/assets/images/background/mountains_blue.png")}
          style={customStyles.backgroundImage}
          resizeMode="cover"
        />
      </View>

      {/* Content with manual padding for safe area */}
      <View style={[
        styles.safeArea, 
        { paddingTop: insets.top }
      ]}>
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

          {/* New Game Button - using new style like in DuoScreen */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[customStyles.startButton, { backgroundColor: colors.primary }]}
              onPress={handleStartGame}
              activeOpacity={0.8}
            >
              <Text style={customStyles.startButtonText}>Neues Spiel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Difficulty Modal - direct access with standard animation */}
      <DifficultyModal
        visible={showDifficultyModal}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={handleDifficultyChange}
        onClose={() => {
          setShowDifficultyModal(false);
        }}
        onConfirm={handleStartWithDifficulty}
        noBackdrop={false} // Show the backdrop since this is the only modal
        isTransition={false} // Don't use transition animation since this is direct
      />

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

// Custom styles for better background positioning and button styling
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
  // New button styles matching DuoScreen
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default StartScreen;