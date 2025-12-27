// screens/Duo/Duo.tsx
import React, { useState, useCallback, useRef } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { Difficulty } from "@/utils/sudoku";

// Components
import DevBanner from "./components/DevBanner";
import PlayerStatsHero from "./components/PlayerStatsHero";
import GameModeCard from "./components/GameModeCard";
import LeaderboardCard from "./components/LeaderboardCard";
import MatchHistoryCard from "./components/MatchHistoryCard";
import DuoTutorialOverlay from "./components/DuoTutorialOverlay";
import DifficultyModal from "@/components/DifficultyModal/DifficultyModal";

import styles from "./Duo.styles";

// Dummy stats for display (later: real stats from Firestore)
const DUMMY_STATS = {
  elo: 1247,
  wins: 12,
  losses: 3,
};

const Duo: React.FC = () => {
  const { t } = useTranslation("duo");
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  // State
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [showTutorialOverlay, setShowTutorialOverlay] = useState(false);
  const [leaderboardY, setLeaderboardY] = useState(0);

  // Handler: Tutorial-Overlay öffnen
  const handleTutorialPress = useCallback(() => {
    triggerHaptic("light");
    setShowTutorialOverlay(true);
  }, []);

  // Handler: Tutorial-Overlay schließen
  const handleCloseTutorial = useCallback(() => {
    setShowTutorialOverlay(false);
  }, []);

  // Handler: Scroll to LeaderboardCard
  const handleLeaderboardPress = useCallback(() => {
    if (scrollViewRef.current && leaderboardY > 0) {
      scrollViewRef.current.scrollTo({
        y: leaderboardY - 16, // Small offset for better visibility
        animated: true,
      });
    }
  }, [leaderboardY]);

  // Handler: Lokal spielen → DifficultyModal öffnen
  const handleLocalPlay = useCallback(() => {
    triggerHaptic("medium");
    setShowDifficultyModal(true);
  }, []);

  // Handler: Online spielen → zur OnlinePlayMenu navigieren
  const handleOnlinePlay = useCallback(() => {
    triggerHaptic("medium");
    router.push("/duo-online/play");
  }, [router]);

  // Handler: Difficulty ändern
  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  }, []);

  // Handler: Spiel starten
  const handleStartGame = useCallback(() => {
    setShowDifficultyModal(false);
    router.replace({
      pathname: "/duo-game",
      params: { difficulty: selectedDifficulty },
    });
  }, [selectedDifficulty, router]);

  // Handler: Modal schließen
  const handleCloseDifficultyModal = useCallback(() => {
    setShowDifficultyModal(false);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      {/* Dev Banner */}
      <DevBanner />

      {/* Backdrop für Modal */}
      {showDifficultyModal && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.backdropColor, zIndex: 100 },
          ]}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        />
      )}

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Player Stats */}
        <PlayerStatsHero
          elo={DUMMY_STATS.elo}
          wins={DUMMY_STATS.wins}
          losses={DUMMY_STATS.losses}
          onTutorialPress={handleTutorialPress}
          onLeaderboardPress={handleLeaderboardPress}
        />

        {/* Game Mode Cards */}
        <View style={styles.gameModeSection}>
          <GameModeCard mode="local" onPress={handleLocalPlay} />
          <GameModeCard mode="online" onPress={handleOnlinePlay} />
        </View>

        {/* Leaderboard Card */}
        <View onLayout={(e) => setLeaderboardY(e.nativeEvent.layout.y)}>
          <LeaderboardCard />
        </View>

        {/* Match History */}
        <MatchHistoryCard />
      </ScrollView>

      {/* Tutorial Overlay */}
      <DuoTutorialOverlay
        visible={showTutorialOverlay}
        onClose={handleCloseTutorial}
      />

      {/* Difficulty Modal */}
      <DifficultyModal
        visible={showDifficultyModal}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={handleDifficultyChange}
        onClose={handleCloseDifficultyModal}
        onConfirm={handleStartGame}
        noBackdrop
        isTransition
        isDuoMode
        title={t("startSection.title")}
        subtitle={t("startSection.subtitle")}
      />
    </View>
  );
};

export default Duo;
