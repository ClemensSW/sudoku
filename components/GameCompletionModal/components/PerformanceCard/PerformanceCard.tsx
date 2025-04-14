// components/GameCompletionModal/components/PerformanceCard/PerformanceCard.tsx
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  FadeIn,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { CircularProgress } from "@/components/CircularProgress/CircularProgress";
import styles from "./PerformanceCard.styles";

interface PerformanceCardProps {
  timeElapsed: number;
  previousBestTime: number;
  isNewRecord: boolean;
  autoNotesUsed: boolean;
}

// Helper to format time (mm:ss)
const formatTime = (seconds: number): string => {
  if (seconds === Infinity || seconds === 0) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

// Berechne die Verbesserung in Prozent
const calculateImprovement = (
  currentTime: number,
  previousTime: number
): number => {
  if (previousTime === Infinity || previousTime === 0) return 0;
  const improvement = ((previousTime - currentTime) / previousTime) * 100;
  return Math.round(improvement);
};

// Berechne die Leistung im Verhältnis zur Bestzeit
const calculatePerformance = (
  currentTime: number,
  bestTime: number,
  isNewRecord: boolean
): number => {
  // If it's a new record, always return 100%
  if (isNewRecord) {
    return 100;
  }
  
  // Handle cases where there's no valid previous best time
  if (bestTime === Infinity || bestTime === 0) {
    return 100; // First time completing this difficulty
  }

  // If current time is close to best time (90%-110% of best time)
  const ratio = bestTime / currentTime;
  if (ratio >= 1) {
    // If current time is better than or equal to best time
    return 100;
  } else if (ratio >= 0.9) {
    // Between 90% and 99%
    return Math.round(ratio * 100);
  }

  // For worse performance, based on ratio
  const performance = Math.max(60, Math.min(85, ratio * 90));
  return Math.round(performance);
};

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  timeElapsed,
  previousBestTime,
  isNewRecord,
  autoNotesUsed,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Animation values
  const containerScale = useSharedValue(0.95);
  const progressValue = useSharedValue(0);
  const progressGlowOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const clockRotation = useSharedValue(0);
  
  // Berechne Performance und Verbesserung
  const performance = calculatePerformance(
    timeElapsed,
    previousBestTime,
    isNewRecord
  );
  const improvement = isNewRecord
    ? calculateImprovement(timeElapsed, previousBestTime)
    : 0;
  
  // Ermittle die richtige Farbe basierend auf der Leistung
  const getPerformanceColor = (): string => {
    if (isNewRecord) return colors.success;
    if (performance >= 95) return colors.success;
    if (performance >= 80) return colors.primary;
    if (performance >= 70) return colors.warning;
    return colors.error;
  };
  
  // Animationen starten, wenn die Komponente gemountet wird
  useEffect(() => {
    // Container entry animation
    containerScale.value = withTiming(1, {
      duration: 400,
      easing: Easing.bezierFn(0.16, 1, 0.3, 1), // Custom easing
    });
    
    // Progress value animation
    progressValue.value = withDelay(300, withTiming(performance, {
      duration: 1500,
      easing: Easing.bezierFn(0.34, 1.56, 0.64, 1), // Custom bouncy easing
    }));
    
    // Clock rotation animation
    clockRotation.value = withSequence(
      withDelay(300, withTiming(-0.1, { 
        duration: 200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })),
      withTiming(0, { 
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
    
    // For new records, add special animations
    if (isNewRecord) {
      // Pulsing animation for new record
      pulseScale.value = withDelay(800, withRepeat(
        withSequence(
          withTiming(1.05, { 
            duration: 700, 
            easing: Easing.inOut(Easing.sin)
          }),
          withTiming(1, { 
            duration: 700, 
            easing: Easing.inOut(Easing.sin)
          })
        ),
        3, // Repeat 3 times
        false // Don't reverse
      ));
      
      // Glow effect for progress
      progressGlowOpacity.value = withDelay(1000, withRepeat(
        withSequence(
          withTiming(0.8, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.3, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // Repeat infinitely
        true // Reverse
      ));
    }
  }, []);
  
  // Animated Styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));
  
  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));
  
  const progressGlowStyle = useAnimatedStyle(() => ({
    opacity: progressGlowOpacity.value,
  }));
  
  const clockIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${clockRotation.value}rad` }],
  }));

  // Show record badge conditionally
  const showRecordBadge = isNewRecord || 
                          (performance === 100) || 
                          (timeElapsed <= previousBestTime && previousBestTime !== Infinity);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.isDark ? colors.surface : "#FFFFFF" },
        containerAnimatedStyle
      ]}
      entering={FadeIn.duration(500)}
    >
      {/* Header with title and record badge */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Spielleistung
        </Text>
        
        {/* Always show the badge when it's a new record */}
        {showRecordBadge && (
          <Animated.View
            style={[
              styles.recordBadge, 
              { backgroundColor: colors.success },
              pulseAnimatedStyle
            ]}
          >
            <Feather name="award" size={12} color="white" />
            <Text style={styles.recordText}>Rekord</Text>
          </Animated.View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        {/* Performance Circle */}
        <View style={styles.performanceContainer}>
          <View style={styles.progressCircleContainer}>
            {/* Glow effect behind the circle - new! */}
            {isNewRecord && (
              <Animated.View 
                style={[
                  styles.progressGlow,
                  { backgroundColor: `${getPerformanceColor()}20` },
                  progressGlowStyle
                ]} 
              />
            )}
            
            {/* Progress circle */}
            <CircularProgress
              value={performance}
              radius={45}
              strokeWidth={10}
              duration={1500}
              color={getPerformanceColor()}
              inActiveColor={
                theme.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)"
              }
              max={100}
              showPercentage={false}
              textStyle={{ color: 'transparent' }} // Make the CircularProgress's built-in text transparent
            />
            
            {/* Center value */}
            <Animated.Text
              style={[
                styles.performanceValue,
                { color: colors.textPrimary },
                isNewRecord && pulseAnimatedStyle,
              ]}
            >
              {performance}%
            </Animated.Text>
          </View>
        </View>
        
        {/* Time Statistics */}
        <View style={styles.timeStatsContainer}>
          {/* Current Time */}
          <View style={styles.timeStatItem}>
            <View style={styles.timeStatHeader}>
              <Animated.View style={clockIconStyle}>
                <Feather 
                  name="clock" 
                  size={14} 
                  color={colors.textSecondary} 
                  style={styles.timeIcon}
                />
              </Animated.View>
              <Text
                style={[styles.timeStatLabel, { color: colors.textSecondary }]}
              >
                Deine Zeit
              </Text>
            </View>
            <View style={styles.timeStatValueContainer}>
              <Text
                style={[styles.timeStatValue, { color: colors.textPrimary }]}
              >
                {formatTime(timeElapsed)}
              </Text>
            </View>
          </View>
          
          {/* Best Time */}
          <View style={styles.timeStatItem}>
            <View style={styles.timeStatHeader}>
              <Feather 
                name="award" 
                size={14} 
                color={isNewRecord ? colors.success : colors.textSecondary} 
                style={styles.timeIcon}
              />
              <Text
                style={[
                  styles.timeStatLabel, 
                  { 
                    color: isNewRecord ? colors.success : colors.textSecondary,
                    fontWeight: isNewRecord ? "700" : "600"
                  }
                ]}
              >
                Bestzeit
              </Text>
            </View>
            <View style={styles.timeStatValueContainer}>
              <Text
                style={[
                  styles.timeStatValue,
                  {
                    color: isNewRecord ? colors.success : colors.textPrimary,
                    fontWeight: isNewRecord ? "800" : "700",
                  },
                ]}
              >
                {isNewRecord
                  ? formatTime(timeElapsed)
                  : previousBestTime === Infinity
                  ? "--:--"
                  : formatTime(previousBestTime)}
              </Text>
              
              {/* Improvement indicator */}
              {isNewRecord && improvement > 0 && (
                <Animated.View
                  style={[
                    styles.newRecordContainer,
                    pulseAnimatedStyle,
                  ]}
                >
                  <View style={[
                    styles.improvementBadge,
                    { backgroundColor: colors.success }
                  ]}>
                    <Feather
                      name="trending-down"
                      size={12}
                      color="white"
                      style={{ marginRight: 2 }}
                    />
                    <Text style={styles.improvementBadgeText}>
                      {improvement}%
                    </Text>
                  </View>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </View>
      
      {/* Auto Notes Warning */}
      {autoNotesUsed && (
        <View
          style={[
            styles.autoNotesContainer,
            { backgroundColor: `${colors.warning}15` },
          ]}
        >
          <Feather name="info" size={14} color={colors.warning} />
          <Text
            style={[styles.autoNotesText, { color: colors.textSecondary }]}
          >
            Da automatische Notizen verwendet wurden, wird dieses Spiel nicht in
            den Statistiken gezählt.
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default PerformanceCard;