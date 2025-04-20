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
  
  // State for text expansion - always start collapsed
  const [textExpanded, setTextExpanded] = useState(false);
  
  // Calculate XP from stats if XP not directly provided
  const calculatedXp = stats ? calculateExperience(stats) : 0;
  
  // Use either directly provided XP or calculated XP from stats
  const currentXp = xp !== undefined ? xp : calculatedXp;
  // If xpGain is provided and a game was just completed, subtract it to get previous XP
  const prevXp = previousXp !== undefined ? previousXp : (justCompleted && xpGain ? currentXp - xpGain : currentXp);
  
  // Calculate level information with the hook
  const levelInfo = useLevelInfo(currentXp);
  const previousLevelInfo = prevXp !== currentXp ? useLevelInfo(prevXp) : levelInfo;
  
  // Check if level has changed - this is critical for correct progress display
  const hasLevelChanged = levelInfo.currentLevel > previousLevelInfo.currentLevel;
  
  // State for level-up animation and effects
  const [showLevelUpOverlay, setShowLevelUpOverlay] = useState(false);
  const levelUpTriggered = useRef(false);
  
  // Animation values
  const containerScale = useSharedValue(1);
  const progressWidth = useSharedValue(0);
  const previousProgressWidth = useSharedValue(0); // For previous XP position
  const xpGainScale = useSharedValue(1);
  const badgePulse = useSharedValue(1);
  const gainIndicatorOpacity = useSharedValue(0); // For XP gain section in progress bar
  
  // Animation values for path indicators - Create all on component level
  const pathIndicator0Scale = useSharedValue(1);
  const pathIndicator1Scale = useSharedValue(1);
  const pathIndicator2Scale = useSharedValue(1);
  const pathIndicator3Scale = useSharedValue(1);
  const pathIndicator4Scale = useSharedValue(1);
  
  // Combine into an array for easier access
  const pathIndicatorScales = [
    pathIndicator0Scale,
    pathIndicator1Scale,
    pathIndicator2Scale,
    pathIndicator3Scale,
    pathIndicator4Scale
  ];
  
  // Pre-calculate all animated styles at component level
  const pathIndicator0Style = useAnimatedStyle(() => ({
    transform: [{ scale: pathIndicator0Scale.value }],
  }));
  
  const pathIndicator1Style = useAnimatedStyle(() => ({
    transform: [{ scale: pathIndicator1Scale.value }],
  }));
  
  const pathIndicator2Style = useAnimatedStyle(() => ({
    transform: [{ scale: pathIndicator2Scale.value }],
  }));
  
  const pathIndicator3Style = useAnimatedStyle(() => ({
    transform: [{ scale: pathIndicator3Scale.value }],
  }));
  
  const pathIndicator4Style = useAnimatedStyle(() => ({
    transform: [{ scale: pathIndicator4Scale.value }],
  }));
  
  // Combine into an array for easier access
  const pathIndicatorStyles = [
    pathIndicator0Style,
    pathIndicator1Style,
    pathIndicator2Style,
    pathIndicator3Style,
    pathIndicator4Style
  ];
  
  // Toggle function for text visibility
  const toggleTextVisibility = () => {
    setTextExpanded(!textExpanded);
    triggerHaptic("light");
  };
  
  // Check for actual level-up - important correction
  useEffect(() => {
    // Calculate the previous progress percentage based on previous level
    const prevLevelStartXp = previousLevelInfo.levelData.xp;
    const nextLevelXp = previousLevelInfo.nextLevelData?.xp || (prevLevelStartXp + 100);
    const prevLevelRange = nextLevelXp - prevLevelStartXp;
    
    // If level has changed, set previous progress to 0
    // otherwise, calculate the previous percentage correctly
    const prevPercentage = hasLevelChanged
      ? 0 // Start from 0 when level has changed
      : Math.min(100, ((prevXp - prevLevelStartXp) / prevLevelRange) * 100);
    
    // Set initial values for animation - with small delay to ensure rendering is complete
    setTimeout(() => {
      previousProgressWidth.value = prevPercentage;
      progressWidth.value = hasLevelChanged ? 0 : prevPercentage; // Start from 0 if level changed
    }, 50);
    
    // Show progress transition with a slight delay
    setTimeout(() => {
      // If a level change occurred, start from 0 and animate to current percentage
      // This creates a cleaner animation for level-ups
      if (hasLevelChanged) {
        // For level changes, use a longer duration and more pronounced animation
        progressWidth.value = withTiming(levelInfo.progressPercentage, { 
          duration: 1500, 
          easing: Easing.bezierFn(0.22, 1, 0.36, 1) // More emphasizing easing
        });
      } else {
        // For normal XP gains, use standard animation
        progressWidth.value = withTiming(levelInfo.progressPercentage, { 
          duration: 1200, 
          easing: Easing.bezierFn(0.34, 1.56, 0.64, 1) // Bouncy easing
        });
        
        // Only show gain indicator if there was an actual gain and NO level change
        if (xpGain && xpGain > 0) {
          // Delay the gain indicator slightly to ensure proper layering
          setTimeout(() => {
            gainIndicatorOpacity.value = withTiming(1, { duration: 400 });
          }, 200);
        }
      }
    }, 800);
    
    // Animate path indicators
    setTimeout(() => {
      // Animate current path indicator
      if (levelInfo.levelData.pathIndex >= 0 && levelInfo.levelData.pathIndex < pathIndicatorScales.length) {
        pathIndicatorScales[levelInfo.levelData.pathIndex].value = withSequence(
          withTiming(1.2, { duration: 300 }),
          withTiming(1, { duration: 200 })
        );
      }
    }, 400);
    
    // Only trigger level-up on actual level changes, not on every game
    const didLevelUp = (previousXp !== undefined || xpGain !== undefined) && 
                      levelInfo.currentLevel > previousLevelInfo.currentLevel;
    
    if (didLevelUp && finalOptions.enableLevelUpAnimation && !levelUpTriggered.current) {
      // Set the flag to prevent multiple triggers
      levelUpTriggered.current = true;
      
      // Give haptic feedback for level-up
      triggerHaptic("success");
      
      // Show level-up overlay with a slight delay
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
        setTimeout(() => {
          levelUpTriggered.current = false;
        }, 500);
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
      xpGainScale.value = withSequence(
        withDelay(500, withTiming(1.2, { duration: 300 })),
        withTiming(1, { duration: 200 })
      );
    }
  }, [currentXp, prevXp, levelInfo, previousLevelInfo, xpGain, hasLevelChanged]);
  
  // Animated styles
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
              
              {/* Nur Pfadname (ohne Fortschritt) */}
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
          
          {/* Ausgeklappter Bereich mit Pfad-Fortschritt und Beschreibung */}
          {textExpanded && (
            <Animated.View 
              style={[
                styles.pathContent,
                { 
                  marginTop: 8,
                  padding: 12,
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
              {/* Pfad-Fortschrittsanzeige mit Text und Balken */}
              <View style={{
                marginBottom: 12,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: theme.isDark 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(0,0,0,0.05)'
              }}>
                {/* Textuelle Anzeige "Pfad X von 5" */}
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: 8,
                  color: finalOptions.highContrastText 
                    ? theme.isDark ? '#FFFFFF' : '#000000' 
                    : colors.textPrimary
                }}>
                  Pfad {levelInfo.levelData.pathIndex + 1} von 5
                </Text>
                
                {/* Visuelle Balken-Anzeige */}
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 8
                }}>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <Animated.View 
                      key={`path-indicator-${index}`}
                      style={[
                        {
                          width: index === levelInfo.levelData.pathIndex ? 36 : 24,
                          height: index === levelInfo.levelData.pathIndex ? 10 : 6,
                          borderRadius: 4,
                          backgroundColor: index === levelInfo.levelData.pathIndex 
                            ? levelInfo.currentPath.color
                            : index < levelInfo.levelData.pathIndex
                              ? `${levelInfo.currentPath.color}80` // Completed paths (dimmed)
                              : theme.isDark 
                                ? 'rgba(255,255,255,0.2)' 
                                : 'rgba(0,0,0,0.1)', // Future paths
                          marginHorizontal: 4,
                        },
                        pathIndicatorStyles[index] // Verwende die vordefinierten Styles
                      ]}
                    />
                  ))}
                </View>
              </View>
              
              {/* Pfad-Beschreibung */}
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[
                styles.xpText, 
                { 
                  color: finalOptions.highContrastText 
                    ? theme.isDark ? '#FFFFFF' : '#000000' 
                    : colors.textPrimary
                }
              ]}>
                Level {levelInfo.currentLevel + 1}
              </Text>
              
              {/* Show +XP gain next to level number */}
              {xpGain && xpGain > 0 && justCompleted && (
                <Animated.Text
                  style={[
                    {
                      marginLeft: 8,
                      color: colors.success,
                      fontWeight: '700',
                      fontSize: 16,
                    },
                    xpGainAnimatedStyle
                  ]}
                >
                  +{xpGain} EP
                </Animated.Text>
              )}
            </View>
            
            {levelInfo.nextLevelData && (
              <Text style={[
                styles.xpToGo, 
                { 
                  color: finalOptions.highContrastText 
                    ? theme.isDark ? '#FFFFFF' : '#000000' 
                    : colors.textSecondary
                }
              ]}>
                Noch {levelInfo.xpForNextLevel} EP
              </Text>
            )}
          </View>
          
          {/* Progress bar - Enhanced visuals with before/after indication */}
          <View style={[
            styles.progressBarContainer,
            { height: 8, borderRadius: 4 }
          ]}>
            <View 
              style={[
                styles.progressBackground,
                { 
                  backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative'
                }
              ]}
            >
              {/* Render order is important for proper layering */}
              
              {/* 1. Current progress (base layer) */}
              <Animated.View
                style={[
                  styles.progressFill,
                  { 
                    backgroundColor: progressColor,
                    borderRadius: 4,
                    position: 'absolute',
                    height: '100%',
                    left: 0,
                    zIndex: 1, // Lowest z-index
                  },
                  progressAnimatedStyle
                ]}
              />
              
              {/* 2. Previous progress (shown dimmed) - ONLY IF NO LEVEL CHANGE */}
              {justCompleted && xpGain && xpGain > 0 && !hasLevelChanged && (
                <Animated.View
                  style={[
                    {
                      position: 'absolute',
                      height: '100%',
                      backgroundColor: theme.isDark 
                        ? `${progressColor}40` // More transparent to be more subtle
                        : `${progressColor}30`,
                      borderRadius: 4,
                      left: 0,
                      zIndex: 2, // Middle z-index
                    },
                    previousProgressAnimatedStyle
                  ]}
                />
              )}
              
              {/* 3. Gain indicator (bright highlight for new XP) - ONLY IF NO LEVEL CHANGE */}
              {justCompleted && xpGain && xpGain > 0 && !hasLevelChanged && (
                <Animated.View
                  style={[
                    {
                      position: 'absolute',
                      height: '100%',
                      backgroundColor: colors.success,
                      borderRadius: 4,
                      left: `${previousProgressWidth.value}%`,
                      width: `${levelInfo.progressPercentage - previousProgressWidth.value}%`,
                      zIndex: 3, // Highest z-index to ensure it's on top
                      opacity: 0.8, // Slightly transparent to see underlying elements
                    },
                    gainIndicatorAnimatedStyle
                  ]}
                />
              )}
            </View>
          </View>
        </View>
        
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