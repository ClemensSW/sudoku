import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, BackHandler } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import { GameStats } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useLandscapes } from "@/screens/GalleryScreen/hooks/useLandscapes";
import { PuzzleProgress } from "@/screens/GalleryScreen/components/LandscapeCollection";

// zentralisierte XP-Berechnung
import { calculateXpGain } from "./components/LevelProgress/utils/levelData";

// Components
import PerformanceCard from "./components/PerformanceCard/PerformanceCard";
import StreakDisplay from "./components/StreakDisplay/StreakDisplay";
import LevelProgress from "./components/LevelProgress/LevelProgress";
import FeedbackMessage from "./components/FeedbackMessage/FeedbackMessage";
import ConfettiEffect from "./components/ConfettiEffect/ConfettiEffect";
import Button from "@/components/Button/Button";

// Styles
import styles from "./GameCompletionModal.styles";

// Profil-Funktionen (NEU)
import { loadUserProfile, updateUserTitle } from "@/utils/profileStorage";

interface GameCompletionModalProps {
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

const getDifficultyName = (diff: Difficulty): string => {
  const difficultyNames: Record<Difficulty, string> = {
    easy: "Leicht",
    medium: "Mittel",
    hard: "Schwer",
    expert: "Experte",
  };
  return difficultyNames[diff];
};

const getDifficultyColor = (diff: Difficulty): string => {
  const difficultyColors: Record<Difficulty, string> = {
    easy: "#35363A",
    medium: "#35363A",
    hard: "#35363A",
    expert: "#35363A",
  };
  return difficultyColors[diff];
};

const GameCompletionModal: React.FC<GameCompletionModalProps> = ({
  visible,
  onClose,
  onNewGame,
  onContinue,
  timeElapsed,
  difficulty,
  autoNotesUsed,
  stats,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const router = useRouter();

  // Landscape Integration
  const {
    currentLandscape,
    clearUnlockEvent,
    getLastUnlockEvent,
  } = useLandscapes();

  // NEU: Titel-State fürs Modal
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  // State für Unlock-UI
  const [newlyUnlockedSegmentId, setNewlyUnlockedSegmentId] = useState<number | undefined>(undefined);
  const [landscapeCompleted, setLandscapeCompleted] = useState(false);

  // Beim Öffnen: Profil laden (Titel) + evtl. letztes Unlock-Event anzeigen
  useEffect(() => {
    if (!visible) return;

    let mounted = true;

    (async () => {
      try {
        const p = await loadUserProfile();
        if (mounted) setSelectedTitle(p.title ?? null);
      } catch (e) {
        console.error("loadUserProfile failed", e);
      }
    })();

    const timer = setTimeout(async () => {
      try {
        const event = await getLastUnlockEvent();
        // TS-Fix: diskriminiere über vorhandenes Feld statt „type“
        if (event && typeof event === "object") {
          if ("segmentIndex" in event && typeof (event as any).segmentIndex === "number") {
            setNewlyUnlockedSegmentId((event as any).segmentIndex);
          } else {
            setLandscapeCompleted(true);
          }
        }
      } catch (e) {
        console.error("getLastUnlockEvent failed", e);
      }
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timer);
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

  // Titel speichern (persist)
  const handleTitleSelect = async (title: string | null) => {
    try {
      await updateUserTitle(title);
      setSelectedTitle(title);
    } catch (e) {
      console.error("updateUserTitle failed", e);
    }
  };

  // XP-Gewinn für dieses Spiel
  const xpGain = calculateXpGain(difficulty, timeElapsed, autoNotesUsed);

  // Animation values
  const modalScale = useSharedValue(0.95);
  const modalOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  const newRecord = isNewRecord(timeElapsed, stats || null, difficulty, autoNotesUsed);

  const gradientStart = getDifficultyColor(difficulty);

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
        <ConfettiEffect isActive={visible} />

        <LinearGradient
          colors={[gradientStart, theme.isDark ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.8 }}
          style={styles.headerGradient}
        />

        {/* Titelbereich */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Glückwunsch!</Text>

          {newRecord && (
            <View style={[styles.difficultyBadge, { backgroundColor: colors.success }]}>
              <Feather name="award" size={16} color="white" style={{ marginRight: 6 }} />
              <Text style={styles.difficultyText}>Neuer Rekord!</Text>
            </View>
          )}

          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) }]}>
            <Text style={styles.difficultyText}>{getDifficultyName(difficulty)}</Text>
          </View>
        </View>

        {/* Inhalte */}
        <ScrollView
          style={{ width: "100%", flex: 1 }}
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: 240 }]}
          showsVerticalScrollIndicator
        >
          <Animated.View style={contentAnimatedStyle}>
            {/* LevelProgress mit Titel-Props */}
            {stats && !autoNotesUsed && (
              <>
                <LevelProgress
                  stats={stats}
                  difficulty={difficulty}
                  justCompleted={true}
                  xpGain={xpGain}
                  selectedTitle={selectedTitle}
                  onTitleSelect={handleTitleSelect}
                />
                <View style={styles.sectionSpacer} />
              </>
            )}

            {/* Puzzle/Landscape Fortschritt */}
            {!autoNotesUsed && currentLandscape && (
              <>
                <PuzzleProgress
                  landscape={currentLandscape}
                  newlyUnlockedSegmentId={newlyUnlockedSegmentId}
                  isComplete={landscapeCompleted}
                  onViewGallery={handleViewGallery}
                />
                <View style={styles.sectionSpacer} />
              </>
            )}

            {/* Streak */}
            {stats && stats.currentStreak > 0 && !autoNotesUsed && (
              <>
                <StreakDisplay
                  currentStreak={stats.currentStreak}
                  longestStreak={stats.longestStreak}
                  isRecord={stats.currentStreak === stats.longestStreak && stats.longestStreak > 2}
                />
                <View style={styles.sectionSpacer} />
              </>
            )}

            {/* Performance */}
            <PerformanceCard
              timeElapsed={timeElapsed}
              previousBestTime={
                stats
                  ? (stats[
                      `bestTime${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`
                    ] as number)
                  : Infinity
              }
              isNewRecord={newRecord}
              autoNotesUsed={autoNotesUsed}
            />

            <View style={styles.sectionSpacer} />

            {/* Feedback */}
            <FeedbackMessage
              difficulty={difficulty}
              timeElapsed={timeElapsed}
              isNewRecord={newRecord}
              autoNotesUsed={autoNotesUsed}
              streak={stats?.currentStreak || 0}
            />

            {autoNotesUsed && <View style={[styles.separator, { backgroundColor: colors.warning }]} />}
          </Animated.View>
        </ScrollView>

        {/* Buttons unten fixiert */}
        <View
          style={[
            styles.buttonContainer,
            {
              backgroundColor: theme.isDark ? colors.background : colors.card,
              borderTopWidth: 1,
              borderTopColor: theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Button
            title="Nächstes Spiel"
            onPress={handleNewGame}
            variant="primary"
            style={styles.primaryButton}
            icon={<Feather name="play" size={20} color="white" />}
            iconPosition="left"
          />

          <Button
            title="Zurück zum Menü"
            onPress={onContinue}
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default GameCompletionModal;
