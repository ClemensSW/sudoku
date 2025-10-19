// screens/DuoGame/components/DuoGameCompletionModal/components/PlayerStats.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";

interface PlayerStatsProps {
  errorsRemaining: number;
  hintsRemaining: number;
  maxErrors: number;
  maxHints: number;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({
  errorsRemaining,
  hintsRemaining,
  maxErrors,
  maxHints,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.statsRow}>
      {/* Errors indicator */}
      <View style={styles.statItem}>
        <Feather name="heart" size={14} color={colors.textSecondary} />
        <Text
          style={[
            styles.statValue,
            { color: isDark ? "#E8EAED" : "#5F6368" },
          ]}
        >
          {errorsRemaining}/{maxErrors}
        </Text>
      </View>

      {/* Hints indicator */}
      <View style={styles.statItem}>
        <Feather name="help-circle" size={14} color={colors.textSecondary} />
        <Text
          style={[
            styles.statValue,
            { color: isDark ? "#E8EAED" : "#5F6368" },
          ]}
        >
          {hintsRemaining}/{maxHints}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    height: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default PlayerStats;
