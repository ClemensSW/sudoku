import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";
import typography from "@/utils/theme/typography";

export default StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    fontVariant: ["tabular-nums"], // Monospace für gleichmäßige Zahlen
  },
});
