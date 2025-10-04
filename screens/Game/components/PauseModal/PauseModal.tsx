import React, { useEffect } from "react";
import { View, Text, ScrollView, Modal, TouchableOpacity, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import Button from "@/components/Button/Button";
import styles from "./PauseModal.styles";

interface PauseModalProps {
  visible: boolean;
  onResume: () => void;
  gameTime: number;
  errorsRemaining: number;
  maxErrors: number;
  difficulty: Difficulty;
}

interface TipItem {
  icon: string;
  title: string;
  description: string;
}

const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  onResume,
  gameTime,
  errorsRemaining,
  maxErrors,
  difficulty,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const isDarkMode = theme.isDark;

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Get difficulty label
  const getDifficultyLabel = (diff: Difficulty): string => {
    const labels: Record<Difficulty, string> = {
      easy: "Leicht",
      medium: "Mittel",
      hard: "Schwer",
      expert: "Experte",
    };
    return labels[diff];
  };

  // Tips data - organized by category (erweitert für mehr Abwechslung)
  const gameSpecificTips: TipItem[] = [
    {
      icon: "image",
      title: "Galerie-Freischaltungen",
      description: "In der Galerie kannst du selbst entscheiden, welches Bild du als Nächstes freischaltest.",
    },
    {
      icon: "star",
      title: "Favoriten",
      description: "Alle als Favorit markierten Bilder werden dir direkt auf der Startseite angezeigt.",
    },
    {
      icon: "award",
      title: "Titel auswählen",
      description: "Wähle deinen Titel aus den bereits erworbenen Auszeichnungen und zeige deinen Fortschritt.",
    },
    {
      icon: "edit-3",
      title: "Notizmodus",
      description: "Nutze den Notizmodus, um Kandidaten in Zellen zu markieren und Fehler zu vermeiden.",
    },
    {
      icon: "map",
      title: "Level-Pfad",
      description: "Verfolge deinen Fortschritt über den Level-Pfad und schalte neue Herausforderungen frei.",
    },
    {
      icon: "trending-up",
      title: "Schwierigkeitsgrad steigern",
      description: "Fordere dich heraus und steigere dein Niveau – jede Stufe bringt mehr Punkte!",
    },
    {
      icon: "zap",
      title: "Tägliche Streak",
      description: "Spiele täglich, um deine Streak zu halten und Bonuspunkte zu sammeln.",
    },
  ];

  const sudokuTips: TipItem[] = [
    {
      icon: "search",
      title: "Naked Singles zuerst",
      description: "Suche nach Zellen, in denen nur eine Zahl möglich ist – der einfachste Anfang.",
    },
    {
      icon: "grid",
      title: "Hidden Singles finden",
      description: "Prüfe Zeilen, Spalten und Boxen: Wo kann eine Zahl nur einmal hin?",
    },
    {
      icon: "columns",
      title: "Box-Line Reduction",
      description: "Wenn eine Zahl in einer Box nur in einer Zeile/Spalte möglich ist, eliminiere sie außerhalb.",
    },
    {
      icon: "square",
      title: "Naked Pairs nutzen",
      description: "Zwei Zellen mit denselben 2 Kandidaten? Eliminiere diese Zahlen in der Zeile/Spalte/Box.",
    },
    {
      icon: "eye",
      title: "Scanning-Technik",
      description: "Gehe systematisch durch jede Zahl 1-9 und prüfe, wo sie noch fehlt.",
    },
    {
      icon: "maximize-2",
      title: "X-Wing Strategie",
      description: "Fortgeschritten: Finde Muster über mehrere Zeilen/Spalten, um Kandidaten zu eliminieren.",
    },
    {
      icon: "clock",
      title: "Pausen helfen",
      description: "Kurze Pausen steigern die Konzentration – du siehst oft neue Muster danach.",
    },
    {
      icon: "skip-forward",
      title: "Nicht festbeißen",
      description: "Hängst du fest? Überspringe die Zelle und komme später zurück – oft wird's dann klarer.",
    },
  ];

  const brainTips: TipItem[] = [
    {
      icon: "target",
      title: "Fokus & Konzentration",
      description: "Sudoku trainiert deine Aufmerksamkeit und fördert tiefe Konzentration.",
    },
    {
      icon: "zap",
      title: "Mentale Ausdauer",
      description: "Regelmäßiges Üben stärkt Geduld und verbessert deine Problemlösefähigkeit.",
    },
    {
      icon: "cpu",
      title: "Gedächtnis stärken",
      description: "Sudoku aktiviert dein Arbeitsgedächtnis und hält dein Gehirn fit.",
    },
    {
      icon: "activity",
      title: "Neuroplastizität fördern",
      description: "Neue Denkmuster beim Rätseln bilden neue neuronale Verbindungen.",
    },
    {
      icon: "trending-up",
      title: "Kognitive Reserven aufbauen",
      description: "Regelmäßiges Gehirntraining kann altersbedingten kognitiven Abbau verlangsamen.",
    },
    {
      icon: "smile",
      title: "Stressabbau & Entspannung",
      description: "Sudoku wirkt meditativ und hilft beim Abschalten vom Alltag.",
    },
    {
      icon: "award",
      title: "Erfolgserlebnisse",
      description: "Jedes gelöste Rätsel gibt dir ein positives Erfolgserlebnis und motiviert dich weiterzumachen.",
    },
    {
      icon: "repeat",
      title: "Flexibles Denken",
      description: "Sudoku trainiert dein Gehirn, verschiedene Lösungsansätze auszuprobieren.",
    },
  ];

  // Get random tip from all categories combined
  const getRandomTipFromAll = (): TipItem => {
    const allTips = [...gameSpecificTips, ...sudokuTips, ...brainTips];
    return allTips[Math.floor(Math.random() * allTips.length)];
  };

  // Select ONE random tip from all categories (recalculate when modal opens)
  const selectedTip = React.useMemo(() => getRandomTipFromAll(), [visible]);

  // Start animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Animate in
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.back(1.2))
      });
    } else {
      // Reset values when closing
      opacity.value = 0;
      scale.value = 0.9;
    }
  }, [visible]);

  // Animated styles
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Render heart icons
  const renderHearts = () => {
    return Array.from({ length: maxErrors }).map((_, index) => {
      const isFilled = index < errorsRemaining;
      return (
        <Feather
          key={`heart-${index}`}
          name="heart"
          size={18}
          color={isFilled ? colors.primary : colors.buttonDisabled}
          style={{
            marginHorizontal: 2,
            opacity: isFilled ? 1 : 0.4,
          }}
        />
      );
    });
  };

  // Render a single tip item - vertikal angeordnet
  const renderTipItem = (tip: TipItem, index: number) => (
    <View
      key={`tip-${index}`}
      style={[
        styles.tipItem,
        {
          backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
          borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        }
      ]}
    >
      <View style={[
        styles.tipIconContainer,
        { backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }
      ]}>
        <Feather name={tip.icon as any} size={28} color={colors.primary} />
      </View>
      <Text style={[styles.tipTitle, { color: colors.textPrimary }]}>
        {tip.title}
      </Text>
      <Text style={[styles.tipDescription, { color: colors.textSecondary }]}>
        {tip.description}
      </Text>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onResume}
      statusBarTranslucent={true}
    >
      <View style={styles.fullScreen}>
        {/* Blur overlay - nur für iOS */}
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={80}
            tint={isDarkMode ? "dark" : "light"}
            style={styles.blurView}
          />
        ) : null}

        {/* Dark overlay - klickbar zum Schließen */}
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <TouchableOpacity
            style={[
              styles.darkOverlay,
              {
                backgroundColor: Platform.OS === "ios"
                  ? (isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.2)")
                  : (isDarkMode ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.8)")
              }
            ]}
            activeOpacity={1}
            onPress={onResume}
          />

          {/* Modal content */}
          <Animated.View
            style={[
              styles.modalContainer,
              { backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF" },
              modalStyle,
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Pause
              </Text>
            </View>

            {/* Status section */}
            <View style={[
              styles.statusContainer,
              {
                backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              }
            ]}>
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <Feather name="clock" size={20} color={colors.textSecondary} />
                  <Text style={[styles.statusValue, { color: colors.textPrimary }]}>
                    {formatTime(gameTime)}
                  </Text>
                </View>

                <View style={styles.statusDivider} />

                <View style={styles.statusItem}>
                  <View style={styles.heartsContainer}>
                    {renderHearts()}
                  </View>
                </View>

                <View style={styles.statusDivider} />

                <View style={styles.statusItem}>
                  <Feather name="trending-up" size={20} color={colors.textSecondary} />
                  <Text style={[styles.statusValue, { color: colors.textPrimary }]}>
                    {getDifficultyLabel(difficulty)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Tips section - nur EIN zufälliger Tipp aus allen Kategorien */}
            <View style={styles.tipsContainer}>
              <View style={styles.tipsSection}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Nützlicher Tipp
                </Text>
                {renderTipItem(selectedTip, 0)}
              </View>
            </View>

            {/* Resume button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Weiter spielen"
                onPress={onResume}
                variant="primary"
                icon={<Feather name="play" size={20} color="#FFFFFF" />}
                iconPosition="left"
                style={{ width: "100%" }}
              />
            </View>
        </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default PauseModal;
