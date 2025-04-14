import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
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
  if (isNewRecord || bestTime === Infinity || bestTime === 0) {
    return 100; // Wenn neuer Rekord, dann 100%
  }

  // Wenn die aktuelle Zeit in der Nähe der Bestzeit ist (90%-110% der Bestzeit)
  const ratio = bestTime / currentTime;
  if (ratio >= 0.9 && ratio <= 1.1) {
    // Zwischen 90% und 100%
    return Math.min(Math.round(ratio * 100), 99);
  }

  // Bei schlechterer Leistung, je nach Verhältnis
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
  const pulseScale = useSharedValue(1);
  
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
    // Starte eine Pulsation für den Erfolg
    if (isNewRecord) {
      pulseScale.value = withSequence(
        withDelay(
          500,
          withTiming(1.1, { duration: 300, easing: Easing.out(Easing.ease) })
        ),
        withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) }),
        withDelay(
          1000,
          withTiming(1.1, { duration: 300, easing: Easing.out(Easing.ease) })
        ),
        withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
      );
    }
  }, []);
  
  // Animated Styles
  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.isDark ? colors.surface : "#FFFFFF" },
      ]}
      entering={FadeIn.duration(500)}
    >
      <View style={styles.contentContainer}>
        {/* Performance Circle */}
        <View style={styles.performanceContainer}>
          <View style={styles.progressCircleContainer}>
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
            />
            
            {/* Zentrale Zahl in der Mitte des Kreises */}
            <Animated.Text
              style={[
                styles.performanceValue,
                { color: colors.textPrimary },
                pulseAnimatedStyle,
              ]}
            >
              {performance}%
            </Animated.Text>
          </View>
          
          <Text
            style={[styles.performanceLabel, { color: colors.textSecondary }]}
          >
            Leistung
          </Text>
        </View>
        
        {/* Time Statistics */}
        <View style={styles.timeStatsContainer}>
          {/* Current Time */}
          <View style={styles.timeStatItem}>
            <Text
              style={[styles.timeStatLabel, { color: colors.textSecondary }]}
            >
              Deine Zeit
            </Text>
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
            <Text
              style={[styles.timeStatLabel, { color: colors.textSecondary }]}
            >
              Bestzeit
            </Text>
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
              {isNewRecord && (
                <Animated.View
                  style={[
                    styles.newRecordContainer,
                    pulseAnimatedStyle,
                  ]}
                >
                  <Feather
                    name="trending-down"
                    size={16}
                    color={colors.success}
                    style={styles.improvementIcon}
                  />
                  <Text
                    style={[
                      styles.improvementText,
                      { color: colors.success },
                    ]}
                  >
                    {improvement}%
                  </Text>
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