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
    overflow: "hidden", // Important for glow effects
  },
  
  // Header with title and XP gain badge
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
  
  xpGainBadge: {
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
  
  xpGainText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  
  // Level display with badge
  levelInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  
  levelBadgeWrapper: {
    position: "relative",
    marginRight: spacing.md,
    width: 50,  // Fixed width for proper alignment
    height: 50, // Fixed height for proper alignment
    alignItems: "center",
    justifyContent: "center",
  },
  
  badgeGlow: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -5,
    left: -5, 
  },
  
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  
  levelNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  
  levelNameContainer: {
    flex: 1,
  },
  
  levelName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  
  levelDescription: {
    fontSize: 14,
    fontWeight: "500",
  },
  
  // Progress bar with modern styling
  progressContainer: {
    width: "100%",
    marginTop: spacing.xs,
    position: "relative", // For proper positioning of glow effect
  },
  
  progressBackground: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    position: "relative", // For proper child positioning
  },
  
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  
  // Progress glow effect
  progressGlow: {
    position: "absolute",
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 10,
    zIndex: -1,
  },
  
  // XP gain indicator
  progressGainIndicator: {
    position: "absolute",
    top: 0,
    height: "100%",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
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
  
  xpValues: {
    fontSize: 12,
    fontWeight: "600",
    fontVariant: ["tabular-nums"], // Monospace for even number display
  },
  
  // Level up overlay with improved styling
  levelUpContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: radius.xl,
    zIndex: 10,
  },
  
  levelUpContent: {
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  
  levelUpText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: spacing.md,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  
  newLevelText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: spacing.md,
    textAlign: "center",
  },
});