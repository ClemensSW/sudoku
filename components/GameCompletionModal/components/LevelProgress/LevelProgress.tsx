// components/LevelProgress/LevelProgress.tsx
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
import { useLevelInfo, hasLeveledUp } from "./utils/useLevelInfo";
import { calculateExperience } from "./utils/levelData";
import LevelBadge from "./components/LevelBadge";
import PathInfo from "./components/PathInfo";
import { LevelProgressOptions } from "./utils/types";
import { GameStats } from "@/utils/storage";
import { Difficulty } from "@/utils/sudoku";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./LevelProgress.styles";

interface LevelProgressProps {
  // Entweder XP oder Stats muss angegeben werden
  xp?: number;
  previousXp?: number;
  
  // ODER Alternative: Stats-basierte Ansicht
  stats?: GameStats;
  difficulty?: Difficulty | string;
  justCompleted?: boolean;
  
  // Optional: XP-Gewinn anzeigen
  xpGain?: number;
  
  // Optional styling und Verhalten
  style?: any;
  compact?: boolean;
  onLevelUp?: (oldLevel: number, newLevel: number) => void;
  onPathChange?: (oldPathId: string, newPathId: string) => void;
  onPress?: () => void;
  
  // Konfigurationsoptionen
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
  // Theme für Farben verwenden
  const theme = useTheme();
  const colors = theme.colors;
  
