// screens/DuoScreen/DuoScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { Difficulty } from "@/utils/sudoku";

import DuoBoardVisualizer from "./components/DuoBoardVisualizer/DuoBoardVisualizer";
import ScrollIndicator from "./components/ScrollIndicator/ScrollIndicator";
import DuoFeatures from "./components/DuoFeatures/DuoFeatures";
import DifficultyModal from "../../components/DifficultyModal/DifficultyModal";
import GameModeModal, { GameMode } from "../../components/GameModeModal";
import { useAlert } from "@/components/CustomAlert/AlertProvider";

import styles from "./DuoScreen.styles";

const { height, width } = Dimensions.get("window");

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

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: { alignItems: "flex-start" },
  title: { fontSize: 28, fontWeight: "800" },
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
  const scrollViewRef = useRef<ScrollView>(null);

  const [showGameModeModal, setShowGameModeModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [selectedMode, setSelectedMode] = useState<GameMode>("local");
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  const maxVisualizer = Math.min(width * 0.88, 340);
  const visualizerSize = Math.max(260, Math.round(maxVisualizer));

  const navHeight = 56;
  const mainScreenHeight = height - insets.top - insets.bottom - navHeight;

  const scrollToFeatures = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: height - navHeight - 100,
        animated: true,
      });
    }
  };

  const handleDifficultyChange = (difficulty: Difficulty) =>
    setSelectedDifficulty(difficulty);

  const handleStartGame = () => {
    setIsAnyModalOpen(true);
    setShowGameModeModal(true);
    triggerHaptic("medium");
  };

  const handleModeSelection = (mode: GameMode) => {
    setSelectedMode(mode);
    triggerHaptic("medium");
    if (mode === "local") {
      setShowGameModeModal(false);
      setTimeout(() => setShowDifficultyModal(true), 100);
    } else {
      setShowGameModeModal(false);
      setIsAnyModalOpen(false);
      showAlert({
        title: "In Entwicklung",
        message:
          "Der Online-Modus wird derzeit entwickelt und steht in Kürze zur Verfügung. Bleib gespannt!",
        type: "info",
        buttons: [{ text: "OK", style: "primary" }],
      });
    }
  };

  const handleStartWithDifficulty = () => {
    setShowDifficultyModal(false);
    setIsAnyModalOpen(false);
    router.replace({
      pathname: "/duo-game",
      params: { difficulty: selectedDifficulty },
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.isDark ? "#1A202C" : colors.background },
      ]}
    >
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />
      <Image
        source={require("@/assets/images/background/mountains_blue.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {isAnyModalOpen && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.backdropColor, zIndex: 100 },
          ]}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        />
      )}

      <View style={{ flex: 1 }}>
        <SimpleDuoHeader paddingTop={insets.top} />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.mainScreen,
              { height: mainScreenHeight, justifyContent: "space-between" },
            ]}
          >
            {/* Overlay-Visualizer füllt die ganze Main-Section */}
            <View style={styles.overlayLayer}>
              <DuoBoardVisualizer
                size={visualizerSize}
                stageWidth={width}
                stageHeight={mainScreenHeight}
                noAnimation={isAnyModalOpen}
                interactive={!isAnyModalOpen}
                renderTopVignette={!theme.isDark}
                isDark={theme.isDark}
                onLogoPress={handleStartGame}
                performance="balanced" // oder "low" auf schwächeren Devices
              />
            </View>

            {/* spacer */}
            <View style={{ height: 20 }} />

            {/* Kein Button mehr; Logo tappt sich durch */}
            <View style={styles.centralContentContainer} />

            <View style={styles.scrollIndicatorContainer}>
              <ScrollIndicator onPress={scrollToFeatures} noAnimation />
            </View>
          </View>

          <View style={styles.featuresScreen}>
            <DuoFeatures onStartGame={handleStartGame} noAnimation />
          </View>
        </ScrollView>
      </View>

      <DifficultyModal
        visible={showDifficultyModal}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={handleDifficultyChange}
        onClose={() => {
          setShowDifficultyModal(false);
          setIsAnyModalOpen(false);
        }}
        onConfirm={handleStartWithDifficulty}
        noBackdrop
        isTransition
        isDuoMode
        title="Neues Spiel"
        subtitle="Wählt gemeinsam den Schwierigkeitsgrad"
      />

      <GameModeModal
        visible={showGameModeModal}
        onClose={() => {
          setShowGameModeModal(false);
          setIsAnyModalOpen(false);
        }}
        onSelectMode={handleModeSelection}
        noBackdrop
      />
    </View>
  );
};

export default DuoScreen;
