// components/GameCompletionModal/components/LevelProgress/LevelProgress.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { View, Text, Pressable, LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  FadeIn,
  FadeOut,
  SlideInUp,
  Easing,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import Svg, {
  Path as SvgPath,
  Circle as SvgCircle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
} from "react-native-svg";
import { useLevelInfo } from "./utils/useLevelInfo";
import {
  milestones as milestoneMessages,
  levels as LEVELS,
} from "./utils/levelData";
import LevelBadge from "./components/LevelBadge";
import TitleSelect from "./components/TitleSelect";
import { LevelProgressOptions } from "./utils/types";
import { GameStats, markMilestoneReached } from "@/utils/storage";
import { Difficulty } from "@/utils/sudoku";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./LevelProgress.styles";
import { triggerHaptic } from "@/utils/haptics";

// Für die Pfad-Berechnung (laut Vorgabe)
const MILESTONE_LEVELS = [5, 10, 15, 20];

interface LevelProgressProps {
  xp?: number;
  previousXp?: number;
  stats?: GameStats;
  difficulty?: Difficulty | string;
  justCompleted?: boolean;
  xpGain?: number;
  style?: any;
  compact?: boolean;
  onLevelUp?: (oldLevel: number, newLevel: number) => void;
  onPathChange?: (oldPathId: string, newPathId: string) => void;
  onPress?: () => void;
  options?: LevelProgressOptions;

  /** NEU: Titel-Auswahl */
  selectedTitle?: string | null;
  onTitleSelect?: (title: string | null) => void;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  xp,
  previousXp,
  stats,
  difficulty,
  justCompleted = false,
  xpGain,
  style,
  compact = false,
  onLevelUp,
  onPathChange,
  onPress,
  options = {},

  selectedTitle = null,
  onTitleSelect,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const defaultOptions: LevelProgressOptions = {
    enableLevelUpAnimation: true,
    usePathColors: true,
    showPathDescription: !compact,
    showMilestones: true,
    textVisibility: "toggle",
    highContrastText: false,
  };
  const finalOptions = { ...defaultOptions, ...options };

  const [pathDescExpanded, setPathDescExpanded] = useState(false);
  const [levelDescExpanded, setLevelDescExpanded] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState("");
  const [milestoneLevel, setMilestoneLevel] = useState(0);
  const [showLevelUpOverlay, setShowLevelUpOverlay] = useState(false);
  const levelUpTriggered = useRef(false);

  // Titel lokaler State (spiegelt Prop, falls von außen gesetzt)
  const [localTitle, setLocalTitle] = useState<string | null>(selectedTitle);
  useEffect(() => setLocalTitle(selectedTitle), [selectedTitle]);

  const calculatedXp = stats ? stats.totalXP : 0;
  const currentXp = xp !== undefined ? xp : calculatedXp;
  const prevXp =
    previousXp !== undefined
      ? previousXp
      : justCompleted && (xpGain ?? 0) > 0
      ? currentXp - (xpGain ?? 0)
      : currentXp;

  const levelInfo = useLevelInfo(currentXp);
  const previousLevelInfo =
    prevXp !== currentXp ? useLevelInfo(prevXp) : levelInfo;

  const hasLevelChanged =
    levelInfo.currentLevel > previousLevelInfo.currentLevel;

  // Titel, die bis zum aktuellen Level freigeschaltet sind
  const unlockedTitles = useMemo(
    () => LEVELS.slice(0, levelInfo.currentLevel + 1).map((l) => l.name),
    [levelInfo.currentLevel]
  );

