// screens/Duo/Duo.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet, Pressable, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut, FadeInDown } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useCurrentLeague } from "@/hooks/useCurrentLeague";
import { useDevLeague } from "@/contexts/DevLeagueContext";
import { triggerHaptic } from "@/utils/haptics";
import { loadStats } from "@/utils/storage";
import { Difficulty } from "@/utils/sudoku";

// Components
import DuoStatsBar from "./components/DuoStatsBar";
import PlayerStatsHero from "./components/PlayerStatsHero";
import LeaderboardCard from "./components/LeaderboardCard";
import MatchHistoryCard from "./components/MatchHistoryCard";
import DuoTutorialOverlay from "./components/DuoTutorialOverlay";
import DevLeagueToggle from "./components/DevLeagueToggle";
import DifficultyModal from "@/components/DifficultyModal/DifficultyModal";

import styles from "./Duo.styles";

// Dummy stats for display (later: real stats from Firestore)
const DUMMY_STATS = {
  elo: 1247,
};

const Duo: React.FC = () => {
  const { t } = useTranslation("duo");
  const router = useRouter();
  const theme = useTheme();
  const { colors, typography, isDark } = theme;
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors: leagueColors } = useCurrentLeague();
  const devLeague = useDevLeague();
  const onlineFeaturesEnabled = devLeague?.onlineFeaturesEnabled ?? false;

  // State
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [showTutorialOverlay, setShowTutorialOverlay] = useState(false);
  const [leaderboardY, setLeaderboardY] = useState(0);

  // Stats for DuoStatsBar
  const [currentStreak, setCurrentStreak] = useState(0);
  const [gameStats, setGameStats] = useState({ wins: 0, losses: 0 });

  // Load stats
  useEffect(() => {
    const loadData = async () => {
      try {
        const stats = await loadStats();
        setCurrentStreak(stats.dailyStreak?.currentStreak || 0);
        setGameStats({
          wins: stats.gamesWon || 0,
          losses: (stats.gamesPlayed || 0) - (stats.gamesWon || 0),
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadData();
  }, []);

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
        y: leaderboardY - 16,
        animated: true,
      });
    }
  }, [leaderboardY]);

  // Handler: Navigate to Erfolge tab on record press
  const handleRecordPress = useCallback(() => {
    triggerHaptic("light");
    router.push("/leistung?tab=times");
  }, [router]);

  // Handler: Navigate to Serie tab on streak press
  const handleStreakPress = useCallback(() => {
    triggerHaptic("light");
    router.push("/leistung?tab=streak");
  }, [router]);

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

      {/* Pinned Stats Bar - Fixed at top */}
      <DuoStatsBar
        elo={DUMMY_STATS.elo}
        wins={gameStats.wins}
        losses={gameStats.losses}
        currentStreak={currentStreak}
        onEloPress={handleLeaderboardPress}
        onRecordPress={handleRecordPress}
        onStreakPress={handleStreakPress}
      />

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
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Simplified Hero Section (just icon + title) */}
        <PlayerStatsHero onTutorialPress={handleTutorialPress} />

        {/* Game Mode Buttons */}
        <Animated.View
          style={styles.actionButtonsRow}
          entering={FadeInDown.duration(400).delay(200)}
        >
          <Pressable
            onPress={handleLocalPlay}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: colors.surface,
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
                shadowColor: isDark ? "transparent" : leagueColors.accent,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.actionButtonText,
                { color: colors.textPrimary, fontSize: typography.size.md },
              ]}
            >
              {t("gameModeModal.local.title", { defaultValue: "Lokal spielen" })}
            </Text>
          </Pressable>

          <Pressable
            onPress={onlineFeaturesEnabled ? handleOnlinePlay : undefined}
            disabled={!onlineFeaturesEnabled}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: colors.surface,
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
                shadowColor: isDark ? "transparent" : leagueColors.accent,
                opacity: !onlineFeaturesEnabled ? 0.6 : pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.actionButtonText,
                {
                  color: !onlineFeaturesEnabled
                    ? colors.textSecondary
                    : colors.textPrimary,
                  fontSize: typography.size.md,
                },
              ]}
            >
              {t("gameModeModal.online.title", { defaultValue: "Online spielen" })}
            </Text>
            {/* Coming Soon Badge */}
            {!onlineFeaturesEnabled && (
              <View
                style={[
                  styles.comingSoonBadge,
                  {
                    backgroundColor: isDark
                      ? "rgba(60, 130, 145, 0.9)"
                      : "rgba(46, 107, 123, 0.9)",
                  },
                ]}
              >
                <Feather name="clock" size={10} color="#FFFFFF" />
                <Text style={styles.comingSoonText}>
                  {t("comingSoonShort", { defaultValue: "BALD" })}
                </Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* Leaderboard Card */}
        <View onLayout={(e) => setLeaderboardY(e.nativeEvent.layout.y)}>
          <LeaderboardCard />
        </View>

        {/* Match History */}
        <MatchHistoryCard />

        {/* Dev League Toggle (only in DEV mode) */}
        <DevLeagueToggle />
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
