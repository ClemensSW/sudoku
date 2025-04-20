// components/GameCompletionModal/GameCompletionModal.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, BackHandler } from "react-native";
import Animated, {
  FadeIn,
  SlideInUp,
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
import { useLandscapes } from "@/hooks/useLandscapes";
import { PuzzleProgress } from "@/components/LandscapeCollection";

// Import der zentralen XP-Berechnungsfunktion
import { calculateXpGain } from './components/LevelProgress/utils/levelData';

// Components
import PerformanceCard from "./components/PerformanceCard/PerformanceCard";
import StreakDisplay from "./components/StreakDisplay/StreakDisplay";
import LevelProgress from "./components/LevelProgress/LevelProgress";
import FeedbackMessage from "./components/FeedbackMessage/FeedbackMessage";
import ConfettiEffect from "./components/ConfettiEffect/ConfettiEffect";
import Button from "@/components/Button/Button";

// Styles
import styles from "./GameCompletionModal.styles";

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

// Function to check if it's a new record
const isNewRecord = (
  timeElapsed: number, 
  stats: GameStats | null, 
  difficulty: Difficulty,
  autoNotesUsed: boolean
): boolean => {
  if (autoNotesUsed || !stats) return false;
  
  const bestTimeKey = `bestTime${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}` as keyof GameStats;
  const previousBestTime = stats[bestTimeKey] as number;
  
  return timeElapsed < previousBestTime && previousBestTime !== 0 && previousBestTime !== Infinity;
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
    easy: "#4A7D78",   // Primary
    medium: "#FF9800", // Orange
    hard: "#F44336",   // Red
    expert: "#9C27B0", // Purple
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
  
  // Landscape Collection Integration
  const { 
    currentLandscape, 
    unlockNext, 
    unlockEvent, 
    clearUnlockEvent,
    getLastUnlockEvent // NEU: Hinzugefügt
  } = useLandscapes();
  
  // State for landscape unlock tracking
  const [newlyUnlockedSegmentId, setNewlyUnlockedSegmentId] = useState<number | undefined>(undefined);
  const [landscapeCompleted, setLandscapeCompleted] = useState(false);
  
  // Bei erfolgreicher Spielbeendigung (wenn Spiel gewonnen ist und keine Auto-Notizen verwendet wurden)
  // und wenn das Modal sichtbar wird, hole das letzte Unlock-Event
  useEffect(() => {
    if (visible && !autoNotesUsed) {
      // Verzögerung, um Animation der anderen Elemente abzuwarten
      const timer = setTimeout(async () => {
        // GEÄNDERT: Statt erneut freizuschalten, rufe das letzte gespeicherte Event ab
        const event = await getLastUnlockEvent();
        if (event) {
          if (event.type === "segment") {
            setNewlyUnlockedSegmentId(event.segmentId);
          } else if (event.type === "complete") {
            setLandscapeCompleted(true);
          }
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [visible, autoNotesUsed, getLastUnlockEvent]);
  
  // Zurücksetzen des Unlock-Event-Status, wenn das Modal geschlossen wird
  useEffect(() => {
    if (!visible) {
      setNewlyUnlockedSegmentId(undefined);
      setLandscapeCompleted(false);
      clearUnlockEvent();
    }
  }, [visible, clearUnlockEvent]);
  
  // Calculate XP gain for this game using the centralized function
  const xpGain = calculateXpGain(difficulty, timeElapsed, autoNotesUsed);
  
  // Animation values
  const modalScale = useSharedValue(0.95);
  const modalOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  
  // Status variables
  const newRecord = isNewRecord(timeElapsed, stats || null, difficulty, autoNotesUsed);
  
  // Gradient Colors
  const gradientStart = getDifficultyColor(difficulty);
  const gradientEnd = theme.isDark ? "#333333" : "#FFFFFF";
  
  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible) {
          onContinue();
          return true;
        }
        return false;
      }
    );
    
    return () => backHandler.remove();
  }, [visible, onContinue]);
  
  // Start animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animation values if needed
      modalScale.value = 0.95;
      modalOpacity.value = 0;
      contentOpacity.value = 0;
      
      // Start animations
      modalScale.value = withTiming(1, {
        duration: 350,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      modalOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      // Content fade in slightly delayed
      setTimeout(() => {
        contentOpacity.value = withTiming(1, {
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }, 200);
    }
  }, [visible]);
  
  // Animated styles
  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalOpacity.value,
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });
  
  // Handler für Galerieansicht
  const handleViewGallery = () => {
    onClose(); // Modal schließen
    
    // Kurze Verzögerung für bessere Animation
    setTimeout(() => {
      router.push("/gallery");
    }, 300);
  };
  
  // UPDATED: Properly restart the game by navigating to game screen with current difficulty
  const handleNewGame = () => {
    // First close the modal
    onClose();
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      // Navigate to game screen with difficulty parameter to completely restart the game
      router.replace({
        pathname: "/game",
        params: { difficulty }
      });
    }, 200);
  };
  
  // Don't render anything if not visible
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
            borderRadius: 0
          }, 
          modalAnimatedStyle
        ]}
      >
        {/* Confetti effect for celebration */}
        <ConfettiEffect isActive={visible} />
        
        {/* Gradient header */}
        <LinearGradient
          colors={[gradientStart, theme.isDark ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.8 }}
          style={styles.headerGradient}
        />
        
        {/* Title Section */}
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
        
        {/* ScrollView with REORDERED components */}
        <ScrollView
          style={{ width: "100%", flex: 1 }}
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: 240 } // Increased padding to ensure more scrollable space below content
          ]}
          showsVerticalScrollIndicator={true}
        >
          <Animated.View style={contentAnimatedStyle}>
            {/* 1. Level Progress - calculate based on stats */}
            {stats && !autoNotesUsed && (
              <>
                <LevelProgress 
                  stats={stats}
                  difficulty={difficulty}
                  justCompleted={true}
                  xpGain={xpGain} // Pass xpGain to LevelProgress
                />
                <View style={styles.sectionSpacer} />
              </>
            )}
            
            {/* NEUE KOMPONENTE: PuzzleProgress für Landschaftsbilder */}
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
            
            {/* 2. Streak Display - only show if relevant */}
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
            
            {/* 3. Performance Card */}
            <PerformanceCard 
              timeElapsed={timeElapsed}
              previousBestTime={stats ? stats[`bestTime${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}` as keyof GameStats] as number : Infinity}
              isNewRecord={newRecord}
              autoNotesUsed={autoNotesUsed}
            />
            
            <View style={styles.sectionSpacer} />
            
            {/* 4. Feedback Message */}
            <FeedbackMessage 
              difficulty={difficulty}
              timeElapsed={timeElapsed}
              isNewRecord={newRecord}
              autoNotesUsed={autoNotesUsed}
              streak={stats?.currentStreak || 0}
            />
            
            {/* Auto-notes warning if needed */}
            {autoNotesUsed && (
              <View style={[styles.separator, { backgroundColor: colors.warning }]} />
            )}
          </Animated.View>
        </ScrollView>
        
        {/* Fixed Button Container with theme-aware styling */}
        <View style={[styles.buttonContainer, 
          { 
            backgroundColor: theme.isDark ? 
              colors.background : // Use background color in dark mode
              colors.card, // Use card color in light mode
            borderTopWidth: 1,
            borderTopColor: theme.isDark ? 
              'rgba(255,255,255,0.1)' : // Subtle border in dark mode
              'rgba(0,0,0,0.05)' // Subtle border in light mode
          }
        ]}>
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