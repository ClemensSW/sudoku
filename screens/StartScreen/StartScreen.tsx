import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Asset } from "expo-asset";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigation } from "@/utils/NavigationContext";
import { Difficulty } from "@/utils/sudoku";
import DifficultyModal from "@/components/DifficultyModal/DifficultyModal";
import HowToPlayModal from "@/components/HowToPlayModal/HowToPlayModal";
import { triggerHaptic } from "@/utils/haptics";
import { getCurrentFavoriteBackground, getNextFavoriteBackground } from "@/screens/GalleryScreen/utils/landscapes/storage";
import { Landscape } from "@/screens/GalleryScreen/utils/landscapes/types";

// Persist across mounts for instant first frame
let preparedNextGlobal: Landscape | null = null;
let lastShownGlobal: Landscape | null = null;

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
  const [backgroundImage, setBackgroundImage] = useState<Landscape | null>(lastShownGlobal || preparedNextGlobal || null);

  // State for modals and game options
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");
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

  //

  // Prüfe, ob das Tutorial bereits angezeigt wurde
  useEffect(() => {
    const checkIfTutorialShown = async () => {
      try {
        const tutorialShown = await AsyncStorage.getItem(TUTORIAL_SHOWN_KEY);
        if (!tutorialShown) {
          setShowHowToPlay(true);
        }
        setTutorialChecked(true);
      } catch (error) {
        console.error("Error checking tutorial status:", error);
        setTutorialChecked(true);
      }
    };

    checkIfTutorialShown();
  }, []);

// Focus/Blur: show prepared image instantly; prepare next on blur
useFocusEffect(
  React.useCallback(() => {
    if (preparedNextGlobal) {
      setBackgroundImage(preparedNextGlobal);
      lastShownGlobal = preparedNextGlobal;
      preparedNextGlobal = null;
    } else if (lastShownGlobal) {
      setBackgroundImage(lastShownGlobal);
    } else {
      (async () => {
        try {
          const cur = await getCurrentFavoriteBackground();
          if (cur) {
            setBackgroundImage(cur);
            lastShownGlobal = cur;
          }
        } catch (e) {
          console.error("Error loading current background on focus:", e);
        }
      })();
    }

    return () => {
      (async () => {
        try {
          const next = await getNextFavoriteBackground();
          if (next) {
            try {
              // @ts-ignore require-Module
              await Asset.fromModule(next.fullSource).downloadAsync();
            } catch {}
            preparedNextGlobal = next;
          }
        } catch (e) {
          console.error("Error preparing next background on blur:", e);
        }
      })();
    };
  }, [])
);

  // Initial: zeige sofort das zuletzt genutzte Favoritenbild (ohne Rotation)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cur = await getCurrentFavoriteBackground();
        if (mounted && cur) setBackgroundImage(cur);
      } catch (e) {
        console.error("Error loading initial background:", e);
      }
    })();
    return () => { mounted = false; };
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

  // (Kein Fallback-Bild mehr) – wir zeigen Platzhalter bis das Favoritenbild geladen ist
// Dadurch entsteht kein sichtbarer Sprung vom Fallback zur Favoritengrafik.

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
    router.push({ pathname: "/game", params: { difficulty: selectedDifficulty } });
  };

  const handleHowToPlayPress = () => {
    triggerHaptic("light");
    setShowHowToPlay(true);
    setShowNavigation(false);
  };

  // Tutorial abgeschlossen - merken, dass es angezeigt wurde
  const handleTutorialComplete = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_SHOWN_KEY, "true");
    } catch (error) {
      console.error("Error saving tutorial status:", error);
    }

    setShowHowToPlay(false);
    setShowNavigation(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden={true} />

      {/* Background Image */}
      <View style={[styles.backgroundContainer, { height: backgroundHeight }]}>
        {backgroundImage ? (
          <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(120)}>
            <ImageBackground
              source={backgroundImage.fullSource}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              <View style={[styles.safeArea, { paddingTop: insets.top }]} />
            </ImageBackground>
          </Animated.View>
        ) : (
          // Neutral placeholder to avoid any fallback image flash on cold start
          <View style={styles.backgroundImage} />
        )}
      </View>

      {/* Bottom Button Container */}
      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: Math.max(insets.bottom + 60, 76), zIndex: 15 },
        ]}
      >
        <LinearGradient
          colors={
            theme.isDark
              ? ["rgba(32, 33, 36, 0.8)", "rgba(41, 42, 45, 1)", "#35363A"]
              : ["rgba(248, 249, 250, 0.8)", "rgba(255, 255, 255, 1)", "#FFFFFF"]
          }
          style={styles.bottomOverlay}
          locations={[0, 0.19, 1.0]}
        />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.howToPlayButton} onPress={handleHowToPlayPress} activeOpacity={0.7}>
            <Text style={[styles.howToPlayText, { color: theme.isDark ? "#FFFFFF" : "#1A2C42" }]}>
              Wie spielt man?
            </Text>
          </TouchableOpacity>

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

      {tutorialChecked && (
        <HowToPlayModal visible={showHowToPlay} onClose={handleTutorialComplete} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  backgroundContainer: { width: "100%", position: "relative" },
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
    safeArea: { flex: 1, alignItems: "center", justifyContent: "flex-start" },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 24,
    zIndex: 10,
  },
  bottomOverlay: { ...StyleSheet.absoluteFillObject, borderTopLeftRadius: 36, borderTopRightRadius: 36 },
  buttonsContainer: { paddingTop: 32, paddingBottom: 20, paddingHorizontal: 28, alignItems: "center", justifyContent: "center", width: "100%" },
  buttonWrapper: { width: "100%", alignItems: "center", marginBottom: 0 },
  startButton: {
    width: "100%",
    maxWidth: 300,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: { color: "#FFFFFF", fontSize: 19, fontWeight: "700", letterSpacing: 0.5 },
  howToPlayButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20, marginBottom: 20, marginTop: -15 },
  howToPlayText: { fontSize: 16, fontWeight: "600", letterSpacing: 0.2 },
});

export default StartScreen;