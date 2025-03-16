// screens/DuoScreen/DuoScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp, SlideInUp } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { Difficulty } from "@/utils/sudoku";

// Import components
import DuoHeader from "./components/DuoHeader/DuoHeader";
import DuoBoardVisualizer from "./components/DuoBoardVisualizer/DuoBoardVisualizer";
import ScrollIndicator from "./components/ScrollIndicator/ScrollIndicator";
import DuoFeatures from "./components/DuoFeatures/DuoFeatures";
import DifficultyModal from "../../components/DifficultyModal/DifficultyModal";

import styles from "./DuoScreen.styles";

const { height } = Dimensions.get("window");

const DuoScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  // Reference to scroll view for programmatic scrolling
  const scrollViewRef = useRef<ScrollView>(null);

  // State
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");

  // Scroll to features section
  const scrollToFeatures = () => {
    triggerHaptic("light");
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: height * 0.9, animated: true });
    }
  };

  // Handle difficulty selection
  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    triggerHaptic("light");
  };

  // Handle game start
  const handleStartGame = () => {
    triggerHaptic("medium");
    setShowDifficultyModal(true);
  };

  // Begin game with selected difficulty
  const handleStartWithDifficulty = () => {
    setShowDifficultyModal(false);
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
        onClose={() => setShowDifficultyModal(false)}
        onConfirm={handleStartWithDifficulty}
      />
    </View>
  );
};

export default DuoScreen;
