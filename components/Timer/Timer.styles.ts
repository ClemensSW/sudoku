import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    position: "relative",
    overflow: "hidden",
    minWidth: 44,
    minHeight: 44,
  },

  timerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },

  timerText: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    fontVariant: ["tabular-nums"], // Monospace for consistent numbers
  },

  timerIcon: {
    marginRight: spacing.xs,
  },

  pulseCircle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0,
  },
});
