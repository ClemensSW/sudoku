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
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import styles from "./FeedbackMessage.styles";

interface FeedbackMessageProps {
  difficulty: Difficulty;
  timeElapsed: number;
  isNewRecord: boolean;
  autoNotesUsed: boolean;
  streak: number;
}

// Generiere eine personalisierte Nachricht basierend auf Spielleistung
const generateMessage = (
  difficulty: Difficulty,
  timeElapsed: number,
  isNewRecord: boolean,
  autoNotesUsed: boolean,
  streak: number
): string => {
  // Wenn Auto-Notizen verwendet wurden
  if (autoNotesUsed) {
    return "Mit Auto-Notizen hast du das Spiel gemeistert. Versuche es beim nächsten Mal ohne, um deine Statistik zu verbessern!";
  }

  // Bei einem neuen Rekord
  if (isNewRecord) {
    const records = [
      "Fantastisch! Du hast einen neuen persönlichen Rekord aufgestellt. Deine Geschwindigkeit verbessert sich stetig!",
      "Unglaublich schnell! Das ist ein neuer Rekord für dich. Deine Sudoku-Fähigkeiten entwickeln sich hervorragend!",
      "Rekord gebrochen! Dein Training zahlt sich aus - du wirst immer besser!",
    ];
    return records[Math.floor(Math.random() * records.length)];
  }

  // Basierend auf Schwierigkeit und Zeit
  const timeInMinutes = timeElapsed / 60;
  
  // Bei Streak
  if (streak >= 3) {
    const streakMessages = [
      `Beeindruckend! Das ist dein ${streak}. Sieg in Folge. Deine Beständigkeit ist bewundernswert!`,
      `${streak} Siege hintereinander! Du bist in hervorragender Form!`,
      `Deine Siegesserie von ${streak} zeigt deine kontinuierliche Verbesserung!`,
    ];
    return streakMessages[Math.floor(Math.random() * streakMessages.length)];
  }

  // Basierend auf Schwierigkeit
  switch (difficulty) {
    case "easy":
      if (timeInMinutes < 2) {
        return "Wow, das war schnell! Du beherrschst die leichte Schwierigkeit perfekt.";
      } else if (timeInMinutes < 4) {
        return "Gut gelöst! Du machst stetige Fortschritte bei leichten Sudokus.";
      } else {
        return "Geschafft! Mit mehr Übung wirst du noch schneller werden.";
      }
    
    case "medium":
      if (timeInMinutes < 4) {
        return "Beeindruckend! Du hast die mittlere Schwierigkeit mit Leichtigkeit gemeistert.";
      } else if (timeInMinutes < 6) {
        return "Sehr gut! Deine Lösungsstrategie für mittelschwere Sudokus wird immer besser.";
      } else {
        return "Gut gemacht! Du entwickelst ein gutes Gespür für die mittlere Schwierigkeit.";
      }
    
    case "hard":
      if (timeInMinutes < 6) {
        return "Außergewöhnlich! Du hast ein schweres Sudoku in Rekordzeit gelöst.";
      } else if (timeInMinutes < 10) {
        return "Hervorragend! Du meisterst schwere Sudokus mit Bravour.";
      } else {
        return "Gut durchgehalten! Schwere Sudokus sind eine echte Herausforderung.";
      }
    
    case "expert":
      if (timeInMinutes < 8) {
        return "Phänomenal! Du löst Experten-Sudokus wie ein Profi!";
      } else if (timeInMinutes < 12) {
        return "Beeindruckend! Deine Fähigkeiten auf Experten-Level sind außergewöhnlich.";
      } else {
        return "Großartige Leistung! Du hast ein Experten-Sudoku gemeistert - das schafft nicht jeder!";
      }
      
    default:
      return "Herzlichen Glückwunsch zum erfolgreichen Lösen des Sudokus!";
  }
};

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  difficulty,
  timeElapsed,
  isNewRecord,
  autoNotesUsed,
  streak,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Animation values
  const iconScale = useSharedValue(1);
  const quoteScale = useSharedValue(0.7);
  
  // Generiere Nachricht
  const message = generateMessage(
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
  
  // Wähle das passende Icon basierend auf der Nachricht
  const getMessageIcon = (): string => {
    if (isNewRecord) return "award";
    if (streak >= 3) return "zap";
    if (autoNotesUsed) return "edit-3";
    
    // Basierend auf Schwierigkeit
    switch (difficulty) {
      case "easy": return "thumbs-up";
      case "medium": return "star";
      case "hard": return "trending-up";
      case "expert": return "award";
      default: return "smile";
    }
  };
  
  // Wähle Farbe für Icon-Container
  const getIconContainerColor = (): string => {
    if (isNewRecord) return `${colors.success}30`;
    if (autoNotesUsed) return `${colors.warning}30`;
    if (streak >= 3) return `${colors.warning}30`;
    
    // Basierend auf Schwierigkeit
    switch (difficulty) {
      case "easy": return `${colors.success}30`;
      case "medium": return `${colors.primary}30`;
      case "hard": return `${colors.warning}30`;
      case "expert": return `${colors.secondary}30`;
      default: return `${colors.primary}30`;
    }
  };
  
  // Wähle Farbe für Icon
  const getIconColor = (): string => {
    if (isNewRecord) return colors.success;
    if (autoNotesUsed) return colors.warning;
    if (streak >= 3) return colors.warning;
    
    // Basierend auf Schwierigkeit
    switch (difficulty) {
      case "easy": return colors.success;
      case "medium": return colors.primary;
      case "hard": return colors.warning;
      case "expert": return colors.secondary;
      default: return colors.primary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.isDark ? colors.surface : "#FFFFFF" },
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

export default FeedbackMessage;