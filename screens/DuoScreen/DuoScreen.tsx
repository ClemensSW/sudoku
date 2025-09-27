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
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
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

// Die Teal-Farbe für den Duo-Modus
const DUO_PRIMARY_COLOR = "#4A7D78";

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
  // Adjust calculation to account for bottom navigation (56px) and safe area
  const navHeight = 56; // Bottom navigation height
  const mainScreenHeight = height - insets.top - insets.bottom - navHeight;

  // Scroll to features section
  const scrollToFeatures = () => {
    triggerHaptic("light");
    if (scrollViewRef.current) {
      // Scroll to just below the first screen, accounting for navigation height
      scrollViewRef.current.scrollTo({ y: height - navHeight - 100, animated: true });
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
    <View style={[styles.container, { backgroundColor: theme.isDark ? "#1A202C" : colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      {/* Background decoration */}
      <Image
        source={require("@/assets/images/background/mountains_blue.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Shared modal backdrop - keep animation for interactivity */}
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
          {/* Main section with interactive board - Fixed layout with padding for top elements */}
          <View
            style={[
              styles.mainScreen,
              { 
                height: mainScreenHeight,
                // Use space-between to position content and keep scroll indicator visible
                justifyContent: "space-between",
              },
            ]}
          >
            {/* Fixed top spacer without text content */}
            <View style={{ height: 20 }} />
            
            {/* Central content container for visualizer and button - removed entrance animation */}
            <View style={styles.centralContentContainer}>
              {/* Board visualizer with instant loading */}
              <DuoBoardVisualizer noAnimation={false} />

              {/* Start Game Button - below visualizer with proper spacing */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.startButton,
                    { backgroundColor: DUO_PRIMARY_COLOR },
                  ]}
                  onPress={handleStartGame}
                  activeOpacity={0.8}
                >
                  <Text style={styles.startButtonText}>Jetzt spielen</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Scroll indicator - no entrance animation */}
            <View style={styles.scrollIndicatorContainer}>
              <ScrollIndicator onPress={scrollToFeatures} noAnimation={true} />
            </View>
          </View>

          {/* Features section - this will now be well below the viewport */}
          <View style={styles.featuresScreen}>
            <DuoFeatures onStartGame={handleStartGame} noAnimation={true} />
          </View>
        </ScrollView>
      </View>

      {/* Difficulty selection modal - mit isDuoMode=true */}
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
        isDuoMode={true} // Wichtig: Hier setzen wir isDuoMode auf true für den Duo-Modus
        title="Neues Spiel"
        subtitle="Wählt gemeinsam den Schwierigkeitsgrad"
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