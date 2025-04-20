// screens/StartScreen/StartScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigation } from "@/utils/NavigationContext";
import { Difficulty } from "@/utils/sudoku";
import DifficultyModal from "@/components/DifficultyModal/DifficultyModal";
import HowToPlayModal from "@/components/HowToPlayModal/HowToPlayModal";
import { triggerHaptic } from "@/utils/haptics";

const { width, height } = Dimensions.get("window");

const StartScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const { setShowNavigation } = useNavigation();

  // State for modals and game options
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Calculate button area height and overlap for a smoother transition
  const BUTTON_AREA_HEIGHT = 160; // Taller button area for better proportion
  const GRADIENT_OVERLAP = 80; // Larger gradient overlap for smoother transition
  const backgroundHeight = height - BUTTON_AREA_HEIGHT + GRADIENT_OVERLAP;

  // Animation values for subtle UI enhancements
  const buttonScale = useSharedValue(1);

  // Button press animation
  const handleButtonPressIn = () => {
    buttonScale.value = withTiming(0.97, { duration: 120 });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 220 });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Game action handlers
  const handleStartGame = () => {
    triggerHaptic("medium");
    setShowDifficultyModal(true);
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    triggerHaptic("light");
  };

  const handleStartWithDifficulty = () => {
    setShowDifficultyModal(false);
    router.push({
      pathname: "/game",
      params: { difficulty: selectedDifficulty },
    });
  };

  const handleHowToPlayPress = () => {
    triggerHaptic("light");
    setShowHowToPlay(true);
    setShowNavigation(false);
  };

  const handleCloseHowToPlay = () => {
    setShowHowToPlay(false);
    setShowNavigation(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden={true} />

      {/* Background Image - full screen, no title, no overlay */}
      <View style={[styles.backgroundContainer, { height: backgroundHeight }]}>
        <ImageBackground
          source={require("@/assets/images/background/kenrokuen-garden-9511300_1920.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Empty main content area */}
          <View style={[styles.safeArea, { paddingTop: insets.top }]}></View>
        </ImageBackground>
        
        {/* Gradient overlay at the bottom of the background for smooth transition */}
        <LinearGradient
          colors={[
            'transparent',
            theme.isDark ? 'rgba(38, 42, 53, 0.3)' : 'rgba(242, 244, 248, 0.3)',
            theme.isDark ? 'rgba(38, 42, 53, 0.8)' : 'rgba(242, 244, 248, 0.8)',
            theme.isDark ? 'rgba(38, 42, 53, 0.95)' : 'rgba(242, 244, 248, 0.95)',
          ]}
          style={styles.gradientOverlay}
          locations={[0, 0.65, 0.85, 1.0]}
        />
      </View>
      
      {/* Bottom Button Container - Fixed at bottom, no entrance animation */}
      <View 
        style={[
          styles.bottomContainer,
          { paddingBottom: Math.max(insets.bottom, 16) }
        ]}
      >
        {/* Gradient background for bottom container */}
        <LinearGradient
          colors={
            theme.isDark 
              ? ['rgba(45, 55, 72, 0.8)', 'rgba(45, 55, 72, 1)', '#1E293B'] 
              : ['rgba(242, 244, 248, 0.8)', 'rgba(242, 244, 248, 1)', '#F2F4F8']
          }
          style={styles.bottomOverlay}
          locations={[0, 0.42, 1.0]}
        />
        
        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* New Game Button */}
          <Animated.View style={[styles.buttonWrapper, buttonAnimatedStyle]}>
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: colors.primary }]}
              onPress={handleStartGame}
              activeOpacity={0.9}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
            >
              <Text style={styles.startButtonText}>Neues Spiel</Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* How To Play Button */}
          <TouchableOpacity
            style={styles.howToPlayButton}
            onPress={handleHowToPlayPress}
            activeOpacity={0.7}
          >
            <Text 
              style={[
                styles.howToPlayText, 
                { color: theme.isDark ? '#FFFFFF' : '#1A2C42' }
              ]}
            >
              Wie spielt man?
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <DifficultyModal
        visible={showDifficultyModal}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={handleDifficultyChange}
        onClose={() => setShowDifficultyModal(false)}
        onConfirm={handleStartWithDifficulty}
      />

      {showHowToPlay && (
        <HowToPlayModal
          visible={showHowToPlay}
          onClose={handleCloseHowToPlay}
        />
      )}
    </View>
  );
};

// Modern, professional styling with enhanced design elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark background color for any potential gaps
  },
  backgroundContainer: {
    width: '100%',
    position: 'relative',
    // Height is dynamically set to leave space for buttons while overlapping
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  // Gradient overlay for smooth transition
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Taller gradient
    zIndex: 5, // Ensure it's above the background but below the buttons
  },
  // Bottom container - Fixed at bottom with a more premium look
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 36, // More generous curve
    borderTopRightRadius: 36, // More generous curve
    // Enhanced shadow for premium feel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 24,
    // Ensure smooth rendering
    zIndex: 10,
  },
  // Semi-transparent overlay
  bottomOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  // Buttons container with enhanced padding
  buttonsContainer: {
    paddingTop: 32, // More space at the top
    paddingBottom: 20,
    paddingHorizontal: 28, // Wider side padding
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  // Wrapper for animated button with improved layout
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20, // More space between buttons
  },
  // Main "New Game" button with premium styling
  startButton: {
    width: '100%',
    maxWidth: 300, // Slightly wider
    height: 60, // Taller button
    borderRadius: 30, // Perfect semi-circle edges
    overflow: 'hidden',
    // Enhanced shadow for more depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 19, // Slightly larger
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // "How to Play" button with improved styling
  howToPlayButton: {
    paddingVertical: 12, // More touch area
    paddingHorizontal: 20,
    borderRadius: 20, // Subtle rounding
  },
  howToPlayText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2, // Subtle letter spacing
  },
});

export default StartScreen;