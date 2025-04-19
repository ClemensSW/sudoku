// screens/LeistungScreen/components/BestTimesChart/BestTimesChart.styles.ts
import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  bestTimesContainer: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
  },

  chartContainer: {
    marginTop: spacing.sm,
  },

  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    height: 36,
  },

  chartLabelContainer: {
    width: 65,
  },

  chartLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  chartBarBackground: {
    flex: 1,
    height: 12,
    borderRadius: radius.md,
    marginRight: spacing.md,
    overflow: "hidden",
  },

  chartBar: {
    height: "100%",
    borderRadius: radius.md,
  },

  chartValue: {
    fontSize: 14,
    fontWeight: "600",
    width: 50,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
});