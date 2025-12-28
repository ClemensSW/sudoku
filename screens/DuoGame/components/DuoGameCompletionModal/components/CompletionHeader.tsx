// screens/DuoGame/components/DuoGameCompletionModal/components/CompletionHeader.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import BattleIcon from "@/assets/svg/battle.svg";

interface CompletionHeaderProps {
  winner: 0 | 1 | 2;
  winReason: "completion" | "errors";
  progressColor: string;
  winnerName: string; // Dynamischer Gewinner-Name
}

const CompletionHeader: React.FC<CompletionHeaderProps> = ({
  winner,
  winReason,
  progressColor,
  winnerName,
}) => {
  const { t } = useTranslation("duoGame");
  const { colors, isDark } = useTheme();

  // Get result text based on winner - jetzt mit dynamischem Namen
  const getResultText = (): string => {
    if (winner === 0) return t("completion.tie");
    // Dynamischer Gewinner-Titel mit echtem Namen
    return t("completion.winnerTitleDynamic", { name: winnerName });
  };

  // Get subtext based on win reason
  const getResultSubtext = (): string => {
    if (winner === 0) {
      return t("completion.bothCompleted");
    }
    if (winReason === "completion") {
      return t("completion.reasonFaster");
    }
    return t("completion.reasonErrors");
  };

  return (
    <View style={styles.container}>
      {/* Battle Icon mit Glow */}
      <View style={styles.iconWrapper}>
        {/* Outer Glow */}
        <View
          style={[
            styles.iconGlowOuter,
            { backgroundColor: `${progressColor}15` },
          ]}
        />
        {/* Inner Glow */}
        <View
          style={[
            styles.iconGlow,
            { backgroundColor: `${progressColor}30` },
          ]}
        />
        <BattleIcon width={72} height={72} />
      </View>

      {/* Result Text */}
      <Text
        style={[
          styles.resultText,
          { color: isDark ? "#FFFFFF" : "#202124" },
        ]}
      >
        {getResultText()}
      </Text>

      {/* Result Subtext */}
      <Text
        style={[
          styles.resultSubtext,
          { color: isDark ? colors.textSecondary : "#5F6368" },
        ]}
      >
        {getResultSubtext()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
    zIndex: 1,
  },
  iconWrapper: {
    position: "relative",
    width: 72,
    height: 72,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  iconGlowOuter: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  resultText: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  resultSubtext: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
});

export default CompletionHeader;
