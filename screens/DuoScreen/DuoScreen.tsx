// screens/DuoScreen/DuoScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { 
  FadeInUp, 
  SlideInUp, 
  FadeIn, 
  FadeOut 
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { Difficulty } from "@/utils/sudoku";

// Import components
import DuoHeader from "./components/DuoHeader/DuoHeader";
import DuoBoardVisualizer from "./components/DuoBoardVisualizer/DuoBoardVisualizer";
import ScrollIndicator from "./components/ScrollIndicator/ScrollIndicator";
import DuoFeatures from "./components/DuoFeatures/DuoFeatures";
import DifficultyModal from "../../components/DifficultyModal/DifficultyModal";
import GameModeModal, { GameMode } from "../../components/GameModeModal";
import { useAlert } from "@/components/CustomAlert/AlertProvider";

import styles from "./DuoScreen.styles";

const { height } = Dimensions.get("window");

const DuoScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  // Reference to scroll view for programmatic scrolling
  const scrollViewRef = useRef<ScrollView>(null);

  // State
  const [showGameModeModal, setShowGameModeModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [selectedMode, setSelectedMode] = useState<GameMode>("local");
  // Track if any modal is open (for shared backdrop)
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  // Scroll to features section - just enough to hide the button
  const scrollToFeatures = () => {
    triggerHaptic("light");
    if (scrollViewRef.current) {
      // Calculate scroll position to fully hide the ScrollIndicator
      // This will show the beginning of the features section
      const mainScreenHeight = height - insets.top - 200 + 60; // Added extra pixels to fully hide the button
      scrollViewRef.current.scrollTo({ y: mainScreenHeight, animated: true });
    }
  };

  // Handle difficulty selection
  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    triggerHaptic("light");
  };

  // Handle initial game start button click
  const handleStartGame = () => {
    triggerHaptic("medium");
    setIsAnyModalOpen(true);
    setShowGameModeModal(true);
  };

  // Handle game mode selection
  const handleModeSelection = (mode: GameMode) => {
    setSelectedMode(mode);
    triggerHaptic("medium");
    
    // If local mode, show difficulty selection with a slight delay
    if (mode === "local") {
      // First close game mode modal but keep backdrop
      setShowGameModeModal(false);
      
      // Then show difficulty modal with a slight delay for better animation
      setTimeout(() => {
        setShowDifficultyModal(true);
      }, 100);
    } 
    // For online mode (which is in development)
    else {
      setShowGameModeModal(false);
      setIsAnyModalOpen(false);
      showAlert({
        title: "In Entwicklung",
        message: "Der Online-Modus wird derzeit entwickelt und steht in Kürze zur Verfügung. Bleib gespannt!",
        type: "info",
        buttons: [{ text: "OK", style: "primary" }]
      });
    }
  };

  // Begin game with selected difficulty
  const handleStartWithDifficulty = () => {
    setShowDifficultyModal(false);
    setIsAnyModalOpen(false);
    // Navigate to the duo game screen with selected difficulty
    router.replace({
      pathname: "/duo-game",
      params: { difficulty: selectedDifficulty },
    });
  };

  // Navigate to settings
  const handleSettingsPress = () => {
    triggerHaptic("light");
    router.push("/settings");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      {/* Background decoration */}
      <Image
        source={require("@/assets/images/background/mountains_blue.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Shared modal backdrop */}
      {isAnyModalOpen && (
        <Animated.View 
          style={[StyleSheet.absoluteFill, { 
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 100 
          }]}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        />
      )}

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Header */}
        <DuoHeader
          onSettingsPress={handleSettingsPress}
          paddingTop={insets.top}
        />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main section with interactive board */}
          <View
            style={[
              styles.mainScreen,
              { minHeight: height - insets.top - 200 },
            ]}
          >
            <DuoBoardVisualizer />

            {/* Start Game Button */}
            <Animated.View
              style={styles.buttonContainer}
              entering={SlideInUp.delay(600).duration(500)}
            >
              <TouchableOpacity
                style={[
                  styles.startButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleStartGame}
                activeOpacity={0.8}
              >
                <Image
                  source={require("@/assets/images/icons/yin-yang.png")}
                  style={styles.playIcon}
                />
                <Text style={styles.startButtonText}>Jetzt spielen</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Scroll indicator to features section */}
            <ScrollIndicator onPress={scrollToFeatures} />
          </View>

          {/* Features section */}
          <View style={styles.featuresScreen}>
            <DuoFeatures onStartGame={handleStartGame} />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Difficulty selection modal */}
      <DifficultyModal
        visible={showDifficultyModal}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={handleDifficultyChange}
        onClose={() => {
          setShowDifficultyModal(false);
          setIsAnyModalOpen(false);
        }}
        onConfirm={handleStartWithDifficulty}
        noBackdrop={true} // Always use the shared backdrop
        isTransition={true} // Always use transition animation for second modal
      />

      {/* Game Mode Selection Modal */}
      <GameModeModal
        visible={showGameModeModal}
        onClose={() => {
          setShowGameModeModal(false);
          setIsAnyModalOpen(false);
        }}
        onSelectMode={handleModeSelection}
        noBackdrop={true} // Always use the shared backdrop
      />
    </View>
  );
};

export default DuoScreen;