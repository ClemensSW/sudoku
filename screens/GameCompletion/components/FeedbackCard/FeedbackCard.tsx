import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import styles from "./FeedbackCard.styles";

export interface FeedbackCardProps {
  difficulty: Difficulty;
  timeElapsed: number;
  isNewRecord: boolean;
  autoNotesUsed: boolean;
  streak: number;
}

// Generiere eine personalisierte Nachricht basierend auf Spielleistung
const generateMessage = (
  t: any,
  difficulty: Difficulty,
  timeElapsed: number,
  isNewRecord: boolean,
  autoNotesUsed: boolean,
  streak: number
): string => {
  // Wenn Auto-Notizen verwendet wurden
  if (autoNotesUsed) {
    const autoNotesMessages = t('feedback.autoNotes', { returnObjects: true }) as string[];
    return autoNotesMessages[Math.floor(Math.random() * autoNotesMessages.length)];
  }

  const timeInMinutes = timeElapsed / 60;

  const excellentMessages = t('feedback.excellent', { returnObjects: true }) as string[];
  const veryGoodMessages = t('feedback.veryGood', { returnObjects: true }) as string[];
  const goodMessages = t('feedback.good', { returnObjects: true }) as string[];
  const averageMessages = t('feedback.average', { returnObjects: true }) as string[];

  // Streak messages (30% chance for streaks >= 3)
  if (streak >= 3 && Math.random() < 0.3) {
    const streakMessages = t('feedback.streak', { returnObjects: true }) as string[];
    const randomMessage = streakMessages[Math.floor(Math.random() * streakMessages.length)];
    return randomMessage.replace('{{count}}', streak.toString());
  }

  // New Record messages
  if (isNewRecord) {
    const recordMessages = t('feedback.newRecord', { returnObjects: true }) as string[];
    return recordMessages[Math.floor(Math.random() * recordMessages.length)];
  }

  // Performance-based messages
  if (timeInMinutes < 3 || (difficulty === "expert" && timeInMinutes < 10)) {
    return excellentMessages[Math.floor(Math.random() * excellentMessages.length)];
  } else if (timeInMinutes < 5 || (difficulty === "hard" && timeInMinutes < 8)) {
    return veryGoodMessages[Math.floor(Math.random() * veryGoodMessages.length)];
  } else if (timeInMinutes < 8 || (difficulty === "hard" && timeInMinutes < 12)) {
    return goodMessages[Math.floor(Math.random() * goodMessages.length)];
  } else {
    return averageMessages[Math.floor(Math.random() * averageMessages.length)];
  }
};

