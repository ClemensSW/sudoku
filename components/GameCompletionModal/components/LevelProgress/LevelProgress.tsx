// components/GameCompletionModal/components/LevelProgress/LevelProgress.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
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
import { useLevelInfo } from "./utils/useLevelInfo";
import { calculateExperience } from "./utils/levelData";
import LevelBadge from "./components/LevelBadge";
import ConfettiEffect from "./components/ConfettiEffect";
import { LevelProgressOptions } from "./utils/types";
import { GameStats } from "@/utils/storage";
import { Difficulty } from "@/utils/sudoku";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./LevelProgress.styles";
import { triggerHaptic } from "@/utils/haptics";

interface LevelProgressProps {
  // Either XP or Stats must be provided
  xp?: number;
  previousXp?: number;
  
  // OR: Stats-based view
  stats?: GameStats;
  difficulty?: Difficulty | string;
  justCompleted?: boolean;
  
  // Optional: Show XP gain
  xpGain?: number;
  
  // Optional styling and behavior
  style?: any;
  compact?: boolean;
  onLevelUp?: (oldLevel: number, newLevel: number) => void;
  onPathChange?: (oldPathId: string, newPathId: string) => void;
  onPress?: () => void;
  
  // Configuration options
  options?: LevelProgressOptions;
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
}) => {
  // Use theme for colors
  const theme = useTheme();
  const colors = theme.colors;
  
  // Default options merged with user-provided options
  const defaultOptions: LevelProgressOptions = {
    enableLevelUpAnimation: true,
    usePathColors: true,
    showPathDescription: !compact,
    showMilestones: false, 
    textVisibility: 'toggle',
    highContrastText: false,
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  // State for text expansion
  const [textExpanded, setTextExpanded] = useState(
    finalOptions.textVisibility !== 'compact'
  );
  
  // Calculate XP from stats if XP not directly provided
  const calculatedXp = stats ? calculateExperience(stats) : 0;
  
  // Use either directly provided XP or calculated XP from stats
  const currentXp = xp !== undefined ? xp : calculatedXp;
  // If xpGain is provided and a game was just completed, subtract it to get previous XP
  const prevXp = previousXp !== undefined ? previousXp : (justCompleted && xpGain ? currentXp - xpGain : currentXp);
  
  // Calculate level information with the hook
  const levelInfo = useLevelInfo(currentXp);
  const previousLevelInfo = prevXp !== currentXp ? useLevelInfo(prevXp) : levelInfo;
  
  // State for level-up animation and effects
  const [showLevelUpOverlay, setShowLevelUpOverlay] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const levelUpTriggered = useRef(false);
  
  // Animation values
  const containerScale = useSharedValue(1);
  const progressWidth = useSharedValue(0);
  const xpGainScale = useSharedValue(1);
  const xpGainOpacity = useSharedValue(0);
  const badgePulse = useSharedValue(1);
  
  // Toggle function for text visibility
  const toggleTextVisibility = () => {
    setTextExpanded(!textExpanded);
    triggerHaptic("light");
  };
  
  // Check for actual level-up - important correction
  useEffect(() => {
    // Initialize progress bar with the current percentage
    progressWidth.value = withTiming(levelInfo.progressPercentage, { 
      duration: 1000, 
      easing: Easing.bezierFn(0.25, 0.1, 0.25, 1) 
    });
    
    // Only trigger level-up on actual level changes, not on every game
    const didLevelUp = (previousXp !== undefined || xpGain !== undefined) && 
                      levelInfo.currentLevel > previousLevelInfo.currentLevel;
    
    if (didLevelUp && finalOptions.enableLevelUpAnimation && !levelUpTriggered.current) {
      // Set the flag to prevent multiple triggers
      levelUpTriggered.current = true;
      
      // Give haptic feedback for level-up
      triggerHaptic("success");
      
      // Start with the confetti effect
      setShowConfetti(true);
      
      // Then show level-up overlay with a slight delay
      setTimeout(() => {
        setShowLevelUpOverlay(true);
        
        // Highlight the container
        containerScale.value = withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 300 })
        );
        
        // Create a badge pulse effect
        badgePulse.value = withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(1, { duration: 300 })
        );
      }, 800);
      
      // Call event handler if provided
      if (onLevelUp) {
        onLevelUp(previousLevelInfo.currentLevel, levelInfo.currentLevel);
      }
      
      // Hide level-up overlay after a delay
      setTimeout(() => {
        setShowLevelUpOverlay(false);
        // Stop confetti a bit later for a more satisfying effect
        setTimeout(() => {
          setShowConfetti(false);
          levelUpTriggered.current = false;
        }, 1000);
      }, 4000);
    }
    
    // Check for path change
    if (previousLevelInfo && 
        previousLevelInfo.currentPath.id !== levelInfo.currentPath.id && 
        onPathChange) {
      onPathChange(previousLevelInfo.currentPath.id, levelInfo.currentPath.id);
    }
    
    // XP Gain animation, if provided
    if (xpGain && xpGain > 0) {
      xpGainOpacity.value = withSequence(
        withDelay(500, withTiming(1, { duration: 400 })),
        withDelay(2000, withTiming(0.8, { duration: 800 }))
      );
      
      xpGainScale.value = withSequence(
        withDelay(500, withTiming(1.2, { duration: 300 })),
        withTiming(1, { duration: 200 })
      );
    }
  }, [currentXp, prevXp, levelInfo, previousLevelInfo, xpGain]);
  
  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));
  
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));
  
  const xpGainAnimatedStyle = useAnimatedStyle(() => ({
    opacity: xpGainOpacity.value,
    transform: [{ scale: xpGainScale.value }],
  }));
  
  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgePulse.value }],
  }));
  
  // Decide the color to display based on options
  const progressColor = finalOptions.usePathColors 
    ? levelInfo.currentPath.color 
    : colors.primary;
    
  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.9 : 1 }
      ]}
    >
      <Animated.View 
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
          },
          compact ? styles.compactContainer : null,
          containerAnimatedStyle,
          style
        ]}
        entering={FadeIn.duration(500)}
      >
        {/* XP Gain indicator - Redesigned to be more prominent */}
        {xpGain && xpGain > 0 && (
          <Animated.View 
            style={[
              styles.xpGainBadge,
              { 
                backgroundColor: colors.success,
                borderColor: theme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                borderWidth: 1,
                padding: 8,
                borderRadius: 12,
              },
              xpGainAnimatedStyle
            ]}
          >
            <Feather name="award" size={16} color="#FFFFFF" />
            <Text style={[
              styles.xpGainText,
              { 
                fontSize: 16,
                fontWeight: "700",
                marginLeft: 8 
              }
            ]}>
              +{xpGain} XP
            </Text>
          </Animated.View>
        )}
        
        {/* Level header with badge */}
        <View style={[
          styles.header,
          { alignItems: 'center', marginBottom: 16 }
        ]}>
          <Animated.View style={badgeAnimatedStyle}>
            <LevelBadge 
              levelInfo={levelInfo}
              size={compact ? 44 : 56}
              showAnimation={showLevelUpOverlay}
            />
          </Animated.View>
          
          <View style={styles.levelInfoContainer}>
            {/* Hauptüberschrift: Level-Name (nicht Level-Nummer) */}
            <Text style={[
              styles.levelName, 
              { 
                color: finalOptions.highContrastText 
                  ? theme.isDark ? '#FFFFFF' : '#000000' 
                  : colors.textPrimary,
                fontSize: 20,
                fontWeight: "700",
              }
            ]}>
              {levelInfo.levelData.name}
            </Text>
            
            {/* Level-Beschreibung - immer sichtbar */}
            <Text style={[
              styles.levelMessage, 
              { 
                color: finalOptions.highContrastText 
                  ? theme.isDark ? '#FFFFFF' : '#000000' 
                  : colors.textSecondary,
                fontSize: 14,
                marginTop: 4,
                lineHeight: 18
              }
            ]}>
              {levelInfo.levelData.message}
            </Text>
            
          </View>
        </View>
        
        {/* Pfadanzeige mit Toggle-Button */}
        <View style={[
          styles.pathInfoContainer,
          { 
            flexDirection: 'column',
            borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            paddingBottom: 12,
            marginBottom: 12
          }
        ]}>
          {/* Pfadname mit Toggle-Button */}
          <Pressable 
            onPress={toggleTextVisibility}
            style={({ pressed }) => [
              styles.pathHeaderRow,
              { 
                opacity: pressed ? 0.8 : 1,
                backgroundColor: pressed 
                  ? theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' 
                  : 'transparent',
                borderRadius: 8,
                padding: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Farbiger Pfad-Indikator */}
              <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: levelInfo.currentPath.color,
                marginRight: 8
              }} />
              
              {/* Pfadname */}
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: finalOptions.highContrastText 
                  ? theme.isDark ? '#FFFFFF' : '#000000' 
                  : colors.textPrimary
              }}>
                {levelInfo.currentPath.name}
              </Text>
            </View>
            
            {/* Auf/Zu-Pfeil */}
            <Feather 
              name={textExpanded ? "chevron-up" : "chevron-down"} 
              size={18} 
              color={colors.textSecondary} 
            />
          </Pressable>
          
          {/* Pfadbeschreibung - nur wenn ausgeklappt */}
          {textExpanded && (
            <Animated.View 
              style={[
                styles.pathContent,
                { 
                  marginTop: 8,
                  padding: 10,
                  backgroundColor: finalOptions.highContrastText 
                    ? theme.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)' 
                    : theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  borderRadius: 8,
                  borderLeftWidth: 3,
                  borderLeftColor: levelInfo.currentPath.color
                }
              ]}
              entering={FadeIn.duration(300)}
            >
              <Text style={[
                styles.textContainer,
                { 
                  color: finalOptions.highContrastText 
                    ? theme.isDark ? '#FFFFFF' : '#000000' 
                    : colors.textSecondary,
                  fontSize: 14,
                  lineHeight: 20
                }
              ]}>
                {levelInfo.currentPath.description}
              </Text>
            </Animated.View>
          )}
        </View>
        
        {/* Progress section - Redesigned for better clarity */}
        <View style={styles.progressSection}>
          {/* XP display with better layout */}
          <View style={[
            styles.xpInfoRow,
            { marginBottom: 8 }
          ]}>
            <Text style={[
              styles.xpText, 
              { 
                color: finalOptions.highContrastText 
                  ? theme.isDark ? '#FFFFFF' : '#000000' 
                  : colors.textPrimary
              }
            ]}>
              {currentXp} XP
            </Text>
            
            {levelInfo.nextLevelData && (
              <Text style={[
                styles.xpToGo, 
                { 
                  color: finalOptions.highContrastText 
                    ? theme.isDark ? '#FFFFFF' : '#000000' 
                    : colors.textSecondary
                }
              ]}>
                Noch {levelInfo.xpForNextLevel} EP bis Level {levelInfo.currentLevel + 2}
              </Text>
            )}
          </View>
          
          {/* Progress bar - Enhanced visuals */}
          <View style={[
            styles.progressBarContainer,
            { height: 8, borderRadius: 4 }
          ]}>
            <View 
              style={[
                styles.progressBackground,
                { 
                  backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  borderRadius: 4
                }
              ]}
            >
              <Animated.View
                style={[
                  styles.progressFill,
                  { 
                    backgroundColor: progressColor,
                    borderRadius: 4
                  },
                  progressAnimatedStyle
                ]}
              />
            </View>
          </View>
        </View>
        
        {/* Confetti Effect for celebration */}
        <ConfettiEffect 
          active={showConfetti} 
          count={40}
          duration={4000}
          colors={[
            progressColor,
            "#FFD700", // Gold
            "#FF4081", // Pink
            "#00E676", // Green
            "#2979FF", // Blue
            "#FFFFFF"  // White
          ]}
        />
        
        {/* Level Up Overlay - Completely redesigned for impact */}
        {showLevelUpOverlay && (
          <Animated.View 
            style={[
              styles.levelUpOverlay,
              { backgroundColor: 'rgba(0,0,0,0.75)' }
            ]}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <View style={[
              styles.levelUpContent,
              { 
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderColor: progressColor,
                borderWidth: 2,
                padding: 24,
                borderRadius: 20
              }
            ]}>
              <Text style={[
                styles.levelUpText,
                finalOptions.highContrastText && styles.levelUpTextHighContrast
              ]}>
                LEVEL UP!
              </Text>
              
              <LevelBadge 
                levelInfo={levelInfo}
                size={80}
                showAnimation={true}
                animationDelay={300}
              />
              
              <Text style={[
                styles.newLevelName,
                finalOptions.highContrastText && styles.levelUpTextHighContrast
              ]}>
                {levelInfo.levelData.name}
              </Text>
              
              <Text style={[
                styles.newLevelMessage,
                finalOptions.highContrastText && {
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  padding: 8,
                  borderRadius: 4,
                  marginTop: 16
                }
              ]}>
                {levelInfo.levelData.message}
              </Text>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default LevelProgress;