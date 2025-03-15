// components/Tutorial/pages/TipsPage.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import TutorialPage from "../TutorialPage";
import { spacing, radius } from "@/utils/theme";

interface TipsPageProps {
  onNext: () => void;
  onBack: () => void;
  isFirstPage?: boolean;
  isLastPage?: boolean;
}

const TipsPage: React.FC<TipsPageProps> = ({
  onNext,
  onBack,
  isFirstPage = false,
  isLastPage = false,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  // Tipps mit Emoji und frischeren Farben
  const tips = [
    {
      icon: "target",
      emoji: "🎯",
      title: "Single Candidate",
      description: "Suche nach Zellen mit nur einer möglichen Zahl",
      color: "#4C63E6", // Vibrant blue
    },
    {
      icon: "search",
      emoji: "🔍",
      title: "Single Position",
      description: "Finde Zahlen, die nur an einer Stelle möglich sind",
      color: "#FF4081", // Vibrant pink
    },
    {
      icon: "crosshair",
      emoji: "🎮",
      title: "Intersection",
      description: "Achte auf Überschneidungen von Reihen und Blöcken",
      color: "#4CAF50", // Vibrant green
    },
    {
      icon: "zap",
      emoji: "⚡",
      title: "Profi-Tipp",
      description: "Mit regelmäßigem Training wirst du immer besser!",
      color: "#FFC107", // Vibrant amber
    },
  ];

  return (
    <TutorialPage
      title="Profi-Tipps"
      onNext={onNext}
      onBack={onBack}
      isFirstPage={isFirstPage}
      isLastPage={isLastPage}
      nextText={isLastPage ? "Spielen" : "Weiter"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={[styles.introText, { color: colors.textPrimary }]}>
            Diese Strategien helfen dir, auch schwierige Sudokus zu lösen:
          </Text>

          {tips.map((tip, index) => (
            <Animated.View
              key={`tip-${index}`}
              style={[
                styles.tipCard,
                { backgroundColor: theme.isDark ? colors.surface : "#fff" },
              ]}
              entering={FadeInUp.delay(100 * index).duration(400)}
            >
              <View
                style={[
                  styles.emojiContainer,
                  { backgroundColor: `${tip.color}15` },
                ]}
              >
                <Text style={styles.emoji}>{tip.emoji}</Text>
              </View>

              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, { color: colors.textPrimary }]}>
                  {tip.title}
                </Text>
                <Text
                  style={[
                    styles.tipDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {tip.description}
                </Text>
              </View>
            </Animated.View>
          ))}

          <Animated.View
            style={[
              styles.motivationalContainer,
              { backgroundColor: colors.primary },
            ]}
            entering={FadeInUp.delay(500).duration(400)}
          >
            <Text style={styles.motivationalText}>
              Übung macht den Meister!
            </Text>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </TutorialPage>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  introText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  emoji: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  motivationalContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.lg,
  },
  motivationalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});

export default TipsPage;
