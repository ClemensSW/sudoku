// components/Timer/Timer.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginVertical: 8, // Direct value instead of spacing.sm
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 20, // Direct value instead of typography.size.xl
    fontWeight: "600", // Direct value instead of typography.weight.semibold
    fontVariant: ["tabular-nums"], // Monospace für gleichmäßige Zahlen
  },
});
