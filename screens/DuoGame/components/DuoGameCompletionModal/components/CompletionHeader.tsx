// screens/DuoGame/components/DuoGameCompletionModal/components/CompletionHeader.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";

interface CompletionHeaderProps {
  gameTime: number;
  winner: 0 | 1 | 2;
  winReason: "completion" | "errors";
  pathColorHex: string;
}

const CompletionHeader: React.FC<CompletionHeaderProps> = ({
  gameTime,
  winner,
  winReason,
  pathColorHex,
}) => {
  const { t } = useTranslation("duoGame");
  const { colors, isDark } = useTheme();

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Get result text based on winner
  const getResultText = (): string => {
    if (winner === 0) return t("completion.tie");
    // Winner text mit Spieler-Name
    const playerName = t(`players.player${winner}`);
    return t("completion.winnerTitle", { player: playerName });
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
      {/* Time Badge */}
      <View
        style={[
          styles.timeContainer,
          {
            backgroundColor: winner !== 0 ? pathColorHex : colors.primary,
          },
        ]}
      >
        <Feather name="clock" size={18} color="#FFFFFF" />
        <Text style={styles.timeText}>{formatTime(gameTime)}</Text>
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
    marginBottom: 36,
    zIndex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    justifyContent: "center",
    marginBottom: 24,
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    fontVariant: ["tabular-nums"],
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
