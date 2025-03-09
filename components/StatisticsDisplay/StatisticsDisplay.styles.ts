import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    marginTop: spacing.md,
  },

  statsRow: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },

  // Win Rate Circle
  winRateContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
    borderWidth: 1,
    padding: 4,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },

  // Stats Details
  statsDetails: {
    flex: 1,
    justifyContent: "space-between",
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },

  statItemContent: {
    flex: 1,
  },

  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  statItemLabel: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Best Times
  bestTimesContainer: {
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
  },

  bestTimesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.md,
  },

  bestTimesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  bestTimeItem: {
    alignItems: "center",
    width: "48%",
    marginBottom: spacing.md,
  },

  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
  },

  difficultyText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  bestTimeValue: {
    fontSize: 16,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});
