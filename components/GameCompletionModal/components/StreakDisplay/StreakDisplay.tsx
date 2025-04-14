import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  SlideInRight,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./StreakDisplay.styles";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  isRecord: boolean;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
  isRecord,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Animation values
  const progressWidth = useSharedValue(0);
  const flameScales = Array.from({ length: Math.min(currentStreak, 5) }, () => useSharedValue(1));
  
  // Berechne Prozentsatz für den Fortschrittsbalken
  const progressPercentage = Math.min(
    100,
    longestStreak > 0 ? (currentStreak / longestStreak) * 100 : 0
  );
  
  // Starte Animationen, wenn die Komponente gemountet wird
  useEffect(() => {
    // Progressbar Animation
    progressWidth.value = withTiming(progressPercentage, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    // Individuelle Flammen-Animationen
    flameScales.forEach((scale, index) => {
      scale.value = withDelay(
        300 + index * 150,
        withSequence(
          withTiming(1.3, { duration: 300, easing: Easing.outBack }),
          withTiming(1, { duration: 200 })
        )
      );
      
      // Zusätzliche Pulsation für visuelle Attraktivität
      setTimeout(() => {
        const pulseAnimation = () => {
          scale.value = withSequence(
            withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
          );
          
          // Stelle ein zufälliges Intervall ein, um alle Flammen unabhängig pulsieren zu lassen
          setTimeout(pulseAnimation, 3000 + Math.random() * 2000);
        };
        
        pulseAnimation();
      }, 1500 + index * 500);
    });
  }, []);
  
  // Animated Styles
  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });
  
  // Rendere Flammen-Icons basierend auf dem aktuellen Streak
  const renderFlames = () => {
    // Maximal 5 Flammen anzeigen, danach Text
    const flamesToShow = Math.min(currentStreak, 5);
    const hasMoreFlames = currentStreak > 5;
    
    return (
      <View style={styles.flamesContainer}>
        {Array.from({ length: flamesToShow }).map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            return {
              transform: [{ scale: flameScales[index].value }],
            };
          });
          
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
        
        {/* Zeige "+X weitere" wenn mehr als 5 Siege */}
        {hasMoreFlames && (
          <Animated.Text
            style={[
              styles.streakCountText,
              { color: colors.textPrimary },
            ]}
            entering={SlideInRight.delay(800).duration(400)}
          >
            +{currentStreak - 5} weitere
          </Animated.Text>
        )}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.isDark ? colors.surface : "#FFFFFF" },
      ]}
      entering={FadeIn.duration(500)}
    >
      {/* Header mit Titel und Rekord-Badge, falls zutreffend */}
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
      
      {/* Flammen-Icons für die visuelle Darstellung der Serie */}
      {renderFlames()}
      
      {/* Fortschrittsbalken zum Rekord */}
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
              ? `${Math.round(progressPercentage)}% zum Rekord`
              : "Rekord erreicht!"}
          </Text>
          
          <Text style={[styles.streakValue, { color: colors.textPrimary }]}>
            {currentStreak} / {longestStreak}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default StreakDisplay;