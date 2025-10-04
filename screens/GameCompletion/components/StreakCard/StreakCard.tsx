// components/GameCompletionModal/components/StreakDisplay/StreakDisplay.tsx
import React, { useEffect } from "react";
import { View, Text, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  FadeIn,
  SlideInRight,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./StreakCard.styles";

export interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  isRecord: boolean;
  style?: ViewStyle;
}

const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
  isRecord,
  style // Neue style-Prop
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Animation values
  const progressWidth = useSharedValue(0);
  const containerScale = useSharedValue(1);
  const flameScales = Array.from({ length: Math.min(currentStreak, 5) }, () => useSharedValue(1));
  const flameOpacity = useSharedValue(0.5);
  
  // Calculate percentage for progress bar
  const progressPercentage = Math.min(
    100,
    longestStreak > 0 ? (currentStreak / longestStreak) * 100 : 0
  );
  
  // Get motivational message based on streak
  const getMotivationalText = () => {
    if (isRecord) return "Neuer Rekord erreicht!";
    if (currentStreak >= 10) return "Beeindruckende Serie!";
    if (currentStreak >= 5) return "Starke Leistung!";
    if (currentStreak >= 3) return "Gute Serie!";
    if (currentStreak === 0) return "Bereit für dein nächsten Rekord!";
    return "Weiter so!";
  };
  
  // Start animations when component mounts
  useEffect(() => {
    // Initial animation for container
    containerScale.value = withSequence(
      withTiming(1.03, { duration: 300 }),
      withTiming(1, { duration: 200 })
    );
    
    // Progress bar animation with easing
    progressWidth.value = withTiming(progressPercentage, {
      duration: 1200,
      easing: Easing.bezierFn(0.16, 1, 0.3, 1), // Custom easing for smoother animation
    });
    
    // Pulsating glow effect for flames
    flameOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      true // Reverse animation
    );
    
    // Individual flame animations with staggered timing
    flameScales.forEach((scale, index) => {
      // Pop-in animation
      scale.value = withDelay(
        300 + index * 150,
        withSequence(
          withTiming(1.4, { 
            duration: 300, 
            easing: Easing.out(Easing.back(1.5)) // Bounce effect with back parameter
          }),
          withTiming(1, { duration: 200 })
        )
      );
      
      // Add subtle continuous animation after initial pop-in
      setTimeout(() => {
        const pulseAnimation = () => {
          scale.value = withSequence(
            withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.sin) }),
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.sin) })
          );
          
          // Set random interval to make all flames pulse independently
          setTimeout(pulseAnimation, 2000 + Math.random() * 2000);
        };
        
        pulseAnimation();
      }, 1500 + index * 300);
    });
  }, []);
  
  // Animated Styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }]
  }));
  
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));
  
  const flameContainerStyle = useAnimatedStyle(() => ({
    opacity: flameOpacity.value
  }));
  
  // Render flame icons based on current streak
  const renderFlames = () => {
    // Max 5 flames shown, then text
    const flamesToShow = Math.min(currentStreak, 5);
    const hasMoreFlames = currentStreak > 5;
    
    return (
      <View style={styles.flamesContainer}>
        {/* Glow background for flames */}
        <Animated.View 
          style={[
            styles.flameGlowContainer,
            { backgroundColor: `${colors.warning}15` },
            flameContainerStyle
          ]}
        />
        
        {Array.from({ length: flamesToShow }).map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: flameScales[index].value }],
          }));
          
          return (
            <Animated.View
              key={`flame-${index}`}
              style={[
                styles.flameIconContainer,
                {
                  backgroundColor: `${colors.warning}20`,
                },
                animatedStyle,
              ]}
            >
              <Feather name="zap" size={20} color={colors.warning} />
            </Animated.View>
          );
        })}
        
        {/* Show "+X more" for streaks >5 */}
        {hasMoreFlames && (
          <Animated.View
            style={[
              styles.streakCountBadge,
              { backgroundColor: colors.warning }
            ]}
            entering={SlideInRight.delay(800).duration(400)}
          >
            <Text style={styles.streakCountText}>
              +{currentStreak - 5}
            </Text>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
        },
        containerAnimatedStyle,
        style // Hier wenden wir den zusätzlichen Style an
      ]}
      entering={FadeIn.duration(500)}
    >
      {/* Header with title and record badge */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Siegesserie
        </Text>
        
        {isRecord && (
          <View
            style={[styles.recordBadge, { backgroundColor: colors.success }]}
          >
            <Feather name="award" size={12} color="white" />
            <Text style={styles.recordText}>Rekord</Text>
          </View>
        )}
      </View>
      
      {/* Motivation text */}
      <Text style={[styles.motivationText, { color: colors.textSecondary }]}>
        {getMotivationalText()}
      </Text>
      
      {/* Flame icons for visual representation of streak */}
      {renderFlames()}
      
      {/* Current streak counter */}
      <View style={styles.currentStreakContainer}>
        <Text style={[styles.currentStreakValue, { color: colors.textPrimary }]}>
          {currentStreak}
        </Text>
        <Text style={[styles.currentStreakLabel, { color: colors.textSecondary }]}>
          {currentStreak === 1 ? "Sieg in Folge" : "Siege in Folge"}
        </Text>
      </View>
      
      {/* Progress bar to record */}
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
              { backgroundColor: colors.warning },
              progressAnimatedStyle,
            ]}
          />
        </View>
        
        <View style={styles.progressLabelContainer}>
          <Text
            style={[styles.progressLabel, { color: colors.textSecondary }]}
          >
            {progressPercentage < 100
              ? "Nächstes Ziel"
              : "Beste Serie!"}
          </Text>
          
          <Text style={[styles.streakValue, { color: colors.textPrimary }]}>
            {longestStreak}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default React.memo(StreakCard);