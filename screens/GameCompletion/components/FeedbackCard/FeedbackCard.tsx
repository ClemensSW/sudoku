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
  difficulty: Difficulty,
  timeElapsed: number,
  isNewRecord: boolean,
  autoNotesUsed: boolean,
  streak: number
): string => {
  // Wenn Auto-Notizen verwendet wurden
  if (autoNotesUsed) {
    const autoNotesMessages = [
      "Mit Auto-Notizen hast du das Spiel gemeistert. Versuche es beim nächsten Mal ohne, um deine Statistik zu verbessern!",
      "Gute Arbeit mit Hilfe der Auto-Notizen! Für eine echte Herausforderung, versuch's beim nächsten Mal ohne.",
      "Auto-Notizen sind ein guter Einstieg! Versuche beim nächsten Mal, deine eigenen zu erstellen, um deine Fähigkeiten zu verbessern.",
      "Du hast mit Hilfe der Auto-Notizen gewonnen! Das ist wie Sudoku mit Stützrädern - bald bist du bereit für die echte Herausforderung!",
      "Mit Auto-Notizen geschafft! Beim nächsten Mal ohne zu spielen, bringt dich auf das nächste Level deiner Sudoku-Reise.",
    ];
    return autoNotesMessages[Math.floor(Math.random() * autoNotesMessages.length)];
  }

  // Basierend auf der Performance-Kategorie (im PerformanceCard.tsx)
  // Hier machen wir eigene Kategorien, die besser zu den gezeigten Performance-Werten passen
  const timeInMinutes = timeElapsed / 60;
  
  // Messages basierend auf Performance-Kategorien (die tatsächlich angezeigt werden)
  // Extrem gut: 95-100%
  const excellentMessages = [
    "Hervorragende Leistung! Deine Präzision und Geschwindigkeit sind beeindruckend!",
    "Brillante Arbeit! Du hast das Sudoku perfekt gemeistert!",
    "Weltklasse! Deine Sudoku-Fähigkeiten sind außergewöhnlich!",
    "Fantastisch! Deine Leistung ist nahezu perfekt!",
    "Ausgezeichnet! Du spielst auf Top-Niveau!",
    "Meisterhaft! Deine Sudoku-Technik ist beeindruckend!",
    "Grandiose Leistung! Du hast das Rätsel mit Bravour gemeistert!",
    "Spektakulär! Dein logisches Denken ist bemerkenswert!",
    "Herausragend! Du beherrschst Sudoku auf höchstem Niveau!",
    "Erstklassig! Deine Problemlösungsfähigkeiten sind außergewöhnlich!"
  ];
  
  // Sehr gut: 80-94%
  const veryGoodMessages = [
    "Sehr gut! Deine Sudoku-Fähigkeiten werden immer besser!",
    "Tolle Leistung! Du hast ein gutes Gespür für Zahlenmuster!",
    "Prima! Du meisterst die Herausforderungen mit Leichtigkeit!",
    "Großartig! Deine Konzentration hat sich ausgezahlt!",
    "Klasse Arbeit! Du entwickelst dich zu einem Sudoku-Profi!",
    "Beeindruckend! Deine Strategie funktioniert hervorragend!",
    "Starke Leistung! Dein Lösungsweg war effizient!",
    "Top! Du findest immer schneller die richtigen Zahlen!",
    "Ausgezeichnet! Deine Fortschritte sind deutlich zu sehen!",
    "Sehr schön! Du hast ein echtes Talent für Logikrätsel!"
  ];
  
  // Gut: 70-79%
  const goodMessages = [
    "Gut gemacht! Mit etwas Übung wirst du noch schneller!",
    "Solide Leistung! Du wirst mit jedem Spiel besser!",
    "Schön gelöst! Deine Sudoku-Technik entwickelt sich gut!",
    "Gut gespielt! Du hast die Herausforderung gemeistert!",
    "Prima! Deine Ausdauer hat zum Erfolg geführt!",
    "Gute Arbeit! Du kannst stolz auf deine Lösung sein!",
    "Schön! Du entwickelst einen guten Lösungsinstinkt!",
    "Gut gemacht! Dein logisches Denken verbessert sich!",
    "Erfolgreich! Du findest die richtigen Strategien!",
    "Gut durchgehalten! Mit jeder Lösung wirst du besser!"
  ];
  
  // Durchschnittlich: unter 70%
  const averageMessages = [
    "Geschafft! Mit mehr Übung wirst du noch besser werden!",
    "Gut durchgehalten! Jedes gelöste Sudoku verbessert deine Fähigkeiten!",
    "Puzzle gelöst! Die Übung macht den Meister!",
    "Geschafft! Beim nächsten Mal wirst du noch schneller sein!",
    "Puzzle gemeistert! Regelmäßiges Spielen hilft, die Strategien zu verinnerlichen!",
    "Sudoku gelöst! Mit der Zeit wirst du immer flüssiger spielen!",
    "Erledigt! Deine Ausdauer hat sich ausgezahlt!",
    "Fertig! Jedes Sudoku trainiert dein Gehirn!",
    "Gelöst! Mit Übung kommst du schneller auf die Lösung!",
    "Geschafft! Der Weg zur Meisterschaft führt über viele gelöste Rätsel!"
  ];

  // Jetzt entscheiden wir, ob wir eine Streak-Nachricht zeigen sollen (mit geringer Wahrscheinlichkeit)
  // Nur 30% Chance für Streak-Nachrichten, um sie seltener zu machen
  if (streak >= 3 && Math.random() < 0.3) {
    // Für besonders lange Streaks (10+)
    if (streak >= 10) {
      const longStreakMessages = [
        `${streak} Siege in Folge! Das ist nicht mehr normal – das ist Meisterschaft!`,
        `${streak} Siege hintereinander! Du bist ein Sudoku-Virtuose!`,
        `Eine ${streak}er-Siegesserie! Du spielst in einer ganz eigenen Liga!`,
        `${streak} Siege am Stück – das ist Weltklasse-Niveau!`,
        `Wahnsinn! ${streak} Siege ohne Niederlage! Deine Konsistenz ist beeindruckend!`,
      ];
      return longStreakMessages[Math.floor(Math.random() * longStreakMessages.length)];
    }
    // Für mittlere Streaks (5-9)
    else if (streak >= 5) {
      const mediumStreakMessages = [
        `${streak} Siege in Serie! Deine Beständigkeit ist beeindruckend!`,
        `${streak} Erfolge nacheinander! Das zeugt von echtem Können!`,
        `Eine ${streak}er-Siegesserie! Du bist in Bestform!`,
        `${streak} Siege in Folge – dein Gehirn ist in Höchstform!`,
        `${streak} Siege ohne Unterbrechung! Das nenne ich Konstanz!`,
      ];
      return mediumStreakMessages[Math.floor(Math.random() * mediumStreakMessages.length)];
    }
    // Für kürzere Streaks (3-4)
    else {
      const shortStreakMessages = [
        `${streak} Siege hintereinander! Ein toller Lauf!`,
        `${streak} Erfolge in Folge – du bist auf dem richtigen Weg!`,
        `${streak} Siege am Stück! Du bist in guter Form!`,
        `Eine ${streak}er-Serie! Halte den Schwung aufrecht!`,
        `${streak} Siege in Folge! Baue die Serie weiter aus!`,
      ];
      return shortStreakMessages[Math.floor(Math.random() * shortStreakMessages.length)];
    }
  }

  // Alternativ können wir die alten schwierigkeitsbasierten Nachrichten als Fallback nutzen
  // 70% Wahrscheinlichkeit für schwierigkeitsbasierte Nachrichten, wenn Performance unter 95% liegt
  if (Math.random() < 0.7) {
    switch (difficulty) {
      case "easy":
        if (timeInMinutes < 2) {
          const fastEasyMessages = [
            "Wow, das war schnell! Du beherrschst die leichte Schwierigkeit perfekt.",
            "Blitzschnell gelöst! Du bist ein Naturtalent bei leichten Sudokus.",
            "Rasend schnell! Du kannst dich definitiv an schwierigere Rätsel wagen.",
            "Leichte Sudokus sind für dich ein Kinderspiel! Zeit für die nächste Stufe?",
            "Beeindruckend schnell! Das war ein Spaziergang für dich.",
          ];
          return fastEasyMessages[Math.floor(Math.random() * fastEasyMessages.length)];
        } else if (timeInMinutes < 4) {
          const mediumEasyMessages = [
            "Gut gelöst! Du machst stetige Fortschritte bei leichten Sudokus.",
            "Solide Leistung! Du bekommst immer mehr Routine.",
            "Gut gemacht! Deine Lösungsstrategie wird immer besser.",
            "Schön gelöst! Du entwickelst ein gutes Gespür für die Zahlen.",
            "Prima! Mit etwas Übung wirst du noch schneller werden.",
          ];
          return mediumEasyMessages[Math.floor(Math.random() * mediumEasyMessages.length)];
        } else {
          const slowEasyMessages = [
            "Geschafft! Mit mehr Übung wirst du noch schneller werden.",
            "Gut durchgehalten! Mit jedem gelösten Sudoku wirst du besser.",
            "Erledigt! Versuche beim nächsten Mal, dich auf Muster zu konzentrieren.",
            "Geschafft! Mit etwas Übung wirst du bald schneller sein.",
            "Gut gemacht! Regelmäßiges Spielen wird deine Zeit verbessern.",
          ];
          return slowEasyMessages[Math.floor(Math.random() * slowEasyMessages.length)];
        }
      
      case "medium":
        if (timeInMinutes < 4) {
          const fastMediumMessages = [
            "Beeindruckend! Du hast die mittlere Schwierigkeit mit Leichtigkeit gemeistert.",
            "Das war erstklassig! Du bist bereit für die nächste Stufe.",
            "Rekordverdächtige Zeit für ein mittelschweres Sudoku! Fantastisch!",
            "Brillant gelöst! Deine Fähigkeiten sind weit über dem Durchschnitt.",
            "Außergewöhnlich schnell! Du hast ein Talent für Sudoku!",
          ];
          return fastMediumMessages[Math.floor(Math.random() * fastMediumMessages.length)];
        } else if (timeInMinutes < 8) {
          const mediumMediumMessages = [
            "Sehr gut! Deine Lösungsstrategie für mittelschwere Sudokus wird immer besser.",
            "Solide Leistung! Mit etwas mehr Übung wirst du noch schneller.",
            "Gut gemacht! Deine Technik verbessert sich stetig.",
            "Schöne Arbeit! Du bekommst immer mehr Routine mit mittelschweren Rätseln.",
            "Gut gespielt! Du entwickelst ein gutes Gespür für komplexere Muster.",
          ];
          return mediumMediumMessages[Math.floor(Math.random() * mediumMediumMessages.length)];
        } else {
          const slowMediumMessages = [
            "Gut gemacht! Du entwickelst ein gutes Gespür für die mittlere Schwierigkeit.",
            "Geschafft! Mit mehr Übung wirst du schneller werden.",
            "Gut durchgehalten! Mittelschwere Sudokus sind eine echte Herausforderung.",
            "Gut gelöst! Mit etwas mehr Praxis wirst du bald schneller sein.",
            "Sudoku ist ein Geduldspiel - gut gemacht!",
          ];
          return slowMediumMessages[Math.floor(Math.random() * slowMediumMessages.length)];
        }
      
      case "hard":
        if (timeInMinutes < 6) {
          const fastHardMessages = [
            "Außergewöhnlich! Du hast ein schweres Sudoku in Rekordzeit gelöst.",
            "Beeindruckend schnell! Du hast ein echtes Talent für komplexe Sudokus.",
            "Unglaublich! Du hast ein schweres Sudoku gemeistert, als wäre es ein leichtes.",
            "Phänomenal! Deine Fähigkeiten sind weit über dem Durchschnitt.",
            "Meisterhaft! Du beherrschst schwere Sudokus mit Leichtigkeit.",
          ];
          return fastHardMessages[Math.floor(Math.random() * fastHardMessages.length)];
        } else if (timeInMinutes < 12) {
          const mediumHardMessages = [
            "Hervorragend! Du meisterst schwere Sudokus mit Bravour.",
            "Tolle Leistung! Du beherrschst komplexe Strategien immer besser.",
            "Ausgezeichnet! Dein logisches Denken wird immer schärfer.",
            "Prima gelöst! Du kannst stolz auf deine Fähigkeiten sein.",
            "Sehr gut gemacht! Du meisterst komplexe Herausforderungen immer besser.",
          ];
          return mediumHardMessages[Math.floor(Math.random() * mediumHardMessages.length)];
        } else {
          const slowHardMessages = [
            "Gut durchgehalten! Schwere Sudokus sind eine echte Herausforderung.",
            "Geschafft! Mit mehr Übung wirst du die komplexen Muster schneller erkennen.",
            "Durchhalten zahlt sich aus! Du hast ein anspruchsvolles Rätsel gelöst.",
            "Gut gemacht! Mit der Zeit wirst du bei schweren Rätseln schneller.",
            "Ein hartes Sudoku gemeistert! Mit jedem gelösten Rätsel wirst du besser.",
          ];
          return slowHardMessages[Math.floor(Math.random() * slowHardMessages.length)];
        }
      
      case "expert":
        if (timeInMinutes < 10) {
          const fastExpertMessages = [
            "Phänomenal! Du löst Experten-Sudokus wie ein Profi!",
            "Unglaublich schnell! Du bist ein wahrer Sudoku-Meister!",
            "Außergewöhnlich! Du hast ein Experten-Sudoku in Rekordzeit geknackt!",
            "Weltklasse! Deine Fähigkeiten sind auf Championsniveau!",
            "Brillant! Deine Lösungsgeschwindigkeit ist beeindruckend!",
          ];
          return fastExpertMessages[Math.floor(Math.random() * fastExpertMessages.length)];
        } else if (timeInMinutes < 15) {
          const mediumExpertMessages = [
            "Beeindruckend! Deine Fähigkeiten auf Experten-Level sind außergewöhnlich.",
            "Hervorragende Arbeit! Du meisterst die schwierigsten Sudokus mit Bravour.",
            "Exzellent gelöst! Deine Technik für komplexe Muster ist bemerkenswert.",
            "Fantastisch! Deine Fähigkeit, komplizierte Muster zu erkennen, ist beeindruckend.",
            "Herausragende Leistung! Du beherrschst die höchste Schwierigkeitsstufe.",
          ];
          return mediumExpertMessages[Math.floor(Math.random() * mediumExpertMessages.length)];
        } else {
          const slowExpertMessages = [
            "Großartige Leistung! Du hast ein Experten-Sudoku gemeistert - das schafft nicht jeder!",
            "Beeindruckend! Experten-Sudokus sind selbst für erfahrene Spieler eine Herausforderung.",
            "Ausgezeichnete Arbeit! Du hast eines der schwierigsten Sudokus gemeistert.",
            "Respekt! Du hast dich durch ein komplexes Rätsel gekämpft und gewonnen.",
            "Gut durchgehalten! Experten-Sudokus sind eine echte Herausforderung für jeden.",
          ];
          return slowExpertMessages[Math.floor(Math.random() * slowExpertMessages.length)];
        }
      
      default:
        // Verwende performance-basierte Nachrichten als Fallback für unbekannte Schwierigkeitsgrade
        break;
    }
  }

  // Hauptmethode - wenn wir hierher kommen, zeigen wir performance-basierte Nachrichten
  // Diese werden in der Praxis am häufigsten angezeigt und basieren auf den Werten
  // die in der PerformanceCard angezeigt werden
  
  // Wähle die Nachricht basierend auf einer Performance-Kategorie 
  // (ähnlich wie im PerformanceCard.tsx)
  if (isNewRecord) {
    // Seltener Fall, aber für die Zukunft vorbereitet
    const records = [
      "Fantastisch! Du hast einen neuen persönlichen Rekord aufgestellt. Deine Geschwindigkeit verbessert sich stetig!",
      "Unglaublich schnell! Das ist ein neuer Rekord für dich. Deine Sudoku-Fähigkeiten entwickeln sich hervorragend!",
      "Rekord gebrochen! Dein Training zahlt sich aus - du wirst immer besser!",
      "Wow! Neuer persönlicher Rekord! Deine Sudoku-Fertigkeiten erreichen neue Höhen!",
      "Sensationell! Du hast deinen bisherigen Rekord pulverisiert!",
    ];
    return records[Math.floor(Math.random() * records.length)];
  } else {
    // Performance-basierte Kategorien
    // Diese Kategorien entsprechen denen, die auch in PerformanceCard.tsx verwendet werden
    if (Math.random() < 0.95) { // 95% Wahrscheinlichkeit für Performance-Nachrichten
      if (timeInMinutes < 3 || (difficulty === "expert" && timeInMinutes < 10)) {
        // Entspricht ca. 95-100% Performance
        return excellentMessages[Math.floor(Math.random() * excellentMessages.length)];
      } else if (timeInMinutes < 5 || (difficulty === "hard" && timeInMinutes < 8)) {
        // Entspricht ca. 80-94% Performance
        return veryGoodMessages[Math.floor(Math.random() * veryGoodMessages.length)];
      } else if (timeInMinutes < 8 || (difficulty === "hard" && timeInMinutes < 12)) {
        // Entspricht ca. 70-79% Performance
        return goodMessages[Math.floor(Math.random() * goodMessages.length)];
      } else {
        // Entspricht Performance unter 70%
        return averageMessages[Math.floor(Math.random() * averageMessages.length)];
      }
    } else {
      // 5% Chance für allgemeine motivierende Nachrichten
      const generalMessages = [
        "Herzlichen Glückwunsch zum erfolgreichen Lösen des Sudokus!",
        "Gut gemacht! Deine Sudoku-Fähigkeiten entwickeln sich weiter.",
        "Prima! Du wirst mit jedem gelösten Rätsel besser.",
        "Schöne Arbeit! Dein logisches Denken verbessert sich stetig.",
        "Gut gespielt! Deine Ausdauer hat sich ausgezahlt.",
      ];
      return generalMessages[Math.floor(Math.random() * generalMessages.length)];
    }
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