  // Reanimated
  const containerScale = useSharedValue(1);
  const progressWidth = useSharedValue(0);
  const previousProgressWidth = useSharedValue(0);
  const xpGainScale = useSharedValue(1);
  const badgePulse = useSharedValue(1);
  const gainIndicatorOpacity = useSharedValue(0);
  const milestoneScale = useSharedValue(0.95);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));
  const previousProgressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${previousProgressWidth.value}%`,
  }));
  const xpGainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: xpGainScale.value }],
  }));
  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgePulse.value }],
  }));
  const gainIndicatorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gainIndicatorOpacity.value,
  }));
  const milestoneAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: milestoneScale.value }],
  }));

  const progressColor = finalOptions.usePathColors
    ? levelInfo.currentPath.color
    : colors.primary;

  const togglePathDescription = () => {
    setPathDescExpanded((s) => !s);
    triggerHaptic("light");
  };
  const toggleLevelDescription = useCallback(() => {
    setLevelDescExpanded((s) => !s);
    triggerHaptic("light");
  }, []);

  const closeMilestone = () => {
    milestoneScale.value = withTiming(0.9, {
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    setTimeout(() => setShowMilestone(false), 200);
  };

  // ---- Milestone-Check extrahiert, damit er auch ohne Level-Up greift
  const checkAndShowMilestone = useCallback(async () => {
    if (!finalOptions.showMilestones) return;
    const reached = stats?.reachedMilestones || [];
    for (const lvl of Object.keys(milestoneMessages).map(Number)) {
      if (levelInfo.currentLevel >= lvl && !reached.includes(lvl)) {
        setMilestoneMessage(milestoneMessages[lvl]);
        setMilestoneLevel(lvl);
        await markMilestoneReached(lvl);
        setShowMilestone(true);
        triggerHaptic("success");
        milestoneScale.value = withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 200 })
        );
        break;
      }
    }
  }, [
    finalOptions.showMilestones,
    levelInfo.currentLevel,
    milestoneScale,
    stats,
  ]);

  useEffect(() => {
    const prevLevelStartXp = previousLevelInfo.levelData.xp;
    const nextLevelXp =
      previousLevelInfo.nextLevelData?.xp || prevLevelStartXp + 100;
    const prevLevelRange = nextLevelXp - prevLevelStartXp;

    const prevPercentage = hasLevelChanged
      ? 0
      : Math.min(100, ((prevXp - prevLevelStartXp) / prevLevelRange) * 100);

    setTimeout(() => {
      previousProgressWidth.value = prevPercentage;
      progressWidth.value = hasLevelChanged ? 0 : prevPercentage;
    }, 50);

    setTimeout(() => {
      if (hasLevelChanged) {
        progressWidth.value = withTiming(levelInfo.progressPercentage, {
          duration: 1500,
          easing: Easing.bezierFn(0.22, 1, 0.36, 1),
        });
      } else {
        progressWidth.value = withTiming(levelInfo.progressPercentage, {
          duration: 1200,
          easing: Easing.bezierFn(0.34, 1.56, 0.64, 1),
        });
        if ((xpGain ?? 0) > 0) {
          setTimeout(() => {
            gainIndicatorOpacity.value = withTiming(1, { duration: 400 });
          }, 200);
        }
      }
    }, 800);

    const didLevelUp =
      (previousXp !== undefined || xpGain !== undefined) &&
      levelInfo.currentLevel > previousLevelInfo.currentLevel;

    if (
      didLevelUp &&
      finalOptions.enableLevelUpAnimation &&
      !levelUpTriggered.current
    ) {
      levelUpTriggered.current = true;
      triggerHaptic("success");
      setTimeout(() => {
        setShowLevelUpOverlay(true);
        containerScale.value = withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 300 })
        );
        badgePulse.value = withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(1, { duration: 300 })
        );
      }, 800);

      onLevelUp?.(previousLevelInfo.currentLevel, levelInfo.currentLevel);

      setTimeout(() => {
        setShowLevelUpOverlay(false);
        setTimeout(() => {
          levelUpTriggered.current = false;
          // Nach dem Overlay auch Milestones anzeigen
          checkAndShowMilestone();
        }, 500);
      }, 4000);
    } else {
      // Kein Level-Up? Trotzdem Milestones prüfen (z. B. bei initialem Render nach Sync)
      checkAndShowMilestone();
    }
  }, [
    currentXp,
    prevXp,
    levelInfo,
    previousLevelInfo,
    xpGain,
    hasLevelChanged,
    finalOptions.enableLevelUpAnimation,
    onLevelUp,
    previousXp,
    containerScale,
    progressWidth,
    previousProgressWidth,
    badgePulse,
    gainIndicatorOpacity,
    xpGainScale,
    checkAndShowMilestone,
  ]);

  const handleTitlePick = (title: string | null) => {
    setLocalTitle(title);
    onTitleSelect?.(title ?? null);
  };

  // ---------- Layout: Zwei Cards: (1) Level, (2) Pfad ----------
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}
    >
      <Animated.View
        style={[styles.container, containerAnimatedStyle, style]}
        entering={FadeIn.duration(350)}
      >
        {/* ========== Card 1: LEVEL ========== */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.isDark ? "rgba(255,255,255,0.03)" : "#fff",
              borderColor: theme.isDark
                ? "rgba(255,255,255,0.10)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          {/* Header (Badge + Titel) */}
          <View
            style={[styles.header, { alignItems: "center", marginBottom: 18 }]}
          >
            <Animated.View style={badgeAnimatedStyle}>
              <LevelBadge
                levelInfo={levelInfo}
                size={compact ? 44 : 56}
                showAnimation={showLevelUpOverlay}
              />
            </Animated.View>

            <View style={styles.levelInfoContainer}>
              <Text style={[styles.levelName, { color: colors.textPrimary }]}>
                {levelInfo.levelData.name}
              </Text>
            </View>
          </View>

          {/* Gain-Chip */}
          {(xpGain ?? 0) > 0 && justCompleted && (
            <Animated.View
              style={[
                styles.gainChip,
                {
                  backgroundColor: theme.isDark
                    ? hexToRGBA(progressColor, 0.9)
                    : hexToRGBA(progressColor, 1),
                  borderColor: theme.isDark
                    ? hexToRGBA(progressColor, 0.55)
                    : hexToRGBA(progressColor, 0.35),
                },
                xpGainAnimatedStyle,
              ]}
            >
              <Feather name="plus" size={14} color="#FFFFFF" />
              <Text style={[styles.gainChipText, { color: "#FFFFFF" }]}>
                {xpGain} Erfahrungspunkte
              </Text>
            </Animated.View>
          )}

          {/* EP-Fortschritt (JETZT vor dem Dropdown) */}
          <View style={styles.progressSection}>
            <View style={[styles.xpInfoRow, { marginBottom: 8 }]}>
              <Text style={[styles.xpText, { color: colors.textPrimary }]}>
                Level {levelInfo.currentLevel + 1}
              </Text>
              {levelInfo.nextLevelData && (
                <Text style={[styles.xpToGo, { color: colors.textSecondary }]}>
                  Noch {levelInfo.xpForNextLevel} EP
                </Text>
              )}
            </View>

            <View
              style={[
                styles.progressBarContainer,
                { height: 12, borderRadius: 6 },
              ]}
            >
              <View
                style={[
                  styles.progressBackground,
                  {
                    backgroundColor: theme.isDark
                      ? "rgba(255,255,255,0.10)"
                      : "rgba(0,0,0,0.06)",
                    borderRadius: 6,
                    overflow: "hidden",
                    position: "relative",
                  },
                ]}
              >
                {/* Aktueller Fortschritt */}
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: progressColor,
                      borderRadius: 6,
                      position: "absolute",
                      height: "100%",
                      left: 0,
                      zIndex: 1,
                    },
                    progressAnimatedStyle,
                  ]}
                />

                {/* Vorheriger Fortschritt (gedimmt) */}
                {justCompleted && (xpGain ?? 0) > 0 && !hasLevelChanged && (
                  <Animated.View
                    style={[
                      {
                        position: "absolute",
                        height: "100%",
                        backgroundColor: theme.isDark
                          ? `${progressColor}40`
                          : `${progressColor}30`,
                        borderRadius: 6,
                        left: 0,
                        zIndex: 2,
                      },
                      previousProgressAnimatedStyle,
                    ]}
                  />
                )}

                {/* EP-Gewinn Highlight */}
                {justCompleted && (xpGain ?? 0) > 0 && !hasLevelChanged && (
                  <Animated.View
                    style={[
                      {
                        position: "absolute",
                        height: "100%",
                        backgroundColor: "#ffffff80",
                        borderRadius: 6,
                        left: `${previousProgressWidth.value}%`,
                        width: `${
                          levelInfo.progressPercentage -
                          previousProgressWidth.value
                        }%`,
                        zIndex: 3,
                        opacity: 1,
                      },
                      gainIndicatorAnimatedStyle,
                    ]}
                  />
                )}
              </View>
            </View>
          </View>

          {/* Level-Details + Titel-Auswahl (Dropdown jetzt am ENDE) */}
          <Pressable
            onPress={toggleLevelDescription}
            accessibilityRole="button"
            accessibilityLabel="Levelbeschreibung und Titel-Auswahl anzeigen oder verbergen"
            hitSlop={8}
            style={({ pressed }) => [
              styles.levelDetailsCard,
              {
                borderColor: theme.isDark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.08)",
                backgroundColor: pressed
                  ? theme.isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)"
                  : theme.isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.02)",
              },
            ]}
          >
            <View style={styles.levelDetailsHeader}>
              <View style={styles.levelDetailsHeaderLeft}>
                <View
                  style={[
                    styles.levelColorDot,
                    { backgroundColor: progressColor },
                  ]}
                />
                <Text
                  style={[
                    styles.levelDetailsTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  Dein Titel
                </Text>
              </View>
              <Feather
                name={levelDescExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.textSecondary}
              />
            </View>

            {levelDescExpanded && (
              <Animated.View
                entering={FadeIn.duration(200)}
                style={[
                  styles.levelDescriptionBody,
                  {
                    borderLeftColor: progressColor,
                    backgroundColor: theme.isDark
                      ? "rgba(255,255,255,0.035)"
                      : "rgba(0,0,0,0.02)",
                  },
                ]}
              >
                {/* Beschreibung */}
                <Text
                  style={[
                    styles.levelMessage,
                    { color: colors.textSecondary, marginBottom: 12 },
                  ]}
                >
                  {levelInfo.levelData.message}
                </Text>

                {/* Aktueller Titel (zweizeilig: Header oben, Pill darunter) */}
                <View style={styles.titleCurrentBlock}>
                  <View style={styles.titleCurrentHeader}>
                    <Feather name="award" size={16} color={progressColor} />
                    <Text
                      style={[
                        styles.titleCurrentText,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Aktueller Titel:
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.titlePill,
                      {
                        backgroundColor: hexToRGBA(
                          progressColor,
                          theme.isDark ? 0.25 : 0.15
                        ),
                        borderColor: hexToRGBA(
                          progressColor,
                          theme.isDark ? 0.45 : 0.3
                        ),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.titlePillText,
                        { color: colors.textPrimary },
                      ]}
                      // kein numberOfLines -> darf umbrechen
                    >
                      {localTitle || "—"}
                    </Text>
                  </View>
                </View>

                {/* Auswahl freigeschalteter Titel */}
                <TitleSelect
                  titles={unlockedTitles}
                  selected={localTitle}
                  onSelect={handleTitlePick}
                  color={progressColor}
                  isDark={theme.isDark}
                />
              </Animated.View>
            )}
          </Pressable>
        </View>

        {/* Abstand zwischen den Cards */}
        <View style={{ height: 32 }} />

        {/* ========== Card 2: PFAD („Deine Reise“) ========== */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.isDark ? "rgba(255,255,255,0.03)" : "#fff",
              borderColor: theme.isDark
                ? "rgba(255,255,255,0.10)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          {/* Card-Header mit Icon + Titel */}
          <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.headerIconWrap,
                  {
                    backgroundColor: theme.isDark
                      ? hexToRGBA(progressColor, 0.2)
                      : hexToRGBA(progressColor, 0.12),
                    borderColor: theme.isDark
                      ? hexToRGBA(progressColor, 0.35)
                      : hexToRGBA(progressColor, 0.25),
                  },
                ]}
              >
                <Feather name="map" size={14} color={progressColor} />
              </View>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                Deine Reise
              </Text>
            </View>
          </View>

          {/* Trail */}
          <PathTrail
            color={progressColor}
            isDark={theme.isDark}
            currentLevel={levelInfo.currentLevel}
            previousLevel={previousLevelInfo.currentLevel}
            milestoneLevels={MILESTONE_LEVELS}
          />

          {/* Vollflächig klickbarer Path-Details-Button */}
          {finalOptions.showPathDescription && (
            <Pressable
              onPress={togglePathDescription}
              accessibilityRole="button"
              accessibilityLabel="Pfaddetails anzeigen oder verbergen"
              style={({ pressed }) => [
                styles.pathDetailsCard,
                {
                  borderColor: theme.isDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(0,0,0,0.08)",
                  backgroundColor: pressed
                    ? theme.isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)"
                    : theme.isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
                },
              ]}
              hitSlop={8}
            >
              <View style={styles.pathDetailsHeader}>
                <View style={styles.pathDetailsHeaderLeft}>
                  <View
                    style={[
                      styles.pathColorDot,
                      { backgroundColor: progressColor },
                    ]}
                  />
                  <Text
                    style={[
                      styles.descriptionTitle,
                      { color: colors.textPrimary },
                    ]}
                  >
                    {levelInfo.currentPath.name}
                  </Text>
                </View>

                <View style={styles.pathDetailsHeaderRight}>
                  <Feather
                    name={pathDescExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.textSecondary}
                  />
                </View>
              </View>

              {pathDescExpanded && (
                <Animated.View
                  style={[
                    styles.descriptionBody,
                    {
                      borderLeftColor: progressColor,
                      backgroundColor: theme.isDark
                        ? "rgba(255,255,255,0.035)"
                        : "rgba(0,0,0,0.02)",
                    },
                  ]}
                  entering={FadeIn.duration(240)}
                >
                  <Text
                    style={[
                      styles.descriptionText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {levelInfo.currentPath.description}
                  </Text>
                </Animated.View>
              )}
            </Pressable>
          )}

          {/* Meilenstein-Hinweis (IN der Pfad-Card) */}
          {showMilestone && (
            <Animated.View
              style={[
                styles.milestoneContainer,
                {
                  backgroundColor: theme.isDark
                    ? `${progressColor}20`
                    : `${progressColor}10`,
                  borderColor: progressColor,
                },
                milestoneAnimatedStyle,
              ]}
              entering={SlideInUp.duration(300).springify()}
            >
              <View style={styles.milestoneHeader}>
                <View style={styles.milestoneHeaderLeft}>
                  <Feather
                    name="award"
                    size={18}
                    color={progressColor}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={[
                      styles.milestoneTitle,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Meilenstein erreicht!
                  </Text>
                </View>

                <Pressable
                  onPress={closeMilestone}
                  style={({ pressed }) => [
                    styles.milestoneCloseButton,
                    {
                      backgroundColor: pressed
                        ? theme.isDark
                          ? "rgba(255,255,255,0.10)"
                          : "rgba(0,0,0,0.06)"
                        : "transparent",
                    },
                  ]}
                >
                  <Feather name="x" size={18} color={colors.textSecondary} />
                </Pressable>
              </View>

              <Text
                style={[styles.milestoneText, { color: colors.textSecondary }]}
              >
                {milestoneMessage}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Level Up Overlay (global über beiden Cards) */}
        {showLevelUpOverlay && (
          <Animated.View
            style={[
              styles.levelUpOverlay,
              { backgroundColor: "rgba(0,0,0,0.75)" },
            ]}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <View
              style={[
                styles.levelUpContent,
                {
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderColor: progressColor,
                  borderWidth: 2,
                  padding: 24,
                  borderRadius: 20,
                },
              ]}
            >
              <Text style={[styles.levelUpText]}>LEVEL UP!</Text>
              <LevelBadge
                levelInfo={levelInfo}
                size={84}
                showAnimation={true}
                animationDelay={300}
              />
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default LevelProgress;

/* ===================================================================
   Unterkomponenten (Pfad-Block + Trail)
   =================================================================== */

type PathTrailProps = {
  color: string;
  isDark: boolean;
  currentLevel: number;
  previousLevel: number;
  milestoneLevels: number[]; // [5, 10, 15, 20]
};

// utils
function hexToRGBA(hex: string, alpha: number) {
  const m = hex.replace("#", "");
  const r = parseInt(m.substring(0, 2), 16) || 0;
  const g = parseInt(m.substring(2, 4), 16) || 0;
  const b = parseInt(m.substring(4, 6), 16) || 0;
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Mappt den Level auf "Trail-Einheiten":
 * 0  -> Start
 * 5  -> 1. Milestone
 * 10 -> 2. Milestone
 * 15 -> 3. Milestone
 * 20 -> 4. Milestone
 * Dazwischen linear interpoliert (z.B. Level 12 => 2 + 0.4 = 2.4)
 */
function levelToUnits(level: number, ms: number[]) {
  const sorted = [...ms].sort((a, b) => a - b);
  if (level <= 0) return 0;
  for (let i = 0; i < sorted.length; i++) {
    const m = sorted[i];
    if (level < m) {
      const start = i === 0 ? 0 : sorted[i - 1];
      const t = (level - start) / (m - start);
      return i + Math.max(0, Math.min(1, t));
    }
  }
  return sorted.length; // >= letzter Milestone
}

const PathTrail: React.FC<PathTrailProps> = ({
  color,
  isDark,
  currentLevel,
  previousLevel,
  milestoneLevels,
}) => {
  const [w, setW] = useState(0);
  const h = 120;
  const padX = 16;
  const baseY = 70;
  const amp = 24;

  const onLayout = (e: LayoutChangeEvent) => {
    setW(e.nativeEvent.layout.width);
  };

  const TOTAL_NODES = milestoneLevels.length + 1; // Start + Milestones

  // animierter Wegfortschritt (in Node-Einheiten)
  const prevUnits = useMemo(
    () => levelToUnits(previousLevel, milestoneLevels),
    [previousLevel, milestoneLevels]
  );
  const curUnits = useMemo(
    () => levelToUnits(currentLevel, milestoneLevels),
    [currentLevel, milestoneLevels]
  );

  const sv = useSharedValue(prevUnits);
  const [p, setP] = useState(prevUnits);

  useEffect(() => {
    sv.value = withTiming(curUnits, {
      duration: 1200,
      easing: Easing.bezierFn(0.22, 1, 0.36, 1),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curUnits]);

  useAnimatedReaction(
    () => sv.value,
    (v) => {
      runOnJS(setP)(v);
    },
    [sv]
  );

  // Wegpunkte (Nodes) generieren
  const nodes = useMemo(() => {
    if (w === 0) return [];
    const usable = Math.max(80, w - padX * 2);
    const step = usable / (TOTAL_NODES - 1);
    return Array.from({ length: TOTAL_NODES }, (_, i) => {
      const x = padX + i * step;
      const y =
        i % 2 === 0
          ? baseY + (i === 0 ? 0 : amp * 0.22)
          : baseY - (i === TOTAL_NODES - 2 ? amp * 0.45 : amp);
      return { x, y };
    });
  }, [w, TOTAL_NODES]);

  // Geschwungener Pfad (kubisch)
  const trailPath = useMemo(() => {
    if (nodes.length === 0) return "";
    let d = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 0; i < nodes.length - 1; i++) {
      const p0 = nodes[i];
      const p1 = nodes[i + 1];
      const dx = p1.x - p0.x;
      const c1 = { x: p0.x + dx * 0.35, y: p0.y };
      const c2 = { x: p1.x - dx * 0.35, y: p1.y };
      d += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p1.x} ${p1.y}`;
    }
    return d;
  }, [nodes]);

  // Punkt auf kubischer Kurve
  const cubicPoint = (p0: any, c1: any, c2: any, p1: any, t: number) => {
    const mt = 1 - t;
    const x =
      mt * mt * mt * p0.x +
      3 * mt * mt * t * c1.x +
      3 * mt * t * t * c2.x +
      t * t * t * p1.x;
    const y =
      mt * mt * mt * p0.y +
      3 * mt * mt * t * c1.y +
      3 * mt * t * t * c2.y +
      t * t * t * p1.y;
    return { x, y };
  };

  // ---- Füllpfad exakt bis tEnd (fein gesampelt) ----
  const filledPath = useMemo(() => {
    if (nodes.length === 0) return "";

    const clamp = (x: number, a: number, b: number) =>
      Math.max(a, Math.min(b, x));
    const prog = clamp(p, 0, TOTAL_NODES - 1);
    const segIndex = Math.floor(prog);
    const tEnd = prog - segIndex; // Anteil im aktuellen Segment [0..1]

    const points: { x: number; y: number }[] = [];
    points.push(nodes[0]);

    const SAMPLES_FULL = 24; // feinere Auflösung
    // Vollständige Segmente bis segIndex-1
    for (let i = 0; i < segIndex; i++) {
      const p0 = nodes[i];
      const p1 = nodes[i + 1];
      const dx = p1.x - p0.x;
      const c1 = { x: p0.x + dx * 0.35, y: p0.y };
      const c2 = { x: p1.x - dx * 0.35, y: p1.y };
      for (let s = 1; s <= SAMPLES_FULL; s++) {
        const t = s / SAMPLES_FULL;
        points.push(cubicPoint(p0, c1, c2, p1, t));
      }
    }

    // Teilsegment bis tEnd
    if (segIndex < TOTAL_NODES - 1) {
      const p0 = nodes[segIndex];
      const p1 = nodes[segIndex + 1];
      const dx = p1.x - p0.x;
      const c1 = { x: p0.x + dx * 0.35, y: p0.y };
      const c2 = { x: p1.x - dx * 0.35, y: p1.y };

      if (tEnd > 0) {
        const endSteps = Math.max(1, Math.ceil(SAMPLES_FULL * tEnd));
        for (let s = 1; s <= endSteps; s++) {
          const t = (s / endSteps) * tEnd; // letzter t exakt = tEnd
          points.push(cubicPoint(p0, c1, c2, p1, t));
        }
      }
    }

    if (points.length <= 1) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  }, [nodes, p, TOTAL_NODES]);

  // Marker-Position
  const marker = useMemo(() => {
    if (nodes.length === 0) return { x: 0, y: 0 };
    const clamp = (x: number, a: number, b: number) =>
      Math.max(a, Math.min(b, x));
    const prog = clamp(p, 0, TOTAL_NODES - 1);
    const i = Math.floor(prog);
    const tEnd = prog - i;

    if (i >= TOTAL_NODES - 1) return nodes[TOTAL_NODES - 1];

    const p0 = nodes[i];
    const p1 = nodes[i + 1];
    const dx = p1.x - p0.x;
    const c1 = { x: p0.x + dx * 0.35, y: p0.y };
    const c2 = { x: p1.x - dx * 0.35, y: p1.y };
    return cubicPoint(p0, c1, c2, p1, tEnd);
  }, [nodes, p, TOTAL_NODES]);

  const trailBg = isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.10)";
  const fillGlow = hexToRGBA(color, 0.18);

  const markerPulse = useSharedValue(1);
  useEffect(() => {
    markerPulse.value = withSequence(
      withTiming(1.12, { duration: 700, easing: Easing.out(Easing.quad) }),
      withTiming(1.0, { duration: 700, easing: Easing.inOut(Easing.quad) })
    );
  }, [markerPulse, curUnits]);

  const markerStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateX: marker.x - 7 },
        { translateY: marker.y - 7 },
        { scale: markerPulse.value },
      ],
    }),
    [marker]
  );

  return (
    <View style={styles.trailContainer} onLayout={onLayout}>
      {w > 0 && (
        <>
          <Svg width={"100%"} height={h}>
            <Defs>
              <SvgLinearGradient id="trailGradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={hexToRGBA(color, 0.85)} />
                <Stop offset="1" stopColor={hexToRGBA(color, 0.65)} />
              </SvgLinearGradient>
            </Defs>

            {/* Hintergrund-Trail */}
            <SvgPath
              d={trailPath}
              stroke={trailBg}
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Gefüllter Bereich bis Marker (mit Glow) */}
            {filledPath !== "" && (
              <>
                <SvgPath
                  d={filledPath}
                  stroke={fillGlow}
                  strokeWidth={11}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <SvgPath
                  d={filledPath}
                  stroke={"url(#trailGradient)"}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </>
            )}

            {/* Wegpunkte */}
            <G>
              {nodes.map((pt, idx) => {
                const done = p >= idx - 0.02;
                const outer = done ? color : trailBg;
                const inner = done
                  ? "#ffffff"
                  : isDark
                  ? "rgba(255,255,255,0.45)"
                  : "rgba(0,0,0,0.45)";
                return (
                  <G key={`wp-${idx}`}>
                    <SvgCircle cx={pt.x} cy={pt.y} r={9.5} fill={outer} />
                    <SvgCircle cx={pt.x} cy={pt.y} r={5.5} fill={inner} />
                  </G>
                );
              })}
            </G>
          </Svg>

          {/* Beweglicher Marker */}
          <Animated.View
            style={[
              styles.trailMarker,
              { backgroundColor: "#fff", shadowColor: color },
              markerStyle,
            ]}
          />
        </>
      )}
    </View>
  );
};