// Helper function to format time
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  difficulty,
  timeElapsed,
  isNewRecord,
  autoNotesUsed,
  streak,
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const colors = theme.colors;

  // Animation values
  const iconScale = useSharedValue(1);
  const quoteScale = useSharedValue(0.7);

  // Generiere Nachricht
  const message = generateMessage(
    t,
    difficulty,
    timeElapsed,
    isNewRecord,
    autoNotesUsed,
    streak
  );
  
  // Starte Animationen, wenn die Komponente gemountet wird
  useEffect(() => {
    // Icon pulsieren lassen
    const pulseAnimation = () => {
      iconScale.value = withSequence(
        withDelay(
          2000,
          withTiming(1.2, { duration: 600, easing: Easing.out(Easing.ease) })
        ),
        withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
      );
      
      // Wiederhole die Animation nach einer zufälligen Verzögerung
      setTimeout(pulseAnimation, 5000 + Math.random() * 2000);
    };
    
    // Zitat-Icon sanft schweben lassen
    const floatAnimation = () => {
      quoteScale.value = withSequence(
        withTiming(0.8, { 
          duration: 1500, 
          easing: Easing.inOut(Easing.ease) 
        }),
        withTiming(0.7, { 
          duration: 1500, 
          easing: Easing.inOut(Easing.ease) 
        })
      );
      
      // Wiederhole die Animation
      setTimeout(floatAnimation, 3000);
    };
    
    // Starte beide Animationen
    pulseAnimation();
    floatAnimation();
  }, []);
  
  // Animated Styles
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });
  
  const quoteAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: quoteScale.value }],
    };
  });
  
  // Get appropriate icon based on message content
  const getMessageIcon = (): string => {
    if (isNewRecord) return "award";
    if (autoNotesUsed) return "edit-3";
    if (streak >= 5) return "zap";
    if (streak >= 3) return "activity";
    
    // Basierend auf Schwierigkeit und Zeit
    const timeInMinutes = timeElapsed / 60;
    
    if (difficulty === "expert") {
      return timeInMinutes < 10 ? "award" : "star";
    }
    if (difficulty === "hard") {
      return timeInMinutes < 6 ? "star" : "thumbs-up";
    }
    if (difficulty === "medium") {
      return timeInMinutes < 4 ? "star" : "check-circle";
    }
    
    return timeInMinutes < 2 ? "zap" : "smile";
  };
  
  // Get appropriate color for icon container based on message
  const getIconContainerColor = (): string => {
    if (isNewRecord) return `${colors.success}30`;
    if (autoNotesUsed) return `${colors.warning}30`;
    if (streak >= 5) return `${colors.warning}30`;
    if (streak >= 3) return `${colors.primary}30`;
    
    // Basierend auf Schwierigkeit und Zeit
    const timeInMinutes = timeElapsed / 60;
    
    if (difficulty === "expert") {
      return timeInMinutes < 10 ? `${colors.success}30` : `${colors.secondary}30`;
    }
    if (difficulty === "hard") {
      return timeInMinutes < 6 ? `${colors.success}30` : `${colors.warning}30`;
    }
    if (difficulty === "medium") {
      return timeInMinutes < 4 ? `${colors.success}30` : `${colors.primary}30`;
    }
    
    return timeInMinutes < 2 ? `${colors.success}30` : `${colors.primary}30`;
  };
  
  // Get color for icon based on message
  const getIconColor = (): string => {
    if (isNewRecord) return colors.success;
    if (autoNotesUsed) return colors.warning;
    if (streak >= 5) return colors.warning;
    if (streak >= 3) return colors.primary;
    
    // Basierend auf Schwierigkeit und Zeit
    const timeInMinutes = timeElapsed / 60;
    
    if (difficulty === "expert") {
      return timeInMinutes < 10 ? colors.success : colors.secondary;
    }
    if (difficulty === "hard") {
      return timeInMinutes < 6 ? colors.success : colors.warning;
    }
    if (difficulty === "medium") {
      return timeInMinutes < 4 ? colors.success : colors.primary;
    }
    
    return timeInMinutes < 2 ? colors.success : colors.primary;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surface},
      ]}
      entering={FadeIn.duration(600).delay(500)}
    >
      <View style={styles.messageContainer}>
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: getIconContainerColor() },
            iconAnimatedStyle,
          ]}
        >
          <Feather
            name={getMessageIcon() as any}
            size={18}
            color={getIconColor()}
          />
        </Animated.View>
        
        <Text style={[styles.messageText, { color: colors.textPrimary }]}>
          {message}
        </Text>
      </View>
      
      {/* Dekoratives Zitat-Icon im Hintergrund */}
      <Animated.View
        style={[styles.quoteIconContainer, quoteAnimatedStyle]}
      >
        <Feather
          name="message-square"
          size={48}
          color={theme.isDark ? colors.primary : colors.primaryLight}
        />
      </Animated.View>
      
      {/* Besonderer Hinweis bei Auto-Notizen */}
      {autoNotesUsed && (
        <View
          style={[
            styles.warningContainer,
            { backgroundColor: `${colors.warning}15` },
          ]}
        >
          <Feather name="info" size={14} color={colors.warning} />
          <Text
            style={[styles.warningText, { color: colors.textSecondary }]}
          >
            Bei der Verwendung von Auto-Notizen wird dieses Spiel nicht für Statistiken oder Level-Fortschritt gezählt.
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default React.memo(FeedbackCard);