// components/Tutorial/pages/TipsPage.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
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

  // Render a single tip
  const renderTip = (
    icon: string,
    title: string,
    description: string,
    delay: number = 0
  ) => {
    return (
      <Animated.View 
        style={[
          styles.tipContainer,
          { 
            backgroundColor: theme.isDark 
              ? colors.surface 
              : `${colors.primary}05`,
            borderLeftColor: colors.primary,
          }
        ]}
        entering={FadeInUp.delay(delay).duration(400)}
      >
        <View style={styles.tipHeader}>
          <View 
            style={[
              styles.tipIcon,
              { backgroundColor: `${colors.primary}15` }
            ]}
          >
            <Feather name={icon as any} size={20} color={colors.primary} />
          </View>
          <Text style={[styles.tipTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
        </View>
        <Text style={[styles.tipDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </Animated.View>
    );
  };

  return (
    <TutorialPage
      title="Profi-Tipps"
      onNext={onNext}
      onBack={onBack}
      isFirstPage={isFirstPage}
      isLastPage={isLastPage}
      nextText={isLastPage ? "Spielen" : "Weiter"}
    >
      <Animated.View 
        style={styles.contentContainer}
        entering={FadeIn.duration(400)}
      >
        <Text style={[styles.introText, { color: colors.textPrimary }]}>
          Diese Strategien helfen dir, auch schwierige Sudokus zu lösen:
        </Text>

        {renderTip(
          "eye",
          "Single Candidate",
          "Suche nach Zellen, die nur einen möglichen Wert haben. Diese können sicher ausgefüllt werden.",
          100
        )}

        {renderTip(
          "search",
          "Single Position",
          "Suche nach Zahlen, die in einer Reihe, Spalte oder einem Block nur an einer Position möglich sind.",
          200
        )}

        {renderTip(
          "users",
          "Pairs & Triplets",
          "Wenn zwei oder drei Zellen in einer Einheit die gleichen Kandidaten haben, können diese Kandidaten aus anderen Zellen entfernt werden.",
          300
        )}

        {renderTip(
          "crosshair",
          "Intersection",
          "Achte auf Schnittmengen: Wenn ein Kandidat in einem Block nur in einer Reihe oder Spalte vorkommt, kann er aus anderen Teilen dieser Reihe/Spalte entfernt werden.",
          400
        )}

        <Animated.View 
          style={[
            styles.motivationalContainer,
            { backgroundColor: `${colors.primary}10` }
          ]}
          entering={FadeInUp.delay(500).duration(400)}
        >
          <Feather name="award" size={22} color={colors.primary} />
          <Text style={[styles.motivationalText, { color: colors.textPrimary }]}>
            Übung macht den Meister! Mit jeder Partie verbesserst du deine Fähigkeiten.
          </Text>
        </Animated.View>
      </Animated.View>
    </TutorialPage>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  introText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  tipContainer: {
    borderLeftWidth: 3,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 48, // Align with the title text
  },
  motivationalContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.md,
  },
  motivationalText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: spacing.sm,
    flex: 1,
  },
});

export default TipsPage;