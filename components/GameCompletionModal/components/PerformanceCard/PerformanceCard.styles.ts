import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.lg,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: "hidden",
  },
  
  // Header section
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  
  // Motivational message - new!
  motivationalMessage: {
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: "center", 
  },
  
  // Content layout
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
  
  // Glow effect - new!
  progressGlow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    top: -5,
    left: -5,
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
  
  // Time stat header with icon - new!
  timeStatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  
  timeIcon: {
    marginRight: 6,
  },
  
  timeStatLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  
  timeStatValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  timeStatValue: {
    fontSize: 24,
    fontWeight: "700",
    fontVariant: ["tabular-nums"], // Monospace for even numbers
  },
  
  newRecordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.xs,
  },
  
  // Improvement badge - reworked!
  improvementBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  improvementBadgeText: {
    fontSize: 12,
    color: "white",
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
  
  // Record badge
  recordBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  recordText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 4,
  },
});