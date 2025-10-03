import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    overflow: "hidden", // Important for the glow effect containment
  },
  
  // Header with title and record badge
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  
  recordBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.md,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  recordText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  
  // Motivation text - New!
  motivationText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: spacing.sm,
  },
  
  // Current streak counter - New!
  currentStreakContainer: {
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  
  currentStreakValue: {
    fontSize: 32,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  
  currentStreakLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: spacing.xxs,
  },
  
  // Streak Flames visualization
  flamesContainer: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center", 
    alignItems: "center",
    paddingVertical: spacing.md,
    marginVertical: spacing.xs,
  },
  
  // Glow background for flames - New!
  flameGlowContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius.lg,
    opacity: 0.5,
  },
  
  flameIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 150, 0, 0.1)",
  },
  
  // Badge for additional streaks - New!
  streakCountBadge: {
    height: 24,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  
  streakCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  
  // Progress bar
  progressContainer: {
    width: "100%",
    marginTop: spacing.md,
  },
  
  progressBackground: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  
  progressLabelContainer: {
    marginTop: spacing.xs,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  progressLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  
  streakValue: {
    fontSize: 12,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});