  // Standard-Optionen mit benutzerdefinierten Optionen zusammenführen
  const defaultOptions: LevelProgressOptions = {
    enableLevelUpAnimation: true,
    usePathColors: true,
    showPathDescription: !compact,
    showMilestones: true,
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  // Berechne XP aus Stats, wenn XP nicht direkt übergeben wurde
  const calculatedXp = stats ? calculateExperience(stats) : 0;
  
  // Verwende entweder direkt übergebene XP oder berechnete XP aus Stats
  const currentXp = xp !== undefined ? xp : calculatedXp;
  const prevXp = previousXp !== undefined ? previousXp : (justCompleted && xpGain ? currentXp - xpGain : currentXp);
  
  // Berechne Level-Informationen mit dem Hook
  const levelInfo = useLevelInfo(currentXp);
  const previousLevelInfo = prevXp !== currentXp ? useLevelInfo(prevXp) : levelInfo;
  
  // State für Level-Up-Animation
  const [showLevelUpOverlay, setShowLevelUpOverlay] = useState(false);
  const levelUpTriggered = useRef(false);
  
  // Animation values
  const containerScale = useSharedValue(1);
  const progressWidth = useSharedValue(levelInfo.progressPercentage);
  const cardOpacity = useSharedValue(1);
  const xpGainOpacity = useSharedValue(0);
  
  // Überprüfe auf tatsächliches Level-Up - wichtige Korrektur
  useEffect(() => {
    // Nur bei tatsächlichem Level-Up, nicht bei jedem Spiel
    const didLevelUp = (previousXp !== undefined || xpGain !== undefined) && 
                        levelInfo.currentLevel > previousLevelInfo.currentLevel;
    
    if (didLevelUp && finalOptions.enableLevelUpAnimation && !levelUpTriggered.current) {
      // Level-Up-Animation starten
      levelUpTriggered.current = true;
      
      // Zeige Level-Up-Overlay
      setShowLevelUpOverlay(true);
      
      // Hebe den Container kurz hervor
      containerScale.value = withSequence(
        withTiming(1.05, { duration: 300, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
      );
      
      // Event-Handler aufrufen, falls vorhanden
      if (onLevelUp) {
        onLevelUp(previousLevelInfo.currentLevel, levelInfo.currentLevel);
      }
      
      // Level-Up-Overlay nach einer Weile ausblenden
      setTimeout(() => {
        setShowLevelUpOverlay(false);
        levelUpTriggered.current = false;
      }, 3000);
    }
    
    // Überprüfe auf Pfadwechsel
    if (previousLevelInfo && 
        previousLevelInfo.currentPath.id !== levelInfo.currentPath.id && 
        onPathChange) {
      onPathChange(previousLevelInfo.currentPath.id, levelInfo.currentPath.id);
    }
    
    // Aktualisiere den Fortschrittsbalken
    progressWidth.value = withTiming(levelInfo.progressPercentage, { 
      duration: 800, 
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
    });
    
    // XP-Gewinn-Animation, wenn vorhanden
    if (xpGain && xpGain > 0) {
      xpGainOpacity.value = withSequence(
        withDelay(500, withTiming(1, { duration: 400 })),
        withDelay(2000, withTiming(0, { duration: 1000 }))
      );
    }
  }, [currentXp, prevXp, levelInfo, previousLevelInfo, xpGain]);
  
  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    opacity: cardOpacity.value,
  }));
  
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));
  
  const xpGainAnimatedStyle = useAnimatedStyle(() => ({
    opacity: xpGainOpacity.value,
  }));
  
  // Entscheide die anzuzeigende Farbe basierend auf den Optionen
  const progressColor = finalOptions.usePathColors 
    ? levelInfo.currentPath.color 
    : colors.primary;
  
  // Formatiere XP-Gewinn-Text
  const formatXpGainText = () => {
    if (!xpGain || xpGain <= 0) return "";
    return `+${xpGain} XP`;
  };
    
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
      >
        {/* XP-Gewinn-Anzeige (neu) */}
        {xpGain && xpGain > 0 && (
          <Animated.View 
            style={[
              styles.xpGainBadge,
              { backgroundColor: colors.success },
              xpGainAnimatedStyle
            ]}
          >
            <Feather name="plus" size={12} color="white" />
            <Text style={styles.xpGainText}>{formatXpGainText()}</Text>
          </Animated.View>
        )}
        
        {/* Level-Info-Zeile mit Badge */}
        <View style={styles.header}>
          <LevelBadge 
            levelInfo={levelInfo}
            size={compact ? 40 : 56}
            showAnimation={showLevelUpOverlay}
          />
          
          <View style={styles.levelInfoContainer}>
            {/* Level-Name und Nachricht */}
            <Text style={[styles.levelName, { color: colors.textPrimary }]}>
              {levelInfo.levelData.name}
            </Text>
            
            {!compact && (
              <Text style={[styles.levelMessage, { color: colors.textSecondary }]} numberOfLines={2}>
                {levelInfo.levelData.message}
              </Text>
            )}
          </View>
        </View>
        
        {/* Pfad-Info - ohne Fortschrittsleiste */}
        {!compact && (
          <View style={[
            styles.pathInfoContainer, 
            { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
          ]}>
            <PathInfo 
              levelInfo={levelInfo} 
              showDescription={finalOptions.showPathDescription}
            />
          </View>
        )}
        
        {/* Fortschrittsbereich mit verbessertem Layout */}
        <View style={styles.progressSection}>
          {/* XP-Info mit besserem Layout */}
          <View style={styles.xpInfoRow}>
            <Text style={[styles.xpText, { color: colors.textPrimary }]}>
              <Text style={[styles.xpLabel, { color: colors.textSecondary }]}>Level {levelInfo.currentLevel + 1}: </Text>
              
            </Text>
            
            {levelInfo.nextLevelData && (
              <Text style={[styles.xpToGo, { color: colors.textSecondary }]}>
                Noch {levelInfo.xpForNextLevel} EP
              </Text>
            )}
          </View>
          
          {/* Fortschrittsbalken */}
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBackground,
                { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)' }
              ]}
            >
              <Animated.View
                style={[
                  styles.progressFill,
                  { backgroundColor: progressColor },
                  progressAnimatedStyle
                ]}
              />
            </View>
          </View>
        </View>
        
        {/* Optional: Meilenstein oder Pfad-Abschluss-Nachricht */}
        {(finalOptions.showMilestones && (levelInfo.milestoneMessage || levelInfo.pathCompletionMessage)) && (
          <Animated.View 
            style={[
              styles.milestoneContainer,
              { 
                backgroundColor: `${progressColor}15`,
                borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }
            ]}
            entering={FadeIn.duration(500).delay(300)}
          >
            <Text style={[styles.milestoneText, { color: colors.textSecondary }]}>
              {levelInfo.milestoneMessage || levelInfo.pathCompletionMessage}
            </Text>
          </Animated.View>
        )}
        
        {/* Level-Up-Overlay */}
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
                borderColor: 'rgba(255,255,255,0.2)' 
              }
            ]}>
              <Text style={styles.levelUpText}>Level Up!</Text>
              
              <LevelBadge 
                levelInfo={levelInfo}
                size={80}
                showAnimation={true}
                animationDelay={300}
              />
              
              <Text style={styles.newLevelName}>
                {levelInfo.displayName}
              </Text>
              
              <Text style={styles.newLevelMessage}>
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