// screens/StartScreen/StartScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigation } from "@/utils/NavigationContext";
import { Difficulty } from "@/utils/sudoku";
import DifficultyModal from "@/components/DifficultyModal/DifficultyModal";
import HowToPlayModal from "@/components/HowToPlayModal/HowToPlayModal";
import { triggerHaptic } from "@/utils/haptics";
import { getFilteredLandscapes } from "@/screens/GalleryScreen/utils/landscapes/storage";
import { Landscape } from "@/screens/GalleryScreen/utils/landscapes/types";

const { width, height } = Dimensions.get("window");

// Schlüssel für AsyncStorage
const TUTORIAL_SHOWN_KEY = "@sudoku/tutorial_shown";

const StartScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const { setShowNavigation } = useNavigation();

  // State for background image
  const [backgroundImage, setBackgroundImage] = useState<Landscape | null>(
    null
  );
  const [isLoadingBg, setIsLoadingBg] = useState(true);

  // State for modals and game options
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Neuer State um zu prüfen, ob das Tutorial bereits angezeigt wurde
  const [tutorialChecked, setTutorialChecked] = useState(false);

  // Calculate button area height and overlap for a smoother transition
  const BUTTON_AREA_HEIGHT = 240; // Taller button area for better proportion
  const GRADIENT_OVERLAP = 80; // Larger gradient overlap for smoother transition
  const backgroundHeight = height - BUTTON_AREA_HEIGHT + GRADIENT_OVERLAP;

  // Animation values for subtle UI enhancements
  const buttonScale = useSharedValue(1);

  // Prüfe, ob das Tutorial bereits angezeigt wurde
  useEffect(() => {
    const checkIfTutorialShown = async () => {
      try {
        const tutorialShown = await AsyncStorage.getItem(TUTORIAL_SHOWN_KEY);
        console.log("Tutorial previously shown:", !!tutorialShown);

        // Wenn das Tutorial noch nicht angezeigt wurde, automatisch anzeigen
        if (!tutorialShown) {
          console.log("First app start - showing tutorial");
          setShowHowToPlay(true);
        }
        setTutorialChecked(true);
      } catch (error) {
        console.error("Error checking tutorial status:", error);
        setTutorialChecked(true); // Fehlerbehandlung - trotzdem fortfahren
      }
    };

    checkIfTutorialShown();
  }, []);

  // Load a random favorite or completed landscape when component mounts
  useEffect(() => {
    const loadRandomBackground = async () => {
      setIsLoadingBg(true);
      try {
        // First try to get favorites
        let landscapes = await getFilteredLandscapes("favorites");

        // If no favorites, try completed landscapes
        if (landscapes.length === 0) {
          landscapes = await getFilteredLandscapes("completed");
        }

        // If we have landscapes, pick a random one
        if (landscapes.length > 0) {
          const randomIndex = Math.floor(Math.random() * landscapes.length);
          setBackgroundImage(landscapes[randomIndex]);
        }
      } catch (error) {
        console.error("Error loading background:", error);
      } finally {
        setIsLoadingBg(false);
      }
    };

    loadRandomBackground();
  }, []);

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

  // Get the background image source
  const getBackgroundSource = () => {
    // If we have a backgroundImage from favorites/completed, use it
    if (backgroundImage) {
      return backgroundImage.fullSource;
    }

    // Fallback to default image
    return require("@/assets/imageCollection/sudoku-duo_1920.jpg");
  };

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

  // Tutorial abgeschlossen - merken, dass es angezeigt wurde
  const handleTutorialComplete = async () => {
    try {
      // Tutorial als angezeigt markieren
      await AsyncStorage.setItem(TUTORIAL_SHOWN_KEY, "true");
      console.log("Tutorial marked as shown");
    } catch (error) {
      console.error("Error saving tutorial status:", error);
    }

    // Tutorial Modal schließen
    setShowHowToPlay(false);
    setShowNavigation(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden={true} />

      {/* Background Image - using randomly selected favorites or completed landscapes */}
      <View style={[styles.backgroundContainer, { height: backgroundHeight }]}>
        <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(800)}>
          <ImageBackground
            source={getBackgroundSource()}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            {/* Show loading indicator when background is loading */}
            {isLoadingBg && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            )}

            {/* Empty main content area */}
            <View style={[styles.safeArea, { paddingTop: insets.top }]}></View>
          </ImageBackground>
        </Animated.View>
      </View>

      {/* Bottom Button Container - Erhöhen des z-Index und Abstand zur Unterseite */}
      <View
        style={[
          styles.bottomContainer,
          {
            paddingBottom: Math.max(insets.bottom + 60, 76), // Mehr Abstand nach unten
            zIndex: 15, // Höherer z-Index als die Navbar
          },
        ]}
      >
        {/* Gradient background for bottom container */}
        <LinearGradient
          colors={
            theme.isDark
              ? [
                  "rgba(32, 33, 36, 0.8)", // Halbtransparente Background-Farbe
                  "rgba(41, 42, 45, 1)", // Fast undurchsichtige Surface-Farbe
                  "#35363A", // Solide Card-Farbe als Abschluss
                ]
              : [
                  "rgba(248, 249, 250, 0.8)", // Halbtransparente Background-Farbe
                  "rgba(255, 255, 255, 1)", // Fast undurchsichtige Surface-Farbe
                  "#FFFFFF", // Reines Weiß als Abschluss
                ]
          }
          style={styles.bottomOverlay}
          locations={[0, 0.19, 1.0]}
        />

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* How To Play Button */}
          <TouchableOpacity
            style={styles.howToPlayButton}
            onPress={handleHowToPlayPress}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.howToPlayText,
                { color: theme.isDark ? "#FFFFFF" : "#1A2C42" },
              ]}
            >
              Wie spielt man?
            </Text>
          </TouchableOpacity>

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

      {/* Tutorial Modal with proper callback for first-time users */}
      {tutorialChecked && (
        <HowToPlayModal
          visible={showHowToPlay}
          onClose={handleTutorialComplete}
        />
      )}
    </View>
  );
};

// Modern, professional styling with enhanced design elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A", // Dark background color for any potential gaps
  },
  backgroundContainer: {
    width: "100%",
    position: "relative",
    // Height is dynamically set to leave space for buttons while overlapping
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  // Gradient overlay for smooth transition
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Taller gradient
    zIndex: 5, // Ensure it's above the background but below the buttons
  },
  // Bottom container - Fixed at bottom with a more premium look
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    borderTopLeftRadius: 36, // More generous curve
    borderTopRightRadius: 36, // More generous curve
    // Enhanced shadow for premium feel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 24,
    // Ensure smooth rendering - Wir erhöhen den z-Index
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
    width: "100%",
    alignItems: "center",
    marginBottom: 0, // More space between buttons
  },
  // Main "New Game" button with premium styling
  startButton: {
    width: "100%",
    maxWidth: 300, // Slightly wider
    height: 60, // Taller button
    borderRadius: 30, // Perfect semi-circle edges
    overflow: "hidden",
    // Enhanced shadow for more depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 20,
    marginTop: -15,
  },
  howToPlayText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2, // Subtle letter spacing
  },
});

export default StartScreen;
