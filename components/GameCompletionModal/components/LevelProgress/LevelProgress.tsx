import React, { useEffect, useState, useRef } from "react";
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

// Level thresholds - increasing requirements for each level
const levelThresholds = [0, 5, 15, 30, 50, 75, 105, 140, 180, 225, 275, 330];

// Level names
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

// Calculate level based on XP
const calculateExperience = (stats: GameStats): number => {
  // Base XP: Each completed game gives 1 XP
  let totalXP = stats.gamesPlayed;

  // Bonus XP for wins based on difficulty
  totalXP += stats.gamesWon * 2;

  return totalXP;
};

// Find current level based on XP
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

// XP for next level
const getNextLevelXP = (currentLevel: number): number => {
  if (currentLevel >= levelThresholds.length - 1) {
    return levelThresholds[currentLevel] + 100; // If max level, just add more XP
  }
  return levelThresholds[currentLevel + 1];
};

// XP gain for completed game based on difficulty
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
  const progressContainerRef = useRef<View>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Calculate XP
  const totalXP = calculateExperience(stats);
  const xpGain = justCompleted ? getXPGain(difficulty) : 0;
  const previousXP = totalXP - xpGain;
  
  // Calculate level
  const currentLevel = getCurrentLevel(totalXP);
  const previousLevel = getCurrentLevel(previousXP);
  const leveledUp = currentLevel > previousLevel;
  
  // XP for next level
  const nextLevelXP = getNextLevelXP(currentLevel);
  
  // XP progress for this level
  const currentLevelXP = levelThresholds[currentLevel];
  const xpForThisLevel = totalXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  
  // Percentage for progress bar
  const progressPercentage = Math.min(
    100,
    Math.round((xpForThisLevel / xpNeededForNextLevel) * 100)
  );
  
  // Percentage for previous XP state
  const previousProgressPercentage = Math.min(
    100,
    Math.round(
      ((previousXP - currentLevelXP) / xpNeededForNextLevel) * 100
    )
  );
  
  // Animation values
  const progressWidth = useSharedValue(previousProgressPercentage);
  const levelBadgeScale = useSharedValue(1);
  const badgeGlow = useSharedValue(0.3);
  const progressGlow = useSharedValue(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Start animations when component mounts
  useEffect(() => {
    // Delay for the start of XP bar animation
    setTimeout(() => {
      // Progress bar animation with custom easing
      progressWidth.value = withTiming(progressPercentage, {
        duration: 1500,
        easing: Easing.bezierFn(0.16, 1, 0.3, 1), // Custom easing for smoother animation
      });
      
      // Level badge pulsing with more elegant animation
      levelBadgeScale.value = withSequence(
        withDelay(
          800,
          withTiming(1.15, { duration: 400, easing: Easing.out(Easing.ease) })
        ),
        withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
      );
      
      // Badge glow animation
      badgeGlow.value = withDelay(
        1000,
        withSequence(
          withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.sin) })
        )
      );
      
      // Progress bar glow for XP gain
      if (xpGain > 0) {
        progressGlow.value = withDelay(
          1200,
          withTiming(0.8, { 
            duration: 600,
            easing: Easing.out(Easing.ease)
          })
        );
      }
      
      // If leveled up, show level-up animation
      if (leveledUp) {
        setTimeout(() => {
          setShowLevelUp(true);
          
          // Hide after a few seconds
          setTimeout(() => {
            setShowLevelUp(false);
          }, 3000);
        }, 2000);
      }
    }, 500);
    
    // Set up continuous animations
    if (leveledUp) {
      // Continuous subtle badge animation if leveled up
      const pulseAnimation = () => {
        levelBadgeScale.value = withSequence(
          withTiming(1.1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) })
        );
        
        // Repeat after random delay
        setTimeout(pulseAnimation, 3000 + Math.random() * 1000);
      };
      
      setTimeout(pulseAnimation, 2500);
    }
    
    // Badge glow animation
    const badgeGlowAnimation = () => {
      badgeGlow.value = withSequence(
        withTiming(0.7, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      );
      
      setTimeout(badgeGlowAnimation, 3600);
    };
    
    setTimeout(badgeGlowAnimation, 2000);
  }, []);
  
  // Animated Styles
  const levelBadgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: levelBadgeScale.value }],
  }));
  
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));
  
  const badgeGlowStyle = useAnimatedStyle(() => ({
    opacity: badgeGlow.value,
  }));
  
  const progressGlowStyle = useAnimatedStyle(() => ({
    opacity: progressGlow.value,
  }));
  
  // Handler for container width measurement
  const onLayoutProgressContainer = (event: any) => {
    if (containerWidth === 0) {
      setContainerWidth(event.nativeEvent.layout.width);
    }
  };
  
  // Calculate gain indicator dimensions
  const getGainIndicatorWidth = () => {
    if (progressPercentage <= previousProgressPercentage) return 0;
    if (containerWidth === 0) return 0;
    
    const widthPercent = progressPercentage - previousProgressPercentage;
    return containerWidth * widthPercent / 100;
  };
  
  const getGainIndicatorLeft = () => {
    if (containerWidth === 0) return 0;
    return containerWidth * previousProgressPercentage / 100;
  };
  
  // Get appropriate level description text
  const getLevelDescription = () => {
    if (leveledUp) return "Level aufgestiegen!";
    if (progressPercentage >= 90) return "Fast am nächsten Level!";
    if (progressPercentage >= 70) return "Guter Fortschritt!";
    return "Sammle XP durch Spielen von Sudoku";
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surface},
      ]}
      entering={FadeIn.duration(500)}
    >
      {/* Header with title and XP gain badge */}
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
      
      {/* Level display with animated badge and name */}
      <View style={styles.levelInfoContainer}>
        <View style={styles.levelBadgeWrapper}>
          {/* Glow background for badge on level up */}
          {leveledUp && (
            <Animated.View
              style={[
                styles.badgeGlow,
                { backgroundColor: `${colors.primary}30` },
                badgeGlowStyle
              ]}
            />
          )}
          
          <Animated.View
            style={[
              styles.levelBadge,
              { backgroundColor: colors.primary },
              levelBadgeAnimatedStyle,
            ]}
          >
            <Text style={styles.levelNumber}>{currentLevel}</Text>
          </Animated.View>
        </View>
        
        <View style={styles.levelNameContainer}>
          <Text style={[styles.levelName, { color: colors.textPrimary }]}>
            {getLevelName(currentLevel)}
          </Text>
          <Text
            style={[styles.levelDescription, { color: colors.textSecondary }]}
          >
            {getLevelDescription()}
          </Text>
        </View>
      </View>
      
      {/* XP progress bar with modern styling */}
      <View 
        style={styles.progressContainer}
        ref={progressContainerRef}
        onLayout={onLayoutProgressContainer}
      >
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
          
          {/* XP gain indicator */}
          {xpGain > 0 && containerWidth > 0 && (
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
          
          {/* Glow effect on progress bar */}
          {xpGain > 0 && (
            <Animated.View
              style={[
                styles.progressGlow,
                { backgroundColor: `${colors.primary}30` },
                progressGlowStyle
              ]}
            />
          )}
        </View>
        
        {/* XP values and percentage display */}
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
      
      {/* Improved Level-Up Animation */}
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