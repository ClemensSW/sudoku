// screens/LeistungScreen/components/EmptyState.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import Animated, { FadeIn } from "react-native-reanimated";

const EmptyState: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Animated.View 
      style={styles.emptyStateContainer}
      entering={FadeIn.duration(500)}
    >
      <Feather
        name="activity"
        size={64}
        color={colors.textSecondary}
        style={{ opacity: 0.5 }}
      />
      <Text
        style={[styles.emptyStateText, { color: colors.textSecondary }]}
      >
        Keine Statistiken verfügbar. Spiele ein paar Runden Sudoku, um
        deine Leistung zu verfolgen!
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    marginTop: 24,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default EmptyState;