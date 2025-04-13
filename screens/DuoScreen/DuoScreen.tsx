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
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { 
  FadeIn, 
  FadeOut 
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { Difficulty } from "@/utils/sudoku";

// Import components
import DuoBoardVisualizer from "./components/DuoBoardVisualizer/DuoBoardVisualizer";
import ScrollIndicator from "./components/ScrollIndicator/ScrollIndicator";
import DuoFeatures from "./components/DuoFeatures/DuoFeatures";
import DifficultyModal from "../../components/DifficultyModal/DifficultyModal";
import GameModeModal, { GameMode } from "../../components/GameModeModal";
import { useAlert } from "@/components/CustomAlert/AlertProvider";

import styles from "./DuoScreen.styles";

const { height, width } = Dimensions.get("window");

// Modified DuoHeader without settings button and left-aligned
const SimpleDuoHeader = ({ paddingTop = 0 }) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[headerStyles.header, { paddingTop }]}>
      <View style={headerStyles.titleContainer}>
        <Text style={[headerStyles.subTitle, { color: colors.textSecondary }]}>
          ZWEI SPIELER MODUS
        </Text>
        <Text style={[headerStyles.title, { color: colors.textPrimary }]}>
          Sudoku Duo
        </Text>
      </View>
    </View>
  );
};

// Simple header styles - updated for left alignment
const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Changed from center to flex-start for left alignment
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: {
    alignItems: "flex-start", // Changed from center to flex-start for left alignment
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subTitle: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
});

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

  // Calculate the full screen height for the main section
  // Add 100px extra to ensure the features section is well below the viewport
  const mainScreenHeight = height - insets.top - insets.bottom;

  // Scroll to features section
  const scrollToFeatures = () => {
    triggerHaptic("light");
    if (scrollViewRef.current) {
      // Scroll to just below the first screen
      scrollViewRef.current.scrollTo({ y: height - 100, animated: true });
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
            backgroundColor: colors.backdropColor,
            zIndex: 100 
          }]}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        />
      )}

      {/* Main content without SafeAreaView */}
      <View style={{ flex: 1 }}>
        {/* Header - Using simplified header without settings button */}
        <SimpleDuoHeader paddingTop={insets.top} />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main section with interactive board - Make this taller than screen height */}
          <View
            style={[
              styles.mainScreen,
              { 
                height: mainScreenHeight,
                justifyContent: "flex-start", // Change from space-between to flex-start
                paddingTop: 30, // Add some padding at the top
              },
            ]}
          >
            {/* Board visualizer - at top */}
            <DuoBoardVisualizer />

            {/* Start Game Button - in middle */}
            <View style={[styles.buttonContainer, { marginTop: 40 }]}>
              <TouchableOpacity
                style={[
                  styles.startButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleStartGame}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Jetzt spielen</Text>
              </TouchableOpacity>
            </View>

            {/* Scroll indicator - positioned at bottom of visible area */}
            <View style={{ 
              position: 'absolute', 
              bottom: mainScreenHeight - height + insets.top + 100, // Position at bottom of visible area
              left: 0, 
              right: 0,
            }}>
              <ScrollIndicator onPress={scrollToFeatures} />
            </View>
          </View>

          {/* Features section - this will now be well below the viewport */}
          <View style={styles.featuresScreen}>
            <DuoFeatures onStartGame={handleStartGame} />
          </View>
        </ScrollView>
      </View>

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