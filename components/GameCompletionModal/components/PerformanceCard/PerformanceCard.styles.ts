import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  
  // Performance Circle
  performanceContainer: {
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xs,
  },
  
  progressCircleContainer: {
    position: "relative",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  
  performanceLabel: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: spacing.xs,
  },
  
  performanceValue: {
    fontSize: 24,
    fontWeight: "800",
    position: "absolute",
  },
  
  // Time Stats
  timeStatsContainer: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  
  timeStatItem: {
    marginBottom: spacing.md,
  },
  
  timeStatLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  
  timeStatValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  timeStatValue: {
    fontSize: 22,
    fontWeight: "700",
    fontVariant: ["tabular-nums"], // Monospace für gleichmäßige Zahlen
  },
  
  newRecordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.xs,
  },
  
  improvementText: {
    fontSize: 14,
    fontWeight: "700",
  },
  
  improvementIcon: {
    marginRight: 2,
  },
  
  infinityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  infinitySymbol: {
    fontSize: 22,
    fontWeight: "700",
  },
  
  autoNotesContainer: {
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
  },
  
  autoNotesText: {
    fontSize: 12,
    marginLeft: spacing.xs,
    flex: 1,
  },
});