// screens/StartScreen/StartScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigation } from "@/utils/NavigationContext"; // Import des NavigationContext
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
  const { setShowNavigation } = useNavigation(); // Zugriff auf den NavigationContext

  // State for modals and game options
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Animation values - keep these for interactive animations
  const titleGlow = useSharedValue(0.3);
  const buttonScale = useSharedValue(1);
  const buttonGlow = useSharedValue(0.3);
  const floatingY = useSharedValue(0);
  
  // Particle animations
  const particle1 = useSharedValue({ x: 0, y: 0, opacity: 0.7 });
  const particle2 = useSharedValue({ x: 0, y: 0, opacity: 0.5 });
  const particle3 = useSharedValue({ x: 0, y: 0, opacity: 0.6 });

  // Calculate bottom space for navigation
  const bottomNavHeight = 56;
  const contentBottomMargin =
    Platform.OS === "ios"
      ? bottomNavHeight + insets.bottom + 10
      : bottomNavHeight + 10;

  // Start subtle animations on component mount - keep these for visual appeal
  useEffect(() => {
    // Gentle floating animation (no delay)
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-1.5, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.5, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Title glow effect - start immediately
    titleGlow.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Button glow effect - start immediately
    buttonGlow.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Particle animations - keep but start immediately
    const animateParticles = () => {
      // Random movement for particles
      particle1.value = {
        x: Math.random() * 80 - 40,
        y: Math.random() * 80 - 40,
        opacity: 0.4 + Math.random() * 0.3,
      };
      
      particle2.value = {
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        opacity: 0.3 + Math.random() * 0.4,
      };
      
      particle3.value = {
        x: Math.random() * 60 - 30,
        y: Math.random() * 60 - 30,
        opacity: 0.5 + Math.random() * 0.3,
      };
      
      // Continue animation with a shorter initial timeout
      setTimeout(animateParticles, 3000 + Math.random() * 2000);
    };
    
    // Start particle animations immediately
    animateParticles();
  }, []);

  // Animated styles - keep these for interactive elements
  const floatingAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatingY.value }],
    };
  });

  const titleGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: titleGlow.value,
    };
  });

  const buttonGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonGlow.value,
    };
  });

  // Button press animation - keep this for interactivity
  const handleButtonPressIn = () => {
    buttonScale.value = withTiming(0.96, { duration: 100 });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 200 });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  // Particle animations with theme-aware colors
  const particle1Style = useAnimatedStyle(() => {
    const particleColor = theme.isDark ? 
      `${colors.primary}20` : // Primärfarbe im Dark Mode
      'rgba(100, 150, 255, 0.15)'; // Hellblau im Light Mode
      
    return {
      transform: [
        { translateX: withTiming(particle1.value.x, { duration: 3000 }) },
        { translateY: withTiming(particle1.value.y, { duration: 3000 }) },
      ],
      opacity: withTiming(particle1.value.opacity, { duration: 2000 }),
      backgroundColor: particleColor,
    };
  });

  const particle2Style = useAnimatedStyle(() => {
    const particleColor = theme.isDark ? 
      `${colors.primary}15` : // Primärfarbe im Dark Mode
      'rgba(80, 120, 220, 0.12)'; // Mittelblau im Light Mode
      
    return {
      transform: [
        { translateX: withTiming(particle2.value.x, { duration: 4000 }) },
        { translateY: withTiming(particle2.value.y, { duration: 4000 }) },
      ],
      opacity: withTiming(particle2.value.opacity, { duration: 2500 }),
      backgroundColor: particleColor,
    };
  });

  const particle3Style = useAnimatedStyle(() => {
    const particleColor = theme.isDark ? 
      `${colors.primary}18` : // Primärfarbe im Dark Mode
      'rgba(60, 100, 180, 0.14)'; // Dunkelblau im Light Mode
      
    return {
      transform: [
        { translateX: withTiming(particle3.value.x, { duration: 3500 }) },
        { translateY: withTiming(particle3.value.y, { duration: 3500 }) },
      ],
      opacity: withTiming(particle3.value.opacity, { duration: 2200 }),
      backgroundColor: particleColor,
    };
  });

  // Handle initial game button press - show difficulty modal
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

  // Toggle the How To Play modal
  const handleHowToPlayPress = () => {
    triggerHaptic("light");
    setShowHowToPlay(true);
    setShowNavigation(false); // Navigationsleiste ausblenden, wenn der Modal geöffnet wird
  };

  // Handle modal close and show navigation again
  const handleCloseHowToPlay = () => {
    setShowHowToPlay(false);
    setShowNavigation(true); // Navigationsleiste wieder einblenden, wenn der Modal geschlossen wird
  };

  return (
    <View style={styles.container}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      {/* Background with enhanced visuals */}
      <View style={styles.backgroundContainer}>
        {/* Base background image */}
        <Image
          source={require("@/assets/images/background/mountains_blue.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        {/* Modern gradient overlay angepasst an Light/Dark Mode */}
        <LinearGradient
          colors={theme.isDark ? 
            [
              'rgba(10, 20, 35, 0.0)', // Noch dunkler für besseren Kontrast
              'rgba(25, 45, 70, 0.0)',
              'rgba(10, 20, 35, 0.0)'
            ] : 
            [
              'rgba(240, 245, 255, 0.0)', 
              'rgba(220, 230, 245, 0.0)',
              'rgba(240, 245, 255, 0.0)'
            ]
          }
          style={styles.gradientOverlay}
        />
        
        {/* Dynamic light particles */}
        <Animated.View 
          style={[styles.particle, styles.particle1, particle1Style]}
        />
        <Animated.View 
          style={[styles.particle, styles.particle2, particle2Style]}
        />
        <Animated.View 
          style={[styles.particle, styles.particle3, particle3Style]}
        />
      </View>

      {/* Content with safe area padding */}
      <View style={[
        styles.safeArea, 
        { paddingTop: insets.top }
      ]}>
        <View
          style={[
            styles.content,
            { marginBottom: contentBottomMargin }
          ]}
        >
          {/* Title Section with modern styling - removed entrance animations */}
          <Animated.View 
            style={[styles.titleSection, floatingAnimation]}
          >
            {/* Glow behind title */}
            <Animated.View 
              style={[
                styles.titleGlow, 
                { 
                  backgroundColor: theme.isDark ? 
                    `${colors.primary}25` : // Primärfarbe im Dark Mode
                    'rgba(80, 130, 210, 0.2)' // Blauton im Light Mode
                },
                titleGlowStyle
              ]}
            />
            
            {/* SUDOKU Title mit App-Theme-Farbe */}
            <Text style={[
              styles.title,
              { color: colors.primary }
            ]}>
              SUDOKU
            </Text>
            
            
          </Animated.View>

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            {/* New Game Button with glowing effect - removed entry animation */}
            <Animated.View 
              style={[buttonAnimatedStyle, styles.buttonContainer]}
            >
              {/* Button glow effect */}
              <Animated.View 
                style={[
                  styles.buttonGlow, 
                  { 
                    backgroundColor: theme.isDark ? 
                      `${colors.primary}40` : // Primärfarbe im Dark Mode
                      'rgba(70, 120, 200, 0.35)' // Blauton im Light Mode
                  },
                  buttonGlowStyle
                ]} 
              />
              
              {/* Modern glassmorphism button */}
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
            
            {/* How To Play Button with modern styling - removed entry animation */}
            <View
              style={styles.howToPlayContainer}
            >
              <TouchableOpacity
                style={[
                  styles.howToPlayButton,
                  { 
                    backgroundColor: theme.isDark ? 
                      'rgba(60, 80, 120, 0.2)' : 
                      'rgba(255, 255, 255, 0.4)',
                    borderColor: theme.isDark ? 
                      'rgba(60, 80, 120, 0.25)' : 
                      'rgba(255, 255, 255, 0.6)'
                  }
                ]}
                onPress={handleHowToPlayPress}
                activeOpacity={0.7}
              >
                
                <Text style={[
                  styles.howToPlayText,
                  { 
                    color: theme.isDark ? 
                      'rgba(255, 255, 255, 0.95)' : 
                      'rgba(40, 50, 70, 0.9)'
                  }
                ]}>
                  Wie spielt man?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Difficulty Modal */}
      <DifficultyModal
        visible={showDifficultyModal}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={handleDifficultyChange}
        onClose={() => {
          setShowDifficultyModal(false);
        }}
        onConfirm={handleStartWithDifficulty}
        noBackdrop={false}
        isTransition={false}
      />

      {/* How To Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal
          visible={showHowToPlay}
          onClose={handleCloseHowToPlay}
        />
      )}
    </View>
  );
};

// Modern, vibrant styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, 
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
    // opacity is intentionally not set to match DuoScreen
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 72,
    fontWeight: "800",
    letterSpacing: 4,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  // Animated particles
  particle: {
    position: 'absolute',
    borderRadius: 100,
  },
  particle1: {
    width: 100,
    height: 100,
    top: '25%',
    left: '20%',
    filter: 'blur(30px)',
  },
  particle2: {
    width: 120,
    height: 120,
    top: '40%',
    right: '15%',
    filter: 'blur(35px)',
  },
  particle3: {
    width: 80,
    height: 80,
    bottom: '30%',
    left: '30%',
    filter: 'blur(25px)',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  // Title styling
  titleSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
    position: "relative",
  },
  titleGlow: {
    position: "absolute",
    width: 280,
    height: 120,
    borderRadius: 100,
    filter: "blur(30px)",
  },
  titleMaskedView: {
    height: 90,
    width: 300,
  },
  titleMaskContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleMask: {
    fontSize: 72,
    fontWeight: "800",
    letterSpacing: 4,
  },
  titleGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    letterSpacing: 0.5,
  },
  // Button styling
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 20,
  },
  buttonContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  buttonGlow: {
    position: 'absolute',
    width: 280,
    height: 70,
    borderRadius: 35,
    filter: 'blur(15px)',
    top: -5,
    left: '50%',
    transform: [{ translateX: -140 }],
  },
  startButton: {
    width: '100%',
    maxWidth: 280,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // How to play button
  howToPlayContainer: {
    marginTop: 25,
  },
  howToPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  howToPlayText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default StartScreen;