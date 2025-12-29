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
  const { colors, typography, isDark } = useTheme();

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
      {/* Battle Icon */}
      <View style={styles.iconWrapper}>
        <BattleIcon width={120} height={120} />
      </View>

      {/* Result Text */}
      <Text
        style={[
          styles.resultText,
          { color: isDark ? "#FFFFFF" : "#202124", fontSize: typography.size.xxxl },
        ]}
      >
        {getResultText()}
      </Text>

      {/* Result Subtext */}
      <Text
        style={[
          styles.resultSubtext,
          { color: isDark ? colors.textSecondary : "#5F6368", fontSize: typography.size.md },
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
    marginBottom: 48,
    zIndex: 1,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    marginTop: 56,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  resultText: {
    // fontSize set dynamically via theme.typography
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },
  resultSubtext: {
    // fontSize set dynamically via theme.typography
    textAlign: "center",
    opacity: 0.7,
  },
});

export default CompletionHeader;
