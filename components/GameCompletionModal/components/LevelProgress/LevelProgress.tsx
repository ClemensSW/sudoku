import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  FadeOut,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import { GameStats } from "@/utils/storage";
import styles from "./LevelProgress.styles";

interface LevelProgressProps {
  stats: GameStats;
  difficulty: Difficulty;
  justCompleted: boolean;
}

// Level-Schwellenwerte - steigender Bedarf für jedes Level
const levelThresholds = [0, 5, 15, 30, 50, 75, 105, 140, 180, 225, 275, 330];

// Level-Namen
const getLevelName = (level: number) => {
  const levelNames = [
    "Anfänger",
    "Lehrling",
    "Herausforderer",
    "Puzzler",
    "Taktiker",
    "Stratege",
    "Meister",
    "Großmeister",
    "Experte",
    "Virtuose",
    "Genie",
    "Sudoku-Legende",
  ];

  return level < levelNames.length ? levelNames[level] : "Sudoku-Gott";
};

// Berechne das Level basierend auf den XP
const calculateExperience = (stats: GameStats): number => {
  // Basis-XP: Jedes abgeschlossene Spiel gibt 1 XP
  let totalXP = stats.gamesPlayed;

  // Bonus-XP für Siege basierend auf Schwierigkeit
  // Da wir keine separaten Zähler für jeden Schwierigkeitsgrad haben,
  // verwenden wir einen vereinfachten Ansatz
  // Angenommen, die meisten Siege geben einen bescheidenen Bonus
  totalXP += stats.gamesWon * 2;

  return totalXP;
};

// Finde das aktuelle Level basierend auf XP
const getCurrentLevel = (xp: number): number => {
  let level = 0;
  for (let i = 0; i < levelThresholds.length; i++) {
    if (xp >= levelThresholds[i]) {
      level = i;
    } else {
      break;
    }
  }
  return level;
};

// XP für das nächste Level
const getNextLevelXP = (currentLevel: number): number => {
  if (currentLevel >= levelThresholds.length - 1) {
    return levelThresholds[currentLevel] + 100; // Wenn max Level, einfach mehr XP hinzufügen
  }
  return levelThresholds[currentLevel + 1];
};

// XP-Gewinn für abgeschlossenes Spiel basierend auf Schwierigkeit
const getXPGain = (difficulty: Difficulty): number => {
  const xpValues: Record<Difficulty, number> = {
    easy: 2,
    medium: 3,
    hard: 5,
    expert: 8,
  };
  return xpValues[difficulty];
};

