import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, BackHandler, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigation } from "@/contexts/navigation";
import { Difficulty } from "@/utils/sudoku";
import { GameStats } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useLandscapes } from "@/screens/Gallery/hooks/useLandscapes";
import { useSupporter } from "@/modules/subscriptions/hooks/useSupporter";

// zentralisierte XP-Berechnung
import { calculateXpGain } from "./components/PlayerProgressionCard/utils";
import { useLevelInfo } from "./components/PlayerProgressionCard/utils/useLevelInfo";
import { useProgressColor } from "@/hooks/useProgressColor";

// Components - NEW REFACTORED STRUCTURE
import LevelCard from "./components/LevelCard";
import PathCard from "./components/PathCard";
import GalleryProgressCard from "./components/GalleryProgressCard";
import { CurrentStreakCard } from "./components/StreakCard/components";
import PerformanceCard from "./components/PerformanceCard/PerformanceCard";
import FeedbackCard from "./components/FeedbackCard";
import ConfettiEffect from "./components/ConfettiEffect/ConfettiEffect";
import Button from "@/components/Button/Button";

// Styles
import styles from "./GameCompletion.styles";

// Profil-Funktionen (NEU)
import { loadUserProfile, updateUserTitle } from "@/utils/profileStorage";

interface GameCompletionScreenProps {
  visible: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onContinue: () => void;
  timeElapsed: number;
  difficulty: Difficulty;
  autoNotesUsed: boolean;
  stats?: GameStats | null;
}

// Helper
const isNewRecord = (
  timeElapsed: number,
  stats: GameStats | null,
  difficulty: Difficulty,
  autoNotesUsed: boolean
): boolean => {
  if (autoNotesUsed || !stats) return false;

  const bestTimeKey = `bestTime${
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  }` as keyof GameStats;
  const previousBestTime = stats[bestTimeKey] as number;

  return (
    timeElapsed < previousBestTime &&
    previousBestTime !== 0 &&
    previousBestTime !== Infinity
  );
};


