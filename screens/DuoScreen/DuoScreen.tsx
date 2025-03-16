// screens/DuoScreen/DuoScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Difficulty } from "@/utils/sudoku";
import { triggerHaptic } from "@/utils/haptics";
import { BlurView } from "expo-blur";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import styles from "./DuoScreen.styles";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

const DuoScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  
  // Reference to scroll view to enable programmatic scrolling
  const scrollViewRef = React.useRef<ScrollView>(null);
  // Reference to the How It Works section
  const howItWorksRef = React.useRef<View>(null);

  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");

  // Animation values
  const pulseScale = useSharedValue(1);
  const rotateValue = useSharedValue(0);
  const slideValue = useSharedValue(-80);
  const opacityValue = useSharedValue(0.5);
  const scrollIndicatorOpacity = useSharedValue(1);

  // Start animations on component mount
  useEffect(() => {
    // Pulsing animation for CTA button
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite repeat
      true // reverse
    );

    // Subtle rotation animation for VS badge
    rotateValue.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-0.05, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite repeat
      true // reverse
    );

    // Shine effect animation for visualizer
    slideValue.value = withRepeat(
      withDelay(
        1000,
        withTiming(width + 800, {
          duration: 2600,
          easing: Easing.inOut(Easing.ease)
        })
      ),
      -1,
      false
    );

    // Player glow effect
    opacityValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Scroll indicator fade animation
    scrollIndicatorOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  // Animated styles
  const pulseButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const rotateVsStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotateValue.value}rad` },
      { scale: 1 + Math.abs(rotateValue.value) * 4 },
    ],
  }));

  const shineEffectStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideValue.value }],
    opacity: 0.3,
  }));

  const playerGlowStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  const scrollIndicatorStyle = useAnimatedStyle(() => ({
    opacity: scrollIndicatorOpacity.value
  }));

  // Difficulty options with German names for display
  const difficultyLabels: Record<Difficulty, string> = {
    easy: "Leicht",
    medium: "Mittel",
    hard: "Schwer",
    expert: "Experte",
  };

  // Handler for Settings-Button
  const handleSettingsPress = () => {
    triggerHaptic("light");
    router.push("/settings");
  };

  // Handler for Start-Button
  const handleStartGame = () => {
    triggerHaptic("medium");
    setShowDifficultyModal(true);
  };

  // Handler for difficulty selection
  const handleDifficultySelected = (difficulty: Difficulty) => {
    triggerHaptic("light");
    setSelectedDifficulty(difficulty);
  };

  // Handler for starting the game with selected difficulty
  const handleStartWithDifficulty = () => {
    triggerHaptic("medium");
    setShowDifficultyModal(false);

    // Navigate to the duo game with selected difficulty
    router.replace({
      pathname: "/duo-game",
      params: { difficulty: selectedDifficulty },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      {/* Background decorations */}
      <View
        style={[
          styles.backgroundGradient,
          {
            backgroundColor: theme.isDark
              ? colors.primary
              : colors.primaryLight,
          },
        ]}
      />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Settings-Button in top-right corner */}
        <View style={[styles.header, { top: insets.top }]}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: theme.isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.9)",
              },
            ]}
            onPress={handleSettingsPress}
          >
            <Feather
              name="settings"
              size={24}
              color={theme.isDark ? colors.textPrimary : colors.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            paddingBottom: 120, // Extra padding to avoid bottom nav overlap
            minHeight: height - 120, // Ensure content fills the screen
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Title area with icons */}
            <Animated.View
              style={styles.titleContainer}
              entering={FadeInDown.duration(600)}
            >
              <Animated.View
                style={styles.duoLogo}
                entering={FadeIn.delay(300).duration(800)}
              >
                <View
                  style={[
                    styles.logoIconContainer,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Feather name="user" size={24} color="white" />
                </View>
                <View
                  style={[
                    styles.logoIconContainer,
                    { backgroundColor: colors.secondary },
                  ]}
                >
                  <Feather name="user" size={24} color="white" />
                </View>
              </Animated.View>

              <Text
                style={[styles.title, { color: colors.textPrimary }]}
              >
                Sudoku Duo
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.textSecondary, marginTop: 12 }
                ]}
              >
                Sudoku wird zu zweit zum Abenteuer!
              </Text>
            </Animated.View>

            {/* Compact Game visualization */}
            <Animated.View
              style={[styles.gameVisualizerContainer, { height: height * 0.28 }]} // Reduced height
              entering={FadeInDown.delay(200).springify()}
            >
              <View
                style={[
                  styles.gameVisualizer,
                  {
                    backgroundColor: theme.isDark ? colors.surface : "#FFFFFF",
                    borderColor: theme.isDark
                      ? `${colors.primary}30`
                      : `${colors.primary}20`,
                    height: "100%",
                  },
                ]}
              >
                {/* Moving shine effect */}
                <Animated.View style={[styles.shineEffect, shineEffectStyle]} />

                {/* Top player area (Player 2) */}
                <View
                  style={[
                    styles.boardTop,
                    { backgroundColor: `${colors.primary}10` },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.playerGlow,
                      { backgroundColor: colors.primary },
                      playerGlowStyle,
                    ]}
                  />

                  <View style={styles.playerContainer}>
                    <View
                      style={[
                        styles.playerAvatar,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Feather name="user" size={20} color="white" />
                    </View>
                    <Text style={[styles.playerName, { color: colors.textPrimary }]}>
                      Spieler 2
                    </Text>
                  </View>
                </View>

                {/* Bottom player area (Player 1) */}
                <View
                  style={[
                    styles.boardBottom,
                    { backgroundColor: `${colors.secondary}10` },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.playerGlow,
                      { backgroundColor: colors.secondary },
                      playerGlowStyle,
                    ]}
                  />

                  <View style={styles.playerContainer}>
                    <View
                      style={[
                        styles.playerAvatar,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Feather name="user" size={20} color="white" />
                    </View>
                    <Text style={[styles.playerName, { color: colors.textPrimary }]}>
                      Spieler 1
                    </Text>
                  </View>
                </View>

                {/* VS divider */}
                <View
                  style={[
                    styles.divider,
                    {
                      backgroundColor: theme.isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    },
                  ]}
                />

                {/* Animated VS badge */}
                <Animated.View
                  style={[
                    styles.versusContainer,
                    { backgroundColor: colors.primary },
                    rotateVsStyle,
                  ]}
                >
                  <Text style={styles.versusText}>VS</Text>
                </Animated.View>
              </View>
            </Animated.View>

            {/* Start button - Moved up, above the fold */}
            <Animated.View
              style={[styles.ctaContainer, pulseButtonStyle]}
              entering={FadeInUp.delay(300).duration(600)}
            >
              <TouchableOpacity
                style={[
                  styles.ctaButton,
                  {
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                  },
                ]}
                onPress={handleStartGame}
                activeOpacity={0.8}
              >
                <Feather
                  name="play"
                  size={24}
                  color="white"
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.ctaButtonText}>Jetzt spielen</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Scroll Indicator - Now touchable to auto-scroll */}
            <TouchableOpacity
              style={[styles.scrollIndicator]}
              onPress={() => {
                // Weiter nach unten scrollen, um den vollständigen Inhalt zu zeigen
                scrollViewRef.current?.scrollTo({ y: height * 0.9, animated: true });
              }}
            >
              <Animated.View 
                style={[styles.scrollIndicatorContent, scrollIndicatorStyle]}
                entering={FadeIn.delay(1000).duration(400)}
              >
                <Feather name="chevrons-down" size={24} color={colors.textSecondary} />
                <Text style={[styles.scrollHint, { color: colors.textSecondary }]}>
                  Mehr erfahren
                </Text>
              </Animated.View>
            </TouchableOpacity>

            {/* Spacer to ensure content below is initially hidden */}
            <View style={{ height: 200 }} />

            {/* How it works section - Moved below CTA and with ref */}
            <View 
              ref={howItWorksRef}
              style={styles.howItWorksContainer}>
              <Text
                style={[
                  styles.howItWorksTitle,
                  { color: colors.textPrimary },
                ]}
              >
                So funktioniert's:
              </Text>

              <View style={styles.howItWorksList}>
                <Animated.View
                  style={styles.howItWorksItem}
                  entering={FadeInUp.delay(400).duration(400)}
                >
                  <View
                    style={[
                      styles.howItWorksIcon,
                      { backgroundColor: `${colors.primary}15` },
                    ]}
                  >
                    <Feather name="users" size={20} color={colors.primary} />
                  </View>
                  <Text
                    style={[
                      styles.howItWorksText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Zwei Spieler lösen ein Sudoku auf demselben Gerät
                  </Text>
                </Animated.View>

                <Animated.View
                  style={styles.howItWorksItem}
                  entering={FadeInUp.delay(500).duration(400)}
                >
                  <View
                    style={[
                      styles.howItWorksIcon,
                      { backgroundColor: `${colors.secondary}15` },
                    ]}
                  >
                    <Feather name="grid" size={20} color={colors.secondary} />
                  </View>
                  <Text
                    style={[
                      styles.howItWorksText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Spieler 1 löst die untere Hälfte, Spieler 2 die obere
                  </Text>
                </Animated.View>

                <Animated.View
                  style={styles.howItWorksItem}
                  entering={FadeInUp.delay(600).duration(400)}
                >
                  <View
                    style={[
                      styles.howItWorksIcon,
                      { backgroundColor: `${colors.success}15` },
                    ]}
                  >
                    <Feather
                      name="rotate-ccw"
                      size={20}
                      color={colors.success}
                    />
                  </View>
                  <Text
                    style={[
                      styles.howItWorksText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Die Zahlen werden für Spieler 2 gedreht angezeigt
                  </Text>
                </Animated.View>

                <Animated.View
                  style={styles.howItWorksItem}
                  entering={FadeInUp.delay(700).duration(400)}
                >
                  <View
                    style={[
                      styles.howItWorksIcon,
                      { backgroundColor: `${colors.warning}15` },
                    ]}
                  >
                    <Feather name="award" size={20} color={colors.warning} />
                  </View>
                  <Text
                    style={[
                      styles.howItWorksText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Wer zuerst seinen Bereich löst, gewinnt die Runde
                  </Text>
                </Animated.View>
              </View>
            </View>

            {/* Feature cards - Each focused on practical gameplay benefits */}
            <Animated.View
              style={styles.featuresContainer}
              entering={FadeInDown.delay(400).duration(600)}
            >
              <View style={styles.featureCardsContainer}>
                <Animated.View
                  style={[
                    styles.featureCard,
                    {
                      backgroundColor: theme.isDark
                        ? colors.surface
                        : "#FFFFFF",
                      borderLeftColor: colors.success,
                    },
                  ]}
                  entering={FadeInUp.delay(900).duration(400)}
                >
                  <View
                    style={[
                      styles.featureIconContainer,
                      { backgroundColor: `${colors.success}15` },
                    ]}
                  >
                    <Feather
                      name="users"
                      size={24}
                      color={colors.success}
                    />
                  </View>
                  <View style={styles.featureContent}>
                    <Text
                      style={[
                        styles.featureTitle,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Perfekt für Spieleabende
                    </Text>
                    <Text
                      style={[
                        styles.featureDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Fordert euch gegenseitig heraus mit gedrehter Ansicht für
                      Spieler 2 - ideal für jeden Spieltisch!
                    </Text>
                  </View>
                </Animated.View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Difficulty selection modal with BlurView */}
      {showDifficultyModal && (
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: "transparent" }]}
          activeOpacity={1}
          onPress={() => setShowDifficultyModal(false)}
        >
          <BlurView
            intensity={25}
            tint={theme.isDark ? "dark" : "light"}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(0, 0, 0, 0.3)" },
            ]}
          />
          <Animated.View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
            entering={FadeIn.duration(200)}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Schwierigkeit wählen
            </Text>
            <Text
              style={[styles.modalSubtitle, { color: colors.textSecondary }]}
            >
              Wählt gemeinsam einen passenden Schwierigkeitsgrad
            </Text>

            <View
              style={[
                styles.difficultyButtonsContainer,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                },
              ]}
            >
              {/* Difficulty Buttons - Similar to normal mode */}
              {Object.entries(difficultyLabels).map(([diff, label], index) => {
                const diffOption = diff as Difficulty;
                const isSelected = selectedDifficulty === diffOption;

                return (
                  <TouchableOpacity
                    key={diff}
                    style={[
                      styles.difficultyButton,
                      index < Object.keys(difficultyLabels).length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: theme.isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      },
                      isSelected && {
                        backgroundColor: `${colors.primary}15`,
                      },
                    ]}
                    onPress={() => handleDifficultySelected(diffOption)}
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
                      {label}
                    </Text>

                    {isSelected && (
                      <Feather name="check" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Start game button */}
            <TouchableOpacity
              style={[
                styles.modalCTAButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleStartWithDifficulty}
            >
              <Text style={styles.modalCTAText}>Los geht's!</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DuoScreen;