const LevelProgress: React.FC<LevelProgressProps> = ({
  stats,
  difficulty,
  justCompleted,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // XP berechnen
  const totalXP = calculateExperience(stats);
  const xpGain = justCompleted ? getXPGain(difficulty) : 0;
  const previousXP = totalXP - xpGain;
  
  // Level berechnen
  const currentLevel = getCurrentLevel(totalXP);
  const previousLevel = getCurrentLevel(previousXP);
  const leveledUp = currentLevel > previousLevel;
  
  // XP fürs nächste Level
  const nextLevelXP = getNextLevelXP(currentLevel);
  
  // XP-Fortschritt für dieses Level
  const currentLevelXP = levelThresholds[currentLevel];
  const xpForThisLevel = totalXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  
  // Prozentsatz für Fortschrittsbalken
  const progressPercentage = Math.min(
    100,
    Math.round((xpForThisLevel / xpNeededForNextLevel) * 100)
  );
  
  // Prozentsatz für vorherigen XP-Stand
  const previousProgressPercentage = Math.min(
    100,
    Math.round(
      ((previousXP - currentLevelXP) / xpNeededForNextLevel) * 100
    )
  );
  
  // Animation values
  const progressWidth = useSharedValue(previousProgressPercentage);
  const levelBadgeScale = useSharedValue(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Starte Animationen, wenn die Komponente gemountet wird
  useEffect(() => {
    // Verzögerung für den Start der XP-Balken-Animation
    setTimeout(() => {
      // Fortschrittsbalken Animation
      progressWidth.value = withTiming(progressPercentage, {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      // Level-Badge pulsieren lassen
      levelBadgeScale.value = withSequence(
        withDelay(
          1000,
          withTiming(1.1, { duration: 300, easing: Easing.out(Easing.ease) })
        ),
        withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
      );
      
      // Wenn Level aufgestiegen, Level-Up Animation zeigen
      if (leveledUp) {
        setTimeout(() => {
          setShowLevelUp(true);
          
          // Nach einigen Sekunden wieder ausblenden
          setTimeout(() => {
            setShowLevelUp(false);
          }, 3000);
        }, 2000);
      }
    }, 500);
  }, []);
  
  // Animated Styles
  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });
  
  const levelBadgeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: levelBadgeScale.value }],
    };
  });
  
  // Berechne die Position des XP-Gewinns im Fortschrittsbalken
  const getGainIndicatorWidth = (): string => {
    if (progressPercentage <= previousProgressPercentage) return "0%";
    return `${progressPercentage - previousProgressPercentage}%`;
  };
  
  const getGainIndicatorLeft = (): string => {
    return `${previousProgressPercentage}%`;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.isDark ? colors.surface : "#FFFFFF" },
      ]}
      entering={FadeIn.duration(500)}
    >
      {/* Header mit Titel und XP-Gewinn */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Level-Fortschritt
        </Text>
        
        {xpGain > 0 && (
          <View
            style={[styles.xpGainBadge, { backgroundColor: colors.primary }]}
          >
            <Feather name="plus" size={12} color="white" />
            <Text style={styles.xpGainText}>{xpGain} XP</Text>
          </View>
        )}
      </View>
      
      {/* Level-Anzeige mit Badge und Namen */}
      <View style={styles.levelInfoContainer}>
        <Animated.View
          style={[
            styles.levelBadge,
            { backgroundColor: colors.primary },
            levelBadgeAnimatedStyle,
          ]}
        >
          <Text style={styles.levelNumber}>{currentLevel}</Text>
        </Animated.View>
        
        <View style={styles.levelNameContainer}>
          <Text style={[styles.levelName, { color: colors.textPrimary }]}>
            {getLevelName(currentLevel)}
          </Text>
          <Text
            style={[styles.levelDescription, { color: colors.textSecondary }]}
          >
            {leveledUp
              ? "Level aufgestiegen!"
              : progressPercentage >= 90
              ? "Fast am nächsten Level!"
              : "Sammle XP durch Spielen von Sudoku"}
          </Text>
        </View>
      </View>
      
      {/* XP-Fortschrittsbalken */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBackground,
            {
              backgroundColor: theme.isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: colors.primary },
              progressAnimatedStyle,
            ]}
          />
          
          {/* XP-Gewinn-Indikator */}
          {xpGain > 0 && (
            <View
              style={[
                styles.progressGainIndicator,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.7)",
                  width: getGainIndicatorWidth(),
                  left: getGainIndicatorLeft(),
                },
              ]}
            />
          )}
        </View>
        
        <View style={styles.progressLabelContainer}>
          <Text
            style={[styles.progressLabel, { color: colors.textSecondary }]}
          >
            {progressPercentage}% zum Level {currentLevel + 1}
          </Text>
          
          <Text style={[styles.xpValues, { color: colors.textPrimary }]}>
            {xpForThisLevel} / {xpNeededForNextLevel} XP
          </Text>
        </View>
      </View>
      
      {/* Level-Up Animation */}
      {showLevelUp && (
        <Animated.View
          style={styles.levelUpContainer}
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}
        >
          <View style={styles.levelUpContent}>
            <Text style={styles.levelUpText}>Level Up!</Text>
            <Feather name="award" size={64} color={colors.warning} />
            <Text style={styles.newLevelText}>
              {getLevelName(currentLevel)} erreicht!
            </Text>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default LevelProgress;