const GameCompletion: React.FC<GameCompletionScreenProps> = ({
  visible,
  onClose,
  onNewGame,
  onContinue,
  timeElapsed,
  difficulty,
  autoNotesUsed,
  stats,
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { hideBottomNav, resetBottomNav } = useNavigation();

  // Supporter Hook für EP-Multiplikator
  const { epMultiplier } = useSupporter();

  // Landscape Integration
  const {
    currentLandscape,
    clearUnlockEvent,
    getLastUnlockEvent,
  } = useLandscapes();

  // NEU: Titel-State fürs Modal (Level-Index, sprachunabhängig)
  const [selectedTitleIndex, setSelectedTitleIndex] = useState<number | null>(null);

  // State für Unlock-UI
  const [newlyUnlockedSegmentId, setNewlyUnlockedSegmentId] = useState<number | undefined>(undefined);
  const [landscapeCompleted, setLandscapeCompleted] = useState(false);

  // Navigation: Hide bottom nav when modal is visible
  useEffect(() => {
    if (visible) {
      hideBottomNav();
    }
    return () => {
      resetBottomNav();
    };
  }, [visible, hideBottomNav, resetBottomNav]);

  // Beim Öffnen: Profil laden (Titel) + evtl. letztes Unlock-Event anzeigen (parallelisiert)
  useEffect(() => {
    if (!visible) return;

    let mounted = true;

    // Profile load immediately, unlock event after delay
    (async () => {
      try {
        // Load profile immediately
        const profilePromise = loadUserProfile();

        // Delay unlock event check
        const unlockEventPromise = new Promise<void>((resolve) => {
          setTimeout(async () => {
            try {
              const event = await getLastUnlockEvent();
              // TS-Fix: diskriminiere über vorhandenes Feld statt „type"
              if (event && typeof event === "object" && mounted) {
                if ("segmentIndex" in event && typeof (event as any).segmentIndex === "number") {
                  setNewlyUnlockedSegmentId((event as any).segmentIndex);
                } else {
                  setLandscapeCompleted(true);
                }
              }
            } catch (e) {
              console.error("getLastUnlockEvent failed", e);
            }
            resolve();
          }, 500);
        });

        // Wait for profile (immediately)
        const p = await profilePromise;
        if (mounted) setSelectedTitleIndex(p.titleLevelIndex ?? null);

        // Unlock event will resolve on its own schedule
        await unlockEventPromise;
      } catch (e) {
        console.error("loadUserProfile failed", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [visible, getLastUnlockEvent]);

  // Bei Schließen: Unlock-Status zurücksetzen
  useEffect(() => {
    if (!visible) {
      setNewlyUnlockedSegmentId(undefined);
      setLandscapeCompleted(false);
      clearUnlockEvent();
    }
  }, [visible, clearUnlockEvent]);

  // Titel speichern (persist) - verwendet Level-Index
  const handleTitleSelect = async (levelIndex: number | null) => {
    try {
      await updateUserTitle(levelIndex);
      setSelectedTitleIndex(levelIndex);
    } catch (e) {
      console.error("updateUserTitle failed", e);
    }
  };

  // XP-Gewinn für dieses Spiel
  const xpGain = calculateXpGain(difficulty, timeElapsed, autoNotesUsed);

  // Level Info für Pfad-Farbe (reaktiv)
  const currentXP = stats ? stats.totalXP : 0;
  const levelInfo = useLevelInfo(currentXP);
  const pathColor = useProgressColor();

  // Animation values
  const modalScale = useSharedValue(0.95);
  const modalOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  const newRecord = isNewRecord(timeElapsed, stats || null, difficulty, autoNotesUsed);

  // Android Back-Button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (visible) {
        onContinue();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [visible, onContinue]);

  // Start-Animationen
  useEffect(() => {
    if (!visible) return;

    modalScale.value = 0.95;
    modalOpacity.value = 0;
    contentOpacity.value = 0;

    modalScale.value = withTiming(1, { duration: 350, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    modalOpacity.value = withTiming(1, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });

    const t = setTimeout(() => {
      contentOpacity.value = withTiming(1, { duration: 500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    }, 200);

    return () => clearTimeout(t);
  }, [visible]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  // Navigation Handler
  const handleViewGallery = () => {
    onClose();
    setTimeout(() => {
      router.push("/gallery");
    }, 300);
  };

  const handleNewGame = () => {
    onClose();
    setTimeout(() => {
      router.replace({ pathname: "/game", params: { difficulty } });
    }, 200);
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor: colors.background,
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            borderRadius: 0,
          },
          modalAnimatedStyle,
        ]}
      >

        {/* Inhalte */}
        <ScrollView
          style={{ width: "100%", flex: 1 }}
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: 240 }]}
          showsVerticalScrollIndicator
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          initialNumToRender={3}
          windowSize={5}
        >
          <Animated.View
            style={contentAnimatedStyle}
            shouldRasterizeIOS={true}
            renderToHardwareTextureAndroid={true}
          >
            {/* Hero Header - now inside ScrollView */}
            <View style={styles.heroHeaderInScroll}>
              <LinearGradient
                colors={
                  theme.isDark
                    ? [colors.card, colors.background]
                    : [colors.surface, colors.background]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.heroGradient}
              >
                {/* Animated Success Icon with Glow - Dynamic Path Color */}
                <View style={styles.heroIconWrapper}>
                  <View style={[
                    styles.iconGlow,
                    { backgroundColor: `${pathColor}40` } // 25% opacity in hex
                  ]} />
                  <View style={[
                    styles.iconGlowOuter,
                    { backgroundColor: `${pathColor}20` } // 12% opacity in hex
                  ]} />
                  <Feather name="check-circle" size={64} color={pathColor} />
                </View>

                {/* Main Title */}
                <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                  {t('header.title')}
                </Text>

                {/* Subtitle */}
                <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                  {t('header.subtitle')}
                </Text>

                {/* Record Badge - Floating */}
                {newRecord && (
                  <View style={styles.recordFloatingBadge}>
                    <LinearGradient
                      colors={theme.isDark ? ['#FAD165', '#E6B800'] : ['#FBBC05', '#F9AB00']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.recordGradient}
                    >
                      <Feather name="award" size={20} color={theme.isDark ? '#202124' : 'white'} style={{ marginRight: 8 }} />
                      <Text style={[styles.recordFloatingText, { color: theme.isDark ? '#202124' : 'white' }]}>{t('header.newRecord')}</Text>
                    </LinearGradient>
                  </View>
                )}
              </LinearGradient>
            </View>

            {/* Cards Container with Padding */}
            <View style={styles.cardsContainer}>
            {/* LevelCard - Independent with scoped LevelUpOverlay ✅ */}
            {stats && !autoNotesUsed && (
              <>
                <LevelCard
                  stats={stats}
                  difficulty={difficulty}
                  justCompleted={true}
                  xpGain={xpGain}
                  epMultiplier={epMultiplier}
                  selectedTitleIndex={selectedTitleIndex}
                  onTitleSelect={handleTitleSelect}
                />
                <View style={styles.sectionSpacer} />
              </>
            )}

            {/* PathCard - Independent */}
            {stats && !autoNotesUsed && (
              <>
                <PathCard
                  stats={stats}
                  justCompleted={true}
                  xpGain={xpGain}
                  showPathDescription={true}
                />
                <View style={styles.sectionSpacer} />
              </>
            )}

            {/* GalleryProgressCard - Renamed from PuzzleProgress */}
            {!autoNotesUsed && currentLandscape && (
              <>
                <GalleryProgressCard
                  landscape={currentLandscape}
                  newlyUnlockedSegmentId={newlyUnlockedSegmentId}
                  isComplete={landscapeCompleted}
                  onViewGallery={handleViewGallery}
                  stats={stats}
                />
                <View style={styles.sectionSpacer} />
              </>
            )}

            {/* CurrentStreakCard - Daily Streak System with Calendar */}
            {stats && stats.dailyStreak && !autoNotesUsed && (
              <>
                <CurrentStreakCard
                  currentStreak={stats.dailyStreak.currentStreak}
                  longestStreak={stats.dailyStreak.longestDailyStreak}
                  playHistory={stats.dailyStreak.playHistory}
                  firstLaunchDate={stats.dailyStreak.firstLaunchDate}
                />
                <View style={styles.sectionSpacer} />
              </>
            )}

            {/* PerformanceCard - No changes */}
            <PerformanceCard
              timeElapsed={timeElapsed}
              previousBestTime={
                stats
                  ? (stats[
                      `bestTime${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}` as keyof GameStats
                    ] as number)
                  : Infinity
              }
              isNewRecord={newRecord}
              autoNotesUsed={autoNotesUsed}
            />

            <View style={styles.sectionSpacer} />

            {/* FeedbackCard - Renamed from FeedbackMessage */}
            <FeedbackCard
              difficulty={difficulty}
              timeElapsed={timeElapsed}
              isNewRecord={newRecord}
              autoNotesUsed={autoNotesUsed}
              streak={stats?.currentStreak || 0}
            />

            {autoNotesUsed && <View style={[styles.separator, { backgroundColor: colors.warning }]} />}
            </View>
            {/* End Cards Container */}
          </Animated.View>
        </ScrollView>

        {/* Buttons unten fixiert - Modern Glass Effect */}
        <View
          style={[
            styles.buttonContainer,
            {
              backgroundColor: theme.isDark
                ? `${colors.background}F2` // 95% opacity for glass effect
                : `${colors.card}F2`,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: theme.isDark
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.08)",
            },
          ]}
        >
          <Button
            title={t('buttons.nextGame')}
            onPress={handleNewGame}
            variant="primary"
            customColor={pathColor}
            style={styles.primaryButton}
            icon={<Feather name="play" size={22} color="white" />}
            iconPosition="left"
          />

          <Button
            title={t('buttons.backToMenu')}
            onPress={onContinue}
            variant="outline"
            customColor={pathColor}
            style={styles.secondaryButton}
          />
        </View>
      </Animated.View>

      {/* Confetti overlay - outside interactive content */}
      <ConfettiEffect isActive={visible} />
    </View>
  );
};

export default GameCompletion;
