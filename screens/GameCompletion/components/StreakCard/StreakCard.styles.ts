import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  
  // Header with title and record badge
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  
  headerTitle: {
    // fontSize set dynamically via theme.typography
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
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    marginLeft: 4,
  },
  
  // Motivation text - New!
  motivationText: {
    // fontSize set dynamically via theme.typography
    fontWeight: "500",
    marginBottom: spacing.sm,
  },
  
  // Current streak counter - New!
  currentStreakContainer: {
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  
  currentStreakValue: {
    // fontSize set dynamically via theme.typography
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  
  currentStreakLabel: {
    // fontSize set dynamically via theme.typography
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
    // fontSize set dynamically via theme.typography
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
    // fontSize set dynamically via theme.typography
    fontWeight: "500",
  },
  
  streakValue: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});